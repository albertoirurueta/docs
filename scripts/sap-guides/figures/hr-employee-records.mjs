// Figures of "SAP HR Guide: Model Employee Records with Validity Periods"
// (erp/sap/human-resources/guide-model-employee-records-with-validity-periods.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/people run with `cds watch` (CAP 10.2.2) on 2026-11-13: the terminal text and the JSON are what
// the running service returned, the list report and the object page are the Fiori elements preview of the same app. The model is
// not SAP S/4HANA or SAP SuccessFactors; names, numbers and dates are made up. The step numbers are the callout numbers of the
// page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, lbl, box, btn, mark, vscodeShell, terminalShell, browserShell, fioriShell, fioriListReport, cdsCode, plainCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'people');
const read = (f) => readFileSync(join(lab, f), 'utf8').replace(/\n$/, '').split('\n');
// Excerpt of the schema: the entity OrganizationalAssignments with its comment.
const schemaLines = read('db/schema.cds');
const s0 = schemaLines.findIndex((l) => l.startsWith('// Time constraint 1: exactly'));
const schemaExcerpt = schemaLines.slice(s0, schemaLines.findIndex((l, i) => i > s0 && l === '}') + 1).join('\n');
// Excerpt of the rules: from the lookup of the latest record to the delimitation message.
const ruleLines = read('srv/people-service.js');
const r0 = ruleLines.findIndex((l) => l.includes('const latest'));
const rulesExcerpt = ruleLines.slice(r0, ruleLines.findIndex((l) => l.includes('req.info')) + 2).map((l) => l.slice(6)).join('\n');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way. Returns the lines.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
// Builds the lines of a terminal figure from [kind, text, tone] parts and returns { lines, at } where at[i] is the first line of part i.
function build(parts) {
  const lines = [];
  const at = [];
  for (const [kind, str, tone] of parts) {
    at.push(lines.length);
    lines.push(...(kind === 'cmd' ? wrap(`$ ${str}`, 'textMuted') : wrap(str, tone ?? 'text')));
  }
  return { lines, at, count: (i) => (i + 1 < at.length ? at[i + 1] : lines.length) - at[i] };
}

function editor({ id, alt, h, explorer, tab, code, markEntry, n }) {
  const sh = vscodeShell({ h, title: 'people', explorer, tabs: [tab], activeTab: 0, code });
  const list = mark(sh.geo[`entry:${markEntry}`], n);
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
  { label: 'PEOPLE', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'people-service.cds', indent: 2 },
  { label: 'people-service.js', indent: 2, ...(active === 'people-service.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

const historyJson = `{
  "@odata.context": "../$metadata#OrganizationalAssignments",
  "value": [
    {
      "BeginDate": "2024-03-01",
      "EndDate": "2026-06-30",
      "Employee_PersonnelNumber": "00001234"
    },
    {
      "BeginDate": "2026-07-01",
      "EndDate": "9999-12-31",
      "Employee_PersonnelNumber": "00001234"
    }
  ]
}`;

// The object page of Ana Torres with the history tables, as the preview draws it (Delete only: no drafts in the model).
function objectPage() {
  const y = 52;
  const tbl = (ty, columns, rows) => ({ block: 'table', x: 16, y: ty, w: FW - 32, columns, rows, rowHeight: 36 });
  const date = (s) => s;
  const n = [
    box(0, y, FW, 120, { fill: 'surface', stroke: 'border' }),
    lbl(24, y + 38, 'Ana Torres', { size: 'heading', weight: 600, box: 500 }),
    btn(FW - 112, y + 20, 88, 'Delete'),
    { block: 'tabs', x: 16, y: y + 84, w: 700, tabs: ['General', 'Organizational Assignment', 'Basic Pay', 'Parking Permits'], active: 0 },
    lbl(24, y + 158, 'General', { size: 'title', weight: 600, box: 240 }),
    box(16, y + 172, FW - 32, 96, { fill: 'surface', stroke: 'border', radius: 12 }),
  ];
  [['Personnel Number:', '00001234'], ['Name:', 'Ana Torres'], ['Entry Date:', 'Mar 1, 2024']].forEach(([l, v], i) => n.push(lbl(32 + i * 240, y + 198, l, { size: 'small', tone: 'textMuted', box: 220 }), lbl(32 + i * 240, y + 222, v, { size: 'small', weight: 600, box: 220 })));
  let cy = y + 300;
  const geo = {};
  n.push(lbl(24, cy, 'Organizational Assignment (2)', { size: 'title', weight: 600, box: 400 }),
    tbl(cy + 16, [{ title: 'Valid From', w: 2 }, { title: 'Valid To', w: 2 }, { title: 'Personnel Subarea', w: 2 }, { title: 'Employee Subgroup', w: 2 }, { title: 'Position', w: 2 }],
      [['Mar 1, 2024', 'Jun 30, 2026', '0001', 'AA', '51000001'], ['Jul 1, 2026', 'Dec 31, 9999', '0002', 'AA', '51000001']].map((r) => r.map(date))));
  geo.org = { x: 16, y: cy + 16, w: FW - 32, h: 36 * 3 };
  cy += 16 + 108 + 40;
  n.push(lbl(24, cy, 'Basic Pay (1)', { size: 'title', weight: 600, box: 400 }),
    tbl(cy + 16, [{ title: 'Valid From', w: 2 }, { title: 'Valid To', w: 2 }, { title: 'Pay Basis', w: 2 }, { title: 'Amount', w: 2 }, { title: 'Currency', w: 2 }], [['Mar 1, 2024', 'Dec 31, 9999', 'Monthly', '4,000.00', 'EUR']]));
  cy += 16 + 72 + 40;
  n.push(lbl(24, cy, 'Parking Permits (1)', { size: 'title', weight: 600, box: 400 }),
    tbl(cy + 16, [{ title: 'Valid From', w: 2 }, { title: 'Valid To', w: 2 }, { title: 'Permit', w: 2 }], [['Jan 1, 2025', 'May 31, 2025', 'A-1']]));
  cy += 16 + 72 + 24;
  return { h: cy, nodes: n, geo };
}

export default {
  area: 'hr',
  theme: 'vscode',
  guide: 'model-employee-records-with-validity-periods',
  figures: [
    editor({
      id: '01-schema-file', h: 420, explorer: explorer('schema.cds'), tab: 'schema.cds', code: cdsCode(schemaExcerpt), markEntry: 'schema.cds', n: 2,
      alt: 'Visual Studio Code with the file db/schema.cds of the people project: an excerpt with the comment Time constraint 1 and the entity OrganizationalAssignments, whose key is the employee and the begin date and which has an end date that defaults to 9999-12-31; callout 2 marks the file in the explorer',
    }),
    editor({
      id: '02-delimit-rule', h: 460, explorer: explorer('people-service.js'), tab: 'people-service.js', code: plainCode(rulesExcerpt), markEntry: 'people-service.js', n: 5,
      alt: 'Visual Studio Code with the file srv/people-service.js: the excerpt looks up the latest record of the employee, rejects a begin date that is not after it, and otherwise sets the end date of the old record to the day before the new begin date and issues a message; callout 5 marks the file in the explorer',
    }),
    terminal({
      id: '03-cds-watch',
      alt: 'Terminal after cds watch in the people project: the log lists the model files, loads the four CSV files into an in-memory SQLite database, serves PeopleService at /odata/v4/people with the implementation srv/people-service.js and ends with server listening on http://localhost:4004; callout 6 marks the command',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  app/annotations.cds'),
        out('  srv/people-service.cds'),
        out('  db/schema.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.people-ParkingPermits.csv'),
        out('  > init from db/data/sap.guide.people-OrganizationalAssignments.csv'),
        out('  > init from db/data/sap.guide.people-Employees.csv'),
        out('  > init from db/data/sap.guide.people-BasicPayRecords.csv'),
        out('/> successfully deployed to in-memory database.'),
        out('[cds] - serving PeopleService {'),
        out("  at: [ '/odata/v4/people' ],"),
        out("  decl: 'srv/people-service.cds:2',"),
        out("  impl: 'srv/people-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 6]],
    }),
    (() => {
      const t = build([
        ['cmd', 'curl -s -i --json @http/new-assignment.json http://localhost:4004/odata/v4/people/OrganizationalAssignments | grep -E "^(HTTP|sap-messages)"'],
        ['out', 'HTTP/1.1 201 Created'],
        ['out', 'sap-messages: [{"code":"","message":"The record from 2024-03-01 was delimited to 2026-06-30","numericSeverity":2}]'],
        ['cmd', 'curl -s -i --json @http/new-permit.json http://localhost:4004/odata/v4/people/ParkingPermits | grep -E "^(HTTP|sap-messages)"'],
        ['out', 'HTTP/1.1 201 Created'],
        ['out', 'sap-messages: [{"code":"","message":"The record from 2025-01-01 was delimited to 2025-05-31","numericSeverity":2}]'],
      ]);
      return terminal({
        id: '04-records-delimited',
        alt: 'Terminal with two curl commands that post a new organizational assignment from 2026-07-01 and a new parking permit from 2025-06-01: each answers HTTP/1.1 201 Created and an sap-messages header that says the old record was delimited, to 2026-06-30 for the assignment (callout 7) and to 2025-05-31 for the permit (callout 8)',
        lines: t.lines,
        marksOf: [[t.at[2], 7, t.count(2)], [t.at[5], 8, t.count(5)]],
      });
    })(),
    (() => {
      const url = "localhost:4004/odata/v4/people/Employees('00001234')/OrgAssignments?$select=BeginDate,EndDate&$orderby=BeginDate";
      const sh = browserShell({ h: 420, url, tab: 'localhost', lines: plainCode(historyJson) });
      return {
        id: '05-history-json', width: FW, height: 420, theme: 'browser',
        alt: 'Browser with the address of the organizational assignments of the employee 00001234 in the order of the begin date, marked by callout 9: the JSON response holds two records, from 2024-03-01 to 2026-06-30 and from 2026-07-01 to 9999-12-31, without a gap between them',
        nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...mark(sh.geo.address, 9)] })),
      };
    })(),
    (() => {
      const t = build([
        ['cmd', `curl -s -w "\\nHTTP %{http_code}\\n" -X DELETE "http://localhost:4004/odata/v4/people/BasicPayRecords(Employee_PersonnelNumber='00001234',BeginDate=2024-03-01)"`],
        ['out', '{"error":{"message":"A record with time constraint 1 cannot be deleted","code":"400","@Common.numericSeverity":4}}', 'danger'],
        ['out', 'HTTP 400', 'danger'],
        ['cmd', `curl -s -w "HTTP %{http_code}\\n" -X DELETE "http://localhost:4004/odata/v4/people/ParkingPermits(Employee_PersonnelNumber='00001234',BeginDate=2025-06-01)"`],
        ['out', 'HTTP 204', 'state.normal.bg'],
      ]);
      return terminal({
        id: '06-delete-rules',
        alt: 'Terminal with two curl commands that delete a record: the delete of the basic pay record is answered with the message A record with time constraint 1 cannot be deleted and HTTP 400 (callout 10), the delete of the parking permit is answered with HTTP 204 (callout 11)',
        lines: t.lines,
        marksOf: [[t.at[1], 10, t.count(1) + t.count(2)], [t.at[4], 11, t.count(4)]],
      });
    })(),
    (() => {
      const lr = fioriListReport({ rows: [['00001234', 'Ana Torres', 'Mar 1, 2024'], ['00001235', 'Ben Okoye', 'Sep 1, 2024'], ['00001236', 'Chloe Martin', 'Jan 15, 2025']], entity: 'Employees', columns: [{ title: 'Personnel Number', w: 3 }, { title: 'Name', w: 4 }, { title: 'Entry Date', w: 2 }], editing: false, create: false });
      const list = mark(lr.geo.row[0], 13);
      return { id: '07-employee-list', width: FW, height: lr.height, theme: 'sap-fiori', alt: 'Fiori elements list report Employees (3) with the columns Personnel Number, Name and Entry Date: Ana Torres 00001234 entered on Mar 1, 2024, Ben Okoye 00001235 and Chloe Martin 00001236; callout 13 marks the row of Ana Torres', nodes: fioriShell({ h: lr.height, title: 'Preview – List of PeopleService.Employees', children: [...lr.nodes, ...list] }) };
    })(),
    (() => {
      const op = objectPage();
      return { id: '08-result', width: FW, height: op.h, theme: 'sap-fiori', alt: 'Fiori elements object page of the employee Ana Torres with the tabs General, Organizational Assignment, Basic Pay and Parking Permits: the table Organizational Assignment (2) shows the records from Mar 1, 2024 to Jun 30, 2026 in personnel subarea 0001 and from Jul 1, 2026 to Dec 31, 9999 in personnel subarea 0002, the table Basic Pay (1) shows 4,000.00 EUR monthly from Mar 1, 2024 and the table Parking Permits (1) shows the permit A-1 from Jan 1, 2025 to May 31, 2025', nodes: fioriShell({ h: op.h, title: 'Employee', back: true, children: op.nodes }) };
    })(),
  ],
};
