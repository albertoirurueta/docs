# Implementation Plan: Geospatial query coverage for Spring Data JPA, Couchbase, and Neo4j pages

## Task summary

Source: GitHub issue #100

Add a new `== Geospatial queries` section to each of three sibling pages under
`modules/ROOT/pages/backend/springboot/` that currently have no geospatial coverage:
`spring-data-jpa.adoc`, `spring-data-couchbase.adoc`, and `spring-data-neo4j.adoc`. This mirrors the pattern
issue #98 already established for `spring-data-mongodb.adoc` (merged, present on this branch at lines 206-300 of
that file) — a Spring-Data-layer section with runnable code examples, cross-referenced to the relevant
`database/<store>/` reference page for index/operator theory instead of repeating it, with links to official
documentation. `spring-data-mongodb.adoc` itself is **not** touched (out of scope, already covered by #98).

### Choices made on the user's behalf (best-practice defaults, no ambiguity requiring the user)

1. **Inline sections, not new sub-pages**, for all three — matching #98's own choice (`.archive/implementation_plan_98.md`,
   choice 1) and this directory's norm of pages routinely running 400-700+ lines covering many feature sections.
   Geospatial queries is one more feature of each store's existing Spring Data API already covered
   section-by-section on these pages, not a distinct product/technology warranting its own page.
2. **Insertion points**, chosen so the new section reads naturally next to the most closely related existing
   section on each page (see "Current code state" below for exact line numbers):
   - JPA: after `== @Query, dynamic queries, and projections` (ends at the current line 312), before
     `== Transactions, optimistic locking, and auditing` — spatial querying is itself a `@Query`/native-query
     technique, so it belongs with the other query-authoring content, ahead of the transactions/locking/auditing
     material.
   - Couchbase: **extended in place** inside the existing `== Full-text and vector search integration` section
     (current lines 207-242), per the issue's own framing ("extend that existing pattern with a geo-specific
     example") — not a new top-level `==` section, since geo queries here are reached through the exact same
     `@Query`-style search methods and `SearchQuery`-style builder APIs already documented there.
   - Neo4j: after `== Custom Cypher with @Query` (ends at the current line 224), before `== Projections` — `Near`
     is a derived-query-keyword extension parallel to `== Derived query methods` and the custom-Cypher section
     immediately above it, ahead of projections/auditing/transactions.
3. **No dedicated `== References` sub-section** on any of the three — matching every page in this family's
   existing convention of embedding official-doc links inline within the relevant paragraph (see e.g.
   `spring-data-mongodb.adoc` lines 168-169, 234-235, 265-267, 296-299).
4. **Content-only, untagged plan** — `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns
   only `java`, `dotnet`, and `database` keys, none of which cover AsciiDoc authoring; no task below carries a
   language/framework tag, matching every prior documentation plan in `.archive/` (including #98's).
5. **Closest precedent**: `.archive/implementation_plan_98.md` (issue #98, the MongoDB geospatial section this
   issue explicitly mirrors). This plan follows its house style (`[source,java]` blocks matching surrounding
   sections, cross-links instead of duplicated theory, Antora build gate) and its per-page choices above.

## Current code state

- **`modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc`** (644 lines) — intro (1-14), entities/JPA
  mapping (16-72), entity inheritance (74-172), `JpaRepository`/derived queries (174-209), **`== @Query, dynamic
  queries, and projections`** (211-312: JPQL/native `@Query` at 213-243, `Specifications`/Querydsl at 245-277,
  projections at 279-312 — no geospatial mentions), `== Transactions, optimistic locking, and auditing` (314-516),
  `== Custom queries without JPA` — `JdbcClient`/`JdbcTemplate` (518-625), `== Summary` (627-644, final section).
  No `database/sql/` page mentions `spatial`/`postgis`/`geometry` (confirmed) — new section links directly to
  official Hibernate Spatial and PostGIS docs.
- **`modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc`** (398 lines) — intro (1-9), dependency/
  connection (11-32), entity mapping (34-58), polymorphic documents (60-95), `CouchbaseRepository` + derived
  N1QL/SQL++ + `@Query` (97-176), buckets/scopes/collections (177-205), **`== Full-text and vector search
  integration`** (207-242 — `@Query`-style search methods and `SearchQuery` builder, `HotelRepository`/
  `HotelSearchService` examples, cross-references `xref:database/couchbase/search-analytics-eventing.adoc[]` —
  no geo mentions today), `== Custom queries with CouchbaseTemplate` + SDK escape hatch (244-311), `== Optimistic
  locking` (313-341), `== Transactions` (343-386), `== Summary` (388-398, final section, already references the
  FTS/vector search section).
  - `modules/ROOT/pages/database/couchbase/search-analytics-eventing.adoc`'s query-types table (line 89) already
    lists `geo distance / bounding-box / polygon` as an FTS query type (no worked SQL++ example on that page).
  - `modules/ROOT/pages/database/couchbase/indexes-and-views.adoc` (line 248) mentions legacy spatial views
    indexing GeoJSON bounding boxes.
  - The Couchbase Java SDK's search-query builder API (`com.couchbase.client.java.search.SearchQuery` /
    `com.couchbase.client.java.search.geo.*`) exposes `SearchQuery.geoDistance(lon, lat, distance)`,
    `.geoBoundingBox(topLeft, bottomRight)`, `.geoPolygon(points)` — not yet documented anywhere in this repo.
- **`modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc`** (447 lines) — intro (1-9), `@Node` mapping
  (11-35), `@Relationship` (37-81), node inheritance with multiple labels (83-133), `Neo4jRepository` (135-173),
  `== Derived query methods` (175-195), **`== Custom Cypher with @Query`** (197-224 — no geospatial mentions),
  `== Projections` (226-252), `== Auditing` (254-288), `== Transactions` (290-348), `== Optimistic locking`
  (350-378), `== Custom queries with Neo4jClient` (380-447, final section, no trailing `== Summary`).
  No dedicated `database/` Neo4j page exists (confirmed: only brief mentions in
  `database/choosing-the-right-database.adoc`) — new section links directly to official Neo4j spatial/Cypher docs.
  - Neo4j's native `Point` type (`org.neo4j.driver.types.Point`, surfaced through Spring Data Neo4j's own
    `org.springframework.data.neo4j.types.*`/`org.neo4j.driver.types.Point`) plus Cypher `point()`/`distance()`
    functions and point indexes are not yet documented anywhere in this repo.
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — already included at the top of all three pages; no
  change needed.
- **Build/verification**: `npx antora antora-playbook.yml` (local content only) must complete with **no**
  `xref`/AsciiDoc errors; `build/` is gitignored. `iru-gate-runner` agent is installed at
  `.claude/agents/iru-gate-runner.md` for delegated verification.
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly (see choice 4 above).

## Implementation steps

### Group 1 — Author the three new sections (Parallelizable: yes — three independent files, no task depends on another's result)

- [ ] **Task 1. Add `== Geospatial queries` to `modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc`**,
      inserted between the end of `== @Query, dynamic queries, and projections` (current line 312) and the start
      of `== Transactions, optimistic locking, and auditing` (current line 314) — docs-only, no tests/coverage/
      static-analysis applicable (Antora build verified in Group 2).
  - [ ] Task 1.1. Opening paragraph: state that plain JPA/Hibernate has no built-in spatial type or query-derivation
        keyword the way Spring Data MongoDB/Neo4j do — spatial support comes from **Hibernate Spatial**
        (`org.hibernate:hibernate-spatial`) layered on top, mapping JTS (`org.locationtech.jts.geom.Point`/
        `Geometry`) types against a spatially-enabled database (PostGIS on PostgreSQL is the common case).
  - [ ] Task 1.2. `=== Mapping a JTS Point with Hibernate Spatial` sub-section: an `@Entity` with a JTS `Point`
        field, using `columnDefinition`/`@JdbcTypeCode` as needed for the dialect:
        ```java
        @Entity
        @Table(name = "places")
        public class Place {

            @Id
            @GeneratedValue(strategy = GenerationType.IDENTITY)
            private Long id;

            private String name;

            @Column(columnDefinition = "geometry(Point,4326)")
            private Point location;   // org.locationtech.jts.geom.Point
        }
        ```
        Note the `4326` SRID (WGS-84, matching GPS coordinates) is a PostGIS convention, not a Hibernate Spatial
        requirement. Link inline to
        `https://in.relation.to/2022/04/21/hibernate-spatial/[Hibernate Spatial]` and
        `https://docs.jboss.org/hibernate/orm/current/userguide/html_single/Hibernate_User_Guide.html#spatial[the
        Hibernate User Guide's spatial chapter]`.
  - [ ] Task 1.3. `=== Querying spatial columns with native and JPQL @Query` sub-section: explain that derived
        keywords (`Near`/`Within`) are **not** in Spring Data JPA's supported keyword list the way they are for
        MongoDB/Neo4j, so spatial queries go through `@Query` — native SQL where JPQL doesn't expose the dialect
        function, or JPQL directly where the provider does:
        ```java
        public interface PlaceRepository extends JpaRepository<Place, Long> {

            @Query(value = """
                    select * from places
                    where ST_DWithin(location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326), :radiusMeters)
                    """, nativeQuery = true)
            List<Place> findWithinRadius(@Param("lon") double lon, @Param("lat") double lat,
                                          @Param("radiusMeters") double radiusMeters);

            @Query(value = """
                    select p.*, ST_Distance(p.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)) as distance
                    from places p
                    order by distance
                    limit :limit
                    """, nativeQuery = true)
            List<Place> findNearest(@Param("lon") double lon, @Param("lat") double lat, @Param("limit") int limit);
        }
        ```
        Note `nativeQuery = true` is required here because PostGIS functions (`ST_DWithin`, `ST_MakePoint`,
        `ST_Distance`) are not part of JPQL's function set. Link inline to
        `https://postgis.net/docs/reference.html[the PostGIS spatial function reference]`.
  - [ ] Task 1.4. Verify the new section's two `xref:`-free (no internal cross-reference needed here, per "no
        `database/sql/` spatial page" above) links use this page's existing plain-`https://` inline-link style
        (no `== References` block, per choice 3), and read cleanly in the flow between the surrounding sections.

- [ ] **Task 2. Extend `== Full-text and vector search integration` in
      `modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc`** with a geo-specific sub-section,
      inserted after the existing `HotelSearchService` example (current line 237) and before
      `== Custom queries with CouchbaseTemplate` (current line 244) — docs-only, no tests/coverage/static-analysis
      applicable.
  - [ ] Task 2.1. `=== Geospatial queries` sub-section (nested under the existing FTS/vector-search `==` section,
        matching its established `@Query`-style-search-method-plus-SDK-builder pattern): explain that Couchbase's
        geo capability is reached the same way — through the SDK's `geoDistance`/`geoBoundingBox`/`geoPolygon`
        query builders — rather than a dedicated repository keyword or annotation. Include one repository/service
        method example running a bounding-box search against a geo-indexed field:
        ```java
        @Service
        public class HotelGeoSearchService {

            private final Cluster cluster;

            public HotelGeoSearchService(Cluster cluster) {
                this.cluster = cluster;
            }

            public SearchResult findWithinBoundingBox(String indexName, double topLeftLon, double topLeftLat,
                                                        double bottomRightLon, double bottomRightLat) {
                return cluster.searchQuery(indexName,
                        SearchQuery.geoBoundingBox(topLeftLon, topLeftLat, bottomRightLon, bottomRightLat));
            }

            public SearchResult findNearby(String indexName, double lon, double lat, double distance, String unit) {
                return cluster.searchQuery(indexName, SearchQuery.geoDistance(lon, lat, distance + unit));
            }
        }
        ```
        Cross-reference `xref:database/couchbase/search-analytics-eventing.adoc[]` (FTS geo distance/bounding-box/
        polygon query types) and `xref:database/couchbase/indexes-and-views.adoc[]` (legacy spatial views) for the
        underlying index/query theory instead of repeating it here.
  - [ ] Task 2.2. Verify the two `xref:` targets resolve (both files confirmed present in the repo) and the section
        reads as a natural continuation of the existing FTS/vector-search content, not a disconnected addition.

- [ ] **Task 3. Add `== Geospatial queries` to `modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc`**,
      inserted between the end of `== Custom Cypher with @Query` (current line 224) and the start of
      `== Projections` (current line 226) — docs-only, no tests/coverage/static-analysis applicable.
  - [ ] Task 3.1. Opening paragraph: state that Neo4j has a native `Point` spatial type (Cartesian or WGS-84/
        geographic), Cypher `point()`/`distance()` functions, and point indexes, and that Spring Data Neo4j maps
        this through its own `Point` type.
  - [ ] Task 3.2. `=== Mapping a Point field and querying with a derived Near method` sub-section: a `@Node` entity
        with a `Point` field, and a derived `Neo4jRepository` `Near` query method:
        ```java
        @Node("Place")
        public class Place {

            @Id
            @GeneratedValue(GeneratedValue.InternalIdGenerator.class)
            private Long id;

            private String name;
            private Point location;   // org.springframework.data.neo4j.types.Point (WGS-84 by default)
        }

        public interface PlaceRepository extends Neo4jRepository<Place, Long> {

            List<Place> findByLocationNear(Point point, Distance distance);
        }
        ```
        ```java
        List<Place> nearby = placeRepository.findByLocationNear(
                new Point(-3.7038, 40.4168), new Distance(5, Metrics.KILOMETERS));
        ```
  - [ ] Task 3.3. `=== Custom Cypher with point() and distance()` sub-section: an equivalent custom `@Query` using
        Cypher's `point()`/`distance()` directly, for cases the derived `Near` keyword can't express (e.g. a
        computed distance value returned alongside each match):
        ```java
        public interface PlaceRepository extends Neo4jRepository<Place, Long> {

            @Query("""
                MATCH (p:Place)
                WHERE point.distance(p.location, point({longitude: $lon, latitude: $lat})) <= $radiusMeters
                RETURN p, point.distance(p.location, point({longitude: $lon, latitude: $lat})) AS distance
                ORDER BY distance
                """)
            List<Place> findWithinRadius(@Param("lon") double lon, @Param("lat") double lat,
                                          @Param("radiusMeters") double radiusMeters);
        }
        ```
        Link inline to `https://neo4j.com/docs/cypher-manual/current/values-and-types/spatial/[Neo4j Cypher
        spatial values and functions]` and `https://docs.spring.io/spring-data/neo4j/reference/[the Spring Data
        Neo4j reference guide]`.
  - [ ] Task 3.4. Verify the section reads consistently with the surrounding derived-query/custom-Cypher sections
        (same structure as `== Derived query methods` / `== Custom Cypher with @Query` immediately above it) and
        uses this page's existing plain-`https://` inline-link style (no `== References` block, per choice 3).

### Group 2 — Build verification (Parallelizable: yes — single task; requires Group 1 complete)

- [ ] **Task 4. Verify the Antora build is clean** — delegate to `iru-gate-runner` to keep build output out of the
      main context:
      ```
      Agent({
        description: "Verify Antora build after adding geospatial sections",
        subagent_type: "iru-gate-runner",
        prompt: "Run `npx antora antora-playbook.yml` in the repository root (local content only). Report back
          whether the build succeeded, and list any xref/AsciiDoc warnings or errors verbatim, especially any
          referencing spring-data-jpa.adoc, spring-data-couchbase.adoc, spring-data-neo4j.adoc,
          search-analytics-eventing.adoc, or indexes-and-views.adoc. Do not paste the full build log."
      })
      ```
  - [ ] Task 4.1. Confirm the build exits successfully with zero xref/AsciiDoc warnings or errors.
  - [ ] Task 4.2. If any warning/error references one of the three edited pages or their cross-referenced targets,
        fix it and re-run verification before checking this task complete.
  - [ ] Task 4.3. Sanity-check each new/extended section against its acceptance criterion: JPA section has a JTS
        `Point`-mapped `@Entity` and a native `@Query` example using a PostGIS spatial function; Couchbase section
        extends the FTS pattern with a `geoDistance`/`geoBoundingBox` example and both required `xref:`s; Neo4j
        section has a `Point`-typed `@Node` field, a derived `Near` method, and a Cypher `point()`/`distance()`
        `@Query`; `spring-data-mongodb.adoc` remains untouched.
