# Attribution and provenance

PBL Builder stands on two bodies of work that are licensed differently and therefore handled differently. This file records exactly what came from where.

---

## 1. The PBL framework — PBLWorks / Buck Institute for Education

**Cited, never copied.**

The pedagogical framework this repo operationalizes is the work of [PBLWorks](https://www.pblworks.org/), the Buck Institute for Education:

- **Gold Standard PBL** and its three components
- The seven **Essential Project Design Elements**
- The seven **Project Based Teaching Practices**
- The four-phase **Project Path**
- The five **Success Skills**: collaboration, critical thinking, creativity, complex communication, self-directed learning
- The body of classroom strategy guidance the `docs/10-strategies/` files describe

Their research, field-testing, and practitioner work is what makes any of this function. PBL Builder is an independent open-source project and is **not affiliated with, endorsed by, or reviewed by PBLWorks.**

### What we did and did not reproduce

PBLWorks resources are published under restrictive terms (typically CC BY-NC-ND). Naming and describing their framework is nominative reference and is fair; redistributing their text is not. So:

**Every word in this repository is originally written.** We did not reproduce:

- Rubric performance-level language from the Project Design Rubric, the Project Based Teaching Rubric, or any Success Skills Rubric
- Checklist wording from the Essential Project Design Elements Checklist
- Text from any Strategy Guide, Product Toolkit, or Project Planner
- Any PDF, document, or file from a PBLWorks distribution

The rubrics in [`rubrics/`](rubrics/) are **our own descriptors**, written to align with PBLWorks' skill definitions. Each rubric file states this in its header and points to the official version.

**For the official documents, go to [pblworks.org/resources](https://www.pblworks.org/resources).** They are better than ours, they are free, and PBLWorks deserves the traffic. If you are doing this work seriously, get them.

### Other scholarship referenced

- Larmer, J. & Mergendoller, J. — *Project Based Learning: The Main Course, Not Dessert*
- Lenz, B., Wells, J. & Kingston, S. — *Transforming Schools Using Project-Based Learning, Performance Assessment, and Common Core Standards*
- Berger, R. — *An Ethic of Excellence*; the "Austin's Butterfly" critique demonstration
- Facione, P. (1990) — Delphi Report definition of critical thinking
- Plucker, J., Beghetto, R. & Dow, G. — definition of creativity as novel *and* useful
- Dewey, J. — on reflection as the mechanism of learning from experience
- **Project Zero**, Harvard Graduate School of Education — Thinking Routines. See [pz.harvard.edu/thinking-routines](https://pz.harvard.edu/thinking-routines) for the routines themselves; we describe when to use them and link out.

---

## 2. Academic standards — Learning Commons Knowledge Graph

**Redistributed under CC BY 4.0.**

The standards data in [`framework/standards/`](framework/standards/) is a curated subset of the [Learning Commons Knowledge Graph](https://github.com/learning-commons-org/knowledge-graph), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

> Knowledge Graph is provided by Learning Commons under the CC BY 4.0 license. Learning Commons received state standards and written permission under CC BY 4.0 from 1EdTech; learning components under CC BY 4.0 from Achievement Network; and learning progressions under CC0 from Student Achievement Partners.

The upstream attribution chain, per record, is preserved in the `attributionStatement` and `license` fields of every JSONL row — we did not strip them, and you shouldn't either. Individual state standards carry their own issuing-agency attribution within that field.

Source version, exact filter predicate, row counts, and reproduction instructions are in [`framework/standards/PROVENANCE.md`](framework/standards/PROVENANCE.md).

Learning Commons is not affiliated with this project and has not reviewed it.

---

## 3. Related open-source projects

PBL Builder is designed to sit alongside, not compete with:

- [learning-commons-org/agent-skills](https://github.com/learning-commons-org/agent-skills) (Apache-2.0) — lesson planning and differentiation skills, co-developed with Anthropic. Covers individual lessons; we cover multi-week projects.
- [anthropics/k12-teacher-skills](https://github.com/anthropics/k12-teacher-skills) — K-12 teacher workflows.

We adopted the open agent-skills format specifically so all three install together.

---

## 4. This repository

- Code in `tools/` — MIT, see [`LICENSE`](LICENSE)
- Documentation, templates, rubrics, prompts, and examples — CC BY-NC-SA 4.0, see [`LICENSE-CONTENT`](LICENSE-CONTENT)
- Standards data in `framework/standards/` — CC BY 4.0, as above

The example learners (Maya, Devon, Amara) are invented. They are not real children, and no real learner data appears anywhere in this repository.

---

## Corrections

If you believe something here misattributes your work, misrepresents a framework, or reproduces text it shouldn't, please [open an issue](https://github.com/OWNER/pbl-builder/issues/new/choose) with the specifics. We'll fix it promptly — getting attribution right matters more to us than any individual file.
