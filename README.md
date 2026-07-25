# PBL Builder

**Design a Gold Standard Project Based Learning project around one real child.**

Most PBL planning tools are class-shaped: one project, thirty students, differentiate later. PBL Builder inverts that. You start with **a learner profile** — grade, the standards they need to hit, one success skill to grow, what they actually care about, how they work, where they get stuck — and the project is designed outward from there.

It is built for homeschool, microschools, tutoring, and any setting where you are planning for one learner at a time.

```
learner-profile.md  ──►  project-plan.md  ──►  pbl review
   who they are          the project           does it hold up?
```

[![CI](https://github.com/OWNER/pbl-builder/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/pbl-builder/actions/workflows/ci.yml)

---

## Pick your path

### Path 1 — You have an AI assistant (fastest)

Clone the repo, open it in Claude Code (or Cursor, Codex, or any agent that reads `AGENTS.md`), and say:

> Help me build a PBL project for my 4th grader.

The agent reads [`CLAUDE.md`](CLAUDE.md), interviews you, writes a learner profile and a project plan into `learners/`, then checks its own work with the CLI and fixes what fails.

You can also install just the skills into an existing project:

```bash
npx skills add OWNER/pbl-builder
```

### Path 2 — You want to do it yourself

1. Read [`docs/00-start-here.md`](docs/00-start-here.md) — it's a 10-minute orientation.
2. Copy [`templates/learner-profile.md`](templates/learner-profile.md) and fill it in. [`docs/15-learner-profiles.md`](docs/15-learner-profiles.md) explains what makes a profile useful versus useless.
3. Copy [`templates/project-plan.md`](templates/project-plan.md) and work through it, using [`docs/06-design-process.md`](docs/06-design-process.md) as your guide.
4. Check your plan against [`rubrics/project-design-rubric.md`](rubrics/project-design-rubric.md) before you launch.

No tooling required. Everything is plain Markdown.

Not sure it's worth the effort? Read one of the [worked examples](examples/) first — each one shows a profile and the project it produced.

### Path 3 — You're building software

The two JSON Schemas in [`schema/`](schema/) are the contract. Framework data lives in [`framework/`](framework/) as YAML with stable ids. Academic standards ship as JSONL in [`framework/standards/`](framework/standards/).

```bash
npx pbl-builder framework product-types --json
npx pbl-builder standards search "ecosystem" --grade 4 --json
npx pbl-builder review path/to/project-plan.md --json
```

See [`schema/README.md`](schema/README.md) for the field-by-field reference.

---

## Install the CLI

Requires Node 20+.

```bash
npx pbl-builder --help
```

Or from a clone:

```bash
cd tools/cli && npm install && npm link
```

Then:

```bash
pbl profile new "Sam"                       # scaffold a learner profile
pbl profile check learners/sam/learner-profile.md
pbl standards search "watershed" --grade 4  # find real standards codes
pbl plan new --profile learners/sam/learner-profile.md
pbl validate learners/sam/project-plan.md   # is it well-formed?
pbl review learners/sam/project-plan.md     # is it any good?
```

`pbl review` runs 13 deterministic checks against the Essential Project Design Elements — including whether the project actually reflects the profile it came from. It will tell you if you designed a generic project and attached a child's name to it.

---

## What's in here

| Path | What it holds |
|---|---|
| [`docs/`](docs/) | The knowledge base. What PBL is, the design process, 16 classroom strategies, assessment, equity, grade bands, and how to run all of it for a single learner. |
| [`framework/`](framework/) | Machine-readable canon: design elements, teaching practices, the Project Path, 12 product types, a scaffold library, 5 success skills, and academic standards. |
| [`schema/`](schema/) | JSON Schemas for learner profiles and project plans. |
| [`templates/`](templates/) | Fill-in-the-blank starting points, including 18 teacher and student handouts. |
| [`rubrics/`](rubrics/) | Rubrics for evaluating a project design, your own teaching, and each success skill. |
| [`examples/`](examples/) | Three complete profile → plan pairs across grades 4, 8, and 11. |
| [`prompts/`](prompts/) | Copy-paste prompts if you're using ChatGPT or Gemini with no repo access. |
| [`learners/`](learners/) | Where **your** profiles and plans go. Gitignored by default. |
| [`tools/cli/`](tools/cli/) | The `pbl` command. |

---

## Privacy

`learners/` is gitignored. Learner profiles contain information about a child — reading level, executive function, accommodations, what they struggle with — and that does not belong in a public repository.

Use a first name or a pseudonym. Every example in this repo uses an invented child. If you fork this repo to share a project design, share the plan, not the profile.

---

## Where this comes from

Two bodies of work, licensed differently.

**The PBL framework** is [PBLWorks](https://www.pblworks.org/) (the Buck Institute for Education): Gold Standard PBL, the seven Essential Project Design Elements, the seven Project Based Teaching Practices, the four-phase Project Path, and the five success skills. Their research and field-testing is what makes any of this work.

Everything in this repo is **written from scratch and cited** — no PBLWorks text, checklists, rubric language, or PDFs are reproduced here. When you want the official documents, go to [pblworks.org/resources](https://www.pblworks.org/resources). Our rubrics are our own descriptors aligned to their skill definitions, and each one says so.

**The academic standards** come from the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph), licensed **CC BY 4.0**, which is why we can ship them directly. Provenance and the full attribution chain are in [`framework/standards/PROVENANCE.md`](framework/standards/PROVENANCE.md).

See [`NOTICE.md`](NOTICE.md) for the complete attribution.

### Related projects

PBL Builder covers **multi-week projects**. If you need help with individual lessons, these are better tools and they install alongside this one:

- [learning-commons-org/agent-skills](https://github.com/learning-commons-org/agent-skills) — standards-aligned lesson planning and differentiation
- [anthropics/k12-teacher-skills](https://github.com/anthropics/k12-teacher-skills) — K-12 teacher workflows

---

## Contributing

Yes please — especially worked examples for grade bands and subjects we don't cover, more standards jurisdictions, and translations. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md).

## License

- Code in `tools/` — [MIT](LICENSE)
- Docs, templates, rubrics, and examples — [CC BY-NC-SA 4.0](LICENSE-CONTENT)
- Standards data in `framework/standards/` — CC BY 4.0, see [PROVENANCE.md](framework/standards/PROVENANCE.md)

## Status

v0.1.0 — the schemas, framework data, CLI, and examples are complete and tested. **Class mode (one project, many learners) is not built.** It's the most likely v2.
