export const ALIJR_CHAT_MODEL = process.env.ALIJR_CHAT_MODEL || 'gemini-flash-latest';
// Bundled under models/ and shared with scripts/alijr/migrate.mjs; changing it requires re-running the migration.
export const ALIJR_EMBED_MODEL = 'Xenova/bge-small-en-v1.5';
// Must match the vector(N) column in scripts/alijr/schema.sql.
export const ALIJR_EMBED_DIMENSIONS = 384;

export const FOLDER_CATEGORIES = [
  'projects',
  'research',
  'course_lectures',
  'submissions',
  'all',
] as const;

export type FolderCategory = (typeof FOLDER_CATEGORIES)[number];

export const CONTACT = {
  email: 'aan90@case.edu',
  phone: '+1 (216) 647-4302',
  linkedin: 'linkedin.com/in/alinawaf',
  github: 'github.com/Ali6x1000',
  website: 'alinawaf.com',
};
