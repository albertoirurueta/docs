#!/usr/bin/env node
// Dependency-free SVG chart generator for the "Documentation Tools" comparison page. It reuses the CSV loading, renderers
// and command line of scripts/language-charts/generate-charts.mjs and writes documentation-tools-comparison-<id>.svg.
// Usage: node scripts/documentation-tools-charts/generate-charts.mjs [--out <dir>]
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCsvFiles, writeCharts, runChartCli } from '../language-charts/generate-charts.mjs';
import { CHART_BUILDERS } from './chart-definitions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(HERE, 'data');
export const DEFAULT_OUT_DIR = resolve(HERE, '..', '..', 'modules', 'ROOT', 'images');
export const FILE_PREFIX = 'documentation-tools-comparison-';
export const CHART_DEFINITIONS = [...CHART_BUILDERS];
export const DATA_FILES = ['tools', 'current', 'releases', 'downloads-npm-monthly', 'downloads-pypi-weekly',
  'radar-scores', 'adopters', 'trends', 'sources'];

/** Loads every CSV of the data directory into a { name: rows } map (name without extension). */
export function loadData(dir = DATA_DIR) {
  return readCsvFiles(DATA_FILES, dir);
}

/** Renders and writes all definitions to `outDir`; returns the written file paths. */
export function generateCharts(definitions, data, outDir) {
  return writeCharts(definitions, data, outDir, FILE_PREFIX);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runChartCli(process.argv.slice(2), {
    script: 'scripts/documentation-tools-charts/generate-charts.mjs',
    defaultOutDir: DEFAULT_OUT_DIR,
    generate: (outDir) => generateCharts(CHART_DEFINITIONS, loadData(), outDir),
  });
}
