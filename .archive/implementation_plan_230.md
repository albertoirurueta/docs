# Implementation Plan: Guides & References / Backend Development — "NestJS"

## Task summary

Source: GitHub issue #230
Base branch: main

Issue [#230](https://github.com/albertoirurueta/docs/issues/230) adds a **NestJS** section to Backend Development at
`modules/ROOT/pages/backend/nestjs/`: a practical, example-driven guide to NestJS 12 (Node.js, TypeScript, Express 5 /
Fastify 5), written from the **official documentation**, with the requester's Packt book (*Scalable Application
Development with NestJS*, Linjanja, 2025, `~/Desktop/nestjs.pdf`) as a consulted reference for concept narrative and
structure only. It also keeps the issue's original request as a page that distinguishes NestJS (backend) from Next.js
(React SSR), and links the existing TypeScript Reference from Backend Development.

The section ships:

* 66 files: `index.adoc` (with `== Bibliography`), 64 concept pages (including `nestjs-vs-nextjs.adoc`), `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/nestjs-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/nestjs-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/nestjs-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc` (TypeScript Reference include + NestJS block), the
  `partials/nav-typescript.adoc` comment, `backend/index.adoc` bullets/description/keywords, root `index.adoc`
  description/keywords, and four back-links

The issue body is the binding spec: its "Page outline", "New nav placement", "Cheat sheet", "Bibliography" and
"Acceptance criteria" sections. Every page task must re-read its page's bullets (`gh issue view 230`) and cover
**every** bullet.

**Out of scope:** re-documenting existing material (TypeScript/JavaScript language, GraphQL theory, OAuth theory,
Docker, Kubernetes, engine references — link instead); #196/#184/#201/#156 in prose only.

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into 4 PRs; as with #199, this run implements everything
   on `feature/230` and opens a single draft PR to `main` with `Closes #230`.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet` and
   `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly. TypeScript code in
   pages is illustrative content, but every example must be built and run in a scratch NestJS project (Task 3.5).
3. **The book appears only in `== Bibliography`** (full data, Packt publisher page, companion repo). It is never copied,
   quoted or committed; where a page touches a book concept it says in prose where the book is outdated.
4. **Disclaimer:** `partials/nestjs-disclaimer.adoc` is a single `[IMPORTANT]` block (AI-assistance disclosure + `xref:backend/nestjs/index.adoc#_bibliography[…]`). No other admonition in the section; deprecations, pre-1.0 status, security caveats and "book is outdated" remarks are prose or table rows.
5. **Version baseline re-verified at implementation time and dated** (Group 1). The issue's numbers (NestJS 12.1.2, TypeScript 6.0, Express 5.2, Fastify 5, Node 20.19+/22.12+) were checked 2026-10-02 and are re-verified, not copied. The docs were restructured in Sep 2026: only post-restructure URLs (`/application/*`, `/data/*`, `/http/*`, `/security/*`, `/reliability/*`, `/observability/*`) are used.
6. **Running scenario is the original *Bookshelf*** (books/authors/reviews over REST + GraphQL, users and policies, cover uploads, SSE feed, WebSocket chat per book, `notifications` microservice, BullMQ, PostgreSQL/TypeORM with Prisma/Drizzle variants, MongoDB activity feed, Redis cache); pages build on each other.
7. **Existing pages get real `xref:`s; not-yet-existing ones stay plain prose.** Every `xref:` target outside the section is verified to exist (`ls`) before it is written. Links between pages of the new section are allowed because the whole section lands in the same PR; they are verified by the final build (Group 15). `index.adoc` and `cheat-sheet.adoc` are written last (Group 13) since they link every page.
8. **Pre-1.0 `@nestjs/*` packages** (authentication, authorization, http-client, i18n, mail, storage, drizzle, webhooks, resilience, idempotency, outbox, workflows, locks, observe) are documented as such in prose, with the established alternative shown where one exists.
9. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `nestjs-*.svg`; more where they clarify. SVGs are original drawings (no NestJS logo, docs images or book figures).

### Lessons from the earlier section reviews (#198, #199 and siblings) — mandatory for every page task

**Verify every name against its official page before writing it** (every class, decorator, function, option, CLI flag,
env var, import path, package name and version number); if the docs don't confirm a detail, describe the behaviour
without naming it. **Security is correctness:** no hardcoded secrets (JWT/cookie secrets come from `ConfigService`;
`openssl rand -hex 32`), destructive examples show auth. **Every concept gets at least one code example**, each
followed by a `Source:` link, and the URL goes in `== References`. **Run the examples** in the Group 1 scratch project.
**URL hygiene:** canonical URLs only, post-restructure docs URLs. **Cross-links accurate:** never `xref:` to a
non-existent page; no `xref:` inside backticks; no empty link text on a fragment xref. **AsciiDoc hygiene:** `.Title`
captions; no leaked authoring notes; `{placeholders}` literal inside `[source]` blocks and escaped in prose; no prose
line starting with `<digits>.`. **Never reproduce the book's errors** (listed in the issue's "Errata" bullet).

## Current code state

* **Repo:** Antora root component (`antora.yml`); pages in `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`,
  partials in `modules/ROOT/partials/`, images in `modules/ROOT/images/`, PDFs in `modules/ROOT/attachments/`.
  `backend/nestjs/`, `nestjs-disclaimer.adoc`, `nestjs-*.svg` and `nestjs-cheat-sheet.pdf` do not exist.
* **`modules/ROOT/nav.adoc`:** `** xref:backend/index.adoc[Backend Development]` (~line 574) followed by
  `include::partial$nav-java.adoc[]`, `include::partial$nav-python.adoc[]` and the `*** …[Python FastAPI]` block whose
  last child is `**** xref:backend/fastapi/cheat-sheet.adoc[Cheat Sheet (PDF)]`; then `*** …[Hibernate Reference]`.
  `partials/nav-typescript.adoc` is included under Programming Languages (~line 28) and Web Development (~line 510).
* **`modules/ROOT/partials/nav-typescript.adoc`:** header comment names only two usage sites (same shape `nav-python.adoc`
  had before #199).
* **`modules/ROOT/pages/backend/index.adoc`:** `== Sections` bullet list (Java, Python, FastAPI, Hibernate, …); long
  `:description:` / `:keywords:`.
* **Back-link targets:** `programming-languages/typescript/index.adoc` (NestJS mentioned ~line 108),
  `programming-languages/typescript/decorators-and-metadata.adoc` (NestJS mentioned lines 2–3, 176, 232, 243),
  `backend/graphql/index.adoc`, and `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`
  ("Backend framework" table ~lines 359–381, with a `| Python / FastAPI` row).
* **Templates:** `partials/fastapi-disclaimer.adoc`; `backend/fastapi/cheat-sheet.adoc` and `attachments/fastapi-cheat-sheet.pdf`;
  `images/fastapi-*.svg` (five original SVGs); precedents `.archive/implementation_plan_199.md` (closest), `_162`, `_168`.
* **Tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`), the
  `iru-build-docs` skill, headless Chrome and `pdfinfo` for the PDF.

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, blank line,
  `include::partial$nestjs-disclaimer.adoc[]`.
* **Lead paragraph** states the versions written against (NestJS 12.1, Node.js, TypeScript 6, Express 5 / Fastify 5),
  dated.
* **Content:** what/why, how NestJS implements it (Nest core vs platform/library), every relevant option/decorator/API,
  position in the request lifecycle, Express vs Fastify differences, pitfalls, recent changes with versions and
  pre-1.0 status, where the book is outdated. Strict-mode TypeScript, the current ESM template (CommonJS differences
  noted where they matter), current package names; requests with `curl` (`[source,bash]`) and responses
  (`[source,json]`), `nest` commands in `[source,bash]`.
* **Page ending:** `== References` listing only official docs (and the book's publisher page where used).

## Implementation steps


### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/nestjs-disclaimer.adoc`.
  - [x] Task 1.1. Copy the shape of `partials/fastapi-disclaimer.adoc` (single `[IMPORTANT]` block): the AI-assistance disclosure only ("This content was generated with the assistance of AI and should be verified against the official documentation before being relied on in production") plus a pointer to `xref:backend/nestjs/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear anywhere under `backend/nestjs/`.
- [x] Task 2. Update the comment at the top of `modules/ROOT/partials/nav-typescript.adoc`.
  - [x] Task 2.1. List all three usage sites (Programming Languages, Web Development, Backend Development), mirroring `partials/nav-python.adoc`'s comment; leave the nav entries untouched.
- [x] Task 3. Verify and record the version baseline (scratchpad `230/versions-230.md`) that every later task cites.
  - [x] Task 3.1. Read current releases from npm (`@nestjs/core`, `@nestjs/cli`, `@nestjs/graphql`, `@nestjs/swagger`, `@nestjs/config`, `@nestjs/typeorm`, `@nestjs/mongoose`, `@nestjs/cache-manager`, `@nestjs/terminus`, `@nestjs/cqrs`, `@nestjs/throttler`, `@nestjs/bullmq`, `@nestjs/microservices`, `@nestjs/websockets`, `typescript`, `express`, `fastify`, `rxjs`, `vitest`, `jest`, `typeorm`, `prisma`, `drizzle-orm`, `mongoose`, and every pre-1.0 `@nestjs/*` package named in the issue) and the GitHub release notes; state the date. The issue's numbers (NestJS 12.1.2, CLI 12.0.8, TypeScript 6.0, Express 5, Fastify 5, Node 20.19+/22.12+) are re-verified, not copied.
  - [x] Task 3.2. Re-verify every version-tagged claim in the issue's "Where the book is outdated" / "New since the book" lists against https://docs.nestjs.com/migration-guide and the v8–v12.1 release notes; record deviations and dates for `whats-changed-and-migration.adoc`.
  - [x] Task 3.3. Re-fetch the docs sidebar (`https://github.com/nestjs/docs.nestjs.com`, `src/app/shared/nav/nav-items.ts`) and diff it against the issue's inventory; add any page that appeared since 2026-10-02 to the matching page task and record the new/changed URLs.
  - [x] Task 3.4. `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}'` every URL in the issue's Bibliography; record canonical forms and 404s (Packt/oreilly answer 403 to automated fetches, expected; re-confirm the Packt product URL by search).
  - [x] Task 3.5. Create a throw-away scratch project in the scratchpad (`nest new` ESM + a CommonJS variant, Node 22/24, `npm ci`) with every package the pages need (config, TypeORM + `better-sqlite3`, Mongoose + `mongodb-memory-server`, cache-manager, BullMQ mocks, swagger, graphql + apollo, websockets + socket.io, microservices, cqrs, terminus, throttler, Vitest, supertest) so each example is built and run (`Test.createTestingModule`, supertest, `curl`) before being pasted. Never commit it.
  - [x] Task 3.6. Check the book PDF is only consulted for narrative (never copied) and is never staged: `git status` must never list `nestjs.pdf`.

### Group 2 — Foundations pages

**Parallelizable: yes (five independent pages; `index.adoc` is written in Group 13)**

- [x] Task 4. Create `nestjs-vs-nextjs.adoc` ("NestJS vs Next.js").
  - [x] Task 4.1. Header per "Conventions" (`= NestJS vs Next.js`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 4.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): NestJS = server-side Node framework (Angular-inspired, Express/Fastify) vs Next.js = Vercel's React SSR/SSG/full-stack framework; side-by-side table (purpose, rendering, routing, DI, data layer, runtime, deployment); how they combine (Next.js front end/BFF → NestJS API, shared types or OpenAPI/GraphQL clients); when route handlers/server actions suffice vs a separate backend; link https://nestjs.com, https://nextjs.org and `web/react/server-rendering.adoc`.
  - [x] Task 4.3. Figure: Mermaid of Next.js front end → NestJS API → database.
  - [x] Task 4.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 5. Create `introduction-and-architecture.adoc` ("Introduction & Architecture").
  - [x] Task 5.1. Header per "Conventions" (`= Introduction & Architecture`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 5.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): philosophy (Angular-inspired architecture for Node; OOP/FP/FRP); building blocks and the platform layer (Express vs Fastify adapters); application types (HTTP, microservice, hybrid, standalone); framework comparison table (Express, Fastify, Koa, hapi, AdonisJS, Hono) with xrefs to `backend/fastapi/*`, `backend/springboot/rest-apis.adoc`, `backend/quarkus/*` (verify targets exist); history and versioning/support policy v10 → v12.
  - [x] Task 5.3. Figure: SVG `modules/ROOT/images/nestjs-layer-stack.svg` (Node.js → platform adapter → Nest core/DI container → modules → your code).
  - [x] Task 5.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 6. Create `getting-started-and-cli.adoc` ("Getting Started & CLI") ★.
  - [x] Task 6.1. Header per "Conventions" (`= Getting Started & CLI`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 6.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): Node requirements, `npm i -g @nestjs/cli`, `nest new` (ESM vs CommonJS, package manager, strict mode) and generated files, `main.ts`/`NestFactory.create`, `start*` scripts, CLI commands (`generate` with every schematic and alias, `nest g resource`, `build`, `start`, `add`, `info`, `upgrade --dry-run`, `deploy`), `nest-cli.json` `compilerOptions`, builders (`tsc`/`swc`/`rspack`, SWC type checking), hot reload, IDE debugging.
  - [x] Task 6.3. Figure: Mermaid of the dev loop.
  - [x] Task 6.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 7. Create `typescript-for-nestjs.adoc` ("TypeScript for NestJS").
  - [x] Task 7.1. Header per "Conventions" (`= TypeScript for NestJS`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 7.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): legacy decorators vs Stage 3, `emitDecoratorMetadata` + `reflect-metadata` and how constructor types become DI tokens, classes vs interfaces as DTOs/tokens, ESM `.js` import extensions under `nodenext`, strict-mode implications; xref `programming-languages/typescript/decorators-and-metadata.adoc` and `tsconfig-and-compiler-options.adoc`.
  - [x] Task 7.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 8. Create `project-structure-and-workspaces.adoc` ("Project Structure & Workspaces").
  - [x] Task 8.1. Header per "Conventions" (`= Project Structure & Workspaces`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 8.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): feature-module folders and naming, standard vs monorepo mode (`nest g app`, `nest g library`, `@app/*` aliases, `projects`, `--parallel`, `includeLibraryAssets`), layering inside a module, the final *Bookshelf* layout; xref `backend/architecture/*`.
  - [x] Task 8.3. Figure: SVG `nestjs-bookshelf-layout.svg` or a Mermaid tree of the monorepo.
  - [x] Task 8.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 3 — Building blocks pages

**Parallelizable: yes (ten independent pages)**

- [x] Task 9. Create `modules.adoc` ("Modules") ★.
  - [x] Task 9.1. Header per "Conventions" (`= Modules`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 9.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@Module` options, feature/shared/re-exported modules, `@Global()` and its misuse, encapsulation rules, intro to dynamic modules, `RouterModule` prefixes.
  - [x] Task 9.3. Figure: Mermaid of the *Bookshelf* module graph.
  - [x] Task 9.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 10. Create `controllers-and-routing.adoc` ("Controllers & Routing") ★.
  - [x] Task 10.1. Header per "Conventions" (`= Controllers & Routing`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 10.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): HTTP verb decorators (`@Search`, `@All`, 11.2 `QUERY`), Express 5/path-to-regexp v8 syntax (`*splat`, `{*splat}`, `{…}`), v12 route conflicts and resolution order, parameter decorators, `@HttpCode`/`@Header`/`@Redirect`, sub-domain routing, async/Observables, DTOs, `@Res()` + `passthrough`, `simple` vs `extended` query parser.
  - [x] Task 10.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 11. Create `providers-and-dependency-injection.adoc` ("Providers & Dependency Injection") ★.
  - [x] Task 11.1. Header per "Conventions" (`= Providers & Dependency Injection`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 11.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@Injectable`, constructor injection, DI container and tokens, `@Optional` (v12 inheritance change), property injection, custom providers (`useValue`/`useClass`/`useFactory` + `inject`/`useExisting`, string and symbol tokens, `@Inject`), exporting custom providers, async providers, manual instantiation, singleton/factory patterns.
  - [x] Task 11.3. Figure: Mermaid of the injector resolving a dependency graph.
  - [x] Task 11.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 12. Create `middleware.adoc` ("Middleware").
  - [x] Task 12.1. Header per "Conventions" (`= Middleware`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 12.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): class and functional middleware, `MiddlewareConsumer.apply().exclude().forRoutes()` with `RequestMethod` and named wildcards, multiple/global middleware and the DI caveat, v11 global-module ordering, Fastify `@fastify/middie`.
  - [x] Task 12.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 13. Create `exception-filters-and-error-handling.adoc` ("Exception Filters & Error Handling") ★.
  - [x] Task 13.1. Header per "Conventions" (`= Exception Filters & Error Handling`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 13.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `HttpException` (`cause`, `description`, v12 `errorCode`), built-in exceptions, `IntrinsicException`, `@Catch`/`ArgumentsHost`/`@UseFilters`, scopes and `APP_FILTER`, catch-all with `HttpAdapterHost`, `BaseExceptionFilter`, mapping domain errors to HTTP (not 200 as in the book), RFC 9457 problem details.
  - [x] Task 13.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 14. Create `pipes-and-validation.adoc` ("Pipes & Validation") ★.
  - [x] Task 14.1. Header per "Conventions" (`= Pipes & Validation`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 14.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `PipeTransform`/generic `ArgumentMetadata`, every built-in pipe, binding scopes, `ValidationPipe` with class-validator/class-transformer (`whitelist`, `forbidNonWhitelisted`, `transform`, implicit conversion, `errorFormat`, `disableErrorMessages`, nested `@Type`, custom validators, mapped types), Standard Schema validation (`StandardSchemaValidationPipe`, `@Body({ schema })`, Zod/Valibot/ArkType), custom pipes, comparison table.
  - [x] Task 14.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 15. Create `guards.adoc` ("Guards").
  - [x] Task 15.1. Header per "Conventions" (`= Guards`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 15.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `CanActivate`/`ExecutionContext`, role guards with `Reflector.createDecorator()` and `SetMetadata`, `@UseGuards`/`APP_GUARD`, global guards with `@Public()`, guards vs middleware.
  - [x] Task 15.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 16. Create `interceptors.adoc` ("Interceptors").
  - [x] Task 16.1. Header per "Conventions" (`= Interceptors`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 16.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `NestInterceptor`/`CallHandler`, AOP, binding scopes and `APP_INTERCEPTOR`, response mapping, exception mapping, stream overriding (caching), RxJS `timeout`, logging/timing, the registered-twice double-wrapping pitfall.
  - [x] Task 16.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 17. Create `custom-decorators.adoc` ("Custom Decorators").
  - [x] Task 17.1. Header per "Conventions" (`= Custom Decorators`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 17.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `createParamDecorator` (`@CurrentUser()`), passing data, pipes on custom decorators (`validateCustomDecorators`), `applyDecorators`, `Reflector.createDecorator`/`DiscoveryService.createDecorator` cross-links.
  - [x] Task 17.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 18. Create `request-lifecycle.adoc` ("Request Lifecycle") ★.
  - [x] Task 18.1. Header per "Conventions" (`= Request Lifecycle`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 18.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): order of execution (middleware global→module, guards, interceptors before, pipes, handler, interceptors after, filters), how each enhancer is bound/scoped and which support DI.
  - [x] Task 18.3. Figure: SVG `nestjs-request-lifecycle.svg` or Mermaid sequence of a request through the lifecycle (central figure of the section).
  - [x] Task 18.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).

### Group 4 — Fundamentals pages

**Parallelizable: yes (six independent pages)**

- [x] Task 19. Create `dynamic-modules.adoc` ("Dynamic Modules") ★.
  - [x] Task 19.1. Header per "Conventions" (`= Dynamic Modules`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 19.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): static vs dynamic modules, `forRoot`/`register`/`forFeature`, `DynamicModule`, async options (`useFactory`/`useClass`/`useExisting`), `ConfigurableModuleBuilder` (`setClassMethodName`, `setFactoryMethodName`, `setExtras`, extending generated methods), a *Bookshelf* example module.
  - [x] Task 19.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 20. Create `injection-scopes.adoc` ("Injection Scopes").
  - [x] Task 20.1. Header per "Conventions" (`= Injection Scopes`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 20.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `DEFAULT`/`REQUEST`/`TRANSIENT`, controller scope, scope bubbling, `REQUEST` and `INQUIRER` tokens, performance impact, durable providers (`ContextIdStrategy`), request scope in microservices/gateways/resolvers.
  - [x] Task 20.3. Figure: Mermaid of scope bubbling.
  - [x] Task 20.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 21. Create `module-ref-circular-dependencies-and-lazy-loading.adoc` ("ModuleRef, Circular Dependencies & Lazy Loading").
  - [x] Task 21.1. Header per "Conventions" (`= ModuleRef, Circular Dependencies & Lazy Loading`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 21.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `forwardRef()` (providers and modules) and why cycles signal design problems, Madge detection, `ModuleRef.get`/`resolve`/`create`, `ContextIdFactory`, `registerRequestByContextId`, `LazyModuleLoader` and its limits, serverless use.
  - [x] Task 21.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 22. Create `execution-context-reflector-and-discovery.adoc` ("Execution Context, Reflector & Discovery").
  - [x] Task 22.1. Header per "Conventions" (`= Execution Context, Reflector & Discovery`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 22.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `ArgumentsHost` (`getType`, `switchToHttp/Rpc/Ws`), `ExecutionContext` (`getClass`, `getHandler`), `Reflector` (`get`, `getAllAndOverride`, `getAllAndMerge`, `createDecorator`), `DiscoveryModule`/`DiscoveryService` explorer example.
  - [x] Task 22.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 23. Create `lifecycle-events-and-shutdown.adoc` ("Lifecycle Events & Shutdown").
  - [x] Task 23.1. Header per "Conventions" (`= Lifecycle Events & Shutdown`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 23.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): all lifecycle hooks, v11/v12 ordering, async init, `enableShutdownHooks()` and signals, graceful shutdown (v12 Express drain, `forceCloseConnections`), Kubernetes termination.
  - [x] Task 23.3. Figure: Mermaid timeline of bootstrap → serving → shutdown.
  - [x] Task 23.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 24. Create `platform-agnosticism-and-standalone-apps.adoc` ("Platform Agnosticism & Standalone Apps").
  - [x] Task 24.1. Header per "Conventions" (`= Platform Agnosticism & Standalone Apps`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 24.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): write-once logic for HTTP/microservices/WebSockets, `NestFactory.createApplicationContext` (`get`/`select`/`close`) for CLIs and workers, `nest-commander`, the REPL (`repl(AppModule)`, `get`, `debug`, `methods`, watch mode).
  - [x] Task 24.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 5 — Application pages

**Parallelizable: yes (six independent pages)**

- [x] Task 25. Create `configuration.adoc` ("Configuration") ★.
  - [x] Task 25.1. Header per "Conventions" (`= Configuration`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 25.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/config` (`forRoot` options incl. `validatePredefined`/`skipProcessEnv`, `ConfigService.get`/`getOrThrow`, v11 precedence, `registerAs`, `forFeature`), validation via Standard Schema (Zod) or custom `validate` (Joi 18+ `libraryOptions`), `ConditionalModule`, `envVariablesLoaded`, config in `main.ts` and `forRootAsync`, twelve-factor and secrets (no hard-coded credentials, no production `synchronize`).
  - [x] Task 25.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 26. Create `serialization.adoc` ("Serialization").
  - [x] Task 26.1. Header per "Conventions" (`= Serialization`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 26.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `ClassSerializerInterceptor` with `@Exclude`/`@Expose`/`@Transform`/`@SerializeOptions` (hiding password hashes), `StandardSchemaSerializerInterceptor`, WebSockets/microservices.
  - [x] Task 26.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 27. Create `logging.adoc` ("Logging").
  - [x] Task 27.1. Header per "Conventions" (`= Logging`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 27.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `Logger`/`ConsoleLogger` options (levels, `json`, `colors`, `compact`, `prefix`, `timestamp`, v12 `structuredParams`/`flattenParams`), `bufferLogs`, custom `LoggerService`, extending `ConsoleLogger`, injecting a logger, request correlation with `AsyncLocalStorage`, Pino and Winston.
  - [x] Task 27.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 28. Create `events-scheduling-and-queues.adoc` ("Events, Scheduling & Queues") ★.
  - [x] Task 28.1. Header per "Conventions" (`= Events, Scheduling & Queues`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 28.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/event-emitter` (in-process only; contrast with the book's cross-service misuse), `@nestjs/schedule` (`@Cron`, `CronExpression`, `@Interval`, `@Timeout`, `SchedulerRegistry`, multi-instance), `@nestjs/bullmq` (`forRoot`/`registerQueue`, `@InjectQueue`, `@Processor` + `WorkerHost`, `@OnWorkerEvent`, `@QueueEventsListener`, flows, separate processes) and legacy `@nestjs/bull`; xref `backend/messaging/*`.
  - [x] Task 28.3. Figure: Mermaid of producer → Redis queue → worker.
  - [x] Task 28.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 29. Create `http-client.adoc` ("HTTP Client").
  - [x] Task 29.1. Header per "Conventions" (`= HTTP Client`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 29.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/http-client` (named clients, defaults, async config, timeouts/`AbortSignal`, retries, typed errors, interceptors, streaming, proxies/TLS, testing, RxJS interop; pre-1.0 stated), migrating from `@nestjs/axios`, `firstValueFrom`/`lastValueFrom` for code still on axios (`.toPromise()` deprecated).
  - [x] Task 29.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 30. Create `i18n-mail-and-file-storage.adoc` ("i18n, Mail & File Storage").
  - [x] Task 30.1. Header per "Conventions" (`= i18n, Mail & File Storage`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 30.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/i18n` (catalogs, resolvers, localised exceptions/validation, ICU), `@nestjs/mail` (templates, attachments, transports, send-after-commit), `@nestjs/storage` (local/S3/R2 disks, private files, signed URLs, direct uploads); all pre-1.0 stated in prose.
  - [x] Task 30.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 6 — Data pages

**Parallelizable: yes (four independent pages)**

- [x] Task 31. Create `data-overview-and-typeorm.adoc` ("Data Overview & TypeORM") ★.
  - [x] Task 31.1. Header per "Conventions" (`= Data Overview & TypeORM`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 31.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): integration choice table (TypeORM, Prisma, Drizzle, MikroORM, Sequelize, Mongoose), TypeORM (`forRoot`/`forRootAsync`/`forFeature`, entities/relations, `@InjectRepository`, `autoLoadEntities`, transactions with `DataSource`/`QueryRunner`, subscribers, migrations not `synchronize`, multiple data sources, `getRepositoryToken` testing), pagination (xref `database/pagination-strategies.adoc`); xref `database/sql/*`.
  - [x] Task 31.3. Figure: Mermaid ER diagram of *Bookshelf*.
  - [x] Task 31.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 32. Create `prisma-drizzle-mikroorm-and-sequelize.adoc` ("Prisma, Drizzle, MikroORM & Sequelize").
  - [x] Task 32.1. Header per "Conventions" (`= Prisma, Drizzle, MikroORM & Sequelize`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 32.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): the *Bookshelf* repository with each: Prisma (generator output, CJS/ESM, `PrismaService` with `onModuleInit`, transactions, testing), Drizzle (`@nestjs/drizzle` pre-1.0, schema, relations, transactions, drizzle-kit migrations), MikroORM (request context, `@CreateRequestContext`), Sequelize (`sequelize-typescript`).
  - [x] Task 32.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 33. Create `mongodb-with-mongoose.adoc` ("MongoDB with Mongoose").
  - [x] Task 33.1. Header per "Conventions" (`= MongoDB with Mongoose`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 33.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/mongoose` (`@Schema`, `@Prop`, `SchemaFactory`, `HydratedDocument`, `@InjectModel`, `@InjectConnection`), sessions/transactions, multiple connections, hooks/plugins, discriminators, virtuals, subdocuments, connection events, `getModelToken` testing; xref `database/mongodb/*`.
  - [x] Task 33.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 34. Create `caching.adoc` ("Caching") ★.
  - [x] Task 34.1. Header per "Conventions" (`= Caching`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 34.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): strategies (book ch. 2/17), `@nestjs/cache-manager` with cache-manager v6/Keyv (`CacheableMemory`, `@keyv/redis`), `CACHE_MANAGER` get/set/del with TTL in milliseconds, `CacheInterceptor` (route/global), `@CacheKey`, `@CacheTTL`, `trackBy`, `registerAsync`, invalidation, WebSockets/microservices; xref `database/redis/*`.
  - [x] Task 34.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).

### Group 7 — HTTP pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 35. Create `versioning-and-global-prefix.adoc` ("Versioning & Global Prefix").
  - [x] Task 35.1. Header per "Conventions" (`= Versioning & Global Prefix`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 35.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `enableVersioning` (URI → `/v1/books`, header, media-type, custom), `@Version`, `VERSION_NEUTRAL`, `defaultVersion`, versioning middleware, `setGlobalPrefix` with `exclude` (array since 12.1), `RouterModule`.
  - [x] Task 35.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 36. Create `cookies-and-sessions.adoc` ("Cookies & Sessions").
  - [x] Task 36.1. Header per "Conventions" (`= Cookies & Sessions`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 36.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): built-in adapter-agnostic cookies (12.1: `@Cookies()`, `@SignedCookies()`, `setCookie()`, `clearCookie()`, signing, secret rotation), `cookie-parser`/`@fastify/cookie`, `express-session`/`@fastify/secure-session`, cookie security attributes.
  - [x] Task 36.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 37. Create `file-upload-and-streaming.adoc` ("File Upload & Streaming") ★.
  - [x] Task 37.1. Header per "Conventions" (`= File Upload & Streaming`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 37.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `FileInterceptor`/`FilesInterceptor`/`FileFieldsInterceptor`/`AnyFilesInterceptor`/`NoFilesInterceptor`, `@UploadedFile(s)`, `ParseFilePipe`/`ParseFilePipeBuilder` (`MaxFileSizeValidator`, `FileTypeValidator`), `MulterModule`, Fastify `MultipartModule` (12.1), streaming uploads, `StreamableFile` (vs the book's `@Res()` + `pipe`), raw body (`rawBody`, `RawBodyRequest`).
  - [x] Task 37.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 38. Create `server-sent-events.adoc` ("Server-Sent Events").
  - [x] Task 38.1. Header per "Conventions" (`= Server-Sent Events`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 38.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@Sse()` returning `Observable<MessageEvent>`, disconnects and the 11.2 SSE signal, the *Bookshelf* live-reviews feed, SSE vs WebSockets.
  - [x] Task 38.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 39. Create `mvc-static-files-and-compression.adoc` ("MVC, Static Files & Compression").
  - [x] Task 39.1. Header per "Conventions" (`= MVC, Static Files & Compression`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 39.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): MVC (`@Render`, `setBaseViewsDir`, `setViewEngine` Handlebars, layouts, dynamic render, Fastify `@fastify/view`), `@nestjs/serve-static` for SPA builds, compression (`compression`/`@fastify/compress`) vs reverse proxy.
  - [x] Task 39.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 40. Create `fastify-and-http-platforms.adoc` ("Fastify & HTTP Platforms") ★.
  - [x] Task 40.1. Header per "Conventions" (`= Fastify & HTTP Platforms`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 40.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): Express vs Fastify adapters, `NestFastifyApplication` and options, platform-specific packages and differences (CORS defaults, middleware, redirects), `@RouteConfig`, `@RouteConstraints`, `HttpAdapterHost`/`getInstance()`, HTTPS and multiple servers (`httpsOptions`), keep-alive, body limits (`useBodyParser`), benchmarks.
  - [x] Task 40.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 41. Create `webhooks.adoc` ("Webhooks").
  - [x] Task 41.1. Header per "Conventions" (`= Webhooks`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 41.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/webhooks` (pre-1.0): outgoing subscriptions, delivery after commit, retries, delivery log/replay, receiving signed webhooks, secret rotation, stores.
  - [x] Task 41.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 8 — Security pages

**Parallelizable: yes (five independent pages)**

- [x] Task 42. Create `authentication.adoc` ("Authentication") ★.
  - [x] Task 42.1. Header per "Conventions" (`= Authentication`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 42.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): authentication concepts (xref `backend/oauth/*`), `@nestjs/authentication` (pre-1.0: sign-up/in, email verification, password reset, current user, sessions, mobile tokens, 2FA, Google sign-in, magic links, API keys, rate-limited sign-in, GraphQL/WebSockets, testing), the established Passport/JWT approach (`@nestjs/passport`, local/JWT strategies, `AuthGuard`, `@nestjs/jwt` `signAsync`/`verifyAsync`, global guard + `@Public()`, refresh tokens), argon2/bcrypt, comparison table.
  - [x] Task 42.3. Figure: Mermaid sequence of sign-in → token/session → protected request.
  - [x] Task 42.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 43. Create `authorization.adoc` ("Authorization") ★.
  - [x] Task 43.1. Header per "Conventions" (`= Authorization`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 43.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): RBAC with `Reflector.createDecorator` + guard, `@nestjs/authorization` policies (pre-1.0: record-level checks, `before()` bypass, DI in policies, exposing permissions), claims/attribute-based access, CASL as the established alternative, GraphQL field-level authorization.
  - [x] Task 43.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 44. Create `security-headers-cors-and-csrf.adoc` ("Security Headers, CORS & CSRF").
  - [x] Task 44.1. Header per "Conventions" (`= Security Headers, CORS & CSRF`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 44.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `app.useSecurityHeaders()` (12.1) defaults/CSP (Swagger UI/GraphiQL caveats), `helmet`/`@fastify/helmet`, CORS (`enableCors`, adapter defaults; xref `web/cors.adoc`), CSRF (`app.enableCsrfProtection()` via `Origin`/`Sec-Fetch-Site`, `trustedOrigins`, token-based `csrf-csrf`/`@fastify/csrf-protection`).
  - [x] Task 44.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 45. Create `rate-limiting-and-encryption.adoc` ("Rate Limiting & Encryption").
  - [x] Task 45.1. Header per "Conventions" (`= Rate Limiting & Encryption`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 45.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/throttler` (named limits, `ThrottlerGuard`, `@Throttle`, `@SkipThrottle`, proxies/`trust proxy`, Redis storage, WebSockets, GraphQL), Node `crypto` (`aes-256-gcm` instead of the book's `aes-256-ctr`, `scrypt`), bcrypt/argon2.
  - [x] Task 45.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 46. Create `security-best-practices.adoc` ("Security Best Practices").
  - [x] Task 46.1. Header per "Conventions" (`= Security Best Practices`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 46.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): book ch. 18 against current APIs: defence in depth, OWASP API Security Top 10 mapped to NestJS features, injection prevention with ORMs, secrets management, `npm audit`, least privilege, TLS termination, security testing, incident response.
  - [x] Task 46.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 9 — OpenAPI and GraphQL pages

**Parallelizable: yes (four independent pages)**

- [x] Task 47. Create `openapi-and-swagger.adoc` ("OpenAPI & Swagger") ★.
  - [x] Task 47.1. Header per "Conventions" (`= OpenAPI & Swagger`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 47.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/swagger` 12: `DocumentBuilder`, `SwaggerModule.createDocument`/`setup`, options, types and parameters (`@ApiProperty`, arrays, enums with `enumName`, generics with `@ApiExtraModels` + `getSchemaPath`, `oneOf`/`anyOf`/`allOf`, circular refs, `@ApiSchema`, raw definitions), Standard Schema DTOs, operations (`@ApiTags`, `@ApiOperation`, `@ApiResponse` family incl. `@ApiCreatedResponse`, `@ApiHeader`, `@ApiConsumes`/`@ApiBody`, `@ApiExtension`), security decorators, mapped types, decorator table, CLI plugin (`introspectComments`, `classValidatorShim`, SWC `PluginMetadataGenerator`), global prefix/params, multiple specs, generating clients.
  - [x] Task 47.3. Figure: Mermaid of DTO decorators → OpenAPI document → Swagger UI / generated client.
  - [x] Task 47.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 48. Create `graphql-code-first-and-schema-first.adoc` ("GraphQL: Code-First & Schema-First") ★.
  - [x] Task 48.1. Header per "Conventions" (`= GraphQL: Code-First & Schema-First`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 48.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/graphql` 14 drivers (mandatory `driver`), code-first (`autoSchemaFile`) vs schema-first (`typePaths`, typings), GraphiQL (v12 default) and Apollo Sandbox, `@ObjectType`/`@Field`/`@Resolver`/`@Query`/`@Mutation`/`@ResolveField`/`@Parent`/`@Args`/`@ArgsType`/`@InputType`, scalars, enums, unions, interfaces, directives, extensions, mapped types, CLI plugin, generating SDL, sharing models, `nest g resource`, DataLoader (xref `backend/graphql/performance-and-n-plus-1.adoc`); xref `backend/graphql/*` for theory.
  - [x] Task 48.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 49. Create `graphql-subscriptions-security-and-plugins.adoc` ("GraphQL: Subscriptions, Security & Plugins").
  - [x] Task 49.1. Header per "Conventions" (`= GraphQL: Subscriptions, Security & Plugins`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 49.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `graphql-ws` subscriptions (enable in module config, shared `PubSub` provider, `asyncIterableIterator`, `filter`/`resolve`, `onConnect` auth, Redis PubSub), guards/interceptors/filters with `GqlExecutionContext`/`GqlArgumentsHost`, `GraphQLError` formatting, field middleware, Apollo Server 4 plugins and Mercurius hooks, query complexity.
  - [x] Task 49.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 50. Create `graphql-federation.adoc` ("GraphQL: Federation").
  - [x] Task 50.1. Header per "Conventions" (`= GraphQL: Federation`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 50.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): Apollo Federation 2 with `ApolloFederationDriver`/`ApolloGatewayDriver` (`@key`, reference resolvers), Mercurius federation, *Bookshelf* split into subgraphs (making the book's conceptual ch. 6 concrete).
  - [x] Task 50.3. Figure: Mermaid of gateway → subgraphs.
  - [x] Task 50.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 10 — WebSockets, microservices and reliability pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 51. Create `websockets.adoc` ("WebSockets") ★.
  - [x] Task 51.1. Header per "Conventions" (`= WebSockets`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 51.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/websockets` with `platform-socket.io`/`platform-ws`, `@WebSocketGateway` options, `@SubscribeMessage`/`@MessageBody`/`@ConnectedSocket`/`WsResponse`/acks, `@WebSocketServer`, rooms/namespaces, lifecycle hooks (v12 disconnect reason), request-scoped gateways (v12), exception filters (`WsException`, `BaseWsExceptionFilter`), pipes, guards (socket auth), interceptors, adapters (Redis `IoAdapter`, `WsAdapter`, custom), the *Bookshelf* per-book chat.
  - [x] Task 51.3. Figure: Mermaid sequence of connect → join room → message → broadcast → disconnect.
  - [x] Task 51.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 52. Create `microservices-fundamentals.adoc` ("Microservices Fundamentals") ★.
  - [x] Task 52.1. Header per "Conventions" (`= Microservices Fundamentals`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 52.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/microservices`, `createMicroservice` + `Transport.TCP`, request-response (`@MessagePattern`/`send`) vs event-based (`@EventPattern`/`emit`), `@Payload`/`@Ctx`, `ClientsModule.register`/`registerAsync`/`ClientProxy`, timeouts and `firstValueFrom`, hybrid apps (`connectMicroservice`, awaited `startAllMicroservices()`, `inheritAppConfig`), `status`/`on()`/`unwrap()`, exception filters (`RpcException`), pipes/guards/interceptors, v12 pre-request hooks, custom transporters.
  - [x] Task 52.3. Figure: Mermaid of request-response vs event-based messaging.
  - [x] Task 52.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 53. Create `microservice-transports.adoc` ("Microservice Transports") ★.
  - [x] Task 53.1. Header per "Conventions" (`= Microservice Transports`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 53.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): Redis, MQTT, NATS v3 (`@nats-io/transport-node`, queue groups), RabbitMQ (manual ack, topic exchanges/wildcards, durable queues), Kafka (reply topics, `KafkaContext`, RegExp patterns, offsets, `KafkaRetriableException`), gRPC (`.proto`, `@GrpcMethod`, streaming, `GrpcExceptionFilter`, reflection, health, metadata), comparison table; xref `backend/messaging/*`.
  - [x] Task 53.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 54. Create `microservices-architecture-and-patterns.adoc` ("Microservices Architecture & Patterns").
  - [x] Task 54.1. Header per "Conventions" (`= Microservices Architecture & Patterns`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 54.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): book ch. 9–11/14 rewritten: when to split (xref architecture), database per service, API gateway in Nest (#184 in prose), service discovery (Consul vs Kubernetes DNS), choreography vs orchestration, sagas with compensation, dead-letter queues, idempotent consumers, monorepo apps/shared libs, the *Bookshelf* `notifications` service.
  - [x] Task 54.3. Figure: SVG `nestjs-microservice-topology.svg` of the *Bookshelf* topology.
  - [x] Task 54.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 55. Create `cqrs.adoc` ("CQRS").
  - [x] Task 55.1. Header per "Conventions" (`= CQRS`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 55.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/cqrs` 12: `CommandBus`/`QueryBus`/`EventBus`, typed `Command<T>`/`Query<T>`, handlers, `AggregateRoot`, sagas incl. durable sagas (12.1; in-process sagas are not distributed sagas), unhandled exceptions, request scoping; xref `backend/architecture/architectural-patterns/*`.
  - [x] Task 55.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 56. Create `resilience-idempotency-and-locks.adoc` ("Resilience, Idempotency & Locks").
  - [x] Task 56.1. Header per "Conventions" (`= Resilience, Idempotency & Locks`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 56.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/resilience` (timeouts, circuit breaker, bulkhead, `@Retry()`), `@nestjs/idempotency` (`@Idempotent()`, stores, TTLs), `@nestjs/locks` (single-instance cron, fencing tokens, replacing the book's hand-rolled Redlock); pre-1.0 stated.
  - [x] Task 56.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 57. Create `outbox-and-durable-workflows.adoc` ("Outbox & Durable Workflows").
  - [x] Task 57.1. Header per "Conventions" (`= Outbox & Durable Workflows`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 57.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/outbox` (same-transaction messages, publishing to microservices, retries/DLQ), `@nestjs/workflows` (signals, timers, child workflows, versioning, CQRS integration); pre-1.0 stated; xref architecture outbox/saga pages.
  - [x] Task 57.3. Figure: Mermaid of the outbox flow.
  - [x] Task 57.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 11 — Testing and production pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 58. Create `testing.adoc` ("Testing") ★.
  - [x] Task 58.1. Header per "Conventions" (`= Testing`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 58.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): Vitest (ESM default) and Jest (CommonJS) with SWC (`unplugin-swc`, `@swc/jest`), `Test.createTestingModule`, `overrideProvider`/`Guard`/`Pipe`/`Interceptor`/`Filter`/`Module`, `useMocker`, overriding global enhancers (`useExisting`), request-scoped instances, e2e with supertest, testing TypeORM/Mongoose/Prisma code (Testcontainers; xref `backend/docker/testcontainers-fundamentals.adoc`), coverage, test pyramid; xref `programming-languages/javascript/tooling-jest.adoc`.
  - [x] Task 58.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 59. Create `testing-graphql-websockets-and-microservices.adoc` ("Testing GraphQL, WebSockets & Microservices").
  - [x] Task 59.1. Header per "Conventions" (`= Testing GraphQL, WebSockets & Microservices`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 59.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): resolver unit tests and GraphQL e2e, WebSocket gateway tests with a socket client, microservice unit tests mocking `ClientProxy` and integration tests over real transports, contract testing briefly, load testing with Artillery/k6.
  - [x] Task 59.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 60. Create `debugging-and-devtools.adoc` ("Debugging & Devtools").
  - [x] Task 60.1. Header per "Conventions" (`= Debugging & Devtools`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 60.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): common errors ("can't resolve dependencies", cycles, `NEST_DEBUG`, watch loops), IDE debugging, Devtools (`@nestjs/devtools-integration`, `snapshot: true`, graph/routes explorer, playground, bootstrap performance, audit, free vs paid, CI/CD `GraphPublisher`), the REPL, Madge.
  - [x] Task 60.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 61. Create `health-checks-and-observability.adoc` ("Health Checks & Observability") ★.
  - [x] Task 61.1. Header per "Conventions" (`= Health Checks & Observability`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 61.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): `@nestjs/terminus` 12 (`HealthCheckService`, built-in and custom indicators with `HealthIndicatorService.check().up()/down()/attempt()`, degraded state, graceful shutdown; legacy `HealthIndicator` removed), readiness/liveness, NestJS Observe (`@nestjs/observe`: auto-instrumentation, manual spans, distributed tracing, error monitoring, dashboard, MCP server, plans), OpenTelemetry with current APIs (SDK started before Nest imports, OTLP), Prometheus metrics + Grafana (xref `database/prometheus/*`), structured logging cross-link.
  - [x] Task 61.3. Figure: Mermaid of app → OTel collector → backends.
  - [x] Task 61.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 62. Create `performance-optimization.adoc` ("Performance Optimization").
  - [x] Task 62.1. Header per "Conventions" (`= Performance Optimization`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 62.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): book ch. 17 rewritten: Fastify adapter, avoiding request-scoped providers on hot paths, caching, DB indexes/N+1, compression, streaming, profiling (`node --prof`, `--inspect`, Clinic.js), load testing (Artillery, k6, autocannon), PM2 cluster vs one process per container, SWC/Rspack build speed, serverless cold starts, lazy-loading modules.
  - [x] Task 62.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 63. Create `deployment.adoc` ("Deployment") ★.
  - [x] Task 63.1. Header per "Conventions" (`= Deployment`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 63.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): official deployment page, multi-stage Dockerfile (Node LTS slim/alpine, `npm ci`, build stage, prune dev deps, non-root, exec-form `CMD`), Compose with PostgreSQL/Redis/RabbitMQ (no `version:`), PM2 + NGINX with TLS, Kubernetes probes and graceful shutdown (xref `backend/kubernetes/*`), serverless (Lambda with `@codegenie/serverless-express`, `NODE_OPTIONS=--experimental-require-module`, cold starts), Mau (`nest deploy`), cloud targets (xref `cloud/*`), backups/DR; xref `backend/docker/*`.
  - [x] Task 63.3. Figure: SVG `nestjs-production-topology.svg` (TLS proxy → N containers → PostgreSQL/Redis/RabbitMQ).
  - [x] Task 63.4. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, lifecycle position, pitfalls, Express/Fastify differences, complete runnable examples).
- [x] Task 64. Create `ci-cd.adoc` ("CI/CD").
  - [x] Task 64.1. Header per "Conventions" (`= CI/CD`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 64.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): book ch. 16 rewritten: a GitHub Actions workflow (current `actions/checkout`/`setup-node`, Node LTS matrix, cache, oxlint, test with coverage, build, Docker push), secrets, deploy jobs, Devtools CI/CD integration, `nest upgrade --dry-run` in CI; xref `backend/docker/ci-cd-with-github-actions.adoc`.
  - [x] Task 64.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 12 — Beyond-the-basics pages

**Parallelizable: yes (three independent pages; `whats-changed` and `case-studies` only link to pages created in Groups 2–11)**

- [x] Task 65. Create `recipes-and-tooling.adoc` ("Recipes & Tooling").
  - [x] Task 65.1. Header per "Conventions" (`= Recipes & Tooling`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 65.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): remaining official recipes/FAQ items not covered elsewhere: SWC in depth, hot reload (HMR with Rspack/webpack), `AsyncLocalStorage`/`nestjs-cls`, the official samples repository, courses and community resources.
  - [x] Task 65.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 66. Create `case-studies.adoc` ("Case Studies").
  - [x] Task 66.1. Header per "Conventions" (`= Case Studies`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 66.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): the book's three case studies (part 5) as design walkthroughs against current APIs, without reproducing book code: REST e-commerce (TypeORM, auth, validation), GraphQL social network (Mongoose, subscriptions), ERP microservices (sagas, queues, locks); each piece links the implementing concept page.
  - [x] Task 66.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 67. Create `whats-changed-and-migration.adoc` ("What's Changed & Migration").
  - [x] Task 67.1. Header per "Conventions" (`= What's Changed & Migration`, `:description:`, `:keywords:`, `include::partial$nestjs-disclaimer.adoc[]`); lead paragraph with the dated version baseline.
  - [x] Task 67.2. Cover every bullet of this page's outline in issue #230 (`gh issue view 230`): dated table of v8 → v12.1 changes and the Sep 2026 docs restructure (every item of "Where the book is outdated" and "New since the book"): version, date, old way, new way, link to the covering page, the official migration guide and release notes; `nest upgrade`; legacy-URL → new-URL table.
  - [x] Task 67.3. Every code example is verified in the Group 1 scratch project (`npm run build` + the page's test or `curl`) and followed by a `Source:` link to the official page it derives from (post-restructure URLs only); "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 13 — Landing page, bibliography and cheat sheet

**Parallelizable: no — `index.adoc` and the cheat sheet link every page created in Groups 2–12**

- [x] Task 68. Create `index.adoc` ("NestJS") with `== Bibliography`.
  - [x] Task 68.1. Header per "Conventions" (`= NestJS`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 68.2. Cover every bullet of the `index.adoc` outline in issue #230: what NestJS is and who it is for, version baseline, the *Bookshelf* scenario, reading path, `== What's covered` grouped as the nav, the "where related material lives elsewhere on this site" table (every row of the issue's existing-pages table, xrefs verified to exist), and `== Bibliography`.
  - [x] Task 68.3. `== Bibliography`: every source in the issue's Bibliography section, each linked to its official website: the Packt book page (ISBN 978-1-83546-860-9 / 978-1-83546-395-6, companion code), docs.nestjs.com groups, other official NestJS resources, platform/library docs, specifications, third-party tools, Next.js docs. Use the canonical URLs recorded in Task 3.
  - [x] Task 68.4. Figures: SVG `nestjs-bookshelf-architecture.svg` and a Mermaid mind-map of the section.
  - [x] Task 68.5. End with `== References`.
- [x] Task 69. Create `cheat-sheet.adoc` ("NestJS Cheat Sheet").
  - [x] Task 69.1. Follow `backend/fastapi/cheat-sheet.adoc`: header + `:description:`/`:keywords:`, disclaimer include, intro linking `xref:attachment$nestjs-cheat-sheet.pdf[downloadable PDF]` and stating the dated version baseline, grouped `*Group* --` paragraphs of `xref:`s to every page, final `xref:attachment$nestjs-cheat-sheet.pdf[Download the NestJS Cheat Sheet (PDF)]` line, `== References`.
- [x] Task 70. Create `modules/ROOT/attachments/nestjs-cheat-sheet.pdf`.
  - [x] Task 70.1. Design a throwaway HTML page (scratchpad) rendered with headless Chrome print-to-PDF, like the other cheat sheets: **exactly one A4 page**, dense multi-column, colour-coded, legible when printed.
  - [x] Task 70.2. Summarise every concept listed in the issue's "Cheat sheet" section (NestJS ≠ Next.js, CLI, bootstrap, building blocks, lifecycle strip, pipes/validation, exceptions, fundamentals, application, data, HTTP, security, OpenAPI, GraphQL, WebSockets, microservices, CQRS/reliability, testing, production, "changed since older tutorials" strip with versions).
  - [x] Task 70.3. Verify with `pdfinfo` (Pages: 1, A4) and render to PNG to check legibility/overflow; do not commit the HTML.

### Group 14 — Site wiring and back-links

**Parallelizable: yes (independent files)**

- [x] Task 71. Update `modules/ROOT/nav.adoc`.
  - [x] Task 71.1. Immediately after the last `****` child of the Python FastAPI block (its `Cheat Sheet (PDF)`), add `include::partial$nav-typescript.adoc[]`, then `*** xref:backend/nestjs/index.adoc[NestJS]` with `****` children for all 65 pages in the issue's order (Foundations, Building blocks, Fundamentals, Application, Data, HTTP, Security, OpenAPI, GraphQL, WebSockets, Microservices, Reliability, Testing, Production, Beyond the basics), ending with `**** xref:backend/nestjs/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 72. Update `modules/ROOT/pages/backend/index.adoc`.
  - [x] Task 72.1. Add **TypeScript Reference** (`xref:programming-languages/typescript/index.adoc[TypeScript Reference]`) and **NestJS** (`xref:backend/nestjs/index.adoc[NestJS]`) bullets after the Python FastAPI bullet, in the existing bullet style (wrapped ~120 chars, ending ", plus a downloadable cheat sheet." for NestJS).
  - [x] Task 72.2. Extend `:description:` and append the issue's NestJS keywords to `:keywords:`.
- [x] Task 73. Update `modules/ROOT/pages/index.adoc`.
  - [x] Task 73.1. Mention NestJS in the "backend (including …)" parenthetical of `:description:` and add `NestJS, Node.js, Express, Fastify` to `:keywords:`. No new tile.
- [x] Task 74. Add the back-links.
  - [x] Task 74.1. `programming-languages/typescript/index.adoc`: a "Where TypeScript is used on this site" line linking the NestJS section.
  - [x] Task 74.2. `programming-languages/typescript/decorators-and-metadata.adoc`: link the existing NestJS mentions to the section.
  - [x] Task 74.3. `backend/graphql/index.adoc`: one-line back-link to the NestJS GraphQL pages as the TypeScript integration.
  - [x] Task 74.4. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`: a `| TypeScript / NestJS` row in the "Backend framework" table linking the new section.

### Group 15 — Build, validation and review

**Parallelizable: no — depends on every page, the nav and the PDF**

- [x] Task 75. Validate the whole section.
  - [x] Task 75.1. `npm run validate:mermaid` passes for every Mermaid block.
  - [x] Task 75.2. `grep -rn -E '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/backend/nestjs` returns nothing, and the disclaimer partial is included on every page (66 files).
  - [x] Task 75.3. No `/techniques/` URL, no `xref:` to a non-existent page (#196/#184/#201/#156 are prose only), no secrets, no book text/figures, `git status` shows no `*.pdf` other than `nestjs-cheat-sheet.pdf` and no scratch files.
  - [x] Task 75.4. Every code example has a `Source:` link; every page ends with `== References`; every ★ page is among the longest.
  - [x] Task 75.5. Delegate `npx antora antora-playbook.yml` (or the `iru-build-docs` skill) to the `iru-gate-runner` agent: 0 errors / 0 warnings; spot-check the rendered nav (TypeScript Reference under Backend Development), the cheat sheet download and a Mermaid page in `build/site`.
- [x] Task 76. Run the security scan.
  - [x] Task 76.1. Delegate `iru-check-security` (detect-secrets) to the `iru-gate-runner` agent; resolve any finding before archiving.
