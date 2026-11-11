// Figures of the Kibana guide K17, "Tour of the Observability apps" (guide-observability-apps-tour.adoc).
// Facts: guides-brief/kibana-facts.md sections 1 and 12 (Kibana 9.5.6). Verified there: the primary navigation with its
// Observability entries, the APM Service inventory (tabs, filters, the anomaly detection banner, the table columns and the
// bookshelf row), the service page tabs and its Transactions tab (transaction type, charts, the four transactions), and the
// empty Infrastructure -> Hosts page. NOT VERIFIED there (drawn generically): the service Overview tab, the trace waterfall
// of a transaction, the content of the Logs tab, the Service map, whether Applications and Infrastructure open a submenu,
// and the Discover document list (its columns are the Bookshelf log fields of the facts). The waterfall shows only the
// root span, because the child spans of the lab traces are not known. Callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, kibanaFrame, kFilterRow } from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const figures = [];

// The box of a tab of a `tabs` block placed at (x, y): widths follow lib/blocks.mjs tabBar.
function tabBox(x, y, tabs, active, name) {
  let cx = x;
  for (let i = 0; i < tabs.length; i++) {
    const tw = Math.ceil(textWidth(tabs[i], 14, { weight: i === active ? 500 : 400 })) + 24;
    if (tabs[i] === name) return { x: cx, y, w: tw, h: 32 };
    cx += tw;
  }
  throw new Error(`no tab ${name}`);
}

const SERVICE_TABS = ['Overview', 'Transactions', 'Dependencies', 'Errors', 'Metrics', 'Infrastructure', 'Service map', 'Logs', 'Alerts', 'Dashboards'];
const LAT = [88, 94, 90, 97, 91, 89, 95, 92, 90, 93, 96, 91];
const THR = [60, 66, 63, 68, 64, 62, 67, 65, 63, 66, 69, 64];
const FAIL = [1, 0.8, 1.1, 0.9, 1, 0.7, 1.2, 0.9, 0.8, 1, 0.9, 1.1];
const TIMES = ['10:00', '10:15', '10:30', '10:45', '11:00'];

// A service page: breadcrumbs, the bookshelf header with Actions, the tab strip, and the body drawn by `body`.
function servicePage({ h, active, crumbs = ['Applications', 'Services', 'bookshelf'], body, children }) {
  const fr = kibanaFrame({ h, crumbs });
  const tabsY = 150;
  const geo = { ...fr.geo, tabs: {} };
  SERVICE_TABS.forEach((t) => { geo.tabs[t] = tabBox(16, tabsY, SERVICE_TABS, SERVICE_TABS.indexOf(active), t); });
  const n = [
    lbl(16, 136, 'bookshelf', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 }),
    lbl(160, 134, 'No SLOs', { size: 'small', tone: 'textMuted', box: 120 }),
    btn(FW - 16 - 110, 108, 110, 'Actions', 'secondary', 'chevronDown'),
    { block: 'tabs', x: 16, y: tabsY, w: FW - 32, tabs: SERVICE_TABS, active: SERVICE_TABS.indexOf(active) },
    ...body(geo),
  ];
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(geo) : children ?? []));
  return { nodes: fr.nodes, geo };
}

// Three small charts of a service: latency, throughput, failed transaction rate.
function serviceCharts(x, y, w, h) {
  const cw = (w - 24) / 3;
  const defs = [
    ['Latency', [{ name: 'Average', points: LAT }], 120, ['0', '40', '80', '120']],
    ['Throughput', [{ name: 'request', points: THR }], 100, ['0', '33', '66', '100']],
    ['Failed transaction rate', [{ name: 'request', points: FAIL }], 4, ['0', '1', '2', '4']],
  ];
  const out = [];
  defs.forEach(([t, s, max, yl], i) => {
    const cx = x + i * (cw + 12);
    out.push({ block: 'panel', x: cx, y, w: cw, h, title: t });
    out.push({ block: 'line', x: cx + 6, y: y + 36, w: cw - 12, h: h - 42, series: s, min: 0, max, yLabels: yl, xLabels: TIMES.filter((_, k) => k % 2 === 0), legend: false, area: true });
  });
  return out;
}

// 01: the primary navigation with the Observability entries (steps 1 and 2)
{
  const fr = kibanaFrame({ h: 560, crumbs: ['Home'] });
  const items = [
    { label: 'Home', icon: 'home' }, { label: 'Analytics' }, { label: 'Elasticsearch' }, { label: 'Observability' },
    { label: 'Overview', indent: 1 }, { label: 'Alerts', indent: 1 }, { label: 'SLOs', indent: 1 }, { label: 'Cases', indent: 1 },
    { label: 'Logs', indent: 1 }, { label: 'Infrastructure', indent: 1 }, { label: 'Applications', indent: 1 }, { label: 'Synthetics', indent: 1 },
    { label: 'User Experience', indent: 1 }
  ];
  fr.nodes[0].children.push(
    { block: 'nav', x: 0, y: 96, w: 248, h: 456, items },
    ...marks([[fr.geo.menu, 1], [{ x: 8, y: 96 + 8 + 10 * 34, w: 232, h: 32 }, 2]]),
  );
  figures.push({
    id: '01-primary-navigation',
    alt: 'Kibana 9.5 with the primary navigation open and the Observability section listing Overview, Alerts, SLOs, Cases, Logs, Infrastructure, Applications, Synthetics and User Experience; callout 1 marks the menu button of the second bar and callout 2 marks Applications',
    width: FW, height: 560, nodes: fr.nodes,
  });
}

// 02: the service inventory (steps 3 and 4)
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Applications'] });
  const tabs = ['Inventory', 'Service map', 'Service groups'];
  const tableY = 292;
  const rowBox = { x: 16, y: tableY + 30, w: 1048, h: 30 };
  const nameCell = { x: 20, y: tableY + 33, w: 90, h: 24 };
  fr.nodes[0].children.push(
    lbl(16, 136, 'Service inventory', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 }),
    { block: 'tabs', x: 16, y: 150, w: 1048, tabs, active: 0 },
    { block: 'dropdown', x: 16, y: 196, w: 220, value: 'Environment' },
    { block: 'dropdown', x: 248, y: 196, w: 220, value: 'Comparison' },
    box(16, 240, 1048, 40, { fill: 'navActiveBg', stroke: 'border', radius: 6 }),
    lbl(32, 265, 'Enable anomaly detection to surface anomaly scores across your services', { box: 900 }),
    { block: 'table', x: 16, y: tableY, w: 1048, columns: [{ title: 'Name', w: 2 }, { title: 'Environment', w: 2 }, { title: 'Latency (avg.)', w: 2 }, { title: 'Throughput', w: 2 }, { title: 'Failed transaction rate', w: 3 }, { title: 'Actions', w: 1 }], rows: [['bookshelf', 'lab', '92 ms', '264.0 tpm', '0.9 %', '...']], selectedRow: 0 },
    ...mark(rowBox, 3), ...mark(nameCell, 4),
  );
  figures.push({
    id: '02-service-inventory',
    alt: 'Service inventory of APM in Kibana 9.5 with the tabs Inventory, Service map and Service groups, the Environment and Comparison filters, the anomaly detection banner and a table with one row, bookshelf in the environment lab; callout 3 marks the row and callout 4 marks the name bookshelf',
    width: FW, height: 520, nodes: fr.nodes,
  });
}

// 03: the overview of the service (step 5)
{
  const p = servicePage({
    h: 520, active: 'Overview',
    body: () => [
      ...serviceCharts(16, 204, 1048, 220),
    ],
    children: (g) => mark(g.tabs.Transactions, 5),
  });
  figures.push({
    id: '03-service-overview',
    alt: 'Service page of bookshelf in Kibana 9.5 on its Overview tab with the tabs Overview, Transactions, Dependencies, Errors, Metrics, Infrastructure, Service map, Logs, Alerts and Dashboards and three charts for latency, throughput and failed transaction rate; the Transactions tab is marked by callout 5',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 04: the Transactions tab (step 6)
{
  const tx = [['GET /api/loans', '91 ms', '65 tpm', '0.8 %'], ['GET /api/search', '92 ms', '66 tpm', '1.1 %'], ['GET /api/books', '93 ms', '65 tpm', '0.9 %'], ['GET /api/books/{id}', '90 ms', '64 tpm', '0.9 %']];
  const ty = 392;
  const p = servicePage({
    h: 560, active: 'Transactions',
    body: () => [
      lbl(16, 206, 'Transaction type', { size: 'small', weight: 500, box: 200 }),
      { block: 'dropdown', x: 16, y: 214, w: 200, value: 'request' },
      ...serviceCharts(16, 258, 1048, 120),
      { block: 'table', x: 16, y: ty, w: 1048, columns: [{ title: 'Name', w: 3 }, { title: 'Latency (avg.)', w: 2 }, { title: 'Throughput', w: 2 }, { title: 'Failed transaction rate', w: 3 }], rows: tx, selectedRow: 1 },
    ],
    children: () => mark({ x: 16, y: ty + 60, w: 1048, h: 30 }, 6),
  });
  figures.push({
    id: '04-transactions',
    alt: 'Transactions tab of the bookshelf service in Kibana 9.5 with the transaction type request, charts for latency, throughput and failed transaction rate, and a table of four transactions, GET /api/loans, GET /api/search, GET /api/books and GET /api/books/{id}; the row GET /api/search is marked by callout 6',
    width: FW, height: 560, nodes: p.nodes,
  });
}

// 05: the trace waterfall of a transaction (step 7)
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Applications', 'Services', 'bookshelf', 'Transactions', 'GET /api/search'] });
  const wx = 40, ww = 996, wy = 312;
  const wf = { x: 24, y: 262, w: 1032, h: 190 };
  fr.nodes[0].children.push(
    lbl(16, 136, 'GET /api/search', { size: 'heading', weight: 500, tone: 'textStrong', box: 500 }),
    { block: 'chip', x: 16, y: 150, str: 'request' },
    { block: 'panel', x: 16, y: 190, w: 1048, h: 44, title: 'Latency distribution' },
    { block: 'panel', x: 16, y: 258, w: 1048, h: 232, title: 'Trace sample' },
    lbl(wx, wy - 6, '0 ms', { size: 'small', tone: 'textMuted', box: 80 }),
    lbl(wx + ww, wy - 6, '92 ms', { size: 'small', tone: 'textMuted', anchor: 'end', box: 80 }),
    box(wx, wy, ww, 1, { fill: 'border' }),
    box(wx, wy + 20, ww, 28, { fill: 'series.2', radius: 3 }),
    lbl(wx + 12, wy + 39, 'GET /api/search', { weight: 500, box: 400 }),
    lbl(wx + ww - 12, wy + 39, '92 ms', { anchor: 'end', box: 100 }),
    ...mark({ x: wx, y: wy + 20, w: ww, h: 28 }, 7),
  );
  void wf;
  figures.push({
    id: '05-trace-waterfall',
    alt: 'Page of the transaction GET /api/search in Kibana 9.5 with a latency distribution and, in the Trace sample panel, a waterfall whose bar for the transaction GET /api/search spans the whole time axis from 0 to 92 ms; the waterfall is marked by callout 7',
    width: FW, height: 520, nodes: fr.nodes,
  });
}

// 06: the Logs tab of the service (step 8)
{
  const p = servicePage({
    h: 520, active: 'Logs',
    body: () => [
      { block: 'field', x: 16, y: 204, w: 520, placeholder: 'Search log messages' },
      { block: 'table', x: 16, y: 252, w: 1048, columns: [{ title: 'Timestamp', w: 2 }, { title: 'Message', w: 6 }], rows: [['10:42:07.114', 'Served /api/search'], ['10:42:06.882', 'Served /api/books'], ['10:42:06.351', 'Served /api/loans'], ['10:42:05.977', 'Served /api/search']] },
    ],
    children: (g) => mark(g.tabs.Logs, 8),
  });
  figures.push({
    id: '06-service-logs',
    alt: 'Logs tab of the bookshelf service in Kibana 9.5 listing four log lines with a timestamp and a message such as Served /api/search; the Logs tab is marked by callout 8',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 07: Discover with the trace id query (steps 9 to 11)
{
  const fr = kibanaFrame({ h: 560, crumbs: ['Discover'], actions: [{ label: 'New', w: 70 }, { label: 'Open', w: 76 }, { label: 'Share', w: 90, icon: 'share' }, { label: 'Save', kind: 'primary', w: 80 }] });
  const row = kFilterRow({ dataView: 'Bookshelf logs (guides)', time: 'Last 15 minutes' });
  const q = row.geo.query;
  const docs = [['10:42:07.114', 'Served /api/search', 'INFO', '5b8aa5a2d2c872e8321cf37308d69df2'], ['10:42:07.113', 'Handled GET /api/search', 'INFO', '5b8aa5a2d2c872e8321cf37308d69df2']];
  fr.nodes[0].children.push(
    ...row.nodes,
    { block: 'field', x: q.x, y: q.y, w: q.w, value: 'trace_id : "5b8aa5a2d2c872e8321cf37308d69df2"', mono: true },
    lbl(16, 168, '2 documents', { weight: 600, box: 200 }),
    { block: 'table', x: 16, y: 190, w: 1048, columns: [{ title: '@timestamp', w: 2 }, { title: 'body.text', w: 4 }, { title: 'severity_text', w: 2 }, { title: 'trace_id', w: 5 }], rows: docs },
    ...marks([[row.geo.dataView, 9], [{ x: 16, y: 220, w: 1048, h: 30 }, 10], [q, 11]]),
  );
  figures.push({
    id: '07-discover-trace',
    alt: 'Discover of Kibana 9.5 with the data view Bookshelf logs (guides) marked by callout 9, the query bar holding trace_id with a trace id and marked by callout 11, and a table of two log documents with the columns @timestamp, body.text, severity_text and trace_id, the first row marked by callout 10',
    width: FW, height: 560, nodes: fr.nodes,
  });
}

// 08: the service map (step 12)
{
  const p = servicePage({
    h: 520, active: 'Service map',
    body: () => [
      box(16, 204, 1048, 296, { fill: 'surface', stroke: 'border', radius: 6 }),
      box(504, 306, 72, 72, { fill: 'navActiveBg', stroke: 'primary', radius: 36 }),
      lbl(540, 404, 'bookshelf', { weight: 500, anchor: 'middle', box: 160 }),
    ],
    children: (g) => mark(g.tabs['Service map'], 12),
  });
  figures.push({
    id: '08-service-map',
    alt: 'Service map tab of the bookshelf service in Kibana 9.5 with a single node named bookshelf in the middle of the map; the Service map tab is marked by callout 12',
    width: FW, height: 520, nodes: p.nodes,
  });
}

// 09: the empty Hosts page (step 13)
{
  const fr = kibanaFrame({ h: 440, crumbs: ['Infrastructure', 'Hosts'] });
  const msg = { x: 240, y: 150, w: 600, h: 230 };
  fr.nodes[0].children.push(
    box(msg.x, msg.y, msg.w, msg.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(540, 220, 'Detect and resolve problems with your hosts', { size: 'title', weight: 600, anchor: 'middle', box: 560 }),
    lbl(540, 252, 'Start collecting data for your hosts to understand metric trends,', { tone: 'textMuted', anchor: 'middle', box: 560 }),
    lbl(540, 274, 'explore logs and deep insight into their performance', { tone: 'textMuted', anchor: 'middle', box: 560 }),
    btn(480, 310, 120, 'Add data', 'primary'),
    ...mark(msg, 13),
  );
  figures.push({
    id: '09-hosts-empty',
    alt: 'Infrastructure Hosts page of Kibana 9.5 in the lab: it shows only the message Detect and resolve problems with your hosts and the button Add data, because the lab sends no host metrics; the message is marked by callout 13',
    width: FW, height: 440, nodes: fr.nodes,
  });
}

// 10: the finished tour (What you build)
{
  const fr = kibanaFrame({ h: 400, crumbs: ['Applications'] });
  const cards = [
    ['Service inventory', 'bookshelf, lab', '92 ms, 264.0 tpm'],
    ['Transactions', 'GET /api/search', 'latency, throughput, failures'],
    ['Trace waterfall', 'the bar of the request', 'duration of the request'],
    ['Discover', 'trace_id : "..."', 'the log records of the trace'],
  ];
  cards.forEach(([t, a, b], i) => {
    const cx = 16 + i * 262;
    fr.nodes[0].children.push(
      box(cx, 150, 244, 170, { fill: 'surface', stroke: 'border', radius: 6 }),
      box(cx, 150, 244, 6, { fill: `series.${i}`, radius: 3 }),
      lbl(cx + 16, 196, `${i + 1}`, { size: 'stat', weight: 600, tone: 'textMuted', box: 40 }),
      lbl(cx + 16, 238, t, { size: 'title', weight: 600, box: 212 }),
      lbl(cx + 16, 266, a, { tone: 'textMuted', box: 212 }),
      lbl(cx + 16, 288, b, { size: 'small', tone: 'textMuted', box: 212 }),
    );
    if (i < 3) fr.nodes[0].children.push(lbl(cx + 253, 240, '>', { size: 'title', weight: 600, anchor: 'middle', tone: 'textMuted', box: 20 }));
  });
  figures.push({
    id: '10-result',
    alt: 'Summary of the tour in four cards: the Service inventory with the bookshelf service, the Transactions of the service, the trace waterfall of GET /api/search and Discover filtered by the trace id',
    width: FW, height: 400, nodes: fr.nodes,
  });
}

export default { product: 'kibana', guide: 'k17', figures };
