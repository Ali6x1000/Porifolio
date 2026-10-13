import {
  ClipboardList,
  FileText,
  FlaskConical,
  FolderGit2,
  GraduationCap,
  Search,
  type LucideIcon,
} from 'lucide-react';
import type { FolderCategory } from '../../../lib/alijr/config';

export type SlashCommand = {
  name: string;
  icon: LucideIcon;
  description: string;
  /** Placeholder shown after the command; `required` commands wait for a query before running. */
  arg?: { label: string; required: boolean };
  folder?: FolderCategory;
};

export const COMMANDS: SlashCommand[] = [
  { name: '/resume', icon: FileText, description: 'Open the full resume' },
  {
    name: '/projects',
    icon: FolderGit2,
    description: 'Browse project repos, or search their code and docs',
    arg: { label: 'query', required: false },
    folder: 'projects',
  },
  {
    name: '/search',
    icon: Search,
    description: 'Semantic search (RAG) across the whole knowledge base',
    arg: { label: 'query', required: true },
    folder: 'all',
  },
  {
    name: '/research',
    icon: FlaskConical,
    description: 'Search research papers and reports',
    arg: { label: 'query', required: true },
    folder: 'research',
  },
  {
    name: '/coursework',
    icon: GraduationCap,
    description: 'Search lecture notes and course material',
    arg: { label: 'query', required: true },
    folder: 'course_lectures',
  },
  {
    name: '/assignments',
    icon: ClipboardList,
    description: 'Search homework and project submissions',
    arg: { label: 'query', required: true },
    folder: 'submissions',
  },
];

export type CommandView =
  | { kind: 'resume' }
  | { kind: 'projects' }
  | { kind: 'search'; folder: FolderCategory; project?: string; query: string };

export const FOLDER_TITLES: Record<FolderCategory, string> = {
  all: 'Everything',
  projects: 'Projects',
  research: 'Research',
  course_lectures: 'Coursework',
  submissions: 'Assignments',
};

/** Commands whose name starts with what the visitor has typed so far (only while typing the name). */
export function matchCommands(input: string): SlashCommand[] {
  if (!input.startsWith('/') || /\s/.test(input)) return [];
  const typed = input.toLowerCase();
  return COMMANDS.filter((c) => c.name.startsWith(typed));
}

export function parseCommand(input: string): { command: SlashCommand; arg: string } | null {
  const match = input.trim().match(/^(\/\S+)\s*([\s\S]*)$/);
  if (!match) return null;
  const command = COMMANDS.find((c) => c.name === match[1].toLowerCase());
  return command ? { command, arg: match[2].trim() } : null;
}

export function viewFor(command: SlashCommand, arg: string): CommandView {
  if (command.name === '/resume') return { kind: 'resume' };
  if (command.name === '/projects' && !arg) return { kind: 'projects' };
  return { kind: 'search', folder: command.folder ?? 'all', query: arg };
}
