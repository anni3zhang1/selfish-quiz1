import type { AnyQuestion, Question } from "../types";

const TOPIC = "reparations";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "OK so here is where it gets wild.\n\nEconomist Utsa Patnaik ran the numbers on what Britain extracted from India over colonial rule. Her estimate? $45 trillion. That is not a typo. If you applied that same accounting consistently to every former colony, the total debt would bankrupt most of Europe.\n\nWait, really? Yes. The math does not care about what is convenient.\n\nSo here is the puzzle: does the obligation hold even when the debtor literally cannot pay?",
    options: [
      { id: "A", text: "Yes, the debt is real regardless of ability to pay. Structure it over generations, like Germany did with Holocaust reparations." },
      { id: "B", text: "The obligation holds but needs realistic forms: debt cancellation, tech transfer, and trade reform instead of impossible cash sums." },
      { id: "C", text: "The obligation is to the future, not the past. Restructure the systems still extracting wealth rather than chasing retroactive payments." },
      { id: "D", text: "If the number is too large to pay, that tells you how vast the theft was. The discomfort is not a reason to forgive it." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Between 1619 and 1865, roughly 12.5 million Africans were kidnapped, shipped across the Atlantic, and forced into labor in the Americas. Let that number sink in. 12.5 million people.\n\nEconomist William Darity tried to put a dollar figure on the unpaid labor in the U.S. alone, compounded at modest interest. His estimate exceeds $14 trillion. That is roughly two-thirds of the entire U.S. GDP in a single year.\n\nAfter emancipation, freed people were promised 40 acres and a mule. President Andrew Johnson rescinded the promise. No reparations were ever paid.\n\nSo here is the question that has hung in the air for over 150 years: does the U.S. owe a debt for slavery?",
    options: [
      { id: "A", text: "Yes. 246 years of unpaid labor built generational wealth for some and generational poverty for others. The debt is calculable." },
      { id: "B", text: "No. No living American was a slaveholder or enslaved. Collective guilt across generations is unjust. Address present inequality directly." },
      { id: "C", text: "The moral case is clear but the practical case is a mess. Identifying recipients, amounts, and funding could undermine the principle." },
      { id: "D", text: "The framing is too narrow. The harm did not end in 1865. Jim Crow, redlining, and mass incarceration continued the system." },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "Interesting. Here is something worth sitting with.\n\nThe U.S. government paid reparations to Japanese Americans interned during WWII ($20,000 each in 1988). It compensated victims of the Tuskegee syphilis experiment. Germany has paid over $80 billion to Holocaust survivors.\n\nThose precedents exist. So what makes slavery different? Is it the scale? The time elapsed? Something else entirely?\n\nWhat is your honest read on why this one gets treated differently?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "OK so suppose some form of reparations should happen. The next question is: what does that actually look like?\n\nDarity and Mullen propose direct cash payments of $250,000 to $350,000 per eligible Black American descendant of the enslaved. Total federal cost: $10 to $14 trillion. That is roughly the size of the entire national debt when Obama took office.\n\nOthers say: invest in communities instead. Housing, education, healthcare, business development.\n\nIn 2021, Evanston, Illinois became the first U.S. city to try it for real. They offered $25,000 housing grants to eligible Black residents. Not $250,000. Not $14 trillion. Twenty-five thousand dollars.\n\nWait, really? That is the gap between the proposals and the reality so far.\n\nWhat form should reparations take?",
    options: [
      { id: "A", text: "Direct cash. Only unrestricted payments respect recipients' autonomy. Institutional programs can be defunded by the next administration." },
      { id: "B", text: "Institutional investment. Cash gets spent in a generation. Schools, housing, and healthcare compound across generations." },
      { id: "C", text: "Both. Cash addresses the immediate wealth gap. Institutional investment addresses the structural barriers. Either alone falls short." },
      { id: "D", text: "The form matters less than the will. Debating cash vs. programs is often a way to avoid the harder question of whether to act at all." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Here is a number that should stop you in your tracks.\n\nIn 2023, the median white family in the U.S. held about $285,000 in wealth. The median Black family? $44,900. That is a ratio of roughly 6 to 1.\n\nNow here is the part that really matters: that ratio has barely moved since the 1960s. Sixty years of civil rights legislation, affirmative action, anti-discrimination law. The gap just... stayed.\n\nWait, really? How?\n\nEconomists Darrick Hamilton and Sandy Darity dug into it. They found the racial wealth gap is almost entirely explained by inheritance and intergenerational transfers. Not income differences. Not education differences. Not savings behavior. What your parents and grandparents had (or did not have) determines almost everything.\n\nIf sixty years of race-neutral policy could not close a race-specific gap, does that tell us something?",
    options: [
      { id: "A", text: "Yes. The gap was created by racial policy. Only race-specific policy can close it. Sixty years of evidence prove that." },
      { id: "B", text: "No. Race-specific policy is divisive and legally fragile. Universal programs like baby bonds can close the gap without racial targeting." },
      { id: "C", text: "It is both. Historical disadvantage compounds, but so does ongoing discrimination in lending, hiring, and housing. You need backward and forward fixes." },
      { id: "D", text: "The wealth gap is a symptom, not the disease. Closing it through transfers without dismantling predatory lending and unequal school funding is temporary." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "This question is not just American. Not even close.\n\nIn 2013, fifteen Caribbean nations formed the CARICOM Reparations Commission to demand payment from Britain, France, the Netherlands, Spain, and Portugal for slavery and indigenous genocide. India's Shashi Tharoor has argued Britain owes trillions for 200 years of colonial extraction.\n\nAnd here is a twist you might not expect: at the COP27 climate summit, the \"loss and damage\" fund was framed explicitly as climate reparations. Rich nations that did the polluting owe something to poorer nations suffering the consequences.\n\nSo reparations are not one debate. They are everywhere, in different costumes.\n\nIs there a global obligation for former colonial powers to pay up?",
    options: [
      { id: "A", text: "Yes. European and North American wealth was built on colonial extraction, enslaved labor, and resource theft. The debt is real and calculable." },
      { id: "B", text: "The moral case exists but enforcement does not. No mechanism can compel former colonial powers to pay. This requires goodwill that does not exist." },
      { id: "C", text: "Forward-looking redistribution works better. Restructure trade rules, cancel debts, transfer technology. Different framing, same material outcome." },
      { id: "D", text: "The claim is valid but the math is impossible. Colonialism is so deeply woven into the global economy that \"paying a debt\" cannot capture it." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Now let us talk about a different kind of debt entirely.\n\nIndigenous peoples in the U.S. did not just have their labor stolen. They had their land taken through conquest, broken treaties, and forced removal. The U.S. government currently holds about 56 million acres \"in trust\" for Native nations.\n\nThink about that phrase for a second. \"In trust.\" The government took the land, then appointed itself the trustee.\n\nThe 2020 McGirt v. Oklahoma decision affirmed that a huge portion of eastern Oklahoma is still legally reservation land. The Landback movement calls for returning stolen public lands to tribal sovereignty.\n\nShould land actually be given back?",
    options: [
      { id: "A", text: "Yes. Treaties are legal contracts the U.S. government broke. Returning federal public land is not radical. It is honoring agreements." },
      { id: "B", text: "Money is more practical. Returning land displaces current inhabitants and creates governance tangles. Fair compensation is achievable where physical return is not." },
      { id: "C", text: "Both, through co-management. Tribal co-management of federal lands (like Bears Ears) returns authority without displacing anyone." },
      { id: "D", text: "Land return is necessary but not sufficient. The destruction of languages, cultures, and governance systems requires full sovereignty restoration, not just property." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Here is the objection you hear most often: reparations would be too divisive.\n\nAnd the polling backs it up. Roughly 70% of white Americans oppose reparations for slavery. That is not a slim margin. That is a wall.\n\nBut some people, like sociologist Matthew Desmond, flip the argument. They say the opposition itself is evidence of the problem. A country that refuses to reckon with its foundational injustice has not changed as much as it thinks it has.\n\nWhich raises a genuinely hard question. When 70% of the majority population says no, is that a reason to stop, or a reason to push harder?\n\nThere are honest answers on both sides. What is yours?",
    options: [
      { id: "A", text: "Justice does not require popularity. Abolition, civil rights, and women's suffrage were all deeply unpopular before they happened." },
      { id: "B", text: "Pragmatically, yes. Policy without public support gets reversed at the next election. Building consensus has to come first." },
      { id: "C", text: "The opposition reveals what needs to change first. Truth and reconciliation must come before material compensation, not after." },
      { id: "D", text: "Reframe it. Universal programs that disproportionately help the disadvantaged (baby bonds, wealth grants) poll much better. The framing matters." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and it is open-ended on purpose.\n\nForget policy for a second. What would it actually take, culturally, psychologically, institutionally, for the U.S. to genuinely reckon with slavery and everything that followed?\n\nIs that even possible in your lifetime? What would it look like if it were?",
    freeformOnly: true,
  },
];

export const reparationsQuiz = {
  topic: TOPIC,
  topicLabel: "Can You Fix the Past?",
  questions: main,
  followupQuestions,
};
