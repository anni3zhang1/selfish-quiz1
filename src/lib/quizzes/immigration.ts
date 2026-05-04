import type { AnyQuestion, Question } from "../types";

const TOPIC = "immigration";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "If border enforcement is the priority — the U.S. already spends over $25 billion annually on border security, more than the FBI and DEA combined. The 2006 Secure Fence Act built 654 miles of barrier. Trump\'s border wall added roughly 450 miles at a cost of $15 billion. Apprehensions have risen through all of it. What enforcement approach would actually work?",
    options: [
      { id: "A", text: "Physical barriers plus technology — walls don\'t work alone, but combined with surveillance, sensors, and rapid response, they reduce crossings; the issue is political will, not feasibility" },
      { id: "B", text: "Interior enforcement — go after employers who hire undocumented workers; remove the job magnet and illegal immigration drops; the border is a distraction from the real pull factor" },
      { id: "C", text: "Massively expand legal immigration pathways — most illegal immigration exists because legal channels are impossibly slow; make it easier to come legally and fewer people will come illegally" },
      { id: "D", text: "No enforcement approach will work as long as the conditions driving migration exist — enforcement is a treadmill; the only real solution is reducing push factors in sending countries" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2023, the U.S. Border Patrol recorded over 2.4 million encounters at the southern border — the highest in history. The immigration court backlog exceeded 3 million cases, with average wait times over 4 years. Meanwhile, economists consistently find that immigration increases GDP — the Congressional Budget Office estimated that recent immigration would add $7 trillion to the economy over a decade. Cities like New York spent over $4 billion housing migrants. What\'s the right frame for the U.S. immigration situation?",
    options: [
      { id: "A", text: "It\'s a crisis of enforcement — sovereign nations have the right and obligation to control their borders; the current system is effectively open borders by default, and that\'s unsustainable" },
      { id: "B", text: "It\'s a crisis of processing, not of borders — the U.S. benefits enormously from immigration; the problem is a broken bureaucracy that can\'t process people legally, forcing them into illegal channels" },
      { id: "C", text: "It\'s a crisis manufactured for political purposes — immigration levels are high but manageable; the \'crisis\' framing serves politicians who benefit from fear more than from solutions" },
      { id: "D", text: "It\'s a global displacement crisis — the root causes are violence, poverty, and climate change in sending countries; border policy treats symptoms while ignoring the forces pushing millions of people to move" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Economist Giovanni Peri\'s research at UC Davis shows that immigration has a net positive effect on wages for native-born workers overall — but the gains are unevenly distributed. High-skilled immigration (H-1B visas) benefits employers and consumers while potentially suppressing wages for native-born workers in tech and STEM fields. Low-skilled immigration provides cheap labor that benefits consumers through lower food and construction costs, while potentially competing with the native-born workers least able to absorb wage pressure. Who bears the cost of immigration\'s economic benefits?",
    options: [
      { id: "A", text: "Working-class native-born workers — immigration\'s benefits flow to employers and consumers while its costs concentrate on those competing directly for low-wage jobs; the winners should compensate the losers" },
      { id: "B", text: "The framing is wrong — immigrants mostly fill roles native-born workers don\'t want; they complement rather than compete; the wage suppression narrative is empirically overstated" },
      { id: "C", text: "Immigrants themselves bear the greatest cost — exploitation, wage theft, and lack of legal protections mean they\'re subsidizing the economy with their vulnerability, not their labor alone" },
      { id: "D", text: "Everyone benefits unevenly, and that\'s how all economic change works — the answer isn\'t restricting immigration but building a safety net that protects all workers regardless of where they were born" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The 1951 Refugee Convention guarantees the right to seek asylum from persecution. In practice, the U.S. asylum system has become the primary channel for economic migrants who don\'t qualify for other visas. An estimated 60-80% of asylum claims are ultimately denied, but applicants can remain in the U.S. for years awaiting hearings. The Biden administration attempted to restrict asylum through executive action in 2024. The Trump administration implemented \'Remain in Mexico\' and third-country transit bars. Is the asylum system working?",
    options: [
      { id: "A", text: "No — it\'s being exploited as a backdoor immigration system; genuine refugees are buried in a backlog created by economic migrants gaming the process; reform must distinguish the two" },
      { id: "B", text: "No — but the solution is more resources, not more restrictions; hire thousands of asylum officers and immigration judges to process claims in weeks, not years" },
      { id: "C", text: "The system is working as designed — by a country that wants cheap labor but doesn\'t want to admit it; the dysfunction is the feature, not the bug" },
      { id: "D", text: "The distinction between \'economic migrant\' and \'refugee\' is collapsing — when climate change destroys your farm or gang violence makes your neighborhood unlivable, the categories stop making sense" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "An estimated 11 million undocumented immigrants live in the United States — many for over a decade. They pay an estimated $11.7 billion in state and local taxes annually, according to the Institute on Taxation and Economic Policy. Their children, if born in the U.S., are citizens. DACA, created by Obama in 2012, temporarily protected 800,000 people brought to the U.S. as children. The program has survived multiple legal challenges but provides no path to citizenship. What should happen to the people already here?",
    options: [
      { id: "A", text: "Path to citizenship — people who have lived, worked, and paid taxes here for years are Americans in every meaningful sense; legalize them and end the permanent underclass" },
      { id: "B", text: "Legal status without citizenship — provide work permits and protection from deportation, but full citizenship should require following the legal immigration process" },
      { id: "C", text: "Enforcement first — amnesty without securing the border incentivizes the next wave; the 1986 amnesty was supposed to be the last one; legalization must follow enforcement, not precede it" },
      { id: "D", text: "The framing of \'what to do with them\' is dehumanizing — these are people, not a policy problem; the question should be how to build an immigration system that doesn\'t create 11 million people in legal limbo" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2023, the governors of Texas and Florida bused or flew thousands of migrants to cities like New York, Chicago, and Martha\'s Vineyard — cities that had declared themselves \'sanctuaries.\' The political stunt was widely condemned but also forced liberal cities to confront the logistical reality of housing large numbers of migrants. New York\'s mayor declared a state of emergency. Chicago residents in predominantly Black neighborhoods protested migrant shelters. Does immigration strain social solidarity?",
    options: [
      { id: "A", text: "Yes — rapid demographic change in communities that didn\'t choose it generates real resentment, especially when existing residents feel their own needs are being ignored; this isn\'t bigotry, it\'s resource competition" },
      { id: "B", text: "It can, but the strain is a policy failure, not an immigration failure — if cities received adequate federal funding and infrastructure support, the \'strain\' would be manageable" },
      { id: "C", text: "The busing stunt revealed the hypocrisy of sanctuary city rhetoric — it\'s easy to support immigration in the abstract; the politics change when it shows up in your neighborhood" },
      { id: "D", text: "Framing immigration as a threat to solidarity is how nativist politics works — it pits marginalized communities against each other while the actual causes of their shared deprivation go unaddressed" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "The World Bank estimates that by 2050, climate change could displace 216 million people within their own countries — and millions more across borders. Rising seas threaten Pacific island nations. Desertification is expanding across sub-Saharan Africa. Central America\'s \'dry corridor\' has already driven agricultural migration northward. The 1951 Refugee Convention does not recognize climate refugees. How should the world prepare for climate migration?",
    options: [
      { id: "A", text: "Expand the refugee definition — climate displacement is as involuntary as political persecution; international law needs to catch up with physical reality" },
      { id: "B", text: "Managed migration agreements — bilateral and regional deals that create legal pathways for climate-displaced people, funded by the countries most responsible for emissions" },
      { id: "C", text: "Invest in adaptation, not migration infrastructure — the answer is making places livable, not building systems to move millions of people; migration at this scale will destabilize receiving countries" },
      { id: "D", text: "Climate migration will overwhelm any policy framework we build — 216 million displaced people is a civilizational challenge, not a policy problem; it requires reimagining borders, sovereignty, and belonging" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "If you could design a country\'s immigration system from scratch — no political constraints, no existing laws — what would it look like? Who gets in, on what terms, and what do they owe?",
    freeformOnly: true,
  },
];

export const immigrationQuiz = {
  topic: TOPIC,
  topicLabel: "Immigration",
  questions: main,
  followupQuestions,
};
