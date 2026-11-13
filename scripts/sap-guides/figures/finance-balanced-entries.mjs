// Figures of "SAP Finance Guide: Post Balanced Journal Entries in a Teaching Ledger"
// (erp/sap/finance/guide-post-balanced-journal-entries.adoc). Facts: the teaching model modules/ROOT/examples/sap-lab/ledger run
// with `cds watch` (CAP 10.2.2) on 2026-11-13: the curl answers, the log and the response JSON are what the running service
// returned (the generated ids differ per run), the list report and object page are the Fiori elements preview of the same app.
// The model is not SAP S/4HANA. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, lbl, box, btn, mark, vscodeShell, terminalShell, browserShell, fioriShell, fioriListReport, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'ledger');
const read = (f) => readFileSync(join(lab, f), 'utf8');
// The excerpt of the schema file that figure 01 shows: the two entities of an entry.
const schemaLines = labText(read('db/schema.cds')).split('\n');
const schema = schemaLines.slice(schemaLines.findIndex((l) => l.startsWith('entity JournalEntries')), schemaLines.findIndex((l) => l.startsWith('entity JournalEntryItems')) + 6).join('\n');
// The excerpt of the rules file that figure 02 shows: rule 3 up to the end of the balance check.
const rules = read('srv/ledger-service.js').split('\n');
const r3 = rules.findIndex((l) => l.includes('Rule 3'));
const rulesExcerpt = rules.slice(r3, r3 + 12).map((l) => l.slice(4)).join('\n');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });

function editor({ id, alt, h, explorer, tabs, activeTab, code, marksFor }) {
  const sh = vscodeShell({ h, title: 'ledger', explorer, tabs, activeTab, code });
  const list = marksFor(sh.geo).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}
function terminal({ id, alt, lines, marksOf }) {
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = marksOf.flatMap(([i, n, span = 1]) => {
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const explorer = (active) => [
  { label: 'LEDGER', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'ledger-service.cds', indent: 2 },
  { label: 'ledger-service.js', indent: 2, ...(active === 'ledger-service.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

const entriesJson = `{
  "@odata.context": "$metadata#JournalEntries",
  "value": [
    {
      "Description": "Sales of March",
      "FiscalYear": "2026",
      "FiscalPeriod": "003",
      "ID": "60354b1d-7bd5-4a60-a78a-58bb519b87cc"
    },
    {
      "Description": "Opening deposit from the owner",
      "FiscalYear": "2026",
      "FiscalPeriod": "003",
      "ID": "aaaaaaaa-0000-0000-0000-000000000001"
    }
  ]
}`;

const entryColumns = [{ title: 'Posting Date', w: 2 }, { title: 'Description', w: 4 }, { title: 'Company Code', w: 2 }, { title: 'Fiscal Year', w: 2 }, { title: 'Fiscal Period', w: 2 }];
const entryRows = [['Mar 15, 2026', 'Sales of March', 'EX01', '2026', '003'], ['Mar 2, 2026', 'Opening deposit from the owner', 'EX01', '2026', '003']];

// The object page of the seeded entry, as the preview draws it (Delete only: the model is not draft-enabled).
function objectPage() {
  const y = 52;
  const n = [
    box(0, y, FW, 120, { fill: 'surface', stroke: 'border' }),
    lbl(24, y + 38, 'Opening deposit from the owner', { size: 'heading', weight: 600, box: 700 }),
    btn(FW - 112, y + 20, 88, 'Delete'),
    { block: 'tabs', x: 16, y: y + 84, w: 300, tabs: ['General', 'Lines'], active: 0 },
    lbl(24, y + 158, 'General', { size: 'title', weight: 600, box: 240 }),
    box(16, y + 172, FW - 32, 96, { fill: 'surface', stroke: 'border', radius: 12 }),
  ];
  [['Company Code:', 'EX01'], ['Ledger:', '0L'], ['Posting Date:', 'Mar 2, 2026'], ['Currency:', 'EUR']].forEach(([l, v], i) => n.push(lbl(32 + i * 240, y + 198, l, { size: 'small', tone: 'textMuted', box: 220 }), lbl(32 + i * 240, y + 222, v, { size: 'small', weight: 600, box: 220 })));
  n.push(lbl(24, y + 304, 'Lines (2)', { size: 'title', weight: 600, box: 240 }),
    { block: 'table', x: 16, y: y + 320, w: FW - 32, columns: [{ title: 'G/L Account', w: 2 }, { title: 'Profit Center', w: 2 }, { title: 'Amount in Company Code Currency', w: 3 }], rows: [['113100', 'EX-RETAIL', '5,000.00'], ['300000', 'EX-RETAIL', '-5,000.00']], rowHeight: 40 });
  const h = y + 320 + 120 + 40;
  return { h, nodes: n, geo: { title: { x: 16, y: y + 14, w: 420, h: 36 }, general: { x: 16, y: y + 172, w: FW - 32, h: 96 }, lines: { x: 16, y: y + 320, w: FW - 32, h: 120 }, row: { x: 16, y: y + 400, w: FW - 32, h: 40 } } };
}

export default {
  area: 'finance',
  theme: 'vscode',
  guide: 'post-balanced-journal-entries',
  figures: [
    editor({
      id: '01-schema-file', h: 460, explorer: explorer('schema.cds'), tabs: ['schema.cds'], activeTab: 0, code: cdsCode(schema),
      alt: 'Visual Studio Code with the file db/schema.cds of the ledger project: an excerpt with the entity JournalEntries and its composition of Items and the entity JournalEntryItems with the amount in company code currency; callout 2 marks the file in the explorer',
      marksFor: (g) => [[g['entry:schema.cds'], 2]],
    }),
    editor({
      id: '02-rules-file', h: 360, explorer: explorer('ledger-service.js'), tabs: ['ledger-service.js'], activeTab: 0, code: plainCode(rulesExcerpt),
      alt: 'Visual Studio Code with the file srv/ledger-service.js: the excerpt shows rule 3, which counts at least two lines, adds the debits and the credits in cents and rejects the entry with the message Entry is not balanced when they differ; callout 5 marks the file in the explorer',
      marksFor: (g) => [[g['entry:ledger-service.js'], 5]],
    }),
    terminal({
      id: '03-cds-watch',
      alt: 'Terminal after cds watch in the ledger project: the log lists the model files, loads the CSV files for PostingPeriods, JournalEntryItems and JournalEntries into an in-memory SQLite database, serves LedgerService at /odata/v4/ledger with the implementation srv/ledger-service.js and ends with server listening on http://localhost:4004; callout 6 marks the command',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 4 file(s):'),
        out('  app/annotations.cds'),
        out('  srv/ledger-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.ledger-PostingPeriods.csv'),
        out('  > init from db/data/sap.guide.ledger-JournalEntryItems.csv'),
        out('  > init from db/data/sap.guide.ledger-JournalEntries.csv'),
        out('/> successfully deployed to in-memory database.'),
        out('[cds] - serving LedgerService {'),
        out("  at: [ '/odata/v4/ledger' ],"),
        out("  decl: 'srv/ledger-service.cds:2',"),
        out("  impl: 'srv/ledger-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 6]],
    }),
    terminal({
      id: '04-balanced-posted',
      alt: 'Terminal with the curl command that posts the balanced entry from http/balanced-entry.json to the entity JournalEntries and the answer HTTP 201; callout 7 marks the command and the status',
      lines: [prompt('curl -s -o /dev/null -w "HTTP %{http_code}\\n" --json @http/balanced-entry.json http://localhost:4004/odata/v4/ledger/JournalEntries'), out('HTTP 201', 'state.normal.bg')],
      marksOf: [[0, 7, 2]],
    }),
    {
      id: '05-entries-json', width: FW, height: 460, theme: 'browser',
      alt: 'Browser with the address localhost:4004/odata/v4/ledger/JournalEntries?$select=Description,FiscalYear,FiscalPeriod, marked by callout 8: the JSON response lists the entry Sales of March and the entry Opening deposit from the owner, both with the fiscal year 2026 and the fiscal period 003',
      nodes: (() => {
        const sh = browserShell({ h: 460, url: 'localhost:4004/odata/v4/ledger/JournalEntries?$select=Description,FiscalYear,FiscalPeriod', tab: 'localhost', lines: plainCode(entriesJson) });
        return sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...mark(sh.geo.address, 8)] }));
      })(),
    },
    (() => {
      // A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
      const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
      const cmdA = 'curl -s -w "\\nHTTP %{http_code}\\n" --json @http/unbalanced-entry.json http://localhost:4004/odata/v4/ledger/JournalEntries';
      const cmdB = 'curl -s -w "\\nHTTP %{http_code}\\n" --json @http/closed-period-entry.json http://localhost:4004/odata/v4/ledger/JournalEntries';
      const errA = wrap('{"error":{"message":"Entry is not balanced: debits 12000.00, credits 8000.00","code":"400","target":"in/Items","@Common.numericSeverity":4}}', 'danger');
      const errB = wrap('{"error":{"message":"Posting period 2026/002 is closed for company code EX01","code":"400","target":"in/PostingDate","@Common.numericSeverity":4}}', 'danger');
      const lines = [prompt(cmdA), ...errA, out('HTTP 400', 'danger'), prompt(cmdB), ...errB, out('HTTP 400', 'danger')];
      return terminal({
        id: '06-entries-rejected',
        alt: 'Terminal with two curl commands: the unbalanced entry is answered with the error message Entry is not balanced: debits 12000.00, credits 8000.00 and HTTP 400 (callout 9), and the entry dated in February is answered with Posting period 2026/002 is closed for company code EX01 and HTTP 400 (callout 10); the long answers wrap onto a second line',
        lines,
        marksOf: [[1, 9, errA.length + 1], [3 + errA.length, 10, errB.length + 1]].map(([i, n, span]) => [i, n, span]),
      });
    })(),
    (() => {
      const op = objectPage();
      const list = mark(op.geo.lines, 13);
      return { id: '07-object-page', width: FW, height: op.h, theme: 'sap-fiori', alt: 'Fiori elements object page of the entry Opening deposit from the owner: the tabs are General and Lines, the General section shows Company Code EX01, Ledger 0L, Posting Date Mar 2, 2026 and Currency EUR, and the table Lines (2) with the G/L accounts 113100 and 300000 and the amounts 5,000.00 and -5,000.00 is marked by callout 13', nodes: fioriShell({ h: op.h, title: 'Journal Entry', back: true, children: [...op.nodes, ...list] }) };
    })(),
    (() => {
      const lr = fioriListReport({ rows: entryRows, entity: 'Journal Entries', columns: entryColumns, editing: false, create: false });
      return { id: '08-result', width: FW, height: lr.height, theme: 'sap-fiori', alt: 'Fiori elements list report Journal Entries (2) with the columns Posting Date, Description, Company Code, Fiscal Year and Fiscal Period: the entry Sales of March dated Mar 15, 2026 and the entry Opening deposit from the owner dated Mar 2, 2026, both in fiscal year 2026 and fiscal period 003', nodes: fioriShell({ h: lr.height, title: 'Preview – List of LedgerService.JournalEntries', children: lr.nodes }) };
    })(),
  ],
};
