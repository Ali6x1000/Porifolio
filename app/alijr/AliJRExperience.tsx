'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Database, Mic, RotateCcw, Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { AliJRChat } from '../components/alijr/AliJRChat';
import { useAliJRChat } from '../components/alijr/chat-store';
import { ModeToggle, type AliJRMode } from '../components/alijr/ModeToggle';

const AliJRVoice = dynamic(() => import('../components/alijr/AliJRVoice'), { ssr: false });

const FEATURES = [
  { icon: Database, text: '8,000+ passages from my docs' },
  { icon: Search, text: 'Cites the sources it reads' },
  { icon: Mic, text: 'Real-time voice with Gemini Live' },
];

export default function AliJRExperience() {
  const [mode, setMode] = useState<AliJRMode>('chat');
  const { messages, setMessages, stop } = useAliJRChat();

  return (
    <section className="relative flex-1 overflow-hidden pb-8 pt-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.5)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.5)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <motion.div
          className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto flex h-[calc(100dvh-8rem)] min-h-[620px] max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Talk to <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">AliJR</span>
            </h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              {FEATURES.map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon size={12} /> {text}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mode === 'chat' && messages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  stop();
                  setMessages([]);
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <RotateCcw size={12} /> New chat
              </button>
            )}
            <ModeToggle mode={mode} onChange={setMode} layoutId="alijr-page-mode" />
          </div>
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-3xl border border-border/80 bg-card/50 shadow-2xl shadow-black/5 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {mode === 'chat' ? (
                <AliJRChat variant="page" onStartVoice={() => setMode('voice')} />
              ) : (
                <AliJRVoice variant="page" onSwitchToChat={() => setMode('chat')} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
