import { anthropic, MODEL } from "./anthropic";
import { supabase } from "./supabase";
import type { Fingerprint } from "./types";

// ─── Types ───────────────────────────────────────────────────────────

export type MessageIntensity = "light" | "medium" | "deep";

export type ComposedMessage = {
  body: string;
  intensity: MessageIntensity;
  content_id: string | null; // references content_items if a piece was recommended
  reasoning: string; // internal — why this message, not shown to user
};

type ContentItem = {
  id: string;
  topic: string;
  title: string;
  url: string | null;
  type: string;
  author: string | null;
  framing_notes: string | null;
};

type MessageRow = {
  direction: string;
  body: string;
  intensity: string | null;
  content_id: string | null;
  created_at: string;
};

// ─── JSON Schema ─────────────────────────────────────────────────────

const composerSchema = {
  type: "object",
  properties: {
    body: { type: "string", maxLength: 290 },
    intensity: {
      type: "string",
      enum: ["light", "medium", "deep"],
    },
    content_id: {
      type: ["string", "null"],
    },
    reasoning: { type: "string" },
  },
  required: ["body", "intensity", "content_id", "reasoning"],
  additionalProperties: false,
} as const;

// ─── System prompt ───────────────────────────────────────────────────

const COMPOSER_PROMPT = `You are writing a single SMS message for Selfish, an edutainment platform. You're texting someone you know well — you have their intellectual fingerprint and conversation history.

YOUR JOB: Write ONE text message that makes this person want to reply. You're a sharp, curious friend who just read something great and thought of them. Not a professor. Not a brand. A person.

THE MANDATE: Pick the most interesting thing this person could learn or think about next, and use their identity to make them care about it.

VOICE RULES:
- Write like you text a smart friend. Casual but substantive.
- Short sentences. No em-dashes in the SMS itself (save those for essays).
- Use "you" naturally. Reference specific things from their quiz results or past messages.
- Never say "intellectual identity" or "epistemic" or "framework" or any academic jargon.
- It should feel like this text could ONLY have been sent to this specific person.
- Under 290 characters. Tight. This is a text, not an email. If it feels long, cut it.

INTENSITY LEVELS — choose based on conversation_stage and rapport_level:

LIGHT (rapport 0-3, or when you've recently sent a deep one):
- Quick, easy to reply to right away
- A surprising fact, a one-line question, a "did you know"
- Goal: keep the conversation alive, build rapport
- Example: "Random thought — you've clashed with Singer twice now. Would it change anything if you knew he donates 40% of his income?"

MEDIUM (rapport 3-6, the bread and butter):
- A content recommendation with a personal frame
- Links the content to something specific about them
- Asks a question that's interesting but not heavy
- Example: "Found an essay that's basically the argument you keep almost-making about institutions vs individual choices. Worth 10 min. [link] Curious if it lands for you."

DEEP (rapport 6+, earned and spaced out):
- Surfaces a real tension in their thinking
- Should feel caring, not confrontational
- Only works if you've built context in previous messages
- Example: "Ok here's something I've been thinking about from your quizzes. You say policy should follow evidence, but on moral questions you trust your gut. So which is it? Not a gotcha — I genuinely think this is the most interesting thing about how you think."

CHOOSING WHAT TO SEND:
1. Look at curiosity_edges — what domains are they circling? Can you point them there?
2. Look at unresolved_questions — is there one worth surfacing right now?
3. Look at message history — don't repeat angles. Don't send two deep ones in a row.
4. Look at engagement_style — frame it the way that'll land for THIS person.
5. If content_items are available, pick one that connects. If none fit well, skip the link — a good question with no link beats a bad recommendation.

CONTENT RECOMMENDATIONS:
- If you recommend a piece of content, set content_id to its id
- Frame WHY this piece matters for THIS person — don't just say "check this out"
- If no content fits, set content_id to null and just send a question or observation

PRIMING:
- If conversation_stage is "new" or "warming_up", lean toward light/medium
- Don't go deep until you've sent at least 2-3 lighter messages first
- The first message ever should feel welcoming, not intense — reference their quiz in a way that shows you paid attention

OUTPUT:
Return a JSON object with:
- body: the SMS text (under 320 chars)
- intensity: "light", "medium", or "deep"
- content_id: the id of the recommended content item, or null
- reasoning: 1-2 sentences explaining why you chose this message (internal, user won't see this)`;

// ─── Data fetching ───────────────────────────────────────────────────

async function fetchFingerprint(email: string): Promise<Fingerprint | null> {
  const { data, error } = await supabase
    .from("user_memory")
    .select("fingerprint")
    .eq("email", email)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch fingerprint: ${error.message}`);
  return data?.fingerprint as Fingerprint | null;
}

async function fetchContentItems(topics: string[]): Promise<ContentItem[]> {
  // Fetch content for topics the user has engaged with, plus a few wildcards
  const { data, error } = await supabase
    .from("content_items")
    .select("id, topic, title, url, type, author, framing_notes")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to fetch content: ${error.message}`);
  return (data ?? []) as ContentItem[];
}

async function fetchMessageHistory(email: string, limit = 20): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("direction, body, intensity, content_id, created_at")
    .eq("user_email", email)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return (data ?? []) as MessageRow[];
}

// ─── Format for LLM ─────────────────────────────────────────────────

function formatContentForLLM(items: ContentItem[]): string {
  if (items.length === 0) return "(No curated content available yet)";
  return items
    .map((c) => {
      const parts = [`[${c.id}] "${c.title}" by ${c.author ?? "unknown"} (${c.type}, topic: ${c.topic})`];
      if (c.url) parts.push(`  URL: ${c.url}`);
      if (c.framing_notes) parts.push(`  Why it matters: ${c.framing_notes}`);
      return parts.join("\n");
    })
    .join("\n\n");
}

function formatHistoryForLLM(messages: MessageRow[]): string {
  if (messages.length === 0) return "(No message history — this is the first message to this user)";
  return messages
    .map((m) => {
      const who = m.direction === "outbound" ? "SELFISH" : "USER";
      const meta = m.direction === "outbound" && m.intensity ? ` [${m.intensity}]` : "";
      return `[${who}${meta}] ${m.body}`;
    })
    .join("\n");
}

// ─── Core composer function ──────────────────────────────────────────

export async function composeMessage(email: string): Promise<ComposedMessage> {
  const [fingerprint, messages] = await Promise.all([
    fetchFingerprint(email),
    fetchMessageHistory(email),
  ]);

  if (!fingerprint) {
    throw new Error(`No fingerprint found for ${email} — has the user completed a quiz?`);
  }

  // Fetch content relevant to user's topics
  const content = await fetchContentItems(fingerprint.topics_engaged);

  const userContent = `USER FINGERPRINT:
${JSON.stringify(fingerprint, null, 2)}

AVAILABLE CONTENT TO RECOMMEND:
${formatContentForLLM(content)}

MESSAGE HISTORY:
${formatHistoryForLLM(messages)}

Compose the next SMS for this user.`;

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 4000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: {
        type: "json_schema",
        schema: composerSchema,
      },
    },
    system: COMPOSER_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  const message = await stream.finalMessage();

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Composer returned no text content");
  }

  return JSON.parse(textBlock.text) as ComposedMessage;
}
