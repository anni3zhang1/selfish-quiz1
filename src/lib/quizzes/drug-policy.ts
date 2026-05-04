import type { AnyQuestion, Question } from "../types";

const TOPIC = "drug_policy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "Oregon\'s Measure 110 decriminalized possession of all drugs in 2020, replacing criminal penalties with $100 fines and treatment referrals. By 2024, overdose deaths had risen 43%, few people accessed treatment through the referral system, and the legislature recriminalized possession. Portugal, which decriminalized all drugs in 2001 with robust mandatory treatment infrastructure, saw HIV infections drop by 95% and overdose deaths fall. What went wrong in Oregon that worked in Portugal?",
    options: [
      { id: "A", text: "Portugal invested heavily in treatment infrastructure before decriminalizing; Oregon decriminalized without building the treatment system to catch people — you can\'t remove penalties without adding support" },
      { id: "B", text: "Cultural context — Portugal has universal healthcare and a smaller, more homogeneous population; importing the policy without the social infrastructure was always going to fail" },
      { id: "C", text: "Oregon didn\'t fail because of decriminalization — it failed because fentanyl arrived simultaneously; the overdose crisis is a supply-side problem that no demand-side policy can solve alone" },
      { id: "D", text: "Three years wasn\'t long enough — transforming a criminal justice approach into a public health approach takes a generation, not a legislative session; Oregon gave up too quickly" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "The U.S. War on Drugs, launched by Nixon in 1971, has cost over $1 trillion, incarcerated millions, and disproportionately targeted Black and Latino communities — despite roughly equal rates of drug use across races. Michelle Alexander\'s \'The New Jim Crow\' documented how drug enforcement became a system of racial control. Meanwhile, drug overdose deaths hit a record 112,000 in 2023, driven largely by synthetic fentanyl. After 50 years, has the War on Drugs failed?",
    options: [
      { id: "A", text: "Completely — prohibition has created violent black markets, mass incarceration, and record overdose deaths while failing to reduce drug use; it is the policy equivalent of a controlled demolition of communities" },
      { id: "B", text: "Partially — enforcement was racially biased and badly implemented, but the alternative isn\'t legalization; some drugs are genuinely dangerous and society needs tools to limit their spread" },
      { id: "C", text: "The War on Drugs didn\'t fail — it succeeded at its actual purpose, which was political control; it was never really about drugs, it was about criminalizing Black communities and the antiwar left" },
      { id: "D", text: "It failed, but so has the opposite — Oregon decriminalized all drugs in 2020 and reversed course by 2024 as open drug use, overdose deaths, and public disorder increased; neither prohibition nor permissiveness is working" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Cannabis is now legal for recreational use in 24 U.S. states and Washington, D.C., generating over $30 billion in annual sales and billions in tax revenue. Yet cannabis remains a Schedule I federal substance — classified alongside heroin as having \'no accepted medical use and a high potential for abuse.\' Over 40,000 people are still in prison for cannabis offenses, disproportionately Black men. Most legal cannabis businesses are white-owned. Has cannabis legalization delivered justice?",
    options: [
      { id: "A", text: "No — legalization without expungement, reparations, and equity programs is a transfer of wealth from the communities destroyed by prohibition to the white entrepreneurs now profiting from it" },
      { id: "B", text: "It\'s a start — legalization ended the arrests; imperfect implementation doesn\'t mean the policy is wrong; equity programs and expungement can be added without reversing legalization" },
      { id: "C", text: "The justice framing, while valid, obscures the public health question — cannabis isn\'t harmless; adolescent use, impaired driving, and dependency are real concerns that legalization advocates minimize" },
      { id: "D", text: "The entire scheduling system is incoherent — alcohol kills 140,000 Americans per year and is fully legal; cannabis has never caused a fatal overdose and is Schedule I; the categories reflect politics, not science" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The Sackler family\'s Purdue Pharma introduced OxyContin in 1996 with aggressive marketing that downplayed addiction risk. Over 500,000 Americans have died from opioid overdoses since then. Purdue pleaded guilty to federal charges twice. The Sacklers agreed to a $6 billion settlement while retaining most of their wealth. No family member went to prison. Meanwhile, a person caught selling small amounts of fentanyl can receive a 20-year mandatory minimum sentence. Is the legal system capable of holding powerful drug dealers accountable?",
    options: [
      { id: "A", text: "No — the disparity is proof that the criminal justice system punishes poverty and protects wealth; a street dealer gets decades while billionaires who killed hundreds of thousands pay a fine" },
      { id: "B", text: "The system failed in this case but can be fixed — stronger corporate criminal liability, personal criminal charges for executives, and piercing the corporate veil are achievable legal reforms" },
      { id: "C", text: "Criminal prosecution is the wrong tool for pharmaceutical companies — regulation failed first; the FDA approved OxyContin, doctors prescribed it, insurers paid for it; the Sacklers operated within a broken system" },
      { id: "D", text: "The opioid crisis reveals that \'drug dealer\' is a political category, not a moral one — when pharmaceuticals kill at scale it\'s a \'crisis\'; when street drugs kill at scale it\'s \'crime\'; the distinction is about who\'s doing the selling" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Harm reduction — needle exchanges, supervised injection sites, naloxone distribution, drug testing strips — is endorsed by the WHO, the CDC, and most public health organizations as the most effective approach to reducing drug-related death and disease. Vancouver\'s Insite supervised injection facility has operated since 2003 without a single overdose death on-site. Yet harm reduction faces fierce political opposition. Critics argue it enables drug use, attracts drug activity to neighborhoods, and sends the message that society has given up on sobriety. Is harm reduction an acceptance of failure?",
    options: [
      { id: "A", text: "No — it\'s evidence-based pragmatism; keeping people alive is the precondition for recovery; you can\'t rehabilitate a dead person; opposition to harm reduction costs lives for the sake of moral posturing" },
      { id: "B", text: "It\'s a necessary evil, not a solution — harm reduction manages the symptoms of addiction but doesn\'t address the causes; without equally aggressive investment in treatment and recovery, it becomes permanent management" },
      { id: "C", text: "The \'enabling\' critique has merit in some contexts — supervised injection sites in residential neighborhoods create real quality-of-life impacts for residents; harm reduction needs community consent, not just expert endorsement" },
      { id: "D", text: "Harm reduction is only controversial because we moralize drug use — we don\'t call seatbelts \'acceptance of failure\' for car safety; treating addiction as a moral failing rather than a health condition is what makes common-sense policy politically toxic" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In the U.S., roughly 1.9 million people are incarcerated — the highest rate in the world. About 45% of federal prisoners are serving drug-related sentences. Black Americans are nearly 4 times more likely to be arrested for marijuana possession than white Americans despite similar usage rates. The 1994 Crime Bill, supported by Biden, established mandatory minimums that disproportionately affected crack cocaine (used more by Black communities) versus powder cocaine (used more by white communities) at a 100:1 sentencing ratio. Is the drug war primarily a racial justice issue?",
    options: [
      { id: "A", text: "Yes — from its inception, drug policy has been a tool for racial control; the racial disparities aren\'t accidents of enforcement, they\'re the purpose of the policy" },
      { id: "B", text: "It\'s a factor but not the whole story — drug enforcement also devastated white Appalachian communities during the opioid crisis; class matters as much as race; reducing it to race alone misses the full picture" },
      { id: "C", text: "The racial justice framing is correct but insufficient — even racially equitable drug enforcement would still be bad policy; the problem isn\'t just who gets punished, it\'s that punishment doesn\'t work" },
      { id: "D", text: "It\'s primarily a class issue that intersects with race — drug enforcement targets poor people of all races; wealth buys treatment and lawyers; the racial dimension is real but is downstream of the economic one" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Alcohol kills approximately 140,000 Americans per year and is a factor in 40% of violent crimes. Tobacco kills 480,000. Neither is a controlled substance. Cannabis has caused zero recorded overdose deaths. Psilocybin and MDMA show promise for treating PTSD and depression. Caffeine is a psychoactive drug consumed daily by 90% of Americans. The legal/illegal distinction between drugs doesn\'t track with their harm profiles. Should drug policy be based on evidence of harm rather than historical and cultural categorization?",
    options: [
      { id: "A", text: "Yes — a rational drug policy would regulate substances based on toxicity, addiction potential, and social harm; by that standard, alcohol and tobacco should be more restricted and cannabis less so" },
      { id: "B", text: "In theory yes, but in practice prohibition of alcohol was a disaster — you can\'t criminalize deeply embedded cultural substances; the legal/illegal line reflects what\'s enforceable, not what\'s rational" },
      { id: "C", text: "Evidence-based scheduling is necessary but not sufficient — you also need a public health infrastructure to handle the consequences; legalizing everything without treatment capacity is Oregon\'s mistake" },
      { id: "D", text: "The inconsistency is the point — drug classification reflects power, not pharmacology; the substances associated with white, wealthy culture (alcohol, cocaine historically) get tolerance; those associated with marginalized groups get criminalization" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "If you could redesign drug policy for the U.S. from scratch — what\'s legal, what\'s regulated, what\'s prohibited, and how do you handle addiction?",
    freeformOnly: true,
  },
];

export const drugPolicyQuiz = {
  topic: TOPIC,
  topicLabel: "Drug Policy",
  questions: main,
  followupQuestions,
};
