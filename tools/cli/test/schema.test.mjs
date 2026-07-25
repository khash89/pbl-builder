/**
 * Schema and framework-data integrity.
 */

import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';

import { findRepoRoot, readDoc, readFrameworkYaml, repoPath } from '../src/index.mjs';
import { enumDrift, validatePlan, validateProfile, validators } from '../src/index.mjs';

const ROOT = findRepoRoot();
const EXAMPLES = repoPath('examples');

function exampleDirs() {
  return readdirSync(EXAMPLES, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(EXAMPLES, d.name));
}

test('both schemas compile together', () => {
  // The plan schema $refs the profile schema, so this fails loudly if the
  // registration order in lib/schema.mjs ever regresses.
  const result = validateProfile({});
  assert.equal(result.ok, false, 'an empty object should not validate');
  assert.ok(result.errors.length > 0);
});

test('every example profile validates against the schema', () => {
  for (const dir of exampleDirs()) {
    const doc = readDoc(path.join(dir, 'learner-profile.md'));
    const { ok, errors } = validateProfile(doc.data);
    assert.ok(ok, `${path.basename(dir)}/learner-profile.md: ${JSON.stringify(errors, null, 2)}`);
  }
});

test('every example plan validates against the schema', () => {
  for (const dir of exampleDirs()) {
    const doc = readDoc(path.join(dir, 'project-plan.md'));
    const { ok, errors } = validatePlan(doc.data);
    assert.ok(ok, `${path.basename(dir)}/project-plan.md: ${JSON.stringify(errors, null, 2)}`);
  }
});

test('unknown fields are rejected, not silently ignored', () => {
  const doc = readDoc(path.join(exampleDirs()[0], 'learner-profile.md'));
  const { ok, errors } = validateProfile({ ...doc.data, notARealField: true });
  assert.equal(ok, false);
  assert.ok(
    errors.some((e) => e.message.includes('notARealField')),
    'the offending property name should appear in the error',
  );
});

test('a second success skill is structurally impossible', () => {
  const doc = readDoc(path.join(exampleDirs()[0], 'learner-profile.md'));

  // `skill` is a string, not an array — one skill, enforced by the type.
  const asArray = structuredClone(doc.data);
  asArray.success_skill_target.skill = ['critical-thinking', 'creativity'];
  assert.equal(validateProfile(asArray).ok, false);

  // And dimensions cap at three.
  const tooMany = structuredClone(doc.data);
  tooMany.success_skill_target.dimensions = ['a', 'b', 'c', 'd'];
  assert.equal(validateProfile(tooMany).ok, false);
});

test('a scaffold without a fade plan is rejected', () => {
  const doc = readDoc(path.join(exampleDirs()[0], 'project-plan.md'));
  const data = structuredClone(doc.data);
  delete data.scaffolds[0].fade_plan;
  const { ok, errors } = validatePlan(data);
  assert.equal(ok, false, 'fade_plan is required — a scaffold that never fades is an accommodation');
  assert.ok(errors.some((e) => e.path.includes('scaffolds')));
});

test('manifest enums match the schemas', () => {
  const manifest = readFrameworkYaml('manifest.yaml');
  const drift = enumDrift(manifest.enums);
  assert.deepEqual(
    drift,
    [],
    `framework/manifest.yaml mirrors the schema enums for consumers who don't parse JSON Schema. ` +
      `They have drifted:\n${JSON.stringify(drift, null, 2)}`,
  );
});

test('every success skill file is well-formed and has unique dimension ids', () => {
  const skills = readFrameworkYaml('manifest.yaml').enums.success_skills;
  for (const skill of skills) {
    const data = readFrameworkYaml(path.join('success-skills', `${skill}.yaml`));
    assert.equal(data.id, skill, `${skill}.yaml has id '${data.id}'`);
    assert.ok(data.dimensions?.length >= 1, `${skill} has no dimensions`);

    const ids = data.dimensions.map((d) => d.id);
    assert.equal(new Set(ids).size, ids.length, `${skill} has duplicate dimension ids`);

    const levels = readFrameworkYaml('manifest.yaml').enums.skill_levels;
    for (const dimension of data.dimensions) {
      for (const level of levels) {
        assert.ok(
          dimension.levels?.[level],
          `${skill}.${dimension.id} is missing the '${level}' level`,
        );
      }
    }
  }
});

test('product type modes are all in the product_mode enum', () => {
  const valid = new Set(readFrameworkYaml('manifest.yaml').enums.product_modes);
  for (const product of readFrameworkYaml('product-types.yaml').products) {
    assert.ok(product.modes?.length, `${product.id} has no modes`);
    for (const mode of product.modes) {
      assert.ok(valid.has(mode), `${product.id} uses unknown mode '${mode}'`);
    }
    assert.ok(
      ['low', 'medium', 'high'].includes(product.audience_pressure),
      `${product.id} has an invalid audience_pressure`,
    );
  }
});

test('scaffold need tags are all in the need_tag enum, and every tag has a scaffold', () => {
  const valid = new Set(readFrameworkYaml('manifest.yaml').enums.need_tags);
  const covered = new Set();

  for (const scaffold of readFrameworkYaml('scaffolds.yaml').scaffolds) {
    assert.ok(scaffold.addresses?.length, `${scaffold.id} addresses nothing`);
    assert.ok(scaffold.fade, `${scaffold.id} has no fade guidance — the whole point of the library`);
    for (const tag of scaffold.addresses) {
      assert.ok(valid.has(tag), `scaffold '${scaffold.id}' addresses unknown tag '${tag}'`);
      covered.add(tag);
    }
  }

  // Every tag a user can put in a profile must have at least one scaffold, or
  // `pbl review` check 9 becomes unsatisfiable for them.
  const orphans = [...valid].filter((tag) => !covered.has(tag));
  assert.deepEqual(
    orphans,
    [],
    `these need tags have no scaffold, so a profile using them can never pass review: ${orphans.join(', ')}`,
  );
});

test('strategy docs referenced by strategies.yaml exist', () => {
  const index = readFrameworkYaml('strategies.yaml');
  const docDir = path.resolve(repoPath('framework'), index.doc_dir);

  for (const strategy of index.strategies) {
    const file = path.join(docDir, strategy.doc);
    assert.doesNotThrow(
      () => readFileSync(file, 'utf8'),
      `framework/strategies.yaml points at a missing doc: ${strategy.doc}`,
    );
    assert.ok(
      ['direct', 'adapted', 'needs-others'].includes(strategy.solo_viability),
      `${strategy.id} has an invalid solo_viability`,
    );
  }
});

test('by_phase lookups in strategies.yaml reference real strategy ids', () => {
  const index = readFrameworkYaml('strategies.yaml');
  const ids = new Set(index.strategies.map((s) => s.id));

  for (const [phase, list] of Object.entries(index.by_phase)) {
    for (const id of list) {
      assert.ok(ids.has(id), `by_phase.${phase} references unknown strategy '${id}'`);
    }
  }
});

test('design element review_checks match the manifest', () => {
  const elements = readFrameworkYaml('design-elements.yaml').elements;
  const known = new Set(readFrameworkYaml('manifest.yaml').review_checks.map((c) => c.id));

  for (const element of elements) {
    for (const check of element.review_checks ?? []) {
      assert.ok(known.has(check), `design element '${element.id}' references unknown check '${check}'`);
    }
  }
});

test('framework yaml files all parse', () => {
  const dir = repoPath('framework');
  const files = [];
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.yaml')) files.push(full);
    }
  };
  walk(dir);

  assert.ok(files.length >= 10, `expected the framework dir to hold real data, found ${files.length} yaml files`);
  for (const file of files) {
    assert.doesNotThrow(
      () => parseYaml(readFileSync(file, 'utf8')),
      `${path.relative(ROOT, file)} does not parse`,
    );
  }
});

test('templates contain every required schema field', () => {
  // A required field missing from the template is invisible until someone tries
  // to use it — the `authenticity` block was absent from project-plan.md and
  // only surfaced during a manual end-to-end run.
  const { profileSchema, planSchema } = validators();

  for (const [name, schema] of [
    ['learner-profile.md', profileSchema],
    ['project-plan.md', planSchema],
  ]) {
    const { data } = readDoc(repoPath('templates', name));
    const missing = (schema.required ?? []).filter((field) => !(field in data));
    assert.deepEqual(
      missing,
      [],
      `templates/${name} has no placeholder for required field(s): ${missing.join(', ')}. ` +
        'A required field absent from the template is invisible until a user hits it.',
    );
  }
});

test('project-plan.yaml stays in sync with the markdown template', () => {
  const md = readDoc(repoPath('templates', 'project-plan.md')).data;
  const dataVariant = parseYaml(readFileSync(repoPath('templates', 'project-plan.yaml'), 'utf8'));

  assert.deepEqual(
    Object.keys(dataVariant).sort(),
    Object.keys(md).sort(),
    'templates/project-plan.yaml is derived from project-plan.md — regenerate it after editing the template.',
  );
});
