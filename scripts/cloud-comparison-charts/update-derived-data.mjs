#!/usr/bin/env node
// Rewrites the derived rows of data/radar-scores.csv (the four computed axes; editorial rows are kept as they are) and
// data/recommendations.csv from the other CSVs. Run it after changing any input CSV.
// Usage: node scripts/cloud-comparison-charts/update-derived-data.mjs
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { loadData, DATA_DIR } from './generate-charts.mjs';
import { AXES, COMPUTED_AXES, computeScores, computedBasis } from './scores.mjs';
import { recommendationRows } from './matrix.mjs';
import { PROVIDER_IDS } from './providers.mjs';

const esc = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
export const toCsv = (header, rows) => `${[header, ...rows.map((r) => header.map((h) => r[h]))].map((r) => r.map(esc).join(',')).join('\n')}\n`;

/** Text of the new radar-scores.csv: computed rows regenerated, editorial rows kept. */
export function radarCsv(data) {
  const scores = computeScores(data);
  const basis = computedBasis(data);
  const old = data['radar-scores'];
  const rows = [];
  for (const [axis] of AXES) {
    for (const id of PROVIDER_IDS) {
      if (COMPUTED_AXES.includes(axis)) {
        rows.push({ provider_id: id, axis, score: scores[id][axis].toFixed(1), basis: basis[id][axis] });
      } else {
        rows.push(old.find((r) => r.provider_id === id && r.axis === axis));
      }
    }
  }
  return toCsv(['provider_id', 'axis', 'score', 'basis'], rows);
}

export function recommendationsCsv(data) {
  return toCsv(['workload_id', 'workload', 'provider', 'fit', 'relative_index', 'metric', 'rationale'], recommendationRows(data));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const data = loadData();
  writeFileSync(join(DATA_DIR, 'radar-scores.csv'), radarCsv(data));
  writeFileSync(join(DATA_DIR, 'recommendations.csv'), recommendationsCsv(data));
  console.log('Wrote radar-scores.csv and recommendations.csv');
}
