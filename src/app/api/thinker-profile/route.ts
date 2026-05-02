import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { supabase } from "@/lib/supabase";
import { formatAnswers } from "@/lib/constellation";
import type {
  AnswerEntry,
  Constellation,
  RelationshipType,
  ThinkerProfileData,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  session_id?: string;
  thinker_slug?: string;
  thinker_name?: string;
  relationship_type?: RelationshipType;
};

const argumentSchema = {
  type: "object",
  properties: {
    claim: { type: "string" },
    example: { type: "string" },
    why_it_matters: { type: "string" },
  },
  required: ["claim", "example", "why_it_matters"],
  additionalProperties: false,
} as const;

const tensionSchema = {
  type: "object",
  properties: {
    belief_a: { type: "string" },
    belief_b: { type: "string" },
    explanation: { type: "string" },
  },
  required: ["belief_a", "belief_b", "explanation"],
  additionalProperties: false,
} as const;

const questionSchema = {
  type: "object",
  properties: {
    question: { type: "string" },
    what_you_said: { type: "string" },
    how_thinker_sees_it: { type: "string" },
  },
  required: ["question", "what_you_said", "how_thinker_sees_it"],
  additionalProperties: false,
} as const;

const profileSchema = {
  type: "object",
  properties: {
    why_matched: { type: "string" },
    what_they_believe: { type: "string" },
    core_arguments: {
      type: "array",
      items: argumentSchema,
      minItems: 1,
    },
    where_they_come_from: { type: "string" },
    how_they_think: { type: "string" },
    tension: tensionSchema,
    questions_worth_sitting_with: {
      type: "array",
      items: questionSchema,
      minItems: 1,
    },
  },
  required: [
    "why_matched",
    "what_they_believe",
    "core_arguments",
    "where_they_come_from",
    "how_they_think",
    "tension",
    "questions_worth_sitting_with",
  ],
  additionalProperties: false,
} as const;

const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  mirror: "Mirror — same epistemic structure across distance",
  complement: "Complement — fills what the user doesn't naturally carry",
  precursor: "Precursor — formed how the user thinks; still working through",
  antagonist: "Antagonist — fundamentally different frame; the fight sharpens",
  horizon: "Horizon — one developmental step ahead",
  shadow: "Shadow — a way of thinking the user has suppressed",
  integrated_self: "Integrated Self — who the user is becoming at their best",
};

const SYSTEM_PROMPT = `You are writing a thinker profile that helps a specific user engage with a specific thinker.

Tone: brief a smart, curious person who has 15 minutes before a conversation. Specific over comprehensive. The profile should feel like it was written for THIS user, not a general audience.

SECTION GUIDANCE:

1. why_matched
Translate what the user's answers reveal into a pattern — what do they seem to care about, how do they seem to think? Then connect that pattern to this thinker's cognitive moves.
IMPORTANT: Do NOT cite answer codes (Q3-D, Q7: B, etc.) — the user has forgotten what they selected. Describe the pattern in plain language. Example: "You consistently reframe individual liability questions as power concentration questions — so does [Thinker], in a different domain entirely."
When the user wrote their own words on a question, weight those words much more heavily than the option letter. Their language is the strongest signal of position; lean on it directly.
If this could apply to a different user with different answers, rewrite it.

2. what_they_believe
Their thesis in 2-3 sentences — the position, plainly stated. Not hedged, not surveyed. What do they actually believe about the world?

3. core_arguments
3-4 specific claims most relevant to this user and this topic. Each argument has:
- claim: one sentence
- example: a concrete case, illustration, or quote
- why_it_matters: connection to what this user revealed in their answers
Output as a structured array.

4. where_they_come_from
The intellectual tradition they're working in and pushing against. Who shaped them. Who they argue with. The question they entered the field to answer. This explains WHY they think the way they do — the soil their framework grew in. One paragraph.

5. how_they_think
Epistemic style and signature cognitive moves. NOT biography. What do they trust as evidence? What do they distrust? Where do they start? One dense paragraph — a portrait, not a checklist.

6. tension
The unresolved contradiction that makes them generative. Format strictly as:
- belief_a: one side of the tension
- belief_b: the opposing belief
- explanation: one sentence explaining why these can't be reconciled within their framework
Make it specific and slightly uncomfortable to read.

7. questions_worth_sitting_with
3 questions. Each structured as:
- question: a genuine intellectual provocation (not rhetorical, not easy)
- what_you_said: one sentence connecting to a specific thing the user revealed (in plain language, no answer codes)
- how_thinker_sees_it: their actual position in 1-2 sentences — something to push against, not just context
The user should be able to engage immediately — no off-platform research required. The substance is in the question itself.`;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { session_id, thinker_slug, thinker_name, relationship_type } = body;
  if (!session_id || !thinker_slug || !thinker_name || !relationship_type) {
    return NextResponse.json(
      { error: "session_id, thinker_slug, thinker_name, relationship_type required" },
      { status: 400 }
    );
  }

  // Cache hit?
  const { data: cached } = await supabase
    .from("thinker_profiles")
    .select("profile")
    .eq("session_id", session_id)
    .eq("thinker_slug", thinker_slug)
    .maybeSingle();

  if (cached?.profile) {
    return NextResponse.json({
      profile: cached.profile as ThinkerProfileData,
      cached: true,
    });
  }

  // Pull session context
  const { data: session, error: sessionErr } = await supabase
    .from("quiz_sessions")
    .select("topic, answers, constellation")
    .eq("id", session_id)
    .single();

  if (sessionErr || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const answers = (session.answers ?? []) as AnswerEntry[];
  const constellation = (session.constellation ?? {}) as Partial<Constellation>;
  const card = constellation[relationship_type];
  const matchReason = card?.match_reason ?? "(not yet generated)";

  const userContent = `Generate a thinker profile for ${thinker_name} as this user's ${relationship_type.toUpperCase()} (${RELATIONSHIP_LABEL[relationship_type] ?? relationship_type}).

User's existing match reason for this thinker:
"${matchReason}"

${formatAnswers(session.topic, answers)}

Generate all 7 sections as a single JSON object conforming to the schema.`;

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: {
          type: "json_schema",
          schema: profileSchema,
        },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const message = await stream.finalMessage();
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Model returned no text content");
    }

    const profile = JSON.parse(textBlock.text) as ThinkerProfileData;

    // Cache it
    const { error: upsertErr } = await supabase
      .from("thinker_profiles")
      .upsert(
        {
          session_id,
          thinker_slug,
          thinker_name,
          relationship_type,
          profile,
        },
        { onConflict: "session_id,thinker_slug" }
      );
    if (upsertErr) {
      console.error("thinker_profiles upsert failed:", upsertErr);
    }

    return NextResponse.json({ profile, cached: false });
  } catch (err) {
    console.error("Thinker profile generation failed:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Profile generation failed",
      },
      { status: 500 }
    );
  }
}
