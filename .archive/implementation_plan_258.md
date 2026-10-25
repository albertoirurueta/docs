# Implementation Plan: Guides & References / Web Development — E2E Testing in the Browser

## Task summary

Source: GitHub issue #258
Base branch: main

Issue [#258](https://github.com/albertoirurueta/docs/issues/258) asks for a new **E2E Testing in the Browser** section
under *Guides & References → Web Development*, authored directly into this repo's own `ROOT` Antora component
(`modules/ROOT/pages/web/e2e-testing/`). The section explains how to run and write automated real-browser tests with
**Playwright**, **Cypress** and **Selenium** in these areas:

* the protocols underneath (WebDriver Classic, WebDriver BiDi, CDP)
* cross-browser validation
* screenshots, videos and traces
* visual regression against expected designs
* accessibility checks, CI/CD and flakiness
* AI agents taking full control of browsers (Playwright MCP and CLI, Chrome DevTools MCP, computer-use tools, open-source frameworks)
* script-less AI testing
* securing browser agents

It **replaces** the single page `web/e2e-testing-real-browsers.adoc` (issue #122). The issue body is the
specification. Re-read it (`gh issue view 258 --json body -q .body`) when writing each page and when auditing,
because its per-page concept and source lists are not repeated here.

Deliverables:

1. **46 AsciiDoc pages plus `cheat-sheet.adoc`** under `modules/ROOT/pages/web/e2e-testing/`:
   * foundations: 5, including `index.adoc`
   * `playwright/`: 11
   * `cypress/`: 8
   * `selenium/`: 7
   * cross-cutting: 6
   * `ai-agents/`: 8
   * closing: 1
2. **`modules/ROOT/attachments/e2e-testing-cheat-sheet.pdf`**: exactly one A4 page.
3. **`modules/ROOT/partials/e2e-testing-disclaimer.adoc`**: rewritten and included on every page.
4. **Site wiring:**
   * nav entry replaced
   * bullet and metadata in `web/index.adoc`
   * root `index.adoc` metadata
   * old page deleted, with `:page-aliases:` on the new landing page
5. **Re-links and back-links:**
   * every xref to the old page re-pointed
   * every "#258" prose mention replaced by an `xref:`
   * one-line back-links on the five pages the issue lists
6. **Figures:** `e2e-testing-*.svg` in `modules/ROOT/images/` and Mermaid diagrams, at least wherever the issue marks 📊.

**Choices made on the user's behalf**

* **Delivery (user-confirmed):** one branch (`feature/258-e2e-testing-browser-section`) and one draft PR. The issue's
  suggested four-PR split is not used.
* **Tooling (user-confirmed):** the implementation installs whatever it can to run examples:
  * npm packages: Playwright and its browsers, Cypress, `@playwright/mcp`, `@playwright/cli`, Chrome DevTools MCP, axe packages
  * Selenium for Java (Maven, JUnit 5) and Python (pytest) in a venv
  * Docker images: `mcr.microsoft.com/playwright`, `cypress/*`, `selenium/standalone-*` and Grid
  * Python and .NET Playwright bindings

  Anything that **cannot be installed or run here** is still documented in full, and the page says in plain prose
  (not an admonition) that the example was not executed for that page and why. This covers:
  * cloud-only services: BrowserStack, Sauce Labs, TestMu AI, Azure App Testing, Percy, Applitools, Chromatic, Cypress Cloud recording
  * paid or keyed APIs: OpenAI and Gemini computer use, the Claude API computer-use tool
  * GitHub Copilot cloud agent
  * Cursor Browser, the VS Code browser tools, and Safari/`safaridriver` where not enabled
* **Bookshelf app:** a small, original, throwaway web front end plus REST API with these features:
  * catalogue, search and pagination
  * a detail page with a cover image
  * reader and admin sign-in
  * an "add review" form with an optimistic UI
  * seed and reset endpoints
  * light and dark themes, and a responsive layout

  It is built in the session scratchpad (`…/scratchpad/bookshelf/`) and is **never committed**.
  `example-application-and-test-layout.adoc` documents its routes, `data-testid` conventions and seed API. Plain
  Node.js plus static HTML/TS keeps it dependency-light. Test projects for each tool live alongside it in the scratchpad.
* **Version baseline:** use the issue's table (verified 2026-10-19/20):
  * Playwright 1.64 (1.63 for Python, Java and .NET)
  * Cypress 16.2
  * Selenium 4.51
  * WebDriver BiDi WD 8 Oct 2026
  * MCP 2026-07-28
  * Chrome DevTools MCP 1.0
  * Claude `computer_toolset_20260801`

  **Re-verify every version, date, URL and API before writing**, including each "fact the research could not
  verify". State the baseline and check date in each page intro. Where a fact stays unverifiable, say so in prose.
  Retired products (Microsoft Playwright Testing, ChatGPT agent/Operator/Atlas, Project Mariner, the
  `@playwright/experimental-ct-*` packages, Protractor) are presented only as history.
* **Admonitions:** the disclaimer partial is a single `[IMPORTANT]` block with the same shape as
  `partials/django-disclaimer.adoc` (the AI-assistance sentence plus an
  `xref:web/e2e-testing/index.adoc#_bibliography[the section bibliography]` pointer). It is the **only** admonition
  in the section. Deprecations, betas, pricing and security caveats are prose or table rows.
* **Old page move:** `web/e2e-testing-real-browsers.adoc` is deleted **in the same task** that creates
  `web/e2e-testing/index.adoc` with `:page-aliases: web/e2e-testing-real-browsers.adoc`. Antora rejects an alias
  that collides with an existing page. Existing xrefs to the old path resolve through the alias until Group 9
  re-points them. Its content (architecture, installation, headless, evidence, CI, comparison, other options) is
  carried into the pages the issue names.
* **Beyond the issue's lists:** `grep` now finds **55 xrefs in 48 files**; the issue says 48 in 42. The difference is
  pages that landed after the issue was written, such as the six `web/webrtc-websockets/*` pages,
  `web/ides-and-tools.adoc`, `web/jsf/quarkus.adoc` and `apps/apple/ui-tests-test-plans-and-coverage.adoc`. The
  "#258" prose also appears in `web/jsf/testing.adoc`, `web/jsp-struts/struts/testing.adoc` and
  `backend/vapor/testing.adoc`, which the issue doesn't list. All of them are handled. The nav entry is now at
  `nav.adoc:305`, not the issue's line 301.
* **Task tags:** every task is AsciiDoc authoring with no matching `iru-*-code-one-task` skill, so tasks are untagged
  and implemented directly. TypeScript, Java, Python, C#, YAML and so on appear only as code listings, verified in
  the scratchpad.
* **Parallelism:** pages are distinct files, so page tasks within a group are parallelizable. Forward xrefs to pages
  in later groups are the only build warnings allowed until Group 10. Group order follows content dependencies:
  Group 1 builds the Bookshelf app and toolchain that every example runs against. The tool groups precede the
  cross-cutting and AI pages that compare them. The cheat sheet and bibliography summarise everything.
* **Cross-issue references:** #196 and #263 are mentioned in prose only, never as `xref:`. After this work, no page
  mentions "#258" as pending work.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/pages/web/e2e-testing/index.adoc` exists with `:page-aliases: web/e2e-testing-real-browsers.adoc`. `web/e2e-testing-real-browsers.adoc` is deleted." | Task 5 |
| 2 | "**E2E Testing in the Browser** replaces "E2E Testing in Real Browsers" in `nav.adoc`, listing every page below in order (with the Playwright / Cypress / Selenium / AI Agents in the Browser group headings) and ending with the cheat sheet." | Task 2, Task 63 |
| 3 | "`web/index.adoc` has the new bullet and an updated `:description:`/`:keywords:`. The root `index.adoc` is updated if it enumerates web topics." | Task 3 |
| 4 | "Every page in the outline exists, plus `cheat-sheet.adoc`" (foundations 5, Playwright 11, Cypress 8, Selenium 7, cross-cutting 6, AI agents 8, closing 1) | Tasks 5 to 49, Task 53, Task 55 |
| 5 | "Every page of the official docs inventories is covered by at least one page" (Playwright Node.js sidebar, `/mcp/*`, `/agent-cli/*`; Cypress App docs and Cloud/UI Coverage/Accessibility intros; the Selenium documentation tree) | Tasks 10 to 49, Task 64 |
| 6 | "The requested concepts each have a dedicated ★ page with detailed content and runnable examples" (writing tests with each tool, cross-browser validation, visual regression, agents taking full control, script-less AI testing) | Tasks 10 to 35, 36, 38, 43, 47, 48, 64 |
| 7 | "Every code example uses current APIs" (Playwright 1.64/1.63, Cypress 16.2 with `cy.env()`/`Cypress.expose()` and no `Cypress.env()`, Selenium 4.51 with Options classes and Selenium Manager, no `DesiredCapabilities` outside the legacy page), "every example has been run against the *Bookshelf* app", "followed by a link to the official documentation page", "no example contains real secrets" | Task 4, Tasks 6 to 53, Task 65 |
| 8 | "Every agent example shows the exact prompt and the evidence produced. Script-less examples state their limits in prose." | Tasks 42 to 49, Task 64 |
| 9 | "Mermaid diagrams and `e2e-testing-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`, and every SVG is referenced by a page." | Tasks 5 to 53, Task 54, Task 63 |
| 10 | "`modules/ROOT/partials/e2e-testing-disclaimer.adoc` is rewritten and included on every page under `web/e2e-testing/`. It is the **only** admonition in the section and says only that the content was generated with AI assistance, plus the bibliography pointer." | Task 1, Tasks 5 to 55, Task 66 |
| 11 | "`== Bibliography` on the landing page lists every source above, each linked to its official documentation. Each page has a `== References` section." | Task 57, Tasks 5 to 55, Task 66 |
| 12 | "`cheat-sheet.adoc` exists and links `modules/ROOT/attachments/e2e-testing-cheat-sheet.pdf`, a **single-page** A4 PDF summarising every concept in the section." | Task 55, Task 56 |
| 13 | "Every one of the 48 xrefs to `web/e2e-testing-real-browsers.adoc` is re-pointed to a new page. Every prose "#258" mention is replaced with an xref. The back-links listed above are added. No `xref:` points to a page that doesn't exist." | Tasks 58 to 61, Task 63, Task 66 |
| 14 | "Facts flagged as unverified in Context are re-verified, or stated with their uncertainty in prose. Retired products are presented only as history." | Task 4, Tasks 6 to 53, Task 64 |
| 15 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings. The CLAUDE.md verification greps (image macros, inline-code substitutions on `build/site/web/e2e-testing`, unquoted alt-text commas) print nothing, and the pages render correctly in `build/site`." | Task 63 |

## Current code state

There is no application code. The Antora root component is `ROOT` (`antora.yml`, `antora-playbook.yml`,
`modules/ROOT/`), the docs root is this repository's root, and the repository host is GitHub
(`albertoirurueta/docs`). Precedents in `.archive/`:
* `implementation_plan_264.md`: WebRTC & WebSockets, 65 pages, the same structure as this plan
* `implementation_plan_122.md`: the page being replaced

Files involved:

* **Existing page:** `modules/ROOT/pages/web/e2e-testing-real-browsers.adoc` (302 lines). It has `== Selenium`,
  `== Playwright` and `== Cypress`, each with Architecture, Installation, Headless vs. Headed, Evidence Capture,
  Running Locally and Running in CI/CD, then `== Comparison` and `== Other Options`. This content moves as the issue's
  table says.
* **Disclaimer partial:** `modules/ROOT/partials/e2e-testing-disclaimer.adoc` is a long tool-specific `[IMPORTANT]`
  block. Rewrite it in the shape of `partials/django-disclaimer.adoc`.
* **Nav:** `modules/ROOT/nav.adoc:305` holds `*** xref:web/e2e-testing-real-browsers.adoc[E2E Testing in Real Browsers]`
  inside the `** xref:web/index.adoc[Web Development]` block, between Web Accessibility and IDEs & Tools. Group
  headings use the plain-text `****` + `*****` pattern of `partials/nav-jvm-build-tools.adoc`. The section appears
  once, so it gets no nav partial.
* **Landing pages:** `modules/ROOT/pages/web/index.adoc:14` has the old bullet. Check `modules/ROOT/pages/index.adoc`
  `:description:`/`:keywords:` for web-topic enumeration.
* **Xrefs to the old page:** 55 occurrences in 48 files. Re-check with
  `grep -rc e2e-testing-real-browsers modules | grep -v ':0$'`.
  * `nav.adoc`
  * `web/`:
    * `index.adoc`, `ides-and-tools.adoc`
    * `webrtc-websockets/`: `load-testing-and-capacity-planning`, `mobile-and-native-clients`, `testing-real-time-apps` (2), `media-capture-and-devices`, `building-a-chat-app`
    * `php-laravel/`: `browser-testing-with-dusk`, `inertia-and-starter-kits`, `index`
    * `vaadin/testing`
    * `gwt/{testing,index}`
    * `vue/testing`, `angular/testing`
    * `jsf/`: `quarkus`, `websocket-push`, `testing` (3), `best-practices`, `index`, `spring-boot-with-joinfaces`
    * `thymeleaf/`: `testing`, `htmx-patterns`, `index`, `extending-thymeleaf`
    * `jsp-struts/`: `struts/testing`, `index`, `jsp/testing-and-debugging` (2)
    * `nextjs/`: `testing` (3), `authentication-and-authorization`, `debugging-instrumentation-and-observability`, `index`
    * `django/`: `testing`, `static-files-and-front-end-assets`, `pytest-factories-and-browser-tests` (2), `template-partials-and-htmx`, `index`
    * `react/testing`
  * `backend/vapor/`: `testing`, `server-rendered-web-apps-and-forms`, `leaf-templates`
  * `programming-languages/go/text-and-html-templates`
  * `ai/conversational-channels/embedding-a-web-chat-widget`
  * `apps/apple/{ui-tests-test-plans-and-coverage,index}`
  * `apps/react-native/{testing,index}`
* **"#258" prose:** about 19 occurrences. Re-check with `grep -rn '#258' modules --include='*.adoc'`.
  * `web/gwt/{index,testing}`
  * `web/thymeleaf/index`, and `web/thymeleaf/testing` (lines 756 and 787)
  * `web/jsf/index`
  * `web/jsp-struts/index`, `web/jsp-struts/struts/testing` (line 1131)
  * `backend/jmeter/`: `index`, `introduction-and-architecture`, `http-requests`, `performance-testing-fundamentals`, `recording-and-curl-import`
  * `backend/vapor/{index,testing}`
* **Back-link targets (verified present):**
  * `web/accessibility.adoc`
  * `ai/mcp/connecting-hosts.adoc`
  * `ai/ai-assisted-development/testing-and-debugging-with-ai.adoc`
  * `ai/security/prompt-injection.adoc`
  * `backend/jmeter/index.adoc`
* **Linked, not repeated:**
  * `ai/ai-assisted-development/{agent-mode,headless-and-ci-automation}.adoc`
  * `ai/security/{excessive-agency-and-tool-security,owasp-top-10-for-llm-applications}.adoc`
  * `ai/mcp/*`, `ai/agents/*`
  * `git-and-github/*`, `backend/docker/*`
  * the framework testing pages listed above
* **Repo conventions from `CLAUDE.md` apply to every page:**
  * Image macros sit on one line, with alt text quoted when it contains a comma.
  * Inline code containing `->`, `=>`, `...`, `{`, `*`, `^`, `~`, `'`, `__` or `#[` uses a `` `+…+` `` passthrough,
    or `pass:c[]` when it contains `+`. Examples are Cypress `+{{placeholders}}+`, `+cy.get('@alias')+` and arrow
    functions.
  * Mermaid `<` followed by a letter is written as `&lt;`.
  * Every SVG is referenced by a page.
* **Tooling available:**
  * Node v24, Docker 29.8, and Google Chrome at `/Applications/Google Chrome.app` (not on PATH; use the full binary
    path for the headless PDF)
  * PyMuPDF (`fitz`) for page-count checks, since `pdfinfo` is not installed
  * `npx antora antora-playbook.yml`
  * `npm run validate:mermaid`, after `npm i --no-save mermaid@11 jsdom`
  * `iru-check-security`: detect-secrets findings in this docs repo are false positives; label them `is_secret:false`

## Implementation steps

**Page conventions (every page task below).** Each page has:
* `= Title`, `:description:`, `:keywords:` and `include::partial$e2e-testing-disclaimer.adoc[]`
* an intro with the version baseline and check date
* a detailed explanation covering: what it is and why it exists, how each tool implements it, every relevant
  option/API/flag, pitfalls, and headless vs headed and local vs CI where relevant
* complete examples run against Bookshelf (Playwright and Cypress in TypeScript; Selenium in Java/JUnit 5 and
  Python/pytest, plus other bindings where the official docs show a difference), **each followed by** a
  `Source: <url>[<title>]` line
* a "what changed recently" paragraph or table
* `== References`, listing the official online docs the page derives from

★ pages are the most detailed. Concepts and sources for each page are in the issue's "Page outline". Examples that
cannot be executed here are still written in full, with a prose sentence saying they were not run and why. When a
page is done, append a one-line progress note under its task: what was written, which examples ran, and build/check
status.

### Group 1 — Scaffolding, toolchain, wiring and landing page (Parallelizable: yes)

- [x] Task 1. Rewrite `modules/ROOT/partials/e2e-testing-disclaimer.adoc` as a single `[IMPORTANT]` block identical in shape to `partials/django-disclaimer.adoc`: the house AI-assistance sentence, then "The reference material consulted while preparing these pages is listed in xref:web/e2e-testing/index.adoc#_bibliography[the section bibliography]."
  _Progress: partial rewritten in the django-disclaimer shape (the only admonition in the section). License headers skipped (docs-only)._
- [x] Task 2. In `modules/ROOT/nav.adoc`, replace line 305 with `*** xref:web/e2e-testing/index.adoc[E2E Testing in the Browser]`, followed by `****` children in outline order:
  _Progress: nav.adoc line 305 replaced with the index entry plus 46 children (47 xrefs) in outline order with group headings; build shows only forward-xref errors for pages in later groups._
  - foundations: `how-browser-automation-works`, `choosing-a-tool`, `example-application-and-test-layout`, `test-design-and-page-objects`
  - `**** Playwright`, with 11 `*****` xrefs
  - `**** Cypress`, with 8
  - `**** Selenium`, with 7
  - cross-cutting: `cross-browser-testing`, `screenshots-videos-and-traces`, `visual-regression-testing`, `accessibility-checks-in-e2e-tests`, `running-in-ci-cd`, `flaky-tests-and-reliability`
  - `**** AI Agents in the Browser`, with 8 `*****` xrefs
  - `**** xref:web/e2e-testing/whats-changed-and-upgrading.adoc[What's Changed and Upgrading]`
  - `**** xref:web/e2e-testing/cheat-sheet.adoc[Cheat Sheet (PDF)]`

  Nav titles follow the page titles.
- [x] Task 3. Update `modules/ROOT/pages/web/index.adoc`:
  _Progress: web/index.adoc bullet, description and keywords, and root index.adoc description/keywords updated; no tile._
  - Replace the line-14 bullet with an **E2E Testing in the Browser** bullet that summarises the section and ends ", plus a downloadable cheat sheet."
  - Update `:description:`.
  - Append the issue's keyword list to `:keywords:`.

  In `modules/ROOT/pages/index.adoc`, if `:description:`/`:keywords:` enumerate web topics, add "end-to-end browser testing (Playwright, Cypress, Selenium)" and `Playwright, Cypress, Selenium, browser agents`. Add no tile.
- [x] Task 4. Build the verification environment in the session scratchpad. Nothing from this task is committed.
  _Progress: Bookshelf, toolchains and fact files completed; nothing committed._
  - [x] Task 4.1. Write the **Bookshelf** app in `scratchpad/bookshelf/`. It is a Node.js server with a static TS/HTML front end and these parts:
    _Progress: Bookshelf in scratchpad/bookshelf (plain Node, no dependencies, plain JS front end instead of TS); API and pages smoke-tested with curl and from every tool; stopped after use._
    - routes `/`, `/books?q=&page=`, `/books/:id`, `/signin`, `/account`, `/admin`
    - reader and admin roles
    - an "add review" form with validation and an optimistic UI
    - REST `/api/books`, `/api/reviews` and `/api/session`, plus `POST /api/test/reset` and `/api/test/seed`
    - `data-testid` attributes, light and dark themes, a responsive layout, and a cover image

    Credentials come from env vars (`BOOKSHELF_READER_PASSWORD`, …). `npm start` serves on `http://localhost:3000`.
  - [x] Task 4.2. Install and smoke-test each toolchain against Bookshelf:
    _Progress: see scratchpad/toolchain-status.md. Ran green: Playwright 1.64.1 (chromium/webkit local, all three in Docker), Cypress 16.2.0 (local and Docker), Selenium 4.51 Java and Python, Grid and standalone in Docker, Playwright Python/Java/.NET 1.63, Playwright MCP/CLI, Chrome DevTools MCP, axe integrations. Not working: local Firefox, Safari automation; vendor clouds and paid agent APIs not runnable._
    (Installing npm/pip/Maven/NuGet packages, browsers and Docker images, and running Docker containers/Compose stacks, was **confirmed by the user on 2026-10-25**: "Install anything you need or can. If something cannot be install, write its documentation anyway". No further confirmation is needed.)
    - Playwright 1.64 (`npm init playwright@latest`, browsers, `install-deps` where applicable)
    - Cypress 16.2
    - Selenium 4.51 with a Java (Maven + JUnit 5) and a Python (venv + pytest) project
    - Playwright Python/Java/.NET 1.63, if the runtimes install
    - `@playwright/mcp`, `@playwright/cli`, `chrome-devtools-mcp`, `@axe-core/playwright`, `cypress-axe`/`axe-core`, the Selenium axe integrations
    - Docker images: `mcr.microsoft.com/playwright:v1.64.*`, `cypress/included:16.2.*`, `selenium/standalone-chrome:4.51.0-*`, Grid hub/node

    Record which tools could not be installed or run, and why. Pages use that list to state unexecuted examples.
  - [x] Task 4.3. Re-verify the version baseline and every "fact the research could not verify" from the issue against the official sources. Record the results (with URLs and check date) in `scratchpad/verified-facts.md`, which every page task reads.
    _Progress: see scratchpad/verified-facts.md (dated 2026-10-25); baseline re-verified, the unverified facts resolved or recorded with uncertainty (cy.prompt status conflict, chrome-devtools-mcp is at 1.12.0, Playwright Python/Java/.NET have 1.64 releases)._
- [x] Task 5. Write `web/e2e-testing/index.adoc` with `:page-aliases: web/e2e-testing-real-browsers.adoc`, and **delete `modules/ROOT/pages/web/e2e-testing-real-browsers.adoc` in the same change**.
  _Progress: web/e2e-testing/index.adoc written (pyramid Mermaid validated, 2421 diagrams parsed), old page removed with git rm, alias redirect verified in build/site; build errors are only the 94 forward xrefs to pages from later groups; detect-secrets: no findings; CLAUDE.md image/inline-code greps print nothing._

  Content:
  - what E2E browser testing is, with a 📊 Mermaid test-pyramid diagram
  - the audience
  - the version baseline in prose
  - Bookshelf in brief
  - a section map with one line per page
  - `== Framework-specific E2E examples`, linking the React, Next.js, Vue, Angular, Vaadin, Thymeleaf, JSF, GWT, JSP/Struts, Django and Laravel Dusk testing pages
  - `== References`
  - a `== Bibliography` stub, completed in Task 57

  Prose mentions #196 and #263.

### Group 2 — Foundations (Parallelizable: yes)

- [x] Task 6. `how-browser-automation-works.adoc` ★ covers:
  - Done: how-browser-automation-works.adoc + e2e-testing-architectures.svg, 3 Mermaid click diagrams; ran curl WebDriver Classic, raw BiDi and raw CDP clicks plus DEBUG=pw:protocol; Cypress snippet documented only; Antora build and validate:mermaid clean (only forward xrefs).
  - WebDriver Classic, WebDriver BiDi modules and CDP
  - the Playwright client/server protocol and its patched builds
  - Cypress's in-browser architecture
  - the consequences of each architecture
  - where AI agents plug in

  Absorbs the old page's three Architecture subsections. Figures: 📊 `e2e-testing-architectures.svg`, plus three Mermaid sequence diagrams of a click.
- [x] Task 7. `choosing-a-tool.adoc`:
  - Done: choosing-a-tool.adoc with comparison table, Mermaid decision flowchart, other options (not installed or run), migration guide links, JMeter link; URLs checked 200.
  - the full comparison table, updated from the old `== Comparison`
  - a 📊 Mermaid decision flowchart
  - "Other options" (Puppeteer, WebdriverIO, TestCafe, Robot Framework Browser, Selenide, Nightwatch), from the old `== Other Options`
  - the migration guides
  - why browser E2E is not load testing, linking `backend/jmeter/index.adoc`
- [x] Task 8. `example-application-and-test-layout.adoc`:
  - Done: example-application-and-test-layout.adoc; seed/reset/validation curl calls and the per-tool smoke projects run against Bookshelf; Docker run documented from Group 1.
  - Bookshelf's routes, roles, seed/reset API, `data-testid` conventions, how to start it, env vars and base URLs
  - the test-project layout per tool (`tests/`, `cypress/e2e/`, `src/test/java/…`, `tests/` for pytest)

  Depends on Task 4.1 (Group 1).
- [x] Task 9. `test-design-and-page-objects.adoc` ★ covers:
  - Done: test-design-and-page-objects.adoc; page objects run in Playwright (chromium, webkit), Cypress (electron), Selenium Java and Python (headless Chrome), plus LoadableComponent in Java; DSL/bot snippets not run; local Firefox not run.
  - E2E scope, user-visible behaviour, isolation, API-seeded state, fresh browser per test, no sleeps
  - locator strategy
  - POM and page component objects
  - Selenium's design strategies and its encouraged/discouraged lists
  - Cypress custom commands vs page objects
  - Playwright POM with fixtures
  - each tool's best practices

  Examples: one Bookshelf page object in each tool.

### Group 3 — Playwright (Parallelizable: yes)

All files are in `web/e2e-testing/playwright/`. Examples run with Playwright 1.64 against Bookshelf.

- [x] Task 10. `getting-started.adoc`: install, system requirements, first test, headed/headless, HTML report, VS Code extension, canary releases. Absorbs the old page's Playwright Installation, Headless and Running Locally subsections.
  - Done: playwright/getting-started.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 11. `locators-actions-and-auto-waiting.adoc` ★ covers:
  - Done: playwright/locators-actions-and-auto-waiting.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
  - every `getBy*` locator and `testIdAttribute`
  - filtering, chaining, `and`/`or`, `within()` and `visible()` (1.63), `getByRef()` (1.64)
  - CSS, XPath and shadow DOM
  - actionability, input actions
  - frames, dialogs, downloads, popups, events, evaluate, handles
- [x] Task 12. `assertions.adoc`: web-first assertions, soft assertions, `expect.poll`, `toPass`, custom matchers, API assertions, and aria snapshots (`toMatchAriaSnapshot`, `ariaSnapshot()` `mode`/`depth`, `ariaSnapshotJSON()`).
  - Done: playwright/assertions.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 13. `configuration-fixtures-and-projects.adoc` ★ covers:
  - Done: playwright/configuration-fixtures-and-projects.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
  - config `use`, timeouts, `webServer` starting Bookshelf
  - built-in, custom, worker and auto fixtures
  - projects and dependencies, global setup/teardown
  - annotations, tags, parameterization, TypeScript
- [x] Task 14. `authentication-and-isolation.adoc`: contexts, a setup project saving git-ignored `storageState`, reader and admin roles, and the `WebStorage`/`Credentials` APIs (1.61).
  - Done: playwright/authentication-and-isolation.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 15. `network-mocking-clock-and-api-testing.adoc`: `route`, modifying responses, HAR, WebSocket routing, mocking browser APIs, service workers, `Clock`, and the `request` fixture mixed with UI checks.
  - Done: playwright/network-mocking-clock-and-api-testing.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 16. `debugging-tracing-and-codegen.adoc`: UI Mode, Inspector, `--debug`, VS Code, the trace viewer and trace CLI, codegen, all reporters. Figure: 📊 a Mermaid debug loop.
  - Done: playwright/debugging-tracing-and-codegen.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 17. `parallelism-sharding-and-retries.adoc`: workers, `fullyParallel`, sharding with the blob reporter and `merge-reports`, retries, flaky classification, `describe.configure`.
  - Done: playwright/parallelism-sharding-and-retries.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 18. `component-testing.adoc`: the built-in `mount` fixture model (1.62), with `@playwright/experimental-ct-*` as history.
  - Done: playwright/component-testing.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 19. `python-java-and-dotnet.adoc`: the same Bookshelf test in `pytest-playwright`, Java (JUnit and plain library) and .NET (NUnit, MSTest, xUnit, `playwright.ps1 install`), library vs test-runner mode, and language differences.
  - Done: playwright/python-java-and-dotnet.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.
- [x] Task 20. `advanced-topics.adoc`: Chrome extensions, WebView2, Electron, Android, the Selenium Grid connection, `browser.bind()`, the `Screencast` API (1.59), custom selectors.
  - Done: playwright/advanced-topics.adoc written; examples run against Bookshelf (see group report); Antora build clean apart from forward xrefs.

### Group 4 — Cypress (Parallelizable: yes)

All files are in `web/e2e-testing/cypress/`. Examples run with Cypress 16.2. Use `cy.env()`/`Cypress.expose()` and never `Cypress.env()`.

- [x] Task 21. `getting-started.adoc`: install and requirements, Launchpad, testing types, first test, `open` vs `run`, headed/headless, `cypress.config.ts`, TypeScript, folder structure, IDE integration. Absorbs the old page's Cypress subsections, apart from CI and evidence.
  - Done: getting-started.adoc written; first-test, baseUrl, config, flags and exit-code examples run on Cypress 16.2.0 (Chrome and Electron) against Bookshelf; Launchpad and open mode documented only.
- [x] Task 22. `core-concepts.adoc` ★ covers:
  - the command queue, chaining and subjects
  - queries/actions/assertions and retry-ability
  - actionability
  - aliases and closures, `testIsolation`
  - conditional testing
  - trade-offs

  Figure: 📊 a Mermaid command-queue/retry loop.
  - Done: core-concepts.adoc written with one Mermaid retry-loop diagram; 74 tests passed (1 pending) in Electron and Chrome.
- [x] Task 23. `queries-assertions-and-custom-commands.adoc`: `cy.get`, `cy.contains`, `cy.getByRole()` (16.2), `within`, traversal, `data-cy`, Chai/Chai-jQuery/Sinon-Chai, custom commands and queries, `overwrite`.
  - Done: queries-assertions-and-custom-commands.adoc written; 30 tests passed in Electron and Chrome.
- [x] Task 24. `network-stubs-spies-and-clocks.adoc` ★ covers:
  - `cy.intercept` (spy, stub, fixtures, `+cy.wait('@alias')+`)
  - native interception on Chromium in 16 (`forceHttp1`) and the legacy path on Firefox/WebKit
  - `cy.fixture`, `cy.request`
  - `cy.stub`/`cy.spy`, `cy.clock`/`cy.tick`
  - Done: network-stubs-spies-and-clocks.adoc written with a Mermaid diagram; 42 tests passed in Electron and Chrome, plus legacy-path runs in Firefox (Docker).
- [x] Task 25. `sessions-authentication-and-cross-origin.adoc`: `cy.session`, programmatic login, the auth-provider guides, `cy.origin`, migrating 16's env vars from `Cypress.env()`, client certificates, `trustedCertificates` (16.1), proxies.
  - Done: sessions-authentication-and-cross-origin.adoc written; 31 tests passed plus mTLS and proxy projects; provider guides documented only.
- [x] Task 26. `debugging-studio-plugins-and-reporters.adoc`: `.debug()`/`.pause()`, time travel, Studio (beta), plugins and Node events, `cy.task`, reporters, code coverage, retries, performance.
  - Done: debugging-studio-plugins-and-reporters.adoc written; 8 tests passed, reporters run; open-mode debugging, Studio and coverage documented only.
- [x] Task 27. `component-testing.adoc`: `cy.mount` for React, Angular, Vue and Svelte (supported versions after 16), framework config, styling, custom frameworks.
  - Done: component-testing.adoc written with one Mermaid diagram; React, Vue and Svelte projects passed; Angular, Webpack and Next.js documented only.
- [x] Task 28. `cypress-cloud.adoc`: recording, Test Replay, smart orchestration, flaky management, branch review, analytics, integrations, plus UI Coverage, Cypress Accessibility and plans/pricing in prose. Examples need a Cloud project; if no account is available, they are documented but not run.

  - Done: cypress-cloud.adoc written with two Mermaid diagrams; local record-flag behaviour and a webhook verifier run; recording and Cloud features documented only (no account).
### Group 5 — Selenium (Parallelizable: yes)

All files are in `web/e2e-testing/selenium/`. Examples use Selenium 4.51 in Java (JUnit 5) and Python (pytest), plus other bindings where the official docs differ. No `DesiredCapabilities` outside Task 35.

- [x] Task 29. `getting-started.adoc`: install per language, the eight basic components, test runners (JUnit 5, pytest, MSTest/NUnit, RSpec, Mocha), Selenium Manager (driver and browser download, cache, `se-config.toml`/`SE_*`, offline, `SE_AVOID_STATS`). Absorbs the old page's Selenium Installation, Headless and Running Locally subsections.
  - Done: getting-started.adoc written; Java, Python, JS, C#, Ruby (Docker) and Selenium Manager examples run on 4.51.0; Gradle, Safari, local Firefox documented only.
- [x] Task 30. `drivers-browsers-and-options.adoc` ★ covers:
  - Options, Service, HTTP client, Remote WebDriver
  - Chrome, Edge, Firefox, Safari and IE mode: headless flags and each browser's special features
  - page-load strategies
  - capabilities vs Options
  - Done: drivers-browsers-and-options.adoc written with one Mermaid diagram; 22 Java and 18 Python tests passed (Chrome, Firefox in Docker); Edge, Safari, IE mode documented only.
- [x] Task 31. `locating-and-interacting.adoc` ★ covers:
  - the 8 strategies and relative locators
  - finders, interactions and element information
  - upload, select lists, colors
  - the Actions API (keyboard, mouse, pen, wheel)
  - navigation, alerts, cookies, frames, windows/tabs
  - the virtual authenticator, print to PDF
  - Done: locating-and-interacting.adoc written; 23 Java and 21 Python tests passed, Firefox in Docker 17/19 (2 documented engine differences); C#/Ruby/JS documented only.
- [x] Task 32. `waits-and-expected-conditions.adoc`: implicit, explicit and fluent waits and the no-mixing rule, Expected Conditions (the 4.51 Guava removal), listeners, ThreadGuard, troubleshooting and logging.
  - Done: waits-and-expected-conditions.adoc written; 13 Java and 11 Python tests passed; C#/Ruby/JS documented only.
- [x] Task 33. `webdriver-bidi.adoc` ★ covers:
  - events, logging, network interception and auth, script and preload, browsing context, input
  - `webSocketUrl`
  - per-binding status and the BiDi warning page
  - CDP as temporary

  Figure: 📊 a Mermaid subscription sequence.
  - Done: webdriver-bidi.adoc written with one Mermaid sequence diagram; 12 Java and 16 Python tests passed on Chrome (Firefox 14/16); other bindings and Safari documented only.
- [x] Task 34. `selenium-grid.adoc` ★ covers:
  - modes, components, config (CLI/TOML), endpoints, GraphQL, observability, custom nodes, external datastore
  - docker-selenium: Dynamic Grid, video sidecar, noVNC on 7900, Helm with KEDA, the GHCR mirror
  - `RemoteWebDriver` parallel runs

  Run Grid in Docker Compose. Figure: 📊 `e2e-testing-selenium-grid.svg`.
  - Done: selenium-grid.adoc and e2e-testing-selenium-grid.svg written; standalone, hub/node, distributed, video, Dynamic Grid ran in Docker Compose; Helm/KEDA, Redis/JDBC, tracing documented only.
- [x] Task 35. `selenium-ide-and-legacy.adoc`: Selenium IDE (record/playback, control flow, the side runner and its stale docs, export status as verified in Task 4.3), Legacy (RC, JSON Wire, PageFactory, `DesiredCapabilities`), upgrading to Selenium 4.
  - Done: selenium-ide-and-legacy.adoc written; selenium-side-runner 2/2, Java 6/6 + 2 Grid, Python 5 passed; IDE GUI and code export documented only.

### Group 6 — Cross-cutting concepts (Parallelizable: yes)

These pages compare the three tools, so they depend on Groups 3 to 5.

- [x] Task 36. `cross-browser-testing.adoc` ★ covers:
  - engines vs branded browsers vs devices; WebKit ≠ Safari; the limits of emulation
  - Playwright projects, `channel`, headless shell, `devices[...]`
  - Cypress `--browser`, `defaultBrowser`, `config.browsers` filtering, experimental WebKit, Electron deprecation, Firefox ≥140
  - Selenium Options and Grid node types
  - cloud grids (BrowserStack, Sauce Labs, TestMu AI, Playwright Workspaces in Azure App Testing): documented, not run
  - a GitHub Actions matrix per tool

  Figures: 📊 `e2e-testing-browser-matrix.svg` and a Mermaid matrix-run flow.
  - Progress: cross-browser-testing.adoc + e2e-testing-browser-matrix.svg + Mermaid; ran PW (local+Docker FF), Cypress (Chrome/Docker FF/WebKit), Selenium Java/Py incl. Grid; cloud grids and Safari documented only; build/mermaid OK. Group 6 validation: grep checks clean.
- [x] Task 37. `screenshots-videos-and-traces.adoc` covers evidence in each tool:
  - Playwright screenshots (mask, WebP 1.62), `video` (`fps`/style 1.64), screencast, traces, attachments
  - Cypress failure screenshots, `cy.screenshot`, `Screenshot.defaults`, videos, `after:screenshot`, Test Replay
  - Selenium `TakesScreenshot`, element and Firefox full-page screenshots, BiDi screenshots, print to PDF, docker-selenium video
  - on-failure vs always; CI artifacts

  Absorbs the old page's Evidence Capture subsections.
  - Progress: screenshots-videos-and-traces.adoc; ran PW, Cypress, Selenium Java/Py, Docker Firefox + video; Test Replay documented only; build OK. Group 6 validation: grep checks clean.
- [x] Task 38. `visual-regression-testing.adoc` ★ covers:
  - pixel vs perceptual vs DOM comparison; baseline, actual and diff
  - every `toHaveScreenshot` option and `snapshotPathTemplate`, `--update-snapshots`, `toMatchSnapshot`, WebP baselines
  - determinism: baselines from the official Docker image, Clock, mocks, masking, animations
  - comparing against a design export at the same viewport with a tolerance, or seeding from an approved run; element snapshots; aria snapshots as a structural complement
  - Cypress plugins and services, Selenium with `@wdio/visual-service`
  - Percy, Applitools and Chromatic snippets (documented, run only if free tiers allow)
  - PR approval workflow

  Figures: 📊 a triptych from real Bookshelf screenshots (`e2e-testing-visual-baseline-actual-diff.svg`, with PNGs allowed) and a Mermaid baseline lifecycle.
  - Progress: visual-regression-testing.adoc + e2e-testing-visual-baseline-actual-diff.svg (real screenshots) + Mermaid; ran PW (Docker 3 engines), Cypress plugin, Selenium Java/Py, WDIO visual-service; Percy/Applitools/Chromatic documented only; build OK. Group 6 validation: grep checks clean.
- [x] Task 39. `accessibility-checks-in-e2e-tests.adoc`: `@axe-core/playwright` and aria snapshots, Cypress's accessibility guide and Cypress Accessibility, Selenium with axe, and what automation cannot find (linking `web/accessibility.adoc`).
  - Progress: accessibility-checks-in-e2e-tests.adoc; ran axe with PW (3 engines), Cypress, Selenium Java/Py/JS; Cypress Accessibility documented only; build OK. Group 6 validation: grep checks clean.
- [x] Task 40. `running-in-ci-cd.adoc` ★ covers:
  - Playwright on GitHub Actions (install with deps, cache, shard matrix, merge-reports, HTML report upload), the Docker image (`--init`, `--ipc=host`, `pwuser`)
  - `cypress-io/github-action@v7`, the Cypress Docker images, caching `~/.cache/Cypress`
  - Selenium Grid as a service container, Selenium Manager offline/proxy settings
  - preview environments, secrets, artifacts, PR annotations

  Links `git-and-github/*` and `backend/docker/*`. Figure: 📊 a Mermaid pipeline. Absorbs the old page's three CI subsections. Validate the workflows with `act` or by running the same commands locally in Docker; note which.
  - Progress: running-in-ci-cd.adoc + Mermaid; workflows validated with act v0.2.89 (downloaded) plus docker/local runs; not run on GitHub; build/mermaid OK. Group 6 validation: grep checks clean.
- [x] Task 41. `flaky-tests-and-reliability.adoc`: causes of flakiness, each tool's defences, retries and flaky classification, Cypress Cloud flaky management, quarantine, diagnosis with traces/Test Replay, `--repeat-each`.

  - Progress: flaky-tests-and-reliability.adoc; ran PW repeat-each/retries, Cypress retries, Selenium Java/Py repeat/rerun; Cypress Cloud documented only; build OK. Group 6 validation: grep checks clean.
### Group 7 — AI agents in the browser (Parallelizable: yes)

All files are in `web/e2e-testing/ai-agents/`. Every agent example shows the exact `[source,text]` prompt plus the tool calls and transcript excerpt or evidence produced, and it is run where possible:
* Claude Code with Playwright MCP, Playwright CLI and Chrome DevTools MCP, run locally against Bookshelf
* Claude in Chrome, through this session's browser tooling where available

Tools that cannot be run here (OpenAI/Gemini computer use without keys, Copilot cloud agent, Cursor, VS Code browser
tools, Magentic-UI if it won't install) are documented from their official docs, with a prose note. Link the AI
sections for MCP, agent and security theory instead of re-explaining it.

- [x] Task 42. `how-ai-agents-drive-browsers.adoc` ★ covers:
  - accessibility-snapshot refs vs vision/coordinates vs DOM/CDP tools
  - transports
  - token cost and determinism
  - where each test tool fits
  - a summary table of every tool in the group

  Figures: 📊 `e2e-testing-agent-browser-loop.svg` and a Mermaid observe-act sequence.
  - Progress: how-ai-agents-drive-browsers.adoc + e2e-testing-agent-browser-loop.svg + 1 Mermaid; Playwright MCP/CLI, DevTools MCP and token measurements run; build/Mermaid/greps clean.
- [x] Task 43. `playwright-mcp-and-cli.adoc` ★ covers:
  - Playwright MCP install for Claude Code, VS Code, Cursor, Codex and Copilot CLI
  - its core tools, `--caps` groups, every option listed in the issue, the JSON config, extension mode, Docker
  - bundled `npx playwright mcp`/`cli` (1.62)
  - `@playwright/cli`: daemon and sessions, commands, `install --skills`, why CLI + skills
  - WebMCP (1.64)
  - `browser.bind()`, the dashboard, `--debug=cli`
  - Progress: playwright-mcp-and-cli.adoc; MCP 0.0.83 and CLI 0.1.22 run on Bookshelf (real --caps groups, config, bind, debug=cli); WebMCP/extension/Docker documented only; 1 Mermaid.
- [x] Task 44. `chrome-devtools-for-agents.adoc`: Chrome DevTools MCP 1.0, install, `--autoConnect`/`--isolated`/`--headless`/`--slim`, performance traces and Web Vitals (with the CrUX opt-out), Lighthouse, network and console, emulation, usage statistics and the opt-out, and when to prefer it.
  - Progress: chrome-devtools-for-agents.adoc; chrome-devtools-mcp 1.12.0 run (console, network, trace, Lighthouse, emulation); autoConnect and claude mcp add documented only.
- [x] Task 45. `ai-features-in-cypress-and-selenium.adoc` covers:
  - Cypress: `cy.prompt` (with `+{{placeholders}}+`, caching, self-healing, eject, limits, and the beta/GA status as verified in Task 4.3), Studio AI, Cloud AI, the Cloud MCP server (read-only data, not browser control), `cypress-io/ai-toolkit` skills, `cypress tap`
  - Selenium: the official AI-agents guide (`llms.txt`, a rules template, throwaway verification scripts), no official MCP server, BiDi as the standard surface
  - Progress: ai-features-in-cypress-and-selenium.adoc; cypress tap and a Selenium BiDi script run; cy.prompt, Studio AI, Cloud AI/MCP and ai-toolkit documented only.
- [x] Task 46. `playwright-test-agents.adoc` ★ covers:
  - planner, generator and healer
  - `npx playwright init-agents --loop=…`, the seed test, agent files, regenerating after upgrades
  - "Copy as prompt"
  - reviewing generated tests

  Run the agents on Bookshelf with the Claude loop. Figure: 📊 a Mermaid plan → generate → run → heal flow.
  - Progress: playwright-test-agents.adoc; init-agents (6 loops) and planner/generator/healer tools run via the test-MCP bridge (driven by the authoring assistant, not Claude Code); 1 Mermaid.
- [x] Task 47. `agents-that-control-the-browser.adoc` ★ covers:
  - Anthropic: computer use (`computer_toolset_20260801`), Claude Code + Playwright MCP, Claude in Chrome
  - OpenAI computer use with a Playwright executor; Operator, ChatGPT agent and Atlas as history
  - Gemini Computer Use; Mariner as history
  - Copilot cloud agent, VS Code browser tools, Cursor Browser
  - minimal runnable examples for browser-use, Stagehand, Skyvern, agent-browser and Magentic-UI
  - a comparison table: engine, protocol, isolation, HITL, licence
  - Progress: agents-that-control-the-browser.adoc; agent-browser run, everything else documented only with prose notes; 1 Mermaid.
- [x] Task 48. `script-less-testing-with-ai-agents.adoc` ★ covers:
  - the idea
  - the seven worked Bookshelf examples from the issue, each with prompt, tool calls and evidence, run where possible
  - prompt patterns and evidence types
  - turning a session into a regression test
  - unattended CI (linking `ai/ai-assisted-development/headless-and-ci-automation.adoc`)
  - limits, in prose
  - a scripted vs AI-generated vs script-less decision table

  Figure: 📊 a Mermaid script-less loop.
  - Progress: script-less-testing-with-ai-agents.adoc; examples 1, 2 (partly), 5, 6 run, 3, 4, 7 documented only; session-to-test spec ran 3/3; 1 Mermaid.
- [x] Task 49. `securing-browser-agents.adoc` ★ covers:
  - prompt injection via page content, screenshots and WebMCP
  - each vendor's guidance listed in the issue (quoted at most briefly, then paraphrased)
  - practical hardening
  - OWASP LLM01

  Links `ai/security/prompt-injection.adoc` and `ai/security/excessive-agency-and-tool-security.adoc`.
  - Progress: securing-browser-agents.adoc; origin-list/redirect, file:// block and snapshot-verbatim demos run; vendor guidance fetched and paraphrased.

Tasks 50 to 53 are reserved, so that numbering stays stable if the Task 64 audit splits an oversized ★ page.

- [x] Task 50. Reserved: no action unless the Task 64 audit requires a split; if so, record what was added.
  - Reserved; the Task 64 audit required no split.
- [x] Task 51. Reserved, as Task 50.
  - Reserved; the Task 64 audit required no split.
- [x] Task 52. Reserved, as Task 50.
  - Reserved; the Task 64 audit required no split.
- [x] Task 53. `whats-changed-and-upgrading.adoc` covers:
  - Playwright 1.49 → 1.64, item by item as in the issue, with the dropped Node and OS versions
  - Cypress 15 → 16: breaking changes, the migration guide, new AI features, `getByRole`
  - Selenium 4.x: Manager browser downloads, BiDi, 4.51 Guava removal, postponed removals, Java 11
  - service renames and retirements
  - Protractor EOL

  - Progress: whats-changed-and-upgrading.adoc (in web/e2e-testing/); release notes, migration guide and Selenium posts checked; only version commands run.
  - Reserved; the Task 64 audit required no split (largest page 1,959 lines, every outline bullet covered).
### Group 8 — Figures, cheat sheet and bibliography (Parallelizable: no — Tasks 55 to 57 summarise and cite every page from Groups 1 to 7)

- [x] Task 54. Audit every 📊 marker in the issue outline against the pages. Add any missing original `e2e-testing-*.svg` figure or Mermaid block. Confirm the SVGs contain no logos, vendor images or external hrefs, and that every SVG is referenced.
  - Progress: All 5 SVGs referenced by one page each, no external hrefs or logos (visual triptych embeds only data: PNGs of real Bookshelf screenshots); every 📊 marker has its figure or Mermaid block, nothing added.
- [x] Task 55. Write `web/e2e-testing/cheat-sheet.adoc`, following `web/django/cheat-sheet.adoc` and `web/webrtc-websockets/cheat-sheet.adoc`:
  - the disclaimer
  - an intro with `xref:attachment$e2e-testing-cheat-sheet.pdf[downloadable PDF]` and the baseline
  - grouped `*Group* --` paragraphs of xrefs to every page
  - a final `xref:attachment$e2e-testing-cheat-sheet.pdf[Download the E2E Testing in the Browser Cheat Sheet (PDF)]` line
  - `== References`
  - Progress: cheat-sheet.adoc written (disclaimer, baseline intro, grouped xrefs to all 46 pages, PDF link, References); build has no xref errors.
- [x] Task 56. Build `modules/ROOT/attachments/e2e-testing-cheat-sheet.pdf`.
  - Write a throwaway HTML page in the scratchpad: dense, multi-column, colour-coded, with versions and date in the header, and every box the issue lists (including the side-by-side command table and the agent-security checklist).
  - Print it with `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-pdf-header-footer --print-to-pdf=…`.
  - Confirm exactly one A4 page (595 × 842 pt) with PyMuPDF, and preview it as a PNG.
  - Commit only the PDF.
  - Progress: e2e-testing-cheat-sheet.pdf built with headless Chrome, 1 A4 page (595x842 pt), 263 KB, previewed as PNG and legible; git-added only the PDF.
- [x] Task 57. Complete `index.adoc`'s `== Bibliography`: every source in the issue's Bibliography plus every source cited in any page's `== References`, each linked to its official documentation, grouped as in the issue. Check that no page cites a source missing from the bibliography.
  - Progress: index.adoc Bibliography generated from the issue list plus every page's References (524 URLs in 7 groups); bibcheck script: 0 missing; Mermaid 2445 diagrams parsed, CLAUDE.md greps clean.
### Group 9 — Re-links and back-links (Parallelizable: yes)

These tasks touch disjoint files.

- [x] Task 58. Re-point every remaining `web/e2e-testing-real-browsers.adoc` xref outside `nav.adoc`/`web/index.adoc` (about 53 occurrences, listed in Current code state) to the most specific new page:
  - framework testing pages → `index.adoc` or the relevant tool `getting-started.adoc`
  - CI mentions → `running-in-ci-cd.adoc`
  - visual mentions → `visual-regression-testing.adoc`
  - comparisons → `choosing-a-tool.adoc`

  Keep each surrounding sentence true, and update link text that says "Real Browsers". Afterwards, `grep -rn e2e-testing-real-browsers modules` must print only the `:page-aliases:` line.
- [x] Task 59. Replace every "#258" prose mention (listed in Current code state) with an `xref:` to the matching new page, rephrasing each sentence so it no longer describes the work as pending:
  - JMeter mentions → `choosing-a-tool.adoc`
  - Thymeleaf's Cypress/Playwright row → the tool pages
  - GWT, JSF and JSP/Struts mentions → `index.adoc`
  - Vapor mentions → `index.adoc` or `running-in-ci-cd.adoc`

  Afterwards, `grep -rn '#258' modules` must print nothing.
- [x] Task 60. Add the one-line back-links:
  - `web/accessibility.adoc` → `accessibility-checks-in-e2e-tests`
  - `ai/mcp/connecting-hosts.adoc` (next to the default Playwright server for Copilot) → `ai-agents/playwright-mcp-and-cli`
  - `ai/ai-assisted-development/testing-and-debugging-with-ai.adoc` → `ai-agents/script-less-testing-with-ai-agents`
  - `ai/security/prompt-injection.adoc` → `ai-agents/securing-browser-agents`
  - `backend/jmeter/index.adoc` → `choosing-a-tool` (merged with that file's Task 59 edit)
- [x] Task 61. Reserved: confirm no other page in the repo still describes the old single page, by searching for "Real Browsers" and "E2E Testing in Real Browsers". Fix any hits.

### Group 10 — Verification (Parallelizable: no — runs on the finished tree)

- [x] Task 62. Reserved: run `iru-check-security` (whole repository). Label detect-secrets placeholder findings in this docs repo `is_secret:false`, and confirm no example contains real credentials (env vars only, `storageState` git-ignored).
  - Done: detect-secrets baseline scan (new files visible via `git add -N`); 7 new placeholder findings, all labelled `is_secret:false` in `.secrets.baseline` (cypress-cloud L813, example-application-and-test-layout L258, playwright/advanced-topics L642, selenium-grid L339/L730/L883, test-design-and-page-objects L667). No real credentials; 0 unlabelled entries left.
- [x] Task 63. Build and check the site:
  - `npx antora antora-playbook.yml` must report no `xref`/AsciiDoc errors or warnings.
  - The grouped nav must render in `build/site`, through a temporary preview config that serves `build/site`.
  - Every `CLAUDE.md` check must print nothing: the image macro greps, the inline-code substitution grep on `build/site/web/e2e-testing`, and the unquoted-alt-comma grep on the changed `.adoc` files.
  - `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`) must report every diagram parsed.
  - Run the rendered-HTML backtick/quote/bare-`+` scan.
  - The alias redirect from `web/e2e-testing-real-browsers.html` must work.
  - Done: Antora build clean (no warnings); preview of `build/site` shows the grouped nav (47 links, four group headings, ends with the cheat sheet) and the alias redirect works; all CLAUDE.md greps, rendered-HTML backtick scan and `npm run validate:mermaid` (2,445 diagrams) clean. Fixed 3 inline-code defects found by the rendered scan.
- [x] Task 64. Audit coverage against the issue:
  - every concept bullet on every outline page, and each ★ page's depth
  - every page of the official docs inventories (Playwright sidebar, `/mcp/*`, `/agent-cli/*`; Cypress App/Cloud/UI Coverage/Accessibility; the Selenium tree) mapped to at least one page
  - every agent example showing its prompt and evidence
  - the script-less limits stated
  - every unverified fact either verified or stated with its uncertainty
  - retired products presented only as history

  Fix the gaps.
  - Done: audit script maps every outline bullet's code tokens, source paths and URLs to its page (no gaps); GitHub Actions majors normalised; reset/session note added to test-design-and-page-objects; Cypress Electron anchor corrected to `#Migrating-away-from-the-Electron-browser`; no authoring-note leaks; retired products are history only.
- [x] Task 65. Summarise example execution in the final report: which examples ran against Bookshelf with which version, and which were documented only (and why). Confirm Docker containers and Compose stacks are torn down, and that nothing from the scratchpad (Bookshelf, test projects, HTML cheat sheet) is committed.
  - Done: example-execution summary prepared for the final report; `docker ps -a` empty, no Compose stacks, nothing from the scratchpad in `git status`.
- [x] Task 66. Final checklist against `## Acceptance criteria coverage`:
  - exactly 47 `.adoc` files under `web/e2e-testing/`
  - the disclaimer included on all of them, and no other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block in the section
  - `== References` on every page and a complete `== Bibliography`
  - the old file gone and the alias present
  - no `xref:` to non-existent pages, and #196/#263 in prose only

  - Done: 47 pages, disclaimer on all, one admonition per rendered page, `== References` on all, 524-URL bibliography complete, old file gone with alias, no `#258` left, #196/#263 prose only, back-links present, cheat-sheet PDF is one A4 page.