// Figures of the Kibana guide K1, "First steps in Kibana" (guide-first-steps.adoc).
// Facts: guides-brief/kibana-facts.md sections 0 (sign-in, welcome, Home), 1 (shell layout, navigation) and 2 (sample data,
// the [Logs] Web Traffic dashboard), Kibana 9.5.6. NOT VERIFIED there (drawn generically, no label invented): the global
// search results list (grey placeholder rows), the time picker popover (only its entries Last 15 minutes, Last 24 hours and
// Last 7 days are named, all three are range labels seen in Kibana 9.5) and the Spaces menu, which the guide never opens.
// A figure shows the screen the step starts from with the control to act on highlighted; callout numbers are step numbers.
import { textWidth } from '../lib/text.mjs';
import { FW, lbl, box, btn, ico, rule, mark, marks, menu, kibanaFrame } from '../lib/shells.mjs';

const figures = [];

// ---- shared pieces --------------------------------------------------------------------------------------------------
const AVATAR = { x: 46, y: 56, w: 32, h: 32 };

// Home ("Welcome home"): four solution cards and the "Get started by adding integrations" row.
function home(extra = () => []) {
  const fr = kibanaFrame({ h: 440, crumbs: [] });
  const g = { ...fr.geo, avatar: AVATAR };
  const n = [lbl(16, 148, 'Welcome home', { size: 'heading', weight: 700, tone: 'textStrong', box: 500 })];
  ['Elasticsearch', 'Observability', 'Security', 'Analytics'].forEach((t, i) => {
    const x = 16 + i * 266;
    n.push(box(x, 176, 250, 96, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(x + 16, 214, t, { size: 'title', weight: 700, box: 218 }));
    n.push(box(x + 16, 236, 170, 10, { fill: 'surfaceRaised', radius: 4 }));
  });
  n.push(lbl(16, 316, 'Get started by adding integrations', { size: 'title', weight: 600, box: 500 }));
  g.addIntegrations = { x: 16, y: 332, w: 150, h: 32 };
  g.trySample = { x: 174, y: 332, w: 150, h: 32 };
  g.upload = { x: 332, y: 332, w: 150, h: 32 };
  n.push(btn(16, 332, 150, 'Add integrations', 'primary'), btn(174, 332, 150, 'Try sample data'), btn(332, 332, 150, 'Upload a file'));
  fr.nodes[0].children.push(...n, ...extra(g));
  return fr.nodes;
}

// The three sample data cards (order of the page: eCommerce, flight, web logs).
const CARD = [
  { t: 'Sample eCommerce orders', d: ['Sample data, visualizations, and dashboards', 'for tracking eCommerce orders.'] },
  { t: 'Sample flight data', d: ['Sample data, visualizations, and dashboards', 'for monitoring flight routes.'] },
  { t: 'Sample web logs', d: ['Sample data, visualizations, and dashboards', 'for monitoring web logs.'] },
];
function sampleData({ installed = [], menuOn, extra = () => [] }) {
  const fr = kibanaFrame({ h: menuOn === undefined ? 440 : 620, crumbs: ['Home'] });
  const n = [
    lbl(16, 140, 'Add data', { size: 'heading', weight: 700, tone: 'textStrong', box: 400 }),
    lbl(16, 164, 'Try our sample data or upload your own data.', { tone: 'textMuted', box: 600 }),
    { block: 'tabs', x: 16, y: 178, w: 300, tabs: ['Upload file', 'Sample data'], active: 1 },
  ];
  const g = { install: [], badge: [], view: [] };
  CARD.forEach((c, i) => {
    const x = 16 + i * 356, y = 232;
    n.push(box(x, y, 340, 176, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(x + 16, y + 30, c.t, { size: 'title', weight: 700, box: 308 }));
    n.push(lbl(x + 16, y + 56, c.d[0], { size: 'small', tone: 'textMuted', box: 308 }), lbl(x + 16, y + 74, c.d[1], { size: 'small', tone: 'textMuted', box: 308 }));
    if (installed.includes(i)) {
      n.push({ block: 'pill', x: x + 16, y: y + 100, str: 'INSTALLED', state: 'normal' });
      g.badge[i] = { x: x + 16, y: y + 100, w: 82, h: 20 };
      n.push(btn(x + 16, y + 132, 90, 'Remove'), btn(x + 114, y + 132, 110, 'View data', 'secondary', 'chevronDown'));
      g.view[i] = { x: x + 114, y: y + 132, w: 110, h: 32 };
    } else {
      n.push(btn(x + 16, y + 112, 130, 'Install data', 'primary'));
      g.install[i] = { x: x + 16, y: y + 112, w: 130, h: 32 };
    }
  });
  n.push(lbl(16, 432, 'Explore our live demo environment', { size: 'small', tone: 'textMuted', box: 400 }));
  if (menuOn !== undefined) {
    const mx = g.view[menuOn].x, my = g.view[menuOn].y + 36;
    g.menu = menu({ x: mx, y: my, w: 190, items: ['Discover', 'Dashboard', 'Map', 'Agent Builder', 'Graph', 'ML jobs'], hot: 1 });
    n.push(...g.menu.nodes);
  }
  fr.nodes[0].children.push(...n, ...extra(g));
  return { nodes: fr.nodes, g };
}

// The sample dashboard [Logs] Web Traffic in view mode, with its filter row. `time` is the picker text.
function logsDash({ time = 'Last 7 days (rounded)', popover = false, extra = () => [] }) {
  const crumbs = ['Dashboards', '[Logs] Web Traffic'];
  const fr = kibanaFrame({ h: 520, crumbs, actions: [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }] });
  const g = { ...fr.geo };
  const cw = [Math.ceil(textWidth('Dashboards', 12)) + 18, Math.ceil(textWidth('[Logs] Web Traffic', 12)) + 18];
  g.crumbs = { x: 92, y: 58, w: cw[0] + 6 + cw[1], h: 28 };
  const n = [];
  // filter row: + , query, time, Previous, Zoom out, Next, Refresh
  n.push(btn(16, 104, 36, '+'));
  const q = { x: 60, y: 104, w: 1064 - 60 - 8 - 100 - 8 - 3 * 44 - 8 - 190 - 8 - 20, h: 32 };
  n.push({ block: 'field', x: q.x, y: q.y, w: q.w, placeholder: 'Filter your data using KQL syntax' });
  let cx = q.x + q.w + 8;
  g.time = { x: cx, y: 104, w: 190, h: 32 };
  n.push(btn(cx, 104, 190, time, 'secondary', 'clock')); cx += 198;
  g.previous = { x: cx, y: 104, w: 36, h: 32 }; n.push(btn(cx, 104, 36, '<')); cx += 44;
  g.zoom = { x: cx, y: 104, w: 36, h: 32 }; n.push(btn(cx, 104, 36, '-')); cx += 44;
  g.next = { x: cx, y: 104, w: 36, h: 32 }; n.push(btn(cx, 104, 36, '>')); cx += 44;
  g.refresh = { x: cx, y: 104, w: 100, h: 32 }; n.push(btn(cx, 104, 100, 'Refresh', 'secondary', 'refresh'));
  // control bar
  [['Source Country', 16], ['OS', 232], ['Bytes', 448]].forEach(([t, x]) => n.push({ block: 'dropdown', x, y: 150, w: 208, value: t }));
  // panels
  n.push({ block: 'panel', x: 16, y: 196, w: 280, h: 100, title: 'Sample Logs Data' });
  n.push(box(28, 236, 240, 10, { fill: 'surfaceRaised', radius: 4 }), box(28, 258, 190, 10, { fill: 'surfaceRaised', radius: 4 }));
  n.push({ block: 'stat', x: 304, y: 196, w: 200, h: 100, title: 'Visits', value: '1,672' });
  n.push({ block: 'stat', x: 512, y: 196, w: 200, h: 100, title: 'Unique Visitors', value: '821', color: 'threshold.yellow' });
  n.push({ block: 'stat', x: 720, y: 196, w: 168, h: 100, title: 'HTTP 4xx (%)', value: '4.70', unit: '%' });
  n.push({ block: 'stat', x: 896, y: 196, w: 168, h: 100, title: 'HTTP 5xx (%)', value: '3.00', unit: '%', color: 'threshold.red' });
  n.push({ block: 'panel', x: 16, y: 312, w: 640, h: 190, title: '[Logs] Response Codes Over Time + Annotations' });
  n.push({ block: 'line', x: 28, y: 340, w: 616, h: 156, area: true, min: 0, max: 100, yLabels: ['0', '50', '100'], xLabels: ['Nov 5', 'Nov 7', 'Nov 9', 'Nov 11'], series: [
    { name: '200', points: [62, 70, 58, 74, 66, 72, 64, 69, 61], color: 'series.0' },
    { name: '404', points: [8, 10, 7, 12, 9, 11, 8, 10, 9], color: 'series.2' },
    { name: '503', points: [4, 5, 3, 6, 4, 5, 3, 4, 5], color: 'series.6' },
  ] });
  n.push({ block: 'panel', x: 664, y: 312, w: 400, h: 190, title: '[Logs] Total Requests and Bytes' });
  n.push({ block: 'bar', x: 676, y: 340, w: 376, h: 156, categories: ['Mon', 'Tue', 'Wed', 'Thu'], series: [{ name: 'Requests', values: [88, 96, 81, 92], color: 'series.0' }], max: 120, legend: false });
  if (popover) {
    g.pop = menu({ x: g.time.x, y: g.time.y + 36, w: 190, items: ['Last 15 minutes', 'Last 24 hours', 'Last 7 days'], hot: 1 });
    n.push(...g.pop.nodes);
  }
  fr.nodes[0].children.push(...n, ...extra(g));
  return fr.nodes;
}

// ---- 01: sign-in (steps 3 to 5) ---------------------------------------------------------------------------------------
{
  const fx = 358, fw = 364;
  const user = { x: fx, y: 214, w: fw, h: 40 }, pass = { x: fx, y: 282, w: fw, h: 40 }, login = { x: fx, y: 346, w: fw, h: 40 };
  const nodes = [{ block: 'window', x: 0, y: 0, w: FW, h: 480, radius: 0, children: [
    { block: 'logo', x: 520, y: 40, size: 40, key: 'si:elastic' },
    lbl(540, 120, 'Welcome to Elastic', { size: 'heading', weight: 700, tone: 'textStrong', anchor: 'middle', box: 500 }),
    lbl(fx, 200, 'Username', { size: 'small', weight: 500, box: 200 }),
    box(user.x, user.y, fw, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }), lbl(fx + 12, 239, 'elastic', { box: 300 }),
    lbl(fx, 268, 'Password', { size: 'small', weight: 500, box: 200 }),
    box(pass.x, pass.y, fw, 40, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }), lbl(fx + 12, 307, '••••••••••••••••••••', { box: 300 }),
    box(login.x, login.y, fw, 40, { fill: 'primary', radius: 4 }), lbl(540, 371, 'Log in', { weight: 600, tone: 'textOnPrimary', anchor: 'middle', box: 200 }),
    ...marks([[user, 3], [pass, 4], [login, 5]]),
  ] }];
  figures.push({
    id: '01-sign-in',
    alt: 'Kibana sign-in page titled Welcome to Elastic with the Username field holding elastic (callout 3), the Password field filled (callout 4) and the blue Log in button (callout 5)',
    width: FW, height: 480, nodes,
  });
}

// ---- 02: full-screen welcome (step 6) --------------------------------------------------------------------------------
{
  const explore = { x: 516, y: 282, w: 170, h: 32 };
  const nodes = [{ block: 'window', x: 0, y: 0, w: FW, h: 440, radius: 0, children: [
    { block: 'logo', x: 520, y: 36, size: 40, key: 'si:elastic' },
    lbl(540, 112, 'Welcome to Elastic', { size: 'heading', weight: 700, tone: 'textStrong', anchor: 'middle', box: 500 }),
    box(290, 140, 500, 190, { fill: 'surface', stroke: 'border', radius: 8 }),
    lbl(540, 190, 'Start by adding integrations', { size: 'title', weight: 700, anchor: 'middle', box: 440 }),
    btn(350, 282, 150, 'Add integrations', 'primary'), btn(explore.x, explore.y, explore.w, 'Explore on my own'),
    lbl(540, 380, 'Usage collection is enabled.', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 480 }),
    ...mark(explore, 6),
  ] }];
  figures.push({
    id: '02-welcome',
    alt: 'Full-screen welcome of Kibana 9.5 after the first sign-in, a card Start by adding integrations with the buttons Add integrations and Explore on my own; Explore on my own is marked by callout 6',
    width: FW, height: 440, nodes,
  });
}

// ---- 03: Home, the space avatar and the menu button (steps 7 and 8) -------------------------------------------------
figures.push({
  id: '03-home',
  alt: 'Kibana Home titled Welcome home with four solution cards; callout 7 marks the green space avatar D of the second bar and callout 8 marks the menu button Toggle primary navigation',
  width: FW, height: 440, nodes: home((g) => marks([[g.avatar, 7], [g.menu, 8]])),
});

// ---- 04: the primary navigation (steps 9 and 10) ---------------------------------------------------------------------
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Home'] });
  const items = [
    { label: 'Home', icon: 'home' }, { label: 'Analytics' }, { label: 'Discover', indent: 1 }, { label: 'Dashboards', indent: 1 },
    { label: 'Maps', indent: 1 }, { label: 'Machine Learning', indent: 1 }, { label: 'Graph', indent: 1 }, { label: 'Visualize library', indent: 1 },
    { label: 'Elasticsearch' }, { label: 'Observability' }, { label: 'Security' }, { label: 'Management' },
  ];
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 248, h: 424, items },
    ico(214, 110, 'close', 'textMuted'),
    ...marks([[{ x: 8, y: 142, w: 232, h: 7 * 34 - 6 }, 9], [{ x: 208, y: 104, w: 28, h: 28 }, 10]]),
  );
  figures.push({
    id: '04-primary-navigation',
    alt: 'Kibana 9.5 with the primary navigation open: callout 9 marks the Analytics section with Discover, Dashboards, Maps, Machine Learning, Graph and Visualize library, callout 10 marks the close button of the navigation',
    width: FW, height: 520, nodes: fr.nodes,
  });
}

// ---- 05: global search (steps 11 and 12) -----------------------------------------------------------------------------
{
  const fr = kibanaFrame({ h: 360, crumbs: ['Home'] });
  const sb = { x: 340, y: 8, w: 400, h: 32 };
  fr.nodes[0].children.push(
    { block: 'field', x: sb.x, y: sb.y, w: sb.w, value: 'dashboards', focused: true },
    box(340, 46, 400, 140, { fill: 'surface', stroke: 'borderStrong', radius: 6 }),
    box(348, 54, 384, 34, { fill: 'navActiveBg', radius: 4 }), lbl(360, 76, 'Dashboards', { weight: 500, box: 300 }),
    box(360, 106, 280, 10, { fill: 'surfaceRaised', radius: 4 }), box(360, 136, 220, 10, { fill: 'surfaceRaised', radius: 4 }), box(360, 166, 250, 10, { fill: 'surfaceRaised', radius: 4 }),
    lbl(16, 230, 'Press Ctrl+/ (Cmd+/ on macOS) to jump to the box from anywhere in Kibana.', { size: 'small', tone: 'textMuted', box: 700 }),
    ...mark(sb, 11), { block: 'callout', x: sb.x + 14, y: sb.y + sb.h + 14, num: 12 },
  );
  figures.push({
    id: '05-global-search',
    alt: 'Kibana 9.5 first bar with the global search box Find apps, content, and more. clicked (callout 11) and the text dashboards typed into it (callout 12); a list of matching apps and content is open under the box',
    width: FW, height: 360, nodes: fr.nodes,
  });
}

// ---- 06: Home, Try sample data (step 14) -------------------------------------------------------------------------------
figures.push({
  id: '06-try-sample-data',
  alt: 'Kibana Home with the row Get started by adding integrations and its buttons Add integrations, Try sample data and Upload a file; Try sample data is marked by callout 14',
  width: FW, height: 440, nodes: home((g) => mark(g.trySample, 14)),
});

// ---- 07: sample data cards before the install (steps 15 to 17) ---------------------------------------------------------
{
  const s = sampleData({ extra: (g) => marks([[g.install[2], 15], [g.install[0], 17]]) });
  figures.push({
    id: '07-install-data',
    alt: 'Add data page of Kibana with the tab Sample data and three cards, Sample eCommerce orders, Sample flight data and Sample web logs, each with an Install data button; the button of Sample web logs is marked by callout 15 and the one of Sample eCommerce orders by callout 17',
    width: FW, height: 440, nodes: s.nodes,
  });
}

// ---- 08: both installed (step 18) --------------------------------------------------------------------------------------
{
  const s = sampleData({ installed: [0, 2], extra: (g) => marks([[g.badge[0], 18], [g.badge[2], 18]]) });
  figures.push({
    id: '08-installed',
    alt: 'Add data page after the installs: the cards Sample eCommerce orders and Sample web logs show the INSTALLED badge with Remove and View data buttons, the badges are marked by callout 18',
    width: FW, height: 440, nodes: s.nodes,
  });
}

// ---- 09: View data menu (steps 19 and 20) ------------------------------------------------------------------------------
{
  const s = sampleData({ installed: [0, 2], menuOn: 2, extra: (g) => marks([[g.view[2], 19], [g.menu.rows[1], 20]]) });
  figures.push({
    id: '09-view-data-menu',
    alt: 'Sample web logs card with the View data menu open, listing Discover, Dashboard, Map, Agent Builder, Graph and ML jobs; callout 19 marks the View data button and callout 20 marks the entry Dashboard',
    width: FW, height: 620, nodes: s.nodes,
  });
}

// ---- 10: the sample dashboard (step 21) -------------------------------------------------------------------------------
figures.push({
  id: '10-web-traffic-dashboard',
  alt: 'The sample dashboard [Logs] Web Traffic of Kibana 9.5 in view mode with the controls Source Country, OS and Bytes, the tiles Visits and Unique Visitors and two charts; callout 21 marks the breadcrumb Dashboards and [Logs] Web Traffic',
  width: FW, height: 520, nodes: logsDash({ extra: (g) => mark(g.crumbs, 21) }),
});

// ---- 11: time picker (steps 22 and 23) ---------------------------------------------------------------------------------
figures.push({
  id: '11-time-picker',
  alt: 'Dashboard [Logs] Web Traffic with the time picker open under the button Last 7 days (rounded) and listing ranges; callout 22 marks the time picker and callout 23 marks the entry Last 24 hours',
  width: FW, height: 520, nodes: logsDash({ popover: true, extra: (g) => marks([[g.time, 22], [g.pop.rows[1], 23]]) }),
});

// ---- 12: Previous and Refresh (steps 24 and 25) ------------------------------------------------------------------------
figures.push({
  id: '12-previous-refresh',
  alt: 'Dashboard [Logs] Web Traffic with the time picker showing Last 24 hours; callout 24 marks the Previous button and callout 25 marks the Refresh button of the filter row',
  width: FW, height: 520, nodes: logsDash({ time: 'Last 24 hours', extra: (g) => marks([[g.previous, 24], [g.refresh, 25]]) }),
});

// ---- 13: the finished result (What you build) ---------------------------------------------------------------------------
figures.push({
  id: '13-result',
  alt: 'Result: the sample dashboard [Logs] Web Traffic open in Kibana 9.5 with the time picker set to Last 24 hours, the tiles Visits and Unique Visitors and the response codes chart',
  width: FW, height: 520, nodes: logsDash({ time: 'Last 24 hours' }),
});

void rule;
export default { product: 'kibana', guide: 'k1', figures };
