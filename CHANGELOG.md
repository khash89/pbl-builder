# Changelog

Notable changes to PBL Builder. Follows [Semantic Versioning](https://semver.org/) for the CLI and `schema_version` for the two schemas.

**Schema changes are the breaking ones that matter** — a `schema_version` bump means existing profiles or plans need editing. Retired standards codes also get called out here, because real users' plans reference them.

## [Unreleased]

## [0.1.0] — 2026-07-24

First release. Everything below is new.

### The idea

PBL Builder designs Gold Standard Project Based Learning projects for **one learner at a time**. The learner profile is the primary input and the project is designed outward from it — for homeschool, microschools, tutoring, and individualized learning.

### Framework

- **8 Essential Project Design Elements** in [`framework/design-elements.yaml`](framework/design-elements.yaml), with check questions and failure modes. PBLWorks names seven; we split *reflection* and *critique & revision* because they're planned separately and fail differently.
- **7 Project Based Teaching Practices**, each with a one-learner translation
- **4-phase Project Path** with cross-phase invariants
- **18 classroom strategies**, each tagged `direct` / `adapted` / `needs-others` for solo viability
- **12 product types**, tagged by `modes`, effort, and `audience_pressure`
- **20 scaffolds** keyed to functional need tags, each with fade guidance
- **5 success skills** with 4 dimensions each and 4 performance levels — original descriptors, not PBLWorks rubric language

### Standards

- **2,570 standards** bundled from the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph) v1.11.0 under **CC BY 4.0** (1.8 MB): CCSS.ELA-LITERACY (1,100), CCSS.MATH (597), C3 (300), WIDA-DALE (261), NGSS (208), WIDA (104)
- ~30 US state jurisdictions available on demand via `pbl standards sync`
- Per-record `license` and `attribution` preserved throughout — verified in CI
- Reproducible: filter predicate and row counts documented in [`PROVENANCE.md`](framework/standards/PROVENANCE.md)

### Schemas — `schema_version: 1`

- [`learner-profile.schema.json`](schema/learner-profile.schema.json) — the primary input
- [`project-plan.schema.json`](schema/project-plan.schema.json) — the output, with a mandatory back-reference to its profile

Three constraints enforced structurally rather than by convention:

- **One success skill.** `skill` is a string, not an array; `dimensions` caps at 3.
- **Every scaffold fades.** `fade_plan` is required. A support that never comes off is an accommodation and belongs in the profile.
- **Needs are functional, never diagnostic.** No field exists for a diagnosis, IEP reference, or assessment score.

### CLI — `pbl` / `npx pbl-builder`

Node 20+, four runtime dependencies.

- `pbl profile new|check` — scaffold a profile; validate it *and* check it's usable
- `pbl plan new --profile <path>` — scaffold a plan pre-filled from the profile, including a product menu filtered to the learner's modes and suggested scaffolds for their needs
- `pbl validate` — schema, required body headings, unfilled placeholders
- `pbl review` — **15 checks** against the design elements, including *profile fidelity*: does the plan actually reflect the learner it claims to be for?
- `pbl standards search|show|list|sync`
- `pbl framework [id]` — framework data as JSON for other systems

`--json` on everything. Exit 0 / 1 for CI.

**Standards codes that don't resolve are a hard failure, not a warning.** A plausible-looking invented code is worse than none — it looks authoritative and nobody checks it. `TBD` is the honest escape hatch.

### Docs

17 knowledge-base files plus 18 strategy files and a glossary. Two are specific to this project rather than adapted from the classroom framework:

- [`11-solo-and-small-group-pbl.md`](docs/11-solo-and-small-group-pbl.md) — what actually changes without a class, and what fails silently
- [`15-learner-profiles.md`](docs/15-learner-profiles.md) — how to write a profile that produces a good project

### Templates

Learner profile, project plan (+ a pure-data YAML variant), 7 teacher and 10 student handouts. Each handout carries a one-learner adaptation note where the classroom original assumes a class.

### Examples

Three complete profile → plan pairs, all passing 15/15 with zero warnings:

- **Maya, grade 4, homeschool** — a learner who has decided she's bad at reading; comfort ramp instead of dropping the audience
- **Devon, grade 8, microschool** — turning a "difficult" trait into the project's engine; maths integrated non-artificially
- **Amara, grade 11, tutoring** — a high achiever who has never chosen anything; a scaffold that graduates into a product

All three learners are invented. All standards codes are real.

### Agent support

- [`CLAUDE.md`](CLAUDE.md) / [`AGENTS.md`](AGENTS.md) — the working contract
- Three skills in [`.claude/skills/`](.claude/skills/), open-skills format: profile builder, plan builder, plan reviewer
- Seven [portable prompts](prompts/) for ChatGPT or Gemini with no repo access
- Optional Learning Commons KG MCP server for live standards lookup

### Tests

78 tests: schema integrity, one negative fixture per review check, standards snapshot, rubric drift detection, repo-wide link check, and attribution/privacy guards.

The negative fixtures are the point — a check that never fires is worse than no check, because it reports a plan as fine when nobody looked.

### Not built

- **Class mode** (one project, many learners). The most likely v2. Running parallel plans works today.
- A web UI. Deliberately plain files.

### Attribution

Framework by [PBLWorks](https://www.pblworks.org/) / Buck Institute for Education — **cited, never copied.** Every word here is original; no PBLWorks text, rubric language, or PDFs are reproduced. Their official resources are free and better field-tested: [pblworks.org/resources](https://www.pblworks.org/resources).

Standards data: Learning Commons Knowledge Graph, CC BY 4.0. Thinking routines: Project Zero, Harvard GSE.

Full detail in [`NOTICE.md`](NOTICE.md).

[Unreleased]: https://github.com/khash89/pbl-builder/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/khash89/pbl-builder/releases/tag/v0.1.0
