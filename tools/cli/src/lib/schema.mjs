/**
 * JSON Schema validation.
 *
 * The plan schema $refs the profile schema for shared $defs, so both must be
 * registered on the same Ajv instance before either compiles.
 */

// The 2020 build, not the default export — the default only knows draft-07,
// and our schemas declare draft 2020-12.
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { PblError, readJson, repoPath } from './repo.mjs';

let cached = null;

function build() {
  const profileSchema = readJson(repoPath('schema', 'learner-profile.schema.json'));
  const planSchema = readJson(repoPath('schema', 'project-plan.schema.json'));

  const ajv = new Ajv({
    allErrors: true,
    // The schemas use $id URLs for identity, not for resolution, and carry
    // annotation keywords like `examples`. Strict mode rejects both.
    strict: false,
    verbose: true,
  });
  addFormats(ajv);

  // Register under the bare filenames the $refs actually use.
  ajv.addSchema(profileSchema, 'learner-profile.schema.json');
  ajv.addSchema(planSchema, 'project-plan.schema.json');

  return {
    profile: ajv.getSchema('learner-profile.schema.json'),
    plan: ajv.getSchema('project-plan.schema.json'),
    profileSchema,
    planSchema,
  };
}

export function validators() {
  if (!cached) cached = build();
  return cached;
}

/**
 * Turn Ajv's output into something a human can act on.
 *
 * Ajv reports `additionalProperties` violations against the parent object,
 * which makes "which field did I typo?" needlessly hard, so we surface the
 * offending property name explicitly. Enum violations get the allowed list.
 */
export function formatErrors(errors = []) {
  return errors.map((error) => {
    const where = error.instancePath || '(root)';

    switch (error.keyword) {
      case 'additionalProperties':
        return {
          path: where,
          message: `unknown field '${error.params.additionalProperty}'`,
          hint: 'Check the spelling against schema/README.md. Unknown fields are rejected on purpose.',
        };
      case 'required':
        return {
          path: where === '(root)' ? error.params.missingProperty : `${where}.${error.params.missingProperty}`,
          message: 'required field is missing',
        };
      case 'enum':
        return {
          path: where,
          message: `value must be one of: ${error.params.allowedValues.join(', ')}`,
        };
      case 'const':
        return { path: where, message: `must be ${JSON.stringify(error.params.allowedValue)}` };
      case 'minItems':
        return { path: where, message: `needs at least ${error.params.limit} item(s)` };
      case 'maxItems':
        return {
          path: where,
          message: `allows at most ${error.params.limit} item(s)`,
          hint:
            where.includes('dimensions')
              ? 'Three dimensions is the cap. One or two is usually better — depth beats coverage.'
              : undefined,
        };
      case 'minLength':
        return { path: where, message: `too short (needs ${error.params.limit}+ characters)` };
      case 'type':
        return { path: where, message: `must be ${error.params.type}` };
      case 'pattern':
        return {
          path: where,
          message: `does not match required format (${error.params.pattern})`,
          hint: where.endsWith('slug') ? 'Slugs are lowercase words joined by hyphens.' : undefined,
        };
      default:
        return { path: where, message: error.message ?? error.keyword };
    }
  });
}

export function validateProfile(data) {
  const validate = validators().profile;
  const ok = validate(data);
  return { ok, errors: ok ? [] : formatErrors(validate.errors) };
}

export function validatePlan(data) {
  const validate = validators().plan;
  const ok = validate(data);
  return { ok, errors: ok ? [] : formatErrors(validate.errors) };
}

/**
 * Cross-check that framework/manifest.yaml's mirrored enums still match the
 * schemas. The manifest exists so consumers don't have to parse JSON Schema,
 * which only helps if it's actually in sync. A test calls this.
 */
export function enumDrift(manifestEnums) {
  const { profileSchema } = validators();
  const defs = profileSchema.$defs;
  const drift = [];

  const pairs = [
    ['grade', defs.grade.enum],
    ['success_skills', defs.success_skill.enum],
    ['skill_levels', defs.skill_level.enum],
    ['product_modes', defs.product_mode.enum],
    ['need_tags', defs.need_tag.enum],
    ['standards_status', profileSchema.properties.standards_targets.items.properties.status.enum],
    ['pbl_experience', profileSchema.properties.pbl_experience.enum],
    ['settings', profileSchema.properties.context.properties.setting.enum],
    ['choice_appetite', profileSchema.properties.preferences.properties.choice_appetite.enum],
    ['audience_comfort', profileSchema.properties.preferences.properties.audience_comfort.enum],
  ];

  for (const [key, schemaValues] of pairs) {
    const manifestValues = manifestEnums?.[key];
    if (!manifestValues) {
      drift.push({ key, problem: 'missing from manifest' });
      continue;
    }
    const a = [...schemaValues].sort().join('|');
    const b = [...manifestValues].map(String).sort().join('|');
    if (a !== b) drift.push({ key, problem: 'differs from schema', schema: schemaValues, manifest: manifestValues });
  }

  return drift;
}

export { PblError };
