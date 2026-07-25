# Contributing to PBL Builder

Thanks for being here. This project is most useful when it covers grade bands, subjects, and settings that its original authors don't have experience with — so contributions from practitioners are the point, not a nice-to-have.

## Before anything else: never commit learner data

`learners/` is gitignored and must stay that way. If you are contributing a project design based on a real child, read [`learners/README.md`](learners/README.md) and de-identify it properly first. This is the one rule we will not negotiate on.

---

## What we especially want

| Contribution | Why it's valuable |
|---|---|
| **Worked exemplars** for grade bands or subjects we don't cover | We ship grades 4, 8, and 11 in science/civics/statistics. Nothing for K–2, nothing for arts, world languages, or CTE. Each gap makes the repo less useful to someone. |
| **Standards jurisdictions** beyond Multi-State | The Knowledge Graph has 25+ states. We bundle only the multi-state (CCSS/NGSS) slice. Adding your state helps everyone in it. |
| **Product toolkit entries** | `framework/product-types.yaml` has 12. There are many more good public products. |
| **Scaffolds** | `framework/scaffolds.yaml` is the weakest part of the repo. If you know a scaffold that works and how to fade it, add it. |
| **Translations** | The framework is not English-specific. The docs currently are. |
| **Corrections** | If we've misdescribed a strategy, misattributed something, or written a rubric descriptor that doesn't hold up in practice, tell us. Practitioner correction beats author intent. |

## What we're not building

- **Class mode** (one project, many learners) is deferred to v2. A PR that adds a roster field to the learner profile schema will get a friendly no — it's a real design change that needs its own discussion first. Open an issue instead.
- **A web UI.** The repo is deliberately plain files.
- **More CLI dependencies.** `tools/cli` has four runtime dependencies on purpose.

---

## Setup

```bash
git clone https://github.com/OWNER/pbl-builder.git
cd pbl-builder/tools/cli
npm install
npm test
```

`npm test` runs the schema tests, the review-check fixtures, and a repo-wide Markdown link check. It should pass on a clean clone. If it doesn't, that's a bug — please report it.

To use your working copy's CLI:

```bash
npm link          # from tools/cli
pbl --help
```

---

## Contributing an exemplar

This is the highest-value contribution, so here's the full path.

1. **Invent a learner.** Not a real child, even de-identified — invent one. Give them specific, real-feeling interests and a genuine constraint (a need, a low choice appetite, a hard schedule). A frictionless learner makes a useless example.

2. **Create the folder:**
   ```
   examples/<name>-grade-<n>-<topic>/
   ├── README.md            # what this example demonstrates and how to adapt it
   ├── learner-profile.md
   ├── project-plan.md
   ├── week-by-week.md
   └── product-rubric.md
   ```

3. **Make it pass clean:**
   ```bash
   pbl profile check examples/<slug>/learner-profile.md
   pbl validate examples/<slug>/project-plan.md
   pbl review examples/<slug>/project-plan.md
   ```
   Zero `fail`. If a `warn` remains, explain in the README why it's the right call — sometimes it is.

4. **Say what it teaches.** The README should name the design problem this example solves, e.g. "a learner with low audience comfort who still gets a real public product," or "math integrated without being bolted on." Examples that don't demonstrate anything specific are just more files to read.

5. **Use real standards codes.** `pbl standards search` will find them. Invented codes will fail `profile check`.

## Contributing a standards jurisdiction

```bash
pbl standards sync --jurisdiction "Texas" --subject Science --out framework/standards/texas/
```

Then commit the generated JSONL plus an updated `framework/standards/index.yaml`. Do not hand-edit the JSONL — the `attributionStatement` and `license` fields on every record must survive intact, and `PROVENANCE.md` must record the filter you used so the slice is reproducible.

Keep a jurisdiction under ~5 MB. If it's bigger, ship it gzipped.

## Contributing docs

- **Original writing only.** See the next section — this matters more here than anywhere else.
- Each `docs/10-strategies/*.md` file follows a fixed shape: purpose → when in the Project Path → how to run it → **solo/one-learner adaptation** → grade-band adaptation → common mistakes → source link. Keep the shape; agents rely on it.
- Add new strategies to `framework/strategies.yaml` with a stable `id` in the same PR.
- Link internally with relative paths. `npm test` will catch broken ones.

---

## The attribution rule

**Do not paste text from PBLWorks materials into this repo.** Not rubric language, not checklist wording, not strategy-guide prose. Their resources are published under restrictive terms (typically CC BY-NC-ND); naming and describing their framework is fine, redistributing their words is not.

Write it in your own words and cite the source. If you're describing something you learned from a specific PBLWorks resource, link to it at the bottom of the file.

The same goes for any other copyrighted curriculum. If you're not sure whether something crosses the line, open an issue and ask before you write it — it's much easier than untangling it in review.

Standards data from the Learning Commons Knowledge Graph is different: it's CC BY 4.0 and *is* redistributable, as long as per-record attribution survives.

---

## Pull requests

- One concern per PR. A new exemplar and a schema change are two PRs.
- **Schema changes** need `schema/README.md`, the affected templates, and the affected examples updated in the same PR. A schema change that breaks the examples will fail CI.
- Run `npm test` before pushing.
- Describe *why*, not just what. "Adds a K–2 exemplar because the repo has nothing below grade 4 and early-childhood PBL is structurally different" is a good PR description.
- CI must be green.

## Reporting problems

Use the [issue templates](.github/ISSUE_TEMPLATE). Four kinds:

- **Bug** — the CLI or a schema is broken
- **New exemplar** — you want to contribute one, or you want one that doesn't exist
- **New jurisdiction** — a standards set you need
- **Framework correction** — we described something wrong, or misattributed it

For attribution problems specifically, see the Corrections section of [`NOTICE.md`](NOTICE.md). Those get fixed fast.

## Licensing your contribution

By contributing you agree that your contribution is licensed under the same terms as the file it lands in: MIT for `tools/`, CC BY-NC-SA 4.0 for content. See [`LICENSE`](LICENSE) and [`LICENSE-CONTENT`](LICENSE-CONTENT).

## Conduct

[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Short version: this is a project about kids' learning. Behave accordingly.
