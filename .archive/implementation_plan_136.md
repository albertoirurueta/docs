# Implementation Plan: Prometheus & Monitoring documentation section under Guides & References / Databases

## Task summary

Source: GitHub issue #136
Base branch: main

Issue [#136](https://github.com/albertoirurueta/docs/issues/136) ("Add Prometheus & Monitoring documentation
section under Guides & References / Databases") asks to add a new **Prometheus & Monitoring** subsection under
this repo's own `ROOT` Antora component, at `modules/ROOT/pages/database/prometheus/` — a sibling of the existing
`database/sql/`, `database/mongodb/`, `database/couchbase/`, `database/elasticsearch/`, `database/solr/`,
`database/lucene/` and `database/neo4j/` subsections. It documents **Prometheus** (metrics-based monitoring) and
**Grafana** (visualization/dashboarding), grounded in the official docs at
https://prometheus.io/docs/introduction/overview/[prometheus.io/docs] and
https://grafana.com/docs/grafana/latest/[grafana.com/docs], plus the book *Prometheus: Up & Running*, 2nd Edition,
by Julien Pivotto & Brian Brazil (O'Reilly, 2023, https://oreil.ly/prometheus-up-running-2e).

18 new `.adoc` pages, a new nav.adoc block, and a `database/index.adoc` bullet. Unlike every other subsection in
`Databases`, **no cheat sheet** is produced; instead a dedicated `bibliography.adoc` page closes the section.

### Choices made on the user's behalf (best-practice defaults, no ambiguity requiring the user)

- **Book stays bibliography-only, exactly like every existing sibling section.** The issue lists a book chapter
  next to each page's official-doc links (e.g. "book Ch. 1"), but MongoDB/Couchbase/Elasticsearch/Solr/Lucene/
  Neo4j all follow the same pattern: the disclaimer partial never names a book, in-page citations link only to
  official documentation, and the book appears solely in the bibliography as a consulted reference, official docs
  authoritative on any discrepancy (see `mongodb-disclaimer.adoc` / `solr-disclaimer.adoc` and
  `database/mongodb/index.adoc`'s `== Bibliography`). The issue's "book Ch. N" notes are treated as scope/coverage
  guidance for what each page should cover, not as a citation to place inline. This is a straight continuation of
  an established, repo-wide convention, not a new judgment call.
- **`bibliography.adoc` is a dedicated page, not an `== Bibliography` subsection of `index.adoc`.** Every existing
  sibling section folds its bibliography into `index.adoc`, but issue #136 explicitly lists `bibliography.adoc` as
  its own numbered page (item 18) and an acceptance criterion ("`bibliography.adoc` lists every source actually
  cited across the other 17 pages"). Explicit ticket instruction wins over the otherwise-uniform convention here;
  `index.adoc` instead ends with a pointer `xref:` to `bibliography.adoc`.
- **No top-level `modules/ROOT/pages/index.adoc` edit.** The Solr/Lucene-era plans (issues #83/#84) updated a
  "Database Development" bullet list on the root `index.adoc`. That list no longer exists — the root page was
  restructured into an icon-picker grid (`== Guides & References`, `image::databases.svg[xref="database/index.adoc"]`)
  that links to `database/index.adoc` as a whole, not to individual subsections. Adding Prometheus therefore only
  touches `database/index.adoc`'s own `== Sections` list, not the root page.
- **One light, optional Spring Boot cross-link**, following the precedent set by issue #83's Group 5 (which
  cross-linked `backend/springboot/solr.adoc` once `database/solr/` existed): `backend/springboot/metrics-and-observability.adoc`
  already documents `/actuator/prometheus`, Micrometer, and a Prometheus scrape config + Grafana data source from
  the application side. Once the new deep-dive reference exists, that page should link to it instead of leaving
  the Prometheus/Grafana explanation self-contained. Scope guard: cross-linking only, no content duplication.
- **Prometheus/Grafana version lines to state in the disclaimer**: current stable lines as of authoring are
  **Prometheus 3.x** (latest 3.14.0) and **Grafana 13.x** (latest 13.2.1) — no specific patch pinned, matching how
  every sibling disclaimer states a line, not a patch (`elasticsearch-disclaimer.adoc`: "9.x line (with 8.19 as
  the final 8.x release)").

## Current code state

- **Antora structure**: this repo (`modules/ROOT`) has no application code; `modules/ROOT/pages/database/` holds
  one directory per database technology (`sql/`, `mongodb/`, `couchbase/`, `elasticsearch/`, `solr/`, `lucene/`,
  `neo4j/`, `schema-evolution/`) plus two standalone pages (`choosing-the-right-database.adoc`,
  `pagination-strategies.adoc`) and the section's own `index.adoc`. Every technology subsection follows the same
  shape: a `[IMPORTANT]`-admonition disclaimer partial at `modules/ROOT/partials/<tech>-disclaimer.adoc`, included
  via `include::partial$<tech>-disclaimer.adoc[]` at the top of every page in the subsection; an `index.adoc`
  landing page with a `== What's covered` (or equivalent) list and (for every sibling except the one being added
  here) an `== Bibliography` section; several topical pages; and a closing `cheat-sheet.adoc` + PDF under
  `modules/ROOT/attachments/<tech>-cheat-sheet.pdf` (this new section explicitly omits the cheat sheet).
- **`modules/ROOT/nav.adoc`**: the `Databases` block runs from `** xref:database/index.adoc[Databases]` (line 34)
  through the end of the Neo4j entries (line 191, `**** xref:database/neo4j/cheat-sheet.adoc[Cheat Sheet (PDF)]`),
  immediately followed by `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` (line 192).
  The new Prometheus block inserts as a `***`-level sibling entry **between** those two lines, itself followed by
  `****`-level entries for all 18 pages in the order they appear in `index.adoc`'s "What's covered" list.
- **`modules/ROOT/pages/database/index.adoc`**: has a `== Sections` bullet list (lines 8-47); each bullet is
  `* xref:database/<tech>/index.adoc[<Title>] -- <one-sentence summary>`. The Neo4j bullet ends at line 43; the
  new Prometheus bullet inserts there, before the schema-evolution bullet (line 44).
- **Disclaimer partial precedent** (`modules/ROOT/partials/mongodb-disclaimer.adoc`,
  `modules/ROOT/partials/elasticsearch-disclaimer.adoc`, `modules/ROOT/partials/solr-disclaimer.adoc`): a single
  `[IMPORTANT]`/`====` block stating (a) the exact version line documented and its source, with any capability
  that's linked-not-documented-in-depth called out; (b) an AI-generated-content verification disclaimer; (c) a
  pointer to the section's bibliography. None names a book.
- **SVG figures**: authored per-task alongside the page that embeds them, stored flat under `modules/ROOT/images/`
  (e.g. `solr-request-pipeline.svg`, `elasticsearch-shard-distribution.svg`), referenced via `image::<file>.svg[...]`.
- **Precedent implementation plans** (`.archive/implementation_plan_83.md` for Apache Solr, `.archive/implementation_plan_84.md`
  for Apache Lucene) are the closest analogues: same page/nav shape, same task-group breakdown (scaffolding →
  content pages → cheat sheet + PDF → index/nav/wiring → cross-linking → build & verify). This plan reuses that
  breakdown minus the cheat-sheet group.
- **`backend/springboot/metrics-and-observability.adoc`** already documents `/actuator/prometheus`, Micrometer,
  and Prometheus scrape config + Grafana data source wiring from the Spring Boot application side (its own
  `include::partial$springboot-disclaimer.adoc[]`, not the new `prometheus-disclaimer.adoc`) — this is the
  natural cross-link target once the new reference exists (see Group 4).
- **Antora build**: `npx antora antora-playbook.yml` at the repository root is the sole verification gate; it
  must complete without `xref`/AsciiDoc/mermaid errors or "skipping reference to missing attribute" warnings.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/prometheus-disclaimer.adoc` — created, `[IMPORTANT]`/`====`
  admonition matching the mongodb/elasticsearch/solr shape.
  - [x] Task 1.1. Author it as an `[IMPORTANT]`/`====` admonition, the same "book-free" shape as
    `solr-disclaimer.adoc`/`elasticsearch-disclaimer.adoc`. It must state, in order: (a) this section documents
    **the current Prometheus 3.x line** (latest 3.14.0) as published at
    https://prometheus.io/docs/introduction/overview/[the Prometheus documentation] and **the current Grafana
    13.x line** (latest 13.2.1) as published at https://grafana.com/docs/grafana/latest/[the Grafana
    documentation], **which are the references these pages are written and verified against**; no specific patch
    version is pinned; some capabilities (Grafana Enterprise-only features, Grafana Cloud-hosted services, and
    long-term-storage systems like Thanos/Cortex/Mimir) are **linked, not documented in depth**; (b) this content
    was generated with the assistance of AI and should be verified against the official documentation before
    being relied on in production, since both projects iterate quickly. **Must not name any book, "consulted
    references", or "the sources below".** — verified: no book/consulted-references language present.
  - [x] Task 1.2. End with a pointer: "This section's
    `xref:database/prometheus/bibliography.adoc[bibliography]` lists the reference material consulted while
    preparing these pages." (a full page xref, not a `#_bibliography` anchor, since this section's bibliography
    is its own page — see Task 18/19). Confirm the include line used on every page in Groups 2–3 is
    `include::partial$prometheus-disclaimer.adoc[]`. — done: closing sentence uses the full-page xref
    `xref:database/prometheus/bibliography.adoc[bibliography]`; downstream pages must include the partial via
    `include::partial$prometheus-disclaimer.adoc[]`.

### Group 2 — Content pages

**Parallelizable: yes** — 16 independent pages (Tasks 2–17). Each includes the Group 1 disclaimer partial and
cross-links other pages only by `xref:` (no page needs another Group 2 page's finished text). Each page authors
any `prometheus-*.svg`/`grafana-*.svg` figure it embeds. Every page must carry **at least one runnable example**
(`[source,yaml]` scrape/rule config, `[source,promql]`/`[source,bash]` query or `curl` examples, `[source,go]`/
`[source,java]` client-library snippets where useful) and link the specific official documentation page(s) it
documents — not a generic "see the Prometheus docs". Consolidated validation for the group is the Group 5 Antora
build.

- [x] Task 2. Create `modules/ROOT/pages/database/prometheus/getting-started.adoc` — installing and running
  Prometheus (binary, Docker, `prometheus.yml` skeleton), the expression browser, running `node_exporter`,
  registering it as a scrape target, and a first alerting rule. Links:
  https://prometheus.io/docs/introduction/first_steps/[First steps],
  https://prometheus.io/docs/prometheus/latest/getting_started/[Getting started],
  https://prometheus.io/docs/prometheus/latest/installation/[Installation].
- [x] Task 3. Create `modules/ROOT/pages/database/prometheus/architecture-and-ecosystem.adoc` — server, client
  libraries, exporters, service discovery, Pushgateway, Alertmanager, remote storage, and the pull-vs-push model.
  Embed `image::prometheus-architecture.svg[…]` (authored in this task, Task 3.x) showing scrape targets →
  Prometheus server (TSDB + rule evaluation) → Alertmanager/remote-write/Grafana. Links:
  https://prometheus.io/docs/introduction/overview/#architecture[Overview — Architecture].
- [x] Task 4. Create `modules/ROOT/pages/database/prometheus/data-model-and-metric-types.adoc` — time series,
  labels, jobs/instances, the four metric types (Counter, Gauge, Histogram, Summary), and native histograms.
  Links: https://prometheus.io/docs/concepts/data_model/[Data model],
  https://prometheus.io/docs/concepts/metric_types/[Metric types],
  https://prometheus.io/docs/concepts/jobs_instances/[Jobs & instances],
  https://prometheus.io/docs/specs/native_histograms/[Native histograms].
- [x] Task 5. Create `modules/ROOT/pages/database/prometheus/instrumenting-applications.adoc` — client libraries,
  the exposition format & OpenMetrics, content negotiation, and metric/label naming conventions. Links:
  https://prometheus.io/docs/instrumenting/clientlibs/[Client libraries],
  https://prometheus.io/docs/instrumenting/writing_clientlibs/[Writing client libraries],
  https://prometheus.io/docs/instrumenting/exposition_formats/[Exposition formats],
  https://prometheus.io/docs/instrumenting/content_negotiation/[Content negotiation],
  https://prometheus.io/docs/practices/naming/[Metric & label naming],
  https://prometheus.io/docs/practices/instrumentation/[Instrumentation],
  https://prometheus.io/docs/practices/histograms/[Histograms & summaries].
- [x] Task 6. Create `modules/ROOT/pages/database/prometheus/exporters-and-pushgateway.adoc` — `node_exporter`
  collectors, `blackbox_exporter`, writing custom exporters, and the Pushgateway (and when not to use it). Links:
  https://prometheus.io/docs/instrumenting/exporters/[Exporters & integrations],
  https://prometheus.io/docs/instrumenting/writing_exporters/[Writing exporters],
  https://prometheus.io/docs/instrumenting/pushing/[Pushing metrics],
  https://github.com/prometheus/node_exporter[node_exporter],
  https://github.com/prometheus/blackbox_exporter[blackbox_exporter].
- [x] Task 7. Create `modules/ROOT/pages/database/prometheus/service-discovery-and-relabeling.adoc` — static/
  file/HTTP/Consul/EC2/Kubernetes service discovery, `relabel_configs` vs. `metric_relabel_configs`, and
  `honor_labels`. Links:
  https://prometheus.io/docs/prometheus/latest/configuration/configuration/[Configuration],
  https://prometheus.io/docs/prometheus/latest/http_sd/[HTTP-based service discovery].
- [x] Task 8. Create `modules/ROOT/pages/database/prometheus/containers-and-kubernetes-monitoring.adoc` —
  cAdvisor, Kubernetes service-discovery roles (node/service/endpointslice/pod/ingress), and
  kube-state-metrics. Links: https://prometheus.io/docs/guides/cadvisor/[Monitoring Docker container metrics
  using cAdvisor], https://github.com/kubernetes/kube-state-metrics[kube-state-metrics].
- [x] Task 9. Create `modules/ROOT/pages/database/prometheus/promql-basics-and-selectors.adoc` — instant vs.
  range vectors, matchers, subqueries, `offset`, the `@` modifier, and the HTTP query API. Links:
  https://prometheus.io/docs/prometheus/latest/querying/basics/[Querying basics],
  https://prometheus.io/docs/prometheus/latest/querying/api/[HTTP API].
- [x] Task 10. Create `modules/ROOT/pages/database/prometheus/promql-operators-and-aggregation.adoc` —
  arithmetic/comparison/logical binary operators, vector matching (one-to-one, many-to-one, `group_left`/
  `group_right`), and aggregation operators/grouping. Embed `image::prometheus-vector-matching.svg[…]`
  (authored in this task) illustrating one-to-one vs. many-to-one matching. Links:
  https://prometheus.io/docs/prometheus/latest/querying/operators/[Operators].
- [x] Task 11. Create `modules/ROOT/pages/database/prometheus/promql-functions.adoc` — `rate`/`irate`/`increase`,
  `histogram_quantile`, `predict_linear`, `label_replace`/`label_join`, and time/date functions. Links:
  https://prometheus.io/docs/prometheus/latest/querying/functions/[Functions],
  https://prometheus.io/docs/prometheus/latest/querying/examples/[Query examples].
- [x] Task 12. Create `modules/ROOT/pages/database/prometheus/recording-and-alerting-rules.adoc` — recording
  rule naming/use cases, alerting rule `for`/labels/annotations/templates, and testing rules with `promtool`.
  Links: https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/[Recording rules],
  https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/[Alerting rules],
  https://prometheus.io/docs/prometheus/latest/configuration/template_reference/[Template reference],
  https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/[Unit testing rules].
- [x] Task 13. Create `modules/ROOT/pages/database/prometheus/alertmanager.adoc` — the notification pipeline,
  routing tree, grouping/throttling, receivers/notification templates, inhibition, silences, and HA clustering.
  Embed `image::prometheus-alertmanager-routing-tree.svg[…]` (authored in this task) showing a sample routing
  tree with grouping and inhibition. Links:
  https://prometheus.io/docs/alerting/latest/overview/[Alerting overview],
  https://prometheus.io/docs/alerting/latest/configuration/[Configuration],
  https://prometheus.io/docs/alerting/latest/alertmanager/[Alertmanager],
  https://prometheus.io/docs/alerting/latest/high_availability/[High availability].
- [x] Task 14. Create `modules/ROOT/pages/database/prometheus/storage-federation-and-remote-write.adoc` — local
  TSDB storage, federation, `remote_read`/`remote_write` APIs, and long-term storage systems (Thanos/Cortex/
  Mimir, linked not documented in depth). Links:
  https://prometheus.io/docs/prometheus/latest/storage/[Storage],
  https://prometheus.io/docs/prometheus/latest/federation/[Federation],
  https://prometheus.io/docs/prometheus/latest/querying/remote_read_api/[Remote read API].
- [x] Task 15. Create `modules/ROOT/pages/database/prometheus/security-and-production-operations.adoc` —
  server-side TLS/basic auth, capacity planning, horizontal sharding, HA, meta-monitoring, `promtool`, and the
  management API. Links: https://prometheus.io/docs/operating/security/[Security],
  https://prometheus.io/docs/prometheus/latest/configuration/https/[TLS encryption],
  https://prometheus.io/docs/prometheus/latest/management_api/[Management API],
  https://prometheus.io/docs/prometheus/latest/configuration/promtool/[promtool].
- [x] Task 16. Create `modules/ROOT/pages/database/prometheus/grafana-dashboards-and-visualization.adoc` —
  installing Grafana, adding the Prometheus data source, dashboards & panel types, and template variables. Links:
  https://grafana.com/docs/grafana/latest/setup-grafana/installation/[Install Grafana],
  https://grafana.com/docs/grafana/latest/datasources/prometheus/[Prometheus data source],
  https://grafana.com/docs/grafana/latest/dashboards/[Dashboards],
  https://grafana.com/docs/grafana/latest/panels-visualizations/[Panels & visualizations],
  https://grafana.com/docs/grafana/latest/dashboards/variables/[Variables].
- [x] Task 17. Create `modules/ROOT/pages/database/prometheus/grafana-alerting.adoc` — Grafana-managed alerting
  vs. Prometheus/Alertmanager alerting, and notification policies/contact points. Links:
  https://grafana.com/docs/grafana/latest/alerting/[Grafana Alerting].

### Group 3 — Section index, bibliography, navigation & site wiring

**Parallelizable: no** — Task 19 (bibliography) consolidates sources from every Group 2 page and Task 18
(index); Task 20/21 depend on Task 18's page existing; each edits a shared wiring file.

- [x] Task 18. Create `modules/ROOT/pages/database/prometheus/index.adoc`
  - [x] Task 18.1. Header (`= Prometheus & Monitoring`, `:description:`, `:keywords:`) +
    `include::partial$prometheus-disclaimer.adoc[]` + a lead paragraph: what Prometheus is, metrics-based
    monitoring vs. logs/tracing/profiling, and why it matters — pointing new readers to `getting-started.adoc` →
    `architecture-and-ecosystem.adoc` → `data-model-and-metric-types.adoc` first. Sources:
    https://prometheus.io/docs/introduction/overview/[Overview],
    https://prometheus.io/docs/introduction/glossary/[Glossary].
  - [x] Task 18.2. `== What's covered` — one bullet per Group 2 page, grouped: *Getting started*
    (getting-started, architecture-and-ecosystem); *Data model & instrumentation* (data-model-and-metric-types,
    instrumenting-applications, exporters-and-pushgateway); *Service discovery & Kubernetes*
    (service-discovery-and-relabeling, containers-and-kubernetes-monitoring); *PromQL*
    (promql-basics-and-selectors, promql-operators-and-aggregation, promql-functions); *Rules & alerting*
    (recording-and-alerting-rules, alertmanager); *Storage & operations* (storage-federation-and-remote-write,
    security-and-production-operations); *Grafana* (grafana-dashboards-and-visualization, grafana-alerting).
  - [x] Task 18.3. End with a pointer sentence: "See `xref:database/prometheus/bibliography.adoc[]` for every
    source cited across this section." (no `== Bibliography` section here — that content lives on its own page,
    per the issue's explicit request).
- [x] Task 19. Create `modules/ROOT/pages/database/prometheus/bibliography.adoc`
  - [x] Task 19.1. Header (`= Prometheus & Monitoring — Bibliography`, `:description:`, `:keywords:`) +
    `include::partial$prometheus-disclaimer.adoc[]` + a short intro sentence.
  - [x] Task 19.2. List every source actually cited across Tasks 2–18, consolidated and deduplicated: the
    Prometheus documentation (grouped by the specific sub-pages linked from Tasks 2–15), the Grafana
    documentation (grouped by the specific sub-pages linked from Tasks 16–17), `node_exporter`,
    `blackbox_exporter`, and `kube-state-metrics` (linked, not documented in depth). End with the book: Pivotto,
    Julien; Brazil, Brian. _Prometheus: Up & Running_, 2nd ed. O'Reilly Media, 2023. ISBN 978-1-098-13108-3 (or
    the ISBN on the book's official page) — official page: https://oreil.ly/prometheus-up-running-2e. Consulted
    as part of the bibliography for this section; not the primary or main reference — the official documentation
    is authoritative on any discrepancy. Mirror the closing-sentence convention from
    `database/mongodb/index.adoc[#_bibliography]`/`database/solr/index.adoc[#_bibliography]`: the book is a
    consulted reference only.
- [x] Task 20. Wire `modules/ROOT/nav.adoc`
  - [x] Task 20.1. Insert a `*** xref:database/prometheus/index.adoc[Prometheus & Monitoring]` block with one
    `****` line per page **in the "What's covered" order** from Task 18.2, **after** the Neo4j block's
    `**** xref:database/neo4j/cheat-sheet.adoc[Cheat Sheet (PDF)]` line (`nav.adoc:191`) and **before**
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` (`nav.adoc:192`), ending with
    `**** xref:database/prometheus/bibliography.adoc[Bibliography]` (no cheat-sheet line). Use short link labels
    matching each page's heading (`[Getting Started]`, `[Architecture & Ecosystem]`, `[Data Model & Metric
    Types]`, `[Instrumenting Applications]`, `[Exporters & the Pushgateway]`, `[Service Discovery &
    Relabeling]`, `[Containers & Kubernetes Monitoring]`, `[PromQL: Basics & Selectors]`, `[PromQL: Operators &
    Aggregation]`, `[PromQL: Functions]`, `[Recording & Alerting Rules]`, `[Alertmanager]`, `[Storage,
    Federation & Remote Write]`, `[Security & Production Operations]`, `[Grafana: Dashboards & Visualization]`,
    `[Grafana Alerting]`, `[Bibliography]`).
- [x] Task 21. Update `modules/ROOT/pages/database/index.adoc`
  - [x] Task 21.1. Add a `== Sections` bullet after the Neo4j Reference one (currently ending line 43, before
    the schema-evolution bullet at line 44):
    `xref:database/prometheus/index.adoc[Prometheus & Monitoring] -- metrics-based monitoring and visualization:
    the Prometheus data model and metric types, instrumenting applications, exporters and the Pushgateway,
    service discovery, PromQL, recording and alerting rules, Alertmanager, storage and remote write, security and
    production operations, and Grafana dashboards and alerting.`
  - [x] Task 21.2. Extend the page `:description:` and `:keywords:` to mention Prometheus, Grafana, PromQL, and
    Alertmanager.

### Group 4 — Spring Boot documentation cross-link

**Parallelizable: yes** (single task) — run after Group 3 so the new `database/prometheus/` xref targets exist.
Scope guard: cross-linking only — do not expand this page into a second copy of the reference.

- [x] Task 22. Update `modules/ROOT/pages/backend/springboot/metrics-and-observability.adoc`
  - [x] Task 22.1. In the `== Wiring Prometheus and Grafana end to end` section, add a cross-link to
    `xref:database/prometheus/index.adoc[Prometheus & Monitoring]` for readers who want the full
    Prometheus/PromQL/Alertmanager/Grafana reference beyond the application-side scrape config and data source
    shown on this page, and add that xref to the page's references/further-reading if one exists.

### Group 5 — Build & verify

**Parallelizable: no** — depends on every prior group having landed.

- [x] Task 23. Build & verify
  - [x] Task 23.1. Run `npx antora antora-playbook.yml` via the `iru-gate-runner` agent (or an equivalent generic
    sub-agent) to keep the main context clean, e.g.:
    ```
    Agent({description: "Build Antora site", subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` at the repository root and report back: build success/
        failure, and every xref/AsciiDoc/missing-image/mermaid error plus every 'skipping reference to missing
        attribute' warning verbatim, or confirm zero such warnings/errors."})
    ```
    Fix any error or warning introduced by the new pages until the build completes clean.
  - [x] Task 23.2. Confirm every new page is reachable from both `database/prometheus/index.adoc` and
    `nav.adoc`, and that `build/site/database/prometheus/...` HTML renders (spot-check the pages with the
    Mermaid/SVG diagrams from Tasks 3, 10, and 13).
  - [x] Task 23.3. Grep the new pages for any admonition (`[NOTE]`/`[TIP]`/`[IMPORTANT]`/`[WARNING]`/`[CAUTION]`)
    and confirm none names the book, "consulted", or "the sources" outside `bibliography.adoc`.
  - [x] Task 23.4. Confirm `xref:database/prometheus/bibliography.adoc[]` resolves from `index.adoc`, the
    disclaimer partial, and `nav.adoc`, and that no page under `database/prometheus/` embeds a `cheat-sheet.adoc`
    xref or attachment link.
