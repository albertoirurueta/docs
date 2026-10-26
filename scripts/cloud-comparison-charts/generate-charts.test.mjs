import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readCsv } from '../language-charts/generate-charts.mjs';
import { toNumber } from '../language-charts/data-utils.mjs';
import { loadData, generateCharts, CHART_DEFINITIONS, FILE_PREFIX, DATA_FILES, DATA_DIR } from './generate-charts.mjs';
import { decimalYear, quarterYear, sourceIds, snapshotOf } from './chart-definitions.mjs';
import {
  PROVIDERS, PROVIDER_COLORS, PROVIDER_IDS, providerId, providerIndex, providerName,
} from './providers.mjs';
import {
  AXES, COMPUTED_AXES, EDITORIAL_AXES, computeScores, computedBasis, ecosystemInputs, latestSynergyQuarter,
  meanRatioScore, popularityInputs, publicFootprint, sovereignOptions, architectureTotals,
} from './scores.mjs';
import { FIT_LEVELS, fitFor, llmAvailability, recommendationRows, WORKLOADS } from './matrix.mjs';
import {
  addFooter, renderCloudChart, renderGrid, renderGroupedBarChart, renderPanelBars, wrapText,
} from './renderers.mjs';
import { radarCsv, recommendationsCsv, toCsv } from './update-derived-data.mjs';

const data = loadData();
const specs = Object.fromEntries(CHART_DEFINITIONS.map((b) => b(data)).map((s) => [s.id, s]));

function assertWellFormed(svg) {
  assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /<title[^>]*>[^<]+<\/title>/);
  assert.match(svg, /<desc[^>]*>[^<]+<\/desc>/);
  assert.doesNotMatch(svg, /NaN|undefined|Infinity/);
  assert.doesNotMatch(svg, /&(?!amp;|lt;|gt;|quot;|apos;)/);
  assert.match(svg, /<rect width="\d+" height="\d+" fill="var\(--bg\)"\/>/);
  const stack = [];
  for (const m of svg.replace(/<style>[\s\S]*?<\/style>/g, '').matchAll(/<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g)) {
    const [, close, name, , self] = m;
    if (self) continue;
    if (close) assert.equal(stack.pop(), name); else stack.push(name);
  }
  assert.deepEqual(stack, []);
  const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.match(svg, new RegExp(`<svg [^>]*width="${vb[1]}" height="${vb[2]}"`));
}

test('every data file loads and has rows', () => {
  for (const n of DATA_FILES) assert.ok(data[n].length > 0, `${n}.csv is empty`);
});

test('every row of the data files carries a source and the snapshot date', () => {
  for (const n of DATA_FILES.filter((x) => !['sources', 'radar-scores', 'service-mapping'].includes(x))) {
    for (const r of data[n]) {
      if ('source' in r) assert.ok(r.source.trim() !== '', `${n}.csv row without source`);
      if ('retrieved' in r) assert.match(r.retrieved, /^\d{4}-\d{2}-\d{2}$/, `${n}.csv`);
    }
  }
  assert.equal(snapshotOf(data), '2026-10-26');
});

test('every source id named in a figure footer exists in sources.csv', () => {
  const known = new Set(data.sources.map((x) => x.id));
  for (const spec of Object.values(specs)) {
    const m = /^Sources: ([^.]*)\. Data as of/.exec(spec.footer);
    if (!m) continue; // the radar footer names data files, not source ids
    assert.ok(m[1].length > 0, `${spec.id} footer has no source ids`);
    for (const id of m[1].split(', ')) assert.ok(known.has(id), `${spec.id}: unknown source id ${id}`);
  }
});

test('provider ids are normalised from every spelling used by the CSVs', () => {
  assert.deepEqual(['aws', 'AWS', 'Azure', 'azure', 'microsoft', 'gcp', 'google_cloud', 'Google Cloud', 'google-cloud'].map(providerId),
    ['aws', 'aws', 'azure', 'azure', 'azure', 'google-cloud', 'google-cloud', 'google-cloud', 'google-cloud']);
  assert.equal(providerId('oracle'), null);
  assert.equal(providerId(undefined), null);
  assert.equal(providerName('azure'), 'Azure');
  assert.equal(providerName('other'), 'other');
  assert.deepEqual(PROVIDER_IDS, ['aws', 'azure', 'google-cloud']);
  for (const file of ['pricing', 'reference-totals', 'footprint', 'regions-over-time', 'service-availability', 'market-share', 'revenue', 'adoption', 'tooling', 'learning']) {
    for (const r of data[file]) {
      const raw = r.provider;
      if (raw !== undefined && raw !== 'all') assert.ok(providerId(raw), `${file}.csv has unknown provider "${raw}"`);
    }
  }
});

test('colour mapping: a provider has one palette slot and one colour in every figure', () => {
  assert.equal(providerIndex('aws'), 0);
  assert.equal(providerIndex('azure'), 1);
  assert.equal(providerIndex('google-cloud'), 2);
  assert.equal(new Set(Object.values(PROVIDER_COLORS)).size, 3);
  const palette = [...readFileSync(new URL('../language-charts/generate-charts.mjs', import.meta.url), 'utf8')
    .match(/const LIGHT = \[([^\]]+)\]/)[1].matchAll(/'(#[0-9A-Fa-f]{6})'/g)].map((m) => m[1]);
  PROVIDER_IDS.forEach((id, i) => assert.equal(PROVIDER_COLORS[id], palette[i], `${id} colour is palette slot ${i}`));
  for (const s of Object.values(specs)) {
    if (s.series) {
      assert.deepEqual(s.series.map((x) => x.name.split(' (')[0].replace(/ and other cloud services| Intelligent Cloud/, '')
        .replace('Microsoft', 'Azure')), PROVIDERS.map((p) => p.name), `${s.id} series order`);
    }
  }
  const svg = renderCloudChart(specs.radar);
  for (const [i, c] of Object.values(PROVIDER_COLORS).entries()) assert.match(svg, new RegExp(`--s${i}:${c}`));
  const matrix = renderCloudChart(specs['region-footprint']);
  for (const c of Object.values(PROVIDER_COLORS)) assert.ok(matrix.includes(`fill="${c}"`), `footprint uses ${c}`);
});

test('n/a is never plotted as zero in lines, bars, panels or grids', () => {
  for (const s of Object.values(specs)) {
    for (const ser of s.series ?? []) {
      for (const p of ser.points ?? []) assert.notEqual(p.y, 0, `${s.id}/${ser.name} has a zero point`);
      for (const v of ser.values ?? []) assert.notEqual(v, 0, `${s.id}/${ser.name} has a zero value`);
    }
  }
  // Azure Synergy share is n/a in 2018-Q3: the point stays a gap.
  const azure = specs['market-share'].series[1].points.filter((p) => p.y === null);
  assert.ok(azure.length > 0);
  const canalys = specs['market-share-canalys'];
  assert.ok(canalys.series.some((s) => s.values.includes(null)));
  assert.match(renderCloudChart(canalys), />n\/a</);
  const panels = specs['adoption-surveys'].panels;
  assert.ok(panels.some((p) => p.items.some((i) => i.value === null)));
  assert.match(renderCloudChart(specs['adoption-surveys']), /class="na"[^>]*>n\/a/);
  const flexera26 = panels.find((p) => p.title.includes('Flexera') && p.title.includes('2026'));
  assert.equal(flexera26.items.find((i) => i.label === 'Google Cloud').value, null);
  // Azure has no availability zone total before 2026 and AWS none for 2025.
  const zonePts = specs['availability-zones'].series;
  assert.ok(zonePts[0].points.some((p) => p.y === null));
  assert.ok(zonePts[1].points.every((p) => p.y === null || p.x > 2026));
  assert.equal(toNumber('n/a'), null);
});

test('series are never joined across breaks: Synergy reclassification, other scope, other definitions', () => {
  const [aws, azure] = specs['market-share'].series;
  const y = (pts, q) => pts.findIndex((p) => p.x === quarterYear(q));
  const iBreak = y(azure.points, '2024-Q3');
  assert.equal(azure.points[iBreak - 1].y, null, 'gap before Azure 2024-Q3');
  assert.equal(azure.points[iBreak].y, 20);
  const i19 = y(aws.points, '2019-Q3');
  assert.equal(aws.points[i19].y, 40);
  assert.equal(aws.points[i19 - 1].y, null);
  assert.equal(aws.points[i19 + 1].y, null);
  // The Canalys figure only holds Canalys rows and the Synergy figure no Canalys quarters.
  assert.deepEqual(specs['market-share-canalys'].categories, ['2025-Q1', '2025-Q3', '2025-Q4']);
  // Microsoft revenue uses the FY25 definition only (3 recast rows exist for 2023-Q3 .. 2024-Q2).
  const msft = specs.revenue.series[1].points;
  assert.equal(msft.length, 12);
  assert.equal(msft[0].y, 20.013);
  assert.equal(new Set(msft.map((p) => p.x)).size, msft.length);
  // Azure growth is the reported Azure rate, not the Intelligent Cloud rate.
  const g = specs.growth.series[1].points;
  assert.equal(g.find((p) => p.x === quarterYear('2026-Q2')).y, 43);
  // Azure's announced region counts replace the 58 listed regions on the regions line.
  const azRegions = specs.regions.series[1].points;
  assert.ok(azRegions.every((p) => p.y === null || p.y >= 50));
  assert.ok(!azRegions.some((p) => p.y === 58));
  // Each survey is a separate figure or panel; Stack Overflow populations are never on one axis.
  assert.equal(specs['adoption-stackoverflow'].series[0].points.length, specs['adoption-stackoverflow-professional'].series[0].points.length);
  assert.ok(specs['adoption-surveys'].panels.length >= 3);
  for (const p of specs['adoption-surveys'].panels) assert.match(p.note, /Population/);
});

test('every chart definition renders a well-formed SVG with a title, desc, footer and as-of date', () => {
  const ids = new Set();
  for (const b of CHART_DEFINITIONS) {
    const spec = b(data);
    assert.ok(!ids.has(spec.id), `duplicate id ${spec.id}`);
    ids.add(spec.id);
    const svg = renderCloudChart(spec);
    assertWellFormed(svg);
    assert.match(svg, /class="footer"/, `${spec.id} has no footer`);
    assert.ok(spec.footer.includes('2026-10-26') || spec.id === 'radar' ? spec.footer.includes('2026-10-26') : false, `${spec.id} footer lacks the as-of date`);
    assert.ok(spec.desc.includes('2026-10-26'), `${spec.id} desc lacks the as-of date`);
    assert.match(spec.footer, /(Sources: [a-z0-9-]+|Computed axes)/);
    assert.ok(spec.title.length > 10);
  }
  assert.equal(ids.size, 15);
  for (const id of ['region-footprint', 'service-availability', 'recommendation-matrix', 'radar', 'pricing-blocks']) assert.ok(ids.has(id), id);
});

test('line charts keep the legend, axis labels and year ticks readable', () => {
  for (const id of ['market-share', 'revenue', 'growth', 'regions', 'availability-zones', 'adoption-stackoverflow']) {
    const svg = renderCloudChart(specs[id]);
    assert.match(svg, /class="legend"/);
    assert.match(svg, /axis-label/);
    for (const p of PROVIDERS) assert.ok(svg.includes(p.name) || id === 'revenue' || id === 'growth', `${id} legend lacks ${p.name}`);
  }
});

test('generateCharts writes one prefixed SVG per definition into the output directory', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cloud-charts-'));
  try {
    const files = generateCharts(CHART_DEFINITIONS, data, dir);
    const written = readdirSync(dir).sort();
    assert.equal(written.length, CHART_DEFINITIONS.length);
    assert.equal(files.length, written.length);
    for (const f of written) {
      assert.ok(f.startsWith(FILE_PREFIX) && f.endsWith('.svg'));
      assertWellFormed(readFileSync(join(dir, f), 'utf8'));
    }
    assert.deepEqual(written, Object.keys(specs).map((id) => `${FILE_PREFIX}${id}.svg`).sort());
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('score computation stays within 0-10 and is complete for every provider and axis', () => {
  const scores = computeScores(data);
  for (const id of PROVIDER_IDS) {
    for (const [key] of AXES) {
      const v = scores[id][key];
      assert.ok(typeof v === 'number' && v >= 0 && v <= 10, `${id}/${key} = ${v}`);
    }
  }
  assert.equal(scores.aws.popularity, 10);
  assert.equal(scores.azure.popularity, 6.6);
  assert.equal(scores['google-cloud'].popularity, 5.6);
  assert.deepEqual(PROVIDER_IDS.map((id) => scores[id].ecosystem_breadth), [10, 9.4, 8]);
  assert.deepEqual(PROVIDER_IDS.map((id) => scores[id].price_competitiveness), [9.8, 10, 8.4]);
  assert.deepEqual(PROVIDER_IDS.map((id) => scores[id].regional_coverage), [8.1, 8.7, 8]);
});

test('radar-scores.csv matches the computed values, keeps the editorial rows and states a basis', () => {
  const scores = computeScores(data);
  assert.equal(data['radar-scores'].length, AXES.length * PROVIDER_IDS.length);
  for (const r of data['radar-scores']) {
    const v = toNumber(r.score);
    assert.ok(v !== null && v >= 0 && v <= 10, `${r.provider_id}/${r.axis}`);
    assert.ok(r.basis.length > 20, `${r.provider_id}/${r.axis} needs a basis`);
    assert.ok(AXES.some(([k]) => k === r.axis));
    if (COMPUTED_AXES.includes(r.axis)) assert.equal(v, scores[providerId(r.provider_id)][r.axis], `${r.provider_id}/${r.axis} is stale, run update-derived-data.mjs`);
    else assert.ok(EDITORIAL_AXES.includes(r.axis) && /^Editorial/.test(r.basis));
  }
  assert.equal(radarCsv(data), readFileSync(join(DATA_DIR, 'radar-scores.csv'), 'utf8'));
  const basis = computedBasis(data);
  assert.match(basis.aws.price_competitiveness, /reference-totals/);
  assert.match(basis['google-cloud'].regional_coverage, /43 regions and 130 zones/);
  assert.match(basis.aws.regional_coverage, /34 regions and 109 zones/);
  const partial = { ...data, 'reference-totals': data['reference-totals'].filter((r) => !(r.architecture === 'static-site' && r.provider !== 'aws')) };
  assert.match(computedBasis(partial).azure.price_competitiveness, /static-site n\/a USD/);
});

test('score helpers handle missing values without inventing zeros', () => {
  assert.equal(meanRatioScore([1, null, 0.5]), 7.5);
  assert.equal(meanRatioScore([null, null]), null);
  assert.equal(meanRatioScore([]), null);
  assert.equal(latestSynergyQuarter(data['market-share']), '2026-Q2');
  assert.equal(popularityInputs(data).quarter, '2026-Q2');
  assert.deepEqual(popularityInputs(data).share, { aws: 28, azure: 20, 'google-cloud': 15 });
  assert.equal(ecosystemInputs(data).categories, 31);
  assert.deepEqual(ecosystemInputs(data).covered, { aws: 31, azure: 30, 'google-cloud': 24 });
  assert.deepEqual(sovereignOptions(data.sovereign), { aws: 3, azure: 2, 'google-cloud': 2 });
  assert.deepEqual(publicFootprint(data.footprint), {
    aws: { regions: 34, zones: 109 }, azure: { regions: 58, zones: 124 }, 'google-cloud': { regions: 43, zones: 130 },
  });
  const totals = architectureTotals(data['reference-totals']);
  assert.equal(Math.round(totals['static-site'].aws * 100) / 100, 48.2);
  assert.deepEqual(Object.keys(totals).sort(), ['ai-service', 'microservices', 'simple-dynamic-site', 'static-site']);
  const noData = { ...data, 'reference-totals': [], footprint: [], tooling: [], 'market-share': [] };
  assert.equal(computeScores({ ...noData, 'radar-scores': [] }).aws.price_competitiveness, null);
  assert.equal(computeScores({ ...noData, 'radar-scores': [] }).aws.regional_coverage, null);
});

test('the recommendation matrix covers every workload and provider and matches recommendations.csv', () => {
  const rows = recommendationRows(data);
  assert.equal(rows.length, WORKLOADS.length * PROVIDER_IDS.length);
  const valid = new Set([...FIT_LEVELS.map((l) => l.id), 'n/a']);
  for (const r of rows) {
    assert.ok(valid.has(r.fit), r.fit);
    assert.ok(r.rationale.length > 10);
    if (r.fit !== 'n/a') assert.ok(toNumber(r.relative_index) > 0 && toNumber(r.relative_index) <= 100);
  }
  for (const w of WORKLOADS) assert.ok(rows.some((r) => r.workload_id === w.id && r.fit === 'best'), `${w.id} has a best fit`);
  assert.equal(recommendationsCsv(data), readFileSync(join(DATA_DIR, 'recommendations.csv'), 'utf8'));
  const csv = readCsv('recommendations.csv', DATA_DIR);
  assert.equal(csv.length, rows.length);
  assert.equal(fitFor(1), 'best');
  assert.equal(fitFor(0.9), 'good');
  assert.equal(fitFor(0.5), 'acceptable');
  assert.equal(fitFor(null), 'n/a');
  assert.equal(fitFor(NaN), 'n/a');
  const llm = llmAvailability(data['service-availability']);
  assert.deepEqual(PROVIDER_IDS.map((id) => llm[id].total), [18, 18, 18]);
  assert.equal(llm.azure.available, 12);
  const missing = recommendationRows({ ...data, 'reference-totals': [] }).filter((r) => r.workload_id === 'static-site');
  assert.ok(missing.every((r) => r.fit === 'n/a' && r.relative_index === 'n/a'));
  assert.ok(rows.filter((r) => r.workload_id === 'onboarding').every((r) => /for ease of use$/.test(r.rationale)));
  const zeroEditorial = { ...data, 'radar-scores': data['radar-scores'].map((r) => (r.axis === 'ease_of_use' ? { ...r, score: '0' } : r)) };
  const zeroRows = recommendationRows(zeroEditorial).filter((r) => r.workload_id === 'onboarding');
  assert.ok(zeroRows.every((r) => r.fit === 'n/a' && r.relative_index === 'n/a'));
});

test('pricing figures are indexed to the cheapest provider and keep the dollar price in the tooltip', () => {
  const s = specs['pricing-blocks'];
  assert.equal(s.categories.length, 12);
  for (let i = 0; i < s.categories.length; i++) {
    const col = s.series.map((x) => x.values[i]);
    assert.equal(Math.min(...col), 100, s.categories[i]);
  }
  assert.match(s.series[0].tips[0], /0\.1008 USD per hour/);
  const totals = specs['reference-totals'];
  assert.equal(totals.categories.length, 4);
  assert.ok(totals.series[2].values[0] > totals.series[1].values[0]);
  assert.match(renderCloudChart(totals), /\$995/);
});

test('footprint and availability grids count regions and show every state', () => {
  const fp = renderCloudChart(specs['region-footprint']);
  assert.match(fp, />58</);
  assert.match(fp, />43</);
  assert.match(fp, />34</);
  const av = renderCloudChart(specs['service-availability']);
  assert.match(av, /stroke-linejoin="round"/); // check marks
  assert.match(av, /not available/);
  assert.match(specs['service-availability'].desc, /as of 2026-10-26/);
  assert.equal(specs['service-availability'].groups.length, 6);
  const cells = specs['service-availability'].groups.flatMap((g) => g.rows.flatMap((r) => r.cells));
  assert.equal(cells.length, 6 * 3 * 6);
  assert.equal(cells.filter((c) => c.glyph === 'no').length, 13);
  assert.equal(cells.filter((c) => c.glyph === 'yes').length, 95);
});

test('wrapText, decimalYear and quarterYear behave on edge cases', () => {
  assert.deepEqual(wrapText('a bb ccc dddd', 6), ['a bb', 'ccc', 'dddd']);
  assert.deepEqual(wrapText('', 10), ['']);
  assert.deepEqual(wrapText('averyveryverylongword x', 5), ['averyveryverylongword', 'x']);
  assert.equal(decimalYear('2026-01-01'), 2026);
  assert.ok(Math.abs(decimalYear('2026-07') - 2026.5) < 1e-9);
  assert.equal(quarterYear('2024-Q3'), 2024.5);
  assert.equal(quarterYear('bad'), null);
  assert.deepEqual(sourceIds([{ source: 'b;a' }, { source: 'a' }, { source: '' }, {}]), ['a', 'b']);
});

test('renderers reject incomplete specs and addFooter grows the figure', () => {
  assert.throws(() => renderGroupedBarChart({ id: 'x' }), /missing "title"/);
  assert.throws(() => renderPanelBars({ id: 'x' }), /missing "title"/);
  assert.throws(() => renderGrid({ id: 'x' }), /missing "title"/);
  assert.throws(() => addFooter('<svg></svg>', 'x'), /viewBox/);
  assert.throws(() => renderCloudChart({ type: 'nope', id: 'x' }), /unknown chart type/);
  const base = renderCloudChart({ ...specs.radar, footer: undefined });
  const withFooter = addFooter(base, 'Sources: a, b. Data as of 2026-10-26.');
  const h = (svg) => Number(svg.match(/viewBox="0 0 \d+ (\d+)"/)[1]);
  assert.ok(h(withFooter) > h(base));
  assertWellFormed(withFooter);
  assert.equal(toCsv(['a', 'b'], [{ a: 'x,y', b: 'q"r' }]), 'a,b\n"x,y","q""r"\n');
  assert.equal(toCsv(['a'], [{ a: 'x\ry' }]), 'a\n"x\ry"\n');
  const noEditorial = { ...data, 'radar-scores': data['radar-scores'].filter((r) => r.axis !== 'ai_offering') };
  assert.throws(() => radarCsv(noEditorial), /no editorial row/);
});
