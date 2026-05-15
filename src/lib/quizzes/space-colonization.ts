import type { AnyQuestion, Question } from "../types";

const TOPIC = "space_colonization";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "Here's the thing that bugs me about this. Private companies are literally building the infrastructure of orbit right now, today, while diplomats are still writing position papers.\n\nRegulation after the fact is like putting up a speed limit sign on a highway that's already been built and driven on for a decade. You can do it, but nobody's going to slow down voluntarily. And enforcement in orbit? There's no space police. There's no coast guard up there.\n\nSo is meaningful space governance even possible at this point? And if so, where do you actually apply the leverage?",
    options: [
      { id: "A", text: "Control the launchpad, not the orbit. You can't get to space without ground infrastructure, so regulate access at the source." },
      { id: "B", text: "Make recklessness expensive. Build an international liability framework where irresponsible orbital behavior costs you billions." },
      { id: "C", text: "Treat orbital slots like radio spectrum. Auction them, create tradeable rights, enforce de-orbiting through a global body." },
      { id: "D", text: "It's already too late. Industry self-governance with transparency requirements is the only realistic path now." },
      f("I see a different way to think about this"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Let me give you some numbers and see if your brain does what mine does.\n\nNASA's Artemis program: $93 billion to get humans back to the Moon by 2026. SpaceX's Starship completed its first orbital test in 2024 and is designed to eventually carry people to Mars. Elon Musk says humanity will be \"multiplanetary\" within decades.\n\nNow hold that thought. The UN estimates it would cost about $30 billion per year to end world hunger. Per year. So roughly one-third of the Artemis budget, repeated annually, and nobody on Earth goes hungry.\n\nWait, really? We're spending three times the cost of feeding everyone alive on getting a few people to a rock with no atmosphere?\n\nBut here's where it gets interesting. That comparison feels devastating, but is it actually the right comparison? Is space colonization a visionary survival strategy or a spectacularly expensive distraction?",
    options: [
      { id: "A", text: "Visionary. Asteroids, pandemics, nuclear war. A single-planet species is eventually a dead species. Redundancy is survival." },
      { id: "B", text: "Misallocation. Spending billions to escape Earth while billions suffer on it is morally indefensible. Fix this planet first." },
      { id: "C", text: "False choice. Space tech gives us solar, water purification, materials science. The investment pays off on Earth too." },
      { id: "D", text: "Wrong question. When billionaires and military contractors lead, space colonization just reproduces Earth's power structures offworld." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "Okay, the existential risk argument is compelling. But let's stress-test it.\n\nMars has no magnetic field. The soil is laced with perchlorates that are toxic to humans. It takes seven months to get there, and if something goes wrong, nobody is coming to help.\n\nSo here's my honest question: is Mars colonization actually a realistic survival strategy on any meaningful timeline, or is it a thought experiment that we've started treating as engineering?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "This one is wild when you really think about it.\n\nIn 1967, 114 countries signed the Outer Space Treaty. It says, plain as day, that space \"is not subject to national appropriation.\" Nobody owns space. Done.\n\nBut then in 2015, the U.S. passed a law granting American citizens the right to own resources they extract from asteroids. Luxembourg did the same thing in 2017. And nobody blinked.\n\nNow here's the part that makes this more than theoretical. A single metallic asteroid can contain trillions of dollars worth of platinum-group metals. Trillions. That's not a typo. One rock floating in space could be worth more than the GDP of most countries.\n\nSo we have a treaty that says nobody owns space, and national laws that say you can keep what you grab from it. Who's right? And more importantly, who actually gets the platinum?",
    options: [
      { id: "A", text: "Whoever extracts the resources owns them. Property rights drive investment. Without ownership, nobody spends billions on extraction tech." },
      { id: "B", text: "Everyone owns them. Space is humanity's common heritage. Manage it like deep-sea minerals under international law." },
      { id: "C", text: "We need new rules entirely. The 1967 treaty wasn't built for commercial extraction. Write the framework before the race starts." },
      { id: "D", text: "The precedent matters more than the platinum. Whoever writes asteroid mining rules writes the template for all space governance." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Let me paint you a picture of what's happening above your head right now.\n\nSpaceX has launched over 6,000 Starlink satellites as of 2024. Six thousand. Astronomers are furious because these bright streaking objects are degrading their ability to observe the universe. Imagine spending your career building a telescope and then someone parks a used car lot in your line of sight.\n\nBut here's the part that should genuinely worry you. There are over 30,000 tracked pieces of debris in orbit. And there's this concept called the Kessler Syndrome: one collision creates debris, that debris causes more collisions, which creates more debris, and eventually entire orbital bands become unusable. It's a chain reaction. Like dominoes, except the dominoes are moving at 17,000 miles per hour.\n\nSo who governs orbit? Because right now the answer is basically... nobody.",
    options: [
      { id: "A", text: "An international body. Orbit is shared like international waters. No single company or country should fill it unilaterally." },
      { id: "B", text: "The market, plus liability rules. Make companies pay for debris and collisions. Financial pain will self-regulate behavior." },
      { id: "C", text: "National regulators with treaties. The FAA model. Each country licenses its launches, treaties set minimum standards." },
      { id: "D", text: "First movers already decided. SpaceX occupies orbit the way tech platforms occupy markets. Governance will arrive too late." },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Here's a problem nobody in the rocket business likes to talk about.\n\nNASA's Mars mission planning assumes 4 to 6 people sealed in a habitat for 2 to 3 years. No resupply. No rescue. If someone snaps, there's nowhere to go. If a conflict escalates, you can't separate people. You're in a tin can the size of a studio apartment, 140 million miles from the nearest therapist.\n\nAnd we already know what happens. Research from Antarctic stations and submarine crews shows that isolation, confinement, and communication delays (up to 24 minutes each way for Mars) produce severe interpersonal conflict and real mental health deterioration. These are trained military personnel falling apart. Now imagine civilians.\n\nSo forget the rockets for a second. How do you govern a place where leaving isn't an option, help isn't coming, and every decision is life or death?",
    options: [
      { id: "A", text: "Military hierarchy. In survival conditions with no rescue, clear chain of command isn't authoritarian. It's necessary." },
      { id: "B", text: "Direct democracy from day one. A colony is a new society. Colonists should govern themselves and set that precedent." },
      { id: "C", text: "Corporate governance. If SpaceX funds the mission, SpaceX sets the rules. That's how investment works." },
      { id: "D", text: "The real stakes: whoever writes the first colony's rules writes humanity's offworld constitution. Too important for one CEO or general." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "This is the question that keeps astrobiologists up at night.\n\nIn 2020, scientists detected phosphine in Venus's atmosphere. Phosphine. On Earth, the only way you get phosphine is from living things or industrial processes. Venus doesn't have factories. The finding is still contested, but the implication hit like a thunderbolt.\n\nNASA's Europa Clipper launched in 2024 to investigate whether Jupiter's moon Europa has conditions for life beneath miles of ice. There might be a warm ocean down there, right now, with things swimming in it. We don't know.\n\nNow here's where it gets uncomfortable. If we find microbial life on Mars or Europa, it would be the most significant discovery in human history. Full stop. But it immediately creates a brutal practical question.\n\nShould we continue colonization plans that might contaminate or destroy the only other life we've ever found?",
    options: [
      { id: "A", text: "Halt everything. Extraterrestrial life, even microbial, has intrinsic value that outweighs any colonization timeline. Contamination is forever." },
      { id: "B", text: "Proceed carefully. We can study and protect alien life while establishing a presence. Planetary protection protocols already exist." },
      { id: "C", text: "It depends what we find. Microbes on Mars aren't the same as a complex ecosystem on Europa. Response should match discovery." },
      { id: "D", text: "Look at our track record. Humans have never found a new ecosystem and protected it. Why would another planet be different?" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Jeff Bezos has this vision. Move all heavy industry off Earth. Manufacturing in orbit. Mining asteroids. Turn the whole planet into a nature preserve where people just... live. His company Blue Origin is building orbital habitats based on designs physicist Gerard O'Neill sketched in the 1970s.\n\nSounds beautiful, right? Earth as a garden. Humanity expanding outward.\n\nBut then there's philosopher Daniel Deudney, who wrote a book called Dark Skies in 2020 arguing the exact opposite. He says space colonization won't reduce existential risk. It will increase it. More territory means more conflict. Weapons in orbit. Resource wars between colonies. We wouldn't be escaping our worst patterns. We'd be exporting them to a place where the consequences are even harder to contain.\n\nTwo smart people. Two completely opposite conclusions from the same set of facts.\n\nIs expanding into space more likely to save us or endanger us?",
    options: [
      { id: "A", text: "Save us. Diversifying beyond one planet is literally the definition of reducing existential risk. Everything else is secondary." },
      { id: "B", text: "Endanger us. Militarized orbits, new territorial conflicts, humanity's worst patterns on new frontiers. Deudney is right." },
      { id: "C", text: "Both simultaneously. Space reduces some risks (asteroid impact) and increases others (orbital weapons). Net effect depends on governance." },
      { id: "D", text: "We don't have a choice. If the U.S. doesn't pursue space dominance, China and Russia will. Competition already decided this." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and this time I want to hear you think out loud.\n\nImagine you're selecting the first 100 colonists for a permanent Mars settlement. You get to pick one criterion that matters most. Just one.\n\nDo you pick for technical skill? Psychological resilience? Genetic diversity? Cultural representation? Willingness to never come back?\n\nWhat's your single most important criterion, and what does your answer reveal about what you think a society actually needs most to survive?",
    freeformOnly: true,
  },
];

export const spaceColonizationQuiz = {
  topic: TOPIC,
  topicLabel: "Should We Leave Earth?",
  questions: main,
  followupQuestions,
};
