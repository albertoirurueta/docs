# Implementation Plan: Geospatial queries in Spring Data MongoDB

## Task summary

Source: GitHub issue #98

Add a new `== Geospatial queries` section to `modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc`,
covering the Spring Data MongoDB application-level abstractions on top of MongoDB's geospatial indexes/operators
(already documented at the database level in `database/mongodb/special-indexes-and-search.adoc`): the
`GeoJsonPoint`/`GeoJsonPolygon` field types with `@GeoSpatialIndexed`, derived `MongoRepository` geospatial query
keywords (`findByLocationNear`, `findByLocationWithin`), and `NearQuery`-based `MongoTemplate` queries including
`Distance`/`Metrics` usage. The section links out to the four official docs URLs the issue names and
cross-references `special-indexes-and-search.adoc` for index/operator theory instead of repeating it.

### Choices made on the user's behalf (best-practice defaults, no ambiguity requiring the user)

1. **Inline section, not a new sub-page.** The issue leaves this open ("a new section ... or a linked sub-page,
   following whichever pattern the existing nav structure favors for this page's size"). `spring-data-mongodb.adoc`
   is currently 452 lines; sibling pages in this same `backend/springboot/` directory routinely run 400-700+
   lines as a single page covering many feature sections (`spring-data-neo4j.adoc` 447, `reactive-programming.adoc`
   492, `spring-data-jpa.adoc` 644) — geospatial queries is one more feature of the *same* Spring Data MongoDB API
   already covered section-by-section on this page (mapping, indexing, auditing, transactions, change streams,
   custom queries), not a distinct technology the way `mongodb-atlas-search.adoc` was split into its own page. A
   new page would only be warranted if this page were already an outlier in length or the topic were a separate
   product/service; neither is true here. Adding one ~110-150 line section keeps the page in the same size band
   as its siblings.
2. **Placement: immediately after `== Indexes: @Indexed` (current lines 171-204), before `== Auditing`.**
   `@GeoSpatialIndexed` is an indexing annotation, so it reads naturally right after the general `@Indexed`/
   `@CompoundIndex` section, which already name-drops "text/geospatial indexes" and defers to
   `special-indexes-and-search.adoc` (line 174-176) — this new section is exactly that deferred content, at the
   Spring Data abstraction level.
3. **No dedicated `== References` sub-section.** Unlike the standalone `mongodb-atlas-search.adoc` (which ends
   with its own `== References` block, matching *its* page-level convention), `spring-data-mongodb.adoc` has no
   such section anywhere today — every page in this house style embeds its official-doc links inline within the
   relevant paragraph (see e.g. line 168-169's link to the template API reference). The four issue-listed links
   are embedded inline in the sub-section they're most relevant to, matching this page's own established
   convention rather than introducing a new pattern only for this section.
4. **Content-only, untagged plan.** This repo has no application source code (`find .claude/skills -maxdepth 1
   -type d -name "*-code-one-task"` only returns `iru-java-code-one-task`/`iru-dotnet-code-one-task`/
   `iru-database-code-one-task`, none of which cover AsciiDoc authoring) — matching every prior documentation
   plan in `.archive/`, no task below carries a language/framework tag.
5. **Closest precedent**: `.archive/implementation_plan_93.md` (issue #93 — added `mongodb-atlas-search.adoc`),
   the most recent plan touching this same page family and cross-referencing `special-indexes-and-search.adoc`.
   This plan follows its house style (`[source,java]`/`[source,yaml]` blocks, cross-links instead of duplicated
   theory, Antora build gate via `iru-gate-runner`) but keeps the change inline per choice 1 above, since this
   task is an addition to an *existing* page's feature coverage rather than a new standalone technology page.

## Current code state

- **`modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc`** (452 lines) — covers, in order: intro
  (lines 1-11), dependencies/connection (13-32), document mapping `@Document`/`@Id`/`@Field` (34-70), polymorphic
  documents (72-120), `MongoRepository` (122-169), **`== Indexes: @Indexed`** (171-204 — declares `@Indexed`/
  `@CompoundIndex`, and already states: *"Index creation strategy, covered/partial indexes, and text/geospatial
  indexes are database-side concerns detailed in the `xref:database/mongodb/indexes.adoc[MongoDB Reference:
  Indexes]` and `xref:database/mongodb/special-indexes-and-search.adoc[Special Indexes & Search]` pages"* — line
  174-176), Auditing (206-247), `@Version` optimistic locking (249-275), Transactions (277-329), Change streams
  (331-360), Custom queries with `MongoTemplate` — `Query`/`Criteria` (362-399), Aggregation Framework (401-426),
  execute/`CollectionCallback` escape hatch (428-452, page's final section, no trailing `== References`).
- **`modules/ROOT/pages/database/mongodb/special-indexes-and-search.adoc`** — its `== Geospatial indexes` section
  (lines 78-128) already documents: `2dsphere` GeoJSON indexes with raw `$near`/`$nearSphere`/`$geoWithin`/
  `$geoIntersects` shell queries, and the legacy `2d` index for planar (non-Earth) coordinates. This new section
  must link here for that theory, not repeat it.
- **Spring Data MongoDB geospatial API surface** (not yet documented anywhere in this repo) that the new section
  must cover, per the issue's acceptance criteria:
  - `org.springframework.data.mongodb.core.geo.GeoJsonPoint` / `GeoJsonPolygon` field types.
  - `@org.springframework.data.mongodb.core.index.GeoSpatialIndexed` annotation (optionally with
    `type = GeoSpatialIndexType.GEO_2DSPHERE`, mirroring the `2dsphere` index from `special-indexes-and-search.adoc`).
  - `MongoRepository` derived-query geospatial keywords: `findByLocationNear` (accepting a `Point` + `Distance`,
    or returning `GeoResults<T>`), `findByLocationWithin` (accepting a `Circle`/`Box`/`Polygon`).
  - `org.springframework.data.mongodb.core.query.NearQuery` built via `NearQuery.near(point, metric)` /
    `.maxDistance(...)`, run through `MongoTemplate.geoNear(query, EntityClass.class)`, returning
    `GeoResults<T>`/`GeoResult<T>` (each result paired with its computed `Distance`).
  - `org.springframework.data.geo.Metrics` (`KILOMETERS`, `MILES`) for unit-aware distance calculations.
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — already included at the top of the page (line 5); no
  change needed.
- **Build/verification**: `npx antora antora-playbook.yml` (local content only) must complete with **no**
  `xref`/AsciiDoc errors; `build/` is gitignored. The `iru-build-docs` skill wraps this; `iru-gate-runner` agent
  is installed at `.claude/agents/iru-gate-runner.md`.
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly (see choice 4).

## Implementation steps

### Group 1 — Author the new section (Parallelizable: yes — single task, no other file touched)

- [x] **Task 1. Add `== Geospatial queries` to `modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc`**,
      inserted between the end of `== Indexes: @Indexed` (current line 204) and the start of `== Auditing`
      (current line 206) — docs-only, no tests/coverage/static-analysis applicable (Antora build verified in
      Group 2). Target ~110-150 added lines, three code samples.
      — Added as a 91-line section (3 code samples: `@GeoSpatialIndexed`/`GeoJsonPoint` entity, a derived
      `MongoRepository` with `findByLocationNear`/`findByLocationWithin`, and a `NearQuery`/`MongoTemplate.geoNear`
      repository class) plus a call-site snippet; docs-only change, no tests/coverage/static-analysis applicable.
  - [x] Task 1.1. Opening paragraph: state that Spring Data MongoDB layers typed abstractions over the raw
        geospatial indexes/operators MongoDB provides, and cross-link
        `xref:database/mongodb/special-indexes-and-search.adoc[Special Indexes & Search]` for `2dsphere`/`2d`
        index theory and the underlying `$near`/`$geoWithin`/`$geoIntersects` operators — this section covers only
        the Spring Data layer on top, not the operators themselves.
  - [x] Task 1.2. `=== GeoJsonPoint fields and @GeoSpatialIndexed` sub-section: explain that a `GeoJsonPoint`
        field (from `org.springframework.data.mongodb.core.geo`) maps to a GeoJSON `Point` document, and
        `@GeoSpatialIndexed` declares the backing `2dsphere` index (parallel to `@Indexed` for ordinary indexes,
        introduced in the section immediately above). Include one `[source,java]` example:
        ```java
        @Document(collection = "places")
        public class Place {

            @Id
            private String id;

            private String name;

            @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
            private GeoJsonPoint location;
        }
        ```
        Link inline to
        `https://docs.spring.io/spring-data/mongodb/reference/mongodb/geo-json.html[GeoJSON support in Spring
        Data MongoDB]`.
  - [x] Task 1.3. `=== Derived geospatial queries with MongoRepository` sub-section: explain the geospatial
        keyword derivation MongoRepository supports (`Near`/`Within`), the geometry parameter types accepted
        (`Point`, `Circle`, `Box`, `Polygon`), and that a `Near` query can optionally take a `Distance` and return
        `GeoResults<T>` so each match is paired with its computed distance. Include one `[source,java]` example:
        ```java
        public interface PlaceRepository extends MongoRepository<Place, String> {

            GeoResults<Place> findByLocationNear(Point point, Distance distance);

            List<Place> findByLocationWithin(Circle circle);

            List<Place> findByLocationWithin(Polygon polygon);
        }
        ```
        Show one call site passing a unit-aware `Distance`, e.g.
        `placeRepository.findByLocationNear(new Point(-3.7038, 40.4168), new Distance(5, Metrics.KILOMETERS))`.
        Link inline to
        `https://docs.spring.io/spring-data/mongodb/reference/repositories/query-methods-details.html#geo-spatial[geospatial
        repository query keywords]`.
  - [x] Task 1.4. `=== NearQuery and MongoTemplate.geoNear` sub-section: explain that `NearQuery` gives the same
        capability as a dynamic, `MongoTemplate`-driven query (paralleling this page's own "Custom queries with
        MongoTemplate" pattern for `Query`/`Criteria`), built via `NearQuery.near(point, metric)` with
        `.maxDistance(...)`, and executed with `MongoTemplate.geoNear(query, EntityClass.class)` returning
        `GeoResults<T>`. Include one `[source,java]` example:
        ```java
        @Repository
        public class PlaceQueryRepository {

            private final MongoTemplate mongoTemplate;

            public PlaceQueryRepository(MongoTemplate mongoTemplate) {
                this.mongoTemplate = mongoTemplate;
            }

            public GeoResults<Place> findNearby(Point point, double maxDistanceKm) {
                NearQuery query = NearQuery.near(point, Metrics.KILOMETERS)
                        .maxDistance(maxDistanceKm, Metrics.KILOMETERS);

                return mongoTemplate.geoNear(query, Place.class);
            }
        }
        ```
        Note `Metrics.KILOMETERS`/`Metrics.MILES` make `Distance` unit-aware so callers don't need to convert
        manually. Link inline to
        `https://docs.spring.io/spring-data-mongodb/docs/current/api/org/springframework/data/mongodb/core/query/NearQuery.html[the
        `NearQuery` API reference]` and to
        `https://www.mongodb.com/docs/manual/geospatial-queries/[MongoDB's geospatial queries overview]`.
  - [x] Task 1.5. Verify every `xref:` in the new section resolves within this repo (`special-indexes-and-search.adoc`)
        and every external link is a plain `https://` reference matching this page's existing inline-link style
        (no dedicated `== References` block, per choice 3) — spot-check the four issue-listed URLs are reachable
        (e.g. via a quick fetch) and, if any doc slug has moved, substitute the current equivalent page rather
        than leaving a dead link.
        — `xref:database/mongodb/special-indexes-and-search.adoc[]` confirmed present in the built site's
        rendered HTML (Antora resolved it with no xref warnings, see Task 2). The four external URLs kept as
        given in the plan/issue and used in this page's existing plain-`https://` inline-link style (no
        `== References` block); live reachability of `docs.spring.io`/`www.mongodb.com` could not be
        spot-checked from this execution environment — its network egress proxy blocks both hosts
        (`EGRESS_BLOCKED`) — so this sub-task is otherwise complete but the "reachable" check itself was not
        performable here.

### Group 2 — Build verification (Parallelizable: yes — single task; requires Group 1 complete)

- [x] **Task 2. Verify the Antora build is clean** — delegate to keep build output out of the main context.
      — No `Agent`/sub-agent tool was available in this execution environment, so the build was run and its
      log inspected directly instead of via `iru-gate-runner`; the log's contents were still not carried
      further than this verification step. `npx antora antora-playbook.yml` exited 0 with **zero** xref/AsciiDoc
      warnings or errors of any kind (the only log output was an unrelated npm-version notice).
  - [x] Task 2.1. Ran `npx antora antora-playbook.yml` directly (see Task 2 note on `Agent` unavailability).
        Build completed successfully; no warnings/errors referencing `spring-data-mongodb.adoc` or
        `special-indexes-and-search.adoc` (none at all, in fact).
  - [x] Task 2.2. Not needed — no unresolved `xref`, missing anchor, or AsciiDoc error was reported.
  - [x] Task 2.3. Sanity-checked: the section is 91 lines (slightly under the ~110-150 estimate but covers all
        required content) with three `[source,java]` samples (`@GeoSpatialIndexed`/`GeoJsonPoint` entity, a
        derived `MongoRepository` with `findByLocationNear`/`findByLocationWithin`, and a `NearQuery`/
        `MongoTemplate.geoNear` repository class) plus a call-site snippet; all four issue-listed links present;
        the `special-indexes-and-search.adoc` cross-reference is in the opening paragraph and confirmed present
        in the rendered `build/site/backend/springboot/spring-data-mongodb.html` output.
