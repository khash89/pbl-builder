/**
 * Render the human-readable success-skill rubrics from framework/success-skills/*.yaml.
 *
 * The YAML is the single source of truth. These Markdown files exist because a
 * parent needs something they can print and put on the table, and because the
 * learner is supposed to self-assess against them — neither of which works with
 * a YAML file.
 *
 * Generating rather than hand-writing means the two can't drift. A test asserts
 * the committed files match what this produces.
 *
 *   node src/render-rubrics.mjs          # write the files
 *   node src/render-rubrics.mjs --check  # verify they're current (used by tests/CI)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFrameworkYaml, repoPath } from './lib/repo.mjs';

const SKILLS = [
  'critical-thinking',
  'complex-communication',
  'creativity',
  'self-directed-learning',
  'collaboration',
];

const LEVELS = ['beginning', 'emerging', 'developing', 'demonstrating'];

/** Collapse to a single line. For table cells only. */
const cell = (text) => String(text ?? '').replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');

/**
 * Normalise a prose block, preserving paragraph breaks and list items.
 *
 * YAML folded scalars (`>`) join wrapped lines, so a paragraph arrives as one
 * long line and a blank line arrives as `\n`. Literal blocks (`|`) keep every
 * newline. Either way we want: paragraphs separated by blank lines, list items
 * on their own line, and no stray hard wrapping inside a paragraph.
 *
 * @returns {string[]} lines ready to emit
 */
function prose(text) {
  const lines = [];
  for (const block of String(text ?? '').trim().split(/\n\s*\n/)) {
    const isList = /^\s*[-*]\s/m.test(block);
    if (isList) {
      // Re-join wrapped continuation lines onto their bullet.
      const items = [];
      for (const line of block.split('\n')) {
        if (/^\s*[-*]\s/.test(line)) items.push(line.trim());
        else if (items.length) items[items.length - 1] += ` ${line.trim()}`;
        else items.push(line.trim());
      }
      lines.push(...items, '');
    } else {
      lines.push(block.replace(/\s+/g, ' ').trim(), '');
    }
  }
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

export function render(skill) {
  const data = readFrameworkYaml(path.join('success-skills', `${skill}.yaml`));
  const out = [];

  out.push(`# ${data.name}`);
  out.push('');
  out.push(`> ${cell(data.definition)}`);
  out.push('');
  out.push(
    '**Pick one or two dimensions from this rubric — not all of them.** Everything you ' +
      'do not name is explicitly out of scope for this project, and saying so out loud is ' +
      'part of keeping the focus real.',
  );
  out.push('');

  if (data.solo_warning) {
    out.push('---');
    out.push('');
    out.push('> ### ⚠ Before targeting this skill with one learner');
    out.push('>');
    for (const line of prose(data.solo_warning)) out.push(line ? `> ${line}` : '>');
    out.push('');
  }

  if (data.solo_note) {
    out.push('---');
    out.push('');
    out.push('## With one learner');
    out.push('');
    out.push(...prose(data.solo_note));
    out.push('');
  }

  if (data.misconception_warning) {
    out.push('---');
    out.push('');
    out.push('## A common misreading');
    out.push('');
    out.push(...prose(data.misconception_warning));
    out.push('');
  }

  out.push('---');
  out.push('');
  out.push('## The dimensions');
  out.push('');
  out.push('| id | Dimension | The question it answers |');
  out.push('|---|---|---|');
  for (const d of data.dimensions) {
    out.push(`| \`${d.id}\` | ${cell(d.name)} | ${cell(d.question)} |`);
  }
  out.push('');

  for (const d of data.dimensions) {
    out.push('---');
    out.push('');
    out.push(`## ${d.name}`);
    out.push('');
    out.push(`\`${d.id}\` — *${cell(d.question)}*`);
    out.push('');
    out.push('| Level | What it looks like |');
    out.push('|---|---|');
    for (const level of LEVELS) {
      const label = level.charAt(0).toUpperCase() + level.slice(1);
      out.push(`| **${label}** | ${cell(d.levels?.[level])} |`);
    }
    out.push('');

    if (d.teach_by?.length) {
      out.push('**How to teach it**');
      out.push('');
      for (const item of d.teach_by) out.push(`- ${cell(item)}`);
      out.push('');
    }
    if (d.look_for) {
      out.push(`**What tells you it's working:** ${cell(d.look_for)}`);
      out.push('');
    }
    if (d.note) {
      out.push(`**Note:** ${cell(d.note)}`);
      out.push('');
    }
  }

  const notes = data.project_design_notes;
  if (notes) {
    out.push('---');
    out.push('');
    out.push('## What the project has to supply');
    out.push('');
    out.push('This skill cannot grow without these. If the project does not provide them,');
    out.push('change the project or change the skill.');
    out.push('');
    for (const item of notes.needs_from_project ?? []) out.push(`- ${cell(item)}`);
    out.push('');

    if (notes.pairs_well_with_products?.length) {
      out.push(
        `**Products that suit it:** ${notes.pairs_well_with_products.map((p) => `\`${p}\``).join(', ')} — see [product-types.yaml](../../framework/product-types.yaml).`,
      );
      out.push('');
    }
    if (notes.weak_pairing_warning) {
      out.push(`**Where it goes wrong:** ${cell(notes.weak_pairing_warning)}`);
      out.push('');
    }
  }

  out.push('---');
  out.push('');
  out.push('## Using it');
  out.push('');
  out.push('- **The learner self-assesses first**, in their own words, before you say anything.');
  out.push('  The gap between their judgement and yours is the most useful data in the project.');
  out.push('- **Same task, twice** — first week and last week, on the same prompt, so the');
  out.push('  comparison means something. Show them both.');
  out.push('- **One level of growth in a project is a real result.** Two is a lot.');
  out.push('- **Assess it separately from the content.** A learner can produce an excellent');
  out.push('  product with weak skill, and the reverse.');
  out.push('');
  out.push('→ [docs/08-success-skills.md](../../docs/08-success-skills.md) · [docs/09-assessment.md](../../docs/09-assessment.md)');
  out.push('');

  if (data.research_note) {
    out.push('---');
    out.push('');
    out.push(`*Research basis: ${cell(data.research_note)}*`);
    out.push('');
  }

  out.push('---');
  out.push('');
  out.push(
    `*A PBL Builder rubric aligned to the PBLWorks success skill of the same name. ` +
      `The dimension structure and all performance descriptors above are original writing — ` +
      `they are not PBLWorks rubric language. For the official rubrics see ` +
      `[pblworks.org/resources](https://www.pblworks.org/resources). See [NOTICE.md](../../NOTICE.md).*`,
  );
  out.push('');
  out.push(
    `<!-- Generated from framework/success-skills/${skill}.yaml by tools/cli/src/render-rubrics.mjs. Edit the YAML, not this file. -->`,
  );
  out.push('');

  return out.join('\n');
}


export function targetPath(skill) {
  return repoPath('rubrics', 'success-skills', `${skill}.md`);
}

/** @returns {string[]} skills whose committed file is out of date */
export function checkAll() {
  const stale = [];
  for (const skill of SKILLS) {
    let current = null;
    try {
      current = readFileSync(targetPath(skill), 'utf8');
    } catch {
      stale.push(skill);
      continue;
    }
    if (current !== render(skill)) stale.push(skill);
  }
  return stale;
}

export function writeAll() {
  const written = [];
  for (const skill of SKILLS) {
    writeFileSync(targetPath(skill), render(skill), 'utf8');
    written.push(skill);
  }
  return written;
}

export { SKILLS };

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--check')) {
    const stale = checkAll();
    if (stale.length) {
      console.error(`Out of date: ${stale.join(', ')}`);
      console.error('Run: node tools/cli/src/render-rubrics.mjs');
      process.exit(1);
    }
    console.log('All success-skill rubrics are current.');
  } else {
    for (const skill of writeAll()) console.log(`wrote rubrics/success-skills/${skill}.md`);
  }
}
