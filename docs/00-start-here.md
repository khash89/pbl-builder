# Start here

Ten minutes of reading that will save you a wasted month.

---

## The idea in one paragraph

Project Based Learning is a teaching method where a learner gains knowledge and skills by working for an extended period on an authentic, complex question or problem, and produces something real for a real audience. It is the **main course, not dessert** — the content is learned *through* the project, not taught first and then decorated with a poster.

The thing that makes PBL work is not the project. It's the eight design elements underneath it. A project without them is a craft activity with a rubric attached.

## The idea in one diagram

```
                    ┌──────────────────────────┐
                    │  WHO IS THIS LEARNER?    │  ← you start here
                    │  learner-profile.md      │
                    └────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
      ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
      │ LEARNING      │  │ DRIVING       │  │ PUBLIC        │
      │ GOALS         │◄─┤ QUESTION      ├─►│ PRODUCT       │
      │ standards +   │  │ open-ended,   │  │ + a real      │
      │ ONE skill     │  │ theirs        │  │ audience      │
      └───────┬───────┘  └───────┬───────┘  └───────┬───────┘
              └──────────────────┼──────────────────┘
                                 ▼
        ┌────────────────────────────────────────────────┐
        │              THE PROJECT PATH                  │
        │  Launch → Build Knowledge → Develop &          │
        │           Critique → Present                   │
        │  with scaffolds, reflection, and critique       │
        │  cycles built in — not added later             │
        └────────────────────────────────────────────────┘
```

Those three boxes in the middle — goals, question, product — have to be **mutually aligned**. If answering the driving question doesn't require learning the standards, the project is decorative. If the product doesn't demonstrate the learning, the assessment is fake. Getting these three right is most of the work.

---

## Why this repo starts with the learner

Most PBL planning assumes a classroom: design one project, then differentiate for thirty kids. If you're a homeschool parent, a tutor, or a microschool teacher, that's backwards. You have one learner. You know an enormous amount about them. That knowledge should be the *input* to the design, not a patch applied afterward.

So the sequence here is:

1. **Write a learner profile** — grade, standards they need, one success skill to grow, what they actually care about, how they work, where they get stuck. → [`docs/15-learner-profiles.md`](15-learner-profiles.md)
2. **Design the project outward from it** — the topic comes from their interests, the product comes from their preferences, the scaffolds come from their needs, the pacing comes from their experience. → [`docs/06-design-process.md`](06-design-process.md)
3. **Check it honestly** before you commit six weeks to it. → [`rubrics/project-design-rubric.md`](../rubrics/project-design-rubric.md)

---

## Your three paths

### Path A — With an AI assistant

Open this repo in Claude Code, Cursor, Codex, or any agent that reads `AGENTS.md`, and say what you want. The agent will interview you, write the profile and plan, and check its own work.

**What to expect:** it will ask you a lot of questions in one go. Answer them specifically — "skates the same three tricks until they land" is worth ten times more than "likes sports." The quality of the project is capped by the quality of your answers.

**What to watch for:** the agent may try to be agreeable. If it accepts a vague interest or lets you assess all five success skills, push back. [`CLAUDE.md`](../CLAUDE.md) tells it not to; hold it to that.

### Path B — On your own

Everything is plain Markdown. No tools required.

1. Read this file, then [`01-what-is-pbl.md`](01-what-is-pbl.md) and [`03-design-elements.md`](03-design-elements.md). That's the conceptual floor.
2. Copy [`templates/learner-profile.md`](../templates/learner-profile.md), fill it in.
3. Copy [`templates/project-plan.md`](../templates/project-plan.md). Work through it with [`06-design-process.md`](06-design-process.md) open beside you.
4. Pull the handouts you need from [`templates/student/`](../templates/student/).
5. Self-check against [`rubrics/project-design-rubric.md`](../rubrics/project-design-rubric.md).

Budget 2–4 hours for your first project design. It gets much faster.

### Path C — Building software

[`schema/README.md`](../schema/README.md) is your entry point. Two JSON Schemas define the contract; `framework/*.yaml` holds the canon with stable ids; `framework/standards/` holds academic standards as JSONL.

---

## Reading order, if you want the whole thing

**The floor — read these:**

| File | What it gives you |
|---|---|
| [`01-what-is-pbl.md`](01-what-is-pbl.md) | What separates PBL from "doing a project" |
| [`03-design-elements.md`](03-design-elements.md) | The eight elements. The most important file here. |
| [`05-project-path.md`](05-project-path.md) | The four phases and what happens in each |
| [`06-design-process.md`](06-design-process.md) | The step-by-step design sequence |
| [`15-learner-profiles.md`](15-learner-profiles.md) | How to write a profile that produces a good project |
| [`11-solo-and-small-group-pbl.md`](11-solo-and-small-group-pbl.md) | What changes without a class. Read before your first project. |

**When you need them:**

| File | For |
|---|---|
| [`02-gold-standard-framework.md`](02-gold-standard-framework.md) | How the pieces fit together |
| [`04-teaching-practices.md`](04-teaching-practices.md) | What you do while the project runs |
| [`07-driving-questions.md`](07-driving-questions.md) | Writing and fixing driving questions |
| [`08-success-skills.md`](08-success-skills.md) | The five skills, and picking one |
| [`09-assessment.md`](09-assessment.md) | Formative, summative, and how not to fake it |
| [`10-strategies/`](10-strategies/) | 16 specific classroom moves |
| [`12-equity.md`](12-equity.md) | High expectations plus real support |
| [`13-grade-bands.md`](13-grade-bands.md) | What's different at K–2, 3–5, 6–12 |
| [`14-using-ai.md`](14-using-ai.md) | Using an LLM well, and where it lies to you |
| [`16-standards.md`](16-standards.md) | The standards data, jurisdictions, provenance |
| [`glossary.md`](glossary.md) | Every term in one place |

---

## Five mistakes almost everyone makes the first time

1. **Assessing all five success skills.** You will want to. Don't — pick one, pick 1–3 dimensions inside it, teach those explicitly. Five assessed means none taught.

2. **A driving question with an answer.** "What are the parts of a watershed?" is a research prompt. "How can we keep the rain that falls on our yard from hurting the creek?" is a driving question. If you can Google the answer, it's not one. → [`07-driving-questions.md`](07-driving-questions.md)

3. **Front-loading all the content.** Teaching the whole unit and *then* starting the project makes it dessert. The learner should hit the problem first, generate questions, and get instruction when they need it. That feels wrong and works better.

4. **Dropping the public audience because the kid is shy.** This is the most common and most costly compromise. The audience is what raises the quality bar. Build a ramp instead — one trusted adult, then a small friendly group, then the real thing. → [`10-strategies/presentations.md`](10-strategies/presentations.md)

5. **Feedback only at the end.** Critique and revision has to happen *during*, with time to act on it. Schedule the critique session and the revision work as separate blocks, before the presentation.

---

## Where this comes from

The framework is [PBLWorks](https://www.pblworks.org/) (Buck Institute for Education). Everything here is written from scratch and cited; nothing is copied. Their official resources are free and better than ours — get them at [pblworks.org/resources](https://www.pblworks.org/resources). Standards data comes from the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph) under CC BY 4.0. Full attribution: [`NOTICE.md`](../NOTICE.md).

---

**Next:** [`01-what-is-pbl.md`](01-what-is-pbl.md) →
