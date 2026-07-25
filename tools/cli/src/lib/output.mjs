/**
 * Terminal output.
 *
 * Colour is disabled when not a TTY, when NO_COLOR is set, or under --json, so
 * piping into a file or another program yields clean text.
 */

const useColor =
  process.stdout.isTTY && !process.env.NO_COLOR && process.env.TERM !== 'dumb';

const wrap = (code) => (text) => (useColor ? `[${code}m${text}[0m` : String(text));

export const c = {
  red: wrap('31'),
  green: wrap('32'),
  yellow: wrap('33'),
  blue: wrap('34'),
  grey: wrap('90'),
  bold: wrap('1'),
  dim: wrap('2'),
};

export const MARK = {
  pass: () => c.green('✓'),
  warn: () => c.yellow('!'),
  fail: () => c.red('✗'),
};

export function heading(text) {
  console.log(`\n${c.bold(text)}`);
}

/**
 * Print one finding. Failures and warnings get their hint; passes stay to one
 * line so a clean run is scannable.
 */
export function printFinding(finding, { verbose = false } = {}) {
  const mark = (MARK[finding.status] ?? MARK.warn)();
  const id = c.grey(`[${finding.id}]`);
  console.log(`  ${mark} ${finding.message} ${id}`);

  if (finding.hint && (finding.status !== 'pass' || verbose)) {
    for (const line of String(finding.hint).split('\n')) {
      console.log(c.grey(`      → ${line}`));
    }
  }
}

export function printSummary(summary, { label = 'checks' } = {}) {
  const parts = [];
  if (summary.pass) parts.push(c.green(`${summary.pass} passed`));
  if (summary.warn) parts.push(c.yellow(`${summary.warn} warning${summary.warn === 1 ? '' : 's'}`));
  if (summary.fail) parts.push(c.red(`${summary.fail} failed`));

  console.log(`\n  ${parts.join(c.grey(' · ')) || c.grey('nothing to report')} ${c.grey(`(${summary.total} ${label})`)}`);

  if (summary.fail) {
    console.log(c.grey('\n  Fix the failures before launching. Warnings are judgment calls — read them and decide.'));
  } else if (summary.warn) {
    console.log(c.grey('\n  No failures. The warnings are yours to weigh, not the tool\'s.'));
  }
}

export function printError(error) {
  console.error(`\n${c.red('Error:')} ${error.message}`);
  if (error.hint) console.error(c.grey(`\n${error.hint}`));
  console.error('');
}

export function json(value) {
  console.log(JSON.stringify(value, null, 2));
}
