// Figures of the Grafana guide G20, "Geomap" (guide-geomap.adoc).
// Facts: read in the lab on 2026-11-11 (Grafana Enterprise 13.3.0): the TestData scenario CSV Content and its editor; the
// visualization picker entry "Geomap" ("Geomap panel"); the option groups Panel options, Map view (View "(0°, 0°)",
// Zoom 1), Map layers (Add layer, "Layer 1  markers", Layer type, Location Mode Auto | Coords | Geohash | Lookup with
// "Specify Gazetteer and lookup field", Lookup field, Gazetteer "Countries", Styles with Size "Fixed value" or a field and
// Min 2 / Max 15, Color "Fixed color" or a field), Basemap layer "Default base layer", Standard options with Color scheme
// "Yellow-Red (by value)"; the Add layer list (Markers, Heatmap, GeoJSON, Night / Day, Route, Photos, Network and the
// basemap layers); the Heatmap layer options Location Mode, Weight values, Radius, Blur and Opacity; the legend "Layer 1"
// with the range 90 to 1840. The basemap is CARTO Dark Matter (theme tokens colour.map.*), the outlines are Natural Earth
// 1:110m. Callout numbers are the step numbers of the page. Colours are theme tokens only.
import { FW, lbl, box, btn, ico, rule, mark, marks, menu, grafanaFrame, G_NAV_ROW, gDashToolbar, gAddPane, gEditor, reqChart } from '../lib/shells.mjs';
import { mapView } from '../lib/blocks.mjs';

const L = { x: 16, w: 760 }, R = { x: 792, w: 272 };
const CY = 424;
const TITLE = 'Requests by country';
const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const DASH = ['Dashboards', 'Guides', 'Bookshelf (guides)'];
const CSV = ['country,requests', 'US,1840', 'IN,1210', 'CN,1150'];
const DATA = [['US', 1840], ['IN', 1210], ['CN', 1150], ['BR', 620], ['DE', 410], ['GB', 380], ['FR', 300], ['JP', 290], ['NG', 250], ['MX', 240], ['AU', 160], ['ES', 150], ['ZA', 90]];
const MARKERS = DATA.map(([iso, v]) => ({ iso, v }));
const HEAT = DATA.map(([iso, v]) => ({ iso, v: v / 1840 }));
const VIEW = mapView(-170, -45, 180, 70);

// The Geomap preview: `state` = 'default' (green markers of a fixed size, the default style), 'sized' (size and colour
// from requests), 'scheme' (with the legend), 'heat' (with the heatmap layer).
function geomap(x, y, w, h, state) {
  const m = { block: 'worldMap', x, y, w, h, view: VIEW, zoom: true };
  if (state === 'default') return [{ ...m, markers: MARKERS.map((k) => ({ ...k, v: 1 })), ramp: ['threshold.green', 'threshold.green'], size: [5, 5] }];
  if (state === 'sized') return [{ ...m, markers: MARKERS, ramp: ['threshold.green', 'threshold.green'], size: [4, 16] }];
  const legend = { title: 'Layer 1', min: 90, max: 1840 };
  if (state === 'scheme') return [{ ...m, markers: MARKERS, ramp: ['threshold.yellow', 'threshold.red'], size: [4, 16], legend }];
  return [{ ...m, markers: MARKERS, ramp: ['threshold.yellow', 'threshold.red'], size: [4, 16], heat: HEAT, legend }];
}

// ---- the options pane of the right column ---------------------------------------------------------------------------
const collapsible = (x, y, w, label, open = false) => [ico(x + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(x + 32, y + 21, label, { weight: 500, box: w - 48 }), rule(x, y + 32, w)];
// Items: field, drop, btn, layers (rows of [name, type], first selected), heading, pair (two short fields), note.
function pane(groups) {
  const ix = R.x + 12, iw = R.w - 24;
  const nodes = [box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(R.x + 12, 124, 'Geomap', { weight: 600, box: 150 }), btn(R.x + R.w - 12 - 76, 106, 76, 'Change')];
  nodes.push({ block: 'field', x: ix, y: 146, w: iw, placeholder: 'Search options' });
  const geo = {};
  let y = 190;
  for (const g of groups) {
    nodes.push(...collapsible(R.x, y, R.w, g.label, !!g.open));
    geo[g.label] = { x: R.x + 4, y, w: R.w - 8, h: 32 };
    y += 34;
    if (!g.open) continue;
    for (const it of g.items) {
      if (it.t === 'field') { nodes.push({ block: 'field', x: ix, y, w: iw, label: it.label, value: it.value }); geo[it.label] = { x: ix, y: y + 20, w: iw, h: 32 }; y += 58; }
      else if (it.t === 'drop') { nodes.push({ block: 'dropdown', x: ix, y, w: iw, label: it.label, value: it.value }); geo[it.key ?? it.label] = { x: ix, y: y + 20, w: iw, h: 32 }; y += 58; }
      else if (it.t === 'btn') { nodes.push(btn(ix, y, 110, it.label, 'secondary', 'plus')); geo[it.label] = { x: ix, y, w: 110, h: 32 }; y += 42; }
      else if (it.t === 'layers') {
        it.rows.forEach(([name, type], i) => {
          nodes.push(box(ix, y, iw, 34, { fill: i === 0 ? 'navActiveBg' : 'inputBg', stroke: i === 0 ? 'focus' : 'border', radius: 4 }), lbl(ix + 12, y + 22, name, { box: 80 }), lbl(ix + 96, y + 22, type, { tone: 'textMuted', box: iw - 108 }));
          geo[`layer:${name}`] = { x: ix, y, w: iw, h: 34 };
          y += 40;
        });
        y += 4;
      } else if (it.t === 'heading') { nodes.push(lbl(ix, y + 14, it.label, { weight: 500, box: iw })); y += 22; }
      else if (it.t === 'pair') {
        const hw = (iw - 8) / 2;
        it.items.forEach(([l, v], i) => nodes.push({ block: 'field', x: ix + i * (hw + 8), y, w: hw, label: l, value: v }));
        geo[it.key] = { x: ix, y: y + 20, w: iw, h: 32 };
        y += 58;
      } else if (it.t === 'note') { nodes.push(lbl(ix, y + 12, it.label, { size: 'small', tone: 'textMuted', box: iw })); y += 22; }
    }
  }
  if (y > 632) throw new Error(`options pane runs past the editor: y = ${y}`);
  return { nodes, geo };
}

// ---- the editor with the TestData query card ---------------------------------------------------------------------------
// o: preview (nodes), right ({ nodes, geo }), scenario ('Random Walk' | 'CSV Content'), csv (true: the typed lines),
// marksFn(geo, mine).
function ed(o) {
  const mine = {};
  const e = gEditor({
    mode: 'builder', hasData: false, right: 'empty', title: o.title ?? 'New panel', crumbs: CRUMBS,
    children: (geo) => {
      const n = [];
      n.push(box(17, 124, L.w - 2, 194, { fill: 'surface' }), ...(o.preview ?? [
        lbl(L.x + L.w / 2, 214, 'Run a query to visualize it here or go to all', { anchor: 'middle', tone: 'textMuted', box: 600 }),
        lbl(L.x + L.w / 2, 236, 'visualizations to add other panel types', { anchor: 'middle', tone: 'textMuted', box: 600 }),
      ]));
      if (o.right) n.push(...o.right.nodes);
      // data source and the TestData query card, drawn over the Prometheus one
      n.push(box(L.x, 378, 202, 36, { fill: 'canvas' }), { block: 'dropdown', x: L.x, y: 380, w: 200, value: 'TestData' });
      mine.ds = { x: L.x, y: 380, w: 200, h: 32 };
      n.push(box(L.x, CY, L.w, 208, { fill: 'surface', stroke: 'border', radius: 6 }));
      n.push(lbl(L.x + 12, CY + 26, 'A (TestData)', { weight: 500, box: 200 }));
      n.push(lbl(L.x + 12, CY + 64, 'Scenario', { size: 'small', weight: 500, box: 70 }));
      n.push({ block: 'dropdown', x: L.x + 90, y: CY + 44, w: 220, value: o.scenario ?? 'CSV Content' });
      mine.scenario = { x: L.x + 90, y: CY + 44, w: 220, h: 32 };
      if ((o.scenario ?? 'CSV Content') === 'CSV Content') {
        n.push(lbl(L.x + 340, CY + 64, 'Alias', { size: 'small', weight: 500, box: 50 }));
        n.push({ block: 'field', x: L.x + 392, y: CY + 44, w: 200, placeholder: 'optional' });
        const lines = o.csv ? CSV.map((t) => [{ t }]) : [[{ t: '' }]];
        n.push({ block: 'queryEditor', x: L.x + 12, y: CY + 88, w: L.w - 24, h: 110, lines, lineNumbers: true });
        mine.editor = { x: L.x + 12, y: CY + 88, w: L.w - 24, h: 110 };
      }
      n.push(...(o.marksFn ? o.marksFn(geo, mine) : []));
      return n;
    },
  });
  return e;
}

const pv = (state) => [...geomap(L.x + 8, 126, L.w - 16, 188, state)];
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

// 03: TestData, CSV Content and the typed CSV (steps 6 to 8)
{
  const e = ed({ csv: true, marksFn: (g, m) => marks([[m.ds, 6], [m.scenario, 7], [m.editor, 8]]) });
  figures.push({
    id: '03-csv-query',
    alt: 'Panel editor on the Queries tab: the data source TestData is marked by callout 6, the Scenario list set to CSV Content by callout 7 and the CSV editor, whose first lines are country,requests, US,1840, IN,1210 and CN,1150, by callout 8',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 04: All visualizations, search Geomap (step 9)
{
  const nodes = [box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }), { block: 'tabs', x: R.x + 4, y: 106, w: R.w - 8, tabs: ['Suggestions', 'All visualizations'], active: 1 }, { block: 'field', x: R.x + 12, y: 154, w: R.w - 24, value: 'Geomap' }];
  const row = { x: R.x + 8, y: 200, w: R.w - 16, h: 48 };
  nodes.push(box(row.x, row.y, row.w, row.h, { fill: 'navActiveBg', radius: 4 }), lbl(R.x + 20, 220, 'Geomap', { weight: 500, box: R.w - 40 }), lbl(R.x + 20, 238, 'Geomap panel', { size: 'small', tone: 'textMuted', box: R.w - 40 }));
  const e = ed({ csv: true, right: { nodes }, marksFn: () => mark(row, 9) });
  figures.push({
    id: '04-pick-geomap',
    alt: 'Panel editor with the All visualizations tab of the right column: Geomap is typed in the search field and the only result, Geomap with the description Geomap panel, is marked by callout 9',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: Title, Location Mode Lookup, Lookup field country (steps 10 to 12)
{
  const p = pane([
    { label: 'Panel options', open: true, items: [{ t: 'field', label: 'Title', value: TITLE }] },
    { label: 'Map view' },
    { label: 'Map layers', open: true, items: [
      { t: 'btn', label: 'Add layer' }, { t: 'layers', rows: [['Layer 1', 'markers']] },
      { t: 'drop', label: 'Location Mode', value: 'Lookup' }, { t: 'drop', label: 'Lookup field', value: 'country' }, { t: 'drop', label: 'Gazetteer', value: 'Countries' },
    ] },
  ]);
  const e = ed({ csv: true, title: TITLE, preview: pv('default'), right: p, marksFn: () => marks([[p.geo.Title, 10], [p.geo['Location Mode'], 11], [p.geo['Lookup field'], 12]]) });
  figures.push({
    id: '05-location-lookup',
    alt: 'Panel editor with the Geomap options pane: the Title Requests by country is marked by callout 10, the Location Mode Lookup of Layer 1 (markers) by callout 11 and the Lookup field country by callout 12, with the Gazetteer Countries below; the preview shows a dark world map with one small green marker on each country of the data',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: Size and Color from requests (steps 13 and 14)
{
  const p = pane([
    { label: 'Panel options' }, { label: 'Map view' },
    { label: 'Map layers', open: true, items: [
      { t: 'layers', rows: [['Layer 1', 'markers']] }, { t: 'note', label: 'Location Mode: Lookup, country, Countries' },
      { t: 'heading', label: 'Styles' }, { t: 'drop', label: 'Size', value: 'requests' }, { t: 'pair', key: 'minmax', items: [['Min', '2'], ['Max', '15']] },
      { t: 'drop', label: 'Color', value: 'requests' },
    ] },
  ]);
  const e = ed({ csv: true, title: TITLE, preview: pv('sized'), right: p, marksFn: () => marks([[p.geo.Size, 13], [p.geo.Color, 14]]) });
  figures.push({
    id: '06-marker-styles',
    alt: 'Panel editor with the Styles of Layer 1: Size set to the field requests, with Min 2 and Max 15, is marked by callout 13 and Color set to requests by callout 14; the preview draws the largest markers on the United States, India and China',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: Standard options, Color scheme (step 15)
{
  const p = pane([
    { label: 'Panel options' }, { label: 'Map view' }, { label: 'Map layers' }, { label: 'Basemap layer' }, { label: 'Map controls' },
    { label: 'Standard options', open: true, items: [{ t: 'field', label: 'Unit', value: 'Misc / None' }, { t: 'pair', key: 'minmax', items: [['Min', 'auto'], ['Max', 'auto']] }, { t: 'drop', label: 'Color scheme', value: 'Yellow-Red (by value)' }] },
  ]);
  const e = ed({ csv: true, title: TITLE, preview: pv('scheme'), right: p, marksFn: () => mark(p.geo['Color scheme'], 15) });
  figures.push({
    id: '07-color-scheme',
    alt: 'Panel editor with Standard options open: the Color scheme Yellow-Red (by value) is marked by callout 15; the preview colours the markers from yellow for few requests to red for many and shows the legend Layer 1 with the range 90 to 1840',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: Add layer, Heatmap (step 16)
{
  const p = pane([
    { label: 'Panel options' }, { label: 'Map view' },
    { label: 'Map layers', open: true, items: [{ t: 'btn', label: 'Add layer' }, { t: 'layers', rows: [['Layer 1', 'markers']] }] },
  ]);
  const m = menu({ x: R.x + 12, y: p.geo['Add layer'].y + 36, w: R.w - 24, items: ['Markers', 'Heatmap', 'GeoJSON', 'Night / Day', 'Route', 'Photos', 'Network'], hot: 1 });
  const e = ed({ csv: true, title: TITLE, preview: pv('scheme'), right: { nodes: [...p.nodes, ...m.nodes] }, marksFn: () => mark(m.rows[1], 16) });
  figures.push({
    id: '08-add-heatmap-layer',
    alt: 'Panel editor with the Add layer list of Map layers open, listing Markers, Heatmap, GeoJSON, Night / Day, Route, Photos and Network; the entry Heatmap is marked by callout 16',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: the heatmap layer: location and weight (steps 17 and 18)
{
  const p = pane([
    { label: 'Map view' },
    { label: 'Map layers', open: true, items: [
      { t: 'layers', rows: [['Layer 2', 'heatmap'], ['Layer 1', 'markers']] },
      { t: 'drop', label: 'Location Mode', value: 'Lookup' }, { t: 'drop', label: 'Lookup field', value: 'country' }, { t: 'drop', label: 'Weight values', value: 'requests' },
    ] },
  ]);
  const e = ed({ csv: true, title: TITLE, preview: pv('heat'), right: p, marksFn: (g) => marks([[{ x: p.geo['Location Mode'].x, y: p.geo['Location Mode'].y, w: p.geo['Location Mode'].w, h: p.geo['Lookup field'].y + 32 - p.geo['Location Mode'].y }, 17], [p.geo['Weight values'], 18], [g.save, 19]]) });
  figures.push({
    id: '09-heatmap-layer',
    alt: 'Panel editor with Layer 2 (heatmap) selected above Layer 1 (markers): Location Mode Lookup and Lookup field country are marked by callout 17, Weight values set to requests by callout 18 and the Save button of the editor by callout 19; the preview adds glowing density areas under the markers',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: the finished dashboard (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '10-result',
    alt: 'Dashboard Bookshelf (guides) in view mode with the Geomap panel Requests by country: a dark world map with yellow to red markers sized by the requests of each country, a heatmap layer under them and the legend Layer 1 from 90 to 1840',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: DASH, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 1048, h: 396, title: TITLE },
      ...geomap(24, 132, 1032, 362, 'heat'),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g20', figures };
