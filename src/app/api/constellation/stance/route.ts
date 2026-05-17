import { NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { formatAnswers } from "@/lib/constellation";
import type { AnswerEntry, StanceData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  topic?: string;
  answers?: AnswerEntry[];
};

const stanceSchema = {
  type: "object",
  properties: {
    axis_1_left: { type: "string" },
    axis_1_right: { type: "string" },
    axis_1_position: { type: "number" },
    axis_1_insight: { type: "string" },
    axis_2_left: { type: "string" },
    axis_2_right: { type: "string" },
    axis_2_position: { type: "number" },
    axis_2_insight: { type: "string" },
    axis_3_left: { type: "string" },
    axis_3_right: { type: "string" },
    axis_3_position: { type: "number" },
    axis_3_insight: { type: "string" },
  },
  required: [
    "axis_1_left", "axis_1_right", "axis_1_position", "axis_1_insight",
    "axis_2_left", "axis_2_right", "axis_2_position", "axis_2_insight",
    "axis_3_left", "axis_3_right", "axis_3_position", "axis_3_insight",
  ],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You are building a "stance card" that shows where a user stands on 3 key spectrums for a quiz topic.

Your job:
1. Define 3 axes (spectrums) that capture the most important dimensions of disagreement for this topic. These axes should be STABLE for the topic — any two people taking the same quiz should get the same 3 axes. Base them on the fundamental tensions in the topic, not the individual's answers.
2. Place the user at a specific position (0-100) on each axis based on their quiz answers.
3. Write a one-liner insight for each axis explaining WHY they landed where they did.

Rules for axes:
- Each axis is a spectrum between two opposing positions (e.g., "State Control" ↔ "Market Freedom")
- Labels should be 1-3 words, punchy and clear
- The 3 axes should be genuinely orthogonal — not three ways of saying the same thing
- Think about the fundamental philosophical/practical tensions in this topic
- 0 = far left label, 100 = far right label

Rules for positioning:
- The user's position should reflect their actual quiz answers, not a centrist default
- Use the full range — don't cluster everything around 50
- When the user wrote their own words on a question, weight those more heavily

Rules for insights:
- Each insight is ONE sentence, max 15 words
- Written in second person ("You...")
- Specific to the user's actual answers — not generic
- Conversational tone, not academic
- Should feel like a sharp observation, not a summary`;

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
    const t0 = Date.now();
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      output_config: {
        effort: "low",
        format: {
          type: "json_schema",
          schema: stanceSchema,
        },
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });
    console.log(`[stance] AI call took ${Date.now() - t0}ms`);

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Model returned no text content");
    }

    const raw = JSON.parse(textBlock.text) as {
      axis_1_left: string; axis_1_right: string; axis_1_position: number; axis_1_insight: string;
      axis_2_left: string; axis_2_right: string; axis_2_position: number; axis_2_insight: string;
      axis_3_left: string; axis_3_right: string; axis_3_position: number; axis_3_insight: string;
    };

    const result: StanceData = {
      axes: [
        { left: raw.axis_1_left, right: raw.axis_1_right, position: raw.axis_1_position, insight: raw.axis_1_insight },
        { left: raw.axis_2_left, right: raw.axis_2_right, position: raw.axis_2_position, insight: raw.axis_2_insight },
        { left: raw.axis_3_left, right: raw.axis_3_right, position: raw.axis_3_position, insight: raw.axis_3_insight },
      ],
    };

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[stance] Generation failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
