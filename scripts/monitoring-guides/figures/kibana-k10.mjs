// Figures of the Kibana guide K10, "Maps" (guide-maps.adoc).
// Facts: guides-brief/kibana-facts.md sections 1, 2 and 5 (Kibana 9.5.6). Verified there: the dashboard toolbars, the Add to
// dashboard flyout with Maps under Other visualizations, the Lens editor regions, the sample data views and the sample web
// logs fields geo.src, geo.dest and geo.coordinates. NOT VERIFIED there (drawn generically, with the words of the Elastic
// pages "Maps" and "Region map charts"): the chart type list and the drop zones of the Lens region map, the whole Maps editor
// (layer panel, Add layer list, Choropleth, Documents, layer style, tooltip fields, Save and return), and the time picker
// menu. The maps are real country outlines (Natural Earth 1:110m) on the Elastic Maps Service colours. Callout numbers are the step numbers of the page; a
// figure shows the screen as the step starts, with the control to act on highlighted.
import { FW, lbl, box, btn, mark, marks, menu, kibanaFrame, kFilterRow, kDash } from '../lib/shells.mjs';

const figures = [];
const H = 640;
const TYPES = ['Bar', 'Line', 'Metric', 'Donut', 'Pie', 'Treemap', 'Region map', 'Heat map', 'Tag cloud'];

// ---------------------------------------------------------------- the world map
// Real country outlines (Natural Earth 1:110m, Web Mercator) on the colours of the Elastic Maps Service basemap; see the
// worldMap block of lib/blocks.mjs. SHADE is the share of the sample web logs per source country (geo.src), the darkest
// country being the one with most records; DOTS are the documents of the documents layer.
const SHADE = {
  CN: 1, IN: 0.92, US: 0.62, ID: 0.36, BR: 0.33, NG: 0.31, BD: 0.29, PK: 0.28, RU: 0.24, JP: 0.21, MX: 0.19, PH: 0.17,
  VN: 0.16, ET: 0.15, EG: 0.13, DE: 0.13, IR: 0.12, TR: 0.12, CD: 0.11, TH: 0.1, FR: 0.1, GB: 0.1, IT: 0.09, ZA: 0.09,
  KR: 0.08, CO: 0.08, ES: 0.07, AR: 0.07, DZ: 0.06, KE: 0.06, PL: 0.05, UA: 0.05, CA: 0.05, AU: 0.04, SA: 0.04, MY: 0.04,
};
const DOTS = [['CN', 9], ['IN', 9], ['US', 7], ['ID', 4], ['BR', 4], ['NG', 3], ['BD', 2], ['PK', 2], ['RU', 3], ['JP', 2], ['MX', 2], ['DE', 2], ['GB', 1], ['FR', 1], ['ZA', 1], ['AU', 1]].map(([iso, n]) => ({ iso, n, spread: ['CN', 'IN', 'US', 'BR', 'RU', 'AU', 'ID'].includes(iso) ? 1.7 : 1 }));
const RAMP = ['series.3', 'series.2'];
function worldMap(x, y, w, h, { choro = false, dots = false } = {}) {
  return [{ block: 'worldMap', x, y, w, h, radius: 4, ...(choro ? { shade: SHADE, ramp: RAMP } : {}), ...(dots ? { dots: DOTS, dotColour: 'series.4' } : {}) }];
}

// ---------------------------------------------------------------- the Lens editor (region map)
function lens({ type = 'Bar', dataView = 'Bookshelf logs (guides)', time = 'Last 15 minutes', search, fields, zones, work, list, picker, save = 'Save and return', children }) {
  const actions = [{ label: 'Explore in Discover', w: 176 }, { label: 'Inspect', w: 80 }, { label: 'Settings', w: 90 }, { label: save, kind: 'primary', w: 150 }];
  const fr = kibanaFrame({ h: H, crumbs: ['Dashboards', 'Visualizations', 'Create'], actions });
  const geo = { ...fr.geo, save: fr.geo[save] };
  const n = [];
  const row = kFilterRow({ dataView, time });
  n.push(...row.nodes);
  geo.dataView = row.geo.dataView; geo.time = row.geo.time;
  const LX = 16, LW = 284;
  n.push({ block: 'field', x: LX, y: 152, w: LW, placeholder: 'Search field names', ...(search ? { value: search } : {}) });
  n.push(lbl(LX + 4, 214, 'Records', { weight: 500 }));
  geo.records = { x: LX, y: 198, w: LW, h: 28 };
  n.push(lbl(LX + 4, 250, 'Available fields', { weight: 600, box: LW }));
  geo.fields = {};
  fields.forEach((f, i) => {
    n.push(box(LX, 262 + i * 32, LW, 30, { fill: 'surface', stroke: 'border', radius: 4 }));
    n.push(lbl(LX + 34, 282 + i * 32, f, { box: LW - 44 }));
    n.push(lbl(LX + 14, 282 + i * 32, f === '@timestamp' ? 'D' : f === 'bytes' ? '#' : 't', { size: 'small', tone: 'textMuted', weight: 600 }));
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
  n.push(lbl(CX + 24, 276, dataView, { size: 'small', tone: 'textMuted', box: CW - 48 }));
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
  if (picker) {
    const m = menu({ x: 16, y: 142, w: 300, items: picker, hot: -1 });
    n.push(...m.nodes);
    geo.pickerRows = m.rows;
  }
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}
const emptyZones = [{ label: 'Region', text: 'Add or drag-and-drop a field' }, { label: 'Metric', text: 'Add or drag-and-drop a field' }];
const FIELDS = ['@timestamp', 'bytes', 'clientip', 'geo.src', 'geo.dest'];

// ---------------------------------------------------------------- the Maps editor, drawn generically
// `layers`: names under the Layers title; `flyout(g)`: nodes of a right flyout; `list`: Add layer entries.
function mapsEditor({ layers = ['Basemap'], choro = false, dots = false, flyout, children }) {
  const actions = [{ label: 'Cancel', w: 90 }, { label: 'Save and return', kind: 'primary', w: 150 }];
  const fr = kibanaFrame({ h: H, crumbs: ['Dashboards', 'Maps'], actions });
  const geo = { ...fr.geo, save: fr.geo['Save and return'] };
  const n = [...kFilterRow({ time: 'Last 7 days' }).nodes];
  n.push(box(16, 152, 284, 480, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(lbl(30, 180, 'Layers', { size: 'title', weight: 600, box: 200 }));
  geo.addLayer = { x: 160, y: 160, w: 130, h: 32 };
  n.push(btn(160, 160, 130, 'Add layer', 'secondary', 'plus'));
  layers.forEach((l, i) => {
    n.push(box(28, 210 + i * 44, 260, 36, { fill: 'canvas', stroke: 'border', radius: 4 }), lbl(40, 233 + i * 44, l, { box: 230 }));
  });
  n.push(...worldMap(316, 152, 748, 480, { choro, dots }));
  const ctx = { ...geo };
  if (flyout) { const f = flyout(ctx); n.push(...f.nodes); Object.assign(geo, f.geo); }
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

// A right flyout of the Maps editor with a title, fields and the confirm and cancel buttons.
function flyoutOf(title, build, confirm = 'Add and continue') {
  const x = 704, w = 360, ix = x + 16, iw = w - 32;
  const n = [{ block: 'flyout', x, y: 96, w, h: 544, title }];
  const geo = {};
  build({ n, geo, ix, iw });
  geo.confirm = { x: x + w - 16 - 150, y: 596, w: 150, h: 32 };
  n.push(btn(x + w - 16 - 150 - 8 - 84, 596, 84, 'Cancel'), btn(geo.confirm.x, geo.confirm.y, 150, confirm, 'primary'));
  return { nodes: n, geo };
}

// ---------------------------------------------------------------- the dashboard with the two map panels
function dash({ mode, maps = true, children }) {
  const view = mode === 'view';
  const actions = view
    ? [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }]
    : [{ label: 'Exit edit', w: 100 }, { label: 'Add', w: 84, icon: 'plus' }, { label: 'More', w: 80 }, { label: 'Save', kind: 'primary', w: 80 }];
  const fr = kibanaFrame({ h: 520, crumbs: view ? ['Dashboards', 'Bookshelf (guides)'] : ['Dashboards', 'Editing Bookshelf (guides)'], actions });
  const n = [...kFilterRow({ time: 'Last 7 days' }).nodes];
  n.push({ block: 'panel', x: 16, y: 152, w: 520, h: 330 }, ...worldMap(28, 164, 496, 306, { choro: true }));
  if (maps) n.push({ block: 'panel', x: 544, y: 152, w: 520, h: 330 }, ...worldMap(556, 164, 496, 306, { choro: true, dots: true }));
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(fr.geo) : children ?? []));
  return { nodes: fr.nodes, geo: fr.geo };
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

// 02: the Add flyout (steps 3 and 4)
{
  const d = kDash({ h: 520, mode: 'add', title: 'Bookshelf (guides)', children: (g) => marks([[g.Add, 3], [g.addViz, 4]]) });
  figures.push({
    id: '02-add-visualization',
    alt: 'Dashboard in edit mode with the Add to dashboard flyout open: the Add button of the second bar is marked by callout 3 and the Visualization entry of the flyout by callout 4; the entry Maps is in the line under Other visualizations',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 03: the data view picker and the time picker (steps 5 and 6)
{
  const l = lens({ picker: ['Bookshelf logs (guides)', 'Kibana Sample Data Logs', 'Kibana Sample Data eCommerce'], fields: FIELDS, zones: [{ label: 'Horizontal axis', text: 'Add or drag-and-drop a field' }, { label: 'Vertical axis', text: 'Add or drag-and-drop a field' }], children: (g) => marks([[g.pickerRows[1], 5], [g.time, 6]]) });
  figures.push({
    id: '03-data-view-and-time',
    alt: 'Lens editor with the data view picker open: the entry Kibana Sample Data Logs is marked by callout 5, and the time picker, which shows Last 15 minutes, is marked by callout 6',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 04: the chart type list; Region map (step 7)
{
  const l = lens({ dataView: 'Kibana Sample Data Logs', time: 'Last 7 days', list: true, fields: FIELDS, zones: [{ label: 'Horizontal axis', text: 'Add or drag-and-drop a field' }, { label: 'Vertical axis', text: 'Add or drag-and-drop a field' }], children: (g) => mark(g.rows['Region map'], 7) });
  figures.push({
    id: '04-region-map-type',
    alt: 'Lens editor on the data view Kibana Sample Data Logs with the time picker at Last 7 days and the chart type list open under the Bar button; the entry Region map is marked by callout 7',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 05: the region map dimensions (steps 8 and 9)
{
  const l = lens({ type: 'Region map', dataView: 'Kibana Sample Data Logs', time: 'Last 7 days', search: 'geo', fields: ['geo.src', 'geo.dest'], zones: emptyZones, children: (g) => [...marks([[g.zone[0], 8], [g.zone[1], 9]]), { block: 'highlight', ...g.fields['geo.src'] }, { block: 'highlight', ...g.records }] });
  figures.push({
    id: '05-region-map-dimensions',
    alt: 'Lens editor with the chart type Region map and the field list narrowed to geo.src and geo.dest; geo.src is dragged onto the dashed region button (callout 8) and Records onto the dashed Metric button (callout 9)',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 06: the region map drawn; Save and return (step 10)
{
  const l = lens({ type: 'Region map', dataView: 'Kibana Sample Data Logs', time: 'Last 7 days', search: 'geo', fields: ['geo.src', 'geo.dest'], zones: [{ label: 'Region', text: 'geo.src', filled: true }, { label: 'Metric', text: 'Count of records', filled: true }], work: (x, y, w, h) => worldMap(x, y + 30, w, 380, { choro: true }), children: (g) => mark(g.save, 10) });
  figures.push({
    id: '06-save-the-region-map',
    alt: 'Lens editor with a region map of the log records per country of geo.src, countries shaded by the count; the Save and return button of the second bar is marked by callout 10',
    width: FW, height: H, nodes: l.nodes,
  });
}

// 07: the Maps editor; Add layer (step 12)
{
  const m = mapsEditor({ children: (g) => mark(g.addLayer, 12) });
  figures.push({
    id: '07-maps-editor',
    alt: 'The Maps editor of a new map panel with the Layers panel at the left and the map at the right; the Add layer button of the Layers panel is marked by callout 12',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 08: the Add layer list; Choropleth (step 13)
{
  const m = mapsEditor({
    flyout: () => {
      const f = flyoutOf('Add layer', ({ n, geo }) => {
        const mm = menu({ x: 720, y: 150, w: 328, items: ['Choropleth', 'Clusters', 'Heat map', 'Documents', 'ES|QL'], hot: -1 });
        n.push(...mm.nodes);
        geo.rows = mm.rows;
      }, 'Add and continue');
      return f;
    },
    children: (g) => mark(g.rows[0], 13),
  });
  figures.push({
    id: '08-choropleth-type',
    alt: 'The Maps editor with the Add layer flyout open and its list of layer types; the entry Choropleth is marked by callout 13',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 09: the choropleth settings (steps 14 to 16)
{
  const m = mapsEditor({
    flyout: () => flyoutOf('Add layer', ({ n, geo, ix, iw }) => {
      n.push({ block: 'dropdown', x: ix, y: 160, w: iw, label: 'Boundaries source', value: 'Elastic Maps Service' });
      n.push({ block: 'dropdown', x: ix, y: 226, w: iw, label: 'EMS boundaries', value: 'World Countries' });
      n.push({ block: 'dropdown', x: ix, y: 292, w: iw, label: 'Join field', value: 'ISO 3166-1 alpha-2 code' });
      geo.boundaries = { x: ix, y: 246, w: iw, h: 32 };
      geo.boundJoin = { x: ix, y: 312, w: iw, h: 32 };
      n.push(lbl(ix, 384, 'Statistics source', { weight: 600, box: iw }));
      n.push({ block: 'dropdown', x: ix, y: 392, w: iw, label: 'Data view', value: 'Kibana Sample Data Logs' });
      n.push({ block: 'dropdown', x: ix, y: 458, w: iw, label: 'Join field', value: 'geo.src' });
      geo.stats = { x: ix, y: 412, w: iw, h: 32 };
      geo.statsJoin = { x: ix, y: 478, w: iw, h: 32 };
    }),
    children: (g) => marks([[{ x: g.boundaries.x, y: g.boundaries.y, w: g.boundaries.w, h: g.boundJoin.y + g.boundJoin.h - g.boundaries.y }, 14], [{ x: g.stats.x, y: g.stats.y, w: g.stats.w, h: g.statsJoin.y + g.statsJoin.h - g.stats.y }, 15], [g.confirm, 16]]),
  });
  figures.push({
    id: '09-choropleth-settings',
    alt: 'Add layer flyout of the Choropleth layer: the boundaries World Countries and their join field ISO 3166-1 alpha-2 code are marked by callout 14, the statistics source Kibana Sample Data Logs with the join field geo.src by callout 15 and the confirm button by callout 16',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 10: the layer style (step 17)
{
  const m = mapsEditor({
    layers: ['Basemap', 'World Countries'], choro: true,
    flyout: () => flyoutOf('Layer settings', ({ n, geo, ix, iw }) => {
      n.push(lbl(ix, 168, 'Fill color', { weight: 600, box: iw }));
      ['series.1', 'series.3', 'series.2'].forEach((c, i) => n.push(box(ix + i * 70, 180, 64, 22, { fill: c, radius: 3 })));
      geo.fill = { x: ix, y: 160, w: iw, h: 52 };
      n.push(lbl(ix, 250, 'Border color', { weight: 600, box: iw }));
      n.push(box(ix, 262, 64, 22, { fill: 'surface', stroke: 'borderStrong', radius: 3 }));
    }, 'Close'),
    children: (g) => mark(g.fill, 17),
  });
  figures.push({
    id: '10-choropleth-style',
    alt: 'The Maps editor with the Choropleth layer World Countries drawn on the map and the layer settings flyout open; the Fill color group, a colour ramp, is marked by callout 17',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 11: the Add layer list; Documents (step 18)
{
  const m = mapsEditor({
    layers: ['Basemap', 'World Countries'], choro: true,
    flyout: () => flyoutOf('Add layer', ({ n, geo }) => {
      const mm = menu({ x: 720, y: 150, w: 328, items: ['Choropleth', 'Clusters', 'Heat map', 'Documents', 'ES|QL'], hot: -1 });
      n.push(...mm.nodes);
      geo.rows = mm.rows;
    }),
    children: (g) => mark(g.rows[3], 18),
  });
  figures.push({
    id: '11-documents-type',
    alt: 'The Maps editor with the choropleth drawn and the Add layer flyout open; the entry Documents is marked by callout 18',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 12: the documents layer (steps 19 to 21)
{
  const m = mapsEditor({
    layers: ['Basemap', 'World Countries'], choro: true,
    flyout: () => flyoutOf('Add layer', ({ n, geo, ix, iw }) => {
      n.push({ block: 'dropdown', x: ix, y: 160, w: iw, label: 'Data view', value: 'Kibana Sample Data Logs' });
      n.push({ block: 'dropdown', x: ix, y: 226, w: iw, label: 'Geospatial field', value: 'geo.coordinates' });
      geo.dv = { x: ix, y: 180, w: iw, h: 32 };
      geo.gf = { x: ix, y: 246, w: iw, h: 32 };
      n.push(lbl(ix, 320, 'Tooltip fields', { weight: 600, box: iw }));
      n.push(box(ix, 332, iw, 44, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }));
      ['clientip', 'response', 'bytes'].forEach((t, i) => n.push({ block: 'chip', x: ix + 8 + i * 84, y: 343, str: t }));
      geo.tips = { x: ix, y: 332, w: iw, h: 44 };
    }),
    children: (g) => marks([[{ x: g.dv.x, y: g.dv.y, w: g.dv.w, h: g.gf.y + g.gf.h - g.dv.y }, 19], [g.tips, 20], [g.confirm, 21]]),
  });
  figures.push({
    id: '12-documents-settings',
    alt: 'Add layer flyout of the Documents layer: the data view Kibana Sample Data Logs and the geospatial field geo.coordinates are marked by callout 19, the tooltip fields clientip, response and bytes by callout 20 and the confirm button by callout 21',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 13: both layers drawn; Save and return (step 22)
{
  const m = mapsEditor({ layers: ['Basemap', 'World Countries', 'Sample web logs'], choro: true, dots: true, children: (g) => mark(g.save, 22) });
  figures.push({
    id: '13-save-the-map',
    alt: 'The Maps editor with the choropleth layer and the documents layer drawn on the map and listed in the Layers panel; the Save and return button of the second bar is marked by callout 22',
    width: FW, height: H, nodes: m.nodes,
  });
}

// 14: the dashboard with the two panels; Save and Exit edit (steps 23 and 24)
{
  const d = dash({ mode: 'edit', children: (g) => marks([[g.Save, 23], [g['Exit edit'], 24]]) });
  figures.push({
    id: '14-save-the-dashboard',
    alt: 'Kibana dashboard in edit mode with the region map panel and the Maps panel; the Save button of the second bar is marked by callout 23 and the Exit edit button by callout 24',
    width: FW, height: 520, nodes: d.nodes,
  });
}

// 15: the finished dashboard (What you build)
{
  const d = dash({ mode: 'view' });
  figures.push({
    id: '15-result',
    alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode with a region map of the sample web logs by country and a Maps panel with a choropleth layer and a documents layer',
    width: FW, height: 520, nodes: d.nodes,
  });
}

export default { product: 'kibana', guide: 'k10', figures };
