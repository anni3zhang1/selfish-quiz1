import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { supabase } from "@/lib/supabase";
import { formatAnswers } from "@/lib/constellation";
import type {
  AnswerEntry,
  Constellation,
  RelationshipType,
  ThinkerProfileData,
  ThinkerArgument,
  ThinkerTension,
  ThinkerImpact,
  ThinkerQuestion,
} from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  session_id?: string;
  thinker_slug?: string;
  thinker_name?: string;
  relationship_type?: RelationshipType;
};

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

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

const impactSchema = {
  type: "object",
  properties: {
    group: { type: "string" },
    emoji: { type: "string" },
    impact: { type: "string" },
  },
  required: ["group", "impact"],
  additionalProperties: false,
} as const;

// ─── Full profile schema (cache miss path) ────────────────────────────────────

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
    who_they_impact: {
      type: "array",
      items: impactSchema,
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
    "who_they_impact",
  ],
  additionalProperties: false,
} as const;

// ─── Dynamic-only schema (cache hit path) ─────────────────────────────────────

const dynamicOnlySchema = {
  type: "object",
  properties: {
    why_matched: { type: "string" },
    questions_worth_sitting_with: {
      type: "array",
      items: questionSchema,
      minItems: 1,
    },
    you_impact: { type: "string" },
  },
  required: ["why_matched", "questions_worth_sitting_with", "you_impact"],
  additionalProperties: false,
} as const;

// ─── Prompts ──────────────────────────────────────────────────────────────────

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
The user should be able to engage immediately — no off-platform research required. The substance is in the question itself.

8. who_they_impact
3-5 stakeholder groups whose lives are meaningfully shaped by this thinker's ideas. Concrete real-world actors, communities, or institutions — not abstract categories. For each:
- group: a short label (e.g. "Tech platforms", "Incarcerated people", "Climate policymakers")
- emoji: a single emoji representing the group (optional but preferred)
- impact: one sentence describing how this thinker's specific thesis affects or implicates them — concrete, not abstract
The LAST entry must always have group: "You" with a one-sentence statement of how this thinker's position lands personally for someone who answered the quiz the way this user did. Use the user's actual answers to make it specific.`;

const DYNAMIC_SYSTEM_PROMPT = `You are writing three personalized sections of a thinker profile for a specific user.

Tone: brief a smart, curious person who has 15 minutes before a conversation. These sections must feel like they were written for THIS user specifically, not a general audience.

SECTION GUIDANCE:

1. why_matched
Translate what the user's answers reveal into a pattern — what do they seem to care about, how do they seem to think? Then connect that pattern to this thinker's cognitive moves.
IMPORTANT: Do NOT cite answer codes (Q3-D, Q7: B, etc.) — the user has forgotten what they selected. Describe the pattern in plain language.
When the user wrote their own words on a question, weight those words much more heavily than the option letter. Their language is the strongest signal of position; lean on it directly.
If this could apply to a different user with different answers, rewrite it.

2. questions_worth_sitting_with
3 questions. Each structured as:
- question: a genuine intellectual provocation (not rhetorical, not easy)
- what_you_said: one sentence connecting to a specific thing the user revealed (in plain language, no answer codes)
- how_thinker_sees_it: their actual position in 1-2 sentences — something to push against, not just context
The user should be able to engage immediately — no off-platform research required.

3. you_impact
A single sentence describing how this thinker's position lands personally for someone who answered the quiz the way this user did. Use the user's actual answers to make it specific. This will appear as the final entry in the "who they impact" section under the group label "You".`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function saveToSessionCache(
  sessionId: string,
  thinkerSlug: string,
  thinkerName: string,
  relationshipType: RelationshipType,
  profile: ThinkerProfileData
): void {
  void supabase
    .from("thinker_profiles")
    .upsert(
      { session_id: sessionId, thinker_slug: thinkerSlug, thinker_name: thinkerName, relationship_type: relationshipType, profile },
      { onConflict: "session_id,thinker_slug" }
    )
    .then(({ error }) => {
      if (error) console.error("thinker_profiles upsert failed:", error);
    });
}

function saveToSharedCache(
  slug: string,
  name: string,
  profile: ThinkerProfileData
): void {
  const whoWithoutYou = profile.who_they_impact.filter((e) => e.group !== "You");
  void supabase
    .from("thinker_cache")
    .upsert(
      {
        thinker_slug: slug,
        thinker_name: name,
        what_they_believe: profile.what_they_believe,
        core_arguments: profile.core_arguments,
        where_they_come_from: profile.where_they_come_from,
        how_they_think: profile.how_they_think,
        tension: profile.tension,
        who_they_impact: whoWithoutYou,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "thinker_slug" }
    )
    .then(({ error }) => {
      if (error) console.error("thinker_cache upsert failed:", error);
    });
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { session_id, thinker_slug: rawSlug, thinker_name, relationship_type } = body;
  if (!session_id || !rawSlug || !thinker_name || !relationship_type) {
    return NextResponse.json(
      { error: "session_id, thinker_slug, thinker_name, relationship_type required" },
      { status: 400 }
    );
  }
  // Normalize to hyphens — URL slugs use underscores, pool/cache slugs use hyphens.
  const thinker_slug = rawSlug.replace(/_/g, "-");

  // 1. Per-session cache hit (exact match — already personalized)
  const { data: sessionCached } = await supabase
    .from("thinker_profiles")
    .select("profile")
    .eq("session_id", session_id)
    .eq("thinker_slug", thinker_slug)
    .maybeSingle();

  if (sessionCached?.profile) {
    return NextResponse.json({ profile: sessionCached.profile as ThinkerProfileData, cached: true });
  }

  // 2. Fetch session context (needed for both paths)
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
  const answersText = formatAnswers(session.topic, answers);

  // 3. Shared thinker cache hit (static sections already generated)
  const { data: sharedCache } = await supabase
    .from("thinker_cache")
    .select("what_they_believe,core_arguments,where_they_come_from,how_they_think,tension,who_they_impact")
    .eq("thinker_slug", thinker_slug)
    .maybeSingle();

  if (sharedCache) {
    const dynamicContent = `Generate the three personalized sections for ${thinker_name} as this user's ${relationship_type.toUpperCase()} (${RELATIONSHIP_LABEL[relationship_type] ?? relationship_type}).

User's existing match reason: "${matchReason}"

${answersText}`;

    try {
      const message = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 2048,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "medium",
          format: { type: "json_schema", schema: dynamicOnlySchema },
        },
        system: DYNAMIC_SYSTEM_PROMPT,
        messages: [{ role: "user", content: dynamicContent }],
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") throw new Error("Model returned no text content");

      const dynamic = JSON.parse(textBlock.text) as {
        why_matched: string;
        questions_worth_sitting_with: ThinkerQuestion[];
        you_impact: string;
      };

      const profile: ThinkerProfileData = {
        why_matched: dynamic.why_matched,
        what_they_believe: sharedCache.what_they_believe as string,
        core_arguments: sharedCache.core_arguments as ThinkerArgument[],
        where_they_come_from: sharedCache.where_they_come_from as string,
        how_they_think: sharedCache.how_they_think as string,
        tension: sharedCache.tension as ThinkerTension,
        questions_worth_sitting_with: dynamic.questions_worth_sitting_with,
        who_they_impact: [
          ...(sharedCache.who_they_impact as ThinkerImpact[]),
          { group: "You", impact: dynamic.you_impact },
        ],
      };

      saveToSessionCache(session_id, thinker_slug, thinker_name, relationship_type, profile);
      return NextResponse.json({ profile, cached: false });
    } catch (err) {
      console.error("Dynamic section generation failed:", err);
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Profile generation failed" },
        { status: 500 }
      );
    }
  }

  // 4. Cache miss — generate full profile
  const fullContent = `Generate a thinker profile for ${thinker_name} as this user's ${relationship_type.toUpperCase()} (${RELATIONSHIP_LABEL[relationship_type] ?? relationship_type}).

User's existing match reason for this thinker:
"${matchReason}"

${answersText}

Generate all 8 sections as a single JSON object conforming to the schema.`;

  try {
    const stream = anthropic.messages.stream({
      model: MODEL,
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "high",
        format: { type: "json_schema", schema: profileSchema },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: fullContent }],
    });

    const message = await stream.finalMessage();
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("Model returned no text content");

    const profile = JSON.parse(textBlock.text) as ThinkerProfileData;

    saveToSessionCache(session_id, thinker_slug, thinker_name, relationship_type, profile);
    saveToSharedCache(thinker_slug, thinker_name, profile);

    return NextResponse.json({ profile, cached: false });
  } catch (err) {
    console.error("Thinker profile generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Profile generation failed" },
      { status: 500 }
    );
  }
}
