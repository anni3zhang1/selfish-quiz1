import type { AnyQuestion, Question } from "../types";

const TOPIC = "capitalism";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "Here's what makes the 'green growth' debate so slippery.\n\nA 2020 study in The Lancet Planetary Health looked for evidence that any country on Earth has managed to grow its economy while shrinking its total environmental footprint in absolute terms. Not per dollar of GDP. In absolute tons, hectares, barrels. They couldn't find it.\n\nWait, really? What about all those charts showing emissions going down in Europe?\n\nTurns out rich countries have been doing something clever: they offshore their dirtiest production to poorer countries, then count only what happens inside their own borders. The pollution didn't disappear. It moved.\n\nSo is 'green growth' a real phenomenon we just haven't finished yet, or a story we tell ourselves so we don't have to face harder choices?",
    options: [
      { id: "A", text: "The trajectory is real. Solar costs dropped 90% in a decade. We're early, not wrong." },
      { id: "B", text: "It's a comforting fiction. Absolute decoupling has never happened globally. Plan for degrowth." },
      { id: "C", text: "This is a political question, not a physics question. Policy choices determine the answer." },
      { id: "D", text: "Both sides overstate it. Green growth alone won't save us, but voluntary degrowth is politically impossible." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Let's start with something that should bother you no matter where you stand.\n\nSince 1980, the bottom half of the world's population has seen their share of global income stay basically flat. Meanwhile the top 1%'s share doubled. But here's the twist: during that same window, extreme poverty fell from 36% to under 10%. Over a billion people crossed out of poverty.\n\nEconomist Branko Milanovic mapped this into what he calls the 'elephant curve.' Massive gains for the global middle class (mostly in Asia). Massive gains for the ultra-rich everywhere. And the Western working class? Flatlined.\n\nSo picture that. A billion people lifted out of poverty, and billionaires multiplying like rabbits, happening at the same time. Is the system working?",
    options: [
      { id: "A", text: "Yes, globally. Lifting a billion from poverty is humanity's greatest achievement, despite the inequality." },
      { id: "B", text: "No. Billionaires and food banks in the same city means the system is broken at its core." },
      { id: "C", text: "It depends which capitalism. Nordic, Chinese, and American versions produce wildly different outcomes." },
      { id: "D", text: "The question is outdated. AI and platform monopolies have changed what capital even means." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "Interesting. But here's a wrinkle worth sitting with.\n\nThe country responsible for most of that poverty reduction is China. And China did it through state-directed industrial policy, not free markets. The government picked winners, controlled capital flows, and built infrastructure by decree.\n\nSo if capitalism's greatest success story was actually accomplished by a system that breaks most of capitalism's rules... does that strengthen your argument or quietly undermine it?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Now here's something that might surprise you.\n\nThe Mondragon Corporation in Spain's Basque Country has been running since 1956. It's the world's largest worker cooperative: 80,000 worker-owners, $12 billion in annual revenue. The maximum pay ratio between the top executive and the lowest-paid worker is 6 to 1.\n\nWait, really? Compare that to the average S&P 500 company, where the ratio is 399 to 1. That means a CEO makes in one day what their median worker makes in an entire year.\n\nGermany takes a different approach. Their 'codetermination' system puts workers directly on corporate boards. And in Cleveland, the Evergreen Cooperatives have revitalized entire neighborhoods through community-owned businesses.\n\nThese aren't thought experiments. They're real, operating companies. So why aren't they everywhere?",
    options: [
      { id: "A", text: "They work. Mondragon proves shared ownership produces stability and competitive performance at scale." },
      { id: "B", text: "They work in some contexts but can't match shareholder firms on innovation speed and capital formation." },
      { id: "C", text: "They succeed when they emerge organically. Mandating them through policy just creates bureaucracy." },
      { id: "D", text: "They work but threaten concentrated wealth, and concentrated wealth controls the rules of the game." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Let's look at three numbers that, taken together, tell a story about where markets break down.\n\nThe U.S. spends roughly $4.5 trillion per year on healthcare. That's 18% of GDP, double what other wealthy countries spend. And yet life expectancy is lower and 27 million people have no insurance at all.\n\nNearly half of American renters spend over 30% of their income just on housing. Student loan debt has crossed $1.7 trillion.\n\nNotice the pattern? Health. Housing. Education. The three things you absolutely cannot opt out of. You can skip buying a new phone. You cannot skip a tumor, a roof, or your kid's schooling.\n\nSo when the market consistently fails to deliver affordable access to things people literally cannot refuse to buy... is that a bug or a feature?",
    options: [
      { id: "A", text: "Market failures. These goods have broken price signals, inelastic demand, and need public provision." },
      { id: "B", text: "Government failures. These are the most regulated sectors. Subsidies and red tape inflated the costs." },
      { id: "C", text: "System features. Capitalism profits most from needs you can't walk away from. Working as designed." },
      { id: "D", text: "Wrong frame entirely. Industry incumbents captured both market power and regulators. The fix is structural." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here's a question that sounds abstract until you do the arithmetic.\n\nEconomist Kate Raworth draws a picture she calls the 'Doughnut.' The inner ring is the social foundation: the minimum everyone needs to live a decent life. The outer ring is the ecological ceiling: the planetary boundaries we cannot cross without triggering cascading collapse. A healthy economy, she argues, lives in the space between those two rings.\n\nNow, degrowth economists like Jason Hickel point out something uncomfortable: infinite growth on a finite planet is not an opinion. It's a math problem. And the math doesn't work.\n\nBut mainstream economists fire back: growth is how you fund the transition. Solar panels don't build themselves. You need investment, which requires returns, which requires growth.\n\nSo can capitalism survive without growth? Or is asking that question like asking whether a shark can survive without swimming?",
    options: [
      { id: "A", text: "It doesn't need to stop. Green growth through efficiency and innovation is already decoupling GDP from resources." },
      { id: "B", text: "That's the whole problem. Capitalism requires growth to function. Post-growth capitalism is a contradiction." },
      { id: "C", text: "Rich countries should stop growing. Poor countries must keep going. The degrowth demand only applies to the North." },
      { id: "D", text: "Wrong question. What matters is what grows and what shrinks. Massive growth in clean energy, contraction in waste." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "This one gets personal fast.\n\nIn 2024, the three richest Americans held combined wealth exceeding $500 billion. To put that in perspective, that's more than the entire GDP of roughly 80% of the world's countries. Three people, richer than most nations.\n\nBut here's where it gets really interesting. Philosopher Elizabeth Anderson points out something most of us just accept without thinking: the workplace is the last domain of authoritarian control in supposedly democratic societies. Your boss can dictate your speech, your appearance, when you use the bathroom, and can end your livelihood on a whim.\n\nKarl Marx called this 'wage slavery.' Libertarians call it freedom of contract.\n\nThink about that gap for a second. The exact same arrangement, described by one side as oppression and the other as liberty. Who's closer to right?",
    options: [
      { id: "A", text: "Marx. The power gap between employer and employee makes 'free contract' a polite fiction." },
      { id: "B", text: "Libertarians. Nobody is forced to work for any particular employer. The freedom to quit is real." },
      { id: "C", text: "Anderson. Don't abolish employment, democratize it. Give workers rights and power inside the workplace." },
      { id: "D", text: "Both. The labor market is free in the aggregate and coercive in the particular. Choose which boss dominates you." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Here's a puzzle that should make you suspicious of anyone who talks about 'capitalism' as if it's one thing.\n\nChina combines market competition with central planning, state-owned enterprises, and authoritarian control. It calls itself a market economy. Vietnam and Ethiopia followed similar playbooks and grew fast.\n\nThe Nordic countries combine private ownership with powerful unions, universal welfare, and high taxes. They call themselves market economies.\n\nThe U.S. combines private ownership with weak unions, limited welfare, and low taxes. It also calls itself a market economy.\n\nThree wildly different systems, same label. It's like calling a golden retriever, a wolf, and a chihuahua all 'dogs' and then debating whether dogs are dangerous.\n\nSo forget the label. What's the actual variable that determines whether people thrive?",
    options: [
      { id: "A", text: "Worker power. Union density and collective bargaining explain the gap between Nordic success and American dysfunction." },
      { id: "B", text: "State capacity. Can the government build infrastructure, enforce rules, deliver services? Competence beats ideology." },
      { id: "C", text: "Ownership distribution. Who owns the productive assets determines who captures the gains. Everything else follows." },
      { id: "D", text: "Democratic accountability. Nordic governments answer to citizens. The U.S. government answers to donors." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and it's all yours.\n\nForget policies. Policies are dials you can turn up or down. I'm asking about something deeper.\n\nIf you could change one structural rule of the economic game you live in, not a tax rate, not a regulation, but a foundational rule about how the system is wired, what would it be?\n\nTake your time with this one.",
    freeformOnly: true,
  },
];

export const capitalismQuiz = {
  topic: TOPIC,
  topicLabel: "Who Wins When the Market Decides?",
  questions: main,
  followupQuestions,
};
