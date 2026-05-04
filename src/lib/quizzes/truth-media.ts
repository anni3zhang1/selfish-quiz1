import type { AnyQuestion, Question } from "../types";

const TOPIC = "truth_media";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "If platforms shouldn't moderate for truth, what happens when genuinely dangerous misinformation spreads — like anti-vaccine content during a pandemic, or election fraud claims that lead to political violence? Is that an acceptable cost of openness?",
    options: [
      { id: "A", text: "Yes — the cost of censorship is higher than the cost of bad speech; the answer to bad speech is more speech, not less" },
      { id: "B", text: "No — there are categories of speech (public health emergencies, incitement to violence) where the harm is so direct and immediate that moderation is justified" },
      { id: "C", text: "The question proves the problem with platform power — no private company should be making these decisions at all; this is a role for democratic governance" },
      { id: "D", text: "The binary is wrong — instead of removing content, platforms should change the algorithm; don't censor the post, just stop amplifying it to millions" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2024, AI-generated deepfakes of political figures went viral in elections across the US, India, Indonesia, and the UK. A fake robocall impersonating Joe Biden told New Hampshire voters to stay home. In Slovakia, an AI-generated audio clip of a liberal candidate discussing vote rigging circulated two days before a close election. We now live in a world where anyone can produce convincing fake audio, video, and text for under $10. What's the most important response?",
    options: [
      { id: "A", text: "Technical — mandate watermarking and provenance standards (like C2PA) on all AI-generated content so fakes can be detected at the platform level" },
      { id: "B", text: "Legal — criminalize the creation and distribution of political deepfakes with real penalties; the technology exists, so the law must catch up" },
      { id: "C", text: "Educational — media literacy is the only durable solution; detection tools will always lag behind generation tools, so people need to be skeptical by default" },
      { id: "D", text: "None of these will work — the real damage isn't any single fake; it's that the existence of deepfakes lets everyone dismiss real evidence as fake too; truth itself becomes optional" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "If the real damage is that everything becomes deniable — \"the liar's dividend\" — is there any institutional design that can restore shared epistemic ground, or is that gone permanently?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Trust in media has collapsed. Gallup's 2023 survey found that only 32% of Americans trust mass media — the lowest on record. The Reuters Institute's Digital News Report found similar declines across 46 countries. Meanwhile, podcasters like Joe Rogan (11 million listeners per episode) and newsletter writers on Substack regularly outperform legacy outlets in audience size. Is the crisis one of media quality, or audience trust?",
    options: [
      { id: "A", text: "Media quality — legacy outlets abandoned neutrality for engagement, lost credibility, and deserve the distrust they're getting" },
      { id: "B", text: "Audience trust — deliberate campaigns to delegitimize journalism (from politicians, platforms, and foreign actors) have worked; the media is flawed but the distrust is manufactured" },
      { id: "C", text: "Both — media consolidated, cut investigative journalism, and chased clicks, while audiences were simultaneously radicalized by algorithms and partisan media ecosystems" },
      { id: "D", text: "Neither — the real shift is structural; the gatekeeping model is dead, and trust in institutions generally is declining; media isn't special, it's just visible" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "In 2020, Twitter and Facebook suppressed the New York Post's Hunter Biden laptop story weeks before the presidential election, citing concerns about hacked materials and potential disinformation. The story turned out to be genuine. In 2023, the Supreme Court heard Murthy v. Missouri, a case alleging the Biden administration pressured social media companies to censor content. Should platforms make editorial judgments about what's true?",
    options: [
      { id: "A", text: "Yes — platforms are publishers in practice; letting everything through equally is itself a choice that amplifies the loudest and most outrageous voices" },
      { id: "B", text: "No — platforms shouldn't be arbiters of truth; the Hunter Biden episode proved they'll suppress real stories under the guise of fighting disinformation" },
      { id: "C", text: "The problem isn't moderation itself but who decides — platforms making these calls privately is dangerous; we need transparent, independent content review bodies" },
      { id: "D", text: "The framing is obsolete — algorithmic amplification is the real editorial choice; a platform can \"allow\" content while ensuring almost no one sees it, or boost it to millions; moderation policy is a distraction from architecture" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Philosopher Michael Lynch argues in \"The Internet of Us\" that we've shifted from an \"evidence-based\" epistemic culture to a \"Google-knowing\" culture — where confidence comes from the ability to find information, not from understanding it. Psychologist Daniel Kahneman showed that cognitive biases make humans reliably bad at evaluating evidence, even when it's available. If humans are naturally bad at determining truth and technology makes it harder — is the Enlightenment ideal of an informed citizenry still viable?",
    options: [
      { id: "A", text: "No — it was always aspirational and is now functionally dead; we need institutions designed for cognitively limited citizens, not mythically rational ones" },
      { id: "B", text: "Yes, but only if we invest massively in education — critical thinking, statistical literacy, and epistemic humility should be core curriculum, not electives" },
      { id: "C", text: "The Enlightenment ideal was never about individual rationality — it was about institutional design: free press, courts, peer review; those can be rebuilt for the digital age" },
      { id: "D", text: "The ideal is viable but requires accepting limits — most people will defer to trusted authorities most of the time, and the real question is how to make authority trustworthy again" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Elon Musk acquired Twitter for $44 billion in 2022, renamed it X, reinstated banned accounts including Donald Trump's, gutted the trust and safety team, and replaced verified accounts with a paid subscription. Meta launched Threads as a competitor. Bluesky, backed by Twitter co-founder Jack Dorsey, built a decentralized alternative. Mastodon runs on a federated protocol with no central owner. Is the future of public discourse better served by billionaire-owned platforms, decentralized protocols, or something else entirely?",
    options: [
      { id: "A", text: "Decentralized protocols — no single person or company should control the infrastructure of public conversation; Bluesky and Mastodon point the way" },
      { id: "B", text: "Billionaire ownership is bad but decentralization is worse — moderation requires resources and coordination that volunteer-run networks can't sustain at scale" },
      { id: "C", text: "Public infrastructure — the digital public square should be publicly funded and governed, like the postal service or public broadcasting, not left to markets or hobbyists" },
      { id: "D", text: "The \"public square\" metaphor is the problem — there is no single town square anymore; the future is many smaller communities with different norms, not one platform with universal rules" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2024, Google's AI Overviews — AI-generated summaries shown above search results — started replacing the need to click through to source websites. Traffic to news sites and independent creators dropped. Wikipedia co-founder Jimmy Wales warned that AI answers without attribution could \"destroy the ecosystem that produces the information AI was trained on.\" If AI can summarize everything, what happens to the people and institutions that produce the underlying knowledge?",
    options: [
      { id: "A", text: "They'll be destroyed unless revenue-sharing is mandated — AI companies are building a business on the back of others' work without paying for it; this is the music industry's Napster moment" },
      { id: "B", text: "They'll adapt — just as some musicians found new revenue models after streaming, creators and newsrooms will find new ways to monetize expertise that AI can't replicate" },
      { id: "C", text: "The knowledge ecosystem will collapse and it won't be rebuilt — once the incentive to create original reporting, research, and analysis disappears, AI will be summarizing increasingly stale and unreliable information" },
      { id: "D", text: "This is a feature, not a bug — the gatekeeping model where a few institutions controlled knowledge production was itself a problem; AI democratizes access even if it disrupts the producers" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "If AI hollows out the knowledge production ecosystem it depends on, what breaks first — and would we notice before it's too late?",
      }
    },
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Think of a belief you hold strongly. How did you arrive at it — and how would you know if it were wrong?",
    freeformOnly: true,
  },
];

export const truthMediaQuiz = {
  topic: TOPIC,
  topicLabel: "Truth & Media",
  questions: main,
  followupQuestions,
};
