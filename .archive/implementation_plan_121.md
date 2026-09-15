# Implementation Plan: Diagnosing Slow Queries, Prometheus cheat sheet gap-fill, and Qdrant Reference

## Task summary

Source: GitHub issue #121
Base branch: main

Issue [#121](https://github.com/albertoirurueta/docs/issues/121) ("Add \"Diagnosing Slow Queries\", Prometheus
Reference, and Qdrant Reference to Database Development") bundles three deliverables under
`modules/ROOT/pages/database/`. Exploration found **one of the three is already implemented**:

1. **Diagnosing and Fixing Slow Queries** guide — not started.
2. **Prometheus Reference** — already fully built and merged (issue #136, PR #142, same day as this plan). All
   18 pages, the `nav.adoc` block, `database/index.adoc` bullet, and `prometheus-disclaimer.adoc` exist. Only two
   gaps remain against #121's own acceptance criteria: no cheat-sheet PDF (issue #136 deliberately substituted a
   `bibliography.adoc` instead), and the root `index.adoc` keywords line is missing "Prometheus"/"PromQL".
3. **Qdrant Reference** — not started at all; no files, nav entry, or disclaimer exist.

### Choices made on the user's behalf / confirmed with the user

- **Prometheus cheat sheet: add it now** (confirmed with the user). `bibliography.adoc` stays as `iru-code`
  issue #136 built it; a new `cheat-sheet.adoc` + PDF is added as an *additional* closing page so the section
  fully satisfies #121's acceptance criterion ("+ cheat sheet PDF... plus a downloadable one-page cheat sheet",
  matching every sibling engine reference) without undoing #136's own deliberate choice.
- **Do not re-implement any Prometheus content pages.** Verified by diffing the merged 18-page set against
  issue #121's own 12-item outline: full superset match (e.g. `promql-basics-and-selectors.adoc` covers the
  outline's `promql-basics.adoc`, `grafana-dashboards-and-visualization.adoc` + `grafana-alerting.adoc` together
  cover `grafana-integration.adoc`), plus a working cross-link from `database/prometheus/index.adoc` to
  `backend/springboot/metrics-and-observability.adoc` already in place. Nothing here needs touching.
- **Cheat-sheet.adoc placement within the Prometheus section**: inserted as the second-to-last page, right
  before `bibliography.adoc` — matching every sibling section's "cheat sheet is the last *content* page" 
  convention, while leaving #136's `bibliography.adoc` as the section's true final page rather than displacing it.
- **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site with
  no application source; none of the installed `*-code-one-task` keys (`java`, `dotnet`, `database`,
  `java-springboot`) applies — code only appears inside `[source,...]` example blocks. Every task is implemented
  directly, matching `.archive/implementation_plan_132.md` (Neo4j) and `.archive/implementation_plan_136.md`
  (Prometheus).
- **Qdrant disclaimer follows the current book-free engine-reference shape** (like `prometheus-disclaimer.adoc`,
  `solr-disclaimer.adoc`): states the current documented version line verified against
  https://qdrant.tech/documentation/, notes capabilities linked-not-documented-in-depth, the AI-assistance
  caveat, and closes with an `xref:` to the section's bibliography. No book is cited anywhere in this plan — the
  issue names only official docs and the client-library repos as sources.
- **Current Qdrant version line must be verified at implementation time**, not guessed now: this plan does not
  fabricate a specific version number. Task 1 requires fetching https://qdrant.tech/documentation/ (or its
  release notes) before writing the disclaimer, exactly as the Solr/Prometheus disclaimers state a real current
  line ("Solr 10.0", "Prometheus 3.x, latest 3.14.0").
- **Two SVG diagrams for Qdrant** (`qdrant-collections-and-points.svg`, `qdrant-hnsw-index.svg`), flat/
  light-background/hardcoded-hex style matching every existing `modules/ROOT/images/*.svg`, plus **one `[mermaid]`
  flowchart** for the RAG ingestion→retrieval pipeline in `rag-integration-patterns.adoc` — mirroring how the
  Neo4j section split its diagrams between static SVGs (structural models) and one mermaid block (a pipeline/
  flow), and the general convention "no diagram where a code block or small table is clearer." No comparison
  page and no project-picker icon — not requested by the issue, matching how Prometheus (also not requested one)
  and Neo4j (only added a comparison page because the issue explicitly asked for it) were handled.
- **Diagnosing Slow Queries gets two `[mermaid]` diagrams**, exactly as the issue itself suggests ("📊 mermaid or
  SVG contrasting a full scan against an index seek", "📊 mermaid flowchart" for the workflow summary) — mermaid
  chosen over SVG for both since they are process/flow diagrams, not structural data models.
- **Diagnosing Slow Queries placement**: `database/diagnosing-slow-queries.adoc`, inserted directly after
  "Pagination: Offset vs. Keyset" and before "SQL Reference" in both `nav.adoc` and `database/index.adoc`'s
  `== Sections` list, exactly as the issue specifies.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root (`ROOT`) component for the
  "Irurueta Docs" site. Build: `npx antora antora-playbook.yml` (no `--fetch`, local content only); success =
  build completes with no `xref`/AsciiDoc/missing-image/mermaid errors and no "skipping reference to missing
  attribute" warnings, and `build/site` renders. `package.json` has `"validate:mermaid": "node
  scripts/validate-mermaid.mjs"` for whenever a `[mermaid]` block is added. `build/` is gitignored.
- **`modules/ROOT/pages/database/`** holds one directory per database technology (`sql/`, `mongodb/`,
  `couchbase/`, `elasticsearch/`, `solr/`, `lucene/`, `neo4j/`, `prometheus/`, `schema-evolution/`) plus two
  standalone cross-database pages (`choosing-the-right-database.adoc`, `pagination-strategies.adoc`) and the
  section's own `index.adoc`. Every technology subsection follows the same shape: a `[IMPORTANT]`-admonition
  disclaimer partial at `modules/ROOT/partials/<tech>-disclaimer.adoc`, included via
  `include::partial$<tech>-disclaimer.adoc[]` at the top of every page in the subsection; an `index.adoc` landing
  page with a `== What's covered` list, a reading-order paragraph, and (except Prometheus, per #136's deviation)
  an `== Bibliography` section; several topical pages; and a closing `cheat-sheet.adoc` linking
  `xref:attachment$<tech>-cheat-sheet.pdf[Download the ... Cheat Sheet (PDF)]`.
- **`modules/ROOT/nav.adoc`** — single nav tree. The relevant tail (matched on surrounding `xref:` text, not
  absolute line numbers, since they will shift as pages land) currently reads:
  ```
  ** xref:database/index.adoc[Databases]
  *** xref:database/choosing-the-right-database.adoc[Choosing the Right Database]
  *** xref:database/pagination-strategies.adoc[Pagination: Offset vs. Keyset]
  *** xref:database/sql/index.adoc[SQL Reference]
  ****   … 11 SQL page lines …
  *** xref:database/mongodb/index.adoc[MongoDB Reference]
  ****   … 15 MongoDB page lines …
  *** xref:database/couchbase/index.adoc[Couchbase Reference]
  ****   … 13 Couchbase page lines …
  *** xref:database/elasticsearch/index.adoc[Elasticsearch Reference]
  ****   … 19 Elasticsearch page lines …
  *** xref:database/solr/index.adoc[Apache Solr Reference]
  ****   … Solr page lines …
  *** xref:database/lucene/index.adoc[Apache Lucene Reference]
  ****   … 27 Lucene page lines …
  *** xref:database/neo4j/index.adoc[Neo4j Reference]
  ****   … 19 Neo4j page lines (18 topics + cheat sheet) …
  *** xref:database/prometheus/index.adoc[Prometheus & Monitoring]
  **** xref:database/prometheus/getting-started.adoc[Getting Started]
  **** xref:database/prometheus/architecture-and-ecosystem.adoc[Architecture & Ecosystem]
  **** xref:database/prometheus/data-model-and-metric-types.adoc[Data Model & Metric Types]
  **** xref:database/prometheus/instrumenting-applications.adoc[Instrumenting Applications]
  **** xref:database/prometheus/exporters-and-pushgateway.adoc[Exporters & the Pushgateway]
  **** xref:database/prometheus/service-discovery-and-relabeling.adoc[Service Discovery & Relabeling]
  **** xref:database/prometheus/containers-and-kubernetes-monitoring.adoc[Containers & Kubernetes Monitoring]
  **** xref:database/prometheus/promql-basics-and-selectors.adoc[PromQL: Basics & Selectors]
  **** xref:database/prometheus/promql-operators-and-aggregation.adoc[PromQL: Operators & Aggregation]
  **** xref:database/prometheus/promql-functions.adoc[PromQL: Functions]
  **** xref:database/prometheus/recording-and-alerting-rules.adoc[Recording & Alerting Rules]
  **** xref:database/prometheus/alertmanager.adoc[Alertmanager]
  **** xref:database/prometheus/storage-federation-and-remote-write.adoc[Storage, Federation & Remote Write]
  **** xref:database/prometheus/security-and-production-operations.adoc[Security & Production Operations]
  **** xref:database/prometheus/grafana-dashboards-and-visualization.adoc[Grafana: Dashboards & Visualization]
  **** xref:database/prometheus/grafana-alerting.adoc[Grafana Alerting]
  **** xref:database/prometheus/bibliography.adoc[Bibliography]
  *** xref:database/schema-evolution/index.adoc[Evolving the Database Model]
  ****   … schema-evolution page lines …
  ```
  New `diagnosing-slow-queries.adoc` line goes between the Pagination line and the SQL Reference line. New
  `**** xref:database/prometheus/cheat-sheet.adoc[Cheat Sheet (PDF)]` line goes right before the `bibliography.adoc`
  line. A new `*** xref:database/qdrant/index.adoc[Qdrant Reference]` block (11 `****` lines: index implicit in
  the `***` line + getting-started + 8 topic pages + cheat-sheet) goes after the Prometheus block, before
  `Evolving the Database Model`.
- **`modules/ROOT/pages/database/index.adoc`** — `= Database Development`, a `:description:`/`:keywords:` pair
  (`:keywords:` line 2 already lists `full-text search, vector database, RAG, graph database, Neo4j`, `prometheus,
  monitoring, grafana, promql, alertmanager`), a lead paragraph, and a `== Sections` list of 9 bullets
  (Choosing the Right Database, Pagination, SQL, MongoDB, Couchbase, Elasticsearch, Apache Solr, Apache Lucene,
  Neo4j, Prometheus & Monitoring, Evolving the Database Model — see exact wording already in the file). Add a
  Diagnosing Slow Queries bullet after Pagination, before SQL; add a Qdrant Reference bullet after the Prometheus
  & Monitoring bullet, before Evolving the Database Model. Extend `:description:` to mention both new subsections;
  extend `:keywords:` with `qdrant` (vector database/RAG terms already present).
- **`modules/ROOT/pages/index.adoc`** (site home) — `:keywords:` (line 3) is one long comma-separated line; it
  already has `vector database, RAG, graph database, Neo4j, Cypher, CQRS` but **no** `Prometheus`, `PromQL`, or
  `Qdrant`. `== Guides & References` (further down) is a picker-tile grid
  (`image::databases.svg[xref="database/index.adoc"]`) with no per-subsection bullets — confirmed by the Neo4j
  and Prometheus plans; no picker-tile edit is needed for either new page.
- **`modules/ROOT/pages/database/choosing-the-right-database.adoc`** — `== Vector Databases` (around line 300)
  covers embeddings/HNSW/IVF, use cases, and a "Choosing one" list that already names
  "*Weaviate or Qdrant* -- self-hosted, strong hybrid search and multi-tenancy" with **no xref** to a dedicated
  Qdrant reference (since it doesn't exist yet). Add one xref there once `database/qdrant/index.adoc` exists.
- **`modules/ROOT/partials/`** — flat directory of disclaimer partials, one per technology, all following the
  same current shape regardless of whether the section cites a book (confirmed by reading `prometheus-
  disclaimer.adoc` and `solr-disclaimer.adoc`): states the version line verified against, a short
  linked-not-documented-in-depth list, the AI-assistance caveat, and a closing `xref:` sentence to the section's
  bibliography. No `qdrant-disclaimer.adoc` or `diagnosing-slow-queries-disclaimer.adoc` exists yet.
  `pagination-strategies-disclaimer.adoc` is the model for a **cross-database, vendor-neutral, no-book, no
  specific-version** disclaimer (the shape `diagnosing-slow-queries-disclaimer.adoc` should follow, since the
  slow-queries guide is cross-database like pagination, not a single-engine reference).
- **`modules/ROOT/attachments/`** — flat directory of 34 checked-in `*-cheat-sheet.pdf` files (couchbase 169 KB,
  lucene 178 KB, mongodb 139 KB, neo4j ~128 KB, etc.), linked with `xref:attachment$<name>.pdf[…]`. No HTML
  sources are checked in for any of them — each was hand-authored as HTML in a scratchpad (never the repo) and
  rendered via headless Chrome, confirmed available on this machine at
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (`--headless --print-to-pdf
  --no-pdf-header-footer`), then copied into `modules/ROOT/attachments/`. No `qdrant-cheat-sheet.pdf` or
  `prometheus-cheat-sheet.pdf` exists yet.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures, `viewBox="0 0 W H"`-scale,
  `font-family="Helvetica, Arial, sans-serif"`, flat light background, hardcoded hex colors, no CSS variables, no
  dark-mode theming (e.g. `neo4j-property-graph-model.svg`, `prometheus-architecture.svg`). No `qdrant-*.svg`
  exists yet.
- **Cross-link targets for the slow-queries guide** (all confirmed present, unmodified):
  `modules/ROOT/pages/database/mongodb/administration-and-monitoring.adoc`,
  `modules/ROOT/pages/database/mongodb/indexes.adoc`,
  `modules/ROOT/pages/database/elasticsearch/administration-monitoring-and-snapshots.adoc`,
  `modules/ROOT/pages/database/solr/monitoring-and-metrics.adoc`,
  `modules/ROOT/pages/backend/hibernate/performance-and-statistics.adoc`,
  `modules/ROOT/pages/backend/hibernate/fetching-and-n-plus-1.adoc`,
  `modules/ROOT/pages/database/pagination-strategies.adoc`.
- **AsciiDoc gotcha**: inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference
  and emits a "skipping reference to missing attribute" build warning. Qdrant's REST/JSON payloads
  (`{"vector": [...], "payload": {...}}`) and PromQL/Cypher-style examples must only ever appear inside
  `[source,...]` blocks in prose; any inline mention outside one must have braces escaped as `\{ \}`.
- **`.claude/agents/iru-gate-runner.md`** exists; there is no test/coverage/quality gate for a docs-only change,
  so the only verification is the Antora build, run via an `iru-gate-runner` sub-agent to keep the main context
  clean.

## Conventions every new content page in this plan must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:` (comma-separated), a blank line, then
  `include::partial$<tech>-disclaimer.adoc[]`, then a one/two-sentence lead.
- **Brief, example-driven prose.** Every distinct concept gets at least one runnable `[source,...]` example
  (`[source,json]`/`[source,shell]`/`[source,python]`/`[source,java]` for Qdrant: REST/gRPC payloads, `curl`,
  the Python client, and the Java/Kotlin client) and at least one link to the specific official doc page it
  documents.
- **No source is ever named in an admonition or in prose as "what this was written from"** — attribution lives
  only in `index.adoc`'s `== Bibliography` and the disclaimer partial for the official site link.
- **Cross-links**: link sibling pages within the same new subsection by `xref:` rather than repeating material.
- Every new page must be reachable from both its section's `index.adoc` and `modules/ROOT/nav.adoc` once its
  wiring group lands.

---

## Group 1 — Disclaimer partials

**Parallelizable: yes** — two independent new files, no shared content.

- [x] Task 1. Create `modules/ROOT/partials/qdrant-disclaimer.adoc` — verified current Qdrant line (1.19.1,
  published 2026-09-04 per GitHub releases) against https://qdrant.tech/documentation/; file written following
  the book-free `prometheus-disclaimer.adoc`/`solr-disclaimer.adoc` shape.
  - [x] Task 1.1. Fetch https://qdrant.tech/documentation/ (or its changelog/release-notes page) to determine
    the actual current stable Qdrant line before writing — do not reuse a stale or invented version number.
    Confirmed via GitHub releases API: latest stable is v1.19.1 (2026-09-04), preceded by v1.19.0 and v1.18.x.
  - [x] Task 1.2. Write the `[IMPORTANT]` admonition following the current book-free shape (see
    `prometheus-disclaimer.adoc`/`solr-disclaimer.adoc`): states the current version line verified against
    https://qdrant.tech/documentation/[the official Qdrant documentation], notes that Qdrant Cloud-only features
    and the full breadth of client-library APIs (beyond Python/Java) are linked, not documented in depth, the
    AI-assistance caveat, and closes with `xref:database/qdrant/index.adoc#_bibliography[bibliography]`.
- [x] Task 2. Create `modules/ROOT/partials/diagnosing-slow-queries-disclaimer.adoc` — written following the
  cross-database, no-book, no-pinned-version shape of `pagination-strategies-disclaimer.adoc`.
  - [x] Task 2.1. Write the `[IMPORTANT]` admonition following the cross-database, no-book,
    no-pinned-version shape of `pagination-strategies-disclaimer.adoc`: vendor-neutral overview, AI-assistance
    caveat, closes with `xref:database/diagnosing-slow-queries.adoc#_bibliography[bibliography]` (or `== Sources`
    section anchor, matching whichever heading name Task 17 actually uses — keep the two consistent). Used
    `xref:database/diagnosing-slow-queries.adoc#_sources[sources]` since Task 17 (Group 2, not yet implemented)
    is planned to use an `== Sources` heading — kept consistent per this task group's own instructions.

---

## Group 2 — Qdrant topic pages

**Parallelizable: yes** — 9 independent pages (Tasks 3–11). Each includes the Group 1 `qdrant-disclaimer.adoc`
and only cross-links other Qdrant pages by `xref:` (no page needs another Group 2 page's finished text).
Consolidated validation for the group is the final build (Task 23).

- [x] Task 3. Create `modules/ROOT/pages/database/qdrant/getting-started.adoc` — Docker/Cloud, REST (6333)/gRPC
  (6334), `qdrant-client`/Java client, curl + Python end-to-end walkthrough; cross-links to
  `mongodb/getting-started.adoc`, `neo4j/getting-started.adoc`, `choosing-the-right-database.adoc#_vector_databases`.
  - [x] Task 3.1. What Qdrant is (open-source vector similarity search engine, written in Rust); running it via
    Docker and Qdrant Cloud; the REST API (default port 6333) and gRPC API (6334); the official Python client
    (`qdrant-client`) and Java/Kotlin client; creating a first collection and upserting/searching a handful of
    points end to end, in `[source,shell]` (`curl`) and `[source,python]`.
  - [x] Task 3.2. Links: https://qdrant.tech/documentation/quickstart/[Quickstart],
    https://qdrant.tech/documentation/guides/installation/[Installation],
    https://qdrant.tech/documentation/interfaces/[Interfaces]. Cross-link sibling
    `xref:database/mongodb/getting-started.adoc` and `xref:database/neo4j/getting-started.adoc` as contrasting
    "getting started" baselines, and `xref:database/choosing-the-right-database.adoc#_vector_databases[]`.
- [x] Task 4. Create `modules/ROOT/pages/database/qdrant/collections-and-points.adoc` and
  `modules/ROOT/images/qdrant-collections-and-points.svg` — collections/points/named vectors/multivectors,
  distance-metric table, SVG matching `neo4j-property-graph-model.svg` house style; cross-link to
  `mongodb/documents-and-bson.adoc`.
  - [x] Task 4.1. Collections (vector size, distance metric configured per collection), points (id + vector +
    payload), named vectors and multivectors, distance metrics (Cosine, Dot, Euclidean) and when to pick each.
  - [x] Task 4.2. Author `modules/ROOT/images/qdrant-collections-and-points.svg` — a small diagram showing one
    collection containing several points, each with an id, a vector (small array), and a payload (key/value
    object); flat/light-background style matching `neo4j-property-graph-model.svg`.
  - [x] Task 4.3. Links: https://qdrant.tech/documentation/concepts/collections/[Collections],
    https://qdrant.tech/documentation/concepts/points/[Points]. Cross-link
    `xref:database/mongodb/documents-and-bson.adoc` as a contrasting document-model baseline.
- [x] Task 5. Create `modules/ROOT/pages/database/qdrant/vector-indexing-and-hnsw.adoc` and
  `modules/ROOT/images/qdrant-hnsw-index.svg` — `hnsw_config` (`m`/`ef_construct`), search-time `ef`, exact
  search, quantization (scalar/product/binary), layered-graph SVG matching `lucene-hnsw-graph.svg` style;
  cross-links to `lucene/knn-vector-search.adoc` and `elasticsearch/vector-and-semantic-search.adoc`.
  - [x] Task 5.1. The HNSW index, `hnsw_config` tuning (`m`, `ef_construct`), search-time `ef`, exact vs.
    approximate search, and quantization (scalar/product/binary) for memory/speed trade-offs.
  - [x] Task 5.2. Author `modules/ROOT/images/qdrant-hnsw-index.svg` — a layered-graph sketch of HNSW (a few
    layers, sparser at the top, converging on a query point), flat/light-background style.
  - [x] Task 5.3. Links: https://qdrant.tech/documentation/concepts/indexing/[Indexing],
    https://qdrant.tech/documentation/guides/quantization/[Quantization]. Cross-link
    `xref:database/lucene/knn-vector-search.adoc` and `xref:database/elasticsearch/vector-and-semantic-search.adoc`
    as contrasting kNN implementations already documented on this site.
- [x] Task 6. Create `modules/ROOT/pages/database/qdrant/filtering-and-payload-indexing.adoc` — payload indexes
  (keyword/integer/geo/text), must/should/must_not filter clauses, combined filter+vector query, filterable-HNSW
  explanation; cross-link to `solr/dense-vector-search.adoc`.
  - [x] Task 6.1. Payload schema and payload indexes (keyword, integer, geo, text), filter clauses
    (`must`/`should`/`must_not`), range and geo filters, and combining a filter with a vector query in one
    request, in `[source,json]`/`[source,python]`.
  - [x] Task 6.2. Links: https://qdrant.tech/documentation/concepts/payload/[Payload],
    https://qdrant.tech/documentation/concepts/filtering/[Filtering]. Cross-link
    `xref:database/solr/dense-vector-search.adoc[]` for a contrasting filter+vector combination in Solr.
- [x] Task 7. Create `modules/ROOT/pages/database/qdrant/hybrid-and-sparse-search.adoc` — sparse vectors,
  prefetch+fusion (RRF) hybrid queries, two-stage re-ranking; cross-links to
  `elasticsearch/vector-and-semantic-search.adoc` and `mongodb/special-indexes-and-search.adoc`.
  - [x] Task 7.1. Sparse vectors, hybrid dense+sparse search, fusion (Reciprocal Rank Fusion), and re-ranking a
    candidate set (e.g. with a cross-encoder), in `[source,python]`.
  - [x] Task 7.2. Links: https://qdrant.tech/documentation/concepts/hybrid-queries/[Hybrid Queries],
    https://qdrant.tech/articles/sparse-vectors/[Sparse Vectors]. Cross-link
    `xref:database/elasticsearch/vector-and-semantic-search.adoc[]` and
    `xref:database/mongodb/special-indexes-and-search.adoc[]` for how hybrid search is done in those engines.
- [x] Task 8. Create `modules/ROOT/pages/database/qdrant/crud-and-batch-operations.adoc` — upsert/retrieve/delete,
  scroll-API paging loop, batch upsert/delete; cross-link to `pagination-strategies.adoc` (no re-derivation of
  the general cursor pattern).
  - [x] Task 8.1. Upsert/retrieve/delete points, the scroll API for paging over all points in a collection, and
    batch upsert/delete for throughput, in `[source,python]`/`[source,java]`.
  - [x] Task 8.2. Links: https://qdrant.tech/documentation/concepts/points/#scroll-points[Scroll API]. Cross-link
    `xref:database/pagination-strategies.adoc[]` for the general cursor-pagination pattern the scroll API follows,
    rather than re-explaining it.
- [x] Task 9. Create `modules/ROOT/pages/database/qdrant/clustering-and-storage.adoc` — distributed deployment,
  sharding/replication, Raft consensus for cluster metadata (with a one-sentence Neo4j-clustering contrast),
  on-disk vs. in-memory storage, snapshots.
  - [x] Task 9.1. Distributed deployment, sharding and replication, the Raft-based consensus for cluster
    metadata, and on-disk vs. in-memory storage plus snapshots.
  - [x] Task 9.2. Links: https://qdrant.tech/documentation/guides/distributed_deployment/[Distributed Deployment],
    https://qdrant.tech/documentation/concepts/snapshots/[Snapshots].
- [x] Task 10. Create `modules/ROOT/pages/database/qdrant/security-and-administration.adoc` — API keys
  (read-write/read-only), TLS, Qdrant Cloud RBAC (in outline), `/metrics`/`/telemetry`; one-sentence cross-link
  to `prometheus/index.adoc`.
  - [x] Task 10.1. API keys, TLS, Qdrant Cloud RBAC, and the monitoring/telemetry endpoints (`/metrics`,
    `/telemetry`).
  - [x] Task 10.2. Links: https://qdrant.tech/documentation/guides/security/[Security],
    https://qdrant.tech/documentation/guides/monitoring/[Monitoring]. Cross-link
    `xref:database/prometheus/index.adoc[]` since Qdrant's `/metrics` endpoint is itself a Prometheus exposition
    format — one sentence, not a duplicate of that section's content.
- [x] Task 11. Create `modules/ROOT/pages/database/qdrant/rag-integration-patterns.adoc` — chunking/embedding
  pipeline, points-as-chunks with metadata payloads, retrieval flow, LangChain/LlamaIndex integrations (outline),
  `[mermaid]` ingestion+retrieval flowchart; cross-link back to
  `choosing-the-right-database.adoc#_vector_databases`.
  - [x] Task 11.1. The end-to-end RAG pattern: an embedding pipeline (chunking, embedding-model choice), storing
    chunks as points with metadata payloads, retrieval at query time (dense/hybrid search + payload filters +
    re-ranking), and integrating with LangChain/LlamaIndex.
  - [x] Task 11.2. Add a `[mermaid]` flowchart: chunk → embed → upsert (ingestion path) alongside query → embed →
    search/filter/re-rank → context → LLM (retrieval path).
  - [x] Task 11.3. Links: https://qdrant.tech/documentation/tutorials/rag/[RAG tutorial] (or the closest current
    equivalent — verify the path). Cross-link back to
    `xref:database/choosing-the-right-database.adoc#_vector_databases[Choosing the Right Database -- Vector
    Databases]` for when to pick Qdrant over the alternatives named there.

---

## Group 3 — Qdrant section index & cheat sheet

**Parallelizable: yes** — `index.adoc` and `cheat-sheet.adoc` both only need the Group 2 file list (already fixed
by this plan), not each other's content.

- [x] Task 12. Create `modules/ROOT/pages/database/qdrant/index.adoc`
  - [x] Task 12.1. Header (`= Qdrant Reference`, `:description:`, `:keywords:` including `qdrant, vector
    database, vector similarity search, hnsw, rag, embeddings`) + `include::partial$qdrant-disclaimer.adoc[]` +
    a lead paragraph (Qdrant as an open-source, self-hostable vector similarity search engine written in Rust) +
    a reading-order sentence (getting-started → collections-and-points → vector-indexing-and-hnsw → … →
    rag-integration-patterns).
  - [x] Task 12.2. `== What's covered` — one bullet per Group 2 page (9 bullets) plus the cheat sheet, one line
    each, mirroring `database/solr/index.adoc`'s structure.
  - [x] Task 12.3. `== Bibliography` — https://qdrant.tech/documentation/[the official Qdrant documentation] as
    the primary source, plus https://github.com/qdrant/qdrant-client[the qdrant-client Python library] and
    https://github.com/qdrant/java-client[the Qdrant Java client] for the code-example sources. No book.
  - Files: `modules/ROOT/pages/database/qdrant/index.adoc`. Antora build (`npx antora antora-playbook.yml`)
    completed clean (no xref/AsciiDoc errors or warnings); no tests/coverage/quality gates apply to this
    docs-only repo.
- [x] Task 13. Create `modules/ROOT/pages/database/qdrant/cheat-sheet.adoc` and its PDF
  - [x] Task 13.1. `= Qdrant Cheat Sheet` header + disclaimer include + a one-paragraph intro, then a grouped
    index of `xref:` back-links to all 9 Group 2 pages (grouped e.g. "Data model", "Search & filtering",
    "Operations & scale"), matching `database/neo4j/cheat-sheet.adoc`'s structure, ending with
    `xref:attachment$qdrant-cheat-sheet.pdf[Download the Qdrant Cheat Sheet (PDF)]`.
  - [x] Task 13.2. Author a print-ready single-page A4 HTML/CSS layout in the scratchpad (never the repo)
    covering: collection/point/vector/payload model, distance metrics table, HNSW parameter table
    (`m`/`ef_construct`/`ef`), filter-clause syntax, REST/gRPC/Python one-liners for
    create-collection/upsert/search/filter, and the scroll-API signature. Render to PDF with headless Chrome
    (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --print-to-pdf
    --no-pdf-header-footer`). Verify it is a single A4 page with no clipped content (open it and/or render a
    full-page PNG preview), then copy to `modules/ROOT/attachments/qdrant-cheat-sheet.pdf`. Confirm no `.html`
    file was left anywhere under the repo (`git status --porcelain`).
  - Files: `modules/ROOT/pages/database/qdrant/cheat-sheet.adoc`, `modules/ROOT/attachments/qdrant-cheat-sheet.pdf`.
    HTML source authored and rendered in the scratchpad directory only (`pdfinfo` confirmed 1 page, A4
    594.96x841.92pt; a 150dpi PNG render showed all 10 cards fully legible, no clipping); `git status --porcelain`
    confirmed no stray `.html` anywhere under the repo. Antora build completed clean with the new
    `cheat-sheet.html` output present under `build/site/database/qdrant/`.

---

## Group 4 — Qdrant site wiring

**Parallelizable: no** — all three tasks edit shared files (`nav.adoc`, `database/index.adoc`,
`choosing-the-right-database.adoc`) that later groups also touch; must run after Groups 2–3 produce the real
file list.

- [x] Task 14. Update `modules/ROOT/nav.adoc`
  - [x] Task 14.1. Insert a new block after the Prometheus block's last line
    (`**** xref:database/prometheus/bibliography.adoc[Bibliography]`) and before
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`:
    ```
    *** xref:database/qdrant/index.adoc[Qdrant Reference]
    **** xref:database/qdrant/getting-started.adoc[Getting Started]
    **** xref:database/qdrant/collections-and-points.adoc[Collections & Points]
    **** xref:database/qdrant/vector-indexing-and-hnsw.adoc[Vector Indexing & HNSW]
    **** xref:database/qdrant/filtering-and-payload-indexing.adoc[Filtering & Payload Indexing]
    **** xref:database/qdrant/hybrid-and-sparse-search.adoc[Hybrid & Sparse Search]
    **** xref:database/qdrant/crud-and-batch-operations.adoc[CRUD & Batch Operations]
    **** xref:database/qdrant/clustering-and-storage.adoc[Clustering & Storage]
    **** xref:database/qdrant/security-and-administration.adoc[Security & Administration]
    **** xref:database/qdrant/rag-integration-patterns.adoc[RAG Integration Patterns]
    **** xref:database/qdrant/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```
    — done: block inserted verbatim in `modules/ROOT/nav.adoc`.
- [x] Task 15. Update `modules/ROOT/pages/database/index.adoc`
  - [x] Task 15.1. Add a bullet after the Prometheus & Monitoring bullet, before the Evolving the Database Model
    bullet: `* xref:database/qdrant/index.adoc[Qdrant Reference] -- ` one sentence summarizing collections and
    points, HNSW indexing and quantization, filtering, hybrid/sparse search, clustering and storage, and RAG
    integration patterns, plus a downloadable one-page cheat sheet.
  - [x] Task 15.2. Extend `:description:` to mention "Qdrant Reference" (and "Diagnosing and Fixing Slow
    Queries" — Task 18.2 also touches this line; do both edits together here since Task 18 runs in a later group
    and must not clobber this one — coordinate by making Task 15.2 add both mentions now if Task 17 is already
    landed, otherwise Task 18.2 adds only the slow-queries mention). Add `qdrant` to `:keywords:` (`vector
    database, RAG` already present).
    — done: only the "Qdrant Reference" mention was added to `:description:` this run (Task 17/18 have not
    landed yet), phrased as an extra item in the existing subsection list so Task 18.2 can append the
    slow-queries mention afterward without reworking the sentence. `qdrant` added to `:keywords:`.
- [x] Task 16. Update `modules/ROOT/pages/database/choosing-the-right-database.adoc`
  - [x] Task 16.1. In `== Vector Databases` → `=== Choosing one`, extend the existing "*Weaviate or Qdrant*"
    bullet (or add a trailing sentence to the section) with an
    `xref:database/qdrant/index.adoc[Qdrant Reference]` link — e.g. "For a developer reference to Qdrant itself
    -- collections and points, HNSW indexing, filtering, hybrid search and RAG integration patterns -- see
    xref:database/qdrant/index.adoc[Qdrant Reference]." Do not restate content already covered in this section.

---

## Group 5 — Diagnosing and Fixing Slow Queries page

**Parallelizable: yes** — a single task, depends only on Group 1's disclaimer partial.

- [x] Task 17. Create `modules/ROOT/pages/database/diagnosing-slow-queries.adoc` — done; full `npx antora
  antora-playbook.yml` build completed with zero warnings/errors and all `xref:` links (including section
  anchors into MongoDB/Elasticsearch/Solr/Hibernate pages) resolved correctly in the rendered HTML.
  - [x] Task 17.1. Header (`= Diagnosing and Fixing Slow Queries`, `:description:`, `:keywords:`) +
    `include::partial$diagnosing-slow-queries-disclaimer.adoc[]` + lead paragraph.
  - [x] Task 17.2. `== What Counts as "Slow"` — no universal threshold; relative to baseline and the caller's
    latency budget; measure before optimizing.
  - [x] Task 17.3. `== Detecting Slow Queries` — one subsection per source:
    - `=== SQL`: MySQL `slow_query_log`/`long_query_time` + `mysqldumpslow`/`pt-query-digest`; PostgreSQL
      `log_min_duration_statement`, `pg_stat_statements`, `auto_explain`; SQL Server Query Store — new content,
      in `[source,sql]`/`[source,shell]`.
    - `=== MongoDB, Elasticsearch, Solr & Hibernate` — link rather than repeat:
      `xref:database/mongodb/administration-and-monitoring.adoc[]` (database profiler),
      `xref:database/elasticsearch/administration-monitoring-and-snapshots.adoc[]` (slow logs),
      `xref:database/solr/monitoring-and-metrics.adoc[]` (`slowQueryThresholdMillis`),
      `xref:backend/hibernate/performance-and-statistics.adoc[]` (`LOG_QUERIES_SLOWER_THAN_MS`, Statistics API).
  - [x] Task 17.4. `== Reading an Execution Plan` — scan vs. seek/index lookup, join strategy, sort, and the
    examined-vs-returned ratio as the one number that matters regardless of engine. Add a `[mermaid]` diagram
    contrasting a full scan against an index seek.
  - [x] Task 17.5. `== Typical Root Causes` — each with a short example and a link to the page that documents
    the fix: missing/unused indexes and full scans; non-sargable predicates; large `OFFSET`/`SKIP` (link
    `xref:database/pagination-strategies.adoc[]`); N+1 queries from an ORM (link
    `xref:backend/hibernate/fetching-and-n-plus-1.adoc[]`); poor join order/stale statistics (SQL) / poor
    compound-index key order — MongoDB ESR rule (link `xref:database/mongodb/indexes.adoc[]`); over-fetching
    (`SELECT *` / unprojected documents); lock/contention waits masquerading as a slow query.
  - [x] Task 17.6. `== Tools` — `EXPLAIN`/`EXPLAIN ANALYZE` and vendor visual-plan viewers (pgAdmin, MySQL
    Workbench, Azure Data Studio); MongoDB's `.explain()` **and MongoDB Compass's Explain Plan tab** (the visual
    tree view and summary-stats banner — the concrete gap the issue names); `mongostat`/`mongotop`;
    `pt-query-digest`.
  - [x] Task 17.7. `== Workflow Summary` — measure → detect from a log/profiler → read the plan → match the
    symptom to a root cause → apply the linked fix → re-measure, as prose plus a `[mermaid]` flowchart.
  - [x] Task 17.8. `== Sources` (used `== Sources`, matching the disclaimer partial's `#_sources` anchor):
    MongoDB Manual (Database Profiler, `cursor.explain()`); MongoDB Compass documentation (Explain Plan tab);
    MySQL Reference Manual (Slow Query Log, `mysqldumpslow`); PostgreSQL documentation (`EXPLAIN`,
    `log_min_duration_statement`, `pg_stat_statements`, `auto_explain`); Microsoft SQL Server documentation
    (Query Store, Execution Plans); Percona Toolkit documentation (`pt-query-digest`). No book.

---

## Group 6 — Slow-queries site wiring & cross-links

**Parallelizable: no** — Task 18 edits shared wiring files also touched by Group 4; Task 19 touches 7 distinct
files but all depend on Task 17 existing to link to, and grouping them together keeps this small set of
one-line edits easy to validate together.

- [x] Task 18. Update `modules/ROOT/nav.adoc` and `modules/ROOT/pages/database/index.adoc`
  - [x] Task 18.1. `nav.adoc`: inserted
    `*** xref:database/diagnosing-slow-queries.adoc[Diagnosing and Fixing Slow Queries]` directly after
    `*** xref:database/pagination-strategies.adoc[Pagination: Offset vs. Keyset]` and before
    `*** xref:database/sql/index.adoc[SQL Reference]`.
  - [x] Task 18.2. `database/index.adoc`: added a matching bullet in the same position in `== Sections`
    (after Pagination, before SQL Reference); extended `:description:` to append "the Diagnosing and Fixing
    Slow Queries guide" to the existing subsection list (kept Task 15.2's "Qdrant Reference" mention intact,
    did not overwrite or duplicate it).
- [x] Task 19. Add "see also" cross-links from the 7 pages named in the issue — files touched, tests
  n/a (docs-only repo, no test/coverage/quality gates apply), Antora build verification pending (Task 23 /
  see build check below):
  - [x] Task 19.1. `modules/ROOT/pages/database/mongodb/administration-and-monitoring.adoc` — one-line "see
    also" pointing to `xref:database/diagnosing-slow-queries.adoc[]`.
  - [x] Task 19.2. `modules/ROOT/pages/database/mongodb/indexes.adoc` — same.
  - [x] Task 19.3. `modules/ROOT/pages/database/elasticsearch/administration-monitoring-and-snapshots.adoc` —
    same.
  - [x] Task 19.4. `modules/ROOT/pages/database/solr/monitoring-and-metrics.adoc` — same.
  - [x] Task 19.5. `modules/ROOT/pages/backend/hibernate/performance-and-statistics.adoc` — same.
  - [x] Task 19.6. `modules/ROOT/pages/backend/hibernate/fetching-and-n-plus-1.adoc` — same.
  - [x] Task 19.7. `modules/ROOT/pages/database/pagination-strategies.adoc` — same.

---

## Group 7 — Prometheus cheat sheet (gap-fill)

**Parallelizable: yes** — a single task, independent of every other group; only needs the already-merged
Prometheus pages (issue #136).

- [x] Task 20. Create `modules/ROOT/pages/database/prometheus/cheat-sheet.adoc` and its PDF — file created plus
  attachment; no build/lint tooling applies beyond the Antora xref graph (see sub-tasks).
  - [x] Task 20.1. `= Prometheus Cheat Sheet` header + `include::partial$prometheus-disclaimer.adoc[]` + intro,
    then a grouped index of `xref:` back-links to all 17 existing Prometheus topic pages (grouped e.g.
    "Fundamentals", "PromQL", "Operations", "Alerting & Grafana"), matching `database/neo4j/cheat-sheet.adoc`'s
    structure, ending with `xref:attachment$prometheus-cheat-sheet.pdf[Download the Prometheus Cheat Sheet
    (PDF)]`. Done in `modules/ROOT/pages/database/prometheus/cheat-sheet.adoc`: 4 groups (Fundamentals, PromQL,
    Operations, Alerting & Grafana) covering all 16 topic pages plus a closing `xref:` to `bibliography.adoc`
    (this section's 17th page, per #136's deviation of splitting bibliography out of `index.adoc`), ending with
    the PDF download xref. `nav.adoc`/`database/index.adoc` intentionally left untouched (Group 8's job).
  - [x] Task 20.2. Author a print-ready A4 HTML/CSS layout in the scratchpad covering: metric-type table
    (counter/gauge/histogram/summary), PromQL selector/operator/function quick reference, a `scrape_configs`
    skeleton, an alerting-rule skeleton, and key `promtool`/`curl` one-liners. Render via headless Chrome, verify
    single A4 page with no clipping, copy to `modules/ROOT/attachments/prometheus-cheat-sheet.pdf`. Confirm no
    `.html` file left under the repo. Done: HTML authored and rendered only in the session scratchpad
    (`/private/tmp/.../scratchpad/prometheus-cheat-sheet.html`, never in the repo), via headless Chrome
    `--print-to-pdf --no-pdf-header-footer`; `pdfinfo` confirms 1 page at A4 (594.96 x 841.92 pts) and a
    150dpi PNG render confirms no clipping/overflow across all 15 cards. Copied to
    `modules/ROOT/attachments/prometheus-cheat-sheet.pdf` (135,735 bytes). `git status --porcelain` confirms no
    `.html` file tracked or untracked anywhere in the repo.

---

## Group 8 — Prometheus wiring & root keywords

**Parallelizable: no** — both tasks edit `nav.adoc`/`index.adoc`-family files; run after Group 7 so the cheat
sheet file actually exists to link.

- [x] Task 21. Update `modules/ROOT/nav.adoc`
  - [x] Task 21.1. Insert `**** xref:database/prometheus/cheat-sheet.adoc[Cheat Sheet (PDF)]` immediately before
    `**** xref:database/prometheus/bibliography.adoc[Bibliography]` in the existing Prometheus block. Done: line
    inserted; the Qdrant Reference block that follows the Prometheus bibliography line was left untouched.
- [x] Task 22. Update `modules/ROOT/pages/index.adoc` (site home)
  - [x] Task 22.1. Add `Prometheus`, `PromQL` and `Qdrant` to the `:keywords:` line (line 3), after the existing
    `graph database, Neo4j, Cypher` terms — satisfies #121's explicit acceptance criterion. No picker-tile edit
    (`== Guides & References` has no per-subsection bullets, confirmed in Current code state). Done: keywords
    inserted right after `Cypher` and before `CQRS`.

---

## Group 9 — Build & verify

**Parallelizable: no** — depends on every prior group having landed.

- [x] Task 23. Build & verify
  - [x] Task 23.1. Run `npx antora antora-playbook.yml` (no `--fetch`) via an `iru-gate-runner` sub-agent, e.g.
    `Agent({description: "Antora build", subagent_type: "iru-gate-runner", prompt: "Run npx antora
    antora-playbook.yml at the repo root and report every error and every 'skipping reference to missing
    attribute' warning verbatim."})`, to keep the main context clean. Fix any `xref`/AsciiDoc/missing-image/
    mermaid errors and any "skipping reference to missing attribute" warnings (unescaped `{ }` in prose,
    especially from Qdrant JSON payload snippets) until the build completes with **zero** errors and **zero**
    warnings. Done: `iru-gate-runner` reported exit code 0, empty stdout/stderr on the first run (zero warnings,
    zero errors) — no fixes needed here.
  - [x] Task 23.2. Since `[mermaid]` blocks were added (Tasks 11.2, 17.4, 17.7), run
    `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` and fix any reported diagram errors. Done:
    "All 254 Mermaid diagrams parsed successfully." — no fixes needed.
  - [x] Task 23.3. Confirm every new page is reachable from both its section's `index.adoc` and `nav.adoc`:
    9 Qdrant topic pages + index + cheat-sheet from `database/qdrant/index.adoc` and the new `nav.adoc` block;
    `diagnosing-slow-queries.adoc` from `database/index.adoc` and `nav.adoc`; the new Prometheus cheat-sheet page
    from `database/prometheus/index.adoc`'s "What's covered" and `nav.adoc`. Spot-check rendered HTML under
    `build/site/database/qdrant/` (a page with an SVG, e.g. `collections-and-points` or `vector-indexing-and-hnsw`)
    and `build/site/database/diagnosing-slow-queries.html`, and confirm both new `[mermaid]` blocks render as
    `class="mermaid"` in the built HTML. Done: all 9 Qdrant topic pages + index + cheat-sheet confirmed in both
    `database/qdrant/index.adoc`'s "What's covered" and `nav.adoc`; `diagnosing-slow-queries.adoc` confirmed in
    `database/index.adoc` and `nav.adoc`. **Found and fixed a real gap**: `database/prometheus/index.adoc`'s
    "What's covered" had no bullet for `cheat-sheet.adoc` (Group 8/Task 21 only added it to `nav.adoc`) — added a
    `=== Cheat sheet` subsection with the standard sibling-section bullet text, right before the closing
    bibliography line, matching the Couchbase/Elasticsearch/Lucene/MongoDB/Neo4j/Solr/Qdrant convention. Rebuilt
    the site after the fix: still zero warnings/errors. `collections-and-points.html` and
    `vector-indexing-and-hnsw.html` both render their SVGs via `<img src="../../_images/qdrant-*.svg">` (files
    present in `build/site/_images/`); `diagnosing-slow-queries.html`,
    `qdrant/rag-integration-patterns.html` and `qdrant/clustering-and-storage.html` each render their `[mermaid]`
    block as `<div class="mermaid content">...</div>` (the `mermaid` class is present, matching this site's
    existing mermaid-extension output format everywhere else).
  - [x] Task 23.4. Confirm `xref:attachment$qdrant-cheat-sheet.pdf` and
    `xref:attachment$prometheus-cheat-sheet.pdf` both resolve and the files exist under `build/site/_attachments/`.
    Re-open both PDFs and confirm each is a single A4 page with no clipped content. Done: both xrefs resolve
    (zero build warnings/errors, `cheat-sheet.html` pages link to `../../_attachments/*-cheat-sheet.pdf`), both
    PDFs exist (`qdrant-cheat-sheet.pdf` 137,999 bytes, `prometheus-cheat-sheet.pdf` 135,735 bytes),
    `pdfinfo` confirms both are exactly 1 page at 594.96 x 841.92 pts (A4); rendered both to PNG via `pdftoppm`
    and visually confirmed every content box fits fully on the page with no clipping.
  - [x] Task 23.5. Grep every new page for any admonition (`[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`,
    `[CAUTION]`) and confirm none names a book, "the book", "consulted", or "the sources" outside `index.adoc`'s
    Bibliography — all source attribution must live only there and in the disclaimer partials. Grep for
    `include::partial$qdrant-disclaimer.adoc[]` in all 11 new Qdrant files and
    `include::partial$diagnosing-slow-queries-disclaimer.adoc[]` in the new slow-queries page to confirm the
    disclaimer include is present everywhere required. Grep for unescaped `{`/`}` in prose outside `[source]`
    blocks in the new Qdrant pages (JSON payload snippets are the main risk). Done: no admonitions at all found
    in the new Qdrant pages or `diagnosing-slow-queries.adoc`, so no attribution-language check needed there;
    `include::partial$qdrant-disclaimer.adoc[]` present in all 11 Qdrant files, and
    `include::partial$diagnosing-slow-queries-disclaimer.adoc[]` present in the slow-queries page. The only
    `{`/`}` occurrences in prose outside `[source]` blocks (3 lines in `filtering-and-payload-indexing.adoc`,
    e.g. `` `\{"lon", "lat"\}` `` and `` `\{!knn\}` ``) are already properly backslash-escaped — no fix needed.
  - [x] Task 23.6. Confirm the root `modules/ROOT/pages/index.adoc` `:keywords:` line now contains `Prometheus`,
    `PromQL` and `Qdrant` (Task 22.1). Done: confirmed present, positioned right after `Cypher` as the plan
    intended.
