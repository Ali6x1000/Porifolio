import { list } from '@vercel/blob';

export interface AboutData {
  profileImage: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  bio: {
    introduction: string;
    background: string;
    interests: string;
    goals: string;
  };
  stats: {
    label: string;
    value: string;
  }[];
  personalFacts: string[];
}

export const ABOUT_BLOB_KEY = 'about.json';
export const ABOUT_CACHE_TAG = 'about';

export const DEFAULT_ABOUT: AboutData = {
  profileImage: '/placeholder-avatar.jpg',
  name: 'Ali Nawaf',
  title: 'Computer Science Student & Developer',
  location: 'Cleveland, OH',
  email: 'aan90@case.edu',
  phone: '+1 (216) 647-4302',
  bio: {
    introduction:
      "Hello! I'm Ali, Senior at Case Western Reserve University in the BS/MS program. My thesis is in Machine Learning.",
    background:
      'I have experience in SWE, ML, Computer Vision and I am trying to expand into more fields like Privacy and biotech',
    interests: "When I'm not coding, I enjoy exploring nature, going on hikes, doing sports or socializing in cafes.",
    goals: 'My goal is to leverage technology to create meaningful impact in the world',
  },
  stats: [],
  personalFacts: [
    'I went to India for high school (UWC Scholar)',
    'I was a biochem pre med major still passionate for medicine and health',
    'I love coffee chats',
    'I am Bilingual Arabic + English',
  ],
};

export async function getAboutData(): Promise<AboutData | null> {
  try {
    const { blobs } = await list({ prefix: ABOUT_BLOB_KEY });
    if (blobs.length === 0) return null;
    const response = await fetch(blobs[0].url, { next: { revalidate: 600, tags: [ABOUT_CACHE_TAG] } });
    return (await response.json()) as AboutData;
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
}

export interface Role {
  org: string;
  title: string;
  kind: 'industry' | 'research';
  /** ISO month, e.g. "2024-12". */
  start: string;
  /** ISO month, or null while ongoing. */
  end: string | null;
  summary: string;
}

export const ROLES: Role[] = [
  {
    org: 'Heads-up Hockey',
    title: 'AI & SWE Intern',
    kind: 'industry',
    start: '2024-12',
    end: '2025-08',
    summary: 'Shipped on-device AI in a SwiftUI game that doubled active users; automated annotation with SAM2.',
  },
  {
    org: 'Eaton',
    title: 'AI Engineering Intern',
    kind: 'industry',
    start: '2025-01',
    end: '2025-05',
    summary: 'Built an Azure pipeline for 10,000 monthly Salesforce records and an agentic RAG chatbot.',
  },
  {
    org: 'Houston Methodist Hospital',
    title: 'ML Research Assistant',
    kind: 'research',
    start: '2025-08',
    end: '2026-05',
    summary: 'Estimated cardiovascular age from ECG and VCG; found a new ICU mortality biomarker (HR = 1.22).',
  },
  {
    org: 'Trek Health',
    title: 'AI Engineering Intern',
    kind: 'industry',
    start: '2025-12',
    end: '2026-08',
    summary: 'Built a LangGraph orchestrator in Snowflake and raised RAG recall from 50% to 94%.',
  },
];

export const GRADUATION = { label: 'May 2027', date: '2027-05-15' };
