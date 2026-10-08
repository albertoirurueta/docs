# Implementation Plan: Guides & References / Web Development — "Thymeleaf"

## Task summary

Source: GitHub issue #238
Base branch: main

Issue [#238](https://github.com/albertoirurueta/docs/issues/238) adds a **Thymeleaf** section to Web Development at
`modules/ROOT/pages/web/thymeleaf/`, directly after the Vaadin Reference. It is a practical, example-driven guide to
developing websites with Thymeleaf 3.1.5 (Spring Boot 4.1, Java 21+, Layout Dialect 4.0, htmx 2 / `htmx-spring-boot`
5.x). It is written from the **official documentation**: the three 3.1 tutorials (*Using Thymeleaf* = **U**,
*Thymeleaf + Spring* = **S**, *Extending Thymeleaf* = **E**), the thymeleaf.org articles, ecosystem, javadocs and
GitHub repository, plus the Spring Boot/Framework/Security, Layout Dialect, htmx and `htmx-spring-boot` docs. Two
requester-provided books in `~/Desktop/libros/thymeleaf/` (Wim Deblauwe, *Taming Thymeleaf*, Leanpub, PDF v1.1.1
2021; *Modern frontends with htmx*, Leanpub, v1.0.0 2023) are consulted references for concept coverage, narrative and
the bibliography only.

The section ships:

* 42 files: `index.adoc` (with `== Bibliography`), 40 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/thymeleaf-cheat-sheet.pdf` ("Thymeleaf Cheat Sheet")
* the partial `modules/ROOT/partials/thymeleaf-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/thymeleaf-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc` (Thymeleaf block after the Vaadin block), `web/index.adoc`
  bullet/description/keywords, root `index.adoc` description/keywords
* about 12 back-links, including replacing the "Thymeleaf templating (#238)" planned mention in `web/django/index.adoc`

The issue body is the binding spec: its "Page outline", "Official documentation → page coverage", "New nav placement",
"Cheat sheet", "Bibliography" and "Acceptance criteria" sections, and the book concept table ("Covered on" column).
Every page task must re-read its page's bullets (`gh issue view 238`) and cover **every** bullet, plus every book-table
row and every official-coverage row that maps to it.

**Out of scope:** re-documenting existing material (Spring Boot, Spring Security, Spring Data JPA, Hibernate, Java,
Tailwind, Bootstrap, Docker, Kubernetes, OAuth theory: link instead). #263/#264/#258/#261/#241/#239/#240/#116 appear in
prose only.

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into 4 PRs. As with #253/#257/#237, this run
   implements everything on `feature/238` and opens a single draft PR to `main` with `Closes #238`.
2. **Tasks are untagged; no language/framework key applies.** The installed keys are `java`, `java-springboot`,
   `dotnet` and `database`. They implement code in a Java/Spring codebase with tests and quality gates, while this
   repository only holds AsciiDoc / Mermaid / SVG / PDF, so tasks are implemented directly. The Java/HTML in the pages
   is illustrative content, but every example is compiled and run in a scratch Spring Boot app (Task 2.6).
3. **The books appear only in `== Bibliography`** and in prose notes on outdated material. No text, listing, figure or
   sample project is copied. The PDFs are never staged, and the extracted text stays in the session scratchpad.
   *Taming Thymeleaf* is cited as the current Leanpub edition ("updated for Spring Boot 3"), noting that the consulted
   PDF is v1.1.1 (2021).
4. **Disclaimer:** `partials/thymeleaf-disclaimer.adoc` is a single `[IMPORTANT]` block (AI-assistance disclosure plus
   `xref:web/thymeleaf/index.adoc#_bibliography[…]`). No other admonition is allowed in the section. Deprecations,
   CVEs, version changes and "the book is outdated" remarks are prose or table rows.
5. **Version baseline is re-verified at implementation time and dated** (Group 1). The issue's numbers were checked on
   2026-10-07; htmx 4, `htmx-spring-boot` 6 and Thymeleaf 3.1.6/3.2 are in flux.
6. **Running scenario is the original *Bookshelf*** (books, authors, reviews, loans) as a Spring Boot 4.1 + Thymeleaf
   server-rendered app, the first Java implementation of the scenario. Pages build on each other.
7. **The examples use Maven** (the Spring Boot BOM manages Thymeleaf versions, so no hard-coded Thymeleaf version
   appears in Boot examples). Gradle is shown once on the getting-started page. Java 21 is the language level in
   examples (an LTS that Boot 4.1 supports), and the scratch app is verified on the locally installed JDK.
8. **Existing pages get real `xref:`s; pages that don't exist yet stay plain prose.** Every `xref:` target outside the
   section is verified with `ls` before it is written. `index.adoc` and `cheat-sheet.adoc` are written last
   (Group 10), and the back-links come after the new pages exist (Group 11).
9. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `thymeleaf-*.svg`. SVGs are original drawings (no
   Thymeleaf logo, docs images or book figures).
10. **The archived 3.1 migration articles** (404 on thymeleaf.org) are cited via their Wayback Machine URLs and labelled
    "archived". U Appendix D is the primary source for restrictions.

### Lessons from the earlier section reviews (#198, #199, #230, #237, #253, #257): mandatory for every page task

* **Verify every name against its official page before writing it.** This covers every `th:*`/`sec:*`/`layout:*`/`hx-*`
  attribute, utility-object method, `spring.thymeleaf.*` property, class, annotation, Maven coordinate and version
  number. If the docs don't confirm a detail, describe the behaviour without naming it.
* **Security is correctness:**
  * no hardcoded secrets; credentials are placeholders
  * `th:text`/`[[…]]` for user data
  * no view names or fragment selectors built from request input
  * CSRF kept on
  * state changes via POST
  * never reproduce the issue's errata list
* **Every concept gets at least one code example**, each followed by a `Source:` link, and that URL goes in
  `== References`. Show the rendered HTML output where it helps.
* **Run the examples** in the Group 1 scratch app.
* **URL hygiene:** use canonical thymeleaf.org / docs.spring.io / htmx.org URLs with the real 3.1 tutorial `#anchor`
  ids.
* **Cross-links must be accurate:**
  * never `xref:` to a page that doesn't exist
  * no `xref:` inside backticks
  * no empty link text on a fragment xref
* **AsciiDoc hygiene (critical for Thymeleaf syntax):**
  * Any inline code containing `*{`, `~{`, `__`, `${{`, `[[`, `->`, `...`, `'`, `*`, `~`, `^` or `{` uses a
    constrained passthrough (`` `+*{title}+` ``). Code containing `+` uses `pass:c[…]`.
  * Run the CLAUDE.md inline-code substitution grep on `build/site/…/web/thymeleaf`.
  * `{placeholders}` stay literal inside `[source]` blocks and are escaped in prose.
  * Use `.Title` captions.
  * Leave no authoring notes in the pages.
  * No prose line may start with `<digits>.`.
  * Image macros stay on one line, and alt text containing a comma is quoted.
* **Mermaid:** write `<<interface>>`-style stereotypes and any `<` followed by a letter as entities, and pass
  `npm run validate:mermaid`.

## Current code state

* **Repo:** the Antora root component (`antora.yml`). Pages live in `modules/ROOT/pages/`, the nav in
  `modules/ROOT/nav.adoc`, partials in `modules/ROOT/partials/`, images in `modules/ROOT/images/` and PDFs in
  `modules/ROOT/attachments/`. None of these exist yet: `web/thymeleaf/`, `thymeleaf-disclaimer.adoc`,
  `thymeleaf-*.svg`, `thymeleaf-cheat-sheet.pdf`.
* **`modules/ROOT/nav.adoc`:**
  * The Vaadin block runs from l.587 (`*** xref:web/vaadin/index.adoc[Vaadin Reference]`) to l.614
    (`**** xref:web/vaadin/cheat-sheet.adoc[Cheat Sheet (PDF)]`).
  * It is followed at l.615 by `include::partial$nav-python.adoc[]`.
  * The Web Development block spans l.291–759. Child entries use `**** xref:…[Title]`.
* **`web/index.adoc`:**
  * line 2 holds `:description:` and line 3 `:keywords:`
  * `== Sections` bullets run in nav order; the Vaadin bullet is at l.61–64 (style: `* xref:…[Title] -- …, plus a
    downloadable cheat sheet.`)
* **Root `index.adoc`:** `:description:` contains "web-development (including Next.js, Django and Laravel)". Thymeleaf
  is absent from `:keywords:`.
* **Existing Thymeleaf content:**
  * `backend/springboot/web-ui-frameworks.adoc` (181 lines): Thymeleaf section from l.11, links at l.113–115, Vaadin
    comparison at l.120–124, decision table at l.166–168
  * `backend/springboot/index.adoc`: bullet at l.156, bibliography at l.325–327
  * `backend/springboot/cheat-sheet.adoc` l.10
* **Back-link targets (line numbers from the exploration; re-check before editing):**

  | Page | Lines |
  |---|---|
  | `web/django/index.adoc` | l.373–376 ("Thymeleaf templating (#238)") |
  | `web/django/introduction-and-architecture.adoc` | l.809 |
  | `web/php-laravel/introduction-and-architecture.adoc` | l.363 |
  | `web/vaadin/spring-boot-integration.adoc` | l.160 |
  | `web/django/template-partials-and-htmx.adoc` | — |
  | `backend/axum/htmx.adoc` | — |
  | `web/tailwind/getting-started.adoc` | l.104–110 |
  | `web/e2e-testing-real-browsers.adoc` | l.10–13 |
  | `backend/oauth/flows-overview.adoc` | l.191 |
  | `backend/architecture/decisions-and-migrations/layering-backend-and-frontend.adoc` | l.11–153 |
  | `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` | l.110, l.462–464 |
* **Templates:**
  * partials: `partials/vaadin-disclaimer.adoc`, `partials/django-disclaimer.adoc`
  * cheat sheets: `web/django/cheat-sheet.adoc` and `attachments/django-cheat-sheet.pdf`, `web/vaadin/cheat-sheet.adoc`
  * images: `images/django-bookshelf-architecture.svg`
  * precedent plans: `.archive/implementation_plan_253.md` (Next.js) and `.archive/implementation_plan_257.md` (Node.js)
* **Research already gathered (session scratchpad, not committed):**
  * `official-docs.md`: concept inventory with anchors, version baseline, CVEs and URL list
  * `books-report.md`: bibliographic data, chapter concepts, outdated items and errata
  * `books/*.txt`: extracted book text, for consultation only
* **Tooling:**
  * build and validation: `npx antora antora-playbook.yml`, `npm run validate:mermaid` (after
    `npm i --no-save mermaid@11 jsdom`), the `iru-build-docs` skill
  * local runtimes: JDK 26, Maven 3.9.16 and Docker 29 for the scratch app and Testcontainers/Playwright examples
  * PDF: Google Chrome headless for print-to-PDF; `pdfinfo` and PyMuPDF are **not** installed, so check the page count
    with `pypdf` (already installed for the user) or `mdls -name kMDItemNumberOfPages`

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, a blank line, then
  `include::partial$thymeleaf-disclaimer.adoc[]`.
* **Lead paragraph:** states the dated version baseline (Thymeleaf 3.1.5, Spring Boot 4.1.x, Java 21+, and where
  relevant Layout Dialect 4.0.x, htmx 2.0.x, `htmx-spring-boot` 5.x). It also says whether the page applies to
  Thymeleaf **standalone**, **with Spring MVC**, **with Spring WebFlux**, or all of them.
* **Content:**
  * what the concept is and why it exists
  * how Thymeleaf implements it (dialect/processor, OGNL vs SpEL)
  * every relevant attribute, expression, utility method, option or property
  * where it runs (parse, preprocessing, processing, browser) and whether it keeps the template natural
  * whether **restricted mode** applies
  * pitfalls and exception names
  * recent changes with versions, and where the books are outdated
* **Examples:**
  * `[source,html]` templates with the **rendered output** where useful
  * `[source,java]` controllers, form objects, config and tests
  * `[source,properties]` for configuration and `[source,xml]` for dependencies
  * `[source,bash]` with `curl` (with and without `HX-Request: true`) for fragment/htmx endpoints
  * current APIs only: `jakarta.*`, `SecurityFilterChain`, `th:insert`, `~{…}`, `@MockitoBean`, `htmx-spring-boot` 5.x
* **Source links:** each example is followed by
  `Source: https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#<anchor>[Using Thymeleaf -- <section>]` (or
  the matching official page).
* **Page ending:** `== References`, listing only official docs (and the books' Leanpub pages where used).

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/thymeleaf-disclaimer.adoc`. (Created; single `[IMPORTANT]` block, xref to `web/thymeleaf/index.adoc#_bibliography`.)
  - [x] Task 1.1. Copy the shape of `partials/django-disclaimer.adoc`: a single `[IMPORTANT]` block with only the
    AI-assistance disclosure ("This content was generated with the assistance of AI and should be verified against the
    official documentation before being relied on in production") plus
    `xref:web/thymeleaf/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear anywhere under
    `web/thymeleaf/`.
- [x] Task 2. Verify and record the version baseline (scratchpad `238/versions-238.md`) that every later task cites. (Done 2026-10-07: Thymeleaf 3.1.5, Boot 4.1.1, Layout 4.0.1, htmx 2.0.11, htmx-spring-boot 5.2.0; scratch apps `238/app` and `238/app-reactive` build green. Deviations recorded in versions-238.md: thymeleaf-testing has no 3.1 release; U/S/E section numbering differs from the issue table; Layout 4.0 page says constructors deprecated, not a fluent API; webjars.org 404s on HEAD only.)
  - [x] Task 2.1. Re-check Maven Central metadata for:
    * `org.thymeleaf:thymeleaf`, `-spring6`, `extras-springsecurity6` and `thymeleaf-testing`
    * `nz.net.ultraq.thymeleaf:thymeleaf-layout-dialect`
    * `com.github.mxab.thymeleaf.extras:thymeleaf-extras-data-attribute`
    * `io.github.wimdeblauwe:htmx-spring-boot(-thymeleaf)`
    * `spring-boot-dependencies` (the latest 4.1.x and 4.2 status)

    Also re-check npm `htmx.org` dist-tags, the Thymeleaf GitHub releases/milestones (3.1.6/3.2/4.0) and the
    advisories. Record the numbers dated; don't copy them from the issue.
  - [x] Task 2.2. Re-verify the version-tagged claims in the issue's "Outdated in the books" and "New since the books"
    lists against U Appendix D, the S preface, the archived 3.1 what's-new article, the Layout Dialect migration pages,
    the htmx 2 migration guide and the `htmx-spring-boot` README. Record any deviations for
    `whats-changed-and-migration.adoc`.
  - [x] Task 2.3. Re-fetch https://www.thymeleaf.org/documentation.html and the three tutorial TOCs, then diff them
    against the issue's "Official documentation → page coverage" table (new or removed articles, anchor changes). Add
    anything new to the matching page task.
  - [x] Task 2.4. Run `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}'` on every URL in the issue's
    Bibliography, the book table and the scratchpad `official-docs.md` URL list. Record the canonical forms and any
    404s.
  - [x] Task 2.5. Re-verify the Spring Boot 4.1 `spring.thymeleaf.*` property list and defaults (application-properties
    appendix) and the `ThymeleafAutoConfiguration` behaviour (auto-registered dialects, module name, test starter).
  - [x] Task 2.6. Create a throwaway scratch **Spring Boot 4.1 + Thymeleaf** *Bookshelf* app in the scratchpad
    (`238/app`, via Spring Initializr or `curl https://start.spring.io/starter.zip …`). Never commit it. It needs:
    * the starters: Web, Thymeleaf, Validation, Security, Data JPA + H2 (or PostgreSQL via Docker Compose), DevTools,
      and `spring-boot-starter-thymeleaf-test`
    * Layout Dialect, `thymeleaf-extras-springsecurity6`, `htmx-spring-boot-thymeleaf` and a WebFlux sibling module for
      the reactive page
    * the skeleton: books/authors/reviews, layout, i18n (en/es), form login

    Every example is compiled and run there (`./mvnw test`, `spring-boot:run` + `curl`) before being pasted.
  - [x] Task 2.7. Check the book PDFs are only consulted and never staged. `git status` must never list a file from
    `~/Desktop/libros/thymeleaf/` or any `*.txt` extract.

### Group 2 — Foundations pages

**Parallelizable: yes (four independent pages; `index.adoc` is written in Group 10)**

- [x] Task 3. Create `introduction-and-architecture.adoc` ("Introduction & Architecture").
  - [x] Task 3.1. Header per "Conventions"; lead paragraph with the dated baseline.
  - [x] Task 3.2. Cover **every** bullet of this page's outline in issue #238. Key topics:
    * a template engine, not a web framework; natural templating
    * the six template modes; dialects and processors; Standard vs SpringStandard; OGNL vs SpEL
    * the parse → process → output pipeline and the caches; `th:*` vs `data-th-*`
    * SSR vs SPA vs server-driven UI (xref Vaadin and `backend/springboot/web-ui-frameworks.adoc`), and where htmx
      fits
    * a comparison table: JSP/JSTL, FreeMarker, Mustache, Groovy templates, JTE, Pebble and Qute, plus the Django,
      Blade, Razor, Jinja2 and askama rows (xrefs to the existing pages), each verified on its official site;
      #241/#239/#240/#263 in prose
    * version history and the versioning policy

    Book rows: Taming 1–2 and htmx 1–2.
  - [x] Task 3.3. Figures: SVGs `thymeleaf-processing-pipeline.svg` and `thymeleaf-natural-template.svg` (static file
    vs rendered).
  - [x] Task 3.4. Every example run in the scratch app and followed by a `Source:` link. Cover "what changed recently"
    and "where the books are outdated". End with `== References`.
- [x] Task 4. Create `getting-started.adoc` ("Getting Started") ★.
  - [x] Task 4.1. Header per "Conventions"; lead paragraph with the dated baseline.
  - [x] Task 4.2. Cover every outline bullet:
    * Spring Initializr (Maven and Gradle), `templates/` and `static/`, the first `@Controller` + `Model` + template
    * `spring-boot:run`, template reloading (`spring.thymeleaf.cache=false`, DevTools property defaults, the
      LiveReload deprecation in Boot 4.1), a `local` profile
    * the full *Bookshelf* project structure and persistence layer (xrefs to the Spring Data JPA/Hibernate pages)
    * the official example apps (GTVG, STSM, extraThyme)

    Book rows: Taming 2 and 9.
  - [x] Task 4.3. Figures: Mermaid of the request → controller → view → HTML flow.
  - [x] Task 4.4. Examples run, `Source:` links, recent changes, book-outdated notes, `== References`. As a ★ page it
    needs a pitfalls table and a worked *Bookshelf* example.
- [x] Task 5. Create `standalone-engine-and-configuration.adoc` ("Standalone Engine & Configuration").
  - [x] Task 5.1. Header per "Conventions"; lead paragraph (standalone, no Spring).
  - [x] Task 5.2. Cover every outline bullet:
    * `TemplateEngine.process`
    * every template resolver type and its options; chaining (`order`, `resolvablePatterns`, `checkExistence`)
    * `Context`/`WebContext` and the 3.1 `IWebApplication`/`IWebExchange` with `JakartaServletWebApplication`
    * message resolvers and conversion services
    * logging categories, the template cache (`StandardCacheManager`, `clearTemplateCache()`), the GTVG example

    Official rows: U §2, §15, §16.
  - [x] Task 5.3. Examples run as a plain Java `main` + a Jakarta servlet filter in the scratch area, each followed by
    `Source:` links. End with `== References`.
- [x] Task 6. Create `spring-boot-auto-configuration-and-properties.adoc` ("Spring Boot Auto-configuration &
  Properties") ★.
  - [x] Task 6.1. Header per "Conventions"; lead paragraph with the dated baseline.
  - [x] Task 6.2. Cover every outline bullet:
    * `ThymeleafAutoConfiguration` in the `spring-boot-thymeleaf` module, the beans it creates and the auto-registered
      Layout/DataAttribute/SpringSecurity dialects
    * a table of **every** `spring.thymeleaf.*` property with its default (from Task 2.5)
    * extra template resolvers (an SVG icon resolver) and extra dialect beans; overriding `thymeleafViewResolver`
    * `spring-boot-starter-thymeleaf-test`; DevTools defaults; IDE classpath pitfalls

    Book row: Taming 4 (cache in the local profile).
  - [x] Task 6.3. Examples run, `Source:` links, `== References`. Add a pitfalls table.

### Group 3 — Core template language pages

**Parallelizable: yes (ten independent pages)**

- [x] Task 7. Create `standard-expression-syntax.adoc` ("Standard Expression Syntax") ★.
  - [x] Task 7.1. Header per "Conventions"; lead paragraph.
  - [x] Task 7.2. Cover every outline bullet:
    * the five expression types
    * OGNL vs SpEL navigation, safe navigation, `${@bean}`
    * basic objects (`#ctx`, `#vars`/`#root`, `#locale`); the `param`/`session`/`application` namespaces
    * the 3.1 removal of `#request`/`#session`/`#servletContext` and the replacements (the "how to access data"
      article)
    * selection with `th:object`; evaluation per attribute and restricted mode

    Official rows: U §4 intro, Appendix A, "Standard dialect in 5 minutes". Book row: Taming 3.
  - [x] Task 7.3. Figures: Mermaid of the expression types and where each resolves.
  - [x] Task 7.4. Examples run, `Source:` links, `== References`, pitfalls table. Every `*{…}`, `~{…}`, `${{…}}` in
    prose uses a passthrough.
- [x] Task 8. Create `literals-operators-and-preprocessing.adoc` ("Literals, Operators & Preprocessing").
  - [x] Task 8.1. Header per "Conventions"; lead paragraph.
  - [x] Task 8.2. Cover every outline bullet:
    * text, number, boolean, `null` and token literals; `+` and literal substitution `|…|`
    * arithmetic (`div`/`mod`), comparators and aliases, boolean operators
    * conditional and Elvis expressions, the no-op token `_`
    * double-brace conversion
    * preprocessing `__${…}__` with escaping and restricted mode

    Official rows: U §4.6–4.14.
  - [x] Task 8.3. Examples run, `Source:` links, `== References`.
- [x] Task 9. Create `expression-utility-objects.adoc` ("Expression Utility Objects") ★.
  - [x] Task 9.1. Header per "Conventions"; lead paragraph.
  - [x] Task 9.2. Cover every utility object of U Appendix B with examples:
    * `#execInfo`, `#messages`, `#uris`, `#conversions`
    * `#dates`, `#calendars`, `#temporals` (locale-aware; built into core since 3.1)
    * `#numbers` (incl. `sequence`), `#strings`, `#objects`, `#bools`
    * `#arrays`, `#lists`, `#sets`, `#maps`, `#aggregates`, `#ids`
    * Spring's `#fields`/`#themes`/`#mvc` and Spring Security's `#authentication`/`#authorization` (xrefs to their
      pages)

    Book row: htmx 6 (`#temporals.format`).
  - [x] Task 9.3. Examples run (each method family at least once, with rendered output), `Source:` links,
    `== References`.
- [x] Task 10. Create `text-and-attribute-setting.adoc` ("Text & Attribute Setting") ★.
  - [x] Task 10.1. Header per "Conventions"; lead paragraph.
  - [x] Task 10.2. Cover every outline bullet:
    * `th:text` vs `th:utext`
    * `th:attr` and the full specific-attribute table
    * `th:alt-title`/`th:lang-xmllang`; `th:attrappend`/`attrprepend`/`classappend`/`styleappend`
    * fixed-value boolean attributes
    * the default attribute processor (`th:data-*`, `th:aria-*`, `th:hx-*`)
    * `data-th-*`; `th:on*` in restricted mode

    Official rows: U §3, §5. Book row: Taming 3.
  - [x] Task 10.3. Examples run, `Source:` links, `== References`, pitfalls table.
- [x] Task 11. Create `iteration-and-conditionals.adoc` ("Iteration & Conditionals") ★.
  - [x] Task 11.1. Header per "Conventions"; lead paragraph.
  - [x] Task 11.2. Cover every outline bullet:
    * `th:each` over every iterable kind incl. `Stream`, and the iteration status properties
    * `LazyContextVariable`
    * `th:if`/`th:unless` truthiness; `th:switch`/`th:case`
    * striped tables, empty states, nested iteration

    Official rows: U §6, §7, §14, S §5–6. Book row: Taming 3.
  - [x] Task 11.3. Figures: Mermaid of the truthiness decision.
  - [x] Task 11.4. Examples run, `Source:` links, `== References`.
- [x] Task 12. Create `local-variables-precedence-comments-and-blocks.adoc` ("Local Variables, Attribute Precedence,
  Comments & Blocks").
  - [x] Task 12.1. Header per "Conventions"; lead paragraph.
  - [x] Task 12.2. Cover every outline bullet:
    * `th:with`; the full attribute-precedence table
    * HTML comments, parser-level `<!--/* */-->` and prototype-only `<!--/*/ /*/-->` blocks
    * `th:block`

    Official rows: U §9–11. Book row: Taming 3.
  - [x] Task 12.3. Figures: SVG `thymeleaf-attribute-precedence.svg`.
  - [x] Task 12.4. Examples run, `Source:` links, `== References`.
- [x] Task 13. Create `link-urls.adoc` ("Link URLs").
  - [x] Task 13.1. Header per "Conventions"; lead paragraph.
  - [x] Task 13.2. Cover every outline bullet:
    * absolute, context-relative, server-relative and protocol-relative URLs
    * parameters, path variables, fragment identifiers, expressions in URLs
    * URL rewriting and `ResourceUrlEncodingFilter`
    * restricted mode for URL bases; `#mvc.url`

    Official rows: U §4.4, the "Standard URL syntax" article, S §12. Book row: Taming 3.
  - [x] Task 13.3. Examples run (with rendered `href`s), `Source:` links, `== References`.
- [x] Task 14. Create `inlining.adoc` ("Inlining") ★.
  - [x] Task 14.1. Header per "Conventions"; lead paragraph.
  - [x] Task 14.2. Cover every outline bullet:
    * `[[…]]` vs `[(…)]`, inlining vs natural templates, `th:inline="none"`, text inlining
    * JavaScript inlining: escaping, natural JS templates, JSON serialisation of beans/maps/records with Jackson 2/3
      (3.1.5)
    * CSS inlining
    * passing server data to Alpine/JS safely (the books' erratum, corrected)

    Official row: U §12.
  - [x] Task 14.3. Examples run (show the serialised output), `Source:` links, `== References`, pitfalls table.
- [x] Task 15. Create `textual-template-modes.adoc` ("Textual Template Modes").
  - [x] Task 15.1. Header per "Conventions"; lead paragraph.
  - [x] Task 15.2. Cover every outline bullet:
    * TEXT/JAVASCRIPT/CSS modes; `[# …]…[/]`, `[#th:block]`, escaped element attributes
    * the `/*[+ +]*/` and `/*[- -]*/` comments; natural JS/CSS templates
    * extensibility; use cases (plain-text email, CSV, generated JS/CSS, config files)

    Official row: U §13.
  - [x] Task 15.3. Examples run, `Source:` links, `== References`.
- [x] Task 16. Create `natural-templates-and-decoupled-logic.adoc` ("Natural Templates & Decoupled Logic").
  - [x] Task 16.1. Header per "Conventions"; lead paragraph.
  - [x] Task 16.2. Cover every outline bullet:
    * end-to-end natural templates; prototype-only content and mock rows with `th:remove` (all five values)
    * static paths that work both ways
    * decoupled template logic (`*.th.xml`, `<attr sel>`, `setUseDecoupledLogic`, `th:ref`, the resolver, performance)
    * the designer/developer workflow

    Official rows: U §17, S §8.
  - [x] Task 16.3. Figures: SVG `thymeleaf-decoupled-logic.svg`.
  - [x] Task 16.4. Examples run (incl. Spring Boot config for decoupled logic), `Source:` links, `== References`.

### Group 4 — Fragments and layouts pages

**Parallelizable: yes (three independent pages)**

- [x] Task 17. Create `fragments.adoc` ("Fragments") ★. (Created `fragments.adoc`; examples run in scratch app 238/app-t17 with real rendered output; Mermaid insert/replace/include diagram; pitfalls table.)
  - [x] Task 17.1. Header per "Conventions"; lead paragraph.
  - [x] Task 17.2. Cover every outline bullet:
    * `th:fragment`, `th:insert`/`th:replace` (and deprecated `th:include`); the `~{…}` specification syntax
    * markup selectors (U Appendix C)
    * parameterised fragments (positional/named), fragment-local variables, `th:assert`
    * passing markup, the empty fragment, the no-op default, conditional insertion, `th:remove`
    * pitfalls

    Official rows: U §8.1–8.4, Appendix C. Book row: Taming 5.
  - [x] Task 17.3. Figures: Mermaid of insert vs replace output.
  - [x] Task 17.4. Examples run (rendered output shown), `Source:` links, `== References`, pitfalls table.
- [x] Task 18. Create `layouts-and-the-layout-dialect.adoc` ("Layouts & the Layout Dialect") ★. (Created `layouts-and-the-layout-dialect.adoc` and `images/thymeleaf-layout-decoration.svg`; examples run in 238/app-t18 incl. standalone dialect options and a Boot LayoutDialect bean.)
  - [x] Task 18.1. Header per "Conventions"; lead paragraph (Layout Dialect version dated).
  - [x] Task 18.2. Cover every outline bullet:
    * include-style vs hierarchical layouts; the native parameterised layout
    * Layout Dialect 4.0: install/auto-config, `layout:decorate`, `layout:fragment`, head merging and sorting
      strategies, `layout:title-pattern`, `layout:insert`/`layout:replace`, passing data, configuration
    * migrating to 3.0/4.0
    * a comparison table; the *Bookshelf* `layout/main.html`

    Official rows: U §8.5, the "Layouts" article, the Layout Dialect site. Book row: Taming 6.
  - [x] Task 18.3. Figures: SVG `thymeleaf-layout-decoration.svg`.
  - [x] Task 18.4. Examples run, `Source:` links, `== References`, pitfalls table.
- [x] Task 19. Create `reusable-ui-components.adoc` ("Reusable UI Components"). (Created `reusable-ui-components.adoc`; examples run in 238/app-t19.)
  - [x] Task 19.1. Header per "Conventions"; lead paragraph.
  - [x] Task 19.2. Cover every outline bullet:
    * a fragment component library: form fields via preprocessing, buttons, alerts, modals, pagination, active menu
      items
    * inline SVG icons via an extra resolver
    * `thymeleaf-extras-data-attribute`
    * when to use web components or a custom dialect instead

    Book rows: Taming 5, 12.
  - [x] Task 19.3. Examples run, `Source:` links, `== References`.

### Group 5 — Spring MVC web application pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 20. Create `spring-mvc-integration.adoc` ("Spring MVC Integration") ★.
  - [x] Task 20.1. Header per "Conventions"; lead paragraph.
  - [x] Task 20.2. Cover every outline bullet:
    * `thymeleaf-spring6` and the SpringStandard Dialect; `SpringTemplateEngine`, `SpringResourceTemplateResolver`,
      the SpEL compiler
    * views and view resolvers; `redirect:`/`forward:`
    * controllers, `Model`, `@ModelAttribute` (incl. global via `@ControllerAdvice`), `@PathVariable`/`@RequestParam`
    * PRG; `HiddenHttpMethodFilter` + `th:method`
    * request/session/application data; STSM; Spring WebFlow as a legacy note

    Official rows: S §1–4, §13, the "how to access data" article. Book rows: Taming 7, 13.
  - [x] Task 20.3. Figures: Mermaid sequence of PRG.
  - [x] Task 20.4. Examples run (MockMvc or curl), `Source:` links, `== References`, pitfalls table.
- [x] Task 21. Create `forms-and-data-binding.adoc` ("Forms & Data Binding") ★.
  - [x] Task 21.1. Header per "Conventions"; lead paragraph.
  - [x] Task 21.2. Cover every outline bullet:
    * `th:object`/`th:action`; form-data vs domain objects
    * `th:field` on every input type: textarea, single and multi checkboxes with hidden markers and
      `render-hidden-markers-before-checkboxes`, radios, selects (enums and entities)
    * `#ids` labels; dynamic rows
    * shared create/edit templates; optimistic locking; file upload
    * automatic CSRF via `RequestDataValueProcessor`

    Official rows: S §7, §11. Book rows: Taming 10–12, 16.
  - [x] Task 21.3. Figures: SVG `thymeleaf-form-binding.svg`.
  - [x] Task 21.4. Examples run, `Source:` links, `== References`, pitfalls table.
- [x] Task 22. Create `validation-and-error-messages.adoc` ("Validation & Error Messages") ★.
  - [x] Task 22.1. Header per "Conventions"; lead paragraph.
  - [x] Task 22.2. Cover every outline bullet:
    * `@Valid`/`@Validated` + `BindingResult` ordering
    * every `#fields` method, `th:errors`, `th:errorclass`, `'*'`/`'all'`/`'global'`, errors outside forms
    * message-code resolution and `LocalValidatorFactoryBean`
    * custom field- and class-level validators; groups and `@GroupSequence`
    * accessible error markup (xref `web/accessibility.adoc`)

    Official row: S §7.7. Book rows: Taming 11–12, 14.
  - [x] Task 22.3. Figures: Mermaid of the message-code resolution order.
  - [x] Task 22.4. Examples run (tests asserting the rendered errors), `Source:` links, `== References`, pitfalls table.
- [x] Task 23. Create `conversion-and-formatting.adoc` ("Conversion & Formatting").
  - [x] Task 23.1. Header per "Conventions"; lead paragraph.
  - [x] Task 23.2. Cover every outline bullet:
    * `ConversionService`, `Formatter`/`Converter` registration
    * `${{…}}`, `#conversions.convert`, conversion in `th:field`
    * `@DateTimeFormat`/`@NumberFormat`; `PropertyEditor` vs `Formatter`, `@InitBinder` (`StringTrimmerEditor`)
    * id/value-object converters

    Official rows: S §9, U conversion services. Book rows: Taming 12, 16.
  - [x] Task 23.3. Examples run, `Source:` links, `== References`.
- [x] Task 24. Create `internationalization.adoc` ("Internationalization") ★.
  - [x] Task 24.1. Header per "Conventions"; lead paragraph.
  - [x] Task 24.2. Cover every outline bullet:
    * `#{…}` with parameters and dynamic keys; `#messages`
    * `spring.messages.*`, missing-key markers
    * the `LocaleResolver` options, `LocaleChangeInterceptor` and a switcher fragment
    * locale-aware formatting, translated enums, `lang`/`dir`
    * custom message resolvers (3.1, fixed in 3.1.5)

    Official rows: U §3, `#messages`. Book row: Taming 8.
  - [x] Task 24.3. Figures: Mermaid of locale resolution.
  - [x] Task 24.4. Examples run (en/es), `Source:` links, `== References`, pitfalls table.
- [x] Task 25. Create `displaying-data-pagination-and-sorting.adoc` ("Displaying Data, Pagination & Sorting").
  - [x] Task 25.1. Header per "Conventions"; lead paragraph.
  - [x] Task 25.2. Cover every outline bullet:
    * tables/lists, empty states
    * `Pageable`/`Page`, `@PageableDefault`/`@SortDefault`, `spring.data.web.pageable.*`
    * a reusable pagination fragment and sortable headers preserving the query string; GET search forms

    Book row: Taming 10. Xref the Spring Data JPA and `database/pagination-strategies.adoc` pages.
  - [x] Task 25.3. Examples run, `Source:` links, `== References`.
- [x] Task 26. Create `error-handling-and-flash-messages.adoc` ("Error Handling & Flash Messages").
  - [x] Task 26.1. Header per "Conventions"; lead paragraph.
  - [x] Task 26.2. Cover every outline bullet:
    * Boot error pages and error attributes (`server.error.*`)
    * `@ControllerAdvice` views for 404/409
    * HTML vs `ProblemDetail`
    * flash attributes and an alert/toast fragment

    Book rows: Taming 12–13.
  - [x] Task 26.3. Examples run, `Source:` links, `== References`.

### Group 6 — Security pages

**Parallelizable: yes (two independent pages)**

- [x] Task 27. Create `spring-security-integration.adoc` ("Spring Security Integration") ★. — 27 scratch tests green (app-t27), Mermaid form-login flow validated, build clean.
  - [x] Task 27.1. Header per "Conventions"; lead paragraph (`thymeleaf-extras-springsecurity6`, Spring Security 7.x
    dated).
  - [x] Task 27.2. Cover every outline bullet:
    * the `sec` dialect and Boot auto-config
    * `sec:authorize(-expr)`, `sec:authorize-url` (with method), `sec:authorize-acl`, `sec:authentication`
    * `#authentication`/`#authorization`
    * the custom login page (`param.error`/`param.logout`), POST logout, a 403 page
    * a modern `SecurityFilterChain`, `UserDetailsService`, `@EnableMethodSecurity`
    * CSRF (automatic, manual, meta tags)
    * OAuth2 login (xref the OAuth pages)

    Official rows: the extras README, the Spring Security article, S §11. Book rows: Taming 13–14, htmx 8.
  - [x] Task 27.3. Figures: Mermaid of the form-login flow.
  - [x] Task 27.4. Examples run (`@WithMockUser` tests), `Source:` links, `== References`, pitfalls table. No literal
    passwords outside clearly marked test code.
- [x] Task 28. Create `template-security-and-xss.adoc` ("Template Security & XSS") ★. — examples run in app-t28, CVEs verified vs GitHub advisories, SVG added, build clean.
  - [x] Task 28.1. Header per "Conventions"; lead paragraph (minimum 3.1.5).
  - [x] Task 28.2. Cover every outline bullet:
    * escaping by context; when `th:utext`/`[(…)]` are acceptable; sanitising HTML
    * class restrictions and the allow-list
    * restricted mode: where it applies and what it forbids
    * SSTI: view names and fragment selectors from input, user-editable templates; the CVE table (CVE-2021-43466,
      CVE-2026-40477, CVE-2026-40478, CVE-2026-41901, plus CVE-2023-38286 in Spring Boot Admin) with affected and fixed
      versions
    * CSP nonces and inline scripts
    * the books' errata

    Official row: U Appendix D. Book rows: htmx 10–11 errata.
  - [x] Task 28.3. Figures: SVG `thymeleaf-escaping-contexts.svg`.
  - [x] Task 28.4. Examples run (show escaped output, and that a restricted expression is rejected), `Source:` links,
    `== References`, pitfalls table. Never publish a working exploit payload; describe the vulnerable pattern instead.

### Group 7 — Dynamic and interactive pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 29. Create `fragment-rendering-and-ajax.adoc` ("Fragment Rendering & AJAX") ★.
  - [x] Task 29.1. Header per "Conventions"; lead paragraph (Spring Framework 7.x dated).
  - [x] Task 29.2. Cover every outline bullet:
    * fragment view names, `ThymeleafView` markup selectors
    * `FragmentsRendering` / `Collection<ModelAndView>`
    * the `fetch()` baseline (dynamic rows)
    * `SpringTemplateEngine.process` with fragment selectors

    Official rows: S §10, the Spring "HTML fragments" docs. Book rows: Taming 16, htmx 3, 6.
  - [x] Task 29.3. Figures: Mermaid sequence of a full-page vs fragment request.
  - [x] Task 29.4. Examples run (curl), `Source:` links, `== References`, pitfalls table.
- [x] Task 30. Create `htmx-fundamentals.adoc` ("htmx Fundamentals") ★.
  - [x] Task 30.1. Header per "Conventions"; lead paragraph (htmx version dated, htmx 4 status).
  - [x] Task 30.2. Cover every outline bullet:
    * hypermedia-driven apps; installation (webjar/npm/CDN with SRI, extension packages)
    * the verb attributes via `th:hx-*`
    * triggers (all modifiers and special events), extended target selectors, swap strategies and modifiers
    * `hx-select`/`include`/`vals`/`params`/`confirm`/`indicator`/`disabled-elt`/`push-url`/`boost`, history
    * OOB swaps; all `HX-*` request/response headers; events, JS API, config
    * htmx 2 vs 1.x

    Book rows: htmx 3–6.
  - [x] Task 30.3. Figures: Mermaid sequence of an htmx request and swap.
  - [x] Task 30.4. Examples run (curl with `HX-Request`, plus a Playwright check of a swap), `Source:` links,
    `== References`, pitfalls table.
- [x] Task 31. Create `htmx-with-spring-boot.adoc` ("htmx with Spring Boot") ★.
  - [x] Task 31.1. Header per "Conventions"; lead paragraph (`htmx-spring-boot` version matrix dated).
  - [x] Task 31.2. Cover every outline bullet:
    * `@HxRequest`, `HtmxRequest`, `HtmxResponse` as an argument, the `@Hx*` annotations, the htmx views, the
      `redirect:htmx:` prefix
    * the `hx:` dialect (`hx:vals`, automatic CSRF)
    * same URL serving page and fragment; multiple fragments and OOB swaps
    * CSRF header approach, session expiry entry point, error handling
    * migrating from the 3.x API

    Book rows: htmx 4–6, 8.
  - [x] Task 31.3. Examples run, `Source:` links, `== References`, pitfalls table.
- [x] Task 32. Create `htmx-patterns.adoc` ("htmx Patterns") ★.
  - [x] Task 32.1. Header per "Conventions"; lead paragraph.
  - [x] Task 32.2. Cover every outline bullet, each as a *Bookshelf* controller + template + `curl`:
    * active search, click-to-load, infinite scroll, paginated history
    * inline edit, delete with confirm and animation, bulk actions
    * inline validation, dependent selects, dynamic rows
    * OOB counters and toasts, progress-bar polling + download, modals/tabs, SortableJS

    Book rows: htmx 5, 7, 9.
  - [x] Task 32.3. Figures: Mermaid of the polling progress flow.
  - [x] Task 32.4. Examples run, `Source:` links (htmx.org examples), `== References`.
- [x] Task 33. Create `alpine-js-and-web-components.adoc` ("Alpine.js & Web Components").
  - [x] Task 33.1. Header per "Conventions"; lead paragraph (Alpine 3.x, Web Awesome/Shoelace status dated).
  - [x] Task 33.2. Cover every outline bullet:
    * Alpine 3 directives with Thymeleaf; combining with htmx events
    * passing data safely
    * web components with htmx/Thymeleaf, `htmx.onLoad`

    Book rows: Taming 4, 13, 16; htmx 7, 10.
  - [x] Task 33.3. Examples run (browser-checked with Playwright), `Source:` links, `== References`.
- [x] Task 34. Create `server-sent-events-and-websockets.adoc` ("Server-Sent Events & WebSockets").
  - [x] Task 34.1. Header per "Conventions"; lead paragraph.
  - [x] Task 34.2. Cover every outline bullet:
    * `SseEmitter` and `Flux<ServerSentEvent>` with rendered fragments
    * the htmx SSE and WS extensions
    * Spring WebSocket handler; OOB updates
    * scaling (#264 in prose)

    Book row: htmx 11 (with its string-built-HTML erratum corrected).
  - [x] Task 34.3. Figures: Mermaid sequence of SSE fragment push.
  - [x] Task 34.4. Examples run, `Source:` links, `== References`.
- [x] Task 35. Create `reactive-webflux.adoc` ("Reactive Rendering with WebFlux").
  - [x] Task 35.1. Header per "Conventions"; lead paragraph (WebFlux).
  - [x] Task 35.2. Cover every outline bullet:
    * `SpringWebFluxTemplateEngine`, `ThymeleafReactiveViewResolver`/`View`
    * the FULL/CHUNKED/DATA-DRIVEN modes; `ReactiveDataDriverContextVariable` and SSE data drivers
    * `spring.thymeleaf.reactive.*`
    * when it's worth it

    Official rows: the javadocs, the Spring WebFlux view docs, the Boot reactive docs.
  - [x] Task 35.3. Figures: Mermaid of data-driven chunked rendering.
  - [x] Task 35.4. Examples run in the WebFlux module (curl `--no-buffer` showing chunks), `Source:` links,
    `== References`.

### Group 8 — Assets, other outputs, quality and operations pages

**Parallelizable: yes (seven independent pages; `whats-changed-and-migration.adoc` collects outdated items from the
issue and Task 2.2, not from other pages)**

- [x] Task 36. Create `styling-and-front-end-assets.adoc` ("Styling & Front-end Assets").
  - [x] Task 36.1. Header per "Conventions"; lead paragraph (Tailwind v4 dated).
  - [x] Task 36.2. Cover every outline bullet:
    * static resources, webjars + locator, versioned resources
    * Tailwind v4 with `@source` scanning templates (CLI/npm, `frontend-maven-plugin`)
    * Bootstrap (xref); `ttcli`; live reload without DevTools LiveReload

    Xref the Tailwind, Bootstrap and HTML & CSS sections. Book rows: Taming 4, htmx 2.
  - [x] Task 36.3. Examples run (Tailwind build output), `Source:` links, `== References`.
- [x] Task 37. Create `emails-and-text-templates.adoc` ("Emails & Text Templates").
  - [x] Task 37.1. Header per "Conventions"; lead paragraph.
  - [x] Task 37.2. Cover every outline bullet:
    * a dedicated email `SpringTemplateEngine` with class-loader + string resolvers
    * HTML and TEXT templates, inline images/attachments, i18n
    * DB-stored editable templates and their security caveat
    * HTML → PDF mention (#261 in prose)

    Official row: the "Sending email in Spring" article.
  - [x] Task 37.3. Examples run (render to a string in a test; GreenMail or a logging `JavaMailSender`), `Source:`
    links, `== References`.
- [x] Task 38. Create `testing.adoc` ("Testing") ★.
  - [x] Task 38.1. Header per "Conventions"; lead paragraph.
  - [x] Task 38.2. Cover every outline bullet:
    * `@WebMvcTest` with `MockMvcTester`/`MockMvc`, `@MockitoBean`
    * Spring Security test support
    * HtmlUnit via `MockMvcWebClientBuilder`
    * `thymeleaf-testing` (`.thtest`, `TestExecutor`, Spring modules) and testing extensions (`TemplateData`)
    * testing htmx endpoints
    * Playwright E2E with Testcontainers (xref `web/e2e-testing-real-browsers.adoc`, #258 in prose)

    Book row: Taming 15 (Cypress 5 and `@MockBean` noted as outdated).
  - [x] Task 38.3. Figures: Mermaid of the testing pyramid for a Thymeleaf app.
  - [x] Task 38.4. Examples run (`./mvnw test` green), `Source:` links, `== References`, pitfalls table.
- [x] Task 39. Create `extending-thymeleaf.adoc` ("Extending Thymeleaf").
  - [x] Task 39.1. Header per "Conventions"; lead paragraph.
  - [x] Task 39.2. Cover every outline bullet:
    * why extend; the five dialect types
    * the processor types; evaluating expressions in processors; `IModelFactory`; escaping
    * expression objects
    * the extraThyme example, registration in Boot, testing

    Official rows: E §1–4, the two "Say Hello" articles.
  - [x] Task 39.3. Figures: Mermaid class diagram of dialects/processors (stereotypes as entities per CLAUDE.md).
  - [x] Task 39.4. Examples run (a custom `bookshelf:` dialect), `Source:` links, `== References`.
- [x] Task 40. Create `performance-and-production.adoc` ("Performance & Production").
  - [x] Task 40.1. Header per "Conventions"; lead paragraph.
  - [x] Task 40.2. Cover every outline bullet:
    * caching, the SpEL compiler, partial output
    * lazy variables, N+1 and Open Session In View (`spring.jpa.open-in-view=false`)
    * HTTP caching/compression
    * jar/Docker/buildpacks/GraalVM native notes

    Xref the Docker/Kubernetes/cloud pages. Book row: Taming 16.
  - [x] Task 40.3. Examples run, `Source:` links, `== References`.
- [x] Task 41. Create `tooling-and-ide-support.adoc` ("Tooling & IDE Support").
  - [x] Task 41.1. Header per "Conventions"; lead paragraph.
  - [x] Task 41.2. Cover every outline bullet:
    * IntelliJ IDEA support and `@thymesVar`, VS Code extensions, the legacy Eclipse plugin
    * htmx/Alpine IDE plugins, `ttcli`
    * the javadocs and the monorepo examples

    #116 in prose. Book rows: Taming 5, htmx 2.
  - [x] Task 41.3. Every tool/plugin name verified on its official marketplace page; `Source:` links;
    `== References`.
- [x] Task 42. Create `whats-changed-and-migration.adoc` ("What's Changed & Migration").
  - [x] Task 42.1. Header per "Conventions"; lead paragraph.
  - [x] Task 42.2. Cover every outline bullet:
    * 2.1 → 3.0, 3.0 → 3.1, and the 3.1.1–3.1.5 patch line with the security releases
    * Boot 2 → 3 → 4 for Thymeleaf apps; Layout Dialect 2 → 3 → 4; htmx 1 → 2 (→ 4 preview); `htmx-spring-boot`
      3 → 5
    * **every "outdated in the books" row and erratum** from the issue (and Task 2.2 deviations) in one place

    Archived articles cited as archived.
  - [x] Task 42.3. Figures: Mermaid timeline of versions.
  - [x] Task 42.4. Before/after examples, `Source:` links, `== References`.

### Group 9 — Coverage audit before the landing page

**Parallelizable: yes (single task)**

- [x] Task 43. Audit coverage of all 40 concept pages against the issue.
  - [x] Task 43.1. Walk the issue's "Official documentation → page coverage" table, the book concept table ("Covered
    on") and every Page-outline bullet. For each row, `grep` the target page for the concept and fix any gap in that
    page.
  - [x] Task 43.2. Confirm every ★ page has a pitfalls table, at least one diagram and a worked *Bookshelf* example,
    and that every 📊 figure exists (`ls modules/ROOT/images/thymeleaf-*.svg`, `grep -c '\[mermaid\]'`).
    Done: audit fixes in getting-started (project layout), inlining (diagram), htmx-fundamentals (debounced PUT, temporals), htmx-patterns (HTTP Interface), spring-security-integration (password-match validator), testing (print, Object Mother), plus defects (a)-(d) and xref conversions; validate:mermaid 1328 parsed, build only expected index xref error.

### Group 10 — Landing page, bibliography and cheat sheet

**Parallelizable: no — `index.adoc` and the cheat sheet link every page created in Groups 2–8, and the PDF summarises
them**

- [x] Task 44. Create `index.adoc` ("Thymeleaf") with `== Bibliography`.
  - [x] Task 44.1. Header per "Conventions" (`= Thymeleaf`, disclaimer include); lead paragraph with the dated baseline
    and support status.
  - [x] Task 44.2. Cover every bullet of the `index.adoc` outline:
    * what Thymeleaf is and who the section is for; the *Bookshelf* scenario (`[#bookshelf]`, as in
      `web/django/index.adoc`)
    * the reading path (Java Reference, Spring Boot Reference)
    * `== What's covered`, grouped as the nav
    * the "where related material lives elsewhere on this site" table (every row of the issue's existing-pages table,
      xrefs verified)
    * related issues in prose
  - [x] Task 44.3. `== Bibliography`: every source in the issue's Bibliography section, each linked to its official
    website (canonical URLs from Task 2.4):
    * the two books (author, title, Leanpub page, version consulted, companion repo)
    * thymeleaf.org tutorials, articles and pages; GitHub repo/advisories
    * Layout Dialect; Spring Boot/Framework/Security/Data; Bean Validation
    * htmx and `htmx-spring-boot`; Alpine/Tailwind/WebJars/HtmlUnit/Playwright/Testcontainers/OWASP sanitizer/Jackson
    * specifications and security sources
  - [x] Task 44.4. Figures: SVG `thymeleaf-bookshelf-architecture.svg` and a Mermaid mind-map of the section.
  - [x] Task 44.5. End with `== References`.
- [x] Task 45. Create `cheat-sheet.adoc` ("Thymeleaf Cheat Sheet").
  - [x] Task 45.1. Follow `web/django/cheat-sheet.adoc`:
    * header + `:description:`/`:keywords:`, disclaimer include
    * an intro linking `xref:attachment$thymeleaf-cheat-sheet.pdf[downloadable PDF]` with the dated baseline
    * grouped `*Group* --` paragraphs of `xref:`s to every page in the section
    * a final `xref:attachment$thymeleaf-cheat-sheet.pdf[Download the Thymeleaf Cheat Sheet (PDF)]` line
    * `== References`
- [x] Task 46. Create `modules/ROOT/attachments/thymeleaf-cheat-sheet.pdf` ("Thymeleaf Cheat Sheet").
  - [x] Task 46.1. Design a throwaway HTML page (scratchpad `238/cheatsheet/`) rendered with headless Chrome
    print-to-PDF (`--print-to-pdf --no-pdf-header-footer`): exactly one A4 page, dense multi-column, colour-coded, with
    versions and date in the header.
  - [x] Task 46.2. Summarise every concept listed in the issue's "Cheat sheet" section, as one box per group:
    * setup and properties; expression types and basic objects; literals and operators; utility objects
    * the `th:*` table with the precedence order; iteration status and truthiness
    * fragments and the Layout Dialect; comments, blocks and inlining
    * Spring forms; i18n, conversion and links; Spring Security
    * fragment rendering and htmx; reactive, testing and extending
    * the security strip; the "changed since older tutorials" strip
  - [x] Task 46.3. Verify exactly one A4 page (`python3 -I -c "import pypdf…"`: 1 page, 595×842 pt) and render it to
    PNG with Chrome or `qlmanage` to check legibility and overflow. Commit only the PDF, never the HTML.

### Group 11 — Site wiring and back-links

**Parallelizable: yes (independent files)**

- [x] Task 47. Update `modules/ROOT/nav.adoc`.
  - [x] Task 47.1. Immediately after `**** xref:web/vaadin/cheat-sheet.adoc[Cheat Sheet (PDF)]` (~l.614) and before
    `include::partial$nav-python.adoc[]`, add `*** xref:web/thymeleaf/index.adoc[Thymeleaf]`. Give it `****` children
    for all 40 concept pages in the issue's outline order (Foundations, Core template language, Fragments and layouts,
    Spring MVC, Security, Dynamic and interactive, Assets and other outputs, Quality/extension/operations), ending with
    `**** xref:web/thymeleaf/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 48. Update `modules/ROOT/pages/web/index.adoc` and the root `modules/ROOT/pages/index.adoc`.
  - [x] Task 48.1. `web/index.adoc`:
    * add a **Thymeleaf** bullet after the Vaadin bullet (l.61–64 style), ending ", plus a downloadable cheat sheet."
    * add "Thymeleaf" after "Vaadin Reference" in `:description:`
    * append the issue's keyword list to `:keywords:`
  - [x] Task 48.2. Root `index.adoc`:
    * in `:description:`, change "web-development (including Next.js, Django and Laravel)" to "web-development
      (including Next.js, Django, Laravel and Thymeleaf)"
    * append `Thymeleaf, natural templates, htmx` to `:keywords:`
    * no new tile
- [x] Task 49. Add the back-links: one line each, only where the page already discusses the topic, with every target
  verified with `ls` first.
  - [x] Task 49.1. Spring Boot pages:
    * `backend/springboot/web-ui-frameworks.adoc` (top of the Thymeleaf section, l.11)
    * `backend/springboot/index.adoc` (l.156 bullet)
  - [x] Task 49.2. Django and Laravel pages:
    * `web/django/index.adoc`: replace "Thymeleaf templating (#238)" in the planned-topics sentence (l.373–376) with an
      `xref:` and keep the other issues in prose
    * `web/django/introduction-and-architecture.adoc` (l.809)
    * `web/php-laravel/introduction-and-architecture.adoc` (l.363)
  - [x] Task 49.3. Vaadin and htmx-in-other-stacks pages:
    * `web/vaadin/spring-boot-integration.adoc` (l.160)
    * `web/django/template-partials-and-htmx.adoc`
    * `backend/axum/htmx.adoc`
  - [x] Task 49.4. Front-end and testing pages:
    * `web/tailwind/getting-started.adoc` ("Framework guides", l.104–110)
    * `web/e2e-testing-real-browsers.adoc` (per-framework list, l.10–13)
  - [x] Task 49.5. OAuth and architecture pages:
    * `backend/oauth/flows-overview.adoc` (l.191)
    * `backend/architecture/decisions-and-migrations/layering-backend-and-frontend.adoc`
    * `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (where Thymeleaf is mentioned)

### Group 12 — Build, validation and review

**Parallelizable: no — depends on every page, the nav and the PDF**

- [x] Task 50. Validate the whole section.
  - [x] Task 50.1. `npm run validate:mermaid` passes for every Mermaid block.
  - [x] Task 50.2. Admonitions and disclaimer:
    * `grep -rn -E '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/web/thymeleaf` returns nothing
    * the disclaimer partial is included on all 42 pages
  - [x] Task 50.3. Run the CLAUDE.md image checks:
    * block/inline macros closed on one line
    * no `<p>image::` in `build/site`
    * the unquoted-comma alt check on the changed `.adoc` files
    * every `thymeleaf-*.svg` referenced and every `image::` target present
  - [x] Task 50.4. Run the CLAUDE.md inline-code substitution check on the built `web/thymeleaf` section; it must print
    nothing (critical for `*{…}`, `~{…}`, `__${…}__`, `${{…}}`, `[[…]]`).
  - [x] Task 50.5. Links, secrets and stray files:
    * no `xref:` to a non-existent page (#263/#264/#258/#261/#241/#239/#240/#116 prose only)
    * no secrets
    * no book text/figures: a 10-word overlap scan against the scratchpad book extracts
    * `git status` shows no `*.pdf` other than `thymeleaf-cheat-sheet.pdf`, no `*.txt` extracts and no scratch files
  - [x] Task 50.6. Every code example has a `Source:` link, every page ends with `== References`, and every ★ page has
    ≥ 1 diagram and a pitfalls table.
  - [x] Task 50.7. Delegate `npx antora antora-playbook.yml` (or the `iru-build-docs` skill) to the `iru-gate-runner`
    agent; it must report 0 errors / 0 warnings. Then spot-check in `build/site`:
    * the rendered nav (Thymeleaf after Vaadin)
    * the cheat-sheet download
    * a Mermaid page and an SVG page
    * the edited back-link pages
- [x] Task 51. Run the security scan. Done: 13 Base64/Hex high-entropy findings (SRI integrity hashes and sample ETags) in new pages, audited by the user as false positives in .secrets.baseline; rescan 0 unaudited.
  - [x] Task 51.1. Delegate `iru-check-security` (detect-secrets) to the `iru-gate-runner` agent. It must scan the new
    **untracked** files too (`git add -N` or an ad-hoc `--all-files` scan, since detect-secrets skips untracked files).
    Resolve any finding before archiving.
