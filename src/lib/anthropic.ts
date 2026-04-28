import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (client) return client;
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY must be set");
  }
  client = new Anthropic();
  return client;
}

export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    const c = getClient();
    const value = c[prop as keyof Anthropic];
    return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(c) : value;
  },
});

export const MODEL = "claude-opus-4-7";
