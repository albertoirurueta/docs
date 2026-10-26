// Workload-versus-provider recommendation matrix. Every cell is derived from the CSVs (never typed in by hand), so the
// figure and the table of the comparison page share one rationale. data/recommendations.csv holds the computed rows and
// a test keeps it in sync; regenerate with `node scripts/cloud-comparison-charts/update-derived-data.mjs`.
import { toNumber } from '../language-charts/data-utils.mjs';
import { PROVIDER_IDS, providerId, providerName } from './providers.mjs';
import { AXES, architectureTotals, computeScores } from './scores.mjs';

export const FIT_LEVELS = [
  { id: 'best', label: 'Best fit', min: 0.95 },
  { id: 'good', label: 'Good fit', min: 0.8 },
  { id: 'acceptable', label: 'Acceptable', min: 0 },
];
export const MISSING_FIT = 'n/a';

/** Fit level id for a value relative to the best provider (1 = best); `n/a` when missing. */
export function fitFor(ratio) {
  if (ratio === null || !Number.isFinite(ratio)) return MISSING_FIT;
  return FIT_LEVELS.find((l) => ratio >= l.min).id;
}

const fmt2 = (v) => v.toFixed(2);

/** Share of the frontier-LLM cells (model x region) of service-availability.csv that are available, per provider. */
export function llmAvailability(rows) {
  const out = Object.fromEntries(PROVIDER_IDS.map((id) => [id, { available: 0, total: 0 }]));
  for (const r of rows.filter((x) => x.category.startsWith('Frontier LLM'))) {
    const id = providerId(r.provider);
    if (!id) continue;
    out[id].total += 1;
    if (r.value === 'available') out[id].available += 1;
  }
  return out;
}

const architectureWorkload = (arch, id, label) => ({
  id, label,
  metric: `Monthly list-price total of the ${arch} reference architecture (cheapest = 100)`,
  higherIsBetter: true,
  value: (data) => {
    const t = architectureTotals(data['reference-totals'])[arch] ?? {};
    const min = Math.min(...Object.values(t));
    return Object.fromEntries(PROVIDER_IDS.map((p) => [p, typeof t[p] === 'number'
      ? { v: min / t[p], text: `${fmt2(t[p])} USD per month against ${fmt2(min)} for the cheapest` } : null]));
  },
});

const axisLabel = (axis) => (AXES.find(([a]) => a === axis)?.[1] ?? axis).toLowerCase();

const axisWorkload = (axis, id, label, metric) => ({
  id, label, metric, higherIsBetter: true,
  value: (data) => {
    const s = computeScores(data);
    const max = Math.max(0, ...PROVIDER_IDS.map((p) => s[p][axis] ?? 0));
    return Object.fromEntries(PROVIDER_IDS.map((p) => [p, s[p][axis] === null || !(max > 0) ? null
      : { v: s[p][axis] / max, text: `radar score ${s[p][axis].toFixed(1)} of 10 for ${axisLabel(axis)}` }]));
  },
});

export const WORKLOADS = [
  architectureWorkload('static-site', 'static-site', 'Static website'),
  architectureWorkload('simple-dynamic-site', 'dynamic-site', 'Dynamic site with a database'),
  architectureWorkload('microservices', 'microservices', 'Microservices on Kubernetes'),
  {
    id: 'ai-service', label: 'AI service with managed LLMs',
    metric: 'Mean of the AI-service architecture price index and the share of frontier-model and region combinations that are available',
    higherIsBetter: true,
    value: (data) => {
      const t = architectureTotals(data['reference-totals'])['ai-service'] ?? {};
      const min = Math.min(...Object.values(t));
      const llm = llmAvailability(data['service-availability']);
      return Object.fromEntries(PROVIDER_IDS.map((p) => {
        if (typeof t[p] !== 'number' || llm[p].total === 0) return [p, null];
        const price = min / t[p];
        const avail = llm[p].available / llm[p].total;
        return [p, { v: (price + avail) / 2, text: `${fmt2(t[p])} USD per month; ${llm[p].available} of ${llm[p].total} model and region combinations available` }];
      }));
    },
  },
  axisWorkload('regional_coverage', 'global-reach', 'Global reach and sovereignty', 'Regional coverage radar score'),
  axisWorkload('ecosystem_breadth', 'catalogue', 'Broad service catalogue', 'Ecosystem breadth radar score'),
  axisWorkload('ease_of_use', 'onboarding', 'Team onboarding and learning', 'Ease of use radar score (editorial)'),
  axisWorkload('popularity', 'talent-market', 'Hiring and community support', 'Popularity radar score'),
];

/** Rows of the matrix: { workload_id, workload, provider, fit, relative_index, metric, rationale }. */
export function recommendationRows(data) {
  const rows = [];
  for (const w of WORKLOADS) {
    const values = w.value(data);
    for (const p of PROVIDER_IDS) {
      const cell = values[p];
      rows.push({
        workload_id: w.id, workload: w.label, provider: p,
        fit: cell ? fitFor(cell.v) : MISSING_FIT,
        relative_index: cell ? String(Math.round(cell.v * 100)) : 'n/a',
        metric: w.metric,
        rationale: cell ? `${providerName(p)}: ${cell.text}` : `${providerName(p)}: n/a (no data)`,
      });
    }
  }
  return rows;
}

/** Spec of the matrix figure: rows are workloads, columns are the providers. */
export function recommendationSpecRows(data) {
  const rows = recommendationRows(data);
  return WORKLOADS.map((w) => ({
    label: w.label,
    cells: PROVIDER_IDS.map((p) => {
      const r = rows.find((x) => x.workload_id === w.id && x.provider === p);
      return { fit: r.fit, index: toNumber(r.relative_index), tip: r.rationale };
    }),
  }));
}
