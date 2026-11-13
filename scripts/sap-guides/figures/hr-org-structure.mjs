// Figures of "SAP HR Guide: Build an Organizational Structure Model"
// (erp/sap/human-resources/guide-build-an-org-structure-model.adoc). Facts: the teaching model
// modules/ROOT/examples/sap-lab/org-structure run with `cds watch` (CAP 10.2.2) on 2026-11-13: the terminal text and the JSON are
// what the running service returned (the run used another port than 4004 because 4004 was busy; the figures show the guide's
// 4004), the object page is the Fiori elements preview of the same app and the tree page is the app/tree page. The model is not
// SAP S/4HANA or SAP SuccessFactors; names, numbers and codes are made up. The step numbers are the callout numbers of the page.
// Colours are theme tokens only.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { textWidth } from '../../figure-lib/text.mjs';
import { FW, lbl, box, mark, vscodeShell, terminalShell, browserShell, fioriShell, cdsCode, plainCode } from '../lib/sap-shells.mjs';

const lab = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', 'modules', 'ROOT', 'examples', 'sap-lab', 'org-structure');
const read = (f) => readFileSync(join(lab, f), 'utf8').replace(/\n$/, '').split('\n');

// Excerpt of the schema: the entities RelationshipTypes and Relationships with their comments.
const schemaLines = read('db/schema.cds');
const s0 = schemaLines.findIndex((l) => l.startsWith('// The kinds of relationship'));
const s1 = schemaLines.findIndex((l) => l.startsWith('entity Relationships'));
const schemaExcerpt = schemaLines.slice(s0, schemaLines.findIndex((l, i) => i > s1 && l === '}') + 1).join('\n');
// Excerpt of the rules: the tree check, the chief position check and the writing of the other end.
const ruleLines = read('srv/org-service.js');
const r0 = ruleLines.findIndex((l) => l.includes('Units form a tree'));
const r1 = ruleLines.findIndex((l) => l.includes('end::rules'));
const rulesExcerpt = ruleLines.slice(r0, r1).map((l) => l.slice(4)).join('\n');

const prompt = (str) => ({ str: `$ ${str}`, tone: 'textMuted' });
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

function editor({ id, alt, explorer, tab, code, markEntry, n }) {
  const h = 150 + code.length * 19;
  const sh = vscodeShell({ h, title: 'org-structure', explorer, tabs: [tab], activeTab: 0, code });
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
  { label: 'ORG-STRUCTURE', folder: true, open: true },
  { label: 'db', indent: 1, folder: true, open: true },
  { label: 'data', indent: 2, folder: true },
  { label: 'schema.cds', indent: 2, ...(active === 'schema.cds' ? { active: true } : {}) },
  { label: 'srv', indent: 1, folder: true, open: true },
  { label: 'org-service.cds', indent: 2 },
  { label: 'org-service.js', indent: 2, ...(active === 'org-service.js' ? { active: true } : {}) },
  { label: 'package.json', indent: 1 },
];

// The answer of step 7, as the service returned it (the browser shows it pretty-printed).
const salesJson = JSON.stringify({
  '@odata.context': '$metadata#Relationships',
  value: [
    { Relationship: 'A002', TargetType: 'O', TargetId: '50000001', SourceType: 'O', SourceId: '50000002' },
    { Relationship: 'B003', TargetType: 'S', TargetId: '51000001', SourceType: 'O', SourceId: '50000002' },
    { Relationship: 'B003', TargetType: 'S', TargetId: '51000002', SourceType: 'O', SourceId: '50000002' },
    { Relationship: 'B012', TargetType: 'S', TargetId: '51000001', SourceType: 'O', SourceId: '50000002' },
  ],
}, null, 2);

// The answers of steps 8 to 12, as printed (the run used port 4233; the figures show 4004).
const col = (step, type, id, name) => `{"Step":${step},"ObjectType":"${type}","ObjectId":"${id}","Name":"${name}"}`;
const evaluated = (...items) => `{"@odata.context":"$metadata#Collection(OrgService.Collected)","value":[${items.join(',')}]}`;
const evalCmd = (id) => `curl -s "http://localhost:4004/odata/v4/org/evaluate(startType='O',startId='${id}',path='O-S-P')"`;
const top = evaluated(col(1, 'O', '50000001', 'Example Trading Co.'), col(1, 'O', '50000002', 'Sales'), col(1, 'O', '50000003', 'Warehouse'), col(2, 'S', '51000001', 'Sales Manager'), col(2, 'S', '51000002', 'Sales Clerk'), col(2, 'S', '51000003', 'Warehouse Clerk'), col(3, 'P', '00001234', 'Ana Torres'), col(3, 'P', '00001235', 'Ben Okoye'), col(3, 'P', '00001236', 'Chloe Martin'));
const sales = evaluated(col(1, 'O', '50000002', 'Sales'), col(2, 'S', '51000001', 'Sales Manager'), col(2, 'S', '51000002', 'Sales Clerk'), col(3, 'P', '00001234', 'Ana Torres'), col(3, 'P', '00001235', 'Ben Okoye'));
const warehouse = evaluated(col(1, 'O', '50000003', 'Warehouse'), col(2, 'S', '51000003', 'Warehouse Clerk'), col(3, 'P', '00001236', 'Chloe Martin'));

// The tree page as the browser shows it after step 10: a heading and one line per node, indented by level.
function treePage() {
  const nodes = [
    [0, 'O', '50000001', 'Example Trading Co.'], [1, 'O', '50000002', 'Sales'], [2, 'S', '51000001', 'Sales Manager', 'chief'], [3, 'P', '00001234', 'Ana Torres'],
    [2, 'S', '51000002', 'Sales Clerk'], [3, 'P', '00001235', 'Ben Okoye'], [2, 'S', '51000004', 'Sales Assistant', 'vacant'], [1, 'O', '50000003', 'Warehouse'],
    [2, 'S', '51000003', 'Warehouse Clerk'], [3, 'P', '00001236', 'Chloe Martin'],
  ];
  const h = 92 + 130 + nodes.length * 30 + 24;
  const sh = browserShell({ h, url: 'localhost:4004/tree/index.html', tab: 'Organizational structure' });
  const body = [lbl(32, 92 + 60, 'Organizational structure', { size: 'heading', weight: 700, box: 600 })];
  nodes.forEach(([level, type, id, name, note], i) => {
    const x = 72 + level * 24;
    const y = 92 + 124 + i * 30;
    const text = `${type} ${id} ${name}`;
    const bold = type === 'O';
    body.push(lbl(x, y, text, { size: 'body', weight: bold ? 700 : 400, box: 400 }));
    if (note) {
      const w = Math.ceil(textWidth(text, 14, { weight: bold ? 700 : 400 })) + 6;
      body.push(lbl(x + w, y, note === 'chief' ? '(chief position)' : '(vacant)', { size: 'body', tone: note === 'chief' ? 'textMuted' : 'danger', box: 200 }));
    }
  });
  return { h, nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...body] })) };
}

// The object page of the unit Sales with its relationships, as the preview draws it (no Delete: the model only adds).
function objectPage() {
  const y = 52;
  const rows = [
    ['A002', 'Reports to', 'O', '50000001', 'Example Trading Co.'],
    ['B003', 'Incorporates', 'S', '51000001', 'Sales Manager'],
    ['B003', 'Incorporates', 'S', '51000002', 'Sales Clerk'],
    ['B003', 'Incorporates', 'S', '51000004', 'Sales Assistant'],
    ['B012', 'Is managed by', 'S', '51000001', 'Sales Manager'],
  ];
  const n = [
    box(0, y, FW, 120, { fill: 'surface', stroke: 'border' }),
    lbl(24, y + 38, 'Sales', { size: 'heading', weight: 600, box: 500 }),
    { block: 'tabs', x: 16, y: y + 84, w: 300, tabs: ['General', 'Relationships'], active: 0 },
    lbl(24, y + 158, 'General', { size: 'title', weight: 600, box: 240 }),
    box(16, y + 172, FW - 32, 96, { fill: 'surface', stroke: 'border', radius: 12 }),
  ];
  [['Object Type:', 'O'], ['Object ID:', '50000002'], ['Name:', 'Sales']].forEach(([l, v], i) => n.push(lbl(32 + i * 240, y + 198, l, { size: 'small', tone: 'textMuted', box: 220 }), lbl(32 + i * 240, y + 222, v, { size: 'small', weight: 600, box: 220 })));
  const cy = y + 300;
  n.push(lbl(24, cy, 'Relationships (5)', { size: 'title', weight: 600, box: 400 }),
    { block: 'table', x: 16, y: cy + 16, w: FW - 32, columns: [{ title: 'Relationship', w: 2 }, { title: 'Meaning', w: 3 }, { title: 'Related Type', w: 2 }, { title: 'Related Object', w: 2 }, { title: 'Related Name', w: 4 }], rows, rowHeight: 36 });
  const table = { x: 16, y: cy + 16, w: FW - 32, h: 36 * 6 };
  return { h: cy + 16 + 36 * 6 + 24, nodes: n, table };
}

export default {
  area: 'hr',
  theme: 'vscode',
  guide: 'build-an-org-structure-model',
  figures: [
    editor({
      id: '01-schema-file', explorer: explorer('schema.cds'), tab: 'schema.cds', code: cdsCode(schemaExcerpt), markEntry: 'schema.cds', n: 2,
      alt: 'Visual Studio Code with the file db/schema.cds of the org-structure project: an excerpt with the entities RelationshipTypes, which holds the kinds of relationship with their meaning, the two object types and the inverse, and Relationships, whose key is the relationship, the source type and ID and the target type and ID; callout 2 marks the file in the explorer',
    }),
    editor({
      id: '02-rules', explorer: explorer('org-service.js'), tab: 'org-service.js', code: plainCode(rulesExcerpt), markEntry: 'org-service.js', n: 5,
      alt: 'Visual Studio Code with the file srv/org-service.js: the excerpt rejects a unit that would report to itself or to a unit below it, rejects a second chief position for a unit and, after the record is created, writes the same relationship from the other end and issues a message; callout 5 marks the file in the explorer',
    }),
    (() => {
      const url = "localhost:4004/odata/v4/org/Relationships?$filter=SourceId eq '50000002'&$select=Relationship,TargetType,TargetId";
      const lines = [...plainCode(salesJson), [{ t: '' }]];
      const h = 150 + lines.length * 19;
      const sh = browserShell({ h, url, tab: 'localhost', lines });
      return {
        id: '03-sales-relationships', width: FW, height: h, theme: 'browser',
        alt: 'Browser with the address of the relationships that leave the unit 50000002, marked by callout 7: the JSON response holds four records, A002 to the unit 50000001, B003 to the positions 51000001 and 51000002 and B012 to the position 51000001, so the same links that point down from Sales are stored at the other end as well',
        nodes: sh.nodes.map((nd) => ({ ...nd, children: [...nd.children, ...mark(sh.geo.address, 7)] })),
      };
    })(),
    (() => {
      const t = build([
        ['cmd', evalCmd('50000001')], ['out', top],
        ['cmd', evalCmd('50000002')], ['out', sales],
        ['cmd', evalCmd('50000003')], ['out', warehouse],
      ]);
      return terminal({
        id: '04-evaluate',
        alt: 'Terminal with three curl commands that evaluate the path O-S-P from the units 50000001, 50000002 and 50000003: the first answer lists 9 objects, three units in step 1, three positions in step 2 and three persons in step 3 (callout 8), the second lists 5 objects and the third 3 objects',
        lines: t.lines,
        marksOf: [[t.at[1], 8, t.count(1)]],
      });
    })(),
    (() => {
      const t = build([
        ['cmd', 'curl -s -i --json @http/position.json http://localhost:4004/odata/v4/org/Objects | grep -E "^(HTTP|sap-messages)"'],
        ['out', 'HTTP/1.1 201 Created'],
        ['cmd', 'curl -s -i --json @http/sales.json http://localhost:4004/odata/v4/org/Relationships | grep -E "^(HTTP|sap-messages)"'],
        ['out', 'HTTP/1.1 201 Created'],
        ['out', 'sap-messages: [{"code":"","message":"Relationship A003 was stored with its inverse B003","numericSeverity":2}]'],
      ]);
      return terminal({
        id: '05-position-added',
        alt: 'Terminal with two curl commands: the first posts the new position 51000004 and is answered with HTTP/1.1 201 Created (callout 9), the second posts the relationship A003 from that position to Sales and is answered with HTTP/1.1 201 Created and an sap-messages header that says relationship A003 was stored with its inverse B003 (callout 10)',
        lines: t.lines,
        marksOf: [[t.at[1], 9], [t.at[3], 10, t.count(3) + t.count(4)]],
      });
    })(),
    (() => {
      const t = build([
        ['cmd', 'curl -s -w "\\nHTTP %{http_code}\\n" --json @http/second-chief.json http://localhost:4004/odata/v4/org/Relationships'],
        ['out', '{"error":{"message":"Unit 50000002 already has the chief position 51000001","code":"400","@Common.numericSeverity":4}}', 'danger'],
        ['out', 'HTTP 400', 'danger'],
        ['cmd', 'curl -s -w "\\nHTTP %{http_code}\\n" --json @http/loop.json http://localhost:4004/odata/v4/org/Relationships'],
        ['out', '{"error":{"message":"Unit 50000001 cannot report to 50000003, which is not above it","code":"400","@Common.numericSeverity":4}}', 'danger'],
        ['out', 'HTTP 400', 'danger'],
      ]);
      return terminal({
        id: '06-rules-reject',
        alt: 'Terminal with two curl commands that post a relationship the model refuses: a second chief position for Sales is answered with the message Unit 50000002 already has the chief position 51000001 and HTTP 400 (callout 11), and a unit that would report to a unit below it is answered with the message Unit 50000001 cannot report to 50000003, which is not above it and HTTP 400 (callout 12)',
        lines: t.lines,
        marksOf: [[t.at[1], 11, t.count(1) + t.count(2)], [t.at[4], 12, t.count(4) + t.count(5)]],
      });
    })(),
    (() => {
      const op = objectPage();
      const list = mark(op.table, 16);
      return {
        id: '07-object-page', width: FW, height: op.h, theme: 'sap-fiori',
        alt: 'Fiori elements object page of the organizational unit Sales with the tabs General and Relationships: the table Relationships (5) lists A002 Reports to Example Trading Co., three B003 Incorporates rows for the positions Sales Manager, Sales Clerk and Sales Assistant and B012 Is managed by Sales Manager; callout 16 marks the table',
        nodes: fioriShell({ h: op.h, title: 'Object', back: true, children: [...op.nodes, ...list] }),
      };
    })(),
    (() => {
      const p = treePage();
      return {
        id: '08-result', width: FW, height: p.h, theme: 'browser',
        alt: 'Browser page Organizational structure that draws the tree of the unit Example Trading Co.: the unit Sales with its chief position Sales Manager held by Ana Torres, the position Sales Clerk held by Ben Okoye and the position Sales Assistant marked vacant, and the unit Warehouse with the position Warehouse Clerk held by Chloe Martin',
        nodes: p.nodes,
      };
    })(),
  ],
};
