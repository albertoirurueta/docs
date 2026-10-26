// 0-10 radar scores for the documentation tools comparison. Eight axes are editorial scores read from
// data/radar-scores.csv (rubric in data/NOTES.md); "ecosystem" and "maintenance" are computed from the metric CSVs.
import { toNumber } from '../language-charts/data-utils.mjs';

export const AXES = [
  ['setup', 'Ease of setup'],
  ['authoring', 'Authoring power'],
  ['multi_repo', 'Multi-repo aggregation'],
  ['versioning', 'Versioning'],
  ['api', 'API reference'],
  ['customisation', 'Customisation'],
  ['search', 'Search'],
  ['ecosystem', 'Ecosystem'],
  ['build_speed', 'Build speed'],
  ['maintenance', 'Maintenance health'],
];
export const COMPUTED_AXES = ['ecosystem', 'maintenance'];

const clamp = (v, lo = 0, hi = 10) => Math.min(hi, Math.max(lo, v));
const round1 = (v) => Math.round(v * 10) / 10;

/** Whole months between two ISO dates (fractional), never negative. */
export function monthsBetween(fromIso, toIso) {
  const a = new Date(`${fromIso}T00:00:00Z`);
  const b = new Date(`${toIso}T00:00:00Z`);
  return Math.max(0, (b - a) / (1000 * 60 * 60 * 24 * 30.4375));
}

/** Ecosystem: log-scaled repository stars, 100 stars = 0, 100,000 stars = 10. */
export function ecosystemScore(stars) {
  const s = toNumber(stars);
  if (s === null || s <= 0) return null;
  return round1(clamp(((Math.log10(s) - 2) / 3) * 10));
}

/**
 * Maintenance: mean of release recency (10 minus the months since the latest stable release), cadence (stable
 * releases in the 12 months before the snapshot, 12 or more = 10) and the share of closed issues times 10.
 */
export function maintenanceScore({ latestDate, snapshot, releasesLast12m, openIssues, closedIssues }) {
  const open = toNumber(openIssues);
  const closed = toNumber(closedIssues);
  if (!latestDate || open === null || closed === null || open + closed === 0) return null;
  const recency = clamp(10 - monthsBetween(latestDate, snapshot));
  const cadence = clamp((releasesLast12m / 12) * 10);
  const closedShare = (closed / (open + closed)) * 10;
  return round1((recency + cadence + closedShare) / 3);
}

/** Stable releases whose date is within the 365 days up to and including `snapshot`. */
export function releasesInLastYear(releases, toolId, snapshot) {
  const end = new Date(`${snapshot}T00:00:00Z`).getTime();
  const start = end - 365 * 86400000;
  return releases.filter((r) => r.tool_id === toolId).filter((r) => {
    const t = new Date(`${r.date}T00:00:00Z`).getTime();
    return t > start && t <= end;
  }).length;
}

/** Returns { toolId: { axisId: score } } using the CSV data map. */
export function computeScores(data) {
  const out = {};
  for (const t of data.tools) out[t.id] = {};
  for (const r of data['radar-scores']) {
    const v = toNumber(r.score);
    if (v !== null && out[r.tool_id]) out[r.tool_id][r.axis] = v;
  }
  for (const c of data.current) {
    const snapshot = c.retrieved;
    out[c.tool_id] ??= {};
    out[c.tool_id].ecosystem = ecosystemScore(c.stars);
    out[c.tool_id].maintenance = maintenanceScore({
      latestDate: c.release_date, snapshot,
      releasesLast12m: releasesInLastYear(data.releases, c.tool_id, snapshot),
      openIssues: c.open_issues, closedIssues: c.closed_issues,
    });
  }
  return out;
}
