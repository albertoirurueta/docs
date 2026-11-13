// Figures of "SAP Guide: Query OData Services" (erp/sap/guide-query-odata-services.adoc). Facts: the project
// modules/ROOT/examples/sap-lab/odata-queries was built and run on 2026-11-13 with @sap/cds-dk 10.2.1, @sap/cds 10.2.2 and
// Node.js 24.21.0 (cds init odata-queries --nodejs, then the lab files; npm test passes). The terminal text is the output of cds
// watch (the banner and the registry line are left out) and of the curl commands of the page; the browser text is the answer of
// the running service, pretty-printed as the browser's formatting option shows it. The run used another free port; the figures show
// the default port 4004 that the page uses, and the answers do not depend on the port. The step numbers are the callout numbers
// of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, browserShell, cdsCode, plainCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'odata-queries');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const service = read('srv/query-service.cds');
const claimsCsv = read('db/data/sap.guide.queries-Claims.csv');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
// A terminal wraps a long line at its width; the figure wraps at 118 characters the same way.
const wrap = (str, tone) => str.match(/.{1,118}/g).map((part) => out(part, tone));
const B = 'http://localhost:4004/odata/v4/query';

const explorer = ({ active, data = false, service: svc = false }) => [
  { label: 'ODATA-QUERIES', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true, open: true },
  ...(data ? [{ label: 'data', indent: 2, folder: true, open: true }, { label: 'sap.guide.queries-Claims.csv', indent: 3, ...(active === 'sap.guide.queries-Claims.csv' ? { active: true } : {}) }, { label: 'sap.guide.queries-Items.csv', indent: 3 }] : []),
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: svc },
  ...(svc ? [{ label: 'query-service.cds', indent: 2, ...(active === 'query-service.cds' ? { active: true } : {}) }] : []),
  { label: 'package.json', indent: 1 },
  { label: 'readme.md', indent: 1 },
];

function editor({ id, alt, h, tabs, activeTab, code, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'odata-queries', explorer: exp, tabs, activeTab, code });
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

function browser({ id, alt, url, lines, h, markAddress }) {
  const sh = browserShell({ h, url, tab: 'localhost', lines });
  const list = markAddress ? mark(sh.geo.address, markAddress) : [];
  return { id, alt, width: FW, height: h, theme: 'browser', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const filterJson = `{
  "@odata.context": "$metadata#Claims",
  "value": [
    {
      "title": "Flight Berlin",
      "amount": "212.40",
      "ID": 6
    },
    {
      "title": "Hotel Madrid",
      "amount": "180.00",
      "ID": 2
    },
    {
      "title": "Client dinner",
      "amount": "142.60",
      "ID": 12
    },
    {
      "title": "Team lunch",
      "amount": "64.80",
      "ID": 5
    }
  ]
}`;
const expandJson = `{
  "@odata.context": "$metadata#Claims/$entity",
  "title": "Conference fee",
  "items": [
    {
      "category": "Registration",
      "amount": "300.00",
      "ID": 103
    },
    {
      "category": "Workshop",
      "amount": "50.00",
      "ID": 104
    }
  ],
  "ID": 4
}`;

const page1 = '{"@odata.context":"$metadata#Claims","@odata.count":12,"value":[{"title":"Train ticket","ID":1},{"title":"Hotel Madrid","ID":2},{"title":"Taxi","ID":3},{"title":"Conference fee","ID":4},{"title":"Team lunch","ID":5}]}';
const page3 = '{"@odata.context":"$metadata#Claims","@odata.count":12,"value":[{"title":"Train Lisbon","ID":11},{"title":"Client dinner","ID":12}]}';
const count = '{"@odata.context":"$metadata#Claims","@odata.count":7,"value":[]}';
const batch = '{"responses":[{"id":"1","status":200,"headers":{"odata-version":"4.0","content-type":"application/json; charset=utf-8; ieee754compatible=true","content-length":"146"},"body":{"@odata.context":"$metadata#Claims","value":[{"title":"Train ticket","amount":"45.50","ID":1},{"title":"Hotel Madrid","amount":"180.00","ID":2}]}},{"id":"2","status":200,"headers":{"odata-version":"4.0","content-type":"application/json; charset=utf-8; ieee754compatible=true","content-length":"244"},"body":{"@odata.context":"$metadata#Items","value":[{"category":"Room","amount":"150.00","ID":101},{"category":"Registration","amount":"300.00","ID":103},{"category":"Flight","amount":"190.40","ID":105},{"category":"Room","amount":"210.00","ID":107}]}}]}';
const created = '{"@odata.context":"$metadata#Claims/$entity","ID":13,"title":"Hotel Lisbon","status":"N","amount":"120.00","claimDate":"2026-03-30","items":[{"ID":109,"claim_ID":13,"category":"Room","amount":"120.00"}]}';
const patched = '{"@odata.context":"$metadata#Claims/$entity","ID":13,"title":"Hotel Lisbon","status":"A","amount":"120.00","claimDate":"2026-03-30"}';
const readBackJson = `{
  "@odata.context": "$metadata#Claims/$entity",
  "ID": 13,
  "title": "Hotel Lisbon",
  "status": "A",
  "amount": "120.00",
  "claimDate": "2026-03-30",
  "items": [
    {
      "ID": 109,
      "claim_ID": 13,
      "category": "Room",
      "amount": "120.00"
    }
  ]
}`;

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'query-odata-services',
  figures: [
    editor({
      id: '01-model-and-service', h: 360, tabs: ['schema.cds', 'query-service.cds'], activeTab: 1, code: cdsCode(service), exp: explorer({ active: 'query-service.cds', service: true }),
      alt: 'Visual Studio Code with the project odata-queries: the explorer lists the folders app, db and srv with the files schema.cds and query-service.cds, and the editor shows query-service.cds, the service QueryService that exposes the entities Claims and Items as projections on the model; callout 2 marks schema.cds and callout 3 marks query-service.cds',
      marksFor: (g) => [[g['entry:schema.cds'], 2], [g['entry:query-service.cds'], 3]],
    }),
    editor({
      id: '02-csv-data', h: 440, tabs: ['query-service.cds', 'sap.guide.queries-Claims.csv'], activeTab: 1, code: plainCode(claimsCsv), exp: explorer({ active: 'sap.guide.queries-Claims.csv', data: true, service: true }),
      alt: 'Visual Studio Code with the folder db/data and its two CSV files sap.guide.queries-Claims.csv and sap.guide.queries-Items.csv; the editor shows the Claims file with the header row and twelve claims from Train ticket to Client dinner; callout 4 marks the two files',
      marksFor: (g) => [[{ x: g['entry:data'].x, y: g['entry:data'].y, w: g['entry:data'].w, h: 72 }, 4]],
    }),
    terminal({
      id: '03-cds-watch',
      alt: 'Terminal after cds watch: the log lists the model files srv/query-service.cds and db/schema.cds, connects to an in-memory SQLite database, initializes it from the two CSV files for Items and Claims, serves QueryService at /odata/v4/query and ends with server listening on http://localhost:4004; callout 5 marks the command and callout 6 the database lines',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 2 file(s):'),
        out('  srv/query-service.cds'),
        out('  db/schema.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.queries-Items.csv'),
        out('  > init from db/data/sap.guide.queries-Claims.csv'),
        out('/> successfully deployed to in-memory database.'),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving QueryService {'),
        out("  at: [ '/odata/v4/query' ],"),
        out("  decl: 'srv/query-service.cds:3'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 5], [4, 6, 4]],
    }),
    browser({
      id: '04-filter-and-order', h: 640, url: "localhost:4004/odata/v4/query/Claims?$filter=status eq 'A' and amount gt 50&$orderby=amount desc&$select=title,amount", markAddress: 8,
      alt: 'Browser with the address localhost:4004/odata/v4/query/Claims with the options filter status eq A and amount gt 50, orderby amount desc and select title,amount, marked by callout 8: the JSON response lists four claims from the largest to the smallest, Flight Berlin 212.40, Hotel Madrid 180.00, Client dinner 142.60 and Team lunch 64.80, each with its ID',
      lines: plainCode(filterJson),
    }),
    browser({
      id: '05-expand-items', h: 470, url: 'localhost:4004/odata/v4/query/Claims(4)?$expand=items($select=category,amount)&$select=title', markAddress: 9,
      alt: 'Browser with the address localhost:4004/odata/v4/query/Claims(4) with the options expand items and select title, marked by callout 9: the JSON response holds the claim Conference fee with its two items inside, Registration 300.00 and Workshop 50.00',
      lines: plainCode(expandJson),
    }),
    (() => {
      const a = wrap(page1);
      const c = wrap(page3);
      const lines = [
        prompt(`curl -s '${B}/Claims?$top=5&$orderby=ID&$select=title&$count=true'`), ...a,
        prompt(`curl -s '${B}/Claims?$top=5&$skip=10&$orderby=ID&$select=title&$count=true'`), ...c,
        prompt(`curl -s '${B}/Claims?$filter=amount%20gt%2050&$count=true&$top=0'`), out(count),
        prompt(`curl -s '${B}/Claims/$count'`), out('12'),
      ];
      return terminal({
        id: '06-page-and-count',
        alt: 'Terminal with four curl commands: the first page of five claims with the count 12 (callout 10), the third page with the two claims Train Lisbon and Client dinner (callout 11), the count 7 of the claims above 50 with an empty value list (callout 12), and the path Claims/$count that answers 12; the long answers wrap onto a second line',
        lines,
        marksOf: [[0, 10, 1 + a.length], [1 + a.length, 11, 1 + c.length], [2 + a.length + c.length, 12, 2]],
      });
    })(),
    (() => {
      const r = wrap(batch);
      return terminal({
        id: '07-batch',
        alt: 'Terminal with the curl command that posts http/batch.json to the path $batch and the JSON answer, marked by callout 13: the responses with the ids 1 and 2 both have status 200, the first holds the claims Train ticket and Hotel Madrid and the second holds four items with an amount above 100; the long answer wraps onto several lines',
        lines: [prompt(`curl -s -X POST '${B}/$batch' --json @http/batch.json`), ...r],
        marksOf: [[0, 13, 1 + r.length]],
      });
    })(),
    (() => {
      const a = wrap(created);
      const b = wrap(patched);
      const lines = [
        prompt(`curl -s -i --json @http/new-claim.json '${B}/Claims'`), out('HTTP/1.1 201 Created', 'state.normal.bg'), out('location: Claims(13)'), ...a,
        prompt(`curl -s -i -X PATCH --json '{"status":"A"}' '${B}/Claims(13)'`), out('HTTP/1.1 200 OK', 'state.normal.bg'), ...b,
      ];
      return terminal({
        id: '08-write',
        alt: 'Terminal with two curl commands: the POST of http/new-claim.json answers HTTP 201 Created with the location Claims(13) and the new claim Hotel Lisbon with the status N and its item (callout 14), and the PATCH answers HTTP 200 OK with the status A (callout 15); the long answers wrap onto a second line',
        lines,
        marksOf: [[0, 14, 3 + a.length], [3 + a.length, 15, 2 + b.length]],
      });
    })(),
    browser({
      id: '09-result', h: 500, url: 'localhost:4004/odata/v4/query/Claims(13)?$expand=items', markAddress: 16,
      alt: 'Browser with the address localhost:4004/odata/v4/query/Claims(13) with the option expand items, marked by callout 16: the JSON response holds the claim Hotel Lisbon dated 2026-03-30 with the status A and the amount 120.00, and its item Room with the amount 120.00',
      lines: plainCode(readBackJson),
    }),
  ],
};
