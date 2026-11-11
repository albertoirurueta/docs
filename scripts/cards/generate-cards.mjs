// Generates every card-like SVG of the site from one template and one palette (palette.mjs):
//   - section/subsection cards  modules/ROOT/images/card-<section>-<subsection>.svg  (manifest.mjs)
//   - IDE and tool cards         modules/ROOT/images/ide-<slug>.svg                   (ide-manifest.mjs)
//   - the cheat-sheet buttons    modules/ROOT/images/download-cheat-sheet-pdf.svg, download-pdf-compact.svg
// and restyles the hand-made home page cards (home-cards.mjs) in place, keeping their logo and text layout.
//   node scripts/cards/generate-cards.mjs [outDir]
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cards, gradients } from './manifest.mjs';
import { ideCards } from './ide-manifest.mjs';
import { guideLogos } from './guide-logos.mjs';
import { homeCards } from './home-cards.mjs';
import { brand, otherVariant, variants } from './palette.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const defaultOut = resolve(here, '../../modules/ROOT/images');
const logos = JSON.parse(readFileSync(join(here, 'logos.json'), 'utf8'));

export const DOWNLOAD_BUTTON = 'download-cheat-sheet-pdf.svg';
export const DOWNLOAD_BUTTON_COMPACT = 'download-pdf-compact.svg';

const LINE = 'fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"';

// Drawn white-line glyphs, centred on (0,0) within +-26.
export const glyphs = {
  code: '<path d="M-10 -20 L-26 0 L-10 20"/><path d="M10 -20 L26 0 L10 20"/><path d="M4 -24 L-4 24"/>',
  cloud: '<path d="M-16 16 H14 C26 16 26 -2 14 -2 C14 -18 -10 -18 -12 -2 C-24 -2 -24 16 -16 16 Z"/>',
  database: '<ellipse cx="0" cy="-16" rx="20" ry="7"/><path d="M-20 -16 V16 A20 7 0 0 0 20 16 V-16"/><path d="M-20 0 A20 7 0 0 0 20 0"/>',
  window: '<rect x="-24" y="-20" width="48" height="40" rx="5"/><path d="M-24 -8 H24"/>',
  doc: '<path d="M-14 -24 H6 L16 -14 V24 H-14 Z"/><path d="M6 -24 V-14 H16"/><path d="M-6 4 H8"/><path d="M-6 14 H8"/>',
  gear: '<circle cx="0" cy="0" r="9"/><circle cx="0" cy="0" r="20" stroke-dasharray="9 6.3"/>',
  cube: '<path d="M0 -24 L21 -12 V12 L0 24 L-21 12 V-12 Z"/><path d="M-21 -12 L0 0 L21 -12"/><path d="M0 0 V24"/>',
  terminal: '<rect x="-24" y="-20" width="48" height="40" rx="5"/><path d="M-14 -7 L-6 1 L-14 9"/><path d="M0 10 H12"/>',
  chip: '<rect x="-13" y="-13" width="26" height="26" rx="3"/><path d="M-6 -22 V-13 M6 -22 V-13 M-6 13 V22 M6 13 V22 M-22 -6 H-13 M-22 6 H-13 M13 -6 H22 M13 6 H22"/>',
  server: '<rect x="-22" y="-22" width="44" height="16" rx="3"/><rect x="-22" y="6" width="44" height="16" rx="3"/><path d="M-13 -14 H-12 M-13 14 H-12"/>',
  layers: '<path d="M0 -24 L24 -12 L0 0 L-24 -12 Z"/><path d="M-24 0 L0 12 L24 0"/><path d="M-24 12 L0 24 L24 12"/>',
  shield: '<path d="M0 -24 L20 -16 V2 C20 14 8 22 0 26 C-8 22 -20 14 -20 2 V-16 Z"/><path d="M-8 2 L-2 8 L10 -6"/>',
  chat: '<path d="M-22 -20 H22 V10 H-6 L-16 20 V10 H-22 Z"/>',
  image: '<rect x="-24" y="-20" width="48" height="40" rx="5"/><path d="M-24 14 L-8 -2 L2 8 L10 0 L24 14"/><circle cx="12" cy="-9" r="2"/>',
  chart: '<path d="M-22 -22 V22 H24"/><path d="M-10 12 V0 M2 12 V-10 M14 12 V-18"/>',
  book: '<path d="M0 -16 C-8 -22 -18 -22 -24 -18 V18 C-18 14 -8 14 0 20 Z"/><path d="M0 -16 C8 -22 18 -22 24 -18 V18 C18 14 8 14 0 20 Z"/>',
  search: '<circle cx="-4" cy="-4" r="15"/><path d="M7 7 L22 22"/>',
  pipe: '<path d="M-24 -10 H0 V10 H20"/><path d="M12 2 L20 10 L12 18"/>',
  clock: '<circle cx="0" cy="0" r="22"/><path d="M0 -12 V0 L10 6"/>',
  lock: '<rect x="-16" y="-2" width="32" height="24" rx="4"/><path d="M-9 -2 V-9 A9 9 0 0 1 9 -9 V-2"/>',
  grid: '<rect x="-22" y="-22" width="18" height="18" rx="3"/><rect x="4" y="-22" width="18" height="18" rx="3"/><rect x="-22" y="4" width="18" height="18" rx="3"/><rect x="4" y="4" width="18" height="18" rx="3"/>',
  play: '<circle cx="0" cy="0" r="22"/><path d="M-7 -12 L13 0 L-7 12 Z"/>',
  mic: '<rect x="-7" y="-24" width="14" height="28" rx="7"/><path d="M-16 0 A16 16 0 0 0 16 0"/><path d="M0 16 V24"/>',
  puzzle: '<path d="M-20 -14 H-6 A6 6 0 1 1 6 -14 H20 V0 A6 6 0 1 1 20 12 V24 H-20 V12 A6 6 0 1 0 -20 0 Z"/>',
  phone: '<rect x="-14" y="-24" width="28" height="48" rx="5"/><path d="M-4 17 H4"/>',
  rocket: '<path d="M0 -26 C12 -16 14 -2 10 14 H-10 C-14 -2 -12 -16 0 -26 Z"/><circle cx="0" cy="-6" r="4"/><path d="M-10 6 L-20 18 L-10 18 M10 6 L20 18 L10 18 M-4 20 L0 26 L4 20"/>',
  gauge: '<path d="M-22 12 A22 22 0 1 1 22 12"/><path d="M0 4 L12 -10"/><circle cx="0" cy="4" r="3"/>',
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const num = (n) => Number(n.toFixed(2));

export function logoMarkup(key) {
  if (key.startsWith('gl:')) {
    const glyph = glyphs[key.slice(3)];
    if (!glyph) throw new Error(`unknown glyph ${key}`);
    return `<g ${LINE}>\n  ${glyph}\n</g>`;
  }
  const logo = logos[key];
  if (!logo) throw new Error(`unknown logo ${key}`);
  const scale = num(52 / logo.viewBox);
  const half = num((logo.viewBox * scale) / 2);
  const d = logo.paths.map((p) => `<path d="${p}"/>`).join('');
  return `<g fill="#FFFFFF" transform="translate(${-half},${-half}) scale(${scale})">${d}</g>`;
}

// Width-based font size so that long titles and subtitles stay inside the card.
const fit = (text, max, min, avgEm, width) => Math.max(min, Math.min(max, Math.floor(width / (text.length * avgEm))));

// The parts of the card that carry the palette. Each one is a single line with a recognisable start, so that
// restyle() can replace them in a hand-made card that keeps the house structure (logo at 300,170, title, rule,
// subtitle, button at y=440..494).
export function defs(colors) {
  const [a, b, c] = colors;
  return `<defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="55%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <radialGradient id="bgGlow" cx="22%" cy="12%" r="70%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bgScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="40%" stop-color="${brand.ink}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${brand.ink}" stop-opacity="0.38"/>
    </linearGradient>
    <clipPath id="cardClip">
      <rect x="0" y="0" width="600" height="600" rx="28" ry="28"/>
    </clipPath>
  </defs>`;
}

const BACKGROUND =
  '<g class="card-bg"><rect width="600" height="600" fill="url(#bgGradient)"/><rect width="600" height="600" fill="url(#bgGlow)"/>' +
  '<rect width="600" height="600" fill="url(#bgScrim)"/><circle cx="520" cy="80" r="140" fill="#FFFFFF" opacity="0.06"/>' +
  '<circle cx="70" cy="560" r="110" fill="#FFFFFF" opacity="0.05"/></g>';
const LOGO_DISC = '<circle cx="300" cy="170" r="58" fill="#FFFFFF" opacity="0.18"/>';
const BORDER = '<rect x="1.5" y="1.5" width="597" height="597" rx="28" ry="28" fill="none" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="3"/>';
const button = (label) => `<rect x="215" y="440" width="170" height="54" rx="27" ry="27" fill="#FFFFFF"/>
    <text x="300" y="467" text-anchor="middle" dominant-baseline="central"
          font-family="Arial, Helvetica, sans-serif" font-weight="700"
          font-size="25" fill="${brand.buttonText}">${esc(label)}</text>`;

// The card shows the exact nav/index title. A title too long for one line at 36px or more is split into two
// balanced lines at a space, so long titles stay legible without being abbreviated.
export function titleMarkup(title) {
  const attrs = 'text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="800" fill="#FFFFFF"';
  const single = fit(title, 52, 30, 0.62, 520);
  const spaces = [...title.matchAll(/ /g)].map((m) => m.index);
  if (single >= 36 || !spaces.length) {
    return `<text x="300" y="290" ${attrs}
          font-size="${single}">${esc(title)}</text>`;
  }
  const at = spaces.reduce((best, i) => (Math.abs(i - title.length / 2) < Math.abs(best - title.length / 2) ? i : best));
  const lines = [title.slice(0, at), title.slice(at + 1)];
  // At most 40px so the first line clears the logo disc (bottom at y=228); the second baseline sits above the rule.
  const size = Math.min(...lines.map((l) => fit(l, 40, 26, 0.62, 520)));
  const y2 = 306;
  return `<text x="300" y="${y2 - Math.round(size * 1.12)}" ${attrs}
          font-size="${size}">${esc(lines[0])}</text>
    <text x="300" y="${y2}" ${attrs}
          font-size="${size}">${esc(lines[1])}</text>`;
}

export function renderCard({ colors, logo, title, subtitle, button: label = 'Explore' }) {
  const subSize = fit(subtitle, 25, 17, 0.5, 520);
  return `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  ${defs(colors)}

  <g clip-path="url(#cardClip)">
    ${BACKGROUND}

    ${LOGO_DISC}
    <g transform="translate(300,170)">
      ${logoMarkup(logo)}
    </g>

    ${titleMarkup(title)}

    <line x1="220" y1="322" x2="380" y2="322" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>

    <text x="300" y="370" text-anchor="middle"
          font-family="Arial, Helvetica, sans-serif" font-weight="400"
          font-size="${subSize}" fill="#FFFFFF" opacity="0.95">${esc(subtitle)}</text>

    ${button(label)}
  </g>

  ${BORDER}
</svg>
`;
}

export const sectionCard = (card) => renderCard({ ...card, colors: gradients[card.section] });
export const ideCard = (card) => renderCard({ ...card, colors: variants[otherVariant.ide], button: 'Visit' });

// Re-applies the palette to a hand-made card in the house structure, keeping its logo and text layout as drawn.
// Idempotent: it recognises both the original style and its own output.
export function restyle(svg, colors) {
  const steps = [
    [/<defs>[\s\S]*?<\/defs>/, defs(colors)],
    [/<rect x="0" y="0" width="600" height="600" fill="url\(#bgGradient\)"\/>|<g class="card-bg">.*?<\/g>/, BACKGROUND],
    [/<circle cx="300" cy="170" r="\d+" fill="#FFFFFF" opacity="[\d.]+"\/>/, LOGO_DISC],
    [/<rect x="\d+" y="44\d"[^>]*\/>\s*<text[^>]*>([^<]*)<\/text>/, (m, label) => button(label.replace(/&amp;/g, '&'))],
    [/<rect x="1\.5" y="1\.5"[^>]*\/>/, BORDER],
  ];
  for (const [re, rep] of steps) {
    if (!re.test(svg)) throw new Error(`restyle: pattern ${re} not found`);
    svg = svg.replace(re, rep);
  }
  return svg;
}

// The prominent download button of the cheat-sheet pages: a wide pill in the top bar's horizontal gradient.
export function renderDownloadButton() {
  const [a, b, c] = variants.sweep;
  return `<svg width="640" height="128" viewBox="0 0 640 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="btnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="50%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
    <linearGradient id="btnGloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="100%" stop-color="${brand.ink}" stop-opacity="0.22"/>
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="632" height="120" rx="60" ry="60" fill="url(#btnGradient)"/>
  <rect x="4" y="4" width="632" height="120" rx="60" ry="60" fill="url(#btnGloss)"/>
  <rect x="5.5" y="5.5" width="629" height="117" rx="58.5" ry="58.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3"/>
  <circle cx="72" cy="64" r="40" fill="#FFFFFF" opacity="0.2"/>
  <g ${LINE} transform="translate(72,64)">
    <path d="M0 -22 V10"/><path d="M-12 -2 L0 10 L12 -2"/><path d="M-18 14 V20 H18 V14"/>
  </g>
  <text x="136" y="58" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="36" fill="#FFFFFF">Download cheat sheet</text>
  <text x="136" y="94" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="22" fill="#FFFFFF" opacity="0.95">One-page PDF, ready to print</text>
  <rect x="540" y="44" width="72" height="40" rx="20" ry="20" fill="#FFFFFF"/>
  <text x="576" y="65" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="20" fill="${brand.buttonText}">PDF</text>
</svg>
`;
}

// Compact variant for narrow table cells: the download icon and a large "PDF" label, legible at ~110px wide.
export function renderCompactDownloadButton() {
  const [a, b, c] = variants.sweep;
  return `<svg width="240" height="96" viewBox="0 0 240 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="btnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${a}"/>
      <stop offset="50%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>
  </defs>
  <rect x="3" y="3" width="234" height="90" rx="45" ry="45" fill="url(#btnGradient)"/>
  <rect x="4.5" y="4.5" width="231" height="87" rx="43.5" ry="43.5" fill="none" stroke="#FFFFFF" stroke-opacity="0.35" stroke-width="3"/>
  <g ${LINE} transform="translate(62,48) scale(1.05)">
    <path d="M0 -22 V10"/><path d="M-12 -2 L0 10 L12 -2"/><path d="M-18 14 V20 H18 V14"/>
  </g>
  <text x="152" y="50" text-anchor="middle" dominant-baseline="central" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="46" fill="#FFFFFF">PDF</text>
</svg>
`;
}

export function generate(outDir = defaultOut) {
  mkdirSync(outDir, { recursive: true });
  for (const card of cards) writeFileSync(join(outDir, card.file), sectionCard(card));
  for (const card of ideCards) writeFileSync(join(outDir, card.file), ideCard(card));
  writeFileSync(join(outDir, DOWNLOAD_BUTTON), renderDownloadButton());
  writeFileSync(join(outDir, DOWNLOAD_BUTTON_COMPACT), renderCompactDownloadButton());
  return cards.length + ideCards.length + 2;
}

// Hand-made home page cards are restyled where they live (modules/ROOT/images).
export function restyleHomeCards(dir = defaultOut) {
  for (const h of homeCards) {
    const file = join(dir, h.file);
    writeFileSync(file, restyle(readFileSync(file, 'utf8'), h.colors));
  }
  return homeCards.length;
}

// Table of the source and licence of every card's mark, for the PR description (not published).
export function renderSources() {
  const lines = [
    '# Card logo sources',
    '',
    'Generated by `generate-cards.mjs`; do not edit by hand. Marks are monochrome white copies of the path data from',
    'Simple Icons (CC0-1.0) and Devicon (MIT). Where no mark is available, or where the owner is not represented in',
    'those sets (Java, AWS, Microsoft products), a drawn white-line glyph is used instead; no trademark is redrawn.',
    'Logos are trademarks of their respective owners, used for identification only.',
    '',
    '| Card | Title | Mark | Source | Licence | Source file |',
    '|---|---|---|---|---|---|',
  ];
  for (const c of [...cards, ...ideCards]) {
    if (c.logo.startsWith('gl:')) {
      lines.push(`| ${c.file} | ${c.title} | drawn glyph "${c.logo.slice(3)}" | own drawing | n/a | n/a |`);
    } else {
      const l = logos[c.logo];
      lines.push(`| ${c.file} | ${c.title} | ${c.logo.slice(3)} | ${l.source} ${l.version} | ${l.license} | ${l.file} |`);
    }
  }
  lines.push(
    '',
    '== Logos of the monitoring guide figures',
    '',
    'The figures of `scripts/monitoring-guides/` draw these marks in the product\'s real colour (the `colour` field of',
    '`logos.json`, set in `guide-logos.mjs`). Same path data and licences as above; Tempo is the vendor\'s own asset.',
    '',
    '| Logo | Colour | Source | Licence | Source file |',
    '|---|---|---|---|---|',
  );
  for (const g of guideLogos) {
    const l = logos[g.key];
    lines.push(`| ${g.title} | ${g.colour} | ${l.source}${l.version.startsWith('vendor') ? '' : ' ' + l.version} | ${l.license} | ${l.file} |`);
  }
  return lines.join('\n') + '\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = process.argv[2] ? resolve(process.argv[2]) : defaultOut;
  console.log(`wrote ${generate(out)} generated SVGs`);
  if (out === defaultOut) console.log(`restyled ${restyleHomeCards()} home cards`);
  writeFileSync(join(here, 'LOGO-SOURCES.md'), renderSources());
}
