# Language charts

Dependency-free Node (v18+, developed on v24) tooling that turns the CSV data behind the "Programming Languages
Comparative" guide into SVG charts and AsciiDoc tables. No npm packages are needed beyond Node itself.

## Layout

| Path | Purpose |
|---|---|
| `data/*.csv` | Source data, one file per topic. `data/NOTES.md` explains criteria, the 0-10 radar rubric and formulas |
| `generate-charts.mjs` | CSV parser, scales, the four chart renderers and the CLI |
| `chart-definitions.mjs` | The chart builders (`CHART_BUILDERS`): one `(data) => spec` per guide chart |
| `scores.mjs` | 0-10 radar scores computed from the CSVs with the `data/NOTES.md` rubric |
| `data-utils.mjs` | `isMissing` / `toNumber` shared by every module |
| `generate-tables.mjs` | The guide's data tables and Bibliography as AsciiDoc partials (`TABLE_PARTIALS`) and the CLI |
| `*.test.mjs` | `node --test` suites (renderers, builders, scores, every chart rendered from the real data) |

## Data format

- Comma separated, RFC 4180 quoting (`"a, b"`, `""` for a literal quote), header row first, UTF-8.
- Every value is either read from the source named in the row's `source` column (an id from `data/sources.csv`)
  or the literal `n/a`. `n/a` and empty cells are *missing*: charts leave a gap or an `n/a` label and never plot
  them as zero.
- Files are keyed by `language_id` (an `id` in `data/languages.csv`), except `ecosystem-history.csv` (keyed by
  `registry` and `year`) and `sources.csv`.

## Refreshing the data

1. Re-read the cited source for each row and update `value`, `edition` and `retrieved`.
2. Record anything not found as `n/a` with a `note`; do not estimate.
3. Update `data/NOTES.md` if the scoring rubric or inclusion criteria change.

## Chart types

`generate-charts.mjs` exports one renderer per type; each takes a spec object and returns SVG text.

| `type` | Renderer | Spec fields |
|---|---|---|
| `line` | `renderLineChart` | `series: [{name, points: [{x, y}]}]` (time series; a missing `y` breaks the line) |
| `bar` | `renderBarChart` | `items: [{label, value}]`, optional `seriesName`, `valueFormat` (horizontal bars; missing shows `n/a`) |
| `scatter` | `renderScatterChart` | `series: [{name, points: [{x, y, label}]}]` (points missing a coordinate are skipped) |
| `radar` | `renderRadarChart` | `axes: [label]`, `max` (default 10), `series: [{name, values}]` (a missing axis breaks the outline) |

All specs also need `id`, `title`, `desc`, and (except radar) `xLabel` and `yLabel` including units. Every SVG gets
a `viewBox`, `<title>`, `<desc>`, a legend, a colour-blind-safe (Okabe-Ito) palette with distinct dash styles and
markers, and one light palette through CSS variables. There is no `prefers-color-scheme` override: the site UI has no
dark theme, so following the reader's OS setting would put dark panels on the white page.

## Adding a chart

Add a builder to `CHART_BUILDERS` in `chart-definitions.mjs` (`CHART_DEFINITIONS` in `generate-charts.mjs` is built from it and also accepts extra entries), either a spec object or a function `(data) => spec`, where
`data` maps each CSV name (for example `data['popularity-history']`) to its parsed rows. The file is written as
`modules/ROOT/images/programming-languages-<id>.svg`.

## Generated charts

Every SVG is `modules/ROOT/images/programming-languages-<id>.svg`. Suggested captions give the source and date for the guide page.

| id | Type | Purpose and suggested caption |
|---|---|---|
| `timeline-first-appeared` | scatter | When each language first appeared. Wikipedia Timeline of programming languages, retrieved 2026-10-26 |
| `licences` | bar | Licence of each reference implementation, counted from `languages.csv`; 19 have none recorded (n/a). GitHub repository metadata, 2026-10-26 |
| `single-vs-multi-purpose` | bar | General-purpose vs specific-purpose languages, from the purposes column. Wikipedia lead paraphrases, 2026-10-26 |
| `popularity-tiobe-current` | bar | TIOBE rating of every language. TIOBE Index, October 2026 |
| `popularity-pypl-current` | bar | PYPL share (C and C++ combined; n/a where untracked). PYPL, 2026-10-26 |
| `popularity-history-tiobe` | line | TIOBE rating of 8 languages since 2001 (June samples). TIOBE monthly series, 2026-10-26 |
| `popularity-history-pypl` | line | PYPL share of 8 languages since 2004 (June samples). PYPL All.js, 2026-10-26 |
| `ecosystem-registry-size` | bar | Package registry sizes, 2026 snapshot (units differ). Registry APIs, 2026-10-25/26 |
| `ecosystem-registry-growth` | line | Registry growth: only LuaRocks has a real yearly series (no other history was reachable, none is estimated). luarocks.org/stats, 2026-10-26 |
| `popularity-vs-growth` | scatter | TIOBE rating vs change since June 2016, all languages. TIOBE monthly series, 2026-10-26 |
| `popularity-vs-growth-zoom` | scatter | Same, zoomed on languages below 4%. TIOBE monthly series, 2026-10-26 |
| `performance-cpu` | bar | CPU time relative to the fastest. Benchmarks Game 25.03 (derived), measured 2025-03-05 |
| `performance-memory` | bar | Memory relative to the lowest. Benchmarks Game 25.03 (derived), measured 2025-03-05 |
| `performance-energy` | bar | Energy relative to C. Pereira et al. 2021, Table 4 |
| `performance-vs-ease` | scatter | Performance score vs ease-of-learning score (rubric in `data/NOTES.md`) |
| `energy-vs-ease` | scatter | Energy score vs ease-of-learning score (rubric in `data/NOTES.md`) |
| `radar-jvm`, `radar-c-family`, `radar-scripting`, `radar-scientific`, `radar-systems`, `radar-legacy` | radar | Nine-axis 0-10 radar per editorial group (a language may appear in two groups). Scores computed by `scores.mjs` from the sourced CSVs, 2026-10-26; gaps are n/a |

## Generated tables

`generate-tables.mjs` writes one partial per data table to
`modules/ROOT/partials/programming-languages-comparative/<name>.adoc`, and the page includes each one with
`include::partial$programming-languages-comparative/<name>.adoc[]`. Edit the CSVs or the generator, never the
partials: they are overwritten on every run.

| Partial | Page section | Content |
|---|---|---|
| `first-appearance` | Overview and timeline | First appearance, editorial group, documented (sorted by year, then name) |
| `popularity-indices` | Popularity | TIOBE rating (rank), PYPL share, SO 2026 usage and admired |
| `package-registries` | Ecosystem | Languages with a registry name: registry, count, unit, source |
| `performance` | Performance | CPU and memory ratios, energy vs C, execution model |
| `learning-curve` | Learning curve | Onboarding score, gzip source size, SO 2025 learning usage, type system |
| `memory-safety` | Security and safety | Languages with a memory-safety classification (the caption counts the rest) |
| `paradigms-purposes-platforms` | Versatility and platforms | Paradigms and purposes re-joined with `; `; platforms cells longer than `PLATFORM_JOIN_MIN_LENGTH` too |
| `median-salary` | Job market | SO 2024 median salary, highest first |
| `standards-cadence-licence` | Other metrics | Standard, release cadence, licence |
| `radar-scores` | Radar comparisons | One column per axis returned by `computeScores` in `scores.mjs` |
| `bibliography` | Bibliography | Source count and one table per `BIBLIOGRAPHY_GROUPS` subsection, with `[[src-<id>]]` anchors |

Text cells are `+++...+++` passthroughs (so no AsciiDoc substitution applies), numbers are printed as written in
the CSV, and missing values are `n/a`. A new `sources.csv` row goes into the first `BIBLIOGRAPHY_GROUPS` group whose
rule matches (by id or by the files that cite it); a row no rule matches is listed under "Other sources" and the CLI
prints a warning, so add a rule for it.

The hand-written tables of the page (the metric list, the scoring rubric and the recommendations by purpose) are
editorial and stay in the page.

## Regenerating and testing

```bash
npm run charts && npm run tables    # write SVGs to modules/ROOT/images/ and table partials to modules/ROOT/partials/
npm run charts                      # write SVGs to modules/ROOT/images/
npm run tables                      # write the table partials only
node scripts/language-charts/generate-tables.mjs --out /tmp/tables  # write elsewhere
node scripts/language-charts/generate-charts.mjs --out /tmp/charts   # write elsewhere
npm run test:charts                 # node --test "scripts/language-charts/*.test.mjs"
```

Every generated SVG must be referenced by a page (`image::programming-languages-<id>.svg[...]`, on one line, see the
repository `CLAUDE.md`); do not commit an SVG nothing uses.
