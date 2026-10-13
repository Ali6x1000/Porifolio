import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import type { LanguageModelV4, LanguageModelV4CallOptions } from '@ai-sdk/provider';
import { APICallError, wrapLanguageModel } from 'ai';
import { ALIJR_CHAT_MODEL, ALIJR_GROQ_MODELS } from './config';

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

/**
 * Gemini first, then Groq models when it is overloaded or rate limited. Create one per request:
 * once a backup succeeds, the remaining tool-loop steps stay on it.
 */
export function createChatModel(): LanguageModelV4 {
  const primary = google(ALIJR_CHAT_MODEL);
  const backups: Candidate[] = process.env.GROQ_API_KEY
    ? ALIJR_GROQ_MODELS.map((id) => ({
        model: groq(id),
        prepare: (params) => compactToolResults(params, GROQ_TOOL_RESULT_CHARS),
      }))
    : [];

  let active = -1;

  return wrapLanguageModel({
    model: primary,
    middleware: {
      specificationVersion: 'v4',
      wrapStream: async ({ doStream, params }) => {
        let lastError: unknown;
        if (active < 0) {
          try {
            return await doStream();
          } catch (error) {
            if (params.abortSignal?.aborted) throw error;
            console.warn(`[alijr chat] ${primary.modelId} failed, falling back: ${describe(error)}`);
            lastError = error;
            active = 0;
          }
        }
        for (; active < backups.length; active++) {
          const { model, prepare } = backups[active];
          try {
            return await model.doStream(prepare ? prepare(params) : params);
          } catch (error) {
            if (params.abortSignal?.aborted) throw error;
            console.warn(`[alijr chat] ${model.modelId} failed: ${describe(error)}`);
            lastError = error;
          }
        }
        active = -1;
        throw lastError;
      },
    },
  });
}
