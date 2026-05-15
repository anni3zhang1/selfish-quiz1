import type { AnyQuestion, Question } from "../types";

const TOPIC = "us_foreign_policy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "Okay, so you said genocide justifies intervention. But here's the thing that should bother you.\n\nThe U.S. has been remarkably selective about which genocides it actually responds to. The Rohingya genocide in Myanmar (2017). The Uyghur detention camps in China (ongoing since 2017). The Darfur genocide in Sudan (2003 to 2008). All of them got limited or zero military response.\n\nSo the real question isn't whether genocide justifies intervention. It's: what determines which mass atrocities get cruise missiles and which ones get a press release expressing deep concern?",
    options: [
      { id: "A", text: "Strategic interest, plain and simple. The U.S. acts where it gains something. That's realism, not hypocrisy." },
      { id: "B", text: "Feasibility matters. Confronting nuclear-armed China is categorically different from bombing Libya. Capability limits morality." },
      { id: "C", text: "Media coverage and domestic politics. Atrocities that dominate the news create pressure to act. The rest get ignored." },
      { id: "D", text: "The selectivity proves the whole framework is broken. A 'duty to protect' that only targets weak states is imperialism rebranded." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2026, the U.S. launched airstrikes against Iranian nuclear facilities. The backstory: months of escalation, Iranian-backed attacks killing American service members at bases in Iraq and Syria, and the IAEA confirming Iran had enriched uranium to near-weapons-grade levels.\n\nSupporters called it a necessary act of prevention. Critics called it an illegal act of war launched without congressional authorization.\n\nHere's what makes this so tricky. The last time Congress formally declared war was 1942. Every military action since then has been the executive branch deciding on its own. So when someone says 'justified,' the question is: justified by what authority, exactly?",
    options: [
      { id: "A", text: "When there's an imminent threat. Preemptive strikes against nuclear-capable adversaries are justified. Waiting is too dangerous." },
      { id: "B", text: "Only with congressional authorization. The president using force alone is a constitutional violation, regardless of the threat." },
      { id: "C", text: "Only with international consensus. Unilateral strikes, however domestically popular, undermine the order that prevents bigger wars." },
      { id: "D", text: "Almost never. The track record since 1950 shows U.S. intervention reliably makes things worse. The bar should be enormous." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "Wait, really? The exact same 'imminent threat' logic justified the 2003 Iraq invasion, and they found zero weapons of mass destruction.\n\nSo what's the standard of evidence that would satisfy you before a preemptive strike? And here's the harder part: who gets to check that evidence? Because the last time, the people checking were the same people who wanted the war.",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Let's talk about what a mistake actually costs at this scale.\n\nThe 2003 Iraq War: over $2 trillion spent. An estimated 300,000+ Iraqi civilians killed. The entire Middle East destabilized. And out of the wreckage, ISIS was born. The intelligence justifying the invasion? Fabricated or exaggerated.\n\nBut here's the part that should really unsettle you. In 2003, 72% of Americans supported the war. Nearly three out of four people thought it was a good idea.\n\nTwenty years later, a Brown University study added it all up. The post-9/11 wars collectively cost $8 trillion and displaced 38 million people. That's roughly the entire population of Canada, uprooted. What's the most important lesson from all of this?",
    options: [
      { id: "A", text: "Intelligence failures need real consequences. Nobody was fired or prosecuted for fabricating the case. Without accountability, it repeats." },
      { id: "B", text: "Public opinion doesn't justify war. Democracies can be manipulated into catastrophic decisions. Institutional checks must be stronger than polls." },
      { id: "C", text: "The lesson is simpler than people think. Regime change doesn't work. The U.S. is terrible at nation-building and should stop trying." },
      { id: "D", text: "Iraq wasn't a bug, it was a feature. The military-industrial complex and oil interests got exactly what they wanted." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Three stories. Same question. Totally different outcomes.\n\nRwanda, 1994. 800,000 people massacred in 100 days. The U.S. and UN did nothing. Not 'too little.' Nothing.\n\nLibya, 2011. NATO intervened under the 'Responsibility to Protect' doctrine. Gaddafi was overthrown. Then Libya descended into a decade of civil war and became one of the world's worst hubs for human trafficking.\n\nSyria. The U.S. drew a 'red line' on chemical weapons. Assad crossed it. And... nothing happened.\n\nSo when someone says 'we have a humanitarian obligation to intervene,' the honest response is: do we? Because the track record suggests we either don't show up, or we show up and make it worse. When does humanitarian obligation actually override sovereignty?",
    options: [
      { id: "A", text: "When genocide is happening or imminent. Rwanda proves the cost of inaction is unconscionable. Sovereignty doesn't include mass slaughter." },
      { id: "B", text: "Almost never. Libya proves that 'saving lives' interventions reliably create more suffering than they prevent. Good intentions aren't enough." },
      { id: "C", text: "Only with a credible plan for what comes after. The failure isn't intervention itself but refusing to commit to reconstruction." },
      { id: "D", text: "The premise is wrong. The U.S. intervenes when strategic interests align with humanitarian language and ignores atrocities when they don't." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here's a number that should stop you cold.\n\nThe U.S. defense budget for 2024 was $886 billion. That's more than the next ten countries combined. Meanwhile, the State Department, the entire apparatus of American diplomacy, got roughly $60 billion. The ratio is about 15 to 1, military to diplomacy.\n\nAnd the U.S. maintains over 750 military bases in at least 80 countries. Think about that for a second. 750 bases. The Roman Empire at its peak had maybe 40 major legionary fortresses.\n\nHistorian Andrew Bacevich argues America has become addicted to militarism at the expense of diplomacy. Defense scholar Elbridge Colby argues the opposite: military dominance is what keeps the peace.\n\nIs the current balance right?",
    options: [
      { id: "A", text: "No, the ratio is absurd. Shifting even 10% from defense to diplomacy and conflict prevention would make America safer." },
      { id: "B", text: "Yes. Hard power underwrites soft power. Diplomacy works because military force backs it up. Cutting defense invites aggression." },
      { id: "C", text: "The budget question is a distraction. The real issue is strategy. You can spend $886 billion wisely or foolishly." },
      { id: "D", text: "The military budget is industrial policy disguised as security. It exists because defense contractors employ people in every congressional district." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Between 2004 and 2023, the U.S. conducted over 14,000 drone strikes across Pakistan, Yemen, Somalia, Libya, and other countries. Estimated dead: 10,000 to 17,000 people, including up to 2,200 civilians according to the Bureau of Investigative Journalism.\n\nBut wait, really think about what a drone strike is. Someone sits in an air-conditioned room in Nevada, watches a screen, pushes a button, and a family on the other side of the planet ceases to exist. Then they drive home and have dinner.\n\nIn 2021, a U.S. drone strike in Kabul during the Afghanistan withdrawal killed 10 civilians, including 7 children. The military initially called it a 'righteous strike.' An investigation later found the target was an aid worker. Nobody was disciplined.\n\nIs drone warfare morally different from conventional war?",
    options: [
      { id: "A", text: "It's more moral. Drones allow precision targeting with fewer casualties. The alternative, ground troops, kills far more people." },
      { id: "B", text: "It's less moral. When killing costs nothing politically (no body bags), there's no democratic check on who gets killed." },
      { id: "C", text: "The technology is neutral. The moral question is the same as any force: legitimate target, reliable intelligence, proportionate harm." },
      { id: "D", text: "Drone warfare is assassination policy. The U.S. executes people in sovereign nations without trial, often without knowing who they are." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Here's a pattern that should make you uncomfortable.\n\nSince World War II, the U.S. has fought a major war roughly every 15 years. Korea. Vietnam. The Gulf War. Afghanistan. Iraq. Each one was justified differently. But each one followed the same arc: inflate the threat, ride the wave of public support, get bogged down, eventually withdraw without achieving the original objectives.\n\nGeorge Kennan, the architect of Cold War containment strategy, warned about this back in 1948. He said America would struggle with the tension between its democratic values and its imperial responsibilities. That a democracy cannot run an empire without the empire corrupting the democracy.\n\nThat was almost 80 years ago. Was he right?",
    options: [
      { id: "A", text: "Yes. The U.S. can't sustain patient long-term strategy. Democracy and empire are fundamentally incompatible, and the pattern proves it." },
      { id: "B", text: "No. The pattern is real but it's political, not structural. Better leadership and institutions can break the cycle." },
      { id: "C", text: "Wrong framing. These were failures of accountability, not democracy. The system didn't self-correct because costs fell on other countries and the poor." },
      { id: "D", text: "Kennan's real insight was about restraint. The U.S. should balance power, not crusade. The problem is the impulse to remake the world." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last question, and it's all yours.\n\nIf you could permanently change one thing about how the U.S. decides to use military force, what would it be? A law. A norm. An institution. A requirement. Anything.\n\nWhat's the single change that would do the most good?",
    freeformOnly: true,
  },
];

export const usForeignPolicyQuiz = {
  topic: TOPIC,
  topicLabel: "When Should America Intervene?",
  questions: main,
  followupQuestions,
};
