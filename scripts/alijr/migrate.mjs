#!/usr/bin/env node
// Re-embeds the AliJR Chroma knowledge base locally (bge-small-en-v1.5 via Transformers.js)
// and loads it into Neon (pgvector). The model is cached in models/, which the site bundles
// so the deployed functions embed queries with the exact same weights.
//
// Usage:
//   node --env-file=.env.local scripts/alijr/migrate.mjs \
//     --chroma "/path/to/chroma_db/chroma.sqlite3" \
//     --kb "/path/to/alijr_knowledge_base"
//
// Env: DATABASE_URL
// Optional: ALIJR_EMBED_BATCH (texts per forward pass, default 32), --limit N, --dry-run
// Safe to re-run: chunks already in the database are skipped. If the table was built for a
// different vector size it is dropped and rebuilt.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { DatabaseSync } from 'node:sqlite';
import { neon } from '@neondatabase/serverless';
import { pipeline, env } from '@huggingface/transformers';

// Keep in sync with lib/alijr/config.ts.
const EMBED_MODEL = 'Xenova/bge-small-en-v1.5';
const DIMENSIONS = 384;
const BATCH = Number(process.env.ALIJR_EMBED_BATCH || 32);
const KB_MARKER = 'alijr_knowledge_base/';
const MODELS_DIR = fileURLToPath(new URL('../../models/', import.meta.url));

const { values: args } = parseArgs({
  options: {
    chroma: { type: 'string' },
    kb: { type: 'string' },
    limit: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});

if (!args.chroma || !existsSync(args.chroma)) {
  console.error('Pass --chroma pointing at chroma_db/chroma.sqlite3');
  process.exit(1);
}
const dbUrl = [
  process.env.DATABASE_URL,
  process.env.DB_DATABASE_URL,
  process.env.POSTGRES_URL,
  process.env.DB_POSTGRES_URL,
].find((v) => v && v !== '[SENSITIVE]');
if (!args['dry-run'] && !dbUrl) {
  console.error('DATABASE_URL is not set (run with --env-file=.env.local).');
  process.exit(1);
}
function toSourcePath(filePath) {
  const i = filePath.indexOf(KB_MARKER);
  return i >= 0 ? filePath.slice(i + KB_MARKER.length) : filePath.split('/').slice(-3).join('/');
}

function sourceLabel(sourcePath) {
  const parts = sourcePath.split('/').filter(Boolean);
  const file = parts[parts.length - 1] ?? sourcePath;
  const context = parts.length > 2 ? parts[1] : parts[0];
  return context && context !== file ? `${context} · ${file}` : file;
}

function readChunks(chromaPath) {
  const db = new DatabaseSync(chromaPath, { readOnly: true });
  const rows = db
    .prepare(
      `select e.embedding_id as id,
              max(case when m.key = 'chroma:document' then m.string_value end) as content,
              max(case when m.key = 'folder_category' then m.string_value end) as folder,
              max(case when m.key = 'file_path' then m.string_value end) as file_path,
              max(case when m.key = 'page_label' then m.string_value end) as page_label
       from embeddings e
       join embedding_metadata m on m.id = e.id
       group by e.id`,
    )
    .all();
  db.close();

  return rows
    .filter((r) => r.content?.trim() && r.folder && r.folder !== 'resume' && r.file_path)
    .map((r) => {
      const sourcePath = toSourcePath(r.file_path);
      const segments = sourcePath.split('/');
      return {
        id: r.id,
        content: r.content.trim(),
        folder: r.folder,
        projectRoot: r.folder === 'projects' && segments.length > 2 ? segments[1] : null,
        sourcePath,
        pageLabel: r.page_label ?? null,
      };
    });
}

async function loadEmbedder() {
  env.cacheDir = MODELS_DIR;
  const extract = await pipeline('feature-extraction', EMBED_MODEL, { dtype: 'q8' });
  return async (texts) => {
    const output = await extract(texts, { pooling: 'cls', normalize: true });
    return output.tolist();
  };
}

async function main() {
  const sql = args['dry-run'] ? null : neon(dbUrl);

  if (sql) {
    const [column] = await sql.query(
      `select a.atttypmod as dims from pg_attribute a
       where a.attrelid = to_regclass('alijr_chunks') and a.attname = 'embedding'`,
    );
    if (column && Number(column.dims) !== DIMENSIONS) {
      console.log(`Rebuilding alijr_chunks: vector(${column.dims}) -> vector(${DIMENSIONS}).`);
      await sql.query('drop table alijr_chunks');
    }
    const schema = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
    for (const statement of schema.split(';').map((s) => s.trim()).filter(Boolean)) {
      await sql.query(statement);
    }
    console.log('Schema ready.');
  }

  if (args.kb) {
    const resumePath = join(args.kb, 'resume', 'resume.md');
    if (existsSync(resumePath) && sql) {
      await sql.query(
        `insert into alijr_documents (key, content) values ('resume', $1)
         on conflict (key) do update set content = excluded.content, updated_at = now()`,
        [readFileSync(resumePath, 'utf8').trim()],
      );
      console.log('Resume uploaded.');
    }
  }

  let chunks = readChunks(args.chroma);
  console.log(`Read ${chunks.length} chunks from Chroma.`);

  if (sql) {
    const existing = new Set(
      (await sql.query('select id from alijr_chunks')).map((r) => r.id),
    );
    chunks = chunks.filter((c) => !existing.has(c.id));
    console.log(`${existing.size} already migrated, ${chunks.length} to go.`);
  }
  if (args.limit) chunks = chunks.slice(0, Number(args.limit));

  const embed = await loadEmbedder();
  console.log(`Embedding model ready (${EMBED_MODEL}).`);

  if (args['dry-run']) {
    const [vector] = await embed(['dry run']);
    console.log(`Embedding dimensions: ${vector.length}`);
    const byFolder = {};
    for (const c of chunks) byFolder[c.folder] = (byFolder[c.folder] ?? 0) + 1;
    const projects = [...new Set(chunks.map((c) => c.projectRoot).filter(Boolean))];
    console.log({ byFolder, projects, sample: chunks[0] && { ...chunks[0], content: chunks[0].content.slice(0, 120) } });
    return;
  }

  const started = Date.now();
  let done = 0;

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH);
    // A short source header gives each chunk context the raw text often lacks.
    // The model truncates at 512 tokens, so anything past ~2k characters is ignored anyway.
    const texts = batch.map((c) => `Source: ${sourceLabel(c.sourcePath)}\n\n${c.content}`.slice(0, 4000));
    const embeddings = await embed(texts);

    const params = [];
    const tuples = batch.map((c, j) => {
      const o = j * 7;
      params.push(
        c.id,
        c.content,
        c.folder,
        c.projectRoot,
        c.sourcePath,
        c.pageLabel,
        JSON.stringify(embeddings[j]),
      );
      return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, $${o + 5}, $${o + 6}, $${o + 7}::vector)`;
    });
    await sql.query(
      `insert into alijr_chunks (id, content, folder_category, project_root, source_path, page_label, embedding)
       values ${tuples.join(', ')}
       on conflict (id) do nothing`,
      params,
    );

    done += batch.length;
    const rate = done / ((Date.now() - started) / 1000);
    process.stdout.write(`\r  ${done}/${chunks.length} chunks embedded (${rate.toFixed(1)}/s)`);
  }

  console.log('\nMigration complete.');
}

main().catch((error) => {
  console.error('\nMigration failed:', error);
  process.exit(1);
});
