// Figures of the Grafana guide G17, "Send notifications" (guide-send-notifications.adoc).
// Facts: guides-brief/grafana-facts.md section 11 (Grafana 13.3.0) and section 10 (webhook payload and timings). A figure
// shows the screen the step starts from, with the control to act on highlighted; a typing step shows the typed value.
// Callout numbers are the step numbers of the page. Colours are theme tokens only.
// NOT VERIFIED in the lab, so drawn generically (values only, or with plain words taken from verified summary texts): the
// Templates list, the child-route form (Add route), the routing choice of the rule form and the Preview routing control.
import { FW, lbl, box, btn, ico, mark, marks, grafanaFrame } from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const NW = 264; // wider navigation so that "Notification configuration" fits
const NAV_BASE = [['Bookmarks', 'star'], ['Starred', 'star'], ['Dashboards', 'dashboard'], ['Explore', 'explore'], ['Drilldown', 'search'], ['AI', 'apps'], ['Alerting', 'bell'], ['Connections', 'database'], ['Administration', 'gear']];

// The Grafana window with the docked navigation and one group open. `children` may be a function of the nav row boxes.
function navFrame({ h, crumbs, open, kids = [], active, children = [] }) {
  const items = [];
  const rows = {};
  let i = 0;
  for (const [label, icon] of NAV_BASE) {
    rows[label] = { x: 8, y: 48 + i * 34, w: NW - 16, h: 32 };
    i += 1;
    items.push({ label, icon, ...(label === open ? { chevron: 'down' } : {}) });
    if (label === open) {
      for (const k of kids) { rows[k] = { x: 8, y: 48 + i * 34, w: NW - 16, h: 32 }; i += 1; items.push({ label: k, indent: 1 }); }
    }
  }
  const body = typeof children === 'function' ? children(rows) : children;
  return [{ block: 'window', x: 0, y: 0, w: FW, h, radius: 0, children: [
    { block: 'nav', x: 0, y: 0, w: NW, h, logo: 'si:grafana', title: 'Grafana', items, active },
    { block: 'toolbar', x: NW, y: 0, w: FW - NW, crumbs },
    ...body,
  ] }];
}
const ALERTING_KIDS = ['Alert rules', 'Notification configuration', 'Silences', 'Active notifications', 'History', 'Settings'];

// The boxes of the tabs of a tab bar.
function tabBoxes(x, y, tabs, active) {
  let cx = x;
  return tabs.map((t, i) => {
    const w = Math.ceil(textWidth(t, 14, { weight: i === active ? 500 : 400 })) + 24;
    const b = { x: cx, y, w, h: 32 };
    cx += w;
    return b;
  });
}
const TABS = ['Contact points', 'Notification policies', 'Templates', 'Time intervals'];
const head = (x, title, sub, subBox = 700) => [lbl(x, 104, title, { size: 'heading', weight: 500, box: 560 }), lbl(x, 132, sub, { tone: 'textMuted', box: subBox })];
const SUB = 'Manage contact points, notification policies, templates, and time intervals';

// A listing area in the style of a terminal: the command above, JSON or text lines inside.
function term({ x = 16, y, w = 1048, command, lines }) {
  const h = 14 + lines.length * 20 + 8;
  return {
    nodes: [{ block: 'queryEditor', x, y, w, h, lines, lineNumbers: false, label: command }],
    h,
    line: (i, ww) => ({ x: x + 6, y: y + 8 + i * 20, w: ww ?? w - 12, h: 20 }),
  };
}
const key = (k, v, vk = 'string', tail = ',', pad = '') => [{ t: `${pad}"${k}"`, kind: 'label' }, { t: ': ' }, { t: v, kind: vk }, { t: tail }];

const figures = [];

// 01: Alerting > Notification configuration, the Contact points tab and New contact point (steps 1 and 2)
{
  let newBtn;
  figures.push({
    id: '01-contact-points',
    alt: 'Notification configuration page of Grafana 13.3 with the Alerting group of the navigation open, listing Alert rules, Notification configuration, Silences, Active notifications, History and Settings: callout 1 marks Notification configuration, and callout 2 marks the New contact point button of the Contact points tab, which lists the provisioned bookshelf-webhook and the unused empty',
    width: FW, height: 600,
    nodes: navFrame({ h: 600, crumbs: ['Alerting', 'Notification configuration'], open: 'Alerting', kids: ALERTING_KIDS, active: 'Notification configuration', children: (rows) => {
      const x = NW + 16, w = FW - x - 16;
      newBtn = { x: FW - 16 - 110 - 8 - 170, y: 196, w: 170, h: 32 };
      const card = (y, name, used, badge, action, detail) => [
        box(x, y, w, 92, { fill: 'surface', stroke: 'border', radius: 6 }),
        lbl(x + 16, y + 28, name, { weight: 500, box: 220 }),
        ...(badge ? [{ block: 'chip', x: x + 190, y: y + 12, str: 'Provisioned' }] : []),
        lbl(x + 16, y + 52, used, { size: 'small', tone: 'textMuted', box: 300 }),
        lbl(x + 16, y + 74, detail, { size: 'small', tone: 'textMuted', box: 480 }),
        btn(x + w - 16 - 70, y + 30, 70, action),
      ];
      return [
        ...head(x, 'Notification configuration', SUB),
        { block: 'tabs', x, y: 148, w: 560, tabs: TABS, active: 0 },
        { block: 'field', x, y: 196, w: 260, placeholder: 'Search by name or type' },
        btn(newBtn.x, 196, 170, 'New contact point', 'primary', 'plus'), btn(FW - 16 - 110, 196, 110, 'Export all'),
        ...card(244, 'bookshelf-webhook', 'Used by 4 notification policies', true, 'View', 'Webhook · http://webhook-receiver:8080/grafana'),
        ...card(348, 'empty', 'Unused', false, 'Edit', 'No integrations configured'),
        ...marks([[rows['Notification configuration'], 1], [newBtn, 2]]),
      ];
    } }),
  });
}

// The Create contact point form; `marked` chooses the highlighted controls.
const CP = { name: { x: 16, y: 170, w: 480, h: 32 }, integration: { x: 32, y: 258, w: 300, h: 32 }, url: { x: 32, y: 326, w: 700, h: 32 }, test: { x: 806, y: 258, w: 70, h: 32 }, save: { x: 16, y: 476, w: 170, h: 32 } };
function contactForm(extra) {
  return grafanaFrame({ h: 540, crumbs: ['Alerting', 'Notification configuration', 'Create contact point'], children: [
    lbl(16, 104, 'Create contact point', { size: 'heading', weight: 500, box: 520 }),
    { block: 'field', x: 16, y: 150, w: 480, label: 'Name *', value: 'guide-webhook' },
    box(16, 224, 1048, 190, { fill: 'surface', stroke: 'border', radius: 6 }),
    { block: 'dropdown', x: 32, y: 238, w: 300, label: 'Integration', value: 'Webhook' },
    { block: 'field', x: 32, y: 306, w: 700, label: 'URL *', value: 'http://webhook-receiver:8080/guide' },
    btn(CP.test.x, 258, 70, 'Test'), btn(884, 258, 100, 'Duplicate'), btn(992, 258, 62, 'Delete', 'danger'),
    btn(16, 428, 270, 'Add contact point integration', 'secondary', 'plus'),
    btn(CP.save.x, CP.save.y, 170, 'Save contact point', 'primary'), btn(194, 476, 90, 'Cancel'),
    ...extra,
  ] });
}

// 02: name, integration and URL (steps 3 to 5)
figures.push({
  id: '02-contact-point-form',
  alt: 'Create contact point form: the field Name holds guide-webhook (callout 3), the Integration select shows Webhook (callout 4) and the field URL holds http://webhook-receiver:8080/guide (callout 5)',
  width: FW, height: 540,
  nodes: contactForm(marks([[CP.name, 3], [CP.integration, 4], [CP.url, 5]])),
});

// 03: Test and Save contact point (steps 6 and 7)
figures.push({
  id: '03-test-and-save',
  alt: 'Create contact point form filled in: the Test button at the right of the Webhook integration block is marked by callout 6 and the Save contact point button at the bottom is marked by callout 7',
  width: FW, height: 540,
  nodes: contactForm(marks([[CP.test, 6], [CP.save, 7]])),
});

// 04: the receiver lists the test notification (step 8)
{
  const t = term({ y: 64, command: 'curl localhost:8081/', lines: [
    [{ t: '[' }],
    [{ t: ' {' }],
    key('time', '"10:12:31"', 'string', ',', '  '),
    key('path', '"/guide"', 'string', ',', '  '),
    key('body', '"{\\"receiver\\":\\"guide-webhook\\", ... }"', 'string', '', '  '),
    [{ t: ' }' }],
    [{ t: ']' }],
  ] });
  figures.push({
    id: '04-receiver-test',
    alt: 'Terminal showing the answer of the webhook receiver at localhost:8081: one received request with a time, the path /guide, marked by callout 8, and a body whose receiver is guide-webhook',
    width: FW, height: t.h + 90,
    nodes: [{ block: 'window', x: 0, y: 0, w: FW, h: t.h + 90, radius: 0, title: 'Terminal', children: [...t.nodes, ...mark(t.line(3, 400), 8)] }],
  });
}

// 05: the Templates tab (step 9)
{
  const tb = tabBoxes(16, 148, TABS, 2);
  figures.push({
    id: '05-templates-tab',
    alt: 'Notification configuration page with the Templates tab selected, marked by callout 9; the list shows the provisioned template bookshelf',
    width: FW, height: 330,
    nodes: grafanaFrame({ h: 330, crumbs: ['Alerting', 'Notification configuration'], children: [
      ...head(16, 'Notification configuration', SUB),
      { block: 'tabs', x: 16, y: 148, w: 560, tabs: TABS, active: 2 },
      box(16, 204, 1048, 64, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 242, 'bookshelf', { weight: 500, box: 200 }), { block: 'chip', x: 140, y: 226, str: 'Provisioned' },
      ...mark(tb[2], 9),
    ] }),
  });
}

// 06: the template group editor (steps 10 to 13)
{
  const L = { name: { x: 16, y: 170, w: 400, h: 32 }, editor: { x: 28, y: 292, w: 616, h: 226 }, save: { x: 16, y: 548, w: 90, h: 32 } };
  const runs = (s) => [{ t: s }];
  figures.push({
    id: '06-template-editor',
    alt: 'New notification template group page: the field Template group name holds guide (callout 10), the Template group editor holds the definitions guide.title and guide.message (callout 11), the Refresh button of the Preview pane is marked by callout 12 and the Save button is marked by callout 13',
    width: FW, height: 600,
    nodes: grafanaFrame({ h: 600, crumbs: ['Alerting', 'Notification configuration', 'New notification template group'], children: [
      lbl(16, 104, 'New notification template group', { size: 'heading', weight: 500, box: 700 }),
      { block: 'field', x: 16, y: 150, w: 400, label: 'Template group name *', value: 'guide' },
      box(16, 232, 640, 300, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 262, 'Template group', { weight: 500, box: 200 }),
      btn(450, 240, 130, 'Add example'), btn(588, 240, 60, 'Help'),
      { block: 'queryEditor', ...L.editor, lineNumbers: true, lines: [
        runs('{{ define "guide.title" -}}'),
        runs('[{{ .Status | toUpper }}] {{ .CommonLabels.alertname }}'),
        runs('{{- end }}'),
        runs(''),
        runs('{{ define "guide.message" -}}'),
        runs('{{ range .Alerts -}}'),
        runs('{{ .Labels.alertname }}: {{ .Annotations.summary }}'),
        runs('{{ end -}}'),
        runs('{{- end }}'),
      ] },
      box(672, 232, 392, 120, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(688, 262, 'Payload', { weight: 500, box: 100 }), btn(836, 240, 108, 'Edit payload'), btn(952, 240, 100, 'Reference'),
      box(672, 366, 392, 166, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(688, 396, 'Preview', { weight: 500, box: 100 }), btn(972, 374, 84, 'Refresh'),
      lbl(688, 450, 'Add template content to see preview', { tone: 'textMuted', box: 360 }),
      btn(L.save.x, L.save.y, 90, 'Save', 'primary'), btn(114, 548, 90, 'Cancel'),
      ...marks([[L.name, 10], [L.editor, 11], [{ x: 972, y: 374, w: 84, h: 32 }, 12], [L.save, 13]]),
    ] }),
  });
}

// The Notification policies tab: toolbar and the provisioned tree. `tree` draws more below it.
function policiesTab({ h, extra = [], active = 1 }) {
  const geo = { newPolicy: { x: 844, y: 196, w: 220, h: 32 } };
  const tb = tabBoxes(16, 148, TABS, active);
  geo.tab = tb[1];
  return {
    geo,
    nodes: grafanaFrame({ h, crumbs: ['Alerting', 'Notification configuration'], children: [
      ...head(16, 'Notification configuration', SUB),
      { block: 'tabs', x: 16, y: 148, w: 560, tabs: TABS, active },
      { block: 'field', x: 16, y: 196, w: 250, placeholder: 'Search by matchers' },
      { block: 'dropdown', x: 274, y: 196, w: 160, value: 'Contact point' }, { block: 'dropdown', x: 442, y: 196, w: 120, value: 'Policy' },
      btn(570, 196, 120, 'Collapse all'), btn(844, 196, 220, 'New notification policy', 'primary', 'plus'),
      box(16, 244, 1048, 150, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 272, 'Default policy · 1 routes', { weight: 500, box: 240 }), { block: 'chip', x: 270, y: 256, str: 'Provisioned' },
      lbl(32, 298, 'bookshelf-webhook · grouped by alertname, grafana_folder', { size: 'small', tone: 'textMuted', box: 520 }),
      lbl(32, 320, 'Wait 30s to group instances · Wait 5m before sending updates · Repeated every 4h', { size: 'small', tone: 'textMuted', box: 640 }),
      lbl(56, 352, 'team = bookshelf-sre', { size: 'small', box: 220 }), { block: 'chip', x: 220, y: 337, str: 'Provisioned' },
      lbl(80, 376, 'severity = critical, severity = warning', { size: 'small', tone: 'textMuted', box: 400 }),
      ...extra,
    ] }),
  };
}

// 07: the Notification policies tab and New notification policy (steps 15 and 16)
{
  const p = policiesTab({ h: 440 });
  figures.push({
    id: '07-policies-tab',
    alt: 'Notification policies tab: callout 15 marks the tab, and callout 16 marks the New notification policy button above the provisioned tree Default policy with one route and the Provisioned badge on every row',
    width: FW, height: 440,
    nodes: p.nodes.concat(marks([[p.geo.tab, 15], [p.geo.newPolicy, 16]])),
  });
}

// 08: the New notification policy dialog (steps 17 to 19)
{
  const mx = 280, my = 70, mw = 520, mh = 440;
  const g = { name: { x: mx + 24, y: my + 90, w: mw - 48, h: 32 }, contact: { x: mx + 24, y: my + 196, w: 300, h: 32 }, create: { x: mx + mw - 24 - 90, y: my + mh - 56, w: 90, h: 32 } };
  figures.push({
    id: '08-new-policy-dialog',
    alt: 'New notification policy dialog: the field Name holds guide-tree (callout 17), the Default contact point select shows guide-webhook (callout 18), Group by keeps grafana_folder and alertname, and the Create button is marked by callout 19',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: ['Alerting', 'Notification configuration'], children: [
      box(mx, my, mw, mh, { fill: 'surface', stroke: 'borderStrong', radius: 8 }),
      lbl(mx + 24, my + 40, 'New notification policy', { size: 'title', weight: 600, box: 360 }),
      { block: 'field', x: mx + 24, y: my + 70, w: mw - 48, label: 'Name *', value: 'guide-tree', hint: 'A unique name for the routing tree' },
      { block: 'dropdown', x: mx + 24, y: my + 176, w: 300, label: 'Default contact point', value: 'guide-webhook' },
      lbl(mx + 344, my + 218, 'Create a contact point', { size: 'small', tone: 'link', box: 160 }),
      lbl(mx + 24, my + 262, 'Group by', { size: 'small', weight: 500, box: 120 }),
      box(mx + 24, my + 270, mw - 48, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }),
      { block: 'chip', x: mx + 34, y: my + 275, str: 'grafana_folder' }, { block: 'chip', x: mx + 140, y: my + 275, str: 'alertname' },
      ico(mx + 24, my + 328, 'chevronRight'), lbl(mx + 48, my + 341, 'Timing options', { weight: 500, box: 200 }),
      btn(mx + mw - 24 - 90 - 8 - 90, g.create.y, 90, 'Cancel'), btn(g.create.x, g.create.y, 90, 'Create', 'primary'),
      ...marks([[g.name, 17], [g.contact, 18], [g.create, 19]]),
    ] }),
  });
}

// 09: the new tree with its Add route control (step 20)
{
  const addRoute = { x: 944, y: 346, w: 112, h: 32 };
  const nodes = grafanaFrame({ h: 560, crumbs: ['Alerting', 'Notification configuration'], children: [
    ...head(16, 'Notification configuration', SUB),
    { block: 'tabs', x: 16, y: 148, w: 560, tabs: TABS, active: 1 },
    btn(844, 196, 220, 'New notification policy', 'primary', 'plus'),
    box(16, 244, 1048, 70, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(32, 272, 'Default policy · 1 routes', { weight: 500, box: 240 }), { block: 'chip', x: 270, y: 256, str: 'Provisioned' },
    lbl(32, 298, 'bookshelf-webhook · grouped by alertname, grafana_folder', { size: 'small', tone: 'textMuted', box: 520 }),
    box(16, 330, 1048, 100, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(32, 358, 'guide-tree', { weight: 500, box: 240 }),
    lbl(32, 384, 'guide-webhook · grouped by grafana_folder, alertname', { size: 'small', tone: 'textMuted', box: 520 }),
    lbl(32, 406, 'Wait 30s to group instances · Wait 5m before sending updates · Repeated every 4h', { size: 'small', tone: 'textMuted', box: 640 }),
    btn(addRoute.x, addRoute.y, 112, 'Add route', 'secondary', 'plus'),
    ...mark(addRoute, 20),
  ] });
  figures.push({
    id: '09-add-route',
    alt: 'Notification policies tab after Create: below the provisioned Default policy the new tree guide-tree has the default contact point guide-webhook and the default timings, and its Add route button is marked by callout 20',
    width: FW, height: 560,
    nodes,
  });
}

// 10: the route form (steps 21 to 25), labels read in Grafana 13.3.0
{
  const dx = 520, dw = FW - dx, fx = dx + 24;
  const g = {
    matcher: { x: fx, y: 130, w: 460, h: 32 }, contact: { x: fx, y: 204, w: 300, h: 32 }, group: { x: fx, y: 278, w: 300, h: 32 },
    timing: { x: fx, y: 352, w: 470, h: 32 }, save: { x: fx, y: 452, w: 110, h: 32 },
  };
  figures.push({
    id: '10-route-form',
    alt: 'Form of the new route of guide-tree, shown with its values: the matching label team = bookshelf-guides (callout 21), the contact point guide-webhook (callout 22), Override grouping on with the Group by label alertname (callout 23), Override general timings on with Group wait 10s, Group interval 1m and Repeat interval 1h (callout 24) and the Add route button (callout 25)',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: ['Alerting', 'Notification configuration'], children: [
      { block: 'panel', x: 16, y: 106, w: 480, h: 250, title: 'guide-tree' },
      lbl(32, 160, 'guide-webhook · grouped by grafana_folder, alertname', { size: 'small', tone: 'textMuted', box: 440 }),
      { block: 'flyout', x: dx, y: 48, w: dw, h: 472, title: 'Add route' },
      lbl(fx, 116, 'Matching labels', { size: 'small', weight: 500, box: 200 }),
      { block: 'field', x: fx, y: 130, w: 150, value: 'team' }, { block: 'field', x: fx + 160, y: 130, w: 60, value: '=' }, { block: 'field', x: fx + 230, y: 130, w: 230, value: 'bookshelf-guides' },
      lbl(fx, 190, 'Contact point', { size: 'small', weight: 500, box: 200 }),
      { block: 'dropdown', x: fx, y: 204, w: 300, value: 'guide-webhook' },
      lbl(fx, 264, 'Override grouping on · Group by', { size: 'small', weight: 500, box: 300 }),
      { block: 'field', x: fx, y: 278, w: 300, value: 'alertname' },
      lbl(fx, 338, 'Override general timings on · Group wait, Group interval, Repeat interval', { size: 'small', weight: 500, box: 520 }),
      { block: 'field', x: fx, y: 352, w: 140, value: '10s' }, { block: 'field', x: fx + 165, y: 352, w: 140, value: '1m' }, { block: 'field', x: fx + 330, y: 352, w: 140, value: '1h' },
      btn(fx, 452, 110, 'Add route', 'primary'), btn(fx + 118, 452, 90, 'Cancel'),
      ...marks([[g.matcher, 21], [g.contact, 22], [g.group, 23], [g.timing, 24], [g.save, 25]]),
    ] }),
  });
}

// 11: the rule page and its More menu (step 26)
{
  const more = { x: FW - 16 - 100, y: 76, w: 100, h: 32 };
  figures.push({
    id: '11-rule-more-menu',
    alt: 'Rule page of Guide high 5xx ratio with the state badge Firing and the tabs Query and conditions, Instances, History and Versions; the More button at the top right is marked by callout 26',
    width: FW, height: 300,
    nodes: grafanaFrame({ h: 300, crumbs: ['Alerting', 'Guides', 'guide-eval', 'Guide high 5xx ratio'], children: [
      lbl(16, 104, 'Guide high 5xx ratio', { size: 'heading', weight: 500, box: 420 }), { block: 'pill', x: 330, y: 86, str: 'Firing', state: 'firing' },
      btn(more.x, 76, 100, 'More', 'secondary', 'chevronDown'),
      lbl(16, 140, 'Notifications are delivered to guide-webhook · Evaluation interval Every 1m', { size: 'small', tone: 'textMuted', box: 640 }),
      { block: 'tabs', x: 16, y: 164, w: 640, tabs: ['Query and conditions', 'Instances (1)', 'History', 'Versions'], active: 0 },
      ...mark(more, 26),
    ] }),
  });
}

// 12: section 5 of the rule form (steps 27 to 30), read in Grafana 13.3.0
{
  const adv = { x: 16, y: 150, w: 170, h: 24 };
  const opt = { x: 16, y: 206, w: 300, h: 36 };
  const prev = { x: 16, y: 272, w: 1048, h: 96 };
  const save = { x: 16, y: 384, w: 90, h: 32 };
  figures.push({
    id: '12-rule-notifications',
    alt: 'Section 5 Configure notifications of the rule form: the toggle Advanced options is on (callout 27), the select of the notification policy tree shows guide-tree (callout 28), the Alert instance routing preview with its Preview routing button lists the delivery to guide-webhook for 1 instances (callout 29) and the Save button at the bottom is marked by callout 30',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Alerting', 'Alert rules', 'Guide high 5xx ratio', 'Edit rule'], children: [
      box(16, 70, 1048, 44, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(36, 98, '5', { weight: 600, box: 20 }), lbl(64, 98, 'Configure notifications', { weight: 500, box: 400 }),
      { block: 'toggle', x: adv.x, y: 154, label: 'Advanced options', on: true, box: 160 },
      { block: 'dropdown', x: opt.x, y: opt.y, w: opt.w, value: 'guide-tree' },
      lbl(340, 230, 'View policies', { size: 'small', tone: 'textMuted', box: 160 }),
      box(prev.x, prev.y, prev.w, prev.h, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 298, 'Alert instance routing preview', { weight: 500, box: 400 }),
      btn(900, 282, 150, 'Preview routing', 'secondary'),
      lbl(32, 340, 'Delivered to guide-webhook · webhook | 1 instances', { size: 'small', tone: 'textMuted', box: 520 }),
      btn(save.x, save.y, 90, 'Save', 'primary'), btn(114, save.y, 90, 'Cancel'),
      ...marks([[adv, 27], [opt, 28], [prev, 29], [save, 30]]),
    ] }),
  });
}

// 13: the receiver after the failure: firing and resolved deliveries on /guide (step 32)
{
  const t = term({ y: 64, command: "curl -s localhost:8081/ | jq -c '.[] | select(.path==\"/guide\") | [.time, (.body|fromjson|.status, .title)]'", lines: [
    [{ t: '["10:16:00","firing","[FIRING] Guide high 5xx ratio"]' }],
    [{ t: '["10:18:00","resolved","[RESOLVED] Guide high 5xx ratio"]' }],
  ] });
  figures.push({
    id: '13-receiver-firing',
    alt: 'Terminal showing the receiver filtered on the path /guide: a first line with the status firing and the title [FIRING] Guide high 5xx ratio, marked by callout 32, and a later line with the status resolved',
    width: FW, height: t.h + 90,
    nodes: [{ block: 'window', x: 0, y: 0, w: FW, h: t.h + 90, radius: 0, title: 'Terminal', children: [...t.nodes, ...mark(t.line(0, 440), 32)] }],
  });
}

// 14: the finished routing tree (What you build)
{
  figures.push({
    id: '14-result',
    alt: 'Notification policies tab at the end of the guide: below the provisioned Default policy, the tree guide-tree sends to guide-webhook and has the child route team = bookshelf-guides, grouped by alertname, with wait 10s, update 1m and repeat 1h',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: ['Alerting', 'Notification configuration'], children: [
      ...head(16, 'Notification configuration', SUB),
      { block: 'tabs', x: 16, y: 148, w: 560, tabs: TABS, active: 1 },
      btn(844, 196, 220, 'New notification policy', 'primary', 'plus'),
      box(16, 244, 1048, 58, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 270, 'Default policy · 1 routes', { weight: 500, box: 240 }), { block: 'chip', x: 270, y: 254, str: 'Provisioned' },
      box(16, 316, 1048, 124, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 344, 'guide-tree', { weight: 500, box: 240 }),
      lbl(32, 368, 'guide-webhook · grouped by grafana_folder, alertname', { size: 'small', tone: 'textMuted', box: 520 }),
      lbl(56, 396, 'team = bookshelf-guides', { size: 'small', weight: 500, box: 260 }),
      lbl(56, 418, 'guide-webhook · grouped by alertname · Wait 10s to group instances · Wait 1m before sending updates · Repeated every 1h', { size: 'small', tone: 'textMuted', box: 900 }),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g17', figures };
