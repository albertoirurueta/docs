# Implementation Plan: SpringBoot Reference — Spring Batch, Hibernate, Elasticsearch, Apache Solr

## Task summary

Source: GitHub issue #61

Add **four new concept-introduction pages** to the existing **SpringBoot Reference** section
(`modules/ROOT/pages/backend/springboot/`), one per concept:

| Page file | Title | Scope |
|-----------|-------|-------|
| `spring-batch.adoc` | Spring Batch | What finite batch processing is; job/step/chunk model; Spring Boot auto-configuration + how to launch a job |
| `hibernate.adoc` | Hibernate (JPA & ORM) | The object/relational paradigm mismatch; persistence context & entity lifecycle; how Spring Boot wires Hibernate as the default JPA provider |
| `elasticsearch.adoc` | Elasticsearch | Inverted index & full-text search; documents/shards/analyzers/query DSL; Spring Boot + Spring Data Elasticsearch integration |
| `solr.adoc` | Apache Solr | Solr/Lucene search server; schema, request handlers, query parsers, SolrCloud; Spring Boot + SolrJ integration (Spring Data Solr is retired) |

Each page is an **overview** — enough vocabulary and **one** runnable Spring Boot example to get started — and
states explicitly that a dedicated in-depth guide will follow. Advanced depth (mapping edge cases, scaling,
relevance tuning, cluster ops) is out of scope here. Then wire the pages into `nav.adoc` and the section landing
page `backend/springboot/index.adoc`.

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **Content-only, untagged plan.** This repo has no application source code; every task is AsciiDoc / SVG
   authoring. `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns only `java` / `dotnet` /
   `database`, none of which covers AsciiDoc — so **no task carries a language/framework tag**, matching every
   prior documentation plan in `.archive/` (`implementation_plan_55.md`, `_57.md`, `_59.md`).
2. **Closest precedents:** `.archive/implementation_plan_55.md` (issue #55 — created this whole section;
   establishes the disclaimer-partial pattern, "mermaid by default, SVG only for spatial layouts",
   one-task-per-page structure, final wiring + delegated build-verification group) and
   `.archive/implementation_plan_59.md` (issue #59 — adding to the already-existing `backend/` area in place,
   `:description:`/`:keywords:` refresh, `npx antora` gate via `iru-gate-runner`). This plan follows both.
3. **Page length:** ~150–300 lines each (issue's stated budget). Deliberately lighter than the section's
   deep-dive pages; no exhaustive API/option tables.
4. **Nav & index placement:** the issue says "implementer's call". Chosen: in `nav.adoc`, insert the four
   entries **immediately after `spring-data-neo4j.adoc`** (currently line 442) in the order
   `hibernate.adoc`, `elasticsearch.adoc`, `solr.adoc`, `spring-batch.adoc` — Hibernate sits next to the Spring
   Data JPA page it complements, the two search engines sit together, Batch closes the run. In
   `index.adoc` "What's covered", add a new `=== ORM, search & batch` group holding the matching four bullets,
   placed after the existing `=== Spring Data` group.
5. **`hibernate.adoc` vs. `spring-data-jpa.adoc` boundary (no overlap):**
   - `hibernate.adoc` **owns**: the paradigm mismatch; `EntityManagerFactory`/`SessionFactory`,
     `EntityManager`/`Session`; the persistence context and entity lifecycle (transient → managed → detached →
     removed); identity vs. equality; lazy vs. eager + the N+1 problem; first-/second-level cache; dirty
     checking & flush modes; JPQL/HQL vs. Criteria vs. native SQL (conceptual comparison only); `hbm2ddl` schema
     generation vs. real migrations; provider-level configuration; a one-paragraph pointer to Hibernate Search.
   - `spring-data-jpa.adoc` **keeps** (already written — do **not** duplicate): `JpaRepository`, derived query
     methods, `@Query`, Specifications/projections, `@Transactional` usage patterns, auditing, `JdbcClient`.
   - `hibernate.adoc` cross-links to `xref:backend/springboot/spring-data-jpa.adoc` and
     `xref:backend/springboot/spring-data-overview.adoc` for "how you actually use this in a Spring app".
6. **One primary figure per page** (implementer may add a second where it genuinely clarifies):
   - `spring-batch.adoc` — `[mermaid]` flowchart: `Job` → `Step` → chunk loop (`ItemReader` → `ItemProcessor` →
     `ItemWriter`) with the commit-interval / transaction boundary marked.
   - `hibernate.adoc` — `[mermaid]` `stateDiagram-v2`: entity lifecycle (new/transient, managed, detached,
     removed) with the `persist`/`find`/`merge`/`detach`/`remove`/`close` transitions.
   - `elasticsearch.adoc` — hand-authored SVG `modules/ROOT/images/springboot-elasticsearch-shards.svg`: a
     spatial node × primary-shard / replica-shard layout across a 3-node cluster (a layout a flowchart cannot
     express well; matches the "SVG only when spatial" convention).
   - `solr.adoc` — hand-authored SVG `modules/ROOT/images/springboot-solrcloud-topology.svg`: a SolrCloud
     topology — ZooKeeper ensemble + a collection sharded across nodes with leader/replica cores.
7. **Bibliography is already updated on this branch** (uncommitted, in `backend/springboot/index.adoc`): the
   official-doc bullet groups and the six editorial books are in place, and the Minella *Spring Batch* entry is
   rewritten from "not used" to an active reference. Task 6 therefore **verifies consistency** (each new page's
   `== References` cites URLs already present in the bibliography) rather than re-adding entries.
8. **Out of scope for every task below:** the uncommitted `@CrossOrigin`/CORS change in
   `modules/ROOT/pages/backend/springboot/rest-apis.adoc` (a separate request riding along on this branch). Do
   not modify, revert, or extend it.
9. **Versions to target** (verified against current official docs — the source books are 6–19 years old):
   - Spring Boot **4.1.x** / Spring Framework **7.0.x**, Java 17/21+ baseline.
   - Spring Batch **5.2.x** (Boot 4.1 BOM): `JobBuilder`/`StepBuilder` (**not** `JobBuilderFactory`),
     `jakarta.batch`, `JobRepository` backed by a real `DataSource` + `PlatformTransactionManager`;
     `@EnableBatchProcessing` **disables** Boot auto-config — show the auto-configured path; launch on startup
     via `spring.batch.job.name`.
   - Hibernate ORM **7.4.x** (Boot 4.1 BOM), **Jakarta Persistence 3.2** (`jakarta.persistence.*`), annotation
     mapping (not `hbm.xml`); default JPA provider via `spring-boot-starter-data-jpa`.
   - Spring Data Elasticsearch from **Spring Data BOM 2026.0.0** + the **Elasticsearch Java API Client** (not
     `TransportClient`/`RestHighLevelClient`); `@Document`, `ElasticsearchRepository`, `ElasticsearchOperations`;
     config via `spring.elasticsearch.*`.
   - Apache Solr **9.x** + SolrJ `Http2SolrClient`; **Spring Data Solr is retired** (Spring Attic, incompatible
     with Boot 3+/4) — state this up front and integrate via a `SolrClient` `@Bean` (Boot has no Solr
     auto-configuration).

## Current code state

- **Section directory:** `modules/ROOT/pages/backend/springboot/` — 33 existing `.adoc` pages, all following
  one house style:
  - `= Title`, then `:description:` and `:keywords:` attribute lines, then `include::partial$springboot-disclaimer.adoc[]`.
  - `==`/`===` sections; fenced code as `[source,java]` / `[source,yaml]` / `[source,xml]` with `----` delimiters.
  - Diagrams: `[mermaid]` then a `....` delimited block (14 occurrences in the section); SVGs via
    `image::springboot-*.svg[<real alt text>,width=700,role=text-center]` (`springboot-hexagonal-architecture.svg`,
    `springboot-data-access-layers.svg` in `modules/ROOT/images/`).
  - Pages end with `== References` (bare official-doc links) or `== Further reading`.
- **`modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc`** — already covers JPA entity mapping,
  inheritance strategies, `JpaRepository`, derived queries, `@Query` (JPQL/native), Specifications/projections,
  `@Transactional`, `@Version`, auditing, `JdbcClient`/`JdbcTemplate`. The new `hibernate.adoc` must complement,
  not repeat it (see choice 5).
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — the section landing page:
  - `== What's covered` grouped by topic (`=== Getting started`, `=== Core concepts`, `=== Spring Data`,
    `=== Caching`, `=== APIs`, …).
  - `:description:` (line 2) and `:keywords:` (line 3) enumerate every sub-topic — must be extended.
  - `== Bibliography` with an "Official documentation" list and a "Local books" list. **Already edited on this
    branch** (uncommitted): five new official-doc bullet groups (Spring Batch, Hibernate ORM, Hibernate Search,
    Spring Data Elasticsearch + Elasticsearch Java API Client + Elasticsearch docs, Apache Solr Reference Guide +
    SolrJ + the Spring Data Solr discontinuation note) and six book entries (Minella *The Definitive Guide to
    Spring Batch* 2e — rewritten to active; Bauer/King/Gregory *Java Persistence with Hibernate* 2e;
    Peak/Heudecker *Hibernate Quickly*; Bernard/Griffin *Hibernate Search in Action*; Gheorghe/Hinman/Russo
    *Elasticsearch in Action*; Grainger/Potter *Solr in Action* — all with ISBNs and Manning/Apress links).
- **`modules/ROOT/nav.adoc`** — the **SpringBoot Reference** block is lines **433–459**; `spring-data-neo4j.adoc`
  is line **442**, `caching.adoc` is line **443**. Entries are `**** xref:backend/springboot/<file>[Label]`.
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — the shared `[IMPORTANT]` admonition included at the
  top of every section page; mentions Spring Boot 4.1.x / Spring Framework 7.0.x and that local books are
  bibliography-only. No change needed.
- **Build / verification:** `npx antora antora-playbook.yml` (local content only) must complete with **no
  `xref`/AsciiDoc errors**; `build/` is gitignored. The `iru-build-docs` skill wraps this; the `iru-gate-runner`
  agent is installed (`.claude/agents/iru-gate-runner.md`).
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly.

## Implementation steps

### Group 1 — Author the four concept pages (Parallelizable: yes — four independent new files, no shared file)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/spring-batch.adoc`** — new page created (~210 lines); primary figure is a `[mermaid]` `flowchart TB` of Job -> Step -> chunk loop with the commit-interval/transaction boundary marked; docs-only, no tests/coverage/static-analysis applicable (Antora build verified as a separate group).
  - [x] Task 1.1. Header: `= Spring Batch`; `:description:` (finite batch processing on Spring Boot — jobs,
        steps, chunk vs. tasklet, the job repository, auto-configuration, launching jobs); `:keywords:`
        (`Spring Batch, Job, Step, Tasklet, chunk-oriented processing, ItemReader, ItemProcessor, ItemWriter,
        JobRepository, JobLauncher, JobExecution, StepExecution, JobParameters, ExecutionContext, commit
        interval, restartability, spring-boot-starter-batch, @EnableBatchProcessing, JobBuilder, StepBuilder`);
        then `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. `== What batch processing is` — finite, bounded bulk work (imports/exports, ETL, statement
        generation, reconciliation); contrast with request/response and with streaming; a one-line note that a
        dedicated deep-dive guide will follow.
  - [x] Task 1.3. `== Jobs, steps, and chunks` — `Job` = an ordered sequence of `Step`s; a step is either a
        **chunk-oriented** step (`ItemReader` → `ItemProcessor` → `ItemWriter`, processed in fixed-size chunks
        where the chunk boundary **is** the transaction/commit boundary) or a **`Tasklet`** (a single unit of
        work). Include the `[mermaid]` flowchart from choice 6.
  - [x] Task 1.4. `== Job metadata and restartability` — `JobInstance` vs. `JobExecution` vs. `StepExecution`;
        `JobParameters` identify an instance; `ExecutionContext` carries restart state; the `JobRepository`
        persists all of it to its metadata tables so a failed job can restart where it stopped. Note skip/retry
        and listeners exist (name only, link to the reference).
  - [x] Task 1.5. `== Spring Boot integration` — add `spring-boot-starter-batch`; Boot auto-configures a
        JDBC `JobRepository` + `JobLauncher` against the application `DataSource`;
        `spring.batch.jdbc.initialize-schema=always|embedded|never`; **`@EnableBatchProcessing` is discouraged
        with Boot — it turns the auto-configuration off**; run a job on startup with `spring.batch.job.name`, or
        on demand from a `CommandLineRunner`/`@RestController` via `JobLauncher`; test with `@SpringBatchTest`.
        One `[source,java]` minimal chunk job built with `new JobBuilder("importJob", jobRepository)` /
        `new StepBuilder("importStep", jobRepository).<Input, Output>chunk(100, txManager)` reading a CSV with
        `FlatFileItemReader` and writing with `JdbcBatchItemWriter`, plus a short `application.yml`.
  - [x] Task 1.6. `== Scaling (in brief)` — one short paragraph naming multi-threaded step, parallel steps,
        partitioning, remote chunking; defer detail to the future guide and the reference.
  - [x] Task 1.7. `== References` — official only: `https://docs.spring.io/spring-batch/reference/`,
        `https://docs.spring.io/spring-batch/reference/whatsnew.html`,
        `https://docs.spring.io/spring-boot/reference/io/spring-batch.html`. Confirm these match the bibliography
        entries in `index.adoc`.

- [x] **Task 2. Create `modules/ROOT/pages/backend/springboot/hibernate.adoc`** — new page created (~245 lines); primary figure is a `[mermaid]` `stateDiagram-v2` of the entity lifecycle with persist/find/merge/detach/remove/close transitions; cross-links to `spring-data-jpa.adoc`, `spring-data-overview.adoc`, `caching.adoc`, `elasticsearch.adoc`, and `database/schema-evolution/index.adoc` (target verified — title "Evolving the Database Model"); docs-only.
  - [x] Task 2.1. Header: `= Hibernate (JPA & ORM)`; `:description:` (Hibernate as the reference JPA provider —
        the paradigm mismatch, persistence context and entity lifecycle, lazy loading and N+1, caching, query
        options, and how Spring Boot wires it in); `:keywords:` (`Hibernate ORM, JPA, Jakarta Persistence,
        object relational mapping, paradigm mismatch, EntityManager, SessionFactory, persistence context, entity
        lifecycle, transient, managed, detached, removed, lazy loading, N+1, first-level cache, second-level
        cache, dirty checking, flush, HQL, JPQL, Criteria API, hbm2ddl, spring-boot-starter-data-jpa,
        HibernateJpaVendorAdapter, open-in-view`); then the disclaimer include.
  - [x] Task 2.2. `== The object/relational paradigm mismatch` — granularity, subtypes/inheritance, identity
        (DB primary key vs. Java `==` vs. `equals`), associations (directionality, FK vs. object reference),
        data navigation (graph walking vs. joins). Frame Hibernate/JPA as the mapping layer that bridges it.
        Note a dedicated deep-dive guide will follow.
  - [x] Task 2.3. `== Core runtime model` — `EntityManagerFactory` (JPA) / `SessionFactory` (native) as the
        thread-safe, expensive-to-build bootstrap object; `EntityManager` / `Session` as the short-lived,
        per-unit-of-work handle; the **persistence context** as the first-level cache and identity map.
  - [x] Task 2.4. `== Entity lifecycle` — transient → managed (persistent) → detached → removed, and the
        `persist` / `find` / `merge` / `detach` / `remove` / transaction-commit transitions; **dirty checking**
        and automatic `flush` at commit / before a query. Include the `[mermaid]` `stateDiagram-v2` from choice 6.
  - [x] Task 2.5. `== Mapping essentials` — `@Entity`, `@Id` + `@GeneratedValue`, `@Embeddable`/`@Embedded`,
        `@OneToMany`/`@ManyToOne`/`@ManyToMany` with `mappedBy` and `fetch`, inheritance strategies
        (`SINGLE_TABLE` / `JOINED` / `TABLE_PER_CLASS`) named with one line each. Keep it a tour — point at
        `xref:backend/springboot/spring-data-jpa.adoc` for the worked mapping examples already there.
  - [x] Task 2.6. `== Fetching, caching, and the N+1 problem` — lazy vs. eager; how naive lazy access across a
        collection triggers N+1 and the usual fixes (`join fetch`, entity graphs, batch size); first-level cache
        (always on, = persistence context) vs. optional second-level cache (link
        `xref:backend/springboot/caching.adoc`).
  - [x] Task 2.7. `== Querying options (conceptual)` — JPQL/HQL vs. Criteria API vs. native SQL: what each is
        for, in two or three sentences each; defer syntax to `spring-data-jpa.adoc` and the Hibernate User Guide.
  - [x] Task 2.8. `== Schema generation vs. migrations` — `spring.jpa.hibernate.ddl-auto` (`none`/`validate`/
        `update`/`create-drop`) is for dev only; real schema change belongs to a migration tool — link
        `xref:database/schema-evolution/index.adoc[Evolving the Database Model]`.
  - [x] Task 2.9. `== Spring Boot integration` — `spring-boot-starter-data-jpa` bundles Hibernate as the
        default provider; `spring.datasource.*` + `spring.jpa.*` (`show-sql`, `properties.hibernate.*`);
        `HibernateJpaVendorAdapter`; the `spring.jpa.open-in-view` default is `true` and why to set it `false`;
        when to inject a raw `EntityManager` vs. use a Spring Data repository. One `[source,java]` `@Entity` +
        a small `@Repository` using `EntityManager`, plus an `application.yml` snippet. One paragraph pointing at
        Hibernate Search for full-text indexing of entities.
  - [x] Task 2.10. `== References` — official only:
        `https://hibernate.org/orm/documentation/`,
        `https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html`,
        `https://jakarta.ee/specifications/persistence/`,
        `https://docs.spring.io/spring-boot/reference/data/sql.html`,
        `https://docs.jboss.org/hibernate/search/`. Confirm alignment with `index.adoc` bibliography.

- [x] **Task 3. Create `modules/ROOT/pages/backend/springboot/elasticsearch.adoc`** — new page created (~180 lines) plus hand-authored SVG `modules/ROOT/images/springboot-elasticsearch-shards.svg` (3-node cluster, index of 3 primary shards + 1 replica each, primaries and replicas never colocated; viewBox 900x380, plain shapes/text, no external refs, matches existing `springboot-*.svg` visual weight); cross-links `database/choosing-the-right-database.adoc` and `unit-and-integration-testing.adoc` (both verified present); docs-only.
  - [x] Task 3.1. Header: `= Elasticsearch`; `:description:` (full-text search with Elasticsearch — the inverted
        index, documents and shards, analyzers and mappings, the query DSL and relevance, and Spring Boot +
        Spring Data Elasticsearch integration); `:keywords:` (`Elasticsearch, inverted index, full-text search,
        document, index, shard, replica, node, cluster, analyzer, tokenizer, token filter, mapping, text,
        keyword, query DSL, match query, term query, bool query, BM25, relevance, aggregations, near real-time,
        spring-boot-starter-data-elasticsearch, Elasticsearch Java API Client, @Document, ElasticsearchRepository,
        ElasticsearchOperations`); disclaimer include.
  - [x] Task 3.2. `== Why a search engine` — inverted index vs. SQL `LIKE`/row scan; relevance ranking, typo
        tolerance, faceting; when to run Elasticsearch **alongside** a system of record rather than as the
        primary store (one line on dual-write vs. CDC). Cross-link
        `xref:database/choosing-the-right-database.adoc` if it helps. Note a deep-dive guide will follow.
  - [x] Task 3.3. `== Documents, indices, shards` — JSON documents; an index as a collection of documents; an
        index is split into **primary shards** (fixed at creation) each with zero or more **replica shards**;
        shards are distributed across **nodes** in a **cluster**. Include the SVG
        `springboot-elasticsearch-shards.svg` (Task 3.7) with descriptive alt text.
  - [x] Task 3.4. `== Analysis and mappings` — an analyzer = character filters → tokenizer → token filters;
        text is analyzed at index time and query time; `text` (analyzed, full-text) vs. `keyword` (exact,
        aggregations/sorting); a mapping declares fields and types (dynamic mapping vs. explicit).
  - [x] Task 3.5. `== Querying and relevance` — the query DSL: leaf queries (`match`, `term`, `range`) and
        compound (`bool` with `must`/`should`/`filter`/`must_not`); relevance scoring (BM25) for `match` vs.
        filter context (no scoring, cacheable); one sentence each on aggregations and near-real-time refresh.
  - [x] Task 3.6. `== Spring Boot integration` — add `spring-boot-starter-data-elasticsearch`; Boot
        auto-configures the **Elasticsearch Java API Client** from `spring.elasticsearch.uris` /
        `username`/`password` / SSL; map a POJO with `@Document(indexName = "...")`, `@Id`, `@Field(type = ...)`;
        derive queries with an `ElasticsearchRepository<T, ID>`; run a DSL query with `ElasticsearchOperations` +
        `NativeQuery`; integration-test with the Testcontainers `elasticsearch` module (link
        `xref:backend/springboot/unit-and-integration-testing.adoc`). One `[source,java]` (`@Document` POJO +
        repository + one `NativeQuery` search) and an `application.yml`.
  - [x] Task 3.7. Create `modules/ROOT/images/springboot-elasticsearch-shards.svg` — a 3-node cluster with an
        index of (e.g.) 3 primary shards + 1 replica each, showing primaries and replicas never colocated;
        plain shapes + text, no external refs, `viewBox`, readable at `width=700`. Match the visual weight of
        the existing `springboot-*.svg` files.
  - [x] Task 3.8. `== References` — official only:
        `https://docs.spring.io/spring-data/elasticsearch/reference/`,
        `https://www.elastic.co/guide/en/elasticsearch/client/java-api-client/current/index.html`,
        `https://www.elastic.co/docs`. Confirm alignment with `index.adoc` bibliography.

- [x] **Task 4. Create `modules/ROOT/pages/backend/springboot/solr.adoc`** — new page created (~185 lines) plus hand-authored SVG `modules/ROOT/images/springboot-solrcloud-topology.svg` (3-node ZooKeeper ensemble above 3 Solr nodes hosting a 2-shard collection, each shard one leader + one replica core on different nodes; viewBox 900x430, plain shapes/text, matches existing `springboot-*.svg` visual weight); states Spring Data Solr retirement up front, closes with a "Solr vs. Elasticsearch" paragraph; docs-only.
  - [x] Task 4.1. Header: `= Apache Solr`; `:description:` (Apache Solr as a Lucene-based search server — cores
        and collections, schema and analysis, request handlers and query parsers, SolrCloud, and Spring Boot
        integration via SolrJ now that Spring Data Solr is retired); `:keywords:` (`Apache Solr, Lucene, SolrJ,
        core, collection, schema.xml, managed schema, field type, analysis chain, copyField, request handler,
        query parser, DisMax, eDisMax, filter query, fq, filter cache, faceting, highlighting, spellcheck,
        SolrCloud, ZooKeeper, shard, replica, leader, soft commit, Http2SolrClient, CloudSolrClient,
        SolrInputDocument, SolrQuery, Spring Data Solr retired`); disclaimer include.
  - [x] Task 4.2. `== Solr in one paragraph` — a search **server** wrapping Lucene, exposed over HTTP/JSON;
        contrast briefly with Elasticsearch (both Lucene-based) and link `xref:backend/springboot/elasticsearch.adoc`.
        Note a deep-dive guide will follow.
  - [x] Task 4.3. `== Cores, collections, and schema` — a core = one Lucene index + config; a **collection** =
        a sharded/replicated core in SolrCloud; `schema.xml` / managed schema defines field types and their
        **analysis chain**; `copyField` fans one input into several indexed forms.
  - [x] Task 4.4. `== Querying` — request handlers and `/select`; query parsers (standard, DisMax, eDisMax);
        **filter queries** (`fq`) and the filter cache; one line each on faceting, highlighting, and
        spellcheck/suggest.
  - [x] Task 4.5. `== SolrCloud` — ZooKeeper holds cluster state and config; a collection is split into
        **shards**, each shard has a **leader** and **replicas**; near-real-time via soft commits vs. durable
        hard commits. Include the SVG `springboot-solrcloud-topology.svg` (Task 4.7).
  - [x] Task 4.6. `== Spring Boot integration` — **state up front: Spring Data Solr is discontinued (moved to
        the Spring Attic) and is not compatible with Spring Boot 3+/4**; link
        `https://spring.io/blog/2020/04/07/spring-data-for-apache-solr-discontinued/`. Current approach: add
        `org.apache.solr:solr-solrj`; Boot has **no** Solr auto-configuration, so declare a `SolrClient` `@Bean`
        — `Http2SolrClient` for a single node, `CloudSolrClient` for SolrCloud — with the base URL bound from an
        `@ConfigurationProperties` record; index with `SolrInputDocument`, query with `SolrQuery`;
        integration-test with the Testcontainers `SolrContainer`. One `[source,java]` (`@Bean` + a small
        index/query `@Service` + the properties record) and an `application.yml`. Close with a short
        "Solr vs. Elasticsearch — how to choose" paragraph.
  - [x] Task 4.7. Create `modules/ROOT/images/springboot-solrcloud-topology.svg` — a ZooKeeper ensemble (3
        nodes) above a collection of 2 shards spread over 3 Solr nodes, each shard showing one leader + one
        replica core; plain shapes + text, `viewBox`, readable at `width=700`.
  - [x] Task 4.8. `== References` — official only: `https://solr.apache.org/guide/`,
        `https://solr.apache.org/docs/` (SolrJ API),
        `https://spring.io/blog/2020/04/07/spring-data-for-apache-solr-discontinued/`. Confirm alignment with
        `index.adoc` bibliography.

### Group 2 — Wire the pages into navigation and the landing page (Parallelizable: yes — `nav.adoc` and `index.adoc` are different files; both require Group 1 complete so `xref`s resolve)

- [x] **Task 5. Add four nav entries in `modules/ROOT/nav.adoc`** — inserted the four `****` entries after the
      Spring Data Neo4j line; grep confirms a single `backend/springboot` nav block. Docs-only, no tests/coverage/static-analysis.
  - [x] Task 5.1. Immediately after the `**** xref:backend/springboot/spring-data-neo4j.adoc[Spring Data Neo4j]`
        line (currently line 442), insert, at the same `****` depth and in this order:
        ```
        **** xref:backend/springboot/hibernate.adoc[Hibernate (JPA & ORM)]
        **** xref:backend/springboot/elasticsearch.adoc[Elasticsearch]
        **** xref:backend/springboot/solr.adoc[Apache Solr]
        **** xref:backend/springboot/spring-batch.adoc[Spring Batch]
        ```
        Inserted at lines 443–446 of `nav.adoc` (between the Neo4j line 442 and the Caching line, now 447).
  - [x] Task 5.2. Confirm no other nav block (e.g. a duplicate earlier `springboot` list) needs the same edit —
        `grep -n "backend/springboot" modules/ROOT/nav.adoc` and verify only the one block exists.
        Verified: `grep -n "backend/springboot" modules/ROOT/nav.adoc` returns exactly one contiguous block
        (lines 433–463 after the edit); no duplicate earlier `springboot` list exists.

- [x] **Task 6. Update `modules/ROOT/pages/backend/springboot/index.adoc`** — added `=== ORM, search & batch`
      subsection, extended `:description:`/`:keywords:`, and cross-checked the pre-existing `== Bibliography`.
      Docs-only, no tests/coverage/static-analysis.
  - [x] Task 6.1. In `== What's covered`, add a new `=== ORM, search & batch` subsection after the
        `=== Spring Data` group, with four bullets mirroring the house style (one-line "what it covers" each):
        Hibernate (JPA & ORM), Elasticsearch, Apache Solr, Spring Batch — each an
        `xref:backend/springboot/<file>[Label]`. Added the `=== ORM, search & batch` heading plus four bullets
        immediately after the Spring Data Neo4j bullet and before `=== Caching`.
  - [x] Task 6.2. Extend the page's `:description:` (line 2) and `:keywords:` (line 3) to name the four new
        topics (Hibernate/JPA ORM, Elasticsearch, Apache Solr/SolrJ, Spring Batch). Appended the new terms to
        both attribute lines, keeping existing content and style.
  - [x] Task 6.3. **Verify** (no edit expected) that the `== Bibliography` section already added on this branch
        contains: the Spring Batch reference + Spring Boot Batch page; Hibernate ORM docs + Jakarta Persistence +
        Spring Boot JPA; Hibernate Search; Spring Data Elasticsearch + Elasticsearch Java API Client +
        Elasticsearch docs; Apache Solr Reference Guide + SolrJ + the Spring Data Solr discontinuation note; and
        the six books (Minella rewritten to active). Cross-check that every URL used in a new page's
        `== References` also appears here; add only a genuinely missing URL, matching the existing bullet style.
        VERIFIED: all required bibliography entries and the six books (Minella in active voice) are present. URL
        cross-check: 12 of 14 `== References` URLs appear verbatim in the bibliography; `spring-boot/reference/data/sql.html`
        appears with a `#…` fragment (same page). Two deep-links are NOT present verbatim —
        `docs.spring.io/spring-batch/reference/whatsnew.html` and
        `docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html` — but their parent
        pages (`spring-batch/reference/` and `hibernate.org/orm/documentation/` "(User Guide + Javadoc)") are in
        the bibliography with descriptive coverage. Per the run's guardrail forbidding further edits to the
        pre-existing `== Bibliography`, NO change was made; flagged for caller review.

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1–2 complete)

- [x] **Task 7. Verify the Antora build is clean** — `npx antora antora-playbook.yml` (via `iru-build-docs` / `iru-gate-runner`) completed exit 0 with zero xref/AsciiDoc warnings or errors (a `--log-level=warn` re-run produced no output); all four new pages and both new SVGs render under `build/site/`.
  - [x] Task 7.1. Delegate to the `iru-gate-runner` agent:
        `Agent({description: "Build Antora docs and report warnings", subagent_type: "iru-gate-runner",
        prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repo's Antora site. Report only:
        whether the build completed, and any xref/AsciiDoc warnings or errors (file + message), especially any
        referencing backend/springboot/{spring-batch,hibernate,elasticsearch,solr}.adoc or the two new SVGs."})`.
        — Done: build completed, no warnings/errors.
  - [x] Task 7.2. If the sub-agent reports any unresolved `xref`, missing image, or AsciiDoc error, fix it in
        the offending page/nav/index file and re-run Task 7.1. Done only when the build is warning-free and the
        four new pages plus both SVGs render under `build/site/`.
        — No fixes needed; build was clean on the first run.
  - [x] Task 7.3. Sanity-check each new page is ~150–300 lines and every `== References` link is an official
        source (no book/blog links except the Spring Data Solr discontinuation post).
        — Line counts: spring-batch 214, hibernate 265, elasticsearch 171, solr 163 (all in range). All `== References`
        links are official docs except the one allowed Spring Data Solr discontinuation blog post in `solr.adoc`.
