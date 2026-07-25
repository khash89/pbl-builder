/**
 * Standards lookup over the curated Knowledge Graph slice.
 *
 * Loads JSONL from framework/standards/<jurisdiction>/ and from the on-demand
 * cache in .cache/standards/. Everything is in memory — the bundled slice is
 * 2,570 records, so an index is unnecessary complexity.
 *
 * Data: Learning Commons Knowledge Graph, CC BY 4.0.
 * See framework/standards/PROVENANCE.md.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { PblError, findRepoRoot, readFrameworkYaml, repoPath } from './repo.mjs';

const loaded = new Map();

/** Normalize a jurisdiction name to its directory name. */
export function jurisdictionDir(jurisdiction) {
  return String(jurisdiction).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Directories to search for a jurisdiction: bundled first, then the sync cache. */
function candidateDirs(jurisdiction) {
  const dir = jurisdictionDir(jurisdiction);
  return [repoPath('framework', 'standards', dir), path.join(findRepoRoot(), '.cache', 'standards', dir)];
}

/**
 * Load every record for a jurisdiction.
 * @returns {object[]} empty array if the jurisdiction isn't available locally
 */
export function loadJurisdiction(jurisdiction = 'Multi-State') {
  const key = jurisdictionDir(jurisdiction);
  if (loaded.has(key)) return loaded.get(key);

  const records = [];
  for (const dir of candidateDirs(jurisdiction)) {
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.jsonl'))) {
      const text = readFileSync(path.join(dir, file), 'utf8');
      for (const line of text.split('\n')) {
        if (!line.trim()) continue;
        try {
          records.push(JSON.parse(line));
        } catch {
          // A single corrupt line shouldn't take down a lookup. Skip it.
        }
      }
    }
    if (records.length) break; // bundled wins over cache
  }

  loaded.set(key, records);
  return records;
}

/** Is a jurisdiction available locally? */
export function hasJurisdiction(jurisdiction) {
  return loadJurisdiction(jurisdiction).length > 0;
}

/** Jurisdictions present on disk, bundled or cached. */
export function localJurisdictions() {
  const index = readFrameworkYaml(path.join('standards', 'index.yaml'));
  const bundled = (index.jurisdictions ?? []).map((j) => j.name);

  const cacheDir = path.join(findRepoRoot(), '.cache', 'standards');
  const cached = existsSync(cacheDir)
    ? readdirSync(cacheDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];

  return { bundled, cached };
}

/**
 * Resolve one code. Case- and separator-insensitive, because people type
 * `4.nf.a.1`, `4-NF-A-1`, and `CCSS.MATH.4.NF.A.1` for the same standard.
 */
export function resolveCode(code, jurisdiction = 'Multi-State') {
  if (!code) return null;
  const wanted = normalizeCode(code);
  const records = loadJurisdiction(jurisdiction);

  return (
    records.find((r) => normalizeCode(r.code) === wanted) ??
    // Tolerate a framework prefix the user included and the data doesn't.
    records.find((r) => wanted.endsWith(normalizeCode(r.code)) && normalizeCode(r.code).length > 4) ??
    null
  );
}

export function normalizeCode(code) {
  return String(code).toUpperCase().replace(/[\s._-]+/g, '');
}

/**
 * Free-text search over standard text and codes.
 *
 * Scoring is deliberately simple: an exact code match wins, then a code
 * substring, then term hits in the text. Good enough to find the right
 * standard in a 2,570-row set, and it has no dependencies.
 */
export function search(query, { jurisdiction = 'Multi-State', grade, subject, framework, limit = 20 } = {}) {
  const records = loadJurisdiction(jurisdiction);
  if (!records.length) {
    throw new PblError(
      `No standards available locally for jurisdiction '${jurisdiction}'.`,
      `Try --jurisdiction "Multi-State", or fetch it with: pbl standards sync --jurisdiction "${jurisdiction}"`,
    );
  }

  const terms = String(query ?? '')
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2);
  const normalizedQuery = normalizeCode(query ?? '');

  const scored = [];

  for (const record of records) {
    if (grade && !record.grades.includes(String(grade))) continue;
    if (subject && record.subject.toLowerCase() !== String(subject).toLowerCase()) continue;
    if (framework && record.framework.toLowerCase() !== String(framework).toLowerCase()) continue;

    let score = 0;
    const codeNorm = normalizeCode(record.code);
    if (normalizedQuery && codeNorm === normalizedQuery) score += 1000;
    else if (normalizedQuery.length >= 3 && codeNorm.includes(normalizedQuery)) score += 200;

    if (terms.length) {
      const haystack = record.text.toLowerCase();
      for (const term of terms) {
        if (haystack.includes(term)) score += 10;
        // Whole-word hits are stronger signal than substring hits.
        if (new RegExp(`\\b${escapeRegExp(term)}\\b`).test(haystack)) score += 5;
      }
    } else if (!normalizedQuery) {
      score += 1; // no query at all: filters only, keep everything
    }

    if (score > 0) scored.push({ record, score });
  }

  scored.sort((a, b) => b.score - a.score || a.record.code.localeCompare(b.record.code));
  return scored.slice(0, limit).map((s) => s.record);
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check the codes in a profile's standards_targets.
 *
 * Returns unresolved codes so the caller can FAIL rather than warn. An invented
 * code that looks real is worse than no code — it looks authoritative and
 * nobody checks it.
 *
 * `TBD` is the honest escape hatch and passes. For a jurisdiction we don't have
 * locally we skip resolution entirely, since we have nothing to check against
 * and refusing would block every non-US framework.
 */
export function checkCodes(targets = [], jurisdiction = 'Multi-State') {
  const available = hasJurisdiction(jurisdiction);
  const results = { available, jurisdiction, resolved: [], unresolved: [], tbd: [], skipped: !available };

  for (const target of targets) {
    const code = target?.code;
    if (!code) continue;

    if (String(code).trim().toUpperCase() === 'TBD') {
      results.tbd.push(target);
      continue;
    }
    if (!available) continue;

    const found = resolveCode(code, jurisdiction);
    if (found) results.resolved.push({ target, record: found });
    else results.unresolved.push(target);
  }

  return results;
}
