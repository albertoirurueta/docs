// Figures of the Kibana guide K5, "Create a dashboard and the first Lens panel" (guide-first-dashboard.adoc).
// Facts: guides-brief/kibana-facts.md section 5 (Kibana 9.5.6). Verified there: the Create dashboard empty state with its
// two cards, the Add to dashboard flyout, the Lens editor regions and the field list. NOT VERIFIED there (drawn
// generically, with the labels the issue and the product family use): the Dashboards list page, the Horizontal axis
// dimension editor, Save and return, and the dashboard save dialog. A figure shows the screen the step starts from with
// the control to act on highlighted; callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, kibanaFrame, kFilterRow, kDash, kLens, kBars } from '../lib/shells.mjs';

const figures = [];
const H = 520;

// 01: the primary navigation (steps 1 and 2)
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Home'] });
  const items = [
    { label: 'Home', icon: 'home' }, { label: 'Analytics' }, { label: 'Discover', indent: 1 }, { label: 'Dashboards', indent: 1 },
    { label: 'Maps', indent: 1 }, { label: 'Machine Learning', indent: 1 }, { label: 'Graph', indent: 1 }, { label: 'Visualize library', indent: 1 },
    { label: 'Elasticsearch' }, { label: 'Observability' }, { label: 'Security' },
  ];
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 248, h: 400, items },
    ...marks([[fr.geo.menu, 1], [{ x: 8, y: 96 + 8 + 3 * 34, w: 232, h: 32 }, 2]]),
  );
  figures.push({
    id: '01-primary-navigation',
    alt: 'Kibana 9.5 with the primary navigation open: callout 1 marks the menu button of the second bar and callout 2 marks Dashboards under the Analytics section',
    width: FW, height: 520, nodes: fr.nodes,
  });
}

// 02: the Dashboards page (step 3)
{
  const fr = kibanaFrame({ h: 400, crumbs: ['Dashboards'] });
  const create = { x: FW - 16 - 170, y: 112, w: 170, h: 32 };
  fr.nodes[0].children.push(
    lbl(16, 140, 'Dashboards', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 }),
    btn(create.x, create.y, create.w, 'Create dashboard', 'primary'),
    { block: 'field', x: 16, y: 170, w: 420, placeholder: 'Search...' },
    { block: 'table', x: 16, y: 226, w: 1048, columns: [{ title: 'Title', w: 2 }, { title: 'Description', w: 3 }], rows: [['[eCommerce] Revenue Dashboard', 'Sample eCommerce orders'], ['[Logs] Web Traffic', 'Sample web logs']] },
    ...mark(create, 3),
  );
  figures.push({
    id: '02-dashboards-page',
    alt: 'Dashboards page of Kibana 9.5 listing the two sample dashboards, with the Create dashboard button marked by callout 3',
    width: FW, height: 400, nodes: fr.nodes,
  });
}

// 03: the empty new dashboard (step 4)
{
  const d = kDash({ h: 480, mode: 'empty', children: (g) => mark(g.createViz, 4) });
  figures.push({
    id: '03-empty-dashboard',
    alt: 'New empty Kibana dashboard saying This dashboard is empty with two cards, Create visualization and Create visualization (query); the first card is marked by callout 4',
    width: FW, height: 480, nodes: d.nodes,
  });
}

// 04: the empty Lens editor (step 5)
{
  const l = kLens({ state: 'empty', children: (g) => mark(g.dataView, 5) });
  figures.push({
    id: '04-lens-editor',
    alt: 'Lens editor of Kibana 9.5 with an empty workspace, the field list at the left and the configuration panel at the right with the dashed Horizontal axis, Vertical axis and Breakdown buttons; the Data view picker is marked by callout 5',
    width: FW, height: 640, nodes: l.nodes,
  });
}

// 05: the field list narrowed to status; drag to the Horizontal axis (steps 6 and 7)
{
  const l = kLens({ state: 'search', children: (g) => [...marks([[g.search, 6], [g.horizontal, 7]]), { block: 'highlight', ...g.statusField }] });
  figures.push({
    id: '05-field-search',
    alt: 'Lens editor with the field list narrowed to the field attributes.status by the search box (callout 6); the field is dragged onto the dashed Horizontal axis button (callout 7)',
    width: FW, height: 640, nodes: l.nodes,
  });
}

// 06: the dimension editor of the Horizontal axis (step 8)
{
  const l = kLens({ state: 'flyout', children: (g) => mark(g.topValues, 8) });
  figures.push({
    id: '06-horizontal-axis',
    alt: 'Dimension editor of the Horizontal axis in Lens with the field attributes.status and the function list; Top values is marked by callout 8',
    width: FW, height: 640, nodes: l.nodes,
  });
}

// 07: Records onto the Vertical axis (step 9)
{
  const l = kLens({ state: 'drag', children: (g) => [...mark(g.vertical, 9), { block: 'highlight', ...g.records }] });
  figures.push({
    id: '07-vertical-axis',
    alt: 'Lens editor with attributes.status on the Horizontal axis; the entry Records of the field list is dragged onto the dashed Vertical axis button, marked by callout 9',
    width: FW, height: 640, nodes: l.nodes,
  });
}

// 08: the bar chart; Save and return (step 10)
{
  const l = kLens({ state: 'chart', children: (g) => mark(g.save, 10) });
  figures.push({
    id: '08-bar-chart',
    alt: 'Lens editor with a bar chart of Count of records for each value of attributes.status, 200 and 404; the Save and return button of the second bar is marked by callout 10',
    width: FW, height: 640, nodes: l.nodes,
  });
}

// 09: the dashboard in edit mode with the panel; Save (step 11)
{
  const d = kDash({ h: 520, mode: 'edit', children: (g) => mark(g.Save, 11) });
  figures.push({
    id: '09-dashboard-with-panel',
    alt: 'New Kibana dashboard in edit mode with the bar chart panel; the Save button of the second bar is marked by callout 11',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 10: the save dialog (steps 12 to 14)
{
  const mx = 280, my = 120, mw = 520;
  const fx = mx + 24, fw = mw - 48;
  const geoTitle = { x: fx, y: my + 80, w: fw, h: 32 };
  const geoTime = { x: fx, y: my + 202, w: 300, h: 18 };
  const geoSave = { x: mx + mw - 24 - 80, y: my + 280, w: 80, h: 32 };
  const d = kDash({ h: 520, mode: 'edit', children: [
    box(mx, my, mw, 340, { fill: 'surface', stroke: 'borderStrong', radius: 8 }),
    lbl(fx, my + 40, 'Save dashboard', { size: 'title', weight: 600, box: 300 }),
    { block: 'field', x: fx, y: my + 60, w: fw, label: 'Title', value: 'Bookshelf (guides)' },
    { block: 'field', x: fx, y: my + 128, w: fw, label: 'Description' },
    { block: 'toggle', x: fx, y: my + 202, label: 'Store time with dashboard', on: true, box: 280 },
    btn(mx + mw - 24 - 80 - 8 - 84, my + 280, 84, 'Cancel'), btn(geoSave.x, geoSave.y, 80, 'Save', 'primary'),
    ...marks([[geoTitle, 12], [{ x: fx, y: my + 202, w: 32 + 10 + 200, h: 18 }, 13], [geoSave, 14]]),
  ] });
  void geoTime;
  figures.push({
    id: '10-save-dashboard',
    alt: 'Save dashboard dialog of Kibana with the title Bookshelf (guides) marked by callout 12, the switch Store time with dashboard turned on and marked by callout 13, and the Save button marked by callout 14',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 11: saved; Exit edit (step 15)
{
  const d = kDash({ h: 520, mode: 'edit', title: 'Bookshelf (guides)', children: (g) => mark(g['Exit edit'], 15) });
  figures.push({
    id: '11-exit-edit',
    alt: 'Kibana dashboard Bookshelf (guides) still in edit mode after saving; the Exit edit button of the second bar is marked by callout 15',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 12: the finished dashboard (What you build)
{
  const d = kDash({ h: 520, mode: 'view', title: 'Bookshelf (guides)' });
  figures.push({
    id: '12-result',
    alt: 'Finished Kibana dashboard Bookshelf (guides) in view mode: one bar chart panel shows the count of log records for the status values 200 and 404',
    width: FW, height: H, nodes: d.nodes,
  });
}

void FW; void kFilterRow; void kBars;
export default { product: 'kibana', guide: 'k5', figures };
