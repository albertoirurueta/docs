# Graphics and game libraries comparison data

Data behind the charts of the comparison page (`modules/ROOT/pages/graphics-games/comparison.adoc`).
Snapshot / check date: **2026-11-01** (the `fetched` column of every row). Values were fetched on that date from the
sources in `sources.csv`. Missing values are the literal `n/a` and are never plotted as zero. A note beginning
"unverified" means the source could not be opened on the check date.

## Files

| File | Content | Source ids |
|---|---|---|
| `current.csv` | Point values: Stack Overflow tag totals, GitHub stars and contributors of the open repositories (Unity and Unreal Engine are `n/a`: no public repository), JetBrains State of GameDev 2025 engine shares by studio type, GDC 2026 engine share (`n/a`, unverified) | `stackexchange`, `github`, `jetbrains`, `gdc` |
| `timeseries.csv` | Stack Overflow questions per tag and year (2010-2025) and npm average weekly downloads per quarter (2020-Q1 to 2026-Q4 to date) for `three`, `@babylonjs/core` and `@webgpu/types` | `stackexchange`, `npm` |
| `releases.csv` | Generations of OpenGL, OpenGL ES, WebGL, WebGPU, Metal, Vulkan, Unity and Unreal Engine with start and end, for the Gantt chart | `khronos`, `w3c-webgpu`, `apple-metal`, `unity-releases`, `unreal-releases` |
| `radar-scores.csv` | Ten hand-assigned 0-10 scores per library with the basis and source of each | none (see rubric) |
| `sources.csv` | The sources with URLs | |

`current.csv` and `timeseries.csv` have the columns `platform, metric, item, date, value, unit, source_url, fetched, notes`
(`platform` holds the library id; `item` narrows the metric: a tag, repository, package or survey group).

## How the data was fetched

* Stack Exchange: `questions?site=stackoverflow&tagged=<tag>&filter=total&fromdate=..&todate=..` per calendar year.
  A tag that did not exist yet in a year is `n/a`, not zero.
* GitHub: `repos/{owner}/{repo}` for stars; contributors are the last page number of `contributors?per_page=1&anon=1`
  (includes anonymous authors). ANGLE is the `google/angle` mirror of the Chromium repository.
* npm: `downloads/point/<start>:<end>/<package>` per quarter, divided by the days in the period and multiplied by 7.
  The last quarter is quarter to date.
* Survey shares: copied from the JetBrains State of GameDev 2025 page; respondents could select several engines. The
  GDC 2026 report page was not available on the check date, so no GDC percentage is recorded.
* Release dates: from the Khronos registries, Apple, Unity and Epic pages cited in `releases.csv`; grouped generations
  (for example OpenGL 4.0 to 4.5) share one bar and some dates are at announcement precision.

## Radar scoring rubric

All ten axes are editorial scores from 0 to 10, higher is always better, and each score carries its basis and a source
in `radar-scores.csv`. Scores are comparable within the APIs, within the engines and, on these axes only, across both.

| Axis | 0-2 | 5 | 9-10 |
|---|---|---|---|
| Productivity | everything written by hand | some helpers or a partial framework | editor, assets and scripting included |
| Control and performance ceiling | black box | some control over the frame | explicit control of memory, synchronisation and pipelines |
| Platform reach | one platform | several desktop or mobile platforms | desktop, mobile, web, consoles and XR |
| Web reach | no browser target | partial browser support | runs natively in browsers |
| Ease of learning | explicit synchronisation before any result | a few days to a first scene | a first result within hours |
| Tooling and debugging | print debugging | third-party tools only | first-party capture, profiler and validation |
| Documentation | sparse | specification plus some tutorials | manual, reference, courses and samples |
| Ecosystem and assets | few libraries | libraries but no marketplace | marketplace and large community |
| Licensing openness | proprietary with royalties | proprietary, free to use | royalty-free open standard |
| XR support | none | partial or via a plugin | first-class OpenXR and WebXR tooling |

## Caveats (also stated on the page)

* APIs and engines are different kinds of product; popularity and engagement figures are never added across both.
* Stack Overflow's site-wide decline since 2023 affects every tag. The `metal` tag is generic and also covers
  non-graphics questions; Unreal Engine has its own forums, so its tag undercounts the community.
* npm counts include continuous integration and mirror traffic and are not comparable with native downloads.
* Survey data (JetBrains) has few AAA respondents and does not state sample size or fieldwork dates on the page.
* Radar scores summarise the evidence; they are not a benchmark.
