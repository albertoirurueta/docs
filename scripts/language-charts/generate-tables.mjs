#!/usr/bin/env node
// Dependency-free AsciiDoc table generator for the "Programming Languages Comparative" guide.
// Reads the CSVs in ./data and writes one partial per data table (plus the Bibliography) to
// modules/ROOT/partials/programming-languages-comparative/<name>.adoc, which the page includes.
// Usage: node scripts/language-charts/generate-tables.mjs [--out <dir>]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isMissing, toNumber } from './data-utils.mjs';
import { loadData } from './generate-charts.mjs';
import { firstYear } from './chart-definitions.mjs';
import { computeScores, domainScore, DOMAINS } from './scores.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_TABLES_DIR = resolve(HERE, '..', '..', 'modules', 'ROOT', 'partials', 'programming-languages-comparative');

/** Platforms cells longer than this get `; ` between list items, so the table does not grow past the page width. */
export const PLATFORM_JOIN_MIN_LENGTH = 24;

// ---------------------------------------------------------------- cell formatting

/** Escapes the characters that are markup inside a `+++` passthrough (raw HTML). */
export function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** A `+++...+++` passthrough of the trimmed text, so no AsciiDoc substitution touches it; missing shows `n/a`. */
export function pass(v) {
  return `+++${escapeHtml(isMissing(v) ? 'n/a' : String(v).trim())}+++`;
}

/** The trimmed value as written in the CSV (numbers keep their printed precision), or `n/a` when missing. */
export function raw(v) {
  return isMissing(v) ? 'n/a' : String(v).trim();
}

/** An integer with `,` thousands separators (`528060` -> `528,060`), or `n/a` when missing. */
export function thousands(v) {
  const n = toNumber(v);
  return n === null ? 'n/a' : String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** A score rounded to one decimal, or `n/a` for null. */
export function score(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v.toFixed(1) : 'n/a';
}

/** A link to the Bibliography entry of a source id (`<<src-id,id>>`), or `n/a` when missing. */
export function sourceLink(id) {
  return isMissing(id) ? 'n/a' : `<<src-${String(id).trim()},${String(id).trim()}>>`;
}

/** The language name, with `+` written as `{plus}`, as an xref to its page when the site documents it. */
export function languageCell(lang) {
  const name = String(lang.name).replace(/\+/g, '{plus}');
  return lang.documented === 'yes' && !isMissing(lang.xref) ? `xref:${lang.xref}[${name}]` : name;
}

/** A `;` separated list re-joined with `; `. */
export function joinList(v) {
  return isMissing(v) ? 'n/a' : String(v).split(';').map((s) => s.trim()).join('; ');
}

/**
 * A platforms cell: long infobox lists are re-joined with `; ` before each item that starts with a letter (an
 * unbroken `a;b;c` list cannot wrap and made the table 914px wide). Short lists and items starting with a digit or
 * `.` (`IA-32;64-bit`, `Mono;.NET`) are kept as listed.
 */
export function platformsCell(v) {
  if (isMissing(v)) return 'n/a';
  const s = String(v).trim();
  return s.length > PLATFORM_JOIN_MIN_LENGTH ? s.replace(/;(?=[A-Za-z])/g, '; ') : s;
}

/** Renders one AsciiDoc table block: caption, cols, header row, then one cell per line and a blank line per row. */
export function renderTable({ caption, cols, header, rows }) {
  const lines = [`.${caption}`, `[cols="${cols}",options="header"]`, '|===', `|${header.join(' |')}`, ''];
  for (const row of rows) lines.push(...row.map((c) => `|${c}`), '');
  lines.push('|===');
  return lines.join('\n');
}

// ---------------------------------------------------------------- data lookups

/** Map language_id -> row for the rows of `rows` that match `where`; the first match wins. */
function rowMap(rows, where) {
  const m = new Map();
  for (const r of rows ?? []) if (where(r) && !m.has(r.language_id)) m.set(r.language_id, r);
  return m;
}

const byMetric = (rows, metric) => rowMap(rows, (r) => r.metric === metric);
const value = (map, id, field = 'value') => map.get(id)?.[field];

// ---------------------------------------------------------------- tables

const SRC = (id, label) => `<<src-${id},${label}>>`;

/** First appearance and editorial group, sorted by year (then name); undated languages last. */
export function overviewTable(data) {
  const langs = [...data.languages].sort((a, b) => {
    const ya = firstYear(a.first_appeared);
    const yb = firstYear(b.first_appeared);
    if (ya !== yb) return ya === null ? 1 : yb === null ? -1 : ya - yb;
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
  return renderTable({
    caption: `First appearance and editorial group of every language. First appearance: ${SRC('wikipedia-timeline', 'Wikipedia timeline of programming languages')}, retrieved 2026-10-26. The group is an editorial classification used only to colour the charts.`,
    cols: '3,1,2,1',
    header: ['Language', 'First appeared', 'Editorial group', 'Documented on this site'],
    rows: langs.map((l) => [languageCell(l), pass(l.first_appeared), pass(l.group), raw(l.documented)]),
  });
}

/** TIOBE (with rank), PYPL and Stack Overflow 2026 usage and admired, per language. */
export function popularityTable(data) {
  const pc = data['popularity-current'];
  const pick = (source, metric) => rowMap(pc, (r) => r.source === source && r.metric === metric);
  const tiobe = pick('tiobe', 'rating');
  const pypl = pick('pypl', 'share');
  const usage = pick('so-survey-2026', 'so-usage');
  const admired = pick('so-survey-2026', 'so-admired');
  const tiobeCell = (id) => {
    const r = tiobe.get(id);
    if (!r || isMissing(r.value)) return 'n/a';
    return isMissing(r.rank) ? raw(r.value) : `${raw(r.value)} (#${raw(r.rank)})`;
  };
  return renderTable({
    caption: `Popularity indices. TIOBE: ${SRC('tiobe', 'TIOBE Index')}, October 2026. PYPL: ${SRC('pypl', 'PYPL')}, retrieved 2026-10-26 (C and C{plus}{plus} are one combined entry, never to be summed). Stack Overflow: ${SRC('so-survey-2026', 'Developer Survey 2026')}. n/a means the source does not list the language.`,
    cols: '3,2,1,1,1',
    header: ['Language', 'TIOBE rating, % (rank)', 'PYPL share, %', 'SO 2026 usage, %', 'SO 2026 admired, %'],
    rows: data.languages.map((l) => [languageCell(l), tiobeCell(l.id), raw(value(pypl, l.id)), raw(value(usage, l.id)),
      raw(value(admired, l.id))]),
  });
}

/** Languages with a recorded registry name: registry, package count, unit and source. */
export function registriesTable(data) {
  const names = byMetric(data.ecosystem, 'registry_name');
  const packages = byMetric(data.ecosystem, 'registry_packages');
  const rows = data.languages.filter((l) => !isMissing(value(names, l.id))).map((l) => {
    const p = packages.get(l.id) ?? {};
    return [languageCell(l), pass(value(names, l.id)), thousands(p.value), isMissing(p.unit) ? 'n/a' : pass(p.unit),
      sourceLink(isMissing(p.source) ? value(names, l.id, 'source') : p.source)];
  });
  return renderTable({
    caption: 'Package registries with a recorded name or count, 2026-10-25/26 snapshot. Counts of different registries are not directly comparable, because the unit differs (see the unit column); languages sharing a registry share its count. Languages not listed have no verified central registry count.',
    cols: '2,3,1,2,2',
    header: ['Language', 'Registry', 'Count', 'Counted unit', 'Source'],
    rows,
  });
}

/** Benchmarks Game CPU and memory ratios, Pereira et al. energy and the execution model. */
export function performanceTable(data) {
  const cpu = byMetric(data.performance, 'cpu_time_vs_fastest');
  const memory = byMetric(data.performance, 'memory_vs_fastest');
  const model = byMetric(data.performance, 'execution_model');
  const energy = rowMap(data.energy, () => true);
  return renderTable({
    caption: `CPU time and memory: ${SRC('benchmarks-game', 'Benchmarks Game')} 25.03 (measured 2025-03-05), derived by us as the geometric mean over 7 programs. Energy: ${SRC('pereira-2021', 'Pereira et al. 2021')}, Table 4 (C = 1.00). Execution model: the language documentation cited in the <<sec-bibliography,Bibliography>> (per-language sources are listed in the data files). Lower is better in the three numeric columns; n/a means not measured.`,
    cols: '2,1,1,1,5',
    header: ['Language', 'CPU time vs fastest', 'Memory vs lowest', 'Energy vs C', 'Execution model'],
    rows: data.languages.map((l) => [languageCell(l), raw(value(cpu, l.id)), raw(value(memory, l.id)),
      raw(value(energy, l.id, 'energy_normalized')), pass(value(model, l.id))]),
  });
}

/** Onboarding score, source size, learning-to-code usage and type system. */
export function learningTable(data) {
  const m = (metric) => byMetric(data.learning, metric);
  const [onboarding, size, usage, types] = ['onboarding_score', 'verbosity_gzip_bytes', 'so_learning_usage', 'type_system'].map(m);
  return renderTable({
    caption: `Learning-curve inputs. Onboarding score: our rubric over the official sites (checks listed in the <<sec-bibliography,Bibliography>> as onb-* sources), 2026-10-26. Source size: ${SRC('benchmarks-game', 'Benchmarks Game')} 25.03, geometric mean of gzip bytes of the benchmark programs (a verbosity proxy). Learning-to-code usage: ${SRC('so-survey-2025', 'Stack Overflow Developer Survey 2025')}. Type system: Wikipedia infobox of each language (${SRC('wikipedia', 'Wikipedia')}), retrieved 2026-10-26.`,
    cols: '2,1,1,1,4',
    header: ['Language', 'Onboarding score (0-10)', 'Source size, gzip bytes', 'SO 2025 learning-to-code usage, %', 'Type system'],
    rows: data.languages.map((l) => [languageCell(l), raw(value(onboarding, l.id)), raw(value(size, l.id)),
      raw(value(usage, l.id)), pass(value(types, l.id))]),
  });
}

/** Languages with a recorded memory-safety classification; the caption counts the others. */
export function memorySafetyTable(data) {
  const safety = byMetric(data.security, 'memory_safety');
  const langs = data.languages.filter((l) => !isMissing(value(safety, l.id)));
  const total = data.languages.length;
  return renderTable({
    caption: `Languages with a recorded memory-safety classification. The other ${total - langs.length} of the ${total} languages are n/a: the NSA June 2025 document that would classify them could not be retrieved (HTTP 403), and no classification is inferred.`,
    cols: '2,3,2,2',
    header: ['Language', 'Memory-safety classification', 'Source', 'Edition'],
    rows: langs.map((l) => {
      const r = safety.get(l.id);
      return [languageCell(l), pass(r.value), sourceLink(r.source), pass(r.edition)];
    }),
  });
}

/** Paradigms, purposes and platforms from the Wikipedia infobox and lead. */
export function versatilityTable(data) {
  const m = (metric) => byMetric(data.versatility, metric);
  const [paradigms, purposes, platforms] = ['paradigms', 'purposes', 'platforms'].map(m);
  return renderTable({
    caption: `Paradigms, purposes and platforms as listed in the Wikipedia article of each language (${SRC('wikipedia', 'Wikipedia')} and the per-language sources), retrieved 2026-10-26. The platforms text is the infobox entry as listed; n/a where the infobox gives none.`,
    cols: '2,4,4,3',
    header: ['Language', 'Paradigms', 'Purposes', 'Platforms'],
    rows: data.languages.map((l) => [languageCell(l), pass(joinList(value(paradigms, l.id))),
      pass(joinList(value(purposes, l.id))), pass(platformsCell(value(platforms, l.id)))]),
  });
}

/** Column headers of the versatility domains, in DOMAINS order. */
const DOMAIN_LABELS = {
  'web-frontend': 'Web front end', backend: 'Back end', mobile: 'Mobile', desktop: 'Desktop', embedded: 'Embedded',
  systems: 'Systems', 'data-ai': 'Data and AI', 'scientific-hpc': 'Scientific and HPC', mainframe: 'Mainframe',
};

/** The nine-domain versatility checklist (yes, no or n/a per domain) and the resulting score. */
export function domainsTable(data) {
  const rows = data['versatility-domains'] ?? [];
  const cell = new Map(rows.map((r) => [`${r.language_id}:${r.domain}`, r.value]));
  const count = (v) => rows.filter((r) => String(r.value).trim().toLowerCase() === v).length;
  const unscored = data.languages.filter((l) => domainScore(rows, l.id) === null).length;
  return renderTable({
    caption: `Application domains confirmed for each language, used for the Versatility axis: ${count('yes')} yes, ${count('no')} no and ${count('n/a')} n/a of ${rows.length} pairs, and ${unscored} of the ${data.languages.length} languages have too few known domains for a score. Every yes cites a source in \`scripts/language-charts/data/versatility-domains.csv\` (listed in the <<sec-bibliography,Bibliography>>), retrieved 2026-10-26; n/a means it could not be verified. Score: \`pass:c[10 * yes / 9]\`, a lower bound because n/a counts as not confirmed; n/a with fewer than five known domains.`,
    cols: ['2', ...DOMAINS.map(() => '1'), '1'].join(','),
    header: ['Language', ...DOMAINS.map((d) => DOMAIN_LABELS[d]), 'Score'],
    rows: data.languages.map((l) => [languageCell(l), ...DOMAINS.map((d) => raw(cell.get(`${l.id}:${d}`))),
      score(domainScore(rows, l.id))]),
  });
}

/** Stack Overflow 2024 median salary, highest first (ties by name); languages without a value are left out. */
export function salaryTable(data) {
  const salary = rowMap(data.jobs, (r) => r.source === 'so-survey-2024' && r.metric === 'so-median-salary');
  const langs = data.languages.filter((l) => toNumber(value(salary, l.id)) !== null)
    .map((l) => ({ l, v: toNumber(value(salary, l.id)) }))
    .sort((a, b) => b.v - a.v || (a.l.name < b.l.name ? -1 : a.l.name > b.l.name ? 1 : 0));
  return renderTable({
    caption: `Median annual salary of all respondents who work with the technology, ${SRC('so-survey-2024', 'Stack Overflow Developer Survey 2024')} "top paying technologies", retrieved 2026-10-26. Languages without a value are not listed.`,
    cols: '3,2',
    header: ['Language', 'Median salary, USD per year'],
    rows: langs.map(({ l, v }) => [languageCell(l), thousands(v)]),
  });
}

/** Standard, release cadence and licence of the reference implementation. */
export function otherMetricsTable(data) {
  const m = (metric) => byMetric(data.ecosystem, metric);
  const [standard, cadence, licence] = ['standardisation_body', 'release_cadence', 'licence'].map(m);
  return renderTable({
    caption: `Standardisation (${SRC('wikipedia', 'Wikipedia')} and ${SRC('ecma-international', 'Ecma International')}), release cadence (derived from ${SRC('endoflife-date', 'endoflife.date')} release dates) and licence (${SRC('github-api', 'GitHub repository metadata')}), 2026-10-26. n/a means not found in a source that was read; absence of a standard is not verified.`,
    cols: '2,4,5,3',
    header: ['Language', 'Standard', 'Release cadence', 'Licence of the reference implementation'],
    rows: data.languages.map((l) => [languageCell(l), pass(value(standard, l.id)), pass(value(cadence, l.id)),
      pass(value(licence, l.id))]),
  });
}

/** The radar scores of every language, one column per axis that `computeScores` returns. */
export function radarScoresTable(data, { scoresOf = computeScores } = {}) {
  const { axes, scores } = scoresOf(data);
  return renderTable({
    caption: 'Radar scores (0-10), computed from the sourced CSV values with the rubric in <<sec-method,How the scores were assigned>>, snapshot 2026-10-26. Higher is better on every axis. n/a means the input is missing.',
    cols: ['2', ...axes.map(() => '1')].join(','),
    header: ['Language', ...axes],
    rows: data.languages.map((l) => [languageCell(l), ...(scores.get(l.id) ?? axes.map(() => null)).map(score)]),
  });
}

// ---------------------------------------------------------------- bibliography

const SECTIONS = {
  overview: ['sec-overview', 'Overview and timeline'],
  popularity: ['sec-popularity', 'Popularity'],
  ecosystem: ['sec-ecosystem', 'Ecosystem'],
  performance: ['sec-performance', 'Performance'],
  learning: ['sec-learning', 'Learning curve and ease of use'],
  security: ['sec-security', 'Security and safety'],
  versatility: ['sec-versatility', 'Versatility and platforms'],
  jobs: ['sec-jobs', 'Job market and community'],
  other: ['sec-other', 'Other metrics'],
  radar: ['sec-radar', 'Radar comparisons'],
};

/** Source ids (other than the registry counts) whose ecosystem data feeds the "Other metrics" section. */
const OTHER_METRICS_SOURCES = new Set(['endoflife-date', 'github-api', 'wikipedia', 'ecma-international', 'site-pages']);

/** Documentation metrics: a source cited only for these is a language manual, not radar data. */
const DOC_METRICS = new Set(['execution_model', 'memory_management']);

/**
 * Bibliography subsections, in page order. A source goes in the first group whose `test(source, citations)` holds,
 * where `citations` lists the `file:metric` pairs that cite its id. `sections` gives the page sections it feeds.
 */
export const BIBLIOGRAPHY_GROUPS = [
  {
    title: 'Popularity indices and surveys',
    test: (s) => /^(tiobe|pypl|ieee-spectrum|redmonk|so-survey-\d{4}|github-octoverse-\d{4}|jetbrains-devecosystem-\d{4})$/.test(s.id),
    sections: (s) => {
      if (s.id === 'so-survey-2025') return ['learning', 'performance', 'radar'];
      if (/^(so-survey-2024|github-octoverse-|jetbrains-devecosystem-)/.test(s.id)) return ['jobs'];
      return ['popularity', 'radar'];
    },
  },
  {
    title: 'Package registries and release data',
    test: (s, cites) => s.id === 'modulecounts' || cites.some((c) => /^ecosystem(-history)?(:|$)/.test(c)),
    sections: (s) => (OTHER_METRICS_SOURCES.has(s.id) ? ['other'] : ['ecosystem', 'radar']),
  },
  {
    title: 'Performance, energy and language documentation',
    test: (s, cites) => /^pereira-\d{4}$/.test(s.id) || cites.some((c) => /^(performance|energy)(:|$)/.test(c)),
    sections: (s, cites) => (cites.length > 0 && cites.every((c) => DOC_METRICS.has(c.split(':')[1]))
      ? ['performance'] : ['performance', 'radar']),
  },
  {
    title: 'Security and memory safety',
    test: (s, cites) => cites.some((c) => c.startsWith('security:')),
    sections: () => ['security', 'radar'],
  },
  {
    title: 'Official sites checked for the onboarding score',
    test: (s) => s.id.startsWith('onb-'),
    sections: () => ['learning', 'performance', 'radar'],
  },
  {
    title: 'Wikipedia articles used for paradigms, purposes, platforms, type systems and dates',
    test: (s) => s.id.startsWith('wikipedia-'),
    sections: () => ['overview', 'versatility'],
  },
  {
    title: 'Sources for the versatility domains',
    test: (s, cites) => cites.some((c) => c.startsWith('versatility-domains')),
    sections: () => ['versatility', 'radar'],
  },
];

/** Group for sources that match no rule: listed so nothing is dropped, with a warning to classify them. */
const UNCLASSIFIED_GROUP = { title: 'Other sources', sections: () => [] };

/** Map source id -> sorted `file:metric` citations, from every `source` cell (`;` or `,` separated) of every file. */
export function citationsOf(data) {
  const m = new Map();
  for (const [file, rows] of Object.entries(data)) {
    if (file === 'sources') continue;
    for (const r of rows) {
      for (const id of String(r.source ?? '').split(/[;,]/).map((s) => s.trim()).filter((s) => !isMissing(s))) {
        if (!m.has(id)) m.set(id, new Set());
        m.get(id).add(r.metric ? `${file}:${r.metric}` : file);
      }
    }
  }
  return new Map([...m].map(([id, set]) => [id, [...set].sort()]));
}

/** First cell of a Bibliography row: the anchor, then a link per URL (` ; ` separated) or the bare title. */
export function bibliographySourceCell(source) {
  const urls = isMissing(source.url) ? [] : String(source.url).split(' ; ').map((u) => u.trim()).filter(Boolean);
  const title = pass(source.title);
  if (urls.length === 0) return `[[src-${source.id}]]${title}`;
  const extra = urls.slice(1).map((u, i) => ` (link:++${u}++[${i + 2}])`).join('');
  return `[[src-${source.id}]]link:++${urls[0]}++[${title}]${extra}`;
}

/** Sorts the sources into BIBLIOGRAPHY_GROUPS (keeping sources.csv order); returns [{title, rows: [{source, sections}]}]. */
export function groupSources(data) {
  const cites = citationsOf(data);
  const groups = [...BIBLIOGRAPHY_GROUPS, UNCLASSIFIED_GROUP].map((g) => ({ ...g, rows: [] }));
  for (const s of data.sources) {
    const c = cites.get(s.id) ?? [];
    const g = groups.find((x) => x !== groups.at(-1) && x.test(s, c)) ?? groups.at(-1);
    g.rows.push({ source: s, sections: g.sections(s, c) });
  }
  return groups.filter((g) => g.rows.length > 0);
}

/** The Bibliography body: the source count, then one subsection with a table per group. */
export function bibliography(data) {
  const parts = [`The registry of sources is \`sources.csv\`, with ${data.sources.length} entries.`];
  for (const g of groupSources(data)) {
    const lines = [`=== ${g.title}`, '', '[cols="4,2,2,3,3",options="header"]', '|===',
      '|Source |Publisher |Edition or retrieved |Used for |Sections and charts', ''];
    for (const { source: s, sections } of g.rows) {
      const links = sections.map((k) => `<<${SECTIONS[k][0]},${SECTIONS[k][1]}>>`).join(', ') || 'n/a';
      lines.push(`|${bibliographySourceCell(s)}`, `|${pass(s.publisher)}`, `|${pass(s.edition_or_retrieved)}`,
        `|${pass(s.used_for)}`, `|${links}`, '');
    }
    lines.push('|===');
    parts.push(lines.join('\n'));
  }
  return parts.join('\n\n');
}

/** Ids of sources that no BIBLIOGRAPHY_GROUPS rule classifies. */
export function unclassifiedSources(data) {
  return groupSources(data).filter((g) => g.title === UNCLASSIFIED_GROUP.title).flatMap((g) => g.rows.map((r) => r.source.id));
}

// ---------------------------------------------------------------- partials and CLI

/** Every partial, in page order: name (file `<name>.adoc`) and builder `(data, options) => AsciiDoc`. */
export const TABLE_PARTIALS = [
  { name: 'first-appearance', build: overviewTable },
  { name: 'popularity-indices', build: popularityTable },
  { name: 'package-registries', build: registriesTable },
  { name: 'performance', build: performanceTable },
  { name: 'learning-curve', build: learningTable },
  { name: 'memory-safety', build: memorySafetyTable },
  { name: 'paradigms-purposes-platforms', build: versatilityTable },
  { name: 'versatility-domains', build: domainsTable },
  { name: 'median-salary', build: salaryTable },
  { name: 'standards-cadence-licence', build: otherMetricsTable },
  { name: 'radar-scores', build: radarScoresTable },
  { name: 'bibliography', build: bibliography },
];

/** Builds and writes every partial to `outDir`; returns the written file paths. */
export function generateTables(data, outDir = DEFAULT_TABLES_DIR, options = {}) {
  mkdirSync(outDir, { recursive: true });
  return TABLE_PARTIALS.map(({ name, build }) => {
    const file = join(outDir, `${name}.adoc`);
    writeFileSync(file, `${build(data, options)}\n`);
    return file;
  });
}

function main(argv) {
  const i = argv.indexOf('--out');
  if (i >= 0 && (argv[i + 1] === undefined || argv[i + 1].startsWith('--'))) {
    console.error('Usage: node scripts/language-charts/generate-tables.mjs [--out <dir>]');
    process.exitCode = 2;
    return;
  }
  const outDir = i >= 0 ? resolve(argv[i + 1]) : DEFAULT_TABLES_DIR;
  const data = loadData();
  const files = generateTables(data, outDir);
  console.log(`Wrote ${files.length} partial(s) to ${outDir}`);
  files.forEach((f) => console.log(`  ${f}`));
  const loose = unclassifiedSources(data);
  if (loose.length) console.warn(`Warning: add a BIBLIOGRAPHY_GROUPS rule for: ${loose.join(', ')} (listed under "Other sources")`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main(process.argv.slice(2));
