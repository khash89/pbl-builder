#!/usr/bin/env node
/**
 * pbl — design Gold Standard PBL projects around one learner.
 *
 * Every command supports --json for machine consumers. Exit code is 0 on pass,
 * 1 on failure, so this composes in shell pipelines and CI.
 */

import { Command } from 'commander';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

import { PblError, findRepoRoot, readDoc, readFrameworkYaml, repoPath, slugify } from './lib/repo.mjs';
import { validatePlan, validateProfile } from './lib/schema.mjs';
import { findPlaceholders } from './lib/repo.mjs';
import { checkProfile } from './lib/profile-check.mjs';
import { reviewPlan } from './lib/review.mjs';
import * as std from './lib/standards.mjs';
import { c, heading, json, printError, printFinding, printSummary } from './lib/output.mjs';

const program = new Command();

program
  .name('pbl')
  .description(
    'Design Gold Standard Project Based Learning projects around one learner.\n' +
      'Start with a learner profile; the project is designed outward from it.',
  )
  .version('0.1.0')
  .showHelpAfterError();

// ─────────────────────────────────────────────────────────────────────
// pbl profile
// ─────────────────────────────────────────────────────────────────────
const profile = program.command('profile').description('Create and check learner profiles');

profile
  .command('new <name>')
  .description('Scaffold a learner profile in learners/<slug>/')
  .option('-d, --dir <path>', 'parent directory (default: learners/)')
  .option('--force', 'overwrite an existing profile')
  .action((name, options) => {
    const root = findRepoRoot();
    const slug = slugify(name);
    const dir = options.dir ? path.resolve(options.dir) : path.join(root, 'learners', slug);
    const target = path.join(dir, 'learner-profile.md');

    if (existsSync(target) && !options.force) {
      throw new PblError(`${path.relative(root, target)} already exists.`, 'Pass --force to overwrite it.');
    }

    mkdirSync(dir, { recursive: true });
    const template = readFileSync(repoPath('templates', 'learner-profile.md'), 'utf8')
      .replace('name: "[First name or pseudonym]"', `name: "${name}"`)
      .replace('updated: "[YYYY-MM-DD]"', `updated: "${today()}"`)
      .replace('# Learner Profile: [Name]', `# Learner Profile: ${name}`);
    writeFileSync(target, template, 'utf8');

    const rel = path.relative(process.cwd(), target);
    console.log(`\n${c.green('Created')} ${rel}\n`);
    console.log('Next:');
    console.log(`  1. Fill it in. ${c.grey('The interests field matters most — be specific.')}`);
    console.log(`  2. ${c.bold(`pbl profile check ${rel}`)}`);
    console.log(`  3. ${c.bold(`pbl plan new --profile ${rel}`)}`);
    console.log(c.grey('\nHow to write a profile that produces a good project: docs/15-learner-profiles.md\n'));
  });

profile
  .command('check <file>')
  .description('Validate a learner profile and check it is actually usable')
  .option('--json', 'machine-readable output')
  .action((file, options) => {
    const doc = readDoc(file);
    const schema = validateProfile(doc.data);
    const usability = checkProfile(doc);

    const failed = !schema.ok || usability.summary.fail > 0;

    if (options.json) {
      json({
        file: path.relative(process.cwd(), doc.filePath),
        ok: !failed,
        schema: { ok: schema.ok, errors: schema.errors },
        checks: usability.findings,
        summary: usability.summary,
      });
      process.exitCode = failed ? 1 : 0;
      return;
    }

    console.log(`\n${c.bold(path.relative(process.cwd(), doc.filePath))}`);

    if (!schema.ok) {
      heading('Schema');
      for (const error of schema.errors) {
        console.log(`  ${c.red('✗')} ${c.bold(error.path)}: ${error.message}`);
        if (error.hint) console.log(c.grey(`      → ${error.hint}`));
      }
    }

    heading('Usability');
    for (const finding of usability.findings) printFinding(finding);

    printSummary(
      {
        ...usability.summary,
        fail: usability.summary.fail + (schema.ok ? 0 : schema.errors.length),
        total: usability.summary.total + (schema.ok ? 0 : schema.errors.length),
      },
      { label: 'checks' },
    );
    process.exitCode = failed ? 1 : 0;
  });

// ─────────────────────────────────────────────────────────────────────
// pbl plan
// ─────────────────────────────────────────────────────────────────────
const plan = program.command('plan').description('Create project plans');

plan
  .command('new')
  .description('Scaffold a project plan, pre-filled from a learner profile')
  .requiredOption('-p, --profile <file>', 'path to the learner profile')
  .option('-o, --out <file>', 'output path (default: alongside the profile)')
  .option('--force', 'overwrite an existing plan')
  .action((options) => {
    const doc = readDoc(options.profile);
    const schema = validateProfile(doc.data);
    if (!schema.ok) {
      throw new PblError(
        'That learner profile does not validate, so a plan built from it would inherit the problems.',
        `Run: pbl profile check ${options.profile}`,
      );
    }

    const target = options.out
      ? path.resolve(options.out)
      : path.join(path.dirname(doc.filePath), 'project-plan.md');

    if (existsSync(target) && !options.force) {
      throw new PblError(`${path.relative(process.cwd(), target)} already exists.`, 'Pass --force to overwrite it.');
    }

    const { text, notes } = prefillPlan(doc.data, doc.filePath, target);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, text, 'utf8');

    const rel = path.relative(process.cwd(), target);
    console.log(`\n${c.green('Created')} ${rel}`);
    console.log(c.grey(`Pre-filled from ${path.relative(process.cwd(), doc.filePath)}\n`));

    if (notes.length) {
      console.log('Carried over from the profile:');
      for (const note of notes) console.log(`  ${c.green('·')} ${note}`);
      console.log('');
    }

    console.log('Still yours to decide:');
    console.log('  · the driving question');
    console.log('  · which product, from the menu in the file');
    console.log('  · the audience');
    console.log('  · the four phases of the project path');
    console.log(
      c.grey(
        `\nA fresh scaffold is SUPPOSED to fail validation — that's how you find what still needs filling:\n  ${c.bold(`pbl validate ${rel}`)}\n`,
      ),
    );
  });

// ─────────────────────────────────────────────────────────────────────
// pbl validate
// ─────────────────────────────────────────────────────────────────────
program
  .command('validate <file>')
  .description('Check a project plan is well-formed (schema, headings, placeholders)')
  .option('--json', 'machine-readable output')
  .action((file, options) => {
    const doc = readDoc(file);
    const schema = validatePlan(doc.data);
    const placeholders = findPlaceholders(doc.data);

    const requiredHeadings = ['Project Summary', 'Why This Project For This Learner', 'Week-by-Week Plan', 'Notes & Adaptations'];
    const missingHeadings = requiredHeadings.filter(
      (h) => !new RegExp(`^##\\s+${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'im').test(doc.body),
    );

    const failed = !schema.ok || placeholders.length > 0 || missingHeadings.length > 0;

    if (options.json) {
      json({
        file: path.relative(process.cwd(), doc.filePath),
        ok: !failed,
        schema: { ok: schema.ok, errors: schema.errors },
        placeholders,
        missing_headings: missingHeadings,
      });
      process.exitCode = failed ? 1 : 0;
      return;
    }

    console.log(`\n${c.bold(path.relative(process.cwd(), doc.filePath))}`);

    if (schema.ok) {
      console.log(`  ${c.green('✓')} Schema valid`);
    } else {
      heading(`Schema (${schema.errors.length} problem${schema.errors.length === 1 ? '' : 's'})`);
      for (const error of schema.errors) {
        console.log(`  ${c.red('✗')} ${c.bold(error.path)}: ${error.message}`);
        if (error.hint) console.log(c.grey(`      → ${error.hint}`));
      }
    }

    if (missingHeadings.length) {
      heading('Body sections');
      for (const h of missingHeadings) console.log(`  ${c.red('✗')} missing heading: ${c.bold(`## ${h}`)}`);
    }

    if (placeholders.length) {
      heading(`Unfilled placeholders (${placeholders.length})`);
      for (const p of placeholders.slice(0, 40)) {
        console.log(`  ${c.red('✗')} ${c.bold(p.path)} ${c.grey(`= ${truncate(p.value, 60)}`)}`);
      }
      if (placeholders.length > 40) console.log(c.grey(`  … and ${placeholders.length - 40} more`));
    }

    if (!failed) {
      console.log(`\n  ${c.green('Well-formed.')} ${c.grey('Now check whether it is any good:')}`);
      console.log(`  ${c.bold(`pbl review ${path.relative(process.cwd(), doc.filePath)}`)}\n`);
    } else {
      console.log('');
    }

    process.exitCode = failed ? 1 : 0;
  });

// ─────────────────────────────────────────────────────────────────────
// pbl review
// ─────────────────────────────────────────────────────────────────────
program
  .command('review <file>')
  .description('Assess a project plan against the Essential Project Design Elements')
  .option('--json', 'machine-readable output')
  .option('-v, --verbose', 'show hints on passing checks too')
  .option('--strict', 'treat warnings as failures')
  .action((file, options) => {
    const doc = readDoc(file);
    const { findings, summary } = reviewPlan(doc);
    const failed = summary.fail > 0 || (options.strict && summary.warn > 0);

    if (options.json) {
      json({
        file: path.relative(process.cwd(), doc.filePath),
        ok: !failed,
        findings,
        summary,
      });
      process.exitCode = failed ? 1 : 0;
      return;
    }

    console.log(`\n${c.bold(path.relative(process.cwd(), doc.filePath))}`);
    if (!summary.profile_loaded) {
      console.log(
        c.yellow('  Note: the learner profile could not be read, so profile-fidelity checks were skipped.'),
      );
    }

    // Group by design element so the output maps onto the framework.
    let elements = [];
    try {
      elements = readFrameworkYaml('design-elements.yaml').elements ?? [];
    } catch { /* fall back to flat output */ }

    const byElement = new Map();
    for (const finding of findings) {
      if (!byElement.has(finding.element)) byElement.set(finding.element, []);
      byElement.get(finding.element).push(finding);
    }

    const order = elements.length ? elements.map((e) => e.id) : [...byElement.keys()];
    for (const id of order) {
      const group = byElement.get(id);
      if (!group?.length) continue;
      const name = elements.find((e) => e.id === id)?.name ?? id;
      heading(name);
      for (const finding of group) printFinding(finding, { verbose: options.verbose });
    }
    for (const [id, group] of byElement) {
      if (order.includes(id)) continue;
      heading(id);
      for (const finding of group) printFinding(finding, { verbose: options.verbose });
    }

    printSummary(summary, { label: 'checks' });
    console.log('');
    process.exitCode = failed ? 1 : 0;
  });

// ─────────────────────────────────────────────────────────────────────
// pbl standards
// ─────────────────────────────────────────────────────────────────────
const standards = program.command('standards').description('Look up academic standards');

standards
  .command('search [query]')
  .description('Search standards by keyword or code')
  .option('-g, --grade <grade>', 'filter by grade (K, 1-12)')
  .option('-s, --subject <subject>', 'filter by subject')
  .option('-f, --framework <framework>', 'filter by framework (NGSS, CCSS.MATH, C3, WIDA…)')
  .option('-j, --jurisdiction <name>', 'jurisdiction', 'Multi-State')
  .option('-n, --limit <number>', 'max results', '20')
  .option('--json', 'machine-readable output')
  .action((query, options) => {
    const results = std.search(query ?? '', {
      jurisdiction: options.jurisdiction,
      grade: options.grade,
      subject: options.subject,
      framework: options.framework,
      limit: Number(options.limit),
    });

    if (options.json) {
      json({ query: query ?? null, jurisdiction: options.jurisdiction, count: results.length, results });
      return;
    }

    if (!results.length) {
      console.log(c.yellow(`\nNo matches for "${query ?? ''}" in ${options.jurisdiction}.`));
      console.log(c.grey('Try a broader keyword, drop --grade, or check `pbl standards list`.\n'));
      return;
    }

    console.log(`\n${c.bold(`${results.length} match${results.length === 1 ? '' : 'es'}`)} ${c.grey(`in ${options.jurisdiction}`)}\n`);
    for (const record of results) {
      const grades = record.grades.join(', ');
      console.log(`${c.green(record.code)}  ${c.grey(`${record.framework} · grade ${grades}`)}`);
      console.log(`  ${wrapText(record.text, 76, '  ')}`);
      console.log('');
    }
    console.log(c.grey('Data: Learning Commons Knowledge Graph (CC BY 4.0). See framework/standards/PROVENANCE.md\n'));
  });

standards
  .command('show <code>')
  .description('Show one standard in full')
  .option('-j, --jurisdiction <name>', 'jurisdiction', 'Multi-State')
  .option('--json', 'machine-readable output')
  .action((code, options) => {
    const record = std.resolveCode(code, options.jurisdiction);
    if (!record) {
      throw new PblError(
        `No standard '${code}' in ${options.jurisdiction}.`,
        `Search for it: pbl standards search "${code}" --jurisdiction "${options.jurisdiction}"`,
      );
    }

    if (options.json) {
      json(record);
      return;
    }

    console.log(`\n${c.bold(c.green(record.code))}  ${c.grey(record.framework)}`);
    console.log(c.grey(`${record.subject} · grade ${record.grades.join(', ')} · ${record.jurisdiction} · ${record.language}`));
    console.log(`\n${wrapText(record.text, 78, '')}`);
    console.log(c.grey(`\n${wrapText(record.attribution, 78, '')}\n`));
  });

standards
  .command('list')
  .description('Show which standards sets are available locally')
  .option('--json', 'machine-readable output')
  .action((options) => {
    const index = readFrameworkYaml(path.join('standards', 'index.yaml'));
    const local = std.localJurisdictions();

    if (options.json) {
      json({ bundled: index.jurisdictions, cached: local.cached, available_on_demand: index.available_on_demand });
      return;
    }

    console.log(`\n${c.bold('Bundled')}`);
    for (const j of index.jurisdictions ?? []) {
      console.log(`  ${c.green(j.name)} ${c.grey(`— ${j.rows} standards`)}`);
      for (const file of j.files ?? []) {
        const frameworks = (file.frameworks ?? []).map((f) => `${f.id} (${f.rows})`).join(', ');
        console.log(`    ${c.grey(`${file.subject}: ${frameworks}`)}`);
      }
    }

    if (local.cached.length) {
      console.log(`\n${c.bold('Cached locally')}`);
      for (const name of local.cached) console.log(`  ${c.green(name)}`);
    }

    console.log(`\n${c.bold('Available on demand')} ${c.grey('(pbl standards sync --jurisdiction "<name>")')}`);
    const list = index.available_on_demand?.jurisdictions ?? [];
    console.log(c.grey(`  ${list.join(', ')}`));
    console.log(c.grey('\nData: Learning Commons Knowledge Graph (CC BY 4.0).\n'));
  });

standards
  .command('sync')
  .description('Fetch and cache a standards jurisdiction from the Knowledge Graph')
  .requiredOption('-j, --jurisdiction <name>', 'jurisdiction to fetch, e.g. "Texas"')
  .option('-i, --input <file>', 'use an already-downloaded nodes.jsonl instead of fetching')
  .option('-o, --out <dir>', 'output directory (default: .cache/standards/<jurisdiction>)')
  .action(async (options) => {
    const { KG_EXPORT_URL, curate, writeSlice } = await import('./standards/curate.mjs');
    const root = findRepoRoot();
    const outDir = options.out
      ? path.resolve(options.out)
      : path.join(root, '.cache', 'standards', std.jurisdictionDir(options.jurisdiction));

    let input = options.input;
    if (!input) {
      const cacheDir = path.join(root, '.cache');
      mkdirSync(cacheDir, { recursive: true });
      input = path.join(cacheDir, 'kg-nodes.jsonl');

      if (existsSync(input)) {
        console.log(c.grey(`Using cached export: ${path.relative(root, input)}`));
      } else {
        console.log(`Downloading the Knowledge Graph export ${c.grey('(~292 MB, one time)')}`);
        console.log(c.grey(`  ${KG_EXPORT_URL}\n`));
        await download(KG_EXPORT_URL, input);
      }
    }

    console.log(`\nFiltering to ${c.bold(options.jurisdiction)}…`);
    const { bySubject, stats } = await curate({
      input,
      jurisdiction: options.jurisdiction,
      onProgress: (s) => process.stderr.write(`\r  ${s.linesRead.toLocaleString()} nodes read, ${s.kept} kept`),
    });
    process.stderr.write('\n');

    if (!bySubject.size) {
      throw new PblError(
        `No standards found for jurisdiction '${options.jurisdiction}'.`,
        'Check the exact spelling with `pbl standards list`. Names are case-sensitive, e.g. "Washington, D.C.".',
      );
    }

    const written = await writeSlice({ bySubject, outDir });
    console.log(`\n${c.green('Cached')} ${path.relative(process.cwd(), outDir)}`);
    for (const file of written) {
      console.log(`  ${file.file} ${c.grey(`— ${file.rows} standards, ${(file.bytes / 1024).toFixed(0)} KB`)}`);
    }
    console.log(
      c.grey(
        `\n${stats.kept} standards from ${stats.linesRead.toLocaleString()} nodes.\n` +
          'Data: Learning Commons Knowledge Graph (CC BY 4.0). Attribution is preserved on every record.\n' +
          `\nUse it: pbl standards search "<keyword>" --jurisdiction "${options.jurisdiction}"\n`,
      ),
    );
  });

// ─────────────────────────────────────────────────────────────────────
// pbl framework
// ─────────────────────────────────────────────────────────────────────
program
  .command('framework [id]')
  .description('Print framework data as JSON (design-elements, project-path, product-types, scaffolds, strategies…)')
  .option('--yaml', 'print YAML instead of JSON')
  // JSON is already the default here, but every other command takes --json and
  // a user following that convention shouldn't hit an error.
  .option('--json', 'print JSON (the default; accepted for consistency)')
  .action((id, options) => {
    const files = {
      manifest: 'manifest.yaml',
      'design-elements': 'design-elements.yaml',
      'teaching-practices': 'teaching-practices.yaml',
      'project-path': 'project-path.yaml',
      strategies: 'strategies.yaml',
      'product-types': 'product-types.yaml',
      scaffolds: 'scaffolds.yaml',
      collaboration: 'success-skills/collaboration.yaml',
      'critical-thinking': 'success-skills/critical-thinking.yaml',
      creativity: 'success-skills/creativity.yaml',
      'complex-communication': 'success-skills/complex-communication.yaml',
      'self-directed-learning': 'success-skills/self-directed-learning.yaml',
    };

    if (!id) {
      const manifest = readFrameworkYaml('manifest.yaml');
      if (options.yaml) console.log(stringifyYaml(manifest));
      else json(manifest);
      return;
    }

    const file = files[id];
    if (!file) {
      throw new PblError(`Unknown framework id '${id}'.`, `Available: ${Object.keys(files).join(', ')}`);
    }

    const data = readFrameworkYaml(file);
    if (options.yaml) console.log(stringifyYaml(data));
    else json(data);
  });

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

/**
 * Pre-fill a plan from a profile.
 *
 * Everything mechanically derivable gets carried across; every genuine design
 * decision stays a placeholder, so a fresh scaffold correctly fails validation.
 * The product menu is injected as a comment listing only the types matching the
 * learner's modes — that's the personalization made visible at scaffold time.
 */
function prefillPlan(profileData, profileFilePath, targetPath) {
  let text = readFileSync(repoPath('templates', 'project-plan.md'), 'utf8');
  const notes = [];

  const relProfile = `./${path.relative(path.dirname(targetPath), profileFilePath).split(path.sep).join('/')}`;
  text = text.replace('learner_profile: ./learner-profile.md', `learner_profile: ${relProfile}`);

  const grade = profileData.learner?.grade;
  if (grade) {
    text = text.replace('grade: "[from the profile]"', `grade: "${grade}"`);
    notes.push(`grade ${grade}`);
  }

  if (profileData.subjects?.length) {
    text = text.replace(
      'subjects:\n  - "[from the profile]"',
      `subjects:\n${profileData.subjects.map((s) => `  - "${s}"`).join('\n')}`,
    );
    notes.push(`subjects: ${profileData.subjects.join(', ')}`);
  }

  if (profileData.constraints?.total_weeks) {
    text = text.replace('weeks: [number]', `weeks: ${profileData.constraints.total_weeks}`);
  }
  if (profileData.context?.weekly_hours) {
    text = text.replace('hours_per_week: [number]', `hours_per_week: ${profileData.context.weekly_hours}`);
    notes.push(`${profileData.constraints?.total_weeks ?? '?'} weeks × ${profileData.context.weekly_hours} h/week`);
  }

  // Standards, verbatim from the profile — never re-typed, never invented.
  if (profileData.standards_targets?.length) {
    const block = profileData.standards_targets
      .map((t) =>
        [
          `    - framework: "${t.framework}"`,
          `      code: "${t.code}"`,
          `      text: "${String(t.text).replace(/"/g, '\\"')}"`,
          `      jurisdiction: "${profileData.jurisdiction ?? 'Multi-State'}"`,
          `      assessed_by: "[which product or assessment shows this]"`,
        ].join('\n'),
      )
      .join('\n');
    text = text.replace(
      /  standards:\n    - framework:[\s\S]*?assessed_by: "\[which product or assessment shows this\]"/,
      `  standards:\n${block}`,
    );
    notes.push(`${profileData.standards_targets.length} standard(s), copied verbatim`);
  }

  // The one success skill and its dimensions.
  const target = profileData.success_skill_target;
  if (target?.skill) {
    text = text
      .replace('skill: "[from the profile — must match]"', `skill: "${target.skill}"`)
      .replace(
        '    dimensions:\n      - "[from the profile — must match]"',
        `    dimensions:\n${(target.dimensions ?? []).map((d) => `      - "${d}"`).join('\n')}`,
      );
    notes.push(`success skill: ${target.skill} (${(target.dimensions ?? []).join(', ')})`);
  }

  const appetite = profileData.preferences?.choice_appetite;
  if (appetite) {
    text = text.replace('calibrated_for: "[low | medium | high]"', `calibrated_for: ${appetite}`);
    notes.push(`choice calibrated for '${appetite}'`);
  }

  // Product menu: only the types this learner is drawn to.
  const modes = profileData.preferences?.product_modes ?? [];
  if (modes.length) {
    const comfort = profileData.preferences?.audience_comfort;
    const catalogue = readFrameworkYaml('product-types.yaml').products ?? [];
    const matches = catalogue.filter((p) => (p.modes ?? []).some((m) => modes.includes(m)));

    const lines = [
      '# ── PRODUCT MENU FOR THIS LEARNER ─────────────────────────────',
      `# Filtered from framework/product-types.yaml by product_modes:`,
      `#   ${modes.join(', ')}`,
      '#',
      '# Let the LEARNER choose from these. Choosing for them defeats the point.',
      ...matches.map(
        (p) =>
          `#   ${p.id.padEnd(28)} effort:${String(p.effort).padEnd(7)} audience-pressure:${p.audience_pressure}`,
      ),
    ];
    if (comfort === 'low') {
      const gentle = matches.filter((p) => p.audience_pressure === 'low').map((p) => p.id);
      lines.push(
        '#',
        `# audience_comfort is LOW. Lowest-pressure options: ${gentle.join(', ') || '(none in this menu)'}`,
        '# Still build a comfort_ramp — do not drop the public audience.',
      );
    }
    lines.push('# ──────────────────────────────────────────────────────────────');

    text = text.replace('products:\n  primary:', `${lines.join('\n')}\nproducts:\n  primary:`);
    notes.push(`${matches.length} product types match their preferred modes`);
  }

  // Suggested scaffolds for the needs actually listed.
  const needTags = [
    ...(profileData.needs?.executive_function ?? []),
    ...(profileData.needs?.language_supports ?? []),
  ].filter(Boolean);

  if (needTags.length) {
    const library = readFrameworkYaml('scaffolds.yaml').scaffolds ?? [];

    // One scaffold often covers several needs (tiered-source-set handles both
    // reading-comprehension and academic-vocabulary). Group by scaffold id so
    // it appears once with every need it addresses, rather than duplicated.
    const chosen = new Map();
    for (const tag of needTags) {
      const match = library.find((s) => (s.addresses ?? []).includes(tag));
      if (!match) continue;
      if (!chosen.has(match.id)) chosen.set(match.id, { scaffold: match, tags: [] });
      chosen.get(match.id).tags.push(tag);
    }

    const blocks = [...chosen.values()].map(({ scaffold, tags }) =>
      [
        `  - id: ${scaffold.id}`,
        `    addresses: [${tags.map((t) => `"${t}"`).join(', ')}]`,
        `    phase: [${(scaffold.phases ?? ['build_knowledge']).join(', ')}]`,
        `    fade_plan: "${String(scaffold.fade ?? '').replace(/\s+/g, ' ').trim().replace(/"/g, "'")}"`,
      ].join('\n'),
    );
    if (blocks.length) {
      text = text.replace(
        /scaffolds:\n  - id: "\[scaffold id\]"[\s\S]*?notes: "\[Optional\]"/,
        `scaffolds:\n${blocks.join('\n')}`,
      );
      notes.push(`${blocks.length} suggested scaffold(s) for ${needTags.length} need(s)`);
    }
  }

  const title = `${profileData.learner?.name ?? 'Learner'}'s project`;
  text = text
    .replace('updated: "[YYYY-MM-DD]"', `updated: "${today()}"`)
    .replace(
      'slug: "[kebab-case, matches this folder\'s name]"',
      `slug: "${slugify(path.basename(path.dirname(targetPath)))}"`,
    )
    .replace('# [Project Title]', `# ${title}`);

  return { text, notes };
}

async function download(url, target) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new PblError(`Download failed: HTTP ${response.status}`, `URL: ${url}`);
  }

  const total = Number(response.headers.get('content-length') ?? 0);
  const { Writable } = await import('node:stream');
  const { pipeline } = await import('node:stream/promises');
  const { createWriteStream } = await import('node:fs');

  let received = 0;
  const out = createWriteStream(`${target}.tmp`);
  const meter = new Writable({
    write(chunk, _enc, cb) {
      received += chunk.length;
      if (total) {
        const pct = ((received / total) * 100).toFixed(1);
        process.stderr.write(`\r  ${pct}% (${(received / 1e6).toFixed(0)} / ${(total / 1e6).toFixed(0)} MB)`);
      }
      out.write(chunk, cb);
    },
    final(cb) {
      out.end(cb);
    },
  });

  await pipeline(response.body, meter);
  process.stderr.write('\n');
  copyFileSync(`${target}.tmp`, target);
  const { unlinkSync } = await import('node:fs');
  unlinkSync(`${target}.tmp`);
}

function today() {
  // Local date in ISO form, without the UTC shift that toISOString() causes.
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function truncate(text, n) {
  const s = String(text).replace(/\s+/g, ' ');
  return s.length <= n ? s : `${s.slice(0, n - 1)}…`;
}

function wrapText(text, width, indent) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (line.length + word.length + 1 > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.join(`\n${indent}`);
}

// ─────────────────────────────────────────────────────────────────────
try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error instanceof PblError) {
    printError(error);
    process.exit(1);
  }
  throw error;
}
