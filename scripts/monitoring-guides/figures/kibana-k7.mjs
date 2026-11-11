// Figures of the Kibana guide K7, "Metric, gauge and table" (guide-lens-metric-gauge-and-table.adoc).
// Facts: guides-brief/kibana-facts.md section 5 (Kibana 9.5.6). Verified there: the Lens editor regions (field list, workspace,
// configuration panel with the layer card and its dashed "Add or drag-and-drop a field" buttons) and the dimension editor tabs
// Quick functions / Formula / Static value. NOT VERIFIED there, drawn generically with the names of the task: the chart type
// menu, the zones of the Metric, Gauge and Table layers, the secondary metric and its trend badge, the background chart,
// the colour ranges of the gauge, sorting, the colouring of the cells, the summary row and the value format. A figure shows
// the screen the step starts from with the control to act on highlighted; callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, menu, kibanaFrame, kDash } from '../lib/shells.mjs';

const figures = [];
const CX = 776, CW = 288, WX = 316, WW = 444;
const DV = 'Bookshelf logs (guides)';
const FIELDS = [['@timestamp', 'D'], ['attributes.status', '#'], ['attributes.uri', 't'], ['severity_text', 't'], ['body.text', 't']];
const wave = (base, amp, ph, n = 20) => Array.from({ length: n }, (_, i) => Math.round(base + amp * Math.sin(i * 0.7 + ph)));
const FORMULA = 'count(kql=\'severity_text : "ERROR"\') / count()';

// ---------------------------------------------------------------- the Lens screen (local, parametrised)
function filterRow() {
  const n = [{ block: 'dropdown', x: 16, y: 104, w: 250, value: DV }, btn(274, 104, 36, '+')];
  const qw = FW - 16 - 318 - 8 - 150 - 8 - 100;
  n.push({ block: 'field', x: 318, y: 104, w: qw, placeholder: 'Filter your data using KQL syntax' });
  n.push(btn(318 + qw + 8, 104, 150, 'Last 15 minutes', 'secondary', 'clock'), btn(318 + qw + 166, 104, 100, 'Refresh', 'secondary', 'refresh'));
  return n;
}

// zones: [{ label, key, items?: string[] }]; an empty zone is the dashed button, a filled one lists its entries.
function layerCard({ y, type, zones }) {
  const geo = {};
  const n = [];
  let ly = y + 102;
  const rows = [];
  zones.forEach((z) => {
    const items = z.items ?? [];
    const k = Math.max(1, items.length);
    rows.push({ z, ly, items });
    geo[z.key] = { x: CX + 24, y: ly + 10, w: CW - 48, h: 36 + (k - 1) * 42 };
    ly += 10 + k * 42 + 18;
  });
  const h = ly - 18 - y + 14 - 10 + 10;
  n.push(box(CX + 12, y, CW - 24, h, { fill: 'canvas', stroke: 'border', radius: 6 }));
  n.push(btn(CX + 24, y + 10, 100, type, 'secondary', 'chevronDown'));
  geo.type = { x: CX + 24, y: y + 10, w: 100, h: 32 };
  n.push(lbl(CX + 24, y + 70, DV, { size: 'small', tone: 'textMuted', box: CW - 48 }));
  rows.forEach(({ z, ly: zy, items }) => {
    n.push(lbl(CX + 24, zy, z.label, { weight: 500, box: CW - 48 }));
    if (!items.length) {
      n.push(box(CX + 24, zy + 10, CW - 48, 36, { fill: 'canvas', stroke: 'borderStrong', radius: 4, dash: '5 3' }));
      n.push(lbl(CX + 36, zy + 33, 'Add or drag-and-drop a field', { size: 'small', tone: 'textMuted', box: CW - 72 }));
    }
    items.forEach((t, i) => {
      n.push(box(CX + 24, zy + 10 + i * 42, CW - 48, 36, { fill: 'surface', stroke: 'borderStrong', radius: 4 }));
      n.push(lbl(CX + 36, zy + 33 + i * 42, t, { size: 'small', box: CW - 72 }));
      geo[`${z.key}${i}`] = { x: CX + 24, y: zy + 10 + i * 42, w: CW - 48, h: 36 };
    });
  });
  return { nodes: n, geo, h };
}

const header = () => ['Legend', 'Style', 'Add layer'].map((t, i) => btn(CX + 12 + i * 88, 160, 82, t));

// Flyout over the configuration panel; rows: { kind: 'field'|'code'|'toggle', key, label, value, ... }
function dim({ x = CX, w = CW, h = 520, title, tabs, activeTab = 0, rows = [] }) {
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
      nodes.push({ block: 'queryEditor', x: x + 16, y: y + 8, w: w - 32, h: r.h, lines: r.lines, lineNumbers: false });
      geo[r.key] = { x: x + 16, y: y + 8, w: w - 32, h: r.h };
      y += r.h + 26;
    } else if (r.kind === 'ranges') {
      nodes.push(lbl(x + 16, y + 12, 'From', { size: 'small', weight: 500 }), lbl(x + 112, y + 12, 'To', { size: 'small', weight: 500 }), lbl(x + 208, y + 12, 'Color', { size: 'small', weight: 500 }));
      r.items.forEach(([a, b, c], i) => {
        const ry = y + 20 + i * 40;
        nodes.push({ block: 'field', x: x + 16, y: ry, w: 88, value: a }, { block: 'field', x: x + 112, y: ry, w: 88, value: b });
        nodes.push(box(x + 208, ry, 56, 32, { fill: c, radius: 4, stroke: 'borderStrong' }));
      });
      geo[r.key] = { x: x + 16, y: y + 20, w: w - 32, h: r.items.length * 40 - 8 };
      y += 20 + r.items.length * 40 + 12;
    } else {
      nodes.push({ block: 'field', x: x + 16, y, w: w - 32, label: r.label, value: r.value, focused: r.focused });
      geo[r.key] = { x: x + 16, y: y + 20, w: w - 32, h: 32 };
      y += 64;
    }
  }
  nodes.push(btn(x + 16, 152 + h - 48, 96, 'Close'));
  return { nodes, geo };
}

function lens({ h = 640, hot = [], workspace, side, children }) {
  const fr = kibanaFrame({ h, crumbs: ['Dashboards', 'Visualizations', 'Create'], actions: [{ label: 'Explore in Discover', w: 176 }, { label: 'Inspect', w: 80 }, { label: 'Settings', w: 90 }, { label: 'Save and return', kind: 'primary', w: 150 }] });
  const geo = { ...fr.geo, field: {} };
  const n = [...filterRow()];
  n.push({ block: 'field', x: 16, y: 152, w: 284, placeholder: 'Search field names' });
  n.push(lbl(20, 214, 'Records', { weight: 500 }));
  geo.records = { x: 16, y: 198, w: 284, h: 28 };
  n.push(lbl(20, 250, 'Available fields', { weight: 600, box: 284 }));
  FIELDS.forEach(([f, t], i) => {
    n.push(box(16, 262 + i * 32, 284, 30, { fill: 'surface', stroke: 'border', radius: 4 }));
    n.push(lbl(30, 282 + i * 32, t, { size: 'small', tone: 'textMuted', weight: 600 }));
    n.push(lbl(50, 282 + i * 32, f, { size: 'small', box: 240 }));
    geo.field[f] = { x: 16, y: 262 + i * 32, w: 284, h: 30 };
  });
  n.push(box(WX, 152, WW, h - 160, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(box(CX, 152, CW, h - 160, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(...workspace(geo));
  n.push(...side(geo));
  hot.forEach((f) => n.push({ block: 'highlight', ...(f === 'Records' ? geo.records : geo.field[f]) }));
  n.push(...(typeof children === 'function' ? children(geo) : children ?? []));
  fr.nodes[0].children.push(...n);
  return fr.nodes;
}

// ---------------------------------------------------------------- workspaces
const emptyWs = () => [lbl(WX + WW / 2, 360, 'Drop some fields here to start', { weight: 500, anchor: 'middle', box: WW - 24 })];
function metricWs({ secondary = false, trend = false, badge = false } = {}) {
  const x = WX + 12, y = 168, w = WW - 24, h = 300;
  const n = [box(x, y, w, h, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(x + 16, y + 28, 'Count of records', { size: 'title', weight: 500, box: w - 32 })];
  if (trend) wave(30, 12, 0.5, 28).forEach((v, i) => n.push(box(x + 1 + i * ((w - 2) / 28), y + h - 1 - v - 20, (w - 2) / 28 - 2, v + 20, { fill: 'series.1' })));
  n.push(lbl(x + w / 2, y + 150, '1,284', { size: 56, weight: 600, anchor: 'middle', tone: 'textStrong' }));
  if (secondary) n.push(lbl(x + w / 2 - (badge ? 34 : 0), y + 192, 'Error ratio  3.2%', { anchor: 'middle', tone: 'textMuted', box: 200 }));
  if (badge) n.push({ block: 'pill', x: x + w / 2 + 60, y: y + 178, str: '+4.1%', state: 'firing' });
  return n;
}
const gaugeWs = (ranges = true) => [{ block: 'gauge', x: WX + 40, y: 200, w: WW - 80, h: 260, value: 3.2, min: 0, max: 10, unit: '%', label: 'Error ratio', thresholds: ranges ? [{ upTo: 0.2, color: 'threshold.green' }, { upTo: 0.5, color: 'threshold.yellow' }, { upTo: 1, color: 'threshold.red' }] : [{ upTo: 1, color: 'series.0' }] }];
const TROWS = [['/api/search', '301', '12', '4%'], ['/api/books', '118', '26', '22%']];
const tableWs = (cols, rows) => [{ block: 'table', x: WX + 12, y: 168, w: WW - 24, columns: cols, rows, rowHeight: 34 }];

// 01: Add, Visualization (steps 3 and 4)
{
  const d = kDash({ h: 560, mode: 'add', title: 'Bookshelf (guides)', children: (g) => [...mark(g.Add, 3), ...mark(g.addViz, 4)] });
  figures.push({ id: '01-add-visualization', alt: 'Bookshelf (guides) in edit mode with the Add to dashboard flyout open: the Add button of the second bar is marked by callout 3 and the entry Visualization of the flyout by callout 4', width: FW, height: 560, nodes: d.nodes });
}

// 02: the chart type menu, Metric (step 5)
{
  const m = menu({ x: CX + 24, y: 250, w: 150, items: ['Line', 'Metric', 'Gauge'], hot: 1 });
  figures.push({
    id: '02-chart-type-metric', alt: 'Empty Lens editor with the chart type button of the layer open as a menu listing Line, Metric and Gauge; the entry Metric is marked by callout 5', width: FW, height: 640,
    nodes: lens({ workspace: emptyWs, side: (g) => { const c = layerCard({ y: 204, type: 'Bar', zones: [{ label: 'Horizontal axis', key: 'a' }, { label: 'Vertical axis', key: 'b' }, { label: 'Breakdown', key: 'c' }] }); return [...header(), ...c.nodes, ...m.nodes]; }, children: () => mark(m.rows[1], 5) }),
  });
}

// 03: Records onto the Primary metric (step 6)
{
  figures.push({
    id: '03-primary-metric', alt: 'Lens editor with a Metric layer whose zones are Primary metric, Secondary metric, Maximum value and Break down by; the entry Records of the field list is dragged onto the dashed Primary metric button, marked by callout 6', width: FW, height: 680,
    nodes: lens({
      h: 680, hot: ['Records'], workspace: emptyWs,
      side: (g) => { const c = layerCard({ y: 204, type: 'Metric', zones: [{ label: 'Primary metric', key: 'primary' }, { label: 'Secondary metric', key: 'secondary' }, { label: 'Maximum value', key: 'max' }, { label: 'Break down by', key: 'by' }] }); g.cfg = c.geo; return [...header(), ...c.nodes]; },
      children: (g) => mark(g.cfg.primary, 6),
    }),
  });
}

// 04: the secondary metric: formula, value format, trend badge (steps 7 to 9)
{
  const f = dim({
    x: 664, w: 400, title: 'Secondary metric', tabs: ['Quick functions', 'Formula', 'Static value'], activeTab: 1,
    rows: [{ kind: 'code', key: 'formula', h: 74, lines: [FORMULA.slice(0, 36), `  ${FORMULA.slice(37)}`] }, { key: 'name', label: 'Name', value: 'Error ratio' }, { key: 'fmt', label: 'Value format', value: 'Percent' }, { kind: 'toggle', key: 'badge', label: 'Trend badge', on: true }],
  });
  figures.push({
    id: '04-secondary-metric', alt: 'Dimension editor of the Secondary metric in Lens with the tab Formula selected: the formula of the error ratio is typed in the editor (callout 7), the Name control holds Error ratio (callout 8), the Value format control is set to Percent (callout 9) and the Trend badge switch is turned on (callout 10)', width: FW, height: 680,
    nodes: lens({ h: 680, workspace: () => metricWs({ secondary: true, badge: true }), side: () => f.nodes, children: () => [...mark(f.geo.formula, 7), ...mark(f.geo.name, 8), ...mark(f.geo.fmt, 9), ...mark(f.geo.badge, 10)] }),
  });
}

// 05: the background chart of the primary metric (step 10)
{
  const f = dim({ title: 'Primary metric', rows: [{ key: 'fn', label: 'Function', value: 'Count' }, { key: 'fld', label: 'Field', value: 'Records' }, { key: 'bg', label: 'Background chart', value: 'Trend', focused: true }] });
  figures.push({
    id: '05-background-chart', alt: 'Dimension editor of the Primary metric in Lens with the function Count on Records; the Background chart control set to Trend is marked by callout 11, and the metric card behind shows a faint trend under the number', width: FW, height: 680,
    nodes: lens({ h: 680, workspace: () => metricWs({ secondary: true, badge: true, trend: true }), side: () => f.nodes, children: () => mark(f.geo.bg, 11) }),
  });
}

// 06: the chart type menu, Gauge (step 13)
{
  const m = menu({ x: CX + 24, y: 250, w: 150, items: ['Metric', 'Gauge', 'Table'], hot: 1 });
  figures.push({
    id: '06-chart-type-gauge', alt: 'Empty Lens editor of a new visualization with the chart type menu open listing Metric, Gauge and Table; the entry Gauge is marked by callout 14', width: FW, height: 640,
    nodes: lens({ workspace: emptyWs, side: () => { const c = layerCard({ y: 204, type: 'Bar', zones: [{ label: 'Horizontal axis', key: 'a' }, { label: 'Vertical axis', key: 'b' }, { label: 'Breakdown', key: 'c' }] }); return [...header(), ...c.nodes, ...m.nodes]; }, children: () => mark(m.rows[1], 14) }),
  });
}

// 07: the Gauge layer: metric formula and the maximum (steps 14 and 15)
{
  figures.push({
    id: '07-gauge-layer', alt: 'Lens editor with a Gauge layer: the dashed Metric button, where the formula of the error ratio goes, is marked by callout 15 and the dashed Maximum value button by callout 16; the workspace shows an empty gauge', width: FW, height: 680,
    nodes: lens({
      h: 680, workspace: () => gaugeWs(false),
      side: (g) => { const c = layerCard({ y: 204, type: 'Gauge', zones: [{ label: 'Metric', key: 'metric' }, { label: 'Minimum value', key: 'min' }, { label: 'Maximum value', key: 'max' }, { label: 'Goal value', key: 'goal' }] }); g.cfg = c.geo; return [...header(), ...c.nodes]; },
      children: (g) => [...mark(g.cfg.metric, 15), ...mark(g.cfg.max, 16)],
    }),
  });
}

// 08: the colour ranges of the gauge (step 17)
{
  const f = dim({ title: 'Metric', rows: [{ key: 'color', label: 'Color', value: 'By value' }, { kind: 'ranges', key: 'ranges', items: [['0', '0.02', 'threshold.green'], ['0.02', '0.05', 'threshold.yellow'], ['0.05', '0.1', 'threshold.red']] }] });
  figures.push({
    id: '08-gauge-ranges', alt: 'Dimension editor of the Metric of the gauge in Lens with the Color control set to By value and three ranges, from 0 to 0.02 in green, to 0.05 in yellow and to 0.1 in red; the list of ranges is marked by callout 18', width: FW, height: 680,
    nodes: lens({ h: 680, workspace: () => gaugeWs(true), side: () => f.nodes, children: () => mark(f.geo.ranges, 18) }),
  });
}

// 09: the chart type menu, Table (step 20)
{
  const m = menu({ x: CX + 24, y: 250, w: 150, items: ['Gauge', 'Table', 'Bar'], hot: 1 });
  figures.push({
    id: '09-chart-type-table', alt: 'Empty Lens editor of a new visualization with the chart type menu open listing Gauge, Table and Bar; the entry Table is marked by callout 21', width: FW, height: 640,
    nodes: lens({ workspace: emptyWs, side: () => { const c = layerCard({ y: 204, type: 'Bar', zones: [{ label: 'Horizontal axis', key: 'a' }, { label: 'Vertical axis', key: 'b' }, { label: 'Breakdown', key: 'c' }] }); return [...header(), ...c.nodes, ...m.nodes]; }, children: () => mark(m.rows[1], 21) }),
  });
}

// 10: Rows and Metrics (steps 21 and 22)
{
  figures.push({
    id: '10-table-rows-metrics', alt: 'Lens editor with a Table layer whose zones are Rows and Metrics; the field attributes.uri of the list is dragged onto the dashed Rows button (callout 22) and the entry Records onto the dashed Metrics button (callout 23)', width: FW, height: 640,
    nodes: lens({
      hot: ['attributes.uri', 'Records'], workspace: emptyWs,
      side: (g) => { const c = layerCard({ y: 204, type: 'Table', zones: [{ label: 'Rows', key: 'rows' }, { label: 'Metrics', key: 'metrics' }] }); g.cfg = c.geo; return [...header(), ...c.nodes]; },
      children: (g) => [...mark(g.cfg.rows, 22), ...mark(g.cfg.metrics, 23)],
    }),
  });
}

// 11: the third metric: the error ratio (steps 26 and 27)
{
  const f = dim({
    x: 664, w: 400, title: 'Metrics', tabs: ['Quick functions', 'Formula', 'Static value'], activeTab: 1,
    rows: [{ kind: 'code', key: 'formula', h: 74, lines: [FORMULA.slice(0, 36), `  ${FORMULA.slice(37)}`] }, { key: 'name', label: 'Name', value: 'Error ratio', focused: true }, { key: 'fmt', label: 'Value format', value: 'Percent' }],
  });
  const cols = [{ title: 'attributes.uri', w: 2 }, { title: 'Count of records', w: 2 }, { title: 'Errors', w: 1 }];
  figures.push({
    id: '11-table-metrics', alt: 'Dimension editor of the third metric of the table in Lens with the tab Formula selected: the formula of the error ratio is typed in the editor (callout 26) and the Name control holds Error ratio (callout 27); the table behind has the columns attributes.uri, Count of records and Errors', width: FW, height: 680,
    nodes: lens({ h: 680, workspace: () => tableWs(cols, [['/api/search', '301', '12'], ['/api/books', '118', '26']]), side: () => f.nodes, children: () => [...mark(f.geo.formula, 26), ...mark(f.geo.name, 27)] }),
  });
}

// 12: sorting (step 25)
{
  const cols = [{ title: 'attributes.uri', w: 2 }, { title: 'Count of records', w: 2 }, { title: 'Errors', w: 1 }, { title: 'Error ratio', w: 2 }];
  figures.push({
    id: '12-table-sort', alt: 'Lens editor with a Table layer of three metrics and the table preview with the columns attributes.uri, Count of records, Errors and Error ratio; the header of the column Error ratio is marked by callout 28', width: FW, height: 680,
    nodes: lens({
      h: 680, workspace: () => tableWs(cols, [['/api/search', '301', '12', '4%'], ['/api/books', '118', '26', '22%']]),
      side: () => { const c = layerCard({ y: 204, type: 'Table', zones: [{ label: 'Rows', key: 'rows', items: ['attributes.uri'] }, { label: 'Metrics', key: 'metrics', items: ['Count of records', 'Errors', 'Error ratio'] }] }); return [...header(), ...c.nodes]; },
      children: () => mark({ x: WX + 12 + ((WW - 24) * 5) / 7, y: 168, w: ((WW - 24) * 2) / 7, h: 34 }, 28),
    }),
  });
}

// 13: colouring the cells of the Error ratio column (step 29)
{
  const f = dim({ title: 'Error ratio', rows: [{ key: 'fn', label: 'Function', value: 'Formula' }, { key: 'color', label: 'Color by value', value: 'Cell', focused: true }] });
  const cols = [{ title: 'attributes.uri', w: 2 }, { title: 'Count of records', w: 2 }, { title: 'Errors', w: 1 }, { title: 'Error ratio', w: 2 }];
  figures.push({
    id: '13-cell-colour', alt: 'Dimension editor of the Error ratio column of the table in Lens with the Color by value control set to Cell, marked by callout 29; the table behind has four columns', width: FW, height: 680,
    nodes: lens({ h: 680, workspace: () => tableWs(cols, [['/api/search', '301', '12', '4%'], ['/api/books', '118', '26', '22%']]), side: () => f.nodes, children: () => mark(f.geo.color, 29) }),
  });
}

// 14: the summary row of the Errors column (step 30)
{
  const f = dim({ title: 'Errors', rows: [{ key: 'fn', label: 'Function', value: 'Formula' }, { key: 'summary', label: 'Summary row', value: 'Sum', focused: true }] });
  const cols = [{ title: 'attributes.uri', w: 2 }, { title: 'Count of records', w: 2 }, { title: 'Errors', w: 1 }, { title: 'Error ratio', w: 2 }];
  figures.push({
    id: '14-summary-row', alt: 'Dimension editor of the Errors column of the table in Lens with the Summary row control set to Sum and marked by callout 30; the table behind has four columns', width: FW, height: 680,
    nodes: lens({ h: 680, workspace: () => tableWs(cols, [['/api/search', '301', '12', '4%'], ['/api/books', '118', '26', '22%']]), side: () => f.nodes, children: () => mark(f.geo.summary, 30) }),
  });
}

// 14: the finished dashboard (What you build)
{
  const fr = kibanaFrame({ h: 650, crumbs: ['Dashboards', 'Bookshelf (guides)'], actions: [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }] });
  const mx = 24, my = 188;
  const trend = wave(30, 12, 0.5, 28);
  fr.nodes[0].children.push(
    { block: 'field', x: 16, y: 104, w: 560, placeholder: 'Filter your data using KQL syntax' },
    btn(584, 104, 150, 'Last 15 minutes', 'secondary', 'clock'), btn(742, 104, 100, 'Refresh', 'secondary', 'refresh'),
    { block: 'panel', x: 16, y: 152, w: 340, h: 250, title: 'Count of records' },
    ...trend.map((v, i) => box(17 + i * (338 / 28), 400 - v - 20, 338 / 28 - 2, v + 20, { fill: 'series.1' })),
    lbl(186, 290, '1,284', { size: 56, weight: 600, anchor: 'middle', tone: 'textStrong' }),
    lbl(160, 330, 'Error ratio  3.2%', { anchor: 'middle', tone: 'textMuted', box: 200 }),
    { block: 'pill', x: 236, y: 316, str: '+4.1%', state: 'firing' },
    { block: 'panel', x: 372, y: 152, w: 340, h: 250, title: 'Error ratio' },
    { block: 'gauge', x: 392, y: 190, w: 300, h: 200, value: 3.2, min: 0, max: 10, unit: '%', thresholds: [{ upTo: 0.2, color: 'threshold.green' }, { upTo: 0.5, color: 'threshold.yellow' }, { upTo: 1, color: 'threshold.red' }] },
    { block: 'panel', x: 16, y: 418, w: 696, h: 212, title: 'Requests by URI' },
    { block: 'table', x: 28, y: 452, w: 672, columns: [{ title: 'attributes.uri', w: 2 }, { title: 'Count of records', w: 2 }, { title: 'Errors', w: 1 }, { title: 'Error ratio', w: 2 }], rows: [['/api/search', '301', '12', '4%'], ['/api/books', '118', '26', '22%'], ['Sum', '419', '38', '']], rowHeight: 34 },
  );
  void mx; void my;
  figures.push({ id: '15-result', alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode with a metric panel with a secondary metric, a trend badge and a trend in the background, a gauge with coloured ranges and a table of requests by URI with a summary row', width: FW, height: 650, nodes: fr.nodes });
}

void marks;
export default { product: 'kibana', guide: 'k7', figures };
