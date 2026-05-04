import type { AnyQuestion, Question } from "../types";

const TOPIC = "taiwan";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "If Taiwan is a country, should the U.S. formally recognize it — which would mean severing diplomatic relations with China, as Beijing demands? The last country to switch recognition from Beijing to Taipei was Nauru in 2024. China has systematically pressured Taiwan\'s remaining diplomatic allies, reducing them from 30 in 2000 to 12. Is formal recognition worth the cost?",
    options: [
      { id: "A", text: "Yes — diplomatic honesty matters; maintaining the fiction that Taiwan isn\'t a country to appease an authoritarian government is morally indefensible" },
      { id: "B", text: "No — formal recognition would trigger a crisis with China that could escalate to war; the symbolic gain isn\'t worth the concrete risk" },
      { id: "C", text: "Not unilaterally — recognition should be coordinated with allies (Japan, EU, Australia) so the diplomatic cost is shared and the signal is stronger" },
      { id: "D", text: "Recognition is less important than substantive support — Taiwan needs weapons, intelligence sharing, and economic integration more than it needs a name change at the UN" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Since 1979, the U.S. has maintained \'strategic ambiguity\' on whether it would defend Taiwan from a Chinese invasion. President Biden stated four separate times that the U.S. would defend Taiwan militarily, while his staff walked it back each time. China has increased military exercises around Taiwan dramatically — in 2022, after Nancy Pelosi\'s visit, the PLA conducted its largest-ever drills simulating a blockade. Taiwan\'s 23 million people live under this daily uncertainty. Should the U.S. commit explicitly to Taiwan\'s defense?",
    options: [
      { id: "A", text: "Yes — ambiguity is no longer stabilizing; a clear commitment deters invasion and gives Taiwan the certainty it needs to invest in its own defense" },
      { id: "B", text: "No — explicit commitment risks provoking the very war it\'s meant to prevent; ambiguity has kept the peace for 45 years and should not be abandoned" },
      { id: "C", text: "The U.S. should commit privately to Taiwan while maintaining ambiguity publicly — credible deterrence doesn\'t require a public declaration that backs China into a corner" },
      { id: "D", text: "The question assumes the U.S. should be making this decision at all — Taiwan\'s fate shouldn\'t depend on whether Washington decides its strategic value justifies the risk" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "An explicit defense commitment could trigger an arms race in the Taiwan Strait and accelerate China\'s invasion timeline. How do you weigh the deterrence benefit against the escalation risk?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "TSMC — the Taiwan Semiconductor Manufacturing Company — produces over 90% of the world\'s most advanced chips. Every iPhone, every AI server, every advanced weapons system depends on TSMC\'s fabrication plants in Taiwan. The U.S. CHIPS Act allocated $52 billion to build domestic semiconductor manufacturing, but TSMC\'s Arizona plant has faced delays and cost overruns. If China took Taiwan, it would control the global chip supply. Is the semiconductor dependency the real reason the U.S. cares about Taiwan?",
    options: [
      { id: "A", text: "Yes, and that\'s fine — strategic interests are legitimate reasons to defend an ally; pretending it\'s purely about democracy is less honest than admitting the chips matter" },
      { id: "B", text: "It\'s a factor but not the main one — Taiwan is a thriving democracy of 23 million people; defending it is a values commitment, not just an economic calculation" },
      { id: "C", text: "The semiconductor dependency is the vulnerability, not the reason — the right response is to build supply chain independence so Taiwan\'s defense isn\'t hostage to chip economics" },
      { id: "D", text: "The chip dependency reveals the real structure of American foreign policy — the U.S. defends countries when their resources matter and abandons them when they don\'t; values are the marketing" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The \'One China\' policy — acknowledged by the U.S. since 1979 — holds that there is one China, and the People\'s Republic is its government. Taiwan has never formally declared independence, though polls consistently show a majority of Taiwanese identify as Taiwanese, not Chinese, and support for unification has dropped below 5%. Taiwan has its own military, currency, passport, and democratically elected government. Is Taiwan a country?",
    options: [
      { id: "A", text: "Yes — by any functional definition, Taiwan is an independent state; the diplomatic fiction that it isn\'t is a concession to Chinese power, not a reflection of reality" },
      { id: "B", text: "It\'s complicated — Taiwan functions as a state but hasn\'t declared independence; forcing the question risks war; the ambiguity, however uncomfortable, is what prevents conflict" },
      { id: "C", text: "The question itself is dangerous — whether Taiwan \'is\' a country matters less than whether its people are free and secure; the status quo, imperfect as it is, achieves that" },
      { id: "D", text: "It\'s a question only Taiwanese people should answer — the fact that this is debated in Washington and Beijing rather than Taipei reveals whose interests actually drive the conversation" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Since 2018, the U.S. has imposed escalating restrictions on China\'s access to advanced semiconductor technology — banning exports of cutting-edge chips and chipmaking equipment, restricting Chinese investment in U.S. tech, and pressuring allies like the Netherlands (ASML) and Japan to follow suit. China has responded with export controls on rare earth minerals and accelerated investment in domestic chip production. Hawks like Matt Pottinger call this necessary containment. Critics call it a new Cold War that could fragment the global economy. Is economic decoupling from China the right strategy?",
    options: [
      { id: "A", text: "Yes — economic interdependence with an authoritarian rival is a vulnerability, not a strength; decoupling reduces leverage China can use in a crisis" },
      { id: "B", text: "No — economic integration is what prevents war; making China and the U.S. economically independent of each other removes the strongest incentive for peace" },
      { id: "C", text: "Targeted decoupling makes sense — restrict military-relevant technology while maintaining trade in consumer goods; the goal is security, not autarky" },
      { id: "D", text: "Decoupling is a fantasy — the global economy is too integrated; the real effect is raising costs for American consumers and accelerating China\'s push for self-sufficiency" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Taiwan\'s military spending is roughly 2.5% of GDP — less than the U.S. (3.4%) and Israel (5.3%) despite facing an existential threat. Taiwan still uses a conscription system that until 2024 required only four months of service. Military analysts like Michael Beckley have argued that Taiwan could make a Chinese invasion prohibitively costly through asymmetric defense — mines, anti-ship missiles, mobile launchers — rather than trying to match the PLA ship for ship. Should the U.S. pressure Taiwan to do more for its own defense?",
    options: [
      { id: "A", text: "Yes — if Taiwan won\'t invest seriously in its own survival, the U.S. shouldn\'t be expected to risk American lives and a potential nuclear war to compensate" },
      { id: "B", text: "The U.S. is in no position to lecture — Washington\'s own defense strategy in the Pacific has been inconsistent; the issue is joint planning, not finger-pointing" },
      { id: "C", text: "Taiwan\'s government knows its situation better than Washington — domestic politics, economic constraints, and the desire to avoid provocation all shape defense spending in ways outsiders don\'t fully appreciate" },
      { id: "D", text: "The focus on Taiwan\'s spending misses the asymmetry — no amount of Taiwanese defense spending can match China\'s military; the real question is whether the U.S. commitment is credible enough to deter in the first place" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Multiple war games conducted by the Center for Strategic and International Studies (CSIS) in 2023 simulated a Chinese invasion of Taiwan in 2026. In most scenarios, the U.S. and allies successfully repelled the invasion — but at enormous cost: two U.S. aircraft carriers sunk, hundreds of aircraft destroyed, thousands of American casualties, and the near-total destruction of Taiwan\'s economy and infrastructure. The \'victory\' left Taiwan devastated and the U.S. military weakened for a generation. Is defending Taiwan worth that cost?",
    options: [
      { id: "A", text: "Yes — allowing China to take Taiwan by force would end the credibility of every U.S. alliance in Asia; Japan, South Korea, and Australia would lose faith in American security guarantees" },
      { id: "B", text: "No — the costs described are catastrophic and could escalate to nuclear war; no island\'s political status is worth risking the destruction of major world powers" },
      { id: "C", text: "The question is wrong because it accepts war as binary — the real strategy is to make the cost of invasion so high that China never attempts it; deterrence, not warfighting, is the goal" },
      { id: "D", text: "The war game scenarios prove that military defense of Taiwan is a losing proposition for everyone — the answer is diplomatic resolution, not better war plans" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "It\'s 2030. You\'re advising the U.S. president. Intelligence shows China will attempt a blockade of Taiwan within 6 months. What do you recommend — and what are you willing to risk?",
    freeformOnly: true,
  },
];

export const taiwanQuiz = {
  topic: TOPIC,
  topicLabel: "Taiwan",
  questions: main,
  followupQuestions,
};
