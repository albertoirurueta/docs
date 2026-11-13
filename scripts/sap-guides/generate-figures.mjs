// Generates the SVG figures of the SAP guides from the specs in figures/*.mjs.
//
//   npm run sap-guides:figures                      all specs
//   npm run sap-guides:figures sap-first-cap        one spec (the file name of figures/<name>.mjs)
//   node scripts/sap-guides/generate-figures.mjs --check   fail when a figure is stale or missing
//
// A spec module exports default { area, theme, guide | maps: true, figures: [ { id, alt, width, height, nodes, theme? } ] }.
//   area   abap | general | finance | hr (lib/guide-maps.mjs maps it to the page folder)
//   theme  a module name in themes/ (sap-fiori, vscode, terminal, browser); a figure may override it, and a map figure may
//          override area (the four screen maps live in one spec but belong to different areas)
//   guide  the guide's page name without "guide-" and ".adoc", in kebab-case (first-cap-service)
// Files: sap-<area>-guide-<guide>-<nn>-<what>.svg and sap-<area>-map-<screen>.svg. The run fails when a spec has no figure,
// an id or file name repeats, an id does not follow the scheme, or a text run is wider than its box (see
// figure-lib/blocks.mjs). The renderer, building blocks and token contract are shared with scripts/monitoring-guides.
import { readdirSync, existsSync } from 'node:fs';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { renderSvg, writeFigure, isUpToDate } from '../figure-lib/render.mjs';
import { missingTokens } from '../figure-lib/tokens.mjs';
import { areaDirs } from './lib/guide-maps.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const figuresDir = join(here, 'figures');
export const themesDir = join(here, 'themes');
export const themeNames = ['sap-fiori', 'vscode', 'terminal', 'browser'];
export const areas = Object.keys(areaDirs);

export function specNames() {
  return existsSync(figuresDir) ? readdirSync(figuresDir).filter((f) => f.endsWith('.mjs')).map((f) => basename(f, '.mjs')).sort() : [];
}

export async function loadTheme(name) {
  let mod;
  try {
    mod = await import(pathToFileURL(join(themesDir, `${name}.mjs`)).href);
  } catch (e) {
    throw new Error(`no theme module themes/${name}.mjs (${e.message})`);
  }
  const theme = mod.default;
  const missing = missingTokens(theme);
  if (missing.length) throw new Error(`theme ${name} lacks tokens: ${missing.join(', ')}`);
  return theme;
}

export function figureFileName(spec, figure) {
  const area = figure.area ?? spec.area;
  return `${spec.maps ? `sap-${area}-map-${figure.id}` : `sap-${area}-guide-${spec.guide}-${figure.id}`}.svg`;
}

export function expectedIdPattern(spec) {
  return spec.maps ? /^[a-z0-9]+(-[a-z0-9]+)*$/ : /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;
}

// Renders every figure of the named specs (all when none is named). Returns [{ spec, name, figure, file, svg }].
export async function buildFigures(names = specNames()) {
  const out = [];
  const files = new Map();
  for (const name of names) {
    const mod = await import(pathToFileURL(join(figuresDir, `${name}.mjs`)).href);
    const spec = mod.default;
    if (!spec || !areas.includes(spec.area)) throw new Error(`${name}: spec.area must be one of ${areas.join(', ')}`);
    if (!themeNames.includes(spec.theme)) throw new Error(`${name}: spec.theme must be one of ${themeNames.join(', ')}`);
    if (!spec.maps && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(spec.guide ?? '')) throw new Error(`${name}: spec.guide must be the guide's page name in kebab-case (or the spec must set maps: true)`);
    if (!Array.isArray(spec.figures) || spec.figures.length < 1) throw new Error(`${name}: a spec needs at least one figure`);
    const ids = new Set();
    for (const figure of spec.figures) {
      if (ids.has(figure.id)) throw new Error(`${name}: figure id "${figure.id}" repeats`);
      ids.add(figure.id);
      if (!expectedIdPattern(spec).test(figure.id)) throw new Error(`${name}: figure id "${figure.id}" must be ${spec.maps ? '<screen>' : '<nn>-<what>'} in lower-case kebab-case`);
      if (figure.area && !areas.includes(figure.area)) throw new Error(`${name}: figure ${figure.id} names the unknown area ${figure.area}`);
      const themeName = figure.theme ?? spec.theme;
      if (!themeNames.includes(themeName)) throw new Error(`${name}: figure ${figure.id} names the unknown theme ${themeName}`);
      const theme = await loadTheme(themeName);
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
  if (check && stale) throw new Error(`${stale} figure(s) are not up to date; run npm run sap-guides:figures`);
  console.log(check ? `checked ${built.length} figures from ${names.length || all.length} specs` : `rendered ${built.length} figures from ${names.length || all.length} specs, wrote ${written} that changed`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main(process.argv.slice(2)).catch((e) => { console.error(`error: ${e.message}`); process.exit(1); });
}
