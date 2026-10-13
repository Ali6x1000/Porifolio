import { list } from '@vercel/blob';
import { getSql, isKnowledgeBaseConfigured } from './alijr/db';
import { PROJECTS } from './projects';
import { ROLES, type Role } from './about';

const GITHUB_USER = 'Ali6x1000';
const HOUR = 3600;

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface LiveStats {
  github: { contributions: number; publicRepos: number | null; days: ContributionDay[] } | null;
  knowledge: { chunks: number; documents: number } | null;
  experience: { industryMonths: number; researchMonths: number; organizations: number };
  projects: { total: number; ai: number };
  blogPosts: number | null;
  generatedAt: string;
}

async function getGithub(): Promise<LiveStats['github']> {
  try {
    const [contribRes, userRes] = await Promise.all([
      fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, { next: { revalidate: HOUR } }),
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: HOUR },
      }),
    ]);
    if (!contribRes.ok) return null;
    const contrib = (await contribRes.json()) as { total: { lastYear: number }; contributions: ContributionDay[] };
    const user = userRes.ok ? ((await userRes.json()) as { public_repos?: number }) : null;
    return {
      contributions: contrib.total.lastYear,
      publicRepos: user?.public_repos ?? null,
      days: contrib.contributions,
    };
  } catch (error) {
    console.error('[about stats] github', error);
    return null;
  }
}

async function getKnowledge(): Promise<LiveStats['knowledge']> {
  if (!isKnowledgeBaseConfigured()) return null;
  try {
    const rows = (await getSql()`
      select count(*)::int as chunks, count(distinct source_path)::int as documents from alijr_chunks
    `) as { chunks: number; documents: number }[];
    return rows[0] ?? null;
  } catch (error) {
    console.error('[about stats] knowledge', error);
    return null;
  }
}

async function getBlogPostCount(): Promise<number | null> {
  try {
    const { blobs } = await list({ prefix: 'posts/' });
    return blobs.length;
  } catch (error) {
    console.error('[about stats] posts', error);
    return null;
  }
}

function monthIndex(isoMonth: string) {
  const [year, month] = isoMonth.split('-').map(Number);
  return year * 12 + (month - 1);
}

/** Distinct calendar months covered by the given roles, counting ongoing roles up to now. */
function coveredMonths(roles: Role[], now: Date) {
  const current = now.getUTCFullYear() * 12 + now.getUTCMonth();
  const months = new Set<number>();
  for (const role of roles) {
    const end = Math.min(role.end ? monthIndex(role.end) : current, current);
    for (let m = monthIndex(role.start); m <= end; m++) months.add(m);
  }
  return months.size;
}

export async function getLiveStats(): Promise<LiveStats> {
  const now = new Date();
  const [github, knowledge, blogPosts] = await Promise.all([getGithub(), getKnowledge(), getBlogPostCount()]);
  return {
    github,
    knowledge,
    experience: {
      industryMonths: coveredMonths(ROLES.filter((r) => r.kind === 'industry'), now),
      researchMonths: coveredMonths(ROLES.filter((r) => r.kind === 'research'), now),
      organizations: new Set(ROLES.map((r) => r.org)).size,
    },
    projects: { total: PROJECTS.length, ai: PROJECTS.filter((p) => p.track === 'ai').length },
    blogPosts,
    generatedAt: now.toISOString(),
  };
}
