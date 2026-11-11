// Figures of the Grafana guide G14, "Rows, tabs, layouts, annotations and links" (guide-layout-annotations-and-links.adoc).
// Facts: guides-brief/grafana-facts.md section 6 (dashboard edit mode, Add pane, Panel pane, Group panels), section 9 (the
// Dashboard pane of the Options sidebar: Layout, Filters, Variables, Annotations, Links; Share and settings tabs).
// NOT VERIFIED in the lab (drawn generically, see the report): the row and tab headers after Add row / Add tab, the Panel
// pane of a row, the contents of Show / hide rules, the Annotation query and Link forms, the manual annotation popover,
// the Panel links form. Callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, segmented, grafanaFrame, G_NAV_ROW, gDashToolbar, gAddPane, gEditor, reqChart,
} from '../lib/shells.mjs';

const T = 'Requests per second by status';
const CR = ['Dashboards', 'Guides', 'Bookshelf (guides)'];
const ADD_X = 792; // ix of the Add pane (x 780 + 12)

// Panels of the canvas (left of the right sidebar, which starts at x 780).
const P1 = (y = 106, h = 300) => [{ block: 'panel', x: 16, y, w: 352, h, title: T }, reqChart(24, y + 26, 336, h - 30)];
const P2 = (y = 106, h = 300) => [{ block: 'panel', x: 376, y, w: 344, h, title: 'New panel' }, btn(440, y + 90, 216, 'Configure visualization', 'primary'), btn(440, y + 136, 216, 'Use saved query'), btn(440, y + 182, 216, 'Use library panel')];
const rowHeader = (y, title) => [box(16, y, 704, 34, { fill: 'surface', stroke: 'border', radius: 4 }), ico(28, y + 9, 'chevronDown'), lbl(52, y + 22, title, { weight: 500, box: 300 })];

// The icon strip of the right sidebar (Add, Options, Code, Outline, Hide) and the Dashboard pane of the Options icon.
const STRIP = ['plus', 'gear', 'menu', 'apps', 'close'];
const strip = (x = 1030, y = 100) => STRIP.map((n, i) => [box(x, y + i * 40, 40, 32, { fill: i === 1 ? 'navActiveBg' : 'surface', stroke: 'border', radius: 6 }), ico(x + 12, y + i * 40 + 8, n)]).flat();
const OPT_ICON = { x: 1030, y: 140, w: 40, h: 32 };
const PX = 736, PW = 284, IX = PX + 12, IW = PW - 24;
const collapsible = (x, y, w, label, open = false) => [ico(x + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(x + 32, y + 21, label, { weight: 500, box: w - 48 }), rule(x, y + 32, w)];

// The Dashboard pane with the Layout controls (auto layout shown).
function dashPane({ layoutActive = 1, maxCols = '3' }) {
  const seg = segmented({ x: IX, y: 344, items: ['Custom', 'Auto'], w: 80, active: layoutActive });
  const nodes = [
    { block: 'sidePanel', x: PX, y: 100, w: PW, h: 440, title: 'Dashboard' },
    btn(IX, 134, IW, 'View all settings'),
    { block: 'field', x: IX, y: 176, w: IW, label: 'Title', value: 'Bookshelf (guides)' },
    { block: 'field', x: IX, y: 238, w: IW, label: 'Description', placeholder: '' },
    lbl(IX, 332, 'Layout', { weight: 500, box: 120 }), ...seg.nodes,
    { block: 'field', x: IX, y: 384, w: IW, label: 'Min column width', placeholder: '' },
    { block: 'field', x: IX, y: 444, w: IW, label: 'Max columns', value: maxCols },
    { block: 'toggle', x: IX, y: 506, label: 'Fill screen', on: false, box: 160 },
  ];
  return { nodes, geo: { custom: seg.boxes[0], auto: seg.boxes[1], maxCols: { x: IX, y: 464, w: IW, h: 32 } } };
}

const figures = [];

// 01: the dashboard in view mode (steps 1 and 2)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Dashboard Bookshelf (guides) in view mode with the navigation docked: callout 1 marks the Dashboards item of the navigation and callout 2 marks the Edit button of the toolbar',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: CR, nav: true, navActive: 'Dashboards', children: [
      ...tb.nodes,
      { block: 'panel', x: 244, y: 106, w: 560, h: 310, title: T }, reqChart(252, 132, 544, 280),
      ...marks([[G_NAV_ROW.Dashboards, 1], [tb.geo.edit, 2]]),
    ] }),
  });
}

// 02: edit mode, the Add button and the Panel tile (steps 3 and 4)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  figures.push({
    id: '02-add-panel',
    alt: 'Dashboard in edit mode with one panel: callout 3 marks the Add button at the left of the toolbar and callout 4 marks the Panel tile of the Add pane in the right sidebar',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: CR, children: [...tb.nodes, ...P1(), ...add.nodes, ...marks([[tb.geo.add, 3], [add.geo.panelTile, 4]])] }),
  });
}

// 03: Add and Add row (steps 5 and 6)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  const addRow = { x: ADD_X, y: 260, w: 124, h: 32 };
  figures.push({
    id: '03-add-row',
    alt: 'Dashboard in edit mode with two panels, the first with the request rate and the second called New panel: callout 5 marks the Add button of the toolbar and callout 6 marks Add row under Group layouts in the Add pane',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: CR, children: [...tb.nodes, ...P1(), ...P2(), ...add.nodes, ...marks([[tb.geo.add, 5], [addRow, 6]])] }),
  });
}

// 04: the row with its title (step 7)
{
  const tb = gDashToolbar({ saved: true });
  figures.push({
    id: '04-row-title',
    alt: 'Dashboard in edit mode with a new row above the two panels: the row header carries the title Traffic, marked by callout 7',
    width: FW, height: 500,
    nodes: grafanaFrame({ h: 500, crumbs: CR, children: [
      ...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...P2(150, 300),
      ...mark({ x: 16, y: 106, w: 704, h: 34 }, 7),
    ] }),
  });
}

// 05: Add and Add tab (steps 8 and 9)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  const addTab = { x: 928, y: 260, w: 124, h: 32 };
  figures.push({
    id: '05-add-tab',
    alt: 'Dashboard in edit mode with the row Traffic and its two panels: callout 8 marks the Add button of the toolbar and callout 9 marks Add tab under Group layouts in the Add pane',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...P2(150, 300), ...add.nodes, ...marks([[tb.geo.add, 8], [addTab, 9]])] }),
  });
}

// 06: the Dashboard pane, Layout (steps 10 and 11)
{
  const tb = gDashToolbar({ saved: true });
  const p = dashPane({});
  figures.push({
    id: '06-layout-custom',
    alt: 'Dashboard in edit mode with the Dashboard pane of the Options icon open in the right sidebar: callout 10 marks the Options icon of the icon strip and callout 11 marks Custom in the Layout switch, which now has Auto selected',
    width: FW, height: 580,
    nodes: grafanaFrame({ h: 580, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...strip(), ...p.nodes, ...marks([[OPT_ICON, 10], [p.geo.custom, 11]])] }),
  });
}

// 07: Auto layout, Max columns (steps 12 and 13)
{
  const tb = gDashToolbar({ saved: true });
  const p = dashPane({ layoutActive: 1, maxCols: '2' });
  figures.push({
    id: '07-layout-auto',
    alt: 'Dashboard pane in the right sidebar with the Layout switch on Auto (callout 12) and the field Max columns holding 2 (callout 13); the two panels of the canvas now share one row',
    width: FW, height: 580,
    nodes: grafanaFrame({ h: 580, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...P2(150, 300), ...strip(), ...p.nodes, ...marks([[p.geo.auto, 12], [p.geo.maxCols, 13]])] }),
  });
}

// 08: Panel pane, Show / hide rules (steps 14 to 16)
{
  const tb = gDashToolbar({ saved: true });
  const px = 780, pw = 284, ix = px + 12, iw = pw - 24, y = 100;
  const seg = segmented({ x: ix, y: y + 236, items: ['Show', 'Hide'], w: 80, active: 0 });
  const hdr = { x: px, y: y + 170, w: pw, h: 32 };
  const addRule = { x: ix, y: y + 290, w: 140, h: 32 };
  const pane = [
    { block: 'sidePanel', x: px, y, w: pw, h: 452, title: 'Panel' },
    btn(ix, y + 40, 84, 'Duplicate'), btn(ix + 92, y + 40, 72, 'Copy'), btn(ix + 172, y + 40, 88, 'Delete'),
    btn(ix, y + 86, iw, 'Edit visualization', 'primary'),
    ...collapsible(px, y + 134, pw, 'Repeat options'),
    ...collapsible(px, hdr.y, pw, 'Show / hide rules', true),
    lbl(ix, y + 228, 'Panel visibility', { size: 'small', weight: 500, box: 160 }), ...seg.nodes,
    btn(addRule.x, addRule.y, addRule.w, 'Add rule', 'secondary', 'plus'),
  ];
  figures.push({
    id: '08-show-hide-rules',
    alt: 'Dashboard in edit mode with the second panel selected, marked by callout 14, and the Panel pane in the right sidebar: callout 15 marks the Show / hide rules section, which is open and shows Panel visibility with Show and Hide, and callout 16 marks the Add rule button',
    width: FW, height: 580,
    nodes: grafanaFrame({ h: 580, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...P2(150, 300), ...pane, ...marks([[{ x: 376, y: 150, w: 344, h: 300 }, 14], [hdr, 15], [addRule, 16]])] }),
  });
}

// 09: the Add pane, Annotation query and Link (steps 17, 18 and 20)
{
  const tb = gDashToolbar({ saved: true });
  const add = gAddPane();
  const annot = { x: ADD_X, y: 404, w: 260, h: 32 };
  const link = { x: ADD_X, y: 442, w: 260, h: 32 };
  figures.push({
    id: '09-annotation-query-and-link',
    alt: 'Dashboard in edit mode with the Add pane open: callout 17 marks the Add button of the toolbar, callout 18 marks Annotation query and callout 20 marks Link, both under Dashboard controls in the Add pane',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...P2(150, 300), ...add.nodes, ...marks([[tb.geo.add, 17], [annot, 18], [link, 20]])] }),
  });
}

// 10: the Dashboard pane, Annotations and Links sections (steps 22 and 23)
{
  const tb = gDashToolbar({ saved: true });
  const base = 100;
  const annotHdr = { x: PX, y: base + 108, w: PW, h: 32 };
  const linksHdr = { x: PX, y: base + 320, w: PW, h: 32 };
  const nodes = [];
  // Annotations (+) and Links (+) are open: their groups and the entries.
  nodes.push(
    { block: 'sidePanel', x: PX, y: base, w: PW, h: 440, title: 'Dashboard' },
    btn(IX, base + 34, IW, 'View all settings'),
    ...collapsible(PX, base + 72, PW, 'Filters'),
    ...collapsible(PX, base + 108, PW, 'Annotations', true),
    lbl(IX + 8, base + 164, 'Above dashboard', { size: 'small', tone: 'textMuted', box: 200 }),
    box(IX, base + 172, IW, 28, { fill: 'surfaceRaised', radius: 4 }), lbl(IX + 10, base + 191, 'Failure marks', { box: IW - 20 }),
    lbl(IX + 8, base + 220, 'Controls menu', { size: 'small', tone: 'textMuted', box: 200 }),
    lbl(IX + 8, base + 252, 'Hidden', { size: 'small', tone: 'textMuted', box: 200 }),
    box(IX, base + 260, IW, 28, { fill: 'surfaceRaised', radius: 4 }), lbl(IX + 10, base + 279, 'Annotations & Alerts', { box: IW - 20 }),
    ...collapsible(PX, base + 320, PW, 'Links', true),
    box(IX, base + 364, IW, 28, { fill: 'surfaceRaised', radius: 4 }), lbl(IX + 10, base + 383, 'Bookshelf logs', { box: IW - 20 }),
  );
  figures.push({
    id: '10-dashboard-pane-annotations-links',
    alt: 'Dashboard pane of the Options sidebar with two sections open: Annotations, marked by callout 22, lists the new query Failure marks above the dashboard and the built-in Annotations & Alerts under Hidden, and Links, marked by callout 23, lists the link Bookshelf logs',
    width: FW, height: 580,
    nodes: grafanaFrame({ h: 580, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...strip(), ...nodes, ...marks([[annotHdr, 22], [linksHdr, 23]])] }),
  });
}

// 11: the panel editor, Panel links and Save (steps 26 and 28)
{
  const e = gEditor({ mode: 'code', typed: true, hasData: true, right: 'options', title: T, optTitle: T, optDescription: 'Request rate by status', saved: true, crumbs: [...CR, 'Edit panel'] });
  const panelLinks = { x: 792, y: 392, w: 272, h: 32 };
  figures.push({
    id: '11-panel-links',
    alt: 'Panel editor of the dashboard with the Time series options pane: callout 26 marks the Panel links category of the options pane and callout 28 marks the Save button of the editor header',
    width: FW, height: 640,
    nodes: e.nodes.concat(marks([[panelLinks, 26], [e.geo.save, 28]])),
  });
}

// 12: the Save dashboard drawer of an existing dashboard (steps 29 and 30)
{
  const dx = 400, dw = FW - dx, fx = dx + 24, fw = dw - 48;
  const msg = { x: fx, y: 170, w: fw, h: 72 };
  const save = { x: fx, y: 330, w: 76, h: 32 };
  figures.push({
    id: '12-save-drawer',
    alt: 'Save dashboard drawer of the existing dashboard: the Message field holds a short note about the changes (callout 29) and the Save button is marked by callout 30',
    width: FW, height: 430,
    nodes: grafanaFrame({ h: 430, crumbs: [...CR, 'Edit panel'], children: [
      { block: 'panel', x: 16, y: 106, w: 340, h: 220, title: T },
      { block: 'flyout', x: dx, y: 48, w: dw, h: 382, title: 'Save dashboard' },
      { block: 'tabs', x: dx + 8, y: 100, w: 300, tabs: ['Details', 'Changes (4)'], active: 0 },
      { block: 'field', x: fx, y: 150, w: fw, label: 'Message', value: 'Rows, layout, annotation query and links', h: 72 },
      btn(fx, 330, 76, 'Save', 'primary'), btn(fx + 88, 330, 84, 'Cancel'),
      ...marks([[msg, 29], [save, 30]]),
    ] }),
  });
}

// 13: back on the dashboard, Exit edit (step 32)
{
  const tb = gDashToolbar({ saved: true });
  figures.push({
    id: '13-exit-edit',
    alt: 'Dashboard Bookshelf (guides) in edit mode with the row Traffic and the two panels, and the Exit edit button of the toolbar marked by callout 32',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: CR, children: [...tb.nodes, ...rowHeader(106, 'Traffic'), ...P1(150, 300), ...P2(150, 300), ...mark(tb.geo.exit, 32)] }),
  });
}

// ---- view mode with the annotation -------------------------------------------------------------------------------
function annotatedChart({ line = true }) {
  const tb = gDashToolbar({ view: true });
  const cx = 16, cy = 150, cw = 700, ch = 330;
  const px = cx + 24 + 44, pw = cw - 8 - 56, py = cy + 26 + 8, ph = ch - 30 - 52;
  const vx = px + pw * 0.7;
  const n = [
    ...tb.nodes,
    ...rowHeader(106, 'Traffic'),
    { block: 'panel', x: cx, y: cy, w: cw, h: ch, title: T },
    reqChart(cx + 8, cy + 26, cw - 16, ch - 30),
    ...(line ? [box(vx - 1, py, 2, ph, { fill: 'series.4' }), box(vx - 5, py + ph - 8, 10, 10, { fill: 'series.4', radius: 5 })] : []),
  ];
  return { nodes: n, vx, py, ph, tb };
}

// 14: the manual annotation (steps 35 to 37)
{
  const a = annotatedChart({ line: false });
  const px = 340, py = 200, pw = 330, ph = 214;
  const click = { x: a.vx - 8, y: a.py + a.ph - 10, w: 16, h: 16 };
  const desc = { x: px + 16, y: py + 62, w: pw - 32, h: 32 };
  const save = { x: px + 16, y: py + 168, w: 76, h: 32 };
  figures.push({
    id: '14-manual-annotation',
    alt: 'Dashboard in view mode with a small form open on the chart: callout 35 marks the point of the chart that was clicked with Ctrl held, the Description field holds Failure test (callout 36) and the Save button of the form is marked by callout 37',
    width: FW, height: 500,
    nodes: grafanaFrame({ h: 500, crumbs: CR, children: [
      ...a.nodes,
      box(px, py, pw, ph, { fill: 'surface', stroke: 'borderStrong', radius: 6 }),
      lbl(px + 16, py + 30, 'Add annotation', { weight: 600, box: 250 }),
      { block: 'field', x: px + 16, y: py + 42, w: pw - 32, label: 'Description', value: 'Failure test' },
      { block: 'field', x: px + 16, y: py + 104, w: pw - 32, label: 'Tags', placeholder: '' },
      btn(save.x, save.y, save.w, 'Save', 'primary'), btn(px + 100, py + 168, 84, 'Cancel'),
      ...marks([[click, 35], [desc, 36], [save, 37]]),
    ] }),
  });
}

// 15: the finished dashboard (What you build)
{
  const a = annotatedChart({});
  figures.push({
    id: '15-result',
    alt: 'The finished dashboard Bookshelf (guides) in view mode: a row called Traffic holds the request rate panel, which shows a vertical annotation line for the manual annotation Failure test',
    width: FW, height: 500,
    nodes: grafanaFrame({ h: 500, crumbs: CR, children: [...a.nodes, lbl(740, 168, 'Bookshelf logs', { tone: 'link', box: 200 })] }),
  });
}

export default { product: 'grafana', guide: 'g14', figures };
