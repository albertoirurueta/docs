// Figures of the Grafana guide G5, "Create a dashboard and the first panel" (guide-first-dashboard.adoc).
// Facts: guides-brief/grafana-facts.md section 6 (Grafana 13.3.0 flow). A figure shows the screen the step starts from,
// with the control to act on highlighted; a typing step shows the typed value. Callout numbers are the step numbers of
// the page. Colours are theme tokens only; the shared screens come from lib/shells.mjs.
import {
  FW, lbl, box, btn, ico, mark, marks, menu, grafanaFrame, G_NAV_ROW, gDashToolbar, gAddPane, gPanelPane, gEditor, reqChart, G_NAV_W,
} from '../lib/shells.mjs';

const H = 560;
const dash = (crumbs, children, extra = {}) => grafanaFrame({ h: extra.h ?? H, crumbs, nav: extra.nav ?? false, navActive: extra.navActive, children });

// A dashboard in edit mode with one panel (after the first save): used by the Back, Exit edit and dialog figures.
function dashWithPanel({ modal = false }) {
  const tb = gDashToolbar({ saved: true });
  const nodes = [
    ...tb.nodes,
    { block: 'panel', x: 16, y: 106, w: 520, h: 300, title: 'Requests per second by status' },
    reqChart(24, 132, 504, 270),
    btn(16, 418, 110, 'Add panel'), btn(134, 418, 130, 'Group panels'),
  ];
  return { nodes, tb };
}

const figures = [];

// 01: Dashboards page, New menu open (steps 1 and 2)
{
  const m = menu({ x: 872, y: 120, w: 192, heading: 'Dashboard', items: ['New dashboard', 'Import dashboard', 'New folder'], hot: 0 });
  figures.push({
    id: '01-new-dashboard-menu',
    alt: 'Dashboards page of Grafana 13.3 with the New menu open: callout 1 marks the Dashboards item of the navigation and callout 2 marks New dashboard in the menu',
    width: FW, height: 430,
    nodes: dash(['Dashboards'], [
      lbl(244, 112, 'Dashboards', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 140, 'Create and manage dashboards to visualize your data', { tone: 'textMuted', box: 520 }),
      btn(702, 70, 150, 'Recently deleted'), btn(860, 70, 92, 'New', 'primary', 'chevronDown'),
      { block: 'field', x: 244, y: 176, w: 420, placeholder: 'Search for dashboards and folders' },
      { block: 'table', x: 244, y: 236, w: 800, columns: [{ title: 'Name', w: 1 }], rows: [['Shared with me'], ['My team folders'], ['bookshelf']] },
      ...m.nodes,
      ...marks([[G_NAV_ROW.Dashboards, 1], [m.rows[0], 2]]),
    ], { h: 430, nav: true }),
  });
}

// 02: the empty new dashboard (steps 3 and 4)
{
  const tb = gDashToolbar();
  const add = gAddPane();
  figures.push({
    id: '02-empty-dashboard',
    alt: 'New dashboard in edit mode: the empty state offers the layouts Auto grid and Custom grid, with Auto grid marked by callout 3, and the Add pane of the right sidebar has its Panel tile marked by callout 4',
    width: FW, height: H,
    nodes: dash(['Dashboards', 'New dashboard'], [
      ...tb.nodes,
      ico(369, 168, 'dashboard', 'navActiveBar'),
      lbl(385, 246, 'New dashboard', { size: 'heading', weight: 500, anchor: 'middle', box: 320 }),
      lbl(385, 276, 'Add a panel to visualize your data', { tone: 'textMuted', anchor: 'middle', box: 340 }),
      lbl(385, 316, 'Select layout', { weight: 500, anchor: 'middle' }),
      box(250, 332, 120, 36, { fill: 'surface', stroke: 'primary', radius: 6, strokeWidth: 2 }),
      ico(262, 342, 'check', 'primary'), lbl(286, 355, 'Auto grid', { weight: 500, box: 80 }),
      box(380, 332, 130, 36, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(445, 355, 'Custom grid', { anchor: 'middle', tone: 'textMuted', box: 110 }),
      lbl(385, 396, 'Panels resize to fit and form uniform grids', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 330 }),
      ...add.nodes,
      ...marks([[{ x: 250, y: 332, w: 120, h: 36 }, 3], [add.geo.panelTile, 4]]),
    ]),
  });
}

// 03: the panel was added; the Panel pane (step 5)
{
  const tb = gDashToolbar();
  const pane = gPanelPane();
  figures.push({
    id: '03-panel-added',
    alt: 'Dashboard in edit mode after the Panel tile was clicked: a panel called New panel with the buttons Configure visualization, Use saved query and Use library panel, and the Panel pane of the sidebar with Edit visualization marked by callout 5',
    width: FW, height: H,
    nodes: dash(['Dashboards', 'New dashboard'], [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 380, h: 300, title: 'New panel' },
      btn(96, 190, 220, 'Configure visualization', 'primary'), btn(96, 236, 220, 'Use saved query'), btn(96, 282, 220, 'Use library panel'),
      ...pane.nodes,
      ...mark(pane.geo.edit, 5),
    ]),
  });
}

// 04: panel editor, Queries tab, data source and Builder / Code (steps 6 and 7)
{
  const e = gEditor({ right: 'empty' });
  figures.push({
    id: '04-panel-editor',
    alt: 'Panel editor of Grafana 13.3 with an empty New panel: callout 6 marks the Prometheus data source picker above the query and callout 7 marks the Code option of the Builder and Code switch',
    width: FW, height: 640,
    nodes: e.nodes.concat(marks([[e.geo.ds, 6], [e.geo.code, 7]])),
  });
}

// 05: Code mode, the typed query and Run queries (steps 8 and 9)
{
  const e = gEditor({ mode: 'code', typed: true, right: 'empty' });
  figures.push({
    id: '05-query-typed',
    alt: 'Panel editor in Code mode with the PromQL query for the request rate by status typed into the editor, marked by callout 8, and the Run queries button marked by callout 9',
    width: FW, height: 640,
    nodes: e.nodes.concat(marks([[e.geo.editor, 8], [e.geo.runQueries, 9]])),
  });
}

// 06: the result and the Suggestions list (step 10)
{
  const e = gEditor({ mode: 'code', typed: true, hasData: true, right: 'suggestions' });
  figures.push({
    id: '06-result-and-suggestions',
    alt: 'Panel editor after Run queries: the preview draws two lines for the status codes 200 and 404 and the Suggestions list on the right offers Time series first, marked by callout 10',
    width: FW, height: 640,
    nodes: e.nodes.concat(mark(e.geo.timeSeries, 10)),
  });
}

// 07: the options pane: title, description, Save (steps 11 to 13)
{
  const t = 'Requests per second by status';
  const e = gEditor({ mode: 'code', typed: true, hasData: true, right: 'options', title: t, optTitle: t, optDescription: 'Request rate by status' });
  figures.push({
    id: '07-title-and-description',
    alt: 'Panel editor with the Time series options pane: the Title field holds Requests per second by status (callout 11), the Description field holds a short text (callout 12) and the Save button of the header is marked by callout 13',
    width: FW, height: 640,
    nodes: e.nodes.concat(marks([[e.geo.optTitle, 11], [e.geo.optDesc, 12], [e.geo.save, 13]])),
  });
}

// 08: the Save dashboard drawer of a new dashboard (steps 14 to 16)
{
  const dx = 400, dw = FW - dx;
  const fx = dx + 24, fw = dw - 48;
  const geoTitle = { x: fx, y: 180, w: fw, h: 32 };
  const geoFolder = { x: fx, y: 316, w: 320, h: 32 };
  const geoSave = { x: fx, y: 420, w: 76, h: 32 };
  figures.push({
    id: '08-save-dashboard',
    alt: 'Save dashboard drawer of a new dashboard with the title Bookshelf (guides) marked by callout 14, the folder Guides marked by callout 15 and the Save button marked by callout 16',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: ['Dashboards', 'New dashboard', 'Edit panel'], children: [
      { block: 'panel', x: 16, y: 106, w: 340, h: 220, title: 'Requests per second by status' },
      { block: 'flyout', x: dx, y: 48, w: dw, h: 472, title: 'Save dashboard' },
      { block: 'tabs', x: dx + 8, y: 100, w: 300, tabs: ['Details', 'Changes'], active: 0 },
      { block: 'field', x: fx, y: 160, w: fw, label: 'Title', value: 'Bookshelf (guides)' },
      { block: 'field', x: fx, y: 228, w: fw, label: 'Description' },
      { block: 'dropdown', x: fx, y: 296, w: 320, label: 'Folder', value: 'Guides' },
      btn(fx, 420, 76, 'Save', 'primary'), btn(fx + 88, 420, 84, 'Cancel'),
      ...marks([[geoTitle, 14], [geoFolder, 15], [geoSave, 16]]),
    ] }),
  });
}

// 09: saved: toast and the Alert tab; Back (step 17)
{
  const t = 'Requests per second by status';
  const e = gEditor({ mode: 'code', typed: true, hasData: true, right: 'options', title: t, optTitle: t, optDescription: 'Request rate by status', saved: true,
    crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'],
    children: [
      box(824, 98, 240, 44, { fill: 'state.normal.bg', radius: 6 }),
      ico(836, 112, 'check', 'state.normal.text'),
      lbl(860, 125, 'Dashboard saved', { weight: 500, tone: 'state.normal.text', box: 190 }),
    ] });
  figures.push({
    id: '09-dashboard-saved',
    alt: 'Panel editor right after saving: a green toast reads Dashboard saved, the bottom tabs now include Alert, and the Back button of the header is marked by callout 17',
    width: FW, height: 640,
    nodes: e.nodes.concat(mark(e.geo.back, 17)),
  });
}

// 10: the dashboard in edit mode; Exit edit (step 18)
{
  const d = dashWithPanel({});
  figures.push({
    id: '10-dashboard-edit-mode',
    alt: 'Dashboard Bookshelf (guides) in edit mode with the panel Requests per second by status, and the Exit edit button of the toolbar marked by callout 18',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [...d.nodes, ...mark(d.tb.geo.exit, 18)] }),
  });
}

// 11: the Unsaved changes dialog (step 19)
{
  const d = dashWithPanel({});
  const mx = 340, my = 150, mw = 400;
  const saveBtn = { x: mx + mw - 24 - 70, y: my + 130, w: 70, h: 32 };
  figures.push({
    id: '11-unsaved-changes',
    alt: 'Unsaved changes dialog asking Do you want to save your changes, with the buttons Cancel, Discard and Save; the Save button is marked by callout 19',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...d.nodes,
      box(mx, my, mw, 190, { fill: 'surface', stroke: 'borderStrong', radius: 8 }),
      lbl(mx + 24, my + 40, 'Unsaved changes', { size: 'title', weight: 600, box: 300 }),
      lbl(mx + 24, my + 74, 'Do you want to save your changes?', { tone: 'textMuted', box: 340 }),
      btn(mx + mw - 24 - 70 - 8 - 84 - 8 - 78, my + 130, 78, 'Cancel'), btn(mx + mw - 24 - 70 - 8 - 84, my + 130, 84, 'Discard'), btn(saveBtn.x, saveBtn.y, 70, 'Save', 'primary'),
      ...mark(saveBtn, 19),
    ] }),
  });
}

// 12: the second Save drawer (existing dashboard: Message) (step 20)
{
  const dx = 400, dw = FW - dx, fx = dx + 24, fw = dw - 48;
  const geoSave = { x: fx, y: 330, w: 76, h: 32 };
  figures.push({
    id: '12-save-again',
    alt: 'Save dashboard drawer of the existing dashboard with the Message field and one change listed; the Save button is marked by callout 20',
    width: FW, height: 430,
    nodes: grafanaFrame({ h: 430, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      { block: 'panel', x: 16, y: 106, w: 340, h: 220, title: 'Requests per second by status' },
      { block: 'flyout', x: dx, y: 48, w: dw, h: 382, title: 'Save dashboard' },
      { block: 'tabs', x: dx + 8, y: 100, w: 300, tabs: ['Details', 'Changes (1)'], active: 0 },
      { block: 'field', x: fx, y: 150, w: fw, label: 'Message', placeholder: 'Add a note to describe your changes (optional).', h: 72 },
      btn(fx, 330, 76, 'Save', 'primary'), btn(fx + 88, 330, 84, 'Cancel'),
      ...mark(geoSave, 20),
    ] }),
  });
}

// 13: the finished dashboard in view mode (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '13-result',
    alt: 'Finished dashboard Bookshelf (guides) in view mode: one panel, Requests per second by status, draws the request rate of the status codes 200 and 404 over the last 6 hours',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 640, h: 320, title: 'Requests per second by status' },
      reqChart(24, 132, 624, 290),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g5', figures };
