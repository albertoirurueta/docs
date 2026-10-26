#!/usr/bin/env node
// Dependency-free SVG chart generator for the "Comparing cloud providers" page. It reuses the CSV loading, shared
// renderers and command line of scripts/language-charts/generate-charts.mjs, adds the grouped bar, panel and grid
// renderers of ./renderers.mjs and writes cloud-comparison-<id>.svg.
// Usage: node scripts/cloud-comparison-charts/generate-charts.mjs [--out <dir>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCsvFiles, runChartCli } from '../language-charts/generate-charts.mjs';
import { CHART_BUILDERS } from './chart-definitions.mjs';
import { renderCloudChart } from './renderers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(HERE, 'data');
export const DEFAULT_OUT_DIR = resolve(HERE, '..', '..', 'modules', 'ROOT', 'images');
export const FILE_PREFIX = 'cloud-comparison-';
export const CHART_DEFINITIONS = [...CHART_BUILDERS];
export const DATA_FILES = ['market-share', 'revenue', 'adoption', 'analyst', 'pricing', 'free-tiers', 'discounts',
  'reference-architectures', 'reference-totals', 'regions-over-time', 'footprint', 'sovereign', 'service-availability',
  'service-mapping', 'tooling', 'learning', 'other-metrics', 'radar-scores', 'sources'];

/** Loads every CSV of the data directory into a { name: rows } map (name without extension). */
export function loadData(dir = DATA_DIR) {
  return readCsvFiles(DATA_FILES, dir);
}

/** Renders and writes all definitions to `outDir` as `cloud-comparison-<id>.svg`; returns the written file paths. */
export function generateCharts(definitions, data, outDir) {
  mkdirSync(outDir, { recursive: true });
  return definitions.map((d) => {
    const def = typeof d === 'function' ? d(data) : d;
    const file = join(outDir, `${FILE_PREFIX}${def.id}.svg`);
    writeFileSync(file, renderCloudChart(def));
    return file;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runChartCli(process.argv.slice(2), {
    script: 'scripts/cloud-comparison-charts/generate-charts.mjs',
    defaultOutDir: DEFAULT_OUT_DIR,
    generate: (outDir) => generateCharts(CHART_DEFINITIONS, loadData(), outDir),
  });
}
