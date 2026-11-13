// Figures of "SAP Finance Guide: Allocate Costs and Read a Trial Balance"
// (erp/sap/finance/guide-allocate-costs-and-read-a-trial-balance.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/cost-allocation run with `cds watch` (CAP 10.2.2) on 2026-11-13: the curl answers, the log and
// the response JSON are what the running service returned; the list report is the Fiori elements preview of the same app.
// The run used another port than the default 4004 (a service of another project held it); the figures show the default address.
// The model is not SAP S/4HANA. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, browserShell, fioriShell, fioriListReport, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'cost-allocation');
const read = (f) => readFileSync(join(lab, f), 'utf8');
// The excerpt of the schema file that figure 01 shows: the allocation cycle and its receivers (the tagged region).
const schemaLines = labText(read('db/schema.cds'), { only: ['cycle'] }).split('\n');
const schema = schemaLines.join('\n');
// The excerpt of the handler that figure 02 shows: the sender releases its share, the receivers get their tracing factors.
const rules = labText(read('srv/allocation-service.js'), { only: ['run'] }).split('\n');
const r0 = rules.findIndex((l) => l.includes('The sender releases'));
const rulesExcerpt = rules.slice(r0, r0 + 24).map((l) => l.slice(6)).join('\n');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
const wrapCmd = (str) => str.match(/.{1,116}/g).map((part, i) => ({ str: `${i ? '  ' : '$ '}${part}`, tone: 'textMuted' }));

function editor({ id, alt, h, explorer, tabs, activeTab, code, marksFor }) {
  const sh = vscodeShell({ h, title: 'cost-allocation', explorer, tabs, activeTab, code });
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
  { label: 'COST-ALLOCATION', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'allocation-service.cds', indent: 2 },
  { label: 'allocation-service.js', indent: 2, ...(active === 'allocation-service.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

const base = 'http://localhost:4004/odata/v4/allocation';

// The answers below are the compact JSON the service sent, copied from the run.
const balancesBefore = '{"@odata.context":"$metadata#CostCenterBalances","value":[{"CostCenter":"EX-RENT","GLAccount":"455000","Balance":"1000.00"}]}';
const runAnswer = '{"@odata.context":"$metadata#AllocationService.RunResult","Cycle":"RENT","PostingDate":"2026-03-31","Released":"1000.00","Lines":[{"CostCenter":"EX-RENT","Amount":"-1000.00","GLAccount":"940000"},{"CostCenter":"EX-ADM","Amount":"200.00","GLAccount":"940000"},{"CostCenter":"EX-SALES","Amount":"300.00","GLAccount":"940000"},{"CostCenter":"EX-PROD","Amount":"500.00","GLAccount":"940000"}]}';

// The compact answer of the trial balance request, copied from the run.
const trialAnswer = '{"@odata.context":"$metadata#AllocationService.TrialBalanceResult","Rows":[{"GLAccount":"113100","Name":"Bank","StartingBalance":"20000.00","Debits":"0.00","Credits":"1000.00","EndingBalance":"19000.00"},{"GLAccount":"300000","Name":"Share capital","StartingBalance":"-20000.00","Debits":"0.00","Credits":"0.00","EndingBalance":"-20000.00"},{"GLAccount":"455000","Name":"Rent","StartingBalance":"0.00","Debits":"1000.00","Credits":"0.00","EndingBalance":"1000.00"},{"GLAccount":"940000","Name":"Overhead allocation","StartingBalance":"0.00","Debits":"1000.00","Credits":"1000.00","EndingBalance":"0.00"}],"TotalStartingBalance":"0.00","TotalDebits":"2000.00","TotalCredits":"2000.00","TotalEndingBalance":"0.00","Balanced":true}';

// The trial balance answer of the run, indented the way a browser's pretty-print shows it.
const trialJson = JSON.stringify({
  '@odata.context': '$metadata#AllocationService.TrialBalanceResult',
  Rows: [
    { GLAccount: '113100', Name: 'Bank', StartingBalance: '20000.00', Debits: '0.00', Credits: '1000.00', EndingBalance: '19000.00' },
    { GLAccount: '300000', Name: 'Share capital', StartingBalance: '-20000.00', Debits: '0.00', Credits: '0.00', EndingBalance: '-20000.00' },
    { GLAccount: '455000', Name: 'Rent', StartingBalance: '0.00', Debits: '1000.00', Credits: '0.00', EndingBalance: '1000.00' },
    { GLAccount: '940000', Name: 'Overhead allocation', StartingBalance: '0.00', Debits: '1000.00', Credits: '1000.00', EndingBalance: '0.00' },
  ],
  TotalStartingBalance: '0.00', TotalDebits: '2000.00', TotalCredits: '2000.00', TotalEndingBalance: '0.00', Balanced: true,
}, null, 2);

const balanceColumns = [{ title: 'Cost Center', w: 2 }, { title: 'G/L Account', w: 2 }, { title: 'Balance in Company Code Currency', w: 3 }];
const balanceRows = [['EX-ADM', '940000', '200.00'], ['EX-PROD', '940000', '500.00'], ['EX-RENT', '455000', '1,000.00'], ['EX-RENT', '940000', '-1,000.00'], ['EX-SALES', '940000', '300.00']];

export default {
  area: 'finance',
  theme: 'vscode',
  guide: 'allocate-costs-and-read-a-trial-balance',
  figures: [
    editor({
      id: '01-schema-file', h: 500, explorer: explorer('schema.cds'), tabs: ['schema.cds'], activeTab: 0, code: cdsCode(schema),
      alt: 'Visual Studio Code with the file db/schema.cds of the cost-allocation project, an excerpt: the entity AllocationCycles with the sender cost center, the sender account, the sender share, the overhead account, the key figure and the factor per, and the entity AllocationReceivers with a cost center and a factor; callout 2 marks the file in the explorer',
      marksFor: (g) => [[g['entry:schema.cds'], 2]],
    }),
    editor({
      id: '02-rules-file', h: 600, explorer: explorer('allocation-service.js'), tabs: ['allocation-service.js'], activeTab: 0, code: plainCode(rulesExcerpt),
      alt: 'Visual Studio Code with the file srv/allocation-service.js, an excerpt of the handler of runAllocation: the sender releases its share of what was posted on it in the period, the tracing factor of each receiver is read from its statistical key figure, and the cents are split among the receivers; callout 5 marks the file in the explorer',
      marksFor: (g) => [[g['entry:allocation-service.js'], 5]],
    }),
    terminal({
      id: '03-cds-watch',
      alt: 'Terminal after cds watch in the cost-allocation project: the log lists the model files, loads the CSV files for KeyFigures, JournalLines, GLAccounts, CostCenters, AllocationReceivers and AllocationCycles into an in-memory SQLite database, serves AllocationService at /odata/v4/allocation with the implementation srv/allocation-service.js and ends with server listening on http://localhost:4004; callout 6 marks the command',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 4 file(s):'),
        out('  app/annotations.cds'),
        out('  srv/allocation-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.costalloc-KeyFigures.csv'),
        out('  > init from db/data/sap.guide.costalloc-JournalLines.csv'),
        out('  > init from db/data/sap.guide.costalloc-GLAccounts.csv'),
        out('  > init from db/data/sap.guide.costalloc-CostCenters.csv'),
        out('  > init from db/data/sap.guide.costalloc-AllocationReceivers.csv'),
        out('  > init from db/data/sap.guide.costalloc-AllocationCycles.csv'),
        out('/> successfully deployed to in-memory database.'),
        out('[cds] - serving AllocationService {'),
        out("  at: [ '/odata/v4/allocation' ],"),
        out("  decl: 'srv/allocation-service.cds:3',"),
        out("  impl: 'srv/allocation-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 6]],
    }),
    (() => {
      const cmd = wrapCmd(`curl -s ${base}/CostCenterBalances`);
      const ans = wrap(balancesBefore);
      return terminal({
        id: '04-balances-before',
        alt: 'Terminal with the curl command that reads the entity CostCenterBalances and the answer: only the cost center EX-RENT has a balance, 1000.00 on the G/L account 455000; callout 7 marks the command and the answer',
        lines: [...cmd, ...ans],
        marksOf: [[0, 7, cmd.length + ans.length]],
      });
    })(),
    (() => {
      const cmd = wrapCmd(`curl -s -w "\\nHTTP %{http_code}\\n" --json @http/run-allocation.json ${base}/runAllocation`);
      const ans = wrap(runAnswer);
      return terminal({
        id: '05-allocation-run',
        alt: 'Terminal with the curl command that posts http/run-allocation.json to runAllocation and the answer: the cycle RENT released 1000.00 with the posting date 2026-03-31, EX-RENT is credited -1000.00 and EX-ADM, EX-SALES and EX-PROD are debited 200.00, 300.00 and 500.00, all on the account 940000, followed by HTTP 200; the long answer wraps onto several lines; callout 8 marks the command',
        lines: [...cmd, ...ans, out('HTTP 200', 'state.normal.bg')],
        marksOf: [[0, 8, cmd.length]],
      });
    })(),
    (() => {
      const lr = fioriListReport({ rows: balanceRows, entity: 'Cost Center Balances', columns: balanceColumns, editing: false, create: false, del: false });
      const list = mark({ x: 16, y: lr.geo.tableTop, w: FW - 32, h: lr.height - lr.geo.tableTop - 16 }, 10);
      return {
        id: '06-balances-list', width: FW, height: lr.height, theme: 'sap-fiori',
        alt: 'Fiori elements list report Cost Center Balances (5) with the columns Cost Center, G/L Account and Balance in Company Code Currency: EX-ADM 940000 200.00, EX-PROD 940000 500.00, EX-RENT 455000 1,000.00, EX-RENT 940000 -1,000.00 and EX-SALES 940000 300.00; callout 10 marks the table',
        nodes: fioriShell({ h: lr.height, title: 'Preview – List of AllocationService.CostCenterBalances', children: [...lr.nodes, ...list] }),
      };
    })(),
    (() => {
      const cmd = wrapCmd(`curl -s "${base}/trialBalance(FromPostingDate=2026-03-01,ToPostingDate=2026-03-31)"`);
      const ans = wrap(trialAnswer);
      return terminal({
        id: '07-trial-balance',
        alt: 'Terminal with the curl command that reads the trial balance of March 2026 and the compact JSON answer: the rows for the accounts 113100, 300000, 455000 and 940000 with starting balance, debits, credits and ending balance, then TotalStartingBalance 0.00, TotalDebits 2000.00, TotalCredits 2000.00, TotalEndingBalance 0.00 and Balanced true; the long answer wraps onto several lines; callout 11 marks the command',
        lines: [...cmd, ...ans],
        marksOf: [[0, 11, cmd.length]],
      });
    })(),
    {
      id: '08-result', width: FW, height: 990, theme: 'browser',
      alt: 'Browser with the address localhost:4004/odata/v4/allocation/trialBalance(FromPostingDate=2026-03-01,ToPostingDate=2026-03-31): the JSON answer lists the accounts 113100 Bank, 300000 Share capital, 455000 Rent and 940000 Overhead allocation with their starting balance, debits, credits and ending balance, then TotalDebits 2000.00 and TotalCredits 2000.00, TotalEndingBalance 0.00 and Balanced true',
      nodes: (() => {
        const sh = browserShell({ h: 990, url: 'localhost:4004/odata/v4/allocation/trialBalance(FromPostingDate=2026-03-01,ToPostingDate=2026-03-31)', tab: 'localhost', lines: plainCode(`${trialJson}\n\n`) });
        return sh.nodes;
      })(),
    },
  ],
};
