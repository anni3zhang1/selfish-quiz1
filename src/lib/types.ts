export type QuestionOption = {
  id: string;
  text: string;
  freeform?: boolean;
};

export type Followup =
  | { type: "mc"; question_id: string }
  | { type: "freeform"; prompt: string };

export type Question = {
  id: string;
  topic: string;
  text: string;
  options: QuestionOption[];
  followups?: Record<string, Followup>;
};

export type FreeformOnlyQuestion = {
  id: string;
  topic: string;
  text: string;
  freeformOnly: true;
};

export type AnyQuestion = Question | FreeformOnlyQuestion;

export type AnswerEntry = {
  question_id: string;
  question_text: string;
  // For MC: the chosen option id (A/B/C/D/E). For freeform-only: undefined.
  option_id?: string;
  option_text?: string;
  // Freeform text — present when option E is chosen, when followup is freeform, or freeform-only question.
  freeform?: string;
};

export type RelationshipType =
  | "mirror"
  | "complement"
  | "precursor"
  | "antagonist"
  | "horizon"
  | "shadow"
  | "integrated_self";

export type ConstellationCard = {
  name: string;
  tagline: string;
  match_reason: string;
  entry_point?: string;
  // kept for backward compat with sessions generated before v5
  what_to_learn?: string;
};

export type Constellation = Record<RelationshipType, ConstellationCard>;

export type ConstellationResponse = {
  profile_summary: string;
  constellation: Constellation;
};
