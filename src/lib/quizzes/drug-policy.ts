import type { AnyQuestion, Question } from "../types";

const TOPIC = "drug_policy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "So here's a fascinating natural experiment. Two places tried basically the same thing: stop arresting people for drug possession.\n\nPortugal did it in 2001. They built out a whole treatment infrastructure first, made referrals mandatory, and wrapped a public health safety net around the policy change. HIV infections among drug users dropped 95%. Overdose deaths fell.\n\nOregon did it in 2020. They replaced criminal penalties with $100 fines and optional treatment referrals. By 2024, overdose deaths had climbed 43%, almost nobody used the referral system, and the legislature reversed the whole thing.\n\nWait really? Same concept, opposite outcomes. What broke?",
    options: [
      { id: "A", text: "Portugal built the treatment system before removing penalties. Oregon removed penalties without building anything to replace them." },
      { id: "B", text: "Portugal has universal healthcare and different social infrastructure. You can't transplant a policy without transplanting the context." },
      { id: "C", text: "Oregon didn't fail from decriminalization. Fentanyl arrived at the same time. That's a supply problem no demand policy fixes alone." },
      { id: "D", text: "Three years was not enough time. Shifting from criminal justice to public health takes a generation, not one legislative session." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Let's start with a trillion-dollar question. Literally.\n\nSince Nixon launched the War on Drugs in 1971, the U.S. has spent over $1 trillion on enforcement. It has incarcerated millions of people, disproportionately Black and Latino, despite roughly equal drug use rates across races.\n\nAnd the result? Drug overdose deaths hit a record 112,000 in 2023. Fentanyl is everywhere. The black market is thriving.\n\nWait really? A trillion dollars and half a century, and the problem got worse?\n\nThat's like hiring a plumber, paying them a million dollars, and coming home to find your house underwater. At what point do you ask whether the plumber was actually trying to fix the pipes?",
    options: [
      { id: "A", text: "Complete failure. Prohibition built black markets, filled prisons, and killed more people than it saved." },
      { id: "B", text: "Partial failure. Enforcement was biased and broken, but some drugs genuinely need limits on their spread." },
      { id: "C", text: "It didn't fail. It succeeded at its real purpose: political control of Black communities and the antiwar left." },
      { id: "D", text: "It failed, but so did Oregon's opposite approach. Decriminalization collapsed there by 2024. Neither extreme works." },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Here's one of those facts that should make your brain itch.\n\nCannabis is legal for recreational use in 24 states. It generates over $30 billion in annual sales. Billions in tax revenue.\n\nBut federally? Cannabis is Schedule I. Same category as heroin. The government's official position is that it has \"no accepted medical use.\"\n\nMeanwhile, over 40,000 people are still sitting in prison for cannabis offenses, most of them Black men. And most legal cannabis businesses? Owned by white entrepreneurs.\n\nSo picture this: one person is in a cell for selling the exact same product another person is selling legally in a licensed dispensary down the street. Same molecule. Different zip code, different skin color, different outcome.\n\nHas legalization actually delivered justice?",
    options: [
      { id: "A", text: "No. Without expungement and equity programs, legalization just transfers wealth from destroyed communities to new profiteers." },
      { id: "B", text: "It's a start. Ending arrests matters. Equity programs and expungement can be layered on without reversing legalization." },
      { id: "C", text: "The justice framing hides a real health question. Adolescent use, impaired driving, and dependency are concerns advocates minimize." },
      { id: "D", text: "The whole scheduling system is incoherent. Alcohol kills 140,000 a year and is legal. Cannabis: zero overdose deaths, Schedule I." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Let's talk about two drug dealers.\n\nDealer A sold a product they knew was addictive, ran a marketing campaign telling doctors it was safe, and made billions while over 500,000 people died. They pleaded guilty to federal charges twice, paid a $6 billion settlement, and kept most of their fortune. Nobody went to prison.\n\nDealer B sold small amounts of fentanyl on a street corner. Mandatory minimum: 20 years.\n\nDealer A is the Sackler family and Purdue Pharma. Dealer B is, well, basically anyone caught in a buy-bust operation.\n\nWait really? Half a million deaths and a guilty plea, and the penalty is... a fine? Meanwhile someone with a few grams gets two decades?\n\nThat's like fining an arsonist who burned down a city, then giving life in prison to a kid who lit a campfire. The scale of consequences is inverted.\n\nCan the legal system actually hold powerful drug dealers accountable?",
    options: [
      { id: "A", text: "No. The system punishes poverty and protects wealth. Street dealers get decades. Billionaire dealers pay a fraction." },
      { id: "B", text: "It failed here but can be fixed. Stronger corporate liability, personal charges for executives, and piercing the corporate veil." },
      { id: "C", text: "Criminal prosecution is the wrong tool. Regulation failed first. The FDA approved it, doctors prescribed it, insurers paid." },
      { id: "D", text: "\"Drug dealer\" is a political label, not a moral one. Pharma deaths are a \"crisis.\" Street deaths are \"crime.\" Same bodies." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Vancouver has a facility called Insite where people can inject drugs under medical supervision. It's been running since 2003. The number of overdose deaths that have happened inside that building is zero.\n\nZero. Over two decades.\n\nNeedle exchanges, naloxone distribution, drug testing strips: the WHO, the CDC, and most public health organizations say harm reduction is the single most effective way to keep drug users alive.\n\nBut here's where it gets interesting. Critics say these programs \"enable\" drug use. That they attract drug activity to neighborhoods. That they signal society has given up on sobriety.\n\nThink about that framing for a second. Nobody calls seatbelts an \"acceptance of car crashes.\" Nobody says fire extinguishers \"enable\" arson. We just... accept that risk exists and try to minimize the damage.\n\nSo why is this different? Is harm reduction an acceptance of failure, or is moralizing addiction the actual failure?",
    options: [
      { id: "A", text: "It's evidence-based pragmatism. You can't rehabilitate a dead person. Opposing harm reduction kills people for moral posturing." },
      { id: "B", text: "It's necessary but not sufficient. Managing symptoms without treating root causes turns crisis response into permanent maintenance." },
      { id: "C", text: "The enabling critique has merit. Injection sites in residential areas create real impacts. This needs community consent, not just expert endorsement." },
      { id: "D", text: "It's only controversial because we moralize addiction. We don't moralize seatbelts. That framing is what makes sensible policy toxic." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Here's a number that should stop you cold: 1.9 million people are incarcerated in the U.S. right now. That's the highest rate on Earth. About 45% of federal prisoners are there for drug offenses.\n\nNow here's the part that really twists. Black Americans are nearly 4 times more likely to be arrested for marijuana possession than white Americans. The usage rates? Roughly the same.\n\nAnd it gets more precise than that. The 1994 Crime Bill created a 100:1 sentencing disparity. Five grams of crack (more common in Black communities) triggered the same mandatory minimum as 500 grams of powder cocaine (more common in white communities). Same drug. Same molecule. One just had baking soda mixed in.\n\nThat's like sentencing someone to 10 years for a shot of espresso but 6 months for a latte. The caffeine is identical. The punishment is not.\n\nIs the drug war fundamentally a racial justice issue?",
    options: [
      { id: "A", text: "Yes. Drug policy has been a tool for racial control from the start. The disparities aren't enforcement accidents. They're the design." },
      { id: "B", text: "It's a factor, not the full picture. The opioid crisis devastated white Appalachia too. Class matters as much as race here." },
      { id: "C", text: "The racial framing is correct but incomplete. Even racially equitable drug enforcement would still be bad policy. Punishment doesn't work." },
      { id: "D", text: "It's primarily a class issue that intersects with race. Wealth buys treatment and lawyers. Race is real but downstream of economics." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Let's play a game. I'll list some drugs. You guess which ones are illegal.\n\nAlcohol: kills 140,000 Americans per year. Factor in 40% of violent crimes. Legal.\n\nTobacco: kills 480,000 Americans per year. Legal.\n\nCannabis: has caused zero recorded overdose deaths in human history. Federally illegal.\n\nPsilocybin: showing serious promise for treatment-resistant depression and PTSD. Schedule I.\n\nCaffeine: a psychoactive stimulant consumed daily by 90% of Americans. Completely unregulated.\n\nWait really? The substance that kills 480,000 people a year is sold at every gas station, but the one with zero overdose deaths is classified alongside heroin?\n\nThat's like banning tricycles and handing out monster trucks. The danger ranking has nothing to do with actual danger.\n\nShould drug policy be reorganized around evidence of harm instead of historical and cultural categories?",
    options: [
      { id: "A", text: "Yes. Regulate by toxicity, addiction potential, and social harm. By that standard, alcohol and tobacco are far more dangerous." },
      { id: "B", text: "In theory yes, but alcohol prohibition was a catastrophe. You can't criminalize culturally embedded substances. The line reflects enforceability." },
      { id: "C", text: "Evidence-based scheduling is necessary but not enough. You need treatment infrastructure too. Legalizing without capacity is Oregon's mistake." },
      { id: "D", text: "The inconsistency is the point. Drug categories reflect power, not pharmacology. Substances tied to wealth get tolerance. Others get prison." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Okay, you've seen the contradictions, the failures, the uneven enforcement, and the body count on all sides.\n\nNow it's your turn. If you could redesign drug policy for the U.S. from a blank page, what would you build?\n\nWhat's legal? What's regulated? What stays prohibited? And how do you handle addiction when it happens?",
    freeformOnly: true,
  },
];

export const drugPolicyQuiz = {
  topic: TOPIC,
  topicLabel: "Crime or Illness?",
  questions: main,
  followupQuestions,
};
