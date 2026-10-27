import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { toNumber, isMissing } from '../language-charts/data-utils.mjs';
import { loadData, generateCharts, CHART_DEFINITIONS, DATA_FILES } from './generate-charts.mjs';
import { AXES, EDITORIAL_AXES, FILE_PREFIX, RADAR_GROUPS, axisKind, decimalYear, frameworksOf, mean, nameOf, sourceIds } from './frameworks.mjs';
import {
  bundleScores, computeScores, growthScores, npmWindow, popularityInputs, runtimeScores, startupMemoryScores, talentScores, throughputScores,
} from './scores.mjs';
import { compressIds, footer } from './chart-definitions.mjs';
import { renderFrameworkChart, renderTimeline } from './renderers.mjs';

const data = loadData();
const specs = CHART_DEFINITIONS.map((b) => b(data));
const frameworkIds = new Set(data.frameworks.map((f) => f.id));
const sourceIdSet = new Set(data.sources.map((s) => s.id));

function assertWellFormed(svg) {
  assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
  assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
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

// ---------------------------------------------------------------- data files
test('every data file loads and has rows', () => {
  for (const n of DATA_FILES) assert.ok(data[n].length > 0, `${n}.csv is empty`);
});

test('every data row carries known source ids and the retrieval date', () => {
  for (const n of DATA_FILES.filter((x) => !['sources', 'radar-scores', 'recommendations'].includes(x))) {
    for (const r of data[n]) {
      assert.ok('retrieved' in r, `${n}.csv has no retrieved column`);
      assert.match(r.retrieved, /^\d{4}-\d{2}-\d{2}$/, `${n}.csv: bad retrieved ${r.retrieved}`);
      for (const s of String(r.source).split(';')) if (!isMissing(s)) assert.ok(sourceIdSet.has(s), `${n}.csv cites unknown source ${s}`);
    }
  }
});

test('every framework id used in the data files exists in frameworks.csv (vanillajs is the benchmark baseline)', () => {
  for (const n of DATA_FILES.filter((x) => !['frameworks', 'sources'].includes(x))) {
    for (const r of data[n]) if (r.framework_id) assert.ok(frameworkIds.has(r.framework_id) || r.framework_id === 'vanillajs', `${n}.csv: unknown framework ${r.framework_id}`);
  }
});

test('missing values are the literal n/a, never an empty cell, and carry a note where the file has one', () => {
  for (const n of DATA_FILES) {
    for (const r of data[n]) {
      for (const [k, v] of Object.entries(r)) if (!['note', 'site_xref', 'site_page'].includes(k)) assert.notEqual(v, '', `${n}.csv: empty ${k}`);
      for (const k of ['value', 'rps', 'stars']) if (k in r && r[k] === 'n/a' && 'note' in r) assert.ok(r.note.length > 0, `${n}.csv: n/a ${k} without a note (${JSON.stringify(r).slice(0, 80)})`);
    }
  }
});

test('every documented framework links to an existing site page', () => {
  for (const f of data.frameworks.filter((x) => x.site_xref)) {
    assert.ok(readFileSync(new URL(`../../modules/ROOT/pages/${f.site_xref}`, import.meta.url), 'utf8').length > 0, f.site_xref);
  }
});

test('every source is either used or marked unverified/checked only, and has a URL', () => {
  for (const s of data.sources) {
    assert.match(s.url, /^https:\/\//, `${s.id}: url`);
    assert.ok(['yes', 'no'].includes(s.reachable), `${s.id}: reachable`);
    if (s.reachable === 'no') assert.match(s.used_for, /\(unverified\)/, `${s.id} is unreachable but not marked (unverified)`);
  }
});

test('every editorial score row has a 0-10 score and a written basis', () => {
  for (const r of data['radar-scores']) {
    assert.ok(EDITORIAL_AXES.includes(r.axis), r.axis);
    const n = toNumber(r.score);
    assert.ok(n !== null && n >= 0 && n <= 10, `${r.framework_id} ${r.axis}`);
    assert.ok(r.basis.length > 20, `${r.framework_id} ${r.axis}: basis`);
  }
});

test('radar groups have at most six members and every member has editorial scores', () => {
  const ed = new Set(data['radar-scores'].map((r) => `${r.framework_id}:${r.axis}`));
  for (const groups of Object.values(RADAR_GROUPS)) {
    for (const g of groups) {
      assert.ok(g.members.length <= 6, g.id);
      for (const id of g.members) for (const a of EDITORIAL_AXES) assert.ok(ed.has(`${id}:${a}`), `${id}:${a}`);
    }
  }
});

// ---------------------------------------------------------------- helpers and formulas
test('helpers: decimal years, means and source ids', () => {
  assert.equal(decimalYear('2026-07-01'), 2026.5);
  assert.equal(decimalYear('2020'), 2020);
  assert.equal(mean([null, 2, 4, undefined]), 3);
  assert.equal(mean([null]), null);
  assert.deepEqual(sourceIds([{ source: 'b;a' }, { source: 'n/a' }, { source: 'a' }]), ['a', 'b']);
  assert.deepEqual(compressIds(['so-2019', 'so-2020', 'so-2021', 'osv']), ['so-2019 to so-2021', 'osv']);
  assert.match(footer(data, ['osv']), /^Sources: osv \(see the Bibliography\)\. Data as of 2026-10-27\.$/);
  assert.equal(axisKind('ease_of_use'), 'editorial');
  assert.equal(axisKind('throughput'), 'computed');
  assert.equal(nameOf(data, 'spring-boot'), 'Spring Boot');
});

const fixture = (over) => ({
  popularity: [], jobs: [], github: [], 'popularity-history': [], 'downloads-npm': [], 'downloads-packagist': [], 'performance-techempower': [], 'performance-startup-memory': [], 'performance-web': [],
  'downloads-pypi': [], 'downloads-nuget': [], 'downloads-crates': [], 'downloads-hex': [], 'downloads-rubygems': [], ...over,
});

test('throughput: best gets 10, 100 times slower gets 0, n/a stays null', () => {
  const t = (id, rps) => ({ framework_id: id, round: '23', test: 'fortunes', rps: String(rps), variant: 'jit' });
  const s = throughputScores(fixture({ 'performance-techempower': [t('a', 100000), t('b', 10000), t('c', 1000), t('d', 'n/a')] }), ['a', 'b', 'c', 'd']);
  assert.deepEqual(s, { a: 10, b: 5, c: 0, d: null });
});

test('memory and startup need two like-for-like values, else null', () => {
  const r = (id, v) => ({ framework_id: id, source: 'quarkus-perf-comparison', variant: 'jit', metric: 'rss_after_first_request_mib', value: String(v) });
  assert.deepEqual(startupMemoryScores(fixture({ 'performance-startup-memory': [r('a', 100), r('b', 1000)] }), ['a', 'b'], 'rss_after_first_request_mib'), { a: 10, b: 0 });
  assert.deepEqual(startupMemoryScores(fixture({ 'performance-startup-memory': [r('a', 100)] }), ['a', 'b'], 'rss_after_first_request_mib'), { a: null, b: null });
});

test('runtime performance and bundle size follow the documented formulas', () => {
  const w = (id, metric, v) => ({ framework_id: id, metric, value: String(v) });
  assert.deepEqual(runtimeScores(fixture({ 'performance-web': [w('a', 'jsfb_cpu_weighted_geomean', 1), w('b', 'jsfb_cpu_weighted_geomean', 8)] }), ['a', 'b', 'c']), { a: 10, b: 0, c: null });
  assert.deepEqual(bundleScores(fixture({ 'performance-web': [w('a', 'jsfb_size_compressed_kb', 5), w('b', 'jsfb_size_compressed_kb', 50)] }), ['a', 'b'], 'jsfb_size_compressed_kb'), { a: 10, b: 5 });
});

test('popularity uses only registries shared by two frameworks and ignores single-value signals', () => {
  const d = fixture({
    'downloads-npm': [{ framework_id: 'a', primary: 'yes', period: 'last-12-months', value: '1000000' }, { framework_id: 'b', primary: 'yes', period: 'last-12-months', value: '1000' }],
    'downloads-rubygems': [{ framework_id: 'c', primary: 'yes', period: 'total', value: '999' }],
    popularity: [{ framework_id: 'a', metric: 'so_usage_all', value: '10' }],
  });
  const p = popularityInputs(d, ['a', 'b', 'c']);
  assert.equal(p.a.downloads, 1);
  assert.equal(p.b.downloads, 0.5);
  assert.equal(p.c.downloads, undefined);
  assert.equal(p.a.so_usage, null);
});

test('a framework on several registries is scored in the registry with the most frameworks on the page', () => {
  const r = (id, v, period) => ({ framework_id: id, primary: 'yes', period, value: String(v) });
  const d = fixture({
    'downloads-npm': [r('a', 1e6, 'last-12-months'), r('b', 1e3, 'last-12-months'), r('c', 1e2, 'last-12-months')],
    'downloads-packagist': [r('b', 99, 'last-30-days'), r('d', 100, 'last-30-days')],
  });
  const p = popularityInputs(d, ['a', 'b', 'c', 'd']);
  assert.equal(p.b.downloads, 0.5, 'npm (3 frameworks) wins over Packagist (2), whatever the processing order');
  assert.equal(p.d.downloads, 1);
});

test('growth is min-max scaled per signal and null without two values', () => {
  const h = (id, period, v) => ({ framework_id: id, metric: 'so_usage_all', period, value: String(v) });
  const g = growthScores(fixture({ 'popularity-history': [h('a', '2023', 10), h('a', '2025', 20), h('b', '2023', 10), h('b', '2025', 10), h('c', '2025', 5)] }), ['a', 'b', 'c']);
  assert.deepEqual(g, { a: 10, b: 0, c: null });
});

test('talent scores average the two ratio signals', () => {
  const j = (id, metric, v, period = '2025') => ({ framework_id: id, metric, value: String(v), period });
  const s = talentScores(fixture({ jobs: [j('a', 'talent_pool_so_usage_prof', 40), j('b', 'talent_pool_so_usage_prof', 20), j('a', 'hn_mention_share', 10), j('b', 'hn_mention_share', 10)] }), ['a', 'b']);
  assert.deepEqual(s, { a: 10, b: 7.5 });
});

test('npm windows are null when a month is n/a', () => {
  const m = (month, v) => ({ framework_id: 'a', primary: 'yes', period: 'month', period_start: `${month}-01`, value: String(v) });
  const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
  assert.equal(npmWindow(fixture({ 'downloads-npm': months.map((x) => m(x, 1)) }), 'a', '2025-07-01', '2026-06-01'), 12);
  assert.equal(npmWindow(fixture({ 'downloads-npm': months.map((x, i) => m(x, i ? 1 : 'n/a')) }), 'a', '2025-07-01', '2026-06-01'), null);
});

test('computed scores on the real data are 0-10 or null, and editorial axes match radar-scores.csv', () => {
  const s = computeScores(data);
  for (const [page, byId] of Object.entries(s)) {
    for (const [id, axes] of Object.entries(byId)) {
      for (const [a, v] of Object.entries(axes)) assert.ok(v === null || (v >= 0 && v <= 10), `${page} ${id} ${a}=${v}`);
    }
  }
  assert.equal(s.backend['spring-boot'].ease_of_use, toNumber(data['radar-scores'].find((r) => r.framework_id === 'spring-boot' && r.axis === 'ease_of_use').score));
  assert.equal(s.backend.vapor.throughput, null, 'a framework without TechEmpower data must be null, not 0');
  for (const id of RADAR_GROUPS.web.find((g) => g.id === 'css').members) assert.ok(id in s.css);
});

// ---------------------------------------------------------------- charts
test('chart files use the page prefixes and are unique', () => {
  const files = specs.map((s) => s.file);
  assert.equal(new Set(files).size, files.length);
  for (const f of files) assert.ok(f.startsWith(FILE_PREFIX.backend) || f.startsWith(FILE_PREFIX.web), f);
});

test('every chart has a title, a description and a footer naming known sources and the date', () => {
  for (const s of specs) {
    assert.ok(s.title && s.desc, s.file);
    assert.match(s.footer, /^Sources: .+ \(see the Bibliography\)\. Data as of 2026-10-27/, s.file);
    const ids = s.footer.replace(/^Sources: /, '').replace(/ \(see the Bibliography\).*$/s, '').split(', ').flatMap((x) => x.split(' to '));
    for (const id of ids) assert.ok(sourceIdSet.has(id), `${s.file}: footer cites unknown source ${id}`);
  }
});

test('cartesian charts have axis labels; line charts have at most eight series', () => {
  for (const s of specs) {
    if (['line', 'bar', 'scatter', 'groupedbar'].includes(s.type)) assert.ok(s.xLabel && s.yLabel, s.file);
    if (s.type === 'line') assert.ok(s.series.length <= 8, `${s.file}: ${s.series.length} series`);
  }
});

test('missing values are never plotted as zero', () => {
  for (const s of specs) {
    if (s.type === 'line') for (const se of s.series) for (const p of se.points) assert.ok(p.y === null || typeof p.y === 'number', s.file);
    if (s.type === 'bar') for (const it of s.items) assert.ok(it.value === null || Number.isFinite(it.value), s.file);
  }
  // npm months the API had gaps for are n/a in the data and null in the chart
  const ui = specs.find((s) => s.file === `${FILE_PREFIX.web}downloads-npm-monthly-ui`);
  const react = ui.series.find((x) => x.name === 'React');
  const sep = react.points.find((p) => Math.abs(p.x - decimalYear('2026-09-01')) < 1e-9);
  assert.equal(sep.y, null);
  const vapor = specs.find((s) => s.file === `${FILE_PREFIX.backend}radar-rust-go-swift-elixir`).series.find((x) => x.name === 'Vapor');
  assert.equal(vapor.values[AXES.backend.indexOf('throughput')], null);
});

test('registries never share an axis', () => {
  for (const s of specs.filter((x) => x.file.includes('downloads'))) {
    if (s.type === 'panelbars') continue; // one panel (own axis) per registry
    assert.match(s.title + s.yLabel + s.xLabel, /npm|PyPI|Packagist/, s.file);
  }
});

test('a chart whose data is entirely n/a is skipped and reported', () => {
  const empty = { ...data, popularity: data.popularity.map((r) => ({ ...r, value: 'n/a' })) };
  const so = CHART_DEFINITIONS[1](empty);
  assert.ok(so.skip, 'so-usage should be skipped');
  const dir = mkdtempSync(join(tmpdir(), 'fw-skip-'));
  try {
    const stale = join(dir, `${so.file}.svg`);
    writeFileSync(stale, '<svg/>');
    const { written, skipped } = generateCharts([CHART_DEFINITIONS[1]], empty, dir);
    assert.equal(written.length, 0);
    assert.equal(skipped.length, 1);
    assert.equal(existsSync(stale), false, 'the previous SVG of a skipped chart must be deleted');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('active timeline rows end at the snapshot date, not at the right edge of the axis', () => {
  const t = (asOf) => renderTimeline({ id: 't', title: 'T', desc: 'D', xLabel: 'Year', from: 2000, to: 2027, asOf, rows: [{ label: 'A', start: 2010 }] });
  const width = (svg) => Number(svg.match(/<rect class="f0" x="[^"]+" y="[^"]+" width="([^"]+)"/g).pop().match(/width="([^"]+)"/)[1]);
  assert.ok(width(t('2020-01-01')) < width(t('2027-01-01')));
  assert.equal(width(t('n/a')), width(t('2027-01-01')), 'an unknown snapshot falls back to the axis end');
});

test('the CSS stylesheet-size panel (lower is better) lists the smallest first and n/a last', () => {
  const css = specs.find((s) => s.file?.endsWith('css-frameworks'));
  const size = css.panels.find((p) => p.title.includes('lower is better')).items;
  const known = size.filter((i) => i.value !== null).map((i) => i.value);
  assert.deepEqual(known, [...known].sort((a, b) => a - b));
  assert.ok(size.findIndex((i) => i.value === null) === -1 || size.slice(size.findIndex((i) => i.value === null)).every((i) => i.value === null));
});

test('every chart renders to a well-formed SVG with light and dark theme variables', () => {
  for (const s of specs) {
    const svg = renderFrameworkChart(s);
    assertWellFormed(svg);
    assert.match(svg, /var\(--bg\)/, s.file);
  }
});

test('the timeline shows n/a for a missing first release instead of a bar from zero', () => {
  const svg = renderTimeline({ id: 't', title: 'T', desc: 'D', xLabel: 'Year', from: 2000, to: 2027, rows: [{ label: 'A', start: 2010, majors: [{ x: 2015, label: 'v2' }] }, { label: 'B', start: null }] });
  assertWellFormed(svg);
  assert.match(svg, />n\/a</);
});

test('generation is deterministic and writes every non-skipped chart', () => {
  const a = mkdtempSync(join(tmpdir(), 'fw-a-'));
  const b = mkdtempSync(join(tmpdir(), 'fw-b-'));
  try {
    const ra = generateCharts(CHART_DEFINITIONS, data, a);
    generateCharts(CHART_DEFINITIONS, loadData(), b);
    assert.equal(ra.written.length + ra.skipped.length, CHART_DEFINITIONS.length);
    for (const f of readdirSync(a)) assert.equal(readFileSync(join(a, f), 'utf8'), readFileSync(join(b, f), 'utf8'), f);
  } finally {
    rmSync(a, { recursive: true, force: true });
    rmSync(b, { recursive: true, force: true });
  }
});

test('frameworksOf includes frameworks marked for both pages', () => {
  assert.ok(frameworksOf(data, 'backend').some((f) => f.id === 'aspnet-webforms'));
  assert.ok(frameworksOf(data, 'web').some((f) => f.id === 'aspnet-webforms'));
});
