// Figures of "SAP Finance Guide: Follow a Purchase and a Sale through the Ledger"
// (erp/sap/finance/guide-follow-purchase-and-sale-postings.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/ledger-postings run with `cds watch` (CAP 10.2.2) on 2026-11-13: the curl answers, the log,
// the JSON responses and the balances are what the running service returned (the lab run used another port than the
// default 4004, which is written here), the list report is the Fiori elements preview of the same app. The model is not
// SAP S/4HANA. The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, lbl, box, rule, mark, vscodeShell, terminalShell, browserShell, fioriShell, fioriListReport, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'ledger-postings');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const schemaLines = labText(read('db/schema.cds')).split('\n');
const schema = schemaLines.slice(schemaLines.findIndex((l) => l.startsWith('// An accounting document'))).join('\n');
const rulesExcerpt = labText(read('srv/posting-rules.js'), { only: ['goods-receipt'] });

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
const pretty = (json) => JSON.stringify(JSON.parse(json), null, 2);

function editor({ id, alt, h, explorer, tabs, activeTab, code, marksFor }) {
  const sh = vscodeShell({ h, title: 'ledger-postings', explorer, tabs, activeTab, code });
  const list = marksFor(sh.geo).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}
// `commands` is [{ n, cmd, answer, tone }]: each command with its answer and the callout number of its step.
function terminal({ id, alt, commands }) {
  const lines = [];
  const marksOf = [];
  for (const c of commands) {
    const start = lines.length;
    lines.push(...wrap(`$ ${c.cmd}`, 'textMuted'));
    if (c.answer) lines.push(...wrap(c.answer, c.tone));
    marksOf.push([start, c.n, lines.length - start]);
    lines.push(out(''));
  }
  lines.pop();
  const h = 62 + lines.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const list = marksOf.flatMap(([i, n, span]) => {
    const b = t.geo.line(i);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}
function browser({ id, alt, path, json, n, h }) {
  const sh = browserShell({ h, url: `localhost:4004/odata/v4/ledger-postings/${path}`, tab: 'localhost', lines: plainCode(pretty(json)) });
  return { id, alt, width: FW, height: h, theme: 'browser', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...mark(sh.geo.address, n)] })) };
}

const explorer = (active) => [
  { label: 'LEDGER-POSTINGS', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'ledger-postings-service.cds', indent: 2 },
  { label: 'ledger-postings-service.js', indent: 2 },
  { label: 'posting-rules.js', indent: 2, ...(active === 'posting-rules.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

const cmd = (file, action) => `curl -sw "\\n" --json @http/${file}.json $BASE/${action}`;
const doc = (n, type, date, text) => `{"@odata.context":"$metadata#Documents/$entity","DocumentNumber":"${n}","DocumentType":"${type}","CompanyCode":"EX01","Ledger":"0L","PostingDate":"${date}","Description":"${text}"}`;
const cleared = (n, k) => `{"@odata.context":"$metadata#LedgerPostingsService.Cleared","ClearingDocument":"${n}","ClearedItems":${k}}`;

const receiptItems = '{"@odata.context":"$metadata#DocumentItems","value":[{"TransactionKey":"BSX","GLAccount":"140000","AmountInCompanyCodeCurrency":"375.00","Document_DocumentNumber":"100000001","ItemNumber":1},{"TransactionKey":"PRD","GLAccount":"140900","AmountInCompanyCodeCurrency":"25.00","Document_DocumentNumber":"100000001","ItemNumber":2},{"TransactionKey":"WRX","GLAccount":"231000","AmountInCompanyCodeCurrency":"-400.00","Document_DocumentNumber":"100000001","ItemNumber":3}]}';
const openItemsJson = '{"@odata.context":"$metadata#OpenItems","value":[{"DocumentNumber":"100000001","ItemNumber":3,"GLAccount":"231000","Partner":null,"Reference":"PO-1","AmountInCompanyCodeCurrency":"-400.00"},{"DocumentNumber":"100000002","ItemNumber":1,"GLAccount":"231000","Partner":null,"Reference":"PO-1","AmountInCompanyCodeCurrency":"400.00"},{"DocumentNumber":"100000002","ItemNumber":4,"GLAccount":"160000","Partner":"V-1000","Reference":"PO-1","AmountInCompanyCodeCurrency":"-487.90"}]}';
// The first four of the ten accounts of the answer.
const balancesJson = '{"@odata.context":"$metadata#AccountBalances","value":[{"GLAccount":"113100","Debits":"595.00","Credits":"487.90","Balance":"107.10"},{"GLAccount":"121000","Debits":"595.00","Credits":"595.00","Balance":"0.00"},{"GLAccount":"140000","Debits":"375.00","Credits":"300.00","Balance":"75.00"},{"GLAccount":"140900","Debits":"35.00","Credits":"0.00","Balance":"35.00"}]}';

// T-accounts after the six documents: [number, name, [[type, amount]] debits, [[type, amount]] credits, balance text].
export const tAccounts = [
  ['113100', 'Bank', [['DZ', '595.00']], [['KZ', '487.90']], 'Debit 107.10'],
  ['121000', 'Customers', [['RV', '595.00']], [['DZ', '595.00']], '0.00'],
  ['140000', 'Stock of trading goods', [['WE', '375.00']], [['WA', '300.00']], 'Debit 75.00'],
  ['140900', 'Price differences', [['WE', '25.00'], ['RE', '10.00']], [], 'Debit 35.00'],
  ['154000', 'Input tax', [['RE', '77.90']], [], 'Debit 77.90'],
  ['160000', 'Suppliers', [['KZ', '487.90']], [['RE', '487.90']], '0.00'],
  ['231000', 'GR/IR clearing', [['RE', '400.00']], [['WE', '400.00']], '0.00'],
  ['260000', 'Output tax', [], [['RV', '95.00']], 'Credit 95.00'],
  ['600000', 'Cost of goods sold', [['WA', '300.00']], [], 'Debit 300.00'],
  ['800000', 'Sales revenue', [], [['RV', '500.00']], 'Credit 500.00'],
];
function tAccountFigure() {
  const cw = 200, gap = 12, ch = 176, top = 56;
  const n = [lbl(16, 34, 'Ledger of EX01 after the six documents of the story: debit on the left, credit on the right, amounts in EUR', { size: 'body', weight: 600, box: FW - 32 })];
  tAccounts.forEach(([no, name, dr, cr, bal], i) => {
    const x = 16 + (i % 5) * (cw + gap);
    const y = top + Math.floor(i / 5) * (ch + gap);
    n.push(box(x, y, cw, ch, { fill: 'surface', stroke: 'border', radius: 8 }),
      lbl(x + 12, y + 24, name, { size: 'small', weight: 600, box: cw - 24 }),
      lbl(x + 12, y + 42, no, { size: 'small', tone: 'textMuted', mono: true, box: cw - 24 }),
      rule(x, y + 54, cw), box(x + cw / 2, y + 54, 1, ch - 54 - 36, { fill: 'border' }),
      lbl(x + 12, y + 72, 'Debit', { size: 'small', tone: 'textMuted', box: 80 }),
      lbl(x + cw / 2 + 12, y + 72, 'Credit', { size: 'small', tone: 'textMuted', box: 80 }),
      rule(x, y + ch - 36, cw),
      lbl(x + 12, y + ch - 13, 'Balance', { size: 'small', tone: 'textMuted', box: 60 }),
      lbl(x + cw - 12, y + ch - 13, bal, { size: 'small', weight: 600, anchor: 'end', box: cw - 90 }));
    dr.forEach(([t, a], k) => n.push(lbl(x + 12, y + 96 + k * 22, `${t}  ${a}`, { size: 'small', mono: true, box: cw / 2 - 16 })));
    cr.forEach(([t, a], k) => n.push(lbl(x + cw / 2 + 12, y + 96 + k * 22, `${t}  ${a}`, { size: 'small', mono: true, box: cw / 2 - 16 })));
  });
  const h = top + 2 * ch + gap + 16;
  return { h, nodes: [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [box(0, 0, FW, h, { fill: 'canvas' }), ...n] }] };
}

export default {
  area: 'finance',
  theme: 'vscode',
  guide: 'follow-purchase-and-sale-postings',
  figures: [
    editor({
      id: '01-schema-file', h: 640, explorer: explorer('schema.cds'), tabs: ['schema.cds'], activeTab: 0, code: cdsCode(schema),
      alt: 'Visual Studio Code with the file db/schema.cds of the ledger-postings project: an excerpt with the entity Documents and its composition of Items and the entity DocumentItems with the keys Document and ItemNumber, the transaction key, the G/L account, the partner, the reference, the amount in company code currency and the clearing document; callout 2 marks the file in the explorer',
      marksFor: (g) => [[g['entry:schema.cds'], 2]],
    }),
    editor({
      id: '02-rules-file', h: 420, explorer: explorer('posting-rules.js'), tabs: ['posting-rules.js'], activeTab: 0, code: plainCode(rulesExcerpt),
      alt: 'Visual Studio Code with the file srv/posting-rules.js: the excerpt shows the function goodsReceipt, which values the stock line at the standard price and the clearing line at the order price and puts the difference on the price difference line; callout 5 marks the file in the explorer',
      marksFor: (g) => [[g['entry:posting-rules.js'], 5]],
    }),
    (() => {
      const lines = [
        prompt('cds watch'),
        out('[cds] - loaded model from 2 file(s):'),
        out('  srv/ledger-postings-service.cds'),
        out('  db/schema.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.ledgerpostings-PurchaseOrders.csv'),
        out('  > init from db/data/sap.guide.ledgerpostings-Materials.csv'),
        out('  > init from db/data/sap.guide.ledgerpostings-GLAccounts.csv'),
        out('  > init from db/data/sap.guide.ledgerpostings-AccountDetermination.csv'),
        out('/> successfully deployed to in-memory database.'),
        out('[cds] - serving LedgerPostingsService {'),
        out("  at: [ '/odata/v4/ledger-postings' ],"),
        out("  decl: 'srv/ledger-postings-service.cds:3',"),
        out("  impl: 'srv/ledger-postings-service.js'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ];
      const h = 62 + lines.length * 21 + 4;
      const t = terminalShell({ h, title: 'Terminal', lines });
      const b = t.geo.line(0);
      return {
        id: '03-cds-watch', width: FW, height: h, theme: 'terminal',
        alt: 'Terminal after cds watch in the ledger-postings project: the log lists the model files, loads the CSV files for PurchaseOrders, Materials, GLAccounts and AccountDetermination into an in-memory SQLite database, serves LedgerPostingsService at /odata/v4/ledger-postings with the implementation srv/ledger-postings-service.js and ends with server listening on http://localhost:4004; callout 7 marks the command',
        nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h - 4 }, 7)] })),
      };
    })(),
    terminal({
      id: '04-goods-receipt',
      alt: 'Terminal with the command that sets BASE to the service address and the curl command that posts the goods receipt from http/goods-receipt.json to the action postGoodsReceipt; the answer is the document header with DocumentNumber 100000001 and DocumentType WE; callout 8 marks the curl command and its answer',
      commands: [
        { cmd: 'export BASE=http://localhost:4004/odata/v4/ledger-postings' },
        { n: 8, cmd: cmd('goods-receipt', 'postGoodsReceipt'), answer: doc('100000001', 'WE', '2026-03-03', 'Goods receipt PO-1') },
      ],
    }),
    browser({
      id: '05-receipt-lines', h: 640, n: 9, path: 'DocumentItems?$select=TransactionKey,GLAccount,AmountInCompanyCodeCurrency', json: receiptItems,
      alt: 'Browser with the address localhost:4004/odata/v4/ledger-postings/DocumentItems?$select=TransactionKey,GLAccount,AmountInCompanyCodeCurrency, marked by callout 9: the JSON response lists the three lines of document 100000001, key BSX account 140000 amount 375.00, key PRD account 140900 amount 25.00 and key WRX account 231000 amount -400.00',
    }),
    browser({
      id: '06-open-items', h: 760, n: 11, path: 'OpenItems', json: openItemsJson,
      alt: 'Browser with the address localhost:4004/odata/v4/ledger-postings/OpenItems, marked by callout 11: the JSON response lists three open items, the GR/IR line of document 100000001 with -400.00, the GR/IR line of document 100000002 with 400.00 and the supplier line of document 100000002 with -487.90, all with the reference PO-1',
    }),
    terminal({
      id: '07-invoice-pay-clear',
      alt: 'Terminal with four curl commands: the invoice receipt answered with the document header 100000002 of type RE (callout 10), clearing of the GR/IR account for PO-1 answered with clearing document 100000002 and 2 cleared items (callout 12), the vendor payment answered with document 100000003 of type KZ (callout 13) and clearing of the supplier account answered with clearing document 100000003 and 2 cleared items (callout 14); the long answers wrap onto a second line',
      commands: [
        { n: 10, cmd: cmd('invoice-receipt', 'postInvoiceReceipt'), answer: doc('100000002', 'RE', '2026-03-10', 'Invoice PO-1') },
        { n: 12, cmd: cmd('clear-gr-ir', 'clearOpenItems'), answer: cleared('100000002', 2) },
        { n: 13, cmd: cmd('pay-vendor', 'payVendor'), answer: doc('100000003', 'KZ', '2026-03-20', 'Payment of 100000002') },
        { n: 14, cmd: cmd('clear-suppliers', 'clearOpenItems'), answer: cleared('100000003', 2) },
      ],
    }),
    terminal({
      id: '08-sale-and-payment',
      alt: 'Terminal with three curl commands: the sale answered with the billing document 100000005 of type RV (callout 15), the customer payment answered with document 100000006 of type DZ (callout 16) and clearing of the customer account answered with clearing document 100000006 and 2 cleared items (callout 18); the long answers wrap onto a second line',
      commands: [
        { n: 15, cmd: cmd('sale', 'postSale'), answer: doc('100000005', 'RV', '2026-03-25', 'Billing C-2000') },
        { n: 16, cmd: cmd('customer-payment', 'receiveCustomerPayment'), answer: doc('100000006', 'DZ', '2026-04-02', 'Payment of C-2000') },
        { n: 18, cmd: cmd('clear-customers', 'clearOpenItems'), answer: cleared('100000006', 2) },
      ],
    }),
    browser({
      id: '09-balances', h: 720, n: 19, path: 'AccountBalances', json: balancesJson,
      alt: 'Browser with the address localhost:4004/odata/v4/ledger-postings/AccountBalances, marked by callout 19: the JSON response shows the debits, credits and balance of the first four accounts, 113100 with 595.00, 487.90 and 107.10, 121000 with 595.00, 595.00 and 0.00, 140000 with 375.00, 300.00 and 75.00 and 140900 with 35.00, 0.00 and 35.00; the figure leaves out the other six accounts',
    }),
    (() => {
      const rows = [
        ['100000001', 'WE', 'Mar 3, 2026', 'Goods receipt PO-1', 'EX01'],
        ['100000002', 'RE', 'Mar 10, 2026', 'Invoice PO-1', 'EX01'],
        ['100000003', 'KZ', 'Mar 20, 2026', 'Payment of 100000002', 'EX01'],
        ['100000004', 'WA', 'Mar 25, 2026', 'Goods issue M-100', 'EX01'],
        ['100000005', 'RV', 'Mar 25, 2026', 'Billing C-2000', 'EX01'],
        ['100000006', 'DZ', 'Apr 2, 2026', 'Payment of C-2000', 'EX01'],
      ];
      const columns = [{ title: 'Document Number', w: 3 }, { title: 'Type', w: 1 }, { title: 'Posting Date', w: 2 }, { title: 'Description', w: 4 }, { title: 'Company Code', w: 2 }];
      const lr = fioriListReport({ rows, entity: 'Documents', columns, editing: false, create: false, del: false });
      return { id: '10-documents-list', width: FW, height: lr.height, theme: 'sap-fiori', alt: 'Fiori elements list report Documents (6) with the columns Document Number, Type, Posting Date, Description and Company Code: the six documents 100000001 to 100000006 of the types WE, RE, KZ, WA, RV and DZ; callout 21 marks the table', nodes: fioriShell({ h: lr.height, title: 'Preview – List of LedgerPostingsService.Documents', children: [...lr.nodes, ...mark({ x: 16, y: lr.geo.tableTop, w: FW - 32, h: lr.height - lr.geo.tableTop - 16 }, 21)] }) };
    })(),
    (() => {
      const f = tAccountFigure();
      return { id: '11-result', width: FW, height: f.h, theme: 'sap-fiori', alt: 'Ten T-accounts of company code EX01 after the six documents: bank debit 107.10, customers zero, stock of trading goods debit 75.00, price differences debit 35.00, input tax debit 77.90, suppliers zero, GR/IR clearing zero, output tax credit 95.00, cost of goods sold debit 300.00 and sales revenue credit 500.00; every entry names the document type that posted it', nodes: f.nodes };
    })(),
  ],
};
