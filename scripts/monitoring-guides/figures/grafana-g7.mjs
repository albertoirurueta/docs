// Figures of the Grafana guide G7, "Stat, gauge and bar gauge" (guide-stat-gauge-and-bar-gauge.adoc).
// Facts: guides-brief/grafana-facts.md section 7 (option panes of Stat, Gauge and Bar gauge, the suggestions list) and
// section 6 (panel editor flow). NOT VERIFIED in the lab and therefore drawn generically: the Unit picker entries, the
// calculation names of Value options, the value mappings editor (only the category name is verified) and the button
// Add panel of the dashboard below the panels. A figure shows the screen the step starts from; a typing step shows the
// typed value; callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, segmented, grafanaFrame, gDashToolbar, gAddPane, gEditor, reqChart,
} from '../lib/shells.mjs';

const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const kw = (t) => ({ t, kind: 'keyword' });
const lab = (t) => ({ t, kind: 'label' });
const str = (t) => ({ t, kind: 'string' });
const num = (t) => ({ t, kind: 'number' });

const Q_STAT = [
  [kw('sum'), { t: '(' }, kw('rate'), { t: '(http_server_requests_seconds_count{' }, lab('application'), { t: '=' }, str('"bookshelf"'), { t: ',' }],
  [lab('status'), { t: '=~' }, str('"5.."'), { t: '}[' }, num('1m'), { t: '])) /' }],
  [kw('sum'), { t: '(' }, kw('rate'), { t: '(http_server_requests_seconds_count{' }, lab('application'), { t: '=' }, str('"bookshelf"'), { t: '}[' }, num('1m'), { t: '])) ' }, kw('or'), { t: ' ' }, kw('vector'), { t: '(' }, num('0'), { t: ')' }],
];
const Q_POOL = [[num('100'), { t: ' * ' }, kw('sum'), { t: '(hikaricp_connections_active) / ' }, kw('sum'), { t: '(hikaricp_connections_max)' }]];
const Q_URI = [[kw('sum'), { t: ' by (uri) (' }, kw('rate'), { t: '(http_server_requests_seconds_count{' }, lab('application'), { t: '=' }, str('"bookshelf"'), { t: '}[' }, num('1m'), { t: ']))' }]];

const URI_ROWS = [['/api/books', 4.2], ['/api/books/{id}', 2.6], ['/api/loans', 1.1], ['/api/search', 0.9]];

// ---------------------------------------------------------------- shared drawing helpers
// A bar gauge: one bar per row, name at the left, value at the right.
function barGauge({ x, y, w, h, rows, max = 5, mode = 'gradient' }) {
  const n = [];
  const rh = Math.min(36, Math.floor(h / rows.length));
  const lw = 130, vw = 44;
  rows.forEach(([name, v], i) => {
    const ry = y + i * rh;
    n.push(lbl(x, ry + 18, name, { size: 'small', tone: 'textMuted', box: lw - 8 }));
    const bw = w - lw - vw;
    n.push(box(x + lw, ry + 4, bw, 18, { fill: 'surfaceRaised', radius: 3 }));
    n.push(box(x + lw, ry + 4, Math.max(4, (bw * v) / max), 18, { fill: 'threshold.green', radius: 3 }));
    n.push(lbl(x + w, ry + 18, v.toFixed(1), { size: 'small', anchor: 'end', box: vw }));
  });
  return n;
}

// The preview body of the panel editor: an opaque cover over the default preview, then the nodes.
const cover = (nodes) => [box(17, 124, 758, 195, { fill: 'surface' }), ...nodes];
const flatChart = (series, max, yLabels) => ({ block: 'line', x: 24, y: 126, w: 744, h: 190, min: 0, max, yLabels, xLabels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], series });
const ratioChart = () => flatChart([{ name: 'Error ratio', points: Array(13).fill(0) }], 0.1, ['0', '0.025', '0.05', '0.075', '0.1']);
const poolChart = () => flatChart([{ name: 'Connection pool usage', points: [20, 21, 19, 20, 22, 20, 21, 20, 19, 20, 21, 20, 20] }], 100, ['0', '25', '50', '75', '100']);
const uriChart = () => flatChart(URI_ROWS.map(([name, v], i) => ({ name, points: Array(13).fill(0).map((_, j) => v + ((j * 7 + i * 3) % 5 - 2) * 0.05) })), 5, ['0', '1.25', '2.5', '3.75', '5']);
const statTile = ({ value, spark = false }) => cover([
  { block: 'stat', x: 24, y: 130, w: 744, h: 184, value, unit: '' },
  ...(spark ? [box(40, 292, 712, 2, { fill: 'threshold.green' })] : []),
]);
const gaugeTile = () => cover([{ block: 'gauge', x: 244, y: 134, w: 300, h: 180, value: 20, unit: '%', thresholds: [{ upTo: 0.8, color: 'threshold.green' }, { upTo: 1, color: 'threshold.red' }] }]);
const barTile = () => cover(barGauge({ x: 40, y: 140, w: 712, h: 170, rows: URI_ROWS }));

// A code-mode query card drawn over the query area of the editor.
function codeCard({ name = 'A', lines, typed = true }) {
  const g = { code: { x: 692, y: 432, w: 72, h: 32 }, run: { x: 644, y: 472, w: 120, h: 32 }, editor: { x: 28, y: 516, w: 736, h: 98 } };
  const n = [
    box(16, 424, 760, 208, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(28, 450, `${name} (Prometheus)`, { weight: 500, box: 200 }),
    ...segmented({ x: 620, y: 432, items: ['Builder', 'Code'], active: 1 }).nodes,
    btn(28, 472, 150, 'Metrics browser'), btn(644, 472, 120, 'Run queries', 'primary'),
    { block: 'queryEditor', x: g.editor.x, y: g.editor.y, w: g.editor.w, h: g.editor.h, lines: typed ? lines : [[{ t: 'Enter a PromQL query...' }]], lineNumbers: typed },
  ];
  return { nodes: n, geo: g };
}

// The options pane of the editor (right column). sections: [{ label, open, rows }] as in the G6 spec.
function optPane(sections, { title }) {
  const R = { x: 792, w: 272 };
  const x = R.x + 12, w = R.w - 24;
  const n = [
    box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(R.x + 12, 124, title, { weight: 600, box: 140 }), btn(R.x + R.w - 88, 106, 76, 'Change'),
    { block: 'field', x, y: 146, w, placeholder: 'Search options' },
  ];
  const geo = {};
  let y = 190;
  for (const s of sections) {
    n.push(ico(R.x + 8, y + 8, s.open ? 'chevronDown' : 'chevronRight'), lbl(R.x + 32, y + 21, s.label, { weight: 500, box: R.w - 48 }), rule(R.x, y + 32, R.w));
    y += 34;
    if (!s.open) continue;
    for (const r of s.rows) {
      if (r.kind === 'custom') {
        const c = r.build(x, y, w);
        n.push(...c.nodes);
        Object.assign(geo, c.geo);
        y += c.h;
        continue;
      }
      const by = y + 20;
      if (r.kind === 'seg') {
        n.push(lbl(x, y + 12, r.label, { size: 'small', weight: 500, box: w }));
        const iw = Math.floor((w + 8) / r.items.length);
        const sg = segmented({ x, y: by, items: r.items, w: iw, active: r.active });
        n.push(...sg.nodes);
        geo[r.key] = { x, y: by, w: iw * r.items.length, h: 32 };
        sg.boxes.forEach((b, i) => { geo[`${r.key}${i}`] = b; });
      } else if (r.kind === 'select') {
        n.push({ block: 'dropdown', x, y, w, label: r.label, value: r.value });
        geo[r.key] = { x, y: by, w, h: 32 };
      } else {
        n.push({ block: 'field', x, y, w, label: r.label, ...(r.value !== undefined ? { value: r.value } : { placeholder: r.placeholder ?? '' }) });
        geo[r.key] = { x, y: by, w, h: 32 };
      }
      y += 56;
    }
  }
  if (y > 632) throw new Error(`options pane needs ${y} px, the editor offers 632`);
  return { nodes: n, geo };
}
const closed = (...names) => names.map((label) => ({ label, open: false, rows: [] }));

// The panel editor with the query card, preview and options pane replaced by the given ones.
function editor({ title, query, prev = [], pane, right = 'options', children = [] }) {
  return gEditor({
    mode: 'code', typed: true, hasData: false, right, saved: true, title, optTitle: title, crumbs: CRUMBS,
    children: (geo) => [...prev, ...query.nodes, ...(pane ? pane.nodes : []), ...(typeof children === 'function' ? children(geo, query.geo, pane?.geo) : children)],
  });
}
// Suggestion cards of the picker (positions of shells.mjs gEditor, right: 'suggestions').
const CARD = { stat: { x: 934, y: 204, w: 122, h: 108 }, gauge: { x: 804, y: 324, w: 122, h: 108 }, barGauge: { x: 934, y: 324, w: 122, h: 108 } };

const figures = [];

// 01: the dashboard in view mode; Edit (steps 1 and 2)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '01-dashboard-view',
    alt: 'Dashboard Bookshelf (guides) in view mode with its time series panel Requests per second by status; callout 2 marks the Edit button of the toolbar',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes, { block: 'panel', x: 16, y: 106, w: 640, h: 320, title: 'Requests per second by status' }, reqChart(24, 132, 624, 290), ...mark(tb.geo.edit, 2),
    ] }),
  });
}

// 02: edit mode: Add, the Panel tile (steps 3 and 4)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  figures.push({
    id: '02-add-pane',
    alt: 'Dashboard in edit mode with the Add pane of the right sidebar open: callout 3 marks the Add button of the toolbar and callout 4 marks the Panel tile of the pane',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes, { block: 'panel', x: 16, y: 106, w: 740, h: 330, title: 'Requests per second by status' }, reqChart(24, 132, 724, 300),
      ...add.nodes, ...marks([[tb.geo.add, 3], [add.geo.panelTile, 4]]),
    ] }),
  });
}

// 03: stat query typed (steps 6 to 8)
{
  const q = codeCard({ lines: Q_STAT });
  const e = editor({ title: 'New panel', query: q, right: 'empty', children: (g, qg) => marks([[qg.code, 6], [qg.editor, 7], [qg.run, 8]]) });
  figures.push({
    id: '03-stat-query',
    alt: 'Panel editor with query A in Code mode: callout 6 marks the Code option, callout 7 marks the editor with the error ratio query typed over three lines, and callout 8 marks the Run queries button',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 04: the suggestions: Stat (step 9)
{
  const e = editor({ title: 'New panel', query: codeCard({ lines: Q_STAT }), right: 'suggestions', prev: cover([ratioChart()]), children: () => mark(CARD.stat, 9) });
  figures.push({
    id: '04-stat-suggestion',
    alt: 'Panel editor after Run queries for the error ratio: the preview draws a line at zero and the Suggestions list on the right shows Time series, Stat, Gauge and Bar gauge; callout 9 marks Stat',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: Stat: title and unit (steps 10 and 11)
{
  const pane = optPane([
    { label: 'Panel options', open: true, rows: [{ key: 'title', kind: 'field', label: 'Title', value: 'Error ratio' }] },
    ...closed('Value options', 'Stat styles'),
    { label: 'Standard options', open: true, rows: [{ key: 'unit', kind: 'select', label: 'Unit', value: 'percent (0.0-1.0)' }] },
    ...closed('Thresholds', 'Value mappings'),
  ], { title: 'Stat' });
  const e = editor({ title: 'Error ratio', query: codeCard({ lines: Q_STAT }), pane, prev: statTile({ value: '0' }), children: () => marks([[pane.geo.title, 10], [pane.geo.unit, 11]]) });
  figures.push({
    id: '05-stat-title-unit',
    alt: 'Panel editor with the Stat options pane: callout 10 marks the Title field holding Error ratio and callout 11 marks the Unit picker holding the percent unit for a ratio between 0 and 1; the preview shows the value 0',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: Stat: calculation and graph mode (steps 12 and 13)
{
  const pane = optPane([
    ...closed('Panel options'),
    { label: 'Value options', open: true, rows: [
      { key: 'show', kind: 'seg', label: 'Show', items: ['Calculate', 'All values'], active: 0 },
      { key: 'calc', kind: 'select', label: 'Calculation', value: 'Max' },
    ] },
    { label: 'Stat styles', open: true, rows: [
      { key: 'graph', kind: 'seg', label: 'Graph mode', items: ['None', 'Area'], active: 1 },
    ] },
    ...closed('Standard options', 'Thresholds'),
  ], { title: 'Stat' });
  const e = editor({ title: 'Error ratio', query: codeCard({ lines: Q_STAT }), pane, prev: statTile({ value: '0%', spark: true }), children: () => marks([[pane.geo.calc, 12], [pane.geo.graph1, 13]]) });
  figures.push({
    id: '06-stat-calculation',
    alt: 'Panel editor with the Stat options pane: callout 12 marks the Calculation list of Value options, set to Max, and callout 13 marks the Area choice of Graph mode in Stat styles; the preview shows the value 0% with a sparkline',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: Stat: thresholds (step 14)
{
  const pane = optPane([
    ...closed('Value options', 'Stat styles', 'Standard options'),
    { label: 'Thresholds', open: true, rows: [
      { kind: 'custom', build: (x, y, w) => ({
        h: 142,
        nodes: [
          box(x, y + 4, w, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), box(x + 10, y + 18, 12, 12, { fill: 'threshold.green', radius: 6 }), lbl(x + 32, y + 29, 'Base', { box: 80 }),
          box(x, y + 50, w, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), box(x + 10, y + 64, 12, 12, { fill: 'threshold.red', radius: 6 }), lbl(x + 32, y + 75, '0.05', { box: 100 }),
          btn(x, y + 96, 150, 'Add threshold', 'secondary', 'plus'),
        ],
        geo: { thr: { x: x + 28, y: y + 50, w: w - 28, h: 40 } },
      }) },
    ] },
    ...closed('Value mappings'),
  ], { title: 'Stat' });
  const e = editor({ title: 'Error ratio', query: codeCard({ lines: Q_STAT }), pane, prev: statTile({ value: '0%', spark: true }), children: () => mark(pane.geo.thr, 14) });
  figures.push({
    id: '07-stat-thresholds',
    alt: 'Panel editor with the Thresholds section of the Stat options pane open: the list has the base step in green and a red step whose value is 0.05, marked by callout 14, above the Add threshold button',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: Stat: value mapping dialog (step 15)
{
  const pane = optPane([...closed('Value options', 'Stat styles', 'Standard options', 'Thresholds', 'Value mappings')], { title: 'Stat' });
  const row = { x: 292, y: 232, w: 496, h: 40 };
  const e = editor({
    title: 'Error ratio', query: codeCard({ lines: Q_STAT }), pane, prev: statTile({ value: '0%', spark: true }),
    children: () => [
      box(260, 150, 560, 250, { fill: 'surface', stroke: 'borderStrong', radius: 8 }),
      lbl(284, 186, 'Value mappings', { size: 'title', weight: 600, box: 300 }),
      ico(784, 172, 'close', 'textMuted'),
      rule(260, 202, 560),
      { block: 'dropdown', x: 292, y: 232, w: 130, value: 'Value' },
      { block: 'field', x: 432, y: 232, w: 100, value: '0' },
      ico(540, 240, 'chevronRight', 'textMuted'),
      { block: 'field', x: 560, y: 232, w: 228, value: 'No errors' },
      ...mark(row, 15),
    ],
  });
  figures.push({
    id: '08-stat-mapping',
    alt: 'The value mappings editor opened over the panel editor: a mapping of the value 0 to the display text No errors, marked by callout 15',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: gauge query typed (steps 19 to 21)
{
  const q = codeCard({ lines: Q_POOL });
  const e = editor({ title: 'New panel', query: q, right: 'empty', children: (g, qg) => marks([[qg.code, 19], [qg.editor, 20], [qg.run, 21]]) });
  figures.push({
    id: '09-gauge-query',
    alt: 'Panel editor of a new panel with query A in Code mode: callout 19 marks the Code option, callout 20 marks the editor with the connection pool usage query and callout 21 marks the Run queries button',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: the suggestions: Gauge (step 22)
{
  const e = editor({ title: 'New panel', query: codeCard({ lines: Q_POOL }), right: 'suggestions', prev: cover([poolChart()]), children: () => mark(CARD.gauge, 22) });
  figures.push({
    id: '10-gauge-suggestion',
    alt: 'Panel editor after Run queries for the connection pool usage: the preview draws a line around 20 and the Suggestions list on the right shows Time series, Stat, Gauge and Bar gauge; callout 22 marks Gauge',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11: gauge options: title, unit, style (steps 23 to 25)
{
  const pane = optPane([
    { label: 'Panel options', open: true, rows: [{ key: 'title', kind: 'field', label: 'Title', value: 'Connection pool usage' }] },
    ...closed('Value options'),
    { label: 'Gauge', open: true, rows: [{ key: 'style', kind: 'seg', label: 'Style', items: ['Circle', 'Arc'], active: 0 }] },
    { label: 'Standard options', open: true, rows: [{ key: 'unit', kind: 'select', label: 'Unit', value: 'percent (0-100)' }] },
    ...closed('Thresholds'),
  ], { title: 'Gauge' });
  const e = editor({ title: 'Connection pool usage', query: codeCard({ lines: Q_POOL }), pane, prev: gaugeTile(), children: () => marks([[pane.geo.title, 23], [pane.geo.unit, 24], [pane.geo.style1, 25]]) });
  figures.push({
    id: '11-gauge-options',
    alt: 'Panel editor with the Gauge options pane: callout 23 marks the Title field holding Connection pool usage, callout 24 marks the Unit picker holding the percent unit for a 0 to 100 scale and callout 25 marks the Arc choice of Style; the preview shows a gauge at 20 percent',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 12: bar gauge query typed (steps 29 to 31)
{
  const q = codeCard({ lines: Q_URI });
  const e = editor({ title: 'New panel', query: q, right: 'empty', children: (g, qg) => marks([[qg.code, 29], [qg.editor, 30], [qg.run, 31]]) });
  figures.push({
    id: '12-bar-gauge-query',
    alt: 'Panel editor of a new panel with query A in Code mode: callout 29 marks the Code option, callout 30 marks the editor with the request rate by URI query and callout 31 marks the Run queries button',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 13: the suggestions: Bar gauge (step 32)
{
  const e = editor({ title: 'New panel', query: codeCard({ lines: Q_URI }), right: 'suggestions', prev: cover([uriChart()]), children: () => mark(CARD.barGauge, 32) });
  figures.push({
    id: '13-bar-gauge-suggestion',
    alt: 'Panel editor after Run queries for the request rate by URI: the preview draws four lines and the Suggestions list on the right shows Time series, Stat, Gauge and Bar gauge; callout 32 marks Bar gauge',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 14: bar gauge options: title, calculation, display mode, Save (steps 33 to 36)
{
  const pane = optPane([
    { label: 'Panel options', open: true, rows: [{ key: 'title', kind: 'field', label: 'Title', value: 'Requests per second by URI' }] },
    { label: 'Value options', open: true, rows: [{ key: 'calc', kind: 'select', label: 'Calculation', value: 'Mean' }] },
    { label: 'Bar gauge', open: true, rows: [{ key: 'mode', kind: 'seg', label: 'Display mode', items: ['Gradient', 'Retro LCD', 'Basic'], active: 0 }] },
    ...closed('Standard options', 'Thresholds'),
  ], { title: 'Bar gauge' });
  const e = editor({
    title: 'Requests per second by URI', query: codeCard({ lines: Q_URI }), pane, prev: barTile(),
    children: (geo) => marks([[pane.geo.title, 33], [pane.geo.calc, 34], [pane.geo.mode2, 35], [geo.save, 36]]),
  });
  figures.push({
    id: '14-bar-gauge-options',
    alt: 'Panel editor with the Bar gauge options pane: callout 33 marks the Title field holding Requests per second by URI, callout 34 marks the Calculation list set to Mean, callout 35 marks the Basic choice of Display mode and callout 36 marks the Save button of the header; the preview shows one bar per URI',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 15: the finished dashboard (What you build)
{
  const tb = gDashToolbar({ view: true });
  const pw = 340;
  figures.push({
    id: '15-result',
    alt: 'The finished dashboard in view mode: three panels in a row, the stat Error ratio showing No errors, the gauge Connection pool usage at 20 percent and the bar gauge Requests per second by URI with one bar per route, above the time series panel Requests per second by status',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'stat', x: 16, y: 106, w: pw, h: 200, title: 'Error ratio', value: 'No errors', unit: '' },
      box(32, 280, pw - 32, 2, { fill: 'threshold.green' }),
      { block: 'panel', x: 370, y: 106, w: pw, h: 200, title: 'Connection pool usage' },
      { block: 'gauge', x: 410, y: 142, w: 260, h: 160, value: 20, unit: '%', thresholds: [{ upTo: 0.8, color: 'threshold.green' }, { upTo: 1, color: 'threshold.red' }] },
      { block: 'panel', x: 724, y: 106, w: pw, h: 200, title: 'Requests per second by URI' },
      ...barGauge({ x: 740, y: 140, w: pw - 32, h: 150, rows: URI_ROWS }),
      { block: 'panel', x: 16, y: 318, w: 1048, h: 220, title: 'Requests per second by status' },
      reqChart(24, 344, 1032, 190),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g7', figures };
