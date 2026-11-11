// Figures of the Grafana guide G11, "Thresholds, value mappings, overrides and data links" (guide-field-options.adoc).
// Facts: guides-brief/grafana-facts.md sections 6, 7 and 9 (13.3.0 panel editor; option groups Standard options, Data links and
// actions, Value mappings, Thresholds, Add field override; the old All / Overrides tabs are gone). NOT VERIFIED in the lab and
// therefore drawn generically: the value mapping dialog, the override matcher and property pickers, the data link editor and
// the colour picker. Callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, menu, segmented, grafanaFrame, G_NAV_ROW, gDashToolbar, gAddPane, gPanelPane, gEditor, reqChart,
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

// The options pane of a visualization: header, Change, search and collapsible groups.
// Items: field, drop, toggle, seg, map, btn, thr (threshold rows), addbox (dashed add control), note (small text).
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
      else if (it.t === 'map') { nodes.push(box(ix, y, iw, 34, { fill: 'inputBg', stroke: 'border', radius: 4 }), lbl(ix + 12, y + 22, `${it.from}  →  ${it.text}`, { box: iw - 60 }), box(ix + iw - 36, y + 9, 16, 16, { fill: it.color, radius: 8 })); geo[it.key ?? it.from] = { x: ix, y, w: iw, h: 34 }; y += 42; }
      else if (it.t === 'btn') { nodes.push(btn(ix, y, iw, it.label, it.kind ?? 'secondary', it.icon)); geo[it.label] = { x: ix, y, w: iw, h: 32 }; y += 42; }
      else if (it.t === 'addbox') { nodes.push(box(ix, y, iw, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6, dash: '5 3' }), ico(ix + iw / 2 - 8, y + 8, 'plus', 'link')); geo[it.key ?? 'add'] = { x: ix, y, w: iw, h: 32 }; y += 42; }
      else if (it.t === 'thr') { it.rows.forEach(([col, val], i) => { nodes.push(box(ix, y, 24, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }), box(ix + 6, y + 10, 12, 12, { fill: col, radius: 6 }), { block: 'field', x: ix + 30, y, w: iw - 30, value: val }); geo[`thr${i}`] = { x: ix + 30, y, w: iw - 30, h: 32 }; geo[`thr${i}dot`] = { x: ix, y, w: 24, h: 32 }; y += 38; }); }
      else if (it.t === 'note') { nodes.push(lbl(ix, y + 14, it.text, { size: 'small', tone: 'textMuted', box: iw })); y += 24; }
    }
  }
  if (y > 632) throw new Error(`options pane "${head}" runs past the editor: y = ${y}`);
  return { nodes, geo, endY: y };
}

// The "All visualizations" list of the right column; `hot` is the name of the highlighted row.
const VIZ = [['Time series', 'Time based line, area and bar charts'], ['Bar chart', 'Categorical charts with group support'], ['Stat', 'Big stat values & sparklines'], ['Gauge', 'Standard gauge visualization'], ['Bar gauge', 'Horizontal and vertical gauges'], ['Table', 'Supports many column styles'], ['Pie chart', 'The new core pie chart visualization'], ['State timeline', 'State changes and durations'], ['Heatmap', 'Like a histogram over time'], ['Status history', 'Periodic status history'], ['Histogram', 'Distribution of values presented as a bar chart.'], ['Text', ''], ['Logs', ''], ['Traces', '']];
function vizList(names, hot) {
  const nodes = [box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }), { block: 'tabs', x: R.x + 4, y: 106, w: R.w - 8, tabs: ['Suggestions', 'All visualizations'], active: 1 }, { block: 'field', x: R.x + 12, y: 154, w: R.w - 24, placeholder: 'Search for...' }];
  const t1 = Math.ceil(textWidth('Suggestions', 14)) + 24, t2 = Math.ceil(textWidth('All visualizations', 14, { weight: 500 })) + 24;
  const tab = { x: R.x + 4 + t1 + 4, y: 106, w: t2 - 8, h: 32 };
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
  return { nodes, hot: hotBox, tab };
}

// The editor. o: title, ds (data source name), mode ('builder'|'code'), preview (nodes), lines (query lines, or none),
// optsRow (opened Options row), right (nodes + geo from pane/vizList), bottom ('queries'|'empty'|node list), over (nodes
// painted last, before the marks), saved, marksFn(geo, mine) returns the callouts.
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
      if (o.over) n.push(...o.over);
      n.push(...(o.marksFn ? o.marksFn(geo, mine) : []));
      return n;
    },
  });
  return e;
}

// ---- a table panel drawn from cells ---------------------------------------------------------------------------------
// cols: [{ title, w, kind: 'text'|'num'|'link'|'thr', fmt(v), fill(v) }]; rows: arrays of cell values. Returns { nodes, hdr, xs, k }.
const defFmt = (v) => (typeof v === 'number' ? v.toFixed(1) : String(v));
function tbl({ x, y, w, cols, rows, rowH = 30 }) {
  const k = w / cols.reduce((s, c) => s + c.w, 0);
  let cx = x;
  const xs = cols.map((c) => { const p = cx; cx += c.w * k; return p; });
  const nodes = [box(x, y, w, rowH * (rows.length + 1), { fill: 'canvas', stroke: 'border', radius: 4 }), box(x + 1, y + 1, w - 2, rowH - 1, { fill: 'surfaceRaised' })];
  const hdr = [];
  cols.forEach((c, i) => {
    const cw = c.w * k;
    const right = c.kind === 'num' || c.kind === 'thr';
    nodes.push(lbl(right ? xs[i] + cw - 10 : xs[i] + 10, y + rowH / 2 + 4, c.title, { size: 'small', weight: 600, anchor: right ? 'end' : 'start', box: cw - 20 }));
    hdr.push({ x: xs[i], y, w: cw, h: rowH });
  });
  const cells = [];
  rows.forEach((r, ri) => {
    const ry = y + rowH * (ri + 1);
    nodes.push(rule(x, ry, w));
    cells.push([]);
    r.forEach((v, i) => {
      const c = cols[i], cw = c.w * k, f = c.fmt ?? defFmt;
      if (c.kind === 'thr') {
        nodes.push(box(xs[i] + 1, ry + 1, cw - 2, rowH - 1, { fill: c.fill(v) }));
        nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, f(v), { size: 'small', tone: 'canvas', weight: 500, anchor: 'end', box: cw - 20 }));
      } else if (c.kind === 'num') nodes.push(lbl(xs[i] + cw - 10, ry + rowH / 2 + 4, f(v), { size: 'small', anchor: 'end', box: cw - 20 }));
      else nodes.push(lbl(xs[i] + 10, ry + rowH / 2 + 4, f(v), { size: 'small', tone: c.kind === 'link' ? 'link' : 'text', box: cw - 20 }));
      cells[ri].push({ x: xs[i], y: ry, w: cw, h: rowH });
    });
  });
  return { nodes, hdr, xs, k, cells };
}

const QUERY = 'sum by (uri) (rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))';
const TITLE = 'Requests per second by route';
const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const TIME = '2026-11-11 10:16:20';
const ROUTES = [['/api/books/{id}', 2.1], ['/api/loans', 1.0], ['/api/books', 4.8], ['/api/search', 1.1]];
const unitFmt = (v) => `${v.toFixed(1)} req/s`;
const mapFmt = (v) => (v <= 1.2 ? 'Quiet' : unitFmt(v));
const thrFill = (v) => (v >= 4 ? 'threshold.red' : v >= 2 ? 'threshold.orange' : 'threshold.green');
const rows = ROUTES.map(([u, v]) => [TIME, u, v]);
const cols = (o = {}) => [{ title: 'Time', w: 200 }, { title: 'uri', w: 340, kind: o.link ? 'link' : 'text' }, { title: 'Value', w: 196, kind: o.thr ? 'thr' : 'num', fmt: o.fmt, fill: thrFill }];
const editTable = (o) => tbl({ x: 28, y: 134, w: 736, cols: cols(o), rows });

const groups = (o = {}) => [
  { label: 'Panel options', open: o.panel, items: [{ t: 'field', label: 'Title', value: TITLE }] },
  { label: 'Standard options', open: o.std, items: [{ t: 'drop', label: 'Unit', value: 'requests/sec (rps)' }, { t: 'field', label: 'Decimals', value: '1' }] },
  { label: 'Data links and actions' },
  { label: 'Value mappings', open: !!o.map, items: o.map ?? [] },
  { label: 'Thresholds', open: !!o.thr, items: o.thr ?? [] },
];
const THR2 = [{ t: 'thr', rows: [['threshold.red', '80'], ['threshold.green', 'Base']] }, { t: 'btn', label: 'Add threshold', icon: 'plus' }, { t: 'seg', label: 'Thresholds mode', items: ['Absolute', 'Percentage'], w: 100 }];
const THR3 = [{ t: 'thr', rows: [['threshold.red', '4'], ['threshold.orange', '2'], ['threshold.green', 'Base']] }, { t: 'btn', label: 'Add threshold', icon: 'plus' }, { t: 'seg', label: 'Thresholds mode', items: ['Absolute', 'Percentage'], w: 100 }];

const figures = [];
const base = { crumbs: CRUMBS, title: TITLE, mode: 'code', lines: [QUERY] };

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

// 04: panel editor, query A in Builder mode: the Code option (step 6)
{
  const e = ed({ crumbs: CRUMBS, marksFn: (g) => mark(g.code, 6) });
  figures.push({
    id: '04-code-mode',
    alt: 'Panel editor with an empty New panel on the Queries tab and the Prometheus data source: callout 6 marks the Code option of the Builder and Code switch',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 05: the typed query, the opened Options row and Run queries (steps 7 to 10)
{
  const e = ed({
    crumbs: CRUMBS, mode: 'code', lines: [QUERY], optsRow: [['Format', 'Table'], ['Type', 'Instant']],
    marksFn: (g, m) => marks([[g.editor, 7], [m.Format, 8], [m.Type, 9], [g.runQueries, 10]]),
  });
  figures.push({
    id: '05-query-typed',
    alt: 'Panel editor in Code mode: the query that sums the request rate by uri is typed in the editor (callout 7), the opened Options row shows Format set to Table (callout 8) and Type set to Instant (callout 9), and Run queries is marked by callout 10',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 06: All visualizations: Table (steps 11 and 12)
{
  const v = vizList(['Time series', 'Bar chart', 'Stat', 'Gauge', 'Bar gauge', 'Table', 'Pie chart', 'State timeline'], 'Table');
  const t = editTable({});
  const e = ed({ ...base, preview: t.nodes, right: v, title: 'New panel', marksFn: () => [...mark(v.tab, 11), ...mark(v.hot, 12)] });
  figures.push({
    id: '06-pick-table',
    alt: 'Panel editor after Run queries: the preview shows the result as a table with the columns Time, uri and Value; the All visualizations tab of the right column is marked by callout 11 and its list offers Table with the description Supports many column styles, marked by callout 12',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 07: title, unit and decimals (steps 13 to 15)
{
  const p = pane('Table', groups({ panel: true, std: true }));
  const t = editTable({ fmt: unitFmt });
  const e = ed({ ...base, preview: t.nodes, right: p, marksFn: () => marks([[p.geo.Title, 13], [p.geo.Unit, 14], [p.geo.Decimals, 15]]) });
  figures.push({
    id: '07-title-unit-decimals',
    alt: 'Panel editor with the Table options pane: under Panel options the Title field holds Requests per second by route (callout 13), under Standard options the Unit is the requests per second unit (callout 14) and Decimals is 1 (callout 15); the preview shows values such as 4.8 req/s',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 08: Thresholds: the red step and Add threshold (steps 16 and 17)
{
  const p = pane('Table', groups({ thr: THR2 }));
  const e = ed({ ...base, preview: editTable({ fmt: unitFmt }).nodes, right: p, marksFn: () => marks([[p.geo.thr0, 16], [p.geo['Add threshold'], 17]]) });
  figures.push({
    id: '08-thresholds-start',
    alt: 'Options pane with the Thresholds category open: a red step with the value 80 marked by callout 16, the green Base step, the Add threshold button marked by callout 17 and the Thresholds mode switch set to Absolute',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 09: the new step: value 2 and its colour (steps 18 and 19)
{
  const p = pane('Table', groups({ thr: THR3 }));
  const e = ed({ ...base, preview: editTable({ fmt: unitFmt }).nodes, right: p, marksFn: () => marks([[p.geo.thr1, 18], [p.geo.thr1dot, 19]]) });
  figures.push({
    id: '09-thresholds-typed',
    alt: 'Options pane with three thresholds: the red step is 4, the new step holds the value 2 (callout 18) and its colour dot, set to orange, is marked by callout 19, above the green Base step',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 10: Value mappings: the category and its add control (steps 20 and 21)
{
  const p = pane('Table', groups({ map: [{ t: 'addbox', key: 'add' }] }));
  const e = ed({ ...base, preview: editTable({ fmt: unitFmt }).nodes, right: p, marksFn: () => marks([[p.geo['Value mappings'], 20], [p.geo.add, 21]]) });
  figures.push({
    id: '10-value-mappings',
    alt: 'Options pane with the Value mappings category open and empty: the category header is marked by callout 20 and the control that adds value mappings, drawn as a dashed box with a plus, is marked by callout 21',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 11: the range mapping 0 to 1.2 -> Quiet (steps 22 and 23)
{
  const p = pane('Table', groups({ map: [{ t: 'map', from: '0 to 1.2', text: 'Quiet', color: 'threshold.green', key: 'row' }, { t: 'addbox', key: 'add' }] }));
  const e = ed({ ...base, preview: tbl({ x: 28, y: 134, w: 736, cols: cols({ fmt: mapFmt }), rows }).nodes, right: p, marksFn: () => mark(p.geo.row, 22) });
  figures.push({
    id: '11-mapping-result',
    alt: 'Options pane after the mapping was saved: the Value mappings category lists the range 0 to 1.2 shown as the text Quiet (callout 22); the preview shows Quiet in the Value column for the two routes with little traffic and the rates with the unit for the other two',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 12: the first override: Cell type of the field Value (steps 24 to 26)
{
  const p = pane('Table', groups({}));
  const geo = {};
  const oy = p.endY + 6;
  geo.add = { x: R.x + 12, y: oy, w: R.w - 24, h: 32 };
  geo.matcher = { x: R.x + 24, y: oy + 78, w: R.w - 48, h: 32 };
  geo.prop = { x: R.x + 24, y: oy + 144, w: R.w - 48, h: 32 };
  const extra = [btn(geo.add.x, oy, geo.add.w, 'Add field override'),
    box(R.x + 12, oy + 46, R.w - 24, 170, { fill: 'inputBg', stroke: 'border', radius: 6 }),
    lbl(R.x + 24, oy + 70, 'Field', { size: 'small', tone: 'textMuted', box: 200 }),
    { block: 'dropdown', x: R.x + 24, y: oy + 78, w: R.w - 48, value: 'Value' },
    lbl(R.x + 24, oy + 138, 'Cell type', { size: 'small', weight: 500, box: 200 }),
    { block: 'dropdown', x: R.x + 24, y: oy + 144, w: R.w - 48, value: 'Colored background' }];
  const e = ed({ ...base, preview: tbl({ x: 28, y: 134, w: 736, cols: cols({ thr: true, fmt: mapFmt }), rows }).nodes, right: { nodes: [...p.nodes, ...extra] }, marksFn: () => marks([[geo.add, 24], [geo.matcher, 25], [geo.prop, 26]]) });
  figures.push({
    id: '12-override-cell-type',
    alt: 'Options pane scrolled to its end: the Add field override button is marked by callout 24, the new override selects the field Value (callout 25) and sets the property Cell type to the coloured background type (callout 26); the preview colours the Value cells red, orange and green',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 13: the second override: two data links on the field uri (steps 27 to 31)
{
  const p = pane('Table', groups({}));
  const ix = R.x + 12, iw = R.w - 24;
  const geo = {};
  const o1 = p.endY + 4;
  const ex = [box(ix, o1, iw, 38, { fill: 'inputBg', stroke: 'border', radius: 6 }), lbl(ix + 12, o1 + 17, 'Value', { weight: 500, box: 100 }), lbl(ix + 12, o1 + 33, 'Cell type: Colored background', { size: 'small', tone: 'textMuted', box: iw - 24 })];
  const ay = o1 + 44;
  geo.add = { x: ix, y: ay, w: iw, h: 32 };
  ex.push(btn(ix, ay, iw, 'Add field override'));
  const cy = ay + 36;
  ex.push(box(ix, cy, iw, 632 - cy - 2, { fill: 'inputBg', stroke: 'border', radius: 6 }), lbl(ix + 12, cy + 20, 'Field', { size: 'small', tone: 'textMuted', box: 100 }), { block: 'dropdown', x: ix + 12, y: cy + 26, w: iw - 24, value: 'uri' });
  geo.matcher = { x: ix + 12, y: cy + 26, w: iw - 24, h: 32 };
  ex.push(lbl(ix + 12, cy + 86, 'Data links and actions', { size: 'small', weight: 500, box: iw - 24 }));
  geo.prop = { x: ix + 8, y: cy + 72, w: iw - 16, h: 20 };
  [['Route detail', '/d/bookshelf-service...'], ['Logs in Explore', '/explore?panes=...']].forEach(([t, u], i) => {
    const ry = cy + 104 + i * 44;
    ex.push(box(ix + 12, ry, iw - 24, 40, { fill: 'surface', stroke: 'border', radius: 4 }), lbl(ix + 22, ry + 16, t, { weight: 500, box: iw - 44 }), lbl(ix + 22, ry + 32, u, { size: 'small', tone: 'textMuted', mono: true, box: iw - 44 }));
    geo[`link${i}`] = { x: ix + 12, y: ry, w: iw - 24, h: 40 };
  });
  const e = ed({ ...base, preview: tbl({ x: 28, y: 134, w: 736, cols: cols({ thr: true, fmt: mapFmt, link: true }), rows }).nodes, right: { nodes: [...p.nodes, ...ex] }, marksFn: () => marks([[geo.add, 27], [geo.matcher, 28], [geo.prop, 29], [geo.link0, 30], [geo.link1, 31]]) });
  figures.push({
    id: '13-override-data-links',
    alt: 'Options pane with two overrides: the first one is Value with its cell type, the Add field override button is marked by callout 27, the second override selects the field uri (callout 28) and its property Data links and actions (callout 29) lists the link Route detail (callout 30) and the link Logs in Explore (callout 31); the uri cells of the preview turn into links',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 14 and 15: the finished table in view mode, with the link menu in 14
function viewTable({ menuOpen }) {
  const tb = gDashToolbar({ view: true });
  const t = tbl({ x: 28, y: 138, w: 696, cols: cols({ thr: true, fmt: mapFmt, link: true }), rows });
  const nodes = [...tb.nodes, { block: 'panel', x: 16, y: 106, w: 720, h: 280, title: TITLE }, ...t.nodes];
  if (menuOpen) {
    const c = t.cells[2][1];
    const m = menu({ x: c.x + 60, y: c.y + 28, w: 200, items: ['Route detail', 'Logs in Explore'], hot: 0 });
    nodes.push(...m.nodes, ...marks([[{ x: c.x + 6, y: c.y + 2, w: 100, h: 26 }, 37], [m.rows[0], 38], [m.rows[1], 39]]));
  }
  return grafanaFrame({ h: 410, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: nodes });
}
figures.push({
  id: '14-link-menu',
  alt: 'Dashboard Bookshelf (guides) in view mode: after a click on the route /api/books (callout 37) a menu offers the two data links, Route detail (callout 38) and Logs in Explore (callout 39)',
  width: FW, height: 410, nodes: viewTable({ menuOpen: true }),
});
figures.push({
  id: '15-result',
  alt: 'Finished table panel Requests per second by route in view mode: the column uri lists the four routes as links, and the Value column is coloured red, orange and green by thresholds, shows rates with the unit req/s and the word Quiet for the routes with little traffic',
  width: FW, height: 410, nodes: viewTable({ menuOpen: false }),
});

export default { product: 'grafana', guide: 'g11', figures };
