# Documentation tools comparison data

Data behind the charts and metric tables of `modules/ROOT/pages/documentation-tools/comparison.adoc`.
Snapshot date: **2026-10-26** (`retrieved` column of `current.csv`). All metrics were re-fetched on that date from the
sources below, not copied from earlier notes. Missing values are the literal `n/a` and are never plotted as zero.

## Files

| File | Content | Source ids |
|---|---|---|
| `tools.csv` | The six tools: the four of the section plus Material for MkDocs and MkDocs as context | none |
| `current.csv` | Stars, forks, issue counts, contributors, latest stable release, downloads, Stack Overflow questions | `github-api`, `gitlab-api`, `npm-downloads`, `pypistats`, `nuget`, `stackexchange` |
| `releases.csv` | Every stable `x.y.z` release with its publication date | `npm-registry`, `pypi-json`, `github-releases` (via `github-api`) |
| `downloads-npm-monthly.csv` | Monthly npm downloads from the first publication to the last complete month (2026-09) | `npm-downloads` |
| `downloads-pypi-weekly.csv` | Weekly PyPI downloads without mirrors, complete Monday-to-Sunday weeks of the last 180 days | `pypistats` |
| `radar-scores.csv` | Eight hand-assigned 0-10 scores per tool with the basis of each | none (see rubric) |
| `adopters.csv`, `trends.csv` | Adopters and Google Trends interest (mostly `n/a`, see caveats) | `docusaurus-showcase`, `google-trends` |
| `sources.csv` | The sources with URLs | |

## How the data was fetched

* GitHub: `repos/{owner}/{repo}` for stars and forks. Open and closed issues come from the search API
  (`type:issue`), because `open_issues_count` also counts pull requests. Contributors are the last page number of
  `contributors?per_page=1&anon=false`. DocFX release dates come from GitHub releases.
* GitLab (Antora): `projects/antora%2Fantora` (stars, forks), `issues_statistics` (open and closed issues) and
  `repository/contributors` (committer count, first page of up to 100; the total is 37).
* npm: `downloads/point/last-week/{package}` and `downloads/range/{start}:{end}/{package}` (daily counts summed per
  month, in chunks under one year). Release dates from the registry document (`time`), stable versions only.
* PyPI: `pypistats.org/api/packages/{package}/recent` (last week, with mirrors) and `/overall?mirrors=false`
  (daily, 180 days, summed per week). Release dates are the earliest upload time per version in the PyPI JSON API.
* NuGet: the search API `totalDownloads` for the `docfx` package (cumulative only) and the flat container for the
  version list.
* Stack Overflow: `tags/{tag}/info` of the Stack Exchange API. Tags: `docusaurus`, `antora`, `mkdocs-material`,
  `mkdocs`, `docfx`; `zensical` has no tag (`n/a`).

## Caveats

* npm, PyPI and NuGet downloads are inflated differently by CI systems, mirrors and caches, so values are compared
  within one ecosystem and never across them. The PyPI weekly series excludes mirrors; the single "last 7 days" PyPI
  figure in `current.csv` includes them.
* Antora is hosted on GitLab: its stars, forks and contributor definition (commit authors) are not comparable with
  GitHub's. Antora is also often run from Docker, which npm does not count.
* The DocFX NuGet total is cumulative since 2016 and has no weekly counterpart, so DocFX is `n/a` in the weekly
  downloads chart.
* Zensical launched publicly on 2025-11-05 (first PyPI upload 2024-11-25); some of its downloads come from Material
  for MkDocs users trying a migration, and it is still alpha (0.0.x).
* Only versions of the form `x.y.z` count as stable releases; two-part versions (for example MkDocs 0.2 and 0.3) are
  excluded, so the first counted MkDocs release is 2014-11-20.
* Docusaurus stable releases start with 2.0.0 (2022-08); the npm series starts with the first publication (2019-04).
* Stars over time are not included: on 2026-10-26 the GitHub stargazers REST endpoint answered 404 and the GraphQL
  `stargazers` connection returned no edges, so `starred_at` dates could not be read. Star History was not used
  because it offers no data API, only images.
* Google Trends has no public API and was not queried; adopters were counted only for Docusaurus (entries of its
  official showcase data file, self-reported and curated).
* `open`/`closed` issue counts are issues only, not pull requests; the closed share depends on stale-bot and
  triage policy.

## Radar rubric (0-10)

Higher is always better. Eight axes are editorial scores read from `radar-scores.csv`, using these anchors: 0 =
not possible, 2 = only by a custom script or an external tool outside the ecosystem, 4 = possible with a plugin or
extra work that is documented, 6 = supported with limits, 8 = good built-in support, 10 = the tool's defining strength.
The `basis` column names the fact behind each score, taken from the pages of the section. Two axes are computed
by `scores.mjs` from the CSVs, so they move when the data is refreshed:

| Axis | Anchors for the hand-assigned scores, or the formula |
|---|---|
| Ease of setup | 10 = one command and no new concepts; 8 = one command plus a config file; 6 = a toolchain beyond the project's language; 4 = several concepts (sources, UI, playbook) before the first page |
| Authoring power | Markup features beyond plain Markdown: includes, reusable content, components, cross references, tabs, admonitions, diagrams and math |
| Multi-repo aggregation | 10 = native, one site from many repositories; 2 = one project only |
| Versioning | 10 = native versions from Git; 8 = built-in versioned docs; 3 = transitional or roadmap only; 2 = none documented |
| API reference | 10 = generated from the platform's own code natively; 4 to 5 = through a plugin or an ecosystem tool; 2 = none |
| Customisation | Depth of theme and layout control: component swizzling, UI bundles, templates, overrides |
| Search | 8 = built in with no service; 6 = official option that must be configured; scores not above 8 because none offers server-side search |
| Ecosystem | Computed: log-scaled repository stars, `(log10(stars) - 2) / 3 * 10` clamped to 0-10 (100 stars = 0, 100,000 = 10). GitLab stars for Antora understate it |
| Build speed | Judgement: Zensical 0.27 to 0.31 s on the Pocket Units site; Docusaurus 7.8 s (webpack) or 2.7 s (Rspack) cold; Antora and DocFX were not timed and sit at the middle value 5 |
| Maintenance health | Computed: mean of release recency (10 minus months since the latest stable release), cadence (stable releases in the 12 months before the snapshot, 12 or more = 10) and the closed share of issues times 10 |

The scores are judgements for orientation, not measurements, and are not weights for a ranking: the right tool
depends on the purpose, which the comparison page discusses.

## Refreshing

1. Re-fetch each source above and rewrite `current.csv`, `releases.csv` and the two downloads files. Update `retrieved`.
2. Re-check `radar-scores.csv` against the section pages if a tool changed, then update this file.
3. Run `npm run charts:docs-tools` and `npm run test:charts:docs-tools`, then update the numbers quoted on the comparison page.
