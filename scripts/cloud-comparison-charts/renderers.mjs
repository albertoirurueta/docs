// Renderers that the shared line, bar and radar renderers of scripts/language-charts do not offer: grouped vertical
// bars, small-multiple bars with a value axis per panel and a generic colour-coded grid (heatmaps and matrices). They
// reuse the shared helpers (palette, legend, frame, XML escaping) so every figure looks the same. `renderCloudChart`
// also draws the footer (source ids and "as of" date) that every cloud comparison figure carries.
import {
  escapeXml, fmt, formatTick, legend, linearScale, niceScale, renderChart, roundTo, wrap, markerShape, PALETTE_SIZE,
} from '../language-charts/generate-charts.mjs';
import { toNumber } from '../language-charts/data-utils.mjs';

const FOOTER_LINE = 15;

/** Greedy word wrap into lines of at most `max` characters (a longer word keeps its own line). */
export function wrapText(text, max) {
  const lines = [];
  let cur = '';
  for (const w of String(text).split(/\s+/).filter(Boolean)) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
}

/** A `<text>` block with one `<tspan>` per line, anchored at (x, y) of the first line. */
function textLines(lines, x, y, { anchor = 'start', lineHeight = 14, cls = '' } = {}) {
  return `<text${cls ? ` class="${cls}"` : ''} x="${fmt(x)}" y="${fmt(y)}" text-anchor="${anchor}">${lines.map((l, i) =>
    `<tspan x="${fmt(x)}" dy="${i ? lineHeight : 0}">${escapeXml(l)}</tspan>`).join('')}</text>`;
}

// ---------------------------------------------------------------- grouped bars

/**
 * Vertical grouped bars. Spec: {id,title,desc,xLabel,yLabel,categories:[label],
 * series:[{name,values:[number|null],tips?:[string]}], valueFormat?, width?, yZero?}.
 * The i-th series always uses palette slot i (the provider colour). A missing value draws "n/a" and no bar.
 */
export function renderGroupedBarChart(spec) {
  for (const f of ['id', 'title', 'desc', 'xLabel', 'yLabel', 'categories', 'series']) {
    if (spec[f] === undefined || spec[f] === null || spec[f] === '') throw new Error(`chart "${spec.id ?? '?'}" is missing "${f}"`);
  }
  const width = spec.width ?? 860;
  const cats = spec.categories;
  const series = spec.series.map((s) => ({ ...s, values: cats.map((_, i) => toNumber(s.values[i])) }));
  const lg = legend(series.map((s) => s.name), 70, 0, width - 90, { lines: false });
  const l = 70;
  const r = width - 24;
  const gw = (r - l) / cats.length;
  const charsPerLine = Math.max(8, Math.floor(gw / 6.4));
  const catLines = cats.map((c) => wrapText(c, charsPerLine));
  const maxLines = Math.max(...catLines.map((x) => x.length));
  const top = 44 + lg.height + 24;
  const plotH = spec.plotHeight ?? 300;
  const b = top + plotH;
  const height = b + 12 + maxLines * 14 + 44;
  const sc = niceScale(series.flatMap((s) => s.values), { zero: spec.yZero ?? true });
  const yScale = linearScale(sc.min, sc.max, b, top);
  const f = spec.valueFormat ?? ((v) => String(roundTo(v, 2)));
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  for (const t of sc.ticks) {
    body += `<line class="grid" x1="${l}" y1="${fmt(yScale(t))}" x2="${r}" y2="${fmt(yScale(t))}"/>`;
    body += `<text class="muted" x="${l - 8}" y="${fmt(yScale(t) + 4)}" text-anchor="end">${escapeXml(formatTick(t))}</text>`;
  }
  body += `<path class="axis" d="M${l} ${top}V${b}H${r}"/>`;
  const barW = Math.min(40, (gw * 0.84) / series.length);
  const zeroY = yScale(Math.max(0, sc.min));
  cats.forEach((c, ci) => {
    const gx = l + ci * gw + (gw - barW * series.length) / 2;
    series.forEach((s, si) => {
      const v = s.values[ci];
      const x = gx + si * barW;
      const tip = s.tips?.[ci] ?? `${s.name}: ${v === null ? 'n/a' : f(v)}`;
      if (v === null) {
        body += `<g><title>${escapeXml(`${s.name}: n/a`)}</title><text class="na" x="${fmt(x + barW / 2)}" y="${fmt(zeroY - 6)}" text-anchor="middle" font-size="10">n/a</text></g>`;
      } else {
        const y = yScale(v);
        body += `<g><title>${escapeXml(tip)}</title><rect class="f${si}" x="${fmt(x + 1)}" y="${fmt(Math.min(y, zeroY))}" width="${fmt(barW - 2)}" height="${fmt(Math.max(1, Math.abs(zeroY - y)))}"/>`
          + `<text class="muted" x="${fmt(x + barW / 2)}" y="${fmt(Math.min(y, zeroY) - 4)}" text-anchor="middle" font-size="10">${escapeXml(f(v))}</text></g>`;
      }
    });
    body += textLines(catLines[ci], l + ci * gw + gw / 2, b + 18, { anchor: 'middle' });
  });
  body += `<text class="axis-label" x="${(l + r) / 2}" y="${height - 10}" text-anchor="middle">${escapeXml(spec.xLabel)}</text>`;
  body += `<text class="axis-label" transform="translate(16 ${(top + b) / 2}) rotate(-90)" text-anchor="middle">${escapeXml(spec.yLabel)}</text>`;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: series.length, id: spec.id });
}

// ---------------------------------------------------------------- panels of horizontal bars

/**
 * Small multiples: one panel per survey or population, each with its own title and value axis, so that results of
 * different populations never share an axis. Spec: {id,title,desc,xLabel,panels:[{title,note?,max?,items:[{label,index,value}]}],
 * width?}. `index` is the provider palette slot; a missing value draws "n/a" and no bar.
 */
export function renderPanelBars(spec) {
  for (const f of ['id', 'title', 'desc', 'xLabel', 'panels']) {
    if (spec[f] === undefined || spec[f] === null || spec[f] === '') throw new Error(`chart "${spec.id ?? '?'}" is missing "${f}"`);
  }
  const width = spec.width ?? 860;
  const names = spec.legendNames;
  const lg = legend(names, 70, 0, width - 90, { lines: false });
  const rowH = 24;
  const l = 150;
  const r = width - 70;
  let y = 44 + lg.height + 30;
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  const f = spec.valueFormat ?? ((v) => `${roundTo(v, 1)}%`);
  for (const p of spec.panels) {
    const items = p.items.map((it) => ({ ...it, value: toNumber(it.value) }));
    const sc = niceScale([...items.map((i) => i.value), p.max ?? 0], { zero: true, maxTicks: 6 });
    const x = linearScale(sc.min, sc.max, l, r);
    const noteLines = p.note ? wrapText(p.note, Math.floor((width - 90) / 6)) : [];
    body += `<text x="24" y="${y}" font-weight="600">${escapeXml(p.title)}</text>`;
    if (noteLines.length) body += textLines(noteLines, 24, y + 15, { cls: 'muted', lineHeight: 13 });
    y += 10 + noteLines.length * 13 + 8;
    const t0 = y;
    const t1 = y + items.length * rowH;
    for (const t of sc.ticks) {
      body += `<line class="grid" x1="${fmt(x(t))}" y1="${t0}" x2="${fmt(x(t))}" y2="${t1}"/>`;
      body += `<text class="muted" x="${fmt(x(t))}" y="${t1 + 15}" text-anchor="middle" font-size="11">${escapeXml(formatTick(t))}</text>`;
    }
    body += `<path class="axis" d="M${l} ${t0}V${t1}H${r}"/>`;
    items.forEach((it, i) => {
      const ry = t0 + i * rowH;
      body += `<text x="${l - 8}" y="${ry + rowH / 2 + 4}" text-anchor="end">${escapeXml(it.label)}</text>`;
      if (it.value === null) {
        body += `<text class="na" x="${l + 6}" y="${ry + rowH / 2 + 4}">n/a</text>`;
      } else {
        body += `<rect class="f${it.index}" x="${l}" y="${ry + 4}" width="${fmt(Math.max(1, x(it.value) - l))}" height="${rowH - 8}"/>`;
        body += `<text class="muted" x="${fmt(x(it.value) + 5)}" y="${ry + rowH / 2 + 4}">${escapeXml(f(it.value))}</text>`;
      }
    });
    y = t1 + 22 + 22;
  }
  body += `<text class="axis-label" x="${(l + r) / 2}" y="${y - 12}" text-anchor="middle">${escapeXml(spec.xLabel)}</text>`;
  return wrap({ width, height: y + 6, title: spec.title, desc: spec.desc, body, seriesCount: names.length, id: spec.id });
}

// ---------------------------------------------------------------- colour-coded grid

const GLYPHS = {
  yes: (cx, cy) => `<path d="M${fmt(cx - 7)} ${fmt(cy)}L${fmt(cx - 2)} ${fmt(cy + 5)}L${fmt(cx + 8)} ${fmt(cy - 6)}" fill="none" stroke="#1f2328" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  no: (cx, cy) => `<path d="M${fmt(cx - 6)} ${fmt(cy - 6)}L${fmt(cx + 6)} ${fmt(cy + 6)}M${fmt(cx + 6)} ${fmt(cy - 6)}L${fmt(cx - 6)} ${fmt(cy + 6)}" fill="none" stroke="#1f2328" stroke-width="2.4" stroke-linecap="round"/>`,
  na: (cx, cy) => `<path d="M${fmt(cx - 6)} ${fmt(cy)}H${fmt(cx + 6)}" fill="none" stroke="#59636e" stroke-width="2" stroke-linecap="round"/>`,
};

/**
 * Colour-coded grid. Spec: {id,title,desc,corner?,columns:[{label,color?}],
 * groups:[{title?,rows:[{label,color?,cells:[{text?,sub?,fill,fillOpacity?,glyph?,tip?}]}]}],
 * legend?:[{label,fill,glyph?}], cellW?, cellH?, labelW?, width?}.
 * A cell shows a glyph (`yes`, `no`, `na`) and/or text, never colour alone. `color` on a column or row draws the
 * provider swatch.
 */
export function renderGrid(spec) {
  for (const f of ['id', 'title', 'desc', 'columns', 'groups']) {
    if (spec[f] === undefined || spec[f] === null || spec[f] === '') throw new Error(`chart "${spec.id ?? '?'}" is missing "${f}"`);
  }
  const cellW = spec.cellW ?? 110;
  const cellH = spec.cellH ?? 34;
  const labelW = spec.labelW ?? 260;
  const cols = spec.columns;
  const colLines = cols.map((c) => wrapText(c.label, Math.max(8, Math.floor(cellW / 6.6))));
  const headH = 14 + Math.max(...colLines.map((x) => x.length)) * 14 + 8;
  const width = Math.max(spec.width ?? 0, 24 + labelW + cols.length * cellW + 24);
  const items = spec.legend ?? [];
  const legendRowW = 150;
  const perRow = Math.max(1, Math.floor((width - 48) / legendRowW));
  const legendRows = Math.ceil(items.length / perRow);
  const top = 44 + (legendRows ? legendRows * 22 + 10 : 0);
  let y = top;
  let body = '';
  items.forEach((it, i) => {
    const lx = 24 + (i % perRow) * legendRowW;
    const ly = 44 + Math.floor(i / perRow) * 22;
    body += `<rect x="${lx}" y="${ly - 10}" width="18" height="16" fill="${it.fill}" stroke="#59636e" stroke-width="0.5"/>`;
    if (it.glyph) body += GLYPHS[it.glyph](lx + 9, ly - 2);
    body += `<text x="${lx + 24}" y="${ly + 3}">${escapeXml(it.label)}</text>`;
  });
  const x0 = 24 + labelW;
  if (spec.corner) body += `<text class="axis-label" x="24" y="${y + headH - 8}">${escapeXml(spec.corner)}</text>`;
  cols.forEach((c, i) => {
    const cx = x0 + i * cellW + cellW / 2;
    if (c.color) body += `<rect x="${fmt(cx - cellW / 2 + 4)}" y="${y}" width="${cellW - 8}" height="4" fill="${c.color}"/>`;
    body += textLines(colLines[i], cx, y + 20, { anchor: 'middle' }).replace('<text', '<text font-weight="600"');
  });
  y += headH;
  for (const g of spec.groups) {
    if (g.title) {
      body += `<text x="24" y="${y + 16}" font-weight="600">${escapeXml(g.title)}</text>`;
      body += `<line class="grid" x1="24" y1="${y + 22}" x2="${x0 + cols.length * cellW}" y2="${y + 22}"/>`;
      y += 28;
    }
    for (const row of g.rows) {
      if (row.color) body += `<rect x="24" y="${y + 3}" width="5" height="${cellH - 6}" fill="${row.color}"/>`;
      const labelLines = wrapText(row.label, Math.floor((labelW - 16) / 6.4));
      body += textLines(labelLines, 36, y + cellH / 2 + 4 - ((labelLines.length - 1) * 7), { lineHeight: 14 });
      row.cells.forEach((c, i) => {
        const cx = x0 + i * cellW;
        const tip = c.tip ? `<title>${escapeXml(c.tip)}</title>` : '';
        body += `<g>${tip}<rect x="${cx + 1}" y="${y + 1}" width="${cellW - 2}" height="${cellH - 2}" fill="#ffffff"/>`
          + `<rect x="${cx + 1}" y="${y + 1}" width="${cellW - 2}" height="${cellH - 2}" fill="${c.fill}" fill-opacity="${c.fillOpacity ?? 1}" stroke="#d1d9e0" stroke-width="1"/>`;
        const mid = y + cellH / 2;
        if (c.glyph && !c.text) body += GLYPHS[c.glyph](cx + cellW / 2, mid);
        if (c.text) {
          const lines = [c.text, ...(c.sub ? [c.sub] : [])];
          body += textLines(lines, cx + cellW / 2, c.sub ? mid - 2 : mid + 4, { anchor: 'middle', lineHeight: 13 });
        }
        body += '</g>';
      });
      y += cellH;
    }
    y += 6;
  }
  const height = y + 12;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: 1, id: spec.id });
}

// ---------------------------------------------------------------- dispatch and footer

export const CLOUD_RENDERERS = { groupedbar: renderGroupedBarChart, panelbars: renderPanelBars, grid: renderGrid };

/** Inserts the footer (wrapped to the figure width) under the figure and grows its height to fit. */
export function addFooter(svg, footer) {
  const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!m) throw new Error('svg has no viewBox');
  const [, w, h] = [m[0], Number(m[1]), Number(m[2])];
  const lines = wrapText(footer, Math.floor((w - 48) / 5.6));
  const extra = 12 + lines.length * FOOTER_LINE;
  const nh = h + extra;
  const text = textLines(lines, 24, h + 6, { lineHeight: FOOTER_LINE, cls: 'footer' });
  return svg
    .replace(/viewBox="0 0 \d+ \d+"/, `viewBox="0 0 ${w} ${nh}"`)
    .replace(/(<svg [^>]*?) height="\d+"/, `$1 height="${nh}"`)
    .replace(`<rect width="${w}" height="${h}" fill="var(--bg)"/>`, `<rect width="${w}" height="${nh}" fill="var(--bg)"/>`)
    .replace('</svg>', `<style>.footer{font-size:11px;fill:var(--muted)}</style>\n${text}\n</svg>`);
}

/** Renders any definition: shared renderers or the extra ones above, then the footer when the spec has one. */
export function renderCloudChart(def) {
  const own = CLOUD_RENDERERS[def.type];
  const svg = own ? own(def) : renderChart(def);
  return def.footer ? addFooter(svg, def.footer) : svg;
}

export { PALETTE_SIZE, markerShape };
