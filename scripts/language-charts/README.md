# Language charts

Dependency-free Node (v18+, developed on v24) tooling that turns the CSV data behind the "Programming Languages
Comparative" guide into SVG charts. No npm packages are needed beyond Node itself.

## Layout

| Path | Purpose |
|---|---|
| `data/*.csv` | Source data, one file per topic. `data/NOTES.md` explains criteria, the 0-10 radar rubric and formulas |
| `generate-charts.mjs` | CSV parser, scales, the four chart renderers and the CLI |
| `chart-definitions.mjs` | The chart builders (`CHART_BUILDERS`): one `(data) => spec` per guide chart |
| `scores.mjs` | 0-10 radar scores computed from the CSVs with the `data/NOTES.md` rubric |
| `data-utils.mjs` | `isMissing` / `toNumber` shared by every module |
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
markers, and light/dark colours through CSS variables and `@media (prefers-color-scheme: dark)`.

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

## Regenerating and testing

```bash
npm run charts                      # write SVGs to modules/ROOT/images/
node scripts/language-charts/generate-charts.mjs --out /tmp/charts   # write elsewhere
npm run test:charts                 # node --test "scripts/language-charts/*.test.mjs"
```

Every generated SVG must be referenced by a page (`image::programming-languages-<id>.svg[...]`, on one line, see the
repository `CLAUDE.md`); do not commit an SVG nothing uses.
