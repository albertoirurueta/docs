// Figures of the Kibana guide K9, "ES|QL panels and variable controls" (guide-esql-panels-and-variable-controls.adoc).
// Facts: guides-brief/kibana-facts.md sections 5 and 6 (Kibana 9.5.6). Verified there: the dashboard toolbars, the Add to
// dashboard flyout with its entries Visualization (query) and, under Controls, Variable control. NOT VERIFIED there (drawn
// generically, with the words of the Elastic pages "Lens visualizations using ES|QL queries" and "Add variable controls"):
// the ES|QL panel editor (query editor, run, Suggestions, Apply and close), the autocomplete entry Create control, the
// variable control flyout and the placement of the controls on the dashboard. Callout numbers are the step numbers of the
// page; a figure shows the screen as the step starts, with the control to act on highlighted.
import { FW, lbl, box, btn, mark, marks, menu, kibanaFrame, kFilterRow, kDash } from '../lib/shells.mjs';

const figures = [];
const H = 640;

// ---------------------------------------------------------------- ES|QL text as the editor shows it
const TOKEN = /(\?{1,2}[A-Za-z_]+|"[^"]*"|\b(?:FROM|WHERE|STATS|BY|SORT|AND|COUNT|BUCKET|MV_INTERSECTS)\b|\b\d+\b)/g;
function runs(line) {
  const out = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN)) {
    if (m.index > last) out.push({ t: line.slice(last, m.index) });
    const t = m[0];
    out.push({ t, kind: t.startsWith('?') ? 'label' : t.startsWith('"') ? 'string' : /^\d+$/.test(t) ? 'number' : 'keyword' });
    last = m.index + t.length;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  return out;
}
const Q_FROM = 'FROM logs-generic.otel-default';
const Q_WHERE = '| WHERE @timestamp >= ?_tstart AND @timestamp < ?_tend';
const Q1 = [Q_FROM, Q_WHERE, '| STATS requests = COUNT(*) BY bucket = BUCKET(@timestamp, 50, ?_tstart, ?_tend)', '| SORT bucket'];
const STATS2 = ['| STATS requests = COUNT(*)', '    BY bucket = BUCKET(@timestamp, 50, ?_tstart, ?_tend), status = attributes.status'];
const Q2 = [Q_FROM, Q_WHERE, ...STATS2, '| SORT bucket'];
const Q3 = [Q_FROM, Q_WHERE, '    AND severity_text == ?severity', ...STATS2, '| SORT bucket'];
const Q4 = [Q_FROM, Q_WHERE, '    AND severity_text == ?severity', '    AND MV_INTERSECTS(attributes.uri, ?uri)', ...STATS2, '| SORT bucket'];

const sample = (base, wob) => base.map((v, i) => Math.round((v + wob[i % wob.length]) * 10) / 10);
const WOB = [0.6, -0.4, 0.3, -0.2, 0.5, -0.5, 0.2, -0.3, 0.4, -0.1, 0.3, -0.4];
const LINES = [{ name: '200', points: sample([8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2], WOB) }, { name: '404', points: sample([1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3], WOB) }];
const ONE = [{ name: 'requests', points: sample([9.3, 10.0, 9.1, 10.2, 9.6, 10.3, 9.4, 10.0, 9.7, 9.8, 9.9, 9.5], WOB) }];
const X = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'];
const lineChart = (x, y, w, h, series) => ({ block: 'line', x, y, w, h, series, min: 0, max: 12, yLabels: ['0', '3', '6', '9', '12'], xLabels: X });

// ---------------------------------------------------------------- the ES|QL panel editor, drawn generically
// `query`: the lines; `popup`: autocomplete entries (the last is Create control), `suggest`: the Suggestions cards,
// `chart`: series or none, `side`: nodes drawn over the right part (the control flyout).
const F = { x: 120, y: 96, w: 944, h: 544 };
function editor({ query, chart, popup, suggest = false, apply = false, children, side }) {
  const fr = kibanaFrame({ h: H, crumbs: ['Dashboards', 'Editing Bookshelf (guides)'], actions: [{ label: 'Exit edit', w: 100 }, { label: 'Add', w: 84, icon: 'plus' }, { label: 'More', w: 80 }, { label: 'Save', kind: 'primary', w: 80 }] });
  const geo = { ...fr.geo };
  const n = [...kFilterRow({}).nodes];
  n.push({ block: 'flyout', x: F.x, y: F.y, w: F.w, h: F.h, title: 'Visualization (query)' });
  const ex = 140, ew = 904, ey = 148, eh = 30 + query.length * 20;
  n.push({ block: 'queryEditor', x: ex, y: ey, w: ew, h: eh, lines: query.map(runs), lineNumbers: true });
  geo.editor = { x: ex, y: ey, w: ew, h: eh };
  geo.run = { x: ex + ew - 44, y: ey + eh - 40, w: 36, h: 32 };
  n.push(btn(geo.run.x, geo.run.y, 36, '', 'primary', 'play'));
  const cy = 336;
  if (chart) n.push(lineChart(ex, cy, 640, 190, chart));
  else n.push(box(ex, cy, 640, 190, { fill: 'canvas', stroke: 'border', radius: 6 }), lbl(ex + 320, cy + 100, 'Run the query to draw a chart', { tone: 'textMuted', anchor: 'middle', box: 400 }));
  // suggestions
  if (chart) n.push(lbl(800, cy + 14, 'Suggestions', { weight: 600, box: 200 }));
  geo.suggest = [];
  if (chart) ['Line', 'Bar', 'Table'].forEach((t, i) => {
    const bx = 800 + (i % 2) * 124, by = cy + 26 + Math.floor(i / 2) * 84;
    n.push(box(bx, by, 116, 76, { fill: 'surface', stroke: i === 0 ? 'primary' : 'border', radius: 6 }));
    if (suggest) n.push({ block: 'line', x: bx + 6, y: by + 4, w: 104, h: 50, series: i === 0 ? LINES : ONE, min: 0, max: 12, yLabels: ['', ''], legend: false });
    n.push(lbl(bx + 58, by + 68, t, { size: 'small', tone: 'textMuted', anchor: 'middle', box: 100 }));
    geo.suggest.push({ x: bx, y: by, w: 116, h: 76 });
  });
  n.push(btn(F.x + F.w - 16 - 130 - 8 - 90, 596, 90, 'Cancel'));
  geo.apply = { x: F.x + F.w - 16 - 130, y: 596, w: 130, h: 32 };
  n.push(btn(geo.apply.x, geo.apply.y, 130, 'Apply and close', 'primary'));
  if (popup) {
    const m = menu({ x: 330, y: ey + eh + 4, w: 220, items: popup, hot: popup.length - 1 });
    n.push(...m.nodes);
    geo.popupRows = m.rows;
  }
  if (side) n.push(...side(geo));
  void apply;
  const extra = typeof children === 'function' ? children(geo) : children ?? [];
  fr.nodes[0].children.push(...n, ...extra);
  return { nodes: fr.nodes, geo };
}

// The flyout of a variable control, drawn generically: type, values or query, variable name, label, selection.
function controlFlyout(kind) {
  const x = 704, w = 360, ix = x + 16, iw = w - 32;
  const n = [{ block: 'flyout', x, y: 96, w, h: 544, title: 'Variable control' }];
  const geo = {};
  n.push({ block: 'dropdown', x: ix, y: 154, w: iw, label: 'Control type', value: kind === 'static' ? 'Static values' : 'Values from a query' });
  geo.type = { x: ix, y: 174, w: iw, h: 32 };
  if (kind === 'static') {
    n.push(lbl(ix, 236, 'Values', { size: 'small', weight: 500, box: iw }));
    n.push(box(ix, 244, iw, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }));
    n.push({ block: 'chip', x: ix + 8, y: 253, str: 'INFO' }, { block: 'chip', x: ix + 66, y: 253, str: 'ERROR' });
    geo.values = { x: ix, y: 244, w: iw, h: 40 };
    n.push({ block: 'field', x: ix, y: 300, w: iw, label: 'Variable name', value: '?severity' });
    geo.name = { x: ix, y: 320, w: iw, h: 32 };
    n.push({ block: 'field', x: ix, y: 370, w: iw, label: 'Label', value: 'Severity' });
    n.push({ block: 'toggle', x: ix, y: 432, label: 'Allow multiple selections', on: false, box: 240 });
  } else {
    n.push(lbl(ix, 236, 'Query', { size: 'small', weight: 500, box: iw }));
    const q = [Q_FROM, '| WHERE @timestamp <= ?_tend', '    AND @timestamp > ?_tstart', '    AND severity_text == ?severity', '| STATS BY attributes.uri'];
    n.push({ block: 'queryEditor', x: ix, y: 244, w: iw, h: 30 + q.length * 20, lines: q.map(runs), lineNumbers: false });
    geo.query = { x: ix, y: 244, w: iw, h: 30 + q.length * 20 };
    n.push({ block: 'field', x: ix, y: 386, w: iw, label: 'Variable name', value: '?uri' });
    geo.name = { x: ix, y: 406, w: iw, h: 32 };
    n.push({ block: 'field', x: ix, y: 456, w: iw, label: 'Label', value: 'URI' });
    n.push({ block: 'toggle', x: ix, y: 526, label: 'Allow multiple selections', on: true, box: 240 });
    geo.multi = { x: ix, y: 522, w: 32 + 10 + 200, h: 26 };
  }
  geo.save = { x: x + w - 16 - 80, y: 596, w: 80, h: 32 };
  n.push(btn(x + w - 16 - 80 - 8 - 84, 596, 84, 'Cancel'), btn(geo.save.x, geo.save.y, 80, 'Save', 'primary'));
  return { nodes: n, geo };
}

// ---------------------------------------------------------------- the dashboard with the panel and its controls
function dash({ mode, controls = false, picked = false, children }) {
  const view = mode === 'view';
  const actions = view
    ? [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }]
    : [{ label: 'Exit edit', w: 100 }, { label: 'Add', w: 84, icon: 'plus' }, { label: 'More', w: 80 }, { label: 'Save', kind: 'primary', w: 80 }];
  const fr = kibanaFrame({ h: 520, crumbs: view ? ['Dashboards', 'Bookshelf (guides)'] : ['Dashboards', 'Editing Bookshelf (guides)'], actions });
  const geo = { ...fr.geo };
  const n = [...kFilterRow({}).nodes];
  let py = 152;
  if (controls) {
    n.push({ block: 'dropdown', x: 16, y: 152, w: 220, value: picked ? 'Severity: INFO' : 'Severity' });
    geo.severity = { x: 16, y: 152, w: 220, h: 32 };
    n.push({ block: 'dropdown', x: 248, y: 152, w: 300, value: picked ? 'URI: /api/search, /api/books' : 'URI' });
    geo.uri = { x: 248, y: 152, w: 300, h: 32 };
    py = 200;
  }
  n.push({ block: 'panel', x: 16, y: py, w: 700, h: 300 }, lineChart(24, py + 10, 684, 284, controls ? LINES : LINES));
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

// 01: the dashboard; Edit (step 2)
{
  const d = kDash({ h: 520, mode: 'view', title: 'Bookshelf (guides)', children: (g) => mark(g.Edit, 2) });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Kibana dashboard Bookshelf (guides) in view mode with its bar chart panel; the Edit button of the second bar is marked by callout 2',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 02: the Add flyout; Visualization (query) (steps 3 and 4)
{
  const d = kDash({ h: 520, mode: 'add', title: 'Bookshelf (guides)', children: (g) => marks([[g.Add, 3], [{ x: 712, y: 314, w: 344, h: 52 }, 4]]) });
  figures.push({
    id: '02-add-visualization-query',
    alt: 'Dashboard in edit mode with the Add to dashboard flyout open: the Add button of the second bar is marked by callout 3 and the entry Visualization (query), which builds charts with ES|QL, by callout 4',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 03: the query typed; run (steps 5 and 6)
{
  const e = editor({ query: Q1, children: (g) => marks([[g.editor, 5], [g.run, 6]]) });
  figures.push({
    id: '03-first-query',
    alt: 'The ES|QL editor of the new panel with the query FROM logs-generic.otel-default, a WHERE on the dashboard time range, STATS requests = COUNT(*) by a BUCKET of @timestamp and SORT bucket (callout 5); the run button at the end of the editor is marked by callout 6',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 04: the chart; the STATS line gets status (steps 7 and 8)
{
  const e = editor({ query: Q2, chart: ONE, children: (g) => marks([[g.editor, 7], [g.run, 8]]) });
  figures.push({
    id: '04-split-by-status',
    alt: 'The ES|QL editor with the STATS command split by bucket and status = attributes.status (callout 7) above the line chart of the first query; the run button is marked by callout 8',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 05: the suggestions; line chart (step 9)
{
  const e = editor({ query: Q2, chart: LINES, suggest: true, children: (g) => mark(g.suggest[0], 9) });
  figures.push({
    id: '05-suggestions',
    alt: 'The ES|QL editor with a line chart of two series, 200 and 404, and the Suggestions cards at the right; the card of the line chart is marked by callout 9',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 06: severity_text == ?severity; Create control (steps 10 and 11)
{
  const e = editor({ query: Q3, chart: LINES, suggest: true, popup: ['?_tstart', '?_tend', 'Create control'], children: (g) => marks([[{ x: 140, y: 148 + 22 + 2 * 20 - 15, w: 904, h: 21 }, 10], [g.popupRows[2], 11]]) });
  figures.push({
    id: '06-create-control',
    alt: 'The ES|QL editor with the line AND severity_text == ?severity typed into the WHERE command (callout 10); the autocomplete list under it offers Create control, marked by callout 11',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 07: the static control (steps 12 to 15)
{
  const e = editor({ query: Q3, chart: LINES, suggest: false, side: (g) => { const c = controlFlyout('static'); g.c = c.geo; return c.nodes; }, children: (g) => marks([[g.c.type, 12], [g.c.values, 13], [g.c.name, 14], [g.c.save, 15]]) });
  figures.push({
    id: '07-static-control',
    alt: 'The variable control flyout over the ES|QL editor: the control type Static values (callout 12), the values INFO and ERROR (callout 13), the variable name ?severity (callout 14) and the label Severity; the save button is marked by callout 15',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 08: MV_INTERSECTS(attributes.uri, ?uri); Create control (steps 16 and 17)
{
  const e = editor({ query: Q4, chart: LINES, popup: ['?_tstart', '?_tend', 'Create control'], children: (g) => marks([[{ x: 140, y: 148 + 22 + 3 * 20 - 15, w: 904, h: 21 }, 16], [g.popupRows[2], 17]]) });
  figures.push({
    id: '08-create-second-control',
    alt: 'The ES|QL editor with the line AND MV_INTERSECTS(attributes.uri, ?uri) typed into the WHERE command (callout 16); the autocomplete list offers Create control, marked by callout 17',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 09: the query control, chained, multiple (steps 18 to 21)
{
  const e = editor({ query: Q4, chart: LINES, side: (g) => { const c = controlFlyout('query'); g.c = c.geo; return c.nodes; }, children: (g) => marks([[g.c.type, 18], [g.c.query, 19], [g.c.name, 20], [g.c.multi, 21], [g.c.save, 22]]) });
  figures.push({
    id: '09-query-control',
    alt: 'The variable control flyout with the control type Values from a query (callout 18) and its query, which uses ?severity (callout 19), the variable name ?uri (callout 20), the switch Allow multiple selections turned on (callout 21) and the save button (callout 22)',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 10: Apply and close (step 23)
{
  const e = editor({ query: Q4, chart: LINES, suggest: false, children: (g) => mark(g.apply, 23) });
  figures.push({
    id: '10-apply-and-close',
    alt: 'The ES|QL editor with the finished query that uses ?severity and ?uri above the line chart; the Apply and close button at the bottom is marked by callout 23',
    width: FW, height: H, nodes: e.nodes,
  });
}

// 11: the controls on the dashboard (steps 24 and 25)
{
  const d = dash({ mode: 'edit', controls: true, children: (g) => marks([[g.severity, 24], [g.uri, 25]]) });
  figures.push({
    id: '11-use-the-controls',
    alt: 'Kibana dashboard in edit mode with two controls above the line chart panel: Severity, marked by callout 24, and URI, marked by callout 25',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 12: Save and Exit edit (steps 26 and 27)
{
  const d = dash({ mode: 'edit', controls: true, picked: true, children: (g) => marks([[g.Save, 26], [g['Exit edit'], 27]]) });
  figures.push({
    id: '12-save-the-dashboard',
    alt: 'Kibana dashboard in edit mode with the controls Severity set to INFO and URI set to /api/search and /api/books; the Save button of the second bar is marked by callout 26 and the Exit edit button by callout 27',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 13: the finished dashboard (What you build)
{
  const d = dash({ mode: 'view', controls: true, picked: true });
  figures.push({
    id: '13-result',
    alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode with the controls Severity and URI above a line chart of the requests per time bucket, split by status',
    width: FW, height: 520, nodes: d.nodes,
  });
}

export default { product: 'kibana', guide: 'k9', figures };
