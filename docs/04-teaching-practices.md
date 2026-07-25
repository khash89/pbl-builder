# The Project Based Teaching Practices

The design elements describe the project. These describe you.

No document can verify them — which is why most disappointing projects are well-designed and under-run. Machine-readable version, with a one-learner translation for each: [`framework/teaching-practices.yaml`](../framework/teaching-practices.yaml). Self-assessment: [project-based-teaching-rubric.md](../rubrics/project-based-teaching-rubric.md).

---

## 1. Design & Plan

Create or adapt a project for *this* learner, and plan it from launch to culmination while leaving room for their decisions to change it.

**Strong looks like:** all eight design elements genuinely present; scaffolds, assessment, and a flexible calendar in the plan; resources, experts, and audience arranged before week one; the plan says where it expects to change.

**One learner:** you can plan far more precisely than a class teacher, because you know exactly one person. Use that — scaffolds should be specific to them, not a generic support menu. The risk is over-planning: leave the choices genuinely open or voice and choice becomes theatre.

**Fails by:** planning the activities before deciding the learning goals.

---

## 2. Align to Standards

Use standards to build the project, and derive the product criteria from them.

**Strong looks like:** product criteria visibly traceable to specific standards; every standard has something that provides evidence for it; scaffolds and rubrics refer back to the standards they serve.

**One learner:** homeschool and tutoring settings tend to either ignore standards or treat them as a checklist to tick. Neither works. Use them as the answer to "what makes this product good" — that's what they're for.

**Fails by:** choosing standards afterwards to justify the project. The test: could the learner meet every criterion and still not have learned the standard?

---

## 3. Build the Culture

Promote independence, open inquiry, attention to quality, and the idea that work improves rather than being right or wrong.

**Strong looks like:** norms agreed *with* the learner; risks taken and being wrong treated as information; revision normal rather than punitive; the learner usually knows what to do next without asking.

**One learner:** a culture of two is intimate and therefore fragile — your mood is the entire climate. The specific thing to build is the separation between *"this draft isn't good yet"* and *"you aren't good at this."* Between a parent and a child those two collapse into each other very easily. Say the distinction out loud.

**Fails by:** rescuing. When there's one learner and you love them, the pull to fix their work is enormous. Every rescue teaches that struggle means stop.

---

## 4. Manage Activities

Organise tasks, schedules, checkpoints, and resources — *with* the learner, increasingly *by* the learner.

**Strong looks like:** a visible calendar with real checkpoints they track; project management tools they own; realistic pacing with slack in it.

**One learner:** this stops being crowd control and becomes executive-function scaffolding. The [project wall](10-strategies/project-wall.md) and the management log are doing double duty — they're the project's structure *and* they're the skill you're teaching. Hand them over progressively; that handover **is** the self-directed learning outcome.

**Fails by:** holding the schedule in your own head. If the plan lives only with you, the learner is a passenger and cannot develop self-management.

---

## 5. Scaffold Learning

Provide the supports this learner needs to reach goals they couldn't reach alone — and remove them as they become unnecessary.

**Strong looks like:** scaffolds responding to their actual questions rather than a preset sequence; the target success skill explicitly taught, practised, and reflected on; every scaffold has a plan for coming off.

**One learner:** the precision available here is the single biggest advantage of one-on-one PBL. You can scaffold exactly the gap, on the day it appears.

And the mirror-image trap: scaffolds accumulate and never fade, because nobody else is watching and it's easier for both of you. This is why `fade_plan` is a required field in the schema, and why a support that should never come off belongs in the profile's `needs.accommodations` instead — both are legitimate, conflating them is how a learner arrives at fifteen unable to begin anything without a checklist someone else wrote.

**Fails by:** front-loading every support before it's needed, which removes the productive struggle that makes learning stick.

→ [scaffolds.yaml](../framework/scaffolds.yaml)

---

## 6. Assess Learning

Use formative and summative assessment of both content and the one targeted success skill, including self-assessment.

**Strong looks like:** multiple sources of evidence, not just the final product; formative assessment that changes what you do next; the learner self-assessing against the rubric *before* you speak; the success skill assessed separately from the content.

**One learner:** individual accountability — the hardest assessment problem in classroom PBL — is free here. What replaces it is **objectivity**, because you're assessing someone you love whose effort you watched. Anchor hard to written criteria that existed before the draft. Get at least one outside voice on the final product. Self-assessment carries more weight in this setting, so teach it deliberately.

**Fails by:** assessing effort and growth instead of the work, because you saw the effort. Both matter — record them separately.

→ [Assessment](09-assessment.md)

---

## 7. Engage & Coach

Work alongside the learner, and read when they need skill-building, redirection, encouragement, or celebration.

**Strong looks like:** your knowledge of this learner driving real decisions; goals and criteria co-defined; their questions steering the inquiry; high expectations, stated and held; regular formal reflection — yours as well as theirs.

**One learner:** you have the deepest possible knowledge of the learner, which makes coaching easy and boundaries hard. The move that matters is **naming which hat you're wearing**: *"For the next twenty minutes I'm your critic, not your parent."* Say it explicitly, and come out of role just as explicitly. It gives both of you permission to be rigorous without it being personal.

**Fails by:** lowering the bar out of affection, or raising it out of anxiety. Both are about you rather than the work.

---

## The two failure modes to watch in yourself

Everything above reduces to two pulls, and they're opposites.

**Rescuing.** You see them stuck, you know the answer, it would take ten seconds. Every time you do it you take the learning. The [stuck ladder](../framework/scaffolds.yaml) exists so that being stuck has a procedure and you have something to point at instead of solving it.

**Pushing.** The project is yours as much as theirs and you want it to succeed. So you carry it through week three on your own enthusiasm. That's why the plan schema has `support_plan.when_to_stop` — decide the tripwire while you're calm, because week-three you will want to push.

Both are versions of the same thing: the project mattering to you more than to them. Which is worth noticing rather than being ashamed of — it's the natural condition of teaching one person you're invested in.

---

**Next:** [The Project Path](05-project-path.md) →

---

*Framework by PBLWorks / Buck Institute for Education. All text, including the one-learner translations, is original — see [NOTICE.md](../NOTICE.md).*
