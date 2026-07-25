/**
 * Review and profile-check behaviour.
 *
 * The important tests here are the negative ones. A check that never fires is
 * worse than no check — it tells the user their plan is fine when nobody looked.
 * So for each check there is a fixture that breaks exactly that thing and
 * asserts exactly that check fails.
 */

import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { stringify as stringifyYaml } from 'yaml';

import { checkProfile, findRepoRoot, readDoc, repoPath, reviewPlan } from '../src/index.mjs';

const EXAMPLES = repoPath('examples');

function exampleDirs() {
  return readdirSync(EXAMPLES, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(EXAMPLES, d.name));
}

/**
 * The base for mutation fixtures. Named explicitly rather than taking
 * exampleDirs()[0] — several tests below depend on this learner's specific
 * profile (audience_comfort: low, product_modes without record-audio), and
 * adding an alphabetically-earlier example must not silently change which
 * profile they mutate.
 */
const BASE_EXAMPLE = 'maya-grade-4-water';

function baseExample() {
  const dir = path.join(EXAMPLES, BASE_EXAMPLE);
  assert.ok(existsSync(dir), `fixture base example missing: ${BASE_EXAMPLE}`);
  return dir;
}

/**
 * Write a mutated copy of an example into a temp dir, alongside its (unmodified)
 * profile so the fidelity checks still have something to compare against.
 */
function mutatedPlan(mutate) {
  const dir = mkdtempSync(path.join(tmpdir(), 'pbl-test-'));
  const source = baseExample();

  writeFileSync(
    path.join(dir, 'learner-profile.md'),
    readFileSync(path.join(source, 'learner-profile.md'), 'utf8'),
  );

  const doc = readDoc(path.join(source, 'project-plan.md'));
  const data = structuredClone(doc.data);
  mutate(data);

  const file = path.join(dir, 'project-plan.md');
  writeFileSync(file, `---\n${stringifyYaml(data)}---\n${doc.body}`);
  return readDoc(file);
}

function findingFor(findings, id) {
  return findings.find((f) => f.id === id);
}

// ── Baseline: the shipped examples are clean ─────────────────────────

test('every example plan passes review with zero failures', () => {
  for (const dir of exampleDirs()) {
    const doc = readDoc(path.join(dir, 'project-plan.md'));
    const { findings, summary } = reviewPlan(doc);
    const failures = findings.filter((f) => f.status === 'fail');
    assert.deepEqual(
      failures.map((f) => `${f.id}: ${f.message}`),
      [],
      `${path.basename(dir)} should review clean`,
    );
    assert.ok(summary.profile_loaded, `${path.basename(dir)}: profile should load`);
  }
});

test('every example profile passes its usability checks', () => {
  for (const dir of exampleDirs()) {
    const doc = readDoc(path.join(dir, 'learner-profile.md'));
    const { findings } = checkProfile(doc);
    const failures = findings.filter((f) => f.status === 'fail');
    assert.deepEqual(failures.map((f) => `${f.id}: ${f.message}`), [], path.basename(dir));
  }
});

test('the review covers every check id the manifest advertises', () => {
  const doc = readDoc(path.join(baseExample(), 'project-plan.md'));
  const { findings } = reviewPlan(doc);
  const produced = new Set(findings.map((f) => f.id));

  // body-sections isn't in the manifest's element-mapped list; the rest are.
  for (const id of [
    'substantive-content',
    'single-success-skill',
    'driving-question-shape',
    'audience-beyond-household',
    'all-phases-populated',
    'milestones-have-ntk',
    'critique-before-present',
    'reflection-spread',
    'formative-in-middle-phases',
    'profile-fidelity',
    'scaffolds-fade',
    'choice-calibration',
    'standards-resolve',
    'support-plan-complete',
  ]) {
    assert.ok(produced.has(id), `review produced no finding for '${id}' — the check may be unreachable`);
  }
});

// ── Negative fixtures, one per check ─────────────────────────────────

test('FAILS when a field still holds template placeholder text', () => {
  const doc = mutatedPlan((d) => {
    d.authenticity.impact = '[What could genuinely change]';
  });
  const f = findingFor(reviewPlan(doc).findings, 'substantive-content');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /placeholder/i);
});

test('FAILS when the plan targets a different success skill than the profile', () => {
  const doc = mutatedPlan((d) => {
    d.learning_goals.success_skill.skill = 'creativity';
    d.learning_goals.success_skill.dimensions = ['idea-generation'];
  });
  const f = findingFor(reviewPlan(doc).findings, 'single-success-skill');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /profile targets/);
});

test('FAILS on an unknown success skill dimension', () => {
  const doc = mutatedPlan((d) => {
    d.learning_goals.success_skill.dimensions = ['not-a-real-dimension'];
  });
  const f = findingFor(reviewPlan(doc).findings, 'single-success-skill');
  assert.equal(f.status, 'fail');
});

test('FAILS on a driving question that is not open-ended', () => {
  const doc = mutatedPlan((d) => {
    d.driving_question = 'Erosion and its effects on our local waterways today';
  });
  const f = findingFor(reviewPlan(doc).findings, 'driving-question-shape');
  assert.equal(f.status, 'fail');
});

test('WARNS on a driving question with one findable answer', () => {
  const doc = mutatedPlan((d) => {
    d.driving_question = 'What is a watershed?';
  });
  const f = findingFor(reviewPlan(doc).findings, 'driving-question-shape');
  assert.equal(f.status, 'warn');
  assert.match(f.hint, /google/i);
});

test('FAILS when the audience is inside the household', () => {
  const doc = mutatedPlan((d) => {
    d.public_audience.who = 'my family';
  });
  const f = findingFor(reviewPlan(doc).findings, 'audience-beyond-household');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /household/);
});

test('WARNS on a vague audience', () => {
  const doc = mutatedPlan((d) => {
    d.public_audience.who = 'the community';
  });
  const f = findingFor(reviewPlan(doc).findings, 'audience-beyond-household');
  assert.equal(f.status, 'warn');
});

test('WARNS when a low-comfort learner has no comfort ramp', () => {
  // The base example's learner has audience_comfort: low.
  const doc = mutatedPlan((d) => {
    delete d.public_audience.comfort_ramp;
  });
  const f = findingFor(reviewPlan(doc).findings, 'audience-beyond-household');
  assert.equal(f.status, 'warn');
  assert.match(f.message, /comfort_ramp/);
});

test('FAILS when a phase has no milestones', () => {
  const doc = mutatedPlan((d) => {
    d.project_path.present = [];
  });
  // An empty array also breaks minItems, so check via review rather than schema.
  const f = findingFor(reviewPlan(doc).findings, 'all-phases-populated');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /present/);
});

test('FAILS when a milestone has no need-to-know question', () => {
  const doc = mutatedPlan((d) => {
    d.project_path.build_knowledge[0].ntk_questions = ['[Their question]'];
  });
  const f = findingFor(reviewPlan(doc).findings, 'milestones-have-ntk');
  assert.equal(f.status, 'fail');
});

test('FAILS when there is no critique cycle before the present phase', () => {
  const doc = mutatedPlan((d) => {
    for (const phase of ['launch', 'build_knowledge', 'develop_and_critique']) {
      for (const milestone of d.project_path[phase]) delete milestone.critique;
    }
  });
  const f = findingFor(reviewPlan(doc).findings, 'critique-before-present');
  assert.equal(f.status, 'fail');
  assert.match(f.hint, /final grade/);
});

test('WARNS when critique is planned but no partners are named', () => {
  const doc = mutatedPlan((d) => {
    d.support_plan.critique_partners = [];
  });
  const f = findingFor(reviewPlan(doc).findings, 'critique-before-present');
  assert.equal(f.status, 'warn');
});

test('FAILS when reflection appears fewer than twice', () => {
  const doc = mutatedPlan((d) => {
    let kept = 0;
    for (const phase of ['launch', 'build_knowledge', 'develop_and_critique', 'present']) {
      for (const milestone of d.project_path[phase]) {
        if (milestone.reflection && kept === 0) kept += 1;
        else delete milestone.reflection;
      }
    }
  });
  const f = findingFor(reviewPlan(doc).findings, 'reflection-spread');
  assert.equal(f.status, 'fail');
});

test('FAILS when reflection is all in one phase', () => {
  const doc = mutatedPlan((d) => {
    for (const phase of ['launch', 'build_knowledge', 'develop_and_critique', 'present']) {
      for (const milestone of d.project_path[phase]) delete milestone.reflection;
    }
    d.project_path.present[0].reflection = 'One reflection here.';
    d.project_path.present.push({
      name: 'Extra',
      ntk_questions: ['What now?'],
      learning_experiences: ['Something'],
      reflection: 'Another reflection, same phase.',
    });
  });
  const f = findingFor(reviewPlan(doc).findings, 'reflection-spread');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /one phase/);
});

test('FAILS when a middle phase has no formative assessment', () => {
  const doc = mutatedPlan((d) => {
    d.assessment.formative = d.assessment.formative.filter((f) => f.phase !== 'develop_and_critique');
    for (const milestone of d.project_path.develop_and_critique) delete milestone.formative_assessment;
  });
  const f = findingFor(reviewPlan(doc).findings, 'formative-in-middle-phases');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /develop_and_critique/);
});

test('FAILS when the product does not match the learner\'s preferred modes', () => {
  const doc = mutatedPlan((d) => {
    d.products.primary.type = 'podcast'; // record-audio/write — learner wants build-physical etc.
  });
  const f = findingFor(reviewPlan(doc).findings, 'profile-fidelity');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /product_modes/);
});

test('FAILS when personal_connection names no interest from the profile', () => {
  const doc = mutatedPlan((d) => {
    d.authenticity.personal_connection = 'This project connects well to the student\'s interests and motivations.';
  });
  const f = findingFor(reviewPlan(doc).findings, 'profile-fidelity');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /personal_connection/);
});

test('FAILS when a need from the profile has no scaffold', () => {
  const doc = mutatedPlan((d) => {
    d.scaffolds = d.scaffolds.filter((s) => !s.addresses.includes('task-initiation'));
  });
  const f = findingFor(reviewPlan(doc).findings, 'profile-fidelity');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /task-initiation/);
});

test('FAILS on a scaffold with no real fade plan', () => {
  const doc = mutatedPlan((d) => {
    d.scaffolds[0].fade_plan = 'soon';
  });
  const f = findingFor(reviewPlan(doc).findings, 'scaffolds-fade');
  assert.equal(f.status, 'fail');
  assert.match(f.hint, /accommodation/);
});

test('WARNS on a fade plan that is only a date', () => {
  const doc = mutatedPlan((d) => {
    d.scaffolds[0].fade_plan = 'week 4';
  });
  const f = findingFor(reviewPlan(doc).findings, 'scaffolds-fade');
  // 'week 4' is under the 10-char floor, so it fails; use a longer date-only form.
  const doc2 = mutatedPlan((d) => {
    d.scaffolds[0].fade_plan = 'after week 3';
  });
  const f2 = findingFor(reviewPlan(doc2).findings, 'scaffolds-fade');
  assert.ok(f.status !== 'pass');
  assert.equal(f2.status, 'warn');
  assert.match(f2.hint, /trigger/);
});

test('FAILS when choice calibration disagrees with the profile', () => {
  const doc = mutatedPlan((d) => {
    d.voice_and_choice.calibrated_for = 'high';
  });
  const f = findingFor(reviewPlan(doc).findings, 'choice-calibration');
  assert.equal(f.status, 'fail');
  assert.match(f.message, /profile says/);
});

test('FAILS on a standards code that does not resolve', () => {
  const doc = mutatedPlan((d) => {
    d.learning_goals.standards[0].code = '9-ZZ.Q.7';
  });
  const f = findingFor(reviewPlan(doc).findings, 'standards-resolve');
  assert.equal(f.status, 'fail');
  assert.match(f.hint, /invented code/);
});

test('FAILS on an empty stuck protocol', () => {
  const doc = mutatedPlan((d) => {
    d.support_plan.stuck_protocol = '[The steps, in order]';
  });
  const f = findingFor(reviewPlan(doc).findings, 'support-plan-complete');
  assert.equal(f.status, 'fail');
});

test('FAILS when the learner_profile path is dangling', () => {
  const doc = mutatedPlan((d) => {
    d.learner_profile = './no-such-profile.md';
  });
  const { findings, summary } = reviewPlan(doc);
  const f = findingFor(findings, 'profile-fidelity');
  assert.equal(f.status, 'fail');
  assert.equal(summary.profile_loaded, false);
});

// ── Profile usability negatives ──────────────────────────────────────

test('profile check FAILS on a generic interest', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  data.interests = ['sports', 'reading'];

  const f = findingFor(checkProfile({ data }).findings, 'interests-specific');
  assert.equal(f.status, 'fail');
  assert.match(f.hint, /what you'd see them actually doing/i);
});

test('profile check FAILS on a trait-shaped strength', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  data.strengths = ['smart', 'hard worker'];

  const f = findingFor(checkProfile({ data }).findings, 'strengths-observable');
  assert.equal(f.status, 'fail');
});

test('profile check FAILS on an invented standards code', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  data.standards_targets[0].code = '4-ZZZ9-1';

  const f = findingFor(checkProfile({ data }).findings, 'standards-resolve');
  assert.equal(f.status, 'fail');
});

test('profile check accepts TBD as an honest placeholder', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  data.standards_targets[0].code = 'TBD';

  const f = findingFor(checkProfile({ data }).findings, 'standards-resolve');
  assert.equal(f.status, 'warn', 'TBD should warn, not fail — it is the honest option');
});

test('profile check WARNS on collaboration for a solo learner', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  data.success_skill_target = {
    skill: 'collaboration',
    dimensions: ['planning-and-decisions'],
    current_level: 'beginning',
  };
  data.preferences.work_mode = 'solo';
  data.context.setting = 'homeschool';

  const f = findingFor(checkProfile({ data }).findings, 'one-success-skill');
  assert.equal(f.status, 'warn');
  assert.match(f.hint, /second party/);
});

test('profile check WARNS when clinical information appears', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  data.needs.accommodations = ['per her IEP, extra time on written work'];

  const f = findingFor(checkProfile({ data }).findings, 'privacy-clean');
  assert.equal(f.status, 'warn');
  assert.match(f.message, /IEP/);
});

test('profile check WARNS when every standard is already secure', () => {
  const doc = readDoc(path.join(baseExample(), 'learner-profile.md'));
  const data = structuredClone(doc.data);
  for (const target of data.standards_targets) target.status = 'secure';

  const f = findingFor(checkProfile({ data }).findings, 'standards-resolve');
  assert.equal(f.status, 'warn');
  assert.match(f.message, /new learning/);
});

test('a fresh template scaffold does NOT pass — that is the guided-fill signal', () => {
  const doc = readDoc(repoPath('templates', 'learner-profile.md'));
  const { summary } = checkProfile(doc);
  assert.ok(summary.fail > 0, 'an unfilled template must fail, or it teaches nothing about what is missing');
});

test('repo root discovery works from a nested directory', () => {
  const root = findRepoRoot(repoPath('framework', 'success-skills'));
  assert.equal(root, findRepoRoot());
});
