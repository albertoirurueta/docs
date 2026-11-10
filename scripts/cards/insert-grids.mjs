// Inserts (or refreshes) the card grid of every section index, between the intro and `== Sections`, in the
// home page's table/card pattern. Cards follow the order of the section's text list; the text list is untouched.
//   node scripts/cards/insert-grids.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cards, gradients } from './manifest.mjs';

const pagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../modules/ROOT/pages');
const GRID = /\n\[cols="1,1,1",frame=none,grid=none\]\n\|===\n(?:(?!\n\|===)[\s\S])*?image::card-[\s\S]*?\n\|===\n/;

export function renderGrid(sectionCards) {
  const cells = sectionCards.map((c) => `a|\nimage::${c.file}["${c.title}",xref="${c.page}"]\n`);
  while (cells.length % 3) cells.push('a|\n');
  return `[cols="1,1,1",frame=none,grid=none]\n|===\n${cells.join('\n')}\n|===\n`;
}

export function insertGrid(section) {
  const file = join(pagesDir, section, 'index.adoc');
  let text = readFileSync(file, 'utf8').replace(GRID, '\n');
  const marker = text.indexOf('\n== Sections');
  if (marker < 0) throw new Error(`${section}: no == Sections heading`);
  const list = text.slice(marker);
  const rank = (c) => {
    const i = list.indexOf(`xref:${c.page}[`);
    return i < 0 ? Number.MAX_SAFE_INTEGER : i;
  };
  const sectionCards = cards.filter((c) => c.section === section).sort((a, b) => rank(a) - rank(b));
  text = `${text.slice(0, marker).replace(/\n+$/, '')}\n\n${renderGrid(sectionCards)}${text.slice(marker)}`;
  writeFileSync(file, text);
  return sectionCards.length;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const section of Object.keys(gradients)) console.log(`${section}: ${insertGrid(section)} cards`);
}
