// Figures of the Grafana guide G1, "First steps in Grafana" (guide-first-steps.adoc).
// Facts: guides-brief/grafana-facts.md sections 0, 1 and 2 (Grafana 13.3.0). A figure shows the screen the step starts
// from, with the control to act on highlighted; a typing step shows the typed value. Callout numbers are the step numbers
// of the page. Colours are theme tokens only; the shared screens come from lib/shells.mjs.
import { FW, lbl, box, btn, ico, mark, marks, menu, grafanaFrame, G_NAV_W, reqChart } from '../lib/shells.mjs';

const H = 560;
// Row i of the docked navigation (header strip 48 px, rows of 32 px every 34 px): Bookmarks 0 ... Administration 8.
const navRow = (i) => ({ x: 8, y: 48 + i * 34, w: G_NAV_W - 16, h: 32 });
const NAV = { dashboards: navRow(2), explore: navRow(3) };

// The sign-in card (also used by the Update your password screen): Grafana logo, title, children inside.
function card(h, title, children) {
  const cx = 301, cw = 478;
  return [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [
    { block: 'logo', x: 514, y: 24, size: 52, key: 'si:grafana' },
    box(cx, 96, cw, h - 120, { fill: 'surface', stroke: 'border', radius: 10 }),
    lbl(FW / 2, 144, title, { size: 'heading', anchor: 'middle', box: 420 }),
    ...children,
  ] }];
}

// Right part of the dashboard toolbar of the provisioned dashboard (view mode, y = 58).
function viewToolbar() {
  const y = 58;
  const edit = { x: FW - 16 - 68, y, w: 68, h: 32 };
  const share = { x: edit.x - 8 - 34, y, w: 34, h: 32 };
  const interval = { x: share.x - 8 - 64, y, w: 64, h: 32 };
  const refresh = { x: interval.x - 4 - 95, y, w: 95, h: 32 };
  const time = { x: refresh.x - 8 - 178, y, w: 178, h: 32 };
  return {
    nodes: [
      btn(time.x, y, 178, 'Last 6 hours UTC', 'secondary', 'clock'), btn(refresh.x, y, 95, 'Refresh', 'secondary', 'refresh'),
      btn(interval.x, y, 64, '30s', 'secondary', 'chevronDown'), btn(share.x, y, 34, '', 'secondary', 'share'), btn(edit.x, y, 68, 'Edit'),
    ],
    geo: { time, refresh, interval, edit },
  };
}

// The provisioned dashboard: variables, toolbar, row headers and untitled panels (panel titles are not in the facts brief).
function bookshelfDashboard(h = H) {
  const tb = viewToolbar();
  const vars = [['Job', 16], ['Application', 120], ['Route', 258]];
  const nodes = [
    ...vars.flatMap(([name, x]) => [box(x, 58, name === 'Application' ? 130 : 96, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }), lbl(x + 10, 79, name, { box: 110 })]),
    { block: 'toggle', x: 372, y: 65, label: 'Deployments', on: true, box: 110 },
    ...tb.nodes,
    ico(16, 108, 'chevronDown'), lbl(40, 121, 'Golden signals', { weight: 500, box: 220 }),
    ...[0, 1, 2, 3].flatMap((i) => [{ block: 'panel', x: 16 + i * 130, y: 136, w: 122, h: 110 }, lbl(16 + i * 130 + 61, 196, '…', { anchor: 'middle', tone: 'textFaint' })]),
    { block: 'panel', x: 540, y: 136, w: 524, h: 150 }, reqChart(548, 142, 508, 140),
    ico(16, 300, 'chevronRight'), lbl(40, 313, 'Logs and traces', { weight: 500, box: 220 }),
    ico(16, 334, 'chevronRight'), lbl(40, 347, 'Dependencies', { weight: 500, box: 220 }),
  ];
  return { nodes, geo: tb.geo, h };
}

const figures = [];

// 01: the sign-in page with the typed values (steps 2 to 4)
{
  const fx = 325, fw = 430;
  figures.push({
    id: '01-sign-in',
    alt: 'Sign-in page of Grafana 13.3 titled Welcome to Grafana: the field Email or username holds admin (callout 2), the field Password holds dots (callout 3) and the Log in button is marked by callout 4',
    width: FW, height: 470,
    nodes: card(470, 'Welcome to Grafana', [
      { block: 'field', x: fx, y: 172, w: fw, label: 'Email or username', value: 'admin' },
      { block: 'field', x: fx, y: 238, w: fw, label: 'Password', value: '•••••' },
      btn(fx, 312, fw, 'Log in', 'primary'),
      lbl(FW / 2, 376, 'Forgot your password?', { size: 'small', tone: 'link', anchor: 'middle', box: 200 }),
      ...marks([[{ x: fx, y: 192, w: fw, h: 32 }, 2], [{ x: fx, y: 258, w: fw, h: 32 }, 3], [{ x: fx, y: 312, w: fw, h: 32 }, 4]]),
    ]),
  });
}

// 02: the Update your password screen (step 5)
{
  const fx = 325, fw = 430;
  figures.push({
    id: '02-update-password',
    alt: 'Update your password screen of Grafana 13.3 with the fields New password and Confirm new password, the Submit button and the Skip link, which is marked by callout 5',
    width: FW, height: 500,
    nodes: card(500, 'Update your password', [
      lbl(FW / 2, 176, 'Continuing to use the default password exposes you to security risks.', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 440 }),
      { block: 'field', x: fx, y: 200, w: fw, label: 'New password', placeholder: 'New password' },
      { block: 'field', x: fx, y: 266, w: fw, label: 'Confirm new password', placeholder: 'Confirm new password' },
      btn(fx, 340, fw, 'Submit', 'primary'),
      lbl(FW / 2, 404, 'Skip', { tone: 'link', anchor: 'middle', box: 60 }),
      ...mark({ x: FW / 2 - 28, y: 388, w: 56, h: 24 }, 5),
    ]),
  });
}

// 03: Home with the docked navigation and the New button of the top bar (steps 6 and 7)
{
  const newBtn = { x: FW - 16 - 120 - 8 - 90, y: 12, w: 90, h: 32 };
  figures.push({
    id: '03-home-navigation',
    alt: 'Home page of Grafana 13.3 with the docked left navigation listing Bookmarks, Starred, Dashboards, Explore, Drilldown, AI, Alerting, Connections and Administration (callout 6) and the New button of the top bar marked by callout 7',
    width: FW, height: 470,
    nodes: grafanaFrame({ h: 470, crumbs: ['Home'], nav: true, navActive: 'none', children: [
      btn(newBtn.x, 12, 90, 'New', 'secondary', 'plus'),
      lbl(244, 100, 'Good morning.', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 130, 'Welcome to Grafana Enterprise.', { tone: 'textMuted', box: 400 }),
      box(244, 160, 400, 200, { fill: 'surface', stroke: 'border', radius: 10 }),
      lbl(260, 190, 'Recent', { weight: 500, box: 100 }), lbl(330, 190, 'Starred', { tone: 'textMuted', box: 100 }),
      lbl(260, 240, 'No recent activity yet. Pages you visit will show up here.', { size: 'small', tone: 'textMuted', box: 360 }),
      btn(260, 300, 250, 'Create your first dashboard', 'primary', 'plus'),
      box(660, 160, 404, 200, { fill: 'surface', stroke: 'border', radius: 10 }),
      lbl(676, 190, 'Firing alerts', { weight: 500, box: 200 }),
      lbl(676, 240, 'All clear! No alerts are firing.', { size: 'small', tone: 'textMuted', box: 360 }),
      btn(676, 300, 190, 'Create an alert rule'),
      ...marks([[{ x: 8, y: 48, w: G_NAV_W - 16, h: 9 * 34 - 2 }, 6], [newBtn, 7]]),
    ] }),
  });
}

// 04: the New menu (step 8: close it)
{
  const m = menu({ x: 770, y: 44, w: 200, heading: 'Dashboards', items: ['New dashboard', 'Import dashboard'], hot: -1 });
  const m2 = menu({ x: 770, y: 44 + m.h + 4, w: 200, heading: 'Alerting', items: ['New alert rule'], hot: -1 });
  figures.push({
    id: '04-new-menu',
    alt: 'The New menu of the top bar is open with the headings Dashboards, offering New dashboard and Import dashboard, and Alerting, offering New alert rule; callout 8 marks the menu that the Escape key closes',
    width: FW, height: 330,
    nodes: grafanaFrame({ h: 330, crumbs: ['Home'], nav: true, navActive: 'none', children: [
      btn(FW - 16 - 120 - 8 - 90, 12, 90, 'New', 'secondary', 'plus'),
      lbl(244, 100, 'Good morning.', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 130, 'Welcome to Grafana Enterprise.', { tone: 'textMuted', box: 400 }),
      ...m.nodes, ...m2.nodes,
      ...mark({ x: 770, y: 44, w: 200, h: m.h + 4 + m2.h }, 8),
    ] }),
  });
}

// 05: the Dashboards page with the folder expanded (steps 9 to 11)
{
  const folder = { x: 244, y: 326, w: 800, h: 30 };
  const dash = { x: 244, y: 356, w: 800, h: 30 };
  figures.push({
    id: '05-dashboards-page',
    alt: 'Dashboards page of Grafana 13.3: callout 9 marks the Dashboards item of the navigation, callout 10 marks the folder bookshelf and callout 11 marks the dashboard Bookshelf service health listed under it',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Dashboards'], nav: true, children: [
      lbl(244, 112, 'Dashboards', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 140, 'Create and manage dashboards to visualize your data', { tone: 'textMuted', box: 520 }),
      btn(722, 70, 150, 'Recently deleted'), btn(880, 70, 92, 'New', 'primary', 'chevronDown'),
      { block: 'field', x: 244, y: 176, w: 420, placeholder: 'Search for dashboards and folders' },
      { block: 'table', x: 244, y: 236, w: 800, columns: [{ title: 'Name', w: 1 }], rows: [['Shared with me'], ['My team folders'], ['bookshelf'], ['      Bookshelf service health']] },
      ...marks([[NAV.dashboards, 9], [folder, 10], [dash, 11]]),
    ] }),
  });
}

// 06: the provisioned dashboard (step 12)
{
  const d = bookshelfDashboard();
  figures.push({
    id: '06-bookshelf-dashboard',
    alt: 'Dashboard Bookshelf service health in Grafana 13.3 with the variables Job, Application and Route and the toggle Deployments on the left, the toolbar with the time range, Refresh, interval, Share and Edit on the right, and the rows Golden signals, Logs and traces and Dependencies; callout 12 marks the variables',
    width: FW, height: 380,
    nodes: grafanaFrame({ h: 380, crumbs: ['Dashboards', 'bookshelf', 'Bookshelf service health'], children: [
      ...d.nodes,
      ...mark({ x: 16, y: 58, w: 360, h: 32 }, 12),
    ] }),
  });
}

// 07: the time range button (steps 13 and 14)
{
  const d = bookshelfDashboard();
  figures.push({
    id: '07-time-range',
    alt: 'Toolbar of the dashboard Bookshelf service health: the time range button Last 6 hours UTC is marked by callout 13',
    width: FW, height: 380,
    nodes: grafanaFrame({ h: 380, crumbs: ['Dashboards', 'bookshelf', 'Bookshelf service health'], children: [
      ...d.nodes,
      ...marks([[d.geo.time, 13]]),
    ] }),
  });
}

// 08: Refresh and the interval select (steps 15 and 16)
{
  const d = bookshelfDashboard();
  figures.push({
    id: '08-refresh',
    alt: 'Toolbar of the dashboard Bookshelf service health: the Refresh button is marked by callout 15 and the interval select next to it, which shows 30s, is marked by callout 16',
    width: FW, height: 380,
    nodes: grafanaFrame({ h: 380, crumbs: ['Dashboards', 'bookshelf', 'Bookshelf service health'], children: [
      ...d.nodes,
      { block: 'highlight', ...d.geo.refresh }, { block: 'callout', x: d.geo.refresh.x - 4, y: d.geo.refresh.y - 3, num: 15 },
      ...mark(d.geo.interval, 16),
    ] }),
  });
}

// 09: the Dashboards page with the New menu open (steps 17 to 19)
{
  const m = menu({ x: 868, y: 120, w: 192, heading: 'Dashboard', items: ['New dashboard', 'Import dashboard', 'New folder'], hot: 2 });
  figures.push({
    id: '09-new-folder-menu',
    alt: 'Dashboards page of Grafana 13.3 with the New menu open: callout 17 marks the Dashboards item of the navigation, callout 18 marks the New button and callout 19 marks New folder in the menu',
    width: FW, height: 400,
    nodes: grafanaFrame({ h: 400, crumbs: ['Dashboards'], nav: true, children: [
      lbl(244, 112, 'Dashboards', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 140, 'Create and manage dashboards to visualize your data', { tone: 'textMuted', box: 520 }),
      btn(722, 70, 150, 'Recently deleted'), btn(880, 70, 92, 'New', 'primary', 'chevronDown'),
      { block: 'field', x: 244, y: 176, w: 420, placeholder: 'Search for dashboards and folders' },
      { block: 'table', x: 244, y: 236, w: 600, columns: [{ title: 'Name', w: 1 }], rows: [['Shared with me'], ['My team folders'], ['bookshelf']] },
      ...m.nodes,
      ...marks([[NAV.dashboards, 17], [{ x: 880, y: 70, w: 92, h: 32 }, 18], [m.rows[2], 19]]),
    ] }),
  });
}

// 10: the New folder drawer (steps 20 and 21)
{
  const dx = 700, dw = FW - dx, fx = dx + 24, fw = dw - 48;
  figures.push({
    id: '10-new-folder-drawer',
    alt: 'New folder drawer of Grafana 13.3: the Folder name field holds Guides (callout 20) and the Create button is marked by callout 21',
    width: FW, height: 400,
    nodes: grafanaFrame({ h: 400, crumbs: ['Dashboards'], children: [
      lbl(16, 112, 'Dashboards', { size: 'heading', weight: 500, box: 400 }),
      { block: 'flyout', x: dx, y: 48, w: dw, h: 352, title: 'New folder' },
      { block: 'field', x: fx, y: 100, w: fw, label: 'Folder name', value: 'Guides', focused: true },
      btn(fx, 330, 76, 'Create', 'primary'), btn(fx + 88, 330, 84, 'Cancel'),
      ...marks([[{ x: fx, y: 120, w: fw, h: 32 }, 20], [{ x: fx, y: 330, w: 76, h: 32 }, 21]]),
    ] }),
  });
}

// 11: the folder page (What you build; step 22 reads it)
{
  figures.push({
    id: '11-result',
    alt: 'The new folder page Guides in Grafana 13.3: the title Guides, the tabs Dashboards, Panels and Alert rules, and the empty state This folder does not have any dashboards yet with a Create dashboard button',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Dashboards', 'Guides'], nav: true, children: [
      lbl(244, 104, 'Guides', { size: 'heading', weight: 500, box: 300 }), ico(340, 90, 'edit'),
      btn(660, 70, 150, 'Recently deleted'), btn(818, 70, 140, 'Folder actions', 'secondary', 'chevronDown'), btn(966, 70, 90, 'New', 'primary', 'chevronDown'),
      { block: 'tabs', x: 244, y: 130, w: 420, tabs: ['Dashboards', 'Panels 0', 'Alert rules 0'], active: 0 },
      lbl(650, 250, "This folder doesn't have any dashboards yet", { weight: 500, anchor: 'middle', box: 420 }),
      lbl(650, 278, 'Add/move dashboards to your folder at Browse dashboards', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 420 }),
      btn(560, 310, 180, 'Create dashboard', 'primary', 'plus'),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g1', figures };
