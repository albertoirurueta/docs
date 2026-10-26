// 0-10 radar scores for the cloud providers comparison. Scale: 10 is the best of the three providers on that axis, not
// a theoretical maximum. Four axes are computed from the CSVs of ./data (rubric in data/NOTES.md); `ease_of_use` and
// `ai_offering` are editorial and are read from data/radar-scores.csv.
import { toNumber } from '../language-charts/data-utils.mjs';
import { PROVIDER_IDS, providerId } from './providers.mjs';

export const AXES = [
  ['popularity', 'Popularity'],
  ['ecosystem_breadth', 'Ecosystem breadth'],
  ['ease_of_use', 'Ease of use'],
  ['price_competitiveness', 'Price competitiveness'],
  ['regional_coverage', 'Regional coverage'],
  ['ai_offering', 'AI offering'],
];
export const COMPUTED_AXES = ['popularity', 'ecosystem_breadth', 'price_competitiveness', 'regional_coverage'];
export const EDITORIAL_AXES = ['ease_of_use', 'ai_offering'];
export const SOVEREIGN_CATEGORIES = ['china', 'government', 'sovereign'];

export const round1 = (v) => Math.round(v * 10) / 10;
const clamp = (v, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, v));
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Maps provider id -> value, keeping only the three providers. */
function byProvider(entries) {
  const out = Object.fromEntries(PROVIDER_IDS.map((id) => [id, null]));
  for (const [raw, value] of entries) {
    const id = providerId(raw);
    if (id) out[id] = value;
  }
  return out;
}

/** value / best, scaled to 0-10; null when the value or the best is missing or not positive. */
export function relativeScore(value, best) {
  if (value === null || best === null || !(best > 0)) return null;
  return round1(clamp((value / best) * 10));
}

/** Mean of the available ratios (missing ones are skipped, never zero), x 10 and rounded; null when none is available. */
export function meanRatioScore(ratios) {
  const present = ratios.filter((r) => r !== null && Number.isFinite(r));
  return present.length ? round1(clamp(mean(present) * 10)) : null;
}

const ratioOfMax = (values) => {
  const max = Math.max(...Object.values(values).filter((v) => v !== null));
  return Object.fromEntries(Object.entries(values).map(([k, v]) => [k, v === null || !(max > 0) ? null : v / max]));
};

/** Latest quarter in which the Synergy series has a share for every provider. */
export function latestSynergyQuarter(rows) {
  const quarters = [...new Set(rows.filter((r) => r.firm.startsWith('Synergy')).map((r) => r.quarter))].sort().reverse();
  return quarters.find((q) => PROVIDER_IDS.every((id) => rows.some((r) => r.quarter === q && r.firm.startsWith('Synergy')
    && providerId(r.provider) === id && toNumber(r.share_pct) !== null)));
}

/** Popularity inputs: { quarter, share: {id: pct}, usage: {id: pct} }. */
export function popularityInputs(data) {
  const quarter = latestSynergyQuarter(data['market-share']);
  const share = byProvider(data['market-share']
    .filter((r) => r.quarter === quarter && r.firm.startsWith('Synergy'))
    .map((r) => [r.provider, toNumber(r.share_pct)]));
  const usage = byProvider(data.learning.filter((r) => r.metric === 'so_usage_2026').map((r) => [r.provider, toNumber(r.value)]));
  return { quarter, share, usage };
}

/** Popularity: 10 x mean(share / max share, usage / max usage). */
export function popularityScores(data) {
  const { share, usage } = popularityInputs(data);
  const s = ratioOfMax(share);
  const u = ratioOfMax(usage);
  return Object.fromEntries(PROVIDER_IDS.map((id) => [id, meanRatioScore([s[id], u[id]])]));
}

/** Ecosystem breadth inputs (`n/a`, `None` and empty cells mean the provider has no equivalent service): service categories with a service, total categories, official SDK languages and the maximum. */
export function ecosystemInputs(data) {
  const rows = data['service-mapping'];
  const covered = byProvider(PROVIDER_IDS.map((id) => [id, rows.filter((r) => {
    const v = (r[id === 'google-cloud' ? 'google_cloud' : id] ?? '').trim();
    return !/^(|n\/a|none)$/i.test(v);
  }).length]));
  const sdk = byProvider(data.tooling.filter((r) => r.metric === 'official_sdk_languages').map((r) => [r.provider, toNumber(r.value)]));
  const sdkMax = Math.max(...Object.values(sdk).filter((v) => v !== null));
  return { categories: rows.length, covered, sdk, sdkMax };
}

/** Ecosystem breadth: 10 x mean(service coverage, SDK languages / most SDK languages). */
export function ecosystemScores(data) {
  const { categories, covered, sdk, sdkMax } = ecosystemInputs(data);
  return Object.fromEntries(PROVIDER_IDS.map((id) => [id, meanRatioScore([
    covered[id] === null ? null : covered[id] / categories, sdk[id] === null ? null : sdk[id] / sdkMax])]));
}

/** Reference architecture totals: { architecture: { id: total USD } }, summed from reference-totals.csv lines. */
export function architectureTotals(rows) {
  const out = {};
  for (const r of rows) {
    const id = providerId(r.provider);
    const v = toNumber(r.line_usd);
    if (!id || v === null || r.line === 'TOTAL') continue;
    out[r.architecture] ??= {};
    out[r.architecture][id] = (out[r.architecture][id] ?? 0) + v;
  }
  return out;
}

/** Price competitiveness: 10 x mean over the architectures of (cheapest total / own total). */
export function priceScores(data) {
  const totals = architectureTotals(data['reference-totals']);
  const ratios = Object.fromEntries(PROVIDER_IDS.map((id) => [id, []]));
  for (const t of Object.values(totals)) {
    const present = PROVIDER_IDS.filter((id) => typeof t[id] === 'number');
    if (present.length < PROVIDER_IDS.length) continue; // an incomplete architecture would favour the provider with the gap
    const min = Math.min(...present.map((id) => t[id]));
    for (const id of present) ratios[id].push(min / t[id]);
  }
  return Object.fromEntries(PROVIDER_IDS.map((id) => [id, meanRatioScore(ratios[id])]));
}

/** Latest regions-over-time row per provider that has both a region and an availability zone count. */
export function latestInfrastructure(rows) {
  const out = Object.fromEntries(PROVIDER_IDS.map((id) => [id, null]));
  for (const id of PROVIDER_IDS) {
    const r = rows.filter((x) => providerId(x.provider) === id && toNumber(x.regions) !== null && toNumber(x.availability_zones) !== null)
      .sort((a, b) => a.as_of.localeCompare(b.as_of)).pop();
    if (r) out[id] = { as_of: r.as_of, regions: toNumber(r.regions), zones: toNumber(r.availability_zones) };
  }
  return out;
}

/** Number of sovereign, government and China offerings (one per category) whose status says they are available. */
export function sovereignOptions(rows) {
  const out = Object.fromEntries(PROVIDER_IDS.map((id) => [id, 0]));
  for (const id of PROVIDER_IDS) {
    const cats = new Set(rows.filter((r) => providerId(r.provider) === id && SOVEREIGN_CATEGORIES.includes(r.category)
      && /^(generally )?available/i.test(r.status.trim())).map((r) => r.category));
    out[id] = cats.size;
  }
  return out;
}

/** Regional coverage: 10 x mean(regions / most regions, zones / most zones, sovereign categories / 3). */
export function regionalScores(data) {
  const infra = latestInfrastructure(data['regions-over-time']);
  const maxR = Math.max(...PROVIDER_IDS.map((id) => infra[id]?.regions ?? 0));
  const maxZ = Math.max(...PROVIDER_IDS.map((id) => infra[id]?.zones ?? 0));
  const sov = sovereignOptions(data.sovereign);
  return Object.fromEntries(PROVIDER_IDS.map((id) => [id, infra[id] ? meanRatioScore([
    infra[id].regions / maxR, infra[id].zones / maxZ, sov[id] / SOVEREIGN_CATEGORIES.length]) : null]));
}

/** Returns { providerId: { axisId: score } }: computed axes from the CSVs, editorial axes from radar-scores.csv. */
export function computeScores(data) {
  const computed = {
    popularity: popularityScores(data),
    ecosystem_breadth: ecosystemScores(data),
    price_competitiveness: priceScores(data),
    regional_coverage: regionalScores(data),
  };
  const out = Object.fromEntries(PROVIDER_IDS.map((id) => [id, {}]));
  for (const id of PROVIDER_IDS) for (const [axis, v] of Object.entries(computed)) out[id][axis] = v[id];
  for (const r of data['radar-scores']) {
    const id = providerId(r.provider_id);
    const v = toNumber(r.score);
    if (id && EDITORIAL_AXES.includes(r.axis)) out[id][r.axis] = v;
  }
  return out;
}

/** One-line basis text for each computed score, written to radar-scores.csv. */
export function computedBasis(data) {
  const pop = popularityInputs(data);
  const eco = ecosystemInputs(data);
  const infra = latestInfrastructure(data['regions-over-time']);
  const sov = sovereignOptions(data.sovereign);
  const totals = architectureTotals(data['reference-totals']);
  const maxShare = Math.max(...Object.values(pop.share));
  const maxUsage = Math.max(...Object.values(pop.usage));
  const r2 = (v) => v.toFixed(2);
  const out = {};
  for (const id of PROVIDER_IDS) {
    out[id] = {
      popularity: `Computed: 10 x mean(share/max share, usage/max usage). market-share.csv Synergy ${pop.quarter} share ${pop.share[id]}% (max ${maxShare}); learning.csv so_usage_2026 ${pop.usage[id]}% (max ${maxUsage}). Share is infrastructure-services spend; usage is developer-survey only`,
      ecosystem_breadth: `Computed: mean of service coverage and SDK coverage x 10. service-mapping.csv: ${eco.covered[id]} of ${eco.categories} categories have a service; tooling.csv official_sdk_languages ${eco.sdk[id]} of ${eco.sdkMax} (max)`,
      price_competitiveness: `Computed: 10 x mean over the ${Object.keys(totals).length} reference architectures of (cheapest total / own total). reference-totals.csv monthly list-price totals (${Object.entries(totals).map(([a, t]) => `${a} ${r2(t[id])} USD`).join('; ')}). Excludes free tiers, discounts and support, which are not like for like`,
      regional_coverage: `Computed: 10 x mean(regions/most regions, zones/most zones, sovereign categories/${SOVEREIGN_CATEGORIES.length}). regions-over-time.csv ${infra[id]?.as_of}: ${infra[id]?.regions} regions and ${infra[id]?.zones} zones; sovereign.csv: ${sov[id]} of China, government and sovereign offerings available. Region and zone definitions differ between providers`,
    };
  }
  return out;
}
