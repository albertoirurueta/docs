// Figures of the Kibana guide K8, "Proportion and distribution charts" (guide-lens-proportion-and-distribution-charts.adoc).
// Facts: guides-brief/kibana-facts.md section 5 (Kibana 9.5.6). Verified there: the dashboard view and edit toolbars, the Add to
// dashboard flyout and its Visualization entry, and the Lens editor regions (top actions, data view row, field list,
// workspace, configuration panel with Legend / Style / Add layer, chart type button, dashed drop zones).
// NOT VERIFIED there (drawn generically, with the names of the Elastic chart pages and of lens.adoc): the chart type list of
// the layer card, the drop zone names of the partition charts (Slice by, Metric) and of the heat map (Horizontal axis,
// Vertical axis, Cell value), and the Save and return behaviour. Callout numbers are the step numbers of the page; a figure
// shows the screen as the step starts, with the control to act on highlighted.
import { FW, lbl, box, btn, mark, marks, menu, kibanaFrame, kFilterRow, kDash } from '../lib/shells.mjs';

const figures = [];
const H = 640;
const URIS = [['/api/search', 41], ['/api/books', 34], ['/api/loans', 25]];
const URI_COLOURS = ['series.0', 'series.2', 'series.4'];
const TYPES = ['Bar', 'Line', 'Metric', 'Donut', 'Pie', 'Treemap', 'Mosaic', 'Waffle', 'Heat map', 'Tag cloud'];

// ---------------------------------------------------------------- the partition and heat map drawings of the workspace
function pieDraw(x, y, w, h, donut) {
  return { block: 'pie', x, y, w, h, donut, slices: URIS.map(([label, value], i) => ({ label, value, color: URI_COLOURS[i] })) };
}

// A treemap: three tiles by URI; `nested` adds a small 404 tile in every URI tile.
function treemapDraw(x, y, w, h, nested) {
  const out = [];
  const lw = Math.round(w * 0.41), rw = w - lw - 4;
  const tiles = [
    { l: URIS[0][0], x, y, w: lw, h, c: URI_COLOURS[0] },
    { l: URIS[1][0], x: x + lw + 4, y, w: rw, h: Math.round(h * 0.58), c: URI_COLOURS[1] },
    { l: URIS[2][0], x: x + lw + 4, y: y + Math.round(h * 0.58) + 4, w: rw, h: h - Math.round(h * 0.58) - 4, c: URI_COLOURS[2] },
  ];
  tiles.forEach((t) => {
    out.push(box(t.x, t.y, t.w, t.h, { fill: t.c, radius: 3 }));
    out.push(lbl(t.x + 10, t.y + 20, t.l, { size: 'small', weight: 500, box: t.w - 16 }));
    if (nested) out.push(box(t.x + t.w - 54, t.y + t.h - 34, 46, 26, { fill: 'surface', radius: 3 }), lbl(t.x + t.w - 31, t.y + t.h - 16, '404', { size: 'small', anchor: 'middle', box: 40 }));
  });
  return out;
}

// A waffle of 100 squares: 88 for status 200 and 12 for status 404.
function waffleDraw(x, y, size) {
  const out = [];
  const cell = Math.floor(size / 10);
  for (let i = 0; i < 100; i++) {
    const col = Math.floor(i / 10), row = 9 - (i % 10);
    out.push(box(x + col * cell, y + row * cell, cell - 3, cell - 3, { fill: i < 88 ? 'series.0' : 'series.4', radius: 2 }));
  }
  out.push(box(x + 10 * cell + 14, y + 4, 10, 10, { fill: 'series.0', radius: 2 }), lbl(x + 10 * cell + 30, y + 14, '200  88%', { size: 'small', tone: 'textMuted', box: 90 }));
  out.push(box(x + 10 * cell + 14, y + 26, 10, 10, { fill: 'series.4', radius: 2 }), lbl(x + 10 * cell + 30, y + 36, '404  12%', { size: 'small', tone: 'textMuted', box: 90 }));
  return out;
}

// A mosaic: one column per status (width by share), stacked by URI.
function mosaicDraw(x, y, w, h) {
  const out = [];
  const w200 = Math.round(w * 0.88) - 2;
  [[x, w200, '200'], [x + w200 + 4, w - w200 - 4, '404']].forEach(([cx, cw, name]) => {
    let cy = y;
    URIS.forEach(([l, v], i) => {
      const ch = Math.round((h - 20) * v / 100);
      out.push(box(cx, cy, cw, ch - 2, { fill: URI_COLOURS[i], radius: 2 }));
      if (cw > 120) out.push(lbl(cx + 10, cy + 20, l, { size: 'small', weight: 500, box: cw - 16 }));
      cy += ch;
    });
    out.push(lbl(cx + cw / 2, y + h - 4, name, { size: 'small', tone: 'textMuted', anchor: 'middle', box: Math.max(cw, 30) }));
  });
  return out;
}

// A tag cloud: the URIs as words, sized by the count.
function tagCloudDraw(x, y, w, h) {
  return [
    lbl(x + w / 2, y + h / 2 - 20, '/api/search', { size: 28, weight: 600, tone: 'series.0', anchor: 'middle', box: w - 20 }),
    lbl(x + w / 2 - 30, y + h / 2 + 30, '/api/books', { size: 22, weight: 500, tone: 'series.2', anchor: 'middle', box: w - 20 }),
    lbl(x + w / 2 + 80, y + h / 2 + 78, '/api/loans', { size: 16, tone: 'series.4', anchor: 'middle', box: w - 20 }),
  ];
}

// A heat map: URI rows by time columns; busy cells are darker.
function heatDraw(x, y, w, h) {
  const rows = ['/api/search', '/api/books', '/api/loans'];
  const out = [];
  rows.forEach((r, i) => out.push(lbl(x, y + i * ((h - 20) / 3) + (h - 20) / 6 + 4, r, { size: 'small', tone: 'textMuted', box: 84 })));
  out.push({ block: 'heatmap', x: x + 88, y, w: w - 88, h, color: 'series.0', colLabels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'], values: [
    [0.9, 0.8, 0.95, 0.85, 0.9, 0.8], [0.6, 0.7, 0.55, 0.65, 0.6, 0.7], [0.3, 0.35, 0.25, 0.4, 0.3, 0.35],
  ] });
  return out;
}

// ---------------------------------------------------------------- the Lens editor (any chart type)
// zones: [{ label, text, filled }] drawn in the layer card; `work` draws the chart in the workspace; `list` opens the chart
// type list with the entries `hot` highlighted (an array of [typeName, number]).
function lens({ type = 'Bar', search, fields, zones, work, list, save = 'Save and return', children }) {
  const actions = [{ label: 'Explore in Discover', w: 176 }, { label: 'Inspect', w: 80 }, { label: 'Settings', w: 90 }, { label: save, kind: 'primary', w: 150 }];
  const fr = kibanaFrame({ h: H, crumbs: ['Dashboards', 'Visualizations', 'Create'], actions });
  const geo = { ...fr.geo, save: fr.geo[save] };
  const n = [];
  const row = kFilterRow({ dataView: 'Bookshelf logs (guides)' });
  n.push(...row.nodes);
  const LX = 16, LW = 284;
  n.push({ block: 'field', x: LX, y: 152, w: LW, placeholder: 'Search field names', ...(search ? { value: search } : {}) });
  n.push(lbl(LX + 4, 214, 'Records', { weight: 500 }));
  geo.records = { x: LX, y: 198, w: LW, h: 28 };
  n.push(lbl(LX + 4, 250, 'Available fields', { weight: 600, box: LW }));
  geo.fields = {};
  fields.forEach((f, i) => {
    n.push(box(LX, 262 + i * 32, LW, 30, { fill: 'surface', stroke: 'border', radius: 4 }));
    n.push(lbl(LX + 34, 282 + i * 32, f, { box: LW - 44 }));
    n.push(lbl(LX + 14, 282 + i * 32, f === '@timestamp' ? 'D' : f === 'attributes.status' ? '#' : 't', { size: 'small', tone: 'textMuted', weight: 600 }));
    geo.fields[f] = { x: LX, y: 262 + i * 32, w: LW, h: 30 };
  });
  const WX = 316, WW = 444;
  n.push(box(WX, 152, WW, 480, { fill: 'surface', stroke: 'border', radius: 6 }));
  if (work) n.push(...work(WX + 16, 172, WW - 32, 440));
  else {
    n.push(lbl(WX + WW / 2, 360, 'Drop some fields here to start', { weight: 500, anchor: 'middle', box: WW - 24 }));
    n.push(lbl(WX + WW / 2, 386, 'Lens is the recommended editor for creating visualizations', { size: 'small', tone: 'textMuted', anchor: 'middle', box: WW - 16 }));
  }
  const CX = 776, CW = 288;
  n.push(box(CX, 152, CW, 480, { fill: 'surface', stroke: 'border', radius: 6 }));
  ['Legend', 'Style', 'Add layer'].forEach((t, i) => n.push(btn(CX + 12 + i * 88, 160, 82, t)));
  n.push(box(CX + 12, 204, CW - 24, 412, { fill: 'canvas', stroke: 'border', radius: 6 }));
  n.push(btn(CX + 24, 214, 150, type, 'secondary', 'chevronDown'));
  geo.typeButton = { x: CX + 24, y: 214, w: 150, h: 32 };
  n.push(lbl(CX + 24, 276, 'Bookshelf logs (guides)', { size: 'small', tone: 'textMuted', box: CW - 48 }));
  geo.zone = [];
  zones.forEach((z, i) => {
    const y = 306 + i * 70;
    n.push(lbl(CX + 24, y, z.label, { weight: 500, box: CW - 48 }));
    n.push(box(CX + 24, y + 10, CW - 48, 36, { fill: z.filled ? 'surface' : 'canvas', stroke: 'borderStrong', radius: 4, dash: z.filled ? undefined : '5 3' }));
    n.push(lbl(CX + 36, y + 33, z.text, { size: 'small', tone: z.filled ? 'text' : 'textMuted', box: CW - 72 }));
    geo.zone.push({ x: CX + 24, y: y + 10, w: CW - 48, h: 36 });
  });
  if (list) {
    const m = menu({ x: CX + 24, y: 250, w: 170, items: TYPES, hot: -1 });
    n.push(...m.nodes);
    geo.rows = {};
    TYPES.forEach((t, i) => { geo.rows[t] = m.rows[i]; });
  }
  const extra = typeof children === 'function' ? children(geo) : children ?? [];
  fr.nodes[0].children.push(...n, ...extra);
  return { nodes: fr.nodes, geo };
}

const sliceZones = (filled) => [
  { label: 'Slice by', text: filled >= 1 ? 'attributes.uri' : 'Add or drag-and-drop a field', filled: filled >= 1 },
  { label: 'Metric', text: filled >= 2 ? 'Count of records' : 'Add or drag-and-drop a field', filled: filled >= 2 },
];

// ---------------------------------------------------------------- a dashboard with the donut (and the heat map)
function dash({ mode, heat = false, children }) {
  const view = mode === 'view';
  const actions = view
    ? [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }]
    : [{ label: 'Exit edit', w: 100 }, { label: 'Add', w: 84, icon: 'plus' }, { label: 'More', w: 80 }, { label: 'Save', kind: 'primary', w: 80 }];
  const fr = kibanaFrame({ h: 520, crumbs: view ? ['Dashboards', 'Bookshelf (guides)'] : ['Dashboards', 'Editing Bookshelf (guides)'], actions });
  const n = [...kFilterRow({}).nodes];
  n.push({ block: 'panel', x: 16, y: 152, w: 520, h: 330 }, pieDraw(32, 168, 488, 300, true));
  if (heat) n.push({ block: 'panel', x: 544, y: 152, w: 520, h: 330 }, ...heatDraw(560, 176, 488, 280));
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(fr.geo) : children ?? []));
  return { nodes: fr.nodes, geo: fr.geo };
}

// 01: the dashboard in view mode; Edit (step 2)
{
  const d = kDash({ h: 520, mode: 'view', title: 'Bookshelf (guides)', children: (g) => mark(g.Edit, 2) });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Kibana dashboard Bookshelf (guides) in view mode with its bar chart panel; the Edit button of the second bar is marked by callout 2',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 02: the Add to dashboard flyout (steps 3 and 4)
{
  const d = kDash({ h: 520, mode: 'add', title: 'Bookshelf (guides)', children: (g) => marks([[g.Add, 3], [g.addViz, 4]]) });
  figures.push({
    id: '02-add-visualization',
    alt: 'Dashboard in edit mode with the Add to dashboard flyout open: the Add button of the second bar is marked by callout 3 and the Visualization entry of the flyout by callout 4',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 03: the chart type list; Pie (step 5)
{
  const l = lens({ list: true, fields: ['@timestamp', 'attributes.status', 'attributes.uri', 'body.text', 'severity_text'], zones: [{ label: 'Horizontal axis', text: 'Add or drag-and-drop a field' }, { label: 'Vertical axis', text: 'Add or drag-and-drop a field' }], children: (g) => mark(g.rows.Pie, 5) });
  figures.push({
    id: '03-chart-type-list',
    alt: 'Lens editor with an empty workspace and the chart type list open under the Bar button of the layer card; the entry Pie is marked by callout 5',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 04: the dimensions of the pie (steps 6 and 7)
{
  const l = lens({ type: 'Pie', search: 'uri', fields: ['attributes.uri'], zones: sliceZones(0), children: (g) => [...marks([[g.zone[0], 6], [g.zone[1], 7]]), { block: 'highlight', ...g.fields['attributes.uri'] }, { block: 'highlight', ...g.records }] });
  figures.push({
    id: '04-pie-dimensions',
    alt: 'Lens editor with the chart type Pie, the field list narrowed to attributes.uri and Records; the field is dragged onto the dashed Slice by button (callout 6) and Records onto the dashed Metric button (callout 7)',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 05: the pie drawn; Donut in the list (step 8)
{
  const l = lens({ type: 'Pie', list: true, search: 'uri', fields: ['attributes.uri'], zones: sliceZones(2), work: (x, y, w, h) => [pieDraw(x, y + 60, w, h - 100, false)], children: (g) => mark(g.rows.Donut, 8) });
  figures.push({
    id: '05-donut',
    alt: 'Lens editor with a pie chart of the log records by attributes.uri and the chart type list open; the entry Donut is marked by callout 8',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 06: the donut drawn; Save and return (step 9)
{
  const l = lens({ type: 'Donut', search: 'uri', fields: ['attributes.uri'], zones: sliceZones(2), work: (x, y, w, h) => [pieDraw(x, y + 60, w, h - 100, true)], children: (g) => mark(g.save, 9) });
  figures.push({
    id: '06-save-the-donut',
    alt: 'Lens editor with a donut chart of the log records by attributes.uri; the Save and return button of the second bar is marked by callout 9',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 07: a new editor, the list with Treemap (step 11)
{
  const l = lens({ list: true, fields: ['@timestamp', 'attributes.status', 'attributes.uri', 'body.text', 'severity_text'], zones: [{ label: 'Horizontal axis', text: 'Add or drag-and-drop a field' }, { label: 'Vertical axis', text: 'Add or drag-and-drop a field' }], children: (g) => mark(g.rows.Treemap, 11) });
  figures.push({
    id: '07-treemap-type',
    alt: 'A new Lens editor with an empty workspace and the chart type list open; the entry Treemap is marked by callout 11',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 08: the treemap dimensions (steps 12 to 14)
{
  const zones = [
    { label: 'Slice by', text: 'attributes.uri', filled: true },
    { label: 'Slice by', text: 'Add or drag-and-drop a field' },
    { label: 'Metric', text: 'Add or drag-and-drop a field' },
  ];
  const l = lens({ type: 'Treemap', search: 'status', fields: ['attributes.status'], zones, children: (g) => [...marks([[g.zone[0], 12], [g.zone[1], 13], [g.zone[2], 14]]), { block: 'highlight', ...g.fields['attributes.status'] }] });
  figures.push({
    id: '08-treemap-dimensions',
    alt: 'Lens editor with the chart type Treemap: attributes.uri is in the first Slice by button (callout 12), attributes.status is dragged onto the second dashed Slice by button (callout 13) and Records onto the dashed Metric button (callout 14)',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 09: waffle, mosaic and tag cloud in the list (steps 15 to 17)
{
  const zones = [
    { label: 'Slice by', text: 'attributes.uri', filled: true },
    { label: 'Slice by', text: 'attributes.status', filled: true },
    { label: 'Metric', text: 'Count of records', filled: true },
  ];
  const l = lens({ type: 'Treemap', list: true, fields: ['attributes.status'], search: 'status', zones, work: (x, y, w, h) => treemapDraw(x, y + 10, w, h - 40, true), children: (g) => marks([[g.rows.Waffle, 15], [g.rows.Mosaic, 16], [g.rows['Tag cloud'], 17]]) });
  figures.push({
    id: '09-partition-types',
    alt: 'Lens editor with a treemap of attributes.uri and attributes.status and the chart type list open; the entries Waffle, Mosaic and Tag cloud are marked by callouts 15, 16 and 17, one for each time the list is opened',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 10: heat map in the list (step 18)
{
  const zones = [
    { label: 'Slice by', text: 'attributes.uri', filled: true },
    { label: 'Slice by', text: 'attributes.status', filled: true },
    { label: 'Metric', text: 'Count of records', filled: true },
  ];
  const l = lens({ type: 'Tag cloud', list: true, fields: ['attributes.status'], search: 'status', zones, work: (x, y, w, h) => tagCloudDraw(x, y, w, h), children: (g) => mark(g.rows['Heat map'], 18) });
  figures.push({
    id: '10-heat-map-type',
    alt: 'Lens editor with a tag cloud of the attributes.uri values and the chart type list open; the entry Heat map is marked by callout 18',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 11: the heat map dimensions (steps 19 and 20)
{
  const zones = [
    { label: 'Horizontal axis', text: 'Add or drag-and-drop a field' },
    { label: 'Vertical axis', text: 'Add or drag-and-drop a field' },
    { label: 'Cell value', text: 'Count of records', filled: true },
  ];
  const l = lens({ type: 'Heat map', fields: ['@timestamp', 'attributes.uri'], zones, children: (g) => [...marks([[g.zone[0], 19], [g.zone[1], 20]]), { block: 'highlight', ...g.fields['@timestamp'] }, { block: 'highlight', ...g.fields['attributes.uri'] }] });
  figures.push({
    id: '11-heat-map-dimensions',
    alt: 'Lens editor with the chart type Heat map: the field @timestamp is dragged onto the dashed Horizontal axis button (callout 19) and attributes.uri onto the dashed Vertical axis button (callout 20); the Cell value button holds Count of records',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 12: the heat map drawn; Save and return (step 21)
{
  const zones = [
    { label: 'Horizontal axis', text: '@timestamp', filled: true },
    { label: 'Vertical axis', text: 'attributes.uri', filled: true },
    { label: 'Cell value', text: 'Count of records', filled: true },
  ];
  const l = lens({ type: 'Heat map', fields: ['@timestamp', 'attributes.uri'], zones, work: (x, y, w, h) => heatDraw(x, y + 40, w, h - 120), children: (g) => mark(g.save, 21) });
  figures.push({
    id: '12-save-the-heat-map',
    alt: 'Lens editor with a heat map of the requests per attributes.uri over time; the Save and return button of the second bar is marked by callout 21',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 13: the dashboard with two panels; Save and Exit edit (steps 22 and 23)
{
  const d = dash({ mode: 'edit', heat: true, children: (g) => marks([[g.Save, 22], [g['Exit edit'], 23]]) });
  figures.push({
    id: '13-save-the-dashboard',
    alt: 'Kibana dashboard in edit mode with the donut panel and the heat map panel; the Save button of the second bar is marked by callout 22 and the Exit edit button by callout 23',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 14: the finished dashboard (What you build)
{
  const d = dash({ mode: 'view', heat: true });
  figures.push({
    id: '14-result',
    alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode with a donut of the log records by attributes.uri and a heat map of the requests per attributes.uri over time',
    width: FW, height: 520, nodes: d.nodes,
  });
}

export default { product: 'kibana', guide: 'k8', figures };
