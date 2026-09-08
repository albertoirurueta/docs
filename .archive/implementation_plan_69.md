# Implementation Plan — Hibernate Reference documentation section

## Task summary

Source: GitHub issue #69.

Add a new **"Hibernate Reference"** section under *Guides & References → Backend Development*, at
`modules/ROOT/pages/backend/hibernate/`, following the exact pattern already used by
`modules/ROOT/pages/backend/springboot/`: a landing page (`index.adoc`) with a disclaimer include, a "What's
covered" index, and a single consolidated `== Bibliography`; one `.adoc` page per concept with runnable examples
and inline links to the official documentation; Mermaid/SVG diagrams where they clarify a concept; and a
one-page, printable, downloadable PDF cheat sheet (`cheat-sheet.adoc` + `modules/ROOT/attachments/hibernate-cheat-sheet.pdf`).

This section becomes the "dedicated in-depth Hibernate guide" that
[`backend/springboot/hibernate.adoc`](modules/ROOT/pages/backend/springboot/hibernate.adoc) already promises.
That page's short conceptual overview stays as-is except its closing "A dedicated in-depth Hibernate guide will
follow" sentence, which becomes an `xref:` to the new section's landing page.

**Choices made on the user's behalf (no ambiguity worth blocking on):**

1. **Nav placement.** The issue's text describes the new section as a sibling of an existing
   `backend/java/index.adoc` ("Java Reference"), placed adjacent to it in `nav.adoc`. That path does not exist —
   the actual Java Reference lives at `programming-languages/java/index.adoc`
   ([backend/index.adoc:10](modules/ROOT/pages/backend/index.adoc:10)), and its `nav.adoc` block is pulled in via
   `include::partial$nav-java.adoc[]` at [nav.adoc:346](modules/ROOT/nav.adoc:346), immediately before the
   `*** xref:backend/springboot/index.adoc[SpringBoot Reference]` block — there is no separate `backend/java/`
   nav entry to sit next to. To honor the intended "Java → Hibernate → SpringBoot" reading order without
   inventing a nonexistent file, the new `*** xref:backend/hibernate/index.adoc[...]` block is inserted
   immediately after that `include::partial$nav-java.adoc[]` line and before the SpringBoot block (see Group 4,
   Task 28).
2. **Disclaimer wording.** Modeled on `springboot-disclaimer.adoc` / `couchbase-disclaimer.adoc` structurally
   (official docs are the primary/verified-against source, AI-generated content caveat, a closing pointer to the
   section's Bibliography) but, per the issue's explicit requirement, states directly in its own text — not only
   via the bibliography pointer — that the three local books are bibliography consulted while preparing the
   pages, not the primary source, and that the official documentation wins on any discrepancy.
3. **PDF cheat-sheet build approach.** Following the precedent in `.archive/implementation_plan_70.md` (issue
   #70, the just-merged Elasticsearch Reference section): build a standalone HTML source for the one-page cheat
   sheet, use a headless-browser print-to-PDF (or an equivalent tool already used for the other cheat sheets in
   this repo, e.g. `wkhtmltopdf`/Chromium headless) to render it to a single A4/Letter page, then check in only
   the resulting `modules/ROOT/attachments/hibernate-cheat-sheet.pdf` — the HTML source is a scratch file, not
   committed.
4. **`backend/springboot/index.adoc` Bibliography** already lists the same three Hibernate books (consulted for
   the short `hibernate.adoc` overview). Out of scope to remove/edit — the issue does not ask for that, and the
   two bibliographies serving two different pages independently is consistent with how this repo already
   duplicates book citations across sections that both touch a topic (see `springboot/index.adoc`'s Bibliography
   itself, which cross-cites `spring-data-jpa.adoc`).
5. **Hibernate/Hibernate Search + reactive programming (Task 26), web-researched at the user's request.** The
   original Task 26 briefly mentioned Hibernate Reactive; it is now expanded with specifics on how the
   `Mutiny.SessionFactory` is obtained and used (`withSession`/`withTransaction` as the reactive equivalent of
   `EntityManager` access), how transactions are demarcated programmatically rather than via Spring's
   `ReactiveTransactionManager`, and — the key finding — that Hibernate Reactive binds its session to **the
   current Vert.x `Context`, not Reactor's own `Context`**, which is a materially different (and easy to get
   wrong) propagation model from the one this repo's own
   `xref:backend/springboot/reactive-programming.adoc[Reactive Programming with Project Reactor]` page already
   documents for Spring's reactive transactions. It also documents the `io.smallrye.reactive:mutiny-reactor`
   bridge for converting `Uni`/`Multi` to `Mono`/`Flux`, and states plainly — sourced from the Hibernate team's
   own confirmation — that **Hibernate Search does not support Hibernate Reactive** (tracked as the still-open
   HSEARCH-4922), so a Hibernate-Reactive-based service doing full-text search must call Elasticsearch/OpenSearch
   directly rather than through Hibernate Search's ORM mapper. See Task 26's own "Research grounding" note for
   the specific sources cited.

## Current code state

- This repo is a pure Antora playbook/root-component repo (`modules/ROOT/`) — no application source code.
- `modules/ROOT/pages/backend/index.adoc` is the *Backend Development* landing page; its `== Sections` list
  currently has two bullets: `programming-languages/java/index.adoc[Java Reference]` and
  `backend/springboot/index.adoc[SpringBoot Reference]`.
- `modules/ROOT/pages/backend/springboot/` is the pattern to mirror exactly:
  - `index.adoc` — disclaimer include, lead paragraph, `== What's covered` grouped by subsection with one bullet
    per page, `== Bibliography` (official docs subsection, then local-books subsection) as the *only* place any
    source is named.
  - `modules/ROOT/partials/springboot-disclaimer.adoc` — an `[IMPORTANT]`/`====` admonition: what's documented
    and against which version/source, the AI-generation caveat, a pointer to the section's Bibliography anchor.
  - `cheat-sheet.adoc` — disclaimer include, intro paragraph, grouped `xref:` back-links to every page, ending
    with `xref:attachment$springboot-cheat-sheet.pdf[Download the ... Cheat Sheet (PDF)]`.
  - `hibernate.adoc` ([backend/springboot/hibernate.adoc](modules/ROOT/pages/backend/springboot/hibernate.adoc))
    — the short conceptual overview to cross-link from the new section rather than duplicate: paradigm mismatch,
    `EntityManagerFactory`/`EntityManager`, entity lifecycle + Mermaid state diagram, dirty checking/flush,
    mapping essentials, N+1/fetching/caching, querying options, schema generation vs. migrations, Spring Boot
    integration (`spring-boot-starter-data-jpa`, `open-in-view`), a worked `Book`/`BookQueryRepository` example.
    Its last line under "Spring Boot integration" reads "A dedicated in-depth Hibernate guide will follow." —
    this becomes an `xref:` in Group 4.
  - `spring-data-jpa.adoc` — the repository-level API (`JpaRepository`, derived queries, `@Query`,
    Specifications, projections, `@Transactional`, `@Version`, auditing, `JdbcClient`) that the new section's
    querying/locking pages should reference rather than repeat.
  - `transaction-isolation-and-locking.adoc`, `elasticsearch.adoc`, `caching.adoc`, `reactive-programming.adoc` —
    cross-link targets named explicitly in the issue for the locking/transactions, Hibernate Search, second-level
    cache, and Hibernate Reactive pages respectively.
- `modules/ROOT/pages/database/schema-evolution/index.adoc` — migrations reference for
  `schema-generation-and-tooling.adoc` to cross-link.
- `modules/ROOT/nav.adoc` — the SpringBoot block runs [nav.adoc:345-381](modules/ROOT/nav.adoc:345), directly
  preceded by `include::partial$nav-java.adoc[]` at line 346 (which is where Java Reference's own nav entries
  live, pulled in from a partial rather than inlined here).
- `modules/ROOT/attachments/` — flat directory of checked-in `*-cheat-sheet.pdf` files (e.g.
  `springboot-cheat-sheet.pdf`), linked via `xref:attachment$<name>.pdf[...]`. No HTML sources are checked in.
- `modules/ROOT/images/` — flat directory of hand-authored SVG figures per technology, named `<tech>-*.svg`
  (e.g. `couchbase-embed-vs-reference.svg`, `aspnet-di-lifetimes.svg`).
- **Directly relevant precedent**: `.archive/implementation_plan_70.md` — the just-completed plan for issue #70
  ("Elasticsearch Reference" under Database Development), which used this exact same four-group structure
  (scaffolding → content pages → cheat sheet → wiring/build) for a section of comparable size (22 content
  pages). Reused here for grouping, conventions, and the PDF build approach.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:` (comma-separated), blank line, then
  `include::partial$hibernate-disclaimer.adoc[]`, then a one/two-sentence lead.
- **Example-driven.** Every distinct concept gets at least one runnable `[source,java]` example (Jakarta
  Persistence annotations / `EntityManager` / HQL as appropriate) **and** at least one inline link to the
  specific official documentation page it demonstrates (Hibernate ORM User Guide section, Jakarta Persistence
  spec section, Hibernate Search reference section, etc.) placed next to the example or the statement it
  supports.
- **No source is ever named in an admonition or in prose as "what this was written from."** Source attribution
  lives **only** in `index.adoc`'s `== Bibliography` and in the disclaimer partial's own framing. Linking a
  specific official doc page for further detail is fine and expected.
- **Concept pages never carry their own `== References`/`== Bibliography` heading** and never name, cite, or
  quote the three local books (`~/Desktop/hibernate1.pdf`–`hibernate3.pdf` in the issue; not present in this
  repo checkout — cite them by title/author/ISBN in `index.adoc`'s Bibliography only, as the SpringBoot
  Bibliography already does).
- **Namespace**: use `jakarta.persistence.*` throughout (never `javax.persistence`); Hibernate ORM 7.4.x /
  Jakarta Persistence 3.2 baseline.
- **Diagrams**: `[mermaid]` for state/sequence/flow diagrams; hand-authored inline SVG under
  `modules/ROOT/images/hibernate-*.svg` for spatial/comparison figures where a diagram is clearer than a code
  block or table; skip a diagram if the concept doesn't need one.
- **Cross-links** (do not duplicate; deepen and link back instead):
  - `locking.adoc`, `transactions.adoc` → `xref:backend/springboot/transaction-isolation-and-locking.adoc[...]`.
  - `hql-jpql.adoc`, `criteria-api.adoc` → `xref:backend/springboot/spring-data-jpa.adoc[...]` (`@Query` /
    Specifications sections).
  - `hibernate-search-fundamentals.adoc`, `hibernate-search-backends.adoc` →
    `xref:backend/springboot/elasticsearch.adoc[...]`.
  - `second-level-cache.adoc` → `xref:backend/springboot/caching.adoc[...]`.
  - `reactive-and-data-repositories.adoc` → `xref:backend/springboot/reactive-programming.adoc[...]`.
  - `schema-generation-and-tooling.adoc` → `xref:database/schema-evolution/index.adoc[...]`.
  - `validation-with-hibernate-validator.adoc` → `xref:backend/springboot/rest-apis.adoc[...]`.
  - `events-interceptors-and-filters.adoc`, `envers-auditing.adoc` note how they differ from Spring Data's own
    auditing (`spring-data-jpa.adoc`) without repeating its mechanics.
  - Link sibling Hibernate pages with `xref:backend/hibernate/<page>.adoc[...]` rather than repeating material
    already covered elsewhere in the section.
- Every page must be reachable from both `modules/ROOT/pages/backend/hibernate/index.adoc` and
  `modules/ROOT/nav.adoc` once Group 4 lands.
- **Escape literal `{ }` in prose** as `\{ ... }` (AsciiDoc attribute-reference gotcha).

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Hibernate disclaimer partial — `modules/ROOT/partials/hibernate-disclaimer.adoc`
  - [x] Task 1.1. Authored as an `[IMPORTANT]`/`====` admonition modeled on `springboot-disclaimer.adoc`.
  - [x] Task 1.2. Include line confirmed: `include::partial$hibernate-disclaimer.adoc[]`.

### Group 2 — Content pages

**Parallelizable: yes** — 26 independent pages (Tasks 2–27). Each includes the Group 1 disclaimer partial and
may `xref:` sibling pages created in this same group or existing `backend/springboot/*` pages; none of these
cross-links block another page's own authoring, and the consolidated Antora build check happens once, in Group 4.

**Getting started**

- [x] Task 2. Create `modules/ROOT/pages/backend/hibernate/getting-started.adoc`
  - [x] Task 2.1. Cover: what Hibernate is and its relationship to JPA/Jakarta Persistence 3.2; the
    `javax.persistence` → `jakarta.persistence` namespace change; adding Hibernate to a Maven/Gradle build
    (`hibernate-core`, the `hibernate-platform` BOM); `persistence.xml` vs. programmatic bootstrap; a "Hello,
    Hibernate" example (`EntityManagerFactory`/`SessionFactory`); `hibernate.properties` and the most-used
    settings; logging generated SQL; the ORM 7.4 / JPA 3.2 version baseline.
  - [x] Task 2.2. Link the User Guide "Preface"/"Compatibility"/"Bootstrap" sections, the Introduction ch. 1–2,
    and the Getting Started Guide.

**Architecture & domain model**

- [x] Task 3. Create `modules/ROOT/pages/backend/hibernate/architecture.adoc`
  - [x] Task 3.1. Cover: the object/relational paradigm mismatch (deeper than
    `xref:backend/springboot/hibernate.adoc[...]` — granularity, inheritance, identity, associations,
    navigation); Hibernate's layered architecture relative to JDBC/JTA; `SessionFactory`/`Session` vs.
    `EntityManagerFactory`/`EntityManager`; `StatelessSession`; persistence units; dialects.
  - [x] Task 3.2. Add a `[mermaid]` architecture diagram (application → JPA/native API → persistence context →
    JDBC → database, with `SessionFactory`/`Session` lifetimes annotated).
- [x] Task 4. Create `modules/ROOT/pages/backend/hibernate/entities-and-identifiers.adoc`
  - [x] Task 4.1. Cover: `@Entity`/`@Table`, field vs. property access, `@Id`, `@GeneratedValue` strategies
    (`IDENTITY`/`SEQUENCE`/`TABLE`/UUID/custom generators), composite keys (`@IdClass`/`@EmbeddedId`),
    `@NaturalId`, derived identity (`@MapsId`), `equals()`/`hashCode()` guidance for entities.
- [x] Task 5. Create `modules/ROOT/pages/backend/hibernate/basic-and-embeddable-types.adoc`
  - [x] Task 5.1. Cover: `@Basic` and column mapping, `@Enumerated`, `AttributeConverter` (`@Converter`),
    `@Embeddable`/`@Embedded` and `@AttributeOverride`, mapping to JSON/UDTs, LOBs, date/time types and time
    zones, `@Nationalized`, `@Immutable`.
- [x] Task 6. Create `modules/ROOT/pages/backend/hibernate/associations.adoc`
  - [x] Task 6.1. Cover: `@ManyToOne`, `@OneToMany`, `@OneToOne` (shared PK via `@MapsId`, both directions),
    `@ManyToMany` + `@JoinTable`; owning vs. inverse side (`mappedBy`); `@JoinColumn`; bidirectional-sync helper
    methods; `CascadeType`, orphan removal, `@OnDelete`.
  - [x] Task 6.2. Add a `[mermaid]` or SVG (`hibernate-object-graph-vs-foreign-keys.svg`) diagram of a small
    mapped object graph vs. its foreign keys.
- [x] Task 7. Create `modules/ROOT/pages/backend/hibernate/collections.adoc`
  - [x] Task 7.1. Cover: `List`/`Set`/`Map`/sorted collections; `@ElementCollection` of basics and embeddables;
    `@OrderColumn`/`@OrderBy`/`@MapKey*`; bag vs. list semantics and their performance trade-offs; collections
    mapped to SQL arrays; `@SortNatural`/`@SortComparator`.
- [x] Task 8. Create `modules/ROOT/pages/backend/hibernate/inheritance-mapping.adoc`
  - [x] Task 8.1. Cover: `SINGLE_TABLE` (`@DiscriminatorColumn`/`@DiscriminatorValue`/`@DiscriminatorFormula`),
    `JOINED`, `TABLE_PER_CLASS`, `@MappedSuperclass`; polymorphic queries and their SQL cost. Cross-link
    `xref:backend/springboot/spring-data-jpa.adoc[...]`'s inheritance section.
  - [x] Task 8.2. Add a `[mermaid]` or SVG (`hibernate-inheritance-strategies.svg`) comparing the three table
    shapes side by side.

**The persistence context**

- [x] Task 9. Create `modules/ROOT/pages/backend/hibernate/persistence-context-and-lifecycle.adoc`
  - [x] Task 9.1. Cover: the persistence context as identity map + first-level cache; the four entity states
    (transient/managed/detached/removed) with a `[mermaid] stateDiagram-v2` (a fuller version of the one already
    in `backend/springboot/hibernate.adoc`); `persist`/`find`/`getReference`/`merge`/`remove`/`refresh`/`detach`/
    `clear`; a `merge` semantics deep-dive; cascading; exception handling (`OptimisticLockException`,
    `StaleObjectStateException`, `LazyInitializationException`).
- [x] Task 10. Create `modules/ROOT/pages/backend/hibernate/flushing-and-dirty-checking.adoc`
  - [x] Task 10.1. Cover: automatic dirty checking and the load-time snapshot; flush modes
    (`AUTO`/`COMMIT`/`ALWAYS`/`MANUAL`); flush ordering; auto-flush before queries; `@DynamicUpdate`/
    `@DynamicInsert`.
- [x] Task 11. Create `modules/ROOT/pages/backend/hibernate/transactions.adoc`
  - [x] Task 11.1. Cover: resource-local vs. JTA; the Hibernate transaction API; session-per-request/contextual
    sessions; rollback handling and its interaction with the persistence context.
  - [x] Task 11.2. Cross-link `xref:backend/springboot/transaction-isolation-and-locking.adoc[...]` for where
    Spring's `@Transactional` fits, rather than re-explaining isolation levels.
- [x] Task 12. Create `modules/ROOT/pages/backend/hibernate/locking.adoc`
  - [x] Task 12.1. Cover: optimistic locking (`@Version`, `OPTIMISTIC`/`OPTIMISTIC_FORCE_INCREMENT`,
    `@OptimisticLocking`/`@OptimisticLock` dirty-vs-all, versionless), pessimistic locking
    (`PESSIMISTIC_READ`/`PESSIMISTIC_WRITE`/`PESSIMISTIC_FORCE_INCREMENT`), `LockModeType`, lock scope/timeout
    hints, `Session.lock()`/`find(..., LockModeType)`.
  - [x] Task 12.2. Cross-link `xref:backend/springboot/transaction-isolation-and-locking.adoc[...]` rather than
    re-explaining isolation levels.
- [x] Task 13. Create `modules/ROOT/pages/backend/hibernate/fetching-and-n-plus-1.adoc`
  - [x] Task 13.1. Cover: lazy vs. eager and the JPA defaults; proxies and bytecode enhancement;
    `LazyInitializationException` and open-session-in-view; `JOIN FETCH`; `@EntityGraph`/named entity
    graphs/named fetch profiles; `@BatchSize`/`hibernate.default_batch_fetch_size`; subselect fetching;
    `@Fetch(SELECT | JOIN | SUBSELECT)`; DTO projections to avoid loading entities. Deepen (don't duplicate)
    `xref:backend/springboot/hibernate.adoc[...]`'s existing N+1 section.
  - [x] Task 13.2. Add a `[mermaid]` sequence diagram of the N+1 query blow-up and its `IN`-batch fix.

**Querying**

- [x] Task 14. Create `modules/ROOT/pages/backend/hibernate/hql-jpql.adoc`
  - [x] Task 14.1. Cover: HQL as a superset of JPQL; statement types; `FROM`/`JOIN` (explicit, implicit, `WITH`/
    `ON`); functions and predicates; projections and `SELECT new` DTO queries; `UNION`/`INTERSECT`/`EXCEPT`;
    aggregation and grouping; the `Query` API; parameters; pagination (`setFirstResult`/`setMaxResults`,
    `Limit`, key-based pagination); `@NamedQuery`; scrolling and streaming; `hibernate.query.*` settings.
  - [x] Task 14.2. Cross-link `xref:backend/springboot/spring-data-jpa.adoc[...]`'s `@Query` section — this page
    goes deeper on HQL/JPQL syntax itself rather than repository wiring.
- [x] Task 15. Create `modules/ROOT/pages/backend/hibernate/criteria-api.adoc`
  - [x] Task 15.1. Cover: `CriteriaBuilder`/`CriteriaQuery`/`Root`; the JPA static metamodel (`Entity_` classes,
    the annotation processor); joins and fetch joins; parameters and predicates;
    `SelectionSpecification`/`MutationSpecification` (programmatic query specification) and the
    `HibernateCriteriaBuilder` extensions; composing a query from runtime conditions.
  - [x] Task 15.2. Cross-link `xref:backend/springboot/spring-data-jpa.adoc[...]`'s Specifications section.
- [x] Task 16. Create `modules/ROOT/pages/backend/hibernate/native-sql-and-stored-procedures.adoc`
  - [x] Task 16.1. Cover: `createNativeQuery`, `@SqlResultSetMapping` (entity/scalar/DTO results),
    `@NamedNativeQuery`, `@Subselect`/`@Formula`, `StoredProcedureQuery`/`@NamedStoredProcedureQuery`, when to
    drop to raw SQL.
- [x] Task 17. Create `modules/ROOT/pages/backend/hibernate/bulk-operations-and-batching.adoc`
  - [x] Task 17.1. Cover: JDBC batching (`hibernate.jdbc.batch_size`, ordered inserts/updates); `StatelessSession`
    for ETL-style work; HQL bulk `UPDATE`/`DELETE`/`INSERT ... SELECT`; the `flush()`/`clear()` loop pattern for
    large imports; why bulk HQL bypasses the persistence context and second-level cache.

**Caching, events & advanced mapping**

- [x] Task 18. Create `modules/ROOT/pages/backend/hibernate/second-level-cache.adoc`
  - [x] Task 18.1. Cover: first-level cache recap; second-level cache architecture; providers (JCache/Caffeine,
    Infinispan, Ehcache, Redis); `@Cache` and `CacheConcurrencyStrategy`
    (`READ_ONLY`/`NONSTRICT_READ_WRITE`/`READ_WRITE`/`TRANSACTIONAL`); entity/collection/natural-id caching; the
    query cache and its pitfalls; `CacheMode`/`SharedCacheMode`; cache regions and statistics.
  - [x] Task 18.2. Cross-link `xref:backend/springboot/caching.adoc[...]` to contrast with Spring's own
    `@Cacheable`. Add a `[mermaid]` diagram of the first-level/second-level cache layering.
- [x] Task 19. Create `modules/ROOT/pages/backend/hibernate/events-interceptors-and-filters.adoc`
  - [x] Task 19.1. Cover: JPA lifecycle callbacks (`@PrePersist`, etc.) and entity listeners; the Hibernate
    `Interceptor`; the native event system (`EventType`, `PreInsertEventListener`, etc.) and `Integrator`;
    dynamic data filters (`@FilterDef`/`@Filter`); soft delete (`@SoftDelete`).
- [x] Task 20. Create `modules/ROOT/pages/backend/hibernate/schema-generation-and-tooling.adoc`
  - [x] Task 20.1. Cover: `hibernate.hbm2ddl.auto` (`none`/`validate`/`update`/`create`/`create-drop`) and the
    `jakarta.persistence.schema-generation.*` settings; `import.sql` and ordered init scripts;
    `@Check`/`@ColumnDefault`/`@Index`/`@UniqueConstraint`; the Gradle/Maven plugins (bytecode enhancement,
    static metamodel generation, schema management); Hibernate Tools reverse engineering.
  - [x] Task 20.2. Include a strong "migrations own the schema in staging/production; use `validate`" note that
    cross-links `xref:database/schema-evolution/index.adoc[...]`.
- [x] Task 21. Create `modules/ROOT/pages/backend/hibernate/envers-auditing.adoc`
  - [x] Task 21.1. Cover: `@Audited`; the `_AUD` tables and `REVINFO`; `AuditReader` queries; custom revision
    entities (`@RevisionEntity`/`@RevisionNumber`/`@RevisionTimestamp`); `ValidityAuditStrategy` vs. the
    default; conditional auditing.
  - [x] Task 21.2. Note how this differs from Spring Data's `@CreatedDate`/`@LastModifiedBy` auditing, with a
    cross-link to `xref:backend/springboot/spring-data-jpa.adoc[...]`.
- [x] Task 22. Create `modules/ROOT/pages/backend/hibernate/multitenancy.adoc`
  - [x] Task 22.1. Cover: separate-database, separate-schema, and discriminator approaches;
    `CurrentTenantIdentifierResolver` + `MultiTenantConnectionProvider`; `@TenantId`; second-level-cache
    considerations; a Spring Boot wiring note.
  - [x] Task 22.2. Add a `[mermaid]` or SVG (`hibernate-multitenancy-strategies.svg`) comparing the three
    approaches.

**Performance & the wider Hibernate ecosystem**

- [x] Task 23. Create `modules/ROOT/pages/backend/hibernate/performance-and-statistics.adoc`
  - [x] Task 23.1. Cover: the User Guide's performance checklist distilled; the `Statistics` API and
    `hibernate.generate_statistics`; the slow-query log
    (`hibernate.session.events.log.LOG_QUERIES_SLOWER_THAN_MS`); Java Flight Recorder events; connection-pool
    tuning; common anti-patterns (open-session-in-view, eager fetching everywhere, entity-instead-of-DTO,
    `@OneToMany` with no `@BatchSize`).
  - [x] Task 23.2. Cross-link `xref:backend/springboot/metrics-and-observability.adoc[...]`.
- [x] Task 24. Create `modules/ROOT/pages/backend/hibernate/hibernate-search-fundamentals.adoc`
  - [x] Task 24.1. Cover: what Hibernate Search adds (keeps a full-text index in sync with mapped ORM entities,
    exposes a Hibernate-style search DSL over the same domain model); `@Indexed`,
    `@FullTextField`/`@KeywordField`/`@GenericField`, `@IndexedEmbedded`, analyzers/normalizers, automatic vs.
    explicit indexing, the `MassIndexer`, mapping bridges; the search DSL (`search()`, `where`,
    `predicate`/`sort`/`aggregation`, projections).
  - [x] Task 24.2. Cross-link `xref:backend/springboot/elasticsearch.adoc[...]` for inverted-index/analyzer/BM25
    background rather than repeating it.
- [x] Task 25. Create `modules/ROOT/pages/backend/hibernate/hibernate-search-backends.adoc`
  - [x] Task 25.1. Cover the Lucene backend (embedded, in-JVM, per-node local filesystem index — does **not**
    scale horizontally: each application instance keeps its own drifting copy, no shared near-real-time refresh,
    a full reindex has to run per node) vs. the Elasticsearch/OpenSearch backend (recommended for any
    multi-instance/scaled-out deployment — shared cluster, scales independently of the application). Cover
    backend selection/configuration, coordination strategies (`none` vs. `outbox-polling` for multi-node
    automatic indexing), sync vs. async index writes, sharding/replicas on the Elasticsearch side, Spring Boot
    configuration.
  - [x] Task 25.2. Add a `[mermaid]` or SVG (`hibernate-search-lucene-vs-elasticsearch.svg`) contrasting a
    single-node embedded Lucene index with a shared Elasticsearch cluster behind several application instances
    — this is an explicit acceptance-criterion diagram.
- [x] Task 26. Create `modules/ROOT/pages/backend/hibernate/reactive-and-data-repositories.adoc`

  **Research grounding (web-researched for this task -- cite these, don't reinvent them):**
  https://docs.hibernate.org/reactive/[the Hibernate Reactive reference documentation] (session/transaction
  semantics), https://hantsy.github.io/spring-puzzles/hibernate-reactive.html[Hantsy Bai's "Integrating
  Hibernate Reactive with Spring"] (Spring bean wiring + `mutiny-reactor` bridging pattern),
  https://smallrye.io/smallrye-mutiny/guides/converters/[the SmallRye Mutiny "Using other reactive programming
  libraries" guide] (the exact `UniReactorConverters`/`MultiReactorConverters` API), and
  https://discourse.hibernate.org/t/integration-with-hibernate-reactive/6868[the Hibernate team's own
  confirmation that Hibernate Search does not support Hibernate Reactive] (tracked as
  https://hibernate.atlassian.net/browse/HSEARCH-4922[HSEARCH-4922], still open, no committed timeline).

  - [x] Task 26.1. **Hibernate Reactive fundamentals.** Cover the two async APIs (the recommended Mutiny-based
    `Mutiny.SessionFactory`/`Mutiny.Session`, vs. the legacy `Stage.SessionFactory` `CompletionStage`-based one);
    that it requires a genuinely non-blocking **Vert.x reactive SQL client** per database (PostgreSQL, MySQL,
    DB2, SQL Server, Oracle, CockroachDB) **instead of a JDBC driver** -- there is no JDBC `DataSource`
    underneath -- and that **it is not supported by Spring Data** (no `ReactiveCrudRepository`-style abstraction
    exists for it). Show obtaining the `Mutiny.SessionFactory`: unwrap it from a JPA `EntityManagerFactory` built
    with the `org.hibernate.reactive.provider.ReactivePersistenceProvider` persistence provider
    (`Persistence.createEntityManagerFactory("unitName").unwrap(Mutiny.SessionFactory.class)`), exposed as a
    Spring `@Bean`.
  - [x] Task 26.2. **Accessing the session/entity manager reactively.**
    `Mutiny.SessionFactory.withSession(Function<Mutiny.Session, Uni<T>> work)` opens (or reuses) a
    `Mutiny.Session` for read/non-transactional work; `withTransaction(BiFunction<Mutiny.Session,
    Mutiny.Transaction, Uni<T>> work)` does the same within a transaction. Both return the `Uni<T>` produced by
    the callback -- unlike blocking Hibernate's `@PersistenceContext EntityManager em`, there is no standalone
    "get me a session" call: the session exists only for the duration of the callback's `Uni`. A nested
    `withSession`/`withTransaction` call inside an already-open one reuses the same session rather than opening a
    second one.
  - [x] Task 26.3. **How the session is bound to the current unit of work -- and why this differs from Reactor.**
    State explicitly, citing the Hibernate Reactive reference documentation, that `withSession()`/
    `withTransaction()` associate the reactive session with **the current Vert.x (duplicated) `Context`**, *not*
    a Reactor `Context` and *not* a `ThreadLocal`. All Hibernate Reactive calls must run on a Vert.x event-loop
    thread; calling from any other thread fails with `HR000068: This method should exclusively be invoked from a
    Vert.x EventLoop thread`. Contrast this directly with
    `xref:backend/springboot/reactive-programming.adoc#reactive-transactions-and-thread-affinity[Reactive
    transactions and thread affinity]`, which documents how Spring's own `ReactiveTransactionManager` rides the
    **Reactor** `Context` instead: the two mechanisms look similar (state that survives thread hops, scoped to
    one unit of work rather than one thread) but are two independent context-propagation systems that share no
    state. A Reactor pipeline calling into Hibernate Reactive crosses a real context boundary at that call, even
    though no explicit `.subscribe()` is written -- the "don't break the chain" rules on that page are about
    Reactor's own `Context` and say nothing, by themselves, about the Vert.x `Context` Hibernate Reactive needs.
  - [x] Task 26.4. **Transaction handling.** `withTransaction((session, tx) -> ...)` demarcates the transaction
    **programmatically, not declaratively**: it begins a transaction, runs the callback, and commits when the
    returned `Uni` completes successfully, or rolls back if it completes with a failure (including an exception
    thrown synchronously inside the callback) -- conceptually the Mutiny counterpart of
    `TransactionalOperator.transactional(...)`, but **there is no `ReactiveTransactionManager` implementation for
    Hibernate Reactive**, and Spring's declarative `@Transactional` on a method returning a `Publisher` does not
    apply to it. Worked example:
    ```java
    public Uni<Order> placeOrder(Order order) {
        return sessionFactory.withTransaction((session, tx) ->
                session.persist(order).chain(session::flush).replaceWith(order));
    }
    ```
  - [x] Task 26.5. **Bridging `Uni`/`Multi` to `Mono`/`Flux`.** The `io.smallrye.reactive:mutiny-reactor` Maven
    artifact provides `UniReactorConverters`/`MultiReactorConverters`:
    `uni.convert().with(UniReactorConverters.toMono())` and
    `multi.convert().with(MultiReactorConverters.toFlux())` for the Hibernate-Reactive-to-Spring direction; plain
    Reactive-Streams interop -- `Uni.createFrom().publisher(mono)` / `Multi.createFrom().publisher(flux)` -- for
    the reverse direction, no extra dependency needed. Show a WebFlux controller/repository method returning the
    converted `Mono`/`Flux` directly. Note that the `mutiny-reactor` bridge converts only the *value* stream -- it
    does **not** carry Reactor `Context` into the Mutiny side or vice versa (see Task 26.3); anything read from
    Reactor `Context` upstream of the conversion must be passed into the Hibernate Reactive call explicitly (e.g.
    as a method parameter), never assumed to cross the bridge implicitly.
  - [x] Task 26.6. **Running under Spring WebFlux specifically.** The Vert.x `Context` requirement is independent
    of which HTTP server WebFlux uses: Spring WebFlux's default Reactor Netty server does not itself provide a
    Vert.x event loop, so an application embeds/starts its own `io.vertx.core.Vertx` instance and runs Hibernate
    Reactive calls on it (e.g. via `vertx.getOrCreateContext()` / `Vertx.currentContext().runOnContext(...)`)
    rather than assuming the WebFlux request thread already is one. Mention
    https://quarkus.io/guides/hibernate-reactive[Quarkus's Hibernate Reactive guide] only as a contrast (Quarkus
    wires this automatically because it runs on Vert.x natively) -- do not present Quarkus as part of this
    section's own stack.
  - [x] Task 26.7. **Hibernate Data Repositories** -- the Jakarta Data `@Repository` model, implementations
    generated at compile time by `HibernateProcessor`, `@Find`/`@Query`/`@HQL`/`@SQL` methods,
    `StatelessSession`-based. State plainly that **this is the blocking-Hibernate-ORM Jakarta Data
    implementation, not Hibernate Reactive**, with a short note on how it differs in intent from Spring Data
    JPA.
  - [x] Task 26.8. **Hibernate Search does not support Hibernate Reactive.** State this explicitly and cite it:
    per the Hibernate team, `hibernate-search-mapper-orm` does not work with Hibernate Reactive, and there is no
    officially supported or planned reactive Hibernate Search integration -- tracked as the still-open feature
    request https://hibernate.atlassian.net/browse/HSEARCH-4922[HSEARCH-4922] (see also
    https://discourse.hibernate.org/t/integration-with-hibernate-reactive/6868[the Hibernate team's own
    confirmation on the Hibernate community forum]). For full-text search from a Hibernate-Reactive-based
    service, call Elasticsearch/OpenSearch directly with a non-blocking client instead of going through Hibernate
    Search's ORM mapper -- cross-link `xref:backend/hibernate/hibernate-search-backends.adoc[...]` (explicitly
    noting it is blocking-Hibernate-only) and `xref:backend/springboot/elasticsearch.adoc[...]` for the reactive
    Elasticsearch client / Spring Data Elasticsearch reactive path.
  - [x] Task 26.9. Cross-link `xref:backend/springboot/reactive-programming.adoc[...]`, anchored specifically at
    `#reactive-transactions-and-thread-affinity` (per Task 26.3) and at `#bridging-to-blocking-code-safely` for
    the general principle it already establishes -- that a hard technology boundary (there: a blocking call;
    here: a different reactive runtime's own context) must be crossed deliberately and explicitly, never
    assumed.
  - [x] Task 26.10. Add a `[mermaid]` sequence/flow diagram: a WebFlux controller's Reactor chain --
    `Uni.createFrom().publisher(...)` into a Vert.x-context-bound `Mutiny.Session`/`Mutiny.Transaction` -- the
    Vert.x reactive SQL client -- the database, with the `Uni` result converted back to `Mono` via
    `UniReactorConverters.toMono()` -- visually marking the Reactor-Context/Vert.x-Context boundary at the
    crossing point.
- [x] Task 27. Create `modules/ROOT/pages/backend/hibernate/validation-with-hibernate-validator.adoc`
  - [x] Task 27.1. Cover: Jakarta Validation via Hibernate Validator (its reference implementation); built-in
    constraints; `@Valid` cascading; custom `ConstraintValidator`s; constraint groups; method-level validation;
    how it plugs into JPA (`pre-persist`/`pre-update` validation) and into Spring MVC (`@Validated`,
    `MethodArgumentNotValidException` → `ProblemDetail`).
  - [x] Task 27.2. Cross-link `xref:backend/springboot/rest-apis.adoc[...]`.

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 29 renders the PDF that Task 28's page links, and Task 28's back-links reference
every Group 2 page, so this group runs after Group 2 completes.

- [x] Task 28. Create `modules/ROOT/pages/backend/hibernate/cheat-sheet.adoc`
  - [x] Task 28.1. Header + disclaimer include + a short intro paragraph, modeled on
    `backend/springboot/cheat-sheet.adoc`, describing this as a single-page, printable summary of every concept
    page in the section.
  - [x] Task 28.2. Grouped `xref:` back-links to all 26 Group 2 pages, using the same subsection groupings as
    `index.adoc`'s "What's covered" (Getting started; Architecture & domain model; The persistence context;
    Querying; Caching, events & advanced mapping; Performance & the wider Hibernate ecosystem).
  - [x] Task 28.3. End with `xref:attachment$hibernate-cheat-sheet.pdf[Download the Hibernate Cheat Sheet (PDF)]`.
- [x] Task 29. Build `modules/ROOT/attachments/hibernate-cheat-sheet.pdf`
  - [x] Task 29.1. Author a scratch HTML source (not committed) laying out a colour-coded, single-page summary
    covering every concept page: entity lifecycle states, `@GeneratedValue` strategies, association/cascade
    annotations, inheritance strategies, locking modes, HQL/JPQL vs. Criteria vs. native-SQL decision guide,
    caching layers and `CacheConcurrencyStrategy` values, key `hibernate.*`/`jakarta.persistence.*` settings,
    Hibernate Search annotations and the Lucene-vs-Elasticsearch backend choice, and the Hibernate
    Reactive/Data-Repositories/Validator one-liners.
  - [x] Task 29.2. Render it to a single A4 (or Letter, matching the existing cheat sheets' page size) PDF page
    with no clipped content, using the same tool/approach as the other checked-in cheat sheets in this repo
    (inspect `modules/ROOT/attachments/springboot-cheat-sheet.pdf` and any build script/README note describing
    how it and the Elasticsearch cheat sheet from issue #70 were produced; fall back to a headless-Chromium
    print-to-PDF of the scratch HTML if no dedicated tool is found).
  - [x] Task 29.3. Copy the rendered PDF to `modules/ROOT/attachments/hibernate-cheat-sheet.pdf`. Do **not**
    check in the HTML source.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 30–34 each edit a shared wiring file and Task 35 builds on all prior groups; the
build must run last.

- [x] Task 30. Create `modules/ROOT/pages/backend/hibernate/index.adoc`
  - [x] Task 30.1. Header (`= Hibernate Reference`, `:description:`, `:keywords:`) +
    `include::partial$hibernate-disclaimer.adoc[]` + a lead paragraph introducing Hibernate ORM as the reference
    Jakarta Persistence provider, noting this section is framework-agnostic (plain Jakarta Persistence/native
    Hibernate, with Spring Boot wiring noted where relevant) and goes deeper than
    `xref:backend/springboot/hibernate.adoc[...]`'s conceptual overview. Point new readers to
    `getting-started.adoc` → `architecture.adoc` → `entities-and-identifiers.adoc` first.
  - [x] Task 30.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped exactly as in
    the issue's proposed page structure: *Getting started*; *Architecture & domain model*; *The persistence
    context*; *Querying*; *Caching, events & advanced mapping*; *Performance & the wider Hibernate ecosystem*;
    *Reference* (cheat sheet).
  - [x] Task 30.3. `== Bibliography` — **the only place any source is named.** Two subsections:
    - *Official documentation (primary source for every page)* — list every URL from the issue's Bibliography
      section verbatim (hibernate.org, the ORM 7.4.x User Guide/Introduction/Getting Started
      Guide/Query Language Guide/Data Repositories Guide/Integration Guide/migration guide/what's-new/Javadoc,
      the Jakarta Persistence 3.2 spec, the Hibernate Search 8.4.x reference + Getting Started, the Hibernate
      Validator reference + Jakarta Validation spec, Hibernate Tools, and the Spring Boot "JPA and Spring Data"
      page as Spring Boot wiring context). Plus, backing Task 26's reactive-and-data-repositories content:
      https://docs.hibernate.org/reactive/[the Hibernate Reactive reference documentation];
      https://smallrye.io/smallrye-mutiny/guides/converters/[the SmallRye Mutiny "Using other reactive
      programming libraries" guide] and the `io.smallrye.reactive:mutiny-reactor` artifact it documents (the
      `Uni`/`Multi` ↔ `Mono`/`Flux` bridge); https://hantsy.github.io/spring-puzzles/hibernate-reactive.html[Hantsy
      Bai's "Integrating Hibernate Reactive with Spring"] (Spring bean wiring precedent); and
      https://hibernate.atlassian.net/browse/HSEARCH-4922[HSEARCH-4922] plus
      https://discourse.hibernate.org/t/integration-with-hibernate-reactive/6868[the Hibernate team's own
      confirmation] as the citation that Hibernate Search does not support Hibernate Reactive.
    - *Local books (bibliography only — consulted while preparing these pages, not the primary source for any
      page; all three predate Jakarta Persistence 3.2 and Hibernate ORM 6/7, so on any discrepancy the official
      documentation above wins)* — the three books from the issue verbatim: Bauer/King/Gregory _Java Persistence
      with Hibernate_ 2nd ed. (Manning, 2016, ISBN 9781617290459); Peak/Heudecker _Hibernate Quickly_ (Manning,
      2006, ISBN 978-1-932394-41-2); Bernard/Griffin _Hibernate Search in Action_ (Manning, 2009, ISBN
      978-1-933988-64-1) — each with its publisher-page URL, as in the issue body and mirroring
      `backend/springboot/index.adoc`'s existing citations of the same three books.
- [x] Task 31. Wire `modules/ROOT/nav.adoc`
  - [x] Task 31.1. Insert a `*** xref:backend/hibernate/index.adoc[Hibernate Reference]` block with one `****`
    line per page **in the section-index order**, **immediately after** `include::partial$nav-java.adoc[]`
    ([nav.adoc:346](modules/ROOT/nav.adoc:346)) and **before**
    `*** xref:backend/springboot/index.adoc[SpringBoot Reference]` ([nav.adoc:347](modules/ROOT/nav.adoc:347)) —
    achieving the issue's intended Java → Hibernate → SpringBoot reading order (see Task summary, choice 1).
    Page order: getting-started, architecture, entities-and-identifiers, basic-and-embeddable-types,
    associations, collections, inheritance-mapping, persistence-context-and-lifecycle,
    flushing-and-dirty-checking, transactions, locking, fetching-and-n-plus-1, hql-jpql, criteria-api,
    native-sql-and-stored-procedures, bulk-operations-and-batching, second-level-cache,
    events-interceptors-and-filters, schema-generation-and-tooling, envers-auditing, multitenancy,
    performance-and-statistics, hibernate-search-fundamentals, hibernate-search-backends,
    reactive-and-data-repositories, validation-with-hibernate-validator, then
    `**** xref:backend/hibernate/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use short link labels (e.g.
    `[Getting Started]`, `[Architecture]`, `[Entities & Identifiers]`, `[Basic & Embeddable Types]`,
    `[Associations]`, `[Collections]`, `[Inheritance Mapping]`, `[Persistence Context & Lifecycle]`,
    `[Flushing & Dirty Checking]`, `[Transactions]`, `[Locking]`, `[Fetching & N+1]`, `[HQL/JPQL]`,
    `[Criteria API]`, `[Native SQL & Stored Procedures]`, `[Bulk Operations & Batching]`, `[Second-Level Cache]`,
    `[Events, Interceptors & Filters]`, `[Schema Generation & Tooling]`, `[Envers Auditing]`, `[Multitenancy]`,
    `[Performance & Statistics]`, `[Hibernate Search Fundamentals]`, `[Hibernate Search Backends]`,
    `[Reactive & Data Repositories]`, `[Validation with Hibernate Validator]`).
- [x] Task 32. Update `modules/ROOT/pages/backend/index.adoc`
  - [x] Task 32.1. Add a `== Sections` bullet between the existing Java Reference and SpringBoot Reference
    bullets: `xref:backend/hibernate/index.adoc[Hibernate Reference] -- Hibernate ORM as the Jakarta Persistence
    provider: entities, associations and inheritance mapping, the persistence context and entity lifecycle,
    locking, fetching and the N+1 problem, HQL/JPQL and the Criteria API, second-level caching, schema
    generation, Envers auditing, multitenancy, Hibernate Search (Lucene vs. Elasticsearch backends), Hibernate
    Reactive and Data Repositories, and Bean Validation with Hibernate Validator, plus a downloadable cheat
    sheet.`
  - [x] Task 32.2. Extend the page `:description:` and `:keywords:` to mention Hibernate/JPA/Jakarta Persistence
    (Hibernate is already present in `:keywords:` from the SpringBoot section — add ORM-specific terms like
    `Hibernate ORM`, `entity lifecycle`, `HQL`, `Criteria API`, `Hibernate Search`, `Envers`).
- [x] Task 33. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 33.1. Add a nested sub-bullet under Backend Development, between the Java Reference and SpringBoot
    Reference lines (mirroring the structure `.archive/implementation_plan_70.md` used for the Elasticsearch
    entry under Database Development): `xref:backend/hibernate/index.adoc[Hibernate Reference] -- Hibernate ORM
    in depth: entities and associations, the persistence context, locking and the N+1 problem, HQL/JPQL and
    Criteria, second-level caching, schema generation, auditing, multitenancy, Hibernate Search, Hibernate
    Reactive and Data Repositories, plus a one-page cheat sheet.`
  - [x] Task 33.2. Update the page `:keywords:` to include Hibernate/JPA terms if not already present.
- [x] Task 34. Update `modules/ROOT/pages/backend/springboot/hibernate.adoc`
  - [x] Task 34.1. Change the "Spring Boot integration" section's closing sentence from "A dedicated in-depth
    Hibernate guide will follow." to
    `A dedicated in-depth Hibernate guide is available at xref:backend/hibernate/index.adoc[Hibernate Reference].`
    Leave the rest of the page's conceptual overview unchanged.
- [x] Task 35. Build & verify
  - [x] Task 35.1. Delegate to a sub-agent (e.g. via `Agent({description: "Build and verify Antora site",
    subagent_type: "iru-gate-runner", prompt: "Run `npx antora antora-playbook.yml` in
    /Users/airurueta/irurueta2/common/docs. Report any xref/AsciiDoc/missing-image/mermaid errors or 'skipping
    reference to missing attribute' warnings, with file:line for each."})`, if `iru-gate-runner` is installed
    (confirmed present in `.claude/agents/`) — otherwise an equivalent generic sub-agent — so the build log
    doesn't consume the main context window. Fix any reported error/warning introduced by the new pages until
    the build completes clean.
  - [x] Task 35.2. Confirm every new page is reachable from both
    `modules/ROOT/pages/backend/hibernate/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/backend/hibernate/...` HTML renders (spot-check a page with a `[mermaid]` diagram and one with
    an SVG), and that `xref:attachment$hibernate-cheat-sheet.pdf` resolves to the checked-in PDF.
  - [x] Task 35.3. Re-open `modules/ROOT/attachments/hibernate-cheat-sheet.pdf` and confirm it is a single
    printable page with no clipped content.
  - [x] Task 35.4. Grep the new pages for any admonition (`[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`,
    `[CAUTION]`) or `== References`/`== Bibliography` heading and confirm none names _Java Persistence with
    Hibernate_, _Hibernate Quickly_, _Hibernate Search in Action_, "the book(s)", "consulted", or "the sources" —
    all source attribution must live only in `index.adoc`'s `== Bibliography` (per the issue's explicit
    acceptance criterion and choice 4 above).
  - [x] Task 35.5. Confirm `backend/springboot/hibernate.adoc`'s updated closing line renders correctly and the
    `xref:backend/hibernate/index.adoc[...]` link resolves.
