# Templates

Everything is Markdown. Copy what you need, delete what you don't.

## The two that matter

| Template | What it is |
|---|---|
| [**learner-profile.md**](learner-profile.md) | **Start here.** Who the learner is. The primary input — the project is designed outward from it. |
| [**project-plan.md**](project-plan.md) | The project. Frontmatter is the machine contract; the body is where the reasoning goes. |
| [project-plan.yaml](project-plan.yaml) | Pure-data variant, for systems that don't want Markdown. |

```bash
pbl profile new "Sam"                                    # scaffolds the profile
pbl plan new --profile learners/sam/learner-profile.md   # scaffolds the plan, pre-filled
```

`pbl plan new` carries across everything derivable from the profile — grade, subjects, standards verbatim, the success skill and its dimensions, the choice calibration — and injects a **product menu filtered to the learner's preferred modes** plus **suggested scaffolds for each of their needs**. The design decisions stay blank.

A freshly scaffolded plan is *supposed* to fail `pbl validate`. That's how you find what still needs filling in.

---

## For the learner

Pull only what the project needs. Six handouts nobody uses is worse than two they do.

| | Use it for |
|---|---|
| [know-need-to-know.md](student/know-need-to-know.md) | Capturing their questions at launch, and sequencing instruction from them |
| [learning-log.md](student/learning-log.md) | The research trail — question, source, finding, new question |
| [project-management-log.md](student/project-management-log.md) | Tasks and deadlines. **They own it**, by week two |
| [work-report.md](student/work-report.md) | A short weekly check-in, including a time estimate vs. actual |
| [team-contract.md](student/team-contract.md) | A working agreement — including what *you* commit to |
| [team-roles.md](student/team-roles.md) | Who decides what. Delegator roles, not doer roles |
| [presentation-plan.md](student/presentation-plan.md) | Planning the talk. A plan, not a script |
| [presentation-day-checklist.md](student/presentation-day-checklist.md) | Logistics, so they only have to think about the work |
| [audience-feedback-form.md](student/audience-feedback-form.md) | Giving the audience a real job |
| [self-reflection.md](student/self-reflection.md) | Looking back — **two days after**, not the same evening |

**Minimum viable set for a first project:** know-need-to-know, learning-log, presentation-plan, self-reflection. Add the rest when you feel the gap.

## For you

| | Use it for |
|---|---|
| [project-information-sheet.md](teacher/project-information-sheet.md) | One page for the learner, on the project wall |
| [entry-event-plan.md](teacher/entry-event-plan.md) | Designing the launch **backwards** from the questions you want |
| [day-by-day-calendar.md](teacher/day-by-day-calendar.md) | Week by week, with the slack marked and the critique protected |
| [product-rubric.md](teacher/product-rubric.md) | Criteria derived from standards, with the learner self-assessing first |
| [formative-assessment-plan.md](teacher/formative-assessment-plan.md) | What you'll look at, and **what you'll do about it** |
| [family-letter.md](teacher/family-letter.md) | Explaining it to grandparents, a co-parent, a co-op |
| [post-project-reflection.md](teacher/post-project-reflection.md) | Plus/delta, and **the profile update** |

---

## Two notes on how these are written

**Every handout has a comment block at the bottom.** How to use it, the common mistake, and a one-learner adaptation where the classroom original assumes a class. Read those — they're where the actual guidance is. Delete them before printing.

**The one-learner adaptations aren't cosmetic.** A team contract becomes an agreement that includes *your* commitments. A share-out needs a real recipient. Reflection works better walking than across a table. Those notes are the difference between a classroom form and something that works for one kid.

---

## Filling in the plan

Work top to bottom, but **get the three foundations right before you touch the project path** — learning goals, driving question, and product-plus-audience. Everything downstream depends on them, and redoing a six-week calendar because the driving question turned out to be closed is a bad afternoon.

Then:

```bash
pbl validate learners/sam/project-plan.md   # well-formed?
pbl review learners/sam/project-plan.md     # any good?
```

→ [docs/06-design-process.md](../docs/06-design-process.md) · [schema/README.md](../schema/README.md)
