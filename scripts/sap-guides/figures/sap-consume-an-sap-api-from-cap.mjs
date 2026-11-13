// Figures of "SAP Guide: Consume an SAP API Specification in CAP" (erp/sap/guide-consume-an-sap-api-from-cap.adoc). Facts: the
// lab project modules/ROOT/examples/sap-lab/partners-s4 built and run on 2026-11-13 with @sap/cds-dk 10.2.1, @sap/cds 10.2.2 and
// Node.js 24.21.0: cds init, npm install, the download of API_BUSINESS_PARTNER.edmx (695,017 bytes, SHA-256 810008e1...faf77) from
// the public capire/s4 repository, cds import --as cds, the lab files, cds watch and curl. The terminal and browser text is the
// real output (the banner of cds watch is left out; the port shown is the default 4004, the run used another free port because
// 4004 was taken). The excerpt of the generated srv/external/API_BUSINESS_PARTNER.cds is copied from the import of that file:
// it is a generated file and is not part of the lab. The step numbers are the callout numbers of the page.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, browserShell, cdsCode, plainCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'partners-s4');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const service = read('srv/partner-service.cds');
const csv = read('srv/external/data/API_BUSINESS_PARTNER.A_BusinessPartner.csv');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });
const URL_ROOT = 'http://localhost:4004/odata/v4';

const generated = `  @cds.external : true
  @cds.persistence.skip : true
  @sap.deletable : 'false'
  @sap.content.version : '1'
  @sap.label : 'Business Partner'
  entity A_BusinessPartner {
    @sap.display.format : 'UpperCase'
    @sap.label : 'Business Partner'
    @sap.quickinfo : 'Business Partner Number'
    key BusinessPartner : String(10) not null;
    // ... Customer, Supplier, AcademicTitle and more ...
    @sap.display.format : 'UpperCase'
    @sap.label : 'BP Category'
    @sap.quickinfo : 'Business Partner Category'
    BusinessPartnerCategory : String(1);
    @sap.creatable : 'false'
    @sap.updatable : 'false'
    BusinessPartnerFullName : String(81);
    // ... more elements ...
    to_BusinessPartnerAddress : Association to many A_BusinessPartnerAddress {  };
    // ... more associations ...
  };`;

const explorer = ({ active, imported = true, files = [], handlerFile = false }) => [
  { label: 'PARTNERS-S4', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true },
  { label: 'srv', indent: 1, folder: true, open: imported || files.length > 0 },
  ...(imported ? [
    { label: 'external', indent: 2, folder: true, open: true },
    ...(files.includes('csv') ? [{ label: 'data', indent: 3, folder: true }] : []),
    { label: 'API_BUSINESS_PARTNER.cds', indent: 3, ...(active === 'API_BUSINESS_PARTNER.cds' ? { active: true } : {}) },
    { label: 'API_BUSINESS_PARTNER.edmx', indent: 3 },
  ] : []),
  ...(files.includes('service') ? [{ label: 'partner-service.cds', indent: 2, ...(active === 'partner-service.cds' ? { active: true } : {}) }] : []),
  ...(handlerFile ? [{ label: 'partner-service.js', indent: 2, ...(active === 'partner-service.js' ? { active: true } : {}) }] : []),
  { label: 'API_BUSINESS_PARTNER.edmx', indent: 1 },
  { label: 'package.json', indent: 1 },
  { label: 'readme.md', indent: 1 },
];

function editor({ id, alt, h, tabs, activeTab, code, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'partners-s4', explorer: exp, tabs, activeTab, code });
  const list = marksFor(sh.geo).flatMap(([b, n]) => mark(b, n));
  return { id, alt, width: FW, height: h, theme: 'vscode', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

// A terminal answer is wrapped at 118 characters, as a terminal does; marksOf refers to the entries of `lines` (before wrapping).
function wrap(str, width = 118) {
  const rows = [];
  for (let i = 0; i < str.length; i += width) rows.push(str.slice(i, i + width));
  return rows.length ? rows : [''];
}
function terminal({ id, alt, lines, marksOf }) {
  const rows = [];
  const first = [];
  lines.forEach((ln) => {
    first.push(rows.length);
    wrap(ln.str).forEach((r, k) => rows.push({ str: k ? `  ${r}` : r, tone: ln.tone ?? 'text' }));
  });
  const h = 62 + rows.length * 21 + 4;
  const t = terminalShell({ h, title: 'Terminal', lines: rows });
  const list = marksOf.flatMap(([i, n, span = 1]) => {
    const b = t.geo.line(first[i]);
    return mark({ x: b.x, y: b.y + 3, w: b.w - 28, h: b.h * span - 4 }, n);
  });
  return { id, alt, width: FW, height: h, theme: 'terminal', nodes: t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

function browser({ id, alt, url, lines, h, markAddress }) {
  const sh = browserShell({ h, url, tab: 'localhost', lines });
  const list = markAddress ? mark(sh.geo.address, markAddress) : [];
  return { id, alt, width: FW, height: h, theme: 'browser', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...list] })) };
}

const mockJson = `{
  "@odata.context": "$metadata#A_BusinessPartner/$entity",
  "BusinessPartnerFullName": "Ana Torres",
  "BusinessPartner": "1000003"
}`;
const resultJson = `{
  "@odata.context": "$metadata#Partners",
  "value": [
    {
      "ID": "1000001",
      "name": "Example Trading Co."
    },
    {
      "ID": "1000002",
      "name": "Northwind Retail GmbH"
    },
    {
      "ID": "1000006",
      "name": "Warehouse Supplies Ltd."
    }
  ]
}`;

export default {
  area: 'general',
  theme: 'terminal',
  guide: 'consume-an-sap-api-from-cap',
  figures: [
    terminal({
      id: '01-import',
      alt: 'Terminal with the three commands of the first phase: cds init partners-s4 with the option nodejs and npm install, then curl that saves API_BUSINESS_PARTNER.edmx, whose size wc reports as 695017 bytes, then cds import with the option as cds, which reports that it updated package.json and imported the API to srv/external/API_BUSINESS_PARTNER; callout 1 marks cds init, callout 2 marks the curl download and callout 3 marks cds import',
      lines: [
        prompt('cds init partners-s4 --nodejs'),
        out('Adding facet: nodejs'),
        out('Successfully initialized CAP project'),
        out('Continue with: code partners-s4'),
        prompt('cd partners-s4 && npm install'),
        out('added 72 packages, and audited 73 packages in 473ms'),
        out('found 0 vulnerabilities'),
        prompt('curl -sSL -o API_BUSINESS_PARTNER.edmx \\'),
        out('  https://raw.githubusercontent.com/capire/s4/main/srv/external/API_BUSINESS_PARTNER.edmx'),
        prompt('wc -c API_BUSINESS_PARTNER.edmx'),
        out('  695017 API_BUSINESS_PARTNER.edmx'),
        prompt('cds import API_BUSINESS_PARTNER.edmx --as cds'),
        out('[cds] - updated ./package.json'),
        out(''),
        out('[cds] - imported API to srv/external/API_BUSINESS_PARTNER'),
        out('> use it in your CDS models through the likes of:'),
        out(''),
        out("using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER';", 'state.normal.bg'),
      ],
      marksOf: [[0, 1], [7, 2, 2], [11, 3]],
    }),
    editor({
      id: '02-generated-model', h: 560, tabs: ['API_BUSINESS_PARTNER.cds'], activeTab: 0, code: cdsCode(generated),
      exp: explorer({ active: 'API_BUSINESS_PARTNER.cds' }),
      alt: 'Visual Studio Code with the generated file srv/external/API_BUSINESS_PARTNER.cds open, shortened to an excerpt: the entity A_BusinessPartner with the annotation cds.external true and cds.persistence.skip true, the key BusinessPartner, the elements BusinessPartnerCategory and BusinessPartnerFullName and the association to_BusinessPartnerAddress; callout 4 marks the file in the explorer folder srv/external',
      marksFor: (g) => [[g['entry:API_BUSINESS_PARTNER.cds'], 4]],
    }),
    editor({
      id: '03-service', h: 400, tabs: ['API_BUSINESS_PARTNER.cds', 'partner-service.cds'], activeTab: 1, code: cdsCode(service),
      exp: explorer({ active: 'partner-service.cds', files: ['service'] }),
      alt: 'Visual Studio Code with the file srv/partner-service.cds open: it imports API_BUSINESS_PARTNER as bupa and defines the service PartnerDashboard with the read-only entity Partners, a projection on bupa.A_BusinessPartner that renames BusinessPartner to ID, BusinessPartnerFullName to name and BusinessPartnerCategory to category; callout 5 marks the service file in the explorer',
      marksFor: (g) => [[g['entry:partner-service.cds'], 5]],
    }),
    editor({
      id: '04-sample-data', h: 400, tabs: ['partner-service.cds', 'API_BUSINESS_PARTNER.A_BusinessPartner.csv'], activeTab: 1, code: plainCode(csv),
      exp: explorer({ active: 'none', files: ['service', 'csv'] }),
      alt: 'Visual Studio Code with the file srv/external/data/API_BUSINESS_PARTNER.A_BusinessPartner.csv open: a header row with BusinessPartner, BusinessPartnerFullName, BusinessPartnerCategory, Customer and Supplier separated by semicolons, followed by six partners, from Example Trading Co. with the ID 1000001 to Warehouse Supplies Ltd. with the ID 1000006; callout 6 marks the folder data in the explorer',
      marksFor: (g) => [[g['entry:data'], 6]],
    }),
    terminal({
      id: '05-cds-watch',
      alt: 'Terminal after cds watch: the log lists the model files srv/partner-service.cds and srv/external/API_BUSINESS_PARTNER.cds, connects to an in-memory SQLite database, initializes it from srv/external/data/API_BUSINESS_PARTNER.A_BusinessPartner.csv, serves PartnerDashboard at /odata/v4/partner-dashboard with the handler srv/partner-service.js, then reports mocking API_BUSINESS_PARTNER at /odata/v4/api-business-partner and ends with server listening on http://localhost:4004; callout 8 marks the command and callout 9 the lines that report the mocked service',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 2 file(s):'),
        out(''),
        out('  srv/partner-service.cds'),
        out('  srv/external/API_BUSINESS_PARTNER.cds'),
        out(''),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from srv/external/data/API_BUSINESS_PARTNER.A_BusinessPartner.csv'),
        out('/> successfully deployed to in-memory database.'),
        out(''),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving PartnerDashboard {'),
        out("  at: [ '/odata/v4/partner-dashboard' ],"),
        out("  decl: 'srv/partner-service.cds:3',"),
        out("  impl: 'srv/partner-service.js'"),
        out('}'),
        out('[cds] - mocking API_BUSINESS_PARTNER {'),
        out("  at: [ '/odata/v4/api-business-partner' ],"),
        out("  decl: 'srv/external/API_BUSINESS_PARTNER.cds:6'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 8], [16, 9, 4]],
    }),
    terminal({
      id: '06-queries',
      alt: 'Terminal with three curl requests to the dashboard and their answers: the first three partners with ID, name and category, the companies only (category 2) with ID and name, and the count 6; callout 10 marks the first request, callout 11 the second and callout 12 the third',
      lines: [
        prompt(`curl -s '${URL_ROOT}/partner-dashboard/Partners?$top=3'`),
        out('{"@odata.context":"$metadata#Partners","value":[{"ID":"1000001","name":"Example Trading Co.","category":"2"},{"ID":"1000002","name":"Northwind Retail GmbH","category":"2"},{"ID":"1000003","name":"Ana Torres","category":"1"}]}'),
        prompt(`curl -s '${URL_ROOT}/partner-dashboard/Partners?$filter=category%20eq%20%272%27&$select=ID,name'`),
        out('{"@odata.context":"$metadata#Partners","value":[{"ID":"1000001","name":"Example Trading Co."},{"ID":"1000002","name":"Northwind Retail GmbH"},{"ID":"1000006","name":"Warehouse Supplies Ltd."}]}'),
        prompt(`curl -s '${URL_ROOT}/partner-dashboard/Partners/$count'`),
        out('6'),
      ],
      marksOf: [[0, 10], [2, 11], [4, 12]],
    }),
    browser({
      id: '07-mock-api', h: 250, url: "localhost:4004/odata/v4/api-business-partner/A_BusinessPartner('1000003')?$select=BusinessPartnerFullName", markAddress: 13,
      alt: 'Browser with the address localhost:4004/odata/v4/api-business-partner/A_BusinessPartner with the key 1000003 and the select option BusinessPartnerFullName, marked by callout 13: the JSON response holds the context A_BusinessPartner entity, BusinessPartnerFullName Ana Torres and BusinessPartner 1000003, the names of the SAP API',
      lines: plainCode(mockJson),
    }),
    browser({
      id: '08-result', h: 480, url: "localhost:4004/odata/v4/partner-dashboard/Partners?$filter=category eq '2'&$select=ID,name",
      alt: 'Browser with the address localhost:4004/odata/v4/partner-dashboard/Partners with a filter on category 2 and a select of ID and name: the JSON response lists three partners, Example Trading Co. with ID 1000001, Northwind Retail GmbH with ID 1000002 and Warehouse Supplies Ltd. with ID 1000006',
      lines: plainCode(resultJson),
    }),
  ],
};
