// Figures of the Kibana guide K12, "Share, export and move dashboards" (guide-share-export-and-saved-objects.adoc).
// Facts: guides-brief/kibana-facts.md sections 2, 7, 13 and 15 (Kibana 9.5.6). Verified there: the dashboard second bar, the
// Share modal (Permissions, tabs Link and Embed, Use absolute time range, Copy link), the Export menu (Export JSON, PDF reports,
// PNG reports, Schedule export), the More menu (Duplicate, Reset changes, Background searches, Full screen), the Stack Management
// groups (Alerts and Insights with Reporting, Kibana with Saved Objects and Spaces) and the fields of the Create space page.
// NOT VERIFIED there (drawn generically, with the words of the Elastic pages "Export and share dashboards", "Manage saved objects"
// and "Spaces" that the reference page of this site quotes): the contents of the Embed tab, the PDF report flyout, the Reporting
// list, the Saved Objects page and its Export, Relationships, Copy to spaces and Import dialogs, and the space switcher list.
// Callout numbers are the step numbers of the page; a figure shows the screen as the step starts, with the control to act on
// highlighted.
import { FW, lbl, box, btn, ico, rule, mark, marks, menu, kibanaFrame, kFilterRow } from '../lib/shells.mjs';

const figures = [];
const H = 560;

const LINES = [
  { name: '200', points: [8.8, 8.2, 8.4, 8.7, 8.9, 8.3, 8.5, 8.4, 8.9, 8.3, 9.2, 7.8] },
  { name: '404', points: [1.7, 1.0, 1.3, 1.1, 1.7, 1.0, 1.3, 1.0, 1.6, 1.3, 1.3, 0.9] },
];
const lineChart = (x, y, w, h) => ({ block: 'line', x, y, w, h, series: LINES, min: 0, max: 12, yLabels: ['0', '3', '6', '9', '12'], xLabels: ['10:00', '10:05', '10:10', '10:15', '10:20', '10:25'] });
const barPanel = (x, y, w, h) => [{ block: 'panel', x, y, w, h, title: 'Records by status' }, { block: 'bar', x: x + 8, y: y + 34, w: w - 16, h: h - 42, categories: ['200', '404'], series: [{ name: 'Count of records', values: [412, 38] }], max: 500, legend: false }];
const linePanel = (x, y, w, h) => [{ block: 'panel', x, y, w, h, title: 'Requests over time' }, lineChart(x + 8, y + 34, w - 16, h - 42)];

// The dashboard in view mode: second bar with Share, Export, More, Edit; `body` draws the content and receives the geometry.
function viewDash({ h = H, title = 'Bookshelf (guides)', body, children }) {
  const actions = [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }];
  const fr = kibanaFrame({ h, crumbs: ['Dashboards', title], actions });
  const n = [...kFilterRow({}).nodes, ...barPanel(16, 152, 510, h - 170), ...linePanel(542, 152, 522, h - 170)];
  if (body) n.push(...body(fr.geo));
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(fr.geo) : children ?? []));
  return { nodes: fr.nodes, geo: fr.geo };
}

// A modal over the dashboard (the Share dashboard dialog). Returns the nodes and the geometry of the inner area.
const MX = 270, MW = 540;
const modal = (my, mh, title) => [box(MX, my, MW, mh, { fill: 'surface', stroke: 'borderStrong', radius: 8 }), lbl(MX + 24, my + 38, title, { size: 'title', weight: 600, box: 400 }), ico(MX + MW - 40, my + 22, 'close', 'textMuted')];

// The Share dashboard dialog: Permissions line, tabs Link and Embed.
function shareModal({ tab = 'Link', absolute = false }) {
  const my = 100, mh = 380;
  const n = modal(my, mh, 'Share dashboard');
  n.push(lbl(MX + 24, my + 74, 'Permissions', { size: 'small', weight: 500, box: 200 }), lbl(MX + 24, my + 96, 'Everybody in the space: Default', { size: 'small', tone: 'textMuted', box: 400 }));
  n.push({ block: 'tabs', x: MX + 16, y: my + 112, w: 220, tabs: ['Link', 'Embed'], active: tab === 'Link' ? 0 : 1 });
  const g = {};
  if (tab === 'Link') {
    n.push({ block: 'toggle', x: MX + 24, y: my + 176, label: 'Use absolute time range', on: absolute, box: 300 });
    g.absolute = { x: MX + 20, y: my + 172, w: 32 + 10 + 210, h: 26 };
    n.push(btn(MX + MW - 24 - 130, my + mh - 56, 130, 'Copy link', 'primary'));
    g.copy = { x: MX + MW - 24 - 130, y: my + mh - 56, w: 130, h: 32 };
  } else {
    n.push(lbl(MX + 24, my + 168, 'Include in the frame', { size: 'small', weight: 500, box: 300 }));
    ['Top menu', 'Query', 'Time filter', 'Filter bar'].forEach((t, i) => n.push({ block: 'checkbox', x: MX + 24 + (i % 2) * 220, y: my + 184 + Math.floor(i / 2) * 28, label: t, checked: i !== 0, box: 180 }));
    g.include = { x: MX + 18, y: my + 178, w: 440, h: 60 };
    n.push({ block: 'queryEditor', x: MX + 24, y: my + 250, w: MW - 48, h: 54, lines: ['<iframe src="http://localhost:5601/app/dashboards', '  #/view/...?embed=true" height="600" width="800">'], lineNumbers: false });
    n.push(btn(MX + MW - 24 - 150, my + mh - 56, 150, 'Copy iframe code', 'primary'));
    g.copy = { x: MX + MW - 24 - 150, y: my + mh - 56, w: 150, h: 32 };
  }
  g.tabLink = { x: MX + 16, y: my + 112, w: 70, h: 32 };
  g.tabEmbed = { x: MX + 86, y: my + 112, w: 80, h: 32 };
  return { nodes: n, geo: g };
}

// 01: the dashboard; Share (steps 1 and 2)
{
  const d = viewDash({ children: (g) => mark(g.Share, 2) });
  figures.push({
    id: '01-open-dashboard',
    alt: 'Kibana dashboard Bookshelf (guides) in view mode with the bar chart and the line chart; the Share button of the second bar is marked by callout 2',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 02: the Share dialog, Link tab (steps 3 and 4)
{
  const s = shareModal({ tab: 'Link', absolute: false });
  const d = viewDash({ body: () => s.nodes, children: () => marks([[s.geo.absolute, 3], [s.geo.copy, 4]]) });
  figures.push({
    id: '02-share-link',
    alt: 'The Share dashboard dialog of Kibana on its Link tab: the switch Use absolute time range, turned off, is marked by callout 3 and the Copy link button by callout 4',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 03: the Embed tab (steps 5 to 7)
{
  const s = shareModal({ tab: 'Embed' });
  const d = viewDash({ body: () => s.nodes, children: () => marks([[s.geo.tabEmbed, 5], [s.geo.include, 6], [s.geo.copy, 7]]) });
  figures.push({
    id: '03-embed-code',
    alt: 'The Share dashboard dialog on its Embed tab, marked by callout 5, with the choices of what the frame includes (callout 6), the iframe code and the button that copies it, marked by callout 7',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 04: the Export menu; PDF reports (steps 8 and 9)
{
  const m = menu({ x: 1064 - 210 - 90 - 8 - 80 - 8 + 40, y: 92, w: 200, items: ['Export JSON', 'PDF reports', 'PNG reports', 'Schedule export'], hot: 1 });
  const d = viewDash({ h: 420, body: () => m.nodes, children: (g) => marks([[g.Export, 8], [m.rows[1], 9]]) });
  figures.push({
    id: '04-export-menu',
    alt: 'Dashboard in view mode with the Export menu open: the Export button of the second bar is marked by callout 8 and the entry PDF reports, between Export JSON and PNG reports, by callout 9; Schedule export is the last entry',
    width: FW, height: 420, nodes: d.nodes,
  });
}

// 05: the PDF report flyout, drawn generically (step 10)
{
  const geoGen = { x: 1064 - 16 - 170, y: 340, w: 170, h: 32 };
  const d = viewDash({
    h: 420,
    body: () => [
      { block: 'flyout', x: 684, y: 96, w: 380, h: 324, title: 'PDF reports' },
      lbl(700, 190, 'Generates a static PDF of this dashboard,', { size: 'small', tone: 'textMuted', box: 350 }),
      lbl(700, 208, 'with the time range and filters on screen.', { size: 'small', tone: 'textMuted', box: 350 }),
      btn(geoGen.x, geoGen.y, 170, 'Generate PDF', 'primary'),
    ],
    children: () => mark(geoGen, 10),
  });
  figures.push({
    id: '05-pdf-report',
    alt: 'The PDF reports flyout over the dashboard with a short description and the button that generates the report, marked by callout 10',
    width: FW, height: 420, nodes: d.nodes,
  });
}

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
  const pageNodes = page ? page(geo) : [];
  fr.nodes[0].children.push(...n, ...pageNodes, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

// 06: the Reporting list, drawn generically (steps 12 and 13)
{
  const act = { x: 930, y: 209, w: 120, h: 30 };
  const d = stack({
    crumbs: ['Reporting'], active: 'Reporting',
    page: () => [
      lbl(252, 140, 'Reporting', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 }),
      { block: 'table', x: 252, y: 170, w: 812, columns: [{ title: 'Report', w: 3 }, { title: 'Type', w: 1.5 }, { title: 'Created at', w: 2.5 }, { title: 'Status', w: 1.6 }, { title: 'Actions', w: 1.4 }], rows: [['Bookshelf (guides)', 'PDF', 'Nov 11, 2026 @ 10:41', 'Completed', ''], ['Bookshelf (guides)', 'PNG', 'Nov 11, 2026 @ 10:43', 'Completed', '']], rowHeight: 36, selectedRow: 0 },
      btn(act.x, act.y, 120, 'Download', 'secondary', 'save'),
    ],
    children: (g) => marks([[g.rows.Reporting, 12], [act, 13]]),
  });
  figures.push({
    id: '06-reporting-list',
    alt: 'Stack Management with the Reporting page open: the entry Reporting under Alerts and Insights in the left menu is marked by callout 12, and the download action in the row of the first report of the list is marked by callout 13',
    width: FW, height: H, nodes: d.nodes,
  });
}

// The Saved Objects page: toolbar and table with the dashboards and the data view.
function savedObjectsPage({ rows, checked = -1, importBtn = true }) {
  const n = [lbl(252, 140, 'Saved objects', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 })];
  n.push({ block: 'field', x: 252, y: 160, w: 200, placeholder: 'Search...' });
  const geo = {};
  geo.export = { x: 460, y: 160, w: 90, h: 32 };
  geo.import = { x: 558, y: 160, w: 100, h: 32 };
  n.push(btn(geo.export.x, 160, 90, 'Export'), btn(geo.import.x, 160, 100, 'Import'));
  void importBtn;
  n.push(box(252, 210, 812, 36 * (rows.length + 1), { fill: 'surface', stroke: 'border', radius: 4 }));
  n.push(lbl(300, 233, 'Type', { size: 'small', weight: 600, tone: 'textMuted', box: 100 }), lbl(420, 233, 'Title', { size: 'small', weight: 600, tone: 'textMuted', box: 300 }), lbl(980, 233, 'Actions', { size: 'small', weight: 600, tone: 'textMuted', box: 80 }));
  n.push(rule(252, 246, 812));
  geo.rows = [];
  rows.forEach(([type, title], i) => {
    const ry = 246 + i * 36;
    n.push({ block: 'checkbox', x: 268, y: ry + 10, checked: i === checked });
    n.push(lbl(300, ry + 23, type, { size: 'small', tone: 'textMuted', box: 110 }), lbl(420, ry + 23, title, { box: 500 }));
    n.push(ico(980, ry + 10, 'search', 'textMuted'), ico(1010, ry + 10, 'share', 'textMuted'), ico(1040, ry + 10, 'dots', 'textMuted'));
    if (i < rows.length - 1) n.push(rule(252, ry + 36, 812));
    geo.rows.push({ check: { x: 264, y: ry + 6, w: 24, h: 24 }, relations: { x: 1006, y: ry + 6, w: 24, h: 24 }, dots: { x: 1036, y: ry + 6, w: 24, h: 24 } });
  });
  return { nodes: n, geo };
}
const OBJECTS = [['Dashboard', 'Bookshelf (guides)'], ['Dashboard', 'Bookshelf details (guides)'], ['Data view', 'Bookshelf logs (guides)']];

// 07: Saved Objects, export and relationships (steps 14 to 17)
{
  const so = savedObjectsPage({ rows: OBJECTS, checked: 0 });
  const d = stack({ crumbs: ['Saved objects'], active: 'Saved Objects', page: () => so.nodes, children: (g) => marks([[g.rows['Saved Objects'], 14], [so.geo.rows[0].check, 15], [so.geo.export, 16], [so.geo.rows[0].relations, 17]]) });
  figures.push({
    id: '07-saved-objects-export',
    alt: 'Stack Management with the Saved objects page: the entry Saved Objects under Kibana in the left menu is marked by callout 14, the checkbox of the row Bookshelf (guides) by callout 15, the Export button by callout 16 and the Relationships action of the row by callout 17',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 08: Create space (steps 18 to 21)
{
  const ix = 252, iw = 560;
  const gName = { x: ix, y: 232, w: iw, h: 32 }, gUrl = { x: ix, y: 372, w: iw, h: 32 }, gCreate = { x: ix, y: 452, w: 130, h: 32 };
  const d = stack({
    crumbs: ['Spaces', 'Create'], active: 'Spaces',
    page: () => [
      lbl(252, 140, 'Create a space', { size: 'heading', weight: 500, tone: 'textStrong', box: 500 }),
      lbl(252, 172, 'Organize Kibana into spaces with dedicated navigation, privileges and objects.', { size: 'small', tone: 'textMuted', box: 760 }),
      { block: 'field', x: ix, y: 212, w: iw, label: 'Name', value: 'Guide copy' },
      { block: 'field', x: ix, y: 282, w: iw, label: 'Description (optional)', placeholder: '' },
      { block: 'field', x: ix, y: 352, w: iw, label: 'URL identifier', value: 'guide-copy', hint: "You can't change the URL identifier once created." },
      btn(gCreate.x, gCreate.y, 130, 'Create space', 'primary'), btn(gCreate.x + 140, gCreate.y, 90, 'Cancel'),
    ],
    children: () => marks([[gName, 19], [gUrl, 20], [gCreate, 21]]),
  });
  figures.push({
    id: '08-create-space',
    alt: 'Stack Management with the Create a space page: the Name field with Guide copy is marked by callout 19, the URL identifier guide-copy by callout 20 and the Create space button by callout 21',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 09: the row actions menu; Copy to spaces (steps 22 and 23)
{
  const so = savedObjectsPage({ rows: OBJECTS });
  const m = menu({ x: 1064 - 210, y: 246 + 32, w: 200, items: ['Inspect', 'Relationships', 'Copy to spaces'], hot: 2 });
  const d = stack({ crumbs: ['Saved objects'], active: 'Saved Objects', page: () => [...so.nodes, ...m.nodes], children: () => marks([[so.geo.rows[0].dots, 22], [m.rows[2], 23]]) });
  figures.push({
    id: '09-copy-to-spaces-menu',
    alt: 'Saved objects page with the actions menu of the row Bookshelf (guides) open: the menu button of the row is marked by callout 22 and the entry Copy to spaces, below Inspect and Relationships, by callout 23',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 10: the Copy to spaces flyout, drawn generically (steps 24 to 26)
{
  const fx = 684, ix = fx + 16;
  const gSpace = { x: ix, y: 196, w: 348, h: 64 }, gRel = { x: ix, y: 288, w: 348, h: 26 }, gCopy = { x: 1064 - 16 - 150, y: 508, w: 150, h: 32 };
  const so = savedObjectsPage({ rows: OBJECTS });
  const d = stack({
    crumbs: ['Saved objects'], active: 'Saved Objects',
    page: () => [
      ...so.nodes,
      { block: 'flyout', x: fx, y: 96, w: 380, h: H - 96, title: 'Copy to spaces' },
      lbl(ix, 176, 'Bookshelf (guides)', { weight: 500, box: 340 }),
      { block: 'checkbox', x: ix + 4, y: 206, label: 'Default (current space)', checked: false, box: 300 },
      { block: 'checkbox', x: ix + 4, y: 236, label: 'Guide copy', checked: true, box: 300 },
      { block: 'toggle', x: ix + 4, y: 292, label: 'Include related saved objects', on: true, box: 300 },
      btn(1064 - 16 - 150 - 8 - 84, 508, 84, 'Cancel'), btn(gCopy.x, gCopy.y, 150, 'Copy to 1 space', 'primary'),
    ],
    children: () => marks([[gSpace, 24], [gRel, 25], [gCopy, 26]]),
  });
  figures.push({
    id: '10-copy-to-spaces-flyout',
    alt: 'The Copy to spaces flyout over the Saved objects page with the space Guide copy ticked (callout 24), the switch Include related saved objects turned on (callout 25) and the button that copies to one space marked by callout 26',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 11: the space switcher (steps 27 and 28)
{
  const fr = kibanaFrame({ h: 380, crumbs: ['Dashboards', 'Bookshelf (guides)'], actions: [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }] });
  const avatar = { x: 48, y: 56, w: 32, h: 32 };
  const m = menu({ x: 48, y: 92, w: 260, items: ['Default', 'Guide copy', 'Manage spaces'], hot: 1 });
  fr.nodes[0].children.push(...kFilterRow({}).nodes, ...barPanel(16, 152, 510, 210), ...linePanel(542, 152, 522, 210), ...m.nodes, ...marks([[avatar, 27], [m.rows[1], 28]]));
  figures.push({
    id: '11-switch-space',
    alt: 'Kibana dashboard with the space list open under the green space avatar of the second bar: the avatar is marked by callout 27 and the entry Guide copy, between Default and Manage spaces, by callout 28',
    width: FW, height: 380, nodes: fr.nodes,
  });
}

// 12: the Import flyout, drawn generically (steps 30 to 33)
{
  const fx = 684, ix = fx + 16;
  const gFile = { x: ix, y: 170, w: 348, h: 80 }, gOpt = { x: ix, y: 292, w: 348, h: 76 }, gImport = { x: 1064 - 16 - 110, y: 508, w: 110, h: 32 };
  const so = savedObjectsPage({ rows: [['Data view', 'Bookshelf logs (guides)']] });
  const d = stack({
    crumbs: ['Saved objects'], active: 'Saved Objects',
    page: () => [
      ...so.nodes,
      { block: 'flyout', x: fx, y: 96, w: 380, h: H - 96, title: 'Import saved objects' },
      box(ix, 170, 348, 80, { fill: 'canvas', stroke: 'borderStrong', radius: 6, dash: '5 3' }),
      lbl(ix + 174, 216, 'Select or drag and drop a file', { tone: 'textMuted', anchor: 'middle', box: 330 }),
      lbl(ix, 276, 'How to handle conflicts', { size: 'small', weight: 500, box: 340 }),
      { block: 'checkbox', x: ix + 4, y: 300, label: 'Check for existing objects', checked: false, box: 300 },
      { block: 'checkbox', x: ix + 4, y: 330, label: 'Create new objects with random IDs', checked: true, box: 310 },
      btn(1064 - 16 - 110 - 8 - 84, 508, 84, 'Cancel'), btn(gImport.x, gImport.y, 110, 'Import', 'primary'),
    ],
    children: () => marks([[so.geo.import, 30], [gFile, 31], [gOpt, 32], [gImport, 33]]),
  });
  figures.push({
    id: '12-import-objects',
    alt: 'Saved objects page of the space Guide copy with the Import button marked by callout 30; its flyout shows the file drop zone (callout 31), the conflict option Create new objects with random IDs turned on (callout 32) and the Import button at the bottom (callout 33)',
    width: FW, height: H, nodes: d.nodes,
  });
}

// 13: More menu of a managed dashboard; Duplicate (steps 36 and 37)
{
  const m = menu({ x: 1064 - 220, y: 92, w: 220, items: ['Duplicate', 'Reset changes', 'Background searches', 'Full screen'], hot: 0 });
  const actions = [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }];
  const fr = kibanaFrame({ h: 400, crumbs: ['Dashboards', '[Logs] Web Traffic'], actions });
  fr.nodes[0].children.push(...kFilterRow({ time: 'Last 7 days' }).nodes);
  fr.nodes[0].children.push({ block: 'panel', x: 16, y: 152, w: 1048, h: 230, title: '[Logs] Response Codes Over Time + Annotations' }, lineChart(24, 186, 1032, 188));
  fr.nodes[0].children.push(...m.nodes, ...marks([[fr.geo.More, 36], [m.rows[0], 37]]));
  figures.push({
    id: '13-duplicate-dashboard',
    alt: 'The sample dashboard [Logs] Web Traffic in view mode with the More menu open: the More button of the second bar is marked by callout 36 and the entry Duplicate, above Reset changes, Background searches and Full screen, by callout 37',
    width: FW, height: 400, nodes: fr.nodes,
  });
}

// 14: the result, the Saved Objects page of the space Guide copy (What you build)
{
  const so = savedObjectsPage({ rows: [['Dashboard', 'Bookshelf (guides)'], ['Dashboard', 'Bookshelf (guides)'], ['Data view', 'Bookshelf logs (guides)']] });
  const d = stack({ crumbs: ['Saved objects'], active: 'Saved Objects', h: 440, page: () => [...so.nodes, lbl(1064 - 0, 130, 'Space: Guide copy', { size: 'small', tone: 'textMuted', anchor: 'end', box: 200 })] });
  figures.push({
    id: '14-result',
    alt: 'Saved objects page of the space Guide copy listing the dashboard Bookshelf (guides) twice, once copied and once imported, and the data view Bookshelf logs (guides) that came with it',
    width: FW, height: 440, nodes: d.nodes,
  });
}

export default { product: 'kibana', guide: 'k12', figures };
