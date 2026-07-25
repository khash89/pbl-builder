/**
 * The review engine.
 *
 * Deterministic quality checks on a project plan, each tagged with the
 * Essential Project Design Element it belongs to and a pointer into docs/.
 *
 * These are not a substitute for judgment — they catch the specific, common,
 * mechanical failures that make a project stop being PBL. A plan can pass every
 * check and still be a bad project. A plan that fails these is reliably worse
 * than it looks.
 *
 * Check ids are stable and mirrored in framework/manifest.yaml.
 */

import path from 'node:path';
import { existsSync } from 'node:fs';
import { findPlaceholders, isPlaceholder, readDoc, readFrameworkYaml } from './repo.mjs';
import { checkCodes } from './standards.mjs';

const PASS = 'pass';
const WARN = 'warn';
const FAIL = 'fail';

const PHASES = ['launch', 'build_knowledge', 'develop_and_critique', 'present'];

/** Open-ended question stems. A driving question should begin like one of these. */
const OPEN_STEMS = [
  /^how\b/i, /^why\b/i, /^what\b/i, /^should\b/i, /^to what extent\b/i,
  /^in what ways?\b/i, /^who\b/i, /^where\b/i, /^when\b/i, /^which\b/i,
  /^can we\b/i, /^could we\b/i, /^is it\b/i, /^does\b/i, /^do we\b/i, /^will\b/i,
];

/** Question shapes with one findable answer — a research prompt, not a driving question. */
const CLOSED_SHAPES = [
  /^what (is|are) (a |an |the )?[\w\s]{3,30}\??$/i,   // "What is a watershed?"
  /^who (was|is) [\w\s]{3,30}\??$/i,
  /^when did\b/i,
  /^where is\b/i,
  /^how many\b/i,
];

const HOUSEHOLD_ONLY = /^(me|myself|mum|mom|dad|parent|parents|my (mum|mom|dad|parents?|family|tutor)|family|the family|us|our family|tutor|teacher|my teacher|just me|nobody)\.?$/i;

/**
 * Run every check.
 * @returns {{findings: object[], summary: object}}
 */
export function reviewPlan({ data, body, filePath }) {
  const findings = [];
  const add = (id, element, status, message, hint) =>
    findings.push({ id, element, status, message, ...(hint ? { hint } : {}) });

  // The profile is the yardstick for the fidelity checks. Load it if we can.
  const profile = loadProfile(data, filePath, add);

  checkSubstantiveContent(data, add);
  checkSingleSuccessSkill(data, profile, add);
  checkDrivingQuestion(data, add);
  checkAudience(data, profile, add);
  checkPhasesPopulated(data, add);
  checkMilestoneDetail(data, add);
  checkCritiqueBeforePresent(data, add);
  checkReflectionSpread(data, add);
  checkFormativeCoverage(data, add);
  checkProfileFidelity(data, profile, add);
  checkScaffoldsFade(data, add);
  checkChoiceCalibration(data, profile, add);
  checkStandards(data, profile, add);
  checkSupportPlan(data, add);
  checkBodySections(body, add);

  const summary = {
    total: findings.length,
    pass: findings.filter((f) => f.status === PASS).length,
    warn: findings.filter((f) => f.status === WARN).length,
    fail: findings.filter((f) => f.status === FAIL).length,
    profile_loaded: Boolean(profile),
  };

  return { findings, summary };
}

// ── Profile loading ──────────────────────────────────────────────────

function loadProfile(data, filePath, add) {
  const ref = data.learner_profile;
  if (!ref) return null; // schema already requires it; validate reports that

  const resolved = path.resolve(path.dirname(filePath), ref);
  if (!existsSync(resolved)) {
    add(
      'profile-fidelity',
      'authenticity',
      FAIL,
      `learner_profile points to a file that doesn't exist: ${ref}`,
      'The profile is what the fidelity checks compare against. Fix the path — a plan with no profile behind it is the failure mode this tool exists to catch.',
    );
    return null;
  }

  try {
    return readDoc(resolved).data;
  } catch (error) {
    add('profile-fidelity', 'authenticity', FAIL, `Could not read the learner profile: ${error.message}`);
    return null;
  }
}

// ── Checks ───────────────────────────────────────────────────────────

/** 1. Nothing is still template text. */
function checkSubstantiveContent(data, add) {
  const placeholders = findPlaceholders(data);
  if (placeholders.length === 0) {
    add('substantive-content', 'learning-goals', PASS, 'No unfilled template placeholders.');
    return;
  }
  const shown = placeholders.slice(0, 8).map((p) => `${p.path}`).join(', ');
  add(
    'substantive-content',
    'learning-goals',
    FAIL,
    `${placeholders.length} field(s) still contain template placeholder text: ${shown}${placeholders.length > 8 ? ', …' : ''}`,
    'Run `pbl validate` for the full list with values.',
  );
}

/** 2. Exactly one success skill, with dimensions. */
function checkSingleSuccessSkill(data, profile, add) {
  const skill = data.learning_goals?.success_skill;
  if (!skill?.skill) {
    add('single-success-skill', 'learning-goals', FAIL, 'No success skill named.');
    return;
  }
  if (!skill.dimensions?.length) {
    add(
      'single-success-skill',
      'learning-goals',
      FAIL,
      `Success skill '${skill.skill}' has no dimensions named.`,
      'Pick 1-3 dimensions from framework/success-skills/' + skill.skill + '.yaml. Teaching a whole skill at once teaches none of it.',
    );
    return;
  }

  // Dimension ids must exist in the skill's yaml.
  let known = [];
  try {
    known = (readFrameworkYaml(path.join('success-skills', `${skill.skill}.yaml`)).dimensions ?? []).map((d) => d.id);
  } catch {
    // Unknown skill id — the schema enum already rejects that.
  }
  const bogus = known.length ? skill.dimensions.filter((d) => !known.includes(d)) : [];
  if (bogus.length) {
    add(
      'single-success-skill',
      'learning-goals',
      FAIL,
      `Unknown dimension(s) for ${skill.skill}: ${bogus.join(', ')}`,
      `Valid ids: ${known.join(', ')}`,
    );
    return;
  }

  // Must agree with the profile.
  const targetSkill = profile?.success_skill_target?.skill;
  if (targetSkill && targetSkill !== skill.skill) {
    add(
      'single-success-skill',
      'learning-goals',
      FAIL,
      `Plan targets '${skill.skill}' but the profile targets '${targetSkill}'.`,
      'Change one of them. If the profile is out of date, update it — the profile is the source of truth.',
    );
    return;
  }

  if (!skill.taught_how || isPlaceholder(skill.taught_how)) {
    add(
      'single-success-skill',
      'learning-goals',
      WARN,
      'success_skill.taught_how is empty — the skill is being assessed but not explicitly taught.',
      'This is the most commonly skipped field, and skipping it is why success skills don\'t grow.',
    );
    return;
  }

  add(
    'single-success-skill',
    'learning-goals',
    PASS,
    `One skill (${skill.skill}), ${skill.dimensions.length} dimension(s), with a plan for teaching it.`,
  );
}

/** 3. The driving question is shaped like one. */
function checkDrivingQuestion(data, add) {
  const dq = (data.driving_question ?? '').trim();
  if (!dq || isPlaceholder(dq)) {
    add('driving-question-shape', 'challenging-problem', FAIL, 'No driving question.');
    return;
  }

  const isOpen = OPEN_STEMS.some((re) => re.test(dq));
  if (!isOpen) {
    add(
      'driving-question-shape',
      'challenging-problem',
      FAIL,
      'The driving question does not begin like an open question.',
      'Start with How / Why / What / Should / To what extent / In what ways. See docs/07-driving-questions.md.',
    );
    return;
  }

  if (!dq.includes('?')) {
    add('driving-question-shape', 'challenging-problem', WARN, 'The driving question has no question mark. Probably a statement.');
    return;
  }

  const closed = CLOSED_SHAPES.find((re) => re.test(dq));
  if (closed) {
    add(
      'driving-question-shape',
      'challenging-problem',
      WARN,
      'The driving question looks like it has one findable answer — a research prompt rather than a challenge.',
      'Could you google it? Then it needs reframing toward a decision or a design. See docs/07-driving-questions.md.',
    );
    return;
  }

  // A question with no first-person plural often signals no stake for the learner.
  if (!/\b(we|our|us|i|my|me|you|your)\b/i.test(dq)) {
    add(
      'driving-question-shape',
      'challenging-problem',
      WARN,
      'The driving question has no "we"/"our"/"I" in it — check that the learner is actually implicated in it.',
      'Compare "How do communities manage water?" with "How can we keep our creek clean?"',
    );
    return;
  }

  add('driving-question-shape', 'challenging-problem', PASS, 'Driving question is open-ended and implicates the learner.');
}

/** 4. A real audience beyond the household. */
function checkAudience(data, profile, add) {
  const audience = data.public_audience;
  const who = (audience?.who ?? '').trim();

  if (!who || isPlaceholder(who)) {
    add('audience-beyond-household', 'public-product', FAIL, 'No public audience named.');
    return;
  }

  const comfort = profile?.preferences?.audience_comfort;
  const ramp = audience.comfort_ramp ?? [];
  const hasRamp = ramp.filter((r) => r && !isPlaceholder(r)).length >= 2;

  if (HOUSEHOLD_ONLY.test(who)) {
    add(
      'audience-beyond-household',
      'public-product',
      FAIL,
      `The audience ("${who}") is inside the household. That isn't a public product.`,
      'A public product goes to people who are not obliged to be interested. That obligation-free attention is what raises the quality bar. See docs/03-design-elements.md#8-public-product.',
    );
    return;
  }

  if (comfort === 'low' && !hasRamp) {
    add(
      'audience-beyond-household',
      'public-product',
      WARN,
      'The learner has low audience comfort but there is no comfort_ramp (needs 2+ steps).',
      'Build trusted adult → small friendly group → real audience. Never drop the audience instead.',
    );
    return;
  }

  if (/\b(the )?(community|public|everyone|people|others)\b\.?$/i.test(who) && who.split(/\s+/).length <= 3) {
    add(
      'audience-beyond-household',
      'public-product',
      WARN,
      `"${who}" is too vague to actually invite. Name the specific people or body.`,
      '"The watershed council\'s monthly meeting" is an audience. "The community" is a hope.',
    );
    return;
  }

  add('audience-beyond-household', 'public-product', PASS, `Real audience named: ${who}.`);
}

/** 5. All four phases have milestones. */
function checkPhasesPopulated(data, add) {
  const empty = PHASES.filter((phase) => !(data.project_path?.[phase]?.length > 0));
  if (empty.length) {
    add(
      'all-phases-populated',
      'sustained-inquiry',
      FAIL,
      `Phase(s) with no milestones: ${empty.join(', ')}`,
      'All four phases belong in every project, even a two-week one. See framework/project-path.yaml.',
    );
    return;
  }
  add('all-phases-populated', 'sustained-inquiry', PASS, 'All four phases have milestones.');
}

/** 6. Every milestone has a need-to-know and a learning experience. */
function checkMilestoneDetail(data, add) {
  const thin = [];
  for (const phase of PHASES) {
    for (const [i, milestone] of (data.project_path?.[phase] ?? []).entries()) {
      const label = `${phase}[${i}] "${milestone?.name ?? 'unnamed'}"`;
      const ntk = (milestone?.ntk_questions ?? []).filter((q) => q && !isPlaceholder(q));
      const exp = (milestone?.learning_experiences ?? []).filter((e) => e && !isPlaceholder(e));
      if (!ntk.length) thin.push(`${label} — no need-to-know question`);
      if (!exp.length) thin.push(`${label} — no learning experience`);
    }
  }

  if (thin.length) {
    add(
      'milestones-have-ntk',
      'sustained-inquiry',
      FAIL,
      `${thin.length} milestone gap(s): ${thin.slice(0, 5).join('; ')}${thin.length > 5 ? '; …' : ''}`,
      'Need-to-know questions are what make instruction responsive rather than pre-scheduled.',
    );
    return;
  }
  add('milestones-have-ntk', 'sustained-inquiry', PASS, 'Every milestone has a question and a learning experience.');
}

/** 7. A critique cycle happens before the presentation. */
function checkCritiqueBeforePresent(data, add) {
  const before = ['launch', 'build_knowledge', 'develop_and_critique'];
  const cycles = [];
  for (const phase of before) {
    for (const milestone of data.project_path?.[phase] ?? []) {
      if (milestone?.critique && !isPlaceholder(milestone.critique)) cycles.push({ phase, name: milestone.name });
    }
  }

  if (!cycles.length) {
    add(
      'critique-before-present',
      'critique-and-revision',
      FAIL,
      'No critique-and-revision cycle before the present phase.',
      'Feedback that arrives with the final grade is not critique — there is no time left to act on it. Add a critique to a develop_and_critique milestone and schedule the revision as its own block.',
    );
    return;
  }

  const partners = (data.support_plan?.critique_partners ?? []).filter((p) => p && !isPlaceholder(p));
  if (!partners.length) {
    add(
      'critique-before-present',
      'critique-and-revision',
      WARN,
      `${cycles.length} critique cycle(s) planned, but support_plan.critique_partners is empty.`,
      'With one learner there is no class to critique the work. Name who will do it, or it quietly won\'t happen.',
    );
    return;
  }

  add(
    'critique-before-present',
    'critique-and-revision',
    PASS,
    `${cycles.length} critique cycle(s) before presenting, with ${partners.length} named partner(s).`,
  );
}

/** 8. At least two reflection points, in at least two phases. */
function checkReflectionSpread(data, add) {
  const phasesWithReflection = new Set();
  let count = 0;
  for (const phase of PHASES) {
    for (const milestone of data.project_path?.[phase] ?? []) {
      if (milestone?.reflection && !isPlaceholder(milestone.reflection)) {
        count += 1;
        phasesWithReflection.add(phase);
      }
    }
  }

  if (count < 2) {
    add(
      'reflection-spread',
      'reflection',
      FAIL,
      `Only ${count} reflection point(s). Needs at least 2.`,
      'Reflection during the work is what makes it transfer. One reflection at the end is a summary.',
    );
    return;
  }
  if (phasesWithReflection.size < 2) {
    add(
      'reflection-spread',
      'reflection',
      FAIL,
      `${count} reflection points, but all in one phase (${[...phasesWithReflection][0]}).`,
      'Spread them across at least two phases.',
    );
    return;
  }
  add(
    'reflection-spread',
    'reflection',
    PASS,
    `${count} reflection points across ${phasesWithReflection.size} phases.`,
  );
}

/** 9. Formative assessment in both middle phases. */
function checkFormativeCoverage(data, add) {
  const covered = new Set();

  for (const entry of data.assessment?.formative ?? []) {
    if (entry?.phase && entry.what && !isPlaceholder(entry.what)) covered.add(entry.phase);
  }
  for (const phase of PHASES) {
    for (const milestone of data.project_path?.[phase] ?? []) {
      if (milestone?.formative_assessment && !isPlaceholder(milestone.formative_assessment)) covered.add(phase);
    }
  }

  const missing = ['build_knowledge', 'develop_and_critique'].filter((p) => !covered.has(p));
  if (missing.length) {
    add(
      'formative-in-middle-phases',
      'learning-goals',
      FAIL,
      `No formative assessment in: ${missing.join(', ')}`,
      'These are the two phases where you can still change course. Assessment after that point can only report.',
    );
    return;
  }

  const unresponsive = (data.assessment?.formative ?? []).filter(
    (f) => !f?.responds_how || isPlaceholder(f.responds_how),
  );
  if (unresponsive.length) {
    add(
      'formative-in-middle-phases',
      'learning-goals',
      WARN,
      `${unresponsive.length} formative check(s) have no responds_how — what you'd actually do with the finding.`,
      'Formative assessment you don\'t act on is record-keeping.',
    );
    return;
  }

  add('formative-in-middle-phases', 'learning-goals', PASS, 'Formative assessment in both middle phases, each with a response.');
}

/** 10. The plan actually reflects the profile. */
function checkProfileFidelity(data, profile, add) {
  if (!profile) return; // already reported by loadProfile

  const problems = [];

  // (a) personal_connection must name a real interest.
  const connection = (data.authenticity?.personal_connection ?? '').toLowerCase();
  const interests = (profile.interests ?? []).filter((i) => i && !isPlaceholder(i));
  if (!connection || isPlaceholder(connection)) {
    problems.push('authenticity.personal_connection is empty');
  } else {
    const matched = interests.some((interest) => sharesSignificantWord(connection, interest));
    if (!matched) {
      problems.push(
        `authenticity.personal_connection doesn't reference any of the learner's interests (${interests.map((i) => `"${truncate(i, 40)}"`).join(', ')})`,
      );
    }
  }

  // (b) product type must match a mode the learner is drawn to.
  const learnerModes = profile.preferences?.product_modes ?? [];
  if (learnerModes.length) {
    let catalogue = [];
    try {
      catalogue = readFrameworkYaml('product-types.yaml').products ?? [];
    } catch { /* missing framework file reported elsewhere */ }

    for (const slot of ['primary', 'secondary']) {
      const product = data.products?.[slot];
      if (!product?.type || isPlaceholder(product.type)) continue;

      const entry = catalogue.find((p) => p.id === product.type);
      if (!entry) {
        problems.push(`products.${slot}.type '${product.type}' is not in framework/product-types.yaml`);
        continue;
      }
      const overlap = (entry.modes ?? []).filter((m) => learnerModes.includes(m));
      if (!overlap.length) {
        problems.push(
          `products.${slot} '${product.type}' (modes: ${(entry.modes ?? []).join(', ')}) matches none of the learner's product_modes (${learnerModes.join(', ')})`,
        );
      }
    }
  }

  // (c) every populated need has a scaffold.
  const needTags = collectNeedTags(profile);
  const addressed = new Set((data.scaffolds ?? []).flatMap((s) => s?.addresses ?? []));
  const unaddressed = needTags.filter((tag) => !addressed.has(tag));
  if (unaddressed.length) {
    problems.push(`need(s) with no scaffold: ${unaddressed.join(', ')}`);
  }

  if (problems.length) {
    add(
      'profile-fidelity',
      'authenticity',
      FAIL,
      `The plan doesn't reflect the profile: ${problems.join('; ')}`,
      'This is the check that catches a generic project with a child\'s name attached. See docs/15-learner-profiles.md.',
    );
    return;
  }

  add(
    'profile-fidelity',
    'authenticity',
    PASS,
    `Plan reflects the profile: interest named, product matches their preferred modes, all ${needTags.length} need(s) scaffolded.`,
  );
}

/** 11. Every scaffold fades. */
function checkScaffoldsFade(data, add) {
  const scaffolds = data.scaffolds ?? [];
  if (!scaffolds.length) {
    add(
      'scaffolds-fade',
      'learning-goals',
      WARN,
      'No scaffolds in the plan.',
      'Fine if the profile lists no needs. Otherwise the profile-fidelity check will have flagged it.',
    );
    return;
  }

  const noFade = scaffolds.filter((s) => !s?.fade_plan || isPlaceholder(s.fade_plan) || s.fade_plan.trim().length < 10);
  if (noFade.length) {
    add(
      'scaffolds-fade',
      'learning-goals',
      FAIL,
      `${noFade.length} scaffold(s) with no real fade plan: ${noFade.map((s) => s.id ?? '?').join(', ')}`,
      'A support that never comes off is a permanent accommodation — move those to the profile\'s needs.accommodations. Otherwise say how and when it fades.',
    );
    return;
  }

  // A date-only fade plan is a plan to forget.
  const dateOnly = scaffolds.filter((s) => /^(week|by week|after week)\s*\d+\.?$/i.test(s.fade_plan.trim()));
  if (dateOnly.length) {
    add(
      'scaffolds-fade',
      'learning-goals',
      WARN,
      `${dateOnly.length} fade plan(s) are just a date: ${dateOnly.map((s) => s.id).join(', ')}`,
      'Use a trigger instead — "once she drafts two sections without a frame" tells you what to watch for.',
    );
    return;
  }

  if (scaffolds.length > 5) {
    add(
      'scaffolds-fade',
      'learning-goals',
      WARN,
      `${scaffolds.length} scaffolds is a lot to run at once.`,
      'Check they aren\'t all active simultaneously — the learner has to be able to hold the system in mind.',
    );
    return;
  }

  add('scaffolds-fade', 'learning-goals', PASS, `All ${scaffolds.length} scaffold(s) have a fade plan.`);
}

/** 12. Choice matches the learner's appetite. */
function checkChoiceCalibration(data, profile, add) {
  const calibrated = data.voice_and_choice?.calibrated_for;
  const appetite = profile?.preferences?.choice_appetite;

  if (!calibrated) {
    add('choice-calibration', 'voice-and-choice', FAIL, 'voice_and_choice.calibrated_for is missing.');
    return;
  }
  if (appetite && calibrated !== appetite) {
    add(
      'choice-calibration',
      'voice-and-choice',
      FAIL,
      `Plan is calibrated for '${calibrated}' choice but the profile says the learner's appetite is '${appetite}'.`,
      'Match them, or change the profile if your read of the learner has changed.',
    );
    return;
  }

  const total = ['content', 'process', 'product']
    .flatMap((k) => data.voice_and_choice?.[k] ?? [])
    .filter((c) => c && !isPlaceholder(c)).length;

  if (total === 0) {
    add('choice-calibration', 'voice-and-choice', FAIL, 'No actual choices listed in voice_and_choice.');
    return;
  }

  if (appetite === 'low' && !data.voice_and_choice?.widens_when) {
    add(
      'choice-calibration',
      'voice-and-choice',
      WARN,
      'Low choice appetite, but no widens_when — choice should grow during the project, not stay fixed.',
      'Name what has to happen before you offer more.',
    );
    return;
  }

  add('choice-calibration', 'voice-and-choice', PASS, `${total} real choices, calibrated for '${calibrated}'.`);
}

/** 13. Standards resolve, and something new is being learned. */
function checkStandards(data, profile, add) {
  const standards = data.learning_goals?.standards ?? [];
  if (!standards.length) {
    add('standards-resolve', 'learning-goals', FAIL, 'No standards in learning_goals.');
    return;
  }

  const jurisdiction = standards[0]?.jurisdiction ?? profile?.jurisdiction ?? 'Multi-State';
  const result = checkCodes(standards, jurisdiction);

  if (result.unresolved.length) {
    add(
      'standards-resolve',
      'learning-goals',
      FAIL,
      `Standards code(s) that don't resolve in '${jurisdiction}': ${result.unresolved.map((t) => t.code).join(', ')}`,
      'Find the real code with `pbl standards search`, or set code: TBD and say so. An invented code that looks real is worse than none.',
    );
    return;
  }

  // Nothing new being learned?
  const statuses = (profile?.standards_targets ?? []).map((t) => t.status).filter(Boolean);
  if (statuses.length && statuses.every((s) => s === 'secure')) {
    add(
      'standards-resolve',
      'learning-goals',
      WARN,
      'Every standard in the profile is already marked `secure` — the project may not teach anything new.',
      'A project should stretch at least one not-started or developing standard.',
    );
    return;
  }

  const unassessed = standards.filter((s) => !s.assessed_by || isPlaceholder(s.assessed_by));
  if (unassessed.length) {
    add(
      'standards-resolve',
      'learning-goals',
      WARN,
      `${unassessed.length} standard(s) have no assessed_by: ${unassessed.map((s) => s.code).join(', ')}`,
      'If you can\'t name what provides evidence for a standard, it isn\'t really in the project.',
    );
    return;
  }

  const detail = result.skipped
    ? `${standards.length} standard(s); '${jurisdiction}' isn't bundled locally so codes weren't checked`
    : `${result.resolved.length} code(s) resolved${result.tbd.length ? `, ${result.tbd.length} marked TBD` : ''}`;
  add('standards-resolve', 'learning-goals', result.skipped ? WARN : PASS, detail);
}

/** 14. The support plan is real. */
function checkSupportPlan(data, add) {
  const plan = data.support_plan;
  const stuck = (plan?.stuck_protocol ?? '').trim();

  if (!stuck || isPlaceholder(stuck)) {
    add(
      'support-plan-complete',
      'critique-and-revision',
      FAIL,
      'support_plan.stuck_protocol is empty.',
      'The learner stalling is the single most common way a solo project dies. Decide the escalation now, while you\'re calm. See the stuck-ladder scaffold.',
    );
    return;
  }
  if (stuck.length < 25) {
    add(
      'support-plan-complete',
      'critique-and-revision',
      WARN,
      `stuck_protocol is very short ("${stuck}").`,
      '"Help them" is not a protocol. Write the steps in order.',
    );
    return;
  }
  if (!plan?.adult_role || isPlaceholder(plan.adult_role)) {
    add('support-plan-complete', 'critique-and-revision', FAIL, 'support_plan.adult_role is empty.');
    return;
  }

  add('support-plan-complete', 'critique-and-revision', PASS, 'Support plan has a role, a cadence, and a stuck protocol.');
}

/** 15. The prose sections exist and were written. */
function checkBodySections(body, add) {
  const required = ['Project Summary', 'Why This Project For This Learner', 'Week-by-Week Plan', 'Notes & Adaptations'];
  const missing = required.filter((heading) => !new RegExp(`^##\\s+${escapeRegExp(heading)}`, 'im').test(body));

  if (missing.length) {
    add(
      'body-sections',
      'learning-goals',
      FAIL,
      `Missing required body heading(s): ${missing.join(', ')}`,
      'These carry the reasoning that structured data can\'t.',
    );
    return;
  }

  // "Why This Project For This Learner" still holding template guidance?
  const why = /^##\s+Why This Project For This Learner\s*$([\s\S]*?)(?=^##\s|\Z)/im.exec(body)?.[1] ?? '';
  const cleaned = why.replace(/\[[^\]]*\]/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  if (cleaned.length < 80) {
    add(
      'body-sections',
      'authenticity',
      WARN,
      '"Why This Project For This Learner" is empty or still template text.',
      'This is the section you will actually want in six months, and the one everybody skips.',
    );
    return;
  }

  add('body-sections', 'learning-goals', PASS, 'All required body sections present and written.');
}

// ── Helpers ──────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'they', 'them', 'their', 'about',
  'into', 'over', 'when', 'what', 'which', 'because', 'been', 'being', 'have', 'has',
  'her', 'his', 'she', 'him', 'likes', 'like', 'loves', 'love', 'enjoys', 'enjoy',
  'very', 'really', 'always', 'often', 'will', 'wants', 'want', 'doing', 'does',
  'own', 'out', 'all', 'lot', 'lots', 'more', 'most', 'same', 'than', 'then', 'there',
  'learner', 'student', 'child', 'project', 'work', 'thing', 'things', 'something',
  'interest', 'interests', 'interested',
]);

function significantWords(text) {
  return new Set(
    String(text)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .map((w) => w.replace(/(ing|ed|es|s)$/, ''))   // crude stem — enough for matching
      .filter((w) => w.length >= 4 && !STOPWORDS.has(w)),
  );
}

/**
 * Do two strings share a meaningful word?
 *
 * Used to check that `personal_connection` actually references an interest,
 * rather than asserting "connects to student interests". Crude on purpose: a
 * real semantic match would need a model, and a false pass here is worse than
 * a false flag the author can dismiss.
 */
function sharesSignificantWord(a, b) {
  const wordsB = significantWords(b);
  if (!wordsB.size) return false;
  for (const word of significantWords(a)) if (wordsB.has(word)) return true;
  return false;
}

function collectNeedTags(profile) {
  const needs = profile?.needs ?? {};
  if (needs.none === true) return [];
  return [
    ...(needs.executive_function ?? []),
    ...(needs.language_supports ?? []),
  ].filter((t) => t && !isPlaceholder(t));
}

function truncate(text, n) {
  const s = String(text);
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export { FAIL, PASS, WARN };
