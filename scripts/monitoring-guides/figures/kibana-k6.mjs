// Figures of the Kibana guide K6, "Time series charts in Lens" (guide-lens-time-series-charts.adoc).
// Facts: guides-brief/kibana-facts.md section 5 (Kibana 9.5.6). Verified there: the Lens editor regions (field list, workspace,
// configuration panel with Legend / Style / Add layer, the layer card with the chart type button and the dashed
// Horizontal axis / Vertical axis / Breakdown buttons) and the dimension editor tab names Quick functions / Formula /
// Static value. NOT VERIFIED there, drawn generically with the names of the task: the chart type menu, the date histogram
// interval control, the Breakdown options (number of values, Other), the Add layer menu, Time shift, the reference line and
// annotation editors, Percentile, Value format. A figure shows the screen the step starts from with the control to act on
// highlighted; callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, menu, kibanaFrame, kDash } from '../lib/shells.mjs';

const figures = [];
const CX = 776, CW = 288, WX = 316, WW = 444;
const DV = 'Bookshelf logs (guides)';
const FIELDS = [['@timestamp', 'D'], ['attributes.status', '#'], ['attributes.uri', 't'], ['body.text', 't'], ['severity_text', 't']];

// ---------------------------------------------------------------- sample data (plausible, not claimed)
const wave = (base, amp, ph, n = 20) => Array.from({ length: n }, (_, i) => Math.round(base + amp * Math.sin(i * 0.7 + ph)));
const sSearch = wave(300, 30, 0), sBooks = wave(120, 18, 1.5), sOther = wave(36, 8, 3);
const total = sSearch.map((v, i) => v + sBooks[i] + sOther[i]);
const shifted = total.map((v, i) => Math.round(total[(i + 4) % 20] * 0.93 + 6));
const yl = ['0', '150', '300', '450', '600'];
const xl = ['10:45', '10:50', '10:55', '11:00'];
const lineAt = (y, h, series, area = false) => ({ block: 'line', x: WX + 12, y, w: WW - 24, h, series, min: 0, max: 600, yLabels: yl, xLabels: xl, area });

// ---------------------------------------------------------------- the Lens screen (local, parametrised)
function filterRow(dataView) {
  const n = [{ block: 'dropdown', x: 16, y: 104, w: 250, value: dataView }, btn(274, 104, 36, '+')];
  const qw = FW - 16 - 318 - 8 - 150 - 8 - 100;
  n.push({ block: 'field', x: 318, y: 104, w: qw, placeholder: 'Filter your data using KQL syntax' });
  n.push(btn(318 + qw + 8, 104, 150, 'Last 15 minutes', 'secondary', 'clock'), btn(318 + qw + 166, 104, 100, 'Refresh', 'secondary', 'refresh'));
  return { nodes: n, dataView: { x: 16, y: 104, w: 250, h: 32 } };
}

function layerCard({ y, type = 'Line', zones, title }) {
  const geo = {};
  const n = [];
  const h = 162 + (zones.length - 1) * 70;
  n.push(box(CX + 12, y, CW - 24, h, { fill: 'canvas', stroke: 'border', radius: 6 }));
  n.push(btn(CX + 24, y + 10, 100, type, 'secondary', 'chevronDown'));
  geo.type = { x: CX + 24, y: y + 10, w: 100, h: 32 };
  n.push(lbl(CX + 24, y + 70, title ?? DV, { size: 'small', tone: 'textMuted', box: CW - 48 }));
  zones.forEach((z, i) => {
    const ly = y + 102 + i * 70;
    n.push(lbl(CX + 24, ly, z.label, { weight: 500, box: CW - 48 }));
    n.push(box(CX + 24, ly + 10, CW - 48, 36, { fill: z.filled ? 'surface' : 'canvas', stroke: 'borderStrong', radius: 4, dash: z.filled ? undefined : '5 3' }));
    n.push(lbl(CX + 36, ly + 33, z.text ?? 'Add or drag-and-drop a field', { size: 'small', tone: z.filled ? 'text' : 'textMuted', box: CW - 72 }));
    geo[z.key ?? z.label] = { x: CX + 24, y: ly + 10, w: CW - 48, h: 36 };
  });
  return { nodes: n, geo, h };
}

const header = (g) => {
  const n = ['Legend', 'Style', 'Add layer'].map((t, i) => btn(CX + 12 + i * 88, 160, 82, t));
  g.addLayer = { x: CX + 12 + 2 * 88, y: 160, w: 82, h: 32 };
  return n;
};

// Flyout over the configuration panel; rows: { kind: 'field'|'toggle'|'code', key, label, value, ... }
function dim({ x = CX, w = CW, h = 480, title, tabs, activeTab = 0, rows = [] }) {
  const nodes = [{ block: 'flyout', x, y: 152, w, h, title }];
  const geo = {};
  let y = 212;
  if (tabs) { nodes.push({ block: 'tabs', x: x + 12, y: 204, w: w - 24, tabs, active: activeTab }); y = 262; }
  for (const r of rows) {
    if (r.kind === 'toggle') {
      nodes.push({ block: 'toggle', x: x + 16, y: y + 6, label: r.label, on: r.on, box: w - 80 });
      geo[r.key] = { x: x + 16, y: y + 6, w: w - 40, h: 18 };
      y += 40;
    } else if (r.kind === 'code') {
      nodes.push({ block: 'queryEditor', x: x + 16, y: y + 8, w: w - 32, h: r.h, lines: r.lines, lineNumbers: false, label: r.label });
      geo[r.key] = { x: x + 16, y: y + 8, w: w - 32, h: r.h };
      y += r.h + 26;
    } else {
      nodes.push({ block: 'field', x: x + 16, y, w: w - 32, label: r.label, value: r.value, placeholder: r.placeholder, focused: r.focused });
      geo[r.key] = { x: x + 16, y: y + 20, w: w - 32, h: 32 };
      y += 64;
    }
  }
  nodes.push(btn(x + 16, 152 + h - 48, 96, 'Close'));
  return { nodes, geo };
}

function lens({ h = 640, dataView = DV, search, fields = FIELDS, hot = [], workspace, side, children }) {
  const fr = kibanaFrame({ h, crumbs: ['Dashboards', 'Visualizations', 'Create'], actions: [{ label: 'Explore in Discover', w: 176 }, { label: 'Inspect', w: 80 }, { label: 'Settings', w: 90 }, { label: 'Save and return', kind: 'primary', w: 150 }] });
  const geo = { ...fr.geo, save: fr.geo['Save and return'], field: {} };
  const row = filterRow(dataView);
  geo.dataView = row.dataView;
  const n = [...row.nodes];
  n.push({ block: 'field', x: 16, y: 152, w: 284, placeholder: 'Search field names', ...(search ? { value: search } : {}) });
  geo.search = { x: 16, y: 152, w: 284, h: 32 };
  n.push(lbl(20, 214, 'Records', { weight: 500 }));
  geo.records = { x: 16, y: 198, w: 284, h: 28 };
  n.push(lbl(20, 250, 'Available fields', { weight: 600, box: 284 }));
  fields.forEach(([f, t], i) => {
    n.push(box(16, 262 + i * 32, 284, 30, { fill: 'surface', stroke: 'border', radius: 4 }));
    n.push(lbl(30, 282 + i * 32, t, { size: 'small', tone: 'textMuted', weight: 600 }));
    n.push(lbl(50, 282 + i * 32, f, { size: 'small', box: 240 }));
    geo.field[f] = { x: 16, y: 262 + i * 32, w: 284, h: 30 };
  });
  n.push(box(WX, 152, WW, h - 160, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(box(CX, 152, CW, h - 160, { fill: 'surface', stroke: 'border', radius: 6 }));
  geo.workspace = { x: WX, y: 152, w: WW, h: h - 160 };
  n.push(...workspace(geo));
  n.push(...side(geo));
  hot.forEach((f) => n.push({ block: 'highlight', ...geo.field[f] }));
  n.push(...(typeof children === 'function' ? children(geo) : children ?? []));
  fr.nodes[0].children.push(...n);
  return fr.nodes;
}

const emptyWs = () => [lbl(WX + WW / 2, 360, 'Drop some fields here to start', { weight: 500, anchor: 'middle', box: WW - 24 })];
const Z3 = (hx, vy, bd) => [
  { label: 'Horizontal axis', text: hx, filled: !!hx, key: 'horizontal' },
  { label: 'Vertical axis', text: vy, filled: !!vy, key: 'vertical' },
  { label: 'Breakdown', text: bd, filled: !!bd, key: 'breakdown' },
];

// 01: the dashboard in view mode (steps 1 and 2)
{
  const d = kDash({ h: 520, mode: 'view', title: 'Bookshelf (guides)', children: (g) => mark(g.Edit, 2) });
  figures.push({ id: '01-dashboard-view', alt: 'Dashboard Bookshelf (guides) of Kibana 9.5 in view mode with the bar chart panel of the first guide; the Edit button of the second bar is marked by callout 2', width: FW, height: 520, nodes: d.nodes });
}

// 02: Add, Visualization (steps 3 and 4)
{
  const d = kDash({ h: 560, mode: 'add', title: 'Bookshelf (guides)', children: (g) => [...mark(g.Add, 3), ...mark(g.addViz, 4)] });
  figures.push({ id: '02-add-visualization', alt: 'Bookshelf (guides) in edit mode with the Add to dashboard flyout open: the Add button of the second bar is marked by callout 3 and the entry Visualization of the flyout by callout 4', width: FW, height: 560, nodes: d.nodes });
}

// 03: the chart type menu (step 5)
{
  const m = menu({ x: CX + 24, y: 250, w: 150, items: ['Bar', 'Area', 'Line'], hot: 2 });
  figures.push({
    id: '03-chart-type', alt: 'Empty Lens editor with the chart type button of the layer open as a menu listing Bar, Area and Line; the entry Line is marked by callout 5', width: FW, height: 640,
    nodes: lens({
      workspace: emptyWs,
      side: (g) => { const c = layerCard({ y: 204, type: 'Bar', zones: Z3() }); return [...header(g), ...c.nodes, ...m.nodes]; },
      children: () => mark(m.rows[2], 5),
    }),
  });
}

// 04: drag @timestamp and Records (steps 6 and 7)
{
  figures.push({
    id: '04-time-axis', alt: 'Lens editor with a Line layer and empty axes; the field @timestamp of the list is dragged onto the Horizontal axis (callout 6) and the entry Records onto the Vertical axis (callout 7)', width: FW, height: 640,
    nodes: lens({
      hot: ['@timestamp'], workspace: emptyWs,
      side: (g) => { const c = layerCard({ y: 204, zones: Z3() }); g.cfg = c.geo; return [...header(g), ...c.nodes]; },
      children: (g) => [...mark(g.cfg.horizontal, 6), ...mark(g.cfg.vertical, 7), { block: 'highlight', ...g.records }],
    }),
  });
}

// 05: the line chart; chart type menu (steps 8 to 10)
{
  figures.push({
    id: '05-line-chart', alt: 'Lens editor with a line chart of Count of records over time, one line; the chart type button of the layer, showing Line, is marked by callout 8', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: 'Count of records', points: total }])],
      side: (g) => { const c = layerCard({ y: 204, zones: Z3('@timestamp', 'Count of records') }); g.cfg = c.geo; return [...header(g), ...c.nodes]; },
      children: (g) => mark(g.cfg.type, 8),
    }),
  });
}

// 06: the interval of the date histogram (step 12)
{
  const f = dim({ title: 'Horizontal axis', rows: [{ key: 'fn', label: 'Function', value: 'Date histogram' }, { key: 'fld', label: 'Field', value: '@timestamp' }, { key: 'interval', label: 'Interval', value: '1 minute', focused: true }] });
  figures.push({
    id: '06-interval', alt: 'Dimension editor of the Horizontal axis in Lens showing the function Date histogram on the field @timestamp, with the Interval control set to 1 minute and marked by callout 12', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: 'Count of records', points: total }])],
      side: () => f.nodes, children: () => mark(f.geo.interval, 12),
    }),
  });
}

// 07: drag attributes.uri onto the Breakdown (step 14)
{
  figures.push({
    id: '07-breakdown', alt: 'Lens editor with the count of records over time as one line; the field attributes.uri of the list is dragged onto the dashed Breakdown button of the layer, which is marked by callout 14', width: FW, height: 640,
    nodes: lens({
      hot: ['attributes.uri'],
      workspace: () => [lineAt(168, 440, [{ name: 'Count of records', points: total }])],
      side: (g) => { const c = layerCard({ y: 204, zones: Z3('@timestamp', 'Count of records') }); g.cfg = c.geo; return [...header(g), ...c.nodes]; },
      children: (g) => mark(g.cfg.breakdown, 14),
    }),
  });
}

// 08: top values and Other (steps 16 and 17)
{
  const f = dim({ title: 'Breakdown', rows: [{ key: 'fn', label: 'Function', value: 'Top values' }, { key: 'fld', label: 'Field', value: 'attributes.uri' }, { key: 'values', label: 'Values', value: '2', focused: true }, { kind: 'toggle', key: 'other', label: 'Other', on: true }] });
  figures.push({
    id: '08-top-values-other', alt: 'Dimension editor of the Breakdown in Lens with Top values on attributes.uri; the Values control set to 2 is marked by callout 16 and the Other switch, turned on, by callout 17; the chart behind shows three lines', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: '/api/search', points: sSearch }, { name: '/api/books', points: sBooks }, { name: 'Other', points: sOther }])],
      side: () => f.nodes, children: () => [...mark(f.geo.values, 16), ...mark(f.geo.other, 17)],
    }),
  });
}

// 09: Add layer menu (steps 19 and 20)
{
  const m = menu({ x: CX + 24, y: 196, w: 220, items: ['Layer', 'Reference line', 'Annotations'], hot: 0 });
  figures.push({
    id: '09-add-layer', alt: 'Lens editor with the Add layer button of the configuration panel open as a menu listing Layer, Reference line and Annotations; the button is marked by callout 19 and the entry Layer by callout 20', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: '/api/search', points: sSearch }, { name: '/api/books', points: sBooks }, { name: 'Other', points: sOther }])],
      side: (g) => { const c = layerCard({ y: 204, zones: Z3('@timestamp', 'Count of records', 'attributes.uri') }); g.cfg = c.geo; return [...header(g), ...c.nodes, ...m.nodes]; },
      children: (g) => [...mark(g.addLayer, 19), ...mark(m.rows[0], 20)],
    }),
  });
}

// 10: Time shift on the second layer (step 24)
{
  const f = dim({ title: 'Vertical axis', rows: [{ key: 'fn', label: 'Function', value: 'Count' }, { key: 'fld', label: 'Field', value: 'Records' }, { key: 'shift', label: 'Time shift', value: '10m', focused: true }] });
  figures.push({
    id: '10-time-shift', alt: 'Dimension editor of the Vertical axis of the second layer in Lens with the function Count on Records; the Time shift control, typed 10m, is marked by callout 24; the chart behind shows the lines of the first layer and a second line that is shifted in time', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: '/api/search', points: sSearch }, { name: '/api/books', points: sBooks }, { name: 'Other', points: sOther }, { name: 'Count of records', points: shifted, color: 'series.4' }])],
      side: () => f.nodes, children: () => mark(f.geo.shift, 24),
    }),
  });
}

// 11: the reference line (step 26)
{
  const f = dim({ x: 664, w: 400, title: 'Reference line', tabs: ['Quick functions', 'Formula', 'Static value'], activeTab: 2, rows: [{ key: 'value', label: 'Value', value: '500', focused: true }] });
  figures.push({
    id: '11-reference-line', alt: 'Reference line editor in Lens with the tab Static value selected and the value 500 typed in the Value control, which is marked by callout 26; the tabs Quick functions and Formula are next to it', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: '/api/search', points: sSearch }, { name: '/api/books', points: sBooks }, { name: 'Other', points: sOther }])],
      side: () => f.nodes, children: () => mark(f.geo.value, 26),
    }),
  });
}

// 12: the annotation (steps 29 and 30)
{
  const f = dim({ title: 'Annotations', rows: [{ key: 'label', label: 'Label', value: 'failing mode on', focused: true }, { key: 'time', label: 'Time', value: '2026-11-11 10:52' }] });
  figures.push({
    id: '12-annotation', alt: 'Annotation editor in Lens with the Label control typed failing mode on, marked by callout 29, and the Time control with a date and time, marked by callout 30', width: FW, height: 640,
    nodes: lens({
      workspace: () => [lineAt(168, 440, [{ name: '/api/search', points: sSearch }, { name: '/api/books', points: sBooks }, { name: 'Other', points: sOther }])],
      side: () => f.nodes, children: () => [...mark(f.geo.label, 29), ...mark(f.geo.time, 30)],
    }),
  });
}

// 13: percentiles of the latency on the traces data view (steps 36 to 38)
{
  const f = dim({ title: 'Vertical axis', rows: [{ key: 'fn', label: 'Function', value: 'Percentile' }, { key: 'fld', label: 'Field', value: 'attributes.transaction.duration.us' }, { key: 'pct', label: 'Percentile', value: '95', focused: true }] });
  const lat = wave(42000, 6000, 0.4);
  figures.push({
    id: '13-percentile', alt: 'Lens editor on the data view Bookshelf traces (guides) with the dimension editor of the Vertical axis: the function Percentile is marked by callout 37 and the percentile value 95 by callout 38', width: FW, height: 640,
    nodes: lens({
      dataView: 'Bookshelf traces (guides)',
      fields: [['@timestamp', 'D'], ['attributes.transaction.duration.us', '#'], ['attributes.event.outcome', 't'], ['attributes.transaction.result', 't'], ['name', 't']],
      workspace: () => [{ block: 'line', x: WX + 12, y: 168, w: WW - 24, h: 440, series: [{ name: 'p95 of duration.us', points: lat }], min: 0, max: 60000, yLabels: ['0', '15000', '30000', '45000', '60000'], xLabels: xl }],
      side: () => f.nodes, children: () => [...mark(f.geo.fn, 37), ...mark(f.geo.pct, 38)],
    }),
  });
}

// 14: formula and value format (steps 44 and 45)
{
  const f = dim({
    x: 664, w: 400, title: 'Vertical axis', tabs: ['Quick functions', 'Formula', 'Static value'], activeTab: 1,
    rows: [
      { kind: 'code', key: 'formula', h: 74, lines: ['count(kql=\'severity_text : "ERROR"\')', '  / count()'] },
      { key: 'fmt', label: 'Value format', value: 'Percent', focused: true },
    ],
  });
  figures.push({
    id: '14-formula', alt: 'Dimension editor of a new Lens chart with the tab Formula selected: the formula that divides the ERROR records by all records is typed in the editor (callout 44) and the Value format control is set to Percent (callout 45)', width: FW, height: 640,
    nodes: lens({
      workspace: () => [{ block: 'line', x: WX + 12, y: 168, w: WW - 24, h: 440, series: [{ name: 'Error ratio', points: wave(3, 2, 0.8).map((v) => Math.max(0, v)) }], min: 0, max: 10, yLabels: ['0%', '2.5%', '5%', '7.5%', '10%'], xLabels: xl }],
      side: () => f.nodes, children: () => [...mark(f.geo.formula, 44), ...mark(f.geo.fmt, 45)],
    }),
  });
}

// 15: the finished dashboard (What you build)
{
  const fr = kibanaFrame({ h: 760, crumbs: ['Dashboards', 'Bookshelf (guides)'], actions: [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }] });
  const pw = 516, ph = 290;
  const p = (x, y, title, chart) => [{ block: 'panel', x, y, w: pw, h: ph, title }, chart];
  const ch = (x, y, series, o = {}) => ({ block: 'line', x: x + 8, y: y + 34, w: pw - 16, h: ph - 42, min: 0, max: 600, yLabels: yl, xLabels: xl, ...o, series });
  fr.nodes[0].children.push(
    { block: 'field', x: 16, y: 104, w: 560, placeholder: 'Filter your data using KQL syntax' },
    btn(584, 104, 150, 'Last 15 minutes', 'secondary', 'clock'), btn(742, 104, 100, 'Refresh', 'secondary', 'refresh'),
    ...p(16, 152, 'Requests per minute by URI', ch(16, 152, [{ name: '/api/search', points: sSearch }, { name: '/api/books', points: sBooks }, { name: 'Other', points: sOther }, { name: 'Count of records', points: shifted, color: 'series.4' }])),
    ...p(548, 152, 'Latency, 95th percentile', ch(548, 152, [{ name: 'p95 duration', points: wave(42000, 6000, 0.4) }], { max: 60000, yLabels: ['0', '15000', '30000', '45000', '60000'] })),
    ...p(16, 456, 'Error ratio', ch(16, 456, [{ name: 'Error ratio', points: wave(3, 2, 0.8).map((v) => Math.max(0, v)) }], { max: 10, yLabels: ['0%', '2.5%', '5%', '7.5%', '10%'] })),
    ...p(548, 456, 'Records by status', { block: 'bar', x: 556, y: 490, w: pw - 16, h: ph - 42, categories: ['200', '404'], series: [{ name: 'Count of records', values: [412, 38] }], max: 500 }),
  );
  figures.push({ id: '15-result', alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode with four panels: requests per minute by URI as lines with a shifted copy, the 95th percentile of the latency, the error ratio and the bar chart of the first guide', width: FW, height: 760, nodes: fr.nodes });
}

void marks;
export default { product: 'kibana', guide: 'k6', figures };
