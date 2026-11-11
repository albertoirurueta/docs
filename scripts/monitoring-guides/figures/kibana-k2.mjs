// Figures of the Kibana guide K2, "Upload a file and create a data view" (guide-data-views-and-file-upload.adoc).
// Facts: guides-brief/kibana-facts.md section 3 (Kibana 9.5.6). Verified there: the Upload file tab with its texts, the
// header detection result of the lab CSV (columns column1..column5 until Has header row is ticked), the Data Views page,
// the Create data view flyout (Name, Index pattern, Timestamp field, Show advanced settings, Close, Save data view to
// Kibana) and the Stack Management menu groups. NOT VERIFIED there (drawn generically; labels the task text or the product
// family use, never a layout claim): the analysis screen after a file is chosen, the Override settings window (only the
// checkbox Has header row is named, the other settings are grey bars), the unlabelled import button, the data view detail
// page, the runtime field flyout with its Preview pane and the field editor with its format settings. The file picker and
// the upload itself were not exercised in the browser.
// A figure shows the screen the step starts from with the control to act on highlighted; callout numbers are step numbers.
import { textWidth } from '../lib/text.mjs';
import { FW, lbl, box, btn, ico, mark, marks, kibanaFrame } from '../lib/shells.mjs';

const figures = [];
const bar = (x, y, w) => box(x, y, w, 10, { fill: 'surfaceRaised', radius: 4 });

// ---- the Add data page, tab Upload file -------------------------------------------------------------------------------
function uploadBase({ children = [] }) {
  const fr = kibanaFrame({ h: 520, crumbs: ['Home'] });
  fr.nodes[0].children.push(
    lbl(16, 140, 'Add data', { size: 'heading', weight: 700, tone: 'textStrong', box: 400 }),
    { block: 'tabs', x: 16, y: 156, w: 300, tabs: ['Upload file', 'Sample data'], active: 0 },
    ...(typeof children === 'function' ? children() : children),
  );
  return fr.nodes;
}

// ---- the analysis screen of a chosen file --------------------------------------------------------------------------------
const ROWS = [['Dune', 'Frank Herbert', 'Science Fiction', '412', '1965'], ['Neuromancer', 'William Gibson', 'Science Fiction', '271', '1984'], ['Foundation', 'Isaac Asimov', 'Science Fiction', '255', '1951']];
const HEAD = ['title', 'author', 'genre', 'pages', 'published_year'];
function analysis({ header, overrideOpen = false, children = () => [] }) {
  const fr = kibanaFrame({ h: 520, crumbs: ['Home'] });
  const override = { x: 16, y: 190, w: 150, h: 32 };
  const importBtn = { x: 16, y: 456, w: 120, h: 32 };
  const tableX = 16, tableW = 680;
  const n = [
    lbl(16, 140, 'bookshelf-books.csv', { size: 'heading', weight: 700, tone: 'textStrong', box: 600 }),
    lbl(16, 170, 'The file is delimited text with the delimiter comma and the quote character.', { size: 'small', tone: 'textMuted', box: 680 }),
    btn(override.x, override.y, override.w, 'Override settings'),
    { block: 'table', x: tableX, y: 244, w: tableW,
      columns: [{ title: header ? 'title' : 'column1', w: 2 }, { title: header ? 'author' : 'column2', w: 2 }, { title: header ? 'genre' : 'column3', w: 2 }, { title: header ? 'pages' : 'column4', w: 1 }, { title: header ? 'published_year' : 'column5', w: 2 }],
      rows: header ? ROWS : [HEAD, ...ROWS] },
    box(importBtn.x, importBtn.y, importBtn.w, importBtn.h, { fill: 'primary', radius: 4 }),
  ];
  const g = { override, importBtn, table: { x: tableX, y: 244, w: tableW, h: 150 } };
  if (overrideOpen) {
    n.push({ block: 'flyout', x: 704, y: 96, w: 360, h: 424, title: 'Override settings' });
    g.header = { x: 724, y: 150, w: 240, h: 18 };
    n.push({ block: 'checkbox', x: 724, y: 150, label: 'Has header row', checked: true, box: 200 });
    n.push(bar(724, 196, 280), bar(724, 226, 220), bar(724, 256, 250), bar(724, 286, 200));
    g.apply = { x: 724, y: 456, w: 110, h: 32 };
    n.push(box(g.apply.x, g.apply.y, g.apply.w, g.apply.h, { fill: 'primary', radius: 4 }), btn(842, 456, 90, 'Close'));
  }
  fr.nodes[0].children.push(...n, ...children(g));
  return fr.nodes;
}

// ---- Stack Management menu --------------------------------------------------------------------------------------------
const SM = [
  { label: 'Ingest' }, { label: 'Ingest pipelines', indent: 1 },
  { label: 'Data' }, { label: 'Index Management', indent: 1 },
  { label: 'Alerts and Insights' }, { label: 'Rules', indent: 1 }, { label: 'Connectors', indent: 1 },
  { label: 'Kibana' }, { label: 'Data Views', indent: 1 }, { label: 'Saved Objects', indent: 1 },
];
const smRow = (i) => ({ x: 8, y: 96 + 8 + i * 34, w: 232, h: 32 });

function smPage({ crumbs, active, children = () => [], h = 520, body = [] }) {
  const fr = kibanaFrame({ h, crumbs });
  const items = SM.map((it) => (it.label === active ? { ...it, active: true } : it));
  fr.nodes[0].children.push({ block: 'nav', x: 0, y: 96, w: 248, h: h - 96, items }, ...body, ...children(fr.geo));
  return fr.nodes;
}

// The fields table of the data view page. `format` shows the Format cell of attributes.uri.
function fieldRows(opts = {}) {
  const base = [['@timestamp', 'date', ''], ['attributes.status', 'number', ''], ['attributes.uri', 'string', opts.format ? 'Url' : ''], ['body.text', 'string', ''], ['severity_text', 'string', ''], ['trace_id', 'string', '']];
  return opts.runtime ? [...base, ['status_class', 'string', '']] : base;
}
function dvBody({ rows, search, title = 'Bookshelf logs (guides)' }) {
  const geo = { add: { x: 940, y: 150, w: 124, h: 32 }, search: { x: 272, y: 196, w: 420, h: 32 }, table: { x: 272, y: 244, w: 792, h: 30 * (rows.length + 1) } };
  const n = [
    lbl(272, 132, title, { size: 'heading', weight: 700, tone: 'textStrong', box: 640 }),
    lbl(272, 160, 'logs-generic.otel-default', { size: 'small', tone: 'textMuted', box: 400 }),
    btn(geo.add.x, geo.add.y, geo.add.w, 'Add field', 'secondary', 'plus'),
    { block: 'field', x: geo.search.x, y: geo.search.y, w: geo.search.w, ...(search ? { value: search } : { placeholder: 'Search' }) },
    { block: 'table', x: 272, y: 244, w: 792, columns: [{ title: 'Name', w: 4 }, { title: 'Type', w: 2 }, { title: 'Format', w: 2 }, { title: '', w: 1 }], rows: rows.map((r) => [...r, '']) },
  ];
  rows.forEach((r, i) => n.push(ico(1030, 244 + 30 * (i + 1) + 7, 'edit', 'textMuted')));
  geo.edit = (i) => ({ x: 1024, y: 244 + 30 * (i + 1) + 3, w: 28, h: 24 });
  return { n, geo };
}

// ---- 01: the upload page filled in (steps 2 to 4) ---------------------------------------------------------------------
{
  const geo = { method: { x: 16, y: 262, w: 180, h: 32 }, name: { x: 16, y: 330, w: 560, h: 32 }, drop: { x: 16, y: 404, w: 700, h: 96 } };
  const nodes = uploadBase({ children: [
    lbl(16, 206, 'Upload your file, analyze its data, and import the data into an Elasticsearch index.', { tone: 'textMuted', box: 800 }),
    lbl(16, 246, 'Select index creation method', { weight: 500, box: 400 }),
    box(geo.method.x, geo.method.y, 180, 32, { fill: 'inputBg', stroke: 'borderStrong', radius: 6 }),
    box(18, 264, 88, 28, { fill: 'navActiveBg', radius: 4 }), lbl(62, 283, 'New index', { weight: 500, anchor: 'middle', box: 80 }), lbl(150, 283, 'Existing index', { anchor: 'middle', box: 84, size: 'small' }),
    { block: 'field', x: 16, y: 310, w: 560, label: 'Index name', value: 'guide-books', hint: 'Index names must be lowercase and can only contain hyphens and numbers.' },
    box(geo.drop.x, geo.drop.y, geo.drop.w, geo.drop.h, { fill: 'surface', stroke: 'borderStrong', radius: 6, dash: '6 4' }),
    lbl(366, 448, 'Select or drag and drop files', { size: 'title', weight: 600, anchor: 'middle', box: 600 }),
    lbl(366, 472, 'Supported formats: PDF, TXT, CSV, log files and NDJSON', { size: 'small', tone: 'textMuted', anchor: 'middle', box: 600 }),
    ...marks([[geo.method, 2], [{ x: 16, y: 330, w: 560, h: 32 }, 3], [geo.drop, 4]]),
  ] });
  figures.push({
    id: '01-upload-page',
    alt: 'Add data page of Kibana 9.5 on the tab Upload file: New index is selected (callout 2), the Index name field holds guide-books (callout 3) and the drop zone Select or drag and drop files accepts CSV (callout 4)',
    width: FW, height: 520, nodes,
  });
}

// ---- 02: the analysis without a header row (step 5) ---------------------------------------------------------------------
figures.push({
  id: '02-analysis-without-header',
  alt: 'Analysis of bookshelf-books.csv in Kibana 9.5: the first row title, author, genre, pages, published_year is read as data under the column names column1 to column5; the button Override settings is marked by callout 5',
  width: FW, height: 520, nodes: analysis({ header: false, children: (g) => mark(g.override, 5) }),
});

// ---- 03: Override settings (steps 6 and 7) ---------------------------------------------------------------------------------
figures.push({
  id: '03-override-settings',
  alt: 'Override settings window of the file analysis with the checkbox Has header row ticked and marked by callout 6 and the primary button that confirms the window marked by callout 7',
  width: FW, height: 520, nodes: analysis({ header: false, overrideOpen: true, children: (g) => marks([[g.header, 6], [g.apply, 7]]) }),
});

// ---- 04: the corrected preview and the import button (steps 8 and 9) --------------------------------------------------------
figures.push({
  id: '04-header-detected',
  alt: 'Analysis of bookshelf-books.csv after the override: the columns are title, author, genre, pages and published_year, marked by callout 8; the primary button that starts the import is marked by callout 9',
  width: FW, height: 520, nodes: analysis({ header: true, children: (g) => marks([[g.table, 8], [g.importBtn, 9]]) }),
});

// ---- 05: navigation, Management section (steps 11 and 12) ------------------------------------------------------------------
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Home'] });
  const items = [{ label: 'Observability' }, { label: 'Security' }, { label: 'Management' }, { label: 'Dev Tools', indent: 1 }, { label: 'Workflows', indent: 1 },
    { label: 'Integrations', indent: 1 }, { label: 'Fleet', indent: 1 }, { label: 'Osquery', indent: 1 }, { label: 'Stack Monitoring', indent: 1 },
    { label: 'Cloud Connect', indent: 1 }, { label: 'Stack Management', indent: 1 }, { label: 'Streams', indent: 1 }];
  fr.nodes[0].children.push({ block: 'nav', x: 0, y: 96, w: 248, h: 424, items }, ...marks([[fr.geo.menu, 11], [{ x: 8, y: 96 + 8 + 10 * 34, w: 232, h: 32 }, 12]]));
  figures.push({
    id: '05-navigation-management',
    alt: 'Kibana 9.5 with the primary navigation open and scrolled to the Management section: callout 11 marks the menu button of the second bar and callout 12 marks Stack Management',
    width: FW, height: 520, nodes: fr.nodes,
  });
}

// ---- 06: Stack Management, Data Views (step 13) ---------------------------------------------------------------------------
figures.push({
  id: '06-stack-management-menu',
  alt: 'Stack Management of Kibana 9.5 with its left menu groups Ingest, Data, Alerts and Insights and Kibana; Data Views under Kibana is marked by callout 13',
  width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management'], children: () => mark(smRow(8), 13), body: [lbl(272, 132, 'Stack Management', { size: 'heading', weight: 700, tone: 'textStrong', box: 600 }), bar(272, 160, 420), bar(272, 184, 360)] }),
});

// ---- 07: the Data Views page (step 14) --------------------------------------------------------------------------------------
{
  const create = { x: 892, y: 150, w: 172, h: 32 };
  const names = [['Kibana Sample Data eCommerce', 'Default'], ['Kibana Sample Data Logs'], ['APM', 'Managed'], ['Case Analytics', 'Managed']];
  const body = [
    lbl(272, 132, 'Data Views', { size: 'heading', weight: 700, tone: 'textStrong', box: 400 }),
    lbl(272, 160, 'Create and manage the data views that help you retrieve your data from Elasticsearch.', { size: 'small', tone: 'textMuted', box: 600 }),
    btn(create.x, create.y, create.w, 'Create data view', 'primary'),
    { block: 'table', x: 272, y: 204, w: 792, columns: [{ title: 'Name', w: 5 }, { title: 'Spaces', w: 2 }, { title: 'Actions', w: 2 }], rows: names.map((r) => [r[0], 'D', '']) },
  ];
  names.forEach((r, i) => {
    if (r[1]) body.push({ block: 'pill', x: 272 + 14 + Math.ceil(textWidth(r[0], 12)) + 8, y: 204 + 30 * (i + 1) + 5, str: r[1], state: 'nodata' });
  });
  figures.push({
    id: '07-data-views-page',
    alt: 'Data Views page of Kibana 9.5 listing the sample data views Kibana Sample Data eCommerce, Kibana Sample Data Logs, APM and Case Analytics; the primary button Create data view is marked by callout 14',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views'], active: 'Data Views', body, children: () => mark(create, 14) }),
  });
}

// ---- 08: Create data view flyout (steps 15 to 18) ----------------------------------------------------------------------------
{
  const fx = 264, fy = 96, fw = 800, fh = 424;
  const name = { x: fx + 24, y: fy + 76, w: 360, h: 32 }, pattern = { x: fx + 24, y: fy + 144, w: 360, h: 32 }, ts = { x: fx + 24, y: fy + 212, w: 360, h: 32 };
  const saveW = 210, save = { x: fx + fw - 24 - saveW, y: fy + fh - 52, w: saveW, h: 32 };
  const body = [
    { block: 'flyout', x: fx, y: fy, w: fw, h: fh, title: 'Create data view' },
    { block: 'field', x: name.x, y: name.y - 20, w: 360, label: 'Name', value: 'Bookshelf logs (guides)' },
    { block: 'field', x: pattern.x, y: pattern.y - 20, w: 360, label: 'Index pattern', value: 'logs-generic.otel-default' },
    { block: 'dropdown', x: ts.x, y: ts.y - 20, w: 360, label: 'Timestamp field', value: '@timestamp' },
    lbl(fx + 24, fy + 284, 'Show advanced settings', { tone: 'link', box: 300 }),
    box(fx + 430, fy + 60, 346, 200, { fill: 'canvas', stroke: 'border', radius: 6 }),
    lbl(fx + 446, fy + 96, 'logs-generic.otel-default', { weight: 500, box: 220 }), lbl(fx + 680, fy + 96, 'Data stream', { size: 'small', tone: 'textMuted', box: 90 }),
    btn(fx + 24, save.y, 90, 'Close'), btn(save.x, save.y, saveW, 'Save data view to Kibana', 'primary'),
    ...marks([[name, 15], [pattern, 16], [ts, 17], [save, 18]]),
  ];
  figures.push({
    id: '08-create-data-view',
    alt: 'Create data view flyout of Kibana 9.5 with the Name Bookshelf logs (guides) (callout 15), the Index pattern logs-generic.otel-default (callout 16), the Timestamp field @timestamp (callout 17) and the primary button Save data view to Kibana (callout 18)',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views'], active: 'Data Views', body }),
  });
}

// ---- 09: the data view page, Add field (step 20) ---------------------------------------------------------------------------------
{
  const d = dvBody({ rows: fieldRows() });
  figures.push({
    id: '09-data-view-page',
    alt: 'Page of the data view Bookshelf logs (guides) in Kibana 9.5 with its fields table, including attributes.status and attributes.uri; the button Add field is marked by callout 20',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views', 'Bookshelf logs (guides)'], active: 'Data Views', body: d.n, children: () => mark(d.geo.add, 20) }),
  });
}

// ---- 10: runtime field flyout (steps 21 to 23) -----------------------------------------------------------------------------------
const SCRIPT = [
  "if (doc['attributes.status'].size() == 0) { return; }",
  "long s = doc['attributes.status'].value;",
  'if (s >= 500) { emit("5xx"); }',
  'else if (s >= 400) { emit("4xx"); }',
  'else { emit("2xx"); }',
];
function runtimeFlyout({ preview, children }) {
  const fx = 264, fy = 96, fw = 800, fh = 424;
  const name = { x: fx + 24, y: fy + 56, w: 330, h: 32 }, type = { x: fx + 380, y: fy + 56, w: 200, h: 32 }, editor = { x: fx + 24, y: fy + 112, w: 540, h: 130 };
  const save = { x: fx + fw - 24 - 90, y: fy + fh - 52, w: 90, h: 32 };
  const n = [
    { block: 'flyout', x: fx, y: fy, w: fw, h: fh, title: 'Create field' },
    { block: 'field', x: name.x, y: name.y - 20, w: 330, label: 'Name', value: 'status_class' },
    { block: 'dropdown', x: type.x, y: type.y - 20, w: 200, label: 'Type', value: 'Keyword' },
    { block: 'queryEditor', x: editor.x, y: editor.y, w: editor.w, h: editor.h, lines: SCRIPT, lineNumbers: true },
    btn(fx + 24, save.y, 90, 'Cancel'), btn(save.x, save.y, 90, 'Save', 'primary'),
  ];
  const pv = { x: fx + 590, y: fy + 56, w: 186, h: 186 };
  if (preview) {
    n.push(box(pv.x, pv.y, pv.w, pv.h, { fill: 'canvas', stroke: 'border', radius: 6 }), lbl(pv.x + 12, pv.y + 26, 'Preview', { weight: 600, box: 160 }));
    ['2xx', '2xx', '4xx', '2xx', '5xx'].forEach((v, i) => n.push(lbl(pv.x + 12, pv.y + 56 + i * 24, v, { box: 160 })));
  }
  return { nodes: n, geo: { name, type, editor, save, pv }, build: (body) => body };
}
{
  const f = runtimeFlyout({ preview: false });
  const d = dvBody({ rows: fieldRows() });
  figures.push({
    id: '10-runtime-field',
    alt: 'Flyout for a new runtime field with the Name status_class (callout 21), the Type Keyword (callout 22) and the script that emits 5xx, 4xx or 2xx from attributes.status (callout 23)',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views', 'Bookshelf logs (guides)'], active: 'Data Views', body: [...d.n, ...f.nodes], children: () => marks([[f.geo.name, 21], [f.geo.type, 22], [f.geo.editor, 23]]) }),
  });
}

// ---- 11: the preview and Save (steps 24 and 25) ------------------------------------------------------------------------------------
{
  const f = runtimeFlyout({ preview: true });
  const d = dvBody({ rows: fieldRows() });
  figures.push({
    id: '11-runtime-preview',
    alt: 'Flyout of the runtime field status_class with the Preview pane listing the values 2xx, 4xx and 5xx of sample documents, marked by callout 24, and the primary button Save marked by callout 25',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views', 'Bookshelf logs (guides)'], active: 'Data Views', body: [...d.n, ...f.nodes], children: () => marks([[f.geo.pv, 24], [f.geo.save, 25]]) }),
  });
}

// ---- 12: search the field and edit it (steps 26 and 27) ---------------------------------------------------------------------------------
{
  const d = dvBody({ rows: [['attributes.uri', 'string', '']], search: 'attributes.uri' });
  figures.push({
    id: '12-find-field',
    alt: 'Data view page with the search box holding attributes.uri (callout 26) and the fields table narrowed to the row attributes.uri, whose edit button is marked by callout 27',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views', 'Bookshelf logs (guides)'], active: 'Data Views', body: d.n, children: () => marks([[d.geo.search, 26], [d.geo.edit(0), 27]]) }),
  });
}

// ---- 13: the field editor with the format (steps 28 to 30) ----------------------------------------------------------------------------------
{
  const fx = 584, fy = 96, fw = 480, fh = 424;
  const fmt = { x: fx + 24, y: fy + 128, w: 300, h: 32 }, tpl = { x: fx + 24, y: fy + 224, w: 432, h: 32 };
  const save = { x: fx + fw - 24 - 90, y: fy + fh - 52, w: 90, h: 32 };
  const d = dvBody({ rows: [['attributes.uri', 'string', '']], search: 'attributes.uri' });
  const body = [
    ...d.n,
    { block: 'flyout', x: fx, y: fy, w: fw, h: fh, title: 'Edit field' },
    { block: 'field', x: fx + 24, y: fy + 40, w: 432, label: 'Name', value: 'attributes.uri' },
    { block: 'toggle', x: fx + 24, y: fy + 108 - 6, label: 'Set format', on: true, box: 200 },
    { block: 'dropdown', x: fmt.x, y: fmt.y + 6, w: 300, value: 'Url' },
    { block: 'field', x: tpl.x, y: tpl.y - 20, w: 432, label: 'Url template', value: 'http://localhost:8080{{rawValue}}', mono: true },
    btn(fx + 24, save.y, 90, 'Cancel'), btn(save.x, save.y, 90, 'Save', 'primary'),
  ];
  figures.push({
    id: '13-url-format',
    alt: 'Field editor of attributes.uri with Set format turned on, the format Url (callout 28), the Url template http://localhost:8080 followed by the raw value placeholder (callout 29) and the primary button Save (callout 30)',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views', 'Bookshelf logs (guides)'], active: 'Data Views', body, children: () => marks([[{ x: fmt.x, y: fmt.y + 6, w: 300, h: 32 }, 28], [{ x: tpl.x, y: tpl.y, w: 432, h: 32 }, 29], [save, 30]]) }),
  });
}

// ---- 14: the finished data view (What you build) ----------------------------------------------------------------------------------------------
{
  const d = dvBody({ rows: fieldRows({ runtime: true, format: true }) });
  figures.push({
    id: '14-result',
    alt: 'Result: the data view Bookshelf logs (guides) in Kibana 9.5 with the index pattern logs-generic.otel-default, the runtime field status_class in the fields table and the format Url on attributes.uri',
    width: FW, height: 520, nodes: smPage({ crumbs: ['Stack Management', 'Data Views', 'Bookshelf logs (guides)'], active: 'Data Views', body: d.n }),
  });
}

export default { product: 'kibana', guide: 'k2', figures };
