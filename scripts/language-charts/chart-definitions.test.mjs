import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  loadData, generateCharts, renderChart, renderScatterChart, labelBox, boxesOverlap, CHART_DEFINITIONS, FILE_PREFIX,
} from './generate-charts.mjs';
import {
  firstYear, licenceFamily, purposeKind, sortItems, historySeries, registryLabel, growthPoints, RADAR_GROUPS,
} from './chart-definitions.mjs';
import { linScore, logScore, logInvScore, countPurposes, computeScores, AXES } from './scores.mjs';

const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} != ${b}`);
const data = loadData();

test('firstYear takes the first four-digit year and ignores n/a', () => {
  assert.equal(firstYear('1954-1955'), 1954);
  assert.equal(firstYear('1978 (uncertain in source)'), 1978);
  assert.equal(firstYear('1989 (Bash); Bourne shell 1977'), 1989);
  assert.equal(firstYear('n/a (ambiguous: 1952 autocode)'), null);
  assert.equal(firstYear(''), null);
});

test('licenceFamily groups SPDX-like values and leaves missing as null', () => {
  assert.equal(licenceFamily('MIT (Roslyn compiler)'), 'MIT');
  assert.equal(licenceFamily('Apache-2.0 (GitHub SPDX; dual)'), 'Apache-2.0');
  assert.equal(licenceFamily('GPL-2.0 (GitHub SPDX)'), 'GPL-2.0');
  assert.equal(licenceFamily('BSD-3-Clause'), 'BSD-3-Clause');
  assert.equal(licenceFamily('Ruby License and BSD-2-Clause'), 'Ruby License / BSD-2-Clause');
  assert.equal(licenceFamily('n/a'), null);
});

test('the licence chart counts only what languages.csv records', () => {
  const def = CHART_DEFINITIONS.map((d) => d(data)).find((d) => d.id === 'licences');
  const recorded = data.languages.filter((l) => licenceFamily(l.license) !== null).length;
  const total = def.items.reduce((a, i) => a + i.value, 0);
  assert.equal(total, data.languages.length);
  const na = def.items.find((i) => i.label.startsWith('n/a'));
  assert.equal(na.value, data.languages.length - recorded);
  assert.equal(def.items.at(-1), na);
  assert.doesNotMatch(def.items.map((i) => i.label).join(' '), /closed|proprietary/i);
});

test('purposeKind separates general-purpose, mixed and specific lists', () => {
  assert.equal(purposeKind('general-purpose'), 'general');
  assert.equal(purposeKind('general-purpose;readability'), 'general-plus');
  assert.equal(purposeKind('business data processing;finance'), 'specific');
  assert.equal(purposeKind('n/a'), null);
});

test('sortItems puts missing values last and sorts both directions', () => {
  const items = [{ label: 'b', value: 2 }, { label: 'n', value: null }, { label: 'a', value: 5 }];
  assert.deepEqual(sortItems(items).map((i) => i.label), ['a', 'b', 'n']);
  assert.deepEqual(sortItems(items, 'asc').map((i) => i.label), ['b', 'a', 'n']);
});

test('historySeries offsets months from June, sorts, keeps gaps and drops empty series', () => {
  const rows = [
    { source: 'tiobe', language_id: 'x', year: '2026', sample_month: '10', value: '3' },
    { source: 'tiobe', language_id: 'x', year: '2025', sample_month: '6', value: 'n/a' },
    { source: 'tiobe', language_id: 'x', year: '2024', sample_month: '6', value: '2' },
    { source: 'tiobe', language_id: 'z', year: '2024', sample_month: '6', value: 'n/a' },
    { source: 'pypl', language_id: 'x', year: '2024', sample_month: '6', value: '9' },
  ];
  const s = historySeries(rows, 'tiobe', ['x', 'z'], (id) => id.toUpperCase());
  assert.equal(s.length, 1);
  assert.deepEqual(s[0].points.map((p) => p.y), [2, null, 3]);
  near(s[0].points[2].x, 2026 + 4 / 12);
});

test('registryLabel shortens names and strips unit qualifiers', () => {
  assert.equal(registryLabel('CPAN (MetaCPAN)', 'distributions'), 'CPAN (distributions)');
  assert.equal(registryLabel('Julia General registry', 'packages'), 'Julia General (packages)');
  assert.equal(registryLabel('Maven Central', 'artifacts (groupId:artifactId)'), 'Maven Central (artifacts)');
  assert.equal(registryLabel('npm', ''), 'npm');
});

test('registry growth draws only registries with a real series and never invents one', () => {
  const def = CHART_DEFINITIONS.map((d) => d(data)).find((d) => d.id === 'ecosystem-registry-growth');
  assert.deepEqual(def.series.map((s) => s.name), ['LuaRocks']);
  assert.ok(def.series[0].points.every((p) => p.y > 0));
  assert.match(def.desc, /only registry with a real yearly series/);
});

test('growth points need both a current rating and a June 2016 sample', () => {
  const points = growthPoints(data);
  assert.ok(points.length > 10);
  assert.ok(points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
  assert.ok(!points.some((p) => p.id === 'zig'));
});

test('score helpers: lin, log and inverse log', () => {
  near(linScore(5, 0, 10), 5);
  near(logScore(10, 1, 100), 5);
  near(logInvScore(10, 1, 100), 5);
  near(logInvScore(1, 1, 100), 10);
  near(logInvScore(100, 1, 100), 0);
  assert.equal(linScore(null, 0, 1), null);
  assert.equal(logScore(0, 1, 2), null);
  near(linScore(3, 3, 3), 10);
  assert.equal(countPurposes('a; b ;A;'), 2);
  assert.equal(countPurposes('n/a'), null);
});

test('computeScores follows the rubric on a small fixture and keeps n/a as null', () => {
  const lang = (id) => ({ id, name: id });
  const d = {
    languages: [lang('a'), lang('b'), lang('c')],
    'popularity-current': [
      { language_id: 'a', source: 'tiobe', metric: 'rating', value: '10' },
      { language_id: 'b', source: 'tiobe', metric: 'rating', value: '1' },
      { language_id: 'a', source: 'so-survey-2026', metric: 'so-usage', value: '50' },
      { language_id: 'b', source: 'so-survey-2026', metric: 'so-usage', value: '0' },
    ],
    ecosystem: [
      { language_id: 'a', metric: 'registry_packages', value: '1000' },
      { language_id: 'b', metric: 'registry_packages', value: '10' },
      { language_id: 'a', metric: 'actively_maintained', value: 'yes' },
      { language_id: 'a', metric: 'standardisation_body', value: 'ISO' },
      { language_id: 'b', metric: 'standardisation_body', value: 'n/a' },
    ],
    performance: [
      { language_id: 'a', metric: 'cpu_time_vs_fastest', value: '1' },
      { language_id: 'b', metric: 'cpu_time_vs_fastest', value: '100' },
      { language_id: 'c', metric: 'cpu_time_vs_fastest', value: 'n/a' },
      { language_id: 'a', metric: 'memory_vs_fastest', value: '2' },
      { language_id: 'b', metric: 'memory_vs_fastest', value: '2' },
    ],
    energy: [{ language_id: 'a', energy_normalized: '1.00' }, { language_id: 'b', energy_normalized: '10' }, { language_id: 'c', energy_normalized: 'n/a' }],
    learning: [
      { language_id: 'a', metric: 'onboarding_score', value: '10' },
      { language_id: 'b', metric: 'onboarding_score', value: 'n/a' },
      { language_id: 'a', metric: 'verbosity_gzip_bytes', value: '100' },
      { language_id: 'b', metric: 'verbosity_gzip_bytes', value: '400' },
    ],
    security: [
      { language_id: 'a', metric: 'memory_safety', value: 'memory-safe unless unsafe construct' },
      { language_id: 'b', metric: 'memory_safety', value: 'not memory safe' },
      { language_id: 'c', metric: 'memory_safety', value: 'n/a' },
    ],
    versatility: [
      { language_id: 'a', metric: 'purposes', value: 'x;y;z' },
      { language_id: 'b', metric: 'purposes', value: 'x' },
      { language_id: 'c', metric: 'purposes', value: 'n/a' },
    ],
    jobs: [{ language_id: 'a', source: 'so-survey-2024', metric: 'so-median-salary', value: '100' }],
  };
  const { axes, scores } = computeScores(d);
  assert.equal(axes.length, AXES.length - 1, 'job axis dropped with fewer than 10 languages');
  const a = scores.get('a');
  const b = scores.get('b');
  const c = scores.get('c');
  near(a[0], 10); near(b[0], 0);                     // popularity: mean of log(TIOBE) and lin(SO)
  near(a[1], 0.6 * 10 + 2 + 2); near(b[1], 0);       // ecosystem: log packages, active, standard
  near(a[2], 10); near(b[2], 0); assert.equal(c[2], null);
  near(a[3], 10); near(b[3], 10);                    // equal memory ratios: all best
  near(a[4], 10); near(b[4], 0); assert.equal(c[4], null);
  near(a[5], (10 + 10) / 2); assert.equal(b[5], null); // learning needs onboarding and verbosity
  near(a[6], 8); near(b[6], 2); assert.equal(c[6], null);
  near(a[7], 10); near(b[7], 0); assert.equal(c[7], null);
  assert.ok(c.every((v) => v === null));
});

test('the job axis is kept when enough languages have salary data', () => {
  const { axes } = computeScores(data);
  assert.equal(axes.at(-1), 'Job market');
});

test('real-data scores are within 0-10 and radar groups name known languages', () => {
  const { scores } = computeScores(data);
  for (const v of [...scores.values()].flat()) assert.ok(v === null || (v >= 0 && v <= 10), String(v));
  const ids = new Set(data.languages.map((l) => l.id));
  for (const g of RADAR_GROUPS) {
    assert.ok(g.ids.length >= 3 && g.ids.length <= 8, g.id);
    assert.ok(g.ids.every((id) => ids.has(id)), g.id);
  }
  // Rubric anchors: C is the energy anchor and Python is the most popular.
  const idx = (label) => computeScores(data).axes.indexOf(label);
  near(scores.get('c')[idx('Energy')], 10);
  assert.ok(scores.get('python')[idx('Popularity')] >= 9);
});

test('scatter label collision avoidance hides overlapping labels but keeps the markers', () => {
  assert.ok(boxesOverlap(labelBox(0, 0, 'abc'), labelBox(5, 2, 'abc')));
  assert.ok(!boxesOverlap(labelBox(0, 0, 'abc'), labelBox(0, 40, 'abc')));
  const svg = renderScatterChart({
    id: 's', title: 't', desc: 'd', xLabel: 'x', yLabel: 'y', xExtent: [0, 10],
    series: [{ name: 'g', points: [{ x: 1, y: 1, label: 'Big', weight: 5 }, { x: 1.01, y: 1.01, label: 'Small', weight: 1 }, { x: 8, y: 8, label: 'Far' }] }],
  });
  assert.match(svg, />Big</); assert.match(svg, />Far</);
  assert.doesNotMatch(svg, /<text[^>]*>Small</);
  assert.match(svg, /<title>Small<\/title>/);
});

test('every chart definition renders valid SVG from the real data without NaN', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lang-charts-all-'));
  try {
    const files = generateCharts(CHART_DEFINITIONS, data, dir);
    assert.equal(files.length, CHART_DEFINITIONS.length);
    const ids = new Set();
    for (const f of files) {
      const svg = readFileSync(f, 'utf8');
      assert.match(svg, /^<svg /);
      assert.doesNotMatch(svg, /NaN|undefined|Infinity/, f);
      assert.match(svg, /<title id="[^"]+">[^<]+<\/title>/);
      assert.match(svg, /<desc id="[^"]+">[^<]{40,}<\/desc>/);
      assert.match(f, new RegExp(`${FILE_PREFIX}[a-z0-9]+(-[a-z0-9]+)*\\.svg$`), 'kebab-case file name');
      ids.add(f);
    }
    assert.equal(ids.size, files.length, 'file names are unique');
    assert.equal(readdirSync(dir).length, files.length);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('renderChart accepts every builder output', () => {
  for (const b of CHART_DEFINITIONS) assert.ok(renderChart(b(data)).includes('</svg>'));
});
