// Figures of the Grafana guide G10, "State timeline, status history, logs and text panels" (guide-state-logs-and-text-panels.adoc).
// Facts: guides-brief/grafana-facts.md sections 6 and 7 (13.3.0 panel editor; State timeline, Status history, Logs, Traces and Text option groups).
// Value mapping dialogs, the Tempo query editor and the Traces panel body were not opened in the lab: they are drawn generically.
// Callout numbers are the step numbers of the page. Colours are theme tokens only.
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

const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const DASH = ['Dashboards', 'Guides', 'Bookshelf (guides)'];
const QUERY_HEALTH = ['(sum(rate(http_server_requests_seconds_count{application="bookshelf",', '  status=~"5.."}[1m])) or vector(0)) > bool 0'];
const QUERY_LOGS = '{application="bookshelf"} | json | status >= 500';
const TRACE_ID = '4bf92f3577b34da6a3ce929d0e0e4736';
const T_STATE = 'Bookshelf error state';
const T_HIST = 'Scrape targets (up)';
const T_LOGS = 'Bookshelf errors';
const T_TRACE = 'Trace of one request';

const stateRows = (x, y, w, h) => ({ block: 'stateTimeline', x, y, w, h, labelWidth: 100, rows: [{ label: 'Bookshelf', segments: [{ from: 0, to: 0.58, state: 'normal', text: 'Healthy' }, { from: 0.58, to: 0.78, state: 'firing', text: 'Failing' }, { from: 0.78, to: 1, state: 'normal', text: 'Healthy' }] }] });

// A status history: one row per series, one cell per time step.
function statusGrid(x, y, w, h, rows, cols = 16, bad = {}) {
  const lw = 190, cw = (w - lw) / cols, rh = Math.min(34, (h - 24) / rows.length);
  const out = [];
  rows.forEach((r, ri) => {
    const ry = y + ri * (rh + 6);
    out.push(lbl(x, ry + rh / 2 + 4, r, { size: 'small', tone: 'textMuted', box: lw - 8 }));
    for (let c = 0; c < cols; c++) out.push(box(x + lw + c * cw + 1, ry, cw - 2, rh, { fill: bad[ri]?.includes(c) ? 'state.firing.bg' : 'state.normal.bg', radius: 2 }));
  });
  ['10:00', '12:00', '14:00'].forEach((t, i) => out.push(lbl(x + lw + (i * (w - lw)) / 2.4, y + rows.length * (rh + 6) + 12, t, { size: 'small', tone: 'textMuted', box: 60 })));
  return out;
}

const LOG_LINES = [
  ['10:16:41.204', 'ERROR', 'GET /api/books status=500'], ['10:16:41.731', 'ERROR', 'GET /api/loans status=500'], ['10:16:42.118', 'ERROR', 'GET /api/search status=500'],
  ['10:16:42.902', 'ERROR', 'GET /api/books status=500'], ['10:16:43.377', 'ERROR', 'GET /api/books/7 status=500'], ['10:16:43.845', 'ERROR', 'GET /api/loans status=500'],
];
function logLines(x, y, n = 6, stamp = true) {
  const out = [];
  LOG_LINES.slice(0, n).forEach(([t, lv, m], i) => {
    let cx = x;
    const ly = y + i * 26;
    if (stamp) { out.push(lbl(cx, ly, t, { size: 'small', tone: 'textMuted', mono: true, box: 120 })); cx += 130; }
    out.push(lbl(cx, ly, lv, { size: 'small', weight: 500, tone: 'threshold.red', mono: true, box: 60 }));
    out.push(lbl(cx + 56, ly, m, { size: 'small', mono: true, box: 500 }));
  });
  return out;
}

const traceView = (x, y, w) => [
  lbl(x, y + 12, 'GET /api/books', { weight: 500, box: 200 }), lbl(x + 150, y + 12, 'bookshelf', { size: 'small', tone: 'textMuted', box: 120 }),
  rule(x, y + 24, w),
  lbl(x, y + 52, 'GET /api/books', { size: 'small', box: 160 }), box(x + 170, y + 38, w - 180, 20, { fill: 'series.2', radius: 3 }),
  lbl(x, y + 84, 'span', { size: 'small', tone: 'textMuted', box: 100 }), box(x + 200, y + 70, (w - 180) * 0.7, 20, { fill: 'series.4', radius: 3 }),
  lbl(x, y + 116, 'span', { size: 'small', tone: 'textMuted', box: 100 }), box(x + 240, y + 102, (w - 180) * 0.4, 20, { fill: 'series.5', radius: 3 }),
];

const figures = [];

// 01 and 02 as in the other guides: open the dashboard, Edit, Add, Panel
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

// 03: the health query (steps 6 to 9)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: QUERY_HEALTH,
    marksFn: (g) => marks([[g.ds, 6], [g.code, 7], [g.editor, 8], [g.runQueries, 9]]),
  });
  figures.push({
    id: '03-health-query',
    alt: 'Panel editor on the Queries tab: the Prometheus data source is marked by callout 6, the Code option by callout 7, the two-line query that returns 1 while the 5xx rate is above zero and 0 otherwise by callout 8, and Run queries by callout 9',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 04: state timeline: title and value mappings (steps 11 to 13)
{
  const p = pane('State timeline', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_STATE }] },
    { label: 'State timeline' },
    { label: 'Value mappings', open: true, items: [{ t: 'map', key: 'm0', from: '0', text: 'Healthy', color: 'threshold.green' }, { t: 'map', key: 'm1', from: '1', text: 'Failing', color: 'threshold.red' }] },
    { label: 'Legend' }, { label: 'Tooltip' }, { label: 'Axis' }, { label: 'Thresholds' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_STATE, mode: 'code', lines: QUERY_HEALTH, preview: [stateRows(28, 150, 736, 120)], right: p, marksFn: () => marks([[p.geo.Title, 11], [p.geo['Value mappings'], 12], [p.geo.m1, 13]]) });
  figures.push({
    id: '04-state-timeline-options',
    alt: 'Panel editor with the State timeline options pane: the Title holds Bookshelf error state (callout 11), the Value mappings group (callout 12) lists the mapping of 0 to Healthy in green and the new mapping of 1 to Failing in red (callout 13); the preview draws one row that is Healthy, then Failing, then Healthy again',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: the up query (steps 16 to 18)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: ['up'],
    marksFn: (g) => marks([[g.code, 16], [g.editor, 17], [g.runQueries, 18]]),
  });
  figures.push({
    id: '05-up-query',
    alt: 'Panel editor in Code mode for the second panel: the Code option is marked by callout 16, the query up is typed in the editor (callout 17) and Run queries is marked by callout 18',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: status history: title and value mappings (steps 20 to 22)
{
  const p = pane('Status history', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_HIST }] },
    { label: 'Status history' },
    { label: 'Value mappings', open: true, items: [{ t: 'map', key: 'm1', from: '1', text: 'Up', color: 'threshold.green' }, { t: 'map', key: 'm0', from: '0', text: 'Down', color: 'threshold.red' }] },
    { label: 'Legend' }, { label: 'Tooltip' }, { label: 'Axis' }, { label: 'Thresholds' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_HIST, mode: 'code', lines: ['up'], preview: statusGrid(28, 146, 736, 160, ['up{job="bookshelf"}', 'up{job="prometheus"}']), right: p, marksFn: () => marks([[p.geo.Title, 20], [p.geo.m1, 21], [p.geo.m0, 22]]) });
  figures.push({
    id: '06-status-history-options',
    alt: 'Panel editor with the Status history options pane: the Title holds Scrape targets (up), marked by callout 20, and the Value mappings group lists the mapping of 1 to Up in green, marked by callout 21, and of 0 to Down in red, marked by callout 22; the preview draws one row of green cells for each scrape target',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: the logs query (steps 25 to 28)
{
  const e = ed({
    crumbs: CRUMBS, ds: 'Loki', mode: 'code', lines: [QUERY_LOGS],
    marksFn: (g) => [box(L.x + 9, CY + 49, 156, 38, { fill: 'surface' }), ...marks([[g.ds, 25], [g.code, 26], [g.editor, 27], [g.runQueries, 28]])],
  });
  figures.push({
    id: '07-logs-query',
    alt: 'Panel editor for the logs panel: the data source picker shows Loki (callout 25), the Code option is marked by callout 26, the LogQL query for requests with a status of 500 or more is typed in the editor (callout 27) and Run queries is marked by callout 28',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: the Logs options (steps 30 to 33)
{
  const p = pane('Logs', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: T_LOGS }] },
    { label: 'Logs', open: true, items: [{ t: 'toggle', label: 'Show timestamps', on: true }, { t: 'toggle', label: 'Wrap lines', on: true }, { t: 'seg', label: 'Order', items: ['Newest first', 'Oldest first'], w: 118, active: 0 }] },
    { label: 'Standard options' },
  ]);
  const e = ed({ crumbs: CRUMBS, title: T_LOGS, ds: 'Loki', mode: 'code', lines: [QUERY_LOGS], preview: logLines(30, 150), right: p, marksFn: () => [box(L.x + 9, CY + 49, 156, 38, { fill: 'surface' }), ...marks([[p.geo.Title, 30], [p.geo['Show timestamps'], 31], [p.geo['Wrap lines'], 32], [p.geo.Order, 33]])] });
  figures.push({
    id: '08-logs-options',
    alt: 'Panel editor with the Logs options pane: the Title holds Bookshelf errors (callout 30), Show timestamps is on (callout 31), Wrap lines is on (callout 32) and Order is set to Newest first (callout 33); the preview lists log lines with a time, the level ERROR and the request',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: the trace query (steps 36 to 38)
{
  const card = [
    box(L.x, CY, L.w, 208, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 12, CY + 26, 'A (Tempo)', { weight: 500, box: 200 }),
    { block: 'field', x: L.x + 12, y: CY + 52, w: 540, value: TRACE_ID, mono: true },
    btn(L.x + L.w - 12 - 120, CY + 52, 120, 'Run queries', 'primary'),
  ];
  const e = ed({
    crumbs: CRUMBS, ds: 'Tempo',
    marksFn: (g) => [...card, ...marks([[g.ds, 36], [{ x: L.x + 12, y: CY + 52, w: 540, h: 32 }, 37], [{ x: L.x + L.w - 12 - 120, y: CY + 52, w: 120, h: 32 }, 38]])],
  });
  figures.push({
    id: '09-trace-query',
    alt: 'Panel editor for the traces panel: the data source picker shows Tempo (callout 36), the query field holds a trace ID copied from a log line (callout 37) and Run queries is marked by callout 38',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: the Text card of the empty right column (step 43)
{
  const e = ed({ crumbs: CRUMBS, marksFn: () => mark({ x: R.x + 12, y: 364, w: 116, h: 52 }, 43) });
  figures.push({
    id: '10-text-card',
    alt: 'Panel editor of a new panel before any query: under Start without data the right column offers the cards Text, Alert list and Dashboard list, and the Text card is marked by callout 43',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11: the Text options (steps 44 to 46)
{
  const p = pane('Text', [
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', placeholder: '' }, { t: 'toggle', label: 'Transparent background', on: true }] },
    { label: 'Text', open: true, items: [{ t: 'seg', label: 'Mode', items: ['Markdown', 'HTML', 'Code'], w: 80, active: 0 }] },
  ]);
  const cy = p.endY;
  const content = [
    lbl(R.x + 12, cy + 12, 'Content', { size: 'small', weight: 500, box: 200 }),
    box(R.x + 12, cy + 20, R.w - 24, 118, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }),
    lbl(R.x + 22, cy + 44, '# Bookshelf (guides)', { size: 'small', mono: true, box: R.w - 44 }),
    lbl(R.x + 22, cy + 68, 'Request rates, latency,', { size: 'small', mono: true, box: R.w - 44 }),
    lbl(R.x + 22, cy + 88, 'health, logs and traces', { size: 'small', mono: true, box: R.w - 44 }),
    lbl(R.x + 22, cy + 108, 'of the Bookshelf service.', { size: 'small', mono: true, box: R.w - 44 }),
  ];
  const preview = [
    lbl(40, 170, 'Bookshelf (guides)', { size: 'heading', weight: 500, box: 400 }),
    lbl(40, 212, 'Request rates, latency, health, logs and traces of the Bookshelf service.', { box: 640 }),
  ];
  const e = ed({ crumbs: CRUMBS, title: '', preview, right: { nodes: [...p.nodes, ...content] }, marksFn: () => marks([[p.geo.Mode, 44], [{ x: R.x + 12, y: cy + 20, w: R.w - 24, h: 118 }, 45], [p.geo['Transparent background'], 46]]) });
  figures.push({
    id: '11-text-options',
    alt: 'Panel editor with the Text options pane: Mode is set to Markdown (callout 44), the Content box holds a Markdown heading and a sentence (callout 45) and Transparent background is on (callout 46); the preview shows the rendered heading and the sentence',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 12: the finished dashboard (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '12-result',
    alt: 'Dashboard Bookshelf (guides) in view mode with five new panels: a text header, a state timeline of the error state, a status history of the scrape targets, a logs panel with error lines and a traces panel with one trace',
    width: FW, height: 640,
    nodes: grafanaFrame({ h: 640, crumbs: DASH, children: [
      ...tb.nodes,
      lbl(30, 130, 'Bookshelf (guides)', { size: 'heading', weight: 500, box: 400 }),
      lbl(30, 154, 'Request rates, latency, health, logs and traces of the Bookshelf service.', { size: 'small', tone: 'textMuted', box: 640 }),
      { block: 'panel', x: 16, y: 170, w: 520, h: 130, title: T_STATE }, stateRows(28, 206, 496, 80),
      { block: 'panel', x: 544, y: 170, w: 520, h: 130, title: T_HIST }, ...statusGrid(556, 204, 496, 80, ['up{job="bookshelf"}', 'up{job="prometheus"}']),
      { block: 'panel', x: 16, y: 312, w: 520, h: 308, title: T_LOGS }, ...logLines(28, 364, 6),
      { block: 'panel', x: 544, y: 312, w: 520, h: 308, title: T_TRACE }, ...traceView(560, 346, 488),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g10', figures };
