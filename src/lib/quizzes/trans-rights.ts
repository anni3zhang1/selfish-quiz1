import type { AnyQuestion, Question } from "../types";

const TOPIC = "trans_rights";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "Here's something wild. In 2024, 26 U.S. states banned or restricted gender-affirming care for minors. Puberty blockers, hormones, surgery. Meanwhile the American Academy of Pediatrics, the Endocrine Society, and the AMA all say evidence-based gender-affirming care should be available to adolescents.\n\nBut wait. That same year, England's Cass Review looked at the same research and concluded the evidence base is \"remarkably weak.\" They recommended major restrictions.\n\nBoth sides say they're \"following the science.\" That's the interesting part. Same studies, opposite conclusions. So what's actually going on here?",
    options: [
      { id: "A", text: "The medical consensus is clear. Major professional organizations support individualized care, and legislative bans override clinical judgment." },
      { id: "B", text: "The Cass Review is right to pump the brakes. The long-term evidence is genuinely thin for irreversible interventions on developing bodies." },
      { id: "C", text: "Both sides have real points, which is exactly why this is so hard. Some kids clearly benefit, others may not, and neither blanket policy handles that." },
      { id: "D", text: "This isn't really a medical debate. Trans kids are being used as a political wedge issue, and both sides pick the science that fits." },
      f("None of these / I see it differently"),
    ],
    followups: {
      C: {
        type: "freeform",
        prompt: "Okay so you're in the \"it's complicated\" camp. Fair. But here's the practical question that makes it really hard: if the challenge is figuring out which young people will benefit from medical transition, who actually gets to decide? The kid? The parents? A therapist? A doctor? A judge?\n\nAnd what happens when they disagree with each other?",
      }
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "In 2022, Lia Thomas, a transgender woman, won the NCAA Division I 500-yard freestyle. She'd previously competed on the men's team at Penn. The next year, World Athletics banned transgender women from elite female competition entirely. The IOC punted the question to individual sports federations.\n\nHere's where it gets genuinely tricky. Some studies show transgender women retain measurable physiological advantages even after years of hormone therapy. Other studies show those advantages shrink significantly after two-plus years.\n\nSo we have real data pointing in two different directions. And somewhere in the middle of this scientific uncertainty, actual people are trying to figure out if they're allowed to swim.",
    options: [
      { id: "A", text: "Biological sex creates performance gaps that hormones don't fully close. Fairness to cisgender women athletes has to come first in competition." },
      { id: "B", text: "Excluding trans women from competing as their gender is discrimination, period. Sports have always involved natural physical variation." },
      { id: "C", text: "It depends on the level. Elite competition with razor-thin margins needs different rules than recreational or youth sports." },
      { id: "D", text: "This debate absorbs wildly disproportionate attention. Trans athletes are a tiny population. The real energy here is cultural anxiety about gender norms." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Think about this for a second. As of 2024, 23 countries let people legally change their gender marker on official documents. But the range of what that requires is enormous.\n\nArgentina and Denmark? You just declare it. Fill out a form, done. Japan, until 2023? You had to be sterilized. In the U.S. it varies by state, from court orders to physician letters to simple self-attestation.\n\nThat's a spectrum from \"sign here\" to \"surgical procedure required.\" Same question, radically different answers across the world.\n\nHow should legal gender recognition actually work?",
    options: [
      { id: "A", text: "Self-declaration. Gender identity is personal. Requiring medical gatekeeping for a document change is degrading and unnecessary for adults." },
      { id: "B", text: "Some verification matters. Legal gender affects prisons, shelters, sports, and data collection. Gatekeeping prevents potential system abuse." },
      { id: "C", text: "Remove gender from IDs and passports entirely. The state has no legitimate reason to sort people into gender categories at all." },
      { id: "D", text: "The deeper issue is that legal systems assume stable binary categories. Accommodating gender identity means redesigning those systems from scratch." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "Let's look at two statistics side by side.\n\nFirst: the 2022 U.S. Transgender Survey found that 41% of respondents had attempted suicide at some point. Research consistently shows that social support, family acceptance, and affirming healthcare dramatically reduce these numbers.\n\nSecond: referrals to gender clinics in the UK rose over 4,000% between 2010 and 2022. That is not a typo. Four thousand percent.\n\nSome people look at that spike and see liberation. Finally safe enough to come out. Others look at it and see social contagion, amplified by social media, sweeping through adolescent peer groups.\n\nWait, really? Can both of those be true at the same time?",
    options: [
      { id: "A", text: "It's liberation. Trans people always existed. What changed is safety. Same pattern as left-handedness rates rising when schools stopped punishing it." },
      { id: "B", text: "The spike suggests something social is happening too. Especially among adolescent females with no childhood history of dysphoria. That pattern needs explaining." },
      { id: "C", text: "Both, and they're not mutually exclusive. Some of the increase is genuine liberation, some is social influence. The hard part is telling them apart." },
      { id: "D", text: "The \"social contagion\" frame is the same argument used against gay people for decades. Questioning someone's identity because it became visible isn't neutral inquiry." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "In 2021, philosopher Kathleen Stock resigned from the University of Sussex after student protests and colleague criticism over her book \"Material Girls.\" Her argument: biological sex is real and politically relevant in ways that gender identity theory obscures.\n\nJ.K. Rowling has faced years of backlash for similar positions. Supporters call both of them defenders of women's sex-based rights. Critics call them transphobic.\n\nMultiple academics have been disinvited from conferences, denied publication, or faced professional consequences for questioning gender identity frameworks.\n\nHere's the question underneath the question: is there actually a free speech problem here, or is this just what accountability looks like?",
    options: [
      { id: "A", text: "Yes, there's a real problem. When academics lose jobs over factual claims about biology, intellectual freedom is being sacrificed to orthodoxy." },
      { id: "B", text: "No. Criticism and social consequences for speech are themselves free speech. What people call \"cancellation\" is just accountability for harmful views." },
      { id: "C", text: "There's a problem, but it's not unique to trans issues. Academic freedom is under pressure across many topics. This is a symptom, not a special case." },
      { id: "D", text: "The \"silenced\" people have enormous platforms. Rowling has 14 million followers. The real silencing is of trans people who face violence for existing." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "Okay, let's zoom out to the theoretical bedrock for a second.\n\nJudith Butler's big idea: gender is \"performative.\" It's not some innate essence you're born with. It's something produced through repeated social acts. This framework has been foundational to trans advocacy and queer theory for decades.\n\nOn the other side, evolutionary psychologists and some feminists argue that biological sex differences are real, substantial, and have social consequences you can't just theorize away.\n\nThese two frameworks collide in every practical debate about bathrooms, prisons, shelters, and healthcare. One says gender is constructed. The other says sex is determinative.\n\nCan they actually coexist? Or do you have to pick one?",
    options: [
      { id: "A", text: "They can coexist. Sex is biological, gender is social and psychological. Most conflicts come from conflating them. Careful distinction resolves most questions." },
      { id: "B", text: "They're fundamentally incompatible. If gender is performative, sex-based protections make no sense. If sex is determinative, gender identity claims are empty. Pick one." },
      { id: "C", text: "The academic debate matters less than the practical question. How do we design policies that protect everyone's safety and dignity? Start from there, not theory." },
      { id: "D", text: "Framing this as a philosophical debate hides the power dynamics. One side debates theory while the other fights for survival. Intellectual detachment is a luxury." },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "Last one, and it's open-ended.\n\nYou've now seen the medical debate, the sports question, the legal recognition puzzle, the social contagion argument, the free speech tension, and the theoretical divide.\n\nWhat's the question in this whole conversation that you think both sides are actively avoiding? And why do you think they're avoiding it?",
    freeformOnly: true,
  },
];

export const transRightsQuiz = {
  topic: TOPIC,
  topicLabel: "Gender Is the New Fault Line",
  questions: main,
  followupQuestions,
};
