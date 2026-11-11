// Figures of the Kibana guide K14, "Observability rules and SLOs" (guide-observability-rules-and-slos.adoc).
// Facts: guides-brief/kibana-facts.md section 9 (SLO create page, Discover More menu), section 8 (Stack Management menu,
// Rules page, rule picker flyout, Elasticsearch query rule form, Details step) and section 10 (Alerts table).
// NOT VERIFIED there, drawn generically with the labels of the Elastic documentation: the form of the Custom threshold
// rule (Select a data view, aggregations A and B with a KQL filter, Custom equation, Is above, Group alerts by), the
// Set objectives and Describe SLO blocks of the SLO page (only the block names are verified), the SLOs list page, the
// SLO burn rate rule card and form, and the rule-type chooser that Discover's Create alert rule opens (never drawn).
// A figure shows the screen the step starts from; callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, kibanaFrame } from '../lib/shells.mjs';

const figures = [];

// Stack Management layout: left menu, active item highlighted.
const STACK_ITEMS = [
  { label: 'Data' }, { label: 'Alerts and Insights' }, { label: 'Alerts' }, { label: 'Rules', active: true },
  { label: 'Cases' }, { label: 'Connectors' }, { label: 'Reporting' }, { label: 'Maintenance Windows' },
];
const stackNav = (h) => ({ block: 'nav', x: 0, y: 96, w: 210, h: h - 96, items: STACK_ITEMS });
const rowOf = (i) => ({ x: 8, y: 96 + 8 + i * 34, w: 194, h: 32 });

// A rule page header (title, step badge).
const stepHead = (x, y, n, title) => [
  box(x, y, 26, 26, { fill: 'primary', radius: 13 }), lbl(x + 13, y + 18, String(n), { anchor: 'middle', tone: 'textOnPrimary', weight: 600 }),
  lbl(x + 38, y + 19, title, { size: 'title', weight: 600, box: 300 }),
];

// 01: the Rules page (steps 2 and 3)
{
  const H = 420;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Rules'] });
  const create = { x: FW - 16 - 130, y: 112, w: 130, h: 32 };
  fr.nodes[0].children.push(
    stackNav(H),
    lbl(232, 140, 'Rules', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 }),
    lbl(232, 166, 'Manage and monitor all of your rules in one place.', { tone: 'textMuted', box: 520 }),
    btn(create.x - 120, create.y, 112, 'Settings'), btn(create.x, create.y, create.w, 'Create rule', 'primary'),
    { block: 'tabs', x: 232, y: 190, w: 300, tabs: ['Rules', 'Logs'], active: 0 },
    { block: 'table', x: 232, y: 240, w: 832, columns: [{ title: 'Rule', w: 3 }, { title: 'Interval', w: 1 }, { title: 'Status', w: 1 }], rows: [['Guide Bookshelf error logs', '1 min', 'Enabled']] },
    ...marks([[rowOf(3), 2], [create, 3]]),
  );
  figures.push({
    id: '01-rules-page',
    alt: 'Rules page of Stack Management in Kibana 9.5 with the left menu open on Alerts and Insights; Rules in the left menu is marked by callout 2 and the Create rule button by callout 3',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 02: the rule picker flyout (step 4)
{
  const H = 560;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Rules'] });
  const fx = 520, fw = 544;
  const cats = ['All 32', 'Stack Monitoring 14', 'Stack Alerts 5', 'APM and User Experience 4', 'Machine Learning 2', 'Synthetics and Uptime 2', 'Infrastructure 2', 'Observability 1', 'SLOs 1', 'Logs 1'];
  const card = { x: fx + 200, y: 250, w: 320, h: 78 };
  const k = [
    stackNav(H),
    { block: 'flyout', x: fx, y: 96, w: fw, h: H - 96, title: 'Create new rule' },
    { block: 'tabs', x: fx + 8, y: 142, w: 240, tabs: ['Rule type', 'Template'], active: 0 },
    { block: 'field', x: fx + 16, y: 190, w: fw - 32, placeholder: 'Search' },
  ];
  cats.forEach((c, i) => k.push(lbl(fx + 20, 262 + i * 26, c, { size: 'small', box: 170, weight: i === 7 ? 600 : 400, tone: i === 7 ? 'link' : 'text' })));
  [['Custom threshold', 'Alert when any Observability data type reaches or exceeds a given value.', 'OBSERVABILITY']].forEach(([t, d, o]) => {
    k.push(box(card.x, card.y, card.w, card.h, { fill: 'surface', stroke: 'borderStrong', radius: 6 }), lbl(card.x + 12, card.y + 24, t, { weight: 600, box: 296 }),
      lbl(card.x + 12, card.y + 44, d.slice(0, 38), { size: 'small', tone: 'textMuted', box: 296 }), lbl(card.x + 12, card.y + 60, d.slice(38), { size: 'small', tone: 'textMuted', box: 296 }),
      lbl(card.x + card.w - 12, card.y + 24, o, { size: 'small', tone: 'textMuted', anchor: 'end', box: 120 }));
  });
  fr.nodes[0].children.push(...k, ...mark(card, 4));
  figures.push({
    id: '02-rule-picker',
    alt: 'Create new rule flyout of Kibana 9.5 with the Rule type tab, a category list with Observability selected and the Custom threshold card; the card is marked by callout 4',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// the Custom threshold page frame (inside Stack Management)
const rulePage = (h, children) => {
  const fr = kibanaFrame({ h, crumbs: ['Stack Management', 'Rules', 'Create'] });
  fr.nodes[0].children.push(stackNav(h), lbl(232, 128, 'Custom threshold rule', { size: 'heading', weight: 500, tone: 'textStrong', box: 500 }), ...children);
  return fr.nodes;
};

// 03: data view and the two document counts (steps 5 to 7)
{
  const H = 600;
  const dv = { x: 232, y: 196, w: 360, h: 32 };
  const fa = { x: 456, y: 330, w: 330, h: 32 };
  const fb = { x: 456, y: 410, w: 330, h: 32 };
  const nodes = rulePage(H, [
    ...stepHead(232, 150, 1, 'Definition'),
    { block: 'dropdown', x: dv.x, y: dv.y - 20, w: dv.w, label: 'Select a data view', value: 'Bookshelf logs (guides)' },
    { block: 'field', x: 616, y: dv.y - 20, w: 448, label: 'Define query filter (optional)', placeholder: 'Filter your data using KQL syntax' },
    lbl(232, 288, 'Set rule conditions', { weight: 600, box: 300 }),
    box(232, 300, 832, 76, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(248, 330, 'A', { weight: 600 }), { block: 'dropdown', x: 280, y: 314, w: 160, value: 'Count' },
    { block: 'field', ...fa, value: 'severity_text : "ERROR"', mono: true },
    lbl(804, 336, 'KQL filter of the aggregation', { size: 'small', tone: 'textMuted', box: 250 }),
    box(232, 384, 832, 76, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(248, 414, 'B', { weight: 600 }), { block: 'dropdown', x: 280, y: 398, w: 160, value: 'Count' },
    { block: 'field', ...fb, placeholder: 'No filter: all documents' },
    btn(232, 474, 160, 'Add aggregation', 'secondary', 'plus'),
    ...marks([[dv, 5], [fa, 6], [fb, 7]]),
  ]);
  figures.push({
    id: '03-aggregations',
    alt: 'Definition step of the Custom threshold rule in Kibana 9.5: the data view Bookshelf logs (guides) is marked by callout 5, aggregation A is a Count with the KQL filter severity_text : "ERROR" marked by callout 6, and aggregation B is a Count without a filter marked by callout 7',
    width: FW, height: H, nodes,
  });
}

// 04: equation, threshold, group by and schedule (steps 8 to 11)
{
  const H = 640;
  const eq = { x: 232, y: 200, w: 300, h: 32 };
  const cond = { x: 232, y: 270, w: 560, h: 32 };
  const grp = { x: 232, y: 340, w: 360, h: 32 };
  const sch = { x: 232, y: 430, w: 300, h: 32 };
  const nodes = rulePage(H, [
    ...stepHead(232, 150, 1, 'Definition'),
    { block: 'field', x: eq.x, y: eq.y - 20, w: eq.w, label: 'Custom equation', value: 'A / B', mono: true },
    lbl(552, 221, 'Ratio of ERROR lines to all lines', { size: 'small', tone: 'textMuted', box: 240 }),
    lbl(232, 262, 'Condition', { size: 'small', weight: 500 }),
    { block: 'dropdown', x: 232, y: 270, w: 150, value: 'Is above' },
    { block: 'field', x: 390, y: 270, w: 110, value: '0.3' },
    lbl(512, 291, 'for the last', { size: 'small', tone: 'textMuted', box: 80 }),
    { block: 'field', x: 596, y: 270, w: 60, value: '1' }, { block: 'dropdown', x: 664, y: 270, w: 128, value: 'minute' },
    { block: 'field', x: grp.x, y: grp.y - 20, w: grp.w, label: 'Group alerts by', value: 'attributes.uri', mono: true },
    lbl(232, 402, 'Rule schedule', { weight: 600 }),
    lbl(232, 422, 'Set the frequency to check the alert conditions', { size: 'small', tone: 'textMuted', box: 400 }),
    lbl(240, 452, 'Every', { size: 'small', box: 50 }), { block: 'field', x: 290, y: 436, w: 70, value: '1' }, { block: 'dropdown', x: 368, y: 436, w: 150, value: 'minute' },
    // preview of the ratio per group
    box(812, 150, 252, 300, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(826, 174, 'Preview (sample)', { size: 'small', weight: 600, tone: 'textMuted', box: 220 }),
    { block: 'line', x: 820, y: 186, w: 240, h: 250, series: [{ name: '/api/search', points: [0.04, 0.05, 0.06, 0.55, 0.7, 0.68, 0.6, 0.08] }, { name: '/api/books', points: [0.03, 0.04, 0.05, 0.5, 0.66, 0.7, 0.58, 0.06], color: 'series.4' }], min: 0, max: 1, yLabels: ['0', '0.5', '1'], xLabels: ['10:00', '10:05'], legend: false },
    ...marks([[{ x: eq.x, y: eq.y, w: eq.w, h: eq.h }, 8], [{ x: 232, y: 270, w: 560, h: 32 }, 9], [grp, 10], [{ x: 232, y: 436, w: 290, h: 32 }, 11]]),
  ]);
  figures.push({
    id: '04-equation-and-group',
    alt: 'Definition step of the Custom threshold rule with the Custom equation A / B marked by callout 8, the condition Is above 0.3 for the last 1 minute marked by callout 9, Group alerts by attributes.uri marked by callout 10 and the Rule schedule Every 1 minute marked by callout 11',
    width: FW, height: H, nodes,
  });
}

// 05: step 3 Details (steps 12 to 14)
{
  const H = 490;
  const name = { x: 232, y: 214, w: 520, h: 32 };
  const tags = { x: 232, y: 286, w: 520, h: 32 };
  const create = { x: FW - 16 - 120, y: H - 52, w: 120, h: 32 };
  const nodes = rulePage(H, [
    ...stepHead(232, 150, 3, 'Details'),
    { block: 'field', x: name.x, y: name.y - 20, w: name.w, label: 'Rule name', value: 'Guide Bookshelf error ratio' },
    { block: 'field', x: tags.x, y: tags.y - 20, w: tags.w, label: 'Tags (optional)', value: 'guide' },
    lbl(232, 356, 'Investigation guide (optional)', { size: 'small', weight: 500 }),
    box(232, 366, 520, 36, { fill: 'inputBg', stroke: 'borderStrong', radius: 4 }),
    btn(232, H - 52, 84, 'Cancel'), btn(324, H - 52, 140, 'Show request'), btn(create.x, create.y, create.w, 'Create rule', 'primary'),
    ...marks([[name, 12], [tags, 13], [create, 14]]),
  ]);
  figures.push({
    id: '05-details',
    alt: 'Details step of the rule page in Kibana 9.5 with the Rule name Guide Bookshelf error ratio marked by callout 12, the tag guide marked by callout 13 and the Create rule button marked by callout 14',
    width: FW, height: H, nodes,
  });
}

// 06: Discover with the query and the More menu (steps 16 to 18)
{
  const H = 460;
  const fr = kibanaFrame({ h: H, crumbs: ['Discover'], actions: [{ label: 'Share', w: 90 }, { label: 'Query in ES|QL', w: 150 }, { label: 'More', w: 80 }, { label: 'Save', w: 80 }] });
  const qg = { x: 288, y: 152, w: 400, h: 32 };
  const row = { geo: { query: qg }, nodes: [
    { block: 'dropdown', x: 16, y: 152, w: 220, value: 'Bookshelf logs (guides)' }, btn(244, 152, 36, '+'),
    { block: 'field', ...qg, value: 'severity_text : "ERROR"', mono: true },
    btn(696, 152, 150, 'Last 15 minutes', 'secondary', 'clock'), btn(854, 152, 100, 'Refresh', 'secondary', 'refresh'),
  ] };
  const items = ['Open session', 'New session', 'Background searches', 'Export tab results', 'Inspect tab', 'Create alert rule'];
  const menuX = fr.geo.More.x + fr.geo.More.w - 220;
  const mn = (() => {
    const out = [box(menuX, 92, 220, 8 + items.length * 30 + 6, { fill: 'surface', stroke: 'borderStrong', radius: 6 })];
    const rows = [];
    items.forEach((it, i) => {
      const iy = 92 + 8 + i * 30;
      if (i === 5) out.push(box(menuX + 4, iy - 2, 212, 28, { fill: 'navActiveBg', radius: 4 }));
      out.push(lbl(menuX + 14, iy + 17, it, { weight: i === 5 ? 500 : 400, box: 196 }));
      rows.push({ x: menuX + 4, y: iy - 2, w: 212, h: 28 });
    });
    return { out, rows };
  })();
  fr.nodes[0].children.push(
    box(16, 104, 160, 32, { fill: 'surface', stroke: 'border', radius: 4 }), lbl(30, 125, 'Untitled', { weight: 500, box: 130 }),
    ...row.nodes,
    lbl(16, 220, 'Hits 234', { weight: 600, box: 200 }),
    { block: 'bar', x: 16, y: 240, w: 1048, h: 150, categories: ['10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08'], legend: false, max: 150, series: [{ name: 'ERROR', values: [3, 4, 2, 5, 38, 52, 46, 6], color: 'series.6' }] },
    ...mn.out,
    ...marks([[row.geo.query, 17], [mn.rows[5], 18]]),
  );
  figures.push({
    id: '06-discover-more-menu',
    alt: 'Discover in Kibana 9.5 on the data view Bookshelf logs (guides) with the query bar holding the ERROR filter, marked by callout 17, and the More menu open; its last entry Create alert rule is marked by callout 18',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 07: the Elasticsearch query rule form (steps 20 and 21)
{
  const H = 560;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Rules', 'Create'] });
  const dv = { x: 232, y: 206, w: 330, h: 32 };
  const q = { x: 232, y: 270, w: 832, h: 32 };
  const thr = { x: 232, y: 350, w: 600, h: 34 };
  fr.nodes[0].children.push(
    stackNav(H),
    lbl(232, 128, 'Elasticsearch query rule', { size: 'heading', weight: 500, tone: 'textStrong', box: 500 }),
    ...stepHead(232, 150, 1, 'Definition'),
    { block: 'dropdown', x: dv.x, y: dv.y - 20, w: dv.w, label: 'Select a data view', value: 'Bookshelf logs (guides)' },
    { block: 'field', x: q.x, y: q.y - 20, w: q.w, label: 'Define your query', value: 'severity_text : "ERROR"', mono: true },
    lbl(232, 340, 'Set the group, threshold, and time window', { size: 'small', tone: 'textMuted', box: 400 }),
    lbl(240, 372, 'WHEN count() OVER all documents IS ABOVE', { size: 'small', weight: 500, box: 330 }),
    { block: 'field', x: 580, y: 355, w: 70, value: '20' },
    lbl(662, 372, 'FOR THE LAST', { size: 'small', weight: 500, box: 100 }),
    { block: 'field', x: 770, y: 355, w: 50, value: '5' }, { block: 'dropdown', x: 828, y: 355, w: 120, value: 'minutes' },
    btn(232, 420, 120, 'Test query'),
    lbl(232, 490, 'Rule schedule: Every 1 minute', { size: 'small', tone: 'textMuted', box: 300 }),
    ...marks([[{ x: dv.x, y: dv.y, w: q.w, h: 96 }, 20], [{ x: 232, y: 346, w: 720, h: 40 }, 21]]),
  );
  figures.push({
    id: '07-discover-rule-form',
    alt: 'Definition step of the Elasticsearch query rule in Kibana 9.5: the data view Bookshelf logs (guides) and the KQL query severity_text : "ERROR" carried over from Discover are marked by callout 20, and the condition WHEN count() OVER all documents IS ABOVE 20 FOR THE LAST 5 minutes is marked by callout 21',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// the SLO create page frame
const sloPage = (h, children) => {
  const fr = kibanaFrame({ h, crumbs: ['SLOs', 'Create'] });
  fr.nodes[0].children.push(lbl(16, 130, 'Create SLO', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 }), ...children);
  return fr.nodes;
};

// 08: define the SLI (steps 26 to 31)
{
  const H = 660;
  const type = { x: 16, y: 220, w: 330, h: 32 };
  const idx = { x: 16, y: 292, w: 330, h: 32 };
  const good = { x: 16, y: 430, w: 500, h: 32 };
  const nodes = sloPage(H, [
    ...stepHead(16, 150, 1, 'Define SLI'),
    { block: 'dropdown', x: type.x, y: type.y - 20, w: type.w, label: 'Choose the SLI type', value: 'Custom Query' },
    { block: 'dropdown', x: idx.x, y: idx.y - 20, w: idx.w, label: 'Index', value: 'Bookshelf logs (guides)' },
    { block: 'field', x: 380, y: idx.y - 20, w: 330, label: 'Timestamp field', value: '@timestamp' },
    { block: 'field', x: 16, y: 342, w: 694, label: 'Query filter (Optional)', placeholder: 'Custom filter to apply on the index' },
    { block: 'field', x: good.x, y: good.y - 20, w: good.w, label: 'Good query', value: 'NOT severity_text : "ERROR"', mono: true },
    { block: 'field', x: 536, y: good.y - 20, w: 500, label: 'Total query (Optional)', placeholder: 'Leave empty: all documents' },
    { block: 'field', x: 16, y: 502, w: 330, label: 'Group by (Optional)', placeholder: 'Select an optional field to group by' },
    box(730, 170, 334, 260, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(744, 194, 'SLI preview (sample)', { size: 'small', weight: 600, tone: 'textMuted', box: 300 }),
    { block: 'line', x: 738, y: 206, w: 318, h: 214, series: [{ name: 'SLI', points: [99.6, 99.4, 99.7, 99.5, 30, 28, 33, 96, 99.6] }], min: 0, max: 100, yLabels: ['0', '50', '100'], xLabels: ['10:00', '10:10'], legend: false },
    ...marks([[type, 26], [idx, 27], [{ x: 380, y: idx.y, w: 330, h: 32 }, 28], [good, 29]]),
  ]);
  figures.push({
    id: '08-define-sli',
    alt: 'Create SLO page of Kibana 9.5, block 1 Define SLI: the SLI type Custom Query is marked by callout 26, the Index Bookshelf logs (guides) by callout 27, the Timestamp field @timestamp by callout 28 and the Good query NOT severity_text : "ERROR" by callout 29; the Total query is empty and an SLI preview chart sits at the right',
    width: FW, height: H, nodes,
  });
}

// 09: set objectives (steps 32 to 35)
{
  const H = 420;
  const win = { x: 16, y: 270, w: 230, h: 32 };
  const met = { x: 300, y: 270, w: 230, h: 32 };
  const tgt = { x: 566, y: 270, w: 150, h: 32 };
  const nodes = sloPage(H, [
    box(16, 148, 1048, 40, { fill: 'surface', stroke: 'border', radius: 6 }), box(30, 156, 24, 24, { fill: 'threshold.green', radius: 12 }), lbl(42, 173, '1', { anchor: 'middle', tone: 'textOnPrimary', weight: 600 }), lbl(66, 174, 'Define SLI', { weight: 600, box: 200 }),
    ...stepHead(16, 204, 2, 'Set objectives'),
    { block: 'dropdown', x: win.x, y: win.y - 20, w: win.w, label: 'Time window', value: '7 days' },
    { block: 'dropdown', x: met.x, y: met.y - 20, w: met.w, label: 'Budgeting method', value: 'Occurrences' },
    { block: 'field', x: tgt.x, y: tgt.y - 20, w: tgt.w, label: 'Target / SLO (%)', value: '99' },
    lbl(16, 350, '3 Describe SLO', { weight: 600, tone: 'textMuted', box: 300 }),
    ...marks([[win, 31], [met, 32], [tgt, 33]]),
  ]);
  figures.push({
    id: '09-set-objectives',
    alt: 'Create SLO page of Kibana 9.5, block 2 Set objectives, drawn generically: the time window 7 days is marked by callout 31, the budgeting method Occurrences by callout 32 and the target 99 percent by callout 33',
    width: FW, height: H, nodes,
  });
}

// 10: describe the SLO (steps 35 and 36)
{
  const H = 420;
  const name = { x: 16, y: 252, w: 520, h: 32 };
  const create = { x: 16, y: 350, w: 130, h: 32 };
  const nodes = sloPage(H, [
    box(16, 148, 1048, 32, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(30, 169, '1 Define SLI      2 Set objectives', { weight: 500, tone: 'textMuted', box: 400 }),
    ...stepHead(16, 190, 3, 'Describe SLO'),
    { block: 'field', x: name.x, y: name.y - 20, w: name.w, label: 'SLO Name', value: 'Guide Bookshelf availability' },
    { block: 'field', x: 560, y: name.y - 20, w: 504, label: 'Description', placeholder: '' },
    btn(create.x, create.y, create.w, 'Create SLO', 'primary'), btn(create.x + 138, create.y, 84, 'Cancel'),
    ...marks([[name, 34], [create, 35]]),
  ]);
  figures.push({
    id: '10-describe-slo',
    alt: 'Create SLO page of Kibana 9.5, block 3 Describe SLO, drawn generically: the SLO name Guide Bookshelf availability is marked by callout 34 and the Create SLO button by callout 35',
    width: FW, height: H, nodes,
  });
}

// 11: the rule picker with the SLOs category (step 38)
{
  const H = 520;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Rules'] });
  const fx = 520, fw = 544;
  const cats = ['All 32', 'Stack Monitoring 14', 'Stack Alerts 5', 'APM and User Experience 4', 'Machine Learning 2', 'Synthetics and Uptime 2', 'Infrastructure 2', 'Observability 1', 'SLOs 1', 'Logs 1'];
  const card = { x: fx + 200, y: 250, w: 320, h: 78 };
  const k = [
    stackNav(H),
    { block: 'flyout', x: fx, y: 96, w: fw, h: H - 96, title: 'Create new rule' },
    { block: 'tabs', x: fx + 8, y: 142, w: 240, tabs: ['Rule type', 'Template'], active: 0 },
    { block: 'field', x: fx + 16, y: 190, w: fw - 32, placeholder: 'Search' },
  ];
  cats.forEach((c, i) => k.push(lbl(fx + 20, 262 + i * 26, c, { size: 'small', box: 170, weight: i === 8 ? 600 : 400, tone: i === 8 ? 'link' : 'text' })));
  k.push(box(card.x, card.y, card.w, card.h, { fill: 'surface', stroke: 'borderStrong', radius: 6 }), lbl(card.x + 12, card.y + 24, 'SLO burn rate', { weight: 600, box: 200 }),
    lbl(card.x + 12, card.y + 46, 'Alert when your SLO burn rate is too high', { size: 'small', tone: 'textMuted', box: 296 }),
    lbl(card.x + card.w - 12, card.y + 24, 'SLOS', { size: 'small', tone: 'textMuted', anchor: 'end', box: 80 }));
  fr.nodes[0].children.push(...k, ...mark(card, 37));
  figures.push({
    id: '11-burn-rate-picker',
    alt: 'Create new rule flyout of Kibana 9.5 with the category SLOs selected, drawn generically with an SLO burn rate card; the card is marked by callout 37',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 12: the burn rate rule form (steps 39 to 42)
{
  const H = 560;
  const fr = kibanaFrame({ h: H, crumbs: ['Stack Management', 'Rules', 'Create'] });
  const slo = { x: 232, y: 206, w: 400, h: 32 };
  const win = { x: 232, y: 290, w: 832, h: 110 };
  const name = { x: 232, y: 450, w: 400, h: 32 };
  const create = { x: FW - 16 - 120, y: H - 52, w: 120, h: 32 };
  fr.nodes[0].children.push(
    stackNav(H),
    lbl(232, 128, 'SLO burn rate rule', { size: 'heading', weight: 500, tone: 'textStrong', box: 500 }),
    ...stepHead(232, 150, 1, 'Definition'),
    { block: 'dropdown', x: slo.x, y: slo.y - 20, w: slo.w, label: 'SLO', value: 'Guide Bookshelf availability' },
    lbl(232, 276, 'Burn rate windows', { weight: 600 }),
    box(win.x, win.y, win.w, win.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    ...[['Critical', '1 hour', '14.4'], ['High', '6 hours', '6'], ['Medium', '24 hours', '3'], ['Low', '72 hours', '1']].flatMap(([a, l, t], i) => [
      lbl(248, win.y + 24 + i * 22, `${a}: lookback ${l}, burn rate threshold ${t}`, { size: 'small', box: 500 })]),
    { block: 'field', x: name.x, y: name.y - 20, w: name.w, label: 'Rule name (step 3 Details)', value: 'Guide SLO burn rate' },
    btn(create.x, create.y, create.w, 'Create rule', 'primary'),
    ...marks([[slo, 38], [win, 39], [name, 40], [create, 41]]),
  );
  figures.push({
    id: '12-burn-rate-form',
    alt: 'SLO burn rate rule page of Kibana 9.5, drawn generically: the SLO Guide Bookshelf availability is marked by callout 38, the four default burn rate windows by callout 39, the rule name Guide SLO burn rate by callout 40 and the Create rule button by callout 41',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 13: the result, Observability Alerts with alerts per group
{
  const H = 460;
  const fr = kibanaFrame({ h: H, crumbs: ['Observability', 'Alerts'] });
  fr.nodes[0].children.push(
    lbl(16, 140, 'Alerts', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 }),
    { block: 'field', x: 16, y: 160, w: 560, placeholder: 'Search alerts (e.g. kibana.alert.evaluation.threshold > 75)' },
    btn(584, 160, 150, 'Last 24 hours', 'secondary', 'clock'),
    { block: 'table', x: 16, y: 212, w: 1048, rowHeight: 34, columns: [{ title: 'Alert Status', w: 1 }, { title: 'Rule name', w: 2 }, { title: 'Group', w: 1.4 }, { title: 'Observed value', w: 1 }, { title: 'Threshold', w: 1 }, { title: 'Triggered', w: 1.2 }],
      rows: [['', 'Guide Bookshelf error ratio', '/api/search', '0.7', '> 0.3', 'Nov 11, 10:31'], ['', 'Guide Bookshelf error ratio', '/api/books', '0.66', '> 0.3', 'Nov 11, 10:31'], ['', 'Guide Bookshelf error ratio', '/api/loans', '0.69', '> 0.3', 'Nov 11, 10:32']] },
    { block: 'pill', x: 26, y: 252, str: 'Active', state: 'firing' }, { block: 'pill', x: 26, y: 286, str: 'Active', state: 'firing' }, { block: 'pill', x: 26, y: 320, str: 'Active', state: 'firing' },
  );
  figures.push({
    id: '13-result',
    alt: 'Observability Alerts page of Kibana 9.5 listing three Active alerts of the rule Guide Bookshelf error ratio, one per value of attributes.uri, with observed values above the threshold 0.3',
    width: FW, height: H, nodes: fr.nodes,
  });
}

export default { product: 'kibana', guide: 'k14', figures };
