// Shows cheat-sheet PDF downloads as the shared download button (download-cheat-sheet-pdf.svg) on every
// `cheat-sheet*.adoc` page:
//   - the page's main PDF (the first `xref:attachment$<x>.pdf[Download ...]` that starts a line) moves to a button
//     right after the introduction, so it is the first thing the reader sees;
//   - any further "Download ..." link that stands on its own line becomes a button in place, and one that opens a
//     paragraph gets a button just above that paragraph;
//   - a table cell holding only a download link becomes the compact inline button (download-pdf-compact.svg);
//   - a page that links its PDF only from running text gets the top button for the first PDF it links.
// Links in running text ("the downloadable PDF") stay as text. Pages that already show the button are skipped.
//   node scripts/cards/insert-download-buttons.mjs
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOWNLOAD_BUTTON, DOWNLOAD_BUTTON_COMPACT } from './generate-cards.mjs';

const pagesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../modules/ROOT/pages');
const OWN = /^xref:attachment\$(\S+?\.pdf)\[(Download[^\]]*)\](.*)$/;
const CELL = /^\| xref:attachment\$(\S+?\.pdf)\[([^\]]*)\]\s*$/;
const FULL_CELL = /^\| image:download-cheat-sheet-pdf\.svg\["([^"]*)",width=\d+,xref=attachment\$(\S+?\.pdf)\]$/gm;

export const blockButton = (pdf, label) => `image::${DOWNLOAD_BUTTON}["${label}",width=320,xref=attachment$${pdf}]`;
export const inlineButton = (pdf, label) => `image:${DOWNLOAD_BUTTON_COMPACT}["${label}",width=110,xref=attachment$${pdf}]`;

export function cheatSheetPages(dir = pagesDir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...cheatSheetPages(p));
    else if (/^cheat-sheet.*\.adoc$/.test(name)) out.push(p);
  }
  return out.sort();
}

// Index after which the top button goes: the end of the first paragraph following the disclaimer include.
function introEnd(lines) {
  let i = lines.findIndex((l) => l.startsWith('include::partial$ai-disclaimer.adoc'));
  if (i < 0) throw new Error('no disclaimer include');
  let j = i + 1;
  while (j < lines.length && lines[j] === '') j++;
  if (j >= lines.length || /^(=|\*|\.|\[|\||image::|xref:attachment|include::|----|\/\/)/.test(lines[j])) return i;
  while (j < lines.length && lines[j] !== '') j++;
  return j - 1;
}

// A "== Download" section left without content once its link moved to the top button is removed.
export const dropEmptyDownloadSections = (text) =>
  text.replace(/\n(==+) Download[^\n]*\n+(?=(\1 |=(?!=)|$))/g, '\n').replace(/\n+$/, '\n');

export function withDownloadButtons(text) {
  // Earlier runs put the full button in table cells; those become the compact one.
  text = text.replace(FULL_CELL, (m, label, pdf) => `| ${inlineButton(pdf, label)}`);
  if (text.includes(`image::${DOWNLOAD_BUTTON}`) || text.includes(`image:${DOWNLOAD_BUTTON_COMPACT}`)) {
    return dropEmptyDownloadSections(text);
  }
  const lines = text.split('\n');
  let main = null;
  let cells = 0;
  const out = [];
  for (const line of lines) {
    const cell = line.match(CELL);
    if (cell) {
      out.push(`| ${inlineButton(cell[1], cell[2])}`);
      cells++;
      continue;
    }
    const own = line.match(OWN);
    if (!own) {
      out.push(line);
      continue;
    }
    const [, pdf, label, rest] = own;
    const standalone = rest.trim() === '';
    if (!main) {
      main = { pdf, label };
      if (!standalone) out.push(line); // the paragraph keeps its text link; the button goes to the top
      continue;
    }
    if (standalone) out.push(blockButton(pdf, label));
    else {
      if (out.length && out[out.length - 1] !== '') out.push('');
      out.push(blockButton(pdf, label), '', line);
    }
  }
  // A page that links its PDF only from running text still gets the top button for the first PDF it links.
  if (!main && !cells) {
    const any = text.match(/xref:attachment\$(\S+?\.pdf)\[/);
    if (any) main = { pdf: any[1], label: 'Download the cheat sheet (PDF)' };
  }
  if (main) {
    const at = introEnd(out);
    out.splice(at + 1, 0, '', blockButton(main.pdf, main.label));
  }
  // Collapse the blank lines left where a link was removed, and keep a blank line after a block button.
  const joined = out.join('\n').replace(/\n{3,}/g, '\n\n').replace(/(image::download-[^\n]*\n)(?!\n)/g, '$1\n');
  return dropEmptyDownloadSections(joined);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let changed = 0;
  const without = [];
  for (const file of cheatSheetPages()) {
    const before = readFileSync(file, 'utf8');
    const after = withDownloadButtons(before);
    if (!after.includes(DOWNLOAD_BUTTON) && !after.includes(DOWNLOAD_BUTTON_COMPACT)) without.push(relative(pagesDir, file));
    if (after !== before) {
      writeFileSync(file, after);
      changed++;
    }
  }
  console.log(`updated ${changed} cheat-sheet pages`);
  if (without.length) console.log(`no downloadable PDF linked on:\n  ${without.join('\n  ')}`);
}
