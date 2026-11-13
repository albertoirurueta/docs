// Screen maps of the SAP guides: one numbered overview per screen the guides work in. Facts: the lab app of
// modules/ROOT/examples/sap-lab/expenses (entity Claims, service ExpenseService, annotations in app/annotations.cds), the
// Fiori elements preview of `cds watch` (checked in a browser on 2026-11-13) and the abaplint and open-abap workflow of
// scripts/sap-guides/brief/open-abap-feasibility.md. Files: sap-<area>-map-<screen>.svg; which guide shows which map is in
// lib/guide-maps.mjs. Colours are theme tokens only; the screens come from lib/sap-shells.mjs.
import { FW, lbl, box, legend, legendHeight, fioriShell, fioriListReport, fioriObjectPage, vscodeShell, terminalShell } from '../lib/sap-shells.mjs';

const num = (x, y, n) => ({ block: 'callout', x, y, num: n });
const LEG_ROW = 30;
const tag = (b, n) => num(b.x + b.w + 3, b.y - 3, n);

// A map figure: the scene, then the legend below it.
function figure({ id, area, theme, alt, items, sceneH, scene }) {
  const lh = legendHeight(items.length, 1, LEG_ROW);
  const h = sceneH + 16 + lh;
  return { id, area, theme, alt, width: FW, height: h, nodes: [box(0, 0, FW, h, { fill: 'canvas' }), ...scene(), ...legend({ x: 16, y: sceneH + 16, items, cols: 1, colW: FW - 32, rowH: LEG_ROW })] };
}

// ---------------------------------------------------------------- Fiori elements list report
const listItems = [
  [1, 'Shell bar: the app title and the user menu'],
  [2, 'Variant name: the saved set of filters and columns, here Standard'],
  [3, 'Search field and filter fields of the filter bar, one per filter you adapt'],
  [4, 'Go: applies the filters and fills the table'],
  [5, 'Adapt Filters: chooses which filter fields the bar shows'],
  [6, 'Table toolbar: Create opens an empty draft, Delete removes the selected rows'],
  [7, 'Table: one column per field of @UI.LineItem, one row per claim; a click on a row opens its object page'],
];
function listReport() {
  const lr = fioriListReport();
  const g = lr.geo;
  return figure({
    id: 'fiori-list-report', area: 'general', theme: 'sap-fiori',
    alt: 'Map of a Fiori elements list report with seven numbered regions: the shell bar, the variant name, the filter fields, Go, Adapt Filters, the table toolbar with Create and Delete, and the table of claims',
    items: listItems, sceneH: lr.height,
    scene: () => [
      ...fioriShell({ h: lr.height, children: [
        ...lr.nodes,
        num(FW - 62, 26, 1), tag(g.variant, 2), tag(g.search, 3), tag(g.go, 4), tag(g.adapt, 5), tag(g.create, 6), tag(g.row[0], 7),
      ] }),
    ],
  });
}

// ---------------------------------------------------------------- Fiori elements object page
const objectItems = [
  [1, 'Header title: the Title of the @UI.HeaderInfo annotation, here the claim title'],
  [2, 'Edit switches the claim to a draft; Delete removes it'],
  [3, 'Section tabs: one tab per facet of @UI.Facets, here General and Administration'],
  [4, 'Section: one card per field group, with the label of the facet as its heading'],
  [5, 'Fields of a field group: the label above, the value below, read-only until you edit'],
];
function objectPage() {
  const op = fioriObjectPage();
  const g = op.geo;
  return figure({
    id: 'fiori-object-page', area: 'general', theme: 'sap-fiori',
    alt: 'Map of a Fiori elements object page with five numbered regions: the header title, the Edit and Delete actions, the section tabs General and Administration, the section card and the fields with their labels',
    items: objectItems, sceneH: op.height,
    scene: () => [
      ...fioriShell({ h: op.height, title: 'Claim', back: true, children: [
        ...op.nodes,
        num(300, 82, 1), tag({ x: g.edit.x, y: g.edit.y, w: g.delete.x + g.delete.w - g.edit.x, h: g.edit.h }, 2), tag(g.tabs, 3), tag(g.general, 4), tag(g.fields, 5),
      ] }),
    ],
  });
}

// ---------------------------------------------------------------- VS Code with the CAP project
const vsItems = [
  [1, 'Explorer: the files of the CAP project (db for the model, srv for the service, app for annotations)'],
  [2, 'db/schema.cds: the entity Claims with its fields'],
  [3, 'srv/expense-service.cds: the service that exposes the entity as an OData service'],
  [4, 'Editor tabs: the open files, the active one is drawn on a lighter background'],
  [5, 'Editor: the CDS source of the active file'],
  [6, 'Integrated terminal: where npm install and cds watch run, the log shows the served path and URL'],
];
function vscodeCap() {
  const explorer = [
    { label: 'EXPENSES', folder: true, open: true },
    { label: 'app', indent: 1, folder: true },
    { label: 'db', indent: 1, folder: true, open: true },
    { label: 'schema.cds', indent: 2 },
    { label: 'srv', indent: 1, folder: true, open: true },
    { label: 'expense-service.cds', indent: 2, active: true },
    { label: 'package.json', indent: 1 },
  ];
  const code = [
    [{ t: 'using', kind: 'keyword' }, { t: ' { sap.guide.expenses as db } ' }, { t: 'from', kind: 'keyword' }, { t: ' ' }, { t: "'../db/schema'", kind: 'string' }, { t: ';' }],
    [{ t: 'service', kind: 'keyword' }, { t: ' ExpenseService {' }],
    [{ t: '  entity', kind: 'keyword' }, { t: ' Claims ' }, { t: 'as projection on', kind: 'keyword' }, { t: ' db.Claims;' }],
    [{ t: '}' }],
  ];
  const terminal = [
    { str: '$ cds watch', tone: 'textMuted' },
    { str: "[cds] - connect to db > sqlite { url: ':memory:' }", tone: 'text' },
    { str: '[cds] - serving ExpenseService {', tone: 'text' },
    { str: "  at: [ '/odata/v4/expense' ],", tone: 'text' },
    { str: "  decl: 'srv/expense-service.cds:2'", tone: 'text' },
    { str: '}', tone: 'text' },
    { str: "[cds] - server listening on { url: 'http://localhost:4004' }", tone: 'text' },
  ];
  const sh = vscodeShell({ h: 560, title: 'expenses', explorer, tabs: ['schema.cds', 'expense-service.cds'], activeTab: 1, code, terminal });
  const g = sh.geo;
  const tabBox = g['tab:expense-service.cds'];
  const marksList = [
    num(g.explorer.x + g.explorer.w - 14, g.explorer.y + 14, 1), tag(g['entry:schema.cds'], 2), tag(g['entry:expense-service.cds'], 3),
    num(tabBox.x + tabBox.w - 8, 42, 4), num(g.editor.x + g.editor.w - 14, g.editor.y + 14, 5), num(g.terminal.x + g.terminal.w - 14, g.terminal.y + 14, 6),
  ];
  return figure({
    id: 'vscode-cap-project', area: 'general', theme: 'vscode',
    alt: 'Map of Visual Studio Code with the CAP project open and six numbered regions: the explorer, the schema file, the service file, the editor tabs, the editor with the service source and the integrated terminal that runs cds watch',
    items: vsItems, sceneH: 560,
    scene: () => sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...marksList] })),
  });
}

// ---------------------------------------------------------------- abaplint and open-abap terminal workflow
const abapItems = [
  [1, 'Install: npm install adds abaplint and the open-abap transpiler to the project, no account involved'],
  [2, 'abaplint: reads the ABAP files and prints one line per finding with its rule name'],
  [3, 'Transpile: turns the ABAP files into JavaScript files in the build folder'],
  [4, 'Run: Node.js runs the transpiled program and the program output ends the workflow'],
];
function abaplintTerminal() {
  const lines = [
    { str: '$ npm install', tone: 'textMuted' },
    { str: 'added packages, audited packages, found 0 vulnerabilities', tone: 'text' },
    { str: '$ npx abaplint', tone: 'textMuted' },
    { str: 'src/zhello.prog.abap[3, 1] Line too long (line_length)', tone: 'danger' },
    { str: '$ npx abap_transpile', tone: 'textMuted' },
    { str: 'Transpiling to build/', tone: 'text' },
    { str: '$ node build/project/zhello.prog.mjs', tone: 'textMuted' },
    { str: 'Hello, world', tone: 'state.normal.bg' },
  ];
  const h = 300;
  const t = terminalShell({ h, title: 'Terminal', lines });
  const y = (i) => 46 + i * 21;
  const marksList = [num(FW - 24, y(0) + 10, 1), num(FW - 24, y(2) + 10, 2), num(FW - 24, y(4) + 10, 3), num(FW - 24, y(6) + 10, 4)];
  return figure({
    id: 'abaplint-terminal', area: 'abap', theme: 'terminal',
    alt: 'Map of the terminal workflow for ABAP without an SAP system with four numbered regions: npm install, the abaplint check, the transpile step and the run of the transpiled program',
    items: abapItems, sceneH: h,
    scene: () => t.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...marksList] })),
  });
}

export default {
  area: 'general',
  theme: 'sap-fiori',
  maps: true,
  figures: [listReport(), objectPage(), vscodeCap(), abaplintTerminal()],
};
