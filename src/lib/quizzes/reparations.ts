import type { AnyQuestion, Question } from "../types";

const TOPIC = "reparations";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "If former colonial powers owe reparations, the numbers are staggering — Utsa Patnaik estimates Britain extracted $45 trillion from India alone. If applied consistently, the debt would bankrupt most European nations. Does the obligation hold regardless of current capacity to pay?",
    options: [
      { id: "A", text: "Yes — the size of the debt doesn\'t reduce the obligation; Germany is still paying Holocaust reparations 80 years later; the payment can be structured over generations" },
      { id: "B", text: "The obligation holds but must be realistic — symbolic acknowledgment, debt cancellation, technology transfer, and trade reform are more achievable than cash payments that would destabilize donor economies" },
      { id: "C", text: "The obligation is to current and future generations, not the past — what matters is restructuring the systems that continue to extract wealth from former colonies, not retroactive compensation" },
      { id: "D", text: "If the numbers are too large to pay, that itself tells you how vast the theft was — the discomfort of confronting an unpayable debt is not a reason to forgive it; it\'s a reason to reckon with it" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Between 1619 and 1865, roughly 12.5 million Africans were enslaved and transported to the Americas. Economist William Darity estimates that the value of enslaved labor in the U.S. alone, compounded at modest interest rates, exceeds $14 trillion. After emancipation, formerly enslaved people were promised \'40 acres and a mule\' — a promise rescinded by President Andrew Johnson. No reparations were ever paid. In 2019, Ta-Nehisi Coates testified before Congress that \'the question is not whether we\'ll be tied to the somethings of our past, but whether we are courageous enough to be tied to the whole of them.\' Is the U.S. obligated to pay reparations for slavery?",
    options: [
      { id: "A", text: "Yes — the wealth of the United States was built on 246 years of unpaid labor; the effects compound across generations through property, education, and inherited wealth; the debt is owed and calculable" },
      { id: "B", text: "No — no living American was a slaveholder or a slave; collective guilt across generations is unjust; policy should address present inequality directly rather than relitigating historical wrongs" },
      { id: "C", text: "The moral case is clear but the practical case is harder — identifying recipients, determining amounts, and funding the program creates implementation challenges that could undermine the principle" },
      { id: "D", text: "The framing is too narrow — reparations shouldn\'t just be about slavery but about the entire system that followed: Jim Crow, redlining, mass incarceration, educational exclusion; the harm didn\'t end in 1865" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "The U.S. government paid reparations to Japanese Americans interned during WWII ($20,000 each in 1988) and to victims of the Tuskegee syphilis experiment. Germany has paid over $80 billion to Holocaust survivors. What makes slavery different — is it the scale, the time elapsed, or something else?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Reparations proposals range widely. Economist William Darity and Kirsten Mullen propose direct cash payments of $250,000-$350,000 per eligible Black American descendant of the enslaved, funded federally at an estimated cost of $10-14 trillion. Others propose institutional reparations: investments in Black communities through housing, education, healthcare, and business development. The city of Evanston, Illinois became the first U.S. municipality to fund reparations in 2021 — offering $25,000 housing grants to eligible Black residents. What form should reparations take?",
    options: [
      { id: "A", text: "Direct cash payments — only unrestricted cash transfers respect the autonomy of recipients and begin to address the wealth gap; institutional programs are paternalistic and can be defunded by future administrations" },
      { id: "B", text: "Institutional investment — direct payments would be spent in a generation; investments in education, housing, and healthcare create permanent infrastructure that compounds across generations" },
      { id: "C", text: "Both — cash payments address the immediate wealth gap while institutional investment addresses the structural barriers; either alone is insufficient" },
      { id: "D", text: "The form matters less than the commitment — the real question is political will; any meaningful reparations program would be transformative; the debate over form is a way of avoiding the harder question of whether to do it at all" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "In 2023, the median white family in the U.S. held roughly $285,000 in wealth compared to $44,900 for the median Black family — a ratio of roughly 6:1. This gap has remained remarkably stable since the 1960s despite civil rights legislation, affirmative action, and anti-discrimination law. Economists Darrick Hamilton and Sandy Darity have shown that the racial wealth gap is almost entirely explained by inheritance and intergenerational transfers — not by differences in income, education, or savings behavior. If the gap persists despite race-neutral policies, does that prove race-specific intervention is necessary?",
    options: [
      { id: "A", text: "Yes — sixty years of race-neutral policy hasn\'t closed the gap because the gap itself is race-specific; it was created by racial policy and can only be closed by racial policy" },
      { id: "B", text: "No — race-specific policy is divisive and legally fraught; universal programs (baby bonds, universal pre-K, housing subsidies) that disproportionately benefit the disadvantaged can close the gap without racial targeting" },
      { id: "C", text: "The evidence is ambiguous — the wealth gap reflects compounding historical disadvantage, but also ongoing discrimination in lending, hiring, and housing; you need both backward-looking reparations and forward-looking enforcement" },
      { id: "D", text: "The wealth gap is a symptom, not the disease — closing it through transfers without dismantling the systems that produce it (redlining\'s successors, predatory lending, school funding inequality) is a temporary fix" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "The reparations debate extends beyond the United States. In 2013, 15 Caribbean nations formed the CARICOM Reparations Commission to demand reparations from European colonial powers — Britain, France, the Netherlands, Spain, and Portugal — for slavery and indigenous genocide. India\'s Shashi Tharoor has argued that Britain owes India trillions for 200 years of colonial extraction. At the COP27 climate summit, the \'loss and damage\' fund was framed explicitly as climate reparations from polluting nations to those suffering the consequences. Is there a global reparations obligation?",
    options: [
      { id: "A", text: "Yes — the wealth of Europe and North America was built on colonial extraction, enslaved labor, and resource theft; the debt is historical, calculable, and morally unambiguous" },
      { id: "B", text: "The moral case exists but enforcement doesn\'t — there\'s no international mechanism to compel former colonial powers to pay; reparations between nations require either goodwill (which doesn\'t exist) or coercion (which repeats the pattern)" },
      { id: "C", text: "Forward-looking redistribution is more achievable — instead of reparations, restructure trade rules, cancel debt, and transfer technology; the framing changes but the material outcome is the same" },
      { id: "D", text: "The claim is valid but the math is impossible — colonialism\'s effects are so deeply woven into global economic structures that \'paying a debt\' doesn\'t capture the scale of what was taken; the system itself is the reparation owed" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Indigenous peoples in the U.S. have a distinct reparations claim — land was taken through conquest, broken treaties, and forced removal. The U.S. government holds approximately 56 million acres in trust for Native nations. The 2021 McGirt v. Oklahoma decision affirmed that a large portion of eastern Oklahoma remains reservation land. The Landback movement calls for the return of stolen public lands to tribal sovereignty. Should land be returned?",
    options: [
      { id: "A", text: "Yes — the treaties were legal agreements violated by the U.S. government; returning land is not radical, it\'s honoring contracts; start with federal public lands that aren\'t in use" },
      { id: "B", text: "Monetary compensation is more practical — returning land displaces current inhabitants and creates governance complications; fair payment for what was taken is achievable where physical return is not" },
      { id: "C", text: "Both, and co-management is the path forward — tribal co-management of federal lands (as with Bears Ears National Monument) is a model that returns authority without displacing people" },
      { id: "D", text: "Land return is necessary but insufficient — stolen land is one dimension; the destruction of language, culture, and governance systems requires a comprehensive sovereignty restoration, not just property transfer" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "One of the strongest objections to reparations is that they\'re divisive — that race-specific programs will increase resentment and backlash. Polling consistently shows that roughly 70% of white Americans oppose reparations for slavery. Sociologist Matthew Desmond argues that the opposition itself is evidence of the problem — that a country unwilling to reckon with its foundational injustice is a country that hasn\'t changed as much as it thinks. Is public opposition a reason not to pursue reparations?",
    options: [
      { id: "A", text: "No — justice doesn\'t require popularity; civil rights, abolition, and women\'s suffrage were all deeply unpopular before they happened; moral imperatives override opinion polls" },
      { id: "B", text: "Yes, pragmatically — policy that lacks public support won\'t survive; reparations passed over majority objection would be reversed at the next election; building consensus must come first" },
      { id: "C", text: "The opposition reveals what needs to change first — reparations can\'t work without a national reckoning with history; truth and reconciliation must precede material compensation, not follow it" },
      { id: "D", text: "The question assumes reparations are primarily for Black Americans — if framed as a universal program that disproportionately benefits the disadvantaged (baby bonds, wealth grants), support changes dramatically; the framing matters" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "What would it actually take — not just policy but culturally, psychologically, institutionally — for the U.S. to genuinely reckon with slavery and its aftermath? Is that even possible in your lifetime?",
    freeformOnly: true,
  },
];

export const reparationsQuiz = {
  topic: TOPIC,
  topicLabel: "Reparations",
  questions: main,
  followupQuestions,
};
