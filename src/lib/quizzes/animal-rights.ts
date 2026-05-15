import type { AnyQuestion, Question } from "../types";

const TOPIC = "animal_rights";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q4a: {
    id: "q4a",
    topic: TOPIC,
    text: "Okay so you said animal testing is justified when lives are on the line. Fair enough. But let's push on where that logic actually leads.\n\nIn 2020, researchers at the University of Pittsburgh grafted fetal scalps onto immunodeficient mice. Neuralink reported roughly 1,500 animals died during its brain-chip experiments between 2018 and 2023. Both teams would tell you the science justified it.\n\nSo here's the question that matters: at what point does the suffering we inflict start exceeding the knowledge we gain? Is there a line, or does \"saving lives\" cover basically anything?",
    options: [
      { id: "A", text: "There's no universal line, and that's why ethics boards exist to judge each experiment individually" },
      { id: "B", text: "The line is cognitive richness. Torturing a primate for a brain chip is indefensible, full stop" },
      { id: "C", text: "Animal testing is only justified when no alternative method exists, and that window keeps shrinking" },
      { id: "D", text: "The ethics review system is broken. Researchers review each other and institutions profit from grants" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's a number that's hard to hold in your head: 80 billion. That's how many land animals get slaughtered for food globally every year. Eighty billion. The population of Earth is 8 billion. So we're killing roughly ten animals per living human, every single year.\n\nNow zoom into the U.S. Over 99% of farmed animals live in factory farms. Chickens get less floor space than a sheet of printer paper. Pigs spend their entire pregnancies in crates too narrow to turn around in. The whole system produces about 14.5% of global greenhouse gas emissions, which is more than every car, truck, ship, and airplane on Earth combined.\n\nAnd yet a 2023 Gallup poll found 47% of Americans believe animals should have the same rights as people. So what's the right moral framework here?",
    options: [
      { id: "A", text: "Factory farming is the largest source of unnecessary suffering on Earth and should be abolished entirely" },
      { id: "B", text: "Animals deserve welfare protections but not rights. Humane treatment yes, moral equivalence no" },
      { id: "C", text: "It depends on the animal. A self-aware dolphin and a chicken are not the same moral question" },
      { id: "D", text: "Individual ethics is a distraction. Subsidies, regulation, and alternatives matter more than personal guilt" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "Okay, you drew a line between humans and animals. But here's what's interesting about that line.\n\nPigs outperform dogs on cognitive tests. They recognize themselves in mirrors. They can learn to play simple video games with joysticks. And right now, millions of them are spending their entire lives in spaces too small to turn around in.\n\nSo what specifically is the morally relevant difference that makes that okay for a pig but a felony if you did it to a dog?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 1975 philosopher Peter Singer published 'Animal Liberation' and made an argument that sounds simple but lands like a grenade: the thing that gives a being moral standing isn't which species it belongs to, it's whether it can suffer. He called the species distinction \"speciesism\" and compared it directly to racism and sexism.\n\nWait, really? That comparison sounds extreme. But think about what it's actually saying: if your only reason for treating two beings differently is membership in a biological category, you need a better reason than \"because that's how we've always done it.\"\n\nLegal scholar Steven Wise spent decades trying to get courts to grant legal personhood to great apes and elephants. In 2022, Ecuador's Constitutional Court actually did it for wild animals. Should animals have legal rights?",
    options: [
      { id: "A", text: "Yes. Cognitively complex animals feel pain and form bonds. Denying them rights is a moral failure" },
      { id: "B", text: "No. Rights require responsibilities. Animals can't vote or sign contracts, so \"rights\" doesn't apply" },
      { id: "C", text: "Not rights, but stronger welfare laws with real enforcement. That's more practical and achievable" },
      { id: "D", text: "Singer's logic is sound but \"animal rights\" as a slogan alienates people and slows real progress" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "So here's the technology bet: what if you could eat a real hamburger that never involved killing anything?\n\nIn 2020 Singapore became the first country to approve lab-grown meat. By 2024 companies like Upside Foods had USDA approval in the U.S. The catch? It still costs roughly 10x what conventional meat costs, and it takes a lot of energy to produce.\n\nMeanwhile, the plant-based approach already peaked. Beyond Meat and Impossible Foods had their moment in 2021, and then consumers drifted back to regular burgers. Turns out people really like meat.\n\nWhich raises the real question: can technology solve an ethics problem, or does it just let us avoid facing it?",
    options: [
      { id: "A", text: "Yes. People won't stop eating meat, so making meat without animals is the only realistic path forward" },
      { id: "B", text: "No. Technology is a delay tactic. We need to change what we eat, not engineer guilt-free versions" },
      { id: "C", text: "Technology helps but can't work alone. You need lab meat AND regulation AND cultural shift together" },
      { id: "D", text: "Meat isn't the problem, industrialization is. Small-scale regenerative farming is ecologically and ethically defensible" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Let's talk about something most people would rather not think too carefully about.\n\nThe COVID vaccines saved an estimated 20 million lives in their first year. Twenty million. And they depended on animal testing, particularly in mice and primates. The mRNA technology behind Pfizer and Moderna was tested in animals for over a decade before the pandemic hit.\n\nBut here's the full picture: roughly 100 million animals are used in research in the U.S. every year. That's not all lifesaving vaccine work. That's everything from cosmetics to psychology experiments to drug trials where over 90% of compounds that pass animal testing still fail in humans.\n\nThe EU has committed to phasing out animal testing by 2030 where alternatives exist. Is animal testing for medical research justified?",
    options: [
      { id: "A", text: "Yes. When human lives are genuinely at stake, using animals in research is justified. COVID proved that" },
      { id: "B", text: "Justified for now, but we should invest aggressively in alternatives with a clear goal of ending it" },
      { id: "C", text: "Only for certain animals and purposes. Testing on primates demands a much higher bar than mice" },
      { id: "D", text: "The justification is weaker than people think. Over 90% of animal-tested drugs fail in humans anyway" },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: { type: "mc", question_id: "q4a" }
    },
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "Here's a fact that should bother you more than it probably does.\n\nCambridge neuroscientist Lori Marino has shown that pigs demonstrate self-awareness, empathy, and complex social cognition comparable to dogs and young children. Octopuses solve puzzles, recognize individual humans, and appear to play for fun. In 2012 a group of prominent neuroscientists signed the Cambridge Declaration on Consciousness, concluding that many non-human animals possess the neurological substrates for conscious experience.\n\nSo wait. If a pig is roughly as cognitively sophisticated as a three-year-old human, and we're confining billions of them in conditions we'd call torture if applied to a dog... does eating them require a moral justification that most of us have simply never bothered to make?",
    options: [
      { id: "A", text: "Yes. Killing a conscious being for a taste preference is indefensible once you actually face what you're doing" },
      { id: "B", text: "No. Humans are omnivores. Eating animals is evolutionary biology and cultural heritage, not a moral failing" },
      { id: "C", text: "Consciousness is a spectrum and moral weight should be too. How we raise animals matters more than whether we eat them" },
      { id: "D", text: "The conclusion isn't veganism, it's radically reforming how we farm. Pastoral agriculture with real welfare standards works" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Here's maybe the most revealing thing about how we actually think about animals.\n\nIndia's constitution lists animal protection as a fundamental duty of citizens. Switzerland requires that social animals like parrots not be kept alone. But in most U.S. states, farm animals are completely exempt from animal cruelty laws. The exact same treatment that would be a felony if you did it to a dog is perfectly legal if you do it to a pig.\n\nAnd it gets weirder. Several U.S. states have passed \"ag-gag\" laws that make it a crime to film inside factory farms. Not a crime to do the things being filmed. A crime to film them.\n\nWhy the inconsistency? We love dogs because we know them and eat pigs because we don't. But is that a reason or just a habit?",
    options: [
      { id: "A", text: "It's emotional, not rational. We love dogs because we know them. A serious ethical framework would fix that" },
      { id: "B", text: "It's economic. The food system needs cheap animal protein, and the laws reflect that priority, not moral reasoning" },
      { id: "C", text: "It's industry capture. Ag-gag laws exist because farming lobbies shielded themselves from public scrutiny" },
      { id: "D", text: "The inconsistency is the most honest thing about us. We know it's wrong, so we hide it to protect our comfort" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last question, and it's a big one.\n\nTwo hundred years from now, people will look back at our era the way we look back at practices we now find horrifying. They'll have the benefit of distance and hindsight.\n\nWhen it comes to how we treat animals, what do you think future humans will find most incomprehensible about us? What will they struggle to believe we actually did?",
    freeformOnly: true,
  },
];

export const animalRightsQuiz = {
  topic: TOPIC,
  topicLabel: "Sweaters for Dogs, Cages for Pigs",
  questions: main,
  followupQuestions,
};
