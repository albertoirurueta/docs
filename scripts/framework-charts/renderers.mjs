// Renderers for the frameworks comparison. The line, bar, scatter and radar renderers of scripts/language-charts and
// the grouped-bar, panel-bar, grid and footer helpers of scripts/cloud-comparison-charts are reused as they are; the only
// new type is a release timeline (first release, major versions and end-of-life dates per framework).
import { escapeXml, fmt, linearScale, markerShape, renderChart, wrap } from '../language-charts/generate-charts.mjs';
import { toNumber } from '../language-charts/data-utils.mjs';
import { decimalYear } from './frameworks.mjs';
import { addFooter, renderGrid, renderGroupedBarChart, renderPanelBars, wrapText } from '../cloud-comparison-charts/renderers.mjs';

/**
 * Release timeline. Spec: {id,title,desc,xLabel,from,to,rows:[{label,start,end?,majors:[{x,label}],eol?,legacy?}]}.
 * `start`, `end`, `x` and `eol` are decimal years. A row without `start` shows "n/a" and no bar (never a bar from zero).
 * Majors are circles with their version label, the end of life is a cross, legacy rows use a dashed bar.
 */
export function renderTimeline(spec) {
  for (const f of ['id', 'title', 'desc', 'xLabel', 'rows', 'from', 'to']) {
    if (spec[f] === undefined || spec[f] === null || spec[f] === '') throw new Error(`chart "${spec.id ?? '?'}" is missing "${f}"`);
  }
  const width = spec.width ?? 900;
  const rowH = 24;
  const labelW = 170;
  const top = 74;
  const plot = { l: 24 + labelW, r: width - 30, t: top, b: top + spec.rows.length * rowH };
  const x = linearScale(spec.from, spec.to, plot.l, plot.r);
  // Active rows end at the snapshot date the legend names, not at the right edge of the axis.
  const asOf = /^\d{4}-\d{2}-\d{2}$/.test(String(spec.asOf)) ? decimalYear(spec.asOf) : spec.to;
  let body = '';
  // legend
  body += `<g class="legend"><rect class="f0" x="70" y="40" width="24" height="8"/><text x="100" y="48">active (first release to ${escapeXml(String(spec.asOf ?? 'today'))})</text>`
    + `<line class="l1" x1="330" y1="44" x2="354" y2="44"/><text x="360" y="48">legacy or historical</text>`
    + `${markerShape('circle', 520, 44, 'm2', 4)}<text x="530" y="48">new major version</text>`
    + `${markerShape('cross', 680, 44, 'm3', 4)}<text x="690" y="48">end of life</text></g>`;
  for (let yr = Math.ceil(spec.from); yr <= spec.to; yr += 2) {
    body += `<line class="grid" x1="${fmt(x(yr))}" y1="${plot.t}" x2="${fmt(x(yr))}" y2="${plot.b}"/>`;
    body += `<text class="muted" x="${fmt(x(yr))}" y="${plot.b + 18}" text-anchor="middle">${yr}</text>`;
  }
  body += `<path class="axis" d="M${plot.l} ${plot.t}V${plot.b}H${plot.r}"/>`;
  spec.rows.forEach((r, i) => {
    const y = plot.t + i * rowH;
    const cy = y + rowH / 2;
    body += `<text x="${plot.l - 8}" y="${cy + 4}" text-anchor="end">${escapeXml(r.label)}</text>`;
    const s = toNumber(r.start);
    if (s === null) { body += `<text class="na" x="${plot.l + 6}" y="${cy + 4}">n/a</text>`; return; }
    const sx = x(Math.max(s, spec.from));
    const e = toNumber(r.end) ?? asOf;
    const ex = x(Math.min(e, spec.to));
    const tip = `<title>${escapeXml(`${r.label}: first release ${r.startLabel ?? s}${r.eolLabel ? `, end of life ${r.eolLabel}` : ''}`)}</title>`;
    body += r.legacy
      ? `<g>${tip}<line class="l1" x1="${fmt(sx)}" y1="${cy}" x2="${fmt(ex)}" y2="${cy}"/></g>`
      : `<g>${tip}<rect class="f0" x="${fmt(sx)}" y="${cy - 4}" width="${fmt(Math.max(2, ex - sx))}" height="8"/></g>`;
    let lastLabelX = -Infinity;
    for (const m of r.majors ?? []) {
      const mx = toNumber(m.x);
      if (mx === null || mx < spec.from || mx > spec.to) continue;
      body += `<g><title>${escapeXml(`${r.label} ${m.label}`)}</title>${markerShape('circle', x(mx), cy, 'm2', 3.5)}</g>`;
      if (x(mx) - lastLabelX > 22) { body += `<text class="muted" x="${fmt(x(mx))}" y="${cy - 6}" text-anchor="middle" font-size="9">${escapeXml(m.label)}</text>`; lastLabelX = x(mx); }
    }
    const eol = toNumber(r.eol);
    if (eol !== null && eol <= spec.to) body += `<g><title>${escapeXml(`${r.label}: end of life ${r.eolLabel ?? eol}`)}</title>${markerShape('cross', x(eol), cy, 'm3', 5)}</g>`;
  });
  body += `<text class="axis-label" x="${(plot.l + plot.r) / 2}" y="${plot.b + 40}" text-anchor="middle">${escapeXml(spec.xLabel)}</text>`;
  return wrap({ width, height: plot.b + 56, title: spec.title, desc: spec.desc, body, seriesCount: 4, id: spec.id });
}

export const FRAMEWORK_RENDERERS = { groupedbar: renderGroupedBarChart, panelbars: renderPanelBars, grid: renderGrid, timeline: renderTimeline };

/** Renders any definition (shared, cloud or timeline renderer), then the footer naming the sources and the date. */
export function renderFrameworkChart(def) {
  const own = FRAMEWORK_RENDERERS[def.type];
  const svg = own ? own(def) : renderChart(def);
  return def.footer ? addFooter(svg, def.footer) : svg;
}

export { wrapText };
