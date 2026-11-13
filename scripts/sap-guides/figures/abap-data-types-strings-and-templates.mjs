// Figures of "ABAP Guide: Data Types, Strings and String Templates"
// (programming-languages/abap/guide-data-types-strings-and-templates.adoc). Facts: the lab project modules/ROOT/examples/abap-lab
// run on 2026-11-13 (open-abap transpiler 2.14.30, runtime 2.14.30, abaplint 2.120.103, open-abap-core a9acc41): the sources shown
// are the lab files themselves (regions chosen with the same tags as the page's includes), the terminal text is what
// `npm run run:summary` printed. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, abapRuns, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'abap-lab', 'src');
// ABAP comment markers (`" tag::x[]`) are the ones the page's include reads; labText reads the `// tag::x[]` spelling.
const read = (f) => readFileSync(join(lab, f), 'utf8').replace(/^(\s*)" (tag|end)::/gm, '$1// $2::');
// Words of this guide that the shared highlighter does not know yet; the shared word list stays untouched.
const MORE = new Set(['LENGTH', 'DECIMALS', 'CLASS-METHODS', 'NOT', 'RETURN', 'SPLIT', 'FIND', 'PCRE', 'SUBMATCHES', 'OCC', 'ENDIF']);
const abapText = (text) => text.split('\n').map((l) => abapRuns(l).map((r) => (!r.kind && MORE.has(r.t.toUpperCase()) ? { ...r, kind: 'keyword' } : r)));

const PHASES = ['declare', 'convert', 'template', 'functions', 'split', 'regex', 'class'];
const upTo = (keep) => abapText(labText(read('zdt_summary.prog.abap'), { drop: PHASES.filter((p) => !keep.includes(p)) }));

const explorerOf = (active, extra = []) => [
  { label: 'ABAP-LAB', folder: true, open: true },
  { label: 'src', indent: 1, folder: true, open: true },
  ...['zcl_first_program.clas.abap', 'zdt_claim_text.clas.abap', 'zdt_claim_text.clas.xml', 'zdt_summary.prog.abap', 'zdt_summary.prog.xml']
    .filter((label) => extra.includes(label) || !label.startsWith('zdt_claim_text'))
    .map((label) => ({ label, indent: 2, ...(label === active ? { active: true } : {}) })),
  { label: 'abap_transpile.json', indent: 1 },
  { label: 'abaplint.json', indent: 1 },
  { label: 'package.json', indent: 1 },
];

function editor({ id, alt, file, h, code, extra, marksFor }) {
  const sh = vscodeShell({ h, title: 'abap-lab', explorer: explorerOf(file, extra), tabs: [file], activeTab: 0, code });
  const list = marksFor(sh.geo).flatMap(([b, n]) => mark(b, n));
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

// The lines `npm run run:summary` printed, in order (the transpiler's own lines about file counts are left out of every figure).
const OUT = [
  'C-1001: 6 characters',
  'Ada Lovelace: 12 characters',
  'Ada L: 5 characters',
  '3 items',
  'Integer division: 4',
  'With CONV: 3.5',
  'Text to number plus 1: 43',
  'Claim C-1001 for Ada Lovelace: 125.5 EUR',
  '3 items, 30 EUR pending',
  'Two decimals: 125.50',
  'No decimals: 126',
  '21 characters before, 12 after: ADA LOVELACE',
  'Number part: 1001',
  'Before the dash: C',
  'Position of the dash: 1',
  'Replaced: CLAIM-1001',
  '4 parts',
  '[C-1001]',
  '[ ada  lovelace ]',
  '[125.5]',
  '[eur]',
  'C-1001 is a claim number',
  'C-12 is not a claim number',
  'First item: Taxi costs 12.50',
  'Taxi <amount> and hotel <amount>',
  'Claim C-1001 | ADA LOVELACE | 125.50 EUR',
  'Not a claim number: X-1',
  'Cannot read: C-1002;Ben',
];
const out = (a, b) => OUT.slice(a, b).map((str) => ({ str, tone: 'state.normal.bg' }));
const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });

export default {
  area: 'abap',
  theme: 'vscode',
  guide: 'data-types-strings-and-templates',
  figures: [
    editor({
      id: '01-report-file', file: 'zdt_summary.prog.abap', h: 380, code: upTo(['declare']),
      alt: 'Visual Studio Code with the file src/zdt_summary.prog.abap open: a report with the declarations of claim_id as a string, employee and short_name as text fields and item_count as an inline declaration, followed by four WRITE statements; callout 1 marks the report file in the explorer',
      marksFor: (g) => [[g['entry:zdt_summary.prog.abap'], 1]],
    }),
    terminal({
      id: '02-declare-and-convert',
      alt: 'Terminal after npm run run:summary: seven lines of output, from C-1001: 6 characters to Text to number plus 1: 43; callout 3 marks the seven lines',
      lines: [prompt('npm run run:summary'), ...out(0, 7)],
      markLines: [[1, 3, 7]],
    }),
    terminal({
      id: '03-templates-and-functions',
      alt: 'Terminal after npm run run:summary: nine new lines of output that start with the claim line Claim C-1001 for Ada Lovelace: 125.5 EUR and end with Replaced: CLAIM-1001; callout 6 marks the nine lines',
      lines: [prompt('npm run run:summary'), ...out(7, 16)],
      markLines: [[1, 6, 9]],
    }),
    terminal({
      id: '04-split-and-regex',
      alt: 'Terminal after npm run run:summary: nine new lines of output, the split record as 4 parts with each part in square brackets, then the two checks of the claim number, the first item and the masked note; callout 9 marks the nine lines',
      lines: [prompt('npm run run:summary'), ...out(16, 25)],
      markLines: [[1, 9, 9]],
    }),
    editor({
      id: '05-class-file', file: 'zdt_claim_text.clas.abap', h: 680, code: abapText(labText(read('zdt_claim_text.clas.abap'))),
      extra: ['zdt_claim_text.clas.abap', 'zdt_claim_text.clas.xml'],
      alt: 'Visual Studio Code with the file src/zdt_claim_text.clas.abap open: the class zdt_claim_text with the static method summary_line that splits a record, checks the claim number with a pattern, cleans the parts and builds the summary line with a string template; callout 10 marks the class file in the explorer',
      marksFor: (g) => [[g['entry:zdt_claim_text.clas.abap'], 10]],
    }),
    terminal({
      id: '06-first-error',
      alt: 'Terminal after npm run run:summary with the spaces removed inside the braces of the first template: the transpiler stops with the line Error: parser_error, Statement does not exist in the configured ABAP version or a parser error, WRITE, zdt_summary.prog.abap:10 and the program does not run; callout 14 marks the error line',
      lines: [prompt('npm run run:summary'), { str: 'Error: parser_error, Statement does not exist in the configured ABAP version(or a parser error), "WRITE", zdt_summary.prog.abap:10', tone: 'danger' }],
      markLines: [[1, 14]],
    }),
    terminal({
      id: '07-result',
      alt: 'Terminal showing the result of the guide: the command npm run run:summary followed by 28 lines of output that end with the summary line Claim C-1001 pipe ADA LOVELACE pipe 125.50 EUR and two messages for records that do not fit',
      lines: [prompt('npm run run:summary'), ...out(0, 28)],
      markLines: [],
    }),
  ],
};
