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
  thumbnail_url?: string;
  // hydrated at read-time from thinker_cache — not stored in DB
  what_they_believe?: string;
  // kept for backward compat with sessions generated before v5
  what_to_learn?: string;
};

export type RealWorldExample = {
  title: string;
  description: string;
};

export type InsightTension = {
  claim_a: string;
  claim_b: string;
  explanation?: string;
};

export type UserInsight = {
  archetype_label: string;
  archetype_description: string;
  position: string;
  reasons: { claim: string; what_it_means: string }[];
  tension: InsightTension;
  real_world_examples: RealWorldExample[];
};

// user_insight is stored alongside the 7 thinker cards inside the constellation JSONB.
// Old sessions won't have it (fall back to profile_summary column).
export type Constellation = Record<RelationshipType, ConstellationCard> & {
  user_insight?: UserInsight;
};

export type ConstellationResponse = {
  profile_summary: string;
  user_insight?: UserInsight;
  constellation: Constellation;
};

// === Thinker profile (per-user, per-thinker, generated on-demand) ===

export type ThinkerArgument = {
  claim: string;
  example: string;
  why_it_matters: string;
};

export type ThinkerTension = {
  belief_a: string;
  belief_b: string;
  explanation: string;
};

export type ThinkerQuestion = {
  question: string;
  what_you_said: string;
  how_thinker_sees_it: string;
};

export type ThinkerImpact = {
  group: string;
  emoji?: string;
  impact: string;
};

export type ThinkerProfileData = {
  why_matched: string;
  what_they_believe: string;
  core_arguments: ThinkerArgument[];
  where_they_come_from: string;
  how_they_think: string;
  tension: ThinkerTension;
  questions_worth_sitting_with: ThinkerQuestion[];
  who_they_impact: ThinkerImpact[];
};
