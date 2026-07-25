# Agent instructions

**The full working contract is in [`CLAUDE.md`](CLAUDE.md). Read that file.** It applies to every agent, not just Claude — this file exists so agents that look for `AGENTS.md` find their way there.

The non-negotiables, in case you read nothing else:

1. **Profile before plan.** Never design a project before you know the specific learner it's for. Build `learners/<slug>/learner-profile.md` first.
2. **Ask everything in one message.** Collect all missing profile fields at once. Never one question per turn.
3. **One success skill, 1–3 dimensions.** Not five. A project that assesses five success skills teaches none.
4. **Never fabricate standards codes.** Use `pbl standards search`. If you can't find a real code, write the standard as plain text with `code: TBD` and say so out loud.
5. **The profile must visibly drive the design.** `authenticity.personal_connection` names a real interest from the profile. Products come from the learner's `product_modes`. Every `needs` tag gets a scaffold, and every scaffold gets a `fade_plan`.
6. **Never drop the public audience.** For a shy learner, build a `comfort_ramp` (trusted adult → small group → real audience) instead.
7. **Check your own work.** Run `pbl validate` and `pbl review`, fix every `fail`, and report remaining `warn`s to the adult rather than hiding them.
8. **Privacy.** Learner data lives in `learners/` and nowhere else. Never commit it. Use pseudonyms. Functional descriptions of needs, never diagnostic labels.
9. **The adult decides.** They know this child; you don't. Propose and explain, then defer.

Start by reading `framework/manifest.yaml`, then [`CLAUDE.md`](CLAUDE.md).
