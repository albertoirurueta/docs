// Figures of the Kibana guide K15, "Manage alerts, maintenance windows and cases" (guide-manage-alerts-and-cases.adoc).
// Facts: guides-brief/kibana-facts.md section 10 (Alerts page, row actions, alert details flyout, maintenance window create
// page, Create case form) and section 16 (Snooze, Acknowledge and Mark as untracked; no Mute).
// NOT VERIFIED there, drawn generically with no label invented beyond the Elastic documentation: the rules list controls
// (snooze, enable switch), the snooze popover (never drawn), the case page after creation (title, status, Activity tab,
// comment box, Visualization control, attributes) and the way a case is closed. Sample values in the Alerts table are
// plausible for the lab, not measured. A figure shows the screen the step starts from; callout numbers are step numbers.
import { FW, lbl, box, btn, ico, mark, marks, kibanaFrame } from '../lib/shells.mjs';

const figures = [];

const ROWS = [
  ['/api/search', '0.7', 'Nov 11, 10:31', '4 min'],
  ['/api/books', '0.66', 'Nov 11, 10:31', '4 min'],
  ['/api/loans', '0.69', 'Nov 11, 10:32', '3 min'],
];
const MENU_ITEMS = ['Add to existing case', 'Add to new case', 'Acknowledge', 'Mark as untracked', 'Snooze', 'Edit tags'];

// The Alerts page of Observability: counters, filters and a table with three Active alerts. `menuRow` opens the row menu.
function alertsPage({ h = 520, menuRow, hot, flyout = false, children }) {
  const fr = kibanaFrame({ h, crumbs: ['Observability', 'Alerts'] });
  const g = { menu: fr.geo.menu };
  const T = 250, RH = 40, X = 16;
  const n = [
    lbl(16, 140, 'Alerts', { size: 'heading', weight: 500, tone: 'textStrong', box: 200 }),
    lbl(1036, 126, 'Rule count 3   Disabled 0   Snoozed 0   Errors 0', { size: 'small', tone: 'textMuted', anchor: 'end', box: 420 }),
  ];
  g.manage = { x: 944, y: 136, w: 120, h: 20 };
  n.push(lbl(1064, 150, 'Manage Rules', { size: 'small', tone: 'link', anchor: 'end', weight: 500, box: 120 }));
  n.push({ block: 'field', x: 16, y: 164, w: 520, placeholder: 'Search alerts (e.g. kibana.alert.evaluation.threshold > 75)' });
  n.push(btn(544, 164, 150, 'Last 24 hours', 'secondary', 'clock'));
  ['Status', 'Rule', 'Group', 'Tags'].forEach((t, i) => n.push(btn(16 + i * 96, 206, 88, t, 'secondary', 'chevronDown')));
  n.push({ block: 'table', x: X, y: T, w: 1048, rowHeight: RH, columns: [{ title: 'Actions', w: 1 }, { title: 'Alert Status', w: 1.2 }, { title: 'Triggered', w: 1.5 }, { title: 'Duration', w: 1 }, { title: 'Rule name', w: 2.4 }, { title: 'Group', w: 1.4 }, { title: 'Observed value', w: 1.3 }, { title: 'Threshold', w: 1 }],
    rows: ROWS.map(([grp, val, trig, dur]) => ['', '', trig, dur, 'Guide Bookshelf error ratio', grp, val, '> 0.3']) });
  g.rows = ROWS.map((_, i) => {
    const ry = T + RH * (i + 1);
    n.push(ico(X + 14, ry + 12, 'search', 'link'), ico(X + 44, ry + 12, 'dots', 'text'));
    n.push({ block: 'pill', x: X + 98, y: ry + 10, str: 'Active', state: 'firing' });
    return { details: { x: X + 8, y: ry + 6, w: 28, h: 28 }, more: { x: X + 38, y: ry + 6, w: 28, h: 28 } };
  });
  if (menuRow !== undefined) {
    const m = g.rows[menuRow].more;
    const mw = 240, mx = m.x, my = m.y + m.h + 4;
    const out = [box(mx, my, mw, 8 + MENU_ITEMS.length * 30 + 6, { fill: 'surface', stroke: 'borderStrong', radius: 6 })];
    g.items = {};
    MENU_ITEMS.forEach((it, i) => {
      const iy = my + 8 + i * 30;
      if (i === hot) out.push(box(mx + 4, iy - 2, mw - 8, 28, { fill: 'navActiveBg', radius: 4 }));
      out.push(lbl(mx + 14, iy + 17, it, { weight: i === hot ? 500 : 400, box: mw - 28 }));
      g.items[it] = { x: mx + 4, y: iy - 2, w: mw - 8, h: 28 };
    });
    n.push(...out);
  }
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(g) : children ?? []));
  return { nodes: fr.nodes, g };
}

// 01: the Alerts table (steps 1 and 2)
{
  const a = alertsPage({ children: (g) => marks([[g.menu, 1], [g.rows[0].details, 2]]) });
  figures.push({
    id: '01-alerts-table',
    alt: 'Observability Alerts page of Kibana 9.5 with the counters Rule count, Disabled, Snoozed and Errors, the filters, and a table of three Active alerts; the menu button of the second bar is marked by callout 1 and the Alert details icon of the first row by callout 2',
    width: FW, height: 520, nodes: a.nodes,
  });
}

// 02: the alert details flyout (steps 3 to 5)
{
  const H = 640;
  const a = alertsPage({ h: H });
  const fx = 344, fw = 720;
  const summary = { x: fx + 16, y: 262, w: fw - 32, h: 300 };
  const metaTab = { x: fx + 100, y: 156, w: 100, h: 32 };
  const close = { x: fx + fw - 40, y: 106, w: 28, h: 28 };
  const rowsTxt = [['Status', 'Active'], ['Workflow tags', '-'], ['Triggered', 'Nov 11, 10:31'], ['Duration', '4 min'], ['Observed value', '0.7'], ['Threshold', '> 0.3'], ['Rule name', 'Guide Bookshelf error ratio'], ['Rule type', 'Custom threshold'], ['Cases', '-']];
  const k = [
    { block: 'flyout', x: fx, y: 96, w: fw, h: H - 96, title: 'Guide Bookshelf error ratio' },
    lbl(fx + 16, 143, 'Custom threshold rule breached', { size: 'small', tone: 'textMuted', box: 300 }),
    { block: 'tabs', x: fx + 8, y: 156, w: 220, tabs: ['Overview', 'Metadata'], active: 0 },
    lbl(fx + 16, 224, 'Reason', { weight: 600 }),
    lbl(fx + 16, 246, 'A / B is 0.7 in the last 1 min. Alert when above 0.3.', { size: 'small', tone: 'textMuted', box: fw - 32 }),
    box(summary.x, summary.y, summary.w, summary.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(summary.x + 14, summary.y + 24, 'Document Summary', { weight: 600, box: 300 }),
  ];
  rowsTxt.forEach(([k1, v], i) => {
    k.push(lbl(summary.x + 14, summary.y + 52 + i * 27, k1, { size: 'small', tone: 'textMuted', box: 180 }), lbl(summary.x + 220, summary.y + 52 + i * 27, v, { size: 'small', box: 420 }));
  });
  a.nodes[0].children.push(...k, ...marks([[summary, 3], [metaTab, 4], [close, 5]]));
  figures.push({
    id: '02-alert-details',
    alt: 'Alert details flyout of Kibana 9.5 over the Alerts table: the Reason text and the Document Summary table with Status, Triggered, Duration, Observed value, Threshold, Rule name, Rule type and Cases are marked by callout 3, the Metadata tab by callout 4 and the close button by callout 5',
    width: FW, height: H, nodes: a.nodes,
  });
}

// 03: Acknowledge and Mark as untracked in the row menu (steps 6 and 7)
{
  const a = alertsPage({ h: 560, menuRow: 0, hot: 2, children: (g) => marks([[g.items.Acknowledge, 6], [g.items['Mark as untracked'], 7]]) });
  figures.push({
    id: '03-acknowledge-menu',
    alt: 'Alerts table of Kibana 9.5 with the More actions menu of the first row open: Add to existing case, Add to new case, Acknowledge, Mark as untracked, Snooze and Edit tags; Acknowledge is marked by callout 6 and Mark as untracked by callout 7',
    width: FW, height: 560, nodes: a.nodes,
  });
}

// 04: Snooze in the row menu (step 8)
{
  const a = alertsPage({ h: 600, menuRow: 2, hot: 4, children: (g) => marks([[g.items.Snooze, 8], [g.manage, 10]]) });
  figures.push({
    id: '04-snooze-menu',
    alt: 'Alerts table of Kibana 9.5 with the More actions menu of the third row open; the entry Snooze is marked by callout 8 and the Manage Rules link at the top right by callout 10',
    width: FW, height: 600, nodes: a.nodes,
  });
}

// 05: the rules list: snooze and disable (steps 11 and 12)
{
  const H = 420;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Rules'] });
  const items = [{ label: 'Data' }, { label: 'Alerts and Insights' }, { label: 'Alerts' }, { label: 'Rules', active: true }, { label: 'Cases' }, { label: 'Connectors' }, { label: 'Reporting' }, { label: 'Maintenance Windows' }];
  const ry = 272;
  const snooze = { x: 700, y: ry + 6, w: 28, h: 28 };
  const sw = { x: 780, y: ry + 8, w: 32 + 10 + 60, h: 24 };
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 210, h: H - 96, items },
    lbl(232, 140, 'Rules', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 }),
    lbl(232, 166, 'Manage and monitor all of your rules in one place.', { tone: 'textMuted', box: 520 }),
    { block: 'tabs', x: 232, y: 190, w: 300, tabs: ['Rules', 'Logs'], active: 0 },
    { block: 'table', x: 232, y: 232, w: 832, rowHeight: 40, columns: [{ title: 'Rule', w: 3 }, { title: 'Interval', w: 1 }, { title: 'Snooze', w: 1 }, { title: 'Status', w: 1.5 }], rows: [['Guide Bookshelf error ratio', '1 min', '', '']] },
    ico(snooze.x + 6, snooze.y + 6, 'bell', 'text'),
    { block: 'toggle', x: sw.x, y: sw.y, label: 'Enabled', on: true, box: 80 },
    ...marks([[snooze, 11], [sw, 12]]),
  );
  figures.push({
    id: '05-rules-list',
    alt: 'Rules page of Stack Management in Kibana 9.5, drawn generically, with one rule row Guide Bookshelf error ratio; its snooze control is marked by callout 11 and its Enabled switch by callout 12',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 06: the Create maintenance window page (steps 15 to 18)
{
  const H = 640;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Maintenance Windows', 'Create'] });
  const items = [{ label: 'Data' }, { label: 'Alerts and Insights' }, { label: 'Alerts' }, { label: 'Rules' }, { label: 'Cases' }, { label: 'Connectors' }, { label: 'Reporting' }, { label: 'Maintenance Windows', active: true }];
  const name = { x: 232, y: 214, w: 520, h: 32 };
  const sched = { x: 232, y: 300, w: 832, h: 120 };
  const filt = { x: 232, y: 470, w: 832, h: 80 };
  const create = { x: FW - 16 - 230, y: H - 52, w: 230, h: 32 };
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 210, h: H - 96, items },
    lbl(232, 132, 'Create maintenance window', { size: 'heading', weight: 500, tone: 'textStrong', box: 600 }),
    lbl(232, 156, 'Schedule a single or recurring period in which new alerts do not send notifications.', { size: 'small', tone: 'textMuted', box: 700 }),
    { block: 'field', x: name.x, y: name.y - 20, w: name.w, label: 'Name', value: 'Guide deploy window' },
    lbl(232, 284, 'Timeframe', { weight: 600 }),
    lbl(232, 302, 'Define the start and end time when events should be affected by the window.', { size: 'small', tone: 'textMuted', box: 700 }),
    box(sched.x, sched.y + 10, sched.w, sched.h - 10, { fill: 'surface', stroke: 'border', radius: 6 }),
    { block: 'field', x: 248, y: 330, w: 330, label: 'Schedule', value: 'Nov 11, 10:30 to Nov 11, 11:30' },
    { block: 'dropdown', x: 596, y: 330, w: 200, label: 'Time zone', value: 'Europe/Madrid' },
    { block: 'toggle', x: 816, y: 357, label: 'Repeat', on: false, box: 120 },
    lbl(232, 456, 'Filters', { weight: 600 }),
    box(filt.x, filt.y, filt.w, filt.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    { block: 'toggle', x: 248, y: 486, label: 'Filter alerts', on: true, box: 160 },
    { block: 'field', x: 248, y: 512, w: 800, value: 'kibana.alert.rule.name : "Guide Bookshelf error logs"', mono: true },
    btn(create.x - 92, create.y, 84, 'Cancel'), btn(create.x, create.y, create.w, 'Create maintenance window', 'primary'),
    ...marks([[name, 15], [{ x: 248, y: 350, w: 548, h: 32 }, 16], [{ x: 248, y: 484, w: 800, h: 60 }, 17], [create, 18]]),
  );
  figures.push({
    id: '06-maintenance-window',
    alt: 'Create maintenance window page of Kibana 9.5 with the sections Name, Timeframe and Filters: the name Guide deploy window is marked by callout 15, the Schedule and Time zone by callout 16, the Filter alerts query on the rule name by callout 17 and the Create maintenance window button by callout 18',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 07: Add to new case in the row menu (step 19)
{
  const a = alertsPage({ h: 560, menuRow: 0, hot: 1, children: (g) => mark(g.items['Add to new case'], 19) });
  figures.push({
    id: '07-add-to-new-case-menu',
    alt: 'Alerts table of Kibana 9.5 with the More actions menu of the first row open; the entry Add to new case is marked by callout 19',
    width: FW, height: 560, nodes: a.nodes,
  });
}

// 08: the Create case form (steps 20 to 23)
{
  const H = 640;
  const fr = kibanaFrame({ h: H, crumbs: ['Cases', 'Create case'] });
  const name = { x: 16, y: 226, w: 520, h: 32 };
  const tags = { x: 16, y: 292, w: 520, h: 32 };
  const desc = { x: 16, y: 370, w: 760, h: 120 };
  const create = { x: FW - 16 - 120, y: H - 52, w: 120, h: 32 };
  fr.nodes[0].children.push(
    lbl(16, 132, 'Create case', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 }),
    box(16, 148, 28, 28, { fill: 'primary', radius: 14 }), lbl(30, 168, '2', { anchor: 'middle', tone: 'textOnPrimary', weight: 600 }), lbl(54, 168, 'Case fields', { size: 'title', weight: 600, box: 300 }),
    { block: 'field', x: name.x, y: name.y - 20, w: name.w, label: 'Name', value: 'Guide error spike' },
    { block: 'dropdown', x: 560, y: name.y - 20, w: 216, label: 'Severity', value: 'Low' },
    { block: 'field', x: tags.x, y: tags.y - 20, w: tags.w, label: 'Tags', value: 'guide' },
    lbl(16, 356, 'Description', { size: 'small', weight: 500 }),
    box(desc.x, desc.y, desc.w, desc.h, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }),
    lbl(28, 394, 'The error ratio of the Bookshelf logs is above 0.3 for every URI.', { size: 'small', box: 700 }),
    btn(create.x - 92, create.y, 84, 'Cancel'), btn(create.x, create.y, create.w, 'Create case', 'primary'),
    ...marks([[name, 20], [tags, 21], [desc, 22], [create, 23]]),
  );
  figures.push({
    id: '08-create-case',
    alt: 'Create case form of Kibana 9.5 drawn from the Create case page: the Name Guide error spike is marked by callout 20, the tag guide by callout 21, the Description by callout 22 and the Create case button by callout 23; Severity keeps its default Low',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// the case page, drawn generically
function casePage({ status, closed = false, comment = false, children }) {
  const H = 600;
  const fr = kibanaFrame({ h: H, crumbs: ['Cases', 'Guide error spike'] });
  const g = {};
  const st = { x: 892, y: 112, w: 172, h: 32 };
  g.status = st;
  const n = [
    lbl(16, 140, 'Guide error spike', { size: 'heading', weight: 500, tone: 'textStrong', box: 500 }),
    { block: 'pill', x: 16, y: 154, str: closed ? 'Closed' : 'Open', state: closed ? 'normal' : 'pending' },
    btn(st.x, st.y, st.w, status, 'secondary', 'chevronDown'),
    { block: 'tabs', x: 16, y: 190, w: 400, tabs: ['Activity', 'Alerts', 'Files'], active: 0 },
    box(16, 240, 720, 70, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(30, 264, 'elastic added an alert from Guide Bookshelf error ratio', { size: 'small', box: 680 }),
    lbl(30, 286, 'Nov 11, 10:41', { size: 'small', tone: 'textMuted', box: 300 }),
    box(752, 240, 312, 190, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(766, 264, 'Attributes', { weight: 600, box: 200 }),
    lbl(766, 290, 'Assignees: none', { size: 'small', tone: 'textMuted', box: 280 }), lbl(766, 312, 'Severity: Low', { size: 'small', tone: 'textMuted', box: 280 }), lbl(766, 334, 'Tags: guide', { size: 'small', tone: 'textMuted', box: 280 }),
  ];
  let y = 330;
  if (comment) {
    n.push(box(16, 326, 720, 70, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(30, 350, 'elastic added a comment', { size: 'small', tone: 'textMuted', box: 400 }), lbl(30, 374, 'Error ratio above 0.3 on all URIs since the failing mode started.', { size: 'small', box: 680 }));
    y = 412;
  }
  const ed = { x: 16, y, w: 720, h: 150 };
  g.comment = ed;
  n.push(box(ed.x, ed.y, ed.w, ed.h, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }), lbl(ed.x + 14, ed.y + 52, comment ? 'Add a comment' : 'Error ratio above 0.3 on all URIs since the failing mode started.', { size: 'small', tone: comment ? 'textFaint' : 'text', box: 690 }));
  g.viz = { x: ed.x + 8, y: ed.y + 112, w: 150, h: 32 };
  n.push(btn(g.viz.x, g.viz.y, g.viz.w, 'Visualization', 'secondary', 'plus'), btn(ed.x + ed.w - 8 - 150, ed.y + 112, 150, 'Add comment', 'primary'));
  g.add = { x: ed.x + ed.w - 8 - 150, y: ed.y + 112, w: 150, h: 32 };
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(g) : children ?? []));
  return { nodes: fr.nodes, g, H };
}

// 09: the case page with the comment box (steps 24 to 26)
{
  const c = casePage({ status: 'Open', children: (g) => marks([[g.comment, 24], [g.viz, 25], [g.status, 26]]) });
  figures.push({
    id: '09-case-comment-and-status',
    alt: 'Case page Guide error spike in Kibana 9.5, drawn generically, with the Activity tab: the comment box holding the text is marked by callout 24, the Visualization control of its toolbar by callout 25 and the status control, showing Open, by callout 26',
    width: FW, height: c.H, nodes: c.nodes,
  });
}

// 10: the closed case with its comment (What you build)
{
  const c = casePage({ status: 'Closed', closed: true, comment: true });
  figures.push({
    id: '10-result',
    alt: 'Case page Guide error spike in Kibana 9.5, drawn generically, with the status Closed, the alert attached from the Alerts table and the comment added to the activity feed',
    width: FW, height: c.H, nodes: c.nodes,
  });
}

export default { product: 'kibana', guide: 'k15', figures };
