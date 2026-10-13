'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, RotateCcw, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AliJRChat } from './alijr/AliJRChat';
import { useAliJRChat } from './alijr/chat-store';
import { ModeToggle, type AliJRMode } from './alijr/ModeToggle';
import { Orb } from './alijr/Orb';

const AliJRVoice = dynamic(() => import('./alijr/AliJRVoice'), { ssr: false });

const TEASER_KEY = 'alijr-teaser-dismissed';

export default function ChatBot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AliJRMode>('chat');
  const [teaser, setTeaser] = useState(false);
  const { messages, setMessages, stop } = useAliJRChat();

  useEffect(() => {
    if (sessionStorage.getItem(TEASER_KEY)) return;
    const id = setTimeout(() => setTeaser(true), 4000);
    return () => clearTimeout(id);
  }, []);

  const dismissTeaser = () => {
    setTeaser(false);
    sessionStorage.setItem(TEASER_KEY, '1');
  };

  const openPanel = (nextMode: AliJRMode = mode) => {
    dismissTeaser();
    setMode(nextMode);
    setOpen(true);
  };

  if (pathname?.startsWith('/alijr')) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
          >
            <AnimatePresence>
              {teaser && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.95 }}
                  className="relative mb-2 hidden max-w-[220px] rounded-2xl rounded-br-md border border-border bg-card/95 px-4 py-3 text-sm shadow-xl backdrop-blur sm:block"
                >
                  <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={dismissTeaser}
                    className="absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
                  >
                    <X size={11} />
                  </button>
                  <button type="button" onClick={() => openPanel('chat')} className="text-left">
                    <span className="font-medium">Hi, I&apos;m AliJR</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      Ali&apos;s AI twin. Ask me about his work, or talk to me by voice.
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              type="button"
              onClick={() => openPanel()}
              aria-label="Open AliJR assistant"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-full shadow-2xl shadow-indigo-500/30"
            >
              <Orb size={60} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            style={{ transformOrigin: 'bottom right' }}
            className="fixed bottom-4 right-4 z-50 flex h-[min(660px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-border bg-background/85 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:right-6 sm:w-[400px]"
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
              <Orb size={34} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">AliJR</p>
                <p className="flex items-center gap-1.5 whitespace-nowrap text-[11px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Ali&apos;s AI twin
                </p>
              </div>
              <ModeToggle mode={mode} onChange={setMode} layoutId="alijr-widget-mode" />
              <div className="flex items-center">
                {mode === 'chat' && messages.length > 0 && (
                  <button
                    type="button"
                    aria-label="New chat"
                    title="New chat"
                    onClick={() => {
                      stop();
                      setMessages([]);
                    }}
                    className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
                <Link
                  href="/alijr"
                  aria-label="Open full page"
                  title="Open full page"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <Maximize2 size={15} />
                </Link>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1">
              {mode === 'chat' ? (
                <AliJRChat variant="widget" onStartVoice={() => setMode('voice')} />
              ) : (
                <AliJRVoice variant="widget" onSwitchToChat={() => setMode('chat')} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
