import type { AnyQuestion, Question } from "../types";

const TOPIC = "surveillance_privacy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "Okay so you picked the \"targeted use with a warrant\" option. That sounds reasonable on paper. But here's the thing.\n\nEvery single legal safeguard we've built around surveillance has been quietly gutted. Wiretap laws? Circumvented. FISA courts? Rubber stamps. Parallel construction? Literally a technique where cops use illegal surveillance to find evidence, then reconstruct a fake trail so the real source never shows up in court.\n\nSo the honest question is: what makes facial recognition different? Why would the legal guardrails work this time when they've failed every other time?",
    options: [
      { id: "A", text: "They won't work, and that's exactly the point. If legal safeguards actually held, we wouldn't need outright bans." },
      { id: "B", text: "Technical safeguards might succeed where legal ones failed. Audit logs and algorithmic transparency make misuse detectable." },
      { id: "C", text: "We need a dedicated civil liberties board with real subpoena power, not another FISA court cosplaying as oversight." },
      { id: "D", text: "Make every surveillance purchase and usage stat public. Let voters see it and political pressure does the constraining." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's something wild to sit with for a second.\n\nChina's Social Credit System scores citizens on their financial behavior, legal records, and social conduct. Bad score? No loans, no train tickets, no job offers. Hundreds of cities run some version of it.\n\nNow here's the part that should make you uncomfortable: the U.S. already does the same thing. FICO scores. Tenant screening databases. Employer background checks. These systems quietly determine whether you get an apartment, a loan, or a callback after an interview. Almost no transparency. Almost no appeal.\n\nThe only real difference is who's running the spreadsheet. One is the Chinese government. The other is Equifax.\n\nSo does it actually matter whether the entity watching you is a government or a corporation?",
    options: [
      { id: "A", text: "Yes, because government surveillance carries the power of arrest and imprisonment. Corporate surveillance is coercive but escapable." },
      { id: "B", text: "No. The effect on your life is identical whether the score comes from the CCP or Equifax. The label changes, the damage doesn't." },
      { id: "C", text: "The distinction matters, but the convergence is the real problem. When the NSA and FBI buy corporate data, the line dissolves." },
      { id: "D", text: "The real issue is transparency and consent. Surveillance by anyone is acceptable if you know what's collected and can opt out." },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "\"Meaningful ability to opt out\" sounds clean in theory. But let's pressure-test it.\n\nOpting out of Google means no Gmail, no Maps, no Android phone. Opting out of Amazon means losing the logistics backbone half the internet runs on. At what point does market dominance make \"choice\" a word we use to describe something that doesn't actually exist anymore?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2013, Edward Snowden leaked classified NSA documents showing the U.S. government was mass-collecting American citizens' phone records, emails, and internet activity. These were programs that senior intelligence officials had denied under oath to Congress. Let that sink in. They lied to Congress about it.\n\nSnowden fled to Russia, eventually got citizenship there in 2022. The U.S. charged him under the Espionage Act. Polls have split roughly 50/50 ever since on whether he's a hero or a traitor.\n\nHere's what makes this genuinely hard: the information was real, the programs were arguably unconstitutional, and the method of disclosure was arguably reckless. You can't cleanly separate the what from the how.\n\nWhere do you land?",
    options: [
      { id: "A", text: "Hero. He exposed illegal government surveillance at enormous personal cost. The public had an absolute right to know." },
      { id: "B", text: "Traitor. He violated his security oath and fled to an adversary nation. Whistleblower channels existed and he chose spectacle." },
      { id: "C", text: "Both are true simultaneously. The surveillance was wrong AND the disclosure method was reckless. Essential information, dangerous execution." },
      { id: "D", text: "The whole Snowden debate is a distraction. The real scandal is that nothing fundamentally changed. Programs got briefly reformed, then quietly expanded." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Clearview AI scraped over 30 billion facial images from social media and the open web. No one consented. They sold facial recognition tools to over 600 law enforcement agencies in the U.S. by 2023.\n\nThink about that number for a second. 30 billion images. There are 8 billion people on Earth. That's roughly four photos of every living human, vacuumed up without a single person clicking \"I agree.\"\n\nThe company has been fined in the UK, France, Italy, and Australia. Banned in Canada. The ACLU sued and won a settlement restricting sales to private companies, but not to police. San Francisco and several other cities banned government use of facial recognition entirely.\n\nShould this technology be legal at all?",
    options: [
      { id: "A", text: "Ban it entirely for government use. The surveillance potential is too dangerous and the racial bias is too well-documented." },
      { id: "B", text: "Allow it with strict regulation. It solves crimes and finds missing persons. Banning it trades real safety for theoretical concerns." },
      { id: "C", text: "Ban mass surveillance but allow targeted use. Scanning every face at a protest is different from identifying a suspect with a warrant." },
      { id: "D", text: "The technology is already deployed and effectively unbannable. The only real question is how to build accountability for inevitable misuse." },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "The EU passed GDPR in 2018, giving European citizens the right to access their data, demand deletion, and refuse automated decisions about their lives. Violations cost up to 4% of global revenue. Meta got hit with a 1.2 billion euro fine in 2023.\n\nThe United States has no equivalent federal law. California's CCPA is the closest thing, but it's opt-out instead of opt-in, and enforcement is weaker.\n\nHere's the scale comparison that makes this click. If you're a European citizen, you can email any company and say \"delete everything you have on me\" and they legally must comply. If you're an American citizen, you can... write your congressperson about it, I guess.\n\nDoes the American approach to data privacy need to change?",
    options: [
      { id: "A", text: "Yes. A federal GDPR equivalent is long overdue. The current patchwork of state laws leaves Americans with fewer rights than Europeans." },
      { id: "B", text: "No. GDPR compliance costs have crushed small companies and startups while barely denting Big Tech. The cure is worse than the disease." },
      { id: "C", text: "The whole framework is wrong. Both GDPR and CCPA pretend individuals can manage consent. Nobody reads privacy policies. \"Consent\" is fiction at scale." },
      { id: "D", text: "Legislation is necessary but insufficient. The real problem is the business model. As long as surveillance is the most profitable model, regulation plays defense." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "After the 2018 Parkland school shooting, thousands of U.S. schools adopted AI-powered surveillance tools. Weapon detection cameras. Social media monitoring software. Predictive behavioral analytics.\n\nCompanies like Gaggle and Bark now monitor millions of students' school emails, documents, and chat messages, scanning for signs of self-harm, violence, or bullying. Proponents say these tools have intercepted genuine threats.\n\nBut here's what keeps showing up in the data: LGBTQ+ students and students of color get flagged disproportionately. And there's a deeper question nobody wants to sit with. What does it do to a developing brain to grow up in an environment where every keystroke is watched? You're essentially training an entire generation to accept surveillance as the default texture of daily life.\n\nWhere's the line?",
    options: [
      { id: "A", text: "Safety justifies surveillance. If monitoring prevents even one school shooting, children's lives outweigh children's privacy. Full stop." },
      { id: "B", text: "No surveillance of minors, period. Children can't meaningfully consent, and normalizing constant monitoring during childhood shapes permanent expectations." },
      { id: "C", text: "Targeted, transparent monitoring with real consent. Parents and students should know exactly what's watched and have genuine opt-out ability." },
      { id: "D", text: "School surveillance treats the symptom. The actual problems are gun access, mental health funding, and resource gaps. Surveillance is cheaper than solutions." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2023, the U.S. House voted 352 to 65 to ban TikTok unless ByteDance divested its American operations. The stated concern: the Chinese government could access 170 million American users' data or manipulate what they see through the algorithm.\n\nSounds alarming, right? But wait. Rewind to 2018. Facebook's Cambridge Analytica scandal involved 87 million users' data being harvested for political manipulation. The consequence for Facebook was... basically nothing structural.\n\nSo here's the uncomfortable question. If the concern is genuinely about data harvesting and algorithmic manipulation, why does it only become a national security crisis when a Chinese company does it? American companies collect the same data, run the same manipulation playbook, and face zero equivalent restrictions.\n\nIs the TikTok ban about national security or competitive protectionism?",
    options: [
      { id: "A", text: "Legitimate national security. A foreign adversary controlling what 170 million Americans see is a genuine threat with no domestic equivalent." },
      { id: "B", text: "Protectionism wearing a security costume. If data and manipulation were the real concern, we'd regulate all platforms equally. This targets a competitor." },
      { id: "C", text: "Both. The security concern is real AND the selective enforcement is hypocritical. The right answer is comprehensive privacy law for all platforms." },
      { id: "D", text: "The TikTok debate reveals the deeper problem. The entire attention economy is the threat regardless of which country's companies run it." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last exercise. This one's personal.\n\nThink about the last seven days of your digital life. Every app you opened. Every search you typed. Every message you sent. Every location ping your phone quietly logged while you weren't thinking about it.\n\nNow imagine a dashboard appeared on your screen showing you exactly who has all that data and what they've inferred from it. Your sleep patterns from your alarm app. Your anxiety levels from your search history. Your relationship status from your messaging frequency. Your political leanings from your scroll behavior.\n\nWhat would concern you most? And honestly, would seeing it actually change anything about how you use your phone tomorrow?",
    freeformOnly: true,
  },
];

export const surveillancePrivacyQuiz = {
  topic: TOPIC,
  topicLabel: "Your Phone Knows More Than Your Therapist",
  questions: main,
  followupQuestions,
};
