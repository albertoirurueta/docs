# Implementation Plan: Guides & References / Backend Development / SpringBoot Reference — "Resilience"

## Task summary

Source: GitHub issue #156
Base branch: main

Issue [#156](https://github.com/albertoirurueta/docs/issues/156) adds a **Resilience** sub-section to the SpringBoot
Reference at `modules/ROOT/pages/backend/springboot/resilience/`: a practical, example-driven guide to making Spring Boot
services fault tolerant with **Resilience4j 2.4.0** on **Spring Boot 4.1.x / Spring Framework 7.0.x**, with Boot 3
deltas, Spring Cloud CircuitBreaker, Gateway, OpenFeign and Spring Framework 7's native `@Retryable` /
`@ConcurrencyLimit`. Bucket4j and other alternatives are **out of scope** (issue #166, which extends this same section).

The section ships:

* 23 `.adoc` files: 22 pages including `index.adoc` (foundations 4, core modules 7, Spring Boot integration 8, quality
  and operations 3) plus `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/springboot-resilience-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/springboot-resilience-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/springboot-resilience-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc`, `backend/springboot/index.adoc`, `backend/springboot/cheat-sheet.adoc`,
  `backend/index.adoc`, and about 12 one-line back-links

The issue body is the binding spec: its "Page outline", "New nav placement", "Cheat sheet", "Bibliography" and
"Acceptance criteria" sections. Every page task must re-read its page's bullets (`gh issue view 156`) and cover
**every** bullet.

**Out of scope:** Bucket4j and other alternative libraries (#166), gateway/API-manager coverage (#184, prose only),
re-documenting existing material (Actuator/Micrometer base setup, Reactor, Testcontainers, caching, Kafka retries — link).

### Choices made on the user's behalf

1. **Branch:** `feature/156-resilience` (user-confirmed), based on `main`, single draft PR to `main` with `Closes #156`.
   The issue suggests optionally splitting into 3 PRs; as with #199/#230, this run does one pass.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet` and
   `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly. Java/YAML code in
   pages is illustrative content, but every example must be built and run in a scratch project (Task 3.5).
3. **Disclaimer:** new `springboot-resilience-disclaimer.adoc` (shape of `django-disclaimer.adoc`), **not** the existing
   `springboot-disclaimer.adoc`. No other admonition in the section; discrepancies, deprecations, pitfalls are prose or
   table rows.
4. **Source of truth is the Resilience4j v2.4.0 source**, not readme.io (2–6 years stale). Every default and behaviour is
   checked against the tag; readme.io discrepancies are stated in prose/tables and collected in
   `migration-and-whats-changed.adoc`.
5. **Boot 4 setup has no official page.** `resilience4j-spring-boot4` + `spring-boot-starter-aspectj` are verified in the
   scratch project (Task 3.5) before being documented; if unconfirmed, the page says so in prose.
6. **Running scenario is *Bookshelf*** (`bookshelf-service` → `pricing-service`, ISBN-metadata API, `recommendations-service`,
   `reviews-service`; Gateway in front; WireMock/Toxiproxy tests).
7. **#166 coordination:** the extension points are built in (landing-page `=== Alternatives and complementary libraries`,
   `rate-limiter.adoc` `== Beyond in-process rate limiting`, reserved "Alternatives" PDF box). #166/#184 are referenced in
   prose only, never via `xref:`. Branch naming for #166 (`feature/166-bucket4j`) is untouched.
8. **Existing pages get real `xref:`s; not-yet-existing ones stay plain prose.** Every `xref:` target outside the section
   is verified with `ls`. Links within the section are allowed (whole section lands in one PR). `index.adoc` and
   `cheat-sheet.adoc` are written last (Group 8).
9. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `springboot-resilience-*.svg`; SVGs are original
   (no Resilience4j/Spring logos, no readme.io figures).

### Lessons from earlier section reviews (#198, #199, #230) — mandatory for every page task

**Verify every name against its official page or the v2.4.0 source before writing it** (class, annotation, property key,
default, import path, artifact id, version); if unconfirmed, describe the behaviour without naming it. **Security is
correctness:** no real secrets or real third-party endpoints; Actuator write endpoints are shown with security.
**Every concept gets at least one code example**, each followed by a `Source:` link; the URL also goes in
`== References`. **Run the examples** in the scratch project. **URL hygiene:** canonical URLs only. **Cross-links accurate:**
never `xref:` to a non-existent page; no `xref:` inside backticks; no empty link text on a fragment xref. **AsciiDoc
hygiene:** `.Title` captions; no leaked authoring notes; `{placeholders}` literal inside `[source]` blocks and escaped
in prose; no prose line starting with `<digits>.`.

## Current code state

* **Repo:** Antora root component `irurueta` (`antora.yml`); pages `modules/ROOT/pages/`, nav `modules/ROOT/nav.adoc`,
  partials `modules/ROOT/partials/`, images `modules/ROOT/images/`, PDFs `modules/ROOT/attachments/`. `resilience/`,
  `springboot-resilience-disclaimer.adoc`, `springboot-resilience-*.svg` and the PDF do not exist.
* **`modules/ROOT/nav.adoc`:** line 854 `**** xref:backend/springboot/concurrency-alternatives.adoc[Concurrency
  Alternatives]`, line 855 `**** xref:backend/springboot/lombok-and-mapstruct.adoc[Lombok & MapStruct]`. `*****` depth is
  already used elsewhere (101 entries).
* **`backend/springboot/index.adoc`:** `== What's covered` has `=== Concurrency Alternatives` then `=== Developer
  productivity tools`; very long `:description:`/`:keywords:`; `== Bibliography` at the end (a "**Official documentation**"
  list).
* **`backend/springboot/cheat-sheet.adoc`:** grouped `*Group* --` xref paragraphs, `attachment$springboot-cheat-sheet.pdf`.
* **`backend/index.adoc`:** SpringBoot Reference bullet at line 40; `:description:` mentions SpringBoot Reference.
* **Back-link targets (verified to exist):** `backend/springboot/near-far-caches.adoc` (l.339),
  `backend/spring-batch/cloud-native-batch.adoc` (l.49–70 uses `CircuitBreakerFactory`),
  `backend/spring-batch/fault-tolerance-skip-and-retry.adoc`, `ai/spring-ai/production-and-deployment.adoc` (l.217 "Rate
  limiting and concurrency", Resilience4j `RateLimiter`), `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`
  (l.160–185 Gateway `CircuitBreaker` filter), `.../benefits-and-drawbacks.adoc` (l.94–97), `backend/quarkus/quarkus-vs-spring-boot.adoc`
  (l.136), `backend/quarkus/fault-tolerance-and-resilience.adoc`, `backend/nestjs/resilience-idempotency-and-locks.adoc`
  (l.1244), `web/aspnet/core/http-client-and-resilience.adoc`, `cloud/google-cloud/mongodb-on-google-cloud.adoc` (l.424
  "Spring Retry or Resilience4j" — Spring Retry is archived), `backend/springboot/messaging-kafka.adoc`.
* **Existing pages to link, not repeat:** `backend/springboot/{metrics-and-observability,rest-apis,reactive-programming,
  concurrency-alternatives,unit-and-integration-testing,caching,configuration-and-profiles}.adoc`,
  `backend/docker/spring-boot-integration-tests-with-testcontainers.adoc`, `backend/kubernetes/health-probes-and-lifecycle.adoc`.
* **Templates / precedents:** `partials/django-disclaimer.adoc`; `backend/springboot/cheat-sheet.adoc` +
  `attachments/springboot-cheat-sheet.pdf`; `images/springboot-*.svg`; `.archive/implementation_plan_230.md` (closest),
  `_199`, `_237`, `_253`.
* **Tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`), `iru-build-docs`,
  headless Chrome and `pdfinfo` for the PDF. JDK 21 + Maven needed for the scratch project (check `java -version`,
  `mvn -v`; if absent, install or ask).

## Conventions every page task must follow

* Path `modules/ROOT/pages/backend/springboot/resilience/<page>.adoc`. Header: `= <Title>`, `:description:`, `:keywords:`,
  then `include::partial$springboot-resilience-disclaimer.adoc[]`.
* Intro states versions (Resilience4j 2.4.0, Spring Boot 4.1.x, Spring Framework 7.0.x, Java 21, verified date) and any
  Boot 3 delta.
* **Every** configuration property: v2.4.0 default **and** Spring Boot property name (tables). Events, exceptions, metrics.
* Examples: `[source,java]`, `[source,yaml]`, `[source,xml]` (+ Gradle Kotlin DSL on getting-started), `curl` + `[source,json]`
  for Actuator; each followed by `Source: <official URL>[label]`; where readme.io is stale also link v2.4.0 source/RELEASENOTES.
* Prose: what it is/why, how Resilience4j implements it, pitfalls, "what changed recently", readme.io discrepancies.
* ★★ pages (`circuit-breaker`, `spring-boot-configuration`, `annotations-and-aspect-order`, `observability`, `testing`):
  ≥2 diagrams, a worked *Bookshelf* example, a pitfalls table, a "what changed" subsection.
* End with `== References` (official docs only). Mermaid blocks `[mermaid]`; SVGs in `modules/ROOT/images/` named
  `springboot-resilience-*.svg`, referenced with `image::`.
* No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` anywhere except the partial.
* Each page task: verify the page against `gh issue view 156`, run its examples in the scratch project, validate its Mermaid
  blocks with `npm run validate:mermaid`.

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/springboot-resilience-disclaimer.adoc`.
  - [x] Task 1.1. Copy the shape of `partials/django-disclaimer.adoc` (single `[IMPORTANT]` block): the AI-assistance
    disclosure only plus `xref:backend/springboot/resilience/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. Confirm no other admonition exists under `backend/springboot/resilience/` at any point.
- [x] Task 2. Verify and record the version baseline (scratchpad `156/versions-156.md`) that every later task cites.
  - [x] Task 2.1. Re-read Maven Central metadata for `resilience4j-spring-boot4`, `-spring-boot3`, `-spring6`, `-bom`,
    `-reactor`, `-kotlin`, `-feign`, `-micrometer`, `-all`, `-hedge`; GitHub releases; Spring Boot, Framework, Cloud and
    Spring Cloud CircuitBreaker versions; state the date. The issue's numbers (2.4.0, Boot 4.1.1, Framework 7.0.x,
    Cloud 2025.1.x, SCCB 5.0.3) are re-verified, not copied.
  - [x] Task 2.2. `curl -sIL` every URL in the issue's Bibliography; record canonical forms and non-200s.
  - [x] Task 2.3. Re-check the Spring Framework 7 `@Retryable` / `@ConcurrencyLimit` attribute defaults (`maxRetries`, `delay`,
    `jitter`, `multiplier`, `maxDelay`) against the Javadoc.
- [x] Task 3. Create the throw-away scratch project in the scratchpad (never committed).
  - [x] Task 3.1. Spring Boot 4.1.x, Java 21, Maven: `resilience4j-bom` 2.4.0, `resilience4j-spring-boot4`,
    `spring-boot-starter-aspectj`, `-actuator`, `-web`, `-webflux`, `resilience4j-reactor`, `resilience4j-all`,
    micrometer-registry-prometheus, WireMock, Testcontainers Toxiproxy, `spring-boot-starter-test`.
  - [x] Task 3.2. A Boot 3.5 variant (`resilience4j-spring-boot3`, `spring-boot-starter-aop`) to confirm the delta.
  - [x] Task 3.3. Resolve the five open points by running code and reading the v2.4.0 sources: Boot 4 aspectj setup;
    health-indicator mapping (`CIRCUIT_OPEN`/`CIRCUIT_HALF_OPEN`, `allowHealthIndicatorToFail`); record-vs-ignore
    precedence (`ignoreExceptionsPrecedenceEnabled`); the effective aspect order; Spring Cloud CircuitBreaker 5.0.x with
    Resilience4j version alignment. Record outcomes in `versions-156.md`.
  - [x] Task 3.4. Build the *Bookshelf* skeleton (`pricing`, ISBN, `recommendations`, `reviews` clients) incrementally as
    page tasks need it.

### Group 2 — Foundations pages

**Parallelizable: yes (three independent pages; `index.adoc` is written in Group 8)**

- [x] Task 4. Create `resilience-fundamentals.adoc` ("Resilience Fundamentals") ★.
  - [x] Task 4.1. Header per "Conventions"; cover every bullet of the issue's outline for this page: failure modes, pattern
    catalogue, idempotency, fail fast vs degrade, where resilience belongs, Hystrix → Resilience4j history, design, and the
    "same idea in other stacks" table (Quarkus, NestJS, Polly xrefs verified; Bucket4j in prose for #166).
  - [x] Task 4.2. Figures: Mermaid cascading failure without/with a breaker; SVG `springboot-resilience-pattern-map.svg`.
    Done: `pages/backend/springboot/resilience/resilience-fundamentals.adoc`, `images/springboot-resilience-pattern-map.svg`;
    examples (retry amplification 27 calls, idempotent POST, fail-fast vs degrade, Hystrix command) built and run in the
    scratch project; Mermaid validated.
- [x] Task 5. Create `getting-started.adoc` ("Getting Started") ★.
  - [x] Task 5.1. Module table; Boot 4 dependencies (BOM, starter, aspectj, actuator) in Maven and Gradle Kotlin DSL; Boot 3
    variant; AspectJ optional; first `@CircuitBreaker` with fallback on the pricing call, its YAML, running it,
    `/actuator/circuitbreakers`; official demo noted, no Boot 4 demo.
  - [x] Task 5.2. Figure: Mermaid request flow through the aspect proxy.
    Done: `pages/backend/springboot/resilience/getting-started.adoc`; the exact Maven POM + YAML + curl/Actuator output
    were run on Boot 4.1.1 (scratch-gs) and Boot 3.5.16 (scratch-gs3); Gradle Kotlin DSL is a translation and was NOT run.
- [x] Task 6. Create `registries-configuration-and-decorators.adoc` ("Registries, Configuration & Decorators") ★.
  - [x] Task 6.1. Registries, shared configs, `from(base)`, tags, `RegistryStore`, registry events; decorating all functional
    types; the `Decorators` builder; `EventPublisher`/`CircularEventConsumer`; instance-management best practices;
    `resilience4j-commons-configuration`.
  - [x] Task 6.2. Figure: SVG `springboot-resilience-registry-model.svg`.
    Done: `pages/backend/springboot/resilience/registries-configuration-and-decorators.adoc`, `images/springboot-resilience-registry-model.svg`;
    registry, Decorators, event, RegistryStore, Boot-bean and commons-configuration examples run in scratch-boot4
    (`src/test/java/demo/g2`).

### Group 3 — Core modules I

**Parallelizable: yes (three independent pages)**

- [x] Task 7. Create `circuit-breaker.adoc` ("CircuitBreaker") ★★.
  - [x] Task 7.1. State machine incl. METRICS_ONLY / DISABLED / FORCED_OPEN, manual transitions, sliding windows, failure vs
    slow-call rate, **every property with default** (list in the issue), thread-safety note, `CallNotPermittedException`,
    events, `getMetrics()`, the `pricing-service` tuning example.
  - [x] Task 7.2. Figures: Mermaid state diagram; SVG `springboot-resilience-sliding-windows.svg`; Mermaid outage timeline.
  - [x] Task 7.3. Pitfalls table and "what changed" (2.0, 2.3, 2.4, including the readme.io record-vs-ignore discrepancy).
- [x] Task 8. Create `retry.adoc` ("Retry") ★.
  - [x] Task 8.1. Every property with default, `IntervalFunction` factories, Boot backoff/jitter properties, retry storms,
    `Retry-After` via `intervalBiFunction`, idempotency rules, `MaxRetriesExceededException`, events, comparison with Spring
    Framework 7 `@Retryable`.
  - [x] Task 8.2. Figure: SVG `springboot-resilience-backoff.svg` (fixed vs exponential vs jittered).
- [x] Task 9. Create `rate-limiter.adoc` ("RateLimiter") ★.
  - [x] Task 9.1. Cycle model, `AtomicRateLimiter` vs `SemaphoreBasedRateLimiter`, `drainPermissionsOnResult`, runtime
    changes, `@RateLimiter(permits=n)`, `RequestNotPermitted` → 429 + `Retry-After` handler, events/metrics, ISBN client,
    Spring AI cross-link.
  - [x] Task 9.2. End with `== Beyond in-process rate limiting` (extension point for #166; names #166 and #184 in prose only).
  - [x] Task 9.3. Figures: SVG `springboot-resilience-rate-cycles.svg`; Mermaid permit-wait sequence.

### Group 4 — Core modules II

**Parallelizable: yes (four independent pages)**

- [x] Task 10. Create `bulkhead.adoc` ("Bulkhead") ★.
  - [x] Task 10.1. Semaphore vs thread-pool properties with defaults, choosing, virtual threads and `@ConcurrencyLimit`,
    `ContextPropagator`, `BulkheadFullException`, events/metrics, recommendations call.
  - [x] Task 10.2. Figure: SVG `springboot-resilience-bulkhead.svg`.
- [x] Task 11. Create `time-limiter.adoc` ("TimeLimiter") ★.
  - [x] Task 11.1. Properties, `Future` vs `CompletionStage`, `IllegalReturnTypeException`, timeout layering and total time
    budget across retries (HTTP client vs TimeLimiter vs gateway), `TimeoutException`, events.
  - [x] Task 11.2. Figure: Mermaid nested timeouts across retries.
- [x] Task 12. Create `fallbacks-and-composition.adoc` ("Fallbacks & Composition") ★.
  - [x] Task 12.1. Fallback semantics and method-resolution rules, async/reactive fallbacks, good fallbacks, `Decorators` vs
    annotations, recommended order, metrics inflation, `*AspectOrder` properties and the readme.io wording discrepancy
    (confirmed in Task 3.3).
  - [x] Task 12.2. Figures: Mermaid onion; Mermaid retried-call-through-open-breaker sequence.
- [x] Task 13. Create `cache-and-hedge.adoc` ("Cache & Hedge").
  - [x] Task 13.1. JCache `Cache` module, `withCache`, events, failure behaviour, production provider, no Boot properties,
    relation to `@Cacheable` (link `caching.adoc`); `resilience4j-hedge` from the v2.4.0 source, noted as undocumented on readme.io.

### Group 5 — Spring Boot integration I

**Parallelizable: yes (four independent pages)**

- [x] Task 14. Create `spring-boot-configuration.adoc` ("Spring Boot Configuration") ★★.
  - [x] Task 14.1. Full YAML structure for every prefix; durations, exception/predicate FQCNs; Boot-only properties;
    `XxxConfigCustomizer`; **precedence**; profiles; SpEL names; `@RefreshScope`; complete per-module property table with
    defaults; the full *Bookshelf* configuration.
  - [x] Task 14.2. Figure: Mermaid configuration resolution; pitfalls table; "what changed".
- [x] Task 15. Create `annotations-and-aspect-order.adoc` ("Annotations & Aspect Order") ★★.
  - [x] Task 15.1. All annotations and attributes, supported return types per annotation, AOP proxy pitfalls
    (self-invocation, `private`/`final`, `@Transactional` ordering), stacking, effective order (verified in Task 3.3),
    `*AspectOrder`, resolution of instances missing from YAML.
  - [x] Task 15.2. Figures: SVG `springboot-resilience-aspect-chain.svg`; Mermaid self-invocation bypass; pitfalls table.
- [x] Task 16. Create `programmatic-usage.adoc` ("Programmatic Usage") ★.
  - [x] Task 16.1. Registries, `executeSupplier`/`decorate*`, decorating `RestClient`, `WebClient`, JDK `HttpClient`,
    `@HttpExchange` clients; interceptor/filter per downstream; `recordResultPredicate` for 5xx/429; when to prefer it.
- [x] Task 17. Create `reactive-kotlin-and-rxjava.adoc` ("Reactive, Kotlin & RxJava") ★.
  - [x] Task 17.1. Reactor operators with `transformDeferred`, annotations on `Mono`/`Flux`, operator order, RxJava 2/3,
    Kotlin suspend/`Flow` and gaps, virtual-threads alternative (link), *Bookshelf* `reviews-service` client.

### Group 6 — Spring Boot integration II

**Parallelizable: yes (four independent pages)**

- [x] Task 18. Create `observability.adoc` ("Observability") ★★.
  - [x] Task 18.1. All Actuator endpoints with sample JSON; the `circuitbreakers` write operation and how to secure it; health
    indicators (enabling, statuses, `allowHealthIndicatorToFail`, groups, keep out of liveness probe — link Kubernetes page);
    every Micrometer meter and tag and Prometheus naming; Grafana dashboard; event logging; alert rules; tracing context.
  - [x] Task 18.2. Figures: SVG `springboot-resilience-metrics-pipeline.svg`; Mermaid health-status mapping; pitfalls table.
- [x] Task 19. Create `spring-cloud-circuitbreaker.adoc` ("Spring Cloud CircuitBreaker") ★.
  - [x] Task 19.1. Abstraction API, starters, customizers, TimeLimiter on by default and `disable-time-limiter(-map)`,
    bulkhead wrapping and provider customizers, precedence, metrics, `@HttpServiceFallback`, Framework Retry implementation,
    version-alignment instructions (SCCB 5.0.x pins 2.3.0 / Boot 3 starter), when to use the abstraction, Spring Batch
    cross-link.
- [x] Task 20. Create `gateway-and-openfeign.adoc` ("Gateway & OpenFeign").
  - [x] Task 20.1. Gateway CircuitBreaker filter (WebFlux, Web MVC), `RequestRateLimiter` briefly (Redis; Bucket4j limiter
    named in prose for #166), OpenFeign circuit-breaker support, `Resilience4jFeign`; link `api-gateway-and-bff.adoc`.
  - [x] Task 20.2. Figure: Mermaid gateway route falling back.
- [x] Task 21. Create `spring-framework-native-resilience.adoc` ("Spring Framework Native Resilience") ★.
  - [x] Task 21.1. `@Retryable`, `@ConcurrencyLimit`, `@EnableResilientMethods`, `RetryTemplate`/`RetryPolicy`/`RetryListener`
    (defaults from Task 2.3), Spring Retry archived + migration table, feature comparison table, decision guide.

### Group 7 — Quality and operations pages

**Parallelizable: yes (three independent pages)**

- [x] Task 22. Create `testing.adoc` ("Testing Resilience") ★★.
  - [x] Task 22.1. Unit tests with registries (`transitionTo*`, `reset()`, `getMetrics()`), custom `Clock`, test profile,
    `@SpringBootTest` aspect checks, WireMock fault injection, Toxiproxy via Testcontainers (link Testcontainers page),
    Actuator/meter assertions, `StepVerifier`, chaos ideas.
  - [x] Task 22.2. Figures: Mermaid test topology; pitfalls table; "what changed".
    Done: `pages/backend/springboot/resilience/testing.adoc` (2 Mermaid diagrams); 17 tests in scratch-boot4-g7-testing run on Boot 4.1.1 (15 pass, 2 Toxiproxy tests compiled but skipped: no Docker); Mermaid validated.
- [x] Task 23. Create `production-tuning-and-anti-patterns.adoc` ("Production Tuning & Anti-patterns") ★.
  - [x] Task 23.1. Threshold selection, one instance per backend, retry amplification, timeout ordering, load shedding,
    mesh/gateway vs code, runbooks (force-open), anti-patterns table.
- [x] Task 24. Create `migration-and-whats-changed.adoc` ("Migration & What's Changed").
  - [x] Task 24.1. Hystrix mapping, 1.x → 2.x, Boot 2 → 3 → 4 starters (`aop` → `aspectj`), Spring Retry → Framework 7, 2.3.0/2.4.0
    changes, **the full readme.io discrepancy table**.

### Group 8 — Landing page, bibliography and cheat sheet

**Parallelizable: no — `index.adoc` and `cheat-sheet.adoc` link every page written in Groups 2–7, and the PDF summarises them**

- [x] Task 25. Create `index.adoc` ("Resilience").
  - [x] Task 25.1. What resilience means, baseline, *Bookshelf* scenario with final layout and `application.yml`, reading path,
    `== What's covered` grouped as the outline (ending with `=== Alternatives and complementary libraries` placeholder,
    prose naming #166 only), "related material elsewhere" table. -- done: index.adoc (545 lines); application.yml spliced verbatim from spring-boot-configuration.adoc.
  - [x] Task 25.2. Figures: SVG `springboot-resilience-bookshelf-map.svg`; Mermaid section mind-map. -- done: springboot-resilience-bookshelf-map.svg (xmllint ok, rendered and inspected); Mermaid mindmap; validate:mermaid 1145 OK.
  - [x] Task 25.3. `== Bibliography` with every source in the issue, each linked to official documentation (use the verified
    URLs from Task 2.2); no Bucket4j entries. -- done: bibliography with canonical URLs (Reactor, spring-attic, k8s probes, Prometheus, smallrye via quarkus.io); `_bibliography` anchor confirmed in build/site.
- [x] Task 26. Create `cheat-sheet.adoc` and the PDF.
  - [x] Task 26.1. Page per the issue (disclaimer include, intro linking `xref:attachment$springboot-resilience-cheat-sheet.pdf[…]`,
    grouped `*Group* --` xrefs to every page, download line, `== References`). -- done: cheat-sheet.adoc with xrefs to all 21 pages.
  - [x] Task 26.2. Render `modules/ROOT/attachments/springboot-resilience-cheat-sheet.pdf` from a throwaway HTML page with headless
    Chrome: one A4 page, dense multi-column colour-coded, header with versions and date, every box listed in the issue
    including the reserved "Alternatives" box; verify exactly one page with `pdfinfo`; commit only the PDF. -- done: springboot-resilience-cheat-sheet.pdf, pdfinfo 1 page A4, 382 KB, inspected as PNG, no overflow (HTML in scratchpad 156/cheatsheet).

### Group 9 — Site wiring and back-links

**Parallelizable: yes (edits to different files; the nav edit is a single task)**

- [x] Task 27. Update `modules/ROOT/nav.adoc`: after line 854 insert `**** xref:backend/springboot/resilience/index.adoc[Resilience]`
  with `*****` children in outline order, last `***** xref:backend/springboot/resilience/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 28. Update `backend/springboot/index.adoc`: `=== Resilience` after `=== Concurrency Alternatives`; `:description:` and
  `:keywords:` additions from the issue; Resilience4j entry in `== Bibliography` pointing to the section bibliography.
- [x] Task 29. Update `backend/springboot/cheat-sheet.adoc` (one line) and `backend/index.adoc` (SpringBoot bullet and description).
- [x] Task 30. One-line back-links (verify each target exists first):
  - [x] Task 30.1. `near-far-caches.adoc`, `spring-batch/cloud-native-batch.adoc`, `spring-batch/fault-tolerance-skip-and-retry.adoc`,
    `ai/spring-ai/production-and-deployment.adoc`.
  - [x] Task 30.2. `architecture/decisions-and-migrations/api-gateway-and-bff.adoc`, `.../benefits-and-drawbacks.adoc`.
  - [x] Task 30.3. `quarkus/quarkus-vs-spring-boot.adoc`, `quarkus/fault-tolerance-and-resilience.adoc`,
    `nestjs/resilience-idempotency-and-locks.adoc`, `web/aspnet/core/http-client-and-resilience.adoc`.
  - [x] Task 30.4. `cloud/google-cloud/mongodb-on-google-cloud.adoc`: link the retry page and replace the Spring Retry mention with
    Spring Framework 7 `@Retryable` (Spring Retry is archived).

### Group 10 — Build, validation and review

**Parallelizable: no — validates the finished whole**

- [x] Task 31. Validate.
  - [x] Task 31.1. `npm run validate:mermaid` passes for all new blocks.
  - [x] Task 31.2. Admonition check: `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'` under `backend/springboot/resilience/` returns nothing.
  - [x] Task 31.3. Every `xref:` target exists; no Bucket4j content beyond the scope sentence; #166/#184 only as prose.
  - [x] Task 31.4. Every code example is followed by a `Source:` link and every page ends with `== References`.
  - [x] Task 31.5. Run `/iru-build-docs` (`npx antora antora-playbook.yml`): no `xref`/AsciiDoc errors or warnings; spot-check
    rendering of the new pages, the Mermaid diagrams, SVGs and the PDF link in `build/site`.
  - [x] Task 31.6. `git status`: only intended files staged (no scratch project, no HTML source for the PDF).
- [x] Task 32. Final self-review against every acceptance criterion in issue #156; fix gaps.
