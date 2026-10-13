import type { InferUITools, UIDataTypes, UIMessage } from 'ai';
import type { alijrTools } from './tools';

export type AliJRMessage = UIMessage<unknown, UIDataTypes, InferUITools<typeof alijrTools>>;
