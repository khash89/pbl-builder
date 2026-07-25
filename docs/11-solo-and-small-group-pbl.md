# PBL With One Learner

The Gold Standard framework was built for classrooms. Almost all of it transfers. The parts that don't, don't fail gracefully — they fail silently, which is worse.

This is the file to read before your first project.

---

## What gets easier

**Precision.** You can scaffold exactly the gap on the day it appears. A class teacher scaffolds for a distribution; you scaffold for one person whose difficulties you can name.

**Authenticity at community scale.** Thirty learners investigating one driveway is absurd. One learner investigating one driveway is exactly right — and more authentic than any classroom-scale question, because the problem is genuinely theirs.

**Experts.** A professional who would never commit to a school visit will give one kid twenty minutes on a video call. This is the most underused advantage in solo PBL. See [outside experts](10-strategies/outside-experts.md).

**Individual accountability.** The hardest assessment problem in classroom PBL just evaporates.

**Timing.** A class launch happens on the scheduled Monday. You can wait for the rain.

**Co-construction.** Building the rubric with the learner is a facilitation feat in a class. Here it's a twenty-minute conversation, and it's the single biggest available upgrade to a solo project.

---

## What gets harder

### 1. Critique has nobody to come from

**The single biggest structural gap.** There is no class, so there are no peers, so critique doesn't happen unless you make it happen.

Decide before the project starts and write it into `support_plan.critique_partners`. Options that actually work:

| Who | Good for |
|---|---|
| **A grandparent or family friend** | Excellent and underused. Asks genuinely naive questions, which is what tests clarity. Give them the criteria and permission to be confused. |
| **A younger sibling** | Anything that has to be understandable. They will tell you the truth. |
| **A co-op or online group** | The best option if available — actual peers. |
| **An outside expert** | Powerful in the later stages. A learner revises differently knowing a practitioner will look. |
| **You, deliberately in role** | Legitimate, with explicit framing. See below. |

**Wearing the critic hat.** Say it out loud: *"For the next twenty minutes I'm your critic, not your parent. I'm going to be picky about the criteria."* Then be picky. Then come out of role just as explicitly. Naming the role is what makes rigour survivable — without it, criticism of the work reads as criticism of the person, and between a parent and a child those two collapse into each other very easily.

### 2. Momentum has no crowd behind it

A quiet week in a class is absorbed by thirty other people. A quiet week with one learner is the project dying, and it's easy to miss because each individual day looked fine.

**Build Knowledge is where it stalls.** No peer energy, and nobody notices a slow day. This is what `check_in_cadence` is for, and why it matters more in phase 2 than anywhere else.

The tell: the [project wall](10-strategies/project-wall.md) hasn't changed in a week.

### 3. Scaffolds never come off

You can support precisely — and nobody is watching to notice that the support has been in place for two years. It's easier for both of you to keep it.

This is why `fade_plan` is a **required** field in this repo, and why the fade should be a trigger rather than a date. It's also why the distinction matters:

- **Scaffold** — temporary, makes an out-of-reach task reachable, comes off. Goes in the plan.
- **Accommodation** — permanent, levels access, doesn't come off. Goes in the profile's `needs.accommodations`.

Both are legitimate. Conflating them is how a learner arrives at fifteen unable to begin anything without a checklist someone else wrote.

### 4. The risk with choice runs backwards

A class teacher restricts choice because thirty projects are unmanageable. You have no such constraint — so your risk is *too much* open space, handed to a learner who reads ambiguity as threat.

Calibrate to the profile's `choice_appetite`. Low appetite means a short menu that widens, not no choice. → [Facilitating choice](10-strategies/student-choice.md)

**And watch for the fake choice.** With one learner it's very easy to "offer" a choice you've already made and steer until they pick it. They know. It's worse than no choice.

### 5. Objectivity replaces accountability as the assessment problem

You're assessing someone you love, whose effort you watched. → [Assessment](09-assessment.md#objectivity-becomes-the-problem-instead)

### 6. Collaboration usually can't be assessed at all

It's the one success skill that needs a genuine second party with the standing to disagree. An adult who can overrule the learner is not a collaborator. → [Success skills](08-success-skills.md#collaboration)

---

## Translating the classroom strategies

[`framework/strategies.yaml`](../framework/strategies.yaml) tags each strategy with `solo_viability`:

**Work as-is (`direct`):** project wall, learning log, revision, models of quality work, rubrics, student choice, outside experts, interviews, academic vocabulary, audience feedback, post-project reflection.

**Need adapting (`adapted`):** entry event (stronger stimulus needed), need-to-know (more rounds, not more pressure), workshop model (shorter mini-lessons, share needs a real recipient), reflection (in motion, not across a table), thinking routines (some are group-only), presentations (build the ramp).

**Need other people (`needs-others`):** critique protocols. That's the list, and it's the one that matters.

---

## The public product, specifically

This is the element most often quietly abandoned in solo settings, usually with the reasoning that the learner is shy or there's nobody to present to. Both are solvable.

**"Nobody to present to."** One expert is a legitimate public audience. So is a library display, a council meeting's public comment period, a co-op showcase, three neighbours in a kitchen, a letter that gets a reply, a picture book read to actual young children, a walking tour given to two people. The bar is: *real people who are not obliged to be interested.* That bar is much lower than "an auditorium."

**"The learner is too anxious."** Build a ramp: alone → one trusted adult → small friendly group → real audience. Four rungs for a first-timer, one or two by their third project. Fade the ladder, not the audience. → [Presentations](10-strategies/presentations.md)

**Why not just skip it.** Because the audience is what raises the quality bar — not through pressure, but because it's what lets the learner finally imagine a reader. Remove it and revision loses its reason.

---

## Two-to-four learners

Siblings, a microschool pod, a co-op group. Most of the above still applies, with three changes:

- **Critique gets much easier.** Two learners can critique each other, and it's the main reason to consider pairing.
- **Collaboration becomes assessable** — if the work genuinely requires joint thinking rather than splitting into parallel tasks.
- **Don't average the profiles.** Two learners with different needs need different scaffolds on the same project. Write two profiles, share the project, differentiate the supports. The schema supports this: two profiles, two plans, same driving question and product.

This repo doesn't have a first-class multi-learner mode. Running it as parallel plans works fine and is the current recommendation.

---

## The two mistakes you will personally make

Not the learner's mistakes. Yours. Both come from the project mattering to you.

**Rescuing.** They're stuck, you know the answer, it'd take ten seconds. Every time you do it, you take the learning. The [stuck ladder](../framework/scaffolds.yaml) exists so being stuck has a procedure and you have something to point at instead of solving it.

**Pushing.** The project is yours as much as theirs, so you carry it through week three on your own enthusiasm. This is what `support_plan.when_to_stop` is for — write the tripwire while you're calm, because week-three you will want to push.

Worth noticing rather than being ashamed of. It's the natural condition of teaching one person you're invested in.

---

**Next:** [Equity-centered PBL](12-equity.md) →

---

*The Gold Standard framework is PBLWorks / Buck Institute for Education. The one-learner analysis in this file is original to PBL Builder — see [NOTICE.md](../NOTICE.md).*
