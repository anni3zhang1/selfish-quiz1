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

// === Position Map (cartesian plane visualization) ===

export type PositionMapPoint = {
  x: number; // 0-100, percentage from left
  y: number; // 0-100, percentage from top
};

export type PositionMapThinker = PositionMapPoint & {
  name: string;
};

export type PositionMapData = {
  axes: {
    x: [string, string]; // [left label, right label]
    y: [string, string]; // [top label, bottom label]
  };
  quadrants: {
    top_left: string;
    top_right: string;
    bottom_left: string;
    bottom_right: string;
  };
  user: PositionMapPoint;
  thinkers: PositionMapThinker[];
};

// user_insight is stored alongside the 7 thinker cards inside the constellation JSONB.
// Old sessions won't have it (fall back to profile_summary column).
export type Constellation = Record<RelationshipType, ConstellationCard> & {
  user_insight?: UserInsight;
  position_map?: PositionMapData;
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

// === Memory synthesis — intellectual fingerprint ===

export type ThinkerAppearance = {
  name: string;
  relationship_types: RelationshipType[];
  topics: string[];
  significance: string; // why this recurrence matters
};

export type CuriosityEdge = {
  domain: string; // the intellectual territory (e.g. "behavioral economics", "philosophy of mind")
  signal: string; // what from their quizzes/replies suggests this
  entry_angle: string; // how to frame it through their identity
};

export type UnresolvedQuestion = {
  question: string; // the tension, phrased as a question
  evidence: string; // what they said that surfaces this
  why_it_matters: string; // why sitting with this is productive
};

export type ConversationStage = "new" | "warming_up" | "active" | "deep";

export type EngagementStyle = {
  reasoning_mode: string; // e.g. "first principles", "example-driven", "emotion-led", "authority-referencing"
  framing_preference: string; // what kind of framing lands — e.g. "challenge me" vs "show me a case study"
  notes: string; // any other observations about how they engage
};

export type PositionShift = {
  topic: string; // which domain the shift occurred in
  from: string; // what they used to think/say
  to: string; // where they seem to be moving
  signal: string; // what evidence triggered noticing this
};

export type EngagementPattern = {
  responds_to: string; // what message types get replies (e.g. "quick questions", "thinker references", "provocations")
  goes_quiet_on: string; // what message types get ignored
  reply_style: string; // how they tend to reply (e.g. "short and punchy", "long and thoughtful", "questions back")
};

export type Fingerprint = {
  core_identity: string; // 2-3 sentence intellectual DNA statement
  thinker_map: ThinkerAppearance[];
  curiosity_edges: CuriosityEdge[];
  unresolved_questions: UnresolvedQuestion[];
  engagement_style: EngagementStyle;
  topics_engaged: string[]; // quiz topics completed
  conversation_stage: ConversationStage;
  rapport_level: number; // 0-10, derived from engagement signals
  // Adaptive learning dimensions — evolve over time
  position_drift: PositionShift[]; // views that have shifted across quizzes or conversations
  curiosity_trajectory: string; // narrative of where their interests are *moving* (not just where they are)
  engagement_pattern: EngagementPattern; // what message formats work for this person
};

export type SynthesisTrigger = "quiz_completion" | "sms_reply";

export type UserMemoryRow = {
  id: string;
  email: string;
  fingerprint: Fingerprint;
  sessions_analyzed: number;
  created_at: string;
  updated_at: string;
};
