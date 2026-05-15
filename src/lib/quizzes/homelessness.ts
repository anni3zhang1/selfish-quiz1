import type { AnyQuestion, Question } from "../types";

const TOPIC = "homelessness";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "So here's the idea behind \"Housing First\": you give people a permanent home with zero preconditions. No sobriety test, no job requirement, no treatment plan. Just... a home. Dr. Sam Tsemberis built this model in the 1990s through Pathways to Housing in New York, and studies show 80-90% of people stay housed.\n\nBut wait. Critics say it's like giving someone a bandage without cleaning the wound. You've got a roof, sure, but the addiction, the trauma, the untreated schizophrenia... those are still right there in the apartment with you.\n\nIs housing alone enough, or does it need to come packaged with something more?",
    options: [
      { id: "A", text: "Housing is the foundation. Everything else becomes possible once you have a safe, stable place." },
      { id: "B", text: "Housing without mental health care and job support is just warehousing people in nicer boxes." },
      { id: "C", text: "Works for many, but people with severe mental illness may need structured environments, not apartments." },
      { id: "D", text: "It's a downstream fix. We should invest upstream so fewer people fall into crisis at all." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's a number that should stop you cold: 653,000 people were experiencing homelessness in the U.S. in January 2023. That's the highest count since we started tracking in 2007. It keeps going up, every single year since 2017.\n\nNow here's where it gets weird. California has 12% of the U.S. population but nearly 30% of all homeless people. Meanwhile, states with comparable poverty rates but cheaper housing have a fraction of the problem.\n\nSo what's actually driving this? Is it a housing problem, a mental health problem, a substance abuse problem, or something else entirely?",
    options: [
      { id: "A", text: "Housing costs. The cities with the most expensive rent have the most homelessness. Full stop." },
      { id: "B", text: "Mental illness and addiction. Many chronically homeless people need treatment, not just apartments." },
      { id: "C", text: "Both, and they feed each other. High rents push vulnerable people out, then illness traps them." },
      { id: "D", text: "It's every system failing at once: healthcare, housing, education, criminal justice, all of it." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In June 2024, the Supreme Court ruled 6-3 that cities can make it illegal to sleep outside, even when there are no shelter beds available. Think about that for a second. It's illegal to sleep on the sidewalk, and there's nowhere else to go.\n\nJustice Sotomayor's dissent put it bluntly: this punishes people for being homeless. Within weeks, cities like Portland, San Francisco, and Los Angeles started bulldozing encampments.\n\nSo the question lands on you. When someone has no home, no bed, and no legal place to exist at night... is criminalization ever the right tool?",
    options: [
      { id: "A", text: "Never. You can't arrest your way out of a housing crisis. Sweeps just relocate suffering." },
      { id: "B", text: "Sometimes. Encampments create real public health hazards. Nearby residents have legitimate concerns too." },
      { id: "C", text: "Only when real alternatives exist. Enforcement without available shelter and treatment is just cruelty." },
      { id: "D", text: "The fact we're debating whether to arrest homeless people instead of house them says everything." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Finland did something that basically no other country has pulled off: homelessness went down. Not by a little. By over 35% between 2008 and 2023. It's the only EU country where the trend line keeps falling.\n\nHow? They spent about €250 million converting shelters into permanent apartments. No preconditions, no hoops. They called it Housing First and they actually meant it.\n\nBut here's the asterisk everyone reaches for: Finland has 5.5 million people. Universal healthcare. A strong safety net. The U.S. has 330 million people and... doesn't.\n\nSo is this a blueprint, or a fairy tale from a country too different to compare?",
    options: [
      { id: "A", text: "The core insight transfers anywhere. What's missing in the U.S. is political will, not knowledge." },
      { id: "B", text: "Not transferable. Finland is small with universal healthcare. The U.S. has none of those conditions." },
      { id: "C", text: "The housing part works, but the U.S. would need to fix healthcare and the safety net simultaneously." },
      { id: "D", text: "Calling Finland 'different' is a way to dodge the real question: why does the U.S. choose not to solve this?" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Walk through parts of Los Angeles, Portland, or Seattle and you'll see something that wasn't supposed to become permanent: tent cities with hundreds of residents, informal governance, mutual aid networks, even resident-led safety patrols. These aren't temporary. Some have existed for years.\n\nAdvocates like the Los Angeles Community Action Network say: stop sweeping these. Bring in toilets, electricity, and caseworkers. Meet people where they literally are.\n\nBut business owners and housed neighbors say: this is dangerous, unsanitary, and a neon sign of government failure. Tolerating it lets politicians off the hook.\n\nWhat should happen with encampments?",
    options: [
      { id: "A", text: "Support them. Sanitation and services are more humane and cheaper than endlessly sweeping people around." },
      { id: "B", text: "Remove them. Tolerating encampments normalizes the crisis and reduces pressure to build real solutions." },
      { id: "C", text: "Build alternatives fast enough that encampments aren't necessary. Sanctioned sites as a bridge to housing." },
      { id: "D", text: "Asking 'what do we do about tents' avoids the real question: what do we do about 653,000 unhoused people?" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Between 1955 and 1994, the U.S. shut down most of its state psychiatric hospitals. We went from 559,000 beds to fewer than 38,000. The promise was that community mental health centers would replace them.\n\nThe centers never got funded. So where did all those people go?\n\nHere's where: today, the three largest psychiatric facilities in America are jails. Los Angeles County Jail. Cook County Jail in Chicago. Rikers Island in New York. We didn't end institutionalization. We just moved it behind bars.\n\nSo now the question: should we expand involuntary psychiatric treatment for homeless people with severe mental illness?",
    options: [
      { id: "A", text: "Yes. Leaving psychotic people to die on streets in the name of 'autonomy' is abandonment, not compassion." },
      { id: "B", text: "No. Involuntary commitment has a horrific history of racial bias and abuse. Expanding it repeats the mistake." },
      { id: "C", text: "Only with rigorous safeguards: time limits, judicial review, patient advocates, and a real treatment pathway." },
      { id: "D", text: "If community mental health had been funded as promised, forced treatment wouldn't be necessary for most people." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "So who gets to make that call? A judge? A psychiatrist? A family member? A social worker?\n\nAnd here's the harder question underneath it: what stops that power from being used against people who aren't dangerously ill but are just poor, inconvenient, or living in ways that make others uncomfortable?",
      }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Not everyone faces the same odds of ending up on the street. Veterans, kids aging out of foster care, domestic violence survivors, people leaving prison... these groups are wildly overrepresented.\n\nAnd here's the thing: we actually solved one of them. The VA's SSVF program cut veteran homelessness by nearly 55% between 2010 and 2023. That's not a rounding error. That's a population-level result.\n\nBut no comparable program exists for foster youth, or DV survivors, or people leaving incarceration. So should policy be universal, or should we keep targeting specific groups?",
    options: [
      { id: "A", text: "Targeted. A veteran, a foster youth, and a DV survivor need different interventions. Precision matters." },
      { id: "B", text: "Universal. Targeting creates gatekeeping about who 'deserves' help. Housing should be a right for everyone." },
      { id: "C", text: "Both. Universal housing as baseline, with targeted services layered on top. That's why the VA model works." },
      { id: "D", text: "The veteran success proves the variable is political sympathy. The same resources for any group would work." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and it's all you.\n\nYou've got a billion dollars and five years to cut homelessness in one U.S. city by 50%. Not in theory. In practice. What do you actually spend it on? Be specific.",
    freeformOnly: true,
  },
];

export const homelessnessQuiz = {
  topic: TOPIC,
  topicLabel: "More Empty Homes Than Homeless People",
  questions: main,
  followupQuestions,
};
