# Backend and web frameworks comparison data

Data behind the charts and tables of `modules/ROOT/pages/backend/frameworks-comparison.adoc` and
`modules/ROOT/pages/web/frameworks-comparison.adoc` (issue #263). Snapshot date: **2026-10-27** (the `retrieved`
column of every CSV). Each data source also has its own edition or measurement date, recorded in the rows and in
`sources.csv`.

Missing values are the literal `n/a` with a `note` saying why. They are never estimated and never plotted as zero. A
`0` in a CSV is a real count of zero (for example, no advisories for a package in OSV). Every row has a `source` (one
or more ids from `sources.csv`, separated by `;`) and a `retrieved` date. Framework ids are the `id` column of
`frameworks.csv`.

## Reachability from the authoring environment

Re-probed on 2026-10-27, after full network access was granted:

* Reachable with `curl` or Node.js `fetch`: `registry.npmjs.org`, `api.npmjs.org`, `pypi.org`, `pypistats.org`,
  `api.nuget.org` and the NuGet search service, `repo.packagist.org` and `packagist.org`, `crates.io` (only with a
  `User-Agent` header, as its data-access policy requires), `index.crates.io`, `rubygems.org`, `hex.pm`,
  `repo.maven.apache.org`, `proxy.golang.org`, `raw.githubusercontent.com`, `survey.stackoverflow.co` and
  `insights.stackoverflow.com`, `stateofjs.com` and `api.devographics.com`, JetBrains report pages and
  `resources.jetbrains.com`, `www.techempower.com`, `krausest.github.io`, `bundlephobia.com`, `cdn.jsdelivr.net`,
  `cdn.httparchive.org`, `w3techs.com`, `hn.algolia.com`, `endoflife.date`, `api.osv.dev`, `api.deps.dev` and the
  frameworks' official websites.
* Not usable: `api.github.com` (HTTP 403: this session's GitHub access is limited to this repository), the OSS Insight
  API (HTTP 500 for repositories, HTTP 401 for stargazer history), `nvd.nist.gov` (HTTP 403) and `web.archive.org`
  (unreachable). The PyPI BigQuery dataset and the pepy.tech API need credentials and were not used. These sources
  are marked "(unverified)" in `sources.csv`.
* Consequences: GitHub stars come from deps.dev (a snapshot), contributor counts and stars over time are `n/a`, CVE ids
  come from OSV aliases, and long-term PyPI history is `n/a`.

The fetch scripts were run from a scratch directory and are not part of the repository. Each dataset section below
names the endpoint and the method, so the data can be fetched again.

## Inclusion criteria

A framework is included when it (a) has its own section on this site, (b) appears in the frameworks lists of the Stack
Overflow Developer Survey 2025, State of JS 2025 or the JetBrains State of Developer Ecosystem 2023, or ranks in its
registry's downloads, or (c) matters for historical context (legacy entries, `status=legacy` or `historical`).
Frameworks without a section on the site get fewer metrics where data is scarce: the feature matrix (`productivity.csv`),
deployment targets and some concurrency rows are only assessed for frameworks documented on the site.

* **Backend page** (`page` = `backend` or `both` in `frameworks.csv`): JVM, .NET, Node.js and TypeScript, Python, PHP,
  Rust, Swift, others for popularity or growth (Ruby on Rails, Go frameworks, Phoenix) and historical entries. Full-stack
  frameworks are compared here, on their server side.
* **Web page** (`page` = `web` or `both`): client-side UI frameworks, meta-frameworks, server-driven and server-rendered
  UI (including the view layers of the full-stack frameworks), CSS frameworks (their own section and radar, never mixed
  with the JavaScript radars) and historical entries.
* Excluded although they appear in the surveys: runtimes (Node.js, Deno, Bun), content-management systems (WordPress,
  Drupal, Strapi), Gatsby, Elm and Yii 2.

## Files

| File | Content |
|---|---|
| `frameworks.csv` | One row per framework: page, group, language, site xref, website, first release (with its basis), licence, governance (only where the official website states it, with the quoted evidence), status |
| `sources.csv` | One row per source id: title, publisher, URL, edition, retrieval date, reachable, used for |
| `popularity.csv` | Latest value per framework and metric: Stack Overflow 2025 usage (all, professional), admired, desired; State of JS 2025 usage, retention, interest, awareness; JetBrains 2023 share within the language; HTTP Archive origins (2026-09); W3Techs share of websites |
| `popularity-history.csv` | The same metrics per year: Stack Overflow 2019 to 2025, State of JS 2016 to 2025, JetBrains 2022 and 2023, HTTP Archive origins every January 2020 to 2026 and 2026-09 |
| `downloads-npm.csv` | Monthly npm downloads 2015-01 to 2026-09 and a 12-month total (2025-07 to 2026-06), one package per row set; `primary=no` marks lineage packages |
| `downloads-pypi.csv` | PyPI downloads without mirrors per complete month in the last 180 days, and the last 30 days |
| `downloads-packagist.csv` | Packagist average daily downloads per month (since 2012), last 30 days and total |
| `downloads-nuget.csv`, `downloads-rubygems.csv` | Total downloads (these registries publish no history) |
| `downloads-crates.csv`, `downloads-hex.csv` | Totals, 90-day downloads and complete months within the 90-day window |
| `github.csv` | Stars, forks and open issues (deps.dev snapshot), OpenSSF Scorecard, latest release from the registry; contributors `n/a` |
| `github-stars-history.csv` | Stars per year: 2026 snapshot only, earlier years `n/a` (see reachability) |
| `jobs.csv`, `jobs-history.csv` | Talent pool (Stack Overflow usage) and job demand (Hacker News "Who is hiring?" mention share per year); salary `n/a` |
| `performance-techempower.csv` | TechEmpower rounds 16 to 23, requests per second per framework, variant and test |
| `performance-startup-memory.csv` | Published startup, memory and throughput figures only, each labelled `vendor-reported` or `published-third-party` |
| `performance-web.csv` | js-framework-benchmark results, runtime size (Bundlephobia), stylesheet size (CSS frameworks) and Core Web Vitals pass rates |
| `concurrency.csv` | Concurrency model per backend framework, with the site page or official website that confirms it |
| `ecosystem.csv` | Latest version and date, current major, major versions in the last five years, releases in the last 12 months, support cycles and LTS from endoflife.date, extension-ecosystem size where a count exists |
| `productivity.csv` | Feature matrix (backend and web) for the frameworks documented on the site, with an evidence page per cell |
| `security.csv` | Advisories per year (OSV), Scorecard overall, security policy and maintenance checks, and deployment targets, real-time, accessibility and AI-tooling coverage on the site |
| `releases.csv` | First release, first stable release of each major version (1 or later) and the end of life of ended cycles; feeds the timelines |
| `radar-scores.csv` | Editorial radar scores (ease of use, ecosystem and maturity, productivity) with a written `basis` per row; computed axes are not stored, `scores.mjs` computes them |
| `recommendations.csv` | Editorial fit (best, good, acceptable) of frameworks for each purpose, with the data each cell relies on; feeds the recommendation matrices |

`reference-app-loc.csv` is **omitted**: the site's framework sections do not contain the same reference application
(a CRUD API with validation and authentication, or a todo app with routing and a form) in a form that `cloc` can count
like for like. Productivity is therefore described by the feature matrix and the editorial score.

No house benchmarks were run (no `bench/` directory). Memory and startup time come only from published figures; SSR
throughput of the meta-frameworks is not measured. A follow-up can add a reproducible Docker harness under
`scripts/framework-charts/bench/`.

## Methods per dataset

### Stack Overflow Developer Survey (`so-2019` to `so-2025`)

* Years with a separate web-frameworks question: 2019 to 2025. 2017 and 2018 mixed frameworks, libraries and tools in
  one question and are not used. The 2026 edition (published, `so-2026`) has no web-frameworks question.
* Values were read from the published result pages: text lists (2019, 2020), HTML tables and their `data-json`
  attributes (2021 to 2023), and the SVG chart labels (2024, 2025). The 2025 admired/desired pairing was checked against
  the page text ("Phoenix ... is the most admired web framework in 2025 (79%)").
* "Loved" and "wanted" (2019 to 2022) and "admired" and "desired" (2023 to 2025) are different questions; they are
  stored under different metric names and not joined into one series.
* Label changes: "React.js" and "React", "Spring" (Spring Framework, 2019 to 2021) and "Spring Boot" (from 2023; no
  Spring answer in 2022), "Angular/Angular.js" (one answer in 2019), "ASP.NET" (classic ASP.NET, stored under
  `aspnet-mvc5`).

### State of JS (`state-of-js`, `devographics-api`)

For every edition, the `js2025` endpoint of the Devographics API returns, per tool, the number of respondents in each
experience bucket (`never_heard`, `heard`, `used`) and their sentiment (`positive`, `negative`). The ratios follow
State of JS's own definitions:

* usage = used / (never_heard + heard + used)
* awareness = (heard + used) / (never_heard + heard + used); `n/a` when an edition publishes no `never_heard` bucket
* retention = used and positive / used with a sentiment
* interest = heard and positive / heard with a sentiment

### JetBrains State of Developer Ecosystem (`jetbrains-2023`)

The 2023 language pages load their chart data from `resources.jetbrains.com/storage/research/rsch_4164_deveco2023/<Language>_en-us.json`.
Values are the share of respondents **who use that language**, so they are only comparable within one language. The
2024 and 2025 editions publish no per-language framework charts.

### Registry downloads

Downloads count CI runs, mirrors and caches, not people, and the units differ between registries. They are only
compared within one registry, never on one axis.

* npm: `api.npmjs.org/downloads/range/<start>:<end>/<package>`, daily values summed per month. The API returns `0` for
  days it has no data (for example every day of `express` before 2021-10, and days in July to September 2026). A day
  with `0` after the package's first publication is treated as missing, and a month with a missing day is `n/a`. The
  12-month total therefore uses 2025-07 to 2026-06, the last complete window.
* PyPI: `pypistats.org/api/packages/<package>/overall?mirrors=false` (about 180 days of daily data) and `/recent`.
* Packagist: `packagist.org/packages/<vendor>/<name>/stats/all.json?average=monthly` returns the **average daily
  downloads** of each month; this unit is kept.
* NuGet, RubyGems: totals only. crates.io: total, 90 days, and daily data for the last 90 days. Hex: total and 90 days.
* Maven Central publishes no per-artifact download counts, so the JVM rows use other signals.

### GitHub (`deps-dev`, `openssf-scorecard`)

`api.deps.dev/v3/projects/github.com%2F<owner>%2F<repo>` gives stars, forks, open issues, licence and the latest OpenSSF
Scorecard run. Releases come from the package registries.

### Job demand (`hn-whoishiring`, `hn-algolia`)

All "Ask HN: Who is hiring? (Month Year)" threads posted by `whoishiring` from 2015-01 to 2026-10 (140 threads;
2015-04 and 2015-05 are missing from the Algolia index). Mention share = top-level comments matching the pattern /
all top-level comments, per year. Patterns (JavaScript regular expressions, case-sensitive unless `i`):

| Framework | Pattern |
|---|---|
| react | `\bReact(\.js\|JS)?\b(?! Native)` |
| angular | `\bAngular(JS\|\.js)?\b` |
| vue | `\bVue(\.js\|JS)?\b` |
| svelte | `\bSvelte(Kit)?\b` |
| nextjs, nuxt | `\bNext\.?js\b` (i), `\bNuxt(\.?js)?\b` (i) |
| jquery, htmx, tailwind | `\bjQuery\b` (i), `\bhtmx\b` (i), `\bTailwind(CSS)?\b` (i) |
| express | `\bExpress\.?js\b`, `Node(.js) / Express` or `Express / Node` (i) |
| nestjs, fastify | `\bNest\.?js\b` (i), `\bFastify\b` (i) |
| django, flask, fastapi | `\bDjango\b` (i), `\bFlask\b`, `\bFastAPI\b` (i) |
| rails | `\bRails\b` or `\bRoR\b` |
| laravel, symfony | `\bLaravel\b` (i), `\bSymfony\b` (i) |
| spring-boot | `Spring Boot`, `Spring Framework/MVC/Cloud/Data/WebFlux`, `Java/Spring` or `Spring/Java\|Kotlin` (i) |
| quarkus, micronaut | `\bQuarkus\b` (i), `\bMicronaut\b` (i) |
| aspnet-core | `ASP.NET Core` or `.NET Core` (i) |
| aspnet-mvc5 | `\bASP\.NET\b` (i; also matches ASP.NET Core postings) |
| blazor, axum, actix-web | `\bBlazor\b` (i), `\baxum\b` (i), `\bActix\b` (i) |
| phoenix | `Elixir/Phoenix`, `Phoenix/Elixir`, `Phoenix LiveView\|Framework` or `LiveView` (i) |
| ember, backbone | `\bEmber(\.js\|JS)?\b`, `\bBackbone(\.js\|JS)\b` (i) |

Frameworks whose names are common words (Bootstrap, Gin, Echo, Fiber, Play, Vapor, Rocket, Phoenix on its own) are
not counted, because the matches would be dominated by unrelated uses. Live job-board counts were not collected.
No source breaks salaries down by framework; language-level salaries are on the programming languages comparison.

### TechEmpower (`techempower-r16` to `techempower-r23`)

`www.techempower.com/benchmarks/results/round<N>/ph.json`. Requests per second = `totalRequests / duration` (15 s),
taking the best concurrency level for JSON, single query, fortunes and plaintext, and the 20-queries level for multiple
queries. Rounds 16 to 23 ran on the Citrine environment. Round 23 (run on 2025-01-30) is the last published round: the
`TechEmpower/FrameworkBenchmarks` repository is archived. TechEmpower implementations are highly tuned and do not
represent typical applications; the fortunes test (database query, ORM or raw, HTML template) is the closest to a real
endpoint. Implementation names per framework are in the `implementation` column.

### Startup and memory (`quarkus-perf-comparison`, `micronaut-home`, `helidon-home`)

Only published figures. The Quarkus team's comparison measures Quarkus and Spring Boot on the same hardware (Spring Boot
figures are labelled `published-third-party` because a competing project measured them). The Micronaut and Helidon
figures come from their home pages without a published method. JIT, native (GraalVM) and Helidon's JLink with AOT cache
are separate variants. The ASP.NET Core Native AOT documentation shows its benchmark only as an image, so it is `n/a`.

### Web performance (`js-framework-benchmark`, `bundlephobia`, `jsdelivr`, `httparchive-techreport`)

* js-framework-benchmark: `webdriver-ts-results/src/results.ts` on `master` (Chrome 156.0.8078.48), recomputed exactly
  as the results page does: median of the `total` duration, factor = value / smallest value among all keyed
  implementations, weighted geometric mean of the nine CPU benchmarks with the page's weights, plain geometric mean of
  the three memory benchmarks. The compressed size (brotli, all implementation files) is the bundle size of the same
  minimal application.
* Bundlephobia: min+gzip size of each runtime package's entry point (`react` is `n/a` because the `react-dom` entry
  excludes the client renderer).
* CSS frameworks: the distributed minified stylesheet from jsDelivr, gzipped with `gzip -9`.
* Core Web Vitals: `cdn.httparchive.org/v1/cwv?technology=<name>&geo=ALL&rank=ALL&start=latest`, share of origins with
  good LCP, CLS and INP (2026-09 crawl), mobile and desktop.

### Ecosystem and maturity (`ecosystem.csv`)

* Versions and dates from the primary registry. Maven dates are the `Last-Modified` header of each version's `.pom` on
  `repo.maven.apache.org` (the `search.maven.org` index stopped updating in mid-2025).
* Major versions in the last five years: first stable release of each major version (≥ 1) between 2021-10-27 and
  2026-10-27; `n/a` for projects still on 0.x versioning.
* Releases in the last 12 months: stable versions published after 2025-10-27 (registries with per-version dates).
* Support cycles, end-of-life dates and LTS from `endoflife.date/api/<product>.json`.

### Security (`osv`, `openssf-scorecard`)

`api.osv.dev/v1/query` per package (the packages are listed in each row's note). Records are deduplicated by CVE
alias; each advisory counts in the year of its CVE id, or of its first publication when it has no CVE. Counts depend on
how much code a package contains and on how actively a project files advisories, so a low count is not proof of
security. Security policy is the Scorecard `Security-Policy` check.

### Site coverage (`site-pages`)

Feature-matrix values are editorial (`yes` = built in or an official first-party module, `partial` = limited or an
official optional add-on, `no` = not provided by the framework itself). Every `yes` and `partial` cell cites the site
page that documents the feature. Deployment targets, real-time, accessibility and AI tooling in `security.csv` say
whether the framework's site section documents them (pattern matches recorded with the page); `n/a` there means "not
documented on the site", not "unsupported".

## Radar scores (0-10, higher is better)

Scores are relative to the frameworks on the same page (CSS frameworks among themselves); 10 means best in the
comparison, not a theoretical maximum. A ratio signal is only used when at least two frameworks on the page have it.
An axis without inputs for a framework is `n/a` (never zero) and the radar shows a gap.

| Axis | Page | Kind | Rule |
|---|---|---|---|
| `popularity` | both | Computed | Mean of the available signals, each scaled to 0-1 and then × 10: Stack Overflow 2025 usage (all respondents) / largest value on the page; registry downloads on a log scale within one registry, `log10(x) / log10(max in that registry)` (npm 12 months, PyPI and Packagist 30 days, crates.io and Hex 90 days, NuGet and RubyGems totals); GitHub stars on the same log scale; HTTP Archive origins on the same log scale (web page) |
| `growth` | both | Computed | Mean of the available signals; each signal is `g = ln(now / then)`, scaled min-max to 0-10 across the frameworks on the page that have it. Signals: Stack Overflow usage 2023 to 2025, npm downloads (12 months to 2026-06 against the 12 months before), Packagist average daily downloads (same windows), State of JS usage 2023 to 2025 |
| `talent_jobs` | both | Computed | Mean of Stack Overflow 2025 professional usage / largest value and Hacker News 2025 mention share / largest value, × 10 |
| `ease_of_use` | both | Editorial | Concepts to learn before the first endpoint or page, amount of configuration, conventions against configuration, quality of the official tutorial and documentation; supporting signals: Stack Overflow admired, State of JS retention |
| `ecosystem_maturity` | both | Editorial | Age, release cadence and support policy (`ecosystem.csv`), governance and backing, size of the extension ecosystem, official integrations (ORM, authentication, testing, OpenAPI, observability) |
| `productivity` | both | Editorial | Batteries included (`productivity.csv`: `yes` = 1, `partial` = 0.5), scaffolding and hot reload, satisfaction (admired/retention) |
| `throughput` | backend | Computed | TechEmpower round 23 fortunes, best variant: `10 × (1 − log10(best / rps) / 2)`, clamped to 0-10 (100 times slower than the best scores 0) |
| `memory` | backend | Computed | RSS after the first request, JIT variant, from the like-for-like Quarkus comparison only (same hardware and method): `10 × (1 − log10(value / smallest))`, clamped (10 times more than the smallest scores 0). Home-page figures without a published method are charted but not scored |
| `startup` | backend | Computed | Boot and first response time from the same comparison, JIT variant, same formula as `memory` |
| `performance` | backend | Computed | Mean of `throughput`, `memory` and `startup` where available |
| `runtime_performance` | web | Computed | js-framework-benchmark CPU weighted geometric mean `f`: `10 × (1 − log2(f) / 3)`, clamped (8 times slower than the fastest scores 0) |
| `bundle_size` | web | Computed | js-framework-benchmark compressed size `s` (CSS frameworks: stylesheet size): `10 × (1 − log10(s / smallest) / 2)`, clamped |
| `performance` | web | Computed | Mean of `runtime_performance`, `bundle_size` and the Core Web Vitals mobile pass rate / best pass rate × 10 |

The computed axes are implemented in `scripts/framework-charts/scores.mjs`. Editorial scores are in `radar-scores.csv`
with a written `basis` per row; they were set by the author of this dataset, with AI assistance, and are a judgement.
