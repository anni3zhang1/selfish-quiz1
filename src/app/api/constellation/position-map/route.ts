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
        x_left: { type: "string" },
        x_right: { type: "string" },
        y_top: { type: "string" },
        y_bottom: { type: "string" },
      },
      required: ["x_left", "x_right", "y_top", "y_bottom"],
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
    user_x: { type: "number" },
    user_y: { type: "number" },
    thinkers: {
      type: "array",
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
  required: ["axes", "quadrants", "user_x", "user_y", "thinkers"],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You are building a 2D position map that places a user and 7 thinkers on a cartesian plane based on the user's quiz answers.

Your job:
1. Define two meaningful axes for this topic based on the user's answers. Each axis is a spectrum between two opposing concepts (e.g., "State control" ↔ "Market forces"). The axes should capture the most important dimensions of disagreement in this topic.
2. Name the four quadrants — each is a 2-3 word label describing the intellectual territory formed by the intersection (e.g., "Regulated Caution", "Free Market Build").
3. Place the user at specific x,y coordinates (0-100) based on their quiz answers.
4. Place each of the 7 provided thinkers at x,y coordinates based on their known intellectual positions.

Output format:
- axes: x_left and x_right are the two ends of the horizontal axis. y_top and y_bottom are the two ends of the vertical axis.
- user_x and user_y: the user's position (0-100)
- thinkers: array of 7 objects with name, x, y

Coordinate system:
- x: 0 = far left (x_left label), 100 = far right (x_right label)
- y: 0 = top (y_top label), 100 = bottom (y_bottom label)
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
        effort: "low",
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

    const raw = JSON.parse(textBlock.text) as {
      axes: { x_left: string; x_right: string; y_top: string; y_bottom: string };
      quadrants: { top_left: string; top_right: string; bottom_left: string; bottom_right: string };
      user_x: number;
      user_y: number;
      thinkers: { name: string; x: number; y: number }[];
    };

    // Reshape to PositionMapData
    const result: PositionMapData = {
      axes: {
        x: [raw.axes.x_left, raw.axes.x_right],
        y: [raw.axes.y_top, raw.axes.y_bottom],
      },
      quadrants: raw.quadrants,
      user: { x: raw.user_x, y: raw.user_y },
      thinkers: raw.thinkers,
    };

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[position-map] Generation failed:", msg);
    if (err instanceof Error && err.stack) {
      console.error("[position-map] Stack:", err.stack);
    }
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
