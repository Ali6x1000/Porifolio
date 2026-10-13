export type SkillIcon = 'agents' | 'safety' | 'deep-learning' | 'math' | 'infra' | 'code';

export interface SkillGroup {
  id: string;
  title: string;
  icon: SkillIcon;
  summary: string;
  skills: string[];
  /** A concrete result backing the claim, linked to where it is documented. */
  proof?: { text: string; href: string };
  projects: string[];
  /** Grid columns spanned on large screens. */
  span: 1 | 2 | 3;
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: 'agents',
    title: 'LLMs, RAG & Agents',
    icon: 'agents',
    summary: 'Production retrieval pipelines, tool-calling agents and real-time voice agents.',
    skills: ['RAG', 'LLM Agents', 'LangGraph', 'LlamaIndex', 'AI SDK', 'LiveKit', 'pgvector', 'Snowflake Cortex'],
    proof: { text: 'Raised RAG recall from 50% to 94% at Trek Health', href: '/resume' },
    projects: ['agentic-twin', 'dispatch', 'safety-oracle'],
    span: 2,
  },
  {
    id: 'safety',
    title: 'AI Safety & Interpretability',
    icon: 'safety',
    summary: 'Evaluating agent behavior and probing model internals.',
    skills: ['Interpretability', 'Activation steering', 'Agent evals', 'Captum', 'PCA'],
    projects: ['safety-oracle', 'activation-steering', 'issue-safety-classifier'],
    span: 1,
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning & Vision',
    icon: 'deep-learning',
    summary: 'Training and deploying models for medical imaging and signals.',
    skills: ['PyTorch', 'TensorFlow', 'ResNet', 'SAM2', 'Diffusion', 'VAE', 'Core ML'],
    proof: { text: 'Found a new ICU mortality biomarker (HR = 1.22) at Houston Methodist', href: '/resume' },
    projects: ['cardiovascular-age', 'medical-labeler', 'diffusion-models'],
    span: 1,
  },
  {
    id: 'math',
    title: 'Statistics & Math',
    icon: 'math',
    summary: 'The theory behind the models: a secondary major in mathematics.',
    skills: ['Probability', 'Stochastic calculus', 'Linear algebra', 'Survival Analysis', 'scikit-learn', 'NumPy'],
    projects: ['em-algorithm', 'diffusion-models', 'bayesian-vae'],
    span: 1,
  },
  {
    id: 'infra',
    title: 'MLOps & Cloud',
    icon: 'infra',
    summary: 'Shipping models and data pipelines to real users.',
    skills: ['Docker', 'AWS', 'Azure', 'Kubernetes', 'SLURM / HPC', 'FastAPI', 'Linux'],
    proof: { text: 'Automated an Azure pipeline for 10,000 records a month at Eaton', href: '/resume' },
    projects: ['medical-labeler', 'medbay', 'agentic-twin'],
    span: 1,
  },
  {
    id: 'languages',
    title: 'Languages',
    icon: 'code',
    summary: 'Python first, with systems and app languages where they fit.',
    skills: ['Python', 'C', 'SQL', 'TypeScript', 'Java', 'Swift'],
    projects: [],
    span: 3,
  },
];
