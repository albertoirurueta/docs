// Figures of the Grafana guide G3, "Explore metrics" (guide-explore-metrics.adoc).
// Facts: guides-brief/grafana-facts.md section 4 (Grafana 13.3.0). A figure shows the screen the step starts from, with
// the control to act on highlighted; a typing step shows the typed value. Callout numbers are the step numbers of the
// page. Colours are theme tokens only. Not in the facts brief, so drawn generically or not at all: the Kick start menu,
// the Explain text, the second Explore pane after Split and the Add to dashboard dialog.
import { FW, lbl, box, btn, ico, mark, marks, menu, segmented, grafanaFrame, G_NAV_W, reqChart, QUERY_RUNS } from '../lib/shells.mjs';

const navRow = (i) => ({ x: 8, y: 48 + i * 34, w: G_NAV_W - 16, h: 32 });
const FULL_QUERY = 'sum by (status) (rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))';
const HQ_RUNS = [
  { t: 'histogram_quantile', kind: 'keyword' }, { t: '(' }, { t: '0.95', kind: 'number' }, { t: ', ' }, { t: 'sum', kind: 'keyword' }, { t: ' by (le) (' }, { t: 'rate', kind: 'keyword' },
  { t: '(http_server_requests_seconds_bucket{' }, { t: 'application', kind: 'label' }, { t: '=' }, { t: '"bookshelf"', kind: 'string' }, { t: '}[' }, { t: '1m', kind: 'number' }, { t: ']))))' },
];

// The Explore toolbar row (y = 58). `x0` and `compact` are for the figure with the docked navigation.
function toolbarRow({ x0 = 16, compact = false } = {}) {
  const geo = {};
  const n = [];
  geo.picker = { x: compact ? x0 : 128, y: 58, w: 220, h: 32 };
  n.push({ block: 'dropdown', x: geo.picker.x, y: 58, w: 220, value: 'Prometheus' });
  geo.run = { x: FW - 16 - 100, y: 58, w: 100, h: 32 };
  n.push(btn(geo.run.x, 58, 100, 'Run query', 'primary'));
  if (compact) return { nodes: n, geo };
  geo.outline = { x: 16, y: 58, w: 100, h: 32 };
  n.push(btn(16, 58, 100, 'Outline'));
  geo.queryless = { x: 360, y: 58, w: 140, h: 32 };
  n.push(btn(360, 58, 140, 'Go queryless'));
  geo.time = { x: geo.run.x - 8 - 180, y: 58, w: 180, h: 32 };
  n.push(btn(geo.time.x, 58, 180, 'Last 1 hour', 'secondary', 'clock'));
  geo.add = { x: geo.time.x - 8 - 90, y: 58, w: 90, h: 32 };
  n.push(btn(geo.add.x, 58, 90, 'Add', 'secondary', 'chevronDown'));
  geo.split = { x: geo.add.x - 8 - 90, y: 58, w: 90, h: 32 };
  n.push(btn(geo.split.x, 58, 90, 'Split'));
  return { nodes: n, geo };
}

// A query card. mode 'builder' | 'code'. Builder state: metric, filter (bool), ops (bool), kick (bool: the empty-query button).
// Code state: text (runs) or empty placeholder; explain (bool).
function queryCard({ x, y, w, name = 'A', mode = 'builder', metric, filter = false, ops = false, kick = false, runs, explain = false, summary = false, metricDropdown }) {
  const geo = {};
  const n = [];
  const h = summary ? 52 : mode === 'code' ? 212 : ops ? 240 : 200;
  n.push(box(x, y, w, h, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(lbl(x + 12, y + 26, `${name} (Prometheus)`, { weight: 500, box: 180 }));
  const seg = segmented({ x: x + w - 12 - 144, y: y + 8, items: ['Builder', 'Code'], active: mode === 'code' ? 1 : 0 });
  n.push(...seg.nodes);
  geo.builder = seg.boxes[0]; geo.code = seg.boxes[1];
  geo.explain = { x: x + w - 12 - 144 - 30 - 90, y: y + 15, w: 90, h: 20 };
  n.push({ block: 'toggle', x: geo.explain.x, y: y + 15, label: 'Explain', on: explain, box: 56 });
  if (kick) { geo.kick = { x: x + 150, y: y + 8, w: 190, h: 32 }; n.push(btn(geo.kick.x, y + 8, 190, 'Kick start your query')); }
  if (summary) { if (w >= 900) n.push(lbl(x + 132, y + 26, FULL_QUERY, { size: 'small', mono: true, tone: 'textMuted', box: w - 420 }));
    return { nodes: n, geo, h }; }
  if (mode === 'code') {
    n.push(btn(x + 12, y + 52, 150, 'Metrics browser'));
    geo.run = { x: x + w - 12 - 120, y: y + 52, w: 120, h: 32 };
    n.push(btn(geo.run.x, y + 52, 120, 'Run queries', 'primary'));
    const lines = runs ? [runs] : [[{ t: 'Enter a PromQL query...' }]];
    geo.editor = { x: x + 12, y: y + 108, w: w - 24, h: 50 };
    n.push({ block: 'queryEditor', ...geo.editor, lines, lineNumbers: !!runs });
    n.push(btn(x + 12, y + 170, 110, 'Add query'));
    geo.addQuery = { x: x + 12, y: y + 170, w: 110, h: 32 };
    return { nodes: n, geo, h };
  }
  n.push(lbl(x + 12, y + 68, 'Metric', { size: 'small', weight: 500 }));
  geo.metric = { x: x + 12, y: y + 76, w: 360, h: 32 };
  const metricDd = { block: 'dropdown', x: x + 12, y: y + 76, w: 360, value: metric ?? 'Select metric', ...(metricDropdown ?? {}) };
  if (!metricDropdown) n.push(metricDd);
  n.push(lbl(x + 392, y + 68, 'Label filters', { size: 'small', weight: 500 }));
  if (filter) {
    geo.label = { x: x + 392, y: y + 76, w: 130, h: 32 };
    geo.value = { x: x + 392 + 130 + 24 + 50 + 24, y: y + 76, w: 130, h: 32 };
    n.push({ block: 'dropdown', x: x + 392, y: y + 76, w: 130, value: 'application' });
    n.push({ block: 'dropdown', x: x + 392 + 154, y: y + 76, w: 50, value: '=' });
    n.push({ block: 'dropdown', x: geo.value.x, y: y + 76, w: 130, value: 'bookshelf' });
    geo.add = { x: geo.value.x + 130 + 38, y: y + 76, w: 90, h: 32 };
    n.push(ico(geo.value.x + 130 + 12, y + 84, 'close'));
  } else {
    geo.add = { x: x + 392, y: y + 76, w: 90, h: 32 };
  }
  n.push(btn(geo.add.x, geo.add.y, 90, 'Add', 'secondary', 'plus'));
  geo.operations = { x: x + 12, y: y + 124, w: 150, h: 32 };
  n.push(btn(x + 12, y + 124, 150, 'Operations', 'secondary', 'plus'));
  let py = y + 176;
  if (ops) {
    const cards = [['Rate', 'Range', '1m'], ['Sum by', 'Label', 'status']];
    cards.forEach(([t, f, v], i) => {
      const cx = x + 176 + i * 230;
      n.push(box(cx, y + 118, 214, 56, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }));
      n.push(lbl(cx + 12, y + 140, t, { weight: 500, box: 120 }));
      n.push(lbl(cx + 12, y + 162, f, { size: 'small', tone: 'textMuted', box: 60 }));
      n.push({ block: 'field', x: cx + 76, y: y + 146, w: 126, h: 24, value: v });
      geo[i === 0 ? 'range' : 'sumLabel'] = { x: cx + 76, y: y + 146, w: 126, h: 24 };
    });
    py = y + 196;
  }
  if (metric && !metricDropdown) {
    const text = ops ? FULL_QUERY : filter ? `${metric}{application="bookshelf"}` : metric;
    n.push(lbl(x + 12, py + 4, text, { mono: true, size: 'small', tone: 'editorText', box: w - 24 }));
    n.push(lbl(x + 12, py + 28, 'Options  Legend: Verbose | Format: Time series | Step: auto | Type: Range | Exemplars: false', { size: 'small', tone: 'textMuted', box: w - 24 }));
  }
  if (metricDropdown) n.push(metricDd);
  return { nodes: n, geo, h };
}

// The Graph panel with the display switch and the request-rate chart.
function graphPanel(x, y, w, h) {
  const seg = segmented({ x: x + w - 12 - 500, y: y + 6, items: ['Lines', 'Bars', 'Points', 'Stacked lines', 'Stacked bars'], w: 100, active: 0 });
  return { nodes: [{ block: 'panel', x, y, w, h, title: 'Graph' }, ...seg.nodes, reqChart(x + 8, y + 44, w - 16, h - 52)], geo: { bars: seg.boxes[1], switch: { x: x + w - 12 - 500, y: y + 6, w: 500, h: 32 } } };
}

const actionRow = (x, y) => {
  const geo = { addQuery: { x, y, w: 110, h: 32 }, history: { x: x + 118, y, w: 150, h: 32 }, inspector: { x: x + 276, y, w: 160, h: 32 } };
  return { nodes: [btn(x, y, 110, 'Add query'), btn(x + 118, y, 150, 'Query history'), btn(x + 276, y, 160, 'Query inspector')], geo };
};

// Marks of boxes that touch each other: every highlight first, then every numbered callout, so no outline crosses a number.
const stackedMarks = (list) => [...list.map(([b]) => ({ block: 'highlight', x: b.x, y: b.y, w: b.w, h: b.h })), ...list.map(([b, num]) => ({ block: 'callout', x: b.x + b.w + 3, y: b.y - 3, num }))];

const frame = (h, children, extra = {}) => grafanaFrame({ h, crumbs: ['Explore'], children, ...extra });
const figures = [];

// 01: Explore with the docked navigation (steps 1 and 2)
{
  const tb = toolbarRow({ x0: 244, compact: true });
  const q = queryCard({ x: 244, y: 104, w: 820, kick: true });
  figures.push({
    id: '01-explore-open',
    alt: 'Explore page of Grafana 13.3 with the docked navigation: callout 1 marks the Explore item of the navigation and callout 2 marks the data source picker, which shows Prometheus; below it the empty query A offers the Builder and Code switch',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: ['Explore'], nav: true, navActive: 'Explore', children: [...tb.nodes, ...q.nodes, ...marks([[navRow(3), 1], [tb.geo.picker, 2]])] }),
  });
}

// 02: the metric select open (steps 3 and 4)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, metric: 'http_server_requests_seconds', metricDropdown: { open: true, options: ['http_server_requests_seconds_bucket', 'http_server_requests_seconds_count', 'http_server_requests_seconds_sum'], selected: 1 } });
  const opt = { x: q.geo.metric.x + 4, y: q.geo.metric.y + 32 + 8 + 30, w: 352, h: 28 };
  figures.push({
    id: '02-metric-select',
    alt: 'Explore Builder with the Metric select open and http_server_requests_seconds typed into it, marked by callout 3; the list offers the _bucket, _count and _sum metrics and callout 4 marks http_server_requests_seconds_count',
    width: FW, height: 440,
    nodes: frame(440, [...tb.nodes, ...q.nodes, ...marks([[q.geo.metric, 3], [opt, 4]])]),
  });
}

// 03: the label filter row (steps 5 to 7)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, metric: 'http_server_requests_seconds_count', filter: true });
  figures.push({
    id: '03-label-filter',
    alt: 'Explore Builder with the metric http_server_requests_seconds_count chosen: under Label filters the Add button is marked by callout 5, the label select shows application (callout 6) and the value select shows bookshelf (callout 7) with the operator equals between them',
    width: FW, height: 360,
    nodes: frame(360, [...tb.nodes, ...q.nodes, ...marks([[q.geo.add, 5], [q.geo.label, 6], [q.geo.value, 7]])]),
  });
}

// 04: the Operations menu (steps 8 and 9)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, metric: 'http_server_requests_seconds_count', filter: true });
  const m = menu({ x: 28, y: q.geo.operations.y + 36, w: 230, heading: 'Operations', items: ['Aggregations', 'Range functions', 'Functions', 'Binary operations', 'Trigonometric', 'Time Functions'], hot: 1 });
  figures.push({
    id: '04-operations-menu',
    alt: 'Explore Builder with the Operations menu open, listing the categories Aggregations, Range functions, Functions, Binary operations, Trigonometric and Time Functions: callout 8 marks Range functions, which holds Rate, and callout 9 marks Aggregations, which holds Sum by',
    width: FW, height: 520,
    nodes: frame(520, [...tb.nodes, ...q.nodes, ...m.nodes, ...stackedMarks([[m.rows[1], 8], [m.rows[0], 9]])]),
  });
}

// 05: the two operation cards and Run query (steps 10 to 12)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, metric: 'http_server_requests_seconds_count', filter: true, ops: true });
  const a = actionRow(16, 104 + q.h + 12);
  figures.push({
    id: '05-operations-done',
    alt: 'Explore Builder with the operations Rate, with its Range field set to 1m (callout 10), and Sum by, with its Label field set to status (callout 11); the generated PromQL line is shown under them and the Run query button of the toolbar is marked by callout 12',
    width: FW, height: 460,
    nodes: frame(460, [...tb.nodes, ...q.nodes, ...a.nodes, ...marks([[q.geo.range, 10], [q.geo.sumLabel, 11], [tb.geo.run, 12]])]),
  });
}

// 06: the result: the Graph with its display switch (step 13)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, summary: true });
  const g = graphPanel(16, 168, 1048, 330);
  figures.push({
    id: '06-graph-display-switch',
    alt: 'Explore after Run query: the Graph draws one line for the status 200 and one for 404, and its display switch Lines, Bars, Points, Stacked lines and Stacked bars is marked by callout 13',
    width: FW, height: 520,
    nodes: frame(520, [...tb.nodes, ...q.nodes, ...g.nodes, ...mark(g.geo.switch, 13)]),
  });
}

// 07: Code mode, Explain and Add query (steps 14 to 16)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, mode: 'code', runs: QUERY_RUNS, explain: true });
  figures.push({
    id: '07-code-and-explain',
    alt: 'Explore query A in Code mode with the builder query shown as PromQL in the editor: the Code option of the Builder and Code switch is marked by callout 14, the Explain switch by callout 15 and the Add query button by callout 16',
    width: FW, height: 360,
    nodes: frame(360, [...tb.nodes, ...q.nodes, ...marks([[q.geo.code, 14], [q.geo.explain, 15], [q.geo.addQuery, 16]])]),
  });
}

// 08: the new empty query B and Kick start your query (steps 17 and 18)
{
  const tb = toolbarRow();
  const a = queryCard({ x: 16, y: 104, w: 1048, summary: true });
  const b = queryCard({ x: 16, y: 168, w: 1048, name: 'B', kick: true });
  figures.push({
    id: '08-kick-start',
    alt: 'Explore with query A collapsed to one line and a new empty query B below it: the button Kick start your query of query B is marked by callout 17',
    width: FW, height: 400,
    nodes: frame(400, [...tb.nodes, ...a.nodes, ...b.nodes, ...mark(b.geo.kick, 17)]),
  });
}

// 09: query B in Code mode with histogram_quantile (steps 19 to 21)
{
  const tb = toolbarRow();
  const a = queryCard({ x: 16, y: 104, w: 1048, summary: true });
  const b = queryCard({ x: 16, y: 168, w: 1048, name: 'B', mode: 'code', runs: HQ_RUNS });
  figures.push({
    id: '09-histogram-quantile',
    alt: 'Explore query B in Code mode: the Code option of its switch is marked by callout 19, the editor holds the histogram_quantile query over the http_server_requests_seconds_bucket metric (callout 20) and the Run queries button is marked by callout 21',
    width: FW, height: 400,
    nodes: frame(400, [...tb.nodes, ...a.nodes, ...b.nodes, ...marks([[b.geo.code, 19], [b.geo.editor, 20], [b.geo.run, 21]])]),
  });
}

// 10: Split (steps 22 to 24)
{
  const tb = toolbarRow();
  const left = queryCard({ x: 16, y: 104, w: 516, summary: true });
  const lg = { nodes: [{ block: 'panel', x: 16, y: 168, w: 516, h: 300, title: 'Graph' }, reqChart(24, 206, 500, 256)] };
  const rp = { x: 548, y: 100, w: 516, h: 376 };
  figures.push({
    id: '10-split',
    alt: 'Explore with the Split button of the toolbar marked by callout 22 and, to the right of the first pane, a second Explore pane drawn as a dashed outline and marked by callout 23',
    width: FW, height: 500,
    nodes: frame(500, [
      ...tb.nodes, ...left.nodes, ...lg.nodes,
      box(rp.x, rp.y, rp.w, rp.h, { fill: 'surface', stroke: 'borderStrong', radius: 6, dash: '6 4' }),
      { block: 'dropdown', x: rp.x + 12, y: rp.y + 12, w: 220, value: 'Prometheus' },
      ico(rp.x + rp.w - 28, rp.y + 20, 'close'),
      lbl(rp.x + rp.w / 2, rp.y + 190, 'Second Explore pane', { anchor: 'middle', tone: 'textMuted', box: 300 }),
      ...marks([[tb.geo.split, 22], [rp, 23]]),
    ]),
  });
}

// 11: Query history and the Query inspector (steps 25 to 28)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, summary: true });
  const a = actionRow(16, 168);
  const dy = 216;
  const star = { x: 760, y: dy + 130, w: 28, h: 28 };
  const run = { x: 936, y: dy + 128, w: 112, h: 32 };
  figures.push({
    id: '11-history-and-inspector',
    alt: 'Explore with the Query history drawer open at the bottom: the Query history button is marked by callout 25, the star of the history entry by callout 26 and its Run query button by callout 27, and the Query inspector button is marked by callout 28',
    width: FW, height: 480,
    nodes: frame(480, [
      ...tb.nodes, ...q.nodes, ...a.nodes,
      box(0, dy, FW, 264, { fill: 'surface', stroke: 'borderStrong' }),
      { block: 'tabs', x: 16, y: dy + 8, w: 360, tabs: ['Query history', 'Starred', 'Settings'], active: 0 },
      { block: 'field', x: 640, y: dy + 10, w: 260, placeholder: 'Search queries' },
      { block: 'chip', x: 16, y: dy + 60, str: 'Prometheus' },
      { block: 'logo', x: 16, y: dy + 104, size: 20, key: 'si:prometheus' }, lbl(44, dy + 119, 'Prometheus', { weight: 500, box: 120 }),
      lbl(16, dy + 150, FULL_QUERY, { mono: true, size: 'small', tone: 'editorText', box: 720 }),
      ico(star.x + 6, star.y + 6, 'star'), ico(796, dy + 136, 'edit'),
      btn(run.x, run.y, 112, 'Run query', 'secondary'),
      ...marks([[a.geo.history, 25], [star, 26], [run, 27], [a.geo.inspector, 28]]),
    ]),
  });
}

// 12: the Add menu (steps 29 and 30)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, summary: true });
  const m = menu({ x: tb.geo.add.x, y: 94, w: 190, items: ['Add to dashboard', 'Add correlation'], hot: 0 });
  figures.push({
    id: '12-add-menu',
    alt: 'Explore toolbar with the Add menu open: callout 29 marks the Add button and callout 30 marks the entry Add to dashboard, which sits above Add correlation',
    width: FW, height: 300,
    nodes: frame(300, [...tb.nodes, ...q.nodes, ...m.nodes, ...marks([[tb.geo.add, 29], [m.rows[0], 30]])]),
  });
}

// 13: Drilldown > Metrics (steps 32 to 34)
{
  const items = [
    { label: 'Bookmarks', icon: 'star' }, { label: 'Starred', icon: 'star' }, { label: 'Dashboards', icon: 'dashboard' }, { label: 'Explore', icon: 'explore' },
    { label: 'Drilldown', icon: 'search', chevron: 'down', active: false }, { label: 'Metrics', indent: 1, active: true }, { label: 'Logs', indent: 1 }, { label: 'Traces', indent: 1 }, { label: 'Profiles', indent: 1 },
    { label: 'AI', icon: 'apps' }, { label: 'Alerting', icon: 'bell' }, { label: 'Connections', icon: 'database' }, { label: 'Administration', icon: 'gear' },
  ];
  const names = ['http_server_requests_seconds_bucket', 'http_server_requests_seconds_count', 'http_server_requests_seconds_sum'];
  const search = { x: 244, y: 130, w: 320, h: 32 };
  const nodes = [{ block: 'window', x: 0, y: 0, w: FW, h: 560, radius: 0, children: [
    { block: 'nav', x: 0, y: 0, w: G_NAV_W, h: 560, logo: 'si:grafana', title: 'Grafana', items, active: 'Metrics' },
    { block: 'toolbar', x: G_NAV_W, y: 0, w: FW - G_NAV_W, crumbs: ['Drilldown', 'Metrics'] },
    lbl(244, 84, 'All metrics', { size: 'title', weight: 600, box: 300 }),
    { block: 'dropdown', x: 700, y: 62, w: 190, value: 'Prometheus' }, btn(898, 62, 166, 'Last 1 hour', 'secondary', 'clock'),
    { block: 'field', x: search.x, y: search.y, w: search.w, value: 'http_server' },
    { block: 'dropdown', x: 580, y: 130, w: 200, value: 'Sort by' },
    ...segmented({ x: 800, y: 130, items: ['Grid', 'Rows'], w: 80, active: 0 }).nodes,
    ...names.flatMap((nm, i) => {
      const cx = 244 + i * 280;
      return [
        box(cx, 190, 268, 250, { fill: 'surface', stroke: 'border', radius: 6 }),
        lbl(cx + 12, 214, nm, { size: 'small', weight: 500, box: 244 }),
        { block: 'line', x: cx + 8, y: 228, w: 252, h: 150, series: [{ name: '', points: [3, 4, 3.5, 5, 4.5, 5.5, 5, 6] }], min: 0, max: 8, yLabels: ['0', '4', '8'], legend: false },
        btn(cx + 12, 396, 90, 'Select'),
      ];
    }),
    ...marks([[navRow(5), 32], [search, 33], [{ x: 244 + 280 + 12, y: 396, w: 90, h: 32 }, 34]]),
  ] }];
  figures.push({
    id: '13-drilldown-metrics',
    alt: 'Drilldown Metrics page of Grafana 13.3 with the Drilldown group of the navigation open: callout 32 marks Metrics, callout 33 marks the Quick search metrics box holding http_server, and callout 34 marks the Select button of the metric card http_server_requests_seconds_count among three cards',
    width: FW, height: 560,
    nodes,
  });
}

// 14: the result (What you build)
{
  const tb = toolbarRow();
  const q = queryCard({ x: 16, y: 104, w: 1048, summary: true });
  const g = graphPanel(16, 168, 1048, 330);
  figures.push({
    id: '14-result',
    alt: 'Explore with Prometheus after the guide: the query sum by status of the rate of http_server_requests_seconds_count for the application bookshelf is drawn in the Graph as one line for the status 200 and one for 404',
    width: FW, height: 520,
    nodes: frame(520, [...tb.nodes, ...q.nodes, ...g.nodes]),
  });
}

export default { product: 'grafana', guide: 'g3', figures };
