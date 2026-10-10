# Implementation Plan: "Office Files (Word and Excel with Apache POI)" section under Backend Development

## Task summary

Source: GitHub issue #262
Base branch: main

Add a new documentation section **Office Files (Word and Excel with Apache POI)** under Guides & References ->
Backend Development, in `modules/ROOT/pages/backend/office-files/`: 33 content pages (including `index.adoc`) plus
`cheat-sheet.adoc` and a one-page A4 PDF cheat sheet (`modules/ROOT/attachments/office-files-cheat-sheet.pdf`).
It covers generating Word/Excel reports on a Java server (export) and reading uploaded Word/Excel files (import)
with Apache POI 5.5.x (6.0 differences noted). The full spec is the issue body (`gh issue view 262`): the page
outline table (rows 1-34), the *Bookshelf* running scenario, the bibliography URL list, the 404 URL blacklist, the
cheat-sheet minimum content and the acceptance criteria. **Every page task below refers to its row number (`#`) in
the issue's "Page outline" table** and must cover that row's content, include its suggested figures, and follow the
shared conventions.

### Choices made on the user's behalf

1. **One branch, one PR, groups mirror the issue's suggested 4-PR split.** The branch is `feature/262` (created by
   `/iru-issue`). Groups 2-7 follow the issue's split (foundations, Excel, Word, cross-cutting, server workflows,
   cheat sheet) so the work can be cut into separate PRs later.
2. **Page-level independence inside a group.** A page only `xref:`s pages in the same or an earlier group (plus
   existing site pages). Forward links are added in Group 8's link pass, so intermediate builds have no unresolved
   `xref`.
3. **`index.adoc` skeleton in Group 1, completed in Group 8.** Every page links to
   `xref:backend/office-files/index.adoc#_bibliography[...]` via the disclaimer, so the landing page and an anchored
   `== Bibliography` heading must exist first. Nav entries and back-links are added once, in Group 8.
4. **Content-only, untagged tasks.** The repo has no application code and no installed `*-code-one-task` skill covers
   AsciiDoc, matching prior documentation plans in `.archive/` (closest: `implementation_plan_261.md`,
   `implementation_plan_242.md`).
5. **JSF page is now on `main`.** The issue said `web/jsf/file-upload-and-download.adoc` was unmerged and to be
   mentioned in prose only; it exists now, so the security page uses a real `xref:` to it (verify before writing).
   #263 stays prose only.
6. **Cheat sheet PDF** is generated with Python `reportlab` (5.0.0 available locally); no generator is committed,
   as for the existing cheat sheets.
7. **Examples are verified where feasible**: compile/run the key POI examples (XSSF/SXSSF export, SAX read, XWPF
   placeholder replacement, encryption, Spring download/upload) against POI 5.5.x in a throwaway Maven project in the
   scratchpad, never committed. Versions and dates are re-verified at writing time and written "as of <date>".

### Conventions every page task must follow (from the issue and `CLAUDE.md`)

* Skeleton: `= Title`, `:description:`, `:keywords:`, `include::partial$office-files-disclaimer.adoc[]` right after
  the header attributes, an intro stating versions (POI 5.5.x with 6.0 differences, Java 21+, Spring Boot 4.x /
  Spring Framework 7, Jakarta EE 11), `==` sections with detailed explanations and examples, `== References`.
* Per concept: what/why, POI component and jar, file-format mapping (OOXML part / OLE2 record), all relevant
  options (tables for settings and limits), memory/performance cost, pitfalls and security, 4.x -> 5.x -> 6.0 changes.
* Examples: complete and runnable, `[source,java]` with try-with-resources for every `Workbook`, `XWPFDocument`,
  `OPCPackage` and `POIFSFileSystem`, current APIs only (`CellType` enum, no `XSSFWorkbook(InputStream)` where a
  `File` is available); Maven in `[source,xml]`, Gradle Kotlin DSL in `[source,kotlin]`; HTTP calls in
  `[source,bash]` (curl) with output. **Each example is followed by a `Source:` link** to the official doc page it
  derives from (POI guide, Javadoc `https://poi.apache.org/apidocs/dev/...`, `poi-examples` on GitHub, Spring /
  Jakarta / Quarkus docs).
* *Bookshelf* scenario for all examples (`books-inventory.xlsx`, `loans-report.xlsx`, `loan-letter.docx`,
  `monthly-report.docx`, `books-import.xlsx`, `book-request-form.docx`); original, not copied from tutorials.
* State honestly what POI does not provide (no .docx/.xlsx -> PDF, no XWPF template/mail-merge API, no XDDF chart
  guide, SXSSF window default and `XSSFSheetXMLHandler` internals only from Javadoc/examples).
* No real secrets/passwords; encryption examples read the password from configuration.
* Images: `modules/ROOT/images/office-files-*.svg`, bare filename, single-line `image::` macro at column 0 with blank
  lines around, alt text in double quotes when it contains a comma, original drawings, light+dark safe, each SVG
  referenced by a page. Mermaid blocks where 📊 is suggested; stereotypes as `&lt;&lt;x&gt;&gt;`.
* Inline code containing `->`, `=>`, `...`, `'`, `{`, `${placeholder}`, `*`, `~`, `^`, `__`, `#[` (e.g. `List<?>`,
  `SUM(A1:A10)*2`, `"$#,##0.00"`) uses `` `+...+` ``; code containing `+` uses `` `pass:c[...]` ``.
* ★ pages (rows 2, 5, 6, 8, 14, 15, 17, 20, 26, 27, 28) are the most detailed pages of the section.
* Bibliography URLs are taken from the issue; never use the 404 URLs it lists.
* Gate for each group (delegate to the `iru-gate-runner` agent, or a general sub-agent, so build output stays out of
  the main context): `npx antora antora-playbook.yml` with no errors/warnings for the new files, then the
  `CLAUDE.md` grep checks scoped to the new files and `build/site/backend/office-files`, and `npm run validate:mermaid`.

## Current code state

* Repo is the Antora root component `ROOT` (`antora.yml`); pages in `modules/ROOT/pages/`, images in
  `modules/ROOT/images/`, PDF cheat sheets in `modules/ROOT/attachments/` (e.g. `vaadin-cheat-sheet.pdf`,
  `vue-cheat-sheet.pdf`), disclaimers in `modules/ROOT/partials/<section>-disclaimer.adoc`
  (`flask-disclaimer.adoc` is the template: `[IMPORTANT]` block with the AI-assistance text and an `xref:` to the
  section's `#_bibliography`).
* `modules/ROOT/pages/backend/` has `architecture axum docker fastapi flask graphql hibernate kubernetes
  media-optimization messaging nestjs nodejs oauth pdf-generation pyramid quarkus resilience scheduling spring-batch
  springboot tornado`; no `office-files/` yet. Closest precedent: `backend/pdf-generation/` (index + 55 pages + cheat
  sheet; disclaimer `pdf-generation-disclaimer.adoc`).
* `modules/ROOT/nav.adoc`: the backend Media Optimization block starts at line 1530
  (`*** xref:backend/media-optimization/index.adoc[Media Optimization]`) and is followed by
  `** xref:apps/index.adoc[Apps]`; the new `***` block (with `****` children, ending in the cheat sheet) goes between
  them. Re-check exact lines at write time: the PDF Generation block may already sit in that area.
* `modules/ROOT/pages/backend/index.adoc`: `:description:` already lists PDF Generation; the Media Optimization bullet
  is at line 139. Add an Office Files bullet after the last section bullet (end with "plus a downloadable cheat
  sheet"), update `:description:` and extend `:keywords:` with the list from the issue.
* `modules/ROOT/pages/index.adoc`: no tile; update `:description:`/`:keywords:` (add `Apache POI, Excel, Word`).
* Back-link targets (all exist): `programming-languages/java/io-and-files.adoc`,
  `backend/springboot/rest-apis.adoc`, `backend/springboot/file-storage-and-object-stores.adoc`,
  `backend/spring-batch/item-readers-files.adoc`, `web/vaadin/grid.adoc`; each gets a one-line pointer.
* Existing pages to link instead of re-documenting: `programming-languages/java/*`, `backend/springboot/*`,
  `backend/spring-batch/*`, `backend/scheduling/*`, `backend/messaging/*`, `backend/oauth/*`,
  `backend/springboot/spring-security.adoc`, `web/vaadin/*`, `web/django/responses-streaming-csv-and-pdf.adoc`,
  `web/jsf/file-upload-and-download.adoc`, `backend/pdf-generation/*` (for PDF conversion alternatives). Verify each
  target exists before writing an `xref:`.
* `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` validates diagrams (needs a one-off
  `npm i --no-save mermaid@11 jsdom`).
* Untracked `modules/ROOT/.DS_Store` must not be committed.

## Implementation steps

### Group 1 -- Foundation scaffolding: disclaimer partial and landing-page skeleton

Parallelizable: yes

- [x] Task 1. Create the disclaimer partial and landing-page skeleton
  - [x] Task 1.1. Create `modules/ROOT/partials/office-files-disclaimer.adoc`, copying `flask-disclaimer.adoc` with the `xref:` pointing at `backend/office-files/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 1.2. Create `modules/ROOT/pages/backend/office-files/index.adoc` (row 1): intro, export path vs import path, version baseline, Mermaid "choose your page" flow, page-list placeholder (no xrefs to unwritten pages), and an empty-but-anchored `== Bibliography` heading
  - [x] Task 1.3. Re-verify at writing time the version baseline (POI latest release and whether 6.0 shipped, XMLBeans, spring-batch-excel, Spring Boot, Jakarta EE) and record the verified values in the scratchpad for later groups
  - [x] Task 1.4. Run the group gate (Antora build + `CLAUDE.md` greps + `npm run validate:mermaid`)

### Group 2 -- Foundations pages (rows 2-4)

Parallelizable: yes

- [x] Task 2. Write `introduction-and-architecture.adoc` -- "Introduction & Architecture" ★ (row 2)
  - [x] Task 2.1. Create the page per row 2: all listed concepts, examples each followed by its `Source:` link, `== References`
  - [x] Task 2.2. Create `office-files-component-map.svg` and the API-levels Mermaid diagram and reference them
- [x] Task 3. Write `setup-and-dependencies.adoc` -- "Setup & Dependencies" (row 3)
  - [x] Task 3.1. Create the page per row 3 (Maven/Gradle coordinates, lite vs full, logging bridge, JPMS, `NoClassDefFoundError` fix, dependency table)
- [x] Task 4. Write `file-formats-ooxml-and-ole2.adoc` -- "File Formats: OOXML & OLE2" (row 4)
  - [x] Task 4.1. Create the page per row 4 (OPC packaging, POIFS, MIME types, limits table)
  - [x] Task 4.2. Create `office-files-xlsx-package.svg` and `office-files-docx-package.svg` and reference them
- [x] Task 5. Group 2 gate: build and validate
  - [x] Task 5.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix xref/AsciiDoc warnings in this group's files
  - [x] Task 5.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/office-files`, and `npm run validate:mermaid`; all must print nothing / parse every diagram
  - [x] Task 5.3. Confirm every new SVG is referenced and no `xref:` points to a not-yet-written page

### Group 3 -- Excel pages (rows 5-16)

Parallelizable: yes

- [x] Task 6. Write `spreadsheet-usermodel-basics.adoc` ★ (row 5)
  - [x] Task 6.1. Create the page per row 5, including the `ss.usermodel` class-diagram Mermaid
- [x] Task 7. Write `cell-styles-fonts-and-formats.adoc` ★ (row 6)
  - [x] Task 7.1. Create the page per row 6, including the style-cache pattern
  - [x] Task 7.2. Create `office-files-style-sharing.svg` and reference it
- [x] Task 8. Write `dates-numbers-and-dataformatter.adoc` (row 7)
  - [x] Task 8.1. Create the page per row 7, with the format code -> displayed value table
- [x] Task 9. Write `formulas-and-evaluation.adoc` ★ (row 8)
  - [x] Task 9.1. Create the page per row 8, including the parse -> RPN `Ptg` -> evaluate Mermaid
- [x] Task 10. Write `sheet-layout-and-printing.adoc` (row 9)
  - [x] Task 10.1. Create the page per row 9
- [x] Task 11. Write `data-validation-and-conditional-formatting.adoc` (row 10)
  - [x] Task 11.1. Create the page per row 10
- [x] Task 12. Write `tables-named-ranges-and-pivot-tables.adoc` (row 11)
  - [x] Task 12.1. Create the page per row 11
- [x] Task 13. Write `images-charts-comments-and-hyperlinks.adoc` (row 12)
  - [x] Task 13.1. Create the page per row 12, deriving charts from the official examples/Javadoc (state there is no XDDF guide)
  - [x] Task 13.2. Add the rendered-result figure of the Bookshelf chart (SVG `office-files-*.svg`) and reference it
- [x] Task 14. Write `templates-and-modifying-workbooks.adoc` (row 13)
  - [x] Task 14.1. Create the page per row 13, including the template -> fill -> write Mermaid
- [x] Task 15. Write `streaming-writes-with-sxssf.adoc` ★ (row 14)
  - [x] Task 15.1. Create the page per row 14
  - [x] Task 15.2. Create `office-files-sxssf-window.svg` and reference it
- [x] Task 16. Write `streaming-reads-event-and-sax-apis.adoc` ★ (row 15)
  - [x] Task 16.1. Create the page per row 15, including the SAX callbacks sequence-diagram Mermaid and the usermodel vs event table
- [x] Task 17. Write `legacy-xls-with-hssf.adoc` (row 16)
  - [x] Task 17.1. Create the page per row 16
- [x] Task 18. Group 3 gate: build and validate (same checks as Task 5, scoped to this group; xrefs only to Groups 1-3 pages)

### Group 4 -- Word pages (rows 17-22)

Parallelizable: yes

- [x] Task 19. Write `word-xwpf-basics.adoc` ★ (row 17)
  - [x] Task 19.1. Create the page per row 17, including the XWPF class-diagram Mermaid
  - [x] Task 19.2. Create `office-files-xwpf-runs.svg` and reference it
- [x] Task 20. Write `word-tables-lists-and-images.adoc` (row 18)
  - [x] Task 20.1. Create the page per row 18
- [x] Task 21. Write `word-headers-footers-sections-and-fields.adoc` (row 19)
  - [x] Task 21.1. Create the page per row 19
- [x] Task 22. Write `word-templates-and-placeholder-replacement.adoc` ★ (row 20)
  - [x] Task 22.1. Create the page per row 20: state there is no template API, show a robust replace-across-runs algorithm, add the load -> find -> merge runs -> write Mermaid; poi-tl / XDocReport in prose and links only
- [x] Task 23. Write `word-charts-and-embedded-objects.adoc` (row 21)
  - [x] Task 23.1. Create the page per row 21
- [x] Task 24. Write `legacy-doc-with-hwpf.adoc` (row 22)
  - [x] Task 24.1. Create the page per row 22
- [x] Task 25. Group 4 gate: build and validate (same checks as Task 5, scoped to this group)

### Group 5 -- Cross-cutting pages (rows 23-26)

Parallelizable: yes

- [x] Task 26. Write `text-extraction-and-apache-tika.adoc` (row 23)
  - [x] Task 26.1. Create the page per row 23
- [x] Task 27. Write `document-properties-and-metadata.adoc` (row 24)
  - [x] Task 27.1. Create the page per row 24
- [x] Task 28. Write `encryption-signing-and-protection.adoc` (row 25)
  - [x] Task 28.1. Create the page per row 25 with the encrypt/decrypt Mermaid; passwords read from configuration
- [x] Task 29. Write `security-and-untrusted-files.adoc` ★ (row 26)
  - [x] Task 29.1. Create the page per row 26, including formula injection, `ZipSecureFile`/`IOUtils` limits, upload validation and CVE history; `xref:` to `web/jsf/file-upload-and-download.adoc` and `web/django/responses-streaming-csv-and-pdf.adoc` after verifying they exist
  - [x] Task 29.2. Create `office-files-untrusted-file-pipeline.svg` and reference it
- [x] Task 30. Write the Group 5 gate: build and validate (same checks as Task 5, scoped to this group)

### Group 6 -- Server import/export workflows (rows 27-33)

Parallelizable: yes

- [x] Task 31. Write `exporting-reports-from-a-server.adoc` ★ (row 27)
  - [x] Task 31.1. Create the page per row 27 (Spring MVC, Jakarta REST, Quarkus, async jobs, Word report endpoint) with the two sequence-diagram Mermaids
- [x] Task 32. Write `importing-data-from-excel.adoc` ★ (row 28)
  - [x] Task 32.1. Create the page per row 28 with the upload -> detect -> parse -> validate -> persist/reject Mermaid
  - [x] Task 32.2. Create `office-files-import-error-report.svg` and reference it
- [x] Task 33. Write `importing-data-from-word.adoc` (row 29)
  - [x] Task 33.1. Create the page per row 29
- [x] Task 34. Write `batch-import-export-with-spring-batch.adoc` (row 30)
  - [x] Task 34.1. Create the page per row 30 (spring-batch-excel 0.3.0 status verified at writing time), linking back to `backend/spring-batch/item-readers-files.adoc` and `item-writers-files.adoc`
- [x] Task 35. Write `performance-memory-and-threading.adoc` (row 31)
  - [x] Task 35.1. Create the page per row 31 with the "which API?" decision table / Mermaid flow
- [x] Task 36. Write `testing-office-documents.adoc` (row 32)
  - [x] Task 36.1. Create the page per row 32
- [x] Task 37. Write `whats-changed-and-migration.adoc` (row 33)
  - [x] Task 37.1. Create the page per row 33 with the version-timeline Mermaid `timeline` (or SVG `office-files-poi-timeline.svg`, referenced)
- [x] Task 38. Group 6 gate: build and validate (same checks as Task 5, scoped to this group)

### Group 7 -- Cheat sheet page and PDF (row 34)

Parallelizable: yes

- [x] Task 39. Create the cheat sheet
  - [x] Task 39.1. Create `modules/ROOT/pages/backend/office-files/cheat-sheet.adoc` ("Cheat Sheet (PDF)"): disclaimer include, short on-page summary, `link:{attachmentsdir}/office-files-cheat-sheet.pdf[Download the cheat sheet (PDF)]` (same mechanism as the other sections)
  - [x] Task 39.2. Generate `modules/ROOT/attachments/office-files-cheat-sheet.pdf` with `reportlab`, a single A4 page covering every item of the issue's "Cheat sheet" minimum-content list; render it to an image and check it is legible and fits one page
  - [x] Task 39.3. Run the Group 7 gate (Antora build, greps)

### Group 8 -- Index completion, nav, back-links and final verification

Parallelizable: no -- Task 41 and Task 42 edit shared files and depend on all pages from Groups 1-7 existing; Task 40 must land before them.

- [x] Task 40. Complete `backend/office-files/index.adoc`
  - [x] Task 40.1. Replace the page-list placeholder with the full page list in outline order (`xref:` to every page and the cheat sheet)
  - [x] Task 40.2. Fill `== Bibliography` with every source from the issue's Bibliography section, each linked to its official site, excluding the blacklisted 404 URLs
  - [x] Task 40.3. Add forward cross-links between pages where Group isolation postponed them
- [x] Task 41. Navigation and landing pages
  - [x] Task 41.1. `modules/ROOT/nav.adoc`: add `*** xref:backend/office-files/index.adoc[Office Files (Word and Excel with Apache POI)]` after the last Media Optimization (backend) child and before `** xref:apps/index.adoc[Apps]`, with `****` children in outline order ending with the cheat sheet; labels identical to each page's `= Title`
  - [x] Task 41.2. `modules/ROOT/pages/backend/index.adoc`: add the Office Files bullet, update `:description:` and extend `:keywords:` with the issue's list
  - [x] Task 41.3. `modules/ROOT/pages/index.adoc`: mention Office files / Apache POI in `:description:` and add `Apache POI, Excel, Word` to `:keywords:`
- [x] Task 42. Back-links (one line each, verified targets)
  - [x] Task 42.1. Add pointers in `programming-languages/java/io-and-files.adoc`, `backend/springboot/rest-apis.adoc`, `backend/springboot/file-storage-and-object-stores.adoc`, `backend/spring-batch/item-readers-files.adoc` and `web/vaadin/grid.adoc` (also `web/vaadin/ui-component-libraries.adoc` if it mentions the Excel/DOCX export)
  - [x] Task 42.2. Add the `xref:` from `web/jsf/file-upload-and-download.adoc` to the security page
- [x] Task 43. Final verification (delegate to `iru-gate-runner`)
  - [x] Task 43.1. Run `npx antora antora-playbook.yml` for the whole site: no errors or warnings for the new files; spot-check the section rendering in `build/site/backend/office-files`
  - [x] Task 43.2. Run all `CLAUDE.md` greps (block/inline `image::` closure, `<p>image::` leak, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/backend/office-files`) and `npm run validate:mermaid`
  - [x] Task 43.3. Check that every `office-files-*.svg` is referenced, every `image::` target exists, every page has `== References` and the disclaimer include, every page except `index.adoc` is linked from `index.adoc` and the nav, and no admonition other than the disclaimer was introduced
  - [x] Task 43.4. Ensure `modules/ROOT/.DS_Store` and build output are not staged
