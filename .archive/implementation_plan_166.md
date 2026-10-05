# Implementation Plan: Move "Resilience" to Backend Development and extend it with Bucket4j

## Task summary

Source: GitHub issue #166
Base branch: main

Issue [#166](https://github.com/albertoirurueta/docs/issues/166) **extends** the Resilience sub-section created by #156
(merged on `main` in a4c3946a) with **Bucket4j 8.21.0** as an
additional, mostly complementary option next to Resilience4j: local and distributed token-bucket rate limiting, Spring Boot
integration (manual filter/interceptor, the community **bucket4j-spring-boot-starter**, Spring Cloud Gateway) and a
Resilience4j-vs-Bucket4j comparison.

**Relocation (user decision, 2026-10-04).** Before adding Bucket4j, the whole Resilience section moves **out of the
SpringBoot Reference** to its own entry under **Guides & References → Backend Development**: pages move from
`modules/ROOT/pages/backend/springboot/resilience/` to `modules/ROOT/pages/backend/resilience/`, the nav entry moves from
under `SpringBoot Reference` (`****`/`*****`) to directly under `Backend Development` (`***`/`****`), placed right after
`SpringBoot Reference`, and every `springboot-resilience-*` asset drops its `springboot-` prefix. All Bucket4j work then
lands in the new location. Every path in the issue body that says `backend/springboot/resilience/` (or an asset named
`springboot-resilience-*` / `springboot-bucket4j-*`) is read as the relocated equivalent below; a comment on #166 records this.

The extension ships:

* 13 new pages in the same directory: `resilience4j-vs-bucket4j.adoc` plus 12 `bucket4j-*.adoc` pages (overview, token
  bucket, bucket API, distributed, backends, manual Spring Boot integration, starter, Spring Cloud Gateway, observability,
  testing, production checklist, migration and what's changed)
* original SVGs `modules/ROOT/images/resilience-bucket4j-*.svg` and Mermaid diagrams (at least every 📊 in the issue)
* edits to #156's extension points: nav list, `index.adoc` (alternatives group, reading path, Bookshelf, description/keywords,
  Bibliography), `rate-limiter.adoc` (`== Beyond in-process rate limiting`), `resilience-fundamentals.adoc`,
  `gateway-and-openfeign.adoc`, and one-line back-links elsewhere
* `cheat-sheet.adoc` updated to offer **two** PDFs: the re-rendered `resilience-cheat-sheet.pdf` (reserved
  "Alternatives" box filled) and the new `resilience-bucket4j-cheat-sheet.pdf`

The issue body is the binding spec (`gh issue view 166`: "Page outline", "Extension points used", "Cheat sheets",
"Bibliography", "Acceptance criteria", and the "stale docs" table in Context). Every page task must re-read its page's
bullets and cover **every** bullet.

**Out of scope:** re-documenting existing material (link instead); #184 (API managers/gateways) is mentioned in prose only,
never via `xref:`.

### Relocation decisions (user-confirmed)

* New directory `modules/ROOT/pages/backend/resilience/`; nav entry `*** xref:backend/resilience/index.adoc[Resilience]`
  directly after the SpringBoot Reference block, children at `****`.
* Assets renamed: `partials/springboot-resilience-disclaimer.adoc` → `partials/resilience-disclaimer.adoc`;
  `images/springboot-resilience-*.svg` → `images/resilience-*.svg` (new Bucket4j figures: `images/resilience-bucket4j-*.svg`);
  `attachments/springboot-resilience-cheat-sheet.pdf` → `attachments/resilience-cheat-sheet.pdf`; new Bucket4j PDF
  `attachments/resilience-bucket4j-cheat-sheet.pdf`.
* Old page URLs keep working through `:page-aliases: backend/springboot/resilience/<page>.adoc` on every moved page (the
  site's existing precedent, e.g. `programming-languages/python/collections.adoc`). The old PDF URL is not preserved
  (Antora aliases only cover pages).
* The SpringBoot Reference keeps a short `=== Resilience` pointer to the new section rather than owning it.
* Moved with `git mv` so history follows the files; content is otherwise unchanged in the move step.

### Choices made on the user's behalf

1. **Branch:** `feature/166-bucket4j` (user-confirmed), based on `main`, single draft PR to `main` with `Closes #166`.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet` and
   `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly. Java/YAML/SQL in pages is
   illustrative content, but every example must be compiled and run in a scratch project (Task 5).
3. **Disclaimer:** reuse `partials/resilience-disclaimer.adoc` (no new partial). It is the only admonition on any
   page; community-project status, deprecations, version caveats and doc discrepancies are prose or table rows.
4. **Source of truth is the Bucket4j 8.21.0 source and release notes**, not the reference alone. Every default, signature and
   behaviour is checked against the `8.21.0` tag; discrepancies are stated in prose/table rows and collected in
   `bucket4j-migration-and-whats-changed.adoc`. Only non-deprecated API is used in examples.
5. **Starter version:** pages state which starter version they use (0.14.0 for Boot 4.0 / 0.20.0-RC1 for Boot 4.1) and
   re-check Maven Central for a GA at implementation time.
6. **Running scenario is the extended *Bookshelf*** (API-key plans in Redis/Lettuce, shared ISBN outbound quota, 5-token search
   endpoint, PostgreSQL variant, Gateway MVC per-client limits).
7. **Within-section links are real `xref:`s** (the whole extension lands in one PR); `index.adoc`, `cheat-sheet.adoc` and the
   comparison page are written after the pages they link. Every `xref:` outside the section is verified with `ls`.
8. **PDF source:** the #156 HTML source was not committed, so the Resilience4j sheet is re-created from the existing PDF
   (render it to PNG to copy the layout) and #156's PR description; only PDFs are committed.

### Lessons from earlier section reviews (#156, #198, #199, #230) — mandatory for every page task

**Verify every name against the official page or the 8.21.0 source before writing it** (class, method, property key, default,
import path, artifact id, version); if unconfirmed, describe the behaviour without naming it. **Security is correctness:** no
real secrets or real third-party endpoints. **Every concept gets at least one code example**, each followed by a `Source:` link
(also listed in `== References`). **Run the examples** in the scratch project. **URL hygiene:** canonical URLs only
(`bucket4j.com/8.21.0/...`, not `bucket4j.github.io`). **Cross-links accurate:** never `xref:` to a non-existent page; no
`xref:` inside backticks; no empty link text on a fragment xref. **AsciiDoc hygiene:** `.Title` captions; no leaked authoring
notes; `{placeholders}` literal inside `[source]` blocks and escaped in prose; no prose line starting with `<digits>.`.

## Current code state

* **Repo:** Antora root component `irurueta`; pages `modules/ROOT/pages/`, nav `modules/ROOT/nav.adoc`, partials
  `modules/ROOT/partials/`, images `modules/ROOT/images/`, PDFs `modules/ROOT/attachments/`. No `docs/` subdirectory.
* **Before the move:** `modules/ROOT/pages/backend/springboot/resilience/` has 23 files from #156: 21 Resilience4j pages + `index.adoc` +
  `cheat-sheet.adoc`. No `bucket4j-*` file exists. `partials/springboot-resilience-disclaimer.adoc` exists (its xref points at the old index), plus 12
  `images/springboot-resilience-*.svg` and `attachments/springboot-resilience-cheat-sheet.pdf`. 485 occurrences of
  `backend/springboot/resilience/` live in 38 files: the 23 section pages, the partial, `nav.adoc`, and 13 pages outside the
  section (`backend/springboot/{index,cheat-sheet,near-far-caches}.adoc`, `backend/quarkus/{fault-tolerance-and-resilience,
  quarkus-vs-spring-boot}.adoc`, `backend/architecture/decisions-and-migrations/{benefits-and-drawbacks,api-gateway-and-bff}.adoc`,
  `backend/spring-batch/{fault-tolerance-skip-and-retry,cloud-native-batch}.adoc`, `backend/nestjs/resilience-idempotency-and-locks.adoc`,
  `web/aspnet/core/http-client-and-resilience.adoc`, `ai/spring-ai/production-and-deployment.adoc`,
  `cloud/google-cloud/mongodb-on-google-cloud.adoc`). `partials/resilience-disclaimer.adoc` and `pages/backend/resilience/` do
  not exist yet.
* **`modules/ROOT/nav.adoc`:** `** xref:backend/index.adoc[Backend Development]` (l.684) with `***` children; SpringBoot Reference at
  l.824, GraphQL Reference at l.887. Lines 855–877 are today's Resilience entry (`****`) and its `*****` children inside the
  SpringBoot block; the last Resilience4j page is `migration-and-whats-changed.adoc` (l.876), then `cheat-sheet.adoc` (l.877).
* **`resilience/index.adoc` (646 lines):** `=== Alternatives and complementary libraries` (l.464) holds a placeholder sentence
  naming #166; `== The Bookshelf scenario` (l.75), `== Reading path` (l.318), `== What's covered` (l.373), `== Bibliography`
  (l.523, groups through "Specifications and standards" l.630), `== References` (l.636); long `:description:`/`:keywords:`.
* **`rate-limiter.adoc`:** `== Beyond in-process rate limiting` ends (≈l.870) with prose naming #166 and #184 — gains `xref:`s to
  `resilience4j-vs-bucket4j.adoc` and `bucket4j-distributed-rate-limiting.adoc`.
* **Prose mentions of #166 to convert:** `resilience-fundamentals.adoc` l.440–441 ("same idea in other stacks"),
  `gateway-and-openfeign.adoc` l.579–582 (Web MVC Bucket4j limiter).
* **`cheat-sheet.adoc` (63 lines):** disclaimer, intro linking `attachment$resilience-cheat-sheet.pdf`, grouped
  `*Group* --` xref paragraphs, one download line, `== References`. PDF at `attachments/resilience-cheat-sheet.pdf`.
* **Outside the section:** `backend/springboot/index.adoc` (`=== Resilience` at l.188, `:keywords:`, bibliography entry l.257),
  `backend/springboot/cheat-sheet.adoc` l.68, `backend/index.adoc` (one bullet per Backend Development entry; SpringBoot bullet
  l.40–48 says "resilience with Resilience4j"; `:description:` l.2 lists the entries).
* **Back-link targets named in the issue (verify each exists):** `database/redis/use-cases-and-patterns.adoc`,
  `database/redis/spring-boot-redis-as-a-cache.adoc`, `backend/springboot/{configuration-and-profiles,spring-security,rest-apis,
  metrics-and-observability,unit-and-integration-testing}.adoc`, `backend/docker/spring-boot-integration-tests-with-testcontainers.adoc`,
  `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`, `ai/spring-ai/production-and-deployment.adoc`,
  `web/aspnet/core/performance-and-caching.adoc`, `backend/quarkus/fault-tolerance-and-resilience.adoc`,
  `backend/nestjs/resilience-idempotency-and-locks.adoc`.
* **Precedents:** `.archive/implementation_plan_156.md` (same section, same group structure), `_230`, `_199`, `_237`, `_253`.
* **Tooling:** `npx antora antora-playbook.yml` (or `/iru-build-docs`), `npm run validate:mermaid`
  (`scripts/validate-mermaid.mjs`), headless Chrome + `pdfinfo` for PDFs; JDK 21 + Maven for the scratch project (check
  `java -version`, `mvn -v`; Docker needed for Testcontainers examples).

## Conventions every page task must follow

* Path `modules/ROOT/pages/backend/resilience/<page>.adoc` (new pages need no `:page-aliases:`). Header: `= <Title>`,
  `:description:`, `:keywords:`, then
  `include::partial$resilience-disclaimer.adoc[]`.
* Intro states versions: Bucket4j 8.21.x, Spring Boot 4.1.x, Spring Framework 7.0.x, Java 21 (and starter / Spring Cloud Gateway
  version where relevant), verified date.
* Explain each concept in detail: what and why, how Bucket4j implements it, the full API surface or every property with
  8.21.0 defaults, exceptions/events/metrics, pitfalls.
* Examples: `[source,java]` (non-deprecated 8.x API only), `[source,yaml]`, `[source,xml]` (+ Gradle Kotlin DSL on the overview
  page), `[source,sql]` for JDBC DDL, `curl` with response headers plus `[source,json]` for ProblemDetail/Actuator; each
  followed by `Source: https://bucket4j.com/8.21.0/toc.html#<anchor>[Bucket4j reference: <topic>]`, plus the 8.21.0 source file
  where the reference is stale.
* ★★ pages (`resilience4j-vs-bucket4j`, `bucket4j-distributed-rate-limiting`, `bucket4j-spring-boot-manual-integration`,
  `bucket4j-spring-boot-starter`, `bucket4j-testing`): ≥2 diagrams, a worked *Bookshelf* example, a pitfalls table, a "what
  changed" subsection. ★ pages carry the 📊 diagrams listed in the issue.
* End with `== References` (official docs only). Mermaid as `[mermaid]` blocks (math via `\( \)`/`\[ \]`); SVGs in
  `modules/ROOT/images/resilience-bucket4j-*.svg` referenced with `image::`; SVGs are original drawings (no Bucket4j
  logo or figures from its docs).
* No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` anywhere except the partial include.
* Each page task: verify against `gh issue view 166`, run its examples in the scratch project, validate its Mermaid blocks with
  `npm run validate:mermaid`.

## Implementation steps

### Group 1 — Relocate the Resilience section to Backend Development

**Parallelizable: no — Task 2 validates the move Task 1 performs, and every later group writes into the new location**

- [x] Task 1. Move the section and its assets.
  - [x] Task 1.1. `git mv modules/ROOT/pages/backend/springboot/resilience modules/ROOT/pages/backend/resilience`;
    `git mv partials/springboot-resilience-disclaimer.adoc partials/resilience-disclaimer.adoc`; `git mv` each of the 12
    `images/springboot-resilience-*.svg` to `images/resilience-*.svg`; `git mv attachments/springboot-resilience-cheat-sheet.pdf
    attachments/resilience-cheat-sheet.pdf`.
  - [x] Task 1.2. Rewrite references across `modules/ROOT` (pages, partials, `nav.adoc`): `backend/springboot/resilience/` →
    `backend/resilience/`, `springboot-resilience-disclaimer.adoc` → `resilience-disclaimer.adoc`, `springboot-resilience-` image
    names → `resilience-`, `springboot-resilience-cheat-sheet.pdf` → `resilience-cheat-sheet.pdf`. Check afterwards with
    `grep -rn 'springboot/resilience\|springboot-resilience' modules/ROOT` that only intended hits remain (the `:page-aliases:`
    lines). Watch for relative `xref:`s or `image::` paths and for mentions inside SVG text.
  - [x] Task 1.3. Add `:page-aliases: backend/springboot/resilience/<same-name>.adoc` to the header of each of the 23 moved pages
    (after `:keywords:`, matching the existing precedent's placement).
  - [x] Task 1.4. `nav.adoc`: cut the Resilience block (old l.855–877) out of the SpringBoot Reference list and re-insert it
    directly after the last line of the SpringBoot Reference block (before `*** xref:backend/graphql/index.adoc[GraphQL Reference]`),
    with one level less depth: `*** xref:backend/resilience/index.adoc[Resilience]` and `****` children.
  - [x] Task 1.5. Reword for the new home, without otherwise changing content: `resilience/index.adoc` intro (a Backend
    Development section focused on Spring Boot services, no longer "part of the SpringBoot Reference"), and any "this sub-section of
    the SpringBoot Reference" wording in the moved pages/partial; keep the page titles.
  - [x] Task 1.6. `backend/index.adoc`: add a `* xref:backend/resilience/index.adoc[Resilience] -- …` bullet right after the
    SpringBoot Reference bullet and mention Resilience in `:description:`; reword the SpringBoot bullet's "resilience with
    Resilience4j" into a pointer to the new section. `backend/springboot/index.adoc`: keep `=== Resilience` as a short pointer to
    the relocated section (updated xref) and keep its bibliography entry pointing at the new `#_bibliography`.
    `backend/springboot/cheat-sheet.adoc` l.68: updated xref.
- [x] Task 2. Validate the move before any Bucket4j content is added.
  - [x] Task 2.1. Run `/iru-build-docs` (`npx antora antora-playbook.yml`): no `xref`/include/image errors; the section renders at
    `build/site/irurueta/backend/resilience/` and each old URL under `backend/springboot/resilience/` is a redirect.
  - [x] Task 2.2. `npm run validate:mermaid`; spot-check images and the PDF link on the moved pages; `git status` shows renames
    (`R`), not delete+add, for the moved files.

### Group 2 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 3. Verify and record the version baseline (scratchpad `166/versions-166.md`) that every later task cites.
  - [x] Task 3.1. Re-read Maven Central metadata for `com.bucket4j` (`bucket4j_jdk17-core`, `-bom`, every backend module,
    `bucket4j_jdk11-core`, `bucket4j_jdk8-core`, legacy `bucket4j-core`), the GitHub 8.21.0 release/tag and open 9.x milestones,
    and the `MarcGiffing` starter releases/Maven Central (0.13.0, 0.14.0, 0.20.0-RC1, any GA); Spring Boot, Spring Framework,
    Spring Cloud / Spring Cloud Gateway (managed Bucket4j version) and Resilience4j versions. State the date.
  - [x] Task 3.2. `curl -sIL` every URL in the issue's Bibliography; record canonical forms and non-200s (including every
    `bucket4j.com/8.21.0/toc.html#...` anchor, by fetching the page and checking the ids).
  - [x] Task 3.3. Clone `bucket4j/bucket4j` at tag `8.21.0` (scratchpad) and the starter at the tag matching each version used, for
    source lookups: `Bucket.java`, `Bandwidth`/`BandwidthBuilder`, `SynchronizationStrategy`, `Optimizations`, `RetryStrategies`,
    `Bucket4jXxx` builders, `TokensInheritanceStrategy`, `BucketListener`, `TimeMeter`, the JDBC/Redis modules and the Javadoc.
- [x] Task 4. Resolve the issue's open points by running code and reading sources; record outcomes in `versions-166.md`.
  - [x] Task 4.1. Every row of the Context "stale docs" table, confirmed against 8.21.0 (deprecations, `addLimit` vs
    `Bandwidth.builder(limit -> …)`, `TimeMeter.isWallClockBased`, client-side settings, Infinispan type, `Bucket.consume()`,
    clock-skew behaviour per backend, JDK 11 artifacts, Caffeine module, `MathType`, `SynchronizationStrategy`).
  - [x] Task 4.2. Starter facts per version: property defaults (`filter-order` default, `strategy`, `cache-to-use` values),
    `@RateLimiting` attributes, headers sent, metrics names, Actuator endpoint, Lettuce `RedisClient` bean requirement, README
    discrepancies.
  - [x] Task 4.3. Spring Cloud Gateway 5.0.x: `Bucket4jFilterFunctions` parameters and defaults, the WebFlux
    `bucket4j-rate-limiter.*` arguments, `deny-empty-key` prefix, managed Bucket4j version.
- [x] Task 5. Create the throw-away scratch project in the scratchpad (never committed).
  - [x] Task 5.1. Spring Boot 4.1.x, Java 21, Maven: `bucket4j_jdk17-bom`, `-core`, `-redis-common` + `-lettuce`, `-postgresql`,
    `-jcache`/Caffeine, Redis and PostgreSQL via Testcontainers, `spring-boot-starter-web`/`-webflux`/`-security`/`-actuator`/`-flyway`,
    micrometer-registry-prometheus, `spring-boot-starter-test`, Toxiproxy, `resilience4j-spring-boot4` (for the combined example).
  - [x] Task 5.2. Second module with the starter (`bucket4j-spring-boot-starter` at the version matching Boot) and a third with
    Spring Cloud Gateway Server Web MVC + Bucket4j.
  - [x] Task 5.3. Build the extended *Bookshelf* skeleton incrementally as page tasks need it (plans by API key, ISBN quota
    bucket, 5-token search endpoint, PostgreSQL variant).

### Group 3 — Bucket4j core pages

**Parallelizable: yes (three independent pages; `index.adoc` is written in Group 8)**

- [x] Task 6. Create `bucket4j-overview-and-getting-started.adoc` (★).
  - [x] Task 6.1. Page content per the issue: what Bucket4j is (library, not framework), use cases, the 8.21.0 module table
    (core + every backend, BOM, jdk8/jdk11/legacy artifact history), Maven and Gradle Kotlin DSL with `bucket4j_jdk17-bom`,
    first local bucket on *Bookshelf*, ecosystem (starter as community project recommended by Bucket4j's README, Spring Cloud
    Gateway, commercial Java 8 builds), reading path.
  - [x] Task 6.2. Mermaid module map (core → local / distributed → backends → Spring integrations); examples run in scratch project. -- scratch tests `OverviewPageExampleTest` (2) pass; Mermaid module map validated.
- [x] Task 7. Create `bucket4j-token-bucket-and-bandwidths.adoc` (★).
  - [x] Task 7.1. Token-bucket algorithm and comparison with fixed/sliding window and leaky bucket, MathJax formula
    `\(\text{tokens}(t) = \min(C,\ \text{tokens}(t_0) + r\,(t - t_0))\)`; `Bandwidth.builder()` with `capacity`, `refillGreedy`,
    `refillIntervally`, `refillIntervallyAligned`, `refillIntervallyAlignedWithAdaptiveInitialTokens` (formula and restrictions),
    `initialTokens`, `id`, `withNanosecondPrecision`; several bandwidths per bucket; long-period/short-burst advice (2× burst,
    ~40 bytes); technical limitations; mapping table from deprecated `Bandwidth.simple/classic`/`Refill.*` to the new API.
  - [x] Task 7.2. SVG `resilience-bucket4j-refill-styles.svg` (greedy vs intervally vs aligned) and
    `resilience-bucket4j-two-bandwidths.svg`; render and inspect both. -- both SVGs rendered with headless Chrome and inspected; `CorePagesExamplesTest` covers every number on the page.
- [x] Task 8. Create `bucket4j-bucket-api.adoc` (★).
  - [x] Task 8.1. `Bucket.builder()`, `addLimit`/`addLimit(limit -> …)`, `tryConsume`, `tryConsumeAndReturnRemaining` +
    `ConsumptionProbe`, `estimateAbilityToConsume`, `tryConsumeAsMuchAsPossible`, `addTokens` vs `forceAddTokens`, `reset`,
    `getAvailableTokens`, verbose API, blocking API (`BlockingStrategy`, `UninterruptibleBlockingStrategy`, max wait; virtual
    threads linked), scheduling API, `replaceConfiguration` with every `TokensInheritanceStrategy` (formulas, bandwidth ids),
    `BucketListener`/`SimpleBucketListener` and corner cases, `TimeMeter` (incl. `isWallClockBased`), `SynchronizationStrategy`,
    weighted consumption for the 5-token search endpoint.
  - [x] Task 8.2. Mermaid sequence of `tryConsumeAndReturnRemaining` → 429 + `Retry-After` from `getNanosToWaitForRefill`. -- sequence diagram validated (`npm run validate:mermaid`: 1147 diagrams OK); `CorePagesExamplesTest` (24 tests) pass.

### Group 4 — Distributed rate limiting

**Parallelizable: yes (two independent pages)**

- [x] Task 9. Create `bucket4j-distributed-rate-limiting.adoc` (★★).
  - [x] Task 9.1. Content per the issue: per-instance vs shared limits (ISBN quota example), `ProxyManager`/`AsyncProxyManager`
    API, `RemoteBucketBuilder` methods, atomicity models, client-side settings (`requestTimeout`, `maxRetries`, `retryStrategy`,
    `clientClock`, `expirationAfterWrite` strategies, `backwardCompatibleWith`, `defaultListener`, `defaultRecoveryStrategy`), key
    design and cardinality/expiration/hot keys, implicit configuration replacement, optimizations (`batching`, `delaying`,
    `predicting`, skip-sync-on-zero, manual syncing, reuse rule), async API, clock skew per backend, latency/throughput, distributed
    checklist and FAQ. -- page written; every example run (scratch `DistributedPagesIT`, 16 tests incl. Redis 7 and PostgreSQL 17 Testcontainers, pass).
  - [x] Task 9.2. Diagrams: Mermaid CAS sequence against Redis, SVG `resilience-bucket4j-shared-vs-per-instance.svg`,
    Mermaid implicit-replacement flow; worked *Bookshelf* example; pitfalls table; "what changed" (8.17–8.21 entry points). -- Mermaid CAS sequence and implicit-replacement flow validated (`npm run validate:mermaid`: 1149 diagrams OK); SVG rendered with headless Chrome and inspected.
- [x] Task 10. Create `bucket4j-backends.adoc` (★).
  - [x] Task 10.1. Backend table (artifact, builder entry point, atomicity, async, expiration, reference anchor) for every 8.21.0
    module; Redis in depth (redis-common + client, CAS, `withMapper`, Cluster); JDBC in depth (DDL per database, custom names,
    `PrimaryKeyMapper`, `removeExpired(n)`, no async, Flyway migration); JCache, Hazelcast, Ignite thick/thin, Infinispan Hot Rod,
    Coherence; MongoDB, Couchbase, Memcached, Cassandra, Geode, Vert.x, GLIDE; Caffeine; DynamoDB legacy; choosing a backend. -- page written from 8.21.0 sources; Redis (incl. single-node Cluster), PostgreSQL, JCache/Caffeine and Caffeine module examples run (`DistributedPagesIT`, `BackendsPageExamplesTest`); other backends read from source, not run.
  - [x] Task 10.2. SVG `resilience-bucket4j-backend-map.svg` grouped by atomicity model. Run the Redis and PostgreSQL
    examples against Testcontainers. -- SVG rendered with headless Chrome and inspected; Redis and PostgreSQL Testcontainers examples pass.

### Group 5 — Spring Boot integration

**Parallelizable: yes (three independent pages)**

- [x] Task 11. Create `bucket4j-spring-boot-manual-integration.adoc` (★★).
  - [x] Task 11.1. Content per the issue: BOM dependencies, `@ConfigurationProperties` plans, `ProxyManager` `@Bean` (Lettuce from
    `spring.data.redis.*`, JDBC variant with Flyway), servlet filter vs `HandlerInterceptor` and `FilterRegistrationBean` order,
    WebFlux `WebFilter` with `AsyncProxyManager`, key resolution (API key, principal, client IP behind proxies), ordering vs the
    Spring Security chain, per-plan `BucketConfiguration` suppliers, responses (429, `Retry-After`, `X-Rate-Limit-*`, RFC 9457
    `ProblemDetail`, IETF `RateLimit` draft), method-level limiter (annotation + aspect), shared outbound ISBN quota in a
    `ClientHttpRequestInterceptor`, backend-down handling (recovery strategy, Resilience4j CircuitBreaker, fail-open/closed),
    virtual threads.
  - [x] Task 11.2. Mermaid request path (Security → rate-limit filter → controller) and rejected-request sequence; pitfalls table; -- 26 scratch tests pass (core-app, Redis/PostgreSQL Testcontainers); Mermaid validated.
    "what changed"; every example run in the scratch project.
- [x] Task 12. Create `bucket4j-spring-boot-starter.adoc` (★★).
  - [x] Task 12.1. Content per the issue: community-project status (prose, no admonition), version matrix and GA re-check,
    migration guide, **every** property (`bucket4j.enabled`, `filters[]` incl. `filter-order` default and the before-Security
    consequence, `rate-limits[]`, `bandwidths[]`, response/metrics properties, `cache-to-use` values, `default-metric-tags`),
    method-level `@RateLimiting`/`@IgnoreRateLimiting`/`bucket4j.methods[]`, Lettuce `RedisClient` bean requirement, dynamic
    configuration updates, headers sent (and adding `Retry-After`/ProblemDetail), metrics and Actuator endpoint, README
    discrepancies, complete *Bookshelf* YAML, starter vs manual decision table.
  - [x] Task 12.2. Mermaid configuration-resolution diagram and SVG `resilience-bucket4j-starter-filter-order.svg`; -- 33 scratch tests pass on starter 0.20.0-RC1 (+0.14.0, reactive, PostgreSQL apps); Mermaid validated; SVG rendered and inspected.
    pitfalls table; "what changed".
- [x] Task 13. Create `bucket4j-spring-cloud-gateway.adoc` (★).
  - [x] Task 13.1. Web MVC `Bucket4jFilterFunctions.rateLimit(...)` (parameters/defaults, `AsyncProxyManager` bean, missing key →
    403, Java-only config), WebFlux Bucket4j limiter arguments and `deny-empty-key` prefix, contrast with the Redis
    `RequestRateLimiter`, version alignment (managed 8.15.0 vs 8.21.0), edge vs in-service limits with links to
    `gateway-and-openfeign.adoc` and `api-gateway-and-bff.adoc`; #184 in prose only.
  - [x] Task 13.2. Mermaid gateway → `bookshelf-service` with per-client limits at both layers; run the Web MVC example. -- gateway MVC/WebFlux/Redis scratch tests pass (11 + 11 + 2 + 2); Mermaid validated.

### Group 6 — Quality and operations pages

**Parallelizable: yes (four independent pages)**

- [x] Task 14. Create `bucket4j-observability.adoc` (★): Micrometer through `BucketListener` and a `ProxyManager` default listener,
  starter meters and Actuator endpoint, Prometheus naming, Grafana panel set, alerting, logging/tracing of 429s, what Resilience4j
  Actuator/health gives that Bucket4j doesn't plus a custom backend `HealthIndicator` (link `observability.adoc`); SVG
  `resilience-bucket4j-metrics-pipeline.svg`. -- page + SVG written; scratch `obs-app` (`ObsMetricsTest` 2, `ObsRedisIT` 1 with Redis Testcontainers) pass; alert rules checked with `promtool`; SVG rendered and inspected; Mermaid validated.
- [x] Task 15. Create `bucket4j-testing.adoc` (★★): custom `TimeMeter` unit tests, `MockMvc`/`WebTestClient` assertions on
  429/`Retry-After`/remaining headers, concurrency tests for no over-consumption, Testcontainers Redis/PostgreSQL, testing implicit
  replacement, Toxiproxy outage with fail-open/closed, tiny-bandwidth test profile, testing the starter YAML; Mermaid test topology
  plus a second diagram; pitfalls table; "what changed". All tests actually run in the scratch project. -- 24 scratch tests pass (`testing-app` 14 + 5 Failsafe ITs with Redis/PostgreSQL/Toxiproxy containers, `testing-starter-app` 5); Mermaid validated.
- [x] Task 16. Create `bucket4j-production-checklist.adoc` (★): official generic and distributed checklists, the eight anti-patterns
  in the issue, capacity planning (one round trip per request), JDBC cleanup, security (brute-force login limits, API keys). -- scratch `ops-app` 28 tests pass (Redis + PostgreSQL Testcontainers); measured Lettuce CAS = 2 round trips per consumed request (stated in prose); Mermaid validated.
- [x] Task 17. Create `bucket4j-migration-and-whats-changed.adoc`: 7.x → 8.x, 8.5 builder with old → new table, 8.11.1 JDK 17 and
  artifact rename, 8.17–8.21 builder entry points, starter 0.12 → 0.13 → 0.14 → 0.20, and the **full discrepancy table** from the
  issue's Context (prose/table only). -- 39-row discrepancy table folded from the issue and every Bucket4j page; scratch `migration-app` 7 tests (old vs new API equivalence) pass.

### Group 7 — Comparison page

**Parallelizable: yes (single task; written after Groups 3–6 so every `xref:` resolves)**

- [x] Task 18. Create `resilience4j-vs-bucket4j.adoc` (★★).
  - [x] Task 18.1. Content per the issue: what each library is for (outbound toolkit vs inbound/outbound quotas), algorithms side by
    side incl. burst at cycle boundaries, the feature comparison table (all five row groups, each row linked to both official docs),
    decision guide, using both together (inbound Bucket4j, outbound Resilience4j; CircuitBreaker + TimeLimiter around the
    `ProxyManager`; fail-open/closed linked to `fallbacks-and-composition.adoc`; Retry honouring `Retry-After`), and the "same idea
    in other stacks" table (ASP.NET Core, `@nestjs/throttler`, SmallRye, Redis Lua token bucket, Gateway `RequestRateLimiter`).
  - [x] Task 18.2. Diagrams: SVG `resilience-bucket4j-placement-map.svg`, Mermaid cycle-vs-token-bucket timeline, Mermaid
    decision flowchart; worked example; pitfalls table; "what changed". Demonstrate the combined example in the scratch project. -- page written; scratch `compare-app` 3 tests pass (`BurstComparisonTest`, `CombinedFailClosedIT`, `CombinedFailOpenIT` with Redis 7 Testcontainers); Mermaid validated (1161 diagrams OK); SVG rendered with headless Chrome and inspected; Antora build has no errors or warnings (all forward xrefs resolve).

### Group 8 — Landing page, bibliography and cheat sheets

**Parallelizable: no — `index.adoc` and `cheat-sheet.adoc` link every page written in Groups 3–7, and the PDFs summarise them**

- [x] Task 19. Extend `resilience/index.adoc`.
  - [x] Task 19.1. Replace the placeholder under `=== Alternatives and complementary libraries` with grouped bullets linking every
    Bucket4j page; add Bucket4j to the reading path and the *Bookshelf* scenario; add Bucket4j terms to `:description:`/`:keywords:`;
    update the intro/baseline wording that says Bucket4j is out of scope. -- Alternatives group (5 sub-groups, all 13 pages), Bucket4j Bookshelf table (facts aligned with the pages: free 20/min, ISBN 1 000/day), reading path + mindmap, intro + 3 baseline rows; Antora clean.
  - [x] Task 19.2. Append the Bucket4j groups to `== Bibliography` (official Bucket4j reference anchors, project resources,
    starter, new Spring docs, related projects, specifications) using the canonical URLs verified in Task 3.2. -- 6 new groups, all 67 anchors; 7 new 8.21.0 source-file URLs checked 200; References extended.
- [x] Task 20. Update `cheat-sheet.adoc` to the two-PDF layout: intro links both `attachment$` PDFs and states both version
  baselines; add the five `*Bucket4j*` groups with `xref:`s to every new page; two final download lines; extend `== References`;
  update `:description:`/`:keywords:`. -- both `attachment$` links resolve in build/site; 0 unresolved xrefs.
- [x] Task 21. Re-render `attachments/resilience-cheat-sheet.pdf` with the reserved "Alternatives" box filled (5-row
  Resilience4j vs Bucket4j mini-table: scope, algorithm, distributed, per-key, other patterns; pointer to the Bucket4j sheet). Rest
  unchanged; `pdfinfo` must report exactly 1 A4 page; inspect as PNG for overflow. HTML source stays in the scratchpad. -- rebuilt from the original #156 HTML (found in an old scratchpad, identical PDF); only the Alternatives box and the breadcrumb (SpringBoot Reference -> Backend Development) changed; pdfinfo 1 page A4 (594.96 x 841.92), PNG inspected, no overflow.
- [x] Task 22. Render `attachments/resilience-bucket4j-cheat-sheet.pdf` ("Spring Boot Bucket4j Cheat Sheet") from a throwaway HTML
  page with headless Chrome: one A4 page, dense multi-column colour-coded, versions and date in the header, one box per group listed
  in the issue (decision mini-table, dependencies, token-bucket formula + sketch, Bucket API one-liners, `TokensInheritanceStrategy`,
  `ProxyManager` skeleton + backend table + client settings, manual filter skeleton + 429/`Retry-After`/ProblemDetail, starter YAML
  + `@RateLimiting`, Gateway MVC/WebFlux, metrics/testing, anti-patterns/checklist). Verify with `pdfinfo` and PNG inspection. -- 11 boxes in 4 columns; pdfinfo 1 page A4 (594.96 x 841.92), 300 KB; PNG inspected per column, no clipping; HTML in scratchpad 166/cheatsheets.

### Group 9 — Site wiring and back-links

**Parallelizable: yes (edits to different files; the nav edit is a single task)**

- [x] Task 23. Update `modules/ROOT/nav.adoc`: in the relocated Resilience list, insert the 13 `****` entries after
  `migration-and-whats-changed.adoc` and before `cheat-sheet.adoc`, in the issue's order (comparison page first). — Done: 13 `****` entries in `nav.adoc` in outline order.
- [x] Task 24. Edit existing #156 pages (replace prose mentions of #166 with `xref:`s; keep #184 as prose).
  - [x] Task 24.1. `rate-limiter.adoc` (`== Beyond in-process rate limiting`), `resilience-fundamentals.adoc` (l.440), and
    `gateway-and-openfeign.adoc` (l.579–582) per the issue. — Done: #166 prose replaced by xrefs to the comparison, distributed and gateway pages; #184 kept as prose.
  - [x] Task 24.2. One-line back-links in `fallbacks-and-composition.adoc`, `observability.adoc`, `testing.adoc`,
    `production-tuning-and-anti-patterns.adoc`. — Done: one intro line each, to the comparison, observability, testing and checklist pages.
- [x] Task 25. Outside the section (verify each target exists first).
  - [x] Task 25.1. `backend/index.adoc` (Resilience bullet and `:description:`: "Resilience4j and Bucket4j"),
    `backend/springboot/index.adoc` (`=== Resilience` pointer "and Bucket4j" + the issue's `:keywords:`),
    `backend/springboot/cheat-sheet.adoc` (mention both PDFs). — Done: bullet + `:description:` in both indexes, issue's `:keywords:` added, both PDF links in the SpringBoot cheat sheet.
  - [x] Task 25.2. Back-links: `database/redis/use-cases-and-patterns.adoc`, `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`,
    `ai/spring-ai/production-and-deployment.adoc`; link-out references from the new pages to the existing pages listed in "What
    already exists" in the issue. — Done: three back-links added; every "What already exists" page was already linked from the matching new pages, plus a Spring AI decision-guide row on the comparison page. `validate:mermaid` (1161 diagrams) and `npx antora` clean, no unresolved xrefs.

### Group 10 — Build, validation and review

**Parallelizable: no — validates the finished whole**

- [x] Task 26. Validate.
  - [x] Task 26.1. `npm run validate:mermaid` passes for all new blocks. -- 1161 diagrams OK.
  - [x] Task 26.2. Admonition check: `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'` under `backend/resilience/`
    returns nothing; every new page includes the disclaimer partial. -- no admonitions; all 13 new pages include `partial$resilience-disclaimer.adoc`.
  - [x] Task 26.3. Every `xref:` target exists; #184 only as prose; no deprecated API (`Bandwidth.simple/classic`, `Refill`,
    `build(key, config)`) in examples outside the migration page; the starter is never described as official. -- 0 unresolved xrefs; #184 prose only (4 mentions); deprecated API only in deprecation prose / old→new tables (`Refill.GREEDY` hits are an app-defined enum); starter always "community".
  - [x] Task 26.4. Every code example is followed by a `Source:` link and every page ends with `== References`. -- added 11 missing `Source:` lines (backends 4, distributed 2, gateway 5); every section page ends with `== References`.
  - [x] Task 26.5. Run `/iru-build-docs` (`npx antora antora-playbook.yml`): no `xref`/AsciiDoc errors or warnings; spot-check
    rendering of new pages, Mermaid diagrams, SVGs and both PDF links in `build/site`. -- build clean (empty log); Mermaid rendered in headless Chrome, 7 SVGs and both `_attachments` PDFs linked; fixed broken inline-code renderings (``CompletableFuture``s, `alice `, and #156 leftovers in bulkhead, circuit-breaker, observability, spring-framework-native-resilience, annotations-and-aspect-order, testing, migration-and-whats-changed).
  - [x] Task 26.6. `git status`: only intended files (no scratch project, no HTML source for PDFs). -- 12 R + 25 RM renames, 17 M, 22 untracked (13 pages, 7 SVGs, 1 PDF, this plan); `.secrets.baseline` modified by the separate detect-secrets scan (left alone).
- [x] Task 27. Final self-review against every acceptance criterion in issue #166 (including that every Bibliography anchor concept,
  every 8.x API change, every 8.21.0 backend module and every starter property/annotation is covered); fix gaps. -- all 67 Bibliography anchors cited; every `bucket4j_jdk17-*` backend module on the backends page; every 0.20.0-RC1 property field and `@RateLimiting`/`@IgnoreRateLimiting` on the starter page; 8.5/8.6/8.11.1/8.17–8.21 changes and all 16 discrepancy rows on the migration page; ★★ pages have ≥2 diagrams, Bookshelf example, pitfalls, what changed; no real endpoints in code; nav order matches; Maven Central re-checked 2026-10-05 (no starter 0.20.0 GA; Bucket4j latest 8.21.0).
