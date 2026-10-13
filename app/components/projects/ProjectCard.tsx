import Link from 'next/link';
import { ArrowUpRight, BookOpen, Github, Lock, Sparkles } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { STATUS_LABELS, type CuratedProject, type ProjectLink } from '../../../lib/projects';

const LINK_ICONS = {
  github: Github,
  live: ArrowUpRight,
  internal: Sparkles,
  blog: BookOpen,
} as const;

function ProjectLinkButton({ link, primary }: { link: ProjectLink; primary?: boolean }) {
  const Icon = LINK_ICONS[link.kind];
  const className = cn(
    'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
    primary
      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
  );
  const content = (
    <>
      <Icon size={14} />
      {link.label}
    </>
  );
  if (link.href.startsWith('/')) {
    return (
      <Link href={link.href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

function StatusBadge({ status }: { status: CuratedProject['status'] }) {
  if (!status) return null;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        status === 'live' && 'border-green-500/30 bg-green-500/10 text-green-500',
        status === 'private' && 'border-amber-500/30 bg-amber-500/10 text-amber-500',
        (status === 'research' || status === 'team') && 'border-border bg-muted text-muted-foreground'
      )}
    >
      {status === 'live' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />}
      {status === 'private' && <Lock size={10} />}
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ProjectCard({
  project,
  compact = false,
  wide = false,
  highlightSkill,
  className,
}: {
  project: CuratedProject;
  compact?: boolean;
  wide?: boolean;
  highlightSkill?: string | null;
  className?: string;
}) {
  const highlights = compact ? project.highlights.slice(0, 2) : project.highlights;
  const stack = compact ? project.stack.slice(0, 5) : project.stack;
  const matches = (tech: string) => highlightSkill && tech.toLowerCase() === highlightSkill.toLowerCase();

  return (
    <article
      id={project.slug}
      className={cn(
        'group flex scroll-mt-28 flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-xl target:border-primary target:ring-2 target:ring-primary/30',
        wide && 'bg-gradient-to-br from-primary/10 via-card to-card md:p-8',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{project.category}</p>
        <StatusBadge status={project.status} />
      </div>

      <h3 className={cn('mb-2 font-bold tracking-tight', wide ? 'text-2xl md:text-3xl' : 'text-xl')}>{project.title}</h3>
      <p className={cn('mb-4 text-muted-foreground', wide ? 'max-w-3xl text-base' : 'text-sm')}>{project.tagline}</p>

      {highlights.length > 0 && (
        <ul className={cn('mb-5 text-sm', wide ? 'grid gap-x-8 gap-y-2 md:grid-cols-2' : 'space-y-2')}>
          {highlights.map((item) => (
            <li key={item} className="flex gap-2.5 text-foreground/85">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <span
            key={tech}
            className={cn(
              'rounded-md border px-2 py-0.5 text-[11px] font-medium',
              matches(tech)
                ? 'border-primary/50 bg-primary/15 text-primary'
                : 'border-border/60 bg-secondary text-secondary-foreground'
            )}
          >
            {tech}
          </span>
        ))}
      </div>

      {(project.links.length > 0 || project.status === 'private') && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
          {project.links.map((link, i) => (
            <ProjectLinkButton key={link.href} link={link} primary={i === 0 && link.kind === 'internal'} />
          ))}
          {project.status === 'private' && project.links.length === 0 && (
            <span className="text-xs text-muted-foreground">Code available on request</span>
          )}
        </div>
      )}
    </article>
  );
}
