// Figures of the Kibana guide K13, "Create a rule with a connector" (guide-create-a-rule.adoc).
// Facts: guides-brief/kibana-facts.md sections 8 and 10 (Kibana 9.5.6). Verified there: the Connectors and Rules pages, the
// Select a connector flyout, the Webhook connector form (Connector name, Method, URL, Authentication, Add HTTP header, Save),
// the Create new rule picker, the three-step Elasticsearch query rule page (Definition, Actions, Details) with its labels and
// the condition sentence, the Add action connector list with Run when and Action frequency, the Alerts page of Observability
// with its columns and the Alert details flyout, and the forced failure timeline. NOT VERIFIED there (drawn generically): the
// Server log form, the layout of the KQL query box, the action body editor wrapping and the Recovered pill colour.
// Callout numbers are the step numbers of the page; a figure shows the screen as the step starts, with the control to act on
// highlighted.
import { FW, lbl, box, btn, ico, rule, mark, marks, kibanaFrame, kFilterRow } from '../lib/shells.mjs';

const figures = [];
const H = 560;

// ---------------------------------------------------------------- Stack Management layout (left menu and a page)
const SM_MENU = [
  ['Alerts and Insights', ['Alerts', 'Rules', 'Cases', 'Connectors', 'Reporting', 'Watcher', 'Maintenance Windows']],
  ['Kibana', ['Data Views', 'Saved Objects', 'Spaces']],
];
function stack({ crumbs, active, h = H, page, children }) {
  const fr = kibanaFrame({ h, crumbs: ['Stack Management', ...crumbs] });
  const n = [box(0, 96, 232, h - 96, { fill: 'surface', stroke: 'border' })];
  const rows = {};
  let y = 126;
  SM_MENU.forEach(([group, items]) => {
    n.push(lbl(16, y, group, { weight: 600, box: 200 }));
    items.forEach((it, i) => {
      const iy = y + 8 + i * 28;
      if (it === active) n.push(box(8, iy, 216, 26, { fill: 'navActiveBg', radius: 4 }));
      n.push(lbl(24, iy + 18, it, { weight: it === active ? 500 : 400, tone: it === active ? 'link' : 'text', box: 190 }));
      rows[it] = { x: 8, y: iy, w: 216, h: 26 };
    });
    y += 8 + items.length * 28 + 28;
  });
  const geo = { ...fr.geo, rows };
  fr.nodes[0].children.push(...n, ...(page ? page(geo) : []), ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

const PX = 252; // left edge of the page area in Stack Management

// A page title with its description and two or three header buttons at the right; returns the nodes and the main button.
function pageHead(title, sub, buttons) {
  const n = [lbl(PX, 140, title, { size: 'heading', weight: 500, tone: 'textStrong', box: 400 }), lbl(PX, 168, sub, { size: 'small', tone: 'textMuted', box: 560 })];
  let rx = 1064;
  const geo = {};
  [...buttons].reverse().forEach(([label, w, kind]) => { rx -= w; n.push(btn(rx, 124, w, label, kind ?? 'secondary')); geo[label] = { x: rx, y: 124, w, h: 32 }; rx -= 8; });
  return { nodes: n, geo };
}

// A flyout from the right edge of the window.
const flyoutAt = (x, w, title) => [{ block: 'flyout', x, y: 96, w, h: H - 96, title }];

// 01: the Connectors page (steps 1 to 3)
{
  const head = pageHead('Connectors', 'Connect third-party software with your alerting data.', [['Documentation', 140], ['Create connector', 160, 'primary']]);
  const d = stack({
    crumbs: ['Connectors'], active: 'Connectors',
    page: () => [...head.nodes,
      { block: 'tabs', x: PX, y: 190, w: 200, tabs: ['Connectors', 'Logs'], active: 0 },
      box(PX, 244, 812, 200, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(PX + 406, 330, 'Create your first connector', { size: 'title', weight: 600, anchor: 'middle', box: 400 }),
      lbl(PX + 406, 358, 'Connectors send alerts to other systems.', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 500 }),
      btn(PX + 406 - 80, 380, 160, 'Create connector', 'primary'),
    ],
    children: (g) => marks([[g.rows.Connectors, 2], [head.geo['Create connector'], 3]]),
  });
  figures.push({
    id: '01-connectors-page',
    alt: 'Stack Management with the Connectors page, empty: the entry Connectors under Alerts and Insights in the left menu is marked by callout 2 and the Create connector button of the page header by callout 3',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 02: Select a connector (step 4)
{
  const head = pageHead('Connectors', 'Connect third-party software with your alerting data.', [['Documentation', 140], ['Create connector', 160, 'primary']]);
  const cards = ['Email', 'Index', 'Server log', 'Slack', 'Webhook', 'AWS Lambda'];
  const fx = 584, ix = fx + 16;
  const cardBox = (i) => ({ x: ix + (i % 2) * 232, y: 168 + Math.floor(i / 2) * 76, w: 216, h: 64 });
  const nodes = [...flyoutAt(fx, 480, 'Select a connector')];
  cards.forEach((c, i) => { const b = cardBox(i); nodes.push(box(b.x, b.y, b.w, b.h, { fill: 'surface', stroke: 'borderStrong', radius: 6 }), lbl(b.x + 16, b.y + 38, c, { weight: 600, box: b.w - 32 })); });
  const d = stack({ crumbs: ['Connectors'], active: 'Connectors', page: () => [...head.nodes, ...nodes], children: () => mark(cardBox(4), 4) });
  figures.push({
    id: '02-select-connector',
    alt: 'The Select a connector flyout over the Connectors page with cards for Email, Index, Server log, Slack, Webhook and AWS Lambda; the card Webhook is marked by callout 4',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 03: the Webhook connector form (steps 5 to 8)
{
  const fx = 584, ix = fx + 16, iw = 448;
  const gName = { x: ix, y: 170, w: iw, h: 32 }, gUrl = { x: ix, y: 314, w: iw, h: 32 }, gHeader = { x: ix, y: 424, w: iw, h: 56 }, gSave = { x: fx + 480 - 16 - 80, y: 508, w: 80, h: 32 };
  const head = pageHead('Connectors', 'Connect third-party software with your alerting data.', [['Documentation', 140], ['Create connector', 160, 'primary']]);
  const nodes = [
    ...flyoutAt(fx, 480, 'Webhook'),
    { block: 'field', x: ix, y: 150, w: iw, label: 'Connector name', value: 'guide-webhook' },
    { block: 'dropdown', x: ix, y: 222, w: 160, label: 'Method', value: 'POST' },
    { block: 'field', x: ix, y: 294, w: iw, label: 'URL', value: 'http://webhook.lab:8080/guide-kibana' },
    { block: 'dropdown', x: ix, y: 366, w: 260, label: 'Authentication', value: 'None' },
    lbl(ix, 444, 'Add HTTP header (switch on)', { tone: 'link', weight: 500, box: 260 }),
    { block: 'field', x: ix, y: 450, w: 210, value: 'Content-Type' }, { block: 'field', x: ix + 226, y: 450, w: 222, value: 'application/json' },
    btn(fx + 480 - 16 - 80 - 8 - 130 - 8 - 70, 508, 70, 'Back'), btn(fx + 480 - 16 - 80 - 8 - 130, 508, 130, 'Save & test'), btn(gSave.x, gSave.y, 80, 'Save', 'primary'),
  ];
  const d = stack({ crumbs: ['Connectors'], active: 'Connectors', page: () => [...head.nodes, ...nodes], children: () => marks([[gName, 5], [gUrl, 6], [gHeader, 7], [gSave, 8]]) });
  figures.push({
    id: '03-webhook-connector',
    alt: 'The Webhook connector form with the connector name guide-webhook (callout 5), the method POST and the URL http://webhook.lab:8080/guide-kibana (callout 6), Authentication set to None, the switch Add HTTP header on with the HTTP header Content-Type with the value application/json (callout 7) and the Save button (callout 8)',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 04: the Rules page (steps 10 and 11)
{
  const head = pageHead('Rules', 'Manage and monitor all of your rules in one place.', [['Documentation', 140], ['Settings', 100], ['Create rule', 130, 'primary']]);
  const d = stack({
    crumbs: ['Rules'], active: 'Rules',
    page: () => [...head.nodes,
      { block: 'tabs', x: PX, y: 190, w: 160, tabs: ['Rules', 'Logs'], active: 0 },
      box(PX, 244, 812, 200, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(PX + 406, 330, 'No rules yet', { size: 'title', weight: 600, anchor: 'middle', box: 400 }),
      btn(PX + 406 - 65, 360, 130, 'Create rule', 'primary'),
    ],
    children: (g) => marks([[g.rows.Rules, 10], [head.geo['Create rule'], 11]]),
  });
  figures.push({
    id: '04-rules-page',
    alt: 'Stack Management with the Rules page: the entry Rules under Alerts and Insights in the left menu is marked by callout 10 and the Create rule button of the page header by callout 11',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 05: the rule type picker (step 12)
{
  const head = pageHead('Rules', 'Manage and monitor all of your rules in one place.', [['Documentation', 140], ['Settings', 100], ['Create rule', 130, 'primary']]);
  const fx = 484, fw = 580;
  const cardsData = [['Elasticsearch query', 'Alert when matches are found during the latest query run.', 'STACK ALERTS'], ['Index threshold', 'Alert when an aggregated query meets the threshold.', 'STACK ALERTS'], ['Custom threshold', 'Alert when any Observability data type reaches or exceeds a given value.', 'OBSERVABILITY']];
  const cb = (i) => ({ x: fx + 176, y: 206 + i * 80, w: 388, h: 68 });
  const nodes = [...flyoutAt(fx, fw, 'Create new rule'), { block: 'tabs', x: fx + 8, y: 148, w: 200, tabs: ['Rule type', 'Template'], active: 0 }];
  ['All 32', 'Stack Monitoring 14', 'Stack Alerts 5', 'Observability 1'].forEach((c, i) => { if (i === 0) nodes.push(box(fx + 12, 204 + i * 30, 152, 26, { fill: 'navActiveBg', radius: 4 })); nodes.push(lbl(fx + 22, 222 + i * 30, c, { weight: i === 0 ? 500 : 400, box: 136 })); });
  cardsData.forEach(([t, dsc, tag], i) => { const b = cb(i); nodes.push(box(b.x, b.y, b.w, b.h, { fill: 'surface', stroke: 'borderStrong', radius: 6 }), lbl(b.x + 14, b.y + 24, t, { weight: 600, box: 240 }), { block: 'chip', x: b.x + b.w - 126, y: b.y + 10, str: tag, w: 114 }, lbl(b.x + 14, b.y + 48, dsc.length > 56 ? `${dsc.slice(0, 54)}...` : dsc, { size: 'small', tone: 'textMuted', box: 360 })); });
  const d = stack({ crumbs: ['Rules'], active: 'Rules', page: () => [...head.nodes, ...nodes], children: () => mark(cb(0), 12) });
  figures.push({
    id: '05-rule-type-picker',
    alt: 'The Create new rule flyout over the Rules page with the tabs Rule type and Template, the category list and the cards Elasticsearch query, Index threshold and Custom threshold; the card Elasticsearch query is marked by callout 12',
    width: FW, height: H, nodes: d.nodes,
  });
}

// ---------------------------------------------------------------- the rule form (full page in the Stack Management layout)
function ruleForm({ h = 640, crumbs = ['Rules', 'Create'], body, children }) {
  return stack({ crumbs, active: 'Rules', h, page: (g) => [lbl(PX, 130, 'Elasticsearch query rule', { size: 'title', weight: 600, box: 400 }), ico(PX + 224, 116, 'edit', 'textMuted'), ...(body ? body(g) : [])], children });
}
const stepHead = (y, num, title, sub) => [box(PX, y, 24, 24, { fill: 'primary', radius: 12 }), lbl(PX + 12, y + 17, String(num), { size: 'small', weight: 600, tone: 'textOnPrimary', anchor: 'middle', box: 20 }), lbl(PX + 36, y + 17, title, { weight: 600, box: 300 }), ...(sub ? [lbl(PX + 130, y + 17, sub, { size: 'small', tone: 'textMuted', box: 300 })] : [])];

// 06: Definition (steps 13 to 18)
{
  const x0 = PX + 8;
  const gType = { x: x0, y: 206, w: 400, h: 32 }, gView = { x: x0, y: 266, w: 360, h: 32 }, gQuery = { x: x0, y: 332, w: 780, h: 32 };
  const gAbove = { x: x0 + 412, y: 404, w: 60, h: 32 }, gWindow = { x: x0 + 590, y: 404, w: 158, h: 32 }, gTest = { x: x0, y: 532, w: 120, h: 32 };
  const d = ruleForm({
    h: 590, crumbs: ['Rules', 'Create'],
    body: () => {
      const n = [...stepHead(150, 1, 'Definition')];
      n.push(lbl(x0, 200, 'Select a query type', { size: 'small', weight: 500, box: 300 }));
      ['KQL or Lucene', 'Query DSL', 'ES|QL'].forEach((t, i) => { n.push(box(x0 + i * 134, 206, 130, 32, { fill: i === 0 ? 'navActiveBg' : 'surface', stroke: i === 0 ? 'primary' : 'borderStrong', radius: 4 }), lbl(x0 + i * 134 + 65, 227, t, { anchor: 'middle', weight: i === 0 ? 500 : 400, box: 120 })); });
      n.push({ block: 'dropdown', x: x0, y: 246, w: 360, label: 'Select a data view', value: 'Bookshelf logs (guides)' });
      n.push(lbl(x0, 322, 'Define your query', { size: 'small', weight: 500, box: 300 }));
      n.push({ block: 'field', x: x0, y: 332, w: 780, value: 'severity_text : "ERROR"', mono: true });
      n.push(lbl(x0, 394, 'Set the group, threshold, and time window', { size: 'small', weight: 500, box: 400 }));
      const word = (x, t, w) => n.push(lbl(x, 425, t, { size: 'small', weight: 600, tone: 'textMuted', box: w }));
      const cell = (x, w, t) => n.push(box(x, 404, w, 32, { fill: 'surface', stroke: 'borderStrong', radius: 4 }), lbl(x + 10, 425, t, { box: w - 16 }));
      word(x0, 'WHEN', 46); cell(x0 + 52, 90, 'count()');
      word(x0 + 152, 'OVER', 44); cell(x0 + 202, 130, 'all documents');
      word(x0 + 342, 'IS ABOVE', 66); cell(x0 + 412, 60, '5');
      word(x0 + 484, 'FOR THE LAST', 100); cell(x0 + 590, 50, '1'); cell(x0 + 648, 100, 'minute');
      n.push(lbl(x0, 472, 'Set the number of documents to send', { size: 'small', weight: 500, box: 400 }), lbl(x0, 504, 'SIZE', { size: 'small', weight: 600, tone: 'textMuted', box: 50 }));
      n.push(box(x0 + 44, 482, 70, 30, { fill: 'surface', stroke: 'borderStrong', radius: 4 }), lbl(x0 + 54, 502, '100', { box: 50 }));
      n.push(btn(gTest.x, gTest.y, 120, 'Test query'), btn(gTest.x + 130, gTest.y, 120, 'Copy query'));
      return n;
    },
    children: () => marks([[gType, 13], [gView, 14], [gQuery, 15], [gAbove, 16], [gWindow, 17], [gTest, 18]]),
  });
  figures.push({
    id: '06-definition',
    alt: 'Step 1 Definition of the Elasticsearch query rule: the query type KQL or Lucene (callout 13), the data view Bookshelf logs (guides) (callout 14), the query severity_text equal to ERROR (callout 15), the condition WHEN count() OVER all documents IS ABOVE 5 (callout 16) FOR THE LAST 1 minute (callout 17), and the Test query button (callout 18)',
    width: FW, height: 590, nodes: d.nodes,
  });
}

// 07: the schedule (step 19)
{
  const gEvery = { x: PX + 8, y: 214, w: 200, h: 32 };
  const d = ruleForm({
    h: 500,
    body: () => {
      const n = [lbl(PX + 8, 174, 'Rule schedule', { weight: 600, box: 300 }), lbl(PX + 8, 196, 'Set the frequency to check the alert conditions', { size: 'small', tone: 'textMuted', box: 500 })];
      n.push(lbl(PX + 8, 235, 'Every', { size: 'small', weight: 600, tone: 'textMuted', box: 50 }), box(PX + 56, 214, 60, 32, { fill: 'surface', stroke: 'borderStrong', radius: 4 }), lbl(PX + 66, 235, '1', { box: 40 }), box(PX + 124, 214, 110, 32, { fill: 'surface', stroke: 'borderStrong', radius: 4 }), lbl(PX + 134, 235, 'minute', { box: 90 }), ico(PX + 208, 222, 'chevronDown', 'textMuted'));
      n.push(rule(PX + 8, 276, 780));
      n.push(ico(PX + 8, 292, 'chevronRight', 'textMuted'), lbl(PX + 32, 305, 'Advanced options', { weight: 600, box: 300 }));
      n.push(lbl(PX + 32, 336, 'Alert delay', { size: 'small', tone: 'textMuted', box: 300 }), lbl(PX + 32, 358, 'Alert flapping detection', { size: 'small', tone: 'textMuted', box: 300 }));
      return n;
    },
    children: () => mark({ x: PX + 8, y: 214, w: 228, h: 32 }, 19),
  });
  void gEvery;
  figures.push({
    id: '07-schedule',
    alt: 'Rule schedule of the Elasticsearch query rule with the frequency Every 1 minute marked by callout 19, above the collapsed Advanced options with Alert delay and Alert flapping detection',
    width: FW, height: 500, nodes: d.nodes,
  });
}

// The Select connector flyout lists the connectors of the space.
// 08: Add action; the connector list (steps 20 and 21)
{
  const fx = 584;
  const gAdd = { x: PX + 8, y: 244, w: 130, h: 32 };
  const cb = (i) => ({ x: fx + 16 + (i % 2) * 232, y: 230 + Math.floor(i / 2) * 76, w: 216, h: 64 });
  const names = [['guide-server-log', 'Server log'], ['guide-webhook', 'Webhook'], ['Cases', 'Create a case in Kibana.'], ['Workflows', 'Execute workflows when alerts are triggered.']];
  const nodes = [...flyoutAt(fx, 480, 'Select connector')];
  [['All', 40], ['Cases', 60], ['Server log', 86], ['Webhook', 76], ['Workflows', 88]].reduce((cx, [c, w]) => { nodes.push({ block: 'chip', x: cx, y: 160, str: c, w }); return cx + w + 8; }, fx + 16);
  names.forEach(([t, s], i) => { const b = cb(i); nodes.push(box(b.x, b.y, b.w, b.h, { fill: 'surface', stroke: 'borderStrong', radius: 6 }), lbl(b.x + 14, b.y + 26, t, { weight: 600, box: b.w - 28 }), lbl(b.x + 14, b.y + 48, s.length > 30 ? `${s.slice(0, 28)}...` : s, { size: 'small', tone: 'textMuted', box: b.w - 28 })); });
  const d = ruleForm({
    h: H,
    body: () => [...stepHead(158, 2, 'Actions', 'Optional'), lbl(PX + 8, 212, 'Select a connector and configure the actions', { size: 'small', tone: 'textMuted', box: 320 }), lbl(PX + 8, 228, 'to be performed when an alert is triggered', { size: 'small', tone: 'textMuted', box: 320 }), btn(gAdd.x, gAdd.y, 130, 'Add action', 'secondary', 'plus'), ...nodes],
    children: () => marks([[gAdd, 20], [cb(1), 21]]),
  });
  figures.push({
    id: '08-add-action',
    alt: 'Step 2 Actions of the rule page with the Add action button marked by callout 20 and the Select connector flyout listing guide-server-log, guide-webhook, Cases and Workflows; the connector guide-webhook is marked by callout 21',
    width: FW, height: H, nodes: d.nodes,
  });
}

// An action card of the Actions step.
function actionCard({ y, title, run, frequency, bodyLines, bodyH }) {
  const x = PX + 8, w = 780;
  const n = [box(x, y, w, 44 + 60 + 30 + bodyH + 12, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(x + 16, y + 28, title, { weight: 600, box: 400 })];
  const geo = {};
  n.push({ block: 'dropdown', x: x + 16, y: y + 40, w: 220, label: 'Run when', value: run });
  geo.run = { x: x + 16, y: y + 60, w: 220, h: 32 };
  if (frequency) {
    n.push({ block: 'dropdown', x: x + 260, y: y + 40, w: 200, label: 'Action frequency', value: 'For each alert' }, { block: 'dropdown', x: x + 470, y: y + 60, w: 200, value: frequency });
    geo.freq = { x: x + 260, y: y + 60, w: 410, h: 32 };
  }
  n.push(lbl(x + 16, y + 118, 'Body', { size: 'small', weight: 500, box: 100 }), lbl(x + 100, y + 118, 'This connector is configured to use HTTP POST requests.', { size: 'small', tone: 'textMuted', box: 520 }));
  n.push({ block: 'queryEditor', x: x + 16, y: y + 126, w: w - 32, h: bodyH, lines: bodyLines, lineNumbers: false });
  geo.body = { x: x + 16, y: y + 126, w: w - 32, h: bodyH };
  geo.card = { x, y, w, h: 44 + 60 + 30 + bodyH + 12 };
  return { nodes: n, geo };
}

// 09: the first action (steps 22 to 24)
{
  const c = actionCard({ y: 196, title: 'guide-webhook', run: 'Query matched', frequency: 'On status changes', bodyH: 124, bodyLines: ['{"rule":"{{rule.name}}","alert":"{{alert.id}}",', ' "status":"{{alert.actionGroupName}}",', ' "value":"{{context.value}}",', ' "conditions":"{{context.conditions}}"}'] });
  const d = ruleForm({ h: 600, body: () => [...stepHead(158, 2, 'Actions', 'Optional'), ...c.nodes], children: () => marks([[c.geo.run, 22], [c.geo.freq, 23], [c.geo.body, 24]]) });
  figures.push({
    id: '09-first-action',
    alt: 'The action guide-webhook of the Actions step: Run when set to Query matched (callout 22), the action frequency For each alert with On status changes (callout 23), and the body, a JSON text with the rule name, the alert id, the action group name, the value and the conditions as action variables in double braces (callout 24)',
    width: FW, height: 600, nodes: d.nodes,
  });
}

// 10: the recovery action (steps 25 to 28)
{
  const first = [box(PX + 8, 196, 780, 44, { fill: 'surface', stroke: 'border', radius: 6 }), ico(PX + 24, 210, 'chevronRight', 'textMuted'), lbl(PX + 52, 223, 'guide-webhook', { weight: 600, box: 300 }), lbl(PX + 300, 223, 'Query matched, On status changes', { size: 'small', tone: 'textMuted', box: 300 })];
  const gAdd = { x: PX + 8, y: 456, w: 130, h: 32 };
  const c = actionCard({ y: 254, title: 'guide-webhook', run: 'Recovered', bodyH: 36, bodyLines: ['{"rule":"{{rule.name}}","status":"Recovered"}'] });
  const d = ruleForm({ h: 540, body: () => [...stepHead(158, 2, 'Actions', 'Optional'), ...first, ...c.nodes, btn(gAdd.x, gAdd.y, 130, 'Add action', 'secondary', 'plus')], children: () => marks([[gAdd, 25], [{ x: PX + 24, y: 262, w: 200, h: 24 }, 26], [c.geo.run, 27], [c.geo.body, 28]]) });
  figures.push({
    id: '10-recovery-action',
    alt: 'The Actions step with the first action collapsed and a second action guide-webhook below it: the Add action button is marked by callout 25, the connector title of the second action by callout 26, Run when set to Recovered by callout 27 and its body, a JSON text with the rule name and the status Recovered, by callout 28',
    width: FW, height: 540, nodes: d.nodes,
  });
}

// 11: Details (steps 29 and 30)
{
  const gName = { x: PX + 8, y: 210, w: 520, h: 32 }, gCreate = { x: PX + 8 + 220, y: 452, w: 130, h: 32 };
  const d = ruleForm({
    h: 540,
    body: () => [
      ...stepHead(158, 3, 'Details'),
      { block: 'field', x: PX + 8, y: 190, w: 520, label: 'Rule name', value: 'Guide Bookshelf error logs' },
      { block: 'field', x: PX + 8, y: 260, w: 520, label: 'Tags (optional)', placeholder: '' },
      { block: 'field', x: PX + 8, y: 330, w: 520, label: 'Investigation guide (optional)', placeholder: '' },
      btn(PX + 8, gCreate.y, 84, 'Cancel'), btn(PX + 8 + 94, gCreate.y, 110, 'Show request'), btn(gCreate.x, gCreate.y, 130, 'Create rule', 'primary'),
    ],
    children: () => marks([[gName, 29], [gCreate, 30]]),
  });
  figures.push({
    id: '11-details',
    alt: 'Step 3 Details of the rule page with the rule name Guide Bookshelf error logs marked by callout 29, the optional tags and investigation guide, and the buttons Cancel, Show request and Create rule at the bottom, with Create rule marked by callout 30',
    width: FW, height: 540, nodes: d.nodes,
  });
}

// ---------------------------------------------------------------- Observability alerts page
function alertsPage({ status, pill, triggered, duration, h = 420, children, extra }) {
  const fr = kibanaFrame({ h, crumbs: ['Observability', 'Alerts'] });
  const geo = {};
  const n = [lbl(16, 132, 'Alerts', { size: 'heading', weight: 700, tone: 'textStrong', box: 300 })];
  const k = kFilterRow({ y: 150, query: 'Search alerts (e.g. kibana.alert.evaluation.threshold > 75)', time: 'Last 24 hours' });
  n.push(...k.nodes);
  n.push({ block: 'chip', x: 16, y: 196, str: status === 'active' ? 'Status: active' : 'Status', w: 100 }, { block: 'chip', x: 124, y: 196, str: 'Rule', w: 50 }, { block: 'chip', x: 182, y: 196, str: 'Group', w: 56 }, { block: 'chip', x: 246, y: 196, str: 'Tags', w: 50 });
  n.push({ block: 'table', x: 16, y: 236, w: 1048, columns: [{ title: 'Actions', w: 1 }, { title: 'Alert Status', w: 1.4 }, { title: 'Triggered', w: 2.4 }, { title: 'Duration', w: 1.4 }, { title: 'Rule name', w: 3 }, { title: 'Observed value', w: 1.6 }, { title: 'Threshold', w: 1.2 }], rows: [['', '', triggered, duration, 'Guide Bookshelf error logs', status === 'active' ? '234' : '', '> 5']], rowHeight: 40 });
  const xs = 16 + 1048 * (1 / 12);
  void xs;
  n.push(pill);
  geo.expand = { x: 24, y: 274, w: 28, h: 28 };
  geo.pill = { x: 16 + 1048 * (1 / 13) + 4, y: 281, w: 70, h: 20 };
  n.push(ico(32, 288, 'search', 'textMuted'), ico(58, 288, 'dots', 'textMuted'));
  if (extra) n.push(...extra);
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

// 12: Active alert (steps 32 to 34)
{
  const pillGeo = { x: 112, y: 286, w: 64, h: 20 };
  const d = alertsPage({ status: 'active', pill: { block: 'pill', x: pillGeo.x, y: pillGeo.y, str: 'Active', state: 'firing' }, triggered: 'Nov 11, 2026 @ 10:30:53', duration: '1 minute', children: (g) => marks([[pillGeo, 33], [{ x: 26, y: 282, w: 28, h: 28 }, 34]]) });
  void d.geo;
  figures.push({
    id: '12-active-alert',
    alt: 'Alerts page of Observability with the alert of the rule Guide Bookshelf error logs in the table: the status pill Active is marked by callout 33 and the Alert details icon of the row by callout 34, with the observed value 234 and the threshold > 5',
    width: FW, height: 420, nodes: d.nodes,
  });
}

// 13: the Alert details flyout (step 35)
{
  const fx = 424, fw = 640;
  const gReason = { x: fx + 16, y: 220, w: fw - 32, h: 62 };
  const fr = kibanaFrame({ h: 560, crumbs: ['Observability', 'Alerts'] });
  const rows = [['Status', 'Active'], ['Triggered', 'Nov 11, 2026 @ 10:30:53'], ['Duration', '1 minute'], ['Observed value', '234'], ['Threshold', '> 5'], ['Rule name', 'Guide Bookshelf error logs']];
  const n = [...kFilterRow({ y: 104, query: 'Search alerts', time: 'Last 24 hours' }).nodes, { block: 'flyout', x: fx, y: 96, w: fw, h: 464, title: 'Guide Bookshelf error logs' }];
  n.push(lbl(fx + 16, 160, 'Elasticsearch query breached', { size: 'small', tone: 'textMuted', box: 300 }), btn(fx + fw - 16 - 110, 148, 110, 'View rule'));
  n.push({ block: 'tabs', x: fx + 8, y: 172, w: 220, tabs: ['Overview', 'Metadata'], active: 0 });
  n.push(lbl(fx + 16, 232, 'Reason', { weight: 600, box: 200 }), lbl(fx + 16, 254, 'Document count is 234 in the last 1m in Bookshelf logs (guides)', { size: 'small', box: fw - 40 }), lbl(fx + 16, 272, 'data view. Alert when greater than 5.', { size: 'small', box: fw - 40 }));
  n.push(lbl(fx + 16, 306, 'Document Summary', { weight: 600, box: 300 }));
  rows.forEach(([a, b], i) => { n.push(lbl(fx + 16, 334 + i * 30, a, { size: 'small', tone: 'textMuted', box: 160 }), lbl(fx + 200, 334 + i * 30, b, { size: 'small', box: 400 }), rule(fx + 16, 342 + i * 30, fw - 32)); });
  fr.nodes[0].children.push(...n, ...mark({ x: fx + 8, y: 212, w: fw - 16, h: 74 }, 35));
  void gReason;
  figures.push({
    id: '13-alert-details',
    alt: 'The Alert details flyout of the alert Guide Bookshelf error logs, titled Elasticsearch query breached, with the tabs Overview and Metadata; the Reason text, which says that the document count is 234 in the last 1m and that the alert fires when greater than 5, is marked by callout 35, above the Document Summary table',
    width: FW, height: 560, nodes: fr.nodes,
  });
}

// 14: the webhook delivery in a terminal (step 36)
{
  const lines = [
    [{ t: '$ ', kind: 'label' }, { t: "curl -s localhost:8081 | jq '.[-1].body | fromjson'" }],
    '{',
    '  "rule": "Guide Bookshelf error logs",',
    '  "alert": "query matched",',
    '  "status": "Query matched",',
    '  "value": "234",',
    '  "conditions": "Number of matching documents is greater than 5"',
    '}',
  ];
  const nodes = [
    { block: 'window', x: 0, y: 0, w: FW, h: 330, radius: 0, title: 'Terminal', children: [
      { block: 'queryEditor', x: 24, y: 48, w: FW - 48, h: 30 + lines.length * 20, lines, lineNumbers: false },
      ...mark({ x: 24, y: 48, w: FW - 48, h: 30 }, 36),
    ] },
  ];
  figures.push({
    id: '14-webhook-delivery',
    alt: 'A terminal showing the command curl -s localhost:8081 piped to jq (callout 36) and the last delivery of the webhook receiver: a JSON object with the rule Guide Bookshelf error logs, the alert query matched, the status Query matched, the value 234 and the conditions Number of matching documents is greater than 5',
    width: FW, height: 330, nodes,
  });
}

// 15: the result, the alert recovered (What you build)
{
  const pillGeo = { x: 112, y: 286, w: 78, h: 20 };
  const d = alertsPage({ status: 'recovered', pill: { block: 'pill', x: pillGeo.x, y: pillGeo.y, str: 'Recovered', state: 'normal', w: 78 }, triggered: 'Nov 11, 2026 @ 10:30:53', duration: '5 minutes' });
  figures.push({
    id: '15-result',
    alt: 'Alerts page of Observability with the alert of the rule Guide Bookshelf error logs in the status Recovered, after the load generator returned to normal traffic',
    width: FW, height: 420, nodes: d.nodes,
  });
}

void kibanaFrame;
export default { product: 'kibana', guide: 'k13', figures };
