import type { AnyQuestion, Question } from "../types";

const TOPIC = "homelessness";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "The \"housing first\" model — giving people permanent housing with no preconditions (sobriety, employment, treatment) — has been the dominant approach since Dr. Sam Tsemberis developed it in the 1990s through Pathways to Housing in New York. Studies show 80-90% retention rates. But critics argue it doesn't address the underlying issues that caused homelessness and can concentrate social problems in housing sites. Is Housing First sufficient?",
    options: [
      { id: "A", text: "Yes — stable housing is the foundation; everything else (treatment, employment, recovery) becomes possible once someone has a safe place to live; the evidence is overwhelming" },
      { id: "B", text: "Necessary but not sufficient — housing without wraparound services (mental health, addiction treatment, job training) is just warehousing people; the model needs to be Housing First Plus" },
      { id: "C", text: "The model works for some but not all — chronically homeless people with severe mental illness may need structured environments, not just apartments with a caseworker" },
      { id: "D", text: "Housing First is a downstream fix — it doesn't prevent homelessness; we need upstream investments in affordable housing, mental healthcare, and poverty reduction so fewer people fall into crisis" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In January 2023, HUD's annual Point-in-Time count found over 653,000 people experiencing homelessness in the U.S. — the highest number recorded since tracking began in 2007. California alone accounts for nearly 30% of the national total despite having 12% of the population. Homelessness has increased every year since 2017. Is homelessness primarily a housing problem, a mental health problem, a substance abuse problem, or something else?",
    options: [
      { id: "A", text: "Housing — the data is clear: homelessness correlates most strongly with housing costs, not addiction or mental illness; the cities with the most expensive housing have the most homelessness" },
      { id: "B", text: "Mental health and addiction — a significant percentage of chronically homeless people have untreated mental illness or substance use disorders; housing alone doesn't address this" },
      { id: "C", text: "It's both, and the interaction matters — housing costs push vulnerable people onto the street, and once there, untreated mental health and addiction make it nearly impossible to get back" },
      { id: "D", text: "It's a systems failure — homelessness is the visible endpoint of failures in healthcare, housing, education, criminal justice, and social support simultaneously; single-cause framing is always wrong" },
      f("None of these / I see it differently"),
    ],
    followups: { A: { type: "mc", question_id: "q1a" } },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In June 2024, the U.S. Supreme Court ruled 6-3 in Grants Pass v. Johnson that cities can enforce anti-camping laws and criminalize sleeping outdoors, even when shelter beds aren't available. Justice Sotomayor's dissent called it \"punishing people for being homeless.\" The ruling reversed a Ninth Circuit precedent that had protected unsheltered people in western states. Cities like Portland, San Francisco, and Los Angeles began clearing encampments within weeks. Is criminalization ever an appropriate tool?",
    options: [
      { id: "A", text: "No — criminalizing homelessness punishes poverty; you cannot arrest your way out of a housing crisis, and sweeps just move people from one block to the next" },
      { id: "B", text: "Sometimes — encampments create genuine public health and safety hazards; residents and businesses in affected areas have legitimate concerns that can't be dismissed as lacking compassion" },
      { id: "C", text: "Only if there's a real alternative — enforcement is defensible when paired with available shelter, treatment, and housing; without those, it's just cruelty with a badge" },
      { id: "D", text: "The question itself reveals the failure — that we're debating whether to arrest people for not having homes instead of debating how to house them is an indictment of the entire political system" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Finland is the only EU country where homelessness has consistently declined. Through its \"Housing First\" national strategy, Finland spent roughly €250 million to convert shelters into permanent apartments and build new supported housing. Homelessness dropped by over 35% between 2008 and 2023. Finland also has universal healthcare, a strong social safety net, and a much smaller population than the U.S. Is the Finnish model transferable, or is it an apples-to-oranges comparison?",
    options: [
      { id: "A", text: "Transferable in principle — the core insight (housing first, no preconditions, invest upfront) works regardless of country size; what's missing in the U.S. is political will, not technical knowledge" },
      { id: "B", text: "Not transferable — Finland is small, homogeneous, and has universal healthcare; the U.S. has none of those conditions, and importing the housing model without the social infrastructure won't work" },
      { id: "C", text: "Partially transferable — the housing approach works, but the U.S. would also need to fix healthcare, addiction treatment, and the safety net simultaneously; you can't isolate one variable" },
      { id: "D", text: "The comparison is useful precisely because it's uncomfortable — Finland proves the problem is solvable; calling it \"different\" is a way of avoiding the real question, which is why the U.S. chooses not to solve it" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "In San Francisco, the city spends over $1 billion annually on homelessness services — roughly $100,000 per homeless person per year. Despite this, the homeless population has remained roughly stable. A 2023 UCSF study led by Dr. Margot Kushel found that 90% of California's homeless population lost their housing within the state, contradicting the narrative that they migrated from elsewhere. The study also found that the median income before becoming homeless was $960/month. Is San Francisco's spending failing, or is it preventing an even worse crisis?",
    options: [
      { id: "A", text: "Failing — a billion dollars a year with no reduction in homelessness is a policy failure by any measure; the money is being absorbed by a bureaucratic services industry, not solving the problem" },
      { id: "B", text: "Preventing worse — without that spending, homelessness would be dramatically higher; the number staying stable while housing costs skyrocket is actually a success being misread as failure" },
      { id: "C", text: "The spending is misallocated — too much goes to emergency services (shelters, outreach, cleanups) and not enough to the only thing that works: building permanent affordable housing" },
      { id: "D", text: "The spending level reveals the real cost of the housing crisis — $1 billion is what it costs to manage the symptoms of an unaffordable city; the fix isn't better spending, it's a housing market that doesn't produce homelessness in the first place" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "If the current spending is a bureaucratic failure — what would you actually cut, and what would you redirect the money toward? Be specific.",
      },
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Encampments in Los Angeles, Portland, Seattle, and other cities have become semi-permanent features of the urban landscape — some with hundreds of tents, informal governance structures, mutual aid networks, and resident-led safety systems. Some advocates, including organizations like the Los Angeles Community Action Network, argue that encampments should be recognized and supported with sanitation, security, and services rather than swept. Others, including many housed residents and business owners, see them as dangerous, unsanitary, and a visible sign of government failure. Should encampments be tolerated, supported, or removed?",
    options: [
      { id: "A", text: "Supported — until housing is available, encampments are where people live; providing sanitation, electricity, and services is more humane and cheaper than repeated sweeps" },
      { id: "B", text: "Removed — encampments are unsafe for their residents and surrounding communities; tolerating them normalizes a crisis and reduces pressure on government to build real solutions" },
      { id: "C", text: "Neither tolerated nor removed — the answer is building alternatives fast enough that encampments aren't necessary; sanctioned camping sites with services as a bridge to housing" },
      { id: "D", text: "The framing treats encampments as the problem, not the symptom — asking \"what do we do about tents\" avoids asking \"what do we do about 653,000 people with no homes\"" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "The U.S. closed most of its state psychiatric hospitals between 1955 and 1994 — from a peak of 559,000 beds to fewer than 38,000 — as part of deinstitutionalization. The promise was that community mental health centers would replace them. The federal funding for those centers never fully materialized. Today, the largest psychiatric facilities in the U.S. are jails: Los Angeles County Jail, Cook County Jail in Chicago, and Rikers Island in New York. Should involuntary psychiatric treatment for homeless people with severe mental illness be expanded?",
    options: [
      { id: "A", text: "Yes — leaving severely psychotic people to die on the street in the name of \"autonomy\" is not compassion; it's abandonment; some people are too ill to consent to treatment they desperately need" },
      { id: "B", text: "No — involuntary commitment has a horrific history of racial bias, political abuse, and warehousing; expanding it without fixing the system that failed these people is repeating the same mistake" },
      { id: "C", text: "Only with rigorous safeguards — time-limited holds, judicial review, patient advocates, and a genuine treatment pathway, not just a locked ward; the devil is entirely in the implementation" },
      { id: "D", text: "The question is a false choice created by decades of defunding — if community mental health had been funded as promised, involuntary treatment wouldn't be necessary for most of these individuals" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "Who should have the power to decide when someone is \"too ill to consent\" — a judge, a psychiatrist, a family member, a social worker? And what prevents that power from being abused against people who are just poor, inconvenient, or non-conforming?",
      },
    },
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "In 2023, Houston became the national model for reducing homelessness — cutting its homeless population by 64% since 2011 through a coordinated approach: centralized data systems, rapid rehousing, and a coalition of 100+ organizations working from a single \"by-name\" list. The approach was championed by civic leader Marc Katz and required unprecedented collaboration between nonprofits, government, and the private sector. But Houston also has cheap land and lax zoning — conditions that don't exist in coastal cities. Is Houston's success replicable?",
    options: [
      { id: "A", text: "Yes — the core elements (coordination, data, political will, housing-focused approach) can work anywhere; the cheap land just made it easier; the methodology is the innovation" },
      { id: "B", text: "Only partially — the coordination model is transferable but the results depend heavily on housing costs; coastal cities can't replicate a 64% reduction without building far more affordable housing first" },
      { id: "C", text: "The real lesson isn't the program design — it's that Houston treated homelessness as a solvable logistics problem rather than a moral or political one; that mindset is what other cities are missing" },
      { id: "D", text: "Houston's numbers look good but may overstate success — rapid rehousing sometimes means people cycle back into homelessness; long-term retention data is less impressive than the headline reduction" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q8",
    topic: TOPIC,
    text: "Veterans, youth aging out of foster care, domestic violence survivors, and people leaving incarceration are all at dramatically elevated risk of homelessness. The VA's SSVF (Supportive Services for Veteran Families) program helped cut veteran homelessness by nearly 55% between 2010 and 2023. No comparable targeted program exists for the other high-risk groups. Should homelessness policy be universal or targeted at specific populations?",
    options: [
      { id: "A", text: "Targeted — different populations need different interventions; a veteran, a foster youth, and a domestic violence survivor don't need the same program; precision matters more than universality" },
      { id: "B", text: "Universal — targeting creates bureaucratic gatekeeping about who \"deserves\" help; housing is a right for everyone, and the system should treat it that way" },
      { id: "C", text: "Both — universal access to housing as a baseline, with targeted wraparound services for populations with specific needs; the VA model works because it layers targeted support on top of housing" },
      { id: "D", text: "The veteran success story proves the real variable is political will — we solved veteran homelessness because veterans are politically sympathetic; the same resources directed at any group would show similar results" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q9",
    topic: TOPIC,
    text: "What's the homelessness question nobody is asking loudly enough?",
    freeformOnly: true,
  },
];

export const homelessnessQuiz = {
  topic: TOPIC,
  topicLabel: "Homelessness",
  questions: main,
  followupQuestions,
};
