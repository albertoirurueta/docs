// Chart builders for the graphics and game libraries comparison page. Each builder takes the parsed CSV data
// ({ name: rows }) and returns a chart spec for ./renderers.mjs. Libraries keep one palette slot (colour, dash, marker)
// in every figure. Missing (n/a) values are never plotted as zero.
import { toNumber } from '../language-charts/data-utils.mjs';
import { APIS, AXES, ENGINES, LIBRARIES, LIBRARY_NAMES, LIBRARY_SLOT, computeScores } from './scores.mjs';
import { decimalYear, yearMonthLabel } from './renderers.mjs';

export { decimalYear, yearMonthLabel };
export const SNAPSHOT = '2026-11-01';
const roundTo = (v, d) => Number(v.toFixed(d));
const pct = (v) => `${roundTo(v, 1)}%`;
const int = (v) => Math.round(v).toLocaleString('en-US');
const NAME = LIBRARY_NAMES;

const pick = (rows, f) => rows.filter((r) => Object.entries(f).every(([k, v]) => (v instanceof RegExp ? v.test(r[k]) : r[k] === v)));
const latest = (rows, f) => {
  const m = pick(rows, f).filter((r) => toNumber(r.value) !== null).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return m.length ? toNumber(m.at(-1).value) : null;
};
const footer = (sources, file, extra = '') => `Source: ${sources}; retrieved ${SNAPSHOT}. ${extra}${extra ? ' ' : ''}Raw data: scripts/graphics-games-comparison-charts/data/${file}.csv. See the References for the sources.`;
const legendOf = (libs) => libs.map((p) => ({ name: NAME[p], slot: LIBRARY_SLOT[p] }));

/** Decimal year of a quarter label such as 2026-Q3. */
export function quarterYear(q) {
  const m = String(q).match(/^(\d{4})-Q([1-4])$/);
  return m ? Number(m[1]) + (Number(m[2]) - 1) / 4 : null;
}

// ---------------------------------------------------------------- Stack Overflow

const YEARS = Array.from({ length: 16 }, (_, i) => String(2010 + i));

function soSeries(data, id, title, desc, defs) {
  return {
    type: 'slotline', id, width: 860, title, desc,
    xLabel: 'Year asked', yLabel: 'Questions asked (count)',
    series: defs.map(([p, tag, name, variant]) => ({
      name, slot: LIBRARY_SLOT[p], variant,
      points: YEARS.map((y) => ({ x: Number(y), y: toNumber(pick(data.timeseries, { platform: p, metric: 'stackexchange_questions_year', item: `stackoverflow: tag ${tag}`, date: y })[0]?.value) })),
    })),
    footer: footer('Stack Exchange API (api.stackexchange.com), Stack Overflow tags', 'timeseries', 'Stack Overflow questions fell steeply from 2023 for every tag, so the decline says little about a library; the partial year 2026 is omitted.'),
  };
}

const soApis = (d) => soSeries(d, 'stackoverflow-apis', 'Stack Overflow questions per year, graphics APIs',
  'Questions asked each year on Stack Overflow with the tags opengl, opengl-es, webgl, three.js, metal and vulkan, 2010 to 2025. The opengl tag peaked in 2014 and has fallen since; webgl and three.js stay roughly flat between 2019 and 2022 and vulkan grows until 2022; all tags decline from 2023 together with the whole site. Metal has no values before 2014 (n/a), when the tag did not exist yet.',
  [['opengl', 'opengl', 'OpenGL (tag opengl)', 0], ['opengl', 'opengl-es', 'OpenGL (tag opengl-es)', 1], ['webgl', 'webgl', 'WebGL (tag webgl)', 0], ['webgl', 'three.js', 'WebGL (tag three.js)', 1], ['metal', 'metal', 'Metal (tag metal)', 0], ['vulkan', 'vulkan', 'Vulkan (tag vulkan)', 0]]);

const soEngines = (d) => soSeries(d, 'stackoverflow-engines', 'Stack Overflow questions per year, game engines',
  'Questions asked each year on Stack Overflow with the tags unity-game-engine, unreal-engine4 and unreal-engine5, 2010 to 2025. Unity questions are an order of magnitude more numerous than Unreal questions, peak around 2019 to 2020 and fall from 2023 with the whole site. Unreal Engine has its own forums and Epic community, so the tag undercounts its community.',
  [['unity', 'unity-game-engine', 'Unity (tag unity-game-engine)', 0], ['unreal-engine', 'unreal-engine4', 'Unreal Engine (tag unreal-engine4)', 0], ['unreal-engine', 'unreal-engine5', 'Unreal Engine (tag unreal-engine5)', 1]]);

// ---------------------------------------------------------------- GitHub

const REPOS = [['webgl', 'mrdoob/three.js'], ['webgl', 'gfx-rs/wgpu'], ['vulkan', 'KhronosGroup/Vulkan-Docs'], ['vulkan', 'KhronosGroup/Vulkan-Samples'], ['vulkan', 'KhronosGroup/MoltenVK'], ['opengl', 'google/angle']];
function githubBars(data, metric, id, title, unit, desc) {
  const items = REPOS.map(([p, repo]) => ({ label: repo, slot: LIBRARY_SLOT[p], value: latest(data.current, { platform: p, metric, item: repo }) }));
  items.push({ label: 'Unity (closed source)', slot: LIBRARY_SLOT.unity, value: null, naNote: 'no public repository' });
  items.push({ label: 'Unreal Engine (source on request)', slot: LIBRARY_SLOT['unreal-engine'], value: null, naNote: 'repository needs an Epic account' });
  return {
    type: 'slotbars', id, title, desc, width: 860,
    xLabel: `${unit} (count)`, yLabel: 'GitHub repository', valueFormat: int, legend: legendOf(LIBRARIES),
    items,
    footer: footer('GitHub REST API (api.github.com)', 'current', metric === 'github_contributors' ? 'Contributors include anonymous authors (anon=1). ANGLE is a GitHub mirror of the Chromium repository.' : 'Stars measure interest, not usage. ANGLE is a GitHub mirror of the Chromium repository.'),
  };
}

// ---------------------------------------------------------------- npm

const npmWeekly = (data) => {
  const ser = (item, name, variant) => ({
    name, slot: LIBRARY_SLOT.webgl, variant,
    points: pick(data.timeseries, { metric: 'npm_downloads_week_avg', item }).map((r) => ({ x: quarterYear(r.date), y: toNumber(r.value) })).filter((p) => p.x !== null),
  });
  return {
    type: 'slotline', id: 'npm-weekly', width: 860,
    title: 'npm weekly downloads per quarter',
    desc: 'Average npm downloads per week in each quarter, 2020-Q1 to 2026-Q4 to date, for three, @babylonjs/core and @webgpu/types. three is the most downloaded of the three by a wide margin; the counts include continuous integration and mirror traffic. The last point is the quarter to date. A quarter before a package existed shows n/a, not zero.',
    xLabel: 'Quarter (year)', yLabel: 'Average downloads per week (npm, includes CI)',
    series: [ser('three', 'three', 0), ser('@babylonjs/core', '@babylonjs/core', 1), ser('@webgpu/types', '@webgpu/types', 2)],
    footer: footer('npm downloads API (api.npmjs.org)', 'timeseries', 'All three packages are plotted in the WebGL colour because they target browser graphics; not comparable with native download counts.'),
  };
};

// ---------------------------------------------------------------- survey

const SEGMENTS = ['AAA studio', 'Mid-size and indie studio', 'Hobbyist'];
const engineShare = (data) => ({
  type: 'groupedbar', id: 'engine-share', width: 860,
  title: 'Engine usage by studio type, survey data',
  desc: 'Share of respondents who use each engine, by studio type, from the JetBrains State of GameDev 2025 report (Developer Ecosystem Survey 2025): Unity 64% of AAA, 63% of mid-size and indie, 57% of hobbyist respondents; Unreal Engine 55%, 38% and 28%; Godot and custom C++ engines shown for context. Respondents could pick several engines, so the shares do not sum to 100%. This is survey data with few AAA respondents, not market share. No GDC 2026 percentages are cited.',
  xLabel: 'Studio type (survey group)', yLabel: 'Respondents using the engine (%)', categories: SEGMENTS, valueFormat: (v) => `${v}%`,
  series: [['unity', 'Unity'], ['unreal-engine', 'Unreal Engine'], ['godot', 'Godot (context)'], ['custom-engine', 'Custom C++ engine (context)']].map(([p, name]) => ({
    name, values: SEGMENTS.map((s) => latest(data.current, { platform: p, metric: 'jetbrains_engine_share', item: s })),
  })),
  footer: footer('JetBrains State of GameDev 2025 (lp.jetbrains.com/the-state-of-gamedev-2025)', 'current', 'Survey data: sample size and fieldwork dates are not stated on the page.'),
});

// ---------------------------------------------------------------- release timeline

const PHASES = [{ key: 'main', label: 'Release generation, current until the next one', opacity: 0.85 }];
const ganttReleases = (data) => ({
  type: 'gantt', id: 'release-timeline', width: 980, rowH: 15,
  title: 'Specification and engine release timeline',
  desc: 'Timeline of the generations of OpenGL and OpenGL ES (1992 to 2017), WebGL and WebGPU, Metal 1 to 4, Vulkan 1.0 to 1.4 and the major versions of Unity and Unreal Engine. Each bar runs from the release of a generation until the next one; an arrow marks a generation that is still current. OpenGL stopped at 4.6 in 2017 while Vulkan, Metal and WebGPU appeared between 2014 and 2023.',
  xLabel: 'Year', from: '1992-01-01', to: '2030-01-01', today: SNAPSHOT, phases: PHASES,
  groups: LIBRARIES.map((p) => ({
    title: NAME[p], legend: NAME[p], slot: LIBRARY_SLOT[p],
    rows: data.releases.filter((r) => r.library === p).map((r) => ({ label: r.line, segments: [{ start: r.start, end: r.end, phase: 'main' }] })),
  })),
  footer: footer('Khronos registries, W3C, Apple, Unity and Epic release pages', 'releases', 'Dates are release or announcement dates at the precision of the cited pages; grouped generations (for example OpenGL 4.0 to 4.5) share one bar.'),
});

// ---------------------------------------------------------------- radar

const radarSpec = (data, id, title, libs) => {
  const scores = computeScores(data);
  return {
    type: 'slotradar', id, title, max: 10, unit: 'score 0-10, higher is better',
    desc: `Editorial scores from 0 to 10 on ten axes (productivity, control, platform reach, web reach, ease of learning, tooling, documentation, ecosystem, licensing openness and XR support) for ${libs.map((p) => NAME[p]).join(', ')}. Every score has a recorded basis and source in the data notes; APIs and engines are different kinds of product, so only axes that make sense across both are used.`,
    axes: AXES.map(([, label]) => label),
    series: libs.map((p) => ({ name: NAME[p], slot: LIBRARY_SLOT[p], values: AXES.map(([k]) => scores[p]?.[k] ?? null) })),
    footer: footer('editorial scores with their basis and source in radar-scores.csv', 'radar-scores', 'Scores summarise the evidence as of the snapshot and are not a benchmark.'),
  };
};

/** Chart builders: (data) => spec. The image file is graphics-games-comparison-<id>.svg. */
export const CHART_BUILDERS = [
  soApis, soEngines,
  (d) => githubBars(d, 'github_stars', 'github-stars', 'GitHub stars of the open repositories', 'Stars', 'Stars of the open repositories on 2026-11-01: three.js, wgpu, Vulkan-Docs, Vulkan-Samples, MoltenVK and the ANGLE mirror. Unity and Unreal Engine have no public source repository and are marked n/a.'),
  (d) => githubBars(d, 'github_contributors', 'github-contributors', 'GitHub contributors of the open repositories', 'Contributors', 'Contributors, including anonymous authors, of the open repositories on 2026-11-01. three.js and wgpu have by far the most; Unity and Unreal Engine are marked n/a because their source is not public.'),
  npmWeekly, engineShare, ganttReleases,
  (d) => radarSpec(d, 'radar-apis', 'Scores on ten axes, four graphics APIs', APIS),
  (d) => radarSpec(d, 'radar-engines', 'Scores on ten axes, two game engines', ENGINES),
  (d) => radarSpec(d, 'radar-all', 'Scores on ten axes, all six', LIBRARIES),
];
