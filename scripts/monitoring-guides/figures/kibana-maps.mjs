// Screen maps of Kibana 9.5: one numbered overview per product area, shown by the guide that first works in that area.
// Facts: guides-brief/kibana-facts.md sections 4 (Discover), 5 (Lens editor and dashboard) and 8 (rule form).
// Files: monitoring-alerting-kibana-map-<area>.svg; which guide shows which map is in lib/guide-maps.mjs.
import {
  FW, lbl, box, btn, ico, kibanaFrame, kFilterRow, kDash, kLens, kBars, legend, legendHeight,
} from '../lib/shells.mjs';

const num = (x, y, n) => ({ block: 'callout', x, y, num: n });
const LEG_ROW = 30;
const withLegend = (id, alt, h, items, cols, colW, nodesFn) => ({ id, alt, h, items, cols, colW, nodesFn });

// A map figure: the screen of height `sceneH`, then its legend, all inside the window frame.
function build({ id, alt, sceneH, items, cols = 2, colW = 520, crumbs, actions, scene }) {
  const total = sceneH + 16 + legendHeight(items.length, cols, LEG_ROW);
  const fr = kibanaFrame({ h: total, crumbs, actions });
  fr.nodes[0].children.push(...scene(fr.geo), ...legend({ x: 16, y: sceneH + 16, items, cols, colW, rowH: LEG_ROW }));
  return { id, alt, width: FW, height: total, nodes: fr.nodes };
}

// ---------------------------------------------------------------- Discover
const discover = build({
  id: 'discover',
  alt: 'Map of Kibana 9.5 Discover with eight numbered regions: the breadcrumbs, the session tabs, the top actions, the data view and query row, the field list, the histogram, the Documents Patterns and Field statistics tabs, and the table toolbar',
  sceneH: 600,
  crumbs: ['Discover'],
  actions: [{ label: 'Share', w: 90 }, { label: 'Query in ES|QL', w: 150 }, { label: 'More', w: 80 }, { label: 'Save', w: 80 }],
  items: [
    [1, 'Breadcrumbs'],
    [2, 'Session tabs: Untitled, New tab, Tabs menu'],
    [3, 'Top actions: Share, Query in ES|QL, More, Save'],
    [4, 'Data view picker, Add filter, query box (KQL), time picker and Refresh'],
    [5, 'Field list: Search field names, Available fields, Add field as column'],
    [6, 'Histogram: Auto interval, No breakdown and the chart of hits over time'],
    [7, 'Result tabs: Documents, Patterns and Field statistics'],
    [8, 'Table toolbar and the documents table (timestamp, Summary)'],
  ],
  scene: (g) => {
    const row = kFilterRow({ y: 152, dataView: 'Kibana Sample Data Logs', query: 'Search and filter the discover page', time: 'Last 7 days' });
    return [
      box(16, 104, 150, 32, { fill: 'surface', stroke: 'border', radius: 4 }), lbl(32, 125, 'Untitled', { box: 110 }), btn(172, 104, 36, '+'),
      ...row.nodes,
      box(16, 200, 284, 380, { fill: 'surface', stroke: 'border', radius: 6 }),
      { block: 'field', x: 28, y: 212, w: 260, placeholder: 'Search field names' },
      lbl(32, 276, 'Available fields', { weight: 600 }),
      ...['@timestamp', 'agent', 'bytes', 'clientip', 'extension', 'host', 'message'].map((f, i) => lbl(40, 304 + i * 28, f, { size: 'small', tone: 'textMuted', box: 240 })),
      btn(316, 200, 130, 'Auto interval', 'secondary', 'chevronDown'), btn(454, 200, 150, 'No breakdown', 'secondary', 'chevronDown'),
      { block: 'bar', x: 316, y: 240, w: 748, h: 150, categories: ['Nov 5', 'Nov 6', 'Nov 7', 'Nov 8', 'Nov 9', 'Nov 10'], series: [{ name: 'Count', values: [90, 110, 85, 120, 100, 95] }], legend: false, max: 150 },
      { block: 'tabs', x: 316, y: 398, w: 500, tabs: ['Documents (77)', 'Patterns', 'Field statistics'], active: 0 },
      btn(316, 440, 130, 'Sort fields', 'secondary'), btn(454, 440, 160, 'Display options'), btn(622, 440, 150, 'Enter fullscreen'),
      { block: 'table', x: 316, y: 484, w: 748, columns: [{ title: 'timestamp', w: 2 }, { title: 'Summary', w: 5 }], rows: [['Nov 11, 2026 @ 10:27:42', 'response:404 extension:html bytes:5107'], ['Nov 11, 2026 @ 10:26:11', 'response:404 extension:css bytes:2201']] },
      num(86, 56, 1), num(24, 106, 2), num(g['Save'].x + 8, 56, 3), num(16, 154, 4), num(24, 202, 5), num(316, 202, 6), num(316, 400, 7), num(316, 486, 8),
    ];
  },
});

// ---------------------------------------------------------------- Lens editor
const lensEditor = (() => {
  const items = [
    [1, 'Top actions: Explore in Discover, Inspect, Settings and Save and return'],
    [2, 'Data view picker, filters, query box and time picker'],
    [3, 'Field list: Search field names, Records and Available fields'],
    [4, 'Workspace: drop a field here, the chart is drawn here'],
    [5, 'Configuration panel header: Legend, Style and Add layer'],
    [6, 'Layer card: chart type (Bar), subtype (Stacked) and the data view'],
    [7, 'Horizontal axis, Vertical axis and Breakdown: drop zones of the layer'],
  ];
  const total = 640 + 16 + legendHeight(items.length, 1, LEG_ROW);
  const l = kLens({ h: total, state: 'chart', children: (g) => [
    num(g.save.x + g.save.w - 20, 56, 1), num(g.dataView.x + 6, 104, 2), num(24, 154, 3), num(324, 154, 4), num(784, 160, 5), num(790, 210, 6), num(g.horizontal.x + g.horizontal.w + 3, g.horizontal.y - 3, 7),
    ...legend({ x: 16, y: 656, items, cols: 1, colW: FW - 32, rowH: LEG_ROW }),
  ] });
  return { id: 'lens-editor', alt: 'Map of the Kibana 9.5 Lens editor with seven numbered regions: the top actions, the data view and time row, the field list, the workspace with a bar chart, the header of the configuration panel, the layer card and the axis drop zones', width: FW, height: total, nodes: l.nodes };
})();

// ---------------------------------------------------------------- dashboard
const dashboard = (() => {
  const items = [
    [1, 'Breadcrumbs: Dashboards and the dashboard name'],
    [2, 'Page actions in edit mode: Exit edit, Add, More and Save'],
    [3, 'Filter row: Add filter, query box, time picker and Refresh'],
    [4, 'Canvas: the panels of the dashboard'],
    [5, 'Add to dashboard flyout: tabs New and From library, then the panel types'],
    [6, 'Visualization (Lens editor) and Visualization (query) (ES|QL) at the top of the list'],
  ];
  const total = 520 + 16 + legendHeight(items.length, 1, LEG_ROW);
  const d = kDash({ h: total, mode: 'add', title: 'Bookshelf (guides)', children: (g) => [
    num(86, 56, 1), num(g.Save.x + 8, 56, 2), num(24, 106, 3), num(24, 154, 4), num(708, 100, 5), num(g.addViz.x + g.addViz.w - 4, g.addViz.y + 2, 6),
    ...legend({ x: 16, y: 536, items, cols: 1, colW: FW - 32, rowH: LEG_ROW }),
  ] });
  return { id: 'dashboard', alt: 'Map of a Kibana 9.5 dashboard in edit mode with six numbered regions: the breadcrumbs, the page actions, the filter row, the canvas of panels, the Add to dashboard flyout and its Visualization entries', width: FW, height: total, nodes: d.nodes };
})();

// ---------------------------------------------------------------- rule form
const ruleForm = (() => {
  const sections = [
    ['Rule name', 'The title with its pencil icon and the Return link'],
    ['Step 1 Definition', 'Select a query type (KQL or Lucene, Query DSL, ES|QL), data view, Define your query, Test query'],
    ['Rule schedule and advanced options', 'Every N minutes, Rule scope, Alert delay, Alert flapping detection'],
    ['Step 2 Actions (optional)', 'Add action, connector, Run when, Action frequency, message'],
    ['Step 3 Details', 'Rule name, Tags, Investigation guide, Preview, Related dashboards'],
  ];
  const items = [
    [1, 'Rule name and the Return link'],
    [2, 'Definition: the query of the rule and Test query'],
    [3, 'Schedule: how often the rule runs, plus the advanced options'],
    [4, 'Actions: which connector is called, when, how often and with which message'],
    [5, 'Details: name, tags and the investigation guide'],
    [6, 'Cancel, Show request and Create rule at the bottom'],
  ];
  const rowH = 70, top = 112;
  const sceneH = top + sections.length * (rowH + 10) + 60;
  const total = sceneH + 16 + legendHeight(items.length, 1, LEG_ROW);
  const fr = kibanaFrame({ h: total, crumbs: ['Stack Management', 'Rules', 'Create'] });
  const n = [];
  sections.forEach(([title, what], i) => {
    const y = top + i * (rowH + 10);
    n.push(box(16, y, 1048, rowH, { fill: 'surface', stroke: 'border', radius: 6 }));
    n.push(lbl(64, y + 30, title, { weight: 600, box: 700 }));
    n.push(lbl(64, y + 54, what, { size: 'small', tone: 'textMuted', box: 960 }));
    n.push(num(36, y + 24, i + 1));
  });
  const by = top + sections.length * (rowH + 10) + 8;
  n.push(btn(16, by, 84, 'Cancel'), btn(108, by, 150, 'Show request'), btn(266, by, 130, 'Create rule', 'primary'), num(404, by - 2, 6));
  n.push(lbl(16, 100, 'Elasticsearch query rule', { size: 'title', weight: 600, box: 400 }), ico(240, 86, 'edit', 'textMuted'));
  fr.nodes[0].children.push(...n, ...legend({ x: 16, y: sceneH + 16, items, cols: 1, colW: FW - 32, rowH: LEG_ROW }));
  return { id: 'rule-form', alt: 'Map of the Kibana 9.5 Create rule page for an Elasticsearch query rule: the rule name, the three steps Definition, Actions and Details, the schedule and advanced options, and the buttons at the bottom', width: FW, height: total, nodes: fr.nodes };
})();

void withLegend; void kBars;
export default { product: 'kibana', maps: true, figures: [discover, lensEditor, dashboard, ruleForm] };
