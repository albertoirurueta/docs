// Renderers for the e-commerce comparison figures. They reuse the shared frame, scales, palette and XML helpers of
// scripts/language-charts/generate-charts.mjs and the grouped bars, word wrap and footer of
// scripts/cloud-comparison-charts/renderers.mjs, and add what those lack: lines, bars and radars whose colour is fixed
// by the *platform* (palette slot) instead of the series position, so that Shopify, PrestaShop, Magento and
// WooCommerce keep one colour, dash and marker in every figure, and a release/support Gantt chart.
// Like the other comparison figures they use one light palette on an opaque white background, which is readable
// in light and dark page themes alike.
import {
  escapeXml, fmt, formatTick, linearScale, niceScale, roundTo, wrap, markerShape, cartesianFrame, PALETTE_SIZE, renderChart,
} from '../language-charts/generate-charts.mjs';
import { toNumber } from '../language-charts/data-utils.mjs';
import { wrapText, addFooter, renderGroupedBarChart } from '../cloud-comparison-charts/renderers.mjs';

export const MARKERS = ['circle', 'square', 'triangle', 'diamond', 'cross', 'circle', 'square', 'triangle'];

/** Decimal year of an ISO date (YYYY-MM-DD) or month (YYYY-MM): 2026-07-01 -> 2026.5. */
export function decimalYear(iso) {
  const [y, m = '01', d = '01'] = String(iso).split('-');
  return Number(y) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}

/**
 * Decimal years of the first day of every month from the month containing `from` to the first month start on or after
 * `to` (both decimal years), so the ticks sit on real month starts and enclose the data.
 */
export function monthStartTicks(from, to) {
  let year = Math.floor(from + 1e-9);
  let month = Math.min(12, Math.floor((from - year) * 12 + 1e-6) + 1);
  const ticks = [];
  for (;;) {
    const t = decimalYear(`${year}-${String(month).padStart(2, '0')}-01`);
    ticks.push(t);
    if (t >= to - 1e-9) break;
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }
  return ticks;
}

/** Label of a decimal year as YYYY-MM. */
export function yearMonthLabel(v) {
  const year = Math.floor(v + 1e-9);
  const month = Math.min(12, Math.floor((v - year) * 12 + 1e-6) + 1);
  return `${year}-${String(month).padStart(2, '0')}`;
}

const EXTRA_CSS = `<style>
.v1{stroke-dasharray:1 4;stroke-linecap:round;stroke-width:2.6}.v2{stroke-dasharray:10 3}.v3{stroke-dasharray:3 3}
.hollow{fill:var(--bg)}
.vline{stroke:var(--muted);stroke-width:1;stroke-dasharray:4 3;fill:none}
.gantt-bg{fill:var(--grid);fill-opacity:.35}
</style>`;

function requireFields(spec, fields) {
  for (const f of fields) if (spec[f] === undefined || spec[f] === null || spec[f] === '') throw new Error(`chart "${spec.id ?? '?'}" is missing "${f}"`);
}

/** Legend whose swatches follow the platform slot: entries are {name, slot, variant?}. */
export function slotLegend(entries, x, y, width, { lines = true } = {}) {
  const itemW = Math.max(150, Math.ceil(Math.max(0, ...entries.map((e) => String(e.name).length)) * 6.6) + 44);
  const perRow = Math.max(1, Math.floor(width / itemW));
  const parts = [];
  entries.forEach((e, i) => {
    const lx = x + (i % perRow) * itemW;
    const ly = y + Math.floor(i / perRow) * 20;
    const v = e.variant ?? 0;
    if (lines) parts.push(`<line class="l${e.slot} v${v}" x1="${lx}" y1="${ly}" x2="${lx + 24}" y2="${ly}"/>`);
    if (lines) parts.push(markerShape(MARKERS[e.slot % PALETTE_SIZE], lx + 12, ly, `m${e.slot}${v ? ' hollow' : ''}`, 4));
    else parts.push(`<rect class="f${e.slot}" x="${lx + 4}" y="${ly - 6}" width="16" height="12"/>`);
    parts.push(`<text x="${lx + 30}" y="${ly + 4}">${escapeXml(e.name)}</text>`);
  });
  return { svg: `<g class="legend">${parts.join('')}</g>`, height: Math.ceil(entries.length / perRow) * 20 };
}

// ---------------------------------------------------------------- line chart

/**
 * Spec: {id,title,desc,xLabel,yLabel,series:[{name,slot,variant?,points:[{x,y}]}], xFormat?, yFormat?, yInclude?:[number],
 * yZero?, vlines?:[{x,label}], xTicks?:'months', width?, height?}. A point with y null/NaN/'n/a' breaks the line (a gap).
 * `xTicks: 'months'` puts the x ticks on the first day of each month (decimal years) instead of evenly spaced values.
 */
function monthScale(xs) {
  const ticks = monthStartTicks(Math.min(...xs), Math.max(...xs));
  return { min: ticks[0], max: ticks.at(-1), ticks };
}

export function renderSlotLine(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'xLabel', 'yLabel', 'series']);
  const width = spec.width ?? 860;
  const series = spec.series.map((s) => ({ ...s, points: s.points.map((p) => ({ x: toNumber(p.x), y: toNumber(p.y) })).filter((p) => p.x !== null) }));
  const lg = slotLegend(series, 70, 0, width - 90);
  const top = 44 + lg.height + 10;
  const height = spec.height ?? 440 + lg.height;
  const plot = { l: 76, r: width - 24, t: top, b: height - 56 };
  const xs = series.flatMap((s) => s.points.map((p) => p.x));
  const ys = series.flatMap((s) => s.points.map((p) => p.y)).concat(spec.yInclude ?? []);
  const xSc = spec.xTicks === 'months' ? monthScale(xs) : niceScale(xs, { maxTicks: 8 });
  const ySc = niceScale(ys, { zero: spec.yZero ?? true });
  const xScale = linearScale(xSc.min, xSc.max, plot.l, plot.r);
  const yScale = linearScale(ySc.min, ySc.max, plot.b, plot.t);
  let body = EXTRA_CSS + `<g transform="translate(0 44)">${lg.svg}</g>`;
  body += cartesianFrame({ plot, xScale, yScale, xTicks: xSc.ticks, yTicks: ySc.ticks, xLabel: spec.xLabel, yLabel: spec.yLabel, xFormat: spec.xFormat ?? ((v) => String(v)), yFormat: spec.yFormat ?? formatTick });
  for (const v of spec.vlines ?? []) {
    const x = xScale(v.x);
    body += `<line class="vline" x1="${fmt(x)}" y1="${plot.t}" x2="${fmt(x)}" y2="${plot.b}"/>`;
    body += `<text class="muted" x="${fmt(x + 4)}" y="${plot.t + 12}" font-size="11">${escapeXml(v.label)}</text>`;
  }
  series.forEach((s) => {
    const v = s.variant ?? 0;
    const segments = [];
    let cur = [];
    for (const p of s.points) {
      if (p.y === null) { if (cur.length) segments.push(cur); cur = []; } else cur.push(p);
    }
    if (cur.length) segments.push(cur);
    for (const seg of segments) {
      if (seg.length > 1) body += `<path class="l${s.slot} v${v}" d="${seg.map((p, j) => `${j ? 'L' : 'M'}${fmt(xScale(p.x))} ${fmt(yScale(p.y))}`).join('')}"/>`;
      for (const p of seg) body += markerShape(MARKERS[s.slot % PALETTE_SIZE], xScale(p.x), yScale(p.y), `m${s.slot}${v ? ' hollow' : ''}`, seg.length > 24 ? 1.8 : 3.5);
    }
  });
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: PALETTE_SIZE, id: spec.id });
}

// ---------------------------------------------------------------- horizontal bars

/**
 * Horizontal bars coloured by platform. Spec: {id,title,desc,xLabel (value axis with unit),yLabel,
 * items:[{label,slot,value}], legend:[{name,slot}], valueFormat?, width?}. A missing value shows "n/a" and no bar.
 */
export function renderSlotBars(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'xLabel', 'yLabel', 'items', 'legend']);
  const width = spec.width ?? 860;
  const items = spec.items.map((it) => ({ ...it, value: toNumber(it.value) }));
  const lg = slotLegend(spec.legend, 70, 0, width - 90, { lines: false });
  const rowH = 26;
  const top = 44 + lg.height + 14;
  const plotH = items.length * rowH;
  const height = top + plotH + 60;
  const labelW = Math.min(260, Math.max(80, Math.max(0, ...items.map((i) => i.label.length)) * 7 + 12));
  const plot = { l: 24 + labelW, r: width - 70, t: top, b: top + plotH };
  const sc = niceScale(items.map((i) => i.value), { zero: true });
  const xScale = linearScale(sc.min, sc.max, plot.l, plot.r);
  const f = spec.valueFormat ?? ((v) => String(roundTo(v, 2)));
  let body = `<g transform="translate(0 44)">${lg.svg}</g>`;
  for (const t of sc.ticks) {
    body += `<line class="grid" x1="${fmt(xScale(t))}" y1="${plot.t}" x2="${fmt(xScale(t))}" y2="${plot.b}"/>`;
    body += `<text class="muted" x="${fmt(xScale(t))}" y="${plot.b + 18}" text-anchor="middle">${escapeXml((spec.tickFormat ?? formatTick)(t))}</text>`;
  }
  body += `<path class="axis" d="M${plot.l} ${plot.t}V${plot.b}H${plot.r}"/>`;
  const zeroX = xScale(Math.max(0, sc.min));
  items.forEach((it, i) => {
    const y = plot.t + i * rowH;
    body += `<text x="${plot.l - 8}" y="${y + rowH / 2 + 4}" text-anchor="end">${escapeXml(it.label)}</text>`;
    if (it.value === null) {
      body += `<g><title>${escapeXml(`${it.label}: n/a`)}</title><text class="na" x="${zeroX + 6}" y="${y + rowH / 2 + 4}">n/a${it.naNote ? ` (${escapeXml(it.naNote)})` : ''}</text></g>`;
    } else {
      const x = xScale(it.value);
      body += `<g><title>${escapeXml(`${it.label}: ${f(it.value)}`)}</title><rect class="f${it.slot}" x="${fmt(Math.min(x, zeroX))}" y="${y + 4}" width="${fmt(Math.max(1, Math.abs(x - zeroX)))}" height="${rowH - 8}"/>`
        + `<text class="muted" x="${fmt(Math.max(x, zeroX) + 5)}" y="${y + rowH / 2 + 4}">${escapeXml(f(it.value))}</text></g>`;
    }
  });
  body += `<text class="axis-label" x="${(plot.l + plot.r) / 2}" y="${plot.b + 40}" text-anchor="middle">${escapeXml(spec.xLabel)}</text>`;
  body += `<text class="axis-label" transform="translate(16 ${(plot.t + plot.b) / 2}) rotate(-90)" text-anchor="middle">${escapeXml(spec.yLabel)}</text>`;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: PALETTE_SIZE, id: spec.id });
}

// ---------------------------------------------------------------- radar

/**
 * Spec: {id,title,desc,axes:[label],max?,unit?,series:[{name,slot,values:[number|null]}], width?}. Missing values break
 * the outline at that axis; they are never drawn at the centre.
 */
export function renderSlotRadar(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'axes', 'series']);
  const width = spec.width ?? 760;
  const max = spec.max ?? 10;
  const series = spec.series.map((s) => ({ ...s, values: spec.axes.map((_, i) => toNumber(s.values[i])) }));
  const lg = slotLegend(series, 40, 0, width - 60);
  const top = 44 + lg.height + 20;
  const radius = 190;
  const cx = width / 2;
  const cy = top + radius + 40;
  const height = cy + radius + 70;
  const n = spec.axes.length;
  const angle = (i) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const pt = (i, v) => [cx + Math.cos(angle(i)) * radius * (v / max), cy + Math.sin(angle(i)) * radius * (v / max)];
  let body = EXTRA_CSS + `<g transform="translate(0 44)">${lg.svg}</g>`;
  for (let r = 1; r <= 5; r++) {
    const v = (max * r) / 5;
    body += `<path class="grid" d="${spec.axes.map((_, i) => `${i ? 'L' : 'M'}${fmt(pt(i, v)[0])} ${fmt(pt(i, v)[1])}`).join('')}Z"/>`;
    body += `<text class="muted" x="${fmt(cx + 4)}" y="${fmt(cy - radius * (v / max) + 11)}" font-size="10">${roundTo(v, 2)}</text>`;
  }
  spec.axes.forEach((label, i) => {
    const [x, y] = pt(i, max);
    body += `<line class="grid" x1="${cx}" y1="${cy}" x2="${fmt(x)}" y2="${fmt(y)}"/>`;
    const [lx, ly] = pt(i, max * 1.1);
    const c = Math.cos(angle(i));
    body += `<text x="${fmt(lx)}" y="${fmt(ly + 4)}" text-anchor="${Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end'}">${escapeXml(label)}</text>`;
  });
  series.forEach((s) => {
    if (s.values.every((v) => v !== null)) {
      body += `<path class="a${s.slot}" d="${s.values.map((v, j) => `${j ? 'L' : 'M'}${fmt(pt(j, v)[0])} ${fmt(pt(j, v)[1])}`).join('')}Z"/>`;
    } else {
      for (let j = 0; j < n; j++) {
        const k = (j + 1) % n;
        if (s.values[j] !== null && s.values[k] !== null) body += `<path class="l${s.slot}" d="M${fmt(pt(j, s.values[j])[0])} ${fmt(pt(j, s.values[j])[1])}L${fmt(pt(k, s.values[k])[0])} ${fmt(pt(k, s.values[k])[1])}"/>`;
      }
    }
    s.values.forEach((v, j) => {
      if (v !== null) body += `<g><title>${escapeXml(`${s.name}, ${spec.axes[j]}: ${v}`)}</title>${markerShape(MARKERS[s.slot % PALETTE_SIZE], pt(j, v)[0], pt(j, v)[1], `m${s.slot}`, 3.5)}</g>`;
    });
  });
  body += `<text class="axis-label" x="${cx}" y="${height - 20}" text-anchor="middle">${escapeXml(`Scale: ${spec.unit ?? 'score 0-10, higher is better'}; gaps mean no data (n/a)`)}</text>`;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body, seriesCount: PALETTE_SIZE, id: spec.id });
}

// ---------------------------------------------------------------- Gantt

/**
 * Release and support timeline. Spec: {id,title,desc,xLabel,from,to,today,groups:[{title,slot,rows:[{label,segments:
 * [{start,end,phase,tip?}]}]}],phases:[{key,label,opacity}],width?}. An `end` of "open" runs to the right edge with an
 * arrow head (no announced end date). Phase opacity tells the support phases apart; colour is the platform.
 */
export function renderGantt(spec) {
  requireFields(spec, ['id', 'title', 'desc', 'xLabel', 'from', 'to', 'groups', 'phases']);
  const width = spec.width ?? 960;
  const rowH = spec.rowH ?? 18;
  const labelW = 120;
  const x0 = decimalYear(spec.from);
  const x1 = decimalYear(spec.to);
  const plotL = 24 + labelW;
  const plotR = width - 30;
  const xScale = linearScale(x0, x1, plotL, plotR);
  const legendItems = [
    ...spec.groups.map((g) => ({ kind: 'platform', slot: g.slot, name: g.legend ?? g.title })),
    ...spec.phases.map((p) => ({ kind: 'phase', name: p.label, opacity: p.opacity })),
  ];
  const itemW = Math.max(170, Math.ceil(Math.max(...legendItems.map((e) => e.name.length)) * 6.4) + 40);
  const perRow = Math.max(1, Math.floor((width - 60) / itemW));
  const legendH = Math.ceil(legendItems.length / perRow) * 20;
  const top = 44 + legendH + 14;
  let y = top + 20;
  let rowsSvg = '';
  const groupSvg = [];
  for (const g of spec.groups) {
    rowsSvg += `<text x="24" y="${y + 13}" font-weight="600">${escapeXml(g.title)}</text>`;
    rowsSvg += `<line class="grid" x1="24" y1="${y + 18}" x2="${plotR}" y2="${y + 18}"/>`;
    y += 24;
    for (const r of g.rows) {
      rowsSvg += `<text x="${plotL - 8}" y="${y + rowH / 2 + 4}" text-anchor="end">${escapeXml(r.label)}</text>`;
      for (const s of r.segments) {
        const ph = spec.phases.find((p) => p.key === s.phase);
        if (!ph) throw new Error(`chart "${spec.id}": unknown phase "${s.phase}"`);
        const open = s.end === 'open';
        const a = Math.max(plotL, xScale(decimalYear(s.start)));
        const b = Math.min(plotR, open ? plotR : xScale(decimalYear(s.end)));
        if (b <= a) continue;
        const tip = s.tip ?? `${g.title} ${r.label}, ${ph.label}: ${s.start} to ${open ? 'no end date announced' : s.end}`;
        rowsSvg += `<g><title>${escapeXml(tip)}</title><rect class="f${g.slot}" fill-opacity="${ph.opacity}" stroke="var(--s${g.slot})" stroke-width="1" x="${fmt(a)}" y="${y + 2}" width="${fmt(b - a)}" height="${rowH - 5}"/>`
          + `${open ? `<path class="f${g.slot}" d="M${fmt(plotR)} ${y + 2}L${fmt(plotR + 9)} ${fmt(y + rowH / 2)}L${fmt(plotR)} ${y + rowH - 3}Z"/>` : ''}</g>`;
      }
      y += rowH;
    }
    y += 8;
    groupSvg.push(g);
  }
  const plotB = y;
  let body = '';
  legendItems.forEach((it, i) => {
    const lx = 24 + (i % perRow) * itemW;
    const ly = 44 + Math.floor(i / perRow) * 20;
    if (it.kind === 'platform') body += `<rect class="f${it.slot}" x="${lx}" y="${ly - 6}" width="16" height="12"/>`;
    else body += `<rect fill="var(--fg)" fill-opacity="${it.opacity}" stroke="var(--fg)" stroke-width="1" x="${lx}" y="${ly - 6}" width="16" height="12"/>`;
    body += `<text x="${lx + 22}" y="${ly + 4}">${escapeXml(it.name)}</text>`;
  });
  const wrapLegend = `<g class="legend">${body}</g>`;
  let frame = '';
  for (let yr = Math.ceil(x0); yr <= Math.floor(x1); yr++) {
    const x = xScale(yr);
    frame += `<line class="grid" x1="${fmt(x)}" y1="${top}" x2="${fmt(x)}" y2="${plotB}"/>`;
    frame += `<text class="muted" x="${fmt(x)}" y="${top + 12}" text-anchor="middle">${yr}</text>`;
  }
  const tx = xScale(decimalYear(spec.today));
  frame += `<line class="vline" x1="${fmt(tx)}" y1="${top + 16}" x2="${fmt(tx)}" y2="${plotB}"/>`;
  frame += `<text class="muted" x="${fmt(tx + 4)}" y="${plotB + 14}" font-size="11">${escapeXml(`check date ${spec.today}`)}</text>`;
  frame += `<path class="axis" d="M${plotL} ${top + 16}V${plotB}H${plotR}"/>`;
  frame += `<text class="axis-label" x="${(plotL + plotR) / 2}" y="${plotB + 34}" text-anchor="middle">${escapeXml(spec.xLabel)}</text>`;
  const height = plotB + 46;
  return wrap({ width, height, title: spec.title, desc: spec.desc, body: EXTRA_CSS + wrapLegend + frame + rowsSvg, seriesCount: PALETTE_SIZE, id: spec.id });
}

// ---------------------------------------------------------------- dispatch and footer

export const ECOMMERCE_RENDERERS = { slotline: renderSlotLine, slotbars: renderSlotBars, slotradar: renderSlotRadar, gantt: renderGantt, groupedbar: renderGroupedBarChart };

/** Renders any definition, then appends the caption (source and date) as a footer when the spec has one. */
export function renderEcommerceChart(def) {
  const own = ECOMMERCE_RENDERERS[def.type];
  const svg = own ? own(def) : renderChart(def);
  return def.footer ? addFooter(svg, def.footer) : svg;
}

export { wrapText };
