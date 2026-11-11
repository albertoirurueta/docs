// Figures of the Grafana guide G18, "Silence, schedule and review alerts" (guide-silence-schedule-and-review-alerts.adoc).
// Facts: guides-brief/grafana-facts.md sections 7 (Alert list options), 10 (rule page, History), 11 (time interval form,
// policies) and 12 (silence form). A figure shows the screen the step starts from, with the control to act on highlighted;
// a typing step shows the typed value. Callout numbers are the step numbers of the page. Colours are theme tokens only.
// NOT VERIFIED in the lab, so drawn generically (values with plain captions): the Alerts rule list rows, the policy route
// More menu and the timing options, the recording rule form (its captions follow the Grafana documentation) and the
// Explore result of the recorded metric.
import { FW, lbl, box, btn, ico, mark, marks, grafanaFrame, gDashToolbar, gEditor, reqChart } from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const NW = 264; // wider navigation so that "Notification configuration" fits
const NAV_BASE = [['Bookmarks', 'star'], ['Starred', 'star'], ['Dashboards', 'dashboard'], ['Explore', 'explore'], ['Drilldown', 'search'], ['AI', 'apps'], ['Alerting', 'bell'], ['Connections', 'database'], ['Administration', 'gear']];

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

function tabBoxes(x, y, tabs, active) {
  let cx = x;
  return tabs.map((t, i) => {
    const w = Math.ceil(textWidth(t, 14, { weight: i === active ? 500 : 400 })) + 24;
    const b = { x: cx, y, w, h: 32 };
    cx += w;
    return b;
  });
}
const head = (x, title, sub, subBox = 760) => [lbl(x, 104, title, { size: 'heading', weight: 500, box: 560 }), ...(sub ? [lbl(x, 132, sub, { tone: 'textMuted', box: subBox })] : [])];
const chip = (x, y, str) => ({ block: 'chip', x, y, str });
const chipW = (str) => Math.ceil(textWidth(str, 12)) + 16;
const NT = ['Contact points', 'Notification policies', 'Templates', 'Time intervals'];
const SUB = 'Manage contact points, notification policies, templates, and time intervals';

const figures = [];

// A rule page header: title, state badge, tabs.
function rulePage({ h, active = 0, children = [] }) {
  const tabs = ['Query and conditions', 'Instances (1)', 'History', 'Versions'];
  const tb = tabBoxes(16, 150, tabs, active);
  return {
    tb,
    nodes: grafanaFrame({ h, crumbs: ['Alerting', 'Guides', 'guide-eval', 'Guide high 5xx ratio'], children: [
      lbl(16, 104, 'Guide high 5xx ratio', { size: 'heading', weight: 500, box: 420 }), { block: 'pill', x: 330, y: 86, str: 'Firing', state: 'firing' },
      btn(FW - 16 - 100, 76, 100, 'More', 'secondary', 'chevronDown'),
      { block: 'tabs', x: 16, y: 150, w: 640, tabs, active },
      ...children,
    ] }),
  };
}

// 01: the Alert rules list with the firing rule (step 2)
{
  const row = { x: 56, y: 352, w: 1008, h: 44 };
  figures.push({
    id: '01-alert-rules',
    alt: 'Alert rules page of Grafana 13.3 with the grouped list: the folder Guides holds the evaluation group guide-eval, every 1m, and its rule Guide high 5xx ratio with the state Firing, marked by callout 2',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Alerting', 'Alert rules'], children: [
      ...head(16, 'Alert rules', 'Rules that determine whether an alert will fire'),
      btn(FW - 16 - 100, 70, 100, 'More', 'secondary', 'chevronDown'), btn(FW - 16 - 100 - 8 - 160, 70, 160, 'New alert rule', 'primary', 'plus'),
      { block: 'tabs', x: 16, y: 148, w: 420, tabs: ['Alert rules', 'Recently deleted'], active: 0 },
      { block: 'field', x: 16, y: 196, w: 420, placeholder: 'Search by name or enter filter query...' },
      lbl(16, 274, 'Grafana-managed', { weight: 500, box: 240 }),
      ico(16, 292, 'chevronDown'), lbl(40, 305, 'Guides', { weight: 500, box: 200 }),
      ico(40, 324, 'chevronDown'), lbl(64, 337, 'guide-eval', { weight: 500, box: 200 }), lbl(180, 337, 'Every 1m', { size: 'small', tone: 'textMuted', box: 120 }),
      box(row.x, row.y, row.w, row.h, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(72, 380, 'Guide high 5xx ratio', { weight: 500, box: 300 }), { block: 'pill', x: 960, y: 364, str: 'Firing', state: 'firing' },
      ...mark({ x: 64, y: 364, w: 250, h: 22 }, 2),
    ] }),
  });
}

// 02: the Instances tab with the Silence button (steps 3 and 4)
{
  const lab1 = 'alertname=Guide high 5xx ratio', lab2 = 'team=bookshelf-guides';
  const silence = { x: 960, y: 330, w: 90, h: 32 };
  const r = rulePage({ h: 440, active: 1, children: [
    ...(() => { let cx = 16; return ['Normal', 'Alerting', 'Pending', 'Recovering', 'NoData', 'Error'].map((c) => { const n = chip(cx, 202, c); cx += chipW(c) + 8; return n; }); })(),
    box(16, 250, 1048, 130, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(32, 276, 'State', { size: 'small', weight: 600, tone: 'textMuted', box: 80 }), lbl(150, 276, 'Labels', { size: 'small', weight: 600, tone: 'textMuted', box: 80 }),
    lbl(660, 276, 'Created', { size: 'small', weight: 600, tone: 'textMuted', box: 80 }), lbl(800, 276, 'Destination', { size: 'small', weight: 600, tone: 'textMuted', box: 100 }),
    box(16, 288, 1048, 1, { fill: 'border' }),
    { block: 'pill', x: 32, y: 338, str: 'Alerting', state: 'firing' },
    chip(150, 338, lab1), chip(150 + chipW(lab1) + 8, 338, lab2),
    lbl(660, 353, '10:15:50', { size: 'small', tone: 'textMuted', box: 100 }),
    lbl(800, 353, 'guide-webhook', { size: 'small', tone: 'link', box: 140 }),
    btn(silence.x, silence.y, 90, 'Silence'),
  ] });
  figures.push({
    id: '02-instances',
    alt: 'Rule page of Guide high 5xx ratio on the Instances tab, marked by callout 3: the table lists one instance with the state Alerting, its labels, the creation time and the destination guide-webhook with a Silence button, marked by callout 4',
    width: FW, height: 440,
    nodes: r.nodes.concat(marks([[r.tb[1], 3], [silence, 4]])),
  });
}

// 03: the silence form (steps 5 to 7)
{
  const g = { duration: { x: 512, y: 170, w: 120, h: 32 }, comment: { x: 16, y: 406, w: 616, h: 72 }, save: { x: 16, y: 546, w: 130, h: 32 } };
  figures.push({
    id: '03-silence-form',
    alt: 'Silence alert rule form prefilled from the instance: the Duration field holds 30m (callout 5), the Matching labels list alertname and team, the Comment field holds a short text (callout 6) and the Save silence button is marked by callout 7',
    width: FW, height: 600,
    nodes: grafanaFrame({ h: 600, crumbs: ['Alerting', 'Silences', 'Silence alert rule'], children: [
      ...head(16, 'Silence alert rule', 'Configure silences to stop notifications from a particular alert rule'),
      { block: 'field', x: 16, y: 150, w: 480, label: 'Silence start and end', value: '2026-11-11 10:18:40 to 2026-11-11 10:48:40' },
      { block: 'field', x: 512, y: 150, w: 120, label: 'Duration', value: '30m' },
      lbl(16, 244, 'Matching labels *', { size: 'small', weight: 500, box: 200 }),
      { block: 'field', x: 16, y: 256, w: 200, value: 'alertname' }, { block: 'field', x: 224, y: 256, w: 70, value: '=' }, { block: 'field', x: 302, y: 256, w: 330, value: 'Guide high 5xx ratio' },
      { block: 'field', x: 16, y: 300, w: 200, value: 'team' }, { block: 'field', x: 224, y: 300, w: 70, value: '=' }, { block: 'field', x: 302, y: 300, w: 330, value: 'bookshelf-guides' },
      btn(16, 346, 140, 'Add matcher', 'secondary', 'plus'),
      { block: 'field', x: 16, y: 386, w: 616, h: 72, label: 'Comment *', value: 'Guide: planned test' },
      lbl(16, 508, 'Affected alert instances', { weight: 500, box: 240 }),
      btn(g.save.x, g.save.y, 130, 'Save silence', 'primary'), btn(154, g.save.y, 90, 'Cancel'),
      ...marks([[g.duration, 5], [g.comment, 6], [g.save, 7]]),
    ] }),
  });
}

// 04: the New time interval form (steps 9 to 12)
{
  const g = { name: { x: 16, y: 170, w: 400, h: 32 }, location: { x: 32, y: 424, w: 200, h: 32 }, start: { x: 48, y: 340, w: 140, h: 32 }, end: { x: 204, y: 340, w: 140, h: 32 }, save: { x: 16, y: 550, w: 150, h: 32 } };
  figures.push({
    id: '04-time-interval-form',
    alt: 'New time interval form: the field Name holds guide-quiet-hours (callout 9), the Time range of the group Time intervals has the Start time 10:00 (callout 10) and the End time 12:00 (callout 11), the Location is UTC (callout 12), and the Save time interval button is marked by callout 13',
    width: FW, height: 620,
    nodes: grafanaFrame({ h: 620, crumbs: ['Alerting', 'Notification configuration', 'New time interval'], children: [
      lbl(16, 104, 'New time interval', { size: 'heading', weight: 500, box: 520 }),
      { block: 'field', x: 16, y: 150, w: 400, label: 'Name *', value: 'guide-quiet-hours', hint: 'A unique name for the time interval' },
      lbl(16, 270, 'Time intervals', { weight: 500, box: 240 }),
      box(16, 282, 1048, 252, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 306, 'Time range', { size: 'small', weight: 500, box: 160 }),
      { block: 'field', x: 48, y: 320, w: 140, label: 'Start time', value: '10:00' }, { block: 'field', x: 204, y: 320, w: 140, label: 'End time', value: '12:00' },
      btn(360, 340, 210, 'Add another time range', 'secondary', 'plus'),
      { block: 'field', x: 32, y: 404, w: 200, label: 'Location', value: 'UTC' }, { block: 'field', x: 248, y: 404, w: 300, label: 'Days of the week', placeholder: '' },
      { block: 'field', x: 564, y: 404, w: 200, label: 'Days of the month', placeholder: '' },
      { block: 'field', x: 32, y: 460, w: 200, label: 'Months', placeholder: '' }, { block: 'field', x: 248, y: 460, w: 200, label: 'Years', placeholder: '' },
      btn(804, 500, 244, 'Remove time interval', 'danger'),
      btn(g.save.x, g.save.y, 150, 'Save time interval', 'primary'), btn(174, g.save.y, 90, 'Cancel'),
      ...marks([[g.name, 9], [g.start, 10], [g.end, 11], [g.location, 12], [g.save, 13]]),
    ] }),
  });
}

// 05: the route of guide-tree with its More button (step 13)
{
  const more = { x: 992, y: 392, w: 72, h: 32 };
  figures.push({
    id: '05-route-more',
    alt: 'Notification policies tab with the tree guide-tree and its route team = bookshelf-guides, whose More button at the right is marked by callout 14',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: ['Alerting', 'Notification configuration'], children: [
      ...head(16, 'Notification configuration', SUB),
      { block: 'tabs', x: 16, y: 148, w: 560, tabs: NT, active: 1 },
      btn(844, 196, 220, 'New notification policy', 'primary', 'plus'),
      box(16, 244, 1048, 190, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 272, 'guide-tree', { weight: 500, box: 240 }),
      lbl(32, 298, 'guide-webhook · grouped by grafana_folder, alertname', { size: 'small', tone: 'textMuted', box: 520 }),
      box(48, 330, 1000, 84, { fill: 'inputBg', stroke: 'border', radius: 6 }),
      lbl(64, 360, 'team = bookshelf-guides', { weight: 500, box: 260 }),
      lbl(64, 384, 'guide-webhook · grouped by alertname · Wait 10s to group instances · Wait 1m before sending updates · Repeated every 1h', { size: 'small', tone: 'textMuted', box: 900 }),
      btn(more.x - 8 - 72, 392 - 52, 72, 'Edit'),
      btn(more.x, more.y - 52, 72, 'More', 'secondary', 'chevronDown'),
      ...mark({ ...more, y: more.y - 52 }, 14),
    ] }),
  });
}

// 06: Alerting > History and the End state filter (steps 15 and 16)
{
  let endState;
  figures.push({
    id: '06-history',
    alt: 'History page of Grafana 13.3 with the Alerting group of the navigation open: callout 16 marks History, and callout 17 marks the End state filter above the table Alert Events with the columns Timestamp, State, Alert rule and Instance',
    width: FW, height: 600,
    nodes: navFrame({ h: 600, crumbs: ['Alerting', 'History'], open: 'Alerting', kids: ALERTING_KIDS, active: 'History', children: (rows) => {
      const x = NW + 16;
      endState = { x: x + 330, y: 214, w: 170, h: 32 };
      return [
        ...head(x, 'History', 'View a history of all alert events generated by your Grafana-managed alert rules.', 760),
        lbl(x, 150, 'All alert events are displayed regardless of whether silences or mute timings are set.', { tone: 'textMuted', box: 760 }),
        lbl(x, 206, 'Filter by:', { size: 'small', tone: 'textMuted', box: 80 }),
        { block: 'field', x, y: 214, w: 150, placeholder: 'Labels:' },
        { block: 'dropdown', x: x + 160, y: 214, w: 160, value: 'Start state: All' }, { block: 'dropdown', x: endState.x, y: 214, w: 170, value: 'End state: All' },
        btn(FW - 16 - 150, 214, 150, 'Last 1 hour', 'secondary', 'clock'),
        lbl(x, 284, 'Alert Events', { weight: 500, box: 200 }),
        { block: 'table', x, y: 298, w: FW - x - 16, columns: [{ title: 'Timestamp', w: 3 }, { title: 'State', w: 2 }, { title: 'Alert rule', w: 3 }, { title: 'Instance', w: 5 }], rows: [
          ['2026-11-11 10:17:57', 'Normal', 'Guide high 5xx ratio', 'team=bookshelf-guides, severity=critical'],
          ['2026-11-11 10:15:50', 'Alerting', 'Guide high 5xx ratio', 'team=bookshelf-guides, severity=critical'],
          ['2026-11-11 10:14:50', 'Pending', 'Guide high 5xx ratio', 'team=bookshelf-guides, severity=critical'],
        ] },
        ...marks([[rows.History, 16], [endState, 17]]),
      ];
    } }),
  });
}

// 07: the empty panel editor with the Alert list card (step 20)
{
  const e = gEditor({ right: 'empty', crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'] });
  figures.push({
    id: '07-choose-alert-list',
    alt: 'Panel editor of a new panel on the dashboard Bookshelf (guides): under Start without data the cards Text, Alert list and Dashboard list are offered and the Alert list card is marked by callout 21',
    width: FW, height: 640,
    nodes: e.nodes.concat(mark({ x: 928, y: 364, w: 116, h: 52 }, 21)),
  });
}

// An alert list row: state pill, rule name, labels.
const alertRow = (x, y, state, pillStr, name) => [
  { block: 'pill', x, y, str: pillStr, state }, lbl(x + 88, y + 14, name, { weight: 500, box: 260 }),
  lbl(x + 88, y + 34, 'team=bookshelf-guides', { size: 'small', tone: 'textMuted', box: 260 }),
];

// 08: the Alert list options pane (steps 21 to 23)
{
  const R = { x: 792, w: 272 };
  const ix = R.x + 12, iw = R.w - 24;
  const g = { title: { x: ix, y: 252, w: iw, h: 32 }, name: { x: ix, y: 392, w: iw, h: 32 }, states: { x: ix, y: 472, w: iw, h: 138 } };
  const sec = (y, label, open) => [ico(R.x + 8, y + 8, open ? 'chevronDown' : 'chevronRight'), lbl(R.x + 32, y + 21, label, { weight: 500, box: 220 }), box(R.x, y + 32, R.w, 1, { fill: 'border' })];
  const states = [['Alerting / Firing', true], ['Pending', true], ['Recovering', false], ['No Data', false], ['Normal', false], ['Error', false]];
  figures.push({
    id: '08-alert-list-options',
    alt: 'Panel editor with the Alert list options pane: the Title field holds Alerts (guides) (callout 22), the Alert name filter holds Guide (callout 23) and the Alert state filter has Alerting or Firing and Pending ticked (callout 24); the preview lists the firing rule Guide high 5xx ratio',
    width: FW, height: 640,
    nodes: grafanaFrame({ h: 640, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'], children: [
      btn(FW - 16 - 72, 58, 72, 'Back'), btn(FW - 16 - 72 - 8 - 90, 58, 90, 'Discard'), btn(FW - 16 - 72 - 8 - 90 - 8 - 70, 58, 70, 'Save', 'primary'),
      { block: 'panel', x: 16, y: 100, w: 760, h: 532, title: 'Alerts (guides)' },
      ...alertRow(32, 140, 'firing', 'Alerting', 'Guide high 5xx ratio'),
      box(R.x, 100, R.w, 532, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(R.x + 12, 124, 'Alert list', { weight: 600, box: 120 }), btn(R.x + R.w - 12 - 76, 106, 76, 'Change'),
      { block: 'field', x: ix, y: 146, w: iw, placeholder: 'Search options' },
      ...sec(190, 'Panel options', true),
      { block: 'field', x: ix, y: 232, w: iw, label: 'Title', value: 'Alerts (guides)' },
      ...sec(296, 'Options', false),
      ...sec(330, 'Filter', true),
      { block: 'field', x: ix, y: 372, w: iw, label: 'Alert name', value: 'Guide' },
      ...sec(440, 'Alert state filter', true),
      ...states.map(([t, on], i) => ({ block: 'checkbox', x: ix, y: 480 + i * 22, label: t, checked: on, box: 200 })),
      ...marks([[g.title, 22], [g.name, 23], [g.states, 24]]),
    ] }),
  });
}

// 09: Alerting > Alert rules, the More menu (step 25)
{
  const more = { x: FW - 16 - 100, y: 70, w: 100, h: 32 };
  figures.push({
    id: '09-alert-rules-more',
    alt: 'Alert rules page with the buttons New alert rule and More at the top right; the More button is marked by callout 26 and opens the entry for a new Grafana recording rule',
    width: FW, height: 280,
    nodes: grafanaFrame({ h: 280, crumbs: ['Alerting', 'Alert rules'], children: [
      ...head(16, 'Alert rules', 'Rules that determine whether an alert will fire'),
      btn(more.x, 70, 100, 'More', 'secondary', 'chevronDown'), btn(more.x - 8 - 160, 70, 160, 'New alert rule', 'primary', 'plus'),
      { block: 'tabs', x: 16, y: 148, w: 420, tabs: ['Alert rules', 'Recently deleted'], active: 0 },
      { block: 'field', x: 16, y: 196, w: 420, placeholder: 'Search by name or enter filter query...' },
      ...mark(more, 26),
    ] }),
  });
}

// 10: the recording rule form, values with plain captions (steps 26 to 30)
{
  const g = {
    name: { x: 16, y: 144, w: 400, h: 32 }, metric: { x: 440, y: 144, w: 520, h: 32 }, query: { x: 16, y: 262, w: 944, h: 56 },
    folder: { x: 16, y: 372, w: 620, h: 32 }, save: { x: 16, y: 450, w: 130, h: 32 },
  };
  const runs = [
    { t: 'sum', kind: 'keyword' }, { t: ' by (status) (' }, { t: 'rate', kind: 'keyword' }, { t: '(http_server_requests_seconds_count{' },
    { t: 'application', kind: 'label' }, { t: '=' }, { t: '"bookshelf"', kind: 'string' }, { t: '}[' }, { t: '1m', kind: 'number' }, { t: ']))' },
  ];
  figures.push({
    id: '10-recording-rule-form',
    alt: 'Form of a new Grafana recording rule, shown with its values: the rule name Guide request rate (callout 27), the metric name guide:http_server_requests:rate1m (callout 28), the Prometheus query for the request rate by status (callout 29), the folder Guides and the evaluation group guide-eval (callout 30) and the Save rule button (callout 31)',
    width: FW, height: 520,
    nodes: grafanaFrame({ h: 520, crumbs: ['Alerting', 'Alert rules', 'New Grafana recording rule'], children: [
      lbl(16, 100, 'New Grafana recording rule', { size: 'heading', weight: 500, box: 640 }),
      { block: 'field', x: 16, y: 124, w: 400, label: 'Rule name', value: 'Guide request rate' },
      { block: 'field', x: 440, y: 124, w: 520, label: 'Metric name', value: 'guide:http_server_requests:rate1m', mono: true },
      lbl(16, 214, 'Query', { size: 'small', weight: 500, box: 100 }),
      { block: 'dropdown', x: 16, y: 222, w: 200, value: 'Prometheus' },
      { block: 'queryEditor', ...g.query, lines: [runs], lineNumbers: false },
      lbl(16, 352, 'Folder and evaluation group', { size: 'small', weight: 500, box: 240 }),
      { block: 'dropdown', x: 16, y: 372, w: 300, value: 'Guides' }, { block: 'dropdown', x: 336, y: 372, w: 300, value: 'guide-eval' },
      btn(g.save.x, g.save.y, 130, 'Save rule', 'primary'), btn(154, g.save.y, 90, 'Cancel'),
      ...marks([[g.name, 27], [g.metric, 28], [g.query, 29], [g.folder, 30], [g.save, 31]]),
    ] }),
  });
}

// 11: Explore with the recorded metric (step 31)
{
  const runs = [{ t: 'guide:http_server_requests:rate1m', kind: undefined }];
  const g = { editor: { x: 16, y: 112, w: 1048, h: 40 } };
  figures.push({
    id: '11-explore-recorded',
    alt: 'Explore with the Prometheus data source in Code mode: the query guide:http_server_requests:rate1m, marked by callout 32, returns one line for the status 200 and one for 404, the series the recording rule writes',
    width: FW, height: 480,
    nodes: grafanaFrame({ h: 480, crumbs: ['Explore'], children: [
      { block: 'dropdown', x: 16, y: 58, w: 200, value: 'Prometheus' },
      btn(FW - 16 - 120, 58, 120, 'Run query', 'primary'),
      { block: 'queryEditor', ...g.editor, lines: [runs], lineNumbers: false },
      { block: 'panel', x: 16, y: 172, w: 1048, h: 290, title: 'Graph' },
      reqChart(24, 198, 1032, 260),
      ...mark(g.editor, 32),
    ] }),
  });
}

// 12: the dashboard with the alert list panel (What you build)
{
  const tb = gDashToolbar({ view: true });
  figures.push({
    id: '12-result',
    alt: 'The dashboard Bookshelf (guides) in view mode with two panels: the request rate by status and the new Alerts (guides) panel, an alert list that shows the rule Guide high 5xx ratio with the state Alerting',
    width: FW, height: 440,
    nodes: grafanaFrame({ h: 440, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
      ...tb.nodes,
      { block: 'panel', x: 16, y: 106, w: 520, h: 300, title: 'Requests per second by status' }, reqChart(24, 132, 504, 270),
      { block: 'panel', x: 552, y: 106, w: 512, h: 300, title: 'Alerts (guides)' },
      ...alertRow(568, 142, 'firing', 'Alerting', 'Guide high 5xx ratio'),
    ] }),
  });
}

export default { product: 'grafana', guide: 'g18', figures };
