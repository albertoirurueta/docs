// Chart builders for the "Documentation Tools" comparison page. Each builder takes the parsed CSV data
// ({ name: rows }) and returns a chart spec for the renderers of scripts/language-charts/generate-charts.mjs.
// Missing (n/a) values are never plotted as zero.
import { toNumber } from '../language-charts/data-utils.mjs';
import { AXES, computeScores } from './scores.mjs';

const nameOf = (data) => {
  const m = new Map(data.tools.map((t) => [t.id, t.name]));
  return (id) => m.get(id) ?? id;
};

/** Decimal year for an ISO date or a YYYY-MM month: 2026-07-01 -> 2026.5. */
export function decimalYear(iso) {
  const [y, m = '01', d = '01'] = String(iso).split('-');
  return Number(y) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}

/** Label for a decimal year as YYYY-MM, used on date axes. */
export function yearMonthLabel(v) {
  const year = Math.floor(v + 1e-9);
  const month = Math.min(12, Math.floor((v - year) * 12 + 1e-6) + 1);
  return `${year}-${String(month).padStart(2, '0')}`;
}

const snapshotOf = (data) => data.current[0]?.retrieved ?? 'n/a';

function groupSeries(rows, nameFor, keyField, point) {
  const m = new Map();
  for (const r of rows) {
    if (!m.has(r[keyField])) m.set(r[keyField], []);
    m.get(r[keyField]).push(point(r));
  }
  return [...m].map(([id, points]) => ({ name: nameFor(id), points }));
}

function npmMonthly(data) {
  const name = nameOf(data);
  return {
    type: 'line', id: 'npm-downloads', width: 860,
    title: 'npm downloads per month',
    desc: `Monthly npm downloads of @docusaurus/core and @antora/cli from the first publication to the last complete month before ${snapshotOf(data)}, from the npm downloads range API. Counts include CI and mirror traffic.`,
    xLabel: 'Month (year)', yLabel: 'Downloads per month (npm, includes CI)',
    series: groupSeries(data['downloads-npm-monthly'], name, 'tool_id', (r) => ({ x: decimalYear(r.month), y: toNumber(r.downloads) })),
  };
}

function pypiWeekly(data) {
  const name = nameOf(data);
  return {
    type: 'line', id: 'pypi-downloads', width: 860, xFormat: yearMonthLabel,
    title: 'PyPI downloads per week',
    desc: `Weekly PyPI downloads of mkdocs, mkdocs-material and zensical over the 180 days before ${snapshotOf(data)}, excluding mirrors, from the pypistats.org API. Only complete Monday-to-Sunday weeks are shown.`,
    xLabel: 'Week start (year-month)', yLabel: 'Downloads per week (PyPI, without mirrors)',
    series: groupSeries(data['downloads-pypi-weekly'], name, 'tool_id', (r) => ({ x: decimalYear(r.week_start), y: toNumber(r.downloads) })),
  };
}

function releasesCumulative(data) {
  const name = nameOf(data);
  const snap = snapshotOf(data);
  const series = data.tools.map((t) => {
    const rows = data.releases.filter((r) => r.tool_id === t.id).sort((a, b) => a.date.localeCompare(b.date));
    const points = rows.map((r, i) => ({ x: decimalYear(r.date), y: i + 1 }));
    if (points.length) points.push({ x: decimalYear(snap), y: points.length });
    return { name: name(t.id), points };
  }).filter((s) => s.points.length);
  return {
    type: 'line', id: 'releases', width: 860,
    title: 'Cumulative stable releases',
    desc: `Number of stable releases published by each tool over time, counted from the npm registry, PyPI and GitHub releases, up to ${snap}. A steeper line means a faster release cadence; pre-releases are excluded.`,
    xLabel: 'Release date (year)', yLabel: 'Stable releases (cumulative count)',
    series,
  };
}

const barOf = (data, id, title, desc, xLabel, pick, labelFor, format) => ({
  type: 'bar', id, title, desc, xLabel, yLabel: 'Tool', seriesName: xLabel, width: 820,
  valueFormat: format,
  items: data.current
    .map((c) => ({ label: labelFor(c), value: pick(c) }))
    .sort((a, b) => (b.value ?? -1) - (a.value ?? -1)),
});

const withHost = (c) => (c.host === 'gitlab' ? `${c.name} (GitLab)` : c.name);

function starsBars(data) {
  return barOf(data, 'stars', 'Repository stars',
    `Stars of each tool's source repository on ${snapshotOf(data)} (GitHub REST API; GitLab REST API for Antora). GitLab and GitHub stars are not directly comparable.`,
    'Stars (count)', (c) => toNumber(c.stars), withHost, (v) => v.toLocaleString('en-US'));
}

function downloadsBars(data) {
  return barOf(data, 'downloads', 'Package downloads in the last 7 days',
    `Downloads in the last 7 days on ${snapshotOf(data)}: npm for Docusaurus and Antora, PyPI for Zensical, Material for MkDocs and MkDocs. DocFX is distributed on NuGet, which only publishes a cumulative total, so it is n/a. Ecosystems are counted differently and must not be compared across.`,
    'Downloads in 7 days (count)',
    (c) => (/cumulative/.test(c.downloads_unit) ? null : toNumber(c.downloads)),
    (c) => `${c.name} (${c.downloads_unit.startsWith('npm') ? 'npm' : c.downloads_unit.startsWith('PyPI') ? 'PyPI' : 'NuGet'})`,
    (v) => v.toLocaleString('en-US'));
}

function questionsBars(data) {
  return barOf(data, 'questions', 'Stack Overflow questions per tag',
    `Number of questions on Stack Overflow with each tool's tag on ${snapshotOf(data)} (Stack Exchange API). Zensical has no tag, shown as n/a rather than zero.`,
    'Questions (count)', (c) => toNumber(c.so_questions), (c) => c.name, (v) => v.toLocaleString('en-US'));
}

const radarSpec = (data, id, title, toolIds) => {
  const scores = computeScores(data);
  const name = nameOf(data);
  return {
    type: 'radar', id, title, max: 10, unit: 'score 0-10, higher is better',
    desc: `Scores from 0 to 10 on ten axes for ${toolIds.map(name).join(', ')}. Eight axes are editorial scores and two (ecosystem and maintenance health) are computed from the metrics snapshot of ${snapshotOf(data)}; the rubric is in the data notes.`,
    axes: AXES.map(([, label]) => label),
    series: toolIds.map((t) => ({ name: name(t), values: AXES.map(([key]) => scores[t]?.[key] ?? null) })),
  };
};

export const RADAR_TOOLS = ['docusaurus', 'antora', 'zensical', 'docfx'];

/** Chart builders: (data) => spec. The image file is documentation-tools-comparison-<id>.svg. */
export const CHART_BUILDERS = [
  npmMonthly, pypiWeekly, releasesCumulative, starsBars, downloadsBars, questionsBars,
  (d) => radarSpec(d, 'radar-all', 'Scores on ten axes, four tools', RADAR_TOOLS),
  ...RADAR_TOOLS.map((t) => (d) => radarSpec(d, `radar-${t}`, `${nameOf(d)(t)} scores on ten axes`, [t])),
];
