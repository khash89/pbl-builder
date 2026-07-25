/**
 * Repo-wide integrity: relative links resolve, and the standards data keeps its
 * attribution.
 *
 * A broken link in a docs repo is a real defect — the docs ARE the product — and
 * they rot silently as files move. The attribution check exists because
 * redistributing the standards data is only permitted while the per-record
 * attribution survives.
 */

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { findRepoRoot, repoPath } from '../src/index.mjs';

const ROOT = findRepoRoot();

const SKIP_DIRS = new Set(['node_modules', '.git', '.cache', 'dist', 'learners']);

function walk(dir, ext, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.github') continue;
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, found);
    else if (entry.name.endsWith(ext)) found.push(full);
  }
  return found;
}

/** Markdown inline links, excluding images and fenced code. */
function linksIn(source) {
  const withoutCode = source
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`\n]*`/g, '');

  const links = [];
  const re = /(?<!!)\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;
  while ((match = re.exec(withoutCode)) !== null) {
    links.push({ text: match[1], target: match[2] });
  }
  return links;
}

test('every relative Markdown link resolves', () => {
  const broken = [];

  for (const file of walk(ROOT, '.md')) {
    const source = readFileSync(file, 'utf8');
    const dir = path.dirname(file);

    for (const { text, target } of linksIn(source)) {
      // External, anchors, and mailto are out of scope.
      if (/^(https?:|mailto:|#)/.test(target)) continue;

      const [pathPart] = target.split('#');
      if (!pathPart) continue;

      const resolved = path.resolve(dir, decodeURIComponent(pathPart));
      if (!existsSync(resolved)) {
        broken.push(`${path.relative(ROOT, file)} → [${text}](${target})`);
      }
    }
  }

  assert.deepEqual(broken, [], `Broken relative links:\n  ${broken.join('\n  ')}`);
});

test('framework yaml doc/rubric paths resolve', () => {
  // The YAML files cross-reference docs and rubrics via relative paths that no
  // Markdown linter would ever check.
  const broken = [];

  for (const file of walk(repoPath('framework'), '.yaml')) {
    const dir = path.dirname(file);
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const match = /^\s*(?:doc|rubric|path|template|data_template|provenance|index|field_reference|notice|see_also|doc_dir|rubric_dir)\s*:\s*(\.\.?\/[^\s#]+)/.exec(line);
      if (!match) continue;
      const resolved = path.resolve(dir, match[1]);
      if (!existsSync(resolved)) {
        broken.push(`${path.relative(ROOT, file)} → ${match[1]}`);
      }
    }
  }

  assert.deepEqual(broken, [], `Framework YAML pointing at missing files:\n  ${broken.join('\n  ')}`);
});

test('every standards record carries its license and attribution', () => {
  // This is the condition under which the CC BY 4.0 data may be redistributed.
  // If a future filter change strips these fields, this test is the backstop.
  const dir = repoPath('framework', 'standards');
  const files = walk(dir, '.jsonl');
  assert.ok(files.length > 0, 'no standards data found');

  let rows = 0;
  const bad = [];

  for (const file of files) {
    for (const [i, line] of readFileSync(file, 'utf8').split('\n').entries()) {
      if (!line.trim()) continue;
      rows += 1;
      const record = JSON.parse(line);
      if (!record.license || !record.attribution) {
        bad.push(`${path.relative(ROOT, file)}:${i + 1} ${record.code}`);
      }
      if (!record.code || !record.text || !Array.isArray(record.grades)) {
        bad.push(`${path.relative(ROOT, file)}:${i + 1} malformed record`);
      }
    }
  }

  assert.ok(rows > 2000, `expected the full bundled slice, found ${rows} rows`);
  assert.deepEqual(bad.slice(0, 10), [], `Records missing license/attribution: ${bad.length}`);
});

test('standards index row counts match the data on disk', async () => {
  const { parse } = await import('yaml');
  const index = parse(readFileSync(repoPath('framework', 'standards', 'index.yaml'), 'utf8'));

  for (const jurisdiction of index.jurisdictions ?? []) {
    for (const entry of jurisdiction.files ?? []) {
      const file = repoPath('framework', 'standards', ...entry.file.split('/'));
      const actual = readFileSync(file, 'utf8').split('\n').filter((l) => l.trim()).length;
      assert.equal(
        actual,
        entry.rows,
        `${entry.file}: index.yaml says ${entry.rows} rows, file has ${actual}. Update index.yaml.`,
      );
    }
  }
});

test('no PBLWorks source file was copied into the repo', () => {
  // The framework is cited, never redistributed. A stray PDF or a file named
  // after a PBLWorks resource is the thing to catch before it reaches a remote.
  const suspicious = [];

  for (const ext of ['.pdf', '.docx', '.doc']) {
    if (walk(ROOT, ext).length) suspicious.push(`${ext} files present`);
  }

  for (const file of walk(ROOT, '.md')) {
    const name = path.basename(file).toLowerCase();
    if (/pblworks|buck.?institute/.test(name)) {
      suspicious.push(`${path.relative(ROOT, file)} is named after a PBLWorks resource`);
    }
  }

  assert.deepEqual(
    suspicious,
    [],
    `Possible redistribution of source material — see NOTICE.md:\n  ${suspicious.join('\n  ')}`,
  );
});

test('learners/ contains nothing but its README', () => {
  // Learner data must never be committed. .gitignore covers it; this catches a
  // file added before the ignore rule, or a fork that removed it.
  const dir = repoPath('learners');
  if (!existsSync(dir)) return;

  const unexpected = readdirSync(dir).filter((name) => !['README.md', '.gitkeep'].includes(name));
  assert.deepEqual(
    unexpected,
    [],
    `learners/ should hold only README.md — found: ${unexpected.join(', ')}. ` +
      'Learner profiles must not be committed. See learners/README.md.',
  );
});
