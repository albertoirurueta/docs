// Renders one-page A4 cheat-sheet PDFs into modules/ROOT/attachments/ from the content modules in sheets/, in the
// house layout of the existing cheat sheets (title, subtitle, three-column grid of tinted boxes, footer), via
// headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`).
//   node scripts/cheat-sheet-pdfs/render.mjs [sheet ...]     (sheet = module name in sheets/, default: all)
//   node scripts/cheat-sheet-pdfs/render.mjs --html <sheet>  (writes the HTML only, to stdout)
// A sheet that does not fit on one page fails the run.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const attachments = resolve(here, '../../modules/ROOT/attachments');
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Box tints: [heading colour, background, border, code background].
export const tints = {
  indigo: ['#4338ca', '#eef0fd', '#c7cbf5', '#f7f8fe'],
  cyan: ['#0e7490', '#ecfbfd', '#b3e8f0', '#f6fdfe'],
  green: ['#15803d', '#effbf3', '#bde9cc', '#f7fdf9'],
  orange: ['#b45309', '#fff6ec', '#f6d6b0', '#fffbf6'],
  pink: ['#be185d', '#fdf0f6', '#f4c4da', '#fef8fb'],
  yellow: ['#a16207', '#fffbea', '#f3e1a0', '#fffdf5'],
  violet: ['#6d28d9', '#f5f1fe', '#d9cbf8', '#fbf9ff'],
  slate: ['#334155', '#f1f4f8', '#cfd7e2', '#f8fafc'],
  teal: ['#0f766e', '#edfaf8', '#b5e5de', '#f7fdfc'],
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function validate(sheet, name) {
  const fail = (m) => { throw new Error(`${name}: ${m}`); };
  for (const k of ['file', 'title', 'subtitle', 'footer', 'boxes']) if (!sheet[k]) fail(`missing ${k}`);
  if (!/^[a-z0-9-]+-cheat-sheet\.pdf$/.test(sheet.file)) fail(`bad file name ${sheet.file}`);
  if (sheet.boxes.length < 6 || sheet.boxes.length > 12) fail('needs 6 to 12 boxes');
  for (const b of sheet.boxes) {
    if (!tints[b.color]) fail(`unknown colour ${b.color} in ${b.title}`);
    if (!b.items?.length) fail(`box ${b.title} has no items`);
    for (const it of b.items) {
      if (!it.label || (!it.code && !it.text)) fail(`item in ${b.title} needs a label and code or text`);
      for (const line of (it.code ?? '').split('\n')) if (line.length > 44) fail(`code line over 44 chars (the column width) in ${b.title}: ${line}`);
    }
  }
}

export function renderHtml(sheet) {
  const boxes = sheet.boxes.map((b) => {
    const [head, bg, border, codeBg] = tints[b.color];
    const items = b.items.map((it) => `<h3>${esc(it.label)}</h3>${
      it.code ? `<pre style="background:${codeBg}">${esc(it.code)}</pre>` : `<p>${esc(it.text)}</p>`}`).join('');
    return `<section style="background:${bg};border-color:${border}"><h2 style="color:${head}">${esc(b.title)}</h2>${items}</section>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(sheet.title)}</title>
<style>
  @page { size: A4; margin: 10mm 9mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; color: #1f2937; }
  header { text-align: center; margin: 2mm 0 4mm; }
  h1 { font-size: 19pt; margin: 0 0 1.5mm; color: #111827; }
  .sub { font-size: 6.6pt; color: #6b7280; margin: 0; }
  main { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.6mm; align-items: start; }
  section { border: 0.8px solid; border-radius: 2.2mm; padding: 2.4mm 2.6mm 1.6mm; break-inside: avoid; }
  h2 { font-size: 7.4pt; letter-spacing: 0.02em; text-transform: uppercase; margin: 0 0 1.4mm; }
  h3 { font: 700 6.4pt Menlo, "DejaVu Sans Mono", monospace; margin: 1.6mm 0 0.8mm; color: #111827; }
  pre { font: 5.7pt/1.38 Menlo, "DejaVu Sans Mono", monospace; margin: 0 0 1mm; padding: 1.3mm 1.6mm;
        border-radius: 1.2mm; white-space: pre-wrap; overflow-wrap: anywhere; }
  p { font-size: 6.2pt; line-height: 1.35; margin: 0 0 1mm; }
  footer { text-align: center; font-size: 6pt; color: #9ca3af; margin-top: 3mm; }
</style></head>
<body>
<header><h1>${esc(sheet.title)}</h1><p class="sub">${esc(sheet.subtitle)}</p></header>
<main>
${boxes}
</main>
<footer>${esc(sheet.footer)}</footer>
</body></html>
`;
}

// Page count from the PDF's page tree (/Type /Pages ... /Count n), without a PDF library.
export function pageCount(pdf) {
  const m = [...pdf.toString('latin1').matchAll(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/g)];
  if (!m.length) throw new Error('page count not found');
  return Math.max(...m.map((x) => Number(x[1])));
}

export async function loadSheet(name) {
  const mod = await import(pathToFileURL(join(here, 'sheets', `${name}.mjs`)).href);
  validate(mod.default, name);
  return mod.default;
}

export function renderPdf(sheet, outFile) {
  const dir = mkdtempSync(join(tmpdir(), 'cheat-'));
  const html = join(dir, 'sheet.html');
  const pdf = join(dir, 'sheet.pdf');
  let bytes;
  try {
    writeFileSync(html, renderHtml(sheet));
    execFileSync(CHROME, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdf}`,
      pathToFileURL(html).href], { stdio: 'ignore' });
    bytes = readFileSync(pdf);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  const pages = pageCount(bytes);
  if (pages !== 1) throw new Error(`${sheet.file}: renders on ${pages} pages, must fit on one`);
  writeFileSync(outFile, bytes);
  return pages;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args[0] === '--html') {
    process.stdout.write(renderHtml(await loadSheet(args[1])));
  } else {
    const names = args.length ? args : readdirSync(join(here, 'sheets')).filter((f) => f.endsWith('.mjs')).map((f) => f.slice(0, -4));
    if (!existsSync(CHROME)) throw new Error(`Chrome not found at ${CHROME} (set CHROME)`);
    for (const name of names) {
      const sheet = await loadSheet(name);
      renderPdf(sheet, join(attachments, sheet.file));
      console.log(`${name}: wrote ${sheet.file} (1 page)`);
    }
  }
}
