# Using AI to Plan

An LLM is a good planning partner and an unreliable source of fact. Both halves matter.

This repo is built to be read by an agent — [`CLAUDE.md`](../CLAUDE.md) is the contract, and there are three [skills](../.claude/skills/) and seven [portable prompts](../prompts/). This page is about doing it well.

---

## What it's genuinely good at

- **Checking alignment.** "Does answering this driving question require these standards?" is exactly the kind of question a model answers usefully.
- **Generating options to reject.** Ask for five project ideas and you'll take one and a half. That's a good outcome — the rejecting clarifies what you want.
- **Rewording the driving question** for a specific learner's language. Genuinely hard for humans, easy for a model.
- **Finding the failure modes.** "What's most likely to go wrong in week three of this plan?" gets a useful answer.
- **Interviewing you.** The most underrated use. Being asked twenty questions about your learner surfaces things you knew but hadn't articulated.
- **Drafting the boring parts.** Family letter, information sheet, audience feedback form.
- **Adversarial review.** "Argue that this project is dessert, not main course." Very effective.

## What it's bad at

- **Standards codes.** It will produce extremely plausible fake ones. This is the single biggest risk and the reason `pbl profile check` fails rather than warns on an unresolvable code. Use `pbl standards search`.
- **Your learner.** It has the profile you wrote. You have eight years of watching them. When it's confidently wrong about what they'll respond to, you're right.
- **Local specifics.** It doesn't know whether your town has a watershed council. It will suggest one anyway.
- **Facts about the content.** Confidently wrong about erosion rates, dates, mechanisms. Verify anything that goes into the product.
- **Saying no.** It will accept a vague interest, agree to five success skills, and tell you your closed driving question is great. This is the failure mode you have to actively counteract.

---

## Getting a useful session

### 1. Give it the context

Role, learner, setting, constraints, and what you actually want. The single biggest determinant of output quality.

> I homeschool my 9-year-old daughter in a rural county. She reads about two years below grade level and has decided she's bad at reading. She spends every rainy afternoon digging channels in the driveway mud. Four weeks, six hours a week, no car on weekdays. I need her to hit NGSS erosion standards. I want her to say something out loud to someone who isn't me.

Or better: point it at a filled-in [learner profile](15-learner-profiles.md), which is that same information in a structured form.

### 2. Point it at the framework

With the repo cloned, the agent reads `CLAUDE.md` and works from the framework files. Without it, paste [`framework/design-elements.yaml`](../framework/design-elements.yaml) and the relevant success skill file into the conversation — that alone changes the output substantially.

### 3. The three foundations first, and stop there

Learning goals, driving question, product and audience. Get those right before you let it map a single milestone. Otherwise you get a beautiful six-week calendar built on a closed driving question and you'll throw it away.

### 4. Interrogate the output

- Is the driving question actually open, or does it just look open?
- **Does answering it require the standards, or could they answer it without learning anything?**
- Is the product authentic, or is it a poster with a job title attached?
- Is there a real audience, or does it say "the community"?
- Is the personal connection *named*, or asserted?
- Where would this stall in week three?

### 5. Check the codes

Every time. `pbl standards show <code>`.

### 6. Run the checkers

```bash
pbl profile check learners/sam/learner-profile.md
pbl validate learners/sam/project-plan.md
pbl review learners/sam/project-plan.md
```

These exist substantially *because* of LLM failure modes. `pbl review` catches invented standards, generic personal connections, a product that doesn't match the learner's preferences, missing fade plans, and a plausible plan with no critique cycle — all of which models produce confidently.

---

## Prompts that work

**To get pushback instead of agreement:**
> Argue that this project is dessert, not main course. Be specific about which element is weakest.

**To fix a driving question:**
> Here's my driving question and my three standards. Could a learner produce a decent answer without learning any of them? If so, rewrite it so they couldn't.

**To pressure-test the plan:**
> Where does this plan break in week three? Assume the learner loses interest and I'm tempted to rescue.

**To find the failure you can't see:**
> What have I designed around instead of designing for? What am I avoiding because it's hard for her?

**To check the personalization is real:**
> If you removed the learner's name from this plan, would anything in it still be specific to her? Quote the parts that would.

That last one is the most useful prompt on this page.

---

## Where to hold the line

An assistant working from `CLAUDE.md` is instructed to push back on all of these. Assistants are agreeable anyway. **You** need to hold them:

| It will | You should |
|---|---|
| Accept "likes animals" as an interest | Insist on specificity. → [profiles](15-learner-profiles.md) |
| Agree to track three or four success skills | One, with 1–3 dimensions |
| Call a closed driving question excellent | Apply the google test |
| Say "connects to the learner's interests" | Make it name the interest |
| Suggest dropping the audience for a shy learner | Build a comfort ramp instead |
| Write scaffolds with no fade plan | Require a trigger for each |
| Produce a standards code | Verify it |

---

## The boundary

**These tools help the adult plan. They don't do the learner's inquiry.**

A learner who has an AI summarise their sources has skipped the project. The thinking *is* the project — that's the whole premise.

Which doesn't mean no AI in a learner's hands. Legitimate uses: text-to-speech for a slow decoder, checking their own draft against the criteria they wrote, rehearsing a presentation against a hostile questioner, translating a source. The line is whether the learner still does the reasoning and the judging. If the model formed the conclusion, there's nothing left to assess and nothing was learned.

For an older learner, that line is itself worth making explicit and discussing — and in a project about AI, it's a genuinely contested driving question.

---

## Final judgment is yours

You know this child. The model has a text file about them.

When it's confidently wrong about what will engage them, what they can handle, or what will make them shut down — you're right. Overrule it, and don't explain yourself to it.

---

**Next:** [Learner profiles](15-learner-profiles.md) →

---

*Guidance on using AI for PBL planning informed by the PBLWorks corpus. All text original — see [NOTICE.md](../NOTICE.md).*
