# Rubrics

Three kinds, doing three different jobs.

| Rubric | Who it's for | When |
|---|---|---|
| [project-design-rubric.md](project-design-rubric.md) | You | **Before** you launch. Checks the plan. |
| [project-based-teaching-rubric.md](project-based-teaching-rubric.md) | You | **After.** Checks how you ran it. |
| [success-skills/](success-skills/) | The learner, and you | Throughout. Checks the one targeted skill. |

Product criteria — what makes *this* artifact good — live in the project plan itself, derived from the standards. There's no template for them because they're project-specific by definition. → [docs/10-strategies/rubrics.md](../docs/10-strategies/rubrics.md)

---

## The design rubric comes first

Use it before you commit six weeks. `pbl review` automates the mechanical half of it — placeholders, missing phases, a critique cycle that isn't there. The rubric covers the judgments no checker can make, and the most useful single question in it is:

> If you deleted the learner's name from this plan, what would still be specific to them?

## The teaching rubric is the one people skip

And it's usually the more useful, because **most disappointing projects are well-designed and under-run.** A perfect plan run with too much rescuing produces mediocre work.

Nobody else scores this one. That's what makes honesty worth more than a good result.

## The success-skill rubrics

One per skill. **You pick one skill per project, and one to three dimensions within it** — everything else on the rubric is explicitly out of scope, and saying so out loud is part of keeping the focus real.

- [critical-thinking.md](success-skills/critical-thinking.md)
- [complex-communication.md](success-skills/complex-communication.md)
- [creativity.md](success-skills/creativity.md)
- [self-directed-learning.md](success-skills/self-directed-learning.md)
- [collaboration.md](success-skills/collaboration.md) — read the warning first if you're teaching one learner

**These are printable and learner-facing.** The learner self-assesses against the named rows, in their own words, *before* you say anything. The gap between their judgement and yours is the most useful data the project produces.

### They're generated

The success-skill rubrics are rendered from [`framework/success-skills/*.yaml`](../framework/success-skills/), which is the single source of truth.

**Edit the YAML, not the Markdown.** Then:

```bash
node tools/cli/src/render-rubrics.mjs
```

A test asserts the committed files match the YAML, so drift fails CI rather than landing quietly.

---

## Attribution

The design rubric and teaching rubric are structured around the PBLWorks Essential Project Design Elements and Project Based Teaching Practices. The success-skill rubrics align to the five PBLWorks success skills.

**All descriptor language in this directory is original writing.** None of it is PBLWorks rubric text. Their official rubrics are free, more thoroughly field-tested than ours, and available at [pblworks.org/resources](https://www.pblworks.org/resources) — if you're doing this work seriously, get them.

See [NOTICE.md](../NOTICE.md).
