# learners/

**This is where your work goes. It is gitignored.**

Each learner gets a folder:

```
learners/
└── sam/
    ├── learner-profile.md      # who Sam is
    ├── project-plan.md         # the project designed for Sam
    ├── week-by-week.md         # optional: the day-to-day
    └── handouts/               # optional: filled-in student handouts
```

Create one with:

```bash
pbl profile new "Sam"
```

Then, once the profile is filled in:

```bash
pbl profile check learners/sam/learner-profile.md
pbl plan new --profile learners/sam/learner-profile.md
```

---

## Why this folder is gitignored

A learner profile is a description of a specific child — their reading level, what they can't hold in working memory, what they avoid, what accommodations they need. That is exactly the kind of information that should not end up in a repository, pushed to a remote, indexed by a search engine, or scraped into a training set.

`.gitignore` covers `learners/**` except this README. Please leave it that way.

### If you want to share a project design

Good — the community needs more worked examples. But share the **plan**, not the profile, and do this first:

1. Replace the learner's name with a pseudonym everywhere, including the folder name and the `learner_profile` path in the plan's frontmatter.
2. Strip anything that could identify the child, the family, or the school — town name, tutor's name, the specific community organization, the school board.
3. Generalize the `needs` fields to functional categories rather than a particular child's profile.
4. Re-read it once with fresh eyes, imagining the child reading it in ten years.

Then open a PR adding it to [`examples/`](../examples/). See [`CONTRIBUTING.md`](../CONTRIBUTING.md).

### If you want version control on your own plans

Reasonable — plans go through a lot of revision. Two options:

- Keep `learners/` in a **separate private repository** and symlink or copy it in.
- Keep a local-only branch that you never push. Note that "never push" is a promise you have to keep manually, so the separate-repo option is safer.

Do not remove `learners/**` from `.gitignore` in a fork you intend to push.

---

## A note on what goes in `needs`

Describe function, not diagnosis.

- Write: "loses the thread on multi-step directions," "needs a written checklist to start a task," "reads roughly two years below grade level"
- Don't write: a diagnostic label, an IEP number, medication, or a clinical assessment score

The functional description is what actually drives scaffold selection. The label doesn't, and it carries risk the functional description doesn't.
