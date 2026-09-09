# Implementation Plan: SpringBoot Reference — MongoDB Atlas Search

## Task summary

Source: GitHub issue #93

Add **one new overview page**, `modules/ROOT/pages/backend/springboot/mongodb-atlas-search.adoc`, to the
existing **SpringBoot Reference** section, explaining how to build Elasticsearch/Solr-style full-text search
(fuzzy matching, faceting, projection/stored fields, per-language analyzers, stemming, n-grams) using **MongoDB
Atlas Search**, its Spring Data MongoDB integration path, and how it compares feature-by-feature to Elasticsearch
and Apache Solr. The page must state prominently, up front, that Atlas Search is a **cloud-only managed
service** — it cannot be run or tested locally/on-premises, unlike Elasticsearch/Solr. Then wire the page into
`nav.adoc` and the section landing page `backend/springboot/index.adoc`.

### Choices made on the user's behalf (confirmed by the user during planning, or best-practice defaults)

1. **Nav/index placement — confirmed by user**: insert immediately **after** `solr.adoc` and before
   `spring-batch.adoc`, keeping the three search-technology pages (Elasticsearch, Solr, MongoDB Atlas Search)
   contiguous in both `nav.adoc` and the `index.adoc` "ORM, search & batch" group.
2. **No diagram/figure — confirmed by user**: unlike `elasticsearch.adoc`/`solr.adoc` (each has one hand-authored
   SVG), this page needs none; a comparison table carries the "how does this differ" content instead of a
   topology diagram (there is no cluster/shard topology to draw for a managed, single-endpoint service).
3. **Content-only, untagged plan.** This repo has no application source code — `find .claude/skills -maxdepth 1
   -type d -name "*-code-one-task"` returns only `iru-java-code-one-task` / `iru-dotnet-code-one-task` /
   `iru-database-code-one-task` (plus their unprefixed aliases), none of which cover AsciiDoc authoring — so no
   task below carries a language/framework tag, matching every prior documentation plan in `.archive/`.
4. **Closest precedent**: `.archive/implementation_plan_61.md` (issue #61 — created the current
   `elasticsearch.adoc` and `solr.adoc`, establishing this section's "overview page" pattern: `:description:`/
   `:keywords:` header, `springboot-disclaimer` partial include, ~150–300 lines, one Spring Boot integration code
   sample + `application.yml`, `== References` of official links only, wired into `nav.adoc` + `index.adoc`,
   verified by an Antora build gate). This plan follows the same shape, minus the figure (choice 2).
5. **Query-building API — researched, corrected mid-plan.** Spring Data MongoDB itself has no `$search`-specific
   `AggregationOperation`/typed API: a PR proposing one
   (https://github.com/spring-projects/spring-data-mongodb/pull/3838[spring-data-mongodb#3838], tracking
   https://github.com/spring-projects/spring-data-mongodb/issues/3831[issue #3831]) was **declined** by the
   Spring Data team over commercial-feature/licensing and testability concerns. But the **native MongoDB Java
   driver** underneath Spring Data MongoDB has shipped its own typed builders for exactly this since driver
   4.7: package `com.mongodb.client.model.search` (`SearchOperator`, `SearchOptions`, `SearchFacet`,
   `FuzzySearchOptions`) plus `Aggregates.search(SearchOperator, SearchOptions)` /
   `Aggregates.searchMeta(SearchCollector, SearchOptions)`. The page must show **these typed driver classes**,
   not hand-rolled `org.bson.Document`/JSON literals — reached via `MongoTemplate.getCollection(...)` to obtain
   the native `MongoCollection<Document>`, the same escape-hatch pattern `spring-data-mongodb.adoc`'s
   "execute/CollectionCallback" section already documents for driver-level operations Spring Data doesn't wrap.
   Cite the Aggregation Framework Support page only for the general custom-`AggregationOperation` extensibility
   mechanism (useful background), not as "the" API — the typed driver builders are the better, current answer.
6. **Cloud-only messaging, with the local-testing nuance now required by the user — must be prominent, not
   buried.** Give it its own `== Cloud-only: no local or on-premises option` section directly after the intro,
   using an `[IMPORTANT]` admonition (the same style `special-indexes-and-search.adoc`/`solr.adoc` use), stating:
   *production* Atlas Search runs only on MongoDB Atlas — no self-hosted Community/Enterprise Server equivalent,
   no HA/multi-region/Atlas SLA outside it. **Immediately qualify this**, in the same section, with the local
   dev/test story the user asked for: MongoDB publishes a purpose-built **local Docker image,
   `mongodb/mongodb-atlas-local`**, bundling `mongod` plus the `mongot` search process so `$search`/`$searchMeta`
   can be exercised fully offline — it is a *dev/test tool*, not a way to self-host production Atlas (no HA, no
   scaling, no SLA). Testcontainers wraps it as `MongoDBAtlasLocalContainer` in the `org.testcontainers:mongodb`
   module (https://testcontainers.com/modules/mongodb-atlas/[Testcontainers MongoDB Atlas module]) — covered in
   full in the new `== Integration testing with Testcontainers` section (Task 1.11 below). Contrast this
   precisely with Elasticsearch/Solr in the comparison table (Task 1.9): all three are now Testcontainers-testable
   locally, but Atlas Search's local image is MongoDB-provided test tooling distinct from the production service,
   whereas Elasticsearch's/Solr's containers run the *same* software as production.
7. **New `== Integration testing with Testcontainers` section — added per explicit user request, with runnable
   code.** Follow this section's existing house style from
   `xref:backend/springboot/unit-and-integration-testing.adoc` (`@Testcontainers` + `@Container` +
   `@ServiceConnection`, static container field) rather than inventing a different testing convention. Cover:
   the `org.testcontainers:mongodb` dependency; declaring `MongoDBAtlasLocalContainer("mongodb/mongodb-atlas-local:<tag>")`
   (`@ServiceConnection`-compatible, since it extends the same `MongoDBContainer` Spring Boot already recognizes);
   creating a search index programmatically via the native driver's `MongoCollection.createSearchIndex(String,
   BsonDocument)` (there is no `@Indexed`-style annotation for this); polling `listSearchIndexes()` until the
   index's `status` is `"READY"` with **Awaitility** (already this section's suggested tool for exactly this kind
   of async-condition wait, per `unit-and-integration-testing.adoc` line 255) because search-index updates are
   *eventually consistent*, not synchronous with the insert; then a full JUnit 5 test running a real `$search`
   query against the container and asserting on the results.
8. **Versions**: Spring Boot 4.1.x / Spring Framework 7.0.x baseline (this section's existing convention) and the
   current Spring Data MongoDB release under the same Spring Data BOM already cited for Elasticsearch in
   `elasticsearch.adoc` (Spring Data BOM 2026.0.0) — keep this consistent with the rest of the section rather
   than re-deriving a different version story for one page. Verify the current `mongodb/mongodb-atlas-local`
   image tag and the `org.testcontainers:mongodb` module version against Testcontainers' own docs before
   finalizing (choice 7's referenced tag is illustrative, not pinned).
9. **No edits to `elasticsearch.adoc`, `solr.adoc`, `spring-data-mongodb.adoc`, or
   `database/mongodb/special-indexes-and-search.adoc`.** The acceptance criteria ask the *new* page to
   cross-link *to* these — not for those pages to be edited to link back. This matches the established
   precedent: when `solr.adoc` was added after `elasticsearch.adoc` in issue #61, it linked back to
   `elasticsearch.adoc`, but `elasticsearch.adoc` itself was never edited to add a forward link. Keep this
   change's footprint to the new page plus the two wiring files.

## Current code state

- **Section directory**: `modules/ROOT/pages/backend/springboot/` — house style confirmed on the two sibling
  pages: `= Title`, `:description:`/`:keywords:` attribute lines, `include::partial$springboot-disclaimer.adoc[]`,
  `==`/`===` sections, fenced code as `[source,java]`/`[source,yaml]` with `----` delimiters, pages ending in
  `== References` (official links only) plus, where relevant, an `xref:` pointer to a deeper reference section.
- **`modules/ROOT/pages/backend/springboot/elasticsearch.adoc`** (174 lines) — covers: inverted index vs. SQL
  `LIKE`; documents/indices/primary+replica shards (with an SVG); analysis (character filters → tokenizer →
  token filters) and `text` vs. `keyword` mappings; query DSL (`match`/`term`/`range`/`fuzzy`/`wildcard` leaves,
  `bool` compound with `must`/`should`/`filter`/`must_not`), BM25 relevance, aggregations, near-real-time refresh;
  Spring Boot integration via `spring-boot-starter-data-elasticsearch`, `@Document`/`ElasticsearchRepository`/
  `ElasticsearchOperations`, Testcontainers `elasticsearch` module. Ends with `== References` plus
  `xref:database/elasticsearch/index.adoc[Elasticsearch Reference]` for depth.
- **`modules/ROOT/pages/backend/springboot/solr.adoc`** (189 lines) — covers: cores/collections/schema/analysis
  chains/`copyField`; request handlers, query parsers (standard/DisMax/eDisMax), filter queries (`fq`, cached,
  unscored), faceting/highlighting/spellcheck (one line each); SolrCloud (ZooKeeper, shards, leader/replica, soft
  vs. hard commits, with an SVG); Spring Boot integration via raw SolrJ (`Http2SolrClient`/`CloudSolrClient`,
  `SolrInputDocument`, `SolrQuery`) since Spring Data Solr is discontinued; closes with a
  `=== Solr vs. Elasticsearch -- how to choose` comparison subsection and `== References` plus
  `xref:database/solr/index.adoc[Apache Solr Reference]`.
- **`modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc`** (453 lines) — mapping (`@Document`/`@Id`/
  `@Field`), polymorphic documents (`_class`/`@TypeAlias`), `MongoRepository`, `@Indexed`/`@CompoundIndex`,
  auditing, `@Version` optimistic locking, transactions, change streams, `MongoTemplate`
  (`Query`/`Criteria`/`Aggregation Framework`/`CollectionCallback`) — **no search coverage**; its `== Indexes:
  @Indexed` section already points to `xref:database/mongodb/special-indexes-and-search.adoc[Special Indexes &
  Search]` for text/geospatial indexes.
- **`modules/ROOT/pages/database/mongodb/special-indexes-and-search.adoc`** — its `== Atlas Search and Atlas
  Vector Search` section (lines 145–162) explicitly says Atlas Search is described "only in outline" here and
  names: the `$search` aggregation stage, analyzers, relevance scoring, fuzzy matching, autocomplete,
  highlighting, and facets — confirming the exact gap this new page fills, at the Spring Boot integration level.
- **`modules/ROOT/nav.adoc`** — the **SpringBoot Reference** block spans lines 471–505. Relevant lines today:
  ```
  484: **** xref:backend/springboot/elasticsearch.adoc[Elasticsearch]
  485: **** xref:backend/springboot/solr.adoc[Apache Solr]
  486: **** xref:backend/springboot/spring-batch.adoc[Spring Batch]
  ```
  Insert the new entry between lines 485 and 486.
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — landing page. Relevant existing content:
  - `:description:` (line 2) and `:keywords:` (line 3) currently name "full-text search with Elasticsearch and
    Apache Solr (SolrJ)" / `Elasticsearch, Apache Solr, SolrJ, full-text search` — need extending to mention
    MongoDB Atlas Search.
  - `== What's covered` → `=== ORM, search & batch` (lines 65–81) currently lists Hibernate, Elasticsearch, Solr,
    Spring Batch bullets in that order — insert a new bullet after the Solr bullet (line 79) and before the
    Spring Batch bullet (line 80).
  - `== Bibliography` → "Official documentation" list (starts line 169) already has grouped entries for Spring
    Data Elasticsearch (line 274-277) and Apache Solr (line 278-283) — add an equivalent grouped entry for
    MongoDB Atlas Search + the Spring Data MongoDB aggregation-framework reference, near the existing
    `xref:backend/springboot/spring-data-mongodb.adoc`-relevant `MongoTemplate API` entry (line 205-207) or
    directly after the Solr entry (either position is fine; keep it visually grouped with the other two search
    engines since that's this page's topical neighbor).
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — shared `[IMPORTANT]` disclaimer every page in this
  section includes; no change needed.
- **`modules/ROOT/pages/backend/springboot/unit-and-integration-testing.adoc`** (lines 191–267) — the section's
  established Testcontainers house style: `@Testcontainers` + static `@Container` fields +
  `@ServiceConnection` (no manual `@DynamicPropertySource`), one real container per external dependency, and
  Awaitility already named (line 255) as the tool for awaiting an async condition. The new page's integration-
  testing section (Task 1.11) must follow this exact convention rather than inventing a different one.
- **Build/verification**: `npx antora antora-playbook.yml` (local content only) must complete with **no**
  `xref`/AsciiDoc errors; `build/` is gitignored. `iru-build-docs` wraps this; `iru-gate-runner` agent is
  installed at `.claude/agents/iru-gate-runner.md`.
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly.

## Implementation steps

### Group 1 — Author the new page (Parallelizable: yes — single task, no shared file with anything else)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/mongodb-atlas-search.adoc`** — target ~280–380
      lines (no figure, but a comparison table, a Spring Boot query-building code sample, and a full
      Testcontainers integration-test example); docs-only, no tests/coverage/static-analysis applicable (Antora
      build verified in Group 3). — New file, 309 lines. All `== References` URLs live-checked with `curl`;
      two dead slugs found and fixed: the analyzers overview page (`.../analyzers/` → `.../analyzers/language/`)
      and the driver Javadoc's `current` alias (404s; pinned to the latest published version, `5.4`). No
      tests/coverage/static-analysis applicable (docs-only); Antora build verified in Group 3.
  - [x] Task 1.1. Header: `= MongoDB Atlas Search`; `:description:` (Elasticsearch/Solr-style full-text search on
        MongoDB Atlas -- the $search and $searchMeta aggregation stages, search index definitions and
        per-language analyzers, fuzzy matching, faceting, and projection via stored source -- compared feature
        by feature with Elasticsearch and Apache Solr, and why it is available on Atlas only); `:keywords:`
        (`MongoDB Atlas Search, Atlas Search, mongot, $search, $searchMeta, search index, index definition,
        Lucene analyzer, lucene.standard, language analyzer, stemming, Snowball, nGram, edgeGram, autocomplete,
        fuzzy, maxEdits, facet, stringFacet, numberFacet, dateFacet, returnStoredSource, stored source,
        searchScore, AggregationOperation, MongoTemplate, cloud-only, managed service`); then
        `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. Intro paragraph: *MongoDB Atlas Search* embeds a Lucene-based search engine (internally,
        `mongot`) alongside your Atlas cluster, kept in sync automatically, and queried through aggregation
        pipeline stages -- giving Elasticsearch/Solr-style relevance ranking, analyzers, fuzzy matching, and
        faceting directly over your existing MongoDB documents, with no second datastore or CDC pipeline to
        maintain (contrast with xref:backend/springboot/elasticsearch.adoc[Elasticsearch]'s "usually run
        alongside a system of record" model). Cross-link
        `xref:backend/springboot/spring-data-mongodb.adoc[Spring Data MongoDB]` (this page assumes that
        mapping/repository knowledge) and note a full reference lives in
        `xref:database/mongodb/special-indexes-and-search.adoc[Special Indexes & Search]`, which this page
        expands on for the Spring Boot integration level.
  - [x] Task 1.3. `== Cloud-only: no local or on-premises option` -- an `[IMPORTANT]` admonition per choice 6:
        state plainly that *production* Atlas Search (like Atlas Vector Search) is a MongoDB **Atlas-only**
        managed service -- it does not exist in self-hosted MongoDB Community or Enterprise Server, and carries
        no HA/multi-region/SLA outside Atlas. Immediately qualify this with the local-testing nuance: MongoDB
        publishes a purpose-built local Docker image, `mongodb/mongodb-atlas-local`, bundling `mongod` plus the
        `mongot` search process specifically so `$search`/`$searchMeta` can be developed and tested fully
        offline -- it is dev/test tooling, **not** a way to self-host the production service (no HA, no scaling,
        no SLA). Point to `== Integration testing with Testcontainers` (Task 1.11) for how to use it. Note this
        as the key deployment-model nuance versus Elasticsearch/Solr, which this page's closing comparison table
        (Task 1.9) restates alongside the other feature comparisons.
  - [x] Task 1.4. `== Search indexes and analyzers` -- a **search index** is a separate JSON index definition
        (created via the Atlas UI, Atlas CLI, `mongosh`, or the driver/`mongoTemplate`'s search-index-management
        calls) distinct from a normal MongoDB index; it declares field **mappings** (`dynamic` or explicit
        per-field) and, per field, an **analyzer**. Built-in analyzers include `lucene.standard` (the default),
        `lucene.simple`, `lucene.whitespace`, `lucene.keyword`, and 40+ **per-language analyzers**
        (`lucene.english`, `lucene.spanish`, `lucene.french`, `lucene.german`, `lucene.cjk` for
        Chinese/Japanese/Korean, etc.) -- pick the one matching each field's content language rather than relying
        on the standard analyzer for non-English text. Note explicitly that Atlas Search, Elasticsearch, and Solr
        all embed **Apache Lucene**, so the same character-filter → tokenizer → token-filter pipeline concept
        from xref:backend/springboot/elasticsearch.adoc[Elasticsearch]'s "Analysis and mappings" section applies
        here too, just configured through the search index definition instead of the collection schema.
  - [x] Task 1.5. `=== Stemming and n-grams` -- **stemming** is handled by the per-language analyzers from Task
        1.4 (most built on Lucene's Snowball stemmers) -- the same mechanism Elasticsearch's language analyzers
        and Solr's `SnowballPorterFilterFactory` use, since all three are Lucene-based; there is no separate
        "stemming toggle," you pick a language analyzer. **N-grams** are available two ways: the `autocomplete`
        field type (internally edge n-grams, for partial-word/type-ahead matching) and, in a custom analyzer, an
        explicit `nGram`/`edgeGram` tokenizer -- functionally equivalent to Elasticsearch's `ngram`/`edge_ngram`
        token filters and Solr's `NGramFilterFactory`/`EdgeNGramFilterFactory`.
  - [x] Task 1.6. `== Querying with $search: fuzzy matching` -- the `text` operator inside a `$search` stage
        performs analyzed full-text matching and accepts a `fuzzy` option (`maxEdits`: 1 or 2, `prefixLength`,
        `maxExpansions`) for typo-tolerant matching by edit distance -- directly analogous to Elasticsearch's
        `fuzzy` query / a `match` query's `fuzziness` parameter, and to Solr's `~N` fuzzy query syntax (or
        eDisMax's fuzzy support); all three cap the edit distance at 2. Show one `[source,json]` (or prose-only,
        implementer's call) example of a minimal `$search` stage using `text` + `fuzzy`.
  - [x] Task 1.7. `== Faceting with $searchMeta` -- facet-only queries use the separate `$searchMeta` stage (or a
        `facet` collector alongside `$search` via the `SEARCH_META` aggregation variable) with `string`,
        `number`, or `date` facet types -- conceptually the same job as Elasticsearch's aggregations
        (`terms`/`histogram`/`date_histogram`) and Solr's faceting (`facet.field`/`facet.range`); as with those
        two, a facet-friendly field generally needs a non-analyzed representation (Atlas Search's
        `stringFacet` type, vs. Elasticsearch's `keyword` type or Solr's un-analyzed `copyField` target).
  - [x] Task 1.8. `== Projection and stored source` -- ordinary aggregation projection (`$project` after
        `$search`) works as usual, and `$search` adds a relevance score exposed via `\{ $meta: "searchScore" }`
        (parallel to Elasticsearch's `_score` and Solr's relevance score). The Atlas-specific angle is
        **`returnStoredSource`**: marking fields `stored: true` in the search index definition lets `$search`
        return those values straight from the Lucene index, skipping the round-trip to the collection --
        equivalent in purpose to Elasticsearch's stored fields/`_source` filtering and Solr's `fl` parameter over
        stored fields.
  - [x] Task 1.9. `== Atlas Search vs. Elasticsearch vs. Solr` -- an AsciiDoc comparison table (`[cols="2,3,3,3"]`
        or similar), one row per feature the issue names, columns MongoDB Atlas Search / Elasticsearch / Apache
        Solr:
        * Deployment model (Atlas-only managed service in production, no self-hosted equivalent /
          self-hosted, Docker-friendly / self-hosted, Docker-friendly)
        * Local testing (`MongoDBAtlasLocalContainer` wrapping the MongoDB-provided `mongodb/mongodb-atlas-local`
          dev/test image -- not the production service / Testcontainers `elasticsearch` module, same software as
          production / Testcontainers `SolrContainer`, same software as production)
        * Fuzzy search (`fuzzy` on `text` operator / `fuzzy` query or `match` `fuzziness` / `~N` or eDisMax
          fuzzy)
        * Faceting (`$searchMeta` facet types / aggregations / `facet.field`+`facet.range`)
        * Projection & stored fields (`returnStoredSource` / stored fields & `_source` filtering / `fl` +
          stored fields)
        * Per-language analyzers (40+ `lucene.<language>` analyzers / per-language analyzers / per-`fieldType`
          analysis chains with language filters)
        * Stemming (built into the language analyzer, Snowball-based / same, Snowball-based / same,
          `SnowballPorterFilterFactory`)
        * N-grams (`autocomplete` field type / `nGram`/`edgeGram` tokenizer / `ngram`/`edge_ngram` token filter /
          `NGramFilterFactory`/`EdgeNGramFilterFactory`)
        Close with one short paragraph: choose Atlas Search when the data already lives in MongoDB Atlas and a
        second search cluster/CDC pipeline is unwanted; choose Elasticsearch/Solr when self-hosting is required
        or the data does not already live in MongoDB. Cross-link
        `xref:database/solr/solr-vs-elasticsearch.adoc[Solr vs. Elasticsearch]` for the Solr/Elasticsearch-only
        head-to-head.
  - [x] Task 1.10. `== Spring Boot integration` -- state per choice 5: Spring Data MongoDB has **no dedicated
        typed API** for `$search`/`$searchMeta` (a proposal was declined upstream -- link
        `https://github.com/spring-projects/spring-data-mongodb/pull/3838` and
        `https://github.com/spring-projects/spring-data-mongodb/issues/3831`), but the **native MongoDB Java
        driver** underneath it does, since driver 4.7: `com.mongodb.client.model.search.SearchOperator`/
        `SearchOptions`/`FuzzySearchOptions`, plus `com.mongodb.client.model.Aggregates.search(...)` /
        `.searchMeta(...)`. No extra starter/dependency beyond `spring-boot-starter-data-mongodb` (the driver
        ships inside it already). One `[source,java]` example: a `Book` collection, obtain the native collection
        via `MongoCollection<Document> books = mongoTemplate.getCollection("books");` (the same escape hatch
        `spring-data-mongodb.adoc`'s "execute/CollectionCallback" section documents), build
        `List<Bson> pipeline = List.of(Aggregates.search(SearchOperator.text(fieldPath("title"), query,
        SearchOperator.textOptions().fuzzy(FuzzySearchOptions.fuzzySearchOptions().maxEdits(1))),
        SearchOptions.searchOptions().index("default")), Aggregates.project(Projections.fields(
        Projections.include("title", "genre"), Projections.computed("score", Document.parse("\{ $meta:
        \"searchScore\" }")))))`, then `books.aggregate(pipeline, Book.class).into(new ArrayList<>())`; plus a
        one-paragraph note that search indexes are managed outside the application (Atlas UI/CLI, or the driver's
        `createSearchIndex` used in Task 1.11's test setup), not through `@Indexed`/`@CompoundIndex`.
  - [x] Task 1.11. `== Integration testing with Testcontainers` -- per choice 7, follow
        `xref:backend/springboot/unit-and-integration-testing.adoc[Unit and Integration Testing]`'s existing
        `@Testcontainers`/`@Container`/`@ServiceConnection` house style, not a bespoke pattern. Cover, with one
        full runnable `[source,java]` test class:
        * Dependency: `org.testcontainers:mongodb` (test scope) -- note it is the *same* Testcontainers module
          used for plain `MongoDBContainer` elsewhere in this section, just a different container class.
        * Declare the container: `@Container static MongoDBAtlasLocalContainer mongodb = new
          MongoDBAtlasLocalContainer("mongodb/mongodb-atlas-local:<current-tag>");` with `@ServiceConnection` --
          note it extends the same base Spring Boot already recognizes for plain MongoDB, so no
          `@DynamicPropertySource` boilerplate is needed.
        * Create the search index in `@BeforeAll`/setup via the native driver escape hatch:
          `mongoTemplate.getCollection("books").createSearchIndex("default", BsonDocument.parse(indexDefinitionJson));`
          -- there is no Spring Data annotation for this.
        * **Wait for the index to become queryable** -- explain search-index updates are *eventually
          consistent*, not synchronous with the write, then poll with Awaitility (already this section's
          suggested tool for this kind of wait, per choice 7):
          `Awaitility.await().atMost(Duration.ofSeconds(10)).until(() -> "READY".equals(
          collection.listSearchIndexes().into(new ArrayList<>()).stream()
          .filter(ix -> "default".equals(ix.getString("name"))).findFirst()
          .map(ix -> ix.getString("status")).orElse(null)));`
        * A `@Test` method that inserts a document, runs the same `Aggregates.search(...)` pipeline shape from
          Task 1.10 against the container, and asserts on the returned results -- proving the whole path (index
          creation, fuzzy/analyzed search, projection) works against a real `mongot`.
        * One-paragraph closing note: this container is for *this application's* integration tests; it is not a
          substitute for validating against a real Atlas cluster before production (index-definition limits,
          resource sizing, and Atlas-specific operational behavior can still differ).
  - [x] Task 1.12. `== References` -- official sources only:
        `https://www.mongodb.com/docs/atlas/atlas-search/[MongoDB Atlas Search]`,
        `https://www.mongodb.com/docs/atlas/atlas-search/analyzers/[Atlas Search -- Analyzers]`,
        `https://www.mongodb.com/docs/atlas/atlas-search/text/[Atlas Search -- text operator]`,
        `https://www.mongodb.com/docs/atlas/atlas-search/facet/[Atlas Search -- facet operator]`,
        `https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/[Atlas Search -- autocomplete]`,
        `https://www.mongodb.com/docs/atlas/atlas-search/return-stored-source/[Atlas Search -- returnStoredSource]`,
        `https://docs.spring.io/spring-data/mongodb/reference/mongodb/aggregation-framework.html[Spring Data
        MongoDB -- Aggregation Framework Support]`,
        `https://mongodb.github.io/mongo-java-driver/current/apidocs/mongodb-driver-core/com/mongodb/client/model/search/package-summary.html[MongoDB
        Java Driver -- com.mongodb.client.model.search package]`,
        `https://testcontainers.com/modules/mongodb-atlas/[Testcontainers -- MongoDB Atlas module]`; plus
        `xref:database/mongodb/special-indexes-and-search.adoc[MongoDB Reference: Text, wildcard, geospatial &
        Atlas search]` as the dedicated deeper-reference pointer. **Verify each MongoDB/driver doc URL actually
        resolves before finalizing** (some Atlas Search doc slugs and the driver API version shift between
        releases) -- if a slug has moved, use the current equivalent page rather than leaving a dead link.

### Group 2 — Wire the page into navigation and the landing page (Parallelizable: yes — `nav.adoc` and `index.adoc` are different files; both require Group 1 complete so `xref`s resolve)

- [x] **Task 2. Add one nav entry in `modules/ROOT/nav.adoc`** — docs-only, no tests/coverage/static-analysis.
      — Inserted `**** xref:backend/springboot/mongodb-atlas-search.adoc[MongoDB Atlas Search]` between the
      Solr and Spring Batch entries (now lines 485-487); confirmed a single contiguous `backend/springboot`
      block.
  - [x] Task 2.1. Immediately after the `**** xref:backend/springboot/solr.adoc[Apache Solr]` line (currently
        line 485) and before `**** xref:backend/springboot/spring-batch.adoc[Spring Batch]` (currently line
        486), insert at the same `****` depth:
        ```
        **** xref:backend/springboot/mongodb-atlas-search.adoc[MongoDB Atlas Search]
        ```
  - [x] Task 2.2. Confirm no duplicate `backend/springboot` nav block exists:
        `grep -n "backend/springboot" modules/ROOT/nav.adoc` should show exactly one contiguous block.

- [x] **Task 3. Update `modules/ROOT/pages/backend/springboot/index.adoc`** — new "ORM, search & batch" bullet,
      extended `:description:`/`:keywords:`, and a new Bibliography entry grouped with the Elasticsearch/Solr
      entries. — docs-only, no tests/coverage/
      static-analysis.
  - [x] Task 3.1. In `== What's covered` → `=== ORM, search & batch`, insert a new bullet after the Apache Solr
        bullet (currently ending line 79) and before the Spring Batch bullet (currently starting line 80),
        mirroring the existing one-line "what it covers" style:
        `xref:backend/springboot/mongodb-atlas-search.adoc[MongoDB Atlas Search] -- the $search/$searchMeta
        aggregation stages, search index definitions and per-language analyzers, fuzzy matching, faceting, and
        projection via stored source, compared with Elasticsearch and Apache Solr; a cloud-only Atlas service
        with no self-hosted equivalent.`
  - [x] Task 3.2. Extend the page's `:description:` (line 2) and `:keywords:` (line 3) to name MongoDB Atlas
        Search alongside the existing Elasticsearch/Solr mentions (e.g. append "and MongoDB Atlas Search" to the
        `:description:` full-text-search clause; append `MongoDB Atlas Search, Atlas Search, $search,
        $searchMeta` to `:keywords:`).
  - [x] Task 3.3. In `== Bibliography` → "Official documentation", add a new grouped entry (placed next to the
        existing Elasticsearch/Solr entries, lines 274–283) citing
        `https://www.mongodb.com/docs/atlas/atlas-search/[MongoDB Atlas Search documentation]` and
        `https://docs.spring.io/spring-data/mongodb/reference/mongodb/aggregation-framework.html[Spring Data
        MongoDB -- Aggregation Framework Support]`, matching the existing bullet style (one bullet, `--`
        followed by a short description of what it's the source for). Cross-check every URL used in the new
        page's `== References` (Task 1.11) appears here too; add only what's genuinely missing.

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1–2 complete)

- [x] **Task 4. Verify the Antora build is clean** — build completed exit 0, zero xref/AsciiDoc warnings;
      `backend/springboot/mongodb-atlas-search.html` rendered under `build/site/`. New page confirmed at 309
      lines, comparison table covers all six issue-requested features plus deployment-model/local-testing
      rows, and the Testcontainers section is one coherent runnable example (container, index creation,
      Awaitility `READY` wait, assertion). — `npx antora antora-playbook.yml` (via `iru-build-docs` /
      `iru-gate-runner`) must complete exit 0 with zero xref/AsciiDoc warnings or errors, and the new page must
      render under `build/site/`.
  - [x] Task 4.1. Delegate to the `iru-gate-runner` agent:
        `Agent({description: "Build Antora docs and report warnings", subagent_type: "iru-gate-runner",
        prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repo's Antora site. Report only: whether
        the build completed, and any xref/AsciiDoc warnings or errors (file + message), especially any
        referencing backend/springboot/mongodb-atlas-search.adoc, backend/springboot/nav.adoc entries, or
        backend/springboot/index.adoc."})`.
  - [x] Task 4.2. If the sub-agent reports any unresolved `xref`, missing image, or AsciiDoc error, fix it in the
        offending file and re-run Task 4.1. Done only when the build is warning-free and the new page renders
        under `build/site/`.
  - [x] Task 4.3. Sanity-check the new page is ~280–380 lines, every `== References` link is an official source
        (MongoDB/Spring/driver docs, plus the two GitHub links documenting why Spring Data MongoDB has no typed
        `$search` API — an acceptable exception, same as `solr.adoc`'s one allowed blog-post exception), the
        comparison table (Task 1.9) names all six issue-requested features (fuzzy search, faceting, projection,
        analyzers for different languages, stemming, n-grams) plus the deployment-model and local-testing rows,
        and the `== Integration testing with Testcontainers` section (Task 1.11) contains one complete, coherent
        runnable test example (container declaration, index creation, the Awaitility `READY` wait, and the
        assertion) rather than disconnected fragments.
