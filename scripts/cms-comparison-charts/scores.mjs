// 0-10 radar scores for the CMS comparison. Five axes are computed from the metric CSVs (popularity, growth, talent
// pool, ecosystem and performance; formulas in data/NOTES.md) and seven are editorial scores read from
// data/radar-scores.csv, each row carrying its basis and source ids. Higher is always better: "cost" means cheaper and
// "maintenance" means less effort, "portability" means less lock-in. A value that cannot be computed or sourced is null
// and is drawn as a gap, never as zero.
import { toNumber } from '../language-charts/data-utils.mjs';

/** The CMSs compared, grouped as on the page. Shopify is market-share context only and has no scores. */
export const GROUPS = [
  { id: 'traditional', title: 'Traditional open-source (self-hosted)', short: 'Traditional open-source', slot: 0, members: ['wordpress', 'drupal', 'joomla', 'typo3', 'craft-cms'] },
  { id: 'hosted', title: 'Hosted website builders (SaaS)', short: 'Hosted builders', slot: 1, members: ['webflow', 'wix', 'squarespace'] },
  { id: 'headless', title: 'Headless and API-first', short: 'Headless', slot: 2, members: ['contentful', 'strapi', 'sanity', 'payload'] },
  { id: 'enterprise', title: 'Enterprise DXP and other stacks', short: 'Enterprise and other stacks', slot: 3, members: ['aem', 'umbraco', 'wagtail', 'ghost'] },
];
export const CMS = GROUPS.flatMap((g) => g.members);
export const CONTEXT = ['shopify'];
export const CMS_NAMES = {
  wordpress: 'WordPress', drupal: 'Drupal', joomla: 'Joomla', typo3: 'TYPO3', 'craft-cms': 'Craft CMS',
  webflow: 'Webflow', wix: 'Wix', squarespace: 'Squarespace',
  contentful: 'Contentful', strapi: 'Strapi', sanity: 'Sanity', payload: 'Payload',
  aem: 'Adobe Experience Manager', umbraco: 'Umbraco', wagtail: 'Wagtail', ghost: 'Ghost',
  shopify: 'Shopify (context)',
};
/**
 * Palette slot (colour, dash and marker) of each CMS: its position inside its group, so a CMS keeps one style in
 * every figure of its group. Figures that mix groups colour by group (bars, scatter) or assign slots by position and
 * say so in the legend.
 */
export const CMS_SLOT = Object.fromEntries([
  ...GROUPS.flatMap((g) => g.members.map((id, i) => [id, i])),
  ['shopify', 4],
]);
/** Group of each CMS. */
export const CMS_GROUP = Object.fromEntries(GROUPS.flatMap((g) => g.members.map((id) => [id, g.id])));

export const AXES = [
  ['popularity', 'Popularity'],
  ['growth', 'Growth'],
  ['talent', 'Talent pool / jobs'],
  ['ease_editors', 'Ease of use (editors)'],
  ['ease_developers', 'Ease of use (developers)'],
  ['ecosystem', 'Ecosystem and maturity'],
  ['features', 'Features / productivity'],
  ['performance', 'Performance'],
  ['cost', 'Low cost'],
  ['security', 'Security posture'],
  ['maintenance', 'Low maintenance effort'],
  ['portability', 'Portability (low lock-in)'],
];
export const COMPUTED_AXES = ['popularity', 'growth', 'talent', 'ecosystem', 'performance'];
export const EDITORIAL_AXES = AXES.map(([k]) => k).filter((k) => !COMPUTED_AXES.includes(k));

const clamp = (v, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, v));
const round1 = (v) => Math.round(v * 10) / 10;
/** Mean of the non-null values; null when there are none. */
const meanAvailable = (xs) => {
  const v = xs.filter((x) => x !== null);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};
/** Mean that is null as soon as one part is missing. */
const meanAll = (xs) => (xs.some((x) => x === null) || !xs.length ? null : xs.reduce((a, b) => a + b, 0) / xs.length);

/** Log-scaled score: `lo` maps to 0 and `hi` to 10, clamped; null for a missing or non-positive value. */
export function logScore(value, lo, hi) {
  const v = toNumber(value);
  if (v === null || v <= 0) return null;
  return round1(clamp(((Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * 10));
}

const numeric = (r) => toNumber(r.value) !== null;
const byDate = (a, b) => String(a.date).localeCompare(String(b.date));

/** Rows of the platform and metric (optional item prefix filter) that carry a number, oldest first. */
export function numericRows(rows, platform, metric, itemFilter) {
  return rows
    .filter((r) => r.platform === platform && r.metric === metric && numeric(r) && (!itemFilter || itemFilter.test(r.item)))
    .sort(byDate);
}

/** Value of the row with the largest date for the platform and metric; null when none. */
export function latestValue(rows, platform, metric, itemFilter) {
  const m = numericRows(rows, platform, metric, itemFilter);
  return m.length ? toNumber(m.at(-1).value) : null;
}

/** Latest numeric row of the platform and metric, or null. */
export function latestRow(rows, platform, metric, itemFilter) {
  const m = numericRows(rows, platform, metric, itemFilter);
  return m.length ? m.at(-1) : null;
}

/** Popularity: mean of the log-scaled W3Techs share of all sites (0.01% = 0, 50% = 10) and HTTP Archive mobile origins (100 = 0, 5,000,000 = 10). */
export function popularityScore(rows, platform) {
  const share = logScore(latestValue(rows, platform, 'w3techs_share_all_sites'), 0.01, 50);
  const origins = logScore(latestValue(rows, platform, 'httparchive_origins_mobile'), 100, 5e6);
  const m = meanAvailable([share, origins]);
  return m === null ? null : round1(m);
}

/** Growth: ratio of the latest HTTP Archive mobile origins to the same month three years earlier; 5 + 5 * log2(ratio), clamped (unchanged = 5, doubled = 10, halved = 0). */
export function growthScore(rows, platform) {
  const m = numericRows(rows, platform, 'httparchive_origins_mobile').filter((r) => /^\d{4}-\d{2}$/.test(r.date));
  if (!m.length) return null;
  const last = m.at(-1);
  const [y, mo] = last.date.split('-');
  const past = m.find((r) => r.date === `${Number(y) - 3}-${mo}`);
  if (!past || toNumber(past.value) <= 0 || toNumber(last.value) <= 0) return null;
  return round1(clamp(5 + 5 * Math.log2(toNumber(last.value) / toNumber(past.value))));
}

/** Questions asked on Stack Overflow with the CMS tag in the last two complete years; null when either year is missing. */
export function recentQuestions(rows, platform, years = ['2024', '2025']) {
  const vals = years.map((y) => {
    const r = rows.find((x) => x.platform === platform && x.metric === 'stackexchange_questions_year' && /^stackoverflow:/.test(x.item) && x.date === y);
    return r ? toNumber(r.value) : null;
  });
  return vals.some((v) => v === null) ? null : vals[0] + vals[1];
}

/** Talent pool: log-scaled Stack Overflow questions of the last two complete years (10 = 0, 10,000 = 10). */
export function talentScore(rows, platform) {
  return logScore(recentQuestions(rows, platform), 10, 1e4);
}

/** GitHub stars of the CMS repositories, excluding mirrors and develop repositories; null when it has none. */
export function totalStars(rows, platform) {
  const t = rows.filter((r) => r.platform === platform && r.metric === 'github_stars' && !/develop/.test(r.item) && numeric(r));
  return t.length ? t.reduce((a, r) => a + toNumber(r.value), 0) : null;
}

/** Ecosystem: mean of the available log-scaled GitHub stars (1,000 = 0, 100,000 = 10) and total Stack Overflow questions (100 = 0, 300,000 = 10). */
export function ecosystemScore(rows, platform) {
  const stars = logScore(totalStars(rows, platform), 1e3, 1e5);
  const questions = logScore(latestValue(rows, platform, 'stackexchange_questions_total'), 1e2, 3e5);
  const m = meanAvailable([stars, questions]);
  return m === null ? null : round1(m);
}

/**
 * Performance: mean of the mobile and desktop Core Web Vitals pass rates (percent divided by 10) and of the mobile and
 * desktop median Lighthouse performance scores (0-1 times 10), all from the latest HTTP Archive month; null when any
 * of the four is missing.
 */
export function performanceScore(rows, platform) {
  const scaled = (metric, factor) => {
    const v = latestValue(rows, platform, metric);
    return v === null ? null : v * factor;
  };
  const m = meanAll([
    scaled('cwv_pass_mobile', 1 / 10), scaled('cwv_pass_desktop', 1 / 10),
    scaled('lighthouse_performance_mobile', 10), scaled('lighthouse_performance_desktop', 10),
  ]);
  return m === null ? null : round1(clamp(m));
}

/** Returns { cms: { axisKey: score | null } } from the CSV data map. */
export function computeScores(data) {
  const out = {};
  for (const p of CMS) out[p] = Object.fromEntries(AXES.map(([k]) => [k, null]));
  for (const r of data['radar-scores']) {
    const v = toNumber(r.score);
    if (out[r.platform] && EDITORIAL_AXES.includes(r.axis)) out[r.platform][r.axis] = v;
  }
  for (const p of CMS) {
    out[p].popularity = popularityScore(data.popularity, p);
    out[p].growth = growthScore(data.popularity, p);
    out[p].talent = talentScore(data.popularity, p);
    out[p].ecosystem = ecosystemScore(data.popularity, p);
    out[p].performance = performanceScore(data.performance, p);
  }
  return out;
}

/** The CMS with the highest computed popularity in a group (the "mainstream pick"); ties go to the first member. */
export function leaderOf(group, scores) {
  return group.members.reduce((best, id) => ((scores[id].popularity ?? -1) > (scores[best].popularity ?? -1) ? id : best), group.members[0]);
}
