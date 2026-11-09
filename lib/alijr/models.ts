import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import type { LanguageModelV4, LanguageModelV4CallOptions, LanguageModelV4StreamPart } from '@ai-sdk/provider';
import { APICallError, wrapLanguageModel } from 'ai';
import {
  ALIJR_CHAT_MODEL,
  ALIJR_FIRST_OUTPUT_TIMEOUT_MS,
  ALIJR_GEMINI_FALLBACKS,
  ALIJR_GROQ_MODELS,
} from './config';

// Groq's free tier allows ~8K tokens per minute, so long search results are trimmed for it.
const GROQ_TOOL_RESULT_CHARS = 5000;

type Candidate = {
  model: LanguageModelV4;
  prepare?: (params: LanguageModelV4CallOptions) => LanguageModelV4CallOptions;
};

function compactToolResults(
  params: LanguageModelV4CallOptions,
  maxChars: number,
): LanguageModelV4CallOptions {
  return {
    ...params,
    prompt: params.prompt.map((message) => {
      if (message.role !== 'tool') return message;
      return {
        ...message,
        content: message.content.map((part) => {
          if (part.type !== 'tool-result') return part;
          const { output } = part;
          const text =
            output.type === 'text' ? output.value
            : output.type === 'json' ? JSON.stringify(output.value)
            : null;
          if (text === null || text.length <= maxChars) return part;
          return { ...part, output: { type: 'text' as const, value: `${text.slice(0, maxChars)} …[truncated]` } };
        }),
      };
    }),
  };
}

function describe(error: unknown): string {
  if (APICallError.isInstance(error)) return `${error.statusCode ?? 'network'} ${error.message}`;
  return error instanceof Error ? error.message : String(error);
}

class NoOutputError extends Error {
  constructor(ms: number) {
    super(`no output within ${ms}ms`);
    this.name = 'NoOutputError';
  }
}

type StreamResult = Awaited<ReturnType<LanguageModelV4['doStream']>>;

// Emitted before the model has actually produced anything, so they don't count as output.
const PREAMBLE_PARTS = new Set<LanguageModelV4StreamPart['type']>(['stream-start', 'response-metadata', 'raw']);

/**
 * Overloaded Gemini models sometimes accept the request and then never answer. Wait for the first real
 * stream part under a deadline, so a stalled model fails fast instead of holding the function open.
 */
async function streamWithDeadline(model: LanguageModelV4, params: LanguageModelV4CallOptions): Promise<StreamResult> {
  const controller = new AbortController();
  const signal = params.abortSignal ? AbortSignal.any([params.abortSignal, controller.signal]) : controller.signal;
  const deadline = new Promise<never>((_, reject) => {
    controller.signal.addEventListener('abort', () => reject(controller.signal.reason), { once: true });
  });
  deadline.catch(() => {});
  const timer = setTimeout(() => controller.abort(new NoOutputError(ALIJR_FIRST_OUTPUT_TIMEOUT_MS)), ALIJR_FIRST_OUTPUT_TIMEOUT_MS);

  let reader: ReadableStreamDefaultReader<LanguageModelV4StreamPart> | undefined;
  try {
    const result = await Promise.race([model.doStream({ ...params, abortSignal: signal }), deadline]);
    const activeReader = result.stream.getReader();
    reader = activeReader;
    const buffered: LanguageModelV4StreamPart[] = [];
    for (;;) {
      const { done, value } = await Promise.race([activeReader.read(), deadline]);
      if (done) break;
      if (value.type === 'error') throw value.error;
      buffered.push(value);
      if (!PREAMBLE_PARTS.has(value.type)) break;
    }
    clearTimeout(timer);

    const stream = new ReadableStream<LanguageModelV4StreamPart>({
      start(out) {
        for (const part of buffered) out.enqueue(part);
      },
      async pull(out) {
        const { done, value } = await activeReader.read();
        if (done) out.close();
        else out.enqueue(value);
      },
      cancel(reason) {
        return activeReader.cancel(reason);
      },
    });
    return { ...result, stream };
  } catch (error) {
    clearTimeout(timer);
    reader?.cancel().catch(() => {});
    if (!controller.signal.aborted) controller.abort();
    throw error;
  }
}

/**
 * Gemini first, then other Gemini models on the same key, then Groq models when every Gemini model is
 * overloaded, stalled or rate limited. Create one per request: once a backup succeeds, the remaining
 * tool-loop steps stay on it.
 */
export function createChatModel(): LanguageModelV4 {
  const geminiIds = [ALIJR_CHAT_MODEL, ...ALIJR_GEMINI_FALLBACKS].filter((id, i, all) => all.indexOf(id) === i);
  const candidates: Candidate[] = [
    ...geminiIds.map((id) => ({ model: google(id) })),
    ...(process.env.GROQ_API_KEY
      ? ALIJR_GROQ_MODELS.map((id) => ({
          model: groq(id),
          prepare: (params: LanguageModelV4CallOptions) => compactToolResults(params, GROQ_TOOL_RESULT_CHARS),
        }))
      : []),
  ];

  let active = 0;

  return wrapLanguageModel({
    model: candidates[0].model,
    middleware: {
      specificationVersion: 'v4',
      wrapStream: async ({ params }) => {
        let lastError: unknown;
        for (; active < candidates.length; active++) {
          const { model, prepare } = candidates[active];
          try {
            return await streamWithDeadline(model, prepare ? prepare(params) : params);
          } catch (error) {
            if (params.abortSignal?.aborted) throw error;
            console.warn(`[alijr chat] ${model.modelId} failed: ${describe(error)}`);
            lastError = error;
          }
        }
        active = 0;
        throw lastError;
      },
    },
  });
}
