// Turns a figure spec into an SVG string (deterministic: no dates, random numbers or ids) and writes it to
// modules/ROOT/images/. A figure is { id, alt, width, height, nodes }; the theme comes from the product's theme module.
// A node is { block, ...props, children? } where `block` is a key of the `blocks` table in lib/blocks.mjs. Node
// props use theme token names for colours (never CSS colours). Text is real SVG text.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { blocks, esc } from './blocks.mjs';
import { tok } from './tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const imagesDir = join(here, '..', '..', '..', 'modules', 'ROOT', 'images');

function renderNode(ctx, node, path) {
  const fn = blocks[node?.block];
  if (!fn) throw new Error(`${path}: unknown block "${node?.block}"`);
  const { block, children, ...props } = node;
  const inner = (children ?? []).map((c, i) => renderNode(ctx, c, `${path}.${block}[${i}]`)).join('\n');
  try {
    return fn(ctx, props, inner);
  } catch (e) {
    e.message = `${path}.${block}: ${e.message}`;
    throw e;
  }
}

// `svgId` names the ids inside the SVG (title, filters); generate-figures.mjs passes the file name, so two figures inlined in
// one page never share an id. Without it the figure id is used.
export function renderSvg({ id, alt, width, height, theme, nodes, svgId }) {
  if (!id) throw new Error('figure without id');
  if (typeof alt !== 'string' || !alt.trim()) throw new Error(`${id}: empty alt text`);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) throw new Error(`${id}: width and height must be positive integers`);
  if (!Array.isArray(nodes) || nodes.length === 0) throw new Error(`${id}: a figure needs at least one node`);
  const idPrefix = String(svgId ?? id).replace(/[^A-Za-z0-9_-]/g, '-');
  const ctx = { theme, width, idPrefix };
  const body = nodes.map((nd, i) => renderNode(ctx, nd, `${id}.nodes[${i}]`)).join('\n');
  const family = tok(theme, 'font.family');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="${idPrefix}-title" font-family="${esc(family)}">
<title id="${idPrefix}-title">${esc(alt)}</title>
${body}
</svg>
`;
}

// monitoring-alerting-<product>-guide-<guide>-<nn>-<what>.svg for a guide spec ({ guide }),
// monitoring-alerting-<product>-map-<area>.svg for a screen-map spec ({ maps: true }); the figure id is "<nn>-<what>" or "<area>".
export function figureFileName(spec, figure) {
  const base = spec.maps ? `monitoring-alerting-${spec.product}-map-${figure.id}` : `monitoring-alerting-${spec.product}-guide-${spec.guide}-${figure.id}`;
  return `${base}.svg`;
}

export function expectedIdPattern(spec) {
  return spec.maps ? /^[a-z0-9]+(-[a-z0-9]+)*$/ : /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;
}

// Writes the figure only when its content changed; returns whether it wrote.
export function writeFigure(file, svg, dir = imagesDir) {
  if (isUpToDate(file, svg, dir)) return false;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, file), svg);
  return true;
}

export function isUpToDate(file, svg, dir = imagesDir) {
  const p = join(dir, file);
  return existsSync(p) && readFileSync(p, 'utf8') === svg;
}
