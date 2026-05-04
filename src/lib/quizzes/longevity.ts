import type { AnyQuestion, Question } from "../types";

const TOPIC = "longevity";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q2a: {
    id: "q2a",
    topic: TOPIC,
    text: "The \"technology trickles down\" argument has a mixed track record — vaccines took decades to reach the developing world; some essential medicines still haven't. If Peter Thiel lives to 200 and a garment worker in Dhaka doesn't, is that just \"how technology works\"?",
    options: [
      { id: "A", text: "Yes — unequal access to new technology is temporary; the moral imperative is to develop it first, distribute it second" },
      { id: "B", text: "No — there's a qualitative difference between early access to a smartphone and early access to decades of life; the stakes change the ethics" },
      { id: "C", text: "The framing is a trap — the real question is whether longevity research is publicly funded and openly shared, or privately owned and patented" },
      { id: "D", text: "If we can't solve healthcare inequality for diseases we cured a century ago, adding centuries of life to the privileged just compounds the injustice" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2023, researchers at Harvard and the Salk Institute demonstrated partial age reversal in mice using Yamanaka factors — proteins that reprogram cells to a younger state. Altos Labs, backed by $3 billion from investors including Jeff Bezos and Yuri Milner, is trying to make this work in humans. If a treatment could let you live to 150 in good health, would you take it?",
    options: [
      { id: "A", text: "Absolutely — more healthy life is straightforwardly good; death is a problem to be solved, not a mystery to be honored" },
      { id: "B", text: "No — mortality gives life shape and urgency; remove the deadline and you lose something essential about what makes life meaningful" },
      { id: "C", text: "Depends entirely on who else has access — living to 150 in a world where most people still die at 75 is a dystopia, not a breakthrough" },
      { id: "D", text: "I'd want it but I'm suspicious of my wanting it — the desire for more time might be avoidance of the harder question of what to do with the time I have" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "Where does the meaning that mortality provides actually come from — is it the deadline itself, or something else that happens to correlate with finitude?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Peter Thiel's Breakout Labs has funded dozens of longevity startups. Larry Ellison has spent over $400 million on anti-aging research. Sam Altman invested $180 million in Retro Biosciences. Longevity treatments will almost certainly be expensive at first — a pattern that tracks: Ozempic costs $1,000/month in the U.S. while versions sell for under $5 in India. Is rich-first access to extra decades of life acceptable?",
    options: [
      { id: "A", text: "Yes — that's how all technology works; early adopters fund the path to mass access; smartphones followed the same curve" },
      { id: "B", text: "No — extending lifespan inequality is categorically different from other luxury goods; this is the ultimate resource and should be treated like a utility" },
      { id: "C", text: "Acceptable only with hard mandates — compulsory licensing, price controls, or public funding with universal access requirements built in from the start" },
      { id: "D", text: "The question exposes a deeper failure — our inability to distribute insulin equitably means we'll fail at longevity too; this isn't a technology problem, it's a governance one" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q2a" }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The average U.S. senator is 64 years old. Warren Buffett is 94 and still running Berkshire Hathaway. Rupert Murdoch controlled a global media empire into his 90s. If people live to 150, the social structures we've built around mortality — retirement at 65, generational wealth transfer, career arcs, political turnover — all break. What concerns you most?",
    options: [
      { id: "A", text: "Economic stagnation — the same people holding power, wealth, and property for 150 years, blocking younger generations indefinitely" },
      { id: "B", text: "Political ossification — if the same leaders and ideologies persist for a century, democratic renewal becomes impossible" },
      { id: "C", text: "Loss of cultural renewal — death clears space for new ideas, new art, new paradigms; without it, culture calcifies" },
      { id: "D", text: "None of this concerns me — these institutions were designed for short lives and can be redesigned for long ones; the problem is fixable" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "What's one institution or social structure you'd redesign first for a world of 150-year lifespans?",
      }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Global fertility rates are already falling — South Korea's hit 0.72 births per woman in 2023, the lowest ever recorded anywhere. Japan's population is shrinking by several hundred thousand per year. Elon Musk has called population collapse \"the biggest danger civilization faces.\" If radical life extension arrives in a world that's already aging and shrinking, does overpopulation even apply — or does longevity become the solution to demographic collapse?",
    options: [
      { id: "A", text: "Longevity solves the demographic crisis — if people stay healthy and productive for 120 years, declining birth rates become manageable, not catastrophic" },
      { id: "B", text: "It creates a gerontocracy — the problem with aging societies isn't headcount, it's who holds power; extending life makes that worse, not better" },
      { id: "C", text: "The two trends interact in unpredictable ways — longevity could reduce birth rates further, or it could create a permanent two-tier society of the long-lived and the rest" },
      { id: "D", text: "Overpopulation was always a distraction — the real constraint is resource distribution, not human numbers; longevity doesn't change that calculus either way" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Thought experiment: a pill exists that stops aging at 30. It's free and universally available. But to prevent ecological collapse, the global birth rate must drop to near zero. Essentially, the species stops reproducing in exchange for its current members living indefinitely. Take the deal?",
    options: [
      { id: "A", text: "Yes — individual humans living fuller, longer lives matters more than maximizing the total number of humans who ever exist" },
      { id: "B", text: "No — a world without children is a world without renewal, hope, or the particular form of love and meaning that parenting creates" },
      { id: "C", text: "The trade-off is a false binary, but it reveals something real — whether you value depth of individual experience or continuity of the collective" },
      { id: "D", text: "I'd take it and bet on expansion — space colonization, artificial ecosystems — before reproductive zero becomes permanent" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "If meaning requires renewal — new people, new generations — what does that imply about the value of any individual life, including your own?",
      }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Philosopher Bernard Williams argued in \"The Makropulos Case\" that immortality would inevitably lead to unbearable boredom — that a finite human character would exhaust all the experiences that could matter to it. Transhumanist Nick Bostrom counters that we'd simply grow and change over time. After 500 years, would you still be you?",
    options: [
      { id: "A", text: "Williams is right — identity requires continuity, and continuity requires limits; an endless life would become meaningless long before it became boring" },
      { id: "B", text: "Bostrom is right — humans already change dramatically across a single lifespan; a longer life is just more transformation, not less meaning" },
      { id: "C", text: "The question assumes identity is fixed — maybe the person at 500 wouldn't be \"you,\" and that's fine; it's still a person worth being" },
      { id: "D", text: "We can't answer this from inside a mortal frame — it's like asking a child whether adult life is worth living; the perspective doesn't transfer" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "If a longevity treatment existed today that was proven, safe, and free — but you had to decide for the whole world, not just yourself — would you make it available? What’s the strongest argument against your own answer?",
    freeformOnly: true,
  },
];

export const longevityQuiz = {
  topic: TOPIC,
  topicLabel: "Longevity",
  questions: main,
  followupQuestions,
};
