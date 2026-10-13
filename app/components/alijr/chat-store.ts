'use client';

import { Chat, useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { AliJRMessage } from '../../../lib/alijr/types';

// One conversation shared by the floating widget and the /alijr page across navigations.
let chat: Chat<AliJRMessage> | null = null;

function getChat() {
  if (!chat) {
    chat = new Chat<AliJRMessage>({ transport: new DefaultChatTransport({ api: '/api/chat' }) });
  }
  return chat;
}

export function useAliJRChat() {
  return useChat<AliJRMessage>({ chat: getChat() });
}

export const SUGGESTIONS = [
  { title: 'Trek Health', prompt: 'What did you build at Trek Health?' },
  { title: 'ElectroVector', prompt: 'Walk me through the ElectroVector project.' },
  { title: 'Hiring pitch', prompt: 'Why should I hire Ali?' },
  { title: 'Coursework', prompt: 'Which machine learning courses has Ali taken?' },
];
