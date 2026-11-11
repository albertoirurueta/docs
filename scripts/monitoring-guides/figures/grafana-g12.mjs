// Figures of the Grafana guide G12, "Transformations and expressions" (guide-transformations-and-expressions.adoc).
// Facts: guides-brief/grafana-facts.md sections 6, 7 and 8 (13.3.0 panel editor, Transformations tab, the Add another transformation
// drawer, Expression types Math / Reduce / Resample / Classic condition / Threshold / SQL, Reduce expression fields Function / Input /
// Mode). NOT VERIFIED in the lab and therefore drawn generically: the settings of every transformation card (Join by field, Organize
// fields by name, Add field from calculation, Filter data by values, Group by, Reduce), the debug view, the Math and SQL expression
// cards and the field names produced by a join. Callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, menu, segmented, grafanaFrame, G_NAV_ROW, gDashToolbar, gAddPane, gPanelPane, gEditor, reqChart,
} from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

// ---- local helpers: the panel editor with a different preview, query and options pane ---------------------------------
// gEditor draws the standard 13.3 panel editor; the helpers below paint over its preview, query and right column, so
// that the shared library stays untouched. Every x, y, w, h is in the coordinates of gEditor (left column x 16..776,
// right column x 792..1064, query card from y 424).
const L = { x: 16, w: 760 }, R = { x: 792, w: 272 };
const CY = 424;

const collapsible = (x, y, w, label, open = false) => [ico(x + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(x + 32, y + 21, label, { weight: 500, box: w - 48 }), rule(x, y + 32, w)];

// Box of tab number `i` of a tab strip drawn at (16, 338).
function tabBox(labels, i, active) {
  let x = L.x;
  labels.forEach((t, k) => { if (k < i) x += Math.ceil(textWidth(t, 14, { weight: k === active ? 500 : 400 })) + 24; });
  const w = Math.ceil(textWidth(labels[i], 14, { weight: i === active ? 500 : 400 })) + 24;
  return { x: x + 4, y: 338, w: w - 8, h: 32 };
}

// The options pane of a visualization: header, Change, search and collapsible groups.
// Items: field, drop, toggle, seg, map, btn, thr (threshold rows), addbox (dashed add control), note (small text).
function pane(head, groups, { change = true } = {}) {
  const ix = R.x + 12, iw = R.w - 24;
  const nodes = [box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(R.x + 12, 124, head, { weight: 600, box: 150 })];
  if (change) nodes.push(btn(R.x + R.w - 12 - 76, 106, 76, 'Change'));
  nodes.push({ block: 'field', x: ix, y: 146, w: iw, placeholder: 'Search options' });
  const geo = {};
  let y = 190;
  for (const g of groups) {
    nodes.push(...collapsible(R.x, y, R.w, g.label, !!g.open));
    geo[g.label] = { x: R.x + 4, y, w: R.w - 8, h: 32 };
    y += 34;
    if (!g.open) continue;
    for (const it of g.items) {
      if (it.t === 'field') { nodes.push({ block: 'field', x: ix, y, w: iw, label: it.label, ...(it.value !== undefined ? { value: it.value } : { placeholder: it.placeholder ?? '' }), ...(it.mono ? { mono: true } : {}) }); geo[it.label] = { x: ix, y: y + 20, w: iw, h: 32 }; y += 58; }
      else if (it.t === 'drop') { nodes.push({ block: 'dropdown', x: ix, y, w: iw, label: it.label, value: it.value }); geo[it.label] = { x: ix, y: y + 20, w: iw, h: 32 }; y += 58; }
      else if (it.t === 'toggle') { nodes.push({ block: 'toggle', x: ix, y, label: it.label, on: !!it.on, box: iw - 44 }); geo[it.label] = { x: ix, y: y - 1, w: iw, h: 20 }; y += 30; }
      else if (it.t === 'seg') { nodes.push(lbl(ix, y + 12, it.label, { size: 'small', weight: 500, box: iw })); const s = segmented({ x: ix, y: y + 20, items: it.items, w: it.w ?? 76, active: it.active ?? 0 }); nodes.push(...s.nodes); geo[it.label] = { x: ix, y: y + 20, w: (it.w ?? 76) * it.items.length, h: 32 }; it.items.forEach((s2, k) => { geo[`${it.label}/${s2}`] = s.boxes[k]; }); y += 58; }
      else if (it.t === 'map') { nodes.push(box(ix, y, iw, 34, { fill: 'inputBg', stroke: 'border', radius: 4 }), lbl(ix + 12, y + 22, `${it.from}  →  ${it.text}`, { box: iw - 60 }), box(ix + iw - 36, y + 9, 16, 16, { fill: it.color, radius: 8 })); geo[it.key ?? it.from] = { x: ix, y, w: iw, h: 34 }; y += 42; }
      else if (it.t === 'btn') { nodes.push(btn(ix, y, iw, it.label, it.kind ?? 'secondary', it.icon)); geo[it.label] = { x: ix, y, w: iw, h: 32 }; y += 42; }
      else if (it.t === 'addbox') { nodes.push(box(ix, y, iw, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6, dash: '5 3' }), ico(ix + iw / 2 - 8, y + 8, 'plus', 'link')); geo[it.key ?? 'add'] = { x: ix, y, w: iw, h: 32 }; y += 42; }
      else if (it.t === 'thr') { it.rows.forEach(([col, val], i) => { nodes.push(box(ix, y, 24, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }), box(ix + 6, y + 10, 12, 12, { fill: col, radius: 6 }), { block: 'field', x: ix + 30, y, w: iw - 30, value: val }); geo[`thr${i}`] = { x: ix + 30, y, w: iw - 30, h: 32 }; geo[`thr${i}dot`] = { x: ix, y, w: 24, h: 32 }; y += 38; }); }
      else if (it.t === 'note') { nodes.push(lbl(ix, y + 14, it.text, { size: 'small', tone: 'textMuted', box: iw })); y += 24; }
    }
  }
  if (y > 632) throw new Error(`options pane "${head}" runs past the editor: y = ${y}`);
  return { nodes, geo, endY: y };
}

// The "All visualizations" list of the right column; `hot` is the name of the highlighted row.
const VIZ = [['Time series', 'Time based line, area and bar charts'], ['Bar chart', 'Categorical charts with group support'], ['Stat', 'Big stat values & sparklines'], ['Gauge', 'Standard gauge visualization'], ['Bar gauge', 'Horizontal and vertical gauges'], ['Table', 'Supports many column styles'], ['Pie chart', 'The new core pie chart visualization'], ['State timeline', 'State changes and durations'], ['Heatmap', 'Like a histogram over time'], ['Status history', 'Periodic status history'], ['Histogram', 'Distribution of values presented as a bar chart.'], ['Text', ''], ['Logs', ''], ['Traces', '']];
function vizList(names, hot) {
  const nodes = [box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }), { block: 'tabs', x: R.x + 4, y: 106, w: R.w - 8, tabs: ['Suggestions', 'All visualizations'], active: 1 }, { block: 'field', x: R.x + 12, y: 154, w: R.w - 24, placeholder: 'Search for...' }];
  const t1 = Math.ceil(textWidth('Suggestions', 14)) + 24, t2 = Math.ceil(textWidth('All visualizations', 14, { weight: 500 })) + 24;
  const tab = { x: R.x + 4 + t1 + 4, y: 106, w: t2 - 8, h: 32 };
  let y = 200;
  let hotBox;
  names.forEach((nm) => {
    const d = VIZ.find((v) => v[0] === nm)[1];
    const rowBox = { x: R.x + 8, y, w: R.w - 16, h: 44 };
    if (nm === hot) { nodes.push(box(rowBox.x, rowBox.y, rowBox.w, rowBox.h, { fill: 'navActiveBg', radius: 4 })); hotBox = rowBox; }
    nodes.push(lbl(R.x + 20, y + 19, nm, { weight: 500, box: R.w - 40 }));
    if (d) nodes.push(lbl(R.x + 20, y + 36, d, { size: 'small', tone: 'textMuted', box: R.w - 40 }));
    y += 48;
  });
  return { nodes, hot: hotBox, tab };
}

// The editor. o: title, ds (data source name), mode ('builder'|'code'), preview (nodes), lines (query lines, or none),
// optsRow (opened Options row), right (nodes + geo from pane/vizList), bottom ('queries'|'empty'|node list), over (nodes
// painted last, before the marks), saved, marksFn(geo, mine) returns the callouts.
function ed(o) {
  const mine = {};
  const e = gEditor({
    mode: o.mode ?? 'builder', typed: false, hasData: false, right: 'empty', title: o.title ?? 'New panel', saved: !!o.saved, crumbs: o.crumbs,
    children: (geo) => {
      const n = [];
      n.push(box(17, 124, L.w - 2, 194, { fill: 'surface' }), ...(o.preview ?? [lbl(L.x + L.w / 2, 226, 'No data', { anchor: 'middle', tone: 'textMuted' })]));
      if (o.right) n.push(...o.right.nodes);
      const bottomTabs = ['Queries 1', `Transformations ${o.transformations ?? 0}`, ...(o.saved ? ['Alert 0'] : [])];
      mine.tabs = bottomTabs;
      if (o.bottom && o.bottom !== 'queries') {
        n.push(box(L.x, 336, L.w, 298, { fill: 'canvas' }), { block: 'tabs', x: L.x, y: 338, w: L.w, tabs: bottomTabs, active: 1 });
        mine.tabTransformations = tabBox(bottomTabs, 1, 1);
        if (o.bottom === 'empty') {
          n.push(lbl(L.x + L.w / 2, 440, 'Start transforming data', { size: 'title', weight: 600, anchor: 'middle', box: 300 }));
          n.push(lbl(L.x + L.w / 2, 466, 'Transformations allow data to be changed in various ways before', { tone: 'textMuted', anchor: 'middle', box: 560 }));
          n.push(lbl(L.x + L.w / 2, 486, 'your visualization is shown.', { tone: 'textMuted', anchor: 'middle', box: 400 }));
          n.push(btn(L.x + L.w / 2 - 100, 512, 200, 'Add transformation', 'primary', 'plus'));
          mine.addTransformation = { x: L.x + L.w / 2 - 100, y: 512, w: 200, h: 32 };
        } else if (Array.isArray(o.bottom)) n.push(...o.bottom);
      } else {
        mine.tabQueries = tabBox(bottomTabs, 0, 0);
        if (o.transformations || o.saved) n.push(box(L.x, 336, L.w, 34, { fill: 'canvas' }), { block: 'tabs', x: L.x, y: 338, w: L.w, tabs: bottomTabs, active: 0 });
        if (o.ds && o.ds !== 'Prometheus') {
          n.push(box(L.x, 378, 202, 36, { fill: 'canvas' }), { block: 'dropdown', x: L.x, y: 380, w: 200, value: o.ds });
          n.push(box(L.x + 12, CY + 10, 214, 24, { fill: 'surface' }), lbl(L.x + 12, CY + 26, `A (${o.ds})`, { weight: 500, box: 200 }));
        }
        if (o.lines) {
          n.push({ block: 'queryEditor', x: L.x + 12, y: CY + 96, w: L.w - 24, h: 50, lines: o.lines, lineNumbers: true });
        }
        if (o.optsRow) {
          n.push(box(L.x + 8, CY + 148, L.w - 16, 56, { fill: 'surface' }));
          o.optsRow.forEach((d, i) => {
            n.push({ block: 'dropdown', x: L.x + 12 + i * 190, y: CY + 150, w: 170, label: d[0], value: d[1] });
            mine[d[0]] = { x: L.x + 12 + i * 190, y: CY + 170, w: 170, h: 32 };
          });
        }
      }
      if (o.over) n.push(...o.over);
      n.push(...(o.marksFn ? o.marksFn(geo, mine) : []));
      return n;
    },
  });
  return e;
}

// ---- a table panel drawn from cells ---------------------------------------------------------------------------------
// cols: [{ title, w, kind: 'text'|'num'|'link'|'thr', fmt(v), fill(v) }]; rows: arrays of cell values. Returns { nodes, hdr, xs, k }.
const defFmt = (v) => (typeof v === 'number' ? v.toFixed(1) : String(v));
function tbl({ x, y, w, cols, rows, rowH = 30 }) {
  const k = w / cols.reduce((s, c) => s + c.w, 0);
  let cx = x;
  const xs = cols.map((c) => { const p = cx; cx += c.w * k; return p; });
  const nodes = [box(x, y, w, rowH * (rows.length + 1), { fill: 'canvas', stroke: 'border', radius: 4 }), box(x + 1, y + 1, w - 2, rowH - 1, { fill: 'surfaceRaised' })];
  const hdr = [];
  cols.forEach((c, i) => {
    const cw = c.w * k;
    const right = c.kind === 'num' || c.kind === 'thr';
    nodes.push(lbl(right ? xs[i] + cw - 10 : xs[i] + 10, y + rowH / 2 + 4, c.title, { size: 'small', weight: 600, anchor: right ? 'end' : 'start', box: cw - 20 }));
    hdr.push({ x: xs[i], y, w: cw, h: rowH });
  });
  const cells = [];
  rows.forEach((r, ri) => {
    const ry = y + rowH * (ri + 1);
    nodes.push(rule(x, ry, w));
    cells.push([]);
    r.forEach((v, i) => {
      const c = cols[i], cw = c.w * k, f = c.fmt ?? defFmt;
      if (c.kind === 'thr') {
        nodes.push(box(xs[i] + 1, ry + 1, cw - 2, rowH - 1, { fill: c.fill(v) }));
        nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, f(v), { size: 'small', tone: 'canvas', weight: 500, anchor: 'end', box: cw - 20 }));
      } else if (c.kind === 'num') nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, f(v), { size: 'small', anchor: 'end', box: cw - 20 }));
      else nodes.push(lbl(xs[i] + 10, ry + rowH / 2 + 4, f(v), { size: 'small', tone: c.kind === 'link' ? 'link' : 'text', box: cw - 20 }));
      cells[ri].push({ x: xs[i], y: ry, w: cw, h: rowH });
    });
  });
  return { nodes, hdr, xs, k, cells };
}

const QA = 'sum by (uri) (rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))';
const QB1 = 'histogram_quantile(0.95, sum by (le, uri) (';
const QB2 = 'rate(http_server_requests_seconds_bucket{application="bookshelf"}[5m])))';
const QC = 'sum by (status) (rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))';
const TITLE = 'Route summary';
const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const TIME = '2026-11-11 10:16:20';
// route, requests per second, p95 latency in seconds
const R4 = [['/api/books/{id}', 2.1, 0.08], ['/api/loans', 1.0, 0.12], ['/api/books', 4.8, 0.21], ['/api/search', 1.1, 0.35]];
const f2 = (v) => v.toFixed(2);
const optsPane = (title = 'Table') => pane(title, [{ label: 'Panel options' }, { label: 'Table' }, { label: 'Standard options' }, { label: 'Thresholds' }]);
const dd = (x, y, w, label, value) => ({ block: 'dropdown', x, y, w, ...(label ? { label } : {}), value });
const card = (y, h, title) => [box(L.x, y, L.w, h, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 14, y + 26, title, { weight: 600, box: 360 })];
const rawA = () => tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Time', w: 200 }, { title: 'uri', w: 340 }, { title: 'Value #A', w: 196, kind: 'num' }], rows: R4.map(([u, v]) => [TIME, u, v]) });
const joined = () => tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Time', w: 190 }, { title: 'uri', w: 210 }, { title: 'Value #A', w: 168, kind: 'num' }, { title: 'Value #B', w: 168, kind: 'num', fmt: f2 }], rows: R4.map(([u, a, b]) => [TIME, u, a, b]) });
const renamed = (extra) => tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Route', w: 190 }, { title: 'Requests per second', w: 180, kind: 'num' }, { title: 'p95 latency (s)', w: 170, kind: 'num', fmt: f2 }, ...(extra ? [{ title: 'Requests per minute', w: 196, kind: 'num' }] : [])], rows: R4.map(([u, a, b]) => [u, a, b, ...(extra ? [a * 60] : [])]) });
const FILTERED = R4.filter((r) => r[1] > 1.05);
const base = (o) => ({ crumbs: CRUMBS, title: TITLE, bottom: undefined, ...o });
const tabsMarks = (m) => marks([[m.tabTransformations, 19], [m.addTransformation, 20]]);

const figures = [];

// 01: the dashboard in view mode; Dashboards in the navigation and Edit (steps 1 and 2)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Dashboard Bookshelf (guides) in view mode with the navigation docked: callout 1 marks the Dashboards item of the navigation and callout 2 marks the Edit button of the toolbar',
    width: FW, height: 430,
    nodes: grafanaFrame({ h: 430, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], nav: true, navActive: 'Dashboards', children: [
      ...tb.nodes,
      { block: 'panel', x: 236, y: 106, w: 520, h: 290, title: 'Requests per second by status' },
      reqChart(244, 132, 504, 260),
      ...marks([[G_NAV_ROW.Dashboards, 1], [tb.geo.edit, 2]]),
    ] }),
  });
}

// 02: edit mode with the Add pane (steps 3 and 4)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  figures.push({
    id: '02-add-panel',
    alt: 'Dashboard Bookshelf (guides) in edit mode with the Add pane of the right sidebar open: callout 3 marks the Add button of the toolbar and callout 4 marks the Panel tile of the Add pane',
    width: FW, height: 540,
    nodes: grafanaFrame({ h: 540, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 300, title: 'Requests per second by status' },
      reqChart(24, 132, 504, 270),
      ...add.nodes,
      ...marks([[tb.geo.add, 3], [add.geo.panelTile, 4]]),
    ] }),
  });
}

// 03: query A: Code, the typed query and its Options row (steps 6 to 9)
{
  const e = ed({ crumbs: CRUMBS, mode: 'code', lines: [QA], optsRow: [['Format', 'Table'], ['Type', 'Instant']], marksFn: (g, m) => marks([[g.code, 6], [g.editor, 7], [m.Format, 8], [m.Type, 9]]) });
  figures.push({
    id: '03-query-a',
    alt: 'Panel editor on the Queries tab: callout 6 marks the Code option of query A, the query that sums the request rate by uri is typed in the editor (callout 7), and the opened Options row shows Format set to Table (callout 8) and Type set to Instant (callout 9)',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 04: query B added, Run queries (steps 10 to 15)
{
  const geo = {};
  const ay = 376, by = 458;
  const over = [box(L.x, 372, L.w, 262, { fill: 'canvas' }), box(L.x, ay, L.w, 76, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, ay + 24, 'A (Prometheus)', { weight: 500, box: 200 })];
  geo.add = { x: L.x + L.w - 12 - 120 - 8 - 110, y: ay + 8, w: 110, h: 32 };
  geo.run = { x: L.x + L.w - 12 - 120, y: ay + 8, w: 120, h: 32 };
  over.push(btn(geo.add.x, geo.add.y, 110, 'Add query'), btn(geo.run.x, geo.run.y, 120, 'Run queries', 'primary'));
  over.push(lbl(L.x + 12, ay + 50, QA, { size: 'small', mono: true, tone: 'textMuted', box: L.w - 24 }), lbl(L.x + 12, ay + 68, 'Options: Format Table, Type Instant', { size: 'small', tone: 'textMuted', box: 300 }));
  over.push(box(L.x, by, L.w, 174, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, by + 24, 'B (Prometheus)', { weight: 500, box: 200 }));
  const seg = segmented({ x: L.x + L.w - 12 - 144, y: by + 8, items: ['Builder', 'Code'], active: 1 });
  over.push(...seg.nodes);
  geo.code = seg.boxes[1];
  over.push({ block: 'queryEditor', x: L.x + 12, y: by + 44, w: L.w - 24, h: 54, lines: [QB1, QB2], lineNumbers: true });
  geo.editor = { x: L.x + 12, y: by + 44, w: L.w - 24, h: 54 };
  over.push(dd(L.x + 12, by + 104, 170, 'Format', 'Table'), dd(L.x + 202, by + 104, 170, 'Type', 'Instant'));
  geo.format = { x: L.x + 12, y: by + 124, w: 170, h: 32 };
  geo.type = { x: L.x + 202, y: by + 124, w: 170, h: 32 };
  const e = ed({ crumbs: CRUMBS, mode: 'code', lines: [QA], over, marksFn: () => marks([[geo.add, 10], [geo.code, 11], [geo.editor, 12], [geo.format, 13], [geo.type, 14], [geo.run, 15]]) });
  figures.push({
    id: '04-query-b',
    alt: 'Panel editor with two queries: Add query is marked by callout 10, query B has its Code option (callout 11) and the p95 latency query typed in the editor (callout 12), its Options row shows Format Table (callout 13) and Type Instant (callout 14), and Run queries is marked by callout 15',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: the Transformations tab, empty state (steps 19 and 20)
{
  const e = ed({ crumbs: CRUMBS, title: TITLE, preview: rawA().nodes, right: optsPane(), bottom: 'empty', marksFn: (g, m) => tabsMarks(m) });
  figures.push({
    id: '05-transformations-tab',
    alt: 'Panel editor on the Transformations tab with the table titled Route summary: the tab is marked by callout 19 and the empty state offers the Add transformation button, marked by callout 20',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: Join by field (steps 21 and 22)
{
  const geo = { field: { x: L.x + 14, y: 436, w: 260, h: 32 } };
  const bottom = [...card(382, 130, 'Join by field'), dd(L.x + 14, 416, 260, 'Field', 'uri')];
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 1, preview: joined().nodes, right: optsPane(), bottom, marksFn: () => mark(geo.field, 22) });
  figures.push({
    id: '06-join-by-field',
    alt: 'The Join by field transformation: its Field select holds uri (callout 22); the preview shows one table with the columns Time, uri, Value #A with the request rates and Value #B with the p95 latencies',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: Organize fields by name (steps 23 to 27)
{
  const geo = {};
  const fields = [['Time', false, ''], ['uri', true, 'Route'], ['Value #A', true, 'Requests per second'], ['Value #B', true, 'p95 latency (s)']];
  const cardY = 382;
  const bottom = card(cardY, 250, 'Organize fields by name');
  fields.forEach(([nm, on, rn], i) => {
    const ry = cardY + 40 + i * 50;
    bottom.push(box(L.x + 14, ry, L.w - 28, 44, { fill: 'inputBg', stroke: 'border', radius: 4 }), lbl(L.x + 28, ry + 27, nm, { weight: 500, box: 120 }));
    bottom.push({ block: 'toggle', x: L.x + 170, y: ry + 13, on, box: 0 });
    geo[nm] = { x: L.x + 170, y: ry + 13, w: 32, h: 18 };
    bottom.push({ block: 'field', x: L.x + 260, y: ry + 6, w: 260, ...(rn ? { value: rn } : { placeholder: '' }) });
    geo[`${nm}/rename`] = { x: L.x + 260, y: ry + 6, w: 260, h: 32 };
  });
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 2, preview: renamed(false).nodes, right: optsPane(), bottom, marksFn: () => marks([[geo.Time, 24], [geo['uri/rename'], 25], [geo['Value #A/rename'], 26], [geo['Value #B/rename'], 27]]) });
  figures.push({
    id: '07-organize-fields',
    alt: 'The Organize fields by name transformation: the Time field is switched off (callout 24), uri is renamed to Route (callout 25), Value #A to Requests per second (callout 26) and Value #B to p95 latency (s) (callout 27); the preview shows a table with three columns',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: Add field from calculation (steps 28 to 31)
{
  const geo = { mode: { x: L.x + 14, y: 436, w: 260, h: 32 }, ops: { x: L.x + 14, y: 486, w: 460, h: 32 }, alias: { x: L.x + 14, y: 548, w: 300, h: 32 } };
  const bottom = [...card(382, 232, 'Add field from calculation'), dd(L.x + 14, 416, 260, 'Mode', 'Binary operation'), dd(L.x + 14, 486, 250, '', 'Requests per second'), dd(L.x + 272, 486, 70, '', '*'), { block: 'field', x: L.x + 350, y: 486, w: 124, value: '60' },
    { block: 'field', x: L.x + 14, y: 528, w: 300, label: 'Alias', value: 'Requests per minute' }];
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 3, preview: renamed(true).nodes, right: optsPane(), bottom, marksFn: () => marks([[geo.mode, 29], [geo.ops, 30], [geo.alias, 31]]) });
  figures.push({
    id: '08-add-field-from-calculation',
    alt: 'The Add field from calculation transformation: the Mode is the binary operation (callout 29), the operands read Requests per second, the operator * and the value 60 (callout 30) and the Alias is Requests per minute (callout 31); the preview shows the new column Requests per minute',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: Filter data by values (steps 32 to 35)
{
  const geo = { field: { x: L.x + 14, y: 486, w: 250, h: 32 }, op: { x: L.x + 272, y: 486, w: 140, h: 32 }, val: { x: L.x + 420, y: 486, w: 110, h: 32 } };
  const bottom = [...card(382, 200, 'Filter data by values'), dd(L.x + 14, 416, 160, 'Filter type', 'Include'), dd(L.x + 190, 416, 160, 'Conditions', 'Match all'),
    dd(L.x + 14, 486, 250, '', 'Requests per second'), dd(L.x + 272, 486, 140, '', 'Greater'), { block: 'field', x: L.x + 420, y: 486, w: 110, value: '1.05' }];
  const t = tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Route', w: 190 }, { title: 'Requests per second', w: 180, kind: 'num' }, { title: 'p95 latency (s)', w: 170, kind: 'num', fmt: f2 }, { title: 'Requests per minute', w: 196, kind: 'num' }], rows: FILTERED.map(([u, a, b]) => [u, a, b, a * 60]) });
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 4, preview: t.nodes, right: optsPane(), bottom, marksFn: () => marks([[geo.field, 33], [geo.op, 34], [geo.val, 35]]) });
  figures.push({
    id: '09-filter-by-values',
    alt: 'The Filter data by values transformation with one condition: the field Requests per second (callout 33), the operator Greater (callout 34) and the value 1.05 (callout 35); the preview lists three routes, because /api/loans with 1.0 requests per second is gone',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: the debug view (step 36)
{
  const geo = { debug: { x: L.x + L.w - 14 - 28, y: 388, w: 28, h: 28 } };
  const mini = (x, rowsIn) => tbl({ x, y: 450, w: 340, rowH: 26, cols: [{ title: 'Route', w: 150 }, { title: 'Requests per second', w: 190, kind: 'num' }], rows: rowsIn.map(([u, a]) => [u, a]) });
  const bottom = [...card(382, 250, 'Filter data by values'), box(geo.debug.x, geo.debug.y, 28, 28, { fill: 'surfaceRaised', radius: 4 }), ico(geo.debug.x + 6, geo.debug.y + 6, 'bug', 'text'),
    lbl(L.x + 14, 440, 'Input', { size: 'small', weight: 600, box: 120 }), lbl(L.x + 390, 440, 'Output', { size: 'small', weight: 600, box: 120 }),
    ...mini(L.x + 14, R4).nodes, ...mini(L.x + 390, FILTERED).nodes];
  const t = tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Route', w: 190 }, { title: 'Requests per second', w: 180, kind: 'num' }, { title: 'p95 latency (s)', w: 170, kind: 'num', fmt: f2 }, { title: 'Requests per minute', w: 196, kind: 'num' }], rows: FILTERED.map(([u, a, b]) => [u, a, b, a * 60]) });
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 4, preview: t.nodes, right: optsPane(), bottom, marksFn: () => mark(geo.debug, 36) });
  figures.push({
    id: '10-debug-view',
    alt: 'The Filter data by values card with its debug view open: the debug icon in the card header is marked by callout 36, below it the Input table lists four routes and the Output table lists three',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11 and 12: Group by and Reduce (steps 37 to 44)
const sumCols = [{ title: 'Route', w: 140 }, { title: 'Requests per second (total)', w: 210, kind: 'num' }, { title: 'Requests per minute (total)', w: 210, kind: 'num' }, { title: 'p95 latency (s) (max)', w: 176, kind: 'num', fmt: f2 }];
{
  const geo = {};
  const rowsG = [['Route', 'Group by', ''], ['Requests per second', 'Calculate', 'Total'], ['Requests per minute', 'Calculate', 'Total'], ['p95 latency (s)', 'Calculate', 'Max']];
  const bottom = card(382, 250, 'Group by');
  rowsG.forEach(([nm, op, calc], i) => {
    const ry = 416 + i * 50;
    bottom.push(lbl(L.x + 14, ry + 22, nm, { weight: 500, box: 190 }), dd(L.x + 220, ry, 150, '', op));
    geo[`${i}/op`] = { x: L.x + 220, y: ry, w: 150, h: 32 };
    if (calc) { bottom.push(dd(L.x + 386, ry, 130, '', calc)); geo[`${i}/calc`] = { x: L.x + 386, y: ry, w: 130, h: 32 }; }
  });
  const t = tbl({ x: 28, y: 134, w: 736, cols: sumCols, rows: FILTERED.map(([u, a, b]) => [u, a, a * 60, b]) });
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 5, preview: t.nodes, right: optsPane(), bottom, marksFn: () => marks([[geo['0/op'], 38], [geo['1/op'], 39], [geo['1/calc'], 40]]) });
  figures.push({
    id: '11-group-by',
    alt: 'The Group by transformation: the field Route is set to Group by (callout 38), Requests per second is set to Calculate (callout 39) with the calculation Total (callout 40), and the other two fields are set the same way; the preview shows three routes with the totals and the maximum latency',
    width: FW, height: 640, nodes: e.nodes,
  });
}
{
  const geo = { mode: { x: L.x + 14, y: 436, w: 260, h: 32 }, calc: { x: L.x + 14, y: 506, w: 260, h: 32 } };
  const bottom = [...card(382, 190, 'Reduce'), dd(L.x + 14, 416, 260, 'Mode', 'Reduce fields'), dd(L.x + 14, 486, 260, 'Calculations', 'Max')];
  const t = tbl({ x: 28, y: 134, w: 736, cols: sumCols.slice(1), rows: [[4.8, 288, 0.21]] });
  const e = ed({ crumbs: CRUMBS, title: TITLE, transformations: 6, preview: t.nodes, right: optsPane(), bottom, marksFn: () => marks([[geo.mode, 43], [geo.calc, 44]]) });
  figures.push({
    id: '12-reduce',
    alt: 'The Reduce transformation: its Mode is Reduce fields (callout 43) and its Calculations select holds Max (callout 44); the preview shrinks to one row with the highest request rate, the highest rate per minute and the highest p95 latency',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 13 and 14: expressions in a time series panel (steps 51 to 58)
const SOK = [8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2, 8.6], S404 = [1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3, 1.2];
const perMinute = () => [{ block: 'line', x: 24, y: 130, w: 744, h: 186, series: [{ name: '200', points: SOK.map((v) => v * 60) }, { name: '404', points: S404.map((v) => v * 60) }], min: 0, max: 600, yLabels: ['0', '150', '300', '450', '600'], xLabels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] }];
const tsPane = () => pane('Time series', [{ label: 'Panel options' }, { label: 'Tooltip' }, { label: 'Legend' }, { label: 'Axis' }]);
const queryA = (geo) => {
  const ay = 376;
  const out = [box(L.x, 372, L.w, 262, { fill: 'canvas' }), box(L.x, ay, L.w, 62, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, ay + 24, 'A (Prometheus)', { weight: 500, box: 200 })];
  geo.expr = { x: L.x + L.w - 12 - 120, y: ay + 8, w: 120, h: 32 };
  out.push(btn(geo.expr.x, geo.expr.y, 120, 'Expression', 'secondary', 'plus'), lbl(L.x + 12, ay + 52, QC, { size: 'small', mono: true, tone: 'textMuted', box: L.w - 24 }));
  return out;
};
{
  const geo = {};
  const over = queryA(geo);
  const cy = 444, dy = 516;
  over.push(box(L.x, cy, L.w, 66, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, cy + 22, 'C (Math)', { weight: 500, box: 200 }), { block: 'field', x: L.x + 12, y: cy + 28, w: 320, value: '$A * 60', mono: true });
  geo.math = { x: L.x + 12, y: cy + 28, w: 320, h: 32 };
  over.push(box(L.x, dy, L.w, 84, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, dy + 18, 'D (Reduce)', { weight: 500, box: 200 }), dd(L.x + 12, dy + 22, 130, 'Function', 'Last'), dd(L.x + 156, dy + 22, 100, 'Input', 'A'), dd(L.x + 270, dy + 22, 270, 'Mode', 'Drop Non-numeric Values'));
  geo.fn = { x: L.x + 12, y: dy + 42, w: 130, h: 32 }; geo.input = { x: L.x + 156, y: dy + 42, w: 100, h: 32 }; geo.mode = { x: L.x + 270, y: dy + 42, w: 270, h: 32 };
  const e = ed({ crumbs: CRUMBS, title: 'Requests per minute', preview: perMinute(), right: tsPane(), over, marksFn: () => marks([[geo.expr, 51], [geo.math, 52], [geo.fn, 54], [geo.input, 55], [geo.mode, 56]]) });
  figures.push({
    id: '13-math-and-reduce',
    alt: 'Panel editor of a time series panel titled Requests per minute: the Expression button under query A is marked by callout 51, the Math expression C holds the text $A * 60 (callout 52), and the Reduce expression D has Function Last (callout 54), Input A (callout 55) and Mode Drop Non-numeric Values (callout 56)',
    width: FW, height: 640, nodes: e.nodes,
  });
}
{
  const geo = {};
  const over = queryA(geo);
  const ey = 444;
  over.push(box(L.x, ey, L.w, 100, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, ey + 22, 'E (SQL)', { weight: 500, box: 200 }), { block: 'queryEditor', x: L.x + 12, y: ey + 36, w: L.w - 24, h: 52, lines: ['SELECT * FROM A LIMIT 5'], lineNumbers: true });
  geo.sql = { x: L.x + 12, y: ey + 36, w: L.w - 24, h: 52 };
  const e = ed({ crumbs: CRUMBS, title: 'Requests per minute', preview: perMinute(), right: tsPane(), over, marksFn: () => marks([[geo.expr, 57], [geo.sql, 58]]) });
  figures.push({
    id: '14-sql-expression',
    alt: 'Panel editor with the Expression button marked by callout 57 and a new SQL expression E whose editor holds the statement SELECT * FROM A LIMIT 5, marked by callout 58',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 15: the finished dashboard (What you build)
{
  const tb = gDashToolbar({ view: true });
  const t = tbl({ x: 28, y: 138, w: 696, cols: sumCols.slice(1).map((c, i) => ({ ...c, w: [230, 230, 236][i] })), rows: [[4.8, 288, 0.21]] });
  figures.push({
    id: '15-result',
    alt: 'Finished dashboard Bookshelf (guides) in view mode with two new panels: the table Route summary with one row holding the highest request rate, the highest rate per minute and the highest p95 latency, and the time series Requests per minute that draws the rates of the status codes 200 and 404 times 60',
    width: FW, height: 470,
    nodes: grafanaFrame({ h: 470, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 720, h: 100, title: TITLE }, ...t.nodes,
      { block: 'panel', x: 16, y: 218, w: 720, h: 240, title: 'Requests per minute' },
      { block: 'line', x: 24, y: 244, w: 704, h: 208, series: [{ name: '200', points: SOK.map((v) => v * 60) }, { name: '404', points: S404.map((v) => v * 60) }], min: 0, max: 600, yLabels: ['0', '150', '300', '450', '600'], xLabels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] },
    ] }),
  });
}

export default { product: 'grafana', guide: 'g12', figures };
