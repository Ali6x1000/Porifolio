import path from 'node:path';
import { ALIJR_EMBED_MODEL } from './config';

// BGE models expect this instruction on queries (not on documents).
const QUERY_INSTRUCTION = 'Represent this sentence for searching relevant passages: ';

type Extractor = (
  input: string | string[],
  options: { pooling: 'cls'; normalize: boolean },
) => Promise<{ tolist(): number[][] }>;

let extractor: Promise<Extractor> | null = null;

function getExtractor(): Promise<Extractor> {
  if (!extractor) {
    extractor = (async () => {
      const { pipeline, env } = await import('@huggingface/transformers');
      env.localModelPath = path.join(process.cwd(), 'models');
      env.allowRemoteModels = false;
      const pipe = await pipeline('feature-extraction', ALIJR_EMBED_MODEL, { dtype: 'q8' });
      return pipe as unknown as Extractor;
    })().catch((error) => {
      extractor = null;
      throw error;
    });
  }
  return extractor;
}

export async function embedQuery(text: string): Promise<number[]> {
  const extract = await getExtractor();
  const output = await extract(QUERY_INSTRUCTION + text, { pooling: 'cls', normalize: true });
  return output.tolist()[0];
}
