// Figures of the Kibana guide K11, "Arrange and connect a dashboard" (guide-arrange-and-connect-a-dashboard.adoc).
// Facts: guides-brief/kibana-facts.md sections 1, 2 and 5 (Kibana 9.5.6). Verified there: the dashboard second bar in view and
// edit mode, the More menu of a dashboard (Duplicate, Reset changes, Background searches, Full screen) and the Add to
// dashboard flyout with its groups Controls (Control, Variable control, Time slider) and Annotations and Navigation
// (Collapsible section, Markdown text, Image, Links). NOT VERIFIED there (drawn generically, with the words of the Elastic
// pages "Add controls to dashboards", "Create a dashboard drilldown" and "Create a URL drilldown" that the reference pages of
// this site quote): the section title editing, the control flyout, the Markdown and Links editors, the panel menu, the drilldown
// flyouts and the panel Settings flyout. Callout numbers are the step numbers of the page; a figure shows the screen as the step
// starts, with the control to act on highlighted.
import { FW, lbl, box, btn, ico, mark, marks, menu, segmented, kibanaFrame, kFilterRow, kBars } from '../lib/shells.mjs';

const figures = [];
const H = 560;

// ---------------------------------------------------------------- sample series (the lab's request mix)
const wob = [0.6, -0.4, 0.3, -0.2, 0.5, -0.5, 0.2, -0.3, 0.4, -0.1, 0.3, -0.4];
const sample = (base) => base.map((v, i) => Math.round((v + wob[i % wob.length]) * 10) / 10);
const LINES = [
  { name: '200', points: sample([8.2, 8.6, 8.1, 8.9, 8.4, 8.8, 8.3, 8.7, 8.5, 8.4, 8.9, 8.2]) },
  { name: '404', points: sample([1.1, 1.4, 1.0, 1.3, 1.2, 1.5, 1.1, 1.3, 1.2, 1.4, 1.0, 1.3]) },
];
const X = ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'];
const lineChart = (x, y, w, h) => ({ block: 'line', x, y, w, h, series: LINES, min: 0, max: 12, yLabels: ['0', '3', '6', '9', '12'], xLabels: X });

// A panel with a title, its chart and, in edit mode, the move control and the panel menu at the right of the header.
function barPanel(x, y, w, h, { edit = false, title = 'Records by status' } = {}) {
  const n = [{ block: 'panel', x, y, w, h, title }, { block: 'bar', x: x + 8, y: y + 34, w: w - 16, h: h - 42, categories: ['200', '404'], series: [{ name: 'Count of records', values: [412, 38] }], max: 500, legend: false }];
  const geo = { dots: { x: x + w - 34, y: y + 6, w: 26, h: 26 }, move: { x: x + w - 66, y: y + 6, w: 26, h: 26 }, corner: { x: x + w - 20, y: y + h - 20, w: 18, h: 18 } };
  if (edit) n.push(ico(x + w - 61, y + 11, 'menu', 'textMuted'), ico(x + w - 29, y + 11, 'dots', 'textMuted'));
  return { nodes: n, geo };
}
function linePanel(x, y, w, h, { edit = false, title = 'Requests over time' } = {}) {
  const n = [{ block: 'panel', x, y, w, h, title }, lineChart(x + 8, y + 34, w - 16, h - 42)];
  const geo = { dots: { x: x + w - 34, y: y + 6, w: 26, h: 26 }, move: { x: x + w - 66, y: y + 6, w: 26, h: 26 }, corner: { x: x + w - 20, y: y + h - 20, w: 18, h: 18 } };
  if (edit) n.push(ico(x + w - 61, y + 11, 'menu', 'textMuted'), ico(x + w - 29, y + 11, 'dots', 'textMuted'));
  return { nodes: n, geo };
}
const grip = (x, y) => box(x, y, 12, 12, { fill: 'primary', radius: 2 });

// The dashboard window: second bar of the view or edit mode and the filter row. `body` gets the geo of the bar.
function dash({ mode = 'edit', h = H, body, children }) {
  const view = mode === 'view';
  const actions = view
    ? [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }]
    : [{ label: 'Exit edit', w: 100 }, { label: 'Add', w: 84, icon: 'plus' }, { label: 'More', w: 80 }, { label: 'Save', kind: 'primary', w: 80 }];
  const fr = kibanaFrame({ h, crumbs: view ? ['Dashboards', 'Bookshelf (guides)'] : ['Dashboards', 'Editing Bookshelf (guides)'], actions });
  const geo = { ...fr.geo };
  const n = [...kFilterRow({}).nodes];
  const g = { geo, n };
  if (body) body(g);
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo, g) : children ?? []));
  return { nodes: fr.nodes, geo };
}

// The Add to dashboard flyout scrolled to the groups Controls and Annotations and Navigation (labels of the facts brief).
function addFlyout({ hot = -1 } = {}) {
  const n = [{ block: 'flyout', x: 704, y: 96, w: 360, h: H - 96, title: 'Add to dashboard' }];
  n.push({ block: 'tabs', x: 712, y: 150, w: 300, tabs: ['New', 'From library'], active: 0 });
  n.push({ block: 'field', x: 720, y: 196, w: 328, placeholder: 'Search' });
  const rows = {};
  const group = (y, title, items) => {
    n.push(lbl(720, y, title, { weight: 600, box: 328 }));
    items.forEach((it, i) => {
      const iy = y + 10 + i * 30;
      if (hot === it) n.push(box(716, iy, 336, 28, { fill: 'navActiveBg', radius: 4 }));
      n.push(lbl(728, iy + 19, it, { weight: hot === it ? 500 : 400, box: 300 }));
      rows[it] = { x: 716, y: iy, w: 336, h: 28 };
    });
  };
  group(262, 'Controls', ['Control', 'Variable control', 'Time slider']);
  group(396, 'Annotations and Navigation', ['Collapsible section', 'Markdown text', 'Image', 'Links']);
  return { nodes: n, rows };
}

// The time slider row: play, a track with the selected window, the two end labels.
function timeSlider(x, y, w) {
  const n = [box(x, y, w, 40, { fill: 'surface', stroke: 'border', radius: 6 }), ico(x + 12, y + 12, 'play', 'textMuted')];
  n.push(lbl(x + 44, y + 25, '10:00', { size: 'small', tone: 'textMuted', box: 50 }));
  n.push(box(x + 100, y + 18, w - 200, 4, { fill: 'border', radius: 2 }));
  const wx = x + 100 + (w - 200) * 0.35, ww = (w - 200) * 0.3;
  n.push(box(wx, y + 15, ww, 10, { fill: 'navActiveBg', stroke: 'primary', radius: 3 }));
  n.push(lbl(x + w - 52, y + 25, '10:25', { size: 'small', tone: 'textMuted', box: 50 }));
  return { nodes: n, box: { x: wx - 4, y: y + 8, w: ww + 8, h: 24 } };
}

// 01: the dashboard; Edit (steps 1 and 2)
{
  const d = dash({ mode: 'view', body: ({ n }) => { n.push(...barPanel(16, 152, 510, 330).nodes, ...linePanel(542, 152, 522, 330).nodes); }, children: (g) => mark(g.Edit, 2) });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Kibana dashboard Bookshelf (guides) in view mode with a bar chart panel Records by status and a line chart panel Requests over time; the Edit button of the second bar is marked by callout 2',
    width: FW, height: 500, nodes: d.nodes,
  });
}

// 02: resize and move (steps 3 and 4)
{
  const a = barPanel(16, 152, 510, 330, { edit: true });
  const b = linePanel(542, 152, 522, 330, { edit: true });
  const d = dash({ mode: 'edit', h: 500, body: ({ n }) => { n.push(...a.nodes, ...b.nodes, grip(a.geo.corner.x + 3, a.geo.corner.y + 3)); }, children: () => marks([[a.geo.corner, 3], [b.geo.move, 4]]) });
  figures.push({
    id: '02-resize-and-move',
    alt: 'Kibana dashboard in edit mode with two panels: the resize handle at the bottom right corner of the bar chart panel is marked by callout 3 and the move control in the header of the line chart panel by callout 4',
    width: FW, height: 500, nodes: d.nodes,
  });
}

// 03: the Add flyout; Collapsible section (steps 5 and 6)
{
  const f = addFlyout({ hot: 'Collapsible section' });
  const d = dash({ mode: 'edit', body: ({ n }) => { n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes); n.push(...f.nodes); }, children: (g) => marks([[g.Add, 5], [f.rows['Collapsible section'], 6]]) });
  figures.push({
    id: '03-add-collapsible-section',
    alt: 'Dashboard in edit mode with the Add to dashboard flyout open and scrolled to the groups Controls and Annotations and Navigation: the Add button of the second bar is marked by callout 5 and the entry Collapsible section by callout 6',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 04: the section with the two charts inside (steps 7 and 8)
{
  const sx = 16, sw = 1048;
  const a = barPanel(sx, 204, 510, 300, { edit: true });
  const b = linePanel(sx + 526, 204, 522, 300, { edit: true });
  const title = { x: 44, y: 158, w: 110, h: 24 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(box(sx, 152, sw, 40, { fill: 'surface', stroke: 'border', radius: 6 }), ico(sx + 12, 164, 'chevronDown', 'textMuted'), lbl(48, 177, 'Requests', { weight: 600, box: 100 }), ico(sx + sw - 32, 164, 'dots', 'textMuted'));
      n.push(...a.nodes, ...b.nodes);
    },
    children: () => marks([[title, 7], [b.geo.move, 8]]),
  });
  figures.push({
    id: '04-section-with-panels',
    alt: 'Dashboard in edit mode with an expanded collapsible section titled Requests above the two chart panels; the section title is marked by callout 7 and the move control of a chart panel, which is dragged into the section, by callout 8',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 05: the Controls group; Control (steps 9 and 10)
{
  const f = addFlyout({ hot: 'Control' });
  const d = dash({ mode: 'edit', body: ({ n }) => { n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes); n.push(...f.nodes); }, children: (g) => marks([[g.Add, 9], [f.rows.Control, 10]]) });
  figures.push({
    id: '05-add-control',
    alt: 'Dashboard in edit mode with the Add to dashboard flyout open at its Controls group: the Add button of the second bar is marked by callout 9 and the entry Control, above Variable control and Time slider, by callout 10',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 06: the control flyout, options list (steps 11 to 14)
{
  const ix = 720, iw = 328;
  const seg = segmented({ x: ix, y: 316, items: ['Options list', 'Range slider'], w: 164, active: 0 });
  const geoField = { x: ix, y: 242, w: iw, h: 32 }, geoType = { x: ix, y: 316, w: 328, h: 32 }, geoLabel = { x: ix, y: 400, w: iw, h: 32 }, geoSave = { x: 1064 - 16 - 80, y: 508, w: 80, h: 32 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes);
      n.push({ block: 'flyout', x: 704, y: 96, w: 360, h: H - 96, title: 'Create control' });
      n.push({ block: 'field', x: ix, y: 150, w: iw, label: 'Data view', value: 'Bookshelf logs (guides)' });
      n.push({ block: 'dropdown', x: ix, y: 222, w: iw, label: 'Field', value: 'severity_text' });
      n.push(lbl(ix, 306, 'Control type', { size: 'small', weight: 500, box: iw }), ...seg.nodes);
      n.push({ block: 'field', x: ix, y: 380, w: iw, label: 'Label', value: 'Severity' });
      n.push(btn(1064 - 16 - 80 - 8 - 84, 508, 84, 'Cancel'), btn(geoSave.x, geoSave.y, 80, 'Save', 'primary'));
    },
    children: () => marks([[geoField, 11], [geoType, 12], [geoLabel, 13], [geoSave, 14]]),
  });
  figures.push({
    id: '06-options-list-control',
    alt: 'The control flyout over the dashboard with the data view Bookshelf logs (guides), the field severity_text (callout 11), the control type Options list (callout 12) and the label Severity (callout 13); the Save button is marked by callout 14',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 07: the controls on the dashboard; pick ERROR and move the time slider (steps 17 and 18)
{
  const ts = timeSlider(16, 272, 1048);
  const m = menu({ x: 16, y: 190, w: 220, items: ['INFO', 'ERROR'], hot: 1 });
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push({ block: 'dropdown', x: 16, y: 152, w: 220, value: 'Severity', open: false });
      n.push(box(248, 152, 300, 32, { fill: 'surface', stroke: 'borderStrong', radius: 4 }), lbl(260, 173, 'Status code', { box: 110 }), box(380, 167, 120, 3, { fill: 'border' }), box(392, 162, 12, 12, { fill: 'primary', radius: 6 }), box(476, 162, 12, 12, { fill: 'primary', radius: 6 }));
      n.push(...ts.nodes);
      n.push(...barPanel(16, 324, 510, 226, { edit: true }).nodes, ...linePanel(542, 324, 522, 226, { edit: true }).nodes);
      n.push(...m.nodes);
    },
    children: () => marks([[m.rows[1], 17], [ts.box, 18]]),
  });
  figures.push({
    id: '07-controls-on-dashboard',
    alt: 'Dashboard in edit mode with three controls above the panels, Severity with its list open, Status code and a time slider: the entry ERROR of the Severity list is marked by callout 17 and the selected window of the time slider by callout 18',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 08: the Markdown panel (steps 20 and 21)
{
  const ix = 720, iw = 328;
  const ed = { x: ix, y: 160, w: iw, h: 110 };
  const geoSave = { x: 1064 - 16 - 80, y: 508, w: 80, h: 32 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes);
      n.push({ block: 'flyout', x: 704, y: 96, w: 360, h: H - 96, title: 'Markdown text' });
      n.push({ block: 'queryEditor', x: ed.x, y: ed.y, w: ed.w, h: ed.h, lines: ['## Bookshelf service', 'Request counts and errors', 'of the lab Bookshelf service.'], lineNumbers: false });
      n.push(lbl(ix, 306, 'Preview', { size: 'small', weight: 500, box: iw }), box(ix, 316, iw, 110, { fill: 'surface', stroke: 'border', radius: 4 }));
      n.push(lbl(ix + 12, 350, 'Bookshelf service', { size: 'title', weight: 600, box: iw - 24 }), lbl(ix + 12, 378, 'Request counts and errors', { size: 'small', box: iw - 24 }), lbl(ix + 12, 396, 'of the lab Bookshelf service.', { size: 'small', box: iw - 24 }));
      n.push(btn(1064 - 16 - 80 - 8 - 84, 508, 84, 'Cancel'), btn(geoSave.x, geoSave.y, 80, 'Save', 'primary'));
    },
    children: () => marks([[ed, 20], [geoSave, 21]]),
  });
  figures.push({
    id: '08-markdown-panel',
    alt: 'The Markdown text editor over the dashboard with the text of a heading and two lines in the editor (callout 20), a rendered preview under it, and the confirming button at the bottom marked by callout 21',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 09: the Links panel (steps 23 to 25)
{
  const ix = 720, iw = 328;
  const addLink = { x: ix, y: 160, w: 110, h: 32 };
  const list = { x: ix, y: 214, w: iw, h: 100 };
  const geoSave = { x: 1064 - 16 - 80, y: 508, w: 80, h: 32 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes);
      n.push({ block: 'flyout', x: 704, y: 96, w: 360, h: H - 96, title: 'Links' });
      n.push(btn(addLink.x, addLink.y, 110, 'Add link', 'secondary', 'plus'));
      n.push(box(list.x, list.y, list.w, list.h, { fill: 'canvas', stroke: 'borderStrong', radius: 4, dash: '5 3' }));
      n.push(lbl(ix + iw / 2, 270, 'No links yet', { tone: 'textMuted', anchor: 'middle', box: iw - 24 }));
      n.push(btn(1064 - 16 - 80 - 8 - 84, 508, 84, 'Cancel'), btn(geoSave.x, geoSave.y, 80, 'Save', 'primary'));
    },
    children: () => marks([[addLink, 23], [list, 24], [geoSave, 25]]),
  });
  figures.push({
    id: '09-links-panel',
    alt: 'The Links editor over the dashboard with the Add link button marked by callout 23, the empty list where the second link appears marked by callout 24, and the confirming button at the bottom marked by callout 25',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 10: More menu; Duplicate (steps 28 and 29)
{
  const m = menu({ x: 1064 - 220, y: 92, w: 220, items: ['Duplicate', 'Reset changes', 'Background searches', 'Full screen'], hot: 0 });
  const d = dash({ mode: 'view', h: 400, body: ({ n }) => { n.push(...barPanel(16, 152, 510, 230).nodes, ...linePanel(542, 152, 522, 230).nodes); n.push(...m.nodes); }, children: (g) => marks([[g.More, 28], [m.rows[0], 29]]) });
  figures.push({
    id: '10-duplicate-dashboard',
    alt: 'Dashboard Bookshelf (guides) in view mode with the More menu open: the More button of the second bar is marked by callout 28 and the entry Duplicate, above Reset changes, Background searches and Full screen, by callout 29',
    width: FW, height: 400, nodes: d.nodes,
  });
}

// 11: panel menu; Create drilldown (steps 33 and 34)
{
  const a = barPanel(16, 152, 510, 330, { edit: true });
  const m = menu({ x: 330, y: 184, w: 200, items: ['Settings', 'Explore in Discover', 'Create drilldown', 'Manage drilldowns'], hot: 2 });
  const d = dash({ mode: 'edit', h: 500, body: ({ n }) => { n.push(...a.nodes, ...linePanel(542, 152, 522, 330, { edit: true }).nodes, ...m.nodes); }, children: () => marks([[a.geo.dots, 33], [m.rows[2], 34]]) });
  figures.push({
    id: '11-create-drilldown-menu',
    alt: 'Dashboard in edit mode with the panel menu of the bar chart open: the menu button in the panel header is marked by callout 33 and the entry Create drilldown, between Explore in Discover and Manage drilldowns, by callout 34',
    width: FW, height: 500, nodes: d.nodes,
  });
}

// A drilldown flyout (right docked, wide enough for a URL template).
const FX = 584, FWD = 480, FIX = FX + 16, FIW = FWD - 32;
const drillFrame = (title) => [{ block: 'flyout', x: FX, y: 96, w: FWD, h: H - 96, title }];

// 12: the dashboard drilldown (steps 35 to 39)
{
  const optBox = { x: FIX - 4, y: 352, w: FIW + 8, h: 56 };
  const geoCreate = { x: FX + FWD - 16 - 160, y: 508, w: 160, h: 32 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes);
      n.push(...drillFrame('Create drilldown'));
      n.push({ block: 'dropdown', x: FIX, y: 158, w: FIW, value: 'Go to dashboard' });
      n.push({ block: 'field', x: FIX, y: 206, w: FIW, label: 'Name', value: 'Details by status' });
      n.push({ block: 'dropdown', x: FIX, y: 278, w: FIW, label: 'Choose destination dashboard', value: 'Bookshelf details (guides)' });
      n.push({ block: 'checkbox', x: FIX, y: 358, label: 'Use filters and query from origin dashboard', checked: true, box: FIW - 30 });
      n.push({ block: 'checkbox', x: FIX, y: 388, label: 'Use date range from origin dashboard', checked: true, box: FIW - 30 });
      n.push(btn(FX + FWD - 16 - 160 - 8 - 84, 508, 84, 'Cancel'), btn(geoCreate.x, geoCreate.y, 160, 'Create drilldown', 'primary'));
    },
    children: () => marks([[{ x: FIX, y: 158, w: FIW, h: 32 }, 35], [{ x: FIX, y: 226, w: FIW, h: 32 }, 36], [{ x: FIX, y: 298, w: FIW, h: 32 }, 37], [optBox, 38], [geoCreate, 39]]),
  });
  figures.push({
    id: '12-dashboard-drilldown',
    alt: 'The Create drilldown flyout with the action Go to dashboard (callout 35), the name Details by status (callout 36), the destination dashboard Bookshelf details (guides) (callout 37), two ticked options that carry the filters, the query and the date range (callout 38) and the Create drilldown button (callout 39)',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 13: the URL drilldown (steps 41 to 44)
{
  const geoCreate = { x: FX + FWD - 16 - 160, y: 508, w: 160, h: 32 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes);
      n.push(...drillFrame('Create drilldown'));
      n.push({ block: 'dropdown', x: FIX, y: 158, w: FIW, value: 'Go to URL' });
      n.push({ block: 'field', x: FIX, y: 206, w: FIW, label: 'Name', value: 'Webhook receiver' });
      n.push({ block: 'field', x: FIX, y: 278, w: FIW, label: 'Enter URL', value: 'http://localhost:8081/?status={{event.value}}', mono: true });
      n.push(ico(FIX, 358, 'chevronDown', 'textMuted'), lbl(FIX + 24, 371, 'Additional options', { weight: 500, box: 200 }));
      n.push({ block: 'toggle', x: FIX + 24, y: 392, label: 'Open URL in new tab', on: true, box: 240 });
      n.push({ block: 'toggle', x: FIX + 24, y: 422, label: 'Encode URL', on: true, box: 240 });
      n.push(btn(FX + FWD - 16 - 160 - 8 - 84, 508, 84, 'Cancel'), btn(geoCreate.x, geoCreate.y, 160, 'Create drilldown', 'primary'));
    },
    children: () => marks([[{ x: FIX, y: 158, w: FIW, h: 32 }, 41], [{ x: FIX, y: 226, w: FIW, h: 32 }, 42], [{ x: FIX, y: 298, w: FIW, h: 32 }, 43], [geoCreate, 44]]),
  });
  figures.push({
    id: '13-url-drilldown',
    alt: 'The Create drilldown flyout with the action Go to URL (callout 41), the name Webhook receiver (callout 42), the URL template http://localhost:8081/?status= followed by the variable event.value in double braces (callout 43), the Additional options with Open URL in new tab and Encode URL turned on, and the Create drilldown button (callout 44)',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 14: the panel settings (steps 46 to 48)
{
  const ix = 720, iw = 328;
  const geoSave = { x: 1064 - 16 - 80, y: 508, w: 80, h: 32 };
  const gt = { x: ix, y: 170, w: iw, h: 32 }, gd = { x: ix, y: 240, w: iw, h: 32 };
  const d = dash({
    mode: 'edit',
    body: ({ n }) => {
      n.push(...barPanel(16, 152, 510, 330, { edit: true }).nodes);
      n.push({ block: 'flyout', x: 704, y: 96, w: 360, h: H - 96, title: 'Settings' });
      n.push({ block: 'field', x: ix, y: 150, w: iw, label: 'Title', value: 'Records by status' });
      n.push({ block: 'field', x: ix, y: 220, w: iw, label: 'Description', value: 'Log records per HTTP status.' });
      n.push(btn(1064 - 16 - 80 - 8 - 84, 508, 84, 'Cancel'), btn(geoSave.x, geoSave.y, 80, 'Apply', 'primary'));
    },
    children: () => marks([[gt, 46], [gd, 47], [geoSave, 48]]),
  });
  figures.push({
    id: '14-panel-settings',
    alt: 'The panel Settings flyout over the dashboard with the custom title Records by status (callout 46), the description Log records per HTTP status. (callout 47) and the Apply button at the bottom marked by callout 48',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 15: the finished dashboard (What you build)
{
  const ts = timeSlider(16, 196, 1048);
  const d = dash({
    mode: 'view', h: 700,
    body: ({ n }) => {
      n.push({ block: 'dropdown', x: 16, y: 152, w: 220, value: 'Severity' });
      n.push(box(248, 152, 300, 32, { fill: 'surface', stroke: 'borderStrong', radius: 4 }), lbl(260, 173, 'Status code', { box: 110 }), box(380, 167, 120, 3, { fill: 'border' }), box(392, 162, 12, 12, { fill: 'primary', radius: 6 }), box(476, 162, 12, 12, { fill: 'primary', radius: 6 }));
      n.push(...ts.nodes);
      // Markdown panel and Links panel
      n.push({ block: 'panel', x: 16, y: 248, w: 640, h: 96 }, lbl(32, 282, 'Bookshelf service', { size: 'title', weight: 600, box: 300 }), lbl(32, 308, 'Request counts and errors of the lab Bookshelf service.', { size: 'small', tone: 'textMuted', box: 600 }));
      n.push({ block: 'panel', x: 672, y: 248, w: 392, h: 96 }, lbl(688, 282, 'Webhook receiver', { tone: 'link', box: 300 }), lbl(688, 308, '[Logs] Web Traffic', { tone: 'link', box: 300 }));
      // section Requests
      n.push(box(16, 356, 1048, 40, { fill: 'surface', stroke: 'border', radius: 6 }), ico(28, 368, 'chevronDown', 'textMuted'), lbl(48, 381, 'Requests', { weight: 600, box: 100 }));
      n.push(...barPanel(16, 408, 510, 276, { title: 'Records by status' }).nodes, ...linePanel(542, 408, 522, 276).nodes);
    },
  });
  figures.push({
    id: '15-result',
    alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode: the controls Severity and Status code and a time slider on top, a Markdown panel and a Links panel, and an expanded section Requests with the bar chart Records by status and the line chart Requests over time',
    width: FW, height: 700, nodes: d.nodes,
  });
}

void kBars;
export default { product: 'kibana', guide: 'k11', figures };
