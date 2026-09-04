# Implementation Plan: Web Development / Vaadin Reference

## Task summary

Source: GitHub issue #43

Issue [#43](https://github.com/albertoirurueta/docs/issues/43) ("Vaadin Reference") asks to add a new
**"Vaadin Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/vaadin/` — a 12th sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, `web/react/`, `web/angular/`, `web/aspnet/`,
`web/tailwind/`, `web/typescript/`, and `web/vue/`.

It documents the **current Vaadin release line** (Vaadin 24 LTS / 25.x, Spring Boot 3 / Jakarta EE 10, Java
17+) as published at https://vaadin.com/docs/latest/ — the server-driven architecture and the client–server
round trip; the two programming models (**Flow**, Java UI; **Hilla**, React/Lit + TypeScript against type-safe
Java endpoints); the component model and the 40+ built-in components; layouts; input fields and `Binder` data
binding with conversion/validation; `Grid` (in-memory and lazy `DataProvider`); forms, CRUD and master-detail;
`@Route` routing and the navigation lifecycle; interaction components and overlays; `@Push` server push and
`UI.access()`; the `Element` API and web-component integration; custom components and add-ons; Hilla/React
views; Lumo/Aura theming and `::part()` styling; responsive design and PWA; Spring Boot, Jakarta EE/CDI,
persistence and REST integration; security (`VaadinWebSecurity`, route annotations); TestBench testing;
production build and deployment; configuration and dev tooling; the advanced Flow surface — **plus** a
`ui-component-libraries.adoc` page (open-source first, commercial Pro/Prime last) **plus** a one-page
downloadable PDF cheat sheet.

Explanations must be brief and example-driven, every concept must carry at least one runnable example and at
least one link to the specific https://vaadin.com/docs/latest/… page, and `[mermaid]` diagrams and/or
hand-authored inline SVG figures are used where they clarify a concept.

Three PDF books were consulted while planning this section, and each is cited **only as a bibliography
entry**, never as the "primary" or "main" reference (matching the ASP.NET / Angular / Tailwind / TypeScript /
MongoDB / Vue disclaimers' "third variant" wording, and unlike the jQuery / React ones):

- `~/Desktop/book1.pdf` — *Practical Vaadin: Developing Web Applications in Java*, Alejandro Duarte, **Apress
  (Springer Nature)**, first edition August 2021, ISBN 978-1-4842-7178-0 (print) / 978-1-4842-7179-7
  (electronic), DOI 10.1007/978-1-4842-7179-7, ~334 pp / 13 chapters in four parts. The only one of the three
  on the **modern Flow** architecture; targets roughly the Vaadin **14 → 20** line. Publisher page:
  https://link.springer.com/book/10.1007/978-1-4842-7179-7 ; publisher home: https://www.apress.com/ ;
  O'Reilly listing: https://www.oreilly.com/library/view/practical-vaadin-developing/9781484271797/ ;
  code bundle: https://github.com/Apress/practical-vaadin
- `~/Desktop/book2.pdf` — *Learning Vaadin 7*, **Second edition**, Nicolas Fränkel, **Packt Publishing**,
  September 2013, ISBN 978-1-78216-977-2, ~436 pp / 10 chapters. Documents **Vaadin 7 (pre-Flow)**. Publisher
  page: https://www.packtpub.com/product/learning-vaadin-7-second-edition/9781782169772 ; publisher home:
  https://www.packtpub.com/ ; O'Reilly listing: https://www.oreilly.com/library/view/learning-vaadin-7/9781782169772/
- `~/Desktop/book3.pdf` — *Vaadin 7 UI Design By Example: Beginner's Guide*, Alejandro Duarte, **Packt
  Publishing**, July 2013, ISBN 978-1-78216-226-1 (print) / 978-1-78216-227-8 (ebook), ~246 pp / 8 chapters.
  Documents **Vaadin 7 (pre-Flow)**. Publisher page:
  https://www.packtpub.com/en-gb/product/vaadin-7-ui-design-by-example-beginners-guide-9781782162278 ;
  publisher home: https://www.packtpub.com/ ; O'Reilly / Packt subscription listing:
  https://subscription.packtpub.com/book/business-and-other/9781782162261/

https://vaadin.com/docs/latest/ is the source every page is written and verified against. **Book 1 trails the
current Vaadin 24/25 line** (it says *Fusion*, since renamed **Hilla** and now React-first; it predates
`VaadinWebSecurity`, the Lumo/Aura/Base theming split, `LumoUtility` + Tailwind utility classes,
`VaadinExecutor`, `start.vaadin.com`, Vaadin Copilot, and the current TestBench unit-testing API). **Books 2
and 3 document Vaadin 7 / the pre-Flow "Framework", whose APIs were replaced wholesale in Vaadin 10+** — they
inform only the *conceptual* topic list and ordering. Where a book and the current docs disagree, **the
official documentation wins** and the difference is noted. Documentation prose must be written as original
explanation verified against https://vaadin.com/docs/latest/, **not** presented as derived from the books; the
books appear only in `== Bibliography` and the disclaimer's "consulted while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, Tailwind, TypeScript, and Vue.js reference sections. The closest precedents are
[.archive/implementation_plan_39.md](.archive/implementation_plan_39.md) (issue #39, "Vue.js Reference" — same
three `~/Desktop/bookN.pdf` paths, books bibliography-only, "third variant" disclaimer, mermaid + SVG,
`== Bibliography`, headless-Chrome one-page PDF cheat sheet, and the exact four-group structure reused below),
[.archive/implementation_plan_41.md](.archive/implementation_plan_41.md) (issue #41, "Vue.js Reference: UI
Component Libraries page" — the shape of Task 27), and
[.archive/implementation_plan_31.md](.archive/implementation_plan_31.md) (issue #31, "ASP.NET Reference" — the
other single-vendor, server-driven section with its own UI-component-libraries page).

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **Document the current Vaadin release line as published at https://vaadin.com/docs/latest/**, not pinned to
   a patch version — Vaadin 24 LTS / 25.x, Java 17+, Spring Boot 3 / Jakarta EE 10. Examples use modern
   idioms: `com.vaadin.flow.component.*`, `@Route`, `Binder` / `BeanValidationBinder`, `Grid` with
   `setItems(...)` or a lazy `DataProvider`, `VaadinWebSecurity`, `UI.access(...)`, `@Theme` + Lumo custom
   properties, `@BrowserCallable` for Hilla.
2. **Vaadin 7 / pre-Flow APIs never appear as current code.** Where a concept carried forward from books 2–3
   is documented, the page shows the **modern** API and, at most, a one-line "in Vaadin 7 this was `Table` /
   `Container` / `Navigator`" contrast. A consolidated Vaadin 7 → Flow mapping strip goes on the cheat sheet
   only.
3. **Flow is the default authoring style in every example.** Hilla / React + TypeScript gets one dedicated
   page (Task 15) and appears elsewhere only where a concept has a materially different Hilla form (security,
   forms, component libraries), always clearly labelled. Hilla is **not** expanded into its own multi-page
   cluster.
4. **Page breakdown: 26 content pages + 1 cheat sheet + 1 section index (28 `.adoc` files).** Issue #43's
   27-item page list is followed **exactly, with no merges** — unlike the Vue plan, the issue's list is already
   consolidated and no two entries overlap enough to justify folding. Every concept the issue lists is covered
   and reachable from `index.adoc` and `nav.adoc`.
5. **All three books are bibliography-only.** Neither the disclaimer nor any per-page admonition may describe
   any book as the primary or main reference; they appear only as `== Bibliography` entries and in the
   disclaimer's "consulted while preparing these pages" clause.
6. **The subsection is named "Vaadin Reference"** in the section index title, the `web/index.adoc` bullet, the
   `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings.
7. **Placed last**, after Vue.js Reference, in `nav.adoc` (currently ending
   `**** xref:web/vue/cheat-sheet.adoc[Cheat Sheet (PDF)]`), `web/index.adoc` (Vue bullet last in
   `== Sections`), and the root `index.adoc` (`== Guides & References` list, Vue bullet last) — the same
   "append in the order added" ordering every prior subsection followed.
8. **Source-block style follows the other guides** — no `source-highlighter` handling or build-time
   highlighter verification. Use `[source,java]` for Flow, `[source,ts]` / `[source,tsx]` for Hilla / React /
   Lit, `[source,html]` for templates, `[source,css]` for theme CSS, `[source,xml]` for `pom.xml`,
   `[source,properties]` for `application.properties`, `[source,bash]` for CLI, `[source,json]` for config
   fragments, `[source,console]` for build/test output — exactly as the existing `web/**` pages do.
9. **Mermaid is the default for flow/pipeline/sequence/state diagrams; six hand-authored SVGs** where a spatial
   figure is clearer than a flowchart (all under `modules/ROOT/images/`, named `vaadin-*.svg`, following the
   existing `react-one-way-data-flow.svg` / `aspnet-blazor-hosting-models.svg` / `vue-*.svg` convention,
   legible in both light and dark site themes): `vaadin-client-server-round-trip.svg`,
   `vaadin-flow-vs-hilla.svg`, `vaadin-app-layout.svg`, `vaadin-grid-data-sources.svg`,
   `vaadin-theme-layering.svg`, `vaadin-deployment-architecture.svg`. Mermaid covers: the `Binder` read →
   validate → write flow, the navigation lifecycle, the `@Push` background-thread sequence, the dev-vs-
   production build pipeline, and the UI-library decision aid. The implementer may add further small
   `vaadin-*.svg` figures while writing a page if one adds real value — not pre-planned as separate tasks. No
   diagram where a short code block or small table is clearer.
10. **Cross-reference existing pages instead of duplicating them** — `xref:web/aspnet/index.adoc[]` for a
    one-line server-driven contrast, `xref:web/react/index.adoc[]` / `xref:web/typescript/index.adoc[]` from
    the Hilla page, `xref:web/tailwind/index.adoc[]` / `xref:web/sass/index.adoc[]` from theming,
    `xref:database/sql/index.adoc[]` / `xref:database/mongodb/index.adoc[]` from persistence,
    `xref:web/cors.adoc[]` and `xref:web/accessibility.adoc[]` from security / accessibility.
11. **No project-picker icon/xref** for Vaadin Reference — like the other Web Development subsections it lives
    only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.
12. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    static checked-in asset at `modules/ROOT/attachments/vaadin-cheat-sheet.pdf`, linked via
    `xref:attachment$vaadin-cheat-sheet.pdf[Download the Vaadin Cheat Sheet (PDF)]`. Must be **exactly one A4
    page** (page-count check + a rendered preview with no clipping). No HTML source is kept in the repo — only
    the rendered PDF is committed.
13. **Third-party add-on licences are verified, not assumed.** Issue #43 marks several add-on licences
    "confirm on the repo" (SO-Charts, ApexCharts for Flow, Vaadin ChartJs, the Flowing Code family). Task 27
    must check each project's actual `LICENSE` / Directory listing before stating a licence, and drop or
    re-label any entry whose licence or Vaadin-24/25 compatibility can't be confirmed rather than guessing.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml), component `name: ROOT`, `title: Irurueta Docs`), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under `modules/ROOT/pages/`. The only
  verification is a clean `npx antora antora-playbook.yml` build (no lint/test suite; `build/` is gitignored).
  Installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none applies**; every task
  below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left **untagged**.
- **Web Development** ([modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc)) currently lists
  two standalone pages (`web/cors.adoc`, `web/accessibility.adoc`) then eleven subsections ending in **Vue.js
  Reference**. All follow one structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` / `====` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block plus one blank line.
    [modules/ROOT/partials/aspnet-disclaimer.adoc](modules/ROOT/partials/aspnet-disclaimer.adoc),
    `vue-disclaimer.adoc`, `typescript-disclaimer.adoc`, `angular-disclaimer.adoc`, `tailwind-disclaimer.adoc`,
    and `mongodb-disclaimer.adoc` are the **"third variant"** to follow: the official site is the reference the
    pages are written and verified against; the book(s) are named **only as bibliography entries**, not the
    primary source, and are noted to predate the current version.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph. Body uses `[source,…]` blocks
    fenced by `----`, `[mermaid]` blocks for diagrams, and
    `image::<name>.svg[alt,width=…,role=text-center]` for figures (see
    `modules/ROOT/pages/web/vue/getting-started.adoc`,
    `modules/ROOT/pages/web/react/getting-started.adoc`, and
    `modules/ROOT/pages/web/aspnet/dependency-injection.adoc` for the exact idiom).
  - A section `index.adoc` opening with the disclaimer and a short intro + "where to start" pointer, then a
    grouped `== What's covered` section `xref:`-linking every page with a one-line blurb, ending in a
    `== Bibliography` section (see
    [modules/ROOT/pages/web/vue/index.adoc](modules/ROOT/pages/web/vue/index.adoc) and
    `modules/ROOT/pages/web/aspnet/index.adoc` for the exact format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (14 today, incl. `vue-cheat-sheet.pdf`). **No HTML source for
    these PDFs is kept in the repo** — only the rendered PDF is committed.
  - A `ui-component-libraries.adoc` page exists in two siblings —
    [modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc](modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc)
    and [modules/ROOT/pages/web/vue/ui-component-libraries.adoc](modules/ROOT/pages/web/vue/ui-component-libraries.adoc)
    — both shaped `== Styling options` → `== Component libraries -- free and open-source` (a
    `=== <Name> (<LICENSE>)` sub-section per library, each with an install `[source,bash]` block **and** a usage
    snippet) → `== Commercial suites -- paid / licensed` (**no** code examples) → `== Accessibility`.
    `web/angular/styling-and-ui-libraries.adoc` (~390 lines) is the most thorough example.
  - [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) lists `Web Development` (`**` under `* Guides & References`)
    with each subsection (`***`) and its own detail pages (`****`). The **Vue.js Reference block is currently
    last**, ending the file at `**** xref:web/vue/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    lists Web Development with its subsections nested one level under it (`**`), **Vue.js Reference last**
    (bullet at line 120).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used in this
  repo), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute is set; existing pages
  use `[source,java]`-style lexers and render fine. `modules/ROOT/images/` holds the existing hand-authored
  `*.svg` figures; `modules/ROOT/attachments/` holds the cheat-sheet PDFs.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` / `_25.md` / `_27.md` / `_29.md` / `_31.md` /
  `_33.md` / `_35.md` / `_39.md`): inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora
  attribute reference and emits a "skipping reference to missing attribute" build **warning**. For Vaadin prose
  this bites on annotation arguments (`@RolesAllowed(\{"ADMIN"})`), Lit template literals, JSON/JS object
  literals, and lambda bodies quoted inline. **Escape any literal braces in prose as `\{ … }`.** Inside
  `[source,…]` blocks **no escaping is needed**. Angle brackets (`Binder<T>`, `Grid<Person>`, `Flux<T>`) and
  square brackets in prose are fine unescaped. The final build (Task 32) must come back with **zero** such
  warnings.
- **New file map** this plan creates under `modules/ROOT/pages/web/vaadin/` (all `.adoc`, 28 files):
  `getting-started.adoc`, `architecture.adoc`, `components-overview.adoc`, `layouts.adoc`,
  `input-components.adoc`, `data-binding.adoc`, `grid.adoc`, `forms-crud-and-master-detail.adoc`,
  `routing-and-navigation.adoc`, `interaction-and-overlays.adoc`, `server-push.adoc`,
  `element-api-and-web-components.adoc`, `custom-components.adoc`, `hilla-and-react-views.adoc`,
  `theming-and-styling.adoc`, `responsive-design-and-pwa.adoc`, `spring-boot-integration.adoc`,
  `jakarta-ee-and-cdi.adoc`, `data-persistence.adoc`, `rest-and-services.adoc`, `security.adoc`,
  `testing.adoc`, `production-and-deployment.adoc`, `configuration-and-dev-tools.adoc`,
  `advanced-topics.adoc`, `ui-component-libraries.adoc`, `cheat-sheet.adoc`, `index.adoc`.
  Plus `modules/ROOT/partials/vaadin-disclaimer.adoc`, six hand-authored SVGs under `modules/ROOT/images/`
  (`vaadin-client-server-round-trip.svg`, `vaadin-flow-vs-hilla.svg`, `vaadin-app-layout.svg`,
  `vaadin-grid-data-sources.svg`, `vaadin-theme-layering.svg`, `vaadin-deployment-architecture.svg`),
  `modules/ROOT/attachments/vaadin-cheat-sheet.pdf`, and edits to
  [modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc),
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), and
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc).

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then a
  blank line, then `include::partial$vaadin-disclaimer.adoc[]`, then a blank line, then a one/two-sentence lead
  paragraph — identical placement to `include::partial$vue-disclaimer.adoc[]` in
  `modules/ROOT/pages/web/vue/getting-started.adoc`.
- **Brief and concise** prose. **Every concept gets at least one runnable example** — `[source,java]` for Flow,
  otherwise `[source,ts]` / `[source,tsx]` / `[source,html]` / `[source,css]` / `[source,xml]` /
  `[source,properties]` / `[source,bash]` / `[source,json]` / `[source,console]` as appropriate.
- **Every concept links to the specific https://vaadin.com/docs/latest/… page** for it (inline
  `https://vaadin.com/docs/latest/…[link text]`), not just a generic "see the Vaadin docs". Integration pages
  additionally link the relevant Spring / CDI / Hilla / TestBench sub-page.
- Flow (server-side Java) is the default authoring style in every example; Hilla / React + TypeScript appears
  only on Task 15's page and where a concept differs materially, always clearly labelled.
- No Vaadin 7 / pre-Flow API is presented as current code; at most a one-line legacy contrast.
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Admonitions and prose must **not** present any of the three books as the main/primary reference — they appear
  only in `== Bibliography` and the disclaimer partial. Prose is original explanation verified against
  https://vaadin.com/docs/latest/.
- Diagrams via `[mermaid]` blocks; figures via `image::vaadin-*.svg[alt,width=…,role=text-center]` with the SVG
  hand-authored under `modules/ROOT/images/`, readable in both light and dark themes.
- Cross-link the sibling `web/**` and `database/**` pages listed in choice 10 rather than restating their
  content.
- The full per-page concept checklist and official-link list is in issue #43's "Pages to create" section — each
  task below references its issue page number; implement every bullet the issue lists for that page.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Vaadin disclaimer partial — `modules/ROOT/partials/vaadin-disclaimer.adoc`
  - Files touched: `modules/ROOT/partials/vaadin-disclaimer.adoc` (new). No tests (docs-only repo, no test
    suite). Verification: `npx antora antora-playbook.yml` completes with exit 0 and zero warnings/errors.
  - Done: created `modules/ROOT/partials/vaadin-disclaimer.adoc` — `[IMPORTANT]` / `====` admonition matching
    the third-variant wording of `vue-disclaimer.adoc`, `aspnet-disclaimer.adoc` and `tailwind-disclaimer.adoc`;
    states the current Vaadin 24 LTS / 25.x line (Java 17+, Spring Boot 3 / Jakarta EE 10), Flow as the
    authoring style with Hilla/React shown where it differs, Vaadin 7 only as migration contrast, the AI-assisted
    generation notice, and the three bibliography books (none as primary reference, all predating the current
    line). No tests (docs-only repo). Full Antora build deferred to Task 32.
  - [x] Task 1.1. Create `modules/ROOT/partials/vaadin-disclaimer.adoc` as an `[IMPORTANT]` admonition
    (`[IMPORTANT]` then `====` … `====`) following the shape of
    `modules/ROOT/partials/aspnet-disclaimer.adoc` and `modules/ROOT/partials/vue-disclaimer.adoc`. It must
    state:
    - this section documents **the current Vaadin release line** (Vaadin 24 LTS / 25.x, Java 17+, Spring Boot 3
      / Jakarta EE 10) as published at https://vaadin.com/docs/latest/[the official Vaadin documentation],
      **which is the reference these pages are written and verified against**; no specific patch version is
      pinned; **Flow (server-side Java) is the authoring style used throughout**, with Hilla / React shown where
      it differs; **Vaadin 7 and the pre-Flow architecture appear only as migration contrast**;
    - the content was generated with the assistance of AI and should be verified against
      https://vaadin.com/docs/latest/ before being relied on in production, since Vaadin ships major releases
      roughly twice a year and its ecosystem iterates;
    - *Practical Vaadin* (Alejandro Duarte, Apress, 2021), *Learning Vaadin 7*, 2nd ed. (Nicolas Fränkel, Packt,
      2013) and *Vaadin 7 UI Design By Example* (Alejandro Duarte, Packt, 2013) are **listed in this section's
      bibliography** and were consulted while preparing these pages — worded so it does **not** state or imply
      any book is the primary or main reference — and that *Practical Vaadin* predates the current Vaadin 24/25
      line while the two 2013 books document the **obsolete Vaadin 7 API**, so on any discrepancy the official
      documentation at https://vaadin.com/docs/latest/ wins and the difference is noted.
  - [x] Task 1.2. Confirm it is included via `include::partial$vaadin-disclaimer.adoc[]` on every page created
    in Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` /
    `:keywords:` block and one blank line — identical syntax/placement to
    `include::partial$vue-disclaimer.adoc[]` in `modules/ROOT/pages/web/vue/getting-started.adoc`. Record the
    exact opening shape for Groups 2–4:
    1. `= <Page Title>`
    2. `:description: <one-line description>`
    3. `:keywords: <comma-separated keywords>`
    4. one blank line
    5. `include::partial$vaadin-disclaimer.adoc[]` (verbatim, its own line, flush left, no attributes)
    6. one blank line
    7. page body begins
    - Confirmed against `modules/ROOT/pages/web/vue/getting-started.adoc` (lines 1–7): `= Getting Started` /
      `:description:` / `:keywords:` / blank line / `include::partial$vue-disclaimer.adoc[]` / blank line / body.
      Groups 2–4 pages must reproduce this shape verbatim with `partial$vaadin-disclaimer.adoc`.

### Group 2 — Content pages

**Parallelizable: yes** — 26 independent pages (Tasks 2–27). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` / `database/**` pages and the other new pages in this plan (cross-links
between the new pages are fine to write now — every target is listed in this plan and validated together in
Task 32), but **none depends on another new page's content**. Each page follows the "Conventions" section
above and implements every bullet the referenced issue #43 page lists. Six tasks also create a hand-authored
SVG as a sub-task.

#### Fundamentals

- [x] Task 2. Create `modules/ROOT/pages/web/vaadin/getting-started.adoc` (issue #43 page 1; book 1 ch. 1–2;
  book 2 ch. 1–3; book 3 ch. 1)
  - Files touched: `modules/ROOT/pages/web/vaadin/getting-started.adoc` (new, ~216 lines). No tests (docs-only
    repo). Full Antora build deferred to Task 32.
  - Done: server-driven Java framework intro; Flow + Hilla in one project; Web Components on the browser side;
    editions (Apache-2.0 core vs commercial components + Kits — the live pricing page now names the paid tiers
    *Pro* and *Enterprise*, and Collaboration Kit is currently Apache-2.0, both reflected accurately);
    project creation via start.vaadin.com, Spring Initializr and the Maven archetype; project structure
    (`src/main/java`, `src/main/frontend`, `pom.xml`, `application.properties`); `mvn spring-boot:run`,
    development mode and Vaadin Copilot; Vaadin 24 LTS (Java 17 / Spring Boot 3 / Jakarta EE 10) vs 25 (Java 21 /
    Spring Boot 4 / Jakarta EE 11) baseline per the upgrading guide. Contains `[source,bash]`, `[source,java]`,
    `[source,xml]` (+ `[source,properties]` and a listing tree). Header/disclaimer placement matches
    `web/vue/getting-started.adoc`; no literal braces in prose.
  - Link substitution: `https://vaadin.com/docs/latest/flow/overview` 404s -> replaced with
    `https://vaadin.com/docs/latest/flow/what-is-flow` ("What is Flow?") plus `https://vaadin.com/docs/latest/flow`.
    All other required links (`getting-started`, `getting-started/quick-start`, `start.vaadin.com`, `pricing`)
    verified live.
  - [x] Task 2.1. Implement every bullet issue #43 page 1 lists: Vaadin as a server-driven Java web framework;
    the **Flow** and **Hilla** models sharing one project; Web Components on the browser side; **editions** —
    Apache-2.0 open-source core vs. commercial **Pro / Prime** components and Kits (what is and isn't free);
    creating a project via https://start.vaadin.com/, the Spring Boot starter and the Maven archetype; project
    structure (`src/main/java`, `src/main/frontend`, `pom.xml`, `application.properties`); running with
    `mvn spring-boot:run`; dev mode and Vaadin Copilot; the Vaadin **24 LTS vs 25** and Java / Spring Boot /
    Jakarta baseline. `[source,bash]` + `[source,java]` + `[source,xml]`. -- Done.
  - [x] Task 2.2. Links: at least https://vaadin.com/docs/latest/getting-started ,
    https://vaadin.com/docs/latest/getting-started/quick-start , https://start.vaadin.com/ ,
    https://vaadin.com/docs/latest/flow/overview , https://vaadin.com/pricing . -- Done; `flow/overview`
    substituted with `flow/what-is-flow` (+ `flow`), all others verified live.

- [x] Task 3. Create `modules/ROOT/pages/web/vaadin/architecture.adoc` (issue #43 page 2; book 1 ch. 1, 4;
  book 2 ch. 3, 9)
  - Files touched: `modules/ROOT/pages/web/vaadin/architecture.adoc` (new, 208 lines);
    `modules/ROOT/images/vaadin-client-server-round-trip.svg` (already existed from the interrupted run —
    reviewed, well-formed XML on the house convention, contains all four required elements, left untouched). No
    tests (docs-only repo). Full Antora build deferred to Task 32.
  - Link substitutions (both requested slugs 404): `flow/advanced/architecture-overview` ->
    `https://vaadin.com/docs/latest/flow/what-is-flow`; `flow/advanced/server-side-implementation` ->
    `https://vaadin.com/docs/latest/flow/advanced/application-lifecycle`. Extra links used, all verified live:
    `server-client-communication`, `session-lock-and-rpc-listeners`, `server-push`, `modifying-the-bootstrap-page`,
    `session-and-ui-init-listener`.
  - [x] Task 3.1. Server-side component tree + client engine; `UI` / `VaadinSession` / `VaadinService` /
    `VaadinRequest` each defined with scope + lifecycle; state tree, pending-change recording, diff to JSON change
    list, `syncId` + resync over `@Push`/XHR; one session lock, request vs background threads, `UI.getCurrent()`
    null off the request thread, `UI.access()` / `accessSynchronously()` / `UIDetachedException`; `VaadinServlet`
    (Spring Boot starter auto-registration), request handler chain, app-shell bootstrap + `AppShellConfigurator`,
    `VaadinServiceInitListener`. Six `[source,java]` examples; one-line Vaadin 7 contrast.
  - [x] Task 3.2. `modules/ROOT/images/vaadin-client-server-round-trip.svg` verified: browser `<vaadin-button>`
    Web Component fires a click as RPC -> server component tree mutates -> "Diff against last sent state" -> JSON
    patch applied back to the DOM, with the session-lock band drawn on the server side. House convention
    (opaque white bg, dark/blue/orange strokes, Helvetica, 10-16px). Left as-is.
  - [x] Task 3.3. Embedded via `image::vaadin-client-server-round-trip.svg[...,width=760,role=text-center]`.
    Links present (substitutions noted above).

- [x] Task 4. Create `modules/ROOT/pages/web/vaadin/components-overview.adoc` (issue #43 page 3; book 1 ch. 4;
  book 2 ch. 4; book 3 ch. 1–2, 6)
  - Files touched: `modules/ROOT/pages/web/vaadin/components-overview.adoc` (new, 231 lines). No tests
    (docs-only repo). Full Antora build deferred to Task 32.
  - Link substitutions (verified): `building-apps/ui-basics/compose-components` 404 ->
    `https://vaadin.com/docs/latest/building-apps/ui-basics/compose` ("Compose with Components");
    `components/cookie-consent` 404 in v25 -> `https://vaadin.com/docs/v23/components/cookie-consent` (most recent
    live official page; still a Pro component). `/components` and the other component pages verified live.
  - [x] Task 4.1. `Component` + `Has*` mixins in a `[cols="1,3"]` table (`HasComponents`, `HasSize`, `HasStyle`,
    `HasValue`, `HasEnabled`, `Focusable`) with a runnable example; add/remove/removeAll/getChildren; enabled +
    visible state with an `[IMPORTANT]` security block on server-side `setVisible(false)`; grouped tour in a
    `[cols="1,2,1"]` table (Input fields / Buttons & menus / Data visualization / Layouts / Overlays & feedback)
    plus a prose paragraph per group with inline component links and sibling `xref:`s; one-line Vaadin 7
    `Grid`-vs-`Table` contrast; labelled Hilla/React `[NOTE]`. Pro-components section lists Grid Pro, CRUD,
    Charts, Spreadsheet, Rich Text Editor, Map, Dashboard, Cookie Consent, each linking its doc page, and
    cross-links `xref:web/vaadin/ui-component-libraries.adoc[]`.
  - [x] Task 4.2. Links present (`components`; `compose` as substitute for `compose-components`).

- [x] Task 5. Create `modules/ROOT/pages/web/vaadin/layouts.adoc` (issue #43 page 4; book 1 ch. 3; book 3
  ch. 3)
  - Files touched: `modules/ROOT/pages/web/vaadin/layouts.adoc` (new, ~281 lines);
    `modules/ROOT/images/vaadin-app-layout.svg` (new). No tests (docs-only repo). Full Antora build deferred to
    Task 32.
  - Link substitution: `building-apps/ui-basics/arrange-layouts` 404 ->
    `https://vaadin.com/docs/latest/building-apps/ui-basics/layouts` (title "Arrange with Layouts") plus its
    children `.../layouts/css-grid` and `.../layouts/responsive`. `components/basic-layouts`,
    `components/app-layout`, `components/form-layout` verified live.
  - [x] Task 5.1. `VerticalLayout` / `HorizontalLayout` flexbox model + spacing/padding/margin toggles; sizing
    (`setWidthFull`, `setSizeFull`, `setHeightFull`, `setFlexGrow`, `setFlexShrink`, `expand`); alignment
    (`setAlignItems`, `setJustifyContentMode` + `JustifyContentMode`, `setAlignSelf`); `Scroller` + `Div`;
    `FlexLayout`; `FormLayout` with `setResponsiveSteps` / `ResponsiveStep` / `setColspan` / `addFormRow`;
    `SplitLayout` (orientation, primary/secondary, `setSplitterPosition`); `AppLayout` (navbar + drawer,
    `setPrimarySection`, `DrawerToggle`); CSS Grid via `LumoUtility.addClassNames`; `Composite<T>`. Every
    concept has a `[source,java]` example.
  - [x] Task 5.2. `modules/ROOT/images/vaadin-app-layout.svg` created (`viewBox="0 0 720 420"`, house
    convention): both states side by side -- wide viewport (navbar with hamburger `DrawerToggle` + title, drawer
    beside content, content filling the rest) and below-breakpoint overlay mode (drawer over the content behind a
    scrim); navbar / drawer / content regions labelled in both panels.
  - [x] Task 5.3. Embedded via `image::vaadin-app-layout.svg[...,width=720,role=text-center]`. Links present
    (`arrange-layouts` substituted with `layouts` as noted).

#### Input, forms & data

- [x] Task 6. Create `modules/ROOT/pages/web/vaadin/input-components.adoc` (issue #43 page 5; book 1 ch. 4;
  book 2 ch. 4; book 3 ch. 2)
  - [x] Task 6.1. Implement every bullet: text (`TextField`, `TextArea`, `EmailField`, `PasswordField`);
    numeric (`NumberField`, `IntegerField`, `BigDecimalField`); boolean & choice (`Checkbox`, `CheckboxGroup`,
    `RadioButtonGroup`, `Select`, `ListBox`); date/time (`DatePicker`, `TimePicker`, `DateTimePicker`);
    `ComboBox` incl. **lazy** item loading, `MultiSelectComboBox`; `Upload`; `Slider`. The `HasValue` API,
    **value-change modes** (`ValueChangeMode.EAGER` / `LAZY` / `ON_BLUR` / `ON_CHANGE`), `required`, helper /
    error text, prefix / suffix, read-only. `[source,java]`.
  - [x] Task 6.2. Links: at least https://vaadin.com/docs/latest/components/text-field ,
    https://vaadin.com/docs/latest/components/combo-box ,
    https://vaadin.com/docs/latest/components/date-picker ,
    https://vaadin.com/docs/latest/components/upload .

- [x] Task 7. Create `modules/ROOT/pages/web/vaadin/data-binding.adoc` (issue #43 page 6; book 1 ch. 5; book 2
  ch. 4, 6; book 3 ch. 2)
  - Files touched: `modules/ROOT/pages/web/vaadin/data-binding.adoc` (present from an earlier interrupted run;
    reviewed against every Task 7 bullet and left as-is — already standards-compliant). No tests (docs-only
    repo). Full Antora build deferred to Task 32.
  - Done: page covers `Binder<T>`, `bindInstanceFields(this)`, manual `forField(...).bind(...)`, `Converter`
    (incl. custom `Converter.from`), `Validator` + `BindingValidationStatus` / `BinderValidationStatus`,
    cross-field and bean-level validation, `BeanValidationBinder` with `@NotNull` / `@Size` / `@Email` / `@Min`,
    nested (dotted) bean properties with `@Valid` cascade, `readBean` / `writeBean` / `writeBeanIfValid` (+
    `writeBeanAsDraft`, `readRecord` / `writeRecord`), a buffered-vs-unbuffered table, `StatusChangeListener`,
    and `HasValidator`. Header/disclaimer placement matches `web/vue/getting-started.adoc`; literal braces in
    prose escaped; the three Task 7.3 links are all present and verified live (titles "Binding Data to Forms",
    "Validating & Converting User Input", "Binding Beans to Forms").
  - [x] Task 7.1. `Binder<T>` API, converters, validators, cross-field validation, `BeanValidationBinder` +
    Jakarta Bean Validation, nested properties, load/save methods, buffered vs unbuffered, `StatusChangeListener`,
    `HasValidator` — all present with `[source,java]` examples.
  - [x] Task 7.2. `[mermaid]` "The Binder data flow" diagram present: `readBean` → field edits → converter chain
    → validator chain → status/listeners, branching to buffered (`writeBean` / `writeBeanIfValid`) and
    unbuffered (`setBean`) write paths back into the bean.
  - [x] Task 7.3. Links present: https://vaadin.com/docs/latest/flow/binding-data/components-binder ,
    https://vaadin.com/docs/latest/flow/binding-data/components-binder-validation ,
    https://vaadin.com/docs/latest/flow/binding-data/components-binder-beans (all verified live) plus
    `components-binder-load`.

- [x] Task 8. Create `modules/ROOT/pages/web/vaadin/grid.adoc` (issue #43 page 7; book 1 ch. 6; book 2 ch. 6;
  book 3 ch. 5)
  - [x] Task 8.1. Implement every bullet: columns — `addColumn(ValueProvider)`, `setKey`, `setHeader`,
    `setSortProperty`, renderers (`ComponentRenderer`, `LitRenderer`, `NumberRenderer`, `LocalDateRenderer`);
    data — **in-memory** `setItems(...)` + `GridListDataView` vs. **lazy**
    `setItems(fetchCallback, countCallback)` / `DataProvider` + `GridLazyDataView` (backend sorting and
    filtering), `CallbackDataProvider`; **selection** modes, `asSingleSelect()` / `asMultiSelect()`; **item
    details**; row / cell part-name styling; context menu; **`GridPro`** inline editing and the `Grid` editor;
    **`TreeGrid`** + `HierarchicalDataProvider`; CSV / Excel export via an add-on. `[source,java]`.
  - [x] Task 8.2. Create `modules/ROOT/images/vaadin-grid-data-sources.svg` — hand-authored: in-memory
    `setItems` (whole list in server memory, Grid pages client-side) vs. lazy `DataProvider` (`fetch(offset,
    limit, sortOrders)` + `count(filter)` reaching the backend, only the visible window materialised).
  - [x] Task 8.3. Embed `image::vaadin-grid-data-sources.svg[…]`. Links: at least
    https://vaadin.com/docs/latest/components/grid ,
    https://vaadin.com/docs/latest/components/grid-pro ,
    https://vaadin.com/docs/latest/building-apps/forms-data/grid .

- [x] Task 9. Create `modules/ROOT/pages/web/vaadin/forms-crud-and-master-detail.adoc` (issue #43 page 8;
  book 1 ch. 5–6; book 2 ch. 6; book 3 ch. 2, 5)
  - [x] Task 9.1. Implement every bullet: a form view — layout + `Binder` + save / cancel, validation feedback,
    dirty-state handling; a **master-detail view** (`MasterDetailLayout` / `SplitLayout` + `Grid` + editor); the
    **`CRUD`** component; `ConfirmDialog`; editing in a `Dialog` / drawer; **optimistic locking** on concurrent
    edits. Cross-link `xref:web/vaadin/data-binding.adoc[]` and `xref:web/vaadin/grid.adoc[]`. `[source,java]`.
  - [x] Task 9.2. Links: at least https://vaadin.com/docs/latest/building-apps/forms-data ,
    https://vaadin.com/docs/latest/components/crud ,
    https://vaadin.com/docs/latest/components/master-detail-layout ,
    https://vaadin.com/docs/latest/components/confirm-dialog .

#### Navigation & interaction

- [x] Task 10. Create `modules/ROOT/pages/web/vaadin/routing-and-navigation.adoc` (issue #43 page 9; book 1
  ch. 7; book 2 ch. 7; book 3 ch. 4)
  - [x] Task 10.1. Implement every bullet: `@Route`, `RouterLink`, `RouteConfiguration`, `@RouteAlias`;
    parameters — `HasUrlParameter<T>`, `@RouteParam`, route templates (`:id`, `:id?`, `:path*`), query
    parameters; lifecycle observers — `BeforeEnterObserver`, `BeforeLeaveObserver` (+ `postpone`),
    `AfterNavigationObserver`, rerouting and forwarding; `RouterLayout` and nested layouts, `@ParentLayout`,
    `@Layout`; page title — `@PageTitle` / `HasDynamicTitle`; error views — `HasErrorParameter`; dynamic route
    registration; a navigation menu (`SideNav`, `MenuConfiguration`). `[source,java]`.
  - [x] Task 10.2. Add a `[mermaid]` flowchart of the navigation lifecycle: `BeforeLeave` (+ `postpone`) →
    `BeforeEnter` (+ `rerouteTo` / `forwardTo`) → `AfterNavigation`, with `RouterLayout` nesting shown.
  - [x] Task 10.3. Links: at least https://vaadin.com/docs/latest/flow/routing ,
    https://vaadin.com/docs/latest/flow/routing/lifecycle ,
    https://vaadin.com/docs/latest/building-apps/views-navigation .

- [x] Task 11. Create `modules/ROOT/pages/web/vaadin/interaction-and-overlays.adoc` (issue #43 page 10; book 1
  ch. 4; book 3 ch. 3, 6)
  - [x] Task 11.1. Implement every bullet: `Button` + `ClickListener`, keyboard shortcuts (`Shortcuts`,
    `ClickNotifier.addClickShortcut`, `Key`), `Anchor` / `RouterLink`; `MenuBar`, `ContextMenu` (+
    `GridContextMenu`), `Notification`, `Dialog`, `ConfirmDialog`, `Popover`, `Tooltip`; `Tabs` / `TabSheet`,
    `Details`, `Accordion`, `Card`, `SideNav`, `Avatar`, `Badge`, `ProgressBar`; **drag & drop** —
    `DragSource` / `DropTarget`, `GridDropTarget`. `[source,java]`.
  - [x] Task 11.2. Links: at least https://vaadin.com/docs/latest/components/button ,
    https://vaadin.com/docs/latest/components/dialog ,
    https://vaadin.com/docs/latest/components/menu-bar ,
    https://vaadin.com/docs/latest/building-apps/ui-basics/drag-drop (verify the exact shortcut/drag-drop slugs
    while writing).

- [x] Task 12. Create `modules/ROOT/pages/web/vaadin/server-push.adoc` (issue #43 page 11; book 1 ch. 8;
  book 2 ch. 7)
  - [x] Task 12.1. Implement every bullet: `@Push` on the `AppShellConfigurator` / route, transport
    (**WebSocket** vs **long polling**), `PushMode.AUTOMATIC` vs `MANUAL` + `ui.push()`; **`UI.access(Command)`**
    and the session lock; background work with **`VaadinExecutor`** / `ExecutorService` / `@Async`;
    **broadcasting** to many `UI`s; `UIDetachedException` and the detach/attach guard; **`@Poll` /
    `PollListener`** as the no-push alternative. `[source,java]`.
  - [x] Task 12.2. Add a `[mermaid]` sequence diagram: worker thread → `ui.access(...)` → session lock acquired
    → UI mutated → push over the open channel → browser DOM update.
  - [x] Task 12.3. Links: at least https://vaadin.com/docs/latest/flow/advanced/server-push ,
    https://vaadin.com/docs/latest/building-apps/server-push .

#### Client side & extensibility

- [x] Task 13. Create `modules/ROOT/pages/web/vaadin/element-api-and-web-components.adoc` (issue #43 page 12;
  book 1 ch. 9; book 2 ch. 9; book 3 ch. 8)
  - [x] Task 13.1. Implement every bullet: the `Element` API — create elements, `setAttribute` /
    `setProperty`, `getStyle`, `addEventListener` (+ `@DomEvent`, event data), **`executeJs(...)`** with a
    returned `PendingJavaScriptResult`, `callJsFunction`, `@ClientCallable`; integrating a **web component** —
    `@Tag` + `@NpmPackage` + `@JsModule`, `PropertyDescriptors`, mixin interfaces; `@CssImport` /
    `@JavaScript`; accessing the shadow root. `[source,java]` + `[source,ts]` / `[source,html]` for the
    component side.
  - [x] Task 13.2. Links: at least https://vaadin.com/docs/latest/flow/create-ui/element-api ,
    https://vaadin.com/docs/latest/flow/create-ui/element-api/client-server-rpc ,
    https://vaadin.com/docs/latest/flow/integrations/web-components .

- [x] Task 14. Create `modules/ROOT/pages/web/vaadin/custom-components.adoc` (issue #43 page 13; book 1 ch. 9;
  book 2 ch. 9; book 3 ch. 8)
  - [x] Task 14.1. Implement every bullet: **`Composite<T>`** to compose existing components into a new one
    with a clean API; extending a component; a component **from an element** (`@Tag` + `Element`); a **custom
    field** with a value — `AbstractField` / `AbstractCompositeField`, `CustomField`; **packaging & publishing**
    an add-on to the Vaadin Directory; wrapping a **JS library** or a **React component**. `[source,java]` +
    `[source,xml]` for the add-on packaging.
  - [x] Task 14.2. Links: at least https://vaadin.com/docs/latest/building-apps/components ,
    https://vaadin.com/docs/latest/flow/create-ui/creating-components ,
    https://vaadin.com/docs/latest/components/custom-field , https://vaadin.com/directory .

- [x] Task 15. Create `modules/ROOT/pages/web/vaadin/hilla-and-react-views.adoc` (issue #43 page 14; book 1
  ch. 11 — *Fusion*, since renamed)
  - [x] Task 15.1. Implement every bullet: **Hilla** in a Vaadin project — `@BrowserCallable` / `@Endpoint`
    Java services, **generated type-safe TypeScript clients**, **file-based routing**
    (`src/main/frontend/views/`), the Vaadin React components (`@vaadin/react-components`); **Hilla forms**
    (`useForm`, `@vaadin/hilla-react-form`); **security** (`@AnonymousAllowed` / `@PermitAll` / `@RolesAllowed`,
    `useAuth`); **reactive endpoints** returning `Flux<T>` and **full-stack signals**; **mixing Flow and Hilla**
    in one app; a short "when to pick which" contrast. Cross-link `xref:web/react/index.adoc[React Reference]`
    and `xref:web/typescript/index.adoc[TypeScript Reference]`. `[source,java]` + `[source,tsx]` +
    `[source,ts]`.
  - [x] Task 15.2. Create `modules/ROOT/images/vaadin-flow-vs-hilla.svg` — hand-authored, side by side: one
    Spring Boot backend; on the left, Flow (Java view classes → server component tree → Web Components); on the
    right, Hilla (`@BrowserCallable` service → generated TS client → React view using
    `@vaadin/react-components`).
  - [x] Task 15.3. Embed `image::vaadin-flow-vs-hilla.svg[…]`. Links: at least
    https://vaadin.com/docs/latest/hilla , https://vaadin.com/docs/latest/hilla/guides/endpoints ,
    https://vaadin.com/docs/latest/building-apps/react-views .

#### Styling & design

- [x] Task 16. Create `modules/ROOT/pages/web/vaadin/theming-and-styling.adoc` (issue #43 page 15; book 1
  ch. 10; book 3 ch. 7)
  - [x] Task 16.1. Implement every bullet: the **theme folder**
    (`src/main/frontend/themes/<name>/styles.css` + `theme.json`) and **`@Theme`**; **Base** vs **Lumo** vs
    **Aura**; **Lumo** as CSS custom properties (color, typography, size & space, shape, elevation,
    interaction) and the **dark** variant (`Lumo.DARK`, `@Theme(variant = Lumo.DARK)`); **theme & component
    variants** (`addThemeVariants(ButtonVariant.LUMO_PRIMARY)`, `GridVariant`, `TextFieldVariant`); **utility
    classes** — `LumoUtility.*` and **Tailwind** (cross-link `xref:web/tailwind/index.adoc[]`); custom CSS via
    **`@CssImport`** / `Stylesheet`; **styling component internals** — documented selectors, state attributes,
    and **`::part()`** into the shadow DOM; cross-link `xref:web/sass/index.adoc[]` for preprocessing.
    `[source,java]` + `[source,css]` + `[source,json]`.
  - [x] Task 16.2. Create `modules/ROOT/images/vaadin-theme-layering.svg` — hand-authored, layered: Base →
    Lumo/Aura design tokens (CSS custom properties) → theme & component variants → utility classes → custom
    theme CSS + `::part()` reaching into the shadow DOM.
  - [x] Task 16.3. Embed `image::vaadin-theme-layering.svg[…]`. Links: at least
    https://vaadin.com/docs/latest/styling , https://vaadin.com/docs/latest/styling/themes/lumo ,
    https://vaadin.com/docs/latest/styling/styling-components ,
    https://vaadin.com/docs/latest/styling/utility-classes .

- [x] Task 17. Create `modules/ROOT/pages/web/vaadin/responsive-design-and-pwa.adoc` (issue #43 page 16;
  book 1 ch. 10)
  - [x] Task 17.1. Implement every bullet: **responsive** `FormLayout` steps, `AppLayout` drawer collapse,
    `Grid` column auto-width / flex, Lumo **breakpoint utility classes**, `@Viewport`; **PWA** — `@PWA`, the
    generated manifest / service worker, offline shell, **Web Push**; the **Designing Apps** guidance (color,
    typography, size & space, responsiveness). `[source,java]` + `[source,css]`.
  - [x] Task 17.2. Links: at least https://vaadin.com/docs/latest/styling/themes/lumo/lumo-breakpoint ,
    https://vaadin.com/docs/latest/flow/configuration/pwa , https://vaadin.com/docs/latest/designing-apps .

#### Integration & backend

- [x] Task 18. Create `modules/ROOT/pages/web/vaadin/spring-boot-integration.adoc` (issue #43 page 17; book 1
  ch. 12)
  - [x] Task 18.1. Implement every bullet: `vaadin-spring-boot-starter`; **`@SpringComponent`**, the Vaadin
    scopes — **`@UIScope`**, **`@RouteScope`** / `@RouteScopeOwner`, **`@VaadinSessionScope`**; injecting
    services into views; **Spring Data JPA** repository + entity + a `Grid`-backed CRUD;
    `application.properties` `vaadin.*` keys; Spring events; **Spring MVC coexistence**; `@EnableVaadin`.
    Cross-link `xref:database/sql/index.adoc[SQL Reference]`. `[source,java]` + `[source,xml]` +
    `[source,properties]`.
  - [x] Task 18.2. Links: at least https://vaadin.com/docs/latest/flow/integrations/spring ,
    https://vaadin.com/docs/latest/flow/integrations/spring/spring-scopes .

- [x] Task 19. Create `modules/ROOT/pages/web/vaadin/jakarta-ee-and-cdi.adoc` (issue #43 page 18; book 1
  ch. 13; book 2 ch. 8, 10)
  - [x] Task 19.1. Implement every bullet: `vaadin-cdi`; the CDI scopes — `@VaadinServiceScoped`,
    `@VaadinSessionScoped`, `@NormalUIScoped`, `@RouteScoped`; `@Inject` beans & CDI events; deploying a WAR to
    a Jakarta EE server; a JPA entity + repository + CRUD; **Quarkus** (`vaadin-quarkus`) note; a short **OSGi /
    Portlet** legacy-integration note (one-line contrast with book 2's portlet chapter — not documented in
    depth). `[source,java]` + `[source,xml]`.
  - [x] Task 19.2. Links: at least https://vaadin.com/docs/latest/flow/integrations/cdi ,
    https://vaadin.com/docs/latest/flow/integrations/quarkus .

- [x] Task 20. Create `modules/ROOT/pages/web/vaadin/data-persistence.adoc` (issue #43 page 19; book 1
  ch. 12–13)
  - [x] Task 20.1. Implement every bullet: **Spring Data JPA**, **jOOQ**, **Flyway** migrations; a lazy `Grid`
    backed by a `PageableRepository` (backend paging / sorting / filtering); the **`@Transactional`** boundary
    for a server-driven UI; **refreshing** a `DataProvider` after a write. Cross-link
    `xref:database/sql/index.adoc[SQL Reference]` and `xref:database/mongodb/index.adoc[MongoDB Reference]`.
    `[source,java]` + `[source,sql]` / `[source,xml]` as appropriate.
  - [x] Task 20.2. Links: at least https://vaadin.com/docs/latest/building-apps/forms-data/persistence ,
    https://vaadin.com/docs/latest/building-apps/forms-data/persistence/spring-data-jpa .

- [x] Task 21. Create `modules/ROOT/pages/web/vaadin/rest-and-services.adoc` (issue #43 page 20; book 2 ch. 7 —
  Java EE API access)
  - [x] Task 21.1. Implement every bullet: exposing a Spring `@RestController` next to Flow routes; **calling
    an external API** from a view (`RestClient` / `WebClient`) off the UI thread and pushing the result
    (cross-link `xref:web/vaadin/server-push.adoc[]`); a **service layer** between the UI and the domain;
    **`@BrowserCallable` vs REST** — when each fits. Cross-link `xref:web/cors.adoc[What is CORS?]` where an
    external API is called from the browser instead. `[source,java]`.
  - [x] Task 21.2. Links: at least https://vaadin.com/docs/latest/building-apps/integration/rest-api ,
    https://vaadin.com/docs/latest/building-apps/business-logic .

#### Security

- [x] Task 22. Create `modules/ROOT/pages/web/vaadin/security.adoc` (issue #43 page 21; book 2 ch. 7 for the
  legacy `Navigator` gate, as contrast only)
  - [x] Task 22.1. Implement every bullet: **`VaadinWebSecurity`** / the Vaadin Security Configurer with Spring
    Security; route protection — **`@AnonymousAllowed`**, **`@PermitAll`**, **`@RolesAllowed`**, `@DenyAll`;
    **navigation access control**; route- vs method-level security; a **login view** (`LoginForm` /
    `LoginOverlay`); **`AuthenticationContext`** (login / logout); the built-in **CSRF** protection; **securing
    Hilla endpoints**; **CSP**; the **sensitive-data** guidance; an **SSO Kit** pointer. Cross-link
    `xref:web/cors.adoc[What is CORS?]`. `[source,java]`.
  - [x] Task 22.2. Links: at least https://vaadin.com/docs/latest/flow/security ,
    https://vaadin.com/docs/latest/flow/security/enabling-security ,
    https://vaadin.com/docs/latest/building-apps/security ,
    https://vaadin.com/docs/latest/hilla/guides/security .

#### Quality & delivery

- [x] Task 23. Create `modules/ROOT/pages/web/vaadin/testing.adoc` (issue #43 page 22; book 3 ch. 1 — the
  generated test set)
  - [x] Task 23.1. Implement every bullet: **UI unit testing** — `vaadin-testbench-unit`, `UIUnitTest` /
    `@ViewPackages`, `test(...)`, `$(...)`, `navigate(...)`, no browser; **end-to-end** — **TestBench**
    (`TestBenchTestCase`, the element query API `$(...).id(...)`, `@BrowserTest`, screenshots); **Playwright**
    and **Selenium** options; **load testing**; testing with **Spring** (`@SpringBootTest`). Note explicitly
    that **TestBench is a commercial tool**. `[source,java]` + `[source,xml]`.
  - [x] Task 23.2. Links: at least https://vaadin.com/docs/latest/flow/testing ,
    https://vaadin.com/docs/latest/flow/testing/ui-unit ,
    https://vaadin.com/docs/latest/flow/testing/end-to-end .

- [x] Task 24. Create `modules/ROOT/pages/web/vaadin/production-and-deployment.adoc` (issue #43 page 23;
  book 1 ch. 12–13; book 2 ch. 3, 10)
  - [x] Task 24.1. Implement every bullet: the **production build** — `vaadin-maven-plugin` `build-frontend`,
    the `production` profile, what the optimised bundle contains, **licensing** for Pro components in CI;
    targets — **servlet-container WAR**, **Spring Boot jar**, **Docker**, **GraalVM native image**, cloud
    providers (AWS / Azure / GCP); **reverse proxies** & **sticky sessions**; **clustered / distributed**
    deployment & **session replication**; troubleshooting. `[source,xml]` + `[source,bash]` +
    `[source,dockerfile]` (fall back to `[source,docker]` or plain `----` if that lexer is unavailable —
    confirm against the build).
  - [x] Task 24.2. Add a `[mermaid]` diagram of the build pipeline: dev mode (frontend dev server, live reload)
    vs. `-Pproduction` (`build-frontend`, bundle, optimise) → WAR / Spring Boot jar / native image / Docker.
  - [x] Task 24.3. Create `modules/ROOT/images/vaadin-deployment-architecture.svg` — hand-authored, side by
    side: a single Spring Boot monolith, vs. a clustered / session-replicated deployment behind a
    sticky-session reverse proxy, with the server-side UI state called out as the reason stickiness matters.
  - [x] Task 24.4. Embed `image::vaadin-deployment-architecture.svg[…]`. Links: at least
    https://vaadin.com/docs/latest/flow/production ,
    https://vaadin.com/docs/latest/flow/production/production-build ,
    https://vaadin.com/docs/latest/flow/production/docker .

- [x] Task 25. Create `modules/ROOT/pages/web/vaadin/configuration-and-dev-tools.adoc` (issue #43 page 24;
  book 1 ch. 2, 11; book 3 ch. 1)
  - [x] Task 25.1. Implement every bullet: **`application.properties`** / `vaadin.*` flags; **dev mode**
    (Node.js, npm / pnpm / bun, the frontend dev server); **hot deploy & live reload** (Spring Boot DevTools,
    JRebel, HotswapAgent); **feature flags**; the **browser dev tools** panel and **Vaadin Copilot**;
    customising `package.json` with `@NpmPackage`; **Maven vs Gradle**. `[source,properties]` +
    `[source,xml]` + `[source,bash]` + `[source,json]`.
  - [x] Task 25.2. Links: at least https://vaadin.com/docs/latest/flow/configuration ,
    https://vaadin.com/docs/latest/flow/configuration/development-mode ,
    https://vaadin.com/docs/latest/tools/copilot .

#### Advanced

- [x] Task 26. Create `modules/ROOT/pages/web/vaadin/advanced-topics.adoc` (issue #43 page 25; book 1 ch. 9–10;
  book 2 ch. 7)
  - [x] Task 26.1. Implement every bullet: application lifecycle — `VaadinServiceInitListener`,
    `UIInitListener`, `SessionInitListener`; a custom **`ErrorHandler`** and **system messages**;
    **`@PreserveOnRefresh`**; the **loading indicator**; **downloads** / **uploads** handlers; **long-running
    tasks** & `Command`; **localization** — `I18NProvider`, `getTranslation(...)`, locale handling, **RTL**
    support. `[source,java]` + `[source,properties]` for the i18n bundles.
  - [x] Task 26.2. Links: at least https://vaadin.com/docs/latest/flow/advanced ,
    https://vaadin.com/docs/latest/flow/advanced/i18n-localization .

#### UI component libraries

- [x] Task 27. Create `modules/ROOT/pages/web/vaadin/ui-component-libraries.adoc` (issue #43 page 26 — its own
  dedicated "UI Component Libraries page" section)
  - [x] Task 27.1. Follow the sibling-page shape exactly (`modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc`,
    `modules/ROOT/pages/web/vue/ui-component-libraries.adoc`,
    `modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc`): `= UI Component Libraries` →
    `include::partial$vaadin-disclaimer.adoc[]` → a lead stating "free and open-source first, commercial suites
    last, without examples" → `== How to choose` checklist (licence first: Apache-2.0 core vs. Pro/Prime; Flow
    vs. Hilla; do you even need an add-on; add-on health on the Directory; accessibility; styling model) →
    `== Styling options` (short — theme folder + `@Theme`, Lumo custom properties + dark variant, theme /
    component variants, `LumoUtility` + Tailwind, `::part()`, Sass; deferring to
    `xref:web/vaadin/theming-and-styling.adoc[]`) → `== Component libraries -- free and open-source` →
    `== Commercial suites -- paid / licensed` → `== Accessibility`.
  - [x] Task 27.2. `== Component libraries -- free and open-source` — a `=== <Name> (<LICENSE>)` sub-section per
    entry, **each with an install snippet (Maven `[source,xml]` or `[source,bash]` npm) and a usage snippet**,
    a one-line description, Flow/Hilla support, and an official docs link: **Vaadin core components**
    (Apache 2.0 — Flow `[source,java]` `Button`/`Grid`/`TextField` **and** Hilla
    `@vaadin/react-components` `[source,tsx]`), **Vaadin Web Components standalone**
    (`npm i @vaadin/button @vaadin/grid`, framework-agnostic usage —
    https://github.com/vaadin/web-components), **Viritin / Flow-Viritin**
    (https://github.com/viritin/flow-viritin), **SO-Charts** (https://github.com/syampillai/SOCharts),
    **ApexCharts for Flow**, **Vaadin ChartJs**, **Flowing Code open-source add-ons**
    (https://www.flowingcode.com/en/open-source/), and the **Vaadin Directory** itself
    (https://vaadin.com/directory — how to read a listing, the `vaadin-addons` Maven repository).
    **Per choice 13: verify each add-on's actual licence and Vaadin 24/25 compatibility on its own repo /
    Directory listing before stating it; drop or re-label any entry that can't be confirmed.**
  - [x] Task 27.3. Note that for **Hilla / React** views, the React UI libraries covered in
    `xref:web/react/styling-and-ui-libraries.adoc[the React Reference]` (MUI, Mantine, Chakra UI, Radix UI,
    shadcn/ui, …) work the same as in any React app — link that page rather than repeating it — and mention
    mixing them with `@vaadin/react-components` in one view.
  - [x] Task 27.4. Add the decision aid as a compact `[mermaid]` flowchart **or** table (whichever renders
    cleaner): Java UI → Vaadin core (Flow); React/TS UI → `@vaadin/react-components` (Hilla) + any React
    library; charts without a Pro subscription → SO-Charts / ApexCharts / ChartJs; rich data grid with inline
    editing, out-of-the-box CRUD, spreadsheet, map, dashboard → Vaadin Pro / Prime; Vaadin components outside a
    Vaadin backend → the standalone `@vaadin/*` Web Components.
  - [x] Task 27.5. `== Commercial suites -- paid / licensed`, **listed without code examples**: the **Vaadin Pro
    / Prime subscription** (Grid Pro, CRUD, Charts, Spreadsheet, Rich Text Editor, Map, Dashboard, Cookie
    Consent; TestBench; the Kits — SSO, Collaboration, Observability, Kubernetes, AppSec, Azure Cloud,
    Multiplatform Runtime — https://vaadin.com/pricing , https://vaadin.com/docs/latest/tools), **Vaadin
    Designer** (superseded by the free Copilot), and a one-sentence pointer to third-party commercial suites
    usable in Hilla/React views (Kendo UI for React, AG Grid Enterprise, MUI X Pro), deferring to
    `xref:web/react/styling-and-ui-libraries.adoc[]`.
  - [x] Task 27.6. `== Accessibility` — Vaadin's built-in components ship WAI-ARIA roles, keyboard navigation
    and focus management; one small example (a labelled `TextField` with helper/error text, plus an `aria-*`
    attribute set via `getElement().setAttribute(...)`); note automated checks (axe / Lighthouse) and TestBench
    accessibility assertions; cross-link `xref:web/accessibility.adoc[Web Accessibility]`.

### Group 3 — Cheat sheet

**Parallelizable: yes** (single task). Depends on Group 2 for the page set it links back to and the concepts it
summarises.

- [x] Task 28. Create the Vaadin cheat sheet — `modules/ROOT/pages/web/vaadin/cheat-sheet.adoc` +
  `modules/ROOT/attachments/vaadin-cheat-sheet.pdf`
  - [x] Task 28.1. Create `modules/ROOT/pages/web/vaadin/cheat-sheet.adoc` following
    `modules/ROOT/pages/web/vue/cheat-sheet.adoc` and `modules/ROOT/pages/web/aspnet/cheat-sheet.adoc`: the
    standard header + `include::partial$vaadin-disclaimer.adoc[]`, a short intro paragraph, then **grouped
    `xref:` back-links to every one of the 26 Group 2 pages** (grouped under the same headings used in
    `index.adoc`: Fundamentals · Input, forms & data · Navigation & interaction · Client side & extensibility ·
    Styling & design · Integration & backend · Security · Quality & delivery · Advanced · UI component
    libraries), a one-line pointer to https://vaadin.com/docs/latest/ and https://vaadin.com/api , a brief
    bibliography mirror, and finally
    `xref:attachment$vaadin-cheat-sheet.pdf[Download the Vaadin Cheat Sheet (PDF)]`.
  - [x] Task 28.2. Hand-build a print-ready single-A4-page HTML/CSS layout (colour-coded sections, small
    monospace code fragments, multi-column) covering: create a project + the minimal `@Route` view skeleton;
    **layouts** (`VerticalLayout` / `HorizontalLayout` sizing / grow / alignment, `FormLayout` steps,
    `AppLayout`); **fields** (`TextField`, `NumberField`, `ComboBox`, `DatePicker`, `Checkbox`, `Select`,
    `Upload`) + `HasValue` + `ValueChangeMode`; **`Binder`** (`bindInstanceFields`, `forField`, `Converter`,
    `Validator`, `BeanValidationBinder`, `readBean` / `writeBean` / `writeBeanIfValid`); **`Grid`** (columns,
    renderers, `setItems` vs lazy `DataProvider` / `GridLazyDataView`, selection, `GridPro`); **routing**
    (`@Route`, `RouterLink`, route parameters / templates / query params, the lifecycle observers,
    `RouterLayout`, `@PageTitle`); **overlays** (`Dialog`, `ConfirmDialog`, `Notification`, `ContextMenu`,
    `MenuBar`, `Tabs`); **server push** (`@Push`, `UI.access(...)`, `VaadinExecutor`, `@Poll`); **Element API**
    (`getElement().setProperty` / `executeJs`, `@ClientCallable`, `@JsModule` / `@NpmPackage`); **theming**
    (`@Theme`, Lumo custom properties, `addThemeVariants`, `LumoUtility`, `::part()`); **Spring scopes**
    (`@SpringComponent`, `@UIScope`, `@RouteScope`, `@VaadinSessionScope`); **security** (`VaadinWebSecurity`,
    `@AnonymousAllowed` / `@PermitAll` / `@RolesAllowed`, `AuthenticationContext`); **Hilla** one-liner
    (`@BrowserCallable` + generated TS client + `@vaadin/react-components`); **build**
    (`mvn -Pproduction package`); and a short **Vaadin 7 → Flow** mapping strip (`Table` → `Grid`;
    `Property`/`Item`/`Container` → `Binder` + `DataProvider`; `Navigator`/`View` → `@Route`/`RouterLayout`;
    GWT widget → Web Component + `Element` API).
  - [x] Task 28.3. Render it to `modules/ROOT/attachments/vaadin-cheat-sheet.pdf` with headless Chrome
    (`--headless --print-to-pdf --no-pdf-header-footer`), then **verify it is exactly one A4 page** (page-count
    check) and inspect a rendered preview for clipped or overflowing content; iterate on the HTML/CSS density
    until it fits. Commit only the PDF — do **not** keep the HTML source in the repo (consistent with the other
    14 cheat sheets).

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 32 (final build verification) must run only after Tasks 29–31 have landed, since
it validates the `xref:`s and nav entries they create. Tasks 29, 30 and 31 touch disjoint files and are
independent of one another, but all three depend on Groups 2–3 for the page set they reference.

- [x] Task 29. Create `modules/ROOT/pages/web/vaadin/index.adoc` — the Vaadin Reference landing page
  - [x] Task 29.1. Standard header (`= Vaadin Reference`, `:description:`, `:keywords:` naming Vaadin, Flow,
    Hilla, `Binder`, `Grid`, `@Route`, Lumo, server push, Spring Boot, TestBench, UI component libraries, cheat
    sheet), `include::partial$vaadin-disclaimer.adoc[]`, then a lead paragraph
    (https://vaadin.com/[Vaadin] is an open-source Java web framework …) and a "if you are new, start with
    Getting Started → Components Overview → Layouts → Data Binding → Routing & Navigation" pointer. Follow the
    exact format of `modules/ROOT/pages/web/vue/index.adoc` and `modules/ROOT/pages/web/aspnet/index.adoc`.
  - [x] Task 29.2. A `== What's covered` section grouping all 27 pages with a one-line blurb each, under the
    headings: **Fundamentals** (Tasks 2–5) · **Input, forms and data** (6–9) · **Navigation and interaction**
    (10–12) · **Client side and extensibility** (13–15) · **Styling and design** (16–17) · **Integration and
    backend** (18–21) · **Security** (22) · **Quality and delivery** (23–25) · **Advanced** (26) · **UI
    component libraries** (27) · **Reference** (the cheat sheet, Task 28).
  - [x] Task 29.3. A `== Bibliography` section reproducing issue #43's bibliography verbatim in AsciiDoc: the
    https://vaadin.com/docs/latest/ bullet (calling out Getting Started, Building Apps, Flow, Hilla,
    Components, Styling, Designing Apps, the API/Javadoc, the Cookbook, start.vaadin.com, the Directory, the
    release notes); the official ecosystem / tooling bullet (Vaadin Spring, Vaadin CDI, TestBench, Tools &
    Kits, Copilot, `@vaadin/*` Web Components, Hilla, Flow-Viritin, Flowing Code add-ons, Spring Boot); the MDN
    bullet cross-linking `xref:web/javascript/index.adoc[]`, `xref:web/typescript/index.adoc[]`,
    `xref:web/react/index.adoc[]`; and **one bullet per book** — Duarte *Practical Vaadin* (Apress; link
    https://link.springer.com/book/10.1007/978-1-4842-7179-7 , https://www.apress.com/ , the O'Reilly listing,
    and https://github.com/Apress/practical-vaadin ), Fränkel *Learning Vaadin 7* 2nd ed. (Packt; publisher
    page, packtpub.com, O'Reilly listing; noted as documenting the obsolete Vaadin 7 API), and Duarte *Vaadin 7
    UI Design By Example* (Packt; publisher page, packtpub.com, the Packt subscription listing; same note).
    **No book may be described as the primary or main source.**

- [x] Task 30. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 30.1. Append a `* xref:web/vaadin/index.adoc[Vaadin Reference] -- …` bullet to the `== Sections`
    list, **after** the Vue.js Reference bullet, summarising: the server-driven Java web framework — Flow (Java
    UI) and Hilla (React + type-safe endpoints), components and layouts, `Binder` data binding, `Grid`, routing,
    server push, the Element API, Lumo/Aura theming, Spring Boot and Jakarta EE integration, security, testing,
    and production deployment, plus a downloadable cheat sheet.
  - [x] Task 30.2. Extend that page's `:description:` and `:keywords:` to mention Vaadin, Vaadin Flow, Hilla,
    Java web framework, `Binder`, `Grid`, Lumo.

- [x] Task 31. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 31.1. `modules/ROOT/nav.adoc` — append a `*** xref:web/vaadin/index.adoc[Vaadin Reference]` block
    after the Vue.js Reference block (currently the file's last entry,
    `**** xref:web/vue/cheat-sheet.adoc[Cheat Sheet (PDF)]`), with one `**** xref:web/vaadin/<page>.adoc[…]`
    line per Group 2 page **in the Task 2–27 order**, ending
    `**** xref:web/vaadin/ui-component-libraries.adoc[UI Component Libraries]` then
    `**** xref:web/vaadin/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - [x] Task 31.2. `modules/ROOT/pages/index.adoc` — append a matching
    `** xref:web/vaadin/index.adoc[Vaadin Reference] -- …` entry to the `== Guides & References` list, after the
    Vue.js Reference entry (currently last, ~line 120), and update that page's `:description:` / `:keywords:`.
  - [x] Task 31.3. Confirm **no** project-picker icon or `xref:` block is added to
    `modules/ROOT/pages/index.adoc`'s project-picker section and **no** image is added to
    `modules/ROOT/images/` for the picker — consistent with every other Web Development subsection (choice 11).

- [x] Task 32. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context
  - [x] Task 32.1. Run the full Antora build through the agent:
    ```
    Agent({
      description: "Verify Antora build for the Vaadin Reference",
      subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` in /Users/albertoirurueta/repositories/common/docs.
        Report ONLY: the exit code; the count and full text of any ERROR lines; the count and full text of any
        WARN lines, calling out separately any 'skipping reference to missing attribute' warnings (with the
        file and attribute name) and any unresolved-xref warnings (with the source page and target). Then
        confirm whether these files exist under build/site/: web/vaadin/index.html,
        web/vaadin/cheat-sheet.html, web/vaadin/ui-component-libraries.html, and one .html per other
        web/vaadin page; and whether _attachments/vaadin-cheat-sheet.pdf and the six
        _images/vaadin-*.svg files are present. Do not paste the full build log."
    })
    ```
  - [x] Task 32.2. Require **exit 0, zero ERROR, zero WARN** — in particular **zero** "skipping reference to
    missing attribute" warnings (fix by escaping the offending literal braces as `\{ … }` in prose) and **zero**
    unresolved `xref:` warnings (fix the target path or the page name). Re-run Task 32.1 after each fix until
    clean.
  - [x] Task 32.3. Spot-check the rendered output: `build/site/web/vaadin/index.html` shows the grouped
    `== What's covered` list and the bibliography; the nav sidebar shows the Vaadin Reference block with all 28
    entries; `build/site/web/vaadin/cheat-sheet.html`'s download link resolves to
    `_attachments/vaadin-cheat-sheet.pdf`; every `[mermaid]` block rendered as a diagram (not as raw text); and
    the six `vaadin-*.svg` figures render and remain legible against both the light and dark site themes.
