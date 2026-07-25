# Standards

This repo ships real academic standards so nobody has to invent a code.

Data: [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph), **CC BY 4.0**. Full provenance: [`framework/standards/PROVENANCE.md`](../framework/standards/PROVENANCE.md).

---

## Finding a code

```bash
pbl standards search "erosion water" --grade 4
pbl standards search "argument evidence" --grade 8 --framework CCSS.ELA-LITERACY
pbl standards show 4-ESS2-1
pbl standards list
```

Add `--json` for machine-readable output.

Search matches codes and standard text. It's deliberately simple scoring — exact code, then code substring, then keyword hits — which is plenty for finding the right standard in a 2,570-row set.

### It searches words, not concepts

This catches people out, so it's worth knowing. Standards are often written without the obvious topic word:

```bash
pbl standards search "ecosystem" --grade 5     # 0 results
```

There is no grade-5 standard containing the word "ecosystem" — but `5-LS2-1` is *"Develop a model to describe the movement of matter among plants, animals, decomposers, and the environment."* That's the ecosystems standard; it just doesn't say so.

So when a search comes back empty, **try the words the standard itself would use** rather than the topic label:

```bash
pbl standards search "matter plants animals decomposers" --grade 5   # finds it
```

Or drop `--grade` and scan the band. An empty result almost never means the standard doesn't exist.

---

## What's bundled

**Multi-State** — the nationally-used frameworks, K–12, 2,570 standards:

| Framework | Rows | Subject |
|---|---:|---|
| CCSS.ELA-LITERACY | 1,100 | English Language Arts |
| CCSS.MATH | 597 | Mathematics |
| C3 | 300 | Social Studies |
| WIDA-DALE | 261 | Spanish language development |
| NGSS | 208 | Science |
| WIDA | 104 | English language development |

**On NGSS being only 208:** that's the complete set of performance expectations. NGSS is deliberately far smaller and broader than a typical state science framework — it's the design of the framework, not missing data.

**On the WIDA sets:** language-development standards for multilingual learners. Pair one with a content standard when the profile lists `english-language-development` or `academic-vocabulary`. WIDA-DALE is the Spanish-language framework — a distinct framework, not a translation, and its text is in Spanish (records carry a `language` field).

If your state adopted or adapted one of these, the codes here will usually match.

---

## Adding your state

```bash
pbl standards sync --jurisdiction "Texas"
```

Downloads the upstream export once (~292 MB, cached in `.cache/`), filters to your jurisdiction, and caches the result. About 30 available: Arkansas, California, Colorado, Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kentucky, Maine, Maryland, Massachusetts, Mississippi, New Jersey, New York, North Dakota, Oklahoma, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Virginia, Washington D.C., Wisconsin, Wyoming.

Names are case-sensitive and exact — `pbl standards list` shows them.

Then set `jurisdiction: Texas` in the profile.

---

## Non-US frameworks

The Knowledge Graph is US-focused. For England's National Curriculum, the IB, the Australian Curriculum, or any national framework:

1. Set `jurisdiction` in the profile to a free-text label — `"England (National Curriculum)"`.
2. Enter codes manually, **from your own framework documents**.

`pbl profile check` skips code resolution for jurisdictions it doesn't have, so this works without warnings.

**Never let an agent generate codes for a framework we don't ship.** LLMs produce extremely plausible fake standards codes. Use `TBD` and look them up yourself.

---

## Never invent a code

`pbl profile check` **fails** — not warns — on a code that doesn't resolve.

That's deliberate. An invented code that looks real is worse than no code: it looks authoritative, it goes into a plan, and nobody ever checks it. A real one is thirty seconds away via search.

**`TBD` is the honest option.** Fill in the `text` field with what the learner must be able to do, set `code: TBD`, and confirm it against your framework before you launch. `profile check` warns on TBD rather than failing.

---

## Using standards well

### `status` drives the milestone

Each target carries `not-started`, `developing`, or `secure`, and it changes what the project does:

| Status | What the project does |
|---|---|
| `not-started` | Direct instruction, then application |
| `developing` | Application and critique — they can do it, they can't do it well yet |
| `secure` | **Leverage, don't reteach.** This is what makes the project possible. |

`pbl review` warns if every standard is already `secure`, because then the project has no academic stretch.

### Two to four standards, not twelve

A project that touches twelve standards teaches none of them properly. Two to four is right for a four-to-six week project.

The test: for each standard, can you name what provides evidence for it? That's the `assessed_by` field. If you can't fill it in, the standard isn't really in the project.

### Criteria come from the standards

The point of alignment isn't a compliance checkbox — it's that the standard answers *"what makes this product good?"*

> Standard: *generate and compare multiple solutions…*
> Criterion: *all three tested designs appear, including the two that lost*

Not "the poster is neat and colourful."

**The test:** could the learner meet every criterion and still not have learned the standard? Then the criteria are wrong.

### Choose standards before the activity

You can always find a standard that sort of fits something you already designed. That isn't alignment, and the resulting project teaches whatever the activity happened to teach.

---

## Homeschool settings and standards

Two common positions, both partly wrong.

**"Standards are irrelevant to us."** Maybe legally. But they're a well-tested map of what tends to come before what, built by people who watched a lot of children learn. Ignoring them means rebuilding the sequence yourself, and the most common result is gaps nobody notices for two years.

**"Standards are a checklist to tick."** Then they generate coverage, and coverage is the thing PBL exists to replace.

The useful middle: **use them to define quality, not to define scope.** Pick two to four that this project genuinely serves, derive the product criteria from them, and ignore the rest until the next project.

---

## Record shape

```jsonc
{
  "code": "4-ESS2-1",
  "framework": "NGSS",
  "jurisdiction": "Multi-State",
  "subject": "Science",
  "grades": ["4"],
  "text": "Make observations and/or measurements to provide evidence of…",
  "type": "Standard",
  "language": "en-US",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "attribution": "Knowledge Graph is provided by Learning Commons under…",
  "source_id": "…"
}
```

**Keep `license` and `attribution` on any record you redistribute.** That's the condition under which this data can ship at all. CI verifies it.

**One quirk:** CCSS Math text contains LaTeX (`$\frac{a}{b}$`) because the upstream source does. It's mathematically precise and slightly ugly in a terminal. We left it rather than mangling the notation.

---

## The live alternative

Learning Commons also offers a REST API and an **MCP server** (`kg.mcp.learningcommons.org`), both API-key gated. They're more complete and more current, and they include learning progressions we don't ship.

If you have a key, configure the MCP server and an agent will prefer it — see [`CLAUDE.md`](../CLAUDE.md). The bundled slice is the offline fallback, and it exists so PBL Builder works with no account, no key, and no network.

---

**Next:** [Glossary](glossary.md) →

---

*Standards data: Learning Commons Knowledge Graph, CC BY 4.0. See [PROVENANCE.md](../framework/standards/PROVENANCE.md) and [NOTICE.md](../NOTICE.md).*
