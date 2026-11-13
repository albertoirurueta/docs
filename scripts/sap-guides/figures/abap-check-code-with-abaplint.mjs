// Figures of "ABAP Guide: Check Code against Clean ABAP Rules" (programming-languages/abap/guide-check-code-with-abaplint.adoc).
// Facts: the lab folder modules/ROOT/examples/abap-lab/lint-demo run on 2026-11-13 with abaplint 2.120.103 (the sources and
// configuration shown are the lab files themselves, the terminal text is what `npx abaplint lint-demo/<config>.json` printed;
// the three version lines and the blank lines of the real output are left out). The step numbers are the callout numbers of
// the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapCode, plainCode } from '../lib/sap-shells.mjs';

const demo = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'lint-demo');
const read = (f) => readFileSync(join(demo, f), 'utf8');

const explorerOf = ({ active, configs }) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'lint-demo', indent: 1, folder: true, open: true },
  { label: 'src', indent: 2, folder: true, open: true },
  ...['zlint_claims.clas.abap', 'zlint_claims.clas.xml'].map((label) => ({ label, indent: 3, ...(label === active ? { active: true } : {}) })),
  ...configs.map((label) => ({ label, indent: 2, ...(label === active ? { active: true } : {}) })),
  { label: 'src', indent: 1, folder: true },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];


// The explorer entry at index i of the tree (24 px rows below the EXPLORER heading); two entries are named abaplint.json.
const entryAt = (i) => ({ x: 48, y: 30 + 40 + i * 24, w: 300, h: 24 });

function editor({ id, alt, shown, code, configs, marksFor }) {
  const h = 133 + 20 * code.length;
  const explorer = explorerOf({ active: shown, configs });
  const sh = vscodeShell({ h, title: 'abap-lab', explorer, tabs: [shown], activeTab: 0, code });
  const g = { ...sh.geo, 'entry:lint-demo/abaplint.json': entryAt(explorer.findIndex((e) => e.label === 'abaplint.json' && e.indent === 2)) };
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
const info = (str) => ({ str, tone: 'text' });
const finding = (str) => ({ str: `lint-demo/src/zlint_claims.clas.abap${str}`, tone: 'danger' });
const header = (config) => [info('abaplint 2.120.103'), info(`Using config: lint-demo/${config}`)];
const basicRun = prompt('npx abaplint lint-demo/abaplint-basic.json');
const cleanRun = prompt('npx abaplint lint-demo/abaplint.json');

const basicFindings = [
  finding('[11, 10] - Variable "lv_unused" not used (unused_variables) [E]'),
  finding('[15, 5]  - Keyword should be upper case: "loop" (keyword_case) [E]'),
];
const cleanFindings = [
  finding('[3, 11]  - Avoid hungarian notation (no_prefixes) [E]'),
  finding('[6, 17]  - Prefer RETURNING to EXPORTING (prefer_returning_to_exporting) [E]'),
  finding('[11, 10] - Variable "lv_unused" not used (unused_variables) [E]'),
  finding('[12, 10] - Prefer Inline Declarations, LV_AMOUNT (prefer_inline) [E]'),
  finding('[15, 5]  - Keyword should be upper case: "loop" (keyword_case) [E]'),
];

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'check-code-with-abaplint',
  figures: [
    editor({
      id: '01-class-file', shown: 'zlint_claims.clas.abap', configs: [], code: abapCode(read('src/zlint_claims.clas.abap')),
      alt: 'Visual Studio Code with the abap-lab project: the file lint-demo/src/zlint_claims.clas.abap is open and shows the class zlint_claims with its method total, which has an unused variable and a lowercase loop keyword; callout 1 marks the class file and callout 2 marks the companion XML file in the explorer',
      marksFor: (g) => [[g['entry:zlint_claims.clas.abap'], 1], [g['entry:zlint_claims.clas.xml'], 2]],
    }),
    editor({
      id: '02-basic-config', shown: 'abaplint-basic.json', configs: ['abaplint-basic.json'], code: plainCode(read('abaplint-basic.json')),
      alt: 'Visual Studio Code with the file lint-demo/abaplint-basic.json open: the global files pattern, the syntax version and a rules section with six rules; callout 3 marks the configuration file in the explorer',
      marksFor: (g) => [[g['entry:abaplint-basic.json'], 3]],
    }),
    terminal({
      id: '03-basic-run',
      alt: 'Terminal after npx abaplint lint-demo/abaplint-basic.json: abaplint prints two findings for the class, the unused variable lv_unused with the rule unused_variables and the lowercase loop with the rule keyword_case, then 2 issues found in 2 files; callout 4 marks the command and callout 5 marks the two findings',
      lines: [basicRun, ...header('abaplint-basic.json'), ...basicFindings, info('abaplint: 2 issue(s) found, 2 file(s) analyzed')],
      markLines: [[0, 4], [3, 5, 2]],
    }),
    editor({
      id: '04-clean-config', shown: 'abaplint.json', configs: ['abaplint-basic.json', 'abaplint.json'], code: plainCode(read('abaplint.json')),
      alt: 'Visual Studio Code with the file lint-demo/abaplint.json open: the same configuration as the basic one with three more rules, no_prefixes, prefer_returning_to_exporting and prefer_inline; callout 6 marks the configuration file in the explorer',
      marksFor: (g) => [[g['entry:lint-demo/abaplint.json'], 6]],
    }),
    terminal({
      id: '05-clean-run',
      alt: 'Terminal after npx abaplint lint-demo/abaplint.json: five findings with the rules no_prefixes, prefer_returning_to_exporting, unused_variables, prefer_inline and keyword_case, then 5 issues found in 2 files; callout 7 marks the command and callout 8 marks the five findings',
      lines: [cleanRun, ...header('abaplint.json'), ...cleanFindings, info('abaplint: 5 issue(s) found, 2 file(s) analyzed')],
      markLines: [[0, 7], [3, 8, 5]],
    }),
    editor({
      id: '06-fixed-class', shown: 'zlint_claims.clas.abap', configs: ['abaplint-basic.json', 'abaplint.json'], code: abapCode(readFileSync(join(demo, 'fixed', 'zlint_claims.clas.abap'), 'utf8')),
      alt: 'Visual Studio Code with the file lint-demo/src/zlint_claims.clas.abap open after the fix: the type amounts, the method total with the importing parameter claim_amounts and a returning value result, and a LOOP AT with an inline declaration of amount; callout 9 marks the class file in the explorer',
      marksFor: (g) => [[g['entry:zlint_claims.clas.abap'], 9]],
    }),
    terminal({
      id: '07-result',
      alt: 'Terminal showing the result of the guide: npx abaplint lint-demo/abaplint.json reports 0 issues found in 2 files',
      lines: [cleanRun, ...header('abaplint.json'), info('abaplint: 0 issue(s) found, 2 file(s) analyzed')],
      markLines: [],
    }),
  ],
};
