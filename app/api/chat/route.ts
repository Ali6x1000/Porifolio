import { convertToModelMessages, isStepCount, streamText, type UIMessage } from 'ai';
import { createChatModel } from '../../../lib/alijr/models';
import { TEXT_SYSTEM_PROMPT } from '../../../lib/alijr/prompt';
import { alijrTools } from '../../../lib/alijr/tools';

export const maxDuration = 60;

const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 2000;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const recent = messages.slice(-MAX_HISTORY).map((m) => ({
    ...m,
    parts: m.parts.map((p) =>
      p.type === 'text' ? { ...p, text: p.text.slice(0, MAX_MESSAGE_CHARS) } : p,
    ),
  }));

  const result = streamText({
    model: createChatModel(),
    system: TEXT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(recent),
    tools: alijrTools,
    stopWhen: isStepCount(6),
    // Each attempt already walks the whole fallback chain.
    maxRetries: 1,
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: false,
    onError: (error) => {
      console.error('[alijr chat]', error);
      return 'AliJR hit a snag reaching the model. Please try again in a moment.';
    },
  });
}
