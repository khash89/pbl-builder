/**
 * Standards curation and lookup.
 *
 * The snapshot test is the important one: an accidental regeneration with
 * different filters would silently change what codes resolve for every user,
 * and existing plans would start failing `pbl profile check`.
 */

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  KG_VERSION,
  checkCodes,
  hasJurisdiction,
  jurisdictionDir,
  loadJurisdiction,
  normalizeCode,
  resolveCode,
  searchStandards,
  toRecord,
} from '../src/index.mjs';

// ── Snapshot of the committed slice ──────────────────────────────────

test('the bundled Multi-State slice matches its documented shape', () => {
  const records = loadJurisdiction('Multi-State');

  // PROVENANCE.md documents these exact figures. If curation changes, both this
  // test and that file must be updated deliberately.
  assert.equal(records.length, 2570, 'row count changed — update PROVENANCE.md and index.yaml');

  const byFramework = {};
  for (const record of records) {
    byFramework[record.framework] = (byFramework[record.framework] ?? 0) + 1;
  }

  assert.deepEqual(byFramework, {
    'CCSS.ELA-LITERACY': 1100,
    'CCSS.MATH': 597,
    C3: 300,
    'WIDA-DALE': 261,
    NGSS: 208,
    WIDA: 104,
  });

  assert.equal(KG_VERSION, 'v1.11.0', 'source version changed — see PROVENANCE.md upgrade steps');
});

test('every bundled record is a citable standard, not a container', () => {
  for (const record of loadJurisdiction('Multi-State')) {
    assert.equal(record.type, 'Standard', `${record.code} is a ${record.type}`);
    assert.ok(record.code, 'record without a code');
    assert.ok(record.text.length >= 10, `${record.code} has stub text: "${record.text}"`);
    assert.ok(record.grades.length > 0, `${record.code} has no grades`);
    // Whitespace must be normalised — the source hard-wraps mid-sentence.
    assert.ok(!/\n/.test(record.text), `${record.code} text contains a newline`);
  }
});

test('grade coverage is K-12 in every subject', () => {
  const bySubject = new Map();
  for (const record of loadJurisdiction('Multi-State')) {
    if (!bySubject.has(record.subject)) bySubject.set(record.subject, new Set());
    for (const grade of record.grades) bySubject.get(record.subject).add(grade);
  }

  assert.equal(bySubject.size, 4, 'expected four core subjects');
  for (const [subject, grades] of bySubject) {
    for (const expected of ['K', '4', '8', '12']) {
      assert.ok(grades.has(expected), `${subject} has no grade ${expected}`);
    }
  }
});

// ── Lookup behaviour ─────────────────────────────────────────────────

test('resolveCode is insensitive to case and separators', () => {
  const canonical = resolveCode('4.NF.A.1');
  assert.ok(canonical, '4.NF.A.1 should resolve');

  for (const variant of ['4.nf.a.1', '4-NF-A-1', '4 NF A 1', '4nfa1']) {
    const found = resolveCode(variant);
    assert.ok(found, `${variant} should resolve`);
    assert.equal(found.code, canonical.code);
  }
});

test('resolveCode tolerates a framework prefix the data omits', () => {
  const found = resolveCode('CCSS.MATH.4.NF.A.1');
  assert.ok(found, 'a prefixed code should still resolve');
  assert.equal(found.code, '4.NF.A.1');
});

test('resolveCode returns null for an invented code', () => {
  for (const fake of ['9-ZZ.Q.7', '4-ESS9-99', 'MADE.UP.1', '']) {
    assert.equal(resolveCode(fake), null, `${fake} must not resolve`);
  }
});

test('normalizeCode strips separators and uppercases', () => {
  assert.equal(normalizeCode('4.nf.a-1'), '4NFA1');
  assert.equal(normalizeCode('W.4.8'), 'W48');
});

test('search finds a standard by keyword, filtered by grade', () => {
  const results = searchStandards('erosion weathering', { grade: '4' });
  assert.ok(results.length > 0);
  assert.ok(
    results.some((r) => r.code === '4-ESS2-1'),
    'the NGSS erosion PE should be found for grade 4',
  );
  for (const r of results) assert.ok(r.grades.includes('4'));
});

test('search ranks an exact code match first', () => {
  const results = searchStandards('W.4.8');
  assert.equal(results[0].code, 'W.4.8');
});

test('search filters by framework and subject', () => {
  for (const r of searchStandards('information', { framework: 'CCSS.ELA-LITERACY' })) {
    assert.equal(r.framework, 'CCSS.ELA-LITERACY');
  }
  for (const r of searchStandards('data', { subject: 'Mathematics' })) {
    assert.equal(r.subject, 'Mathematics');
  }
});

test('search on an unavailable jurisdiction throws with a useful hint', () => {
  assert.throws(
    () => searchStandards('anything', { jurisdiction: 'Atlantis' }),
    (error) => {
      assert.match(error.message, /Atlantis/);
      assert.match(error.hint, /standards sync/);
      return true;
    },
  );
});

test('jurisdictionDir normalises names to directory form', () => {
  assert.equal(jurisdictionDir('Multi-State'), 'multi-state');
  assert.equal(jurisdictionDir('Washington, D.C.'), 'washington-d-c');
  assert.equal(jurisdictionDir('New York'), 'new-york');
});

test('hasJurisdiction is true for the bundled slice, false otherwise', () => {
  assert.equal(hasJurisdiction('Multi-State'), true);
  assert.equal(hasJurisdiction('Atlantis'), false);
});

// ── checkCodes: the guardrail against invented codes ─────────────────

test('checkCodes separates resolved, unresolved, and TBD', () => {
  const result = checkCodes(
    [
      { code: '4-ESS2-1' },
      { code: 'W.4.8' },
      { code: '9-ZZ.Q.7' },
      { code: 'TBD' },
      { code: 'tbd' },
    ],
    'Multi-State',
  );

  assert.equal(result.resolved.length, 2);
  assert.equal(result.unresolved.length, 1);
  assert.equal(result.unresolved[0].code, '9-ZZ.Q.7');
  assert.equal(result.tbd.length, 2, 'TBD should be case-insensitive');
  assert.equal(result.skipped, false);
});

test('checkCodes skips resolution for a jurisdiction we do not ship', () => {
  // Non-US frameworks must not be blocked just because we have no local data.
  const result = checkCodes([{ code: 'KS3-Sc-4a' }], 'England (National Curriculum)');
  assert.equal(result.skipped, true);
  assert.equal(result.unresolved.length, 0);
});

// ── The curation transform ───────────────────────────────────────────

test('toRecord keeps a real standard and preserves its provenance', () => {
  const node = {
    type: 'node',
    identifier: 'abc',
    labels: ['StandardsFrameworkItem'],
    properties: {
      statementCode: '4-TEST-1',
      normalizedStatementType: 'Standard',
      academicSubject: 'Science',
      jurisdiction: 'Multi-State',
      gradeLevel: '["4"]',
      description: 'Make observations to provide\nevidence of something.',
      isCurrent: 'true',
      inLanguage: 'en-US',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      attributionStatement: 'NGSS Science standards provided by 1EdTech.',
      caseIdentifierUUID: 'uuid-1',
    },
  };

  const record = toRecord(node);
  assert.ok(record);
  assert.equal(record.framework, 'NGSS');
  assert.equal(record.text, 'Make observations to provide evidence of something.', 'newline should be collapsed');
  assert.deepEqual(record.grades, ['4']);
  assert.ok(record.license, 'license must survive — required for redistribution');
  assert.ok(record.attribution, 'attribution must survive — required for redistribution');
});

test('toRecord rejects containers, superseded records, and non-standards', () => {
  const base = {
    type: 'node',
    labels: ['StandardsFrameworkItem'],
    properties: {
      statementCode: 'X-1',
      normalizedStatementType: 'Standard',
      academicSubject: 'Science',
      jurisdiction: 'Multi-State',
      gradeLevel: '["4"]',
      description: 'A perfectly adequate standard description.',
      isCurrent: 'true',
    },
  };

  const reject = (mutate, why) => {
    const node = structuredClone(base);
    mutate(node);
    assert.equal(toRecord(node), null, why);
  };

  reject((n) => delete n.properties.statementCode, 'no code = not citable');
  reject((n) => (n.properties.normalizedStatementType = 'Standard Grouping'), 'grouping is a container');
  reject((n) => (n.properties.normalizedStatementType = 'Course'), 'course is a container');
  reject((n) => (n.properties.isCurrent = 'false'), 'superseded');
  reject((n) => (n.properties.description = 'Grade 5'), 'stub description');
  reject((n) => (n.properties.academicSubject = 'Art'), 'subject outside the four we keep');
  reject((n) => (n.labels = ['Assessment']), 'wrong node type');

  // And the happy path still works, so the rejections above aren't vacuous.
  assert.ok(toRecord(structuredClone(base)));
});
