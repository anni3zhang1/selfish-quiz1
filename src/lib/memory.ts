import { anthropic, MODEL } from "./anthropic";
import { supabase } from "./supabase";
import type {
  AnswerEntry,
  Constellation,
  Fingerprint,
  SynthesisTrigger,
} from "./types";

// ─── JSON Schema for structured output ───────────────────────────────

const fingerprintSchema = {
  type: "object",
  properties: {
    core_identity: { type: "string" },
    thinker_map: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          relationship_types: {
            type: "array",
            items: { type: "string" },
          },
          topics: {
            type: "array",
            items: { type: "string" },
          },
          significance: { type: "string" },
        },
        required: ["name", "relationship_types", "topics", "significance"],
        additionalProperties: false,
      },
    },
    curiosity_edges: {
      type: "array",
      items: {
        type: "object",
        properties: {
          domain: { type: "string" },
          signal: { type: "string" },
          entry_angle: { type: "string" },
        },
        required: ["domain", "signal", "entry_angle"],
        additionalProperties: false,
      },
    },
    unresolved_questions: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          evidence: { type: "string" },
          why_it_matters: { type: "string" },
        },
        required: ["question", "evidence", "why_it_matters"],
        additionalProperties: false,
      },
    },
    engagement_style: {
      type: "object",
      properties: {
        reasoning_mode: { type: "string" },
        framing_preference: { type: "string" },
        notes: { type: "string" },
      },
      required: ["reasoning_mode", "framing_preference", "notes"],
      additionalProperties: false,
    },
    topics_engaged: {
      type: "array",
      items: { type: "string" },
    },
    conversation_stage: {
      type: "string",
      enum: ["new", "warming_up", "active", "deep"],
    },
    rapport_level: { type: "number" },
  },
  required: [
    "core_identity",
    "thinker_map",
    "curiosity_edges",
    "unresolved_questions",
    "engagement_style",
    "topics_engaged",
    "conversation_stage",
    "rapport_level",
  ],
  additionalProperties: false,
} as const;

// ─── System prompts ──────────────────────────────────────────────────

const FULL_SYNTHESIS_PROMPT = `You are building an intellectual fingerprint for a user of Selfish, an edutainment platform. Your job is to synthesize everything we know about this person into a structured profile that will power personalized content recommendations via SMS.

CONTEXT: The user has taken one or more quizzes on controversial topics. Each quiz produced a "constellation" — 7 thinkers matched to them in different relationship types (mirror, complement, precursor, antagonist, horizon, shadow, integrated_self). You have their quiz answers and constellation results.

YOUR TASK: Produce a fingerprint that captures who this person is intellectually and — critically — where they should go next. This fingerprint will be used by an SMS composer to send them content: book recs, essay links, questions that make them think. Identity is the lens for content delivery, not the destination.

VOICE: Write like a sharp, warm friend — not like a professor. The person reading the SMS that comes from this fingerprint should feel like they're hearing from someone who genuinely knows them and is excited to share something, not someone grading their intellectual consistency. Avoid academic jargon. Use "you" naturally. Be specific and vivid, not abstract.

FIELD GUIDANCE:

core_identity: 2-3 sentences capturing who this person is when they think. Not clinical — write it like you're describing a friend to another friend. "She's the person at dinner who'll agree with your conclusion but immediately ask what you'd do if the facts were different" is better than "epistemically oriented toward counterfactual reasoning."

thinker_map: Which thinkers have appeared across their quizzes, in what relationship types, and why that pattern matters. Only include thinkers who appeared — don't invent. If a thinker appears in multiple quizzes, note the recurrence and what it reveals.

curiosity_edges: THIS IS THE MOST IMPORTANT FIELD. These are intellectual territories the user is circling but hasn't fully entered — domains, ideas, or questions that their quiz answers gesture toward. Think beyond the thinkers: what knowledge domains would genuinely expand their thinking?

The entry_angle is CRITICAL — it's shown directly to the user as an SMS multiple-choice option right after their quiz, so it must be:
- Short and punchy (under 60 characters ideally, 80 max)
- A provocative claim, question, or framing — something that makes you go "wait, really?"
- Connected to the specific quiz topic they just completed — it should feel like a natural "what's next" from what they were just thinking about
- Written like a headline you'd click, not an academic description

GOOD entry_angles (for someone who just did a critical thinking quiz):
- "Why your gut outperforms most 'rational' models"
- "The case that consciousness is a useful illusion"
- "How poker players think about irreversible choices"

BAD entry_angles:
- "Kahneman's work on cognitive bias would give you ammo..." (too long, too explanatory)
- "Explore behavioral economics" (boring, generic, not a hook)
- "Philosophy of mind" (just a domain name — no reason to care)

The domain field captures the broad territory (e.g. "behavioral economics"). The entry_angle is the hook that makes someone actually want to go there.

Aim for 3-5 edges. Quality over quantity. Each one should make someone go "oh, I DO want to look into that."

unresolved_questions: Tensions in the user's own thinking that they haven't settled. These should feel like the kind of question a good friend would ask over drinks — pointed but caring, not gotcha-style.
- Good: "You keep saying policy should follow the evidence, but when it comes to moral questions you trust your instincts over the data. So which is it — do you believe in evidence or not?"
- Bad: "What is your epistemological framework for moral claims?" (nobody talks like this)
- Aim for 2-4 questions. Write them the way you'd actually say them out loud.

engagement_style: How this person thinks and argues. Not in academic terms — in human terms. Do they jump to examples? Do they want to know the principle first? Do they argue by feel and then backfill the logic? Do they want to be challenged or reassured? This shapes how the SMS composer talks to them.
- Good: { reasoning_mode: "gut-first, logic-second — she'll have a strong reaction and then build the argument to support it", framing_preference: "give her a concrete case study and let her argue with it, don't start with theory", notes: "responds well to being challenged but only if you show you understood her position first" }
- Bad: { reasoning_mode: "deontological with consequentialist tendencies", framing_preference: "theoretical framing", notes: "analytical thinker" } (too abstract, the SMS composer can't use this)

topics_engaged: Simply list the quiz topics they've completed.

conversation_stage: Based on signal depth:
- "new": first quiz, no SMS history
- "warming_up": 1-2 quizzes, maybe a reply or two
- "active": multiple quizzes or substantive replies
- "deep": rich history, demonstrated engagement

rapport_level: 0-10 integer. Based on:
- Number of quizzes completed (each adds ~1-2)
- Whether they provided freeform answers (shows investment)
- SMS reply depth and frequency (if available)
- Start at 1-2 for a first quiz, max 3-4 with no SMS history yet.`;

const PATCH_PROMPT = `You are updating an existing intellectual fingerprint based on a new SMS reply from the user. You have the current fingerprint and the recent conversation.

Produce an UPDATED fingerprint — same shape, evolved based on the new signal. Most fields may stay the same. Focus on what actually changed:

- Did a curiosity_edge get confirmed, invalidated, or deepened?
- Did an unresolved_question get partially answered, or did a new one surface?
- Should conversation_stage or rapport_level change?
- Did the reply reveal something about engagement_style?
- Did they mention or react to a thinker in a way that updates thinker_map?

Be conservative. A short reply ("haha yeah good point") bumps rapport slightly but doesn't restructure the fingerprint. A substantive reply ("actually I've been thinking about this and I think Singer is wrong because...") might shift curiosity_edges and add nuance to unresolved_questions.

VOICE: Keep everything in the warm, conversational register — like a friend's notes about another friend, not a clinical assessment. The curiosity_edges and unresolved_questions especially should read like things you'd actually say to someone, not academic observations.`;

// ─── Data fetching ───────────────────────────────────────────────────

type QuizSession = {
  id: string;
  topic: string;
  answers: AnswerEntry[];
  constellation: Constellation;
  profile_summary: string | null;
  created_at: string;
};

type MessageRow = {
  direction: string;
  body: string;
  created_at: string;
};

async function fetchCompletedSessions(email: string): Promise<QuizSession[]> {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, topic, answers, constellation, profile_summary, created_at")
    .eq("email", email)
    .eq("status", "complete")
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch sessions: ${error.message}`);
  return (data ?? []) as QuizSession[];
}

async function fetchRecentMessages(email: string, limit = 20): Promise<MessageRow[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("direction, body, created_at")
    .eq("user_email", email)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Failed to fetch messages: ${error.message}`);
  return (data ?? []) as MessageRow[];
}

async function fetchCurrentFingerprint(email: string): Promise<Fingerprint | null> {
  const { data, error } = await supabase
    .from("user_memory")
    .select("fingerprint")
    .eq("email", email)
    .maybeSingle();

  if (error) throw new Error(`Failed to fetch fingerprint: ${error.message}`);
  return data?.fingerprint as Fingerprint | null;
}

// ─── Format data for LLM ────────────────────────────────────────────

function formatSessionsForLLM(sessions: QuizSession[]): string {
  return sessions
    .map((s, i) => {
      const answers = (s.answers as AnswerEntry[])
        .map((a) => {
          const parts = [`  [${a.question_id}] ${a.question_text}`];
          if (a.option_id) parts.push(`    Selected ${a.option_id}: ${a.option_text}`);
          if (a.freeform) parts.push(`    In their own words: "${a.freeform}"`);
          return parts.join("\n");
        })
        .join("\n\n");

      const constellation = Object.entries(s.constellation)
        .filter(([key]) => key !== "user_insight")
        .map(([rel, card]) => {
          const c = card as { name: string; tagline: string; match_reason: string };
          return `  ${rel.toUpperCase()}: ${c.name} — "${c.tagline}" (${c.match_reason})`;
        })
        .join("\n");

      const insight = s.constellation.user_insight;
      const insightBlock = insight
        ? `\n  USER INSIGHT:\n  Archetype: ${insight.archetype_label} — ${insight.archetype_description}\n  Position: ${insight.position}\n  Tension: "${insight.tension.claim_a}" vs "${insight.tension.claim_b}"${insight.tension.explanation ? ` — ${insight.tension.explanation}` : ""}`
        : "";

      return `=== QUIZ ${i + 1}: ${s.topic} (${s.created_at}) ===

ANSWERS:
${answers}

CONSTELLATION:
${constellation}${insightBlock}

PROFILE SUMMARY: ${s.profile_summary ?? "(none)"}`;
    })
    .join("\n\n");
}

function formatMessagesForLLM(messages: MessageRow[]): string {
  if (messages.length === 0) return "(No SMS history yet)";
  return messages
    .map((m) => {
      const prefix = m.direction === "outbound" ? "SELFISH" : "USER";
      return `[${prefix}] ${m.body}`;
    })
    .join("\n");
}

// ─── Core synthesis function ─────────────────────────────────────────

export async function synthesizeMemory(
  email: string,
  trigger: SynthesisTrigger
): Promise<Fingerprint> {
  // Fetch all the data we need
  const [sessions, messages, currentFingerprint] = await Promise.all([
    fetchCompletedSessions(email),
    fetchRecentMessages(email),
    fetchCurrentFingerprint(email),
  ]);

  if (sessions.length === 0) {
    throw new Error(`No completed sessions for ${email}`);
  }

  // Choose system prompt and build user content based on trigger
  let systemPrompt: string;
  let userContent: string;

  if (trigger === "quiz_completion" || !currentFingerprint) {
    // Full rebuild: send all session data + any messages
    systemPrompt = FULL_SYNTHESIS_PROMPT;
    userContent = `USER'S QUIZ HISTORY (${sessions.length} completed quiz${sessions.length > 1 ? "zes" : ""}):

${formatSessionsForLLM(sessions)}

SMS CONVERSATION HISTORY:
${formatMessagesForLLM(messages)}

Synthesize this into a fingerprint.`;
  } else {
    // Patch mode: send current fingerprint + recent messages
    systemPrompt = PATCH_PROMPT;
    userContent = `CURRENT FINGERPRINT:
${JSON.stringify(currentFingerprint, null, 2)}

RECENT CONVERSATION:
${formatMessagesForLLM(messages)}

Update the fingerprint based on the latest reply.`;
  }

  // Call the LLM
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: {
        type: "json_schema",
        schema: fingerprintSchema,
      },
    },
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const message = await stream.finalMessage();

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Model returned no text content");
  }

  const fingerprint = JSON.parse(textBlock.text) as Fingerprint;

  // Upsert to user_memory
  const { error } = await supabase
    .from("user_memory")
    .upsert(
      {
        email,
        fingerprint,
        sessions_analyzed: sessions.length,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );

  if (error) {
    throw new Error(`Failed to save fingerprint: ${error.message}`);
  }

  return fingerprint;
}
