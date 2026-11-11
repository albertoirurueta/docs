// Figures of the Grafana guide G16, "Create an alert rule" (guide-create-an-alert-rule.adoc).
// Facts: guides-brief/grafana-facts.md section 10 (alert rule form, rule detail, forced failure timeline) and section 11
// (contact point form), section 6 (panel editor, Alert tab after the first save). The form is drawn from the section
// legends of facts 10; the rule detail and instance table from the same section. The Recovering and No Data pills and
// the Alert tab of the panel editor were not opened in the lab (NOT VERIFIED) and are not drawn beyond what the facts say.
// Callout numbers are the step numbers of the page. Colours are theme tokens only.
import {
  FW, lbl, box, btn, ico, mark, marks, segmented, grafanaFrame, G_NAV_ROW, gEditor,
} from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const SEC = (y, n, title, sub) => [
  lbl(16, y + 22, `${n}  ${title}`, { size: 'title', weight: 600, box: 700 }),
  ...(sub ? [lbl(16, y + 42, sub, { size: 'small', tone: 'textMuted', box: 900 })] : []),
];
const form = (h, children, crumbs = ['Alerting', 'Alert rules', 'New alert rule']) => grafanaFrame({ h, crumbs, children });
const NEW_RULE = ['Alerting', 'Alert rules', 'New alert rule'];

// Box of tab number `i` of a tab strip drawn at (x, y) by the `tabs` block.
function tabBox(x0, y, labels, i, active) {
  let x = x0;
  labels.forEach((t, k) => { if (k < i) x += Math.ceil(textWidth(t, 14, { weight: k === active ? 500 : 400 })) + 24; });
  const w = Math.ceil(textWidth(labels[i], 14, { weight: i === active ? 500 : 400 })) + 24;
  return { x: x + 4, y, w: w - 8, h: 32 };
}

const figures = [];

// 01: Notification configuration, Contact points tab (steps 1 and 2)
{
  const nb = { x: 640, y: 214, w: 170, h: 32 };
  figures.push({
    id: '01-notification-configuration',
    alt: 'Notification configuration page of Grafana 13.3 on the Contact points tab: callout 1 marks the Alerting item of the navigation and callout 2 marks the New contact point button, next to the cards of the provisioned contact points',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Alerting', 'Notification configuration'], nav: true, navActive: 'Alerting', children: [
      lbl(244, 112, 'Notification configuration', { size: 'heading', weight: 500, box: 520 }),
      lbl(244, 140, 'Manage contact points, notification policies, templates, and time intervals', { tone: 'textMuted', box: 640 }),
      { block: 'tabs', x: 244, y: 160, w: 560, tabs: ['Contact points', 'Notification policies', 'Templates', 'Time intervals'], active: 0 },
      { block: 'field', x: 244, y: 214, w: 270, placeholder: 'Search by name or type' },
      btn(nb.x - 8 - 100, 214, 100, 'Export all'), btn(nb.x, nb.y, nb.w, 'New contact point', 'primary'),
      { block: 'table', x: 244, y: 266, w: 820, columns: [{ title: 'Contact point', w: 3 }, { title: 'Integration', w: 3 }, { title: 'Status', w: 3 }], rows: [['bookshelf-webhook', 'Webhook', 'Provisioned, used by 4 notification policies'], ['empty', 'No integrations configured', 'Unused']] },
      ...marks([[G_NAV_ROW.Alerting, 1], [nb, 2]]),
    ] }),
  });
}

// 02: the contact point form (steps 3 to 6)
{
  const nameB = { x: 16, y: 150, w: 520, h: 32 };
  const integB = { x: 16, y: 220, w: 300, h: 32 };
  const urlB = { x: 16, y: 290, w: 520, h: 32 };
  const saveB = { x: 16, y: 420, w: 170, h: 32 };
  figures.push({
    id: '02-contact-point-form',
    alt: 'Create contact point form: the Name field holds guide-webhook (callout 3), Integration is set to Webhook (callout 4), the URL field holds http://webhook-receiver:8080/guide (callout 5) and the Save contact point button is marked by callout 6',
    width: FW, height: 500,
    nodes: grafanaFrame({ h: 500, crumbs: ['Alerting', 'Notification configuration', 'Create contact point'], children: [
      lbl(16, 100, 'Create contact point', { size: 'heading', weight: 500, box: 500 }),
      { block: 'field', x: 16, y: 130, w: 520, label: 'Name *', value: 'guide-webhook' },
      { block: 'dropdown', x: 16, y: 200, w: 300, label: 'Integration', value: 'Webhook' },
      btn(520, 220, 70, 'Test'), btn(598, 220, 100, 'Duplicate'), btn(706, 220, 80, 'Delete'),
      { block: 'field', x: 16, y: 270, w: 520, label: 'URL *', value: 'http://webhook-receiver:8080/guide' },
      btn(16, 350, 250, 'Add contact point integration'),
      btn(saveB.x, saveB.y, saveB.w, 'Save contact point', 'primary'), btn(194, 420, 84, 'Cancel'),
      ...marks([[nameB, 3], [integB, 4], [urlB, 5], [saveB, 6]]),
    ] }),
  });
}

// 03: Alert rules list (steps 7 and 8)
{
  const nb = { x: 880, y: 70, w: 160, h: 32 };
  figures.push({
    id: '03-alert-rules',
    alt: 'Alert rules page of Grafana 13.3: callout 7 marks the Alerting item of the navigation and callout 8 marks the New alert rule button at the top right, above the list of the provisioned rules of the folder bookshelf',
    width: FW, height: 470,
    nodes: grafanaFrame({ h: 470, crumbs: ['Alerting', 'Alert rules'], nav: true, navActive: 'Alerting', children: [
      lbl(244, 112, 'Alert rules', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 140, 'Rules that determine whether an alert will fire', { tone: 'textMuted', box: 520 }),
      btn(nb.x - 8 - 90, 70, 90, 'More'), btn(nb.x, nb.y, nb.w, 'New alert rule', 'primary'),
      { block: 'tabs', x: 244, y: 160, w: 300, tabs: ['Alert rules', 'Recently deleted'], active: 0 },
      { block: 'field', x: 244, y: 214, w: 420, placeholder: 'Search by name or enter filter query...' },
      lbl(244, 290, 'Grafana-managed', { weight: 600, box: 300 }),
      ico(244, 306, 'folder'), lbl(268, 319, 'bookshelf', { weight: 500, box: 200 }),
      box(244, 334, 800, 34, { fill: 'surface', stroke: 'border', radius: 4 }), lbl(260, 356, 'bookshelf-availability-and-logs   1m', { size: 'small', tone: 'textMuted', box: 500 }),
      box(244, 374, 800, 34, { fill: 'surface', stroke: 'border', radius: 4 }), lbl(260, 396, 'bookshelf-service-level   1m', { size: 'small', tone: 'textMuted', box: 500 }),
      ...marks([[G_NAV_ROW.Alerting, 7], [nb, 8]]),
    ] }),
  });
}

// 04: section 1 and the query of section 2 (steps 9 to 12)
{
  const nameB = { x: 16, y: 146, w: 520, h: 32 };
  const dsB = { x: 16, y: 262, w: 240, h: 32 };
  const seg = segmented({ x: 908, y: 314, items: ['Builder', 'Code'], active: 1 });
  const edB = { x: 28, y: 404, w: 1024, h: 74 };
  figures.push({
    id: '04-name-and-query',
    alt: 'New alert rule form, sections 1 and 2: the Name field holds Guide high 5xx ratio (callout 9), the data source picker shows Prometheus (callout 10), the Code option of the Builder and Code switch is marked by callout 11 and the query editor holds the 5xx ratio query (callout 12)',
    width: FW, height: 560,
    nodes: form(560, [
      ...SEC(66, 1, 'Enter alert rule name', 'Enter a name to identify your alert rule.'),
      { block: 'field', x: 16, y: 126, w: 520, label: 'Name', value: 'Guide high 5xx ratio' },
      ...SEC(196, 2, 'Define query and alert condition'),
      { block: 'dropdown', x: 16, y: 262, w: 240, value: 'Prometheus' },
      box(16, 306, 1048, 232, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(28, 332, 'A (Prometheus)', { weight: 500, box: 200 }),
      btn(220, 314, 180, 'Kick start your query'),
      ...seg.nodes,
      btn(28, 360, 150, 'Metrics browser'), btn(924 - 8, 360, 120, 'Run queries', 'primary'),
      { block: 'queryEditor', x: edB.x, y: edB.y, w: edB.w, h: edB.h, lines: [
        '(sum(rate(http_server_requests_seconds_count{application="bookshelf",status=~"5.."}[1m])) /',
        'sum(rate(http_server_requests_seconds_count{application="bookshelf"}[1m]))) or vector(0)',
      ], lineNumbers: true },
      lbl(28, 504, 'Options', { size: 'small', tone: 'textMuted' }),
      lbl(90, 504, 'Legend: Auto | Format: Time series | Step: auto | Type: Instant', { size: 'small', tone: 'textMuted', box: 640 }),
      ...marks([[nameB, 9], [dsB, 10], [seg.boxes[1], 11], [edB, 12]]),
    ]),
  });
}

// 05: the alert condition (steps 13 and 14)
{
  const thr = { x: 330, y: 150, w: 90, h: 32 };
  const prev = { x: 16, y: 214, w: 270, h: 32 };
  figures.push({
    id: '05-alert-condition',
    alt: 'New alert rule form, lower part of section 2: the Alert condition reads WHEN QUERY IS ABOVE with the value 0.2 typed in the last field (callout 13), and the Preview alert rule condition button below is marked by callout 14',
    width: FW, height: 300,
    nodes: form(300, [
      lbl(16, 90, 'Options', { size: 'small', tone: 'textMuted' }),
      lbl(90, 90, 'Legend: Auto | Format: Time series | Step: auto | Type: Instant', { size: 'small', tone: 'textMuted', box: 640 }),
      lbl(16, 134, 'Alert condition', { weight: 600, box: 300 }),
      lbl(16, 172, 'WHEN', { weight: 600, box: 60 }),
      box(70, 150, 90, 32, { fill: 'surfaceRaised', stroke: 'border', radius: 6 }), lbl(115, 171, 'QUERY', { anchor: 'middle', weight: 500, box: 80 }),
      { block: 'dropdown', x: 172, y: 150, w: 148, value: 'IS ABOVE' },
      { block: 'field', x: thr.x, y: thr.y, w: thr.w, value: '0.2' },
      btn(prev.x, prev.y, prev.w, 'Preview alert rule condition'),
      ...marks([[thr, 13], [prev, 14]]),
    ]),
  });
}

// 06: section 3 (steps 15 and 16)
{
  const fol = { x: 16, y: 168, w: 300, h: 32 };
  const lab = { x: 16, y: 314, w: 130, h: 32 };
  figures.push({
    id: '06-folder-and-labels',
    alt: 'New alert rule form, section 3 Add folder and labels: the Folder picker shows Guides (callout 15) and the labels area says No labels selected, with the Add labels button marked by callout 16',
    width: FW, height: 400,
    nodes: form(400, [
      ...SEC(66, 3, 'Add folder and labels', 'Organize your alert rule with a folder and set of labels.'),
      lbl(16, 138, 'Folder', { weight: 500, box: 200 }),
      lbl(16, 158, 'Select a folder to store your rule in.', { size: 'small', tone: 'textMuted', box: 400 }),
      { block: 'dropdown', x: 16, y: 168, w: 300, value: 'Guides' },
      btn(330, 168, 110, 'New folder'),
      lbl(16, 244, 'Labels', { weight: 500, box: 200 }),
      lbl(16, 264, 'Add labels to your rule for searching, silencing, or routing to a notification policy.', { size: 'small', tone: 'textMuted', box: 700 }),
      lbl(16, 298, 'No labels selected', { tone: 'textMuted', box: 300 }),
      btn(lab.x, lab.y, lab.w, 'Add labels'),
      ...marks([[fol, 15], [lab, 16]]),
    ]),
  });
}

// 07: section 4 (steps 17 and 18)
{
  const grp = { x: 330, y: 158, w: 190, h: 32 };
  const pend = { x: 16, y: 256, w: 200, h: 32 };
  figures.push({
    id: '07-evaluation',
    alt: 'New alert rule form, section 4 Set evaluation behavior: the New evaluation group button is marked by callout 17 and the Pending period picker shows 1m (callout 18), above Keep firing for and the collapsed Configure no data and error handling',
    width: FW, height: 440,
    nodes: form(440, [
      ...SEC(66, 4, 'Set evaluation behavior'),
      lbl(16, 138, 'Evaluation group and interval', { weight: 500, box: 400 }),
      { block: 'dropdown', x: 16, y: 158, w: 300, value: 'Select an evaluation group...' },
      btn(grp.x, grp.y, grp.w, 'New evaluation group'),
      lbl(16, 244, 'Pending period', { weight: 500, box: 200 }),
      { block: 'dropdown', x: 16, y: 256, w: 200, value: '1m' },
      lbl(256, 244, 'Keep firing for', { weight: 500, box: 200 }),
      { block: 'dropdown', x: 256, y: 256, w: 200, value: 'None' },
      ico(16, 324, 'chevronRight'), lbl(40, 337, 'Configure no data and error handling', { weight: 500, box: 400 }),
      ...marks([[grp, 17], [pend, 18]]),
    ]),
  });
}

// 08: section 5 (step 19)
{
  const cp = { x: 16, y: 262, w: 300, h: 32 };
  figures.push({
    id: '08-notifications',
    alt: 'New alert rule form, section 5 Configure notifications: the Recipient shows Alertmanager:grafana and the Contact point picker shows guide-webhook (callout 19), with the link View or create contact points beside it',
    width: FW, height: 390,
    nodes: form(390, [
      ...SEC(66, 5, 'Configure notifications'),
      { block: 'toggle', x: 16, y: 118, label: 'Advanced options', on: false, box: 200 },
      lbl(16, 168, 'Recipient', { weight: 500, box: 200 }),
      lbl(16, 188, 'Notifications for firing alerts are routed to a selected contact point.', { size: 'small', tone: 'textMuted', box: 600 }),
      { block: 'dropdown', x: 16, y: 198, w: 220, value: 'Alertmanager:grafana' },
      lbl(16, 252, 'Contact point', { weight: 500, box: 200 }),
      { block: 'dropdown', x: cp.x, y: cp.y, w: cp.w, value: 'guide-webhook' },
      lbl(334, 283, 'View or create contact points', { tone: 'link', box: 300 }),
      ico(16, 332, 'chevronRight'), lbl(40, 345, 'Muting, grouping and timings (optional)', { weight: 500, box: 460 }),
      ...marks([[cp, 19]]),
    ]),
  });
}

// 09: section 6 and Save (steps 20 to 23)
{
  const sum = { x: 16, y: 150, w: 640, h: 32 };
  const run = { x: 16, y: 290, w: 640, h: 32 };
  const link = { x: 16, y: 392, w: 230, h: 32 };
  const save = { x: 16, y: 470, w: 76, h: 32 };
  figures.push({
    id: '09-message-and-save',
    alt: 'New alert rule form, section 6 Configure notification message: the Summary field holds a template that prints the 5xx ratio (callout 20), the Runbook URL field holds a URL (callout 21), the Link dashboard and panel button is marked by callout 22 and the Save button at the bottom by callout 23',
    width: FW, height: 540,
    nodes: form(540, [
      ...SEC(66, 6, 'Configure notification message'),
      { block: 'field', x: 16, y: 130, w: 640, label: 'Summary (optional)', value: '5xx ratio is {{ printf "%.2f" $values.B.Value }}', mono: true },
      { block: 'field', x: 16, y: 200, w: 640, label: 'Description (optional)', placeholder: '' },
      { block: 'field', x: 16, y: 270, w: 640, label: 'Runbook URL (optional)', value: 'https://example.com/runbooks/high-5xx' },
      btn(16, 346, 200, 'Add custom annotation'),
      btn(link.x, link.y, link.w, 'Link dashboard and panel'),
      btn(save.x, save.y, save.w, 'Save', 'primary'), btn(100, 470, 84, 'Cancel'),
      ...marks([[sum, 20], [run, 21], [link, 22], [save, 23]]),
    ]),
  });
}

// ---- rule detail and instances ------------------------------------------------------------------------------------
const RULE_CRUMBS = ['Alerting', 'Guides', 'guide-eval', 'Guide high 5xx ratio'];
const instTabs = ['Query and conditions', 'Instances (1)', 'History', 'Versions'];
function ruleDetail({ h, state, label, badge, tab, children = [] }) {
  const n = [
    lbl(16, 104, 'Guide high 5xx ratio', { size: 'heading', weight: 500, box: 400 }),
    { block: 'pill', x: 330, y: 84, str: badge, state },
    lbl(16, 140, 'Notifications are delivered to', { size: 'small', tone: 'textMuted', box: 240 }), lbl(190, 140, 'guide-webhook', { size: 'small', tone: 'link', box: 160 }),
    lbl(380, 140, 'Evaluation interval  Every 1m', { size: 'small', tone: 'textMuted', box: 260 }),
    { block: 'chip', x: 660, y: 125, str: 'team=bookshelf-guides' }, { block: 'chip', x: 828, y: 125, str: 'severity=critical' },
    { block: 'tabs', x: 16, y: 164, w: 640, tabs: instTabs, active: 1 },
  ];
  if (tab) {
    const chips = ['Normal', 'Alerting', 'Pending', 'Recovering', 'NoData', 'Error'];
    let cx = 16;
    chips.forEach((c) => { const w = Math.ceil(textWidth(c, 12)) + 16; n.push({ block: 'chip', x: cx, y: 212, str: c }); cx += w + 8; });
    n.push({ block: 'field', x: 700, y: 208, w: 364, placeholder: 'Search by label' });
    n.push(box(16, 248, 1048, 34, { fill: 'surface', stroke: 'border', radius: 4 }));
    ['State', 'Labels', 'Created', 'Destination'].forEach((t, i) => n.push(lbl([28, 150, 660, 800][i], 270, t, { size: 'small', weight: 600, tone: 'textMuted', box: 120 })));
    n.push(box(16, 282, 1048, 56, { fill: 'surface', stroke: 'border', radius: 4 }));
    n.push({ block: 'pill', x: 28, y: 300, str: label, state });
    n.push({ block: 'chip', x: 150, y: 299, str: 'alertname=Guide high 5xx ratio' }, { block: 'chip', x: 362, y: 299, str: 'severity=critical' }, { block: 'chip', x: 476, y: 299, str: 'team=bookshelf-guides' });
    n.push(lbl(660, 315, '10:14:50', { size: 'small', tone: 'textMuted', box: 120 }));
    n.push(lbl(800, 315, 'guide-webhook', { size: 'small', tone: 'link', box: 120 }), btn(940, 305, 80, 'Silence'));
  } else {
    n.push(lbl(16, 220, 'Query and conditions', { tone: 'textMuted', box: 300 }));
  }
  return grafanaFrame({ h, crumbs: RULE_CRUMBS, children: [...n, ...children] });
}

// 10: the rule page, Instances tab (step 25)
{
  const inst = tabBox(16, 164, instTabs, 1, 1);
  figures.push({
    id: '10-rule-normal',
    alt: 'Rule page of Guide high 5xx ratio with the green Normal badge: the summary row names the contact point guide-webhook and the labels, and the Instances tab of the tab strip is marked by callout 25',
    width: FW, height: 300,
    nodes: ruleDetail({ h: 300, state: 'normal', label: 'Normal', badge: 'Normal', tab: false, children: mark(inst, 25) }),
  });
}

// 11: Instances tab, Pending (step 27)
{
  figures.push({
    id: '11-instance-pending',
    alt: 'Instances tab of the rule Guide high 5xx ratio with an orange Pending badge in the header: the State column of the only instance shows Pending (callout 27), next to its labels and the destination guide-webhook',
    width: FW, height: 370,
    nodes: ruleDetail({ h: 370, state: 'pending', label: 'Pending', badge: 'Pending', tab: true, children: mark({ x: 28, y: 300, w: 66, h: 20 }, 27) }),
  });
}

// 12: Instances tab, Alerting / Firing (step 28)
{
  figures.push({
    id: '12-instance-firing',
    alt: 'Instances tab of the rule Guide high 5xx ratio one minute later: the header badge reads Firing and the State column of the instance shows Alerting in red (callout 28)',
    width: FW, height: 370,
    nodes: ruleDetail({ h: 370, state: 'firing', label: 'Alerting', badge: 'Firing', tab: true, children: mark({ x: 28, y: 300, w: 66, h: 20 }, 28) }),
  });
}

// 13: the panel editor with the Alert tab (step 33)
{
  const t = 'Requests per second by status';
  const e = gEditor({ mode: 'code', typed: true, hasData: true, right: 'options', title: t, optTitle: t, optDescription: 'Request rate by status', saved: true, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'] });
  const alertTab = tabBox(16, 338, ['Queries 1', 'Transformations 0', 'Alert 0'], 2, 0);
  figures.push({
    id: '13-panel-alert-tab',
    alt: 'Panel editor of the saved dashboard Bookshelf (guides): the bottom tabs are Queries, Transformations and Alert, and the Alert tab is marked by callout 33',
    width: FW, height: 640,
    nodes: e.nodes.concat(mark(alertTab, 33)),
  });
}

// 14: the finished rule, Firing (What you build)
figures.push({
  id: '14-result',
  alt: 'The finished alert rule Guide high 5xx ratio in the folder Guides while the load generator is in failing mode: the header badge reads Firing and the only instance is in the state Alerting, with its labels and the contact point guide-webhook',
  width: FW, height: 370,
  nodes: ruleDetail({ h: 370, state: 'firing', label: 'Alerting', badge: 'Firing', tab: true }),
});

export default { product: 'grafana', guide: 'g16', figures };
