# Implementation Plan: Guides & References / Backend Development — Architecture

## Task summary

Source: GitHub issue #154
Base branch: main

Issue [#154](https://github.com/albertoirurueta/docs/issues/154) asks for a new **Architecture** section under
*Guides & References → Backend Development*, a sibling of the existing Architectural Patterns (DDD) section,
authored directly into this repo's own `ROOT` Antora component (this repo has no application source code — it
*is* the Antora playbook + root component, per `CLAUDE.md`). Concretely:

1. **11 new concept AsciiDoc pages + a landing `index.adoc` + a `cheat-sheet.adoc`** (13 files total) under
   `modules/ROOT/pages/backend/architecture/`. The issue's own summary/acceptance-criteria bullets say "13
   concept pages" in three places, but its own detailed page outline lists exactly 11 named concept pages
   (`architectural-styles.adoc`, `benefits-and-drawbacks.adoc`, `choosing-monolith-or-microservices.adoc`,
   `layering-backend-and-frontend.adoc`, `api-gateway-and-bff.adoc`, `migration-overview.adoc`,
   `migration-path-legacy-to-modern-stack.adoc`, `migration-path-monolith-to-modular-monolith.adoc`,
   `migration-path-monolith-to-microservices.adoc`, `migration-path-to-multi-tenant-saas.adoc`,
   `starting-a-new-project.adoc`) plus `index.adoc` and `cheat-sheet.adoc` — 13 files in the directory, 11 of
   them "concept pages". This plan treats the detailed outline (unambiguous, with a description and required
   figures per page) as authoritative and reads "13" as counting the whole directory, not just concept pages; the
   discrepancy is cosmetic (a miscount in the issue's own summary text), not a scope question, so it is resolved
   here rather than asked about.
2. **One new partial**: `modules/ROOT/partials/architecture-disclaimer.adoc` — like
   `architectural-patterns-disclaimer.adoc`, contains **only** the house AI-assistance disclosure and the
   bibliography pointer, no other content.
3. **Site wiring**: an inline nav block in `modules/ROOT/nav.adoc` appended after the Architectural Patterns
   block, an "Architecture" bullet in `modules/ROOT/pages/backend/index.adoc`, and monolith/microservices/
   migration/gateway/SaaS terms added to the root `modules/ROOT/pages/index.adoc` `:keywords:`.
4. **Reciprocal cross-links** added to `backend/architectural-patterns/index.adoc` (intro paragraph + its
   `== Bibliography`), `backend/springboot/architectural-patterns.adoc` (its "Where this section stops"
   paragraph), `web/aspnet/web-forms/migrating-to-modern-aspnet.adoc`, `web/aspnet/core/architecture-and-patterns.adoc`,
   `backend/oauth/browser-based-apps.adoc`, `database/choosing-the-right-database.adoc`, and
   `backend/graphql/when-to-use-graphql-or-rest.adoc`.
5. **One new cheat-sheet PDF**: `modules/ROOT/attachments/architecture-cheat-sheet.pdf`, exactly one A4 page,
   rendered from a print-ready HTML/CSS layout via headless Chrome, visually consistent with
   `architectural-patterns-cheat-sheet.pdf` / `messaging-cheat-sheet.pdf`.
6. Figures live under `modules/ROOT/images/` named `architecture-*.svg` (matching the `architectural-patterns-*.svg`
   convention), and every `[mermaid]` block must pass `npm run validate:mermaid` before the final build task.

The full page outline, book sources (Richardson's *Microservices Patterns*, chapters 1/2/8/12/13; Golding's
*Building Multi-Tenant SaaS Architectures*, chapters 2/3/13/17), the ~90-URL online-source list grouped by
category, the cheat-sheet content, the cross-link list, and the bibliography-extension instructions are already
fully specified in the issue body (fetch it with `gh issue view 154 --json body -q .body` from within an
isolated execution context that doesn't already have it, since it is long — ~630 lines — and this plan quotes
only the passages needed to make each task actionable rather than reproducing it in full). This plan does not
re-derive any of that; it sequences page creation into buildable, reviewable groups and adds the one thing the
issue leaves implicit: **a single canonical running example every page's Bookshop material must share**, so the
five migration/decision pages (and the layering/gateway pages) stay mutually consistent (see "Running example
reference" below).

Nothing in the issue is ambiguous enough to need a user decision beyond the "13 vs. 11" cosmetic count resolved
above: it already names every file, every page's required content and figures, the disclaimer's reduced content,
the cheat-sheet content, and the acceptance criteria. One thing is decided here, on the user's behalf, per this
skill's Step 4 (stated so it can be challenged during review): the **canonical Bookshop domain model's concrete
shape** (legacy stack, module/service names, the `Order` god class, the extraction order, the layering example's
three deployables) — the issue names the *examples that must appear* (a `recommendations` service born as a
service, `Order → Customer → Catalogue/Inventory → Payment` as the extraction sequence, "one Spring Boot API, one
React web app, one Android app") but not the full connective tissue between them; this plan fills that in once,
consistently, so every page's code/diagrams refer to the same thing.

No task below carries a language/framework tag: this repository has no installed `*-code-one-task` skill for
AsciiDoc/Antora documentation (only `iru-java-code-one-task`, `iru-java-springboot-code-one-task`,
`iru-dotnet-code-one-task` and `iru-database-code-one-task` are installed — confirmed via
`find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"`), matching every prior plan in `.archive/` for
this repository (e.g. `implementation_plan_152.md`). Every task here is a direct AsciiDoc/Antora documentation
edit.

## Running example reference

Every migration/decision page, the layering page, and the gateway page use one fictional bookstore, **Bookshop**,
in three incarnations:

- **Legacy incarnation** (the *starting point* in `migration-path-legacy-to-modern-stack.adoc` only): a Java EE 7
  + Struts 1 + JSP monolith (`bookshop-web.war`) on WebLogic, stored procedures for pricing/tax, an XML/SOAP
  integration with a supplier catalogue feed, jQuery-sprinkled server-rendered pages, a monolithic Oracle schema.
- **Modernized monolith** (the incarnation used from `architectural-styles.adoc` through
  `migration-path-monolith-to-microservices.adoc`, and as the "healthy monolith"/"modular monolith" example in
  `choosing-monolith-or-microservices.adoc` and `benefits-and-drawbacks.adoc`): a single Spring Boot 4.1
  application (`bookshop`), one PostgreSQL database, a Thymeleaf server-rendered UI initially. Five business
  capabilities, later candidate module/service boundaries: **Catalogue** (books, authors, search — read-heavy,
  memory-hungry), **Orders** (cart, checkout; its `Order` class is the god class bundling order lines + payment
  status + shipping status + a denormalized customer snapshot — the same role as Richardson's FTGO `Order`),
  **Payments** (charge authorization — CPU-light but must be highly reliable), **Shipping** (fulfillment status —
  bursty load, integrates with third-party carriers), **Customers** (accounts, addresses, authentication). The
  `Order` god class's `restaurantId`-style split is `Order` losing its embedded shipping fields to a new
  `Shipment` entity referenced by id — the running "splitting the domain model" example.
- **Extraction order** used throughout `migration-path-monolith-to-microservices.adoc`, exactly as the issue's
  own outline names it: **Orders → Customers → Catalogue/Inventory → Payments**. Each step's resulting saga is
  shown (mirroring Richardson's Order→Consumer→Kitchen→Accounting sequencing argument, so that the monolith's own
  remaining transaction stays a pivot or retriable transaction at every step, never a compensatable one).
- **First new-feature-as-a-service example** (Richardson strategy 1, "stop digging"): a **Recommendations**
  service, born outside the monolith from day one — explicitly named in the issue's own outline.
- **Layering example** (`layering-backend-and-frontend.adoc`): exactly the issue's own phrase — "one Spring Boot
  API, one React web app, one Android app" — `bookshop-api` (REST behind a gateway), `bookshop-web` (React SPA),
  `bookshop-android` (Kotlin/Android app), all three consuming the same API.
- **SaaS incarnation** (`migration-path-to-multi-tenant-saas.adoc`): "Bookshop-as-a-SaaS" — the same product
  offered to multiple independent bookstore-chain tenants, used for the control-plane/application-plane and
  silo/pool material.

Every page below that uses Bookshop must stay consistent with this reference rather than inventing new names,
capabilities, or a different extraction order.

## Current code state

This repository is the Antora playbook + `ROOT` component for https://albertoirurueta.github.io/docs. Relevant
existing structure, confirmed during exploration:

- `modules/ROOT/nav.adoc` — *Guides & References → Backend Development* currently ends its architecture-adjacent
  content with the Architectural Patterns block, whose last line is
  `**** xref:backend/architectural-patterns/cheat-sheet.adoc[Cheat Sheet (PDF)]`, immediately followed by
  `** xref:apps/index.adoc[Apps]` (the next top-level Guides & References section). The new Architecture block
  goes between those two lines.
- `modules/ROOT/pages/backend/index.adoc` — `== Sections` ends with the Architectural Patterns bullet:
  `* xref:backend/architectural-patterns/index.adoc[Architectural Patterns] -- domain-driven design applied to
  microservices: ... plus a downloadable cheat sheet.` The new Architecture bullet is appended right after it.
  Its `:description:` and `:keywords:` lines (both currently long single lines) need the new section's terms
  appended.
- `modules/ROOT/pages/index.adoc` — root landing page; its `:keywords:` line (line 3) currently ends
  `... domain-driven design, DDD, microservices, saga, transactional outbox, CQRS, event sourcing, aggregate`
  (added by issue #152). This plan appends `, monolith, modular monolith, strangler fig, migration, API gateway,
  backends for frontends, SaaS, multi-tenant` to that same line.
- `modules/ROOT/partials/architectural-patterns-disclaimer.adoc` — the exact template for the new
  `architecture-disclaimer.adoc`: a bare `[IMPORTANT]`/`====` block containing the AI-assistance sentence plus a
  `xref:....adoc#_bibliography[...]` pointer, nothing else. Full text:
  ```
  [IMPORTANT]
  ====
  This content was generated with the assistance of AI and should be verified against the official documentation
  before being relied on in production; see xref:backend/architectural-patterns/index.adoc#_bibliography[the section
  bibliography] for the reference material consulted while preparing these pages.
  ====
  ```
- `modules/ROOT/pages/backend/architectural-patterns/index.adoc` — its intro paragraph (right after the
  disclaimer include) is the target for a new "see also" sentence pointing at the new section; its
  `[[_bibliography]] == Bibliography` section's *Consulted reference books* group already lists Richardson's
  *Microservices Patterns* (Manning) with a note on which chapters it sources — that note needs extending, and
  Golding's book needs adding alongside it.
- `modules/ROOT/pages/backend/springboot/architectural-patterns.adoc` — its `== Where this section stops` section
  (near the end, just before `== References`) currently reads:
  ```
  This page is deliberately introductory -- SOLID, hexagonal architecture, DDD, the outbox, listen-to-yourself,
  and sagas each easily fill a book on their own. The dedicated
  xref:backend/architectural-patterns/index.adoc[Architectural Patterns section] under Backend Development now
  provides that deeper treatment, with worked examples of each pattern end to end.
  ```
  This plan adds one more sentence pointing at the new Architecture section for migration and layering.
- `modules/ROOT/pages/web/aspnet/web-forms/migrating-to-modern-aspnet.adoc` — already documents a concrete,
  .NET-specific strangler-fig migration (`== The incremental migration path: System.Web.Adapters + YARP`,
  starting around line 23) with its own Mermaid flowchart. One sentence pointing at the new,
  technology-neutral `migration-path-legacy-to-modern-stack.adoc` is added near that heading.
- `modules/ROOT/pages/web/aspnet/core/architecture-and-patterns.adoc` — its `== Vertical slices and larger
  structure` section has a "**Modular monolith vs. microservices**" bullet (around line 119) that already
  mentions BFF; this plan adds a link from that bullet to the new
  `migration-path-monolith-to-modular-monolith.adoc`.
- `modules/ROOT/pages/backend/oauth/browser-based-apps.adoc` — its `== The recommended pattern:
  backend-for-frontend (BFF)` heading (around line 46) is the target for one sentence pointing at
  `api-gateway-and-bff.adoc` as the architectural (not only security) treatment of BFF.
- `modules/ROOT/pages/database/choosing-the-right-database.adoc` — no existing "Related pages"/"See also"
  section; the natural insertion point is the end of its `== Start With the Questions That Actually Decide It`
  intro section (around line 15-33, right after "... see <<Keeping Several Databases Consistent -- CQRS>>."),
  where one more sentence points at `starting-a-new-project.adoc`.
- `modules/ROOT/pages/backend/graphql/when-to-use-graphql-or-rest.adoc` — has an explicit `== Related pages`
  bullet list (starting line 304) of `xref:` entries with one-line descriptions; this plan appends one more
  bullet there pointing at `starting-a-new-project.adoc`.
- `modules/ROOT/attachments/architectural-patterns-cheat-sheet.pdf`, `messaging-cheat-sheet.pdf` — the visual
  precedent for the new cheat sheet: A4 portrait, one page, multi-column colour-coded boxes, header line, italic
  breadcrumb footer. `.archive/implementation_plan_152.md` (Group 10) records the exact reverse-engineering
  technique used to match this style with no surviving HTML/CSS source: inspect the existing PDF directly with
  PyMuPDF (`fitz`) — page size, column layout, palette RGB values, fonts, border/header treatment — then build a
  fresh print-ready HTML/CSS layout, render with headless Chrome, and verify page count/size with PyMuPDF again.
  The same approach applies here, using `architectural-patterns-cheat-sheet.pdf` as the closest-in-spirit
  reference (it is the most recent Backend Development cheat sheet and covers a conceptually similar "pattern
  reference" topic, unlike the more mechanical/tabular Messaging one).
- `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` — validates every `[mermaid]` block in the repo;
  runs in CI and must pass before this plan's final task.
- Locally available tooling (confirmed during exploration): headless Chrome
  (`/Applications/Google Chrome.app` present) and PyMuPDF (`python3 -c "import fitz"` succeeds) for producing and
  verifying the cheat-sheet PDF, matching the precedent's tooling exactly.
- `.archive/implementation_plan_152.md` (Architectural Patterns section, issue #152) is the direct structural
  precedent for this plan: disclaimer group first, content pages grouped 1-2 per group in outline order, landing
  + cheat-sheet page last among content, a dedicated cheat-sheet-PDF group, a non-parallel site-wiring group, a
  parallel cross-links group, and a final Mermaid-validation + build-verify group. This plan follows the same
  shape, scaled to 11 concept pages instead of 15.
- No documentation MCP (Confluence/Notion/etc.) is connected in this session/environment — nothing to draw on
  beyond the issue itself and the existing repository pages.

## Implementation steps

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/architecture-disclaimer.adoc` — created, identical to
      `architectural-patterns-disclaimer.adoc` except the xref target. Tests/coverage/code-quality/license-header:
      n/a (docs-only repo, no such tooling applies).
  - [x] Task 1.1. Write a single `[IMPORTANT]`/`====` block containing **only**: (a) the standard AI-assistance
        disclosure sentence ("This content was generated with the assistance of AI and should be verified
        against the official documentation before being relied on in production."); (b) a pointer to
        `xref:backend/architecture/index.adoc#_bibliography[the section bibliography]`. No version-baseline
        sentence, no book title, no evaluation paragraph — matching `architectural-patterns-disclaimer.adoc`'s
        template exactly (quoted in full in "Current code state" above).
  - [x] Task 1.2. Keep the two sentences readable as one short paragraph inside the admonition.

### Group 2 — Architectural styles, benefits and drawbacks (Parallelizable: yes)

- [x] Task 2. Create `modules/ROOT/pages/backend/architecture/architectural-styles.adoc` — "Architectural
      Styles: Monolith, Modular Monolith, Microservices" — created (194 lines) with
      `modules/ROOT/images/architecture-scale-cube.svg` and one `[mermaid]` three-column flowchart. Note: Task
      2.7's `how-modular-can-your-microservices-go-part-1.html` URL does not exist in the issue's verified Online
      Sources list; substituted the URL that actually is listed there,
      https://microservices.io/post/architecture/2023/07/31/how-modular-can-your-monolith-go-part-1.html (same
      microservices.io "How Modular Can Your Monolith Go? Part 1" article, evidently a typo in the plan text).
      Tests/coverage/code-quality/license-header: n/a (docs-only repo).
  - [x] Task 2.1. `= Architectural Styles: Monolith, Modular Monolith, Microservices`, `:description:`,
        `:keywords:`, `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 2.2. Software architecture as decisions about quality attributes (maintainability, testability,
        scalability), not functional requirements (Richardson ch. 1.4); an architectural style constrains the
        *implementation view*: the monolith as one deployable/executable, microservices as many loosely coupled
        independently deployable services (Richardson ch. 2.1.3).
  - [x] Task 2.3. The **modular monolith** as one deployable with enforced module boundaries (Spring Modulith,
        Java modules/packages, .NET projects) — introduced explicitly as the middle ground the rest of the
        section keeps returning to.
  - [x] Task 2.4. Layered (three-tier) vs. **hexagonal** logical views, and why hexagonal is the natural shape of
        each service/module — one paragraph, linking
        `xref:backend/springboot/architectural-patterns.adoc[]` and
        `xref:backend/architectural-patterns/structuring-the-code.adoc[]` rather than re-explaining ports and
        adapters.
  - [x] Task 2.5. The **scale cube** (X-axis cloning, Y-axis functional decomposition, Z-axis partitioning,
        Richardson ch. 1.4.1) as the vocabulary for "scaling"; microservices vs. SOA (Richardson's comparison
        table: smart pipes/ESB vs. dumb pipes, global vs. per-service data model, larger vs. smaller services);
        the **distributed monolith** anti-pattern (coupled services that must deploy together).
  - [x] Task 2.6. Figures: SVG `architecture-scale-cube.svg` (X/Y/Z axes, using the Bookshop `Order`/`Catalogue`
        services as the concrete example); `[mermaid]` three-column figure of the same Bookshop as monolith /
        modular monolith / microservices (validated via `npm run validate:mermaid`).
  - [x] Task 2.7. `== References` linking https://martinfowler.com/bliki/MicroservicePremium.html,
        https://microservices.io/patterns/monolithic.html, https://microservices.io/patterns/microservices.html,
        https://microservices.io/post/architecture/2023/07/31/how-modular-can-your-microservices-go-part-1.html
        (verify the exact reachable URL from the issue's Online Sources list before use —
        `gh issue view 154 --json body -q .body`), and https://alistair.cockburn.us/hexagonal-architecture/.

- [x] Task 3. Create `modules/ROOT/pages/backend/architecture/benefits-and-drawbacks.adoc` — "Benefits and
      Drawbacks of Microservices" — created (188 lines) with `modules/ROOT/images/architecture-monolithic-hell.svg`
      and a side-by-side comparison table. All xref targets (why-not-distributed-transactions.adoc, sagas.adoc,
      cqrs.adoc, metrics-and-observability.adoc, oauth/flows-overview.adoc, distributed-id-generation.adoc)
      verified to exist; `api-gateway-and-bff.adoc` is an intentional forward reference (built by Group 4) per
      the shared context. Tests/coverage/code-quality/license-header: n/a (docs-only repo).
  - [x] Task 3.1. `= Benefits and Drawbacks of Microservices`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 3.2. The benefits of the monolithic architecture while an application is small: simple to develop,
        easy radical changes, straightforward testing/deployment, easy X-axis scaling (Richardson ch. 1.1.2).
  - [x] Task 3.3. **Monolithic hell** as the Bookshop grows: complexity intimidates developers, a slow
        edit-build-run-test loop, a long commit-to-deploy path with manual testing and monthly releases,
        conflicting resource requirements (Catalogue's memory-hungry search index vs. Payments' CPU-light but
        latency-sensitive calls) make scaling hard, no fault isolation, locked into an obsolete stack
        (Richardson ch. 1.1.3).
  - [x] Task 3.4. **Benefits of microservices**, each with the Bookshop example: continuous delivery/deployment;
        small, easily maintained services; independent deployability; **independent scalability** (Catalogue
        search scaled for CPU vs. Payments scaled for reliability); autonomous "two-pizza" teams owning a service
        end to end; easy experimentation with new technologies (e.g. trying Kotlin for Recommendations without
        risking the whole system); fault isolation.
  - [x] Task 3.5. **Inconveniences**: finding the right set of services is hard, and getting it wrong produces a
        distributed monolith; distributed-system complexity (IPC instead of method calls, partial failure,
        latency, retries, circuit breakers); **loss of ACID transactionality** — sagas, eventual consistency, no
        cross-service joins (API composition/CQRS) — linking
        `xref:backend/architectural-patterns/why-not-distributed-transactions.adoc[]`,
        `xref:backend/architectural-patterns/sagas.adoc[]` and `xref:backend/architectural-patterns/cqrs.adoc[]`
        for the mechanics rather than re-explaining them; **higher complexity and much more code/infrastructure
        to maintain** — one linked bullet each for the service chassis, observability
        (`xref:backend/springboot/metrics-and-observability.adoc[]`), service discovery/gateways (forward
        reference to `api-gateway-and-bff.adoc`), per-service pipelines, contract tests, security tokens
        (`xref:backend/oauth/flows-overview.adoc[]`), distributed IDs
        (`xref:backend/springboot/distributed-id-generation.adoc[]`); coordinated cross-service feature rollouts;
        a higher operational/skills bar; deciding when to adopt is itself hard.
  - [x] Task 3.6. Figures: a side-by-side comparison table (monolith vs. microservices, one row per benefit/
        drawback); SVG `architecture-monolithic-hell.svg` (the downward spiral: growth → complexity → slower
        delivery → more pressure, using the Bookshop as the labelled example).
  - [x] Task 3.7. `== References` linking https://martinfowler.com/articles/microservice-trade-offs.html,
        https://microservices.io/patterns/microservices.html, and
        https://cloud.google.com/architecture/microservices-architecture-introduction.

### Group 3 — Choosing an architecture, and layering (Parallelizable: yes)

- [x] Task 4. Create `modules/ROOT/pages/backend/architecture/choosing-monolith-or-microservices.adoc` —
      "Choosing: Monolith or Microservices?" — page created, ~230 lines, 1 `[mermaid]` block, 2 tables.
  - [x] Task 4.1. `= Choosing: Monolith or Microservices?`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 4.2. Plain-language decision guide, "choose a monolith (modular from day one) when": small projects,
        small teams (one team around a table), one-shot deliveries/prototypes, applications that will not need
        to evolve much, startups still searching for their business model (quote/cite Richardson's "a startup
        should almost certainly begin with a monolithic application", ch. 1.5.2, and Fowler's MonolithFirst),
        strict transactional domains, missing operational prerequisites (an automated deployment pipeline,
        monitoring, rapid provisioning — Fowler's MicroservicePrerequisites).
  - [x] Task 4.3. "Choose microservices when": large, complex, long-lived systems developed by several autonomous
        teams; **performance and scale** reasons when components have very different resource/scaling profiles
        (Bookshop's Catalogue vs. Payments again); fault isolation or independent release cadence is a business
        requirement; parts of the system need a different technology stack; consumer-facing or SaaS products at
        scale.
  - [x] Task 4.4. "Is it really the architecture?" check: slow delivery and buggy releases are often a **process**
        problem (manual testing, no CI/CD) — fix that first before blaming the architecture (Richardson 13.1.1).
  - [x] Task 4.5. Signals it is time to split (the monolithic-hell symptoms from `benefits-and-drawbacks.adoc` as
        a checklist, cross-linked) and signals it is time to **merge back** — the Prime Video audio/video
        monitoring case study (chatty services and per-call infrastructure cost), cited and linked.
  - [x] Task 4.6. Figures: `[mermaid]` decision flowchart (project profile → monolith or microservices); table
        "project profile → recommended style", explicitly noted as the seed that `starting-a-new-project.adoc`
        later expands into full scenario cards.
  - [x] Task 4.7. `== References` linking https://martinfowler.com/bliki/MonolithFirst.html,
        https://martinfowler.com/bliki/MicroservicePrerequisites.html,
        https://www.primevideotech.com/video-streaming/scaling-up-the-prime-video-audio-video-monitoring-service-and-reducing-costs-by-90,
        and https://thenewstack.io/return-of-the-monolith-amazon-dumps-microservices-for-video-monitoring/.

- [x] Task 5. Create `modules/ROOT/pages/backend/architecture/layering-backend-and-frontend.adoc` — "Layering:
      Isolating Backend and Frontend" — page created, ~200 lines, plus new SVG `architecture-layered-target.svg`;
      1 `[mermaid]` block, 1 table.
  - [x] Task 5.1. `= Layering: Isolating Backend and Frontend`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 5.2. From a classic monolith that renders HTML pages to a **backend that exposes only an API** (REST
        by default; GraphQL/gRPC per `xref:backend/graphql/when-to-use-graphql-or-rest.adoc[]`) **behind a
        gateway**, consumed by completely **separate web frontends** (React/Angular/Vue, each linked to its own
        reference page under `web/`) and by **native mobile apps** (Android/Kotlin, iOS/Swift, or cross-platform)
        using the very same API. iOS/Swift linked to `xref:programming-languages/swift/index.adoc[]` (closest
        existing page; no dedicated iOS app page exists under `apps/`); cross-platform frameworks named
        (Flutter, .NET MAUI) with no link, since no page exists for them either.
  - [x] Task 5.3. Why this separation matters: independent iteration/A/B-testing/release for the frontend team,
        several UIs sharing one backend, native apps and partner integrations become possible without touching
        the backend.
  - [x] Task 5.4. What it costs: CORS (`xref:web/cors.adoc[]`), two deployables, API versioning, contract-first
        with OpenAPI (`xref:backend/springboot/api-first-rest-and-grpc.adoc[]`), SEO/SSR, authentication via the
        **BFF** (`xref:backend/oauth/browser-based-apps.adoc[]`).
  - [x] Task 5.5. When **server-rendered UIs** (Thymeleaf, Vaadin, Blazor Server, JSF) are still the right,
        simpler choice: internal tools, small teams, content sites, one-shot projects — linking
        `xref:backend/springboot/web-ui-frameworks.adoc[]` and `xref:web/vaadin/index.adoc[]`. Server-side
        rendering frameworks (Next.js/Nuxt/Angular SSR) named as the hybrid. **Micro-frontends** named in one
        paragraph with links (https://martinfowler.com/articles/micro-frontends.html,
        https://webpack.js.org/concepts/module-federation/), not documented further — matching the issue's
        explicit "out of scope" instruction.
  - [x] Task 5.6. The Bookshop example per "Running example reference": `bookshop-api` (Spring Boot, REST),
        `bookshop-web` (React SPA), `bookshop-android` (Kotlin/Android) — one paragraph tying the three together.
  - [x] Task 5.7. Figures: SVG `architecture-layered-target.svg` (browser SPA + native apps → gateway/BFF → API →
        services/database); `[mermaid]` sequence diagram of one "place order" request crossing every layer for
        `bookshop-web`; table "UI approach → when to use" (server-rendered / SPA / SSR hybrid / native app).
  - [x] Task 5.8. `== References` linking https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/choose-between-traditional-web-and-single-page-apps,
        https://learn.microsoft.com/en-us/aspnet/core/blazor/hosting-models, and
        https://samnewman.io/patterns/architectural/bff/.

### Group 4 — API gateway/BFF, and the migration overview (Parallelizable: yes)

- [x] Task 6. Create `modules/ROOT/pages/backend/architecture/api-gateway-and-bff.adoc` — "API Gateway and
      Backends for Frontends" — page created, 189 lines, 1 `[mermaid]` block (gateway vs. BFF topologies) plus a
      ~20-line Spring Cloud Gateway YAML route example. Tests/coverage/code-quality/license-header: n/a
      (docs-only repo).
  - [x] Task 6.1. `= API Gateway and Backends for Frontends`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 6.2. Why clients should not call services directly: many round-trips, no encapsulation, unsuitable
        protocols for external clients (Richardson ch. 8.1).
  - [x] Task 6.3. The **API gateway** as the single entry point: request routing, API composition, edge functions
        (authentication, rate limiting, TLS, logging), protocol translation; its benefits (encapsulation, fewer
        round-trips) and drawbacks (one more highly-available component, risk of becoming a development
        bottleneck) — Richardson ch. 8.2.
  - [x] Task 6.4. The **backends-for-frontends** variant: one gateway per client type, owned by the client team;
        the Netflix story (Groovy scripts → NodeJS API modules + Falcor); when one shared gateway is enough
        instead.
  - [x] Task 6.5. Implementation options with links: off-the-shelf (AWS API Gateway, Kong, Traefik, Envoy /
        Kubernetes Gateway API, NGINX) vs. building your own (Spring Cloud Gateway, YARP); GraphQL as a gateway,
        linking `xref:backend/graphql/federation.adoc[]` and
        `xref:backend/graphql/when-to-use-graphql-or-rest.adoc[]`; the gateway during a migration as the
        **strangler's routing seam** — a forward pointer to `migration-path-legacy-to-modern-stack.adoc`.
  - [x] Task 6.6. Figures: `[mermaid]` figure of gateway vs. BFF topologies (one shared gateway vs. per-client
        gateways); a ~20-line Spring Cloud Gateway route-config example routing `/api/orders/**` to an extracted
        `bookshop-orders` service and everything else to the `bookshop` monolith (using the Bookshop extraction
        example, forward-consistent with `migration-path-monolith-to-microservices.adoc`).
  - [x] Task 6.7. `== References` linking https://microservices.io/patterns/apigateway.html,
        https://docs.spring.io/spring-cloud-gateway/reference/,
        https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/yarp/yarp-overview,
        https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-routing, and
        https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-aggregation.

- [x] Task 7. Create `modules/ROOT/pages/backend/architecture/migration-overview.adoc` — "Migration Overview: How
      to Approach Any Migration" — page created, 192 lines, 2 `[mermaid]` blocks (fish-model `xychart-beta`, "which
      migration path" flowchart) plus SVG `architecture-strangler-over-time.svg`. xrefs to the four migration-path
      pages and to `index.adoc` are intentional forward references (built by later groups) per the shared context.
      Tests/coverage/code-quality/license-header: n/a (docs-only repo).
  - [x] Task 7.1. `= Migration Overview: How to Approach Any Migration`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 7.2. The **balancing act** between business motivators (competition, operational cost, new markets,
        customer demand) and technical desires (erase technical debt, adopt a shiny new stack) — the strategy
        must be driven by the business, not chosen in a technical vacuum (Golding ch. 13, "The Migration
        Balancing Act").
  - [x] Task 7.3. **Timing**: "modernize first" vs. "deliver now, modernize incrementally", and why early
        customer feedback usually tips the balance toward the latter (Golding, "Timing Considerations"); the
        **fish model** of costs (rising, then falling) and revenue (dipping, then spiking) during a
        transformation (Golding, "What Kind of Fish Are You?").
  - [x] Task 7.4. **No big bang rewrite** — quote/cite "the only thing a Big Bang rewrite guarantees is a Big
        Bang" (Richardson 13.1.2, attributed to Martin Fowler); the **strangler fig** (Fowler's
        StranglerFigApplication) as the universal shape of every migration path in this section.
  - [x] Task 7.5. **Demonstrate value early and often**; **minimize changes to the legacy system**; **don't build
        the deployment infrastructure up front** — an automated deployment pipeline with automated tests is the
        only thing you truly can't live without (Richardson 13.1.2); a **time-boxed target-architecture
        definition** (a couple of weeks) as the destination to aim for, revised as you learn.
  - [x] Task 7.6. The five **pitfalls** every later path warns about: big bang, distributed monolith, shared
        database, premature infrastructure investment, forgetting the organisation/process side (one sentence
        each, per the issue's "out of scope" note that process transformation itself is not documented here).
  - [x] Task 7.7. Closing **"where are you? → which page"** table mapping the reader's situation to the four
        migration-path pages: legacy-stack monolith → `migration-path-legacy-to-modern-stack.adoc`; healthy
        monolith that has outgrown itself / modular monolith → `migration-path-monolith-to-modular-monolith.adoc`;
        partially extracted or ready to extract further → `migration-path-monolith-to-microservices.adoc`;
        single-tenant installs moving to SaaS → `migration-path-to-multi-tenant-saas.adoc`.
  - [x] Task 7.8. Figures: SVG `architecture-strangler-over-time.svg` (the monolith shrinking while the strangler
        application grows, per Richardson fig. 13.1, redrawn generically — not FTGO); `[mermaid]` figure of the
        fish model (costs rising then falling, revenue dipping then spiking); `[mermaid]` flowchart "which
        migration path" mirroring the closing table.
  - [x] Task 7.9. `== References` linking https://martinfowler.com/bliki/StranglerFigApplication.html,
        https://microservices.io/patterns/refactoring/strangler-application.html,
        https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/saas-architecture-fundamentals.html,
        and https://martinfowler.com/bliki/SacrificialArchitecture.html.

### Group 5 — Legacy-stack and modular-monolith migration paths (Parallelizable: yes)

- [x] Task 8. Create `modules/ROOT/pages/backend/architecture/migration-path-legacy-to-modern-stack.adoc` —
      "Migration Path: From a Legacy Stack to a Modern One" — page written (289 lines), 1 `[mermaid]` block, SVG
      `architecture-presentation-backend-split.svg` created; all xref targets verified to exist except the
      intentional forward link to `migration-path-monolith-to-microservices.adoc` (not yet written, per plan).
  - [x] Task 8.1. `= Migration Path: From a Legacy Stack to a Modern One`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 8.2. Table of typical starting points and modern targets, each cell linking the existing reference
        page: Java EE/Struts/JSP/Spring 3-4 XML → `xref:backend/springboot/index.adoc[]` or
        `xref:backend/quarkus/index.adoc[]`; .NET Framework Web Forms/MVC 5 →
        `xref:web/aspnet/core/index.adoc[]` (linking the existing
        `xref:web/aspnet/web-forms/migrating-to-modern-aspnet.adoc[]` migration page); jQuery/server-templated UI
        → `xref:web/react/index.adoc[]` / `xref:web/angular/index.adoc[]` / `xref:web/vue/index.adoc[]`;
        SOAP/ESB → REST/gRPC + messaging (`xref:backend/messaging/index.adoc[]`); stored-procedure business logic
        → an application-layer domain model; legacy ORM/JDBC → `xref:backend/hibernate/index.adoc[]`; ad-hoc
        deployment → containers and a pipeline.
  - [x] Task 8.3. Techniques, each explained with the legacy-incarnation Bookshop example from "Running example
        reference": the **strangler fig with a reverse proxy/gateway** in front of the legacy app (route by
        path/header/user cohort; YARP, NGINX, Spring Cloud Gateway — cross-linking `api-gateway-and-bff.adoc`);
        **separate the presentation tier from the backend first** (Richardson's second strategy, ch. 13.2.2:
        expose the business logic as an API, then rebuild the UI as a SPA against it — explicitly the seam
        `migration-path-monolith-to-microservices.adoc` reuses); **branch by abstraction** and **parallel run**
        (Fowler/ThoughtWorks legacy-displacement patterns); the **anti-corruption layer** between old and new
        models (Richardson ch. 13.3.1); **data synchronisation** during the overlap (dual writes vs. CDC with
        Debezium, linking `xref:backend/messaging/kafka-connect.adoc[]`); **incremental framework upgrades** when
        the stack is upgradable (Spring's backward compatibility) vs. strangling when it is not; feature flags
        and cohort-based cut-over; the **exit criteria** for decommissioning the legacy system.
  - [x] Task 8.4. Figures: `[mermaid]` flowchart of the strangler routing (proxy → legacy `bookshop-web.war` vs.
        new `bookshop`); SVG `architecture-presentation-backend-split.svg` (monolith with embedded UI → API
        backend + separate SPA); a step-by-step "week 0 → week N" table for the Bookshop UI migration.
  - [x] Task 8.5. `== References` linking https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig,
        https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/strangler-fig.html,
        https://martinfowler.com/articles/patterns-legacy-displacement/,
        https://learn.microsoft.com/en-us/azure/architecture/patterns/anti-corruption-layer, and
        https://debezium.io/documentation/reference/stable/.

- [x] Task 9. Create `modules/ROOT/pages/backend/architecture/migration-path-monolith-to-modular-monolith.adoc` —
      "Migration Path: From a Monolith to a Modular Monolith" — page written (~250 lines), 1 `[mermaid]` block, no
      new SVG required by this task (none listed); all xref targets verified to exist except the intentional
      forward link to `migration-path-monolith-to-microservices.adoc` (not yet written, per plan).
  - [x] Task 9.1. `= Migration Path: From a Monolith to a Modular Monolith`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 9.2. Frame it as the safest first step of any microservices migration and, for many teams, the final
        destination. Identify modules by business capability/subdomain, linking
        `xref:backend/architectural-patterns/strategic-design.adoc[]`; draw the **target module map** for the
        Bookshop (Catalogue, Orders, Payments, Shipping, Customers).
  - [x] Task 9.3. Enforce boundaries: packages + **Spring Modulith** `@ApplicationModule` and its verification
        tests; ArchUnit; .NET projects as the equivalent. Replace cross-module object references and shared
        tables with **module APIs and in-process domain events** (Spring Modulith events — an outbox living in a
        single database), linking `xref:backend/architectural-patterns/transactional-outbox.adoc[]`. Give each
        module its own schema or table prefix so the database can later be split. Kill **god classes** (the
        Bookshop `Order`) by splitting them per module. Measure coupling.
  - [x] Task 9.4. Why this already buys most of the maintainability benefit at none of the distributed cost; the
        **signal to go further**: a module needs its own release cadence, scaling profile, team, or stack —
        forward link to `migration-path-monolith-to-microservices.adoc`.
  - [x] Task 9.5. Figures: `[mermaid]` module-dependency graph of the Bookshop before/after modularisation; a
        ~25-line Spring Modulith module + event example (an `orders` module publishing an `OrderPlaced` event
        consumed by `shipping`); table "monolith → modular monolith → microservices: what you gain at each
        step".
  - [x] Task 9.6. `== References` linking https://docs.spring.io/spring-modulith/reference/,
        https://docs.spring.io/spring-modulith/reference/fundamentals.html,
        https://docs.spring.io/spring-modulith/reference/verification.html,
        https://microservices.io/patterns/decomposition/decompose-by-business-capability.html, and
        https://www.thoughtworks.com/insights/blog/microservices/modular-monolith-better-way-build-software.

### Group 6 — The centrepiece: monolith to microservices (Parallelizable: yes — single task)

- [x] Task 10. Create `modules/ROOT/pages/backend/architecture/migration-path-monolith-to-microservices.adoc` —
      "Migration Path: From a Monolith to Microservices"
  - [x] Task 10.1. `= Migration Path: From a Monolith to Microservices`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`. State up front this is the centrepiece of the section,
        written step-by-step with the Bookshop example throughout.
  - [x] Task 10.2. Richardson's **three strategies** (ch. 13.2): (1) **implement new features as services** —
        "stop digging"; the Bookshop's new **Recommendations** feature born as a service from day one; when a
        feature is too small or too coupled to be its own service. (2) **separate presentation tier and
        backend** — link back to `migration-path-legacy-to-modern-stack.adoc` rather than re-explaining. (3)
        **extract business capabilities into services** — the vertical slice (inbound adapters, domain logic,
        outbound adapters, its own schema).
  - [x] Task 10.3. **Splitting the domain model**: object references → ids; extracting `Shipment` out of the
        Bookshop's `Order` god class (per "Running example reference"), the concrete before/after. **Refactoring
        the database**: split table, move table (citing Ambler & Sadalage's *Refactoring Databases* by name, no
        link needed beyond the bibliography entry). **Replicating data back to the monolith** to avoid widespread
        changes (Richardson ch. 13.2.3, the read-only replicated-fields technique). **What to extract first**:
        rank by accelerates development / solves a performance-scaling-reliability problem / unblocks other
        extractions; "freeze the monolith and extract on demand" vs. a planned, ranked backlog.
  - [x] Task 10.4. **Designing how the service and the monolith collaborate**: the integration glue
        (repository-style interface for queries, e.g. `CatalogueEntryRepository`; service-style interface for
        commands, e.g. `PaymentsService`); querying the monolith via REST vs. keeping a **replica fed by
        domain events**; updates via **transactional messaging**; the **anti-corruption layer** in both
        directions (link back to `migration-path-legacy-to-modern-stack.adoc`'s ACL section rather than
        repeating it); **how the monolith publishes domain events** — inserting publish calls at each write site
        vs. transaction-log tailing/CDC when the monolith can't be changed, linking
        `xref:backend/messaging/kafka-connect.adoc[]` and
        `xref:backend/architectural-patterns/transactional-outbox.adoc[]` — and how it **subscribes** to events
        (a small helper application when it can't consume them natively).
  - [x] Task 10.5. **Data consistency between monolith and service**: why splitting an ACID transaction forces a
        saga; why the monolith is often an unwilling saga participant (compensating transactions need
        semantic-lock states scattered across it); the rule "**keep the monolith's transactions pivot or
        retriable**"; **sequencing the extractions** — the Bookshop sequence **Orders → Customers →
        Catalogue/Inventory → Payments** from "Running example reference", showing the resulting saga at each
        step and why the monolith's own remaining transaction never needs to become compensatable — linking
        `xref:backend/architectural-patterns/sagas.adoc[]` and
        `xref:backend/architectural-patterns/why-not-distributed-transactions.adoc[]` for the saga mechanics
        rather than re-deriving them.
  - [x] Task 10.6. **Security**: from session cookies to a user-info cookie/token propagated by the gateway,
        linking `xref:backend/oauth/browser-based-apps.adoc[]` and
        `xref:backend/oauth/authorization-code-and-pkce.adoc[]`. **Deployment**: a service at a time,
        containerised, on whatever the team already runs; Kubernetes only once there are enough services to
        justify it, linking `xref:backend/quarkus/kubernetes-and-openshift.adoc[]` or an equivalent Spring Boot
        containers page. A closing checklist per extracted service.
  - [x] Task 10.7. Figures: SVG `architecture-extract-service.svg` (a vertical slice leaving the monolith, gateway
        routing, the integration glue); two `[mermaid]` sequence diagrams for the Bookshop "place order" saga
        before and after extracting Payments (showing the monolith's transaction as the pivot in the "after"
        diagram); `[mermaid]` figure contrasting query-by-API vs. replica-by-events; a table of the extraction
        order with the reason for each step (accelerates development / performance-scaling-reliability /
        unblocks other extractions).
  - [x] Task 10.8. `== References` linking https://microservices.io/patterns/refactoring/strangler-application.html,
        https://microservices.io/patterns/refactoring/anti-corruption-layer.html,
        https://learn.microsoft.com/en-us/azure/architecture/microservices/migrate-monolith,
        https://docs.aws.amazon.com/prescriptive-guidance/latest/modernization-decomposing-monoliths/decomposing-monoliths.html,
        and https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf.
  - Note: page written at 472 lines with 3 `[mermaid]` blocks (saga before/after extracting Payments, query-by-API
    vs. replica-by-events) plus `architecture-extract-service.svg` (new SVG, vertical slice + gateway routing +
    integration glue) and the extraction-order table. All `xref:` targets (kafka-connect, transactional-outbox,
    sagas, why-not-distributed-transactions, browser-based-apps, authorization-code-and-pkce,
    kubernetes-and-openshift) verified to exist; no substitution needed. n/a: tests/coverage/code-quality/license
    header (docs-only).

### Group 7 — SaaS migration path and starting a new project (Parallelizable: yes)

- [x] Task 11. Create `modules/ROOT/pages/backend/architecture/migration-path-to-multi-tenant-saas.adoc` —
      "Migration Path: From Single-Tenant to Multi-Tenant SaaS"
  - [x] Task 11.1. `= Migration Path: From Single-Tenant to Multi-Tenant SaaS`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`. State why this is a distinct path from the previous
        three — it changes the business, not only the code.
  - [x] Task 11.2. The **control plane / application plane** split (Golding ch. 2) and why the control plane
        (onboarding, identity, tenant management, metrics, billing, admin) is built first — "**build your
        multi-tenant foundation on day one**" (Golding ch. 17). **Tenant context** flowing through every request
        (routing, logging, data access, isolation).
  - [x] Task 11.3. The **silo/pool** vocabulary (Golding ch. 3) and the deployment models: full-stack silo,
        full-stack pool, hybrid with a premium siloed tier, mixed mode per service, pods.
  - [x] Task 11.4. The three **migration patterns** (Golding ch. 13) with the "Bookshop-as-a-SaaS" example: **silo
        lift-and-shift** (fastest, least invasive, one version for everyone, automated per-tenant onboarding);
        **layered migration** (pool the web tier, then the application tier); **service-by-service migration**
        (strangle the application tier into pooled multi-tenant microservices; "don't compromise on the new
        microservices"; integrating legacy code with the control plane). Their pros and cons side by side; the
        **phased approach** that chains them; "**where you start matters**" — identity → onboarding → tenant
        authentication → tenant context in services → tenant-aware logs and metrics.
  - [x] Task 11.5. Guiding principles (Golding ch. 17): **avoid the tech-first trap**, no one-size-fits-all model,
        protect the multi-tenant principles.
  - [x] Task 11.6. Link `xref:backend/hibernate/multitenancy.adoc[]` for the data-partitioning mechanics; link the
        AWS SaaS Lens and SaaS Architecture Fundamentals whitepaper as primary online sources for this page.
  - [x] Task 11.7. Figures: SVG `architecture-saas-migration-patterns.svg` (the three patterns side by side over
        control plane + application plane); `[mermaid]` figure of the phased approach chaining the three
        patterns; table silo vs. pool vs. hybrid vs. mixed vs. pod with "when to use".
  - [x] Task 11.8. `== References` linking
        https://docs.aws.amazon.com/whitepapers/latest/saas-architecture-fundamentals/saas-architecture-fundamentals.html,
        https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/saas-lens.html,
        https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/silo-pool-and-bridge-models.html,
        https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/general-design-principles.html, and
        https://www.amazon.com/dp/1098140648 (Golding's book, Amazon fallback per the issue's O'Reilly-403 note).
  - Files: `modules/ROOT/pages/backend/architecture/migration-path-to-multi-tenant-saas.adoc` (283 lines),
    `modules/ROOT/images/architecture-saas-migration-patterns.svg` (new). 1 `[mermaid]` block (phased-approach
    flowchart). Grounded in Golding chs. 2/3/13/17 (extracted to scratchpad for reference, not reproduced).
    Cross-links to `migration-overview.adoc`, `architectural-styles.adoc`, `api-gateway-and-bff.adoc`,
    `choosing-monolith-or-microservices.adoc`, `migration-path-monolith-to-microservices.adoc`,
    `backend/hibernate/multitenancy.adoc`, and forward to `starting-a-new-project.adoc` (created by Task 12 in
    this same group). No blocker.

- [x] Task 12. Create `modules/ROOT/pages/backend/architecture/starting-a-new-project.adoc` — "Starting a New
      Project: Which Path and Which Technologies"
  - [x] Task 12.1. `= Starting a New Project: Which Path and Which Technologies`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 12.2. **Profile questions**: expected size/domain complexity; expected traffic (low/high/bursty);
        lifetime (one-shot vs. long-term maintenance and evolution); number of teams; need for a public API,
        native apps, several UIs; need for multi-tenancy; compliance; team skills and budget.
  - [x] Task 12.3. **Default path**: start as a modular monolith with a clean API layer and a separate frontend
        when there will be more than one client; extract services only when a signal from
        `choosing-monolith-or-microservices.adoc` appears (cross-linked).
  - [x] Task 12.4. Seven **scenario cards**, each a one-paragraph story + recommended architecture + a stack drawn
        *only* from technologies already documented on this site, with links, + what to explicitly not do:
        (a) small one-shot project/internal tool — monolith, server-rendered UI or small SPA, one relational
        database, single JAR/container or PaaS, no Kafka, no Kubernetes; (b) startup MVP that must evolve fast —
        modular monolith, REST API + React/Angular/Vue from day one so native apps can follow, PostgreSQL,
        container on a managed platform, feature flags; (c) long-lived line-of-business application for one
        organisation — modular monolith with Spring Modulith or Quarkus, RabbitMQ for background work,
        OAuth/OIDC, observability from day one; (d) high-traffic consumer application — API gateway/BFF,
        microservices for the hot paths only (search on Elasticsearch/Solr, catalogue cache, order/payment
        sagas), Kafka, Kubernetes, CQRS read models (linking the Architectural Patterns pages); (e) large
        multi-team enterprise platform — microservices by business capability, API-first contracts, gateway + BFF
        per client, event-driven integration, per-service databases, distributed tracing; (f) multi-tenant SaaS
        product — control plane first, pooled application plane, tiering, serverless for a low-traffic control
        plane (cross-linked to `migration-path-to-multi-tenant-saas.adoc`); (g) batch/data-processing job — Spring
        Batch, no web layer at all (`xref:backend/spring-batch/index.adoc[]`).
  - [x] Task 12.5. Cross-cutting recommendation tables, every cell linked to the existing comparison page it
        derives from: backend framework (`xref:backend/springboot/index.adoc[]` vs.
        `xref:backend/quarkus/index.adoc[]`; `xref:backend/springboot/java-or-kotlin.adoc[]`; Python/FastAPI per
        `xref:backend/graphql/python-getting-started.adoc[]`); API style
        (`xref:backend/graphql/when-to-use-graphql-or-rest.adoc[]`); messaging
        (`xref:backend/messaging/kafka-vs-rabbitmq.adoc[]` — or none); database
        (`xref:database/choosing-the-right-database.adoc[]`); frontend (`xref:web/react/index.adoc[]` /
        `xref:web/angular/index.adoc[]` / `xref:web/vue/index.adoc[]` vs. `xref:web/vaadin/index.adoc[]` /
        Blazor / Thymeleaf; `xref:web/bootstrap/index.adoc[]` vs. `xref:web/tailwind/index.adoc[]`); mobile
        (`xref:apps/android/index.adoc[]`, `xref:programming-languages/swift/index.adoc[]`, cross-platform in one
        line); authentication (`xref:backend/oauth/index.adoc[]`, the BFF for SPAs); deployment (single process →
        container → managed container platform → Kubernetes → serverless, with the serverless long-tail-latency
        caveat for JVM services and Quarkus native as the mitigation, linking
        `xref:backend/quarkus/native-executables.adoc[]`).
  - [x] Task 12.6. Figures: `[mermaid]` decision flowchart (profile → style → deployment); SVG
        `architecture-project-profile-matrix.svg` (the scenario × concern matrix in one picture); one small
        `[mermaid]` topology figure per scenario card (7 figures).
  - [x] Task 12.7. `== References` linking https://12factor.net/, https://c4model.com/, and
        https://cloud.google.com/architecture/microservices-architecture-refactoring-monoliths.
  - Files: `modules/ROOT/pages/backend/architecture/starting-a-new-project.adoc` (521 lines -- longer than the
    200-450 target, justified by 7 scenario cards + cross-cutting tables + 8 figures, comparable to
    migration-path-monolith-to-microservices.adoc's 472 lines), `modules/ROOT/images/architecture-project-profile-matrix.svg`
    (new). 8 `[mermaid]` blocks (1 decision flowchart + 7 per-scenario topology figures, each 3-6 nodes). All
    `xref:` targets verified to exist (42 unique targets across both Task 11/12 pages, including
    `database/solr/solr-vs-elasticsearch.adoc` for the Elasticsearch/Solr comparison and
    `backend/quarkus/native-executables.adoc` for the serverless JVM cold-start mitigation) -- no substitution
    needed. Both new pages additionally verified with a standalone `asciidoctor` conversion (table/anchor/xref
    syntax and all internal `<<...>>` cross-references confirmed to resolve against Asciidoctor's actual
    auto-generated section ids) -- the full Antora build itself was not run, per this group's instructions
    (left to Group 12). No blocker.

### Group 8 — Landing page and cheat-sheet page (Parallelizable: yes — both only read the finished state of Groups 1–7, neither touches the other's file)

- [x] Task 13. Create `modules/ROOT/pages/backend/architecture/index.adoc` — "Architecture" landing page
  -- 267 lines. `include::partial$architecture-disclaimer.adoc[]` included; `[[_bibliography]]` anchor present.
  - [x] Task 13.1. `= Architecture`, `:description:`, `:keywords:`, `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 13.2. One paragraph on what the section is about; introduce the Bookshop running example (per
        "Running example reference").
  - [x] Task 13.3. A "new here? read in this order" pointer: architectural styles → benefits and drawbacks →
        choosing → layering → gateway/BFF → migration overview → the four migration paths → starting a new
        project → cheat sheet.
  - [x] Task 13.4. The full "What's covered" list grouped exactly per the issue's page outline (Foundations;
        Layering the architecture; Migration paths; Starting from scratch), each item an `xref:` to its page with
        a one-line description, plus a `cheat-sheet.adoc` line.
  - [x] Task 13.5. Relationship paragraph: how this section complements
        `xref:backend/architectural-patterns/index.adoc[]` (that section decides how a split system stays
        consistent; this one decides whether and how to split), plus one sentence each for the SpringBoot,
        Quarkus, Messaging, GraphQL, OAuth, Web, and Apps references it links into.
  - [x] Task 13.6. `[[_bibliography]] == Bibliography`, grouped exactly as the issue's "Online sources" section
        (*Pattern catalogues and canonical articles*; *Cloud-provider architecture guidance*; *Technology
        documentation*; *Consulted reference books*) — fetched via `gh issue view 154 --json body -q .body` and
        reproduced all 105 URLs from the three online-source groups plus the 6 book/whitepaper URLs (Richardson —
        Manning page; Golding — O'Reilly page with the Amazon fallback and the free AWS whitepaper; Newman; Ford,
        Parsons, Kua & Sadalage; Richards & Ford), verified by a URL-set diff against the issue body (111 distinct
        URLs in the issue's relevant sections, 111 reproduced, zero missing/extra). Ambler & Sadalage's
        _Refactoring Databases_ has no publisher URL in the issue, so it is listed without a link, matching the
        issue's own text. Closing sentence added matching the Architectural Patterns bibliography's in spirit.

- [x] Task 14. Create `modules/ROOT/pages/backend/architecture/cheat-sheet.adoc` — "Architecture Cheat Sheet"
  -- 41 lines. All 11 concept pages cross-referenced by `xref:`.
  - [x] Task 14.1. `= Architecture Cheat Sheet`, `:description:`, `:keywords:`,
        `include::partial$architecture-disclaimer.adoc[]`.
  - [x] Task 14.2. A short intro paragraph naming everything the sheet covers, cross-referencing every one of the
        11 concept pages by `xref:`.
  - [x] Task 14.3. `== Download` linking the not-yet-produced PDF:
        `xref:attachment$architecture-cheat-sheet.pdf[Download the Architecture Cheat Sheet (PDF)]`.

### Group 9 — Cheat-sheet PDF (Parallelizable: yes — single task)

Depends on Group 8 (needs `cheat-sheet.adoc`'s finalized content list) and, for visual consistency, on
`architectural-patterns-cheat-sheet.pdf` existing as the style reference (it already does).

- [x] Task 15. Produce `modules/ROOT/attachments/architecture-cheat-sheet.pdf` — done: one A4 page
      (594.96×841.92pt), 3-column layout plus a full-width stack-matrix box, ~93% page-height fill, visually
      consistent with `architectural-patterns-cheat-sheet.pdf`. Tests/coverage/lint/license headers: n/a (static
      PDF asset, no source code).
  - [x] Task 15.1. Inspect `architectural-patterns-cheat-sheet.pdf` directly with PyMuPDF (`fitz`) —
        `page.rect`/`get_fonts`/`get_drawings`/`get_text("dict")` — to extract its exact page size, column
        layout, palette RGB values, fonts, and border/header treatment, per the technique
        `.archive/implementation_plan_152.md` Task 19.1 used (no HTML/CSS source survives in git for any
        precedent cheat sheet). — done: confirmed A4 portrait (594.96×841.92pt), Helvetica Neue body/Menlo code
        fonts, thin (0.75pt) colour-coded box borders with uppercase coloured headers, light hairline table row
        dividers (#dddddd/#eeeeee), header dark divider line and footer gray divider line, palette blue
        `#1a5fb4`, purple `#7a3e9d`, teal `#0b6b78`(~), orange `#a8620a`, red `#b3261e`.
  - [x] Task 15.2. Build a print-ready HTML/CSS layout (multi-column flexbox, colour-coded bordered boxes with
        uppercase coloured headers, a header line, an italic breadcrumb footer) as a scratch file under the
        session scratchpad directory — not committed to the repository. — done:
        `scratchpad/architecture-cheat-sheet.html` (3-column flexbox row + a full-width stack-matrix box below,
        5-colour palette matching the precedent, header line with subtitle, italic breadcrumb footer), kept only
        in the session scratchpad.
  - [x] Task 15.3. Content, one box/section per group, built around "where are you now? → what to do": migration
        paths by current architecture (5 rows: legacy-stack monolith, healthy monolith that outgrew itself,
        modular monolith with a hot spot, partially extracted system, single-tenant installs, plus the
        recommended extraction order), monolith-vs-microservices signal box, benefits/inconveniences two-column
        box, layering box (with a "what it costs" sub-list), new-project → recommended-stack matrix (the seven
        `starting-a-new-project.adoc` scenario cards × architecture/backend/API/messaging/database/frontend/
        mobile/deployment), pitfalls strip (5 items), and a categorized pointers box (pattern catalogues, cloud
        guidance, books) — done: all seven boxes present, wording drawn from the issue's "Cheat sheet" section
        and the finished `cheat-sheet.adoc`/`starting-a-new-project.adoc` pages.
  - [x] Task 15.4. Render to PDF via headless Chrome (`Google Chrome --headless --disable-gpu
        --no-pdf-header-footer --print-to-pdf`), verify with PyMuPDF that the output is exactly one A4 page,
        iterating the layout (flexbox columns, `table-layout:fixed`, `hyphens:auto`, `<wbr>` in long tokens)
        rather than cropping or truncating content if it overflows — the same iteration approach
        `implementation_plan_152.md` Task 19.4 used. — done: rendered with `--headless --disable-gpu
        --no-pdf-header-footer --print-to-pdf`; first render only filled ~55% of the page height, fixed by
        enlarging fonts/padding and adding more real content (bullet lists, a categorized pointers box, an
        extraction-order note) rather than stretching empty space; final PDF verified via PyMuPDF: `page_count ==
        1`, `page.rect` == 594.96×841.92pt, content fills ~93% of the page height.
  - [x] Task 15.5. Visual check: render both this PDF and `architectural-patterns-cheat-sheet.pdf` to PNG via
        PyMuPDF (`page.get_pixmap(...)`) and compare side by side for a consistent look (colour-coded bordered
        boxes, uppercase headers, hairline dividers, similar page-height fill). — done: both rendered at 200dpi
        and viewed side by side; consistent look confirmed (colour-coded bordered boxes, uppercase coloured
        headers, hairline dividers, italic breadcrumb footer, ~93% vs. precedent's ~96% page-height fill); a
        300dpi zoom into the stack-matrix table confirmed no clipped/overlapping/overflowing text and fully
        legible cells.
  - [x] Task 15.6. Check in only the rendered PDF at `modules/ROOT/attachments/architecture-cheat-sheet.pdf`; keep
        the scratch HTML/CSS source and PNG previews only under the session scratchpad directory, not the
        repository. — done: PDF copied to `modules/ROOT/attachments/architecture-cheat-sheet.pdf`; HTML/CSS
        source, the PyMuPDF inspection script, and PNG previews left only under the session scratchpad directory
        (`git status --short` shows only the new PDF added under `modules/ROOT/attachments/`).

### Group 10 — Site wiring (Parallelizable: no — small, order-sensitive edits across shared navigation/index files, matching the Group 11 precedent from implementation_plan_152.md)

- [x] Task 16. Edit `modules/ROOT/nav.adoc` — add the Architecture nav block — done: inserted a 13-line
      `*** xref:backend/architecture/index.adoc[Architecture]` block (index + 11 concept pages + cheat-sheet)
      right after the Architectural Patterns block's last line and before `** xref:apps/index.adoc[Apps]`.
      Tests/coverage/code-quality/license-header: n/a (docs-only repo).
  - [x] Task 16.1. Insert `*** xref:backend/architecture/index.adoc[Architecture]` immediately after the
        Architectural Patterns block's last line
        (`**** xref:backend/architectural-patterns/cheat-sheet.adoc[Cheat Sheet (PDF)]`), before the following
        `** xref:apps/index.adoc[Apps]` line.
  - [x] Task 16.2. Add the 11 concept-page `****` children plus the `****` cheat-sheet child, in the same order
        as Task 13.4's "What's covered" list, with titles taken verbatim from each page's `= Title`.

- [x] Task 17. Edit `modules/ROOT/pages/backend/index.adoc` — add the "Architecture" bullet — done: bullet added
      to `== Sections` right after Architectural Patterns; `:description:`/`:keywords:` updated.
      Tests/coverage/code-quality/license-header: n/a (docs-only repo).
  - [x] Task 17.1. Add a new `* xref:backend/architecture/index.adoc[Architecture] -- ...` bullet to `== Sections`
        right after the existing Architectural Patterns bullet, with a one-line description mentioning monolith
        vs. microservices, layering, migration paths, and starting a new project.
  - [x] Task 17.2. Update the page's `:description:`/`:keywords:` to include the new section's terms (monolith,
        modular monolith, microservices, strangler fig, migration, API gateway, backends for frontends, SaaS).

- [x] Task 18. Edit `modules/ROOT/pages/index.adoc` — root keywords — done: appended the new terms to the
      existing `:keywords:` line. Tests/coverage/code-quality/license-header: n/a (docs-only repo).
  - [x] Task 18.1. Append `, monolith, modular monolith, strangler fig, migration, API gateway, backends for
        frontends, SaaS, multi-tenant` to the existing `:keywords:` line (currently ending "... domain-driven
        design, DDD, microservices, saga, transactional outbox, CQRS, event sourcing, aggregate").

### Group 11 — Reciprocal cross-links in existing pages (Parallelizable: yes — seven distinct files)

- [x] Task 19. `modules/ROOT/pages/backend/architectural-patterns/index.adoc` — 2 sentences/bullets added (docs-only, n/a tests/coverage/quality).
  - [x] Task 19.1. In the intro paragraph (right after the disclaimer include), add one sentence pointing to
        `xref:backend/architecture/index.adoc[]` for the monolith-vs-microservices decision and the migration
        paths — explicitly noting that this page's own intro previously declared strangler-style migration out
        of scope, and that this is where it now lives.
  - [x] Task 19.2. In `[[_bibliography]] == Bibliography`, under *Consulted reference books*, extend the
        Richardson entry's note to say that chapters 1, 2, 8, 12 and 13 are the narrative source for the sibling
        Architecture section; add Golding's *Building Multi-Tenant SaaS Architectures* to the same list with its
        publisher page (403 to non-browser clients, note the Amazon fallback) and the free AWS whitepaper,
        described as the source of the multi-tenancy angle shared with the Hibernate multitenancy page and the
        new SaaS migration page.

- [x] Task 20. `modules/ROOT/pages/backend/springboot/architectural-patterns.adoc` — 1 sentence added (docs-only, n/a tests/coverage/quality).
  - [x] Task 20.1. In `== Where this section stops`, add one more sentence after the existing paragraph pointing
        to `xref:backend/architecture/index.adoc[]` for migration and layering, without removing or altering the
        existing sentence about the Architectural Patterns section.

- [x] Task 21. `modules/ROOT/pages/web/aspnet/web-forms/migrating-to-modern-aspnet.adoc` — 1 sentence added (docs-only, n/a tests/coverage/quality).
  - [x] Task 21.1. Near `== The incremental migration path: System.Web.Adapters + YARP`, add one sentence pointing
        to `xref:backend/architecture/migration-path-legacy-to-modern-stack.adoc[]` as the technology-neutral
        treatment of the same strangler strategy.

- [x] Task 22. `modules/ROOT/pages/web/aspnet/core/architecture-and-patterns.adoc` — 1 sentence added (docs-only, n/a tests/coverage/quality).
  - [x] Task 22.1. In the "**Modular monolith vs. microservices**" bullet under `== Vertical slices and larger
        structure`, add a link to
        `xref:backend/architecture/migration-path-monolith-to-modular-monolith.adoc[]`.

- [x] Task 23. `modules/ROOT/pages/backend/oauth/browser-based-apps.adoc` — 1 sentence added (docs-only, n/a tests/coverage/quality).
  - [x] Task 23.1. Under `== The recommended pattern: backend-for-frontend (BFF)`, add one sentence pointing to
        `xref:backend/architecture/api-gateway-and-bff.adoc[]` for the BFF as an architectural pattern, not only
        a security one.

- [x] Task 24. `modules/ROOT/pages/database/choosing-the-right-database.adoc` — 1 "see also" sentence added (docs-only, n/a tests/coverage/quality).
  - [x] Task 24.1. At the end of `== Start With the Questions That Actually Decide It`, add one "see also"
        sentence pointing to `xref:backend/architecture/starting-a-new-project.adoc[]`, which composes this
        page's database guidance with the rest of the stack.

- [x] Task 25. `modules/ROOT/pages/backend/graphql/when-to-use-graphql-or-rest.adoc` — 1 bullet added to Related pages (docs-only, n/a tests/coverage/quality).
  - [x] Task 25.1. Append one bullet to the existing `== Related pages` list pointing to
        `xref:backend/architecture/starting-a-new-project.adoc[]`, matching the format of the other bullets in
        that list (one-line description of what it composes).

### Group 12 — Mermaid validation and final build verification (Parallelizable: no — verifies the output of every prior group)

- [x] Task 26. Validate Mermaid, build the site, and verify (docs-only, n/a tests/coverage/quality).
  - [x] Task 26.1. Ran `npm run validate:mermaid` — clean on the first run: "All 332 Mermaid diagrams parsed
        successfully" (exit 0). No diagram needed fixing.
  - [x] Task 26.2. Ran `npx antora antora-playbook.yml` (local content only, no `--fetch`), output redirected to
        the scratchpad log — build succeeded with an empty (0-line) log, so grepping it for
        `ERROR`/`WARN`/`xref`/`unresolved`/`include`/`image`/`attachment`/`architecture` matched nothing.
  - [x] Task 26.3. Verified `build/site/backend/architecture/` contains all 13 HTML pages (index, cheat-sheet,
        and the 11 concept pages). Verified `build/site/_attachments/architecture-cheat-sheet.pdf` exists.
        Verified all 8 `architecture-*.svg` under `modules/ROOT/images/` are each referenced by exactly one page
        via `image::` and resolve under `build/site/_images/`. Verified the built `index.html` nav order is
        `backend/architectural-patterns/index.html` → `backend/architecture/index.html` → `apps/index.html`
        (byte offsets 192141 < 194916 < 197327), i.e. Architecture sits after Architectural Patterns and before
        Apps.
  - [x] Task 26.4. Verified every `xref:` target under `modules/ROOT/pages/backend/architecture/*.adoc` resolves
        to an existing file. Spot-checked the Group 11 anchored cross-page xrefs against the built HTML's actual
        heading ids and found one broken anchor: `migration-path-monolith-to-microservices.adoc` linked
        `migration-path-legacy-to-modern-stack.adoc#_separate_the_presentation_tier_from_the_backend` but the
        real heading ("Separate the presentation tier from the backend first") generates id
        `_separate_the_presentation_tier_from_the_backend_first` — fixed by appending `_first` to the anchor;
        rebuilt and confirmed the link now resolves (`href="...#_separate_the_presentation_tier_from_the_backend_first"`
        matches the target `id="..."` in the built HTML). All other spot-checked anchors
        (`choosing-monolith-or-microservices.adoc#_signals_it_is_time_to_split`,
        `migration-path-legacy-to-modern-stack.adoc#_data_synchronisation_during_the_overlap`,
        `migration-path-legacy-to-modern-stack.adoc#_the_anti_corruption_layer`,
        `migration-path-monolith-to-modular-monolith.adoc#_killing_god_classes`,
        `migration-path-monolith-to-modular-monolith.adoc#_why_this_already_buys_most_of_the_benefit_and_the_signal_to_go_further`,
        `index.adoc#_bibliography`) were already correct. Verified the reciprocal `backend/architecture/...`
        xrefs in all seven cross-linked pages are present and point at existing files.
