import { aiGovernanceQuiz } from "./ai-governance";
import { climateQuiz } from "./climate";
import { longevityQuiz } from "./longevity";
import { meaningCrisisQuiz } from "./meaning-crisis";
import { bioethicsQuiz } from "./bioethics";
import { truthMediaQuiz } from "./truth-media";
import { economicDisruptionQuiz } from "./economic-disruption";
import { gentrificationQuiz } from "./gentrification";
import { homelessnessQuiz } from "./homelessness";
import { gunRightsQuiz } from "./gun-rights";
import { usForeignPolicyQuiz } from "./us-foreign-policy";
import { taiwanQuiz } from "./taiwan";
import { gazaIsraelQuiz } from "./gaza-israel";
import { immigrationQuiz } from "./immigration";
import { nuclearDeterrenceQuiz } from "./nuclear-deterrence";
import { animalRightsQuiz } from "./animal-rights";
import { democracyQuiz } from "./democracy";
import { transRightsQuiz } from "./trans-rights";
import { drugPolicyQuiz } from "./drug-policy";
import { consciousnessQuiz } from "./consciousness";
import { capitalismQuiz } from "./capitalism";
import { reparationsQuiz } from "./reparations";
import { spaceColonizationQuiz } from "./space-colonization";
import { surveillancePrivacyQuiz } from "./surveillance-privacy";
import { endOfLifeQuiz } from "./end-of-life";
import { educationQuiz } from "./education";

export const quizzes = {
  ai_governance: aiGovernanceQuiz,
  climate: climateQuiz,
  longevity: longevityQuiz,
  meaning_crisis: meaningCrisisQuiz,
  bioethics: bioethicsQuiz,
  truth_media: truthMediaQuiz,
  economic_disruption: economicDisruptionQuiz,
  gentrification: gentrificationQuiz,
  homelessness: homelessnessQuiz,
  gun_rights: gunRightsQuiz,
  us_foreign_policy: usForeignPolicyQuiz,
  taiwan: taiwanQuiz,
  gaza_israel: gazaIsraelQuiz,
  immigration: immigrationQuiz,
  nuclear_deterrence: nuclearDeterrenceQuiz,
  animal_rights: animalRightsQuiz,
  democracy: democracyQuiz,
  trans_rights: transRightsQuiz,
  drug_policy: drugPolicyQuiz,
  consciousness: consciousnessQuiz,
  capitalism: capitalismQuiz,
  reparations: reparationsQuiz,
  space_colonization: spaceColonizationQuiz,
  surveillance_privacy: surveillancePrivacyQuiz,
  end_of_life: endOfLifeQuiz,
  education: educationQuiz,
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
    available: true,
    description:
      "Where do you stand on the hardest trade-offs of the climate crisis?",
    intention:
      "Reveals whether you think in systems, individuals, or institutions — and how you handle uncertainty at civilizational scale.",
    gradient: "from-emerald-700 via-green-600 to-teal-800",
  },
  {
    slug: "longevity",
    name: "Longevity",
    available: true,
    description:
      "If we could dramatically extend healthy human life, should we — and who gets to?",
    intention:
      "Reveals your relationship to equality, mortality, and what you think makes life meaningful.",
    gradient: "from-slate-900 via-slate-600 to-slate-300",
  },
  {
    slug: "bioethics",
    name: "Bioethics",
    available: true,
    description:
      "Where do you draw the line on what humans should engineer about themselves?",
    intention:
      "Reveals your relationship to nature, progress, and the limits of human agency.",
    gradient: "from-amber-700 via-amber-500 to-orange-700",
  },
  {
    slug: "meaning_crisis",
    name: "Meaning Crisis",
    available: true,
    description:
      "What fills the void left by declining religion, nation, and community?",
    intention:
      "Reveals what you think grounds identity, purpose, and collective life.",
    gradient: "from-indigo-900 via-indigo-700 to-violet-900",
  },
  {
    slug: "gentrification",
    name: "Gentrification",
    available: true,
    description:
      "When a neighborhood improves economically and longtime residents are priced out, what should happen?",
    intention:
      "Reveals how you think about belonging, development, and who cities are for.",
    gradient: "from-stone-700 via-stone-500 to-stone-800",
  },
  {
    slug: "homelessness",
    name: "Homelessness",
    available: true,
    description:
      "Is homelessness a policy failure, an individual failure, or something else entirely?",
    intention:
      "Reveals your moral framework and what solutions you're willing to accept.",
    gradient: "from-zinc-900 via-zinc-600 to-zinc-200",
  },
  {
    slug: "gun_rights",
    name: "Gun Rights",
    available: true,
    description:
      "How do you think about individual rights, collective safety, and cultural identity?",
    intention:
      "Reveals your constitutional vs. utilitarian reasoning and how you handle irreducible value conflicts.",
    gradient: "from-red-900 via-red-700 to-stone-800",
  },
  {
    slug: "truth_media",
    name: "Truth & Media",
    available: true,
    description:
      "In a world of AI-generated content and institutional mistrust, how do you know what's true?",
    intention:
      "Reveals your epistemic framework and relationship to authority and expertise.",
    gradient: "from-fuchsia-700 via-purple-600 to-slate-900",
  },
  {
    slug: "economic_disruption",
    name: "Economic Disruption",
    available: true,
    description:
      "When automation reshapes work, who's responsible and what should be done?",
    intention:
      "Reveals your views on individual vs. systemic responsibility and how you think about economic transitions.",
    gradient: "from-neutral-700 via-zinc-600 to-neutral-900",
  },
  {
    slug: "us_foreign_policy",
    name: "US Foreign Policy",
    available: true,
    description:
      "When should the world's most powerful military intervene — and who bears the cost when it does or doesn't?",
    intention:
      "Reveals how you weigh sovereignty, humanitarianism, and national interest against each other.",
    gradient: "from-sky-800 via-blue-700 to-indigo-900",
  },
  {
    slug: "taiwan",
    name: "Taiwan",
    available: true,
    description:
      "How far should the U.S. go to defend Taiwan — and what's really at stake?",
    intention:
      "Reveals how you think about strategic risk, economic interdependence, and the limits of deterrence.",
    gradient: "from-red-600 via-rose-500 to-blue-800",
  },
  {
    slug: "gaza_israel",
    name: "Gaza & Israel",
    available: true,
    description:
      "How do you think about one of the world's most intractable conflicts?",
    intention:
      "Reveals how you navigate moral complexity, historical grievance, and competing claims to justice.",
    gradient: "from-amber-800 via-orange-600 to-stone-700",
  },
  {
    slug: "immigration",
    name: "Immigration",
    available: true,
    description:
      "Who should get in, who decides, and what do we owe people who are already here?",
    intention:
      "Reveals your views on borders, belonging, and how you balance compassion with pragmatism.",
    gradient: "from-teal-700 via-cyan-600 to-emerald-800",
  },
  {
    slug: "nuclear_deterrence",
    name: "Nuclear Deterrence",
    available: true,
    description:
      "Does the threat of mutual annihilation keep the peace — or is it a gamble we'll eventually lose?",
    intention:
      "Reveals how you reason about catastrophic risk, power, and whether stability built on fear can last.",
    gradient: "from-yellow-600 via-orange-500 to-red-800",
  },
  {
    slug: "animal_rights",
    name: "Animal Rights",
    available: true,
    description:
      "Where do you draw the line on how humans treat other species?",
    intention:
      "Reveals your moral circle — who counts, why, and what you're willing to change when the evidence is uncomfortable.",
    gradient: "from-lime-700 via-green-600 to-emerald-800",
  },
  {
    slug: "democracy",
    name: "Democracy",
    available: true,
    description:
      "Is democracy the best system — or just the least bad one, and is it failing?",
    intention:
      "Reveals how you think about legitimacy, expertise, and whether the people can be trusted to govern themselves.",
    gradient: "from-blue-800 via-indigo-600 to-purple-900",
  },
  {
    slug: "trans_rights",
    name: "Trans Rights",
    available: true,
    description:
      "How do you think about identity, medicine, and the boundaries of personal autonomy?",
    intention:
      "Reveals how you navigate evolving science, competing rights claims, and whose experience you center.",
    gradient: "from-pink-500 via-blue-300 to-pink-500",
  },
  {
    slug: "drug_policy",
    name: "Drug Policy",
    available: true,
    description:
      "Should drugs be a criminal justice issue, a public health issue, or something else?",
    intention:
      "Reveals how you weigh personal freedom, public safety, and racial justice — and whether you trust evidence over intuition.",
    gradient: "from-violet-800 via-purple-600 to-fuchsia-700",
  },
  {
    slug: "consciousness",
    name: "Consciousness",
    available: true,
    description:
      "What is subjective experience, and does it matter for how we treat minds — human or artificial?",
    intention:
      "Reveals your deepest assumptions about what makes a mind real and whether science can answer that question.",
    gradient: "from-cyan-900 via-teal-700 to-sky-900",
  },
  {
    slug: "capitalism",
    name: "Capitalism",
    available: true,
    description:
      "Is the economic system working — and if not, what would something better look like?",
    intention:
      "Reveals how you think about markets, power, and whether reform or replacement is the right frame.",
    gradient: "from-emerald-800 via-green-700 to-lime-900",
  },
  {
    slug: "reparations",
    name: "Reparations",
    available: true,
    description:
      "Can historical wrongs be repaired — and if so, what does that actually look like?",
    intention:
      "Reveals how you think about collective responsibility, historical debt, and what justice requires across generations.",
    gradient: "from-amber-900 via-yellow-700 to-orange-900",
  },
  {
    slug: "space_colonization",
    name: "Space Colonization",
    available: true,
    description:
      "Should humanity expand beyond Earth — and who decides how?",
    intention:
      "Reveals how you weigh existential risk, resource allocation, and whether frontier expansion solves or exports our problems.",
    gradient: "from-slate-800 via-indigo-900 to-violet-950",
  },
  {
    slug: "surveillance_privacy",
    name: "Surveillance & Privacy",
    available: true,
    description:
      "How much should governments and corporations be allowed to know about you?",
    intention:
      "Reveals where you draw the line between security and freedom — and whether you trust institutions with power over information.",
    gradient: "from-gray-800 via-slate-600 to-zinc-900",
  },
  {
    slug: "end_of_life",
    name: "End of Life",
    available: true,
    description:
      "Who should decide when and how a life ends — and what makes a death good?",
    intention:
      "Reveals your relationship to mortality, autonomy, and what you think a society owes people at their most vulnerable.",
    gradient: "from-stone-800 via-warm-gray-600 to-neutral-900",
  },
  {
    slug: "education",
    name: "Education",
    available: true,
    description:
      "What is school actually for — and is the current system delivering it?",
    intention:
      "Reveals how you think about human development, equal opportunity, and what knowledge matters most.",
    gradient: "from-sky-600 via-blue-500 to-cyan-700",
  },
] as const;
