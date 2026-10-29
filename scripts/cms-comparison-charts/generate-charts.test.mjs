import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { toNumber } from '../language-charts/data-utils.mjs';
import { loadData, generateCharts, CHART_DEFINITIONS, FILE_PREFIX, DATA_FILES, DATA_DIR } from './generate-charts.mjs';
import { tcoComponents } from './chart-definitions.mjs';
import { renderCmsChart, decimalYear } from './renderers.mjs';
import {
  AXES, CMS, CMS_GROUP, CMS_NAMES, CMS_SLOT, COMPUTED_AXES, EDITORIAL_AXES, GROUPS, LAST_COMPLETE_YEAR, MIRROR_REPOS, SNAPSHOT, SNAPSHOT_YEAR,
  computeScores, ecosystemScore, growthScore, latestValue, leaderOf, logScore, totalStars,
} from './scores.mjs';

const data = loadData();
const specs = Object.fromEntries(CHART_DEFINITIONS.map((b) => b(data)).map((s) => [s.id, s]));
const sourceIds = new Set(data.sources.map((s) => s.id));

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

const TEXT_METRICS = /^(certification_programme|partner_programme|usage_limit_.*|tco_assumption_hosting_profile)$/;

/** Source ids of a row: the `source` column, or "source: a;b;" at the start of the notes (incidents, support windows). */
function idsOf(row) {
  if (row.source !== undefined) return row.source.split(';').map((s) => s.trim()).filter(Boolean);
  const m = /^source:\s*([a-z0-9;-]+)/.exec(row.notes ?? '');
  return m ? m[1].split(';').filter(Boolean) : [];
}

test('every data file loads and has rows', () => {
  for (const n of DATA_FILES) assert.ok(data[n].length > 0, `${n}.csv is empty`);
});

test('metric files share one schema, with a date, a number or n/a, a unit, a source and a retrieval date', () => {
  const header = ['platform', 'metric', 'item', 'date', 'value', 'unit', 'source', 'source_url', 'fetched', 'notes'];
  for (const n of ['popularity', 'talent', 'performance', 'security', 'cost']) {
    const first = readFileSync(join(DATA_DIR, `${n}.csv`), 'utf8').split('\n')[0].trim();
    assert.equal(first, header.join(','), `${n}.csv header`);
    for (const r of data[n]) {
      const where = `${n}.csv ${r.platform} ${r.metric} ${r.date}`;
      for (const c of ['platform', 'metric', 'date', 'value', 'unit', 'source', 'source_url', 'fetched']) assert.ok(r[c] !== undefined && r[c] !== '', `${where}: empty ${c}`);
      // Only descriptive rows (programmes, usage limits, hosting profiles) hold text; every other metric is a number or n/a.
      if (!TEXT_METRICS.test(r.metric)) assert.ok(r.value === 'n/a' || toNumber(r.value) !== null, `${where}: "${r.value}" is neither a number nor n/a`);
      else assert.ok(r.value !== '', where);
      if (r.value !== 'n/a') assert.match(r.source_url, /^(https:\/\/|modules\/)/, `${where} source_url`);
      assert.match(r.fetched, /^\d{4}-\d{2}-\d{2}$/, `${where} fetched`);
    }
  }
  const features = readFileSync(join(DATA_DIR, 'features.csv'), 'utf8').split('\n')[0].trim();
  assert.equal(features, 'platform,feature,value,source,source_url,fetched,notes');
  for (const r of data.features) assert.ok(['yes', 'partial', 'by extension', 'n/a'].includes(r.value), `features.csv ${r.platform} ${r.feature}: ${r.value}`);
});

test('every source id cited by a data row exists in sources.csv', () => {
  for (const n of ['popularity', 'talent', 'performance', 'security', 'cost', 'features', 'radar-scores', 'incidents', 'support-windows']) {
    for (const r of data[n]) {
      const ids = idsOf(r);
      assert.ok(ids.length > 0, `${n}.csv ${r.platform} ${r.metric ?? r.feature ?? r.axis ?? r.line ?? r.id}: no source id`);
      for (const id of ids) assert.ok(sourceIds.has(id), `${n}.csv cites unknown source id "${id}"`);
    }
  }
  assert.equal(new Set(data.sources.map((s) => s.id)).size, data.sources.length, 'duplicate source ids');
});

test('the compared CMSs are covered by every metric file and Shopify only by market share', () => {
  assert.equal(CMS.length, 16);
  for (const p of CMS) {
    for (const [file, metric] of [['popularity', 'w3techs_share_all_sites'], ['popularity', 'stackexchange_questions_total'], ['popularity', 'httparchive_origins_mobile'], ['performance', 'cwv_pass_mobile']]) {
      assert.ok(data[file].some((r) => r.platform === p && r.metric === metric), `${file}: ${p} lacks ${metric}`);
    }
    assert.ok(data.features.some((r) => r.platform === p), `features: ${p}`);
    assert.ok(data.cost.some((r) => r.platform === p), `cost: ${p}`);
  }
  assert.ok(data.popularity.some((r) => r.platform === 'shopify' && r.metric === 'w3techs_share_all_sites'));
  assert.ok(!data.security.some((r) => r.platform === 'shopify'));
});

test('n/a is never plotted as zero: missing rows become gaps or n/a labels', () => {
  assert.equal(toNumber('n/a'), null);
  // Payload has no HTTP Archive series: it is n/a in the data and null (not 0) in the specs.
  const payload = data.performance.find((r) => r.platform === 'payload' && r.metric === 'cwv_pass_mobile');
  assert.equal(payload.value, 'n/a');
  const i = specs['cwv-now'].categories.indexOf('Payload');
  assert.ok(i >= 0);
  for (const s of specs['cwv-now'].series) assert.equal(s.values[i], null);
  assert.match(renderCmsChart(specs['cwv-now']), /class="na"[^>]*>n\/a</);
  assert.ok(!specs['cwv-mobile-headless'].series.some((s) => s.name === 'Payload'), 'a CMS without any data has no line');
  assert.ok(!specs['origins-mobile-headless'].series.some((s) => s.name === 'Payload'));
  // Yearly series whose year is n/a keep a null point instead of zero.
  const wf = specs['w3techs-history'].series.find((s) => s.name === 'Webflow');
  assert.ok(wf.points.every((p) => p.y !== null && p.y > 0), 'Webflow has no point before 2019, not zeros');
  // Entry prices that are unverified, quote-only or euro-only are n/a labels.
  const plans = specs['cost-entry-plans'].items;
  for (const label of ['Contentful', 'AEM', 'Squarespace Basic', 'Umbraco Cloud Starter']) assert.equal(plans.find((p) => p.label === label).value, null, label);
  // Every numeric value that reaches a spec is finite; a zero comes only from a CSV row whose value is the number 0.
  const hasZero = new Set();
  for (const spec of Object.values(specs)) {
    const check = (v, where) => {
      if (v === null || v === undefined) return;
      assert.ok(Number.isFinite(v), `${spec.id} ${where}: ${v}`);
      if (v === 0) hasZero.add(spec.id);
    };
    for (const s of spec.series ?? []) {
      for (const p of s.points ?? []) check(p.y, `${s.name} y`);
      for (const v of s.values ?? []) check(v, `${s.name} value`);
    }
    for (const it of spec.items ?? []) check(it.value, `${it.label} value`);
  }
  for (const id of hasZero) {
    // Zeros are real: zero counts (CVEs, advisories, job mentions), free software, a scenario with no paid extensions,
    // or a computed score clamped at 0.
    assert.match(id, /^(cves|advisories|hn-job|cost-entry|tco|stackoverflow-questions|radar|scatter)/, `${id} plots a zero`);
  }
  assert.ok(data.security.some((r) => r.metric === 'nvd_cves_year' && r.value === '0'));
});

test('Core Web Vitals series cover 2020-01 to 2026-09 for the CMSs with data and the INP break is recorded', () => {
  for (const p of CMS.filter((id) => id !== 'payload')) {
    const rows = data.performance.filter((r) => r.platform === p && r.metric === 'cwv_pass_mobile' && toNumber(r.value) !== null);
    assert.ok(rows.length >= 60, `${p} has ${rows.length} months`);
    assert.equal(rows.at(-1).date, '2026-09');
    for (const r of rows) { const v = toNumber(r.value); assert.ok(v >= 0 && v <= 100); }
  }
  assert.ok(data.performance.some((r) => r.metric === 'cwv_definition_break' && r.date === '2024-03'));
  assert.equal(specs['cwv-mobile-traditional'].vlines.length, 1);
  assert.match(renderCmsChart(specs['cwv-mobile-traditional']), /INP replaces FID/);
});

test('every incident has a date, a KEV status and a score between 0 and 10 or n/a', () => {
  assert.ok(data.incidents.length >= 20);
  for (const i of data.incidents) {
    assert.match(i.source_url, /^https:\/\//);
    assert.match(i.date, /^\d{4}-\d{2}-\d{2}$/, i.id);
    if (i.cvss !== 'n/a') { const c = toNumber(i.cvss); assert.ok(c >= 0 && c <= 10, i.id); }
    assert.ok(['yes', 'no'].includes(i.kev), i.id);
    if (i.kev === 'yes') assert.match(i.kev_date, /^\d{4}-\d{2}-\d{2}$/);
  }
  for (const id of ['CVE-2018-7600', 'CVE-2025-32432', 'CVE-2025-54253']) assert.ok(data.incidents.some((i) => i.cve === id), id);
});

test('NVD series separate core from ecosystem and hosted CMSs have no CVE series', () => {
  const items = new Set(data.security.filter((r) => r.metric === 'nvd_cves_year').map((r) => r.item));
  for (const k of ['core:wordpress_cpe', 'ecosystem:wordpress_keyword', 'core:drupal_cpe', 'ecosystem:drupal_vendor_cpe', 'core:aem_cpe']) assert.ok(items.has(k), k);
  for (const p of ['webflow', 'wix', 'squarespace', 'contentful', 'sanity']) {
    for (const r of data.security.filter((x) => x.platform === p && x.metric === 'nvd_cves_year')) assert.equal(r.value, 'n/a', `${p} must not have a CVE count`);
  }
  assert.equal(specs['cves-core-traditional'].series.length, 5);
  assert.equal(specs['cves-core-other'].series.length, 5);
  assert.equal(specs['cves-ecosystem'].series.length, 5);
});

test('support windows have a start, a known phase and a valid order; open ends are drawn as open', () => {
  for (const r of data['support-windows']) {
    assert.ok(['standard', 'security', 'extended', 'elts'].includes(r.phase), `${r.platform} ${r.line} phase ${r.phase}`);
    if (r.start !== 'n/a' && r.end !== 'n/a') assert.ok(r.start < r.end, `${r.platform} ${r.line}: ${r.start} >= ${r.end}`);
  }
  const gantt = specs['support-windows-gantt'];
  const all = gantt.groups.flatMap((g) => g.rows.flatMap((r) => r.segments));
  assert.ok(all.some((s) => s.end === 'open'), 'an open-ended window exists');
  for (const s of all) {
    if (s.end !== 'open') assert.ok(decimalYear(s.start) < decimalYear(s.end), `${s.start} ${s.end}`);
  }
  const svg = renderCmsChart(gantt);
  assertWellFormed(svg);
  assert.match(svg, /no end date announced/);
});

test('radar score rows use known editorial axes, 0-10 or n/a values, and a basis with a source id', () => {
  const axes = new Set(AXES.map(([k]) => k));
  assert.equal(AXES.length, 12);
  assert.deepEqual([...COMPUTED_AXES, ...EDITORIAL_AXES].sort(), [...axes].sort());
  for (const r of data['radar-scores']) {
    assert.ok(EDITORIAL_AXES.includes(r.axis), `unknown or computed axis ${r.axis}`);
    assert.ok(CMS.includes(r.platform), r.platform);
    assert.equal(r.kind, 'editorial');
    if (r.score !== 'n/a') { const v = toNumber(r.score); assert.ok(v !== null && v >= 0 && v <= 10, `${r.platform}/${r.axis}`); } else assert.match(r.basis, /n\/a/);
    assert.ok(r.basis.length > 40, `${r.platform}/${r.axis} needs a basis`);
    assert.ok(idsOf(r).length > 0, `${r.platform}/${r.axis} needs a source id`);
    assert.match(r.source_url, /^(https:\/\/|modules\/)/);
  }
  assert.equal(data['radar-scores'].length, CMS.length * EDITORIAL_AXES.length);
  const seen = new Set(data['radar-scores'].map((r) => `${r.platform}/${r.axis}`));
  assert.equal(seen.size, data['radar-scores'].length, 'duplicate radar rows');
});

test('computed scores stay within 0-10 and a missing input gives null, never zero', () => {
  const scores = computeScores(data);
  for (const p of CMS) for (const [key] of AXES) {
    const v = scores[p][key];
    assert.ok(v === null || (v >= 0 && v <= 10), `${p}/${key}: ${v}`);
  }
  for (const p of CMS) for (const k of ['talent', 'ecosystem']) assert.ok(scores[p][k] !== null, `${p}/${k}`);
  assert.equal(scores.payload.performance, null);
  assert.equal(scores.payload.popularity, null);
  assert.equal(scores.payload.growth, null);
  assert.equal(scores.contentful.cost, null);
  assert.ok(scores.wordpress.popularity > scores.drupal.popularity);
  assert.ok(scores.wix.performance > scores.wordpress.performance);
  assert.ok(scores.sanity.growth > 5 && scores.joomla.growth < 5);
});

test('score formulas', () => {
  assert.equal(logScore(0.01, 0.01, 50), 0);
  assert.equal(logScore(50, 0.01, 50), 10);
  assert.equal(logScore(1e9, 1, 10), 10);
  assert.equal(logScore(0, 1, 10), null);
  assert.equal(logScore('n/a', 1, 10), null);
  const rows = [
    { platform: 'x', metric: 'httparchive_origins_mobile', date: '2023-09', value: '100' },
    { platform: 'x', metric: 'httparchive_origins_mobile', date: '2026-09', value: '200' },
    { platform: 'y', metric: 'httparchive_origins_mobile', date: '2026-09', value: '200' },
  ];
  assert.equal(growthScore(rows, 'x'), 10);
  assert.equal(growthScore(rows, 'y'), null);
  assert.equal(latestValue(data.performance, 'payload', 'cwv_pass_mobile'), null);
});

test('groups partition the CMSs, slots are unique inside a group and each group has a leader', () => {
  assert.equal(GROUPS.flatMap((g) => g.members).length, CMS.length);
  for (const g of GROUPS) {
    const slots = g.members.map((id) => CMS_SLOT[id]);
    assert.equal(new Set(slots).size, slots.length, g.id);
    assert.ok(Math.max(...slots) < 8);
    for (const id of g.members) { assert.equal(CMS_GROUP[id], g.id); assert.ok(CMS_NAMES[id]); }
  }
  const scores = computeScores(data);
  assert.equal(leaderOf(GROUPS[0], scores), 'wordpress');
  assert.equal(specs['radar-mainstream'].series.length, GROUPS.length);
  assert.deepEqual(specs['radar-wordpress-webflow'].series.map((s) => s.name), ['WordPress', 'Webflow']);
});

test('every chart definition has the fields its renderer needs and renders to well-formed SVG', () => {
  assert.ok(Object.keys(specs).length >= 40);
  assert.equal(new Set(CHART_DEFINITIONS.map((b) => b(data).id)).size, CHART_DEFINITIONS.length, 'duplicate chart ids');
  for (const spec of Object.values(specs)) {
    assert.match(spec.id, /^[a-z0-9-]+$/);
    assert.ok(spec.title && spec.desc && spec.footer, spec.id);
    assert.match(spec.footer, /retrieved 2026-10-29/, spec.id);
    assert.match(spec.footer, /scripts\/cms-comparison-charts\/data\//, spec.id);
    assertWellFormed(renderCmsChart(spec));
  }
});

test('radar charts use twelve axes and draw gaps for missing scores', () => {
  for (const id of ['radar-traditional', 'radar-hosted', 'radar-headless', 'radar-enterprise', 'radar-wordpress-webflow', 'radar-mainstream']) {
    assert.equal(specs[id].axes.length, 12, id);
  }
  const headless = specs['radar-headless'];
  const payload = headless.series.find((s) => s.name === 'Payload');
  assert.equal(payload.values[AXES.findIndex(([k]) => k === 'performance')], null);
  assertWellFormed(renderCmsChart(headless));
});

test('scatter charts plot only CMSs with both scores', () => {
  for (const id of ['scatter-popularity-growth', 'scatter-performance-ease', 'scatter-cost-features']) {
    const spec = specs[id];
    assert.equal(spec.series.length, GROUPS.length);
    const svg = renderCmsChart(spec);
    assertWellFormed(svg);
    const plotted = spec.series.flatMap((s) => s.points).filter((p) => toNumber(p.x) !== null && toNumber(p.y) !== null);
    assert.equal((svg.match(/<title>[^<]*<\/title><(circle|rect|path)/g) ?? []).length, plotted.length, id);
    assert.ok(plotted.length < CMS.length, `${id}: at least one CMS lacks a score`);
  }
});

test('generateCharts writes one cms-comparison-<id>.svg per definition', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cms-charts-'));
  try {
    const files = generateCharts(CHART_DEFINITIONS, data, dir);
    assert.equal(files.length, CHART_DEFINITIONS.length);
    const written = readdirSync(dir).sort();
    assert.equal(written.length, files.length);
    for (const f of written) assert.match(f, new RegExp(`^${FILE_PREFIX}[a-z0-9-]+\\.svg$`));
    for (const id of Object.keys(specs)) assert.ok(written.includes(`${FILE_PREFIX}${id}.svg`), id);
    assert.equal(readFileSync(join(dir, `${FILE_PREFIX}cwv-now.svg`), 'utf8'), renderCmsChart(specs['cwv-now']));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('the committed images match the generator output', { skip: !existsSync(new URL('../../modules/ROOT/images/cms-comparison-cwv-now.svg', import.meta.url)) }, () => {
  for (const [id, spec] of Object.entries(specs)) {
    const file = new URL(`../../modules/ROOT/images/${FILE_PREFIX}${id}.svg`, import.meta.url);
    assert.ok(existsSync(file), `${id} is not generated into modules/ROOT/images`);
    assert.equal(readFileSync(file, 'utf8'), renderCmsChart(spec), `${id} is stale: run npm run charts:cms-comparison`);
  }
});

test('year ranges follow the snapshot date', () => {
  assert.equal(SNAPSHOT_YEAR, Number(SNAPSHOT.slice(0, 4)));
  const cves = specs['cves-core-traditional'];
  assert.equal(Math.max(...cves.series[0].points.map((p) => p.x)), SNAPSHOT_YEAR);
  assert.match(cves.xLabel, new RegExp(SNAPSHOT));
  assert.equal(Math.max(...specs['stackoverflow-questions-traditional'].series[0].points.map((p) => p.x)), LAST_COMPLETE_YEAR);
});

test('the ecosystem score leaves out mirror repositories and the GitHub charts show one repository per CMS', () => {
  const rows = [
    { platform: 'x', metric: 'github_stars', item: MIRROR_REPOS[0], date: SNAPSHOT, value: '50000' },
    { platform: 'x', metric: 'github_stars', item: 'x/main', date: SNAPSHOT, value: '1000' },
  ];
  assert.equal(totalStars(rows, 'x'), 1000);
  for (const p of ['wordpress', 'drupal', 'typo3']) assert.equal(totalStars(data.popularity, p), null, p);
  assert.equal(ecosystemScore(data.popularity, 'wordpress'), logScore(latestValue(data.popularity, 'wordpress', 'stackexchange_questions_total'), 1e2, 3e5));
  for (const id of ['github-stars', 'github-contributors']) {
    const labels = specs[id].items.map((i) => i.label);
    assert.ok(!labels.includes('WordPress/wordpress-develop'), id);
    assert.equal(labels.filter((l) => l.startsWith('WordPress/')).length, 1, id);
  }
});

test('an unknown support-window phase is an error, not standard support', () => {
  const build = CHART_DEFINITIONS.find((b) => b(data).id === 'support-windows-gantt');
  const bad = { ...data, 'support-windows': [{ ...data['support-windows'][0], phase: 'lts' }] };
  assert.throws(() => build(bad), /unknown phase "lts"/);
});

test('the 3-year TCO adds labour, extensions and converted hosting, and a missing rate gives no total', () => {
  const rows = tcoComponents(data);
  assert.equal(rows.length, 4);
  for (const r of rows) {
    assert.ok(r.labour > 0 && r.hosting > 0 && r.extensions >= 0, r.item);
    assert.ok(Math.abs(r.total - (r.labour + r.extensions + r.hosting)) < 1e-6, r.item);
  }
  assert.equal(rows[0].labour, 2 * 60 * 36);
  const noRate = { ...data, cost: data.cost.filter((r) => r.metric !== 'ecb_reference_rate_usd_per_eur') };
  for (const r of tcoComponents(noRate)) { assert.equal(r.hosting, null); assert.equal(r.total, null); }
});
