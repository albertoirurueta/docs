#!/usr/bin/env node
// Dependency-free SVG chart generator for the e-commerce platforms comparison page. It reuses the CSV loading and
// command line of scripts/language-charts/generate-charts.mjs and the renderers of ./renderers.mjs (which build on the
// shared and cloud comparison renderers) and writes ecommerce-comparison-<id>.svg.
// Usage: node scripts/ecommerce-comparison-charts/generate-charts.mjs [--out <dir>]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCsvFiles, runChartCli } from '../language-charts/generate-charts.mjs';
import { CHART_BUILDERS } from './chart-definitions.mjs';
import { renderEcommerceChart } from './renderers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(HERE, 'data');
export const DEFAULT_OUT_DIR = resolve(HERE, '..', '..', 'modules', 'ROOT', 'images');
export const FILE_PREFIX = 'ecommerce-comparison-';
export const CHART_DEFINITIONS = [...CHART_BUILDERS];
export const DATA_FILES = ['popularity', 'performance', 'security', 'incidents', 'cost', 'support-windows', 'radar-scores', 'sources'];

/** Loads every CSV of the data directory into a { name: rows } map (name without extension). */
export function loadData(dir = DATA_DIR) {
  return readCsvFiles(DATA_FILES, dir);
}

/** Renders and writes all definitions to `outDir` as `ecommerce-comparison-<id>.svg`; returns the written file paths. */
export function generateCharts(definitions, data, outDir) {
  mkdirSync(outDir, { recursive: true });
  return definitions.map((d) => {
    const def = typeof d === 'function' ? d(data) : d;
    const file = join(outDir, `${FILE_PREFIX}${def.id}.svg`);
    writeFileSync(file, renderEcommerceChart(def));
    return file;
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runChartCli(process.argv.slice(2), {
    script: 'scripts/ecommerce-comparison-charts/generate-charts.mjs',
    defaultOutDir: DEFAULT_OUT_DIR,
    generate: (outDir) => generateCharts(CHART_DEFINITIONS, loadData(), outDir),
  });
}
