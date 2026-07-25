/**
 * Locating the repo, reading framework data, and parsing frontmatter.
 *
 * Everything else in the CLI goes through here so there is exactly one
 * definition of "where is the repo root" and one frontmatter parser.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Find the repo root by walking up looking for the marker directories.
 *
 * We check for framework/ AND schema/ together, so an unrelated parent
 * directory that happens to contain a `schema` folder can't win.
 *
 * Falls back to the packaged location (four levels up from src/lib) so the
 * CLI still works when installed via npx outside a checkout.
 */
export function findRepoRoot(startDir = process.cwd()) {
  let dir = path.resolve(startDir);

  while (true) {
    if (existsSync(path.join(dir, 'framework')) && existsSync(path.join(dir, 'schema'))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  const packaged = path.resolve(here, '..', '..', '..', '..');
  if (existsSync(path.join(packaged, 'framework'))) return packaged;

  throw new PblError(
    'Could not find the PBL Builder repo root.',
    'Run this from inside a pbl-builder checkout, or pass an explicit file path.',
  );
}

/** An error with a suggested next step. Printed without a stack trace. */
export class PblError extends Error {
  constructor(message, hint) {
    super(message);
    this.name = 'PblError';
    this.hint = hint;
  }
}

export function repoPath(...parts) {
  return path.join(findRepoRoot(), ...parts);
}

/**
 * Split a Markdown file into YAML frontmatter and body.
 *
 * The delimiter must be `---` on its own line at the very start of the file.
 * We deliberately do not support alternative delimiters — one format, no
 * ambiguity.
 */
export function splitFrontmatter(source) {
  const normalized = source.replace(/^﻿/, '');           // strip BOM
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(normalized);
  if (!match) return { frontmatter: null, body: normalized, raw: null };
  return { frontmatter: match[1], body: match[2], raw: match[1] };
}

/**
 * Read a Markdown file and parse its frontmatter.
 * @returns {{data: object, body: string, filePath: string}}
 */
export function readDoc(filePath) {
  const resolved = path.resolve(filePath);
  if (!existsSync(resolved)) {
    throw new PblError(`File not found: ${filePath}`, 'Check the path, or run `pbl profile new <name>` first.');
  }

  const source = readFileSync(resolved, 'utf8');
  const { frontmatter, body } = splitFrontmatter(source);

  if (frontmatter === null) {
    throw new PblError(
      `No YAML frontmatter in ${path.basename(resolved)}.`,
      'The file must begin with `---` on line 1, then YAML, then `---`.',
    );
  }

  let data;
  try {
    data = parseYaml(frontmatter);
  } catch (error) {
    throw new PblError(
      `Invalid YAML in ${path.basename(resolved)}: ${error.message}`,
      'Common causes: a tab character (YAML requires spaces), or an unquoted value containing a colon.',
    );
  }

  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new PblError(
      `Frontmatter in ${path.basename(resolved)} is not a YAML mapping.`,
      'It should be a set of `key: value` pairs.',
    );
  }

  return { data, body, filePath: resolved };
}

/** Read and parse a YAML file from the repo. Cached — these never change mid-run. */
const yamlCache = new Map();

export function readFrameworkYaml(relPath) {
  const full = repoPath('framework', relPath);
  if (yamlCache.has(full)) return yamlCache.get(full);

  if (!existsSync(full)) {
    throw new PblError(`Framework file missing: framework/${relPath}`, 'Is this a complete checkout?');
  }
  const parsed = parseYaml(readFileSync(full, 'utf8'));
  yamlCache.set(full, parsed);
  return parsed;
}

export function readJson(absPath) {
  return JSON.parse(readFileSync(absPath, 'utf8'));
}

/**
 * Placeholder detection.
 *
 * The templates are full of `[bracketed instructions]`. A plan that still
 * contains them isn't finished, and every check downstream would produce
 * nonsense findings about text that was never meant to be real. So we detect
 * them once, centrally.
 *
 * Deliberately narrow to avoid false positives on legitimate prose:
 *   - "[Write the question here]"  → placeholder
 *   - "TBD"                       → placeholder (except a standards code, handled separately)
 *   - "grades [3-5] combined"     → NOT a placeholder (no leading capital / verb-ish start)
 */
const PLACEHOLDER_PATTERNS = [
  /\[[^\]]{4,}\]/,                    // any bracketed span of 4+ chars
  /^\s*(TBD|TODO|FIXME|XXX)\s*$/i,
  /\byour (question|framework)\b/i,
  /\bone of the five\b/i,
];

export function isPlaceholder(value) {
  if (value == null) return false;
  if (typeof value === 'number' || typeof value === 'boolean') return false;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return PLACEHOLDER_PATTERNS.some((re) => re.test(trimmed));
}

/**
 * Walk a value tree and collect dotted paths whose leaves are placeholders.
 * Used by `validate` to tell the user exactly which fields still need filling.
 */
export function findPlaceholders(value, trail = '', found = []) {
  if (Array.isArray(value)) {
    value.forEach((item, i) => findPlaceholders(item, `${trail}[${i}]`, found));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      findPlaceholders(child, trail ? `${trail}.${key}` : key, found);
    }
  } else if (isPlaceholder(value)) {
    found.push({ path: trail, value: String(value).trim() });
  }
  return found;
}

/** kebab-case a display name for use as a folder name. */
export function slugify(name) {
  return String(name)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'learner';
}
