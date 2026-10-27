// Radar scores (0-10, higher is better) for the frameworks comparison. Computed axes implement the formulas of
// data/NOTES.md; editorial axes come from data/radar-scores.csv. A computed axis whose inputs are n/a returns null,
// never zero.
import { AXES, EDITORIAL_AXES, RADAR_GROUPS, clamp10, frameworksOf, mean, num, round1 } from './frameworks.mjs';

/** Registry measure used for popularity: one recent period per registry (units differ, so never mixed). */
export const REGISTRY_MEASURES = [
  ['downloads-npm', 'last-12-months'], ['downloads-pypi', 'last-30-days'], ['downloads-packagist', 'last-30-days'],
  ['downloads-crates', 'last-90-days'], ['downloads-hex', 'last-90-days'], ['downloads-nuget', 'total'], ['downloads-rubygems', 'total'],
];
const CSS_GROUP = RADAR_GROUPS.web.find((g) => g.id === 'css').members;

const metricValue = (rows, fid, metric, period) => num(rows.find((r) => r.framework_id === fid && r.metric === metric && (period === undefined || r.period === period || r.edition === period))?.value);
/** 10 x a 0-1 fraction, rounded and clamped; null stays null. */
const tenTimes = (f) => (f === null ? null : round1(clamp10(10 * f)));
/** Largest value when at least two frameworks have one (a single value says nothing relative), else null. */
const maxOf = (vals) => { const v = vals.filter((x) => x !== null && x !== undefined); return v.length >= 2 ? Math.max(...v) : null; };
const ratio = (v, max) => (v === null || !max ? null : v / max);
const logRatio = (v, max) => (v === null || v <= 0 || !max || max <= 1 ? null : Math.log10(v) / Math.log10(max));

/** { fid: downloads } of the primary package for one registry measure. */
export function registryValues(data, file, period) {
  const out = {};
  for (const r of data[file] ?? []) if (r.primary === 'yes' && r.period === period && num(r.value) !== null) out[r.framework_id] = num(r.value);
  return out;
}

/** Popularity inputs (fractions 0-1) for the frameworks `ids`. */
export function popularityInputs(data, ids) {
  const out = Object.fromEntries(ids.map((id) => [id, {}]));
  const so = Object.fromEntries(ids.map((id) => [id, metricValue(data.popularity, id, 'so_usage_all', '2025')]));
  const soMax = maxOf(Object.values(so));
  for (const id of ids) out[id].so_usage = ratio(so[id], soMax);
  for (const [file, period] of REGISTRY_MEASURES) {
    const vals = registryValues(data, file, period);
    const inPage = ids.filter((id) => vals[id] !== undefined);
    if (inPage.length < 2) continue; // a registry with one framework on the page says nothing relative
    const max = Math.max(...inPage.map((id) => vals[id]));
    for (const id of inPage) out[id].downloads = logRatio(vals[id], max);
  }
  const origins = Object.fromEntries(ids.map((id) => [id, metricValue(data.popularity, id, 'httparchive_origins_mobile')]));
  const oMax = maxOf(Object.values(origins));
  for (const id of ids) out[id].origins = logRatio(origins[id], oMax);
  const stars = Object.fromEntries(ids.map((id) => [id, num(data.github.find((r) => r.framework_id === id)?.stars)]));
  const sMax = maxOf(Object.values(stars));
  for (const id of ids) out[id].stars = logRatio(stars[id], sMax);
  return out;
}

/** Sum of a primary npm package's months in [from, to]; null when any month is n/a or missing. */
export function npmWindow(data, fid, from, to) {
  const rows = data['downloads-npm'].filter((r) => r.framework_id === fid && r.primary === 'yes' && r.period === 'month' && r.period_start >= from && r.period_start <= to);
  const months = (Number(to.slice(0, 4)) - Number(from.slice(0, 4))) * 12 + Number(to.slice(5, 7)) - Number(from.slice(5, 7)) + 1;
  if (rows.length !== months || rows.some((r) => num(r.value) === null)) return null;
  return rows.reduce((a, r) => a + num(r.value), 0);
}
/** Mean of a Packagist package's monthly average daily downloads in [from, to]; null when incomplete. */
export function packagistWindow(data, fid, from, to) {
  const rows = data['downloads-packagist'].filter((r) => r.framework_id === fid && r.primary === 'yes' && r.period === 'month' && r.period_start >= from && r.period_start <= to);
  if (rows.length !== 12 || rows.some((r) => num(r.value) === null)) return null;
  return rows.reduce((a, r) => a + num(r.value), 0) / 12;
}
const hist = (data, fid, metric, period) => num(data['popularity-history'].find((r) => r.framework_id === fid && r.metric === metric && r.period === period)?.value);

/** Growth signals g = ln(now / then) per framework. */
export function growthSignals(data, ids) {
  const g = (now, then) => (now === null || then === null || now <= 0 || then <= 0 ? null : Math.log(now / then));
  return Object.fromEntries(ids.map((id) => [id, {
    so_usage: g(hist(data, id, 'so_usage_all', '2025'), hist(data, id, 'so_usage_all', '2023')),
    npm: g(npmWindow(data, id, '2025-07-01', '2026-06-01'), npmWindow(data, id, '2024-07-01', '2025-06-01')),
    packagist: g(packagistWindow(data, id, '2025-07-01', '2026-06-01'), packagistWindow(data, id, '2024-07-01', '2025-06-01')),
    sojs_usage: g(hist(data, id, 'sojs_usage', '2025'), hist(data, id, 'sojs_usage', '2023')),
  }]));
}
/** Min-max scaling of each growth signal to 0-10 across `ids`; mean of the available signals. */
export function growthScores(data, ids) {
  const sig = growthSignals(data, ids);
  const scaled = Object.fromEntries(ids.map((id) => [id, []]));
  for (const k of ['so_usage', 'npm', 'packagist', 'sojs_usage']) {
    const have = ids.filter((id) => sig[id][k] !== null);
    if (have.length < 2) continue;
    const lo = Math.min(...have.map((id) => sig[id][k]));
    const hi = Math.max(...have.map((id) => sig[id][k]));
    for (const id of have) scaled[id].push(hi === lo ? 5 : (10 * (sig[id][k] - lo)) / (hi - lo));
  }
  return Object.fromEntries(ids.map((id) => [id, round1(mean(scaled[id]))]));
}

/** Talent pool and jobs: mean of SO professional usage / max and HN 2025 mention share / max, times 10. */
export function talentScores(data, ids) {
  const prof = Object.fromEntries(ids.map((id) => [id, metricValue(data.jobs, id, 'talent_pool_so_usage_prof')]));
  const hn = Object.fromEntries(ids.map((id) => [id, metricValue(data.jobs, id, 'hn_mention_share', '2025')]));
  const pMax = maxOf(Object.values(prof));
  const hMax = maxOf(Object.values(hn));
  return Object.fromEntries(ids.map((id) => [id, round1(clamp10(mean([ratio(prof[id], pMax), ratio(hn[id], hMax)].map((v) => (v === null ? null : 10 * v)))))]));
}

/** Best TechEmpower round-23 fortunes result over a framework's variants. */
export function fortunesRps(data, id) {
  const vals = data['performance-techempower'].filter((r) => r.framework_id === id && r.round === '23' && r.test === 'fortunes').map((r) => num(r.rps)).filter((v) => v !== null);
  return vals.length ? Math.max(...vals) : null;
}
/** throughput = 10 x (1 - log10(best / rps) / 2), clamped. */
export function throughputScores(data, ids) {
  const rps = Object.fromEntries(ids.map((id) => [id, fortunesRps(data, id)]));
  const best = Math.max(0, ...Object.values(rps).filter((v) => v !== null));
  return Object.fromEntries(ids.map((id) => [id, rps[id] === null ? null : round1(clamp10(10 * (1 - Math.log10(best / rps[id]) / 2)))]));
}
/** Memory and startup: only the like-for-like Quarkus comparison (same hardware and method), JIT variant. */
export function startupMemoryScores(data, ids, metric) {
  const rows = data['performance-startup-memory'].filter((r) => r.source === 'quarkus-perf-comparison' && r.variant === 'jit' && r.metric === metric);
  const v = Object.fromEntries(ids.map((id) => [id, num(rows.find((r) => r.framework_id === id)?.value)]));
  const have = ids.filter((id) => v[id] !== null);
  if (have.length < 2) return Object.fromEntries(ids.map((id) => [id, null]));
  const min = Math.min(...have.map((id) => v[id]));
  return Object.fromEntries(ids.map((id) => [id, v[id] === null ? null : round1(clamp10(10 * (1 - Math.log10(v[id] / min))))]));
}
const webMetric = (data, id, metric) => num(data['performance-web'].find((r) => r.framework_id === id && r.metric === metric)?.value);
/** runtime_performance = 10 x (1 - log2(f) / 3) for the js-framework-benchmark CPU geometric mean f. */
export function runtimeScores(data, ids) {
  return Object.fromEntries(ids.map((id) => { const f = webMetric(data, id, 'jsfb_cpu_weighted_geomean'); return [id, f === null ? null : round1(clamp10(10 * (1 - Math.log2(f) / 3)))]; }));
}
/** bundle_size = 10 x (1 - log10(s / smallest) / 2), clamped; CSS frameworks use the stylesheet size. */
export function bundleScores(data, ids, metric) {
  const s = Object.fromEntries(ids.map((id) => [id, webMetric(data, id, metric)]));
  const have = ids.filter((id) => s[id] !== null);
  if (have.length < 2) return Object.fromEntries(ids.map((id) => [id, null]));
  const min = Math.min(...have.map((id) => s[id]));
  return Object.fromEntries(ids.map((id) => [id, s[id] === null ? null : round1(clamp10(10 * (1 - Math.log10(s[id] / min) / 2)))]));
}

/** Editorial scores from radar-scores.csv: { fid: { axis: score } }. */
export function editorialScores(data) {
  const out = {};
  for (const r of data['radar-scores'] ?? []) if (r.kind === 'editorial') (out[r.framework_id] ??= {})[r.axis] = num(r.score);
  return out;
}

/** All radar scores: { backend|web|css: { fid: { axis: score|null } } }. */
export function computeScores(data) {
  const ed = editorialScores(data);
  const result = {};
  const backendIds = frameworksOf(data, 'backend').map((f) => f.id);
  const webIds = frameworksOf(data, 'web').map((f) => f.id).filter((id) => !CSS_GROUP.includes(id));
  for (const [page, ids] of [['backend', backendIds], ['web', webIds], ['css', CSS_GROUP]]) {
    const pop = popularityInputs(data, ids);
    const growth = growthScores(data, ids);
    const talent = talentScores(data, ids);
    const out = {};
    for (const id of ids) {
      const p = pop[id];
      out[id] = {
        popularity: tenTimes(mean([p.so_usage, p.downloads, p.stars, page === 'web' ? p.origins : null])),
        growth: growth[id],
        talent_jobs: talent[id],
      };
      for (const axis of EDITORIAL_AXES) out[id][axis] = ed[id]?.[axis] ?? null;
    }
    if (page === 'backend') {
      const tp = throughputScores(data, ids);
      const mem = startupMemoryScores(data, ids, 'rss_after_first_request_mib');
      const st = startupMemoryScores(data, ids, 'boot_and_first_response_ms');
      for (const id of ids) Object.assign(out[id], { throughput: tp[id], memory: mem[id], startup: st[id], performance: round1(mean([tp[id], mem[id], st[id]])) });
    } else if (page === 'web') {
      const rt = runtimeScores(data, ids);
      const bs = bundleScores(data, ids, 'jsfb_size_compressed_kb');
      const cwv = Object.fromEntries(ids.map((id) => [id, webMetric(data, id, 'cwv_good_mobile_pct')]));
      const cMax = maxOf(Object.values(cwv));
      for (const id of ids) Object.assign(out[id], { runtime_performance: rt[id], bundle_size: bs[id], performance: round1(mean([rt[id], bs[id], cwv[id] === null || !cMax ? null : (10 * cwv[id]) / cMax])) });
    } else {
      const bs = bundleScores(data, ids, 'css_min_gzip_kb');
      const w3 = Object.fromEntries(ids.map((id) => [id, metricValue(data.popularity, id, 'w3techs_sites_pct')]));
      const wMax = maxOf(Object.values(w3));
      for (const id of ids) Object.assign(out[id], { bundle_size: bs[id], site_usage: tenTimes(mean([pop[id].origins, ratio(w3[id], wMax)])) });
    }
    for (const id of ids) for (const k of Object.keys(out[id])) if (out[id][k] !== null) out[id][k] = clamp10(out[id][k]);
    result[page] = out;
  }
  return result;
}

/** Radar values of one group in axis order. */
export function radarValues(scores, page, group) {
  const key = group.id === 'css' ? 'css' : page;
  return group.members.map((id) => ({ id, values: AXES[key].map((a) => scores[key]?.[id]?.[a] ?? null) }));
}
