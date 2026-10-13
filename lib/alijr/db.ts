import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let client: NeonQueryFunction<false, false> | null = null;

function databaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.DB_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DB_POSTGRES_URL
  );
}

export function getSql() {
  if (client) return client;
  const url = databaseUrl();
  if (!url) {
    throw new Error('DATABASE_URL is not set. Connect a Neon database to this Vercel project.');
  }
  client = neon(url);
  return client;
}

export function isKnowledgeBaseConfigured() {
  return Boolean(databaseUrl());
}
