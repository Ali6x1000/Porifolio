'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ProjectCard } from '../components/projects/ProjectCard'
import { cn } from '../../lib/utils'
import {
  PROJECTS,
  TRACKS,
  curatedRepoNames,
  repoName,
  usesSkill,
  type CuratedProject,
  type ProjectTrack,
} from '../../lib/projects'

interface AdminProject {
  id: string
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string | null
}

type TrackFilter = 'all' | ProjectTrack

const FILTERS: { id: TrackFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'swe', label: 'Software Engineering' },
]

/** Projects added through the admin panel that are not already in the curated list. */
function toExtraProjects(items: AdminProject[]): CuratedProject[] {
  const known = curatedRepoNames()
  const knownTitles = new Set(PROJECTS.map((p) => p.title.toLowerCase()))
  return items
    .filter((item) => {
      const repo = repoName(item.github)
      return !(repo && known.has(repo)) && !knownTitles.has(item.title.toLowerCase())
    })
    .map((item) => ({
      slug: `more-${item.id}`,
      title: item.title,
      track: 'swe' as const,
      category: 'Project',
      tagline: item.description,
      highlights: [],
      stack: item.technologies.flatMap((t) => t.split(/[|,]/)).map((t) => t.trim()).filter(Boolean),
      links: [
        ...(item.demo ? [{ label: 'Demo', href: item.demo, kind: 'live' as const }] : []),
        ...(item.github ? [{ label: 'Code', href: item.github, kind: 'github' as const }] : []),
      ],
    }))
}

function updateQuery(track: TrackFilter, skill: string | null) {
  const params = new URLSearchParams()
  if (track !== 'all') params.set('track', track)
  if (skill) params.set('skill', skill)
  const query = params.toString()
  window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
}

export default function Projects() {
  const [track, setTrack] = useState<TrackFilter>('all')
  const [skill, setSkill] = useState<string | null>(null)
  const [extras, setExtras] = useState<CuratedProject[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initialTrack = params.get('track')
    if (initialTrack === 'ai' || initialTrack === 'swe') setTrack(initialTrack)
    setSkill(params.get('skill'))

    fetch('/api/projects')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setExtras(toExtraProjects(Array.isArray(data) ? data : [])))
      .catch(() => setExtras([]))
  }, [])

  const selectTrack = (next: TrackFilter) => {
    setTrack(next)
    updateQuery(next, skill)
  }

  const clearSkill = () => {
    setSkill(null)
    updateQuery(track, null)
  }

  const sections = useMemo(() => {
    const visible = (p: CuratedProject) => (track === 'all' || p.track === track) && (!skill || usesSkill(p, skill))
    const tracks: ProjectTrack[] = track === 'all' ? ['ai', 'swe'] : [track]
    return tracks
      .map((t) => ({ track: t, projects: PROJECTS.filter((p) => p.track === t && visible(p)) }))
      .filter((s) => s.projects.length > 0)
  }, [track, skill])

  const visibleExtras = track === 'ai' ? [] : extras.filter((p) => !skill || usesSkill(p, skill))

  return (
    <div className="pt-24 min-h-screen bg-background relative pb-20">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:block hidden" />
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px] z-0 pointer-events-none dark:hidden block" />

      <section className="relative z-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Projects</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI agents, AI safety research and medical deep learning first, followed by the software I&apos;ve shipped.
            </p>
          </motion.div>

          <div className="mb-12 flex flex-col items-center gap-4">
            <div className="inline-flex rounded-full border border-border bg-card p-1">
              {FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => selectTrack(filter.id)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                    track === filter.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            {skill && (
              <button
                onClick={clearSkill}
                className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1 text-sm text-brand hover:bg-brand/15"
              >
                Showing projects using <strong>{skill}</strong>
                <X size={14} />
              </button>
            )}
          </div>

          {sections.length === 0 && visibleExtras.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No projects match this filter.</p>
          )}

          <div className="space-y-16">
            {sections.map(({ track: t, projects }) => (
              <div key={t}>
                <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{TRACKS[t].title}</h2>
                    <p className="text-sm text-muted-foreground">{TRACKS[t].blurb}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{projects.length} projects</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {projects.map((project) => {
                    const wide = project.slug === 'agentic-twin' && !skill
                    return (
                      <ProjectCard
                        key={project.slug}
                        project={project}
                        wide={wide}
                        highlightSkill={skill}
                        className={wide ? 'md:col-span-2' : undefined}
                      />
                    )
                  })}
                </div>
              </div>
            ))}

            {visibleExtras.length > 0 && (
              <div>
                <div className="mb-6 border-b border-border pb-4">
                  <h2 className="text-2xl font-bold">More Projects</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {visibleExtras.map((project) => (
                    <ProjectCard key={project.slug} project={project} highlightSkill={skill} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            <p className="text-muted-foreground">Want the full picture, including industry work?</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/resume" className="btn-secondary rounded-full">
                <FileText size={16} className="mr-2" /> View resume
              </Link>
              <Link href="/twin" className="btn-primary rounded-full">
                Ask the Agentic Twin
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
