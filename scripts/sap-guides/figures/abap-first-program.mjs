// Figures of "ABAP Guide: Your First ABAP Program" (programming-languages/abap/guide-first-abap-program.adoc). Facts: the lab
// project modules/ROOT/examples/abap-lab run on 2026-11-13 (open-abap transpiler 2.14.30, runtime 2.14.30, abaplint 2.120.103,
// open-abap-core a9acc41): the sources shown are the lab files themselves, the terminal text is what `npm run run:first` and
// `npm run lint` printed. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'src');
const source = (f) => abapCode(readFileSync(join(lab, f), 'utf8'));

const explorerOf = (active) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'src', indent: 1, folder: true, open: true },
  ...['zcl_first_program.clas.abap', 'zcl_first_program.clas.xml', 'zcl_greeter.clas.abap', 'zfirst_program.prog.abap', 'zfirst_program.prog.xml', 'zhello.prog.abap']
    .map((label) => ({ label, indent: 2, ...(label === active ? { active: true } : {}) })),
  { label: 'abap_transpile.json', indent: 1 },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];

function editor({ id, alt, file, h, marksFor }) {
  const sh = vscodeShell({ h, title: 'abap-lab', explorer: explorerOf(file), tabs: [file], activeTab: 0, code: source(file) });
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

const OUT = ['Claim 1001', 'Status: New', 'Amount: 45 EUR'].map((str) => ({ str, tone: 'state.normal.bg' }));
const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const clone = [
  { str: '10 files added from source', tone: 'text' },
  { str: '727 files added from lib, 1.6 seconds', tone: 'text' },
];

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'first-abap-program',
  figures: [
    editor({
      id: '01-class-file', file: 'zcl_first_program.clas.abap', h: 480,
      alt: 'Visual Studio Code with the abap-lab project: the file src/zcl_first_program.clas.abap is open and shows the class zcl_first_program with its run method that writes three lines; callout 1 marks the class file and callout 2 marks the companion XML file in the explorer',
      marksFor: (g) => [[g['entry:zcl_first_program.clas.abap'], 1], [g['entry:zcl_first_program.clas.xml'], 2]],
    }),
    editor({
      id: '02-report-file', file: 'zfirst_program.prog.abap', h: 340,
      alt: 'Visual Studio Code with the file src/zfirst_program.prog.abap open: a report named zfirst_program whose START-OF-SELECTION block creates the class with NEW and calls run; callout 3 marks the report file in the explorer',
      marksFor: (g) => [[g['entry:zfirst_program.prog.abap'], 3]],
    }),
    terminal({
      id: '03-transpile-and-run',
      alt: 'Terminal after npm run run:first: the transpiler counts its source and library files and reports the output files written (one example run), and the program prints Claim 1001, Status: New and Amount: 45 EUR; callout 4 marks the command and callout 5 marks the three output lines',
      lines: [prompt('npm run run:first'), ...clone, { str: 'Output files: 932 written', tone: 'text' }, ...OUT],
      markLines: [[0, 4], [4, 5, 3]],
    }),
    terminal({
      id: '04-first-error',
      alt: 'Terminal after npm run run:first with a misspelled variable: the transpiler stops with the line Error: check_syntax, amont not found, findTop, zcl_first_program.clas.abap:14 and the program does not run; callout 7 marks the error line',
      lines: [prompt('npm run run:first'), ...clone, { str: 'Error: check_syntax, "amont" not found, findTop, zcl_first_program.clas.abap:14', tone: 'danger' }],
      markLines: [[3, 7]],
    }),
    terminal({
      id: '05-lint-finding',
      alt: 'Terminal after npm run lint: abaplint prints one finding, src/zcl_first_program.clas.abap at line 14 column 24, the message amont not found, findTop, the rule name check_syntax and the severity E, then 1 issue found in 10 files; callout 8 marks the finding',
      lines: [prompt('npm run lint'), { str: 'src/zcl_first_program.clas.abap[14, 24] - "amont" not found, findTop (check_syntax) [E]', tone: 'danger' }, { str: 'abaplint: 1 issue(s) found, 10 file(s) analyzed', tone: 'text' }],
      markLines: [[1, 8]],
    }),
    terminal({
      id: '06-result',
      alt: 'Terminal showing the result of the guide: the command npm run run:first followed by the three program lines Claim 1001, Status: New and Amount: 45 EUR',
      lines: [prompt('npm run run:first'), ...OUT],
      markLines: [],
    }),
  ],
};
