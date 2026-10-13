'use client';

import {
  LiveKitRoom,
  RoomAudioRenderer,
  useLocalParticipant,
  useTrackVolume,
  useTranscriptions,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { LocalAudioTrack } from 'livekit-client';
import { Loader2, MessageSquare, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Orb, type OrbState } from './Orb';

type Connection = { token: string; serverUrl: string };

const STATE_LABELS: Record<OrbState, string> = {
  idle: 'Ready',
  connecting: 'Twin is joining…',
  listening: 'Listening',
  thinking: 'Thinking',
  speaking: 'Speaking',
};

function toOrbState(state: string): OrbState {
  if (state === 'listening' || state === 'thinking' || state === 'speaking') return state;
  return 'connecting';
}

function useElapsed() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function ActiveCall({ variant, onEnd }: { variant: 'widget' | 'page'; onEnd: () => void }) {
  const { state, audioTrack } = useVoiceAssistant();
  const agentLevel = useTrackVolume(audioTrack);
  const { isMicrophoneEnabled, localParticipant, microphoneTrack } = useLocalParticipant();
  const micLevel = useTrackVolume(microphoneTrack?.track as LocalAudioTrack | undefined);
  const transcriptions = useTranscriptions();
  const elapsed = useElapsed();
  const [slowJoin, setSlowJoin] = useState(false);

  const orbState = toOrbState(state);
  const level =
    orbState === 'speaking' ? agentLevel * 1.6 : orbState === 'listening' && isMicrophoneEnabled ? micLevel : 0;

  useEffect(() => {
    if (orbState !== 'connecting') {
      setSlowJoin(false);
      return;
    }
    const id = setTimeout(() => setSlowJoin(true), 15000);
    return () => clearTimeout(id);
  }, [orbState]);

  const captions = useMemo(
    () =>
      transcriptions
        .filter((t) => t.text.trim())
        .slice(-4)
        .map((t) => ({
          id: t.streamInfo.id,
          you: t.participantInfo.identity === localParticipant.identity,
          text: t.text,
        })),
    [transcriptions, localParticipant.identity],
  );

  const page = variant === 'page';

  return (
    <div className="flex h-full flex-col items-center justify-between gap-4 px-4 py-6">
      <div className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
        Live · {elapsed}
      </div>

      <div className="flex flex-col items-center gap-5">
        <Orb state={orbState} level={level} size={page ? 220 : 150} />
        <motion.p key={orbState} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium">
          {!isMicrophoneEnabled && orbState === 'listening' ? 'You are muted' : STATE_LABELS[orbState]}
        </motion.p>
        {slowJoin && (
          <p className="max-w-xs text-center text-xs text-muted-foreground">
            The twin is taking longer than usual to join. The voice server may be waking up, so hang tight or try text chat.
          </p>
        )}
      </div>

      <div className={cn('w-full space-y-2 overflow-hidden', page ? 'max-w-xl min-h-[132px]' : 'min-h-[96px]')}>
        <AnimatePresence initial={false}>
          {captions.map((c) => (
            <motion.p
              key={c.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn('text-center leading-snug', page ? 'text-base' : 'text-sm', c.you ? 'text-muted-foreground' : 'text-foreground')}
            >
              <span className="mr-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {c.you ? 'You' : 'Twin'}
              </span>
              {c.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)}
          aria-label={isMicrophoneEnabled ? 'Mute' : 'Unmute'}
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full border transition',
            isMicrophoneEnabled ? 'border-border bg-card hover:bg-muted' : 'border-amber-500/40 bg-amber-500/15 text-amber-500',
          )}
        >
          {isMicrophoneEnabled ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          type="button"
          onClick={onEnd}
          aria-label="End call"
          className="flex h-12 items-center gap-2 rounded-full bg-red-500 px-5 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition hover:bg-red-600"
        >
          <PhoneOff size={17} /> End
        </button>
      </div>
    </div>
  );
}

export default function AliJRVoice({
  variant = 'widget',
  onSwitchToChat,
}: {
  variant?: 'widget' | 'page';
  onSwitchToChat?: () => void;
}) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const page = variant === 'page';

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/alijr/token', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start a voice session.');
      setConnection({ token: data.token, serverUrl: data.serverUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start a voice session.');
    } finally {
      setLoading(false);
    }
  };

  if (connection) {
    return (
      <LiveKitRoom
        serverUrl={connection.serverUrl}
        token={connection.token}
        connect
        audio
        video={false}
        onDisconnected={() => setConnection(null)}
        onMediaDeviceFailure={() => setError('Microphone access was blocked. Allow it in your browser to talk.')}
        className="h-full"
      >
        <ActiveCall variant={variant} onEnd={() => setConnection(null)} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center">
      <Orb size={page ? 200 : 130} />
      <div className="space-y-1.5">
        <h2 className={cn('font-semibold tracking-tight', page ? 'text-2xl sm:text-3xl' : 'text-lg')}>Talk to the Agentic Twin</h2>
        <p className={cn('mx-auto text-muted-foreground', page ? 'max-w-md text-sm' : 'max-w-xs text-xs')}>
          A real-time voice conversation powered by Gemini Live. Your microphone is only used during the call.
        </p>
      </div>
      <motion.button
        type="button"
        onClick={start}
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-lg transition disabled:opacity-60"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <Phone size={17} />}
        {loading ? 'Connecting…' : 'Start voice call'}
      </motion.button>
      {error && <p className="max-w-xs text-xs text-destructive">{error}</p>}
      {onSwitchToChat && (
        <button
          type="button"
          onClick={onSwitchToChat}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
        >
          <MessageSquare size={13} /> Prefer typing? Switch to chat
        </button>
      )}
    </div>
  );
}
