# CMS comparison data

Data behind the charts and metric tables of the CMS comparison page (`modules/ROOT/pages/cms/comparison.adoc`).
Snapshot / check date: **2026-10-29** (the `fetched` column of every row). All metrics are re-fetched on that date
from the sources in `sources.csv`, never copied from memory or earlier notes. Missing values are the literal `n/a`
with a note, never estimated and never plotted as zero. A note beginning "unverified" means the source could not be
opened from the authoring environment (bot wall, HTTP 403/404/429) or comes from secondary summaries.

## Inclusion criteria

A CMS is included if it ranks in at least one main source (W3Techs share, HTTP Archive origins, Stack Overflow
Developer Survey, registry downloads, GitHub stars), or matters for historical or enterprise context. The two CMSs
documented on this site (WordPress, Webflow) are always included. CMSs that are not documented on the site may get
fewer metrics where data is scarce; gaps are `n/a`. Static-site generators (Hugo, Jekyll, Eleventy, Gatsby) and
e-commerce platforms (see `ecommerce/comparison.adoc`) are out of scope.

## Final CMS list (17 CMSs)

| Group | CMSs |
|---|---|
| Traditional open-source (self-hosted) | WordPress (documented), Drupal, Joomla, TYPO3, Craft CMS |
| Hosted website builders (SaaS) | Webflow (documented), Wix, Squarespace |
| Headless and API-first | Contentful, Strapi, Sanity, Payload |
| Enterprise DXP and other stacks | Adobe Experience Manager (enterprise context), Umbraco (.NET), Wagtail (Python/Django), Ghost (Node.js publishing) |
| Market-share context only | Shopify (market share only; compared in `ecommerce/comparison.adoc`) |
| Historical context (support-window chart only) | Drupal 7 (EOL 2025-01-05), Joomla 3 (EOL 2023-08-17) |

Considered and left out for lack of reachable primary data or marginal rank: Statamic, Concrete CMS, Duda, HubSpot
Content Hub, Directus, Storyblok, Hygraph, Sitecore, Optimizely CMS, Blogger, Tilda, Weebly, Movable Type, Plone.
WordPress.com is covered as the hosted variant of WordPress in the cost scenarios only.

## Source ids

Every data row cites one or more ids from `sources.csv`, `;`-separated, in a `source` column, and has `fetched`
(retrieval date) and `as_of` (date or edition of the value) columns. The ids by family:

| Family | Source ids |
|---|---|
| Popularity | `w3techs`, `httparchive`, `httparchive-report`, `webalmanac`, `github`, `npm`, `packagist`, `pypi`, `nuget`, `wporg`, `wporg-stats`, `drupal-usage`, `stackexchange`, `stackoverflow-survey`, `hn-hiring` |
| Performance | `httparchive`, `webalmanac`, `crux` |
| Security | `nvd`, `kev`, `patchstack`, `wpscan`, `wordfence`, `github`, `drupal-security`, `joomla-security`, `typo3-security` |
| Cost | `webflow-pricing`, `wix-pricing`, `squarespace-pricing`, `wpcom-pricing`, `ghost-pricing`, `strapi-pricing`, `contentful-pricing`, `sanity-pricing`, `payload-pricing`, `craft-pricing`, `umbraco-pricing` |
| Support windows | `endoflife`, `wp-lifecycle`, `drupal-lifecycle`, `joomla-lifecycle`, `typo3-lifecycle`, `umbraco-lifecycle`, `wagtail-lifecycle`, `aem-lifecycle`, `github` |

## How the data is fetched

* HTTP Archive Tech Report: `https://cdn.httparchive.org/v1/{adoption,cwv,lighthouse}?technology=<Name>&geo=ALL&rank=ALL&start=2020-01-01&end=latest`.
  The pass rate is `good_number / tested` of the `overall` vital. INP replaced FID on 2024-03-12, so pass rates before and
  after are not strictly comparable (charts mark the break).
* W3Techs: the `details/cm-<system>` pages (current values) and `history_overview/content_management/all/y` (yearly values only for systems above 1% of all sites).
* GitHub: `repos/{owner}/{repo}` for stars and forks; contributors are the last page number of `contributors?per_page=1&anon=1`.
* npm: `downloads/range` summed per year; the current year is year to date. Packagist, PyPI Stats and NuGet give installs or downloads for the Composer, Python and .NET CMSs; these counts are not comparable between registries and are never on one axis.
* WordPress.org: `plugins/info/1.2` for plugin counts and active install bands (rounded, for example "7,000,000+").
* Stack Exchange: `questions?site=<site>&tagged=<tag>&filter=total&fromdate=..&todate=..` per year. Stack Overflow's decline since 2023 affects every tag.
* Stack Overflow survey: the published tables of each year used; salary only where broken down by CMS.
* Hacker News: Algolia search over "Who is hiring?" threads per month (a demand proxy biased to startups).
* NVD: `cves/2.0?virtualMatchString=<cpe prefix>` or `keywordSearch=<word>`, counted by publication year. CVE counts measure disclosure, not real risk, and are not comparable between SaaS and self-hosted software. KEV status comes from the CISA catalogue JSON.
* Prices: each vendor pricing page, read on the snapshot date. Quote-only products (Adobe Experience Manager, enterprise tiers) are `n/a (quote only)`.
* Lifecycle: endoflife.date and each CMS's official release and support policy.

## The `n/a` and "unverified" rules

* `n/a` is written in the `value` column with the reason in `notes`; charts draw a gap or an `n/a` label, never zero.
* "unverified" starts the note when the source did not open from the authoring environment or is a secondary summary. Known cases on 2026-10-29:
  * Contentful pricing (`contentful-pricing`): HTTP 429 on every attempt, so Contentful prices are `n/a (unverified)`.
  * Adobe Experience Manager product and pricing pages (`business.adobe.com`): connection failed; only the `experienceleague.adobe.com` release information opened. AEM prices are `n/a (quote only)`.
  * Wordfence Intelligence (`wordfence`): HTTP 202 bot wall, no row depends on it.
  * `joomla.org` roadmap (HTTP 404), `docs.joomla.org` (HTTP 403), Craft CMS support-policy pages (HTTP 404), Strapi release-notes page (HTTP 404) and `endoflife.date` for Ghost (404): replaced by the sources listed in `sources.csv`, or `n/a`.
* All other source URLs in `sources.csv` were opened with HTTP 200 on 2026-10-29 (API endpoints were opened with a sample query).

## Caveats (also stated on the page)

* The market-share sources count different things (share of top sites, origins visited in Chrome, registry downloads, GitHub stars), so absolute values from different sources are never plotted on one axis.
* Hosted SaaS CMSs (Webflow, Wix, Squarespace, Contentful, Sanity) have no public repository, registry or advisory data; their GitHub, registry and CVE columns are `n/a`.
* Self-hosted CMSs with large plugin ecosystems have a larger attack surface; CVE counts are not comparable across hosting models.

## Radar rubric

Twelve axes, each scored 0-10 with higher always better. Five are **computed** in `scores.mjs` from the CSV data and
seven are **editorial**, one row per CMS and axis in `radar-scores.csv` with a `basis` (the rubric applied and the
evidence) and `source` ids. A CMS whose inputs are missing gets no score (`null`, drawn as a gap), never zero.
`radar-scores.csv` rows are `n/a` only where no sourced input exists (Contentful and AEM cost).

| Axis | Kind | Rule |
|---|---|---|
| Popularity | computed | mean of the available log scores of the W3Techs share of all sites (0.01% = 0, 50% = 10) and HTTP Archive mobile origins (100 = 0, 5,000,000 = 10), latest values. It counts visible fingerprints, so headless CMSs are underestimated; Payload has neither input (null) |
| Growth | computed | ratio of the latest HTTP Archive mobile origins to the same month three years earlier: `5 + 5 * log2(ratio)` clamped to 0-10 (unchanged = 5, doubled = 10, halved = 0); null without both months |
| Talent pool (Stack Overflow) | computed | log score of the Stack Overflow questions asked with the CMS tag in the last two complete years before the snapshot (`LAST_COMPLETE_YEAR - 1` and `LAST_COMPLETE_YEAR`, now 2024 and 2025; 10 = 0, 10,000 = 10). It measures developer activity only; the job-market rows of `talent.csv` cover too few CMSs to score |
| Ecosystem and maturity | computed | mean of the available log scores of the GitHub stars of the main repositories (1,000 = 0, 100,000 = 10; the `MIRROR_REPOS` of WordPress, Drupal and TYPO3 and the secondary `wordpress-develop` repository excluded, so those three use the Stack Overflow part only) and the total Stack Overflow questions of the tag (100 = 0, 300,000 = 10); hosted CMSs have no repository, so only the second input counts |
| Performance | computed | mean of the mobile and desktop Core Web Vitals pass rates divided by 10 and of the mobile and desktop median Lighthouse performance scores times 10 (latest HTTP Archive month); null when one input is missing (Payload) |
| Ease of use (editors) | editorial | can editors write, preview, schedule and approve without a developer; the visual building, draft preview, scheduling and workflow rows of `features.csv` are quoted in the basis |
| Ease of use (developers) | editorial | concepts to learn before a first custom template or content type, local setup, API and docs; the content modelling, config-as-code and REST rows of `features.csv` are quoted |
| Features / productivity | editorial, rule-based | points per feature of the 19-row matrix in `features.csv` (yes 1, by extension 0.7, partial 0.5, n/a 0) divided by 19 times 10; `n/a` means no evidence was found, so it is not credited, and scope differs by CMS type (the basis lists the counts) |
| Low cost | editorial | 10 = free software with low hosting cost; lower for paid plans and licences from `cost.csv`; USD and EUR prices are not converted. `n/a` where no sourced price exists (Contentful unverified, AEM quote only) |
| Security posture | editorial | patching model, advisory process, severity and exploitation history (`incidents.csv`, KEV) and the NVD core series, never raw CVE counts, which are not comparable between SaaS and self-hosted CMSs |
| Low maintenance effort | editorial | 10 = vendor-managed with no customer patching; lower for self-hosted CMSs with frequent major upgrades and short support windows (`support-windows.csv`) |
| Portability (low lock-in) | editorial | licence, data format, export and ability to change host; the `export_lockin` row of `features.csv` is quoted |

Scores summarise the evidence on the page; they are not a benchmark and one point is within the uncertainty of the method.
The total cost of ownership is not scored, but it is charted (`tco-self-hosted`) for a self-hosted free-software CMS: labour
(`tco_assumption_maintenance_hours_per_month` x `tco_assumption_hourly_rate_eur` x 12 x `tco_assumption_years`), paid
extensions and hosting (the mean of the three providers' `hosting_cost_monthly_usd`, converted with
`ecb_reference_rate_usd_per_eur`, the ECB reference rate of 2026-10-28, source `ecb-exr`). Plan prices stay in the currency the
vendor publishes and are not converted.

Every year range of the charts and of the talent score is derived from `SNAPSHOT` in `scores.mjs` (`SNAPSHOT_YEAR`,
`LAST_COMPLETE_YEAR`), so a refresh only changes that constant and the data.

## Chart conventions

* Palette slot (colour, dash and marker) of a CMS is its position inside its group (`CMS_SLOT` in `scores.mjs`), so a CMS looks the
  same in every figure of its group. Figures that mix groups colour by group (bars, scatter charts) or assign slots by position in
  that figure and say so in the description (W3Techs history, npm, Stack Overflow survey usage, Hacker News, Lighthouse history,
  CVE and advisory charts of the other CMSs, the support-window Gantt chart, the WordPress against Webflow and mainstream radars).
* Open-ended support windows (`end` is `n/a`) run to the right edge with an arrow; an open end that is followed by a later phase of
  the same line stops where that phase begins.
* Zero is drawn only where the CSV holds the number 0 (CVE counts, free software, a computed score clamped at 0). `n/a` is a gap in
  lines and radars and an `n/a` label in bars.
