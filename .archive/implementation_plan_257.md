# Implementation Plan: Guides & References / Backend Development — "Node.js"

## Task summary

Source: GitHub issue #257
Base branch: main

Issue [#257](https://github.com/albertoirurueta/docs/issues/257) adds a **Node.js** section to Backend Development at
`modules/ROOT/pages/backend/nodejs/`: a practical, example-driven guide to learning Node.js and building applications
with it (written against Node.js 26, which becomes LTS on 2026-10-28, with Node 24 and 22 differences called out), built
from the **official Node.js documentation** (https://nodejs.org/en/learn and https://nodejs.org/docs/latest/api/) and
**npm documentation** (https://docs.npmjs.com/). Two requester-provided books (`~/Desktop/node1.pdf` *Efficient Node.js*,
Samer Buna, O'Reilly 2025; `~/Desktop/node2.pdf` *Node.js Projects*, Jonathan Wexler, O'Reilly 2025) are consulted
references for concept coverage, narrative and the bibliography only.

The section ships:

* 67 files: `index.adoc` (with `== Bibliography`), 65 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/nodejs-cheat-sheet.pdf` ("Node.js Cheat Sheet")
* the partial `modules/ROOT/partials/nodejs-disclaimer.adoc` (the only admonition allowed in the section)
* the **shared nav partial** `modules/ROOT/partials/nav-nodejs.adoc`, included under both Backend Development (between
  `nav-typescript.adoc` and NestJS) and Web Development (right after `nav-javascript.adoc`)
* original SVGs `modules/ROOT/images/nodejs-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* `backend/index.adoc` and `web/index.adoc` bullets/descriptions/keywords, root `index.adoc` description/keywords
* about 15 one-line back-links in existing JavaScript, TypeScript, NestJS, Next.js, Docker and architecture pages

The issue body is the binding spec: its "Page outline", "New nav placement", "Cheat sheet", "Bibliography" and
"Acceptance criteria" sections. Every page task must re-read its page's bullets (`gh issue view 257`) and cover **every**
bullet.

**Out of scope:** re-documenting existing material (JavaScript/TypeScript language, NestJS, Docker, Kubernetes, OAuth,
messaging and database theory — link instead); #196/#184/#201 in prose only.

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into 4 PRs; as with #230/#253, this run implements
   everything on `feature/257` and opens a single draft PR to `main` with `Closes #257`.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet` and
   `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly. JavaScript/TypeScript
   in pages is illustrative content, but every example is run in a scratch project (Task 2).
3. **The books appear only in `== Bibliography`** and in prose notes on outdated material. No text, listing, figure or
   sample project is copied; the PDFs are never staged. (`node1.pdf` carries an "OceanofPDF.com" watermark; it is a
   private reading copy only and is never referenced in the published pages.)
4. **Disclaimer:** `partials/nodejs-disclaimer.adoc` is a single `[IMPORTANT]` block (AI-assistance disclosure +
   `xref:backend/nodejs/index.adoc#_bibliography[…]`). No other admonition in the section; deprecations, stability levels,
   security caveats and "book is outdated" remarks are prose or table rows.
5. **Version baseline re-verified at implementation time and dated** (Group 1). The issue's numbers were checked on
   2026-10-03; Node ships patch releases often and Node 26 enters LTS on 2026-10-28, so they are re-verified, not copied.
6. **Stability index is shown per API** (Stable, Release Candidate, Experimental 1.x, Legacy, Deprecated); Experimental
   features (`node:ffi`, `node:vfs`, `node:bench`, `stream/iter`, module mocks…) are labelled and kept short.
7. **Running scenario is the original *Bookshelf*** (built mostly from Node built-ins, extended with Express/Fastify and
   database/queue clients where a page needs them); pages build on each other.
8. **Existing pages get real `xref:`s; not-yet-existing ones stay plain prose.** Every `xref:` target outside the section
   is verified with `ls` before it is written. `index.adoc` and `cheat-sheet.adoc` are written last (Group 12); the nav
   partial, landing pages and back-links come after the new pages exist (Group 13).
9. **Nav partial depth:** `nav-nodejs.adoc` uses the same absolute `***`/`****` depth and header comment as
   `nav-javascript.adoc`, documenting its two usage sites.
10. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `nodejs-*.svg`; SVGs are original drawings (no
    Node.js logo, docs images or book figures).

### Lessons from the earlier section reviews (#198, #199, #230, #237, #253) — mandatory for every page task

**Verify every name against its official page before writing it** (every API, flag, option, module name, import path,
package name and version number); if the docs don't confirm a detail, describe the behaviour without naming it.
**Security is correctness:** no hardcoded secrets, parameterised queries, authenticated encryption, constant-time
comparison, argument arrays instead of shells; keys read from `process.env` via `--env-file`. **Every concept gets at least
one code example**, each followed by a `Source:` link, and the URL goes in `== References`. **Run the examples** in the
Group 1 scratch project. **URL hygiene:** canonical nodejs.org / docs.npmjs.com URLs (the old nodejs.dev npm articles
404). **Cross-links accurate:** never `xref:` to a non-existent page; no `xref:` inside backticks; no empty link text on a
fragment xref. **AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes; `{placeholders}` and template-literal
braces literal inside `[source]` blocks and escaped in prose; no prose line starting with `<digits>.`. **Never reproduce the
books' errors** (the issue's errata and insecure-practice lists).

## Current code state

* **Repo:** Antora root component (`antora.yml`, component `irurueta`); pages in `modules/ROOT/pages/`, nav in
  `modules/ROOT/nav.adoc`, partials in `modules/ROOT/partials/`, images in `modules/ROOT/images/`, PDFs in
  `modules/ROOT/attachments/` (73 existing). `backend/nodejs/`, `nav-nodejs.adoc`, `nodejs-disclaimer.adoc`, `nodejs-*.svg`
  and `nodejs-cheat-sheet.pdf` do not exist.
* **`modules/ROOT/nav.adoc`:** Web Development (`** xref:web/index.adoc[Web Development]`, line ~289) includes
  `partial$nav-javascript.adoc` at line ~326, directly before `*** xref:web/bootstrap/index.adoc[Bootstrap Reference]`.
  Backend Development (line ~684) includes `nav-java`, `nav-python`, the FastAPI block, then `include::partial$nav-typescript.adoc[]`
  (line ~725) directly before `*** xref:backend/nestjs/index.adoc[NestJS]` (line ~726).
* **Nav partials:** `nav-javascript.adoc` header comment says "both its usage sites" (Programming Languages, Web
  Development); `nav-typescript.adoc`/`nav-python.adoc` say "all three". All use absolute `***`/`****` depth.
* **Landing pages:** `backend/index.adoc` (TypeScript Reference bullet l.26-28, NestJS bullet l.29-34, long
  `:description:`/`:keywords:` already containing `Node.js`, `Express 5`, `Fastify`); `web/index.adoc` (JavaScript Development
  bullet, `:description:`/`:keywords:` without Node.js); root `index.adoc` (`:keywords:` already has `NestJS, Node.js, Express,
  Fastify`).
* **Existing Node-related pages:** `programming-languages/javascript/{async-javascript,modules,tooling-bundling-npm-publishing,
  tooling-jest,tooling-eslint-prettier,tooling-babel,browser-workers,stdlib-utilities,exception-handling}.adoc`;
  `programming-languages/typescript/{getting-started,modules,tsconfig-and-compiler-options}.adoc`; `backend/nestjs/*`
  (performance-optimization, lifecycle-events-and-shutdown, deployment, configuration, debugging-and-devtools,
  fastify-and-http-platforms, file-upload-and-streaming, authentication); `web/nextjs/*`; `backend/docker/*`;
  `ai/cli-for-agents/frameworks-node.adoc`, `ai/mcp/nodejs-servers.adoc`.
* **`starting-a-new-project.adoc`:** "=== Backend framework" table (l.359-391) with a `TypeScript / NestJS` row at l.387-390.
* **Templates:** `partials/nestjs-disclaimer.adoc`; `backend/nestjs/cheat-sheet.adoc` and `attachments/nestjs-cheat-sheet.pdf`;
  `images/nestjs-*.svg`; precedents `.archive/implementation_plan_230.md` and `.archive/implementation_plan_253.md`.
* **Tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`; install
  `mermaid@11 jsdom` with `--no-save` first), the `iru-build-docs` skill, headless Chrome and `pdfinfo`/PyMuPDF for the PDF.

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`.
* **Lead paragraph** states the versions written against (Node.js 26 LTS, with 24/22 differences), dated.
* **Content:** what/why; how Node implements it (JS layer, C++ bindings, libuv, V8); every relevant option, flag or API with its
  stability index; pitfalls; differences between Node lines and from the browser; recent changes with versions; where the books are
  outdated. `[source,javascript]` ESM with the `node:` prefix (CommonJS only on CommonJS pages), `[source,typescript]` where type
  stripping is the topic, `[source,bash]`, `[source,text]`/`[source,json]` for output; current APIs only.
* **Every example** is followed by `Source: <official URL>[title]`; **page ending** is `== References` listing only official docs
  (and the books' publisher pages where used).
* **No secrets:** generate keys (`node -p "crypto.randomBytes(32).toString('hex')"`), read from `process.env` via `--env-file`.

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/nodejs-disclaimer.adoc`.
  - [x] Task 1.1. Copy the shape of `partials/nestjs-disclaimer.adoc`: a single `[IMPORTANT]` block with only the AI-assistance disclosure plus `xref:backend/nodejs/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear anywhere under `backend/nodejs/`.
- [x] Task 2. Verify and record the version baseline (scratchpad `257/versions-257.md`) and build the scratch project that every later task cites.
  - [x] Task 2.1. Re-read the release state (https://nodejs.org/en/about/previous-releases, `https://nodejs.org/dist/index.json`, `https://raw.githubusercontent.com/nodejs/Release/main/schedule.json`, `npm view npm dist-tags`): the issue's numbers (26.10.0 Current → LTS 2026-10-28, 24.21.0 Active LTS → Maintenance 2026-10-20, 22.23.3 Maintenance, npm 11.19.1/10.9.9, npm 12.x not bundled, new annual model from Node 27) are re-verified and dated, not copied.
  - [x] Task 2.2. Re-verify the stability levels and version-tagged claims in the issue's "Outdated in the books" list against `https://nodejs.org/docs/latest/api/all.json` and the deprecations page (`require(esm)`, type stripping, permission model, `node:sqlite`, `--env-file`, SEA `--build-sea`, `process.nextTick` Legacy, DEP0190/0169/0205, Corepack removal, `crypto.argon2`); record deviations for `upgrading-and-whats-changed.adoc`.
  - [x] Task 2.3. Re-verify ecosystem versions on npm before naming them (Express 5, Fastify 5 and its plugin majors, `pg`, `mongodb`, `redis`, `bullmq`, `amqplib`, `nodemailer`, `cheerio`, `puppeteer`, `passport`, `jsonwebtoken`, `ws`, `pino`, `@google/genai`, `openai`, `@anthropic-ai/sdk`, `vitest`, `typescript`).
  - [x] Task 2.4. `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}'` every URL in the issue's Bibliography and book table; record canonical forms and 404s (O'Reilly answers 403 to automated fetches, expected; re-confirm via the `oreil.ly` short links `https://oreil.ly/EfficientNodeJS`, `https://oreil.ly/node-projects`).
  - [x] Task 2.5. Re-fetch the Learn index (`https://nodejs.org/en/learn`) and the API table of contents and diff them against the issue's inventory (new/renamed pages since 2026-10-03); add any new page to the matching page task.
  - [x] Task 2.6. Create a throw-away scratch project in the scratchpad with Node 26, 24 and 22 available (nvm/fnm), the *Bookshelf* skeleton (`node:http` API, `node:sqlite`, CLI, CSV stream, worker pool, SSE, tests) and local Postgres/Mongo/Redis/RabbitMQ via Docker for the pages that need them, so every example is run before being pasted. Never commit it.
  - [x] Task 2.7. Check the two book PDFs are only consulted for narrative and never staged: `git status` must never list `node1.pdf` / `node2.pdf`.

### Group 2 — Foundations pages

**Parallelizable: yes (six independent pages; `index.adoc` is written in Group 12)**

- [x] Task 3. Create `introduction-and-architecture.adoc` ("Introduction & Architecture") ★.
  - [x] Task 3.1. Header per "Conventions" (`= Introduction & Architecture`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 3.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: what Node is (runtime, not framework) and history; V8, libuv, C++ bindings, JS core library, Undici, llhttp; non-blocking I/O and the single main thread (plus libuv pool and workers); Node vs the browser; Node vs Deno and Bun; use cases and criticisms (Buna ch. 1).
  - [x] Task 3.3. Figures: SVG `nodejs-layer-stack.svg` (your code → Node APIs → bindings → V8/libuv → OS).
  - [x] Task 3.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/introduction-to-nodejs, differences-between-nodejs-and-the-browser, the-v8-javascript-engine); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 4. Create `installing-nodejs.adoc` ("Installing Node.js").
  - [x] Task 4.1. Header per "Conventions" (`= Installing Node.js`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 4.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: installers, binaries, package managers; nvm/fnm/Volta, `.nvmrc`, `engines`; official Docker images; Windows/WSL; the Corepack removal (25+) and installing pnpm/Yarn now.
  - [x] Task 4.3. Figures: none required.
  - [x] Task 4.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (nodejs.org/en/download, /en/download/package-manager, docs.npmjs.com downloading-and-installing-node-js-and-npm); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 5. Create `release-lines-and-lts.adoc` ("Release Lines & LTS").
  - [x] Task 5.1. Header per "Conventions" (`= Release Lines & LTS`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 5.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: Current/Active LTS/Maintenance/EOL and codenames; the schedule table and the new annual model from Node 27 (alpha channel, every line LTS); choosing a line for production; upgrade strategy.
  - [x] Task 5.3. Figures: Mermaid gantt of the 22/24/26/27 lines.
  - [x] Task 5.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (nodejs.org/en/about/previous-releases, github.com/nodejs/release, the release-schedule announcement); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 6. Create `running-scripts-cli-and-repl.adoc` ("Running Scripts, the CLI & the REPL") ★.
  - [x] Task 6.1. Header per "Conventions" (`= Running Scripts, the CLI & the REPL`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 6.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `node file`, `-e`/`-p`/`-c`, shebangs, `process.argv`; `--watch`/`--watch-path`; `node --run`; the REPL (commands, `.editor`, `.load`/`.save`, `_`, top-level await, custom REPL with `node:repl`).
  - [x] Task 6.3. Figures: none required.
  - [x] Task 6.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: command-line/run-nodejs-scripts-from-the-command-line, how-to-use-the-nodejs-repl; API: cli.html, repl.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 7. Create `cli-options-environment-and-config-file.adoc` ("CLI Options, Environment & Config File").
  - [x] Task 7.1. Header per "Conventions" (`= CLI Options, Environment & Config File`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 7.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: flags by category; `NODE_OPTIONS`, `NODE_DEBUG`, `NODE_PATH` (CJS only, OS path separator); `-r` vs `--import`; `--env-file`/`--env-file-if-exists`/`process.loadEnvFile()`/`util.parseEnv()`; `node.config.json`; `--disable-warning`, `--v8-options`.
  - [x] Task 7.3. Figures: none required.
  - [x] Task 7.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: cli.html, environment_variables.html; Learn: how-to-read-environment-variables-from-nodejs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 8. Create `globals-and-web-platform-apis.adoc` ("Globals & Web Platform APIs").
  - [x] Task 8.1. Header per "Conventions" (`= Globals & Web Platform APIs`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 8.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `globalThis`; `fetch`, `URL`/`URLPattern`, `AbortController`, `structuredClone`, `queueMicrotask`; `TextEncoder`/`Decoder`, `Blob`, `BroadcastChannel`/`MessageChannel`, `performance`, `navigator`; Web Storage, `Temporal`; Legacy globals; the stability index explained once for the section.
  - [x] Task 8.3. Figures: none required.
  - [x] Task 8.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: globals.html, documentation.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 3 — Modules & packages pages

**Parallelizable: yes (six independent pages)**

- [x] Task 9. Create `commonjs-modules.adoc` ("CommonJS Modules").
  - [x] Task 9.1. Header per "Conventions" (`= CommonJS Modules`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 9.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `require`, module wrapper, `__filename`/`__dirname`; `exports` vs `module.exports`; resolution algorithm and `node_modules` walk, `require.resolve`, caching, cycles; `require.main`, JSON/add-on loading, folders as modules (Legacy).
  - [x] Task 9.3. Figures: none required.
  - [x] Task 9.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: modules.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 10. Create `ecmascript-modules.adoc` ("ECMAScript Modules") ★.
  - [x] Task 10.1. Header per "Conventions" (`= ECMAScript Modules`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 10.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `import`/`export` and mandatory extensions; `.mjs`/`.cjs`/`"type"` and syntax detection; `import.meta` (`url`, `dirname`, `filename`, `main`, `resolve`); dynamic `import()`, top-level await; import attributes, Wasm/text modules; the ESM resolution algorithm; links the JavaScript modules page for syntax.
  - [x] Task 10.3. Figures: none required.
  - [x] Task 10.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: esm.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 11. Create `esm-cjs-interop.adoc` ("ESM & CommonJS Interop") ★.
  - [x] Task 11.1. Header per "Conventions" (`= ESM & CommonJS Interop`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 11.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: importing CJS from ESM (named-export detection); `require(esm)` (stable 25.4; `ERR_REQUIRE_ASYNC_MODULE`, `'module.exports'` export name, `process.features.require_module`); `createRequire`, `module.isBuiltin`; customization hooks with `module.registerHooks()` and `module.register()` deprecated; migrating a CJS project to ESM.
  - [x] Task 11.3. Figures: Mermaid decision chart "which loader runs my file?".
  - [x] Task 11.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: modules.html, esm.html, module.html, packages.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 12. Create `package-json-exports-and-imports.adoc` ("package.json, exports & imports") ★.
  - [x] Task 12.1. Header per "Conventions" (`= package.json, exports & imports`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 12.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `name`/`version`/`type`/`main`/`bin`/`files`/`engines`; `"exports"` (subpaths, patterns, conditions `node`/`import`/`require`/`module-sync`/`default`); `"imports"` (`#` aliases); dual packages and the dual-package hazard; self-referencing; package maps (experimental).
  - [x] Task 12.3. Figures: none required.
  - [x] Task 12.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: packages.html; npm: cli/v12/configuring-npm/package-json); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 13. Create `npm-and-package-management.adoc` ("npm & Package Management") ★.
  - [x] Task 13.1. Header per "Conventions" (`= npm & Package Management`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 13.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: CLI tour (`install` forms, `show`, `ls`, `outdated`, `update`, `uninstall`, `prune`, `link`, `cache`); SemVer ranges and `--save-exact`; `package-lock.json` and `npm ci`, `--omit=dev`; dependency types, `overrides`; scripts (lifecycle, `pre`/`post`, `--`, local `.bin`), `npx`; `npm audit`, global vs local; npm 12 changes (install scripts blocked by default, `allowScripts`), `min-release-age`; links the JS publishing page.
  - [x] Task 13.3. Figures: none required.
  - [x] Task 13.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: an-introduction-to-the-npm-package-manager; npm docs: about-semantic-versioning, cli/v12 scripts, npx, npm-ci, package-lock-json); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 14. Create `workspaces-and-publishing.adoc` ("Workspaces & Publishing").
  - [x] Task 14.1. Header per "Conventions" (`= Workspaces & Publishing`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 14.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: npm workspaces and monorepos (`-w`/`--workspaces`); pnpm and Yarn as alternatives (no Corepack); `npm link`; what publishing adds for Node packages (`exports`, `engines`, TypeScript packages, provenance, trusted publishing); links `tooling-bundling-npm-publishing.adoc` for the basics.
  - [x] Task 14.3. Figures: none required.
  - [x] Task 14.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (npm docs: using-npm/workspaces, generating-provenance-statements, trusted-publishers, staged-publishing; Learn: modules/publishing-a-package, typescript/publishing-a-ts-package); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 4 — Asynchrony pages

**Parallelizable: yes (six independent pages)**

- [x] Task 15. Create `event-loop.adoc` ("The Event Loop") ★.
  - [x] Task 15.1. Header per "Conventions" (`= The Event Loop`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 15.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: libuv phases (timers → pending → idle/prepare → poll → check → close); microtask queue and `process.nextTick` (Legacy) vs `queueMicrotask` vs `setImmediate` vs `setTimeout(0)` ordering; libuv thread pool (fs, `dns.lookup`, crypto, zlib), `UV_THREADPOOL_SIZE`, vs OS async network I/O; why "single-threaded" is a simplification.
  - [x] Task 15.3. Figures: SVG `nodejs-event-loop-phases.svg` (the central figure of the section) and a Mermaid sequence of an fs read through the thread pool.
  - [x] Task 15.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: asynchronous-work/event-loop-timers-and-nexttick, understanding-processnexttick, understanding-setimmediate); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 16. Create `callbacks-promises-and-async-await.adoc` ("Callbacks, Promises & async/await") ★.
  - [x] Task 16.1. Header per "Conventions" (`= Callbacks, Promises & async/await`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 16.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: error-first callbacks, callback hell, Zalgo; promises, chaining, `util.promisify`/`callbackify`, `*/promises` variants; `Promise.all`/`allSettled`/`any`/`race` (and why `await [p1, p2]` is not `Promise.all`); async/await, `for await`, top-level await; flow control; unhandled rejections.
  - [x] Task 16.3. Figures: none required.
  - [x] Task 16.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: asynchronous-work/javascript-asynchronous-programming-and-callbacks, discover-promises-in-nodejs, asynchronous-flow-control); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 17. Create `timers.adoc` ("Timers").
  - [x] Task 17.1. Header per "Conventions" (`= Timers`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 17.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `setTimeout`/`setInterval`/`setImmediate`, `ref`/`unref`; `node:timers/promises` (`setTimeout`, async-iterable `setInterval`, `scheduler.wait`/`yield`); timer accuracy.
  - [x] Task 17.3. Figures: none required.
  - [x] Task 17.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: discover-javascript-timers; API: timers.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 18. Create `events-and-eventemitter.adoc` ("Events & EventEmitter") ★.
  - [x] Task 18.1. Header per "Conventions" (`= Events & EventEmitter`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 18.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `EventEmitter` API, max listeners; synchronous emission, the special `'error'` event, `errorMonitor`, `captureRejections`; `events.once()`/`events.on()` async iteration; `EventTarget`/`Event`, `addAbortListener`; built-in emitters.
  - [x] Task 18.3. Figures: none required.
  - [x] Task 18.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: the-nodejs-event-emitter; API: events.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 19. Create `dont-block-the-event-loop.adoc` ("Don't Block the Event Loop").
  - [x] Task 19.1. Header per "Conventions" (`= Don't Block the Event Loop`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 19.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: blocking vs non-blocking; CPU-heavy work, ReDoS, JSON cost, sync APIs in servers; partitioning vs offloading; measuring with `monitorEventLoopDelay`/`eventLoopUtilization`.
  - [x] Task 19.3. Figures: Mermaid of request latency with and without a blocked loop.
  - [x] Task 19.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: overview-of-blocking-vs-non-blocking, dont-block-the-event-loop); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 20. Create `async-context-and-cancellation.adoc` ("Async Context & Cancellation").
  - [x] Task 20.1. Header per "Conventions" (`= Async Context & Cancellation`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 20.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `AsyncLocalStorage` (request context, log correlation, AsyncContextFrame in 24+) and `async_hooks` as legacy; `AbortController`/`AbortSignal` (`timeout`, `any`) across fs, timers, fetch, events and child processes; explicit resource management (`using`/`await using`, `Symbol.dispose`; DEP0209).
  - [x] Task 20.3. Figures: none required.
  - [x] Task 20.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: async_context.html, globals.html, deprecations.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 5 — Core API pages

**Parallelizable: yes (six independent pages)**

- [x] Task 21. Create `process-signals-and-exit-codes.adoc` ("Process, Signals & Exit Codes") ★.
  - [x] Task 21.1. Header per "Conventions" (`= Process, Signals & Exit Codes`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 21.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `process` (`argv`, `env` semantics, `cwd`, `pid`, `platform`, `memoryUsage`, `hrtime.bigint`); exit codes, `exitCode` vs `exit()`; signals (`SIGINT`, `SIGTERM`, `SIGUSR2`, `SIGUSR1` reserved for the inspector, Windows limits); `'beforeExit'`/`'exit'`, `process.getBuiltinModule`, `process.features`.
  - [x] Task 21.3. Figures: none required.
  - [x] Task 21.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: process.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 22. Create `errors-and-error-handling.adoc` ("Errors & Error Handling") ★.
  - [x] Task 22.1. Header per "Conventions" (`= Errors & Error Handling`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 22.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: standard JS errors, system errors and `error.code` (`ENOENT`, `EADDRINUSE`, `ECONNREFUSED`, `ENOTFOUND`…), `ERR_*` catalogue; custom errors, `cause`, `AggregateError`, `Error.isError`, `Error.captureStackTrace`; operational vs programmer errors, rethrowing; `'uncaughtException'`/`'unhandledRejection'` policy; assertion errors.
  - [x] Task 22.3. Figures: none required.
  - [x] Task 22.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: errors.html, process.html, assert.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 23. Create `buffers-and-binary-data.adoc` ("Buffers & Binary Data").
  - [x] Task 23.1. Header per "Conventions" (`= Buffers & Binary Data`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 23.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `Buffer` (`from`, `alloc`, `allocUnsafe`, `concat`, encodings, `subarray`), `SlowBuffer` removed; TypedArrays/`ArrayBuffer`, `Uint8Array` base64/hex helpers; `StringDecoder`, `TextEncoder`/`TextDecoder`, `Blob`/`File`.
  - [x] Task 23.3. Figures: none required.
  - [x] Task 23.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: buffer.html, string_decoder.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 24. Create `util-module.adoc` ("The util Module").
  - [x] Task 24.1. Header per "Conventions" (`= The util Module`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 24.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `promisify`, `inspect`, `format`, `parseArgs`, `styleText` (and the chalk codemod), `types`; `isDeepStrictEqual`, `deprecate`, `debuglog`, `MIMEType`, `getCallSites`, `aborted`; removed `util.is*` helpers.
  - [x] Task 24.3. Figures: none required.
  - [x] Task 24.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: util.html; Learn: userland-migrations/chalk-to-util-styletext); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 25. Create `os-path-and-url.adoc` ("os, path & URL").
  - [x] Task 25.1. Header per "Conventions" (`= os, path & URL`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 25.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `os` (`availableParallelism`, `cpus`, `homedir`, `tmpdir`, `EOL`, `constants`); `path` (`join`/`resolve`/`relative`/`parse`, `posix`/`win32`, `matchesGlob`); WHATWG `URL`/`URLSearchParams`/`URLPattern`, `fileURLToPath`/`pathToFileURL`; why `url.parse` and `querystring` are legacy.
  - [x] Task 25.3. Figures: none required.
  - [x] Task 25.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: os.html, path.html, url.html; Learn: manipulating-files/nodejs-file-paths); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 26. Create `console-readline-and-terminal-io.adoc` ("Console, readline & Terminal I/O").
  - [x] Task 26.1. Header per "Conventions" (`= Console, readline & Terminal I/O`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 26.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `console` (`table`, `time`, `group`, `trace`, custom `Console`); stdin/stdout/stderr as streams; `readline/promises` (`question`, line-by-line file reading, masked input); `tty` (`isatty`, colours, columns).
  - [x] Task 26.3. Figures: none required.
  - [x] Task 26.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: command-line/output-to-the-command-line-using-nodejs, accept-input-from-the-command-line-in-nodejs; API: console.html, readline.html, tty.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 6 — Files, streams and data pages

**Parallelizable: yes (eight independent pages)**

- [x] Task 27. Create `file-system.adoc` ("File System") ★.
  - [x] Task 27.1. Header per "Conventions" (`= File System`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 27.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: the three API styles (promises, callback, sync) and when sync is acceptable; reading/writing, flags and modes, `FileHandle`, file descriptors; stats, permissions, symlinks; the 2 GiB `readFile` limit; different filesystems (all seven Learn Manipulating Files articles).
  - [x] Task 27.3. Figures: none required.
  - [x] Task 27.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: manipulating-files/*; API: fs.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 28. Create `directories-glob-and-watch.adoc` ("Directories, Glob & Watch").
  - [x] Task 28.1. Header per "Conventions" (`= Directories, Glob & Watch`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 28.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `readdir` (recursive, `Dirent`), `mkdir -p`, `rm`/`cp`, `mkdtemp`; `fs.glob`; `fs.watch` vs `watchFile` and platform caveats.
  - [x] Task 28.3. Figures: none required.
  - [x] Task 28.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: working-with-folders-in-nodejs; API: fs.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 29. Create `streams.adoc` ("Streams") ★.
  - [x] Task 29.1. Header per "Conventions" (`= Streams`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 29.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: why streams exist (the memory benchmark); Readable/Writable/Duplex/Transform/PassThrough, flowing vs paused; events and methods; backpressure (`write()` → `false`, `'drain'`), `highWaterMark` (64 KiB default); `pipeline` (`node:stream/promises`), `finished`, async iteration; error handling and cleanup; Readable operators, `compose`.
  - [x] Task 29.3. Figures: SVG `nodejs-stream-pipeline.svg` (pipeline with backpressure) and a Mermaid paused/flowing state diagram.
  - [x] Task 29.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: modules/how-to-use-streams, backpressuring-in-streams; API: stream.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 30. Create `implementing-custom-streams.adoc` ("Implementing Custom Streams").
  - [x] Task 30.1. Header per "Conventions" (`= Implementing Custom Streams`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 30.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: Readable (`read`/`push`), Writable (`write`/`final`), Duplex and Transform (the *Bookshelf* CSV parser); `Readable.from` with (async) generators, generators as pipeline stages; object mode; `stream/iter` (experimental) preview.
  - [x] Task 30.3. Figures: none required.
  - [x] Task 30.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: stream.html, stream_iter.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 31. Create `web-streams-and-interop.adoc` ("Web Streams & Interop").
  - [x] Task 31.1. Header per "Conventions" (`= Web Streams & Interop`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 31.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `ReadableStream`/`WritableStream`/`TransformStream`, `TextEncoderStream`, `CompressionStream`; `Readable.toWeb`/`fromWeb`; when to use which.
  - [x] Task 31.3. Figures: none required.
  - [x] Task 31.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: webstreams.html, stream.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 32. Create `compression-with-zlib.adoc` ("Compression with zlib").
  - [x] Task 32.1. Header per "Conventions" (`= Compression with zlib`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 32.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: gzip/deflate/brotli streams and one-shot calls, zstd (experimental), `crc32`, ZIP APIs (experimental); HTTP content encoding; CPU cost (thread pool).
  - [x] Task 32.3. Figures: none required.
  - [x] Task 32.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: zlib.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 33. Create `sqlite-builtin.adoc` ("Built-in SQLite").
  - [x] Task 33.1. Header per "Conventions" (`= Built-in SQLite`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 33.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `node:sqlite` (Release Candidate): `DatabaseSync`, `prepare` → `run`/`get`/`all`/`iterate`; transactions, user functions, sessions/changesets, `backup()`, tagged statements; when to move to a server database.
  - [x] Task 33.3. Figures: none required.
  - [x] Task 33.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: sqlite.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 34. Create `databases-from-nodejs.adoc` ("Databases from Node.js").
  - [x] Task 34.1. Header per "Conventions" (`= Databases from Node.js`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 34.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: PostgreSQL (`pg`), MongoDB (official driver), Redis (node-redis/ioredis), SQLite; connection pooling, parameterised queries, transactions, migrations; ORM/query-builder comparison (Prisma, Drizzle, Sequelize, TypeORM, Mongoose) as pointers only; the IPv6 `localhost` pitfall; links `database/*`.
  - [x] Task 34.3. Figures: none required.
  - [x] Task 34.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (each driver's official docs (node-postgres, MongoDB Node.js driver, node-redis)); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 7 — Networking and HTTP pages

**Parallelizable: yes (six independent pages)**

- [x] Task 35. Create `http-server-fundamentals.adoc` ("HTTP Server Fundamentals") ★.
  - [x] Task 35.1. Header per "Conventions" (`= HTTP Server Fundamentals`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 35.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: anatomy of an HTTP transaction; `http.createServer`, `IncomingMessage`/`ServerResponse`; reading bodies as streams, status codes and headers, routing without a framework (`URLPattern`); static files with streams, `listen({ port: 0 })`; keep-alive and `Agent`.
  - [x] Task 35.3. Figures: Mermaid sequence of a request/response through the server.
  - [x] Task 35.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: http/anatomy-of-an-http-transaction; API: http.html, synopsis.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 36. Create `https-tls-and-http2.adoc` ("HTTPS, TLS & HTTP/2").
  - [x] Task 36.1. Header per "Conventions" (`= HTTPS, TLS & HTTP/2`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 36.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `https.createServer` with certificates (self-signed for dev), `tls` options, SNI/ALPN, `getCACertificates`; HTTP/2 (`createSecureServer`, sessions/streams, compat API); why server push is gone.
  - [x] Task 36.3. Figures: none required.
  - [x] Task 36.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: https.html, tls.html, http2.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 37. Create `fetch-and-http-clients.adoc` ("fetch & HTTP Clients") ★.
  - [x] Task 37.1. Header per "Conventions" (`= fetch & HTTP Clients`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 37.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: global `fetch` (Undici): requests, JSON, streaming bodies, `AbortSignal.timeout`; retries with backoff and `Retry-After`, concurrency limits; `http.request`, agents, keep-alive; proxies (`NODE_USE_ENV_PROXY`, enterprise CAs); migrating from axios.
  - [x] Task 37.3. Figures: none required.
  - [x] Task 37.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/fetch, http/enterprise-network-configuration, userland-migrations/axios-to-whatwg-fetch; API: globals.html, http.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 38. Create `websockets-and-server-sent-events.adoc` ("WebSockets & Server-Sent Events").
  - [x] Task 38.1. Header per "Conventions" (`= WebSockets & Server-Sent Events`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 38.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: the built-in `WebSocket` client; WebSocket servers (the `'upgrade'` event, `ws`; Socket.IO as a pointer); SSE with `node:http` (the *Bookshelf* "new review" feed); scaling fan-out across processes (`BroadcastChannel`, Redis Pub/Sub).
  - [x] Task 38.3. Figures: none required.
  - [x] Task 38.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/websocket; API: globals.html, http.html; `ws` docs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 39. Create `tcp-udp-and-dns.adoc` ("TCP, UDP & DNS").
  - [x] Task 39.1. Header per "Conventions" (`= TCP, UDP & DNS`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 39.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `net` servers/sockets, IPC sockets, `BlockList`, Happy Eyeballs; `dgram`; `dns.lookup` (thread pool) vs `dns.resolve*`, `setDefaultResultOrder`.
  - [x] Task 39.3. Figures: none required.
  - [x] Task 39.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: net.html, dgram.html, dns.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 40. Create `server-timeouts-limits-and-hardening.adoc` ("Server Timeouts, Limits & Hardening").
  - [x] Task 40.1. Header per "Conventions" (`= Server Timeouts, Limits & Hardening`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 40.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `headersTimeout`/`requestTimeout`/`keepAliveTimeout`, max headers; body size limits, slowloris; HTTP request smuggling (CWE-444); running behind a reverse proxy (trust proxy, `X-Forwarded-*`).
  - [x] Task 40.3. Figures: none required.
  - [x] Task 40.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/security-best-practices; API: http.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 8 — Concurrency and testing pages

**Parallelizable: yes (six independent pages)**

- [x] Task 41. Create `concurrency-models.adoc` ("Concurrency Models").
  - [x] Task 41.1. Header per "Conventions" (`= Concurrency Models`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 41.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: event loop vs worker threads vs child processes vs cluster vs multiple containers; cloning/decomposing/splitting scaling strategies (Buna ch. 9).
  - [x] Task 41.3. Figures: Mermaid decision chart.
  - [x] Task 41.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: concurrency/comparing-nodejs-concurrency-models); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 42. Create `worker-threads.adoc` ("Worker Threads") ★.
  - [x] Task 42.1. Header per "Conventions" (`= Worker Threads`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 42.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `Worker`, `isMainThread`, `parentPort`, `workerData`; `MessageChannel`, transferables, `SharedArrayBuffer`/`Atomics`, `resourceLimits`; a worker pool (the *Bookshelf* cover hashing and a proof-of-work example); `worker_threads` vs Web Workers and the experimental web `Worker` global.
  - [x] Task 42.3. Figures: none required.
  - [x] Task 42.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: worker_threads.html; link `programming-languages/javascript/browser-workers.adoc` both ways); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 43. Create `child-processes.adoc` ("Child Processes") ★.
  - [x] Task 43.1. Header per "Conventions" (`= Child Processes`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 43.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `spawn`/`exec`/`execFile`/`fork` and sync variants, events (`exit` vs `close`), stdio options; `cwd`/`env`/`detached`/`unref`, `AbortSignal`; shell injection and DEP0190, Windows `.bat`/`.cmd`; `fork` + IPC done right (bounded, terminated children).
  - [x] Task 43.3. Figures: none required.
  - [x] Task 43.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: child_process.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 44. Create `cluster-and-scaling.adoc` ("Cluster & Scaling") ★.
  - [x] Task 44.1. Header per "Conventions" (`= Cluster & Scaling`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 44.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `node:cluster` (primary/workers, scheduling policy, `availableParallelism`), IPC messaging; auto-restart and zero-downtime rolling restarts; state outside the process, sticky sessions done correctly (`pauseOnConnect` + handle passing); PM2, cluster vs container replicas; load testing (autocannon/Artillery).
  - [x] Task 44.3. Figures: Mermaid of primary → workers with a rolling restart.
  - [x] Task 44.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: cluster.html, os.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 45. Create `test-runner.adoc` ("The Test Runner") ★.
  - [x] Task 45.1. Header per "Conventions" (`= The Test Runner`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 45.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `node --test` file discovery; `test`/`describe`/`it`, hooks, subtests, `t.plan`; `node:assert/strict`; `skip`/`todo`/`only`, name/skip patterns, `--watch`, reporters, concurrency, isolation, sharding, rerunning failures; test types and test doubles, TDD; testing an HTTP server; `node:test` vs Jest/Vitest/Mocha (and the Mocha codemod); links `programming-languages/javascript/tooling-jest.adoc`.
  - [x] Task 45.3. Figures: none required.
  - [x] Task 45.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: test-runner/introduction, using-test-runner, userland-migrations/mocha-to-node-test-runner; API: test.html, assert.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 46. Create `mocking-snapshots-and-coverage.adoc` ("Mocking, Snapshots & Coverage").
  - [x] Task 46.1. Header per "Conventions" (`= Mocking, Snapshots & Coverage`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 46.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `mock.fn`/`method`/`property`/`timers`/`module` (experimental), `t.mock` auto-restore; snapshot testing (`--test-update-snapshots`); coverage (`--experimental-test-coverage`, thresholds, include/exclude); CI gates.
  - [x] Task 46.3. Figures: none required.
  - [x] Task 46.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: test-runner/mocking, collecting-code-coverage; API: test.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 9 — Diagnostics, security and TypeScript pages

**Parallelizable: yes (nine independent pages)**

- [x] Task 47. Create `debugging.adoc` ("Debugging") ★.
  - [x] Task 47.1. Header per "Conventions" (`= Debugging`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 47.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `--inspect`/`--inspect-brk`/`--inspect-wait`, Chrome DevTools, the VS Code debugger, `node inspect`, `debugger;`; source maps; `--trace-warnings`/`--trace-uncaught`/`--trace-deprecation`/`--trace-sync-io`; `NODE_DEBUG`; network inspection; debugging remotely and safely.
  - [x] Task 47.3. Figures: none required.
  - [x] Task 47.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/debugging, diagnostics/live-debugging/*; API: debugger.html, inspector.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 48. Create `profiling-and-performance.adoc` ("Profiling & Performance").
  - [x] Task 48.1. Header per "Conventions" (`= Profiling & Performance`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 48.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `--cpu-prof`, `--prof`, flame graphs, Linux `perf`; `perf_hooks` (`mark`/`measure`, `timerify`, histograms); event-loop delay and utilisation; the compile cache; `node:bench` (experimental).
  - [x] Task 48.3. Figures: none required.
  - [x] Task 48.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/profiling, diagnostics/flame-graphs, diagnostics/poor-performance/*; API: perf_hooks.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 49. Create `memory-and-leaks.adoc` ("Memory & Leaks").
  - [x] Task 49.1. Header per "Conventions" (`= Memory & Leaks`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 49.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: V8 heap spaces and GC; `--max-old-space-size(-percentage)`; heap snapshots (`--heapsnapshot-signal`, `v8.writeHeapSnapshot`), the heap profiler, GC traces; common leak patterns (listeners, closures, caches, timers).
  - [x] Task 49.3. Figures: none required.
  - [x] Task 49.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: diagnostics/memory/* (five pages); API: v8.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 50. Create `diagnostic-reports-logging-and-observability.adoc` ("Diagnostic Reports, Logging & Observability").
  - [x] Task 50.1. Header per "Conventions" (`= Diagnostic Reports, Logging & Observability`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 50.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: diagnostic reports (`--report-*`, `process.report`); `diagnostics_channel` and `TracingChannel`, trace events; structured logging (pino), correlation with `AsyncLocalStorage`; OpenTelemetry for Node (auto-instrumentation via `--import`); health and metrics endpoints.
  - [x] Task 50.3. Figures: none required.
  - [x] Task 50.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: diagnostics/user-journey; API: report.html, diagnostics_channel.html, tracing.html; OpenTelemetry JS docs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 51. Create `security-best-practices.adoc` ("Security Best Practices") ★.
  - [x] Task 51.1. Header per "Conventions" (`= Security Best Practices`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 51.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: the official guide's threat model and CWE list: DoS, DNS rebinding, sensitive-information exposure, request smuggling, timing attacks; malicious third-party modules and the supply chain (`npm ci`, lockfiles, `npm audit`, signatures and provenance, npm 12 script policy, `min-release-age`, typosquatting); memory access, monkey patching, prototype pollution; uncontrolled search path, injection, `vm` is not a sandbox; hardening flags; security releases and reporting.
  - [x] Task 51.3. Figures: none required.
  - [x] Task 51.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/security-best-practices; nodejs.org/en/about/security-reporting; npm docs threats-and-mitigations); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 52. Create `permission-model.adoc` ("The Permission Model").
  - [x] Task 52.1. Header per "Conventions" (`= The Permission Model`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 52.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `--permission` and the `--allow-*` flags (fs, child process, worker, addons, WASI, net, inspector, FFI); `--permission-audit`; `process.permission.has()`; the config-file `"permission"` block; what it is (a seat belt) and is not (a sandbox for malicious code).
  - [x] Task 52.3. Figures: none required.
  - [x] Task 52.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: permissions.html, cli.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 53. Create `crypto-passwords-and-secrets.adoc` ("Crypto, Passwords & Secrets") ★.
  - [x] Task 53.1. Header per "Conventions" (`= Crypto, Passwords & Secrets`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 53.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `randomUUID`/`randomBytes`, hashing, HMAC; password storage (`scrypt`, `argon2` 24.7+, PBKDF2 parameters, async APIs, `timingSafeEqual`); authenticated encryption (AES-256-GCM with IV and auth tag); key pairs, `sign`/`verify`, Web Crypto; a hash-chain example (Wexler ch. 12 concepts, done correctly); secrets handling; OWASP password guidance.
  - [x] Task 53.3. Figures: none required.
  - [x] Task 53.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: crypto.html, webcrypto.html; OWASP Password Storage Cheat Sheet); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 54. Create `typescript-in-nodejs.adoc` ("TypeScript in Node.js") ★.
  - [x] Task 54.1. Header per "Conventions" (`= TypeScript in Node.js`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 54.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: native type stripping (stable): `.ts`/`.mts`/`.cts`, erasable syntax only, `import type`, `--no-strip-types`, no `.tsx`, none in `node_modules`; recommended `tsconfig` (`nodenext`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`); `tsc --noEmit`; transpiling and runners (tsx) as alternatives; `@types/node`; publishing TS packages; links the TypeScript Reference.
  - [x] Task 54.3. Figures: none required.
  - [x] Task 54.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: typescript/* (five pages); API: typescript.html; Learn userland-migrations/correct-ts-specifiers); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 55. Create `linting-formatting-and-tooling.adoc` ("Linting, Formatting & Tooling").
  - [x] Task 55.1. Header per "Conventions" (`= Linting, Formatting & Tooling`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 55.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: ESLint flat config for Node (`globals.node`), Prettier; bundling a Node app (esbuild/Rolldown) and when not to; git hooks; replacing task runners with `node --run`; links the JavaScript tooling pages.
  - [x] Task 55.3. Figures: none required.
  - [x] Task 55.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (ESLint and Prettier official docs; API: cli.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 10 — Building applications pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 56. Create `building-a-rest-api.adoc` ("Building a REST API") ★.
  - [x] Task 56.1. Header per "Conventions" (`= Building a REST API`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 56.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: the *Bookshelf* API with only built-ins: `node:http` + `URLPattern` routing, JSON body parsing with limits; validation, consistent error responses (problem details), CORS; `node:sqlite` persistence, pagination; logging, graceful shutdown; `node:test` e2e tests.
  - [x] Task 56.3. Figures: Mermaid of the request pipeline.
  - [x] Task 56.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: http.html, globals.html, sqlite.html; Learn: http/anatomy-of-an-http-transaction); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 57. Create `web-frameworks-express-and-fastify.adoc` ("Web Frameworks: Express & Fastify") ★.
  - [x] Task 57.1. Header per "Conventions" (`= Web Frameworks: Express & Fastify`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 57.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: why frameworks exist; Express 5 (routing, middleware, `express.json()`, async error handling, path syntax changes); Fastify 5 (plugins and encapsulation, JSON-schema validation/serialisation, hooks, `inject` for tests, Pino); templating and static files; comparison table (Express, Fastify, Koa, Hapi, AdonisJS, Hono, NestJS); links NestJS and Next.js.
  - [x] Task 57.3. Figures: none required.
  - [x] Task 57.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Express and Fastify official docs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 58. Create `authentication-and-sessions.adoc` ("Authentication & Sessions").
  - [x] Task 58.1. Header per "Conventions" (`= Authentication & Sessions`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 58.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: sessions + cookies (flags, rotation) vs stateless JWTs (expiry, pinned algorithms, refresh), Passport strategies; CSRF protection, rate limiting and lockout; email verification tokens; links `backend/oauth/*`.
  - [x] Task 58.3. Figures: none required.
  - [x] Task 58.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Passport, jsonwebtoken and Fastify plugin docs; OWASP); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 59. Create `building-cli-tools.adoc` ("Building CLI Tools").
  - [x] Task 59.1. Header per "Conventions" (`= Building CLI Tools`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 59.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: `bin` + shebang, `util.parseArgs`, `readline/promises` prompts, `styleText`; exit codes and signals, stdin/stdout piping; config files, packaging and distribution (npm, SEA); links `ai/cli-for-agents/frameworks-node.adoc`.
  - [x] Task 59.3. Figures: none required.
  - [x] Task 59.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: util.html, readline.html, process.html; npm docs package-json#bin); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 60. Create `background-jobs-scheduling-and-queues.adoc` ("Background Jobs, Scheduling & Queues").
  - [x] Task 60.1. Header per "Conventions" (`= Background Jobs, Scheduling & Queues`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 60.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: in-process timers vs cron-style schedulers; BullMQ (queues, workers, retries, backoff); RabbitMQ with `amqplib` (durable queues, persistent messages, prefetch, ack after processing, confirms); Redis Streams vs Pub/Sub (Pub/Sub is not durable); idempotency; links `backend/messaging/*`.
  - [x] Task 60.3. Figures: none required.
  - [x] Task 60.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (BullMQ, amqplib and RabbitMQ official docs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 61. Create `email-feeds-and-web-scraping.adoc` ("Email, Feeds & Web Scraping").
  - [x] Task 61.1. Header per "Conventions" (`= Email, Feeds & Web Scraping`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 61.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: Nodemailer (transports, HTML + text, templating, SPF/DKIM/DMARC and List-Unsubscribe basics, consent); consuming RSS/Atom feeds with `fetch`; scraping responsibly (robots.txt, terms of service, rate limits, honest user agent), Cheerio for static HTML, Puppeteer/Playwright for rendered pages.
  - [x] Task 61.3. Figures: none required.
  - [x] Task 61.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Nodemailer, Cheerio, Puppeteer official docs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 62. Create `integrating-llm-apis.adoc` ("Integrating LLM APIs").
  - [x] Task 62.1. Header per "Conventions" (`= Integrating LLM APIs`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 62.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: official SDKs (`@google/genai`, `openai`, `@anthropic-ai/sdk`); streaming responses, structured JSON output, retries and rate limits; keeping keys server-side; prompt-injection risks and validating model output; links the `ai/*` sections.
  - [x] Task 62.3. Figures: none required.
  - [x] Task 62.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (each SDK's official docs); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 11 — Production and beyond-the-basics pages

**Parallelizable: yes (five independent pages)**

- [x] Task 63. Create `production-deployment.adoc` ("Production Deployment") ★.
  - [x] Task 63.1. Header per "Conventions" (`= Production Deployment`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 63.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: development vs production, `NODE_ENV`; process managers (systemd, PM2) vs orchestrators; graceful shutdown (`SIGTERM` → stop accepting → drain → close resources); health/readiness endpoints, reverse proxies and TLS termination; memory sizing in containers; logging to stdout.
  - [x] Task 63.3. Figures: Mermaid timeline of a graceful shutdown.
  - [x] Task 63.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: getting-started/nodejs-the-difference-between-development-and-production; API: process.html, http.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 64. Create `docker-and-containers.adoc` ("Docker & Containers").
  - [x] Task 64.1. Header per "Conventions" (`= Docker & Containers`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 64.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: the Node-specific multi-stage Dockerfile (`npm ci --omit=dev`, `USER node`, slim image); PID 1 and signal forwarding (`--init`/`tini`), `.dockerignore`; Compose for local dependencies; Kubernetes probes; links `backend/docker/*` and `backend/kubernetes/*`.
  - [x] Task 64.3. Figures: none required.
  - [x] Task 64.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Docker official Node image docs; docs.docker.com); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 65. Create `single-executable-applications.adoc` ("Single Executable Applications").
  - [x] Task 65.1. Header per "Conventions" (`= Single Executable Applications`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 65.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: SEA with `--build-sea` (25.5+), `sea-config.json` (assets, snapshot, code cache); `node:sea` APIs, signing on macOS/Windows; limitations; `node:vfs` for assets (experimental).
  - [x] Task 65.3. Figures: none required.
  - [x] Task 65.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: single-executable-applications.html, vfs.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 66. Create `upgrading-and-whats-changed.adoc` ("Upgrading & What's Changed") ★.
  - [x] Task 66.1. Header per "Conventions" (`= Upgrading & What's Changed`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 66.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: upgrading across majors (changelog, `--trace-deprecation`, Userland Migrations codemods); the deprecations table (DEP codes with doc-only/runtime/EOL status); per-major highlights for 22, 23, 24, 25 and 26; all outdated book statements collected in one place (from Task 2.2 deviations and the issue's lists).
  - [x] Task 66.3. Figures: none required.
  - [x] Task 66.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (API: deprecations.html; Learn: getting-started/userland-migrations; nodejs.org/en/blog/release/*); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.
- [x] Task 67. Create `native-addons-webassembly-and-ffi.adoc` ("Native Add-ons, WebAssembly & FFI").
  - [x] Task 67.1. Header per "Conventions" (`= Native Add-ons, WebAssembly & FFI`, `:description:`, `:keywords:`, blank line, `include::partial$nodejs-disclaimer.adoc[]`); lead paragraph with the dated version baseline (Node.js 26 LTS, with 24/22 differences) and the stability level of each API covered.
  - [x] Task 67.2. Cover **every** bullet of this page's outline in issue #257 (`gh issue view 257`, section "Page outline"). Key topics: Node-API (C/C++ add-ons, node-gyp/cmake-js, ABI stability, importing add-ons); WebAssembly and WASI; `node:ffi` (experimental, `--allow-ffi`); when each is worth it.
  - [x] Task 67.3. Figures: none required.
  - [x] Task 67.4. Every code example is run in the Group 1 scratch project (Node 26, plus Node 24/22 where the page says behaviour differs) and followed by a `Source:` link to the official page it derives from (Learn: node-api/*, modules/abi-stability, getting-started/nodejs-with-webassembly; API: n-api.html, wasi.html, ffi.html); add "what changed recently" (with versions) and, where the books touch the concept, "where the books are outdated" in prose or tables; end with `== References`.

### Group 12 — Landing page, bibliography and cheat sheet

**Parallelizable: no — `index.adoc` and the cheat sheet link every page created in Groups 2–11**

- [x] Task 68. Create `index.adoc` ("Node.js") with `== Bibliography`.
  - [x] Task 68.1. Header per "Conventions" (`= Node.js`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline and release-line policy.
  - [x] Task 68.2. Cover every bullet of the `index.adoc` outline in issue #257: what Node.js is and who the section is for, the *Bookshelf* scenario, the reading path, `== What's covered` grouped as the nav, the "where related material lives elsewhere on this site" table (every row of the issue's existing-pages table; verify each `xref:` target with `ls`).
  - [x] Task 68.3. `== Bibliography`: every source in the issue's Bibliography section, each linked to its official website — the two books (author, title, publisher, year, ISBN, O'Reilly page and companion repo), nodejs.org groups, docs.npmjs.com, libuv/V8/Undici, ecosystem docs, specifications. Use the canonical URLs recorded in Task 2.4.
  - [x] Task 68.4. Figures: SVG `nodejs-bookshelf-architecture.svg` and a Mermaid mind-map of the section. End with `== References`.
- [x] Task 69. Create `cheat-sheet.adoc` ("Node.js Cheat Sheet").
  - [x] Task 69.1. Follow `backend/nestjs/cheat-sheet.adoc`: header + `:description:`/`:keywords:`, disclaimer include, intro linking `xref:attachment$nodejs-cheat-sheet.pdf[downloadable PDF]` with the dated baseline, grouped `*Group* --` paragraphs of `xref:`s to every page in the section, a final `xref:attachment$nodejs-cheat-sheet.pdf[Download the Node.js Cheat Sheet (PDF)]` line, and `== References`.
- [x] Task 70. Create `modules/ROOT/attachments/nodejs-cheat-sheet.pdf` ("Node.js Cheat Sheet").
  - [x] Task 70.1. Design a throwaway HTML page (scratchpad) rendered with headless Chrome print-to-PDF like the other cheat sheets: exactly one A4 page, dense multi-column, colour-coded, Node.js version baseline and date in the header.
  - [x] Task 70.2. Summarise every concept in the issue's "Cheat sheet" section: runtime and versions, CLI flags, modules, npm, the event-loop phases strip, async, events, process and errors, files and streams, data, networking, concurrency comparison table, testing, diagnostics, security recipes, TypeScript rules, production snippets, and the "changed since older tutorials" strip.
  - [x] Task 70.3. Verify with `pdfinfo` / PyMuPDF (1 page, ≈595×842 pt) and render to PNG to check legibility/overflow; commit only the PDF, never the HTML.

### Group 13 — Site wiring and back-links

**Parallelizable: yes (independent files)**

- [x] Task 71. Create `modules/ROOT/partials/nav-nodejs.adoc` and wire it into `modules/ROOT/nav.adoc`.
  - [x] Task 71.1. Partial: header comment copied from `nav-javascript.adoc` and adapted to "both its usage sites in nav.adoc (under Web Development and under Backend Development)"; `*** xref:backend/nodejs/index.adoc[Node.js]` followed by a `****` entry per page in the issue's order (Foundations, Modules & packages, Asynchrony, Core APIs, Files/streams/data, Networking, Concurrency, Testing, Diagnostics, Security, TypeScript & tooling, Building applications, Production, Beyond the basics), ending with `**** xref:backend/nodejs/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Verify every target exists.
  - [x] Task 71.2. `nav.adoc` Backend Development: add `include::partial$nav-nodejs.adoc[]` between `include::partial$nav-typescript.adoc[]` (~l.725) and `*** xref:backend/nestjs/index.adoc[NestJS]`.
  - [x] Task 71.3. `nav.adoc` Web Development: add `include::partial$nav-nodejs.adoc[]` immediately after `include::partial$nav-javascript.adoc[]` (~l.326), before the Bootstrap Reference entry.
- [x] Task 72. Update the landing pages.
  - [x] Task 72.1. `backend/index.adoc`: add a **Node.js** bullet between the TypeScript Reference and NestJS bullets (existing style, ending ", plus a downloadable cheat sheet."); add Node.js to `:description:` between TypeScript Reference and NestJS; append the issue's Node-specific keywords to `:keywords:` (skip ones already present).
  - [x] Task 72.2. `web/index.adoc`: add a **Node.js** bullet right after JavaScript Development with web-developer wording (runtime behind dev servers, build tools, SSR and full-stack JavaScript); add Node.js to `:description:` and `:keywords:`.
  - [x] Task 72.3. Root `index.adoc`: mention Node.js in the "backend (including …)" parenthetical of `:description:` and add runtime terms to `:keywords:` (no new tile).
- [x] Task 73. Add the back-links (one line each; verify every target with `ls` first).
  - [x] Task 73.1. `programming-languages/javascript/`: `index.adoc` (Node.js pointer next to the CLI pointer at l.14), `async-javascript.adoc` (event-loop phases), `modules.adoc` (CommonJS section → resolution, `exports`, `require(esm)`), `tooling-bundling-npm-publishing.adoc` (npm/publishing), `tooling-jest.adoc` (`node:test`), `browser-workers.adoc` (`worker_threads`).
  - [x] Task 73.2. `programming-languages/typescript/`: `index.adoc` ("Where TypeScript runs" pointer), `getting-started.adoc` (type stripping), `modules.adoc` (`nodenext`, ESM/CJS interop).
  - [x] Task 73.3. `backend/nestjs/index.adoc` ("Node.js runtime" row in the related-material table) and `getting-started-and-cli.adoc` (install/versions page); `web/nextjs/index.adoc` (Node.js row in the related-material table).
  - [x] Task 73.4. `backend/docker/build-cache-and-multi-stage-builds.adoc` (Node Dockerfile page) and `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (new row "JavaScript / TypeScript on Node.js (built-ins, Express, Fastify)" in the "Backend framework" table, after the NestJS row, linking `backend/nodejs/index.adoc`).

### Group 14 — Build, validation and review

**Parallelizable: no — depends on every page, the nav and the PDF**

- [x] Task 74. Validate the whole section.
  - [x] Task 74.1. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` passes for every Mermaid block.
  - [x] Task 74.2. `grep -rn -E '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/backend/nodejs` returns nothing, and the disclaimer partial is included on every page (67 files).
  - [x] Task 74.3. No `xref:` to a non-existent page (#196/#184/#201 prose only), no secrets, no book text/figures, `git status` shows no `*.pdf` other than `nodejs-cheat-sheet.pdf` and no scratch files or `.DS_Store`.
  - [x] Task 74.4. Every code example has a `Source:` link; every page ends with `== References`; every ★ page is among the longest; each page-outline bullet in issue #257 is covered (spot-check by grepping key terms).
  - [x] Task 74.5. Delegate `npx antora antora-playbook.yml` (or the `iru-build-docs` skill) to the `iru-gate-runner` agent: 0 errors / 0 warnings; spot-check the rendered nav (Node.js appears under both Backend Development and Web Development), the cheat-sheet download, a Mermaid page and the edited back-link pages in `build/site`.
- [x] Task 75. Run the security scan.
  - [x] Task 75.1. Delegate `iru-check-security` (detect-secrets) to the `iru-gate-runner` agent; resolve any finding before archiving. — done: 8 new findings in backend/nodejs pages (all placeholders: change-me DB URLs, mock API key, example URL credentials, demo hash, prose "password") audited is_secret: false in .secrets.baseline per user decision; scan after git add shows 0 unaudited, 0 real.
