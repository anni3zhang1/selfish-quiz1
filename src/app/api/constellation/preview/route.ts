import { NextResponse } from "next/server";
import { anthropic, MODEL } from "@/lib/anthropic";
import { formatAnswers } from "@/lib/constellation";
import type { AnswerEntry, RelationshipType } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  topic?: string;
  answers?: AnswerEntry[];
};

const RELATIONSHIP_TYPES: RelationshipType[] = [
  "mirror",
  "complement",
  "precursor",
  "antagonist",
  "horizon",
  "shadow",
  "integrated_self",
];

const previewSchema = {
  type: "object",
  properties: {
    profile_summary: { type: "string" },
    thinkers: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: RELATIONSHIP_TYPES,
          },
          name: { type: "string" },
          tagline: { type: "string" },
        },
        required: ["type", "name", "tagline"],
        additionalProperties: false,
      },
      minItems: 1,
    },
  },
  required: ["profile_summary", "thinkers"],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You are assigning thinkers to 7 relationship types based on a user's quiz answers.

Relationship types:
- mirror: Same epistemic moves, different domain
- complement: Fills what the user doesn't naturally carry
- precursor: Who formed them — still working through
- antagonist: Fundamentally different frame
- horizon: One step ahead developmentally
- shadow: A way of thinking they've suppressed
- integrated_self: Who they're becoming at their best

Rules:
- Match on epistemic structure, not surface topic
- Each thinker must be different — no repeats
- Tagline is a one-line claim about who the thinker is
- profile_summary is 2–3 sentences on the user's core epistemic lens

Return exactly 7 thinkers (one per type) plus a profile_summary.`;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { topic, answers } = body;
  if (!topic || !Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "topic and answers required" }, { status: 400 });
  }

  const userContent = formatAnswers(topic, answers);

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      output_config: {
        effort: "low",
        format: {
          type: "json_schema",
          schema: previewSchema,
        },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Model returned no text content");
    }

    const parsed = JSON.parse(textBlock.text) as {
      profile_summary: string;
      thinkers: { type: RelationshipType; name: string; tagline: string }[];
    };

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Preview generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Preview generation failed" },
      { status: 500 }
    );
  }
}
