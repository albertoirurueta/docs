# Implementation Plan: Guides & References / Web Development — "JSF (JavaServer Faces)"

## Task summary

Source: GitHub issue #239
Base branch: main

Issue [#239](https://github.com/albertoirurueta/docs/issues/239) adds a **JSF (Jakarta Faces 4.1)** section to Web
Development at `modules/ROOT/pages/web/jsf/`, directly after the Vaadin Reference. It is a practical, example-driven
guide to building Java web applications with Jakarta Faces (Facelets, CDI, Ajax, composite components, PrimeFaces,
OmniFaces, servers, Tomcat + Weld, JoinFaces, Quarkus). It is written from the **official documentation** (Jakarta
Faces 4.1 spec, API/VDL/JS docs, the Jakarta EE Tutorial, Mojarra, MyFaces, PrimeFaces 16, OmniFaces 5 and the other
ecosystem docs). Eight requester-provided books in `~/Desktop/libros/jsf/` are consulted references for concept
coverage, narrative and the bibliography only.

The section ships:

* 62 files under `modules/ROOT/pages/web/jsf/`: `index.adoc` (with `== Bibliography`), 59 concept pages and
  `cheat-sheet.adoc` (the issue counts the 61 outline pages and the cheat sheet separately)
* the one-page A4 PDF `modules/ROOT/attachments/jsf-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/jsf-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/jsf-*.svg` and Mermaid diagrams (at least wherever the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc` and `partials/nav-java.adoc`, plus `web/index.adoc`, `backend/index.adoc` and
  root `index.adoc` text/keywords
* six back-links in existing pages

The issue body is the binding spec: its "Context" tables, "Page outline", "New nav placement", "Cheat sheet",
"Bibliography" and "Acceptance criteria". Every page task must re-read its page's bullets
(`gh issue view 239 --json body -q .body`; a copy may be kept in the session scratchpad) and cover **every** bullet,
plus every row of the "Concepts contributed by the books" table that maps to it.

**Out of scope:** re-documenting existing material (Java, Spring Boot, Hibernate, Docker, OAuth, Vaadin, Web Forms:
link instead). #238, #240, #241, #258, #260 and #263 appear in prose only, never as `xref:`.

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into four PRs. As with #238/#242/#257, everything is
   implemented on `feature/239` and a single draft PR to `main` with `Closes #239` is opened.
2. **Tasks are untagged.** The installed keys are `java`, `java-springboot`, `dotnet` and `database`; they implement
   code with tests and quality gates, while this repository holds only AsciiDoc / Mermaid / SVG / PDF. Tasks are
   implemented directly. The Java/XHTML in the pages is content, but examples are compiled in a scratch app (Task 3).
3. **Books appear only in `== Bibliography`** and in prose on outdated material. No text, listing, figure or sample
   project is copied. The PDFs are never staged; extracted text stays in the session scratchpad.
4. **Disclaimer:** `partials/jsf-disclaimer.adoc` is a single `[IMPORTANT]` block (AI-assistance disclosure plus
   `xref:web/jsf/index.adoc#_bibliography[…]`), same shape as `django-disclaimer.adoc`. No other `NOTE`/`TIP`/
   `WARNING`/`CAUTION`/`IMPORTANT` block anywhere in the section.
5. **Version baseline is re-verified and dated at implementation time** (Group 1). The issue's numbers were checked on
   2026-10-07; Faces 5.0 milestones, Mojarra/MyFaces patch releases, PrimeFaces and OmniFaces move. Faces 5.0 is
   described as "upcoming", never as current behaviour.
6. **Running scenario is the original *Bookshelf*** (the same domain as Django/FastAPI/NestJS/Thymeleaf), built up
   across pages.
7. **Examples use Maven**, `jakarta.*`, CDI `@Named`, the `jakarta.faces.*` URNs, Java 17+/21. Gradle is not shown.
8. **Existing pages get real `xref:`s; pages that don't exist get plain prose.** Every `xref:` target outside the
   section is verified with `ls` before being written. `index.adoc` and `cheat-sheet.adoc` are written last
   (Group 11); nav and back-links come after the pages exist (Group 12).
9. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `jsf-*.svg`. SVGs are original drawings (no
   Jakarta EE/PrimeFaces/OmniFaces logos, spec/docs images or book figures).
10. **Sites that block bots** (Packt, PrimeFaces showcase) are checked in the built-in browser; the PDF is rendered
    with headless Chrome print-to-PDF and verified to be exactly one A4 page.

### Lessons from earlier section reviews: mandatory for every page task

* **Verify every name against its official page before writing it** (tags, attributes, annotations, classes, context
  parameters, Maven coordinates, versions, URLs and spec/tutorial anchors). If the docs don't confirm a detail,
  describe the behaviour without naming it. Re-verify the anchors flagged "auto-generated" in the issue.
* **Security is correctness:** no hardcoded secrets (credentials are placeholders); never reproduce the issue's errata
  list (session-scoped page state, logic in getters, `binding` to session beans, JSTL misuse, careless `immediate`,
  `escape="false"` on user content, state-changing GET, disabled CSRF/view state, unprotected client state).
* **Every concept gets at least one complete example**, each followed by a `Source:` link to the official page it
  derives from; that URL also goes in the page's `== References`. Spec links pin `faces/4.1/`, PrimeFaces links pin
  `16_0_0/`.
* **Every page** follows the issue's "Page conventions": `= Title`, `:description:`, `:keywords:`,
  `include::partial$jsf-disclaimer.adoc[]` right after the header attributes, an intro stating the versions, detailed
  explanation (lifecycle position, Mojarra vs MyFaces, pitfalls), "what changed" per version, "where the books are
  outdated", and `== References`.
* **AsciiDoc hygiene (critical for EL/XHTML):** inline code containing `#{`, `${`, `->`, `...`, `'`, `__`, `*`, `~`,
  `^` or `{` uses a constrained passthrough (`` `+#{bean.name}+` ``); code containing `+` uses `pass:c[…]`. `#{…}`
  inside `[source]` blocks is fine. Use `.Title` captions, leave no authoring notes, no prose line starts with
  `<digits>.`.
* **Images (CLAUDE.md):** block macros on one line starting at column 0, alt text with a comma wrapped in double
  quotes, every SVG referenced by a page, bare filenames.
* **Mermaid:** write `<<interface>>`-style stereotypes and any `<` followed by a letter as entities; every block must
  pass `npm run validate:mermaid`.

## Current code state

* **Repo:** the Antora root component (`antora.yml`, component `ROOT`). Pages are in `modules/ROOT/pages/`, nav in
  `modules/ROOT/nav.adoc`, partials in `modules/ROOT/partials/`, images in `modules/ROOT/images/`, PDFs in
  `modules/ROOT/attachments/` (referenced as `xref:attachment$….pdf[…]`). None of the following exist yet:
  `web/jsf/`, `jsf-disclaimer.adoc`, `jsf-*.svg`, `jsf-cheat-sheet.pdf`.
* **`modules/ROOT/nav.adoc`:** the Vaadin block starts at l.587 (`*** xref:web/vaadin/index.adoc[Vaadin Reference]`)
  and ends with its `**** …cheat-sheet.adoc[Cheat Sheet (PDF)]`, followed by `include::partial$nav-python.adoc[]`.
  `include::partial$nav-java.adoc[]` is currently used at l.34 and l.803 only.
* **`modules/ROOT/partials/nav-java.adoc`:** absolute `***`/`****` depth; its header comment lists two usage sites and
  must list three.
* **Template pages to mirror:** `web/thymeleaf/*` (the most recent comparable section, 42 files), `web/vaadin/*`,
  `web/django/cheat-sheet.adoc` and `web/vaadin/cheat-sheet.adoc` for the cheat-sheet convention,
  `partials/django-disclaimer.adoc` for the disclaimer shape.
* **Existing link targets verified to exist:** `backend/springboot/web-ui-frameworks.adoc`,
  `web/vaadin/spring-boot-integration.adoc`, `web/aspnet/web-forms/index.adoc`, `web/e2e-testing-real-browsers.adoc`,
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`,
  `programming-languages/java/index.adoc`, `backend/index.adoc`, `web/django/index.adoc`.
* **Precedent:** `.archive/implementation_plan_238.md` (Thymeleaf), `_242`, `_257`: same section pattern, one PR.
* **Tooling:** `package.json` (Antora + Mermaid/MathJax extensions), `scripts/validate-mermaid.mjs`
  (`npm run validate:mermaid` after `npm i --no-save mermaid@11 jsdom`).
* **Books:** the eight PDFs exist in `~/Desktop/libros/jsf/`; never staged or committed.

## Conventions every page task must follow

* Page path: `modules/ROOT/pages/web/jsf/<name>.adoc`; exact file names are those in the issue's outline.
* ★ pages are the most detailed in the section (full tag/attribute/API coverage, lifecycle position, pitfalls,
  multiple runnable examples).
* Cross-links between section pages are allowed only to pages that exist by the time the page is written; otherwise
  use plain prose. The landing page and cheat sheet (Group 11) link every page.
* Each page task ends by running the CLAUDE.md greps on its own file (unquoted-comma alt text, unclosed image macros).

## Implementation steps

### Group 1 — Scaffolding and version verification
Parallelizable: yes

- [x] Task 1. Create `modules/ROOT/partials/jsf-disclaimer.adoc`
  - [x] Task 1.1. Single `[IMPORTANT]` block: the AI-assistance sentence from `django-disclaimer.adoc` plus the pointer
    `xref:web/jsf/index.adoc#_bibliography[the section bibliography]`. Nothing else.
- [x] Task 2. Re-verify the version baseline and every official URL/anchor the outline uses
  - [x] Task 2.1. Check Jakarta Faces 4.1 (API 4.1.2), 5.0 milestone, Mojarra, MyFaces, PrimeFaces, PrimeFaces
    Extensions, OmniFaces, JoinFaces/Spring Boot, `myfaces-quarkus`/`quarkus-primefaces`, servers (GlassFish, WildFly,
    Payara, Open Liberty, TomEE, Tomcat/Weld), Arquillian/Selenium/Playwright. Record verified versions and dates in a
    scratchpad `jsf-baseline.md` used by every page task.
  - [x] Task 2.2. Verify the eight publisher pages and companion-code repos (use the built-in browser for
    bot-blocking sites) and the tutorial/spec anchors listed as "re-verify" in the issue.
- [x] Task 3. Build a scratch *Bookshelf* Maven WAR in the scratchpad to compile and run the examples
  - [x] Task 3.1. Skeleton (`pom.xml` with `jakarta.faces-api` provided + Mojarra or MyFaces, `web.xml`,
    `beans.xml`, `faces-config.xml` 4.1) that builds on the local JDK; add examples as pages are written. Examples that
    need a full server (WildFly, Quarkus, JoinFaces) are checked against their docs and, where practical, built.
  - [x] Task 3.2. Keep the scratch app out of the repository.

### Group 2 — Foundations pages
Parallelizable: yes

- [x] Task 4. `introduction-and-history.adoc`: component-based MVC, JSR history, design patterns, when to choose Faces,
  framework comparison table (Vaadin, Web Forms, Thymeleaf/Spring MVC, Struts, GWT, Django, React; verified against
  official sites), 📊 SVG `jsf-history-timeline.svg`
- [x] Task 5. `versions-and-implementations.adoc`: spec vs implementation, Mojarra vs MyFaces, profiles, version matrix,
  per-version new/deprecated/removed (2.0 → 5.0)
- [x] Task 6. ★ `architecture-and-component-model.adoc`: FacesServlet/FacesContext/ExternalContext/Application/UIViewRoot,
  component tree, renderers/render kits, `binding` pitfalls, 📊 SVG `jsf-component-tree.svg`
- [x] Task 7. ★ `request-processing-lifecycle.adoc`: six phases, `immediate`, `renderResponse`/`responseComplete`,
  `PhaseListener`, partial lifecycle, Web Forms comparison, 📊 SVG `jsf-lifecycle.svg` and Mermaid postback sequence
- [x] Task 8. ★ `project-setup.adoc`: Maven WAR, `web.xml` mappings, `beans.xml`, `faces-config.xml`, `@FacesConfig`,
  welcome files, final *Bookshelf* layout, hot reload
- [x] Task 9. `getting-started.adoc`: first app, run on WildFly/GlassFish and Tomcat + Weld, lifecycle walk, Mermaid
  edit-deploy-reload loop

### Group 3 — Facelets and views pages
Parallelizable: yes

- [x] Task 10. ★ `facelets-and-xhtml-views.adoc`
- [x] Task 11. ★ `templating.adoc` (📊 SVG `jsf-template-composition.svg`)
- [x] Task 12. ★ `expression-language.adoc`
- [x] Task 13. `html5-friendly-markup.adoc`
- [x] Task 14. `jstl-and-build-time-vs-render-time.adoc`
- [x] Task 15. `programmatic-facelets.adoc`

### Group 4 — Standard components, conversion and validation pages
Parallelizable: yes

- [x] Task 16. ★ `html-components.adoc`
- [x] Task 17. `core-tags.adoc`
- [x] Task 18. ★ `data-tables-and-iteration.adoc`
- [x] Task 19. `file-upload-and-download.adoc`
- [x] Task 20. ★ `converters.adoc`
- [x] Task 21. ★ `validators.adoc`
- [x] Task 22. ★ `bean-validation.adoc`
- [x] Task 23. `messages-and-i18n.adoc` (English/Spanish bundles)

### Group 5 — Events, navigation, beans and scopes pages
Parallelizable: yes

- [x] Task 24. ★ `events-and-listeners.adoc`
- [x] Task 25. ★ `navigation.adoc` (Mermaid outcomes diagram)
- [x] Task 26. ★ `view-parameters-and-view-actions.adoc`
- [x] Task 27. ★ `backing-beans-and-cdi.adoc`
- [x] Task 28. ★ `scopes.adoc` (📊 SVG `jsf-scopes-timeline.svg`)
- [x] Task 29. `flash-and-post-redirect-get.adoc`
- [x] Task 30. `faces-flows.adoc` (Mermaid state diagram of the borrow-request wizard)

### Group 6 — Ajax, push, composite and custom components pages
Parallelizable: yes

- [x] Task 31. ★ `ajax.adoc` (Mermaid Ajax sequence)
- [x] Task 32. `search-expressions.adoc`
- [x] Task 33. `websocket-push.adoc`
- [x] Task 34. ★ `composite-components.adoc` (star-rating component)
- [x] Task 35. `tag-files-and-tag-libraries.adoc`
- [x] Task 36. ★ `custom-components-and-renderers.adoc`
- [x] Task 37. `client-behaviors.adoc`

### Group 7 — Resources, configuration, advanced topics and security pages
Parallelizable: yes

- [x] Task 38. `resource-handling.adoc` — written (~1200 lines), examples run on Mojarra 4.1.17/MyFaces 4.1.4; checks clean
- [x] Task 39. `resource-library-contracts.adoc` — written (951 lines, Mermaid flowchart, multi-tenant theming); checks clean
- [x] Task 40. ★ `configuration-and-project-stages.adoc` — written (2816 lines, 3 Mermaid); checks clean
- [x] Task 41. ★ `state-saving-and-stateless-views.adoc` (📊 SVG `jsf-state-saving.svg`) — written (~1450 lines) + `jsf-state-saving.svg`, Mermaid sequence; checks clean
- [x] Task 42. ★ `exception-handling.adoc` — written (1540 lines, 2 Mermaid); checks clean
- [x] Task 43. `extending-faces.adoc` — written (1256 lines, Mermaid chain); checks clean
- [x] Task 44. `multi-window-support.adoc` — written (1076 lines, Mermaid sequence); checks clean
- [x] Task 45. `performance.adoc` — written (1591 lines, xref to backend/springboot/performance-testing-jmeter.adoc); checks clean
- [x] Task 46. ★ `security.adoc` — written (1930 lines, 2 Mermaid, placeholder credentials only, detect-secrets clean); checks clean

### Group 8 — Component library pages
Parallelizable: yes

- [x] Task 47. ★ `primefaces-getting-started-and-themes.adoc` — written (1473 lines, 2 Mermaid); checks clean
- [x] Task 48. ★ `primefaces-ajax-forms-and-validation.adoc` — written (~2600 lines, generated from scratch tpl via gen.py); checks clean
- [x] Task 49. ★ `primefaces-data-components.adoc` — written (2034 lines, 1 Mermaid, JPA LazyDataModel run on Hibernate+H2); checks clean
- [x] Task 50. `primefaces-panels-menus-and-dialogs.adoc` — written (1683 lines); checks clean
- [x] Task 51. `primefaces-files-media-charts-and-drag-drop.adoc` — written (1893 lines, 2 Mermaid); checks clean
- [x] Task 52. `primefaces-extensions.adoc` — written (~1900 lines); checks clean
- [x] Task 53. ★ `omnifaces.adoc` — written (2513 lines, 1 Mermaid); checks clean
- [x] Task 54. `other-component-libraries.adoc` — written (1457 lines); checks clean

### Group 9 — Integration, testing, production and migration pages
Parallelizable: yes

- [x] Task 55. `jakarta-ee-servers.adoc` — written; disclaimer, `== References`, no admonitions, image greps clean (no figures).
- [x] Task 56. ★ `tomcat-and-weld.adoc` — 1466 lines; BeanManager context.xml binding in depth (#beanmanager); Mojarra+MyFaces run on Tomcat 11.0.26/Weld 6.0.4, Jetty 12.1.14, embedded Tomcat; 3 Mermaid; greps clean.
- [x] Task 57. ★ `spring-boot-with-joinfaces.adoc` (link `backend/springboot/web-ui-frameworks.adoc`) — 1564 lines; JoinFaces 6.1.1 runs (Mojarra/MyFaces, PF16, Spring Security, WAR); xref backend/springboot/web-ui-frameworks; greps clean.
- [x] Task 58. `quarkus.adoc` — 1210 lines; myfaces-quarkus 4.1.4 runs (PF, OmniFaces, uber-jar; native not built, flagged); greps clean.
- [x] Task 59. `persistence-and-services.adoc` — 2057 lines; Tomcat+Weld+Hibernate 7.4 and WildFly 41 (JTA/EJB/Jakarta Data) runs; greps clean.
- [x] Task 60. ★ `testing.adoc` — 3027 lines; 56 tests run (JUnit/Mockito, MyFaces Test, Arquillian TomEE, Selenium, Playwright, HtmlUnit, PF Selenium); greps clean.
- [x] Task 61. `deployment-and-clustering.adoc` (📊 SVG `jsf-clustered-deployment.svg`) — 1734 lines; two-node Tomcat cluster runs; jsf-clustered-deployment.svg fixed in place and referenced; greps clean.
- [x] Task 62. ★ `migrating-to-jakarta-faces.adoc` (collects every outdated book statement from Context) — 2257 lines; Eclipse Transformer and OpenRewrite run on a legacy app; consolidated #books (tomcat-and-weld and best-practices summaries missing, for Group 10); greps clean.
- [x] Task 63. `best-practices.adoc` (checklist linking each item to its page, plus the errata) — 930-line checklist; xrefs every section page incl. Group 9 siblings, #plugging-in/#choosing reused, errata in #avoid; snippets run on Tomcat+Weld (Mojarra/MyFaces); greps clean.

### Group 10 — Coverage audit before the landing page
Parallelizable: yes

- [x] Task 64. Audit coverage against the issue — 59 pages audited in place (8 agents): ~250 Javadoc/VDL/spec URLs rewritten to exact-case .html (all 335+ jakarta.ee URLs 200), spec anchors remapped to subsections, cross-section xrefs added (all resolve), known contradictions fixed; mermaid 64/64, image/admonition greps clean
  - [x] Task 64.1. Every Jakarta EE Tutorial Faces chapter, every Faces 4.1 spec chapter, 4.0/4.1 changes, planned 5.0
    changes and every row of the books' concept table maps to at least one page; fill gaps in the owning page.
  - [x] Task 64.2. Check each page against the "Page conventions": disclaimer include, versions intro, `== References`,
    `Source:` after every code example, no extra admonitions (`grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'`).
  - [x] Task 64.3. Every ★ page is more detailed than non-★ pages; every 📊 has a figure.

### Group 11 — Landing page, bibliography and cheat sheet
Parallelizable: yes

- [x] Task 65. `index.adoc`: what Faces is, audience, version baseline, *Bookshelf* scenario, reading path,
  `== What's covered` by group, "related material elsewhere" table, `== Bibliography` (every source, each linked to
  its official site; books with authors, title, edition, publisher, year, ISBN, publisher page and companion code), SVG
  `jsf-bookshelf-architecture.svg` and a Mermaid mind-map — written (~520 lines): links all 60 section pages, 13-row related table (all xrefs verified), `== Bibliography` (auto id `_bibliography`; 8 books with corrected Wiley URL, spec/tutorial/Mojarra/MyFaces, related specs, ecosystem, standards; bibliography URLs HTTP-checked 2026-10-08), new `jsf-bookshelf-architecture.svg`, Mermaid mind-map; mermaid 65/65, image/comma/admonition greps clean
- [x] Task 66. `cheat-sheet.adoc` following `web/django/cheat-sheet.adoc`: disclaimer, intro with
  `xref:attachment$jsf-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` paragraphs with `xref:` to every page,
  final download line, `== References` — written; xrefs every section page + index; greps clean
- [x] Task 67. `modules/ROOT/attachments/jsf-cheat-sheet.pdf`
  - [x] Task 67.1. Throwaway HTML (scratchpad), dense multi-column colour-coded A4 page covering every box listed in the
    issue, version and date in the header.
  - [x] Task 67.2. Render with headless Chrome print-to-PDF; verify exactly one page; commit only the PDF. — `jsf-cheat-sheet.pdf` 1 page, 595×842 pt (pypdf); HTML kept in session scratchpad only

### Group 12 — Site wiring and back-links
Parallelizable: yes

- [x] Task 68. Nav: `modules/ROOT/nav.adoc` and `partials/nav-java.adoc`
  - [x] Task 68.1. Insert `include::partial$nav-java.adoc[]` immediately before the Vaadin entry.
  - [x] Task 68.2. Insert `*** xref:web/jsf/index.adoc[JSF (JavaServer Faces)]` with all `****` children in outline order
    (cheat sheet last) after the Vaadin cheat sheet and before `include::partial$nav-python.adoc[]`.
    Done: 61 `****` children in the index.adoc "What's covered" order, inserted right after the Vaadin cheat sheet
    (Thymeleaf, merged after the issue was written, now follows JSF and precedes nav-python).
  - [x] Task 68.3. Update `nav-java.adoc`'s header comment to list all three usage sites.
  Files: `nav.adoc`, `partials/nav-java.adoc`; every jsf xref target exists and each of the 62 `web/jsf/*.adoc` appears
  exactly once.
- [x] Task 69. Index pages
  - [x] Task 69.1. `web/index.adoc`: Java Reference and JSF bullets (JSF ends ", plus a downloadable cheat sheet."),
    `:description:`, `:keywords:` as specified.
  - [x] Task 69.2. `backend/index.adoc`: one cross-link line plus `JSF, Jakarta Faces, JoinFaces` keywords.
  - [x] Task 69.3. Root `modules/ROOT/pages/index.adoc`: append `JSF, Jakarta Faces, PrimeFaces` to `:keywords:`.
  Files: `web/index.adoc`, `backend/index.adoc`, `index.adoc`.
- [x] Task 70. One-line back-links (no content duplicated)
  - [x] Task 70.1. `programming-languages/java/index.adoc`
  - [x] Task 70.2. `backend/springboot/web-ui-frameworks.adoc` (`== JSF via JoinFaces (legacy)`; keep its `IMPORTANT` block)
  - [x] Task 70.3. `web/vaadin/spring-boot-integration.adoc` (~l.160)
  - [x] Task 70.4. `web/aspnet/web-forms/index.adoc`
  - [x] Task 70.5. `web/e2e-testing-real-browsers.adoc`
  - [x] Task 70.6. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (UI table, ~l.462)
  Files: the six pages above (one sentence or one table row each; the IMPORTANT block in web-ui-frameworks kept).

### Group 13 — Build, validation and review
Parallelizable: no — Task 72 depends on the build produced by Task 71

- [x] Task 71. Build and verify
  - [x] Task 71.1. `npm install` if needed, `npx antora antora-playbook.yml`: no `xref`/AsciiDoc errors or warnings.
  - [x] Task 71.2. Run the three CLAUDE.md image greps, the unquoted-comma alt-text grep on `web/jsf/*.adoc`, and the
    inline-code substitution grep on `build/site/…/web/jsf`; all must print nothing.
  - [x] Task 71.3. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid`: every diagram parsed.
  - [x] Task 71.4. Confirm every `jsf-*.svg` is referenced, every `image::` target exists, no `xref:` targets a missing
    page, and the sidebar/nav renders in `build/site`.
  - [x] Task 71.5. Inspect representative pages in the built-in browser (lifecycle, templating, cheat sheet).
- [x] Task 72. Final checks
  - [x] Task 72.1. `git status`: no book PDF or scratch app staged; `modules/ROOT/.DS_Store` not committed.
  - [x] Task 72.2. Run `iru-check-security` on the changed files (delegate to the `iru-gate-runner` agent).
  - [x] Task 72.3. Tick the issue's acceptance criteria against the result.

  Result (2026-10-08): Antora build exit 0 with 0 warnings/errors (4 warnings fixed in place: two list-item year
  wraps in index.adoc, unprotected `{map}`/`{action}` attribute references, one inline-code `#{` pair in
  architecture-and-component-model.adoc). All CLAUDE.md image and inline-code greps print nothing for web/jsf;
  1497 Mermaid diagrams parse; all 11 jsf-*.svg referenced and every image target exists; nav renders 61 children;
  lifecycle, templating, index and cheat-sheet pages inspected in the browser (figures, Mermaid, #_bibliography, PDF).
  Security: project-wide baseline scan 0 new/unaudited; --all-files scan of new/changed files 0 findings.
  Acceptance criteria: all met (62 files incl. index and cheat sheet; disclaimer on 62 pages; 0 other admonitions;
  `== References` on 62 pages; 1-page A4 PDF; back-links in 6 pages; nothing staged). Do not commit the untracked
  modules/ROOT/.DS_Store or the stray modules/ROOT/pages/web/jsf/omni/ (Beans.class) directory.
