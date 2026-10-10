# Implementation Plan: Guides & References / Web Development — "GWT (Google Web Toolkit)"

## Task summary

Source: GitHub issue #240
Base branch: main

Issue [#240](https://github.com/albertoirurueta/docs/issues/240) adds a **GWT (Google Web Toolkit)** section to Web
Development at `modules/ROOT/pages/web/gwt/`, after the Thymeleaf block. It is a practical, example-driven guide to
building browser applications with GWT 2.13.x (Java-to-JavaScript compiler, widgets, UiBinder, cell widgets, Editors,
GWT-RPC, Activities & Places, security, code splitting, testing, J2CL). It is written from the **official
documentation** (https://www.gwtproject.org/: Developer Guide = **DG**, tutorials = **T**, articles = **A**, reference
pages = **R**, release notes, roadmap, Javadoc 2.13.1, the `gwtproject/gwt` repository) plus the docs of the related
projects (`gwt-maven-plugin`, JsInterop, Elemental2, J2CL, `org.gwtproject.*`, Jakarta Servlet, Jetty, Spring Boot,
HtmlUnit, ecosystem libraries). One requester-provided book, `~/Desktop/libros/gwt/Manning - GWT in Action.pdf`
(Hanson & Tacy, Manning, 2007, 1st edition, ISBN 1-933988-23-1, GWT 1.3/1.4) is a consulted reference for concept
coverage, narrative and the bibliography only.

The section ships:

* 46 files: `index.adoc` (with `== Bibliography`), 44 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/gwt-cheat-sheet.pdf` ("GWT Cheat Sheet")
* the partial `modules/ROOT/partials/gwt-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/gwt-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc` (GWT block after the Thymeleaf block), `web/index.adoc`
  bullet/description/keywords, root `index.adoc` description/keywords
* about 10 back-links, including replacing the stale "GWT (#240) planned" mentions

The issue body is the binding spec: its "Page outline", "Official documentation → page coverage", "New nav
placement", "Cheat sheet", "Bibliography" and "Acceptance criteria" sections, and the book concept table ("Covered on"
column). Every page task must re-read its page's bullets (`gh issue view 240`) and cover **every** bullet, plus every
book-table row and every official-coverage row that maps to it.

**Out of scope:** re-documenting existing material (Java, Spring Boot, Vaadin, Thymeleaf, JSF, Docker, Kubernetes,
accessibility and CORS theory: link instead). #263/#264/#258/#241/#116 appear in prose only. #239 (JSF) is merged and
may be `xref:`ed. #241 is not merged: prose only.

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into 4 PRs. As with #238/#239, this run implements
   everything on `feature/240` and opens a single draft PR to `main` with `Closes #240`.
2. **Tasks are untagged; no language/framework key applies.** The installed keys are `java`, `java-springboot`,
   `dotnet` and `database`. They implement code with tests and quality gates, while this repository holds only
   AsciiDoc / Mermaid / SVG / PDF, so tasks are implemented directly. The Java/XML in the pages is illustrative
   content, but every example is compiled and run in a scratch GWT app (Task 2.6).
3. **The book appears only in `== Bibliography`** and in prose notes on outdated material. No text, listing, figure
   or sample project is copied. The PDF is never staged. The extracted text is in the session scratchpad
   (`gwtbook/book.txt`) and stays there. The 2013 second edition is mentioned as "further reading" only if its
   Manning page still resolves (verified 200 on 2026-10-08), and is stated as not consulted.
4. **Disclaimer:** `partials/gwt-disclaimer.adoc` is a single `[IMPORTANT]` block (AI-assistance disclosure plus
   `xref:web/gwt/index.adoc#_bibliography[…]`), identical in shape to `thymeleaf-disclaimer.adoc`. No other
   admonition is allowed in the section. Deprecations, CVEs, version changes and "the book is outdated" remarks are
   prose or table rows.
5. **Version baseline is re-verified at implementation time and dated** (Group 1). The issue's numbers were checked
   on 2026-10-08 (GWT 2.13.1, `gwt-maven-plugin` 1.3.0, Java 11+ tooling, source levels 8–17); the next minor may
   require Java 17+.
6. **Running scenario is the original *Bookshelf*** (books, authors, reviews, loans) as a three-module GWT 2.13
   application (`bookshelf-shared`, `bookshelf-client`, `bookshelf-server`) generated from the `modular-webapp`
   archetype, with a Jetty/servlet backend and a Spring Boot variant. Pages build on each other.
7. **The examples use Maven** with the `org.gwtproject:gwt` BOM (no hard-coded versions on individual GWT artifacts).
   Gradle is mentioned only after its status is verified.
8. **Existing pages get real `xref:`s; pages that don't exist yet stay plain prose.** Every `xref:` target outside
   the section is verified with `ls` before it is written. `index.adoc` and `cheat-sheet.adoc` are written last, and
   the back-links come after the new pages exist.
9. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `gwt-*.svg`. SVGs are original drawings (no GWT
   logo, docs images or book figures).
10. **Stale official pages are cross-checked against the source and release notes** (default `-sourceLevel`,
    classic Dev Mode plugin, `webAppCreator`, IE references) and the discrepancy is stated in prose.
11. **Mermaid generics:** `AsyncCallback<T>`-style text and class-diagram stereotypes are written as entities
    (`&lt;`) per CLAUDE.md.

### Lessons from the earlier section reviews (#198, #199, #230, #237, #238, #239, #253, #257): mandatory for every page task

* **Verify every name against its official page before writing it.** This covers every class, annotation, module-XML
  element, compiler flag, configuration property, Maven coordinate and version. If the docs don't confirm a detail,
  describe the behaviour without naming it. Items the research flagged "from knowledge" (e.g. `-failOnError` alias
  `-strict`, `@JsIgnore`/`@JsNullable`/`@JsOptional`, `<collapse-all-properties/>`, `CssResource.obfuscationPrefix`,
  `jre.checks.*`, RequestFactory "maintenance mode") must be checked against the Javadoc, source or release notes.
* **Security is correctness:**
  * no hardcoded secrets; credentials are placeholders
  * `setText`/`SafeHtml` for user data, never `setHTML` with concatenated input
  * XSRF protection on RPC and state-changing endpoints
  * all authorisation checks server-side
  * never reproduce the issue's errata list
* **Every concept gets at least one code example**, each followed by a `Source:` link, and that URL goes in
  `== References`. Show the rendered DOM/HTML or generated output where it helps.
* **Run the examples** in the Group 1 scratch app (compile with the GWT compiler, run Super Dev Mode and the tests
  where the example is runnable).
* **URL hygiene:** use canonical gwtproject.org / github.com / docs.spring.io URLs with real `#anchor` ids. Note that
  `https://www.gwtproject.org/articles.html` is a 404; the index is `articles/articles.html`.
* **Cross-links must be accurate:** never `xref:` to a page that doesn't exist; no `xref:` inside backticks; no empty
  link text on a fragment xref.
* **AsciiDoc hygiene (critical for GWT syntax):**
  * Any inline code containing `->`, `=>`, `...`, `__`, `*`, `~`, `^`, `'`, `{` or `#[` (JSNI `/*-{ … }-*/`,
    `@pkg.Class::method(…)`, `$wnd`, varargs, GSS `@def`) uses a constrained passthrough; code containing `+` uses
    `pass:c[…]`.
  * Run the CLAUDE.md inline-code substitution grep on `build/site/…/web/gwt`.
  * `{placeholders}` stay literal inside `[source]` blocks and are escaped in prose.
  * Use `.Title` captions, leave no authoring notes in pages, and no prose line may start with `<digits>.`.
  * Image macros stay on one line; alt text containing a comma is quoted.
* **Mermaid:** entities for stereotypes and any `<` followed by a letter; pass `npm run validate:mermaid`.

## Current code state

* **Repo:** the Antora root component (`antora.yml`). Pages live in `modules/ROOT/pages/`, the nav in
  `modules/ROOT/nav.adoc`, partials in `modules/ROOT/partials/`, images in `modules/ROOT/images/` and PDFs in
  `modules/ROOT/attachments/` (90 cheat-sheet PDFs exist). None of these exist yet for GWT: `web/gwt/`,
  `gwt-disclaimer.adoc`, `gwt-*.svg`, `gwt-cheat-sheet.pdf`.
* **`modules/ROOT/nav.adoc`:**
  * The JSF block starts at l.616; the Thymeleaf block starts at l.678 and ends with
    `**** xref:web/thymeleaf/cheat-sheet.adoc[Cheat Sheet (PDF)]` at l.719, followed at l.720 by
    `include::partial$nav-python.adoc[]`. JSP & Struts (#241) is not in the nav.
  * The GWT block goes after the last Java web section's cheat-sheet line and before `nav-python`: re-check the line
    numbers before editing, and if #241 has merged by then, place GWT after it.
* **`web/index.adoc`:** `:description:` on l.2, `:keywords:` on l.3; bullets in nav order (JSF at l.68–73, Thymeleaf
  at l.74–80, Django at l.81).
* **Root `index.adoc`:** `:description:` currently lists web-development examples; GWT is absent from `:keywords:`.
* **Existing GWT mentions (line numbers from the exploration; re-check before editing):**

  | Page | Lines | Action |
  |---|---|---|
  | `web/vaadin/getting-started.adoc` | l.28–29 | link "GWT" to the section |
  | `web/vaadin/element-api-and-web-components.adoc` | l.12 | link "GWT" |
  | `web/vaadin/custom-components.adoc` | l.11 | link "GWT" |
  | `web/thymeleaf/introduction-and-architecture.adoc` | l.501–505 | replace the "GWT (#240) planned" mention with an `xref:` |
  | `web/thymeleaf/index.adoc` | l.278–280 | replace the GWT (#240) mention with an `xref:` |
  | `web/jsf/index.adoc` | l.351 | replace the GWT (#240) mention with an `xref:` |
  | `web/jsf/migrating-to-jakarta-faces.adoc` | l.2232 | update the "GWT … planned issue" sentence |
  | `web/jsf/introduction-and-history.adoc` | l.581–585 (table row), l.600, l.608–612 (prose), l.665 (reference) | link the GWT row and rewrite "Struts and GWT are not documented on this site" so GWT points to the section |
  | `backend/springboot/web-ui-frameworks.adoc` | — | one-line "client-side Java: GWT" pointer |
  | `web/e2e-testing-real-browsers.adoc` | l.10–13 | add a GWT entry to the per-framework list |
* **Templates:** `partials/thymeleaf-disclaimer.adoc`, `web/thymeleaf/cheat-sheet.adoc`,
  `attachments/thymeleaf-cheat-sheet.pdf`, `images/thymeleaf-*.svg`; precedent plans `.archive/implementation_plan_238.md`
  (Thymeleaf) and `.archive/implementation_plan_239.md` (JSF).
* **Stray untracked files** (`modules/ROOT/pages/web/jsf/omni/`, `modules/ROOT/.DS_Store`) are not part of this task:
  never stage them.
* **Research already gathered:**
  * the book extract at the session scratchpad `gwtbook/book.txt` (consultation only, never committed)
  * the issue body (`gh issue view 240`), which embeds the DG TOC mapping, version baseline, outdated-in-book table
    and errata. Anything beyond it is re-fetched in Task 2.
* **Tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (after `npm i --no-save mermaid@11
  jsdom`), the `iru-build-docs` skill; Google Chrome headless for the PDF; `pdfinfo` and PyMuPDF are not installed,
  so check the page count with `pypdf` (`python3 -I`) or `mdls -name kMDItemNumberOfPages`. The GWT tools need
  JDK 11–21 (Task 2.6 checks which JDKs are installed, since the default may be newer).

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, a blank line, then
  `include::partial$gwt-disclaimer.adoc[]`.
* **Lead paragraph:** states the dated version baseline (GWT 2.13.1, `gwt-maven-plugin` 1.3.0, JDK and source level,
  Jakarta Servlet) and whether the page concerns **client** (compiled to JavaScript), **shared**, **server** or
  **build/tooling** code.
* **Content:**
  * what the concept is and why it exists
  * how GWT implements it (compiler pass, deferred-binding rule, generator, linker, runtime class)
  * every relevant class, annotation, module-XML element, property or compiler flag
  * where it runs (compile time, browser, server), effect on code size/permutations, J2CL compatibility or
    `org.gwtproject.*` replacement
  * security implications
  * pitfalls and exact error messages
  * recent changes with versions, and where the book is outdated
* **Examples:**
  * `[source,java]` client/shared/server classes, `[source,xml]` for `*.gwt.xml`, `*.ui.xml`, `pom.xml`, `web.xml`
  * `[source,css]` for CSS/GSS, `[source,html]` host pages, `[source,properties]` for i18n bundles
  * `[source,bash]` for `mvn gwt:codeserver`, `mvn jetty:run`, `mvn package`, `curl` against RPC/JSON endpoints
  * current APIs only: handlers, generics, `@RemoteServiceRelativePath`, `ClientBundle`, layout panels, `Scheduler`,
    JsInterop (JSNI only on the legacy page), `jakarta` servlets
* **Source links:** each example is followed by
  `Source: https://www.gwtproject.org/doc/latest/<Page>.html#<anchor>[GWT -- <page>: <section>]`.
* **Page ending:** `== References`, listing only official docs (and the Manning page where the book is used).
* **★ pages** (the ones the issue marks) additionally need at least one diagram, a worked *Bookshelf* example and a
  pitfalls table.

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/gwt-disclaimer.adoc`.
  - [x] Task 1.1. Copy the shape of `partials/thymeleaf-disclaimer.adoc`: a single `[IMPORTANT]` block with only the
    AI-assistance disclosure ("This content was generated with the assistance of AI and should be verified against the
    official documentation before being relied on in production") plus
    `xref:web/gwt/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear anywhere under `web/gwt/`.
  - Note: `modules/ROOT/partials/gwt-disclaimer.adoc` created (identical in shape to `thymeleaf-disclaimer.adoc`); nothing exists under `web/gwt/` yet, so the no-other-admonition rule is trivially met and is re-checked in Task 54.2.
- [x] Task 2. Verify and record the version baseline (scratchpad `240/versions-240.md`) that every later task cites.
  - [x] Task 2.1. Re-check Maven Central metadata for `org.gwtproject:gwt` (BOM), `gwt-user`, `gwt-dev`,
    `gwt-codeserver`, `gwt-servlet`, `gwt-servlet-jakarta`, `requestfactory-*`, `net.ltgt.gwt.maven:gwt-maven-plugin`,
    `net.ltgt.gwt.archetypes:modular-webapp`, `com.google.elemental2:elemental2-dom`, `org.dominokit:domino-ui`,
    `com.google.dagger:dagger-gwt` and the GWT GitHub releases/milestones. Record the numbers dated; don't copy them
    from the issue.
  - [x] Task 2.2. Re-verify the version-tagged claims in the issue ("Version baseline", "Outdated in the book", "New
    since the book") against the release notes, `UserAgent.gwt.xml`, `SourceLevel.java`, `Resources.gwt.xml`,
    `DevMode.java` and the roadmap. Record deviations for `whats-changed-and-migration.adoc` (including the stale
    DG statements and the "from knowledge" items).
  - [x] Task 2.3. Re-fetch the Developer Guide TOC, the tutorial index and the articles index
    (`articles/articles.html`) and diff them against the issue's "Official documentation → page coverage" table (new
    or removed pages, anchor changes). Add anything new to the matching page task.
  - [x] Task 2.4. Run `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}'` on every URL in the issue's
    Bibliography and Context table. Record the canonical forms and any 404s (e.g. J2CL README, Gitter, Sencha GXT).
  - [x] Task 2.5. Re-verify the CVE list (NVD / GitHub Advisory Database: CVE-2013-4204, CVE-2012-5920,
    CVE-2012-4563, CVE-2007-2378, CVE-2007-6452) with affected and fixed versions.
  - [x] Task 2.6. Create a throwaway scratch **GWT 2.13 *Bookshelf*** app in the scratchpad (`240/app`, via
    `mvn archetype:generate` with `net.ltgt.gwt.archetypes:modular-webapp`). Never commit it. First check which JDKs
    are installed (`/usr/libexec/java_home -V`) and use one the tools support (11–21). It needs:
    * the client/shared/server modules, the host page and `web.xml`
    * a UiBinder shell, a `DataGrid`, Activities & Places, an Editor form, English/Spanish i18n, a `ClientBundle` with
      GSS, a JsInterop binding, `GWT.runAsync`, a GWT-RPC `CatalogService` with XSRF protection and a REST endpoint
    * `GWTTestCase` (HtmlUnit) and plain-JUnit presenter tests

    Every example is compiled and run there (`mvn gwt:codeserver`, `mvn jetty:run`, `mvn verify`, `curl`) before being
    pasted.
  - [x] Task 2.7. Check the book PDF is only consulted and never staged. `git status` must never list a file from
    `~/Desktop/libros/gwt/` or any `*.txt` extract.
  - Note (Group 1 result): baseline recorded in the scratchpad `240/versions-240.md` (versions dated 2026-10-08, deviations, TOC diff = no change, URL checks with 6 corrected/404 URLs, CVE table, 12 reproduced pitfalls with exact messages). Scratch Bookshelf app in `240/app` builds and passes 9 tests (JDK 21, also JDK 26). Key facts for later pages: RequestFactory artifacts are `org.gwtproject.web.bindery:*`; Jakarta servlets are `com.google.gwt.user.server.rpc.jakarta.*`; GWT-RPC cannot serialise exceptions on Java 17+ without `--add-opens java.base/java.lang=ALL-UNNAMED` (gwtproject/gwt#9793); `-sourceLevel` help text says 1.8 but the default is the running JDK's level; `gwt:test` needs explicit `<includes>`; English plural forms need an `AppMessages_en.properties`; `-pl '*-client'` does not work on Maven 3.9; RequestFactory "maintenance mode" is NOT confirmed by any official source.

### Group 2 — Foundations pages

**Parallelizable: yes (seven independent pages; `index.adoc` is written in Group 13)**

- [x] Task 3. Create `introduction-and-architecture.adoc` ("Introduction & Architecture") ★.
  - [x] Task 3.1. Header and lead paragraph per "Conventions".
  - [x] Task 3.2. Cover every outline bullet: what GWT is (a compiler plus a toolkit, not a server-side UI
    framework); permutations, deferred binding, dead-code elimination, JRE emulation, shared code; client/shared/server
    split; history 2006 → 2.13 and governance; Vaadin relationship (xref Vaadin getting-started); the comparison table
    (GWT vs J2CL, Vaadin Flow, JSF, Thymeleaf, JSP/Struts, Angular, React, Vue; xrefs only to existing pages, #241 and
    #263 in prose; each row verified on its official site); when GWT is and is not a sensible choice.

    Book rows: chapter 1.
  - [x] Task 3.3. Figures: SVG `gwt-compile-pipeline.svg`; Mermaid timeline of the version history.
  - [x] Task 3.4. Examples verified, `Source:` links, recent changes, book-outdated notes, pitfalls table,
    `== References`.
- [x] Task 4. Create `getting-started.adoc` ("Getting Started") ★.
  - [x] Task 4.1. Header and lead paragraph per "Conventions".
  - [x] Task 4.2. Cover every outline bullet: prerequisites; generating a project from the `modular-webapp` archetype;
    the generated modules, module XML, host page and `EntryPoint`; the dev loop (`mvn gwt:codeserver -pl *-client -am`
    plus `mvn jetty:run -pl *-server -am -Denv=dev`, `mvn package`); a first *Bookshelf* screen; the official samples
    and the StockWatcher tutorial; the full *Bookshelf* project structure.

    Book rows: chapters 1–3 (creating, running, `EntryPoint`, `RootPanel`, menus).
  - [x] Task 4.3. Figures: Mermaid edit → recompile → refresh loop.
  - [x] Task 4.4. Examples run in the scratch app, `Source:` links, pitfalls table, `== References`.
- [x] Task 5. Create `project-structure-and-modules.adoc` ("Project Structure & Modules") ★.
  - [x] Task 5.1. Header and lead paragraph.
  - [x] Task 5.2. Cover every outline bullet: every module-XML element (`<module rename-to>`, `<inherits>`,
    `<entry-point>`, `<source>`, `<public>`, `<super-source>`, `<stylesheet>`, `<script>`, `<servlet>`, `<set-property>`,
    `<set-configuration-property>`, `<add-linker>`, collapse elements); module inheritance and the standard modules;
    client/shared/server package conventions; the host page, `nocache.js`, `gwt:property` meta tags,
    `RootPanel` vs `RootLayoutPanel`; packaging reusable libraries (sources in the JAR, `gwt-lib`); pitfalls ("No
    source code is available for type …", missing `<inherits>`).

    Book rows: chapters 2 and 9.
  - [x] Task 5.3. Examples run, `Source:` links, pitfalls table, `== References`.
- [x] Task 6. Create `build-tools-maven-and-gradle.adoc` ("Build Tools: Maven & Gradle").
  - [x] Task 6.1. Header and lead paragraph.
  - [x] Task 6.2. Cover every outline bullet: `gwt-maven-plugin` packagings and **every** goal and key parameter; the
    BOM and artifacts; multi-module builds and CI profiles; the legacy Codehaus plugin and migration from it; Gradle
    options (verify status first); `webAppCreator`/`i18nCreator` (deprecated) and the book's creator tools as history.

    Book rows: chapters 2 and 9 (packaging modules as JARs).
  - [x] Task 6.3. Examples run, `Source:` links, `== References`.
- [x] Task 7. Create `compiler-and-compilation.adoc` ("Compiler & Compilation") ★.
  - [x] Task 7.1. Header and lead paragraph.
  - [x] Task 7.2. Cover every outline bullet: `com.google.gwt.dev.Compiler` and every documented flag (`-style`,
    `-optimize`, `-draftCompile`, `-sourceLevel`, `-setProperty`, `-checkAssertions`, `-failOnError`, `-validateOnly`,
    `-localWorkers`, `-incremental`, `-war`/`-deploy`/`-extra`/`-gen`/`-workDir`, `-saveSource`, `-compileReport`,
    `-logLevel`, JsInterop export flags, `-X…`, `jre.checks.checkLevel`); permutations and how to reduce them; the
    output directory; the stale DG default-source-level statement.

    Book rows: chapters 1, 3 and 17 (compilation, permutations, output files).
  - [x] Task 7.3. Figures: SVG `gwt-permutations.svg`.
  - [x] Task 7.4. Examples run (compile and inspect the output), `Source:` links, pitfalls table, `== References`.
- [x] Task 8. Create `development-mode-and-debugging.adoc` ("Development Mode & Debugging") ★.
  - [x] Task 8.1. Header and lead paragraph.
  - [x] Task 8.2. Cover every outline bullet: Super Dev Mode (`CodeServer`, `-port 9876`, `-src`, `-launcherDir`,
    incremental compiles, bookmarklets); source-map debugging in devtools and the IDE; `DevMode` today (`-noserver`,
    `-startupUrl`, the 2.13 static-file-only server); classic Dev Mode and its plugins as history only; the code
    server's security caveat; troubleshooting.

    Book rows: chapters 3 and 17 (hosted mode as outdated).
  - [x] Task 8.3. Figures: none required; add a Mermaid sequence of the SDM recompile if it helps.
  - [x] Task 8.4. Examples run, `Source:` links, pitfalls table, `== References`.
- [x] Task 9. Create `jre-emulation-and-shared-code.adoc` ("JRE Emulation & Shared Code").
  - [x] Task 9.1. Header and lead paragraph.
  - [x] Task 9.2. Cover every outline bullet: what the emulation library provides and what is missing; supported Java
    levels and language features per GWT version; `long`/`double`/overflow/`String`/regex semantics (2.13 changes);
    writing shared code; `super-source`; the `GWT` class API.

    Book rows: chapter 17 (JRE emulation) and the Java 1.4 restriction (outdated).
  - [x] Task 9.3. Examples run, `Source:` links, `== References`.
  - Note (Group 2 result): 7 pages created under `web/gwt/` plus `gwt-compile-pipeline.svg` and `gwt-permutations.svg`; mermaid validation passes. Correction to versions-240 deviation 1: the CLI `Compiler` default `-sourceLevel` really is 1.8 (ToolBase default arg); Java 12-17 features need explicit `-sourceLevel 17`; `auto` resolves to the JVM level. Also: `<script>` fails with the default xsiframe linker unless `xsiframe.failIfScriptTag=FALSE`.

### Group 3 — Java and JavaScript pages

**Parallelizable: yes (five independent pages)**

- [x] Task 10. Create `jsinterop.adoc` ("JsInterop") ★.
  - [x] Task 10.1. Header and lead paragraph.
  - [x] Task 10.2. Cover every outline bullet: `@JsType`, `@JsMethod`, `@JsProperty`, `@JsConstructor`,
    `@JsFunction`, `@JsOverlay`, `@JsPackage.GLOBAL` and (once verified) `@JsIgnore`, `@JsNullable`, `@JsOptional`;
    calling JavaScript from Java and exporting Java to JavaScript (`-generateJsInteropExports`); `jsinterop-base`;
    Promises and callbacks; the *Bookshelf* chart-library binding; J2CL compatibility; the Polymer tutorial as a
    historical note.
  - [x] Task 10.3. Examples run, `Source:` links, pitfalls table, diagram (Mermaid of Java ↔ JavaScript calls),
    `== References`.
- [x] Task 11. Create `jsni-and-overlay-types.adoc` ("JSNI & Overlay Types") (legacy).
  - [x] Task 11.1. Header and lead paragraph (state it is legacy).
  - [x] Task 11.2. Cover every outline bullet: JSNI syntax, `$wnd`/`$doc`, Java ↔ JavaScript calls, type mapping,
    exceptions; `JavaScriptObject` overlays and their rules; a side-by-side migration table to JsInterop.

    Book rows: chapter 8 (JSNI components, `JavaScriptObject`, wrapping libraries, exposing an API).
  - [x] Task 11.3. Passthrough for every JSNI snippet (`/*-{ }-*/`, `@pkg.Class::method`), `Source:` links,
    `== References`.
- [x] Task 12. Create `dom-and-elemental2.adoc` ("DOM & Elemental2").
  - [x] Task 12.1. Header and lead paragraph.
  - [x] Task 12.2. Cover every outline bullet: `com.google.gwt.dom.client`, `DOM` and `Event`; Elemental2 modules via
    JsInterop (`fetch`, `JSON`, `URL`, `WebSocket`); Elemental (1) deprecation; memory leaks and handler lifecycles.
  - [x] Task 12.3. Examples run, `Source:` links, `== References`.
- [x] Task 13. Create `deferred-binding-and-generators.adoc` ("Deferred Binding & Generators") ★.
  - [x] Task 13.1. Header and lead paragraph.
  - [x] Task 13.2. Cover every outline bullet: `GWT.create()` and the rebind process; `<replace-with>` and
    `<generate-with>` with every condition; properties (`<define-property>`, `<extend-property>`, `<set-property>`,
    `<property-provider>`, fallback values, configuration properties; `user.agent` and `locale`); writing a generator
    and why generators are discouraged; pitfalls.

    Book rows: chapters 9, 14 and 15.
  - [x] Task 13.3. Figures: Mermaid of the rebind decision flow.
  - [x] Task 13.4. Examples run, `Source:` links, pitfalls table, `== References`.
- [x] Task 14. Create `delayed-logic-and-scheduler.adoc` ("Delayed Logic & Scheduler").
  - [x] Task 14.1. Header and lead paragraph.
  - [x] Task 14.2. Cover every outline bullet: `Timer`; every `Scheduler` method and `RepeatingCommand`; breaking up
    long work and polling; deprecated `DeferredCommand`/`IncrementalCommand`.

    Book rows: chapters 8 (deferred commands) and 11 (polling).
  - [x] Task 14.3. Examples run, `Source:` links, `== References`.

### Group 4 — User-interface pages, part 1

**Parallelizable: yes (seven independent pages)**

- [x] Task 15. Create `widgets.adoc` ("Widgets") ★.
  - [x] Task 15.1. Header and lead paragraph.
  - [x] Task 15.2. Cover every outline bullet: the widget model and attach/detach; the gallery grouped by purpose
    (text, buttons, text input and value boxes, choices, navigation, images, `FileUpload`, `Hidden`, `FormPanel`);
    `HasValue`/`TakesValue`; style hooks; mobile/touch notes (A GWT and iPhone, historical).

    Book rows: chapters 4 and 12 (forms, `FormPanel`, `NamedFrame`).
  - [x] Task 15.3. Figures: SVG or Mermaid of the widget hierarchy. Worked example, pitfalls table, `Source:` links,
    `== References`.
- [x] Task 16. Create `panels-and-layout.adoc` ("Panels & Layout") ★.
  - [x] Task 16.1. Header and lead paragraph.
  - [x] Task 16.2. Cover every outline bullet: basic panels; layout panels (`RootLayoutPanel`, `LayoutPanel`,
    `DockLayoutPanel`, `SplitLayoutPanel`, `TabLayoutPanel`, `StackLayoutPanel`, `DeckLayoutPanel`),
    `ProvidesResize`/`RequiresResize`, animation; standards mode, CSS vs table layout; the *Bookshelf* shell.

    Book rows: chapter 5.
  - [x] Task 16.3. Figures: SVG `gwt-dock-layout-shell.svg`. Worked example, pitfalls table, `Source:` links,
    `== References`.
- [x] Task 17. Create `events-and-handlers.adoc` ("Events & Handlers") ★.
  - [x] Task 17.1. Header and lead paragraph.
  - [x] Task 17.2. Cover every outline bullet: DOM handlers and `HandlerRegistration`; `sinkEvents`/`onBrowserEvent`
    and `Event.addNativePreviewHandler`; window events; custom events and `EventBus` (`ResettableEventBus`);
    migrating from listeners.

    Book rows: chapter 6 (event model, listeners → handlers, drag and drop).
  - [x] Task 17.3. Figures: Mermaid sequence of a DOM event and an event-bus event. Worked example, pitfalls table,
    `Source:` links, `== References`.
- [x] Task 18. Create `custom-widgets-and-composites.adoc` ("Custom Widgets & Composites").
  - [x] Task 18.1. Header and lead paragraph.
  - [x] Task 18.2. Cover every outline bullet: `Composite`/`initWidget` and interfaces to implement; widgets from DOM
    elements and the attach/detach callbacks; the *Bookshelf* rating widget and author chips.

    Book rows: chapters 4, 5 and 7 (new widgets by extension, composites of composites).
  - [x] Task 18.3. Examples run, `Source:` links, `== References`.
- [x] Task 19. Create `uibinder.adoc` ("UiBinder") ★.
  - [x] Task 19.1. Header and lead paragraph.
  - [x] Task 19.2. Cover every outline bullet: `*.ui.xml` and `UiBinder<U, O>`; `@UiField` (`provided`),
    `@UiHandler`, `@UiFactory`, `@UiConstructor`, `@UiChild`, `@UiTemplate`; `HTMLPanel`; `ui:style`, `ui:with`,
    `ui:image`, `ui:data`; `@UiRenderer`; i18n with `ui:msg`/`ui:ph`; pitfalls.
  - [x] Task 19.3. Figures: SVG `gwt-uibinder-pair.svg`. Worked example, pitfalls table, `Source:` links,
    `== References`.
- [x] Task 20. Create `cell-widgets.adoc` ("Cell Widgets") ★.
  - [x] Task 20.1. Header and lead paragraph.
  - [x] Task 20.2. Cover every outline bullet: the cell architecture and built-in cells; `CellTable`, `DataGrid`,
    `CellList`, `CellTree`, `CellBrowser`, columns, headers, sorting; `ListDataProvider`, `AsyncDataProvider`,
    `Range`, pagers; selection models and `ProvidesKey`; custom cells and `SafeHtmlTemplates`; `@UiRenderer`; the
    *Bookshelf* catalogue with server-side paging.
  - [x] Task 20.3. Figures: Mermaid sequence of `AsyncDataProvider` → RPC → `updateRowData`. Worked example,
    pitfalls table, `Source:` links, `== References`.
- [x] Task 21. Create `editors.adoc` ("Editors").
  - [x] Task 21.1. Header and lead paragraph.
  - [x] Task 21.2. Cover every outline bullet: `Editor<T>`, `IsEditor`, `LeafValueEditor`, `ValueAwareEditor`,
    `HasEditorErrors`, `@Path`, `@Ignore`; `SimpleBeanEditorDriver`, `ListEditor`; validation and RequestFactory
    integration; the *Bookshelf* book form.
  - [x] Task 21.3. Examples run, `Source:` links, `== References`.
  - Note (Group 4 result): 7 pages created under `web/gwt/` (widgets, panels-and-layout, events-and-handlers, custom-widgets-and-composites, uibinder, cell-widgets, editors; 9823 lines) plus `gwt-widget-hierarchy.svg`, `gwt-dock-layout-shell.svg`, `gwt-uibinder-pair.svg`; mermaid validation passes; sibling mentions are plain prose for the Group 12 audit.

### Group 5 — User-interface pages, part 2

**Parallelizable: yes (five independent pages)**

- [x] Task 22. Create `styling-css-and-gss.adoc` ("Styling: CSS & GSS") ★.
  - [x] Task 22.1. Header and lead paragraph.
  - [x] Task 22.2. Cover every outline bullet: style names and the default themes; `CssResource` directives
    (`@def`, `@eval`, `@sprite`, `@url`, `@if`, `@external`, `@noflip`, `@Shared`, `@Import`); **GSS** and its
    properties (`enableGss`, `conversionMode`, `gssDefaultInUiBinder`) and migration (A GSS migration); scoped
    styles in UiBinder; RTL; xrefs to the HTML & CSS and Sass sections.

    Book rows: chapter 3 (CSS styling).
  - [x] Task 22.3. Passthroughs for directives, worked example, pitfalls table, diagram, `Source:` links,
    `== References`.
- [x] Task 23. Create `client-bundle-and-images.adoc` ("ClientBundle & Images") ★.
  - [x] Task 23.1. Header and lead paragraph.
  - [x] Task 23.2. Cover every outline bullet: every resource type; `@Source` and `@ImageOptions`; locale/user-agent
    specific resources and caching; migrating from `ImageBundle`.

    Book rows: chapter 4 (`ImageBundle`).
  - [x] Task 23.3. Worked example, pitfalls table, diagram, `Source:` links, `== References`.
- [x] Task 24. Create `html5-features.adoc` ("HTML5 Features").
  - [x] Task 24.1. Header and lead paragraph.
  - [x] Task 24.2. Cover every outline bullet: `Storage`/`StorageMap`, `Canvas`, `Audio`/`Video`, typed arrays,
    geolocation, feature detection; when to use Elemental2.
  - [x] Task 24.3. Examples run, `Source:` links, `== References`.
- [x] Task 25. Create `accessibility-and-aria.adoc` ("Accessibility & ARIA").
  - [x] Task 25.1. Header and lead paragraph.
  - [x] Task 25.2. Cover every outline bullet: `com.google.gwt.aria.client.Roles` and states/properties; focus and
    keyboard navigation; the deprecated `Accessibility` class; xref `web/accessibility.adoc`.
  - [x] Task 25.3. Examples run, `Source:` links, `== References`.
- [x] Task 26. Create `internationalization.adoc` ("Internationalization") ★.
  - [x] Task 26.1. Header and lead paragraph.
  - [x] Task 26.2. Cover every outline bullet: `Constants`, `ConstantsWithLookup`, `Messages` and every annotation;
    `Dictionary`; `Localizable`; the `locale` property and its configuration properties; `NumberFormat`,
    `DateTimeFormat`, `CurrencyData`; bidi; `i18nCreator` and file encoding; English/Spanish *Bookshelf* with
    plural review counts; "same idea in other stacks" links to existing i18n pages.

    Book rows: chapters 3 and 15.
  - [x] Task 26.3. Diagram, worked example, pitfalls table, `Source:` links, `== References`.
  - Note (Group 5 result): 5 pages created under `web/gwt/` (styling-css-and-gss, client-bundle-and-images, html5-features, accessibility-and-aria, internationalization; 6383 lines); no new SVGs (Mermaid diagrams only); mermaid validation passes; Antora build shows only the expected missing `index.adoc#_bibliography` xrefs. Fixed Group 4 inline-code/attribute glitches in widgets.adoc and uibinder.adoc; removed an empty stray `idgets.adoc`.

### Group 6 — Application architecture pages

**Parallelizable: yes (four independent pages)**

- [x] Task 27. Create `history-and-navigation.adoc` ("History & Navigation").
  - [x] Task 27.1. Header and lead paragraph.
  - [x] Task 27.2. Cover every outline bullet: `History.newItem`, `addValueChangeHandler`,
    `fireCurrentHistoryState`, tokens and `Hyperlink`; bookmarkable state; `pushState` (community modules, verified);
    how Places build on History.

    Book rows: chapters 1 and 17 (history frame).
  - [x] Task 27.3. Examples run, `Source:` links, `== References`.
- [x] Task 28. Create `mvp-activities-and-places.adoc` ("MVP, Activities & Places") ★.
  - [x] Task 28.1. Header and lead paragraph.
  - [x] Task 28.2. Cover every outline bullet: MVP in GWT (A MVP architecture parts 1–2); `Place`,
    `PlaceTokenizer`, `PlaceHistoryMapper`, `PlaceController`, `PlaceHistoryHandler`; `Activity`/`AbstractActivity`,
    `ActivityMapper`, `ActivityManager`; `EventBus`/`SimpleEventBus`, `ClientFactory`, Dagger or GIN; the *Bookshelf*
    catalogue/detail/edit flow; Nalu as a modern alternative (link).
  - [x] Task 28.3. Figures: Mermaid sequence of place change → activity start → view update. Worked example, pitfalls
    table, `Source:` links, `== References`.
- [x] Task 29. Create `validation.adoc` ("Validation").
  - [x] Task 29.1. Header and lead paragraph.
  - [x] Task 29.2. Cover every outline bullet: JSR-303 on the client (`AbstractGwtValidatorFactory`,
    `@GwtValidation`), shared constraints with server-side Jakarta Validation, `gwt.validation.ignoreXml` (2.13),
    Editors integration.
  - [x] Task 29.3. Examples run, `Source:` links, `== References`.
- [x] Task 30. Create `logging.adoc` ("Logging").
  - [x] Task 30.1. Header and lead paragraph.
  - [x] Task 30.2. Cover every outline bullet: `java.util.logging` emulation, module inheritance, `gwt.logging.*`
    properties and handlers, remote logging and stack-trace deobfuscation, compiling logging out of production.

    Book rows: chapter 3 (`GWT.log`, server logging).
  - [x] Task 30.3. Examples run, `Source:` links, `== References`.

  - Note (Group 6 result): 4 pages created under `web/gwt/` (history-and-navigation 871, mvp-activities-and-places 1545, validation 853, logging 1124 lines); no new SVGs (Mermaid only); validate:mermaid passes (1558 diagrams), Antora build shows only the expected missing `index.adoc#_bibliography` xrefs, CLAUDE.md greps clean. Sibling mentions of rpc/testing/code-splitting are plain prose for the Group 12 audit.

### Group 7 — Client–server communication pages

**Parallelizable: yes (six independent pages)**

- [x] Task 31. Create `client-server-communication-overview.adoc` ("Client–Server Communication").
  - [x] Task 31.1. Header and lead paragraph.
  - [x] Task 31.2. Cover every outline bullet: the options and a decision table; asynchronous programming; the
    same-origin policy and CORS (xref `web/cors.adoc`); #264 in prose.
  - [x] Task 31.3. Figures: Mermaid flowchart for choosing a style. `Source:` links, `== References`.
- [x] Task 32. Create `gwt-rpc.adoc` ("GWT-RPC") ★.
  - [x] Task 32.1. Header and lead paragraph.
  - [x] Task 32.2. Cover every outline bullet: `RemoteService`, `@RemoteServiceRelativePath`, `Async` interface,
    `AsyncCallback`, `RemoteServiceServlet` (javax and jakarta); serialisable types, policy files, custom field
    serialisers, every exception; `RpcRequestBuilder`, `ServiceDefTarget`; the 2.10.1/2.11 JPA/JDO change and DTOs
    (A Using GWT with Hibernate); the *Bookshelf* `CatalogService`.

    Book rows: chapters 10 and 11 (facade, callback chaining, emulated push as outdated).
  - [x] Task 32.3. Figures: Mermaid sequence of an RPC call. Worked example, pitfalls table, `Source:` links,
    `== References`.
- [x] Task 33. Create `requestbuilder-json-and-xml.adoc` ("RequestBuilder, JSON & XML") ★.
  - [x] Task 33.1. Header and lead paragraph.
  - [x] Task 33.2. Cover every outline bullet: `RequestBuilder`; JSON (`JsonUtils.safeEval`,
    `JSONParser.parseStrict`, overlays, JsInterop DTOs, `AutoBeanCodex`); JSONP and its trade-offs; `XMLParser`;
    server-push alternatives (#264 in prose); T JSON, T Xsite, T JSONphp and A JSON mash-ups.

    Book rows: chapters 12 and 13.
  - [x] Task 33.3. Diagram, worked example, pitfalls table, `Source:` links, `== References`.
- [x] Task 34. Create `rest-and-json-libraries.adoc` ("REST & JSON Libraries").
  - [x] Task 34.1. Header and lead paragraph.
  - [x] Task 34.2. Cover every outline bullet: Elemental2 `fetch`; `domino-rest` + `domino-jackson`, RestyGWT,
    AutoREST, gwt-jackson (status of each verified in Task 2); a Spring Boot REST backend (xref
    `backend/springboot/rest-apis.adoc`).

    Book rows: chapter 13 (proxying third-party JSON).
  - [x] Task 34.3. Examples run, `Source:` links, `== References`.
- [x] Task 35. Create `requestfactory-and-autobeans.adoc` ("RequestFactory & AutoBeans").
  - [x] Task 35.1. Header and lead paragraph.
  - [x] Task 35.2. Cover every outline bullet: `RequestFactory`, `RequestContext`, `EntityProxy`, `ValueProxy`,
    `@ProxyFor`, `@Service`, `Locator`, `ServiceLocator`, `RequestFactoryServlet` (javax/jakarta),
    `requestfactory-apt`; AutoBeans; its maintenance status (state only what is verified) and when not to start new
    code with it.
  - [x] Task 35.3. Examples run, `Source:` links, `== References`.
- [x] Task 36. Create `server-integration-and-deployment.adoc` ("Server Integration & Deployment") ★.
  - [x] Task 36.1. Header and lead paragraph.
  - [x] Task 36.2. Cover every outline bullet: what is deployed; Jetty/Tomcat WAR and **Spring Boot** serving; dynamic
    host pages (initial data and CSRF tokens); CDN/static hosting, caching rules (never cache `*.nocache.js`),
    compression; Docker packaging (xref the Docker/Kubernetes/cloud pages); the App Engine tutorial as a historical
    note; server-side file upload (safe naming, limits).

    Book rows: chapters 12 (upload servlet) and 16 (deployment, `web.xml`, `gwt-servlet`).
  - [x] Task 36.3. Figures: SVG `gwt-deployed-layout.svg`. Worked example, pitfalls table, `Source:` links,
    `== References`.
  - Note (Group 7 result): 6 pages created under `web/gwt/` (client-server-communication-overview 908, gwt-rpc 2108, requestbuilder-json-and-xml 1384, rest-and-json-libraries 1467, requestfactory-and-autobeans 1108, server-integration-and-deployment 1567 lines) plus `gwt-deployed-layout.svg`; validate:mermaid passes (1568 diagrams); CLAUDE.md greps clean; sibling mentions (rpc, xsrf, safehtml, testing, linkers, ecosystem, between Group 7 pages) are plain prose for the Group 12 audit.

### Group 8 — Security pages

**Parallelizable: yes (two independent pages)**

- [x] Task 37. Create `safehtml-and-xss.adoc` ("SafeHtml & XSS") ★.
  - [x] Task 37.1. Header and lead paragraph.
  - [x] Task 37.2. Cover every outline bullet: XSS vectors in GWT apps; `SafeHtml`, `SafeHtmlBuilder`,
    `SafeHtmlUtils`, `SafeHtmlTemplates`, `SafeStyles`, `SafeUri`/`UriUtils.sanitizeUri`, `HasSafeHtml`, safe cells;
    sanitising user HTML; CSP with GWT (nonces, `xsiframe`, 2.12.0 fixes); the book's errata on unescaped HTML and
    unvalidated URLs; CVE-2012-4563, CVE-2012-5920, CVE-2013-4204 with affected and fixed versions (xref
    `web/thymeleaf/template-security-and-xss.adoc` for the general theory).
  - [x] Task 37.3. Diagram, worked example, pitfalls table, `Source:` links, `== References`.
- [x] Task 38. Create `xsrf-rpc-and-server-security.adoc` ("XSRF, RPC & Server Security") ★.
  - [x] Task 38.1. Header and lead paragraph.
  - [x] Task 38.2. Cover every outline bullet: the GWT-RPC XSRF classes and annotations; XSRF for
    `RequestBuilder`/REST (Spring Security CSRF tokens); JSON hijacking (CVE-2007-2378) and JSONP risks; RPC
    deserialisation risks and hardening; server-side authentication/authorisation; the code server must never be
    exposed; the book's errata on credentials, open proxies and unsafe uploads.
  - [x] Task 38.3. Figures: Mermaid sequence of the XSRF token flow. Worked example, pitfalls table, `Source:` links,
    `== References`.

### Group 9 — Performance and testing pages

**Parallelizable: yes (four independent pages)**

- [x] Task 39. Create `code-splitting.adoc` ("Code Splitting") ★.
  - [x] Task 39.1. Header and lead paragraph.
  - [x] Task 39.2. Cover every outline bullet: `GWT.runAsync`, split points and fragments; the Async Provider pattern
    and prefetching; combining with Activities; `-XfragmentCount`/fragment merging (A fragment merging); the *Bookshelf*
    admin area.
  - [x] Task 39.3. Figures: SVG `gwt-code-splitting-fragments.svg`. Worked example (compile report evidence),
    pitfalls table, `Source:` links, `== References`.
- [x] Task 40. Create `compile-reports-and-optimization.adoc` ("Compile Reports & Optimization").
  - [x] Task 40.1. Header and lead paragraph.
  - [x] Task 40.2. Cover every outline bullet: `-compileReport`; reducing code size and compile time; lightweight
    metrics and JFR events (2.13).
  - [x] Task 40.3. Examples run, `Source:` links, `== References`.
- [x] Task 41. Create `linkers-and-bootstrap.adoc` ("Linkers & Bootstrap").
  - [x] Task 41.1. Header and lead paragraph.
  - [x] Task 41.2. Cover every outline bullet: the bootstrap sequence; `xsiframe`, `direct_install`, `sso` and the
    deprecated `std`/`xs`; custom linkers; several modules on one page; CSP.

    Book rows: chapter 17 (loaders, `nocache.js`, cross-site loading).
  - [x] Task 41.3. Figures: Mermaid sequence of the bootstrap. Examples run, `Source:` links, `== References`.
- [x] Task 42. Create `testing.adoc` ("Testing") ★.
  - [x] Task 42.1. Header and lead paragraph.
  - [x] Task 42.2. Cover every outline bullet: `GWTTestCase` and `GWTTestSuite`; running with `gwt:test` and
    `-Dgwt.args` (verified run styles); presenter tests with plain JUnit; RPC servlet and shared-code tests; coverage;
    Playwright E2E (xref `web/e2e-testing-real-browsers.adoc`, #258 in prose).

    Book rows: chapter 16.
  - [x] Task 42.3. Figures: Mermaid testing pyramid. Worked example, pitfalls table, `Source:` links, `== References`.

### Group 10 — Ecosystem and tooling pages

**Parallelizable: yes (three independent pages)**

- [x] Task 43. Create `ecosystem-and-libraries.adoc` ("Ecosystem & Libraries").
  - [x] Task 43.1. Header and lead paragraph.
  - [x] Task 43.2. Cover every outline bullet with a table of each project's official URL, latest version and
    verified maintenance status (Domino UI, Sencha GXT, GWT Material, Errai, Nalu, GWTP, Dagger, GIN, REST libraries,
    community channels). State only what Task 2 verified.
  - [x] Task 43.3. `Source:`/`== References`.
- [x] Task 44. Create `j2cl-and-the-future.adoc` ("J2CL & the Future").
  - [x] Task 44.1. Header and lead paragraph.
  - [x] Task 44.2. Cover every outline bullet: J2CL vs GWT 2.x; what "GWT 3" means today; the `org.gwtproject.*`
    modules; writing code that works with both; `j2cl-maven-plugin`; the roadmap.
  - [x] Task 44.3. Examples (a module using both) verified where feasible, `Source:`/`== References`.
- [x] Task 45. Create `tooling-and-ide-support.adoc` ("Tooling & IDE Support").
  - [x] Task 45.1. Header and lead paragraph.
  - [x] Task 45.2. Cover every outline bullet: IntelliJ IDEA, the GWT Eclipse plugin, VS Code; debugging with source
    maps from the IDE; UiBinder/module XML editing; #116 in prose.

    Book rows: chapter 2 (IDE import).
  - [x] Task 45.3. `Source:`/`== References`.

### Group 11 — Migration page

**Parallelizable: yes (single task; written after the page groups so it can collect their notes)**

- [x] Task 46. Create `whats-changed-and-migration.adoc` ("What's Changed & Migration") ★.
  - [x] Task 46.1. Header and lead paragraph.
  - [x] Task 46.2. Cover every outline bullet: 1.x → 2.x changes; a table of 2.0 → 2.13.1 highlights; migration
    recipes (`com.google.gwt` → `org.gwtproject`, `javax` → `jakarta`, legacy mojo plugin → `net.ltgt`, JSNI →
    JsInterop, Elemental → Elemental2, CSS → GSS); **every** "outdated in the book" row and erratum from the issue,
    plus the deviations recorded in Task 2.2.
  - [x] Task 46.3. Pitfalls table, `Source:` links, `== References`.

### Group 12 — Coverage audit before the landing page

**Parallelizable: yes (single task)**

- [x] Task 47. Audit coverage of all 44 concept pages against the issue.
  - [x] Task 47.1. Walk the issue's "Official documentation → page coverage" table, the book concept table ("Covered
    on") and every Page-outline bullet. For each row, `grep` the target page for the concept and fix any gap in that
    page.
  - [x] Task 47.2. Confirm every ★ page has a pitfalls table, at least one diagram and a worked *Bookshelf* example,
    and that every 📊 figure exists (`ls modules/ROOT/images/gwt-*.svg`, `grep -c '\[mermaid\]'`).

### Group 13 — Landing page, bibliography and cheat sheet

**Parallelizable: no — `index.adoc` and the cheat sheet link every page created in Groups 2–11, and the PDF
summarises them**

- [x] Task 48. Create `index.adoc` ("GWT (Google Web Toolkit)") with `== Bibliography`.
  - [x] Task 48.1. Header and lead paragraph with the dated baseline and project status in prose.
  - [x] Task 48.2. Cover every bullet of the `index.adoc` outline: what GWT is and who the section is for; the
    *Bookshelf* scenario (`[#bookshelf]`, as in `web/thymeleaf/index.adoc`); the reading path; `== What's covered`
    grouped as the nav; the "where related material lives elsewhere on this site" table (xrefs verified); related
    issues in prose.
  - [x] Task 48.3. `== Bibliography`: every source in the issue's Bibliography section, each linked to its official
    website (canonical URLs from Task 2.4): the book (Manning page; authors, title, publisher, edition, year, ISBN),
    gwtproject.org resources, the GitHub repository, `gwt-maven-plugin`, JsInterop/Elemental2/J2CL/`org.gwtproject`,
    Jakarta Servlet/Jetty/Spring Boot/Bean Validation/HtmlUnit/JUnit/Playwright, the ecosystem projects, the
    specifications and the CVE entries.
  - [x] Task 48.4. Figures: SVG `gwt-bookshelf-architecture.svg` and a Mermaid mind-map of the section.
  - [x] Task 48.5. End with `== References`.
- [x] Task 49. Create `cheat-sheet.adoc` ("GWT Cheat Sheet").
  - [x] Task 49.1. Follow `web/thymeleaf/cheat-sheet.adoc`: header + `:description:`/`:keywords:`, disclaimer include,
    intro linking `xref:attachment$gwt-cheat-sheet.pdf[downloadable PDF]` with the dated baseline, grouped
    `*Group* --` paragraphs of `xref:`s to every page, a final
    `xref:attachment$gwt-cheat-sheet.pdf[Download the GWT Cheat Sheet (PDF)]` line, `== References`.
- [x] Task 50. Create `modules/ROOT/attachments/gwt-cheat-sheet.pdf` ("GWT Cheat Sheet").
  - [x] Task 50.1. Design a throwaway HTML page (scratchpad `240/cheatsheet/`) rendered with headless Chrome
    print-to-PDF (`--print-to-pdf --no-pdf-header-footer`): exactly one A4 page, dense multi-column, colour-coded,
    with versions and date in the header.
  - [x] Task 50.2. Summarise every concept listed in the issue's "Cheat sheet" section, one box per group: setup
    commands; module XML and properties; compiler and code-server flags; JRE emulation limits; JsInterop (and the JSNI
    mapping); deferred binding; widgets, panels, handlers, `Scheduler`; UiBinder, cell widgets, Editors;
    ClientBundle and CSS/GSS; i18n; History/Activities & Places; RPC, `RequestBuilder`, JSON, RequestFactory; code
    splitting, linkers and caching; testing; the security strip; the "changed since older tutorials" strip.
  - [x] Task 50.3. Verify exactly one A4 page (`python3 -I -c "import pypdf…"`: 1 page, 595×842 pt) and render it to
    PNG to check legibility and overflow. Commit only the PDF, never the HTML.

  - Note (Group 13 result): `index.adoc` (438 lines, `== Bibliography`, `gwt-bookshelf-architecture.svg`, Mermaid mind-map), `cheat-sheet.adoc` (95 lines) and `attachments/gwt-cheat-sheet.pdf` (1 page, 595x842 pt, 246 KB) created; follow-up xrefs added in `whats-changed-and-migration.adoc` and `rest-and-json-libraries.adoc`; Antora build clean, validate:mermaid passes (1580 diagrams), CLAUDE.md greps clean.

### Group 14 — Site wiring and back-links

**Parallelizable: yes (independent files)**

- [x] Task 51. Update `modules/ROOT/nav.adoc`.
  - [x] Task 51.1. Re-check the line numbers. After the last Java web section's cheat-sheet line and before
    `include::partial$nav-python.adoc[]` (after the Thymeleaf cheat sheet today, l.719, or after JSP & Struts if it
    has merged), add `*** xref:web/gwt/index.adoc[GWT (Google Web Toolkit)]` with `****` children for all 44 concept
    pages in the issue's outline order, ending with `**** xref:web/gwt/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 52. Update `modules/ROOT/pages/web/index.adoc` and the root `modules/ROOT/pages/index.adoc`.
  - [x] Task 52.1. `web/index.adoc`: add a **GWT (Google Web Toolkit)** bullet after the Thymeleaf bullet (or the JSP &
    Struts bullet if present), ending ", plus a downloadable cheat sheet."; add the section to `:description:`; append
    the issue's keyword list to `:keywords:`.
  - [x] Task 52.2. Root `index.adoc`: add GWT to the web-development examples in `:description:` and append
    `GWT, Google Web Toolkit, JsInterop` to `:keywords:`. No new tile.
- [x] Task 53. Add the back-links listed under "Current code state": one line each, only where the page already
  discusses the topic, every target verified with `ls` first.
  - [x] Task 53.1. Vaadin pages: `getting-started.adoc`, `element-api-and-web-components.adoc`,
    `custom-components.adoc`.
  - [x] Task 53.2. Thymeleaf pages: `introduction-and-architecture.adoc` and `index.adoc` (replace the "planned" GWT
    mention with an `xref:` and keep the other issues in prose).
  - [x] Task 53.3. JSF pages: `index.adoc`, `migrating-to-jakarta-faces.adoc`, and `introduction-and-history.adoc`
    (the GWT row, the "not documented on this site" sentence, the prose paragraph and the reference bullet).
  - [x] Task 53.4. `backend/springboot/web-ui-frameworks.adoc` and `web/e2e-testing-real-browsers.adoc`.

### Group 15 — Build, validation and review

**Parallelizable: no — depends on every page, the nav and the PDF**

- [x] Task 54. Validate the whole section.
  - [x] Task 54.1. `npm run validate:mermaid` passes for every Mermaid block.
  - [x] Task 54.2. Admonitions and disclaimer: `grep -rn -E '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'
    modules/ROOT/pages/web/gwt` returns nothing; the disclaimer partial is included on all 46 pages.
  - [x] Task 54.3. Run the CLAUDE.md image checks (closed macros, no `<p>image::` in `build/site`, the unquoted-comma
    alt check on the changed files, every `gwt-*.svg` referenced and every `image::` target present).
  - [x] Task 54.4. Run the CLAUDE.md inline-code substitution check on the built `web/gwt` section; it must print
    nothing (critical for JSNI, `@pkg.Class::method`, generics, GSS directives).
  - [x] Task 54.5. Links, secrets and stray files: no `xref:` to a non-existent page (#263/#264/#258/#241/#116 prose
    only); no secrets; no book text/figures (a 10-word overlap scan against the scratchpad book extract); `git status`
    shows no `*.pdf` other than `gwt-cheat-sheet.pdf`, no `*.txt` extracts, no scratch files, and none of the stray
    untracked files noted above.
  - [x] Task 54.6. Every code example has a `Source:` link, every page ends with `== References`, and every ★ page
    has ≥ 1 diagram and a pitfalls table.
  - [x] Task 54.7. Delegate `npx antora antora-playbook.yml` (or the `iru-build-docs` skill) to the `iru-gate-runner`
    agent; it must report 0 errors / 0 warnings. Then spot-check in `build/site` the rendered nav (GWT after the last
    Java web section), the cheat-sheet download, a Mermaid page, an SVG page and the edited back-link pages.
- [x] Task 55. Run the security scan.
  - [x] Task 55.1. Delegate `iru-check-security` (detect-secrets) to the `iru-gate-runner` agent. It must scan the new
    **untracked** files too (`git add -N` or an ad-hoc `--all-files` scan, since detect-secrets skips untracked
    files). Resolve any finding before archiving.
