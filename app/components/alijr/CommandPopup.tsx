'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  FileText,
  FolderGit2,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { KnowledgeHit, KnowledgeSearchResult } from '../../../lib/alijr/knowledge';
import { cn } from '../../../lib/utils';
import { COMMANDS, FOLDER_TITLES, type CommandView } from './commands';

type ToolData = { resume?: string; projects?: string[]; search?: KnowledgeSearchResult };
type LoadState = { loading: boolean; error?: string; data?: ToolData };

function requestFor(view: CommandView) {
  if (view.kind === 'resume') return { tool: 'readResume' };
  if (view.kind === 'projects') return { tool: 'listProjects' };
  return {
    tool: 'searchKnowledge',
    query: view.query,
    folderCategory: view.folder,
    projectFolder: view.project,
  };
}

function useToolData(view: CommandView | null): LoadState {
  const [state, setState] = useState<LoadState>({ loading: false });

  useEffect(() => {
    if (!view || (view.kind === 'search' && !view.query)) {
      setState({ loading: false });
      return;
    }
    let cancelled = false;
    setState({ loading: true });
    fetch('/api/alijr/explore', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(requestFor(view)),
    })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error || 'Something went wrong.');
        if (!cancelled) setState({ loading: false, data: body });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ loading: false, error: error.message });
      });
    return () => {
      cancelled = true;
    };
  }, [view]);

  return state;
}

const RESUME_SECTIONS = /^(education|experience|work experience|projects|skills|technical skills|research|publications|leadership|awards|certifications|activities)$/i;

/** resume.md is plain text exported from a PDF: one item per line, tab-aligned dates and "•" bullets. */
function ResumeView({ text }: { text: string }) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const [name, contact, ...rest] = lines;
  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      <p className="text-base font-semibold">{name}</p>
      {contact && <p className="text-muted-foreground">{contact}</p>}
      {rest.map((line, i) => {
        if (RESUME_SECTIONS.test(line)) {
          return (
            <p key={i} className="border-b border-border/70 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-brand">
              {line}
            </p>
          );
        }
        if (line.startsWith('•')) {
          return (
            <p key={i} className="flex gap-2 pl-1 text-foreground/80">
              <span className="text-muted-foreground">•</span>
              <span>{line.replace(/^•\s*/, '')}</span>
            </p>
          );
        }
        const [head, ...meta] = line.split(/\s{3,}|\t+/).filter(Boolean);
        return (
          <p key={i} className="flex flex-wrap items-baseline justify-between gap-x-3 pt-1">
            <span className="font-medium">{head}</span>
            {meta.length > 0 && <span className="text-[11px] text-muted-foreground">{meta.join(' · ')}</span>}
          </p>
        );
      })}
    </div>
  );
}

function ResultCard({ hit, index }: { hit: KnowledgeHit; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const long = hit.excerpt.length > 420;
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-xl border border-border/70 bg-background/60 p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium" title={hit.source}>
            {hit.label}
          </p>
          <p className="mt-0.5 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground">
            <span className="capitalize">{hit.project ?? hit.folder.replace('_', ' ')}</span>
            {hit.page && <span>page {hit.page}</span>}
          </p>
        </div>
        <span
          title="Semantic similarity"
          className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-brand"
        >
          {Math.round(hit.score * 100)}%
        </span>
      </div>
      <p
        className={cn(
          'mt-2 whitespace-pre-wrap text-xs leading-relaxed text-foreground/80',
          !expanded && 'line-clamp-5',
        )}
      >
        {hit.excerpt}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline"
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronDown size={12} className={cn('transition', expanded && 'rotate-180')} />
        </button>
      )}
    </motion.li>
  );
}

function SearchBox({ view, onNavigate }: { view: Extract<CommandView, { kind: 'search' }>; onNavigate: (v: CommandView) => void }) {
  const [query, setQuery] = useState(view.query);
  useEffect(() => setQuery(view.query), [view.query]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) onNavigate({ ...view, query: query.trim() });
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2 rounded-xl border border-border bg-background/70 px-3 focus-within:border-brand/40">
      <Search size={14} className="shrink-0 text-muted-foreground" />
      <input
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        maxLength={300}
        placeholder={view.project ? `Search inside ${view.project}…` : `Search ${FOLDER_TITLES[view.folder].toLowerCase()}…`}
        className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        type="submit"
        disabled={!query.trim()}
        className="rounded-md border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground transition hover:text-foreground disabled:opacity-40"
      >
        Search ↵
      </button>
    </form>
  );
}

function header(view: CommandView, data?: ToolData) {
  if (view.kind === 'resume') return { icon: FileText, title: 'Resume', subtitle: '/resume' };
  if (view.kind === 'projects') {
    const n = data?.projects?.length;
    return { icon: FolderGit2, title: 'Projects', subtitle: n ? `${n} indexed repos` : '/projects' };
  }
  const command = COMMANDS.find((c) => c.folder === view.folder);
  return {
    icon: view.project ? FolderGit2 : command?.icon ?? Search,
    title: view.project ?? FOLDER_TITLES[view.folder],
    subtitle: 'Semantic search over embedded documents',
  };
}

export function CommandPopup({
  view,
  variant,
  onNavigate,
  onClose,
  onAsk,
}: {
  view: CommandView | null;
  variant: 'widget' | 'page';
  onNavigate: (view: CommandView) => void;
  onClose: () => void;
  onAsk: (text: string) => void;
}) {
  const { loading, error, data } = useToolData(view);

  useEffect(() => {
    if (!view) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, onClose]);

  const hits = data?.search?.results ?? [];
  const askText =
    view?.kind === 'resume'
      ? "Give me a quick recruiter-friendly summary of Ali's resume."
      : view?.kind === 'search' && view.query
        ? view.project
          ? `In the ${view.project} project: ${view.query}`
          : view.query
        : null;

  return (
    <AnimatePresence>
      {view && (
        <motion.div
          key="command-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={cn(
            'absolute inset-0 z-30 flex items-end justify-center bg-background/60 backdrop-blur-sm sm:items-center',
            variant === 'page' ? 'p-4 sm:p-8' : 'p-2',
          )}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              'flex max-h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl',
              variant === 'page' && 'max-w-2xl',
            )}
          >
            {(() => {
              const { icon: Icon, title, subtitle } = header(view, data);
              return (
                <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
                  {view.kind === 'search' && view.project && (
                    <button
                      type="button"
                      aria-label="Back to projects"
                      onClick={() => onNavigate({ kind: 'projects' })}
                      className="-ml-1 rounded-lg p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      <ArrowLeft size={15} />
                    </button>
                  )}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold leading-tight">{title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })()}

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {view.kind === 'search' && <SearchBox view={view} onNavigate={onNavigate} />}

              {loading && (
                <div className="flex items-center justify-center gap-2 py-10 text-xs text-muted-foreground">
                  <Loader2 size={14} className="animate-spin" />
                  {view.kind === 'search' ? 'Embedding query and searching…' : 'Loading…'}
                </div>
              )}

              {error && !loading && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs">
                  <AlertTriangle size={13} /> {error}
                </div>
              )}

              {!loading && data?.resume && <ResumeView text={data.resume} />}

              {!loading && data?.projects && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {data.projects.map((project, i) => (
                    <motion.button
                      key={project}
                      type="button"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => onNavigate({ kind: 'search', folder: 'projects', project, query: '' })}
                      className="group flex items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 text-left transition hover:border-brand/30 hover:bg-muted/50"
                    >
                      <FolderGit2 size={15} className="shrink-0 text-muted-foreground group-hover:text-brand" />
                      <span className="truncate text-sm">{project}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {!loading && data?.search && (
                <>
                  {data.search.notes.map((note) => (
                    <p key={note} className="text-[11px] text-muted-foreground">
                      {note}
                    </p>
                  ))}
                  {hits.length > 0 && (
                    <ul className="space-y-2">
                      {hits.map((hit, i) => (
                        <ResultCard key={`${hit.source}-${i}`} hit={hit} index={i} />
                      ))}
                    </ul>
                  )}
                </>
              )}

              {view.kind === 'search' && !view.query && !loading && (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Type a question or keywords. Results are ranked by semantic similarity, not exact words.
                </p>
              )}
            </div>

            {askText && !loading && (
              <div className="border-t border-border/60 p-3">
                <button
                  type="button"
                  onClick={() => onAsk(askText)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Sparkles size={13} />
                  <span className="truncate">
                    {view.kind === 'resume' ? 'Ask the twin for a summary' : `Ask the twin about “${view.kind === 'search' ? view.query : ''}”`}
                  </span>
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
