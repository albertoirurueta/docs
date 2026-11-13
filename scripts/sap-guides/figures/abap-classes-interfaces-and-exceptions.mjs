// Figures of "ABAP Guide: Classes, Interfaces and Exceptions" (programming-languages/abap/guide-classes-interfaces-and-exceptions.adoc).
// Facts: the lab project modules/ROOT/examples/abap-lab run on 2026-11-13 (open-abap transpiler 2.14.30, runtime 2.14.30, abaplint
// 2.120.103, open-abap-core a9acc41): the sources shown are the lab files themselves, the terminal text is what `npm run run:claims`
// printed. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'src');
const source = (f) => abapCode(readFileSync(join(lab, f), 'utf8'));

const FILES = [
  'zoo_cl_capped_payout.clas.abap', 'zoo_cl_capped_payout.clas.xml',
  'zoo_cl_claim_validator.clas.abap', 'zoo_cl_claim_validator.clas.xml',
  'zoo_cl_full_payout.clas.abap', 'zoo_cl_full_payout.clas.xml',
  'zoo_claims_report.prog.abap', 'zoo_claims_report.prog.xml',
  'zoo_cx_claim_invalid.clas.abap', 'zoo_cx_claim_invalid.clas.xml',
  'zoo_if_payout.intf.abap', 'zoo_if_payout.intf.xml',
];
const explorerOf = (active) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'src', indent: 1, folder: true, open: true },
  ...FILES.map((label) => ({ label, indent: 2, ...(label === active ? { active: true } : {}) })),
  { label: 'abap_transpile.json', indent: 1 },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];

function editor({ id, alt, file, marksFor }) {
  const code = source(file);
  const h = Math.max(580, 162 + code.length * 19);
  const sh = vscodeShell({ h, title: 'abap-lab', explorer: explorerOf(file), tabs: [file], activeTab: 0, code });
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

const OUT = [
  'Full payout pays 350 of 350',
  'Capped payout (cap 300) pays 300 of 350',
  'Claim 1001 is valid',
  'Claim 1002 rejected: amount 900 is not between 1 and 500',
  'Direct call: 100',
].map((str) => ({ str, tone: 'state.normal.bg' }));
const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const entry = (name) => (g) => g[`entry:${name}`];

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'classes-interfaces-and-exceptions',
  figures: [
    editor({
      id: '01-validator-class', file: 'zoo_cl_claim_validator.clas.abap',
      alt: 'Visual Studio Code with the abap-lab project: the file src/zoo_cl_claim_validator.clas.abap is open and shows the class zoo_cl_claim_validator with a constructor, the methods is_within_limit and validate and a private attribute max_amount; callout 1 marks the class file and callout 2 marks the companion XML file in the explorer',
      marksFor: (g) => [[entry('zoo_cl_claim_validator.clas.abap')(g), 1], [entry('zoo_cl_claim_validator.clas.xml')(g), 2]],
    }),
    editor({
      id: '02-payout-interface', file: 'zoo_if_payout.intf.abap',
      alt: 'Visual Studio Code with the file src/zoo_if_payout.intf.abap open: the interface zoo_if_payout declares the methods get_name and calculate without any code; callout 3 marks the interface file in the explorer',
      marksFor: (g) => [[entry('zoo_if_payout.intf.abap')(g), 3]],
    }),
    editor({
      id: '03-payout-classes', file: 'zoo_cl_capped_payout.clas.abap',
      alt: 'Visual Studio Code with the file src/zoo_cl_capped_payout.clas.abap open: the class implements the interface zoo_if_payout, keeps a private cap and returns the cap when the claimed amount is higher; callout 4 marks the full payout class file and callout 5 marks the capped payout class file in the explorer',
      marksFor: (g) => [[entry('zoo_cl_full_payout.clas.abap')(g), 4], [entry('zoo_cl_capped_payout.clas.abap')(g), 5]],
    }),
    editor({
      id: '04-exception-class', file: 'zoo_cx_claim_invalid.clas.abap',
      alt: 'Visual Studio Code with the file src/zoo_cx_claim_invalid.clas.abap open: the class zoo_cx_claim_invalid inherits from cx_static_check, keeps the claim number and the reason and redefines get_text to build the message; callout 6 marks the exception class file in the explorer',
      marksFor: (g) => [[entry('zoo_cx_claim_invalid.clas.abap')(g), 6]],
    }),
    editor({
      id: '05-report-file', file: 'zoo_claims_report.prog.abap',
      alt: 'Visual Studio Code with the file src/zoo_claims_report.prog.abap open: the report fills a table with two payout strategies and loops over it, then calls the validator inside TRY with a CATCH for zoo_cx_claim_invalid and finally calls an interface method through a class reference; callout 7 marks the report file in the explorer',
      marksFor: (g) => [[entry('zoo_claims_report.prog.abap')(g), 7]],
    }),
    terminal({
      id: '06-transpile-and-run',
      alt: 'Terminal after npm run run:claims: the program prints five lines, Full payout pays 350 of 350, Capped payout with cap 300 pays 300 of 350, Claim 1001 is valid, Claim 1002 rejected because amount 900 is not between 1 and 500, and Direct call 100; callout 8 marks the command and callout 9 marks the five output lines',
      lines: [prompt('npm run run:claims'), ...OUT],
      markLines: [[0, 8], [1, 9, 5]],
    }),
    terminal({
      id: '07-first-error',
      alt: 'Terminal after npm run run:claims with the interface prefix removed from the last call: the transpiler stops with the line Error: check_syntax, Method calculate not found, methodCallChain, zoo_claims_report.prog.abap:26 and the program does not run; callout 11 marks the error line',
      lines: [prompt('npm run run:claims'), { str: 'Error: check_syntax, Method "calculate" not found, methodCallChain, zoo_claims_report.prog.abap:26', tone: 'danger' }],
      markLines: [[1, 11]],
    }),
    terminal({
      id: '08-result',
      alt: 'Terminal showing the result of the guide: the command npm run run:claims followed by five program lines that show two payout strategies, one valid claim, one rejected claim with its message and a direct call of an interface method',
      lines: [prompt('npm run run:claims'), ...OUT],
      markLines: [],
    }),
  ],
};
