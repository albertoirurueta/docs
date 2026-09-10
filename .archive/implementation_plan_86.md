# Implementation Plan: Backend Development / GraphQL Reference

## Task summary

Source: GitHub issue #86

Issue [#86](https://github.com/albertoirurueta/docs/issues/86) ("Add \"GraphQL Reference\" documentation section
under Guides & References / Backend Development") asks to add a new **"GraphQL Reference"** section under the
existing **Guides & References / Backend Development** guide, at `modules/ROOT/pages/backend/graphql/` — a
sibling of the existing `backend/hibernate/` and `backend/springboot/` sections. It documents **GraphQL itself**
as a backend-developer reference — the query language, schema/type system, execution and resolvers, validation,
introspection, serving over HTTP, pagination, caching, the N+1/DataLoader problem, security/demand control,
authorization, and federation — plus first-class, in-depth integration coverage for **Spring Boot** (Spring for
GraphQL) and **Python/FastAPI** (Strawberry primary, Ariadne alternative), plus a dedicated **"Configuring
clients"** group (Apollo Client, urql, Relay, the JVM `GraphQlClient`, the Python `gql` client), plus a one-page
downloadable PDF cheat sheet.

Content is written and verified against **the current GraphQL specification (October 2021)**, plus the working
draft for `@defer`/`@stream`/`@oneOf`, and the **GraphQL-over-HTTP specification**; on the framework side against
**Spring for GraphQL 2.0.x** (Spring Boot 4.x / Spring Framework 7.x, Java 17+ baseline), the current
**Strawberry**/**Ariadne** lines on FastAPI, and **Apollo Client v4 / urql v4 / Relay (current)** for clients. No
specific patch version is pinned, matching the "current line, no patch pinned" convention already used by the
SpringBoot and Elasticsearch references.

Two local PDF books (`~/Desktop/graphql1.pdf` = Porcello & Banks, *Learning GraphQL*, O'Reilly, 2018;
`~/Desktop/graphql2.pdf` = Buna, *Learning GraphQL and Relay*, Packt, 2016) were consulted while the issue was
being scoped. Both predate the modern surface (Spring Boot, Python, `@defer`/`@stream`, `@oneOf`, the
GraphQL-over-HTTP spec, trusted/persisted documents, modern federation, `graphql-ws`, current client caching) —
**they are cited only as bibliography entries in `index.adoc`, never as the primary or main reference**, and the
official documentation/specification wins on any discrepancy. This plan carries the issue's own explicit,
unusually strict requirement forward: **the disclaimer partial and every per-page admonition must carry only the
"generated with AI assistance, verify against the official docs" caveat and must never name or allude to either
book, "the consulted books", or "the sources below"** — all source attribution (official docs, specs, and the two
books) lives **only** in `index.adoc`'s `== Bibliography` section.

This is the same pattern already used for the SQL, MongoDB, Couchbase, Elasticsearch, Hibernate, and SpringBoot
reference sections. The closest structural precedent is
[.archive/implementation_plan_70.md](.archive/implementation_plan_70.md) (issue #70, "Elasticsearch Reference") —
a new subsection grounded in official documentation plus bibliography-only books, `[mermaid]`/SVG diagrams, a
`== Bibliography`, a headless-Chrome-rendered one-page PDF cheat sheet, organised into four task groups (1.
scaffolding, 2. content pages, 3. cheat sheet + PDF, 4. section index/nav/site wiring) — this plan follows the
same four-group shape. `implementation_plan_55.md` (#55, SpringBoot Reference) and `implementation_plan_57.md`
(#57, Java Reference) are the other named precedents.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **No page merges applied.** The issue's own 32-page breakdown (excluding `index.adoc` and `cheat-sheet.adoc`)
   is kept as-is: unlike the Elasticsearch issue (which needed consolidating from ~27 pages), this issue already
   groups by a coherent per-concept, per-integration-stack split and explicitly says "do not split further
   without reason" — there is no page here thin enough to justify merging.
2. **`directives.adoc` vs. `variables-directives-fragments.adoc` boundary**: the former covers **type-system
   (schema) directives** (`@deprecated`, `@specifiedBy`, custom schema directives/SDL visitors); the latter
   covers **executable (operation) directives** (`@include`/`@skip`) as part of the client-facing query
   language, per the issue's own grouping. Kept distinct rather than merged, since they serve different
   audiences (server schema author vs. client query author).
3. **Diagram placement** — the issue lists nine candidate diagrams/figures without pinning each to a specific
   page. This plan assigns each to the page it most directly illustrates (see per-task notes below), marking the
   **request lifecycle** (on `getting-started.adoc`) and the **N+1 vs. DataLoader** figure (on
   `performance-and-n-plus-1.adoc`) as **required** (per the issue's acceptance criteria), the rest as
   **included where they clarify** — all as `[mermaid]` blocks except the Relay Cursor Connections shape and the
   client normalized-cache model, which are plain JSON/prose (a diagram would add nothing a `[source,json]`
   sample doesn't already show more precisely).
4. **`spring-boot-transports-security-and-testing.adoc` and `python-strawberry-schema-and-features.adoc`** stay
   single pages per the issue's list rather than being split further, even though each covers several
   sub-topics (transports+security+testing; schema features+permissions+DataLoaders+Relay) — each sub-topic gets
   its own `====` heading within the page instead of a new file, consistent with how `springboot/spring-security.adoc`
   and similar existing pages already bundle related sub-topics under one page.
5. **`rest-apis.adoc` pointer**: added as a short paragraph directly under the page's `include::partial$springboot-disclaimer.adoc[]`
   line (before the "Spring MVC: annotated REST controllers" content), matching how sibling "see also" pointers
   are placed on other pages in this repo. The optional `springboot/index.adoc` pointer (issue: "optionally add
   ... where it lists the REST / gRPC API pages") is included since it costs one line and keeps the API-style
   siblings consistently cross-linked.

## Current code state

- This repo has no application source code — it is the Antora playbook/root (`ROOT`) component for the docs
  site. `antora.yml` declares component `ROOT`; nav lives at `modules/ROOT/nav.adoc`; pages live under
  `modules/ROOT/pages/`.
- `modules/ROOT/pages/backend/index.adoc` — the Backend Development landing page — exists today with a
  `== Sections` bullet list covering `programming-languages/java/index.adoc[Java Reference]`,
  `backend/hibernate/index.adoc[Hibernate Reference]`, and `backend/springboot/index.adoc[SpringBoot Reference]`.
  A new `xref:backend/graphql/index.adoc[GraphQL Reference]` bullet must be added after the SpringBoot Reference
  one, and the page's `:description:`/`:keywords:` extended.
- `modules/ROOT/nav.adoc`: the `** xref:backend/index.adoc[Backend Development]` entry (line 466) is followed by
  the Hibernate Reference block (lines 468–499, ending `**** xref:backend/hibernate/cheat-sheet.adoc[Cheat Sheet (PDF)]`)
  and the SpringBoot Reference block (lines 500–536, ending
  `**** xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]`). Line 537 is
  `** xref:apps/index.adoc[Apps]`. **Confirmed against the current branch**: issue #82 (Spring Batch Reference,
  a would-be sibling section) has **not** merged, so the insertion point is unambiguous — the new
  `*** xref:backend/graphql/index.adoc[GraphQL Reference]` block goes directly after line 536 and before line 537.
- `modules/ROOT/partials/elasticsearch-disclaimer.adoc` and `modules/ROOT/partials/springboot-disclaimer.adoc`
  are the structural models for the new `graphql-disclaimer.adoc`: a single `[IMPORTANT]`/`====` admonition —
  first paragraph states the current spec/framework lines and "no patch version pinned"/"some surfaces linked,
  not documented in depth"; second paragraph is the AI-assistance caveat; third paragraph points to the page's
  own `#_bibliography` anchor. Neither partial names a book — this is the existing convention, not a deviation
  invented for this section.
- `modules/ROOT/pages/database/elasticsearch/cheat-sheet.adoc` and the PDFs already in
  `modules/ROOT/attachments/*.pdf` (e.g. `elasticsearch-cheat-sheet.pdf`, 87 KB, one A4 page) are the model for
  `cheat-sheet.adoc` + `graphql-cheat-sheet.pdf`: a short intro, grouped `xref:` back-links to every content
  page, then `xref:attachment$graphql-cheat-sheet.pdf[Download the GraphQL Cheat Sheet (PDF)]`. No HTML source
  is ever committed — the PDF is built in a scratch location via headless Chrome
  (`--headless --print-to-pdf --no-pdf-header-footer`) and copied into `modules/ROOT/attachments/`.
- `modules/ROOT/pages/web/react/data-fetching.adoc:66` already has a `== GraphQL and framework loading` section
  naming Apollo Client/urql/Relay — needs one `xref:backend/graphql/clients-overview.adoc[...]` link added, no
  content restated.
- `modules/ROOT/pages/backend/springboot/rest-apis.adoc` and `.../grpc-apis.adoc` are the natural "API style"
  siblings — `rest-apis.adoc` needs a short pointer to the new section near its top;
  `modules/ROOT/pages/backend/springboot/index.adoc` optionally gets the same pointer where it lists REST/gRPC.
- **AsciiDoc gotcha** (carried over from every prior section, unusually severe here): inline `{foo}` outside
  `[source]` blocks is parsed as an Antora attribute reference → build warning. GraphQL SDL/operations/JSON are
  almost entirely braces — every selection set / type body / example object must live inside a `[source]` block;
  a brace-bearing token that must appear in prose (e.g. `pageInfo { hasNextPage }`,
  `application/graphql-response+json`) is escaped as `\{ ... }`.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:` (comma-separated), blank line, then
  `include::partial$graphql-disclaimer.adoc[]`, then a one/two-sentence lead — identical placement to
  `include::partial$springboot-disclaimer.adoc[]` in the SpringBoot pages.
- **Every concept carries at least one runnable example and at least one link to the specific official
  documentation/spec page it documents** (never a generic "see the GraphQL docs"):
  - Language-agnostic pages: `[source,graphql]` for SDL/operations, `[source,json]` for variables/responses,
    `[source,http]`/`[source,bash]` (cURL) for the wire format. Link to the matching
    `https://graphql.org/learn/<page>/` section, and to `https://spec.graphql.org/October2021/#<anchor>` (or the
    GraphQL-over-HTTP spec) where a normative detail is involved.
  - Spring Boot pages: `[source,java]` `@Controller`/`@Configuration` as the primary style, `[source,xml]` for
    the `spring-boot-starter-graphql` Maven dependency, `[source,yaml]`/`[source,properties]` for
    `application.yml` (`spring.graphql.*`), `[source,graphql]` for schema files. Link to
    `https://docs.spring.io/spring-graphql/reference/<area>.html`.
  - Python pages: `[source,python]` Strawberry/Ariadne + FastAPI as the primary style, `[source,bash]` for
    `pip install "strawberry-graphql[fastapi]"` / `pip install ariadne uvicorn`, `[source,graphql]` for Ariadne
    SDL. Link to `https://strawberry.rocks/docs/...` / `https://ariadnegraphql.org/docs/...`.
  - Client pages: `[source,ts]`/`[source,js]` for Apollo Client/urql/Relay config, `[source,java]` for the JVM
    `GraphQlClient`, `[source,python]` for `gql`. Link to the matching official client docs.
- **No source is ever named in an admonition or in prose as "what this was written from".** Every admonition
  (`[NOTE]`/`[TIP]`/`[IMPORTANT]`/`[WARNING]`) on every page must carry only the "generated with AI assistance,
  verify against the official docs" caveat (or a normal cross-reference to a specific official page) — **never**
  mention *Learning GraphQL*, *Learning GraphQL and Relay*, "the consulted books", or "the sources below". All
  source attribution (specs, official docs, and the two books) lives **only** in `index.adoc`'s
  `== Bibliography`.
- **Diagrams**: `[mermaid]` for flow/sequence diagrams; a `[source,json]`/`[source,graphql]` sample where that's
  clearer than a picture (see "Choices made on the user's behalf" #3 above); hand-authored inline SVG under
  `modules/ROOT/images/graphql-*.svg` only if a spatial figure is genuinely needed — none is currently planned as
  SVG for this section.
- **Cross-links**: sibling GraphQL pages via `xref:backend/graphql/<page>.adoc[...]`; cross-link
  `xref:backend/springboot/spring-data-jpa.adoc[Spring Data JPA]` from the Spring Boot data-loading page rather
  than restating repository basics; cross-link the new section from `data-fetching.adoc` and `rest-apis.adoc`
  (Group 4) rather than duplicating content there.
- Every page must be reachable from both `modules/ROOT/pages/backend/graphql/index.adoc` and `modules/ROOT/nav.adoc`
  once Group 4 lands.
- **Escape literal `{ }` in prose** as `\{ ... }` (the AsciiDoc gotcha above) — this section is unusually
  brace-heavy.
- No tests/coverage/quality gates apply to any task in this plan (Antora/AsciiDoc docs repo, no
  `*-code-one-task` skill matches "AsciiDoc" — tasks are implemented directly rather than dispatched). The
  Antora build (Task 41) is the only automated verification and runs once, last.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/graphql-disclaimer.adoc` — created, mirroring
  `springboot-disclaimer.adoc`/`elasticsearch-disclaimer.adoc`'s structure (no book/"consulted
  references"/"sources below" wording). No tests/coverage/static analysis apply to this AsciiDoc-only repo.
  - [x] Task 1.1. Author it as an `[IMPORTANT]`/`====` admonition mirroring `springboot-disclaimer.adoc` /
    `elasticsearch-disclaimer.adoc`'s structure (three short paragraphs, no book/"consulted references"/"sources
    below" wording anywhere):
    1. States the section documents **the current GraphQL specification (October 2021)**, plus the working
       draft for `@defer`/`@stream`/`@oneOf`, and the **GraphQL-over-HTTP specification**, as published at
       https://graphql.org/learn/ and https://spec.graphql.org/October2021/ — **which are the references these
       pages are written and verified against** — and, for the integration pages, against
       https://docs.spring.io/spring-graphql/reference/[Spring for GraphQL] (2.0.x),
       https://strawberry.rocks/docs[Strawberry], https://ariadnegraphql.org/docs/intro[Ariadne], and the
       client docs for Apollo Client / urql / Relay. No specific patch version is pinned. Some surfaces (Apollo
       Router/managed federation, `graphql-ws` internals, the Relay compiler internals, GraalVM native) are
       linked rather than documented in depth.
    2. The AI-assistance caveat: "This content was generated with the assistance of AI and should be verified
       against the official documentation before being relied on in production, as GraphQL tooling iterates
       quickly."
    3. A pointer: "This section's xref:backend/graphql/index.adoc#_bibliography[bibliography] lists the
       reference material consulted while preparing these pages."
  - [x] Task 1.2. Confirm the include path used everywhere is `include::partial$graphql-disclaimer.adoc[]`
    (Antora `partial$` family resource ID), matching every other section's convention. Verified against the
    existing `include::partial$choosing-a-database-disclaimer.adoc[]` usage in
    `modules/ROOT/pages/database/choosing-the-right-database.adoc`.

### Group 2 — Content pages

**Parallelizable: yes** — 32 independent pages (Tasks 2–33). Each includes the Group 1 disclaimer partial and
follows the Conventions above; none depends on another Group 2 page's final content (only on cross-links to
sibling pages by their already-known, plan-fixed filenames).

**Getting started**

- [x] Task 2. Create `modules/ROOT/pages/backend/graphql/getting-started.adoc`
  - [x] Task 2.1. What GraphQL is (a *query language for APIs* plus a *runtime* for fulfilling queries, defined
    by an open specification, served from a single endpoint), the GraphQL Foundation and the spec (October 2021
    + working draft), the problems it targets vs. REST (over-/under-fetching, request waterfalls, endpoint
    sprawl, weak typing at the boundary), the request/response envelope, and the tooling landscape (GraphiQL,
    Apollo Sandbox, GraphQL Playground, public APIs to experiment against). `[source,graphql]` for a first query,
    `[source,json]` for its response. Link https://graphql.org/learn/[graphql.org/learn] (Introduction) and
    https://spec.graphql.org/October2021/[the October 2021 spec].
  - [x] Task 2.2. **Required diagram**: a `[mermaid]` flowchart of the request lifecycle — parse → validate →
    execute → respond, with the error/`null`-propagation path branching off execution — introduced here and
    cross-referenced (not repeated) from `execution-and-resolvers.adoc` and `response-and-error-handling.adoc`.

**The query language (client-facing)**

- [x] Task 3. Create `modules/ROOT/pages/backend/graphql/queries-and-fields.adoc`
  - [x] Task 3.1. The three operation types (`query`/`mutation`/`subscription`), the operation name, fields and
    nested selection sets, field arguments, aliases, the shape-mirrors-response principle, and comments.
    `[source,graphql]` query + `[source,json]` response pair. Link
    https://graphql.org/learn/queries/[graphql.org/learn/queries].
- [x] Task 4. Create `modules/ROOT/pages/backend/graphql/variables-directives-fragments.adoc`
  - [x] Task 4.1. Query variables and default values; the built-in **executable** directives `@include`/`@skip`;
    named fragments and `...spread`; inline fragments and type conditions on interfaces/unions; `__typename`;
    the incremental-delivery directives `@defer`/`@stream` (working draft, widely implemented, flagged as such).
    `[source,graphql]` for each construct, `[source,json]` for a `@defer` multipart-style response note. Link
    https://graphql.org/learn/queries/[graphql.org/learn/queries] and
    https://spec.graphql.org/draft/[the working draft].
- [x] Task 5. Create `modules/ROOT/pages/backend/graphql/mutations.adoc`
  - [x] Task 5.1. Writing data, single input-object arguments, top-level mutation fields executing **serially**,
    returning the affected object(s) for the client cache, and the "errors as data" mutation payload convention
    (a `union`/`interface` result, or a `userErrors` list). `[source,graphql]` mutation + payload type. Link
    https://graphql.org/learn/mutations/[graphql.org/learn/mutations].
- [x] Task 6. Create `modules/ROOT/pages/backend/graphql/subscriptions.adoc`
  - [x] Task 6.1. Long-lived, event-driven operations; exactly one root field per subscription; the transport
    landscape (`graphql-ws` vs. the legacy `subscriptions-transport-ws`, SSE, multipart over HTTP); the server
    event-stream model; when a subscription beats polling or a plain query. `[source,graphql]` subscription
    operation. Link https://graphql.org/learn/subscriptions/[graphql.org/learn/subscriptions].
  - [x] Task 6.2. Optional `[mermaid]` sequence diagram: a subscription over WebSocket
    (`graphql-ws` `connection_init` → `subscribe` → `next`* → `complete`).
- [x] Task 7. Create `modules/ROOT/pages/backend/graphql/introspection.adoc`
  - [x] Task 7.1. The `__schema`/`__type`/`__typename` meta-fields; what tooling (GraphiQL, codegen, client
    typegen) builds on introspection; why production servers often disable introspection and field suggestions
    (cross-link forward to `security-and-demand-control.adoc` rather than repeating the "why"). `[source,graphql]`
    an introspection query. Link https://graphql.org/learn/introspection/[graphql.org/learn/introspection].

**Designing the schema (server-facing)**

- [x] Task 8. Create `modules/ROOT/pages/backend/graphql/schema-and-type-system.adoc`
  - [x] Task 8.1. The Schema Definition Language, object types and fields, the five built-in scalars (`Int`,
    `Float`, `String`, `Boolean`, `ID`), enums, list and Non-Null (`!`) wrapping types, the special `Query`/
    `Mutation`/`Subscription` root operation types, and descriptions. `[source,graphql]` SDL sample. Link
    https://graphql.org/learn/schema/[graphql.org/learn/schema].
- [x] Task 9. Create `modules/ROOT/pages/backend/graphql/interfaces-unions-and-inputs.adoc`
  - [x] Task 9.1. Interfaces and `implements`; unions and the resolve-type hook; input object types (and
    `@oneOf` input objects, working draft); custom scalars and their `serialize`/`parseValue`/`parseLiteral`
    behaviour; modelling one-to-one/one-to-many/many-to-many relationships and "lists of different types".
    `[source,graphql]` interface/union/input SDL. Link https://graphql.org/learn/schema/[graphql.org/learn/schema]
    and https://spec.graphql.org/draft/[the working draft] (for `@oneOf`).
- [x] Task 10. Create `modules/ROOT/pages/backend/graphql/directives.adoc`
  - [x] Task 10.1. The `@` directive syntax; **type-system (schema) directives** vs. **executable (operation)
    directives** (cross-link back to `variables-directives-fragments.adoc` for the latter); the built-ins
    (`@deprecated`, `@skip`, `@include`, `@specifiedBy`); defining and applying a custom schema directive / SDL
    visitor. `[source,graphql]` directive definition + usage. Link
    https://graphql.org/learn/schema/[graphql.org/learn/schema] (Directives section).
- [x] Task 11. Create `modules/ROOT/pages/backend/graphql/schema-design.adoc`
  - [x] Task 11.1. Schema-first vs. code-first; a deliberate nullability strategy; designing for evolution
    **without versioning** (additive change, `@deprecated`, avoiding breaking renames); naming conventions;
    mutation-payload and pagination-field conventions; not leaking storage/table shape into the graph; a short
    note on schema ownership/governance at scale. `[source,graphql]` before/after evolution example. Link
    https://graphql.org/learn/schema-design/[graphql.org/learn/schema-design] and
    https://graphql.org/learn/best-practices/[Best Practices].

**Execution & operating a server**

- [x] Task 12. Create `modules/ROOT/pages/backend/graphql/execution-and-resolvers.adoc`
  - [x] Task 12.1. The execution phase after parse+validate; the resolver signature
    (`parent`/`source`, `args`, `context`, `info`); default/trivial resolvers; scalar result coercion; root
    fields; `async` resolvers; per-level field execution (parallel for `query`, serial for `Mutation` roots); how
    a thrown resolver error becomes an `errors` entry with `null` propagating to the nearest nullable parent
    (cross-link `response-and-error-handling.adoc`, don't repeat). `[source,graphql]`/pseudocode resolver
    signature. Link https://graphql.org/learn/execution/[graphql.org/learn/execution].
  - [x] Task 12.2. Optional `[mermaid]` diagram: the resolver tree executing over the type graph (breadth-first
    per level, parallel for `query`, serial for `mutation`) — cross-referenced (not repeated) from
    `getting-started.adoc`'s request-lifecycle diagram.
- [x] Task 13. Create `modules/ROOT/pages/backend/graphql/validation.adoc`
  - [x] Task 13.1. The validation phase and its rule families (fields/fragments defined on the right type,
    arguments/input coercion valid, variables declared/used/of the right type, no unused fragments/variables, no
    fragment cycles); where operation limits (depth/complexity) plug in as custom validation rules (cross-link
    forward to `security-and-demand-control.adoc`). `[source,graphql]` an invalid-query example and the
    resulting validation error. Link https://graphql.org/learn/validation/[graphql.org/learn/validation].
- [x] Task 14. Create `modules/ROOT/pages/backend/graphql/response-and-error-handling.adoc`
  - [x] Task 14.1. The `data`/`errors`/`extensions` response shape; partial data; the error object (`message`,
    `locations`, `path`, `extensions`) and error classification; `null` propagation on a Non-Null violation;
    top-level protocol errors vs. domain errors modelled in the schema. `[source,json]` a partial-data response
    with an `errors` entry. Link https://graphql.org/learn/response/[graphql.org/learn/response] and
    https://graphql.org/learn/best-practices/[Best Practices — error handling].
- [x] Task 15. Create `modules/ROOT/pages/backend/graphql/serving-over-http.adoc`
  - [x] Task 15.1. The single `/graphql` endpoint; `GET` vs. `POST`; request parameters (`query`, `variables`,
    `operationName`, `extensions`); response media types (`application/json` vs.
    `application/graphql-response+json`, escaped as `\{...}`-safe prose) and status-code rules; the
    **GraphQL-over-HTTP specification**; request batching; `GET` cacheability; CORS; CSRF-prevention; GraphiQL;
    Automatic Persisted Queries (APQ)/trusted documents on the wire. `[source,http]`/`[source,bash]` cURL
    request/response. Link https://graphql.org/learn/serving-over-http/[graphql.org/learn/serving-over-http] and
    https://graphql.github.io/graphql-over-http/[the GraphQL-over-HTTP spec].
- [x] Task 16. Create `modules/ROOT/pages/backend/graphql/pagination.adoc`
  - [x] Task 16.1. Offset/page-number pagination and its problems; **cursor-based pagination**; the **Relay
    Cursor Connections specification** (`connection { edges { node cursor } } pageInfo { hasNextPage
    hasPreviousPage startCursor endCursor }`, `first`/`after`/`last`/`before`); opaque cursors; total counts.
    `[source,graphql]` a full Connection-shaped query + `[source,json]` response (this concrete JSON/GraphQL
    pair *is* the "Relay Cursor Connections shape" figure the issue suggests — no separate diagram needed per
    Choice 3). Link https://graphql.org/learn/pagination/[graphql.org/learn/pagination] and
    https://relay.dev/graphql/connections.htm[the Relay Cursor Connections spec].
- [x] Task 17. Create `modules/ROOT/pages/backend/graphql/global-object-identification.adoc`
  - [x] Task 17.1. The `Node` interface; globally unique opaque `id`s; the `node(id:)` root field; how clients
    use it for refetching and cache normalization; the Relay Global Object Identification specification.
    `[source,graphql]` `Node` interface + `node(id:)` query. Link
    https://graphql.org/learn/global-object-identification/[graphql.org/learn/global-object-identification].
- [x] Task 18. Create `modules/ROOT/pages/backend/graphql/caching.adoc`
  - [x] Task 18.1. Server-side response caching (parameterized `GET`, CDNs, per-field cache hints); why the
    client normalized cache depends on stable global IDs (cross-link `global-object-identification.adoc`); HTTP
    caching headers; persisted-query identifiers as cache keys. `[source,http]` cache-header example. Link
    https://graphql.org/learn/caching/[graphql.org/learn/caching].
- [x] Task 19. Create `modules/ROOT/pages/backend/graphql/performance-and-n-plus-1.adoc`
  - [x] Task 19.1. The **N+1 problem** in nested resolvers; the **DataLoader** pattern (per-request batching +
    caching); resolver-level lookahead/projections to fetch only requested fields; pushing filters/pagination
    down to the datastore; the cost of deep/wide selections; response compression (gzip/brotli).
    `[source,graphql]` N+1-triggering query + pseudocode batched resolver. Link
    https://graphql.org/learn/performance/[graphql.org/learn/performance] and
    https://github.com/graphql/dataloader[the DataLoader reference implementation].
  - [x] Task 19.2. **Required diagram**: a `[mermaid]` diagram contrasting the naive N+1 resolver call pattern
    against the DataLoader batch-and-cache fix (one dispatched batch load per tick vs. N individual loads).
- [x] Task 20. Create `modules/ROOT/pages/backend/graphql/security-and-demand-control.adoc`
  - [x] Task 20.1. **Demand control**: trusted documents/persisted operations and allowlisting; disabling
    introspection and field suggestions in production (cross-link `introspection.adoc`); enforcing pagination;
    operation **depth** limiting; **breadth/alias/batch** limiting; **query complexity/cost analysis**;
    execution **timeouts**; **rate limiting**; error redaction; the auth-vs-authz boundary (cross-link forward
    to `authorization.adoc`). `[source,graphql]` a deep/aliased query an allowlist or depth limit would reject.
    Link https://graphql.org/learn/security/[graphql.org/learn/security].
- [x] Task 21. Create `modules/ROOT/pages/backend/graphql/authorization.adoc`
  - [x] Task 21.1. Authenticate **before** GraphQL execution and pass the viewer in `context`; enforce
    authorization in the domain/service layer (preferred) or per-field via a policy layer or schema directive;
    per-type vs. per-field checks; why putting authz only in resolvers gets fragile. `[source,graphql]`/pseudocode
    a field-level authorization check. Link
    https://graphql.org/learn/authorization/[graphql.org/learn/authorization].
- [x] Task 22. Create `modules/ROOT/pages/backend/graphql/federation.adoc`
  - [x] Task 22.1. Composing multiple subgraphs into one supergraph; entities and `@key`; reference resolvers;
    the router/gateway; when to choose federation vs. schema stitching vs. a modular single schema (linking
    Apollo Federation and the GraphQL Foundation's Composite Schemas work as "linked, not documented in depth").
    `[source,graphql]` an entity with `@key`. Link https://graphql.org/learn/federation/[graphql.org/learn/federation].
  - [x] Task 22.2. Optional `[mermaid]` diagram: federation supergraph composition (subgraphs + `@key` entities
    → router).

**Spring Boot integration (special emphasis)**

- [x] Task 23. Create `modules/ROOT/pages/backend/graphql/spring-boot-getting-started.adoc`
  - [x] Task 23.1. `spring-boot-starter-graphql`; schema files under `src/main/resources/graphql/**.graphqls`;
    the auto-configured `GraphQlSource`/`ExecutionGraphQlService` and `/graphql` endpoint; enabling GraphiQL; the
    `spring.graphql.*` properties; schema inspection/printing; how Spring for GraphQL sits on top of
    graphql-java. `[source,xml]` the starter dependency, `[source,yaml]` `application.yml` snippet,
    `[source,graphql]` a `.graphqls` schema file. Link
    https://docs.spring.io/spring-graphql/reference/boot-starter.html[Spring for GraphQL — Boot Starter] and
    https://docs.spring.io/spring-graphql/reference/request-execution.html[Request Execution].
  - [x] Task 23.2. Optional `[mermaid]` diagram: the Spring for GraphQL request pipeline (transport →
    `WebGraphQlInterceptor` chain → `ExecutionGraphQlService` → graphql-java → `DataFetcher`/`@SchemaMapping` →
    `BatchLoaderRegistry`).
- [x] Task 24. Create `modules/ROOT/pages/backend/graphql/spring-boot-controllers.adoc`
  - [x] Task 24.1. `@Controller` with `@QueryMapping`/`@MutationMapping`/`@SubscriptionMapping`/`@SchemaMapping`;
    `@Argument` and `@ProjectedPayload` argument binding; `@ContextValue`/`@LocalContextValue`/`Principal`
    parameters; returning `Mono`/`Flux`/`CompletableFuture`/plain values; binding `Sort`/`ScrollSubrange`
    (pagination) arguments. `[source,java]` a `@Controller` class with `@QueryMapping`/`@MutationMapping`
    methods. Link https://docs.spring.io/spring-graphql/reference/controllers.html[Spring for GraphQL —
    Annotated Controllers].
- [x] Task 25. Create `modules/ROOT/pages/backend/graphql/spring-boot-data-loading-and-integration.adoc`
  - [x] Task 25.1. The N+1 fix on the JVM: `@BatchMapping` and `BatchLoaderRegistry`/`DataLoader` registration;
    `@EntityMapping` for federation; the Spring Data integration — auto-registered
    `QuerydslDataFetcher`/`QueryByExampleDataFetcher`, `Window`/`Slice`/keyset pagination, and sorting.
    `[source,java]` a `@BatchMapping` method. Cross-links
    xref:backend/springboot/spring-data-jpa.adoc[Spring Data JPA] rather than restating repository basics. Link
    https://docs.spring.io/spring-graphql/reference/controllers.html#controllers.schema-mapping.batching[Spring
    for GraphQL — Batch Mapping] and https://docs.spring.io/spring-graphql/reference/data.html[Data Integration].
- [x] Task 26. Create `modules/ROOT/pages/backend/graphql/spring-boot-transports-security-and-testing.adoc`
  - [x] Task 26.1. The HTTP/WebSocket/SSE/RSocket server transports and
    `WebGraphQlInterceptor`/`WebSocketGraphQlInterceptor`; CORS and CSRF. `[source,java]` a
    `WebGraphQlInterceptor` bean. Link https://docs.spring.io/spring-graphql/reference/transports.html[Spring for
    GraphQL — Transports].
  - [x] Task 26.2. **Spring Security** integration (`@PreAuthorize` on controller methods, `SecurityContext`
    propagation to `DataLoader`s and to reactive resolvers); exception handling
    (`DataFetcherExceptionResolver`, `@GraphQlExceptionHandler`). `[source,java]` `@PreAuthorize` on a
    `@QueryMapping` method. Link https://docs.spring.io/spring-graphql/reference/security.html[Spring for GraphQL
    — Security].
  - [x] Task 26.3. **`GraphQlTester`** (`ExecutionGraphQlServiceTester`, `HttpGraphQlTester`,
    `WebSocketGraphQlTester`); Micrometer observability; a pointer to GraalVM native support (linked, not
    documented in depth). `[source,java]` a `GraphQlTester` test method. Link
    https://docs.spring.io/spring-graphql/reference/testing.html[Testing],
    https://docs.spring.io/spring-graphql/reference/observability.html[Observability], and
    https://docs.spring.io/spring-graphql/reference/graalvm-native.html[GraalVM Native].

**Python integration (special emphasis)**

- [x] Task 27. Create `modules/ROOT/pages/backend/graphql/python-getting-started.adoc`
  - [x] Task 27.1. The Python GraphQL landscape: `graphql-core` (the reference execution engine both libraries
    build on); code-first **Strawberry** (dataclass/type-hint driven); schema-first **Ariadne** (SDL + resolver
    binding); legacy Graphene (mentioned, not documented); why **Strawberry + FastAPI** is the modern default;
    installing `strawberry-graphql[fastapi]` and running under `uvicorn`. `[source,bash]`
    `pip install "strawberry-graphql[fastapi]"` + `uvicorn` run command. Link
    https://strawberry.rocks/docs[Strawberry docs], https://ariadnegraphql.org/docs/intro[Ariadne docs], and
    https://graphql-core-3.readthedocs.io/[graphql-core].
- [x] Task 28. Create `modules/ROOT/pages/backend/graphql/python-fastapi-strawberry.adoc`
  - [x] Task 28.1. `@strawberry.type`/`@strawberry.field`; the `Query`/`Mutation`/`Subscription` roots; sync and
    `async` resolvers; mounting `GraphQLRouter(schema)` on a `FastAPI` app; the `context_getter` and **injecting
    FastAPI dependencies** (request, DB session, current user) into the resolver `Info.context`; GraphiQL;
    subscriptions over WebSocket/SSE. `[source,python]` a `GraphQLRouter` mounted with a `context_getter`. Link
    https://strawberry.rocks/docs/integrations/fastapi[Strawberry — FastAPI] and
    https://strawberry.rocks/docs/general/subscriptions[Subscriptions].
  - [x] Task 28.2. Optional `[mermaid]` diagram: the FastAPI + Strawberry request path (`GraphQLRouter` →
    `context_getter` with FastAPI deps → schema execute → resolvers → `DataLoader`).
- [x] Task 29. Create `modules/ROOT/pages/backend/graphql/python-strawberry-schema-and-features.adoc`
  - [x] Task 29.1. Scalars/enums/interfaces/unions/generics; input types; `strawberry.Private`; **permissions**
    (`BasePermission`, `field(permission_classes=...)`); **DataLoaders**
    (`strawberry.dataloader.DataLoader`); error handling; **Relay pagination** (`strawberry.relay`); schema
    export/codegen; the mypy plugin. `[source,python]` a `BasePermission` class + a `DataLoader` batch function.
    Link https://strawberry.rocks/docs/guides/permissions[Strawberry — Permissions],
    https://strawberry.rocks/docs/guides/dataloaders[DataLoaders], and
    https://strawberry.rocks/docs/guides/relay[Relay].
- [x] Task 30. Create `modules/ROOT/pages/backend/graphql/python-ariadne-schema-first.adoc`
  - [x] Task 30.1. SDL + `QueryType`/`MutationType`/`ObjectType`/`SubscriptionType` resolver binding;
    `make_executable_schema`; mounting the `GraphQL` ASGI app under FastAPI/Starlette; `context_value`; custom
    scalars; `type_resolver` for unions/interfaces; `snake_case_fallback_resolvers`; error formatting; when
    schema-first is the better fit (an existing SDL contract, non-Python schema owners). `[source,graphql]` SDL
    + `[source,python]` `QueryType`/`make_executable_schema`. Link
    https://ariadnegraphql.org/docs/intro[Ariadne docs] and
    https://ariadnegraphql.org/docs/fastapi-integration[FastAPI integration].

**Configuring clients (special emphasis)**

- [x] Task 31. Create `modules/ROOT/pages/backend/graphql/clients-overview.adoc`
  - [x] Task 31.1. What a GraphQL client adds over raw `fetch` (typed operations, a normalized cache, request
    de-duplication, subscription transport, optimistic updates); the landscape — `fetch`/`graphql-request`,
    **Apollo Client**, **urql**, **Relay**, **TanStack Query + graphql-request**, the JVM **`GraphQlClient`**,
    the Python **`gql`** client; typed operations with **GraphQL Code Generator**. `[source,ts]` a bare `fetch`
    POST vs. a typed client call, side by side. Link
    https://the-guild.dev/graphql/codegen[GraphQL Code Generator].
  - [x] Task 31.2. This is the natural cross-link target from `web/react/data-fetching.adoc` (wired in Group 4,
    Task 39) — write the intro so it stands alone for a reader arriving from that link.
- [x] Task 32. Create `modules/ROOT/pages/backend/graphql/apollo-client-configuration.adoc`
  - [x] Task 32.1. `ApolloClient` + `InMemoryCache`; `HttpLink` (endpoint, headers, credentials); **`ApolloLink`
    chains** (an auth link, `onError` link, `RetryLink`, `BatchHttpLink`); a `split` to a `graphql-ws` link for
    subscriptions; **fetch policies**; `typePolicies`/`keyFields`/field policies and pagination helpers
    (`relayStylePagination`); reading/writing the cache (`cache.modify`, `writeQuery`, `updateQuery`); the
    persisted-queries link; SSR hydration. `[source,ts]` `ApolloClient` construction with a link chain + cache
    config. Link https://www.apollographql.com/docs/react/networking/advanced-http-networking[Apollo Client —
    Networking], https://www.apollographql.com/docs/react/caching/overview[Caching], and
    https://www.apollographql.com/docs/react/pagination/overview[Pagination].
  - [x] Task 32.2. Optional prose/JSON figure (not a diagram, per Choice 3): a normalized cache keyed by
    `__typename` + `id`, showing two queries sharing one cached object.
- [x] Task 33. Create `modules/ROOT/pages/backend/graphql/other-clients.adoc`
  - [x] Task 33.1. **urql** (the exchange pipeline: `fetchExchange`, `subscriptionExchange`, document
    `cacheExchange` vs. the normalized `@urql/exchange-graphcache`, `authExchange`, `retryExchange`).
    `[source,ts]` a `createClient` exchange pipeline. Link
    https://commerce.nearform.com/open-source/urql/docs/[urql docs].
  - [x] Task 33.2. **Relay** (the compiler, the store, `usePreloadedQuery`/fragments, `@connection` and
    pagination). `[source,ts]` a `usePreloadedQuery` component sketch. Link https://relay.dev/docs/[Relay docs].
  - [x] Task 33.3. The JVM **`HttpGraphQlClient`/`WebSocketGraphQlClient`/`RSocketGraphQlClient`**; the Python
    **`gql`** client with its transports; a short "how to choose" closing comparison across all clients covered
    in this group. `[source,java]` `HttpGraphQlClient.builder()...build()`, `[source,python]` a `gql` `Client`.
    Link https://docs.spring.io/spring-graphql/reference/client.html[Spring for GraphQL — Client] and
    https://github.com/graphql-python/gql[the `gql` client].

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 35 renders the PDF that Task 34's page links, and Task 34's back-links reference
the Group 2 page titles. Depends on Group 2.

- [x] Task 34. Create `modules/ROOT/pages/backend/graphql/cheat-sheet.adoc`
  - [x] Task 34.1. Header (`= GraphQL Cheat Sheet`, `:description:`, `:keywords:`) +
    `include::partial$graphql-disclaimer.adoc[]` + a short intro sentence, then grouped `xref:` back-links to
    every Group 2 page (grouped as in the section index — Getting started / Query language / Schema design /
    Execution & operating / Spring Boot / Python / Configuring clients), modelled on
    `modules/ROOT/pages/database/elasticsearch/cheat-sheet.adoc`.
  - [x] Task 34.2. End with `xref:attachment$graphql-cheat-sheet.pdf[Download the GraphQL Cheat Sheet (PDF)]`.
    **No mention of either book** (all bibliography lives in `index.adoc`).
- [x] Task 35. Build `modules/ROOT/attachments/graphql-cheat-sheet.pdf`
  - [x] Task 35.1. In a scratch location (not the repo), hand-build a print-ready single-page HTML/CSS layout —
    colour-coded boxes summarising: the query/mutation/subscription shape and the `data`/`errors` envelope; the
    SDL essentials (types, scalars, enums, `!`/`[]`, interfaces/unions/inputs); the execution model (resolver
    signature, parallel query vs. serial mutation, `null` propagation); serving over HTTP (`POST` body shape,
    media types, status-code rules); Relay Cursor Connections (`edges { node cursor } pageInfo {...}`); the
    N+1 → DataLoader batching fix; the security/demand-control checklist (depth, complexity, timeouts, trusted
    documents); the Spring for GraphQL essentials (`@QueryMapping`/`@MutationMapping`/`@BatchMapping`,
    `spring.graphql.*`); the Strawberry/FastAPI essentials (`GraphQLRouter`, `context_getter`, `DataLoader`); and
    the client essentials (Apollo `InMemoryCache`/`ApolloLink`, urql exchanges, the JVM `GraphQlClient`).
  - [x] Task 35.2. Render to PDF with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
    verify it is **exactly one A4 page** (page-count check) and a rendered preview shows no clipping, then copy
    the PDF to `modules/ROOT/attachments/graphql-cheat-sheet.pdf`. Do **not** check in the HTML source.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 36–40 each edit a shared wiring file (or a file `data-fetching.adoc`/`rest-apis.adoc`
Group 2 pages link into) and Task 41 builds on all prior groups; the build must run last.

- [x] Task 36. Create `modules/ROOT/pages/backend/graphql/index.adoc`
  - [x] Task 36.1. Header (`= GraphQL Reference`, `:description:`, `:keywords:` mentioning GraphQL, Spring for
    GraphQL, Strawberry, FastAPI, Apollo Client, urql, Relay) + `include::partial$graphql-disclaimer.adoc[]` + a
    lead paragraph introducing GraphQL (a query language and runtime for APIs, defined by an open specification)
    and pointing new readers to `getting-started.adoc` → `queries-and-fields.adoc` →
    `schema-and-type-system.adoc` → `execution-and-resolvers.adoc` first; a short line pointing to the sibling
    `xref:backend/hibernate/index.adoc[Hibernate Reference]` and `xref:backend/springboot/index.adoc[SpringBoot
    Reference]` for the REST/gRPC/ORM baselines this section is used alongside.
  - [x] Task 36.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped exactly as in
    the "Proposed page structure" of issue #86: *Getting started* (getting-started); *The query language*
    (queries-and-fields, variables-directives-fragments, mutations, subscriptions, introspection); *Designing
    the schema* (schema-and-type-system, interfaces-unions-and-inputs, directives, schema-design); *Execution &
    operating a server* (execution-and-resolvers, validation, response-and-error-handling, serving-over-http,
    pagination, global-object-identification, caching, performance-and-n-plus-1, security-and-demand-control,
    authorization, federation); *Spring Boot integration* (spring-boot-getting-started, spring-boot-controllers,
    spring-boot-data-loading-and-integration, spring-boot-transports-security-and-testing); *Python integration*
    (python-getting-started, python-fastapi-strawberry, python-strawberry-schema-and-features,
    python-ariadne-schema-first); *Configuring clients* (clients-overview, apollo-client-configuration,
    other-clients); *Cheat sheet*.
  - [x] Task 36.3. `== Bibliography` — **the only place any source is named.** List, structured like
    `database/elasticsearch/index.adoc`'s bibliography:
    - **Specifications & official documentation (primary source for every page)**: https://graphql.org/learn/
      with its per-topic sub-pages (queries, mutations, subscriptions, schema, schema-design, execution,
      validation, introspection, response, serving-over-http, authorization, pagination,
      global-object-identification, caching, performance, security, federation, best-practices);
      https://spec.graphql.org/October2021/[the October 2021 spec] and
      https://spec.graphql.org/draft/[the working draft]; https://graphql.github.io/graphql-over-http/[the
      GraphQL-over-HTTP spec]; https://relay.dev/graphql/connections.htm[the Relay Cursor Connections spec];
      https://graphql.org/foundation/[the GraphQL Foundation].
    - **Framework & client documentation (primary source for the integration pages)**:
      https://docs.spring.io/spring-graphql/reference/[Spring for GraphQL] (controllers, request-execution,
      data, transports, security, testing, observability, federation, client) and
      https://docs.spring.io/spring-boot/reference/web/spring-graphql.html[Spring Boot's GraphQL support];
      https://strawberry.rocks/docs[Strawberry] (FastAPI, subscriptions, permissions, dataloaders, relay);
      https://ariadnegraphql.org/docs/intro[Ariadne] (FastAPI integration, ASGI);
      https://graphql-core-3.readthedocs.io/[graphql-core]; https://graphql-java.com/documentation/[graphql-java];
      https://www.apollographql.com/docs/react/[Apollo Client] (networking, caching, pagination);
      https://commerce.nearform.com/open-source/urql/docs/[urql]; https://relay.dev/docs/[Relay];
      https://github.com/graphql-python/gql[the Python `gql` client];
      https://the-guild.dev/graphql/codegen[GraphQL Code Generator];
      https://github.com/graphql/dataloader[the DataLoader pattern].
    - **Consulted reference books (bibliography only — not the primary or main source for any page)**: Porcello,
      Eve; Banks, Alex. *Learning GraphQL: Declarative Data Fetching for Modern Web Apps*. O'Reilly Media, 2018.
      ISBN 978-1-492-03071-3 — its code targets the 2018 JavaScript ecosystem (`apollo-server` 2.x,
      `react-apollo`, `subscriptions-transport-ws`) and does not cover Spring Boot, Python, the
      GraphQL-over-HTTP spec, `@defer`/`@stream`, `@oneOf`, trusted documents, `graphql-ws`, or modern
      federation, so where it and the official documentation disagree the official documentation is
      authoritative and the difference is noted; publisher page:
      https://www.oreilly.com/library/view/learning-graphql/9781492030706/. Buna, Samer. *Learning GraphQL and
      Relay*. Packt Publishing, 2016. ISBN 978-1-78646-575-7 — its code targets 2016-era `graphql` ~0.6 and
      Relay Classic, so only its language-agnostic material (query language, type system, the `resolve`
      function, object identification, the connection model) informs this section and its Relay-Classic
      chapters are treated as superseded background; publisher page:
      https://www.packtpub.com/en-us/product/learning-graphql-and-relay-9781786465757. A closing sentence: both
      books are consulted bibliography references only, are **not** the primary reference for any page, and the
      official GraphQL specification/documentation wins on any discrepancy.
- [x] Task 37. Wire `modules/ROOT/nav.adoc`
  - [x] Task 37.1. Insert a `*** xref:backend/graphql/index.adoc[GraphQL Reference]` block with one `****` line
    per page **in the section-index order** from Task 36.2, **after** the SpringBoot Reference block's
    `**** xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]` line (currently `nav.adoc:536`) and
    **before** `** xref:apps/index.adoc[Apps]` (currently `nav.adoc:537`) — re-verify these exact line numbers
    at implementation time in case Group 2/3 tasks or an intervening merge shifted them. Page order:
    getting-started, queries-and-fields, variables-directives-fragments, mutations, subscriptions, introspection,
    schema-and-type-system, interfaces-unions-and-inputs, directives, schema-design, execution-and-resolvers,
    validation, response-and-error-handling, serving-over-http, pagination, global-object-identification,
    caching, performance-and-n-plus-1, security-and-demand-control, authorization, federation,
    spring-boot-getting-started, spring-boot-controllers, spring-boot-data-loading-and-integration,
    spring-boot-transports-security-and-testing, python-getting-started, python-fastapi-strawberry,
    python-strawberry-schema-and-features, python-ariadne-schema-first, clients-overview,
    apollo-client-configuration, other-clients, then
    `**** xref:backend/graphql/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use short link labels mirroring each page's
    `=` title (e.g. `[Getting Started]`, `[Queries & Fields]`, `[Variables, Directives & Fragments]`,
    `[Mutations]`, `[Subscriptions]`, `[Introspection]`, `[Schema & Type System]`,
    `[Interfaces, Unions & Inputs]`, `[Directives]`, `[Schema Design]`, `[Execution & Resolvers]`, `[Validation]`,
    `[Response & Error Handling]`, `[Serving Over HTTP]`, `[Pagination]`, `[Global Object Identification]`,
    `[Caching]`, `[Performance & the N+1 Problem]`, `[Security & Demand Control]`, `[Authorization]`,
    `[Federation]`, `[Spring Boot: Getting Started]`, `[Spring Boot: Controllers]`,
    `[Spring Boot: Data Loading & Integration]`, `[Spring Boot: Transports, Security & Testing]`,
    `[Python: Getting Started]`, `[Python: FastAPI & Strawberry]`, `[Python: Strawberry Schema & Features]`,
    `[Python: Ariadne (Schema-First)]`, `[Configuring Clients: Overview]`, `[Apollo Client Configuration]`,
    `[Other Clients (urql, Relay, JVM, gql)]`, `[Cheat Sheet (PDF)]`).
  - [x] Task 37.2. If issue #82 (Spring Batch Reference) has merged onto `main` by the time this task runs,
    place the new GraphQL block **after** the Spring Batch Reference block instead (per the issue: "the relative
    order of the two new sibling sections is not important"); otherwise the placement in Task 37.1 stands.
- [x] Task 38. Update `modules/ROOT/pages/backend/index.adoc`
  - [x] Task 38.1. Add a `== Sections` bullet after the SpringBoot Reference one:
    `xref:backend/graphql/index.adoc[GraphQL Reference] -- GraphQL as a query language and runtime: the schema
    and type system, execution and resolvers, pagination, security and demand control, and federation, with
    dedicated Spring for GraphQL (Java) and Strawberry/Ariadne (Python/FastAPI) integration coverage plus
    configuring Apollo Client, urql, Relay and other clients, and a downloadable cheat sheet.`
  - [x] Task 38.2. Extend the page `:description:` and `:keywords:` to mention GraphQL, Spring for GraphQL,
    Strawberry, FastAPI, and Apollo Client.
- [x] Task 39. Update `modules/ROOT/pages/web/react/data-fetching.adoc`
  - [x] Task 39.1. In the `== GraphQL and framework loading` section (currently around line 66), add one
    sentence with an `xref:backend/graphql/clients-overview.adoc[GraphQL Reference: configuring clients]` link
    (e.g. "For a deeper reference on configuring these clients -- Apollo Client, urql and Relay -- see
    xref:backend/graphql/clients-overview.adoc[GraphQL Reference: configuring clients]."). Do not restate the
    new section's content.
- [x] Task 40. Update `modules/ROOT/pages/backend/springboot/rest-apis.adoc` (and optionally
  `modules/ROOT/pages/backend/springboot/index.adoc`)
  - [x] Task 40.1. In `rest-apis.adoc`, add a short "GraphQL is covered separately" pointer directly under the
    `include::partial$springboot-disclaimer.adoc[]` line and before the "Spring MVC: annotated REST controllers"
    heading, e.g. "GraphQL is covered in its own xref:backend/graphql/index.adoc[GraphQL Reference] rather than
    as a REST/gRPC alternative here." One link, no content duplication.
  - [x] Task 40.2. Optionally add the same pointer to `modules/ROOT/pages/backend/springboot/index.adoc` where
    it lists the REST/gRPC API pages, if it reads naturally alongside the existing text.
- [x] Task 41. Build & verify
  - [x] Task 41.1. Run `npx antora antora-playbook.yml` via an isolated sub-agent (`Agent({description: "Build
    Antora site", subagent_type: "iru-gate-runner", prompt: "Run 'npx antora antora-playbook.yml' in this repo
    and report back only: whether the build succeeded, and the full text of any xref/AsciiDoc/missing-image/
    Mermaid error or 'skipping reference to missing attribute' warning it produced."})`) to keep the build log
    out of the main context. Fix any `xref`/AsciiDoc/missing-image/Mermaid errors and any "skipping reference to
    missing attribute" warnings (unescaped `{ }` in prose) introduced by the new pages until the build completes
    clean, re-running the same delegated build after each fix.
  - [x] Task 41.2. Confirm every new page is reachable from both
    `modules/ROOT/pages/backend/graphql/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/backend/graphql/...` HTML renders (spot-check a page with a `[mermaid]` diagram, e.g.
    `getting-started.adoc` or `performance-and-n-plus-1.adoc`), and that
    `xref:attachment$graphql-cheat-sheet.pdf` resolves to the checked-in PDF.
  - [x] Task 41.3. Re-open `modules/ROOT/attachments/graphql-cheat-sheet.pdf` and confirm it is a single A4 page
    with no clipped content.
  - [x] Task 41.4. Grep every new page under `modules/ROOT/pages/backend/graphql/` and the new
    `graphql-disclaimer.adoc` partial for any admonition (`[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`,
    `[CAUTION]`) and confirm none names *Learning GraphQL*, *Learning GraphQL and Relay*, "the book(s)",
    "consulted", or "the sources" — all source attribution must be in `index.adoc`'s `== Bibliography` only.
