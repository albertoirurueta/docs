// Figures of the Grafana guide G13, "Variables, filters and repeats" (guide-variables-and-repeats.adoc).
// Facts: guides-brief/grafana-facts.md sections 6, 9 and 14 (13.3.0: variable settings live in the dashboard sidebar, Options pane with
// Filters (+), Variables (+), Annotations (+), Links (+); Choose variable type list incl. Switch; Query variable form with Name, Label,
// Description, Query options, Selection options; Filter and Group by replaces ad hoc filters). NOT VERIFIED in the lab and therefore
// drawn generically: the forms of the Custom, Interval and Data source variables, the query editor of a variable, the Filters entry,
// the Repeat options of a panel and the way a data source variable is listed in the data source picker. Callout numbers are the step
// numbers of the page. Colours are theme tokens only.
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

const CRUMBS = ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'];
const DASH = ['Dashboards', 'Guides', 'Bookshelf (guides)'];
const T13 = 'Requests per second for $route';
const Q1 = 'sum by (status) (rate(http_server_requests_seconds_count{application="$application",';
const Q2 = 'uri=~"$route"}[$window]))';
const dd = (x, y, w, label, value) => ({ block: 'dropdown', x, y, w, ...(label ? { label } : {}), value });
const PX = 732, PW = 296, IX = PX + 12, IW = PW - 24;

// ---- the dashboard in edit mode with the sidebar: icon strip and a pane ------------------------------------------------
const STRIP = ['plus', 'gear', 'edit', 'share', 'menu', 'chevronRight'];
function strip(active) {
  const nodes = [];
  STRIP.forEach((ic, i) => { const y = 100 + i * 38; if (i === active) nodes.push(box(1040, y, 32, 32, { fill: 'navActiveBg', radius: 6 })); nodes.push(ico(1048, y + 8, ic, i === active ? 'text' : 'textMuted')); });
  return { nodes, options: { x: 1040, y: 100 + 38, w: 32, h: 32 } };
}
const plusRow = (y, label, open = false) => [ico(PX + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(PX + 32, y + 21, label, { weight: 500, box: PW - 80 }), ico(PX + PW - 30, y + 8, 'plus', 'link'), rule(PX, y + 32, PW)];
const plusBox = (y) => ({ x: PX + PW - 36, y: y + 2, w: 28, h: 28 });
function dashEdit(h, children) {
  const tb = gDashToolbar({ saved: true, right: 1024 });
  return grafanaFrame({ h, crumbs: DASH, children: [
    ...tb.nodes,
    { block: 'panel', x: 16, y: 106, w: 520, h: 300, title: 'Requests per second by status' }, reqChart(24, 132, 504, 270),
    ...children,
  ] });
}
// The Dashboard pane (Options icon): View all settings, Title, Description, Layout and the four collapsible lists.
function dashPane({ open = '', extra = [] } = {}) {
  const nodes = [{ block: 'sidePanel', x: PX, y: 100, w: PW, h: 500, title: 'Dashboard' }, btn(IX, 140, IW, 'View all settings'),
    { block: 'field', x: IX, y: 186, w: IW, label: 'Title', value: 'Bookshelf (guides)' }, { block: 'field', x: IX, y: 244, w: IW, label: 'Description', placeholder: '' }];
  const seg = segmented({ x: IX, y: 322, items: ['Custom', 'Auto'], w: 90, active: 1 });
  nodes.push(lbl(IX, 314, 'Layout', { size: 'small', weight: 500, box: 100 }), ...seg.nodes);
  const rows = {};
  let y = 372;
  ['Filters', 'Variables', 'Annotations', 'Links'].forEach((n) => {
    nodes.push(...plusRow(y, n, open === n));
    rows[n] = { y, plus: plusBox(y), head: { x: PX + 4, y, w: PW - 50, h: 32 } };
    y += 34;
    if (open === n) { nodes.push(...extra); y += 90; }
  });
  return { nodes, rows };
}

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

// 02: the Dashboard pane of the Options icon (steps 3 and 4)
{
  const s = strip(1), p = dashPane();
  figures.push({
    id: '02-options-pane',
    alt: 'Dashboard in edit mode with the Options icon of the right sidebar marked by callout 3 and the Dashboard pane open: View all settings, Title, Description, Layout and the lists Filters, Variables, Annotations and Links, each with a plus button; the plus of Variables is marked by callout 4',
    width: FW, height: 640,
    nodes: dashEdit(640, [...p.nodes, ...s.nodes, ...marks([[s.options, 3], [p.rows.Variables.plus, 4]])]),
  });
}

// 03: Choose variable type (step 5)
{
  const s = strip(1);
  const types = [['Query', 'Values are fetched from a data source query'], ['Custom', 'Values are static and defined manually'], ['Textbox', ''], ['Constant', ''], ['Data source', ''], ['Interval', 'Values are timespans, ex 1m, 1h, 1d'], ['Switch', 'A variable that can be toggled on and off']];
  const nodes = [{ block: 'sidePanel', x: PX, y: 100, w: PW, h: 470, title: 'Choose variable type' }];
  let y = 144, hot;
  types.forEach(([n, d], i) => {
    const rh = d ? 52 : 36;
    if (i === 0) { nodes.push(box(IX, y, IW, rh, { fill: 'navActiveBg', radius: 4 })); hot = { x: IX, y, w: IW, h: rh }; }
    nodes.push(lbl(IX + 8, y + 22, n, { weight: 500, box: IW - 24 }));
    if (d) nodes.push(lbl(IX + 8, y + 40, d, { size: 'small', tone: 'textMuted', box: IW - 12 }));
    y += rh + 4;
  });
  figures.push({
    id: '03-variable-types',
    alt: 'The Choose variable type list of the dashboard sidebar with the types Query, Custom, Textbox, Constant, Data source, Interval and Switch; Query, described as values fetched from a data source query, is marked by callout 5',
    width: FW, height: 640, nodes: dashEdit(640, [...nodes, ...s.nodes, ...mark(hot, 5)]),
  });
}

// ---- the variable form of the sidebar ------------------------------------------------------------------------------
function varForm({ title, name, label, kind = 'query', values, ds, multi = false, all = false }) {
  const nodes = [{ block: 'sidePanel', x: PX, y: 100, w: PW, h: 520, title }, btn(IX, 136, 100, 'Change type'), btn(IX + 108, 136, 84, 'Duplicate'), btn(IX + 200, 136, 72, 'Delete'),
    { block: 'field', x: IX, y: 182, w: IW, label: 'Name', value: name }, { block: 'field', x: IX, y: 240, w: IW, label: 'Label', value: label }];
  const geo = { name: { x: IX, y: 202, w: IW, h: 32 }, label: { x: IX, y: 260, w: IW, h: 32 } };
  if (kind === 'query') {
    nodes.push({ block: 'field', x: IX, y: 298, w: IW, label: 'Description', placeholder: '' }, lbl(IX, 378, 'Query options', { weight: 600, box: 200 }), btn(IX, 386, IW, 'Open variable editor'),
      lbl(IX, 450, 'Selection options', { weight: 600, box: 200 }),
      { block: 'toggle', x: IX, y: 462, label: 'Multi-value', on: multi, box: 200 }, { block: 'toggle', x: IX, y: 494, label: 'Include All value', on: all, box: 200 }, { block: 'toggle', x: IX, y: 526, label: 'Allow custom values', on: false, box: 200 });
    geo.open = { x: IX, y: 386, w: IW, h: 32 }; geo.multi = { x: IX, y: 461, w: IW, h: 20 }; geo.all = { x: IX, y: 493, w: IW, h: 20 };
  } else if (kind === 'values') {
    nodes.push({ block: 'field', x: IX, y: 298, w: IW, label: 'Values', value: values, mono: true });
    geo.values = { x: IX, y: 318, w: IW, h: 32 };
  } else {
    nodes.push({ block: 'dropdown', x: IX, y: 240, w: IW, label: 'Type', value: ds });
    geo.type = { x: IX, y: 260, w: IW, h: 32 };
    nodes.splice(nodes.findIndex((n) => n.label === 'Label'), 1);
  }
  return { nodes, geo };
}

// 04: the Query variable form for Application (steps 6 to 8)
{
  const f = varForm({ title: 'Query variable', name: 'application', label: 'Application' }), s = strip(1);
  figures.push({
    id: '04-query-variable',
    alt: 'The Query variable form in the dashboard sidebar: the Name field holds application (callout 6), the Label field holds Application (callout 7), and the Open variable editor button under Query options is marked by callout 8; the Selection options toggles are all off',
    width: FW, height: 640, nodes: dashEdit(640, [...f.nodes, ...s.nodes, ...marks([[f.geo.name, 6], [f.geo.label, 7], [f.geo.open, 8]])]),
  });
}

// ---- the variable query editor (generic) -----------------------------------------------------------------------------
function varEditor({ line, marksOf }) {
  const x = 120, y = 56, w = 840, h = 300;
  const geo = { ds: { x: x + 24, y: y + 92, w: 260, h: 32 }, editor: { x: x + 24, y: y + 160, w: w - 48, h: 44 }, close: { x: x + w - 32, y: y + 16, w: 16, h: 16 } };
  const nodes = [{ block: 'flyout', x, y, w, h, title: 'Query options' }, dd(x + 24, y + 72, 260, 'Data source', 'Prometheus'), lbl(x + 24, y + 150, 'Query', { size: 'small', weight: 500, box: 100 }),
    { block: 'queryEditor', x: x + 24, y: y + 160, w: w - 48, h: 44, lines: [line], lineNumbers: true }];
  return { nodes: grafanaFrame({ h: 400, crumbs: DASH, children: [...nodes, ...marksOf(geo)] }) };
}
figures.push({
  id: '05-variable-editor',
  alt: 'The query editor of the variable opened with Open variable editor: the data source Prometheus is selected (callout 9), the query label_values with the metric http_server_requests_seconds_count and the label application is typed in the editor (callout 10), and the close icon of the editor is marked by callout 11',
  width: FW, height: 400,
  nodes: varEditor({ line: 'label_values(http_server_requests_seconds_count, application)', marksOf: (g) => marks([[g.ds, 9], [g.editor, 10], [g.close, 11]]) }).nodes,
});

// 06: the Query variable form for Route (steps 13 to 15)
{
  const f = varForm({ title: 'Query variable', name: 'route', label: 'Route' }), s = strip(1);
  figures.push({
    id: '06-route-variable',
    alt: 'The Query variable form for the second variable: the Name field holds route (callout 13), the Label field holds Route (callout 14), and the Open variable editor button is marked by callout 15',
    width: FW, height: 640, nodes: dashEdit(640, [...f.nodes, ...s.nodes, ...marks([[f.geo.name, 13], [f.geo.label, 14], [f.geo.open, 15]])]),
  });
}

// 07: the chained query (steps 16 and 17)
figures.push({
  id: '07-chained-query',
  alt: 'The variable query editor with the chained query: label_values of the metric http_server_requests_seconds_count filtered by application equal to $application, for the label uri, typed in the editor (callout 16); the close icon is marked by callout 17',
  width: FW, height: 400,
  nodes: varEditor({ line: 'label_values(http_server_requests_seconds_count{application="$application"}, uri)', marksOf: (g) => marks([[g.editor, 16], [g.close, 17]]) }).nodes,
});

// 08: Multi-value and Include All value (steps 18 and 19)
{
  const f = varForm({ title: 'Query variable', name: 'route', label: 'Route', multi: true, all: true }), s = strip(1);
  figures.push({
    id: '08-selection-options',
    alt: 'The Query variable form of the variable route scrolled to Selection options: the toggle Multi-value is on (callout 18), Include All value is on (callout 19) and Allow custom values stays off',
    width: FW, height: 640, nodes: dashEdit(640, [...f.nodes, ...s.nodes, ...marks([[f.geo.multi, 18], [f.geo.all, 19]])]),
  });
}

// 09, 10, 11: custom, interval and data source variables (steps 20 to 30)
{
  const f = varForm({ title: 'Custom variable', name: 'percentile', label: 'Percentile', kind: 'values', values: '0.5,0.9,0.95,0.99' }), s = strip(1);
  figures.push({
    id: '09-custom-variable',
    alt: 'A Custom variable form: Name percentile (callout 21), Label Percentile (callout 22) and the list of values 0.5,0.9,0.95,0.99 (callout 23)',
    width: FW, height: 640, nodes: dashEdit(640, [...f.nodes.map((n) => (n.block === 'sidePanel' ? { ...n, h: 380 } : n)), ...s.nodes, ...marks([[f.geo.name, 21], [f.geo.label, 22], [f.geo.values, 23]])]),
  });
}
{
  const f = varForm({ title: 'Interval variable', name: 'window', label: 'Window', kind: 'values', values: '1m,5m,10m' }), s = strip(1);
  figures.push({
    id: '10-interval-variable',
    alt: 'An Interval variable form: Name window (callout 25), Label Window (callout 26) and the list of intervals 1m,5m,10m (callout 27)',
    width: FW, height: 640, nodes: dashEdit(640, [...f.nodes.map((n) => (n.block === 'sidePanel' ? { ...n, h: 380 } : n)), ...s.nodes, ...marks([[f.geo.name, 25], [f.geo.label, 26], [f.geo.values, 27]])]),
  });
}
{
  const f = varForm({ title: 'Data source variable', name: 'ds', label: '', kind: 'type', ds: 'Prometheus' }), s = strip(1);
  figures.push({
    id: '11-datasource-variable',
    alt: 'A Data source variable form: Name ds (callout 29) and the data source type Prometheus (callout 30)',
    width: FW, height: 640, nodes: dashEdit(640, [...f.nodes.map((n) => (n.block === 'sidePanel' ? { ...n, h: 340 } : n)), ...s.nodes, ...marks([[f.geo.name, 29], [f.geo.type, 30]])]),
  });
}

// 12: Filters: the plus and the data source of the Filter and Group by control (steps 31 and 32)
{
  const s = strip(1);
  const item = [box(IX, 0, IW, 80, { fill: 'inputBg', stroke: 'border', radius: 6 })];
  const p0 = dashPane({ open: 'Filters', extra: [] });
  const fy = p0.rows.Filters.y + 38;
  const items = [box(IX, fy, IW, 84, { fill: 'inputBg', stroke: 'border', radius: 6 }), lbl(IX + 12, fy + 22, 'Filter and Group by', { weight: 500, box: IW - 24 }), dd(IX + 12, fy + 30, IW - 24, '', 'Prometheus')];
  void item;
  const geoDs = { x: IX + 12, y: fy + 30, w: IW - 24, h: 32 };
  figures.push({
    id: '12-filters',
    alt: 'The Dashboard pane with the list Filters open: the plus button of Filters is marked by callout 31 and the new entry for the Filter and Group by control shows the data source Prometheus, marked by callout 32',
    width: FW, height: 640, nodes: dashEdit(640, [...p0.nodes, ...items, ...s.nodes, ...marks([[p0.rows.Filters.plus, 31], [geoDs, 32]])]),
  });
}

// 13: the panel that uses the variables (steps 34 to 39)
const chart = () => [reqChart(24, 128, 744, 186)];
const gr = (o = {}) => [
  { label: 'Panel options', open: o.panel, items: [{ t: 'field', label: 'Title', value: T13 }, { t: 'field', label: 'Description', placeholder: '' }] },
  { label: 'Panel links' },
  { label: 'Repeat options', open: o.repeat, items: [{ t: 'drop', label: 'Repeat by variable', value: 'route' }] },
  { label: 'Show / hide rules' }, { label: 'Tooltip' }, { label: 'Legend' },
];
{
  const p = pane('Time series', gr({ panel: true }));
  const e = ed({ crumbs: CRUMBS, title: T13, ds: '${ds}', mode: 'code', lines: [Q1, Q2], preview: chart(), right: p, marksFn: (g) => marks([[g.ds, 34], [g.editor, 36], [g.runQueries, 37], [p.geo.Title, 39]]) });
  figures.push({
    id: '13-panel-query',
    alt: 'Panel editor of a time series panel titled Requests per second for $route: the data source picker holds the variable ds (callout 34), the query that uses $application, $route and $window is typed in the editor (callout 36), Run queries is marked by callout 37 and the Title field of the options pane holds the same title (callout 39)',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 14: Repeat options (steps 40 and 41)
{
  const p = pane('Time series', gr({ repeat: true }));
  const e = ed({ crumbs: CRUMBS, title: T13, ds: '${ds}', mode: 'code', lines: [Q1, Q2], preview: chart(), right: p, marksFn: () => marks([[p.geo['Repeat options'], 40], [p.geo['Repeat by variable'], 41]]) });
  figures.push({
    id: '14-repeat-options',
    alt: 'Options pane of the panel with the category Repeat options open: the category header is marked by callout 40 and its variable select holds route, marked by callout 41',
    width: FW, height: 640, nodes: e.nodes,
  });
}

// 15: the finished dashboard (What you build)
{
  const tb = gDashToolbar({ view: true });
  const ctrl = (x, l, v, wl, wv) => [box(x, 100, wl, 32, { fill: 'surfaceRaised', stroke: 'border', radius: 6 }), lbl(x + 10, 121, l, { size: 'small', weight: 500, box: wl - 14 }), box(x + wl, 100, wv, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), lbl(x + wl + 10, 121, v, { size: 'small', box: wv - 14 })];
  const kids = [...tb.nodes, ...ctrl(16, 'Application', 'bookshelf', 92, 92), ...ctrl(220, 'Route', 'All', 60, 52), ...ctrl(340, 'Window', '5m', 72, 52), ...ctrl(464, 'Percentile', '0.95', 88, 60), ...ctrl(624, 'ds', 'Prometheus', 36, 100)];
  const routes = ['/api/books', '/api/loans', '/api/search'], scale = [1, 0.22, 0.25];
  routes.forEach((r, i) => {
    const x = 16 + i * 356;
    kids.push({ block: 'panel', x, y: 148, w: 340, h: 270, title: `Requests per second for ${r}` });
    kids.push({ block: 'line', x: x + 6, y: 172, w: 328, h: 242, series: [{ name: '200', points: [8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2, 8.6].map((v) => v * scale[i]) }, { name: '404', points: [1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3, 1.2].map((v) => v * scale[i]) }], min: 0, max: 10, yLabels: ['0', '2', '4', '6', '8', '10'], xLabels: ['10:00', '12:00', '14:00'] });
  });
  figures.push({
    id: '15-result',
    alt: 'Finished dashboard Bookshelf (guides) in view mode: the variable controls Application, Route, Window, Percentile and ds sit in a row under the toolbar, and the panel Requests per second for $route is repeated once for each of the routes /api/books, /api/loans and /api/search',
    width: FW, height: 440, nodes: grafanaFrame({ h: 440, crumbs: DASH, children: kids }),
  });
}

export default { product: 'grafana', guide: 'g13', figures };
