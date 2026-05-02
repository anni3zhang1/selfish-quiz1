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

const entryPointSchema = {
  type: "object",
  properties: {
    title: { type: "string" },
    why: { type: "string" },
  },
  required: ["title", "why"],
  additionalProperties: false,
} as const;

const ideaSchema = {
  type: "object",
  properties: {
    claim: { type: "string" },
    example: { type: "string" },
    why_matters: { type: "string" },
  },
  required: ["claim", "example", "why_matters"],
  additionalProperties: false,
} as const;

const profileSchema = {
  type: "object",
  properties: {
    why_matched: { type: "string" },
    how_they_think: { type: "string" },
    where_they_come_from: { type: "string" },
    ideas_that_matter: {
      type: "array",
      items: ideaSchema,
      minItems: 1,
    },
    what_theyre_arguing: { type: "string" },
    internal_tension: { type: "string" },
    where_to_start: {
      type: "object",
      properties: {
        to_start: entryPointSchema,
        to_go_deep: entryPointSchema,
        surprising: entryPointSchema,
      },
      required: ["to_start", "to_go_deep", "surprising"],
      additionalProperties: false,
    },
  },
  required: [
    "why_matched",
    "how_they_think",
    "where_they_come_from",
    "ideas_that_matter",
    "what_theyre_arguing",
    "internal_tension",
    "where_to_start",
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

const SYSTEM_PROMPT = `You are writing a thinker profile that helps a specific user engage with a specific thinker. The profile follows a 7-section template. Tone: brief a smart, curious person who has 15 minutes before a conversation. Specific over comprehensive. Cite what the user actually said — don't invent relevance. The "internal tension" section should feel slightly uncomfortable to read. "Where to start" entries should be specific enough that someone can find them immediately.

Section guidance:
1. why_matched — Specific to this user's quiz answers. Cite specific question ids and option letters (e.g. "Q3: D and Q7: D both show..."). If it could apply to anyone, rewrite. Match on cognitive moves, not surface topic.
2. how_they_think — Epistemic style and signature cognitive moves. NOT biography. What do they trust as evidence? What do they distrust? Where do they start? One paragraph of dense observation.
3. where_they_come_from — Intellectual tradition and the debate they entered. Who shaped them. Who they argue with. Why they think the way they do.
4. ideas_that_matter — 3-4 key claims, each with: a one-sentence claim, a concrete example or illustration, and why it matters for THIS user given their answers.
5. what_theyre_arguing — The view they're contesting, their real opponents, what "winning" looks like. Stakes if nothing changes.
6. internal_tension — The crack in the framework. The unresolved contradiction. A belief that pulls against another. Be specific. Make it slightly uncomfortable.
7. where_to_start — Three entry points: to_start (most accessible/short/self-contained), to_go_deep (the defining work), surprising (an underrated piece that reveals a different side). Each: title + one sentence on why this one specifically.

Return strict JSON conforming to the schema.`;

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
