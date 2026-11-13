// Tests of the SAP guide figure generator (npm run test:sap-guides). The checks on guide pages hold vacuously while there
// is none, and become meaningful as guides and their figure specs are added. They mirror scripts/monitoring-guides.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFigures, specNames, figuresDir, themesDir, themeNames, loadTheme, areas, figureFileName } from './generate-figures.mjs';
import { renderSvg, imagesDir, isUpToDate } from '../figure-lib/render.mjs';
import { tokenPaths, missingTokens } from '../figure-lib/tokens.mjs';
import { TextOverflowError } from '../figure-lib/blocks.mjs';
import { mapGuides, areaDirs } from './lib/guide-maps.mjs';
import * as shells from './lib/sap-shells.mjs';

const here = dirname(fileURLToPath(import.meta.url));
let cache;
const allFigures = () => (cache ??= buildFigures());
const root = resolve(here, '..', '..');
const pagesRoot = join(root, 'modules', 'ROOT', 'pages');
const areaDir = (area) => join(pagesRoot, ...areaDirs[area]);

const guidePages = () => areas.flatMap((area) => {
  const dir = areaDir(area);
  return existsSync(dir) ? readdirSync(dir).filter((f) => /^guide-.*\.adoc$/.test(f)).map((f) => ({ area, file: join(dir, f), name: f })) : [];
});
function allPages(dir = pagesRoot) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? allPages(join(dir, e.name)) : e.name.endsWith('.adoc') ? [join(dir, e.name)] : []));
}

// ---------------------------------------------------------------- themes
test('the four themes exist and define every token of the contract', async () => {
  assert.deepEqual([...themeNames].sort(), ['browser', 'sap-fiori', 'terminal', 'vscode']);
  for (const t of themeNames) {
    assert.ok(existsSync(join(themesDir, `${t}.mjs`)), `themes/${t}.mjs`);
    assert.deepEqual(missingTokens(await loadTheme(t)), [], `theme ${t}`);
  }
  assert.ok(tokenPaths.length > 50);
});

test('the Fiori theme records the licence and its sources, and the VS Code themes the editor version', () => {
  const fiori = readFileSync(join(themesDir, 'sap-fiori.mjs'), 'utf8');
  assert.match(fiori, /Apache-2\.0/);
  assert.match(fiori, /OpenUI5 1\.154\.0/);
  assert.match(fiori, /Confirmed in the lab/);
  for (const t of ['vscode', 'terminal']) assert.match(readFileSync(join(themesDir, `${t}.mjs`), 'utf8'), /1\.135\.0/);
});

test('the SAP shells and specs never draw a logo, and the shell bar uses the neutral placeholder', () => {
  const sources = [join(here, 'lib', 'sap-shells.mjs'), ...readdirSync(figuresDir).map((f) => join(figuresDir, f))];
  for (const f of sources) {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /block:\s*'logo'/, `${f} draws a logo block`);
    assert.doesNotMatch(src, /\bsi:sap\b|vendor:sap/, `${f} uses an SAP mark`);
  }
  assert.match(readFileSync(join(here, 'lib', 'sap-shells.mjs'), 'utf8'), /placeholder mark/);
});

// ---------------------------------------------------------------- the shells and the renderer
test('every shell renders with its theme, deterministically', async () => {
  const cases = [
    ['sap-fiori', () => shells.fioriShell({ h: 400, children: shells.fioriListReport().nodes })],
    ['sap-fiori', () => shells.fioriShell({ h: 500, children: shells.fioriObjectPage({ edit: true }).nodes })],
    ['sap-fiori', () => shells.ui5AppFrame({ h: 300, items: ['a', 'b'] }).nodes],
    ['vscode', () => shells.vscodeShell({ explorer: [{ label: 'srv', folder: true, open: true }, { label: 'a.cds', indent: 1, active: true }], code: [[{ t: 'service', kind: 'keyword' }, { t: ' S {}' }]], terminal: ['$ ls'] }).nodes],
    ['browser', () => shells.browserShell({ lines: [[{ t: '{ "value": [] }' }]] }).nodes],
    ['terminal', () => shells.terminalShell({ lines: ['$ node -v'] }).nodes],
  ];
  for (const [themeName, make] of cases) {
    const theme = await loadTheme(themeName);
    const args = { id: 'shell', alt: 'A shell', width: shells.FW, height: 600, theme, nodes: make() };
    const a = renderSvg(args);
    assert.equal(a, renderSvg(args), 'same spec, same bytes');
    assert.doesNotMatch(a, /NaN|undefined/);
    assert.match(a, /<text /);
  }
});

test('a text run wider than its box is an error', async () => {
  const theme = await loadTheme('sap-fiori');
  const f = (node) => renderSvg({ id: 'x', alt: 'x', width: 1080, height: 100, theme, nodes: [node] });
  assert.throws(() => f({ block: 'button', x: 0, y: 0, w: 40, label: 'A very long button label' }), TextOverflowError);
  assert.doesNotThrow(() => f({ block: 'button', x: 0, y: 0, w: 120, label: 'Save' }));
});

// ---------------------------------------------------------------- specs and guides
test('every spec has at least one figure, unique ids and file names, non-empty alt text and a known area and theme', async () => {
  const built = await allFigures();
  const names = new Set();
  for (const b of built) {
    assert.ok(b.figure.alt && b.figure.alt.trim(), `${b.file} has no alt text`);
    assert.ok(!names.has(b.file), `${b.file} repeats`);
    names.add(b.file);
    assert.ok(areas.includes(b.figure.area ?? b.spec.area), `${b.file}: area`);
    assert.match(b.file, /^sap-(abap|general|finance|hr)-(guide-[a-z0-9-]+-\d{2}-[a-z0-9-]+|map-[a-z0-9-]+)\.svg$/);
  }
  for (const n of specNames()) assert.ok(built.some((b) => b.name === n), `${n} has no figure`);
});

test('each generated file is up to date with its spec', async () => {
  for (const b of await allFigures()) assert.ok(isUpToDate(b.file, b.svg), `${b.file} is missing or stale; run npm run sap-guides:figures`);
});

test('no generated SAP guide or map file is an orphan', async () => {
  const expected = new Set((await allFigures()).map((b) => b.file));
  for (const f of readdirSync(imagesDir)) {
    if (/^sap-(abap|general|finance|hr)-(guide|map)-.*\.svg$/.test(f)) assert.ok(expected.has(f), `${f} has no spec`);
  }
});

test('every guide figure is referenced by exactly one page, by bare file name, and that page is its guide', async () => {
  const built = (await allFigures()).filter((b) => !b.spec.maps);
  if (!built.length) return;
  const shownBy = new Map();
  const withPath = new Map();
  const add = (m, k, v) => m.set(k, [...(m.get(k) ?? []), v]);
  for (const f of allPages()) {
    const src = readFileSync(f, 'utf8');
    if (!src.includes('sap-')) continue;
    for (const m of src.matchAll(/^image::([^[\s]+)\[/gm)) add(shownBy, m[1], f);
    for (const m of src.matchAll(/\/(sap-[a-z0-9-]+\.svg)/g)) add(withPath, m[1], f);
  }
  for (const b of built) {
    const refs = shownBy.get(b.file) ?? [];
    assert.equal(refs.length, 1, `${b.file} is referenced by ${refs.length} pages`);
    assert.equal(refs[0], join(areaDir(b.figure.area ?? b.spec.area), `guide-${b.spec.guide}.adoc`), `${b.file} must be shown by guide-${b.spec.guide}.adoc`);
    assert.deepEqual(withPath.get(b.file) ?? [], [], `${b.file} referenced with a path`);
  }
});

test('every screen map has a designated guide, and is shown by it once the guide exists', async () => {
  const maps = (await allFigures()).filter((b) => b.spec.maps);
  const seen = new Set();
  const pages = allPages().map((f) => ({ f, src: readFileSync(f, 'utf8') }));
  for (const b of maps) {
    const area = b.figure.area ?? b.spec.area;
    const guide = mapGuides[area]?.[b.figure.id];
    assert.ok(guide, `map ${b.figure.id} of ${area} has no designated guide in lib/guide-maps.mjs`);
    seen.add(`${area}/${b.figure.id}`);
    const page = join(areaDir(area), `guide-${guide}.adoc`);
    const refs = pages.filter((p) => p.src.split('\n').some((l) => l.startsWith(`image::${b.file}[`)));
    if (existsSync(page)) {
      assert.deepEqual(refs.map((r) => r.f), [page], `${b.file} must be shown exactly by guide-${guide}.adoc`);
      const src = readFileSync(page, 'utf8');
      const at = src.indexOf(`image::${b.file}[`);
      const firstStep = src.search(/^\[start=\d+\]|^\. /m);
      assert.ok(firstStep === -1 || at < firstStep, `${b.file} must come before the first numbered step of guide-${guide}.adoc`);
    } else {
      assert.equal(refs.length, 0, `${b.file} is referenced although guide-${guide}.adoc does not exist yet`);
    }
  }
  for (const [area, list] of Object.entries(mapGuides)) for (const screen of Object.keys(list)) assert.ok(seen.has(`${area}/${screen}`), `lib/guide-maps.mjs names a map ${area}/${screen} that has no figure`);
});

test('the four screen maps of the plan exist', async () => {
  const files = (await allFigures()).filter((b) => b.spec.maps).map((b) => b.file).sort();
  assert.deepEqual(files, [
    'sap-abap-map-abaplint-terminal.svg',
    'sap-general-map-fiori-list-report.svg',
    'sap-general-map-fiori-object-page.svg',
    'sap-general-map-vscode-cap-project.svg',
  ]);
});

test('every guide image target exists, and every step group of a guide has a figure', async () => {
  const files = new Set((await allFigures()).map((b) => b.file));
  for (const g of guidePages()) {
    const src = readFileSync(g.file, 'utf8');
    for (const m of src.matchAll(/^image::(sap-(?:abap|general|finance|hr)-(?:guide|map)-[^[]+)\[/gm)) assert.ok(files.has(m[1]) && existsSync(join(imagesDir, m[1])), `${g.name}: ${m[1]} has no spec or file`);
    const steps = src.split(/^== /m).find((s) => /^Steps\s*$/m.test(s.split('\n')[0]));
    if (!steps) continue;
    for (const grp of steps.split(/^=== /m).slice(1)) {
      if (!/^\s*(\.+|\d+\.)\s+\S/m.test(grp)) continue;
      assert.match(grp, new RegExp(`^image::sap-${g.area}-guide-`, 'm'), `${g.name}: step group "${grp.split('\n')[0]}" has no figure`);
    }
  }
});

test('figure specs and shells hard-code no colour (only theme tokens)', () => {
  const sources = [join(here, 'lib', 'sap-shells.mjs'), ...readdirSync(figuresDir).filter((x) => x.endsWith('.mjs')).map((f) => join(figuresDir, f))];
  for (const f of sources) {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /#[0-9a-fA-F]{3,8}\b/, `${f} has a hex colour`);
    assert.doesNotMatch(src, /\b(rgba?|hsla?|oklch|hwb)\s*\(/, `${f} has a functional colour`);
    assert.doesNotMatch(src, /['"](red|green|blue|orange|yellow|pink|purple|black|white|gray|grey|teal|cyan|magenta|brown)['"]/i, `${f} has a named colour`);
  }
});

test('ids inside a figure are derived from its file name, so inlined figures never collide', async () => {
  const seen = new Map();
  for (const b of await allFigures()) {
    for (const id of [...b.svg.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])) {
      assert.ok(id.startsWith(b.file.replace(/\.svg$/, '')), `${b.file} has id ${id}`);
      assert.ok(!seen.has(id) || seen.get(id) === b.file, `id ${id} is used by ${seen.get(id)} and ${b.file}`);
      seen.set(id, b.file);
    }
  }
});

test('figureFileName follows the naming scheme', () => {
  assert.equal(figureFileName({ area: 'general', guide: 'first-cap-service' }, { id: '01-new-project' }), 'sap-general-guide-first-cap-service-01-new-project.svg');
  assert.equal(figureFileName({ area: 'general', maps: true }, { id: 'fiori-list-report', area: 'abap' }), 'sap-abap-map-fiori-list-report.svg');
});
