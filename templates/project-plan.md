---
# ═══════════════════════════════════════════════════════════════════
# PROJECT PLAN
#
# One project, designed for one learner. Every section should be
# traceable back to the learner profile — that's what `pbl review`
# checks.
#
# Work top to bottom. Get the three foundations right before you touch
# the project path: learning_goals, driving_question, and
# products + public_audience. Everything downstream depends on them,
# and redoing a six-week calendar because the driving question was
# wrong is a bad afternoon.
#
#     pbl validate <this file>    # is it well-formed?
#     pbl review   <this file>    # is it any good?
#
# Schema: ../schema/project-plan.schema.json
# Process: ../docs/06-design-process.md
# ═══════════════════════════════════════════════════════════════════
schema_version: 1
title: "[A name the learner would say out loud — 'The Creek Project', not 'Grade 4 Watershed Unit']"
slug: "[kebab-case, matches this folder's name]"
status: draft            # draft | reviewed | in-progress | completed | abandoned
updated: "[YYYY-MM-DD]"

# REQUIRED. The profile this was designed from. `pbl review` follows this
# path to check the project actually reflects the learner.
learner_profile: ./learner-profile.md

grade: "[from the profile]"
subjects:
  - "[from the profile]"

duration:
  weeks: [number]
  hours_per_week: [number]

# ── FOUNDATION 1 OF 3: THE DRIVING QUESTION ─────────────────────────
# Open-ended, in language THIS learner would use, and answerable only by
# learning the target standards.
#
# Test it: could you google the answer? Then it's a research prompt, not
# a driving question. Does it name a topic rather than pose a problem?
# Same problem.
#
#   ✓ "How can we keep the rain that falls on our yard from hurting the creek?"
#   ✓ "What should our town do with the empty lot on Main Street?"
#   ✗ "What are the parts of a watershed?"
#   ✗ "Learning about local government"
#
# See ../docs/07-driving-questions.md
driving_question: "[Your question]"

# ── FOUNDATION 2 OF 3: LEARNING GOALS ───────────────────────────────
learning_goals:
  standards:
    - framework: "[from the profile]"
      code: "[real code, or TBD]"
      text: "[what they must be able to do]"
      jurisdiction: "[from the profile]"
      # If you can't name what provides evidence for this standard, the
      # standard isn't really in the project.
      assessed_by: "[which product or assessment shows this]"

  # What you want them to still understand in a year. Bigger than any
  # single standard, in your own words.
  understandings:
    - "[e.g. Water goes somewhere, and where it goes is a choice someone made]"

  # ONE skill, with only the dimensions you're actually teaching.
  # Everything else on that rubric is explicitly out of scope.
  success_skill:
    skill: "[from the profile — must match]"
    dimensions:
      - "[from the profile — must match]"
    target_level: "[beginning | emerging | developing | demonstrating]"
    # The field people skip. Skipping it is why success skills don't grow:
    # the skill has to be TAUGHT, not just assessed.
    taught_how: "[How you will explicitly teach this skill — a lesson, a protocol, a practised routine]"

# ── AUTHENTICITY ────────────────────────────────────────────────────
# Four routes in. Any ONE is enough; more is better.
authenticity:
  # Whose actual job does this resemble?
  context: "[The real-world situation this mirrors]"

  # The actual tools, methods, and quality standards from that world.
  real_world_processes:
    - "[e.g. marked stakes and repeat measurement at the same points]"

  # What could genuinely change because this work exists.
  # "Nothing, but this is honestly how the work is done" is a REAL answer —
  # write that rather than inventing impact. Invented stakes are transparent
  # to learners and corrosive.
  impact: "[What could actually change, honestly]"

  # MUST name a specific interest from the learner profile.
  # `pbl review` check 9 fails "connects to student interests" — name the
  # interest. This is the check that catches a generic project with a
  # child's name attached.
  personal_connection: "[Name the actual interest from the profile]"

# ── FOUNDATION 3 OF 3: PRODUCT & AUDIENCE ───────────────────────────
# Build the menu from framework/product-types.yaml filtered by the
# learner's product_modes, then let THEM choose. Choosing for them
# defeats the purpose.
products:
  primary:
    name: "[What they'll call it]"
    type: "[product type id from framework/product-types.yaml]"
    description: "[What it actually is]"
    criteria:                    # derive these from the standards, not from neatness
      - "[What makes it good]"
      - "[Another criterion]"
    # If you can't answer this, you picked a product off a list rather
    # than for a person.
    why_this_learner: "[Why THIS product for THIS learner]"
    made_public_how: "[How it reaches the audience]"

  # Optional. In a solo context, one strong product usually beats two thin ones.
  # secondary:
  #   name: ...

public_audience:
  # Real people beyond the household or tutoring pair. Name them.
  # "The community" is not an audience. "The watershed council's monthly
  # meeting" is.
  who: "[Who specifically]"
  format: "[How the work reaches them]"
  date: "[Target date — set it early, it's what makes the deadline real]"

  # REQUIRED if the profile says audience_comfort: low.
  # Graduated rehearsal audiences. This is the alternative to dropping
  # the public product — never do that.
  comfort_ramp:
    - "[e.g. read it aloud to grandma]"
    - "[e.g. present to two neighbours in the kitchen]"
    - "[e.g. the real audience]"

  backup_plan: "[What happens if the audience falls through. Sometimes it does.]"

# ── VOICE & CHOICE ──────────────────────────────────────────────────
# Real decisions, the kind an adult professional makes. Picking a font
# colour is not voice and choice.
voice_and_choice:
  content:
    - "[What they get to decide about what to investigate]"
  process:
    - "[What they get to decide about how to work]"
  product:
    - "[What they get to decide about what to make / for whom]"

  # Must match the profile's preferences.choice_appetite.
  calibrated_for: "[low | medium | high]"

  # For a low-appetite learner: what has to happen before you offer more.
  # Choice should grow during the project, not stay fixed.
  widens_when: "[e.g. once she's chosen a focus animal and stuck with it for a week]"

# ── THE LAUNCH ──────────────────────────────────────────────────────
entry_event:
  # Something seen, done, or visited — not a topic announcement. If the
  # learner's first experience is you explaining the assignment, this
  # isn't an entry event.
  description: "[What actually happens on day one]"

  # Questions you expect them to raise. If your list doesn't overlap the
  # standards, the entry event is pointing the wrong way.
  anticipated_ntk:
    - "[A question you expect]"
    - "[Another]"

# ── THE PROJECT PATH ────────────────────────────────────────────────
# All four phases, always — even in a two-week project.
# Every milestone needs at least one need-to-know question and at least
# one learning experience.
#
# Non-negotiables (see framework/project-path.yaml invariants):
#   • at least one critique cycle BEFORE the present phase
#   • at least two reflection points, in at least two different phases
#   • formative assessment in both middle phases
project_path:
  launch:
    - name: "[What gets accomplished]"
      week: "1"
      ntk_questions:
        - "[Written as THEIR question, not your objective]"
      learning_experiences:
        - "[Lesson, activity, visit, research]"
      scaffolds: ["[scaffold id]"]
      formative_assessment: "[Optional here]"
      reflection: "[A prompt or protocol]"
      deliverable: "[What exists at the end of this milestone]"

  build_knowledge:
    - name: "[Milestone]"
      week: "2"
      ntk_questions:
        - "[Their question]"
      learning_experiences:
        - "[What happens]"
      scaffolds: ["[scaffold id]"]
      formative_assessment: "[REQUIRED somewhere in this phase]"
      reflection: "[Optional]"
      deliverable: "[What exists]"

  develop_and_critique:
    - name: "[Milestone]"
      week: "3"
      ntk_questions:
        - "[Their question]"
      learning_experiences:
        - "[What happens]"
      scaffolds: ["[scaffold id]"]
      formative_assessment: "[REQUIRED somewhere in this phase]"
      # REQUIRED somewhere before the present phase. Schedule the
      # revision as its own block of work, not as an afterthought.
      critique: "[Which protocol, with whom, against which criteria]"
      reflection: "[Optional]"
      deliverable: "[What exists]"

  present:
    - name: "[Milestone]"
      week: "4"
      ntk_questions:
        - "[e.g. How do I explain the part I'm least sure about?]"
      learning_experiences:
        - "[Rehearsals, logistics, the event itself]"
      reflection: "[REQUIRED here — this is where the learning consolidates]"
      deliverable: "[Work delivered, feedback collected]"

# ── SCAFFOLDS ───────────────────────────────────────────────────────
# One entry per support. Every populated need in the profile must be
# addressed by at least one scaffold here, and every scaffold must have
# a fade plan.
#
# Pick from framework/scaffolds.yaml, or invent one and give it an id.
# Don't stack more than three or four at once.
scaffolds:
  - id: "[scaffold id]"
    addresses: ["[need tag from the profile]"]
    phase: ["[launch | build_knowledge | develop_and_critique | present]"]
    # REQUIRED. A trigger, not a date: "once she drafts two sections
    # without a frame" beats "week 4".
    #
    # If it genuinely should never come off, it's not a scaffold — move
    # it to the profile's needs.accommodations.
    fade_plan: "[How and when this comes off]"
    notes: "[Optional]"

# ── ASSESSMENT ──────────────────────────────────────────────────────
assessment:
  formative:
    - what: "[What you'll look at]"
      when: "[e.g. end of each work session in week 2]"
      phase: "[which phase]"
      # Formative assessment you don't act on is just record-keeping.
      responds_how: "[What you'll DO with what you find out]"

  summative:
    - what: "[The final product / evidence]"
      criteria_from: "[A rubric path, or the standards themselves]"
      who_assesses: "[You, the learner, a peer, an expert, the audience — or several]"

  # How growth on the ONE skill gets checked, separately from content.
  # Include at least one self-assessment — the skill rubrics are for the
  # learner, not just for you.
  success_skill_checks:
    - "[e.g. self-assessment against the two rubric rows in week 1 and week 6, compared]"

# ── SUPPORT PLAN ────────────────────────────────────────────────────
# This replaces classroom management. It's the section that decides
# whether week three holds together.
support_plan:
  # What you do, and importantly what you don't. "I answer questions
  # with questions until Thursday" is a real role.
  adult_role: "[Your role]"

  check_in_cadence: "[How often, and what happens in the check-in]"

  # REQUIRED. What happens when they stall — the specific escalation,
  # before it becomes a crisis. It always happens; improvising it goes
  # badly. See the stuck-ladder scaffold.
  stuck_protocol: "[The steps, in order]"

  # Who gives critique when there's no class. Name them — critique with
  # nobody to give it simply doesn't happen.
  critique_partners:
    - "[e.g. older sister, the co-op on Fridays, the watershed council contact]"

  # Your own tripwire for reshaping or abandoning the project. Worth
  # deciding now, while you're calm.
  when_to_stop: "[Optional but recommended]"

# ── RESOURCES ───────────────────────────────────────────────────────
resources:
  experts:
    - who: "[Name or role]"
      role: "[What you're asking of them]"
      phase: "[which phase]"
      status: "[idea | contacted | confirmed | declined]"
  field_experiences:
    - "[Where you'll go]"
  materials:
    - "[What you need]"
  # Check these against the learner's reading level.
  texts_and_media:
    - "[Sources they'll use]"
---

# [Project Title]

## Project Summary

[Three or four sentences: what the learner will do, what they'll learn, and what
they'll make for whom. Write it so a grandparent would understand it. If you
can't write this section clearly, the project isn't clear yet — fix the project,
not the paragraph.]

## Why This Project For This Learner

[**The most important section in this file.** Not what the project is — why it's
right for this specific person.

Name the connection to their interests explicitly. Explain why this product
rather than another. Say which of their difficulties you're designing around and
how. Note what you're deliberately making hard, and why they're ready for it.

Six months from now this is the section you'll want, and it's the one nobody
writes.]

## Week-by-Week Plan

[The frontmatter holds milestones by phase; this is the day-to-day. Keep slack
in it — the first project always runs long, and a plan with no give turns every
slip into a failure.

Adjust as you go and mark what changed. A plan that still matches reality in
week five was probably not being used.]

### Week 1 — [Phase]

| Day | What happens | Ready when |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |

### Week 2 — [Phase]

| Day | What happens | Ready when |
|---|---|---|
| 1 | | |

## Notes & Adaptations

[Keep this while the project runs. What you changed and why. What surprised you.
Where they got stuck and what got them moving. What you'd do differently.

If the project gets abandoned, write down why and set `status: abandoned`. That's
a legitimate outcome and the note is worth more than a plan that quietly stops
being mentioned.]

---

<!--
Before you launch:
  pbl validate <this file>
  pbl review   <this file>

Fix every failure. Read the warnings — most are real judgment calls that are
yours to make, not the tool's.

Handouts you might want: ../templates/student/
Self-check the design: ../rubrics/project-design-rubric.md
-->
