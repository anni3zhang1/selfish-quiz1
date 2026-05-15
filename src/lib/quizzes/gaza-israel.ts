import type { AnyQuestion, Question } from "../types";

const TOPIC = "gaza_israel";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here are the numbers. On October 7, 2023, Hamas fighters crossed into southern Israel and killed roughly 1,200 people. 364 of them were at a music festival. Over 250 were taken hostage.\n\nIsrael's military response in Gaza, by early 2025, had killed over 45,000 Palestinians (per Gaza's Health Ministry), displaced about 1.9 million people, and leveled an estimated 60% of Gaza's buildings. The International Court of Justice ruled it plausible that Israel was committing genocide.\n\nSo here's the thing that makes this so hard. Both of those paragraphs are true at the same time. How do you hold them together?",
    options: [
      { id: "A", text: "Israel has every right to respond, but the scale of civilian death has crossed into collective punishment" },
      { id: "B", text: "Hamas embeds in civilian areas on purpose, so moral responsibility for civilian deaths falls on them" },
      { id: "C", text: "Both framings are true and neither is sufficient. Picking one side means ignoring one set of dead people" },
      { id: "D", text: "You can't isolate October 7. It's the latest eruption in 75 years of occupation, displacement, and denied statehood" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "That's a real argument, and it matters. But international humanitarian law says something interesting here: even when an enemy uses human shields, the attacking force still has to minimize civilian casualties.\n\nOver 15,000 children have been killed. At what point does the 'human shields' explanation stop absorbing the moral weight of those numbers?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Let's talk about the two-state solution. It's been the official international answer since Oslo in 1993. Over 140 countries now recognize Palestine.\n\nBut wait, look at what's actually happened on the ground. Israel has expanded settlements in the West Bank to over 700,000 settlers. Gaza has been under blockade since 2007. Former Israeli PM Ehud Olmert called the two-state solution 'dead.' The Palestinian Authority president called it 'meaningless without Jerusalem.'\n\nSo you've got the entire diplomatic world pointing at a map and saying 'here, two states,' while the physical territory keeps getting carved up. Is two states still a real option, or is it a polite fiction everyone repeats because nobody has a better one?",
    options: [
      { id: "A", text: "Yes, it's the only path to self-determination for both peoples. The obstacles are political, not geographic" },
      { id: "B", text: "No. Settlements have made a contiguous Palestinian state physically impossible. It's a diplomatic ghost" },
      { id: "C", text: "Two states may be impractical, but one democratic state is even harder given current hatred and distrust" },
      { id: "D", text: "Neither formula matters until you fix the power gap. Any plan ignoring military dominance is rearranging chairs" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Here's a number worth sitting with: $3.8 billion. That's how much U.S. military aid flows to Israel every year under a 10-year deal signed in 2016.\n\nDuring the Gaza campaign, the Biden administration approved additional arms transfers while simultaneously calling for restraint. Think about that for a second. Sending weapons and asking for restraint at the same time.\n\nIn 2024, the International Criminal Court issued arrest warrants for both Hamas leaders and Israeli PM Netanyahu for alleged war crimes.\n\nShould U.S. military aid come with conditions tied to international humanitarian law?",
    options: [
      { id: "A", text: "Yes. Unconditional aid makes the U.S. complicit. Conditioning it is the strongest available leverage" },
      { id: "B", text: "No. Israel faces real existential threats. Conditioning aid undermines a democratic ally's self-defense" },
      { id: "C", text: "Restrict offensive weapons and settlement support, but keep defensive systems like Iron Dome. The distinction matters" },
      { id: "D", text: "The debate is performative. No administration will cut aid. The domestic political cost is too high. This is about lobbying, not policy" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "This one gets tangled fast, so let's be precise.\n\nIn 2024, pro-Palestinian campus encampments demanded university divestment from Israel. Jewish students reported feeling unsafe. The ADL recorded a 360% spike in antisemitic incidents.\n\nAt the same time, the State Department's official definition of antisemitism (the IHRA definition) includes this: 'claiming that the existence of a State of Israel is a racist endeavor.' Critics argue that folds political criticism of a government into hatred of a people. Supporters argue that denying Jewish self-determination while granting it to everyone else is itself a form of bigotry.\n\nBoth of those arguments have force. Where do you draw the line between criticizing Israeli policy and antisemitism?",
    options: [
      { id: "A", text: "They're distinct. Criticizing a state's policies is political speech. Conflating it with antisemitism silences legitimate dissent" },
      { id: "B", text: "They're deeply linked. Denying Jewish self-determination while supporting it for others is a double standard that functions as antisemitism" },
      { id: "C", text: "The line is real but context-dependent. 'From the river to the sea' means different things to different speakers" },
      { id: "D", text: "The definitional fight is a distraction. While people argue labels, Palestinians are being killed. The debate serves avoidance" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Amnesty International, Human Rights Watch, and B'Tselem (an Israeli human rights organization) have all published reports concluding that Israel's treatment of Palestinians meets the legal definition of apartheid.\n\nIsrael and its supporters reject the label entirely. Their argument: Arab citizens of Israel vote, serve in parliament, sit on the Supreme Court. That's fundamentally different from South Africa.\n\nBut here's where it gets complicated. The West Bank operates under a different legal system than Israel proper. Palestinians there live under military law while settlers next door live under Israeli civil law. Same hilltop, different rights.\n\nSouth Africa filed the genocide case at the ICJ, explicitly drawing the apartheid parallel. Does the framework fit?",
    options: [
      { id: "A", text: "Yes. Two populations under one authority with systematically different rights is the definition, regardless of the label" },
      { id: "B", text: "No. Israel is a democracy with Arab citizens in parliament. The South Africa analogy erases real differences" },
      { id: "C", text: "Partially. Conditions in the West Bank resemble apartheid even if Israel proper doesn't. The territory distinction matters" },
      { id: "D", text: "The legal label matters less than the reality. Millions live under military occupation with no political rights" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "By early 2025, over 2 million people in Gaza faced famine conditions according to the UN. Let that scale land for a second. That's roughly the population of Houston, and nearly every single person needs food aid to survive.\n\nAid deliveries were blocked or severely restricted. UNRWA, the main agency serving Palestinian refugees, was defunded by multiple countries after Israel alleged some employees participated in October 7. Hospitals were destroyed or non-functional.\n\nInternational humanitarian organizations called it the worst aid crisis on Earth.\n\nWhat does the world actually owe here?",
    options: [
      { id: "A", text: "An absolute obligation. Failing to protect civilians in wartime undermines the entire post-WWII legal order" },
      { id: "B", text: "A limited one. Aid should flow, but outsiders can't dictate the terms of a war with a designated terrorist group" },
      { id: "C", text: "The obligation exists but the tools don't. The U.S. veto paralyzes the UN. The ICC can't enforce. It's aspiration, not law" },
      { id: "D", text: "Humanitarian aid treats symptoms. The real obligation is ending the political conditions that trapped 2 million people with nowhere to go" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last question, and it's the hardest one.\n\nForget what's politically feasible for a moment. Forget what any government would agree to. Just think about what would actually be right.\n\nWhat would a just and lasting resolution to this conflict require? Be as specific as you can.",
    freeformOnly: true,
  },
];

export const gazaIsraelQuiz = {
  topic: TOPIC,
  topicLabel: "75 Years, No Answer",
  questions: main,
  followupQuestions,
};
