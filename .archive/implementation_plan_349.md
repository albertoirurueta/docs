# Implementation Plan: Add "Express.js" section under Guides & References / Backend Development

## Task summary

Source: GitHub issue #349
Base branch: main

Issue [#349](https://github.com/albertoirurueta/docs/issues/349) asks for a new **Express.js** section at
`modules/ROOT/pages/backend/express/` (nav title **Express.js**): 40 concept pages (including the `index.adoc` landing
page with a `== Bibliography`) plus `cheat-sheet.adoc` and a one-page A4 `express-cheat-sheet.pdf`. Content comes from the
official Express documentation (expressjs.com, `expressjs/*` repositories) cross-checked against four Packt books
(consulted for coverage only, never copied). Every example is ESM/TypeScript against current APIs (Express 5.3 on Node.js
LTS), follows one running scenario (*Bookshelf*), and is followed by a link to the official page it derives from. The
issue body is the specification: it holds the per-page outline, the books' concept table, the "books are outdated" list,
the middleware table and the bibliography. Re-read it per page (`gh issue view 349 --json body`); a copy is in the
session scratchpad as `issue349.md`. Its per-page detail is not repeated here.

Existing material is linked, not re-documented. Back-links are added to the existing Node.js, NestJS, frameworks
comparison and "starting a new project" pages.

**Choices made on the user's behalf**

* **Delivery:** one branch (`feature/349-add-expressjs-section-backend`) and one draft PR against `main`. The issue
  suggests four PRs; the groups below follow its four buckets, so splitting later is mechanical.
* **Fact re-verification:** every version, date, URL and anchor in the issue's baseline table is re-checked at
  implementation time (npm, GitHub releases, expressjs.com, nodejs.org) and the snapshot date is stated on each page. The
  Packt pages return HTTP 403 to automated fetches; those links are used as given in the issue and flagged as not
  machine-verified in the PR description.
* **Admonitions:** `partials/express-disclaimer.adoc` is the only admonition in the section; every other caveat is prose
  or a table row.
* **Cross-issue references** (#257, #230, #263, ...) are prose only, never `xref:`.
* **Cheat sheet PDF:** one A4 page rendered from a throwaway HTML file with headless Chrome print-to-PDF, in the session
  scratchpad. Only the PDF is committed, and its page count is checked to be 1.
* **Task tags:** every task is AsciiDoc, SVG or PDF authoring with no matching `iru-*-code-one-task` skill, so tasks are
  untagged and implemented directly.
* **Parallelism:** tasks within a group each own distinct files, so they are parallelizable. Cross-page `xref:` targets are
  known from the outline, so pages can reference each other before they exist. `nav.adoc` and the landing page are
  edited in Group 7, after the pages, so the build never sees dangling entries.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`backend/express/index.adoc` exists and is the target of a new `*** xref:backend/express/index.adoc[Express.js]` entry in `nav.adoc` ..., followed by every page ... ending with the cheat sheet" | Task 42, Task 45 |
| 2 | "`backend/index.adoc` has an Express.js bullet between Node.js and NestJS, with `:description:` and `:keywords:` updated. The root `index.adoc` ... mention Express.js" | Task 46 |
| 3 | "Every page in the outline exists, plus `cheat-sheet.adoc`" (foundations 6, routing 3, middleware 3, app/request/response 4, static/views 2, errors 2, APIs and data 5, integrations 3, security 4, testing 1, production 4, migration 3) | Tasks 3 to 43 |
| 4 | "Every page of the official documentation listed in 'Official documentation explored' is covered ... every Express 5 breaking change, every API member, every app setting, every official middleware module and every official example (mapped on `index.adoc`) ... every row of the books' concept table" | Tasks 3 to 41, Task 42, Task 49 |
| 5 | "Every ★ page has detailed content: explanation, all relevant options, pitfalls, a worked Bookshelf example and complete runnable examples" | Tasks marked ★ (4, 6, 7, 8, 9, 10, 12, 15, 16, 19, 22, 23, 24, 25, 28, 29, 30, 31, 34, 35, 38, 41) |
| 6 | "Every code example uses current APIs ... and is followed by a link to the official documentation page it derives from ... no real secrets" | Tasks 3 to 41, Task 50 |
| 7 | "Book statements that are outdated, insecure practices and book errata are documented in prose or tables with versions, never reproduced. `migrating-and-whats-changed.adoc` collects them all" | Tasks 3 to 40 (per-page subsection), Task 41 |
| 8 | "Mermaid diagrams and `express-*.svg` figures are added at least where a figure is suggested. All Mermaid blocks pass `npm run validate:mermaid`, and every image follows the `CLAUDE.md` image rules" | Tasks 3 to 42 (figures), Task 48, Task 49 |
| 9 | "`partials/express-disclaimer.adoc` exists and is included on every page under `backend/express/`; it is the only admonition and says only AI assistance plus the bibliography pointer" | Task 2, Task 50 |
| 10 | "`== Bibliography` on the landing page lists every source, each linked to its official website ...; each page has a `== References` section" | Task 42, Tasks 3 to 41, Task 50 |
| 11 | "`cheat-sheet.adoc` exists and links `attachments/express-cheat-sheet.pdf`, a single-page A4 'Express.js Cheat Sheet' PDF summarising every concept" | Task 43, Task 44 |
| 12 | "The existing pages listed in 'What already exists' get their one-line back-links ... No `xref:` points to a page that doesn't exist" | Task 47, Task 49 |
| 13 | "No book PDF is committed or attached anywhere, and no book text, listing, figure or sample project is reproduced" | Task 50 |
| 14 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings, the `CLAUDE.md` verification greps print nothing for `build/site/.../backend/express`, and the Express.js nav renders under Backend Development" | Task 48, Task 49 |

## Current code state

There is no application code. The Antora root component is `ROOT` (`antora.yml`, `antora-playbook.yml`, `modules/ROOT/`)
with the Mermaid and MathJax extensions; the docs root is the repository root; the host is GitHub
(`albertoirurueta/docs`). No `implementation_plan.md` existed before this plan; `.archive/` holds about 100 earlier
plans.

* **Nav:** `modules/ROOT/nav.adoc`. Backend Development starts at line 1126 (`** xref:backend/index.adoc[...]`), with
  `*** xref:backend/frameworks-comparison.adoc[...]` below it. The Node.js entry is the `include::partial$nav-nodejs.adoc[]`
  line before `*** xref:backend/nestjs/index.adoc[NestJS]`; the Express.js entry goes right after that include, followed by
  one `****` entry per page.
* **Sibling sections as structural precedent:** `backend/nodejs/` (index, ~40 pages, `cheat-sheet.adoc`),
  `backend/nestjs/` and `backend/fastapi/` (`introduction-and-architecture`, `getting-started`, `testing`, ... `cheat-sheet`).
  `backend/nodejs/cheat-sheet.adoc` and `backend/nestjs/cheat-sheet.adoc` define the cheat-sheet page layout.
* **Partials:** `modules/ROOT/partials/nodejs-disclaimer.adoc` is the model for `express-disclaimer.adoc` (single
  `[IMPORTANT]` block, bibliography pointer to the section index anchor `#_bibliography`).
* **Attachments:** `modules/ROOT/attachments/nodejs-cheat-sheet.pdf`, `nestjs-cheat-sheet.pdf`, `fastapi-cheat-sheet.pdf`
  show the PDF look and the `xref:attachment$...` convention.
* **Images:** `modules/ROOT/images/` (all figures, bare filenames, one-line `image::` macros, quoted alt text with commas).
  New SVGs are named `express-*.svg` and each must be referenced by a page.
* **Existing pages to receive back-links:** `backend/nodejs/web-frameworks-express-and-fastify.adoc`,
  `backend/nodejs/index.adoc` (related-material table row), `backend/nestjs/index.adoc`,
  `backend/nestjs/fastify-and-http-platforms.adoc`, `backend/frameworks-comparison.adoc`,
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (the JavaScript/TypeScript row), plus the
  `backend/index.adoc` bullet and the root `index.adoc` description/keywords.
* **Verification tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (needs a one-off
  `npm i --no-save mermaid@11 jsdom`), and the `CLAUDE.md` greps for image macros and inline-code substitutions.
* **Conventions to honour (`CLAUDE.md`):** inline code containing `->`, `=>`, `*`, `{`, `__`, `~`, `^`, `'` is written as
  `` `+...+` `` (Express path syntax such as `` `+/*splat+` `` and `` `+/{*splat}+` `` hits this constantly; code with a
  `+` uses `` `pass:c[...]` ``); Mermaid stereotypes use `&lt;&lt;...&gt;&gt;`; block macros start at column 0.

## Implementation steps

Every page task has the same acceptance shape, referred to below as the **page contract**: file under
`modules/ROOT/pages/backend/express/`; `= Title`, `:description:`, `:keywords:`, `include::partial$express-disclaimer.adoc[]`;
an intro naming the Express/Node.js versions and the check date; detailed prose with all relevant options, pitfalls, Express
4 vs 5 differences and "what changed recently"; complete runnable *Bookshelf* examples (ESM, `node:` prefixes, no secrets)
each followed by a `Source:` link to the official page; a "Where the books are outdated" subsection for concepts the books
touch; the figures listed in the issue's outline; and a closing `== References`. ★ pages are the most detailed. The issue
body holds each page's exact coverage list.

### Group 1 — Baseline and shared partial (Parallelizable: yes)

- [x] Task 1. Re-verify the version baseline and URL map
  - [x] Task 1.1. Re-check every row of the issue's "Version baseline" table (`npm view express dist-tags`, GitHub releases,
    History.md, support page, Node.js engines, `body-parser`/`router`/`path-to-regexp` majors) and record results in
    `<scratchpad>/express-baseline.md`
  - [x] Task 1.2. Spot-check the expressjs.com URLs in "Official documentation explored" against the 2026 Astro site layout
    (trailing slash, `/en/5x/`, `/en/4x/`); list any renamed or removed pages and the middleware page URLs
  - [x] Task 1.3. Note anything that differs from the issue (new release, EOL announcement, Apollo Server 5 integration
    package); later page tasks use the verified values, not the issue's
- [x] Task 2. Create `modules/ROOT/partials/express-disclaimer.adoc`
  - [x] Task 2.1. Single `[IMPORTANT]` block with only the AI-assistance disclosure and
    `xref:backend/express/index.adoc#_bibliography[the section bibliography]`, matching `nodejs-disclaimer.adoc`

### Group 2 — Foundations, routing and middleware (Parallelizable: yes — one file per task)

- [x] Task 3. `introduction-and-architecture.adoc` ★ (MEAN/MEVN/MERN, history, module family, request flow, glossary, utility modules, Express vs `node:http`/Koa/Fastify; SVG layer stack `express-layer-stack.svg`, Mermaid request sequence)
- [x] Task 4. `versions-support-and-lts.adoc` (release history, LTS phases, support table, Node minimums, security releases, extended support; Mermaid gantt)
- [x] Task 5. `getting-started.adoc` ★ (install, hello world in ESM/CJS/TS, `app.listen` error callback, `node --watch --env-file`, FAQ, express-generator and its modernisation, official examples)
- [x] Task 6. `typescript-with-express.adoc` (`@types/express`, tsconfig, type stripping, typed `Request`/`Response`/handlers, module augmentation of `express-serve-static-core`, typed validated bodies; `[source,typescript]`)
- [x] Task 7. `project-structure-and-configuration.adoc` ★ (app/server split, routes → controllers → services → data, MVC, `mvc`/`route-separation`/`route-map` examples, environment config, secrets; Mermaid layering)
- [x] Task 8. `routing.adoc` ★ (`app.METHOD`/`all`/`query` with its Node requirement, `next('route')`, `app.route()`, 404 fall-through, `resource`/`params`/`route-middleware` examples)
- [x] Task 9. `route-paths-and-parameters.adoc` ★ (path-to-regexp 8 syntax, `/*splat` and `/{*splat}`, braces, escaping, `req.params`, `app.param`/`router.param`, every Express 4 pattern that now throws with its replacement; Mermaid decision chart; passthrough inline code throughout)
- [x] Task 10. `routers-and-modular-apps.adoc` ★ (`express.Router` options, mounting, `next('router')`, `router.route()`, sub-apps, `mountpath`, `baseUrl` vs `originalUrl`, `vhost`, `multi-router`/`vhost` examples, API versioning; Mermaid router tree)
- [x] Task 11. `middleware-fundamentals.adoc` ★ (the `(req,res,next)` contract, ordering, kinds, factories, async middleware in 5, `res.locals`, `view-locals`, common bugs; SVG onion diagram `express-middleware-onion.svg`)
- [x] Task 12. `body-parsing.adoc` ★ (`express.json`/`urlencoded`/`raw`/`text` and every option, `req.body` undefined without a parser, Brotli, errors; Express 5 defaults)
- [x] Task 13. `official-middleware-modules.adoc` (the 16 team-maintained modules in one table with status and covering page, `method-override`, `connect-timeout`, deprecated `csurf`/`connect-multiparty`/`path-match`)

### Group 3 — Application/request/response, static files, views and errors (Parallelizable: yes)

- [x] Task 14. `application-and-settings.adoc` (`express()`, `app.set/get/enable/disable`, every app setting, `app.locals`, `app.mountpath`, `app.listen` and `app.router`, events)
- [x] Task 15. `request.adoc` ★ (every `req` property and method, null-prototype `params`, `query` getter and parser, `host` with port, `req.accepts*`, `req.range`, `req.is`)
- [x] Task 16. `response.adoc` ★ (every `res` property and method, `cookie` options, `send`/`json`/`jsonp`/`sendFile`/`download`/`redirect`/`render`/`format`/`links`/`vary`/`status`, removed signatures)
- [x] Task 17. `content-negotiation-and-http-caching.adoc` (`res.format`, `req.accepts*`, ETag, `fresh`/`stale`, `Cache-Control`, `Vary`, conditional requests)
- [x] Task 18. `serving-static-files.adoc` (`express.static` options incl. `dotfiles: 'ignore'` and `/.well-known`, `serve-favicon`, `serve-index`, `serve-static`, virtual prefixes, `res.sendFile`)
- [x] Task 19. `template-engines-and-views.adoc` ★ (`views`/`view engine`, `res.render` always async, Pug/EJS/Handlebars/Nunjucks, `@ladjs/consolidate`, `app.engine`, partials, flash messages, developing a template engine; the unescaped-EJS stack-trace problem in prose)
- [x] Task 20. `error-handling.adoc` ★ (sync errors, promise forwarding in 5, why `express-async-errors` is no longer needed, error-handling middleware, `finalhandler`, `errorhandler`, problem details RFC 9457, `ERR_HTTP_HEADERS_SENT`)
- [x] Task 21. `debugging-and-logging.adoc` (`DEBUG=express:*,router,router:*`, `debug` in your own code, `morgan`, `response-time`, `pino-http`, Node inspector)

### Group 4 — APIs and data, integrations and security (Parallelizable: yes)

- [x] Task 22. `building-rest-apis.adoc` ★ (the Bookshelf REST API end to end: resources, verbs, status codes, PUT vs PATCH, versioned prefix, pagination and filtering, problem-details errors, OpenAPI)
- [x] Task 23. `validation-and-input-handling.adoc` ★ (treating `req.body`/`query`/`params`/headers as untrusted, express-validator, Zod, Joi, Ajv, mass assignment, `req.assert` removal)
- [x] Task 24. `database-integration.adoc` ★ (`node:sqlite` first, `pg`, `mysql2`, ORMs/query builders, Sequelize and migrations, connection lifecycle, connect before listen, pagination links)
- [x] Task 25. `mongodb-and-mongoose.adoc` ★ (Mongoose 8/9 schemas, validation, CRUD, geospatial `2dsphere`/`$near`, aggregation endpoints, removed callbacks and methods)
- [x] Task 26. `file-uploads-and-downloads.adoc` (multer 2 storage and limits, busboy, filename sanitising and path traversal, MIME sniffing, `res.download`, streaming, cloud storage)
- [x] Task 27. `graphql-with-express.adoc` (Apollo Server 5 Express integration, `graphql-http`, context from `req`, security and demand control links)
- [x] Task 28. `real-time-websockets-and-sse.adoc` (shared `http.Server`, `ws`, Socket.IO 4 with `new Server(httpServer, ...)`, socket authentication, SSE live "new review" feed)
- [x] Task 29. `spas-and-server-side-rendering.adoc` (SPA build + `/{*splat}` history fallback, `connect-history-api-fallback`, Vite SSR in middleware mode, sitemap routes, links to the React/Vue/Angular/Next.js sections)
- [x] Task 30. `security-best-practices.adoc` ★ (official security page point by point, Helmet, rate limiting, CSRF alternatives to `csurf`, TLS, dependencies, threat model, secrets in Git)
- [x] Task 31. `cookies-and-sessions.adoc` ★ (`res.cookie`/`clearCookie` options, `cookie-parser`, signed cookies, `cookie-session`, `express-session` stores, `connect-redis`/`connect-mongo`, `trust proxy`)
- [x] Task 32. `authentication-and-authorization.adoc` ★ (bcrypt/argon2id, Passport local with the ≥0.6 `req.logout(cb)`, JWT with pinned algorithms and expiry, `express-jwt`/`jose`, OAuth/OIDC links to `backend/oauth/*`, route guards, RBAC)
- [x] Task 33. `cors.adoc` (`cors` middleware and every option, credentials, preflight, link to `web/cors.adoc`)

### Group 5 — Testing, production and extension pages (Parallelizable: yes)

- [x] Task 34. `testing.adoc` ★ (testing `app` without listening, supertest with `node:test`/Jest/Vitest, model tests, `mongodb-memory-server`, Testcontainers, Playwright E2E)
- [x] Task 35. `performance-best-practices.adoc` ★ (official performance page, `compression`, caching, clustering/`worker_threads`, `autocannon`, pino, PM2, avoiding sync work)
- [x] Task 36. `behind-proxies.adoc` (every `trust proxy` value, `proxy-addr`, `req.ip`/`protocol`/`hostname`)
- [x] Task 37. `health-checks-and-graceful-shutdown.adoc` ★ (liveness vs readiness, `SIGTERM`/`SIGINT`, draining, `server.close`, Kubernetes probes)
- [x] Task 38. `deployment-and-containers.adoc` (production Dockerfile for `bookshelf-api`, CI with GitHub Actions, Cloud Run/Kubernetes links, hosting changes since the books)
- [x] Task 39. `extending-the-express-api.adoc` (overriding `app.request`/`app.response`, custom settings)
- [x] Task 40. `frameworks-built-on-express-and-alternatives.adoc` (NestJS on `@nestjs/platform-express`, LoopBack 4, Sails, FeathersJS, Koa/Fastify/Hono, back-link to the Fastify comparison)

### Group 6 — Migration page (Parallelizable: yes — a group of one; runs after groups 2 to 5 because it collects their findings)

- [x] Task 41. `migrating-and-whats-changed.adoc` ★ (each Express 5 breaking change with before/after code and its codemod, the codemod recipe list, Express 4 → 5 checklist, and one consolidated "Where the books are outdated, insecure or wrong" collection that merges every per-page subsection)
  - Written to modules/ROOT/pages/backend/express/migrating-and-whats-changed.adoc; codemod list verified against the official migration guide on 2026-10-29; Antora build clean for this page (only the disclaimer's xref to the not-yet-written index.adoc is reported).

### Group 7 — Landing page, cheat sheet, nav, landing links and back-links (Parallelizable: yes — distinct files)

- [x] Task 42. `index.adoc` (landing page: what Express is, version baseline, Bookshelf scenario, reading path, `== What's covered` grouped as the nav, the 25-examples-to-page table, the "where related material lives" table, `== Bibliography` with every source linked to its official site; SVG `express-bookshelf-components.svg` and a Mermaid mind-map)
- [x] Task 43. `cheat-sheet.adoc` (disclaimer include, intro linking `xref:attachment$express-cheat-sheet.pdf[...]`, grouped `*Group* --` paragraphs of `xref:` to every page, the download line, `== References`)
- [x] Task 44. `modules/ROOT/attachments/express-cheat-sheet.pdf` (one A4 page, dense, multi-column, colour-coded, version baseline and date in the header, one box per group from the issue's cheat-sheet list; verify the page count is exactly 1 with `pdfinfo`/`mdls`; commit only the PDF)
- [x] Task 45. `modules/ROOT/nav.adoc` (add `*** xref:backend/express/index.adoc[Express.js]` after the Node.js include and before NestJS, then one `****` entry per page in outline order, ending with `cheat-sheet.adoc[Cheat Sheet (PDF)]`)
- [x] Task 46. `backend/index.adoc` (Express.js bullet between Node.js and NestJS ending ", plus a downloadable cheat sheet.", `:description:` and `:keywords:` updated) and root `index.adoc` (`:description:` and `:keywords:` mention Express.js, no new tile)
- [x] Task 47. Back-links: `backend/nodejs/web-frameworks-express-and-fastify.adoc` (Express part), `backend/nodejs/index.adoc` (table row), `backend/nestjs/index.adoc`, `backend/nestjs/fastify-and-http-platforms.adoc`, `backend/frameworks-comparison.adoc` (Express mentions gain an `xref:`), `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (JavaScript/TypeScript row)

### Group 8 — Verification (Parallelizable: no — Task 48 builds the site that Tasks 49 and 50 inspect)

- [x] Task 48. Build and Mermaid validation
  - [x] Task 48.1. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings (check the full output, not just the exit code)
  - [x] Task 48.2. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` reports every Express diagram as parsed
- [x] Task 49. Rendered-site and link checks
  - [x] Task 49.1. The `CLAUDE.md` greps print nothing: unclosed block and inline image macros, `<p>image::` in `build/site`, the unquoted-comma alt check on changed `.adoc` files, and the inline-`<code>` substitution grep on `build/site/**/backend/express`
  - [x] Task 49.2. Scan rendered text for stray backticks, bare `+`, `[[x]]` and other defects the greps miss (see the rendered-HTML scan memory); check that no `xref:` target is missing and that every `express-*.svg` is referenced and every `image::` target exists
  - [x] Task 49.3. Confirm the Express.js nav renders under Backend Development, every page is reachable and the PDF link resolves
- [x] Task 50. Content-rule audit
  - [x] Task 50.1. `grep` that no page contains an admonition other than the partial (`NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT`), every page includes the partial and ends with `== References`, and every code block is followed by a `Source:` link
  - [x] Task 50.2. Run `iru-check-security` (examples contain placeholders only; no real secrets) and confirm no book PDF or book text is committed
  - [x] Task 50.3. `git status` shows only the intended files (pages, partial, images, PDF, nav, landing pages, back-links)
