# Cloud providers comparison data

Data behind the charts and tables of `modules/ROOT/pages/cloud/comparing-cloud-providers.adoc` (issue #201).
Snapshot date: **2026-10-26** (the `retrieved` column of every CSV). Providers are `aws`, `azure` and `google-cloud`.
Missing values are the literal `n/a` and are never plotted as zero. Every row has a `source` (one or more ids from
`sources.csv`, separated by `;`) and a `retrieved` date. `as_of` is the date of the underlying document when it differs
from the retrieval date.

## Files

| File | Content | Owner | Source ids (see `sources.csv`) |
|---|---|---|---|
| `service-mapping.csv` | 31 service categories with the equivalent AWS, Azure and Google Cloud service | this task | `svc-*` |
| `tooling.csv` | SDK languages, CLIs, IaC, Terraform and Pulumi provider popularity, SDK downloads, marketplace size | this task | `sdkref-aws`, `azure-sdk-releases`, `gcp-client-libraries`, `github-api`, `terraform-registry`, `pypistats`, `npm-downloads`, `*-marketplace` |
| `learning.csv` | Free trial and free tier, certifications, learning catalogue, Stack Overflow usage, admired and desired | this task | `aws-free`, `azure-free`, `gcp-free*`, `*-cert`, `ms-learn-catalog`, `so-*` |
| `other-metrics.csv` | SLAs, compliance counts, support plan prices, incidents, sustainability, job demand | this task | `sla-*`, `*-compliance`, `*-support`, `*-status*`, `*-sustainability` |
| `radar-scores.csv` | Six 0-10 scores per provider with the basis of each (four computed by `scores.mjs`, two editorial) | this task | none (see rubric) |
| `recommendations.csv` | Workload against provider fit (best, good, acceptable) with the relative index and rationale, computed by `matrix.mjs` from the other CSVs; feeds the recommendation matrix figure | chart generator | see the `rationale` column |
| `market-share.csv`, `revenue.csv`, `adoption.csv`, `analyst.csv` | Popularity time series | popularity task | see `source` column |
| `pricing.csv`, `free-tiers.csv`, `discounts.csv`, `reference-architectures.csv`, `reference-totals.csv` | Pricing comparison, including the worked example lines and totals | pricing task | see `source` column |
| `regions-over-time.csv`, `footprint.csv`, `sovereign.csv`, `service-availability.csv` | Regions and availability | regions task | see `source` column |
| `sources.csv` | One row per source id: title, publisher, URL, date, what it was used for | all | |

## Rubric for the radar scores

Scale 0-10, higher is better, 10 means best of the three on that axis (not a theoretical maximum). Two kinds of axis:

| Axis | Kind | Rule |
|---|---|---|
| `popularity` | Computed | `10 x mean(share / max share, usage / max usage)`. Share: Synergy 2026-Q2 from `market-share.csv` (AWS 28, Azure 20, Google Cloud 15). Usage: `learning.csv` `so_usage_2026` (41.8, 25.1, 24.5). Result 10.0, 6.6, 5.6 |
| `ecosystem_breadth` | Computed | `10 x mean(service coverage, SDK coverage)`. Service coverage: share of the 31 `service-mapping.csv` categories where the provider has a service (`n/a`, `None` and empty cells count as no service; 31, 30, 24). SDK coverage: `tooling.csv` `official_sdk_languages` divided by the largest value (11, 10, 9). Result 10.0, 9.4, 8.0 |
| `price_competitiveness` | Computed | `10 x mean over the four reference architectures of (cheapest monthly total / own total)`. Totals are the sums of `reference-totals.csv` (static site, simple dynamic site, microservices, AI service). Free tiers, discounts and support prices are not like for like and are not part of the score. Result 9.8, 10.0, 8.4 |
| `regional_coverage` | Computed | `10 x mean(regions / most regions, zones / most zones, sovereign categories / 3)`. Regions and zones: the generally available `public` regions of `footprint.csv` and the sum of their availability zones (AWS 34 and 109, Azure 58 and 124, Google Cloud 43 and 130). China, government and sovereign partitions are excluded from these counts for every provider, because the providers' headline totals do not agree on them (the AWS total of 39 includes GovCloud, China and the European Sovereign Cloud; the Azure regions list of 58 excludes China and Government), and they are already scored by the third term. Sovereign categories: how many of China, government and sovereign offerings in `sovereign.csv` have a status that starts with available (3, 2, 2). Zone definitions differ per provider. Result 8.1, 8.7, 8.0 |
| `ease_of_use` | Editorial | Criteria: trial credit and length, Stack Overflow admired score, size of first-party learning catalogue, certification path size. Evidence in `learning.csv`; differences are small and the score is a judgement |
| `ai_offering` | Editorial, low confidence | Criteria: managed ML platform, foundation-model platform, prebuilt AI services, AI certifications. No model-quality or market data was fetched, so the scores are coarse. `service-availability.csv` (frontier models in six regions) was reviewed and is not part of the score because it covers six regions and three model families only |

The four computed axes are produced by `scripts/cloud-comparison-charts/scores.mjs`; run
`node scripts/cloud-comparison-charts/update-derived-data.mjs` after changing an input CSV to rewrite their rows in
`radar-scores.csv` (editorial rows are kept) and `recommendations.csv`. A test fails when either file is stale.

Scores changed when `price_competitiveness` and `regional_coverage` were recomputed from the pricing and footprint data
(old editorial value, new computed value): price competitiveness AWS 6 to 9.8, Azure 6 to 10.0, Google Cloud 7 to 8.4;
regional coverage AWS 8 to 8.1, Azure 9 to 8.7, Google Cloud 8 to 8.0 (AWS was 8.8 until the region and zone counts were moved to the same public-only basis for all three). The editorial price score had rated Google Cloud
highest on trial credit and free tier size, while the list prices of the reference architectures make it the most
expensive of the three.

Evidence for each score is in the `basis` column of `radar-scores.csv`. Scores are rounded to one decimal. Editorial
scores were set by the author of this dataset, not by the providers or an analyst.

## Evidence summary

* Popularity: Synergy share and Stack Overflow usage (secondary source for 2026, see caveats).
* Ecosystem: 31 of 31, 30 of 31 and 24 of 31 service categories mapped; Google's own comparison page and Microsoft's
  pages list no Google equivalent for web PaaS, workflow, cache, document and speech AI, IoT, hybrid and ground stations.
  Terraform provider downloads (8.14 billion, 2.08 billion, 2.70 billion) are in `tooling.csv` but are not part of the
  score.
* Learning: trial $200 over 6 months (AWS), $200 over 30 days (Azure), $300 over 90 days (Google Cloud); 11, 20 and 13
  certifications; Azure 283 learning paths and 1,161 modules; Stack Overflow admired 45.8, 43.2, 42.6.
* Pricing: support plan minimums in `other-metrics.csv` were the only pricing data when the editorial price score was first set; the score is now computed from `reference-totals.csv`.
* Regions: 39 regions and 124 zones (AWS), 58 listed regions with 41 having zones (Azure), 43 regions and 130 zones
  (Google Cloud).

## How each dataset was fetched (to refresh)

Re-run on the same pages; every URL is in `sources.csv`. Use a script where the page is a JSON API.

| Dataset | Method |
|---|---|
| `service-mapping.csv` | Read the Google comparison page (`svc-gcp-comparison`) for the Google and AWS names, then the Microsoft "Azure for AWS professionals" pages (compute, storage, databases, AI, and the index tables) for the Azure names and the extra categories. The AWS side comes from both. AWS publishes no equivalent page of its own that could be fetched |
| `tooling.csv` | SDK languages: count the SDKs on the AWS reference guide, the Azure SDK releases page and the Google Cloud Client Libraries page. Stars: `api.github.com/repos/{owner}/{repo}`. Terraform: `registry.terraform.io/v1/providers/hashicorp/{aws,azurerm,google}` field `downloads`. PyPI: `pypistats.org/api/packages/{name}/recent?period=week`. npm: `api.npmjs.org/downloads/point/last-week/{package}` |
| `learning.csv` | Free trial pages of each provider; certification pages (AWS and Google page text, Azure from `learn.microsoft.com/api/catalog/?type=certifications`, titles containing "Azure", Legacy excluded); learning paths and modules from the same catalog API with type `learningPaths,modules` and product tags starting with `azure`; Stack Overflow survey technology pages (2024, 2025) |
| `other-metrics.csv` | SLAs: provider SLA pages (AWS and Google as web pages, Azure from the consolidated Online Services SLA `.docx`, convert with a ZIP reader and strip the XML). Compliance: count list items on the AWS compliance programs page. Support: provider support pricing pages. Incidents: status feeds (`status.cloud.google.com/incidents.json`). Sustainability: provider sustainability reports and pages |
| `market-share.csv` | Quarterly Synergy Research Group and Canalys (Omdia) press releases, one row per provider per quarter; shares are the published percentages, `n/a` when only a total was published |
| `revenue.csv` | Earnings releases and filings: AWS segment net sales (Amazon), Google Cloud segment (Alphabet), Microsoft Intelligent Cloud and Azure growth. Definitions differ, see the `comparable` column |
| `adoption.csv` | Stack Overflow Developer Survey (cloud platforms question, per year), Flexera State of the Cloud, CNCF and JetBrains where public |
| `analyst.csv` | Public summaries and press coverage of the Gartner Magic Quadrant for cloud infrastructure and platform services, per year |
| `pricing.csv`, `free-tiers.csv`, `discounts.csv`, `reference-architectures.csv` | Official pricing pages for the building blocks (VM, object storage, egress, functions, managed database), same regions and date; free tier and discount (reserved, savings plans, committed use) pages; reference architectures from the provider architecture centres. Calculators are interactive, so totals are computed arithmetically from list prices |
| `regions-over-time.csv`, `footprint.csv`, `sovereign.csv`, `service-availability.csv` | Provider global infrastructure pages and the Microsoft regions list for current counts, archived snapshots or announcement dates for history; sovereign and government cloud pages per provider; service-by-region pages or APIs for availability |

For the four owner-managed groups above, the `source` column of each row is authoritative; this table describes the
approach, not the exact request.

## Caveats

* Cross-provider counts are not like for like: SDK languages (Azure counts mobile and embedded SDKs), certifications
  (Azure counts role-based and specialty titles containing "Azure"; the AWS count is a lower bound because the
  professional tier rendered only partly), always-free products (Google's 29 is a count of a usage-limit table).
* The Stack Overflow 2026 figures (usage, admired, desired) come from a trade-press article dated 2026-10-06 because the
  survey page text had no per-provider figures. Admired and desired for 2024 and 2025 were not found (`n/a`).
* The npm API returned the week 2026-06-25 to 2026-07-01 as "last week", so those rows carry `as_of` 2026-07-01.
* SLA values are the commitment thresholds in each SLA, not measured availability. Google's regional Standard storage
  value (99.9) is read from a merged table text. AWS RDS applies to the RDS family, not only PostgreSQL. SLA pages carry
  different last-updated dates (AWS compute 2022, Google 2026).
* Compliance certification counts: only AWS is countable from public page text (60 certifications and attestations, 89
  programs including laws and frameworks); Azure and Google lists are script-rendered and state no total (`n/a`).
* Incident history is `n/a` for all three: AWS has no public history feed, the Azure history page is script-rendered, and
  Google's JSON feed held only 8 incidents between 2026-02 and 2026-10.
* Marketplace listing totals are `n/a`: none of the three publishes a current official total. A 2023 third-party figure
  for AWS (about 15,000 transactable listings) was not used.
* Certification demand and job-market data is `n/a`: only training-vendor blogs surfaced, not a reliable source.
* Google's net-zero and 24/7 carbon-free energy goals were confirmed through a search summary of the 2026 Environmental
  Report, and Microsoft's +23.4% versus 2020 comes from the 2025 report as cited in search results; the PDFs were not
  read in full.
* The Azure region count (58 listed, 41 with zones) is the first table of the Microsoft regions list and may include
  regions that are not generally available to every customer.
