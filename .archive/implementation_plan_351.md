# Implementation Plan: Add "CMS Comparison" page (WordPress, Webflow and other CMSs)

## Task summary

Source: GitHub issue #351
Base branch: main

Issue [#351](https://github.com/albertoirurueta/docs/issues/351) asks for `modules/ROOT/pages/cms/comparison.adoc`
(nav title **Comparison**), the last child of the **CMS (Content Management System)** nav entry. It compares the two CMSs
documented on the site (WordPress, #290; Webflow, #289) with other CMSs that matter for popularity, growth or history.
Metrics: popularity, growth trends, talent pool and job market, ease of use, ecosystem and maturity, productivity
(features), performance, cost and TCO, security (vulnerabilities, incidents, patching model, support windows),
maintenance effort, and lock-in and data portability. All data is cited, dated and shown as SVG time-series, bar, radar
and scatter charts generated from CSV files kept in the repo, plus a release/support timeline, a recommendation matrix,
a decision flowchart and a closing "which CMS to choose today" summary. The issue body is the specification; re-read it
(`gh issue view 351 --json body`) when writing each section, because the per-metric detail is not repeated here.

Both dependencies have already landed (`faa93bdac` WordPress, `b3daab205` Webflow), so the `cms/` scaffolding exists
(`cms/index.adoc`, `partials/cms-disclaimer.adoc`, `cms.svg`, nav entry). This plan does not recreate it.

**Choices made on the user's behalf**

* **Delivery:** one branch (`feature/351-cms-comparison-page`) and one draft PR against `main`.
* **Data collection:** all metrics are re-fetched at implementation time from the primary sources named in the issue
  (W3Techs, HTTP Archive Tech Report, GitHub, npm/Packagist/PyPI registries, NVD, WordPress.org, Stack Exchange and the
  Stack Overflow survey, vendor pricing pages), in the session scratchpad. Nothing is copied from memory. A value that
  cannot be opened (bot wall, HTTP 403/404) is `n/a` with a note beginning "unverified", never estimated and never
  plotted as zero. One snapshot date applies to all rows (the `fetched` column).
* **CMS set:** fixed in Task 1 and stated on the page with its inclusion criteria. Proposed set: WordPress, Webflow,
  Drupal, Joomla, TYPO3, Wix, Squarespace, Shopify (market-share context only), Ghost, Strapi, Contentful, Sanity,
  Payload, Wagtail, Umbraco, Craft CMS, Adobe Experience Manager (enterprise context). Historical rows (Drupal 7, Joomla
  3) appear in the support-window chart only. Less-documented CMSs get fewer metrics; gaps are `n/a`.
* **Generator:** new `scripts/cms-comparison-charts/` mirroring `scripts/ecommerce-comparison-charts/`, importing the
  shared helpers (`readCsvFiles`, `runChartCli`) and the e-commerce slot renderers instead of copying them.
* **Admonitions:** `partials/cms-disclaimer.adoc` is the only admonition on the page.
* **Cross-issue references:** other issues are mentioned in prose only, never as `xref:`.
* **Task tags:** every task is AsciiDoc/CSV/SVG authoring or a small Node chart script with no matching
  `iru-*-code-one-task` skill, so tasks are untagged and implemented directly.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`cms/comparison.adoc` is the last child of the CMS nav entry and is linked from `cms/index.adoc` (intro, sub-section list), with `:description:`/`:keywords:` updated" | Task 15, Task 16 |
| 2 | "Compares every CMS documented in the section (WordPress, Webflow) plus other popular, growing or historical CMSs, with the inclusion criteria stated on the page and `n/a` for missing data" | Task 1, Task 8 |
| 3 | "Covers popularity, growth, talent pool, ease of use, ecosystem, productivity, performance, cost and TCO, security, maintenance and lock-in, all from cited, dated sources" | Tasks 2 to 6, Tasks 9 to 12 |
| 4 | "Time-series, bar and radar charts (plus timeline, scatter, matrix, flowchart) generated as SVG from CSV data kept in the repository" | Tasks 7, 8, 9, 10, 11, 12, 13 |
| 5 | "Page ends with a summary saying which CMS to choose today and for what purpose, justified by the data" | Task 14 |
| 6 | "Sub-section `comparison-and-decision-guide.adoc` pages and the two frameworks-comparison pages gain a one-line link; root `index.adoc` keywords/description mention the comparison" | Task 16, Task 17 |
| 7 | "Wherever a CMS has a site sub-section its name links to it; every other CMS links to its official website" | Task 8, Task 9 |
| 8 | derived: the Antora build completes with no errors and the `CLAUDE.md` verification greps (images, inline code, Mermaid) print nothing for the new page | Task 18, Task 19 |
| 9 | derived: `npm run test:charts:cms-comparison` passes and every generated SVG is referenced by the page | Task 7, Task 18 |

## Current code state

There is no application code. The Antora root component is `ROOT` (`antora.yml`, `antora-playbook.yml`,
`modules/ROOT/`) with the Mermaid and MathJax extensions; the docs root is the repository root; the host is GitHub
(`albertoirurueta/docs`). No `implementation_plan.md` existed before this plan.

* **CMS section (existing):** `modules/ROOT/pages/cms/index.adoc` (intro names WordPress and Webflow; no
  `== Bibliography` entry for comparison yet), `cms/wordpress/` and `cms/webflow/` (each has
  `comparison-and-decision-guide.adoc`), `partials/cms-disclaimer.adoc`. Nav: `modules/ROOT/nav.adoc` around line 2884,
  `** xref:cms/index.adoc[...]` with `***` children; the new page goes in as the last `***` child, as E-commerce does at
  line 2883.
* **Precedent generator:** `scripts/ecommerce-comparison-charts/` with `generate-charts.mjs` (exports `DATA_DIR`,
  `FILE_PREFIX`, `CHART_DEFINITIONS`, `DATA_FILES`, `loadData`, `generateCharts`), `chart-definitions.mjs`
  (`CHART_BUILDERS`, `SNAPSHOT`), `renderers.mjs` (`renderSlotLine`, `renderSlotBars`, `renderSlotRadar`, `renderGantt`,
  `renderEcommerceChart`), `scores.mjs` (`AXES`, `COMPUTED_AXES`, `computeScores`), `generate-charts.test.mjs` and
  `data/*.csv` plus `data/NOTES.md`. Data rows use `platform, metric, item, date, value, unit, source_url, fetched,
  notes`; `sources.csv` has `id,name,url,used_for`.
* **Precedent pages:** `ecommerce/comparison.adoc` (1,572 lines) and `web/frameworks-comparison.adoc`; section order and
  the "why SaaS CVE counts are not comparable" wording are reused.
* **Scripts in `package.json`:** one `charts:<name>` and one `test:charts:<name>` per generator; two new entries follow
  the same pattern.
* **Back-link targets:** `backend/frameworks-comparison.adoc:25` already links WordPress in its CMS exclusion sentence;
  `web/frameworks-comparison.adoc` has no CMS sentence yet.
* **Previous plans used as precedent:** `.archive/implementation_plan_246.md`, `_263.md`, `_247.md`, `_201.md`, `_289.md`,
  `_290.md`.

## Implementation steps

### Group 1 — Scaffolding and scope (Parallelizable: no — Task 2 and later groups use the CMS set and source ids fixed here)

- [x] Task 1. Fix the CMS set and create the data folder
  - [x] Task 1.1. Create `scripts/cms-comparison-charts/data/NOTES.md` (snapshot date, inclusion criteria, final CMS list
    grouped as in the issue, fetch method per source, the `n/a` and "unverified" rules, the radar rubric stub)
  - [x] Task 1.2. Create `scripts/cms-comparison-charts/data/sources.csv` with one row per primary source
    (`w3techs, httparchive, github, npm, packagist, pypi, nvd, kev, wpscan/patchstack, wordpress-org, stackexchange,
    stackoverflow-survey, vendor pricing pages, lifecycle pages`) and the source ids later rows cite

### Group 2 — Data (Parallelizable: yes — one CSV per task, no shared files)

- [x] Task 2. `popularity.csv`: W3Techs CMS share (current and yearly history where published), HTTP Archive origins per
  month, GitHub stars/forks/contributors, registry downloads, Stack Exchange tag questions per year
- [x] Task 3. `talent.csv`: Stack Overflow survey usage, job-posting counts and developer-population proxies, each dated
  and cited; `n/a` where no public source exists
- [x] Task 4. `performance.csv`: HTTP Archive Core Web Vitals pass rate (mobile and desktop, monthly) and Lighthouse medians
  per CMS
- [x] Task 5. `security.csv` and `incidents.csv`: NVD CVEs per year split core vs ecosystem, advisories, Patchstack
  shares, notable incidents with CVSS and KEV status; `support-windows.csv`: supported-release phases (WordPress branches,
  Drupal 10/11, Joomla 4/5/6, TYPO3 LTS, Ghost, Umbraco LTS, Drupal 7 and Joomla 3 EOL)
- [x] Task 6. `cost.csv`: plan prices and fees (EUR; USD only if sourced), hosting-cost assumptions linked to
  `cloud/comparing-cloud-providers.adoc`, TCO scenarios inputs (small site, content site, business site, enterprise);
  `features.csv`: feature-matrix flags with source per row

### Group 3 — Generator (Parallelizable: no — chart definitions depend on `scores.mjs` and the CSV schema)

- [x] Task 7. Build `scripts/cms-comparison-charts/`
  - [x] Task 7.1. `scores.mjs`: `CMS`, `CMS_NAMES`, `CMS_SLOT`, `AXES` (the issue's metrics), `COMPUTED_AXES`
    (performance, ecosystem, popularity from the CSVs) against editorial axes (ease of use, features, maintenance,
    lock-in) with `radar-scores.csv` holding the basis and source of each editorial score
  - [x] Task 7.2. `chart-definitions.mjs`: time series (market share, Core Web Vitals, CVEs per year, downloads, questions),
    bar charts (current CWV, Lighthouse, advisories, cost scenarios), radar charts per group and for all, popularity-vs-
    growth and performance-vs-ease scatter charts, support-window Gantt
  - [x] Task 7.3. `renderers.mjs`: thin wrapper re-exporting the e-commerce slot renderers; `generate-charts.mjs` with
    `FILE_PREFIX = 'cms-comparison-'`
  - [x] Task 7.4. `generate-charts.test.mjs` (data schema, no `n/a` plotted as zero, every definition renders, every source id
    exists in `sources.csv`)
  - [x] Task 7.5. Add `charts:cms-comparison` and `test:charts:cms-comparison` to `package.json`, run both, and commit the
    generated `modules/ROOT/images/cms-comparison-*.svg`
  - [x] Task 7.6. Run the tests by delegating to `Agent({subagent_type: "iru-gate-runner"})` with
    `npm run test:charts:cms-comparison`
    - Done: 47 SVGs generated into `modules/ROOT/images/cms-comparison-*.svg` (not committed, per coordinator); 18/18 tests pass via iru-gate-runner. Added `data/radar-scores.csv` (112 editorial rows with basis and source), rewrote the NOTES.md radar rubric, fixed one empty value in `popularity.csv` (ghost origins 2021-02 now n/a). TCO is not charted (EUR inputs, no sourced USD/EUR rate).

### Group 4 — The page (Parallelizable: no — all tasks write sections of the same file, `cms/comparison.adoc`)

- [x] Task 8. Create `cms/comparison.adoc`: front matter (`:description:`, `:keywords:`), cms-disclaimer include, intro,
  "Scope and inclusion criteria", "How metrics, scales and scores were assigned", snapshot date, and the summary
  comparison table (WordPress and Webflow linked to their sub-sections, other CMSs to their official sites)
- [x] Task 9. Popularity, growth and talent pool sections with time-series and bar figures, scatter chart and
  interpretation, linking `web/php-laravel/*`, `web/django/*`, `web/aspnet/*`, `web/nextjs/*` for the matching stacks
- [x] Task 10. Ease of use, ecosystem, maturity and features sections: feature matrix (including the "AI features" row
  linking `ai/mcp/*`), accessibility row linking `web/accessibility.adoc`
- [x] Task 11. Performance section (CWV over time, current pass rate, Lighthouse) linking `web/media-optimization/*`
- [x] Task 12. Security, maintenance and support-window sections: CVEs per year core vs ecosystem, advisories, incidents,
  "why SaaS CVE counts are not comparable", Gantt chart, patching-model table
- [x] Task 13. Cost and TCO (scenarios, hosting assumptions linking `cloud/comparing-cloud-providers.adoc`), lock-in and
  data portability, scores on all axes with radar charts per group, and the strengths-and-weaknesses table
- [x] Task 14. Decision flowchart (Mermaid, stereotypes written as entities if any), recommendation matrix, "Summary and
  recommendations" saying which CMS to choose today and for what, "when you do not need a CMS" pointer to
  `documentation-tools/comparison.adoc`, framework alternatives, and `== Bibliography`

### Group 5 — Integration (Parallelizable: yes — each task edits a different file)

- [x] Task 15. `modules/ROOT/nav.adoc`: add `*** xref:cms/comparison.adoc[Comparison]` as the last child of the CMS entry
- [x] Task 16. `cms/index.adoc`: link the page in the intro and sub-section list, add new main sources to its
  `== Bibliography` where missing, update `:description:` and `:keywords:`; add the one-line `xref:` in
  `cms/wordpress/comparison-and-decision-guide.adoc` and `cms/webflow/comparison-and-decision-guide.adoc`
- [x] Task 17. Root `modules/ROOT/pages/index.adoc` (`:description:`, append `CMS comparison` to `:keywords:`); one-line
  link beside the CMS exclusion sentence in `web/frameworks-comparison.adoc` and, if missing, `backend/frameworks-comparison.adoc`

### Group 6 — Verification (Parallelizable: yes — read-only checks)

- [x] Task 18. Run `npx antora antora-playbook.yml` and the `CLAUDE.md` greps (block image macros, inline macros,
  `<p>image::` leak, alt-text comma check on the changed files, inline-code substitution scan on `build/site/cms`);
  confirm every `cms-comparison-*.svg` is referenced and every `image::` target exists
- [x] Task 19. Run `npm run validate:mermaid` (after the one-off `npm i --no-save mermaid@11 jsdom`), scan the rendered text
  of the new page for stray backticks, `[[x]]` and bare `+`, and run `/iru-check-security` on the changed files
  (detect-secrets findings in this docs repo are false positives, per project memory)
