import type { AnyQuestion, Question } from "../types";

const TOPIC = "democracy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "If the Senate\'s unequal representation is justified as minority protection — which minorities is it actually protecting? The current Senate overrepresents white, rural, conservative voters and underrepresents urban, diverse populations. Is that the minority protection the founders intended?",
    options: [
      { id: "A", text: "Yes, actually — the founders explicitly designed the Senate to protect small states and rural interests from domination by populous commercial centers; that\'s exactly what it does" },
      { id: "B", text: "No — the founders intended to protect states as political units, not demographic groups; the racial and geographic skew is an unintended consequence that distorts their design" },
      { id: "C", text: "The founders\' intentions are irrelevant — they also intended to protect slaveholders and exclude women; \'what the founders wanted\' is not a moral argument in the 21st century" },
      { id: "D", text: "The question proves the system has been captured — \'minority protection\' should mean protecting the vulnerable from the powerful, not protecting the electorally overrepresented from democratic accountability" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Freedom House reported in 2024 that global freedom declined for the 18th consecutive year. Hungary under Viktor Orbán has been reclassified as \'partly free.\' India under Narendra Modi has faced accusations of democratic backsliding. In the U.S., confidence in elections has dropped to historic lows. Meanwhile, China\'s GDP grew faster than any democracy\'s over the past 30 years, lifting 800 million people out of poverty without free elections. Is democracy in crisis, or just evolving?",
    options: [
      { id: "A", text: "In crisis — democratic institutions worldwide are being hollowed out by strongmen, polarization, and corporate capture; the trend is real and alarming" },
      { id: "B", text: "Evolving — democracy has always been messy and cyclical; the current turbulence is a correction, not a collapse; institutions are more resilient than they look" },
      { id: "C", text: "The crisis is real but misdiagnosed — the problem isn\'t democracy itself but neoliberal democracy specifically; people aren\'t rejecting self-governance, they\'re rejecting a system that doesn\'t deliver for them economically" },
      { id: "D", text: "The framing assumes democracy is the default — historically, it\'s the exception; the question is whether the conditions that sustained it (shared prosperity, institutional trust, media consensus) can be rebuilt" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "If the crisis is about economic delivery, does that mean a democracy that produces inequality is less legitimate than an authoritarian system that delivers prosperity? Where does that logic lead?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Political philosopher Jason Brennan argues in \'Against Democracy\' that most voters are \'hobbits\' (apathetic and ignorant) or \'hooligans\' (passionate but biased), and that an \'epistocracy\' — rule by the knowledgeable — would produce better outcomes. Voter knowledge surveys consistently show that most citizens can\'t name their representatives or explain basic policy positions. Yet the \'wisdom of crowds\' thesis — and the historical record of expert-led catastrophes — suggests elite rule has its own failure modes. Should informed citizens have more political power than uninformed ones?",
    options: [
      { id: "A", text: "No — political equality is non-negotiable; the moment you weight votes by knowledge, you create a class system; who decides what counts as \'informed\' becomes the real power, and it will be abused" },
      { id: "B", text: "Not through weighted voting, but through institutional design — citizens\' assemblies, deliberative democracy, and sortition (random selection) can elevate informed decision-making without creating hierarchy" },
      { id: "C", text: "The premise is wrong — voter \'ignorance\' is rational; the system doesn\'t reward being informed because individual votes don\'t matter; fix the incentive structure, not the voters" },
      { id: "D", text: "The question reveals a deeper tension — democracy\'s value isn\'t that it produces good outcomes; it\'s that it gives people dignity and agency; efficiency is not the point" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Singapore under Lee Kuan Yew transformed from a developing nation to one of the wealthiest countries per capita in the world under single-party rule. China\'s economic growth over the past 40 years is historically unprecedented. Rwanda under Paul Kagame has achieved remarkable development metrics. These cases are routinely cited by authoritarian apologists — and routinely dismissed by democrats who point to the human rights costs. Can authoritarianism deliver genuine human flourishing?",
    options: [
      { id: "A", text: "Sometimes, temporarily — benevolent autocracy can produce rapid development, but it always depends on the autocrat; succession crises, corruption, and repression are features, not bugs" },
      { id: "B", text: "No — \'flourishing\' requires freedom, not just GDP; a prosperous population that can\'t speak, organize, or hold power accountable isn\'t flourishing, it\'s comfortable captivity" },
      { id: "C", text: "The comparison is unfair — authoritarian success stories are cherry-picked; for every Singapore there are dozens of authoritarian states that are poor, corrupt, and brutal; the base rate matters" },
      { id: "D", text: "The question is less about system type than about state capacity — democracies with strong institutions outperform weak ones; autocracies with strong institutions outperform weak ones; the variable is governance quality, not regime type" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "The U.S. Senate gives Wyoming (population 577,000) the same number of senators as California (population 39 million) — a 68:1 population ratio with equal representation. The Electoral College has produced two presidents in recent history who lost the popular vote (Bush 2000, Trump 2016). Gerrymandering allows legislators to choose their voters rather than the reverse. Meanwhile, New Zealand\'s mixed-member proportional system, ranked-choice voting in Alaska, and citizens\' assemblies in Ireland have shown alternatives. Is the American electoral system democratic?",
    options: [
      { id: "A", text: "Not meaningfully — a system where the person with fewer votes wins, where districts are drawn to predetermine outcomes, and where small states dominate the Senate is democracy in name only" },
      { id: "B", text: "It\'s democratic by design, not by accident — the founders deliberately balanced majority rule with minority protection; the Senate, Electoral College, and federalism prevent tyranny of the majority" },
      { id: "C", text: "It was democratic for its era but hasn\'t evolved — the Constitution was written for 13 states and 4 million people; the failure to reform structures for 330 million people is the problem, not the original design" },
      { id: "D", text: "Electoral mechanics matter less than economic power — it doesn\'t matter how you count votes if policy is determined by lobbyists, donors, and corporations; campaign finance is the real democratic deficit" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2024, the combined campaign spending for U.S. federal elections exceeded $15 billion. The Supreme Court\'s Citizens United decision in 2010 allowed unlimited corporate and union spending on elections. A 2014 Princeton study by Martin Gilens and Benjamin Page found that the preferences of average Americans have \'near-zero\' statistical impact on policy outcomes, while the preferences of economic elites have substantial impact. Is the U.S. a democracy or an oligarchy?",
    options: [
      { id: "A", text: "Oligarchy with democratic characteristics — the formal structures are democratic but the actual power sits with donors, lobbyists, and corporations; elections are a legitimizing ritual for decisions made elsewhere" },
      { id: "B", text: "Democracy with oligarchic distortions — money corrupts the process but elections still matter; candidates lose, incumbents fall, movements succeed; calling it an oligarchy erases the agency of voters" },
      { id: "C", text: "The binary is false — all democracies are influenced by wealth; the question is degree; the U.S. is unusually captured, but the solution is campaign finance reform, not despair about democracy itself" },
      { id: "D", text: "Gilens and Page understated the problem — it\'s not just that the wealthy have more influence, it\'s that the system produces policies that actively increase their wealth, creating a feedback loop that entrenches inequality" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Taiwan\'s Digital Minister Audrey Tang pioneered \'digital democracy\' tools — platforms like Pol.is that use AI to find consensus positions among citizens, and vTaiwan, which crowdsources legislation. Estonia allows online voting and runs most government services digitally. Citizens\' assemblies in Ireland produced breakthrough consensus on abortion and same-sex marriage that elected politicians couldn\'t achieve. Could technology and institutional innovation renew democracy?",
    options: [
      { id: "A", text: "Yes — representative democracy was designed for an era of slow communication and low literacy; deliberative and digital tools can bring citizens meaningfully into governance for the first time" },
      { id: "B", text: "Technology is more likely to harm democracy than help it — social media has already polarized publics; adding more technology to democratic processes invites manipulation, hacking, and algorithmic distortion" },
      { id: "C", text: "The innovations are promising but can\'t substitute for fixing the fundamentals — no amount of digital participation matters if economic inequality, gerrymandering, and media capture aren\'t addressed first" },
      { id: "D", text: "Citizens\' assemblies are the real innovation — random selection of deliberating citizens has a better track record than either elected representatives or digital tools; sortition is the future of democracy" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Winston Churchill said democracy is \'the worst form of government, except for all the others.\' Is he still right — or has something better become possible that wasn\'t available in 1947?",
    freeformOnly: true,
  },
];

export const democracyQuiz = {
  topic: TOPIC,
  topicLabel: "Democracy",
  questions: main,
  followupQuestions,
};
