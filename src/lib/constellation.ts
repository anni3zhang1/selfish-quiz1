import type { AnswerEntry, ConstellationResponse } from "./types";
import { anthropic, MODEL } from "./anthropic";

const cardSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    tagline: { type: "string" },
    match_reason: { type: "string" },
  },
  required: ["name", "tagline", "match_reason"],
  additionalProperties: false,
} as const;

const constellationSchema = {
  type: "object",
  properties: {
    profile_summary: { type: "string" },
    constellation: {
      type: "object",
      properties: {
        mirror: cardSchema,
        complement: cardSchema,
        precursor: cardSchema,
        antagonist: cardSchema,
        horizon: cardSchema,
        shadow: cardSchema,
        integrated_self: cardSchema,
      },
      required: [
        "mirror",
        "complement",
        "precursor",
        "antagonist",
        "horizon",
        "shadow",
        "integrated_self",
      ],
      additionalProperties: false,
    },
  },
  required: ["profile_summary", "constellation"],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `You are generating an intellectual constellation for a user based on their answers to a quiz on a specific topic.

The constellation maps the user to 7 thinkers in different relationship types. Each relationship type teaches something different:

- MIRROR: Same way of being interested, different domain. The user recognizes themselves across distance.
- COMPLEMENT: Fills what the user doesn't naturally carry.
- PRECURSOR: Who formed them — they're still working through this thinker.
- ANTAGONIST: Fundamentally different frame. The fight sharpens their thinking.
- HORIZON: One developmental step ahead. Slightly uncomfortable to read.
- SHADOW: A way of thinking they've suppressed but would recognize.
- INTEGRATED SELF: Who they're becoming at their best. Has resolved the tension they're still in.

MATCHING RULES:
- Match on epistemic structure, not surface topic.
- Maximum domain distance, minimum cognitive distance (e.g. a physicist can be a Mirror for someone in tech if they make the same cognitive moves).
- The matching logic must be traceable to specific answers the user gave — never generic.
- Each match_reason must cite what the user actually said or chose, by question id and option (e.g. "Q1: D, Q3: E").
- Never assign a thinker who is obvious or expected based on surface topic.
- The Shadow can be a framework or movement, not just a person.
- Do not make the constellation generic — it should only fit this user.
- Tagline: a one-line claim about who the thinker is — not a description.
- match_reason: 1–2 sentences citing specific answers.
- profile_summary: 2–3 sentences describing the user's core epistemic lens based on their answers.`;

function formatAnswers(topic: string, answers: AnswerEntry[]): string {
  const header = `Topic: ${topic}

USER'S QUIZ ANSWERS

How to read this:
- When the user has added an annotation in their own words, treat that annotation as the PRIMARY signal of their position. The selected option letter is supplementary context.
- When no annotation is provided, fall back to the selected option as the signal.
- Quote and reason from the user's own words whenever they wrote some.

`;
  const body = answers
    .map((a) => {
      const parts: string[] = [];
      parts.push(`[${a.question_id}] ${a.question_text}`);
      if (a.option_id) {
        parts.push(`  Selected ${a.option_id}: ${a.option_text}`);
      }
      if (a.freeform) {
        parts.push(`  In their own words (PRIMARY SIGNAL): "${a.freeform}"`);
      }
      return parts.join("\n");
    })
    .join("\n\n");
  return header + body;
}

export async function generateConstellation(
  topic: string,
  answers: AnswerEntry[]
): Promise<ConstellationResponse> {
  const userContent = formatAnswers(topic, answers);

  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: {
        type: "json_schema",
        schema: constellationSchema,
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

  let parsed: unknown;
  try {
    parsed = JSON.parse(textBlock.text);
  } catch (err) {
    throw new Error(
      `Failed to parse model JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return parsed as ConstellationResponse;
}

export { formatAnswers };
