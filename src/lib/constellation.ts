import type { AnswerEntry, ConstellationResponse } from "./types";
import { anthropic, MODEL } from "./anthropic";

const cardSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    tagline: { type: "string" },
    match_reason: { type: "string" },
    what_to_learn: { type: "string" },
    entry_point: { type: "string" },
    brief_bio: { type: "string" },
  },
  required: [
    "name",
    "tagline",
    "match_reason",
    "what_to_learn",
    "entry_point",
    "brief_bio",
  ],
  additionalProperties: false,
} as const;

const constellationSchema = {
  type: "object",
  properties: {
    profile_summary: { type: "string" },
    constellation: {
      type: "object",
      properties: {
        precursor: cardSchema,
        mirror: cardSchema,
        complement: cardSchema,
        antagonist: cardSchema,
        shadow: cardSchema,
        horizon: cardSchema,
        integrated_self: cardSchema,
      },
      required: [
        "precursor",
        "mirror",
        "complement",
        "antagonist",
        "shadow",
        "horizon",
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

- PRECURSOR (YOUR ROOT): Where their thinking came from. Who formed them — they are still working through this thinker.
- MIRROR (YOUR REFLECTION): Same way of seeing, somewhere else entirely. The user recognizes themselves across distance.
- COMPLEMENT (YOUR BLIND SPOT): What the user does not naturally carry. Fills a missing register.
- ANTAGONIST (YOUR SHARPENER): The strongest case against the user. Fundamentally different frame; the fight sharpens their thinking.
- SHADOW (YOUR DISMISSAL): What the user has been too quick to ignore. A way of thinking they have suppressed but would recognize if they let themselves see it. Can be a framework or movement, not just a person.
- HORIZON (YOUR NEXT STEP): One step further than the user has gone. Slightly uncomfortable to read. A developmental edge.
- INTEGRATED SELF (YOUR DESTINATION): Who the user is becoming at their best. Has resolved the tension the user is still in.

MATCHING RULES:
- Match on epistemic structure, not surface topic.
- Maximum domain distance, minimum cognitive distance (e.g. a physicist can be a Mirror for someone in tech if they make the same cognitive moves).
- The matching logic must be traceable to specific answers the user gave — never generic.
- Each match_reason must cite what the user actually said or chose, by question id and option (e.g. "Q1: D, Q3: E").
- Never assign a thinker who is obvious or expected based on the surface topic.
- Do not make the constellation generic — it should only fit this user.

PER-CARD CONTENT:
- name: full name of the thinker (or, for Shadow, a movement / school / framework if more apt).
- tagline: a one-line claim about who the thinker is — not a description. Active voice; no hedging.
- match_reason: 1–2 sentences citing specific answers and the cognitive move that triggered the match.
- what_to_learn: what the user should look for from this thinker, given their lens. 1–2 sentences.
- entry_point: a single concrete starting point. Format: "Read X (year)" or "Watch X" or "Start with X" — one specific work, essay, lecture, or book the user can encounter today.
- brief_bio: 2–3 sentences on who this person is and why they matter. Plain biographical context — no flattery, no jargon.

PROFILE SUMMARY:
- 2–3 sentences describing the user's core epistemic lens based on their answers.`;

function formatAnswers(topic: string, answers: AnswerEntry[]): string {
  const header = `Topic: ${topic}\n\nUSER'S QUIZ ANSWERS:\n`;
  const body = answers
    .map((a) => {
      const parts: string[] = [];
      parts.push(`[${a.question_id}] ${a.question_text}`);
      if (a.option_id) {
        parts.push(`  Chose ${a.option_id}: ${a.option_text}`);
      }
      if (a.freeform) {
        parts.push(`  Freeform: "${a.freeform}"`);
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
