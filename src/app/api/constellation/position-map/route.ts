import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { formatAnswers } from "@/lib/constellation";
import type { AnswerEntry, PositionMapData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  topic?: string;
  answers?: AnswerEntry[];
  thinkers?: string[]; // names from preview
};

const positionMapSchema = {
  type: "object",
  properties: {
    axes: {
      type: "object",
      properties: {
        x: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 2,
        },
        y: {
          type: "array",
          items: { type: "string" },
          minItems: 2,
          maxItems: 2,
        },
      },
      required: ["x", "y"],
      additionalProperties: false,
    },
    quadrants: {
      type: "object",
      properties: {
        top_left: { type: "string" },
        top_right: { type: "string" },
        bottom_left: { type: "string" },
        bottom_right: { type: "string" },
      },
      required: ["top_left", "top_right", "bottom_left", "bottom_right"],
      additionalProperties: false,
    },
    user: {
      type: "object",
      properties: {
        x: { type: "number" },
        y: { type: "number" },
      },
      required: ["x", "y"],
      additionalProperties: false,
    },
    thinkers: {
      type: "array",
      minItems: 7,
      maxItems: 7,
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          x: { type: "number" },
          y: { type: "number" },
        },
        required: ["name", "x", "y"],
        additionalProperties: false,
      },
    },
  },
  required: ["axes", "quadrants", "user", "thinkers"],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You are building a 2D position map that places a user and 7 thinkers on a cartesian plane based on the user's quiz answers.

Your job:
1. Define two meaningful axes for this topic based on the user's answers. Each axis is a spectrum between two opposing concepts (e.g., "State control" ↔ "Market forces"). The axes should capture the most important dimensions of disagreement in this topic.
2. Name the four quadrants — each is a 2-3 word label describing the intellectual territory formed by the intersection (e.g., "Regulated Caution", "Free Market Build").
3. Place the user at specific x,y coordinates (0-100) based on their quiz answers.
4. Place each of the 7 provided thinkers at x,y coordinates based on their known intellectual positions.

Coordinate system:
- x: 0 = far left of axis (first label), 100 = far right (second label)
- y: 0 = top of axis (first label), 100 = bottom (second label)
- So top-left quadrant = low x, low y; bottom-right = high x, high y

Rules:
- Axes should be genuinely orthogonal — not two ways of saying the same thing
- Spread thinkers across the map — don't cluster everyone in one quadrant
- The user's position should reflect their actual quiz answers, not a centrist default
- Quadrant names should be evocative and specific to the topic (not generic like "moderate")
- Each axis label should be 1-3 words, punchy and clear
- When the user wrote their own words on a question, weight those words MORE heavily
- Thinker placements should reflect their well-known public positions`;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { topic, answers, thinkers } = body;
  if (!topic || !Array.isArray(answers) || answers.length === 0 || !Array.isArray(thinkers) || thinkers.length === 0) {
    return NextResponse.json({ error: "topic, answers, and thinkers required" }, { status: 400 });
  }

  const userContent = formatAnswers(topic, answers) +
    "\n\nThinkers to place on the map:\n" +
    thinkers.map((name, i) => `${i + 1}. ${name}`).join("\n");

  try {
    const t0 = Date.now();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      output_config: {
        format: {
          type: "json_schema",
          schema: positionMapSchema,
        },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });
    console.log(`[position-map] AI call took ${Date.now() - t0}ms`);

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Model returned no text content");
    }

    const parsed = JSON.parse(textBlock.text) as PositionMapData;

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Position map generation failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Position map generation failed" },
      { status: 500 }
    );
  }
}
