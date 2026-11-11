// Figures of the Grafana guide G8, "Tables" (guide-tables.adoc). Facts: guides-brief/grafana-facts.md sections 6, 7 and 8 (13.3.0 panel editor,
// Table options: Table, Table footer, Cell options; transformation Organize fields by name). Callout numbers are the step numbers of the page.
// Colours are theme tokens only. The panel editor of lib/shells.mjs is reused; the preview, query and options pane are drawn locally.
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

const QUERY = 'sum by (uri) (rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))';
const TITLE = 'Requests per second by route';
const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const RAW = [['2026-11-11 10:16:20', '/api/books/{id}', '2.1'], ['2026-11-11 10:16:20', '/api/loans', '1.0'], ['2026-11-11 10:16:20', '/api/books', '4.8'], ['2026-11-11 10:16:20', '/api/search', '1.1']];
const rawTable = () => tbl({ x: 28, y: 134, w: 736, cols: [{ title: 'Time', w: 200 }, { title: 'uri', w: 340 }, { title: 'Value', w: 196, kind: 'num' }], rows: RAW }).nodes;
const SORTED = [['/api/books', 4.8], ['/api/books/{id}', 2.1], ['/api/search', 1.1], ['/api/loans', 1.0]];
const UNSORTED = [['/api/books/{id}', 2.1], ['/api/loans', 1.0], ['/api/books', 4.8], ['/api/search', 1.1]];
const ROUTE_COLS = (kind, wRoute = 340) => [{ title: 'Route', w: wRoute }, { title: 'Requests per second', w: 736 - wRoute, kind, max: 10 }];
const renamedTable = (kind) => tbl({ x: 28, y: 134, w: 736, cols: ROUTE_COLS(kind), rows: UNSORTED }).nodes;

const stdGroups = (open) => [
  { label: 'Panel options', open: open === 'panel', items: [{ t: 'field', label: 'Title', value: TITLE }, { t: 'field', label: 'Description', placeholder: '' }] },
  { label: 'Panel links' }, { label: 'Repeat options' }, { label: 'Show / hide rules' },
];
const tableGroups = ({ table, footer, cell, std }) => [
  { label: 'Table', open: !!table, items: [{ t: 'toggle', label: 'Show table header', on: true }, { t: 'toggle', label: 'Column filter', on: table === 'filter' }, { t: 'toggle', label: 'Enable pagination', on: false }] },
  { label: 'Table footer', open: !!footer, items: [{ t: 'drop', label: 'Calculation', value: 'Total' }] },
  { label: 'Cell options', open: !!cell, items: [{ t: 'drop', label: 'Cell type', value: cell === 'gauge' ? 'Gauge' : 'Auto' }, { t: 'toggle', label: 'Cell value inspect', on: false }] },
  { label: 'Standard options', open: !!std, items: [{ t: 'field', label: 'Min', value: '0' }, { t: 'field', label: 'Max', value: '10' }] },
  { label: 'Thresholds' },
];

const figures = [];

// 01: the dashboard in view mode; Dashboards in the navigation and Edit (steps 1 and 2)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Dashboard Bookshelf (guides) in view mode with the navigation docked: callout 1 marks the Dashboards item of the navigation and callout 2 marks the Edit button of the toolbar',
    width: FW, height: 430,
    nodes: grafanaFrame({ h: 430, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], nav: true, navActive: 'Dashboards', children: [
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
    nodes: grafanaFrame({ h: 540, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 300, title: 'Requests per second by status' },
      reqChart(24, 132, 504, 270),
      ...add.nodes,
      ...marks([[tb.geo.add, 3], [add.geo.panelTile, 4]]),
    ] }),
  });
}

// 03: the Panel pane (step 5)
{
  const tb = gDashToolbar({ saved: true });
  const pane2 = gPanelPane();
  figures.push({
    id: '03-edit-visualization',
    alt: 'Dashboard in edit mode after the Panel tile was clicked: a new panel called New panel and the Panel pane of the sidebar with the Edit visualization button marked by callout 5',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 370, h: 300, title: 'Requests per second by status' },
      reqChart(24, 132, 354, 270),
      { block: 'panel', x: 396, y: 106, w: 370, h: 300, title: 'New panel' },
      btn(446, 190, 220, 'Configure visualization', 'primary'), btn(446, 236, 220, 'Use saved query'), btn(446, 282, 220, 'Use library panel'),
      ...pane2.nodes,
      ...mark(pane2.geo.edit, 5),
    ] }),
  });
}

// 04: panel editor, Queries tab: data source and Builder / Code (steps 6 and 7)
{
  const e = ed({ crumbs: CRUMBS, marksFn: (g) => marks([[g.ds, 6], [g.code, 7]]) });
  figures.push({
    id: '04-code-mode',
    alt: 'Panel editor with an empty New panel on the Queries tab: callout 6 marks the Prometheus data source picker and callout 7 marks the Code option of the Builder and Code switch',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: the typed query, the opened Options row and Run queries (steps 8 to 11)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: [QUERY], optsRow: [['Format', 'Table'], ['Type', 'Instant']],
    marksFn: (g, m) => marks([[g.editor, 8], [m.Format, 9], [m.Type, 10], [g.runQueries, 11]]),
  });
  figures.push({
    id: '05-query-typed',
    alt: 'Panel editor in Code mode: the query that sums the request rate by uri is typed in the editor (callout 8), the opened Options row shows Format set to Table (callout 9) and Type set to Instant (callout 10), and Run queries is marked by callout 11',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: All visualizations: Table (step 12)
{
  const v = vizList(['Time series', 'Bar chart', 'Stat', 'Gauge', 'Bar gauge', 'Table', 'Pie chart', 'State timeline'], 'Table');
  const e = ed({ crumbs: CRUMBS, mode: 'code', lines: [QUERY], preview: rawTable(), right: v, marksFn: () => mark(v.hot, 12) });
  figures.push({
    id: '06-pick-table',
    alt: 'Panel editor after Run queries: the preview shows the result as a table with the columns Time, uri and Value, and the All visualizations tab of the right column lists Table with the description Supports many column styles, marked by callout 12',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: the Table options pane: title (step 13)
{
  const p = pane('Table', [...stdGroups('panel'), ...tableGroups({}).slice(0, 3)]);
  const e = ed({ crumbs: CRUMBS, title: TITLE, mode: 'code', lines: [QUERY], preview: rawTable(), right: p, marksFn: () => mark(p.geo.Title, 13) });
  figures.push({
    id: '07-panel-title',
    alt: 'Panel editor with the Table options pane: under Panel options the Title field holds Requests per second by route and is marked by callout 13',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: Transformations tab, empty state (steps 14 and 15)
{
  const p = pane('Table', [...stdGroups(''), ...tableGroups({})]);
  const e = ed({ crumbs: CRUMBS, title: TITLE, preview: rawTable(), right: p, bottom: 'empty', marksFn: (g, m) => marks([[m.tabTransformations, 14], [m.addTransformation, 15]]) });
  figures.push({
    id: '08-transformations-tab',
    alt: 'Panel editor on the Transformations tab: the tab is marked by callout 14 and the empty state offers the Add transformation button, marked by callout 15',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: the Add another transformation drawer (step 16)
{
  const p = pane('Table', [...stdGroups(''), ...tableGroups({})]);
  const names = ['Limit', 'Lookup fields from resource (Alpha)', 'Merge series/tables', 'Organize fields by name', 'Partition by values (Alpha)', 'Prepare time series', 'Reduce', 'Rename fields by regex'];
  const fx = 560, fw = FW - fx;
  const rows = names.map((nm, i) => ({ x: fx + 16, y: 150 + i * 46, w: fw - 32, h: 38, nm }));
  const hot = rows[3];
  const e = ed({ crumbs: CRUMBS, title: TITLE, preview: rawTable(), right: p, bottom: 'empty', marksFn: () => [
    { block: 'flyout', x: fx, y: 48, w: fw, h: 592, title: 'Add another transformation' },
    lbl(fx + 16, 122, '33 transformations found', { size: 'small', tone: 'textMuted', box: 300 }),
    ...rows.flatMap((r) => [box(r.x, r.y, r.w, r.h, { fill: r === hot ? 'navActiveBg' : 'surfaceRaised', stroke: 'border', radius: 6 }), lbl(r.x + 14, r.y + 24, r.nm, { weight: r === hot ? 500 : 400, box: r.w - 28 })]),
    ...mark(hot, 16),
  ] });
  figures.push({
    id: '09-pick-organize',
    alt: 'The Add another transformation drawer with an alphabetical list of transformations: the row Organize fields by name is marked by callout 16',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: the Organize fields by name card (steps 17 to 19)
{
  const p = pane('Table', [...stdGroups(''), ...tableGroups({})]);
  const fields = [['Time', false, ''], ['uri', true, 'Route'], ['Value', true, 'Requests per second']];
  const cardY = 382;
  const geo = {};
  const card = [box(L.x, cardY, L.w, 244, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(L.x + 14, cardY + 26, 'Organize fields by name', { weight: 600, box: 300 })];
  fields.forEach(([nm, on, rn], i) => {
    const ry = cardY + 50 + i * 56;
    card.push(box(L.x + 14, ry, L.w - 28, 44, { fill: 'inputBg', stroke: 'border', radius: 4 }), lbl(L.x + 28, ry + 27, nm, { weight: 500, box: 120 }));
    card.push({ block: 'toggle', x: L.x + 170, y: ry + 13, on, box: 0 });
    geo[nm] = { x: L.x + 170, y: ry + 13, w: 32, h: 18 };
    card.push({ block: 'field', x: L.x + 260, y: ry + 6, w: 260, ...(rn ? { value: rn } : { placeholder: '' }) });
    geo[`${nm}/rename`] = { x: L.x + 260, y: ry + 6, w: 260, h: 32 };
  });
  const e = ed({
    crumbs: CRUMBS, title: TITLE, transformations: 1, preview: renamedTable(), right: p, bottom: card,
    marksFn: () => marks([[geo.Time, 17], [geo['uri/rename'], 18], [geo['Value/rename'], 19]]),
  });
  figures.push({
    id: '10-organize-fields',
    alt: 'The Organize fields by name transformation: the Time field is switched off (callout 17), the uri field is renamed to Route (callout 18) and the Value field is renamed to Requests per second (callout 19); the preview shows a table with two columns',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11: cell type gauge, min and max (steps 20 to 23)
{
  const p = pane('Table', [{ label: 'Panel options' }, ...tableGroups({ cell: 'gauge', std: true }).slice(2, 4), { label: 'Thresholds' }]);
  const e = ed({
    crumbs: CRUMBS, title: TITLE, transformations: 1, preview: renamedTable('gauge'), right: p, bottom: 'queries', mode: 'code', lines: [QUERY],
    marksFn: () => marks([[p.geo['Cell options'], 20], [p.geo['Cell type'], 21], [p.geo.Min, 22], [p.geo.Max, 23]]),
  });
  figures.push({
    id: '11-gauge-cells',
    alt: 'Panel editor with the Table options pane: Cell options is marked by callout 20, its Cell type is set to the gauge type (callout 21), and under Standard options Min is 0 (callout 22) and Max is 10 (callout 23); the preview draws the second column as gauge bars',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 12: a field override (steps 24 to 26)
{
  const p = pane('Table', [{ label: 'Panel options' }, { label: 'Cell options' }, { label: 'Standard options' }, { label: 'Thresholds' }]);
  const geo = {};
  const oy = p.endY + 6;
  geo.add = { x: R.x + 12, y: oy, w: R.w - 24, h: 32 };
  const extra = [btn(geo.add.x, oy, geo.add.w, 'Add field override'),
    box(R.x + 12, oy + 46, R.w - 24, 170, { fill: 'inputBg', stroke: 'border', radius: 6 }),
    lbl(R.x + 24, oy + 70, 'Field', { size: 'small', tone: 'textMuted', box: 200 }),
    { block: 'dropdown', x: R.x + 24, y: oy + 78, w: R.w - 48, value: 'Route' },
    lbl(R.x + 24, oy + 138, 'Column width', { size: 'small', weight: 500, box: 200 }),
    { block: 'field', x: R.x + 24, y: oy + 144, w: R.w - 48, value: '240' }];
  geo.matcher = { x: R.x + 24, y: oy + 78, w: R.w - 48, h: 32 };
  geo.prop = { x: R.x + 24, y: oy + 144, w: R.w - 48, h: 32 };
  const e = ed({
    crumbs: CRUMBS, title: TITLE, transformations: 1, preview: tbl({ x: 28, y: 134, w: 736, cols: ROUTE_COLS('gauge', 240), rows: UNSORTED }).nodes, right: { nodes: [...p.nodes, ...extra] },
    bottom: 'queries', mode: 'code', lines: [QUERY],
    marksFn: () => marks([[geo.add, 24], [geo.matcher, 25], [geo.prop, 26]]),
  });
  figures.push({
    id: '12-field-override',
    alt: 'Options pane scrolled to its end: the Add field override button is marked by callout 24, the new override selects the field Route (callout 25) and sets the property Column width to 240 (callout 26)',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 13: column filter and footer (steps 27 and 28)
{
  const p = pane('Table', [{ label: 'Panel options' }, ...tableGroups({ table: 'filter', footer: true }).slice(0, 2), { label: 'Cell options' }, { label: 'Standard options' }]);
  const t = tbl({ x: 28, y: 134, w: 736, cols: ROUTE_COLS('gauge', 240), rows: UNSORTED, footer: ['Total', '9.0'], filter: [0, 1] });
  const e = ed({
    crumbs: CRUMBS, title: TITLE, transformations: 1, preview: t.nodes, right: p, bottom: 'queries', mode: 'code', lines: [QUERY],
    marksFn: () => marks([[p.geo['Column filter'], 27], [p.geo.Calculation, 28]]),
  });
  figures.push({
    id: '13-filter-and-footer',
    alt: 'Panel editor with the Table options pane: the Column filter toggle is switched on (callout 27) and under Table footer the Calculation is set to the one that adds up the values (callout 28); the preview shows filter icons in the column headers and a footer row with the sum of the four rates',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 14 and 15: the finished table in view mode
function viewTable({ callouts }) {
  const tb = gDashToolbar({ view: true });
  const t = tbl({ x: 28, y: 138, w: 680, cols: ROUTE_COLS('gauge', 280).map((c) => ({ ...c, w: c.w === 280 ? 280 : 400 })), rows: callouts ? SORTED : SORTED, footer: ['Total', '9.0'], sort: 1, filter: [0, 1] });
  const nodes = [
    ...tb.nodes,
    { block: 'panel', x: 16, y: 106, w: 704, h: 260, title: TITLE },
    ...t.nodes,
    ...(callouts ? marks([[t.hdr[1], 33], [{ x: t.hdr[0].x + t.hdr[0].w - 28, y: t.hdr[0].y + 5, w: 20, h: 20 }, 34]]) : []),
  ];
  return grafanaFrame({ h: 400, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: nodes });
}
figures.push({
  id: '14-sort-and-filter',
  alt: 'Dashboard Bookshelf (guides) in view mode: the table is sorted by the header Requests per second, marked by callout 33, and the filter icon in the header Route is marked by callout 34',
  width: FW, height: 400, nodes: viewTable({ callouts: true }),
});
figures.push({
  id: '15-result',
  alt: 'Finished table panel Requests per second by route in view mode: the columns Route and Requests per second with a gauge bar for each of four routes, sorted from the highest rate, and a footer row with the total',
  width: FW, height: 400, nodes: viewTable({ callouts: false }),
});

export default { product: 'grafana', guide: 'g8', figures };
