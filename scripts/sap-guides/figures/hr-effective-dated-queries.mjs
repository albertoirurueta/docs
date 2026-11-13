// Figures of "SAP HR Guide: Query Effective-Dated Employee Data"
// (erp/sap/human-resources/guide-query-effective-dated-employee-data.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/people-queries run with `cds watch` (CAP 10.2.2) and curl 8.7 on 2026-11-13: the terminal text
// and the JSON are what the running service returned (the answers without a date parameter are those of that day), the editor
// text is read from the lab files. The model is not SAP S/4HANA or SAP SuccessFactors; names, numbers and dates are made up.
// The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, browserShell, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'people-queries');
const text = (f) => readFileSync(join(lab, f), 'utf8');
// Excerpt of the schema: the entity OrganizationalAssignments with its comment.
const schemaLines = text('db/schema.cds').replace(/\n$/, '').split('\n');
const s0 = schemaLines.findIndex((l) => l.startsWith('// Time constraint 1: exactly'));
const schemaExcerpt = schemaLines.slice(s0, schemaLines.findIndex((l, i) => i > s0 && l === '}') + 1).join('\n');
// The tagged region of the service: the date parameters, without the tag lines, moved left by the indent of the class body.
const rulesExcerpt = labText(text('srv/people-service.js'), { only: ['dates'] }).split('\n').map((l) => l.slice(4)).join('\n');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
// Builds the lines of a terminal figure from [kind, text, tone] parts and returns { lines, at, count }.
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
  const sh = vscodeShell({ h, title: 'people-queries', explorer, tabs: [tab], activeTab: 0, code });
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
  { label: 'PEOPLE-QUERIES', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'people-service.cds', indent: 2 },
  { label: 'people-service.js', indent: 2, ...(active === 'people-service.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

const B = 'http://localhost:4004/odata/v4/people';
const SEL = '$select=Employee_PersonnelNumber,PersonnelSubarea&$orderby=Employee_PersonnelNumber';
const CTX = '{"@odata.context":"$metadata#OrganizationalAssignments","value":[';
const sub = (n, s, b) => `{"Employee_PersonnelNumber":"0000123${n}","PersonnelSubarea":"${s}","BeginDate":"${b}"}`;
const ben = sub(5, '0001', '2024-09-01');
const chloe = sub(6, '0002', '2025-01-15');
const err = (m) => `{"error":{"message":"${m}","code":"400","@Common.numericSeverity":4}}`;

const resultJson = `{
  "@odata.context": "$metadata#OrganizationalAssignments",
  "value": [
    {
      "PersonnelSubarea": "0001",
      "Employee_PersonnelNumber": "00001234",
      "BeginDate": "2024-03-01"
    }
  ]
}`;

export default {
  area: 'hr',
  theme: 'vscode',
  guide: 'query-effective-dated-employee-data',
  figures: [
    editor({
      id: '01-schema-file', h: 420, explorer: explorer('schema.cds'), tab: 'schema.cds', code: cdsCode(schemaExcerpt), markEntry: 'schema.cds', n: 2,
      alt: 'Visual Studio Code with the file db/schema.cds of the people-queries project: an excerpt with the comment Time constraint 1 and the entity OrganizationalAssignments, whose key is the employee and the begin date and which has an end date that defaults to 9999-12-31; callout 2 marks the file in the explorer',
    }),
    editor({
      id: '02-date-rules', h: 870, explorer: explorer('people-service.js'), tab: 'people-service.js', code: plainCode(rulesExcerpt), markEntry: 'people-service.js', n: 5,
      alt: 'Visual Studio Code with the file srv/people-service.js: the excerpt reads asOfDate, fromDate and toDate from the query, rejects a value that is not a date written YYYY-MM-DD, rejects asOfDate together with a range, and adds a where condition that keeps the records whose begin date is on or before the date and whose end date is on or after it; callout 5 marks the file in the explorer',
    }),
    terminal({
      id: '03-cds-watch',
      alt: 'Terminal after cds watch in the people-queries project: the log lists the model files, loads the four CSV files into an in-memory SQLite database, serves PeopleService at /odata/v4/people with the implementation srv/people-service.js and ends with server listening on http://localhost:4004; callout 6 marks the command',
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
        out("  decl: 'srv/people-service.cds:6',"),
        out("  impl: 'srv/people-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 6]],
    }),
    (() => {
      const t = build([
        ['cmd', `curl -s '${B}/OrganizationalAssignments?${SEL}'`],
        ['out', `${CTX}${sub(4, '0002', '2026-07-01')},${ben},${chloe}]}`],
        ['cmd', `curl -s '${B}/OrganizationalAssignments?asOfDate=2025-06-30&${SEL}'`],
        ['out', `${CTX}${sub(4, '0001', '2024-03-01')},${ben},${chloe}]}`],
        ['cmd', `curl -s '${B}/OrganizationalAssignments?asOfDate=2026-07-01&${SEL}'`],
        ['out', `${CTX}${sub(4, '0002', '2026-07-01')},${ben},${chloe}]}`],
      ]);
      return terminal({
        id: '04-as-of-date',
        alt: 'Terminal with three curl commands on the organizational assignments: without a date parameter the answer is the current records, where Ana Torres 00001234 is in personnel subarea 0002 from 2026-07-01 (callout 7); asOfDate=2025-06-30 returns her record from 2024-03-01 in subarea 0001 (callout 8); asOfDate=2026-07-01 returns her record from 2026-07-01 in subarea 0002 (callout 9); Ben Okoye and Chloe Martin have one record each; the long answers wrap onto several lines',
        lines: t.lines,
        marksOf: [[t.at[0], 7, t.count(0) + t.count(1)], [t.at[2], 8, t.count(2) + t.count(3)], [t.at[4], 9, t.count(4) + t.count(5)]],
      });
    })(),
    (() => {
      const permit = '{"Employee_PersonnelNumber":"00001234","BeginDate":"2025-01-01","EndDate":"2025-05-31","Permit":"A-1"}';
      const t = build([
        ['cmd', `curl -s '${B}/OrganizationalAssignments?fromDate=2026-06-01&toDate=2026-07-31&$filter=Employee_PersonnelNumber%20eq%20%2700001234%27&$select=BeginDate,EndDate,PersonnelSubarea&$orderby=BeginDate'`],
        ['out', `${CTX}{"BeginDate":"2024-03-01","EndDate":"2026-06-30","PersonnelSubarea":"0001","Employee_PersonnelNumber":"00001234"},{"BeginDate":"2026-07-01","EndDate":"9999-12-31","PersonnelSubarea":"0002","Employee_PersonnelNumber":"00001234"}]}`],
        ['cmd', `curl -s '${B}/ParkingPermits?asOfDate=2025-05-31'`],
        ['out', `{"@odata.context":"$metadata#ParkingPermits","value":[${permit}]}`],
        ['cmd', `curl -s '${B}/ParkingPermits?asOfDate=2025-06-01'`],
        ['out', '{"@odata.context":"$metadata#ParkingPermits","value":[]}'],
      ]);
      return terminal({
        id: '05-range-and-gap',
        alt: 'Terminal with three curl commands: the range from 2026-06-01 to 2026-07-31 for Ana Torres returns both of her records, the one from 2024-03-01 to 2026-06-30 in subarea 0001 and the one from 2026-07-01 to 9999-12-31 in subarea 0002 (callout 10); asOfDate=2025-05-31 on the parking permits returns the permit A-1 (callout 11); asOfDate=2025-06-01 returns an empty value list, the gap after the permit (callout 12); the long answers wrap onto several lines',
        lines: t.lines,
        marksOf: [[t.at[0], 10, t.count(0) + t.count(1)], [t.at[2], 11, t.count(2) + t.count(3)], [t.at[4], 12, t.count(4) + t.count(5)]],
      });
    })(),
    (() => {
      const t = build([
        ['cmd', `curl -s -w '\\nHTTP %{http_code}\\n' '${B}/OrganizationalAssignments?asOfDate=2025-06-30&fromDate=2025-01-01&toDate=2025-12-31'`],
        ['out', err('Use asOfDate or fromDate with toDate, not both'), 'danger'],
        ['out', 'HTTP 400', 'danger'],
        ['cmd', `curl -s -w '\\nHTTP %{http_code}\\n' '${B}/OrganizationalAssignments?asOfDate=30.06.2025'`],
        ['out', err('asOfDate must be a date written YYYY-MM-DD'), 'danger'],
        ['out', 'HTTP 400', 'danger'],
      ]);
      return terminal({
        id: '06-rejected',
        alt: 'Terminal with two curl commands that the service rejects with HTTP 400: asOfDate together with fromDate and toDate is answered with the message Use asOfDate or fromDate with toDate, not both (callout 14), and asOfDate=30.06.2025 is answered with the message asOfDate must be a date written YYYY-MM-DD (callout 15)',
        lines: t.lines,
        marksOf: [[t.at[0], 14, t.count(0) + t.count(1) + t.count(2)], [t.at[3], 15, t.count(3) + t.count(4) + t.count(5)]],
      });
    })(),
    (() => {
      const url = 'localhost:4004/odata/v4/people/OrganizationalAssignments?asOfDate=2024-06-01&$select=PersonnelSubarea';
      const sh = browserShell({ h: 420, url, tab: 'localhost', lines: plainCode(resultJson) });
      return {
        id: '07-result', width: FW, height: 420, theme: 'browser',
        alt: 'Browser with the address of the organizational assignments as of 2024-06-01, marked by callout 13: the JSON response holds one record, the one of the employee 00001234 from 2024-03-01 in personnel subarea 0001, because Ben Okoye and Chloe Martin were hired later',
        nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...mark(sh.geo.address, 13)] })),
      };
    })(),
  ],
};
