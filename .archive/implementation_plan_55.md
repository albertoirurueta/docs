# Implementation Plan: Backend Development / SpringBoot Reference

## Task summary

Source: GitHub issue #55

Issue [#55](https://github.com/albertoirurueta/docs/issues/55) ("Add \"SpringBoot Reference\" documentation
section under Guides & References / Backend Development") asks for two things this repo has never had before:

1. A brand-new **top-level "Backend Development" guide** under *Guides & References* — a third sibling of
   `database/` and `web/`, currently the only two top-level guides in `modules/ROOT/nav.adoc` and
   `modules/ROOT/pages/index.adoc`'s `== Guides & References` list.
2. Inside it, a single large **"SpringBoot Reference"** subsection at `modules/ROOT/pages/backend/springboot/`,
   following the exact per-technology pattern already used by `web/aspnet/`, `web/python/`, etc.: a landing page,
   24 concept pages, and a one-page downloadable PDF cheat sheet — documenting Spring Boot **4.1.x** / Spring
   Framework **6.2.x** on the Java 17/21+ baseline, verified against `docs.spring.io` and each sub-project's own
   doc site, with nine local PDF books (`~/Desktop/book1.pdf`–`book9.pdf`) demoted to bibliography-only (book3,
   *Spring Batch*, is explicitly out of scope per the issue and not used).

The issue's own "Proposed page structure" and "Bibliography" sections are exhaustive and are treated as the
source of truth for content/links below — this plan does not restate every sentence of them, it sequences them
into buildable tasks and adds the concrete file paths, diagram choices, and cross-link targets an implementer
needs.

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's pattern — stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** This repo has no application source code — every task below is
   AsciiDoc/SVG/PDF authoring. None of the installed `*-code-one-task` skills (`java`, `dotnet`, `database`)
   apply, so no task carries a language/framework tag, matching every prior documentation plan in `.archive/`
   (e.g. `implementation_plan_53.md` for Python Reference).
2. **Closest precedent: `.archive/implementation_plan_53.md`** (issue #53, "Python Reference" — read in full).
   Same shape: an `[IMPORTANT]` disclaimer partial demoting local books to bibliography-only, one task per
   concept page with book/official-doc sourcing noted inline, mermaid diagrams and hand-authored SVGs only where
   they clarify a concept (not pre-planned per page), a headless-Chrome-rendered single-page PDF cheat sheet, and
   a final sequential group for the section index, nav/landing wiring, and a delegated build-verification task.
   The one structural difference: issue #53 added a sibling *under an existing* landing page (`web/index.adoc`).
   Issue #55 needs a **new top-level landing page** (`backend/index.adoc`) one level above the `springboot/`
   subsection's own `index.adoc` — this plan adds a distinct task for that new landing page (Task 28) rather than
   folding it into the subsection index (Task 27).
3. **Page breakdown: 24 content pages + 1 cheat sheet + 1 subsection index + 1 new top-level landing page (27
   `.adoc` files total).** Issue #55's page list is followed as-is, in the order the issue lists them (Getting
   started → Core concepts → Spring Data → Caching → APIs → Server-side web UI frameworks → Messaging →
   Scheduling → Observability → Reactive programming → Developer productivity tools → Testing → API-first
   development → Build & quality → Architecture → Reference). No page is merged or split beyond what the issue
   specifies.
4. **All nine local books stay bibliography-only**, per the issue's explicit instruction — no disclaimer or
   per-page admonition may say or imply a book is the primary/main source. `book3.pdf` (*Spring Batch*) is not
   cited anywhere, since Spring Batch is out of scope.
5. **Placed last**: `Backend Development` becomes the **third** top-level `Guides & References` entry, after the
   existing `Database Development` and `Web Development` (both end their respective blocks before it in
   `nav.adoc` and `pages/index.adoc`, per the same "append in the order added" convention every prior subsection
   followed — confirmed `nav.adoc` currently ends at `web/python/cheat-sheet.adoc` (line 396) and
   `pages/index.adoc`'s Guides & References list ends at the Python Reference bullet (line ~138) right before
   `== About me` (line 140)).
6. **Cross-links, not duplication**: `spring-data-mongodb.adoc` and `spring-data-couchbase.adoc` link to the
   existing `xref:database/mongodb/index.adoc[MongoDB Reference]` / `xref:database/couchbase/index.adoc[Couchbase
   Reference]` for database-side concepts; `web-ui-frameworks.adoc` links to the existing
   `xref:web/vaadin/index.adoc[Vaadin Reference]` and its own `xref:web/vaadin/spring-boot-integration.adoc[Spring
   Boot Integration]` page instead of re-explaining Vaadin.
7. **Diagrams — mermaid by default, two hand-authored SVGs for genuinely spatial layouts** (matching the "SVG
   only when spatial, mermaid otherwise" convention from `implementation_plan_53.md`):
   - `springboot-hexagonal-architecture.svg` (architectural-patterns.adoc) — the hexagon itself, domain at the
     center, ports as hexagon edges, adapters plugged in from outside (a spatial layout a flowchart can't express
     well).
   - `springboot-data-access-layers.svg` (spring-data-overview.adoc) — a layered box diagram: application code →
     `Repository` interface (query derivation / `@Query`) → the store's low-level Template/Client → the native
     driver, showing where each of the four custom-query subsections (Task 6.5, 7.5, 8.4, 9.4) plugs in.
   - Mermaid flowcharts/sequence diagrams elsewhere: auto-configuration condition evaluation (core-concepts.adoc),
     a Kafka producer/consumer message flow (messaging-kafka.adoc), the ShedLock multi-instance race
     (scheduling-and-shedlock.adoc), a distributed trace span propagating across two services
     (metrics-and-observability.adoc), the outbox pattern's dual-write-avoidance sequence and a saga
     orchestration-vs-choreography comparison (architectural-patterns.adoc), and a contract-first
     spec-to-codegen-to-implementation flow (api-first-rest-and-grpc.adoc). The implementer may add further small
     `springboot-*.svg` figures or extra mermaid blocks while writing a page if one adds real value — not
     pre-planned as separate tasks.
8. **PDF generation approach**: identical to every prior section — a hand-built, print-ready single-page HTML/CSS
   layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
   static checked-in asset at `modules/ROOT/attachments/springboot-cheat-sheet.pdf`, linked via
   `xref:attachment$springboot-cheat-sheet.pdf[Download the SpringBoot Cheat Sheet (PDF)]`. Must be **exactly one
   A4 page** (page-count check + a rendered preview with no clipping).
9. **No project-picker icon/xref** for Backend Development or SpringBoot Reference — like Database/Web
   Development, it lives only under `pages/index.adoc`'s `== Guides & References` list, not as a
   remote-component picker tile.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) (396 lines, currently
  ending at the Python Reference cheat sheet entry), with pages under `modules/ROOT/pages/`. The only
  verification is a clean `npx antora antora-playbook.yml` build (no lint/test suite).
- **`Guides & References`** currently has exactly two top-level entries, both in `nav.adoc` (`** xref:...`) and in
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` list (`* xref:...`):
  `Database Development` ([modules/ROOT/pages/database/index.adoc](modules/ROOT/pages/database/index.adoc)) and
  `Web Development` ([modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc)). This plan adds a
  third: `Backend Development`.
- Every existing subsection (`web/aspnet/`, `web/python/`, `database/mongodb/`, etc.) follows one structural
  pattern this plan reuses exactly:
  - `modules/ROOT/partials/<name>-disclaimer.adoc` — an `[IMPORTANT]` / `====` admonition, included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. See
    [modules/ROOT/partials/aspnet-disclaimer.adoc](modules/ROOT/partials/aspnet-disclaimer.adoc) for the exact
    "official docs are the reference; books are bibliography, consulted but not primary; on conflict official
    docs win" tone to copy — issue #55's Context section already specifies the exact wording requirements.
  - One `.adoc` page per concept, each with its own `:description:`/`:keywords:`, the disclaimer include, then a
    lead paragraph. Body uses `[source,java]` / `[source,yaml]` / `[source,bash]` / `[source,console]` /
    `[source,text]` fenced by `----`, `[mermaid]` blocks for diagrams, `image::<name>.svg[alt,width=…,
    role=text-center]` for figures.
  - A section `index.adoc`: disclaimer, short intro, grouped `== What's covered` `xref:`-linking every page, then
    `== Bibliography`. See
    [modules/ROOT/pages/web/aspnet/index.adoc](modules/ROOT/pages/web/aspnet/index.adoc).
  - A `cheat-sheet.adoc`: disclaimer, grouped `xref:` links back to every page, then
    `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`; the PDF itself lives under
    `modules/ROOT/attachments/` (existing: `aspnet-`, `python-`, `vue-`, `mongodb-`, `couchbase-`, `sql-`, etc.).
    No HTML source for these PDFs is kept in the repo, only the rendered PDF.
  - `nav.adoc` nests `*** xref:<parent>/<subsection>/index.adoc[...]` under the parent's `** xref:<parent>/
    index.adoc[...]`, with a `****` line per detail page in reading order.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used besides hand
  authored SVGs), `@djencks/asciidoctor-mathjax` (unused). No `source-highlighter` set; existing pages use
  `[source,java]`/`[source,yaml]`/etc. fine (cosmetic class only). `modules/ROOT/images/` holds existing
  hand-authored `*.svg` figures; `modules/ROOT/attachments/` holds the cheat-sheet PDFs.
- **AsciiDoc gotcha** (carried over from every prior section): inline `{foo}` text *outside* `[source]` blocks is
  parsed as an Antora attribute reference and emits a "skipping reference to missing attribute" build **warning**.
  Spring Boot content is full of this risk — YAML property placeholders (`${some.property}`), SpEL expressions in
  `@Cacheable(key = "#id")`/`@Value("${x}")`, and prose mentioning generic type literals with braces. **Escape any
  literal `{ }` braces in prose outside `[source]` blocks as `\{ … }`.** Inside `[source,…]` blocks no escaping is
  needed. The final build task must come back with **zero** such warnings.
- **Existing pages this plan cross-links rather than duplicates**:
  [modules/ROOT/pages/database/mongodb/index.adoc](modules/ROOT/pages/database/mongodb/index.adoc),
  [modules/ROOT/pages/database/couchbase/index.adoc](modules/ROOT/pages/database/couchbase/index.adoc), and
  [modules/ROOT/pages/web/vaadin/index.adoc](modules/ROOT/pages/web/vaadin/index.adoc) /
  [modules/ROOT/pages/web/vaadin/spring-boot-integration.adoc](modules/ROOT/pages/web/vaadin/spring-boot-integration.adoc).
- **New file map** this plan creates:
  - `modules/ROOT/pages/backend/index.adoc` (new top-level landing page)
  - `modules/ROOT/pages/backend/springboot/` (26 files): `index.adoc`, `getting-started.adoc`,
    `core-concepts.adoc`, `configuration-and-profiles.adoc`, `spring-data-overview.adoc`, `spring-data-jpa.adoc`,
    `spring-data-mongodb.adoc`, `spring-data-couchbase.adoc`, `spring-data-neo4j.adoc`, `caching.adoc`,
    `rest-apis.adoc`, `grpc-apis.adoc`, `web-ui-frameworks.adoc`, `messaging-kafka.adoc`,
    `scheduling-and-shedlock.adoc`, `logging.adoc`, `metrics-and-observability.adoc`, `reactive-programming.adoc`,
    `lombok-and-mapstruct.adoc`, `unit-and-integration-testing.adoc`, `performance-testing-jmeter.adoc`,
    `api-first-rest-and-grpc.adoc`, `api-first-messaging.adoc`, `maven-quality-plugins.adoc`,
    `architectural-patterns.adoc`, `cheat-sheet.adoc`
  - `modules/ROOT/partials/springboot-disclaimer.adoc`
  - `modules/ROOT/images/springboot-hexagonal-architecture.svg`, `springboot-data-access-layers.svg` (hand-authored)
  - `modules/ROOT/attachments/springboot-cheat-sheet.pdf`
  - Edits to `modules/ROOT/nav.adoc` (append new `**` block) and `modules/ROOT/pages/index.adoc` (insert new `*`
    bullet before `== About me`)

## Conventions every content page in this plan must follow

- Standard header: `= <Title>`, `:description:` (one sentence), `:keywords:` (comma list), blank line,
  `include::partial$springboot-disclaimer.adoc[]`, blank line, one/two-sentence lead paragraph.
- **Every concept gets at least one runnable code example** — `[source,java]` for Java/Spring code,
  `[source,yaml]` for `application.yml`, `[source,xml]` for Maven `pom.xml` snippets, `[source,bash]` for CLI
  commands, `[source,console]` for command output, `[source,text]` for plain-text layouts (directory trees).
- **Every concept links to the specific official documentation page for it** — the exact URLs are listed per page
  in issue #55's "Proposed page structure" and "Bibliography" sections; use those, not a generic "see the Spring
  docs."
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Diagrams via `[mermaid]` blocks; figures via `image::springboot-*.svg[alt,width=…,role=text-center]`.
- Each `spring-data-*.adoc` page's custom-query subsection (JdbcClient/JdbcTemplate, MongoTemplate,
  CouchbaseTemplate, Neo4jClient) is a first-class subsection with its own heading and runnable example — not a
  passing mention.
- The full per-page concept checklist and official-link list is in issue #55's "Proposed page structure" section
  — each task below references its issue page and expands it into concrete sub-tasks.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the SpringBoot disclaimer partial — `modules/ROOT/partials/springboot-disclaimer.adoc`
  - [x] Task 1.1. Write it as an `[IMPORTANT]` / `====` admonition, shaped like
    `modules/ROOT/partials/aspnet-disclaimer.adoc`. It must state: this section documents **Spring Boot 4.1.x /
    Spring Framework 6.2.x** on the Java 17/21+ baseline, as described by
    https://docs.spring.io/spring-boot/reference/index.html[the official Spring Boot reference documentation] and
    each sub-project's own site (Spring Data, Spring for Apache Kafka, Micrometer, Project Reactor,
    springdoc-openapi, etc. — see the section's Bibliography) — **which are the references these pages are
    written and verified against**; the content was generated with AI assistance and should be verified against
    those official docs before production use; the nine local books
    (`book1.pdf`–`book2.pdf`, `book4.pdf`–`book9.pdf`) are **listed in this section's bibliography and were
    consulted while preparing these pages**, worded so it does **not** imply any book is the primary/main
    reference, and most predate Spring Boot 3/4 (several target Boot 1.x/2.0 or Spring 4/5), so on any
    discrepancy the official documentation wins.
  - [x] Task 1.2. Confirm the exact opening shape to reuse verbatim in every Group 2–4 page: `= <Title>` /
    `:description:` / `:keywords:` / blank line / `include::partial$springboot-disclaimer.adoc[]` / blank line /
    body — identical placement to `include::partial$aspnet-disclaimer.adoc[]` in
    `modules/ROOT/pages/web/aspnet/index.adoc`.
  - Note: created `modules/ROOT/partials/springboot-disclaimer.adoc`, modeled on `aspnet-disclaimer.adoc`; books
    framed as bibliography-only, official docs.spring.io as primary source.

### Group 2 — Content pages

**Parallelizable: yes** — 24 independent tasks (Tasks 2–25). Each includes the Group 1 disclaimer partial and may
cross-reference other new pages in this plan, but none depends on another new page's finished content (targets
are validated together in the final build task).

- [x] Task 2. Create `modules/ROOT/pages/backend/springboot/getting-started.adoc` (issue #55 page 1)
  - Note: 312 lines; covers Spring/Boot overview, Initializr, Java/Maven baseline, migration notes; fixed a
    broken xref to a nonexistent `reactive-webflux.adoc` slug (now points to `reactive-programming.adoc`).
  - [x] Task 2.1. What Spring and Spring Boot are and how they relate (the Framework vs. the opinionated
    auto-configured runtime); https://spring.io/[spring.io] and
    https://start.spring.io/[Spring Initializr]. `[source,bash]` (a `curl` against the Initializr API) +
    `[source,console]`.
  - [x] Task 2.2. The Java 17/21+ baseline, Maven project layout (`pom.xml`, `src/main/java`,
    `src/main/resources/application.yml`), `@SpringBootApplication`, running via `mvn spring-boot:run` / the
    executable jar. `[source,xml]` + `[source,java]` + `[source,bash]`.
  - [x] Task 2.3. Spring Boot 2 → 3 → 4 migration notes: the `jakarta.*` namespace switch (Boot 3), starter
    renames in Boot 4 (e.g. `spring-boot-starter-web` → `spring-boot-starter-webmvc`) — framed as "what changed
    since the older local books" without naming any book as wrong. `[source,xml]`.
  - [x] Task 2.4. Links: https://docs.spring.io/spring-boot/reference/index.html,
    https://docs.spring.io/spring-boot/reference/using/index.html,
    https://docs.spring.io/spring-boot/reference/getting-started/index.html.

- [x] Task 3. Create `modules/ROOT/pages/backend/springboot/core-concepts.adoc` (issue #55 page 2)
  - Note: 312 lines; IoC/beans/DI, component scanning/scopes/lifecycle, AOP note, auto-config mermaid flowchart.
  - [x] Task 3.1. The IoC container and beans: `@Component`/`@Service`/`@Repository`, dependency injection
    (constructor injection as the recommended default vs. field/setter injection). `[source,java]`.
  - [x] Task 3.2. Component scanning, `@Configuration`/`@Bean`, bean scopes (singleton/prototype/request/session)
    and lifecycle callbacks (`@PostConstruct`/`@PreDestroy`, `InitializingBean`). `[source,java]`.
  - [x] Task 3.3. A short AOP note: `@Aspect`/`@Around` and how Spring Boot uses proxies internally for
    `@Transactional`/`@Cacheable`, so later pages' annotations aren't a black box. `[source,java]`.
  - [x] Task 3.4. A `[mermaid]` flowchart of auto-configuration: `@SpringBootApplication` → component scan +
    `@EnableAutoConfiguration` → candidate auto-configuration classes → `@Conditional*` evaluation (classpath
    presence, existing beans, properties) → beans registered.
  - [x] Task 3.5. Links: https://docs.spring.io/spring-framework/reference/core/beans.html,
    https://docs.spring.io/spring-framework/reference/core/aop.html,
    https://docs.spring.io/spring-boot/reference/using/auto-configuration.html.

- [x] Task 4. Create `modules/ROOT/pages/backend/springboot/configuration-and-profiles.adoc` (issue #55 page 3)
  - Note: 420 lines; externalized config/precedence, `@ConfigurationProperties` vs `@Value`, profiles, metadata.
  - [x] Task 4.1. Externalized configuration sources and precedence (`application.yml`, env vars, command-line
    args, per-profile files). `[source,yaml]` + `[source,bash]`.
  - [x] Task 4.2. `@ConfigurationProperties` (type-safe, `@Validated`-friendly) vs. `@Value` (single ad-hoc
    values), relaxed binding rules. `[source,java]` + `[source,yaml]`.
  - [x] Task 4.3. Profiles: `spring.profiles.active`, `application-<profile>.yml`, `@Profile`. `[source,yaml]` +
    `[source,java]`.
  - [x] Task 4.4. Configuration metadata (`additional-spring-configuration-metadata.json`) for IDE
    autocompletion. `[source,json]`.
  - [x] Task 4.5. Links: https://docs.spring.io/spring-boot/reference/features/external-config.html,
    https://docs.spring.io/spring-boot/reference/features/profiles.html,
    https://docs.spring.io/spring-boot/specification/configuration-metadata/index.html.

- [x] Task 5. Create `modules/ROOT/pages/backend/springboot/spring-data-overview.adoc` (issue #55 page 4)
  - Note: 302 lines + `modules/ROOT/images/springboot-data-access-layers.svg` (47 lines); repository abstraction,
    per-database module map, layered access-pattern diagram.
  - [x] Task 5.1. The repository abstraction shared by every Spring Data module: `CrudRepository`/
    `ListCrudRepository`, derived query methods (`findByLastName`), `@Query`, paging & sorting (`Pageable`),
    projections, auditing, `@Transactional`. `[source,java]`.
  - [x] Task 5.2. A short "which module for which database" map (JPA/JDBC → SQL, MongoDB, Couchbase, Neo4j,
    Redis) previewing the next four pages plus `caching.adoc`.
  - [x] Task 5.3. Embed `image::springboot-data-access-layers.svg[…]` (Task 5.4), introducing the
    repository-vs-low-level-template choice that Tasks 6–9 each cover for their own store.
  - [x] Task 5.4. Create `modules/ROOT/images/springboot-data-access-layers.svg` — hand-authored layered box
    diagram: application code → `Repository` interface (derived/`@Query` methods) → the store's low-level
    Template/Client (`JdbcClient`, `MongoTemplate`, `CouchbaseTemplate`, `Neo4jClient`) → the native driver, with
    a label on the middle layer noting "used for queries a repository can't express."
  - [x] Task 5.5. Links: https://docs.spring.io/spring-data/commons/reference/repositories.html,
    https://docs.spring.io/spring-data/commons/reference/repositories/query-methods-details.html.

- [x] Task 6. Create `modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc` (issue #55 page 5)
  - Note: 423 lines; JPA mapping/`JpaRepository`, `@Query`/Specifications/projections, auditing, and a
    first-class "Custom queries without JPA" (`JdbcClient`/`JdbcTemplate`) subsection.
  - [x] Task 6.1. Entities and JPA mapping (`@Entity`/`@Id`/`@Column`/relationship annotations), `JpaRepository`,
    derived query methods. `[source,java]`.
  - [x] Task 6.2. `@Query` (JPQL and native SQL), Specifications/Querydsl for dynamic queries, projections
    (interface/DTO/dynamic). `[source,java]`.
  - [x] Task 6.3. `@Transactional` and propagation, auditing (`@CreatedDate`/`@LastModifiedBy` with
    `@EnableJpaAuditing`). `[source,java]`.
  - [x] Task 6.4. **Custom queries without JPA** subsection: `JdbcClient` (Spring Framework 6.1+'s fluent facade)
    and the classic `JdbcTemplate`/`NamedParameterJdbcTemplate` — row mappers (`RowMapper<T>`), batch updates
    (`batchUpdate`), and when to reach for JDBC instead of an ORM (bulk operations, complex reporting queries,
    vendor-specific SQL). `[source,java]`.
  - [x] Task 6.5. Links: https://docs.spring.io/spring-data/jpa/reference/,
    https://docs.spring.io/spring-framework/reference/data-access/jdbc/core.html,
    the `JdbcClient`/`JdbcTemplate` API docs referenced in issue #55's Bibliography.

- [x] Task 7. Create `modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc` (issue #55 page 6)
  - Note: 364 lines; `MongoRepository`/mapping/indexes/auditing/transactions, "Custom queries with
    MongoTemplate" subsection, cross-references to the existing MongoDB Reference.
  - [x] Task 7.1. `MongoRepository`, document mapping (`@Document`/`@Id`/`@Field`), indexes (`@Indexed`),
    auditing, transactions, change streams (brief — cross-reference
    xref:database/mongodb/change-streams.adoc[MongoDB Reference: Change Streams] for the database-side detail).
    `[source,java]`.
  - [x] Task 7.2. **Custom queries with `MongoTemplate`** subsection: the `Query`/`Criteria` fluent builder, the
    Aggregation Framework via `MongoTemplate.aggregate(...)`, and the `execute`/`CollectionCallback` escape hatch
    for the raw driver. `[source,java]`.
  - [x] Task 7.3. Cross-reference xref:database/mongodb/index.adoc[MongoDB Reference] for document modeling,
    indexing strategy, and aggregation-pipeline concepts rather than duplicating them.
  - [x] Task 7.4. Links: https://docs.spring.io/spring-data/mongodb/reference/mongodb/template-api.html,
    https://docs.spring.io/spring-data/mongodb/reference/mongodb/template-query-operations.html.

- [x] Task 8. Create `modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc` (issue #55 page 7)
  - Note: 317 lines; `CouchbaseRepository`/N1QL/scopes/collections, "Custom queries with CouchbaseTemplate"
    subsection, cross-references to the existing Couchbase Reference.
  - [x] Task 8.1. `CouchbaseRepository`, N1QL/SQL++ derived and `@Query` methods, buckets/scopes/collections
    mapping (`@Scope`/`@Collection`). `[source,java]`.
  - [x] Task 8.2. Full-text/vector search integration overview (brief — cross-reference
    xref:database/couchbase/search-analytics-eventing.adoc[Couchbase Reference: Search, Analytics & Eventing]).
    `[source,java]`.
  - [x] Task 8.3. **Custom queries with `CouchbaseTemplate`** subsection: `findByQuery`/`upsertById`/`removeById`
    and direct SDK access when a repository is too high-level. `[source,java]`.
  - [x] Task 8.4. Links: https://docs.spring.io/spring-data/couchbase/reference/couchbase/template.html; cross
    reference xref:database/couchbase/index.adoc[Couchbase Reference].

- [x] Task 9. Create `modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc` (issue #55 page 8)
  - Note: 309 lines; `@Node`/`@Relationship`/`Neo4jRepository`, "Custom queries with Neo4jClient" subsection.
  - [x] Task 9.1. `@Node`/`@Relationship` mapping, `Neo4jRepository`, derived and custom Cypher (`@Query`)
    methods, projections, auditing. `[source,java]`.
  - [x] Task 9.2. **Custom queries with `Neo4jClient`** subsection: running arbitrary Cypher via
    `neo4jClient.query(...).fetchAs(...)`, binding parameters, mapping results to non-entity DTOs. `[source,java]`.
  - [x] Task 9.3. Links: https://docs.spring.io/spring-data/neo4j/reference/appendix/custom-queries.html and the
    `Neo4jClient` API docs.

- [x] Task 10. Create `modules/ROOT/pages/backend/springboot/caching.adoc` (issue #55 page 9)
  - Note: 311 lines; `@Cacheable` family/SpEL, Caffeine local caching, Redis distributed caching.
  - [x] Task 10.1. The Spring Cache abstraction: `@EnableCaching`, `@Cacheable`/`@CachePut`/`@CacheEvict`, SpEL
    key generation (`key = "#id"`, `condition`/`unless`). `[source,java]`.
  - [x] Task 10.2. Local caching with the default `ConcurrentMapCacheManager` and Caffeine
    (`spring-boot-starter-cache` + `com.github.ben-manes.caffeine:caffeine`), size/expiry configuration.
    `[source,java]` + `[source,yaml]`.
  - [x] Task 10.3. Distributed caching with **Redis**: `RedisCacheManager`, Spring Data Redis, TTL/serialization
    configuration, cache-aside vs. read/write-through. `[source,java]` + `[source,yaml]`.
  - [x] Task 10.4. Links: https://docs.spring.io/spring-boot/reference/io/caching.html,
    https://docs.spring.io/spring-data/redis/reference/redis/redis-cache.html,
    https://redis.io/docs/latest/integrate/spring-framework-cache/.

- [x] Task 11. Create `modules/ROOT/pages/backend/springboot/rest-apis.adoc` (issue #55 page 10)
  - Note: 344 lines; Spring MVC `@RestController`, `@ExceptionHandler`/`ProblemDetail`, WebFlux comparison.
  - [x] Task 11.1. Spring MVC: `@RestController`, request/response mapping (`@GetMapping`/`@PathVariable`/
    `@RequestBody`), Bean Validation (`@Valid`). `[source,java]`.
  - [x] Task 11.2. Exception handling: `@ExceptionHandler`, `@ControllerAdvice`, `ProblemDetail`. `[source,java]`.
  - [x] Task 11.3. Spring WebFlux for reactive REST (`RouterFunction` vs. annotated controllers), and when to
    choose WebFlux over MVC. `[source,java]`.
  - [x] Task 11.4. Links: https://docs.spring.io/spring-boot/reference/web/servlet.html,
    https://docs.spring.io/spring-boot/reference/web/reactive.html,
    https://docs.spring.io/spring-framework/reference/web/webmvc.html.

- [x] Task 12. Create `modules/ROOT/pages/backend/springboot/grpc-apis.adoc` (issue #55 page 11)
  - Note: 341 lines; `.proto` recap, Spring gRPC `@GrpcService`/`@ImportGrpcClients`, interceptors/error mapping.
  - [x] Task 12.1. gRPC service definitions from `.proto` files (brief recap — full contract-first detail lives in
    `api-first-rest-and-grpc.adoc`, Task 22). `[source,protobuf]`.
  - [x] Task 12.2. The official **Spring gRPC** project and its Spring Boot 4.1 starters: `@GrpcService` for
    server implementations, `@ImportGrpcClients` for typed client injection. `[source,java]` + `[source,yaml]`.
  - [x] Task 12.3. Interceptors and error mapping (gRPC status codes vs. Java exceptions). `[source,java]`.
  - [x] Task 12.4. Note explicitly that Spring gRPC 1.0 GA'd alongside Spring Boot 4.1, after every local book, so
    the official reference is the sole source here. Links: https://docs.spring.io/spring-grpc/reference/.

- [x] Task 13. Create `modules/ROOT/pages/backend/springboot/web-ui-frameworks.adoc` (issue #55 new page —
  server-side web UI frameworks)
  - Note: 181 lines; Thymeleaf, Vaadin (linked out), JSF/JoinFaces (flagged legacy), decision table.
  - [x] Task 13.1. **Thymeleaf**: natural-templating philosophy, `spring-boot-starter-thymeleaf` auto-configured
    `ITemplateResolver`, `th:*` attributes, fragments/layouts (`th:insert`/`th:replace`), Spring MVC form binding
    (`th:object`/`th:field`). `[source,java]` + `[source,html]`.
  - [x] Task 13.2. **Vaadin** as the richer, component-based alternative — a short summary of when to reach for it
    (rich stateful UI vs. simple server-rendered pages) with no duplication: link
    xref:web/vaadin/index.adoc[Vaadin Reference] and xref:web/vaadin/spring-boot-integration.adoc[its Spring Boot
    Integration page] for everything else.
  - [x] Task 13.3. **JSF via JoinFaces**, covered for completeness/legacy-system maintenance: what JoinFaces
    auto-configures (Mojarra/MyFaces + component libraries like PrimeFaces) inside a Spring Boot app, with an
    explicit callout that JSF is a **legacy** choice for new Spring Boot projects — Thymeleaf, Vaadin, or a
    separate SPA front end are the current recommendations. `[source,xml]`.
  - [x] Task 13.4. Close with a short decision table: server-rendered (Thymeleaf) vs. component-based (Vaadin) vs.
    REST + separate front end vs. legacy JSF (JoinFaces).
  - [x] Task 13.5. Links: https://docs.spring.io/spring-framework/reference/web/webmvc-view/mvc-thymeleaf.html,
    https://www.thymeleaf.org/documentation.html, https://docs.joinfaces.org/current/reference/.

- [x] Task 14. Create `modules/ROOT/pages/backend/springboot/messaging-kafka.adoc` (issue #55 page 12)
  - Note: 310 lines; `KafkaTemplate` producing, `@KafkaListener` consuming, serializers, sequence diagram.
  - [x] Task 14.1. Producing with `KafkaTemplate` (the auto-configured `ProducerFactory`/`KafkaTemplate` beans),
    transactional producers. `[source,java]` + `[source,yaml]`.
  - [x] Task 14.2. Consuming with `@KafkaListener` — manual/batch ack modes, error handlers, dead-letter topics,
    retry. `[source,java]` + `[source,yaml]`.
  - [x] Task 14.3. Serializers/deserializers and the `ConsumerFactory` bean Spring Boot auto-configures.
    `[source,java]`.
  - [x] Task 14.4. A `[mermaid]` sequence diagram: producer → `KafkaTemplate.send` → topic partition → consumer
    group → `@KafkaListener` → ack (or DLT on failure).
  - [x] Task 14.5. Links: https://docs.spring.io/spring-kafka/reference/,
    https://docs.spring.io/spring-boot/reference/messaging/kafka.html.

- [x] Task 15. Create `modules/ROOT/pages/backend/springboot/scheduling-and-shedlock.adoc` (issue #55 new page —
  scheduling)
  - Note: 291 lines; `@Scheduled`/`TaskScheduler`, multi-instance problem, ShedLock (JDBC/MongoDB/Redis),
    sequence diagram.
  - [x] Task 15.1. In-process scheduling: `@EnableScheduling`/`@Scheduled` (`fixedRate`/`fixedDelay`/`cron`), the
    `TaskScheduler` abstraction. `[source,java]`.
  - [x] Task 15.2. State the multi-instance problem explicitly: every instance of a horizontally-scaled service
    fires the same `@Scheduled` method, with no built-in Spring solution.
  - [x] Task 15.3. **ShedLock**: `@SchedulerLock` (`lockAtMostFor`/`lockAtLeastFor`), the `LockProvider`
    abstraction, and configuring at least the JDBC, MongoDB, and Redis providers (matching the database engines
    already covered in Spring Data). `[source,java]` + `[source,xml]`.
  - [x] Task 15.4. A `[mermaid]` sequence diagram: two service instances both fire a `@Scheduled` method at the
    same tick; one acquires the ShedLock lock and runs; the other checks the lock, finds it held, and skips.
  - [x] Task 15.5. Links: https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html,
    https://docs.spring.io/spring-framework/reference/integration/scheduling.html,
    https://github.com/lukas-krecan/ShedLock (its README is the only documentation source for ShedLock — no
    separate docs site exists; say so in the page).

- [x] Task 16. Create `modules/ROOT/pages/backend/springboot/logging.adoc` (issue #55 page 13)
  - Note: 232 lines; Logback defaults/levels, structured JSON logging/MDC, stdout vs. file routing.
  - [x] Task 16.1. Spring Boot's default Logback setup, log levels and per-package configuration
    (`logging.level.*`). `[source,yaml]`.
  - [x] Task 16.2. Structured (JSON) logging for container platforms, correlation IDs / MDC. `[source,java]` +
    `[source,yaml]`.
  - [x] Task 16.3. Routing logs to a file vs. stdout, and why stdout is preferred under container orchestration.
    `[source,yaml]`.
  - [x] Task 16.4. Links: https://docs.spring.io/spring-boot/reference/features/logging.html.

- [x] Task 17. Create `modules/ROOT/pages/backend/springboot/metrics-and-observability.adoc` (issue #55 page 14)
  - Note: 328 lines; Micrometer/Actuator, OpenTelemetry tracing, Prometheus/Grafana, distributed-trace sequence
    diagram.
  - [x] Task 17.1. Micrometer as the metrics facade, Spring Boot Actuator endpoints, exposing
    `/actuator/prometheus`. `[source,java]` + `[source,yaml]`.
  - [x] Task 17.2. Micrometer Tracing + **OpenTelemetry**: the `OpenTelemetry`/`SdkTracerProvider` beans, OTLP
    export configuration. `[source,yaml]` + `[source,java]`.
  - [x] Task 17.3. Wiring **Prometheus** scraping and a **Grafana** dashboard end to end (a minimal
    `prometheus.yml` scrape config + a Grafana data-source example). `[source,yaml]`.
  - [x] Task 17.4. A `[mermaid]` sequence diagram: a request enters service A, a span starts, service A calls
    service B carrying the trace context in headers, service B continues the same trace — illustrating
    distributed tracing across services.
  - [x] Task 17.5. Links: https://docs.spring.io/spring-boot/reference/actuator/observability.html,
    https://docs.micrometer.io/micrometer/reference/, https://opentelemetry.io/docs/languages/java/,
    https://prometheus.io/docs/, https://grafana.com/docs/.

- [x] Task 18. Create `modules/ROOT/pages/backend/springboot/reactive-programming.adoc` (issue #55 page 15)
  - Note: 314 lines; Mono/Flux/operators, backpressure/schedulers, StepVerifier, reactor-workshop link.
  - [x] Task 18.1. `Mono`/`Flux`, the assembly vs. subscription phases, core operators (`map`/`flatMap`/`zip`/
    `merge`). `[source,java]`.
  - [x] Task 18.2. Backpressure, schedulers and context, error handling (`onErrorResume`/`retry`). `[source,java]`.
  - [x] Task 18.3. Testing reactive streams with `StepVerifier`; how WebFlux/R2DBC/reactive Spring Data build on
    Reactor. `[source,java]`.
  - [x] Task 18.4. Link out to the user's own hands-on workshop:
    https://github.com/albertoirurueta/reactor-workshop[the Reactor workshop] for exercises.
  - [x] Task 18.5. Links: https://projectreactor.io/docs/core/release/reference/.

- [x] Task 19. Create `modules/ROOT/pages/backend/springboot/lombok-and-mapstruct.adoc` (issue #55 page 16)
  - Note: 311 lines; Lombok annotations/trade-offs, MapStruct mappers, `lombok-mapstruct-binding` ordering.
  - [x] Task 19.1. **Lombok** annotations (`@Getter`/`@Setter`/`@Builder`/`@Value`/`@RequiredArgsConstructor`/
    `@Slf4j`) and their trade-offs (generated code invisibility, IDE plugin requirement). `[source,java]`.
  - [x] Task 19.2. **MapStruct** for generated (not reflective) DTO ↔ entity mappers: `@Mapper`, `@Mapping`,
    default methods for custom conversions. `[source,java]`.
  - [x] Task 19.3. The `lombok-mapstruct-binding` annotation-processor ordering needed to use both together (in
    the Maven compiler plugin's `annotationProcessorPaths`). `[source,xml]`.
  - [x] Task 19.4. Links: https://projectlombok.org/features/,
    https://mapstruct.org/documentation/stable/reference/html/.

- [x] Task 20. Create `modules/ROOT/pages/backend/springboot/unit-and-integration-testing.adoc` (issue #55 page 17)
  - Note: 279 lines; JUnit 5/Mockito, Spring Boot test slices, `@SpringBootTest` + Testcontainers.
  - [x] Task 20.1. Unit testing with **JUnit 5** and **Mockito**: `@ExtendWith(MockitoExtension.class)`,
    `@Mock`/`@InjectMocks`, argument matchers/captors, `verify`. `[source,java]`.
  - [x] Task 20.2. Spring Boot's test slices: `@WebMvcTest`, `@DataJpaTest`, `@DataMongoTest`, etc. — what each
    slice loads and mocks. `[source,java]`.
  - [x] Task 20.3. Integration testing with `@SpringBootTest` + **Testcontainers** (`@ServiceConnection`, one
    container per real dependency instead of mocks). `[source,java]`.
  - [x] Task 20.4. Links: https://docs.spring.io/spring-boot/reference/testing/,
    https://junit.org/junit5/docs/current/user-guide/, https://site.mockito.org/,
    https://testcontainers.com/, https://java.testcontainers.org/.

- [x] Task 21. Create `modules/ROOT/pages/backend/springboot/performance-testing-jmeter.adoc` (issue #55 page 18)
  - Note: 251 lines; JMeter test-plan structure, property parameterization, Actuator/Prometheus correlation,
    `jmeter-maven-plugin`.
  - [x] Task 21.1. **Apache JMeter** test plan structure: thread groups, samplers, assertions. `[source,xml]`
    (a minimal `.jmx` excerpt) + `[source,text]`.
  - [x] Task 21.2. Parameterizing plans with JMeter properties (`${__P(name,default)}`) for reusable scenario
    profiles. `[source,text]`.
  - [x] Task 21.3. Correlating response-time percentiles/throughput against Actuator/Prometheus-reported CPU and
    memory. `[source,text]`.
  - [x] Task 21.4. Running plans from Maven via `jmeter-maven-plugin`. `[source,xml]`.
  - [x] Task 21.5. Links: https://jmeter.apache.org/usermanual/index.html.

- [x] Task 22. Create `modules/ROOT/pages/backend/springboot/api-first-rest-and-grpc.adoc` (issue #55 page 19)
  - Note: 405 lines; OpenAPI contract-first + springdoc-openapi, protobuf contract-first gRPC, codegen flowchart.
  - [x] Task 22.1. Contract-first REST with the **OpenAPI** specification: writing/organizing a spec, generating
    server interfaces and DTOs with `openapi-generator-maven-plugin`. `[source,yaml]` + `[source,xml]`.
  - [x] Task 22.2. `springdoc-openapi` as the complementary code-first option (runtime docs/Swagger UI) — when to
    use contract-first vs. code-first, or both together. `[source,java]` + `[source,xml]`.
  - [x] Task 22.3. Contract-first gRPC with **Protocol Buffers**: `.proto` service definitions,
    `protobuf-maven-plugin` generating stubs, `protoc-gen-doc` for HTML reference. `[source,protobuf]` +
    `[source,xml]`.
  - [x] Task 22.4. A `[mermaid]` flowchart: spec (`.yaml`/`.proto`) → Maven code-gen plugin → generated
    interfaces/stubs → hand-written implementation.
  - [x] Task 22.5. Links: https://spec.openapis.org/oas/latest.html, https://springdoc.org/,
    https://openapi-generator.tech/, https://protobuf.dev/, https://www.xolstice.org/protobuf-maven-plugin/.

- [x] Task 23. Create `modules/ROOT/pages/backend/springboot/api-first-messaging.adoc` (issue #55 page 20)
  - Note: 281 lines; Avro schemas/avro-maven-plugin, Confluent Schema Registry compatibility, AsyncAPI.
  - [x] Task 23.1. Contract-first Kafka messaging with **Apache Avro** schemas: `.avsc` files,
    `avro-maven-plugin` generating Java classes. `[source,json]` + `[source,xml]`.
  - [x] Task 23.2. **Confluent Schema Registry** for compatibility checking (backward/forward compatibility
    modes). `[source,yaml]`.
  - [x] Task 23.3. Describing the topics that carry those schemas with **AsyncAPI**: spec structure, the
    `@asyncapi/html-template` generator for HTML docs. `[source,yaml]` + `[source,xml]`.
  - [x] Task 23.4. Links: https://avro.apache.org/docs/,
    https://docs.confluent.io/platform/current/schema-registry/index.html, https://www.asyncapi.com/docs.

- [x] Task 24. Create `modules/ROOT/pages/backend/springboot/maven-quality-plugins.adoc` (issue #55 page 21)
  - Note: 377 lines; JaCoCo (+ report-aggregate), Surefire vs. Failsafe, Checkstyle/SpotBugs/PMD.
  - [x] Task 24.1. **JaCoCo** for coverage, including multi-module `report-aggregate`. `[source,xml]`.
  - [x] Task 24.2. **Surefire** for unit tests vs. **Failsafe** for integration tests — the `*IT`/`*Test` naming
    convention and why they're separate phases/plugins. `[source,xml]`.
  - [x] Task 24.3. Static analysis with **Checkstyle**, **SpotBugs**, and **PMD** — rule sets, failing the build
    vs. reporting only, excluding generated sources. `[source,xml]`.
  - [x] Task 24.4. Links: https://www.jacoco.org/jacoco/trunk/doc/,
    https://maven.apache.org/surefire/maven-surefire-plugin/, https://maven.apache.org/surefire/maven-failsafe-plugin/,
    https://checkstyle.sourceforge.io/, https://spotbugs.github.io/, https://pmd.github.io/.

- [x] Task 25. Create `modules/ROOT/pages/backend/springboot/architectural-patterns.adoc` (issue #55 page 22)
  - [x] Task 25.1. **SOLID** principles, briefly, each with a one-line Spring-flavored example (e.g. DIP ↔
    constructor-injected interfaces). `[source,java]`.
  - [x] Task 25.2. **Hexagonal (ports & adapters) architecture**: domain at the center, ports as interfaces,
    adapters as REST controllers/repository implementations/Kafka listeners plugging in from outside. Embed
    `image::springboot-hexagonal-architecture.svg[…]` (Task 25.7). `[source,java]`.
  - [x] Task 25.3. Core **DDD** vocabulary as it shows up in a Spring Boot codebase: entities, value objects,
    aggregates, domain events. `[source,java]`.
  - [x] Task 25.4. The **transactional outbox** pattern for reliably publishing Kafka events alongside a database
    write, with a `[mermaid]` sequence diagram (write business row + outbox row in one transaction → separate
    relay process reads outbox → publishes to Kafka). `[source,java]`.
  - [x] Task 25.5. The **listen-to-yourself** pattern, and the **saga** pattern (orchestration vs. choreography)
    for cross-service consistency, with a `[mermaid]` diagram contrasting the two saga styles. `[source,java]`.
  - [x] Task 25.6. A closing note: a deeper, dedicated Architectural Patterns guide is planned as a future
    addition to Backend Development — this page stays introductory.
  - [x] Task 25.7. Create `modules/ROOT/images/springboot-hexagonal-architecture.svg` — hand-authored: a hexagon
    with "Domain" at the center, port interfaces on its edges, and adapter boxes (REST controller, JPA
    repository adapter, Kafka listener/producer) plugged into each port from outside.
  - [x] Task 25.8. Links: https://alistair.cockburn.us/hexagonal-architecture/,
    https://microservices.io/patterns/data/transactional-outbox.html,
    https://microservices.io/patterns/data/saga.html, https://microservices.io/patterns/data/domain-event.html,
    https://medium.com/@odedia/listen-to-yourself-design-pattern-for-event-driven-microservices-16f97e3ed066.
  - Note: created `modules/ROOT/pages/backend/springboot/architectural-patterns.adoc` (312 lines); reused the
    pre-existing `modules/ROOT/images/springboot-hexagonal-architecture.svg` after verifying it was complete and
    correct (proper hexagon geometry, inbound/outbound ports, four adapters, correctly directed arrows) rather
    than redoing it.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 26), but it must run **after** Group 2 so its `xref:` back-links point
at pages that exist and its content reflects every page's final scope.

- [x] Task 26. Create the SpringBoot cheat sheet — `modules/ROOT/pages/backend/springboot/cheat-sheet.adoc` +
  `modules/ROOT/attachments/springboot-cheat-sheet.pdf`
  - [x] Task 26.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarizing every concept in this reference: `@SpringBootApplication`/auto-config
    one-liners; bean/DI annotations; `application.yml` precedence; the four Spring Data repository/template
    pairs at a glance; `@Cacheable` syntax; REST/gRPC annotation cheat rows; Thymeleaf `th:*` attributes;
    `KafkaTemplate`/`@KafkaListener` syntax; `@Scheduled` + `@SchedulerLock` syntax; logging property keys;
    Micrometer/Actuator endpoint list; `Mono`/`Flux` operator table; Lombok/MapStruct annotation table; JUnit/
    Mockito/Testcontainers annotation table; JMeter element list; OpenAPI/protobuf/Avro/AsyncAPI plugin
    coordinates; Maven quality-plugin coordinates; a one-line-per-pattern architecture glossary. Match the visual
    style of an existing cheat sheet (see `modules/ROOT/pages/web/aspnet/cheat-sheet.adoc` + its PDF).
  - [x] Task 26.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=springboot-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/springboot-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count
    check + a rendered preview with no clipping).
  - [x] Task 26.3. Create `modules/ROOT/pages/backend/springboot/cheat-sheet.adoc`:
    `include::partial$springboot-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every
    Group 2 page, and `xref:attachment$springboot-cheat-sheet.pdf[Download the SpringBoot Cheat Sheet (PDF)]`.
  - Note: 18-box, 6-column colour-coded landscape layout built as a scratch HTML/CSS file, rendered via headless
    Chrome to `modules/ROOT/attachments/springboot-cheat-sheet.pdf` (confirmed exactly 1 PDF page, no clipping);
    `modules/ROOT/pages/backend/springboot/cheat-sheet.adoc` created with grouped xref links to all 24 pages
    plus the PDF download link.

### Group 4 — Section index, top-level landing page, nav/landing wiring, and final verification

**Parallelizable: no** — Task 27 (subsection index) must link every page from Groups 2–3; Task 28 (top-level
landing page) links to Task 27's page; Task 29/30 (nav/landing wiring) depend on Tasks 27–28 existing and on
final page/file names; Task 31 (build) depends on every prior task having landed.

- [x] Task 27. Create `modules/ROOT/pages/backend/springboot/index.adoc` — SpringBoot Reference landing page
  - [x] Task 27.1. `= SpringBoot Reference`, `:description:`/`:keywords:`,
    `include::partial$springboot-disclaimer.adoc[]`, a short intro (what Spring Boot is; this section documents
    Spring Boot 4.1.x / Spring Framework 6.2.x verified against docs.spring.io; where to start —
    `getting-started.adoc` → `core-concepts.adoc` → `configuration-and-profiles.adoc`).
  - [x] Task 27.2. A grouped `== What's covered` section `xref:`-linking every Group 2–3 page, one-line blurb
    each, under readable sub-headings matching the issue's own grouping: **Getting started**; **Core concepts**;
    **Spring Data** (overview, JPA/SQL, MongoDB, Couchbase, Neo4j); **Caching**; **APIs** (REST, gRPC);
    **Server-side web UI frameworks**; **Messaging**; **Scheduling**; **Observability** (logging,
    metrics/observability); **Reactive programming**; **Developer productivity tools**; **Testing** (unit &
    integration, performance); **API-first development** (REST/gRPC, messaging); **Build & quality**;
    **Architecture**; **Reference** (cheat sheet).
  - [x] Task 27.3. `== Bibliography` transcribing issue #55's full Bibliography section verbatim (official
    documentation list, then the nine local books with the explicit "consulted, not primary" framing and
    `book3.pdf` noted as not used).
  - Note: created `modules/ROOT/pages/backend/springboot/index.adoc`; fetched issue #55 verbatim via `gh issue
    view 55` to transcribe its exact Bibliography section (official docs list + all 9 local books, book3.pdf
    marked not used, book4.pdf's Spring Cloud scope-limitation noted).

- [x] Task 28. Create `modules/ROOT/pages/backend/index.adoc` — new top-level Backend Development landing page
  - [x] Task 28.1. `= Backend Development`, `:description:`/`:keywords:` (mentioning Spring Boot, Spring
    Framework, Spring Data, REST, gRPC, Kafka, hexagonal architecture, DDD), a short intro parallel to
    `web/index.adoc`'s opening sentence ("A growing collection of backend-development references...").
  - [x] Task 28.2. A `== Sections` list with a single bullet for now: `xref:backend/springboot/index.adoc[SpringBoot
    Reference]` with a one-line blurb summarizing the whole section (Spring Data across SQL/MongoDB/Couchbase/
    Neo4j, caching, REST/gRPC APIs, Kafka messaging, scheduling, observability, reactive programming, testing,
    API-first development, and architectural patterns), written so a future sibling guide (the planned dedicated
    Architectural Patterns guide) can be appended later without restructuring.
  - Note: created `modules/ROOT/pages/backend/index.adoc`, mirroring `web/index.adoc`'s format exactly.

- [x] Task 29. Wire `modules/ROOT/nav.adoc`: append a new top-level Backend Development block
  - [x] Task 29.1. At the end of the file (currently line 396, ending at
    `**** xref:web/python/cheat-sheet.adoc[Cheat Sheet (PDF)]`), append:
    ```
    ** xref:backend/index.adoc[Backend Development]
    *** xref:backend/springboot/index.adoc[SpringBoot Reference]
    **** xref:backend/springboot/getting-started.adoc[Getting Started]
    **** xref:backend/springboot/core-concepts.adoc[Core Concepts]
    **** xref:backend/springboot/configuration-and-profiles.adoc[Configuration & Profiles]
    **** xref:backend/springboot/spring-data-overview.adoc[Spring Data Overview]
    **** xref:backend/springboot/spring-data-jpa.adoc[Spring Data JPA (SQL)]
    **** xref:backend/springboot/spring-data-mongodb.adoc[Spring Data MongoDB]
    **** xref:backend/springboot/spring-data-couchbase.adoc[Spring Data Couchbase]
    **** xref:backend/springboot/spring-data-neo4j.adoc[Spring Data Neo4j]
    **** xref:backend/springboot/caching.adoc[Caching]
    **** xref:backend/springboot/rest-apis.adoc[REST APIs]
    **** xref:backend/springboot/grpc-apis.adoc[gRPC APIs]
    **** xref:backend/springboot/web-ui-frameworks.adoc[Server-Side Web UI Frameworks]
    **** xref:backend/springboot/messaging-kafka.adoc[Messaging with Kafka]
    **** xref:backend/springboot/scheduling-and-shedlock.adoc[Scheduling & ShedLock]
    **** xref:backend/springboot/logging.adoc[Logging]
    **** xref:backend/springboot/metrics-and-observability.adoc[Metrics & Observability]
    **** xref:backend/springboot/reactive-programming.adoc[Reactive Programming]
    **** xref:backend/springboot/lombok-and-mapstruct.adoc[Lombok & MapStruct]
    **** xref:backend/springboot/unit-and-integration-testing.adoc[Unit & Integration Testing]
    **** xref:backend/springboot/performance-testing-jmeter.adoc[Performance Testing with JMeter]
    **** xref:backend/springboot/api-first-rest-and-grpc.adoc[API-First: REST & gRPC]
    **** xref:backend/springboot/api-first-messaging.adoc[API-First: Messaging]
    **** xref:backend/springboot/maven-quality-plugins.adoc[Maven Quality Plugins]
    **** xref:backend/springboot/architectural-patterns.adoc[Architectural Patterns]
    **** xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```
  - Note: appended the block to `modules/ROOT/nav.adoc` (25 new lines) exactly as specified.

- [x] Task 30. Wire `modules/ROOT/pages/index.adoc`'s `== Guides & References` list
  - [x] Task 30.1. Insert, immediately after the Python Reference bullet (currently the last line of the Web
    Development block, right before `== About me`):
    ```
    * xref:backend/index.adoc[Backend Development] -- a growing collection of backend-development references,
      starting with Spring Boot.
    ** xref:backend/springboot/index.adoc[SpringBoot Reference] -- Spring Data across SQL, MongoDB, Couchbase, and
      Neo4j, local and distributed caching, REST and gRPC APIs, Kafka messaging, scheduling, observability
      (OpenTelemetry, Prometheus, Grafana), reactive programming with Reactor, contract-first APIs (OpenAPI,
      protobuf, AsyncAPI, Avro), and hexagonal/DDD architectural patterns, plus a downloadable cheat sheet.
    ```
  - Note: inserted immediately after the Python Reference bullet in `modules/ROOT/pages/index.adoc`, before
    `== About me`.

- [x] Task 31. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for SpringBoot Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit code
      0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute' warnings
      (with file/line) — pay special attention to modules/ROOT/pages/backend/**, modules/ROOT/nav.adoc, and
      modules/ROOT/pages/index.adoc; and confirmation that build/site/backend/index.html,
      build/site/backend/springboot/*.html (26 pages), the PDF attachment
      build/site/_attachments/springboot-cheat-sheet.pdf, the two images
      build/site/_images/springboot-hexagonal-architecture.svg and springboot-data-access-layers.svg, every new
      nav entry, and all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 31.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute" warnings
    (most likely an unescaped `\{ … }` in prose — a `${property}` placeholder or SpEL expression shown outside a
    `[source]` block, a typo'd `xref:` target, a bad `[source,…]` token, or a missing nav entry), then re-run the
    agent until the build is clean, before checking this task off.
  - [x] Task 31.2. After the build is clean, confirm no other existing Antora page needs a cross-reference update
    for the new section — spot-check `web/vaadin/spring-boot-integration.adoc` and `database/mongodb/index.adoc`/
    `database/couchbase/index.adoc` for whether a "for Spring Data integration, see the SpringBoot Reference"
    pointer fits their existing style; add it only if it does, otherwise note the check was made and nothing was
    added.
  - Note: first build run found 1 xref error (`core-concepts.adoc:55` pointed at a nonexistent
    `web-rest-apis.adoc` slug -- fixed to `rest-apis.adoc`) and 1 missing-attribute warning
    (`metrics-and-observability.adoc:96` -- unescaped `{name}` in prose, escaped to `\{name}`); also proactively
    fixed a similarly-malformed escape in `configuration-and-profiles.adoc` (`\${random.int}` -> `$\{random.int}`)
    found via a repo-wide brace scan. Re-run confirmed exit code 0 with zero WARN/ERROR lines anywhere in the
    log, and all expected build/site artifacts (26 springboot pages, backend/index.html, the PDF attachment, both
    SVGs, nav entries, mermaid diagrams) present. Spot-check: added a "See also" xref from
    `web/vaadin/spring-boot-integration.adoc` to `backend/springboot/web-ui-frameworks.adoc` (fits that page's
    existing "See also" list style); `database/mongodb/index.adoc` and `database/couchbase/index.adoc` were
    checked but left unchanged -- their existing cross-link style points only to sibling database references
    (SQL/MongoDB Reference), not to application-framework integration pages, so a SpringBoot Reference pointer
    would not fit.
