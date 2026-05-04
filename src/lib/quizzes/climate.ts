import type { AnyQuestion, Question } from "../types";

const TOPIC = "climate";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q1a: {
    id: "q1a",
    topic: TOPIC,
    text: "The largest carbon removal plant in the world — Climeworks' Mammoth facility in Iceland — captures about 36,000 tons of CO₂ per year. Global emissions are roughly 37 billion tons. Critics like climate scientist Kevin Anderson argue that carbon removal gives fossil fuel companies an excuse to delay real cuts. Is that a dealbreaker?",
    options: [
      { id: "A", text: "No — we need every tool, including imperfect ones with bad-faith supporters; scale will come" },
      { id: "B", text: "Yes — moral hazard is real, and betting on unproven tech at planetary scale is how we got here" },
      { id: "C", text: "Depends on who controls it — publicly funded carbon removal is fundamentally different from Occidental Petroleum's version" },
      { id: "D", text: "The question is sequencing — removal makes sense after we've slashed emissions, not as a substitute for cutting them" },
      f("None of these / I see it differently"),
    ],
  },
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "In 2023, Mexico banned solar geoengineering experiments after a U.S. startup, Make Sunsets, launched sulfur dioxide balloons from Baja California without government approval. If a country facing mass casualties from extreme heat — say India during a 50°C heat wave — decided to unilaterally geoengineer, would that be justified?",
    options: [
      { id: "A", text: "Yes — a country watching its people die from a crisis it didn't cause has every right to act" },
      { id: "B", text: "No — unilateral geoengineering could devastate rainfall patterns across Africa and Asia; it's a global decision, not a national one" },
      { id: "C", text: "It would be understandable but catastrophic — which is exactly why governance frameworks need to exist before the crisis hits" },
      { id: "D", text: "The fact that we can imagine this scenario and have no institutional answer is itself the indictment of the current system" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2015, 196 nations signed the Paris Agreement to limit warming to 1.5°C. In 2023, the UN's Global Stocktake confirmed that no major country is on track. The IPCC's latest synthesis report says 1.5°C will likely be breached in the early 2030s. Given that — what's the most honest response?",
    options: [
      { id: "A", text: "Double down on the target — overshoot is temporary if we hit net-zero and deploy carbon removal at scale" },
      { id: "B", text: "Shift focus to adaptation — mitigation alone won't save the most vulnerable, and pretending otherwise is cruel" },
      { id: "C", text: "The target was always political theater — what matters is the rate of emissions decline, not an arbitrary number" },
      { id: "D", text: "The real failure is structural — no amount of target-setting works when the global economic system rewards extraction" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q1a" }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2023, Germany shut down its last three nuclear plants — a decision made after Fukushima in 2011 — while burning more lignite coal to fill the gap. France kept its 56 reactors online and has one of the lowest-carbon electricity grids in Europe. The IEA now says nuclear capacity needs to double by 2050 to hit net-zero. Is nuclear part of the climate solution?",
    options: [
      { id: "A", text: "Yes — physics doesn't care about public sentiment; nuclear is the densest, most reliable clean energy source we have" },
      { id: "B", text: "No — too slow to build, too expensive per megawatt, and solar and wind have already won on cost curves" },
      { id: "C", text: "Existing plants should stay open, but new builds are a distraction from deploying renewables and storage faster" },
      { id: "D", text: "The nuclear debate is a proxy war — the real question is whether you trust centralized or distributed energy systems" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "Centralized vs. distributed — which do you trust more with something as critical as energy infrastructure, and why?",
      }
    },
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "At COP27, developing nations won a historic agreement creating a \"loss and damage\" fund — acknowledging that rich countries that industrialized first owe compensation. A year later, the fund had received $700 million in pledges against an estimated $400 billion per year in climate damages to the Global South. India's Narendra Modi has repeatedly argued that developing nations have the right to use fossil fuels to lift their populations out of poverty, just as the West did. Who's right?",
    options: [
      { id: "A", text: "The West — physics doesn't grant moral exemptions; atmospheric limits are absolute regardless of who caused the problem" },
      { id: "B", text: "Developing nations — demanding they stay poor to fix a crisis they didn't create is colonial logic in green clothing" },
      { id: "C", text: "Both are right, which is why massive, binding wealth transfers from rich to poor nations are the only ethical path forward" },
      { id: "D", text: "The nation-vs-nation framing is wrong — the real divide is the global rich vs. everyone else, regardless of which country they live in" },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "Rich countries have been promising climate finance for decades — $100 billion/year was pledged in 2009 and still not fully delivered by 2023. What would actually make them pay?",
      }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Harvard's Solar Geoengineering Research Program, led by David Keith, has studied stratospheric aerosol injection — spraying reflective particles into the upper atmosphere to reflect sunlight and cool the planet. It could work within months and cost as little as $2 billion per year. But it doesn't reduce CO₂, carries unknown risks to monsoon patterns, and any country could do it unilaterally. Your instinct?",
    options: [
      { id: "A", text: "Terrifying but probably necessary — we're running out of time for clean solutions alone" },
      { id: "B", text: "A moral hazard on a planetary scale — it lets governments and corporations avoid the hard structural changes" },
      { id: "C", text: "The governance problem is the real issue — who gets to set the thermostat for 8 billion people, and who's liable when it goes wrong?" },
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
    text: "Just Stop Oil activists threw tomato soup on Van Gogh's Sunflowers in London's National Gallery. Extinction Rebellion blocked bridges across central London for weeks. Scientist Peter Kalmus chained himself to a JPMorgan Chase building, weeping, saying \"we're going to lose everything.\" Polling shows these actions consistently lower public support for climate policy. Does radical protest help or hurt the cause?",
    options: [
      { id: "A", text: "Helps — every successful movement from suffragettes to civil rights had a radical flank that made moderates look reasonable by comparison" },
      { id: "B", text: "Hurts — the polling is clear; it alienates persuadable people and gives opponents easy ammunition" },
      { id: "C", text: "Wrong question — \"does it help the cause\" is a PR frame; the real question is whether the scale of the emergency warrants disruption, and it does" },
      { id: "D", text: "Depends entirely on the target — throwing soup on a painting is theater; disrupting a shareholder meeting or pipeline construction is strategy" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Shell's CEO Wael Sawan said in 2023 that cutting oil production would be \"dangerous and irresponsible.\" That same year, Shell reported $28 billion in profits. Meanwhile, the company's own scientists accurately predicted climate change in the 1980s. TotalEnergies, BP, and ExxonMobil have all scaled back or quietly abandoned their renewable energy targets. Should fossil fuel companies be held legally liable for climate damages?",
    options: [
      { id: "A", text: "Yes — they knew, they lied, they profited; this is the tobacco litigation model and it applies directly" },
      { id: "B", text: "No — consumers demanded the product; holding companies liable for meeting demand sets a dangerous legal precedent" },
      { id: "C", text: "Legal liability is the wrong tool — what's needed is regulatory force: windfall taxes, mandatory transition plans, stranded asset write-downs" },
      { id: "D", text: "Liability is satisfying but insufficient — the fossil fuel economy is a system, not a conspiracy; suing Shell doesn't change the structure that created Shell" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "If you could force one country, one company, or one institution to change one specific thing about how they handle climate — who, and what?",
    freeformOnly: true,
  },
];

export const climateQuiz = {
  topic: TOPIC,
  topicLabel: "Climate",
  questions: main,
  followupQuestions,
};
