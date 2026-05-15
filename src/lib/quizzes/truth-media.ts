import type { AnyQuestion, Question } from "../types";

const TOPIC = "truth_media";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "So if platforms shouldn't be deciding what's true, what happens when the stakes are life and death? Anti-vaccine content during a pandemic. Election fraud claims that end in actual violence.\n\nThese aren't hypotheticals. People died. Is that an acceptable cost of keeping things open?",
    options: [
      { id: "A", text: "Yes. Censorship is more dangerous than bad speech. The fix for bad speech is better speech, not silence" },
      { id: "B", text: "No. When speech directly causes death or violence, the harm is too immediate. Moderation is justified" },
      { id: "C", text: "This proves why no private company should have this power. These are decisions for democratic governance" },
      { id: "D", text: "Wrong framing. Don't delete the post. Just stop the algorithm from blasting it to millions of people" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's something wild. In 2024, someone made a fake robocall of Joe Biden telling New Hampshire voters to stay home. Sounded exactly like him. Cost less than ten bucks to produce.\n\nThat same year, a deepfake audio clip of a Slovak candidate \"admitting\" to vote rigging went viral two days before a razor-thin election. Across the US, India, Indonesia, and the UK, AI-generated fakes showed up in every major election cycle.\n\nWe crossed a line: anyone with a laptop can now manufacture convincing fake audio, video, and text for the price of a sandwich. What's the most important response?",
    options: [
      { id: "A", text: "Technical. Mandate watermarking on all AI content so platforms can catch fakes before they spread" },
      { id: "B", text: "Legal. Criminalize political deepfakes with real penalties. The tech exists, the law needs to catch up" },
      { id: "C", text: "Educational. Detection tools will always lag behind. People need to be skeptical by default" },
      { id: "D", text: "None of these fix the real damage. Deepfakes let everyone dismiss real evidence as fake too" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "You're describing what researchers call \"the liar's dividend.\" Once fakes exist, real footage becomes deniable. Is there any design for institutions or technology that could restore shared ground, or is that gone for good?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Only 32% of Americans trust the media. That's the lowest number Gallup has ever recorded. And it's not just the US. The Reuters Institute found the same collapse across 46 countries.\n\nMeanwhile, Joe Rogan pulls 11 million listeners per episode. Substack newsletter writers routinely outperform the New York Times in audience size. The audiences didn't disappear. They moved.\n\nSo what actually broke? Is the media producing worse stuff, or did people just stop believing it?",
    options: [
      { id: "A", text: "Media quality. Legacy outlets chased clicks over credibility. They earned the distrust they're getting" },
      { id: "B", text: "Audience trust. Politicians, platforms, and foreign actors ran deliberate campaigns to kill journalism's credibility" },
      { id: "C", text: "Both. Newsrooms cut corners and chased engagement while algorithms radicalized audiences simultaneously" },
      { id: "D", text: "Neither. Gatekeeping is dead and trust in all institutions is falling. Media isn't special, just visible" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "In 2020, Twitter and Facebook blocked the New York Post's story about Hunter Biden's laptop weeks before the presidential election. They called it potential disinformation. The story turned out to be real.\n\nThen in 2023, the Supreme Court took up Murthy v. Missouri, asking whether the Biden administration illegally pressured social media companies to suppress content.\n\nThis is the question underneath both: should platforms decide what's true?",
    options: [
      { id: "A", text: "Yes. Letting everything through equally just amplifies the loudest and most outrageous voices" },
      { id: "B", text: "No. The Hunter Biden episode proved they'll kill real stories under the banner of fighting misinfo" },
      { id: "C", text: "The problem isn't moderation. It's who decides. We need transparent, independent review bodies, not backroom calls" },
      { id: "D", text: "The whole debate is a distraction. Algorithmic amplification is the real editorial choice. Moderation policy is theater" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here's something funny about how we \"know\" things now. You Google a question, skim the top result for three seconds, and walk away feeling like you understand it. Philosopher Michael Lynch calls this \"Google-knowing.\" Confidence from finding information, not from understanding it.\n\nDaniel Kahneman spent decades showing that even when humans have good evidence right in front of them, our brains reliably screw up the evaluation. We're bad at this. We were always bad at this.\n\nNow add deepfakes, algorithmic feeds, and AI-generated text to the mix. Is the Enlightenment idea of an informed citizenry still possible?",
    options: [
      { id: "A", text: "No. It was always aspirational. We need institutions designed for real humans, not mythically rational ones" },
      { id: "B", text: "Yes, but only with massive investment in education. Critical thinking should be core curriculum, not an elective" },
      { id: "C", text: "The ideal was never about individual brains. It was about institutional design: free press, courts, peer review. Rebuild those" },
      { id: "D", text: "It's viable if we accept limits. Most people defer to authority. The real question is making authority trustworthy again" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Elon Musk bought Twitter for $44 billion, renamed it X, fired the trust and safety team, reinstated banned accounts, and replaced verification with a subscription anyone could buy. That was 2022.\n\nSince then: Meta launched Threads. Bluesky built a decentralized alternative backed by Twitter's co-founder Jack Dorsey. Mastodon runs on a protocol with no central owner at all.\n\nSo now we have a live experiment. Billionaire-owned platforms vs. decentralized protocols vs. something nobody's built yet. Which direction should public conversation go?",
    options: [
      { id: "A", text: "Decentralized protocols. No single person should control the infrastructure of public conversation. Period" },
      { id: "B", text: "Billionaire ownership is bad, but decentralization is worse. Moderation at scale needs resources volunteers can't sustain" },
      { id: "C", text: "Public infrastructure. The digital public square should be publicly funded, like the postal service or public broadcasting" },
      { id: "D", text: "The 'public square' metaphor is broken. The future is many smaller communities with different norms, not one platform" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2024, Google started putting AI-generated summaries above search results. You ask a question, the AI gives you the answer, and you never click through to the actual source. Traffic to news sites and independent creators dropped.\n\nThink about what that means. The AI learned everything it knows from those websites. And now it's replacing them.\n\nWikipedia co-founder Jimmy Wales warned this could \"destroy the ecosystem that produces the information AI was trained on.\" If AI can summarize everything, what happens to the people who actually create the knowledge?",
    options: [
      { id: "A", text: "They'll be destroyed unless revenue-sharing is mandated. This is journalism's Napster moment" },
      { id: "B", text: "They'll adapt. Musicians survived streaming. Creators will find revenue models AI can't replicate" },
      { id: "C", text: "The knowledge ecosystem will collapse. Then AI will be summarizing increasingly stale, unreliable information" },
      { id: "D", text: "This is a feature. The old gatekeeping model was itself the problem. AI democratizes access, even if it disrupts producers" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "If AI hollows out the very ecosystem it depends on, what breaks first? And here's the scarier question: would we even notice before it's too late?",
      }
    },
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Pick a belief you hold strongly. Something you'd argue about at dinner.\n\nNow, two questions. How did you actually arrive at that belief? Not the story you tell yourself, but the real path. And second: what would it take to change your mind? What evidence, if it showed up tomorrow, would make you say \"okay, I was wrong\"?",
    freeformOnly: true,
  },
];

export const truthMediaQuiz = {
  topic: TOPIC,
  topicLabel: "How Do You Know What's True?",
  questions: main,
  followupQuestions,
};
