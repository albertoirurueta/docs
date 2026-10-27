#!/usr/bin/env node
// Dependency-free AsciiDoc table generator for the backend and web frameworks comparison pages. Reads the CSVs in ./data
// and writes the table partials to modules/ROOT/partials/backend-frameworks-comparison/ and
// modules/ROOT/partials/web-frameworks-comparison/, which the pages include. Cell helpers come from
// scripts/language-charts/generate-tables.mjs.
// Usage: node scripts/framework-charts/generate-tables.mjs [--out <dir>]   (the dir gets backend/ and web/ subfolders)
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pass, raw, renderTable, thousands, score, sourceLink, escapeHtml } from '../language-charts/generate-tables.mjs';
import { isMissing, toNumber } from '../language-charts/data-utils.mjs';
import { loadData } from './generate-charts.mjs';
import { AXES, RADAR_GROUPS, AXIS_LABELS, axisLabel, frameworkIndex, frameworksOf, num } from './frameworks.mjs';
import { bestRps, computeScores, fortunesRps } from './scores.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PARTIALS = resolve(HERE, '..', '..', 'modules', 'ROOT', 'partials');
export const DEFAULT_TABLES_DIRS = { backend: join(PARTIALS, 'backend-frameworks-comparison'), web: join(PARTIALS, 'web-frameworks-comparison') };
const CSS = RADAR_GROUPS.web.find((g) => g.id === 'css').members;

// ---------------------------------------------------------------- cells
/** Framework name: xref to its site section, else a link to its official website. */
export function nameCell(f, id = '') {
  if (!f) return pass(id === 'vanillajs' ? 'vanilla JavaScript (baseline)' : id);
  const name = String(f.name).replace(/\+/g, '{plus}').replace(/\]/g, '\\]');
  if (!isMissing(f.site_xref) && f.site_xref) return `xref:${f.site_xref}[${name}]`;
  if (!isMissing(f.website)) return `link:++${f.website}++[${name}]`;
  return pass(f.name);
}
const pct = (v) => { const n = toNumber(v); return n === null ? 'n/a' : `${n.toFixed(1)}%`; };
const mega = (v) => { const n = toNumber(v); return n === null ? 'n/a' : `${(n / 1e6).toFixed(1)}M`; };
const kilo = (v) => { const n = toNumber(v); return n === null ? 'n/a' : `${Math.round(n / 1000).toLocaleString('en-US')}k`; };
const dec = (v, d = 1) => { const n = toNumber(v); return n === null ? 'n/a' : n.toFixed(d); };
const srcs = (ids) => [...new Set(ids.filter((x) => !isMissing(x)))].map((id) => sourceLink(id)).join(', ') || 'n/a';
const metric = (rows, id, m, extra = () => true) => rows.find((r) => r.framework_id === id && r.metric === m && extra(r));

// ---------------------------------------------------------------- tables
export function scopeTable(data, page) {
  const rows = frameworksOf(data, page).map((f) => [nameCell(f), pass(f.group), pass(f.language), raw(f.first_release), pass(f.status), pass(f.licence), pass(f.governance_body), !isMissing(f.site_xref) && f.site_xref ? 'yes' : 'no']);
  return renderTable({ caption: `Frameworks compared on this page (${rows.length}); first release, licence and governance from frameworks.csv (${srcs(['npm-registry', 'pypi-json', 'packagist', 'maven-central', 'official-websites'])})`, cols: '3,2,2,2,1,2,3,1', header: ['Framework', 'Group', 'Language', 'First release', 'Status', 'Licence', 'Governance', 'On this site'], rows });
}
export function popularityTable(data, page) {
  const ids = frameworksOf(data, page).map((f) => f.id);
  const P = data.popularity; const G = frameworkIndex(data);
  const has = (id) => P.some((r) => r.framework_id === id && !isMissing(r.value)) || data.github.some((r) => r.framework_id === id && !isMissing(r.stars));
  const web = page === 'web';
  const header = ['Framework', 'SO usage 2025', 'SO admired', 'SO desired', 'State of JS usage 2025', 'State of JS retention', 'JetBrains 2023 (own language)', 'GitHub stars', ...(web ? ['HTTP Archive origins', 'W3Techs sites'] : [])];
  const rows = ids.filter(has).map((id) => [nameCell(G[id]), pct(metric(P, id, 'so_usage_all')?.value), pct(metric(P, id, 'so_admired')?.value), pct(metric(P, id, 'so_desired')?.value), pct(metric(P, id, 'sojs_usage')?.value), pct(metric(P, id, 'sojs_retention')?.value), pct(metric(P, id, 'jetbrains_share')?.value), kilo(data.github.find((r) => r.framework_id === id)?.stars), ...(web ? [kilo(metric(P, id, 'httparchive_origins_mobile')?.value), pct(metric(P, id, 'w3techs_sites_pct')?.value)] : [])]);
  return renderTable({ caption: `Popularity signals (${srcs(['so-2025', 'state-of-js', 'jetbrains-2023', 'deps-dev', ...(web ? ['httparchive-techreport', 'w3techs-js', 'w3techs-css'] : [])])}); JetBrains shares are within each language and not comparable across languages`, cols: web ? '3,1,1,1,1,1,1,1,1,1' : '3,1,1,1,1,1,1,1', header, rows });
}
export function downloadsTable(data, page) {
  const ids = new Set(frameworksOf(data, page).map((f) => f.id)); const G = frameworkIndex(data);
  const REG = [['downloads-npm', 'npm', 'last-12-months', '12 months to 2026-06'], ['downloads-pypi', 'PyPI', 'last-30-days', 'last 30 days'], ['downloads-packagist', 'Packagist', 'last-30-days', 'last 30 days'], ['downloads-nuget', 'NuGet', 'total', 'total'], ['downloads-crates', 'crates.io', 'last-90-days', 'last 90 days'], ['downloads-hex', 'Hex', 'last-90-days', 'last 90 days'], ['downloads-rubygems', 'RubyGems', 'total', 'total']];
  const rows = [];
  for (const [file, reg, period, label] of REG) {
    for (const r of data[file].filter((x) => ids.has(x.framework_id) && x.period === period).sort((a, b) => (num(b.value) ?? -1) - (num(a.value) ?? -1))) rows.push([nameCell(G[r.framework_id]), pass(reg), `+++${escapeHtml(r.package)}+++`, pass(label), mega(r.value), r.primary === 'yes' ? 'yes' : 'no', sourceLink(r.source)]);
  }
  return renderTable({ caption: 'Registry downloads: compare only within one registry (units and periods differ)', cols: '3,1,3,2,1,1,2', header: ['Framework', 'Registry', 'Package', 'Period', 'Downloads', 'Primary', 'Source'], rows });
}
export function talentTable(data, page) {
  const ids = frameworksOf(data, page).map((f) => f.id); const G = frameworkIndex(data);
  const J = data.jobs; const H = data['jobs-history'];
  const rows = ids.filter((id) => J.some((r) => r.framework_id === id && !isMissing(r.value))).map((id) => [nameCell(G[id]), pct(metric(J, id, 'talent_pool_so_usage_all')?.value), pct(metric(J, id, 'talent_pool_so_usage_prof')?.value), pct(H.find((r) => r.framework_id === id && r.year === '2025')?.value), pct(H.find((r) => r.framework_id === id && r.year === '2020')?.value), pct(H.find((r) => r.framework_id === id && r.year === '2015')?.value), 'n/a']);
  return renderTable({ caption: `Talent pool and job demand (${srcs(['so-2025', 'hn-whoishiring'])}); salary by framework is not published by any source`, cols: '3,1,1,1,1,1,1', header: ['Framework', 'SO 2025 all respondents', 'SO 2025 professionals', 'HN hiring 2025', 'HN hiring 2020', 'HN hiring 2015', 'Salary'], rows });
}
export function ecosystemTable(data, page) {
  const ids = frameworksOf(data, page).map((f) => f.id); const G = frameworkIndex(data);
  const rows = ids.map((id) => { const e = data.ecosystem.find((r) => r.framework_id === id); return [nameCell(G[id]), raw(G[id].first_release), pass(e.latest_version), raw(e.latest_release_date), raw(e.majors_last_5y), raw(e.releases_last_12m), pass(e.current_cycle), raw(e.current_cycle_eol), raw(e.has_lts), e.extension_ecosystem_size === 'n/a' ? 'n/a' : `${thousands(e.extension_ecosystem_size)} ${escapeHtml(e.extension_ecosystem_metric)}`]; });
  return renderTable({ caption: `Ecosystem and maturity (${srcs(['npm-registry', 'pypi-json', 'packagist', 'maven-central', 'nuget-registration', 'crates-io', 'endoflife-date'])}); majors count first stable releases of each major version (1 or later) since 2021-10-27`, cols: '3,1,2,2,1,1,1,2,1,2', header: ['Framework', 'First release', 'Latest version', 'Latest release', 'Majors in 5 years', 'Releases in 12 months', 'Current cycle', 'Cycle end of life', 'LTS', 'Extension ecosystem'], rows });
}
const FEAT = { backend: [['orm_migrations', 'ORM and migrations'], ['admin', 'Admin'], ['authentication', 'Auth'], ['validation', 'Validation'], ['background_jobs', 'Jobs'], ['templating', 'Templates'], ['openapi', 'OpenAPI'], ['testing', 'Testing'], ['cli_scaffolding', 'CLI'], ['hot_reload', 'Hot reload'], ['type_safety', 'Type safety']], web: [['rendering', 'Rendering model'], ['router', 'Router'], ['state_management', 'State'], ['forms_validation', 'Forms'], ['typescript', 'TypeScript'], ['cli_scaffolding', 'CLI'], ['hot_reload', 'Hot reload'], ['testing', 'Testing']] };
export function featureMatrix(data, page) {
  const P = data.productivity.filter((r) => r.page_kind === page && r.feature !== 'all'); const G = frameworkIndex(data);
  const ids = [...new Set(P.map((r) => r.framework_id))];
  const cell = (r) => { if (!r || isMissing(r.value)) return 'n/a'; const v = escapeHtml(r.value); return r.site_page ? `xref:${r.site_page}[${v}]` : v; };
  const rows = ids.map((id) => [nameCell(G[id]), ...FEAT[page].map(([f]) => cell(P.find((r) => r.framework_id === id && r.feature === f)))]);
  return renderTable({ caption: `Feature matrix for the frameworks documented on this site (${srcs(['site-pages', 'editorial'])}): yes = built in or official first-party module, partial = limited or optional official add-on, no = not provided by the framework; each yes or partial links to the page that documents it`, cols: `3,${FEAT[page].map(() => 1).join(',')}`, header: ['Framework', ...FEAT[page].map(([, l]) => l)], rows });
}
export function performanceTable(data, page) {
  const G = frameworkIndex(data);
  if (page === 'backend') {
    const T = data['performance-techempower'].filter((r) => r.round === '23');
    const ids = [...new Set(T.filter((r) => !isMissing(r.rps)).map((r) => r.framework_id))];
    const rows = ids.sort((a, b) => (fortunesRps(data, b) ?? -1) - (fortunesRps(data, a) ?? -1)).map((id) => [nameCell(G[id]), ...['json', 'single_query', 'multiple_queries', 'fortunes', 'plaintext'].map((t) => thousands(bestRps(data, id, t))), pass(T.filter((r) => r.framework_id === id && !isMissing(r.implementation)).map((r) => r.implementation).filter((v, i, a) => a.indexOf(v) === i).join(', '))]);
    return renderTable({ caption: `TechEmpower round 23 (Citrine, run 2025-01-30, last round), responses per second, best variant (${sourceLink('techempower-r23')})`, cols: '3,2,2,2,2,2,3', header: ['Framework', 'JSON', 'Single query', 'Multiple queries (20)', 'Fortunes', 'Plaintext', 'Implementations'], rows });
  }
  const W = data['performance-web'];
  const ids = [...new Set(W.map((r) => r.framework_id))].filter((id) => !CSS.includes(id));
  const v = (id, m) => W.find((r) => r.framework_id === id && r.metric === m)?.value;
  const rows = ids.map((id) => [nameCell(G[id], id), dec(v(id, 'jsfb_cpu_weighted_geomean'), 2), dec(v(id, 'jsfb_memory_geomean'), 2), dec(v(id, 'jsfb_size_compressed_kb')), dec(v(id, 'runtime_min_gzip_kb')), dec(v(id, 'jsfb_first_paint_ms')), pct(v(id, 'cwv_good_mobile_pct')), pct(v(id, 'cwv_good_desktop_pct'))]);
  return renderTable({ caption: `Web performance (${srcs(['js-framework-benchmark', 'bundlephobia', 'httparchive-techreport'])}); js-framework-benchmark factors are relative to the fastest keyed implementation (Chrome 156)`, cols: '3,1,1,1,1,1,1,1', header: ['Framework', 'CPU factor', 'Memory factor', 'Benchmark app (kB, brotli)', 'Runtime (kB, min+gzip)', 'First paint (ms)', 'CWV good, mobile', 'CWV good, desktop'], rows });
}
export function startupMemoryTable(data) {
  const G = frameworkIndex(data);
  const rows = data['performance-startup-memory'].map((r) => [nameCell(G[r.framework_id]), pass(r.variant), pass(r.metric.replace(/_/g, ' ')), isMissing(r.value) ? 'n/a' : `${thousands(r.value)} ${escapeHtml(r.unit)}`, pass(r.kind), pass(r.publisher), sourceLink(r.source), pass(r.note)]);
  return renderTable({ caption: 'Published startup, memory and throughput figures (no house measurements); vendor-reported figures are labelled', cols: '2,1,2,1,2,2,1,4', header: ['Framework', 'Variant', 'Metric', 'Value', 'Kind', 'Publisher', 'Source', 'Note'], rows });
}
export function concurrencyTable(data) {
  const G = frameworkIndex(data);
  const rows = data.concurrency.filter((r) => !isMissing(r.model)).map((r) => [nameCell(G[r.framework_id]), pass(r.model), pass(r.blocking_io), pass(r.cpu_bound), r.site_page ? `xref:${r.site_page}[site page]` : sourceLink(r.source)]);
  return renderTable({ caption: 'Concurrency model per framework (each row confirmed by a site page or the official website)', cols: '3,4,3,3,2', header: ['Framework', 'Model', 'Blocking I/O', 'CPU-bound work', 'Evidence'], rows });
}
export function otherMetricsTable(data, page) {
  const ids = frameworksOf(data, page).map((f) => f.id); const G = frameworkIndex(data); const S = data.security;
  const adv5 = (id) => {
    // n/a years are never counted as zero: all missing gives n/a, some missing marks the sum as a lower bound.
    const v = S.filter((x) => x.framework_id === id && x.metric === 'advisories' && Number(x.period) >= 2021 && Number(x.period) <= 2025).map((x) => num(x.value));
    const known = v.filter((x) => x !== null);
    if (!known.length) return 'n/a';
    const sum = known.reduce((a, x) => a + x, 0);
    return known.length < v.length ? `${sum} (partial)` : String(sum);
  };
  const dep = (id) => S.filter((x) => x.framework_id === id && x.metric.startsWith('deploy_') && x.value === 'yes').map((x) => x.metric.replace('deploy_', '').replace('_', ' ')).join(', ') || 'n/a';
  const val = (id, m) => raw(S.find((x) => x.framework_id === id && x.metric === m)?.value);
  const web = page === 'web';
  const rows = ids.map((id) => [nameCell(G[id]), adv5(id), val(id, 'advisories_total'), val(id, 'scorecard_overall'), val(id, 'security_policy'), pass(dep(id)), val(id, 'realtime'), ...(web ? [val(id, 'accessibility')] : []), val(id, 'ai_assistant_support')]);
  return renderTable({ caption: `Security and other metrics (${srcs(['osv', 'openssf-scorecard', 'site-pages'])}); deployment, real-time, accessibility and AI tooling say whether the site documents them (n/a is not "unsupported")`, cols: web ? '3,1,1,1,1,3,1,1,1' : '3,1,1,1,1,3,1,1', header: ['Framework', 'Advisories 2021-2025', 'Advisories (all)', 'Scorecard', 'Security policy', 'Deployment targets documented', 'Real-time', ...(web ? ['Accessibility'] : []), 'AI tooling'], rows });
}
/** One summary table with every framework of the page and every metric (the table the original request asked for). */
export function comparisonTable(data, page) {
  const scores = computeScores(data); const G = frameworkIndex(data);
  const ids = frameworksOf(data, page).map((f) => f.id);
  const sc = (id, a) => { const key = CSS.includes(id) && page === 'web' ? 'css' : page; return score(scores[key]?.[id]?.[a] ?? null); };
  const conc = (id) => pass(data.concurrency.find((r) => r.framework_id === id)?.model);
  const rend = (id) => pass(data.productivity.find((r) => r.framework_id === id && r.feature === 'rendering')?.value);
  const lts = (id) => raw(data.ecosystem.find((r) => r.framework_id === id)?.has_lts);
  const adv = (id) => raw(data.security.find((r) => r.framework_id === id && r.metric === 'advisories_total')?.value);
  const header = page === 'backend'
    ? ['Framework', 'Popularity', 'Growth', 'Talent/jobs', 'Ease of use (E)', 'Ecosystem (E)', 'Productivity (E)', 'Throughput', 'Memory', 'Startup', 'Concurrency model', 'LTS', 'Advisories']
    : ['Framework', 'Popularity', 'Growth', 'Talent/jobs', 'Ease of use (E)', 'Ecosystem (E)', 'Productivity (E)', 'Runtime perf.', 'Bundle size', 'Performance', 'Rendering', 'LTS', 'Advisories'];
  const rows = ids.map((id) => page === 'backend'
    ? [nameCell(G[id]), ...['popularity', 'growth', 'talent_jobs', 'ease_of_use', 'ecosystem_maturity', 'productivity', 'throughput', 'memory', 'startup'].map((a) => sc(id, a)), conc(id), lts(id), adv(id)]
    : [nameCell(G[id]), ...['popularity', 'growth', 'talent_jobs', 'ease_of_use', 'ecosystem_maturity', 'productivity', 'runtime_performance', 'bundle_size', 'performance'].map((a) => sc(id, a)), rend(id), lts(id), adv(id)]);
  return renderTable({ caption: `Summary: every framework against every metric. Scores 0-10 (higher is better); (E) editorial, others computed; n/a = no data. ${page === 'web' ? 'CSS frameworks are scored among themselves.' : ''}`.trim(), cols: `3,${header.slice(1, -3).map(() => 1).join(',')},3,1,1`, header, rows });
}
export function radarScoresTable(data, page) {
  const scores = computeScores(data); const G = frameworkIndex(data);
  const parts = [];
  for (const g of RADAR_GROUPS[page]) {
    const key = g.id === 'css' ? 'css' : page;
    const axes = AXES[key];
    const rows = g.members.map((id) => [nameCell(G[id]), ...axes.map((a) => score(scores[key][id]?.[a] ?? null))]);
    parts.push(renderTable({ caption: `Radar scores: ${g.title}`, cols: `3,${axes.map(() => 1).join(',')}`, header: ['Framework', ...axes.map(axisLabel)], rows }));
  }
  const ids = new Set(RADAR_GROUPS[page].flatMap((g) => g.members));
  const basis = data['radar-scores'].filter((r) => ids.has(r.framework_id)).map((r) => [nameCell(G[r.framework_id]), pass(AXIS_LABELS[r.axis]), raw(r.score), pass(r.basis)]);
  parts.push(renderTable({ caption: 'Basis of each editorial score (radar-scores.csv)', cols: '2,2,1,6', header: ['Framework', 'Axis', 'Score', 'Basis'], rows: basis }));
  return parts.join('\n\n');
}
export function recommendationsTable(data, page) {
  const G = frameworkIndex(data);
  const rows = data.recommendations.filter((r) => r.page === page).map((r) => [pass(r.purpose), nameCell(G[r.framework_id]), pass(r.fit), pass(r.basis)]);
  return renderTable({ caption: 'Recommendation by purpose (editorial, with the data each recommendation relies on)', cols: '3,2,1,6', header: ['Purpose', 'Framework', 'Fit', 'Basis'], rows });
}
/** Source ids cited by the rows of the page's frameworks (plus page-wide sources). */
export function citedSources(data, page) {
  const ids = new Set(frameworksOf(data, page).map((f) => f.id));
  const out = new Set(['editorial', 'official-websites', 'site-pages']);
  for (const [file, rows] of Object.entries(data)) {
    if (['sources', 'frameworks'].includes(file)) continue;
    for (const r of rows) if (!r.framework_id || ids.has(r.framework_id)) for (const s of String(r.source ?? '').split(';')) if (!isMissing(s)) out.add(s.trim());
  }
  for (const f of data.frameworks.filter((x) => ids.has(x.id))) for (const s of String(f.source ?? '').split(';')) if (!isMissing(s)) out.add(s.trim());
  return out;
}
export function bibliography(data, page, extra = new Set()) {
  const cited = new Set([...citedSources(data, page), ...extra]);
  const used = data.sources.filter((s) => cited.has(s.id));
  const unused = data.sources.filter((s) => !cited.has(s.id) && s.reachable === 'no');
  const row = (s) => [`[[src-${s.id}]]link:++${s.url}++[${pass(s.title)}]`, pass(s.publisher), pass(s.edition), pass(s.retrieved), pass(s.used_for)];
  const t1 = renderTable({ caption: 'Data sources used on this page', cols: '4,2,2,1,4', header: ['Source', 'Publisher', 'Edition or date', 'Retrieved', 'Used for'], rows: used.map(row) });
  const t2 = renderTable({ caption: 'Sources listed for the comparison that could not be used (unverified)', cols: '4,2,2,1,4', header: ['Source', 'Publisher', 'Edition or date', 'Retrieved', 'Reason'], rows: unused.map(row) });
  return `The registry of sources is \`sources.csv\` in \`scripts/framework-charts/data\`, with ${data.sources.length} entries; ${used.length} are used on this page. Every source was opened on ${used[0]?.retrieved ?? 'n/a'} unless marked otherwise.\n\n${t1}\n\n${t2}`;
}

export const TABLE_PARTIALS = [
  { name: 'scope', build: scopeTable }, { name: 'popularity', build: popularityTable }, { name: 'downloads', build: downloadsTable },
  { name: 'talent-jobs', build: talentTable }, { name: 'ecosystem', build: ecosystemTable }, { name: 'feature-matrix', build: featureMatrix },
  { name: 'performance', build: performanceTable }, { name: 'startup-memory', build: startupMemoryTable, pages: ['backend'] },
  { name: 'concurrency', build: concurrencyTable, pages: ['backend'] }, { name: 'other-metrics', build: otherMetricsTable },
  { name: 'comparison-table', build: comparisonTable }, { name: 'radar-scores', build: radarScoresTable },
  { name: 'recommendations', build: recommendationsTable }, { name: 'bibliography', build: bibliography },
];

/** Writes every partial for both pages; `dirs` maps page -> directory. Returns the written file paths. */
export function generateTables(data, dirs = DEFAULT_TABLES_DIRS) {
  const files = [];
  for (const page of ['backend', 'web']) {
    mkdirSync(dirs[page], { recursive: true });
    const linked = new Set();
    for (const { name, build, pages } of TABLE_PARTIALS) {
      if (pages && !pages.includes(page)) continue;
      const file = join(dirs[page], `${name}.adoc`);
      const text = name === 'bibliography' ? build(data, page, linked) : build(data, page);
      for (const m of text.matchAll(/<<src-([a-z0-9-]+),/g)) linked.add(m[1]);
      writeFileSync(file, `${text}\n`);
      files.push(file);
    }
  }
  return files;
}

function main(argv) {
  const i = argv.indexOf('--out');
  if (i >= 0 && (argv[i + 1] === undefined || argv[i + 1].startsWith('--'))) {
    console.error('Usage: node scripts/framework-charts/generate-tables.mjs [--out <dir>]');
    process.exitCode = 2;
    return;
  }
  const dirs = i >= 0 ? { backend: join(resolve(argv[i + 1]), 'backend'), web: join(resolve(argv[i + 1]), 'web') } : DEFAULT_TABLES_DIRS;
  const files = generateTables(loadData(), dirs);
  console.log(`Wrote ${files.length} partial(s)`);
  files.forEach((f) => console.log(`  ${f}`));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2));
