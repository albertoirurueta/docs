# Implementation Plan: Guides & References / Backend Development — "Neo4j Use Cases" (SpringBoot Reference)

## Task summary

Source: GitHub issue #283
Base branch: main

Issue [#283](https://github.com/albertoirurueta/docs/issues/283) adds a **Neo4j Use Cases** sub-section under
**SpringBoot Reference → Spring Data Neo4j** at `modules/ROOT/pages/backend/springboot/neo4j-use-cases/`. It turns the
Cypher/GDS-only scenarios of the Neo4j Reference into complete Spring Boot 4.1.x applications (model, SDN repositories,
`Neo4jClient` Cypher/GDS/APOC calls, service + REST layers, scheduled analytics, Testcontainers tests). It is a
documentation-only change (AsciiDoc, Mermaid, SVG) — no application source code lives in this repository, so all tasks are
untagged and are implemented directly.

Choices made (challenge them in review):

* **Page split follows the issue outline as written** (index + 9 topic pages); the issue allows merges, but nothing in the
  official docs argues for a different split.
* **Delivery order**: `calling-gds-from-spring-boot` first (every use case `xref:`s it), then the six use-case pages in
  parallel, then testing/production (they cite the use-case tests), then the index/nav/back-links/bibliography, then
  verification. The index and nav are written last so no `xref:` points to a page that does not exist yet.
* **Datasets are reused verbatim** from `database/neo4j/use-cases-and-algorithms-in-practice.adoc` (fraud accounts
  `A1`–`A7`, `roads`, `services`, the recommendation dataset), so asserted results match the Neo4j page.
* **Per-page shape** (Problem → Graph model → Schema → Writes → Queries/analytics → Service & API → Integration test →
  Pitfalls) is fixed for the six use-case pages; every code listing is followed by a link to the official doc it derives
  from.
* **Modern-practice rules** (checked by Task 15): SDN 6+ only, `elementId()` never `id()`, no Neo4j-OGM, no GraphRAG /
  vector store (only a prose mention of #197 / #208 under *See also*), GDS called as Cypher through `Neo4jClient`
  (stated explicitly, there is no official Java GDS client), constructor injection, records for DTOs.
* **Version facts are verified against the official docs while writing** (Task 1): the Spring Data Neo4j / Neo4j Java
  Driver versions managed by Spring Boot 4.1, the Neo4j `2026.x` / GDS / APOC line, `Neo4jContainer` +
  `@ServiceConnection` + `NEO4J_PLUGINS`, and the *current tier and name* of every GDS procedure used (link prediction in
  particular — use production names, note alpha/beta).

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/pages/backend/springboot/neo4j-use-cases/` contains the landing page and one page per topic in the outline (or an agreed alternative split), all wired into `nav.adoc` under **Spring Data Neo4j**." | Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9, Task 10, Task 11 |
| 2 | "Fraud detection, opportunity detection and logistics/supply chain each have a dedicated page with a full Spring Boot example (model → schema → writes → queries/GDS → service/REST → Testcontainers test)." | Task 2, Task 3, Task 4 |
| 3 | "At least the identity resolution, access control and dependency/impact analysis use cases are covered as further common use cases." | Task 5, Task 6, Task 7 |
| 4 | "Every code example is followed by a link to the official documentation it derives from." | Tasks 1–9, Task 15 |
| 5 | "Datasets match the Neo4j Reference use-case page where a scenario overlaps, and the results asserted in tests match the ones stated there." | Task 2, Task 3, Task 4, Task 7, Task 15 |
| 6 | "Algorithm theory is not duplicated: pages `xref:` the Neo4j Reference and the Spring Data Neo4j page instead." | Tasks 1–9, Task 15 |
| 7 | "Mermaid diagrams and SVG figures are added where they clarify a model or flow. Every new SVG is referenced, and `npm run validate:mermaid` reports every diagram as parsed." | Tasks 2–8, Task 15 |
| 8 | "Landing-page, `:description:`/`:keywords:` and back-link updates listed above are done." | Task 11, Task 12, Task 13 |
| 9 | "The SpringBoot Reference Bibliography lists every new source used." | Task 12 |
| 10 | "`npx antora antora-playbook.yml` builds without errors, and every verification grep from `CLAUDE.md` (images, inline code substitutions for `build/site/backend/springboot`) prints nothing." | Task 14, Task 15 |
| 11 | "No GraphRAG / vector-store content (owned by #197 / #208), and no Neo4j-OGM / deprecated `id()` usage." | Task 15 |

## Current code state

This repository is the Antora playbook + root component (`antora.yml`, component `ROOT`); there is no application code.
Project type: `other` (docs-only). Build: `npx antora antora-playbook.yml`; `npm run validate:mermaid`; `CLAUDE.md`
verification greps. Repository host: GitHub (`albertoirurueta/docs`). No `.ui-quality.yml` (no UI).

Relevant existing files:

* `modules/ROOT/nav.adoc` line ~1331: `**** xref:backend/springboot/spring-data-neo4j.adoc[Spring Data Neo4j]` — the new
  index nests at `*****`, topic pages at `******`.
* `modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc` (526 lines; `:description:`/`:keywords:` header, then
  `include::partial$springboot-disclaimer.adoc[]`) — needs a one-line *See also*. It is the page to `xref:` for every
  SDN feature (`@Node`, `@Relationship`, `@RelationshipProperties`, `@Query`, projections, `Neo4jClient`,
  `@Transactional`, `@Version`, geospatial `Point`).
* `modules/ROOT/pages/backend/springboot/index.adoc` — page list (~line 68), `:description:` (line 2), `:keywords:`
  (line 3), `== Bibliography` (~line 248; Spring Data Neo4j deep links ~line 324).
* `modules/ROOT/pages/database/neo4j/use-cases-and-algorithms-in-practice.adoc` — sections *Recommendation engines*,
  *Fraud and AML ring detection* (`A1`–`A7`, WCC → Louvain → Betweenness, `A4` highest), *Routing and logistics
  optimization* (`roads`, Dijkstra), *Identity and access graphs (entity resolution)* (`apoc.refactor.mergeNodes`,
  `id(i1) < id(i2)` — the Spring version uses `elementId()`), *Root-cause and dependency analysis* (`services`,
  Betweenness, SCC), *Tying it together*. Needs one pointer line per scenario.
* `modules/ROOT/pages/database/neo4j/index.adoc` — reading guide; needs one line.
* `modules/ROOT/pages/backend/springboot/{unit-and-integration-testing,scheduling-and-shedlock,caching,spring-security,messaging-kafka,rest-apis,metrics-and-observability}.adoc`
  and `modules/ROOT/pages/database/neo4j/{graph-data-science-fundamentals,pathfinding-and-centrality-algorithms,community-detection-algorithms,similarity-embeddings-and-ml-pipelines,apoc-and-extensions,indexes-and-constraints,transactions-and-drivers,data-modeling,importing-data,clustering-and-multi-database,security-and-administration}.adoc`
  — `xref:` targets.
* `modules/ROOT/partials/springboot-disclaimer.adoc`, `neo4j-disclaimer.adoc` — included at the top of pages.
* `modules/ROOT/images/neo4j-fraud-ring-detection.svg` (reusable), plus the existing `neo4j-*.svg` files as the
  light/dark SVG style reference. New figures: `springboot-neo4j-<topic>.svg`.
* `.archive/implementation_plan_197.md` / `_198.md` (multi-page sub-section plans) were used as structural precedents.

Conventions to follow (from `CLAUDE.md`): block `image::` macros on one line with quoted alt text when it contains a
comma; inline code containing `->`, `<-`, `*`, `...`, `'`, `{`, `__`, `~`, `^` written as `` `+...+` `` (or
`pass:c[...]` when it contains `+`); Mermaid stereotypes as `&lt;&lt;x&gt;&gt;`; every SVG referenced by a page.

## Implementation steps

### Group 1 — Foundation page (Parallelizable: yes — single task)

- [x] Task 1. Write `modules/ROOT/pages/backend/springboot/neo4j-use-cases/calling-gds-from-spring-boot.adoc`
    - Written: `modules/ROOT/pages/backend/springboot/neo4j-use-cases/calling-gds-from-spring-boot.adoc`; Antora build clean, Mermaid validated (all parsed), CLAUDE.md inline-code/image greps print nothing.
  - [x] Task 1.1. Verify the version baseline against the official docs and keep the facts in the page's setup notes:
        Spring Data Neo4j and Neo4j Java Driver versions managed by Spring Boot 4.1 (dependency-versions appendix),
        `spring.neo4j.*` / `spring.data.neo4j.database` properties, `Neo4jContainer` + `@ServiceConnection` +
        `NEO4J_PLUGINS`, and the current names/tiers of the GDS procedures used by *all* pages in this section.
  - [x] Task 1.2. Cover: GDS has no official Java client (state it); projection lifecycle (project → stream / stats /
        mutate / write → drop) with a small `AutoCloseable` helper + `try/finally` and unique graph names; mapping `YIELD`
        rows to records with `Neo4jClient.query(...).fetchAs(...).mappedBy(...)` and parameter binding; transaction
        semantics (`@Transactional(readOnly = true)` routing, why long jobs do not run in a request transaction);
        `.estimate` before running and rejecting jobs that do not fit; async + scheduled execution (`@Scheduled`,
        `@Async`) with ShedLock (`xref:` scheduling page); native vs. Cypher projections (`xref:` GDS fundamentals) with
        parameter-driven subgraph filtering; short linked note on Aura managed analytics only if the current official
        docs describe it; Mermaid sequence diagram of the lifecycle.
  - [x] Task 1.3. Follow the page conventions: `:description:`/`:keywords:`, `include::partial$springboot-disclaimer.adoc[]`,
        official-doc link after every listing, `xref:` (no re-explanation) to `spring-data-neo4j.adoc`, `caching`,
        scheduling and GDS pages.

### Group 2 — Use-case pages (Parallelizable: yes — six distinct new files and six distinct new SVGs; nothing shared is edited)

Each page follows the fixed shape: Problem (with `xref:` to the Neo4j Reference section) → Graph model (figure + `@Node` /
`@Relationship` / `@RelationshipProperties`) → Schema (constraints/indexes created at startup) → Writes → Queries and
analytics → Service and API → Integration test (Testcontainers, same dataset as the Neo4j page) → Pitfalls and variations.

- [x] Task 2. Write `fraud-detection.adoc` and `modules/ROOT/images/springboot-neo4j-fraud-first-party-ring.svg`
  - [x] Task 2.1. Model: `Customer`, `Account`, `Device`, `IpAddress`, `Phone`, `Address`, `TRANSFER` as
        `@RelationshipProperties` (amount, timestamp); SVG of a first-party ring sharing device/phone/address; may reuse
        `neo4j-fraud-ring-detection.svg` for the transfer rings.
  - [x] Task 2.2. Batch ring detection (WCC → Louvain → Betweenness on `A1`–`A7`), written back as `communityId` /
        `fraudScore`, run as a scheduled job (ShedLock); shared-identifier rings with a ring-size threshold; transfer-cycle
        detection bounded by hops and time window (quantified/variable-length path patterns).
  - [x] Task 2.3. Real-time payment check endpoint (bounded N-hop neighbourhood: payee near a flagged community, shared
        device with a flagged customer) with latency notes and a Mermaid sequence diagram; optional `@KafkaListener`
        upsert with `MERGE` (`xref:` messaging page).
  - [x] Task 2.4. Testcontainers test: Louvain splits the two rings and `A4` is ranked first (`randomSeed`,
        `concurrency: 1`); assert rankings, not floats.
- [x] Task 3. Write `opportunity-detection.adoc` and `springboot-neo4j-recommendation-pipeline.svg`
  - [x] Task 3.1. Model: `Customer`, `Company`, `Product`, `Category`, `Contact`, with `PURCHASED`, `WORKS_AT`, `KNOWS`,
        `IN_CATEGORY`.
  - [x] Task 3.2. Plain-Cypher collaborative filtering as a `@Query` returning a projection; Filtered Node Similarity +
        KNN on the Neo4j page's dataset, `SIMILAR` persisted via `write` mode on a schedule and served by a cheap OLTP
        query with `@Cacheable` (`xref:` caching page).
  - [x] Task 3.3. Whitespace analysis; link prediction (common neighbours / Adamic-Adar or GDS link-prediction pipelines,
        production names, note tier if alpha/beta; `xref:` Similarity, Embeddings & ML Pipelines); warm-introduction
        shortest path over `KNOWS`; paging/ranking in the REST API.
  - [x] Task 3.4. Testcontainers test on the Neo4j page's recommendation dataset asserting the stated recommendations.
- [x] Task 4. Write `logistics-and-supply-chain.adoc`, `springboot-neo4j-road-network-route.svg`
  - [x] Task 4.1. Model: `Location` with `Point` (`xref:` SDN geospatial section), `ROAD` (`distance`, `travelTime`),
        `Warehouse`, `Supplier`, `Part`, `Product`, `Customer`, `SUPPLIES` / `PART_OF` / `SHIPS_TO`.
  - [x] Task 4.2. `GET /routes?from=&to=`: Dijkstra, A* (lat/long) and Yen's k-shortest paths on the Neo4j page's `roads`
        dataset; nearest warehouse with stock via `point.distance` + inventory filter.
  - [x] Task 4.3. Disruption-impact report (bounded variable-length traversal; Mermaid flowchart); scheduled Betweenness
        bottleneck job.
  - [x] Task 4.4. Testcontainers test asserting the route and impact result; SVG of the road network with the computed
        route highlighted.
- [x] Task 5. Write `identity-resolution.adoc` and `springboot-neo4j-identity-resolution.svg`
  - [x] Task 5.1. Model: `Identity`, `Email`, `Phone`, `Document`, `Address`, `HAS_*`, `SOURCE`; blocking-key candidate
        generation using `elementId()` (never `id()`).
  - [x] Task 5.2. Node Similarity + WCC clustering; review-queue `@Service` + REST; confirmed pair merged by
        `apoc.refactor.mergeNodes` via `Neo4jClient` in one transaction, including the `@Version` optimistic-locking and
        auditing-field interaction; pitfalls (over-merging, idempotency, provenance).
  - [x] Task 5.3. Testcontainers test (APOC enabled) asserting candidates and merge outcome.
- [x] Task 6. Write `graph-based-access-control.adoc` and `springboot-neo4j-permission-tree.svg`
  - [x] Task 6.1. Model: `User`, `Group`, `Role`, `Resource` hierarchy, `MEMBER_OF`, `HAS_ROLE`, `CAN_READ`/`CAN_WRITE`,
        `CHILD_OF`; variable-length permission-check query (inherited membership + resource hierarchy).
  - [x] Task 6.2. Spring Security integration (`@PreAuthorize("@graphAuthz.canRead(authentication, #id)")` or a custom
        `AuthorizationManager`; `xref:` Spring Security page); paged "everything this user can access"; permission-check
        caching with invalidation on membership change.
  - [x] Task 6.3. Testcontainers test asserting allow/deny across inherited groups and nested resources.
- [x] Task 7. Write `dependency-and-impact-analysis.adoc`, `springboot-neo4j-dependency-graph.svg` (or Mermaid only if SVG adds nothing)
  - [x] Task 7.1. Model: `Service`, `Database`, `Queue`, `Host`, `DEPENDS_ON` / `RUNS_ON`, reusing the Neo4j page's
        `services` dataset.
  - [x] Task 7.2. Endpoints: blast radius (upstream dependents; Mermaid flowchart), root-cause candidates (common
        downstream dependencies), critical components (Betweenness), dependency cycles (SCC); keeping the graph current
        from deployment events or a service catalog (scheduled import or Kafka).
  - [x] Task 7.3. Testcontainers test asserting the results stated on the Neo4j page.

### Group 3 — Cross-cutting pages (Parallelizable: yes — two distinct files; both only `xref:` the Group 2 pages)

- [x] Task 8. Write `testing-graph-use-cases.adoc`
  - [x] Task 8.1. `@DataNeo4jTest` slice vs. `@SpringBootTest`; `Neo4jContainer` with `@ServiceConnection` and GDS/APOC
        plugins; fixtures (Cypher scripts under `src/test/resources` or repositories) and cleanup; deterministic algorithms
        (`randomSeed`, `concurrency: 1`) and ranking-based assertions; container reuse across classes and runtime notes;
        `xref:` the testing page and the Docker/Testcontainers content.
- [x] Task 9. Write `production-considerations.adoc`
  - [x] Task 9.1. Schema management at startup (runner vs. migration tool; label Neo4j-Migrations as third-party and link
        its docs); `UNWIND` batching (`xref:` Importing Data); clusters — read/write routing, bookmarks / causal
        consistency, GDS on a dedicated analytics instance (`xref:` Clustering & Multi-Database); OLTP vs. OLAP separation;
        Micrometer driver metrics, slow-query logging, timeouts (`xref:` metrics page); least-privilege users
        (`xref:` Neo4j Security & Administration).

### Group 4 — Landing page, navigation, back-links, bibliography (Parallelizable: yes — each task edits a different file)

- [x] Task 10. Write `neo4j-use-cases/index.adoc`: what the section adds vs. the Neo4j use-case and SDN pages; Mermaid
  reference architecture (REST/Kafka → `@Service` → SDN repositories + `Neo4jClient` → Neo4j; scheduled analytics write
  scores back); shared project setup (`spring-boot-starter-data-neo4j`, connection properties, Docker Compose with GDS/APOC
  via `spring-boot-docker-compose`, Maven dependencies); repositories vs. `Neo4jClient` vs. `Neo4jTemplate`; table
  use case → algorithms → Neo4j Reference section → Spring page; *See also* mentioning #197 / #208 in prose only.
- [x] Task 11. Edit `modules/ROOT/nav.adoc`: nest the index (`*****`) and the nine topic pages (`******`) under
  `Spring Data Neo4j`, titles exactly as in the issue; make the nav, index table and page titles consistent.
- [x] Task 12. Edit `modules/ROOT/pages/backend/springboot/index.adoc`: add the section to the page list next to Spring
  Data Neo4j; extend `:description:` and `:keywords:`; extend `== Bibliography` with every new official source used (Spring
  Boot reference — Neo4j, Docker Compose, Testcontainers; Cypher Manual; GDS manual; APOC; Neo4j Java Driver manual;
  Testcontainers Neo4j module; Neo4j use-case/developer guides labelled **vendor guides**; any third-party tool labelled as
  such) and deep SDN links used.
- [x] Task 13. Add back-links: *See also* line in `spring-data-neo4j.adoc`; one line per scenario plus a sentence in
  *Tying it together* in `database/neo4j/use-cases-and-algorithms-in-practice.adoc`; one reading-guide line in
  `database/neo4j/index.adoc`.

### Group 5 — Verification (Parallelizable: no — depends on every previous group)

- [x] Task 14. Build: `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors for the new section and
  `build/site/backend/springboot/neo4j-use-cases/` renders; run `npm i --no-save mermaid@11 jsdom` then
  `npm run validate:mermaid` (every diagram parsed).
- [x] Task 15. Run the `CLAUDE.md` verification greps (all must print nothing): unclosed block/inline image macros,
  `<p>image::` in `build/site`, unquoted-comma alt text on the changed files, inline-code substitution grep on
  `build/site/backend/springboot`; also scan the rendered text for stray backticks / `+` / `[[x]]` defects; check that every
  new `springboot-neo4j-*.svg` is referenced and every `image::` target exists; grep the new pages for `id(`, `@NodeEntity`,
  `SessionFactory`, `Neo4j-OGM`, `GraphRAG`, `vector` (must be absent except the permitted prose mention of #197 / #208);
  confirm every listing has a following official-doc link and no algorithm theory is duplicated.
