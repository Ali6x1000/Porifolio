'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUp,
  Briefcase,
  Check,
  Code2,
  Copy,
  CornerDownLeft,
  FileText,
  FolderOpen,
  GraduationCap,
  Loader2,
  Mic,
  RefreshCw,
  Rocket,
  Search,
  Square,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { AliJRMessage } from '../../../lib/alijr/types';
import { cn } from '../../../lib/utils';
import { SUGGESTIONS, useAliJRChat } from './chat-store';
import { CommandPopup } from './CommandPopup';
import { COMMANDS, matchCommands, parseCommand, viewFor, type CommandView, type SlashCommand } from './commands';
import { Markdown } from './Markdown';
import { Orb } from './Orb';

type Part = AliJRMessage['parts'][number];
type ToolPart = Extract<Part, { type: `tool-${string}` }>;

const SUGGESTION_ICONS = [Briefcase, Code2, Rocket, GraduationCap];

const FOLDER_LABELS: Record<string, string> = {
  projects: 'projects',
  research: 'research',
  course_lectures: 'course lectures',
  submissions: 'submissions',
  all: 'everything',
};

function isToolPart(part: Part): part is ToolPart {
  return part.type.startsWith('tool-');
}

function toolLabel(part: ToolPart): { icon: typeof Search; text: string } {
  switch (part.type) {
    case 'tool-readResume':
      return { icon: FileText, text: 'Reading resume' };
    case 'tool-listProjects':
      return { icon: FolderOpen, text: 'Scanning project index' };
    case 'tool-searchKnowledge': {
      const input = part.input as { folderCategory?: string; projectFolder?: string } | undefined;
      const scope = input?.projectFolder || FOLDER_LABELS[input?.folderCategory ?? ''] || 'knowledge base';
      return { icon: Search, text: `Searching ${scope}` };
    }
    default:
      return { icon: Search, text: 'Working' };
  }
}

function ToolActivity({ part }: { part: ToolPart }) {
  const { icon: Icon, text } = toolLabel(part);
  const done = part.state === 'output-available';
  const failed = part.state === 'output-error';
  const sources =
    part.type === 'tool-searchKnowledge' && done ? part.output.results : [];
  const shown = sources.slice(0, 4);

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
      <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
        {failed ? (
          <AlertTriangle size={12} className="text-amber-500" />
        ) : done ? (
          <Check size={12} className="text-emerald-500" />
        ) : (
          <Loader2 size={12} className="animate-spin" />
        )}
        <Icon size={12} />
        <span>
          {text}
          {done && part.type === 'tool-searchKnowledge' && ` · ${sources.length} sources`}
        </span>
      </div>
      {shown.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pl-1">
          {shown.map((s) => (
            <span
              key={s.source}
              title={s.source}
              className="max-w-[220px] truncate rounded-md border border-primary/15 bg-primary/5 px-2 py-0.5 text-[11px] text-foreground/80"
            >
              {s.label}
            </span>
          ))}
          {sources.length > shown.length && (
            <span className="px-1 text-[11px] text-muted-foreground">+{sources.length - shown.length}</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-2">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy answer"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="rounded-md p-1 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

function messageText(message: AliJRMessage) {
  return message.parts
    .map((p) => (p.type === 'text' ? p.text : ''))
    .join('')
    .trim();
}

function MessageView({ message }: { message: AliJRMessage }) {
  if (message.role === 'user') {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
          {messageText(message)}
        </div>
      </motion.div>
    );
  }

  const text = messageText(message);
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="group flex gap-3">
      <Orb size={28} className="mt-0.5" />
      <div className="min-w-0 flex-1 space-y-2">
        {message.parts.map((part, i) => {
          if (part.type === 'text') {
            return part.text.trim() ? <Markdown key={i}>{part.text}</Markdown> : null;
          }
          if (isToolPart(part)) return <ToolActivity key={part.toolCallId} part={part} />;
          return null;
        })}
        {text && <CopyButton text={text} />}
      </div>
    </motion.div>
  );
}

const QUICK_COMMANDS = ['/resume', '/projects', '/search'];

function EmptyState({
  variant,
  onPick,
  onCommand,
}: {
  variant: 'widget' | 'page';
  onPick: (prompt: string) => void;
  onCommand: (command: SlashCommand) => void;
}) {
  const page = variant === 'page';
  return (
    <div className={cn('flex h-full flex-col items-center justify-center text-center', page ? 'gap-6 px-4' : 'gap-4 px-2')}>
      <Orb size={page ? 120 : 72} />
      <div className="space-y-1.5">
        <h2 className={cn('font-semibold tracking-tight', page ? 'text-2xl sm:text-3xl' : 'text-lg')}>
          Agentic Twin
        </h2>
        <p className={cn('mx-auto text-muted-foreground', page ? 'max-w-md text-sm sm:text-base' : 'max-w-xs text-xs')}>
          An AI agent with access to Ali&apos;s resume, project repos, research and coursework. Ask anything, or
          type <kbd className="rounded border border-border px-1 font-mono text-[0.9em]">/</kbd> to explore them directly.
        </p>
      </div>
      <div className={cn('grid w-full gap-2', page ? 'max-w-xl sm:grid-cols-2' : 'grid-cols-2')}>
        {SUGGESTIONS.map((s, i) => {
          const Icon = SUGGESTION_ICONS[i % SUGGESTION_ICONS.length];
          return (
            <motion.button
              key={s.prompt}
              type="button"
              onClick={() => onPick(s.prompt)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -2 }}
              className="group flex items-start gap-2.5 rounded-xl border border-border/70 bg-card/60 p-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <Icon size={16} className="mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
              <span className="min-w-0">
                <span className="block text-xs font-medium">{s.title}</span>
                {page && <span className="block truncate text-xs text-muted-foreground">{s.prompt}</span>}
              </span>
            </motion.button>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {COMMANDS.filter((c) => QUICK_COMMANDS.includes(c.name)).map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onCommand(c)}
            title={c.description}
            className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition hover:border-primary/30 hover:text-foreground"
          >
            <c.icon size={12} />
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function SlashMenu({
  items,
  active,
  onHover,
  onPick,
}: {
  items: SlashCommand[];
  active: number;
  onHover: (index: number) => void;
  onPick: (command: SlashCommand) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.12 }}
      role="listbox"
      className="absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-2xl border border-border bg-card/95 p-1.5 shadow-2xl backdrop-blur"
    >
      <p className="px-2.5 pb-1 pt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Tools
      </p>
      {items.map((c, i) => (
        <button
          key={c.name}
          type="button"
          role="option"
          aria-selected={i === active}
          onMouseEnter={() => onHover(i)}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onPick(c)}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors',
            i === active ? 'bg-muted' : 'hover:bg-muted/60',
          )}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <c.icon size={14} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-xs font-medium">
              {c.name}
              {c.arg && (
                <span className="ml-1.5 text-muted-foreground">
                  {c.arg.required ? `<${c.arg.label}>` : `[${c.arg.label}]`}
                </span>
              )}
            </span>
            <span className="block truncate text-[11px] text-muted-foreground">{c.description}</span>
          </span>
          {i === active && <CornerDownLeft size={12} className="shrink-0 text-muted-foreground" />}
        </button>
      ))}
    </motion.div>
  );
}

export function AliJRChat({
  variant = 'widget',
  onStartVoice,
}: {
  variant?: 'widget' | 'page';
  onStartVoice?: () => void;
}) {
  const { messages, sendMessage, status, stop, error, regenerate } = useAliJRChat();
  const [input, setInput] = useState('');
  const [view, setView] = useState<CommandView | null>(null);
  const [activeCommand, setActiveCommand] = useState(0);
  const [menuDismissed, setMenuDismissed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const busy = status === 'submitted' || status === 'streaming';

  const menuItems = menuDismissed ? [] : matchCommands(input);
  const menuOpen = menuItems.length > 0;

  useEffect(() => {
    setActiveCommand(0);
    if (!input.startsWith('/')) setMenuDismissed(false);
  }, [input]);

  const closePopup = useCallback(() => {
    setView(null);
    inputRef.current?.focus();
  }, []);

  const runCommand = (command: SlashCommand, arg = '') => {
    setView(viewFor(command, arg));
    setInput('');
  };

  const pickCommand = (command: SlashCommand) => {
    if (command.arg?.required) {
      setInput(`${command.name} `);
      inputRef.current?.focus();
    } else {
      runCommand(command);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  const send = (text: string) => {
    if (!text.trim() || busy) return;
    sendMessage({ text: text.trim() });
    setInput('');
  };

  const submit = (text: string) => {
    const parsed = parseCommand(text);
    if (parsed) runCommand(parsed.command, parsed.arg);
    else send(text);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (menuOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setActiveCommand((i) => (i + step + menuItems.length) % menuItems.length);
        return;
      }
      if ((e.key === 'Enter' || e.key === 'Tab') && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        pickCommand(menuItems[Math.min(activeCommand, menuItems.length - 1)]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMenuDismissed(true);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit(input);
    }
  };

  const last = messages[messages.length - 1];
  const lastParts = last?.role === 'assistant' ? last.parts.filter((p) => p.type !== 'step-start') : [];
  const lastPart = lastParts[lastParts.length - 1];
  const showTyping =
    busy &&
    (last?.role !== 'assistant' ||
      !lastPart ||
      (isToolPart(lastPart) && lastPart.state === 'output-available'));

  const page = variant === 'page';

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <CommandPopup
        view={view}
        variant={variant}
        onNavigate={setView}
        onClose={closePopup}
        onAsk={(text) => {
          setView(null);
          send(text);
        }}
      />
      <div ref={scrollRef} className={cn('min-h-0 flex-1 overflow-y-auto', page ? 'px-4 py-6 sm:px-8' : 'px-4 py-4')}>
        {messages.length === 0 ? (
          <EmptyState variant={variant} onPick={send} onCommand={pickCommand} />
        ) : (
          <div className={cn('mx-auto space-y-5', page && 'max-w-2xl')}>
            {messages.map((m) => (
              <MessageView key={m.id} message={m} />
            ))}
            {showTyping && (
              <div className="flex gap-3">
                <Orb size={28} state="thinking" />
                <TypingDots />
              </div>
            )}
            <AnimatePresence>
              {error && !busy && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs"
                >
                  <span>Something went wrong reaching the twin.</span>
                  <button
                    type="button"
                    onClick={() => regenerate()}
                    className="inline-flex items-center gap-1 font-medium hover:underline"
                  >
                    <RefreshCw size={12} /> Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className={cn('border-t border-border/60 bg-background/40 backdrop-blur', page ? 'p-4 sm:px-8' : 'p-3')}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className={cn(
            'relative mx-auto flex items-end gap-2 rounded-2xl border border-border bg-card/80 p-1.5 shadow-sm transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10',
            page && 'max-w-2xl',
          )}
        >
          <AnimatePresence>
            {menuOpen && (
              <SlashMenu items={menuItems} active={activeCommand} onHover={setActiveCommand} onPick={pickCommand} />
            )}
          </AnimatePresence>
          {onStartVoice && (
            <button
              type="button"
              onClick={onStartVoice}
              aria-label="Switch to voice"
              title="Talk by voice"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Mic size={17} />
            </button>
          )}
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={page ? 'Ask about projects, research, or experience, or type / for tools' : 'Ask anything, or type / for tools'}
            className="max-h-[140px] min-h-[36px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => {
              setInput('/');
              setMenuDismissed(false);
              inputRef.current?.focus();
            }}
            aria-label="Show tools"
            title="Tools (/)"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            /
          </button>
          {busy ? (
            <button
              type="button"
              onClick={() => stop()}
              aria-label="Stop"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition hover:opacity-90"
            >
              <Square size={13} fill="currentColor" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-30"
            >
              <ArrowUp size={17} />
            </button>
          )}
        </form>
        {page && (
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Answers come from Ali&apos;s own documents and can still contain mistakes.
          </p>
        )}
      </div>
    </div>
  );
}
