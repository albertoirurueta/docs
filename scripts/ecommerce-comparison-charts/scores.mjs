// 0-10 radar scores for the e-commerce platform comparison. Eight axes are editorial scores read from
// data/radar-scores.csv (rubric in data/NOTES.md, each with its basis and source); "performance" and "ecosystem" are
// computed from the metric CSVs. Higher is always better ("maintenance effort" is inverted: 10 = least effort).
import { toNumber } from '../language-charts/data-utils.mjs';

export const PLATFORMS = ['shopify', 'prestashop', 'magento', 'woocommerce'];
export const PLATFORM_NAMES = { shopify: 'Shopify', prestashop: 'PrestaShop', magento: 'Magento / Adobe Commerce', woocommerce: 'WooCommerce', wordpress: 'WordPress (context)' };
/** Palette slot of each platform: the same colour, dash and marker in every figure. */
export const PLATFORM_SLOT = { shopify: 0, prestashop: 1, magento: 2, woocommerce: 3, wordpress: 4 };

export const AXES = [
  ['ease_of_use', 'Ease of use'],
  ['maintenance_effort', 'Low maintenance effort'],
  ['performance', 'Performance'],
  ['tools_functionality', 'Tools and functionality'],
  ['security_posture', 'Security posture'],
  ['cost', 'Low cost'],
  ['customisation_flexibility', 'Customisation flexibility'],
  ['scalability', 'Scalability'],
  ['ecosystem', 'Ecosystem'],
  ['headless_readiness', 'Headless readiness'],
];
export const COMPUTED_AXES = ['performance', 'ecosystem'];

const clamp = (v, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, v));
const round1 = (v) => Math.round(v * 10) / 10;
const mean = (xs) => (xs.some((x) => x === null) || !xs.length ? null : xs.reduce((a, b) => a + b, 0) / xs.length);

/** Log-scaled score: `lo` maps to 0 and `hi` to 10, clamped. */
export function logScore(value, lo, hi) {
  const v = toNumber(value);
  if (v === null || v <= 0) return null;
  return round1(clamp(((Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * 10));
}

/** Value of the row with the largest date for the platform, metric and (optional) item prefix; null when none. */
export function latestValue(rows, platform, metric, item) {
  const m = rows.filter((r) => r.platform === platform && r.metric === metric && (item === undefined || r.item === item) && toNumber(r.value) !== null);
  if (!m.length) return null;
  m.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return toNumber(m.at(-1).value);
}

/**
 * Performance: mean of the mobile and desktop Core Web Vitals pass rates (percent divided by 10) and of the mobile and
 * desktop median Lighthouse performance scores (0-1 times 10), all from the latest month of the HTTP Archive.
 */
export function performanceScore(rows, platform) {
  const parts = [
    latestValue(rows, platform, 'cwv_pass_mobile') !== null ? latestValue(rows, platform, 'cwv_pass_mobile') / 10 : null,
    latestValue(rows, platform, 'cwv_pass_desktop') !== null ? latestValue(rows, platform, 'cwv_pass_desktop') / 10 : null,
    latestValue(rows, platform, 'lighthouse_performance_mobile') !== null ? latestValue(rows, platform, 'lighthouse_performance_mobile') * 10 : null,
    latestValue(rows, platform, 'lighthouse_performance_desktop') !== null ? latestValue(rows, platform, 'lighthouse_performance_desktop') * 10 : null,
  ];
  const m = mean(parts);
  return m === null ? null : round1(clamp(m));
}

/** Total Stack Overflow / Stack Exchange questions of the platform's tags (the `total` rows of popularity.csv). */
export function totalQuestions(rows, platform) {
  const t = rows.filter((r) => r.platform === platform && r.metric === 'stackexchange_questions_total' && toNumber(r.value) !== null);
  return t.length ? t.reduce((a, r) => a + toNumber(r.value), 0) : null;
}

/** Sum of the stars of the platform's repositories, excluding forks listed as context (Mage-OS). */
export function totalStars(rows, platform) {
  const t = rows.filter((r) => r.platform === platform && r.metric === 'github_stars' && !/mage-os/.test(r.item) && toNumber(r.value) !== null);
  return t.length ? t.reduce((a, r) => a + toNumber(r.value), 0) : null;
}

/**
 * Ecosystem: mean of three log-scaled measures. Live stores (Store Leads, latest quarter): 10,000 = 0, 10,000,000 = 10.
 * Stack Exchange questions of the platform's tags: 1,000 = 0, 1,000,000 = 10. GitHub stars of the main repositories:
 * 100 = 0, 100,000 = 10.
 */
export function ecosystemScore(rows, platform) {
  const stores = logScore(latestValue(rows, platform, 'storeleads_live_stores'), 1e4, 1e7);
  const questions = logScore(totalQuestions(rows, platform), 1e3, 1e6);
  const stars = logScore(totalStars(rows, platform), 1e2, 1e5);
  const m = mean([stores, questions, stars]);
  return m === null ? null : round1(m);
}

/** Returns { platform: { axisKey: score } } from the CSV data map. */
export function computeScores(data) {
  const out = {};
  for (const p of PLATFORMS) out[p] = {};
  for (const r of data['radar-scores']) {
    const v = toNumber(r.score);
    if (v !== null && out[r.platform]) out[r.platform][r.axis] = v;
  }
  for (const p of PLATFORMS) {
    out[p].performance = performanceScore(data.performance, p);
    out[p].ecosystem = ecosystemScore(data.popularity, p);
  }
  return out;
}
