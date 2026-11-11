// Figures of the Grafana guide G6, "Time series panels" (guide-time-series-panels.adoc).
// Facts: guides-brief/grafana-facts.md section 7 (time series option categories and their controls) and section 6
// (panel editor flow). NOT VERIFIED in the lab and therefore drawn generically: the Unit picker entries, the legend
// calculation names, the Show thresholds list and the field override dialog (only its Axis > Placement values and the
// button Add field override are verified). A figure shows the screen the step starts from; a typing step shows the
// typed value; callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, segmented, grafanaFrame, gDashToolbar, gPanelPane, gEditor, reqChart, timeLabels,
} from '../lib/shells.mjs';

const T = 'Requests per second by status';
const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const SERIES_200 = [8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2, 8.6];
const SERIES_404 = [1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3, 1.2];
const P95 = [0.08, 0.09, 0.08, 0.1, 0.09, 0.11, 0.08, 0.09, 0.09, 0.1, 0.08, 0.09, 0.09];

const kw = (t) => ({ t, kind: 'keyword' });
const QUERY_B = [
  [kw('label_replace'), { t: '(' }, kw('histogram_quantile'), { t: '(' }, { t: '0.95', kind: 'number' }, { t: ',' }],
  [kw('sum'), { t: ' by (le) (' }, kw('rate'), { t: '(http_server_requests_seconds_bucket{' }, { t: 'application', kind: 'label' }, { t: '=' },
    { t: '"bookshelf"', kind: 'string' }, { t: '}[' }, { t: '1m', kind: 'number' }, { t: '))),' }],
  [{ t: '"series"', kind: 'string' }, { t: ', ' }, { t: '"p95 latency"', kind: 'string' }, { t: ', ' }, { t: '""', kind: 'string' }, { t: ', ' }, { t: '""', kind: 'string' }, { t: ')' }],
];

// ---------------------------------------------------------------- the preview of the panel editor
// A time series with up to three series; `kind`: 'shared' (one axis, list legend), 'table' (one axis, table legend at the
// right), 'two' (the latency on its own right axis, table legend). `threshold` draws the threshold 10 as a line.
function preview({ x, y, w, h, kind, threshold = false }) {
  const n = [box(x + 1, y + 24, w - 2, h - 25, { fill: 'surface' })];
  const table = kind !== 'shared';
  const cw = table ? Math.round(w * 0.6) : w - 16;
  const cx = x + 8, cy = y + 26, ch = h - 30;
  const top = 12;
  const a = [{ name: '200', points: SERIES_200 }, { name: '404', points: SERIES_404 }];
  const two = kind === 'two';
  n.push({
    block: 'line', x: cx, y: cy, w: cw, h: ch, min: 0, max: top, yLabels: ['0', '3', '6', '9', '12'], xLabels: timeLabels, legend: kind === 'shared',
    series: two ? a : [...a, { name: 'p95 latency', points: P95 }],
  });
  if (two) {
    n.push({ block: 'line', x: cx, y: cy, w: cw, h: ch, min: 0, max: 0.2, yLabels: ['', '', '', '', ''], legend: false, series: [{ name: 'p95 latency', points: P95, color: 'series.2' }] });
    ['0', '0.05', '0.10', '0.15', '0.20'].forEach((l, i) => n.push(lbl(cx + cw - 4, cy + 8 + (ch - 30) - ((ch - 30) * i) / 4 + 4, l, { size: 'small', tone: 'textMuted', box: 38 })));
  }
  if (threshold) {
    const ph = ch - 8 - 22;
    n.push(box(cx + 44, cy + 8 + ph - (ph * 10) / top - 1, cw - 56, 2, { fill: 'threshold.red' }));
  }
  if (table) {
    const tx = cx + cw + (two ? 44 : 16), tw = x + w - 8 - tx;
    n.push(lbl(tx, cy + 18, 'Name', { size: 'small', weight: 600, tone: 'textMuted', box: 120 }));
    n.push(lbl(tx + tw - 64, cy + 18, 'Mean', { size: 'small', weight: 600, tone: 'textMuted', anchor: 'end', box: 60 }));
    n.push(lbl(tx + tw, cy + 18, 'Max', { size: 'small', weight: 600, tone: 'textMuted', anchor: 'end', box: 60 }));
    n.push(rule(tx, cy + 26, tw));
    [['200', 'series.0', '8.51', '8.9'], ['404', 'series.1', '1.23', '1.5'], ['p95 latency', 'series.2', '0.09', '0.11']].forEach(([name, col, mean, max], i) => {
      const ry = cy + 50 + i * 26;
      n.push(box(tx, ry - 8, 10, 3, { fill: col, radius: 1 }));
      n.push(lbl(tx + 16, ry, name, { size: 'small', box: 110 }));
      n.push(lbl(tx + tw - 64, ry, mean, { size: 'small', anchor: 'end', box: 56 }));
      n.push(lbl(tx + tw, ry, max, { size: 'small', anchor: 'end', box: 56 }));
    });
  }
  return n;
}
const EDITOR_PREVIEW = { x: 16, y: 100, w: 760, h: 220 };

// ---------------------------------------------------------------- the options pane (right column of the editor)
// sections: [{ label, open, rows: [{ key, kind: 'seg'|'select'|'field'|'toggle'|'custom', label, ... }] }]
function optPane(sections, { title = 'Time series' } = {}) {
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
      if (r.kind === 'toggle') {
        n.push({ block: 'toggle', x, y: y + 2, label: r.label, on: !!r.on, box: w - 50 });
        geo[r.key] = { x, y, w, h: 24 };
        y += 30;
      } else if (r.kind === 'custom') {
        const c = r.build(x, y, w);
        n.push(...c.nodes);
        Object.assign(geo, c.geo);
        y += c.h;
      } else {
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
  }
  if (y > 632) throw new Error(`options pane needs ${y} px, the editor offers 632`);
  return { nodes: n, geo, end: y };
}
const closed = (...names) => names.map((label) => ({ label, open: false, rows: [] }));

// The panel editor (as in the pilot) with a custom options pane and preview drawn over the default ones.
function editor({ pane, prev, query, children = [] }) {
  const e = gEditor({
    mode: 'code', typed: true, hasData: true, right: 'options', saved: true, title: T, optTitle: T, crumbs: CRUMBS,
    children: (geo) => [...(prev ? preview({ ...EDITOR_PREVIEW, ...prev }) : []), ...(pane ? pane.nodes : []), ...(query ?? []), ...(typeof children === 'function' ? children(geo) : children)],
  });
  return e;
}

const figures = [];

// A dashboard with the first panel (view or edit mode)
function dashboard({ view = false, withPane = false, h = 460 }) {
  const tb = gDashToolbar({ view, saved: !view });
  const pw = withPane ? 740 : 640;
  const n = [...tb.nodes, { block: 'panel', x: 16, y: 106, w: pw, h: withPane ? 330 : 320, title: T }, reqChart(24, 132, pw - 16, withPane ? 300 : 290)];
  return { nodes: n, tb };
}

// 01: the dashboard in view mode; Edit (steps 1 and 2)
{
  const d = dashboard({ view: true });
  figures.push({
    id: '01-dashboard-view',
    alt: 'Dashboard Bookshelf (guides) in view mode with its one panel, Requests per second by status; callout 2 marks the Edit button of the toolbar',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [...d.nodes, ...mark(d.tb.geo.edit, 2)] }),
  });
}

// 02: edit mode, the panel selected, the Panel pane (steps 3 and 4)
{
  const d = dashboard({ withPane: true });
  const pane = gPanelPane({ title: T });
  figures.push({
    id: '02-select-panel',
    alt: 'Dashboard in edit mode: callout 3 marks the panel Requests per second by status, which is selected, and the Panel pane of the right sidebar has its Edit visualization button marked by callout 4',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...d.nodes, ...pane.nodes, ...marks([[{ x: 16, y: 106, w: 740, h: 330 }, 3], [pane.geo.edit, 4]]),
    ] }),
  });
}

// 03: the panel editor; Add query (step 5)
{
  const e = editor({ children: () => mark({ x: 28, y: 582, w: 110, h: 32 }, 5) });
  figures.push({
    id: '03-add-query',
    alt: 'Panel editor of the time series panel with query A in Code mode; callout 5 marks the Add query button under the query',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 04: query B: Code, typed, Run queries (steps 6 to 8)
{
  const geoCode = { x: 692, y: 482, w: 72, h: 32 };
  const geoEditor = { x: 28, y: 556, w: 736, h: 74 };
  const geoRun = { x: 644, y: 520, w: 120, h: 32 };
  const q = [
    box(16, 424, 760, 208, { fill: 'canvas' }),
    box(16, 424, 760, 44, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(28, 451, 'A (Prometheus)', { weight: 500, box: 200 }),
    box(16, 474, 760, 158, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(28, 500, 'B (Prometheus)', { weight: 500, box: 200 }),
    ...segmented({ x: 620, y: 482, items: ['Builder', 'Code'], active: 1 }).nodes,
    btn(28, 520, 150, 'Metrics browser'), btn(644, 520, 120, 'Run queries', 'primary'),
    { block: 'queryEditor', x: 28, y: 556, w: 736, h: 74, lines: QUERY_B },
    ...marks([[geoCode, 6], [geoEditor, 7], [geoRun, 8]]),
  ];
  const e = editor({ query: q });
  figures.push({
    id: '04-query-b',
    alt: 'Panel editor with a second query B in Code mode: callout 6 marks the Code option of query B, callout 7 marks the editor with the latency query typed over three lines, and callout 8 marks the Run queries button',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: Legend: Mode Table, Values (steps 9 and 10)
{
  const pane = optPane([
    ...closed('Panel options', 'Tooltip'),
    { label: 'Legend', open: true, rows: [
      { key: 'vis', kind: 'toggle', label: 'Visibility', on: true },
      { key: 'mode', kind: 'seg', label: 'Mode', items: ['List', 'Table'], active: 0 },
      { key: 'place', kind: 'seg', label: 'Placement', items: ['Bottom', 'Right'], active: 0 },
      { key: 'values', kind: 'field', label: 'Values', placeholder: 'Choose' },
    ] },
    ...closed('Axis', 'Graph styles', 'Standard options', 'Thresholds'),
  ]);
  const e = editor({ pane, prev: { kind: 'shared' }, children: () => marks([[pane.geo.mode1, 9], [pane.geo.values, 10]]) });
  figures.push({
    id: '05-legend',
    alt: 'Panel editor with the Time series options pane and its Legend section open: the preview draws three lines on one axis with a list legend, callout 9 marks the Table option of Mode and callout 10 marks the Values field',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: Standard options: Unit (step 11)
{
  const pane = optPane([
    ...closed('Legend', 'Axis', 'Graph styles'),
    { label: 'Standard options', open: true, rows: [
      { key: 'unit', kind: 'select', label: 'Unit', value: 'Choose' },
      { key: 'min', kind: 'field', label: 'Min', placeholder: 'auto' },
      { key: 'max', kind: 'field', label: 'Max', placeholder: 'auto' },
    ] },
    ...closed('Thresholds'),
  ]);
  const e = editor({ pane, prev: { kind: 'table' }, children: () => mark(pane.geo.unit, 11) });
  figures.push({
    id: '06-unit',
    alt: 'Panel editor with the Standard options section of the options pane open: callout 11 marks the Unit picker above the Min and Max fields; the preview now shows a table legend with Mean and Max',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: Axis: Label, Soft min (steps 12 and 13)
{
  const pane = optPane([
    ...closed('Legend'),
    { label: 'Axis', open: true, rows: [
      { key: 'place', kind: 'seg', label: 'Placement', items: ['Auto', 'Left', 'Right', 'Hidden'], active: 0 },
      { key: 'label', kind: 'field', label: 'Label', value: 'Requests per second' },
      { key: 'softMin', kind: 'field', label: 'Soft min', value: '0' },
      { key: 'softMax', kind: 'field', label: 'Soft max', placeholder: '' },
    ] },
    ...closed('Graph styles', 'Standard options', 'Thresholds'),
  ]);
  const e = editor({ pane, prev: { kind: 'table' }, children: () => marks([[pane.geo.label, 12], [pane.geo.softMin, 13]]) });
  figures.push({
    id: '07-axis',
    alt: 'Panel editor with the Axis section of the options pane open: callout 12 marks the Label field holding Requests per second and callout 13 marks the Soft min field holding 0, below the Placement choices Auto, Left, Right and Hidden',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: Graph styles: Line width, Fill opacity, Gradient mode (steps 14 to 16)
{
  const pane = optPane([
    ...closed('Legend', 'Axis'),
    { label: 'Graph styles', open: true, rows: [
      { key: 'style', kind: 'seg', label: 'Style', items: ['Lines', 'Bars', 'Points'], active: 0 },
      { key: 'width', kind: 'field', label: 'Line width', value: '2' },
      { key: 'fill', kind: 'field', label: 'Fill opacity', value: '20' },
      { key: 'gradient', kind: 'seg', label: 'Gradient mode', items: ['None', 'Opacity', 'Hue', 'Scheme'], active: 0 },
    ] },
    ...closed('Standard options', 'Thresholds'),
  ]);
  const e = editor({ pane, prev: { kind: 'table' }, children: () => marks([[pane.geo.width, 14], [pane.geo.fill, 15], [pane.geo.gradient1, 16]]) });
  figures.push({
    id: '08-graph-styles',
    alt: 'Panel editor with the Graph styles section of the options pane open: callout 14 marks the Line width field holding 2, callout 15 marks the Fill opacity field holding 20 and callout 16 marks the Opacity choice of Gradient mode',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: Thresholds: value, Show thresholds (steps 17 and 18)
{
  const pane = optPane([
    ...closed('Legend', 'Axis', 'Graph styles', 'Standard options'),
    { label: 'Thresholds', open: true, rows: [
      { kind: 'custom', build: (x, y, w) => ({
        h: 132,
        nodes: [
          box(x, y + 4, w, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), box(x + 10, y + 18, 12, 12, { fill: 'threshold.green', radius: 6 }),
          lbl(x + 32, y + 29, 'Base', { box: 80 }),
          box(x, y + 50, w, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), box(x + 10, y + 64, 12, 12, { fill: 'threshold.red', radius: 6 }),
          lbl(x + 32, y + 75, '10', { box: 100 }),
          btn(x, y + 96, 150, 'Add threshold', 'secondary', 'plus'),
        ],
        geo: { thr: { x: x + 28, y: y + 50, w: w - 28, h: 40 } },
      }) },
      { key: 'show', kind: 'select', label: 'Show thresholds', value: 'As lines' },
    ] },
  ]);
  const e = editor({ pane, prev: { kind: 'table' }, children: () => marks([[pane.geo.thr, 17], [pane.geo.show, 18]]) });
  figures.push({
    id: '09-thresholds',
    alt: 'Panel editor with the Thresholds section of the options pane open: the list has the base step in green and a red step whose value is 10, marked by callout 17, then the Add threshold button and the Show thresholds list, marked by callout 18',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: bottom of the pane: Add field override (step 19)
{
  const pane = optPane([...closed('Legend', 'Axis', 'Graph styles', 'Standard options', 'Thresholds')]);
  const ob = { x: 804, y: pane.end + 16, w: 248, h: 32 };
  const e = editor({ pane, prev: { kind: 'table', threshold: true }, children: () => [btn(ob.x, ob.y, ob.w, 'Add field override'), ...mark(ob, 19)] });
  figures.push({
    id: '10-add-override',
    alt: 'Panel editor with the sections of the options pane collapsed; the preview shows a red threshold line at 10, and callout 19 marks the Add field override button at the bottom of the options pane',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11: the override: matcher, Axis placement, Unit (steps 20 to 22)
{
  const pane = optPane([
    ...closed('Thresholds'),
    { label: 'Overrides', open: true, rows: [
      { kind: 'custom', build: (x, y, w) => ({
        h: 250,
        nodes: [
          box(x, y + 4, w, 238, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }),
          { block: 'dropdown', x: x + 8, y: y + 12, w: w - 16, value: 'p95 latency' },
          lbl(x + 12, y + 74, 'Axis > Placement', { size: 'small', weight: 500, box: w - 24 }),
          ...segmented({ x: x + 8, y: y + 82, items: ['Auto', 'Left', 'Right', 'Hidden'], w: Math.floor((w - 16) / 4), active: 2 }).nodes,
          lbl(x + 12, y + 138, 'Standard options > Unit', { size: 'small', weight: 500, box: w - 24 }),
          { block: 'dropdown', x: x + 8, y: y + 146, w: w - 16, value: 'seconds' },
          btn(x + 8, y + 196, w - 16, 'Add override property', 'secondary', 'plus'),
        ],
        geo: {
          matcher: { x: x + 8, y: y + 12, w: w - 16, h: 32 },
          right: { x: x + 8 + 2 * Math.floor((w - 16) / 4), y: y + 82, w: Math.floor((w - 16) / 4), h: 32 },
          unit: { x: x + 8, y: y + 146, w: w - 16, h: 32 },
        },
      }) },
    ] },
  ]);
  const e = editor({ pane, prev: { kind: 'two', threshold: true }, children: () => marks([[pane.geo.matcher, 20], [pane.geo.right, 21], [pane.geo.unit, 22]]) });
  figures.push({
    id: '11-override',
    alt: 'Panel editor with an override in the options pane: callout 20 marks the field selection p95 latency, callout 21 marks the Right choice of the property Axis placement and callout 22 marks the Unit property set to seconds; the preview draws the latency on its own right axis',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 12: Save (steps 23 to 27)
{
  const pane = optPane([...closed('Legend', 'Axis', 'Graph styles', 'Standard options', 'Thresholds', 'Overrides')]);
  const e = editor({ pane, prev: { kind: 'two', threshold: true }, children: (geo) => mark(geo.save, 23) });
  figures.push({
    id: '12-save',
    alt: 'Panel editor with the finished panel: three series, the latency on a right axis, a table legend and a threshold line at 10; callout 23 marks the Save button of the editor header',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 13: the finished dashboard (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '13-result',
    alt: 'The finished panel in view mode: lines for the status 200 and 404 on the left axis, the p95 latency on a right axis, a red threshold line at 10 and a table legend with Mean and Max',
    width: FW, height: 500,
    nodes: grafanaFrame({ h: 500, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 1048, h: 370, title: T },
      ...preview({ x: 16, y: 106, w: 1048, h: 370, kind: 'two', threshold: true }),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g6', figures };
