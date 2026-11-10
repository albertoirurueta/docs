// Inserts (or refreshes) IDE card grids on every `ides-and-tools.adoc` page. Within each `==` section, the product
// links written as `* https://...[*<name>*] -- description` get one card each (ide-manifest.mjs), in list order, in
// the home page's three-column table/card pattern, placed right before the list. The text list is left unchanged.
//   node scripts/cards/insert-ide-grids.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ideByName } from './ide-manifest.mjs';

const pagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../modules/ROOT/pages');
const LINK = /^\* (https?:\/\/[^[\s]+)\[\*([^\]]+)\*\]/;
// An earlier grid: the table block whose cells hold ide-*.svg images, with the blank line that follows it.
const GRID = /\[cols="1,1,1",frame=none,grid=none\]\n\|===\n(?:(?!\|===)[\s\S])*?image::ide-[\s\S]*?\n\|===\n\n/g;

export function idePages(dir = pagesDir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...idePages(p));
    else if (name === 'ides-and-tools.adoc') out.push(p);
  }
  return out.sort();
}

export function renderIdeGrid(links) {
  const cells = links.map(({ url, name, card }) => `a|\nimage::${card.file}["${name}",link="${url}"]\n`);
  while (cells.length % 3) cells.push('a|\n');
  return `[cols="1,1,1",frame=none,grid=none]\n|===\n${cells.join('\n')}\n|===\n`;
}

// Returns the page text with one grid before the first product link of every `==` section that has links.
export function withIdeGrids(text, file = 'page') {
  const lines = text.replace(GRID, '').split('\n');
  const out = [];
  let pending = null; // links of the current section, flushed before its first link line
  const sections = [];
  let current = null;
  lines.forEach((line, i) => {
    if (/^==+ /.test(line)) current = null;
    const m = line.match(LINK);
    if (!m) return;
    const card = ideByName.get(m[2]);
    if (!card) throw new Error(`${file}: no IDE card for "${m[2]}" (add it to ide-manifest.mjs)`);
    if (!current) sections.push((current = { first: i, links: [] }));
    current.links.push({ url: m[1], name: m[2], card });
  });
  const firstLine = new Map(sections.map((s) => [s.first, s]));
  lines.forEach((line, i) => {
    if ((pending = firstLine.get(i))) {
      if (out.length && out[out.length - 1] !== '') out.push('');
      out.push(...renderIdeGrid(pending.links).split('\n'));
    }
    out.push(line);
  });
  return out.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let total = 0;
  for (const file of idePages()) {
    const before = readFileSync(file, 'utf8');
    const after = withIdeGrids(before, relative(pagesDir, file));
    const count = (after.match(/image::ide-/g) || []).length;
    total += count;
    if (after !== before) writeFileSync(file, after);
    console.log(`${relative(pagesDir, file)}: ${count} cards`);
  }
  console.log(`${total} IDE cards`);
}
