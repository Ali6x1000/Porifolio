export const ALIJR_CHAT_MODEL = process.env.ALIJR_CHAT_MODEL || 'gemini-flash-latest';
// Separate capacity pool on the same Gemini key; used when the primary is overloaded.
export const ALIJR_FALLBACK_CHAT_MODEL = process.env.ALIJR_FALLBACK_CHAT_MODEL || 'gemini-flash-lite-latest';
// Free tier on Groq (needs GROQ_API_KEY); last resort when Gemini is unavailable.
export const ALIJR_GROQ_MODEL = process.env.ALIJR_GROQ_MODEL || 'openai/gpt-oss-120b';
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
