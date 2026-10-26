import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DOMAINS } from './scores.mjs';
import {
  pass, raw, thousands, score, languageCell, joinList, platformsCell, renderTable, overviewTable, popularityTable,
  registriesTable, memorySafetyTable, versatilityTable, domainsTable, salaryTable, radarScoresTable, bibliographySourceCell,
  bibliography, groupSources, unclassifiedSources, generateTables, TABLE_PARTIALS, PLATFORM_JOIN_MIN_LENGTH,
} from './generate-tables.mjs';

const LANGUAGES = [
  { id: 'cpp', name: 'C++', documented: 'yes', xref: 'programming-languages/cpp/index.adoc', first_appeared: '1983', group: 'systems' },
  { id: 'lisp', name: 'Lisp', documented: 'no', xref: 'n/a', first_appeared: '1956-1958', group: 'functional research' },
  { id: 'asm', name: 'Assembly', documented: 'no', xref: 'n/a', first_appeared: 'n/a (ambiguous)', group: 'systems' },
];

/** Splits a rendered table into its body rows (arrays of cell texts, without the leading `|`). */
function bodyRows(table) {
  const body = table.split('\n|===\n')[1].split('\n|===')[0].trimEnd();
  return body.split('\n\n').slice(1).map((block) => block.split('\n').map((l) => l.replace(/^\|/, '')));
}

test('cell helpers: passthrough escaping, n/a handling, number formats and language links', () => {
  assert.equal(pass('a <b> & c'), '+++a &lt;b&gt; &amp; c+++');
  assert.equal(pass('n/a'), '+++n/a+++');
  assert.equal(pass(''), '+++n/a+++');
  assert.equal(raw(' 2.20 '), '2.20');
  assert.equal(raw(''), 'n/a');
  assert.equal(thousands('4532034'), '4,532,034');
  assert.equal(thousands('n/a'), 'n/a');
  assert.equal(score(7.25), '7.3');
  assert.equal(score(0), '0.0');
  assert.equal(score(null), 'n/a');
  assert.equal(languageCell(LANGUAGES[0]), 'xref:programming-languages/cpp/index.adoc[C{plus}{plus}]');
  assert.equal(languageCell(LANGUAGES[1]), 'Lisp');
  assert.equal(joinList('a;b (c, d); e'), 'a; b (c, d); e');
});

test('renderTable writes caption, cols, header and one cell per line with a blank line between rows', () => {
  const t = renderTable({ caption: 'Cap', cols: '2,1', header: ['A', 'B'], rows: [['x', '1'], ['y', 'n/a']] });
  assert.equal(t, '.Cap\n[cols="2,1",options="header"]\n|===\n|A |B\n\n|x\n|1\n\n|y\n|n/a\n\n|===');
});

test('a table partial renders the header and the fixture rows in order', () => {
  const t = overviewTable({ languages: LANGUAGES });
  assert.match(t, /^\.First appearance and editorial group/);
  assert.match(t, /\n\[cols="3,1,2,1",options="header"\]\n\|===\n\|Language \|First appeared \|Editorial group \|Documented on this site\n/);
  // Sorted by first year; the undated language goes last.
  assert.deepEqual(bodyRows(t), [
    ['Lisp', '+++1956-1958+++', '+++functional research+++', 'no'],
    ['xref:programming-languages/cpp/index.adoc[C{plus}{plus}]', '+++1983+++', '+++systems+++', 'yes'],
    ['Assembly', '+++n/a (ambiguous)+++', '+++systems+++', 'no'],
  ]);
});

test('missing values show n/a and never 0; rows without data are left out where the table says so', () => {
  const data = {
    languages: LANGUAGES,
    'popularity-current': [
      { language_id: 'cpp', source: 'tiobe', metric: 'rating', value: '8.87', rank: '3' },
      { language_id: 'lisp', source: 'tiobe', metric: 'rating', value: 'n/a', rank: 'n/a' },
      { language_id: 'cpp', source: 'pypl', metric: 'share', value: '7.97' },
    ],
    ecosystem: [
      { language_id: 'cpp', metric: 'registry_name', value: 'n/a', source: 'n/a' },
      { language_id: 'lisp', metric: 'registry_name', value: 'Quicklisp', source: 'n/a' },
      { language_id: 'lisp', metric: 'registry_packages', value: 'n/a', unit: '', source: 'n/a' },
    ],
    security: [
      { language_id: 'cpp', metric: 'memory_safety', value: 'not memory safe', source: 'oncd-2024', edition: 'Feb 2024' },
      { language_id: 'lisp', metric: 'memory_safety', value: 'n/a', source: 'n/a', edition: 'n/a' },
    ],
    jobs: [
      { language_id: 'lisp', source: 'so-survey-2024', metric: 'so-median-salary', value: '80555' },
      { language_id: 'cpp', source: 'so-survey-2024', metric: 'so-median-salary', value: '90000' },
      { language_id: 'asm', source: 'so-survey-2024', metric: 'so-median-salary', value: 'n/a' },
    ],
  };
  const pop = bodyRows(popularityTable(data));
  assert.deepEqual(pop[0].slice(1), ['8.87 (#3)', '7.97', 'n/a', 'n/a']);
  assert.deepEqual(pop[1].slice(1), ['n/a', 'n/a', 'n/a', 'n/a']);
  assert.deepEqual(bodyRows(registriesTable(data)), [['Lisp', '+++Quicklisp+++', 'n/a', 'n/a', 'n/a']]);
  const safety = memorySafetyTable(data);
  assert.match(safety, /The other 2 of the 3 languages are n\/a/);
  assert.deepEqual(bodyRows(safety), [[languageCell(LANGUAGES[0]), '+++not memory safe+++', '<<src-oncd-2024,oncd-2024>>', '+++Feb 2024+++']]);
  assert.deepEqual(bodyRows(salaryTable(data)).map((r) => r[1]), ['90,000', '80,555']);
  assert.doesNotMatch(popularityTable(data), /\|0\n/);
});

test('long platforms lists are re-joined with "; ", short ones and digit or dot items are kept', () => {
  assert.equal(platformsCell('DragonFly BSD;FreeBSD;Linux;macOS (infobox OS)'), 'DragonFly BSD; FreeBSD; Linux; macOS (infobox OS)');
  assert.equal(platformsCell('IA-32;x86-64;ARM64'), 'IA-32;x86-64;ARM64');
  assert.ok('IA-32;x86-64;ARM64'.length <= PLATFORM_JOIN_MIN_LENGTH);
  assert.equal(platformsCell('.NET Framework;Mono;.NET (also Android;BSD)'), '.NET Framework; Mono;.NET (also Android; BSD)');
  assert.equal(platformsCell('64-bit Linux and macOS;32/64-bit Windows'), '64-bit Linux and macOS;32/64-bit Windows');
  assert.equal(platformsCell('Cross-platform (x); Linux;macOS'), 'Cross-platform (x); Linux; macOS');
  assert.equal(platformsCell('n/a'), 'n/a');
  const data = {
    languages: [LANGUAGES[0]],
    versatility: [
      { language_id: 'cpp', metric: 'paradigms', value: 'procedural;imperative' },
      { language_id: 'cpp', metric: 'purposes', value: 'general-purpose;systems' },
      { language_id: 'cpp', metric: 'platforms', value: 'Linux;Windows;macOS;FreeBSD;Android' },
    ],
  };
  assert.deepEqual(bodyRows(versatilityTable(data))[0].slice(1),
    ['+++procedural; imperative+++', '+++general-purpose; systems+++', '+++Linux; Windows; macOS; FreeBSD; Android+++']);
});

test('the radar score table takes its columns from computeScores', () => {
  const scoresOf = () => ({ axes: ['Speed', 'Safety'], scores: new Map([['cpp', [9.66, null]], ['lisp', [0, 10]]]) });
  const t = radarScoresTable({ languages: LANGUAGES }, { scoresOf });
  assert.match(t, /\[cols="2,1,1",options="header"\]\n\|===\n\|Language \|Speed \|Safety\n/);
  assert.deepEqual(bodyRows(t).map((r) => r.slice(1)), [['9.7', 'n/a'], ['0.0', '10.0'], ['n/a', 'n/a']]);
});

const SOURCES = [
  { id: 'tiobe', title: 'TIOBE Index', publisher: 'TIOBE BV', url: 'https://www.tiobe.com/tiobe-index/', edition_or_retrieved: 'October 2026', used_for: 'rating' },
  { id: 'cran', title: 'CRAN', publisher: 'R Foundation', url: 'https://a.example/ ; https://b.example/', edition_or_retrieved: '2026-10-26', used_for: 'count' },
  { id: 'onb-sql', title: 'Official SQL site', publisher: 'SQL steward', url: 'n/a', edition_or_retrieved: 'retrieved 2026-10-26', used_for: 'onboarding' },
  { id: 'go-faq', title: 'Go FAQ', publisher: 'Go', url: 'https://go.dev/doc/faq', edition_or_retrieved: '2026-10-26', used_for: 'go execution_model' },
  { id: 'mystery', title: 'New <source>', publisher: 'X', url: 'n/a', edition_or_retrieved: '2026', used_for: 'n/a' },
];

test('bibliography entries carry src- anchors, extra URLs as numbered links and grouped sections', () => {
  assert.equal(bibliographySourceCell(SOURCES[0]), '[[src-tiobe]]link:++https://www.tiobe.com/tiobe-index/++[+++TIOBE Index+++]');
  assert.equal(bibliographySourceCell(SOURCES[1]), '[[src-cran]]link:++https://a.example/++[+++CRAN+++] (link:++https://b.example/++[2])');
  assert.equal(bibliographySourceCell(SOURCES[2]), '[[src-onb-sql]]+++Official SQL site+++');
  const data = {
    sources: SOURCES,
    ecosystem: [{ language_id: 'r', metric: 'registry_packages', value: '1', source: 'cran' }],
    performance: [{ language_id: 'go', metric: 'execution_model', value: 'compiled', source: 'go-faq' }],
  };
  const text = bibliography(data);
  assert.match(text, /^The registry of sources is `sources.csv`, with 5 entries\.\n\n=== Popularity indices and surveys\n/);
  for (const s of SOURCES) assert.match(text, new RegExp(`\\|\\[\\[src-${s.id}\\]\\]`));
  assert.deepEqual(groupSources(data).map((g) => [g.title, g.rows.map((r) => r.source.id)]), [
    ['Popularity indices and surveys', ['tiobe']],
    ['Package registries and release data', ['cran']],
    ['Performance, energy and language documentation', ['go-faq']],
    ['Official sites checked for the onboarding score', ['onb-sql']],
    ['Other sources', ['mystery']],
  ]);
  assert.match(text, /\|\+\+\+go execution_model\+\+\+\n\|<<sec-performance,Performance>>\n/);
  assert.match(text, /\|\+\+\+rating\+\+\+\n\|<<sec-popularity,Popularity>>, <<sec-radar,Radar comparisons>>\n/);
  assert.match(text, /\[\[src-mystery\]\]\+\+\+New &lt;source&gt;\+\+\+/);
  assert.deepEqual(unclassifiedSources(data), ['mystery']);
});

test('generateTables writes one closed table block per partial', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lang-tables-'));
  try {
    const data = {
      languages: LANGUAGES, sources: SOURCES, 'popularity-current': [], ecosystem: [], performance: [], energy: [],
      learning: [], security: [], versatility: [], jobs: [],
    };
    const scoresOf = () => ({ axes: ['A'], scores: new Map() });
    const files = generateTables(data, dir, { scoresOf });
    assert.equal(files.length, TABLE_PARTIALS.length);
    assert.deepEqual(readdirSync(dir).sort(), TABLE_PARTIALS.map((p) => `${p.name}.adoc`).sort());
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      assert.ok(text.endsWith('|===\n'), f);
      assert.equal((text.match(/^\|===$/gm) ?? []).length % 2, 0, f);
      assert.doesNotMatch(text, /undefined|NaN|null/, f);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('domainsTable shows yes/no/n/a per domain and the lower-bound score', () => {
  const data = {
    languages: [{ id: 'a', name: 'A', documented: 'no' }, { id: 'b', name: 'B', documented: 'no' }],
    'versatility-domains': [
      ...DOMAINS.map((domain, i) => ({ language_id: 'a', domain, value: i < 6 ? 'yes' : 'n/a' })),
      { language_id: 'b', domain: 'backend', value: 'yes' },
    ],
  };
  const t = domainsTable(data);
  assert.match(t, /\|Language \|Web front end \|/);
  assert.match(t, /\|A\n(\|yes\n){6}(\|n\/a\n){3}\|6\.7\n/);
  assert.match(t, /\|B\n\|n\/a\n\|yes\n(\|n\/a\n){7}\|n\/a\n/);
});
