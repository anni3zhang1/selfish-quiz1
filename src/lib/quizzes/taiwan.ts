import type { AnyQuestion, Question } from "../types";

const TOPIC = "taiwan";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "OK so if Taiwan is a country, here's the next domino.\n\nShould the U.S. formally recognize it? Because that doesn't just mean updating a website. Beijing's rule is absolute: if you recognize Taipei, you lose Beijing. Every country that's tried has been punished.\n\nThe last nation to switch recognition to Taipei was Nauru, in 2024. China has been running a slow-motion campaign to peel away Taiwan's diplomatic allies, dropping the count from 30 in 2000 to just 12 today. One by one, like pulling teeth.\n\nIs the honest label worth the geopolitical cost?",
    options: [
      { id: "A", text: "Yes, maintaining a diplomatic lie to appease an authoritarian government is morally indefensible" },
      { id: "B", text: "No, formal recognition could trigger a crisis that spirals into actual war over a symbol" },
      { id: "C", text: "Only if coordinated with allies like Japan and the EU so the cost is shared" },
      { id: "D", text: "Recognition matters less than real support: weapons, intelligence sharing, and economic integration" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Since 1979, the U.S. has played a strange game with Taiwan. The official policy is called 'strategic ambiguity,' which is a polite way of saying: we refuse to tell you whether we'd actually show up if China invaded.\n\nThink about how weird that is. Imagine your friend says 'I might help you move, or I might not, and I won't tell you which until the truck arrives.' Now replace 'moving' with 'a military invasion affecting 23 million people.'\n\nPresident Biden said four separate times that yes, the U.S. would defend Taiwan militarily. Four times. And four times, his own staff scrambled to walk it back. Meanwhile, after Nancy Pelosi visited Taiwan in 2022, China responded with the largest military drills ever conducted around the island, simulating a full blockade.\n\nSo 23 million people wake up every morning inside this uncertainty. Should the U.S. just say it plainly?",
    options: [
      { id: "A", text: "Yes, ambiguity has become destabilizing and a clear commitment would actually deter invasion" },
      { id: "B", text: "No, an explicit promise risks provoking the exact war it's meant to prevent" },
      { id: "C", text: "Commit privately to Taiwan while staying vague in public so China isn't backed into a corner" },
      { id: "D", text: "The real question is why Taiwan's fate depends on what Washington decides rather than Taipei" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "Here's the tension though.\n\nAn explicit defense commitment could actually speed up China's invasion timeline. If Beijing concludes the window is closing, they might move sooner rather than later. It's the security dilemma in its purest form: the thing you do to feel safer makes the other side feel threatened enough to act.\n\nHow do you weigh the deterrence benefit against that escalation risk?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Here's a fact that should make your jaw drop.\n\nOne company, TSMC, makes over 90% of the world's most advanced semiconductor chips. Every iPhone. Every AI server. Every cutting-edge weapons system. All of them depend on fabrication plants located on an island of 23 million people that China claims as its own territory.\n\nWait, really? Ninety percent?\n\nYes. And the backup plan isn't going great. The U.S. CHIPS Act threw $52 billion at building domestic fabs, but TSMC's Arizona plant is behind schedule and over budget. The simple truth is that the most important supply chain on Earth runs through a place that could become a war zone.\n\nSo here's the uncomfortable question: is the semiconductor dependency the real reason the U.S. cares about Taiwan?",
    options: [
      { id: "A", text: "Yes, and that's honest. Strategic interests are legitimate reasons to defend an ally." },
      { id: "B", text: "It's a factor, but Taiwan is a democracy of 23 million people, not just a chip factory" },
      { id: "C", text: "The dependency is the vulnerability, not the reason. Build supply chain independence first." },
      { id: "D", text: "This reveals how U.S. foreign policy actually works: defend the resources, market the values" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Let's try a thought experiment.\n\nImagine an entity that has its own military, its own currency, its own passport, its own democratically elected government, and 23 million people who overwhelmingly identify as its citizens. Would you call that a country?\n\nNow here's the twist. Since 1979, the U.S. has officially acknowledged that there is 'one China,' and the People's Republic is its government. Taiwan has never formally declared independence, even though polls show support for unification with China has dropped below 5%. Five percent.\n\nSo Taiwan walks like a country, talks like a country, and votes like a country. But the entire international diplomatic system pretends it isn't one, because China says so.\n\nIs Taiwan a country?",
    options: [
      { id: "A", text: "Yes, by any functional definition. The diplomatic fiction is a concession to power, not reality." },
      { id: "B", text: "It's genuinely complicated. Taiwan functions as a state but forcing the question risks war." },
      { id: "C", text: "The label matters less than whether its people are free and secure, which they currently are" },
      { id: "D", text: "Only Taiwanese people should answer this, not politicians in Washington or Beijing" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Since 2018, the U.S. has been running what amounts to a technology siege.\n\nBanned exports of cutting-edge chips to China. Restricted Chinese investment in U.S. tech. Pressured the Netherlands (home of ASML, the only company on Earth that makes extreme ultraviolet lithography machines) and Japan to join in. Layer after layer of restrictions, each one tighter than the last.\n\nChina hit back: export controls on rare earth minerals, and a crash program to build its own chip industry from scratch.\n\nNow zoom out. What's actually happening here? Hawks call it necessary containment. Critics call it a new Cold War that could split the global economy in two. The U.S. and China together represent about 40% of world GDP. That's not two economies decoupling. That's the world economy tearing along a seam.\n\nIs economic decoupling from China the right strategy?",
    options: [
      { id: "A", text: "Yes, economic interdependence with an authoritarian rival is a vulnerability, not a strength" },
      { id: "B", text: "No, economic integration is the strongest brake on war. Removing it removes the incentive for peace." },
      { id: "C", text: "Targeted decoupling only: restrict military tech, keep trading consumer goods. Security, not autarky." },
      { id: "D", text: "Decoupling is a fantasy. The real effect is higher prices for Americans and faster Chinese self-sufficiency." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Here's something that should bother you.\n\nTaiwan spends about 2.5% of GDP on defense. That sounds reasonable until you compare it. The U.S. spends 3.4%. Israel spends 5.3%. And Israel doesn't have the world's second-largest military parked across a 100-mile strait promising to invade.\n\nUntil 2024, Taiwan's mandatory military conscription required just four months of service. Four months. To prepare for a potential invasion by the People's Liberation Army, which has 2 million active personnel.\n\nMilitary analysts like Michael Beckley argue Taiwan doesn't need to match China ship for ship. It needs to become a porcupine: sea mines, anti-ship missiles, mobile launchers, all designed to make an amphibious invasion so costly that China never tries.\n\nBut should the U.S. pressure Taiwan to do more for its own defense?",
    options: [
      { id: "A", text: "Yes. If Taiwan won't invest in its own survival, why should America risk lives and nuclear war?" },
      { id: "B", text: "The U.S. can't lecture anyone. Washington's own Pacific strategy has been inconsistent for decades." },
      { id: "C", text: "Taiwan's government understands its constraints better than Washington does. Outsiders oversimplify." },
      { id: "D", text: "Taiwan's spending is beside the point. No budget matches China's military. Credible U.S. deterrence is what matters." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2023, the Center for Strategic and International Studies ran war games simulating a Chinese invasion of Taiwan. Set in 2026. Multiple scenarios, serious people, real models.\n\nThe headline result? The U.S. and allies 'won' most scenarios. They repelled the invasion.\n\nNow here's what 'winning' looked like.\n\nTwo U.S. aircraft carriers sunk. Hundreds of aircraft destroyed. Thousands of American casualties. Taiwan's economy and infrastructure, essentially leveled. The U.S. military so weakened it would take a generation to rebuild.\n\nThat's victory. The island is 'free' but devastated. The defenders 'won' but can barely stand.\n\nThink about it like a bar fight where you successfully defend yourself but break both arms, lose your car, and spend six months in the hospital.\n\nIs defending Taiwan worth that cost?",
    options: [
      { id: "A", text: "Yes. Letting China take Taiwan by force would destroy every U.S. alliance in Asia overnight." },
      { id: "B", text: "No. The costs are catastrophic and could escalate to nuclear war. No island's status is worth that." },
      { id: "C", text: "Wrong framing. The goal is making invasion so costly China never attempts it. Deterrence, not warfighting." },
      { id: "D", text: "These war games prove military defense is a losing bet for everyone. The answer is diplomacy." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "It's 2030. You're advising the U.S. president.\n\nIntelligence shows China will attempt a blockade of Taiwan within six months. Not a drill, not posturing. The real thing.\n\nWhat do you recommend? And what are you willing to risk?",
    freeformOnly: true,
  },
];

export const taiwanQuiz = {
  topic: TOPIC,
  topicLabel: "The Most Dangerous Place on Earth",
  questions: main,
  followupQuestions,
};
