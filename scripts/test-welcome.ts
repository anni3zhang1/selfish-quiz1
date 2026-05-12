/**
 * Test script: generates welcome hooks for a user's most recent quiz.
 * Run: npx tsx scripts/test-welcome.ts [email]
 */
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const val = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

// Direct imports after env is loaded
import { anthropic, MODEL } from "../src/lib/anthropic";
import { supabase } from "../src/lib/supabase";

type AnswerEntry = {
  question_id: string;
  question_text: string;
  option_id?: string;
  option_text?: string;
  freeform?: string;
};

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

async function main() {
  const email = process.argv[2] || "bobcats@gmail.com";
  console.log(`\nGenerating welcome hooks for: ${email}\n`);

  // Get most recent completed session
  const { data: sessions } = await supabase
    .from("quiz_sessions")
    .select("id, topic, answers")
    .eq("email", email)
    .eq("status", "complete")
    .order("created_at", { ascending: false })
    .limit(1);

  if (!sessions?.length) {
    console.log("No completed sessions found.");
    return;
  }

  const session = sessions[0];
  const answers = session.answers as AnswerEntry[];

  console.log(`Quiz topic: ${session.topic}`);
  console.log(`Answers: ${answers.length} questions\n`);

  // Get fingerprint if available
  const { data: memory } = await supabase
    .from("user_memory")
    .select("fingerprint")
    .eq("email", email)
    .maybeSingle();

  const fingerprint = memory?.fingerprint;

  // Format answers
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

  const userMessage = `Quiz topic: ${session.topic}
${identityContext}
Their answers:
${answersFormatted}

Generate 3 hooks for what they should explore next. Each hook must grow out of this specific topic and their specific answers.`;

  console.log("Calling Claude for hooks...\n");

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
  const text = message.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("No text in response");
  const parsed = JSON.parse(text.text) as { hooks: { hook: string; domain: string; reasoning: string }[] };

  console.log("=== HOOKS ===\n");
  for (const h of parsed.hooks) {
    console.log(`  "${h.hook}"`);
    console.log(`  domain: ${h.domain}`);
    console.log(`  why: ${h.reasoning}`);
    console.log();
  }

  // Preview the welcome SMS
  const topicDisplay = session.topic
    .split(/[-_]/)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  console.log("=== WELCOME SMS PREVIEW ===\n");
  const sms =
    `Hey! Here are your Selfish results on ${topicDisplay}: https://selfish.world/results/${session.id}\n\n` +
    `I'm your thinking partner. I'll send you ideas, questions, and content to help sharpen your thinking.\n\n` +
    `What are you curious to explore next?\n` +
    `1. ${parsed.hooks[0].hook}\n` +
    `2. ${parsed.hooks[1].hook}\n` +
    `3. ${parsed.hooks[2].hook}`;

  console.log(sms);
  console.log(`\nChar count: ${sms.length}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
