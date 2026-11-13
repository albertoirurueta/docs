// Figures of "SAP Guide: Your First SAPUI5 App" (erp/sap/guide-first-sapui5-app.adoc). Facts: the project built and run on
// 2026-11-13 with @sap/cds 10.2.2, @sap/cds-dk 10.2.1, @ui5/cli 4.0.73 and OpenUI5 1.154.0 on Node.js 24.21.0 (the lab files
// of modules/ROOT/examples/sap-lab/claims-ui5; `cds watch` on port 4004, `ui5 serve` on port 8080, the page opened in a
// browser with ?sap-ui-language=en). The terminal text is the output of those commands (the cds banner is left out); the
// app screens are redrawn from the running page (title, search field, table with the toolbar title "Claims (4)", the
// rows sorted by title, status words from the i18n file, amounts with EUR) and the search shows the real answer for the
// text "Ho". The step numbers are the callout numbers of the page. Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FW, lbl, box, rule, ico, mark, vscodeShell, terminalShell, browserShell, cdsCode, plainCode, labText } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'claims-ui5');
const read = (f) => readFileSync(join(lab, f), 'utf8');
const schema = read('db/schema.cds');
const service = read('srv/claim-service.cds');
const csv = read('db/data/sap.guide.claims-Claims.csv');
const uiYaml = read('ui/ui5.yaml');
const manifest = labText(read('ui/webapp/manifest.json'), { lines: [16, 40] });
const view = labText(read('ui/webapp/view/Claims.view.xml'), { lines: [1, 30] });

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
const out = (str, tone = 'text') => ({ str, tone });

// Explorer entries of the project. `open` lists the folders that are expanded; `active` is the open file.
const entry = (label, indent, extra = {}) => ({ label, indent, ...extra });
const explorer = ({ active, openUi = false, openWebapp = false, openLib = false, openI18n = false, csvOpen = true }) => [
  { label: 'CLAIMS-UI5', folder: true, open: true },
  entry('app', 1, { folder: true }),
  entry('db', 1, { folder: true, open: true }),
  entry('schema.cds', 2, active === 'schema.cds' ? { active: true } : {}),
  ...(csvOpen ? [entry('data', 2, { folder: true, open: true }), entry('sap.guide.claims-Claims.csv', 3)] : []),
  entry('srv', 1, { folder: true, open: true }),
  entry('claim-service.cds', 2, active === 'claim-service.cds' ? { active: true } : {}),
  entry('ui', 1, { folder: true, open: openUi }),
  ...(openUi ? [
    entry('lib', 2, { folder: true, open: openLib }),
    ...(openLib ? [entry('odata-proxy.js', 3)] : []),
    entry('webapp', 2, { folder: true, open: openWebapp }),
    ...(openWebapp ? [
      entry('controller', 3, { folder: true, open: openI18n }),
      ...(openI18n ? [entry('Claims.controller.js', 4)] : []),
      entry('i18n', 3, { folder: true, open: openI18n }),
      ...(openI18n ? [entry('i18n_de.properties', 4), entry('i18n_en.properties', 4)] : []),
      entry('view', 3, { folder: true, open: openI18n }),
      ...(openI18n ? [entry('Claims.view.xml', 4, active === 'Claims.view.xml' ? { active: true } : {})] : []),
      entry('Component.js', 3, active === 'Component.js' ? { active: true } : {}),
      entry('index.html', 3),
      entry('manifest.json', 3, active === 'manifest.json' ? { active: true } : {}),
    ] : []),
    entry('package.json', 2),
    entry('ui5.yaml', 2, active === 'ui5.yaml' ? { active: true } : {}),
  ] : []),
];

function editor({ id, alt, h, tabs, activeTab, code, terminal, exp, marksFor }) {
  const sh = vscodeShell({ h, title: 'claims-ui5', explorer: exp, tabs, activeTab, code, terminal });
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

// The app as the browser shows it: page header with the title and the search field, the claims table in a white card.
const ROWS = [['Conference fee', 'Rejected', '1,200.00'], ['Hotel Berlin', 'Approved', '189.00'], ['Team lunch', 'New', '62.40'], ['Train ticket', 'New', '45.50']];
function appBody({ oy, rows, query = '', title = 'Claims' }) {
  const n = [];
  n.push(box(0, oy, FW, 48, { fill: 'headerBg', stroke: 'border' }));
  n.push(lbl(16, oy + 30, 'Expense Claims', { size: 'title', weight: 600, box: 300 }));
  const sx = FW - 16 - 256;
  n.push(box(sx, oy + 8, 256, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 8 }));
  n.push(lbl(sx + 12, oy + 29, query || 'Search by title', { size: 'small', tone: query ? 'text' : 'textFaint', box: 200 }));
  n.push(ico(sx + 256 - 28, oy + 16, 'search', 'textMuted'));
  const ty = oy + 48 + 16;
  const th = 44 + 40 + rows.length * 44 + 8;
  n.push(box(0, ty, FW, th, { fill: 'surface', stroke: 'border' }));
  n.push(lbl(16, ty + 28, `${title} (${rows.length})`, { size: 'title', weight: 600, box: 300 }));
  n.push(rule(0, ty + 44, FW));
  n.push(lbl(16, ty + 44 + 25, 'Title', { size: 'small', weight: 600, tone: 'textMuted', box: 300 }));
  n.push(lbl(FW * 0.35, ty + 44 + 25, 'Status', { size: 'small', weight: 600, tone: 'textMuted', box: 200 }));
  n.push(lbl(FW - 16, ty + 44 + 25, 'Amount', { size: 'small', weight: 600, tone: 'textMuted', anchor: 'end', box: 200 }));
  rows.forEach(([t, s, a], i) => {
    const ry = ty + 84 + i * 44;
    n.push(rule(0, ry, FW));
    n.push(lbl(16, ry + 27, t, { weight: 600, box: 300 }));
    n.push(lbl(FW * 0.35, ry + 27, s, { box: 200 }));
    n.push(lbl(FW - 16 - 36, ry + 27, a, { weight: 600, anchor: 'end', box: 160 }));
    n.push(lbl(FW - 16, ry + 27, 'EUR', { size: 'small', tone: 'textMuted', anchor: 'end', box: 40 }));
  });
  return { nodes: n, geo: { search: { x: sx, y: oy + 8, w: 256, h: 32 } }, height: ty + th + 24 };
}

function browserApp({ id, alt, rows, query, markAddress, markSearch }) {
  const probe = appBody({ oy: 92, rows, query });
  const sh = browserShell({ h: probe.height, url: 'localhost:8080/index.html?sap-ui-language=en', tab: 'Expense Claims' });
  const list = [...(markAddress ? mark(sh.geo.address, markAddress) : []), ...(markSearch ? mark(probe.geo.search, markSearch) : [])];
  return { id, alt, width: FW, height: probe.height, theme: 'sap-fiori', nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...probe.nodes, ...list] })) };
}

export default {
  area: 'general',
  theme: 'vscode',
  guide: 'first-sapui5-app',
  figures: [
    editor({
      id: '01-service-files', h: 340, tabs: ['schema.cds', 'claim-service.cds'], activeTab: 1, code: cdsCode(service), exp: explorer({ active: 'claim-service.cds' }),
      alt: 'Visual Studio Code with the CAP project claims-ui5: the explorer lists db/schema.cds, the CSV file in db/data and srv/claim-service.cds, the editor shows claim-service.cds with the service ClaimService that exposes Claims as a projection on db.Claims; callout 2 marks schema.cds, callout 3 the service file and callout 4 the CSV file',
      marksFor: (g) => [[g['entry:schema.cds'], 2], [g['entry:claim-service.cds'], 3], [g['entry:sap.guide.claims-Claims.csv'], 4]],
    }),
    terminal({
      id: '02-cds-watch',
      alt: 'Terminal after cds watch: the log lists srv/claim-service.cds, db/schema.cds and the common.cds of CAP, connects to an in-memory SQLite database, initializes it from db/data/sap.guide.claims-Claims.csv, serves ClaimService at /odata/v4/claim and ends with server listening on http://localhost:4004; callout 5 marks the command',
      lines: [
        prompt('cds watch'),
        out('[cds] - loaded model from 3 file(s):'),
        out('  srv/claim-service.cds'),
        out('  db/schema.cds'),
        out('  node_modules/@sap/cds/common.cds'),
        out("[cds] - using bindings from: { registry: '~/.cds/services' }"),
        out("[cds] - connect to db > sqlite { url: ':memory:' }"),
        out('  > init from db/data/sap.guide.claims-Claims.csv'),
        out('/> successfully deployed to in-memory database.'),
        out("[cds] - using auth strategy { kind: 'mocked' }"),
        out('[cds] - serving ClaimService {'),
        out("  at: [ '/odata/v4/claim' ],"),
        out("  decl: 'srv/claim-service.cds:3'"),
        out('}'),
        out("[cds] - server listening on { url: 'http://localhost:4004' }", 'state.normal.bg'),
      ],
      marksOf: [[0, 5]],
    }),
    editor({
      id: '03-ui-project', h: 650, tabs: ['package.json', 'ui5.yaml'], activeTab: 1, code: plainCode(uiYaml), exp: explorer({ active: 'ui5.yaml', openUi: true, openLib: true, openWebapp: true }),
      alt: 'Visual Studio Code with the folder ui in the project: the explorer lists ui/lib/odata-proxy.js, ui/webapp with Component.js, index.html and manifest.json, ui/package.json and ui/ui5.yaml; the editor shows ui5.yaml with the OpenUI5 version 1.154.0, the libraries sap.m, sap.ui.core and themelib_sap_horizon and the middleware odata-proxy that forwards /odata to http://localhost:4004; callout 8 marks ui5.yaml, callout 9 the proxy file and callout 10 index.html',
      marksFor: (g) => [[g['entry:ui5.yaml'], 8], [g['entry:odata-proxy.js'], 9], [g['entry:index.html'], 10]],
    }),
    editor({
      id: '04-manifest', h: 620, tabs: ['Component.js', 'manifest.json'], activeTab: 1, code: plainCode(manifest), exp: explorer({ active: 'manifest.json', openUi: true, openWebapp: true }),
      alt: 'Visual Studio Code with manifest.json open, shortened to its sap.ui5 part: the root view sap.guide.claims.view.Claims, the library dependencies sap.m and sap.ui.core, the i18n model with the supported locales en and de and the default model on the data source claimService with the operation mode Server; callout 11 marks Component.js and callout 12 marks manifest.json in the explorer',
      marksFor: (g) => [[g['entry:Component.js'], 11], [g['entry:manifest.json'], 12]],
    }),
    editor({
      id: '05-view', h: 710, tabs: ['Claims.view.xml'], activeTab: 0, code: plainCode(view), exp: explorer({ active: 'Claims.view.xml', openUi: true, openWebapp: true, openI18n: true, csvOpen: false }),
      alt: 'Visual Studio Code with Claims.view.xml open, shortened to its first 30 lines: the view names its controller, the page with the search field in the header and the table bound to /Claims sorted by title with a toolbar title and three columns; callout 13 marks the i18n file i18n_en.properties, callout 14 marks the view file and callout 15 marks the controller file in the explorer',
      marksFor: (g) => [[g['entry:i18n_en.properties'], 13], [g['entry:Claims.view.xml'], 14], [g['entry:Claims.controller.js'], 15]],
    }),
    terminal({
      id: '06-ui5-serve',
      alt: 'Terminal in the folder ui after npm start: the script runs ui5 serve with port 8080, UI5 Tooling reports that it uses OpenUI5 version 1.154.0 and that the server started at http://localhost:8080; callout 16 marks the command',
      lines: [
        prompt('cd ui'),
        prompt('npm start'),
        out(''),
        out('> claims-ui@1.0.0 start'),
        out('> ui5 serve --port 8080'),
        out(''),
        out('info graph:helpers:ui5Framework Using OpenUI5 version: 1.154.0'),
        out('Server started', 'state.normal.bg'),
        out('URL: http://localhost:8080', 'state.normal.bg'),
      ],
      marksOf: [[1, 16]],
    }),
    browserApp({
      id: '07-app-list', rows: ROWS, markAddress: 17,
      alt: 'Browser at localhost:8080/index.html with the language parameter en, marked by callout 17: the app Expense Claims shows a search field in the page header and the table Claims (4) with the columns Title, Status and Amount and the rows Conference fee, Hotel Berlin, Team lunch and Train ticket, sorted by title, with the status words Rejected, Approved, New and New and the amounts with EUR',
    }),
    browserApp({
      id: '08-search-result', rows: [ROWS[1]], query: 'Ho', markSearch: 18,
      alt: 'The same app after the text Ho was typed into the search field and confirmed, marked by callout 18: the table title reads Claims (1) and the only row left is Hotel Berlin, Approved, 189.00 EUR',
    }),
  ],
};
