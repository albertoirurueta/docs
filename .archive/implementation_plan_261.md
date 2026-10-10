# Implementation Plan: "PDF Generation" section under Backend Development

## Task summary

Source: GitHub issue #261
Base branch: main

Add a new documentation section **PDF Generation** under Guides & References -> Backend Development, in
`modules/ROOT/pages/backend/pdf-generation/`: 55 content pages (iText 9.8.x, JasperReports 7.0.x with v7 JRXML,
PAdES B-B/B-T/B-LT/B-LTA with iText, PDFBox and EU DSS, editable AcroForms, barcodes/QR codes incl. VeriFactu,
reports from databases, alternatives and migration) plus `cheat-sheet.adoc` and a one-page A4 PDF cheat sheet.
The full spec is the issue body plus two comments:

* Part 1 comment (https://github.com/albertoirurueta/docs/issues/261#issuecomment-6057185352): version baseline,
  the books B1-B3, outdated findings O1-O28, concept inventory, link caveats.
* Part 2 comment (https://github.com/albertoirurueta/docs/issues/261#issuecomment-6057185891): per-page concepts,
  official links, suggested figures, link-prefix legend and the *Bookshelf Billing* scenario.

Re-read both comments (`gh issue view 261 --comments`) before writing each page: **every page task below refers
to its row number in Part 2** and must cover that row's concepts, official links and figures, state the outdated
findings O* assigned to it, and follow the shared conventions.

### Choices made on the user's behalf

1. **One branch, one PR, groups mirror the issue's suggested PR split.** The issue proposes six PRs on
   `feature/261-pdf-generation`; this run uses the single branch `feature/261` created by `/iru-issue`. Groups 2-7
   follow the issue's split (foundations, iText, JasperReports, signatures, forms+barcodes, beyond), so the
   work can be cut into separate PRs later if the user prefers.
2. **Page-level independence inside a group.** A page only `xref:`s pages in the same or an earlier group (plus
   existing site pages). Forward links to later groups are added in Group 8's link pass, so intermediate builds
   have no unresolved `xref`.
3. **`index.adoc` skeleton in Group 1, completed in Group 8.** Every page links to
   `xref:backend/pdf-generation/index.adoc#_bibliography[...]` via the disclaimer, so the landing page must exist
   first. Nav entries and back-links are added once, in Group 8.
4. **Content-only, untagged tasks.** Repo has no application code and no `*-code-one-task` skill covers AsciiDoc
   (installed: java, dotnet, database, java-springboot), matching all prior documentation plans in `.archive/`
   (closest: `implementation_plan_93.md`, `_95.md`, `_98.md`).
5. **Cheat sheet PDF** is generated with Python `reportlab` (available locally); no generator is committed for the
   existing cheat sheets, so none is committed here either.
6. **Examples are verified where feasible** (compile/run signing, forms, barcode and report examples against the
   versions in the issue's baseline, with a throwaway Maven project in the scratchpad, never committed). Versions
   and dates are re-verified at writing time and written "as of <date>".

### Conventions every page task must follow (from the issue and `CLAUDE.md`)

* Skeleton: `= Title`, `:description:`, `:keywords:`, `include::partial$pdf-generation-disclaimer.adoc[]`, intro,
  `==` sections with examples, `== References`.
* The disclaimer is the **only** admonition (no NOTE/TIP/WARNING/CAUTION/IMPORTANT blocks or paragraphs); warnings
  are prose.
* Java 21, Spring Boot 4, iText 9.8.x (`itext-core` + `bouncy-castle-adapter`), JasperReports 7.0.x (v7 JRXML
  `<element kind="...">`), PDFBox 3.0.x, EU DSS 6.x, ZXing 3.5.x; complete runnable examples with imports and Maven
  coordinates on first use; each example followed by a link to the official doc page it derives from.
* No real certificates, keys, passwords, NIFs or customer data; test PKI generated on the page; `freetsa.org` and
  AEAT pre-production URLs only. State AGPL vs commercial for every iText add-on; state that JasperReports 7.0.8
  needs Professional for tagged PDF.
* Books B1-B3 are consulted only: no text, listing, figure or dataset reproduced; outdated points stated in prose.
* Images: `modules/ROOT/images/pdf-generation-*.svg`, bare filename, single-line `image::` macro at column 0 with
  blank lines around, alt text in double quotes when it contains a comma, light+dark theme safe, each SVG
  referenced by a page.
* Inline code containing `->`, `=>`, `...`, `'`, `{`, `$P{}`, `$F{}`, `$V{}`, `$R{}`, `#[`, `__`, `~`, `*`, `^` uses
  `` `+...+` ``; code containing `+` uses `` `pass:c[...]` ``.
* Mermaid: stereotypes as `&lt;&lt;x&gt;&gt;`.
* Gate for each group (delegate to the `iru-gate-runner` agent / a general sub-agent so build output stays out of the
  main context): `npx antora antora-playbook.yml` with no errors/warnings for the new files, then the `CLAUDE.md`
  grep checks scoped to the new files / `build/site/backend/pdf-generation`.

## Current code state

* Repo is the Antora root component `ROOT` (`antora.yml`); pages in `modules/ROOT/pages/`, images in
  `modules/ROOT/images/` (644 files), PDF cheat sheets in `modules/ROOT/attachments/` (e.g.
  `nodejs-cheat-sheet.pdf`, `thymeleaf-cheat-sheet.pdf`, `media-optimization-cheat-sheet.pdf`), disclaimers in
  `modules/ROOT/partials/<section>-disclaimer.adoc`.
* `modules/ROOT/pages/backend/` has sections `architecture axum docker fastapi flask graphql hibernate kubernetes
  media-optimization messaging nestjs nodejs oauth pyramid quarkus resilience scheduling spring-batch springboot
  tornado`; no `pdf-generation/` yet. Precedents: `backend/media-optimization/` (13 pages + cheat sheet, nav inline in
  `modules/ROOT/nav.adoc`), `backend/nodejs/` (~70 pages, nav via `partial$nav-nodejs.adoc`).
* `modules/ROOT/nav.adoc`: Media Optimization block is at lines 1530-1544 (`*** xref:backend/media-optimization/...`),
  immediately followed by `** xref:apps/index.adoc[Apps]`. Insert the new `***` block between them (the issue asks
  for inline nav entries).
* `modules/ROOT/pages/backend/index.adoc`: Media Optimization bullet at line 139; the `:description:`/`:keywords:`
  header (lines 2-3) lists each subsection and gets a PDF Generation mention.
* `modules/ROOT/pages/web/thymeleaf/emails-and-text-templates.adoc` line ~604: sentence "...in issue #261, covering
  JasperReports and iText among others" under "From email to PDF" to replace with `xref:`s.
* `modules/ROOT/pages/programming-languages/java/index.adoc`: add a PDF Generation mention if it lists where Java is
  used on the site.
* Existing pages to link instead of re-documenting: `programming-languages/java/*`, `backend/springboot/*`
  (`rest-apis`, `file-storage-and-object-stores`, `spring-data-jpa`, `spring-batch`, `scheduling-and-shedlock`),
  `backend/spring-batch/*`, `backend/scheduling/*`, `web/html-css/accessibility.adoc`,
  `cloud/aws/secrets-manager-and-kms.adoc`, `cloud/azure/key-vault-and-secrets.adoc`,
  `cloud/google-cloud/secret-manager-and-kms.adoc`, `backend/media-optimization/*`. Verify each target exists
  before writing the `xref:`. #262 (Apache POI) is mentioned in prose only.
* `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` validates diagrams (needs a one-off
  `npm i --no-save mermaid@11 jsdom`).
* Untracked `modules/ROOT/.DS_Store` must not be committed.

## Implementation steps


### Group 1 -- Foundation scaffolding: disclaimer partial and landing-page skeleton

Parallelizable: yes

- [x] Task 1. Create the disclaimer partial and landing-page skeleton
  - [x] Task 1.1. Create `modules/ROOT/partials/pdf-generation-disclaimer.adoc` with the exact `[IMPORTANT]` AI-assistance text and the bibliography pointer given in the issue (the only admonition in the section)
  - [x] Task 1.2. Create `modules/ROOT/pages/backend/pdf-generation/index.adoc` (Part 2 row 1): intro, *Bookshelf Billing* scenario, reading paths per role, page-map placeholder, Mermaid section map, and an empty-but-anchored `== Bibliography` heading (so `#_bibliography` resolves); no xrefs to unwritten pages yet
  - [x] Task 1.3. Re-verify at writing time the version baseline (iText Core, pdfHTML, JasperReports, PDFBox, DSS, ZXing) and the VeriFactu dates against Part 1 section 1 and record the verified values in the scratchpad for later groups
  - [x] Task 1.4. Run the group gate (Antora build + `CLAUDE.md` greps)

### Group 2 -- Foundations pages (Part 2 pages 2-6)

Parallelizable: yes

- [x] Task 2. Write `introduction-and-approaches.adoc` -- "Introduction & Approaches" (Part 2 row 2)
  - [x] Task 2.1. Create `modules/ROOT/pages/backend/pdf-generation/introduction-and-approaches.adoc` per row 2 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 2.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 3. Write `pdf-file-structure.adoc` -- "How a PDF File Works" (Part 2 row 3)
  - [x] Task 3.1. Create `modules/ROOT/pages/backend/pdf-generation/pdf-file-structure.adoc` per row 3 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 3.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 4. Write `pdf-standards-and-conformance.adoc` -- "PDF Standards & Conformance" (Part 2 row 4)
  - [x] Task 4.1. Create `modules/ROOT/pages/backend/pdf-generation/pdf-standards-and-conformance.adoc` per row 4 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 4.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 5. Write `getting-started-with-spring-boot.adoc` -- "Getting Started with Spring Boot" (Part 2 row 5)
  - [x] Task 5.1. Create `modules/ROOT/pages/backend/pdf-generation/getting-started-with-spring-boot.adoc` per row 5 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 5.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 6. Write `generating-reports-from-data.adoc` -- "Generating Reports from Databases & Services" (Part 2 row 6)
  - [x] Task 6.1. Create `modules/ROOT/pages/backend/pdf-generation/generating-reports-from-data.adoc` per row 6 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 6.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 7. Group 2 gate: build and validate
  - [x] Task 7.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix any xref/AsciiDoc warnings in this group's files
  - [x] Task 7.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/pdf-generation`, the admonition grep, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 7.3. Confirm every new SVG is referenced and that no `xref:` points to a not-yet-written page

### Group 3 -- iText pages (7-23)

Parallelizable: yes

- [x] Task 8. Write `itext-architecture-and-modules.adoc` -- "iText Architecture & Modules" (Part 2 row 7)
  - [x] Task 8.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-architecture-and-modules.adoc` per row 7 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 8.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 9. Write `itext-document-lifecycle.adoc` -- "Document Lifecycle" (Part 2 row 8)
  - [x] Task 9.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-document-lifecycle.adoc` per row 8 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 9.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 10. Write `itext-layout-elements.adoc` -- "Layout Elements" (Part 2 row 9)
  - [x] Task 10.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-layout-elements.adoc` per row 9 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 10.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 11. Write `itext-fonts-and-unicode.adoc` -- "Fonts & Unicode" (Part 2 row 10)
  - [x] Task 11.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-fonts-and-unicode.adoc` per row 10 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 11.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 12. Write `itext-colors-images-and-svg.adoc` -- "Colours, Images & SVG" (Part 2 row 11)
  - [x] Task 12.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-colors-images-and-svg.adoc` per row 11 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 12.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 13. Write `itext-tables.adoc` -- "Tables" (Part 2 row 12)
  - [x] Task 13.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-tables.adoc` per row 12 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 13.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 14. Write `itext-renderers-and-custom-layout.adoc` -- "Renderers & Custom Layout" (Part 2 row 13)
  - [x] Task 14.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-renderers-and-custom-layout.adoc` per row 13 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 14.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 15. Write `itext-page-events.adoc` -- "Page Events: Headers, Footers & Watermarks" (Part 2 row 14)
  - [x] Task 15.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-page-events.adoc` per row 14 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 15.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 16. Write `itext-low-level-canvas.adoc` -- "Low-level Canvas & Graphics" (Part 2 row 15)
  - [x] Task 16.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-low-level-canvas.adoc` per row 15 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 16.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 17. Write `itext-navigation-annotations-and-actions.adoc` -- "Navigation, Annotations & Actions" (Part 2 row 16)
  - [x] Task 17.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-navigation-annotations-and-actions.adoc` per row 16 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 17.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 18. Write `itext-manipulating-existing-pdfs.adoc` -- "Manipulating Existing PDFs" (Part 2 row 17)
  - [x] Task 18.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-manipulating-existing-pdfs.adoc` per row 17 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 18.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 19. Write `itext-text-extraction-and-parsing.adoc` -- "Text Extraction & Parsing" (Part 2 row 18)
  - [x] Task 19.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-text-extraction-and-parsing.adoc` per row 18 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 19.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 20. Write `itext-pdfhtml.adoc` -- "HTML to PDF with pdfHTML" (Part 2 row 19)
  - [x] Task 20.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-pdfhtml.adoc` per row 19 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 20.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 21. Write `itext-pdfa-and-pdfua.adoc` -- "PDF/A & PDF/UA with iText" (Part 2 row 20)
  - [x] Task 21.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-pdfa-and-pdfua.adoc` per row 20 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 21.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 22. Write `itext-encryption-and-permissions.adoc` -- "Encryption & Permissions" (Part 2 row 21)
  - [x] Task 22.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-encryption-and-permissions.adoc` per row 21 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 22.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 23. Write `itext-add-ons.adoc` -- "iText Add-ons" (Part 2 row 22)
  - [x] Task 23.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-add-ons.adoc` per row 22 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 23.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 24. Write `itext-testing-and-performance.adoc` -- "Testing & Performance with iText" (Part 2 row 23)
  - [x] Task 24.1. Create `modules/ROOT/pages/backend/pdf-generation/itext-testing-and-performance.adoc` per row 23 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 24.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 25. Group 3 gate: build and validate
  - [x] Task 25.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix any xref/AsciiDoc warnings in this group's files
  - [x] Task 25.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/pdf-generation`, the admonition grep, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 25.3. Confirm every new SVG is referenced and that no `xref:` points to a not-yet-written page

### Group 4 -- JasperReports pages (24-39)

Parallelizable: yes

- [x] Task 26. Write `jasperreports-architecture-and-lifecycle.adoc` -- "JasperReports Architecture & Lifecycle" (Part 2 row 24)
  - [x] Task 26.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-architecture-and-lifecycle.adoc` per row 24 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 26.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 27. Write `jasperreports-jrxml-design.adoc` -- "JRXML Report Design" (Part 2 row 25)
  - [x] Task 27.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-jrxml-design.adoc` per row 25 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 27.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 28. Write `jasperreports-expressions-parameters-fields-variables.adoc` -- "Expressions, Parameters, Fields & Variables" (Part 2 row 26)
  - [x] Task 28.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-expressions-parameters-fields-variables.adoc` per row 26 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 28.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 29. Write `jasperreports-groups-sorting-and-filtering.adoc` -- "Groups, Sorting & Filtering" (Part 2 row 27)
  - [x] Task 29.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-groups-sorting-and-filtering.adoc` per row 27 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 29.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 30. Write `jasperreports-data-sources.adoc` -- "Data Sources & Query Executers" (Part 2 row 28)
  - [x] Task 30.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-data-sources.adoc` per row 28 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 30.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 31. Write `jasperreports-subreports-datasets-tables-and-lists.adoc` -- "Subreports, Datasets, Tables & Lists" (Part 2 row 29)
  - [x] Task 31.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-subreports-datasets-tables-and-lists.adoc` per row 29 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 31.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 32. Write `jasperreports-crosstabs.adoc` -- "Crosstabs" (Part 2 row 30)
  - [x] Task 32.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-crosstabs.adoc` per row 30 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 32.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 33. Write `jasperreports-charts.adoc` -- "Charts" (Part 2 row 31)
  - [x] Task 33.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-charts.adoc` per row 31 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 33.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 34. Write `jasperreports-styles-templates-and-markup.adoc` -- "Styles, Templates & Markup" (Part 2 row 32)
  - [x] Task 34.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-styles-templates-and-markup.adoc` per row 32 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 34.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 35. Write `jasperreports-fonts-and-i18n.adoc` -- "Fonts & Internationalization" (Part 2 row 33)
  - [x] Task 35.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-fonts-and-i18n.adoc` per row 33 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 35.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 36. Write `jasperreports-scriptlets-and-extensions.adoc` -- "Scriptlets, Properties & Extensions" (Part 2 row 34)
  - [x] Task 36.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-scriptlets-and-extensions.adoc` per row 34 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 36.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 37. Write `jasperreports-hyperlinks-bookmarks-and-books.adoc` -- "Hyperlinks, Bookmarks & Report Books" (Part 2 row 35)
  - [x] Task 37.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-hyperlinks-bookmarks-and-books.adoc` per row 35 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 37.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 38. Write `jasperreports-pdf-exporter-configuration.adoc` -- "PDF Export Configuration" (Part 2 row 36)
  - [x] Task 38.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-pdf-exporter-configuration.adoc` per row 36 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 38.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 39. Write `jasperreports-large-reports-and-performance.adoc` -- "Large Reports & Performance" (Part 2 row 37)
  - [x] Task 39.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-large-reports-and-performance.adoc` per row 37 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 39.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 40. Write `jasperreports-spring-boot-integration.adoc` -- "Spring Boot Integration" (Part 2 row 38)
  - [x] Task 40.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-spring-boot-integration.adoc` per row 38 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 40.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 41. Write `jasperreports-security-hardening.adoc` -- "Security Hardening" (Part 2 row 39)
  - [x] Task 41.1. Create `modules/ROOT/pages/backend/pdf-generation/jasperreports-security-hardening.adoc` per row 39 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 41.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 42. Group 4 gate: build and validate
  - [x] Task 42.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix any xref/AsciiDoc warnings in this group's files
  - [x] Task 42.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/pdf-generation`, the admonition grep, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 42.3. Confirm every new SVG is referenced and that no `xref:` points to a not-yet-written page

### Group 5 -- Digital signatures (40-45) -- Must cover

Parallelizable: yes

- [x] Task 43. Write `digital-signatures-fundamentals.adoc` -- "Digital Signature Fundamentals" (Part 2 row 40)
  - [x] Task 43.1. Create `modules/ROOT/pages/backend/pdf-generation/digital-signatures-fundamentals.adoc` per row 40 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 43.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 44. Write `pades-baseline-levels.adoc` -- "PAdES Baseline Levels: B-B, B-T, B-LT, B-LTA" (Part 2 row 41)
  - [x] Task 44.1. Create `modules/ROOT/pages/backend/pdf-generation/pades-baseline-levels.adoc` per row 41 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 44.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 45. Write `signing-with-itext.adoc` -- "Signing PDFs with iText" (Part 2 row 42)
  - [x] Task 45.1. Create `modules/ROOT/pages/backend/pdf-generation/signing-with-itext.adoc` per row 42 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 45.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 46. Write `signing-with-pdfbox-and-eu-dss.adoc` -- "Signing with Apache PDFBox & EU DSS" (Part 2 row 43)
  - [x] Task 46.1. Create `modules/ROOT/pages/backend/pdf-generation/signing-with-pdfbox-and-eu-dss.adoc` per row 43 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 46.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 47. Write `remote-hsm-and-deferred-signing.adoc` -- "Remote, HSM & Deferred Signing" (Part 2 row 44)
  - [x] Task 47.1. Create `modules/ROOT/pages/backend/pdf-generation/remote-hsm-and-deferred-signing.adoc` per row 44 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 47.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 48. Write `signature-validation-and-long-term-validity.adoc` -- "Signature Validation & Long-term Validity" (Part 2 row 45)
  - [x] Task 48.1. Create `modules/ROOT/pages/backend/pdf-generation/signature-validation-and-long-term-validity.adoc` per row 45 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 48.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 49. Group 5 gate: build and validate
  - [x] Task 49.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix any xref/AsciiDoc warnings in this group's files
  - [x] Task 49.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/pdf-generation`, the admonition grep, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 49.3. Confirm every new SVG is referenced and that no `xref:` points to a not-yet-written page

### Group 6 -- Forms and barcodes/QR (46-52) -- Must cover

Parallelizable: yes

- [x] Task 50. Write `editable-forms-fundamentals.adoc` -- "Editable PDF Forms: Fundamentals" (Part 2 row 46)
  - [x] Task 50.1. Create `modules/ROOT/pages/backend/pdf-generation/editable-forms-fundamentals.adoc` per row 46 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 50.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 51. Write `editable-forms-with-itext.adoc` -- "Editable Forms with iText" (Part 2 row 47)
  - [x] Task 51.1. Create `modules/ROOT/pages/backend/pdf-generation/editable-forms-with-itext.adoc` per row 47 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 51.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 52. Write `editable-forms-with-jasperreports-and-pdfbox.adoc` -- "Editable Forms with JasperReports & PDFBox" (Part 2 row 48)
  - [x] Task 52.1. Create `modules/ROOT/pages/backend/pdf-generation/editable-forms-with-jasperreports-and-pdfbox.adoc` per row 48 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 52.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 53. Write `barcodes-and-qr-fundamentals.adoc` -- "Barcodes & QR Codes: Fundamentals" (Part 2 row 49)
  - [x] Task 53.1. Create `modules/ROOT/pages/backend/pdf-generation/barcodes-and-qr-fundamentals.adoc` per row 49 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 53.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 54. Write `barcodes-with-itext-and-zxing.adoc` -- "Barcodes with iText, ZXing & Okapi" (Part 2 row 50)
  - [x] Task 54.1. Create `modules/ROOT/pages/backend/pdf-generation/barcodes-with-itext-and-zxing.adoc` per row 50 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 54.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 55. Write `barcodes-in-jasperreports.adoc` -- "Barcodes in JasperReports" (Part 2 row 51)
  - [x] Task 55.1. Create `modules/ROOT/pages/backend/pdf-generation/barcodes-in-jasperreports.adoc` per row 51 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 55.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 56. Write `regulated-qr-codes.adoc` -- "Regulated QR Codes on Invoices & Payments" (Part 2 row 52)
  - [x] Task 56.1. Create `modules/ROOT/pages/backend/pdf-generation/regulated-qr-codes.adoc` per row 52 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 56.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 57. Group 6 gate: build and validate
  - [x] Task 57.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix any xref/AsciiDoc warnings in this group's files
  - [x] Task 57.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/pdf-generation`, the admonition grep, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 57.3. Confirm every new SVG is referenced and that no `xref:` points to a not-yet-written page

### Group 7 -- Beyond (53-55)

Parallelizable: yes

- [x] Task 58. Write `alternatives-and-other-ecosystems.adoc` -- "Alternatives & Other Ecosystems" (Part 2 row 53)
  - [x] Task 58.1. Create `modules/ROOT/pages/backend/pdf-generation/alternatives-and-other-ecosystems.adoc` per row 53 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 58.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 59. Write `testing-and-production.adoc` -- "Testing & Production Practices" (Part 2 row 54)
  - [x] Task 59.1. Create `modules/ROOT/pages/backend/pdf-generation/testing-and-production.adoc` per row 54 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 59.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 60. Write `whats-changed-and-migration.adoc` -- "What's Changed & Migration" (Part 2 row 55)
  - [x] Task 60.1. Create `modules/ROOT/pages/backend/pdf-generation/whats-changed-and-migration.adoc` per row 55 of Part 2: all listed concepts, code examples each followed by its official-doc link, the O* findings assigned to it stated in prose, `== References`
  - [x] Task 60.2. Create the row's suggested figures (`pdf-generation-*.svg` and/or Mermaid) and reference them from the page
- [x] Task 61. Group 7 gate: build and validate
  - [x] Task 61.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix any xref/AsciiDoc warnings in this group's files
  - [x] Task 61.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/pdf-generation`, the admonition grep, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 61.3. Confirm every new SVG is referenced and that no `xref:` points to a not-yet-written page

### Group 8 -- Finalization: cheat sheet, bibliography, nav, back-links, whole-section validation

Parallelizable: no -- tasks edit shared files (`index.adoc`, `nav.adoc`) and the final validation needs all of them

- [x] Task 62. Write `cheat-sheet.adoc` and the one-page PDF
  - [x] Task 62.1. Create `modules/ROOT/pages/backend/pdf-generation/cheat-sheet.adoc` summarising the section, linking `xref:attachment$pdf-generation-cheat-sheet.pdf[...]`, mirroring `backend/media-optimization/cheat-sheet.adoc`
  - [x] Task 62.2. Generate `modules/ROOT/attachments/pdf-generation-cheat-sheet.pdf` (single A4 page, colour-coded, matching the existing cheat sheets' look) covering: iText module map and lifecycle, layout/tables/events/fonts, JasperReports lifecycle/bands/expressions/data sources/exporter config, PDF/A and PDF/UA, PAdES levels and iText/PDFBox/DSS one-liners, AcroForm field types and builders vs `pdf.field.*`, barcode classes and QR EC levels, licences, migration from the books' APIs; verify it is exactly one page
- [x] Task 63. Complete `index.adoc`
  - [x] Task 63.1. Fill the page map with `xref:` links to all pages and the reading paths
  - [x] Task 63.2. Write `== Bibliography`: books B1-B3 (edition, year, targeted version; B3 states no publisher page exists), official documentation, standards/regulations, and the alternatives' official sites from page 53, every entry linked to its official site; check book links in a browser and other links with curl (see Part 1 section 5 for sites that block curl)
- [x] Task 64. Forward-link pass across pages
  - [x] Task 64.1. Add the `xref:` links between pages that were deferred because the target belonged to a later group; ensure every `xref:` target exists
  - [x] Task 64.2. Collect every outdated finding O1-O28 in `whats-changed-and-migration.adoc` and check each is also stated on its own page
- [x] Task 65. Add nav entries and back-links
  - [x] Task 65.1. Insert the `*** xref:backend/pdf-generation/index.adoc[PDF Generation]` block with 55 `****` children (Part 2 order) plus `Cheat Sheet (PDF)` in `modules/ROOT/nav.adoc` between the Media Optimization block and `** xref:apps/index.adoc[Apps]`
  - [x] Task 65.2. Add the PDF Generation bullet (and `:description:`/`:keywords:` terms) to `modules/ROOT/pages/backend/index.adoc` after Media Optimization
  - [x] Task 65.3. Replace the issue-#261 sentence in `modules/ROOT/pages/web/thymeleaf/emails-and-text-templates.adoc` with `xref:`s to `itext-pdfhtml.adoc` and `introduction-and-approaches.adoc`; make `itext-pdfhtml.adoc` link back
  - [x] Task 65.4. Add a PDF Generation mention to `modules/ROOT/pages/programming-languages/java/index.adoc` if it lists where Java is used on the site
- [x] Task 66. Whole-section validation against the acceptance criteria
  - [x] Task 66.1. Delegate to `iru-gate-runner`: full `npx antora antora-playbook.yml` with no xref/AsciiDoc errors or warnings; open `build/site/backend/pdf-generation` and spot-check the landing page, a signing page, a JasperReports page and the nav render
  - [x] Task 66.2. Run all `CLAUDE.md` greps (image macros, inline macros, `<p>image::`, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/backend/pdf-generation`), the admonition grep (`^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]` and `^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):` under `backend/pdf-generation/` must find nothing), `npm run validate:mermaid`
  - [x] Task 66.3. Check that all 8 mandatory SVGs exist (`file-structure`, `incremental-update`, `jasper-lifecycle`, `jasper-bands`, `signature-byterange`, `pades-levels`, `acroform-anatomy`, `qr-anatomy`), every `pdf-generation-*.svg` is referenced, every page includes the disclaimer and has `== References` (`grep -L`), and no book PDFs/text are in the repo
  - [x] Task 66.4. Confirm `git status` shows no `.DS_Store`, scratch Maven projects or generated `build/` files staged
