# Quiz Trimming Analysis

## Executive Summary

**Recommendation: 6 MC questions + 1 tailored freeform = 7 total per quiz**

With freeform "add context" annotations on every answer, each response carries both a position signal (the MC choice) and a reasoning signal (the annotation). That gives you 12 structured data points + 1 open freeform from just 7 questions — more than enough to differentiate across the 7 constellation relationship types.

The current quizzes have 8 MC + 1 generic freeform = 9 questions (plus conditional follow-ups). Cutting to 7 removes ~22% of questions, which meaningfully speeds up the experience without losing dimensional coverage.

Follow-up sub-questions (q1a, q3a, etc.) are kept where they exist on a surviving question — they only trigger conditionally and add depth without adding length for most users.

---

## AI Governance

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Regulatory philosophy** — institutional trust, speed of governance, EU vs US approaches |
| q2 | **Risk tolerance** — safety vs acceleration, how you weight catastrophic downside |
| q3 | **Accountability** — who bears responsibility when AI harms; individual vs distributed blame |
| q4 | **Geopolitical framing** — whether competitive pressure changes your principles |
| q5 | **Paradox tolerance** — can you hold genuine ethical dilemmas without resolving them to one side |
| q6 | **Openness vs control** — transparency, power distribution, open-source philosophy |
| q7 | **Labor displacement** — economic disruption framing (overlaps with Economic Disruption quiz) |
| q8 | **Epistemics** — AI's effect on truth and collective knowledge (overlaps with Truth & Media quiz) |
| q9 | **IP/ownership** — property rights, creative economy, consent |
| q10 | **Generic freeform** — low signal |

### Overlaps
- **q7** (labor) and **q8** (epistemics) are thinly drawn here because they're entire quizzes elsewhere — cut both
- **q1** and **q4** both probe institutional trust/governance philosophy — cut q4 (q1 is stronger, q4 is narrower)
- **q3** and **q5** both probe accountability/ethical reasoning — keep both (q3 is structural, q5 is psychological)

### Recommendation: Keep q1, q2, q3, q5, q6, q9 → 6 MC + 1 new freeform

### Cut: q4, q7, q8, q10

### Replacement freeform (q7, replacing q10):
> **"You're advising a government that has one year to set up its AI governance framework. What's the single most important thing to get right — and what are you willing to leave imperfect?"**

*Why this works: Forces a priority trade-off that reveals whether someone thinks in terms of rights, institutions, markets, or risks — and what they're willing to sacrifice.*

---

## Climate

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Response to systemic failure** — pragmatism vs structural critique, what "honest" means |
| q2 | **Technology governance** — nuclear as proxy for centralized vs distributed, pragmatism vs ideology |
| q3 | **Climate justice** — global equity, historical responsibility, wealth transfer |
| q4 | **Individual vs systemic responsibility** — locus of blame, manufactured narratives |
| q5 | **Geoengineering risk** — tolerance for extreme intervention, governance of planetary-scale tech |
| q6 | **Radical protest** — means justification, strategy vs moral principle |
| q7 | **Climate as economic competition** — self-interest as driver, pragmatism about motivation |
| q8 | **Corporate liability** — accountability for known harm, structural vs individual |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q4** and **q8** both probe individual vs systemic responsibility/corporate accountability — keep q8 (stronger context, more specific), cut q4
- **q1** and **q7** both probe pragmatism and framing — keep q1 (more foundational), cut q7
- **q2** and **q5** both probe technology governance — keep both (different enough: q2 is existing tech, q5 is speculative)

### Recommendation: Keep q1, q2, q3, q5, q6, q8 → 6 MC + 1 new freeform

### Cut: q4, q7, q9

### Replacement freeform (q7, replacing q9):
> **"If you could force one country, one company, or one institution to change one specific thing about how they handle climate — who, and what?"**

*Why this works: Forces concrete specificity about who they blame, what lever they think matters most, and whether they think in terms of nations, corporations, or institutions.*

---

## Longevity

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Personal desire** — relationship to mortality, whether death is a problem or a feature |
| q2 | **Access equity** — distribution justice, technology trickle-down belief |
| q3 | **Power stagnation** — institutional consequences, generational turnover |
| q4 | **Disease framing** — nature vs engineering, medicalization of the human condition |
| q5 | **Bryan Johnson** — reaction to radical optimization, control, embodiment |
| q6 | **Demographic systems** — population, fertility, macro consequences |
| q7 | **Reproduction tradeoff** — individual vs collective value, what's sacred |
| q8 | **Identity over time** — philosophical depth, Williams vs Bostrom |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q1** and **q4** both probe relationship to mortality/nature — keep q1 (more personal, more revealing), cut q4
- **q3** and **q6** both probe systemic consequences — keep q3 (sharper, about power), cut q6
- **q5** is unique but somewhat overlaps q1 (personal reaction) — cut q5 (q1 is more fundamental)

### Recommendation: Keep q1, q2, q3, q7, q8 → only 5 MC. Need 1 more.

Restore **q6** (demographics) — it's sufficiently different from q3 once q5 is cut.

### Final: Keep q1, q2, q3, q6, q7, q8 → 6 MC + 1 new freeform

### Cut: q4, q5, q9

### Replacement freeform (q7 position, after q8, replacing q9):
> **"If a longevity treatment existed today that was proven, safe, and free — but you had to decide for the whole world, not just yourself — would you make it available? What's the strongest argument against your own answer?"**

*Why this works: Forces them to separate personal desire from policy judgment, and the "argue against yourself" twist reveals how seriously they hold their position.*

---

## Meaning Crisis

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **What religion provided** — shared narrative, community, transcendence, or nothing |
| q2 | **Commodification** — meaning industry as genuine vs exploitative |
| q3 | **Political religion** — tribalism, sacred values in secular contexts |
| q4 | **Digital connection** — technology and loneliness, online vs offline community |
| q5 | **Nietzsche diagnosis** — nihilism, historical pattern, secular substitutes |
| q6 | **Work and meaning** — purpose, privilege, labor exploitation |
| q7 | **Class dimension** — who suffers the meaning crisis, structural analysis |
| q8 | **Sacredness** — immanent frame, whether the sacred survives without God |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q1** and **q8** both probe transcendence/sacred — keep q8 (sharper, more philosophical), cut q1... actually q1 is a better opener. Keep q1, cut q8.
- **q5** and **q1** overlap on "what's been lost" — keep both (q1 is experiential, q5 is diagnostic/historical)
- **q2** and **q6** both probe meaning sources — keep q6 (work is more universal), cut q2
- **q3** and **q7** both probe structural/political framing — keep q3 (more unique to this quiz), cut q7

### Recommendation: Keep q1, q3, q4, q5, q6, q8 → 6 MC + 1 new freeform

Wait — I cut q8 above. Let me reconsider. q1 is "what's being lost" and q8 is "can the sacred survive." These are different enough. Let me cut q2 instead of q8.

### Final: Keep q1, q3, q4, q5, q6, q8 → 6 MC + 1 new freeform

### Cut: q2, q7, q9

### Replacement freeform (q7, replacing q9):
> **"Describe a moment — real or hypothetical — where you felt genuine meaning that wasn't transactional, performative, or consumable. What made it different?"**

*Why this works: Bypasses intellectual frameworks entirely and asks for phenomenological data — what actually gives this person meaning, not what they think should.*

---

## Bioethics

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Line-drawing** — therapy vs enhancement, where limits belong |
| q2 | **Embryo research** — precaution vs progress, what deserves protection |
| q3 | **Brain-computer interfaces** — enhancement comfort, natural/artificial boundary |
| q4 | **Gene therapy pricing** — economic justice, access, who pays |
| q5 | **Genetic data ownership** — privacy vs collective benefit, governance |
| q6 | **Surrogacy** — bodily autonomy vs exploitation, class dynamics |
| q7 | **Psychedelics** — medicalization vs liberation, who controls consciousness |
| q8 | **Prenatal screening** — eugenics, individual choice vs systemic outcome |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q1** and **q3** both probe enhancement comfort/line-drawing — keep q1 (CRISPR is more urgent/real), cut q3
- **q4** and **q6** both probe economic justice/class dynamics — keep q6 (more morally complex), cut q4
- **q2** and **q8** both probe precaution/collective ethical reasoning — keep q8 (stronger, more uncomfortable), cut q2

### Recommendation: Keep q1, q5, q6, q7, q8 → only 5 MC. Need 1 more.

Restore **q4** (gene therapy pricing) — it's different enough from q6 (surrogacy) when q3 is gone. Actually, let me restore q2 (embryo research) instead — it probes a unique dimension (when does an entity deserve moral protection) that nothing else covers.

### Final: Keep q1, q2, q5, q6, q7, q8 → 6 MC + 1 new freeform

### Cut: q3, q4, q9

### Replacement freeform (q7 position, replacing q9):
> **"What's one thing about your own body or mind that you would change if the technology existed — and one thing you wouldn't change even if you could? What's the difference?"**

*Why this works: Grounds abstract bioethics in personal stakes. The "what's the difference" forces them to articulate their own limiting principle.*

---

## Truth & Media

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Deepfake response** — technical vs legal vs educational, liar's dividend |
| q2 | **Media trust decline** — cause attribution, institutional vs audience failure |
| q3 | **Platform moderation** — editorial judgment, censorship, Hunter Biden case |
| q4 | **AI and journalism** — technology's impact on knowledge production |
| q5 | **Enlightenment ideal** — epistemic capacity, institutional design, cognitive limits |
| q6 | **Platform ownership** — billionaire vs decentralized vs public infrastructure |
| q7 | **AI summarization** — knowledge ecosystem collapse, attribution |
| q8 | **Algorithmic de-amplification** — soft censorship, reach vs speech |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q3** and **q8** both probe moderation/censorship questions — keep q3 (stronger case study), cut q8
- **q4** and **q7** both probe AI's impact on knowledge production — keep q7 (more urgent, novel), cut q4
- **q1** and **q2** both probe trust/truth dynamics — keep both (q1 is about technology, q2 is about institutions)

### Recommendation: Keep q1, q2, q3, q5, q6, q7 → 6 MC + 1 new freeform

### Cut: q4, q8, q9

### Replacement freeform (q7 position, replacing q9):
> **"Think of a belief you hold strongly. How did you arrive at it — and how would you know if it were wrong?"**

*Why this works: The entire quiz probes epistemic frameworks abstractly; this question makes it concrete and personal. Reveals whether someone has genuine epistemic humility or just performs it.*

---

## Economic Disruption

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Is this time different?** — structural analysis of AI vs past automation |
| q2 | **UBI** — safety net philosophy, dignity vs purpose |
| q3 | **Corporate obligation** — what companies owe displaced workers |
| q4 | **Gig economy** — labor classification, worker protections |
| q5 | **Wealth concentration** — capitalism working or broken, Piketty |
| q6 | **Rust Belt precedent** — realism about transition, managed decline |
| q7 | **AI industry structure** — power concentration, antitrust |
| q8 | **Automation vs augmentation** — Acemoglu, policy determines outcomes |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q1** and **q7** both probe AI/power concentration — keep q1 (broader), cut q7
- **q3** and **q5** both probe corporate accountability/capitalism — keep q5 (bigger picture), cut q3
- **q2** and **q4** both probe safety net design — keep q2 (UBI is more fundamental), cut q4
- **q6** and **q8** both probe policy effectiveness/realism — keep q8 (more forward-looking), cut q6

### Recommendation: Keep q1, q2, q5, q8 → only 4 MC. Need 2 more.

Restore **q3** (corporate obligation) — distinct enough from q5 when q7 is gone (q3 is micro/corporate, q5 is macro/systemic).
Restore **q6** (Rust Belt) — unique historical precedent dimension, hard to replace.

### Final: Keep q1, q2, q3, q5, q6, q8 → 6 MC + 1 new freeform

### Cut: q4, q7, q9

### Replacement freeform (q7, replacing q9):
> **"Name a job that exists today that you think AI will make obsolete within 10 years — and one you think it never will. What's your reasoning?"**

*Why this works: Forces concrete prediction rather than abstract theorizing. The "never will" half reveals what they think is irreducibly human — which is the deeper position the constellation system needs.*

---

## Gentrification

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Displacement framing** — harm vs development vs supply problem |
| q2 | **Cultural displacement** — community value, history of racism |
| q3 | **Rent control** — market vs rights, economist consensus vs lived reality |
| q4 | **Airbnb/short-term rentals** — property rights vs community, regulation |
| q5 | **Walkability/15-minute city** — public good vs luxury, improvement paradox |
| q6 | **Historical destruction** — urban renewal, reparative lens, who controls development |
| q7 | **Zoning** — local control vs supply, NIMBYism, Tokyo comparison |
| q8 | **Institutional investors** — financialization, Wall Street vs homeownership |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q1** and **q2** both probe displacement framing/community value — keep q2 (richer, more specific), cut q1... actually q1 is the foundational framing question. Keep q1, cut q2 (East Austin culture is interesting but overlaps with q6's historical lens).
- **q3** and **q7** both probe market vs regulation — keep q3 (rent control is more emotionally charged, reveals more), cut q7
- **q4** and **q8** both probe financialization/property — keep q8 (higher stakes, more structural), cut q4
- **q5** and **q6** both probe equity/improvement paradox — keep q6 (historical depth), cut q5

### Recommendation: Keep q1, q3, q6, q8 → only 4 MC. Need 2 more.

Restore **q2** (cultural displacement) — actually different from q1 (q1 is economic framing, q2 is cultural identity).
Restore **q5** (walkability) — unique dimension about improvement paradox that nothing else covers.

### Final: Keep q1, q2, q3, q5, q6, q8 → 6 MC + 1 new freeform

### Cut: q4, q7, q9

### Replacement freeform (q7, replacing q9):
> **"Think about a neighborhood you know well that's changed significantly. Who benefited, who was harmed, and was there a version of that change that could have worked for both?"**

*Why this works: Grounds the abstract debate in personal experience. The "could have worked for both" twist reveals whether they think win-win outcomes are possible or naive.*

---

## Homelessness

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Root cause framing** — housing vs mental health vs systems |
| q2 | **Criminalization** — enforcement vs compassion, Grants Pass ruling |
| q3 | **Finland model** — transferability, political will, structural difference |
| q4 | **SF spending** — bureaucratic failure vs prevention, measuring success |
| q5 | **Encampments** — tolerate/support/remove, dignity vs order |
| q6 | **Involuntary treatment** — autonomy vs care, deinstitutionalization |
| q7 | **Houston model** — logistics vs structural conditions, replicability |
| q8 | **Universal vs targeted** — who deserves help, political sympathy |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q3** and **q7** both probe model replicability/transferability — keep q3 (Finland is more provocative), cut q7
- **q1** and **q4** both probe causal framing — keep q1 (more foundational), cut q4
- **q2** and **q5** both probe enforcement/tolerance spectrum — keep q2 (Supreme Court context, sharper), cut q5

### Recommendation: Keep q1, q2, q3, q6, q8 → only 5 MC. Need 1 more.

Restore **q5** (encampments) — actually quite different from q2 (q2 is about criminalization as legal principle, q5 is about what to do in practice right now).

### Final: Keep q1, q2, q3, q5, q6, q8 → 6 MC + 1 new freeform

### Cut: q4, q7, q9

### Replacement freeform (q7, replacing q9):
> **"If you had a billion dollars and five years to reduce homelessness in one U.S. city by 50%, what would you actually spend it on — be specific?"**

*Why this works: Forces resource allocation under constraints. Reveals whether they prioritize housing, treatment, systems, or something else — and whether they think the problem is solvable at all.*

---

## Gun Rights

### Dimension Map
| Q | Dimension |
|---|-----------|
| q1 | **Constitutional framework** — whether the legal structure itself is the problem |
| q2 | **International comparison** — why the US is different, cultural vs structural |
| q3 | **Suicide framing** — hidden majority of gun deaths, data vs narrative |
| q4 | **Rural/urban divide** — differentiated policy, one-size-fits-all rights |
| q5 | **AR-15 vs handguns** — symbolic vs statistical, policy targeting |
| q6 | **Racial inequality** — who gun rights actually serve, trust and violence |
| q7 | **Bipartisan compromise** — pragmatism vs principle, adequacy of half-measures |
| q8 | **Ghost guns/technology** — future of regulation, enforceability |
| q9 | **Generic freeform** — low signal |

### Overlaps
- **q1** and **q2** both probe why the US system fails — keep q1 (constitutional framing is more foundational), cut q2
- **q4** and **q5** both probe policy targeting — keep q4 (rural/urban is richer), cut q5
- **q3** and **q7** both probe pragmatism/reframing — keep q3 (suicide data is more surprising, more revealing), cut q7

### Recommendation: Keep q1, q3, q4, q6, q8 → only 5 MC. Need 1 more.

Restore **q7** (bipartisan compromise after Uvalde) — unique dimension about whether incremental progress is worth it, different from q3's reframing.

### Final: Keep q1, q3, q4, q6, q7, q8 → 6 MC + 1 new freeform

### Cut: q2, q5, q9

### Replacement freeform (q7 position, replacing q9):
> **"Set aside what's politically possible. If you could design gun policy for the U.S. from scratch — no Second Amendment, no existing laws, blank slate — what would it look like?"**

*Why this works: Strips away constitutional and political constraints to reveal their actual values. The gap between "what I'd design" and "what exists" reveals how they think about institutional change.*

---

## Summary Table

| Quiz | Current Qs | Trimmed Qs | Cut | Kept |
|------|-----------|-----------|-----|------|
| AI Governance | 9+1 | 6+1 | q4, q7, q8, q10 | q1, q2, q3, q5, q6, q9 + new freeform |
| Climate | 8+1 | 6+1 | q4, q7, q9 | q1, q2, q3, q5, q6, q8 + new freeform |
| Longevity | 8+1 | 6+1 | q4, q5, q9 | q1, q2, q3, q6, q7, q8 + new freeform |
| Meaning Crisis | 8+1 | 6+1 | q2, q7, q9 | q1, q3, q4, q5, q6, q8 + new freeform |
| Bioethics | 8+1 | 6+1 | q3, q4, q9 | q1, q2, q5, q6, q7, q8 + new freeform |
| Truth & Media | 8+1 | 6+1 | q4, q8, q9 | q1, q2, q3, q5, q6, q7 + new freeform |
| Economic Disruption | 8+1 | 6+1 | q4, q7, q9 | q1, q2, q3, q5, q6, q8 + new freeform |
| Gentrification | 8+1 | 6+1 | q4, q7, q9 | q1, q2, q3, q5, q6, q8 + new freeform |
| Homelessness | 8+1 | 6+1 | q4, q7, q9 | q1, q2, q3, q5, q6, q8 + new freeform |
| Gun Rights | 8+1 | 6+1 | q2, q5, q9 | q1, q3, q4, q6, q7, q8 + new freeform |

All quizzes go from 9 → 7 questions. Follow-up sub-questions (q1a, q3a, etc.) remain where their parent question survived — they're conditional and don't add length for most users.

## Renumbering Note

After implementing cuts, questions should be renumbered sequentially (q1-q7) so the IDs are clean. The new freeform question becomes q7 in every quiz.
