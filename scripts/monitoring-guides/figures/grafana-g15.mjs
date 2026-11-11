// Figures of the Grafana guide G15, "Reuse, versions and sharing" (guide-reuse-versions-and-sharing.adoc).
// Facts: guides-brief/grafana-facts.md section 6 (edit mode, Save drawer with Message), section 9 (dashboard settings tabs,
// Dashboard pane, JSON model v2, Export, Share menu with Share internally / Share externally / Share snapshot and their
// drawers, Library panels page and the Use library panel button), section 1 (Dashboards nav children).
// NOT VERIFIED in the lab (drawn schematically, see the report): creating, reusing and unlinking a library panel, the
// Library panels page body, the Versions list with compare and restore, the Import dashboard page, the export drawer buttons.
// Callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, rule, mark, marks, menu, segmented, grafanaFrame, gDashToolbar, reqChart,
} from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const T = 'Requests per second by status';
const CR = ['Dashboards', 'Guides', 'Bookshelf (guides)'];
const collapsible = (x, y, w, label, open = false) => [ico(x + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(x + 32, y + 21, label, { weight: 500, box: w - 48 }), rule(x, y + 32, w)];

function tabBox(x0, y, labels, i, active) {
  let x = x0;
  labels.forEach((t, k) => { if (k < i) x += Math.ceil(textWidth(t, 14, { weight: k === active ? 500 : 400 })) + 24; });
  const w = Math.ceil(textWidth(labels[i], 14, { weight: i === active ? 500 : 400 })) + 24;
  return { x: x + 4, y, w: w - 8, h: 32 };
}

const figures = [];

// 01: view mode, Dashboards and Edit (steps 1 and 2)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Dashboard Bookshelf (guides) in view mode with the navigation docked: callout 1 marks the Dashboards item of the navigation and callout 2 marks the Edit button of the toolbar',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: CR, nav: true, navActive: 'Dashboards', children: [
      ...tb.nodes,
      { block: 'panel', x: 244, y: 106, w: 560, h: 310, title: T }, reqChart(252, 132, 544, 280),
      ...marks([[{ x: 8, y: 116, w: 204, h: 32 }, 1], [tb.geo.edit, 2]]),
    ] }),
  });
}

// 02: the panel menu (step 3)
{
  const tb = gDashToolbar({ saved: true });
  const dots = { x: 506, y: 108, w: 24, h: 24 };
  figures.push({
    id: '02-panel-menu',
    alt: 'Dashboard in edit mode with the panel Requests per second by status: the three dots of the panel header, the menu of the panel, are marked by callout 3',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: CR, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 290, title: T }, ico(510, 112, 'dots'), reqChart(24, 132, 504, 260),
      ...mark(dots, 3),
    ] }),
  });
}

// 03: the empty panel, Use library panel (step 7)
{
  const tb = gDashToolbar({ saved: true });
  const useLib = { x: 454, y: 288, w: 220, h: 32 };
  figures.push({
    id: '03-use-library-panel',
    alt: 'Dashboard in edit mode with the request rate panel and a new empty panel called New panel: the buttons Configure visualization, Use saved query and Use library panel are shown, and Use library panel is marked by callout 7',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: CR, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 352, h: 300, title: T }, reqChart(24, 132, 336, 270),
      { block: 'panel', x: 376, y: 106, w: 344, h: 300, title: 'New panel' },
      btn(440, 196, 216, 'Configure visualization', 'primary'), btn(440, 242, 216, 'Use saved query'), btn(useLib.x - 14, useLib.y, 216, 'Use library panel'),
      ...mark({ x: 440, y: 288, w: 216, h: 32 }, 7),
    ] }),
  });
}

// 04: the Library panels page (step 9)
{
  const items = [
    { label: 'Bookmarks', icon: 'star' }, { label: 'Starred', icon: 'star' }, { label: 'Dashboards', icon: 'dashboard', chevron: 'down' },
    { label: 'Playlists', indent: 1 }, { label: 'Snapshots', indent: 1 }, { label: 'Library panels', indent: 1, active: true }, { label: 'Public dashboards', indent: 1 },
    { label: 'Explore', icon: 'explore' }, { label: 'Alerting', icon: 'bell' },
  ];
  const lib = { x: 8, y: 218, w: 204, h: 32 };
  figures.push({
    id: '04-library-panels-page',
    alt: 'Library panels page of Grafana 13.3 with the Dashboards group of the navigation open: callout 9 marks the entry Library panels, and the page lists the library panel guide-request-rate in the folder Guides',
    width: FW, height: 420,
    nodes: [{ block: 'window', x: 0, y: 0, w: FW, h: 420, radius: 0, children: [
      { block: 'nav', x: 0, y: 0, w: 220, h: 420, logo: 'si:grafana', title: 'Grafana', items, active: 'Library panels' },
      { block: 'toolbar', x: 220, y: 0, w: FW - 220, crumbs: ['Dashboards', 'Library panels'] },
      lbl(244, 112, 'Library panels', { size: 'heading', weight: 500, box: 400 }),
      box(244, 150, 800, 44, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(260, 177, 'guide-request-rate', { weight: 500, box: 300 }), { block: 'chip', x: 560, y: 166, str: 'Guides' },
      lbl(244, 232, 'The list is drawn schematically.', { size: 'small', tone: 'textFaint', box: 400 }),
      ...mark(lib, 9),
    ] }],
  });
}

// 05: the Dashboard pane, View all settings (steps 14 and 15)
{
  const tb = gDashToolbar({ saved: true });
  const PX = 736, PW = 284, IX = PX + 12, IW = PW - 24;
  const STRIP = ['plus', 'gear', 'menu', 'apps', 'close'];
  const strip = STRIP.flatMap((n, i) => [box(1030, 100 + i * 40, 40, 32, { fill: i === 1 ? 'navActiveBg' : 'surface', stroke: 'border', radius: 6 }), ico(1042, 108 + i * 40, n)]);
  const view = { x: IX, y: 134, w: IW, h: 32 };
  figures.push({
    id: '05-view-all-settings',
    alt: 'Dashboard in edit mode with the Dashboard pane of the Options icon open in the right sidebar: callout 14 marks the Options icon of the icon strip and callout 15 marks the View all settings button at the top of the pane',
    width: FW, height: 500,
    nodes: grafanaFrame({ h: 500, crumbs: CR, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 352, h: 300, title: T }, reqChart(24, 132, 336, 270),
      ...strip,
      { block: 'sidePanel', x: PX, y: 100, w: PW, h: 380, title: 'Dashboard' },
      btn(view.x, view.y, view.w, 'View all settings'),
      { block: 'field', x: IX, y: 176, w: IW, label: 'Title', value: 'Bookshelf (guides)' },
      { block: 'field', x: IX, y: 238, w: IW, label: 'Description', placeholder: '' },
      ...collapsible(PX, 310, PW, 'Filters'), ...collapsible(PX, 346, PW, 'Variables'),
      ...marks([[{ x: 1030, y: 140, w: 40, h: 32 }, 14], [view, 15]]),
    ] }),
  });
}

// ---- dashboard settings with its tab strip --------------------------------------------------------------------
const SET_TABS = ['General', 'Annotations', 'Variables', 'Links', 'Versions', 'Permissions', 'JSON Model'];
const settings = (h, active, body, extra = []) => grafanaFrame({ h, crumbs: [...CR, 'Settings'], children: [
  { block: 'tabs', x: 16, y: 62, w: 820, tabs: SET_TABS, active }, ...body, ...extra,
] });

// 06: the JSON Model tab (step 16)
{
  const tab = tabBox(16, 62, SET_TABS, 6, 6);
  figures.push({
    id: '06-json-model',
    alt: 'Dashboard settings with the JSON Model tab selected and marked by callout 16: the editor shows the start of the JSON of the dashboard, with apiVersion dashboard.grafana.app/v2, kind Dashboard, metadata and spec',
    width: FW, height: 400,
    nodes: settings(400, 6, [
      { block: 'queryEditor', x: 16, y: 112, w: 1048, h: 260, lineNumbers: true, lines: [
        '{',
        '  "apiVersion": "dashboard.grafana.app/v2",',
        '  "kind": "Dashboard",',
        '  "metadata": {',
        '    "name": "<uid>",',
        '    "annotations": { ... }',
        '  },',
        '  "spec": {',
        '    "title": "Bookshelf (guides)",',
        '    "elements": { ... },',
        '    "layout": { ... }',
        '  }',
        '}',
      ] },
    ], mark(tab, 16)),
  });
}

// 07: the Versions tab (step 17)
{
  const tab = tabBox(16, 62, SET_TABS, 4, 4);
  figures.push({
    id: '07-versions-tab',
    alt: 'Dashboard settings with the Versions tab selected and marked by callout 17: the body holds the list of saved versions of the dashboard, drawn as empty rows',
    width: FW, height: 380,
    nodes: settings(380, 4, [
      ...[0, 1, 2].flatMap((i) => [box(16, 112 + i * 52, 1048, 44, { fill: 'surface', stroke: 'border', radius: 6 })]),
      lbl(16, 290, 'The list of versions is drawn schematically.', { size: 'small', tone: 'textFaint', box: 500 }),
    ], mark(tab, 17)),
  });
}

// 08: the export drawer (step 22)
{
  const dx = 440, dw = FW - dx, fx = dx + 24, fw = dw - 48;
  const ed = { x: fx, y: 236, w: fw, h: 190 };
  figures.push({
    id: '08-export-as-code',
    alt: 'Dashboard in view mode with the drawer Export dashboard open: it says Copy or download a file containing the definition of your dashboard, offers the toggle Share dashboard with another instance and the Advanced options, and shows the JSON of the dashboard, which is marked by callout 22',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: CR, children: [
      { block: 'panel', x: 16, y: 106, w: 400, h: 290, title: T }, reqChart(24, 132, 384, 260),
      { block: 'flyout', x: dx, y: 48, w: dw, h: 432, title: 'Export dashboard' },
      lbl(fx, 120, 'Copy or download a file containing the definition of your dashboard', { size: 'small', tone: 'textMuted', box: fw }),
      { block: 'toggle', x: fx, y: 140, label: 'Share dashboard with another instance', on: false, box: 400 },
      ...collapsible(dx, 166, dw, 'Advanced options'),
      { block: 'queryEditor', x: ed.x, y: ed.y, w: ed.w, h: ed.h, lineNumbers: true, lines: ['{', '  "apiVersion": "dashboard.grafana.app/v2",', '  "kind": "Dashboard",', '  "metadata": { ... },', '  "spec": { ... }', '}'] },
      ...mark(ed, 22),
    ] }),
  });
}

// 09: the New menu, Import dashboard (step 23)
{
  const m = menu({ x: 872, y: 120, w: 192, heading: 'Dashboard', items: ['New dashboard', 'Import dashboard', 'New folder'], hot: 1 });
  figures.push({
    id: '09-import-dashboard',
    alt: 'Dashboards page of Grafana 13.3 with the New menu open: callout 23 marks Import dashboard in the menu, between New dashboard and New folder',
    width: FW, height: 360,
    nodes: grafanaFrame({ h: 360, crumbs: ['Dashboards'], nav: true, navActive: 'Dashboards', children: [
      lbl(244, 112, 'Dashboards', { size: 'heading', weight: 500, box: 400 }),
      btn(702, 70, 150, 'Recently deleted'), btn(860, 70, 92, 'New', 'primary', 'chevronDown'),
      { block: 'field', x: 244, y: 176, w: 420, placeholder: 'Search for dashboards and folders' },
      ...m.nodes, ...mark(m.rows[1], 23),
    ] }),
  });
}

// 10: the Share menu (steps 25 and 26)
{
  const tb = gDashToolbar({ view: true });
  const m = menu({ x: 1064 - 210, y: 96, w: 210, items: ['Share internally', 'Share externally', 'Share snapshot'], hot: 0 });
  figures.push({
    id: '10-share-menu',
    alt: 'Dashboard in view mode with the Share menu open: callout 25 marks the Share button of the toolbar and callout 26 marks Share internally, the first of the entries Share internally, Share externally and Share snapshot',
    width: FW, height: 400,
    nodes: grafanaFrame({ h: 400, crumbs: CR, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 560, h: 270, title: T }, reqChart(24, 132, 544, 240),
      ...m.nodes, ...marks([[tb.geo.share, 25], [m.rows[0], 26]]),
    ] }),
  });
}

// ---- drawers of the Share menu ----------------------------------------------------------------------------------
const drawer = (h, title, children, dx = 600) => grafanaFrame({ h, crumbs: CR, children: [
  { block: 'panel', x: 16, y: 106, w: 380, h: h - 150, title: T },
  { block: 'flyout', x: dx, y: 48, w: FW - dx, h: h - 48, title },
  ...children,
] });

// 11: Share internally (steps 27 and 28)
{
  const fx = 624;
  const lock = { x: fx, y: 162, w: 300, h: 20 };
  const copy = { x: fx, y: 330, w: 110, h: 32 };
  figures.push({
    id: '11-share-internally',
    alt: 'Share internally drawer with Link settings: the toggle Lock time range is switched on and marked by callout 27, the toggles Shorten link and the Theme choice follow, and the Copy link button is marked by callout 28',
    width: FW, height: 400,
    nodes: drawer(400, 'Share internally', [
      lbl(fx, 124, 'Link settings', { weight: 600, box: 200 }),
      { block: 'toggle', x: fx, y: 162, label: 'Lock time range', on: true, box: 220 },
      { block: 'toggle', x: fx, y: 200, label: 'Shorten link', on: false, box: 220 },
      lbl(fx, 256, 'Theme', { weight: 500, box: 100 }), ...segmented({ x: fx, y: 268, items: ['Current', 'Dark', 'Light'], w: 90, active: 0 }).nodes,
      btn(copy.x, copy.y, copy.w, 'Copy link', 'primary'),
      ...marks([[lock, 27], [copy, 28]]),
    ]),
  });
}

// 12: Share externally (steps 29 and 30)
{
  const fx = 624;
  const warn = { x: fx, y: 210, w: 410, h: 20 };
  const cancel = { x: fx + 88, y: 314, w: 84, h: 32 };
  figures.push({
    id: '12-share-externally',
    alt: 'Share externally drawer: Link access is set to Anyone with the link, the checkbox I understand that this entire dashboard will be public is marked by callout 29, and the Cancel button next to Accept is marked by callout 30',
    width: FW, height: 400,
    nodes: drawer(400, 'Share externally', [
      lbl(fx, 124, 'Link access', { weight: 600, box: 200 }),
      { block: 'dropdown', x: fx, y: 138, w: 300, value: 'Anyone with the link' },
      { block: 'checkbox', x: fx, y: 212, label: 'I understand that this entire dashboard will be public.', checked: false, box: 400 },
      btn(fx, 314, 80, 'Accept'), btn(cancel.x, cancel.y, cancel.w, 'Cancel'),
      ...marks([[warn, 29], [cancel, 30]]),
    ]),
  });
}

// 13: Share snapshot (steps 32 to 34)
{
  const fx = 624;
  const name = { x: fx, y: 130, w: 410, h: 32 };
  const exp = { x: fx, y: 200, w: 200, h: 32 };
  const pub = { x: fx, y: 270, w: 170, h: 32 };
  figures.push({
    id: '13-share-snapshot',
    alt: 'Share snapshot drawer: the Snapshot name field holds Bookshelf guides snapshot (callout 32), Expires in is set to 1 Hour (callout 33) and the Publish snapshot button is marked by callout 34, above the buttons Publish to snapshots.raintank.io and Cancel and the link View all snapshots',
    width: FW, height: 460,
    nodes: drawer(460, 'Share snapshot', [
      { block: 'field', x: fx, y: 110, w: 410, label: 'Snapshot name', value: 'Bookshelf guides snapshot' },
      { block: 'dropdown', x: fx, y: 180, w: 200, label: 'Expires in', value: '1 Hour' },
      btn(pub.x, pub.y, pub.w, 'Publish snapshot', 'primary'),
      btn(fx + 180, 270, 250, 'Publish to snapshots.raintank.io'),
      btn(fx, 320, 84, 'Cancel'),
      lbl(fx + 100, 341, 'View all snapshots', { tone: 'link', box: 200 }),
      ...marks([[name, 32], [exp, 33], [pub, 34]]),
    ]),
  });
}

// 14: the result (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '14-result',
    alt: 'The finished dashboard Bookshelf (guides) in view mode with two panels titled Requests per second by status, one of them reused from the library panel guide-request-rate and the other unlinked from it, and the Share button of the toolbar',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: CR, children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 290, title: T }, reqChart(24, 132, 504, 260),
      { block: 'panel', x: 544, y: 106, w: 520, h: 290, title: T }, reqChart(552, 132, 504, 260),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g15', figures };
