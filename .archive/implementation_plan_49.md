# Implementation Plan: Database Development — "Choosing the Right Database" page

## Task summary

Source: GitHub issue #49

Issue [#49](https://github.com/albertoirurueta/docs/issues/49) ("Guides & References: Choosing the Right
Database page") asks to add **one new standalone page**,
`modules/ROOT/pages/database/choosing-the-right-database.adoc`, to the existing **Guides & References /
Database Development** section. It is a vendor-neutral, fact-driven decision guide covering:

1. Framing / "default to relational", polyglot persistence, and the questions that drive the decision.
2. Relational (SQL) RDBMS — strengths, weaknesses, when to choose.
3. Document stores — when to choose, plus a **MongoDB vs. Couchbase** comparison (query/index surface,
   rule-based vs. cost-based optimizer, memory-first latency vs. index-count degradation, consistency).
4. A **dedicated Elasticsearch / full-text search section** (inverted index vs. `LIKE`, BM25 relevance,
   analysis chain, strengths, "not a system of record" weaknesses, CDC-fed secondary-index architecture).
5. Vector databases for AI/RAG (`pgvector`, Pinecone, Weaviate, Qdrant, Milvus, and reusing an existing engine).
6. Graph databases (Neo4j — index-free adjacency, when relationships *are* the query).
7. A short tour of key-value, wide-column, time-series and columnar/OLAP.
8. A **CQRS section** on keeping several stores consistently updated — command/query split, projections,
   Transactional Outbox, log-based CDC, optional Event Sourcing, eventual-consistency caveats, when to avoid it.
9. Decision aids — a category comparison table, a decision flow, and a "don't over-engineer" note.

It must be wired into `modules/ROOT/nav.adoc`, `modules/ROOT/pages/database/index.adoc` and the root
`modules/ROOT/pages/index.adoc` as the **first** entry under Database Development (before SQL Reference), with
no root project-picker tile. Diagrams (Mermaid and/or SVG) are explicitly required for at least the decision
flow, the CQRS event/CDC flow, and the inverted-index vs. row-scan contrast.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **A disclaimer partial *is* added**, contrary to the issue's "no disclaimer partial" aside. Every other page
   in this repo's `database/` tree and every standalone guide page (`web/cors.adoc`, `web/accessibility.adoc`)
   opens with `include::partial$<topic>-disclaimer.adoc[]`; omitting one here would be the only exception on the
   site. New file: `modules/ROOT/partials/choosing-a-database-disclaimer.adoc`, modelled on
   `cors-disclaimer.adoc`/`accessibility-disclaimer.adoc` (the "no single reference book underpins it" variant),
   and additionally carrying the issue's own caveat that engine-specific claims are version-dependent and that
   vendor benchmarks are self-serving.
2. **Diagram split: 1 hand-authored SVG + 3 Mermaid blocks.** Mermaid handles flows well and is already used for
   flows/sequences across `mongodb/*`, `couchbase/*` and `web/cors.adoc`; hand-authored SVG is used in this repo
   for *structural/side-by-side* figures. So:
   - **SVG** (`modules/ROOT/images/database-inverted-index-vs-row-scan.svg`) — the inverted-index vs. row-scan
     contrast, a side-by-side structural figure in the exact idiom of `couchbase-gsi-scan.svg`.
   - **Mermaid** — the decision flow (§10), the CQRS write-side → outbox/CDC → read-models fan-out (§9), and a
     small polyglot-persistence topology in §1.
   This satisfies the acceptance criterion's "Mermaid `[mermaid]` diagrams and/or embedded SVG figures" without
   hand-authoring figures that Mermaid renders better.
3. **Couchbase is cross-linked as an existing section.** The issue says "(once it lands)" — it landed on `main`
   in PR #48 (issue #45), so `xref:database/couchbase/index.adoc` is a live target and the MongoDB-vs-Couchbase
   subsection links into concrete Couchbase pages (`indexes-and-views.adoc`, `sql-plus-plus-querying.adoc`,
   `concurrency-locking-and-durability.adoc`) rather than only the index.
4. **No cheat-sheet PDF and no root project-picker icon.** This is an orientation page, not a reference
   subsection — matching `web/cors.adoc` and `web/accessibility.adoc`, which have neither. The issue asks for
   neither.
5. **Citations follow the section convention**: inline AsciiDoc link macros in the body where a specific claim
   needs backing, plus a closing `== Bibliography` section grouping the ~25 URLs the issue supplies. Vendor
   material (Couchbase's and MongoDB's mutual comparison pages) is labelled as vendor-published in the
   bibliography line itself.
6. **Nav placement**: `nav.adoc` — a new `***` entry between line 17 (`** …[Database Development]`) and line 18
   (`*** …[SQL Reference]`). This is the only `***` entry under Database Development that is a page rather than
   a subsection, which is exactly the `web/cors.adoc` / `web/accessibility.adoc` precedent under Web
   Development (nav lines 53–54).
7. **Scope of the "other categories" tour is deliberately shallow** — one short paragraph each for key-value,
   wide-column, time-series and columnar/OLAP, no code examples. The page is a chooser, not a reference for
   engines this site does not document.
8. **This is a small, additive change**: one new content page, one new partial, one new SVG, three wiring edits,
   and a build check. Modelled on [.archive/implementation_plan_41.md](.archive/implementation_plan_41.md)
   (issue #41 — a single new page plus wiring edits plus a build gate), with the SVG/disclaimer work borrowed
   from [.archive/implementation_plan_45.md](.archive/implementation_plan_45.md) (issue #45 — Couchbase).

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook ([antora-playbook.yml](antora-playbook.yml))
  plus the root `irurueta` component ([antora.yml](antora.yml)), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), pages under `modules/ROOT/pages/`. The only verification is a
  clean `npx antora antora-playbook.yml` (no lint/test suite; `build/` is gitignored).
- **Installed `*-code-one-task` skill keys are `java`, `dotnet` and `database` only** — none applies to AsciiDoc
  authoring (`database` covers SQL/schema code, not documentation). Every task below is therefore left
  **untagged**, to be implemented directly.
- **`iru-gate-runner`** is installed in `.claude/agents/` — used for the final Antora build so the build log stays
  out of the main context.
- **`modules/ROOT/pages/database/`** currently contains `index.adoc` plus three subsections: `sql/` (13 pages),
  `mongodb/` (21 pages) and `couchbase/` (15 pages — merged to `main` via PR #48). There is no standalone page
  directly under `database/` yet; this will be the first.
- **Standalone-page precedent**: [modules/ROOT/pages/web/cors.adoc](modules/ROOT/pages/web/cors.adoc) — header
  (`= Title` / `:description:` / `:keywords:`), blank line, `include::partial$cors-disclaimer.adoc[]`, blank
  line, a two-paragraph lead, then `==` sections mixing prose, `[mermaid]` blocks, `[cols="1,3"]` tables and
  `[source,<lang>]` blocks. `web/accessibility.adoc` follows the same shape.
- **Mermaid** is in use on 10 pages (`mongodb/replication.adoc`, `mongodb/transactions.adoc`,
  `couchbase/sql-plus-plus-querying.adoc`, `web/cors.adoc`, …). Syntax is a `[mermaid]` line followed by a
  `....` delimited block. Rendered by `@sntke/antora-mermaid-extension`, configured in the playbook.
- **SVG figures** live in `modules/ROOT/images/` (8 `mongodb-*.svg`, 6 `couchbase-*.svg`) and are referenced as
  `image::<file>.svg["<long descriptive alt text>",width=760,role=text-center]`. House SVG idiom (see
  `modules/ROOT/images/couchbase-gsi-scan.svg`): `viewBox="0 0 800 <H>"`, an explicit opaque
  `<rect …  fill="#ffffff"/>` background, `font-family="Helvetica, Arial, sans-serif"`, a bold title `<text>` at
  the top plus a monospace subtitle, numbered boxes with a coloured header bar (`#1c4b73` blue, `#2f5424`
  green), body copy in `#222222` and captions in `#666666`, `&#8226;` for bullet separators. Colours are
  hard-coded for a light background; no dark-mode variants exist.
- **Disclaimer partials** live in `modules/ROOT/partials/` (17 of them). Two flavours: the
  "documented against an official source" flavour (`sql-`, `mongodb-`, `couchbase-`) and the "no single
  reference book underpins it" flavour (`cors-`, `accessibility-`). This page needs the second.
- **Verified insertion points** (on branch `feature/49`, based off `main` @ `5326865`):
  - `modules/ROOT/nav.adoc` — line 17 `** xref:database/index.adoc[Database Development]`, line 18
    `*** xref:database/sql/index.adoc[SQL Reference]`. New entry goes between them.
  - `modules/ROOT/pages/database/index.adoc` — `== Sections` at line 8; first bullet (SQL Reference) at lines
    10–11. New bullet goes above line 10. `:description:` line 2, `:keywords:` line 3.
  - `modules/ROOT/pages/index.adoc` — `== Guides & References` at line 77; `* …[Database Development]` at lines
    81–82; first `**` child (SQL Reference) at lines 83–84. New `**` entry goes between line 82 and line 83.
    `:description:` line 2, `:keywords:` line 3.
- **AsciiDoc gotcha carried over from `.archive/implementation_plan_41.md`**: literal `{ … }` braces in prose
  *outside* `[source]`/`....` blocks must be backslash-escaped (`\{`), or the Antora build emits
  `skipping reference to missing attribute` warnings.
- **New file map**: creates `modules/ROOT/pages/database/choosing-the-right-database.adoc`,
  `modules/ROOT/partials/choosing-a-database-disclaimer.adoc`,
  `modules/ROOT/images/database-inverted-index-vs-row-scan.svg`; edits `modules/ROOT/nav.adoc`,
  `modules/ROOT/pages/database/index.adoc`, `modules/ROOT/pages/index.adoc`.

## Conventions this page must follow

- Header: `= Choosing the Right Database`, then `:description:` (one sentence) and `:keywords:` (comma list), a
  blank line, `include::partial$choosing-a-database-disclaimer.adoc[]`, a blank line, then a two-to-three
  sentence lead stating the page is a chooser and that the per-engine detail lives in the sibling references.
- Prose wrapped at ~115 columns, matching every other page in `modules/ROOT/pages/`.
- `--` for em dashes (the site uses `--`, not `—`) in body prose.
- Cross-link rather than restate: `xref:database/sql/index.adoc[]`, `xref:database/mongodb/index.adoc[]`,
  `xref:database/couchbase/index.adoc[]` and their specific pages wherever the page would otherwise duplicate
  reference content.
- Tables use `[cols="…"]` + `|===` (see `web/cors.adoc`); wide comparison tables get explicit column weights so
  they don't overflow.
- Every external claim that is version-dependent or contested gets an inline link macro; everything else is
  collected in `== Bibliography` at the end.
- No `[source]` code examples are required on this page (it compares categories rather than teaching an API);
  short inline literals like `` `LIKE '%term%'` `` and `` `pgvector` `` are enough.

## Implementation steps

### Task group 1 — Supporting assets (partial + figure)

`Parallelizable: yes` — two independent new files, neither referencing the other.

- [x] Task 1. Create the disclaimer partial `modules/ROOT/partials/choosing-a-database-disclaimer.adoc` — new file `modules/ROOT/partials/choosing-a-database-disclaimer.adoc` (`[IMPORTANT]`/`====` block, two paragraphs). No tests/coverage/license-header/static-analysis: n/a (docs repo, no suite). Validation: file is well-formed AsciiDoc.
  - [x] Task 1.1. Write an `[IMPORTANT]` / `====` block in the style of
        `modules/ROOT/partials/cors-disclaimer.adoc`: state that this page is a **vendor-neutral overview**, that
        unlike the SQL/MongoDB/Couchbase sections no single reference underpins it, that it was generated with
        the assistance of AI from general knowledge, and that it must be verified against each engine's own
        current documentation before being relied on in production.
  - [x] Task 1.2. Add a second paragraph carrying issue #49's own caveats: engine capabilities move fast (the
        Couchbase optimizer behaviour and Elasticsearch's vector/kNN surface in particular are
        version-dependent), and **vendor-published comparisons are self-serving** — cite both
        https://www.couchbase.com/comparing-couchbase-vs-mongodb/ and
        https://www.mongodb.com/resources/compare/couchbase-vs-mongodb as examples of the same comparison told
        two ways.

- [x] Task 2. Create the figure `modules/ROOT/images/database-inverted-index-vs-row-scan.svg` — new file `modules/ROOT/images/database-inverted-index-vs-row-scan.svg` (`viewBox="0 0 800 384"`, opaque white bg, side-by-side green/blue lanes, bottom takeaway strip). Verified well-formed standalone XML via `xml.dom.minidom.parse` and visually in the browser pane. No tests/coverage/license-header/static-analysis: n/a (docs repo, no suite).
  - [x] Task 2.1. Author a side-by-side SVG in the house idiom of
        `modules/ROOT/images/couchbase-gsi-scan.svg`: `viewBox="0 0 800 <H>"` (H ≈ 380), opaque white background
        rect, `font-family="Helvetica, Arial, sans-serif"`, bold title `Finding a word: row scan vs. inverted
        index` at `y=28`, monospace subtitle showing the query being answered (e.g.
        `WHERE body LIKE '%latency%'` on the left, `match: "latency"` on the right).
  - [x] Task 2.2. Left lane (`#2f5424` green header, label `RELATIONAL -- forward index`): a stack of 5–6 row
        boxes each holding a document body, with an arrow sweeping top-to-bottom through **every** row and a
        caption noting the cost grows linearly with table size and results come back unordered.
  - [x] Task 2.3. Right lane (`#1c4b73` blue header, label `SEARCH ENGINE -- inverted index`): a term dictionary
        (`latency → [3, 7, 12]`, `index → [1, 3]`, `shard → [7]`) in monospace, an arrow from the single matched
        term straight to the matching doc IDs, and a caption noting one lookup plus BM25 relevance ordering.
  - [x] Task 2.4. Bottom strip: a one-line takeaway in `#666666` — the inverted index trades write-time
        analysis and extra storage for constant-ish query cost and ranked results.
  - [x] Task 2.5. Verify the file is well-formed standalone XML (e.g. open it directly, or
        `python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('modules/ROOT/images/database-inverted-index-vs-row-scan.svg')"`)
        before it is referenced by the page.

### Task group 2 — Author the page

`Parallelizable: no` — every sub-task appends to the same new file,
`modules/ROOT/pages/database/choosing-the-right-database.adoc`, and each section's cross-references depend on the
sections already written. Depends on group 1 (the page includes the partial from Task 1 and `image::`s the figure
from Task 2).

- [x] Task 3. Create `modules/ROOT/pages/database/choosing-the-right-database.adoc` — new file `modules/ROOT/pages/database/choosing-the-right-database.adoc` (~560 lines): header + disclaimer include + lead, 11 `==` sections, 3 `[mermaid]` blocks (polyglot fan-out `flowchart LR`, CQRS outbox/CDC `flowchart LR`, decision `flowchart TD`), the `database-inverted-index-vs-row-scan.svg` figure, two `[cols]` comparison tables, and a topic-grouped `== Bibliography`. Conventions verified (Task 3.13): no Unicode em/en dashes (all `--`), body prose ≤113 cols (only the single-line `:description:`/`:keywords:`/`image::` exceed, per repo norm), no unescaped `{ }` outside the `....` mermaid blocks, all 13 `xref:` targets exist on disk, all 3 natural `<<...>>` xrefs match real headings (`--`-in-title natural xref confirmed to resolve via a standalone asciidoctor run). No tests/coverage/license-header/static-analysis: n/a (docs repo, no suite); Antora build is Task group 4.
  - [x] Task 3.1. **Header and lead.** `= Choosing the Right Database`; `:description:` (one sentence: a
        vendor-neutral guide to picking a database category and engine — relational, document, search, vector,
        graph, key-value, wide-column, time-series, OLAP — and to keeping several of them consistent with CQRS);
        `:keywords:` (choosing a database, SQL vs NoSQL, relational database, document database, MongoDB,
        Couchbase, Elasticsearch, full-text search, inverted index, vector database, RAG, pgvector, graph
        database, Neo4j, key-value store, wide-column, time-series, polyglot persistence, CQRS, transactional
        outbox, change data capture). Then `include::partial$choosing-a-database-disclaimer.adoc[]` and a
        two-to-three sentence lead.
  - [x] Task 3.2. **`== Start With the Questions That Actually Decide It`.** Data outlives code, so the engine
        choice is among the hardest to reverse. Default to a relational database and move off it only for a
        named reason (scale, access pattern, data shape, latency); many teams add a PostgreSQL extension (JSONB,
        `pgvector`, full-text, PostGIS, time-series) before adopting a second engine. Introduce **polyglot
        persistence** and forward-reference `<<Keeping Several Databases Consistent -- CQRS>>`. Close with the
        decision drivers as a bullet list (data structure; consistency requirements; read/write ratio and
        volume; query patterns — known up front vs. ad hoc vs. relevance-ranked; scale; latency SLA). Include a
        small `[mermaid]` `flowchart LR` showing one system of record fanning out to a cache, a search index, a
        vector index and an analytics store, labelled "every extra engine is operational cost".
  - [x] Task 3.3. **`== Relational Databases (SQL)`.** Three labelled sub-parts —
        `=== Strengths` (ACID, referential integrity, declarative SQL + cost-based optimizer meaning ad-hoc
        queries and joins *without designing access patterns up front*, normalization, mature tooling/ORM/BI,
        modern JSON + extension coverage), `=== Weaknesses` (vertical scaling and the difficulty of distributing
        writes under ACID — name CockroachDB/Spanner/Vitess as the complexity-buying alternative; migrations
        getting heavier over time; join/lock cost at high concurrency; impedance mismatch; recursive-join
        degradation on deep traversal; `LIKE '%term%'` not scaling and having no relevance ranking, linking
        forward to `<<Full-Text Search Engines -- Elasticsearch>>`), and `=== When to choose it` (structured
        relational data, integrity-critical domains, ad-hoc/reporting queries, single well-understood store).
        Cross-link `xref:database/sql/index.adoc[]` and `xref:database/sql/normalization.adoc[]`.
  - [x] Task 3.3.1. Back the "scales vertically / ACID-under-distribution" and "not a cure-all" claims with
        inline links to https://www.cockroachlabs.com/blog/document-store-vs-relational-database/ and
        https://phauer.com/2015/relational-databases-strength-weaknesses-mongodb/.
  - [x] Task 3.4. **`== Document Databases`.** When to choose one (self-contained JSON aggregates, per-record
        schema variance, horizontal scale-out, access by key or a known query shape, developer velocity) and the
        trade-offs vs. relational (tunable/weaker consistency, no cheap arbitrary joins, access patterns must be
        known before modelling, unbounded document growth and duplication). Cross-link
        `xref:database/mongodb/data-modeling.adoc[]` for the embed-vs-reference decision rather than restating
        it.
  - [x] Task 3.5. **`=== MongoDB vs. Couchbase`** (sub-section of §3.4). A `[cols="1,2,2"]` table with rows for
        *query language*, *optimizer*, *indexing behaviour under load*, *caching/latency profile*, *consistency*
        and *scaling model*, followed by prose covering, with inline links:
        - MongoDB's rich Query API + secondary indexes + aggregation pipeline vs. Couchbase's **SQL++ (N1QL)**
          with real JOINs (link `xref:database/mongodb/aggregation-pipeline.adoc[]` and
          `xref:database/couchbase/sql-plus-plus-querying.adoc[]`).
        - Couchbase's historically **rule-based** query optimizer, so index/key cardinality does not drive plan
          choice the way a cost-based planner does; **too many Global Secondary Indexes can produce unexpected
          plans and `IntersectScan`**, each array index takes only one array key, and the vendor's own guidance
          is to tune the few hottest queries rather than add indexes, using FTS for multi-array/multi-predicate
          search. Link https://developer.couchbase.com/learn/n1ql-query-performance-guide/ and
          https://www.couchbase.com/blog/n1ql-index-advisor-improve-query-performance-and-productivity/, and
          `xref:database/couchbase/indexes-and-views.adoc[]`.
        - Couchbase's **memory-first** managed cache and masterless architecture giving low, predictable KV
          latency and stable index scans under concurrency (link
          https://www.couchbase.com/blog/testing-mongodb-and-couchbase-concurrent-query/), at the cost of
          **sharper degradation as secondary indexes and complex ad-hoc queries pile onto the same nodes** —
          mitigated by Multi-Dimensional Scaling (`xref:database/couchbase/getting-started.adoc[]`).
        - Consistency: Couchbase strong-consistent KV plus multi-document ACID transactions
          (`xref:database/couchbase/concurrency-locking-and-durability.adoc[]`); MongoDB primary-read
          consistency with tunable read/write concern and multi-document transactions since 4.0
          (`xref:database/mongodb/transactions.adoc[]`).
        - A closing **rule of thumb** paragraph (MongoDB when query/index/aggregation flexibility dominates;
          Couchbase when predictable low latency with a small, well-tuned index footprint dominates) plus an
          explicit note that benchmarks are workload-specific and that both vendors publish comparisons of each
          other.
  - [x] Task 3.6. **`== Full-Text Search Engines -- Elasticsearch`.** Open by stating full-text search is one of
        the most common reasons to add a second store — in practice more common than a graph or vector need.
        Then:
        - `=== How the inverted index works` — term → postings list (doc IDs, term frequency, positions) vs. a
          relational forward index; place the figure with
          `image::database-inverted-index-vs-row-scan.svg["Side-by-side comparison: a relational row scan reading every row to match a LIKE pattern, versus an inverted index looking up one term in a dictionary and jumping straight to the matching document IDs ranked by relevance",width=760,role=text-center]`;
          BM25 relevance (term density in the document weighed against rarity across the index); the analysis
          chain the relational `LIKE` cannot offer (tokenization, stemming, synonyms, stop words, fuzzy/typo
          tolerance, phonetic and n-gram matching, per-language analyzers). Link
          https://www.elastic.co/docs/solutions/search/full-text/how-full-text-works and
          https://www.elastic.co/what-is/full-text-search.
        - `=== Strengths` — relevance ranking, query DSL, faceting and fast aggregations, sharding + replicas to
          billions of documents, near-real-time visibility (~1s), geospatial and kNN/vector search enabling
          hybrid lexical + semantic retrieval, and the Kibana/Logstash/Beats ecosystem. Mention **OpenSearch** as
          the fork with the same model.
        - `=== Weaknesses and when not to use it` — **not a system of record, not transactional**: no
          multi-document ACID, eventually consistent, no real joins; JVM- and memory-heavy; write-amplified,
          resource-intensive indexing; costly to tune at scale (shard sizing, mapping explosions); mapping
          changes usually mean a reindex. Link https://neverblink.ai/kb/elasticsearch-pros-and-cons.
        - `=== Feeding it from the system of record` — keep the RDBMS or document DB authoritative and treat the
          index as a **derived read model**, synced by an outbox dual-write or by **log-based CDC** (Debezium
          reading the PostgreSQL WAL) optionally through Kafka into an Elasticsearch sink, so the application
          writes only to the primary. Link
          https://risingwave.com/blog/cdc-search-indexing-debezium-elasticsearch-risingwave/ and forward-link
          `<<Keeping Several Databases Consistent -- CQRS>>`.
        - `=== When to choose one` — relevance-ranked full text, faceting, search-as-you-type, or log/event
          analytics, *and* you can accept a secondary, eventually consistent store.
  - [x] Task 3.7. **`== Vector Databases`.** What they are (embedding vectors + ANN search via HNSW/IVF with
        metadata filtering); when to use (semantic search, **RAG**, recommendations, deduplication, anomaly
        detection); strengths (purpose-built ANN indexes, metadata filtering, scale to billions, hybrid
        vector + BM25). Then a `=== Choosing one` bullet list keyed by scale/ops: `pgvector` in an existing
        PostgreSQL under roughly 1–10M vectors and whenever embeddings belong beside relational data; Pinecone
        for managed zero-ops and spiky traffic; Weaviate or Qdrant for self-hosted hybrid search and
        multi-tenancy; Milvus at billion scale with a platform team; and reusing what you already run
        (Elasticsearch/OpenSearch kNN, `xref:database/couchbase/search-analytics-eventing.adoc[]` for Couchbase
        Vector Search, MongoDB Atlas Vector Search via
        `xref:database/mongodb/special-indexes-and-search.adoc[]`, Redis). Note explicitly that this overlaps
        §3.6 — a search engine often covers both lexical and vector retrieval, which is one engine fewer to run.
        Link https://www.datacamp.com/blog/the-top-5-vector-databases.
  - [x] Task 3.8. **`== Graph Databases`.** Nodes + relationships as a property graph; traversal by index-free
        adjacency rather than computed joins. When the *relationships are the query* and are many-hop or
        variable-depth: social graphs, recommendations, fraud/AML detection, network and IT topology,
        identity/access graphs, knowledge graphs, supply-chain and dependency analysis, GraphRAG. Strengths
        (traversal cost scales with the subgraph touched, not total data volume; Cypher/openCypher/GQL path
        queries; flexible schema). Weaknesses (not a general-purpose system of record; weaker at high-volume
        tabular transactions, large aggregate scans and BI; whole-graph analytics is expensive; smaller
        ecosystem) and the standard deployment shape — a graph store *alongside* the relational system of
        record. Link https://neo4j.com/blog/graph-database/graph-database-vs-relational-database/ and
        https://www.designgurus.io/blog/graph-database-neo4j.
  - [x] Task 3.9. **`== The Other Categories at a Glance`.** One short paragraph each, no code: **key-value**
        (Redis, DynamoDB, Aerospike — exact-key get/put for caching, sessions, rate limiting, feature flags,
        leaderboards; no range scans over values); **wide-column** (Cassandra, ScyllaDB, HBase, Bigtable —
        masterless, high write throughput, linear horizontal scale, AP-leaning; query patterns must be designed
        into the table); **time-series** (InfluxDB, TimescaleDB, Prometheus — append-heavy timestamped data,
        retention and downsampling, time-range/window queries); **columnar / OLAP** (ClickHouse, Druid, DuckDB,
        warehouses — column storage and vectorized execution for aggregate scans, fed from the system of record).
        Close by noting how many of these needs a modern PostgreSQL absorbs via extensions before a second
        engine is warranted. Link https://airbyte.com/data-engineering-resources/types-of-database and
        https://www.influxdata.com/blog/relational-databases-vs-time-series-databases/.
  - [x] Task 3.10. **`== Keeping Several Databases Consistent -- CQRS`.** Frame the problem: once a project runs
        a system of record plus a search index plus a cache plus a vector store, consistency becomes the hard
        part. Then:
        - `=== The command/query split` — the **command (write) side** owns one source of truth with full ACID
          guarantees; the **query (read) side** is one or more **projections / read models**, each in whichever
          engine serves its queries best (denormalized SQL view, Elasticsearch index, Redis cache, graph, vector
          index).
        - `=== How the stores stay in sync` — the write side emits events describing what changed and each read
          model subscribes and updates itself. Because "write the DB, then publish an event" is two operations
          that can partially fail, use the **Transactional Outbox**: persist the state change and the event in
          the *same* local transaction, then relay the outbox via **log-based CDC** (Debezium) rather than
          polling. Optionally pair with **Event Sourcing** so any projection can be rebuilt by replaying the
          log. Add a `[mermaid]` `flowchart LR` — command → write DB + outbox in one transaction → CDC → broker →
          fan-out to the search index, cache, vector store and analytics store, with the read path drawn back
          from the projections.
        - `=== What it costs you` — the write database stays strongly consistent while projections are
          **eventually consistent** (typically sub-second); name the read-your-own-writes remedies (read back
          from the write store for that flow, session/"pending" indicators, briefly pinning a user to the write
          model).
        - `=== When it is worth it -- and when it is not` — worth it when read and write needs genuinely diverge
          (many query shapes, heavy read/write asymmetry, several specialized read stores, slow joins that
          survive indexing, multi-tenant analytics); not worth it for a simple domain with few uniform reads, or
          a team that cannot absorb the broker, consumers, monitoring and reprocessing — a single database with
          read replicas is usually enough.
        - Link https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs,
          https://www.redhat.com/architect/illustrated-cqrs, https://debezium.io/blog/2025/11/28/cqrs/ and
          https://debezium.io/blog/2020/02/10/event-sourcing-vs-cdc/.
  - [x] Task 3.11. **`== Putting It Together`.** A `[cols="1,1,1,1,2"]` comparison table — *Category*, *Data
        model*, *Consistency*, *Scaling model*, *Best-fit query pattern* — with a row per category (relational,
        document, search engine, vector, graph, key-value, wide-column, time-series, columnar/OLAP), naming
        example engines in the last column. Then a `[mermaid]` `flowchart TD` decision flow: start relational →
        need many-hop relationship traversal? graph → need relevance-ranked full text, faceting or log
        analytics? search engine → need similarity over embeddings? vector → need extreme horizontal write
        scale? wide-column or document → need sub-millisecond key lookups? key-value → need time-range
        telemetry? time-series → need large aggregate scans? columnar/OLAP → more than one of these? go to CQRS.
        Close with a short **"Don't over-engineer"** paragraph: one well-run PostgreSQL handles far more than
        most teams expect, and each added engine should be forced by a measured requirement.
  - [x] Task 3.12. **`== Bibliography`.** Collect issue #49's source list as bullets grouped by topic (SQL vs.
        NoSQL; MongoDB and Couchbase — flagging the two vendor-published comparisons as vendor material;
        Elasticsearch and CDC; CQRS and the outbox; vector databases; graph databases; other categories), each
        as a link macro with the publisher and title, matching the format of `== Bibliography` in
        `modules/ROOT/pages/database/sql/index.adoc` and `modules/ROOT/pages/database/mongodb/index.adoc`.
  - [x] Task 3.13. Re-read the finished page for the repo's AsciiDoc conventions: `--` em dashes, ~115-column
        wrapping, backslash-escaped literal `\{ … }` braces outside `[source]`/`....` blocks, and every `xref:`
        target actually existing on disk.

### Task group 3 — Wiring

`Parallelizable: yes` — three separate files, no interdependency. Depends on group 2 (all three add `xref:`s that
must resolve to the page created in Task 3).

- [x] Task 4. Add the nav entry in `modules/ROOT/nav.adoc` — inserted the `***` entry as the first child under
      `** xref:database/index.adoc[Database Development]`, before `*** xref:database/sql/index.adoc[SQL Reference]`.
      No tests/coverage/license-header/static-analysis: n/a (docs repo, no suite).
  - [x] Task 4.1. Inserted `*** xref:database/choosing-the-right-database.adoc[Choosing the Right Database]`
        between the `** xref:database/index.adoc[Database Development]` line and the
        `*** xref:database/sql/index.adoc[SQL Reference]` line.

- [x] Task 5. Add the section-landing bullet in `modules/ROOT/pages/database/index.adoc` — added the top bullet
      under `== Sections` plus the `:description:`/`:keywords:` metadata. No
      tests/coverage/license-header/static-analysis: n/a (docs repo, no suite).
  - [x] Task 5.1. Inserted the bullet at the top of `== Sections`, above the SQL Reference bullet:
        `* xref:database/choosing-the-right-database.adoc[Choosing the Right Database] -- when to pick a
        relational, document, search, vector, graph, key-value, wide-column, time-series or analytical store,
        how MongoDB and Couchbase differ in practice, and how to keep several databases consistent with CQRS.`
  - [x] Task 5.2. Extended `:description:` to mention "the Choosing the Right Database decision guide" and
        appended to `:keywords:`: `choosing a database, Elasticsearch, full-text search, vector database, RAG,
        graph database, Neo4j, polyglot persistence, CQRS`.

- [x] Task 6. Add the root-landing bullet in `modules/ROOT/pages/index.adoc` — added the `**` child under
      Database Development and extended `:keywords:`; `:description:` left unchanged. No
      tests/coverage/license-header/static-analysis: n/a (docs repo, no suite).
  - [x] Task 6.1. Inserted the `**` entry as the first child of
        `* xref:database/index.adoc[Database Development]`, before the SQL Reference entry:
        `** xref:database/choosing-the-right-database.adoc[Choosing the Right Database] -- a decision guide:
        relational vs. document vs. search vs. vector vs. graph, MongoDB vs. Couchbase, and keeping several
        stores consistent with CQRS.`
  - [x] Task 6.2. Appended to `:keywords:`: `choosing a database, Elasticsearch, full-text search, vector
        database, RAG, graph database, CQRS`. `:description:` left unchanged -- the new page does not materially
        change what the landing page indexes at the top level.
  - [x] Task 6.3. Confirmed **no** project-picker tile is added -- the `== Projects` `[cols="1,1,1"]` image
        table was not touched; the page appears only under `== Guides & References`, matching the SQL, MongoDB
        and Couchbase references.

### Task group 4 — Verification

`Parallelizable: yes` — a single task.

- [x] Task 7. Build the site and confirm the page renders clean -- `npx antora antora-playbook.yml` succeeded
      (exit 0, no WARN/ERROR output at all). No `skipping reference to missing attribute` or `target of xref not
      found` warnings anywhere in the log. Page generated at `build/site/database/choosing-the-right-database.html`
      (112744 bytes; the local component is `ROOT`, so there is no `irurueta/` path segment -- the plan's
      `build/site/irurueta/...` path was a drafting assumption). Rendered output verified: 3 `class="mermaid content"`
      containers, the figure resolves to `_images/database-inverted-index-vs-row-scan.svg` (file present in build
      output), and both comparison tables carry explicit colgroup widths summing to 100% (20/40/40 and
      16.67x4+33.33) with the `stretch` class, so neither overflows horizontally. No new
      xref/missing-attribute/mermaid warnings touch any of the new or changed files.
  - [x] Task 7.1. Delegate the build to the `iru-gate-runner` agent so the Antora log stays out of the main
        context:
        ```
        Agent({
          description: "Antora build check for issue 49",
          subagent_type: "iru-gate-runner",
          prompt: "Run `npx antora antora-playbook.yml` in the repository root. Report back ONLY: whether the
            build succeeded; every WARN/ERROR line mentioning `choosing-the-right-database`,
            `choosing-a-database-disclaimer`, `database-inverted-index-vs-row-scan`, `nav.adoc`,
            `database/index.adoc` or `pages/index.adoc`; any `skipping reference to missing attribute` or
            `target of xref not found` warning anywhere in the log; and whether
            build/site/irurueta/database/choosing-the-right-database.html was produced. Do not paste the full
            build log."
        })
        ```
  - [x] Task 7.2. Confirmed from the agent's report: the page was generated, no new `xref`/attribute warnings
        were introduced (the whole build emitted zero WARN/ERROR lines), and the nav entry plus both
        landing-page bullets resolve (no `target of xref not found` anywhere).
  - [x] Task 7.3. Spot-checked the rendered output in `build/site/database/choosing-the-right-database.html`
        (component is `ROOT`, not `irurueta`) -- the three `[mermaid]` blocks emit `class="mermaid content"`
        containers, the `image::` figure resolves to `_images/database-inverted-index-vs-row-scan.svg` (file
        present in `build/site/_images/`), and both comparison tables render with explicit colgroup widths
        (20/40/40 and 16.67x4+33.33, each summing to 100%) and the `stretch` class -- no horizontal overflow.
