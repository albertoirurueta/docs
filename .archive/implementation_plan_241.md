# Implementation Plan: Guides & References / Web Development — "JSP & Struts"

## Task summary

Source: GitHub issue #241
Base branch: main

Issue [#241](https://github.com/albertoirurueta/docs/issues/241) adds a **JSP & Struts** section to Web Development at
`modules/ROOT/pages/web/jsp-struts/`, directly after Thymeleaf. It is a practical, example-driven guide to Jakarta Pages
(JSP) 4.0, Jakarta Expression Language 6.0, Jakarta Standard Tag Library 3.0, Jakarta Servlet 6.1 and Apache Struts 7.4
(Tomcat 11, Java 21), written from the official specifications and documentation, with four Manning books (JSP 1.2,
JSTL 1.0, Struts 1, Struts 2.0) consulted only for concept coverage and the bibliography.

The section ships:

* **78 concept pages** plus `cheat-sheet.adoc`: section root 5 (`index`, `introduction-and-history`, `getting-started`,
  `servlet-fundamentals`, `whats-changed-and-migration`), Part I `jsp/` 34 (including `jsp/index.adoc`), Part II
  `struts/` 39 (including `struts/index.adoc`)
* the one-page A4 PDF `modules/ROOT/attachments/jsp-struts-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/jsp-struts-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/jsp-struts-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc` (after the Thymeleaf block, before `include::partial$nav-python.adoc[]`),
  `web/index.adoc` bullet/description/keywords, root `index.adoc` description/keywords
* about 6 back-links, including replacing the "Struts and JSP (issue #241) … planned" prose in the Thymeleaf pages

**The issue body and its "specification appendix" comment are the binding spec** (page outline, official-docs coverage
map, book concept table, outdated-in-the-books table, security sources, nav, cheat sheet, bibliography, acceptance
criteria). Every page task must re-read its page's bullets and cover every one.

**Out of scope:** re-documenting existing material (Spring, Hibernate, Java, Docker, OAuth: link instead). #239, #240,
#258, #261, #263 and #116 appear in prose only unless their pages exist.

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into 5 PRs. As with #238/#253/#257, this run implements
   everything on `feature/241` and opens a single draft PR to `main` with `Closes #241`.
2. **Tasks are untagged; no language/framework key applies.** The installed keys (`java`, `java-springboot`, `dotnet`,
   `database`) implement code with tests and quality gates, while this repository only holds AsciiDoc / Mermaid / SVG /
   PDF, so tasks are implemented directly. The Java/JSP/XML in the pages is illustrative content, but every example is
   compiled and run in a scratch Tomcat 11 app (Task 2.6).
3. **The books are not on this machine** (`~/Desktop/libros/struts/` does not exist). Coverage is driven by the appendix
   comment's concept table and the official docs. The books appear only in `== Bibliography` and prose notes on outdated
   material; no text, listing, figure or sample project is copied and no PDF is ever staged. If the folder appears, it
   is consulted only for concept coverage.
4. **Disclaimer:** `partials/jsp-struts-disclaimer.adoc` is a single `[IMPORTANT]` block shaped like
   `thymeleaf-disclaimer.adoc`. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear in the section.
   Deprecations, EOL, CVEs, security caveats and "the book is outdated" remarks are prose or table rows.
5. **Version baseline is re-verified at implementation time and dated** (Group 1). The issue's numbers were checked on
   2026-10-08.
6. **Running scenario is the original *Bookshelf*** as two WARs on Tomcat 11: `bookshelf-jsp` (Part I) and
   `bookshelf-struts` (Part II). Pages build on each other.
7. **Examples use Maven** (`provided` Jakarta APIs, the JSTL implementation, `struts2-bom` with no hard-coded plugin
   versions) on Java 21.
8. **Existing pages get real `xref:`s; pages that don't exist yet stay plain prose.** Every `xref:` target is verified
   with `ls`. Cross-references between pages of this section are added/verified in the audit group (Group 14), when all
   pages exist. `index.adoc`s and the cheat sheet are written last (Group 15), back-links in Group 16.
9. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `jsp-struts-*.svg`. SVGs are original drawings (no
   Apache Struts/Tomcat/Jakarta EE logos, no spec or book figures).
10. **`whats-changed-and-migration.adoc` is written after all other pages** (Group 13) because it collects book errata
    and official-docs inconsistencies discovered while writing them.
11. **CVE ids are cited only after verification** on cve.org/NVD; Struts bulletins by S2 id with a bulletin link.

### Lessons from earlier section reviews (#198, #199, #230, #237, #253, #257, #238): mandatory for every page task

* **Verify every name against its official page before writing it** (tags, attributes, directives, constants,
  interceptor parameters, classes, Maven coordinates, versions). If the docs don't confirm a detail, describe the
  behaviour without naming it. Struts docs contain stale names and conflicting defaults; the appendix lists them.
* **Security is correctness:** no hardcoded secrets (placeholders only); escape output (`c:out`, `fn:escapeXml`,
  `<s:property escapeHtml>` defaults); no OGNL/EL built from request input; state changes via POST; CSRF/token where
  relevant; JSPs under `WEB-INF`.
* **Every concept gets at least one code example**, each followed by a `Source:` link, and that URL goes in
  `== References`. Show rendered HTML output where it helps.
* **URL hygiene:** canonical jakarta.ee / struts.apache.org / tomcat.apache.org / docs.spring.io URLs with real `#anchor`
  ids.
* **Cross-links must be accurate:** never `xref:` to a page that doesn't exist; no `xref:` inside backticks; no empty
  link text on a fragment xref.
* **AsciiDoc hygiene (critical here):** any inline code containing `${`, `#{`, `%{`, `{1}`, `<%=`, `->`, `...`, `'`,
  `*`, `~`, `^`, `__` or `{` uses a constrained passthrough (`` `+${param.id}+` ``); code containing `+` uses
  `pass:c[...]`. `{placeholders}` stay literal in `[source]` blocks and are escaped in prose. Use `.Title` captions, no
  authoring notes, no prose line starting with `<digits>.`. Image macros on one line; alt text containing a comma is
  quoted. Never hard-wrap a macro.
* **Mermaid:** write `<` as `&lt;` in labels containing tag names (`<c:forEach>`, `<s:form>`) and in stereotypes; pass
  `npm run validate:mermaid`.
* **Book hygiene:** no book text, listing, figure or sample project; scratch extracts stay in the scratchpad.

## Current code state

* This repo is the Antora playbook and root component (`antora-playbook.yml`, `antora.yml` component `ROOT`). Pages live
  in `modules/ROOT/pages`, images in `modules/ROOT/images`, PDFs in `modules/ROOT/attachments`, partials in
  `modules/ROOT/partials`. There is no test suite; verification is a clean `npx antora antora-playbook.yml` plus the
  CLAUDE.md greps and `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`).
* `modules/ROOT/pages/web/` has `thymeleaf/` (42 files, the direct precedent: `index.adoc`, `cheat-sheet.adoc`,
  `introduction-and-architecture.adoc` with the planned-sentence at l.501–505 and the JSP row at l.575–579,
  `whats-changed-and-migration.adoc`), `vaadin/`, `django/`, `php-laravel/`, `aspnet/`, `e2e-testing-real-browsers.adoc`
  and others. No `jsp-struts/` directory, no servlet/Jakarta EE/Tomcat page, no `jsp-struts-*` image or partial exists.
* `modules/ROOT/nav.adoc`: the Thymeleaf block ends with `**** xref:web/thymeleaf/cheat-sheet.adoc[Cheat Sheet (PDF)]`
  just before `include::partial$nav-python.adoc[]`. Five-level nesting already exists in the ASP.NET block.
* Disclaimer precedent: `modules/ROOT/partials/thymeleaf-disclaimer.adoc`; cheat-sheet precedent:
  `web/thymeleaf/cheat-sheet.adoc` and `attachments/thymeleaf-cheat-sheet.pdf`.
* Back-link targets named by the issue: `web/thymeleaf/introduction-and-architecture.adoc`, `web/thymeleaf/index.adoc`
  (l.278–280), `backend/springboot/web-ui-frameworks.adoc`,
  `backend/architecture/decisions-and-migrations/migration-path-legacy-to-modern-stack.adoc` (l.12, l.156),
  `backend/oauth/flows-overview.adoc` (l.191), `web/e2e-testing-real-browsers.adoc` (l.10–13).
* Precedent plan: `.archive/implementation_plan_238.md` (Thymeleaf, same structure and conventions).

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, a blank line, then
  `include::partial$jsp-struts-disclaimer.adoc[]` (on every page, including all three `index.adoc`s).
* **Lead paragraph:** the dated baseline (Jakarta Pages 4.0, EL 6.0, JSTL 3.0, Servlet 6.1, Tomcat 11.0.x, Struts 7.4.x,
  Java 21, Spring 7.0 / Boot 4.1 where relevant) and the verification date.
* **Content:** what it is and why, its status (current/legacy/deprecated/removed), how the container or framework
  implements it, every relevant directive/attribute/tag/operator/constant/parameter/API in tables, where it runs and its
  scope, security implications and the secure default, pitfalls and error names (`JasperException`,
  `PropertyNotFoundException`, `ELException`, `JspTagException`, Struts "There is no Action mapped…", OGNL parameter
  rejection, missing `@StrutsParameter`, …), recent changes with versions, and where the books are outdated.
* **Examples:** `[source,jsp]`, `[source,xml]`, `[source,java]`, `[source,properties]`, `[source,ftl]`, rendered HTML,
  `curl` for actions/JSON/REST. Current APIs only (`jakarta.*`, `jakarta.tags.*`, `StrutsPrepareAndExecuteFilter`,
  `org.apache.struts2.*`, `@StrutsParameter`, `actionFileUpload`); scriptlets and Struts 1 only as labelled "before"
  snippets.
* **Source links:** after each example, e.g.
  `Source: https://jakarta.ee/specifications/tags/3.0/jakarta-tags-spec-3.0#c:forEach[Jakarta Standard Tag Library 3.0 -- c:forEach]`.
* **Page ending:** `== References` with only official docs (and publisher pages where used).

## Implementation steps


### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/jsp-struts-disclaimer.adoc`.
  Created `modules/ROOT/partials/jsp-struts-disclaimer.adoc` (single `[IMPORTANT]` block, xref to `web/jsp-struts/index.adoc#_bibliography`).
  - [x] Task 1.1. Copy the shape of `partials/thymeleaf-disclaimer.adoc`: a single `[IMPORTANT]` block with only the
    AI-assistance disclosure plus `xref:web/jsp-struts/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other admonition block may appear anywhere under `web/jsp-struts/`.
- [x] Task 2. Verify and record the version baseline (scratchpad `241/versions-241.md`) that every later task cites.
  Baseline in scratchpad `241/versions-241.md` (plus `cve-verification.txt`, `url-check.txt`, `book-concepts-checklist.md`, `README-scratch.md`); scratch apps `241/bookshelf-jsp` and `241/bookshelf-struts` built and exercised on Tomcat 11.0.26 with `curl`.
  - [x] Task 2.1. Re-check Maven Central / project sites for Jakarta Pages, EL, Servlet and `jakarta.servlet.jsp.jstl`
    versions, Tomcat 11.0.x, Jetty 12.1.x, GlassFish 8.0.x, Struts 7.4.x / 6.x, `struts2-bom`, Spring Framework and Boot,
    FreeMarker, OGNL. Record numbers dated; don't copy them from the issue.
  - [x] Task 2.2. Re-verify the issue's "Outdated in the books", errata, official-docs inconsistencies and "Security
    sources to verify" lists; verify every CVE id on cve.org/NVD and every S2 bulletin. Record deviations for
    `whats-changed-and-migration.adoc` and `struts/security-bulletins.adoc`.
  - [x] Task 2.3. Re-fetch the Struts docs indexes (Getting Started, Core Developers Guide, Tag Developers Guide, plugins,
    security) and the spec TOCs, then diff them against the appendix "Official documentation → page coverage" map; add
    anything new to the matching page task.
  - [x] Task 2.4. `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}'` every URL in the issue's Bibliography and
    book table; record canonical forms and 404s (Struts 1 docs are offline: use `archive.apache.org`).
  - [x] Task 2.5. Re-read the appendix comment's "Concepts contributed by the books" table and map each row to its
    target page in a scratchpad checklist used by the Group 14 audit.
  - [x] Task 2.6. Create a throwaway scratch **Tomcat 11 + Maven WAR** *Bookshelf* project in the scratchpad
    (`241/bookshelf-jsp`, `241/bookshelf-struts`; JDK 21, Tomcat 11 via download or Docker, Jetty Maven plugin as
    fallback). Never commit it. Every example is compiled/deployed and exercised with `curl` before being pasted.
  - [x] Task 2.7. Check book PDFs are never staged: `git status` must never list a file from `~/Desktop/libros/` or any
    `*.txt` extract.

### Group 2 — Section-root foundations pages

**Parallelizable: yes (three independent pages; `index.adoc` is Group 15)**

- [x] Task 1. Create `web/jsp-struts/introduction-and-history.adoc` ("Introduction & History") ★.
  Done: page (1679 lines) + `images/jsp-struts-model1-vs-model2.svg`; examples run in scratch Tomcat; build/greps/mermaid clean.
  - [x] Task 1.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 1.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: CGI → servlets → JSP → Model 1/2 → Struts 1 → WebWork/XWork → Struts 2 → 6/7; javax → jakarta; action-based vs component-based vs template engines vs SPA; comparison tables of Java view technologies and action-based frameworks (each row verified on its official site); when to choose JSP/Struts today. Sources: Pages spec overview, Struts birdseye/primer, Struts 1 EOL announcement.
  - [x] Task 1.3. Figures: Mermaid timeline of versions; SVG `jsp-struts-model1-vs-model2.svg`.
  - [x] Task 1.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 2. Create `web/jsp-struts/getting-started.adoc` ("Getting Started") ★.
  - [x] Task 2.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 2.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: JDK 21 and Tomcat 11 (Jetty 12.1, GlassFish 8 alternatives; #116 in prose); Maven WAR from scratch (`provided` Jakarta APIs, JSTL implementation, `maven-war-plugin`), deploy via manager/`webapps/`, Jetty Maven plugin or Cargo; first servlet + JSP + JSTL page; `bookshelf-jsp` layout; Docker image for Tomcat (WAR-specific parts only, linking the Docker pages). Sources: Tomcat docs, Jetty and GlassFish docs, Jakarta EE Tutorial.
  - [x] Task 2.3. Figures: Mermaid of request → container → servlet/JSP → response.
  - [x] Task 2.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 3. Create `web/jsp-struts/servlet-fundamentals.adoc` ("Servlet Fundamentals") ★.
  - [x] Task 3.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 3.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: servlet lifecycle and threading; request/response, parameters, headers, attributes, encoding, buffering, redirects (6.1); scopes, `ServletContext`, sessions, cookies (`SameSite` via `Cookie.setAttribute`); filters, wrappers, listeners; annotations vs `web.xml`; `RequestDispatcher` forward/include and error-dispatch attributes; URL mapping rules; WAR structure, `WEB-INF`, welcome files, error pages, `@MultipartConfig`. Sources: Servlet 6.1 spec ch. 2–7, 9–12, 14.
  - [x] Task 3.3. Figures: SVG `jsp-struts-filter-chain-and-dispatch.svg`.
  - [x] Task 3.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.

### Group 3 — Part I core JSP pages

**Parallelizable: yes (eleven independent pages)**

- [x] Task 4. Create `web/jsp-struts/jsp/lifecycle-and-translation.adoc` ("Lifecycle & Translation").
  - [x] Task 4.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 4.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: translation → compilation → class load → init/service/destroy; `HttpJspPage`, `_jspService`, thread model, generated source. Sources: Pages spec §1.1, ch. 9, ch. 11.
  - [x] Task 4.3. Figures: Mermaid of the translation/request phases.
  - [x] Task 4.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 5. Create `web/jsp-struts/jsp/syntax-comments-and-escaping.adoc` ("Syntax, Comments & Escaping").
  - [x] Task 5.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 5.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: elements vs template text, standard vs XML syntax, comment kinds, quoting and escaping rules. Sources: Pages spec §1.3, §1.5, §1.6.
  - [x] Task 5.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 5.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 6. Create `web/jsp-struts/jsp/directives.adoc` ("Directives").
  - [x] Task 6.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 6.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: every `page` attribute (incl. `errorOnELNotFound`), `include`, `taglib`, `tag`/`attribute`/`variable` pointers, removed attributes. Sources: Pages spec §1.10.
  - [x] Task 6.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 6.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 7. Create `web/jsp-struts/jsp/implicit-objects-and-scopes.adoc` ("Implicit Objects & Scopes").
  - [x] Task 7.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 7.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: the nine implicit objects, `PageContext`, `JspWriter`, page/request/session/application scope and attribute lookup order. Sources: Pages spec §1.8; Servlet ch. 3, 4, 7.
  - [x] Task 7.3. Figures: SVG or Mermaid of scope lifetimes.
  - [x] Task 7.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 8. Create `web/jsp-struts/jsp/scripting-elements.adoc` ("Scripting Elements (Legacy)").
  - [x] Task 8.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 8.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: declarations, scriptlets, expressions, why discouraged, `scripting-invalid`, migration to EL/JSTL. Sources: Pages spec §1.12, ch. 9; EE 5 tutorial.
  - [x] Task 8.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 8.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 9. Create `web/jsp-struts/jsp/standard-actions-and-javabeans.adoc` ("Standard Actions & JavaBeans") ★.
  - [x] Task 9.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 9.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: JavaBeans conventions; `jsp:useBean`, `setProperty`, `getProperty`; `jsp:include`/`forward`/`param`/`element`/`attribute`/`body`/`text`/`output`; removed `jsp:plugin`. Sources: Pages spec ch. 5.
  - [x] Task 9.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 9.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 10. Create `web/jsp-struts/jsp/includes-forwards-and-page-composition.adoc` ("Includes, Forwards & Page Composition").
  - [x] Task 10.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 10.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: static include vs `jsp:include` vs `c:import`; forward; composition patterns; `include-prelude`/`include-coda`. Sources: Pages spec §1.10.3–4, §5.4–5.5; Servlet ch. 9; Tags ch. 7.
  - [x] Task 10.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 10.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 11. Create `web/jsp-struts/jsp/error-handling.adoc` ("Error Handling").
  - [x] Task 11.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 11.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `errorPage`/`isErrorPage`, `exception`, `ErrorData`, `error-page` in `web.xml`, status-code pages, logging. Sources: Pages spec §1.4; Servlet ch. 10.
  - [x] Task 11.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 11.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 12. Create `web/jsp-struts/jsp/character-encoding.adoc` ("Character Encoding").
  - [x] Task 12.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 12.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `pageEncoding`, `contentType`, request encoding, BOM, `page-encoding` property, filters. Sources: Pages spec ch. 4, App. B.
  - [x] Task 12.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 12.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 13. Create `web/jsp-struts/jsp/jsp-documents-xml-syntax.adoc` ("JSP Documents (XML Syntax)").
  - [x] Task 13.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 13.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `.jspx`, `jsp:root`, `jsp:output`, namespaces, XML view, `is-xml`. Sources: Pages spec ch. 6, ch. 10.
  - [x] Task 13.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 13.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 14. Create `web/jsp-struts/jsp/configuration-and-property-groups.adoc` ("Configuration & Property Groups").
  - [x] Task 14.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 14.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `jsp-config`, `taglib` map, every `jsp-property-group` element, precedence and url-pattern rules. Sources: Pages spec ch. 3; Servlet ch. 14.
  - [x] Task 14.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 14.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 4 — Part I Expression Language pages

**Parallelizable: yes (five independent pages)**

- [x] Task 15. Create `web/jsp-struts/jsp/expression-language-basics.adoc` ("Expression Language Basics") ★.
  - [x] Task 15.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 15.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `${…}` vs `#{…}`, EL in template text, implicit objects, property/method/array access, resolvers, deferred vs immediate. Sources: Pages ch. 2; EL §1.1–1.6; Tags ch. 3.
  - [x] Task 15.3. Figures: Mermaid of the resolver chain.
  - [x] Task 15.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 16. Create `web/jsp-struts/jsp/el-operators-and-type-coercion.adoc` ("EL Operators & Type Coercion").
  - [x] Task 16.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 16.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: arithmetic, relational, logical, `empty`, ternary, string concatenation, precedence, coercion rules. Sources: EL §1.7–1.17, §1.25.
  - [x] Task 16.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 16.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 17. Create `web/jsp-struts/jsp/el-lambdas-collections-and-streams.adoc` ("EL Lambdas, Collections & Streams").
  - [x] Task 17.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 17.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: lambdas, set/list/map literals, every stream operation. Sources: EL §1.20, ch. 2.
  - [x] Task 17.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 17.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 18. Create `web/jsp-struts/jsp/el-static-access-records-and-optional.adoc` ("EL Static Access, Records & Optional").
  - [x] Task 18.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 18.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: static fields/methods, enums, `RecordELResolver`, `OptionalELResolver`, linking the Java pages. Sources: EL §1.21–1.24.
  - [x] Task 18.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 18.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 19. Create `web/jsp-struts/jsp/el-configuration-and-elprocessor.adoc` ("EL Configuration & ELProcessor").
  - [x] Task 19.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 19.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `isELIgnored`/`el-ignored`, deferred syntax, standalone `ELProcessor`, custom `ELResolver`. Sources: Pages §2.5–2.7, §3.3; EL Javadoc.
  - [x] Task 19.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 19.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 5 — Part I JSTL pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 20. Create `web/jsp-struts/jsp/jstl-core.adoc` ("JSTL Core") ★.
  - [x] Task 20.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 20.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: the five libraries and `jakarta.tags.*` URIs, `c:out` escaping, `c:set`, `c:remove`, `c:if`, `c:choose`, `c:catch`. Sources: Tags ch. 1–5 and tagdocs.
  - [x] Task 20.3. Figures: Mermaid of the five tag libraries.
  - [x] Task 20.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 21. Create `web/jsp-struts/jsp/jstl-iteration.adoc` ("JSTL Iteration").
  - [x] Task 21.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 21.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `c:forEach` (items types, `begin`/`end`/`step`, `varStatus`/`LoopTagStatus`), `c:forTokens`, paging. Sources: Tags ch. 6.
  - [x] Task 21.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 21.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 22. Create `web/jsp-struts/jsp/jstl-urls-imports-and-redirects.adoc` ("JSTL URLs, Imports & Redirects").
  - [x] Task 22.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 22.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `c:url`, `c:param`, `c:import`, `c:redirect`; URL rewriting and encoding. Sources: Tags ch. 7.
  - [x] Task 22.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 22.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 23. Create `web/jsp-struts/jsp/jstl-i18n-and-messages.adoc` ("JSTL i18n & Messages").
  - [x] Task 23.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 23.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: locales, `fmt:setLocale`, bundles, `fmt:message`/`param`, `fmt:requestEncoding`, fallback order. Sources: Tags ch. 8; EE tutorial i18n.
  - [x] Task 23.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 23.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 24. Create `web/jsp-struts/jsp/jstl-formatting.adoc` ("JSTL Formatting").
  - [x] Task 24.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 24.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `fmt:formatNumber`/`parseNumber`/`formatDate`/`parseDate`, time zones, patterns. Sources: Tags ch. 9.
  - [x] Task 24.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 24.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 25. Create `web/jsp-struts/jsp/jstl-functions.adoc` ("JSTL Functions").
  - [x] Task 25.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 25.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: all 16 `fn:` functions with examples; `fn:escapeXml`. Sources: Tags ch. 15.
  - [x] Task 25.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 25.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 26. Create `web/jsp-struts/jsp/jstl-sql-and-xml.adoc` ("JSTL SQL & XML (Legacy)").
  - [x] Task 26.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 26.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `sql:*` and `x:*` reference with examples and why discouraged. Sources: Tags ch. 10–13; EE tutorial Tags stub.
  - [x] Task 26.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 26.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 6 — Part I custom tags pages

**Parallelizable: yes (four independent pages)**

- [x] Task 27. Create `web/jsp-struts/jsp/custom-tags-simple-tag.adoc` ("Custom Tags: SimpleTag") ★.
  - [x] Task 27.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 27.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `SimpleTagSupport`, `JspFragment`, `DynamicAttributes`, attributes, body, `<bs:rating>` and `<bs:pagination>`. Sources: Pages §7.1; Javadoc.
  - [x] Task 27.3. Figures: Mermaid of the SimpleTag lifecycle.
  - [x] Task 27.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 28. Create `web/jsp-struts/jsp/custom-tags-classic.adoc` ("Custom Tags: Classic Handlers").
  - [x] Task 28.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 28.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `TagSupport`/`BodyTagSupport`, return codes, pooling (`enablePooling`), when to use. Sources: Pages §7.1; Tomcat Jasper how-to.
  - [x] Task 28.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 28.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 29. Create `web/jsp-struts/jsp/tag-library-descriptors-and-el-functions.adoc` ("Tag Library Descriptors & EL Functions").
  - [x] Task 29.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 29.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: TLD schema, `tag`/`function` elements, validators, listeners, packaging and discovery. Sources: Pages §7.2–7.4, §2.11, §3.2; Tags ch. 14.
  - [x] Task 29.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 29.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 30. Create `web/jsp-struts/jsp/tag-files-and-layouts.adoc` ("Tag Files & Layouts") ★.
  - [x] Task 30.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 30.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `.tag`/`.tagx` in `WEB-INF/tags`, `tag`/`attribute`/`variable` directives, `jsp:invoke`/`jsp:doBody`, layout and component tag files. Sources: Pages ch. 8, §5.9–5.10.
  - [x] Task 30.3. Figures: SVG `jsp-struts-tag-file-layout.svg`.
  - [x] Task 30.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.

### Group 7 — Part I building-applications pages

**Parallelizable: yes (six independent pages)**

- [x] Task 31. Create `web/jsp-struts/jsp/mvc-with-servlets-and-jsp.adoc` ("MVC with Servlets & JSP") ★.
  - [x] Task 31.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 31.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: Model 1 vs Model 2, front controller, forward to `WEB-INF` JSPs, PRG. Sources: Servlet ch. 9, 10; EE 5 tutorial; Spring mvc-jsp for comparison.
  - [x] Task 31.3. Figures: Mermaid of a Model 2 request.
  - [x] Task 31.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 32. Create `web/jsp-struts/jsp/forms-validation-and-sessions.adoc` ("Forms, Validation & Sessions").
  - [x] Task 32.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 32.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: form handling and sticky fields, Bean Validation in a servlet, session use, login via container security or a filter. Sources: Servlet spec; Jakarta Validation docs.
  - [x] Task 32.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 32.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 33. Create `web/jsp-struts/jsp/spring-mvc-with-jsp.adoc` ("Spring MVC with JSP").
  - [x] Task 33.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 33.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `registry.jsp()`, `InternalResourceViewResolver`, `spring:` and `form:` tags, Boot "JSP Limitations" (WAR only). Sources: Spring mvc-jsp all anchors; Boot docs.
  - [x] Task 33.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 33.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 34. Create `web/jsp-struts/jsp/jasper-configuration-and-precompilation.adoc` ("Jasper Configuration & Precompilation").
  - [x] Task 34.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 34.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: Jasper servlet init parameters (dev vs prod), JspC, Jetty and GlassFish notes. Sources: Tomcat Jasper how-to all anchors; Pages §11.4.
  - [x] Task 34.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 34.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 35. Create `web/jsp-struts/jsp/testing-and-debugging.adoc` ("Testing & Debugging").
  - [x] Task 35.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 35.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: reading generated sources, `keepgenerated`, SMAP, HtmlUnit/Playwright, JUnit 5. Sources: Pages §11.5; Jasper params.
  - [x] Task 35.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 35.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 36. Create `web/jsp-struts/jsp/security.adoc` ("Security") ★.
  - [x] Task 36.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 36.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: XSS and EL injection, `c:out`/`fn:escapeXml`, OWASP Java Encoder, JSPs under `WEB-INF`, scripting disabled, Tomcat hardening, CVEs verified. Sources: OWASP cheat sheets, Tomcat security pages, Struts security guide.
  - [x] Task 36.3. Figures: Mermaid of output-escaping contexts.
  - [x] Task 36.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.

### Group 8 — Part II Struts foundations pages

**Parallelizable: yes (ten independent pages)**

- [x] Task 37. Create `web/jsp-struts/struts/architecture-and-request-lifecycle.adoc` ("Architecture & Request Lifecycle") ★.
  - [x] Task 37.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 37.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: filter → action mapper → action proxy → interceptors → action → result, `nutshell`, `big-picture`, `action-mapper`. Sources: CDG nutshell, big-picture, action-mapper.
  - [x] Task 37.3. Figures: SVG `jsp-struts-struts-request-lifecycle.svg`.
  - [x] Task 37.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 38. Create `web/jsp-struts/struts/getting-started.adoc` ("Struts Getting Started") ★.
  - [x] Task 38.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 38.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `bookshelf-struts` project, `struts.xml`, `StrutsPrepareAndExecuteFilter`, hello world, first action and JSP, `struts2-bom`. Sources: GS how-to-create-a-struts-web-application, hello-world-using-struts.
  - [x] Task 38.3. Figures: Mermaid of project layout/flow.
  - [x] Task 38.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 39. Create `web/jsp-struts/struts/configuration-struts-xml-and-constants.adoc` ("Configuration: struts.xml & Constants").
  - [x] Task 39.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 39.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: configuration files and load order, `struts.xml`, `struts.properties`, `default.properties` constants. Sources: CDG configuration-files, struts-xml, default-properties.
  - [x] Task 39.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 39.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 40. Create `web/jsp-struts/struts/packages-and-namespaces.adoc` ("Packages & Namespaces").
  - [x] Task 40.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 40.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `name`, `extends`, `namespace`, `abstract`, namespace resolution. Sources: CDG package-configuration, namespace-configuration.
  - [x] Task 40.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 40.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 41. Create `web/jsp-struts/struts/actions.adoc` ("Actions") ★.
  - [x] Task 41.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 41.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: action classes, `execute`, `ActionSupport`, `SessionAware`/`ServletRequestAware`, accessing session/request. Sources: CDG action-configuration, accessing-application-session-request-objects.
  - [x] Task 41.3. Figures: Mermaid of action execution.
  - [x] Task 41.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 42. Create `web/jsp-struts/struts/wildcard-mappings-and-method-invocation.adoc` ("Wildcard Mappings & Method Invocation").
  - [x] Task 42.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 42.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `{1}` patterns, strict method invocation, `allowed-methods`, dynamic method invocation removal. Sources: CDG wildcard-mappings; GS wildcard-method-selection.
  - [x] Task 42.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 42.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 43. Create `web/jsp-struts/struts/results-and-result-types.adoc` ("Results & Result Types").
  - [x] Task 43.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 43.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: result config and every `*-result` type (dispatcher, redirect, redirectAction, chain, stream, json, freemarker, …). Sources: CDG result-configuration, result-types.
  - [x] Task 43.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 43.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 44. Create `web/jsp-struts/struts/exception-handling-and-global-results.adoc` ("Exception Handling & Global Results").
  - [x] Task 44.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 44.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `exception-mapping`, global results/exceptions, exception interceptor. Sources: CDG exception-configuration, exception-interceptor.
  - [x] Task 44.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 44.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 45. Create `web/jsp-struts/struts/interceptors.adoc` ("Interceptors") ★.
  - [x] Task 45.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 45.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: interceptor stacks, `defaultStack` in order, every `*-interceptor` page, parameters, `interceptor-ref`. Sources: CDG interceptors, interceptor-configuration, each *-interceptor.
  - [x] Task 45.3. Figures: SVG `jsp-struts-interceptor-stack.svg`.
  - [x] Task 45.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 46. Create `web/jsp-struts/struts/custom-interceptors.adoc` ("Custom Interceptors").
  - [x] Task 46.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 46.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `Interceptor`, `AbstractInterceptor`, `MethodFilterInterceptor`, ordering and testing. Sources: CDG writing-interceptors.
  - [x] Task 46.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 46.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 9 — Part II data, parameters and validation pages

**Parallelizable: yes (ten independent pages)**

- [x] Task 47. Create `web/jsp-struts/struts/value-stack-action-context-and-ognl.adoc` ("ValueStack, ActionContext & OGNL") ★.
  - [x] Task 47.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 47.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: ValueStack vs `ActionContext`, OGNL basics, `#`/`%{}`/`${}`, expression compilation, security restrictions. Sources: TDG ognl, ognl-basics, ognl-expression-compilation.
  - [x] Task 47.3. Figures: SVG `jsp-struts-value-stack.svg`.
  - [x] Task 47.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 48. Create `web/jsp-struts/struts/parameter-injection-and-struts-parameter.adoc` ("Parameter Injection & @StrutsParameter") ★.
  - [x] Task 48.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 48.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `@StrutsParameter` depth rules, parameter name acceptance patterns, `ParametersInterceptor`. Sources: CDG struts-parameter-annotation.
  - [x] Task 48.3. Figures: Mermaid of parameter binding decision.
  - [x] Task 48.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 49. Create `web/jsp-struts/struts/type-conversion.adoc` ("Type Conversion").
  - [x] Task 49.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 49.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: built-in conversion, converters, conversion annotations, conversion-error interceptor. Sources: CDG type-conversion, conversion-error-interceptor.
  - [x] Task 49.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 49.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 50. Create `web/jsp-struts/struts/validation.adoc` ("Validation") ★.
  - [x] Task 50.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 50.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: validation interceptors, `-validation.xml`, every validator, annotation validation, field vs non-field validators. Sources: CDG validation, basic-validation, validator pages.
  - [x] Task 50.3. Figures: Mermaid of validation flow.
  - [x] Task 50.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 51. Create `web/jsp-struts/struts/bean-validation-plugin.adoc` ("Bean Validation Plugin").
  - [x] Task 51.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 51.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: Jakarta Validation 3 integration, config, example. Sources: plugins bean-validation; example bean-validation.
  - [x] Task 51.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 51.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 52. Create `web/jsp-struts/struts/localization-and-i18n.adoc` ("Localization & i18n").
  - [x] Task 52.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 52.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: resource bundle search order, `i18n` interceptor, date/number formatting. Sources: CDG localization, formatting-dates-and-numbers, i18n-interceptor.
  - [x] Task 52.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 52.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 53. Create `web/jsp-struts/struts/model-driven-preparable-and-crud.adoc` ("ModelDriven, Preparable & CRUD").
  - [x] Task 53.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 53.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `ModelDriven`, `Preparable`, model-driven interceptor, Bookshelf CRUD. Sources: CDG model-driven, model-driven-interceptor.
  - [x] Task 53.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 53.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 54. Create `web/jsp-struts/struts/action-chaining-sessions-and-scopes.adoc` ("Action Chaining, Sessions & Scopes").
  - [x] Task 54.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 54.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `chain` result, chaining interceptor, scope interceptors, session use. Sources: CDG action-chaining, chain-result, chaining-interceptor.
  - [x] Task 54.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 54.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 55. Create `web/jsp-struts/struts/file-upload-and-download.adoc` ("File Upload & Download") ★.
  - [x] Task 55.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 55.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `actionFileUpload`, `UploadedFilesAware`, limits, `stream` result, CSV export, security. Sources: CDG action-file-upload, action-file-upload-interceptor.
  - [x] Task 55.3. Figures: Mermaid of upload handling.
  - [x] Task 55.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 56. Create `web/jsp-struts/struts/double-submit-tokens-and-wait-pages.adoc` ("Double-Submit Tokens & Wait Pages").
  - [x] Task 56.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 56.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `token`/`tokenSession` interceptors, `execAndWait`, wait pages. Sources: CDG token-interceptor, token-session-interceptor, execute-and-wait.
  - [x] Task 56.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 56.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 10 — Part II tags and views pages

**Parallelizable: yes (five independent pages)**

- [x] Task 57. Create `web/jsp-struts/struts/tags-overview-and-generic-tags.adoc` ("Tags Overview & Generic Tags").
  - [x] Task 57.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 57.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: tag syntax, alt syntax, JSP tags, every generic tag (`s:property`, `s:iterator`, `s:if`, `s:url`, …). Sources: TDG struts-tags, tag-syntax, alt-syntax, jsp-tags.
  - [x] Task 57.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 57.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 58. Create `web/jsp-struts/struts/ui-and-form-tags.adoc` ("UI & Form Tags").
  - [x] Task 58.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 58.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: every form tag with attributes, `s:form`, validation display. Sources: TDG ui-tags, form-tags; GS form-tags.
  - [x] Task 58.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 58.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 59. Create `web/jsp-struts/struts/themes-and-templates.adoc` ("Themes & Templates").
  - [x] Task 59.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 59.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: themes (`simple`, `xhtml`, `css_xhtml`), selecting and overriding templates. Sources: TDG themes-and-templates, selecting-themes.
  - [x] Task 59.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 59.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 60. Create `web/jsp-struts/struts/freemarker-and-velocity-views.adoc` ("FreeMarker & Velocity Views").
  - [x] Task 60.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 60.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: FreeMarker/Velocity results, tags, `[source,ftl]` examples. Sources: TDG freemarker, freemarker-tags, velocity, velocity-tags.
  - [x] Task 60.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 60.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 61. Create `web/jsp-struts/struts/tiles-and-page-layouts.adoc` ("Tiles & Page Layouts").
  - [x] Task 61.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 61.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: Tiles plugin configuration (Apache Tiles in the Attic), tag-file layout alternative. Sources: plugins tiles; Attic page; example tiles.
  - [x] Task 61.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 61.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 11 — Part II integrations and plugins pages

**Parallelizable: yes (six independent pages)**

- [x] Task 62. Create `web/jsp-struts/struts/convention-plugin-and-annotations.adoc` ("Convention Plugin & Annotations").
  - [x] Task 62.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 62.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: package locators, naming rules, annotations, Bookshelf variant. Sources: plugins convention; CDG annotations.
  - [x] Task 62.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 62.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 63. Create `web/jsp-struts/struts/spring-integration.adoc` ("Spring Integration").
  - [x] Task 63.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 63.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `ContextLoaderListener`, Spring-managed actions and services, auto-wiring. Sources: plugins spring; GS spring; example spring-struts.
  - [x] Task 63.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 63.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 64. Create `web/jsp-struts/struts/dependency-injection-and-cdi.adoc` ("Dependency Injection & CDI").
  - [x] Task 64.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 64.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: container injection, bean configuration, CDI plugin (links to Vaadin/Quarkus CDI pages). Sources: CDG dependency-injection, bean-configuration; plugins cdi.
  - [x] Task 64.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 64.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 65. Create `web/jsp-struts/struts/json-plugin-and-ajax.adoc` ("JSON Plugin & AJAX").
  - [x] Task 65.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 65.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: JSON result, interceptor, AJAX recipes, curl examples. Sources: plugins json; CDG ajax; TDG ajax-tags.
  - [x] Task 65.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 65.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 66. Create `web/jsp-struts/struts/rest-plugin.adoc` ("REST Plugin").
  - [x] Task 66.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 66.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `RestActionMapper`, REST controllers, `rest-showcase`, curl examples. Sources: plugins rest; CDG restful-action-mapper.
  - [x] Task 66.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 66.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 67. Create `web/jsp-struts/struts/other-plugins.adoc` ("Other Plugins").
  - [x] Task 67.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 67.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: plugins index, config per plugin, XSLT result, JasperReports (#261 in prose). Sources: plugins index and pages; CDG xsl-result; GS jasper-reports-tutorial.
  - [x] Task 67.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 67.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 12 — Part II quality and operations pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 68. Create `web/jsp-struts/struts/testing.adoc` ("Testing").
  - [x] Task 68.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 68.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: testing actions as POJOs, Struts JUnit plugin, TestNG, HtmlUnit/Playwright (#258 in prose). Sources: plugins junit, testng; GS unit-testing.
  - [x] Task 68.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 68.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 69. Create `web/jsp-struts/struts/debugging-dev-mode-and-logging.adoc` ("Debugging, Dev Mode & Logging").
  - [x] Task 69.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 69.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `struts.devMode`, debugging interceptor, logging, config browser (dev-only). Sources: CDG development-mode, debugging, logging.
  - [x] Task 69.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 69.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 70. Create `web/jsp-struts/struts/security-hardening.adoc` ("Security Hardening") ★.
  - [x] Task 70.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 70.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: every section of the security guide: allowlists, `@StrutsParameter`, strict method invocation, OGNL restrictions, exclusion lists, devMode off, upgrade policy. Sources: SEC whole page; CDG default-properties.
  - [x] Task 70.3. Figures: Mermaid of defence layers.
  - [x] Task 70.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 71. Create `web/jsp-struts/struts/security-headers-csp-coop-coep-fetch-metadata.adoc` ("Security Headers: CSP, COOP, COEP & Fetch Metadata").
  - [x] Task 71.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 71.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: CSP, COOP, COEP and fetch-metadata interceptors, configuration and examples. Sources: CDG csp-interceptor, coep-interceptor, coop, fetch-metadata.
  - [x] Task 71.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 71.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 72. Create `web/jsp-struts/struts/security-bulletins.adoc` ("Security Bulletins").
  - [x] Task 72.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 72.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: timeline of S2 bulletins, each cited by S2 id with a verified CVE and bulletin link. Sources: cwiki Security Bulletins, announce pages, security.html.
  - [x] Task 72.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 72.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.
- [x] Task 73. Create `web/jsp-struts/struts/struts-1-classic-and-migration.adoc` ("Struts 1 (Classic) & Migration") ★.
  - [x] Task 73.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 73.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: Struts 1 concepts, EOL, small labelled Struts 1 "before" snippets and Struts 7 "after", strangler-fig link to the Bookshop migration scenario. Sources: Struts 1 EOL announcement and press release; archived 1.3.10 docs; Migration Guide.
  - [x] Task 73.3. Figures: Mermaid of migration path.
  - [x] Task 73.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`. As a ★ page it must also have at least one diagram, a pitfalls table and a worked *Bookshelf* example, and be among the most detailed pages.
- [x] Task 74. Create `web/jsp-struts/struts/deployment-and-production.adoc` ("Deployment & Production").
  - [x] Task 74.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 74.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: performance tuning, application servers, static content, Docker/Kubernetes links. Sources: CDG performance-tuning, application-servers, static-content.
  - [x] Task 74.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 74.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 13 — What's Changed & Migration

**Parallelizable: no — collects errata and inconsistencies found while writing Groups 2–12**

- [x] Task 75. Create `web/jsp-struts/whats-changed-and-migration.adoc` ("What's Changed & Migration").
  - [x] Task 75.1. Header and lead paragraph per "Conventions" (dated baseline, versions, where it runs).
  - [x] Task 75.2. Re-read this page's bullets in issue #241 (`gh issue view 241`) and cover **every** bullet, plus every row of the appendix comment's "Concepts contributed by the books" table and "Official documentation → page coverage" map that targets this page. Key topics: `javax` → `jakarta` (Tomcat migration tool, `legacyAppBase`); JSP 1.2 → 4.0; JSTL 1.0 → 3.0 URIs; EL 2.2 → 6.0; Servlet changes; Struts 2.3 → 2.5 → 6 → 7 renames; the whole "Outdated in the books" table; book errata and official-docs inconsistencies; links to the Bookshop migration scenario, #239 in prose. Sources: migration guides, appendix comment tables.
  - [x] Task 75.3. Figures: none required by the issue; add a Mermaid diagram or SVG if it clarifies.
  - [x] Task 75.4. Every example follows the *Bookshelf* scenario, is verified in the Group 1 scratch app, and is followed by a `Source:` link. Add "what changed recently" and "where the books are outdated". End with `== References`.

### Group 14 — Coverage and cross-reference audit

**Parallelizable: yes (single task)**

- [x] Task 76. Audit all 78 concept pages against the issue.
  - [x] Task 76.1. Walk the appendix "Official documentation → page coverage" map, the book concept table and every page-outline bullet. For each row, `grep` the target page for the concept and fix gaps in that page.
  - [x] Task 76.2. Confirm every ★ page has a pitfalls table, ≥ 1 diagram and a worked *Bookshelf* example, and every 📊 figure exists (`ls modules/ROOT/images/jsp-struts-*.svg`, `grep -c '\[mermaid\]'`).
  - [x] Task 76.3. Add and verify cross-references between pages of the section (`ls` each `xref:` target); no `xref:` to #239/#240/#258/#261/#263/#116 unless the page exists.
  - [x] Task 76.4. Confirm all 8 SVG names used are referenced and no orphans exist.

### Group 15 — Landing pages, bibliography and cheat sheet

**Parallelizable: no — landing pages and the cheat sheet link every page, and the PDF summarises them**

- [x] Task 77. Create `web/jsp-struts/index.adoc` ("JSP & Struts").
  Created `web/jsp-struts/index.adoc` (landing, `[#bookshelf]`, `== Bibliography` with every link curl-checked, related-material table, mind-map, new `jsp-struts-bookshelf-architecture.svg`).
  - [x] Task 77.1. Header per "Conventions" with the disclaimer include; lead paragraph with dated baseline.
  - [x] Task 77.2. Cover: landing page: what JSP, EL, JSTL and Struts are and who the section is for, version baseline and support status in prose, the *Bookshelf* scenario (`[#bookshelf]`), reading path, `== What's covered` grouped as the nav, the related-material table (every row of the issue's existing-pages table, xrefs verified), related issues in prose, and `== Bibliography` listing every source with official links (books at their Manning pages, Jakarta specs, Tomcat/Jetty/GlassFish, struts.apache.org and wiki, Spring, OWASP, CVEs verified).
  - [x] Task 77.3. Figures as 📊 in the issue (landing: SVG `jsp-struts-bookshelf-architecture.svg` and a Mermaid mind-map). End with `== References`.
- [x] Task 78. Create `web/jsp-struts/jsp/index.adoc` ("JSP, EL & JSTL").
  Created `web/jsp-struts/jsp/index.adoc` (version matrix EE 9 to 12, container matrix, Maven coordinates, reading order, mind-map).
  - [x] Task 78.1. Header per "Conventions" with the disclaimer include; lead paragraph with dated baseline.
  - [x] Task 78.2. Cover: Part I overview, Pages/EL/Tags/Servlet version matrix (EE 9 → 12), Tomcat/Jetty/GlassFish support matrix, Maven coordinates, reading order.
  - [x] Task 78.3. Figures as 📊 in the issue (landing: SVG `jsp-struts-bookshelf-architecture.svg` and a Mermaid mind-map). End with `== References`.
- [x] Task 79. Create `web/jsp-struts/struts/index.adoc` ("Apache Struts").
  Created `web/jsp-struts/struts/index.adoc` (version/EOL table, `struts2-bom` coordinates, reading order, mind-map).
  - [x] Task 79.1. Header per "Conventions" with the disclaimer include; lead paragraph with dated baseline.
  - [x] Task 79.2. Cover: Part II overview, version/EOL table (7.x, 6.x, 2.5, 2.3, 1.x with dates), Maven coordinates via `struts2-bom`, reading order.
  - [x] Task 79.3. Figures as 📊 in the issue (landing: SVG `jsp-struts-bookshelf-architecture.svg` and a Mermaid mind-map). End with `== References`.
- [x] Task 80. Create `web/jsp-struts/cheat-sheet.adoc` ("JSP & Struts Cheat Sheet").
  Created `web/jsp-struts/cheat-sheet.adoc` (grouped xrefs to all 75 pages, PDF link, References).
  - [x] Task 80.1. Follow `web/thymeleaf/cheat-sheet.adoc`: header, disclaimer include, intro linking `xref:attachment$jsp-struts-cheat-sheet.pdf[downloadable PDF]` with the dated baseline, grouped `*Group* --` paragraphs of `xref:`s to every page, a final `xref:attachment$jsp-struts-cheat-sheet.pdf[Download the JSP & Struts Cheat Sheet (PDF)]` line, `== References`.
- [x] Task 81. Create `modules/ROOT/attachments/jsp-struts-cheat-sheet.pdf` ("JSP & Struts Cheat Sheet").
  Created `modules/ROOT/attachments/jsp-struts-cheat-sheet.pdf` (one A4 page 594.96x841.92 pt, 347 KB; HTML only in the scratchpad).
  - [x] Task 81.1. Design a throwaway HTML page (scratchpad `241/cheatsheet/`) rendered with headless Chrome print-to-PDF: exactly one A4 page, dense, multi-column, colour-coded, versions and date in the header.
  - [x] Task 81.2. Summarise every concept in the issue's "Cheat sheet" section, one box per group (setup, servlet essentials, JSP syntax, EL, JSTL, custom tags, `jsp-property-group` and Jasper, Struts lifecycle and `struts.xml`, result types and `defaultStack`, OGNL/ValueStack/`@StrutsParameter`, validation/i18n/conversion, tags/themes/Convention/JSON/REST/upload, security strip, "changed since older tutorials" strip).
  - [x] Task 81.3. Verify exactly one A4 page (595×842 pt) with `python3 -I`, render to PNG to check legibility/overflow. Commit only the PDF, never the HTML.

### Group 16 — Site wiring and back-links

**Parallelizable: yes (independent files)**

- [x] Task 82. Update `modules/ROOT/nav.adoc`.
  - [x] Task 82.1. After `**** xref:web/thymeleaf/cheat-sheet.adoc[Cheat Sheet (PDF)]` and before `include::partial$nav-python.adoc[]`, add `*** xref:web/jsp-struts/index.adoc[JSP & Struts]` (after JSF's last child instead if #239 has landed), with `****` section-root pages, `**** xref:web/jsp-struts/jsp/index.adoc[JSP, EL & JSTL]` and `**** xref:web/jsp-struts/struts/index.adoc[Apache Struts]` with `*****` children in the issue's outline order, then What's Changed & Migration, and the cheat sheet last.
- [x] Task 83. Update `web/index.adoc` and root `index.adoc`.
  - [x] Task 83.1. `web/index.adoc`: JSP & Struts bullet after Thymeleaf (ending ", plus a downloadable cheat sheet."), add to `:description:`, append the issue's keyword list to `:keywords:`.
  - [x] Task 83.2. Root `index.adoc`: `:description:` "web-development (including Next.js, Django, Laravel, Thymeleaf, JSP and Struts)", append `JSP, Jakarta Pages, JSTL, Apache Struts` to `:keywords:`. No new tile.
- [x] Task 84. Add one-line back-links (only where the page already discusses the topic; verify each target with `ls`).
  - [x] Task 84.1. `web/thymeleaf/introduction-and-architecture.adoc` (replace the l.501–505 planned sentence with an `xref:`; JSP row l.575–579) and `web/thymeleaf/index.adoc` (remove "#241" from the l.278–280 list and link the section); other Thymeleaf pages that mention JSP/Struts (`spring-mvc-integration`, `forms-and-data-binding`, `expression-utility-objects`) where natural.
  - [x] Task 84.2. `backend/springboot/web-ui-frameworks.adoc` (one-line "JSP (legacy, WAR only)" mention), `backend/architecture/decisions-and-migrations/migration-path-legacy-to-modern-stack.adoc` (l.12, l.156), `backend/oauth/flows-overview.adoc` (l.191), `web/e2e-testing-real-browsers.adoc` (per-framework list).

### Group 17 — Build, validation and review

**Parallelizable: no — depends on every page, the nav and the PDF**

- [x] Task 85. Validate the whole section.
  - [x] Task 85.1. `npm run validate:mermaid` passes (after a one-off `npm i --no-save mermaid@11 jsdom`).
  - [x] Task 85.2. `grep -rn -E '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/web/jsp-struts` returns nothing; the disclaimer is included on all 79 pages (78 + cheat sheet).
  - [x] Task 85.3. Run the CLAUDE.md image checks (block/inline macros closed on one line, no `<p>image::` in `build/site`, unquoted-comma alt check on changed `.adoc` files, every `jsp-struts-*.svg` referenced and every `image::` target present).
  - [x] Task 85.4. Run the CLAUDE.md inline-code substitution check on `build/site/.../web/jsp-struts`; it must print nothing (critical for `${…}`, `#{…}`, `%{…}`, `{1}`, `<%= %>`, EL `->`).
  - [x] Task 85.5. No `xref:` to non-existent pages; no secrets; no book text/figures; `git status` shows no `*.pdf` other than `jsp-struts-cheat-sheet.pdf` and no scratch files.
  - [x] Task 85.6. Every code example has a `Source:` link, every page ends with `== References`, every ★ page has ≥ 1 diagram and a pitfalls table; every cited CVE verified.
  - [x] Task 85.7. Delegate `npx antora antora-playbook.yml` (or the `iru-build-docs` skill) to the `iru-gate-runner` agent; it must report 0 errors / 0 warnings. Spot-check in `build/site`: the nav (JSP & Struts after Thymeleaf), the cheat-sheet download, a Mermaid page, an SVG page, the edited back-link pages.
- [x] Task 86. Run the security scan.
  - [x] Task 86.1. Delegate `iru-check-security` (detect-secrets) to the `iru-gate-runner` agent, including the new untracked files (`git add -N` or an ad-hoc `--all-files` scan). Resolve any finding before archiving.
    - Note: ad hoc `detect-secrets scan --all-files` found 9 hits (all in web/jsp-struts): getting-started.adoc:1234 and jsp/security.adoc:901 CHANGE_ME placeholders, jsp/security.adoc:340 and struts/tags-overview-and-generic-tags.adoc:1434 sample CSP nonces, jsp/security.adoc:1212, jsp/spring-mvc-with-jsp.adoc:889, struts/ui-and-form-tags.adoc:486 password prose, struts/json-plugin-and-ajax.adoc:526 and :569 dummy sample data. All placeholder/test values; no real secret. .secrets.baseline untouched.
