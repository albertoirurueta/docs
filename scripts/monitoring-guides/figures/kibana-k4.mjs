// Figures of the Kibana guide K4, "Field statistics, patterns and ES|QL in Discover" (guide-discover-statistics-patterns-and-esql.adoc).
// Facts: guides-brief/kibana-facts.md section 4 (Kibana 9.5.6). Verified there: Discover is tabbed (session tab Untitled), the
// toolbar buttons Share, Query in ES|QL, More and Save, the filter row with the Data view picker, the left field sidebar,
// the results tabs Documents, Patterns and Field statistics (all three present with the trial licence), and Edit visualization.
// NOT VERIFIED there, drawn generically: the contents of the Field statistics and Patterns tabs, the ES|QL editor of Discover
// (query editor, run control, suggested chart), the Edit visualization flyout and its save action. A figure shows the
// screen the step starts from with the control to act on highlighted; callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, kibanaFrame, kDash } from '../lib/shells.mjs';
import { textWidth } from '../lib/text.mjs';

const figures = [];
const DV = 'Bookshelf logs (guides)';
const FIELDS = [['@timestamp', 'D'], ['attributes.status', '#'], ['attributes.uri', 't'], ['body.text', 't'], ['severity_text', 't']];
const Q = 'logs-generic.otel-default';

const wave = (base, amp, ph, n = 20) => Array.from({ length: n }, (_, i) => Math.round(base + amp * Math.sin(i * 0.7 + ph)));

// A results tab strip: returns nodes and the box of each tab.
function resultTabs(x, y, active) {
  const names = ['Documents', 'Patterns', 'Field statistics'];
  let cx = x;
  const geo = {};
  names.forEach((t, i) => { const w = Math.ceil(textWidth(t, 14, { weight: i === active ? 500 : 400 })) + 24; geo[t] = { x: cx, y, w, h: 32 }; cx += w; });
  return { nodes: [{ block: 'tabs', x, y, w: cx - x + 16, tabs: names, active }], geo };
}

// The Discover window in 9.5: second bar actions, the tab strip of the session, then the content built by `body`.
function discover({ h = 640, esql = false, body, children }) {
  const actions = [{ label: 'Share', w: 90, icon: 'share' }, ...(esql ? [] : [{ label: 'Query in ES|QL', w: 150 }]), { label: 'More', w: 80 }, { label: 'Save', w: 80 }];
  const fr = kibanaFrame({ h, crumbs: ['Discover'], actions });
  const geo = { ...fr.geo };
  const n = [];
  n.push(box(0, 96, FW, 36, { fill: 'surface', stroke: 'border' }));
  n.push(box(16, 100, 112, 28, { fill: 'navActiveBg', radius: 4 }), lbl(30, 119, 'Untitled', { size: 'small', weight: 500, box: 90 }));
  n.push({ block: 'icon', x: 140, y: 106, name: 'plus', tone: 'textMuted' });
  n.push(...body(geo));
  n.push(...(typeof children === 'function' ? children(geo) : children ?? []));
  fr.nodes[0].children.push(...n);
  return fr.nodes;
}

// Classic (KQL) mode: filter row, field sidebar, histogram, result tabs and a content area.
function classic({ tab = 0, content, h = 640 }) {
  return (geo) => {
    const n = [];
    n.push({ block: 'dropdown', x: 16, y: 144, w: 250, value: DV }); geo.dataView = { x: 16, y: 144, w: 250, h: 32 };
    n.push(btn(274, 144, 36, '+'));
    const qw = FW - 16 - 318 - 8 - 150 - 8 - 100;
    n.push({ block: 'field', x: 318, y: 144, w: qw, placeholder: 'Search and filter the discover page' });
    n.push(btn(318 + qw + 8, 144, 150, 'Last 1 hour', 'secondary', 'clock'), btn(318 + qw + 166, 144, 100, 'Refresh', 'secondary', 'refresh'));
    n.push({ block: 'field', x: 16, y: 196, w: 284, placeholder: 'Search field names' });
    n.push(lbl(20, 262, 'Available fields', { weight: 600, box: 284 }));
    FIELDS.forEach(([f, t], i) => {
      n.push(box(16, 274 + i * 32, 284, 30, { fill: 'surface', stroke: 'border', radius: 4 }));
      n.push(lbl(30, 294 + i * 32, t, { size: 'small', tone: 'textMuted', weight: 600 }), lbl(50, 294 + i * 32, f, { size: 'small', box: 240 }));
    });
    n.push(btn(316, 196, 130, 'Auto interval', 'secondary', 'chevronDown'), btn(454, 196, 150, 'No breakdown', 'secondary', 'chevronDown'));
    n.push({ block: 'bar', x: 316, y: 236, w: 748, h: 150, categories: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50'], series: [{ name: 'Count', values: [410, 440, 425, 450, 430, 445] }], max: 600, legend: false });
    const rt = resultTabs(316, 400, tab);
    Object.assign(geo, rt.geo);
    n.push(...rt.nodes);
    n.push(...content(geo));
    void h;
    return n;
  };
}

// ES|QL mode: a query editor under the tab strip and the result area under it.
function esqlBody({ lines, content, chart }) {
  return (geo) => {
    const n = [];
    n.push(lbl(20, 168, 'ES|QL', { weight: 600, box: 80 }));
    n.push(btn(FW - 16 - 100 - 8 - 150, 144, 150, 'Last 1 hour', 'secondary', 'clock'), btn(FW - 16 - 100, 144, 100, 'Refresh', 'secondary', 'refresh'));
    const eh = 26 + lines.length * 20;
    n.push({ block: 'queryEditor', x: 16, y: 188, w: FW - 32, h: eh, lines });
    geo.editor = { x: 16, y: 188, w: FW - 32, h: eh };
    let y = 188 + eh + 16;
    if (chart) { n.push(...chart(y, geo)); y += 214; }
    n.push(...content(y, geo));
    return n;
  };
}

const qline = (g, i) => ({ x: g.editor.x + 4, y: g.editor.y + 10 + i * 20, w: g.editor.w - 8, h: 20 });
const kw = (t) => ({ t, kind: 'keyword' });
const pl = (t) => ({ t });
const nm = (t) => ({ t, kind: 'number' });
const st = (t) => ({ t, kind: 'string' });
const line = (...runs) => runs;

// 01: Discover with the data view picker and the Field statistics tab (steps 2 and 3)
{
  figures.push({
    id: '01-discover', alt: 'Discover of Kibana 9.5 on the data view Bookshelf logs (guides) with the histogram and the result tabs Documents, Patterns and Field statistics; the Data view picker is marked by callout 2 and the Field statistics tab by callout 3', width: FW, height: 640,
    nodes: discover({
      body: classic({
        tab: 0,
        content: () => [
          { block: 'table', x: 316, y: 446, w: 748, columns: [{ title: 'timestamp', w: 1 }, { title: 'Summary', w: 3 }], rows: [['Nov 11, 10:58:41', 'attributes.status: 200 attributes.uri: /api/search'], ['Nov 11, 10:58:40', 'attributes.status: 200 attributes.uri: /api/books']], rowHeight: 30 },
        ],
      }),
      children: (g) => [...mark(g.dataView, 2), ...mark(g['Field statistics'], 3)],
    }),
  });
}

// 02: the Field statistics tab (steps 4 and 5)
{
  const bars = (x, y, vals) => vals.map((v, i) => box(x + i * 16, y + 22 - v, 12, v, { fill: 'series.0', radius: 1 }));
  figures.push({
    id: '02-field-statistics', alt: 'Discover with the Field statistics tab open: a table with one row for each field of the data view and the columns Documents and Distinct values; the row of attributes.status is marked by callout 4 and the Patterns tab by callout 5', width: FW, height: 700,
    nodes: discover({
      h: 700,
      body: classic({
        tab: 2,
        content: (g) => {
          const rows = [['@timestamp', '100%', '1,188'], ['attributes.status', '100%', '2'], ['attributes.uri', '100%', '4'], ['body.text', '100%', '4'], ['severity_text', '100%', '1']];
          const n = [{ block: 'table', x: 316, y: 446, w: 748, columns: [{ title: 'Field name', w: 3 }, { title: 'Documents (%)', w: 2 }, { title: 'Distinct values', w: 2 }, { title: 'Distributions', w: 3 }], rows, rowHeight: 34 }];
          const dist = [[30, 8, 14], [26, 20, 12], [12, 22, 20], [18, 16, 20], [24, 4, 4]];
          rows.forEach((_, i) => n.push(...bars(316 + 748 * 0.7 + 12, 446 + 34 * (i + 1) + 6, dist[i])));
          g.row = { x: 316, y: 446 + 34 * 2, w: 748, h: 34 };
          return n;
        },
      }),
      children: (g) => [...mark(g.row, 4), ...mark(g.Patterns, 5)],
    }),
  });
}

// 03: the Patterns tab (steps 6 and 7)
{
  figures.push({
    id: '03-patterns', alt: 'Discover with the Patterns tab open: a field selector showing body.text, marked by callout 6, and a table of message patterns with their counts; the control of the first pattern row that filters the documents is marked by callout 7', width: FW, height: 640,
    nodes: discover({
      body: classic({
        tab: 1,
        content: (g) => {
          const n = [];
          n.push({ block: 'dropdown', x: 316, y: 446, w: 250, label: 'Field', value: 'body.text' });
          g.field = { x: 316, y: 466, w: 250, h: 32 };
          n.push({ block: 'table', x: 316, y: 516, w: 748, columns: [{ title: 'Count', w: 1 }, { title: 'Pattern', w: 5 }, { title: 'Actions', w: 1 }], rows: [['612', 'Served *', ''], ['3', 'Error *', '']], rowHeight: 34 });
          n.push(btn(996, 556, 60, 'Filter', 'secondary')); g.act = { x: 996, y: 556, w: 60, h: 32 };
          return n;
        },
      }),
      children: (g) => [...mark(g.field, 6), ...mark(g.act, 7)],
    }),
  });
}

// 04: the Query in ES|QL button (step 8)
{
  figures.push({
    id: '04-query-in-esql', alt: 'Discover in its classic mode with the Documents tab; the button Query in ES|QL of the second bar is marked by callout 8', width: FW, height: 640,
    nodes: discover({
      body: classic({
        tab: 0,
        content: () => [{ block: 'table', x: 316, y: 446, w: 748, columns: [{ title: 'timestamp', w: 1 }, { title: 'Summary', w: 3 }], rows: [['Nov 11, 10:58:41', 'attributes.status: 200 attributes.uri: /api/search'], ['Nov 11, 10:58:40', 'attributes.status: 200 attributes.uri: /api/books']], rowHeight: 30 }],
      }),
      children: (g) => mark(g['Query in ES|QL'], 8),
    }),
  });
}

// result tables
const T_ALL = { columns: [{ title: '@timestamp', w: 2 }, { title: 'attributes.uri', w: 2 }, { title: 'attributes.status', w: 1 }, { title: 'body.text', w: 3 }, { title: 'severity_text', w: 1 }], rows: [['Nov 11, 10:58:41', '/api/search', '200', 'Served /api/search', 'INFO'], ['Nov 11, 10:58:40', '/api/books', '404', 'Served /api/books', 'INFO'], ['Nov 11, 10:58:39', '/api/search', '200', 'Served /api/search', 'INFO']] };
const T_KEEP = { columns: [{ title: '@timestamp', w: 2 }, { title: 'attributes.uri', w: 2 }, { title: 'attributes.status', w: 1 }, { title: 'body.text', w: 3 }], rows: [['Nov 11, 10:58:41', '/api/books', '404', 'Served /api/books'], ['Nov 11, 10:57:12', '/api/books', '404', 'Served /api/books'], ['Nov 11, 10:55:47', '/api/search', '404', 'Served /api/search']] };
const tbl = (T, rowHeight = 34) => (y) => [{ block: 'table', x: 16, y, w: FW - 32, ...T, rowHeight }];

// 05: FROM (steps 9 and 10)
{
  figures.push({
    id: '05-esql-from', alt: 'Discover in ES|QL mode: the query editor holds a single line, FROM logs-generic.otel-default, with a table of documents under it; the editor is marked by callout 9', width: FW, height: 560,
    nodes: discover({ h: 560, esql: true, body: esqlBody({ lines: [line(kw('FROM'), pl(` ${Q}`))], content: tbl(T_ALL) }), children: (g) => mark(g.editor, 9) }),
  });
}

// 06: WHERE (step 11)
{
  figures.push({
    id: '06-esql-where', alt: 'Discover in ES|QL mode with two query lines, FROM and WHERE attributes.status >= 400, typed on a new line; the new line is marked by callout 11', width: FW, height: 560,
    nodes: discover({
      h: 560, esql: true,
      body: esqlBody({ lines: [line(kw('FROM'), pl(` ${Q}`)), line(pl('| '), kw('WHERE'), pl(' attributes.status >= '), nm('400'))], content: tbl(T_KEEP) }),
      children: (g) => mark(qline(g, 1), 11),
    }),
  });
}

// 07: KEEP and SORT (steps 12 and 13)
{
  figures.push({
    id: '07-esql-keep-sort', alt: 'Discover in ES|QL mode with four query lines: FROM, WHERE, KEEP with four fields and SORT @timestamp DESC; the KEEP line is marked by callout 12 and the SORT line by callout 13', width: FW, height: 560,
    nodes: discover({
      h: 560, esql: true,
      body: esqlBody({
        lines: [line(kw('FROM'), pl(` ${Q}`)), line(pl('| '), kw('WHERE'), pl(' attributes.status >= '), nm('400')), line(pl('| '), kw('KEEP'), pl(' @timestamp, attributes.uri, attributes.status, body.text')), line(pl('| '), kw('SORT'), pl(' @timestamp '), kw('DESC'))],
        content: tbl(T_KEEP),
      }),
      children: (g) => [...mark(qline(g, 2), 12), ...mark(qline(g, 3), 13)],
    }),
  });
}

// 08: STATS BY (step 14)
{
  figures.push({
    id: '08-esql-stats', alt: 'Discover in ES|QL mode with the query FROM, then STATS requests = COUNT(*) BY attributes.status; the STATS line is marked by callout 14 and the table under it has one row for each status with the column requests', width: FW, height: 460,
    nodes: discover({
      h: 460, esql: true,
      body: esqlBody({
        lines: [line(kw('FROM'), pl(` ${Q}`)), line(pl('| '), kw('STATS'), pl(' requests = '), kw('COUNT'), pl('(*) '), kw('BY'), pl(' attributes.status'))],
        content: tbl({ columns: [{ title: 'requests', w: 1 }, { title: 'attributes.status', w: 1 }], rows: [['412', '200'], ['38', '404']] }),
      }),
      children: (g) => mark(qline(g, 1), 14),
    }),
  });
}

// 09: EVAL (step 15)
{
  figures.push({
    id: '09-esql-eval', alt: 'Discover in ES|QL mode with a four line query: FROM, STATS with a total and the errors for each attributes.uri, EVAL error_pct = ROUND and SORT; the EVAL line is marked by callout 15 and the table has the column error_pct', width: FW, height: 500,
    nodes: discover({
      h: 500, esql: true,
      body: esqlBody({
        lines: [
          line(kw('FROM'), pl(` ${Q}`)),
          line(pl('| '), kw('STATS'), pl(' total = '), kw('COUNT'), pl('(*), errors = '), kw('COUNT'), pl('(*) '), kw('WHERE'), pl(' attributes.status >= '), nm('400'), pl(' '), kw('BY'), pl(' attributes.uri')),
          line(pl('| '), kw('EVAL'), pl(' error_pct = '), kw('ROUND'), pl('('), nm('100.0'), pl(' * errors / total, '), nm('1'), pl(')')),
          line(pl('| '), kw('SORT'), pl(' error_pct '), kw('DESC')),
        ],
        content: tbl({ columns: [{ title: 'attributes.uri', w: 2 }, { title: 'total', w: 1 }, { title: 'errors', w: 1 }, { title: 'error_pct', w: 1 }], rows: [['/api/books', '118', '26', '22'], ['/api/search', '301', '12', '4']] }, 30),
      }),
      children: (g) => mark(qline(g, 2), 15),
    }),
  });
}

// 10: the suggested chart (steps 16 and 17)
{
  const pts = wave(430, 25, 0, 16);
  figures.push({
    id: '10-suggested-chart', alt: 'Discover in ES|QL mode with the query FROM, then STATS requests = COUNT(*) BY minute = BUCKET(@timestamp, 1 minute), marked by callout 16; above the table Discover draws a line chart of requests per minute, with the Edit visualization button marked by callout 17', width: FW, height: 700,
    nodes: discover({
      h: 700, esql: true,
      body: esqlBody({
        lines: [line(kw('FROM'), pl(` ${Q}`)), line(pl('| '), kw('STATS'), pl(' requests = '), kw('COUNT'), pl('(*) '), kw('BY'), pl(' minute = '), kw('BUCKET'), pl('(@timestamp, '), nm('1'), pl(' minute)'))],
        chart: (y, g) => {
          g.edit = { x: FW - 16 - 160, y: y + 4, w: 160, h: 32 };
          return [btn(g.edit.x, g.edit.y, 160, 'Edit visualization', 'secondary', 'edit'), { block: 'line', x: 16, y: y + 36, w: FW - 32, h: 170, series: [{ name: 'requests', points: pts }], min: 0, max: 600, yLabels: ['0', '150', '300', '450', '600'], xLabels: ['10:00', '10:15', '10:30', '10:45', '11:00'], legend: false }];
        },
        content: tbl({ columns: [{ title: 'requests', w: 1 }, { title: 'minute', w: 3 }], rows: [['431', 'Nov 11, 10:58'], ['419', 'Nov 11, 10:57']] }, 30),
      }),
      children: (g) => [...mark(qline(g, 1), 16), ...mark(g.edit, 17)],
    }),
  });
}

// 11: the visualization flyout and its save action (steps 18 and 19)
{
  const pts = wave(430, 25, 0, 16);
  const fx = 560, fy = 96, fw = 520, fh = 584;
  const save = { x: fx + fw - 16 - 90, y: fy + fh - 48, w: 90, h: 32 };
  const title = { x: fx + 16, y: fy + 100, w: fw - 32, h: 32 };
  figures.push({
    id: '11-save-to-dashboard', alt: 'Discover with the Edit visualization flyout open at the right: the chart of requests per minute, a title control typed Requests per minute (guides), marked by callout 18, and the Save button of the flyout, marked by callout 19', width: FW, height: 700,
    nodes: discover({
      h: 700, esql: true,
      body: esqlBody({
        lines: [line(kw('FROM'), pl(` ${Q}`)), line(pl('| '), kw('STATS'), pl(' requests = '), kw('COUNT'), pl('(*) '), kw('BY'), pl(' minute = '), kw('BUCKET'), pl('(@timestamp, '), nm('1'), pl(' minute)'))],
        chart: (y) => [{ block: 'line', x: 16, y: y + 36, w: 520, h: 170, series: [{ name: 'requests', points: pts }], min: 0, max: 600, yLabels: ['0', '300', '600'], xLabels: ['10:00', '10:30', '11:00'], legend: false }],
        content: () => [],
      }),
      children: () => [
        { block: 'flyout', x: fx, y: fy, w: fw, h: fh, title: 'Edit visualization' },
        { block: 'field', x: fx + 16, y: fy + 80, w: fw - 32, label: 'Title', value: 'Requests per minute (guides)' },
        { block: 'line', x: fx + 16, y: fy + 160, w: fw - 32, h: 300, series: [{ name: 'requests', points: pts }], min: 0, max: 600, yLabels: ['0', '150', '300', '450', '600'], xLabels: ['10:00', '10:30', '11:00'], legend: false },
        btn(fx + fw - 16 - 90 - 8 - 90, save.y, 90, 'Cancel'), btn(save.x, save.y, 90, 'Save', 'primary'),
        ...marks([[title, 18], [save, 19]]),
      ],
    }),
  });
}

// 12: the finished dashboard (What you build)
{
  const fr = kibanaFrame({ h: 520, crumbs: ['Dashboards', 'Discover ES|QL (guides)'], actions: [{ label: 'Share', w: 90, icon: 'share' }, { label: 'Export', w: 90 }, { label: 'More', w: 80 }, { label: 'Edit', kind: 'primary', w: 70 }] });
  fr.nodes[0].children.push(
    { block: 'field', x: 16, y: 104, w: 560, placeholder: 'Filter your data using KQL syntax' },
    btn(584, 104, 150, 'Last 1 hour', 'secondary', 'clock'), btn(742, 104, 100, 'Refresh', 'secondary', 'refresh'),
    { block: 'panel', x: 16, y: 152, w: 700, h: 340, title: 'Requests per minute (guides)' },
    { block: 'line', x: 24, y: 188, w: 684, h: 296, series: [{ name: 'requests', points: wave(430, 25, 0, 24) }], min: 0, max: 600, yLabels: ['0', '150', '300', '450', '600'], xLabels: ['10:00', '10:15', '10:30', '10:45', '11:00'], legend: false },
  );
  figures.push({ id: '12-result', alt: 'Kibana dashboard Discover ES|QL (guides) in view mode with one panel, the line chart of requests per minute made from the ES|QL query in Discover', width: FW, height: 520, nodes: fr.nodes });
}

void kDash;
export default { product: 'kibana', guide: 'k4', figures };
