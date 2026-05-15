import type { AnyQuestion, Question } from "../types";

const TOPIC = "meaning_crisis";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q2a: {
    id: "q2a",
    topic: TOPIC,
    text: "If political identity as religion is dangerous, what should fill the need for moral community instead?",
    options: [
      { id: "A", text: "Local community. Neighborhood, mutual aid, belonging rooted in place instead of ideology" },
      { id: "B", text: "Renewed spiritual traditions. Adapted for modernity but grounded in something older than last week's discourse" },
      { id: "C", text: "Nothing needs to replace it. The goal is many meaning sources so no single one becomes totalizing" },
      { id: "D", text: "Shared projects. Climate action, space, pandemic prep. Meaning through collective doing, not believing" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "For most of human history, almost everyone believed in God. That's ending. U.S. church membership dropped below 50% for the first time in 2023. In Europe, most people under 30 say they're not religious at all.\n\nBut here's what's odd: astrology apps are booming. Psychedelic retreats have waiting lists. People are building entire identities around online communities. It looks like the need didn't go away. Just the institution. So what's actually being lost?",
    options: [
      { id: "A", text: "A shared story. Without a common moral vocabulary, we fragment into tribes that can't talk to each other" },
      { id: "B", text: "Embodied community. Weekly gathering, mutual obligation, rituals that mark birth, death, and transition" },
      { id: "C", text: "Nothing. Religion constrained human flourishing. What's replacing it is more honest, just less organized" },
      { id: "D", text: "A relationship to the sacred. Something beyond the self that secular substitutes refuse by design" },
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
    text: "Jonathan Haidt showed that political identity lights up the same parts of the brain as religion: sacred values, tribal loyalty, ritual, heresy-policing. All of it.\n\nA 2022 Pew study found that in the U.S., your political party now predicts your social behavior better than your race, class, or religion. Think about that. Is politics-as-religion dangerous?",
    options: [
      { id: "A", text: "Yes. It produces zealots, not citizens. Compromise becomes impossible when concession feels like betrayal" },
      { id: "B", text: "It's inevitable. Humans need moral community, and politics is where moral questions actually get decided" },
      { id: "C", text: "The danger is having nothing else. When politics is your only source of meaning, losing an election feels existential" },
      { id: "D", text: "It's not new. Nationalism, communism, fascism were all political religions. We just forgot because liberal democracy felt neutral" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q2a" }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "In 2023, the U.S. Surgeon General declared loneliness a public health epidemic. He compared the mortality effect to smoking 15 cigarettes a day. Loneliness. Not cancer, not heart disease. Loneliness.\n\nAnd yet the internet connects more people than any technology in human history. Some people's deepest relationships exist entirely online. So is the internet making us lonelier, or revealing that we already were?",
    options: [
      { id: "A", text: "Making it worse. Parasocial feeds and algorithmic friends simulate connection while eroding the capacity for the real thing" },
      { id: "B", text: "Making it better. Millions of people found their people online, especially those marginalized or isolated in person" },
      { id: "C", text: "The medium is neutral. What matters is whether online connection leads to offline commitment or permanently substitutes for it" },
      { id: "D", text: "Wrong question. The internet didn't cause loneliness. It revealed how hollow our in-person communities already were" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "In 1882, Nietzsche wrote \"God is dead\" and warned that without a replacement, Europe would fall into nihilism and catastrophic violence. Within 60 years: two world wars and the Holocaust.\n\nCognitive scientist John Vervaeke argues we're in a second wave. The secular substitutes we built after Nietzsche, nationalism, Marxism, consumerism, therapy culture, are themselves now failing. Was Nietzsche right?",
    options: [
      { id: "A", text: "Yes. We're living in the nihilism he predicted. We just masked it with consumption, productivity, and distraction" },
      { id: "B", text: "Partially. The nihilism came, but so did alternatives he didn't foresee: secular humanism, human rights, existentialism" },
      { id: "C", text: "No. He underestimated ordinary resilience. Most people build workable meaning from love, work, and relationships" },
      { id: "D", text: "Right diagnosis, wrong timeline. The real crisis is now. The 20th-century substitutes are finally exhausted too" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "If we're living in masked nihilism, what would unmasking it actually look like? Would that be liberating or devastating?",
      }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Gallup found that 77% of workers worldwide are disengaged from their jobs. Three out of four people spend most of their waking hours doing something they don't care about.\n\nMeanwhile, \"follow your passion\" is everywhere. Steve Jobs said it at Stanford. Every LinkedIn influencer repeats it. The Japanese concept of ikigai became a bestselling self-help framework. Is meaningful work actually possible for most people, or is that a story we tell to make an unfair system feel okay?",
    options: [
      { id: "A", text: "Work can be meaningful. Craft, service, creation are real human needs. The problem is most jobs are badly designed" },
      { id: "B", text: "\"Find your passion\" is a privilege narrative. It erases the reality of most work: coerced, repetitive, done to survive" },
      { id: "C", text: "The problem is conditions, not work itself. Meaning requires autonomy, mastery, fair pay. Most jobs deny all three" },
      { id: "D", text: "Both. Work is a real meaning source and the system exploits that desire to extract more labor for less" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Philosopher Charles Taylor has a name for what modernity did. He calls it \"the immanent frame\": a world where everything is natural, material, self-contained. Nothing points beyond itself. No hidden meaning. No cosmic order. Just... this.\n\nSome people find that liberating. Others find it suffocating. When everything is explainable, is anything still sacred?",
    options: [
      { id: "A", text: "No, and that's fine. Sacredness was always a projection. Seeing the world clearly is a gain, not a loss" },
      { id: "B", text: "No, and that's the problem. Without the sacred, everything becomes instrumental. People become resources. Relationships become transactions" },
      { id: "C", text: "Yes. Awe, beauty, moral obligation, love. These are sacred experiences available without the supernatural" },
      { id: "D", text: "Too early to tell. We're only a few centuries into the secular experiment. New forms of the sacred may still emerge" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Describe a moment, real or hypothetical, where you felt genuine meaning that wasn't transactional, performative, or consumable. What made it different?",
    freeformOnly: true,
  },
];

export const meaningCrisisQuiz = {
  topic: TOPIC,
  topicLabel: "The Meaning Vacuum",
  questions: main,
  followupQuestions,
};
