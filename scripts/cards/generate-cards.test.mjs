import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cards, gradients } from './manifest.mjs';
import { ideCards, ideByName } from './ide-manifest.mjs';
import { homeCards } from './home-cards.mjs';
import { brand, variants } from './palette.mjs';
import {
  DOWNLOAD_BUTTON, DOWNLOAD_BUTTON_COMPACT, generate, renderCompactDownloadButton, glyphs, ideCard, renderDownloadButton, restyle, sectionCard,
} from './generate-cards.mjs';
import { idePages, withIdeGrids } from './insert-ide-grids.mjs';
import { withGrid } from './insert-grids.mjs';
import { cheatSheetPages, withDownloadButtons } from './insert-download-buttons.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const pagesDir = resolve(here, '../../modules/ROOT/pages');
const imagesDir = resolve(here, '../../modules/ROOT/images');
const logos = JSON.parse(readFileSync(join(here, 'logos.json'), 'utf8'));
const read = (p) => readFileSync(p, 'utf8');

test('file names follow card-<section>-<subsection>.svg and are unique', () => {
  for (const c of cards) {
    assert.equal(c.file, `card-${c.section}-${c.slug}.svg`);
    assert.match(c.file, /^card-[a-z0-9-]+\.svg$/);
  }
  assert.equal(new Set(cards.map((c) => c.file)).size, cards.length);
});

test('every card has a gradient, a known logo and non-empty text', () => {
  for (const c of [...cards, ...ideCards]) {
    if (c.section) assert.ok(gradients[c.section], `gradient for ${c.section}`);
    assert.ok(c.title && c.subtitle, `text for ${c.file}`);
    if (c.logo.startsWith('gl:')) assert.ok(glyphs[c.logo.slice(3)], `glyph ${c.logo}`);
    else assert.ok(logos[c.logo], `logo ${c.logo}`);
  }
});

test('logos come only from Simple Icons (CC0-1.0) and Devicon (MIT)', () => {
  const allowed = { 'Simple Icons': 'CC0-1.0', Devicon: 'MIT' };
  for (const l of Object.values(logos)) assert.equal(allowed[l.source], l.license);
});

test('every palette colour comes from the top bar gradient (or its documented derivatives)', () => {
  const allowed = new Set([...Object.values(brand), '#34d399'].map((c) => c.toLowerCase()));
  for (const [name, stops] of Object.entries(variants)) {
    assert.equal(stops.length, 3, name);
    for (const c of stops) assert.ok(allowed.has(c.toLowerCase()), `${name}: ${c}`);
  }
});

test('generated cards are 600x600 with the card structure', () => {
  const out = mkdtempSync(join(tmpdir(), 'cards-'));
  assert.equal(generate(out), cards.length + ideCards.length + 2);
  for (const c of cards) {
    const svg = read(join(out, c.file));
    assert.match(svg, /<svg width="600" height="600" viewBox="0 0 600 600"/);
    assert.ok(svg.includes('Explore') && svg.includes('cardClip') && svg.includes('bgGradient'));
    assert.equal(svg, sectionCard(c));
  }
  for (const c of ideCards) assert.ok(read(join(out, c.file)).includes('>Visit</text>'), c.file);
});

test('committed section and IDE cards and the download button are up to date', () => {
  for (const [file, svg] of [
    ...cards.map((c) => [c.file, sectionCard(c)]),
    ...ideCards.map((c) => [c.file, ideCard(c)]),
    [DOWNLOAD_BUTTON, renderDownloadButton()],
    [DOWNLOAD_BUTTON_COMPACT, renderCompactDownloadButton()],
  ]) {
    assert.ok(existsSync(join(imagesDir, file)), `${file} missing: run npm run cards`);
    assert.equal(read(join(imagesDir, file)), svg, `${file} is stale: run npm run cards`);
  }
});

test('home page cards carry the shared palette (restyle is a no-op on them)', () => {
  for (const h of homeCards) {
    const svg = read(join(imagesDir, h.file));
    assert.equal(restyle(svg, h.colors), svg, `${h.file} is stale: run npm run cards`);
  }
  const linked = new Set([...read(join(pagesDir, 'index.adoc')).matchAll(/image::([a-z0-9-]+\.svg)/g)].map((m) => m[1]));
  for (const f of linked) assert.ok(homeCards.some((h) => h.file === f), `${f} on the home page has no palette entry`);
});

test('no orphan card files: every card-*.svg and ide-*.svg has a manifest entry', () => {
  const known = new Set([...cards, ...ideCards].map((c) => c.file));
  for (const f of readdirSync(imagesDir).filter((n) => /^(card|ide)-/.test(n))) {
    assert.ok(known.has(f), `${f} has no manifest entry`);
  }
});

test('no orphan manifest entries: every card points at an existing page', () => {
  for (const c of cards) {
    assert.ok(existsSync(join(pagesDir, c.page)), `${c.page} does not exist`);
    assert.ok(readdirSync(pagesDir).includes(c.section), `section ${c.section}`);
  }
});

test('IDE manifest names are unique and every IDE card is used on a page', () => {
  assert.equal(new Set(ideCards.map((c) => c.file)).size, ideCards.length);
  assert.equal(ideByName.size, ideCards.reduce((n, c) => n + c.names.length, 0), 'a name maps to two cards');
  const used = new Set(idePages().flatMap((p) => [...read(p).matchAll(/image::(ide-[a-z0-9-]+\.svg)/g)].map((m) => m[1])));
  for (const c of ideCards) assert.ok(used.has(c.file), `${c.file} is not used on any ides-and-tools page`);
});

test('IDE pages show a card grid for their product links (insert-ide-grids.mjs is a no-op)', () => {
  for (const p of idePages()) assert.equal(withIdeGrids(read(p), p), read(p), `${p}: run node scripts/cards/insert-ide-grids.mjs`);
});

test('cheat-sheet pages that link a PDF show the download button (insert-download-buttons.mjs is a no-op)', () => {
  for (const p of cheatSheetPages()) {
    const text = read(p);
    assert.equal(withDownloadButtons(text), text, `${p}: run node scripts/cards/insert-download-buttons.mjs`);
    if (/xref:attachment\$\S+\.pdf\[/.test(text)) {
      const shown = text.includes(DOWNLOAD_BUTTON) || text.includes(DOWNLOAD_BUTTON_COMPACT);
      assert.ok(shown, `${p} links a PDF but shows no download button`);
    }
  }
});

const navText = () => [join(pagesDir, '../nav.adoc'),
  ...readdirSync(join(pagesDir, '../partials')).filter((f) => f.startsWith('nav-')).map((f) => join(pagesDir, '../partials', f))]
  .map(read).join('\n');
const normTitle = (t) => t.replace(/\{cpp\}/g, 'C++');

test('section indexes show an up-to-date card grid (insert-grids.mjs is a no-op)', () => {
  for (const section of Object.keys(gradients)) {
    const file = join(pagesDir, section, 'index.adoc');
    assert.equal(withGrid(read(file), section), read(file), `${section}: run npm run cards`);
  }
});

test('every section card is in its index == Sections list, with the same title there and in the nav', () => {
  const nav = new Map([...navText().matchAll(/xref:([^[\s]+)\[([^\]]+)\]/g)].map((m) => [m[1], normTitle(m[2])]));
  for (const c of cards) {
    const index = read(join(pagesDir, c.section, 'index.adoc'));
    const list = index.slice(index.indexOf('\n== Sections'));
    const m = list.match(new RegExp(`xref:${c.page.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\[([^\\]]+)\\]`));
    assert.ok(m, `${c.page} is not in ${c.section}/index.adoc == Sections`);
    assert.equal(normTitle(m[1]), c.title, `${c.file}: card title differs from the index link text`);
    assert.equal(nav.get(c.page), c.title, `${c.file}: card title differs from the nav entry`);
  }
});

test('the nav has no fragment links and keeps the group the nav-tree override opens', () => {
  // A same-page #fragment link makes the UI bundle's site.js collapse the default-open groups (WP2).
  assert.deepEqual([...navText().matchAll(/xref:[^[\s]*#[^[\s]*\[/g)].map((m) => m[0]), []);
  // ui-overrides/partials/nav-tree.hbs opens the children of the entry titled exactly this.
  assert.match(read(join(pagesDir, '../nav.adoc')), /^\* Open Source Projects$/m);
  assert.ok(read(join(here, '../../ui-overrides/partials/nav-tree.hbs')).includes("'Open Source Projects'"));
});
