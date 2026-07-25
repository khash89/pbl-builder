# pbl

Design Gold Standard Project Based Learning projects around **one learner**.

Part of [PBL Builder](https://github.com/OWNER/pbl-builder). Node 20+.

```bash
npx pbl-builder --help
```

---

## The flow

```bash
pbl profile new "Sam"                                     # 1. who they are
pbl profile check learners/sam/learner-profile.md         #    is it usable?
pbl standards search "ecosystem" --grade 7                #    find real codes
pbl plan new --profile learners/sam/learner-profile.md    # 2. scaffold the plan
pbl validate learners/sam/project-plan.md                 # 3. well-formed?
pbl review learners/sam/project-plan.md                   #    any good?
```

Everything takes `--json`. Exit code is `0` on pass, `1` on failure, so it composes in CI.

---

## Commands

### `pbl profile check <file>`

Schema validation **plus** usability checks — the second part is the useful one:

- **Interests must be specific.** "Sports" and "reading" fail. They produce generic projects and no amount of good design downstream recovers from it.
- **Strengths must be observable behaviours.** "Smart" fails.
- **Exactly one success skill**, with valid dimension ids. Warns if you target `collaboration` for a solo learner.
- **Standards codes must resolve.** A code that doesn't is a **failure**, not a warning — a plausible-looking invented code is worse than none, because it looks authoritative and nobody checks it. `TBD` is the honest option and warns instead.
- **Privacy scan** — flags what looks like a diagnosis, an IEP reference, medication, a test score, or a full name.

### `pbl plan new --profile <file>`

Scaffolds a plan with everything mechanically derivable already filled in: grade, subjects, standards verbatim, the success skill and its dimensions, choice calibration.

It also injects two things worth having:

- **A product menu filtered to this learner's `product_modes`**, with effort and audience-pressure noted, and the lowest-pressure options called out if their audience comfort is low.
- **Suggested scaffolds** for each populated need, each with fade guidance from the library.

The design decisions stay blank. **A fresh scaffold is supposed to fail `pbl validate`** — that's how you find what still needs filling in.

### `pbl validate <file>`

Schema, the four required body headings, and unfilled `[bracketed]` placeholders.

### `pbl review <file>`

Fifteen deterministic checks, grouped by design element, each with a pointer into `docs/`.

The one that distinguishes this tool is **profile fidelity** — it follows the plan's `learner_profile` back to the profile and checks that:

- `authenticity.personal_connection` names a real interest from it (not "connects to student interests")
- the product's `modes` overlap the learner's `product_modes`
- every populated need has at least one scaffold

That check is what catches a generic project with a child's name attached. Others verify one success skill, an open-ended driving question, an audience beyond the household, all four phases populated, a critique cycle *before* the presentation, reflection spread across phases, formative assessment in both middle phases, fade plans on every scaffold, choice calibrated to the profile, resolvable standards, and a real stuck protocol.

`--strict` treats warnings as failures. `-v` shows hints on passing checks too.

**A plan can pass all fifteen and still be a bad project.** A plan that fails them is reliably worse than it looks. For the judgments no checker can make, use [`rubrics/project-design-rubric.md`](../../rubrics/project-design-rubric.md).

### `pbl standards search|show|list|sync`

```bash
pbl standards search "watershed" --grade 4 --jurisdiction Multi-State
pbl standards show 4-ESS2-1
pbl standards list
pbl standards sync --jurisdiction "Texas"
```

2,570 standards bundled (CCSS Math + ELA, NGSS, C3, WIDA); ~30 US states on demand. Data from the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph) under CC BY 4.0 — see [`PROVENANCE.md`](../../framework/standards/PROVENANCE.md).

`sync` downloads the ~292 MB upstream export once, caches it in `.cache/`, filters, and writes to `.cache/standards/`.

### `pbl framework [id]`

Framework data as JSON, for other tools:

```bash
pbl framework                    # the manifest
pbl framework product-types
pbl framework scaffolds --yaml
```

Ids: `manifest`, `design-elements`, `teaching-practices`, `project-path`, `strategies`, `product-types`, `scaffolds`, and each success skill by name.

---

## Programmatic use

```js
import { readDoc, reviewPlan, validatePlan, searchStandards } from 'pbl-builder';

const doc = readDoc('./project-plan.md');
const { ok, errors } = validatePlan(doc.data);
const { findings, summary } = reviewPlan(doc);

const matches = searchStandards('erosion', { grade: '4' });
```

Also exported: `checkProfile`, `validateProfile`, `resolveCode`, `checkCodes`, `readFrameworkYaml`, `findPlaceholders`, and the curation functions. See [`src/index.mjs`](src/index.mjs).

---

## Development

```bash
cd tools/cli
npm install
npm test
npm link          # then `pbl` uses your working copy
```

78 tests. The negative fixtures matter most — there's one per review check, because a check that never fires reports a plan as fine when nobody actually looked.

```
src/
  cli.mjs                    commands
  index.mjs                  public API
  render-rubrics.mjs         generates rubrics/success-skills/*.md from the YAML
  lib/
    repo.mjs                 repo discovery, frontmatter, placeholder detection
    schema.mjs               Ajv (draft 2020-12), human-readable errors
    review.mjs               the 15 checks
    profile-check.mjs        profile usability checks
    standards.mjs            lookup and search
    output.mjs               terminal formatting
  standards/curate.mjs       streams the KG export into the bundled slice
```

Four runtime dependencies — `commander`, `yaml`, `ajv`, `ajv-formats` — on purpose. Please don't add a fifth without a good reason.

**MIT licensed.** The content in the rest of the repo is CC BY-NC-SA 4.0, and the standards data is CC BY 4.0. See [`LICENSE`](../../LICENSE) and [`NOTICE.md`](../../NOTICE.md).
