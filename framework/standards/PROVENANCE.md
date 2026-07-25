# Standards data provenance

Everything in this directory is a **curated subset of the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph)**, redistributed under **CC BY 4.0**. This file records exactly what we took, how, and from where — so the slice is reproducible rather than a mystery blob, and so the attribution chain is legible.

---

## Attribution

> Knowledge Graph is provided by Learning Commons under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license. Learning Commons received state standards and written permission under CC BY 4.0 from 1EdTech; learning components under CC BY 4.0 from Achievement Network; and learning progressions under CC0 from Student Achievement Partners.

Each record carries its own `attribution` and `license` fields naming the issuing body for that specific standard — for example:

> Knowledge Graph is provided by Learning Commons under the CC BY-4.0 license. NGSS Science standards provided by 1EdTech available at https://www.nextgenscience.org/…

**If you redistribute this data, keep the `attribution` and `license` fields on every record.** That is the condition under which we can ship it and you can pass it on. We verify it in CI.

Learning Commons is not affiliated with PBL Builder and has not reviewed it.

---

## Source

| | |
|---|---|
| Project | Learning Commons Knowledge Graph |
| Version | **v1.11.0** |
| Export | `nodes.jsonl` (292,652,341 bytes / 247,786 nodes) |
| URL | `https://cdn.learningcommons.org/knowledge-graph/v1.11.0/exports/nodes.jsonl` |
| Retrieved | 2026-07-24 |
| Data license | CC BY 4.0 |
| Upstream code license | MIT |

The upstream project also publishes `relationships.jsonl` (520,406,049 bytes) describing learning progressions and prerequisite structure. **We do not use it.** It's valuable — it would let a tool sequence standards by prerequisite — but PBL Builder doesn't need it yet and it would triple the download. If someone wants to build progression-aware milestone sequencing, that's the file to reach for.

---

## What we kept

The filter predicate, in full:

```js
node.type === 'node'
  && node.labels.includes('StandardsFrameworkItem')
  && properties.statementCode != null            // must be citable
  && properties.normalizedStatementType === 'Standard'
  && properties.isCurrent !== 'false'            // not superseded
  && properties.academicSubject ∈ {Mathematics, English Language Arts,
                                   Science, Social Studies}
  && properties.description.trim().length >= 10
  && properties.jurisdiction === 'Multi-State'   // for the bundled slice
```

Then each node is trimmed to the ten fields described in [`index.yaml`](index.yaml), with `description` whitespace-normalised (the source hard-wraps long descriptions mid-sentence, which made search results unreadable).

### Two filter decisions worth explaining

**We dropped `Standard Grouping`, `Course`, and `Other` statement types.** They're structural containers in the source graph. In practice their descriptions are placeholders — `"Grades 3-5"`, `"Grade 5"` — rather than anything a teacher could target. Including them measurably degraded `pbl standards search`. The cost is that you can't browse by domain or cluster; the benefit is that every row you get back is a real, citable standard.

**We kept the WIDA sets, including the Spanish-language DALE framework.** Their upstream attribution credits "Board of Regents of the University of Wisconsin," which is unrecognisable as a framework name, so we relabel them `WIDA` and `WIDA-DALE`. They're here because they're directly useful when a learner profile lists `english-language-development` or `academic-vocabulary` — pair a WIDA standard with a content standard. DALE is a distinct framework, not a translation, and its `text` is in Spanish, which is why records carry a `language` field.

---

## What we produced

| File | Rows | Bytes | Frameworks |
|---|---:|---:|---|
| `multi-state/ela.jsonl` | 1,465 | 1,156,354 | CCSS.ELA-LITERACY (1,100), WIDA-DALE (261), WIDA (104) |
| `multi-state/math.jsonl` | 597 | 423,273 | CCSS.MATH |
| `multi-state/science.jsonl` | 208 | 127,509 | NGSS |
| `multi-state/social-studies.jsonl` | 300 | 206,432 | C3 |
| **Total** | **2,570** | **1,913,568** (1.82 MB) | 6 frameworks |

Grade coverage: K–12 in every file. Languages: `en-US` (2,309 rows), `es-US` (261 rows).

Reduction: 247,786 nodes → 2,570 records; 292 MB → 1.82 MB.

**On the NGSS row count:** 208 looks small next to 1,465 ELA rows, and it's correct. NGSS performance expectations are deliberately few and broad — that's the design of the framework, not missing data.

Records are sorted by grade then code, so regenerating the slice produces a clean git diff instead of a reshuffle.

---

## Reproducing it

```bash
curl -L "https://cdn.learningcommons.org/knowledge-graph/v1.11.0/exports/nodes.jsonl" -o nodes.jsonl

node tools/cli/src/standards/curate.mjs \
  --input nodes.jsonl \
  --out framework/standards/multi-state \
  --jurisdiction "Multi-State"
```

Prints a JSON report of row counts, byte counts, and framework distribution. The curation script is [`tools/cli/src/standards/curate.mjs`](../../tools/cli/src/standards/curate.mjs) — it streams the input, so it runs in constant memory.

`tools/cli/test/standards.test.mjs` holds a snapshot test over the committed slice, so an accidental regeneration with different filters fails CI rather than landing quietly.

### Adding a state

```bash
node tools/cli/src/standards/curate.mjs \
  --input nodes.jsonl \
  --out framework/standards/texas \
  --jurisdiction "Texas"
```

Then add it to [`index.yaml`](index.yaml) and record the row counts here. Keep a jurisdiction under ~5 MB; gzip it if it's larger. See [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

---

## Upgrading to a newer Knowledge Graph version

1. Check for a newer export at the [knowledge-graph repo](https://github.com/learning-commons-org/knowledge-graph) and update `KG_VERSION` in `curate.mjs`.
2. Regenerate every bundled jurisdiction.
3. `git diff --stat` on the JSONL — a large diff means the upstream schema or filter behaviour changed, and you should look before committing.
4. Update the tables in this file and in `index.yaml`.
5. Run `npm test` in `tools/cli`. The snapshot test will fail; inspect the diff before updating the snapshot.
6. **Check that existing plans still resolve.** A standards code that disappeared upstream will start failing `pbl profile check` for real users. If codes were retired, say so in `CHANGELOG.md`.

---

## The live alternative

Learning Commons also offers a REST API and an **MCP server** (`https://kg.mcp.learningcommons.org/mcp`), both currently API-key gated. They're more complete and more current than this snapshot — they cover all jurisdictions and include the learning progressions we skipped.

If you have a key, configure the MCP server and your agent will prefer it (see [`CLAUDE.md`](../../CLAUDE.md)). This bundled slice is the offline fallback, and it exists so that PBL Builder works with no account, no key, and no network.

---

## Corrections

If a standard here is wrong, misattributed, or shouldn't be redistributed, [open an issue](https://github.com/OWNER/pbl-builder/issues) and we'll fix it quickly. For upstream data errors, report them to [learning-commons-org/knowledge-graph](https://github.com/learning-commons-org/knowledge-graph) as well — we're a downstream copy and can only patch our snapshot.
