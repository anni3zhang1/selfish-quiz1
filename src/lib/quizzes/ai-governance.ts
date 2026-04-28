import type { AnyQuestion, Question } from "../types";

const TOPIC = "ai_governance";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "Who decides what counts as 'high risk'?",
    options: [
      { id: "A", text: "Regulators with technical input" },
      { id: "B", text: "Companies with mandatory disclosure" },
      { id: "C", text: "Independent auditors" },
      { id: "D", text: "International body" },
      f("None of these / I see it differently"),
    ],
  },
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "If no one is responsible, nothing changes. What's the accountability mechanism?",
    options: [
      { id: "A", text: "Require proof of bias-free performance before deployment" },
      { id: "B", text: "New federal agency — FDA model for AI" },
      { id: "C", text: "Class action lawsuits" },
      { id: "D", text: "Mandatory public disclosure" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Italy banned ChatGPT, the EU passed the AI Act, the US has done almost nothing. Which feels right?",
    options: [
      { id: "A", text: "EU — someone has to set a floor" },
      { id: "B", text: "US — regulate after you understand it" },
      { id: "C", text: "EU right on safety, wrong on implementation — incumbents will capture it" },
      { id: "D", text: "US right on timing, but antitrust is urgent — monopoly is the real danger" },
      f("None of these / I see it differently"),
    ],
    followups: { A: { type: "mc", question_id: "q1a" } },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Safety doomers vs. accelerationists (e/acc). Where do you land?",
    options: [
      { id: "A", text: "Closer to doomers — downside too severe" },
      { id: "B", text: "Closer to accelerationists — upside too large to sacrifice" },
      { id: "C", text: "Safety researchers right about risks, wrong about solution — unilateral slowdown just changes who wins" },
      { id: "D", text: "Accelerationists right that it'll be transformative, wrong about timeline — decades away, not years" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: { type: "freeform", prompt: "What would a solution that actually works look like?" },
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "An AI hiring tool discriminates against women. Who's responsible?",
    options: [
      { id: "A", text: "Company that built it — ignorance is no defense" },
      { id: "B", text: "Employer who deployed it — duty to test" },
      { id: "C", text: "Both + regulators failed to require safeguards" },
      { id: "D", text: "Systemic failure — historical bias, no single villain" },
      f("None of these / I see it differently"),
    ],
    followups: { D: { type: "mc", question_id: "q3a" } },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "China is racing ahead. Does this change your view on regulation?",
    options: [
      { id: "A", text: "More cautious about over-regulating — can't fall behind" },
      { id: "B", text: "More worried about under-regulating — racing causes catastrophic mistakes" },
      { id: "C", text: "The framing is the problem — need international coordination, not competition" },
      { id: "D", text: "Doesn't change my view — right policy doesn't depend on China" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "This 'can't be the only ones playing by the rules' reasoning — what makes AI different from cases where it led to arms races?",
      },
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Anthropic's CEO says he might be building one of the most dangerous technologies in history — and is doing it anyway. Is this:",
    options: [
      { id: "A", text: "Rational — better safety-focused labs at the frontier than cede it" },
      { id: "B", text: "Rationalization — 'I'll do the dangerous thing responsibly' is what people say before disasters" },
      { id: "C", text: "A genuine ethical dilemma with no clean answer" },
      { id: "D", text: "Wrong frame — the question is whether external governance exists to constrain all of them" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Meta released Llama openly. Net good or net harm?",
    options: [
      { id: "A", text: "Good — more eyes, prevents concentration of AI power" },
      { id: "B", text: "Reckless — can't recall a model once it's out" },
      { id: "C", text: "Right for current models, threshold needed above which international review is required" },
      { id: "D", text: "Competitive strategy dressed as principle — benefits Meta at OpenAI/Anthropic's expense" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "AI could automate 25% of work. Is this time different from past automation?",
    options: [
      { id: "A", text: "Yes — cognitive work is qualitatively different, policy needs to treat it that way" },
      { id: "B", text: "No — we've been through this; doom predictions miss the new jobs created" },
      { id: "C", text: "Both true — long run fine, but decades of real pain being completely ignored now" },
      { id: "D", text: "Unemployment is secondary — power concentration is the real issue; whoever owns the AI owns the gains" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q8",
    topic: TOPIC,
    text: "AI creates fake content AND helps find cancer treatments. Net effect on truth?",
    options: [
      { id: "A", text: "Deeply negative — damage to collective epistemics will outweigh benefits for a generation" },
      { id: "B", text: "Probably net positive — same tools that create fakes help detect them" },
      { id: "C", text: "Unevenly distributed — institutions capture benefits, disinformation harms those with less counter-narrative access" },
      { id: "D", text: "Unknown — we don't have tools to measure what's happening to collective epistemics in real time" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q9",
    topic: TOPIC,
    text: "AI trained on human content without consent. Where do you stand?",
    options: [
      { id: "A", text: "Theft — a machine doesn't change the moral calculus" },
      { id: "B", text: "How all learning works — culture builds on culture; a hard legal line freezes AI" },
      { id: "C", text: "Legality will be sorted, but the real question is economic — creators should share in value even if training is permitted" },
      { id: "D", text: "Copyright is the wrong frame — the real issue is power concentration homogenizing what gets created" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q10",
    topic: TOPIC,
    text: "What's the AI governance question nobody is asking loudly enough?",
    freeformOnly: true,
  },
];

export const aiGovernanceQuiz = {
  topic: TOPIC,
  topicLabel: "AI Governance",
  questions: main,
  followupQuestions,
};
