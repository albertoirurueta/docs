# Language comparison data: notes, criteria and scoring rubric

Raw data behind the "Programming Languages Comparative" page. All files are in this directory and were retrieved
on 2026-10-26. Policy: **cite or mark `n/a`**. A value is recorded only when it was read in the source named in the
row's `source` column (an id from `sources.csv`). Anything not found is `n/a`. A figure that was derived by us from
published tables is labelled as derived in its `note` column.

## Files

| File | Content |
|---|---|
| `languages.csv` | 21 documented languages plus 14 extra ones (35 rows) |
| `popularity-current.csv` | TIOBE, PYPL, IEEE Spectrum, RedMonk, Stack Overflow, Octoverse, JetBrains |
| `popularity-history.csv` | TIOBE rating and PYPL share, sampled in June of each year, plus the latest month |
| `ecosystem.csv`, `ecosystem-history.csv` | registries, releases, EOL, standards, licence, IDE page links |
| `performance.csv`, `energy.csv` | Benchmarks Game, TechEmpower, execution and memory model, Pereira et al. |
| `learning.csv`, `learning-so.csv`, `onboarding-checks.csv` | verbosity, type system, onboarding, learning usage |
| `security.csv` | memory safety and the ~70% figures |
| `versatility.csv`, `jobs.csv` | platforms, paradigms, purposes; salary |
| `sources.csv` | registry of every source id used in the other files |

## Inclusion criteria

A language is included when at least one of these holds:

1. It is already documented on this site (21 languages, `documented=yes`, with an `xref`).
2. It ranks in the TIOBE top 50 (October 2026) or in another main index used here (PYPL, IEEE Spectrum,
   RedMonk, Stack Overflow survey).
3. It matters for history or growth: it is a historic standardised language (Ada, Lisp, Pascal) or a recent
   fast-growing one (Zig, Mojo, Elixir).

Extra languages: Pascal/Delphi, Perl, Ada, Lisp, Assembly, Dart, Julia, Zig, Elixir, Lua, Haskell, Mojo, SQL, Bash.

Extra languages that get fewer metrics because data is scarce:

- **Mojo, Bash, Elixir, Groovy**: not ranked in the TIOBE top 50 (listed alphabetically below rank 50), no PYPL
  entry for Mojo, Elixir and Bash, no Benchmarks Game, energy or TechEmpower data for Mojo and Bash.
- **Assembly, SQL, Bash**: not a single implementation, so no registry, release cadence, licence or benchmark.
- **Zig, Mojo, Julia**: absent from the Pereira et al. energy paper (15 of the 35 languages are, see `energy.csv`).
- **Lisp, Haskell, Elixir, Zig, Mojo, Bash, TypeScript**: no per-language TIOBE history page, so no TIOBE
  history rows (current rating exists for those in the top 50).
- **COBOL, Assembly, SQL, Bash, Lisp, Pascal/Delphi, MATLAB**: official site not machine-readable (HTTP 403 or no
  single steward), so onboarding checks are `n/a`.

## Known limitations of the data

- **TIOBE history**: monthly ratings from each language page; the file keeps the June sample of each year
  (series starts June 2001) plus the latest month. Languages without a page in the index series are missing.
- **PYPL**: read from the index's own data file (`PYPL/All.js`). Shares are relative to the 30 languages PYPL
  tracks and sum to 100%. C and C++ are one combined entry (stored as `c+cpp` in history and repeated under `c`
  and `cpp` in the current file, never to be summed). The series starts June 2004.
- **Benchmarks Game**: the site publishes only SVG box plots, so ratios were derived from per-program tables
  (geometric mean over 7 benchmarks, relative to the lowest value listed). The edition is 25.03. Size is gzip
  bytes, not lines of code.
- **TechEmpower**: Round 23 (2025-01-30) was the latest found. Values are computed from the raw results JSON.
- **Energy**: values are printed Table 4 values from Pereira et al.; peak memory normalisation is derived.
- **Registries**: npm, Maven Central counts come from index APIs and can differ from the registries' own headline
  totals. Only a 2026 snapshot exists for most registries, because historical counts were unreachable
  (modulecounts.com failed TLS, archive.org was rate limited). `ecosystem-history.csv` therefore holds a real
  yearly series only for LuaRocks. Charts needing history for other registries must wait for sourced data.
- **Security**: the NSA June 2025 memory-safe-languages document returned HTTP 403, so its language list is not
  recorded and most `memory_safety` values are `n/a`. Only classifications seen in a fetched document are used.
- **Type system** in `learning.csv` is the Wikipedia infobox "typing discipline", cut at the first footnote, so a
  few entries are shortened (for example C# shows only the first terms).
- **`first_appeared`** comes from the Wikipedia "Timeline of programming languages"; the `group` column in
  `languages.csv` is an editorial classification used only to colour charts, not a sourced metric.
- **Salary** is from the Stack Overflow 2024 "top paying technologies" chart because the 2025 and 2026 surveys do
  not publish salary by language. Learning-to-code usage is from the 2025 survey for the same reason.

## Scoring rubric for radar charts (0 to 10 per axis)

Every radar score is computed by the formula below from the CSV values. No score is typed by hand. A language
with a missing input on an axis gets `n/a` on that axis, and the chart draws a gap rather than a guess.
Min-max values are taken over the languages that have data on that metric. Log scale is used where the metric
spans orders of magnitude.

Normalisation helpers: `lin(x) = 10 * (x - min) / (max - min)`; `loginv(x) = 10 * (log(max) - log(x)) / (log(max) - log(min))`
(for "lower is better" metrics); `log(x)` the same with the sign reversed for "higher is better".

| Axis | Inputs | Formula | Anchors |
|---|---|---|---|
| Popularity | TIOBE rating (`popularity-current.csv`), Stack Overflow usage | mean of `log` score of TIOBE rating and `lin` of SO usage; if only one exists use it and flag it | 10 = highest in set, 0 = lowest |
| Ecosystem | registry packages, `actively_maintained`, standard exists | `log` score of packages (60%), plus 2 points for an active release in the last 12 months, plus 2 points for a formal standard; capped at 10; `n/a` if there is no registry count | 10 = largest registry with active releases and a standard |
| Performance | `cpu_time_vs_fastest` | `loginv` of the CPU ratio | 10 = fastest in the Benchmarks Game set, 0 = slowest |
| Memory | `memory_vs_fastest` | `loginv` of the memory ratio | 10 = least memory, 0 = most |
| Energy | `energy_normalized` | `loginv` of the energy ratio | 10 = C (1.00), 0 = worst in Pereira et al. |
| Learning curve (ease) | onboarding score, verbosity, type system | mean of the onboarding score (already 0 to 10) and `loginv` of gzip bytes; type system is shown but not scored | 10 = all four official onboarding checks pass and the shortest sources |
| Safety | `memory_safety` | `memory-safe` = 10, `memory-safe unless unsafe construct` = 8, `not memory safe` = 2; `n/a` otherwise | anchors fixed by the cited CISA, ONCD classification |
| Versatility | `platforms`, `purposes` | `lin` of the number of distinct purposes listed in `versatility.csv` | 10 = most listed purposes |
| Job market | Stack Overflow median salary, optional | `lin` of median salary (USD, 2024 survey) | optional axis, omitted when fewer than 10 languages have data |

### Onboarding score (used by the Learning axis)

Four yes/no checks on the language's official site, recorded with the proving URL in `onboarding-checks.csv`:

- O1: official getting-started tutorial or tour.
- O2: official online language reference or specification.
- O3: official online playground, REPL or interactive tour.
- O4: official one-command toolchain installer or manager (community tools such as SDKMAN do not count).

`onboarding_score = 10 * (number of yes) / (number of answered checks)`, and `n/a` if fewer than 3 checks could
be answered. `n/a` checks are excluded from the denominator, so a language is not penalised for an unreadable site.

### Reproducibility

Charts must be regenerated from these CSVs only. When a source publishes a new edition, replace the rows, update the
`edition` and `retrieved` columns and the entry in `sources.csv`, and rerun the generator.
