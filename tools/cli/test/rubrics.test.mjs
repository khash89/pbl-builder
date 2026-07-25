/**
 * The success-skill rubrics are generated from framework/success-skills/*.yaml.
 * These tests keep the two from drifting, and check the rendered output is
 * actually usable rather than merely present.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { readFrameworkYaml } from '../src/index.mjs';
import { SKILLS, checkAll, render, targetPath } from '../src/render-rubrics.mjs';

test('committed success-skill rubrics match the framework YAML', () => {
  const stale = checkAll();
  assert.deepEqual(
    stale,
    [],
    `These rubrics are out of date with their YAML source: ${stale.join(', ')}\n` +
      'Run: node tools/cli/src/render-rubrics.mjs',
  );
});

test('every rubric renders all four levels for every dimension', () => {
  for (const skill of SKILLS) {
    const text = render(skill);
    const data = readFrameworkYaml(`success-skills/${skill}.yaml`);

    for (const dimension of data.dimensions) {
      assert.ok(text.includes(`\`${dimension.id}\``), `${skill}: dimension id ${dimension.id} missing`);
      for (const level of ['Beginning', 'Emerging', 'Developing', 'Demonstrating']) {
        assert.ok(
          text.includes(`**${level}**`),
          `${skill}: level ${level} missing from rendered output`,
        );
      }
    }
  }
});

test('every rubric carries the attribution disclaimer', () => {
  for (const skill of SKILLS) {
    const text = readFileSync(targetPath(skill), 'utf8');
    assert.match(
      text,
      /original writing/,
      `${skill}.md must state that the descriptors are original, not PBLWorks text`,
    );
    assert.match(text, /pblworks\.org/, `${skill}.md must point to the official rubrics`);
  }
});

test('the collaboration rubric keeps its solo warning, with the list intact', () => {
  const text = readFileSync(targetPath('collaboration'), 'utf8');
  assert.match(text, /Before targeting this skill with one learner/);
  // The warning's list must survive rendering — a folded YAML scalar would
  // collapse it into an unreadable paragraph.
  const bullets = text.split('\n').filter((line) => line.startsWith('> - '));
  assert.ok(bullets.length >= 3, `expected 3+ blockquoted list items, got ${bullets.length}`);
});

test('rendered tables have no unescaped pipes', () => {
  // A stray pipe inside a cell splits it and silently breaks the table when
  // rendered. Descriptor text is prose written by contributors, so this is a
  // realistic failure — cell() escapes pipes, and this asserts it worked.
  //
  // "| a | b |" splits on unescaped pipes into ["", " a ", " b ", ""], so the
  // real cell count is parts.length - 2. The rubrics use 2- and 3-column tables.
  for (const skill of SKILLS) {
    for (const [i, line] of render(skill).split('\n').entries()) {
      if (!line.startsWith('|')) continue;
      const cells = line.split(/(?<!\\)\|/).length - 2;
      assert.ok(
        cells === 2 || cells === 3,
        `${skill}.md line ${i + 1} has ${cells} cells (expected 2 or 3): ${line}`,
      );
    }
  }
});
