## What and why

<!-- What changes, and what problem it solves. The "why" matters more than the "what" — "adds a K-2 exemplar because the repo has nothing below grade 4 and early-childhood PBL is structurally different" is a good description. -->

## Type

- [ ] Worked example
- [ ] Standards jurisdiction
- [ ] Docs / correction
- [ ] Framework data (`framework/*.yaml`)
- [ ] Schema change
- [ ] CLI
- [ ] Other

---

## Checks

- [ ] `npm test` passes in `tools/cli`
- [ ] One concern per PR (a new example and a schema change are two PRs)

**Attribution** — the PBLWorks framework is cited, never redistributed:

- [ ] No text pasted from PBLWorks materials, or any other copyrighted curriculum
- [ ] Anything I learned from a specific source is cited at the bottom of the file

**Privacy:**

- [ ] Nothing under `learners/` is committed
- [ ] Any learner in an example is **invented**, not a real child
- [ ] No diagnoses, IEP contents, assessment scores, or full names anywhere

<details>
<summary><strong>If this adds an example</strong></summary>

- [ ] `pbl profile check`, `pbl validate`, and `pbl review` all pass with zero failures
- [ ] Any remaining warning is explained in the README as a deliberate choice
- [ ] Real standards codes, found with `pbl standards search`
- [ ] The README names the **design problem** this example demonstrates
- [ ] The learner has a genuine constraint — a frictionless learner makes a useless example

</details>

<details>
<summary><strong>If this changes a schema</strong></summary>

- [ ] `schema/README.md` updated
- [ ] Affected templates updated
- [ ] All three examples still validate
- [ ] `framework/manifest.yaml` enums still match (a test checks this)
- [ ] `schema_version` bumped **only** if the change is breaking

</details>

<details>
<summary><strong>If this changes framework YAML</strong></summary>

- [ ] Stable `id` values — renaming an id breaks existing plans
- [ ] New strategies added to `framework/strategies.yaml` with a matching doc file
- [ ] New need tags have at least one scaffold (a test checks this — an orphan tag makes `pbl review` unsatisfiable)
- [ ] Success-skill rubrics regenerated: `node tools/cli/src/render-rubrics.mjs`

</details>

<details>
<summary><strong>If this changes standards data</strong></summary>

- [ ] Generated with `curate.mjs`, not hand-edited
- [ ] Every record still carries `license` and `attribution`
- [ ] `index.yaml` row counts and `PROVENANCE.md` tables updated
- [ ] Noted in `CHANGELOG.md` if any code was retired — real users' plans reference these

</details>
