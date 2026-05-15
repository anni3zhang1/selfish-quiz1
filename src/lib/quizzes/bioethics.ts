import type { AnyQuestion, Question } from "../types";

const TOPIC = "bioethics";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2018, a Chinese scientist edited the genes of twin embryos to make them HIV-resistant. He went to prison for three years. In 2023, the first CRISPR therapy was approved to treat sickle cell disease.\n\nSame technology. One use got you a prison sentence, the other got FDA approval. The line between \"therapy\" and \"enhancement\" is supposed to be clear. Where do you draw it?",
    options: [
      { id: "A", text: "Therapy is fine, enhancement is not. Fixing disease is different from designing traits" },
      { id: "B", text: "That line won't hold. Fix sickle cell today, optimize IQ tomorrow. Every therapy is an enhancement waiting to happen" },
      { id: "C", text: "Draw the line at access, not type. Any modification is fine if everyone can get it. The danger is genetic aristocracy" },
      { id: "D", text: "The crime was acting alone. Gene editing isn't the problem. The absence of governance over irreversible changes is" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "If the therapy-enhancement line is unsustainable, what's the actual limiting principle? Or is there none?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2022, a team in Israel put stem cells in a dish and waited. Eight days later, they had a mouse embryo with a beating heart. No egg. No sperm. No womb involved at all.\n\nThere's a global rule: don't grow a human embryo past 14 days. Nobody knows exactly why 14. It was a compromise drawn up in the 1980s, before any of this was possible. Now scientists say the biggest breakthroughs are on the other side of that line. Should we cross it?",
    options: [
      { id: "A", text: "Hold the line. We don't know when consciousness starts, and you don't mess around with that" },
      { id: "B", text: "The rule was always a guess. Push to 28 days and you could crack miscarriage, infertility, developmental disease" },
      { id: "C", text: "Don't scrap it, update it. A rule that adjusts with evidence beats a fixed ban or no rule at all" },
      { id: "D", text: "Counting days misses the point. Synthetic embryos break the old categories. We need a new framework entirely" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The first human genome cost more than the International Space Station. Now you can get yours sequenced for the price of a nice dinner.\n\nBut here's the thing nobody talks about: when 23andMe almost went bankrupt in 2024, the most valuable item on its books was the DNA of 15 million customers. Your spit kit isn't a product. You're the product. Who should own your genetic data?",
    options: [
      { id: "A", text: "You should. It's the most personal data that exists. Strict individual consent and control, period" },
      { id: "B", text: "Nobody. Genetic data is most valuable pooled for research. Individual ownership slows down breakthroughs for everyone" },
      { id: "C", text: "Ownership is the wrong question. What matters is governance: who accesses it, for what, with what consequences for misuse" },
      { id: "D", text: "The question is moot. The data is already out there. The real fight is what happens next" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "If genetic data is already out and can't be recalled, what's the most important safeguard to build now, before insurers, employers, and governments start using it?",
      }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Surrogacy is a $14 billion industry in the U.S. Wealthy couples routinely pay women in lower-income countries, or lower-income women at home, to carry their children.\n\nFeminist critics call it reproductive exploitation. Advocates say it gives women economic agency and helps people who can't have kids any other way. Both sides think they're defending women. Is commercial surrogacy ethical?",
    options: [
      { id: "A", text: "Yes. Women can make autonomous decisions about their bodies. Banning it is paternalistic" },
      { id: "B", text: "No. The power gap between a wealthy couple and a surrogate who needs the money makes \"consent\" a fiction" },
      { id: "C", text: "It depends entirely on regulation. Strong legal protections make it a different thing from an unregulated market" },
      { id: "D", text: "The individual ethics distract from the real question: why is carrying someone else's child some women's best economic option?" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "The FDA rejected MDMA for PTSD in 2024. Psilocybin for depression is approved in Australia and in late-stage trials everywhere else. Oregon lets you take supervised psilocybin right now, no prescription needed.\n\nThe science is promising but early. And we've been here before: promising early results, massive enthusiasm, and then decades of damage. How should society handle psychedelics?",
    options: [
      { id: "A", text: "Full medicalization. Same path as any drug. Anything less risks another opioid-style disaster built on hype" },
      { id: "B", text: "The medical model is too narrow. These are tools for consciousness, not just symptom relief. Clinical settings miss the point" },
      { id: "C", text: "Oregon got it right. Supervised access with trained facilitators, outside the medical system" },
      { id: "D", text: "The real question is who controls the experience. Pharma patenting psilocybin is a completely different thing from ceremonial or personal use" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In Denmark, nearly every pregnant woman gets screened for Down syndrome. About 95% of positive diagnoses end in termination. Iceland has nearly eliminated Down syndrome births entirely.\n\nDisability rights advocates call this eugenics. Parents who chose termination call it the hardest decision of their lives. Here's the question: is a population-level pattern that effectively eliminates a condition the same thing as individual reproductive choice, or something different?",
    options: [
      { id: "A", text: "It's individual choice. The aggregate pattern is an outcome of free decisions, not a policy" },
      { id: "B", text: "When a system predictably eliminates a group of people, it's eugenic. Intent doesn't change the outcome" },
      { id: "C", text: "It depends on what society offers. With real support, fewer parents would terminate. The \"choice\" reflects a failure of inclusion" },
      { id: "D", text: "Both are true at once. Reproductive autonomy is sacred and the aggregate effect is erasure. You have to hold both" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "If 95% of parents in a system make the same choice, at what point does the system itself become the agent, not the individual?",
      }
    },
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "What's one thing about your own body or mind you'd change if the technology existed, and one thing you wouldn't touch even if you could? What's the difference?",
    freeformOnly: true,
  },
];

export const bioethicsQuiz = {
  topic: TOPIC,
  topicLabel: "Engineering Humans",
  questions: main,
  followupQuestions,
};
