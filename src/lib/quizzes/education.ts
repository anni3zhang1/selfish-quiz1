import type { AnyQuestion, Question } from "../types";

const TOPIC = "education";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "If the 13,000-district system is the structural problem, what\'s the alternative — and is centralization politically feasible in a country where local control of schools is almost a constitutional value?",
    options: [
      { id: "A", text: "National curriculum with local implementation — set what students need to learn federally but let districts decide how to teach it; standards without micromanagement" },
      { id: "B", text: "State-level consolidation — reduce 13,000 districts to a manageable number per state; local control at the town level is an anachronism that entrenches inequality" },
      { id: "C", text: "Equalize funding federally, keep local control — the problem isn\'t that districts make decisions; it\'s that rich districts have more money; equalize the resources and let communities decide" },
      { id: "D", text: "Centralization isn\'t the answer — the countries that outperform the U.S. include both centralized (Finland) and decentralized (Canada) systems; the structure matters less than the culture and investment" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "U.S. spending per pupil has tripled in inflation-adjusted dollars since 1970, yet reading and math scores on the National Assessment of Educational Progress (NAEP) have been essentially flat for decades — and dropped sharply after COVID. Meanwhile, countries spending far less per student (Poland, Estonia, Vietnam) routinely outperform the U.S. on PISA international assessments. American students rank 36th in math among OECD nations. Is the problem funding, or something else entirely?",
    options: [
      { id: "A", text: "It\'s not funding, it\'s structure — the decentralized, 13,000-district system with elected school boards, local property tax funding, and no national curriculum is the problem; the money gets spent, just badly" },
      { id: "B", text: "It IS funding, but distribution — total spending is adequate; the problem is that wealthy districts spend 2-3x more per student than poor ones; the system concentrates resources where they\'re least needed" },
      { id: "C", text: "The international comparisons are misleading — the U.S. educates a more diverse, more unequal, more socially complex population than Estonia or Poland; controlling for poverty, American schools perform comparably" },
      { id: "D", text: "The metrics are wrong — NAEP and PISA measure a narrow slice of what education should accomplish; if we measured creativity, resilience, or entrepreneurship, the picture would look different" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In January 2023, New York City public schools banned ChatGPT. By September, they reversed the ban and began integrating AI into classrooms. This whiplash reflects a genuine dilemma: AI can personalize learning, provide instant tutoring, and help students with disabilities — but it can also do students\' homework, undermine critical thinking development, and widen gaps between students who learn to use AI effectively and those who don\'t. How should schools respond to AI?",
    options: [
      { id: "A", text: "Integrate it fully — banning AI in schools is like banning calculators in the 1980s; students need to learn with the tools they\'ll use for the rest of their lives" },
      { id: "B", text: "Restrict it heavily until the pedagogy catches up — we don\'t know what AI does to learning development; the precautionary principle matters when the stakes are children\'s cognitive growth" },
      { id: "C", text: "Use AI to teach, not to do — AI as a tutor or feedback tool is different from AI as a homework machine; the distinction matters and schools need to build the literacy to enforce it" },
      { id: "D", text: "AI makes the current model obsolete — if AI can do everything school tests for, the question isn\'t how to integrate AI into school; it\'s what school is for when information and analysis are free" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Average U.S. student loan debt reached $37,000 in 2024, with total outstanding debt exceeding $1.7 trillion — more than credit card debt and auto loans. The Biden administration\'s 2022 forgiveness plan was struck down by the Supreme Court. Meanwhile, Germany, Norway, and Finland offer free or near-free university education funded by taxes. A 2023 Federal Reserve study found that the college wage premium — the earnings boost from a bachelor\'s degree — has been declining for recent graduates while debt loads increase. Is college still worth it?",
    options: [
      { id: "A", text: "Still worth it on average — the data shows degree holders still earn significantly more over a lifetime; the problem is the debt structure, not the education itself" },
      { id: "B", text: "Increasingly not — for many students, especially those at non-elite schools in low-return majors, the debt-to-earnings ratio makes college a bad financial bet" },
      { id: "C", text: "The question is wrong — education shouldn\'t be evaluated primarily as a financial investment; reducing college to ROI calculations ignores its role in developing citizens, thinkers, and humans" },
      { id: "D", text: "The real scandal is the cost, not the value — American universities charge 3-10x what comparable European institutions charge for similar outcomes; the problem is a broken market, not a broken product" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Between 2021 and 2024, 44 U.S. states introduced legislation restricting how race, gender, and sexuality can be discussed in public schools. Florida\'s \"Stop WOKE Act\" (2022) bars instruction that could make students feel \"guilt\" or \"anguish\" based on race. Meanwhile, PEN America documented over 10,000 book bans in the 2022-2023 school year, predominantly targeting books by or about LGBTQ+ people and people of color. Supporters frame this as parental rights; opponents call it censorship. Who should decide what children learn?",
    options: [
      { id: "A", text: "Parents — they are the primary stakeholders in their children\'s education; schools work for families, not the other way around; parental control is a democratic right" },
      { id: "B", text: "Professional educators with curriculum standards — teaching is a profession; letting political pressure dictate content is like letting patients dictate surgery; expertise matters" },
      { id: "C", text: "A balance, but the current fight is asymmetric — some parents are using \"parental rights\" to impose their values on every child in the school; one family\'s opt-out shouldn\'t be every family\'s ban" },
      { id: "D", text: "The debate masks the real question — which is whether public education\'s purpose is to transmit community values or to challenge them; the two sides aren\'t debating curriculum, they\'re debating the mission of school" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Finland consistently ranks among the top education systems globally despite having no standardized testing until age 16, no private schools, no homework until middle school, and no tracking students by ability. Finnish teachers are required to hold master\'s degrees, are paid comparably to engineers, and have near-total classroom autonomy. The U.S. system, by contrast, relies heavily on standardized testing (No Child Left Behind, Common Core assessments), pays teachers a national average of $66,000, and has chronic teacher shortages in low-income districts. What\'s the most important lever for improving American education?",
    options: [
      { id: "A", text: "Teacher quality and autonomy — everything else is secondary; invest in teachers the way Finland does and the system transforms; underpay and micromanage them and nothing else matters" },
      { id: "B", text: "Eliminate testing and tracking — standardized testing narrows curriculum, punishes poor schools, and teaches to the test; remove it and let teachers teach" },
      { id: "C", text: "Address poverty first — the single strongest predictor of educational outcomes is family income; school reform without poverty reduction is rearranging deck chairs" },
      { id: "D", text: "Finland isn\'t transferable — a small, homogeneous, high-trust Nordic country with a strong welfare state is not a template for a 330-million-person multiethnic nation; cherry-picking their model is misleading" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2023, the school choice movement achieved its largest victories: Arizona, Florida, and several other states passed universal voucher programs allowing public funds to follow students to private and religious schools. Economist Milton Friedman first proposed school vouchers in 1955, arguing that competition would improve all schools. A 2023 study of Indiana\'s voucher program found that students who used vouchers to attend private schools performed worse on math and reading tests than comparable public school students. Meanwhile, public schools in voucher states saw reduced funding. Is school choice working?",
    options: [
      { id: "A", text: "No — voucher programs drain public schools without improving private school outcomes; the evidence consistently shows neutral to negative academic results while defunding the public system" },
      { id: "B", text: "Yes — academic test scores aren\'t the only measure; families choose private schools for safety, values alignment, and community; parental satisfaction matters even if test scores don\'t improve" },
      { id: "C", text: "The evidence is mixed but the principle matters — competition and choice are good; the problem is implementation (weak accountability, no outcome requirements for voucher schools), not the concept" },
      { id: "D", text: "School choice is a political project, not an education policy — the goal was always to defund public education, subsidize religious schools with public money, and weaken teachers\' unions; the academic results are irrelevant to its proponents" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Think about the single most valuable thing you learned in school — and the single biggest waste of time. What do they tell you about what education should actually prioritize?",
    freeformOnly: true,
  },
];

export const educationQuiz = {
  topic: TOPIC,
  topicLabel: "Education",
  questions: main,
  followupQuestions,
};
