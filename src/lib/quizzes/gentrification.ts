import type { AnyQuestion, Question } from "../types";

const TOPIC = "gentrification";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "So here's the thing. Economists love to say \"just build more housing.\" And in theory, sure. More supply, lower prices. Econ 101.\n\nBut look at what actually gets built in high-demand neighborhoods. It's almost always luxury or market-rate. Inclusionary zoning, where cities require developers to set aside some affordable units, has produced modest results at best. The market, left to its own devices, does not build housing for people making $40,000 a year.\n\nSo if the market won't do it on its own, what's the actual mechanism?",
    options: [
      { id: "A", text: "Public housing, built by the government directly. Vienna does this and 60% of residents live in subsidized housing." },
      { id: "B", text: "Upzone aggressively and let filtering work. Today's luxury building becomes tomorrow's affordable one in 30 years." },
      { id: "C", text: "Community land trusts. Take land out of the speculative market permanently and let communities control what gets built." },
      { id: "D", text: "No single tool works. You need public housing, land trusts, vouchers, and market-rate construction all at once." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Between 2000 and 2013, roughly 135,000 people were pushed out of gentrifying neighborhoods across the U.S. That's a small city's worth of people, gone.\n\nTake Brooklyn's Williamsburg. Median rent tripled between 2000 and 2020. The Latino population dropped 30%. But here's the twist: property values in those same blocks skyrocketed, making some working-class families who bought homes decades ago suddenly wealthy on paper.\n\nThe same process that destroys one family's community builds another family's retirement fund. When a neighborhood \"improves\" economically and longtime renters get priced out, what's actually happening?",
    options: [
      { id: "A", text: "It's displacement, plain and simple. Rising rents forcing people from their homes is harm, no matter what moves in." },
      { id: "B", text: "It's development. Cities change and neighborhoods evolve. Freezing a place in time isn't possible or desirable." },
      { id: "C", text: "It depends who you ask. Homeowners gain wealth, renters lose homes. Same process, opposite experience." },
      { id: "D", text: "Both frames miss the root cause. Gentrification is a symptom of housing scarcity. Build enough and demand doesn't require displacement." },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "The \"just build more\" argument treats displacement as mainly a supply problem. But when new construction in gentrifying neighborhoods is overwhelmingly luxury housing, does building more actually help the people being pushed out? Or does it just accelerate the transformation?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Austin, Texas. In 2015, the median home cost $220,000. By 2023, it passed $500,000. That's not inflation. That's a city being repriced.\n\nA huge driver was tech workers relocating from San Francisco and the Bay Area. East Austin, a historically Black and Latino community literally shaped by redlining and segregation, saw some of the fastest price spikes. Taquerias and barbershops gave way to craft breweries and co-working spaces.\n\nBut wait, really? Should we romanticize neighborhoods that only existed because racist housing policy forced people into them? Here's the tension: those communities were born from injustice AND the bonds people built inside them are real.\n\nIs cultural displacement a genuine harm, or nostalgia for something that was itself a product of racism?",
    options: [
      { id: "A", text: "It's a real harm. Community takes generations to build. Displacing the people who created a culture destroys something irreplaceable." },
      { id: "B", text: "It's complicated. These neighborhoods were created by segregation. Romanticizing them ignores that residents had no choice." },
      { id: "C", text: "Both are true. The neighborhoods were shaped by racism AND the communities built within those constraints are real and worth protecting." },
      { id: "D", text: "Cultural displacement distracts from economics. What matters is whether people can afford to stay. If they can, culture evolves naturally." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Here's a fun fact that will ruin your next dinner party. Economists who agree on almost nothing else, from Paul Krugman on the left to Milton Friedman on the right, have historically agreed on this: rent control is bad policy.\n\nTheir argument? It shrinks the housing supply and helps current renters at the expense of future ones. And there's evidence. A 2019 Stanford study of San Francisco's rent control found it reduced displacement by 15%. Great. But it also reduced the rental housing supply by 15%, because landlords converted apartments to condos.\n\nSo rent control simultaneously kept people in their homes AND removed homes from the market. The same policy. Opposite effects.\n\nTenant advocates say the alternative, doing nothing, is mass displacement. Is rent control good policy?",
    options: [
      { id: "A", text: "Yes. Economic models treat displacement as costless. For real people losing homes, rent control is the most direct protection." },
      { id: "B", text: "No. The evidence is clear it reduces supply long-term. The cure is worse than the disease. Build more housing instead." },
      { id: "C", text: "It's a necessary stopgap but terrible long-term. Use it to prevent immediate displacement while building more housing." },
      { id: "D", text: "The real question is deeper: should housing be a commodity or a right? If it's a right, rent control is a patch on a broken system." },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "The \"15-minute city\" is this idea, championed by urbanist Carlos Moreno and adopted by Paris, that everything you need should be within a 15-minute walk or bike ride. Work, groceries, healthcare, school, a park.\n\nSounds lovely, right? Some conservative critics have called it an \"open-air prison\" designed to restrict movement. That's... a stretch. It's just good urban design that reduces car dependency.\n\nBut here's what's actually interesting. The neighborhoods that come closest to this ideal are already the most expensive ones. Walk Score correlates almost perfectly with housing cost. In other words, the thing that would benefit everyone most has been captured as a luxury good.\n\nIs walkability a public good or a luxury amenity?",
    options: [
      { id: "A", text: "It's a public good being captured as luxury. Walkable neighborhoods are expensive because they're rare. Build more and the premium disappears." },
      { id: "B", text: "It's inherently a luxury. The infrastructure required costs money that poor neighborhoods don't get. Walkability reflects existing inequality." },
      { id: "C", text: "The premium is a market signal. People want this and will pay for it. Remove zoning barriers and let the market respond." },
      { id: "D", text: "The concept is sound but naive. Improving a neighborhood's livability raises its cost unless you simultaneously lock in affordability." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In the 1960s and 70s, the U.S. government bulldozed thousands of homes and businesses in Black neighborhoods. They called it \"urban renewal.\" James Baldwin called it \"Negro removal.\"\n\nHighways were deliberately routed through Black communities in Detroit, Atlanta, and the Bronx, splitting neighborhoods in half like a knife through a living thing. This wasn't accidental. It was policy.\n\nWait, really? Yes. Engineers chose those routes specifically because the land was \"cheap\" (because redlining had suppressed property values) and because the affected residents had the least political power to fight back.\n\nNow, decades later, some of those same neighborhoods are gentrifying. And the language of \"revitalization\" and \"renewal\" has returned, wearing nicer clothes.\n\nHow should that history of deliberate destruction shape how we think about neighborhood change today?",
    options: [
      { id: "A", text: "It should be central. Gentrification in bulldozed and redlined neighborhoods is a second displacement of the same communities. History makes it worse." },
      { id: "B", text: "History matters but can't paralyze us. Every neighborhood has a painful past. Acknowledge it, but allow change if current residents benefit." },
      { id: "C", text: "The history demands reparative policy. Not just preventing displacement, but actively returning wealth and power to destroyed communities." },
      { id: "D", text: "The parallel proves top-down \"improvement\" always serves outside interests. The only ethical development is community-controlled development." },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "Let's get concrete. What would reparative housing policy actually look like? Who receives what, who decides, and where does the money come from? The devil lives entirely in these details.",
      }
    },
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Between 2020 and 2023, BlackRock, Invitation Homes, and other institutional investors bought over 100,000 single-family homes in the U.S. They didn't do it with mortgages. They showed up with all-cash offers and outbid regular families. In some Sun Belt markets, institutional buyers accounted for more than 25% of all home purchases. One in four homes.\n\nThink about that. A quarter of the homes in some cities were bought not by people who wanted to live in them, but by corporations looking to convert them into rental properties and extract steady returns for shareholders.\n\nMeanwhile, homeownership rates for Americans under 35 are at historic lows. An entire generation is being locked out of the primary wealth-building mechanism their parents relied on.\n\nIs Wall Street buying up the housing stock a market efficiency or a systemic threat?",
    options: [
      { id: "A", text: "Systemic threat. Housing shouldn't be a financial asset at this scale. It concentrates wealth, raises rents, and locks out a generation." },
      { id: "B", text: "Market efficiency. Institutional landlords provide professionally managed rentals. Banning corporate buyers won't fix the underlying supply shortage." },
      { id: "C", text: "The problem is incentives. When housing appreciates faster than wages, capital rushes in. Fix that dynamic through supply and taxation." },
      { id: "D", text: "This is the financialization endgame. Housing, healthcare, education all became investment vehicles. Housing is just the most visible symptom." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Think about a neighborhood you know well that has changed significantly. Not one you read about. One you've watched with your own eyes.\n\nWho benefited? Who was harmed? And here's the hard question: was there a version of that change that could have worked for everyone, or is someone always going to lose?",
    freeformOnly: true,
  },
];

export const gentrificationQuiz = {
  topic: TOPIC,
  topicLabel: "Who Gets to Stay?",
  questions: main,
  followupQuestions,
};
