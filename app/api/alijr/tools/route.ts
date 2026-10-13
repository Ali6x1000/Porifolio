import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { FOLDER_CATEGORIES, type FolderCategory } from '../../../../lib/alijr/config';
import {
  formatSearchForVoice,
  listProjects,
  readResume,
  searchKnowledge,
} from '../../../../lib/alijr/knowledge';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function authorized(req: Request): boolean {
  const secret = process.env.ALIJR_AGENT_SECRET;
  const header = req.headers.get('authorization') ?? '';
  if (!secret || !header.startsWith('Bearer ')) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tool, args = {} } = (await req.json()) as {
    tool: string;
    args?: Record<string, unknown>;
  };

  try {
    switch (tool) {
      case 'readResume':
        return NextResponse.json({ result: await readResume() });
      case 'listProjects': {
        const projects = await listProjects();
        return NextResponse.json({
          result: projects.length
            ? `Project folders: ${projects.join(', ')}`
            : 'No project folders are indexed.',
        });
      }
      case 'searchKnowledge': {
        const folder = FOLDER_CATEGORIES.includes(args.folderCategory as FolderCategory)
          ? (args.folderCategory as FolderCategory)
          : 'all';
        const result = await searchKnowledge({
          query: String(args.query ?? ''),
          folderCategory: folder,
          projectFolder: args.projectFolder ? String(args.projectFolder) : null,
        });
        return NextResponse.json({ result: formatSearchForVoice(result) });
      }
      default:
        return NextResponse.json({ error: `Unknown tool ${tool}` }, { status: 400 });
    }
  } catch (error) {
    console.error('[alijr tools]', error);
    return NextResponse.json({ error: 'Tool failed' }, { status: 500 });
  }
}
