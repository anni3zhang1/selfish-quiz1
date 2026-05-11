import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { formatAnswers } from "@/lib/constellation";
import { thinkerPools } from "@/lib/thinker-pools";
import type { AnswerEntry, InsightTension, RelationshipType, UserInsight } from "@/lib/types";

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
    archetype_label: { type: "string" },
    archetype_description: { type: "string" },
    position: { type: "string" },
    reasons: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          what_it_means: { type: "string" },
        },
        required: ["claim", "what_it_means"],
        additionalProperties: false,
      },
    },
    tension: {
      type: "object",
      properties: {
        claim_a: { type: "string" },
        claim_b: { type: "string" },
        explanation: { type: "string" },
      },
      required: ["claim_a", "claim_b"],
      additionalProperties: false,
    },
    real_world_examples: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
        required: ["title", "description"],
        additionalProperties: false,
      },
    },
    thinkers: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: RELATIONSHIP_TYPES,
          },
          name: { type: "string" },
          tagline: { type: "string" },
          match_reason: { type: "string" },
        },
        required: ["type", "name", "tagline", "match_reason"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "archetype_label",
    "archetype_description",
    "position",
    "reasons",
    "tension",
    "real_world_examples",
    "thinkers",
  ],
  additionalProperties: false,
} as const;

const BASE_SYSTEM_PROMPT = `You are assigning thinkers to 7 relationship types based on a user's quiz answers.

Relationship types:
- mirror: Same epistemic moves, different domain
- complement: Fills what the user doesn't naturally carry
- precursor: Who formed them — still working through
- antagonist: Fundamentally different frame
- horizon: One step ahead developmentally
- shadow: A way of thinking they've suppressed
- integrated_self: Who they're becoming at their best

Rules:
- Pick exactly 7 thinkers from the provided pool
- Match on epistemic structure, not surface topic
- Each thinker must be different — no repeats
- Tagline is a one-line claim about who the thinker is
- match_reason: 1–2 sentences explaining why this match is right for THIS user. Translate the user's answers into a pattern (what they care about, how they think) and connect it to the thinker's cognitive moves. Do NOT cite answer codes like "Q1: D". When the user wrote their own words, quote or paraphrase their language directly.
- When the user wrote their own words on a question, weight those words MORE heavily than the selected letter. Their own language reveals position; the letter is just a starting point.

For the user insight section, generate these fields:
- archetype_label: a punchy 2-4 word title for this user's intellectual archetype, specific to the quiz topic (e.g. "The Structural Skeptic", "The Reluctant Accelerationist"). A title, not a description.
- archetype_description: one sentence defining what this archetype means in the context of this topic.
- position: 2-3 sentences on where the user actually stands, written in second person ("You believe...", "Your instinct is...").
- reasons: exactly 3 items. Each has a "claim" (one sentence on a specific implication of the user's position) and "what_it_means" (one sentence on what this reveals about how the user thinks).
- tension: an object with:
  - claim_a: one short punchy statement of one side of the contradiction (10-15 words max)
  - claim_b: one short punchy statement of the directly opposing side (10-15 words max)
  - explanation: (optional) 1-2 sentences explaining why these two beliefs are genuinely in tension
  The two claims should feel contradictory — the sharpest possible challenge to the user's own view.
- real_world_examples: 2-3 items. Each has a "title" (2-5 word bold heading naming a specific debate, policy, event, or moment, e.g. "EU AI Act debate" or "2008 financial crisis") and "description" (1 sentence showing exactly where the user's framing plays out in that case — concrete, high-stakes).

Return exactly 7 thinkers (one per type) plus the full user insight section.`;

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

  const pool = thinkerPools[topic];
  const poolSection = pool
    ? "\n\nAvailable thinker pool for this topic:\n" +
      JSON.stringify(
        pool.map((t) => ({ name: t.name, domain: t.domain, corePosition: t.corePosition })),
        null,
        2
      )
    : "";

  const SYSTEM_PROMPT = BASE_SYSTEM_PROMPT + poolSection;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
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
      archetype_label: string;
      archetype_description: string;
      position: string;
      reasons: { claim: string; what_it_means: string }[];
      tension: { claim_a: string; claim_b: string; explanation?: string };
      real_world_examples: { title: string; description: string }[];
      thinkers: { type: RelationshipType; name: string; tagline: string; match_reason: string }[];
    };

    const user_insight: UserInsight = {
      archetype_label: parsed.archetype_label,
      archetype_description: parsed.archetype_description,
      position: parsed.position,
      reasons: parsed.reasons,
      tension: parsed.tension as InsightTension,
      real_world_examples: parsed.real_world_examples,
    };

    return NextResponse.json({ user_insight, thinkers: parsed.thinkers });
  } catch (err) {
    console.error("Preview generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Preview generation failed" },
      { status: 500 }
    );
  }
}
