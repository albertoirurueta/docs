# E-commerce platforms comparison data

Data behind the charts and metric tables of the e-commerce comparison page (`modules/ROOT/pages/ecommerce/comparison.adoc`).
Snapshot / check date: **2026-10-27** (the `fetched` column of every row). All metrics were re-fetched on that date
from the sources in `sources.csv`, not copied from earlier notes. Missing values are the literal `n/a` and are never
plotted as zero. A note beginning "unverified" means the source could not be opened from the authoring environment
(bot wall or HTTP 403/404) or comes from secondary summaries.

## Files

Every row of `popularity.csv`, `performance.csv`, `security.csv` and `cost.csv` has the columns
`platform, metric, item, date, value, unit, source_url, fetched, notes` (`item` narrows the metric: a repository, an npm
package, a Stack Exchange tag, a CVE series, a plan).

| File | Content | Source ids |
|---|---|---|
| `popularity.csv` | W3Techs shares (current; yearly history exists only for Shopify and WordPress), Store Leads live stores per quarter, HTTP Archive origins per month, Web Almanac 2025 e-commerce shares, GitHub stars/forks/contributors, npm downloads per year, WordPress.org WooCommerce installs/downloads/rating/tag count, Stack Exchange questions per year, marketplace sizes | `w3techs`, `storeleads`, `httparchive`, `webalmanac`, `github`, `npm`, `wporg`, `stackexchange` |
| `performance.csv` | Core Web Vitals pass rate (mobile and desktop, monthly 2020-01 to 2026-09), latest LCP/INP/CLS good rates, Lighthouse medians, Web Almanac 2025 CWV and Lighthouse, the 2024-03 INP definition break | `httparchive`, `webalmanac`, `web-dev-inp` |
| `security.csv` | NVD CVEs per year (core and ecosystem series), GitHub and Friends-of-Presta advisories per year, Adobe APSB bulletins per year, Patchstack shares | `nvd`, `github`, `github-advisories`, `friendsofpresta`, `adobe-apsb`, `patchstack` |
| `incidents.csv` | Notable incidents with CVE, CVSS v3.1 base score, date and KEV status | `nvd`, `kev`, `magecart` |
| `cost.csv` | Shopify plan prices and fees (EUR; USD unverified), WooPayments fees, Adobe Commerce quote-based note, G2/Capterra ratings (n/a, unverified) | `shopify-pricing`, `woopayments`, `g2-capterra` |
| `support-windows.csv` | Release lines with start/end of each support phase, for the Gantt charts (PrestaShop, Magento 2.4.x, WooCommerce releases since 2024, Shopify API versions) | `adobe-lifecycle`, `prestashop-lifecycle`, `woo-releases`, `shopify-versioning` |
| `radar-scores.csv` | Eight hand-assigned 0-10 scores per platform with the basis and source of each | none (see rubric) |
| `sources.csv` | The sources with URLs | |

## How the data was fetched

* HTTP Archive Tech Report: `https://cdn.httparchive.org/v1/{adoption,cwv,lighthouse}?technology=<Name>&geo=ALL&rank=ALL&start=2020-01-01&end=latest`.
  The pass rate is `good_number / tested` of the `overall` vital. The latest month is 2026-09 (October is not published yet).
* Store Leads: the quarterly "active stores" table of `https://storeleads.app/reports/<platform>`; the last quarter (2026-Q4) is quarter to date.
* W3Techs: the `details/cm-<system>` pages (current values) and `history_overview/content_management/all/y` (yearly values for systems above 1% of all sites: Shopify and WordPress).
* GitHub: `repos/{owner}/{repo}` for stars and forks; contributors are the last page number of `contributors?per_page=1&anon=1`, which includes anonymous and unlinked authors (without `anon=1` the counts are about a seventh of that).
* npm: `downloads/range` (daily, summed per year) for `@shopify/*` and `downloads/point/<year>:<year>` for `@woocommerce/*`; 2026 is year to date up to 2026-10-26. PrestaShop and Magento are distributed with Composer, so there is no npm count.
* WordPress.org: `plugins/info/1.2` with `fields[active_installs]=1` (a rounded band, "7,000,000+"), the tag query for the plugin count and `stats/plugin/1.0/downloads.php?slug=woocommerce&limit=180` summed per Monday-to-Sunday week (the API returns only about 180 days).
* Stack Exchange: `questions?site=<site>&tagged=<tag>&filter=total&fromdate=..&todate=..` per year; the Magento chart sums the `magento` and `magento2` tags (a question with both tags counts twice).
* NVD: `cves/2.0?virtualMatchString=<cpe prefix>` or `keywordSearch=<word>`, paginated and counted by publication year. Series: `magento_union` (the CPEs magento:magento, adobe:commerce and adobe:magento_open_source, de-duplicated), `prestashop_core_cpe`, `woocommerce_core_cpe`, `woocommerce_vendor_cpe` (all Woo vendor products), `shopify_vendor_cpe` and the `keyword_*` series.
* Advisories: `repos/PrestaShop/PrestaShop/security-advisories`, the global advisory database for composer packages, the `_posts` files of the Friends-of-Presta repository, and the Adobe HelpX bulletin list.
* Incidents: CVSS from NVD (v3.1 base score), KEV status from the CISA catalogue JSON. Magecart is not a single vulnerability and has no CVSS or KEV status.
* Releases: GitHub releases API (PrestaShop, WooCommerce), the Adobe lifecycle policy (Magento), the Shopify API versioning page.

## Caveats (also stated on the page)

* The market-share sources count different things (share of top sites, live stores, Chrome-visited origins), so their absolute values are never plotted on one axis.
* INP replaced FID in the Core Web Vitals definition on 2024-03-12: pass rates before and after are not strictly comparable (the charts mark the break).
* Shrinking PrestaShop and Magento populations may bias their pass rates (survivor bias). WooCommerce results include the whole WordPress stack.
* Stack Overflow's site-wide decline since 2023 affects every tag.
* The WooCommerce keyword CVE surge reflects WordPress CNAs (Patchstack, Wordfence, WPScan) issuing CVEs in bulk. CVE counts measure disclosure, not real risk, and are not comparable between SaaS and self-hosted software. The GitHub global advisory spike for Magento in 2022 is a backfill date.
* PrestaShop support windows are inferred from the minor release lifecycle policy; PrestaShop publishes no end-of-life dates.
* G2 and Capterra could not be opened (HTTP 403 to automated clients); their ratings would be self-selected user reviews and are recorded as `n/a (unverified)`. They feed no score.

## Radar rubric

Each axis is a score from 0 to 10, higher is better. Two axes are computed from the CSV data (`scores.mjs`), eight are
assigned by hand with the evidence recorded in `radar-scores.csv` (`basis` and `source_url`). The scores summarise
the evidence on the page; they are not a benchmark and moving a score by one point is within the uncertainty of the method.

| Axis | Kind | How it is scored |
|---|---|---|
| Ease of use | hand | 9-10 hosted with no infrastructure work; 7-8 simple install on common hosting; 5-6 installer plus own hosting and module choices; 3-4 specialist infrastructure and long learning curve; 0-2 expert-only |
| Low maintenance effort (inverted: 10 = least effort) | hand | 9-10 vendor patches and upgrades the platform; 7-8 occasional merchant action; 5-6 merchant applies minor releases and module updates; 3-4 frequent security bulletins, heavy upgrades; 0-2 continuous dedicated effort |
| Performance | computed | mean of the mobile and desktop CWV pass rate divided by 10 and the mobile and desktop median Lighthouse performance score times 10 (latest HTTP Archive month) |
| Tools and functionality | hand | built-in features, APIs and developer tooling, marketplace breadth: 9-10 broad core plus enterprise features; 7-8 broad core or very large app ecosystem; 5-6 solid catalogue/checkout, extras from paid modules; below 5 limited |
| Security posture | hand | who patches, vendor response, exploited vulnerabilities (CISA KEV), attack surface of third-party code; 8-10 centrally patched SaaS; 5-7 predictable patches but exploited or module-heavy; 3-4 very large third-party plugin attack surface |
| Low cost | hand | 10 = lowest total cost of entry; 8-9 free software, moderate infrastructure; 5-6 subscription plus fees; 3-4 heavy infrastructure or quote-based licence; 1-2 enterprise pricing |
| Customisation flexibility | hand | how much of the stack can be changed: 9-10 open code with deep extension points; 7-8 open code; 5-6 constrained by the platform (checkout, data model) |
| Scalability | hand | 9-10 managed elastic infrastructure; 7-8 designed for large catalogues, needs tuning; 5-6 depends on self-chosen hosting and caching |
| Ecosystem | computed | mean of three log-scaled measures: live stores (10,000 = 0, 10,000,000 = 10), Stack Exchange questions of the platform's tags (1,000 = 0, 1,000,000 = 10), GitHub stars of the main repositories (100 = 0, 100,000 = 10) |
| Headless readiness | hand | 9-10 documented storefront API and framework; 7-8 full APIs, no official storefront framework; 5-6 data APIs only |
