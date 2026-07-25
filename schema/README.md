# Schema reference

Two contracts. Both live in the YAML frontmatter of a Markdown file, so one artifact serves humans and machines.

| Schema | File it governs | Role |
|---|---|---|
| [`learner-profile.schema.json`](learner-profile.schema.json) | `learners/<slug>/learner-profile.md` | **Input.** Who the learner is. |
| [`project-plan.schema.json`](project-plan.schema.json) | `learners/<slug>/project-plan.md` | **Output.** The project designed for them. |

Both are JSON Schema draft 2020-12. Every property carries a `description` — read the schema files directly for field-level detail; this page covers what the schemas can't express.

```
learner-profile.md ──► project-plan.md
        ▲                    │
        └────────────────────┘
        plan.learner_profile points back
```

The back-reference is mandatory. `pbl review` follows it to check that the plan actually reflects the profile — the checks called *profile fidelity*. A plan with a dangling `learner_profile` path fails.

---

## Validating

```bash
pbl profile check learners/sam/learner-profile.md   # schema + usability
pbl validate learners/sam/project-plan.md           # schema + body headings
pbl review learners/sam/project-plan.md             # 14 quality checks
```

Add `--json` to any of them for machine-readable output. Exit code is `0` on pass, `1` on failure.

Validating without the CLI works fine — the schemas are standalone:

```js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(profileSchema, 'learner-profile.schema.json'); // plan schema $refs this
const validate = ajv.compile(planSchema);
validate(parse(frontmatterString));
```

The plan schema `$ref`s the profile schema for shared `$defs` (`grade`, `success_skill`, `skill_level`), so **register the profile schema first** or compilation fails.

---

## Required body headings

The schemas govern frontmatter only. `pbl validate` also requires these `##` headings in the plan's Markdown body:

- `## Project Summary`
- `## Why This Project For This Learner`
- `## Week-by-Week Plan`
- `## Notes & Adaptations`

They exist because some things shouldn't be structured data. "Why This Project For This Learner" in particular is where the design reasoning lives — the part a future reader (including you in six months) actually needs.

The learner profile template has optional prose sections (`## What Lights Them Up`, `## What Gets Hard`, `## What We've Already Tried`). Not enforced, but they're where the useful detail tends to end up.

---

## Design decisions worth knowing

### One success skill, enforced by the type

`success_skill_target.skill` is a single string, not an array. This is deliberate and not negotiable at the schema level: a project that assesses five success skills teaches none of them. `dimensions` is capped at `maxItems: 3` for the same reason.

If you need to track a second skill across a *sequence* of projects, that's a portfolio concern — use separate plans.

### Scaffolds must fade

`scaffolds[].fade_plan` is required with `minLength: 10`. A support that never comes off is a permanent accommodation, and those belong in the profile's `needs.accommodations`. Both are legitimate; conflating them is how a learner ends up unable to start anything without a checklist someone else wrote.

### `needs` is functional, never diagnostic

The `need_tag` enum contains things like `working-memory` and `task-initiation` — descriptions of what happens, not names of conditions. There is deliberately no field for a diagnosis, an IEP reference, or an assessment score. Those carry real risk in a file that might get synced, backed up, or shared, and they don't improve scaffold selection: `loses the thread on multi-step directions` tells you what to do; a label doesn't.

`needs.none: true` distinguishes "nothing to note" from "not filled in yet."

### Standards codes are validated, not trusted

`standards_targets[].code` must resolve against `framework/standards/`, or be exactly the string `TBD`. `pbl profile check` **fails** on an unresolvable code rather than warning, because a plausible-looking invented code is worse than no code — it looks authoritative and nobody checks it.

`TBD` is the honest escape hatch. Use it and say so.

### `status` on a standard drives the milestone

`not-started` / `developing` / `secure` isn't decoration. It determines what kind of milestone the standard gets: direct instruction, application-and-critique, or used-as-leverage-and-not-retaught. `pbl review` warns if every standard is already `secure`, because then nothing new is being learned.

### Products carry `why_this_learner`

Required, `minLength: 15`. If you can't answer it, you picked a product off a list rather than for a person — which is exactly the failure this repo exists to prevent.

### `public_audience.comfort_ramp` instead of no audience

When the profile says `audience_comfort: low`, the plan needs a ramp: trusted adult → small friendly group → real audience. `pbl review` warns when a low-comfort learner has an audience that looks household-only and no ramp. Deleting the public product is never the right adaptation — it's the element doing its work.

### `support_plan` replaces classroom management

`adult_role`, `check_in_cadence`, and `stuck_protocol` are all required. `stuck_protocol` has `minLength: 20` because "help them" isn't a protocol, and because a learner stalling in week three is the single most common way a solo project dies.

---

## Extending the schemas

Both set `additionalProperties: false`. That's on purpose — a typo'd field name should error, not be silently ignored.

To add a field:

1. Add it to the schema with a real `description`.
2. Update `templates/` so people encounter it.
3. Update the three `examples/` so CI stays green.
4. Update this file.
5. If a `pbl review` check depends on it, add the check and a negative fixture in `tools/cli/test/`.

Bump `schema_version` only for a **breaking** change — a removed field, a narrowed enum, a new required field. Additive optional fields don't need a bump.

`framework/manifest.yaml` mirrors every enum under its `enums:` key for consumers who don't want to parse JSON Schema. Keep the two in sync; a test checks this.

### Deliberately absent

- **A roster / class mode.** One learner at a time, by design. See `CONTRIBUTING.md` before proposing it.
- **Grades or scores.** The schemas describe design and assessment plans, not gradebook records.
- **A rendered-output format.** Plans are Markdown; render them with whatever you like.

---

## Reading the standards data

`framework/standards/**/*.jsonl` — one JSON object per line, straight from the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph) under CC BY 4.0:

```jsonc
{
  "code": "4-ESS2-1",
  "framework": "NGSS",
  "jurisdiction": "Multi-State",
  "subject": "Science",
  "grades": ["4"],
  "text": "Make observations and/or measurements to provide evidence of the effects of weathering...",
  "type": "Standard",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "attribution": "Knowledge Graph is provided by Learning Commons under the CC BY-4.0 license. NGSS Science standards provided by 1EdTech..."
}
```

**Keep `license` and `attribution` on every record you redistribute.** That's the condition under which we can ship this data at all. See [`framework/standards/PROVENANCE.md`](../framework/standards/PROVENANCE.md).
