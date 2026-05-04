import type { AnyQuestion, Question } from "../types";

const TOPIC = "ai_governance";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "The EU AI Act defines 'high-risk' AI systems — including those used in hiring, credit scoring, law enforcement, and critical infrastructure — and requires conformity assessments before deployment. Critics like venture capitalist Marc Andreessen argue this will drive AI innovation to less regulated jurisdictions. Supporters point to GDPR, which was called innovation-killing in 2018 but is now a global privacy standard. Who should decide what counts as 'high risk'?",
    options: [
      { id: "A", text: "Government regulators with technical advisory input — elected accountability matters more than speed" },
      { id: "B", text: "Companies themselves, with mandatory public disclosure — they understand the technology best; transparency creates accountability" },
      { id: "C", text: "Independent auditors — neither industry nor government can be trusted to self-assess; third-party review is the model" },
      { id: "D", text: "An international body — AI is global, and national-level classification creates regulatory arbitrage" },
      f("None of these / I see it differently"),
    ],
  },
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "If no single actor is responsible, accountability dissolves — and nothing changes. The EU AI Act assigns liability to deployers. The U.S. has no federal AI liability framework. Bill Gates and others have proposed an FDA-style agency for AI. What's the right accountability mechanism?",
    options: [
      { id: "A", text: "Pre-deployment certification — require proof of bias-free performance before any high-stakes AI system goes live, like drug approval" },
      { id: "B", text: "A new federal agency — an FDA model for AI that sets standards, audits systems, and has enforcement power" },
      { id: "C", text: "Private right of action — class action lawsuits; let affected people sue and let courts set precedent" },
      { id: "D", text: "Mandatory public disclosure — force companies to publish training data sources, performance metrics by demographic, and audit results" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In March 2023, Italy became the first Western country to ban ChatGPT, citing GDPR violations. The EU passed the AI Act in 2024 — the world's first comprehensive AI law — classifying systems by risk level and banning some uses outright. The U.S. took a different approach: Biden's October 2023 executive order relied on voluntary commitments from companies, and the Trump administration revoked it in January 2025. Which approach is closest to right?",
    options: [
      { id: "A", text: "The EU — someone has to set a regulatory floor before the technology outpaces the law; voluntary commitments are meaningless without enforcement" },
      { id: "B", text: "The U.S. — regulate after you understand what you're regulating; premature rules lock in today's assumptions and get captured by incumbents" },
      { id: "C", text: "The EU is right on safety but wrong on implementation — compliance costs will entrench large players and shut out open-source and smaller competitors" },
      { id: "D", text: "Both miss the real issue — antitrust, not safety, is urgent; the danger isn't unregulated AI, it's AI controlled by four companies" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In May 2023, Geoffrey Hinton quit Google to warn publicly about AI existential risk. Yoshua Bengio and over 30,000 researchers signed a letter calling for a six-month pause on training systems more powerful than GPT-4. On the other side, the effective accelerationist (e/acc) movement — championed by figures like Marc Andreessen and venture capitalist Garry Tan — argues that slowing AI development costs more lives than it saves by delaying breakthroughs in medicine, energy, and science. Where do you land?",
    options: [
      { id: "A", text: "Closer to the safety camp — the downside risk is civilizational; you don't get to run the experiment twice" },
      { id: "B", text: "Closer to the accelerationists — the upside is too large to sacrifice; slowing down means people die from problems AI could have solved" },
      { id: "C", text: "The safety researchers are right about the risks but wrong about the solution — a unilateral slowdown by Western labs just changes who builds frontier AI, not whether it gets built" },
      { id: "D", text: "The accelerationists are right that AI will be transformative, but wrong about timeline — transformative impact is decades away, not years; the urgency is manufactured" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "If unilateral slowdown just shifts who leads — what would a coordination mechanism that actually works look like? Is there a precedent from nuclear arms control, climate agreements, or something else?",
      }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "In 2023, the EEOC settled its first AI hiring discrimination case: iTutorGroup paid $365,000 after its recruitment software automatically rejected applicants over age 55. Amazon scrapped an internal AI recruiting tool in 2018 after discovering it systematically downgraded résumés containing the word 'women's.' A 2022 Stanford study found that clinical AI systems used in U.S. hospitals consistently performed worse for Black patients. When an AI system discriminates, who's responsible?",
    options: [
      { id: "A", text: "The company that built it — if your product discriminates, ignorance of the training data is no defense" },
      { id: "B", text: "The organization that deployed it — they have a duty to test for bias before putting it in front of real people" },
      { id: "C", text: "Both, plus the regulators who failed to require bias testing before deployment — shared failure requires shared accountability" },
      { id: "D", text: "No single villain — AI discrimination reflects historical patterns baked into training data; the system is the problem, not any one actor" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Anthropic's CEO Dario Amodei wrote in 2023 that his company might be building 'one of the most transformative and potentially dangerous technologies in human history' — and argued it should do so anyway because safety-focused labs need to be at the frontier. OpenAI's original 2015 charter pledged to 'benefit all of humanity,' then the company restructured as a capped-profit entity in 2019 and was valued at over $150 billion by 2025. Sam Altman owns no equity. Is the 'responsible development' framing credible?",
    options: [
      { id: "A", text: "Yes — better to have safety-focused labs at the frontier than cede it to developers with no safety culture; the alternative is worse" },
      { id: "B", text: "No — 'I'll do the dangerous thing responsibly' is what people always say before disasters; the fact that they acknowledge the danger makes the choice worse, not better" },
      { id: "C", text: "It's a genuine ethical dilemma with no clean answer — both building and not building carry catastrophic risks, and pretending otherwise is intellectually dishonest" },
      { id: "D", text: "The individual company framing is wrong — the real question is whether external governance exists to constrain all of them; without it, self-regulation is theater" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In July 2023, Meta released Llama 2 as an open-weight model, making powerful AI freely available for download. By 2024, Llama 3 had been downloaded millions of times and fine-tuned for thousands of applications. Mark Zuckerberg argued open-source AI prevents dangerous concentration of power. Critics, including former Google CEO Eric Schmidt, warned that open models can be fine-tuned to remove safety guardrails and used for bioweapons research or large-scale disinformation. Net good or net harm?",
    options: [
      { id: "A", text: "Net good — open access distributes power, enables independent safety research, and prevents a world where four companies control the most important technology ever built" },
      { id: "B", text: "Reckless — you can't recall a model once it's released; open-sourcing frontier AI is irreversible and the downside scenarios are catastrophic" },
      { id: "C", text: "Right for current models, but a capability threshold is needed — above a certain level of capability, international review should be required before any release" },
      { id: "D", text: "It's competitive strategy dressed as principle — open-sourcing benefits Meta's ecosystem at the expense of OpenAI and Anthropic; the altruistic framing is convenient marketing" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In December 2023, the New York Times sued OpenAI and Microsoft, alleging GPT models were trained on millions of Times articles without permission or compensation. Getty Images filed a similar suit against Stability AI. Artists and writers have launched dozens of class-action lawsuits. AI companies argue that training on publicly available data is transformative fair use — the same legal principle that protects Google's book-scanning project. Meanwhile, the models that were trained on this data are generating billions in revenue. Where do you stand?",
    options: [
      { id: "A", text: "It's theft — the scale doesn't change the moral calculus; using someone's work without consent to build a competitor to their livelihood is straightforward infringement" },
      { id: "B", text: "It's how all learning works — human culture builds on human culture; drawing a hard legal line around machine learning freezes AI development and sets a dangerous precedent for knowledge" },
      { id: "C", text: "The legality will be sorted in court, but the real question is economic — creators should share in the value their work generates, even if training is ultimately ruled legal" },
      { id: "D", text: "Copyright is the wrong frame entirely — the deeper issue is power concentration; a few companies are homogenizing what gets created by training on everything and competing with everyone" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "You're advising a government that has one year to set up its AI governance framework. What's the single most important thing to get right — and what are you willing to leave imperfect?",
    freeformOnly: true,
  },
];

export const aiGovernanceQuiz = {
  topic: TOPIC,
  topicLabel: "AI Governance",
  questions: main,
  followupQuestions,
};
