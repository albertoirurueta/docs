// Figures of "ABAP Guide: ABAP SQL on a Local Database" (programming-languages/abap/guide-abap-sql-on-a-local-database.adoc).
// Facts: the lab project modules/ROOT/examples/abap-lab run on 2026-11-13 (open-abap transpiler 2.14.30, runtime 2.14.30,
// abaplint 2.120.103, open-abap-core a9acc41): the source shown is the lab file src/zsql_claims.prog.abap itself and the terminal
// text is what `npm run run:sql` and `npm run lint` printed (the transpiler's file-count lines are left out). The step numbers
// are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapRuns } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'src');
const FILE = 'zsql_claims.prog.abap';
const labSource = readFileSync(join(lab, FILE), 'utf8').replace(/\n$/, '').split('\n');

// The ABAP SQL words of this guide, coloured like keywords in the editor (the shared word list holds the general ABAP words).
const SQL_WORDS = new Set(['SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'UP', 'TO', 'ROWS', 'DISTINCT', 'SINGLE', 'COUNT', 'INSERT', 'UPDATE', 'SET', 'MODIFY', 'DELETE', 'DESCENDING', 'BETWEEN', 'AND', 'LIKE', 'IN', 'TABLE', 'INTO', 'CLASS-METHODS', 'ENDCLASS', 'ENDMETHOD', 'ENDLOOP']);
const runs = (line) => abapRuns(line).map((r) => (!r.kind && SQL_WORDS.has(r.t.toUpperCase()) ? { ...r, kind: 'keyword' } : r));

// The lab file with the regions in `keep` (tag::x[] ... end::x[] comment lines); the marker lines never remain and a blank line is never doubled.
function pick(keep, head = true) {
  const out = [];
  let current = null;
  for (const l of labSource) {
    const m = l.match(/^" (tag|end)::([a-z-]+)\[\]/);
    if (m) { current = m[1] === 'tag' ? m[2] : null; continue; }
    if (current && !keep.includes(current)) continue;
    if (!current && !head && l.startsWith('REPORT')) continue;
    if (l.trim() === '' && (out.length === 0 || out[out.length - 1].trim() === '')) continue;
    out.push(l);
  }
  while (out.length && out[out.length - 1].trim() === '') out.pop();
  return out;
}

const explorer = [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'src', indent: 1, folder: true, open: true },
  ...['zcl_first_program.clas.abap', 'zcl_greeter.clas.abap', 'zexp_claim.tabl.xml', 'zfirst_program.prog.abap', 'zsql_claims.prog.abap', 'zsql_claims.prog.xml']
    .map((label) => ({ label, indent: 2, ...(label === FILE ? { active: true } : {}) })),
  { label: 'abap_transpile.json', indent: 1 },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];

// An editor figure. `marksFor(geo, at)` returns [box, step] pairs; `at(text, count)` is the box of `count` code lines that start with `text`.
function editor({ id, alt, keep, head = true, marksFor }) {
  const code = pick(keep, head);
  const h = 30 + 35 + 8 + 30 + code.length * 20 + 16 + 24;
  const sh = vscodeShell({ h, title: 'abap-lab', explorer, tabs: [FILE], activeTab: 0, code: code.map(runs) });
  const g = sh.geo;
  const at = (text, count = 1) => {
    const i = code.findIndex((l) => l.trim().startsWith(text));
    if (i < 0) throw new Error(`figure ${id}: no code line starting with ${text}`);
    return { x: g.editor.x + 44, y: g.editor.y + 16 + i * 20, w: g.editor.w - 64, h: count * 20 };
  };
  const list = marksFor(g, at).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

function terminal({ id, alt, lines, markLines }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = markLines.flatMap(([from, n, span = 1]) => {
    const i = typeof from === 'string' ? lines.findIndex((l) => (l.str ?? l).startsWith(from)) : from;
    if (i < 0) throw new Error(`figure ${id}: no terminal line starting with ${from}`);
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const outLine = (str) => ({ str, tone: 'state.normal.bg' });
const printed = (arr) => arr.map(outLine);

// What the program printed, in order (copied from the run).
const ALL = [
  'Inserted five rows, sy-subrc = 0',
  'All claims', '  C000000001 A 120', '  C000000002 S 35', '  C000000003 A 80', '  C000000004 R 10', '  C000000005 S 64',
  'Status A or S', '  C000000001 A 120', '  C000000002 S 35', '  C000000003 A 80', '  C000000005 S 64',
  'Amount 30 to 100', '  C000000002 S 35', '  C000000003 A 80', '  C000000005 S 64',
  'Id like C00000000% and status S', '  C000000002 S 35', '  C000000005 S 64',
  'Largest first', '  C000000001 A 120', '  C000000003 A 80', '  C000000005 S 64', '  C000000002 S 35', '  C000000004 R 10',
  'Top two', '  C000000001 A 120', '  C000000003 A 80',
  'Different statuses: 3',
  'Rows in table: 5', 'Submitted claims: 2',
  'Found C000000003 A 80, subrc 0', 'No row for C999999999, sy-subrc = 4',
  'INSERT, sy-subrc = 0', 'UPDATE, sy-subrc = 0', 'UPDATE without a match, sy-subrc = 4', 'MODIFY twice, sy-subrc = 0', 'DELETE, sy-subrc = 0',
  'After the changes', '  C000000001 A 120', '  C000000002 A 40', '  C000000003 A 80', '  C000000004 S 10', '  C000000005 S 64', '  C000000006 S 42',
];
const from = (start) => ALL.slice(ALL.indexOf(start));

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'abap-sql-on-a-local-database',
  figures: [
    editor({
      id: '01-report-file', keep: ['helper', 'seed'],
      alt: 'Visual Studio Code with the abap-lab project: the file src/zsql_claims.prog.abap is open and shows the REPORT line, the table type and the local class lcl_output with its show method, then START-OF-SELECTION with an INSERT of five rows and a SELECT into the table all_claims; callout 1 marks the helper class, callout 2 marks the INSERT and SELECT block and callout 3 marks the companion XML file in the explorer',
      marksFor: (g, at) => [[at('TYPES ty_claims', 15), 1], [at('START-OF-SELECTION', 11), 2], [g['entry:zsql_claims.prog.xml'], 3]],
    }),
    terminal({
      id: '02-load-and-list',
      alt: 'Terminal after npm run run:sql: the program prints Inserted five rows with sy-subrc 0 and then All claims with the five rows C000000001 A 120, C000000002 S 35, C000000003 A 80, C000000004 R 10 and C000000005 S 64; callout 4 marks the command and callout 5 marks the output',
      lines: [prompt('npm run run:sql'), ...printed(ALL.slice(0, 7))],
      markLines: [[0, 4], [1, 5, 7]],
    }),
    terminal({
      id: '03-read-output',
      alt: 'Terminal after npm run run:sql with the read statements added: the output groups Status A or S, Amount 30 to 100, Id like C00000000% and status S, Largest first, Top two, Different statuses 3, Rows in table 5, Submitted claims 2, then Found C000000003 A 80 with subrc 0 and No row for C999999999 with sy-subrc 4; callouts 6 to 9 mark the groups of steps 6 to 9 and callout 10 marks the command',
      lines: [prompt('npm run run:sql'), ...printed(ALL.slice(7, 33))],
      markLines: [[0, 10], ['Status A or S', 6, 12], ['Largest first', 7, 10], ['Rows in table', 8, 2], ['Found', 9, 2]],
    }),
    editor({
      id: '04-change-code', keep: ['insert', 'update', 'modify', 'delete'], head: false,
      alt: 'Visual Studio Code with the file src/zsql_claims.prog.abap open at the end of the report: INSERT of claim C000000006, UPDATE of claim C000000002 and of a claim that does not exist, two MODIFY statements, DELETE FROM with status R and a final SELECT that lists the table; callouts 11 to 14 mark the INSERT, the UPDATE, the MODIFY and the DELETE blocks',
      marksFor: (g, at) => [[at('INSERT zexp_claim', 4), 11], [at('UPDATE zexp_claim', 7), 12], [at('MODIFY zexp_claim', 7), 13], [at('DELETE FROM', 5), 14]],
    }),
    terminal({
      id: '05-first-error',
      alt: 'Terminal after npm run run:sql with a misspelled field in a SELECT: the transpiler stops with the line Error: check_syntax, checkFields, field STATUZ not found, zsql_claims.prog.abap:57 and the program does not run; callout 17 marks the error line',
      lines: [prompt('npm run run:sql'), { str: 'Error: check_syntax, checkFields, field STATUZ not found, zsql_claims.prog.abap:57', tone: 'danger' }],
      markLines: [[1, 17]],
    }),
    terminal({
      id: '06-lint-finding',
      alt: 'Terminal after npm run lint: abaplint prints one finding, src/zsql_claims.prog.abap at line 57 column 3, the message checkFields field STATUZ not found, the rule name check_syntax and the severity E, then 1 issue found in 12 files; callout 18 marks the finding',
      lines: [prompt('npm run lint'), { str: 'src/zsql_claims.prog.abap[57, 3] - checkFields, field STATUZ not found (check_syntax) [E]', tone: 'danger' }, { str: 'abaplint: 1 issue(s) found, 12 file(s) analyzed', tone: 'text' }],
      markLines: [[1, 18]],
    }),
    terminal({
      id: '07-result',
      alt: 'Terminal showing the end of the output of npm run run:sql: Found C000000003 A 80, No row for C999999999, the sy-subrc lines of INSERT, UPDATE, UPDATE without a match, MODIFY twice and DELETE, and After the changes with the rows C000000001 A 120, C000000002 A 40, C000000003 A 80, C000000004 S 10, C000000005 S 64 and C000000006 S 42',
      lines: [prompt('npm run run:sql'), ...printed(from('Found C000000003 A 80, subrc 0'))],
      markLines: [],
    }),
  ],
};
