// Figures of "SAP Finance Guide: Compute a Depreciation Schedule"
// (erp/sap/finance/guide-compute-a-depreciation-schedule.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/depreciation run with `cds watch` (CAP 10.2.2) on 2026-11-13: the curl answers, the log and the
// test output are what the running service and `npm test` printed (test times differ per run). The model is not SAP S/4HANA.
// The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'depreciation');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const schema = labText(read('db/schema.cds')).split('\n');
// Figure 01 shows the entity of the schema file.
const schemaExcerpt = schema.slice(schema.findIndex((l) => l.startsWith('entity Assets'))).join('\n');
// Figure 02 shows the loop of the schedule function; the page includes the whole file.
const sched = read('srv/schedule.js').split('\n');
const loopFrom = sched.findIndex((l) => l.includes('for (let year'));
const loopExcerpt = sched.slice(loopFrom, loopFrom + 20).join('\n');
// Figure 03 shows the first handler of the service file.
const handlerExcerpt = read('srv/depreciation-service.js').split('\n').slice(0, 14).join('\n');
// Figure 08 shows the tagged regions of the test file.
const testExcerpt = labText(read('test/service.test.js'), { only: ['sap', 'van'] });

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
const wrapCmd = (str) => str.match(/.{1,116}/g).map((part, i) => (i === 0 ? prompt(part) : out(part, 'textMuted')));

const codeH = (n) => 65 + 30 + n * 19 + 24 + 30;

function editor({ id, alt, explorer, tabs, activeTab, code, marksFor, lines }) {
  const h = codeH(lines);
  const sh = vscodeShell({ h, title: 'depreciation', explorer, tabs, activeTab, code });
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
  { label: 'DEPRECIATION', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true, open: true },
  { label: 'sap.guide.depreciation-Assets.csv', indent: 3 },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'depreciation-service.cds', indent: 2, ...(active === 'depreciation-service.cds' ? { active: true } : {}) },
  { label: 'depreciation-service.js', indent: 2, ...(active === 'depreciation-service.js' ? { active: true } : {}) },
  { label: 'schedule.js', indent: 2, ...(active === 'schedule.js' ? { active: true } : {}) },
  { label: 'test', indent: 1, folder: true, open: true },
  { label: 'service.test.js', indent: 2, ...(active === 'service.test.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

const base = 'http://localhost:4004/odata/v4/depreciation';
const jq = "jq -c '.value[] | {Year,Depreciation,NetBookValue,Rule}'";
const rowsA = ["{\"Year\":1,\"Depreciation\":\"3000.00\",\"NetBookValue\":\"12000.00\",\"Rule\":\"straight-line\"}", "{\"Year\":2,\"Depreciation\":\"3000.00\",\"NetBookValue\":\"9000.00\",\"Rule\":\"straight-line\"}", "{\"Year\":3,\"Depreciation\":\"3000.00\",\"NetBookValue\":\"6000.00\",\"Rule\":\"straight-line\"}", "{\"Year\":4,\"Depreciation\":\"3000.00\",\"NetBookValue\":\"3000.00\",\"Rule\":\"straight-line\"}", "{\"Year\":5,\"Depreciation\":\"3000.00\",\"NetBookValue\":\"0.00\",\"Rule\":\"straight-line\"}"];
const rowsB = ["{\"Year\":1,\"Depreciation\":\"100.00\",\"NetBookValue\":\"400.00\",\"Rule\":\"remaining-life\"}", "{\"Year\":2,\"Depreciation\":\"100.00\",\"NetBookValue\":\"300.00\",\"Rule\":\"remaining-life\"}", "{\"Year\":3,\"Depreciation\":\"100.00\",\"NetBookValue\":\"200.00\",\"Rule\":\"remaining-life\"}", "{\"Year\":4,\"Depreciation\":\"100.00\",\"NetBookValue\":\"100.00\",\"Rule\":\"remaining-life\"}", "{\"Year\":5,\"Depreciation\":\"100.00\",\"NetBookValue\":\"0.00\",\"Rule\":\"remaining-life\"}"];
const rowsC = ["{\"Year\":1,\"Depreciation\":\"6000.00\",\"NetBookValue\":\"9000.00\",\"Rule\":\"declining\"}", "{\"Year\":2,\"Depreciation\":\"3600.00\",\"NetBookValue\":\"5400.00\",\"Rule\":\"declining\"}", "{\"Year\":3,\"Depreciation\":\"1800.00\",\"NetBookValue\":\"3600.00\",\"Rule\":\"changeover\"}", "{\"Year\":4,\"Depreciation\":\"1800.00\",\"NetBookValue\":\"1800.00\",\"Rule\":\"changeover\"}", "{\"Year\":5,\"Depreciation\":\"1800.00\",\"NetBookValue\":\"0.00\",\"Rule\":\"changeover\"}"];
const rowsD = ["{\"Year\":1,\"Depreciation\":\"6000.00\",\"NetBookValue\":\"9000.00\",\"Rule\":\"declining\"}", "{\"Year\":2,\"Depreciation\":\"3600.00\",\"NetBookValue\":\"5400.00\",\"Rule\":\"declining\"}", "{\"Year\":3,\"Depreciation\":\"1800.00\",\"NetBookValue\":\"3600.00\",\"Rule\":\"changeover\"}", "{\"Year\":4,\"Depreciation\":\"1800.00\",\"NetBookValue\":\"1800.00\",\"Rule\":\"changeover\"}", "{\"Year\":5,\"Depreciation\":\"1800.00\",\"NetBookValue\":\"0.00\",\"Rule\":\"changeover\"}"];
const errE = '{"error":{"message":"Unknown method sum-of-digits; use straight-line, remaining-life, declining-balance","code":"400","@Common.numericSeverity":4}}';
const errF = '{"error":{"message":"The declining-balance method needs a Factor greater than zero","code":"400","@Common.numericSeverity":4}}';
const testLines = ["✔ SAP example: APC 1,000 over 10 years is 100 a year (123.064167ms)", "✔ SAP example: net book value 500 over 5 remaining years is 100 (0.12725ms)", "✔ SAP example: net book value 700, life 10, factor 3 is 210 (0.045875ms)", "✔ straight-line schedule of the van (0.327125ms)", "✔ declining balance with changeover for the van (0.080959ms)", "✔ the group area of EX01 has an APC of 15,300.00: 3,060.00 a year (0.063542ms)", "✔ the sum of every schedule equals the base, whatever the rounding (0.083458ms)", "✔ the function answers the remaining-life example (21.916583ms)", "✔ the bound function reads the van from its master record (2.872791ms)", "✔ the bound function uses the method of the shelving (1.437625ms)", "✔ rejects an unknown method (2.45425ms)", "✔ rejects declining balance without a factor and zero years (1.543708ms)", "ℹ pass 12", "ℹ fail 0"];

export default {
  area: 'finance',
  theme: 'vscode',
  guide: 'compute-a-depreciation-schedule',
  figures: [
    editor({
      id: '01-schema-file', lines: schemaExcerpt.split('\n').length, explorer: explorer('schema.cds'), tabs: ['schema.cds'], activeTab: 0, code: cdsCode(schemaExcerpt),
      alt: 'Visual Studio Code with the file db/schema.cds of the depreciation project: an excerpt with the entity Assets, its key ID, the acquisition cost, the useful life, the method and the factor; callout 2 marks the file and callout 3 marks the CSV file in the explorer',
      marksFor: (g) => [[g['entry:schema.cds'], 2], [g['entry:sap.guide.depreciation-Assets.csv'], 3]],
    }),
    editor({
      id: '02-schedule-file', lines: loopExcerpt.split('\n').length, explorer: explorer('schedule.js'), tabs: ['schedule.js'], activeTab: 0, code: plainCode(loopExcerpt),
      alt: 'Visual Studio Code with the file srv/schedule.js: an excerpt of the loop over the years that takes the straight-line amount of the book value over the remaining years, the declining amount, the changeover when the declining amount is lower than the straight-line amount of the cost, and the last year that takes the rest; callout 4 marks the file in the explorer',
      marksFor: (g) => [[g['entry:schedule.js'], 4]],
    }),
    editor({
      id: '03-service-files', lines: handlerExcerpt.split('\n').length + 4, explorer: explorer('depreciation-service.js'), tabs: ['depreciation-service.js'], activeTab: 0, code: plainCode(handlerExcerpt),
      alt: 'Visual Studio Code with the file srv/depreciation-service.js: an excerpt with the handler of the function calculate, which reads the method, the base, the years and the factor and answers HTTP 400 when the input is wrong; callout 5 marks the service definition file and callout 6 marks this file in the explorer',
      marksFor: (g) => [[g['entry:depreciation-service.cds'], 5], [g['entry:depreciation-service.js'], 6]],
    }),
    terminal({
      id: '04-cds-watch',
      alt: 'Terminal after cds watch in the depreciation project: the log lists the model files, loads the CSV file for Assets into an in-memory SQLite database, serves DepreciationService at /odata/v4/depreciation with the implementation srv/depreciation-service.js and ends with server listening on http://localhost:4004; callout 7 marks the command',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  srv/depreciation-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.depreciation-Assets.csv'),
        out('/> successfully deployed to in-memory database.'),
        out('[cds] - serving DepreciationService {'),
        out("  at: [ '/odata/v4/depreciation' ],"),
        out("  decl: 'srv/depreciation-service.cds:3',"),
        out("  impl: 'srv/depreciation-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 7]],
    }),
    (() => {
      const a = wrapCmd(`curl -s "${base}/calculate(Method='straight-line',Base=15000,Years=5)" | ${jq}`);
      const b = wrapCmd(`curl -s "${base}/calculate(Method='remaining-life',Base=500,Years=5)" | ${jq}`);
      const lines = [...a, ...rowsA.map((r) => out(r)), ...b, ...rowsB.map((r) => out(r))];
      return terminal({
        id: '05-even-schedules',
        alt: 'Terminal with two curl commands piped to jq: the straight-line schedule of 15000 over 5 years shows 3000.00 in each of the five years and a net book value of 0.00 at the end (callout 8), and the remaining-life schedule of a net book value of 500 over 5 years shows 100.00 in each year (callout 9); the long commands wrap onto a second line',
        lines,
        marksOf: [[0, 8, a.length + rowsA.length], [a.length + rowsA.length, 9, b.length + rowsB.length]],
      });
    })(),
    (() => {
      const c = wrapCmd(`curl -s "${base}/calculate(Method='declining-balance',Base=15000,Years=5,Factor=2)" | ${jq}`);
      const d = wrapCmd(`curl -s "${base}/Assets('10001')/plan()" | ${jq}`);
      const lines = [...c, ...rowsC.map((r) => out(r)), ...d, ...rowsD.map((r) => out(r))];
      return terminal({
        id: '06-declining-schedules',
        alt: 'Terminal with two curl commands piped to jq: the declining-balance schedule of 15000 over 5 years with factor 2 shows 6000.00 and 3600.00 with the rule declining, then 1800.00 in years 3 to 5 with the rule changeover and a net book value of 0.00 (callout 10); the schedule of the delivery van read from its master record is the same (callout 11)',
        lines,
        marksOf: [[0, 10, c.length + rowsC.length], [c.length + rowsC.length, 11, d.length + rowsD.length]],
      });
    })(),
    (() => {
      const a = wrapCmd(`curl -s -w "\\nHTTP %{http_code}\\n" "${base}/calculate(Method='sum-of-digits',Base=15000,Years=5)"`);
      const b = wrapCmd(`curl -s -w "\\nHTTP %{http_code}\\n" "${base}/calculate(Method='declining-balance',Base=15000,Years=5)"`);
      const ea = wrap(errE, 'danger');
      const eb = wrap(errF, 'danger');
      const lines = [...a, ...ea, out('HTTP 400', 'danger'), ...b, ...eb, out('HTTP 400', 'danger')];
      const sa = a.length + ea.length + 1;
      const sb = b.length + eb.length + 1;
      return terminal({
        id: '07-input-rejected',
        alt: 'Terminal with two curl commands: the unknown method sum-of-digits is answered with the message Unknown method sum-of-digits; use straight-line, remaining-life, declining-balance and HTTP 400 (callout 12), and the declining-balance method without a factor is answered with The declining-balance method needs a Factor greater than zero and HTTP 400 (callout 13); long lines wrap',
        lines,
        marksOf: [[0, 12, sa], [sa, 13, sb]],
      });
    })(),
    editor({
      id: '08-test-file', lines: testExcerpt.split('\n').length, explorer: explorer('service.test.js'), tabs: ['service.test.js'], activeTab: 0, code: plainCode(testExcerpt),
      alt: 'Visual Studio Code with the file test/service.test.js: an excerpt with the three worked examples of the SAP help pages (1,000 over 10 years is 100, a net book value of 500 over 5 remaining years is 100, a net book value of 700 with life 10 and factor 3 is 210) and the tests of the straight-line and the declining-balance schedule of the van; callout 15 marks the file in the explorer',
      marksFor: (g) => [[g['entry:service.test.js'], 15]],
    }),
    terminal({
      id: '09-result',
      alt: 'Terminal after npm test in the depreciation project: every test is marked with a check, from the three examples of the SAP help pages to the rejected inputs, and the summary shows no failed test; the times in parentheses differ per run; callout 16 marks the command',
      lines: [prompt('npm test'), ...testLines.map((l) => out(l))],
      marksOf: [[0, 16]],
    }),
  ],
};
