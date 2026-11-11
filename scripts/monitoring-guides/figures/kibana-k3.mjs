// Figures of the Kibana guide K3, "Explore logs in Discover" (guide-explore-logs-in-discover.adoc).
// Facts: guides-brief/kibana-facts.md section 4 (Discover 9.5 is tabbed; filter row, field list, histogram controls, result
// tabs, table toolbar, top actions) and section 0 (fields of the Bookshelf logs). NOT VERIFIED there (drawn generically, no
// label invented): the document flyout (only its expand button is named; the flyout title Document and the field/value
// rows are generic), the link to the surrounding documents (a grey bar), the menu of a filter pill (grey bars), the Add
// filter dialog (never drawn), the popover that shows the top values of a field (values and shares only, no heading), the
// breakdown field list, the Save dialog (Title field, unlabelled confirm button). Pill texts follow the product convention
// (field: value, NOT field: value). A figure shows the screen the step starts from; callout numbers are step numbers.
import { textWidth } from '../lib/text.mjs';
import { FW, lbl, box, btn, ico, mark, marks, menu, kibanaFrame } from '../lib/shells.mjs';

const figures = [];
const bar = (x, y, w) => box(x, y, w, 10, { fill: 'surfaceRaised', radius: 4 });
const alert = ['severity_text : "ERROR"'];

// Bars of the histogram: hits over time, optionally stacked by severity_text.
const CATS = ['10:01', '10:02', '10:03', '10:04', '10:05', '10:06', '10:07', '10:08'];
const INFO = [70, 82, 76, 90, 64, 58, 72, 80];
const ERR = [3, 4, 2, 5, 38, 52, 46, 6];

// The Discover screen. Returns { nodes, g } with the geometry of the controls. `dy` shifts the content under the pills row.
function discover({ h = 640, dataView = 'Bookshelf logs (guides)', dvOpen = false, query, time = 'Last 15 minutes', hits = 412, pills = [], stacked = false, breakdown = 'No breakdown',
  zoom = false, rowSet = 'all', cols = false, tabs = ['Untitled'], activeTab = 0, popover, rowOpen = false, flyout = false, saveDialog = false, title = 'Untitled', saved = false, extra = () => [] }) {
  const dy = pills.length ? 40 : 0;
  const fr = kibanaFrame({ h: h + dy, crumbs: saved ? ['Discover', title] : ['Discover'], actions: [{ label: 'Share', w: 90 }, { label: 'Query in ES|QL', w: 150 }, { label: 'More', w: 80 }, { label: 'Save', w: 80 }] });
  const g = { ...fr.geo };
  const n = [];
  // session tabs
  let tx = 16;
  tabs.forEach((t, i) => {
    const tw = Math.max(150, Math.ceil(textWidth(t, 14, { weight: 500 })) + 40);
    n.push(box(tx, 104, tw, 32, { fill: i === activeTab ? 'surface' : 'surfaceRaised', stroke: 'border', radius: 4 }), lbl(tx + 14, 125, t, { box: tw - 24, weight: i === activeTab ? 500 : 400 }));
    g['tab' + i] = { x: tx, y: 104, w: tw, h: 32 };
    tx += tw + 10;
  });
  g.newTab = { x: tx, y: 104, w: 36, h: 32 };
  n.push(btn(tx, 104, 36, '+'));
  // filter row
  n.push({ block: 'dropdown', x: 16, y: 152, w: 220, value: dataView });
  g.dataView = { x: 16, y: 152, w: 220, h: 32 };
  n.push(btn(244, 152, 36, '+'));
  g.addFilter = { x: 244, y: 152, w: 36, h: 32 };
  const qx = 288, qw = 510;
  n.push({ block: 'field', x: qx, y: 152, w: qw, ...(query ? { value: query } : { placeholder: 'Search and filter the discover page' }) });
  g.query = { x: qx, y: 152, w: qw, h: 32 };
  n.push(btn(qx + qw + 8, 152, 150, time, 'secondary', 'clock'));
  g.time = { x: qx + qw + 8, y: 152, w: 150, h: 32 };
  n.push(btn(qx + qw + 166, 152, 100, 'Refresh', 'secondary', 'refresh'));
  // pills
  pills.forEach((p, i) => {
    const w = 250;
    const x = 16 + i * (w + 8);
    n.push(box(x, 192, w, 28, { fill: 'chipBg', stroke: p.pinned ? 'primary' : 'border', radius: 14 }), lbl(x + 12, 211, p.text, { size: 'small', box: w - 24, tone: p.off ? 'textFaint' : 'chipText' }));
    g['pill' + i] = { x, y: 192, w, h: 28 };
  });
  // field list
  const Y = (v) => v + dy;
  n.push(box(16, Y(200), 284, 400, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push({ block: 'field', x: 28, y: Y(212), w: 260, placeholder: 'Search field names' });
  n.push(lbl(32, Y(276), 'Available fields', { weight: 600, box: 240 }));
  const fields = ['@timestamp', 'attributes.status', 'attributes.uri', 'body.text', 'severity_text', 'trace_id'];
  g.field = {};
  fields.forEach((f, i) => {
    const fy = Y(292 + i * 32);
    n.push(lbl(44, fy + 20, f, { size: 'small', tone: 'text', box: 200 }));
    g.field[f] = { x: 28, y: fy, w: 260, h: 28 };
    g['add' + f] = { x: 262, y: fy + 2, w: 24, h: 24 };
    if (cols === true && ['severity_text', 'attributes.status', 'attributes.uri'].includes(f)) n.push(ico(266, fy + 6, 'check', 'primary'));
    else if (cols === 'hover') n.push(ico(266, fy + 6, 'plus', 'textMuted'));
  });
  // histogram
  n.push(btn(316, Y(200), 130, 'Auto interval', 'secondary', 'chevronDown'));
  n.push(btn(454, Y(200), 150, breakdown, 'secondary', 'chevronDown'));
  g.noBreakdown = { x: 454, y: Y(200), w: 150, h: 32 };
  g.histo = { x: 316, y: Y(240), w: 748, h: 150 };
  const barSeries = rowSet === 'error' || rowSet === 'errorNoSearch'
    ? [{ name: 'ERROR', values: ERR, color: 'series.6' }]
    : rowSet === 'books' ? [{ name: 'Count', values: INFO.map((v) => Math.round(v / 3)) }]
      : stacked ? [{ name: 'INFO', values: INFO, color: 'series.0' }, { name: 'ERROR', values: ERR, color: 'series.6' }] : [{ name: 'Count', values: INFO.map((v, i) => v + ERR[i]) }];
  n.push({ block: 'bar', x: 316, y: Y(240), w: 748, h: 150, categories: CATS, legend: false, max: 150, stacked: stacked && barSeries.length > 1, series: barSeries });
  if (zoom) { g.zoom = { x: 616, y: Y(250), w: 190, h: 100 }; }
  // result tabs and table
  n.push({ block: 'tabs', x: 316, y: Y(398), w: 500, tabs: [`Documents (${hits})`, 'Patterns', 'Field statistics'], active: 0 });
  n.push(btn(316, Y(440), 130, 'Sort fields', 'secondary'), btn(454, Y(440), 160, 'Display options'), btn(622, Y(440), 150, 'Enter fullscreen'));
  const ts = ['Nov 11, 2026 @ 10:31:12.220', 'Nov 11, 2026 @ 10:31:11.874', 'Nov 11, 2026 @ 10:31:11.502'];
  const DATA = {
    all: [[ts[0], 'ERROR', '500', '/api/loans'], [ts[1], 'ERROR', '500', '/api/search'], [ts[2], 'INFO', '200', '/api/books']],
    error: [[ts[0], 'ERROR', '500', '/api/loans'], [ts[1], 'ERROR', '500', '/api/search'], [ts[2], 'ERROR', '500', '/api/books']],
    errorNoSearch: [[ts[0], 'ERROR', '500', '/api/loans'], [ts[1], 'ERROR', '500', '/api/books'], [ts[2], 'ERROR', '500', '/api/loans']],
    books: [[ts[0], 'INFO', '200', '/api/books'], [ts[1], 'INFO', '200', '/api/books/7'], [ts[2], 'INFO', '200', '/api/books']],
  }[rowSet];
  const rows = cols === true ? DATA : DATA.map((r) => [r[0], `severity_text ${r[1]}  attributes.status ${r[2]}  attributes.uri ${r[3]}`]);
  const columns = cols === true ? [{ title: 'timestamp', w: 3 }, { title: 'severity_text', w: 2 }, { title: 'attributes.status', w: 2 }, { title: 'attributes.uri', w: 3 }] : [{ title: 'timestamp', w: 3 }, { title: 'Summary', w: 8 }];
  n.push({ block: 'table', x: 344, y: Y(484), w: 720, columns, rows });
  rows.forEach((_, i) => n.push(ico(320, Y(484) + 30 * (i + 1) + 7, 'chevronRight', 'textMuted')));
  g.expand = { x: 316, y: Y(484) + 30, w: 26, h: 28 };
  // overlays
  if (dvOpen) {
    const dd = menu({ x: 16, y: 190, w: 270, items: ['Bookshelf logs (guides)', 'Kibana Sample Data Logs', 'Kibana Sample Data eCommerce', 'APM'], hot: 0 });
    n.push(...dd.nodes); g.dvRow = dd.rows[0];
  }
  if (popover === 'top') {
    const px = 308, py = Y(292 + 4 * 32) - 70;
    n.push(box(px, py, 300, 150, { fill: 'surface', stroke: 'borderStrong', radius: 6 }));
    [['INFO', 88], ['ERROR', 12]].forEach(([v, pc], i) => {
      n.push(lbl(px + 16, py + 40 + i * 44, v, { weight: 500, box: 90 }), lbl(px + 268, py + 40 + i * 44, `${pc}%`, { size: 'small', tone: 'textMuted', anchor: 'end', box: 40 }));
      n.push(box(px + 16, py + 50 + i * 44, 268, 8, { fill: 'surfaceRaised', radius: 4 }), box(px + 16, py + 50 + i * 44, 268 * pc / 100, 8, { fill: i ? 'series.6' : 'series.0', radius: 4 }));
    });
    g.popover = { x: px, y: py, w: 300, h: 150 };
  }
  if (popover === 'pill') {
    const px = g.pill0.x, py = g.pill0.y + 34;
    n.push(box(px, py, 220, 130, { fill: 'surface', stroke: 'borderStrong', radius: 6 }));
    g.pillMenu = [0, 1, 2, 3].map((i) => ({ x: px + 8, y: py + 10 + i * 28, w: 204, h: 22 }));
    g.pillMenu.forEach((r, i) => n.push(bar(r.x + 8, r.y + 6, [120, 110, 130, 80][i])));
  }
  if (popover === 'breakdown') {
    const dd = menu({ x: g.noBreakdown.x, y: g.noBreakdown.y + 36, w: 220, items: ['severity_text', 'attributes.status', 'attributes.uri'], hot: 0 });
    n.push(...dd.nodes); g.bdRow = dd.rows[0];
  }
  if (flyout) {
    n.push({ block: 'flyout', x: 600, y: 96, w: 464, h: h + dy - 96, title: 'Document' });
    const fr2 = [['@timestamp', 'Nov 11, 2026 @ 10:31:12.220'], ['severity_text', 'ERROR'], ['attributes.status', '500'], ['attributes.uri', '/api/loans'], ['body.text', 'Served /api/loans'], ['trace_id', '4bf92f3577b34da6a3ce929d0e0e4736']];
    n.push({ block: 'table', x: 616, y: 160, w: 432, columns: [{ title: 'Field', w: 2 }, { title: 'Value', w: 3 }], rows: fr2 });
    n.push(bar(616, 404, 190));
    g.around = { x: 616, y: 398, w: 200, h: 22 };
  }
  if (saveDialog) {
    const mx = 300, my = 190, mw = 480;
    n.push(box(mx, my, mw, 240, { fill: 'surface', stroke: 'borderStrong', radius: 8 }));
    n.push({ block: 'field', x: mx + 24, y: my + 56, w: mw - 48, label: 'Title', value: 'Bookshelf errors (guides)' });
    g.title = { x: mx + 24, y: my + 76, w: mw - 48, h: 32 };
    n.push(bar(mx + 24, my + 140, 300), bar(mx + 24, my + 162, 240));
    g.confirm = { x: mx + mw - 24 - 100, y: my + 190, w: 100, h: 32 };
    n.push(btn(mx + mw - 24 - 100 - 8 - 90, my + 190, 90, 'Cancel'), box(g.confirm.x, g.confirm.y, 100, 32, { fill: 'primary', radius: 4 }));
  }
  fr.nodes[0].children.push(...n, ...extra(g));
  return { nodes: fr.nodes, g, h: h + dy };
}
const fig = (id, alt, d) => figures.push({ id, alt, width: FW, height: d.h, nodes: d.nodes });

// ---- 01: data view picker (step 2) --------------------------------------------------------------------------------------
{
  const d = discover({ dataView: 'Kibana Sample Data Logs', dvOpen: true, hits: 4675, extra: (g) => mark(g.dvRow, 2) });
  fig('01-data-view-picker', 'Discover of Kibana 9.5 with the data view picker open under the filter row, listing Bookshelf logs (guides), Kibana Sample Data Logs, Kibana Sample Data eCommerce and APM; the entry Bookshelf logs (guides) is marked by callout 2', d);
}

// ---- 02: histogram zoom (steps 3 and 4) ---------------------------------------------------------------------------------------
{
  const d = discover({ zoom: true, extra: (g) => [...mark(g.time, 3), ...mark(g.zoom, 4)] });
  fig('02-histogram-zoom', 'Discover with the data view Bookshelf logs (guides): callout 3 marks the time picker Last 15 minutes and callout 4 marks a dragged selection across the bars of the histogram that zooms the time range in', d);
}

// ---- 03: field:value (step 5) -----------------------------------------------------------------------------------------------
{
  const d = discover({ query: 'severity_text : "ERROR"', hits: 214, rowSet: 'error', extra: (g) => mark(g.query, 5) });
  fig('03-kql-field-value', 'Discover with the query severity_text : "ERROR" typed into the query box, marked by callout 5; the histogram and the Documents tab count only the error log records', d);
}

// ---- 04: and, range (step 6) --------------------------------------------------------------------------------------------------
{
  const d = discover({ query: 'severity_text : "ERROR" and attributes.status >= 500', hits: 168, rowSet: 'error', extra: (g) => mark(g.query, 6) });
  fig('04-kql-and-range', 'Discover with the query severity_text : "ERROR" and attributes.status >= 500 in the query box, marked by callout 6, joining two conditions with and and a range', d);
}

// ---- 05: wildcard (step 8) -------------------------------------------------------------------------------------------------------
{
  const d = discover({ query: 'attributes.uri : /api/b*', hits: 96, rowSet: 'books', extra: (g) => mark(g.query, 8) });
  fig('05-kql-wildcard', 'Discover with the query attributes.uri : /api/b* in the query box, marked by callout 8; the star stands for any characters, so the documents of /api/books and /api/books/ followed by an id match', d);
}

// ---- 06: filter pills (steps 10 to 13) ------------------------------------------------------------------------------------------------
{
  const d = discover({
    pills: [{ text: 'severity_text: ERROR', pinned: true }, { text: 'NOT attributes.uri: /api/search', off: false }], popover: 'pill', hits: 140, rowSet: 'errorNoSearch',
    extra: (g) => marks([[g.addFilter, 10], [g.pill0, 11], [g.pill1, 12], [g.pillMenu[3], 13]]),
  });
  fig('06-filter-pills', 'Discover with two filter pills under the filter row, severity_text: ERROR pinned and NOT attributes.uri: /api/search excluded, and the menu of the first pill open; callout 10 marks the Add filter button, callout 11 the first pill, callout 12 the second pill and callout 13 the menu action that disables a pill', d);
}

// ---- 07: top values (step 14) ----------------------------------------------------------------------------------------------------------
{
  const d = discover({ popover: 'top', extra: (g) => [...mark(g.field.severity_text, 14)] });
  fig('07-top-values', 'Discover with the field severity_text clicked in the field list (callout 14) and a popover next to it showing its most frequent values INFO and ERROR with their share of the sampled documents', d);
}

// ---- 08: columns (steps 15 to 17) -------------------------------------------------------------------------------------------------------
{
  const d = discover({ cols: 'hover', extra: (g) => marks([[g['addseverity_text'], 15], [g['addattributes.status'], 16], [g['addattributes.uri'], 17]]) });
  fig('08-columns', 'Discover with the Add field as column buttons of the field list: severity_text (callout 15), attributes.status (callout 16) and attributes.uri (callout 17); the table still has the timestamp and Summary columns', d);
}

// ---- 09: document flyout (steps 18 and 19) -------------------------------------------------------------------------------------------------
{
  const d = discover({ cols: true, flyout: true, extra: (g) => marks([[g.expand, 18], [g.around, 19]]) });
  fig('09-document-flyout', 'Discover with the table columns timestamp, severity_text, attributes.status and attributes.uri and the details flyout of the first document open; callout 18 marks the expand button of the row and callout 19 marks the entry that opens the surrounding documents', d);
}

// ---- 10: breakdown (steps 20 and 21) -----------------------------------------------------------------------------------------------------------
{
  const d = discover({ cols: true, popover: 'breakdown', extra: (g) => marks([[g.noBreakdown, 20], [g.bdRow, 21]]) });
  fig('10-chart-breakdown', 'Discover with the No breakdown button of the histogram clicked (callout 20) and a list of fields open under it; the field severity_text is marked by callout 21', d);
}

// ---- 11: session tabs (steps 22 and 23) ------------------------------------------------------------------------------------------------------------
{
  const d = discover({ cols: true, stacked: true, breakdown: 'severity_text', tabs: ['Untitled', 'Untitled'], activeTab: 1, extra: (g) => marks([[g.newTab, 22], [g.tab0, 23]]) });
  fig('11-session-tabs', 'Discover with two session tabs named Untitled; the second one is active; callout 22 marks the New tab button next to the tabs and callout 23 marks the first tab, to which the guide returns', d);
}

// ---- 12: save the session (steps 24 to 26) -------------------------------------------------------------------------------------------------------------
{
  const d = discover({ cols: true, stacked: true, breakdown: 'severity_text', query: 'severity_text : "ERROR"', saveDialog: true, hits: 214, rowSet: 'error', extra: (g) => marks([[g.Save, 24], [g.title, 25], [g.confirm, 26]]) });
  fig('12-save-session', 'Discover with the save dialog open: the Save button of the top actions (callout 24), the Title field holding Bookshelf errors (guides) (callout 25) and the primary button that confirms the dialog (callout 26)', d);
}

// ---- 13: result (What you build) ------------------------------------------------------------------------------------------------------------------------
{
  const d = discover({ cols: true, stacked: true, breakdown: 'severity_text', query: 'severity_text : "ERROR"', hits: 214, rowSet: 'error', saved: true, title: 'Bookshelf errors (guides)', tabs: ['Bookshelf errors (guides)'] });
  fig('13-result', 'Result: Discover with the saved session Bookshelf errors (guides), the query severity_text : "ERROR", the histogram broken down by severity_text and the table columns severity_text, attributes.status and attributes.uri', d);
}

void alert; void ico;
export default { product: 'kibana', guide: 'k3', figures };
