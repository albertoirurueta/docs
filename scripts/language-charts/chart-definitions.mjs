// Chart definitions for the "Programming Languages Comparative" guide. Each builder takes the parsed CSV data
// ({ name: rows }) and returns a chart spec for generate-charts.mjs. Missing (n/a) values are never plotted as zero.
import { isMissing, toNumber } from './data-utils.mjs';
import { computeScores } from './scores.mjs';

const TIOBE_ED = 'TIOBE Index, October 2026';

// ---------------------------------------------------------------- shared helpers

export const nameOf = (data) => {
  const m = new Map(data.languages.map((l) => [l.id, l.name]));
  return (id) => m.get(id) ?? id;
};

const groupOf = (data) => {
  const m = new Map(data.languages.map((l) => [l.id, l.group]));
  return (id) => m.get(id) ?? 'other';
};

/** First four-digit year in a `first_appeared` cell, or null ("n/a (ambiguous...)" has none). */
export function firstYear(value) {
  if (isMissing(value)) return null;
  const m = /^\s*(\d{4})/.exec(String(value));
  return m ? Number(m[1]) : null;
}

/** Groups items into series by `key`, in order of first appearance. */
function seriesBy(items, key) {
  const m = new Map();
  for (const it of items) {
    if (!m.has(key(it))) m.set(key(it), []);
    m.get(key(it)).push(it);
  }
  return [...m].map(([name, points]) => ({ name, points }));
}

/** Sorts bar items ascending or descending by value, with missing values last. */
export function sortItems(items, direction = 'desc') {
  const k = direction === 'desc' ? -1 : 1;
  return [...items].sort((a, b) => {
    if (a.value === null && b.value === null) return a.label.localeCompare(b.label);
    if (a.value === null) return 1;
    if (b.value === null) return -1;
    return k * (a.value - b.value) || a.label.localeCompare(b.label);
  });
}

const metricItems = (data, rows, pick, valueField = 'value') => {
  const name = nameOf(data);
  return data.languages.map((l) => {
    const row = rows.find((r) => r.language_id === l.id && pick(r));
    return { label: name(l.id), value: row ? toNumber(row[valueField]) : null };
  });
};

// ---------------------------------------------------------------- overview (Task 8)

function timeline(data) {
  const name = nameOf(data);
  const group = groupOf(data);
  const dated = data.languages
    .map((l) => ({ id: l.id, year: firstYear(l.first_appeared), raw: l.first_appeared }))
    .filter((l) => l.year !== null)
    .sort((a, b) => a.year - b.year || name(a.id).localeCompare(name(b.id)));
  const undated = data.languages.filter((l) => firstYear(l.first_appeared) === null).map((l) => name(l.id));
  const points = dated.map((l, i) => ({
    x: l.year, y: i + 1, group: group(l.id),
    label: `${name(l.id)} (${l.year}${/uncertain/i.test(l.raw) ? '?' : ''})`,
  }));
  return {
    type: 'scatter',
    id: 'timeline-first-appeared',
    title: 'When each language first appeared',
    desc: `Timeline of the year each of the ${dated.length} compared languages first appeared, one row per language from oldest to newest, `
      + 'coloured by editorial group. Year is the first one given in the Wikipedia Timeline of programming languages, retrieved 2026-10-26: '
      + `a range such as 1954-1955 uses its first year, and a question mark marks a year the source calls uncertain. Left out because no single year exists: ${undated.join(', ') || 'none'}.`,
    xLabel: 'First appeared (year)',
    yLabel: 'Order of appearance (1 = oldest)',
    width: 900,
    height: 980,
    xExtent: [1950, 2045],
    series: seriesBy(points, (p) => p.group).map((s) => ({ name: s.name, points: s.points })),
  };
}

/** Maps a licence cell to a family label, or null when no licence was recorded. */
export function licenceFamily(value) {
  if (isMissing(value)) return null;
  const v = String(value).trim();
  if (/^apache/i.test(v)) return 'Apache-2.0';
  if (/^mit/i.test(v)) return 'MIT';
  if (/^bsd/i.test(v)) return 'BSD-3-Clause';
  if (/^gpl/i.test(v)) return 'GPL-2.0';
  if (/^ruby/i.test(v)) return 'Ruby License / BSD-2-Clause';
  return v;
}

function licences(data) {
  const counts = new Map();
  for (const l of data.languages) {
    const fam = licenceFamily(l.license) ?? 'n/a (no licence recorded)';
    counts.set(fam, (counts.get(fam) ?? 0) + 1);
  }
  const items = sortItems([...counts].map(([label, value]) => ({ label, value })));
  const na = items.find((i) => i.label.startsWith('n/a'));
  const ordered = [...items.filter((i) => i !== na), ...(na ? [na] : [])];
  const known = ordered.filter((i) => i !== na).reduce((a, i) => a + i.value, 0);
  return {
    type: 'bar',
    id: 'licences',
    title: 'Licence of the reference implementation',
    desc: `Number of the ${data.languages.length} compared languages per licence recorded in the licence column of languages.csv `
      + `(GitHub repository metadata and project pages, retrieved 2026-10-26). ${known} languages have an open-source licence recorded `
      + `and ${na ? na.value : 0} have none recorded (n/a). No closed-source licence appears in the data, so the chart does not claim that any language is closed source: `
      + 'languages without a single reference implementation (C, C++, COBOL, Assembly, SQL) or whose repository reports no standard licence are unclassified.',
    xLabel: 'Languages (count)',
    yLabel: 'Licence',
    seriesName: 'Languages',
    valueFormat: (v) => String(v),
    items: ordered,
  };
}

/** Classifies the `;` separated purposes of a language as general-purpose, mixed or specific. */
export function purposeKind(value) {
  if (isMissing(value)) return null;
  const parts = String(value).split(';').map((p) => p.trim().toLowerCase()).filter(Boolean);
  const general = parts.filter((p) => p.startsWith('general-purpose') || p === 'general purpose');
  if (general.length === 0) return 'specific';
  return parts.length === general.length ? 'general' : 'general-plus';
}

function purposes(data) {
  const name = nameOf(data);
  const buckets = { 'general-plus': [], general: [], specific: [] };
  for (const l of data.languages) {
    const kind = purposeKind(l.purposes);
    if (kind) buckets[kind].push(name(l.id));
  }
  const labels = {
    'general-plus': 'General-purpose, with other uses listed',
    general: 'General-purpose only',
    specific: 'Specific purposes only',
  };
  return {
    type: 'bar',
    id: 'single-vs-multi-purpose',
    title: 'General-purpose vs specific-purpose languages',
    desc: 'Number of compared languages whose listed purposes (the purposes column of languages.csv, from the Wikipedia lead, retrieved 2026-10-26) '
      + 'include "general-purpose" together with other uses, only "general-purpose", or only specific purposes. '
      + Object.entries(buckets).map(([k, v]) => `${labels[k]}: ${v.join(', ') || 'none'}.`).join(' '),
    xLabel: 'Languages (count)',
    yLabel: 'Kind of purposes listed',
    seriesName: 'Languages',
    valueFormat: (v) => String(v),
    items: Object.entries(buckets).map(([k, v]) => ({ label: labels[k], value: v.length })),
  };
}

// ---------------------------------------------------------------- popularity and ecosystem (Task 9)

function tiobeCurrent(data) {
  const items = sortItems(metricItems(data, data['popularity-current'], (r) => r.source === 'tiobe' && r.metric === 'rating'));
  return {
    type: 'bar', id: 'popularity-tiobe-current',
    title: 'TIOBE rating, October 2026',
    desc: `Current TIOBE Index rating of each compared language (${TIOBE_ED}, retrieved 2026-10-26). The rating is the share of search-engine hits for the language, in percent.`,
    xLabel: 'TIOBE rating (%)', yLabel: 'Language', seriesName: 'TIOBE rating',
    valueFormat: (v) => `${v}%`, items,
  };
}

function pyplCurrent(data) {
  const rows = data['popularity-current'];
  const name = nameOf(data);
  // PYPL tracks C and C++ as one entry: show it once instead of repeating the same share twice.
  const items = data.languages.filter((l) => l.id !== 'cpp').map((l) => {
    const row = rows.find((r) => r.language_id === l.id && r.source === 'pypl' && r.metric === 'share');
    return { label: l.id === 'c' ? 'C and C++ (combined)' : name(l.id), value: row ? toNumber(row.value) : null };
  });
  return {
    type: 'bar', id: 'popularity-pypl-current',
    title: 'PYPL share, 2026',
    desc: 'Current PYPL PopularitY of Programming Language share of each language (percent of language tutorial searches, PYPL All.js, retrieved 2026-10-26). '
      + 'C and C++ are a single combined PYPL entry. Languages PYPL does not track show n/a.',
    xLabel: 'PYPL share (%)', yLabel: 'Language', seriesName: 'PYPL share',
    valueFormat: (v) => `${v}%`, items: sortItems(items),
  };
}

/** Builds line series for the chosen ids from popularity-history rows of one source (x = year, months offset from June). */
export function historySeries(rows, source, ids, nameFor) {
  return ids.map((id) => ({
    name: nameFor(id),
    points: rows
      .filter((r) => r.source === source && r.language_id === id)
      .map((r) => ({ x: Number(r.year) + (Number(r.sample_month) - 6) / 12, y: toNumber(r.value) }))
      .filter((p) => Number.isFinite(p.x))
      .sort((a, b) => a.x - b.x),
  })).filter((s) => s.points.some((p) => p.y !== null));
}

function tiobeHistory(data) {
  const name = nameOf(data);
  const ids = ['python', 'java', 'c', 'cpp', 'csharp', 'javascript', 'go', 'rust'];
  return {
    type: 'line', id: 'popularity-history-tiobe',
    title: 'TIOBE rating over the years',
    desc: 'TIOBE rating (percent) of eight representative languages, sampled each June from 2001 plus the latest month (October 2026), TIOBE monthly series retrieved 2026-10-26. '
      + 'A language starts when TIOBE has a page series for it (Go and Rust from 2011).',
    xLabel: 'Year (June sample; last point October 2026)', yLabel: 'TIOBE rating (%)',
    series: historySeries(data['popularity-history'], 'tiobe', ids, name),
  };
}

function pyplHistory(data) {
  const name = nameOf(data);
  const nameFor = (id) => (id === 'c+cpp' ? 'C and C++ (combined)' : name(id));
  const ids = ['python', 'java', 'c+cpp', 'javascript', 'php', 'csharp', 'typescript', 'rust'];
  return {
    type: 'line', id: 'popularity-history-pypl',
    title: 'PYPL share over the years',
    desc: 'PYPL share (percent of tutorial searches among the 30 tracked languages) of eight representative languages, sampled each June from 2004 plus the latest month, PYPL All.js retrieved 2026-10-26. '
      + 'C and C++ are one combined PYPL entry.',
    xLabel: 'Year (June sample; last point 2026)', yLabel: 'PYPL share (%)',
    series: historySeries(data['popularity-history'], 'pypl', ids, nameFor),
  };
}

/** Short registry label, "Registry (unit)". */
export function registryLabel(registry, unit) {
  const r = String(registry).replace(/\s*\(MetaCPAN\)/, '').replace(/ registry$/i, '').replace(/ \(proxy.*$/, '');
  const u = String(unit ?? '').replace(/\s*\(.*\)/, '').trim();
  return u ? `${r} (${u})` : r;
}

function registrySizes(data) {
  const eco = data.ecosystem;
  const byLang = (metric) => new Map(eco.filter((r) => r.metric === metric).map((r) => [r.language_id, r]));
  const names = byLang('registry_name');
  const pkgs = byLang('registry_packages');
  const registries = new Map();
  const without = [];
  for (const l of data.languages) {
    const n = names.get(l.id);
    const p = pkgs.get(l.id);
    const count = p ? toNumber(p.value) : null;
    if (!n || isMissing(n.value) || count === null) { without.push(l.name); continue; }
    const label = registryLabel(n.value, p.unit);
    if (!registries.has(label)) registries.set(label, { label, value: count, langs: [] });
    registries.get(label).langs.push(l.name);
  }
  const items = sortItems([...registries.values()].map(({ label, value }) => ({ label, value })));
  const shared = [...registries.values()].filter((r) => r.langs.length > 1).map((r) => `${r.label}: ${r.langs.join(', ')}`);
  return {
    type: 'bar', id: 'ecosystem-registry-size',
    title: 'Package registry size, 2026 snapshot',
    desc: 'Number of packages listed by the main package registry of each language, snapshot taken 2026-10-25/26 from the registry APIs or pages named in ecosystem.csv. '
      + 'Units differ (packages, artifacts, gems, crates, distributions) and are shown in the label, so compare orders of magnitude only. '
      + `Registries shared by several languages are shown once (${shared.join('; ')}). No registry count was found for: ${without.join(', ')}.`,
    xLabel: 'Entries in the registry (count)', yLabel: 'Registry (unit)', seriesName: 'Registry entries',
    valueFormat: (v) => v.toLocaleString('en-US'), items,
  };
}

function registryGrowth(data) {
  const rows = data['ecosystem-history'];
  const registries = [...new Set(rows.map((r) => r.registry))];
  const series = registries.map((reg) => ({
    name: reg,
    points: rows.filter((r) => r.registry === reg)
      .map((r) => ({ x: Number(r.year), y: toNumber(r.packages) }))
      .filter((p) => p.y !== null).sort((a, b) => a.x - b.x),
  })).filter((s) => s.points.length >= 2);
  const single = registries.filter((reg) => !series.some((s) => s.name === reg));
  return {
    type: 'line', id: 'ecosystem-registry-growth',
    title: 'Registry growth over the years: LuaRocks',
    desc: `Cumulative number of modules in ${series.map((s) => s.name).join(', ')}, one sample per year (last sample of each year, luarocks.org/stats, retrieved 2026-10-26). `
      + `This is the only registry with a real yearly series in the data: for ${single.join(', ')} only a 2026 snapshot (or no value) could be read, `
      + 'because historical counts were unreachable, so no growth line is drawn for them and none is estimated.',
    xLabel: 'Year', yLabel: 'Modules in the registry (count)',
    series,
  };
}

/** Languages with a TIOBE rating now and in June 2016, and their change in percentage points. */
export function growthPoints(data) {
  const name = nameOf(data);
  const group = groupOf(data);
  const current = new Map(data['popularity-current'].filter((r) => r.source === 'tiobe' && r.metric === 'rating')
    .map((r) => [r.language_id, toNumber(r.value)]));
  const base = new Map(data['popularity-history'].filter((r) => r.source === 'tiobe' && r.year === '2016' && r.sample_month === '6')
    .map((r) => [r.language_id, toNumber(r.value)]));
  return data.languages.map((l) => {
    const now = current.get(l.id) ?? null;
    const then = base.get(l.id) ?? null;
    return {
      id: l.id, x: now, y: now !== null && then !== null ? Math.round((now - then) * 100) / 100 : null,
      group: group(l.id), label: name(l.id), weight: Math.abs(now ?? 0) + 2 * Math.abs((now ?? 0) - (then ?? 0)),
    };
  }).filter((p) => p.x !== null && p.y !== null);
}

/** The zoom chart shows the languages whose TIOBE rating is below this threshold (percent). */
export const GROWTH_ZOOM_BELOW = 4;

function popularityVsGrowth(data) {
  const points = growthPoints(data);
  return {
    type: 'scatter', id: 'popularity-vs-growth',
    title: 'Popularity vs 10-year growth',
    desc: 'Current TIOBE rating (horizontal) against the change in TIOBE rating between June 2016 and October 2026 (vertical), in percentage points, one point per language, '
      + `coloured by editorial group; ${points.length} languages have both values and the others (no TIOBE history in June 2016) are left out. `
      + 'Labels that would overlap are omitted: hover a point for its name, or see the zoomed chart for the languages below 4%. TIOBE Index monthly series, retrieved 2026-10-26.',
    xLabel: 'TIOBE rating, October 2026 (%)', yLabel: 'Change since June 2016 (percentage points)',
    width: 900, height: 620, xExtent: [0, 24],
    series: seriesBy(points, (p) => p.group).map((s) => ({ name: s.name, points: s.points })),
  };
}

function popularityVsGrowthZoom(data) {
  const points = growthPoints(data).filter((p) => p.x < GROWTH_ZOOM_BELOW);
  return {
    type: 'scatter', id: 'popularity-vs-growth-zoom',
    title: 'Popularity vs 10-year growth, zoom on languages below 4%',
    desc: `Zoom of the popularity vs growth chart on the ${points.length} languages with a TIOBE rating below ${GROWTH_ZOOM_BELOW}% in October 2026: rating against the change since June 2016, in percentage points, coloured by editorial group. `
      + 'Labels that would overlap are omitted: hover a point for its name. TIOBE Index monthly series, retrieved 2026-10-26.',
    xLabel: 'TIOBE rating, October 2026 (%)', yLabel: 'Change since June 2016 (percentage points)',
    width: 900, height: 620, xExtent: [0, 4.5],
    series: seriesBy(points, (p) => p.group).map((s) => ({ name: s.name, points: s.points })),
  };
}

// ---------------------------------------------------------------- performance, learning and radar (Task 10)

function perfBars(id, title, rows, metric, field, valueLabel, desc, direction = 'asc') {
  return (data) => ({
    type: 'bar', id, title, desc,
    xLabel: valueLabel, yLabel: 'Language', seriesName: valueLabel,
    valueFormat: (v) => `${v}x`,
    items: sortItems(metricItems(data, data[rows], (r) => metric === null || r.metric === metric, field), direction),
  });
}

const cpuBars = perfBars('performance-cpu', 'CPU time relative to the fastest implementation', 'performance', 'cpu_time_vs_fastest', 'value',
  'CPU time (ratio to the fastest, lower is better)',
  'CPU time of each language as a ratio to the fastest implementation, geometric mean over 7 Benchmarks Game programs (edition 25.03, measured 05 Mar 2025), derived from the per-program tables. '
  + 'Lower is better. Languages not in the Benchmarks Game show n/a, they are not zero.');
const memBars = perfBars('performance-memory', 'Memory use relative to the lowest', 'performance', 'memory_vs_fastest', 'value',
  'Memory (ratio to the lowest, lower is better)',
  'Peak memory of each language as a ratio to the lowest value listed, geometric mean over 7 Benchmarks Game programs (edition 25.03, measured 05 Mar 2025). '
  + 'Lower is better. Languages not in the Benchmarks Game show n/a, they are not zero.');
const energyBars = perfBars('performance-energy', 'Energy use relative to C', 'energy', null, 'energy_normalized',
  'Energy (ratio to C = 1.00, lower is better)',
  'Energy consumed by each language normalised to C = 1.00, from Table 4 of Pereira et al., Science of Computer Programming 2021 (preprint 2021-03-23). '
  + 'Lower is better. Zig, Mojo, Julia and 12 other languages are absent from the paper and show n/a.');

/** Scatter of two radar axes (indices into the score arrays) with one series per editorial group. */
function scoreScatter({ id, title, desc, xAxis, yAxis, xLabel, yLabel }) {
  return (data) => {
    const { axes, scores } = computeScores(data);
    const xi = axes.indexOf(xAxis);
    const yi = axes.indexOf(yAxis);
    const name = nameOf(data);
    const group = groupOf(data);
    const points = data.languages.map((l) => ({ x: scores.get(l.id)[xi], y: scores.get(l.id)[yi], label: name(l.id), group: group(l.id) }))
      .filter((p) => p.x !== null && p.y !== null);
    return {
      type: 'scatter', id, title,
      desc: `${desc} ${points.length} of ${data.languages.length} languages have both scores; the others lack data and are left out. Scores follow the rubric in data/NOTES.md (retrieved 2026-10-26).`,
      xLabel, yLabel, width: 900, height: 620, xExtent: [0, 10], yExtent: [0, 10],
      series: seriesBy(points, (p) => p.group).map((s) => ({ name: s.name, points: s.points })),
    };
  };
}

const perfVsEase = scoreScatter({
  id: 'performance-vs-ease', title: 'Performance vs ease of learning',
  desc: 'Speed score (log scale of CPU time relative to the fastest, 10 = fastest) against ease-of-learning score (mean of the onboarding checks and the shortness of the Benchmarks Game sources), one point per language coloured by editorial group.',
  xAxis: 'Performance', yAxis: 'Learning (ease)', xLabel: 'Performance score (0-10, higher is faster)', yLabel: 'Learning (ease) score (0-10, higher is easier)',
});

const energyVsEase = scoreScatter({
  id: 'energy-vs-ease', title: 'Energy efficiency vs ease of learning',
  desc: 'Energy score (log scale of energy relative to C, 10 = least energy) against ease-of-learning score (mean of the onboarding checks and the shortness of the Benchmarks Game sources), one point per language coloured by editorial group.',
  xAxis: 'Energy', yAxis: 'Learning (ease)', xLabel: 'Energy score (0-10, higher is more efficient)', yLabel: 'Learning (ease) score (0-10, higher is easier)',
});

export const RADAR_GROUPS = [
  { id: 'jvm', title: 'JVM languages', ids: ['java', 'kotlin', 'scala', 'groovy'] },
  { id: 'c-family', title: 'C family', ids: ['c', 'cpp', 'csharp', 'objective-c'] },
  { id: 'scripting', title: 'Scripting languages', ids: ['python', 'javascript', 'typescript', 'ruby', 'php', 'perl', 'lua', 'bash'] },
  { id: 'scientific', title: 'Scientific languages', ids: ['python', 'r', 'matlab', 'julia', 'fortran'] },
  { id: 'systems', title: 'Systems languages', ids: ['c', 'cpp', 'rust', 'go', 'zig', 'ada'] },
  { id: 'legacy', title: 'Legacy languages', ids: ['cobol', 'fortran', 'pascal-delphi', 'visual-basic', 'lisp', 'assembly'] },
];

function radarFor(group) {
  return (data) => {
    const { axes, scores } = computeScores(data);
    const name = nameOf(data);
    const series = group.ids.map((id) => ({ name: name(id), values: scores.get(id) ?? axes.map(() => null) }));
    const gaps = series.filter((s) => s.values.some((v) => v === null)).map((s) => s.name);
    return {
      type: 'radar', id: `radar-${group.id}`,
      title: `Radar comparison: ${group.title}`,
      desc: `Scores from 0 to 10 on ${axes.length} axes (${axes.join(', ')}) for ${series.map((s) => s.name).join(', ')}, computed from the sourced CSV data with the rubric in data/NOTES.md (retrieved 2026-10-26). `
        + `A gap in an outline means no data (n/a) on that axis, not a score of zero; languages with at least one gap: ${gaps.join(', ') || 'none'}.`,
      axes, series,
    };
  };
}

export const CHART_BUILDERS = [
  timeline, licences, purposes,
  tiobeCurrent, pyplCurrent, tiobeHistory, pyplHistory, registrySizes, registryGrowth, popularityVsGrowth, popularityVsGrowthZoom,
  cpuBars, memBars, energyBars, perfVsEase, energyVsEase,
  ...RADAR_GROUPS.map(radarFor),
];
