import OpenAI from 'openai';

let client: OpenAI | null = null;

/**
 * Returns a lazy-initialized OpenAI singleton.
 * Throws a descriptive error if OPENAI_API_KEY is not configured.
 */
export function getOpenAIClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        '[AI] OPENAI_API_KEY is not set. Add it to apps/cms/.env to enable AI features.',
      );
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
