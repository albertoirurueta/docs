// Figures of "ABAP Guide: Work with Internal Tables" (programming-languages/abap/guide-work-with-internal-tables.adoc). Facts: the
// lab project modules/ROOT/examples/abap-lab run on 2026-11-13 (open-abap transpiler 2.14.30, runtime 2.14.30, open-abap-core
// a9acc41): the sources shown are the lab files themselves (the tagged regions the page includes), the terminal text is what
// `npm run run:items` printed. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'src');
// ABAP has no "//" comment: the lab files mark regions with `" tag::x[]`, which labText reads once it is spelled like the CDS markers.
const read = (f, opts) => labText(readFileSync(join(lab, f), 'utf8').replace(/^(\s*)" (tag|end)::/gm, '$1// $2::'), opts);

const CLASS = 'zit_claim_items.clas.abap';
const REPORT = 'zit_internal_tables.prog.abap';
const FILES = ['zcl_first_program.clas.abap', 'zcl_greeter.clas.abap', CLASS, 'zit_claim_items.clas.xml', REPORT, 'zit_internal_tables.prog.xml'];
const explorerOf = (active) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'src', indent: 1, folder: true, open: true },
  ...FILES.map((label) => ({ label, indent: 2, ...(label === active ? { active: true } : {}) })),
  { label: 'abap_transpile.json', indent: 1 },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];

function editor({ id, alt, file, opts, marksFor }) {
  const text = read(file, opts);
  const n = text.split('\n').length;
  const h = Math.max(400, 150 + n * 19);
  const sh = vscodeShell({ h, title: 'abap-lab', explorer: explorerOf(file), tabs: [file], activeTab: 0, code: abapCode(text) });
  const list = marksFor(sh.geo).flatMap(([b, k]) => mark(b, k));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

function terminal({ id, alt, lines, markLines }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = markLines.flatMap(([i, k, span = 1]) => {
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, k);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const prompt = { str: '$ npm run run:items', tone: 'textMuted' };
const out = (...strs) => strs.map((str) => ({ str, tone: 'state.normal.bg' }));
const L0 = ['Claim 1001 has 6 items'];
const L1 = ['Item 3: TRAVEL, 32 EUR', 'Item 9 does not exist', 'READ TABLE: sy-subrc 0, item 4', 'READ TABLE: sy-subrc 4'];
const L2 = ['HOTEL:', '  item 4, 120 EUR', 'MEALS:', '  item 2, 18 EUR', '  item 5, 22 EUR', 'TRAVEL:', '  item 1, 45 EUR', '  item 3, 32 EUR', '  item 6, 12 EUR'];
const L3 = ['Total: 249 EUR', 'Travel items: 3', 'Travel total: 89 EUR'];

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'work-with-internal-tables',
  figures: [
    editor({
      id: '01-class-file', file: CLASS, opts: { drop: ['def-read', 'def-group', 'def-total', 'read', 'group', 'total'] },
      alt: 'Visual Studio Code with the abap-lab project: the file src/zit_claim_items.clas.abap is open and shows the class zit_claim_items with the types ty_item and ty_items and the method build that fills the table with VALUE; callout 1 marks the class file and callout 2 marks the companion XML file in the explorer',
      marksFor: (g) => [[g[`entry:${CLASS}`], 1], [g['entry:zit_claim_items.clas.xml'], 2]],
    }),
    editor({
      id: '02-report-file', file: REPORT, opts: { drop: ['call-read', 'call-group', 'call-total'] },
      alt: 'Visual Studio Code with the file src/zit_internal_tables.prog.abap open: a report named zit_internal_tables that creates the class, calls build and writes the number of items; callout 3 marks the report file in the explorer',
      marksFor: (g) => [[g[`entry:${REPORT}`], 3]],
    }),
    terminal({
      id: '03-build-and-run',
      alt: 'Terminal after npm run run:items: the program prints Claim 1001 has 6 items; callout 4 marks the command and callout 5 marks the output line',
      lines: [prompt, ...out(...L0)], markLines: [[0, 4], [1, 5]],
    }),
    terminal({
      id: '04-read-rows',
      alt: 'Terminal after npm run run:items with the method read_rows: the program prints the count line, Item 3: TRAVEL, 32 EUR, Item 9 does not exist, READ TABLE with sy-subrc 0 and item 4, and READ TABLE with sy-subrc 4; callout 8 marks the command and callout 9 marks the four new lines',
      lines: [prompt, ...out(...L0, ...L1)], markLines: [[0, 8], [2, 9, 4]],
    }),
    terminal({
      id: '05-sorted-groups',
      alt: 'Terminal after npm run run:items with the method list_by_category: below the earlier lines the program prints the three category headings HOTEL, MEALS and TRAVEL, each followed by its items; callout 12 marks the command and callout 13 marks the nine new lines',
      lines: [prompt, ...out(...L0, ...L1, ...L2)], markLines: [[0, 12], [6, 13, 9]],
    }),
    terminal({
      id: '06-total-and-filter',
      alt: 'Terminal after npm run run:items with the method total_and_filter: the last three lines are Total: 249 EUR, Travel items: 3 and Travel total: 89 EUR; callout 16 marks the command and callout 17 marks the three new lines',
      lines: [prompt, ...out(...L0, ...L1, ...L2, ...L3)], markLines: [[0, 16], [15, 17, 3]],
    }),
    terminal({
      id: '07-first-error',
      alt: 'Terminal after npm run run:items when the table expression asks for item 9: the program prints Claim 1001 has 6 items and then Node.js prints a stack trace that names cx_sy_itab_line_not_found, the runtime function tableExpression and the method read_rows; callout 19 marks the exception line',
      lines: [
        prompt,
        { str: 'Claim 1001 has 6 items', tone: 'state.normal.bg' },
        { str: '.../node_modules/@abaplint/runtime/build/src/throw_error.js:15', tone: 'text' },
        { str: '        const error = new abap.Classes[name]();', tone: 'text' },
        { str: '                      ^', tone: 'text' },
        { str: '', tone: 'text' },
        { str: '<ref *1> cx_sy_itab_line_not_found [Error]', tone: 'danger' },
        { str: '    at Object.tableExpression (.../@abaplint/runtime/build/src/operators/table_expression.js:27:38)', tone: 'text' },
        { str: '    at async zit_claim_items.read_rows (.../output/project/zit_claim_items.clas.mjs:45:16)', tone: 'text' },
      ],
      markLines: [[6, 19]],
    }),
    terminal({
      id: '08-result',
      alt: 'Terminal showing the result of the guide: the command npm run run:items followed by the 17 output lines, from Claim 1001 has 6 items to Travel total: 89 EUR',
      lines: [prompt, ...out(...L0, ...L1, ...L2, ...L3)], markLines: [],
    }),
  ],
};
