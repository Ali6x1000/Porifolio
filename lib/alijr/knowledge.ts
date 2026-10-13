import { type FolderCategory } from './config';
import { getSql, isKnowledgeBaseConfigured } from './db';
import { embedQuery } from './embedder';
import { FALLBACK_PROFILE } from './prompt';

export type KnowledgeHit = {
  source: string;
  label: string;
  folder: string;
  project: string | null;
  page: string | null;
  score: number;
  excerpt: string;
};

export type KnowledgeSearchResult = {
  query: string;
  scope: FolderCategory;
  project: string | null;
  results: KnowledgeHit[];
  notes: string[];
};

type ChunkRow = {
  id: string;
  content: string;
  folder_category: string;
  project_root: string | null;
  source_path: string;
  page_label: string | null;
  score: number;
};

const MAX_SNIPPETS = 6;
const MAX_PROJECT_SOURCES = 4;
const MAX_PROJECT_CHARS_PER_SOURCE = 6000;
const MAX_SNIPPET_CHARS = 1400;
const PROJECT_CACHE_MS = 10 * 60 * 1000;

let projectCache: { at: number; projects: string[] } | null = null;

export async function readResume(): Promise<string> {
  if (!isKnowledgeBaseConfigured()) return FALLBACK_PROFILE;
  const rows = (await getSql().query(
    `select content from alijr_documents where key = 'resume' limit 1`,
  )) as { content: string }[];
  return rows[0]?.content || FALLBACK_PROFILE;
}

export async function listProjects(): Promise<string[]> {
  if (!isKnowledgeBaseConfigured()) return [];
  if (projectCache && Date.now() - projectCache.at < PROJECT_CACHE_MS) {
    return projectCache.projects;
  }
  const rows = (await getSql().query(
    `select distinct project_root from alijr_chunks
     where folder_category = 'projects' and project_root is not null
     order by project_root`,
  )) as { project_root: string }[];
  const projects = rows.map((r) => r.project_root);
  projectCache = { at: Date.now(), projects };
  return projects;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function resolveProject(input: string, projects: string[]): string | null {
  const wanted = normalize(input);
  if (!wanted) return null;
  const exact = projects.find((p) => normalize(p) === wanted);
  if (exact) return exact;
  const partial = projects.filter(
    (p) => normalize(p).includes(wanted) || wanted.includes(normalize(p)),
  );
  return partial.length === 1 ? partial[0] : null;
}

export function sourceLabel(sourcePath: string): string {
  const parts = sourcePath.split('/').filter(Boolean);
  const file = parts[parts.length - 1] ?? sourcePath;
  const context = parts.length > 2 ? parts[1] : parts[0];
  return context && context !== file ? `${context} · ${file}` : file;
}

function cleanExcerpt(text: string, maxChars: number): string {
  let t = text
    .replace(/\r\n?/g, '\n')
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
  if (t.length <= maxChars) return t;
  t = t.slice(0, maxChars);
  const cut = Math.max(t.lastIndexOf('. '), t.lastIndexOf('\n'));
  return (cut > maxChars / 3 ? t.slice(0, cut + 1) : t).trim() + ' …';
}

function alphabeticRatio(text: string): number {
  if (!text) return 0;
  let letters = 0;
  for (const c of text) if (/[a-zA-Z]/.test(c)) letters++;
  return letters / text.length;
}

async function vectorSearch(
  embedding: number[],
  folder: FolderCategory,
  project: string | null,
  limit: number,
): Promise<ChunkRow[]> {
  return (await getSql().query(
    `select id, content, folder_category, project_root, source_path, page_label,
            1 - (embedding <=> $1::vector) as score
     from alijr_chunks
     where ($2::text is null or folder_category = $2)
       and ($3::text is null or project_root = $3)
     order by embedding <=> $1::vector
     limit $4`,
    [JSON.stringify(embedding), folder === 'all' ? null : folder, project, limit],
  )) as ChunkRow[];
}

function toHit(row: ChunkRow, excerpt: string): KnowledgeHit {
  return {
    source: row.source_path,
    label: sourceLabel(row.source_path),
    folder: row.folder_category,
    project: row.project_root,
    page: row.page_label,
    score: Math.round(Number(row.score) * 1000) / 1000,
    excerpt,
  };
}

function mergeBySource(rows: ChunkRow[]): KnowledgeHit[] {
  const groups = new Map<string, ChunkRow[]>();
  for (const row of rows) {
    const list = groups.get(row.source_path) ?? [];
    list.push(row);
    groups.set(row.source_path, list);
  }
  return Array.from(groups.values())
    .slice(0, MAX_PROJECT_SOURCES)
    .map((chunks) => {
      const seen = new Set<string>();
      const body = chunks
        .map((c) => c.content.trim())
        .filter((c) => c && !seen.has(c) && seen.add(c))
        .join('\n\n');
      return toHit(chunks[0], cleanExcerpt(body, MAX_PROJECT_CHARS_PER_SOURCE));
    });
}

export async function searchKnowledge(args: {
  query: string;
  folderCategory: FolderCategory;
  projectFolder?: string | null;
}): Promise<KnowledgeSearchResult> {
  const { query, folderCategory } = args;
  const notes: string[] = [];

  if (!isKnowledgeBaseConfigured()) {
    return {
      query,
      scope: folderCategory,
      project: null,
      results: [],
      notes: ['The knowledge base is not connected yet. Answer from the resume instead.'],
    };
  }

  let project: string | null = null;
  if (folderCategory === 'projects' && args.projectFolder?.trim()) {
    project = resolveProject(args.projectFolder, await listProjects());
    if (!project) {
      notes.push(
        `No project folder matches "${args.projectFolder}"; searched all projects instead.`,
      );
    }
  }

  const embedding = await embedQuery(query);
  const isProjects = folderCategory === 'projects';
  let rows = await vectorSearch(embedding, folderCategory, project, isProjects ? 24 : 16);

  if (rows.length === 0 && project) {
    notes.push(`Nothing indexed under ${project}; searched all projects instead.`);
    project = null;
    rows = await vectorSearch(embedding, folderCategory, null, 24);
  }

  let results: KnowledgeHit[];
  if (isProjects) {
    results = mergeBySource(rows);
  } else {
    const readable = rows.filter(
      (r) => r.content.trim().length <= 100 || alphabeticRatio(r.content) >= 0.18,
    );
    results = (readable.length ? readable : rows)
      .slice(0, MAX_SNIPPETS)
      .map((r) => toHit(r, cleanExcerpt(r.content, MAX_SNIPPET_CHARS)));
  }

  if (results.length === 0) notes.push('No matching passages were found.');

  return { query, scope: folderCategory, project, results, notes };
}

export function formatSearchForVoice(result: KnowledgeSearchResult): string {
  if (result.results.length === 0) {
    return `No passages found. ${result.notes.join(' ')}`.trim();
  }
  const header = [
    `Scope: ${result.scope}${result.project ? `, project ${result.project}` : ''}.`,
    ...result.notes,
  ].join(' ');
  const body = result.results
    .map((r, i) => `[${i + 1}] ${r.label} (relevance ${r.score})\n${r.excerpt}`)
    .join('\n\n---\n\n');
  return `${header}\n\n${body}`;
}
