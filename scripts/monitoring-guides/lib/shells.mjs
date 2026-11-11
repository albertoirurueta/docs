// Reusable figure fragments for the monitoring guides: the product shells (frame, navigation, top bars), the screens
// that several figures share (Grafana dashboard edit mode and panel editor, Kibana dashboard and Lens editor) and the
// helpers that put the numbered callouts on them. Everything here returns plain node data for lib/render.mjs, so a spec
// stays data and the maps and the step figures of one screen cannot drift apart. Colours are token names only.
//
// Geometry: every figure of the guides is FW (1080) px wide, the widest the library accepts (12px text is 10px at
// width=900). Screens are redrawn, not copied: a region is simplified to what its step needs.

import { textWidth } from './text.mjs';

export const FW = 1080;

// ---------------------------------------------------------------- small helpers
export const lbl = (x, y, str, o = {}) => ({ block: 'label', x, y, str, ...o });
export const box = (x, y, w, h, o = {}) => ({ block: 'rect', x, y, w, h, ...o });
export const rule = (x, y, w) => box(x, y, w, 1, { fill: 'border' });
export const btn = (x, y, w, label, kind = 'secondary', icon) => ({ block: 'button', x, y, w, label, kind, ...(icon ? { icon } : {}) });
export const ico = (x, y, name, tone = 'textMuted') => ({ block: 'icon', x, y, name, tone });
// A highlight box with its numbered callout on the top right corner; `b` is { x, y, w, h }.
export const mark = (b, num) => [
  { block: 'highlight', x: b.x, y: b.y, w: b.w, h: b.h },
  { block: 'callout', x: b.x + b.w + 3, y: b.y - 3, num },
];
// Several marks; `list` is [[box, num], ...].
export const marks = (list) => list.flatMap(([b, n]) => mark(b, n));
// A menu popover: heading (optional) and items, `hot` is the index of the highlighted item.
export function menu({ x, y, w, heading, items, hot = -1 }) {
  const rows = items.length;
  const top = heading ? 30 : 8;
  const h = top + rows * 30 + 6;
  const out = [box(x, y, w, h, { fill: 'surface', stroke: 'borderStrong', radius: 6 })];
  if (heading) out.push(lbl(x + 12, y + 20, heading, { size: 'small', tone: 'textMuted' }));
  items.forEach((it, i) => {
    const iy = y + top + i * 30;
    if (i === hot) out.push(box(x + 4, iy - 2, w - 8, 28, { fill: 'navActiveBg', radius: 4 }));
    out.push(lbl(x + 14, iy + 17, it, { weight: i === hot ? 500 : 400, box: w - 28 }));
  });
  return { nodes: out, rows: items.map((_, i) => ({ x: x + 4, y: y + top + i * 30 - 2, w: w - 8, h: 28 })), h };
}
// A segmented control (Builder / Code): the active item is raised.
export function segmented({ x, y, items, w = 72, active = 0 }) {
  const out = [box(x, y, w * items.length, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 })];
  items.forEach((it, i) => {
    if (i === active) out.push(box(x + i * w + 2, y + 2, w - 4, 28, { fill: 'surfaceRaised', radius: 4 }));
    out.push(lbl(x + i * w + w / 2, y + 21, it, { anchor: 'middle', weight: i === active ? 500 : 400, box: w - 8 }));
  });
  return { nodes: out, boxes: items.map((_, i) => ({ x: x + i * w, y, w, h: 32 })) };
}
// A legend for a screen map: numbered discs with their meaning, in columns.
export function legend({ x, y, items, cols = 2, colW = 520, rowH = 30 }) {
  const out = [];
  items.forEach(([num, text], i) => {
    const cx = x + (i % cols) * colW;
    const cy = y + Math.floor(i / cols) * rowH;
    out.push({ block: 'callout', x: cx + 12, y: cy + 12, num });
    out.push(lbl(cx + 32, cy + 17, text, { box: colW - 44 }));
  });
  return out;
}
export const legendHeight = (n, cols = 2, rowH = 30) => Math.ceil(n / cols) * rowH;

// ================================================================ Grafana 13.3 (dark)
const G_NAV = [
  { label: 'Bookmarks', icon: 'star' }, { label: 'Starred', icon: 'star' }, { label: 'Dashboards', icon: 'dashboard' },
  { label: 'Explore', icon: 'explore' }, { label: 'Drilldown', icon: 'search' }, { label: 'AI', icon: 'apps' },
  { label: 'Alerting', icon: 'bell' }, { label: 'Connections', icon: 'database' }, { label: 'Administration', icon: 'gear' },
];
export const G_NAV_W = 220;
export const G_NAV_ROW = { Dashboards: { x: 8, y: 116, w: G_NAV_W - 16, h: 32 }, Explore: { x: 8, y: 150, w: G_NAV_W - 16, h: 32 }, Alerting: { x: 8, y: 252, w: G_NAV_W - 16, h: 32 } };

// The Grafana window: top bar with breadcrumbs, optionally the docked navigation. Children are drawn inside.
export function grafanaFrame({ h, crumbs, nav = false, navActive = 'Dashboards', children = [] }) {
  const nx = nav ? G_NAV_W : 0;
  const inner = [];
  if (nav) inner.push({ block: 'nav', x: 0, y: 0, w: G_NAV_W, h, logo: 'si:grafana', title: 'Grafana', items: G_NAV, active: navActive });
  inner.push({ block: 'toolbar', x: nx, y: 0, w: FW - nx, crumbs });
  return [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [...inner, ...children] }];
}

// The dashboard edit toolbar (row under the top bar). `saved` shows Copy link and Share before Save.
export function gDashToolbar({ y = 58, saved = false, view = false, right = FW - 16 } = {}) {
  const out = [];
  let rx = right;
  const put = (w, label, kind, icon) => { rx -= w; out.push(btn(rx, y, w, label, kind, icon)); const b = { x: rx, y, w, h: 32 }; rx -= 8; return b; };
  const geo = {};
  if (view) {
    geo.edit = put(70, 'Edit', 'secondary');
    geo.share = put(90, 'Share', 'secondary', 'share');
    geo.refresh = put(110, 'Refresh', 'secondary', 'refresh');
    geo.time = put(150, 'Last 6 hours', 'secondary', 'clock');
  } else {
    geo.exit = put(100, 'Exit edit', 'secondary');
    geo.save = put(70, 'Save', 'primary');
    if (saved) { geo.share = put(90, 'Share', 'secondary', 'share'); geo.copy = put(120, 'Copy link', 'secondary'); }
    geo.refresh = put(110, 'Refresh', 'secondary', 'refresh');
    geo.time = put(150, 'Last 6 hours', 'secondary', 'clock');
    geo.add = { x: 16, y, w: 84, h: 32 };
    out.push(btn(16, y, 84, 'Add', 'secondary', 'plus'));
  }
  return { nodes: out, geo };
}

// A collapsible row of a side pane (chevron, label, divider).
const collapsible = (x, y, w, label, open = false) => [ico(x + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(x + 32, y + 21, label, { weight: 500, box: w - 48 }), rule(x, y + 32, w)];

// The right sidebar, Add pane (new dashboards open on it).
export function gAddPane({ x = 780, y = 100, w = 284 } = {}) {
  const ix = x + 12, iw = w - 24;
  const nodes = [
    { block: 'sidePanel', x, y, w, h: 396, title: 'Add' },
    lbl(ix, y + 52, 'Panel', { weight: 500 }),
    box(ix, y + 62, iw, 60, { fill: 'surfaceRaised', stroke: 'border', radius: 6 }),
    ico(ix + 14, y + 84, 'plus', 'link'),
    lbl(ix + 40, y + 98, 'Drag or click to add a panel', { size: 'small', tone: 'textMuted', box: iw - 52 }),
    lbl(ix, y + 150, 'Group layouts', { weight: 500 }),
    btn(ix, y + 160, (iw - 12) / 2, 'Add row'), btn(ix + (iw + 12) / 2, y + 160, (iw - 12) / 2, 'Add tab'),
    lbl(ix, y + 218, 'Dashboard controls', { weight: 500 }),
    btn(ix, y + 228, iw, 'Filter and Group by'), btn(ix, y + 266, iw, 'Variable'), btn(ix, y + 304, iw, 'Annotation query'), btn(ix, y + 342, iw, 'Link'),
  ];
  return { nodes, geo: { panelTile: { x: ix, y: y + 62, w: iw, h: 60 } } };
}

// The right sidebar, Panel pane (after the Panel tile was clicked).
export function gPanelPane({ x = 780, y = 100, w = 284, title = 'New panel', description } = {}) {
  const ix = x + 12, iw = w - 24;
  const nodes = [
    { block: 'sidePanel', x, y, w, h: 452, title: 'Panel' },
    btn(ix, y + 40, 84, 'Duplicate'), btn(ix + 92, y + 40, 72, 'Copy'), btn(ix + 172, y + 40, 88, 'Delete'),
    btn(ix, y + 86, iw, 'Edit visualization', 'primary'),
    { block: 'field', x: ix, y: y + 134, w: iw, label: 'Title', value: title },
    { block: 'field', x: ix, y: y + 196, w: iw, label: 'Description', ...(description ? { value: description } : { placeholder: '' }) },
    { block: 'toggle', x: ix, y: y + 266, label: 'Use as subtitle', on: false },
    { block: 'toggle', x: ix, y: y + 296, label: 'Transparent background', on: false },
    ...collapsible(x, y + 330, w, 'Repeat options'),
    ...collapsible(x, y + 366, w, 'Show / hide rules'),
  ];
  return { nodes, geo: { edit: { x: ix, y: y + 86, w: iw, h: 32 } } };
}

const SERIES_OK = [8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2, 8.6];
const SERIES_404 = [1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3, 1.2];
export const reqSeries = [{ name: '200', points: SERIES_OK }, { name: '404', points: SERIES_404 }];
export const timeLabels = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
export const reqChart = (x, y, w, h) => ({ block: 'line', x, y, w, h, series: reqSeries, min: 0, max: 10, yLabels: ['0', '2', '4', '6', '8', '10'], xLabels: timeLabels });

// The new-panel body: no data yet.
const emptyBody = (x, y, w, h) => [lbl(x + w / 2, y + h / 2 + 5, 'No data', { anchor: 'middle', tone: 'textMuted' })];

export const QUERY_RUNS = [
  { t: 'sum', kind: 'keyword' }, { t: ' by (status) (' }, { t: 'rate', kind: 'keyword' }, { t: '(http_server_requests_seconds_count{' },
  { t: 'application', kind: 'label' }, { t: '=' }, { t: '"bookshelf"', kind: 'string' }, { t: '}[' }, { t: '1m', kind: 'number' }, { t: ']))' },
];

// The panel editor of 13.3: preview over the Queries / Transformations tabs on the left, the visualization picker or
// the options pane on the right. `right`: 'empty' (no data yet), 'suggestions', 'options'.
export function gEditor({ h = 640, crumbs = ['Dashboards', 'New dashboard', 'Edit panel'], title = 'New panel', hasData = false, mode = 'builder', typed = false, right = 'empty', saved = false, optTitle, optDescription, children = [] }) {
  const L = { x: 16, w: 760 }, R = { x: 792, w: 272 };
  const geo = {};
  const n = [];
  // second row: Table view, time controls, Save / Discard / Back
  n.push({ block: 'toggle', x: 16, y: 66, label: 'Table view', on: false, box: 120 });
  let rx = FW - 16;
  const put = (key, w, label, kind, icon) => { rx -= w; n.push(btn(rx, 58, w, label, kind, icon)); geo[key] = { x: rx, y: 58, w, h: 32 }; rx -= 8; };
  put('back', 72, 'Back'); put('discard', 90, 'Discard'); put('save', 70, 'Save', 'primary'); put('refresh', 110, 'Refresh', 'secondary', 'refresh'); put('time', 150, 'Last 6 hours', 'secondary', 'clock');
  // preview
  n.push({ block: 'panel', x: L.x, y: 100, w: L.w, h: 220, title });
  geo.preview = { x: L.x, y: 100, w: L.w, h: 220 };
  if (hasData) n.push(reqChart(L.x + 8, 126, L.w - 16, 190)); else n.push(...emptyBody(L.x, 126, L.w, 190));
  n.push(box(L.x, 326, L.w, 4, { fill: 'border', radius: 2 }));
  // bottom tabs
  const tabs = ['Queries 1', 'Transformations 0', ...(saved ? ['Alert 0'] : [])];
  n.push({ block: 'tabs', x: L.x, y: 338, w: L.w, tabs, active: 0 });
  geo.tabs = { x: L.x, y: 338, w: 260, h: 32 };
  // data source row
  n.push({ block: 'dropdown', x: L.x, y: 380, w: 200, value: 'Prometheus' });
  geo.ds = { x: L.x, y: 380, w: 200, h: 32 };
  n.push(lbl(L.x + 214, 401, 'MD = auto = 500   Interval = 30s', { size: 'small', tone: 'textMuted', box: 300 }));
  n.push(btn(L.x + L.w - 144, 380, 144, 'Query inspector'));
  // query card
  const cy = 424;
  n.push(box(L.x, cy, L.w, 208, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(lbl(L.x + 12, cy + 26, 'A (Prometheus)', { weight: 500, box: 200 }));
  const seg = segmented({ x: L.x + L.w - 12 - 144, y: cy + 8, items: ['Builder', 'Code'], active: mode === 'code' ? 1 : 0 });
  n.push(...seg.nodes);
  geo.builder = seg.boxes[0]; geo.code = seg.boxes[1];
  n.push(btn(L.x + 232, cy + 8, 180, 'Kick start your query'));
  n.push({ block: 'toggle', x: L.x + 430, y: cy + 15, label: 'Explain', on: false, box: 70 });
  if (mode === 'code') {
    n.push(btn(L.x + 12, cy + 52, 150, 'Metrics browser'));
    geo.runQueries = { x: L.x + L.w - 12 - 120, y: cy + 52, w: 120, h: 32 };
    n.push(btn(geo.runQueries.x, geo.runQueries.y, 120, 'Run queries', 'primary'));
    const lines = typed ? [QUERY_RUNS] : [[{ t: 'Enter a PromQL query...', kind: undefined }]];
    n.push({ block: 'queryEditor', x: L.x + 12, y: cy + 96, w: L.w - 24, h: 50, lines, lineNumbers: typed });
    geo.editor = { x: L.x + 12, y: cy + 96, w: L.w - 24, h: 50 };
    n.push(btn(L.x + 12, cy + 158, 110, 'Add query'), btn(L.x + 130, cy + 158, 200, 'Add from saved queries'), btn(L.x + 338, cy + 158, 110, 'Expression'));
  } else {
    n.push(lbl(L.x + 12, cy + 80, 'Metric', { size: 'small', weight: 500 }));
    n.push({ block: 'dropdown', x: L.x + 12, y: cy + 88, w: 260, value: 'Select metric' });
    n.push(lbl(L.x + 292, cy + 80, 'Label filters', { size: 'small', weight: 500 }));
    n.push(btn(L.x + 292, cy + 88, 110, 'Add', 'secondary', 'plus'));
    n.push(btn(L.x + 12, cy + 134, 150, 'Operations', 'secondary', 'plus'));
    n.push(btn(L.x + 12, cy + 168, 110, 'Add query'), btn(L.x + 130, cy + 168, 200, 'Add from saved queries'));
    geo.runQueries = { x: L.x + L.w - 12 - 120, y: cy + 52, w: 120, h: 32 };
    n.push(btn(geo.runQueries.x, geo.runQueries.y, 120, 'Run queries', 'primary'));
  }
  // right column
  if (right === 'options') {
    n.push(box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }));
    n.push(lbl(R.x + 12, 124, 'Time series', { weight: 600 }));
    n.push(btn(R.x + R.w - 12 - 76, 106, 76, 'Change'));
    n.push({ block: 'field', x: R.x + 12, y: 146, w: R.w - 24, placeholder: 'Search options' });
    n.push(...collapsible(R.x, 190, R.w, 'Panel options', true));
    n.push({ block: 'field', x: R.x + 12, y: 232, w: R.w - 24, label: 'Title', value: optTitle ?? title });
    n.push({ block: 'field', x: R.x + 12, y: 294, w: R.w - 24, label: 'Description', ...(optDescription ? { value: optDescription } : { placeholder: '' }) });
    geo.optTitle = { x: R.x + 12, y: 252, w: R.w - 24, h: 32 };
    geo.optDesc = { x: R.x + 12, y: 314, w: R.w - 24, h: 32 };
    n.push({ block: 'toggle', x: R.x + 12, y: 362, label: 'Use as subtitle', on: false });
    ['Panel links', 'Repeat options', 'Show / hide rules', 'Tooltip', 'Legend', 'Axis'].forEach((c, i) => n.push(...collapsible(R.x, 392 + i * 34, R.w, c)));
    geo.options = { x: R.x, y: 100, w: R.w, h: 532 };
  } else {
    n.push(box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }));
    n.push({ block: 'tabs', x: R.x + 4, y: 106, w: R.w - 8, tabs: ['Suggestions', 'All visualizations'], active: 0 });
    n.push({ block: 'field', x: R.x + 12, y: 154, w: R.w - 24, placeholder: 'Search for...' });
    geo.picker = { x: R.x, y: 100, w: R.w, h: 532 };
    if (right === 'empty') {
      n.push(lbl(R.x + 12, 232, 'Run a query to start seeing', { tone: 'textMuted', box: R.w - 24 }));
      n.push(lbl(R.x + 12, 252, 'suggested visualizations', { tone: 'textMuted', box: R.w - 24 }));
      n.push(lbl(R.x + R.w / 2, 290, 'OR', { anchor: 'middle', tone: 'textFaint' }));
      n.push(lbl(R.x + 12, 328, 'Start without data', { weight: 500 }));
      n.push(lbl(R.x + 12, 348, 'Add panels that do not require a query', { size: 'small', tone: 'textMuted', box: R.w - 24 }));
      ['Text', 'Alert list', 'Dashboard list'].forEach((t, i) => { n.push(box(R.x + 12 + (i % 2) * 124, 364 + Math.floor(i / 2) * 60, 116, 52, { fill: 'surfaceRaised', radius: 6 })); n.push(lbl(R.x + 12 + (i % 2) * 124 + 58, 364 + Math.floor(i / 2) * 60 + 31, t, { anchor: 'middle', box: 104 })); });
    } else {
      const cards = ['Time series', 'Stat', 'Gauge', 'Bar gauge'];
      cards.forEach((t, i) => {
        const cx = R.x + 12 + (i % 2) * 130, cyy = 204 + Math.floor(i / 2) * 120;
        n.push(box(cx, cyy, 122, 108, { fill: 'inputBg', stroke: 'border', radius: 6 }));
        if (i === 0) n.push({ block: 'line', x: cx + 4, y: cyy + 4, w: 114, h: 70, series: reqSeries, min: 0, max: 10, yLabels: ['', ''], legend: false });
        else n.push(lbl(cx + 61, cyy + 46, '...', { anchor: 'middle', tone: 'textFaint' }));
        n.push(lbl(cx + 61, cyy + 98, t, { size: 'small', anchor: 'middle', tone: 'textMuted', box: 112 }));
        if (i === 0) geo.timeSeries = { x: cx, y: cyy, w: 122, h: 108 };
      });
    }
  }
  n.push(...(typeof children === 'function' ? children(geo) : children));
  return { nodes: grafanaFrame({ h, crumbs, children: n }), geo };
}

// ================================================================ Kibana 9.5 (light)
// The Kibana window: dark first bar (Elastic logo, global search), white second bar (primary navigation button, space
// avatar, breadcrumb chips, page actions on the right). Page content starts at y = 96; the filter row sits at y = 104.
export function kibanaFrame({ h, crumbs, actions = [], children = [] }) {
  const inner = [
    { block: 'toolbar', x: 0, y: 0, w: FW, logo: 'si:elastic', product: 'elastic', crumbs: [], actions: [] },
    { block: 'field', x: 340, y: 8, w: 400, placeholder: 'Find apps, content, and more.' },
    box(0, 48, FW, 48, { fill: 'subHeaderBg', stroke: 'border' }),
    ico(16, 64, 'menu', 'text'),
    box(48, 58, 28, 28, { fill: 'threshold.green', radius: 4 }),
    lbl(62, 78, 'D', { weight: 600, anchor: 'middle', tone: 'textStrong' }),
  ];
  const geo = { menu: { x: 8, y: 56, w: 40, h: 32 } };
  let cx = 92;
  crumbs.forEach((c, i) => {
    const cw = Math.ceil(textWidth(c, 12)) + 18;
    inner.push({ block: 'chip', x: cx, y: 61, str: c, w: cw });
    cx += cw + 6;
  });
  let rx = FW - 16;
  [...actions].reverse().forEach((a) => {
    const act = typeof a === 'string' ? { label: a } : a;
    const w = act.w ?? Math.ceil(textWidth(act.label, 14, { weight: 500 })) + 28 + (act.icon ? 22 : 0);
    rx -= w;
    inner.push(btn(rx, 56, w, act.label, act.kind ?? 'secondary', act.icon));
    geo[act.label] = { x: rx, y: 56, w, h: 32 };
    rx -= 8;
  });
  return { nodes: [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [...inner, ...children] }], geo };
}

// The time and filter row: Add filter, query box, time picker, Refresh.
export function kFilterRow({ y = 104, dataView, query = 'Filter your data using KQL syntax', time = 'Last 15 minutes', x = 16 } = {}) {
  const n = [];
  const geo = {};
  let cx = x;
  if (dataView) { n.push({ block: 'dropdown', x: cx, y, w: 220, value: dataView }); geo.dataView = { x: cx, y, w: 220, h: 32 }; cx += 228; }
  n.push(btn(cx, y, 36, '+')); cx += 44;
  const qw = FW - 16 - cx - 8 - 150 - 8 - 100;
  n.push({ block: 'field', x: cx, y, w: qw, placeholder: query }); geo.query = { x: cx, y, w: qw, h: 32 }; cx += qw + 8;
  n.push(btn(cx, y, 150, time, 'secondary', 'clock')); geo.time = { x: cx, y, w: 150, h: 32 }; cx += 158;
  n.push(btn(cx, y, 100, 'Refresh', 'secondary', 'refresh')); geo.refresh = { x: cx, y, w: 100, h: 32 };
  return { nodes: n, geo };
}

// The Lens editor of 9.5: field list at the left, workspace in the middle, configuration panel at the right.
// `state`: 'empty' | 'search' (field list narrowed) | 'drag' (horizontal axis filled) | 'chart' (both axes filled) |
// 'flyout' (the dimension editor of the horizontal axis is open).
export function kLens({ h = 640, state = 'empty', startedFromDashboard = true, children = [] }) {
  const geo = {};
  const actions = [{ label: 'Explore in Discover', w: 176 }, { label: 'Inspect', w: 80 }, { label: 'Settings', w: 90 }, { label: startedFromDashboard ? 'Save and return' : 'Save', kind: 'primary', w: startedFromDashboard ? 150 : 96 }];
  const fr = kibanaFrame({ h, crumbs: ['Dashboards', 'Visualizations', 'Create'], actions });
  Object.assign(geo, fr.geo);
  geo.save = fr.geo['Save and return'] ?? fr.geo.Save;
  const n = [];
  const row = kFilterRow({ dataView: 'Bookshelf logs (guides)' });
  n.push(...row.nodes);
  geo.dataView = row.geo.dataView; geo.time = row.geo.time;
  // field list
  const LX = 16, LW = 284;
  n.push({ block: 'field', x: LX, y: 152, w: LW, placeholder: 'Search field names', ...(state === 'search' || state === 'drag' || state === 'chart' || state === 'flyout' ? { value: 'status' } : {}) });
  geo.search = { x: LX, y: 152, w: LW, h: 32 };
  n.push(lbl(LX + 4, 214, 'Records', { weight: 500 }));
  geo.records = { x: LX, y: 198, w: LW, h: 28 };
  n.push(lbl(LX + 4, 250, 'Available fields', { weight: 600, box: LW }));
  const narrowed = state !== 'empty';
  const fields = narrowed ? ['attributes.status'] : ['@timestamp', 'attributes.status', 'attributes.uri', 'body.text', 'severity_text'];
  fields.forEach((f, i) => {
    n.push(box(LX, 262 + i * 32, LW, 30, { fill: 'surface', stroke: 'border', radius: 4 }));
    n.push(lbl(LX + 34, 282 + i * 32, f, { box: LW - 44 }));
    n.push(lbl(LX + 14, 282 + i * 32, f === '@timestamp' ? 'D' : f === 'attributes.status' ? '#' : 't', { size: 'small', tone: 'textMuted', weight: 600 }));
    if (f === 'attributes.status') geo.statusField = { x: LX, y: 262 + i * 32, w: LW, h: 30 };
  });
  // workspace
  const WX = 316, WW = 444;
  n.push(box(WX, 152, WW, 480, { fill: 'surface', stroke: 'border', radius: 6 }));
  geo.workspace = { x: WX, y: 152, w: WW, h: 480 };
  if (state === 'chart') {
    n.push({ block: 'bar', x: WX + 12, y: 168, w: WW - 24, h: 440, categories: ['200', '404'], series: [{ name: 'Count of records', values: [412, 38] }], max: 500 });
  } else {
    n.push(lbl(WX + WW / 2, 360, 'Drop some fields here to start', { weight: 500, anchor: 'middle', box: WW - 24 }));
    n.push(lbl(WX + WW / 2, 386, 'Lens is the recommended editor for creating visualizations', { size: 'small', tone: 'textMuted', anchor: 'middle', box: WW - 16 }));
  }
  // configuration panel
  const CX = 776, CW = 288;
  n.push(box(CX, 152, CW, 480, { fill: 'surface', stroke: 'border', radius: 6 }));
  geo.config = { x: CX, y: 152, w: CW, h: 480 };
  if (state === 'flyout') {
    n.push({ block: 'flyout', x: CX, y: 152, w: CW, h: 480, title: 'Horizontal axis' });
    n.push(lbl(CX + 16, 216, 'Function', { size: 'small', weight: 500 }));
    ['Top values', 'Intervals', 'Filters'].forEach((t, i) => {
      n.push(box(CX + 16, 226 + i * 38, CW - 32, 32, { fill: i === 0 ? 'navActiveBg' : 'surface', stroke: i === 0 ? 'primary' : 'border', radius: 4 }));
      n.push(lbl(CX + 28, 247 + i * 38, t, { weight: i === 0 ? 500 : 400, box: CW - 56 }));
      if (i === 0) geo.topValues = { x: CX + 16, y: 226, w: CW - 32, h: 32 };
    });
    n.push({ block: 'field', x: CX + 16, y: 360, w: CW - 32, label: 'Field', value: 'attributes.status' });
    n.push(btn(CX + 16, 590, 96, 'Close'));
  } else {
    ['Legend', 'Style', 'Add layer'].forEach((t, i) => n.push(btn(CX + 12 + i * 88, 160, 82, t)));
    n.push(box(CX + 12, 204, CW - 24, 412, { fill: 'canvas', stroke: 'border', radius: 6 }));
    n.push(btn(CX + 24, 214, 100, 'Bar', 'secondary', 'chevronDown'), btn(CX + 132, 214, 124, 'Stacked', 'secondary', 'chevronDown'));
    n.push(lbl(CX + 24, 276, 'Bookshelf logs (guides)', { size: 'small', tone: 'textMuted', box: CW - 48 }));
    const zone = (y, label, text, filled) => {
      n.push(lbl(CX + 24, y, label, { weight: 500, box: CW - 48 }));
      n.push(box(CX + 24, y + 10, CW - 48, 36, { fill: filled ? 'surface' : 'canvas', stroke: filled ? 'borderStrong' : 'borderStrong', radius: 4, dash: filled ? undefined : '5 3' }));
      n.push(lbl(CX + 36, y + 33, text, { size: 'small', tone: filled ? 'text' : 'textMuted', box: CW - 72 }));
      return { x: CX + 24, y: y + 10, w: CW - 48, h: 36 };
    };
    const hx = state === 'drag' || state === 'chart' ? 'attributes.status' : 'Add or drag-and-drop a field';
    const vy = state === 'chart' ? 'Count of records' : 'Add or drag-and-drop a field';
    geo.horizontal = zone(306, 'Horizontal axis', hx, state === 'drag' || state === 'chart');
    geo.vertical = zone(376, 'Vertical axis', vy, state === 'chart');
    geo.breakdown = zone(446, 'Breakdown', 'Add or drag-and-drop a field', false);
  }
  n.push(...(typeof children === 'function' ? children(geo) : children));
  fr.nodes[0].children.push(...n);
  return { nodes: fr.nodes, geo };
}

export const kBars = (x, y, w, h) => ({ block: 'bar', x, y, w, h, categories: ['200', '404'], series: [{ name: 'Count of records', values: [412, 38] }], max: 500 });

// A Kibana dashboard. `mode`: 'empty' (create, nothing on it), 'edit' (one panel), 'view' (one panel), 'add' (edit with
// the Add to dashboard flyout open). `title` is the saved name (undefined for a new dashboard).
export function kDash({ h = 520, mode = 'edit', title, children = [] }) {
  const name = title ?? 'New Dashboard';
  const view = mode === 'view';
  const crumbs = view ? ['Dashboards', name] : ['Dashboards', `Editing ${name}`];
  const actions = view
    ? [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }]
    : [{ label: 'Exit edit', w: 100 }, { label: 'Add', w: 84, icon: 'plus' }, { label: 'More', w: 80 }, { label: 'Save', kind: 'primary', w: 80 }];
  const fr = kibanaFrame({ h, crumbs, actions });
  const row = kFilterRow({});
  const n = [...row.nodes];
  const geo = { ...fr.geo, time: row.geo.time, query: row.geo.query };
  if (mode === 'empty') {
    n.push(box(16, 152, 740, h - 168, { fill: 'surface', stroke: 'border', radius: 6 }));
    n.push(lbl(386, 214, "This dashboard is empty. Let's fill it up!", { size: 'title', weight: 600, anchor: 'middle', box: 480 }));
    [['Create visualization', 'Build charts, metrics, and tables with a point-and-click editor.'], ['Create visualization (query)', 'Build charts, metrics, and tables with ES|QL.']].forEach(([t, d], i) => {
      const cx = 40 + i * 350;
      n.push(box(cx, 250, 330, 120, { fill: 'surface', stroke: 'borderStrong', radius: 6 }));
      n.push(lbl(cx + 16, 284, t, { weight: 600, box: 300 }));
      n.push(lbl(cx + 16, 310, d.slice(0, 40), { size: 'small', tone: 'textMuted', box: 300 }));
      n.push(lbl(cx + 16, 328, d.slice(40), { size: 'small', tone: 'textMuted', box: 300 }));
      if (i === 0) geo.createViz = { x: cx, y: 250, w: 330, h: 120 };
    });
  } else {
    n.push({ block: 'panel', x: 16, y: 152, w: 520, h: 330 });
    n.push(kBars(24, 164, 504, 312));
    geo.panel = { x: 16, y: 152, w: 520, h: 330 };
  }
  if (mode === 'add') {
    n.push({ block: 'flyout', x: 704, y: 96, w: 360, h: h - 96, title: 'Add to dashboard' });
    n.push({ block: 'tabs', x: 712, y: 150, w: 300, tabs: ['New', 'From library'], active: 0 });
    n.push({ block: 'field', x: 720, y: 196, w: 328, placeholder: 'Search' });
    n.push(lbl(720, 262, 'Visualization', { weight: 600 }));
    n.push(lbl(720, 282, 'Build charts, metrics, and tables with', { size: 'small', tone: 'textMuted', box: 328 }));
    n.push(lbl(720, 298, 'a point-and-click editor.', { size: 'small', tone: 'textMuted', box: 328 }));
    n.push(lbl(720, 330, 'Visualization (query)', { weight: 600 }));
    n.push(lbl(720, 350, 'Build charts, metrics, and tables with ES|QL.', { size: 'small', tone: 'textMuted', box: 328 }));
    n.push(lbl(720, 392, 'Other visualizations', { weight: 600 }));
    n.push(lbl(720, 414, 'Discover session, Maps, Alerts, Vega', { size: 'small', tone: 'textMuted', box: 328 }));
    n.push(lbl(720, 452, 'Controls', { weight: 600 }));
    n.push(lbl(720, 474, 'Control, Variable control, Time slider', { size: 'small', tone: 'textMuted', box: 328 }));
    geo.flyout = { x: 704, y: 96, w: 360, h: h - 96 };
    geo.addViz = { x: 712, y: 246, w: 344, h: 62 };
  }
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children));
  return { nodes: fr.nodes, geo };
}
