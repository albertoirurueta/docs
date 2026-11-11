// UI building blocks of the monitoring guide figures. Every block is a function `(ctx, props, inner)` that returns an
// SVG fragment; `ctx` is `{ theme, width }` and `inner` is the already rendered children of the node. A block draws
// only with theme tokens (read through `tok`/`series` from lib/tokens.mjs), real SVG text, and absolute coordinates in
// the figure's own coordinate system. Colours named in props are token names (`surface`, `textMuted`, `series.2`),
// never CSS colours. The callout and highlight blocks use the site accent from scripts/cards/palette.mjs.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brand } from '../../cards/palette.mjs';
import { textWidth } from './text.mjs';
import { tok, series } from './tokens.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const logos = JSON.parse(readFileSync(join(here, '..', '..', 'cards', 'logos.json'), 'utf8'));

export const MIN_EFFECTIVE_FONT = 10; // px at width=900

export class TextOverflowError extends Error {}

const n = (v) => String(Math.round(v * 100) / 100);
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${typeof v === 'number' ? n(v) : esc(v)}"`).join(' ');

// A colour token name from a spec -> a CSS colour of the theme.
export function colour(theme, name) {
  if (name === 'none') return 'none';
  const s = /^series\.(\d+)$/.exec(name);
  if (s) return series(theme, Number(s[1]));
  return tok(theme, `colour.${name}`);
}
const fontSize = (theme, k) => tok(theme, `font.size.${k}`);

// One text run. `box` is the width it must fit in; a longer run is an error (the figure generator reports it).
export function text(ctx, { x, y, str, size = 'body', weight = 400, tone = 'text', anchor = 'start', box, mono = false, opacity }) {
  const px = typeof size === 'number' ? size : fontSize(ctx.theme, size);
  const eff = (px * Math.min(900, ctx.width)) / ctx.width;
  if (eff < MIN_EFFECTIVE_FONT) throw new TextOverflowError(`font ${px}px is below ${MIN_EFFECTIVE_FONT}px at width=900 in a ${ctx.width}px figure ("${str}")`);
  const w = textWidth(str, px, { weight, mono });
  if (box !== undefined && w > box) throw new TextOverflowError(`text "${str}" is ${Math.round(w)}px wide, its box is ${Math.round(box)}px`);
  const family = mono ? tok(ctx.theme, 'font.mono') : tok(ctx.theme, 'font.family');
  return `<text ${attrs({ x, y, 'font-family': family, 'font-size': px, 'font-weight': weight === 400 ? undefined : weight, fill: colour(ctx.theme, tone), 'text-anchor': anchor === 'start' ? undefined : anchor, opacity, 'xml:space': /^\s|\s$|\s\s/.test(str) ? 'preserve' : undefined })}>${esc(str)}</text>`;
}

export function rect(ctx, { x, y, w, h, fill = 'surface', stroke = 'none', radius = 0, dash, strokeWidth = 1 }) {
  return `<rect ${attrs({ x, y, width: w, height: h, rx: radius || undefined, fill: colour(ctx.theme, fill), stroke: stroke === 'none' ? undefined : colour(ctx.theme, stroke), 'stroke-width': stroke === 'none' ? undefined : strokeWidth, 'stroke-dasharray': dash })}/>`;
}
const line = (ctx, x1, y1, x2, y2, tone = 'border', w = 1) => `<line ${attrs({ x1, y1, x2, y2, stroke: colour(ctx.theme, tone), 'stroke-width': w })}/>`;
const mid = (y, h, size) => y + h / 2 + size * 0.35; // baseline of text centred in a box

// ---------------------------------------------------------------- icons (16x16, stroke)
const ICONS = {
  chevronDown: 'M4 6l4 4 4-4',
  chevronRight: 'M6 4l4 4-4 4',
  close: 'M4 4l8 8M12 4l-8 8',
  plus: 'M8 3v10M3 8h10',
  search: 'M7 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM10.5 10.5L14 14',
  clock: 'M8 2a6 6 0 100 12A6 6 0 008 2zM8 5v3.5l2.5 1.5',
  refresh: 'M13 8a5 5 0 11-1.6-3.7M13 2.5V5h-2.5',
  gear: 'M8 5.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4',
  dots: 'M8 3.5v.01M8 8v.01M8 12.5v.01',
  home: 'M2 8l6-5.5L14 8M3.5 7v6.5h9V7',
  dashboard: 'M2 2.5h5v5H2zM9 2.5h5v3H9zM2 9.5h5v4H2zM9 7.5h5v6H9z',
  explore: 'M8 2a6 6 0 100 12A6 6 0 008 2zM10.5 5.5l-1.3 3.7-3.7 1.3 1.3-3.7z',
  bell: 'M4 11V7a4 4 0 118 0v4l1 1.5H3zM6.5 14a1.5 1.5 0 003 0',
  star: 'M8 2l1.8 3.7 4 .6-2.9 2.8.7 4L8 11.2 4.4 13.1l.7-4L2.2 6.3l4-.6z',
  apps: 'M2.5 2.5h3v3h-3zM10.5 2.5h3v3h-3zM2.5 10.5h3v3h-3zM10.5 10.5h3v3h-3z',
  check: 'M3 8.5l3.2 3.2L13 4.5',
  save: 'M3 2.5h8.5L13.5 4.5v9h-10.5zM5.5 2.5v3.5h5V2.5M5.5 13.5v-4h5v4',
  share: 'M4 8.5v4.5h8V8.5M8 2.5v7M5.5 5L8 2.5 10.5 5',
  folder: 'M2 4h4l1.5 1.5H14v7H2z',
  database: 'M3 4c0-1 2.2-1.7 5-1.7S13 3 13 4s-2.2 1.7-5 1.7S3 5 3 4zM3 4v8c0 1 2.2 1.7 5 1.7s5-.7 5-1.7V4M3 8c0 1 2.2 1.7 5 1.7S13 9 13 8',
  edit: 'M2.5 13.5l.7-3.2 7.6-7.6 2.5 2.5-7.6 7.6zM9.8 3.7l2.5 2.5',
  filter: 'M2 3h12L9.5 8.5V13l-3-1.5V8.5z',
  play: 'M5 3l8 5-8 5z',
  menu: 'M2.5 4.5h11M2.5 8h11M2.5 11.5h11',
  bug: 'M5.5 6a2.5 3 0 015 0v3a2.5 3 0 01-5 0zM8 6v6M3 5l2 1.5M13 5l-2 1.5M3 9h2.5M13 9h-2.5M3.5 13l2-1.5M12.5 13l-2-1.5',
};
export function icon(ctx, { x, y, name, size = 16, tone = 'text' }) {
  const d = ICONS[name];
  if (!d) throw new Error(`unknown icon ${name}`);
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(size / 16)})" fill="none" stroke="${colour(ctx.theme, tone)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></g>`;
}

// ---------------------------------------------------------------- logos in the product's real colour
export function logo(ctx, { x, y, size = 24, key, h }) {
  const l = logos[key];
  if (!l || !l.colour) throw new Error(`logo ${key} has no colour entry in logos.json (add it to scripts/cards/guide-logos.mjs)`);
  const [vw, vh] = Array.isArray(l.viewBox) ? l.viewBox : [l.viewBox, l.viewBox];
  const s = size / Math.max(vw, vh);
  const ox = x + (size - vw * s) / 2;
  const oy = y + (size - vh * s) / 2;
  return `<g transform="translate(${n(ox)} ${n(oy)}) scale(${n(s)})" fill="${l.colour}">${l.paths.map((d) => `<path d="${d}"/>`).join('')}</g>`;
}

// ---------------------------------------------------------------- frames and navigation
// The window frame: the figure's backdrop, with an optional title strip (the product name and a breadcrumb line).
export function windowFrame(ctx, { x = 0, y = 0, w, h, fill = 'canvas', stroke = 'border', radius, title }, inner) {
  const r = radius ?? tok(ctx.theme, 'radius.panel');
  let out = rect(ctx, { x, y, w, h, fill, stroke, radius: r });
  if (title) out += text(ctx, { x: x + 16, y: y + 24, str: title, size: 'small', tone: 'textMuted', box: w - 32 });
  return `<g>${out}${inner}</g>`;
}

export function panel(ctx, { x, y, w, h, title, fill = 'surface' }, inner) {
  const t = tok(ctx.theme, 'radius.panel');
  let out = rect(ctx, { x, y, w, h, fill, stroke: 'border', radius: t });
  if (title) out += text(ctx, { x: x + 12, y: y + 22, str: title, size: 'title', weight: 500, box: w - 48 });
  return `<g>${out}${inner}</g>`;
}

export function navStrip(ctx, { x, y, w, h, items, title, logo: logoKey, active }) {
  const rh = tok(ctx.theme, 'size.controlHeight');
  const r = tok(ctx.theme, 'radius.control');
  let out = rect(ctx, { x, y, w, h, fill: 'navBg', stroke: 'border' });
  let cy = y + 8;
  if (logoKey) {
    out += logo(ctx, { x: x + 12, y: cy + 4, size: 24, key: logoKey });
    if (title) out += text(ctx, { x: x + 44, y: cy + 22, str: title, size: 'title', weight: 600, tone: 'text', box: w - 56 });
    cy += 40;
  }
  items.forEach((it, i) => {
    const item = typeof it === 'string' ? { label: it } : it;
    const on = item.active ?? (active === item.label || active === i);
    if (on) {
      out += rect(ctx, { x: x + 8, y: cy, w: w - 16, h: rh, fill: 'navActiveBg', radius: r });
      out += rect(ctx, { x: x + 8, y: cy + 2, w: 2, h: rh - 4, fill: 'navActiveBar', radius: 1 });
    }
    const ix = x + 20 + (item.indent ?? 0) * 16;
    if (item.icon) out += icon(ctx, { x: ix, y: cy + (rh - 16) / 2, name: item.icon, tone: on ? 'text' : 'navText' });
    out += text(ctx, { x: ix + (item.icon ? 24 : 0), y: mid(cy, rh, 14), str: item.label, tone: on ? 'text' : 'navText', weight: on ? 500 : 400, box: w - (ix - x) - (item.icon ? 24 : 0) - 28 });
    if (item.chevron) out += icon(ctx, { x: x + w - 32, y: cy + (rh - 16) / 2, name: item.chevron === 'down' ? 'chevronDown' : 'chevronRight', tone: 'navText' });
    cy += rh + 2;
  });
  return `<g>${out}</g>`;
}

// The top bar. `crumbs` is the breadcrumb trail; `actions` are small labelled buttons on the right.
export function toolbar(ctx, { x, y, w, h, crumbs = [], actions = [], logo: logoKey, product, dark = true }) {
  const hh = h ?? tok(ctx.theme, 'size.headerHeight');
  const tone = dark ? 'headerText' : 'text';
  let out = rect(ctx, { x, y, w, h: hh, fill: dark ? 'headerBg' : 'subHeaderBg', stroke: 'border' });
  let cx = x + 16;
  if (logoKey) {
    out += logo(ctx, { x: cx, y: y + (hh - 24) / 2, size: 24, key: logoKey });
    cx += 32;
    if (product) {
      out += text(ctx, { x: cx, y: mid(y, hh, 14), str: product, weight: 600, tone, box: 100 });
      cx += textWidth(product, 14, { weight: 600 }) + 16;
    }
  }
  crumbs.forEach((c, i) => {
    if (i) { out += text(ctx, { x: cx, y: mid(y, hh, 14), str: '/', tone: 'textMuted', box: 12 }); cx += 14; }
    const last = i === crumbs.length - 1;
    out += text(ctx, { x: cx, y: mid(y, hh, 14), str: c, tone: last ? tone : 'textMuted', weight: last ? 500 : 400, box: 260 });
    cx += textWidth(c, 14, { weight: last ? 500 : 400 }) + 8;
  });
  let rx = x + w - 16;
  [...actions].reverse().forEach((a) => {
    const act = typeof a === 'string' ? { label: a } : a;
    const bw = Math.ceil(textWidth(act.label, 14, { weight: 500 })) + 24 + (act.icon ? 22 : 0);
    rx -= bw;
    out += button(ctx, { x: rx, y: y + (hh - tok(ctx.theme, 'size.controlHeight')) / 2, w: bw, label: act.label, kind: act.kind ?? 'secondary', icon: act.icon });
    rx -= 8;
  });
  return `<g>${out}</g>`;
}

export function tabBar(ctx, { x, y, w, tabs, active = 0 }) {
  let out = line(ctx, x, y + 32, x + w, y + 32);
  let cx = x;
  tabs.forEach((t, i) => {
    const label = typeof t === 'string' ? t : t.label;
    const tw = Math.ceil(textWidth(label, 14, { weight: i === active ? 500 : 400 })) + 24;
    out += text(ctx, { x: cx + 12, y: y + 21, str: label, tone: i === active ? 'tabActive' : 'textMuted', weight: i === active ? 500 : 400, box: tw - 16 });
    if (i === active) out += rect(ctx, { x: cx + 4, y: y + 30, w: tw - 8, h: 2, fill: 'navActiveBar', radius: 1 });
    cx += tw;
  });
  return `<g>${out}</g>`;
}

// ---------------------------------------------------------------- form controls
export function field(ctx, { x, y, w, label, value, placeholder, hint, focused = false, mono = false, h }) {
  const ch = h ?? tok(ctx.theme, 'size.controlHeight');
  const r = tok(ctx.theme, 'radius.control');
  let out = '';
  let fy = y;
  if (label) { out += text(ctx, { x, y: y + 12, str: label, size: 'small', weight: 500, tone: 'text', box: w }); fy = y + 20; }
  out += rect(ctx, { x, y: fy, w, h: ch, fill: 'inputBg', stroke: focused ? 'focus' : 'borderStrong', radius: r, strokeWidth: focused ? 2 : 1 });
  if (value !== undefined) out += text(ctx, { x: x + 10, y: mid(fy, ch, 14), str: value, tone: 'text', mono, box: w - 20 });
  else if (placeholder) out += text(ctx, { x: x + 10, y: mid(fy, ch, 14), str: placeholder, tone: 'textFaint', box: w - 20 });
  if (hint) out += text(ctx, { x, y: fy + ch + 16, str: hint, size: 'small', tone: 'textMuted', box: w });
  return `<g>${out}</g>`;
}

export function button(ctx, { x, y, w, label, kind = 'secondary', icon: ic, h }) {
  const ch = h ?? tok(ctx.theme, 'size.controlHeight');
  const r = tok(ctx.theme, 'radius.control');
  const fill = kind === 'primary' ? 'primary' : kind === 'danger' ? 'danger' : 'secondary';
  const tone = kind === 'primary' || kind === 'danger' ? 'textOnPrimary' : 'secondaryText';
  let out = rect(ctx, { x, y, w, h: ch, fill, stroke: kind === 'secondary' ? 'secondaryBorder' : 'none', radius: r });
  const tw = textWidth(label, 14, { weight: 500 });
  const total = tw + (ic ? 22 : 0);
  let tx = x + (w - total) / 2;
  if (ic) { out += icon(ctx, { x: tx, y: y + (ch - 16) / 2, name: ic, tone }); tx += 22; }
  out += text(ctx, { x: tx, y: mid(y, ch, 14), str: label, weight: 500, tone, box: w - 12 - (ic ? 22 : 0) });
  return `<g>${out}</g>`;
}

export function dropdown(ctx, { x, y, w, label, value, open = false, options = [], selected = 0 }) {
  const ch = tok(ctx.theme, 'size.controlHeight');
  const r = tok(ctx.theme, 'radius.control');
  let out = '';
  let fy = y;
  if (label) { out += text(ctx, { x, y: y + 12, str: label, size: 'small', weight: 500, box: w }); fy = y + 20; }
  out += rect(ctx, { x, y: fy, w, h: ch, fill: 'inputBg', stroke: open ? 'focus' : 'borderStrong', radius: r, strokeWidth: open ? 2 : 1 });
  out += text(ctx, { x: x + 10, y: mid(fy, ch, 14), str: value, box: w - 40 });
  out += icon(ctx, { x: x + w - 26, y: fy + (ch - 16) / 2, name: 'chevronDown', tone: 'textMuted' });
  if (open) {
    const mh = options.length * 30 + 8;
    out += rect(ctx, { x, y: fy + ch + 4, w, h: mh, fill: 'surface', stroke: 'borderStrong', radius: r });
    options.forEach((o, i) => {
      const oy = fy + ch + 8 + i * 30;
      if (i === selected) out += rect(ctx, { x: x + 4, y: oy, w: w - 8, h: 28, fill: 'navActiveBg', radius: 4 });
      out += text(ctx, { x: x + 14, y: oy + 19, str: o, weight: i === selected ? 500 : 400, box: w - 28 });
    });
  }
  return `<g>${out}</g>`;
}

export function toggle(ctx, { x, y, label, on = false, box = 260 }) {
  const fill = on ? 'primary' : 'surfaceRaised';
  let out = rect(ctx, { x, y, w: 32, h: 18, fill, stroke: on ? 'none' : 'borderStrong', radius: 9 });
  out += `<circle ${attrs({ cx: on ? x + 23 : x + 9, cy: y + 9, r: 6.5, fill: colour(ctx.theme, on ? 'textOnPrimary' : 'textMuted') })}/>`;
  if (label) out += text(ctx, { x: x + 42, y: y + 14, str: label, box });
  return `<g>${out}</g>`;
}

export function checkbox(ctx, { x, y, label, checked = false, box = 260 }) {
  let out = rect(ctx, { x, y, w: 16, h: 16, fill: checked ? 'primary' : 'inputBg', stroke: checked ? 'none' : 'borderStrong', radius: 3 });
  if (checked) out += icon(ctx, { x, y, name: 'check', tone: 'textOnPrimary' });
  if (label) out += text(ctx, { x: x + 26, y: y + 13, str: label, box });
  return `<g>${out}</g>`;
}

// ---------------------------------------------------------------- tables, flyouts, editors
export function table(ctx, { x, y, w, columns, rows, rowHeight = 30, highlightRow, selectedRow }) {
  const total = columns.reduce((s, c) => s + c.w, 0);
  const k = w / total;
  let out = rect(ctx, { x, y, w, h: rowHeight * (rows.length + 1), fill: 'surface', stroke: 'border', radius: tok(ctx.theme, 'radius.badge') });
  let cx = x;
  const xs = columns.map((c) => { const px = cx; cx += c.w * k; return px; });
  columns.forEach((c, i) => { out += text(ctx, { x: xs[i] + 10, y: y + rowHeight / 2 + 4, str: c.title, size: 'small', weight: 600, tone: 'textMuted', box: c.w * k - 16 }); });
  out += line(ctx, x, y + rowHeight, x + w, y + rowHeight);
  rows.forEach((r, ri) => {
    const ry = y + rowHeight * (ri + 1);
    if (ri === selectedRow) out += rect(ctx, { x: x + 1, y: ry, w: w - 2, h: rowHeight, fill: 'navActiveBg' });
    r.forEach((cell, i) => { out += text(ctx, { x: xs[i] + 10, y: ry + rowHeight / 2 + 4, str: String(cell), size: 'small', tone: i === 0 ? 'text' : 'textMuted', box: columns[i].w * k - 16 }); });
    if (ri < rows.length - 1) out += line(ctx, x, ry + rowHeight, x + w, ry + rowHeight);
  });
  return `<g>${out}</g>`;
}

export function flyout(ctx, { x, y, w, h, title }, inner) {
  let out = `<g>${rect(ctx, { x, y, w, h, fill: 'surface', stroke: 'borderStrong' })}`;
  out += text(ctx, { x: x + 16, y: y + 30, str: title, size: 'title', weight: 600, box: w - 64 });
  out += icon(ctx, { x: x + w - 32, y: y + 16, name: 'close', tone: 'textMuted' });
  out += line(ctx, x, y + 48, x + w, y + 48);
  return `${out}${inner}</g>`;
}

export function sidePanel(ctx, { x, y, w, h, title, sections = [] }, inner) {
  let out = rect(ctx, { x, y, w, h, fill: 'surface', stroke: 'border' });
  if (title) out += text(ctx, { x: x + 12, y: y + 24, str: title, size: 'title', weight: 600, box: w - 24 });
  let cy = y + (title ? 40 : 8);
  sections.forEach((s) => {
    out += icon(ctx, { x: x + 10, y: cy + 8, name: s.open ? 'chevronDown' : 'chevronRight', tone: 'textMuted' });
    out += text(ctx, { x: x + 32, y: cy + 21, str: s.label, weight: 500, box: w - 48 });
    cy += 32;
    out += line(ctx, x, cy, x + w, cy);
  });
  return `<g>${out}${inner}</g>`;
}

// lines: array of strings or arrays of { t, kind } runs (kind: keyword, string, label, number, or plain)
export function queryEditor(ctx, { x, y, w, h, lines, lineNumbers = true, label }) {
  const r = tok(ctx.theme, 'radius.control');
  let out = rect(ctx, { x, y, w, h, fill: 'editorBg', stroke: 'borderStrong', radius: r });
  if (label) out += text(ctx, { x: x + 10, y: y - 6, str: label, size: 'small', tone: 'textMuted', box: w });
  const fs = fontSize(ctx.theme, 'small') + 1;
  const charW = fs * 0.6;
  lines.forEach((ln, i) => {
    const ly = y + 22 + i * (fs + 7);
    let lx = x + (lineNumbers ? 36 : 12);
    if (lineNumbers) out += text(ctx, { x: x + 12, y: ly, str: String(i + 1), size: fs, tone: 'textFaint', mono: true });
    const runs = typeof ln === 'string' ? [{ t: ln }] : ln;
    const total = runs.reduce((s, ru) => s + [...ru.t].length * charW, 0);
    if (lx + total > x + w - 8) throw new TextOverflowError(`query line "${runs.map((q) => q.t).join('')}" is ${Math.round(total)}px wide, the editor body is ${Math.round(w - (lineNumbers ? 44 : 20))}px`);
    for (const ru of runs) {
      out += text(ctx, { x: lx, y: ly, str: ru.t, size: fs, mono: true, tone: ru.kind ? `syntax.${ru.kind}` : 'editorText' });
      lx += [...ru.t].length * charW;
    }
  });
  return `<g>${out}</g>`;
}

// ---------------------------------------------------------------- charts
// A line (or area) chart in a plot area. series: [{ name, points: number[], color? }]. ys: axis labels, bottom to top.
export function lineChart(ctx, { x, y, w, h, series: ss, min = 0, max, yLabels, xLabels, legend = true, area = false }) {
  const top = max ?? Math.max(...ss.flatMap((s) => s.points)) * 1.1;
  const legendH = legend ? 22 : 0;
  const px = x + 44, py = y + 8, pw = w - 56, ph = h - 8 - 22 - legendH;
  let out = '';
  const labels = yLabels ?? [0, 1, 2, 3, 4].map((i) => String(Math.round(min + ((top - min) * i) / 4)));
  labels.forEach((l, i) => {
    const gy = py + ph - (ph * i) / (labels.length - 1);
    out += line(ctx, px, gy, px + pw, gy, 'gridLine');
    out += text(ctx, { x: px - 8, y: gy + 4, str: l, size: 'small', tone: 'textMuted', anchor: 'end', box: 40 });
  });
  (xLabels ?? []).forEach((l, i, a) => {
    out += text(ctx, { x: px + (pw * i) / (a.length - 1), y: py + ph + 18, str: l, size: 'small', tone: 'textMuted', anchor: i === 0 ? 'start' : i === a.length - 1 ? 'end' : 'middle', box: pw / a.length });
  });
  ss.forEach((s, si) => {
    const col = s.color ?? `series.${si}`;
    const pts = s.points.map((v, i) => [px + (pw * i) / (s.points.length - 1), py + ph - (ph * (v - min)) / (top - min)]);
    const d = pts.map((p, i) => `${i ? 'L' : 'M'}${n(p[0])} ${n(p[1])}`).join('');
    if (area) out += `<path ${attrs({ d: `${d}L${n(px + pw)} ${n(py + ph)}L${n(px)} ${n(py + ph)}Z`, fill: colour(ctx.theme, col), opacity: 0.18 })}/>`;
    out += `<path ${attrs({ d, fill: 'none', stroke: colour(ctx.theme, col), 'stroke-width': 2, 'stroke-linejoin': 'round' })}/>`;
  });
  if (legend) {
    let lx = px;
    ss.forEach((s, si) => {
      out += rect(ctx, { x: lx, y: y + h - 12, w: 10, h: 3, fill: s.color ?? `series.${si}`, radius: 1 });
      out += text(ctx, { x: lx + 15, y: y + h - 7, str: s.name, size: 'small', tone: 'textMuted', box: 220 });
      lx += 15 + Math.ceil(textWidth(s.name, 12)) + 18;
    });
  }
  return `<g>${out}</g>`;
}

// bars: categories on the x axis, one value list per series; stacked draws the series on top of each other.
export function barChart(ctx, { x, y, w, h, categories, series: ss, max, stacked = false, legend = true }) {
  const totals = categories.map((_, i) => (stacked ? ss.reduce((s, q) => s + q.values[i], 0) : Math.max(...ss.map((q) => q.values[i]))));
  const top = max ?? Math.max(...totals) * 1.1;
  const legendH = legend ? 22 : 0;
  const px = x + 44, py = y + 8, pw = w - 56, ph = h - 8 - 22 - legendH;
  let out = '';
  for (let i = 0; i <= 4; i++) {
    const gy = py + ph - (ph * i) / 4;
    out += line(ctx, px, gy, px + pw, gy, 'gridLine');
    out += text(ctx, { x: px - 8, y: gy + 4, str: String(Math.round((top * i) / 4)), size: 'small', tone: 'textMuted', anchor: 'end', box: 40 });
  }
  const slot = pw / categories.length;
  const bw = stacked ? slot * 0.6 : (slot * 0.7) / ss.length;
  categories.forEach((c, ci) => {
    const sx = px + slot * ci + slot * 0.15;
    let acc = 0;
    ss.forEach((s, si) => {
      const v = s.values[ci];
      const bh = (ph * v) / top;
      const bx = stacked ? sx : sx + bw * si;
      const by = stacked ? py + ph - (ph * (acc + v)) / top : py + ph - bh;
      out += rect(ctx, { x: bx, y: by, w: bw, h: bh, fill: s.color ?? `series.${si}`, radius: 1 });
      acc += v;
    });
    out += text(ctx, { x: px + slot * ci + slot / 2, y: py + ph + 18, str: c, size: 'small', tone: 'textMuted', anchor: 'middle', box: slot });
  });
  if (legend) {
    let lx = px;
    ss.forEach((s, si) => {
      out += rect(ctx, { x: lx, y: y + h - 14, w: 10, h: 10, fill: s.color ?? `series.${si}`, radius: 2 });
      out += text(ctx, { x: lx + 15, y: y + h - 5, str: s.name, size: 'small', tone: 'textMuted', box: 220 });
      lx += 15 + Math.ceil(textWidth(s.name, 12)) + 18;
    });
  }
  return `<g>${out}</g>`;
}

export function pieChart(ctx, { x, y, w, h, slices, donut = false }) {
  const total = slices.reduce((s, q) => s + q.value, 0);
  const r = Math.min(h - 16, w * 0.5) / 2;
  const cx = x + r + 12, cy = y + h / 2;
  let a = -Math.PI / 2;
  let out = '';
  slices.forEach((s, i) => {
    const da = (2 * Math.PI * s.value) / total;
    const [x1, y1, x2, y2] = [cx + r * Math.cos(a), cy + r * Math.sin(a), cx + r * Math.cos(a + da), cy + r * Math.sin(a + da)];
    const big = da > Math.PI ? 1 : 0;
    out += `<path ${attrs({ d: slices.length === 1 ? `M${n(cx - r)} ${n(cy)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0Z` : `M${n(cx)} ${n(cy)}L${n(x1)} ${n(y1)}A${n(r)} ${n(r)} 0 ${big} 1 ${n(x2)} ${n(y2)}Z`, fill: colour(ctx.theme, s.color ?? `series.${i}`), stroke: colour(ctx.theme, 'surface'), 'stroke-width': 1.5 })}/>`;
    a += da;
  });
  if (donut) out += `<circle ${attrs({ cx, cy, r: r * 0.55, fill: colour(ctx.theme, 'surface') })}/>`;
  slices.forEach((s, i) => {
    const ly = y + 20 + i * 22;
    out += rect(ctx, { x: x + 2 * r + 36, y: ly - 9, w: 10, h: 10, fill: s.color ?? `series.${i}`, radius: 2 });
    out += text(ctx, { x: x + 2 * r + 52, y: ly, str: `${s.label}  ${Math.round((100 * s.value) / total)}%`, size: 'small', tone: 'textMuted', box: w - 2 * r - 60 });
  });
  return `<g>${out}</g>`;
}

// thresholds: [{ upTo, color }] ascending; the gauge arc is coloured by band and the value drawn in the centre.
export function gauge(ctx, { x, y, w, h, value, min = 0, max = 100, unit = '', thresholds, label }) {
  const bands = thresholds ?? [{ upTo: 0.6, color: 'threshold.green' }, { upTo: 0.8, color: 'threshold.orange' }, { upTo: 1, color: 'threshold.red' }];
  const r = Math.min(w / 2 - 8, h - 36);
  const cx = x + w / 2, cy = y + h - 30;
  const ang = (f) => Math.PI * (1 - f);
  const arc = (f1, f2, rr) => `M${n(cx + rr * Math.cos(ang(f1)))} ${n(cy - rr * Math.sin(ang(f1)))}A${n(rr)} ${n(rr)} 0 0 1 ${n(cx + rr * Math.cos(ang(f2)))} ${n(cy - rr * Math.sin(ang(f2)))}`;
  let out = '';
  let prev = 0;
  bands.forEach((b) => {
    out += `<path ${attrs({ d: arc(prev, b.upTo, r), fill: 'none', stroke: colour(ctx.theme, b.color), 'stroke-width': 10, opacity: 0.35 })}/>`;
    prev = b.upTo;
  });
  const f = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const band = bands.find((b) => f <= b.upTo) ?? bands[bands.length - 1];
  out += `<path ${attrs({ d: arc(0, f, r), fill: 'none', stroke: colour(ctx.theme, band.color), 'stroke-width': 10 })}/>`;
  out += text(ctx, { x: cx, y: cy - 4, str: `${value}${unit}`, size: 'heading', weight: 500, tone: 'textStrong', anchor: 'middle', box: r * 1.4 });
  out += text(ctx, { x: cx - r, y: cy + 20, str: String(min), size: 'small', tone: 'textMuted' });
  out += text(ctx, { x: cx + r, y: cy + 20, str: String(max), size: 'small', tone: 'textMuted', anchor: 'end' });
  if (label) out += text(ctx, { x: cx, y: cy + 20, str: label, size: 'small', tone: 'textMuted', anchor: 'middle', box: r });
  return `<g>${out}</g>`;
}

// values: rows x cols of numbers 0..1 (intensity of series colour `color`).
export function heatmap(ctx, { x, y, w, h, values, color = 'series.2', rowLabels = [], colLabels = [] }) {
  const rows = values.length, cols = values[0].length;
  const lx = rowLabels.length ? 44 : 0;
  const cw = (w - lx) / cols, ch = (h - (colLabels.length ? 20 : 0)) / rows;
  let out = '';
  values.forEach((r, ri) => {
    if (rowLabels[ri]) out += text(ctx, { x: x + lx - 6, y: y + ri * ch + ch / 2 + 4, str: rowLabels[ri], size: 'small', tone: 'textMuted', anchor: 'end', box: lx - 6 });
    r.forEach((v, ci) => {
      out += `<rect ${attrs({ x: x + lx + ci * cw + 0.5, y: y + ri * ch + 0.5, width: cw - 1, height: ch - 1, fill: colour(ctx.theme, color), opacity: Math.round((0.08 + 0.92 * v) * 100) / 100 })}/>`;
    });
  });
  colLabels.forEach((l, i, a) => {
    out += text(ctx, { x: x + lx + (i + 0.5) * (cw * cols / a.length), y: y + h - 4, str: l, size: 'small', tone: 'textMuted', anchor: 'middle', box: (cw * cols) / a.length });
  });
  return `<g>${out}</g>`;
}

// ---------------------------------------------------------------- a real world map (Kibana Maps, region map, Grafana Geomap)
// The country outlines come from data/world-110m.json (Natural Earth 1:110m via world-atlas, Web Mercator; see
// extract-geo.mjs). The map is drawn in a nested <svg> that crops it to the block, like the map canvas of the product.
//   view:    [x0, y0, x1, y1] of the map in data units (the whole width is 1000); default: the whole world
//   shade:   { iso2: 0..1 } countries filled on a ramp from the land colour towards `ramp` (choropleth / region map)
//   ramp:    [fromToken, toToken]; a shaded country of value v gets mix(from, to, v), from mixed with land at 0
//   markers: [{ iso, v }] circles at the country's centroid, radius from `size` [min, max] px, colour from `ramp`
//   dots:    [{ iso, n }] n small points around the country's centroid (a documents layer), colour `dotColour`
//   heat:    [{ iso, v }] density blobs of a heatmap layer (concentric circles on the cold-to-hot ramp `heatRamp`)
//   legend:  { title, min, max } a legend box at the bottom left with the colour ramp, as Geomap draws it
//   zoom:    true draws the + and - zoom buttons at the top left, as Geomap and Maps do
const world = JSON.parse(readFileSync(join(here, '..', 'data', 'world-110m.json'), 'utf8'));
const byIso = new Map(world.countries.filter((c) => c.iso2).map((c) => [c.iso2, c]));
// A theme colour as [r, g, b]: #rgb, #rrggbb and rgb()/rgba() (the token contract allows both; alpha is ignored).
function hex(c) {
  let m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c);
  if (m) { const h = m[1].length === 3 ? [...m[1]].map((d) => d + d).join('') : m[1]; return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); }
  m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(c);
  if (m) return m.slice(1, 4).map(Number);
  throw new Error(`map colours must be #rrggbb or rgb(a), got ${c}`);
}
export function mix(a, b, t) {
  const [x, y] = [hex(a), hex(b)];
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, t))).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}
const country = (iso) => { const c = byIso.get(iso); if (!c) throw new Error(`world map: no country ${iso} (add it to ALPHA2 in extract-geo.mjs)`); return c; };

export function worldMap(ctx, { x, y, w, h, view = mapView(-180, -56, 180, 76), shade = {}, ramp = ['threshold.yellow', 'threshold.red'], markers = [], size = [6, 22], dots = [], dotColour = 'series.0', heat = [], heatRamp = ['series.2', 'threshold.green', 'threshold.yellow', 'threshold.red'], legend, zoom = false, radius = 0 }) {
  const water = colour(ctx.theme, 'map.water'), land = colour(ctx.theme, 'map.land'), border = colour(ctx.theme, 'map.border');
  const [from, to] = ramp.map((t) => colour(ctx.theme, t));
  const at = (v) => mix(from, to, v);
  // Keep the whole width of the view: a box taller than the view grows the view north and south (more ocean), as a
  // product shows more of the map when its panel is taller.
  let [vx, vy, vx1, vy1] = view;
  if ((vx1 - vx) / (vy1 - vy) > w / h) { const grow = ((vx1 - vx) * h) / w - (vy1 - vy); vy -= grow * 0.4; vy1 += grow * 0.6; }
  const vw = vx1 - vx, vh = vy1 - vy;
  const s = Math.max(w / vw, h / vh); // px per data unit (slice)
  let inner = `<rect ${attrs({ x: vx - vw, y: vy - vh, width: vw * 3, height: vh * 3, fill: water })}/>`;
  for (const c of world.countries) {
    const v = c.iso2 !== undefined ? shade[c.iso2] : undefined;
    const fill = v === undefined ? land : mix(land, at(v), 0.25 + 0.75 * v);
    inner += `<path d="${c.d}" fill="${fill}" stroke="${border}" stroke-width="${n(0.8 / s)}" stroke-linejoin="round"/>`;
  }
  for (const d of dots) {
    const [cx, cy] = country(d.iso).centroid;
    for (let i = 0; i < d.n; i++) {
      const a = (i * 2.399963) + d.iso.charCodeAt(0); // golden-angle spiral, deterministic
      const r = (3.4 * Math.sqrt(i + 0.5)) * (d.spread ?? 1);
      inner += `<circle ${attrs({ cx: cx + Math.cos(a) * r, cy: cy + Math.sin(a) * r, r: 3.2 / s, fill: colour(ctx.theme, dotColour), stroke: colour(ctx.theme, 'surface'), 'stroke-width': 0.8 / s })}/>`;
    }
  }
  if (heat.length) {
    // A blurred stack of circles per point, cold colours wide and hot colours only where the weight is high, as the
    // OpenLayers heatmap of Geomap draws it. The filter id comes from the figure (ctx.idPrefix), so two inlined figures never share it.
    let blobs = '';
    for (const b of heat) {
      const [cx, cy] = country(b.iso).centroid;
      heatRamp.forEach((t, i) => {
        if (i / (heatRamp.length - 1) > b.v + 0.25) return;
        blobs += `<circle ${attrs({ cx, cy, r: ((30 - i * 6) * (0.5 + 0.5 * b.v)) / s, fill: colour(ctx.theme, t), 'fill-opacity': 0.35 + i * 0.1 })}/>`;
      });
    }
    inner += `<filter id="${ctx.idPrefix ?? 'figure'}-heat-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${n(7 / s)}"/></filter><g filter="url(#${ctx.idPrefix ?? 'figure'}-heat-blur)">${blobs}</g>`;
  }
  const vals = markers.map((m) => m.v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  for (const m of [...markers].sort((a, b) => b.v - a.v)) {
    const t = hi > lo ? (m.v - lo) / (hi - lo) : 1;
    const [cx, cy] = country(m.iso).centroid;
    inner += `<circle ${attrs({ cx, cy, r: (size[0] + (size[1] - size[0]) * t) / s, fill: at(t), 'fill-opacity': 0.75, stroke: at(t), 'stroke-width': 1 / s })}/>`;
  }
  let out = `<svg ${attrs({ x, y, width: w, height: h, viewBox: `${n(vx)} ${n(vy)} ${n(vw)} ${n(vh)}`, preserveAspectRatio: 'xMidYMid slice', overflow: 'hidden' })}>${inner}</svg>`;
  if (radius) out = `${out}<rect ${attrs({ x, y, width: w, height: h, rx: radius, fill: 'none', stroke: colour(ctx.theme, 'border') })}/>`;
  if (zoom) {
    ['+', '\u2212'].forEach((t, i) => {
      out += rect(ctx, { x: x + 8, y: y + 8 + i * 22, w: 22, h: 22, fill: 'surfaceRaised', stroke: 'border', radius: 2 });
      out += text(ctx, { x: x + 19, y: y + 24 + i * 22, str: t, weight: 600, anchor: 'middle' });
    });
  }
  if (legend) {
    const lw = 150, lh = 52, lx = x + 8, ly = y + h - lh - 8;
    out += rect(ctx, { x: lx, y: ly, w: lw, h: lh, fill: 'surface', stroke: 'border', radius: 4 });
    out += text(ctx, { x: lx + 8, y: ly + 18, str: legend.title, size: 'small', weight: 500, box: lw - 16 });
    const steps = 12;
    for (let i = 0; i < steps; i++) out += `<rect ${attrs({ x: lx + 8 + ((lw - 16) * i) / steps, y: ly + 26, width: (lw - 16) / steps + 0.5, height: 6, fill: at(i / (steps - 1)) })}/>`;
    out += text(ctx, { x: lx + 8, y: ly + 46, str: String(legend.min), size: 'small', tone: 'textMuted' });
    out += text(ctx, { x: lx + lw - 8, y: ly + 46, str: String(legend.max), size: 'small', tone: 'textMuted', anchor: 'end' });
  }
  return `<g>${out}</g>`;
}
// Data units of a map view around the given longitudes and latitudes (for `view`).
export function mapView(lon0, lat0, lon1, lat1) {
  const k = world.width / (2 * Math.PI);
  const merc = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  const px = (lon) => ((lon + 180) / 360) * world.width;
  const py = (lat) => (merc(world.latTop) - merc(lat)) * k; // same origin as extract-geo.mjs, read from the data
  return [px(lon0), py(lat1), px(lon1), py(lat0)];
}

// A table rendering of a panel: same as `table` but without the outer frame colours of a form table.
export function tablePanel(ctx, props) {
  return table(ctx, props);
}

export function statPanel(ctx, { x, y, w, h, title, value, unit = '', color = 'threshold.green' }) {
  let out = rect(ctx, { x, y, w, h, fill: 'surface', stroke: 'border', radius: tok(ctx.theme, 'radius.panel') });
  out += rect(ctx, { x: x + 1, y: y + 1, w: w - 2, h: h - 2, fill: color, radius: tok(ctx.theme, 'radius.panel') - 1 }).replace('/>', ' opacity="0.16"/>');
  if (title) out += text(ctx, { x: x + 12, y: y + 22, str: title, size: 'title', weight: 500, box: w - 24 });
  out += text(ctx, { x: x + w / 2, y: y + h / 2 + 20, str: `${value}${unit}`, size: 'stat', weight: 500, tone: 'textStrong', anchor: 'middle', box: w - 16 });
  return `<g>${out}</g>`;
}

// rows: [{ label, segments: [{ from, to, state }] }] with from/to in 0..1; state: normal|pending|firing|nodata
export function stateTimeline(ctx, { x, y, w, h, rows, labelWidth = 120 }) {
  const rh = Math.min(28, (h - 20) / rows.length);
  let out = '';
  rows.forEach((r, ri) => {
    const ry = y + ri * (rh + 6);
    out += text(ctx, { x, y: ry + rh / 2 + 4, str: r.label, size: 'small', tone: 'textMuted', box: labelWidth - 8 });
    r.segments.forEach((s) => {
      const sx = x + labelWidth + (w - labelWidth) * s.from;
      const sw = (w - labelWidth) * (s.to - s.from);
      out += rect(ctx, { x: sx, y: ry, w: sw, h: rh, fill: `state.${s.state}.bg`, radius: 3 });
      if (s.text) out += text(ctx, { x: sx + 8, y: ry + rh / 2 + 4, str: s.text, size: 'small', tone: `state.${s.state}.text`, box: sw - 12 });
    });
  });
  return `<g>${out}</g>`;
}

export function pill(ctx, { x, y, str, state = 'firing', w }) {
  const pw = w ?? Math.ceil(textWidth(str, 12)) + 16;
  return `<g>${rect(ctx, { x, y, w: pw, h: 20, fill: `state.${state}.bg`, radius: tok(ctx.theme, 'radius.control') })}${text(ctx, { x: x + pw / 2, y: y + 14, str, size: 'small', tone: `state.${state}.text`, anchor: 'middle', box: pw - 8 })}</g>`;
}

export function chip(ctx, { x, y, str, w }) {
  const cw = w ?? Math.ceil(textWidth(str, 12)) + 16;
  return `<g>${rect(ctx, { x, y, w: cw, h: 22, fill: 'chipBg', radius: tok(ctx.theme, 'radius.badge') })}${text(ctx, { x: x + 8, y: y + 15, str, size: 'small', tone: 'chipText', box: cw - 12 })}</g>`;
}

// ---------------------------------------------------------------- annotations (the site accent, not the product's colours)
const ACCENT = brand.pink;
const ACCENT_INK = brand.ink;

// A rounded dashed box around the control a step acts on.
export function highlight(ctx, { x, y, w, h }) {
  return `<rect ${attrs({ x: x - 3, y: y - 3, width: w + 6, height: h + 6, rx: 6, fill: 'none', stroke: ACCENT, 'stroke-width': 2.5, 'stroke-dasharray': '6 3' })}/>`;
}

// A numbered disc; (x, y) is its centre. Its number is the step's callout number in the page text.
export function callout(ctx, { x, y, num }) {
  const family = tok(ctx.theme, 'font.family');
  return `<g><circle ${attrs({ cx: x, cy: y, r: 12, fill: ACCENT, stroke: ACCENT_INK, 'stroke-width': 1.5 })}/><text ${attrs({ x, y: y + 5, 'font-family': family, 'font-size': 14, 'font-weight': 700, fill: ACCENT_INK, 'text-anchor': 'middle' })}>${esc(String(num))}</text></g>`;
}

// A plain label (free text in a figure).
export function label(ctx, props) {
  return text(ctx, props.str === undefined ? { ...props, str: props.text } : props);
}

export const blocks = {
  window: windowFrame, panel, nav: navStrip, toolbar, tabs: tabBar, field, button, dropdown, toggle, checkbox, table,
  flyout, sidePanel, queryEditor, line: lineChart, bar: barChart, pie: pieChart, gauge, heatmap, tablePanel, stat: statPanel,
  stateTimeline, pill, chip, highlight, callout, logo, icon, rect, label, worldMap,
};
