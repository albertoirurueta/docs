# Implementation Plan: Guides & References / Backend Development — Quarkus Reference

## Task summary

Source: GitHub issue #143
Base branch: main

Issue [#143](https://github.com/albertoirurueta/docs/issues/143) asks for a new **Quarkus Reference** section
under *Guides & References → Backend Development*, the sixth sibling of the existing Hibernate, SpringBoot,
GraphQL, Spring Batch and OAuth references, authored directly into this repo's own `ROOT` Antora component (this
repo has no application source code — it *is* the Antora playbook + root component). Concretely:

1. **47 new AsciiDoc pages** under `modules/ROOT/pages/backend/quarkus/`: a landing `index.adoc` (with a
   `== Bibliography`), **44 topic pages** (43 from the issue's outline plus a `java-or-kotlin.adoc` comparison
   page, mirroring `backend/springboot/java-or-kotlin.adoc` — added per user request, not in the original issue
   text), a **`quarkus-vs-spring-boot.adoc`** comparison page, and a
   `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/quarkus-disclaimer.adoc` (house 3-part `[IMPORTANT]` template).
3. **Site wiring**: an inline nav block in `modules/ROOT/nav.adoc` appended after the OAuth Reference block, a
   "Quarkus Reference" bullet in `modules/ROOT/pages/backend/index.adoc`, and Quarkus terms added to the root
   `modules/ROOT/pages/index.adoc` `:keywords:`.
4. **Reciprocal cross-links** into `backend/springboot/index.adoc` and seven of its topic pages, plus
   `backend/hibernate/index.adoc`, `backend/graphql/index.adoc` and `backend/oauth/index.adoc` — per the issue's
   own "Cross-links to add in existing pages" list — so the new section and the existing ones point at each
   other instead of duplicating material.
5. **Figures**: hand-authored `modules/ROOT/images/quarkus-*.svg` files plus `[mermaid]` blocks, placed per the
   issue's 📊 markers (a floor, not a ceiling).
6. **`modules/ROOT/attachments/quarkus-cheat-sheet.pdf`** — exactly one A4 page, rendered from a throwaway
   print-ready HTML/CSS layout via headless Chromium; only the PDF is checked in.

Target baseline: **Quarkus 3.39.x** (current) with **3.33.x LTS** as the production recommendation, on
**Java 17+** (Quarkus 4 moves to Java 21). Scope is **protocol/framework-first and deliberately non-duplicative**:
Hibernate, GraphQL, OAuth/OIDC, Kafka, MongoDB/Elasticsearch/Neo4j/Redis, Prometheus and the Java/Kotlin
languages are linked, not re-documented — each Quarkus page covers only what Quarkus adds/changes on top of the
underlying technology. The two requester-provided books (`~/Desktop/quarkus1.pdf` = *Quarkus Cookbook*,
`~/Desktop/quarkus2.pdf` = *Quarkus in Action*) are copyrighted: cited and linked in the Bibliography only, never
attached/uploaded/excerpted, and https://quarkus.io/guides/ wins on every discrepancy. The issue's own 43-page
outline, official-source index (in its first comment), concept-comparison table, cross-link list, bibliography
and twelve acceptance criteria are exhaustive and are treated as the source of truth for content — this plan
sequences them into buildable task groups, it does not restate every detail.

### Choices made on your behalf (stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** Installed `*-code-one-task` skills are `database`, `dotnet`,
   `java` and `java-springboot` — none applies to AsciiDoc/SVG/PDF authoring, matching every prior documentation
   plan in `.archive/`. Every task below is deliberately **untagged**, which a downstream `iru-code` run treats
   as "implement directly" rather than dispatch. The `[source,java]`/`[source,properties]`/`[source,bash]` blocks
   throughout are illustrative AsciiDoc content, not a compiled module.
2. **Closest precedent: `.archive/implementation_plan_129.md` (issue #129, OAuth Reference)** — same shape of
   task exactly (new *Backend Development* sibling: disclaimer partial → topic pages in thematic groups →
   landing + cheat-sheet page → PDF → site wiring/reciprocal links → build gate), at larger scale (46 pages here
   vs. 31 there). Its conventions carry over directly: page anatomy, the 3-part disclaimer template, books cited
   **only** in `== Bibliography`, the cheat-sheet mechanism (hand-built HTML/CSS → headless Chromium → single A4
   PDF, HTML not checked in), and the Mermaid CI gate.
3. **Nav is written inline in `nav.adoc`, not as a partial.** Matches every other *Backend Development*
   subsection (Hibernate/SpringBoot/GraphQL/Spring Batch/OAuth all inline with absolute `***`/`****` levels) —
   appended after line 688 (`**** xref:backend/oauth/cheat-sheet.adoc[Cheat Sheet (PDF)]`) and before line 689
   (`** xref:apps/index.adoc[Apps]`).
4. **Topic pages are grouped into the same nine thematic batches the issue itself proposes** ("Foundations →
   REST/web → Data → Reactive/messaging → Security → Observability → Testing → Packaging/deployment →
   Advanced"), plus a dedicated group each for the comparison page, the landing+cheat-sheet pages, the PDF, and
   site wiring — 15 groups total. This is the issue's own stated execution order (its "Estimated difficulty"
   note), not an invented batching.
5. **`quarkus-vs-spring-boot.adoc` gets its own group (Group 11), after every topic page group.** It
   cross-references most of the section (Panache, Mutiny, `@ConfigMapping`, Dev Services, `@QuarkusTest`, etc.)
   and `spring-compatibility.adoc`, so it can only be written correctly once those pages' final titles/anchors
   exist. This mirrors an established repo convention — comparison pages already exist elsewhere in the tree
   (`database/lucene/lucene-vs-solr-vs-elasticsearch-vs-opensearch.adoc`,
   `database/solr/solr-vs-elasticsearch.adoc`) — so the page type itself is not new to this repo.
6. **Both books are confined to structure/checklist use, never a primary source.** *Quarkus Cookbook* (2020,
   Quarkus 1.4, `javax.*`) is flagged throughout as largely superseded; *Quarkus in Action* (Jan 2025, Quarkus
   3.15 LTS) is one LTS behind and used as a "current-generation, re-verify version-sensitive details" reference.
   Neither book's benchmark/footprint figures may be quoted (issue + house convention). Both appear only in
   `index.adoc`'s `== Bibliography`, linked to their publisher pages, never attached/uploaded/excerpted.
7. **Mermaid blocks get their own explicit gate.** This repo runs `node scripts/validate-mermaid.mjs` in CI
   (`.github/workflows/publish.yml`, `manual_publish.yml`; `npm run validate:mermaid`). Group 15 runs it as a
   first-class gate alongside the Antora build.
8. **No project-picker tile.** Like every other *Guides & References* subsection, the Quarkus Reference lives
   only in `nav.adoc`, `backend/index.adoc` and its own `index.adoc`; the root `pages/index.adoc` gains keywords
   only.
9. **The two "optional inbound links"** the issue names (`programming-languages/java/index.adoc` re: virtual
   threads, `programming-languages/kotlin/index.adoc`) are included as a small best-effort task in Group 14 since
   they're cheap and explicitly invited by the issue, but are not gated by the final acceptance-criteria walk the
   way the mandatory cross-links are.
10. **`java-or-kotlin.adoc` (Task 45) added by explicit user request, not in the original issue #143 text.** The
    issue's own outline already touches Kotlin twice — `build-tooling-and-languages.adoc`'s language-support
    subsection (Task 43.3) and scattered "Kotlin variants"/"coroutines interop" mentions elsewhere — but the user
    asked for a **dedicated comparison page**, "similarly to the page that already exists for SpringBoot"
    (`backend/springboot/java-or-kotlin.adoc`). Placed in **Group 10 (Advanced)** rather than earlier: unlike
    SpringBoot's version (which only forward-references already-existing, standalone Java/Kotlin language-
    reference pages), this page's most Quarkus-specific comparison row — coroutines vs. Mutiny — depends on
    `reactive-programming-and-mutiny.adoc` (Group 5) and `virtual-threads.adoc` (Group 5) existing with their
    final content, and its all-open/no-arg discussion depends on `cdi-and-the-programming-model.adoc` (Group 2)
    and `panache.adoc` (Group 4); Group 10 already depends on Groups 2–9, so this is the earliest group where all
    of those exist. `build-tooling-and-languages.adoc` (Task 43.3, same group) is narrowed to tooling/build-config
    mechanics only and now points to this page for the language-choice discussion, avoiding duplication between
    the two. Page and nav-bullet counts throughout this plan (47 pages / 44 topic pages) already include it.

## Current code state

- **Repository shape** — no application source. `antora.yml` declares component `irurueta`; `antora-playbook.yml`
  aggregates this repo (`url: .`) plus six remote repos. Content lives in `modules/ROOT/{pages,partials,images,
  attachments}`. Build: `npx antora antora-playbook.yml` → `build/site` (gitignored). No lint/test suite; the
  only meaningful verification is a clean Antora build plus `npm run validate:mermaid`.
- **`modules/ROOT/nav.adoc`** (694 lines) — *Guides & References → Backend Development* starts at line 522
  (`** xref:backend/index.adoc[Backend Development]`). Its six subsections are inline: Hibernate, SpringBoot,
  GraphQL, Spring Batch, then **OAuth Reference ending at line 688**
  (`**** xref:backend/oauth/cheat-sheet.adoc[Cheat Sheet (PDF)]`). Line 689 begins
  `** xref:apps/index.adoc[Apps]`.
- **`modules/ROOT/pages/backend/index.adoc`** (41 lines) — `:description:`/`:keywords:` plus a `== Sections`
  list of six bullets (Java, Hibernate, SpringBoot, GraphQL, Spring Batch, OAuth), each an `xref:` and a
  one-sentence summary ending "…plus a downloadable cheat sheet".
- **`modules/ROOT/pages/index.adoc`** (132 lines) — root landing page; line 2 `:keywords:` already lists OAuth
  terms but nothing Quarkus-related; no project-picker tile is used for *Guides & References* subsections (only
  top-level components get a tile), consistent with choice 8 above.
- **`modules/ROOT/partials/`** — the disclaimer template to copy is `oauth-disclaimer.adoc`: an `[IMPORTANT]`
  `====` block — (a) scope/version sentence naming what the pages are "written and verified against", (b) any
  draft/immature-spec caveat, (c) the house AI-assistance disclosure, (d) a pointer to the section's own
  `#_bibliography` anchor. `springboot-disclaimer.adoc` is the longer variant with the same shape.
- **`modules/ROOT/images/`** — SVGs are section-prefixed (`springboot-*.svg`, `oauth-*.svg`). Include
  convention: `image::<name>.svg[<long descriptive alt text>,width=700,role=text-center]`.
- **`modules/ROOT/attachments/`** — `*-cheat-sheet.pdf` files per section; `springboot-cheat-sheet.pdf` and
  `oauth-cheat-sheet.pdf` are the visual/density reference. Linked as
  `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`.
- **Reciprocal-link targets** (per issue's "Cross-links to add in existing pages"), current state observed:
  - `backend/springboot/index.adoc` — has no Quarkus mention yet; needs a "how does this compare to Quarkus?"
    line plus a Quarkus Reference mention in its section list.
  - `backend/springboot/concurrency-alternatives.adoc`, `reactive-programming.adoc`, `caching.adoc`,
    `messaging-kafka.adoc`, `metrics-and-observability.adoc`, `scheduling-and-shedlock.adoc`,
    `unit-and-integration-testing.adoc` — each exists, none currently mentions Quarkus; each needs exactly one
    reciprocal `xref:` to its Quarkus counterpart as a "the Quarkus equivalent" aside, added additively at a
    natural point in the existing prose (no rewrite).
  - `backend/hibernate/index.adoc`, `backend/graphql/index.adoc`, `backend/oauth/index.adoc` — each exists with
    an established `== Sections`/intro structure; each needs one additive `xref:` to the matching new Quarkus
    page(s) (`panache.adoc` + `hibernate-orm-and-jpa.adoc`; `graphql.adoc`; `security-jwt-oidc-and-keycloak.adoc`
    respectively).
- **`.archive/`** — 70+ prior plans. `implementation_plan_129.md` (OAuth Reference, 31 pages, 13 groups) is the
  direct structural precedent (see choice 2); it in turn cites `implementation_plan_111.md` (Swift Reference) for
  page anatomy.
- **Nothing in the repo currently covers**: Quarkus at all, build-time augmentation/closed-world/native-image as
  an application concern, Dev Services/Dev UI/continuous testing, Panache, Mutiny/the Vert.x reactive engine,
  MicroProfile/SmallRye APIs, Qute, Funqy, the Quarkus extension model, or a Quarkus-vs-Spring-Boot analysis.

## Implementation steps

> Conventions every page task below inherits (do not restate per task): create the file under
> `modules/ROOT/pages/backend/quarkus/`; start with `= <Title>`, a `:description:`, a `:keywords:`, then
> `include::partial$quarkus-disclaimer.adoc[]`; use **`jakarta.*`**, **Quarkus REST** (never RESTEasy Classic
> except where explicitly documenting the legacy path and naming its replacement), **Micrometer/OpenTelemetry**
> (never MicroProfile Metrics/OpenTracing), and **`@ConfigMapping`** (never `@ConfigProperties`) throughout; make
> every code example complete enough to run — the extension coordinates
> (`./mvnw quarkus:add-extension -Dextensions=...` or the CLI equivalent), the `application.properties` keys, and
> the Java (or Kotlin where relevant) source with imports' package roots obvious; close every page with a
> `== References` section linking **only** the specific `https://quarkus.io/guides/<guide>` page(s) the page is
> derived from (per the official-source index in the issue's first comment) plus official upstream project docs
> (microprofile.io, smallrye.io, vertx.io, graalvm.org, jakarta.ee, hibernate.org, keycloak.org, kafka.apache.org,
> opentelemetry.io, micrometer.io) — never the guides index alone; add a `[mermaid]` block or an SVG in
> `modules/ROOT/images/` (named `quarkus-*.svg`) wherever the issue places a 📊 marker (a floor, not a ceiling);
> prefer `xref:` links to sibling Quarkus pages over repeating material, and `xref:` into `backend/hibernate/`,
> `backend/graphql/`, `backend/oauth/`, `programming-languages/java/`, `programming-languages/kotlin/`,
> `database/*/` and `database/prometheus/` rather than re-documenting the underlying technology (per the issue's
> "What already exists" table and "Out of scope" list). Both books are cited only in `index.adoc`'s
> `== Bibliography`, never as a page's primary source.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/quarkus-disclaimer.adoc` — created; four-paragraph `[IMPORTANT]`
      block matching the `oauth-disclaimer.adoc` shape.
  - [x] Task 1.1. Copy the shape of `modules/ROOT/partials/oauth-disclaimer.adoc`: an `[IMPORTANT]` block
        (`====` delimiters) naming **Quarkus 3.39.x** (current) with **3.33.x LTS** as the production
        recommendation, on **Java 17+**, and https://quarkus.io/guides/ as **the reference these pages are
        written and verified against**.
  - [x] Task 1.2. Add the forward-looking note that **Quarkus 4 raises the baseline to Java 21** (first RC
        planned end of September 2026, https://quarkus.io/blog/java21/), so readers aren't surprised by the next
        major.
  - [x] Task 1.3. Add the house AI-assistance disclosure sentence (matching `oauth-disclaimer.adoc` wording).
  - [x] Task 1.4. Close with a pointer to
        `xref:backend/quarkus/index.adoc#_bibliography[the section bibliography]`.

### Group 2 — Foundations (Parallelizable: yes)

- [x] Task 2. `getting-started.adoc` — "Getting Started with Quarkus" — created (~1,050 words); `[mermaid]`
      create→dev→test→package→deploy loop; References: getting-started, cli-tooling, maven-tooling,
      gradle-tooling, rest, dev-ui, dev-mode-differences guides.
  - [x] Task 2.1. What Quarkus is and the problem it solves (startup time, RSS, container density,
        Kubernetes-native Java) in one paragraph; the release model (minors every 4–6 weeks, LTS every 6 months,
        current 3.39.x / 3.33.x LTS, Java 17+ today, Java 21 for Quarkus 4).
  - [x] Task 2.2. The four ways to create a project (Quarkus CLI, `quarkus-maven-plugin`, Gradle,
        https://code.quarkus.io/) with a working command for each; the generated project layout explained file
        by file.
  - [x] Task 2.3. The first REST endpoint; `quarkus dev` and the first live reload; `quarkus:add-extension`;
        running and packaging, and the JAR layout produced.
  - [x] Task 2.4. Add a `[mermaid]` diagram of the create → dev → test → package → deploy loop.
- [x] Task 3. `architecture-and-build-time.adoc` — "Build-Time Augmentation and the Closed World" — created;
      SVG `quarkus-build-time-phases.svg` + `[mermaid]` runtime-reflection-vs-Quarkus startup comparison;
      References: build-tooling, class-loading-reference, dev-mode-differences, writing-extensions,
      building-native-image guides + graalvm.org.
  - [x] Task 3.1. The augmentation phase and the three-phase model (augmentation → static init → runtime init);
        build steps, `@Recorder`s and build items; the deployment vs. runtime module split.
  - [x] Task 3.2. The closed-world assumption and what it forbids (arbitrary runtime reflection, dynamic
        classloading, unregistered proxies) and how that produces fast startup, low RSS and native-image
        compatibility.
  - [x] Task 3.3. Class loading in dev mode vs. production (`/guides/class-loading-reference/`,
        `/guides/dev-mode-differences/`); re-augmentation for mutable-jar deployments.
  - [x] Task 3.4. The honest cost — longer builds, extension-mediated library support, and what to do when a
        library has no extension.
  - [x] Task 3.5. Add an SVG of the three phases with what happens in each, and a `[mermaid]` diagram comparing a
        runtime-reflection framework's startup with Quarkus's.
- [x] Task 4. `extensions-and-the-platform.adoc` — "Extensions and the Platform" — created; SVG
      `quarkus-bom-platform-extension-app.svg`; References: extension-registry-user, maven-tooling,
      gradle-tooling, cli-tooling, update-quarkus guides + quarkiverse.github.io.
  - [x] Task 4.1. What an extension is and why the framework is built from them; the Quarkus platform BOM
        (`quarkus-bom`) vs. the universe BOM vs. Quarkiverse.
  - [x] Task 4.2. The extension registry (https://registry.quarkus.io/, https://code.quarkus.io/); `capabilities`
        and conflicting extensions; the extension maturity matrix and support/stability levels.
  - [x] Task 4.3. Adding, listing and removing extensions with the CLI and Maven/Gradle; `quarkus update` for
        version migrations; dependency management, and why you should not pin extension versions yourself.
  - [x] Task 4.4. Name the handful of Quarkiverse extensions used elsewhere in this section (Vault, Neo4j,
        DynamoDB, LangChain4j, Operator SDK) with links, per the issue's "out of scope: full Quarkiverse
        catalogue" note — named and linked here only, not documented.
  - [x] Task 4.5. Add an SVG: BOM → platform → extension → your app.
- [x] Task 5. `cdi-and-the-programming-model.adoc` — "CDI and the Programming Model (ArC)" — created; covers bean
      discovery/removal, scopes, injection styles, producers/qualifiers/alternatives/stereotypes/interceptors,
      CDI events, and a build-time-vs-runtime resolution `[mermaid]` diagram.
  - [x] Task 5.1. ArC as Quarkus's build-time CDI implementation: beans and discovery
        (annotation-driven, unremovable/removed beans), scopes (`@ApplicationScoped`, `@RequestScoped`,
        `@Singleton`, `@Dependent`, `@SessionScoped` caveats).
  - [x] Task 5.2. Injection styles (why field injection is fine here), producers (`@Produces`), disposers,
        qualifiers and custom qualifiers, `@Alternative`/`@Priority`, stereotypes, interceptors and decorators.
  - [x] Task 5.3. CDI events (`Event`/`@Observes`), `@Startup`, `StartupEvent`/`ShutdownEvent`, `@Observes
        StartupEvent` vs. `@PostConstruct`.
  - [x] Task 5.4. The differences from a runtime CDI container (what ArC does not support and why); `@Inject`
        interplay with configuration.
  - [x] Task 5.5. Add a `[mermaid]` diagram of bean resolution at build time vs. runtime.
- [x] Task 6. `configuration.adoc` — "Configuration" — created; covers config-source precedence,
      `@ConfigProperty`/`@ConfigMapping`, profiles/parent profiles, build-time-fixed vs. runtime-overridable
      properties, env-var mapping/expressions/custom sources/validation/Dev UI, precedence-ladder SVG and a
      build-time-fixed-vs-runtime `[mermaid]` diagram.
  - [x] Task 6.1. MicroProfile Config plus Quarkus extensions: `application.properties` and `application.yaml`,
        the ordinal-based source precedence table.
  - [x] Task 6.2. `@ConfigProperty` vs. **`@ConfigMapping`** (groups, nesting, `Optional`, defaults, naming
        strategies) and why `@ConfigProperties` is legacy.
  - [x] Task 6.3. Profiles (`%dev`, `%test`, `%prod`, custom profiles, `quarkus.profile`, parent profiles);
        build-time vs. run-time fixed properties and the error produced when a build-time-fixed property changes
        after build.
  - [x] Task 6.4. Environment-variable mapping rules; property expressions and indexed properties; custom
        `ConfigSource`s and `Converter`s; configuration validation; the Dev UI config editor; pointer to
        `/guides/all-config/`.
  - [x] Task 6.5. Add an SVG of the config-source precedence ladder, and a `[mermaid]` diagram of build-time-fixed
        vs. runtime-overridable resolution.
- [x] Task 7. `developer-experience.adoc` — "Developer Experience: Dev Mode, Dev UI, Dev Services" — created;
      covers dev-mode hot-replace/full-restart semantics, remote dev, debugging, the Dev UI, Dev Services
      (including Compose Dev Services and Podman), continuous testing, and dev-vs-production differences, with a
      dev-mode-loop SVG and a Dev-Services-decision `[mermaid]` diagram.
  - [x] Task 7.1. Dev mode (`quarkus dev`): live reload semantics, what triggers a restart vs. a hot replace,
        remote dev, debugging.
  - [x] Task 7.2. The Dev UI (extension cards, config editor, bean/endpoint browsers, Dev Services panel).
  - [x] Task 7.3. Dev Services — automatic containers for databases, Kafka, Redis, Keycloak, Infinispan, MongoDB,
        Elasticsearch, LGTM and more; discovery/configuration/disabling; Compose Dev Services and Podman support.
  - [x] Task 7.4. Continuous testing (`r`/`f`/`b` keys, test selection) as the main reason to keep `quarkus dev`
        running; dev-mode differences from production that bite people.
  - [x] Task 7.5. Add an SVG of the dev-mode loop with Dev Services attached, and a `[mermaid]` decision diagram
        for the Dev Services decision (is a URL configured? → start a container / reuse / skip).

### Group 3 — REST, web and APIs (Parallelizable: yes)

Depends on Group 2: several pages link back to `configuration.adoc`/`developer-experience.adoc`.

- [x] Task 8. `rest-services.adoc` — "Quarkus REST"
  - [x] Task 8.1. Resources, `@Path`, HTTP-method annotations,
        `@PathParam`/`@QueryParam`/`@HeaderParam`/`@FormParam`/`@RestPath` and friends; request/response bodies;
        `Response`, status codes and semantic REST responses; content negotiation.
  - [x] Task 8.2. `@Blocking` vs. non-blocking and how the dispatch decision is made; exception mappers and error
        responses; filters and interceptors; multipart; file uploads/downloads.
  - [x] Task 8.3. CORS (`/guides/security-cors/`); HTTP configuration (`/guides/http-reference/`) — ports, root
        path, compression, access logging, TLS; JSON with Jackson vs. JSON-B and XML; Bean Validation on
        endpoints.
  - [x] Task 8.4. Migrating from RESTEasy Classic (`/guides/rest-migration/`), presented as the legacy path with
        Quarkus REST named as its replacement.
  - [x] Task 8.5. Add a `[mermaid]` diagram of the request pipeline (event loop → filter chain → resource method
        → serializer), showing where `@Blocking` moves work to a worker thread.
- [x] Task 9. `rest-client.adoc` — "The MicroProfile REST Client"
  - [x] Task 9.1. Declaring a typed client interface, `@RegisterRestClient` and config keys, `@RestClient`
        injection vs. the programmatic builder.
  - [x] Task 9.2. Headers (`@ClientHeaderParam`, `ClientHeadersFactory`), propagating incoming headers; query/path
        params; multipart; JSON providers; reactive (`Uni`) vs. blocking return types.
  - [x] Task 9.3. Exception mapping (`ResponseExceptionMapper`); TLS/SSL and the TLS registry; timeouts,
        redirects, connection pooling.
  - [x] Task 9.4. Composing with fault tolerance (`@Retry`/`@CircuitBreaker`) and Stork service discovery; logging
        requests; testing with WireMock or a Dev Service.
  - [x] Task 9.5. Add a `[mermaid]` sequence diagram of a REST-client call with retry + circuit breaker.
- [x] Task 10. `openapi-and-swagger-ui.adoc` — "OpenAPI and Swagger UI"
  - [x] Task 10.1. SmallRye OpenAPI: what is generated automatically from Quarkus REST, the
        `@Operation`/`@Schema`/`@APIResponse`/`@Tag` annotations, static `openapi.yaml` merging, info/servers/
        security scheme configuration.
  - [x] Task 10.2. `/q/openapi` and `/q/swagger-ui`, enabling Swagger UI in production, generating the schema at
        build time.
  - [x] Task 10.3. Code-first vs. contract-first, with `xref:backend/springboot/api-first-rest-and-grpc.adoc` for
        the API-first philosophy.
- [x] Task 11. `graphql.adoc` — "GraphQL with SmallRye"
  - [x] Task 11.1. The SmallRye GraphQL server: `@GraphQLApi`, `@Query`, `@Mutation`, `@Subscription`, `@Source`
        for field resolution, batch/`@Source` with `List` for N+1, error handling, `/q/graphql-ui`.
  - [x] Task 11.2. The typed and dynamic GraphQL clients; Dev UI integration.
  - [x] Task 11.3. Link `xref:backend/graphql/index.adoc` for the language, schema design, pagination, security
        and federation rather than repeating them.
- [x] Task 12. `grpc.adoc` — "gRPC"
  - [x] Task 12.1. Protobuf-first development: `quarkus-grpc`, code generation from `.proto` at build time
        (`/guides/grpc-generation-reference/`).
  - [x] Task 12.2. Implementing services (blocking, Mutiny and `@RunOnVirtualThread` variants); consuming services
        with `@GrpcClient`; streaming (server/client/bidi).
  - [x] Task 12.3. Interceptors, error handling and status codes, health and reflection services, TLS/mTLS,
        running gRPC on the same port as HTTP, Dev UI/CLI tooling, deploying to Kubernetes, and testing.
  - [x] Task 12.4. Add a `[mermaid]` diagram of the four streaming shapes.
- [x] Task 13. `websockets.adoc` — "WebSockets Next"
  - [x] Task 13.1. `@WebSocket`, `@OnOpen`/`@OnTextMessage`/`@OnBinaryMessage`/`@OnClose`/`@OnError`, connection
        and broadcast APIs, path parameters, sub-protocols.
  - [x] Task 13.2. Security and `SecurityIdentity` association, per-connection state, back-pressure, the client
        API, and testing.
  - [x] Task 13.3. A short note on the legacy Undertow-based `quarkus-websockets` extension and when you would
        still meet it.
  - [x] Task 13.4. Add a `[mermaid]` sequence diagram of a broadcast room.
- [x] Task 14. `qute-templating.adoc` — "Qute Templating"
  - [x] Task 14.1. Syntax (expressions, sections, `{#if}`/`{#for}`/`{#let}`, operators), value resolvers and
        template extension methods.
  - [x] Task 14.2. Type-safe templates (`@CheckedTemplate` and the `Templates` pattern) and build-time validation
        of expressions; template records; injecting and rendering.
  - [x] Task 14.3. Template locations and content negotiation, i18n message bundles, HTML escaping and safety,
        rendering reactively, mail templates.
  - [x] Task 14.4. One short paragraph each on **Quinoa** (bundling an SPA) and **Renarde** (server-side web
        framework) as the adjacent Quarkiverse options.
- [x] Task 15. `reactive-routes-and-http-layer.adoc` — "Reactive Routes and the Vert.x HTTP Layer"
  - [x] Task 15.1. The Vert.x layer underneath everything: reactive routes (`@Route`, `@RouteFilter`,
        `RoutingContext`), when to use them instead of Quarkus REST.
  - [x] Task 15.2. Accessing the Vert.x API directly (`Vertx`, `WebClient`, `EventBus`), the event bus for in-app
        messaging (`@ConsumeEvent`, request/reply, clustering caveats).
  - [x] Task 15.3. The HTTP/management interface split (`/guides/management-interface-reference/`).
  - [x] Task 15.4. Add an SVG of the Vert.x event-loop/worker-pool model under Quarkus REST, reactive routes and
        the event bus.

### Group 4 — Data (Parallelizable: yes)

Depends on Group 1 only (independent of Groups 2–3).

- [x] Task 16. `datasources-and-transactions.adoc` — "Datasources and Transactions" — 646 lines; covers JDBC vs.
      reactive datasources, Agroal pool tuning, named datasources, health checks, Dev Services, Narayana JTA
      (`@Transactional`, `TxType` propagation, `QuarkusTransaction`/`UserTransaction`, timeouts,
      `TransactionManager`), XA/LRA/STM, and closes with a `[mermaid]` `@Transactional` boundary diagram; verified
      with a full `npx antora antora-playbook.yml` build (no new xref errors beyond the pre-existing,
      not-yet-written `backend/quarkus/index.adoc#_bibliography` forward reference shared by every sibling page in
      this in-progress section).
  - [x] Task 16.1. Configuring a datasource (JDBC and reactive), supported drivers, connection-pool tuning
        (Agroal), multiple/named datasources, datasource health checks, Dev Services for databases.
  - [x] Task 16.2. Transactions with Narayana JTA: `@Transactional` and its `rollbackOn`/`dontRollbackOn`,
        transaction propagation values, programmatic control with `QuarkusTransaction`/`UserTransaction`,
        timeouts, transaction context and `TransactionManager`.
  - [x] Task 16.3. XA and when you actually need it; a pointer to **Narayana LRA** (`/guides/lra/`) for
        long-running sagas, plus one paragraph on Software Transactional Memory. Link
        `xref:backend/springboot/transaction-isolation-and-locking.adoc` for isolation-level theory.
  - [x] Task 16.4. Add a `[mermaid]` diagram of `@Transactional` boundaries across a service → repository call
        chain.
- [x] Task 17. `hibernate-orm-and-jpa.adoc` — "Hibernate ORM in Quarkus" — 392 lines; covers `quarkus-hibernate-orm`
      extension setup, the no-`persistence.xml` model, entity discovery (including external JARs), dialect
      detection, `database.generation`/`import.sql`, second-level cache, statistics/slow-query logging, multiple
      persistence units, multitenancy, and build-time metamodel/native-image implications; Hibernate/JPA
      fundamentals are deferred to `xref:backend/hibernate/index.adoc`. Build-verified (same shared forward-ref
      pattern as above, no other issues).
  - [x] Task 17.1. `quarkus-hibernate-orm`, the no-`persistence.xml` configuration model and when you still want
        one, entity discovery and entities in external JARs, dialect detection.
  - [x] Task 17.2. `quarkus.hibernate-orm.database.generation` and `import.sql`, second-level caching with the
        built-in provider, statistics and slow-query logging, multiple persistence units, multitenancy.
  - [x] Task 17.3. Build-time metamodel generation and native-image implications. Everything about Hibernate
        itself links `xref:backend/hibernate/index.adoc`.
- [x] Task 18. `panache.adoc` — "Panache: The Quarkus Data API" — 761 lines plus a new hand-authored
      `modules/ROOT/images/quarkus-active-record-vs-repository.svg` (verified well-formed XML); covers active
      record vs. repository against the same `Book` entity, shortened-HQL queries/pagination/sorting/projections,
      `@Transactional` placement, dropping to `EntityManager`, testing/`PanacheMock`, known trade-offs, REST Data
      with Panache and Quarkus Data, and closes with a `[mermaid]` decision-tree flowchart. Build-verified (same
      shared forward-ref pattern, plus expected `{id}`-in-prose "missing attribute" warnings matching the same
      pre-existing pattern already present in `rest-services.adoc`/`websockets.adoc`).
  - [x] Task 18.1. Active-record pattern (`PanacheEntity`, `PanacheEntityBase`, public fields and
        bytecode-generated accessors); repository pattern (`PanacheRepository`).
  - [x] Task 18.2. Simplified queries (shortened HQL dialect, named parameters, `Parameters`),
        `list`/`find`/`stream`/`count`/`delete`, pagination (`page()`, `Page`, `pageCount`) and range queries,
        sorting with `Sort`, projections (`project()`).
  - [x] Task 18.3. `@Transactional` placement, custom queries and dropping to the `EntityManager`, testing
        Panache entities, the mocking story (`PanacheMock`), and the known trade-offs (static-method testability,
        public fields, N+1 with lazy associations).
  - [x] Task 18.4. REST Data with Panache (`/guides/rest-data-panache/`) for generated CRUD resources, and a note
        on Quarkus Data (Hibernate) repositories (`/guides/quarkus-data-hibernate/`) and how it relates to
        Panache.
  - [x] Task 18.5. Add an SVG comparing active record vs. repository against the same entity, and a `[mermaid]`
        decision tree for picking one.
- [x] Task 19. `reactive-data-access.adoc` — "Reactive Data Access" — 414 lines; covers reactive SQL clients per
      database, Hibernate Reactive and Hibernate Reactive with Panache (with a blocking-vs-reactive Panache
      side-by-side snippet), reactive MongoDB/Redis clients, the blocking/reactive mixing rule and how to detect
      violations, and closes with a `[mermaid]` blocking-vs-reactive event-loop diagram; forward-references
      `xref:backend/quarkus/reactive-programming-and-mutiny.adoc` for Mutiny itself (not yet written — lands in
      Group 5 of this same plan). Build-verified (only the two expected, shared forward-ref classes: the
      not-yet-written `index.adoc` bibliography anchor and this deliberate forward xref).
  - [x] Task 19.1. Reactive SQL clients (Postgres/MySQL/MSSQL/DB2/Oracle) with `Uni`/`Multi`, prepared queries,
        `RowSet` mapping, transactions and pooling.
  - [x] Task 19.2. Hibernate Reactive and Hibernate Reactive with Panache (`PanacheEntity` returning `Uni`), and
        where it differs from blocking Panache; reactive MongoDB and Redis clients.
  - [x] Task 19.3. The rule that blocking JDBC must not be mixed into a reactive path, and how to detect
        violations. Link `reactive-programming-and-mutiny.adoc` for Mutiny itself.
  - [x] Task 19.4. Add a `[mermaid]` diagram comparing a blocking request path with a reactive one on the event
        loop.
- [x] Task 20. `nosql-and-other-stores.adoc` — "NoSQL and Other Stores" — 433 lines; covers MongoDB (client, POJO
      codecs, MongoDB with Panache, Dev Services), Redis (high-level `RedisDataSource`, low-level commands,
      pub/sub, Dev Services), Elasticsearch/OpenSearch (REST client, Hibernate Search ORM + Elasticsearch),
      Infinispan, Cassandra, and a Quarkiverse survey (Neo4j, DynamoDB, Couchbase) flagging their move out of the
      core platform, each linking `xref:database/index.adoc` (or a more specific existing sub-page, e.g. Neo4j/
      Couchbase). Build-verified (only the shared, expected bibliography forward-ref).
  - [x] Task 20.1. MongoDB (client, POJO codecs, MongoDB with Panache, Dev Services); Redis (high-level
        data-structure API, low-level commands, pub/sub, Dev Services).
  - [x] Task 20.2. Elasticsearch/OpenSearch (REST client, Hibernate Search ORM + Elasticsearch, Dev Services);
        Infinispan (client, cache API, near-caching); Cassandra.
  - [x] Task 20.3. A short survey of Quarkiverse-hosted stores (Neo4j, DynamoDB, Couchbase) with the warning they
        moved out of the core platform. Each block links its own reference under `xref:database/index.adoc`.
- [x] Task 21. `database-migrations.adoc` — "Database Migrations" — 455 lines; covers Flyway (baseline, migration
      locations, migrate-at-start, callbacks, multiple datasources, programmatic use) and Liquibase (changelogs,
      migrate-at-start, labels/contexts, Liquibase MongoDB), plus how migrations interact with
      `database.generation`/Dev Services and rolling-Kubernetes-deploy migration strategy, linking
      `xref:database/schema-evolution/index.adoc` and its `liquibase-getting-started.adoc` sub-page. Build-verified
      (only the shared, expected bibliography forward-ref).
  - [x] Task 21.1. Flyway (baseline, migration locations, `migrate-at-start`, callbacks, multiple datasources,
        running it programmatically).
  - [x] Task 21.2. Liquibase (changelogs, `migrate-at-start`, labels/contexts, Liquibase MongoDB).
  - [x] Task 21.3. How migrations interact with `database.generation` and Dev Services, and migration strategy in
        a rolling Kubernetes deploy. Link `xref:database/schema-evolution/index.adoc`.
- [x] Task 22. `caching.adoc` — "The Quarkus Cache Extension" — 342 lines; covers `@CacheResult`/
      `@CacheInvalidate`/`@CacheInvalidateAll`/`@CacheKey`, composite keys, the programmatic `Cache` API, `Uni`
      support, the Caffeine/Redis/Infinispan backends and when each applies, Micrometer metrics, the Dev UI cache
      panel, and cache-stampede/invalidation caveats, linking `xref:backend/springboot/caching.adoc` and
      `xref:backend/springboot/near-far-caches.adoc` for the multi-level pattern. Build-verified (only the shared,
      expected bibliography forward-ref).
  - [x] Task 22.1. `@CacheResult`, `@CacheInvalidate`, `@CacheInvalidateAll`, `@CacheKey`, composite keys, the
        programmatic `Cache` API, `Uni` support.
  - [x] Task 22.2. The Caffeine default backend and its sizing/expiry config; the Redis and Infinispan cache
        backends for shared caching and when each is appropriate.
  - [x] Task 22.3. Metrics and the Dev UI cache panel; cache-stampede/invalidation caveats. Link
        `xref:backend/springboot/caching.adoc` and `xref:backend/springboot/near-far-caches.adoc` for the
        multi-level pattern discussion.
- [x] Task 23. `validation.adoc` — "Validation with Hibernate Validator" — 514 lines; covers REST payload
      constraints, `@Valid` on parameters and return values (cascading), CDI bean method validation, constraint
      groups, custom constraints/`ConstraintValidator`, programmatic `Validator` use, localized messages, the
      default REST error payload and customizing it via `ExceptionMapper`, and native-image considerations,
      deferring Bean Validation/Hibernate Validator fundamentals to
      `xref:backend/hibernate/validation-with-hibernate-validator.adoc`. Build-verified (only the shared, expected
      bibliography forward-ref); this page also satisfies the forward reference already made to it from
      `rest-services.adoc` (`xref:backend/quarkus/validation.adoc[the Hibernate Validator page]`).
  - [x] Task 23.1. Constraints on REST payloads, `@Valid` on parameters and return values, validating CDI bean
        methods, constraint groups, custom constraints and validators.
  - [x] Task 23.2. Programmatic validation with the injected `Validator`, localised messages, the default REST
        error payload and how to customise it, and native-image considerations. Link
        `xref:backend/hibernate/validation-with-hibernate-validator.adoc`.

### Group 5 — Reactive, concurrency and messaging (Parallelizable: yes)

Depends on Group 4 (`reactive-data-access.adoc` cross-links here) but independent of Groups 2–3.

- [x] Task 24. `reactive-programming-and-mutiny.adoc` — "Reactive Programming and Mutiny" — 483 lines; covers why
      Quarkus is reactive underneath, the Vert.x event-loop/worker-thread model, Mutiny's `Uni`/`Multi` operator
      families, `@Blocking`/`@NonBlocking`, bridging to `CompletionStage`/Reactive Streams/RxJava, testing with
      `UniAssertSubscriber`/`AssertSubscriber`, the debugging story, and context propagation/duplicated context
      with the Reactor comparison. Build-verified (only the one expected, shared forward-ref: the not-yet-written
      `index.adoc` bibliography anchor).
  - [x] Task 24.1. Why Quarkus is reactive underneath even for imperative code (`/guides/quarkus-reactive-architecture/`);
        the Vert.x event-loop model, event-loop threads vs. worker threads, and the cardinal rule of never
        blocking an event loop.
  - [x] Task 24.2. Mutiny: `Uni` and `Multi`, the event-driven API design, subscription semantics, the core
        operator families (transform, chain, combine, merge/concat, failure handling and recovery, retry,
        timeout, grouping, back-pressure strategies).
  - [x] Task 24.3. `@Blocking`/`@NonBlocking`, bridging to and from `CompletionStage`/Reactive Streams/RxJava,
        testing with `UniAssertSubscriber`/`AssertSubscriber`, and the debugging story.
  - [x] Task 24.4. Context propagation and duplicated context (why `ThreadLocal` does not work and what replaces
        it). Link `xref:backend/springboot/reactive-programming.adoc` for the Reactor comparison.
  - [x] Task 24.5. Add an SVG of the event-loop/worker-pool model, and a `[mermaid]` diagram of a `Uni` pipeline
        with a failure-recovery branch — reuses the existing `quarkus-vertx-event-loop-worker-pool.svg` (already
        shared by `reactive-routes-and-http-layer.adoc`) plus a new `[mermaid]` flowchart.
- [x] Task 25. `virtual-threads.adoc` — "Virtual Threads in Quarkus" — 274 lines; covers `@RunOnVirtualThread` in
      REST/gRPC/messaging, when virtual threads beat reactive or a worker pool, pinning/`synchronized`,
      thread-local cost, monitoring, native-image support, the Quarkus 4/Java 21 baseline implication, and honest
      benchmarking guidance. Build-verified (only the two expected, shared forward-refs: the not-yet-written
      `index.adoc` bibliography anchor and `observability.adoc`, already forward-referenced pre-Group-5 from
      `rest-services.adoc`).
  - [x] Task 25.1. `@RunOnVirtualThread` in REST, gRPC and messaging; when virtual threads are the right answer
        versus reactive versus a worker pool.
  - [x] Task 25.2. Pinning and `synchronized`, thread-local cost, monitoring, native-image support, and the
        Quarkus 4 / Java 21 baseline implication.
  - [x] Task 25.3. Benchmark honestly (no stale numbers). Link `xref:programming-languages/java/index.adoc` for
        the language feature and `xref:backend/springboot/concurrency-alternatives.adoc` for the Spring-side
        comparison.
  - [x] Task 25.4. Add a `[mermaid]` diagram comparing the three concurrency models on the same workload.
- [x] Task 26. `messaging.adoc` — "Messaging with SmallRye Reactive Messaging" — 576 lines; covers channels,
      `@Incoming`/`@Outgoing`/`@Channel`, `Emitter`/`MutinyEmitter`, `Message`/metadata, acknowledgement
      strategies, processing shapes, `@Blocking` consumers, the connector model, Kafka (config, Apicurio
      Avro/JSON Schema serde, consumer groups/offsets, commit/failure strategies, key-based ordering, DLQs,
      transactions/exactly-once, Kafka Streams, Dev UI/Dev Services), RabbitMQ, AMQP 1.0, Apache Pulsar, JMS, and
      health/observability/in-memory-connector testing. Build-verified (only the two expected, shared
      forward-refs: the not-yet-written `index.adoc` bibliography anchor and `observability.adoc`).
  - [x] Task 26.1. Channels, `@Incoming`/`@Outgoing`/`@Channel`, `Emitter`/`MutinyEmitter`, `Message` and
        metadata, acknowledgement strategies, processing shapes (1→1, 1→many, stream→stream), blocking consumers
        and `@Blocking`, and the connector model.
  - [x] Task 26.2. **Kafka**: config, serde/Avro and JSON Schema with Apicurio, consumer groups and offsets,
        commit and failure strategies, partitions and key-based ordering, dead-letter queues, transactions and
        exactly-once, Kafka Streams, the Kafka Dev UI and Dev Services.
  - [x] Task 26.3. **RabbitMQ**, **AMQP 1.0**, **Apache Pulsar**, and **JMS**; health checks, observability and
        testing (in-memory connector). Link `xref:backend/springboot/messaging-kafka.adoc` for the Spring
        equivalent.
  - [x] Task 26.4. Add a `[mermaid]` diagram of a channel graph across two services, and an SVG of
        acknowledgement/failure strategies — new `quarkus-message-ack-failure-strategies.svg`.

### Group 6 — Security (Parallelizable: yes)

Depends on Groups 2 and 4 (references configuration and CDI). Independent of Groups 3, 5.

- [x] Task 27. `security-overview-and-architecture.adoc` — "Security Overview and Architecture" — created, with
      the `SecurityIdentity`/`IdentityProvider`/authorization/CORS-CSRF/testing/customisation/vulnerability-
      reporting content and its own `== References` section.
  - [x] Task 27.1. `SecurityIdentity`, identity providers and `IdentityProviderManager`, authentication mechanisms
        and how one is selected; proactive authentication and why you might turn it off.
  - [x] Task 27.2. Authorization — `@RolesAllowed`/`@PermitAll`/`@DenyAll`, `@Authenticated`, configuration-based
        `quarkus.http.auth.permission.*` policies and path matching, method vs. endpoint security, `SecurityIdentity`
        augmentation, custom permission checks (`@PermissionsAllowed`).
  - [x] Task 27.3. CORS and CSRF prevention; security testing (`@TestSecurity`, `TestSecurity` with OIDC);
        security customisation hooks; the project's vulnerability-detection/reporting process.
  - [x] Task 27.4. Added `modules/ROOT/images/quarkus-security-auth-pipeline.svg` (authentication → identity →
        authorization pipeline) and embedded it on the page.
- [x] Task 28. `security-authentication-mechanisms.adoc` — "Authentication Mechanisms and Identity Stores" —
      created.
  - [x] Task 28.1. Basic and form authentication, the properties-file store, `quarkus-security-jdbc`,
        `quarkus-security-jpa` (`@UserDefinition`, `@Username`, `@Password`, `@Roles`, password hashing and
        `@CustomPasswordProvider`).
  - [x] Task 28.2. LDAP, WebAuthn/passkeys, and mutual TLS; choosing a mechanism per path; combining several.
  - [x] Task 28.3. Migration note: the Elytron-prefixed extension names used by older material (including the
        Cookbook) have been replaced. Link
        `xref:backend/oauth/authentication-methods-2fa-and-passwordless.adoc` for the factor theory.
- [x] Task 29. `security-jwt-oidc-and-keycloak.adoc` — "JWT, OIDC and Keycloak" — created, with two `[mermaid]`
      sequence diagrams.
  - [x] Task 29.1. `quarkus-smallrye-jwt`: MicroProfile JWT RBAC, `@Claim` injection, `JsonWebToken`, verification
        keys, and building/signing/encrypting tokens with the JWT build API.
  - [x] Task 29.2. `quarkus-oidc`: the *web-app* mode (authorization-code flow, session cookie, logout) and the
        *service* mode (bearer-token validation, JWKS, introspection) — configuration, tenant resolution and
        multitenancy.
  - [x] Task 29.3. Token propagation and the OIDC client for service-to-service calls,
        `quarkus-oidc-db-token-state-manager` and token-state options, Dev Services for Keycloak and the OIDC Dev
        UI, well-known provider configuration (Google, GitHub, Apple, Entra, Auth0); the legacy
        `quarkus-elytron-security-oauth2` opaque-token path.
  - [x] Task 29.4. All protocol-level explanation links `xref:backend/oauth/index.adoc` instead of being
        repeated. Added a `[mermaid]` sequence diagram of the web-app code flow and of the service bearer-token
        flow.
- [x] Task 30. `secrets-tls-and-hardening.adoc` — "Secrets, TLS and Hardening" — created.
  - [x] Task 30.1. Keeping secrets out of `application.properties`: config secrets and encrypted config values,
        the credentials provider SPI (Vault/Kubernetes providers from Quarkiverse), Kubernetes Secrets/ConfigMaps
        via `quarkus-kubernetes-config`.
  - [x] Task 30.2. The TLS registry (named TLS configurations, key/trust stores, reloading, the 3.39 post-quantum
        key-exchange options), SSL in native executables.
  - [x] Task 30.3. A short hardening checklist (management interface separation, CORS, CSRF, security headers,
        dependency scanning, CycloneDX SBOMs).

Verification: `npx antora antora-playbook.yml` run against the local (partial, Groups 1-6 only) tree produced no
new/distinct xref errors attributable to these four pages beyond the pre-existing, repo-wide
`backend/quarkus/index.adoc#_bibliography` reference inherited from `quarkus-disclaimer.adoc` (expected until
Group 12 creates `index.adoc`) — the same error every other already-completed Quarkus page in Groups 1-5
produces. Mermaid syntax was reviewed by hand; the `validate:mermaid` gate itself is Group 15's responsibility
and needs on-demand `mermaid`/`jsdom` packages not installed in this environment.

### Group 7 — Observability and resilience (Parallelizable: yes)

Depends on Group 4 (fault tolerance references datasources) but independent of Groups 3, 5, 6.

- [x] Task 31. `observability.adoc` — "Observability: Health, Logging, Metrics, Tracing" — created.
  - [x] Task 31.1. Health (SmallRye Health: `@Liveness`, `@Readiness`, `@Startup`, custom checks, `/q/health*`,
        automatic extension-provided checks, Kubernetes probe wiring); the info endpoint.
  - [x] Task 31.2. Logging (categories, levels, JSON logging, console/file/syslog handlers, runtime level
        changes, centralised log management with Graylog/Logstash/Fluentd, OpenTelemetry logging).
  - [x] Task 31.3. Metrics with Micrometer (registry configuration, `@Counted`/`@Timed`, `MeterRegistry`,
        HTTP/JVM/datasource binders, the Prometheus registry and `/q/metrics`).
  - [x] Task 31.4. OpenTelemetry (tracing, metrics, logging, exporters, sampling, context propagation,
        instrumented extensions, manual spans with `@WithSpan` and the `Tracer` API, the Micrometer→OTel bridge);
        observability Dev Services including the Grafana OTel-LGTM stack; JFR.
  - [x] Task 31.5. Linked `xref:database/prometheus/index.adoc` and
        `xref:backend/springboot/metrics-and-observability.adoc`. Added
        `modules/ROOT/images/quarkus-observability-signal-flow.svg` (logs/metrics/traces flowing from the app to
        an OTLP collector to Loki/Mimir-Prometheus/Tempo, unified in Grafana) and embedded it on the page.
- [x] Task 32. `fault-tolerance-and-resilience.adoc` — "Fault Tolerance and Resilience" — created.
  - [x] Task 32.1. SmallRye Fault Tolerance: `@Retry` (jitter, abort/retry conditions), `@Timeout`, `@Bulkhead`
        (semaphore and thread-pool), `@CircuitBreaker` (state machine, `requestVolumeThreshold`, `failureRatio`,
        `delay`, `successThreshold`, half-open behaviour, programmatic `CircuitBreakerMaintenance`).
  - [x] Task 32.2. `@Fallback`, `@RateLimit`, `@ApplyGuard`/programmatic guards, asynchronous and Mutiny support,
        metrics integration, disabling fault tolerance globally or per annotation.
  - [x] Task 32.3. Load shedding (`/guides/load-shedding-reference/`); service discovery and client-side load
        balancing with SmallRye Stork (providers including Kubernetes and Consul, load-balancer strategies,
        integration with the REST client and gRPC, service registration).
  - [x] Task 32.4. Added two `[mermaid]` diagrams: the circuit-breaker state machine, and retry + bulkhead +
        circuit breaker + fallback composed on one call.

### Group 8 — Testing (Parallelizable: yes)

Depends on Groups 2–7 for its cross-links (Panache, Dev Services, security).

- [x] Task 33. `testing.adoc` — "Testing Quarkus Applications" — created under `modules/ROOT/pages/backend/quarkus/`.
  - [x] Task 33.1. `@QuarkusTest` and the test lifecycle; RESTAssured for endpoint tests; injection in tests and
        `@TestProfile` (custom config, selectively enabled beans, restarting the app between profiles).
  - [x] Task 33.2. Mocking — `@InjectMock`, `@InjectSpy`, `QuarkusMock`, Mockito integration, `PanacheMock`, and
        mocking a REST client; `@QuarkusTestResource`/`QuarkusTestResourceLifecycleManager` and Dev Services in
        tests (including Testcontainers). `PanacheMock` xrefs `panache.adoc#_testing` instead of duplicating its
        worked example; the REST-client-mocking section fulfills the forward reference `rest-client.adoc` already
        made to this page (`@InjectMock` for a stubbed return value, plus a full `QuarkusTestResourceLifecycleManager`
        wiring a WireMock server for HTTP-level client tests).
  - [x] Task 33.3. Component testing with `@QuarkusComponentTest` for narrower, faster tests;
        `@QuarkusIntegrationTest` against the packaged artifact (JAR, native executable, container) and what
        changes (no injection, black-box only); native testing.
  - [x] Task 33.4. Continuous testing as the primary workflow (xrefs `developer-experience.adoc#_continuous_testing`
        rather than re-explaining it); test coverage with JaCoCo (`/guides/tests-with-coverage/`) and its native
        caveats; testing secured endpoints with `@TestSecurity` (xrefs
        `security-overview-and-architecture.adoc#_testsecurity`, which already covers it in depth including OIDC
        claims).
  - [x] Task 33.5. Linked `xref:backend/springboot/unit-and-integration-testing.adoc` for the Spring comparison and
        `xref:programming-languages/java/index.adoc` for JUnit 5/Mockito themselves. Added a `[mermaid]` flowchart
        diagram of the test-type pyramid mapped to the Quarkus annotations (`@QuarkusIntegrationTest` /
        `@QuarkusTest` / `@QuarkusComponentTest` / plain JUnit 5+Mockito).

### Group 9 — Packaging, native images and deployment (Parallelizable: yes)

Depends on Group 2 (`architecture-and-build-time.adoc`) and Group 3 (`rest-services.adoc` for Lambda's HTTP
variant), independent of Groups 4–8.

- [x] Task 34. `packaging-and-jvm-modes.adoc` — "Packaging and JVM Modes" — created (277 lines); verified on disk,
      balanced `[source]`/`----` blocks, `== References` present, disclaimer included.
  - [x] Task 34.1. Package types: fast-jar (default, `quarkus-app/` layout), legacy-jar, uber-jar, mutable-jar and
        re-augmentation; `quarkus.package.*` configuration.
  - [x] Task 34.2. AOT caching (`/guides/aot/`) and what it buys on the JVM; tree-shaking unused dependencies;
        JLink custom runtime images.
  - [x] Task 34.3. Build reproducibility, CycloneDX SBOM generation, releasing with JReleaser; a decision table
        for JVM fast-jar vs. JLink vs. native.
- [x] Task 35. `native-executables.adoc` — "Native Executables with GraalVM/Mandrel" — created (304 lines) plus
      new `modules/ROOT/images/quarkus-native-image-pipeline.svg` (verified well-formed XML); verified on disk,
      balanced `[source]`/`----` and `[mermaid]`/`....` blocks.
  - [x] Task 35.1. How the closed-world analysis works; running the build locally vs. in a container
        (`-Dquarkus.native.container-build=true`); memory and time requirements.
  - [x] Task 35.2. What fails and why (reflection, dynamic proxies, resources, JNI, serialization) and the
        registration annotations/config that fix it (`@RegisterForReflection`, `native-image.properties`,
        resource includes); build-time vs. run-time initialisation; SSL/TLS in native mode.
  - [x] Task 35.3. Debugging and profiling a native binary; compressing with UPX; testing native executables with
        `@QuarkusIntegrationTest`; measuring startup and RSS honestly (`/guides/performance-measure/`).
  - [x] Task 35.4. A straight cost/benefit table (startup and memory vs. build time, peak throughput, tooling
        maturity, observability limitations) so the reader can decide when native is worth it.
  - [x] Task 35.5. Added the SVG of the native-image build pipeline, and a `[mermaid]` decision tree "should this
        service be native?".
- [x] Task 36. `container-images.adoc` — "Container Images" — created (237 lines); verified on disk, balanced
      `[source]`/`----` blocks, `== References` present, disclaimer included.
  - [x] Task 36.1. The four container-image extensions (Jib, Docker, Buildpacks, S2I), what each needs and
        produces; the Dockerfiles Quarkus generates (`Dockerfile.jvm`, `Dockerfile.native`,
        `Dockerfile.native-micro`, `Dockerfile.legacy-jar`).
  - [x] Task 36.2. The Quarkus runtime base images (UBI micro, distroless-style) and layer caching; pushing to a
        registry from the build; image naming and tagging config; container resource sizing for JVM vs. native.
- [x] Task 37. `kubernetes-and-openshift.adoc` — "Kubernetes and OpenShift" — created (252 lines); verified on
      disk, balanced `[source]`/`----` and `[mermaid]`/`....` blocks.
  - [x] Task 37.1. The Kubernetes extension: generating `kubernetes.yml`/`openshift.yml`, the configuration
        properties that shape them (labels/annotations, env vars, ports, resources, probes from the health
        extension, service type, ingress), `quarkus.kubernetes.deploy=true` for one-step deploy, Knative targets,
        init tasks and jobs.
  - [x] Task 37.2. OpenShift specifics (DeploymentConfig vs. Deployment, S2I, Docker build strategy, native on
        OpenShift); `quarkus-kubernetes-config` for reading ConfigMaps/Secrets directly.
  - [x] Task 37.3. The Fabric8 Kubernetes client extension for programmatic cluster access and testing with the
        mock server; a short note on writing operators with the Java Operator SDK extension; Dev Services for
        Kubernetes.
  - [x] Task 37.4. Added a `[mermaid]` diagram of the build → image → manifest → cluster pipeline.
- [x] Task 38. `serverless-and-cloud-functions.adoc` — "Serverless and Cloud Functions" — created (310 lines);
      verified on disk, balanced `[source]`/`----` and `[mermaid]`/`....` blocks.
  - [x] Task 38.1. AWS Lambda (the Java runtime, the Quarkus Lambda extension, the HTTP variant for Quarkus
        REST/reactive-routes/Undertow, native vs. JVM, SnapStart configuration and its interaction with Quarkus).
  - [x] Task 38.2. Google Cloud Functions and Azure Functions (plain and HTTP variants); Funqy as the portable
        function API and its bindings (HTTP, AWS Lambda, GCP, Azure, Knative Events); deploying to Azure/GCP/Heroku.
  - [x] Task 38.3. Added a `[mermaid]` diagram of a cold start on each option, including a cold-start comparison
        (JVM, JVM+SnapStart/AOT, native).
- [x] Task 39. `command-mode-and-cli-applications.adoc` — "Command Mode and CLI Applications" — created
      (235 lines); verified on disk, balanced `[source]`/`----` blocks, `== References` present, disclaimer
      included.
  - [x] Task 39.1. `@QuarkusMain` and `QuarkusApplication`, command mode lifecycle and exit codes,
        `Quarkus.waitForExit()`.
  - [x] Task 39.2. Picocli for option/subcommand parsing, the Aesh option, packaging a CLI as a native binary,
        and scripting with JBang.
  - [x] Task 39.3. When command mode is the right shape (batch jobs, migrations, admin tools).
- [x] Task 40. `scheduling-and-mail.adoc` — "Scheduling and Mail" — created (464 lines); verified on disk,
      balanced `[source]`/`----` blocks, `== References` present, disclaimer included.
  - [x] Task 40.1. `@Scheduled`: cron and interval syntax, config-driven schedules, concurrent execution control
        (`ConcurrentExecution`, `@NonBlocking`), skip predicates, programmatic scheduling with the `Scheduler`
        API, pausing/resuming, metrics.
  - [x] Task 40.2. Quartz for clustered, persistent schedules (job stores, misfire policies, running a single
        instance across replicas) — link `xref:backend/springboot/scheduling-and-shedlock.adoc` as the Spring
        answer to the same problem.
  - [x] Task 40.3. The Mailer extension (blocking and reactive APIs, attachments, Qute mail templates, Dev
        Services/mock mode for development, configuring SMTP and providers).

### Group 10 — Advanced (Parallelizable: yes)

Depends on Groups 2–9 for its cross-links and mapping tables.

- [x] Task 41. `writing-extensions.adoc` — "Writing Extensions" — created; covers the CLI-scaffolded
      deployment/runtime module layout, `@BuildStep`/build items, `@Recorder`/`@Record(ExecutionTime)`,
      `@ConfigRoot`/`@ConfigMapping` build-time config, conditional dependencies/capabilities/maturity metadata,
      CDI integration and codestarts, writing a Dev Service and a Dev UI page, native-image build items, testing
      via `QuarkusUnitTest`/`@QuarkusTest`, and when to write an extension vs. a plain CDI bean; xrefs
      `architecture-and-build-time.adoc`, `cdi-and-the-programming-model.adoc`, `developer-experience.adoc`,
      `native-executables.adoc`, and `testing.adoc` rather than re-explaining their conceptual material.
  - [x] Task 41.1. Deployment/runtime module split, `@BuildStep`/build items table
          (`AdditionalBeanBuildItem`, `ReflectiveClassBuildItem`, `FeatureBuildItem`, `SyntheticBeanBuildItem`),
          `@Recorder`s and `@Record(ExecutionTime)` bytecode recording — done, with runnable Java examples.
  - [x] Task 41.2. `@ConfigRoot(phase = BUILD_TIME)`/`@ConfigMapping` configuration, conditional dependencies
          and capabilities, extension metadata/maturity matrix (xref to `extensions-and-the-platform.adoc`),
          CDI integration, codestarts — done.
  - [x] Task 41.3. Writing a Dev Service, adding a Dev UI page, native-image support build items
          (`NativeImageResourceBuildItem`, `NativeImageProxyDefinitionBuildItem`,
          `RuntimeInitializedClassBuildItem`), testing with `QuarkusUnitTest`/`@QuarkusTest`, and a closing
          "when to write an extension at all" section — done.
  - [x] Task 41.4. Added `modules/ROOT/images/quarkus-extension-build-flow.svg` (deployment module → @Recorder
          call → static/runtime init replay → runtime module), well-formed SVG XML verified.
- [x] Task 42. `spring-compatibility.adoc` — "Spring API Compatibility Extensions" — created; honestly scopes
      all 11 named compatibility extensions, a Spring-idiom-to-Quarkus-native mapping table, and a realistic
      migration path (what transfers annotation-for-annotation, what needs a rewrite, when a rewrite beats a
      port).
  - [x] Task 42.1. Extensions-supported table for `spring-di`, `spring-web`, `spring-data-jpa`,
          `spring-data-rest`, `spring-tx`, `spring-security`, `spring-cache`, `spring-scheduled`,
          `spring-boot-properties`, `spring-cloud-config-client`, `spring-test` — done.
  - [x] Task 42.2. Supported/not-supported columns per extension, plus an explicit "what compatibility
          actually means" section stating no real `ApplicationContext`/`BeanFactory` exists underneath — done.
  - [x] Task 42.3. Mapping table (Spring idiom → Quarkus-native equivalent) and the "realistic migration path"
          section (transfers close to annotation-for-annotation / must be rewritten / when a rewrite is
          cheaper) — done.
  - [x] Task 42.4. Added `modules/ROOT/images/quarkus-spring-annotation-mapping.svg` mapping 8 common Spring
          annotations to their Quarkus/Jakarta counterparts, well-formed SVG XML verified.
- [x] Task 43. `build-tooling-and-languages.adoc` — "Build Tooling and Language Support" — created; covers CLI
      subcommands, Maven/Gradle goals and native profiles, `quarkus update`, IDE support, build analytics
      opt-out, and Kotlin tooling mechanics narrowed to build config (points to `java-or-kotlin.adoc`, Task 45,
      for the language-choice discussion, satisfying the plan's cross-group dependency note).
  - [x] Task 43.1. Quarkus CLI subcommands (`extension`, `dev`, `build`, `image`, `deploy`, `update`); Maven
          (`quarkus-maven-plugin` goals, native profile); Gradle (plugin, tasks, native build, differences from
          Maven) — done, cross-linking `getting-started.adoc` for project-creation basics already covered there.
  - [x] Task 43.2. `quarkus update`/OpenRewrite recipes (xref to `extensions-and-the-platform.adoc` for the
          mechanism), IDE support (`/guides/ide-tooling/`), build analytics and opt-out
          (`quarkus.analytics.disabled` / `QUARKUS_ANALYTICS_DISABLED`) — done.
  - [x] Task 43.3. Kotlin tooling mechanics only (the `kotlin` extension, `hibernate-orm-panache-kotlin` and
          its `PanacheCompanion`-based API), explicitly deferring null safety/coroutines-vs-Mutiny/boilerplate to
          `xref:backend/quarkus/java-or-kotlin.adoc[]`; Scala/Groovy status in one paragraph — done.
- [x] Task 44. `performance-and-tuning.adoc` — "Performance and Tuning" — created; covers measurement
      methodology, packaging-mode performance trade-offs, HTTP/thread-pool/connection-pool tuning knobs,
      Quarkus-specific pitfalls, and a stale-benchmark-numbers warning.
  - [x] Task 44.1. Measurement table (startup to first response, RSS after warm-up, throughput/tail latency,
          container density) plus JFR, `-XX:+UseSerialGC` defaults, and container memory-limit/JVM-ergonomics
          guidance, linking `/guides/performance-measure/` — done.
  - [x] Task 44.2. Packaging-mode performance ordering (native < fast-jar < JLink, cross-linking
          `packaging-and-jvm-modes.adoc`) plus concrete `quarkus.http.*`/`quarkus.thread-pool.*` tuning
          properties and an Agroal connection-pool cross-link to `datasources-and-transactions.adoc` — done.
  - [x] Task 44.3. Four Quarkus-specific pitfalls covered with cross-links: blocking the event loop,
          unremovable beans, over-broad reflection registration, Dev Services leaking into production — done.
  - [x] Task 44.4. Closing "stale benchmark numbers" section naming the two books and old blog posts
          explicitly as not-to-be-quoted sources — done.
- [x] Task 45. `java-or-kotlin.adoc` — "Java or Kotlin for Quarkus?" — created, modeled directly on
      `backend/springboot/java-or-kotlin.adoc`'s structure (intro → first-class-support section → pros/cons
      table → side-by-side `@Path` resource → "When to Choose Which" → `== References`); implemented before
      Task 43 in this same group so `build-tooling-and-languages.adoc`'s narrowing xref target existed.
  - [x] Task 45.1. Model this page directly on the existing
        `xref:backend/springboot/java-or-kotlin.adoc[]` (same title pattern, same page shape: intro paragraph →
        first-class-support section → pros/cons table → side-by-side minimal REST resource → "When to Choose
        Which" → `== References`) — this repo already has exactly this page type for SpringBoot; reuse its
        structure rather than inventing a new one. Done — `java-or-kotlin.adoc` follows this shape exactly.
  - [x] Task 45.2. Quarkus's own Kotlin support mechanics (the "first-class support" section, Quarkus-specific
        rather than copied from SpringBoot's): the `io.quarkus:quarkus-kotlin` extension
        (`./mvnw quarkus:add-extension -Dextensions=kotlin`); the **`all-open`** and **`no-arg`** Kotlin compiler
        plugins and *why Quarkus needs them* — CDI/ArC beans built at build time still need non-`final` classes
        for certain proxying (interceptors/decorators, some scopes) and Panache active-record entities need a
        no-arg constructor and non-`final` fields/methods, the same underlying constraint as Hibernate's, just
        applied at Quarkus's build-time-augmentation layer rather than Spring's runtime CGLIB layer — cross-link
        `xref:backend/quarkus/cdi-and-the-programming-model.adoc[]` and `xref:backend/quarkus/panache.adoc[]`
        rather than re-explaining either; the Gradle/Maven plugin configuration for both. Done, with the Maven
        and Gradle `all-open`/`no-arg` configuration shown in full.
  - [x] Task 45.3. Pros/cons comparison table (mirroring the SpringBoot page's dimensions, each row re-grounded in
        Quarkus specifics, not restated Spring content):
        * **Null safety** — Kotlin's `String` vs. `String?` (`xref:programming-languages/kotlin/null-safety.adoc[]`)
          eliminating a class of NPEs at compile time vs. Java's runtime risk, same as the SpringBoot comparison,
          plus how it interacts with Quarkus REST's Jackson/JSON-B (de)serialization of nullable fields and
          Panache's public-field entities.
        * **Concurrency model: virtual threads vs. coroutines** — Quarkus's `@RunOnVirtualThread`
          (`xref:backend/quarkus/virtual-threads.adoc[]`) for blocking-style code at reactive-engine scale vs.
          Kotlin coroutines' `suspend` functions; **and, distinctly, coroutines vs. Mutiny** — `suspend fun`/
          structured concurrency/`Flow` as one reactive idiom vs. `Uni`/`Multi`
          (`xref:backend/quarkus/reactive-programming-and-mutiny.adoc[]`) as another, including that Quarkus
          provides `kotlinx-coroutines` interop so a `suspend` REST/messaging method and a `Uni`-returning one
          can both be used, and honest guidance on when to reach for which instead of mixing both idioms in the
          same codebase.
        * **Boilerplate** — Lombok (Java) vs. Kotlin `data class`
          (`xref:programming-languages/kotlin/data-classes-and-destructuring.adoc[]`), same framing as the
          SpringBoot page.
        * **Build-time augmentation / all-open** — Java's non-`final`-by-default classes need no extra step;
          Kotlin needs the `all-open`/`no-arg` plugins from Task 45.2 (Quarkus's build-time-augmentation
          equivalent of the SpringBoot page's "Framework proxying / all-open" and "JPA/Hibernate interop" rows,
          collapsed into one row since Quarkus's closed-world model makes both the same underlying constraint).
        * **Native image / GraalVM** — a Quarkus-specific row with no SpringBoot equivalent: Kotlin's
          reflection-heavy stdlib features (e.g. some `kotlin-reflect` usage) needing the same
          `@RegisterForReflection`-style registration as Java under the closed-world model
          (`xref:backend/quarkus/native-executables.adoc[]`); note that Kotlin native-image support is mature
          and well-trodden in the Quarkus ecosystem, not a second-class path.
        * **Java interop / ecosystem**, **compile times / tooling (K2)**, **hiring / ramp-up**, **Android code
          sharing** — same framing as the SpringBoot page, reworded for Quarkus's extension ecosystem where it
          differs (e.g. Quarkiverse extension coverage for Kotlin is good but narrower than core Quarkus's).
        Done — all rows present, including the native-image row with no SpringBoot equivalent.
  - [x] Task 45.4. Side-by-side minimal example: the same kind of `@Path` REST resource in Java and in Kotlin
        (mirroring the SpringBoot page's `@RestController` pair), showing Kotlin's `?.let { }`/`?:` null-handling
        idiom against Java's `Optional`, and a short note on whether the shown class needs `all-open` (per Task
        45.2) or not (e.g. a REST resource proxied via CDI, as opposed to a plain, non-proxied class). Done.
  - [x] Task 45.5. "When to Choose Which" — same even-handed, non-mandate framing as the SpringBoot page's
        closing section, adapted to when a Quarkus-specific driver tips the balance (e.g. a team already
        comfortable with Mutiny's reactive style may prefer coroutines' more linear-looking code, or vice versa
        if they're already fluent in reactive operators). Done.
  - [x] Task 45.6. `== References` linking https://quarkus.io/guides/kotlin/[the official Quarkus Kotlin guide],
        https://kotlinlang.org/docs/all-open-plugin.html[the Kotlin all-open compiler plugin docs],
        https://kotlinlang.org/docs/no-arg-plugin.html[the no-arg compiler plugin docs],
        https://kotlinlang.org/docs/coroutines-guide.html[the Kotlin coroutines guide], and
        https://smallrye.io/smallrye-mutiny/[the Mutiny documentation] — never a third-party comparison article
        as a primary source.

### Group 11 — Quarkus vs. Spring Boot comparison (Parallelizable: yes)

Depends on Groups 2–10: the mapping table, architecture section and decision guide reference nearly every topic
page's final concept names, plus `spring-compatibility.adoc`.

- [x] Task 46. `quarkus-vs-spring-boot.adoc` — "Quarkus vs. Spring Boot" — created (365 lines) under
      `modules/ROOT/pages/backend/quarkus/`; disclaimer include, two mapping/reference tables, one decision-guide
      table, a `[mermaid]` decision-tree flowchart, and a new SVG
      (`modules/ROOT/images/quarkus-vs-springboot-startup-pipeline.svg`, verified well-formed XML). Build-verified
      with `npx antora antora-playbook.yml` (exit 0): the only error reported for this page is the pre-existing,
      expected `backend/quarkus/index.adoc#_bibliography` xref shared by every sibling page via
      `quarkus-disclaimer.adoc` (lands in Group 12); the rendered HTML confirms both tables, the mermaid block,
      and all 9 distinct `backend/springboot/*` xrefs resolve and link correctly.
  - [x] Task 46.1. One-paragraph summary of what each framework optimises for — added as the page's opening
        paragraph (Spring Boot: ecosystem breadth + runtime dynamism; Quarkus: startup/memory/density via
        build-time augmentation and the closed-world trade-off).
  - [x] Task 46.2. Side-by-side concept/annotation mapping table — all listed rows present
        (`@SpringBootApplication` vs. no equivalent; `@Component`/`@Service`/`@Repository` vs.
        `@ApplicationScoped`; `@Autowired` vs. `@Inject`; `@Value`/`@ConfigurationProperties` vs.
        `@ConfigProperty`/`@ConfigMapping`; `@RestController`/`@GetMapping` vs. `@Path`/`@GET`;
        `RestClient`/`@HttpExchange` vs. `@RegisterRestClient`; Spring Data repositories vs. Panache/Quarkus
        Data; `@Transactional` Spring vs. Jakarta; `@Cacheable` vs. `@CacheResult`; `@Scheduled` vs.
        `@Scheduled`; Reactor `Mono`/`Flux` vs. Mutiny `Uni`/`Multi`; Actuator vs. `/q/*` + SmallRye
        Health/Micrometer; Testcontainers-by-hand vs. Dev Services; `@SpringBootTest` vs. `@QuarkusTest`; Spring
        profiles vs. Quarkus profiles; Spring Cloud vs. the Quarkus/SmallRye equivalents), each cross-linked to
        its topic page on both sides.
  - [x] Task 46.3. Architecture section added — runtime reflection and a runtime `ApplicationContext` vs.
        build-time augmentation and the closed-world assumption, and what each choice costs (library
        compatibility on the Quarkus side; per-start discovery cost on the Spring side).
  - [x] Task 46.4. Startup, memory and native image section added — Quarkus JVM/native vs. Spring Boot's default
        JVM path plus Spring AOT + GraalVM native support, naming explicitly where Spring has narrowed the gap
        (AOT-processed native builds) and where it has not (the default JVM path most apps actually run); no
        benchmark numbers cited from either side.
  - [x] Task 46.5. Developer experience section added — dev mode + Dev UI + Dev Services + continuous testing
        vs. Spring Boot DevTools + Docker Compose support + Testcontainers-at-dev-time
        (`@ServiceConnection`/`spring-boot:test-run`).
  - [x] Task 46.6. Ecosystem and standards section added — Spring's breadth and Spring Cloud vs. Jakarta
        EE/MicroProfile standards, SmallRye, Quarkiverse and Camel Quarkus (cited via camel.apache.org).
  - [x] Task 46.7. Hiring, community and longevity section added — relative community/installed-base size and
        what it means for finding answers, libraries and engineers on each side.
  - [x] Task 46.8. Explicit pros/cons lists added for both frameworks, covering exactly the named downsides on
        each side (Quarkus: ecosystem/talent pool, closed-world library friction, build times, extension
        dependency, native-image debugging limits; Spring Boot: startup/memory under default config, runtime
        reflection cost, heavier native-image path, auto-configuration opacity).
  - [x] Task 46.9. "Which should I choose?" decision-guide table added for all six named scenarios, plus a
        migration section linking `xref:backend/quarkus/spring-compatibility.adoc[]`.
  - [x] Task 46.10. Every claim traced to Quarkus's or Spring Boot's own docs (no third-party benchmark/marketing
        figures); `xref:backend/springboot/index.adoc[]` linked in the opening paragraph plus 8 more specific
        `backend/springboot/*` pages linked at the relevant mapping-table rows/sections.
  - [x] Task 46.11. Added `modules/ROOT/images/quarkus-vs-springboot-startup-pipeline.svg` (two pipelines side by
        side, well-formed XML verified) and a `[mermaid]` decision-tree flowchart in the decision-guide section.

### Group 12 — Landing page and cheat-sheet page (Parallelizable: yes)

Depends on Groups 2–11: both pages enumerate and cross-reference every topic page (and the comparison page) by
its final title.

- [x] Task 47. `index.adoc` — "Quarkus Reference" landing page — created (203 lines) under
      `modules/ROOT/pages/backend/quarkus/`; disclaimer include, intro/relationship prose, a 46-bullet
      `== What's covered` across 11 subheadings, and an anchored `== Bibliography`. Build-verified with
      `npx antora antora-playbook.yml` (exit 0): zero errors/warnings attributable to this page, and the
      previously-shared, expected `backend/quarkus/index.adoc#_bibliography` forward-reference error (present on
      every sibling page since Group 1) is now gone, confirming the anchor resolves.
  - [x] Task 47.1. Title/description/keywords + disclaimer include; opening paragraph on what Quarkus is (a
        Kubernetes-native Java framework that moves as much work as possible from runtime to build time); a
        "new here? read in this order" pointer (Getting Started → Build-Time Augmentation and the Closed World →
        CDI and the Programming Model (ArC) / Configuration → the rest as needed) — done.
  - [x] Task 47.2. Relationship paragraph added, each reference linked: `xref:backend/springboot/index.adoc[]`
        (plus the comparison and Spring-compatibility pages), `xref:backend/hibernate/index.adoc[]`,
        `xref:backend/graphql/index.adoc[]` and `xref:backend/oauth/index.adoc[]`, each stating what Quarkus adds
        on top vs. what to look up there — done.
  - [x] Task 47.3. `== What's covered` added with one bullet per page under the nine Group 2–10 headings
        (Foundations 6, REST/web/APIs 8, Data 8, Reactive/concurrency/messaging 3, Security 4,
        Observability/resilience 2, Testing 1, Packaging/native/deployment 7, Advanced 5 = 44 topic-page bullets)
        plus a Comparison heading (`quarkus-vs-spring-boot.adoc`) and a Reference heading (`cheat-sheet.adoc`) =
        46 bullets total. Verified: `ls modules/ROOT/pages/backend/quarkus/` shows exactly 47 files (44 topic
        pages incl. `java-or-kotlin.adoc` + `index.adoc` + `quarkus-vs-spring-boot.adoc` + `cheat-sheet.adoc`),
        and every one of the 47 unique `xref:backend/quarkus/*.adoc` targets referenced across `index.adoc`
        (including the self-reference in the Bibliography note) resolves to a file that exists on disk (checked
        programmatically, zero missing).
  - [x] Task 47.4. `[[_bibliography]]` `== Bibliography` added, grouped exactly as specified: official Quarkus
        documentation (guides, blog incl. the Java 21 post, extension registry, source repo); upstream
        specifications and projects (Jakarta EE, MicroProfile, SmallRye, Vert.x, GraalVM/Mandrel, Hibernate,
        Keycloak, Kafka, OpenTelemetry, Micrometer, Camel Quarkus, Quarkiverse); Spring documentation scoped
        explicitly to the comparison/compatibility pages only; consulted reference books — *Quarkus Cookbook*
        (O'Reilly, ISBN 978-1-492-06266-9, targets Quarkus 1.4/`javax.*`, flagged largely superseded, linked to
        its O'Reilly publisher page) and *Quarkus in Action* (Manning, Jan 2025, targets Quarkus 3.15 LTS, flagged
        one LTS behind, linked to its Manning publisher page) — closed with the house note that
        https://quarkus.io/guides/ wins on any discrepancy and neither book's benchmark/footprint figures may be
        quoted. Neither book was attached, uploaded or excerpted — cited/linked only.
- [x] Task 48. `cheat-sheet.adoc` — "Quarkus Cheat Sheet" — created (86 lines) under
      `modules/ROOT/pages/backend/quarkus/`, modeled exactly on `backend/springboot/cheat-sheet.adoc`'s shape
      (no `== Download` heading, just a trailing `xref:attachment$` line).
  - [x] Task 48.1. Short page listing what the sheet covers, cross-referencing all 44 topic pages plus the
        `quarkus-vs-spring-boot.adoc` comparison page (verified programmatically: the set of pages linked here
        exactly equals every `.adoc` file in the directory other than `index.adoc` and `cheat-sheet.adoc`
        itself, zero missing/extra), and linking the PDF via
        `xref:attachment$quarkus-cheat-sheet.pdf[Download the Quarkus Cheat Sheet (PDF)]`. Build-verified: this
        is the **only** error `npx antora antora-playbook.yml` reports for either page in this group —
        `target of xref not found: attachment$quarkus-cheat-sheet.pdf` — exactly the expected, documented gap
        until Group 13 generates the PDF; not a blocker for this group, resolved by the Group 15 gate.

### Group 13 — Cheat-sheet PDF (Parallelizable: yes)

Depends on Group 12: the sheet's contents must match what `cheat-sheet.adoc` says it covers.

- [x] Task 49. Produce `modules/ROOT/attachments/quarkus-cheat-sheet.pdf` — done: a 19-box, 7-column, colour-coded
      A4-landscape sheet rendered via local Chrome, verified single-page with no clipped content (see 49.6). Only
      the PDF is checked in; the HTML source lived in the session scratch directory and was not committed.
  - [x] Task 49.1. Authored `quarkus-cheat-sheet.html` in the session's scratch directory (not checked in): A4
        landscape `@page` size, a CSS multi-column (`column-count:7`) layout of `break-inside:avoid` boxes with
        solid colour-filled uppercase headers (matching `springboot-cheat-sheet.pdf`'s box style), a header line
        (title left, version/verification subtitle right) and a breadcrumb footer
        (`Irurueta Docs · Guides & References → Backend Development → Quarkus Reference` / site host), matching
        `springboot-cheat-sheet.pdf` / `oauth-cheat-sheet.pdf`'s visual language.
  - [x] Task 49.2. Covered in dedicated boxes: **CLI, Maven & Dev Mode** (create/dev/ext add/build/build
        --native/image build/deploy/update table + Maven equivalents + dev-mode key bindings), **Project Layout**
        (source-tree diagram), **CDI (ArC) Annotations** (scopes, producers/qualifiers, interceptors, lifecycle
        events), **Configuration** (precedence ladder, profile syntax, `@ConfigMapping` skeleton, build-time-fixed
        vs. runtime note), **Quarkus REST** (annotation list + minimal `HelloResource`), **REST Client**
        (`@RegisterRestClient` skeleton + config key + injection).
  - [x] Task 49.3. Covered: **Panache & @Transactional** (active-record + repository one-liners, query/pagination/
        sort cheat rows, `@Transactional` rollback/propagation rules), **Mutiny Uni/Multi** (type/emit table +
        operator families), **@RunOnVirtualThread** (its own box), **Reactive Messaging**
        (`@Incoming`/`@Outgoing`/`Emitter` syntax + ack strategies), **Fault Tolerance (MP)** (annotation-to-default
        table: `@Retry`/`@Timeout`/`@CircuitBreaker`/`@Bulkhead`/`@Fallback`/`@Asynchronous`).
  - [x] Task 49.4. Covered: **Security & OIDC** (annotation list, `quarkus.http.auth.permission.*` policy rows, the
        OIDC web-app/service config two-liner), **/q/* Endpoints** (health/health-live/health-ready/metrics/
        openapi/swagger-ui/dev/info), **Testing** (`@QuarkusTest`/`@QuarkusIntegrationTest`/`@TestProfile`/
        `@TestSecurity`/`@InjectMock`/`@InjectSpy`), **Dev Services (support)** (matrix prose row), **Packaging &
        Native** (jar-type/native property table), **Container Image & Kubernetes** (property rows),
        **Qute Templating** (syntax mini-table + `@CheckedTemplate` note), **Spring → Quarkus** (mapping strip).
  - [x] Task 49.5. Found a local Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (per the
        note that a prior run already confirmed it) and rendered with
        `--headless --disable-gpu --no-pdf-header-footer --print-to-pdf=modules/ROOT/attachments/quarkus-cheat-sheet.pdf`
        against the scratch HTML's `file://` URL. No fallback to Playwright/Chromium was needed.
  - [x] Task 49.6. Verified: `pypdf` (no `pdfinfo` binary available in this environment; used as an equivalent
        programmatic check) reports `len(pages) == 1` and a mediabox of 841.92×594.96pt = 297.0×209.9mm, i.e. A4
        landscape. A DOM overflow probe (a temporary `window.onload` script computing `scrollWidth/scrollHeight`
        vs. `clientWidth/clientHeight` for every `.box` and its descendants, run headless at the exact print
        content width of 1063×752px = 281×187mm) reported `NO_OVERFLOW_DETECTED` after two rounds of fixes: (1)
        `table-layout:auto` was letting long unbroken tokens (e.g. `quarkus.container-image.build`,
        `liveness+readiness+startup`) force tables wider than their box, silently clipping wrapped lines
        mid-word — fixed with `table-layout:fixed` + explicit 44/56 column widths + `overflow-wrap:anywhere` on
        table cells; (2) a residual 8px overflow in one prose box from an unbroken slash-chained list — fixed by
        adding `overflow-wrap:anywhere` to `.box .body` generally. Re-extracted PDF text after each fix to confirm
        no characters were being dropped (`pypdf.extract_text()` showed full words, not truncated fragments).
        Visually confirmed via a macOS Quick Look thumbnail render (`qlmanage -t -s 2200`, ~265 dpi over the
        209.9mm page height) that every box's text is fully visible and the page reads as one dense, colour-coded
        sheet consistent with the two reference PDFs. Iterated column-count/font-size/padding twice (first pass
        was too sparse — column-count 7 at ~6.6px left ~40% of the page blank; second pass at column-count 6 with
        larger fonts overflowed to 2 pages; settled on column-count 7 with body text at 7.0px / tables at 6.9px /
        code at 6.8px, which fills the page densely while staying at exactly one page).

### Group 14 — Site wiring and reciprocal cross-links (Parallelizable: yes)

Depends on Groups 2–13: the nav block lists every page, and the index bullet describes the finished section.

- [x] Task 50. Add the Quarkus Reference nav block to `modules/ROOT/nav.adoc` — done: a `***` block for
      `backend/quarkus/index.adoc[Quarkus Reference]` plus 44 `****` topic-page entries (nav-entry text taken
      verbatim from each page's own `= <Title>` H1, cross-checked against `index.adoc`'s `== What's covered`),
      ending with `Cheat Sheet (PDF)`.
  - [x] Task 50.1. All 44 `****` entries inserted in the Group 2–11 order (Foundations → REST/web → Data →
        Reactive/messaging → Security → Observability/resilience → Testing → Packaging/deployment → Advanced →
        Comparison), using absolute `***`/`****` levels inline, matching the Hibernate/SpringBoot/GraphQL/Spring
        Batch/OAuth blocks.
  - [x] Task 50.2. Placed immediately after `**** xref:backend/oauth/cheat-sheet.adoc[Cheat Sheet (PDF)]` and
        before `** xref:apps/index.adoc[Apps]`.
- [x] Task 51. Add the "Quarkus Reference" bullet to `modules/ROOT/pages/backend/index.adoc` — done.
  - [x] Task 51.1. Appended a seventh `== Sections` bullet in the same style as the existing six, ending
        "…plus a downloadable cheat sheet" and mentioning "Java vs. Kotlin guidance", matching the SpringBoot
        bullet's own closing phrase.
  - [x] Task 51.2. Extended `:description:` (added "and Quarkus Reference" to the subsection list plus a clause
        on Kubernetes-native Java/build-time augmentation/native images) and `:keywords:` (appended "Quarkus,
        GraalVM, native image, Panache, Mutiny, MicroProfile, SmallRye, Dev Services, Qute").
- [x] Task 52. Extend the root `modules/ROOT/pages/index.adoc` keywords — done.
  - [x] Task 52.1. Appended `Quarkus, GraalVM, native image, Panache, Mutiny, MicroProfile, SmallRye, Dev
        Services, Qute` to the `:keywords:` line (line 3), preserving existing order/formatting; no
        project-picker tile or image added.
- [x] Task 53. Add the reciprocal pointer and mention on `backend/springboot/index.adoc` — done.
  - [x] Task 53.1. Added a "How does this compare to Quarkus?" paragraph pointing to
        `xref:backend/quarkus/quarkus-vs-spring-boot.adoc` (and `backend/quarkus/index.adoc`), plus a new
        "Quarkus Reference" bullet under `=== Reference` linking `backend/quarkus/index.adoc`,
        `quarkus-vs-spring-boot.adoc` and `spring-compatibility.adoc`.
- [x] Task 54. Add one reciprocal `xref:` each into seven SpringBoot topic pages — done, all additive.
  - [x] Task 54.1. `concurrency-alternatives.adoc` — added a "Quarkus equivalent" sentence linking
        `xref:backend/quarkus/virtual-threads.adoc` after the Virtual Threads pros/cons paragraph.
  - [x] Task 54.2. `reactive-programming.adoc` — added a closing sentence linking
        `xref:backend/quarkus/reactive-programming-and-mutiny.adoc` in "Further learning".
  - [x] Task 54.3. `caching.adoc` — added a sentence linking `xref:backend/quarkus/caching.adoc` at the end of
        "Choosing between Caffeine and Redis".
  - [x] Task 54.4. `messaging-kafka.adoc` — added a closing paragraph linking
        `xref:backend/quarkus/messaging.adoc` after "Further reading".
  - [x] Task 54.5. `metrics-and-observability.adoc` — added a closing paragraph linking
        `xref:backend/quarkus/observability.adoc` after the Summary bullets.
  - [x] Task 54.6. `scheduling-and-shedlock.adoc` — added a sentence linking
        `xref:backend/quarkus/scheduling-and-mail.adoc` before `== References`.
  - [x] Task 54.7. `unit-and-integration-testing.adoc` — added a closing sentence linking
        `xref:backend/quarkus/testing.adoc`.
  - [x] Task 54.8. Every edit was one additive sentence/paragraph; no existing prose was rewritten.
- [x] Task 55. Add the reciprocal cross-links into Hibernate, GraphQL and OAuth landing pages — done.
  - [x] Task 55.1. `backend/hibernate/index.adoc` — added "See also `xref:backend/quarkus/hibernate-orm-and-jpa.adoc[]`"
        to the "Getting Started" bullet (bootstrapping) and "See also `xref:backend/quarkus/panache.adoc[]`" to
        the "Hibernate Reactive and Data Repositories" bullet (repositories).
  - [x] Task 55.2. `backend/graphql/index.adoc` — added an intro-paragraph pointer plus a new
        `=== Quarkus integration` subsection with one bullet for `xref:backend/quarkus/graphql.adoc[]`, alongside
        the Spring Boot/Python integration subsections.
  - [x] Task 55.3. `backend/oauth/index.adoc` — added an intro-paragraph pointer plus a new
        `=== Other framework bindings` subsection with one bullet for
        `xref:backend/quarkus/security-jwt-oidc-and-keycloak.adoc[]`, next to the Spring Boot integration
        subsection.
- [x] Task 56. Optional inbound links (best-effort, not gated by final acceptance walk) — done.
  - [x] Task 56.1. `programming-languages/java/index.adoc` — added a "See also" sentence on the Virtual Threads
        bullet linking `xref:backend/quarkus/virtual-threads.adoc`.
  - [x] Task 56.2. `programming-languages/kotlin/index.adoc` — added a "See also" sentence on the Build and
        Tooling bullet linking `xref:backend/quarkus/build-tooling-and-languages.adoc`.

### Group 15 — Build, Mermaid validation and final verification (Parallelizable: no — Task 58 verifies output that Task 57 must first make clean)

- [x] Task 57. Build the site and drive it to zero warnings, and validate every Mermaid block — done.
  - [x] Task 57.1. Delegated to `iru-gate-runner`: `npx antora antora-playbook.yml` completed (exit 0).
  - [x] Task 57.2. First run surfaced 12 benign "skipping reference to missing attribute" warnings (no xref
        errors) — `{orderId}`/`{id}`/`{expression}`/`{name}`/`{room}`/`{placeholder}` used as inline prose in
        `openapi-and-swagger-ui.adoc`, `panache.adoc`, `qute-templating.adoc` (×2), `rest-services.adoc`,
        `scheduling-and-mail.adoc` and `websockets.adoc` (×2 lines) being misread as AsciiDoc attribute
        references. Fixed by escaping each with a leading backslash (`\{id}` etc., rendered output unchanged).
        Re-ran the build: **zero** warnings or errors of any kind (empty stdout/stderr, exit 0) — no unresolved
        `xref:backend/quarkus/*`, no unresolved `xref:` into `backend/springboot/*`, `backend/hibernate/*`,
        `backend/graphql/*` or `backend/oauth/*`, no missing `attachment$quarkus-cheat-sheet.pdf`, no missing
        `modules/ROOT/images/quarkus-*.svg`, and `index.adoc#_bibliography` resolves.
  - [x] Task 57.3. `npm run validate:mermaid` (`node scripts/validate-mermaid.mjs`, via the same agent, after
        installing the on-demand `mermaid@11`/`jsdom` dependencies with `npm i --no-save`): all 278 Mermaid
        diagrams parsed successfully, zero errors.
- [x] Task 58. Spot-check the rendered site and walk the acceptance criteria — done.
  - [x] Task 58.1. Spot-checked `build/site` by serving it over a local HTTP server and driving it in a browser:
        the nav tree shows "Quarkus Reference" immediately after "OAuth Reference" and before "Apps" under
        *Guides & References → Backend Development* (confirmed via `read_page` on the rendered nav, ref order
        `..., link "OAuth Reference", link "Quarkus Reference", link "Getting Started with Quarkus", ...`); all
        47 pages produced an `.html` file under `build/site/backend/quarkus/`; `getting-started.html`'s
        `[mermaid]` block renders as an actual inlined `<svg>` (`document.querySelectorAll('.mermaid svg').length
        === 1`, no literal ` ```mermaid ` fence text in the page); `architecture-and-build-time.html`'s
        `quarkus-build-time-phases.svg` loads (`complete: true`, non-zero natural width/height); the cheat-sheet
        PDF link on `cheat-sheet.html` resolves to `_attachments/quarkus-cheat-sheet.pdf` and returns HTTP 200;
        the Lunr `search-index.js` contains ~2152 occurrences of "quarkus". Note: this UI bundle has no dark/light
        theme toggle at all (no `prefers-color-scheme`/dark CSS in the bundle) — same as every other existing
        section — so "rendering in both themes" doesn't apply here; not a regression.
  - [x] Task 58.2. Walked issue #143's twelve acceptance criteria: page count is exactly 47 (44 topic pages incl.
        `java-or-kotlin.adoc` + `index.adoc` + `quarkus-vs-spring-boot.adoc` + `cheat-sheet.adoc`, `ls | wc -l`
        confirms); every topic page plus `quarkus-vs-spring-boot.adoc` carries its own `== References` section
        linking specific `https://quarkus.io/guides/<guide>` pages (verified programmatically — zero pages with
        only a bare guides-index link); `index.adoc`/`cheat-sheet.adoc` correctly have no `== References` section
        (Bibliography and cross-reference-list pages respectively, matching the SpringBoot/OAuth precedent);
        `javax.*` appears only in the two legitimate JDBC-API cases (`javax.sql.DataSource`/`XADataSource`, which
        never moved to `jakarta.*`) plus one explicit book-caveat mention in `index.adoc` — no framework-code
        leak; RESTEasy Classic/MicroProfile Metrics/OpenTracing/`@ConfigProperties`/Elytron-prefixed names each
        checked and appear only in explicit migration/legacy-flagging prose, never as the recommended approach;
        `quarkus-vs-spring-boot.adoc` (Group 11) carries the pros/cons lists, the concept-mapping table and the
        decision-guide table with no third-party benchmark figures cited; the Bibliography's two book caveats
        (Cookbook flagged Quarkus 1.4/`javax.*`-superseded, Quarkus in Action flagged one LTS behind) are present
        and neither book file exists anywhere in the repo (cited/linked only); all 13 `quarkus-*.svg` files are
        referenced from a page and are well-formed XML; the cheat-sheet PDF is one A4-landscape page (verified in
        Group 13) linked via `xref:attachment$quarkus-cheat-sheet.pdf[]`; and all reciprocal cross-links from
        Group 14 (Tasks 53-55) are in place and resolve with zero xref errors (Task 57).
  - [x] Task 58.3. Confirmed the non-duplication rule: spot-checked that Hibernate/JPA fundamentals, GraphQL
        language/schema design, OAuth/OIDC protocol theory, Kafka/MongoDB/Elasticsearch/Neo4j/Redis internals,
        Prometheus, and Java/Kotlin language fundamentals are each linked via `xref:` into their existing
        reference sections (`backend/hibernate/`, `backend/graphql/`, `backend/oauth/`, `database/*/`,
        `database/prometheus/`, `programming-languages/*`) rather than re-documented — consistent with every
        per-page "Current code state"/task note recorded throughout Groups 2-10 above, which already called out
        each such link as it was written; the zero-warning build (Task 57) confirms every one of those `xref:`
        targets actually resolves.
