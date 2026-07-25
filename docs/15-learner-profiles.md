# Writing a Learner Profile

The profile is the input to everything. A project designed from a vague profile is a generic project with a child's name on it — which is the specific failure this repo exists to prevent.

Schema: [`schema/learner-profile.schema.json`](../schema/learner-profile.schema.json) · Template: [`templates/learner-profile.md`](../templates/learner-profile.md)

```bash
pbl profile new "Sam"
pbl profile check learners/sam/learner-profile.md
```

---

## The field that matters most

**`interests`.** Two minimum, and they have to be specific.

`pbl profile check` rejects generic ones outright — not to be difficult, but because "sports" cannot produce a project and no amount of good design downstream recovers from it.

| Rejected | Works |
|---|---|
| animals | rewatches the same shark documentary on a loop and corrects it |
| sports | argues about transfers with his uncle for an hour at a time |
| reading | reads the same three books about volcanoes over and over |
| building | takes apart broken appliances to see what's inside |
| art | redraws the same character until the hands are right |
| games | designs levels for other people and watches them play |

Write what you'd see if you walked in unannounced.

### Look for the shape, not the topic

This is the part that produces genuinely good projects.

Two learners both "love animals." One loves *caring* for them; the other loves *classifying* and knowing everything. Those need completely different projects — a rescue-and-welfare investigation versus a field guide and a survey. The topic is identical and the shape is opposite.

So ask: what is the interest actually *about*?

- **Control and consequence** — digging channels, redirecting water, modding games
- **Collecting and completing** — lists, catalogues, knowing all of something
- **Taking apart** — mechanisms, how does this work
- **Making it right** — redoing until it matches
- **Arguing** — positions, fairness, who's right
- **Caring for** — plants, animals, younger children
- **Making people feel something** — stories, jokes, performance

The shape tells you the product type. The topic just tells you the subject.

---

## `strengths` — behaviours, not traits

Rejected: smart, bright, creative, hard worker, good student, curious, motivated.

None of those tell you what to build on. These do:

- "will redo a drawing four or five times until it matches what she saw"
- "notices when an argument contradicts itself"
- "explains things to her younger brother without getting frustrated"
- "remembers every detail of a conversation from three weeks ago"

The test: could you design a project around it? "Smart" — no. "Redoes things until they're right" — yes, that's a revision-heavy product with a high quality bar.

---

## `needs` — functional, never diagnostic

Describe what happens, and what helps. Not what it's called.

| Write this | Not this |
|---|---|
| loses the thread on multi-step directions | a diagnostic label |
| needs a written checklist to start | an IEP reference |
| reads roughly two years below grade level | an assessment score |
| frustration ends the session, not just the task | a clinical term |

Two reasons, and the second is the more important:

**1. The functional description is what selects scaffolds.** A label doesn't map to anything in [`scaffolds.yaml`](../framework/scaffolds.yaml). "Task initiation" does.

**2. Clinical information about a child doesn't belong in a file that might get synced, backed up, or shared.** The child has no say in that and can't undo it later. `pbl profile check` warns if it detects a diagnosis, an IEP reference, medication, or a test score.

**Every tag you list needs a scaffold in the plan.** So list what actually blocks *this* project, not everything true about the learner. Six scaffolds running at once is more than anyone can hold. If there's genuinely nothing to note, write `needs: { none: true }` — that says "nothing here," where an empty section says "not filled in yet."

---

## The one success skill

One. With one to three named dimensions.

**Choose from something you observed**, not from a general worry:

> "Asked why the mud collects at the bottom of the driveway, she said 'because it's the bottom' and was satisfied. When I asked what brought it there she looked surprised there was more to say."

That points straight at `critical-thinking / explanation-and-analysis`. A general worry — "she doesn't think deeply" — points nowhere.

Then check that the project you're planning creates the conditions for that skill. Each skill file lists what it needs. → [Success skills](08-success-skills.md)

**Not collaboration**, unless there's a genuine second party who can disagree with the learner. → [why](08-success-skills.md#collaboration)

---

## Preferences

**`product_modes`** — ways of *making* they're drawn to. Deliberately about the act, not the artifact: a learner who likes `build-physical` takes to a model or a prototype regardless of subject. These filter the product menu.

**`choice_appetite`** — how much open choice helps versus paralyses. `low` doesn't mean no choice; it means a short menu that widens.

**`audience_comfort`** — `low` means the plan needs a comfort ramp. It never means dropping the public audience.

**`dislikes`** — worth filling in. "Hates writing by hand" changes the product choice more than most strengths do.

---

## `goals_from_adult`

Write it in your own words, honestly. This is frequently the most useful field in the file, because the real goal is often not academic:

> "I want him to finish something he's proud of. He starts a lot and finishes almost nothing."

> "She has decided she's bad at reading. I'd like her to have one experience where being a slow reader didn't stop her being the person in the room who knew the most about something."

Those change the design. A stated content goal usually doesn't.

---

## The three prose sections

Not schema-validated, and where the useful detail lands.

**What Lights Them Up.** When have you seen them fully absorbed? What were they doing, how long did it last? What do they choose when nobody assigns anything?

**What Gets Hard.** Where does it actually fall apart — starting, the middle, or finishing? Is it when it's boring or when it's hard? What does giving up look like, and what happened just before?

And the question that shapes the plan most: **what do they do when they don't know what to do?** That answer determines the stuck protocol.

**What We've Already Tried.** What worked, what didn't, and *why you think so*. This is the most valuable content in the file and the thing no outside reader could guess. Include what you've ruled out, so nobody suggests it again.

---

## Privacy

`learners/` is gitignored. Keep it that way.

- First name or pseudonym. `pbl profile check` warns on what looks like a full name.
- No diagnoses, IEP contents, medication, or scores.
- Don't name the school, the town, or the specific organisation if you might ever share the plan.
- If you contribute a project to [`examples/`](../examples/), share the plan and de-identify it first. → [learners/README.md](../learners/README.md)

---

## Keep it current

A profile is a snapshot, and a year-old reading level is fiction.

Update it after every project — this is the step almost nobody does and it's what makes the next project better:

- `pbl_experience` moves
- `success_skill_target.current_level` — did the dimension move? Evidence?
- `standards_targets[].status` — which are secure now?
- `audience_comfort` and `choice_appetite` — often shift after a real audience
- **`interests`** — new ones surface during projects. They're the next project's topic.
- `needs` — which scaffolds faded successfully?

An updated profile is the second deliverable of a finished project.

---

## Thin profiles

Sometimes you can't be specific — a new tutoring client, a learner you've just started with.

Proceed with what you have, and **say in the plan that the profile is thin.** Design the first project conservatively: shorter, narrower choice, a product type that's hard to get badly wrong. Treat it as diagnostic. Then rewrite the profile from what you learned, and the second project will be much better.

What you must not do is invent the detail. A confident-looking profile full of guesses produces a project confidently aimed at nobody.

---

## Checklist

- [ ] Two or more **specific** interests, and you know the *shape* of at least one
- [ ] One or more **observable** strengths
- [ ] One success skill, 1–3 dimensions, chosen from something you watched
- [ ] Real standards codes (`pbl standards search`) or an honest `TBD`
- [ ] Needs described functionally — no labels, no scores
- [ ] `goals_from_adult` written honestly, including the non-academic goal
- [ ] The three prose sections actually written
- [ ] First name or pseudonym only
- [ ] `pbl profile check` passes

---

**Next:** [Standards](16-standards.md) →

---

*Original to PBL Builder. See [NOTICE.md](../NOTICE.md).*
