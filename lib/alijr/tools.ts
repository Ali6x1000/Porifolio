import { tool } from 'ai';
import { z } from 'zod';
import { FOLDER_CATEGORIES } from './config';
import { listProjects, readResume, searchKnowledge } from './knowledge';

export const alijrTools = {
  readResume: tool({
    description:
      "Load Ali's full resume (education, experience, skills, contact). Use for any CV or background question.",
    inputSchema: z.object({}),
    execute: async () => ({ resume: await readResume() }),
  }),
  listProjects: tool({
    description:
      'List the top-level project folders in the knowledge base. Use before searching projects when the repo name is unclear.',
    inputSchema: z.object({}),
    execute: async () => ({ projects: await listProjects() }),
  }),
  searchKnowledge: tool({
    description:
      "Semantic search over Ali's knowledge base: project READMEs, research, course lectures and submissions.",
    inputSchema: z.object({
      query: z.string().describe('A focused search query, rephrased for retrieval.'),
      folderCategory: z
        .enum(FOLDER_CATEGORIES)
        .describe('Which part of the knowledge base to search.'),
      projectFolder: z
        .string()
        .optional()
        .describe('Exact project folder from listProjects, when folderCategory is "projects".'),
    }),
    execute: async (input) => searchKnowledge(input),
  }),
};
