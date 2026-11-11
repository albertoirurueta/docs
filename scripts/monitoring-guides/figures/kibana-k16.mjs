// Figures of the Kibana guide K16, "Anomaly detection and AIOps" (guide-anomaly-detection-and-aiops.adoc).
// Facts: guides-brief/kibana-facts.md section 11. Verified there: the Machine Learning overview (sections, card titles and
// buttons) and the Log rate analysis page (header, data view picker, Use full data, time picker, Total documents, the
// banner "Log rate change point detected", Run analysis, Baseline and Deviation, Smart grouping, Fields and Columns tabs,
// Reset, "Analysis complete"). NOT VERIFIED there and drawn generically (labels of the Elastic documentation only, no
// layout claimed): the Data Visualizer page, the data view picker and job type page of the anomaly detection wizard,
// the single metric wizard steps, the Single Metric Viewer, the forecast dialog, the Anomaly Explorer and the Change point
// detection page. Sample values (counts, scores, p-values) are plausible, not measured. A figure shows the screen the step
// starts from; callout numbers are the step numbers of the page.
import { FW, lbl, box, btn, mark, marks, kibanaFrame } from '../lib/shells.mjs';

const figures = [];
const TL = ['10:20', '10:25', '10:30', '10:35', '10:40', '10:45'];

// a Machine Learning page: frame with breadcrumbs
const mlFrame = (h, crumbs, actions) => kibanaFrame({ h, crumbs: ['Machine Learning', ...crumbs], actions });

// 01: the Machine Learning overview (steps 1 and 2)
{
  const H = 560;
  const fr = mlFrame(H, ['Overview']);
  const card = (x, y, w, title, button, bw) => [box(x, y, w, 84, { fill: 'surface', stroke: 'border', radius: 6 }), lbl(x + 14, y + 26, title, { weight: 600, box: w - 28 }), btn(x + 14, y + 40, bw, button)];
  const k = [lbl(16, 140, 'Overview', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 })];
  k.push(lbl(16, 184, 'Analyze your data', { weight: 600 }));
  k.push(...card(16, 194, 340, 'Anomaly detection', 'Create anomaly detection job', 250), ...card(368, 194, 340, 'Tailored predictive models', 'Create data frame analytics job', 260));
  k.push(lbl(16, 304, 'Surface insights', { weight: 600 }));
  k.push(...card(16, 314, 340, 'Log pattern analysis', 'Find patterns', 150), ...card(368, 314, 340, 'Log rate analysis', 'Explain changes', 160), ...card(720, 314, 340, 'Change point detection', 'Find changes', 150));
  k.push(lbl(16, 424, 'Visualize your data', { weight: 600 }));
  k.push(...card(16, 434, 250, 'ES|QL', 'Open ES|QL editor', 190), ...card(278, 434, 250, 'Data drift', 'Compare data distribution', 220), ...card(540, 434, 250, 'Upload data files', 'Upload file', 130), ...card(802, 434, 258, 'Data view', 'Open data visualizer', 200));
  const dv = { x: 816, y: 474, w: 200, h: 32 };
  fr.nodes[0].children.push(...k, ...marks([[fr.geo.menu, 1], [dv, 2]]));
  figures.push({
    id: '01-ml-overview',
    alt: 'Machine Learning overview of Kibana 9.5 with the sections Analyze your data, Surface insights and Visualize your data and their cards; the menu button of the second bar is marked by callout 1 and the Open data visualizer button of the Data view card by callout 2',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 02: Data Visualizer (steps 3 and 4)
{
  const H = 520;
  const fr = mlFrame(H, ['Data Visualizer']);
  const dv = { x: 16, y: 112, w: 260, h: 32 };
  const row = { x: 16, y: 282, w: 1048, h: 40 };
  fr.nodes[0].children.push(
    { block: 'dropdown', ...dv, value: 'Bookshelf logs (guides)' },
    btn(284, 112, 150, 'Last 15 minutes', 'secondary', 'clock'),
    lbl(16, 184, 'Documents (sample)  1,534      Fields  38', { weight: 500, box: 500 }),
    { block: 'table', x: 16, y: 202, w: 1048, rowHeight: 40, columns: [{ title: 'Name', w: 2 }, { title: 'Type', w: 1 }, { title: 'Documents (%)', w: 1.4 }, { title: 'Distinct values', w: 1.4 }, { title: 'Distributions', w: 3 }],
      rows: [['@timestamp', 'date', '100', '1,534', 'Documents over time'], ['severity_text', 'keyword', '100', '2', 'INFO   ERROR'], ['attributes.status', 'number', '100', '3', '200   404   500'], ['attributes.uri', 'keyword', '100', '4', '/api/search   /api/books   /api/loans']] },
    ...marks([[dv, 3], [row, 4]]),
  );
  figures.push({
    id: '02-data-visualizer',
    alt: 'Data Visualizer of Kibana 9.5, drawn generically, on the data view Bookshelf logs (guides): the data view picker is marked by callout 3 and the row of the field severity_text, with its two values INFO and ERROR, by callout 4',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 03: the data view picker of the job wizard (step 6)
{
  const H = 420;
  const fr = mlFrame(H, ['Anomaly Detection', 'Create job']);
  const r = { x: 16, y: 244, w: 1048, h: 40 };
  fr.nodes[0].children.push(
    lbl(16, 140, 'Create job', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 }),
    lbl(16, 168, 'Select a data view or saved search', { tone: 'textMuted', box: 500 }),
    { block: 'field', x: 16, y: 184, w: 520, placeholder: 'Search' },
    box(16, 232, 1048, 128, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(30, 264, 'Bookshelf logs (guides)', { weight: 500, box: 400 }), lbl(30, 304, 'Kibana Sample Data Logs', { box: 400 }), lbl(30, 344, 'Kibana Sample Data eCommerce', { box: 400 }),
    ...mark(r, 6),
  );
  figures.push({
    id: '03-select-data-view',
    alt: 'Create job page of the anomaly detection wizard in Kibana 9.5, drawn generically, with a list of data views; Bookshelf logs (guides) is marked by callout 6',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 04: the job type page (step 7)
{
  const H = 520;
  const fr = mlFrame(H, ['Anomaly Detection', 'Create job']);
  const types = [['Single metric', 'Detect anomalies in a single time series.'], ['Multi-metric', 'Detect anomalies in one or more metrics.'], ['Population', 'Detect activity unusual compared to the population.'],
    ['Advanced', 'Use the full range of options for advanced cases.'], ['Categorization', 'Group log messages into categories.'], ['Rare', 'Detect rare values in time series data.']];
  const k = [lbl(16, 140, 'Create job', { size: 'heading', weight: 500, tone: 'textStrong', box: 300 }), lbl(16, 168, 'Choose the type of job to create', { tone: 'textMuted', box: 500 })];
  types.forEach(([t, d], i) => {
    const x = 16 + (i % 3) * 354, y = 188 + Math.floor(i / 3) * 150;
    k.push(box(x, y, 340, 130, { fill: 'surface', stroke: 'borderStrong', radius: 6 }), lbl(x + 16, y + 34, t, { size: 'title', weight: 600, box: 300 }), lbl(x + 16, y + 62, d, { size: 'small', tone: 'textMuted', box: 306 }));
  });
  fr.nodes[0].children.push(...k, ...mark({ x: 16, y: 188, w: 340, h: 130 }, 7));
  figures.push({
    id: '04-job-type',
    alt: 'Job type page of the anomaly detection wizard in Kibana 9.5, drawn generically, with six cards: Single metric, Multi-metric, Population, Advanced, Categorization and Rare; the Single metric card is marked by callout 7',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// the wizard frame: stepper over a content area
const WIZ = ['Time range', 'Pick fields', 'Job details', 'Validation', 'Summary'];
function wizard(H, active, kids) {
  const fr = mlFrame(H, ['Anomaly Detection', 'Create job', 'Single metric']);
  const k = [lbl(16, 140, 'Single metric job', { size: 'heading', weight: 500, tone: 'textStrong', box: 400 })];
  WIZ.forEach((w, i) => {
    const x = 16 + i * 200;
    k.push(box(x, 158, 26, 26, { fill: i === active ? 'primary' : 'surfaceRaised', radius: 13 }), lbl(x + 13, 176, String(i + 1), { anchor: 'middle', tone: i === active ? 'textOnPrimary' : 'text', weight: 600 }), lbl(x + 36, 176, w, { weight: i === active ? 600 : 400, tone: i === active ? 'text' : 'textMuted', box: 150 }));
  });
  fr.nodes[0].children.push(...k, ...(typeof kids === 'function' ? kids() : kids));
  return fr.nodes;
}
const SPIKE = [630, 640, 620, 650, 635, 640, 628, 645, 20, 0, 0, 35, 600, 640, 632, 642];

// 05: time range (steps 8 and 9)
{
  const H = 520;
  const full = { x: 16, y: 206, w: 160, h: 32 };
  const next = { x: FW - 16 - 90, y: H - 52, w: 90, h: 32 };
  const nodes = wizard(H, 0, [
    btn(full.x, full.y, full.w, 'Use full data', 'secondary'), { block: 'field', x: 190, y: 206, w: 230, value: 'Nov 11, 10:00' }, { block: 'field', x: 428, y: 206, w: 230, value: 'Nov 11, 10:50' },
    { block: 'bar', x: 16, y: 254, w: 1048, h: 200, categories: TL.concat(['10:50']), legend: false, max: 800, series: [{ name: 'Document count', values: [640, 635, 650, 630, 645, 640, 638] }] },
    btn(next.x, next.y, next.w, 'Next', 'primary'),
    ...marks([[full, 8], [next, 9]]),
  ]);
  figures.push({
    id: '05-time-range',
    alt: 'Time range step of the single metric wizard in Kibana 9.5, drawn generically: the Use full data button is marked by callout 8 and the Next button by callout 9; a chart of the document count of Bookshelf logs (guides) shows the data range',
    width: FW, height: H, nodes,
  });
}

// 06: pick fields (steps 10 to 12)
{
  const H = 520;
  const agg = { x: 16, y: 226, w: 300, h: 32 };
  const span = { x: 340, y: 226, w: 160, h: 32 };
  const next = { x: FW - 16 - 90, y: H - 52, w: 90, h: 32 };
  const nodes = wizard(H, 1, [
    { block: 'dropdown', x: agg.x, y: agg.y - 20, w: agg.w, label: 'Aggregation', value: 'Count' },
    { block: 'field', x: span.x, y: span.y - 20, w: span.w, label: 'Bucket span', value: '1m' },
    { block: 'line', x: 16, y: 284, w: 1048, h: 180, series: [{ name: 'Count', points: SPIKE }], min: 0, max: 800, yLabels: ['0', '400', '800'], xLabels: ['10:20', '10:50'], legend: false },
    btn(next.x, next.y, next.w, 'Next', 'primary'),
    ...marks([[agg, 10], [span, 11], [next, 12]]),
  ]);
  figures.push({
    id: '06-pick-fields',
    alt: 'Pick fields step of the single metric wizard in Kibana 9.5, drawn generically: the aggregation Count is marked by callout 10, the bucket span 1m by callout 11 and the Next button by callout 12; the chart previews the document count',
    width: FW, height: H, nodes,
  });
}

// 07: job details (steps 13 and 14)
{
  const H = 420;
  const id = { x: 16, y: 226, w: 420, h: 32 };
  const next = { x: FW - 16 - 90, y: H - 52, w: 90, h: 32 };
  const nodes = wizard(H, 2, [
    { block: 'field', x: id.x, y: id.y - 20, w: id.w, label: 'Job ID', value: 'guide-bookshelf-log-rate', mono: true },
    { block: 'field', x: 16, y: 290, w: 700, label: 'Job description (optional)', placeholder: 'Count of Bookshelf log lines per minute' },
    btn(next.x - 98, next.y, 90, 'Back'), btn(next.x, next.y, next.w, 'Next', 'primary'),
    ...marks([[id, 13], [next, 14]]),
  ]);
  figures.push({
    id: '07-job-details',
    alt: 'Job details step of the single metric wizard in Kibana 9.5, drawn generically: the Job ID guide-bookshelf-log-rate is marked by callout 13 and the Next button, which leads to the Validation step, by callout 14',
    width: FW, height: H, nodes,
  });
}

// the Single Metric Viewer
const BOUND_HI = [700, 705, 700, 710, 700, 705, 700, 708, 700, 705, 700, 710, 700, 705, 700, 706];
const BOUND_LO = [560, 565, 560, 570, 560, 565, 560, 568, 560, 565, 560, 570, 560, 565, 560, 566];
function smv({ H, forecast = false, children }) {
  const fr = mlFrame(H, ['Single Metric Viewer']);
  const g = { forecast: { x: FW - 16 - 120, y: 112, w: 120, h: 32 } };
  const chart = { x: 16, y: 190, w: 1048, h: 230 };
  g.chart = chart;
  const series = [{ name: 'Upper bound', points: BOUND_HI, color: 'series.1' }, { name: 'Lower bound', points: BOUND_LO, color: 'series.1' }, { name: 'Actual', points: SPIKE, color: 'series.0' }];
  const n = [
    { block: 'chip', x: 16, y: 118, str: 'guide-bookshelf-log-rate', w: 200 },
    btn(g.forecast.x - 158, 112, 150, 'Last 1 hour', 'secondary', 'clock'),
    btn(g.forecast.x, 112, g.forecast.w, 'Forecast', 'secondary'),
    box(chart.x, chart.y, chart.w, chart.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    { block: 'line', x: chart.x + 8, y: chart.y + 8, w: chart.w - 16, h: chart.h - 16, series, min: 0, max: 800, yLabels: ['0', '400', '800'], xLabels: ['10:30', '10:45'], legend: false },
    box(581, 372, 14, 14, { fill: 'threshold.red', radius: 7 }), box(646, 375, 14, 14, { fill: 'threshold.red', radius: 7 }),
    lbl(16, 442, 'Anomalies', { weight: 600 }),
    { block: 'table', x: 16, y: 452, w: 1048, rowHeight: 34, columns: [{ title: 'Time', w: 1.4 }, { title: 'Severity', w: 1 }, { title: 'Detector', w: 1.2 }, { title: 'Actual', w: 1 }, { title: 'Typical', w: 1 }],
      rows: [['Nov 11, 10:38', '82', 'count', '0', '632'], ['Nov 11, 10:39', '75', 'count', '0', '632']] },
  ];
  if (forecast) n.push(...forecast);
  fr.nodes[0].children.push(...n, ...(typeof children === 'function' ? children(g) : children ?? []));
  return fr.nodes;
}

// 08: the Single Metric Viewer (steps 16 and 17)
{
  const H = 560;
  const nodes = smv({ H, children: (g) => mark(g.chart, 17) });
  figures.push({
    id: '08-single-metric-viewer',
    alt: 'Single Metric Viewer of Kibana 9.5, drawn generically, for the job guide-bookshelf-log-rate: the actual document count, the shaded expected bounds and two red anomaly markers are marked by callout 17; an Anomalies table lists their time, severity, actual and typical values',
    width: FW, height: H, nodes,
  });
}

// 09: the forecast dialog (steps 18 to 20)
{
  const H = 560;
  const mx = 360, my = 150, mw = 360;
  const dur = { x: mx + 24, y: my + 84, w: mw - 48, h: 32 };
  const run = { x: mx + mw - 24 - 80, y: my + 150, w: 80, h: 32 };
  const nodes = smv({ H, forecast: [
    box(mx, my, mw, 210, { fill: 'surface', stroke: 'borderStrong', radius: 8 }),
    lbl(mx + 24, my + 38, 'Run a new forecast', { size: 'title', weight: 600, box: 300 }),
    { block: 'field', x: dur.x, y: dur.y - 20, w: dur.w, label: 'Duration', value: '1d' },
    btn(mx + mw - 24 - 80 - 8 - 84, run.y, 84, 'Close'), btn(run.x, run.y, run.w, 'Run', 'primary'),
  ], children: (g) => marks([[g.forecast, 18], [dur, 19], [run, 20]]) });
  figures.push({
    id: '09-forecast',
    alt: 'Single Metric Viewer of Kibana 9.5 with a forecast dialog drawn generically: the Forecast button is marked by callout 18, the duration 1d by callout 19 and the Run button by callout 20',
    width: FW, height: H, nodes,
  });
}

// 10: the Anomaly Explorer (steps 22 and 23)
{
  const H = 560;
  const fr = mlFrame(H, ['Anomaly Explorer']);
  const lane = { x: 16, y: 190, w: 1048, h: 56 };
  const tbl = { x: 16, y: 330, w: 1048, h: 100 };
  const cells = ['surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'threshold.red', 'threshold.red', 'threshold.orange', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised', 'surfaceRaised'];
  const n = [
    { block: 'chip', x: 16, y: 118, str: 'guide-bookshelf-log-rate', w: 200 },
    btn(FW - 16 - 150, 112, 150, 'Last 1 hour', 'secondary', 'clock'),
    lbl(16, 176, 'Anomaly timeline', { weight: 600 }),
    box(lane.x, lane.y, lane.w, lane.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    lbl(28, 224, 'Overall', { size: 'small', tone: 'textMuted', box: 70 }),
  ];
  cells.forEach((c, i) => n.push(box(110 + i * 58, 198, 54, 40, { fill: c, radius: 3 })));
  n.push(lbl(16, 316, 'Anomalies', { weight: 600 }),
    { block: 'table', x: tbl.x, y: tbl.y - 2, w: tbl.w, rowHeight: 34, columns: [{ title: 'Time', w: 1.4 }, { title: 'Severity', w: 1 }, { title: 'Detector', w: 1.2 }, { title: 'Actual', w: 1 }, { title: 'Typical', w: 1 }],
      rows: [['Nov 11, 10:38', '82', 'count', '0', '632'], ['Nov 11, 10:39', '75', 'count', '0', '632']] });
  fr.nodes[0].children.push(...n, ...marks([[{ x: 110 + 8 * 58, y: 198, w: 170, h: 40 }, 22], [{ x: tbl.x, y: tbl.y, w: tbl.w, h: 102 }, 23]]));
  figures.push({
    id: '10-anomaly-explorer',
    alt: 'Anomaly Explorer of Kibana 9.5, drawn generically, with the anomaly timeline: three coloured cells of the Overall lane are marked by callout 22 and the Anomalies table below them by callout 23',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// the Log rate analysis page (verified labels)
const LRA = [70, 74, 72, 68, 75, 71, 73, 70, 72, 138, 150, 146, 142, 148, 74, 71, 72, 70];
const LRA_CATS = ['10:15', '', '', '', '10:20', '', '', '', '10:25', '', '', '', '10:30', '', '', '', '10:35', ''];
function lra({ H, selection = false, analysed = false, banner = true, children }) {
  const fr = kibanaFrame({ h: H, crumbs: ['Machine Learning', 'Log rate analysis'] });
  const g = { dataView: { x: 16, y: 112, w: 240, h: 32 }, time: { x: 380, y: 112, w: 170, h: 32 } };
  const ch = { x: 16, y: 190, w: 1048, h: 200 };
  g.chart = ch;
  const n = [
    { block: 'dropdown', ...g.dataView, value: 'Bookshelf logs (guides)' },
    btn(264, 112, 108, 'Use full data'), btn(g.time.x, g.time.y, g.time.w, 'Last 30 minutes', 'secondary', 'clock'),
    lbl(16, 172, 'Total documents: 1,534', { size: 'small', weight: 500, box: 260 }), lbl(1064, 172, 'Chart type: bar chart', { size: 'small', tone: 'textMuted', anchor: 'end', box: 260 }),
    box(ch.x, ch.y, ch.w, ch.h, { fill: 'surface', stroke: 'border', radius: 6 }),
    { block: 'bar', x: ch.x + 8, y: ch.y + 8, w: ch.w - 16, h: ch.h - 16, categories: LRA_CATS, legend: false, max: 200, series: [{ name: 'Documents', values: LRA }] },
  ];
  const px = ch.x + 52, pw = ch.w - 16 - 56, bw = pw / LRA.length;
  g.deviation = { x: px + 9 * bw, y: ch.y + 8, w: 5 * bw, h: ch.h - 40 };
  g.baseline = { x: px + 1 * bw, y: ch.y + 8, w: 7 * bw, h: ch.h - 40 };
  if (selection || analysed) {
    n.push(box(g.deviation.x, g.deviation.y, g.deviation.w, g.deviation.h, { fill: 'none', stroke: 'threshold.orange', radius: 3, dash: '5 3' }));
    n.push(box(g.baseline.x, g.baseline.y, g.baseline.w, g.baseline.h, { fill: 'none', stroke: 'series.2', radius: 3, dash: '5 3' }));
    n.push(lbl(g.deviation.x + 8, g.deviation.y + 16, 'Deviation', { size: 'small', weight: 600, box: 100 }), lbl(g.baseline.x + 8, g.baseline.y + 16, 'Baseline', { size: 'small', weight: 600, box: 100 }));
  }
  if (banner && !analysed) {
    n.push(box(16, 408, 1048, 96, { fill: 'surface', stroke: 'border', radius: 6 }),
      lbl(32, 436, 'Log rate change point detected', { weight: 600, box: 500 }),
      lbl(32, 458, 'The log rate analysis feature identifies statistically significant field/value combinations that contribute to a log rate spike or dip.', { size: 'small', tone: 'textMuted', box: 800 }));
    g.run = { x: 32, y: 466, w: 130, h: 32 };
    n.push(btn(g.run.x, g.run.y, g.run.w, 'Run analysis', 'primary'));
  }
  fr.nodes[0].children.push(...n.filter(Boolean), ...(typeof children === 'function' ? children(g) : children ?? []));
  return { nodes: fr.nodes, g };
}

// 11: the Log rate analysis page (steps 26 and 27)
{
  const H = 540;
  const p = lra({ H, children: (g) => marks([[g.dataView, 27], [g.time, 27]]) });
  figures.push({
    id: '11-log-rate-analysis',
    alt: 'Log rate analysis page of Kibana 9.5 on the data view Bookshelf logs (guides) with a bar chart of the documents per interval, the banner Log rate change point detected and the Run analysis button; the data view picker and the time picker Last 30 minutes are marked by callout 27',
    width: FW, height: H, nodes: p.nodes,
  });
}

// 12: select the deviation (steps 28 and 29)
{
  const H = 540;
  const p = lra({ H, selection: true, children: (g) => marks([[g.deviation, 28], [g.run, 29]]) });
  figures.push({
    id: '12-select-deviation',
    alt: 'Log rate analysis page of Kibana 9.5 with the failing period selected in the chart, drawn with a dashed Deviation area over the high bars and a dashed Baseline area before them; the Deviation area is marked by callout 28 and the Run analysis button by callout 29',
    width: FW, height: H, nodes: p.nodes,
  });
}

// 13: change point detection (steps 31 to 34)
{
  const H = 560;
  const fr = kibanaFrame({ h: H, crumbs: ['Machine Learning', 'Change point detection'] });
  const dv = { x: 16, y: 112, w: 240, h: 32 };
  const fn = { x: 16, y: 190, w: 200, h: 32 };
  const fld = { x: 232, y: 190, w: 300, h: 32 };
  fr.nodes[0].children.push(
    { block: 'dropdown', ...dv, value: 'Bookshelf logs (guides)' },
    btn(264, 112, 170, 'Last 30 minutes', 'secondary', 'clock'),
    { block: 'dropdown', x: fn.x, y: fn.y - 20, w: fn.w, label: 'Function', value: 'avg' },
    { block: 'dropdown', x: fld.x, y: fld.y - 20, w: fld.w, label: 'Metric field', value: 'attributes.status' },
    box(16, 250, 1048, 200, { fill: 'surface', stroke: 'border', radius: 6 }),
    { block: 'line', x: 24, y: 258, w: 1032, h: 184, series: [{ name: 'avg(attributes.status)', points: [201, 202, 201, 203, 202, 201, 330, 350, 340, 345, 335, 202, 201, 203] }], min: 0, max: 400, yLabels: ['0', '200', '400'], xLabels: ['10:20', '10:50'], legend: false },
    lbl(16, 478, 'Change points', { weight: 600 }),
    { block: 'table', x: 16, y: 488, w: 1048, rowHeight: 34, columns: [{ title: 'Type', w: 1.4 }, { title: 'Time', w: 1.4 }, { title: 'Metric', w: 2 }], rows: [['Step change', 'Nov 11, 10:36', 'avg(attributes.status)']] },
    ...marks([[dv, 32], [fn, 33], [fld, 34]]),
  );
  figures.push({
    id: '13-change-point',
    alt: 'Change point detection page of Kibana 9.5, drawn generically: the data view Bookshelf logs (guides) is marked by callout 32, the function avg by callout 33 and the metric field attributes.status by callout 34; the chart shows a step up of the average and a table lists one step change',
    width: FW, height: H, nodes: fr.nodes,
  });
}

// 14: the analysis result (What you build)
{
  const H = 620;
  const p = lra({ H, analysed: true });
  p.nodes[0].children.push(
    lbl(16, 420, 'Analysis complete', { size: 'small', weight: 600, box: 200 }),
    { block: 'toggle', x: 660, y: 410, label: 'Smart grouping', on: false, box: 140 },
    btn(840, 404, 80, 'Reset'), btn(928, 404, 136, 'Run analysis'),
    { block: 'tabs', x: 16, y: 438, w: 200, tabs: ['Fields', 'Columns'], active: 0 },
    { block: 'table', x: 16, y: 482, w: 1048, rowHeight: 34, columns: [{ title: 'Field name', w: 2 }, { title: 'Field value', w: 1.4 }, { title: 'Log rate', w: 2 }, { title: 'Impact', w: 1 }],
      rows: [['severity_text', 'ERROR', 'Rises in the deviation', 'High'], ['attributes.status', '500', 'Rises in the deviation', 'High']] },
  );
  figures.push({
    id: '14-result',
    alt: 'Log rate analysis page of Kibana 9.5 after Run analysis, drawn generically: the chart with the Baseline and Deviation areas, the status Analysis complete, the Smart grouping switch, the Fields and Columns tabs and a table listing severity_text ERROR and attributes.status 500 as the field values behind the spike',
    width: FW, height: H, nodes: p.nodes,
  });
}

export default { product: 'kibana', guide: 'k16', figures };
