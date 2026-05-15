import type { AnyQuestion, Question } from "../types";

const TOPIC = "longevity";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q2a: {
    id: "q2a",
    topic: TOPIC,
    text: "The \"technology trickles down\" story has a spotty record. Vaccines took decades to reach the developing world. Some essential medicines still haven't arrived.\n\nIf Peter Thiel lives to 200 and a garment worker in Dhaka doesn't, is that just \"how technology works\"?",
    options: [
      { id: "A", text: "Yes. Unequal access is temporary. The moral priority is to develop it first, distribute second" },
      { id: "B", text: "No. There's a difference between early access to a smartphone and early access to decades of life. The stakes change the ethics" },
      { id: "C", text: "The framing is a trap. The real question is whether longevity research is publicly funded and open, or privately owned and patented" },
      { id: "D", text: "We can't distribute insulin equitably and we cured diabetes a century ago. Adding centuries of life to the privileged just compounds the injustice" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2023, researchers at Harvard and the Salk Institute reversed aging in mice. Not slowed it. Reversed it. They used proteins called Yamanaka factors that reprogram old cells back to a younger state.\n\nAltos Labs raised $3 billion, backed by Jeff Bezos and Yuri Milner, to make this work in humans. Three billion dollars. That's more than the entire annual budget of the National Institute on Aging.\n\nIf a treatment could let you live to 150 in good health, would you take it?",
    options: [
      { id: "A", text: "Absolutely. More healthy life is straightforwardly good. Death is a problem to solve, not a mystery to honor" },
      { id: "B", text: "No. Mortality gives life shape and urgency. Remove the deadline and you lose something essential about meaning" },
      { id: "C", text: "Depends on who else gets it. Living to 150 while most people die at 75 is a dystopia, not a breakthrough" },
      { id: "D", text: "I'd want it, but I'm suspicious of that wanting. The desire for more time might be avoiding the harder question of what to do with the time I have" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "Here's the thing about the \"mortality gives life meaning\" argument. Where does that meaning actually come from? Is it the deadline itself, or something else that just happens to correlate with having limited time?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Peter Thiel's Breakout Labs has funded dozens of longevity startups. Larry Ellison has spent over $400 million on anti-aging research. Sam Altman put $180 million into Retro Biosciences.\n\nHere's a number that puts this in perspective: Ozempic costs $1,000 a month in the U.S. The same molecule sells for under $5 in India. That's a 200x markup on a drug people need to survive.\n\nLongevity treatments will follow the same pattern. Is rich-first access to extra decades of life acceptable?",
    options: [
      { id: "A", text: "Yes. That's how all technology works. Early adopters fund the path to mass access. Smartphones followed the same curve" },
      { id: "B", text: "No. Extra decades of life aren't a luxury good. This is the ultimate resource and should be treated like a utility" },
      { id: "C", text: "Only with hard mandates. Compulsory licensing, price controls, or public funding with universal access built in from day one" },
      { id: "D", text: "The question exposes a deeper failure. We can't distribute insulin fairly. This isn't a technology problem. It's a governance problem" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q2a" }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The average U.S. senator is 64 years old. Warren Buffett is 94 and still running Berkshire Hathaway. Rupert Murdoch controlled a global media empire into his 90s.\n\nNow imagine those people live to 150. Every social structure we've built assumes people die. Retirement at 65. Generational wealth transfer. Career arcs. Political turnover. All of it breaks.\n\nWhat concerns you most?",
    options: [
      { id: "A", text: "Economic stagnation. The same people holding power, wealth, and property for 150 years, blocking younger generations indefinitely" },
      { id: "B", text: "Political ossification. If the same leaders and ideologies persist for a century, democratic renewal becomes impossible" },
      { id: "C", text: "Cultural calcification. Death clears space for new ideas, new art, new paradigms. Without it, culture fossilizes" },
      { id: "D", text: "None of this concerns me. These institutions were designed for short lives. They can be redesigned for long ones" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "Okay, you think we can redesign our way through this. Pick one institution or social structure. How would you rebuild it for a world of 150-year lifespans?",
      }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "South Korea's fertility rate hit 0.72 births per woman in 2023. That's the lowest ever recorded anywhere on Earth. To keep a population stable, you need 2.1. They're at one-third of that.\n\nJapan's population is shrinking by several hundred thousand people per year. That's a mid-sized city disappearing annually. Elon Musk has called population collapse \"the biggest danger civilization faces.\"\n\nIf radical life extension arrives in a world that's already aging and shrinking, does overpopulation even apply? Or does longevity become the fix for demographic collapse?",
    options: [
      { id: "A", text: "Longevity solves the crisis. If people stay healthy and productive for 120 years, declining birth rates are manageable, not catastrophic" },
      { id: "B", text: "It creates a gerontocracy. The problem with aging societies isn't headcount, it's who holds power. Extending life makes that worse" },
      { id: "C", text: "The two trends interact unpredictably. Longevity could reduce births further, or create a permanent two-tier society of the long-lived and the rest" },
      { id: "D", text: "Overpopulation was always a distraction. The real constraint is resource distribution, not human numbers. Longevity doesn't change that" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Thought experiment. A pill exists that stops aging at 30. It's free. Universally available. No catch, except one.\n\nTo prevent ecological collapse, the global birth rate must drop to near zero. The species stops reproducing. In exchange, its current members live indefinitely.\n\nYou're trading new people for existing people. Infinite depth of experience, but no new experiences from new minds. Take the deal?",
    options: [
      { id: "A", text: "Yes. Individual humans living fuller, longer lives matters more than maximizing the total number of humans who ever exist" },
      { id: "B", text: "No. A world without children is a world without renewal, hope, or the particular kind of love that parenting creates" },
      { id: "C", text: "The trade-off is a false binary. But it reveals something real: whether you value depth of individual experience or continuity of the collective" },
      { id: "D", text: "Take the deal and bet on expansion. Space colonization and artificial ecosystems before reproductive zero becomes permanent" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "This is interesting. If meaning requires renewal, new people, new generations, what does that imply about the value of any individual life? Including yours?",
      }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Philosopher Bernard Williams made a famous argument: immortality would inevitably lead to unbearable boredom. A finite human character would eventually exhaust every experience that could matter to it. You'd run out of things to care about.\n\nTranshumanist Nick Bostrom fires back: we already change dramatically across a single lifetime. The you at 15 and the you at 50 are barely the same person. A longer life is just more transformation.\n\nAfter 500 years, would you still be you?",
    options: [
      { id: "A", text: "Williams is right. Identity requires continuity, and continuity requires limits. An endless life becomes meaningless long before it becomes boring" },
      { id: "B", text: "Bostrom is right. Humans already change dramatically across one lifespan. A longer life is more transformation, not less meaning" },
      { id: "C", text: "The question assumes identity is fixed. Maybe the person at 500 wouldn't be \"you.\" And that's fine. It's still a person worth being" },
      { id: "D", text: "We can't answer this from inside a mortal frame. It's like asking a child whether adult life is worth living. The perspective doesn't transfer" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last question, and it's a big one. A longevity treatment exists today. Proven safe. Free. Available to everyone on Earth.\n\nBut you don't get to decide just for yourself. You decide for the whole world. Everyone gets it, or nobody does.\n\nWould you make it available? And here's the real test: what's the strongest argument against your own answer?",
    freeformOnly: true,
  },
];

export const longevityQuiz = {
  topic: TOPIC,
  topicLabel: "What If Nobody Had to Die?",
  questions: main,
  followupQuestions,
};
