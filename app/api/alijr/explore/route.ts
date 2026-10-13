import { z } from 'zod';
import { FOLDER_CATEGORIES } from '../../../../lib/alijr/config';
import { listProjects, readResume, searchKnowledge } from '../../../../lib/alijr/knowledge';

// Public, read-only access to the twin's tools for the chat's slash commands (no LLM involved).
export const maxDuration = 30;

const requestSchema = z.discriminatedUnion('tool', [
  z.object({ tool: z.literal('readResume') }),
  z.object({ tool: z.literal('listProjects') }),
  z.object({
    tool: z.literal('searchKnowledge'),
    query: z.string().trim().min(1).max(300),
    folderCategory: z.enum(FOLDER_CATEGORIES),
    projectFolder: z.string().trim().max(120).optional(),
  }),
]);

export async function POST(req: Request) {
  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: 'Invalid command.' }, { status: 400 });
  }

  const body = parsed.data;
  try {
    switch (body.tool) {
      case 'readResume':
        return Response.json({ resume: await readResume() });
      case 'listProjects':
        return Response.json({ projects: await listProjects() });
      case 'searchKnowledge':
        return Response.json({
          search: await searchKnowledge({
            query: body.query,
            folderCategory: body.folderCategory,
            projectFolder: body.projectFolder,
          }),
        });
    }
  } catch (error) {
    console.error('[alijr explore]', error);
    return Response.json({ error: 'The knowledge base is unavailable right now.' }, { status: 500 });
  }
}
