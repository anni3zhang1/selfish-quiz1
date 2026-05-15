import { anthropic, MODEL } from "./anthropic";
import { supabase } from "@/lib/supabase";
import { sendSMS, replySMS } from "@/lib/sms";
import type { AnswerEntry, Fingerprint } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://selfish.world";

// ─── Welcome hook generation ────────────────────────────────────────

const HOOKS_PROMPT = `You just helped someone explore a topic through a quiz. Now you need to give them 3 options for what to dig into next — via SMS.

RULES:
- Each hook must be DIRECTLY connected to the quiz topic and what the user actually said
- Each hook should approach the topic from a different angle: one could challenge their position, one could deepen it, one could connect it to something surprising
- Each hook should leave an ITCH — something unresolved that makes you need to know more. Questions, "wait really?" moments, or things that don't quite make sense yet
- Under 60 characters each
- Write like you're texting a friend something that broke your brain a little, NOT stating a fact or summarizing a story
- The reader should feel like they're MISSING something they want to know, not like they just learned something
- No colons, no "How X does Y" formulas, no subtitle structures, no matter-of-fact statements
- No generic options. "Learn more about X" is never acceptable
- Think: what would make THIS specific person, based on THESE specific answers, tap "yes tell me more"

GOOD hooks (for a democracy quiz):
- "Wait, 99 random people solved abortion faster than parliament?"
- "What if AI is actually better at consensus than voting?"
- "Can a dictatorship be more democratic than a democracy?"

BAD hooks:
- "Ireland's citizens' assembly cracked abortion in 5 weekends" (interesting fact, but no itch — I already got the punchline)
- "Taiwan used AI to find consensus" (states a fact, doesn't make me curious)
- "Explore Middle East geopolitics" (boring, generic)
- "The philosophy of just war theory" (too academic)
- "Understanding both sides of the conflict" (preachy, obvious)`;

const hooksSchema = {
  type: "object",
  properties: {
    hooks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          hook: { type: "string", maxLength: 80 },
          domain: { type: "string" },
          reasoning: { type: "string" },
        },
        required: ["hook", "domain", "reasoning"],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: ["hooks"],
  additionalProperties: false,
};

type WelcomeHook = {
  hook: string;
  domain: string;
  reasoning: string;
};

async function generateWelcomeHooks(
  topic: string,
  answers: AnswerEntry[],
  fingerprint: Fingerprint | null
): Promise<WelcomeHook[]> {
  const answersFormatted = answers
    .map((a) => {
      const parts = [`Q: ${a.question_text}`];
      if (a.option_text) parts.push(`  Chose: ${a.option_text}`);
      if (a.freeform) parts.push(`  Said: "${a.freeform}"`);
      return parts.join("\n");
    })
    .join("\n\n");

  const identityContext = fingerprint?.core_identity
    ? `\nWho this person is intellectually: ${fingerprint.core_identity}\n`
    : "";

  const userMessage = `Quiz topic: ${topic}
${identityContext}
Their answers:
${answersFormatted}

Generate 3 hooks for what they should explore next. Each hook must grow out of this specific topic and their specific answers.`;

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 1000,
    system: HOOKS_PROMPT,
    messages: [{ role: "user", content: userMessage }],
    output_config: {
      format: {
        type: "json_schema",
        schema: hooksSchema,
      },
    },
  });

  const message = await stream.finalMessage();
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Hook generation returned no text");
  }
  const parsed = JSON.parse(textBlock.text) as { hooks: WelcomeHook[] };
  return parsed.hooks;
}

// ─── Send welcome sequence ──────────────────────────────────────────

/**
 * Sends the welcome sequence after a user's first quiz completion.
 * Generates topic-specific hooks via a lightweight LLM call, then sends:
 * 1. Link to their results
 * 2. Introduction to the SMS thinking partner
 * 3. MC question with 3 provocative, topic-anchored hooks
 */
export async function sendWelcomeSequence(
  email: string,
  sessionId: string,
  topic: string
): Promise<void> {
  // Look up user's phone
  const { data: user } = await supabase
    .from("users")
    .select("phone")
    .eq("email", email)
    .maybeSingle();

  if (!user?.phone) {
    console.log(`Welcome sequence skipped — no phone for ${email}`);
    return;
  }

  // Check they haven't already been messaged (safety guard)
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("user_email", email);

  if (count && count > 0) {
    console.log(`Welcome sequence skipped — ${email} already has messages`);
    return;
  }

  // Fetch the quiz session answers for hook generation
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("answers")
    .eq("id", sessionId)
    .single();

  const answers = (session?.answers as AnswerEntry[]) ?? [];

  // Fetch the fingerprint for identity context (optional — may not exist yet for first quiz)
  const { data: memory } = await supabase
    .from("user_memory")
    .select("fingerprint")
    .eq("email", email)
    .maybeSingle();

  const fingerprint = memory?.fingerprint as Fingerprint | null;

  // Generate topic-specific hooks
  let hooks: WelcomeHook[] = [];
  try {
    hooks = await generateWelcomeHooks(topic, answers, fingerprint);
    console.log(`Generated ${hooks.length} welcome hooks for ${email}`);
  } catch (err) {
    console.error("Hook generation failed, sending simple welcome:", err);
  }

  // Build the results link
  const resultsLink = `${SITE_URL}/results/${sessionId}`;

  // Format the topic name nicely
  const topicDisplay = topic
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // ── Two-message strategy ──────────────────────────────────────────
  // Message 1: Intro + MC question (NO link — Linq blocks links in first messages)
  // Message 2: Results link as immediate follow-up (links allowed in follow-ups)
  //
  // For Twilio, both messages work fine either way. The split keeps
  // behavior consistent across providers.

  let introBody: string;

  if (hooks.length >= 3) {
    introBody =
      `Hey! I'm Feynman, your thinking partner. I'll send you ideas, questions, and rabbit holes to sharpen your thinking.\n\n` +
      `Based on your ${topicDisplay} quiz — what are you curious to explore next?\n` +
      `1. ${hooks[0].hook}\n` +
      `2. ${hooks[1].hook}\n` +
      `3. ${hooks[2].hook}`;
  } else {
    // Fallback — no hooks generated
    introBody =
      `Hey! I'm Feynman, your thinking partner. I'll send you ideas, questions, and rabbit holes to sharpen your thinking based on your ${topicDisplay} quiz. Talk soon!`;
  }

  const linkBody = `Here are your results: ${resultsLink}`;

  // Send message 1: intro (creates the chat for Linq)
  const result = await sendSMS(email, user.phone, introBody);

  // Log message 1
  const hookDomains = hooks.map((h) => h.domain).join("|");
  const contentId = hooks.length >= 3
    ? `welcome:${sessionId}:${hookDomains}`
    : `welcome:${sessionId}`;

  await supabase.from("messages").insert({
    user_email: email,
    phone: user.phone,
    direction: "outbound",
    body: introBody,
    intensity: "light",
    content_id: contentId,
  });

  // Send message 2: results link (follow-up — links allowed)
  const linkResult = await replySMS(
    email,
    user.phone,
    linkBody,
    result.chatId
  );

  await supabase.from("messages").insert({
    user_email: email,
    phone: user.phone,
    direction: "outbound",
    body: linkBody,
    intensity: "light",
    content_id: `welcome_link:${sessionId}`,
  });

  console.log(
    `Welcome sequence sent to ${email} (${result.provider}: msg1=${result.messageId}, msg2=${linkResult.messageId}), ${hooks.length} hooks offered`
  );
}

// ─── Detect MC reply ────────────────────────────────────────────────

/**
 * Check if an inbound message is a reply to the welcome MC question.
 * Returns the chosen hook domain, or null if not a MC reply.
 */
export async function detectWelcomeReply(
  email: string,
  body: string
): Promise<{ chosenEdge: string; edgeIndex: number } | null> {
  const trimmed = body.trim();

  // Only match single-digit replies: "1", "2", "3"
  if (!/^[1-3]$/.test(trimmed)) return null;

  const choiceIndex = parseInt(trimmed, 10) - 1;

  // Check if the last outbound message was a welcome message
  const { data: lastOutbound } = await supabase
    .from("messages")
    .select("content_id, body")
    .eq("user_email", email)
    .eq("direction", "outbound")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastOutbound?.content_id?.startsWith("welcome:")) return null;

  // Parse the hook domains from content_id
  // Format: welcome:<sessionId>:<domain1>|<domain2>|<domain3>
  const parts = lastOutbound.content_id.split(":");
  if (parts.length < 3) return null;

  const domains = parts[2].split("|");
  if (choiceIndex >= domains.length) return null;

  return {
    chosenEdge: domains[choiceIndex],
    edgeIndex: choiceIndex,
  };
}
