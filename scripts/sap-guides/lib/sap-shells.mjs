// Reusable figure fragments for the SAP guides: the product shells (Fiori elements list report and object page, the UI5 app
// frame, VS Code with explorer, editor and terminal, a browser showing an OData response, a plain terminal) and the
// screens that several figures share. Everything returns plain node data for the shared renderer, so a spec stays data
// and a screen map and the step figures of one screen cannot drift apart. Colours are token names only.
//
// No SAP logos: the shell bar shows a neutral placeholder mark (a rounded square with the generic "apps" glyph), and
// product names appear as text only where the real screen shows them. The sample data is the lab's own (the `Claims`
// entity of modules/ROOT/examples/sap-lab/expenses), never a real user, host or tenant.
//
// Geometry: every figure is FW (1080) px wide, the widest the library accepts (12px text is 10px at width=900).
// Screens are redrawn, not copied: a region is simplified to what its step needs.
import { textWidth } from '../../figure-lib/text.mjs';
import { FW, lbl, box, rule, btn, ico, mark, marks, menu, legend, legendHeight } from '../../monitoring-guides/lib/shells.mjs';

export { FW, lbl, box, rule, btn, ico, mark, marks, menu, legend, legendHeight };

// ================================================================ Fiori (Horizon, light)
// The shell bar as the lab's Fiori elements preview draws it: an optional back arrow, the placeholder mark, the title of the
// preview ("Preview – List of ExpenseService.Claims" on the list report, "Claim" on an object page) and the user disc. Page
// content starts at y = 52 (the measured bar height).
export function fioriShell({ h, title = 'Preview – List of ExpenseService.Claims', back = false, children = [] }) {
  const mx = back ? 44 : 12;
  const inner = [
    box(0, 0, FW, 52, { fill: 'headerBg', stroke: 'border' }),
    ...(back ? [ico(16, 18, 'chevronLeft', 'text')] : []),
    box(mx, 10, 32, 32, { fill: 'surfaceRaised', radius: 8 }),
    ico(mx + 8, 18, 'apps', 'textMuted'),
    lbl(mx + 44, 31, title, { size: 'title', weight: 600, box: 560 }),
    box(FW - 44, 10, 32, 32, { fill: 'surfaceRaised', radius: 16 }),
    lbl(FW - 28, 31, 'DU', { size: 'small', weight: 600, anchor: 'middle', tone: 'textMuted' }),
    ...children,
  ];
  return [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: inner }];
}

const CLAIM_ROWS = [['Train ticket', 'N', '45.50']];

// The Fiori elements list report of the lab app (columns Title, Status and Amount, as the labels of the annotations give them).
// `filter` fills the search field; `selectedRow` highlights a row. Returns { nodes, geo, height } with the boxes a step marks.
const CLAIM_COLUMNS = [{ title: 'Title', w: 4 }, { title: 'Status', w: 2 }, { title: 'Amount', w: 2 }];
// Options: `entity` (the plural in the table title), `columns` ({ title, w }), `editing` (the Editing Status filter that draft-enabled
// entities get) and `create` (the Create button, which only draft-enabled entities get).
export function fioriListReport({ y = 52, rows = CLAIM_ROWS, filter, selectedRow, entity = 'Claims', columns = CLAIM_COLUMNS, editing = true, create = true, del = true } = {}) {
  const geo = {};
  const n = [];
  n.push(lbl(24, y + 44, 'Standard', { size: 'heading', weight: 600, tone: 'link', box: 300 }));
  geo.variant = { x: 20, y: y + 20, w: 140, h: 36 };
  // filter bar
  n.push(box(16, y + 68, FW - 32, 96, { fill: 'surface', stroke: 'border', radius: 12 }));
  n.push({ block: 'field', x: 32, y: y + 80, w: 340, label: 'Search', ...(filter ? { value: filter } : { placeholder: 'Search' }) });
  geo.search = { x: 32, y: y + 100, w: 340, h: 36 };
  if (editing) n.push({ block: 'dropdown', x: 392, y: y + 80, w: 200, label: 'Editing Status', value: 'All' });
  geo.editing = { x: 392, y: y + 100, w: 200, h: 36 };
  n.push(btn(FW - 288, y + 100, 80, 'Go', 'primary'));
  geo.go = { x: FW - 288, y: y + 100, w: 80, h: 36 };
  n.push(btn(FW - 200, y + 100, 168, 'Adapt Filters'));
  geo.adapt = { x: FW - 200, y: y + 100, w: 168, h: 36 };
  // table
  const ty = y + 184;
  n.push(box(16, ty, FW - 32, 52 + (rows.length + 1) * 44 + 12, { fill: 'surface', stroke: 'border', radius: 12 }));
  n.push(lbl(32, ty + 34, `${entity} (${rows.length})`, { size: 'title', weight: 600, box: 240 }));
  if (create) n.push(btn(FW - 232, ty + 10, 90, 'Create', 'secondary'));
  geo.create = { x: FW - 232, y: ty + 10, w: 90, h: 36 };
  if (del) n.push(btn(FW - 134, ty + 10, 90, 'Delete', 'secondary'));
  geo.delete = { x: FW - 134, y: ty + 10, w: 90, h: 36 };
  n.push({ block: 'table', x: 24, y: ty + 52, w: FW - 48, columns, rows, rowHeight: 44, selectedRow });
  geo.row = rows.map((_, i) => ({ x: 24, y: ty + 96 + i * 44, w: FW - 48, h: 44 }));
  geo.tableTop = ty;
  return { nodes: n, geo, height: ty + 52 + (rows.length + 1) * 44 + 12 + 16 };
}

// The Fiori elements object page of a claim as the lab preview draws it. `mode`: 'display' (Edit and Delete in the header, tabs
// General and Administration), 'edit' (a draft: a Draft marker, an extra Header tab and section, a footer with Save and Discard
// Draft) or 'create' (like edit, the footer button reads Create). `footerNote` is the text left of the footer buttons.
export function fioriObjectPage({ y = 52, title = 'Train ticket', mode = 'display', status = 'N', amount = '45.50', footerNote } = {}) {
  const geo = {};
  const n = [];
  const edit = mode !== 'display';
  n.push(box(0, y, FW, 120, { fill: 'surface', stroke: 'border' }));
  n.push(lbl(24, y + 38, title, { size: 'heading', weight: 600, box: 520 }));
  if (mode === 'edit') {
    const dx = 24 + Math.ceil(textWidth(title, 24)) + 16;
    n.push(lbl(dx, y + 36, 'Draft', { size: 'small', tone: 'link', box: 60 }), ico(dx + 40, y + 24, 'chevronDown', 'link'));
    geo.draft = { x: dx - 6, y: y + 20, w: 66, h: 24 };
  }
  if (!edit) {
    n.push(btn(FW - 200, y + 20, 80, 'Edit', 'primary'));
    geo.edit = { x: FW - 200, y: y + 20, w: 80, h: 36 };
    n.push(btn(FW - 112, y + 20, 88, 'Delete'));
    geo.delete = { x: FW - 112, y: y + 20, w: 88, h: 36 };
  }
  const tabs = edit ? ['Header', 'General', 'Administration'] : ['General', 'Administration'];
  n.push({ block: 'tabs', x: 16, y: y + 84, w: 420, tabs, active: 0 });
  geo.tabs = { x: 16, y: y + 84, w: tabs.length * 100 + (edit ? 40 : 20), h: 32 };
  let cy = y + 136;
  const labelled = (x, cyy, label, value, input) => [
    lbl(x, cyy, label, { size: 'small', tone: 'textMuted', box: 200 }),
    ...(input ? [box(x, cyy + 8, 200, 30, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), lbl(x + 8, cyy + 28, value, { size: 'small', weight: 500, box: 184, anchor: 'start' })] : [lbl(x, cyy + 24, value, { size: 'small', weight: 600, box: 220 })]),
  ];
  if (edit) {
    n.push(lbl(24, cy + 22, 'Header', { size: 'title', weight: 600, box: 240 }), box(16, cy + 36, FW - 32, 104, { fill: 'surface', stroke: 'border', radius: 12 }), lbl(32, cy + 62, 'Object Information', { size: 'small', weight: 600, box: 240 }), ...labelled(32, cy + 88, 'Title:', title, true));
    geo.header = { x: 16, y: cy + 36, w: FW - 32, h: 104 };
    cy += 160;
  }
  n.push(lbl(24, cy + 22, 'General', { size: 'title', weight: 600, box: 240 }), box(16, cy + 36, FW - 32, 96, { fill: 'surface', stroke: 'border', radius: 12 }));
  n.push(...labelled(32, cy + 62, 'Title:', title, edit), ...labelled(272, cy + 62, 'Status:', status, edit), ...labelled(512, cy + 62, 'Amount:', amount, edit));
  geo.general = { x: 16, y: cy + 36, w: FW - 32, h: 96 };
  geo.fields = { x: 32, y: cy + 48, w: 700, h: 64 };
  geo.status = { x: 272, y: cy + 70, w: 200, h: 30 };
  geo.amount = { x: 512, y: cy + 70, w: 200, h: 30 };
  cy += 152;
  n.push(lbl(24, cy + 22, 'Administration', { size: 'title', weight: 600, box: 240 }), box(16, cy + 36, FW - 32, 96, { fill: 'surface', stroke: 'border', radius: 12 }));
  [['Created On:', 'Nov 13, 2026, 7:03:02 PM'], ['Created By:', 'anonymous'], ['Changed On:', 'Nov 13, 2026, 7:03:02 PM'], ['Changed By:', 'anonymous']].forEach(([l, v], i) => n.push(lbl(32 + i * 240, cy + 66, l, { size: 'small', tone: 'textMuted', box: 220 }), lbl(32 + i * 240, cy + 90, v, { size: 'small', weight: 600, box: 220 })));
  geo.admin = { x: 16, y: cy + 36, w: FW - 32, h: 96 };
  cy += 152;
  if (edit) {
    n.push(box(0, cy, FW, 56, { fill: 'surface', stroke: 'border' }));
    if (footerNote) n.push(lbl(FW - 330, cy + 33, footerNote, { size: 'small', tone: 'textMuted', anchor: 'end', box: 160 }));
    const primary = mode === 'create' ? 'Create' : 'Save';
    n.push(btn(FW - 300, cy + 10, 88, primary, 'primary'), btn(FW - 204, cy + 10, 180, 'Discard Draft'));
    geo.save = { x: FW - 300, y: cy + 10, w: 88, h: 36 };
    geo.discard = { x: FW - 204, y: cy + 10, w: 180, h: 36 };
    cy += 56;
  }
  return { nodes: n, geo, height: cy + 16 };
}

// The value help dialog of a field (the lab preview opens it from the icon in the field): title, search, Go, the table of the
// value list and Cancel. Drawn over the page, so pass it as children of the shell. `rows` are [code, name].
export function fioriValueHelp({ x = 120, y = 70, w = FW - 240, title = 'Select: Status', columns = ['code', 'name'], rows = [] } = {}) {
  const h = 232 + rows.length * 36;
  const geo = { row: rows.map((_, i) => ({ x: x + 24, y: y + 168 + i * 36, w: w - 48, h: 36 })), cancel: { x: x + w - 120, y: y + h - 52, w: 96, h: 36 } };
  const nodes = [
    box(x, y, w, h, { fill: 'surface', stroke: 'borderStrong', radius: 16 }),
    lbl(x + 24, y + 34, title, { size: 'title', weight: 600, box: 400 }),
    { block: 'field', x: x + 24, y: y + 52, w: 360, placeholder: 'Search' },
    btn(x + w - 232, y + 72, 80, 'Go', 'primary'),
    btn(x + w - 144, y + 72, 120, 'Show Filters'),
    lbl(x + 24, y + 124, `Items (${rows.length})`, { size: 'small', weight: 600, box: 200 }),
    { block: 'table', x: x + 24, y: y + 132, w: w - 48, columns: columns.map((c) => ({ title: c, w: 1 })), rows, rowHeight: 36 },
    btn(x + w - 120, y + h - 52, 96, 'Cancel'),
  ];
  return { nodes, geo, height: y + h };
}

// A freely built UI5 app (the guide "First SAPUI5 app"): shell bar, a page title, a toolbar with a button and a list of items.
export function ui5AppFrame({ h = 420, title = 'Expenses', items = ['Train ticket'], children = [] }) {
  const geo = { list: { x: 24, y: 136, w: FW - 48, h: 44 * items.length } };
  const n = [
    ...fioriShell({ h, title, children: [] }).flatMap((w) => w.children),
    lbl(24, 92, 'Claims', { size: 'heading', weight: 600, box: 400 }),
    btn(FW - 136, 64, 112, 'Add claim', 'primary'),
    box(24, 136, FW - 48, 44 * items.length, { fill: 'surface', stroke: 'border', radius: 12 }),
    ...items.flatMap((it, i) => [lbl(44, 164 + i * 44, it, { box: FW - 120 }), ...(i < items.length - 1 ? [rule(24, 180 + i * 44, FW - 48)] : [])]),
    ...children,
  ];
  geo.add = { x: FW - 136, y: 64, w: 112, h: 36 };
  return { nodes: [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: n }], geo };
}

// ================================================================ VS Code (Dark Modern)
// Explorer entries are { label, indent, folder, open, active }. Geometry of the regions is returned in `geo`.
export function vscodeShell({ h = 600, title = 'expenses', explorer = [], tabs = ['expense-service.cds'], activeTab = 0, code = [], terminal, children = [] }) {
  const geo = {};
  const TB = 30, AB = 48, SB = 300, ST = 24;
  const termH = terminal ? 180 : 0;
  const edX = AB + SB, edW = FW - edX, edY = TB + 35;
  const n = [
    box(0, 0, FW, TB, { fill: 'headerBg', stroke: 'border' }),
    lbl(FW / 2, 20, title, { size: 'small', tone: 'textMuted', anchor: 'middle', box: 400 }),
    box(0, TB, AB, h - TB - ST, { fill: 'surface', stroke: 'border' }),
    ico(16, TB + 16, 'folder', 'text'), ico(16, TB + 64, 'search', 'textMuted'), ico(16, TB + 112, 'bug', 'textMuted'), ico(16, TB + 160, 'apps', 'textMuted'),
    box(AB, TB, SB, h - TB - ST, { fill: 'navBg', stroke: 'border' }),
    lbl(AB + 20, TB + 24, 'EXPLORER', { size: 'small', tone: 'textMuted', box: 200 }),
  ];
  geo.explorer = { x: AB, y: TB, w: SB, h: h - TB - ST };
  explorer.forEach((e, i) => {
    const ey = TB + 40 + i * 24;
    if (e.active) n.push(box(AB, ey, SB, 24, { fill: 'navActiveBg' }));
    const ix = AB + 14 + (e.indent ?? 0) * 14;
    if (e.folder) n.push(ico(ix, ey + 4, e.open ? 'chevronDown' : 'chevronRight', 'textMuted'));
    n.push(lbl(ix + 20, ey + 17, e.label, { size: 'small', tone: 'navText', box: SB - (ix - AB) - 28 }));
    geo[`entry:${e.label}`] = { x: AB, y: ey, w: SB, h: 24 };
  });
  // tabs
  n.push(box(edX, TB, edW, 35, { fill: 'surface', stroke: 'border' }));
  let tx = edX;
  tabs.forEach((t, i) => {
    const tw = Math.ceil(textWidth(t, 12)) + 36;
    n.push(box(tx, TB, tw, 35, { fill: i === activeTab ? 'canvas' : 'surface', stroke: 'border' }));
    if (i === activeTab) n.push(box(tx, TB, tw, 2, { fill: 'tabActive' }));
    n.push(lbl(tx + 14, TB + 22, t, { size: 'small', tone: i === activeTab ? 'textStrong' : 'textMuted', box: tw - 20 }));
    geo[`tab:${t}`] = { x: tx, y: TB, w: tw, h: 35 };
    tx += tw;
  });
  const codeH = h - edY - ST - termH;
  n.push(box(edX, edY, edW, codeH, { fill: 'canvas' }));
  if (code.length) n.push({ block: 'queryEditor', x: edX + 8, y: edY + 8, w: edW - 16, h: Math.min(codeH - 16, 22 + code.length * 19 + 8), lines: code });
  geo.editor = { x: edX, y: edY, w: edW, h: codeH };
  if (terminal) {
    const ty = h - ST - termH;
    n.push(box(edX, ty, edW, termH, { fill: 'surface', stroke: 'border' }));
    n.push(lbl(edX + 16, ty + 22, 'TERMINAL', { size: 'small', weight: 600, tone: 'text', box: 120 }));
    n.push(box(edX + 16, ty + 28, 66, 2, { fill: 'tabActive' }));
    terminal.forEach((ln, i) => n.push(lbl(edX + 16, ty + 52 + i * 19, ln.str ?? ln, { size: 'small', mono: true, tone: ln.tone ?? 'text', box: edW - 32 })));
    geo.terminal = { x: edX, y: ty, w: edW, h: termH };
  }
  n.push(box(0, h - ST, FW, ST, { fill: 'headerBg', stroke: 'border' }), lbl(12, h - 8, 'main', { size: 'small', tone: 'text', box: 120 }));
  return { nodes: [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [...n, ...children] }], geo };
}

// ================================================================ ABAP source as editor runs
// Splits one line of ABAP into the runs that the VS Code editor block draws: keywords (the ABAP words below, any case),
// strings (`text`, 'text' and |templates|) and numbers. The word list is for the lab listings, not a full grammar.
const ABAP_WORDS = new Set(['EMPTY', 'STANDARD', 'EXPORTING', 'TYPES', 'CLASS', 'DEFINITION', 'IMPLEMENTATION', 'PUBLIC', 'FINAL', 'CREATE', 'SECTION', 'PRIVATE', 'PROTECTED', 'METHODS', 'METHOD', 'ENDMETHOD', 'ENDCLASS', 'DATA', 'TYPE', 'VALUE', 'WRITE', 'REPORT', 'START-OF-SELECTION', 'NEW', 'IF', 'ELSE', 'ENDIF', 'RETURNING', 'IMPORTING', 'LOOP', 'AT', 'ENDLOOP', 'INTO', 'RAISE', 'EXCEPTION', 'TRY', 'CATCH', 'ENDTRY', 'FOR', 'TESTING', 'DURATION', 'SHORT', 'RISK', 'LEVEL', 'HARMLESS', 'INTERFACE', 'ENDINTERFACE', 'INTERFACES', 'CONSTANTS', 'READ', 'TABLE', 'WITH', 'KEY']);
const CDS_WORDS = new Set(['using', 'from', 'namespace', 'entity', 'service', 'as', 'projection', 'on', 'select', 'where', 'aspect', 'type', 'key', 'default', 'action', 'function', 'returns', 'annotate', 'with', 'extend', 'context', 'virtual', 'localized', 'Composition', 'Association', 'to', 'many', 'one', 'of']);
// Splits one line of source into editor runs: words of `words` (case-insensitive when `fold`), strings and numbers.
function sourceRuns(line, words, fold, stringRe) {
  const runs = [];
  const re = new RegExp(`${stringRe}|([A-Za-z_][\\w-]*)|(\\d+)|(\\s+)|(.)`, 'g');
  for (const m of line.matchAll(re)) {
    if (m[1]) runs.push({ t: m[0], kind: 'string' });
    else if (m[2] && words.has(fold ? m[2].toUpperCase() : m[2])) runs.push({ t: m[0], kind: 'keyword' });
    else if (m[3]) runs.push({ t: m[0], kind: 'number' });
    else runs.push({ t: m[0] });
  }
  return runs;
}
export const abapRuns = (line) => sourceRuns(line, ABAP_WORDS, true, '(\\|[^|]*\\||`[^`]*`|\'[^\']*\')');
export const cdsRuns = (line) => sourceRuns(line, CDS_WORDS, false, '(\'[^\']*\')');
export const abapCode = (text) => text.replace(/\n$/, '').split('\n').map((l) => abapRuns(l));
export const cdsCode = (text) => text.replace(/\n$/, '').split('\n').map((l) => cdsRuns(l));
// Selects regions of a lab file the way the page's include does. `// tag::x[]` and `// end::x[]` comment lines delimit a region.
// { drop: ['x'] } keeps everything except the region x (include tags=**;!x); { only: ['x'] } keeps only that region (include tag=x);
// { lines: [1, 1] } keeps a line range (include lines=1..1, first and last line numbers). The marker lines never remain.
export function labText(text, { drop = [], only = null, lines = null } = {}) {
  const all = text.replace(/\n$/, '').split('\n');
  if (lines) return all.slice(lines[0] - 1, lines[1]).join('\n');
  const out = [];
  let skip = null;
  let current = null;
  for (const l of all) {
    const m = l.match(/\/\/ (tag|end)::([a-z-]+)\[\]/);
    if (m) {
      if (m[1] === 'tag') { if (drop.includes(m[2])) skip = m[2]; current = m[2]; } else { if (skip === m[2]) skip = null; current = null; }
      continue;
    }
    if (skip) continue;
    if (only && !(current && only.includes(current))) continue;
    out.push(l);
  }
  return out.join('\n');
}
// Plain text lines (CSV, JSON, XML): no highlighting.
export const plainCode = (text) => text.replace(/\n$/, '').split('\n').map((l) => [{ t: l }]);

// ================================================================ Browser with an OData response
// `lines` are code runs for the page body (JSON or XML text); the address bar holds a local URL only.
export function browserShell({ h = 380, url = 'localhost:4004/odata/v4/expense/Claims', tab = 'Claims', lines = [], children = [] }) {
  const geo = { address: { x: 76, y: 44, w: FW - 152, h: 32 }, page: { x: 0, y: 92, w: FW, h: h - 92 } };
  const tw = Math.ceil(textWidth(tab, 12)) + 48;
  const n = [
    box(0, 0, FW, 92, { fill: 'headerBg', stroke: 'border' }),
    box(12, 8, tw, 34, { fill: 'canvas', stroke: 'border', radius: 8 }),
    lbl(26, 29, tab, { size: 'small', box: tw - 24 }),
    ico(16, 52, 'chevronRight', 'textMuted'), ico(44, 52, 'refresh', 'textMuted'),
    box(76, 44, FW - 152, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 16 }),
    lbl(96, 64, url, { size: 'small', mono: true, box: FW - 192 }),
    box(0, 92, FW, h - 92, { fill: 'canvas' }),
  ];
  if (lines.length) n.push({ block: 'queryEditor', x: 16, y: 104, w: FW - 32, h: Math.min(h - 120, 22 + lines.length * 19 + 8), lines, lineNumbers: false });
  return { nodes: [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [...n, ...children] }], geo };
}

// ================================================================ Terminal
// `lines` are strings or { str, tone }; a prompt line starts with "$ ".
export function terminalShell({ h = 300, title = 'Terminal', lines = [], children = [] }) {
  const geo = { body: { x: 0, y: 32, w: FW, h: h - 32 } };
  const n = [
    box(0, 0, FW, 32, { fill: 'headerBg', stroke: 'border' }),
    lbl(FW / 2, 21, title, { size: 'small', tone: 'textMuted', anchor: 'middle', box: 400 }),
    box(0, 32, FW, h - 32, { fill: 'canvas' }),
    ...lines.map((ln, i) => lbl(16, 62 + i * 21, ln.str ?? ln, { size: 'body', mono: true, tone: ln.tone ?? 'text', box: FW - 32 })),
  ];
  geo.line = (i) => ({ x: 8, y: 46 + i * 21, w: FW - 16, h: 21 });
  return { nodes: [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [...n, ...children] }], geo };
}
