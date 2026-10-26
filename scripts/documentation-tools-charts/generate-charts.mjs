#!/usr/bin/env node
// Dependency-free SVG chart generator for the "Documentation Tools" comparison page. It reuses the CSV parser, scales
// and renderers of scripts/language-charts/generate-charts.mjs and writes documentation-tools-comparison-<id>.svg.
// Usage: node scripts/documentation-tools-charts/generate-charts.mjs [--out <dir>]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCsv, renderChart } from '../language-charts/generate-charts.mjs';
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
  return Object.fromEntries(DATA_FILES.map((n) => [n, readCsv(`${n}.csv`, dir)]));
}

/** Renders and writes all definitions to `outDir`; returns the written file paths. */
export function generateCharts(definitions, data, outDir) {
  mkdirSync(outDir, { recursive: true });
  return definitions.map((d) => {
    const def = typeof d === 'function' ? d(data) : d;
    const file = join(outDir, `${FILE_PREFIX}${def.id}.svg`);
    writeFileSync(file, renderChart(def));
    return file;
  });
}

function main(argv) {
  const i = argv.indexOf('--out');
  if (i >= 0 && (argv[i + 1] === undefined || argv[i + 1].startsWith('--'))) {
    console.error('Usage: node scripts/documentation-tools-charts/generate-charts.mjs [--out <dir>]');
    process.exitCode = 2;
    return;
  }
  const outDir = i >= 0 ? resolve(argv[i + 1]) : DEFAULT_OUT_DIR;
  const files = generateCharts(CHART_DEFINITIONS, loadData(), outDir);
  console.log(`Wrote ${files.length} chart(s) to ${outDir}`);
  files.forEach((f) => console.log(`  ${f}`));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2));
