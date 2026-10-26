// Radar-chart scores (0 to 10 per axis), computed from the CSV data exactly as the rubric in data/NOTES.md says.
// No score is typed by hand. A missing input gives null (a gap in the chart), never 0.
import { toNumber } from './data-utils.mjs';

export const AXES = ['Popularity', 'Ecosystem', 'Performance', 'Memory', 'Energy', 'Learning (ease)', 'Safety', 'Versatility', 'Job market'];

/** Minimum number of languages with salary data for the optional "Job market" axis to be kept. */
export const JOB_AXIS_MIN_LANGUAGES = 10;

const finite = (v) => typeof v === 'number' && Number.isFinite(v);

/** `lin(x) = 10 * (x - min) / (max - min)`; every value gets 10 when all are equal. */
export function linScore(x, min, max) {
  if (!finite(x)) return null;
  return max === min ? 10 : (10 * (x - min)) / (max - min);
}

/** Log scale, higher is better: `10 * (ln x - ln min) / (ln max - ln min)`. */
export function logScore(x, min, max) {
  if (!finite(x) || x <= 0 || min <= 0) return null;
  return max === min ? 10 : (10 * (Math.log(x) - Math.log(min))) / (Math.log(max) - Math.log(min));
}

/** Log scale, lower is better: `10 * (ln max - ln x) / (ln max - ln min)`. */
export function logInvScore(x, min, max) {
  if (!finite(x) || x <= 0 || min <= 0) return null;
  return max === min ? 10 : (10 * (Math.log(max) - Math.log(x))) / (Math.log(max) - Math.log(min));
}

const bounds = (values) => {
  const nums = values.filter(finite);
  return { min: Math.min(...nums), max: Math.max(...nums) };
};

/** Map language_id -> number for the rows matching `where`; missing values are left out. */
function numericMap(rows, where, field = 'value') {
  const m = new Map();
  for (const r of rows) {
    if (!where(r)) continue;
    const n = toNumber(r[field]);
    if (n !== null) m.set(r.language_id, n);
  }
  return m;
}

/** Applies `score(value, min, max)` to every entry of a map, with min and max taken over the map itself. */
function scoreMap(map, score) {
  const { min, max } = bounds([...map.values()]);
  return new Map([...map].map(([id, v]) => [id, score(v, min, max)]));
}

const SAFETY = { 'memory-safe': 10, 'memory-safe unless unsafe construct': 8, 'not memory safe': 2 };

/** The application domains checked for the Versatility axis (versatility-domains.csv). */
export const DOMAINS = ['web-frontend', 'backend', 'mobile', 'desktop', 'embedded', 'systems', 'data-ai', 'scientific-hpc', 'mainframe'];

/** Minimum number of domains with a known yes/no value for a Versatility score. */
export const MIN_KNOWN_DOMAINS = 5;

/**
 * `10 * yes / 9`: the share of all nine domains that a cited source confirms, so an unverified (n/a) domain counts as
 * not confirmed and the score is a lower bound. Null when fewer than MIN_KNOWN_DOMAINS domains are known (yes or no),
 * so a language with too little data gets a gap rather than a low score.
 */
export function domainScore(rows, id) {
  let yes = 0;
  let known = 0;
  for (const r of rows) {
    if (r.language_id !== id || !DOMAINS.includes(r.domain)) continue;
    const v = String(r.value).trim().toLowerCase();
    if (v === 'yes') { yes++; known++; } else if (v === 'no') known++;
  }
  return known >= MIN_KNOWN_DOMAINS ? (10 * yes) / DOMAINS.length : null;
}

/**
 * Computes the scores of every language in languages.csv.
 * Returns { axes: [label], scores: Map<id, (number|null)[]> aligned with axes }; the optional "Job market" axis is
 * dropped when fewer than JOB_AXIS_MIN_LANGUAGES languages have salary data.
 */
export function computeScores(data) {
  const ids = data.languages.map((l) => l.id);
  const pc = data['popularity-current'];

  // Popularity: mean of log(TIOBE rating) and lin(Stack Overflow usage); one input is enough.
  const tiobe = scoreMap(numericMap(pc, (r) => r.source === 'tiobe' && r.metric === 'rating'), logScore);
  const so = scoreMap(numericMap(pc, (r) => r.source === 'so-survey-2026' && r.metric === 'so-usage'), linScore);
  const popularity = new Map(ids.map((id) => {
    const parts = [tiobe.get(id), so.get(id)].filter(finite);
    return [id, parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : null];
  }));

  // Ecosystem: 80% of the log score of registry packages, +2 for an actively maintained implementation. n/a without a
  // registry count. A formal standard is not scored: its absence is rarely verified, so it penalised missing data.
  const eco = data.ecosystem;
  const packages = scoreMap(numericMap(eco, (r) => r.metric === 'registry_packages'), logScore);
  const active = new Map(eco.filter((r) => r.metric === 'actively_maintained')
    .map((r) => [r.language_id, String(r.value).trim().toLowerCase() === 'yes']));
  const ecosystem = new Map(ids.map((id) => {
    const p = packages.get(id);
    if (!finite(p)) return [id, null];
    return [id, 0.8 * p + (active.get(id) ? 2 : 0)];
  }));

  const perf = data.performance;
  const performance = scoreMap(numericMap(perf, (r) => r.metric === 'cpu_time_vs_fastest'), logInvScore);
  const memory = scoreMap(numericMap(perf, (r) => r.metric === 'memory_vs_fastest'), logInvScore);
  const energy = scoreMap(numericMap(data.energy, () => true, 'energy_normalized'), logInvScore);

  // Learning (ease): mean of the onboarding score (already 0-10) and loginv(gzip bytes); both are required.
  const learning = data.learning;
  const onboarding = numericMap(learning, (r) => r.metric === 'onboarding_score');
  const verbosity = scoreMap(numericMap(learning, (r) => r.metric === 'verbosity_gzip_bytes'), logInvScore);
  const ease = new Map(ids.map((id) => {
    const o = onboarding.get(id);
    const v = verbosity.get(id);
    return [id, finite(o) && finite(v) ? (o + v) / 2 : null];
  }));

  const safety = new Map(data.security.filter((r) => r.metric === 'memory_safety')
    .map((r) => [r.language_id, SAFETY[String(r.value).trim().toLowerCase()] ?? null]));

  const versatility = new Map(ids.map((id) => [id, domainScore(data['versatility-domains'] ?? [], id)]));

  const jobs = scoreMap(numericMap(data.jobs, (r) => r.source === 'so-survey-2024' && r.metric === 'so-median-salary'), linScore);

  const columns = [popularity, ecosystem, performance, memory, energy, ease, safety, versatility, jobs];
  const axes = [...AXES];
  if (jobs.size < JOB_AXIS_MIN_LANGUAGES) { columns.pop(); axes.pop(); }
  const scores = new Map(ids.map((id) => [id, columns.map((c) => { const v = c.get(id); return finite(v) ? v : null; })]));
  return { axes, scores };
}
