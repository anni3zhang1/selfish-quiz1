import type { AnyQuestion, Question } from "../types";

const TOPIC = "bioethics";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2018, Chinese scientist He Jiankui used CRISPR to edit the genes of twin embryos, making them resistant to HIV. He was sentenced to three years in prison. In 2023, the first CRISPR-based therapy — Casgevy, developed by Vertex Pharmaceuticals and CRISPR Therapeutics — was approved in the UK and US to treat sickle cell disease. The line between \"therapy\" and \"enhancement\" is blurring. Where do you draw it?",
    options: [
      { id: "A", text: "Therapy is fine, enhancement is not — fixing disease is categorically different from designing traits; the line is clear enough to enforce" },
      { id: "B", text: "The distinction is unsustainable — every therapy is an enhancement by another name; once you fix sickle cell, the pressure to optimize IQ becomes unstoppable" },
      { id: "C", text: "The line should be drawn by access, not by type — any genetic modification is acceptable if it's universally available; the danger is a genetic aristocracy, not the technology itself" },
      { id: "D", text: "He Jiankui's real crime was acting alone — the problem isn't gene editing, it's the absence of international governance over who gets to make irreversible changes to the human germline" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "If the therapy-enhancement line is unsustainable, what's the actual limiting principle — or is there none?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2022, researchers at the Weizmann Institute in Israel grew synthetic mouse embryos from stem cells — no egg, no sperm, no uterus — that developed beating hearts and brain structures. Similar work is underway at Cambridge and Caltech. The 14-day rule, an international consensus limiting human embryo research to two weeks post-fertilization, is now under pressure from scientists who say breakthroughs require going further. Should the rule hold?",
    options: [
      { id: "A", text: "Yes — the 14-day rule exists because we don't know where consciousness begins; caution is the only responsible position when the stakes are this high" },
      { id: "B", text: "No — the rule was always arbitrary, based on 1980s politics, not biology; extending it to 28 days with oversight could unlock treatments for miscarriage, infertility, and developmental diseases" },
      { id: "C", text: "The rule should evolve based on what we learn, not be abandoned wholesale — a framework that adjusts with evidence is better than either a fixed ban or no limit" },
      { id: "D", text: "The real issue isn't the day count — it's that synthetic embryos blur the categories entirely; we need new ethical frameworks, not just revised timelines" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Whole genome sequencing now costs under $200 — down from $3 billion for the first human genome in 2003. Companies like 23andMe and Nebula Genomics offer consumer genetic testing that reveals disease risks, carrier status, and ancestry. In Iceland, deCODE Genetics has sequenced nearly the entire population. China's BGI has built the world's largest genetic database. Who should own your genetic data?",
    options: [
      { id: "A", text: "You should — genetic data is the most personal information that exists; it should be treated like medical records, with strict consent and control by the individual" },
      { id: "B", text: "No one should \"own\" it — genetic data is most valuable when pooled for research; individual ownership creates friction that slows medical breakthroughs for everyone" },
      { id: "C", text: "Ownership is the wrong frame — what matters is governance: who can access it, for what purpose, with what oversight, and with what penalties for misuse" },
      { id: "D", text: "The question is already moot — 23andMe nearly went bankrupt in 2024 with 15 million people's genetic data as its most valuable asset; the data is already out there, and the real fight is over what happens next" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "If genetic data is already out there and can't be recalled — what's the most important safeguard to build now, before insurers, employers, and governments start using it?",
      }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "In the U.S., surrogacy is a $14 billion industry. Ukraine and India were major surrogacy destinations before regulatory crackdowns. Wealthy couples in the U.S., UK, and Australia routinely pay women in lower-income countries — or lower-income women domestically — to carry pregnancies. Feminist critics like Kajsa Ekis Ekman call it \"reproductive exploitation.\" Advocates say it gives women economic agency and helps people who can't otherwise have children. Is commercial surrogacy ethical?",
    options: [
      { id: "A", text: "Yes — women have the right to make autonomous decisions about their bodies, including renting their uterus; banning it is paternalistic" },
      { id: "B", text: "No — the power asymmetry between a wealthy commissioning couple and a surrogate who needs money makes \"consent\" a fiction; this is exploitation with extra steps" },
      { id: "C", text: "It depends entirely on regulation — surrogacy with strong legal protections, fair compensation, and genuine informed consent is different from surrogacy in an unregulated market" },
      { id: "D", text: "The individual ethics question distracts from the structural one — why do we live in a world where some women's best economic option is gestating someone else's child?" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Psychedelic-assisted therapy is being fast-tracked by regulators worldwide. MDMA for PTSD reached Phase 3 trials run by MAPS (Multidisciplinary Association for Psychedelic Studies) — though the FDA rejected it in 2024 citing study design concerns. Psilocybin therapy for depression has been approved in Australia and is in late-stage trials in the US and Europe. Oregon legalized supervised psilocybin use in 2023. The science is promising but early. How should society handle this?",
    options: [
      { id: "A", text: "Full medicalization — psychedelics should follow the same rigorous path as any pharmaceutical; anything less risks another opioid-style disaster built on premature enthusiasm" },
      { id: "B", text: "The medical model is too narrow — psychedelics are tools for consciousness exploration, not just symptom treatment; restricting them to clinical settings misses the point" },
      { id: "C", text: "Oregon's model is right — supervised access outside the medical system, with trained facilitators; not everything that helps people needs to be a prescription" },
      { id: "D", text: "The real question is who controls the experience — pharmaceutical companies turning psilocybin into a patented product is a fundamentally different thing from indigenous ceremonial use or personal exploration" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In Denmark, prenatal screening for Down syndrome is offered to all pregnant women and has a near-100% uptake rate. Approximately 95% of pregnancies with a Down syndrome diagnosis are terminated. Iceland has nearly eliminated Down syndrome births entirely. Disability rights advocates call this a form of eugenics. Parents who chose termination say they made a deeply personal, agonizing decision. Is population-level screening that effectively eliminates a genetic condition ethically different from individual reproductive choice?",
    options: [
      { id: "A", text: "No — each termination is an individual choice; the aggregate pattern is an outcome of free decisions, not a policy, and calling it eugenics is inflammatory" },
      { id: "B", text: "Yes — when a system is designed so that a predictable outcome is the near-elimination of a group of people, the system is eugenic regardless of individual intent" },
      { id: "C", text: "The ethics depend on what society offers — if support for people with Down syndrome were adequate, fewer parents would choose termination; the \"choice\" reflects a failure of inclusion" },
      { id: "D", text: "Both things are true simultaneously — individual reproductive autonomy is sacred AND the aggregate effect is the erasure of a form of human life; refusing to hold both is a failure of moral seriousness" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "If 95% of parents in a system make the same choice, at what point does the system itself — the screening protocol, the counseling, the cultural context — become the agent, not the individual?",
      }
    },
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "What’s one thing about your own body or mind that you would change if the technology existed — and one thing you wouldn’t change even if you could? What’s the difference?",
    freeformOnly: true,
  },
];

export const bioethicsQuiz = {
  topic: TOPIC,
  topicLabel: "Bioethics",
  questions: main,
  followupQuestions,
};
