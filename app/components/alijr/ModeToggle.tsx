'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Mic } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type AliJRMode = 'chat' | 'voice';

const MODES = [
  { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
  { id: 'voice' as const, label: 'Voice', icon: Mic },
];

export function ModeToggle({
  mode,
  onChange,
  layoutId,
  className,
}: {
  mode: AliJRMode;
  onChange: (mode: AliJRMode) => void;
  layoutId: string;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex rounded-full border border-border/70 bg-muted/40 p-0.5', className)}>
      {MODES.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors',
            mode === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {mode === id && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-full bg-background shadow-sm ring-1 ring-border"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <Icon size={13} className="relative" />
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}
