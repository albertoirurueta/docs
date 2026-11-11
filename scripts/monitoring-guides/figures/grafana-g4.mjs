// Figures of the Grafana guide G4, "Explore logs and traces" (guide-explore-logs-and-traces.adoc).
// Facts: guides-brief/grafana-facts.md sections 4 and 5 (Explore toolbar, Drilldown > Logs, Loki and Tempo data).
// NOT VERIFIED in the lab and therefore drawn generically: the Loki query editor layout (it is drawn like the verified
// Prometheus one), the Live button, the Tempo query editor and its TraceQL query type, the trace view and the result
// list. A figure shows the screen the step starts from; callout numbers are the step numbers of the page. Colours are
// theme tokens only.
import { FW, lbl, box, btn, ico, rule, mark, marks, menu, segmented, grafanaFrame, G_NAV_W } from '../lib/shells.mjs';

// Rows of the docked navigation (row i of the nav list sits at y = 48 + 34 * i).
const navRow = (i) => ({ x: 8, y: 48 + 34 * i, w: G_NAV_W - 16, h: 32 });
const NAV = { Explore: navRow(3), Drilldown: navRow(4) };

const STREAM = [{ t: '{' }, { t: 'application', kind: 'label' }, { t: '=' }, { t: '"bookshelf"', kind: 'string' }, { t: '}' }];
const FILTER = [...STREAM, { t: ' |= ' }, { t: '"/api/search"', kind: 'string' }];
const JSONQ = [...STREAM, { t: ' | ' }, { t: 'json', kind: 'keyword' }, { t: ' | status >= ' }, { t: '400', kind: 'number' }];
const METRIC = [
  { t: 'sum', kind: 'keyword' }, { t: ' by (status) (' }, { t: 'count_over_time', kind: 'keyword' }, { t: '(' }, ...STREAM,
  { t: ' | ' }, { t: 'json', kind: 'keyword' }, { t: ' [' }, { t: '1m', kind: 'number' }, { t: ']))' },
];
const TRACEQL = [
  { t: '{ ' }, { t: 'resource.service.name', kind: 'label' }, { t: ' = ' }, { t: '"bookshelf"', kind: 'string' }, { t: ' && status = ' },
  { t: 'error', kind: 'keyword' }, { t: ' }' },
];

// The Explore page: top bar, optional docked navigation, toolbar row (data source, Split, Add, time, Live, Run query).
function explore({ h = 560, nav = false, ds = 'Loki', dsOpen = false, live = false, children = [], over = [] }) {
  const x0 = (nav ? G_NAV_W : 0) + 16;
  const geo = {};
  const n = [];
  const options = ['Loki', 'Prometheus', 'Tempo', 'TestData'];
  geo.ds = { x: x0, y: 58, w: 200, h: 32 };
  geo.option = {};
  options.forEach((o, i) => { geo.option[o] = { x: x0 + 4, y: 58 + 40 + i * 30, w: 192, h: 28 }; });
  let rx = FW - 16;
  const put = (key, w, label, kind, icon) => { rx -= w; n.push(btn(rx, 58, w, label, kind, icon)); geo[key] = { x: rx, y: 58, w, h: 32 }; rx -= 8; };
  put('run', 120, 'Run query', 'primary');
  if (live) put('live', 76, 'Live');
  put('time', 150, 'Last 1 hour', 'secondary', 'clock');
  put('add', 76, 'Add');
  put('split', 84, 'Split');
  n.push(...(typeof children === 'function' ? children(geo, x0) : children));
  // drawn last so that an open list covers the cards below it
  n.push({ block: 'dropdown', x: x0, y: 58, w: 200, value: ds, open: dsOpen, options, selected: options.indexOf(ds) });
  n.push(...(typeof over === 'function' ? over(geo, x0) : over));
  return { nodes: grafanaFrame({ h, crumbs: ['Explore'], nav, navActive: 'Explore', children: n }), geo, x0 };
}

// A query card (row A) of Explore. `mode` builder | code; `lines` the editor lines of the code mode.
function card({ x, y, w, name = 'Loki', mode = 'code', lines, lineCount = 1 }) {
  const geo = {};
  const n = [];
  const ch = mode === 'code' ? 56 + lineCount * 22 + 40 : 120;
  n.push(box(x, y, w, ch, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(lbl(x + 12, y + 26, `A (${name})`, { weight: 500, box: 200 }));
  const seg = segmented({ x: x + w - 12 - 144, y: y + 8, items: ['Builder', 'Code'], active: mode === 'code' ? 1 : 0 });
  n.push(...seg.nodes);
  geo.builder = seg.boxes[0]; geo.code = seg.boxes[1];
  if (mode === 'code') {
    geo.editor = { x: x + 12, y: y + 48, w: w - 24, h: 16 + lineCount * 22 };
    n.push({ block: 'queryEditor', x: geo.editor.x, y: geo.editor.y, w: geo.editor.w, h: geo.editor.h, lines: lines ?? [[{ t: 'Enter a query...' }]], lineNumbers: !!lines });
  } else {
    n.push(box(x + 12, y + 52, w - 24, 52, { fill: 'canvas', stroke: 'borderStrong', radius: 6, dash: '5 3' }));
  }
  geo.box = { x, y, w, h: ch };
  return { nodes: n, geo, h: ch };
}

const bars = (x, y, w, h) => ({
  block: 'bar', x, y, w, h, legend: false, categories: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50'],
  series: [{ name: 'Logs', values: [9, 11, 10, 12, 9, 11] }], max: 14,
});

// One log line row: time, text; `hot` draws it selected.
function logRow(x, y, w, time, str, { hot = false, level = 'INFO' } = {}) {
  const n = [];
  if (hot) n.push(box(x, y, w, 26, { fill: 'navActiveBg', radius: 4 }));
  n.push(box(x + 8, y + 7, 4, 12, { fill: level === 'ERROR' ? 'threshold.red' : 'threshold.green', radius: 1 }));
  n.push(lbl(x + 22, y + 18, time, { size: 'small', tone: 'textMuted', box: 96 }));
  n.push(lbl(x + 126, y + 18, str, { size: 'small', box: w - 140 }));
  return n;
}
const line = (uri, status, extra = '') => `{"level":"INFO","logger":"...","message":"...","application":"bookshelf","uri":"${uri}","status":${status}${extra},...}`;

// The log result of a stream query: volume bars, then rows. `open` expands the row `openAt`.
function logResult({ x, y, w, rows, hot = -1, open = false, trace = false }) {
  const n = [];
  const geo = {};
  n.push(lbl(x + 4, y + 16, 'Logs volume', { weight: 500, box: 200 }));
  n.push(bars(x, y + 22, w, 110));
  let ry = y + 150;
  n.push(lbl(x + 4, ry - 6, 'Logs', { weight: 500, box: 200 }));
  rows.forEach((r, i) => {
    n.push(...logRow(x, ry, w, r[0], r[1], { hot: i === hot, level: r[2] }));
    geo[`row${i}`] = { x, y: ry, w, h: 26 };
    ry += 28;
    if (open && i === hot) {
      n.push(box(x + 14, ry, w - 28, 158, { fill: 'inputBg', stroke: 'border', radius: 4 }));
      const fields = [['level', 'INFO'], ['uri', '/api/books'], ['status', '200'], ['trace_id', '4bf92f3577b34da6a3ce929d0e0e4736'], ['span_id', '00f067aa0ba902b7']];
      fields.forEach(([k, v], j) => {
        const fy = ry + 22 + j * 28;
        n.push(lbl(x + 30, fy, k, { size: 'small', tone: 'textMuted', mono: true, box: 120 }));
        n.push(lbl(x + 160, fy, v, { size: 'small', mono: true, box: 360 }));
        if (k === 'trace_id' && trace) {
          n.push(btn(x + 560, fy - 18, 76, 'Trace', 'secondary', 'explore'));
          geo.traceBtn = { x: x + 560, y: fy - 18, w: 76, h: 32 };
        }
      });
      ry += 164;
    }
  });
  return { nodes: n, geo };
}

const ROWS = [
  ['10:51:08.412', line('/api/books', 200)],
  ['10:51:08.377', line('/api/search', 200)],
  ['10:51:08.201', line('/api/books/{id}', 404)],
  ['10:51:07.986', line('/api/loans', 200)],
];

const figures = [];
const W = FW - 32;

// 01: Explore, data source picker open (steps 1 and 2)
{
  const ex = explore({
    h: 340, nav: true, ds: 'Prometheus', dsOpen: true,
    children: (g, x0) => [
      ...card({ x: x0, y: 106, w: FW - x0 - 16, name: 'Prometheus', mode: 'builder' }).nodes,
    ],
    over: (g) => marks([[NAV.Explore, 1], [g.option.Loki, 2]]),
  });
  figures.push({
    id: '01-explore-loki-picker',
    alt: 'Explore page of Grafana 13.3 with the data source picker open: callout 1 marks the Explore item of the navigation and callout 2 marks Loki in the list of data sources, which are Loki, Prometheus, Tempo and TestData',
    width: FW, height: 340, nodes: ex.nodes,
  });
}

// 02: Explore with Loki, empty query, Code (step 3)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'builder' });
  const ex = explore({ h: 300, ds: 'Loki', children: [...c.nodes, ...mark(c.geo.code, 3)] });
  figures.push({
    id: '02-code-mode',
    alt: 'Explore with the Loki data source selected and an empty query A in Builder mode: callout 3 marks the Code option of the Builder and Code switch',
    width: FW, height: 300, nodes: ex.nodes,
  });
}

// 03: stream selector typed, Run query (steps 4 and 5)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [STREAM] });
  const ex = explore({ h: 300, ds: 'Loki', children: (g) => [...c.nodes, ...marks([[c.geo.editor, 4], [g.run, 5]])] });
  figures.push({
    id: '03-stream-query',
    alt: 'Explore with Loki in Code mode: the stream selector with the label application equal to bookshelf is typed into the editor, marked by callout 4, and the Run query button of the toolbar is marked by callout 5',
    width: FW, height: 300, nodes: ex.nodes,
  });
}

// 04: the log lines; click one (step 6)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [STREAM] });
  const res = logResult({ x: 16, y: 106 + c.h + 12, w: W, rows: ROWS, hot: 1 });
  const ex = explore({ h: 560, ds: 'Loki', children: [...c.nodes, ...res.nodes, ...mark(res.geo.row1, 6)] });
  figures.push({
    id: '04-log-lines',
    alt: 'Explore after Run query: a logs volume chart above a list of log lines from the Bookshelf service, each line a JSON text with level, uri and status; callout 6 marks the log line to click',
    width: FW, height: 560, nodes: ex.nodes,
  });
}

// 05: line filter (steps 7 and 8)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [FILTER] });
  const ex = explore({ h: 300, ds: 'Loki', children: (g) => [...c.nodes, ...marks([[c.geo.editor, 7], [g.run, 8]])] });
  figures.push({
    id: '05-line-filter',
    alt: 'Explore with Loki in Code mode: the query with the line filter for the text /api/search is typed into the editor, marked by callout 7, and the Run query button is marked by callout 8',
    width: FW, height: 300, nodes: ex.nodes,
  });
}

// 06: json parser and label filter (steps 9 and 10)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [JSONQ] });
  const ex = explore({ h: 300, ds: 'Loki', children: (g) => [...c.nodes, ...marks([[c.geo.editor, 9], [g.run, 10]])] });
  figures.push({
    id: '06-json-filter',
    alt: 'Explore with Loki in Code mode: the query that parses the JSON body and keeps the lines with a status of 400 or more is typed into the editor, marked by callout 9, and the Run query button is marked by callout 10',
    width: FW, height: 300, nodes: ex.nodes,
  });
}

// 07: Live (step 11)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [JSONQ] });
  const res = logResult({ x: 16, y: 106 + c.h + 12, w: W, rows: [['10:51:08.201', line('/api/books/{id}', 404)], ['10:51:03.118', line('/api/books/{id}', 404)]] });
  const ex = explore({ h: 560, ds: 'Loki', live: true, children: (g) => [...c.nodes, ...res.nodes, ...mark(g.live, 11)] });
  figures.push({
    id: '07-live',
    alt: 'Explore with the status filter query already run and the Live button of the toolbar, between the time range and Run query, marked by callout 11',
    width: FW, height: 560, nodes: ex.nodes,
  });
}

// 08: metric query typed (steps 14 and 15)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [METRIC] });
  const ex = explore({ h: 300, ds: 'Loki', children: (g) => [...c.nodes, ...marks([[c.geo.editor, 14], [g.run, 15]])] });
  figures.push({
    id: '08-metric-query',
    alt: 'Explore with Loki in Code mode: a metric query that counts the log lines per status over one minute is typed into the editor, marked by callout 14, and the Run query button is marked by callout 15',
    width: FW, height: 300, nodes: ex.nodes,
  });
}

// 09: the metric result, display switch (step 16)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [METRIC] });
  const gy = 106 + c.h + 14;
  const sw = segmented({ x: 16 + W - 5 * 100, y: gy, items: ['Lines', 'Bars', 'Points', 'Stacked lines', 'Stacked bars'], w: 100, active: 0 });
  const ex = explore({
    h: 570, ds: 'Loki',
    children: [
      ...c.nodes,
      lbl(20, gy + 20, 'Graph', { weight: 500, box: 200 }),
      ...sw.nodes,
      { block: 'line', x: 16, y: gy + 44, w: W, h: 270, min: 0, max: 600, yLabels: ['0', '150', '300', '450', '600'], xLabels: ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50'],
        series: [{ name: '200', points: [492, 516, 486, 534, 504, 528, 498, 522, 510, 504, 534, 492, 516] }, { name: '404', points: [66, 84, 60, 78, 72, 90, 66, 78, 72, 84, 60, 78, 72] }] },
      ...mark(sw.boxes[1], 16),
    ],
  });
  figures.push({
    id: '09-metric-graph',
    alt: 'Explore after the metric query ran: a Graph panel draws one line for the status 200 and one for 404, and callout 16 marks the Bars option of the display switch Lines, Bars, Points, Stacked lines and Stacked bars',
    width: FW, height: 570, nodes: ex.nodes,
  });
}

// 10: expanded log line with the Trace button (steps 19 and 20)
{
  const c = card({ x: 16, y: 106, w: W, mode: 'code', lines: [STREAM] });
  const rows = [ROWS[0]];
  const res = logResult({ x: 16, y: 106 + c.h + 12, w: W, rows, hot: 0, open: true, trace: true });
  const ex = explore({ h: 620, ds: 'Loki', children: [...c.nodes, ...res.nodes, ...marks([[res.geo.row0, 19], [res.geo.traceBtn, 20]])] });
  figures.push({
    id: '10-trace-link',
    alt: 'Explore with Loki: a log line is expanded and lists the fields level, uri, status, trace_id and span_id; callout 19 marks the log line and callout 20 marks the Trace button next to the trace_id field',
    width: FW, height: 620, nodes: ex.nodes,
  });
}

// 11: data source picker, Tempo (step 21)
{
  const ex = explore({
    h: 340, ds: 'Loki', dsOpen: true,
    over: (g) => mark(g.option.Tempo, 21),
  });
  figures.push({
    id: '11-tempo-picker',
    alt: 'Explore with the data source picker open on Loki: callout 21 marks Tempo in the list of data sources',
    width: FW, height: 340, nodes: ex.nodes,
  });
}

// 12: Tempo editor, query type, TraceQL typed, Run query (steps 22 to 24)
{
  const y = 106;
  const g = {};
  const n = [];
  n.push(box(16, y, W, 190, { fill: 'surface', stroke: 'border', radius: 6 }));
  n.push(lbl(28, y + 26, 'A (Tempo)', { weight: 500, box: 200 }));
  n.push({ block: 'dropdown', x: 28, y: y + 44, w: 180, value: 'TraceQL' });
  g.type = { x: 28, y: y + 44, w: 180, h: 32 };
  g.editor = { x: 28, y: y + 90, w: W - 24, h: 60 };
  n.push({ block: 'queryEditor', x: g.editor.x, y: g.editor.y, w: g.editor.w, h: g.editor.h, lines: [TRACEQL] });
  const ex = explore({ h: 340, ds: 'Tempo', children: (eg) => [...n, ...marks([[g.type, 22], [g.editor, 23], [eg.run, 24]])] });
  figures.push({
    id: '12-traceql-query',
    alt: 'Explore with the Tempo data source: the query type TraceQL is marked by callout 22, the TraceQL query for the service bookshelf with status error is typed into the editor and marked by callout 23, and the Run query button is marked by callout 24',
    width: FW, height: 340, nodes: ex.nodes,
  });
}

// 13: navigation, Drilldown menu (step 26)
{
  const m = menu({ x: G_NAV_W + 4, y: 180, w: 190, heading: 'Drilldown', items: ['Metrics', 'Logs', 'Traces', 'Profiles'], hot: 1 });
  figures.push({
    id: '13-drilldown-menu',
    alt: 'Grafana with the navigation docked at the left: callout 26 marks the Logs entry of the Drilldown menu, which lists Metrics, Logs, Traces and Profiles',
    width: FW, height: 380,
    nodes: grafanaFrame({ h: 380, crumbs: ['Home'], nav: true, navActive: 'Drilldown', children: [...m.nodes, ...mark(m.rows[1], 26)] }),
  });
}

// 14: Logs Drilldown, service list (step 27)
{
  const x = 16;
  const showLogs = { x: 942, y: 276, w: 110, h: 32 };
  figures.push({
    id: '14-drilldown-logs',
    alt: 'Logs Drilldown of Grafana 13.3: controls for the data source, the labels and the time range Last 15 minutes, the tab service, and a list of service values with bookshelf and unknown_service; callout 27 marks the Show logs button of bookshelf',
    width: FW, height: 460,
    nodes: grafanaFrame({ h: 460, crumbs: ['Drilldown', 'Logs'], children: [
      { block: 'dropdown', x, y: 58, w: 190, label: 'Data source', value: 'Loki' },
      { block: 'field', x: x + 206, y: 58, w: 320, label: 'Labels', placeholder: 'Filter by labels' },
      btn(FW - 16 - 160, 78, 160, 'Last 15 minutes', 'secondary', 'clock'),
      { block: 'tabs', x, y: 134, w: 360, tabs: ['service', 'Add label tab'], active: 0 },
      { block: 'field', x, y: 188, w: 300, placeholder: 'Search values' },
      lbl(x + 320, 222, '2 labels have values for the selected time range', { size: 'small', tone: 'textMuted', box: 420 }),
      box(x, 260, W, 64, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(x + 16, 298, 'bookshelf', { weight: 500, box: 300 }),
      btn(x + W - 12 - 110 - 8 - 110, 276, 110, 'Include'), btn(showLogs.x, showLogs.y, 110, 'Show logs'),
      box(x, 332, W, 64, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(x + 16, 370, 'unknown_service', { weight: 500, box: 300 }),
      btn(x + W - 12 - 110 - 8 - 110, 348, 110, 'Include'), btn(showLogs.x, 348, 110, 'Show logs'),
      ...mark(showLogs, 27),
    ] }),
  });
}

// 15: the finished result: a log line of Loki next to its trace in Tempo (What you build)
{
  const lw = 500, rx = 540, rw = FW - rx - 16;
  const spans = [['bookshelf GET /api/books', 0, 1], ['bookshelf child span', 0.08, 0.7], ['bookshelf child span', 0.2, 0.55]];
  const n = [
    box(16, 106, lw, 380, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(28, 130, 'Loki', { weight: 500, box: 200 }),
    ...logRow(24, 146, lw - 16, '10:51:08.412', '{"uri":"/api/books","status":200,"trace_id":"4bf92f35...",...}', { hot: true }),
    ...logRow(24, 176, lw - 16, '10:51:08.377', '{"uri":"/api/search","status":200,...}'),
    ...logRow(24, 206, lw - 16, '10:51:08.201', '{"uri":"/api/books/{id}","status":404,...}'),
    box(rx, 106, rw, 380, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(rx + 12, 130, 'Tempo', { weight: 500, box: 200 }),
    lbl(rx + 12, 164, 'bookshelf: GET /api/books', { size: 'title', weight: 600, box: rw - 24 }),
    rule(rx, 180, rw),
  ];
  spans.forEach(([name, a, b], i) => {
    const y = 198 + i * 40;
    n.push(lbl(rx + 12, y + 16, name, { size: 'small', box: 170 }));
    n.push(box(rx + 190 + (rw - 206) * a, y + 2, (rw - 206) * (b - a), 18, { fill: 'series.2', radius: 2 }));
  });
  figures.push({
    id: '15-result',
    alt: 'Explore split view: on the left Loki log lines of the Bookshelf service with the first line selected, on the right the Tempo trace of that request with the root span GET /api/books and two child spans',
    width: FW, height: 510,
    nodes: grafanaFrame({ h: 510, crumbs: ['Explore'], children: n }),
  });
}

export default { product: 'grafana', guide: 'g4', figures };
