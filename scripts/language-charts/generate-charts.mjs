#!/usr/bin/env node
// Dependency-free SVG chart generator for the "Programming Languages Comparative" guide.
// Reads the CSVs in ./data and writes SVGs named programming-languages-<id>.svg.
// Usage: node scripts/language-charts/generate-charts.mjs [--out <dir>]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isMissing, toNumber } from './data-utils.mjs';
import { CHART_BUILDERS } from './chart-definitions.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = join(HERE, 'data');
export const DEFAULT_OUT_DIR = resolve(HERE, '..', '..', 'modules', 'ROOT', 'images');
export const FILE_PREFIX = 'programming-languages-';

// ---------------------------------------------------------------- CSV

/** Parses RFC 4180 style CSV text (quotes, escaped quotes, CRLF, embedded newlines) into string rows. */
export function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field); field = '';
      rows.push(row); row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0] === ''));
}

/** Parses CSV text into an array of objects keyed by the header row. */
export function parseCsv(text) {
  const [header, ...body] = parseCsvRows(text);
  if (!header) return [];
  return body.map((cells) => Object.fromEntries(header.map((h, i) => [h, cells[i] ?? ''])));
}

/** Reads a CSV file from the data directory (or an absolute path). */
export function readCsv(name, dir = DATA_DIR) {
  return parseCsv(readFileSync(resolve(dir, name), 'utf8'));
}

export { isMissing, toNumber };

// ---------------------------------------------------------------- scales

/** Rounds a value up to a "nice" number (1, 2, 5 times a power of ten). */
function niceNumber(range, round) {
  const exp = Math.floor(Math.log10(range));
  const f = range / 10 ** exp;
  let nf;
  if (round) nf = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
  else nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10;
  return nf * 10 ** exp;
}

/** Computes a nice axis: {min, max, step, ticks}. Ignores null values; always includes zero when `zero` is true. */
export function niceScale(values, { zero = false, maxTicks = 6 } = {}) {
  const nums = values.filter((v) => typeof v === 'number' && Number.isFinite(v));
  let lo = nums.length ? Math.min(...nums) : 0;
  let hi = nums.length ? Math.max(...nums) : 1;
  if (zero) { lo = Math.min(lo, 0); hi = Math.max(hi, 0); }
  if (lo === hi) { if (lo === 0) hi = 1; else { lo -= Math.abs(lo) * 0.1; hi += Math.abs(hi) * 0.1; } }
  const range = niceNumber(hi - lo, false);
  const step = niceNumber(range / (maxTicks - 1), true);
  const min = Math.floor(lo / step) * step;
  const max = Math.ceil(hi / step) * step;
  const ticks = [];
  const n = Math.round((max - min) / step);
  for (let i = 0; i <= n; i++) ticks.push(roundTo(min + i * step, 10));
  return { min: roundTo(min, 10), max: roundTo(max, 10), step, ticks };
}

function roundTo(v, digits) { return Number(v.toFixed(digits)); }

/** Linear mapping from a domain to a pixel range. */
export function linearScale(d0, d1, r0, r1) {
  const span = d1 - d0;
  return (v) => (span === 0 ? (r0 + r1) / 2 : r0 + ((v - d0) / span) * (r1 - r0));
}

// ---------------------------------------------------------------- SVG helpers

export function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

const fmt = (n) => String(roundTo(n, 2));

export function formatTick(v) {
  if (Math.abs(v) >= 1e6) return `${roundTo(v / 1e6, 2)}M`;
  if (Math.abs(v) >= 1e4) return `${roundTo(v / 1e3, 1)}k`;
  return String(roundTo(v, 2));
}

// Okabe-Ito palette (colour-blind safe). The site UI has no dark theme, so the charts use one light palette instead
// of following the reader's OS colour scheme, which would put dark panels on the white page.
const LIGHT = ['#0072B2', '#D55E00', '#009E73', '#CC79A7', '#E69F00', '#56B4E9', '#7A6A00', '#000000'];
const DASHES = ['', '6 3', '2 2', '8 3 2 3', '4 4', '10 3', '1 3', '6 2 1 2'];
const MARKERS = ['circle', 'square', 'triangle', 'diamond', 'cross', 'circle', 'square', 'triangle'];
export const PALETTE_SIZE = LIGHT.length;

function styleBlock() {
  const vars = (p) => p.map((c, i) => `--s${i}:${c};`).join('');
  return `<style>
:root{--bg:#ffffff;--fg:#1f2328;--muted:#59636e;--grid:#d1d9e0;--axis:#59636e;${vars(LIGHT)}}
text{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;fill:var(--fg);font-size:12px}
.title{font-size:16px;font-weight:600}.muted{fill:var(--muted)}.axis-label{font-size:12px;fill:var(--muted)}
.grid{stroke:var(--grid);stroke-width:1;fill:none}.axis{stroke:var(--axis);stroke-width:1;fill:none}
.na{fill:var(--muted);font-style:italic}
</style>`;
}

function markerShape(kind, x, y, cls, r = 4) {
  const c = `class="${cls}"`;
  switch (kind) {
    case 'square': return `<rect ${c} x="${fmt(x - r)}" y="${fmt(y - r)}" width="${2 * r}" height="${2 * r}"/>`;
    case 'triangle': return `<path ${c} d="M${fmt(x)} ${fmt(y - r - 1)}L${fmt(x + r + 1)} ${fmt(y + r)}L${fmt(x - r - 1)} ${fmt(y + r)}Z"/>`;
    case 'diamond': return `<path ${c} d="M${fmt(x)} ${fmt(y - r - 1)}L${fmt(x + r + 1)} ${fmt(y)}L${fmt(x)} ${fmt(y + r + 1)}L${fmt(x - r - 1)} ${fmt(y)}Z"/>`;
    case 'cross': return `<path ${c} d="M${fmt(x - r)} ${fmt(y - r)}L${fmt(x + r)} ${fmt(y + r)}M${fmt(x + r)} ${fmt(y - r)}L${fmt(x - r)} ${fmt(y + r)}" style="fill:none;stroke-width:2"/>`;
    default: return `<circle ${c} cx="${fmt(x)}" cy="${fmt(y)}" r="${r}"/>`;
  }
}

/** Per-series classes: stroke/fill colour from CSS variables. */
function seriesCss(count) {
  let css = '';
  for (let i = 0; i < count; i++) {
    const k = i % PALETTE_SIZE;
    css += `.l${i}{stroke:var(--s${k});stroke-width:2;fill:none;${DASHES[k] ? `stroke-dasharray:${DASHES[k]};` : ''}stroke-linejoin:round}`
      + `.m${i}{fill:var(--s${k});stroke:var(--s${k})}`
      + `.f${i}{fill:var(--s${k})}`
      + `.a${i}{fill:var(--s${k});fill-opacity:.12;stroke:var(--s${k});stroke-width:2;${DASHES[k] ? `stroke-dasharray:${DASHES[k]};` : ''}}`;
  }
  return `<style>${css}</style>`;
}

function legend(names, x, y, width, { lines = true } = {}) {
  // Column width fits the longest name (about 6.6px per character after the 30px swatch) so labels never overlap.
  const itemW = Math.max(150, Math.ceil(Math.max(0, ...names.map((n) => String(n).length)) * 6.6) + 44);
  const perRow = Math.max(1, Math.floor(width / itemW));
  const parts = [];
  names.forEach((name, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const lx = x + col * itemW;
    const ly = y + row * 20;
    const k = i % PALETTE_SIZE;
    if (lines) parts.push(`<line class="l${i}" x1="${lx}" y1="${ly}" x2="${lx + 24}" y2="${ly}"/>`);
    parts.push(markerShape(MARKERS[k], lx + 12, ly, `m${i}`, 4));
    parts.push(`<text x="${lx + 30}" y="${ly + 4}">${escapeXml(name)}</text>`);
  });
  const rows = Math.ceil(names.length / perRow);
  return { svg: `<g class="legend">${parts.join('')}</g>`, height: rows * 20 };
}

function wrap({ width, height, title, desc, body, seriesCount, id }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${escapeXml(title)}</title>
<desc id="${id}-d">${escapeXml(desc)}</desc>
${styleBlock()}
${seriesCss(seriesCount)}
<rect width="${width}" height="${height}" fill="var(--bg)"/>
<text class="title" x="${width / 2}" y="24" text-anchor="middle">${escapeXml(title)}</text>
${body}
</svg>
`;
}

function requireFields(spec, fields) {
  for (const f of fields) if (spec[f] === undefined || spec[f] === null || spec[f] === '') throw new Error(`chart "${spec.id ?? '?'}" is missing "${f}"`);
}

/** Axes, grid and axis labels for cartesian charts. */
function cartesianFrame({ plot, xScale, yScale, xTicks, yTicks, xLabel, yLabel, xFormat = formatTick, yFormat = formatTick, height }) {
  const g = [];
  for (const t of yTicks) {
    const y = yScale(t);
    g.push(`<line class="grid" x1="${plot.l}" y1="${fmt(y)}" x2="${plot.r}" y2="${fmt(y)}"/>`);
    g.push(`<text class="muted" x="${plot.l - 8}" y="${fmt(y + 4)}" text-anchor="end">${escapeXml(yFormat(t))}</text>`);
  }
  for (const t of xTicks) {
    const x = xScale(t);
    g.push(`<line class="grid" x1="${fmt(x)}" y1="${plot.t}" x2="${fmt(x)}" y2="${plot.b}"/>`);
    g.push(`<text class="muted" x="${fmt(x)}" y="${plot.b + 18}" text-anchor="middle">${escapeXml(xFormat(t))}</text>`);
  }
  g.push(`<path class="axis" d="M${plot.l} ${plot.t}V${plot.b}H${plot.r}"/>`);
  g.push(`<text class="axis-label" x="${(plot.l + plot.r) / 2}" y="${plot.b + 40}" text-anchor="middle">${escapeXml(xLabel)}</text>`);
  g.push(`<text class="axis-label" transform="translate(16 ${(plot.t + plot.b) / 2}) rotate(-90)" text-anchor="middle">${escapeXml(yLabel)}</text>`);
  return g.join('');
}

// ---------------------------------------------------------------- line chart

/**
 * Spec: {id,title,desc,xLabel,yLabel,series:[{name,points:[{x,y}]}], yZero?, width?, height?}
 * A point with y null/NaN/'n/a' is a gap: the line is broken there and nothing is drawn.
 */
export function renderLineChart(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'xLabel', 'yLabel', 'series']);
  const width = spec.width ?? 800;
  const series = spec.series.map((s) => ({
    name: s.name,
    points: s.points.map((p) => ({ x: toNumber(p.x), y: toNumber(p.y) })).filter((p) => p.x !== null),
  }));
  const names = series.map((s) => s.name);
  const lg = legend(names, 70, 0, width - 90);
  const top = 44 + lg.height + 10;
  const height = spec.height ?? 460 + lg.height;
  const plot = { l: 70, r: width - 24, t: top, b: height - 56 };
  const xs = series.flatMap((s) => s.points.map((p) => p.x));
  const ys = series.flatMap((s) => s.points.map((p) => p.y));
  const xSc = niceScale(xs, { maxTicks: 8 });
  const ySc = niceScale(ys, { zero: spec.yZero ?? true });
  const xScale = linearScale(xSc.min, xSc.max, plot.l, plot.r);
  const yScale = linearScale(ySc.min, ySc.max, plot.b, plot.t);
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  body += cartesianFrame({ plot, xScale, yScale, xTicks: xSc.ticks, yTicks: ySc.ticks, xLabel: spec.xLabel, yLabel: spec.yLabel, xFormat: (v) => String(v) });
  series.forEach((s, i) => {
    const segments = [];
    let cur = [];
    for (const p of s.points) {
      if (p.y === null) { if (cur.length) segments.push(cur); cur = []; } else cur.push(p);
    }
    if (cur.length) segments.push(cur);
    for (const seg of segments) {
      if (seg.length > 1) body += `<path class="l${i}" d="${seg.map((p, j) => `${j ? 'L' : 'M'}${fmt(xScale(p.x))} ${fmt(yScale(p.y))}`).join('')}"/>`;
      for (const p of seg) body += markerShape(MARKERS[i % PALETTE_SIZE], xScale(p.x), yScale(p.y), `m${i}`, seg.length > 24 ? 2 : 3.5);
    }
  });
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: series.length, id: spec.id });
}

// ---------------------------------------------------------------- bar chart

/**
 * Horizontal bars. Spec: {id,title,desc,xLabel (value axis, with unit),yLabel (category axis),
 * seriesName?, items:[{label,value}], valueFormat?, width?}. A missing value renders the label with "n/a" and no bar.
 */
export function renderBarChart(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'xLabel', 'yLabel', 'items']);
  const width = spec.width ?? 800;
  const items = spec.items.map((it) => ({ label: it.label, value: toNumber(it.value) }));
  const lg = legend([spec.seriesName ?? spec.xLabel], 70, 0, width - 90, { lines: false });
  const rowH = 26;
  const top = 44 + lg.height + 14;
  const plotH = items.length * rowH;
  const height = spec.height ?? top + plotH + 60;
  const labelW = Math.min(220, Math.max(80, Math.max(0, ...items.map((i) => i.label.length)) * 7 + 12));
  const plot = { l: 24 + labelW, r: width - 56, t: top, b: top + plotH };
  const sc = niceScale(items.map((i) => i.value), { zero: true });
  const xScale = linearScale(sc.min, sc.max, plot.l, plot.r);
  const f = spec.valueFormat ?? ((v) => String(roundTo(v, 2)));
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  for (const t of sc.ticks) {
    body += `<line class="grid" x1="${fmt(xScale(t))}" y1="${plot.t}" x2="${fmt(xScale(t))}" y2="${plot.b}"/>`;
    body += `<text class="muted" x="${fmt(xScale(t))}" y="${plot.b + 18}" text-anchor="middle">${escapeXml(formatTick(t))}</text>`;
  }
  body += `<path class="axis" d="M${plot.l} ${plot.t}V${plot.b}H${plot.r}"/>`;
  const zeroX = xScale(Math.max(0, sc.min));
  items.forEach((it, i) => {
    const y = plot.t + i * rowH;
    body += `<text x="${plot.l - 8}" y="${y + rowH / 2 + 4}" text-anchor="end">${escapeXml(it.label)}</text>`;
    if (it.value === null) {
      body += `<text class="na" x="${zeroX + 6}" y="${y + rowH / 2 + 4}">n/a</text>`;
    } else {
      const x = xScale(it.value);
      body += `<rect class="f0" x="${fmt(Math.min(x, zeroX))}" y="${y + 4}" width="${fmt(Math.abs(x - zeroX))}" height="${rowH - 8}"/>`;
      body += `<text class="muted" x="${fmt(Math.max(x, zeroX) + 5)}" y="${y + rowH / 2 + 4}">${escapeXml(f(it.value))}</text>`;
    }
  });
  body += `<text class="axis-label" x="${(plot.l + plot.r) / 2}" y="${plot.b + 40}" text-anchor="middle">${escapeXml(spec.xLabel)}</text>`;
  body += `<text class="axis-label" transform="translate(16 ${(plot.t + plot.b) / 2}) rotate(-90)" text-anchor="middle">${escapeXml(spec.yLabel)}</text>`;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: 1, id: spec.id });
}

// ---------------------------------------------------------------- scatter chart

/** Approximate bounding box of a point label drawn to the right of its marker (text is about 6.4px per character). */
export function labelBox(x, y, label) {
  return { x0: x + 8, x1: x + 8 + String(label).length * 6.4, y0: y - 9, y1: y + 5 };
}

export function boxesOverlap(a, b) {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

/**
 * Spec: {id,title,desc,xLabel,yLabel,series:[{name,points:[{x,y,label?}]}], width?, height?, xZero?, yZero?}
 * Points lacking x or y are skipped (never plotted at zero). Optional xExtent/yExtent: values the axis must also
 * cover (room for point labels).
 */
export function renderScatterChart(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'xLabel', 'yLabel', 'series']);
  const width = spec.width ?? 800;
  const series = spec.series.map((s) => ({
    name: s.name,
    points: s.points.map((p) => ({ x: toNumber(p.x), y: toNumber(p.y), label: p.label, weight: p.weight })).filter((p) => p.x !== null && p.y !== null),
  }));
  const lg = legend(series.map((s) => s.name), 70, 0, width - 90, { lines: false });
  const top = 44 + lg.height + 10;
  const height = spec.height ?? 480 + lg.height;
  const plot = { l: 70, r: width - 30, t: top, b: height - 56 };
  const all = series.flatMap((s) => s.points);
  const xSc = niceScale([...all.map((p) => p.x), ...(spec.xExtent ?? [])], { zero: spec.xZero ?? false });
  const ySc = niceScale([...all.map((p) => p.y), ...(spec.yExtent ?? [])], { zero: spec.yZero ?? false });
  const xScale = linearScale(xSc.min, xSc.max, plot.l, plot.r);
  const yScale = linearScale(ySc.min, ySc.max, plot.b, plot.t);
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  body += cartesianFrame({ plot, xScale, yScale, xTicks: xSc.ticks, yTicks: ySc.ticks, xLabel: spec.xLabel, yLabel: spec.yLabel });
  // Labels are placed greedily (highest `weight` first, else in input order) and skipped when they would overlap a
  // label already placed; the marker stays and its <title> tooltip still names the point.
  const placed = [];
  const order = series.flatMap((s, i) => s.points.map((p, j) => ({ p, i, j })))
    .sort((a, b) => (b.p.weight ?? 0) - (a.p.weight ?? 0));
  const showLabel = new Set();
  for (const { p } of order) {
    if (!p.label) continue;
    const box = labelBox(xScale(p.x), yScale(p.y), p.label);
    if (placed.some((q) => boxesOverlap(box, q))) continue;
    placed.push(box);
    showLabel.add(p);
  }
  series.forEach((s, i) => {
    for (const p of s.points) {
      const x = xScale(p.x);
      const y = yScale(p.y);
      const tip = p.label ? `<title>${escapeXml(p.label)}</title>` : '';
      body += `<g>${tip}${markerShape(MARKERS[i % PALETTE_SIZE], x, y, `m${i}`, 4.5)}`;
      if (showLabel.has(p)) body += `<text class="muted" x="${fmt(x + 8)}" y="${fmt(y + 4)}">${escapeXml(p.label)}</text>`;
      body += '</g>';
    }
  });
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: series.length, id: spec.id });
}

// ---------------------------------------------------------------- radar chart

/**
 * Spec: {id,title,desc,axes:[label],max?(default 10),unit?,series:[{name,values:[number|null]}], width?}
 * Missing values are gaps: the outline is broken at that axis, never drawn to the centre.
 */
export function renderRadarChart(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'axes', 'series']);
  if (spec.axes.length < 3) throw new Error(`chart "${spec.id}" needs at least 3 axes`);
  const width = spec.width ?? 760;
  const max = spec.max ?? 10;
  const unit = spec.unit ?? 'score 0-10';
  const series = spec.series.map((s) => ({ name: s.name, values: spec.axes.map((_, i) => toNumber(s.values[i])) }));
  const lg = legend(series.map((s) => s.name), 40, 0, width - 60);
  const top = 44 + lg.height + 20;
  const radius = 190;
  const cx = width / 2;
  const cy = top + radius + 40;
  const height = spec.height ?? cy + radius + 70;
  const n = spec.axes.length;
  const angle = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const pt = (i, v) => [cx + Math.cos(angle(i)) * radius * (v / max), cy + Math.sin(angle(i)) * radius * (v / max)];
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  const rings = 5;
  for (let r = 1; r <= rings; r++) {
    const v = (max * r) / rings;
    body += `<path class="grid" d="${spec.axes.map((_, i) => `${i ? 'L' : 'M'}${fmt(pt(i, v)[0])} ${fmt(pt(i, v)[1])}`).join('')}Z"/>`;
    body += `<text class="muted" x="${fmt(cx + 4)}" y="${fmt(cy - radius * (v / max) + 11)}" font-size="10">${roundTo(v, 2)}</text>`;
  }
  spec.axes.forEach((label, i) => {
    const [x, y] = pt(i, max);
    body += `<line class="grid" x1="${cx}" y1="${cy}" x2="${fmt(x)}" y2="${fmt(y)}"/>`;
    const [lx, ly] = pt(i, max * 1.1);
    const c = Math.cos(angle(i));
    const anchor = Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end';
    body += `<text x="${fmt(lx)}" y="${fmt(ly + 4)}" text-anchor="${anchor}">${escapeXml(label)}</text>`;
  });
  series.forEach((s, i) => {
    const complete = s.values.every((v) => v !== null);
    if (complete) {
      body += `<path class="a${i}" d="${s.values.map((v, j) => `${j ? 'L' : 'M'}${fmt(pt(j, v)[0])} ${fmt(pt(j, v)[1])}`).join('')}Z"/>`;
    } else {
      // Break the outline at missing axes: draw only runs of consecutive present values (cyclic).
      const present = s.values.map((v) => v !== null);
      for (let j = 0; j < n; j++) {
        const k = (j + 1) % n;
        if (present[j] && present[k]) body += `<path class="l${i}" d="M${fmt(pt(j, s.values[j])[0])} ${fmt(pt(j, s.values[j])[1])}L${fmt(pt(k, s.values[k])[0])} ${fmt(pt(k, s.values[k])[1])}"/>`;
      }
    }
    s.values.forEach((v, j) => { if (v !== null) body += markerShape(MARKERS[i % PALETTE_SIZE], pt(j, v)[0], pt(j, v)[1], `m${i}`, 3.5); });
  });
  body += `<text class="axis-label" x="${cx}" y="${height - 20}" text-anchor="middle">${escapeXml(`Scale: ${unit}; gaps mean no data (n/a)`)}</text>`;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: series.length, id: spec.id });
}

// ---------------------------------------------------------------- rendering and CLI

export const RENDERERS = { line: renderLineChart, bar: renderBarChart, scatter: renderScatterChart, radar: renderRadarChart };

/** Renders one chart definition ({type, ...spec}) to SVG text. */
export function renderChart(def) {
  const r = RENDERERS[def.type];
  if (!r) throw new Error(`unknown chart type "${def.type}" (chart "${def.id ?? '?'}")`);
  return r(def);
}

/**
 * Chart definitions. Each is {type, id, title, desc, ...}, or a function (data) => spec that builds one from the
 * CSV data (see `loadData`). The final set of guide charts is added here.
 */
export const CHART_DEFINITIONS = [...CHART_BUILDERS];

/** Loads every CSV in the data directory into a { name: rows } map (name without extension). */
export function loadData(dir = DATA_DIR) {
  const names = ['languages', 'popularity-current', 'popularity-history', 'ecosystem', 'ecosystem-history', 'performance',
    'energy', 'learning', 'learning-so', 'onboarding-checks', 'security', 'versatility', 'versatility-domains', 'jobs', 'sources'];
  return Object.fromEntries(names.map((n) => [n, readCsv(`${n}.csv`, dir)]));
}

/** Renders and writes all definitions to `outDir`; returns the written file paths. */
export function generateCharts(definitions, data, outDir) {
  mkdirSync(outDir, { recursive: true });
  return definitions.map((d) => {
    const def = typeof d === 'function' ? d(data) : d;
    const file = join(outDir, `${FILE_PREFIX}${def.id}.svg`);
    writeFileSync(file, renderChart(def));
    return file;
  });
}

function main(argv) {
  const i = argv.indexOf('--out');
  if (i >= 0 && (argv[i + 1] === undefined || argv[i + 1].startsWith('--'))) {
    console.error('Usage: node scripts/language-charts/generate-charts.mjs [--out <dir>]');
    process.exitCode = 2;
    return;
  }
  const outDir = i >= 0 ? resolve(argv[i + 1]) : DEFAULT_OUT_DIR;
  const files = generateCharts(CHART_DEFINITIONS, loadData(), outDir);
  console.log(`Wrote ${files.length} chart(s) to ${outDir}`);
  files.forEach((f) => console.log(`  ${f}`));
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2));
