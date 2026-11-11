// Figures of the Grafana guide G9, "Bar chart, pie, histogram and heatmap" (guide-bar-pie-histogram-and-heatmap.adoc).
// Facts: guides-brief/grafana-facts.md sections 6 and 7 (13.3.0 panel editor; Bar chart, Pie chart, Histogram and Heatmap option groups).
// Callout numbers are the step numbers of the page. Colours are theme tokens only. The panel editor of lib/shells.mjs is reused;
// the preview, query and options pane are drawn locally.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, segmented, grafanaFrame, G_NAV_ROW, gDashToolbar, gAddPane, gPanelPane, gEditor, reqChart,
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

// The options pane of a visualization: header, Change, search and collapsible groups. Items: field, drop, toggle, seg, text.
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
      else if (it.t === 'map') { nodes.push(box(ix, y, iw, 34, { fill: 'inputBg', stroke: 'border', radius: 4 }), lbl(ix + 12, y + 22, `${it.from}  \u2192  ${it.text}`, { box: iw - 60 }), box(ix + iw - 36, y + 9, 16, 16, { fill: it.color, radius: 8 })); geo[it.key ?? it.from] = { x: ix, y, w: iw, h: 34 }; y += 42; }
      else if (it.t === 'btn') { nodes.push(btn(ix, y, iw, it.label, it.kind ?? 'secondary', it.icon)); geo[it.label] = { x: ix, y, w: iw, h: 32 }; y += 42; }
    }
  }
  if (y > 632) throw new Error(`options pane "${head}" runs past the editor: y = ${y}`);
  return { nodes, geo, endY: y };
}

// The "All visualizations" list of the right column; `hot` is the index of the highlighted row.
const VIZ = [['Time series', 'Time based line, area and bar charts'], ['Bar chart', 'Categorical charts with group support'], ['Stat', 'Big stat values & sparklines'], ['Gauge', 'Standard gauge visualization'], ['Bar gauge', 'Horizontal and vertical gauges'], ['Table', 'Supports many column styles'], ['Pie chart', 'The new core pie chart visualization'], ['State timeline', 'State changes and durations'], ['Heatmap', 'Like a histogram over time'], ['Status history', 'Periodic status history'], ['Histogram', 'Distribution of values presented as a bar chart.'], ['Text', ''], ['Logs', ''], ['Traces', '']];
function vizList(names, hot) {
  const nodes = [box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }), { block: 'tabs', x: R.x + 4, y: 106, w: R.w - 8, tabs: ['Suggestions', 'All visualizations'], active: 1 }, { block: 'field', x: R.x + 12, y: 154, w: R.w - 24, placeholder: 'Search for...' }];
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
  return { nodes, hot: hotBox };
}

// The editor. o: title, ds (data source name), mode ('builder'|'code'), preview (nodes), lines (query lines, or none),
// optsRow ('Table'|... draws the opened Options row), right (nodes + geo from pane/vizList), bottom ('queries'|'empty'|'organize'|node list),
// saved, marksFn(geo, mine) returns the callouts.
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
      n.push(...(o.marksFn ? o.marksFn(geo, mine) : []));
      return n;
    },
  });
  return e;
}

// ---- a table panel drawn from cells ---------------------------------------------------------------------------------
// cols: [{ title, w, kind: 'text'|'num'|'gauge'|'bg', max }]; rows: arrays of cell values; footer: [cells]; sort: column index
// with a down arrow; filter: indexes of columns that show the filter icon. Returns { nodes, hdr } (hdr = header boxes).
const fmt = (v) => (typeof v === 'number' ? v.toFixed(1) : String(v));
function tbl({ x, y, w, cols, rows, rowH = 30, footer, sort, filter = [] }) {
  const k = w / cols.reduce((s, c) => s + c.w, 0);
  let cx = x;
  const xs = cols.map((c) => { const p = cx; cx += c.w * k; return p; });
  const total = rowH * (rows.length + 1 + (footer ? 1 : 0));
  const nodes = [box(x, y, w, total, { fill: 'canvas', stroke: 'border', radius: 4 }), box(x + 1, y + 1, w - 2, rowH - 1, { fill: 'surfaceRaised' })];
  const hdr = [];
  cols.forEach((c, i) => {
    const cw = c.w * k;
    const reserve = (sort === i ? 20 : 0) + (filter.includes(i) ? 20 : 0);
    const right = c.kind === 'num';
    nodes.push(lbl(right ? xs[i] + cw - 10 - reserve : xs[i] + 10, y + rowH / 2 + 4, c.title, { size: 'small', weight: 600, anchor: right ? 'end' : 'start', box: cw - 20 - reserve }));
    let ix = xs[i] + cw - 26;
    if (sort === i) { nodes.push(ico(ix, y + 7, 'chevronDown', 'text')); ix -= 20; }
    if (filter.includes(i)) nodes.push(ico(ix, y + 7, 'filter', 'textMuted'));
    hdr.push({ x: xs[i], y, w: cw, h: rowH });
  });
  const cell = (c, i, v, ry) => {
    const cw = c.w * k;
    if (c.kind === 'gauge') {
      const tw = cw - 20 - 44;
      nodes.push(box(xs[i] + 10, ry + 9, tw, 12, { fill: 'surfaceRaised', radius: 3 }), box(xs[i] + 10, ry + 9, Math.max(4, (tw * v) / c.max), 12, { fill: 'threshold.green', radius: 3 }));
      nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, fmt(v), { size: 'small', anchor: 'end', box: 40 }));
    } else if (c.kind === 'bg') {
      nodes.push(box(xs[i] + 1, ry + 1, cw - 2, rowH - 2, { fill: v >= c.warn ? 'threshold.orange' : 'threshold.green' }));
      nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, fmt(v), { size: 'small', tone: 'canvas', weight: 500, anchor: 'end', box: cw - 20 }));
    } else if (c.kind === 'num') nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, fmt(v), { size: 'small', anchor: 'end', box: cw - 20 }));
    else nodes.push(lbl(xs[i] + 10, ry + rowH / 2 + 4, String(v), { size: 'small', box: cw - 20 }));
  };
  rows.forEach((r, ri) => {
    const ry = y + rowH * (ri + 1);
    nodes.push(rule(x, ry, w));
    r.forEach((v, i) => cell(cols[i], i, v, ry));
  });
  if (footer) {
    const fy = y + rowH * (rows.length + 1);
    nodes.push(box(x + 1, fy, w - 2, rowH - 1, { fill: 'surfaceRaised' }));
    footer.forEach((v, i) => { if (v !== '' && v !== undefined) nodes.push(lbl(cols[i].kind === 'num' || cols[i].kind === 'gauge' ? xs[i] + cols[i].w * k - 10 : xs[i] + 10, fy + rowH / 2 + 4, String(v), { size: 'small', weight: 600, anchor: cols[i].kind === 'num' || cols[i].kind === 'gauge' ? 'end' : 'start', box: cols[i].w * k - 20 })); });
  }
  return { nodes, hdr, xs, k };
}

const QUERY_STATUS = 'sum by (status) (rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))';
const QUERY_P95 = ['histogram_quantile(0.95, sum by (le)', '  (rate(http_server_requests_seconds_bucket{application="bookshelf"}[1m])))'];
const QUERY_BUCKETS = 'sum by (le) (rate(http_server_requests_seconds_bucket{application="bookshelf"}[1m]))';
const T_BAR = 'Request rate by status (bars)';
const T_PIE = 'Request rate by status (donut)';
const T_HIST = 'Latency p95 distribution';
const T_HEAT = 'Latency buckets over time';
const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const DASH = ['Dashboards', 'Guides', 'Bookshelf (guides)'];

const statusBars = (x, y, w, h) => ({ block: 'bar', x, y, w, h, categories: ['200', '404'], series: [{ name: 'Value', values: [8.2, 1.2] }], max: 10 });
const statusPie = (x, y, w, h) => ({ block: 'pie', x, y, w, h, slices: [{ label: '200', value: 8.2 }, { label: '404', value: 1.2 }], donut: true });
const latencyHist = (x, y, w, h) => ({ block: 'bar', x, y, w, h, categories: ['0.02', '0.03', '0.04', '0.05', '0.06', '0.07'], series: [{ name: 'p95', values: [5, 22, 31, 14, 6, 2], color: 'series.2' }], max: 40 });
const HEAT = [
  [0.0, 0.0, 0.1, 0.1, 0.0, 0.0, 0.1, 0.0, 0.0, 0.1, 0.0, 0.0],
  [0.1, 0.2, 0.3, 0.2, 0.2, 0.1, 0.2, 0.3, 0.2, 0.1, 0.2, 0.1],
  [0.6, 0.7, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7, 0.8, 0.8, 0.7, 0.9],
  [0.9, 0.8, 0.7, 0.8, 0.9, 0.9, 0.7, 0.8, 0.9, 0.7, 0.8, 0.8],
];
const latencyHeat = (x, y, w, h) => ({ block: 'heatmap', x, y, w, h, values: HEAT, color: 'series.3', rowLabels: ['1', '0.5', '0.25', '0.1'], colLabels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] });
const p95Line = (x, y, w, h) => ({ block: 'line', x, y, w, h, series: [{ name: 'p95', points: [0.04, 0.05, 0.04, 0.03, 0.05, 0.04, 0.06, 0.04, 0.03, 0.04, 0.05, 0.04], color: 'series.2' }], min: 0, max: 0.08, yLabels: ['0', '0.02', '0.04', '0.06', '0.08'], xLabels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] });

const figures = [];

// 01: the dashboard in view mode; Dashboards in the navigation and Edit (steps 1 and 2)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Dashboard Bookshelf (guides) in view mode with the navigation docked: callout 1 marks the Dashboards item of the navigation and callout 2 marks the Edit button of the toolbar',
    width: FW, height: 430,
    nodes: grafanaFrame({ h: 430, crumbs: DASH, nav: true, navActive: 'Dashboards', children: [
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
    nodes: grafanaFrame({ h: 540, crumbs: DASH, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 300, title: 'Requests per second by status' },
      reqChart(24, 132, 504, 270),
      ...add.nodes,
      ...marks([[tb.geo.add, 3], [add.geo.panelTile, 4]]),
    ] }),
  });
}

// 03: the status query: data source, Code, query, Format and Type, Run queries (steps 6 to 11)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: [QUERY_STATUS], optsRow: [['Format', 'Table'], ['Type', 'Instant']],
    marksFn: (g, m) => marks([[g.ds, 6], [g.code, 7], [g.editor, 8], [m.Format, 9], [m.Type, 10], [g.runQueries, 11]]),
  });
  figures.push({
    id: '03-status-query',
    alt: 'Panel editor on the Queries tab: the Prometheus data source is marked by callout 6, the Code option by callout 7, the typed query that sums the request rate by status by callout 8, the opened Options row shows Format set to Table (callout 9) and Type set to Instant (callout 10), and Run queries is marked by callout 11',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 04: All visualizations: Bar chart (step 12)
{
  const v = vizList(['Time series', 'Bar chart', 'Stat', 'Gauge', 'Bar gauge', 'Table', 'Pie chart', 'State timeline'], 'Bar chart');
  const t = tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Time', w: 200 }, { title: 'status', w: 340 }, { title: 'Value', w: 196, kind: 'num' }], rows: [['2026-11-11 10:16:20', '200', 8.2], ['2026-11-11 10:16:20', '404', 1.2]] });
  const e = ed({ crumbs: CRUMBS, mode: 'code', lines: [QUERY_STATUS], preview: t.nodes, right: v, marksFn: () => mark(v.hot, 12) });
  figures.push({
    id: '04-pick-bar-chart',
    alt: 'Panel editor after Run queries: the preview shows a table with the columns Time, status and Value for the statuses 200 and 404, and the All visualizations tab lists Bar chart with the description Categorical charts with group support, marked by callout 12',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: the Bar chart options: title and X Axis (steps 13 and 14)
{
  const p = pane('Bar chart', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_BAR }] },
    { label: 'Bar chart', open: true, items: [{ t: 'drop', label: 'X Axis', value: 'status' }] },
    { label: 'Tooltip' }, { label: 'Legend' }, { label: 'Axis' }, { label: 'Standard options' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_BAR, mode: 'code', lines: [QUERY_STATUS], preview: [statusBars(24, 126, 744, 190)], right: p, marksFn: () => marks([[p.geo.Title, 13], [p.geo['X Axis'], 14]]) });
  figures.push({
    id: '05-bar-options',
    alt: 'Panel editor with the Bar chart options pane: the Title field holds Request rate by status (bars), marked by callout 13, and the X Axis of the Bar chart group is set to status, marked by callout 14; the preview draws one bar for 200 and a small one for 404',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: the dashboard with the first panel and the Add pane, for the second panel (steps 16 and 17)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  figures.push({
    id: '06-add-second-panel',
    alt: 'Dashboard in edit mode after Back: the new bar chart panel sits next to the first panel, callout 16 marks the Add button of the toolbar and callout 17 marks the Panel tile of the Add pane',
    width: FW, height: 540,
    nodes: grafanaFrame({ h: 540, crumbs: DASH, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 370, h: 300, title: 'Requests per second by status' },
      reqChart(24, 132, 354, 270),
      { block: 'panel', x: 396, y: 106, w: 370, h: 300, title: T_BAR },
      statusBars(404, 132, 354, 270),
      ...add.nodes,
      ...marks([[tb.geo.add, 16], [add.geo.panelTile, 17]]),
    ] }),
  });
}

// 07: the Pie chart options (steps 21 to 23)
{
  const p = pane('Pie chart', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_PIE }] },
    { label: 'Value options', open: true, items: [{ t: 'drop', label: 'Show', value: 'All values' }] },
    { label: 'Pie chart', open: true, items: [{ t: 'seg', label: 'Pie chart type', items: ['Pie', 'Donut'], active: 1 }] },
    { label: 'Tooltip' }, { label: 'Legend' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_PIE, mode: 'code', lines: [QUERY_STATUS], preview: [statusPie(24, 126, 744, 190)], right: p, marksFn: () => marks([[p.geo.Title, 21], [p.geo.Show, 22], [p.geo['Pie chart type'], 23]]) });
  figures.push({
    id: '07-pie-options',
    alt: 'Panel editor with the Pie chart options pane: the Title holds Request rate by status (donut), marked by callout 21, Show under Value options is set to All values, marked by callout 22, and Pie chart type is set to Donut, marked by callout 23; the preview draws a donut with a large slice for 200',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: the p95 latency query (steps 26 to 28)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: QUERY_P95,
    marksFn: (g) => marks([[g.code, 26], [g.editor, 27], [g.runQueries, 28]]),
  });
  figures.push({
    id: '08-latency-query',
    alt: 'Panel editor in Code mode for the third panel: the Code option is marked by callout 26, the two-line histogram_quantile query for the 95th percentile of the request latency is typed in the editor (callout 27) and Run queries is marked by callout 28',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: the Histogram options (steps 30 and 31)
{
  const p = pane('Histogram', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_HIST }] },
    { label: 'Histogram', open: true, items: [{ t: 'field', label: 'Bucket count', value: '20' }, { t: 'toggle', label: 'Combine series', on: false }] },
    { label: 'Tooltip' }, { label: 'Legend' }, { label: 'Standard options' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_HIST, mode: 'code', lines: QUERY_P95, preview: [latencyHist(24, 126, 744, 190)], right: p, marksFn: () => marks([[p.geo.Title, 30], [p.geo['Bucket count'], 31]]) });
  figures.push({
    id: '09-histogram-options',
    alt: 'Panel editor with the Histogram options pane: the Title holds Latency p95 distribution, marked by callout 30, and Bucket count under the Histogram group is 20, marked by callout 31; the preview draws bars for ranges of latency values',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: the bucket query with Format Heatmap (steps 34 to 37)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: [QUERY_BUCKETS], optsRow: [['Format', 'Heatmap'], ['Type', 'Range']],
    marksFn: (g, m) => marks([[g.code, 34], [g.editor, 35], [m.Format, 36], [g.runQueries, 37]]),
  });
  figures.push({
    id: '10-bucket-query',
    alt: 'Panel editor in Code mode for the fourth panel: the Code option is marked by callout 34, the query that sums the latency buckets by le is typed in the editor (callout 35), the opened Options row shows Format set to Heatmap (callout 36) and Run queries is marked by callout 37',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11: the Heatmap options (steps 39 and 40)
{
  const p = pane('Heatmap', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_HEAT }] },
    { label: 'Heatmap', open: true, items: [{ t: 'seg', label: 'Calculate from data', items: ['Yes', 'No'], active: 1 }] },
    { label: 'Y Axis' }, { label: 'Colors' }, { label: 'Cell display' }, { label: 'Tooltip' }, { label: 'Legend' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_HEAT, mode: 'code', lines: [QUERY_BUCKETS], preview: [latencyHeat(24, 130, 744, 186)], right: p, marksFn: () => marks([[p.geo.Title, 39], [p.geo['Calculate from data'], 40]]) });
  figures.push({
    id: '11-heatmap-options',
    alt: 'Panel editor with the Heatmap options pane: the Title holds Latency buckets over time, marked by callout 39, and Calculate from data under the Heatmap group is set to No, marked by callout 40; the preview draws a grid of cells whose colour grows with the request rate of each latency bucket',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 12: the finished dashboard in view mode (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '12-result',
    alt: 'Dashboard Bookshelf (guides) in view mode with four new panels in a grid: a bar chart and a donut of the request rate by status, a histogram of the 95th percentile latency and a heatmap of the latency buckets over time',
    width: FW, height: 580,
    nodes: grafanaFrame({ h: 580, crumbs: DASH, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 220, title: T_BAR }, statusBars(24, 130, 504, 192),
      { block: 'panel', x: 544, y: 106, w: 520, h: 220, title: T_PIE }, statusPie(552, 130, 504, 192),
      { block: 'panel', x: 16, y: 338, w: 520, h: 220, title: T_HIST }, latencyHist(24, 362, 504, 192),
      { block: 'panel', x: 544, y: 338, w: 520, h: 220, title: T_HEAT }, latencyHeat(552, 366, 504, 188),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g9', figures };
