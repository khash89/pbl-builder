# Glossary

Terms as this repo uses them. Where a term is machine-readable, the file is linked.

---

**Accommodation** — A permanent support that levels access and is not expected to fade (text-to-speech for a slow decoder). Distinct from a *scaffold*. Lives in the profile's `needs.accommodations`. Confusing the two is how a learner ends up unable to start anything without a checklist someone else wrote.

**Audience comfort** — Profile field: how comfortable the learner is presenting. `low` means build a *comfort ramp*. It never means dropping the public product.

**Audience pressure** — Product-type field: how exposed the learner is at handoff. `low` means the artifact goes without them; `high` means sustained live performance under questioning. → [product-types.yaml](../framework/product-types.yaml)

**Authenticity** — Design element 4. Real context, real tools and processes, real impact, or real personal connection. Any one is sufficient.

**Build Knowledge** — Project Path phase 2. Where the learner answers their own questions. The phase that stalls in solo settings.

**Choice appetite** — Profile field: how much open choice helps versus paralyses this learner. `low` means a short menu that widens, not no choice.

**Comfort ramp** — Graduated rehearsal audiences for an anxious learner: alone → trusted adult → small friendly group → real audience. Plan field `public_audience.comfort_ramp`. Fade the ladder, not the audience.

**Critique** — Structured feedback anchored to criteria, given while there's still time to act on it. Design element 7. Needs a *named* person in a one-learner setting.

**Dessert project** — A project bolted on after the content was taught. The thing Gold Standard PBL is defined against. Test: if you removed the project, would they have learned the same content anyway?

**Develop & Critique** — Project Path phase 3. Where quality comes from. Protect it when the schedule slips.

**Dimension** — A row within a success skill rubric (e.g. `explanation-and-analysis` inside critical thinking). You target one to three, not the whole skill.

**Driving question** — The open-ended question that frames the project, in the learner's language, answerable only by learning the standards. → [07-driving-questions.md](07-driving-questions.md)

**Entry event** — The launch experience that creates a need to know, before any content is taught. Not an introduction to the project. → [entry-event.md](10-strategies/entry-event.md)

**Fade plan** — Required field on every scaffold: how and when the support comes off. Should be a trigger ("once she drafts two sections without a frame"), not a date.

**Formative assessment** — Assessment that changes what you do next. Required in both middle phases. If you don't act on it, it's record-keeping — hence the `responds_how` field.

**Gold Standard PBL** — PBLWorks' framework: the essential design elements, the teaching practices, and an equity-centered vision. → [02-gold-standard-framework.md](02-gold-standard-framework.md)

**Jurisdiction** — Which standards set applies. `Multi-State` covers CCSS, NGSS, C3, and WIDA; otherwise a US state name or a free-text label for any other framework.

**Knowledge Graph** — The [Learning Commons](https://github.com/learning-commons-org/knowledge-graph) dataset the bundled standards come from. CC BY 4.0. → [PROVENANCE.md](../framework/standards/PROVENANCE.md)

**Launch** — Project Path phase 1. Creates the need to know.

**Learner profile** — The primary input. Who this learner is, in structured form. The project is designed outward from it. → [15-learner-profiles.md](15-learner-profiles.md)

**Learning log** — The learner's research trail: question, source, what they learned, what it opened up. → [learning-log.md](10-strategies/learning-log.md)

**Main course, not dessert** — Larmer & Mergendoller's phrase for content learned *through* the project rather than before it.

**Milestone** — A unit within a Project Path phase. Needs a name, at least one need-to-know question, and at least one learning experience.

**Need-to-know (NTK)** — A question the learner raises, used to sequence instruction. The mechanism that makes PBL inquiry rather than a themed unit. → [need-to-know.md](10-strategies/need-to-know.md)

**Need tag** — A functional descriptor of what helps a learner learn (`task-initiation`, `reading-comprehension`). Deliberately functional, never diagnostic. Each maps to scaffolds. → [scaffolds.yaml](../framework/scaffolds.yaml)

**Present** — Project Path phase 4. The work goes to real people, then reflection.

**Product mode** — A way of *making* the learner is drawn to (`build-physical`, `persuade-or-argue`). About the act, not the artifact — someone who likes building takes to a model regardless of subject. Filters the product menu.

**Profile fidelity** — The `pbl review` check that the plan actually reflects the profile: the personal connection names a real interest, the product matches their modes, every need has a scaffold. The check that catches a generic project with a child's name attached.

**Project Path** — The four phases: Launch → Build Knowledge → Develop & Critique → Present. All four appear in every project. → [05-project-path.md](05-project-path.md)

**Project wall** — One visible surface holding the driving question, need-to-knows, next deadline, and criteria. Learner-maintained by week two. → [project-wall.md](10-strategies/project-wall.md)

**Public product** — Design element 8. Work that goes to real people beyond the household, with the learner explaining their reasoning. The most commonly abandoned element and the most costly to abandon.

**Scaffold** — A *temporary* support that makes an out-of-reach task reachable, and comes off. Distinct from an *accommodation*. Every one needs a fade plan. → [scaffolds.yaml](../framework/scaffolds.yaml)

**Standards status** — `not-started` (teach directly), `developing` (apply and critique), `secure` (leverage, don't reteach). Drives what kind of milestone a standard gets.

**Stuck protocol** — Required plan field: the ordered steps for when the learner stalls. "Help them" is not a protocol. The most common way a solo project dies is an unhandled week-three stall.

**Success skill** — One of five: collaboration, critical thinking, creativity, complex communication, self-directed learning. **You target one per project.** → [08-success-skills.md](08-success-skills.md)

**Sustained inquiry** — Design element 3. Iterative investigation over weeks, driven by the learner's questions. Killed by front-loading.

**Voice and choice** — Design element 5. Real decisions of the kind an adult professional makes. Calibrated to the learner, and widening. Not maximised.

---

## Repo-specific terms

**`pbl profile check`** — Validates a learner profile and checks it's *usable* — specific interests, observable strengths, one success skill, resolvable standards codes.

**`pbl review`** — Runs fifteen deterministic checks on a plan against the design elements. A plan can pass all of them and still be a bad project; a plan that fails them is reliably worse than it looks.

**`pbl validate`** — Checks a plan is well-formed: schema, required body headings, no unfilled placeholders.

**TBD** — The honest value for a standards code you couldn't verify. Warns rather than fails. Always better than an invented code that looks real.

---

*Framework terminology from PBLWorks / Buck Institute for Education. Definitions original — see [NOTICE.md](../NOTICE.md).*
