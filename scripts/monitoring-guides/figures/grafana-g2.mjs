// Figures of the Grafana guide G2, "Add a data source" (guide-add-a-data-source.adoc).
// Facts: guides-brief/grafana-facts.md section 3 (Grafana 13.3.0) and the lab provisioning file. A figure shows the screen
// the step starts from, with the control to act on highlighted; a typing step shows the typed value. Callout numbers are the
// step numbers of the page. Colours are theme tokens only. The labels of the derived-field row are not in the facts brief,
// so figure 12 draws only its values.
import { FW, lbl, box, btn, ico, mark, marks, grafanaFrame, G_NAV_W } from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const crumbsFor = (name) => ['Connections', 'Data sources', name];
const navRow = (i) => ({ x: 8, y: 48 + i * 34, w: G_NAV_W - 16, h: 32 });

// Navigation with the Connections group open (Add new connection, Data sources).
function connNav(h) {
  const items = [
    { label: 'Bookmarks', icon: 'star' }, { label: 'Starred', icon: 'star' }, { label: 'Dashboards', icon: 'dashboard' }, { label: 'Explore', icon: 'explore' },
    { label: 'Drilldown', icon: 'search' }, { label: 'AI', icon: 'apps' }, { label: 'Alerting', icon: 'bell' },
    { label: 'Connections', icon: 'database', chevron: 'down', active: false },
    { label: 'Add new connection', indent: 1 }, { label: 'Data sources', indent: 1, active: true }, { label: 'Administration', icon: 'gear' },
  ];
  return { block: 'nav', x: 0, y: 0, w: G_NAV_W, h, logo: 'si:grafana', title: 'Grafana', items, active: 'Data sources' };
}

// One data source type card of the Add data source page: logo (optional), name, Learn more link.
function typeCard(x, y, w, name, logoKey) {
  return [
    box(x, y, w, 64, { fill: 'surface', stroke: 'border', radius: 6 }),
    ...(logoKey ? [{ block: 'logo', x: x + 12, y: y + 16, size: 32, key: logoKey }] : []),
    lbl(x + (logoKey ? 60 : 16), y + 38, name, { weight: 500, box: w - 180 }),
    lbl(x + w - 12, y + 38, 'Learn more', { size: 'small', tone: 'link', anchor: 'end', box: 100 }),
  ];
}

// The Add data source page. `filter` is the text typed into the filter box; `cards` the cards to draw.
function addPage({ h, filter, groups }) {
  const n = [
    lbl(16, 100, 'Add data source', { size: 'heading', weight: 500, box: 400 }),
    lbl(16, 128, 'Choose a data source type', { tone: 'textMuted', box: 400 }),
    btn(FW - 16 - 90, 70, 90, 'Cancel'),
    { block: 'field', x: 16, y: 150, w: 420, ...(filter ? { value: filter } : { placeholder: 'Filter by name or type' }) },
  ];
  let y = 208;
  const geo = { filter: { x: 16, y: 150, w: 420, h: 32 }, cards: {} };
  for (const g of groups) {
    if (g.heading) { n.push(lbl(16, y + 12, g.heading, { weight: 500, box: 400 })); y += 28; }
    g.cards.forEach(([name, key], i) => {
      const cx = 16 + (i % 2) * 532, cy = y + Math.floor(i / 2) * 76;
      n.push(...typeCard(cx, cy, 516, name, key));
      geo.cards[name] = { x: cx, y: cy, w: 516, h: 64 };
    });
    y += Math.ceil(g.cards.length / 2) * 76 + 8;
  }
  return { nodes: grafanaFrame({ h, crumbs: ['Connections', 'Data sources', 'Add data source'], children: n }), geo };
}

// The settings page of a data source: title with the Edit title pencil, buttons, tabs, then `body(geo)`.
function dsPage({ h, name, body = () => [], alert, saveLabel = 'Save & test' }) {
  const tw = Math.ceil(textWidth(name, 28) * 0.93);
  const geo = { pencil: { x: 16 + tw + 10, y: 82, w: 24, h: 24 }, save: { x: FW - 16 - 120, y: h - 52, w: 120, h: 32 } };
  const n = [
    lbl(16, 104, name, { size: 'heading', weight: 500, box: 460 }), ico(geo.pencil.x + 4, geo.pencil.y + 4, 'edit'),
    btn(FW - 16 - 160, 70, 160, 'Build a dashboard'), btn(FW - 16 - 160 - 8 - 120, 70, 120, 'Explore data'),
    { block: 'tabs', x: 16, y: 128, w: 420, tabs: ['Settings', 'Permissions', 'Insights', 'Cache'], active: 0 },
    ...body(geo),
    btn(16, h - 52, 90, 'Delete', 'danger'), btn(FW - 16 - 120 - 8 - 130, h - 52, 130, 'Make default'), btn(geo.save.x, geo.save.y, 120, saveLabel, 'primary'),
  ];
  if (alert) {
    n.push(box(16, h - 104, 640, 40, { fill: 'state.normal.bg', radius: 6 }), ico(28, h - 92, 'check', 'state.normal.text'), lbl(54, h - 78, alert, { weight: 500, tone: 'state.normal.text', box: 590 }));
    geo.alert = { x: 16, y: h - 104, w: 640, h: 40 };
  }
  return { nodes: grafanaFrame({ h, crumbs: crumbsFor(name), children: n }), geo };
}

// A single connection URL field (Prometheus, Loki, Tempo), with a section heading above.
const urlBody = (label, value, authentication = true) => (geo) => {
  geo.url = { x: 16, y: 228, w: 520, h: 32 };
  return [
    lbl(16, 194, 'Connection', { weight: 500, box: 200 }),
    { block: 'field', x: 16, y: 208, w: 520, label, ...(value ? { value } : { placeholder: 'http://localhost:9090' }) },
    ...(authentication ? [lbl(16, 292, 'Authentication', { weight: 500, box: 200 }), { block: 'dropdown', x: 16, y: 304, w: 300, label: 'Authentication method', value: 'No Authentication' }] : []),
  ];
};

const figures = [];

// 01: the Data sources page (steps 1 to 3)
{
  const addBtn = { x: FW - 16 - 192, y: 70, w: 192, h: 32 };
  figures.push({
    id: '01-data-sources-list',
    alt: 'Data sources page of Grafana 13.3 with the Connections group of the navigation open: callout 1 marks Connections, callout 2 marks Data sources and callout 3 marks the Add new data source button; the list shows Loki, Prometheus as the default, Tempo and TestData',
    width: FW, height: 500,
    nodes: [{ block: 'window', x: 0, y: 0, w: FW, h: 500, radius: 0, children: [
      connNav(500),
      { block: 'toolbar', x: G_NAV_W, y: 0, w: FW - G_NAV_W, crumbs: ['Connections', 'Data sources'] },
      lbl(244, 104, 'Data sources', { size: 'heading', weight: 500, box: 400 }),
      lbl(244, 132, 'View and manage your connected data source connections', { tone: 'textMuted', box: 520 }),
      btn(addBtn.x, addBtn.y, 192, 'Add new data source', 'primary', 'plus'), btn(addBtn.x - 8 - 190, 70, 190, 'Enable Advisor checks'),
      { block: 'field', x: 244, y: 164, w: 380, placeholder: 'Search by name or type' },
      { block: 'table', x: 244, y: 216, w: 820, columns: [{ title: 'Name', w: 2 }, { title: 'Type', w: 2 }, { title: 'URL', w: 3 }], rows: [['Loki', 'Loki', 'http://loki:3100'], ['Prometheus (default)', 'Prometheus', 'http://prometheus:9090'], ['Tempo', 'Tempo', 'http://tempo:3200'], ['TestData', 'TestData', '']] },
      ...marks([[navRow(7), 1], [navRow(9), 2], [addBtn, 3]]),
    ] }],
  });
}

// 02: choose the Prometheus card (step 4)
{
  const p = addPage({ h: 420, groups: [{ heading: 'Time series databases', cards: [['Prometheus', 'si:prometheus'], ['Graphite'], ['InfluxDB'], ['OpenTSDB']] }] });
  figures.push({
    id: '02-choose-prometheus',
    alt: 'Add data source page of Grafana 13.3 listing the type cards of Time series databases: Prometheus with its logo, Graphite, InfluxDB and OpenTSDB; callout 4 marks the Prometheus card',
    width: FW, height: 420,
    nodes: p.nodes.concat(mark(p.geo.cards.Prometheus, 4)),
  });
}

// 03: the new data source with its placeholder name; the Edit title pencil (step 5)
{
  const d = dsPage({ h: 480, name: 'prometheus-1', body: urlBody('Prometheus server URL *') });
  figures.push({
    id: '03-rename',
    alt: 'Settings page of the new data source, which Grafana 13.3 created at once under the name prometheus-1: callout 5 marks the Edit title pencil next to the title; the page has the tabs Settings, Permissions, Insights and Cache',
    width: FW, height: 480,
    nodes: d.nodes.concat(mark(d.geo.pencil, 5)),
  });
}

// 04: the Prometheus URL and Save & test (steps 6 and 7)
{
  const d = dsPage({ h: 480, name: 'guide-prometheus', body: urlBody('Prometheus server URL *', 'http://prometheus:9090') });
  figures.push({
    id: '04-prometheus-url',
    alt: 'Settings page of guide-prometheus: the field Prometheus server URL holds http://prometheus:9090 (callout 6) and the Save and test button at the bottom is marked by callout 7',
    width: FW, height: 480,
    nodes: d.nodes.concat(marks([[d.geo.url, 6], [d.geo.save, 7]])),
  });
}

// 05: the success message (step 8)
{
  const d = dsPage({ h: 480, name: 'guide-prometheus', body: urlBody('Prometheus server URL *', 'http://prometheus:9090'), alert: 'Successfully queried the Prometheus API.' });
  figures.push({
    id: '05-prometheus-success',
    alt: 'Settings page of guide-prometheus after Save and test: a green alert reads Successfully queried the Prometheus API, marked by callout 8',
    width: FW, height: 480,
    nodes: d.nodes.concat(mark(d.geo.alert, 8)),
  });
}

// 06: Loki: rename, URL, Save & test (steps 10 to 12)
{
  const d = dsPage({ h: 440, name: 'guide-loki', body: urlBody('URL *', 'http://loki:3100', true) });
  figures.push({
    id: '06-loki-settings',
    alt: 'Settings page of guide-loki: the pencil next to the title is marked by callout 10, the field URL holds http://loki:3100 (callout 11) and the Save and test button is marked by callout 12',
    width: FW, height: 440,
    nodes: d.nodes.concat(marks([[d.geo.pencil, 10], [d.geo.url, 11], [d.geo.save, 12]])),
  });
}

// 07: Tempo: rename, URL, Save & test (steps 14 to 16)
{
  const d = dsPage({ h: 440, name: 'guide-tempo', body: urlBody('URL *', 'http://tempo:3200', true) });
  figures.push({
    id: '07-tempo-settings',
    alt: 'Settings page of guide-tempo: the pencil next to the title is marked by callout 14, the field URL holds http://tempo:3200 (callout 15) and the Save and test button is marked by callout 16',
    width: FW, height: 440,
    nodes: d.nodes.concat(marks([[d.geo.pencil, 14], [d.geo.url, 15], [d.geo.save, 16]])),
  });
}

// 08: PostgreSQL: the filter and the card (steps 17 and 18)
{
  const p = addPage({ h: 300, filter: 'postgres', groups: [{ cards: [['PostgreSQL', 'si:postgresql']] }] });
  figures.push({
    id: '08-choose-postgresql',
    alt: 'Add data source page of Grafana 13.3 with postgres typed into the filter box, marked by callout 17, and the single remaining card PostgreSQL with its logo, marked by callout 18',
    width: FW, height: 300,
    nodes: p.nodes.concat(marks([[p.geo.filter, 17], [p.geo.cards.PostgreSQL, 18]])),
  });
}

// 09: PostgreSQL settings (steps 19 to 25)
{
  const h = 560;
  const g = {};
  const d = dsPage({
    h, name: 'guide-postgres',
    body: (geo) => {
      Object.assign(g, {
        host: { x: 16, y: 228, w: 440, h: 32 }, db: { x: 16, y: 296, w: 440, h: 32 },
        user: { x: 548, y: 228, w: 440, h: 32 }, pass: { x: 548, y: 296, w: 440, h: 32 }, tls: { x: 548, y: 364, w: 440, h: 32 },
      });
      return [
        lbl(16, 194, 'Connection', { weight: 500, box: 200 }),
        { block: 'field', x: 16, y: 208, w: 440, label: 'Host URL *', value: 'postgres:5432' },
        { block: 'field', x: 16, y: 276, w: 440, label: 'Database name *', value: 'bookshelf' },
        lbl(548, 194, 'Authentication', { weight: 500, box: 200 }),
        { block: 'field', x: 548, y: 208, w: 440, label: 'Username *', value: 'bookshelf' },
        { block: 'field', x: 548, y: 276, w: 440, label: 'Password', value: '•••••••' },
        { block: 'dropdown', x: 548, y: 344, w: 440, label: 'TLS/SSL Mode', value: 'disable' },
        ico(16, 436, 'chevronRight'), lbl(40, 449, 'Additional settings', { weight: 500, box: 240 }),
      ];
    },
  });
  figures.push({
    id: '09-postgresql-settings',
    alt: 'Settings page of guide-postgres with the sections Connection and Authentication: the pencil next to the title is marked by callout 19, Host URL holds postgres:5432 (20), Database name holds bookshelf (21), Username holds bookshelf (22), Password holds dots (23), TLS/SSL Mode shows disable (24) and the Save and test button is marked by callout 25',
    width: FW, height: h,
    nodes: d.nodes.concat(marks([[d.geo.pencil, 19], [g.host, 20], [g.db, 21], [g.user, 22], [g.pass, 23], [g.tls, 24], [d.geo.save, 25]])),
  });
}

// 10: TestData: rename and Save & test (steps 27 and 28)
{
  const d = dsPage({ h: 360, name: 'guide-testdata' });
  figures.push({
    id: '10-testdata-settings',
    alt: 'Settings page of guide-testdata, which has no required fields: the pencil next to the title is marked by callout 27 and the Save and test button is marked by callout 28',
    width: FW, height: 360,
    nodes: d.nodes.concat(marks([[d.geo.pencil, 27], [d.geo.save, 28]])),
  });
}

// 11: guide-loki: Additional settings, Derived fields, Add (steps 29 and 30)
{
  const h = 500;
  const add = { x: 16, y: 372, w: 80, h: 32 };
  const d = dsPage({
    h, name: 'guide-loki',
    body: () => [
      ico(16, 190, 'chevronRight'), lbl(40, 203, 'Advanced HTTP settings', { weight: 500, box: 300 }),
      ico(16, 224, 'chevronRight'), lbl(40, 237, 'Alerting', { weight: 500, box: 300 }),
      ico(16, 258, 'chevronRight'), lbl(40, 271, 'Queries', { weight: 500, box: 300 }),
      ico(16, 292, 'chevronDown'), lbl(40, 305, 'Derived fields', { weight: 500, box: 300 }),
      btn(add.x, add.y, 80, 'Add', 'secondary', 'plus'),
    ],
  });
  figures.push({
    id: '11-loki-derived-fields',
    alt: 'Settings page of guide-loki scrolled to Additional settings: the groups Advanced HTTP settings, Alerting, Queries and Derived fields are listed and the Add button of Derived fields is marked by callout 30',
    width: FW, height: h,
    nodes: d.nodes.concat(mark(add, 30)),
  });
}

// 12: the derived field row (steps 31 to 36)
{
  const h = 560;
  const g = {
    name: { x: 40, y: 232, w: 180, h: 32 }, regex: { x: 236, y: 232, w: 420, h: 32 }, query: { x: 672, y: 232, w: 340, h: 32 },
    ds: { x: 40, y: 300, w: 260, h: 32 }, label: { x: 340, y: 300, w: 200, h: 32 },
  };
  const toggleBox = { x: 40, y: 290, w: 32, h: 18 };
  const d = dsPage({
    h, name: 'guide-loki',
    body: () => [
      ico(16, 190, 'chevronDown'), lbl(40, 203, 'Derived fields', { weight: 500, box: 300 }),
      box(24, 216, 1032, 140, { fill: 'surface', stroke: 'border', radius: 6 }),
      { block: 'field', ...g.name, value: 'trace_id' },
      { block: 'field', ...g.regex, value: '"trace_id":\\s*"(\\w+)"', mono: true },
      { block: 'field', ...g.query, value: '${__value.raw}', mono: true },
      { block: 'toggle', x: toggleBox.x, y: 304, on: true },
      { block: 'dropdown', x: 90, y: 300, w: 260, value: 'guide-tempo' },
      { block: 'field', x: 372, y: 300, w: 200, value: 'Trace' },
      btn(24, 372, 80, 'Add', 'secondary', 'plus'),
    ],
  });
  figures.push({
    id: '12-derived-field-row',
    alt: 'Derived field row of guide-loki with five values and no field labels: the name trace_id (callout 31), the regular expression for the trace_id in the log line (32), the query ${__value.raw} (33), the internal link switch on with the data source guide-tempo (34) and the link label Trace (35); callout 36 marks the Save and test button',
    width: FW, height: h,
    nodes: d.nodes.concat(marks([[g.name, 31], [g.regex, 32], [g.query, 33], [{ x: 40, y: 300, w: 310, h: 32 }, 34], [{ x: 372, y: 300, w: 200, h: 32 }, 35], [d.geo.save, 36]])),
  });
}

// 13: the data source list at the end (What you build)
{
  figures.push({
    id: '13-result',
    alt: 'Data sources page of Grafana 13.3 after the guide: the new data sources guide-loki, guide-postgres, guide-prometheus, guide-tempo and guide-testdata are listed above the four provisioned ones, Loki, Prometheus as the default, Tempo and TestData',
    width: FW, height: 560,
    nodes: grafanaFrame({ h: 560, crumbs: ['Connections', 'Data sources'], children: [
      lbl(16, 104, 'Data sources', { size: 'heading', weight: 500, box: 400 }),
      btn(FW - 16 - 192, 70, 192, 'Add new data source', 'primary', 'plus'),
      { block: 'field', x: 16, y: 130, w: 380, placeholder: 'Search by name or type' },
      { block: 'table', x: 16, y: 182, w: 1048, columns: [{ title: 'Name', w: 2 }, { title: 'Type', w: 2 }, { title: 'URL', w: 3 }], rows: [
        ['guide-loki', 'Loki', 'http://loki:3100'], ['guide-postgres', 'PostgreSQL', 'postgres:5432'], ['guide-prometheus', 'Prometheus', 'http://prometheus:9090'],
        ['guide-tempo', 'Tempo', 'http://tempo:3200'], ['guide-testdata', 'TestData', ''], ['Loki', 'Loki', 'http://loki:3100'],
        ['Prometheus (default)', 'Prometheus', 'http://prometheus:9090'], ['Tempo', 'Tempo', 'http://tempo:3200'], ['TestData', 'TestData', ''],
      ] },
    ] }),
  });
}

export default { product: 'grafana', guide: 'g2', figures };
