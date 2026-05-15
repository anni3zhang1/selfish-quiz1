import type { AnyQuestion, Question } from "../types";

const TOPIC = "economic_disruption";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "Okay, so the government should handle automation's social costs. But the government is funded by taxes on the companies doing the automating. So we're just adding a middleman.\n\nWhat's the actual mechanism that keeps these companies accountable? Because \"tax them\" sounds simple until you remember how many accountants they can hire.",
    options: [
      { id: "A", text: "Tax each job automated directly to fund displaced workers. Bill Gates proposed this in 2017 and it's gaining traction." },
      { id: "B", text: "Don't tax the robot, tax the windfall profits. Let companies automate freely but capture the upside publicly." },
      { id: "C", text: "If AI was built on public research, DARPA, and open-source code, the public should own a share of the companies." },
      { id: "D", text: "History shows concentrated wealth gets captured, evaded, and lobbied away. The power imbalance is the real problem." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's a number that should stop you cold: Goldman Sachs estimated that generative AI could automate 300 million full-time jobs globally. Not assembly line jobs. Lawyers. Accountants. Radiologists. Programmers.\n\nEvery previous automation wave hit people who worked with their hands. This one hits people who work with their minds. That's never happened before.\n\nSo here's the real question: when machines can think, write, and reason, does the old pattern of \"new jobs always appear\" still hold?",
    options: [
      { id: "A", text: "No. Cognitive work is qualitatively different. When machines can reason, the 'new jobs' argument loses its historical basis." },
      { id: "B", text: "Yes. We've heard this panic every generation since the Luddites. The economy always invents work we can't predict yet." },
      { id: "C", text: "Long run, probably fine. But the transition could mean decades of real pain that nobody is seriously preparing for." },
      { id: "D", text: "The jobs question is secondary. Whoever owns the AI owns the productivity gains, and that's a shrinking group." },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "The \"new jobs will appear\" argument depends on humans having some persistent edge over machines. Once AI can reason, create, and learn, what specifically is that edge? Because \"we'll figure it out\" isn't an answer. It's a hope.",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Over 100 cities worldwide are now running UBI pilot programs. In Stockton, California, Mayor Tubbs gave 125 residents $500 a month, no strings attached. Finland tried it nationally with 2,000 unemployed citizens.\n\nResults? People felt better. They got slightly more employed. But critics point out the math: scaling this to an entire country is wildly expensive.\n\nHere's the tension. If automation kills millions of jobs, someone has to answer a pretty basic question: what do all those people do, and who pays for it?",
    options: [
      { id: "A", text: "UBI is the simplest safety net. It lets people retrain or create without the surveillance and stigma of traditional welfare." },
      { id: "B", text: "People need purpose, not just checks. UBI without meaningful work will produce an epidemic of purposelessness." },
      { id: "C", text: "UBI addresses survival but not power. Pair it with wealth taxes or public ownership of AI to fix the real imbalance." },
      { id: "D", text: "UBI is a distraction. The government should guarantee jobs, not write checks. Be the employer of last resort." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Amazon employs 1.5 million people. It also deployed over 750,000 robots by 2023. Let that ratio sink in.\n\nThe same company investing billions in robots that will replace its workers also has one of the highest injury rates in the industry. Workers in Staten Island and Bessemer, Alabama voted on unionization while the machines were already being installed.\n\nSo here's a pointed question: when a company automates away your job, what does it owe you?",
    options: [
      { id: "A", text: "Retraining and real transition support. Companies that profit from automation owe displaced workers more than a severance check." },
      { id: "B", text: "Nothing beyond what the law requires. Managing social transitions is the government's job, not a corporation's." },
      { id: "C", text: "A share of the ongoing gains. Automation increases profits forever. Displaced workers deserve equity or royalties, not a one-time payout." },
      { id: "D", text: "The question is too narrow. Amazon didn't create the conditions where warehouse work was people's best option. The economy already failed them." },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Between 2020 and 2023, Apple, Microsoft, and Google sat on over $400 billion in cash. Combined. While laying off 200,000 workers.\n\nThat's not a typo. Four hundred billion dollars in the bank, and they still cut people.\n\nMeanwhile, wages for the bottom 50% have barely budged in four decades, adjusted for inflation. Corporate profits as a share of the economy are near all-time highs. Economist Thomas Piketty says this is inevitable: returns on capital will always outpace returns on labor.\n\nIs the economy broken, or is this exactly what it was built to do?",
    options: [
      { id: "A", text: "Broken. Market concentration, captured regulators, and dead unions distorted a functional system. Reforms can still fix it." },
      { id: "B", text: "Working as designed. Capitalism concentrates wealth by nature. Pretending reforms will fix it dodges the structural question." },
      { id: "C", text: "Piketty nailed the diagnosis. But the fix isn't redistribution alone. Restructure ownership so workers share in returns on capital." },
      { id: "D", text: "Too Western a frame. Globally, capitalism lifted billions out of poverty. The inequality story changes depending on where you zoom in." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Detroit. Cleveland. Youngstown. Gary. These cities have been declining since the 1970s. That's fifty years.\n\nFifty years of retraining programs, enterprise zones, tax breaks, economic development initiatives. Basically every tool in the policy toolkit. And the jobs still haven't come back. Economists Autor and Hanson documented how the \"China shock\" permanently damaged these communities. Permanently. No recovery in sight.\n\nSo if half a century of trying couldn't fix the last automation wave, why would anyone believe this time is different?",
    options: [
      { id: "A", text: "It won't be. AI-disrupted communities will follow the Rust Belt trajectory. Plan for managed decline, not false renewal promises." },
      { id: "B", text: "This time is different, but worse. AI disruption is faster and wider than manufacturing loss. The response needs to match that speed." },
      { id: "C", text: "The Rust Belt was a policy choice: free trade without transition support. Build the safety net before disruption hits, not after." },
      { id: "D", text: "Maybe place-based recovery is the wrong goal. Help people move to opportunity with relocation support and portable benefits." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "\"Managed decline\" sounds humane in a policy paper. But picture a 35-year-old in a town that's not coming back. What does managed decline actually mean for her Tuesday morning? And who gets to decide when a community's time is up?",
      }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Here's something fascinating. Economist Daron Acemoglu won the 2024 Nobel Prize for showing that the choice between replacing workers and making workers better is not baked into the technology. It's a policy choice.\n\nThe same AI can go either way. Augmentation (making workers more productive) could raise wages for 80% of people. Automation (replacing workers) concentrates gains at the top.\n\nSame technology. Completely opposite outcomes. So what actually determines which path we take?",
    options: [
      { id: "A", text: "Market incentives. Replacing a worker eliminates a salary. Without policy intervention, the market will always choose replacement." },
      { id: "B", text: "Corporate governance. If workers had board seats or strong unions, companies would choose augmentation. It's about who's at the table." },
      { id: "C", text: "Tax policy. We tax labor and barely tax capital. Flip that, and you flip the incentive from automation to augmentation." },
      { id: "D", text: "Culture. Silicon Valley celebrates disruption and replacement. A different engineering culture would build complementary tools instead." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Think about the people you interact with in a given week. The barista, the therapist, the accountant, the teacher, the delivery driver.\n\nName one job that exists today that you think AI will make obsolete within 10 years. And one you think it never will.\n\nWhat's the line between them? What makes one replaceable and the other irreplaceable? That's the interesting part.",
    freeformOnly: true,
  },
];

export const economicDisruptionQuiz = {
  topic: TOPIC,
  topicLabel: "Your Job Wasn't Supposed to Disappear",
  questions: main,
  followupQuestions,
};
