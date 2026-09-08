# Implementation Plan: Database Development / Apache Solr Reference

## Task summary

Source: GitHub issue #83

Issue [#83](https://github.com/albertoirurueta/docs/issues/83) ("Add \"Apache Solr Reference\" documentation
section under Guides & References / Database Development") asks to add a new **"Apache Solr Reference"**
subsection under the existing **Guides & References / Database Development** section of this repo's own `ROOT`
Antora component, at `modules/ROOT/pages/database/solr/` — the fifth sibling of the existing `database/sql/`,
`database/mongodb/`, `database/couchbase/` and `database/elasticsearch/` subsections. It documents **Apache
Solr** as a database-developer reference — the Lucene-based search-server model (cores/collections, schema and
analysis), indexing and commits, querying (request handlers, query parsers, the JSON Request/Facet APIs,
highlighting, suggestions, spatial/dense-vector search, streaming expressions/Parallel SQL), relevance and
scoring, the SolrCloud distributed model and cluster operations, security and deployment, the SolrJ client and
Spring Boot integration, plus a **"Solr vs. Elasticsearch"** comparison page — anchored to the **current Solr
line (10.0; 9.10.x the maintained 9.x branch; no patch pinned)** at
https://solr.apache.org/guide/solr/latest/[the Apache Solr Reference Guide], which is the source every page is
written and verified against. A one-page downloadable PDF cheat sheet closes the section, same as every prior
`database/<engine>/` subsection.

The closest structural precedent is
[.archive/implementation_plan_70.md](.archive/implementation_plan_70.md) (issue #70, "Elasticsearch Reference")
— same pattern: a disclaimer partial, independent content pages each with runnable examples and official-doc
links, Mermaid/SVG figures where they clarify a concept, a `== Bibliography` in `index.adoc`, and a
headless-Chrome-rendered one-page PDF cheat sheet, organised into dependency-ordered task groups. This plan
follows that same group shape (scaffolding → content pages → cheat sheet → site wiring & build).

One PDF book was consulted while planning this section — *Solr in Action* (Trey Grainger & Timothy Potter,
Manning Publications, 2014, ISBN 9781617291029). Its code targets **Solr 4.7 / early SolrCloud** and predates
the `bin/solr` script, the managed schema/Schema API/Schemaless mode, `point`-based numeric fields, the JSON
Request/Facet APIs, streaming expressions/Parallel SQL, Learning To Rank, dense-vector/KNN search, replica
types/replica-placement plugins, Time/Category Routed Aliases, the modern security stack, circuit
breakers/rate limiters, Solr in Docker/the Solr Operator, and the package manager — and `DefaultSimilarity`
(classic TF/IDF) was still the default (**BM25 is the default from Solr 6**). It is cited **only as a
bibliography entry** in `index.adoc`, never as the primary/main reference; per the issue, the disclaimer partial
itself must **not** name it (the "book-free" variant, matching `elasticsearch-disclaimer.adoc` /
`couchbase-disclaimer.adoc`) — source attribution lives solely in `index.adoc`'s `== Bibliography`. Modern
features the book predates are sourced from the official documentation only. Where the book and the official
guide disagree, the official guide wins and the difference is noted (e.g. `relevance-and-scoring.adoc` states
BM25 is the current default with a short classic-TF/IDF → BM25 note; `field-types.adoc` uses `point`-based
numeric types, not the removed trie fields).

**Choice made on the user's behalf (Step 4 — not asked, per the issue's own explicit allowance to merge thin
pages):** the issue proposes 34 concept pages and explicitly says "merges are acceptable if a downstream plan
finds two pages too thin to stand alone", naming three candidate merges itself. To keep this section's size in
line with the Elasticsearch precedent (22 content pages) while still covering every concept named in the issue,
this plan applies exactly the three merges the issue suggests:
- `faceting.adoc` absorbs the JSON Facet API content (no separate `json-facet-api.adoc`).
- `spell-check-and-suggest.adoc` absorbs MoreLikeThis, Query Re-Ranking and Learning To Rank (no separate
  `morelikethis-and-reranking.adoc`).
- `import-and-etl.adoc` content (Solr Cell/Tika, the Data Import Handler, URP chains, CDC patterns) is folded
  into `indexing-and-updates.adoc` (no separate `import-and-etl.adoc` page).

This yields **31 content pages** (Tasks 2–32 below) plus `index.adoc` and `cheat-sheet.adoc` — every concept
named in the issue is still covered, just grouped onto fewer pages, exactly as the issue anticipated.

**Second choice made on the user's behalf:** the issue's own file list doesn't mention
`modules/ROOT/pages/index.adoc` (the site's project-picker landing page), but the Elasticsearch precedent
(`.archive/implementation_plan_70.md` Task 29) updated it as a matter of established convention — it mirrors
`database/index.adoc`'s `== Sections` list under a nested `** xref:database/index.adoc[Database Development]`
bullet (see `modules/ROOT/pages/index.adoc:102-118`, which already lists Couchbase and Elasticsearch as
sub-bullets). This plan adds it as Task 30 for consistency with every prior `database/<engine>/` addition.

## Current code state

- `modules/ROOT/pages/database/` already contains `index.adoc` (landing page, `== Sections` list),
  `choosing-the-right-database.adoc` (decision guide, has a `== Full-Text Search Engines -- Elasticsearch`
  section at `:221` and a `== Vector Databases` section at `:295`), and four sibling reference subsections:
  `sql/`, `mongodb/`, `couchbase/`, `elasticsearch/` (22 pages). No `database/solr/` directory exists yet.
- `modules/ROOT/partials/elasticsearch-disclaimer.adoc` and `couchbase-disclaimer.adoc` are the exact templates
  for the new `solr-disclaimer.adoc`: an `[IMPORTANT]`/`====` admonition — (a) current-version statement +
  reference-guide link + "no patch pinned" + what's linked-not-documented-in-depth, (b) the AI-generated-content
  caveat, (c) a pointer to `xref:database/solr/index.adoc#_bibliography[]`. No book named.
- `modules/ROOT/nav.adoc:85-100` holds the Elasticsearch block (ends `**** xref:database/elasticsearch/
  cheat-sheet.adoc[Cheat Sheet (PDF)]` at line 100), immediately followed by
  `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` at line 101 — the new Solr block
  goes between these two lines.
- `modules/ROOT/pages/database/index.adoc` has a `== Sections` bullet list ending with the Elasticsearch
  Reference bullet — the new Solr bullet is appended after it, and the page's `:description:`/`:keywords:` need
  Solr/SolrCloud/SolrJ added.
- `modules/ROOT/pages/index.adoc:102-118` mirrors the same Sections list as nested `**` bullets under
  `* xref:database/index.adoc[Database Development]`; ends with the Elasticsearch sub-bullet at `:115-118`.
- `modules/ROOT/pages/backend/springboot/solr.adoc` and `elasticsearch.adoc` already exist (added under issue
  #61, before either dedicated reference existed) — both still say "A dedicated in-depth guide will follow" and
  need the light cross-linking pass described in Group 5 below. `springboot-solrcloud-topology.svg` already
  exists under `modules/ROOT/images/` (used by `solr.adoc`) and can be referenced/mirrored by the new
  `solr-*.svg` SolrCloud diagram if useful, but is not itself moved or renamed.
- `modules/ROOT/pages/backend/springboot/index.adoc:71-77` has one-paragraph blurbs for both the Elasticsearch
  and Apache Solr pages that need a one-line "dedicated reference section" mention (`:description:`/`:keywords:`
  already list the relevant terms — issue says no change needed there).
- No tests/coverage/quality tooling applies to this repository — it is a pure Antora/AsciiDoc docs repo. The
  only verification gate is `npx antora antora-playbook.yml` building clean (no `xref`/AsciiDoc errors, zero
  "skipping reference to missing attribute" warnings — Solr's `{!parser ...}` local-params syntax must be
  escaped as `\{!parser ...}` everywhere it appears in prose outside `[source]` blocks).
- No `*-code-one-task` skill key applies to AsciiDoc content work (only `java`, `dotnet`, `database` are
  installed) — per `iru-plan` Step 5, tasks below carry no language/framework tag, matching how
  `implementation_plan_70.md`'s tasks were also left untagged.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/solr-disclaimer.adoc`
  - [x] Task 1.1. Author it as an `[IMPORTANT]`/`====` admonition, the same "book-free" shape as
    `elasticsearch-disclaimer.adoc`/`couchbase-disclaimer.adoc`. It must state, in order: (a) this section
    documents **the current Solr line** (10.0; 9.10.x the maintained 9.x branch) as published at
    https://solr.apache.org/guide/solr/latest/[the Apache Solr Reference Guide], **which is the reference these
    pages are written and verified against**; no specific patch version is pinned; some capabilities (the Solr
    Operator on Kubernetes, the package-manager ecosystem, Learning To Rank model training, and expert plugin
    development) are **linked, not documented in depth**; (b) this content was generated with the assistance of
    AI and should be verified against https://solr.apache.org/guide/solr/latest/[the official documentation]
    before being relied on in production. **Must not name any book, "consulted references", or "the sources
    below".**
  - [x] Task 1.2. End with a pointer: "This section's
    `xref:database/solr/index.adoc#_bibliography[bibliography]` lists the reference material consulted while
    preparing these pages." Confirm the include line used on every page in Groups 2–4 is
    `include::partial$solr-disclaimer.adoc[]`.
  - Note: created `modules/ROOT/partials/solr-disclaimer.adoc` mirroring the couchbase/elasticsearch "book-free"
    template; no book named.

### Group 2 — Content pages

**Parallelizable: yes** — 31 independent pages (Tasks 2–32). Each includes the Group 1 disclaimer partial and
cross-links other pages only by `xref:` (no page needs another Group 2 page's finished text). Each page authors
any `solr-*.svg` figure it embeds. Every page must carry **at least one runnable example**
(`[source,bash]` `curl` against the Solr HTTP API as the primary style, plus `[source,json]` / `[source,xml]` /
`[source,java]` SolrJ where useful) and link the specific official Reference Guide page(s) it documents — not a
generic "see the Solr guide". **Escape every literal `{!...}` local-params occurrence in prose as `\{!...}`** —
no escaping needed inside `[source]` blocks. Consolidated validation for the group is the Task 33 Antora build.

- [x] Task 2. Create `modules/ROOT/pages/database/solr/getting-started.adoc` — what Solr is (a standalone
  search server over Apache Lucene, JSON/XML/CSV over HTTP), the release line (10.0; 9.10.x maintained), the
  `bin/solr` control script, running Solr (binary, Docker, pointer to the Solr Operator), the Admin UI, the
  `curl` / `bin/solr post` conventions used throughout this section, and a first
  create-a-collection → index-a-doc → search round-trip. Links: `getting-started/introduction.html`,
  `getting-started/solr-tutorial.html`, `getting-started/documents-fields-schema-design.html`,
  `deployment-guide/solr-control-script-reference.html`, `deployment-guide/installing-solr.html`,
  `deployment-guide/solr-in-docker.html`.
- [x] Task 3. Create `modules/ROOT/pages/database/solr/core-concepts-and-architecture.adoc` — documents and
  fields, the inverted index, terms/phrases/positions/Boolean logic, the denormalized document, **cores vs.
  collections**, user-managed vs. SolrCloud **cluster types**, the request-handler → search-component →
  query-parser processing pipeline (embed `image::solr-request-pipeline.svg[…]`, authored in this task — Task
  3.x), and near-real-time search. Links: `deployment-guide/cluster-types.html` and the "Solr Concepts"/
  "Documents, Fields, and Schema Design" guide pages.
- [x] Task 4. Create `modules/ROOT/pages/database/solr/schema-and-fields.adoc` — `schema.xml` vs. the
  **managed schema** and **Schema API**, **Schemaless mode** and the **Schema Designer**, `uniqueKey`,
  `field`/`dynamicField`/`copyField`, field flags (`indexed`/`stored`/`docValues`/`multiValued`/`required`/
  `useDocValuesAsStored`), preventing field explosion. Links: `indexing-guide/schema-elements.html`,
  `.../schema-api.html`, `.../schemaless-mode.html`, `.../fields.html`, `.../copy-fields.html`,
  `.../dynamic-fields.html`, `.../docvalues.html`.
- [x] Task 5. Create `modules/ROOT/pages/database/solr/field-types.adoc` — `StrField`/`TextField`, the
  **`point`-based numeric types** (replacing the removed trie fields) with `docValues`, `DatePointField` and
  date math, `BoolField`, `EnumFieldType`, currency, `UUIDField`, spatial (`LatLonPointSpatialField`),
  `DenseVectorField`; field-type properties and analyzer bindings. **Must state `point`-based numeric fields are
  current (not trie fields).** Links: `indexing-guide/field-types-included-with-solr.html`,
  `.../field-type-definitions-and-properties.html`.
- [x] Task 6. Create `modules/ROOT/pages/database/solr/text-analysis.adoc` — analyzers as char filters →
  tokenizer → token filters (embed `image::solr-analysis-chain.svg[…]`, authored in this task), index-time vs.
  query-time analyzers, the Analysis screen/Schema Browser, common tokenizers/filters with practical recipes:
  `StandardTokenizer`/`WhitespaceTokenizer`, `WordDelimiterGraphFilter`, stop/lowercase/`ASCIIFolding`,
  n-gram/edge-n-gram/shingle for partial matching, stemming (`KStem`, Porter, `EnglishMinimalStem`),
  `KeywordMarkerFilter`/`StemmerOverrideFilter`, `SynonymGraphFilter`. Links: `indexing-guide/analyzers.html`,
  `.../tokenizers.html`, `.../filters.html`, `.../charfilters.html`.
- [x] Task 7. Create `modules/ROOT/pages/database/solr/language-analysis.adoc` — per-language field
  types/analyzer chains, stemming vs. lemmatization, Hunspell dictionary stemming, ICU folding, phonetic
  matching, multilingual strategies (field-per-language, core-per-language, multiple languages per field), and
  language-identification update processors. Links: `indexing-guide/language-analysis.html`,
  `.../phonetic-matching.html`, `.../language-detection.html`.
- [x] Task 8. Create `modules/ROOT/pages/database/solr/indexing-and-updates.adoc` — the update request handlers
  and `/update`, `/update/json`, `/update/csv` endpoints; indexing JSON (incl. "custom JSON"), XML, CSV, CBOR;
  the **Post Tool** (`bin/solr post`); adding documents from SolrJ (`SolrInputDocument`); **commits** — hard vs.
  soft, `autoCommit`/`autoSoftCommit`/`commitWithin` — the **transaction log**, **RealTime Get**,
  `openSearcher`; plus (folded in per the plan's merge choice) **update request processor (URP) chains**, **Solr
  Cell/Apache Tika** (`ExtractingRequestHandler`) for rich documents, the **Data Import Handler** (note: moved
  out of core into a community package), and a short note on external ETL/CDC patterns for keeping Solr in sync
  with a system of record. Links: `indexing-guide/indexing-with-update-handlers.html`,
  `configuration-guide/commits-transaction-logs.html`, `configuration-guide/realtime-get.html`,
  `indexing-guide/post-tool.html`, `configuration-guide/update-request-processors.html`,
  `indexing-guide/indexing-with-tika.html`.
- [x] Task 9. Create `modules/ROOT/pages/database/solr/partial-updates-and-concurrency.adoc` — atomic/
  field-level updates and in-place updates, `_version_` **optimistic concurrency control** and the
  update-semantics table, **nested child documents** and block indexing, de-duplication (signature URP), and
  reindexing strategies. Links: `indexing-guide/partial-document-updates.html`,
  `.../indexing-nested-documents.html`, `.../reindexing.html`.
- [x] Task 10. Create `modules/ROOT/pages/database/solr/query-basics-and-parameters.adoc` — the `/select`
  handler and request anatomy, common query parameters (`q`, `fq`, `rows`, `start`, `fl`, `sort`, `wt`,
  `defType`, `debugQuery`, `omitHeader`), **`q` vs. `fq`** and the **filter cache** (caching, execution order,
  cost, post-filtering), response writers, document transformers, field-list pseudo-fields/aliases, and
  pagination — `start`/`rows` vs. **`cursorMark`** deep paging and `/export`. Links:
  `query-guide/common-query-parameters.html`, `query-guide/pagination-of-results.html`,
  `query-guide/exporting-result-sets.html`.
- [x] Task 11. Create `modules/ROOT/pages/database/solr/query-parsers.adoc` — the **standard (Lucene)** parser
  syntax; **DisMax**/**eDisMax** in depth (`qf`/`pf`/`pf2`/`pf3`/`ps`/`qs`/`tie`/`bq`/`bf`/`mm`, field aliasing,
  user fields); **local params** and parameter dereferencing (escaped as `\{!type k=v}`); specialised parsers —
  `frange`/`func`, `term`/`terms`, `join`, **block-join** (`\{!parent}`/`\{!child}`), `\{!collapse}`, `\{!knn}`,
  `prefix`, `boost`, `switch`, `surround`, `min-hash`. Links: `query-guide/standard-query-parser.html`,
  `.../dismax-query-parser.html`, `.../edismax-query-parser.html`, `.../local-params.html`,
  `.../other-parsers.html`, `.../join-query-parser.html`, `.../block-join-query-parser.html`.
- [x] Task 12. Create `modules/ROOT/pages/database/solr/json-request-api.adoc` — the **JSON Request API** and
  **JSON Query DSL** (`query`, `filter`, nested `queries`, `bool`/`boost`/`lucene` clauses), the `params` block,
  **ParamSets**/the **Request Parameters API**, and why the JSON API supersedes brittle URL query strings for
  application code. Links: `query-guide/json-request-api.html`, `query-guide/json-query-dsl.html`,
  `configuration-guide/request-parameters-api.html`.
- [x] Task 13. Create `modules/ROOT/pages/database/solr/function-queries.adoc` — function-query syntax,
  `\{!func}`/`\{!frange}`, returning functions as pseudo-fields, sorting on functions, the function catalog
  (math, relevancy — `query()`, `scale()`, `recip()` — distance, boolean, date), and a custom `ValueSource`
  pointer. Links: `query-guide/function-queries.html`.
- [x] Task 14. Create `modules/ROOT/pages/database/solr/relevance-and-scoring.adoc` — Lucene's practical
  scoring model, classic TF/IDF → **`BM25Similarity` (the current default since Solr 6)** and
  `SchemaSimilarityFactory` for per-field similarity — **state explicitly BM25 is current default with a short
  classic-TF/IDF → BM25 note** — `debugQuery`/`explainOther`, index-time vs. query-time boosting, per-term/
  payload/function/term-proximity boosting, the **Query Elevation Component**, precision vs. recall. Links:
  `query-guide` relevance page, `query-guide/query-elevation-component.html`,
  `query-guide/query-re-ranking.html`.
- [x] Task 15. Create `modules/ROOT/pages/database/solr/faceting.adoc` — classic **field/query/range/interval
  faceting** and **pivot faceting**, multi-select faceting with `tag`/`ex`, facet `key`s, field-faceting
  parameters; plus (folded in per the plan's merge choice) the **JSON Facet API**: `terms`/`range`/`query`/
  `heatmap` facets, metric aggregations and `facet` functions, nested sub-facets, **`domain` changes**
  (`blockChildren`/`blockParent`/`excludeTags`/`join`), `method`/streaming options, and `relatedness`. Links:
  `query-guide/faceting.html`, `query-guide/json-facet-api.html`.
- [x] Task 16. Create `modules/ROOT/pages/database/solr/grouping-and-collapse.adoc` — result grouping/field
  collapsing vs. the **Collapsing query parser + Expand component**, multiple docs per group, grouping by
  function and by query, paging/sorting grouped results, and grouping gotchas (distributed grouping, faceting
  on groups, performance). Links: `query-guide/result-grouping.html`,
  `query-guide/collapse-and-expand-results.html`.
- [x] Task 17. Create `modules/ROOT/pages/database/solr/highlighting.adoc` — the **Unified Highlighter**
  (default) vs. the Original and FastVector highlighters, `hl.*` parameters, per-field overrides, phrase/
  multivalued highlighting, and `storeOffsetsWithPositions`/term-vector offset strategies. Links:
  `query-guide/highlighting.html`.
- [x] Task 18. Create `modules/ROOT/pages/database/solr/spell-check-and-suggest.adoc` — the **SpellCheck
  component** (`DirectSolrSpellChecker`, `WordBreakSolrSpellChecker`), the **Suggester component** and its
  lookup implementations (`FuzzyLookupFactory`/FST, `AnalyzingInfixLookupFactory`, `BlendedInfixLookupFactory`,
  `FreeTextLookupFactory`), n-gram autocomplete, the **Terms component**; plus (folded in per the plan's merge
  choice) **MoreLikeThis** (handler, search component, query parser), **Query Re-Ranking**
  (`rq=\{!rerank}`), and **Learning To Rank** (feature stores, models, the `\{!ltr}` query, `[features]`
  transformer). Links: `query-guide/spell-checking.html`, `.../suggester.html`, `.../terms-component.html`,
  `.../morelikethis.html`, `.../learning-to-rank.html`.
- [x] Task 19. Create `modules/ROOT/pages/database/solr/spatial-search.adoc` — `LatLonPointSpatialField` and
  the recursive-prefix-tree `SpatialRecursivePrefixTreeFieldType`, `\{!geofilt}`/`\{!bbox}`/`geodist()`,
  distance sorting/faceting, WKT shapes and polygon search, heatmap faceting. Links:
  `query-guide/spatial-search.html`.
- [x] Task 20. Create `modules/ROOT/pages/database/solr/dense-vector-search.adoc` — `DenseVectorField` mapping
  (dimensionality, similarity function, HNSW parameters), the **`\{!knn}` query parser** (`topK`, pre- vs.
  post-filtering), using KNN as a re-ranker, hybrid lexical + vector search, integrating an embedding model.
  Links: `query-guide/dense-vector-search.html`.
- [x] Task 21. Create `modules/ROOT/pages/database/solr/streaming-expressions-and-sql.adoc` — the `/stream`
  and `/sql` handlers, **streaming expressions** (sources `search`/`facet`/`random`, decorators
  `select`/`hashJoin`/`rollup`/`having`, evaluators), graph traversal (`nodes`/`gatherNodes`), **Parallel SQL**
  over JDBC (`SELECT ... FROM collection`), worker collections, and a note on the math-expression/time-series
  surface. Links: `query-guide/streaming-expressions.html`, `query-guide/sql-query.html`.
- [x] Task 22. Create `modules/ROOT/pages/database/solr/solrcloud-architecture.adoc` — collections/shards/
  replicas/cores; **ZooKeeper** as the cluster-state/config store; the Overseer; **shard-leader election**;
  **replica types NRT/TLOG/PULL** and when to use each; starting `bin/solr` in cloud mode; uploading configsets
  with `bin/solr zk`/`zkcli` (embed `image::solr-cloud-zookeeper-topology.svg[…]`, authored in this task —
  siblings the existing `springboot-solrcloud-topology.svg`). Links: `deployment-guide/solrcloud-shards-
  indexing.html`, `.../zookeeper-ensemble.html`, `.../node-roles.html`.
- [x] Task 23. Create `modules/ROOT/pages/database/solr/collections-and-configsets.adoc` — the **Collections
  API** (`CREATE`/`DELETE`/`RELOAD`/`MODIFYCOLLECTION`/`SPLITSHARD`/`ADDREPLICA`/`MIGRATE`/`BACKUP`/`RESTORE`),
  **configsets** and the Configset API, **collection aliases** including **Time/Category Routed Aliases**, and
  **replica-placement plugins** (replacing the removed autoscaling framework). Links:
  `deployment-guide/collection-management.html`, `.../aliases.html`,
  `configuration-guide/replica-placement-plugins.html`.
- [x] Task 24. Create `modules/ROOT/pages/database/solr/distributed-indexing-and-search.adoc` — **document
  routing** (`compositeId` vs. `implicit`, composite-ID prefixes/custom hashing, `_route_`), the leader →
  replica **distributed update flow**, the **two-stage distributed query** (query stage then get-fields stage),
  `shards.tolerant`/`shards.preference`, NRT search/`commitWithin`, and **node recovery**/peer-sync. Links:
  `deployment-guide/solrcloud-shards-indexing.html`, `deployment-guide/solrcloud-distributed-requests.html`.
- [x] Task 25. Create `modules/ROOT/pages/database/solr/user-managed-mode-and-replication.adoc` —
  **user-managed (standalone) clusters**, classic **leader/follower index replication** (formerly
  master/slave) via the `/replication` handler, user-managed distributed search with explicit `shards`, and
  when this model is still the right choice vs. SolrCloud. Links:
  `deployment-guide/user-managed-index-replication.html`,
  `deployment-guide/user-managed-distributed-search.html`.
- [x] Task 26. Create `modules/ROOT/pages/database/solr/configuration-and-caches.adoc` — `solr.xml`/
  `solrconfig.xml`, **property substitution** and the **Config API**, request-handler configuration
  (`defaults`/`appends`/`invariants`), **caches** (`filterCache`, `queryResultCache`, `documentCache`,
  per-segment `fieldValueCache`) and **autowarming**/new-searcher warming/`maxWarmingSearchers`, and **circuit
  breakers**/**request rate limiters**. Links: `configuration-guide/configuring-solrconfig-xml.html`,
  `.../caches-warming.html`, `.../config-api.html`, `deployment-guide/circuit-breakers.html`,
  `deployment-guide/rate-limiters.html`.
- [x] Task 27. Create `modules/ROOT/pages/database/solr/indexing-internals-and-performance.adoc` — Lucene
  **segments and merge policy** (`TieredMergePolicy`), `forceMerge`/optimize and when *not* to, transaction-log
  durability, directory factories, soft-commit/`autoSoftCommit` tuning for NRT, `docValues` vs. field cache,
  stored-field vs. `docValues` retrieval, `best_compression`, JVM/GC and heap sizing, SSD/OS page cache, and
  load testing. Links: `configuration-guide/index-segments-merging.html`,
  `deployment-guide/taking-solr-to-production.html`.
- [x] Task 28. Create `modules/ROOT/pages/database/solr/monitoring-and-metrics.adoc` — the **Metrics API** and
  reporters, the **Prometheus exporter**, `/admin/ping` and load-balancer health checks, the Plugins/Stats
  screen, request logging/the slow-query log, distributed tracing, and the Task Management API. Links:
  `deployment-guide/metrics-reporting.html`, `deployment-guide/performance-statistics-reference.html`.
- [x] Task 29. Create `modules/ROOT/pages/database/solr/security.adoc` — **`security.json`**, the
  **authentication plugins** (Basic, JWT/OIDC, Kerberos, certificate), **rule-based authorization**, **audit
  logging**, **TLS/SSL** for client and inter-node traffic, and **ZooKeeper access control**. Links:
  `deployment-guide/basic-authentication-plugin.html`, `.../rule-based-authorization-plugin.html`,
  `.../audit-logging.html`, `.../enabling-ssl.html`, `.../zookeeper-access-control.html`.
- [x] Task 30. Create `modules/ROOT/pages/database/solr/deployment-and-upgrades.adoc` — production readiness
  (`bin/solr` service scripts, `SOLR_HEAP`, file descriptors, `SOLR_OPTS`), **Solr in Docker** and a pointer to
  the **Solr Operator** on Kubernetes, **backup/restore** (Collections `BACKUP`/`RESTORE` API, incremental
  backups), **rolling restarts**, the **upgrade path**/"Major Changes" notes, and the **package manager**.
  Links: `deployment-guide/taking-solr-to-production.html`, `deployment-guide/solr-in-docker.html`,
  `configuration-guide/package-manager.html`, `upgrade-notes/major-changes-in-solr-9.html`.
- [x] Task 31. Create `modules/ROOT/pages/database/solr/spring-boot-integration.adoc` — talking to Solr from a
  Spring Boot app with **SolrJ** now that Spring Data Solr is retired: an `Http2SolrClient`/`CloudSolrClient`
  `@Bean` bound from `@ConfigurationProperties`, `SolrInputDocument`/`SolrQuery`/`QueryResponse`, calling the
  JSON Request API from Java, error handling/retries, and integration testing with the Testcontainers
  `SolrContainer`. Cross-link `xref:backend/springboot/solr.adoc[]` (stay consistent with it — see Group 5).
  Links: `deployment-guide/solrj.html`.
- [x] Task 32. Create `modules/ROOT/pages/database/solr/solr-vs-elasticsearch.adoc` — the full **Solr vs.
  Elasticsearch/OpenSearch** comparison: shared Lucene core; API philosophy; per-side strengths/weaknesses
  (Solr: JSON Facet API, streaming expressions/Parallel SQL, LTR, pluggable everything, Apache-2.0;
  Elasticsearch: JSON-native client story, aggregations, ES\|QL, ingest pipelines, ILM/data streams, managed-
  service reach); operations (ZooKeeper vs. built-in coordination); **licensing history** (Solr Apache-2.0
  throughout; Elasticsearch SSPL/Elastic License 2021 → https://opensearch.org/[OpenSearch] fork → AGPL added
  2024); **momentum/contributor-base trend**
  (https://db-engines.com/en/ranking_trend/system/Elasticsearch%3BSolr[DB-Engines trend]); and the accurate
  "is Solr discontinued?" explanation — **Apache Solr itself is an active top-level project** (10.0, March
  2026; 9.10.x maintained), but **Spring Data Solr** was moved to the
  https://github.com/spring-attic/spring-data-solr[Spring Attic] in 2020
  (https://spring.io/blog/2020/04/07/spring-data-for-apache-solr-discontinued/[announcement]) so there is no
  Spring Boot auto-configuration and SolrJ is the only supported path — the "discontinued" claim refers to that
  Spring integration, not to Solr itself; plus choose/don't-migrate guidance. Cross-link
  `xref:database/choosing-the-right-database.adoc[]` and `xref:database/elasticsearch/index.adoc[]` (don't
  restate their content).

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 34 renders the PDF that Task 33's page links, and Task 33's back-links reference
every Group 2 page. Depends on Group 2.

- [x] Task 33. Create `modules/ROOT/pages/database/solr/cheat-sheet.adoc` — header (`= Apache Solr Cheat
  Sheet`, `:description:`, `:keywords:`) + `include::partial$solr-disclaimer.adoc[]` + a short intro sentence,
  then grouped `xref:` back-links to all 31 Group 2 pages (grouped the same way as the section index in Task
  35), modelled on `database/elasticsearch/cheat-sheet.adoc`. No literal `\{ }` braces unescaped in prose; every
  `xref:` target verified present on disk. End with
  `xref:attachment$solr-cheat-sheet.pdf[Download the Apache Solr Cheat Sheet (PDF)]`. **No mention of the
  book** (all bibliography lives in `index.adoc`).
- [x] Task 34. Build `modules/ROOT/attachments/solr-cheat-sheet.pdf`
  - [x] Task 34.1. In a scratch location (not the repo), hand-build a print-ready single-page HTML/CSS layout —
    colour-coded boxes summarising: the `curl`/JSON request shape; `schema.xml`/managed-schema field skeleton;
    the analysis chain; the update/commit skeleton (`/update/json`, `commitWithin`); the eDisMax
    `qf`/`pf`/`bq`/`bf`/`mm` parameter set; local params `\{!type k=v}`; the JSON Request API skeleton; a
    faceting + JSON Facet API skeleton; highlighting `hl.*` params; the `\{!knn}` KNN query; a streaming-
    expression/Parallel SQL one-liner; the SolrCloud collection/shard/replica topology; the Collections API
    verbs; the cache/`solrconfig.xml` skeleton; a `security.json` authentication-plugin skeleton; and a
    SolrJ `Http2SolrClient`/`SolrInputDocument`/`SolrQuery` skeleton.
  - [x] Task 34.2. Render to PDF with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
    verify it is **exactly one page** and shows no clipping, then copy the PDF to
    `modules/ROOT/attachments/solr-cheat-sheet.pdf`. Do **not** check in the HTML source.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 35–39 each edit a shared wiring file and Task 39 builds on all prior groups; the
build must run last.

- [x] Task 35. Create `modules/ROOT/pages/database/solr/index.adoc`
  - [x] Task 35.1. Header (`= Apache Solr Reference`, `:description:`, `:keywords:`) +
    `include::partial$solr-disclaimer.adoc[]` + a lead paragraph introducing Solr (a standalone search server
    built on Apache Lucene) and pointing new readers to `getting-started.adoc` →
    `core-concepts-and-architecture.adoc` → `schema-and-fields.adoc` → `query-basics-and-parameters.adoc`
    first; a short line pointing to the sibling `xref:database/elasticsearch/index.adoc[Elasticsearch
    Reference]` for the closest comparison (and `solr-vs-elasticsearch.adoc` for the full write-up).
  - [x] Task 35.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped: *Getting
    started* (getting-started); *Core concepts, schema & analysis* (core-concepts-and-architecture,
    schema-and-fields, field-types, text-analysis, language-analysis); *Indexing* (indexing-and-updates,
    partial-updates-and-concurrency); *Querying* (query-basics-and-parameters, query-parsers,
    json-request-api, function-queries, relevance-and-scoring, faceting, grouping-and-collapse, highlighting,
    spell-check-and-suggest, spatial-search, dense-vector-search, streaming-expressions-and-sql); *SolrCloud &
    operations* (solrcloud-architecture, collections-and-configsets, distributed-indexing-and-search,
    user-managed-mode-and-replication, configuration-and-caches, indexing-internals-and-performance,
    monitoring-and-metrics, security, deployment-and-upgrades); *Spring Boot integration & comparison*
    (spring-boot-integration, solr-vs-elasticsearch); *Cheat sheet*.
  - [x] Task 35.3. `== Bibliography` — **the only place any source is named**. List:
    - https://solr.apache.org/guide/solr/latest/[the Apache Solr Reference Guide] — the source every page is
      written and verified against — with the specific sub-area links used across the pages (all the
      `getting-started/`, `indexing-guide/`, `query-guide/`, `deployment-guide/`, `configuration-guide/`, and
      `upgrade-notes/` pages linked from Tasks 2–32, consolidated).
    - https://solr.apache.org/docs/[the SolrJ API Javadoc] and https://solr.apache.org/operator/[the Apache
      Solr Operator documentation] (linked, not documented in depth).
    - Grainger, Trey; Potter, Timothy. _Solr in Action_. Manning Publications, 2014. ISBN 9781617291029.
      Consulted as part of the bibliography for this section; its code targets Solr 4.7/early SolrCloud, so
      where it and the official documentation disagree the official documentation is authoritative and the
      difference is noted; none of its content is the primary or main reference for this section. Publisher
      page: https://www.manning.com/books/solr-in-action .
    - (Pointer) Turnbull, Doug; Berryman, John. _Relevant Search_. Manning Publications, 2016. ISBN
      9781617292774. A conceptual companion on relevance engineering, listed as a pointer for
      `relevance-and-scoring.adoc`. Publisher page: https://www.manning.com/books/relevant-search .
    - A closing sentence: the books are consulted bibliography references only and are **not** the primary
      reference for the section; https://solr.apache.org/guide/solr/latest/[the official Reference Guide] wins
      on any discrepancy.
- [x] Task 36. Wire `modules/ROOT/nav.adoc`
  - [x] Task 36.1. Insert a `*** xref:database/solr/index.adoc[Apache Solr Reference]` block with one `****`
    line per page **in the section-index order** from Task 35.2, **after** the Elasticsearch block's
    `**** xref:database/elasticsearch/cheat-sheet.adoc[Cheat Sheet (PDF)]` line (`nav.adoc:100`) and **before**
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` (`nav.adoc:101`), ending with
    `**** xref:database/solr/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use short link labels matching each page's
    heading (e.g. `[Getting Started]`, `[Core Concepts & Architecture]`, `[Schema & Fields]`, `[Field Types]`,
    `[Text Analysis]`, `[Language Analysis]`, `[Indexing & Updates]`, `[Partial Updates & Concurrency]`,
    `[Query Basics & Parameters]`, `[Query Parsers]`, `[JSON Request API]`, `[Function Queries]`,
    `[Relevance & Scoring]`, `[Faceting]`, `[Grouping & Collapse]`, `[Highlighting]`,
    `[Spell Check & Suggest]`, `[Spatial Search]`, `[Dense Vector Search]`,
    `[Streaming Expressions & SQL]`, `[SolrCloud Architecture]`, `[Collections & Configsets]`,
    `[Distributed Indexing & Search]`, `[User-Managed Mode & Replication]`, `[Configuration & Caches]`,
    `[Indexing Internals & Performance]`, `[Monitoring & Metrics]`, `[Security]`, `[Deployment & Upgrades]`,
    `[Spring Boot Integration]`, `[Solr vs. Elasticsearch]`).
- [x] Task 37. Update `modules/ROOT/pages/database/index.adoc`
  - [x] Task 37.1. Add a `== Sections` bullet after the Elasticsearch Reference one:
    `xref:database/solr/index.adoc[Apache Solr Reference] -- the Lucene-based search server: cores and
    collections, schema and analysis, indexing and querying, the JSON Request/Facet APIs, relevance, SolrCloud,
    security, deployment and the SolrJ client, plus a downloadable one-page cheat sheet.`
  - [x] Task 37.2. Extend the page `:description:` and `:keywords:` to mention Apache Solr / SolrCloud / SolrJ.
- [x] Task 38. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 38.1. Add a nested `**` sub-bullet under Database Development after the Elasticsearch Reference
    line (`:115-118`): `** xref:database/solr/index.adoc[Apache Solr Reference] -- the Lucene-based search
    server: cores/collections, schema and analysis, indexing and querying, the JSON Request/Facet APIs,
    relevance, SolrCloud, security and deployment, plus a one-page cheat sheet.`
  - [x] Task 38.2. Update the page `:keywords:` to include Apache Solr/SolrCloud/SolrJ if not already present.
- [x] Task 39. Update `modules/ROOT/pages/database/choosing-the-right-database.adoc`
  - [x] Task 39.1. In the `== Full-Text Search Engines -- Elasticsearch` section (`:221`), add one sentence
    naming Solr as the other mature Lucene-based search server with an
    `xref:database/solr/index.adoc[Apache Solr Reference]` link (e.g. "Apache Solr is the other mature
    Lucene-based search server in this space -- see xref:database/solr/index.adoc[Apache Solr Reference] and
    xref:database/solr/solr-vs-elasticsearch.adoc[Solr vs. Elasticsearch] for how the two compare."). Do not
    restate content.
  - [x] Task 39.2. Optionally add the same `xref` in the `== Vector Databases` section (`:295`) where relevant
    (Solr's `\{!knn}` dense-vector search), if it reads naturally.

### Group 5 — Spring Boot documentation review pass

**Parallelizable: no** — a light cross-linking edit of files already touched conceptually by Group 4 (both
edit shared/related pages); run after Group 4 so the new `database/solr/` xref targets exist. Scope guard: this
is cross-linking only — do not expand these pages into second copies of the references.

- [x] Task 40. Update `modules/ROOT/pages/backend/springboot/solr.adoc`
  - [x] Task 40.1. Replace "A dedicated in-depth guide will follow." with a cross-link to
    `xref:database/solr/index.adoc[Apache Solr Reference]`, and add that xref to the page's `== References`
    list.
  - [x] Task 40.2. Fold in a one-line-each mention (each deferring to the new reference for detail) of: the
    **JSON Request API** callable from SolrJ, **`\{!knn}` dense-vector search**, the **replica types (NRT/
    TLOG/PULL)**, and **`commitWithin`/soft commits** as the normal way to control visibility from application
    code instead of an explicit `commit()` per write. Add a `[WARNING]`-style note next to the existing
    `solr.commit(collection)` call in the `index(...)` example method (it currently commits on every write —
    see the method body in `solr.adoc`) flagging commit-per-write as an anti-pattern and linking
    `xref:database/solr/indexing-and-updates.adoc[]` for the `commitWithin`/`autoSoftCommit` alternative.
  - [x] Task 40.3. Keep the existing `=== Solr vs. Elasticsearch -- how to choose` section, but point it at
    `xref:database/solr/solr-vs-elasticsearch.adoc[]` for the long version instead of (or in addition to) the
    current inline summary.
- [x] Task 41. Update `modules/ROOT/pages/backend/springboot/elasticsearch.adoc`
  - [x] Task 41.1. Replace "A dedicated in-depth guide ... will follow." with a cross-link to
    `xref:database/elasticsearch/index.adoc[Elasticsearch Reference]`, and add that xref to the page's
    `== References` list (currently links only Spring Data Elasticsearch, the Java API Client, and
    `elastic.co/docs`).
- [x] Task 42. Update `modules/ROOT/pages/backend/springboot/index.adoc`
  - [x] Task 42.1. Update the Elasticsearch blurb (`:71-74`) and Apache Solr blurb (`:75-77`) to note each has
    a dedicated reference section under Database Development (`xref:database/elasticsearch/index.adoc[]` /
    `xref:database/solr/index.adoc[]`). No `:description:`/`:keywords:` change needed (both already list the
    relevant terms per the issue).

### Group 6 — Build & verify

**Parallelizable: no** — depends on every prior group having landed.

- [x] Task 43. Build & verify
  - [x] Task 43.1. Run `npx antora antora-playbook.yml` via the `iru-gate-runner` agent (or an equivalent
    generic sub-agent) to keep the main context clean, e.g.:
    ```
    Agent({description: "Build Antora site", subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` at the repository root and report back: build success/
        failure, and every xref/AsciiDoc/missing-image/mermaid error plus every 'skipping reference to missing
        attribute' warning verbatim, or confirm zero such warnings/errors."})
    ```
    Fix any error or "skipping reference to missing attribute" warning (unescaped `\{ }` in prose) introduced
    by the new pages until the build completes clean.
  - [x] Task 43.2. Confirm every new page is reachable from both `database/solr/index.adoc` and `nav.adoc`,
    that `build/site/database/solr/...` HTML renders (spot-check a page with a `[mermaid]`/SVG diagram), and
    that `xref:attachment$solr-cheat-sheet.pdf` resolves to the checked-in PDF.
  - [x] Task 43.3. Re-open `modules/ROOT/attachments/solr-cheat-sheet.pdf` and confirm it is a single page with
    no clipped content.
  - [x] Task 43.4. Grep the new pages for any admonition (`[NOTE]`/`[TIP]`/`[IMPORTANT]`/`[WARNING]`/
    `[CAUTION]`) and confirm none names _Solr in Action_, "the book", "consulted", or "the sources" outside
    `index.adoc`'s `== Bibliography`.
  - [x] Task 43.5. Grep all new/edited files for unescaped `{!` occurrences outside `[source]` blocks to catch
    any remaining local-params escaping miss.
