# Portable Prompts

For using ChatGPT, Gemini, or any assistant **without** this repo attached.

If your assistant *can* read the repo, don't use these — it should read [`CLAUDE.md`](../CLAUDE.md) and the [skills](../.claude/skills/) instead, which are much better. These exist because most people are working in a browser tab.

## Use them in order

| | Prompt | What it produces |
|---|---|---|
| 1 | [build-a-learner-profile.md](01-build-a-learner-profile.md) | A structured description of your learner |
| 2 | [generate-project-ideas.md](02-generate-project-ideas.md) | 4-5 project ideas to reject 4 of |
| 3 | [draft-the-foundations.md](03-draft-the-foundations.md) | Learning goals, driving question, product + audience |
| 4 | [map-the-project-path.md](04-map-the-project-path.md) | Four phases with milestones |
| 5 | [build-the-week-by-week.md](05-build-the-week-by-week.md) | The day-to-day calendar |
| 6 | [design-assessment.md](06-design-assessment.md) | Formative, summative, and skill checks |
| 7 | [critique-my-plan.md](07-critique-my-plan.md) | An honest review before you commit |

**Stop after prompt 3 and check the foundations properly.** Everything downstream depends on them, and re-doing a six-week calendar because the driving question was closed is a bad afternoon.

## Three things to hold the line on

Assistants are agreeable. These prompts push back on your behalf, but you'll need to as well:

1. **Two or three *specific* interests.** "Sports" produces a generic project. "Argues about transfers with his uncle for an hour" produces a real one. The model will accept the vague version.
2. **One success skill.** It will happily track four. A project that assesses five teaches none.
3. **Never accept a standards code from a model.** They generate extremely plausible fake ones. Look every code up in your own framework documents. This is the single biggest risk in the whole process.

→ [`docs/14-using-ai.md`](../docs/14-using-ai.md) for more, including prompts that get pushback rather than agreement.
