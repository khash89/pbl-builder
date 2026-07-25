---
# ═══════════════════════════════════════════════════════════════════
# LEARNER PROFILE
#
# This is the input to everything else. The project gets designed
# outward from this file, so specificity here pays off enormously
# later. Vague answers produce a generic project.
#
# Replace every [bracketed] placeholder. Delete what genuinely
# doesn't apply. Check your work with:
#     pbl profile check learners/<slug>/learner-profile.md
#
# Schema: ../schema/learner-profile.schema.json
# How to fill this in well: ../docs/15-learner-profiles.md
#
# PRIVACY: use a first name or pseudonym. This file stays in
# learners/, which is gitignored. Don't put diagnoses, IEP contents,
# or assessment scores in it — see the `needs` section.
# ═══════════════════════════════════════════════════════════════════
schema_version: 1
status: draft
updated: "[YYYY-MM-DD]"

learner:
  name: "[First name or pseudonym]"
  pronouns: "[she/her, he/him, they/them — omit this line if you'd rather not]"
  age: [age]
  grade: "[pre-k | k | 1 ... 12]"

# Which standards set applies. "Multi-State" covers Common Core, NGSS,
# C3, and WIDA and is right for most people. Otherwise a US state name,
# or free text for any other framework.
jurisdiction: Multi-State

subjects:
  - "[e.g. Science]"
  - "[e.g. English Language Arts]"

# ── WHAT THEY NEED TO LEARN ─────────────────────────────────────────
# Find real codes with:  pbl standards search "watershed" --grade 4
# If you can't find a code, set code: TBD and fill in the text. Never
# guess at a code — an invented code that looks real is worse than none.
#
# `status` decides how the project treats it:
#   not-started → the project teaches it directly
#   developing  → the project applies and stretches it
#   secure      → the project leans on it, and doesn't reteach it
standards_targets:
  - framework: "[NGSS | CCSS.MATH | CCSS.ELA-LITERACY | C3 | WIDA | your framework]"
    code: "[e.g. 4-ESS2-1, or TBD]"
    text: "[What the learner must be able to do]"
    status: "[not-started | developing | secure]"
    notes: "[Optional — what makes you say that's the status]"

# ── THE ONE SUCCESS SKILL ───────────────────────────────────────────
# ONE skill. Not two, not five. A project that assesses five success
# skills teaches none of them.
#
# Options: collaboration | critical-thinking | creativity |
#          complex-communication | self-directed-learning
#
# Then name 1-3 dimensions from framework/success-skills/<skill>.yaml.
# One or two is better than three.
#
# Choosing `collaboration` for a solo learner? Read the solo_warning in
# framework/success-skills/collaboration.yaml first. It usually isn't
# assessable alone.
success_skill_target:
  skill: "[one of the five]"
  dimensions:
    - "[dimension id from the skill's yaml file]"
  current_level: "[beginning | emerging | developing | demonstrating]"
  evidence: "[What you've actually seen that puts them at that level]"

# ── WHO THEY ARE ────────────────────────────────────────────────────
# At least TWO specific interests. This is the field that most
# determines whether the project lands.
#
# "Reading" is not an interest. "Sports" is not an interest. Write what
# you would actually see them doing if you walked in unannounced:
#   ✓ "takes apart broken appliances to see what's inside"
#   ✓ "rewatches the same three nature documentaries"
#   ✓ "argues about football transfers with his uncle for hours"
#   ✗ "likes animals"   ✗ "creative"   ✗ "enjoys learning"
interests:
  - "[Something specific they actually do]"
  - "[Another one]"

# Observable behaviours, not traits. "Smart" and "good student" get
# rejected — they don't tell you what to build on.
#   ✓ "will redo a drawing five times to get it right"
#   ✓ "notices when an argument contradicts itself"
#   ✗ "bright"   ✗ "hard worker"
strengths:
  - "[Something you've watched them do]"

# ── HOW THEY WORK ───────────────────────────────────────────────────
preferences:
  # Ways of MAKING they're drawn to. Used to filter the product menu.
  # Options: build-physical | write | draw-or-design | film-or-photograph |
  #   record-audio | perform-or-present | code-or-data | organize-an-event |
  #   teach-others | persuade-or-argue | map-or-diagram
  product_modes:
    - "[e.g. build-physical]"

  work_mode: "[solo | with-a-partner | with-an-adult | small-group]"

  # How much open choice helps vs. paralyses. `low` does NOT mean no
  # choice — it means a short menu that widens as they find their feet.
  choice_appetite: "[low | medium | high]"

  # Comfort presenting to people. `low` means the plan builds a comfort
  # ramp. It never means dropping the public audience.
  audience_comfort: "[low | medium | high]"

  # Worth filling in. "Hates writing by hand" changes the product choice
  # more than most strengths do.
  dislikes:
    - "[Optional]"

# ── WHAT HELPS THEM LEARN ───────────────────────────────────────────
# FUNCTIONAL descriptions only. What happens, and what helps — never a
# diagnosis, IEP contents, medication, or a test score. The functional
# description is what actually selects scaffolds; a label doesn't, and
# it carries risk in a file that might get synced or backed up.
#
# Every tag you list here must get at least one scaffold in the plan.
# So list what's real, not everything imaginable.
#
# Tags: task-initiation | planning-and-sequencing | time-management |
#   working-memory | task-switching | sustained-attention |
#   organization-of-materials | reading-comprehension | reading-fluency |
#   written-expression | academic-vocabulary |
#   english-language-development | oral-expression |
#   listening-comprehension | math-fluency | frustration-tolerance |
#   perfectionism | anxiety-with-ambiguity | social-interaction
#
# Nothing to note? Delete the sub-fields and use:  needs: { none: true }
needs:
  reading_level: "[e.g. about two years below grade level | at grade level]"
  executive_function:
    - "[tag]"
  language_supports:
    - "[tag]"
  accommodations:
    - "[Free text — what's already in place, e.g. text-to-speech for long texts]"
  sensory_or_physical:
    - "[Anything affecting venues or field trips]"

# How much project work they've done. Sets scaffold density and how fast
# choice widens. `none` plus `low` choice appetite means a tightly
# structured first project — which is the right call, not a failure.
pbl_experience: "[none | some | experienced]"

# ── THE SITUATION ───────────────────────────────────────────────────
context:
  setting: "[homeschool | microschool | tutoring | classroom-pullout | after-school | other]"
  adults_available: "[Who can help, and realistically how much]"
  weekly_hours: [number]

  # Where authenticity comes from. Be concrete — this is what the
  # project can draw on and give back to.
  community: "[e.g. small farm town, creek behind the property, active watershed council]"

  resources:
    - "[What's actually available — tools, spaces, people, transport]"

constraints:
  total_weeks: [number]        # under 3 is very hard to do well
  budget: "[e.g. under $50, or omit]"
  travel_ok: [true | false]
  tech_available:
    - "[Devices, software, connectivity — constrains products more than people expect]"
  hard_dates:
    - "[Fixed dates to plan around — a showcase, a council meeting, a trip]"

# ── WHAT YOU WANT ───────────────────────────────────────────────────
# In your own words. Often the most useful field in the file, because
# the real goal is frequently not academic.
#   e.g. "I want him to finish something he's proud of. He starts a lot
#         and finishes almost nothing."
goals_from_adult: "[What you want out of this project]"
---

# Learner Profile: [Name]

The three sections below aren't validated by the schema, and they're where the
genuinely useful detail tends to end up. Write them as notes to yourself. If you
hand this to an AI assistant, it will read them.

## What Lights Them Up

[When have you seen them fully absorbed in something? What were they doing, and
how long did it last? What do they talk about without being asked? What did they
choose to do the last time nobody assigned them anything?

Be specific about the *shape* of the interest, not just the topic. A learner who
loves animals because they like caring for things needs a different project from
one who loves animals because they like classifying and knowing everything.]

## What Gets Hard

[Where do things actually fall apart? Not "he struggles with focus" — what does
the moment look like? Is it starting, or the middle, or finishing? Is it when
it's boring or when it's hard? What does giving up look like, and what has
happened just before it?

Also: what do they do when they don't know what to do? That answer shapes the
stuck protocol more than anything else in this file.]

## What We've Already Tried

[What's worked before, and what hasn't. If a previous project or unit went badly,
say why you think so — it's the most valuable information here and the thing an
outside reader can't guess.

Include anything you've already ruled out, so nobody suggests it again.]

---

<!--
Next steps:

  pbl profile check learners/<slug>/learner-profile.md   # is it usable?
  pbl plan new --profile learners/<slug>/learner-profile.md

Or hand this file to an AI assistant with the repo open and ask it to design
the project. See ../CLAUDE.md.
-->
