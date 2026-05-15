import type { AnyQuestion, Question } from "../types";

const TOPIC = "consciousness";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q5a: {
    id: "q5a",
    topic: TOPIC,
    text: "OK so here\'s the thing that should bug you about this.\n\nWestern philosophy treats individual, self-reflective consciousness as the pinnacle. The whole tradition basically says: \"I think, therefore I am\" is the starting line.\n\nBut Buddhist traditions treat dissolving the self as the *goal*, not the problem. Indigenous ontologies often locate consciousness in relationships and place, not in a single skull. These aren\'t primitive attempts at what the West got right. They\'re fundamentally different maps of the territory.\n\nSo what does that actually imply?",
    options: [
      { id: "A", text: "It implies humility. The Western model of isolated self-awareness might be a local phenomenon, not a universal truth." },
      { id: "B", text: "It implies very little. Acknowledging cultural variation doesn\'t make all frameworks equally valid or scientifically useful." },
      { id: "C", text: "It suggests the modern \"meaning crisis\" is partly a consciousness crisis. We built powerful but isolating self-awareness." },
      { id: "D", text: "It means the hard problem might be a Western problem. No mind-matter split, no mystery to solve." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here\'s something that should bother you more than it probably does.\n\nRight now, billions of neurons in your head are firing in precise patterns. Neuroscience can map exactly which regions light up when you stub your toe. We can watch it happen in real time on a brain scanner. Beautiful data.\n\nBut here\'s the part nobody can explain: why does it *feel* like something? Why isn\'t all that neural processing just... processing? Like a thermostat reacting to temperature, but with nobody home?\n\nDavid Chalmers called this the \"hard problem\" in 1995. Since then we\'ve spent billions on research. We have competing theories from quantum physics, information theory, neuroscience. And we still have no consensus on what consciousness even *is*.\n\nWait, really. Think about that. We\'ve mapped the human genome. We\'ve photographed black holes. And we cannot explain why you experience anything at all.\n\nDoes this matter?",
    options: [
      { id: "A", text: "Yes, it\'s the most important unsolved problem. Without it we can\'t answer basic ethics about AI or animals." },
      { id: "B", text: "Not practically. Medicine and AI can keep progressing without a grand theory of subjective experience." },
      { id: "C", text: "The hard problem might be a conceptual confusion. Explain all the functions and there\'s nothing left over." },
      { id: "D", text: "It matters because the answer sets the size of our moral universe. Widespread consciousness means widespread suffering." },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "OK but think about this for a second. If qualia aren\'t real and subjective experience is just an illusion... whose illusion is it?\n\nDoesn\'t the very existence of someone being *fooled* already require the consciousness you\'re trying to explain away? It\'s like saying \"nobody is home\" while someone answers the door.",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2022, a Google engineer named Blake Lemoine got fired for telling the world that LaMDA, Google\'s chatbot, was sentient. Most AI researchers rolled their eyes.\n\nBut here\'s what makes this interesting. The chatbots keep getting better. They pass Turing tests. They express preferences. They model emotions with enough nuance to fool therapists.\n\nAnd we have *no agreed-upon method* for detecting consciousness in anything that isn\'t a human brain. Philosopher Susan Schneider proposed a \"consciousness test\" based on self-awareness, but nobody can agree on whether it actually works.\n\nThink about the scale of this. We\'re building systems that process information in ways that look more and more like thinking, and we literally do not have a tool to check whether the lights are on inside.\n\nCould an AI be conscious?",
    options: [
      { id: "A", text: "Possibly. If consciousness comes from information processing, biological neurons might not be the only way to get there." },
      { id: "B", text: "No. Current AI shuffles symbols without understanding them. Searle\'s Chinese Room argument still holds up." },
      { id: "C", text: "We genuinely can\'t know. We can\'t even prove other humans are conscious with certainty, let alone machines." },
      { id: "D", text: "The real question isn\'t capability but obligation. If there\'s a reasonable chance, we should act like it might be." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Try this experiment right now. Decide to wiggle your finger. Go ahead, do it.\n\nFelt like you chose that, right? Here\'s the problem.\n\nIn the 1980s, neuroscientist Benjamin Libet measured brain activity during simple decisions like that. The brain\'s \"readiness potential\" fires about 350 milliseconds *before* you report being aware of the decision. Your brain started the process before \"you\" decided anything.\n\nWait, it gets worse. More recent studies by John-Dylan Haynes using fMRI found brain activity that predicted a decision up to *10 seconds* before the person felt like they\'d chosen. Ten seconds. That\'s not a rounding error. That\'s your brain making the call and then sending you a memo about it afterward.\n\nSam Harris says this proves free will is an illusion. Daniel Dennett says the kind of free will worth wanting is compatible with all of this.\n\nDo you have free will?",
    options: [
      { id: "A", text: "No. The neuroscience is clear. What we call \"choice\" is the brain observing what it already decided." },
      { id: "B", text: "Yes. Those experiments measure finger twitches, not complex moral reasoning. That\'s not where free will lives." },
      { id: "C", text: "The question is confused. \"Uncaused cause\" is incoherent, but real deliberation and responsiveness to reasons still exist." },
      { id: "D", text: "Whether it exists matters less than whether believing in it matters. The belief might outweigh the metaphysics." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here\'s an idea that sounds crazy until you think about it carefully. Then it sounds crazier. Then it starts to sound... weirdly reasonable?\n\nPanpsychism says consciousness isn\'t something that magically appears when brains get complex enough. It\'s a fundamental feature of all matter. Every electron, every atom, every grain of sand has some tiny flicker of experience.\n\nPhilosopher Philip Goff argues this is actually the *most* promising solution to the hard problem. Physicist Andrei Linde has suggested consciousness might be as fundamental as space and time.\n\nCritics call it unfalsifiable mysticism with a philosophy degree.\n\nBut think about the alternative. If consciousness is \"emergent,\" you need to explain the exact moment when a pile of unconscious atoms suddenly starts having experiences. Where\'s the line? Nobody can point to it.\n\nIf everything has some form of experience, what would that mean for how we live?",
    options: [
      { id: "A", text: "It would radically expand our moral circle. Ethical obligations would extend far beyond the beings we currently consider." },
      { id: "B", text: "Very little practically. An electron\'s \"experience\" is so alien to ours that calling it the same thing is misleading." },
      { id: "C", text: "Panpsychism is appealing but scientifically empty. Making everything conscious explains nothing. It just relabels the mystery." },
      { id: "D", text: "It would change our self-understanding. If consciousness is fundamental, the materialist worldview is missing something essential." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 1976, psychologist Julian Jaynes published one of the strangest serious books ever written. His argument: human consciousness as we know it is only about 3,000 years old.\n\nBefore that, he claimed, people experienced their own thoughts as the literal voices of gods. The \"bicameral mind\" had two chambers: one that spoke, one that obeyed. No inner monologue. No sense of \"I\" making decisions.\n\nMost scholars reject the specifics. But the broader point has quietly gained traction. Anthropologist Clifford Geertz showed that concepts of selfhood vary radically across cultures. Some cultures don\'t experience a hard boundary between self and world. Some don\'t have a concept of individual memory the way Westerners do.\n\nWait, really sit with this. What if the way you experience being \"you\" right now is not a universal human thing, but something your culture taught your brain to do?\n\nIs consciousness universal, or is our version of it a cultural product?",
    options: [
      { id: "A", text: "Universal in its biology. All human brains produce experience. Culture shapes the content but not the fact of it." },
      { id: "B", text: "Culturally variable in important ways. How people experience selfhood and time differs so much that one word flattens it." },
      { id: "C", text: "The question reveals the limits of introspection. We can\'t step outside our own cultural framework to see consciousness raw." },
      { id: "D", text: "Jaynes was wrong on the timeline but right on the insight. Self-reflective consciousness develops. It\'s an achievement, not a given." },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q5a" }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "In 2023, researchers at the University of Texas did something that sounds like science fiction. They decoded continuous language from brain activity using AI. Not word by word. Whole sentences, flowing in real time, pulled from the electrical patterns in someone\'s head.\n\nThat\'s remarkable. But here\'s the part that should keep you up at night.\n\nNeurologist Adrian Owen has been scanning patients diagnosed as \"vegetative\" for years. People the medical system classified as essentially gone. And up to 20% of them showed clear signs of conscious awareness on fMRI. One in five. They were in there. Listening. Unable to respond.\n\nThink about the scale of that. Across all the hospitals, all the care facilities, all the families who said goodbye to someone who might still have been present.\n\nAs brain-reading technology gets better and cheaper, what are the real stakes?",
    options: [
      { id: "A", text: "The biggest stake is locked-in patients. Detecting consciousness in people we\'ve written off is a moral emergency happening now." },
      { id: "B", text: "Privacy. If thoughts can be decoded, cognitive liberty is at risk. Your mind might be the last private space left." },
      { id: "C", text: "The stakes are philosophical. Reading brain activity without knowing if it\'s \"experience\" forces us to define consciousness." },
      { id: "D", text: "The technology will show consciousness is a spectrum, not a switch. Our legal and ethical frameworks aren\'t built for that." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and this is just for you.\n\nForget the theories and the research papers for a second. What\'s the thing about your own consciousness that genuinely puzzles you? The way you experience the world, think, remember, dream, perceive. What part of it feels strangest or most unexplained when you really stop and look at it?",
    freeformOnly: true,
  },
];

export const consciousnessQuiz = {
  topic: TOPIC,
  topicLabel: "Are You Sure You're Conscious?",
  questions: main,
  followupQuestions,
};
