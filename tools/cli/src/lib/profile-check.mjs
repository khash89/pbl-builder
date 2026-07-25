/**
 * Learner profile usability checks.
 *
 * Schema validation says the profile is well-formed. These checks say whether
 * it's actually usable for designing a project — which is a different and more
 * important question.
 *
 * The single highest-value check here is interest specificity. "Sports" and
 * "reading" produce generic projects, reliably, and no amount of good design
 * downstream recovers from it.
 */

import path from 'node:path';
import { isPlaceholder, readFrameworkYaml } from './repo.mjs';
import { checkCodes } from './standards.mjs';

const FAIL = 'fail';
const WARN = 'warn';
const PASS = 'pass';

/**
 * Interests too generic to design from. Matched as the WHOLE value — "reading"
 * fails, "reading the same three shark books over and over" passes.
 */
const VAGUE_INTERESTS = new Set([
  'reading', 'books', 'sports', 'music', 'art', 'drawing', 'games', 'gaming',
  'video games', 'animals', 'science', 'math', 'maths', 'history', 'computers',
  'technology', 'tech', 'movies', 'films', 'tv', 'youtube', 'friends', 'outdoors',
  'nature', 'cooking', 'building', 'making', 'creating', 'learning', 'school',
  'writing', 'dancing', 'singing', 'swimming', 'football', 'soccer', 'basketball',
  'anime', 'cars', 'space', 'dinosaurs', 'lego', 'minecraft', 'roblox',
]);

/** Strengths that describe a trait rather than an observable behaviour. */
const VAGUE_STRENGTHS = new Set([
  'smart', 'clever', 'bright', 'intelligent', 'gifted', 'good student',
  'hard worker', 'hardworking', 'creative', 'kind', 'nice', 'funny', 'curious',
  'motivated', 'quick learner', 'fast learner', 'good at school', 'talented',
  'well behaved', 'well-behaved', 'helpful', 'enthusiastic', 'eager',
]);

export function checkProfile({ data }) {
  const findings = [];
  const add = (id, status, message, hint) =>
    findings.push({ id, status, message, ...(hint ? { hint } : {}) });

  checkInterests(data, add);
  checkStrengths(data, add);
  checkSuccessSkill(data, add);
  checkStandardsTargets(data, add);
  checkNeeds(data, add);
  checkContext(data, add);
  checkGoals(data, add);
  checkPrivacy(data, add);

  const summary = {
    total: findings.length,
    pass: findings.filter((f) => f.status === PASS).length,
    warn: findings.filter((f) => f.status === WARN).length,
    fail: findings.filter((f) => f.status === FAIL).length,
  };

  return { findings, summary };
}

function checkInterests(data, add) {
  const interests = (data.interests ?? []).filter((i) => i && !isPlaceholder(i));

  if (interests.length < 2) {
    add(
      'interests-specific',
      FAIL,
      `Only ${interests.length} usable interest(s). Needs at least 2.`,
      'This is the field that most determines whether the project lands.',
    );
    return;
  }

  const vague = interests.filter((i) => VAGUE_INTERESTS.has(normalize(i)));
  if (vague.length) {
    add(
      'interests-specific',
      FAIL,
      `Too generic to design from: ${vague.map((v) => `"${v}"`).join(', ')}`,
      'Write what you\'d see them actually doing. Not "animals" but "watches the same shark documentary on a loop and corrects it". Not "sports" but "argues about transfers with his uncle for hours".',
    );
    return;
  }

  const thin = interests.filter((i) => i.trim().split(/\s+/).length < 3);
  if (thin.length) {
    add(
      'interests-specific',
      WARN,
      `Very short, so possibly thin: ${thin.map((v) => `"${v}"`).join(', ')}`,
      'A few more words usually reveals the shape of the interest, which is what the project hangs on.',
    );
    return;
  }

  add('interests-specific', PASS, `${interests.length} specific interests.`);
}

function checkStrengths(data, add) {
  const strengths = (data.strengths ?? []).filter((s) => s && !isPlaceholder(s));

  if (!strengths.length) {
    add('strengths-observable', FAIL, 'No strengths listed.');
    return;
  }

  const vague = strengths.filter((s) => VAGUE_STRENGTHS.has(normalize(s)));
  if (vague.length) {
    add(
      'strengths-observable',
      FAIL,
      `Trait rather than behaviour: ${vague.map((v) => `"${v}"`).join(', ')}`,
      'Describe something you watched them do. "Smart" gives you nothing to build on; "redoes a drawing five times to get it right" gives you a project.',
    );
    return;
  }

  add('strengths-observable', PASS, `${strengths.length} observable strength(s).`);
}

function checkSuccessSkill(data, add) {
  const target = data.success_skill_target;
  if (!target?.skill) {
    add('one-success-skill', FAIL, 'No success skill named.');
    return;
  }

  let skillData;
  try {
    skillData = readFrameworkYaml(path.join('success-skills', `${target.skill}.yaml`));
  } catch {
    add('one-success-skill', FAIL, `Unknown success skill '${target.skill}'.`);
    return;
  }

  const valid = (skillData.dimensions ?? []).map((d) => d.id);
  const bogus = (target.dimensions ?? []).filter((d) => !valid.includes(d));
  if (bogus.length) {
    add(
      'one-success-skill',
      FAIL,
      `Unknown dimension(s) for ${target.skill}: ${bogus.join(', ')}`,
      `Valid ids: ${valid.join(', ')}`,
    );
    return;
  }

  // Collaboration in a solo setting is usually not assessable.
  const setting = data.context?.setting;
  const workMode = data.preferences?.work_mode;
  if (
    target.skill === 'collaboration' &&
    workMode === 'solo' &&
    ['homeschool', 'tutoring'].includes(setting)
  ) {
    add(
      'one-success-skill',
      WARN,
      'Targeting collaboration with work_mode: solo in a one-learner setting.',
      'Collaboration needs a genuine second party with their own stake and the standing to disagree — an adult who can overrule the learner is not a collaborator. Read the solo_warning in framework/success-skills/collaboration.yaml. Consider complex-communication or self-directed-learning instead.',
    );
    return;
  }

  if ((target.dimensions ?? []).length === 3) {
    add(
      'one-success-skill',
      WARN,
      'Three dimensions is the maximum, and usually too many.',
      'One or two, taught properly, beats three mentioned.',
    );
    return;
  }

  add(
    'one-success-skill',
    PASS,
    `One skill (${target.skill}), ${(target.dimensions ?? []).length} dimension(s).`,
  );
}

function checkStandardsTargets(data, add) {
  const targets = (data.standards_targets ?? []).filter((t) => t?.code);
  if (!targets.length) {
    add('standards-resolve', FAIL, 'No standards targets.');
    return;
  }

  const jurisdiction = data.jurisdiction ?? 'Multi-State';
  const result = checkCodes(targets, jurisdiction);

  if (result.unresolved.length) {
    add(
      'standards-resolve',
      FAIL,
      `Code(s) that don't resolve in '${jurisdiction}': ${result.unresolved.map((t) => t.code).join(', ')}`,
      `Find the real code with: pbl standards search "<keyword>" --grade ${data.learner?.grade ?? 'N'} --jurisdiction "${jurisdiction}"\nOr set code: TBD if you'll confirm it later. An invented code that looks real is worse than none — it looks authoritative and nobody checks it.`,
    );
    return;
  }

  if (result.skipped) {
    add(
      'standards-resolve',
      WARN,
      `Jurisdiction '${jurisdiction}' isn't available locally, so codes weren't verified.`,
      `Bundled: Multi-State. Fetch a US state with: pbl standards sync --jurisdiction "${jurisdiction}"\nFor a non-US framework this is expected — just make sure the codes came from your own framework documents, not from a guess.`,
    );
    return;
  }

  const statuses = targets.map((t) => t.status);
  if (statuses.length && statuses.every((s) => s === 'secure')) {
    add(
      'standards-resolve',
      WARN,
      'Every standard is marked `secure` — nothing here is new learning.',
      'Include at least one not-started or developing standard, or the project has no academic stretch.',
    );
    return;
  }

  if (result.tbd.length) {
    add(
      'standards-resolve',
      WARN,
      `${result.resolved.length} code(s) resolved, ${result.tbd.length} marked TBD.`,
      'TBD is fine as an honest placeholder. Confirm them against your framework before you launch.',
    );
    return;
  }

  add('standards-resolve', PASS, `All ${result.resolved.length} code(s) resolved against ${jurisdiction}.`);
}

function checkNeeds(data, add) {
  const needs = data.needs ?? {};
  const tags = [...(needs.executive_function ?? []), ...(needs.language_supports ?? [])].filter(
    (t) => t && !isPlaceholder(t),
  );

  if (needs.none === true) {
    if (tags.length) {
      add('needs-coherent', FAIL, 'needs.none is true but need tags are also listed. Pick one.');
      return;
    }
    add('needs-coherent', PASS, 'No additional needs, stated explicitly.');
    return;
  }

  const hasOtherNeeds =
    (needs.reading_level && !isPlaceholder(needs.reading_level)) ||
    (needs.accommodations ?? []).some((a) => a && !isPlaceholder(a));

  if (!tags.length && !hasOtherNeeds) {
    add(
      'needs-coherent',
      WARN,
      'The needs section is empty but needs.none is not set.',
      'Set `needs: { none: true }` to say "nothing to note" explicitly. Otherwise it reads as "not filled in yet", and the plan will have no scaffolds.',
    );
    return;
  }

  if (tags.length > 6) {
    add(
      'needs-coherent',
      WARN,
      `${tags.length} need tags. Every one requires a scaffold in the plan.`,
      'Consider listing the ones that actually block this project. Six scaffolds running at once is more than a learner can hold.',
    );
    return;
  }

  add('needs-coherent', PASS, `${tags.length} need tag(s), each of which will need a scaffold.`);
}

function checkContext(data, add) {
  // Guard on the type: an unfilled template holds the string "[number]" here,
  // and string arithmetic would silently report NaN hours.
  const weeks = typeof data.constraints?.total_weeks === 'number' ? data.constraints.total_weeks : null;
  const hours = typeof data.context?.weekly_hours === 'number' ? data.context.weekly_hours : null;

  if (weeks === null || hours === null) {
    add('timeline-viable', WARN, 'Timeline is incomplete — total_weeks and weekly_hours must both be numbers.');
    return;
  }

  if (weeks < 3) {
    add(
      'timeline-viable',
      WARN,
      `${weeks} week(s) is very short for a project with sustained inquiry.`,
      'It can work, but expect to compress build_knowledge and protect the critique cycle. Under 2 weeks, consider whether this is really a project.',
    );
    return;
  }

  const total = weeks * hours;
  if (total < 15) {
    add(
      'timeline-viable',
      WARN,
      `About ${total} total hours (${weeks} weeks × ${hours} h/week). Tight for a public product.`,
      'Either narrow the product or add time. A rushed public product undermines the element that motivates the whole project.',
    );
    return;
  }

  add('timeline-viable', PASS, `About ${total} total hours across ${weeks} weeks.`);
}

function checkGoals(data, add) {
  const goals = data.goals_from_adult;
  if (!goals || isPlaceholder(goals)) {
    add('goals-stated', FAIL, 'goals_from_adult is empty.');
    return;
  }
  if (goals.trim().length < 25) {
    add(
      'goals-stated',
      WARN,
      'goals_from_adult is very brief.',
      'Worth a couple of sentences — it often surfaces the real goal, which is frequently not academic.',
    );
    return;
  }
  add('goals-stated', PASS, 'Adult goals stated.');
}

/**
 * Catch information that shouldn't be in a learner file.
 *
 * Deliberately conservative — a false positive here is annoying but a false
 * negative means clinical information about a child sitting in a file that
 * might get synced, backed up, or committed.
 */
function checkPrivacy(data, add) {
  const scan = [
    data.needs?.reading_level,
    ...(data.needs?.accommodations ?? []),
    ...(data.needs?.sensory_or_physical ?? []),
    data.goals_from_adult,
    data.success_skill_target?.evidence,
  ]
    .filter((v) => typeof v === 'string')
    .join(' ');

  const flags = [];
  if (/\b(IEP|504 plan|IPP|EHCP)\b/i.test(scan)) flags.push('an IEP/504/EHCP reference');
  if (/\b(diagnos(ed|is)|ADHD|ASD|autis|dyslex|dyscalcul|dysgraph|ODD|OCD|PTSD)\b/i.test(scan)) {
    flags.push('a diagnosis or clinical label');
  }
  if (/\b(mg|dosage|prescri|medicat|Ritalin|Adderall|Concerta)\b/i.test(scan)) flags.push('medication information');
  if (/\b(percentile|standard score|SS ?\d{2,3}|IQ ?\d{2,3}|FSIQ)\b/i.test(scan)) flags.push('assessment scores');

  // A full name in the name field.
  const name = data.learner?.name ?? '';
  if (/^\s*\S+\s+\S+/.test(name) && !/^(mr|mrs|ms|dr)\b/i.test(name)) {
    flags.push('what looks like a full name');
  }

  if (flags.length) {
    add(
      'privacy-clean',
      WARN,
      `This profile appears to contain ${flags.join(', ')}.`,
      'Describe function instead: "loses the thread on multi-step directions" rather than a label. The functional description is what selects scaffolds; the label doesn\'t, and it carries risk in a file that might get synced or backed up. Use a first name or pseudonym. See learners/README.md.',
    );
    return;
  }

  add('privacy-clean', PASS, 'No diagnostic labels, scores, or full names detected.');
}

function normalize(value) {
  return String(value).toLowerCase().trim().replace(/[.!,]+$/, '');
}

export { FAIL, PASS, WARN };
