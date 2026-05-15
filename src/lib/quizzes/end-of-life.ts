import type { AnyQuestion, Question } from "../types";

const TOPIC = "end_of_life";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "OK so if for-profit hospice is the villain here, the obvious fix is: just make all hospice nonprofit. Done, right?\n\nNot so fast. Nonprofits have their own failure modes. They struggle to raise capital. They pay less, so staffing is a nightmare. And huge swaths of rural America have zero nonprofit hospice providers. You've basically traded one set of problems for another.\n\nSo what's the actual model that works?",
    options: [
      { id: "A", text: "Government-run hospice, like the VA but for dying. Medicare already pays, so cut out the middleman entirely." },
      { id: "B", text: "Nonprofit hospice with guaranteed public funding, like public schools. Remove the incentive to game enrollment." },
      { id: "C", text: "Keep for-profit but regulate it brutally. The profit motive isn't the problem, the lack of enforcement is." },
      { id: "D", text: "Scrap the whole separate-hospice idea. Weave palliative care into every stage of serious illness instead." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's a number that should stop you cold.\n\nIn Canada, medically assisted deaths went from 1,018 in 2016 to over 13,000 in 2022. That's 4.1% of all Canadian deaths. One in every 25 people who died in Canada that year chose to die.\n\nMedical assistance in dying (MAID) is now legal in 10 U.S. states, D.C., Canada, the Netherlands, Belgium, Spain, Colombia, and growing. Supporters call it the ultimate expression of personal autonomy. But here's the uncomfortable part: disability rights advocates keep pointing out that when the healthcare system fails people, offering death as an \"option\" isn't freedom. It's abandonment wearing a compassionate mask.\n\nWhere do you actually land on this?",
    options: [
      { id: "A", text: "It's a fundamental right. Competent adults with terminal illness should choose when and how they die. Period." },
      { id: "B", text: "Canada proves the slope is real. Terminal illness becomes chronic pain becomes mental illness becomes disability. It keeps expanding." },
      { id: "C", text: "Right in principle, dangerous in practice. It's only ethical when palliative care and disability services are fully funded first." },
      { id: "D", text: "The autonomy framing is incomplete. When society signals some lives aren't worth supporting, \"choosing\" death isn't really a choice." },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "OK, so if the slope is real, where exactly do you draw the line, and on what principle?\n\nTerminal illness only? Unbearable physical suffering? What about someone with treatment-resistant depression who has been suffering for 20 years and has tried everything? Is there a principled place to stop, or is every line eventually arbitrary?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Americans spend roughly 25% of all Medicare dollars in the last year of life. That's over $200 billion a year. Much of it goes to aggressive ICU interventions that extend life by days or weeks.\n\nWait, really? A quarter of the entire Medicare budget?\n\nYes. And here's the thing that should make you furious: 72% of Americans say they want to die at home. Only 31% actually do. That's not a small gap. That's a canyon between what people want and what the system delivers.\n\nAtal Gawande documented this in Being Mortal. The medical system's default setting is \"treat aggressively\" even when the patient would prefer comfort. It's like a machine that doesn't have an off switch.\n\nWhat's actually driving this disconnect?",
    options: [
      { id: "A", text: "The medical system's incentives. Fee-for-service rewards intervention over conversation. Doctors are trained to treat, not to stop." },
      { id: "B", text: "Cultural denial of death. Families demand \"do everything\" because they never had the hard conversation beforehand." },
      { id: "C", text: "Both at once. The system profits from aggression AND families avoid the conversation. The dying patient is trapped between them." },
      { id: "D", text: "Inequality. Wealthy educated patients get palliative care at home. Poor patients get the ICU. The disconnect is a class divide." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Hospice care is supposed to be the answer. Comfort-focused treatment for patients expected to live six months or less. And the data is remarkable: it improves quality of life and, paradoxically, often extends survival compared to aggressive treatment. Let that land. The thing designed to help you die well actually helps you live longer.\n\nBut here's the catch. Only 47% of Medicare beneficiaries used hospice in 2022. And the median stay? Nine days. People are eligible for six months of comfort care and they get nine days.\n\nMeanwhile, private equity has discovered hospice is profitable. By 2023, for-profit hospices outnumber nonprofits. Investigations found a pattern: enroll patients who aren't actually dying (to collect daily payments) while cutting corners on patients who are.\n\nSo is hospice working, or is it broken?",
    options: [
      { id: "A", text: "The philosophy works but the incentives are broken. Hospice as a medical idea is sound. Hospice as a profit center is corrupt." },
      { id: "B", text: "Hospice is underused because doctors resist it. Admitting a patient is dying feels like failure. The problem is medical culture." },
      { id: "C", text: "The whole binary needs redesigning. The split between aggressive treatment and hospice is artificial. People need a gradual continuum." },
      { id: "D", text: "Private equity in hospice is a symptom. When profit enters any caregiving space, quality drops and vulnerable people suffer." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "About 500 people are currently frozen in liquid nitrogen, legally dead, waiting to be revived by future technology that doesn't exist yet. Several thousand more have signed up. This is cryonics.\n\nThe price tag? Somewhere between $28,000 and $200,000, mostly through Alcor Life Extension Foundation and the Cryonics Institute.\n\nNow here's what makes this genuinely interesting, not just weird. Some actual neuroscientists argue that information preservation is plausible. Your brain's connectome, the wiring diagram of who you are, might survive the freezing process. Revival is another question entirely, but the information might still be there. Mainstream science calls it pseudoscience. But \"mainstream science\" has been wrong about a lot of things that turned out to be early.\n\nIs cryonics a rational bet, an expression of privilege, or something else?",
    options: [
      { id: "A", text: "Rational bet. Any nonzero chance of revival makes the expected value positive. It's Pascal's wager with liquid nitrogen." },
      { id: "B", text: "Pseudoscience exploiting death anxiety. No evidence identity survives current freezing. It's an expensive fantasy of denial." },
      { id: "C", text: "Techno-privilege. Same worldview as billionaire longevity research and Mars colonies. Refusing human limits, available only to the rich." },
      { id: "D", text: "Harmless but revealing. What it really shows is how uncomfortable secular culture is with death and finality." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Think about this for a second. In Tibet, when someone dies, the body is carried to a mountaintop, cut open, and fed to vultures. It's called sky burial. The idea is that the body is an empty vessel now, and giving it back to living creatures is a final act of generosity.\n\nIn Ghana, people are buried in fantasy coffins shaped like airplanes, fish, or Coca-Cola bottles, celebrating who the person was in life. In Mexico, Dia de los Muertos treats death as an ongoing relationship, not an ending. Traditional Irish wakes involve drinking and storytelling with the body right there in the room.\n\nNow compare that to modern Western death. Most Americans have never seen a dead body outside a funeral home. The sociologist Philippe Aries called this \"the invisible death.\" We've made dying so clinical and hidden that most people encounter it for the first time when it's someone they love.\n\nHas something been lost?",
    options: [
      { id: "A", text: "Yes. Removing death from daily life makes it more terrifying, not less. That's why modern cultures handle grief so badly." },
      { id: "B", text: "No. Medicalization and professional death care are improvements. Romanticizing pre-modern practices ignores they reflected poverty, not wisdom." },
      { id: "C", text: "The loss is real but nostalgia isn't the answer. We need a modern death culture that integrates mortality without abandoning science." },
      { id: "D", text: "This is a class and culture question. Immigrant, religious, and rural communities still have rich death practices. Invisible death is affluent and secular." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Four thinkers walk into a bar. (Stay with me.)\n\nEpicurus, 2,300 years ago, said death is nothing to us. When death exists, we don't, and when we exist, death doesn't. So what exactly are you afraid of?\n\nShelly Kagan at Yale says death is bad because it deprives you of future good experiences. That's it. The badness of death is just the good stuff you'll miss.\n\nHeidegger, the existentialist, argued the opposite of Epicurus. Awareness of death is what gives life meaning. Without it, you'd never get serious about anything. You need the deadline (literally) to live authentically.\n\nThen Terror Management Theory came along and said: actually, most of human culture, your religions, your monuments, your children, your ambitions, is an elaborate defense mechanism against the terror of knowing you'll die.\n\nWhich of these comes closest to how you actually experience your own mortality? Not what sounds smart. What feels true.",
    options: [
      { id: "A", text: "Deprivation. Death is bad because it takes away a future I want. The fear is rational and proportional to what I'll lose." },
      { id: "B", text: "Epicurean. Intellectually, death isn't experienced. The anxiety is imagining absence, a cognitive error, not a real threat." },
      { id: "C", text: "Existentialist. Mortality gives life urgency and meaning. Without death, nothing would matter. The awareness is painful but essential." },
      { id: "D", text: "Terror Management. Most of what I do is probably death avoidance wearing different masks. I see it but can't escape it." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and it's personal.\n\nIf you could design your own death, the whole thing, timing, setting, who's present, how aware you are, what would it look like?\n\nDon't rush this. What you describe will reveal something about what you think a good death actually is. And that, in turn, reveals something about what you think a good life is.",
    freeformOnly: true,
  },
];

export const endOfLifeQuiz = {
  topic: TOPIC,
  topicLabel: "How Should a Life End?",
  questions: main,
  followupQuestions,
};
