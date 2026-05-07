import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { formatAnswers } from "@/lib/constellation";
import { fetchWikipediaThumbnail } from "@/lib/wikipedia";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/thinkers";
import type { AnswerEntry, RelationshipType } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = {
  type?: RelationshipType;
  name?: string;
  tagline?: string;
  topic?: string;
  answers?: AnswerEntry[];
};

const detailSchema = {
  type: "object",
  properties: {
    type: { type: "string" },
    match_reason: { type: "string" },
  },
  required: ["type", "match_reason"],
  additionalProperties: false,
} as const;

const RELATIONSHIP_DESCRIPTIONS: Record<RelationshipType, string> = {
  mirror: "same epistemic structure, different domain — the user recognizes themselves across distance",
  complement: "fills what the user doesn't naturally carry",
  precursor: "who formed them — they're still working through this thinker's ideas",
  antagonist: "fundamentally different frame — the fight sharpens their thinking",
  horizon: "one developmental step ahead — slightly uncomfortable to read",
  shadow: "a way of thinking they've suppressed but would recognize",
  integrated_self: "who they're becoming at their best — has resolved the tension they're still in",
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { type, name, tagline, topic, answers } = body;
  if (!type || !name || !tagline || !topic || !Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { error: "type, name, tagline, topic, and answers required" },
      { status: 400 }
    );
  }

  const relationshipDesc = RELATIONSHIP_DESCRIPTIONS[type] ?? type;
  const answersText = formatAnswers(topic, answers);

  const userContent = `The user has been matched with ${name} as their ${type.toUpperCase()} (${relationshipDesc}).

${name}'s tagline: "${tagline}"

${answersText}

Write:
match_reason: 1–2 sentences in plain narrative language explaining why this match is right for THIS user. Translate what the user's answers reveal into a pattern (in plain words — what they care about, how they think) and connect that pattern to ${name}'s cognitive moves. Do NOT cite answer codes like "Q1: D" or "Q3-E" — the user has forgotten what they selected. Describe the pattern, not the codes. When the user wrote their own words on a question, weight those words much more heavily than the option letter — quote or paraphrase from their language directly.`;

  const thinkerSlug = slugify(name).replace(/_/g, "-");

  try {
    const [message, thumbnailUrl, cacheResult] = await Promise.all([
      anthropic.messages.create({
        model: MODEL,
        max_tokens: 1024,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "medium",
          format: {
            type: "json_schema",
            schema: detailSchema,
          },
        },
        messages: [{ role: "user", content: userContent }],
      }),
      fetchWikipediaThumbnail(name),
      supabase
        .from("thinker_cache")
        .select("what_they_believe")
        .eq("thinker_slug", thinkerSlug)
        .maybeSingle(),
    ]);

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Model returned no text content");
    }

    const parsed = JSON.parse(textBlock.text) as {
      type: RelationshipType;
      match_reason: string;
    };

    const whatTheyBelieve = cacheResult.data?.what_they_believe ?? null;

    return NextResponse.json({
      ...parsed,
      ...(thumbnailUrl ? { thumbnail_url: thumbnailUrl } : {}),
      ...(whatTheyBelieve ? { what_they_believe: whatTheyBelieve } : {}),
    });
  } catch (err) {
    console.error(`Detail generation failed for ${type}:`, err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Detail generation failed" },
      { status: 500 }
    );
  }
}
