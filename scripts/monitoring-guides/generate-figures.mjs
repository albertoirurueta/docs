// Generates the SVG figures of the monitoring guides from the specs in figures/*.mjs.
//
//   npm run guides:figures            all specs
//   npm run guides:figures grafana-g5 one spec (the file name of figures/<name>.mjs)
//
// A spec module exports default { product: 'grafana'|'kibana', guide: 'g5' | maps: true, figures: [ { id, alt, width,
// height, nodes } ] }. The run fails when a spec has no figure, an id or file name repeats, an id does not follow the
// naming scheme, or a text run is wider than its box (see lib/blocks.mjs).
import { readdirSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderSvg, figureFileName, expectedIdPattern, writeFigure, isUpToDate } from './lib/render.mjs';
import { missingTokens } from './lib/tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const figuresDir = join(here, 'figures');
export const themesDir = join(here, 'themes');

export function specNames() {
  return readdirSync(figuresDir).filter((f) => f.endsWith('.mjs')).map((f) => basename(f, '.mjs')).sort();
}

export async function loadTheme(product) {
  let mod;
  try {
    mod = await import(pathToFileURL(join(themesDir, `${product}.mjs`)).href);
  } catch (e) {
    throw new Error(`no theme module themes/${product}.mjs (${e.message})`);
  }
  const theme = mod.default;
  const missing = missingTokens(theme);
  if (missing.length) throw new Error(`theme ${product} lacks tokens: ${missing.join(', ')}`);
  return theme;
}

// Renders every figure of the named specs (all when none is named). Returns [{ spec, name, figure, file, svg }].
export async function buildFigures(names = specNames()) {
  const out = [];
  const files = new Map();
  for (const name of names) {
    const mod = await import(pathToFileURL(join(figuresDir, `${name}.mjs`)).href);
    const spec = mod.default;
    if (!spec || !['grafana', 'kibana'].includes(spec.product)) throw new Error(`${name}: spec.product must be grafana or kibana`);
    if (!spec.maps && !/^[gk]\d+$/.test(spec.guide ?? '')) throw new Error(`${name}: spec.guide must look like g5 or k5 (or the spec must set maps: true)`);
    if (!Array.isArray(spec.figures) || spec.figures.length < 1) throw new Error(`${name}: a spec needs at least one figure`);
    const theme = await loadTheme(spec.product);
    const ids = new Set();
    for (const figure of spec.figures) {
      if (ids.has(figure.id)) throw new Error(`${name}: figure id "${figure.id}" repeats`);
      ids.add(figure.id);
      if (!expectedIdPattern(spec).test(figure.id)) throw new Error(`${name}: figure id "${figure.id}" must be ${spec.maps ? '<area>' : '<nn>-<what>'} in lower-case kebab-case`);
      const file = figureFileName(spec, figure);
      if (files.has(file)) throw new Error(`${name}: file ${file} is also produced by ${files.get(file)}`);
      files.set(file, name);
      let svg;
      try {
        svg = renderSvg({ ...figure, theme, svgId: file.replace(/\.svg$/, '') });
      } catch (e) {
        throw new Error(`${name}: ${e.message}`);
      }
      out.push({ spec, name, figure, file, svg });
    }
  }
  return out;
}

export async function main(argv) {
  const check = argv.includes('--check');
  const names = argv.filter((a) => !a.startsWith('--'));
  const all = specNames();
  for (const n of names) if (!all.includes(n)) throw new Error(`no spec figures/${n}.mjs (available: ${all.join(', ') || 'none'})`);
  const built = await buildFigures(names.length ? names : all);
  let stale = 0, written = 0;
  for (const b of built) {
    if (check) {
      if (!isUpToDate(b.file, b.svg)) { stale++; console.error(`stale or missing: ${b.file}`); }
    } else if (writeFigure(b.file, b.svg)) written++;
  }
  if (check && stale) throw new Error(`${stale} figure(s) are not up to date; run npm run guides:figures`);
  console.log(check ? `checked ${built.length} figures from ${names.length || all.length} specs` : `rendered ${built.length} figures from ${names.length || all.length} specs, wrote ${written} that changed`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2)).catch((e) => { console.error(`error: ${e.message}`); process.exit(1); });
}
