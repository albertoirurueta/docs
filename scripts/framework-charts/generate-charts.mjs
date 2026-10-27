#!/usr/bin/env node
// Dependency-free SVG chart generator for the "Backend Frameworks Comparison" and "Web Frameworks Comparison" pages.
// It reuses the CSV loading, renderers and command line of scripts/language-charts/generate-charts.mjs (and the extra
// renderers of scripts/cloud-comparison-charts through ./renderers.mjs) and writes
// backend-frameworks-comparison-<id>.svg and web-frameworks-comparison-<id>.svg. A chart whose data is entirely n/a
// is skipped and reported instead of being drawn empty, and its previously generated SVG is deleted.
// Usage: node scripts/framework-charts/generate-charts.mjs [--out <dir>]
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { readCsvFiles, runChartCli } from '../language-charts/generate-charts.mjs';
import { CHART_BUILDERS } from './chart-definitions.mjs';
import { renderFrameworkChart } from './renderers.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(HERE, 'data');
export const DEFAULT_OUT_DIR = resolve(HERE, '..', '..', 'modules', 'ROOT', 'images');
export const DATA_FILES = ['frameworks', 'sources', 'popularity', 'popularity-history', 'downloads-npm', 'downloads-pypi',
  'downloads-packagist', 'downloads-nuget', 'downloads-crates', 'downloads-rubygems', 'downloads-hex', 'github',
  'github-stars-history', 'jobs', 'jobs-history', 'performance-techempower', 'performance-startup-memory',
  'performance-web', 'concurrency', 'ecosystem', 'releases', 'productivity', 'security', 'radar-scores', 'recommendations'];
export const CHART_DEFINITIONS = [...CHART_BUILDERS];

/** Loads every CSV of the data directory into a { name: rows } map (name without extension). */
export function loadData(dir = DATA_DIR) {
  return readCsvFiles(DATA_FILES, dir);
}

/**
 * Builds every spec; specs with `skip` (all data n/a) are reported, not drawn. Each spec's `file` is the full file
 * name without extension (page prefix included). Returns { written, skipped }.
 */
export function generateCharts(definitions, data, outDir) {
  mkdirSync(outDir, { recursive: true });
  const written = [];
  const skipped = [];
  for (const d of definitions) {
    const spec = typeof d === 'function' ? d(data) : d;
    const file = join(outDir, `${spec.file}.svg`);
    // A skipped chart's previous SVG is deleted so outdated figures are never published; the page's image:: macro then
    // fails the Antora build until it is removed.
    if (spec.skip) { rmSync(file, { force: true }); skipped.push(`${spec.file}: ${spec.skip}`); continue; }
    writeFileSync(file, renderFrameworkChart(spec));
    written.push(file);
  }
  return { written, skipped };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runChartCli(process.argv.slice(2), {
    script: 'scripts/framework-charts/generate-charts.mjs',
    defaultOutDir: DEFAULT_OUT_DIR,
    generate: (outDir) => {
      const { written, skipped } = generateCharts(CHART_DEFINITIONS, loadData(), outDir);
      for (const s of skipped) console.log(`Skipped (no data, previous SVG removed): ${s}`);
      return written;
    },
  });
}
