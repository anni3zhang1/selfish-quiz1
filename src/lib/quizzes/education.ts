import type { AnyQuestion, Question } from "../types";

const TOPIC = "education";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "Okay so if the 13,000-district patchwork is the structural problem, what do you actually replace it with?\n\nThis is where it gets politically fascinating. Americans treat local control of schools almost like a constitutional right. It is deeply wired into the culture. So any fix has to wrestle with a country that simultaneously wants world-class results AND the freedom to run things from the town level.\n\nWhat is the least impossible path forward?",
    options: [
      { id: "A", text: "National standards, local teaching. Set the \"what\" federally and let districts figure out the \"how.\"" },
      { id: "B", text: "Consolidate at the state level. Town-by-town control is an outdated structure that locks in inequality." },
      { id: "C", text: "Equalize the money federally but keep local decisions. The problem is funding gaps, not who decides." },
      { id: "D", text: "Centralization is a red herring. Finland is centralized, Canada is not, both outperform us. Culture matters more." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here is a number that should stop you in your tracks. The U.S. has tripled its per-pupil spending since 1970 in real, inflation-adjusted dollars. Tripled.\n\nAnd reading and math scores? Flat. For decades. Then COVID made them worse.\n\nNow here is the part that really stings. Countries like Poland, Estonia, and Vietnam spend a fraction of what America spends per student and routinely beat us on international assessments. American students rank 36th in math among OECD nations. Thirty-sixth. That is not a rounding error.\n\nSo wait really... if tripling the budget did not move the needle, what exactly is broken?",
    options: [
      { id: "A", text: "The structure is broken. 13,000 districts with no national curriculum means the money gets spent, just badly." },
      { id: "B", text: "The total is fine but the distribution is insane. Wealthy districts spend 2-3x more per kid than poor ones." },
      { id: "C", text: "Those international comparisons are misleading. Control for poverty and diversity and the U.S. looks comparable." },
      { id: "D", text: "We are measuring the wrong things. PISA tests a narrow slice. Creativity and resilience do not show up." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In January 2023, New York City public schools banned ChatGPT. By September of that same year, they reversed the ban and started integrating AI into classrooms.\n\nThat is not a policy evolution. That is whiplash. And it reveals something important: nobody actually knows what to do here.\n\nAI can personalize learning, tutor kids one-on-one at scale, and help students with disabilities in ways that were impossible five years ago. But it can also just... do the homework. It can quietly replace the struggle that makes learning happen in the first place.\n\nAnd here is the deeper problem nobody wants to say out loud: if a machine can pass every test your school gives, what exactly is that school testing for?\n\nHow should schools deal with this?",
    options: [
      { id: "A", text: "Integrate it fully. Banning AI is like banning calculators in the 80s. Teach with the tools kids will actually use." },
      { id: "B", text: "Restrict it hard until we understand the costs. We do not know what AI does to developing brains." },
      { id: "C", text: "AI as tutor is great. AI as homework machine is dangerous. Schools need to enforce that line carefully." },
      { id: "D", text: "AI makes the whole model obsolete. The question is not how to add AI to school. It is what school is for now." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The average American graduates college with $37,000 in student loan debt. The national total? $1.7 trillion. That is more than all credit card debt and all auto loans in the country combined.\n\nLet that sink in. An entire generation owes more for their education than Americans owe on their cars.\n\nMeanwhile, Germany, Norway, and Finland offer free or nearly free university. Same subjects. Same quality. Funded by taxes.\n\nAnd here is the part that should really make you pause: the Federal Reserve found that the earnings boost from a bachelor's degree has been shrinking for recent graduates even as the debt keeps climbing.\n\nSo wait really... is college still a good deal, or are we just running on an outdated assumption?",
    options: [
      { id: "A", text: "Still worth it on average. Degree holders earn significantly more over a lifetime. The debt structure is the problem." },
      { id: "B", text: "Increasingly not. For many students at non-elite schools in low-return majors, the math just does not work." },
      { id: "C", text: "Wrong question entirely. Reducing education to ROI calculations ignores its role in building citizens and thinkers." },
      { id: "D", text: "The value is fine. The price is the scandal. American universities charge 3-10x what European ones do for similar outcomes." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Between 2021 and 2024, 44 U.S. states introduced laws restricting how race, gender, and sexuality can be discussed in public schools. Florida's \"Stop WOKE Act\" bars instruction that might make students feel \"guilt\" or \"anguish\" based on race.\n\nAt the same time, PEN America documented over 10,000 book bans in a single school year. The vast majority targeted books by or about LGBTQ+ people and people of color.\n\nBoth sides think they are protecting children. One side calls it parental rights. The other calls it censorship.\n\nBut zoom out for a second. This fight is not really about any particular book or lesson plan. It is about something much bigger: who gets to decide what a child's mind encounters?\n\nWhere do you come down?",
    options: [
      { id: "A", text: "Parents decide. They are the primary stakeholders. Schools work for families, not the other way around." },
      { id: "B", text: "Professional educators decide. Teaching is a profession. You would not let politics dictate surgery." },
      { id: "C", text: "Balance, but the current fight is lopsided. One family's opt-out should not become every family's ban." },
      { id: "D", text: "Both sides are missing the real question: is school supposed to transmit community values or challenge them?" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Finland has no standardized tests until age 16. No private schools. No homework until middle school. No ability tracking. Their teachers are required to hold master's degrees, get paid like engineers, and have near-total freedom in the classroom.\n\nThe result? Consistently one of the best education systems on the planet.\n\nNow look at the U.S. Standardized tests everywhere. Teachers paid a national average of $66,000. Chronic teacher shortages in the districts that need help the most.\n\nIt is like watching two restaurants. One pays its chefs well, gives them creative control, and trusts them. The other underpays its cooks, makes them follow a rigid recipe, then wonders why the food is bad.\n\nIf you could pull one lever to fix American education, which one matters most?",
    options: [
      { id: "A", text: "Invest in teachers like Finland does. Pay them well, trust them, and everything else follows from that." },
      { id: "B", text: "Kill standardized testing. It narrows the curriculum, punishes poor schools, and teaches kids to fill in bubbles." },
      { id: "C", text: "Address poverty first. Family income is the strongest predictor of outcomes. School reform without that is theater." },
      { id: "D", text: "Finland is not transferable. A small, homogeneous Nordic welfare state is not a blueprint for 330 million people." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Milton Friedman proposed school vouchers in 1955. The idea is elegant: let public money follow the student to whatever school they choose, public or private. Competition improves everything. Markets work.\n\nIn 2023, the idea finally went mainstream. Arizona, Florida, and several other states passed universal voucher programs.\n\nBut here is where it gets interesting. A major study of Indiana's voucher program found that students who used vouchers to attend private schools actually performed worse on math and reading tests than comparable public school students. Worse. Not the same. Worse.\n\nMeanwhile, public schools in voucher states saw their funding shrink.\n\nSo the theory sounds great. What does the evidence actually say?",
    options: [
      { id: "A", text: "Vouchers are failing. They drain public schools and do not improve outcomes. The evidence is consistently negative." },
      { id: "B", text: "Test scores are not the whole story. Families choose private schools for safety, values, and community. That counts." },
      { id: "C", text: "The principle is sound but the execution is sloppy. Voucher schools need real accountability and outcome requirements." },
      { id: "D", text: "School choice was never really about education. It was about defunding public schools and subsidizing religious ones." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and this is personal.\n\nThink about the single most valuable thing you learned in school. Now think about the single biggest waste of time.\n\nHold both of those in your head. What do they tell you about what education should actually be for?",
    freeformOnly: true,
  },
];

export const educationQuiz = {
  topic: TOPIC,
  topicLabel: "What Is School Actually For?",
  questions: main,
  followupQuestions,
};
