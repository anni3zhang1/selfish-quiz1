import type { AnyQuestion, Question } from "../types";

const TOPIC = "gun_rights";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q2a: {
    id: "q2a",
    topic: TOPIC,
    text: "So here's how red flag laws actually work. A family member or a cop petitions a judge, the judge reviews the evidence, and if there's a credible risk, firearms get temporarily removed. No criminal charge required.\n\nAs of 2024, 21 states have these laws. The research shows they're associated with fewer gun suicides. That's the upside.\n\nBut wait. You're taking someone's property before they've had their day in court. That's the kind of thing the Bill of Rights was specifically written to prevent.\n\nIs due process being adequately protected here?",
    options: [
      { id: "A", text: "Yes, this works like restraining orders in domestic violence cases, same judicial standard applied" },
      { id: "B", text: "No, seizing property before someone is heard in court violates fundamental constitutional protections" },
      { id: "C", text: "The concept is sound but implementation varies wildly, some states protect rights, others don't" },
      { id: "D", text: "A temporary, reversible removal with judicial oversight beats the alternative of a dead person" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Let's start with two things that happened in the same year. Both are true. Both are hard to hold in the same hand.\n\nIn 2022, the U.S. had 647 mass shootings (that's the Gun Violence Archive count: 4 or more people shot in one incident). Gun deaths hit their highest level in decades. Over 48,000 people.\n\nThat same year, the Supreme Court's Bruen decision struck down New York's 100-year-old concealed carry permit law. Justice Thomas wrote the opinion. The new rule? Any gun regulation has to have a historical analogue from the founding era to be constitutional.\n\nThink about that for a second. The legal test for whether you can regulate a modern semi-automatic rifle is whether the Founders would have recognized something similar in 1791. When the deadliest weapon was a musket that took 20 seconds to reload.\n\nIs the constitutional framework itself the problem?",
    options: [
      { id: "A", text: "Yes, the Second Amendment was written for muskets and militias, stretching it to cover modern arsenals makes rational policy impossible" },
      { id: "B", text: "No, the right is fundamental, the real failures are in enforcement, mental health infrastructure, and cultural breakdown" },
      { id: "C", text: "The framework can work if the Court stops using Bruen's bizarre historical analogue test, the Second Amendment and regulation can coexist" },
      { id: "D", text: "The constitutional debate is a distraction, Switzerland and Canada have guns and manage regulation without constitutional crises" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "Interesting. But here's the puzzle.\n\nThe U.S. already spends more per capita on enforcement and mental health than most peer countries. And still has 20x the gun death rate.\n\nSo if it's not the legal framework, what specifically would change the outcome?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Here's a number that rewires the entire gun debate once you see it.\n\nTwo-thirds of U.S. gun deaths are suicides. Over 27,000 in 2022. Homicides were roughly 20,000.\n\nWait, really? The majority of gun deaths aren't from mass shootings or street violence?\n\nNope. Harvard's Matthew Miller found that access to a gun triples your suicide risk. And here's the part that really gets you: most gun suicide attempts are preceded by less than 10 minutes of deliberation. Ten minutes. That's the gap between impulse and irreversibility.\n\nAnd yet the entire national gun conversation is about mass shootings and homicides. The thing that kills the most people is barely in the debate.\n\nShould suicide prevention reshape the gun policy conversation?",
    options: [
      { id: "A", text: "Yes, suicide is the majority of gun deaths, and even small barriers like waiting periods save real lives" },
      { id: "B", text: "No, suicide needs mental health solutions, not firearm restrictions, don't take rights from many for the few" },
      { id: "C", text: "It should but won't, fear of violence drives political energy, private self-harm doesn't generate the same urgency" },
      { id: "D", text: "The suicide data actually reframes everything, the core problem isn't gun violence, it's despair and a broken safety net" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q2a" }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Imagine two Americas. They're both real. They exist simultaneously.\n\nIn rural Montana, a rancher keeps a rifle to protect her livestock from coyotes. The nearest police station is 45 minutes away. Her gun is a tool, like a tractor or a fence. Sociologist Jennifer Carlson's research shows that for many rural Americans, gun ownership is about self-reliance and community identity. It's not ideology. It's Tuesday.\n\nNow picture downtown Chicago. Guns are overwhelmingly associated with homicide, armed robbery, mass shootings. A gun in that context isn't a tool. It's a threat.\n\nSame object. Completely different meaning. Completely different risk profile.\n\nIs it possible to have a gun policy that respects both realities?",
    options: [
      { id: "A", text: "Yes, differentiated policy is the answer, what works in rural Montana shouldn't be forced on downtown Chicago" },
      { id: "B", text: "No, rights can't vary by zip code, the Second Amendment has to mean the same thing everywhere" },
      { id: "C", text: "The divide is overstated, background checks and waiting periods are compatible with rural life, the opposition is cultural" },
      { id: "D", text: "The divide is manufactured, the gun lobby exploits rural identity to block policies most rural owners actually support" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "This is one of those histories that, once you learn it, you can't unlearn it.\n\nIn the 1960s, the Black Panthers started doing armed patrols of Oakland police. Perfectly legal open carry. California's Republican governor at the time? Ronald Reagan. He signed the Mulford Act and banned open carry. Armed Black citizens made the law change overnight.\n\nFast forward to 2016. Philando Castile, a licensed gun owner, gets pulled over. He calmly tells the officer he has a legal firearm. The officer shoots and kills him.\n\nStanford economists found that \"stand your ground\" laws are applied more favorably to white defendants than Black defendants.\n\nSo here's the question that doesn't go away: does the Second Amendment protect everyone equally?",
    options: [
      { id: "A", text: "No, the history is clear, armed Black people are treated as threats while armed white people are treated as patriots" },
      { id: "B", text: "The right is equal on paper but enforcement isn't, that's a policing problem, not a Second Amendment problem" },
      { id: "C", text: "The disparity reveals something deeper, gun rights in America were designed for white citizens and never fully expanded" },
      { id: "D", text: "This is exactly why gun control can become racial oppression, disarmament laws have historically targeted Black communities" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "After Uvalde, 19 children and 2 teachers were killed. Police waited 77 minutes to enter the classroom. Seventy-seven minutes.\n\nThen Congress did something it hadn't done in nearly 30 years. It passed a gun bill. The Bipartisan Safer Communities Act. Enhanced background checks for buyers under 21. Funded state crisis intervention. Closed the \"boyfriend loophole\" for domestic violence.\n\nFifteen Republican senators voted for it. That's the headline.\n\nBut here's the fine print: it didn't ban any weapon. Didn't raise the purchasing age. Didn't mandate universal background checks.\n\nGun control advocates called it a Band-Aid on a bullet wound. Gun rights advocates called it government overreach. Both were angry.\n\nWas the compromise worth it?",
    options: [
      { id: "A", text: "Yes, any forward movement breaks the political logjam and creates precedent, perfect is the enemy of good" },
      { id: "B", text: "No, after children were massacred the country produced a half-measure and called it historic, that normalized inadequacy" },
      { id: "C", text: "Worth it for the signal, not the substance, proving bipartisan gun legislation is possible matters more than this bill's specifics" },
      { id: "D", text: "The real story is what the system can't do, 19 dead children and this is the best the most powerful country could manage" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "That's the gut punch, isn't it?\n\nIf the political system structurally cannot produce meaningful gun legislation even after 19 children die in a single classroom, then maybe the path doesn't run through Congress at all.\n\nWhat else could actually work?",
      }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Here's a technology problem that's about to eat the entire gun debate alive.\n\n3D-printed firearms. Ghost guns. No background check. No serial number. The ATF recovered over 25,000 of them at crime scenes in 2022. In 2018 that number was fewer than 4,000. That's a 6x increase in four years.\n\nMeanwhile, a guy named Cody Wilson published downloadable gun designs online and argued it's a First Amendment issue. Free speech. The right to share information.\n\nThink about what's happening here. The entire regulatory framework assumes guns come from manufacturers, flow through dealers, and get tracked with serial numbers. But what happens when anyone with a $300 printer can make one in their garage?\n\nIs traditional gun regulation becoming obsolete?",
    options: [
      { id: "A", text: "Yes, you can't regulate what anyone can print at home, policy needs to shift from controlling objects to addressing behavior" },
      { id: "B", text: "No, 3D-printed guns are unreliable and rare, the vast majority of violence uses commercial weapons that are absolutely regulable" },
      { id: "C", text: "Harder but not obsolete, we regulate drugs despite home chemistry labs, ghost guns can be managed through component controls" },
      { id: "D", text: "This proves what gun rights advocates always said, determined people will arm themselves, focus on why people commit violence" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Okay. Last one. And this is the fun one.\n\nForget what's politically possible. Forget the Second Amendment. Forget every existing law. You're starting from a blank slate.\n\nIf you could design gun policy for the United States from scratch, what would it look like?",
    freeformOnly: true,
  },
];

export const gunRightsQuiz = {
  topic: TOPIC,
  topicLabel: "The Gun Equation",
  questions: main,
  followupQuestions,
};
