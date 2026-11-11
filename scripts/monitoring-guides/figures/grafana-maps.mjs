// Screen maps of Grafana 13.3: one numbered overview per product area, shown by the guide that first works in that area.
// Facts: guides-brief/grafana-facts.md sections 4 (Explore), 6 (dashboard edit mode and panel editor) and 10 (alert rule
// form). Files: monitoring-alerting-grafana-map-<area>.svg; which guide shows which map is in lib/guide-maps.mjs.
import {
  FW, lbl, box, btn, ico, grafanaFrame, gDashToolbar, gAddPane, gEditor, reqChart, segmented, legend, legendHeight, rule,
} from '../lib/shells.mjs';

const num = (x, y, n) => ({ block: 'callout', x, y, num: n });
const LEG_ROW = 30;

// ---------------------------------------------------------------- dashboard edit mode
function dashboardEdit() {
  const tb = gDashToolbar();
  const add = gAddPane({ x: 780, y: 100, w: 236 });
  const items = [
    [1, 'Breadcrumbs: Dashboards, folder and dashboard name'],
    [2, 'Add button: panels, rows, tabs and controls'],
    [3, 'Time range picker and Refresh'],
    [4, 'Save and Exit edit'],
    [5, 'Canvas: the panels of the dashboard (Auto grid or Custom grid)'],
    [6, 'Add pane of the right sidebar: Panel, Group layouts, Dashboard controls'],
    [7, 'Icon strip: Add, Options, Code, Outline and Hide'],
  ];
  const sceneH = 520;
  const lh = legendHeight(items.length, 1, LEG_ROW);
  const strip = ['plus', 'gear', 'edit', 'dashboard', 'chevronRight'];
  return {
    id: 'dashboard-edit',
    alt: 'Map of the Grafana 13.3 dashboard in edit mode with seven numbered regions: breadcrumbs, the Add button, the time range picker, Save and Exit edit, the canvas of panels, the Add pane of the right sidebar and its icon strip',
    width: FW, height: sceneH + 16 + lh,
    nodes: [
      ...grafanaFrame({ h: sceneH + 16 + lh, crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)'], children: [
        ...tb.nodes,
        { block: 'panel', x: 16, y: 106, w: 360, h: 280, title: 'Requests per second by status' },
        reqChart(24, 132, 344, 250),
        { block: 'panel', x: 392, y: 106, w: 360, h: 280, title: 'New panel' },
        btn(412, 210, 180, 'Configure visualization', 'primary'),
        ...add.nodes,
        box(1024, 100, 40, 396, { fill: 'surface', stroke: 'border' }),
        ...strip.map((n, i) => ico(1036, 114 + i * 40, n, 'textMuted')),
        num(310, 24, 1), num(100, 58, 2), num(tb.geo.time.x + 4, 58, 3), num(tb.geo.save.x + 6, 58, 4), num(380, 380, 5), num(784, 104, 6), num(1056, 104, 7),
        ...legend({ x: 16, y: sceneH + 16, items, cols: 1, colW: FW - 32, rowH: LEG_ROW }),
      ] }),
    ],
  };
}

// ---------------------------------------------------------------- panel editor
const PE_ITEMS = [
  [1, 'Table view switch: shows the data of the panel as a table'],
  [2, 'Time range picker and Refresh'],
  [3, 'Save, Discard and Back (there is no Apply button)'],
  [4, 'Panel preview: updates as the query and the options change'],
  [5, 'Bottom tabs: Queries, Transformations and Alert (after the first save)'],
  [6, 'Data source picker, query options summary and Query inspector'],
  [7, 'Query card: Builder or Code, Kick start your query, Explain, Run queries'],
  [8, 'Right column: Suggestions and All visualizations, then the options pane'],
];

function panelEditor() {
  const e = gEditor({ mode: 'builder', hasData: true, right: 'options', title: 'Requests per second by status', optTitle: 'Requests per second by status', saved: true,
    crumbs: ['Dashboards', 'Guides', 'Bookshelf (guides)', 'Edit panel'], h: 640 + 16 + legendHeight(8, 2, LEG_ROW),
    children: (g) => [num(16, 62, 1), num(g.time.x + 6, 58, 2), num(g.save.x + 6, 58, 3), num(12, 104, 4), num(12, 342, 5), num(g.ds.x + g.ds.w + 3, 377, 6), num(12, 430, 7), num(784, 104, 8), ...legend({ x: 16, y: 656, items: PE_ITEMS, cols: 2, colW: 520, rowH: LEG_ROW })] });
  return {
    id: 'panel-editor',
    alt: 'Map of the Grafana 13.3 panel editor with eight numbered regions: the Table view switch, the time controls, Save Discard and Back, the panel preview, the bottom tabs, the data source row, the query card and the visualization and options column',
    width: FW, height: 640 + 16 + legendHeight(PE_ITEMS.length, 2, LEG_ROW),
    nodes: e.nodes,
  };
}

// ---------------------------------------------------------------- Explore
function explore() {
  const items = [
    [1, 'Outline button and the outline: Queries and Graph'],
    [2, 'Data source picker (Prometheus by default)'],
    [3, 'Split and Add (Add to dashboard, Add correlation)'],
    [4, 'Time range controls and the Run query button'],
    [5, 'Query row A: Builder or Code, Kick start your query, Explain'],
    [6, 'Builder: Metric, Label filters and Operations, then the generated query'],
    [7, 'Add query, Query history and Query inspector'],
    [8, 'Result: the Graph with its display switch (Lines, Bars, Points, Stacked)'],
  ];
  const sceneH = 560;
  const seg = segmented({ x: 560, y: 394, items: ['Lines', 'Bars', 'Points', 'Stacked lines', 'Stacked bars'], w: 100, active: 0 });
  return {
    id: 'explore',
    alt: 'Map of Grafana 13.3 Explore with eight numbered regions: the Outline button, the data source picker, Split and Add, the time controls with Run query, the query row, the Builder fields, the Add query row and the Graph with its display switch',
    width: FW, height: sceneH + 16 + legendHeight(items.length, 2, LEG_ROW),
    nodes: [
      ...grafanaFrame({ h: sceneH + 16 + legendHeight(items.length, 2, LEG_ROW), crumbs: ['Explore'], children: [
        box(16, 100, 1048, 240, { fill: 'surface', stroke: 'border', radius: 6 }),
        btn(16, 58, 100, 'Outline'),
        { block: 'dropdown', x: 128, y: 58, w: 220, value: 'Prometheus' },
        btn(360, 58, 140, 'Go queryless'),
        btn(FW - 16 - 100, 58, 100, 'Run query', 'primary'),
        btn(FW - 16 - 100 - 8 - 180, 58, 180, 'Last 1 hour', 'secondary', 'clock'),
        btn(FW - 16 - 100 - 8 - 180 - 8 - 90, 58, 90, 'Add', 'secondary', 'chevronDown'),
        btn(FW - 16 - 100 - 8 - 180 - 8 - 90 - 8 - 90, 58, 90, 'Split'),
        lbl(24, 130, 'Queries', { weight: 500 }), lbl(24, 160, 'Graph', { tone: 'textMuted' }),
        lbl(160, 124, 'A (Prometheus)', { weight: 500 }),
        ...segmented({ x: 1064 - 12 - 144, y: 108, items: ['Builder', 'Code'], active: 0 }).nodes,
        btn(160 + 160, 108, 180, 'Kick start your query'),
        { block: 'toggle', x: 700, y: 115, label: 'Explain', on: false, box: 70 },
        lbl(160, 164, 'Metric', { size: 'small', weight: 500 }),
        { block: 'dropdown', x: 160, y: 172, w: 260, value: 'Select metric' },
        lbl(440, 164, 'Label filters', { size: 'small', weight: 500 }),
        btn(440, 172, 110, 'Add', 'secondary', 'plus'),
        btn(160, 214, 150, 'Operations', 'secondary', 'plus'),
        lbl(160, 312, 'Options', { size: 'small', tone: 'textMuted' }),
        lbl(230, 312, 'Legend: Verbose | Format: Time series | Step: auto | Type: Range', { size: 'small', tone: 'textMuted', box: 640 }),
        lbl(160, 282, 'sum by (status) (rate(http_server_requests_seconds_count[1m]))', { mono: true, size: 'small', tone: 'editorText', box: 640 }),
        btn(16, 350, 110, 'Add query'), btn(134, 350, 150, 'Query history'), btn(292, 350, 160, 'Query inspector'),
        { block: 'panel', x: 16, y: 392, w: 1048, h: 160, title: 'Graph' },
        ...seg.nodes,
        reqChart(24, 416, 524, 134),
        num(16, 62, 1), num(128, 62, 2), num(FW - 16 - 100 - 8 - 180 - 8 - 90 - 8 - 90, 58, 3), num(FW - 16 - 100 + 100, 58, 4), num(16, 104, 5), num(152, 176, 6), num(16, 346, 7), num(560, 392, 8),
        ...legend({ x: 16, y: sceneH + 16, items, cols: 2, colW: 520, rowH: LEG_ROW }),
      ] }),
    ],
  };
}

// ---------------------------------------------------------------- alert rule form
function alertRule() {
  const sections = [
    ['Enter alert rule name', 'Name'],
    ['Define query and alert condition', 'Data source, query editor, WHEN QUERY IS ABOVE, Preview alert rule condition'],
    ['Add folder and labels', 'Folder, Labels'],
    ['Set evaluation behavior', 'Evaluation group, Pending period, Keep firing for'],
    ['Configure notifications', 'Recipient, Contact point'],
    ['Configure notification message', 'Summary, Description, Runbook URL, Link dashboard and panel'],
  ];
  const items = [
    [1, 'Name of the rule'],
    [2, 'Query and condition: the same query editor as Explore, then Reduce and Threshold'],
    [3, 'Folder and labels that route and group the alert'],
    [4, 'Evaluation group, Pending period and Keep firing for'],
    [5, 'Notifications: the contact point (or the notification policy with Advanced options)'],
    [6, 'Message: summary, description, runbook URL and the linked panel'],
    [7, 'Save and Cancel at the bottom'],
  ];
  const rowH = 66;
  const top = 60;
  const sceneH = top + sections.length * (rowH + 10) + 60;
  const nodes = [];
  sections.forEach(([title, what], i) => {
    const y = top + i * (rowH + 10);
    nodes.push(box(16, y, 1048, rowH, { fill: 'surface', stroke: 'border', radius: 6 }));
    nodes.push(lbl(64, y + 28, `${i + 1} ${title}`, { weight: 600, box: 600 }));
    nodes.push(lbl(64, y + 52, what, { size: 'small', tone: 'textMuted', box: 900 }));
    nodes.push(num(36, y + 22, i + 1));
  });
  const by = top + sections.length * (rowH + 10) + 8;
  nodes.push(btn(16, by, 76, 'Save', 'primary'), btn(100, by, 84, 'Cancel'), num(104, by - 2, 7));
  return {
    id: 'alert-rule',
    alt: 'Map of the Grafana 13.3 New alert rule form: a single column of six numbered sections from the rule name to the notification message, and the Save and Cancel buttons at the bottom',
    width: FW, height: sceneH + 16 + legendHeight(items.length, 1, LEG_ROW),
    nodes: [
      ...grafanaFrame({ h: sceneH + 16 + legendHeight(items.length, 1, LEG_ROW), crumbs: ['Alerting', 'Alert rules', 'New alert rule'], children: [...nodes, ...legend({ x: 16, y: sceneH + 16, items, cols: 1, colW: FW - 32, rowH: LEG_ROW })] }),
    ],
  };
}

export default { product: 'grafana', maps: true, figures: [dashboardEdit(), panelEditor(), explore(), alertRule()] };
