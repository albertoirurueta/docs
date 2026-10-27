import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { toNumber } from '../language-charts/data-utils.mjs';
import { loadData, generateCharts, CHART_DEFINITIONS, FILE_PREFIX, DATA_FILES } from './generate-charts.mjs';
import { renderEcommerceChart, decimalYear, yearMonthLabel } from './renderers.mjs';
import { quarterYear } from './chart-definitions.mjs';
import {
  AXES, COMPUTED_AXES, PLATFORMS, PLATFORM_SLOT, computeScores, logScore, latestValue, performanceScore, ecosystemScore,
} from './scores.mjs';

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

test('every data file loads, has rows and the shared columns', () => {
  for (const n of DATA_FILES) assert.ok(data[n].length > 0, `${n}.csv is empty`);
  for (const n of ['popularity', 'performance', 'security', 'cost']) {
    for (const r of data[n]) {
      for (const c of ['platform', 'metric', 'date', 'value', 'unit', 'source_url', 'fetched']) assert.ok(r[c] !== undefined && r[c] !== '', `${n}.csv ${r.metric}: empty ${c}`);
      assert.match(r.source_url, /^https:\/\//, `${n}.csv ${r.metric} source_url`);
      assert.match(r.fetched, /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test('values are numbers or the n/a marker, never an empty cell or zero standing in for missing data', () => {
  for (const n of ['popularity', 'performance', 'security', 'cost']) {
    for (const r of data[n]) assert.ok(r.value === 'n/a' || toNumber(r.value) !== null, `${n}.csv ${r.metric} ${r.date}: "${r.value}"`);
  }
  for (const r of data.cost.filter((c) => /^(g2|capterra)_rating$/.test(c.metric))) {
    assert.equal(r.value, 'n/a');
    assert.match(r.notes, /unverified/);
  }
});

test('all four platforms have data for each main metric', () => {
  const need = [['popularity', 'storeleads_live_stores'], ['popularity', 'httparchive_origins_mobile'], ['popularity', 'w3techs_share_all_sites'], ['popularity', 'github_stars'],
    ['performance', 'cwv_pass_mobile'], ['performance', 'cwv_pass_desktop'], ['performance', 'lighthouse_performance_mobile'], ['performance', 'webalmanac_good_lcp_mobile']];
  for (const [file, metric] of need) for (const p of PLATFORMS) assert.ok(data[file].some((r) => r.platform === p && r.metric === metric), `${file}: ${p} lacks ${metric}`);
});

test('the Core Web Vitals series cover 2020-01 to 2026-09 and the INP break is recorded', () => {
  for (const p of PLATFORMS) {
    const rows = data.performance.filter((r) => r.platform === p && r.metric === 'cwv_pass_mobile');
    assert.equal(rows.length, 81);
    assert.equal(rows[0].date, '2020-01');
    assert.equal(rows.at(-1).date, '2026-09');
    for (const r of rows) { const v = toNumber(r.value); assert.ok(v >= 0 && v <= 100); }
  }
  assert.ok(data.performance.some((r) => r.metric === 'cwv_definition_break' && r.date === '2024-03'));
  assert.equal(specs['cwv-mobile'].vlines.length, 1);
  assert.match(renderEcommerceChart(specs['cwv-mobile']), /INP replaces FID/);
});

test('HTTP Archive snapshot values match the re-verified figures', () => {
  const v = (p, m) => latestValue(data.performance, p, m);
  assert.equal(Math.floor(v('shopify', 'cwv_pass_mobile') * 10) / 10, 76.2);
  assert.equal(Math.floor(v('woocommerce', 'cwv_pass_mobile') * 10) / 10, 39.3);
  assert.equal(v('prestashop', 'lighthouse_performance_mobile'), 0.345);
  assert.equal(latestValue(data.popularity, 'woocommerce', 'storeleads_live_stores'), 4321090);
});

test('every incident has a CVSS score, a date and a KEV status, except Magecart which has no CVE', () => {
  assert.ok(data.incidents.length >= 8);
  for (const i of data.incidents) {
    assert.match(i.source_url, /^https:\/\//);
    if (i.id === 'magecart') { assert.equal(i.cvss, 'n/a'); assert.equal(i.kev, 'n/a'); continue; }
    const c = toNumber(i.cvss);
    assert.ok(c >= 0 && c <= 10, i.id);
    assert.ok(['yes', 'no'].includes(i.kev), i.id);
    if (i.kev === 'yes') assert.match(i.kev_date, /^\d{4}-\d{2}-\d{2}$/);
  }
  for (const id of ['CVE-2022-24086', 'CVE-2024-34102', 'CVE-2025-54236', 'CVE-2022-31181', 'CVE-2023-28121']) assert.ok(data.incidents.some((i) => i.cve === id), id);
});

test('NVD series are separate for core and ecosystem and Shopify has no platform series', () => {
  const items = new Set(data.security.filter((r) => r.metric === 'nvd_cves_year').map((r) => r.item));
  for (const k of ['core:prestashop_core_cpe', 'core:magento_union', 'core:woocommerce_core_cpe', 'ecosystem:woocommerce_vendor_cpe', 'ecosystem:keyword_woocommerce', 'ecosystem:shopify_vendor_cpe', 'core:shopify_platform']) assert.ok(items.has(k), k);
  assert.equal(data.security.find((r) => r.item === 'core:shopify_platform').value, 'n/a');
  assert.equal(specs['cves-core'].series.length, 3);
  assert.equal(specs['cves-ecosystem'].series.length, 4);
});

test('radar score rows use known hand-scored axes, 0-10 values and a basis with a source', () => {
  const axes = new Set(AXES.map(([k]) => k));
  assert.equal(AXES.length, 10);
  for (const r of data['radar-scores']) {
    assert.ok(axes.has(r.axis), `unknown axis ${r.axis}`);
    assert.ok(!COMPUTED_AXES.includes(r.axis), `${r.axis} is computed`);
    const v = toNumber(r.score);
    assert.ok(v !== null && v >= 0 && v <= 10, `${r.platform}/${r.axis}`);
    assert.ok(r.basis.length > 20, `${r.platform}/${r.axis} needs a basis`);
    assert.match(r.source_url, /^https:\/\//);
  }
  assert.equal(data['radar-scores'].length, PLATFORMS.length * (AXES.length - COMPUTED_AXES.length));
});

test('computed scores cover every axis for the four platforms and stay within 0-10', () => {
  const scores = computeScores(data);
  for (const p of PLATFORMS) for (const [key] of AXES) {
    const v = scores[p][key];
    assert.ok(typeof v === 'number' && v >= 0 && v <= 10, `${p}/${key} = ${v}`);
  }
  assert.ok(scores.shopify.performance > scores.woocommerce.performance);
  assert.ok(scores.woocommerce.ecosystem > scores.prestashop.ecosystem);
});

test('logScore is log scaled and clamped; performance and ecosystem need data', () => {
  assert.equal(logScore(100, 100, 1e5), 0);
  assert.equal(logScore(1e5, 100, 1e5), 10);
  assert.equal(logScore(10, 100, 1e5), 0);
  assert.equal(logScore(1e7, 100, 1e5), 10);
  assert.equal(logScore('n/a', 100, 1e5), null);
  assert.equal(logScore(0, 100, 1e5), null);
  assert.equal(performanceScore([], 'shopify'), null);
  assert.equal(ecosystemScore([], 'shopify'), null);
});

test('decimalYear, yearMonthLabel and quarterYear round trip', () => {
  assert.equal(decimalYear('2026-01-01'), 2026);
  assert.ok(Math.abs(decimalYear('2026-07') - 2026.5) < 1e-9);
  for (const m of ['2025-01', '2025-06', '2026-12']) assert.equal(yearMonthLabel(decimalYear(m)), m);
  assert.equal(quarterYear('2026-Q3'), 2026.5);
  assert.equal(quarterYear('bad'), null);
});

test('every chart definition renders a well-formed SVG with legend, title, desc, caption and axis labels', () => {
  const ids = new Set();
  for (const b of CHART_DEFINITIONS) {
    const spec = b(data);
    assert.ok(!ids.has(spec.id), `duplicate id ${spec.id}`);
    ids.add(spec.id);
    const svg = renderEcommerceChart(spec);
    assertWellFormed(svg);
    assert.match(svg, /var\(--bg\)/);
    assert.match(svg, /class="footer"/);
    assert.match(svg, /retrieved 2026-10-27/);
    if (spec.type !== 'slotradar') assert.match(svg, /axis-label/);
  }
  assert.equal(ids.size, 30);
});

test('one colour slot per platform in every figure', () => {
  for (const spec of Object.values(specs)) {
    for (const s of spec.series ?? []) {
      if (s.slot === undefined) continue;
      const first = (s.name.match(/^(Shopify|PrestaShop|Magento|WooCommerce|WordPress|@shopify|@woocommerce|magento\.|wordpress\.)/i) ?? [''])[0].toLowerCase();
      const expected = /shopify/.test(first) ? 0 : /prestashop/.test(first) ? 1 : /magento/.test(first) ? 2 : /woo/.test(first) ? 3 : /wordpress/.test(first) ? 4 : null;
      if (spec.id === 'advisories-year' || spec.id === 'stackexchange-sites') continue;
      if (expected !== null) assert.equal(s.slot, expected, `${spec.id}: ${s.name}`);
    }
  }
  assert.deepEqual(PLATFORMS.map((p) => PLATFORM_SLOT[p]), [0, 1, 2, 3]);
  assert.match(renderEcommerceChart(specs['radar-woocommerce']), /class="a3"/);
});

test('missing values are n/a, not zero', () => {
  const adobe = specs['cost-monthly'].items.find((i) => i.label === 'Adobe Commerce');
  assert.equal(adobe.value, null);
  assert.match(renderEcommerceChart(specs['cost-monthly']), /n\/a \(quote-based\)/);
  assert.equal(specs['cost-card-rates'].items.find((i) => i.label === 'PrestaShop').value, null);
  const w3 = specs['w3techs-history'];
  assert.deepEqual(w3.series.map((s) => s.name.split(' ')[0]), ['Shopify', 'WordPress']);
});

test('Gantt charts have rows for every release line and an open end for PrestaShop 8.2 and 9.2', () => {
  const g = specs['release-support-gantt'];
  const rows = g.groups.flatMap((x) => x.rows.map((r) => r.label));
  for (const l of ['8.2', '9.2', '2.4.5', '2.4.9', '2025-01', '2026-10']) assert.ok(rows.includes(l), l);
  assert.ok(g.groups[0].rows.find((r) => r.label === '8.2').segments.some((s) => s.end === 'open'));
  assert.ok(specs['woocommerce-release-gantt'].groups[0].rows.length >= 25);
  assert.match(renderEcommerceChart(g), /check date 2026-10-27/);
});

test('generateCharts writes one prefixed SVG per definition and is deterministic', () => {
  const a = mkdtempSync(join(tmpdir(), 'ecom-charts-a-'));
  const b = mkdtempSync(join(tmpdir(), 'ecom-charts-b-'));
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
