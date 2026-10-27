// Chart builders for the "Backend Frameworks Comparison" and "Web Frameworks Comparison" pages. Each builder takes the
// parsed CSV data ({ name: rows }) and returns a spec for ./renderers.mjs, with `file` (the output name without .svg,
// page prefix included) and a `footer` naming the sources and the date. Rules: missing (n/a) values are never plotted as
// zero (gaps or "n/a" labels); registries with different units never share an axis (separate charts or panels); line
// charts have at most eight series so every series keeps its own colour; a chart whose data is entirely n/a gets
// `skip` with the reason and is reported by the generator instead of being drawn empty.
import {
  AXES, FILE_PREFIX, RADAR_GROUPS, axisLabel, decimalYear, frameworksOf, nameOf, num, snapshotOf, sourceIds,
} from './frameworks.mjs';
import { bestRps, computeScores, fortunesRps, radarValues } from './scores.mjs';

const MAX_SERIES = 8;
const fmtInt = (v) => Math.round(v).toLocaleString('en-US');
const millions = (v) => `${Math.round(v / 1e5) / 10}M`;
const pct = (v) => `${Math.round(v * 10) / 10}%`;

/** Collapses numbered series of ids (techempower-r16 ... techempower-r23, so-2019 ... so-2025) into "first to last". */
export function compressIds(ids) {
  const out = [];
  const groups = new Map();
  for (const id of ids) {
    const m = /^(.*?)(\d+)$/.exec(id);
    if (m && /^(techempower-r|so-)$/.test(m[1])) { if (!groups.has(m[1])) { groups.set(m[1], []); out.push(m[1]); } groups.get(m[1]).push(Number(m[2])); } else out.push(id);
  }
  return out.map((x) => { const g = groups.get(x); if (!g) return x; g.sort((a, b) => a - b); return g.length > 2 ? `${x}${g[0]} to ${x}${g.at(-1)}` : g.map((n) => `${x}${n}`).join(', '); });
}
/** Footer: source ids, snapshot date and an optional remark. */
export function footer(data, rows, extra = '') {
  const ids = compressIds(rows.length && typeof rows[0] === 'string' ? [...rows].sort() : sourceIds(rows));
  return `Sources: ${ids.join(', ')} (see the Bibliography). Data as of ${snapshotOf(data)}${extra ? `. ${extra}` : ''}.`;
}
/** Spec with the page prefix applied; `skip` when every value is missing. */
function spec(page, id, s, values) {
  const out = { ...s, id: `${page}-${id}`, file: `${FILE_PREFIX[page]}${id}` };
  if (values && !values.some((v) => v !== null && v !== undefined)) out.skip = 'every value is n/a';
  return out;
}
const pageIds = (data, page) => new Set(frameworksOf(data, page).map((f) => f.id));
/** Latest popularity value for one framework and metric. */
const pop = (data, id, metric) => num(data.popularity.find((r) => r.framework_id === id && r.metric === metric)?.value);
/** Bar items sorted by value, n/a rows last. */
function barItems(data, ids, valueOf) {
  const items = ids.map((id) => ({ id, label: nameOf(data, id), value: valueOf(id) }));
  return items.sort((a, b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));
}

// ---------------------------------------------------------------- timeline
function timeline(page) {
  return (data) => {
    const ids = [...pageIds(data, page)];
    const rel = data.releases.filter((r) => ids.includes(r.framework_id));
    const first = (id) => rel.find((r) => r.framework_id === id && r.kind === 'first')?.date;
    const rows = ids.map((id) => {
      const f = data.frameworks.find((x) => x.id === id);
      const fd = first(id);
      const eol = rel.find((r) => r.framework_id === id && r.kind === 'eol');
      return {
        id, label: nameOf(data, id), start: fd && fd !== 'n/a' ? decimalYear(fd) : null, startLabel: fd,
        end: eol ? decimalYear(eol.date) : null, eol: eol ? decimalYear(eol.date) : null, eolLabel: eol?.date,
        legacy: f.status !== 'active',
        majors: rel.filter((r) => r.framework_id === id && r.kind === 'major').map((r) => ({ x: decimalYear(r.date), label: `v${String(r.version).replace(/^v/, '').split('.')[0]}` })),
      };
    }).sort((a, b) => (a.start ?? 9999) - (b.start ?? 9999));
    return spec(page, 'timeline', {
      type: 'timeline', width: 940, from: 2000, to: 2027, asOf: snapshotOf(data),
      title: `${page === 'backend' ? 'Backend' : 'Web'} frameworks: first release, major versions and end of life`,
      desc: 'One row per framework: bar from the first release to today (dashed for legacy and historical entries), circles at the first stable release of each major version, a cross at the end of life. n/a means no release date could be sourced.',
      xLabel: 'Year (first release from the package registry or the site page named in frameworks.csv)', rows,
      footer: footer(data, rel, 'Registry dates are first publication on the registry, which can be later than the project launch'),
    }, rows.map((r) => r.start));
  };
}

// ---------------------------------------------------------------- Stack Overflow
function soUsage(page) {
  return (data) => {
    const ids = [...pageIds(data, page)].filter((id) => pop(data, id, 'so_usage_all') !== null);
    const rows = data.popularity.filter((r) => ids.includes(r.framework_id) && r.metric === 'so_usage_all');
    return spec(page, 'so-usage', {
      type: 'bar', title: 'Stack Overflow Developer Survey 2025: framework usage', seriesName: 'Share of respondents who used it (2025)',
      desc: 'Share of all respondents to the web frameworks question who used each framework in the past year (2025 edition, the latest with this question).',
      xLabel: 'Respondents who used the framework (%)', yLabel: 'Framework', valueFormat: pct,
      items: barItems(data, ids, (id) => pop(data, id, 'so_usage_all')), footer: footer(data, rows, 'n = 23,678 respondents'),
    }, ids.map((id) => pop(data, id, 'so_usage_all')));
  };
}
function soAdmiredDesired(page) {
  return (data) => {
    const ids = [...pageIds(data, page)].filter((id) => pop(data, id, 'so_admired') !== null).sort((a, b) => pop(data, b, 'so_admired') - pop(data, a, 'so_admired'));
    const rows = data.popularity.filter((r) => ids.includes(r.framework_id) && ['so_admired', 'so_desired'].includes(r.metric));
    return spec(page, 'so-admired-desired', {
      type: 'groupedbar', width: 960, title: 'Stack Overflow Developer Survey 2025: admired and desired',
      desc: 'Admired: share of the framework\'s users who want to keep using it. Desired: share of all respondents who want to use it next year.',
      xLabel: 'Framework (sorted by admired)', yLabel: 'Respondents (%)', categories: ids.map((id) => nameOf(data, id)), valueFormat: (v) => String(Math.round(v)),
      series: [{ name: 'Admired (% of its users)', values: ids.map((id) => pop(data, id, 'so_admired')) }, { name: 'Desired (% of all respondents)', values: ids.map((id) => pop(data, id, 'so_desired')) }],
      footer: footer(data, rows),
    }, ids.map((id) => pop(data, id, 'so_admired')));
  };
}
function historyLine(page, file, metric, ids, { title, desc, yLabel, unitNote = '' }) {
  return (data) => {
    const rows = data['popularity-history'].filter((r) => r.metric === metric && ids.includes(r.framework_id));
    const present = ids.filter((id) => rows.some((r) => r.framework_id === id && num(r.value) !== null)).slice(0, MAX_SERIES);
    const series = present.map((id) => ({ name: nameOf(data, id), points: rows.filter((r) => r.framework_id === id).map((r) => ({ x: decimalYear(r.period), y: num(r.value) })).sort((a, b) => a.x - b.x) }));
    return spec(page, file, {
      type: 'line', width: 860, title, desc, xLabel: 'Year', yLabel, series, xFormat: (v) => String(Math.round(v)),
      footer: footer(data, rows, unitNote),
    }, rows.map((r) => num(r.value)));
  };
}

// ---------------------------------------------------------------- JetBrains
function jetbrains(page, langs) {
  return (data) => {
    const rows = data['popularity-history'].filter((r) => r.period === '2023' && r.metric.startsWith('jetbrains_share') && pageIds(data, page).has(r.framework_id));
    const panels = langs.map((lang) => {
      const lr = rows.filter((r) => r.unit === `% of ${lang} developers`).sort((a, b) => (num(b.value) ?? -1) - (num(a.value) ?? -1));
      return { title: `${lang} developers (2023)`, note: lr[0] ? lr[0].population.split(';')[1]?.trim() : '', items: lr.map((r) => ({ label: `${nameOf(data, r.framework_id)}${r.metric.includes('blazor_server') ? ' Server' : r.metric.includes('blazor_wasm') ? ' WebAssembly' : ''}`, index: 0, value: num(r.value) })) };
    }).filter((p) => p.items.length);
    return spec(page, 'jetbrains-share', {
      type: 'panelbars', width: 860, title: 'JetBrains State of Developer Ecosystem 2023: framework use within each language',
      desc: 'Each panel is a different population (the respondents who use that language), so panels have their own axis and are not comparable with each other.',
      xLabel: 'Respondents of that language who use the framework (%)', legendNames: ['Share within the language (2023)'], panels,
      footer: footer(data, rows, 'The 2024 and 2025 editions publish no per-language framework charts'),
    }, rows.map((r) => num(r.value)));
  };
}

// ---------------------------------------------------------------- downloads
function npmMonthly(page, file, ids, title) {
  return (data) => {
    const rows = data['downloads-npm'].filter((r) => r.primary === 'yes' && r.period === 'month' && ids.includes(r.framework_id));
    const series = ids.slice(0, MAX_SERIES).map((id) => ({ name: nameOf(data, id), points: rows.filter((r) => r.framework_id === id).map((r) => ({ x: decimalYear(r.period_start), y: num(r.value) === null ? null : num(r.value) / 1e6 })) }));
    return spec(page, file, {
      type: 'line', width: 900, title, desc: 'npm downloads per calendar month, in millions. Months for which the npm API returned no data for some days are gaps (n/a), never zero.',
      xLabel: 'Month', yLabel: 'Downloads per month (millions, npm only)', series, xFormat: (v) => String(Math.round(v)),
      footer: footer(data, rows, 'npm counts include CI and mirrors and are only compared with other npm packages'),
    }, rows.map((r) => num(r.value)));
  };
}
function registryBar(page, file, registry, period, { title, xLabel, note }) {
  return (data) => {
    const ids = pageIds(data, page);
    const rows = data[registry].filter((r) => r.primary === 'yes' && r.period === period && ids.has(r.framework_id));
    const items = barItems(data, rows.map((r) => r.framework_id), (id) => { const v = num(rows.find((r) => r.framework_id === id)?.value); return v === null ? null : v / 1e6; });
    return spec(page, file, {
      type: 'bar', title, desc: `${title}. ${note}`, seriesName: xLabel, xLabel, yLabel: 'Framework (package)', valueFormat: (v) => `${Math.round(v * 10) / 10}M`,
      items, footer: footer(data, rows, note),
    }, items.map((i) => i.value));
  };
}
function packagistMonthly(page, ids) {
  return (data) => {
    const rows = data['downloads-packagist'].filter((r) => r.primary === 'yes' && r.period === 'month' && ids.includes(r.framework_id));
    const series = ids.map((id) => ({ name: nameOf(data, id), points: rows.filter((r) => r.framework_id === id).map((r) => ({ x: decimalYear(r.period_start), y: num(r.value) === null ? null : num(r.value) / 1000 })) }));
    return spec(page, 'downloads-packagist-monthly', {
      type: 'line', width: 900, title: 'Packagist: average daily downloads per month',
      desc: 'Average daily installs per month as published by Packagist (thousands). Symfony is the symfony/framework-bundle package.',
      xLabel: 'Month', yLabel: 'Average daily downloads (thousands, Packagist only)', series, xFormat: (v) => String(Math.round(v)),
      footer: footer(data, rows),
    }, rows.map((r) => num(r.value)));
  };
}
function otherRegistries(page) {
  return (data) => {
    const ids = pageIds(data, page);
    const panel = (file, period, title, note) => {
      const rows = data[file].filter((r) => r.period === period && ids.has(r.framework_id));
      return { rows, panel: { title, note, items: rows.map((r) => ({ label: `${nameOf(data, r.framework_id)} (${r.package})`, index: 0, value: num(r.value) === null ? null : num(r.value) / 1e6 })).sort((a, b) => (b.value ?? -1) - (a.value ?? -1)) } };
    };
    const parts = [
      panel('downloads-nuget', 'total', 'NuGet: total downloads', 'Packages related to ASP.NET; the ASP.NET Core runtime ships with the .NET SDK, so App.Ref is a proxy'),
      panel('downloads-crates', 'last-90-days', 'crates.io: downloads in the last 90 days', ''),
      panel('downloads-hex', 'last-90-days', 'Hex: downloads in the last 90 days', ''),
      panel('downloads-rubygems', 'total', 'RubyGems: total downloads', ''),
    ].filter((p) => p.panel.items.length);
    const rows = parts.flatMap((p) => p.rows);
    return spec(page, 'downloads-other', {
      type: 'panelbars', width: 860, title: 'Downloads on other registries (each panel has its own unit and axis)',
      desc: 'NuGet and RubyGems publish only totals; crates.io and Hex publish recent downloads. Registries are never compared on one axis.',
      xLabel: 'Downloads (millions)', legendNames: ['Downloads'], valueFormat: (v) => `${Math.round(v * 10) / 10}M`, panels: parts.map((p) => p.panel),
      footer: footer(data, rows),
    }, rows.map((r) => num(r.value)));
  };
}
function pypiBar(page) {
  return registryBar(page, 'downloads-pypi', 'downloads-pypi', 'last-30-days', { title: 'PyPI downloads in the last 30 days', xLabel: 'Downloads in the last 30 days (millions, PyPI only)', note: 'pypistats recent endpoint; PyPI history beyond 180 days is not available without BigQuery' });
}

// ---------------------------------------------------------------- GitHub, jobs
function stars(page) {
  return (data) => {
    const ids = [...pageIds(data, page)];
    const rows = data.github.filter((r) => ids.includes(r.framework_id) && num(r.stars) !== null);
    const items = barItems(data, rows.map((r) => r.framework_id), (id) => num(rows.find((r) => r.framework_id === id).stars) / 1000);
    return spec(page, 'github-stars', {
      type: 'bar', title: 'GitHub stars of the main repository', seriesName: 'Stars (thousands)', desc: 'GitHub stars as published by deps.dev. Stars over time are not shown: the GitHub API was not reachable from the authoring environment.',
      xLabel: 'Stars (thousands)', yLabel: 'Framework', valueFormat: (v) => `${Math.round(v * 10) / 10}k`, items, footer: footer(data, rows),
    }, items.map((i) => i.value));
  };
}
function jobsHistory(page, ids) {
  return (data) => {
    const rows = data['jobs-history'].filter((r) => ids.includes(r.framework_id));
    const series = ids.slice(0, MAX_SERIES).map((id) => ({ name: nameOf(data, id), points: rows.filter((r) => r.framework_id === id).map((r) => ({ x: Number(r.year), y: num(r.value) })) }));
    return spec(page, 'jobs-history', {
      type: 'line', width: 860, title: 'Job demand: share of Hacker News "Who is hiring?" postings that mention the framework',
      desc: 'Share of top-level comments in the monthly "Ask HN: Who is hiring?" threads that match the framework\'s pattern (patterns in NOTES.md). 2026 covers January to October.',
      xLabel: 'Year', yLabel: 'Postings mentioning the framework (%)', series, xFormat: (v) => String(Math.round(v)),
      footer: footer(data, rows, 'Hacker News postings lean towards start-ups and remote work'),
    }, rows.map((r) => num(r.value)));
  };
}
function talentJobs(page) {
  return (data) => {
    const ids = pageIds(data, page);
    const rows = data.jobs.filter((r) => ids.has(r.framework_id) && ['talent_pool_so_usage_prof', 'hn_mention_share'].includes(r.metric) && (r.metric !== 'hn_mention_share' || r.period === '2025'));
    const panel = (metric, title, note) => ({ title, note, items: rows.filter((r) => r.metric === metric).map((r) => ({ label: nameOf(data, r.framework_id), index: 0, value: num(r.value) })).sort((a, b) => (b.value ?? -1) - (a.value ?? -1)) });
    return spec(page, 'talent-jobs', {
      type: 'panelbars', width: 860, title: 'Talent pool and job demand',
      desc: 'Talent pool: share of professional developers in the Stack Overflow 2025 survey who used the framework. Job demand: share of 2025 Hacker News "Who is hiring?" postings that mention it.',
      xLabel: 'Percent', legendNames: ['Share (%)'], panels: [panel('talent_pool_so_usage_prof', 'Talent pool: professional developers who used it (Stack Overflow 2025)', ''), panel('hn_mention_share', 'Job demand: Hacker News "Who is hiring?" 2025 postings', 'Patterns in NOTES.md; frameworks with common-word names are not counted')],
      footer: footer(data, rows),
    }, rows.map((r) => num(r.value)));
  };
}

// ---------------------------------------------------------------- performance (backend)
function tfbFortunes(page) {
  return (data) => {
    const ids = [...pageIds(data, page)];
    const rows = data['performance-techempower'].filter((r) => r.round === '23' && r.test === 'fortunes' && ids.includes(r.framework_id));
    const have = ids.filter((id) => rows.some((r) => r.framework_id === id && num(r.rps) !== null));
    const items = barItems(data, have, (id) => fortunesRps(data, id) / 1000);
    return spec(page, 'techempower-fortunes', {
      type: 'bar', title: 'TechEmpower round 23: fortunes test (database query and HTML template)', seriesName: 'Responses per second (thousands), best variant',
      desc: 'Best responses per second of each framework\'s implementations in round 23 (Citrine hardware, January 2025, the last round). Highly tuned implementations; not typical applications.',
      xLabel: 'Responses per second (thousands)', yLabel: 'Framework', valueFormat: (v) => `${Math.round(v)}k`, items, footer: footer(data, rows, 'Frameworks without a fortunes implementation in round 23 are not listed'),
    }, items.map((i) => i.value));
  };
}
function tfbTests(page, ids) {
  return (data) => {
    const rows = data['performance-techempower'].filter((r) => r.round === '23' && ids.includes(r.framework_id));
    const TESTS = [['json', 'JSON serialization'], ['single_query', 'Single query'], ['multiple_queries', 'Multiple queries (20 per request)'], ['fortunes', 'Fortunes'], ['plaintext', 'Plaintext (pipelined)']];
    const panels = TESTS.map(([t, title]) => ({ title, items: ids.map((id) => { const v = bestRps(data, id, t); return { label: nameOf(data, id), index: 0, value: v === null ? null : v / 1000 }; }).sort((a, b) => (b.value ?? -1) - (a.value ?? -1)) }));
    return spec(page, 'techempower-tests', {
      type: 'panelbars', width: 860, title: 'TechEmpower round 23 by test type (thousands of responses per second, best variant)',
      desc: 'Each test has its own axis because plaintext and JSON results are orders of magnitude higher than database tests.',
      xLabel: 'Responses per second (thousands)', legendNames: ['Responses per second (thousands)'], valueFormat: (v) => `${Math.round(v)}k`, panels,
      footer: footer(data, rows),
    }, rows.map((r) => num(r.rps)));
  };
}
function tfbRounds(page, ids) {
  return (data) => {
    const rows = data['performance-techempower'].filter((r) => r.test === 'fortunes' && ids.includes(r.framework_id));
    const series = ids.slice(0, MAX_SERIES).map((id) => ({ name: nameOf(data, id), points: [...new Set(rows.map((r) => r.round))].map((round) => { const v = rows.filter((r) => r.framework_id === id && r.round === round && r.variant !== 'native').map((r) => num(r.rps)).filter((x) => x !== null); return { x: Number(round), y: v.length ? Math.max(...v) / 1000 : null }; }).sort((a, b) => a.x - b.x) }));
    return spec(page, 'techempower-rounds', {
      type: 'line', width: 860, title: 'TechEmpower fortunes test across rounds 16 to 23 (JIT implementations)',
      desc: 'Best fortunes result per round. Rounds 16 to 23 ran on the same Citrine environment (2018 to 2025); implementations changed between rounds. Missing points mean no result in that round.',
      xLabel: 'TechEmpower round', yLabel: 'Responses per second (thousands)', series, xFormat: (v) => `R${Math.round(v)}`, yZero: true,
      footer: footer(data, rows),
    }, rows.map((r) => num(r.rps)));
  };
}
function startupMemory(page) {
  return (data) => {
    const rows = data['performance-startup-memory'].filter((r) => num(r.value) !== null);
    const label = (r) => `${nameOf(data, r.framework_id)} ${{ jit: 'JIT', native: 'native', 'jlink-jit': 'JLink JVM', 'jlink-aot-cache': 'AOT cache' }[r.variant] ?? r.variant}`;
    const panel = (src, metric, title, note) => ({ title, note, items: rows.filter((r) => r.source === src && r.metric === metric).map((r) => ({ label: label(r), index: r.variant.includes('jit') ? 0 : 1, value: num(r.value) })) });
    const panels = [
      panel('quarkus-perf-comparison', 'boot_and_first_response_ms', 'Boot and first response (ms), Quarkus team comparison', 'Vendor-reported for Quarkus, published by a competitor for Spring Boot; same hardware and method (2026-06-02)'),
      panel('quarkus-perf-comparison', 'rss_after_first_request_mib', 'Memory: RSS after the first request (MiB), Quarkus team comparison', ''),
      panel('micronaut-home', 'startup_ms', 'Micronaut startup (ms), vendor-reported on micronaut.io', 'No method or hardware published'),
      panel('micronaut-home', 'memory_mb', 'Micronaut memory (MB), vendor-reported on micronaut.io', ''),
      panel('helidon-home', 'startup_ms', 'Helidon startup (ms), vendor-reported on helidon.io', 'No method or hardware published'),
      panel('helidon-home', 'memory_mb', 'Helidon memory footprint (MB), vendor-reported on helidon.io', ''),
    ].filter((p) => p.items.length);
    return spec(page, 'startup-memory', {
      type: 'panelbars', width: 860, title: 'Startup time and memory: published figures only (lower is better)',
      desc: 'JIT and native (GraalVM) or AOT variants side by side. Each panel is one publisher and one metric with its own axis; figures from different publishers are not comparable. No house measurements were made.',
      xLabel: 'Milliseconds or megabytes (see each panel)', legendNames: ['JIT (JVM)', 'Native or AOT'], valueFormat: (v) => fmtInt(v), panels,
      footer: footer(data, rows),
    }, rows.map((r) => num(r.value)));
  };
}

// ---------------------------------------------------------------- web performance
function webPanels(page, file, title, desc, metrics, valueFormat) {
  return (data) => {
    const ids = pageIds(data, page);
    const rows = data['performance-web'].filter((r) => ids.has(r.framework_id) && metrics.some(([m]) => m === r.metric));
    const panels = metrics.map(([m, ptitle, note]) => ({ title: ptitle, note, items: rows.filter((r) => r.metric === m).map((r) => ({ label: nameOf(data, r.framework_id), index: 0, value: num(r.value) })).sort((a, b) => (a.value ?? Infinity) - (b.value ?? Infinity)) }));
    return spec(page, file, { type: 'panelbars', width: 860, title, desc, xLabel: 'See each panel (lower is better)', legendNames: ['Value'], valueFormat, panels, footer: footer(data, rows, 'js-framework-benchmark: Chrome 156.0.8078.48, keyed implementations') }, rows.map((r) => num(r.value)));
  };
}
function cwvBar(page) {
  return (data) => {
    const ids = pageIds(data, page);
    const rows = data['performance-web'].filter((r) => ids.has(r.framework_id) && r.metric === 'cwv_good_mobile_pct');
    const items = barItems(data, rows.map((r) => r.framework_id), (id) => num(rows.find((r) => r.framework_id === id).value));
    return spec(page, 'core-web-vitals', {
      type: 'bar', title: 'Core Web Vitals: share of origins with good LCP, CLS and INP on mobile (2026-09)', seriesName: 'Origins with good Core Web Vitals (%)',
      desc: 'HTTP Archive Core Web Vitals Technology Report, September 2026 crawl. Depends on how sites are built and hosted, not only on the framework.',
      xLabel: 'Origins passing all Core Web Vitals on mobile (%)', yLabel: 'Technology', valueFormat: pct, items, footer: footer(data, rows),
    }, items.map((i) => i.value));
  };
}
function originsBar(page) {
  return (data) => {
    const ids = pageIds(data, page);
    const rows = data.popularity.filter((r) => ids.has(r.framework_id) && r.metric === 'httparchive_origins_mobile');
    const items = barItems(data, rows.map((r) => r.framework_id), (id) => { const v = num(rows.find((r) => r.framework_id === id).value); return v === null ? null : v / 1000; });
    return spec(page, 'httparchive-origins', {
      type: 'bar', title: 'Usage on live websites: origins detected in the HTTP Archive mobile crawl (2026-09)', seriesName: 'Origins (thousands)',
      desc: 'Number of origins on which HTTP Archive (Wappalyzer rules) detects the technology.', xLabel: 'Origins (thousands)', yLabel: 'Technology', valueFormat: (v) => `${fmtInt(v)}k`, items, footer: footer(data, rows),
    }, items.map((i) => i.value));
  };
}
function w3techs(page) {
  return (data) => {
    const rows = data.popularity.filter((r) => r.metric === 'w3techs_sites_pct');
    const panel = (src, title) => ({ title, items: rows.filter((r) => r.source === src).map((r) => ({ label: nameOf(data, r.framework_id), index: 0, value: num(r.value) })).sort((a, b) => (b.value ?? -1) - (a.value ?? -1)) });
    return spec(page, 'w3techs', {
      type: 'panelbars', width: 860, title: 'Share of websites using each library or CSS framework (W3Techs, 2026-10-27)', desc: 'Percentage of the top 10 million websites monitored by W3Techs.',
      xLabel: 'Websites (%)', legendNames: ['Websites (%)'], panels: [panel('w3techs-js', 'JavaScript libraries'), panel('w3techs-css', 'CSS frameworks')], footer: footer(data, rows),
    }, rows.map((r) => num(r.value)));
  };
}
function cssFrameworks(page) {
  return (data) => {
    const ids = RADAR_GROUPS.web.find((g) => g.id === 'css').members;
    const dl = data['downloads-npm'].filter((r) => r.primary === 'yes' && r.period === 'last-12-months' && ids.includes(r.framework_id));
    const size = data['performance-web'].filter((r) => r.metric === 'css_min_gzip_kb' && ids.includes(r.framework_id));
    const or = data.popularity.filter((r) => r.metric === 'httparchive_origins_mobile' && ids.includes(r.framework_id));
    // Higher-is-better panels list the largest value first; lower-is-better panels (stylesheet size) the smallest, n/a last.
    const items = (rows, f, lowerIsBetter = false) => rows.map((r) => ({ label: nameOf(data, r.framework_id), index: 0, value: f(num(r.value)) }))
      .sort((a, b) => (lowerIsBetter ? (a.value ?? Infinity) - (b.value ?? Infinity) : (b.value ?? -1) - (a.value ?? -1)));
    const rows = [...dl, ...size, ...or];
    return spec(page, 'css-frameworks', {
      type: 'panelbars', width: 860, title: 'CSS frameworks: downloads, usage on websites and stylesheet size',
      desc: 'npm downloads in the 12 months to 2026-06, origins detected by HTTP Archive (2026-09) and the size of the distributed stylesheet. Tailwind CSS generates its stylesheet per project, so its size is n/a.',
      xLabel: 'See each panel', legendNames: ['Value'], valueFormat: (v) => String(Math.round(v * 10) / 10),
      panels: [{ title: 'npm downloads, 12 months to 2026-06 (millions)', items: items(dl, (v) => (v === null ? null : v / 1e6)) }, { title: 'Origins in the HTTP Archive mobile crawl (thousands)', items: items(or, (v) => (v === null ? null : v / 1000)) }, { title: 'Distributed stylesheet, min+gzip (kB, lower is better)', items: items(size, (v) => v, true) }],
      footer: footer(data, rows),
    }, rows.map((r) => num(r.value)));
  };
}

// ---------------------------------------------------------------- security
function advisories(page, ids) {
  return (data) => {
    const rows = data.security.filter((r) => r.metric === 'advisories' && ids.includes(r.framework_id) && Number(r.period) >= 2016);
    const series = ids.slice(0, MAX_SERIES).map((id) => ({ name: nameOf(data, id), points: rows.filter((r) => r.framework_id === id).map((r) => ({ x: Number(r.period), y: num(r.value) })) }));
    return spec(page, 'advisories', {
      type: 'line', width: 860, title: 'Security advisories per year (OSV.dev, deduplicated by CVE)',
      desc: 'Advisories affecting the framework\'s main packages per year (CVE year, or first publication without a CVE). More code and more active disclosure mean more advisories; a low count is not proof of security. 2026 is to date.',
      xLabel: 'Year', yLabel: 'Advisories', series, xFormat: (v) => String(Math.round(v)), footer: footer(data, rows, 'Packages per framework are listed in security.csv'),
    }, rows.map((r) => num(r.value)));
  };
}

// ---------------------------------------------------------------- scores: scatter, radar, matrix
function scatter(page, file, xAxis, yAxis, title, desc) {
  return (data) => {
    const scores = computeScores(data);
    const key = page;
    const groups = RADAR_GROUPS[page].filter((g) => g.id !== 'mainstream' && g.id !== 'css');
    const series = groups.map((g) => ({ name: g.title, points: g.members.map((id) => ({ x: scores[key][id]?.[xAxis] ?? null, y: scores[key][id]?.[yAxis] ?? null, label: nameOf(data, id), weight: scores[key][id]?.popularity ?? 0 })) }));
    const all = series.flatMap((s) => s.points);
    return spec(page, file, {
      type: 'scatter', width: 900, height: 560, title, desc, xLabel: `${axisLabel(xAxis)} score 0-10`, yLabel: `${axisLabel(yAxis)} score 0-10`, xExtent: [0, 11.5], yExtent: [0, 10],
      series, footer: footer(data, ['editorial', 'so-2025', 'npm-downloads', 'techempower-r23', 'state-of-js'], 'C = computed axis, E = editorial axis (NOTES.md); frameworks without one of the two scores are not plotted'),
    }, all.map((p) => (p.x === null || p.y === null ? null : p.x)));
  };
}
/** Sources behind each radar's scores (computed inputs plus the editorial basis). */
const RADAR_SOURCES = {
  backend: ['editorial', 'so-2023', 'so-2025', 'state-of-js', 'npm-downloads', 'pypistats', 'packagist', 'nuget-search', 'crates-io', 'hex', 'rubygems', 'deps-dev', 'hn-whoishiring', 'techempower-r23', 'quarkus-perf-comparison'],
  web: ['editorial', 'so-2023', 'so-2025', 'state-of-js', 'npm-downloads', 'deps-dev', 'httparchive-techreport', 'hn-whoishiring', 'js-framework-benchmark'],
  css: ['editorial', 'npm-downloads', 'deps-dev', 'httparchive-techreport', 'w3techs-css', 'jsdelivr'],
};
function radar(page, group) {
  return (data) => {
    const scores = computeScores(data);
    const key = group.id === 'css' ? 'css' : page;
    const vals = radarValues(scores, page, group);
    return spec(page, `radar-${group.id}`, {
      type: 'radar', width: 760, title: `Radar: ${group.title}`, desc: `Scores 0-10 per axis for ${group.members.map((id) => nameOf(data, id)).join(', ')}. (C) computed from the data, (E) editorial with a written basis (radar-scores.csv). Gaps mean n/a.`,
      axes: AXES[key].map(axisLabel), series: vals.map((v) => ({ name: nameOf(data, v.id), values: v.values })),
      footer: footer(data, RADAR_SOURCES[key], 'Formulas and rubric in scripts/framework-charts/data/NOTES.md'),
    }, vals.flatMap((v) => v.values));
  };
}
const FIT = { best: ['#1a7f37', 1, 'Best fit'], good: ['#4ac26b', 0.55, 'Good fit'], acceptable: ['#bf8700', 0.45, 'Acceptable'] };
function matrix(page) {
  return (data) => {
    const rows = data.recommendations.filter((r) => r.page === page);
    const purposes = [...new Set(rows.map((r) => r.purpose))];
    const fws = [...new Set(rows.map((r) => r.framework_id))];
    return spec(page, 'recommendation-matrix', {
      type: 'grid', width: 980, cellW: 72, labelW: 230, title: `Recommendation matrix: ${page === 'backend' ? 'backend' : 'web'} framework fit by purpose`,
      desc: 'Editorial fit of each framework for each purpose; every cell has a basis in recommendations.csv. An empty cell means the framework is not recommended for that purpose on this page.',
      corner: 'Purpose', columns: fws.map((id) => ({ label: nameOf(data, id) })),
      legend: Object.values(FIT).map(([fill, o, label]) => ({ label, fill })).concat([{ label: 'Not listed', fill: '#ffffff', glyph: 'na' }]),
      groups: [{ rows: purposes.map((p) => ({ label: p, cells: fws.map((id) => { const r = rows.find((x) => x.purpose === p && x.framework_id === id); if (!r) return { fill: '#ffffff', glyph: 'na', tip: `${p}: ${nameOf(data, id)} not listed` }; const [fill, o, label] = FIT[r.fit]; return { fill, fillOpacity: o, text: label.split(' ')[0], tip: `${label}: ${r.basis}` }; }) })) }],
      footer: footer(data, rows, 'Editorial recommendations based on the data on this page'),
    }, [1]);
  };
}

// ---------------------------------------------------------------- builder lists
const B = 'backend';
const W = 'web';
const BACKEND = [
  timeline(B), soUsage(B), soAdmiredDesired(B),
  historyLine(B, 'so-usage-history', 'so_usage_all', ['spring-boot', 'aspnet-core', 'express', 'django', 'flask', 'fastapi', 'laravel', 'rails'], { title: 'Stack Overflow survey: usage per year, 2019 to 2025', desc: 'Share of respondents to the web frameworks question who used the framework. "Spring" (2019-2021) and "Spring Boot" (2023-2025) are shown as one series; no Spring answer in 2022.', yLabel: 'Respondents who used it (%)' }),
  historyLine(B, 'sojs-usage-history', 'sojs_usage', ['express', 'nestjs', 'fastify', 'koa', 'hono', 'adonisjs', 'elysia'], { title: 'State of JS: back-end framework usage per year', desc: 'Share of State of JS respondents to each question who have used the framework.', yLabel: 'Respondents who used it (%)' }),
  jetbrains(B, ['Java', 'PHP', 'Python', 'C#', 'Go', 'Scala', 'Ruby']),
  npmMonthly(B, 'downloads-npm-monthly', ['express', 'nestjs', 'fastify', 'koa', 'hono', 'adonisjs', 'elysia'], 'npm downloads per month: Node.js and TypeScript back-end frameworks'),
  registryBar(B, 'downloads-npm', 'downloads-npm', 'last-12-months', { title: 'npm downloads, 12 months to 2026-06', xLabel: 'Downloads (millions, npm only)', note: 'Window ends 2026-06 because the npm API has no-data days in July to September 2026' }),
  pypiBar(B), packagistMonthly(B, ['laravel', 'symfony', 'slim', 'codeigniter', 'cakephp', 'laminas']), otherRegistries(B), stars(B),
  jobsHistory(B, ['spring-boot', 'aspnet-core', 'django', 'fastapi', 'flask', 'rails', 'laravel', 'nestjs']), talentJobs(B),
  tfbFortunes(B), tfbTests(B, ['spring-boot', 'quarkus', 'micronaut', 'aspnet-core', 'nestjs', 'django', 'fastapi', 'laravel', 'symfony', 'rails', 'gin', 'fiber', 'phoenix']),
  tfbRounds(B, ['spring-boot', 'aspnet-core', 'django', 'laravel', 'rails', 'gin', 'phoenix', 'fastapi']), startupMemory(B),
  advisories(B, ['spring-boot', 'aspnet-core', 'django', 'rails', 'laravel', 'symfony', 'express', 'fastify']),
  scatter(B, 'scatter-popularity-growth', 'popularity', 'growth', 'Popularity against growth', 'Computed popularity (x) against computed growth (y). Upper right: established and rising; lower right: established and plateauing; upper left: small and rising.'),
  scatter(B, 'scatter-performance-ease', 'ease_of_use', 'performance', 'Performance against ease of use', 'Editorial ease of use (x) against computed performance (y): mean of throughput, memory and startup where available.'),
  ...RADAR_GROUPS.backend.map((g) => radar(B, g)), matrix(B),
];
const WEB = [
  timeline(W), soUsage(W), soAdmiredDesired(W),
  historyLine(W, 'so-usage-history', 'so_usage_all', ['react', 'angular', 'vue', 'jquery', 'nextjs', 'svelte', 'angularjs', 'blazor'], { title: 'Stack Overflow survey: usage per year, 2019 to 2025', desc: 'Share of respondents to the web frameworks question who used the framework. 2019 counted Angular and AngularJS as one answer.', yLabel: 'Respondents who used it (%)' }),
  historyLine(W, 'sojs-usage-history', 'sojs_usage', ['react', 'vue', 'angular', 'svelte', 'preact', 'solid', 'alpine', 'htmx'], { title: 'State of JS: front-end framework usage per year, 2016 to 2025', desc: 'Share of State of JS respondents to each question who have used the framework.', yLabel: 'Respondents who used it (%)' }),
  historyLine(W, 'sojs-meta-usage-history', 'sojs_usage', ['nextjs', 'nuxt', 'sveltekit', 'astro', 'remix'], { title: 'State of JS: meta-framework usage per year', desc: 'Share of State of JS respondents to each question who have used the meta-framework.', yLabel: 'Respondents who used it (%)' }),
  historyLine(W, 'sojs-retention-history', 'sojs_retention', ['react', 'vue', 'angular', 'svelte', 'nextjs', 'astro', 'solid', 'htmx'], { title: 'State of JS: retention per year (users who would use it again)', desc: 'Share of users of the framework with a positive sentiment (would use again).', yLabel: 'Retention (%)' }),
  jetbrains(W, ['JavaScript', 'C#']),
  npmMonthly(W, 'downloads-npm-monthly-ui', ['react', 'vue', 'angular', 'svelte', 'jquery', 'preact', 'solid', 'lit'], 'npm downloads per month: client-side UI frameworks'),
  npmMonthly(W, 'downloads-npm-monthly-meta', ['nextjs', 'nuxt', 'sveltekit', 'astro', 'remix', 'angular-ssr', 'qwik', 'htmx'], 'npm downloads per month: meta-frameworks and newer libraries'),
  registryBar(W, 'downloads-npm', 'downloads-npm', 'last-12-months', { title: 'npm downloads, 12 months to 2026-06', xLabel: 'Downloads (millions, npm only)', note: 'Window ends 2026-06 because the npm API has no-data days in July to September 2026' }),
  originsBar(W),
  historyLine(W, 'httparchive-history', 'httparchive_origins_mobile', ['react', 'jquery', 'vue', 'nextjs', 'angular', 'svelte', 'astro', 'htmx'], { title: 'Usage on live websites over time (HTTP Archive mobile origins, January of each year)', desc: 'Origins on which HTTP Archive detects the technology, January 2020 to 2026 and September 2026.', yLabel: 'Origins' }),
  w3techs(W), stars(W),
  jobsHistory(W, ['react', 'angular', 'vue', 'nextjs', 'svelte', 'jquery', 'tailwind', 'htmx']), talentJobs(W),
  webPanels(W, 'js-framework-benchmark', 'js-framework-benchmark: runtime performance and memory (lower is better)', 'Weighted geometric mean of the CPU benchmarks and geometric mean of the memory benchmarks, as slowdown factors relative to the fastest keyed implementation (1 = fastest), and first paint in ms.', [['jsfb_cpu_weighted_geomean', 'CPU: weighted geometric mean (factor)', ''], ['jsfb_memory_geomean', 'Memory: geometric mean (factor)', ''], ['jsfb_first_paint_ms', 'First paint (ms)', '']], (v) => String(Math.round(v * 100) / 100)),
  webPanels(W, 'bundle-size', 'Bundle size (lower is better)', 'Compressed size of the same minimal benchmark application (brotli) and min+gzip size of the runtime package (Bundlephobia).', [['jsfb_size_compressed_kb', 'Benchmark app, all files, brotli (kB)', ''], ['runtime_min_gzip_kb', 'Runtime package entry point, min+gzip (kB)', 'React is n/a: the react-dom entry point excludes the client renderer']], (v) => String(Math.round(v * 10) / 10)),
  cwvBar(W), cssFrameworks(W),
  advisories(W, ['react', 'angular', 'vue', 'nextjs', 'nuxt', 'svelte', 'jquery', 'angularjs']),
  scatter(W, 'scatter-popularity-growth', 'popularity', 'growth', 'Popularity against growth', 'Computed popularity (x) against computed growth (y) for the web frameworks in the radar groups.'),
  scatter(W, 'scatter-performance-ease', 'ease_of_use', 'performance', 'Performance against ease of use', 'Editorial ease of use (x) against computed performance (y): runtime performance, bundle size and Core Web Vitals where available.'),
  ...RADAR_GROUPS.web.map((g) => radar(W, g)), matrix(W),
];
export const CHART_BUILDERS = [...BACKEND, ...WEB];
