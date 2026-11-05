import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { toNumber } from '../language-charts/data-utils.mjs';
import { loadData, generateCharts, CHART_DEFINITIONS, FILE_PREFIX, DATA_FILES } from './generate-charts.mjs';
import { renderGraphicsChart, decimalYear, yearMonthLabel, monthStartTicks } from './renderers.mjs';
import { quarterYear } from './chart-definitions.mjs';
import { AXES, LIBRARIES, LIBRARY_SLOT, computeScores } from './scores.mjs';

const data = loadData();
const specs = Object.fromEntries(CHART_DEFINITIONS.map((b) => b(data)).map((s) => [s.id, s]));

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

test('measured rows have the shared columns, https sources and the snapshot date', () => {
  for (const n of ['current', 'timeseries']) {
    for (const r of data[n]) {
      for (const c of ['platform', 'metric', 'date', 'value', 'unit', 'source_url', 'fetched']) assert.ok(r[c] !== undefined && r[c] !== '', `${n}.csv ${r.metric}: empty ${c}`);
      assert.match(r.source_url, /^https:\/\//);
      assert.equal(r.fetched, '2026-11-01');
    }
  }
});

test('values are numbers or the n/a marker, never an empty cell, and n/a rows say why', () => {
  for (const n of ['current', 'timeseries']) {
    for (const r of data[n]) {
      assert.ok(r.value === 'n/a' || toNumber(r.value) !== null, `${n}.csv ${r.metric} ${r.date}: "${r.value}"`);
      if (r.value === 'n/a') assert.ok(r.notes.length > 5, `${n}.csv ${r.metric} ${r.item} ${r.date} needs a note`);
    }
  }
});

test('Unity and Unreal Engine have no repository values, the GDC share is unverified and not charted', () => {
  for (const p of ['unity', 'unreal-engine']) {
    for (const m of ['github_stars', 'github_contributors']) assert.equal(data.current.find((r) => r.platform === p && r.metric === m).value, 'n/a');
  }
  for (const r of data.current.filter((x) => x.metric === 'gdc_engine_share')) { assert.equal(r.value, 'n/a'); assert.match(r.notes, /unverified/); }
  assert.ok(!JSON.stringify(specs['engine-share']).includes('gdc'));
});

test('Stack Overflow data covers 2010-2025 for the nine tags and tags are n/a before they existed', () => {
  const tags = new Set(data.timeseries.filter((r) => r.metric === 'stackexchange_questions_year').map((r) => r.item));
  assert.equal(tags.size, 9);
  for (const t of tags) assert.equal(data.timeseries.filter((r) => r.item === t && r.metric === 'stackexchange_questions_year').length, 16, t);
  const ue5 = data.timeseries.filter((r) => r.item === 'stackoverflow: tag unreal-engine5' && Number(r.date) < 2020);
  assert.ok(ue5.length > 0 && ue5.every((r) => r.value === 'n/a'));
  for (const s of [...specs['stackoverflow-apis'].series, ...specs['stackoverflow-engines'].series]) for (const p of s.points) assert.ok(p.y === null || p.y > 0, `${s.name} ${p.x}`);
});

test('npm series cover three packages and quarters', () => {
  const s = specs['npm-weekly'].series;
  assert.equal(s.length, 3);
  for (const x of s) assert.ok(x.points.length >= 25, x.name);
  assert.equal(quarterYear('2026-Q3'), 2026.5);
  assert.equal(quarterYear('bad'), null);
});

test('survey shares are percentages and the survey is flagged in the footer', () => {
  for (const r of data.current.filter((x) => x.metric === 'jetbrains_engine_share')) { const v = toNumber(r.value); assert.ok(v >= 0 && v <= 100); }
  assert.match(specs['engine-share'].footer, /Survey data/);
  assert.equal(specs['engine-share'].series[0].values[0], 64);
});

test('release rows are ordered, cover all six libraries and the ones still current are open', () => {
  for (const l of LIBRARIES) assert.ok(data.releases.some((r) => r.library === l), l);
  for (const r of data.releases) {
    assert.match(r.start, /^\d{4}-\d{2}-\d{2}$/);
    if (r.end !== 'open') assert.ok(r.end > r.start, r.line);
  }
  for (const line of ['OpenGL 4.6', 'Vulkan 1.4', 'Metal 4', 'Unity 6', 'Unreal Engine 5']) assert.equal(data.releases.find((r) => r.line === line).end, 'open');
  assert.match(renderGraphicsChart(specs['release-timeline']), /check date 2026-11-01/);
});

test('radar score rows use the ten known axes, 0-10 values and a basis with a source', () => {
  const axes = new Set(AXES.map(([k]) => k));
  assert.equal(AXES.length, 10);
  for (const r of data['radar-scores']) {
    assert.ok(axes.has(r.axis), `unknown axis ${r.axis}`);
    const v = toNumber(r.score);
    assert.ok(v !== null && v >= 0 && v <= 10, `${r.platform}/${r.axis}`);
    assert.ok(r.basis.length > 20, `${r.platform}/${r.axis} needs a basis`);
    assert.match(r.source_url, /^https:\/\//);
  }
  assert.equal(data['radar-scores'].length, LIBRARIES.length * AXES.length);
  const scores = computeScores(data);
  for (const l of LIBRARIES) for (const [k] of AXES) assert.ok(typeof scores[l][k] === 'number', `${l}/${k}`);
  assert.ok(scores.webgl.web_reach > scores.metal.web_reach);
  assert.ok(scores.vulkan.control > scores.unity.control);
});

test('decimalYear, yearMonthLabel and month ticks behave', () => {
  assert.equal(decimalYear('2026-01-01'), 2026);
  assert.equal(yearMonthLabel(decimalYear('2025-06')), '2025-06');
  assert.deepEqual(monthStartTicks(decimalYear('2026-05-04'), decimalYear('2026-07-02')).map(yearMonthLabel), ['2026-05', '2026-06', '2026-07', '2026-08']);
});

test('every chart definition renders a well-formed SVG with legend, title, desc, caption and axis labels', () => {
  const ids = new Set();
  for (const b of CHART_DEFINITIONS) {
    const spec = b(data);
    assert.ok(!ids.has(spec.id), `duplicate id ${spec.id}`);
    ids.add(spec.id);
    const svg = renderGraphicsChart(spec);
    assertWellFormed(svg);
    assert.match(svg, /var\(--bg\)/);
    assert.match(svg, /class="footer"/);
    assert.match(svg, /retrieved 2026-11-01/);
    if (spec.type !== 'slotradar') assert.match(svg, /axis-label/);
  }
  assert.equal(ids.size, 10);
});

test('one colour slot per library in every figure', () => {
  assert.deepEqual(LIBRARIES.map((p) => LIBRARY_SLOT[p]), [0, 1, 2, 3, 4, 5]);
  assert.match(renderGraphicsChart(specs['radar-engines']), /class="a5"/);
  assert.match(renderGraphicsChart(specs['radar-engines']), /class="a4"/);
  for (const s of specs['radar-all'].series) assert.equal(s.slot, LIBRARY_SLOT[LIBRARIES[specs['radar-all'].series.indexOf(s)]]);
});

test('missing values are n/a, not zero', () => {
  const unity = specs['github-stars'].items.find((i) => i.label.startsWith('Unity'));
  assert.equal(unity.value, null);
  assert.match(renderGraphicsChart(specs['github-stars']), /n\/a \(no public repository\)/);
});

test('generateCharts writes one prefixed SVG per definition and is deterministic', () => {
  const a = mkdtempSync(join(tmpdir(), 'gg-charts-a-'));
  const b = mkdtempSync(join(tmpdir(), 'gg-charts-b-'));
  try {
    const files = generateCharts(CHART_DEFINITIONS, data, a);
    generateCharts(CHART_DEFINITIONS, loadData(), b);
    const written = readdirSync(a).sort();
    assert.equal(written.length, CHART_DEFINITIONS.length);
    assert.equal(files.length, written.length);
    for (const f of written) {
      assert.ok(f.startsWith(FILE_PREFIX) && f.endsWith('.svg'));
      const text = readFileSync(join(a, f), 'utf8');
      assertWellFormed(text);
      assert.equal(text, readFileSync(join(b, f), 'utf8'), `${f} differs between runs`);
    }
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});
