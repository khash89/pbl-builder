---
name: pbl-plan-builder
description: "Design a complete Gold Standard Project Based Learning project for one specific learner, from an existing learner profile. Use when a learner profile exists and someone wants the project designed, or asks to build/draft a PBL project plan. Trigger phrases: 'design the project', 'build the plan from this profile', 'now make the project for her', 'draft a PBL project plan'. Requires a learner profile that passes `pbl profile check` — if none exists, use pbl-learner-profile first. Output: a project-plan.md that passes `pbl validate` and `pbl review` with zero failures."
---

# Project Plan Builder

Design one project, for one learner, from their profile. The profile is the input; every part of the plan should be traceable back to it.

**If there is no learner profile, stop and build one first** (`pbl-learner-profile`). A plan with no profile behind it is the exact failure this repo exists to prevent — a generic project with a child's name pasted on.

---

## Read first

1. `learners/<slug>/learner-profile.md` — the whole thing, including the prose sections
2. `framework/manifest.yaml` — the index and the design sequence
3. `docs/06-design-process.md` — the sequence you're following
4. `docs/11-solo-and-small-group-pbl.md` — what changes without a class
5. `templates/project-plan.md` — the target artifact

Then, as you need them: `framework/product-types.yaml`, `framework/scaffolds.yaml`, `framework/project-path.yaml`, the relevant `framework/success-skills/<skill>.yaml`, and individual `docs/10-strategies/*.md` files (use `framework/strategies.yaml` to find the right one).

**Shortcut worth taking:** run `pbl plan new --profile <path>` first. It scaffolds the plan pre-filled with everything mechanically derivable — grade, subjects, standards verbatim, the success skill and dimensions, choice calibration — plus a product menu already filtered to this learner's modes and suggested scaffolds for each of their needs. Then you're editing rather than transcribing.

---

## Phase 1 — The three foundations. Then stop.

Draft these three and **get confirmation before you map a single milestone.** Everything downstream depends on them, and redoing a six-week calendar because the driving question turned out to be closed wastes an afternoon of the adult's time.

### A. Learning goals

- Standards, copied from the profile. Never re-typed, never invented.
- One or two `understandings` — what should survive a year, in plain words.
- The one success skill and its named dimensions, matching the profile exactly.
- **`taught_how`** — how the skill gets *taught*, not just assessed. This is the most-skipped field and skipping it is why success skills don't grow. Name one routine, used repeatedly, handed over to the learner by the end.

### B. Driving question

Open-ended, in *this learner's* language, answerable only by learning the standards.

Test it before you show it:
- Could you google the answer? → research prompt, not a driving question
- Does it name a topic rather than pose a problem? → reframe toward a decision or a design
- Could they answer it decently without learning any of the standards? → the standards are decoration

Read `docs/07-driving-questions.md` if it isn't landing. Use the learner's actual interest in the question — you know precisely what it is.

### C. Product and audience

Filter `framework/product-types.yaml` by the learner's `product_modes`, `audience_comfort`, and real constraints down to **two to four options**, then present the menu and let the adult and learner choose. Choosing for them defeats the point.

Name the audience specifically. "The community" is not an audience; "the watershed council's monthly meeting" is. If you can't name who'll be in the room, you don't have one yet.

### Check the alignment, then present

```
        LEARNING GOALS
         ↗          ↖
DRIVING QUESTION ←→ PUBLIC PRODUCT
```

Show all three, say why each fits this learner, and ask for confirmation. **Do not proceed until you have it.**

---

## Phase 2 — Let the profile actually drive the design

Each of these is a `pbl review` check, so cutting corners here fails.

| From the profile | Must appear in the plan |
|---|---|
| `interests` | `authenticity.personal_connection` **names a specific interest.** Not "connects to their interests" — name it. Also drives the topic and the entry event. |
| `preferences.product_modes` | The chosen product's `modes` must overlap. Write `why_this_learner` for it — if you can't, you picked off a list rather than for a person. |
| `audience_comfort: low` | A `comfort_ramp` of 2+ steps: trusted adult → small friendly group → real audience. **Never drop the audience.** |
| `needs` (each populated tag) | At least one scaffold addressing it, from `framework/scaffolds.yaml`. |
| every scaffold | A `fade_plan` — a **trigger**, not a date. "Once she drafts two sections without a frame" beats "week 4". |
| `choice_appetite` | `voice_and_choice.calibrated_for` must match. If low, add `widens_when` — choice should grow. |
| `standards_targets[].status` | `not-started` → direct instruction milestones. `developing` → application and critique. `secure` → **leverage, don't reteach.** |
| `pbl_experience: none` | Denser scaffolding, narrower early choices, and expect the first project to take longer. |
| `context.community` | Where authenticity and the audience come from. Be concrete. |
| `constraints` | The product must be buildable with the actual time, budget, tech, and transport. |

**The test to apply to your own draft:** if you deleted the learner's name, what would still be specifically about them? If the answer is "the topic," you haven't finished.

---

## Phase 3 — Map the four phases

All four, always: `launch`, `build_knowledge`, `develop_and_critique`, `present`. Even in two weeks.

Every milestone needs a name, **at least one need-to-know question written as the learner's question** (not your objective), and at least one learning experience.

Across the whole path, all of these must hold (`framework/project-path.yaml` invariants):

- [ ] At least one **critique cycle before `present`**, with revision scheduled separately
- [ ] At least **two reflection points, in two different phases**
- [ ] **Formative assessment in both middle phases**, each with a `responds_how`
- [ ] Content is not front-loaded — instruction answers live questions

### Solo-context requirements

- **`support_plan.critique_partners` must name real people.** There's no class. A sibling, a grandparent, a co-op, an online group, an expert, or the adult deliberately in a critic's role. Unnamed partners mean no critique.
- **`support_plan.stuck_protocol`** — the ordered steps, before it's a crisis. "Help them" is not a protocol. A week-three stall is the most common way a solo project dies.
- **`support_plan.when_to_stop`** — the tripwire, decided while everyone's calm.

---

## Phase 4 — Check your own work

```bash
pbl validate learners/<slug>/project-plan.md
pbl review learners/<slug>/project-plan.md
```

**Fix every `fail`.** Then **report the remaining `warn`s to the adult** — don't swallow them and don't imply the plan is cleaner than it is. Most warnings are genuine judgment calls that belong to the adult.

Write the body sections properly, especially **"Why This Project For This Learner."** Not what the project is — why it's right for this person. Name the interest connection, explain the product choice, say which difficulty you're designing around and how, and name **one thing you made hard on purpose.** That last one matters: a plan with nothing hard in it has used knowledge of the learner to lower the ceiling.

---

## Then hand it over

Tell them what you'd watch for:

> Here's the plan. Two things I'd keep an eye on: [the specific week you expect to stall, and why], and [the scaffold most likely to never come off].
>
> Handouts you might want are in `templates/student/`. Before you launch, it's worth ten minutes on `rubrics/project-design-rubric.md` — it covers the judgments the checker can't make.

---

## What you don't do

- **Don't design before the profile exists.** Ever.
- **Don't proceed past the three foundations without confirmation.**
- **Don't invent standards codes.** `pbl standards search`, or `TBD` and say so.
- **Don't drop the public audience** for an anxious learner. Build the ramp.
- **Don't target collaboration** for a solo learner — see `framework/success-skills/collaboration.yaml`.
- **Don't write scaffolds without fade plans.**
- **Don't choose the product.** Build the menu, then step back.
- **Don't write learner data outside `learners/`,** and never commit it.
- **Don't overrule the adult.** They know this child. Say your concern once, clearly, then do what they asked.
