// Figures of "SAP HR Guide: Compute Pay for a Partial Period and Gross-to-Net"
// (erp/sap/human-resources/guide-compute-pay-for-a-partial-period.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/payroll-period run with `npm test` and `cds watch` (CAP 10.2.2) on 2026-11-13: the terminal text
// and the JSON are what the test run and the running service returned, the list report and the object page are the Fiori
// elements preview of the same app. The model is not SAP S/4HANA, SAP HCM or SAP Payroll; names, rates, numbers and dates are
// made up. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, lbl, box, mark, vscodeShell, terminalShell, fioriShell, fioriListReport, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'payroll-period');
const read = (f) => readFileSync(join(lab, f), 'utf8');
// Excerpt of the schema: the rates and the absences.
const schemaLines = read('db/schema.cds').replace(/\n$/, '').split('\n');
const s0 = schemaLines.findIndex((l) => l.startsWith('// Flat example rates'));
const s1 = schemaLines.findIndex((l) => l.startsWith('entity Absences'));
const schemaExcerpt = schemaLines.slice(s0, schemaLines.findIndex((l, i) => i > s1 && l === '}') + 1).join('\n');
// Excerpt of the arithmetic: the partial period factor and the gross pay.
const factorExcerpt = labText(read('srv/pay.js'), { only: ['factor'] });

const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
// Builds the lines of a terminal figure from [kind, text, tone] parts; at[i] is the first line of part i.
function build(parts) {
  const lines = [];
  const at = [];
  for (const [kind, str, tone] of parts) {
    at.push(lines.length);
    lines.push(...(kind === 'cmd' ? wrap(`$ ${str}`, 'textMuted') : wrap(str, tone ?? 'text')));
  }
  return { lines, at, count: (i) => (i + 1 < at.length ? at[i + 1] : lines.length) - at[i] };
}

const codeHeight = (n) => Math.max(300, 150 + n * 19);
function editor({ id, alt, explorer, tab, code, markEntry, n }) {
  const h = codeHeight(code.length);
  const sh = vscodeShell({ h, title: 'payroll-period', explorer, tabs: [tab], activeTab: 0, code });
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
  { label: 'PAYROLL-PERIOD', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'pay.js', indent: 2, ...(active === 'pay.js' ? { active: true } : {}) },
  { label: 'payroll-service.cds', indent: 2 },
  { label: 'payroll-service.js', indent: 2 },
  { label: 'package.json', indent: 1 },
];

// The answers of the service, as `curl` printed them (a run from a fresh start: the payslip numbers are 1 to 4).
const anaJson = '{"@odata.context":"$metadata#Payslips/$entity","Number":1,"PersonnelNumber":"00001234","EmployeeName":"Ana Torres","Period":"2026-03","FromDate":"2026-03-01","ToDate":"2026-03-31","Method":"PWS","PlannedDays":22,"AbsentDays":0,"DivisorDays":22,"Numerator":22,"Factor":"1.0000","BasicPay":"4000.00","GrossPay":"4000.00","SocialEmployee":"800.00","IncomeTax":"480.00","NetPay":"2720.00","Voluntary":"0.00","Payment":"2720.00","SocialEmployer":"840.00","EmployerCost":"4840.00"}';
const benJson = '{"@odata.context":"$metadata#Payslips/$entity","Number":2,"PersonnelNumber":"00001235","EmployeeName":"Ben Okoye","Period":"2026-03","FromDate":"2026-03-01","ToDate":"2026-03-31","Method":"PWS","PlannedDays":22,"AbsentDays":5,"DivisorDays":22,"Numerator":17,"Factor":"0.7727","BasicPay":"2400.00","GrossPay":"1854.55","SocialEmployee":"370.91","IncomeTax":"222.55","NetPay":"1261.09","Voluntary":"25.00","Payment":"1236.09","SocialEmployer":"389.46","EmployerCost":"2244.01"}';
const listJson = '{"@odata.context":"$metadata#Payslips","value":[{"Number":1,"EmployeeName":"Ana Torres","Method":"PWS","Factor":"1.0000","GrossPay":"4000.00","NetPay":"2720.00","Payment":"2720.00"},{"Number":2,"EmployeeName":"Ben Okoye","Method":"PWS","Factor":"0.7727","GrossPay":"1854.55","NetPay":"1261.09","Payment":"1236.09"},{"Number":3,"EmployeeName":"Ben Okoye","Method":"PAYMENT","Factor":"0.8095","GrossPay":"1942.86","NetPay":"1321.15","Payment":"1296.15"},{"Number":4,"EmployeeName":"Ben Okoye","Method":"DEDUCTION","Factor":"0.7619","GrossPay":"1828.57","NetPay":"1243.43","Payment":"1218.43"}]}';

const U = 'http://localhost:4004/odata/v4/payroll';

// The object page of Ben's first payslip, as the preview draws it (no buttons: the entities are read-only).
function objectPage() {
  const y = 52;
  const tbl = (ty, columns, rows) => ({ block: 'table', x: 16, y: ty, w: FW - 32, columns, rows, rowHeight: 36 });
  const n = [
    box(0, y, FW, 120, { fill: 'surface', stroke: 'border' }),
    lbl(24, y + 38, 'Ben Okoye', { size: 'heading', weight: 600, box: 500 }),
    { block: 'tabs', x: 16, y: y + 84, w: 360, tabs: ['Calculation', 'Payslip'], active: 0 },
    lbl(24, y + 158, 'Calculation', { size: 'title', weight: 600, box: 240 }),
    box(16, y + 172, FW - 32, 160, { fill: 'surface', stroke: 'border', radius: 12 }),
  ];
  // Three columns, filled column by column, as the preview lays the field group out.
  const cols = [[['Period:', '2026-03'], ['Paid From:', 'Mar 1, 2026'], ['Paid To:', 'Mar 31, 2026']],
    [['Method:', 'PWS'], ['Planned Days:', '22'], ['Days Not Paid:', '5']],
    [['Divisor Days:', '22'], ['Numerator:', '17'], ['Partial Period Factor:', '0.7727']]];
  cols.forEach((col, c) => col.forEach(([l, v], r) => n.push(lbl(32 + c * 340, y + 198 + r * 48, l, { size: 'small', tone: 'textMuted', box: 300 }), lbl(32 + c * 340, y + 220 + r * 48, v, { size: 'small', weight: 600, box: 300 }))));
  const cy = y + 372;
  n.push(lbl(24, cy, 'Payslip (9)', { size: 'title', weight: 600, box: 400 }),
    tbl(cy + 16, [{ title: 'No.', w: 1 }, { title: 'Line', w: 5 }, { title: 'Basis', w: 3 }, { title: 'Amount (EUR)', w: 2 }], [
      ['1', 'Basic pay (monthly)', '2,400.00', '2,400.00'],
      ['2', 'Partial period adjustment', '17 / 22 = 0.7727', '-545.45'],
      ['3', 'Gross pay', '', '1,854.55'],
      ['4', 'Employee social contributions', '20.00% of 1,854.55', '-370.91'],
      ['5', 'Income tax', '15.00% of 1,483.64', '-222.55'],
      ['6', 'Net pay', '', '1,261.09'],
      ['7', 'Voluntary: Canteen card', 'fixed per month', '-25.00'],
      ['8', 'Payment', '', '1,236.09'],
      ['9', 'Employer contributions (not on the payslip)', '21.00% of 1,854.55', '389.46'],
    ]));
  return { h: cy + 16 + 36 * 10 + 24, nodes: n };
}

export default {
  area: 'hr',
  theme: 'vscode',
  guide: 'compute-pay-for-a-partial-period',
  figures: [
    editor({
      id: '01-schema-file', explorer: explorer('schema.cds'), tab: 'schema.cds', code: cdsCode(schemaExcerpt), markEntry: 'schema.cds', n: 2,
      alt: 'Visual Studio Code with the file db/schema.cds of the payroll-period project: an excerpt with the entity Rates, whose percent field holds 20.00 for 20 percent, and the entity Absences with the employee and the begin date as key and an end date; callout 2 marks the file in the explorer',
    }),
    editor({
      id: '02-factor-rule', explorer: explorer('pay.js'), tab: 'pay.js', code: plainCode(factorExcerpt), markEntry: 'pay.js', n: 4,
      alt: 'Visual Studio Code with the file srv/pay.js: the excerpt lists the three methods PWS, PAYMENT and DEDUCTION, the function partialPeriodFactor that returns a numerator and a divisor in working days for each method, and the function grossPay that multiplies the basic pay by the fraction and rounds once; callout 4 marks the file in the explorer',
    }),
    (() => {
      const lines = [
        out('$ npm test', 'textMuted'),
        out('> payroll-period@1.0.0 test'),
        out('> node --test'),
        out(''),
        ...[
          ['the rounding rule rounds half up to the cent', '132.268041'],
          ['working days are Monday to Friday, public holidays ignored', '0.214125'],
          ['a full month gives Ana the payslip of the reference pages', '29.426834'],
          ['five unpaid days give three different gross amounts', '7.583917'],
          ['gross to net for Ben with PWS and a voluntary deduction', '2.413584'],
          ['the stored payslip lines add up from basic pay to payment', '4.966209'],
          ['without absence the payment method pays above basic pay', '2.132167'],
          ['a month split in two partial periods adds up only with PWS', '11.136458'],
          ['wrong input is rejected with a message', '4.361667'],
        ].map(([name, ms]) => out(`✔ ${name} (${ms}ms)`, 'state.normal.bg')),
        out('ℹ tests 9'),
        out('ℹ suites 0'),
        out('ℹ pass 9', 'state.normal.bg'),
        out('ℹ fail 0'),
        out('ℹ cancelled 0'),
        out('ℹ skipped 0'),
        out('ℹ todo 0'),
        out('ℹ duration_ms 242.223542'),
      ];
      return terminal({
        id: '03-npm-test', lines, marksOf: [[0, 7]],
        alt: 'Terminal after npm test in the payroll-period project: the nine tests pass, among them the rounding rule, the working days, the full month of Ana, the three methods for Ben and the rejection of wrong input; the summary reads pass 9 and fail 0; callout 7 marks the command',
      });
    })(),
    terminal({
      id: '04-cds-watch',
      alt: 'Terminal after cds watch in the payroll-period project: the log lists the three model files, loads the five CSV files into an in-memory SQLite database, serves PayrollService at /odata/v4/payroll with the implementation srv/payroll-service.js and ends with server listening on http://localhost:4004; callout 8 marks the command',
      lines: [
        out('$ cds watch', 'textMuted'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  app/annotations.cds'),
        out('  srv/payroll-service.cds'),
        out('  db/schema.cds'),
        out("[cds] - using bindings from: { registry: '~/.cds/services' }"),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.payroll-VoluntaryDeductions.csv'),
        out('  > init from db/data/sap.guide.payroll-Rates.csv'),
        out('  > init from db/data/sap.guide.payroll-PayrollAreas.csv'),
        out('  > init from db/data/sap.guide.payroll-Employees.csv'),
        out('  > init from db/data/sap.guide.payroll-Absences.csv'),
        out('/> successfully deployed to in-memory database.'),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving PayrollService {'),
        out("  at: [ '/odata/v4/payroll' ],"),
        out("  decl: 'srv/payroll-service.cds:3',"),
        out("  impl: 'srv/payroll-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
        out('[cds] - server v10.2.2 launched in 186 ms'),
      ],
      marksOf: [[0, 8]],
    }),
    (() => {
      const t = build([
        ['cmd', `curl -s --json @http/calc-ana.json ${U}/calculate`],
        ['out', anaJson],
        ['cmd', `curl -s --json @http/calc-ben-pws.json ${U}/calculate`],
        ['out', benJson],
      ]);
      return terminal({
        id: '05-calculate',
        alt: 'Terminal with two curl commands that calculate a payslip: the answer for Ana Torres has the factor 1.0000, gross 4000.00, net 2720.00 and employer cost 4840.00 (callout 9); the answer for Ben Okoye has 5 days not paid, the fraction 17 over 22, the factor 0.7727, gross 1854.55, net 1261.09, payment 1236.09 and employer cost 2244.01 (callout 10)',
        lines: t.lines,
        marksOf: [[t.at[1], 9, t.count(1)], [t.at[3], 10, t.count(3)]],
      });
    })(),
    (() => {
      const t = build([
        ['cmd', `curl -s -o /dev/null -w "HTTP %{http_code}\\n" --json @http/calc-ben-payment.json ${U}/calculate`],
        ['out', 'HTTP 200'],
        ['cmd', `curl -s -o /dev/null -w "HTTP %{http_code}\\n" --json @http/calc-ben-deduction.json ${U}/calculate`],
        ['out', 'HTTP 200'],
        ['cmd', `curl -s '${U}/Payslips?$select=Number,EmployeeName,Method,Factor,GrossPay,NetPay,Payment&$orderby=Number'`],
        ['out', listJson],
      ]);
      return terminal({
        id: '06-three-methods',
        alt: 'Terminal with two curl commands that calculate Ben payslips with the payment and the deduction method, each answered with HTTP 200 (callout 11), and a curl command that lists the four stored payslips: Ben gross pay is 1854.55 with PWS, 1942.86 with PAYMENT and 1828.57 with DEDUCTION, and the factors are 0.7727, 0.8095 and 0.7619 (callout 12)',
        lines: t.lines,
        marksOf: [[t.at[0], 11, t.count(0) + t.count(1) + t.count(2) + t.count(3)], [t.at[5], 12, t.count(5)]],
      });
    })(),
    (() => {
      const rows = [['1', 'Ana Torres', '2026-03', 'PWS', '1.0000', '4,000.00', '2,720.00', '2,720.00'], ['2', 'Ben Okoye', '2026-03', 'PWS', '0.7727', '1,854.55', '1,261.09', '1,236.09'], ['3', 'Ben Okoye', '2026-03', 'PAYMENT', '0.8095', '1,942.86', '1,321.15', '1,296.15'], ['4', 'Ben Okoye', '2026-03', 'DEDUCTION', '0.7619', '1,828.57', '1,243.43', '1,218.43']];
      const lr = fioriListReport({ rows, entity: 'Payslips', columns: [{ title: 'Payslip', w: 1 }, { title: 'Name', w: 3 }, { title: 'Period', w: 1.5 }, { title: 'Method', w: 2 }, { title: 'Factor', w: 1.5 }, { title: 'Gross Pay', w: 2 }, { title: 'Net Pay', w: 2 }, { title: 'Payment', w: 2 }], editing: false, create: false, del: false });
      const list = [...mark({ x: 24, y: lr.geo.tableTop + 8, w: 240, h: 38 }, 14), ...mark(lr.geo.row[1], 15)];
      return { id: '07-payslip-list', width: FW, height: lr.height, theme: 'sap-fiori', alt: 'Fiori elements list report Payslips (4) with the columns Payslip, Name, Period, Method, Factor, Gross Pay, Net Pay and Payment: the payslip of Ana Torres has the factor 1.0000 and Ben Okoye has three payslips with PWS, PAYMENT and DEDUCTION; callout 14 marks the table title and callout 15 the first payslip of Ben Okoye', nodes: fioriShell({ h: lr.height, title: 'Preview – List of PayrollService.Payslips', children: [...lr.nodes, ...list] }) };
    })(),
    (() => {
      const op = objectPage();
      return { id: '08-result', width: FW, height: op.h, theme: 'sap-fiori', alt: 'Fiori elements object page of the payslip of Ben Okoye with the tabs Calculation and Payslip: the calculation shows the period 2026-03, paid from Mar 1, 2026 to Mar 31, 2026, the method PWS, 22 planned days, 5 days not paid, the divisor 22, the numerator 17 and the partial period factor 0.7727; the table Payslip (9) runs from the basic pay 2,400.00 through the partial period adjustment of -545.45, the gross pay 1,854.55, the deductions 370.91, 222.55 and 25.00, and the net pay 1,261.09 to the payment 1,236.09, and ends with the employer contributions 389.46', nodes: fioriShell({ h: op.h, title: 'Payslip', back: true, children: op.nodes }) };
    })(),
  ],
};
