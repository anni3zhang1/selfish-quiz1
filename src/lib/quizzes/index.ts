import { aiGovernanceQuiz } from "./ai-governance";

export const quizzes = {
  ai_governance: aiGovernanceQuiz,
} as const;

export type QuizSlug = keyof typeof quizzes;

export function getQuiz(slug: string) {
  return (quizzes as Record<string, (typeof quizzes)[QuizSlug]>)[slug] ?? null;
}

export const topicCards = [
  {
    slug: "ai_governance",
    name: "AI Governance",
    available: true,
    description:
      "How do you think about who controls AI, who's responsible for its harms, and what's actually at stake?",
    intention:
      "Reveals your relationship to institutions, authority, and how you reason about technological risk.",
    gradient: "from-blue-500 via-cyan-500 to-blue-700",
  },
  {
    slug: "climate",
    name: "Climate",
    available: false,
    description:
      "Where do you stand on the hardest trade-offs of the climate crisis?",
    intention:
      "Reveals whether you think in systems, individuals, or institutions — and how you handle uncertainty at civilizational scale.",
    gradient: "from-emerald-700 via-green-600 to-teal-800",
  },
  {
    slug: "longevity",
    name: "Longevity",
    available: false,
    description:
      "If we could dramatically extend healthy human life, should we — and who gets to?",
    intention:
      "Reveals your relationship to equality, mortality, and what you think makes life meaningful.",
    gradient: "from-slate-900 via-slate-600 to-slate-300",
  },
  {
    slug: "bioethics",
    name: "Bioethics",
    available: false,
    description:
      "Where do you draw the line on what humans should engineer about themselves?",
    intention:
      "Reveals your relationship to nature, progress, and the limits of human agency.",
    gradient: "from-amber-700 via-amber-500 to-orange-700",
  },
  {
    slug: "meaning_crisis",
    name: "Meaning Crisis",
    available: false,
    description:
      "What fills the void left by declining religion, nation, and community?",
    intention:
      "Reveals what you think grounds identity, purpose, and collective life.",
    gradient: "from-indigo-900 via-indigo-700 to-violet-900",
  },
  {
    slug: "gentrification",
    name: "Gentrification",
    available: false,
    description:
      "When a neighborhood improves economically and longtime residents are priced out, what should happen?",
    intention:
      "Reveals how you think about belonging, development, and who cities are for.",
    gradient: "from-stone-700 via-stone-500 to-stone-800",
  },
  {
    slug: "homelessness",
    name: "Homelessness",
    available: false,
    description:
      "Is homelessness a policy failure, an individual failure, or something else entirely?",
    intention:
      "Reveals your moral framework and what solutions you're willing to accept.",
    gradient: "from-zinc-900 via-zinc-600 to-zinc-200",
  },
  {
    slug: "gun_rights",
    name: "Gun Rights",
    available: false,
    description:
      "How do you think about individual rights, collective safety, and cultural identity?",
    intention:
      "Reveals your constitutional vs. utilitarian reasoning and how you handle irreducible value conflicts.",
    gradient: "from-red-900 via-red-700 to-stone-800",
  },
  {
    slug: "truth_media",
    name: "Truth & Media",
    available: false,
    description:
      "In a world of AI-generated content and institutional mistrust, how do you know what's true?",
    intention:
      "Reveals your epistemic framework and relationship to authority and expertise.",
    gradient: "from-fuchsia-700 via-purple-600 to-slate-900",
  },
  {
    slug: "economic_disruption",
    name: "Economic Disruption",
    available: false,
    description:
      "When automation reshapes work, who's responsible and what should be done?",
    intention:
      "Reveals your views on individual vs. systemic responsibility and how you think about economic transitions.",
    gradient: "from-neutral-700 via-zinc-600 to-neutral-900",
  },
] as const;
