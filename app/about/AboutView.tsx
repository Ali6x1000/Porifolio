'use client'

import { animate, motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Coffee,
  Compass,
  Database,
  FileText,
  FlaskConical,
  FolderGit2,
  Github,
  GraduationCap,
  HeartPulse,
  Languages,
  Mail,
  MapPin,
  Mountain,
  Music,
  Phone,
  Plane,
  Sparkles,
  Target,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import type { AboutData, Role } from '../../lib/about'
import type { ContributionDay, LiveStats } from '../../lib/live-stats'

const ACCENT = 'text-brand'

function formatMonth(iso: string) {
  const [year, month] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {display.toLocaleString('en-US')}
    </span>
  )
}

function useDaysUntil(isoDate: string) {
  const [days, setDays] = useState<number | null>(null)
  useEffect(() => {
    setDays(Math.max(0, Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000)))
  }, [isoDate])
  return days
}

const HEAT_LEVELS = [
  'bg-muted',
  'bg-emerald-300 dark:bg-emerald-900',
  'bg-emerald-400 dark:bg-emerald-700',
  'bg-emerald-500 dark:bg-emerald-500',
  'bg-emerald-600 dark:bg-emerald-300',
]

function ContributionHeatmap({ days }: { days: ContributionDay[] }) {
  const first = days[0] ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay() : 0
  const cells: (ContributionDay | null)[] = [...Array(first).fill(null), ...days]
  const weeks: (ContributionDay | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
      {weeks.map((week, w) => (
        <div key={w} className="grid grid-rows-7 gap-[3px]">
          {week.map((day, d) =>
            day ? (
              <div
                key={day.date}
                title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
                className={cn('aspect-square rounded-[2px]', HEAT_LEVELS[day.level])}
              />
            ) : (
              <div key={`pad-${d}`} className="aspect-square" />
            )
          )}
        </div>
      ))}
    </div>
  )
}

function contributionSummary(days: ContributionDay[]) {
  let longest = 0
  let run = 0
  let best: ContributionDay | null = null
  for (const day of days) {
    run = day.count > 0 ? run + 1 : 0
    longest = Math.max(longest, run)
    if (!best || day.count > best.count) best = day
  }
  return { activeDays: days.filter((d) => d.count > 0).length, longestStreak: longest, best }
}

function GithubBreakdown({ days }: { days: ContributionDay[] }) {
  const { activeDays, longestStreak, best } = contributionSummary(days)
  const items = [
    { label: 'Active days', value: activeDays },
    { label: 'Longest streak', value: longestStreak, unit: 'days' },
    { label: 'Busiest day', value: best?.count ?? 0, unit: best ? new Date(`${best.date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) : undefined },
  ]
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
          <p className="text-xs text-muted-foreground">{item.label}</p>
          <p className="text-lg font-semibold text-foreground">
            <CountUp value={item.value} />
            {item.unit && <span className="ml-1 text-xs font-normal text-muted-foreground">{item.unit}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}

function StatTile({
  icon: Icon,
  value,
  label,
  detail,
  href,
  cta,
  className,
  children,
}: {
  icon: typeof Github
  value: number
  label: string
  detail?: ReactNode
  href?: string
  cta?: string
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand/40',
        className
      )}
    >
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
        <Icon size={18} className={ACCENT} />
      </div>
      <CountUp value={value} className="text-4xl font-bold tracking-tight text-foreground" />
      <p className="mt-1 font-medium text-foreground">{label}</p>
      {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      {children}
      {href && cta && (
        <Link
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          className={cn('mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium hover:underline', ACCENT)}
        >
          {cta} <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

function SectionHeading({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className={cn('mb-2 text-xs font-semibold uppercase tracking-[0.2em]', ACCENT)}>{eyebrow}</p>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      {aside}
    </div>
  )
}

const FACT_ICONS: [RegExp, typeof Plane][] = [
  [/india|uwc|travel|abroad/i, Plane],
  [/med|health|bio/i, HeartPulse],
  [/coffee/i, Coffee],
  [/arabic|lingual|language/i, Languages],
  [/spotify|music|song/i, Music],
]

function factIcon(fact: string) {
  return FACT_ICONS.find(([pattern]) => pattern.test(fact))?.[1] ?? Sparkles
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5 },
}

export function AboutView({
  about,
  stats,
  roles,
  graduation,
}: {
  about: AboutData
  stats: LiveStats
  roles: Role[]
  graduation: { label: string; date: string }
}) {
  const daysToGraduation = useDaysUntil(graduation.date)
  const timeline = [...roles].sort((a, b) => b.start.localeCompare(a.start))

  const story = [
    { icon: Compass, title: 'Background', text: about.bio.background },
    { icon: Mountain, title: 'Outside of work', text: about.bio.interests },
    { icon: Target, title: 'Where I’m headed', text: about.bio.goals },
  ].filter((item) => item.text)

  return (
    <div className="relative min-h-screen bg-background pb-24 pt-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.12),transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground/80">
              <GraduationCap size={15} className={ACCENT} />
              BS Computer Science + MS Machine Learning &amp; AI · Case Western Reserve
            </p>
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Hi, I&apos;m <span className="bg-gradient-to-r from-sky-500 to-violet-500 bg-clip-text text-transparent">{about.name.split(' ')[0]}</span>.
            </h1>
            <p className="mb-6 text-xl font-medium text-foreground/90">{about.title}</p>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-foreground/75">{about.bio.introduction}</p>

            <div className="mb-8 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-foreground/80">
                <MapPin size={15} className={ACCENT} /> {about.location}
              </span>
              <a
                href={`mailto:${about.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-foreground/80 transition-colors hover:border-brand/50 hover:text-foreground"
              >
                <Mail size={15} className={ACCENT} /> {about.email}
              </a>
              <a
                href={`tel:${about.phone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-foreground/80 transition-colors hover:border-brand/50 hover:text-foreground"
              >
                <Phone size={15} className={ACCENT} /> {about.phone}
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/resume" className="btn-primary rounded-full">
                <FileText size={16} className="mr-2" /> Resume
              </Link>
              <Link href="/projects" className="btn-secondary rounded-full">
                Projects <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                href="/twin"
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                <Sparkles size={16} className={cn('mr-2', ACCENT)} /> Ask my Agentic Twin
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[360px]"
          >
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-sky-500/60 via-violet-500/40 to-transparent blur-sm" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted">
              <Image src={about.profileImage} alt={about.name} fill sizes="360px" className="object-cover" priority />
            </div>
            {daysToGraduation !== null && (
              <div className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl border border-border bg-background/90 px-4 py-3 shadow-xl backdrop-blur">
                <GraduationCap size={22} className={ACCENT} />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">Graduating {graduation.label}</p>
                  <p className="text-muted-foreground">
                    <span className="tabular-nums">{daysToGraduation}</span> days to go
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Live stats */}
        <motion.section {...reveal} className="mt-28">
          <SectionHeading
            eyebrow="By the numbers"
            title="Live stats"
            aside={
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Pulled from GitHub, the knowledge base and this site
              </span>
            }
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.github && (
              <StatTile
                icon={Github}
                value={stats.github.contributions}
                label="GitHub contributions in the past year"
                detail={stats.github.publicRepos !== null ? `${stats.github.publicRepos} public repositories` : undefined}
                href="https://github.com/Ali6x1000"
                cta="View GitHub"
                className="md:col-span-2 lg:row-span-2"
              >
                <GithubBreakdown days={stats.github.days} />
                <div className="mt-5">
                  <ContributionHeatmap days={stats.github.days} />
                  <div className="mt-2 flex items-center justify-end gap-1 text-[11px] text-muted-foreground">
                    Less
                    {HEAT_LEVELS.map((level) => (
                      <span key={level} className={cn('h-[10px] w-[10px] rounded-[2px]', level)} />
                    ))}
                    More
                  </div>
                </div>
              </StatTile>
            )}
            <StatTile
              icon={Briefcase}
              value={stats.experience.industryMonths}
              label="months in AI industry roles"
              detail={`Plus ${stats.experience.researchMonths} months of clinical ML research, across ${stats.experience.organizations} organizations`}
              href="/resume"
              cta="Resume"
            />
            {stats.knowledge && (
              <StatTile
                icon={Database}
                value={stats.knowledge.chunks}
                label="knowledge chunks indexed"
                detail={`From ${stats.knowledge.documents.toLocaleString('en-US')} documents: my coursework, research and repos`}
                href="/twin"
                cta="Search them"
              />
            )}
            <StatTile
              icon={FolderGit2}
              value={stats.projects.total}
              label="projects"
              detail={`${stats.projects.ai} in AI & machine learning`}
              href="/projects"
              cta="Browse projects"
            />
            {stats.blogPosts !== null && stats.blogPosts > 0 && (
              <StatTile icon={BookOpen} value={stats.blogPosts} label="blog posts" detail="Technical deep dives" href="/blog" cta="Read the blog" />
            )}
          </div>
        </motion.section>

        {/* Journey */}
        <motion.section {...reveal} className="mt-28">
          <SectionHeading eyebrow="Journey" title="How I got here" />
          <ol className="relative space-y-6 border-l border-border pl-8">
            <li className="relative">
              <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-brand/50 bg-background">
                <GraduationCap size={13} className={ACCENT} />
              </span>
              <p className="text-sm font-medium text-muted-foreground">{graduation.label}</p>
              <h3 className="text-lg font-semibold text-foreground">BS Computer Science + MS Machine Learning &amp; AI</h3>
              <p className="text-foreground/75">Case Western Reserve University, with a secondary major in mathematics.</p>
            </li>
            {timeline.map((role) => {
              const Icon = role.kind === 'research' ? FlaskConical : Briefcase
              return (
                <li key={role.org} className="relative">
                  <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
                    <Icon size={13} className="text-foreground/70" />
                  </span>
                  <div className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand/40">
                    <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {role.title} <span className="text-foreground/60">· {role.org}</span>
                      </h3>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
                          role.kind === 'research'
                            ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
                            : 'bg-brand/10 text-sky-600 dark:text-sky-400'
                        )}
                      >
                        {role.kind === 'research' ? 'Research' : 'Industry'}
                      </span>
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      {formatMonth(role.start)} – {role.end ? formatMonth(role.end) : 'Present'}
                    </p>
                    <p className="text-foreground/80">{role.summary}</p>
                  </div>
                </li>
              )
            })}
            <li className="relative">
              <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background">
                <Plane size={13} className="text-foreground/70" />
              </span>
              <p className="text-sm font-medium text-muted-foreground">Before college</p>
              <h3 className="text-lg font-semibold text-foreground">UWC Scholar in India, then pre-med at Case Western</h3>
              <p className="text-foreground/75">Started in biochemistry before switching to computer science and math.</p>
            </li>
          </ol>
        </motion.section>

        {/* Story */}
        {story.length > 0 && (
          <motion.section {...reveal} className="mt-28">
            <SectionHeading eyebrow="Beyond the resume" title="A bit more about me" />
            <div className="grid gap-4 md:grid-cols-3">
              {story.map(({ icon: Icon, title, text }) => (
                <div key={title} className="rounded-2xl border border-border bg-card p-6">
                  <Icon size={20} className={cn('mb-4', ACCENT)} />
                  <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                  <p className="leading-relaxed text-foreground/80">{text}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Fun facts */}
        {about.personalFacts.length > 0 && (
          <motion.section {...reveal} className="mt-20">
            <SectionHeading eyebrow="Fun facts" title="Things you won’t find on my resume" />
            <div className="grid gap-3 sm:grid-cols-2">
              {about.personalFacts.map((fact) => {
                const Icon = factIcon(fact)
                return (
                  <div key={fact} className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                      <Icon size={18} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="text-foreground/85">{fact}</p>
                  </div>
                )
              })}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.section
          {...reveal}
          className="mt-24 flex flex-col items-center gap-6 rounded-3xl border border-border bg-gradient-to-br from-sky-500/10 via-card to-violet-500/10 p-10 text-center"
        >
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Want to know something specific?</h2>
          <p className="max-w-xl text-foreground/75">
            My Agentic Twin can answer questions about my projects, research and coursework, or you can reach me directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/twin" className="btn-primary rounded-full">
              <Sparkles size={16} className="mr-2" /> Ask the Agentic Twin
            </Link>
            <a href={`mailto:${about.email}`} className="btn-secondary rounded-full">
              <Mail size={16} className="mr-2" /> Email me
            </a>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
