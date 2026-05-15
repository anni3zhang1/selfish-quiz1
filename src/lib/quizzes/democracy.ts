import type { AnyQuestion, Question } from "../types";

const TOPIC = "democracy";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "OK so here's the thing about the Senate and \"minority protection.\"\n\nThe current Senate massively overrepresents white, rural, conservative voters and underrepresents urban, diverse populations. That's just the math.\n\nSo when someone says the Senate exists to protect minorities... wait, which minorities exactly? Is this the kind of minority protection the founders had in mind?",
    options: [
      { id: "A", text: "Actually yes, the founders designed the Senate to shield small states from big commercial cities, and that's what it does" },
      { id: "B", text: "No, they meant to protect states as political units, not demographic groups; the racial skew is an unintended distortion" },
      { id: "C", text: "The founders also protected slaveholders and excluded women, so \"what they wanted\" isn't a moral argument anymore" },
      { id: "D", text: "This proves the system got captured; \"minority protection\" should mean shielding the vulnerable, not the overrepresented" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's a number that should stop you cold: global freedom has declined for 18 consecutive years. Eighteen. That's not a blip. That's a trend line with its own career.\n\nHungary got reclassified as \"partly free.\" India is facing accusations of democratic backsliding. In the U.S., confidence in elections has cratered to historic lows.\n\nBut wait, really? While all that's happening, China lifted 800 million people out of poverty without free elections. Their GDP outgrew every democracy's for 30 years running.\n\nSo what's actually going on here? Is democracy dying, or is it just going through an awkward phase?",
    options: [
      { id: "A", text: "It's dying. Strongmen, polarization, and corporate capture are hollowing out democratic institutions worldwide and the trend is alarming" },
      { id: "B", text: "It's evolving. Democracy has always been messy and cyclical; institutions are more resilient than the headlines suggest" },
      { id: "C", text: "The crisis is real but misdiagnosed. People aren't rejecting self-governance, they're rejecting a system that stopped delivering economically" },
      { id: "D", text: "Democracy was always the exception, not the default. The real question is whether shared prosperity and institutional trust can be rebuilt" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "Follow that thread for a second. If the crisis is about economic delivery, does that mean a democracy producing inequality is less legitimate than an authoritarian system delivering prosperity?\n\nThat's a genuinely uncomfortable place to end up. Where does that logic take you?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Philosopher Jason Brennan divides voters into two groups: \"hobbits\" (checked out and uninformed) and \"hooligans\" (fired up but deeply biased). His proposal? Epistocracy. Rule by the knowledgeable.\n\nAnd honestly, the data is rough. Most citizens can't name their own representatives. Most can't explain the basic policy positions of the party they just voted for.\n\nBut wait, really? Think about this from the other direction. Experts gave us the Iraq War. Experts designed the 2008 financial crisis. The \"wisdom of crowds\" thesis suggests aggregated amateur judgment often beats individual expert opinion.\n\nSo should informed citizens get more political power than uninformed ones? Or is that the beginning of something very dangerous?",
    options: [
      { id: "A", text: "No. The moment you weight votes by knowledge, someone decides what \"informed\" means, and that power will be abused" },
      { id: "B", text: "Not through weighted voting, but through better design like citizens' assemblies and sortition that elevate deliberation without hierarchy" },
      { id: "C", text: "Voter \"ignorance\" is rational. Individual votes barely matter, so why invest in being informed? Fix the incentives, not the voters" },
      { id: "D", text: "Democracy's value isn't producing good outcomes. It's giving people dignity and agency. Efficiency was never the point" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Singapore went from developing nation to one of the richest countries on Earth per capita. Under single-party rule. China's 40-year economic growth is historically unprecedented. Rwanda's development metrics are remarkable.\n\nAll without free elections.\n\nNow, democracy advocates will point to the human rights costs, and they're real. But here's the uncomfortable reframe: if you're a parent in extreme poverty, and someone offers you a path where your kids eat three meals a day and go to school, but you can't vote or criticize the government...\n\nIs that flourishing? Or is it just a gilded cage? Where exactly is the line between prosperity and freedom?",
    options: [
      { id: "A", text: "Benevolent autocracy can spark rapid development, but it always depends on one person; succession crises and repression aren't bugs, they're features" },
      { id: "B", text: "Flourishing requires freedom, not just GDP. A prosperous population that can't speak or organize is in comfortable captivity, not thriving" },
      { id: "C", text: "The comparison cherry-picks winners. For every Singapore there are dozens of authoritarian states that are poor, corrupt, and brutal" },
      { id: "D", text: "It's less about regime type than governance quality. Strong institutions outperform weak ones regardless of whether elections happen" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Let's do some math that might break your brain.\n\nWyoming: 577,000 people. California: 39 million people. Both get exactly two senators. That's a 68-to-1 ratio represented equally. Imagine 68 Californians in a room with one Wyomingite, and they all get the same vote.\n\nBut wait, it gets wilder. The Electoral College has twice in recent memory handed the presidency to the candidate who got fewer votes. Gerrymandering lets legislators pick their voters instead of the other way around.\n\nMeanwhile, New Zealand uses proportional representation. Alaska adopted ranked-choice voting. Ireland runs citizens' assemblies that actually produce legislation.\n\nSo here's the question: is the American electoral system actually democratic? Or is it something else wearing democracy's clothes?",
    options: [
      { id: "A", text: "Not meaningfully. A system where fewer votes wins, districts are pre-drawn, and small states dominate the Senate is democracy in name only" },
      { id: "B", text: "It's democratic by design. The founders deliberately balanced majority rule with minority protection through the Senate, Electoral College, and federalism" },
      { id: "C", text: "It was democratic for 13 states and 4 million people. The failure is not reforming these structures for 330 million" },
      { id: "D", text: "Electoral mechanics matter less than economic power. Vote-counting is irrelevant if lobbyists and donors actually determine policy" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2024, U.S. federal election spending crossed $15 billion. Fifteen billion. That's more than the GDP of some countries, spent on campaign ads and consultants.\n\nCitizens United in 2010 opened the floodgates for unlimited corporate and union spending on elections. And here's the study that should keep you up at night: Princeton researchers Gilens and Page found that the preferences of average Americans have \"near-zero\" statistical impact on policy outcomes. Near zero. The preferences of economic elites? Substantial impact.\n\nSo think about what that actually means. You vote. Your vote is counted. And then policy goes wherever the money points anyway.\n\nIs this a democracy with a corruption problem, or an oligarchy with a voting ritual?",
    options: [
      { id: "A", text: "It's an oligarchy with democratic window-dressing. Elections legitimize decisions that donors and corporations already made" },
      { id: "B", text: "It's a democracy with oligarchic distortions. Money corrupts the process, but elections still topple incumbents and movements still win" },
      { id: "C", text: "The binary is false. All democracies are influenced by wealth; the U.S. is unusually captured, but reform beats despair" },
      { id: "D", text: "Gilens and Page understated it. The system produces policies that increase elite wealth, creating a feedback loop that entrenches itself" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Taiwan's Digital Minister Audrey Tang built something fascinating: platforms like Pol.is that use AI to find consensus positions among thousands of citizens, and vTaiwan, which crowdsources actual legislation. Estonia lets you vote online and runs most government services digitally.\n\nBut here's the one that really gets me. Ireland used citizens' assemblies, randomly selected ordinary people, to reach breakthrough consensus on abortion and same-sex marriage. Elected politicians had been stuck on those issues for decades. Random citizens solved them.\n\nWait, really? Random people outperformed professional politicians?\n\nCould technology and institutional experiments like these actually renew democracy? Or are we just adding more attack surface for manipulation?",
    options: [
      { id: "A", text: "Yes. Representative democracy was built for slow communication and low literacy; deliberative and digital tools can finally include citizens" },
      { id: "B", text: "Technology is more likely to harm democracy. Social media already polarized us; more tech means more manipulation and algorithmic distortion" },
      { id: "C", text: "These innovations are promising but can't fix rotten fundamentals like inequality, gerrymandering, and media capture" },
      { id: "D", text: "Citizens' assemblies are the real breakthrough. Randomly selected deliberating citizens outperform both politicians and digital tools" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Churchill called democracy \"the worst form of government, except for all the others.\" That was 1947.\n\nSince then we've invented the internet, AI, citizens' assemblies, liquid democracy, quadratic voting, and prediction markets. We've watched authoritarian states outperform democracies on certain metrics while crushing human freedom on others.\n\nSo is Churchill still right? Or has something better become possible that simply didn't exist in his world?",
    freeformOnly: true,
  },
];

export const democracyQuiz = {
  topic: TOPIC,
  topicLabel: "Can the People Be Trusted?",
  questions: main,
  followupQuestions,
};
