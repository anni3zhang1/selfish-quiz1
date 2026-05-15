import type { AnyQuestion, Question } from "../types";

const TOPIC = "nuclear_deterrence";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "So here's a fun bureaucratic knife fight. Former Defense Secretary William Perry and physicist James Cartwright looked at the nuclear triad and said: get rid of the land-based ICBMs entirely. Their argument? Submarines already hide in the ocean where nobody can find them. ICBMs just sit in silos with a giant \"hit me\" sign, which creates this nightmare called launch-on-warning: you HAVE to fire them before the other guy's missiles land, or you lose them.\n\nThe Air Force, unsurprisingly, went ballistic (pun intended) at the idea of losing a third of the nuclear mission.\n\nIf you could restructure the arsenal from scratch, what stays?",
    options: [
      { id: "A", text: "Submarines only. They're invisible, survivable, and don't pressure anyone into launching on a maybe." },
      { id: "B", text: "Keep the full triad. Redundancy IS the point. Lose one leg, the others still guarantee retaliation." },
      { id: "C", text: "Submarines plus bombers. Bombers can turn around mid-flight, which is a feature missiles don't have." },
      { id: "D", text: "This question assumes the arsenal is permanent. The real goal should be multilateral drawdown, not optimizing doomsday." },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's the most counterintuitive security arrangement in human history: we keep the peace by promising to destroy civilization. That's Mutually Assured Destruction. MAD. The name is almost too on the nose.\n\nAnd look, it has \"worked\" in the narrow sense that nobody has dropped a nuke since 1945. Eighty years! But wait really? Is that skill or luck?\n\nConsider the scoreboard. Russia: 5,977 warheads. The U.S.: 5,428. That's enough to turn every city on Earth into glass parking lots several times over. And in 2023, the Doomsday Clock hit 90 seconds to midnight, the closest it's ever been. Closer than the Cuban Missile Crisis.\n\nSo is this framework actually stable, or are we just standing in a room full of gasoline congratulating ourselves that nobody's lit a match yet?",
    options: [
      { id: "A", text: "Stable. Deterrence prevented great-power war for 80 years. Nothing else in history comes close to that." },
      { id: "B", text: "Unstable. MAD requires rational actors. Miscalculation, accidents, or unstable leaders make catastrophe inevitable over time." },
      { id: "C", text: "It was stable when two superpowers stared each other down. Add China, North Korea, Pakistan, Iran? The math breaks." },
      { id: "D", text: "We've been lucky, not smart. Confusing 80 years without nuclear war for 80 years of good policy is survivorship bias." },
      f("None of these / I see it differently"),
    ],
    followups: {
      A: {
        type: "freeform",
        prompt: "Okay but here's what bugs me about the \"it's rational\" argument. In 1983, Soviet officer Stanislav Petrov's computer told him five American missiles were incoming. He had minutes to decide. He chose NOT to report it up the chain, and it turned out to be a sensor glitch from sunlight reflecting off clouds. One guy. One gut call. That's it.\n\nThen there's the 1995 Norwegian rocket incident, where Boris Yeltsin actually opened the nuclear briefcase. And the 2018 Hawaii false alarm where a million people thought they were about to die for 38 minutes because someone clicked the wrong button on a dropdown menu.\n\nHow many close calls does a \"rational\" system get before we stop calling it rational?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "Nine countries now have nuclear weapons. The original deal, the Non-Proliferation Treaty from 1968, was supposed to work like this: the countries that had nukes would eventually disarm, and in exchange, everyone else would promise not to build them.\n\nNeither thing happened.\n\nNow Iran's enrichment program is reportedly weeks away from weapons-grade capacity. Saudi Arabia has publicly signaled: if Iran gets the bomb, we're getting the bomb. And you can bet other countries in the region are watching.\n\nHere's the thing that rarely gets said out loud. The knowledge to build a nuclear weapon is 80 years old. That's like trying to keep the secret of the telephone. The physics is in textbooks. The engineering is hard but not mysterious.\n\nSo can proliferation actually be stopped, or are we trying to hold back a tide?",
    options: [
      { id: "A", text: "Yes, but only by addressing WHY countries want nukes. Reduce the threat, and the incentive to build disappears." },
      { id: "B", text: "No. The knowledge is out there forever. The goal should shift from prevention to managing a multi-nuclear world safely." },
      { id: "C", text: "The NPT is dead on arrival because of hypocrisy. You can't demand others disarm while sitting on 5,000 warheads yourself." },
      { id: "D", text: "More nuclear states might actually stabilize things. Nukes kept India and Pakistan from all-out war. More deterrence, less fighting." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "The U.S. is currently spending $1.7 trillion to replace its entire nuclear arsenal. Let me put that number in your body for a second. $1.7 trillion is roughly the GDP of Canada. We are spending an entire Canada on new ways to end civilization.\n\nThe new Sentinel ICBM alone? $96 billion. Russia and China are doing their own upgrades.\n\nNow here's the part that should make you uncomfortable. Former Defense Secretary William Perry (not some random peacenik, the guy who literally ran the Pentagon) argues that land-based ICBMs are destabilizing because of something called launch-on-warning. The missiles sit in fixed silos. If you think an attack is coming, you HAVE to fire them before the enemy's warheads arrive, or they're destroyed uselessly. So the system creates pressure to launch before you've confirmed the attack is even real.\n\nYou're spending $96 billion on a weapon that makes you MORE trigger-happy. Is that making us safer?",
    options: [
      { id: "A", text: "Safer. Old weapons are unreliable. A deterrent that might not work doesn't deter. You have to maintain credibility." },
      { id: "B", text: "More dangerous. This is an arms race wearing a lab coat. Every upgrade provokes a response. Trillions spent to raise the risk." },
      { id: "C", text: "Depends what you're upgrading. Better submarines and command systems? Stabilizing. New hair-trigger ICBMs? Destabilizing. Not all modernization is equal." },
      { id: "D", text: "The $1.7 trillion price tag reveals the real driver: defense contractor profits, not security. The nuclear-industrial complex captured the process." },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: { type: "mc", question_id: "q3a" }
    },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "In 2022, something happened that nuclear theorists had debated for decades but never actually seen: a nuclear-armed state invaded its neighbor and then waved its nukes around to keep everyone else out.\n\nVladimir Putin put Russian nuclear forces on high alert and basically told NATO: intervene and we'll use them. Russia's official doctrine says nuclear weapons can be used when \"the very existence of the state is threatened.\" Analysts spent months debating whether Putin might deploy tactical nukes on the battlefield. These are \"small\" ones, by the way. 0.1 to 10 kilotons. Hiroshima was 15.\n\nAnd it worked. NATO chose not to intervene directly. Partly because of those nuclear threats.\n\nWait, think about what just happened. Deterrence worked... FOR the invader. The country doing the attacking used nukes as a shield. Every dictator on Earth was taking notes.\n\nDid deterrence work here, or did it break?",
    options: [
      { id: "A", text: "It worked, and that's the terrifying part. Every future aggressor now knows nukes are the ultimate get-out-of-consequences card." },
      { id: "B", text: "Deterrence worked both ways. Russia kept NATO out, NATO kept Russia from going nuclear. Ugly, but the system held." },
      { id: "C", text: "Russia was bluffing. No rational leader nukes Ukraine. The real lesson is that caving to nuclear threats just rewards the bluff." },
      { id: "D", text: "A nuclear power invading neighbors with impunity proves MAD became a shield for aggression, not a framework for peace." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2017, something strange happened. Seventy countries signed a treaty declaring nuclear weapons illegal under international law. The Treaty on the Prohibition of Nuclear Weapons. It officially entered into force in 2021. The campaign behind it won the Nobel Peace Prize.\n\nAnd not a single nuclear-armed state signed it.\n\nThe nuclear powers called it naive idealism. Which, okay, fair point. But here's the counter-argument, and it's actually fascinating. Slavery was once considered a permanent feature of civilization. Chemical weapons were used freely in World War I and then basically never again. Landmines were everywhere and now there's an international ban that most countries follow.\n\nNorms change. They change slowly, messily, and usually after someone says \"that'll never work.\" The question is whether nuclear weapons are in the category of \"things humanity can agree to give up\" or the category of \"things that are too useful to ever abandon.\"\n\nWhich is it?",
    options: [
      { id: "A", text: "Abolition is realistic long-term. Slavery and chemical weapons were once \"permanent\" too. The ban builds the norm, even if enforcement is far off." },
      { id: "B", text: "Dangerous fantasy. You can't uninvent the bomb. Abolish nukes and the first country to secretly rebuild gets to blackmail everyone." },
      { id: "C", text: "Aim for minimum deterrence, not zero. Reduce arsenals to hundreds, not thousands. Enough to deter, not enough to end civilization." },
      { id: "D", text: "Abolition is morally necessary even if unachievable in our lifetimes. Weapons that can end humanity are categorically unacceptable. \"Realistic\" isn't the only standard." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "For decades, China had a modest nuclear arsenal and a no-first-use policy. Around 350 warheads. Compare that to America's 5,400. China's position was basically: we just need enough to make attacking us suicidal. Minimum deterrence. Elegant, honestly.\n\nThen something changed. The Pentagon now projects China will have 1,500 warheads by 2035. That's a 4x increase in 14 years. They're building new silos, new submarines, new missiles.\n\nSome analysts like Caitlin Talmadge at Georgetown say this makes arms control urgent. Others like Elbridge Colby say the U.S. needs to build up in response. But wait, zoom out for a second. From Beijing's perspective, the U.S. has 5,400 warheads and is spending $1.7 trillion on shiny new ones. Who's escalating, exactly?\n\nThis is the problem with arms races. They look defensive from the inside and aggressive from the outside. Every single time.\n\nIs a three-way nuclear arms race now inevitable?",
    options: [
      { id: "A", text: "Not inevitable, but likely. Without trilateral arms control (which nobody's even discussing), the dynamics are structural. Each side builds to match." },
      { id: "B", text: "Yes, and the U.S. must respond. Deterrence requires rough parity. Letting China close the gap without matching them is strategic negligence." },
      { id: "C", text: "China's buildup is a response, not an instigation. From Beijing, America is the one spending $1.7 trillion to escalate. Perspective matters." },
      { id: "D", text: "The three-way framing IS the trap. Building more weapons because they built more weapons is literally the definition of an arms race. Break the cycle." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "A nuclear weapon hasn't been used in war since 1945. That's 80 years. The longest streak matters, because every year it holds, the norm against use gets a little stronger.\n\nBut norms are fragile. And the list of ways this streak could end is long: a miscalculation between India and Pakistan, a desperate regime in North Korea, a crisis over Taiwan that spirals, a terrorist group that gets lucky, or just plain human error on a bad day with bad intelligence.\n\nWhat do you think is most likely to end that streak? And if you could do ONE thing to reduce the risk, what would it be?",
    freeformOnly: true,
  },
];

export const nuclearDeterrenceQuiz = {
  topic: TOPIC,
  topicLabel: "Peace by Threat of Annihilation",
  questions: main,
  followupQuestions,
};
