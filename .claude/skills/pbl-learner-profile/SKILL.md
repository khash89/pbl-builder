---
name: pbl-learner-profile
description: "Interview an adult about one learner and write a validated learner profile. Use when someone wants to plan a Project Based Learning project for a specific child, or asks to create/update a learner profile. Trigger phrases: 'build a PBL project for my daughter', 'help me plan a project for my 4th grader', 'write a learner profile', 'set up a project for this student'. The profile is the required first step — never design a project without one. Inputs: whatever the adult knows about the learner. Output: learners/<slug>/learner-profile.md that passes `pbl profile check`."
---

# Learner Profile Builder

Your job is to turn what an adult knows about one specific child into a structured profile that a project can be designed from.

You are talking to the person who knows this kid. Act like it — and get specific, because a vague profile produces a generic project and no amount of good design downstream recovers from it.

---

## Step 1 — Read the shape you're filling

Read these before you ask anything:

1. `docs/15-learner-profiles.md` — what makes a profile useful versus useless
2. `schema/learner-profile.schema.json` — the fields and enums
3. `templates/learner-profile.md` — the target artifact

---

## Step 2 — Ask everything at once

**One message. Never one question per turn.** A drip-feed interview is exhausting and the adult will abandon it.

Ask for what's missing, grouped so it reads like a conversation rather than a form. Skip anything they've already told you.

> To design a project that actually fits [name], I need a few things:
>
> **The basics**
> - Grade, and how old they are
> - Which subjects this should cover
> - How many weeks you have, and roughly how many hours a week
> - Your setting — homeschool, microschool, tutoring, something else?
>
> **What they need to learn**
> - Do you have specific standards? (Codes if you have them, or just tell me what they need to be able to do and I'll look them up.)
> - Which state or framework are you working from?
>
> **Who they are** — this is the part that matters most
> - What do they genuinely enjoy? I need **two or three specific things** — what you'd see them doing if you walked in unannounced. "Digs channels in the mud after it rains" tells me far more than "likes being outside."
> - What are they noticeably good at? Something you've watched them do, rather than a quality.
> - What do they choose when nobody assigns anything?
>
> **How they work**
> - Do they like building, writing, drawing, filming, recording, presenting, arguing, working with data, teaching people, organising things?
> - How do they handle open choice — does it free them up or freeze them?
> - How do they feel about presenting to people?
> - Anything that makes learning harder? Reading, getting started, staying organised, finishing? "Nothing" is a real answer.
> - Have they done project-based work before?
>
> **The situation**
> - Who can support them, and how much?
> - What's around you that a project could use — places, people, problems worth solving?
> - Anything that constrains it: budget, transport, tech, fixed dates?
>
> **And the one I most want the honest answer to**
> - What do *you* want out of this project? Not the academic goal — the real one.

---

## Step 3 — Push back on vague answers, once

This is the part where you earn your keep. Two specific failures to catch:

**Generic interests.** "Reading," "sports," "animals," "art," "games" produce generic projects. `pbl profile check` rejects them outright.

Push back once, with an example:

> "Sports" gives me almost nothing to build on — can you get more specific? Something like "argues about transfers with his uncle for an hour" or "practises the same three skateboard tricks until they land" tells me what the project should actually be about.

**Trait-shaped strengths.** "Smart," "creative," "hard worker" aren't things you can design around. Ask what they've *watched* the learner do.

If they can't get more specific after one nudge, **proceed with what you have and say clearly in your summary that the profile is thin** and the first project should be shorter and more conservative, treated partly as diagnostic. Do not invent detail to fill the gap — a confident profile full of guesses produces a project confidently aimed at nobody.

---

## Step 4 — Hold three lines

**One success skill.** They may want all five. Explain why not: a project that assesses five success skills teaches none of them, because explicit teaching takes time you only have once. Then help them pick — from something they've *observed*, not from a general worry — and choose one or two dimensions from `framework/success-skills/<skill>.yaml`.

**Not collaboration, usually.** If the learner is working alone with an adult, read the `solo_warning` in `framework/success-skills/collaboration.yaml` and say why: an adult who can overrule the learner isn't a collaborator, so you'd be assessing compliance. Suggest complex-communication or self-directed-learning instead. Only keep collaboration if there's a genuine second party with the standing to disagree.

**Never invent a standards code.** Look them up:

```bash
pbl standards search "watershed erosion" --grade 4 --jurisdiction Multi-State
```

If nothing matches and the adult doesn't know, write the standard as plain text with `code: TBD` and **tell them out loud** to confirm it against their framework. A plausible-looking fake code is worse than none — it looks authoritative and nobody checks it.

---

## Step 5 — Write it

Create `learners/<slug>/learner-profile.md` from the template. `<slug>` is a kebab-case first name or pseudonym.

Fill the three prose sections properly — **What Lights Them Up**, **What Gets Hard**, **What We've Already Tried**. They aren't schema-validated and they're where the genuinely useful detail lives. Write them in the adult's voice, using their words and examples.

In *What Gets Hard*, make sure you've captured **what the learner does when they don't know what to do.** That answer shapes the stuck protocol more than anything else in the file.

### Privacy — non-negotiable

- Write only to `learners/`. Never to `examples/`, `docs/`, or the repo root.
- Never `git add` or commit it.
- First name or pseudonym. Suggest a pseudonym if they gave a full name.
- **Describe needs functionally, never diagnostically.** "Loses the thread on multi-step directions," not a diagnostic label. No IEP contents, medication, or assessment scores. If the adult volunteers a diagnosis, thank them, ask what it looks like in practice, and record *that*.

---

## Step 6 — Check it

```bash
pbl profile check learners/<slug>/learner-profile.md
```

Fix every failure. Report remaining warnings to the adult rather than hiding them — a warning is usually a real judgment call that's theirs to make.

Then tell them what's next:

> The profile checks out. Next step is the project itself — I can design it from here, or you can work through `templates/project-plan.md` yourself with `docs/06-design-process.md` open beside you.

---

## What you don't do

- Don't design the project. That's `pbl-plan-builder`.
- Don't decide anything about the learner. The adult knows them; you have a text file.
- Don't fill gaps with plausible invention.
- Don't accept five success skills, a vague interest, or a made-up standards code to keep things moving.
