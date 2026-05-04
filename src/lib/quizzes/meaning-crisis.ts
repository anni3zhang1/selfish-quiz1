import type { AnyQuestion, Question } from "../types";

const TOPIC = "meaning_crisis";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q2a: {
    id: "q2a",
    topic: TOPIC,
    text: "If political identity as religion is dangerous, what should fill the need for moral community instead?",
    options: [
      { id: "A", text: "Local community — neighborhood, mutual aid, place-based belonging that doesn't require ideological alignment" },
      { id: "B", text: "Renewed philosophical or spiritual traditions — adapted for modernity but grounded in something older than last week's discourse" },
      { id: "C", text: "Nothing needs to \"replace\" it — the goal is a plurality of meaning sources so no single one becomes totalizing" },
      { id: "D", text: "Shared projects — climate action, space exploration, pandemic preparedness; meaning through collective doing, not collective believing" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2023, Gallup found that church membership in the U.S. dropped below 50% for the first time — down from 70% in 1999. Across Europe, most people under 30 identify as non-religious. Meanwhile, astrology apps, psychedelic retreats, and online communities built around identity are booming. What's actually being lost as religion declines?",
    options: [
      { id: "A", text: "Shared narrative — religion gave people a common story and moral vocabulary; without one, we fragment into tribes that can't talk to each other" },
      { id: "B", text: "Embodied community — not the beliefs but the practice: weekly gathering, mutual obligation, rituals that mark birth, death, and transition" },
      { id: "C", text: "Nothing is being lost — religion was a constraint on human flourishing, and what's replacing it is more honest, just less organized" },
      { id: "D", text: "A relationship to the sacred — something beyond the self that secular substitutes can't replicate because they refuse transcendence by design" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "If nothing is being lost, why are loneliness, anxiety, and \"deaths of despair\" climbing fastest in the most secular, affluent societies?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Psychologist Jonathan Haidt documents in \"The Righteous Mind\" how political identity activates the same moral psychology as religion — sacred values, tribal loyalty, ritual, and heresy-policing. A 2022 Pew study found that partisan identity is now a stronger predictor of social behavior than race, class, or religion in the U.S. Is politics-as-religion dangerous?",
    options: [
      { id: "A", text: "Yes — politics as religion produces zealots, not citizens; it makes compromise impossible because concession feels like apostasy" },
      { id: "B", text: "It's inevitable — humans need moral community, and politics is where moral questions actually get decided; this is just what democracy looks like" },
      { id: "C", text: "The danger isn't political identity itself but the absence of anything else — when politics is your only source of meaning, losing an election feels existential" },
      { id: "D", text: "It's not new — nationalism, communism, and fascism were all political religions; we just forgot because liberal democracy was boring enough to feel neutral" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q2a" }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The U.S. Surgeon General Vivek Murthy declared loneliness a public health epidemic in 2023, comparing its mortality effects to smoking 15 cigarettes a day. Yet the internet connects more people than any technology in history. Some people's deepest relationships exist entirely online. Murthy's advisory focused on in-person connection — but is that the right frame?",
    options: [
      { id: "A", text: "Net negative — parasocial relationships and algorithmic feeds simulate connection while eroding the capacity for the real thing" },
      { id: "B", text: "Net positive — the internet let millions of people find their people, especially those marginalized or isolated in physical spaces" },
      { id: "C", text: "The medium is neutral — what matters is whether online connection leads to offline commitment, or permanently substitutes for it" },
      { id: "D", text: "Wrong question — the internet didn't cause loneliness; it revealed how hollow our in-person communities had already become before the first smartphone" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "In 1882, Nietzsche wrote \"God is dead\" and warned that without a replacement for the Christian moral framework, Europe would descend into nihilism and catastrophic ideological warfare. Within 60 years, two world wars and the Holocaust had played out. Cognitive scientist John Vervaeke argues we're in a second wave — that the secular substitutes (nationalism, Marxism, consumerism, therapeutic culture) are themselves now failing. Was Nietzsche right?",
    options: [
      { id: "A", text: "Yes — we're living in exactly the nihilism he predicted; we just masked it with consumption, productivity, and distraction" },
      { id: "B", text: "Partially — the nihilism came, but so did genuine alternatives he didn't foresee: secular humanism, existentialism, effective altruism, human rights frameworks" },
      { id: "C", text: "No — he underestimated ordinary human resilience; most people construct workable meaning from love, work, and relationships without any grand narrative" },
      { id: "D", text: "He was right about the diagnosis but wrong about the timeline — the real crisis is hitting now, because the 20th-century substitutes are finally exhausted too" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "If we're living in masked nihilism — what would unmasking it actually look like? And would that be liberating or devastating?",
      }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Gallup's global workplace study found that 77% of workers worldwide are disengaged from their jobs. Meanwhile, \"follow your passion\" is the dominant career advice of the educated class, from Steve Jobs' Stanford commencement speech to every LinkedIn influencer. The Japanese concept of ikigai — finding purpose at the intersection of love, skill, need, and pay — has become a bestselling self-help framework. Where do you land on meaning in work?",
    options: [
      { id: "A", text: "Work can be genuinely meaningful — craft, service, creation are human needs, not capitalist inventions; the problem is most jobs are designed badly" },
      { id: "B", text: "\"Find your passion\" is a privilege narrative that erases the reality of most work, which is coerced, repetitive, and done to survive" },
      { id: "C", text: "The problem isn't work itself but conditions — meaningful work requires autonomy, mastery, and fair compensation, which most employment structures deny" },
      { id: "D", text: "Both are true, and that's the tension — work is a genuine source of meaning AND the system exploits that desire to extract more labor for less pay" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Philosopher Charles Taylor argues in \"A Secular Age\" that modernity didn't just remove God — it created a new condition he calls \"the immanent frame,\" where all experience is understood as natural, material, and self-contained. Nothing points beyond itself. Some see this as liberation; others as a kind of imprisonment. When everything is explainable, is anything still sacred?",
    options: [
      { id: "A", text: "No, and that's fine — sacredness was always a human projection; understanding the world as it actually is, without mystification, is a gain, not a loss" },
      { id: "B", text: "No, and that's the problem — without the sacred, everything becomes instrumental; people become resources, nature becomes material, relationships become transactions" },
      { id: "C", text: "Yes — sacredness doesn't require the supernatural; awe, beauty, moral obligation, and love are all sacred experiences fully available within a materialist frame" },
      { id: "D", text: "The question is premature — we're only a few centuries into the secular experiment; we don't yet know what new forms of the sacred might emerge from a post-religious culture" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Describe a moment — real or hypothetical — where you felt genuine meaning that wasn’t transactional, performative, or consumable. What made it different?",
    freeformOnly: true,
  },
];

export const meaningCrisisQuiz = {
  topic: TOPIC,
  topicLabel: "Meaning Crisis",
  questions: main,
  followupQuestions,
};
