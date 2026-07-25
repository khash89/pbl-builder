# Worked Examples

Three complete **profile → plan** pairs. All three pass `pbl profile check`, `pbl validate`, and `pbl review` with zero failures and zero warnings, and CI keeps them that way.

Read one before you start your own. Seeing a filled-in plan is worth more than reading the design process twice.

| Example | Grade | Setting | Subjects | Weeks | Target skill |
|---|---|---|---|---|---|
| [maya-grade-4-water](maya-grade-4-water/) | 4 | Homeschool | Science, ELA | 4 | Critical thinking — *explanation & analysis* |
| [devon-grade-8-empty-lot](devon-grade-8-empty-lot/) | 8 | Microschool | Social Studies, Maths, ELA | 6 | Complex communication — *audience awareness* |
| [amara-grade-11-ai-line](amara-grade-11-ai-line/) | 11 | Tutoring | Maths, ELA | 8 | Self-directed learning — *self-regulation, autonomy* |

---

## What each one is for

Each example was written to demonstrate a specific design problem, not just to be a nice project.

### [Maya — "Where Does Our Water Go?"](maya-grade-4-water/)

> *How can we stop our driveway from washing into the creek?*

**The problem it solves: a learner who has decided she's bad at reading.** Maya reads two years below grade level and a previous water-cycle unit failed because it was reading-first — she concluded in week one that it wasn't hers. Here the evidence comes from her own measurement stakes, sources are tiered with her choosing the entry point, and one deliberately adult-level source is read aloud together so she can be the person who understands the hardest document in the room.

**Also demonstrates:** a comfort ramp for low audience comfort (grandmother → neighbours → watershed council) instead of dropping the public product; a physical model that presents *for* an anxious learner; scaffolds with triggers rather than dates.

### [Devon — "The Lot on Main Street"](devon-grade-8-empty-lot/)

> *What should our town do with the empty lot on Main Street, and who actually gets to decide?*

**The problem it solves: turning a "difficult" trait into the project's engine.** Devon argues constantly and doesn't read the room — he had the best evidence in a co-op debate and lost it by escalating at people who were coming round. The intervention is structural: he may not state a recommendation until three residents have confirmed he can state their positions accurately.

**Also demonstrates:** maths integrated without being bolted on (a grade-7 proportional-reasoning standard he can execute but doesn't recognise, applied to costing three land uses); a real public comment period with a hard three-minute limit; designing around a writing aversion without lowering the demand; a sealed week-1 prediction opened in week 5.

### [Amara — "Where Should We Draw The Line?"](amara-grade-11-ai-line/)

> *Where should our school draw the line on AI, and what do the people it applies to actually think?*

**The problem it solves: a high-achieving learner who has never chosen anything.** Amara does assigned work excellently and freezes on open tasks — given a free research week she produced twelve immaculate pages and never picked a direction. The project manufactures about twenty consequential decisions and documents all of them in a decision log that starts as a scaffold and graduates into a product.

**Also demonstrates:** a genuinely contested question with no answer the adult holds; an adult who pre-commits to not answering "what would you do?"; original data collection with the learner owning the sampling decisions; scaffolding autonomy for someone who wants structure; a fade schedule with named gates the learner can see.

---

## The learners are invented

Maya, Devon, and Amara are not real children. No real learner data appears anywhere in this repository — see [`learners/README.md`](../learners/README.md) for why that matters.

The projects are original too. None of them is derived from the PBLWorks exemplar planners.

## The standards are real

Every code in every example resolves against [`framework/standards/`](../framework/standards/). `pbl profile check` fails on a code that doesn't, which is how we know.

## What they deliberately don't include

No K–2 example. Nothing in the arts, world languages, or CTE. No example with two learners sharing a project. Those are the most useful gaps to fill — see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

---

## Reading them

Start with the **learner profile**, then the plan's **"Why This Project For This Learner"** section. Those two together are the argument. The frontmatter is the machinery.

```bash
pbl review examples/maya-grade-4-water/project-plan.md
```

Then try breaking one — change a product type to something outside the learner's `product_modes`, or empty a `fade_plan` — and watch which check fires. That's the fastest way to understand what the tool is actually looking for.
