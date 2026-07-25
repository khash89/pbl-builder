---
name: pbl-plan-reviewer
description: "Review an existing Project Based Learning project plan and return prioritized, specific revisions. Works on PBL Builder plans and on plans written anywhere else — a Word doc, a Google Doc, a pasted outline, a plan from another curriculum. Use when someone asks for feedback on a project plan, wants to know whether a project is 'real PBL', or asks what's weak about a unit they've designed. Trigger phrases: 'review my project plan', 'is this good PBL?', 'what's wrong with this unit', 'critique this project', 'will this work?'. Output: ranked findings, each with the specific fix."
---

# Project Plan Reviewer

Assess a project against the eight Essential Project Design Elements and say specifically what to change.

Deliberately usable on plans that have nothing to do with this repo — a pasted outline, a Word document, a unit from a boxed curriculum. Most people who need this review don't have a `project-plan.md`.

---

## Read first

1. `framework/design-elements.yaml` — the eight elements, with check questions and failure modes
2. `rubrics/project-design-rubric.md` — the judgments no checker can make
3. `framework/project-path.yaml` — the cross-phase invariants

---

## Step 1 — If it's a PBL Builder plan, run the tool first

```bash
pbl validate <path>
pbl review <path>
```

That gives you fifteen deterministic checks in a second. **Don't repeat them in prose.** Your value is what the checker can't see:

- Is the driving question genuinely open, or does it merely have an open *shape*?
- Does answering it actually require the standards?
- Is the authenticity real or asserted?
- Is the product going to teach what it claims to?
- Where will this stall, and what happens then?
- Is this project actually for this learner, or a good project with their name on it?

Report the tool's failures briefly, then spend your effort on the above.

## Step 1b — If it isn't, map it first

For a pasted plan or an external document, extract what you can find:

| Element | What to look for |
|---|---|
| Learning goals | Named standards? How many? One success skill, or five, or none? |
| Driving question | Present at all? Open? Googleable? |
| Sustained inquiry | Weeks or days? Is content front-loaded? |
| Authenticity | Real context, real tools, real impact, real personal connection? |
| Voice and choice | Real decisions, or format choices? |
| Reflection | More than once? On process, or only content? |
| Critique and revision | Before the end? **Who gives it?** Is revision time scheduled? |
| Public product | Real audience beyond the classroom or household? Named? |

**Name what's missing rather than guessing at it.** "I can't find a critique cycle — is there one?" is more useful than assuming there isn't.

---

## Step 2 — Rank the findings

Report in order of what would most improve the project, not in element order. Roughly:

1. **A missing or closed driving question.** Everything else is downstream. A project with a closed question cannot be fixed by improving the product.
2. **No critique cycle, or one with nobody to give it.** The largest single quality lever, and the most commonly absent.
3. **No real public audience.** The motivation and the quality bar both come from here.
4. **Front-loaded content.** Means inquiry died before the project began.
5. **Five success skills, or none.** Fix by picking one.
6. **Standards chosen after the activity.** Everything is nominally aligned and nothing is taught.
7. **The plan isn't specific to this learner.** Applies whenever a profile exists.
8. Everything else.

---

## Step 3 — Make each finding actionable

For each one:

- **What's wrong**, in one sentence
- **Why it matters** — the consequence, concretely, not "this is a Gold Standard element"
- **What to change**, specifically enough to act on today
- **A pointer** into `docs/` for the detail

Weak:

> The driving question could be more open-ended. Consider revising it to be more student-friendly.

Useful:

> **"What are the parts of an ecosystem?" is a research prompt, not a driving question.** It has one findable answer, so the learner will look it up, write it down, and the six weeks will feel padded — which is usually where disengagement comes from in week three.
>
> Reframe toward a decision or a design. Given that the standards are about interdependence, something like *"Which animal should we bring back to this valley, and what would it need?"* requires the same content and has no single answer. → `docs/07-driving-questions.md`

---

## Step 4 — Say what's good, specifically

Not as encouragement padding. Because a reviewer who only lists problems gets discounted, and because knowing which parts are load-bearing tells the author what to protect when they start cutting.

Name the thing, and say why it works.

---

## Step 5 — Give them the one thing

End with a single sentence: the highest-leverage change.

> If you only change one thing: get a critique cycle into week 4 with a named person, and put the revision in the calendar as its own session. That single change will do more for the quality of the final product than anything else on this list.

---

## Judgment calls, not rule enforcement

Some things that look like violations are correct decisions:

- **A very short project** with a compressed Build Knowledge phase — fine, if critique and the audience survived.
- **A narrow choice menu** — correct for a learner who freezes at open tasks. Check `choice_appetite` before flagging it.
- **A small audience** — three genuinely interested strangers beats an auditorium of obligated attendees.
- **"Impact: none, but this is how the work is really done"** — an honest answer, and better than invented stakes.
- **A scaffold that shouldn't fade** — that's an accommodation. The fix is moving it, not adding a fade plan.

Ask before flagging, where the answer would change your verdict.

## And don't

- **Don't rewrite the plan.** Review it. The author owns it.
- **Don't pile on.** Five specific findings beat twenty.
- **Don't invent standards codes** in your suggested fixes. `pbl standards search`.
- **Don't soften a real problem.** A closed driving question is a closed driving question, and saying so plainly now is kinder than six wasted weeks.
