export type ProjectTrack = 'ai' | 'swe';

export type ProjectStatus = 'live' | 'private' | 'research' | 'team';

export interface ProjectLink {
  label: string;
  href: string;
  kind: 'live' | 'github' | 'blog' | 'internal';
}

export interface CuratedProject {
  slug: string;
  title: string;
  track: ProjectTrack;
  category: string;
  tagline: string;
  highlights: string[];
  stack: string[];
  status?: ProjectStatus;
  links: ProjectLink[];
  /** Other repo names this project has been published under, used to dedupe admin-added projects. */
  repoAliases?: string[];
  featured?: boolean;
}

const gh = (repo: string, label = 'Code'): ProjectLink => ({
  label,
  href: `https://github.com/Ali6x1000/${repo}`,
  kind: 'github',
});

/** Ordered by relevance to AI/ML roles first, then software engineering roles. */
export const PROJECTS: CuratedProject[] = [
  {
    slug: 'agentic-twin',
    title: 'Agentic Twin',
    track: 'ai',
    category: 'Agentic AI · RAG',
    tagline:
      'A production AI agent with tool access to my resume, repositories, research and coursework, available by text chat or real-time voice.',
    highlights: [
      'Retrieval-augmented generation over 8,300+ chunks in Neon pgvector, with on-function bge-small embeddings so search runs at zero API cost.',
      'Tool-calling agent built with the Vercel AI SDK: Gemini as the primary model with automatic fallback to Groq-hosted open models.',
      'Real-time voice through a LiveKit agent on Gemini Live that calls the same retrieval tools mid-conversation.',
      'Every tool is exposed in the chat as a / command, so visitors can query the knowledge base directly.',
    ],
    stack: ['TypeScript', 'Next.js', 'AI SDK', 'Gemini', 'RAG', 'pgvector', 'Transformers.js', 'LiveKit', 'Python'],
    status: 'live',
    links: [
      { label: 'Try it', href: '/twin', kind: 'internal' },
      gh('Porifolio', 'Web app'),
      gh('Personal-AI', 'Voice agent'),
    ],
  },
  {
    slug: 'safety-oracle',
    title: 'SSRP Safety Oracle',
    track: 'ai',
    category: 'AI Safety · Agent Evaluation',
    tagline:
      'A benchmark that grades autonomous coding agents on safety as well as correctness, built on top of SWE-bench style tasks.',
    highlights: [
      'Passive safety telemetry for DeepSWE agents running on mini-swe-agent: agents run unrestricted while oracles observe silently.',
      'Two orthogonal grades per trial: the functional test result and an independent safety report.',
      'Detects honeytoken leakage, out-of-scope actions, test tampering, integrity violations and deceptive reporting.',
    ],
    stack: ['Python', 'SWE-bench', 'LLM Agents', 'Docker', 'Shell'],
    status: 'private',
    links: [],
    featured: true,
  },
  {
    slug: 'activation-steering',
    title: 'AI-SWE Safety Lab',
    track: 'ai',
    category: 'AI Safety · Interpretability',
    tagline:
      'Activation-steering experiments that locate the "refusal direction" inside open-weight LLMs and inject it at inference time.',
    highlights: [
      'Extracts refusal-vs-compliance directions from hidden states of TinyLlama-1.1B and Qwen2.5-Coder-3B across layers 10–25.',
      'Steers generation with forward hooks and measures over-refusal on harmless coding prompts.',
      'Visualizes how steered prompts move between refusal and compliance clusters with PCA.',
    ],
    stack: ['Python', 'PyTorch', 'Hugging Face', 'Interpretability', 'PCA'],
    status: 'research',
    links: [gh('AI-SWE-Saftey-Lab')],
    featured: true,
  },
  {
    slug: 'cardiovascular-age',
    title: 'Cardiovascular Age from ECG & VCG',
    track: 'ai',
    category: 'Medical AI · Deep Learning',
    tagline:
      'Research at Houston Methodist estimating cardiovascular age from 12-lead ECGs and 3D vectorcardiograms.',
    highlights: [
      'Trained ResNet50 models on MIMIC-IV and PTB-XL to estimate cardiovascular age and structural cardiac health.',
      'Found the VCG-derived age gap to be a stronger ICU mortality biomarker than standard ECG (HR = 1.22, Cox proportional hazards).',
      'Explained predictions with Captum feature attribution, and built CardioVectorLib for ECG-to-VCG reconstruction.',
    ],
    stack: ['Python', 'PyTorch', 'ResNet', 'Captum', 'Survival Analysis', 'Signal Processing'],
    status: 'research',
    links: [gh('ECG-VECG')],
    featured: true,
  },
  {
    slug: 'electrovector',
    title: 'ElectroVector',
    track: 'ai',
    category: 'Medical AI · Mobile ML',
    tagline: 'An iOS app that digitizes photographed 12-lead ECG scans and converts them into vectorcardiograms.',
    highlights: [
      'Captures ECG printouts with the camera and digitizes the waveforms with ML models served from a Flask backend.',
      'Transforms digitized signals into 3D vectorcardiogram representations for cardiac analysis.',
    ],
    stack: ['Swift', 'SwiftUI', 'Python', 'PyTorch', 'Flask', 'AWS'],
    links: [gh('ElectroVector')],
  },
  {
    slug: 'medical-labeler',
    title: 'AI Medical Labeler',
    track: 'ai',
    category: 'Computer Vision · Healthcare',
    tagline: 'SAM2-powered pre-labeling for Label Studio that makes medical image annotation faster and cheaper.',
    highlights: [
      'Cut manual image annotation time by 60% by pre-labeling images with a Medical SAM2 backend.',
      'Click-prompted interactive segmentation, with full-image auto-segmentation when no prompts are given.',
      'Fully Dockerized so clinics and labs can deploy it without ML expertise.',
    ],
    stack: ['Python', 'PyTorch', 'SAM2', 'Label Studio', 'Docker'],
    links: [gh('Medical-Smart-Labeler--via-label-studio-')],
    repoAliases: ['Smart-Labeler--via-label-studio-'],
  },
  {
    slug: 'medbay',
    title: 'MedAnnotate',
    track: 'ai',
    category: 'Computer Vision · Full Stack',
    tagline: 'A locally hosted annotation platform for healthcare teams with SAM2 and SAM3 assisted labeling.',
    highlights: [
      'FastAPI backend with JWT auth, projects and multipart dataset uploads; React and TypeScript annotation UI.',
      'Optional local SAM2/SAM3 service for point- and text-prompted pre-labeling, so patient data never leaves the machine.',
    ],
    stack: ['Python', 'FastAPI', 'React', 'TypeScript', 'SAM2', 'SAM3'],
    links: [gh('Med_Bay')],
  },
  {
    slug: 'diffusion-models',
    title: 'Diffusion Models as Markov Chains',
    track: 'ai',
    category: 'Generative Models · Research',
    tagline: 'Denoising diffusion models built from scratch, studied through the lens of Markov chains and stochastic processes.',
    highlights: [
      'Implements forward noising and learned reverse processes for 1D and 2D distributions.',
      'Verifies reconstructions statistically and with interactive step-by-step visualizations.',
    ],
    stack: ['Python', 'PyTorch', 'Diffusion', 'Probability'],
    status: 'research',
    links: [gh('DDPM_Markov_Chains')],
  },
  {
    slug: 'bayesian-vae',
    title: 'Bayesian Variational Autoencoder',
    track: 'ai',
    category: 'Generative Models',
    tagline: 'A Bayesian VAE that models uncertainty in both latent variables and network weights.',
    highlights: [
      'Encodes inputs as distributions regularized toward a Gaussian prior, with Bayesian priors on the weights.',
      'Trained and evaluated on MNIST with reconstruction and latent-space visualizations.',
    ],
    stack: ['Python', 'PyTorch', 'VAE', 'Bayesian Inference'],
    links: [gh('Varitaional-autoencoders')],
  },
  {
    slug: 'issue-safety-classifier',
    title: 'Agent Issue Safety Classifier',
    track: 'ai',
    category: 'NLP · AI Safety',
    tagline: 'Classifies and clusters GitHub issues from AI coding tools to surface safety failures.',
    highlights: [
      'Regex taxonomy for privacy leaks, destructive actions, crashes, hangs and resource exhaustion.',
      'Unsupervised TF-IDF + K-Means clustering, compared against an LLM-based classifier.',
    ],
    stack: ['Python', 'scikit-learn', 'NLP', 'LLMs'],
    links: [gh('NLP_regex_safe_vs_unsafe')],
  },
  {
    slug: 'em-algorithm',
    title: 'Expectation-Maximization from Scratch',
    track: 'ai',
    category: 'Statistical ML',
    tagline: 'Educational implementations of EM for latent-variable models, with an accompanying blog post.',
    highlights: ['Covers the classic two-coin problem and Gaussian mixture model clustering.'],
    stack: ['Python', 'NumPy', 'Gaussian Mixtures'],
    links: [
      gh('EM'),
      {
        label: 'Blog post',
        href: '/blog/uncovering-hidden-clusters-a-hands-on-guide-to-the-em-algorithm-for-gaussian-mixture-models',
        kind: 'blog',
      },
    ],
  },
  {
    slug: 'dispatch',
    title: 'Dispatch',
    track: 'swe',
    category: 'Agent Infrastructure',
    tagline: 'Manage local coding agents (Claude Code, Cursor) from a phone call or a web dashboard.',
    highlights: [
      'Voice commands flow through Twilio into an orchestrator that runs them on your machine via a local helper daemon.',
      'Streams stdout and stderr back to a dashboard with per-project history, secured with Supabase JWTs and scoped agent tokens.',
    ],
    stack: ['TypeScript', 'Next.js', 'FastAPI', 'Supabase', 'Tauri', 'Twilio'],
    status: 'team',
    links: [gh('dispatch')],
  },
  {
    slug: 'portfolio',
    title: 'This Portfolio',
    track: 'swe',
    category: 'Full Stack',
    tagline: 'The site you are on: a Next.js app with a blog, a headless CMS on Vercel Blob, and the Agentic Twin.',
    highlights: [
      'Password-protected admin panel for editing posts, projects and the about page.',
      'Serverless API routes, including the RAG chat, voice token and knowledge-base endpoints.',
    ],
    stack: ['TypeScript', 'Next.js', 'React', 'Tailwind', 'Vercel'],
    links: [gh('Porifolio')],
  },
  {
    slug: 'clinic',
    title: 'Clinic Management System',
    track: 'swe',
    category: 'Full Stack',
    tagline: 'A clinic dashboard for patient check-in, scheduling and custom medical forms.',
    highlights: ['Dynamic form builder, appointment scheduling and patient profiles on a Flask API with Firebase auth.'],
    stack: ['JavaScript', 'React', 'Material UI', 'Flask', 'Firebase'],
    links: [gh('Clinic')],
  },
  {
    slug: 'metadata-sharing',
    title: 'Genetic Metadata Sharing Platform',
    track: 'swe',
    category: 'Full Stack',
    tagline: 'A secure platform for researchers to share and analyze patient genetic metadata.',
    highlights: ['Authenticated uploads and configurable processing such as genetic similarity analysis.'],
    stack: ['JavaScript', 'React', 'Node.js'],
    status: 'team',
    links: [gh('Collaborative-Study-Web-Application')],
  },
];

export const TRACKS: Record<ProjectTrack, { title: string; blurb: string }> = {
  ai: {
    title: 'AI & Machine Learning',
    blurb: 'Agents, AI safety, medical deep learning and generative models.',
  },
  swe: {
    title: 'Software Engineering',
    blurb: 'Full-stack products and developer infrastructure.',
  },
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: 'Live',
  private: 'Private research',
  research: 'Research',
  team: 'Team project',
};

export function projectHref(slug: string) {
  return `/projects#${slug}`;
}

export function usesSkill(project: CuratedProject, skill: string) {
  const needle = skill.toLowerCase();
  return project.stack.some((tech) => tech.toLowerCase() === needle);
}

export function projectsWithSkill(skill: string) {
  return PROJECTS.filter((project) => usesSkill(project, skill));
}

export function getProject(slug: string) {
  return PROJECTS.find((project) => project.slug === slug);
}

export function repoName(url: string | null | undefined) {
  const match = url?.match(/github\.com\/[^/]+\/([^/?#]+)/i);
  return match ? match[1].toLowerCase() : null;
}

export function curatedRepoNames() {
  const names = new Set<string>();
  for (const project of PROJECTS) {
    for (const link of project.links) {
      const name = repoName(link.href);
      if (name) names.add(name);
    }
    project.repoAliases?.forEach((alias) => names.add(alias.toLowerCase()));
  }
  return names;
}
