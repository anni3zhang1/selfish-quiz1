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
    name: "Who Gets to Build God?",
    available: true,
    tags: ["AI", "power", "regulation"],
    description:
      "The most powerful technology ever built is being developed by a handful of companies, and nobody elected any of them. Who should have the final say?",
    intention:
      "Reveals how you think about power, risk, and whether you trust institutions to govern what they don't fully understand.",
    gradient: "from-blue-500 via-cyan-500 to-blue-700",
  },
  {
    slug: "climate",
    name: "Who Pays for the Planet?",
    available: true,
    tags: ["climate", "energy", "trade-offs"],
    description:
      "The planet is warming and everyone agrees something should be done. Nobody agrees on what. Every solution has a cost, and the people who pay aren't the people who decide.",
    intention:
      "Reveals whether you think in systems, individuals, or institutions, and how you handle uncertainty when the stakes are civilization-sized.",
    gradient: "from-emerald-700 via-green-600 to-teal-800",
  },
  {
    slug: "longevity",
    name: "What If Nobody Had to Die?",
    available: true,
    tags: ["aging", "science", "inequality"],
    description:
      "We're getting closer to dramatically extending healthy human life. Some billionaires are spending fortunes on it. The question isn't just whether it works. It's what happens to a world where some people can afford to live forever and most can't.",
    intention:
      "Reveals your relationship to mortality, equality, and what you think actually makes a life meaningful.",
    gradient: "from-slate-900 via-slate-600 to-slate-300",
  },
  {
    slug: "bioethics",
    name: "Engineering Humans",
    available: true,
    tags: ["biology", "ethics", "medicine"],
    description:
      "We can edit genes, grow embryos from scratch, and sequence your genome for less than a pair of sneakers. The question isn't whether we can. It's who decides what's okay.",
    intention:
      "Reveals where you draw the line between healing and designing, and whether you think nature is something to protect or improve.",
    gradient: "from-amber-700 via-amber-500 to-orange-700",
  },
  {
    slug: "meaning_crisis",
    name: "The Meaning Vacuum",
    available: true,
    tags: ["religion", "purpose", "identity"],
    description:
      "Religion is fading faster than anything is filling the gap. People are lonelier, more anxious, and spending more on astrology apps than ever. Something is missing. What is it?",
    intention:
      "Reveals what you think actually holds people together, and whether we need something sacred or just something shared.",
    gradient: "from-indigo-900 via-indigo-700 to-violet-900",
  },
  {
    slug: "gentrification",
    name: "Who Gets to Stay?",
    available: true,
    tags: ["cities", "housing", "class"],
    description:
      "A neighborhood gets nicer. Coffee shops open. Rents double. The people who made it a community in the first place can't afford to live there anymore. Progress for whom?",
    intention:
      "Reveals how you think about belonging, development, and whether cities should serve the people who built them or the people who can pay.",
    gradient: "from-stone-700 via-stone-500 to-stone-800",
  },
  {
    slug: "homelessness",
    name: "More Empty Homes Than Homeless People",
    available: true,
    tags: ["poverty", "policy", "cities"],
    description:
      "The U.S. has more empty homes than homeless people. That fact alone tells you this isn't a simple problem. Is it a policy failure, a personal one, or something we haven't named yet?",
    intention:
      "Reveals your moral framework and what solutions you're actually willing to accept.",
    gradient: "from-zinc-900 via-zinc-600 to-zinc-200",
  },
  {
    slug: "gun_rights",
    name: "The Gun Equation",
    available: true,
    tags: ["rights", "safety", "culture"],
    description:
      "America has more guns than people. It also has a constitutional amendment that millions consider sacred. Every proposed solution makes someone's deepest values feel threatened. How do you solve a problem where both sides are right about something?",
    intention:
      "Reveals how you reason when rights and safety collide, and whether you think some values are simply non-negotiable.",
    gradient: "from-red-900 via-red-700 to-stone-800",
  },
  {
    slug: "truth_media",
    name: "How Do You Know What's True?",
    available: true,
    tags: ["media", "trust", "epistemics"],
    description:
      "AI can now generate fake video indistinguishable from real footage. Trust in every major institution is at historic lows. Your uncle and your professor get their news from completely different realities. Who do you believe?",
    intention:
      "Reveals your epistemic framework and whether you think truth is something you find, something you build, or something you fight over.",
    gradient: "from-fuchsia-700 via-purple-600 to-slate-900",
  },
  {
    slug: "economic_disruption",
    name: "Your Job Wasn't Supposed to Disappear",
    available: true,
    tags: ["work", "automation", "inequality"],
    description:
      "Every wave of automation creates new jobs and destroys old ones. Economists say the math works out in the long run. But nobody lives in the long run. What happens to the people in between?",
    intention:
      "Reveals whether you think disruption is something individuals should adapt to or something systems should prevent.",
    gradient: "from-neutral-700 via-zinc-600 to-neutral-900",
  },
  {
    slug: "us_foreign_policy",
    name: "When Should America Intervene?",
    available: true,
    tags: ["war", "diplomacy", "power"],
    description:
      "The U.S. has military bases in 80 countries and has intervened more than any nation in modern history. Sometimes it works. Sometimes it's catastrophic. When should the most powerful military on earth get involved, and who pays when it does or doesn't?",
    intention:
      "Reveals how you weigh sovereignty, humanitarianism, and national interest against each other.",
    gradient: "from-sky-800 via-blue-700 to-indigo-900",
  },
  {
    slug: "taiwan",
    name: "The Most Dangerous Place on Earth",
    available: true,
    tags: ["China", "geopolitics", "chips"],
    description:
      "Taiwan makes over 90% of the world's most advanced chips. China says it's a renegade province. The U.S. has been deliberately vague about whether it would go to war to defend it. Clarity could start a war. Ambiguity could too.",
    intention:
      "Reveals how you think about strategic risk, economic interdependence, and whether deterrence actually works.",
    gradient: "from-red-600 via-rose-500 to-blue-800",
  },
  {
    slug: "gaza_israel",
    name: "75 Years, No Answer",
    available: true,
    tags: ["conflict", "justice", "history"],
    description:
      "Two peoples, both with real historical claims, real trauma, and real grievances, fighting over the same territory for 75 years. Almost everyone who has an opinion is certain they're right. How do you think about a conflict where both sides have a point and both sides have blood on their hands?",
    intention:
      "Reveals how you navigate moral complexity, historical grievance, and competing claims to justice.",
    gradient: "from-amber-800 via-orange-600 to-stone-700",
  },
  {
    slug: "immigration",
    name: "The Border Question",
    available: true,
    tags: ["borders", "belonging", "labor"],
    description:
      "The U.S. was built by immigrants, runs on immigrant labor, and can't agree on whether to let more in. Every policy choice trades off compassion against pragmatism, and nobody's found a version that satisfies both.",
    intention:
      "Reveals how you think about borders, belonging, and what a country owes people who show up at its door.",
    gradient: "from-teal-700 via-cyan-600 to-emerald-800",
  },
  {
    slug: "nuclear_deterrence",
    name: "Peace by Threat of Annihilation",
    available: true,
    tags: ["nukes", "war", "risk"],
    description:
      "Nine countries have nuclear weapons. The theory is simple: nobody attacks because everyone dies. It's worked for 80 years. But it only has to fail once. Is mutually assured destruction the most successful peace strategy in history, or a coin flip we keep calling skill?",
    intention:
      "Reveals how you reason about catastrophic risk and whether stability built on fear can last.",
    gradient: "from-yellow-600 via-orange-500 to-red-800",
  },
  {
    slug: "animal_rights",
    name: "Sweaters for Dogs, Cages for Pigs",
    available: true,
    tags: ["ethics", "food", "science"],
    description:
      "We put dogs in sweaters and pigs in cages. We prosecute people for hurting cats and subsidize industries that kill billions of chickens a year. The line between which animals matter and which don't has nothing to do with biology. So where does it come from?",
    intention:
      "Reveals the boundaries of your moral circle and what you're willing to change when the evidence makes you uncomfortable.",
    gradient: "from-lime-700 via-green-600 to-emerald-800",
  },
  {
    slug: "democracy",
    name: "Can the People Be Trusted?",
    available: true,
    tags: ["governance", "power", "legitimacy"],
    description:
      "Democracy is the system most of the world claims to believe in. It's also the system that elected every leader people love to complain about. If voters keep choosing badly, is the problem the voters, the options, or the system itself?",
    intention:
      "Reveals how you think about legitimacy, expertise, and whether self-governance is a right or a skill.",
    gradient: "from-blue-800 via-indigo-600 to-purple-900",
  },
  {
    slug: "trans_rights",
    name: "Gender Is the New Fault Line",
    available: true,
    tags: ["identity", "medicine", "autonomy"],
    description:
      "Gender identity has become one of the most polarized topics in politics, medicine, and education. The science is evolving. The laws are contradictory. And the people at the center of it are caught between those who want to protect them and those who claim to.",
    intention:
      "Reveals how you navigate evolving science, competing rights claims, and whose experience you center.",
    gradient: "from-pink-500 via-blue-300 to-pink-500",
  },
  {
    slug: "drug_policy",
    name: "Crime or Illness?",
    available: true,
    tags: ["drugs", "justice", "health"],
    description:
      "The U.S. spent $1 trillion on the War on Drugs and has more people in prison for drug offenses than Europe has in prison for everything. Meanwhile, Portugal decriminalized all drugs in 2001 and overdose deaths dropped. Same problem, opposite solutions. Which one is working?",
    intention:
      "Reveals how you weigh personal freedom, public safety, and racial justice, and whether you trust evidence over intuition.",
    gradient: "from-violet-800 via-purple-600 to-fuchsia-700",
  },
  {
    slug: "consciousness",
    name: "Are You Sure You're Conscious?",
    available: true,
    tags: ["mind", "philosophy", "AI"],
    description:
      "You know you're conscious. You assume other people are too. But nobody can actually prove it. Now we're building AI systems that act like they understand, and we have no test for whether anything is truly experiencing the world or just performing like it does.",
    intention:
      "Reveals your deepest assumptions about what makes a mind real and whether science can ever answer that question.",
    gradient: "from-cyan-900 via-teal-700 to-sky-900",
  },
  {
    slug: "capitalism",
    name: "Who Wins When the Market Decides?",
    available: true,
    tags: ["economics", "markets", "power"],
    description:
      "Capitalism lifted billions out of poverty. It also created a world where eight people own more than the bottom half of humanity. Defenders say it just needs fixing. Critics say the flaws are the features. What do you think?",
    intention:
      "Reveals how you think about markets, power, and whether reform or replacement is the right frame.",
    gradient: "from-emerald-800 via-green-700 to-lime-900",
  },
  {
    slug: "reparations",
    name: "Can You Fix the Past?",
    available: true,
    tags: ["race", "justice", "history"],
    description:
      "Slavery ended 160 years ago. Its economic effects didn't. The average white family in America has eight times the wealth of the average Black family. Some say that's ancient history. Others say the bill is still unpaid. Can historical wrongs actually be repaired?",
    intention:
      "Reveals how you think about collective responsibility, historical debt, and what justice requires across generations.",
    gradient: "from-amber-900 via-yellow-700 to-orange-900",
  },
  {
    slug: "space_colonization",
    name: "Should We Leave Earth?",
    available: true,
    tags: ["space", "survival", "resources"],
    description:
      "Elon Musk wants a million people on Mars. Jeff Bezos wants factories in orbit. NASA is planning a permanent moon base. Is expanding into space humanity's insurance policy, or the most expensive way to avoid fixing the planet we already have?",
    intention:
      "Reveals how you weigh existential risk against present needs, and whether frontier expansion solves problems or exports them.",
    gradient: "from-slate-800 via-indigo-900 to-violet-950",
  },
  {
    slug: "surveillance_privacy",
    name: "Your Phone Knows More Than Your Therapist",
    available: true,
    tags: ["privacy", "security", "data"],
    description:
      "Your phone tracks where you go. Your browser knows what you think about at 2am. Governments say surveillance prevents terrorism. Companies say it improves your experience. You agreed to all of it in a terms-of-service you didn't read. How much should they be allowed to know?",
    intention:
      "Reveals where you draw the line between security and freedom, and whether you trust institutions with power over information.",
    gradient: "from-gray-800 via-slate-600 to-zinc-900",
  },
  {
    slug: "end_of_life",
    name: "How Should a Life End?",
    available: true,
    tags: ["death", "autonomy", "medicine"],
    description:
      "Modern medicine can keep a body alive long after the person inside would have chosen to stop. Eleven U.S. states allow assisted dying. Most don't. The people who want the right to choose and the people who want to protect life both think they're defending human dignity.",
    intention:
      "Reveals your relationship to mortality, autonomy, and what a society owes people at their most vulnerable.",
    gradient: "from-stone-800 via-warm-gray-600 to-neutral-900",
  },
  {
    slug: "education",
    name: "What Is School Actually For?",
    available: true,
    tags: ["learning", "kids", "opportunity"],
    description:
      "The American school system was designed in the 1800s to produce factory workers. It hasn't fundamentally changed since. Meanwhile, a kid with WiFi can learn more from YouTube than most classrooms offer. Is the system broken, or is it doing exactly what it was built to do?",
    intention:
      "Reveals how you think about human development, equal opportunity, and what knowledge actually matters.",
    gradient: "from-sky-600 via-blue-500 to-cyan-700",
  },
] as const;
