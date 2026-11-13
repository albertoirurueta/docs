// Figures of "SAP Guide: Your First CAP Service" (erp/sap/guide-first-cap-service.adoc). Facts: the project built and run on
// 2026-11-13 with @sap/cds-dk 10.2.1, @sap/cds 10.2.2 and Node.js 24.21.0 (cds init expenses --nodejs, then the lab files of
// modules/ROOT/examples/sap-lab/expenses without the draft annotation); the terminal text is the output of cds init, npm install and
// cds watch (the banner lines are left out), the browser text is the response of the running service (pretty-printed, as the
// browser's formatting option shows it). The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, mark, vscodeShell, terminalShell, browserShell, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'expenses');
const read = (f) => readFileSync(join(lab, f), 'utf8');
// The files as the guide shows them: the lab files without the tagged regions that a later guide adds (draft, statuses).
const service = labText(read('srv/expense-service.cds'), { drop: ['draft', 'statuses'] });
const schema = labText(read('db/schema.cds'), { drop: ['statuses'] });

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });

const explorer = ({ active, csv = false, service: svc = false, fresh = false }) => [
  { label: 'EXPENSES', folder: true, open: true },
  { label: 'app', indent: 1, folder: true },
  { label: 'db', indent: 1, folder: true, open: !fresh },
  ...(csv ? [{ label: 'data', indent: 2, folder: true, open: true }, { label: 'sap.guide.expenses-Claims.csv', indent: 3 }] : []),
  ...(fresh ? [] : [{ label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) }]),
  { label: 'srv', indent: 1, folder: true, open: svc },
  ...(svc ? [{ label: 'expense-service.cds', indent: 2, ...(active === 'expense-service.cds' ? { active: true } : {}) }] : []),
  { label: 'package.json', indent: 1, ...(active === 'package.json' ? { active: true } : {}) },
  { label: 'readme.md', indent: 1 },
];

function editor({ id, alt, h, tabs, activeTab, code, terminal, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'expenses', explorer: exp, tabs, activeTab, code, terminal });
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

const run = (...ts) => ts.map((t) => ({ t }));
const metadata = `<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:DataServices>
    <Schema Namespace="ExpenseService" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityContainer Name="EntityContainer">
        <EntitySet Name="Claims" EntityType="ExpenseService.Claims"/>
      </EntityContainer>
      <EntityType Name="Claims">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="title" Type="Edm.String" MaxLength="80"/>
        <Property Name="status" Type="Edm.String" MaxLength="1" DefaultValue="N"/>
        <Property Name="amount" Type="Edm.Decimal" Precision="9" Scale="2"/>
      </EntityType>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>`;
const claimsJson = `{
  "@odata.context": "$metadata#Claims",
  "value": [
    {
      "ID": "11111111-1111-1111-1111-111111111111",
      "createdAt": "2026-11-13T17:57:13.229Z",
      "createdBy": "anonymous",
      "modifiedAt": "2026-11-13T17:57:13.229Z",
      "modifiedBy": "anonymous",
      "title": "Train ticket",
      "status": "N",
      "amount": "45.50"
    }
  ]
}`;
const selectJson = `{
  "@odata.context": "$metadata#Claims",
  "@odata.count": 1,
  "value": [
    {
      "title": "Train ticket",
      "amount": "45.50",
      "ID": "11111111-1111-1111-1111-111111111111"
    }
  ]
}`;
const packageJson = `{
  "name": "expenses",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@sap/cds": "^10"
  },
  "devDependencies": {
    "@cap-js/sqlite": "^3"
  },
  "scripts": {
    "start": "cds-serve"
  },
  "private": true
}`;

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'first-cap-service',
  figures: [
    editor({
      id: '01-project-created', h: 640, tabs: ['package.json'], activeTab: 0, code: plainCode(packageJson), exp: explorer({ active: 'package.json', fresh: true }),
      terminal: [prompt('cds init expenses --nodejs'), out('Adding facet: nodejs'), out('Successfully initialized CAP project'), out('Continue with: code expenses'), prompt('cd expenses && npm install'), out('added 72 packages, and audited 73 packages in 469ms'), out('found 0 vulnerabilities')],
      alt: 'Visual Studio Code with the new expenses project: the explorer lists the folders app, db and srv and the files package.json and readme.md, the editor shows the generated package.json, and the terminal shows cds init expenses with the option nodejs, then npm install ending in found 0 vulnerabilities; callout 2 marks the app, db and srv folders and callout 3 marks package.json',
      marksFor: (g) => [[{ x: g['entry:app'].x, y: g['entry:app'].y, w: g['entry:app'].w, h: 72 }, 2], [g['entry:package.json'], 3]],
    }),
    editor({
      id: '02-schema-file', h: 340, tabs: ['schema.cds'], activeTab: 0, code: cdsCode(schema), exp: explorer({ active: 'schema.cds' }),
      alt: 'Visual Studio Code with the file db/schema.cds open: it imports cuid and managed, sets the namespace sap.guide.expenses and defines the entity Claims with the fields title, status and amount; callout 4 marks the file in the explorer',
      marksFor: (g) => [[g['entry:schema.cds'], 4]],
    }),
    editor({
      id: '03-service-and-data', h: 400, tabs: ['schema.cds', 'expense-service.cds'], activeTab: 1, code: cdsCode(service), exp: explorer({ active: 'expense-service.cds', csv: true, service: true }),
      alt: 'Visual Studio Code with the file srv/expense-service.cds open: the service ExpenseService exposes the entity Claims as a projection on db.Claims; callout 5 marks the service file and callout 6 marks the CSV file sap.guide.expenses-Claims.csv in the folder db/data',
      marksFor: (g) => [[g['entry:expense-service.cds'], 5], [g['entry:sap.guide.expenses-Claims.csv'], 6]],
    }),
    terminal({
      id: '04-cds-watch',
      alt: 'Terminal after cds watch: the log lists the model files srv/expense-service.cds, db/schema.cds and the common.cds of CAP, connects to an in-memory SQLite database, initializes it from db/data/sap.guide.expenses-Claims.csv, serves ExpenseService at /odata/v4/expense and ends with server listening on http://localhost:4004; callout 7 marks the command, callout 8 the database lines and callout 9 the listening line',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  srv/expense-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.expenses-Claims.csv'),
        out('/> successfully deployed to in-memory database.'),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving ExpenseService {'),
        out("  at: [ '/odata/v4/expense' ],"),
        out("  decl: 'srv/expense-service.cds:2'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 7], [5, 8, 3], [13, 9]],
    }),
    browser({
      id: '05-metadata', h: 680, url: 'localhost:4004/odata/v4/expense/$metadata', markAddress: 11,
      alt: 'Browser with the address localhost:4004/odata/v4/expense/$metadata, marked by callout 11: the XML document, shortened to its schema, describes the entity container with the entity set Claims and the entity type Claims with the key ID and the properties ID, createdAt, createdBy, modifiedAt, modifiedBy, title, status and amount',
      lines: plainCode(metadata),
    }),
    browser({
      id: '06-claims', h: 330, url: 'localhost:4004/odata/v4/expense/Claims', markAddress: 12,
      alt: 'Browser with the address localhost:4004/odata/v4/expense/Claims, marked by callout 12: the JSON response holds one claim with the ID, the created and modified fields, the title Train ticket, the status N and the amount 45.50',
      lines: plainCode(claimsJson),
    }),
    browser({
      id: '07-result', h: 270, url: 'localhost:4004/odata/v4/expense/Claims?$select=title,amount&$count=true',
      alt: 'Browser with the address localhost:4004/odata/v4/expense/Claims?$select=title,amount&$count=true: the JSON response shows odata.count 1 and one claim with the title Train ticket, the amount 45.50 and its ID',
      lines: plainCode(selectJson),
    }),
  ],
};
