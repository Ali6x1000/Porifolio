'use client';

import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';

export type OrbState = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking';

const PALETTES: Record<OrbState, [string, string, string]> = {
  idle: ['#6366f1', '#22d3ee', '#a855f7'],
  connecting: ['#64748b', '#6366f1', '#94a3b8'],
  listening: ['#22d3ee', '#3b82f6', '#34d399'],
  thinking: ['#f59e0b', '#a855f7', '#6366f1'],
  speaking: ['#a855f7', '#ec4899', '#22d3ee'],
};

const SPIN_SECONDS: Record<OrbState, number> = {
  idle: 9,
  connecting: 3,
  listening: 6,
  thinking: 1.8,
  speaking: 4,
};

export function Orb({
  state = 'idle',
  level = 0,
  size = 160,
  className,
}: {
  state?: OrbState;
  level?: number;
  size?: number;
  className?: string;
}) {
  const [a, b, c] = PALETTES[state];
  const active = level > 0.02;
  const scale = 1 + Math.min(level, 1) * 0.28;

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${b}99 0%, ${a}55 45%, transparent 70%)` }}
        animate={active ? { scale: 1.15 + level * 0.6, opacity: 0.9 } : { scale: [1.05, 1.2, 1.05], opacity: [0.5, 0.75, 0.5] }}
        transition={active ? { type: 'spring', stiffness: 200, damping: 18 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full shadow-[inset_0_0_30px_rgba(255,255,255,0.15)]"
        animate={active ? { scale } : { scale: [1, 1.035, 1] }}
        transition={active ? { type: 'spring', stiffness: 320, damping: 20 } : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="absolute -inset-1/2 animate-spin"
          style={{
            background: `conic-gradient(from 0deg, ${a}, ${b}, ${c}, ${a})`,
            animationDuration: `${SPIN_SECONDS[state]}s`,
          }}
        />
        <div
          className="absolute inset-[15%] rounded-full blur-xl"
          style={{ background: `radial-gradient(circle, ${c}cc, transparent 70%)` }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.65), transparent 42%)' }}
        />
      </motion.div>
      {(state === 'thinking' || state === 'connecting') && (
        <div
          aria-hidden
          className="absolute -inset-2 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: a, borderRightColor: `${b}66`, animationDuration: '1.2s' }}
        />
      )}
    </div>
  );
}
