// Tests of the monitoring guide figure generator (npm run test:guides). The checks on specs and guide pages hold
// vacuously while there is none, and become meaningful as guides and their figure specs are added.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFigures, specNames, figuresDir, themesDir, loadTheme } from './generate-figures.mjs';
import { renderSvg, imagesDir, isUpToDate } from './lib/render.mjs';
import { tokenPaths, missingTokens, tok } from './lib/tokens.mjs';
import { blocks, TextOverflowError } from './lib/blocks.mjs';
import { textWidth } from './lib/text.mjs';
import { mapGuides } from './lib/guide-maps.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..');
const section = join(root, 'modules', 'ROOT', 'pages', 'backend', 'monitoring-alerting');
const products = ['grafana', 'kibana'];

const guidePages = () => products.flatMap((p) => {
  const dir = join(section, p);
  return existsSync(dir) ? readdirSync(dir).filter((f) => /^guide-.*\.adoc$/.test(f)).map((f) => ({ product: p, file: join(dir, f), name: f })) : [];
});
function allPages(dir = join(root, 'modules', 'ROOT', 'pages')) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? allPages(join(dir, e.name)) : e.name.endsWith('.adoc') ? [join(dir, e.name)] : []));
}

// ---------------------------------------------------------------- themes (Task 6.3)
test('both themes define every token of the contract and the blocks library reads only contract tokens', async () => {
  for (const p of products) assert.deepEqual(missingTokens(await loadTheme(p)), [], `theme ${p}`);
  const src = readFileSync(join(here, 'lib', 'blocks.mjs'), 'utf8');
  const literal = [...src.matchAll(/['"`]((?:colour|font|size|radius)\.[A-Za-z.]+)['"`]/g)].map((m) => m[1]);
  for (const t of literal) assert.ok(tokenPaths.includes(t), `blocks.mjs reads token ${t}, which is not in lib/tokens.mjs`);
});

test('themes state their version and that the values were read from the lab', () => {
  for (const p of products) {
    const src = readFileSync(join(themesDir, `${p}.mjs`), 'utf8');
    assert.match(src, /read from the running lab/);
    assert.match(src, p === 'grafana' ? /Grafana 13\.3\.0/ : /Kibana 9\.5\.6/);
  }
});

// ---------------------------------------------------------------- the library
const fixture = {
  id: 'fixture', alt: 'Every building block', width: 1000, height: 700,
  nodes: [
    { block: 'window', x: 0, y: 0, w: 1000, h: 700, title: 'Fixture', children: [
      { block: 'nav', x: 0, y: 0, w: 240, h: 400, logo: 'si:grafana', title: 'Grafana', items: ['Home', { label: 'Dashboards', icon: 'dashboard', active: true }] },
      { block: 'toolbar', x: 240, y: 0, w: 760, crumbs: ['Home', 'Dashboards'], actions: ['Save', { label: 'Share', kind: 'primary', icon: 'share' }], logo: 'si:kibana', product: 'Kibana' },
      { block: 'tabs', x: 250, y: 60, w: 400, tabs: ['Queries', 'Transform'], active: 0 },
      { block: 'field', x: 250, y: 110, w: 240, label: 'Title', value: 'Bookshelf', focused: true },
      { block: 'dropdown', x: 510, y: 110, w: 200, label: 'Type', value: 'Time series', open: true, options: ['Time series', 'Bar chart'] },
      { block: 'button', x: 730, y: 130, w: 100, label: 'Save', kind: 'primary' },
      { block: 'toggle', x: 250, y: 200, label: 'Legend', on: true },
      { block: 'checkbox', x: 250, y: 230, label: 'Show', checked: true },
      { block: 'table', x: 250, y: 260, w: 300, columns: [{ title: 'Name', w: 2 }, { title: 'State', w: 1 }], rows: [['a', 'Normal']], selectedRow: 0 },
      { block: 'flyout', x: 700, y: 200, w: 280, h: 200, title: 'Add to dashboard' },
      { block: 'sidePanel', x: 580, y: 260, w: 100, h: 100, title: 'Panel', sections: [{ label: 'Axes', open: true }] },
      { block: 'queryEditor', x: 250, y: 420, w: 400, h: 80, lines: [[{ t: 'rate', kind: 'keyword' }, { t: '(x[5m])' }]] },
      { block: 'panel', x: 10, y: 420, w: 220, h: 120, title: 'Rate', children: [{ block: 'line', x: 10, y: 440, w: 220, h: 100, series: [{ name: 'a', points: [1, 3, 2, 5] }, { name: 'b', points: [2, 2, 3, 1] }], xLabels: ['10:00', '10:05'] }] },
      { block: 'bar', x: 250, y: 520, w: 220, h: 150, categories: ['a', 'b'], series: [{ name: 's', values: [3, 5] }] },
      { block: 'pie', x: 480, y: 520, w: 220, h: 150, slices: [{ label: 'a', value: 2 }, { label: 'b', value: 3 }] },
      { block: 'gauge', x: 710, y: 420, w: 200, h: 120, value: 72, unit: '%' },
      { block: 'heatmap', x: 710, y: 550, w: 200, h: 120, values: [[0.1, 0.9], [0.5, 0.2]], rowLabels: ['a', 'b'], colLabels: ['x', 'y'] },
      { block: 'stat', x: 10, y: 560, w: 200, h: 100, title: 'Errors', value: '0.4', unit: '%' },
      { block: 'stateTimeline', x: 480, y: 360, w: 400, h: 60, rows: [{ label: 'rule', segments: [{ from: 0, to: 0.5, state: 'normal' }, { from: 0.5, to: 1, state: 'firing', text: 'Firing' }] }] },
      { block: 'pill', x: 880, y: 70, str: 'Firing', state: 'firing' },
      { block: 'chip', x: 880, y: 100, str: 'severity' },
      { block: 'highlight', x: 730, y: 130, w: 100, h: 32 },
      { block: 'callout', x: 740, y: 120, num: 1 },
    ] },
  ],
};

test('every building block renders with both themes, deterministically, with only theme colours', async () => {
  const collect = (ns) => ns.flatMap((x) => [x.block, ...collect(x.children ?? [])]);
  const used = new Set(collect(fixture.nodes));
  for (const b of Object.keys(blocks)) if (!['rect', 'icon', 'logo', 'label', 'tablePanel', 'worldMap'].includes(b)) assert.ok(used.has(b) || b === 'window', `fixture misses block ${b}`);
  for (const p of products) {
    const theme = await loadTheme(p);
    const a = renderSvg({ ...fixture, theme });
    assert.equal(a, renderSvg({ ...fixture, theme }), 'same spec, same bytes');
    assert.match(a, /<text /);
    assert.doesNotMatch(a, /NaN|undefined/);
    assert.ok(a.length < 40_000, `fixture is ${a.length} bytes`);
  }
});

test('a text run wider than its box, or too small at width=900, is an error', async () => {
  const theme = await loadTheme('grafana');
  const f = (node, width = 1000) => renderSvg({ id: 'x', alt: 'x', width, height: 100, theme, nodes: [node] });
  assert.throws(() => f({ block: 'button', x: 0, y: 0, w: 40, label: 'A very long button label' }), TextOverflowError);
  assert.throws(() => f({ block: 'field', x: 0, y: 0, w: 60, value: 'a long field value that cannot fit' }), /wide/);
  assert.throws(() => f({ block: 'label', x: 0, y: 10, str: 'tiny', size: 12 }, 1600), /below/);
  assert.doesNotThrow(() => f({ block: 'button', x: 0, y: 0, w: 120, label: 'Save' }));
  assert.throws(() => f({ block: 'nope' }), /unknown block/);
  assert.throws(() => renderSvg({ id: 'x', alt: ' ', width: 10, height: 10, theme, nodes: [{ block: 'rect', x: 0, y: 0, w: 1, h: 1 }] }), /alt/);
  assert.throws(() => tok(theme, 'colour.missing'), /no token/);
});

test('the text-width estimator is monotonic and weight aware', () => {
  assert.ok(textWidth('Dashboards', 14) > textWidth('Dash', 14));
  assert.ok(textWidth('Save', 14, { weight: 600 }) > textWidth('Save', 14));
  assert.equal(textWidth('abcd', 10, { mono: true }), 24);
});

test('logos used by the library carry a colour', () => {
  const logos = JSON.parse(readFileSync(join(root, 'scripts', 'cards', 'logos.json'), 'utf8'));
  for (const k of ['si:grafana', 'si:elastic', 'si:kibana', 'si:elasticsearch', 'si:prometheus', 'si:postgresql', 'dv:grafanaloki', 'vendor:tempo']) assert.match(logos[k]?.colour ?? '', /^#[0-9A-F]{6}$/, k);
});

// ---------------------------------------------------------------- specs and guides (Task 4.4)
test('every spec has at least one figure, unique ids and file names, and non-empty alt text', async () => {
  const built = await buildFigures();
  const names = new Set();
  for (const b of built) {
    assert.ok(b.figure.alt && b.figure.alt.trim(), `${b.file} has no alt text`);
    assert.ok(!names.has(b.file), `${b.file} repeats`);
    names.add(b.file);
  }
  for (const n of specNames()) assert.ok(built.some((b) => b.name === n), `${n} has no figure`);
});

test('each generated file is up to date with its spec', async () => {
  for (const b of await buildFigures()) assert.ok(isUpToDate(b.file, b.svg), `${b.file} is missing or stale; run npm run guides:figures`);
});

test('no generated guide or map file is an orphan', async () => {
  const expected = new Set((await buildFigures()).map((b) => b.file));
  for (const f of readdirSync(imagesDir)) {
    if (/^monitoring-alerting-(grafana|kibana)-(guide|map)-.*\.svg$/.test(f)) assert.ok(expected.has(f), `${f} has no spec`);
  }
});

test('every guide figure is referenced by exactly one page, by bare file name', async () => {
  const built = (await buildFigures()).filter((b) => !b.spec.maps);
  if (!built.length) return;
  const pages = allPages().map((f) => ({ f, src: readFileSync(f, 'utf8') }));
  for (const b of built) {
    const refs = pages.filter((p) => p.src.split('\n').some((l) => l.startsWith(`image::${b.file}[`)));
    assert.equal(refs.length, 1, `${b.file} is referenced by ${refs.length} pages`);
    assert.match(refs[0].f, new RegExp(`/${b.spec.product}/guide-[a-z0-9-]+\\.adoc$`), `${b.file} must be shown by a ${b.spec.product} guide page`);
    for (const p of pages) assert.ok(!p.src.includes(`/${b.file}`) || p.src.includes(`image::${b.file}[`), `${b.file} referenced with a path in ${p.f}`);
  }
});

// Screen maps: each is shown by the guide named in lib/guide-maps.mjs. While that guide does not exist the map has no
// page; once it exists, exactly that page references the map (the per-guide figures above stay at exactly one page).
test('every screen map has a designated guide, and is shown by it once the guide exists', async () => {
  const maps = (await buildFigures()).filter((b) => b.spec.maps);
  const areas = new Set();
  const pages = allPages().map((f) => ({ f, src: readFileSync(f, 'utf8') }));
  for (const b of maps) {
    const guide = mapGuides[b.spec.product]?.[b.figure.id];
    assert.ok(guide, `map ${b.figure.id} of ${b.spec.product} has no designated guide in lib/guide-maps.mjs`);
    areas.add(`${b.spec.product}/${b.figure.id}`);
    const page = join(section, b.spec.product, `guide-${guide}.adoc`);
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
  for (const [product, list] of Object.entries(mapGuides)) for (const area of Object.keys(list)) assert.ok(areas.has(`${product}/${area}`), `lib/guide-maps.mjs names a map ${product}/${area} that has no figure`);
});

test('every guide image target exists, and every step group of a guide has a figure', async () => {
  const files = new Set((await buildFigures()).map((b) => b.file));
  for (const g of guidePages()) {
    const src = readFileSync(g.file, 'utf8');
    for (const m of src.matchAll(/^image::(monitoring-alerting-(?:grafana|kibana)-(?:guide|map)-[^[]+)\[/gm)) assert.ok(files.has(m[1]) && existsSync(join(imagesDir, m[1])), `${g.name}: ${m[1]} has no spec or file`);
    const steps = src.split(/^== /m).find((s) => /^Steps\s*$/m.test(s.split('\n')[0]));
    if (!steps) continue;
    const groups = steps.split(/^=== /m).slice(1);
    for (const grp of groups) {
      if (!/^\s*(\.+|\d+\.)\s+\S/m.test(grp)) continue; // a phase without numbered steps needs no figure
      const title = grp.split('\n')[0];
      assert.match(grp, new RegExp(`^image::monitoring-alerting-${g.product}-guide-`, 'm'), `${g.name}: step group "${title}" has no figure`);
    }
  }
});

test('figure specs hard-code no colour (only theme tokens)', () => {
  for (const f of readdirSync(figuresDir).filter((x) => x.endsWith('.mjs'))) {
    const src = readFileSync(join(figuresDir, f), 'utf8');
    assert.doesNotMatch(src, /#[0-9a-fA-F]{3,8}\b/, `${f} has a hex colour`);
    assert.doesNotMatch(src, /\b(rgba?|hsla?|oklch|hwb)\s*\(/, `${f} has a functional colour`);
    assert.doesNotMatch(src, /['"](red|green|blue|orange|yellow|pink|purple|black|white|gray|grey|teal|cyan|magenta|brown)['"]/i, `${f} has a named colour`);
  }
});

// ---------------------------------------------------------------- the world map (real geography, not a grid of cells)
test('the world map data is Natural Earth in Web Mercator and the map block draws it with theme colours only', async () => {
  const world = JSON.parse(readFileSync(join(here, 'data', 'world-110m.json'), 'utf8'));
  assert.match(world.source, /Natural Earth/);
  assert.match(world.projection, /Web Mercator/);
  assert.ok(world.countries.length > 170, `${world.countries.length} countries`);
  for (const iso of ['US', 'CN', 'IN', 'BR', 'RU', 'AU', 'ZA', 'GB']) {
    const c = world.countries.find((k) => k.iso2 === iso);
    assert.ok(c, `country ${iso}`);
    assert.ok(c.centroid[0] >= 0 && c.centroid[0] <= world.width && c.centroid[1] >= 0 && c.centroid[1] <= world.height, `${iso} centroid on the map`);
    assert.match(c.d, /^M[\d.]+ [\d.]+L/);
  }
  const node = { block: 'worldMap', x: 0, y: 0, w: 600, h: 360, shade: { CN: 1, US: 0.5 }, markers: [{ iso: 'IN', v: 10 }, { iso: 'BR', v: 2 }], dots: [{ iso: 'DE', n: 3 }], heat: [{ iso: 'JP', v: 0.7 }], legend: { title: 'Layer 1', min: 2, max: 10 }, zoom: true };
  for (const p of products) {
    const theme = await loadTheme(p);
    const svg = renderSvg({ id: 'map', alt: 'A world map', width: 600, height: 360, theme, nodes: [node] });
    assert.equal(svg, renderSvg({ id: 'map', alt: 'A world map', width: 600, height: 360, theme, nodes: [node] }), 'deterministic');
    assert.doesNotMatch(svg, /NaN|undefined/);
    assert.ok(svg.includes(theme.colour.map.water) && svg.includes(theme.colour.map.border), 'basemap colours from the theme');
    assert.ok((svg.match(/<path d="M/g) ?? []).length > 170, 'every country is drawn');
  }
  const theme = await loadTheme('kibana');
  assert.throws(() => renderSvg({ id: 'map', alt: 'x', width: 100, height: 100, theme, nodes: [{ block: 'worldMap', x: 0, y: 0, w: 100, h: 100, markers: [{ iso: 'XX', v: 1 }] }] }), /no country XX/);
});

test('no figure spec draws a map as a grid of cells', () => {
  for (const f of readdirSync(figuresDir).filter((x) => x.endsWith('.mjs'))) {
    const src = readFileSync(join(figuresDir, f), 'utf8');
    assert.doesNotMatch(src, /const MASK = \[/, `${f} draws a tile map; use the worldMap block`);
  }
});
