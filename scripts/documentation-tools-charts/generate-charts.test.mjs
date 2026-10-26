import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { renderChart } from '../language-charts/generate-charts.mjs';
import { toNumber } from '../language-charts/data-utils.mjs';
import { loadData, generateCharts, CHART_DEFINITIONS, FILE_PREFIX, DATA_FILES } from './generate-charts.mjs';
import { decimalYear, yearMonthLabel, RADAR_TOOLS } from './chart-definitions.mjs';
import {
  AXES, COMPUTED_AXES, computeScores, ecosystemScore, maintenanceScore, monthsBetween, releasesInLastYear,
} from './scores.mjs';

const data = loadData();

function assertWellFormed(svg) {
  assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
  assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
  assert.match(svg, /class="legend"/);
  assert.doesNotMatch(svg, /NaN|undefined|Infinity/);
  assert.doesNotMatch(svg, /&(?!amp;|lt;|gt;|quot;|apos;)/);
  const stack = [];
  for (const m of svg.replace(/<style>[\s\S]*?<\/style>/g, '').matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [, close, name, , self] = m;
    if (self) continue;
    if (close) assert.equal(stack.pop(), name); else stack.push(name);
  }
  assert.deepEqual(stack, []);
}

test('every data file loads and has rows', () => {
  for (const n of DATA_FILES) assert.ok(data[n].length > 0, `${n}.csv is empty`);
});

test('every tool has a current row, releases and a computed score set', () => {
  for (const t of data.tools) {
    assert.ok(data.current.some((c) => c.tool_id === t.id), `current.csv lacks ${t.id}`);
    assert.ok(data.releases.some((r) => r.tool_id === t.id), `releases.csv lacks ${t.id}`);
    assert.ok(data.adopters.some((r) => r.tool_id === t.id), `adopters.csv lacks ${t.id}`);
    assert.ok(data.trends.some((r) => r.tool_id === t.id), `trends.csv lacks ${t.id}`);
  }
});

test('the snapshot date is the same on every current row and numbers are numbers', () => {
  assert.equal(new Set(data.current.map((c) => c.retrieved)).size, 1);
  for (const c of data.current) {
    for (const f of ['stars', 'forks', 'open_issues', 'closed_issues', 'contributors', 'downloads']) {
      assert.notEqual(toNumber(c[f]), null, `${c.tool_id}.${f}`);
    }
    assert.match(c.release_date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('the latest release in current.csv is the newest release in releases.csv', () => {
  for (const c of data.current) {
    const newest = data.releases.filter((r) => r.tool_id === c.tool_id).map((r) => r.date).sort().pop();
    assert.equal(c.release_date, newest, c.tool_id);
  }
});

test('radar score rows use known axes and 0-10 values', () => {
  const axes = new Set(AXES.map(([k]) => k));
  for (const r of data['radar-scores']) {
    assert.ok(axes.has(r.axis), `unknown axis ${r.axis}`);
    assert.ok(!COMPUTED_AXES.includes(r.axis), `${r.axis} is computed, not scored by hand`);
    const v = toNumber(r.score);
    assert.ok(v !== null && v >= 0 && v <= 10, `${r.tool_id}/${r.axis}`);
    assert.ok(r.basis.length > 10, `${r.tool_id}/${r.axis} needs a basis`);
  }
});

test('computed scores cover every axis for the radar tools and stay within 0-10', () => {
  const scores = computeScores(data);
  for (const t of RADAR_TOOLS) {
    for (const [key] of AXES) {
      const v = scores[t][key];
      assert.ok(typeof v === 'number' && v >= 0 && v <= 10, `${t}/${key} = ${v}`);
    }
  }
});

test('ecosystemScore is log scaled and clamped', () => {
  assert.equal(ecosystemScore(100), 0);
  assert.equal(ecosystemScore(100000), 10);
  assert.equal(ecosystemScore(10), 0);
  assert.equal(ecosystemScore(10 ** 7), 10);
  assert.equal(ecosystemScore('n/a'), null);
  assert.equal(ecosystemScore(0), null);
});

test('maintenanceScore combines recency, cadence and closed share', () => {
  const base = { latestDate: '2026-10-01', snapshot: '2026-10-01', releasesLast12m: 12, openIssues: 0, closedIssues: 10 };
  assert.equal(maintenanceScore(base), 10);
  assert.equal(maintenanceScore({ ...base, releasesLast12m: 0 }), 6.7);
  assert.equal(maintenanceScore({ ...base, openIssues: 10 }), 8.3);
  assert.equal(maintenanceScore({ ...base, latestDate: '2024-10-01' }), 6.7);
  assert.equal(maintenanceScore({ ...base, openIssues: 'n/a' }), null);
  assert.equal(maintenanceScore({ ...base, openIssues: 0, closedIssues: 0 }), null);
});

test('monthsBetween and releasesInLastYear count correctly', () => {
  assert.ok(Math.abs(monthsBetween('2026-01-01', '2026-07-01') - 5.95) < 0.1);
  assert.equal(monthsBetween('2026-07-01', '2026-01-01'), 0);
  const rel = [
    { tool_id: 'a', date: '2026-10-26' }, { tool_id: 'a', date: '2025-10-27' },
    { tool_id: 'a', date: '2025-10-26' }, { tool_id: 'b', date: '2026-10-01' }, { tool_id: 'a', date: '2026-10-27' },
  ];
  assert.equal(releasesInLastYear(rel, 'a', '2026-10-26'), 2);
});

test('decimalYear and yearMonthLabel round trip months', () => {
  assert.equal(decimalYear('2026-01-01'), 2026);
  assert.ok(Math.abs(decimalYear('2026-07') - 2026.5) < 1e-9);
  for (const m of ['2025-01', '2025-06', '2026-12']) assert.equal(yearMonthLabel(decimalYear(m)), m);
  assert.equal(yearMonthLabel(decimalYear('2026-03-15')), '2026-03');
});

test('every chart definition renders a well-formed SVG with legend, title and desc', () => {
  const ids = new Set();
  for (const b of CHART_DEFINITIONS) {
    const spec = b(data);
    assert.ok(!ids.has(spec.id), `duplicate id ${spec.id}`);
    ids.add(spec.id);
    const svg = renderChart(spec);
    assertWellFormed(svg);
    assert.match(svg, /var\(--bg\)/);
    if (spec.type !== 'radar') {
      assert.ok(spec.xLabel && spec.yLabel, `${spec.id} needs axis labels`);
      assert.match(svg, /axis-label/);
    }
  }
  assert.equal(ids.size, 6 + 1 + RADAR_TOOLS.length);
});

test('bars show n/a, not zero, for Zensical questions and DocFX weekly downloads', () => {
  const byId = Object.fromEntries(CHART_DEFINITIONS.map((b) => b(data)).map((s) => [s.id, s]));
  assert.equal(byId.questions.items.find((i) => i.label === 'Zensical').value, null);
  const docfx = byId.downloads.items.find((i) => i.label.startsWith('DocFX'));
  assert.equal(docfx.value, null);
  assert.match(renderChart(byId.downloads), /n\/a/);
  assert.ok(byId.stars.items.some((i) => i.label === 'Antora (GitLab)'));
});

test('line series use only dated points and the PyPI axis shows year-month labels', () => {
  const specs = Object.fromEntries(CHART_DEFINITIONS.map((b) => b(data)).map((s) => [s.id, s]));
  assert.equal(specs['npm-downloads'].series.length, 2);
  assert.equal(specs['pypi-downloads'].series.length, 3);
  assert.match(renderChart(specs['pypi-downloads']), /20\d\d-\d\d<\/text>/);
  for (const s of specs.releases.series) {
    const ys = s.points.map((p) => p.y);
    assert.deepEqual(ys, [...ys].sort((a, b) => a - b), `${s.name} is cumulative`);
  }
});

test('generateCharts writes one prefixed SVG per definition', () => {
  const dir = mkdtempSync(join(tmpdir(), 'doc-tools-charts-'));
  try {
    const files = generateCharts(CHART_DEFINITIONS, data, dir);
    const written = readdirSync(dir).sort();
    assert.equal(written.length, CHART_DEFINITIONS.length);
    for (const f of written) {
      assert.ok(f.startsWith(FILE_PREFIX) && f.endsWith('.svg'));
      assertWellFormed(readFileSync(join(dir, f), 'utf8'));
    }
    assert.equal(files.length, written.length);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
