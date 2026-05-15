import type { AnyQuestion, Question } from "../types";

const TOPIC = "immigration";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "Okay so you're leaning toward enforcement. Here's what's wild about that.\n\nThe U.S. already spends over $25 billion a year on border security. That's more than the FBI and DEA combined. The 2006 Secure Fence Act built 654 miles of barrier. Trump's wall added roughly 450 more miles at $15 billion. And apprehensions went up through all of it.\n\nSo we keep building, keep spending, and the numbers keep climbing. Wait really? What kind of enforcement would actually change the equation?",
    options: [
      { id: "A", text: "Walls plus surveillance tech and rapid response, because barriers alone fail but a layered system could work" },
      { id: "B", text: "Go after employers who hire undocumented workers, because the job magnet is the real pull factor" },
      { id: "C", text: "Massively expand legal pathways so fewer people need to come illegally in the first place" },
      { id: "D", text: "No enforcement works while the conditions driving migration exist, so fix the push factors instead" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2023, Border Patrol recorded over 2.4 million encounters at the southern border. The highest in history. Meanwhile the immigration court backlog hit 3 million cases, with average wait times over 4 years.\n\nBut here's the part that makes this genuinely confusing. Economists consistently find that immigration grows the economy. The CBO estimated recent immigration would add $7 trillion over a decade. At the same time, New York alone spent over $4 billion just housing migrants.\n\nSo the same phenomenon is simultaneously a $7 trillion economic boost and a $4 billion budget crisis. Wait really? How do you even frame something like that?",
    options: [
      { id: "A", text: "It's an enforcement crisis, because sovereign nations must control their borders and this system is effectively open" },
      { id: "B", text: "It's a processing crisis, because the U.S. benefits from immigration but the bureaucracy forces people into illegal channels" },
      { id: "C", text: "It's a manufactured crisis, because immigration is manageable but fear-based framing serves politicians more than solutions" },
      { id: "D", text: "It's a global displacement crisis, because violence, poverty, and climate change are pushing millions and borders just treat symptoms" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Here's a puzzle that doesn't get talked about enough.\n\nEconomist Giovanni Peri at UC Davis shows immigration has a net positive effect on wages for native-born workers overall. But the gains are lopsided. High-skilled immigration (think H-1B visas) benefits employers and consumers while potentially pushing down wages in tech. Low-skilled immigration gives us cheaper food and construction, while competing with the workers who can least afford the pressure.\n\nSo imagine you're looking at a graph. The total bar goes up. Everyone celebrates. But if you zoom in, you see the bottom of the bar is sinking while the top is surging.\n\nThat's the real question. Who's actually paying for the benefits everyone else enjoys?",
    options: [
      { id: "A", text: "Working-class native-born workers, because immigration's gains flow to employers and consumers while costs hit low-wage earners" },
      { id: "B", text: "The framing is wrong, because immigrants mostly fill roles natives don't want and wage suppression is overstated" },
      { id: "C", text: "Immigrants themselves, because exploitation and wage theft mean they subsidize the economy with their vulnerability" },
      { id: "D", text: "Everyone benefits unevenly, which is normal, so the answer is better safety nets rather than restricting immigration" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The 1951 Refugee Convention guarantees the right to seek asylum from persecution. That sounds straightforward. It really isn't.\n\nIn practice, the U.S. asylum system has become the primary channel for economic migrants who don't qualify for other visas. About 60 to 80 percent of asylum claims are ultimately denied. But applicants can stay in the country for years waiting for a hearing.\n\nThink about what that means. You have a system designed for people fleeing persecution that's now being used by people fleeing poverty. The Biden administration tried restricting asylum by executive action. The Trump administration created \"Remain in Mexico\" policies.\n\nBoth sides keep patching a system that might be broken by design. Is it?",
    options: [
      { id: "A", text: "Yes, it's exploited as a backdoor immigration system and genuine refugees get buried in backlogs from economic migrants" },
      { id: "B", text: "It's broken but fixable with more resources, like thousands more asylum officers processing claims in weeks not years" },
      { id: "C", text: "The dysfunction is the feature, because the country wants cheap labor but won't admit it openly" },
      { id: "D", text: "The refugee vs. economic migrant distinction is collapsing, because climate and violence make the old categories meaningless" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here's a number that should stop you for a second. 11 million.\n\nThat's how many undocumented immigrants live in the United States right now. Many have been here over a decade. They pay an estimated $11.7 billion in state and local taxes every year. Their U.S.-born children are citizens.\n\nOBAMA created DACA in 2012 to protect 800,000 people who were brought here as kids. It's survived multiple legal challenges. But it provides zero path to citizenship. So you have people who've lived here since they were toddlers, graduated from American schools, pay American taxes, and exist in permanent legal limbo.\n\n11 million people. That's roughly the population of Ohio. What do you do with an Ohio-sized group of people who are already here?",
    options: [
      { id: "A", text: "Path to citizenship, because people who've lived, worked, and paid taxes here for years are Americans in every real sense" },
      { id: "B", text: "Legal status but not citizenship, with work permits and deportation protection while keeping citizenship tied to legal entry" },
      { id: "C", text: "Enforcement first, because amnesty without border security just incentivizes the next wave, as the 1986 amnesty showed" },
      { id: "D", text: "The framing itself is the problem, because the real question is how to stop creating millions of people in legal limbo" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2023, the governors of Texas and Florida bused and flew thousands of migrants to New York, Chicago, and Martha's Vineyard. Cities that had declared themselves \"sanctuaries.\"\n\nThe political stunt was widely condemned. But then something interesting happened. It actually worked as a stress test.\n\nNew York's mayor declared a state of emergency. In Chicago, residents in predominantly Black neighborhoods protested migrant shelters going up in their communities. People who had always supported immigration in principle suddenly had to reckon with it showing up on their block.\n\nHere's the uncomfortable version of this question. Is the tension between existing residents and new arrivals just bigotry? Or is it something more like a resource allocation problem wearing a moral costume?",
    options: [
      { id: "A", text: "It's real resource competition, because rapid demographic change in communities that didn't choose it generates legitimate resentment" },
      { id: "B", text: "It's a policy failure not an immigration failure, because adequate federal funding would make the strain manageable" },
      { id: "C", text: "The busing revealed sanctuary city hypocrisy, because supporting immigration is easy until it arrives in your neighborhood" },
      { id: "D", text: "Framing immigration as a solidarity threat is classic nativist politics, pitting marginalized groups against each other" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Let's zoom out to a timescale most people aren't thinking about.\n\nThe World Bank estimates that by 2050, climate change could displace 216 million people within their own countries. Millions more across borders. Rising seas are threatening entire Pacific island nations. Desertification is swallowing sub-Saharan Africa. Central America's \"dry corridor\" has already started pushing agricultural workers northward.\n\n216 million. To put that in perspective, that's roughly the combined population of Germany, France, and the UK. All on the move.\n\nAnd here's the kicker. The 1951 Refugee Convention, the legal backbone of the whole system, doesn't recognize climate refugees. They literally don't exist in international law.\n\nHow do you prepare for a wave that your legal framework says isn't real?",
    options: [
      { id: "A", text: "Expand the refugee definition, because climate displacement is as involuntary as political persecution and law must match reality" },
      { id: "B", text: "Create managed migration agreements between nations, funded by the countries most responsible for the emissions causing this" },
      { id: "C", text: "Invest in making places livable rather than building migration systems, because moving millions will destabilize receiving countries" },
      { id: "D", text: "216 million displaced people is a civilizational challenge that requires reimagining borders, sovereignty, and belonging entirely" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one. Pure thought experiment.\n\nForget every existing law, every political constraint, every inherited system. You're designing a country's immigration policy from a blank sheet of paper.\n\nWho gets in? On what terms? What do they owe once they're here? And what does the country owe them?\n\nThere's no wrong answer. Just yours.",
    freeformOnly: true,
  },
];

export const immigrationQuiz = {
  topic: TOPIC,
  topicLabel: "The Border Question",
  questions: main,
  followupQuestions,
};
