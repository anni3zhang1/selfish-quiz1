import type { AnyQuestion, Question } from "../types";

const TOPIC = "ai_governance";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "The EU AI Act says certain AI uses are \"high-risk\": hiring, credit scoring, law enforcement, critical infrastructure. Before you deploy one, you need to pass a conformity assessment.\n\nCritics say this will push innovation to less regulated countries. Supporters point out people said the same thing about GDPR, and now it's the global privacy standard. So who should decide what counts as \"high risk\"?",
    options: [
      { id: "A", text: "Government regulators with technical advisors. Elected accountability matters more than speed" },
      { id: "B", text: "The companies, with mandatory public disclosure. They know the tech best; transparency creates accountability" },
      { id: "C", text: "Independent auditors. Neither industry nor government can be trusted to grade their own homework" },
      { id: "D", text: "An international body. AI is global. National-level rules just create loopholes" },
      f("None of these / I see it differently"),
    ],
  },
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "Here's the problem with \"nobody's responsible\": nothing changes. The EU tried to fix this by making the company that deploys the AI liable. The U.S. has no federal framework at all.\n\nBill Gates and others have proposed an FDA-style agency for AI. What's the right accountability mechanism?",
    options: [
      { id: "A", text: "Pre-deployment certification. Prove it's not biased before it goes live, like drug approval" },
      { id: "B", text: "A new federal agency. An FDA for AI with real standards and enforcement power" },
      { id: "C", text: "Let people sue. Class action lawsuits and court precedent" },
      { id: "D", text: "Mandatory disclosure. Force companies to publish their training data, demographic performance, and audit results" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2023, Italy straight-up banned ChatGPT. First Western country to do it. The EU followed with the AI Act in 2024, the world's first comprehensive AI law, classifying systems by risk level and banning some uses entirely.\n\nThe U.S. went the other way: voluntary commitments from companies. Then the Trump administration revoked even that. Which approach is closer to right?",
    options: [
      { id: "A", text: "The EU. Someone has to set a floor before the tech outpaces the law. Voluntary commitments are meaningless" },
      { id: "B", text: "The U.S. Regulate after you understand what you're regulating. Premature rules get captured by incumbents" },
      { id: "C", text: "EU is right on safety, wrong on execution. Compliance costs lock out startups and open-source" },
      { id: "D", text: "Both miss the point. Antitrust is the real emergency. Four companies control this technology" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Geoffrey Hinton helped build the foundations of modern AI. Then he quit Google to warn that it might destroy us. Over 30,000 researchers signed a letter calling for a six-month pause on training anything more powerful than GPT-4.\n\nOn the other side: the accelerationists argue that slowing AI down costs more lives than it saves, because you're delaying breakthroughs in medicine, energy, and science. Where do you land?",
    options: [
      { id: "A", text: "Safety side. The downside is civilizational. You don't get to run this experiment twice" },
      { id: "B", text: "Accelerationist side. The upside is too large. Slowing down means people die from problems AI could solve" },
      { id: "C", text: "Right about the risks, wrong about the fix. A Western slowdown just hands the lead to someone else" },
      { id: "D", text: "Right that AI matters, wrong about when. Real impact is decades out. The urgency is manufactured" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "If slowing down just shifts who leads, what would a coordination mechanism that actually works look like? Is there a precedent?",
      }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "In 2023, the U.S. government settled its first AI hiring discrimination case. A company's recruitment software had been automatically rejecting every applicant over 55. Amazon built an AI recruiter that downgraded any resume with the word \"women's\" on it.\n\nA Stanford study found that clinical AI in U.S. hospitals consistently performed worse for Black patients. When an AI system discriminates, who's responsible?",
    options: [
      { id: "A", text: "The company that built it. If your product discriminates, not knowing about the data is no defense" },
      { id: "B", text: "The organization that deployed it. You have a duty to test for bias before it touches real people" },
      { id: "C", text: "Everyone. The builder, the deployer, and the regulators who didn't require testing. Shared failure, shared accountability" },
      { id: "D", text: "No single villain. AI discrimination reflects historical patterns baked into training data. The system is the problem" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Anthropic's CEO wrote publicly that his company might be building \"one of the most dangerous technologies in human history.\" Then he argued they should keep building it anyway, because safety-focused labs need to be at the frontier.\n\nOpenAI started as a nonprofit to \"benefit all of humanity.\" It restructured into a capped-profit company and hit a $150 billion valuation. Is the \"responsible development\" framing credible?",
    options: [
      { id: "A", text: "Yes. Better to have safety-minded people at the frontier than cede it to those who don't care" },
      { id: "B", text: "No. \"I'll do the dangerous thing responsibly\" is what people always say right before the disaster" },
      { id: "C", text: "It's a real dilemma. Building and not building both carry catastrophic risk. Pretending otherwise is dishonest" },
      { id: "D", text: "Wrong frame. The question is whether external governance can constrain any of them. Without it, self-regulation is theater" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2023, Meta released its most powerful AI model for free. Anyone could download it. Millions did. Zuckerberg said open-source prevents dangerous concentration of power.\n\nCritics pointed out: you can't take it back. Once the model is out there, anyone can strip the safety guardrails and use it for bioweapons research or mass disinformation. Net good or net harm?",
    options: [
      { id: "A", text: "Net good. Open access distributes power and lets independent researchers find the problems" },
      { id: "B", text: "Reckless. You can't recall a released model. The downside scenarios are catastrophic and irreversible" },
      { id: "C", text: "Fine for now, but there needs to be a ceiling. Above a certain capability level, review before release" },
      { id: "D", text: "It's competitive strategy dressed up as principle. Open-sourcing helps Meta's ecosystem. The altruism is marketing" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "The New York Times sued OpenAI, claiming GPT was trained on millions of its articles without permission. Getty sued Stability AI. Dozens of class actions from artists and writers followed.\n\nAI companies say training on public data is fair use, same as Google scanning books. Meanwhile, the models built on this data generate billions in revenue. Where do you stand?",
    options: [
      { id: "A", text: "It's theft. Using someone's work without consent to build a competitor is infringement, full stop" },
      { id: "B", text: "It's how learning works. All culture builds on culture. A hard legal line here sets a dangerous precedent" },
      { id: "C", text: "Courts will sort the legality. The real question is economic: creators should share in the value" },
      { id: "D", text: "Copyright is the wrong frame. The real issue is power. A few companies training on everything and competing with everyone" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "You're advising a government that has one year to set up its AI governance framework. What's the single most important thing to get right, and what are you willing to leave imperfect?",
    freeformOnly: true,
  },
];

export const aiGovernanceQuiz = {
  topic: TOPIC,
  topicLabel: "Who Gets to Build God?",
  questions: main,
  followupQuestions,
};
