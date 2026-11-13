// Figures of "ABAP Guide: Write ABAP Unit Tests" (programming-languages/abap/guide-write-abap-unit-tests.adoc). Facts: the lab
// project modules/ROOT/examples/abap-lab run on 2026-11-13 (open-abap transpiler 2.14.30, runtime 2.14.30, abaplint 2.120.103,
// open-abap-core a9acc41): the sources shown are the lab files themselves (the first class figure shows the deliberate slip of
// step 1, `<` for `<=`), the terminal text is what `npm test` and `echo $?` printed. The step numbers are the callout numbers of
// the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'src');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const CLASS = 'zut_claim_limit.clas.abap';
const XML = 'zut_claim_limit.clas.xml';
const TESTS = 'zut_claim_limit.clas.testclasses.abap';
const FIXED = read(CLASS);
const SLIP = FIXED.replace('amount <= c_limit', 'amount < c_limit');

const explorerOf = (active) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'src', indent: 1, folder: true, open: true },
  ...['zcl_greeter.clas.abap', 'zcl_greeter.clas.testclasses.abap', 'zut_claim_limit.clas.abap', 'zut_claim_limit.clas.testclasses.abap', 'zut_claim_limit.clas.xml']
    .map((label) => ({ label, indent: 2, ...(label === active ? { active: true } : {}) })),
  { label: 'abap_transpile.json', indent: 1 },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];

function editor({ id, alt, file, text, h, marksFor }) {
  const sh = vscodeShell({ h, title: 'abap-lab', explorer: explorerOf(file), tabs: [file], activeTab: 0, code: abapCode(text) });
  const g = sh.geo;
  const list = marksFor(g).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

function terminal({ id, alt, lines, markLines }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = markLines.flatMap(([i, n, span = 1]) => {
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const plain = (str) => ({ str, tone: 'text' });
const clone = ['13 files added from source', '727 files added from lib, 1.4 seconds', 'Output files: 936 written'].map(plain);
const run = (name) => plain(`ZUT_CLAIM_LIMIT: running ltcl_limit->${name}`);
const greeter = plain('ZCL_GREETER: running ltcl_greeter->greets_by_name');
const passed = [
  greeter,
  run('small_amount_is_accepted'),
  run('large_amount_is_rejected'),
  run('amount_at_limit_is_accepted'),
  run('status_text_follows_limit'),
].map((l) => ({ ...l, tone: 'state.normal.bg' }));

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'write-abap-unit-tests',
  figures: [
    editor({
      id: '01-class-file', file: CLASS, text: SLIP, h: 650,
      alt: 'Visual Studio Code with the file src/zut_claim_limit.clas.abap open: the class zut_claim_limit with the constant c_limit of 1000 and the methods is_within_limit and status_for, where is_within_limit compares with a less-than sign; callout 1 marks the class file and callout 2 marks the companion XML file in the explorer',
      marksFor: (g) => [[g['entry:zut_claim_limit.clas.abap'], 1], [g['entry:zut_claim_limit.clas.xml'], 2]],
    }),
    editor({
      id: '02-test-class', file: TESTS, text: read(TESTS), h: 920,
      alt: 'Visual Studio Code with the file src/zut_claim_limit.clas.testclasses.abap open: the local test class ltcl_limit FOR TESTING with a setup method and four test methods that call assert_true, assert_false and assert_equals of cl_abap_unit_assert; callout 3 marks the test class file in the explorer',
      marksFor: (g) => [[g['entry:zut_claim_limit.clas.testclasses.abap'], 3]],
    }),
    terminal({
      id: '03-failing-run',
      alt: 'Terminal after npm test: the transpiler reports the output files it wrote (one example run), three test lines appear for the greeter and two claim tests and a fourth for amount_at_limit_is_accepted, then an error of type kernel_cx_assert whose msg value reads A claim of exactly the limit must be accepted; callout 4 marks the command, callout 5 the last test line that started and callout 6 the message',
      lines: [
        prompt('npm test'), ...clone,
        greeter, run('small_amount_is_accepted'), run('large_amount_is_rejected'), run('amount_at_limit_is_accepted'),
        { str: '<ref *1> kernel_cx_assert [Error]', tone: 'danger' },
        { str: '    ...', tone: 'textMuted' },
        { str: '  msg: String {', tone: 'text' },
        { str: "    value: 'A claim of exactly the limit must be accepted',", tone: 'danger' },
        { str: '    ...', tone: 'textMuted' },
        { str: '}', tone: 'text' },
      ],
      markLines: [[0, 4], [7, 5], [11, 6]],
    }),
    terminal({
      id: '04-exit-code',
      alt: 'Terminal right after the failed npm test: the command echo $? prints 1; callout 7 marks the printed exit code',
      lines: [prompt('echo $?'), { str: '1', tone: 'danger' }],
      markLines: [[1, 7]],
    }),
    editor({
      id: '05-class-fixed', file: CLASS, text: FIXED, h: 650,
      alt: 'Visual Studio Code with the file src/zut_claim_limit.clas.abap open after the fix: the line in is_within_limit now reads result = xsdbool( amount <= c_limit ); callout 8 marks the changed line',
      marksFor: () => [[{ x: 348 + 8, y: 65 + 8 + 22 + 15 * 19 + 5, w: 520, h: 21 }, 8]],
    }),
    terminal({
      id: '06-result',
      alt: 'Terminal showing the result of the guide: npm test lists the greeter test and the four claim tests, and echo $? prints 0',
      lines: [prompt('npm test'), clone[2], ...passed, prompt('echo $?'), { str: '0', tone: 'state.normal.bg' }],
      markLines: [],
    }),
  ],
};
