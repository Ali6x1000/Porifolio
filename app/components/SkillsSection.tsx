'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, BrainCircuit, Code2, FileText, Server, ShieldCheck, Sigma, Trophy } from 'lucide-react'
import { cn } from '../../lib/utils'
import { SKILL_GROUPS, type SkillIcon } from '../../lib/skills'
import { getProject, projectHref, projectsWithSkill, type CuratedProject } from '../../lib/projects'

const ICONS: Record<SkillIcon, typeof Bot> = {
  agents: Bot,
  safety: ShieldCheck,
  'deep-learning': BrainCircuit,
  math: Sigma,
  infra: Server,
  code: Code2,
}

const SPANS = { 1: '', 2: 'md:col-span-2', 3: 'md:col-span-2 lg:col-span-3' } as const

function SkillChip({ skill }: { skill: string }) {
  const count = projectsWithSkill(skill).length
  if (count === 0) {
    return <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs">{skill}</span>
  }
  return (
    <Link
      href={`/projects?skill=${encodeURIComponent(skill)}`}
      title={`See ${count} project${count === 1 ? '' : 's'} using ${skill}`}
      className="group/chip inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
    >
      {skill}
      <span className="rounded-full bg-muted px-1.5 text-[10px] text-muted-foreground group-hover/chip:bg-primary/20 group-hover/chip:text-primary">
        {count}
      </span>
    </Link>
  )
}

export function SkillsSection() {
  return (
    <section className="relative z-10 py-24 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-bold mb-3">Skills & Expertise</h2>
            <p className="max-w-xl text-muted-foreground">
              Focused on machine learning and AI systems. Click a skill to see the projects that use it.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/projects" className="btn-secondary rounded-full text-sm">
              All projects <ArrowRight size={16} className="ml-1.5" />
            </Link>
            <Link href="/resume" className="btn-secondary rounded-full text-sm">
              <FileText size={16} className="mr-1.5" /> Resume
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, index) => {
            const Icon = ICONS[group.icon]
            const projects = group.projects.map(getProject).filter((p): p is CuratedProject => p !== undefined)
            const isStrip = group.span === 3
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl',
                  SPANS[group.span],
                  group.span === 2 && 'bg-gradient-to-br from-primary/10 via-card to-card',
                  isStrip && 'lg:flex-row lg:items-center lg:gap-8'
                )}
              >
                <Icon
                  size={120}
                  className="pointer-events-none absolute -right-6 -top-6 text-primary opacity-[0.04] transition-opacity group-hover:opacity-[0.08]"
                />
                <div className={cn('flex items-start gap-3', isStrip ? 'lg:w-72 lg:shrink-0' : 'mb-4')}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{group.title}</h3>
                    <p className="text-sm text-muted-foreground">{group.summary}</p>
                  </div>
                </div>

                <div className={cn('flex flex-wrap gap-1.5', isStrip ? 'mt-4 lg:mt-0' : 'mb-5')}>
                  {group.skills.map((skill) => (
                    <SkillChip key={skill} skill={skill} />
                  ))}
                </div>

                {group.proof && (
                  <Link
                    href={group.proof.href}
                    className="mb-4 flex items-start gap-2 rounded-lg border border-border/70 bg-background/50 px-3 py-2 text-xs text-foreground/85 transition-colors hover:border-primary/40"
                  >
                    <Trophy size={14} className="mt-0.5 shrink-0 text-amber-500" />
                    <span>{group.proof.text}</span>
                  </Link>
                )}

                {projects.length > 0 && (
                  <div className="mt-auto border-t border-border/60 pt-4">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Used in</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {projects.map((project) => (
                        <Link
                          key={project.slug}
                          href={projectHref(project.slug)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          {project.title}
                          <ArrowRight size={12} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
