/**
 * Programmatic API.
 *
 * Everything the CLI does is available as a function, so another tool can
 * validate and review plans without shelling out.
 *
 *   import { readDoc, reviewPlan, validatePlan } from 'pbl-builder';
 *
 *   const doc = readDoc('./project-plan.md');
 *   const { ok, errors } = validatePlan(doc.data);
 *   const { findings, summary } = reviewPlan(doc);
 */

export {
  PblError,
  findPlaceholders,
  findRepoRoot,
  isPlaceholder,
  readDoc,
  readFrameworkYaml,
  repoPath,
  slugify,
  splitFrontmatter,
} from './lib/repo.mjs';

export { enumDrift, formatErrors, validatePlan, validateProfile, validators } from './lib/schema.mjs';

export { checkProfile } from './lib/profile-check.mjs';

export { reviewPlan } from './lib/review.mjs';

export {
  checkCodes,
  hasJurisdiction,
  jurisdictionDir,
  loadJurisdiction,
  localJurisdictions,
  normalizeCode,
  resolveCode,
  search as searchStandards,
} from './lib/standards.mjs';

export { KG_EXPORT_URL, KG_VERSION, curate, toRecord, writeSlice } from './standards/curate.mjs';
