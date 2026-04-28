import type { AnyQuestion, Question } from "../types";

const TOPIC = "gun_rights";

const f = (text: string) => ({ id: "E", text, freeform: true as const });

const followupQuestions: Record<string, Question> = {
  q3a: {
    id: "q3a",
    topic: TOPIC,
    text: "Red flag laws (Extreme Risk Protection Orders) allow family members or law enforcement to petition a court to temporarily remove firearms from someone in crisis. As of 2024, 21 states have them. Studies show they're associated with reduced gun suicides. But they also allow firearms to be seized without the owner being accused of a crime. Is due process being adequately protected?",
    options: [
      { id: "A", text: "Yes — red flag laws require a court order based on evidence of imminent risk; this is the same standard used for restraining orders, which we accept in domestic violence cases" },
      { id: "B", text: "No — seizing someone's property based on a petition, often before they've been heard in court, violates fundamental due process; the potential for abuse is enormous" },
      { id: "C", text: "The laws are fine in principle but inconsistent in practice — some states have strong procedural protections, others don't; the quality of implementation varies wildly" },
      { id: "D", text: "Due process matters, but so does the right to live — when the alternative is a dead person, a temporary and reversible removal of firearms with judicial oversight is a proportionate response" },
      f("None of these / I see it differently"),
    ],
  },
};

const main: AnyQuestion[] = [
  {
    id: "q1",
    topic: TOPIC,
    text: "In 2022, the U.S. experienced 647 mass shootings (Gun Violence Archive definition: 4+ shot in one incident). That same year, the Supreme Court's Bruen decision, written by Justice Thomas, struck down New York's 100-year-old concealed carry permit law and established that gun regulations must have a historical analogue from the founding era to be constitutional. This expanded gun rights while gun deaths hit their highest level in decades — over 48,000 in 2022. Is the constitutional framework itself the problem?",
    options: [
      { id: "A", text: "Yes — the Second Amendment was written for muskets and militias; treating it as an individual right to any weapon is an originalist fiction that makes rational policy impossible" },
      { id: "B", text: "No — the constitutional right is fundamental; the problem is enforcement of existing laws, mental health infrastructure, and cultural factors, not the legal framework" },
      { id: "C", text: "The framework is the problem, but not the one people think — Bruen's \"historical analogue\" test is bad legal reasoning; the Second Amendment can coexist with regulation if the Court allows it" },
      { id: "D", text: "The constitutional debate is a distraction — other countries with gun ownership (Switzerland, Canada, Czech Republic) manage regulation without constitutional crises; the American problem is political, not legal" },
      f("None of these / I see it differently"),
    ],
    followups: {
      B: {
        type: "freeform",
        prompt: "If the problem is enforcement and mental health — the U.S. spends more on both per capita than most peer countries and still has 20x the gun death rate. What specifically would change the outcome?",
      },
    },
  },
  {
    id: "q2",
    topic: TOPIC,
    text: "After the 2019 Christchurch mosque shooting that killed 51 people, New Zealand's parliament passed a comprehensive ban on semi-automatic weapons within 26 days, with near-unanimous support. After the 2012 Sandy Hook shooting that killed 20 children, the U.S. Congress failed to pass even expanded background checks. Australia's 1996 buyback after the Port Arthur massacre is widely credited with preventing mass shootings for over 20 years. Why can't the U.S. do what other democracies have done?",
    options: [
      { id: "A", text: "The NRA and gun lobby — the firearms industry has captured one political party and enough of the other to block any legislation; this is a lobbying problem, not a values problem" },
      { id: "B", text: "Genuine cultural difference — gun ownership is woven into American identity in a way that has no parallel in New Zealand or Australia; 400 million guns and a frontier mythology can't be legislated away" },
      { id: "C", text: "Structural politics — the Senate gives disproportionate power to rural, gun-owning states; the filibuster makes 60 votes required for any legislation; the system is designed to prevent action on divisive issues" },
      { id: "D", text: "Comparison is misleading — those countries had fewer guns, less polarization, and parliamentary systems that allow fast action; the U.S. situation is structurally different, not just politically weaker" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q3",
    topic: TOPIC,
    text: "Two-thirds of U.S. gun deaths are suicides — over 27,000 in 2022, compared to roughly 20,000 homicides. Research by Harvard's Matthew Miller shows that access to a gun increases suicide risk by a factor of 3, and that gun suicides are more impulsive than other methods (most attempts are preceded by less than 10 minutes of deliberation). Yet the gun debate in America focuses almost entirely on mass shootings and homicides. Should suicide prevention reshape the gun policy conversation?",
    options: [
      { id: "A", text: "Yes — suicide is the majority of gun deaths, and even modest barriers (waiting periods, safe storage laws, temporary removal orders) save lives; this should be the center of the policy debate" },
      { id: "B", text: "No — framing gun policy around suicide conflates two different problems; suicide requires mental health solutions, not firearm restrictions; taking rights from the many to protect the few is wrong" },
      { id: "C", text: "It should, but it won't — the political energy around guns comes from fear of violence, not self-harm; suicide doesn't generate the same urgency because it's private and stigmatized" },
      { id: "D", text: "The suicide data actually undermines the standard gun control narrative — if most gun deaths are self-inflicted, the problem isn't \"gun violence\" as popularly framed, it's despair, isolation, and a broken mental health system" },
      f("None of these / I see it differently"),
    ],
    followups: { A: { type: "mc", question_id: "q3a" } },
  },
  {
    id: "q4",
    topic: TOPIC,
    text: "In rural America, guns are tools — used for hunting, predator control, and property protection where police response times can exceed 30 minutes. In urban America, guns are overwhelmingly associated with violence — homicide, armed robbery, and mass shootings. Sociologist Jennifer Carlson's research shows that for many rural Americans, gun ownership is about self-reliance and community identity, not ideology. Is it possible to have a gun policy that respects both realities?",
    options: [
      { id: "A", text: "Yes — differentiated policy is the answer; what makes sense in rural Montana doesn't make sense in downtown Chicago, and the law should reflect that instead of pretending one size fits all" },
      { id: "B", text: "No — rights can't vary by zip code; if the Second Amendment means anything, it means the same thing everywhere; geographically differentiated gun laws are constitutionally incoherent" },
      { id: "C", text: "The rural/urban divide is real but overstated — most gun policy proposals (background checks, safe storage, waiting periods) are compatible with rural gun ownership; the opposition is cultural, not practical" },
      { id: "D", text: "The divide is manufactured — the gun lobby exploits rural identity to block policies that rural gun owners often support; polling shows majority support for background checks and red flag laws across all demographics" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q5",
    topic: TOPIC,
    text: "The AR-15 and similar semi-automatic rifles account for a small fraction of overall gun deaths — roughly 3% of gun homicides involve any type of rifle. Handguns are used in over 75% of gun homicides. Yet the AR-15 is the weapon of choice in most high-profile mass shootings (Uvalde, Parkland, Sandy Hook, Las Vegas, Orlando). The 1994 Federal Assault Weapons Ban expired in 2004 and has not been renewed. Should policy focus on the weapons that kill the most people, or the ones that enable the worst single events?",
    options: [
      { id: "A", text: "Focus on handguns — they cause the overwhelming majority of gun deaths; an assault weapons ban is symbolically satisfying but statistically marginal" },
      { id: "B", text: "Focus on assault-style weapons — mass shootings cause disproportionate psychological and social damage; their terror effect justifies prioritizing them regardless of overall numbers" },
      { id: "C", text: "Both — but politically, assault weapons bans are more achievable because they affect fewer owners; start there and build momentum for broader reform" },
      { id: "D", text: "The weapon-type focus is a trap — the variable that matters most isn't what type of gun someone has, but how easily any gun can be acquired by someone in crisis or with violent intent" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q6",
    topic: TOPIC,
    text: "The Black Panthers' armed patrols of Oakland police in the 1960s prompted California's Republican governor Ronald Reagan to sign the Mulford Act, banning open carry. Philando Castile, a licensed gun owner, was shot and killed by police during a traffic stop in 2016 after informing the officer he had a legal firearm. Research by economists at Stanford found that \"stand your ground\" laws are applied more favorably to white defendants than Black defendants. Does the Second Amendment protect everyone equally?",
    options: [
      { id: "A", text: "No — the history is clear; gun rights have always been racialized in America; armed Black people are treated as threats, armed white people are treated as patriots" },
      { id: "B", text: "The right is equal on paper; the enforcement is not — this is a policing and criminal justice problem, not a Second Amendment problem; the solution is equal enforcement, not fewer rights" },
      { id: "C", text: "The racial disparity is real and reveals something deeper — \"gun rights\" in America have always been about who is trusted with violence; the right was designed for white citizens and has never fully expanded" },
      { id: "D", text: "This is why gun control itself can be a tool of racial oppression — historically, disarmament laws targeted Black communities; some communities of color see gun ownership as self-defense against both crime and state violence" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q7",
    topic: TOPIC,
    text: "After the Uvalde shooting in 2022 — where 19 children and 2 teachers were killed while police waited 77 minutes to breach the classroom — Congress passed the Bipartisan Safer Communities Act. It was the first federal gun legislation in nearly 30 years. It enhanced background checks for buyers under 21, funded state crisis intervention programs, and closed the \"boyfriend loophole\" for domestic violence. Gun control advocates called it insufficient. Gun rights advocates called it overreach. Fifteen Republican senators voted for it. Was the compromise worth it?",
    options: [
      { id: "A", text: "Yes — any forward movement breaks the political logjam; the bill saves lives and creates a precedent for bipartisan action; perfect is the enemy of good" },
      { id: "B", text: "No — the bill was window dressing after children were massacred; it didn't ban any weapon, didn't raise the purchasing age, didn't mandate universal background checks; the compromise normalized inadequacy" },
      { id: "C", text: "The compromise was worth it for what it signals, not for what it does — proving that bipartisan gun legislation is possible matters more than the specific provisions of this bill" },
      { id: "D", text: "The question reveals the dysfunction — after 19 children were killed, the most powerful country in the world produced a modest set of half-measures and called it historic; the real story is about what the system can't do, not what it did" },
      f("None of these / I see it differently"),
    ],
    followups: {
      D: {
        type: "freeform",
        prompt: "If the political system structurally cannot produce meaningful gun legislation even after mass child casualties — is there a path that doesn't run through Congress? What else could work?",
      },
    },
  },
  {
    id: "q8",
    topic: TOPIC,
    text: "3D-printed firearms (\"ghost guns\") and parts kits that require no background check and no serial number have proliferated — the ATF recovered over 25,000 ghost guns at crime scenes in 2022, up from fewer than 4,000 in 2018. A Biden administration rule in 2022 required serial numbers on ghost gun kits, but enforcement is difficult. Meanwhile, Defense Distributed, founded by Cody Wilson, has published downloadable gun designs, arguing it's a First Amendment issue. As manufacturing technology improves, is traditional gun regulation becoming obsolete?",
    options: [
      { id: "A", text: "Yes — you can't regulate what anyone can print in their garage; the entire framework of controlling access to physical weapons is becoming unenforceable; policy needs to focus on behavior, not objects" },
      { id: "B", text: "No — 3D-printed guns are currently unreliable and expensive; the vast majority of gun violence uses commercially manufactured weapons that are absolutely regulable; ghost guns are a distraction" },
      { id: "C", text: "Regulation is becoming harder but not obsolete — just as we regulate drugs despite home chemistry labs, we can regulate ghost guns through component controls, manufacturing restrictions, and possession laws" },
      { id: "D", text: "The ghost gun issue proves what gun rights advocates have always said — determined people will always find ways to arm themselves; the focus should be on why people commit violence, not on controlling the tools" },
      f("None of these / I see it differently"),
    ],
  },
  {
    id: "q9",
    topic: TOPIC,
    text: "What's the gun rights question nobody is asking loudly enough?",
    freeformOnly: true,
  },
];

export const gunRightsQuiz = {
  topic: TOPIC,
  topicLabel: "Gun Rights",
  questions: main,
  followupQuestions,
};
