import type { Metadata } from 'next'
import { AboutView } from './AboutView'
import { DEFAULT_ABOUT, GRADUATION, ROLES, getAboutData } from '../../lib/about'
import { getLiveStats } from '../../lib/live-stats'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'About - Ali Nawaf',
  description:
    'Ali Nawaf: BS Computer Science and MS Machine Learning & AI at Case Western Reserve University, working on AI agents, AI safety and medical deep learning.',
}

export default async function AboutPage() {
  const [about, stats] = await Promise.all([getAboutData(), getLiveStats()])
  return <AboutView about={about ?? DEFAULT_ABOUT} stats={stats} roles={ROLES} graduation={GRADUATION} />
}
