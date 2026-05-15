import type { AnyQuestion, Question } from "../types";

const TOPIC = "climate";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "Here's the scale problem. The largest carbon removal plant on Earth, Climeworks' Mammoth facility in Iceland, captures 36,000 tons of CO2 per year. Sounds impressive until you realize global emissions are 37 billion tons. That's like bailing out a flooding basement with a teaspoon.\n\nClimate scientist Kevin Anderson argues carbon removal is basically a permission slip for fossil fuel companies to keep drilling. Is that a dealbreaker?",
    options: [
      { id: "A", text: "No. We need every tool, even imperfect ones with shady supporters. Scale will come if we invest" },
      { id: "B", text: "Yes. Betting on unproven tech at planetary scale is exactly the kind of thinking that got us here" },
      { id: "C", text: "Depends who controls it. Publicly funded removal is fundamentally different from Occidental Petroleum's version" },
      { id: "D", text: "It's a sequencing problem. Removal makes sense after we've slashed emissions, not as a substitute for cutting" },
      f("None of these / I see it differently"),
    ],
  },
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "In 2023, a U.S. startup called Make Sunsets launched sulfur dioxide balloons from Baja California. No government approval. No consultation. Mexico responded by banning solar geoengineering experiments entirely.\n\nNow imagine this: India hits 50 degrees Celsius. People are dying by the thousands from a crisis India barely contributed to. India decides to geoengineer unilaterally. Is that justified?",
    options: [
      { id: "A", text: "Yes. A country watching its people die from someone else's crisis has every right to act" },
      { id: "B", text: "No. Unilateral geoengineering could wreck rainfall across Africa and Asia. It's a global decision, not national" },
      { id: "C", text: "Understandable but catastrophic. Which is exactly why governance frameworks need to exist before the crisis hits" },
      { id: "D", text: "The fact that we can picture this scenario and have zero institutional answer is the indictment itself" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2015, 196 countries signed the Paris Agreement to limit warming to 1.5 degrees Celsius. Felt historic. Eight years later, the UN's Global Stocktake confirmed that not a single major country is on track. The IPCC says we'll blow past 1.5 degrees in the early 2030s.\n\nWait, really? Every country missed it? Every single one.\n\nSo what's the most honest response to a target the entire world agreed to and then collectively ignored?",
    options: [
      { id: "A", text: "Double down. Overshoot is temporary if we hit net-zero and deploy carbon removal at serious scale" },
      { id: "B", text: "Shift to adaptation. Mitigation alone won't save the most vulnerable. Pretending otherwise is cruel" },
      { id: "C", text: "The target was always theater. What matters is the rate of emissions decline, not an arbitrary number" },
      { id: "D", text: "The failure is structural. No target works when the global economy literally rewards extraction" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2023, Germany shut down its last three nuclear plants. This was a decision made after Fukushima back in 2011. To fill the gap, they burned more lignite coal, which is the dirtiest fossil fuel there is.\n\nMeanwhile France kept its 56 reactors humming. Result? One of the lowest-carbon electricity grids in Europe. The IEA now says nuclear capacity needs to double by 2050 to hit net-zero.\n\nSo Germany traded zero-carbon power for the dirtiest coal on Earth. Is nuclear part of the climate solution or not?",
    options: [
      { id: "A", text: "Yes. Physics doesn't care about public sentiment. Nuclear is the densest, most reliable clean source we have" },
      { id: "B", text: "No. Too slow to build, too expensive per megawatt. Solar and wind already won on cost curves" },
      { id: "C", text: "Keep existing plants running, but new builds are a distraction from deploying renewables and storage faster" },
      { id: "D", text: "The nuclear debate is a proxy war. The real question is centralized vs. distributed energy systems" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "Centralized vs. distributed. When it comes to something as critical as keeping the lights on, which model do you actually trust more, and why?",
      }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "At COP27, developing nations won something historic: a \"loss and damage\" fund. Rich countries finally acknowledged they owe compensation to the places getting wrecked by a crisis they barely caused.\n\nThen the numbers came in. $700 million in pledges against $400 billion per year in actual climate damages to the Global South. That's like totaling someone's car and offering to buy them a bicycle tire.\n\nIndia's Modi keeps making the same argument: developing nations have the right to burn fossil fuels to lift their people out of poverty, exactly the way the West did. Who's right?",
    options: [
      { id: "A", text: "The West. Physics doesn't grant moral exemptions. Atmospheric limits are absolute regardless of who caused it" },
      { id: "B", text: "Developing nations. Demanding they stay poor to fix a crisis they didn't create is colonialism in green clothing" },
      { id: "C", text: "Both are right. Which is why massive, binding wealth transfers from rich to poor nations are the only ethical path" },
      { id: "D", text: "The nation-vs-nation framing is wrong. The real divide is the global rich vs. everyone else, regardless of passport" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "Rich countries promised $100 billion per year in climate finance back in 2009. By 2023 they still hadn't fully delivered. What would actually make them pay up?",
      }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here's a wild idea that actual scientists are studying. Spray reflective particles into the upper atmosphere to bounce sunlight back into space. Cool the planet. Harvard's Solar Geoengineering Research Program has been modeling this for years.\n\nThe kicker: it could work within months and cost as little as $2 billion per year. That's roughly what Americans spend on Halloween candy.\n\nBut it doesn't reduce CO2 at all. It carries unknown risks to monsoon patterns that billions of people depend on. And any single country could just do it on their own. Your gut reaction?",
    options: [
      { id: "A", text: "Terrifying but probably necessary. We're running out of time for clean solutions alone" },
      { id: "B", text: "Moral hazard at planetary scale. It lets governments and corporations skip the hard structural changes" },
      { id: "C", text: "The governance question is the real problem. Who gets to set the thermostat for 8 billion people?" },
      { id: "D", text: "Research it aggressively, but treat deployment as an absolute last resort requiring broad international consent" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Just Stop Oil threw tomato soup on Van Gogh's Sunflowers. Extinction Rebellion blocked bridges across London for weeks. Climate scientist Peter Kalmus chained himself to a JPMorgan Chase building and wept on camera, saying \"we're going to lose everything.\"\n\nHere's the uncomfortable part. Polling consistently shows these actions lower public support for climate policy. The more dramatic the protest, the less people want to help.\n\nSo does radical climate protest actually help, or does it backfire?",
    options: [
      { id: "A", text: "Helps. Every movement from suffragettes to civil rights had a radical flank that made moderates look reasonable" },
      { id: "B", text: "Hurts. The polling is clear. It alienates persuadable people and hands opponents easy ammunition" },
      { id: "C", text: "Wrong question. \"Does it help the cause\" is a PR frame. The real question is whether the emergency warrants disruption" },
      { id: "D", text: "Depends on the target. Soup on a painting is theater. Disrupting a shareholder meeting or pipeline is strategy" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Shell's CEO said in 2023 that cutting oil production would be \"dangerous and irresponsible.\" That same year, Shell made $28 billion in profit. For context, that's roughly $900 every second.\n\nHere's the part that should make your blood boil. Shell's own scientists accurately predicted climate change in the 1980s. They knew. They buried it. They lobbied against regulation for decades.\n\nBP, TotalEnergies, and ExxonMobil have all quietly walked back their renewable energy targets. Should fossil fuel companies be held legally liable for climate damages?",
    options: [
      { id: "A", text: "Yes. They knew, they lied, they profited. This is the tobacco playbook and the same legal logic applies" },
      { id: "B", text: "No. Consumers demanded the product. Holding companies liable for meeting demand sets a dangerous precedent" },
      { id: "C", text: "Liability is the wrong tool. What's needed is regulatory force: windfall taxes, mandatory transition plans, stranded asset write-downs" },
      { id: "D", text: "Satisfying but insufficient. The fossil fuel economy is a system, not a conspiracy. Suing Shell doesn't change the structure" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "You get one move. One country, one company, or one institution. You can force them to change one specific thing about how they handle climate. Who do you pick, and what do you make them do?",
    freeformOnly: true,
  },
];

export const climateQuiz = {
  topic: TOPIC,
  topicLabel: "Who Pays for the Planet?",
  questions: main,
  followupQuestions,
};
