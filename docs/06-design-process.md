# The Design Process

Nine steps. Steps 1 and 2 gate everything else — get them wrong and you'll redo the rest.

Budget 2–4 hours for your first project design. It gets much faster.

---

## Step 1 — Write the learner profile

**Before anything about the project.** The project is designed outward from this.

```bash
pbl profile new "Sam"
# fill it in
pbl profile check learners/sam/learner-profile.md
```

The field that matters most is `interests`, and it has to be specific. "Sports" produces a generic project; "argues about transfers with his uncle for hours" produces a real one. `pbl profile check` will reject the vague version.

**Gate:** `pbl profile check` passes.

→ [How to write a profile that produces a good project](15-learner-profiles.md)

---

## Step 2 — Draft the three foundations, then stop

These three must fit together, and everything downstream depends on them.

### A. Learning goals

- **Standards.** Find the real codes: `pbl standards search "erosion" --grade 4`. Never invent one — use `TBD` and say so.
- **Understandings.** What should survive a year, in your own words. Bigger than any single standard.
- **One success skill**, with one to three named dimensions. Chosen for a specific gap you've actually observed.

### B. Driving question

Open-ended, in this learner's language, answerable only by learning the standards.

Test it: could you google it? Then it's a research prompt. → [Driving questions](07-driving-questions.md)

### C. Public product and audience

Build the product menu from [`framework/product-types.yaml`](../framework/product-types.yaml), **filtered by the learner's `product_modes`**, then let them choose. Name the audience specifically — real people, beyond the household.

### Then check the alignment

```
        LEARNING GOALS
         ↗          ↖
DRIVING QUESTION ←→ PUBLIC PRODUCT
```

- Does answering the question *require* the standards?
- Does the product *demonstrate* the standards?
- Does the question make the product the natural thing to make?

If any of those is no, fix it here. It costs an hour now and a week later.

**Gate:** you're confident in all three. If someone else is designing this with you — an AI assistant, a co-teacher — confirm the foundations before either of you touches a milestone.

---

## Step 3 — Establish authenticity

Four routes, any one sufficient:

- **Real context** — whose job does this resemble?
- **Real processes and tools** — what methods and quality standards do they use?
- **Real impact** — what could genuinely change?
- **Personal connection** — **name a specific interest from the profile.** Not "connects to their interests." Name it. `pbl review` fails the generic version.

If impact is honestly nothing, write that. Invented stakes are transparent to learners.

---

## Step 4 — Choose the product

You built the menu in step 2. Now:

- Filter to two to four viable options by mode, effort, `audience_pressure`, and the real constraints (time, budget, tech, transport).
- **They choose.** Choosing for them defeats the purpose.
- Write `why_this_learner` for the one they picked. If you can't, you picked off a list rather than for a person.
- Derive the criteria from the standards. Four or five that matter, not twelve that cover everything.

`pbl plan new --profile <path>` generates this menu automatically.

---

## Step 5 — Map the four phases

For each of Launch, Build Knowledge, Develop & Critique, Present, write milestones. Each needs:

- A name — what gets accomplished
- **At least one need-to-know question**, written as *their* question, not your objective
- At least one learning experience
- A deliverable — what exists at the end

And across the whole path:

- [ ] At least one **critique cycle before Present**, with a separate revision block
- [ ] At least **two reflection points, in two different phases**
- [ ] **Formative assessment in both middle phases**

Leave slack. The first project always runs long, and a plan with no give turns every slip into a failure.

→ [Project Path](05-project-path.md) · [Strategies by phase](../framework/strategies.yaml)

---

## Step 6 — Select scaffolds

For every populated need in the profile, pick at least one scaffold from [`framework/scaffolds.yaml`](../framework/scaffolds.yaml).

**Every scaffold needs a fade plan, and it should be a trigger rather than a date.** "Once she drafts two sections without a frame" tells you what to watch for; "week 4" is a plan to forget.

Don't stack more than three or four at once. And if a support genuinely should never come off, it's an accommodation — move it to the profile's `needs.accommodations` and stop calling it a scaffold.

---

## Step 7 — Plan assessment

- **Formative** — in both middle phases, each with a `responds_how`. Assessment you don't act on is record-keeping.
- **Summative** — the product against its criteria, plus at least one outside voice if you can get one.
- **Success skill** — checked separately from content. Include a self-assessment against the rubric rows in the first week and the last, so the learner can see the movement.

→ [Assessment](09-assessment.md)

---

## Step 8 — Write the support plan

This replaces classroom management, and it's the section that determines whether week three holds together.

- **`adult_role`** — what you do, and what you deliberately don't.
- **`check_in_cadence`** — how often, and what happens in it.
- **`stuck_protocol`** — the steps, in order, before it becomes a crisis. "Help them" is not a protocol. It always happens and improvising it goes badly.
- **`critique_partners`** — named people. Without this, critique doesn't happen.
- **`when_to_stop`** — your tripwire for reshaping or abandoning. Decide it now, while you're calm.

---

## Step 9 — Check it

```bash
pbl validate learners/sam/project-plan.md   # well-formed?
pbl review learners/sam/project-plan.md     # any good?
```

Fix every failure. **Read the warnings** — most are real judgment calls that are yours to make, not the tool's. A plan can pass all fourteen checks and still be a bad project; a plan that fails them is reliably worse than it looks.

Then have a look at [project-design-rubric.md](../rubrics/project-design-rubric.md) for the things no checker can see.

---

## Common sequencing mistakes

**Designing the activity first.** You have a great idea for a thing to build, then reverse-engineer standards to justify it. You can always find a standard that sort of fits. Goals first.

**Skipping the profile because you know the kid.** You do — and it's in your head, unexamined, mixed up with hopes and worries. Writing it down is what makes it usable, and it forces you to be specific about interests in a way that thinking about it doesn't.

**Mapping the calendar before confirming the foundations.** Then the driving question turns out to be closed and you redo six weeks of milestones.

**Choosing the product for them.** The most common one. Build the menu, then step back.

**Leaving the audience until the end.** Tell them on day one who's coming. It changes how they work for the whole project.

---

**Next:** [Driving questions](07-driving-questions.md) →

---

*Process adapted from PBLWorks project design guidance. All text original — see [NOTICE.md](../NOTICE.md).*
