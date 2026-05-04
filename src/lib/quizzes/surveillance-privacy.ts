import type { AnyQuestion, Question } from "../types";

const TOPIC = "surveillance_privacy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "The \"targeted use with a warrant\" model assumes the legal system can constrain how surveillance technology is actually used. But the history of wiretapping, FISA courts, and parallel construction shows that legal safeguards are routinely circumvented. What makes facial recognition different?",
    options: [
      { id: "A", text: "It\'s not different — that\'s exactly why the ban is necessary; if legal safeguards reliably worked, we wouldn\'t need to ban the technology itself" },
      { id: "B", text: "Technical safeguards can succeed where legal ones fail — audit logs, algorithmic transparency requirements, and automated compliance checks can make misuse detectable" },
      { id: "C", text: "Independent oversight — a dedicated civil liberties board with real subpoena power and access to classified programs, not the rubber-stamp FISA court model" },
      { id: "D", text: "Democratic accountability — make all surveillance tool purchases and usage statistics public; if voters know how the technology is being used, political pressure constrains abuse" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "China\'s Social Credit System — operational in various forms across hundreds of cities by 2024 — aggregates financial behavior, legal records, and social conduct into scores that affect citizens\' access to loans, travel, and employment. In the U.S., private companies accomplish something functionally similar: FICO scores, tenant screening databases, and employer background checks create a patchwork system that determines access to housing, credit, and jobs with minimal transparency or appeal. Is the difference between government and corporate surveillance meaningful?",
    options: [
      { id: "A", text: "Yes — government surveillance carries state power, including arrest and imprisonment; corporate surveillance is coercive but escapable in ways state surveillance is not" },
      { id: "B", text: "No — the effect on people\'s lives is the same whether the score comes from the CCP or Equifax; calling one \'authoritarian\' and the other \'the market\' is a distinction without a difference" },
      { id: "C", text: "The distinction matters but the convergence is the problem — when governments buy data from corporations (as the NSA, ICE, and FBI do), the public/private line dissolves" },
      { id: "D", text: "The real issue is transparency and consent — surveillance by any actor is acceptable if people know what\'s being collected, can see their data, and have meaningful ability to opt out" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "\"Meaningful ability to opt out\" sounds good in theory — but when opting out of Google means no email, no maps, and no Android phone, is consent real? At what point does market dominance make \'choice\' fictional?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2013, Edward Snowden leaked classified NSA documents revealing mass surveillance of American citizens\' phone records, emails, and internet activity — programs that senior intelligence officials had denied under oath to Congress. Snowden fled to Russia, where he was granted citizenship in 2022. The U.S. government charged him under the Espionage Act. Polls have consistently split roughly evenly on whether Snowden is a hero or a traitor. Where do you land?",
    options: [
      { id: "A", text: "Hero — he exposed illegal government surveillance at enormous personal cost; the public had a right to know, and the programs he revealed were unconstitutional" },
      { id: "B", text: "Traitor — regardless of what he revealed, he violated his security oath and fled to an adversary nation; whistleblower channels existed and he chose spectacle over process" },
      { id: "C", text: "Both can be true — the surveillance was wrong AND the way he disclosed it was reckless; the information was essential but the method endangered people and intelligence operations" },
      { id: "D", text: "The Snowden debate is a distraction — the real scandal is that nothing fundamentally changed; the programs were briefly reformed and then quietly expanded under different legal authority" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Clearview AI scraped over 30 billion facial images from social media and the open web — without anyone\'s consent — and sold facial recognition tools to over 600 law enforcement agencies in the U.S. by 2023. The company has been fined in the UK, France, Italy, and Australia, and banned in Canada. The ACLU\'s lawsuit resulted in a settlement restricting sales to private companies but not to police. San Francisco and several other cities have banned government use of facial recognition. Should facial recognition technology be legal?",
    options: [
      { id: "A", text: "Ban it entirely for government use — the surveillance potential is too dangerous and the racial bias too well-documented; no regulation can make it safe in law enforcement hands" },
      { id: "B", text: "Allow it with strict regulation — facial recognition solves crimes and finds missing persons; banning it outright trades real safety gains for theoretical civil liberties concerns" },
      { id: "C", text: "Ban mass surveillance but allow targeted use — there\'s a meaningful difference between scanning every face at a protest and using facial recognition to identify a specific suspect with a warrant" },
      { id: "D", text: "The technology is already deployed and unbannable — the question isn\'t whether to allow it but how to create accountability for its inevitable misuse" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "The EU\'s General Data Protection Regulation (GDPR), enacted in 2018, gives European citizens the right to access their data, demand its deletion, and refuse automated decision-making. Companies that violate it face fines of up to 4% of global revenue — Meta was fined €1.2 billion in 2023. The U.S. has no equivalent federal law. California\'s CCPA is the closest, but it\'s opt-out rather than opt-in and has weaker enforcement. Does the American approach to data privacy need to change?",
    options: [
      { id: "A", text: "Yes — a federal GDPR-equivalent is long overdue; the current patchwork of state laws is unenforceable and leaves Americans with fewer privacy rights than Europeans" },
      { id: "B", text: "No — GDPR compliance costs have disproportionately hurt small companies and startups while barely affecting Big Tech; the cure is worse than the disease" },
      { id: "C", text: "The whole framework is wrong — both GDPR and CCPA treat data as something individuals can manage through consent; nobody reads privacy policies and \"consent\" is a fiction at scale" },
      { id: "D", text: "Data privacy legislation is necessary but insufficient — the real problem is the business model; as long as surveillance is the most profitable way to run an internet company, regulation is playing defense" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "After the 2018 Parkland school shooting, thousands of U.S. schools adopted AI-powered surveillance tools — including weapon detection cameras, social media monitoring software, and predictive behavioral analytics. Companies like Gaggle and Bark monitor millions of students\' school emails, documents, and chat messages for signs of self-harm, violence, or bullying. Proponents say these tools have intercepted genuine threats. Critics point out that LGBTQ+ students and students of color are disproportionately flagged, and that mass surveillance normalizes a prison-like environment during formative years. Where\'s the line?",
    options: [
      { id: "A", text: "Safety justifies surveillance — if monitoring prevents even one school shooting, the privacy trade-off is worth it; children\'s lives outweigh children\'s privacy" },
      { id: "B", text: "No surveillance of minors — children can\'t meaningfully consent; normalizing constant monitoring during childhood shapes a generation that accepts surveillance as default" },
      { id: "C", text: "Targeted, transparent monitoring with consent — parents and students should know exactly what\'s monitored and have meaningful opt-out; blanket surveillance without disclosure is unacceptable" },
      { id: "D", text: "School surveillance treats the symptom — the actual problems are gun access, mental health funding, and school resource gaps; surveillance is cheaper than solutions, which is why it gets chosen" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2023, the U.S. House of Representatives voted 352-65 to ban TikTok unless ByteDance divested its U.S. operations, citing concerns that the Chinese government could access American users\' data or manipulate the algorithm. TikTok has 170 million U.S. users. Critics pointed out that American companies collect the same data and face no equivalent restrictions — Facebook\'s Cambridge Analytica scandal involved 87 million users\' data being harvested for political manipulation without consequence. Is the TikTok ban about national security or competitive protectionism?",
    options: [
      { id: "A", text: "Legitimate national security — a foreign adversary having algorithmic control over what 170 million Americans see is a genuine threat that has no domestic equivalent" },
      { id: "B", text: "Protectionism disguised as security — if the concern were really about data and manipulation, we\'d regulate all platforms equally; the ban targets a Chinese competitor, not a unique threat" },
      { id: "C", text: "Both — the national security concern is real AND the selective enforcement is hypocritical; the right answer is comprehensive data privacy law that applies to all platforms, foreign and domestic" },
      { id: "D", text: "The TikTok debate reveals a deeper problem — the entire attention-economy model is the threat, regardless of which country\'s companies run it; banning one app while the business model survives changes nothing" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Think about the last week of your digital life — every app, search, message, and location ping. If you could see exactly who has that data and what they\'ve inferred from it, what would concern you most — and would it change your behavior?",
    freeformOnly: true,
  },
];

export const surveillancePrivacyQuiz = {
  topic: TOPIC,
  topicLabel: "Surveillance & Privacy",
  questions: main,
  followupQuestions,
};
