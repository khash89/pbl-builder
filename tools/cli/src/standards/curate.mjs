/**
 * Curate a standards slice from the Learning Commons Knowledge Graph.
 *
 * The upstream export is ~292 MB of graph nodes covering many node types and
 * 25+ jurisdictions. This script streams it, keeps only the academic standards
 * we can use, trims each record to the fields the PBL Builder schemas need, and
 * writes one JSONL file per subject.
 *
 * CRITICAL: `license` and `attribution` are preserved on every record. That is
 * the condition under which the CC BY 4.0 data can be redistributed at all.
 * Do not "optimise" them away.
 *
 * Usage:
 *   node curate.mjs --input nodes.jsonl --out ../../framework/standards \
 *                   --jurisdiction "Multi-State"
 *
 * Download the source export first (see PROVENANCE.md for the current URL):
 *   curl -L "https://cdn.learningcommons.org/knowledge-graph/v1.11.0/exports/nodes.jsonl" -o nodes.jsonl
 *
 * Data source: https://github.com/learning-commons-org/knowledge-graph (CC BY 4.0)
 */

import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const KG_VERSION = 'v1.11.0';
export const KG_EXPORT_URL = `https://cdn.learningcommons.org/knowledge-graph/${KG_VERSION}/exports/nodes.jsonl`;

/** Subject name -> output filename stem. Anything not listed is skipped. */
export const SUBJECT_FILES = {
  Mathematics: 'math',
  'English Language Arts': 'ela',
  Science: 'science',
  'Social Studies': 'social-studies',
};

/**
 * Statement types we keep: only `Standard` — an actual standard you would cite
 * as a learning goal.
 *
 * We deliberately drop `Standard Grouping`, `Course`, and `Other`. They are
 * structural containers in the source graph, and in practice their descriptions
 * are placeholders like "Grades 3-5" or "Grade 5" rather than anything a
 * teacher could target. Keeping them made `pbl standards search` noticeably
 * worse.
 */
export const KEPT_TYPES = new Set(['Standard']);

/**
 * Infer the framework label from the attribution statement.
 *
 * The source data has no framework field, but the attribution text names the
 * publisher, which is what a teacher actually recognises ("NGSS", "CCSS.MATH").
 * Order matters: NGSS and C3 are checked before the generic CCSS fallbacks.
 */
export function inferFramework(record) {
  const attribution = record.attributionStatement ?? '';
  const subject = record.academicSubject ?? '';
  const code = record.statementCode ?? '';

  if (/NGSS|Next Generation Science/i.test(attribution)) return 'NGSS';
  // Upstream phrasing is "C3 Social Studies standards provided by ...", so match
  // the bare token rather than the full framework title.
  if (/\bC3\b|College, Career, and Civic Life/i.test(attribution)) return 'C3';

  // WIDA language-development standards. Attribution credits the Wisconsin
  // Board of Regents (WIDA's host), which is unrecognisable as a framework
  // name. The Spanish-language set (DALE) is a distinct framework, not a
  // translation of the English one, so label the two separately.
  if (/\bWIDA\b/i.test(attribution)) {
    return /^DALE/i.test(code) || record.inLanguage?.startsWith('es') ? 'WIDA-DALE' : 'WIDA';
  }

  if (/Common Core|CCSS/i.test(attribution)) {
    if (subject === 'Mathematics') return 'CCSS.MATH';
    if (subject === 'English Language Arts') return 'CCSS.ELA-LITERACY';
  }

  // Code-shape fallbacks for records whose attribution is less explicit.
  if (/^(CCSS\.)?(MATH|Math)/.test(code)) return 'CCSS.MATH';
  if (/^(CCSS\.)?ELA/i.test(code)) return 'CCSS.ELA-LITERACY';
  if (/^[K\d]+-[A-Z]{2,4}\d/.test(code)) return 'NGSS';

  // Otherwise name the issuing agency, which is genuinely the framework here.
  return record.author || record.jurisdiction || 'Unspecified';
}

/**
 * Sort key for a grade label. `localeCompare(..., {numeric:true})` puts "K"
 * after "12", which is wrong everywhere a human reads it.
 */
export function gradeRank(grade) {
  const g = String(grade).toLowerCase();
  if (g === 'pre-k' || g === 'pk') return -1;
  if (g === 'k') return 0;
  const n = Number.parseInt(g, 10);
  return Number.isNaN(n) ? 99 : n;
}

export const byGrade = (a, b) => gradeRank(a) - gradeRank(b);

/** `gradeLevel` arrives as a JSON-encoded string array. Normalise it. */
export function parseGrades(raw) {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw !== 'string') return [];
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return [];
    }
  }
  return raw ? [raw] : [];
}

/**
 * Trim an upstream node to a PBL Builder standards record.
 * Returns null if the node isn't a usable standard.
 */
export function toRecord(node) {
  if (!node || node.type !== 'node') return null;
  if (!Array.isArray(node.labels) || !node.labels.includes('StandardsFrameworkItem')) return null;

  const p = node.properties ?? {};
  if (!p.statementCode) return null;                       // no code = not citable
  if (!KEPT_TYPES.has(p.normalizedStatementType)) return null;
  if (p.isCurrent === 'false') return null;                // superseded
  if (!SUBJECT_FILES[p.academicSubject]) return null;

  // The source wraps long descriptions with hard newlines mid-sentence.
  // Collapse them so the text is usable in a one-line search result.
  const text = (p.description ?? '').replace(/\s+/g, ' ').trim();
  if (text.length < 10) return null;                       // container node with a stub description

  return {
    code: p.statementCode,
    framework: inferFramework(p),
    jurisdiction: p.jurisdiction ?? 'Unspecified',
    subject: p.academicSubject,
    grades: parseGrades(p.gradeLevel),
    text,
    type: p.normalizedStatementType,
    // Not every record is English — the WIDA DALE set is Spanish. Consumers
    // need to be able to filter.
    language: p.inLanguage ?? 'en-US',
    // Provenance — required for redistribution. Never strip these.
    license: p.license ?? 'https://creativecommons.org/licenses/by/4.0/',
    attribution: p.attributionStatement ?? '',
    source_id: p.caseIdentifierUUID ?? node.identifier,
  };
}

/**
 * Stream the export and collect matching records grouped by subject file stem.
 * @returns {Promise<{bySubject: Map<string, object[]>, stats: object}>}
 */
export async function curate({ input, jurisdiction, onProgress } = {}) {
  const bySubject = new Map();
  const stats = { linesRead: 0, kept: 0, skipped: 0, malformed: 0, byFramework: {} };

  const rl = createInterface({
    input: createReadStream(input, { encoding: 'utf8' }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    stats.linesRead += 1;

    let node;
    try {
      node = JSON.parse(line);
    } catch {
      stats.malformed += 1;
      continue;
    }

    const record = toRecord(node);
    if (!record) {
      stats.skipped += 1;
      continue;
    }
    if (jurisdiction && record.jurisdiction !== jurisdiction) {
      stats.skipped += 1;
      continue;
    }

    const stem = SUBJECT_FILES[record.subject];
    if (!bySubject.has(stem)) bySubject.set(stem, []);
    bySubject.get(stem).push(record);
    stats.kept += 1;
    stats.byFramework[record.framework] = (stats.byFramework[record.framework] ?? 0) + 1;

    if (onProgress && stats.linesRead % 50_000 === 0) onProgress(stats);
  }

  // Stable, human-diffable ordering so regenerating produces a clean git diff.
  for (const records of bySubject.values()) {
    records.sort(
      (a, b) =>
        gradeRank(a.grades[0] ?? '') - gradeRank(b.grades[0] ?? '') ||
        a.code.localeCompare(b.code, undefined, { numeric: true }),
    );
  }

  return { bySubject, stats };
}

/** Write each subject's records as JSONL. Returns per-file byte and row counts. */
export async function writeSlice({ bySubject, outDir }) {
  await mkdir(outDir, { recursive: true });
  const written = [];

  for (const [stem, records] of [...bySubject.entries()].sort()) {
    const file = path.join(outDir, `${stem}.jsonl`);
    const body = records.map((r) => JSON.stringify(r)).join('\n') + '\n';
    await writeFile(file, body, 'utf8');
    written.push({
      file: `${stem}.jsonl`,
      rows: records.length,
      bytes: Buffer.byteLength(body, 'utf8'),
      grades: [...new Set(records.flatMap((r) => r.grades))].sort(byGrade),
      frameworks: [...new Set(records.map((r) => r.framework))].sort(),
    });
  }

  return written;
}

// ── CLI entry point ──────────────────────────────────────────────────
function parseArgs(argv) {
  const args = { input: 'nodes.jsonl', out: '.', jurisdiction: 'Multi-State' };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, '');
    if (key && key in args) args[key] = argv[i + 1];
  }
  return args;
}

// pathToFileURL, not string concatenation — repo paths may contain spaces,
// which import.meta.url percent-encodes and a raw `file://${argv[1]}` does not.
const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const args = parseArgs(process.argv.slice(2));
  console.error(`Curating ${args.jurisdiction} standards from ${args.input}…`);

  const { bySubject, stats } = await curate({
    input: args.input,
    jurisdiction: args.jurisdiction,
    onProgress: (s) => process.stderr.write(`\r  ${s.linesRead} lines, ${s.kept} kept`),
  });
  process.stderr.write('\n');

  const written = await writeSlice({ bySubject, outDir: args.out });

  console.log(
    JSON.stringify(
      {
        kg_version: KG_VERSION,
        jurisdiction: args.jurisdiction,
        stats,
        files: written,
        total_rows: written.reduce((n, f) => n + f.rows, 0),
        total_bytes: written.reduce((n, f) => n + f.bytes, 0),
      },
      null,
      2,
    ),
  );
}
