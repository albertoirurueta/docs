# Implementation Plan: "Apache Tika" section under Backend Development

## Task summary

Source: GitHub issue #286
Base branch: main

Add a new documentation section **Apache Tika** under Guides & References -> Backend Development, in
`modules/ROOT/pages/backend/apache-tika/`: 31 content pages (including `index.adoc`) plus `cheat-sheet.adoc` and a
one-page A4 PDF cheat sheet (`modules/ROOT/attachments/apache-tika-cheat-sheet.pdf`). It teaches Apache Tika 4.1.x
(3.3.x differences noted, 3.x supported until March 2027) as a Java library, a CLI, a REST/gRPC service and a Tika Pipes
pipeline feeding search and RAG. The full spec is the issue body (`gh issue view 286`): the page outline tables
(rows 1-32), the *Bookshelf* intake scenario, the book-vs-docs table, the "things the docs do not provide" list, the
bibliography URL list, the 404 URL blacklist, the cheat-sheet minimum content and the acceptance criteria. **Every page
task below refers to its row number (`#`) in the issue's "Page outline" tables** and must cover that row's content,
include its suggested figures, and follow the shared conventions.

### Choices made on the user's behalf

1. **One branch, one PR, groups mirror the issue's suggested 5-PR split.** Branch `feature/286` (created by
   `/iru-issue`). Groups 2-6 follow the split (foundations, core, configuration, running, integrations) so the work can
   be cut into separate PRs later; the cheat sheet and the link pass are separate groups.
2. **Page-level independence inside a group.** A page only `xref:`s pages in the same or an earlier group (plus existing
   site pages). Forward links are added in Group 8's link pass, so intermediate builds have no unresolved `xref`.
3. **`index.adoc` skeleton in Group 1, completed in Group 8.** Every page links to
   `xref:backend/apache-tika/index.adoc#_bibliography[...]` via the disclaimer, so the landing page and an anchored
   `== Bibliography` heading must exist first. Nav entries and back-links are added once, in Group 8.
4. **Content-only, untagged tasks.** This is an AsciiDoc-only repo and no installed `*-code-one-task` skill covers it,
   matching the archived plans for #262 and #261.
5. **Facts are re-verified at writing time.** The issue's facts were verified 2026-10-10 against sources that include an
   AI-assisted docs site; Group 1 re-checks versions, dates, CVEs and key names, and later groups verify JSON config
   keys, metadata keys (`tk:` vs `X-TIKA:`) and CLI flags against the Javadoc, source and, where feasible, a running
   Tika 4.1.x. Anything unverifiable is stated honestly, never invented.
6. **Examples verified where feasible**: compile/run the key examples (facade, `AutoDetectParser`, `PipesForkParser`,
   `RecursiveParserWrapper`, `TikaLoader` config, tika-server calls, Spring Boot upload endpoint) against Tika 4.1.x in
   a throwaway Maven project in the scratchpad, never committed.
7. **Cheat sheet PDF** is generated with Python `reportlab`; no generator is committed, as for the existing cheat sheets.
8. **#263 is referenced in prose only**; no `xref:` to pages that don't exist.

### Conventions every page task must follow (from the issue and `CLAUDE.md`)

* Skeleton: `= Title`, `:description:`, `:keywords:`, `include::partial$apache-tika-disclaimer.adoc[]` right after the
  header attributes, an intro stating the versions (Apache Tika 4.1.x with 3.3.x differences, Java 21+ with Tika 4.x
  needing 17+, Spring Boot 4.x / Spring Framework 7, Docker `apache/tika:4.1.x`), `==` sections with detailed
  explanations and examples, `== References` (official sources only; *Tika in Action* cited with its chapter where used).
* Per concept: what/why, implementing Tika module/artifact, every relevant option/class/endpoint/CLI flag/JSON key
  (tables for settings and limits), memory/performance/robustness cost, pitfalls and security, and 1.x (book) -> 2.x ->
  3.x -> 4.x changes.
* Examples: complete and runnable, `[source,java]` with try-with-resources for every `TikaInputStream`,
  `PipesForkParser` and other closeable, current 4.x APIs only (3.x forms only in clearly labelled blocks); config in
  `[source,json]` (`tika-config.json`) with the 3.x `[source,xml]` equivalent where it helps; Maven `[source,xml]` and
  Gradle `[source,kotlin]`; CLI/HTTP in `[source,bash]` with output. **Each example is followed by a link to the
  official page it derives from** (4.1.x docs, 3.x guide, wiki, Javadoc `https://tika.apache.org/4.1.0/api/...`,
  `tika-example` on GitHub, Spring/Solr/Elasticsearch docs), e.g. `Source: https://...[Title]`.
* *Bookshelf* intake scenario for all examples with the original sample files listed in the issue (`manuscript.docx`,
  `catalogue.pdf`, `scanned-loan-form.pdf`, `book-cover.jpg`, `publisher-email.eml` + `samples.zip`, `novel.epub`,
  `reviews-es.html`, `reseñas-fr.txt`, `legacy-catalogue.txt` in windows-1252, `renamed-invoice.png`); original, not
  copied from tutorials or the book.
* State honestly what the docs do not provide (no official Spring Boot starter, tika-app CLI "in flux" for 4.x, no
  layout/table recovery, tika-python third-party, 3.x-era wiki pages labelled as 3.x).
* No real secrets; VLM/inference/cloud-fetcher examples read credentials from environment variables.
* Images: `modules/ROOT/images/apache-tika-*.svg`, bare filename, single-line `image::` macro at column 0 with blank
  lines around, alt text in double quotes when it contains a comma, original drawings (no Tika logo), light+dark safe,
  each SVG referenced by a page. Mermaid blocks where 📊 is suggested (a floor, not a ceiling); stereotypes written as
  `&lt;&lt;interface&gt;&gt;`.
* Inline code containing `->`, `=>`, `<=`, `<-`, `__`, `#[`, `~`, `*`, `^`, `...`, `'` or `{` (e.g. `application/*`,
  `${ENV_VAR}`, `tk:*`, `X-TIKA:*`, JSON fragments) uses `` `+...+` ``; code containing `+` uses `` `pass:c[...]` ``.
* ★ pages (rows 2, 5, 7, 8, 9, 10, 13, 14, 15, 19, 22, 23, 24, 25) are the most detailed pages of the section.
* Bibliography URLs are taken from the issue; never use the 404 URLs it lists.
* Gate for each group (delegate to the `iru-gate-runner` agent, or a general sub-agent, so build output stays out of the
  main context): `npx antora antora-playbook.yml` with no errors/warnings for the new files, then the `CLAUDE.md` grep
  checks scoped to the new files and `build/site/backend/apache-tika`, and `npm run validate:mermaid` (needs a one-off
  `npm i --no-save mermaid@11 jsdom`).

## Current code state

* Repo is the Antora root component `ROOT` (`antora.yml`); pages in `modules/ROOT/pages/`, images in
  `modules/ROOT/images/`, PDF cheat sheets in `modules/ROOT/attachments/`, disclaimers in
  `modules/ROOT/partials/<section>-disclaimer.adoc` (`office-files-disclaimer.adoc` is the template: AI-assistance
  disclosure plus an `xref:` to the section's `#_bibliography`). There is no `docs/` directory.
* `modules/ROOT/pages/backend/` has `architecture axum docker fastapi flask graphql hibernate kubernetes
  media-optimization messaging nestjs nodejs oauth office-files pdf-generation pyramid quarkus resilience scheduling
  spring-batch springboot tornado`; no `apache-tika/` yet. Closest precedent: `backend/office-files/` (34 pages + cheat
  sheet; disclaimer `office-files-disclaimer.adoc`; archived plan `.archive/implementation_plan_262.md`).
* `modules/ROOT/nav.adoc`: the Office Files block ends at line 1713
  (`**** xref:backend/office-files/cheat-sheet.adoc[Cheat Sheet (PDF)]`), followed by `** xref:apps/index.adoc[Apps]`.
  The new `***` block goes between them. Re-check exact lines at write time.
* `modules/ROOT/pages/backend/index.adoc`: add an Apache Tika bullet after the Office Files bullet, update
  `:description:`, extend `:keywords:` with the issue's list.
* `modules/ROOT/pages/index.adoc`: no tile; update `:description:`/`:keywords:`.
* Back-link targets (all exist, verified): `backend/office-files/text-extraction-and-apache-tika.adoc`,
  `database/solr/indexing-and-updates.adoc`, `ai/rag-systems/document-parsing.adoc`,
  `web/jsf/primefaces-files-media-charts-and-drag-drop.adoc`, `programming-languages/java/io-and-files.adoc`; each
  gets a one-line pointer.
* Existing pages to link instead of re-documenting (verify each target exists before writing an `xref:`):
  `backend/office-files/*`, `backend/pdf-generation/*`, `database/solr/*`, `database/lucene/*`,
  `database/elasticsearch/ingest-pipelines.adoc`, `ai/rag-systems/*`, `database/vector-rag/document-ingestion-and-chunking.adoc`,
  `backend/springboot/rest-apis.adoc`, `backend/springboot/file-storage-and-object-stores.adoc`, `backend/docker/*`,
  `backend/kubernetes/*`, `backend/messaging/*`, `programming-languages/java/io-and-files.adoc`.
* `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` validates diagrams; `node_modules` exists.
* Untracked `api2.txt` and `modules/ROOT/.DS_Store` must not be committed.

## Implementation steps

### Group 1 -- Foundation scaffolding: disclaimer partial and landing-page skeleton

Parallelizable: yes

- [x] Task 1. Create the disclaimer partial and landing-page skeleton
  - [x] Task 1.1. Create `modules/ROOT/partials/apache-tika-disclaimer.adoc`, copying `office-files-disclaimer.adoc` with the `xref:` pointing at `backend/apache-tika/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 1.2. Create `modules/ROOT/pages/backend/apache-tika/index.adoc` (row 1): intro, library path vs service/pipeline path, version baseline (4.1.x, 3.3.x supported to March 2027, with the site-vs-wiki roadmap discrepancy), book-vs-docs note, Mermaid "choose your page" flow, page-list placeholder (no xrefs to unwritten pages), and an empty-but-anchored `== Bibliography` heading
  - [x] Task 1.3. Re-verify at writing time the version baseline (latest 4.x/3.x releases, a possible 4.2, 3.x end of support, Java requirements, Docker tags, CVE-2025-54988 / CVE-2025-66516, Spring Boot) and record the verified values in the scratchpad for later groups
  - [x] Task 1.4. Run the group gate (Antora build + `CLAUDE.md` greps + `npm run validate:mermaid`)

### Group 2 -- Foundations pages (rows 2-4)

Parallelizable: yes

- [x] Task 2. Write `introduction-and-architecture.adoc` -- "Introduction & Architecture" ★ (row 2)
  - [x] Task 2.1. Create the page per row 2: all listed concepts, examples each followed by a `Source:` link, `== References`
  - [x] Task 2.2. Create `apache-tika-architecture.svg` and the module-map Mermaid and reference them
- [x] Task 3. Write `setup-and-installation.adoc` -- "Setup & Installation" (row 3)
  - [x] Task 3.1. Create the page per row 3 (Maven/Gradle coordinates incl. `tika-parsers-standard-package` as `<type>pom</type>`, zip distributions, Docker quick start, Java 17, logging, dependency clashes with POI/PDFBox, 3.x vs 4.x table)
- [x] Task 4. Write `getting-started-with-the-tika-facade.adoc` -- "Getting Started with the Tika Facade" (row 4)
  - [x] Task 4.1. Create the page per row 4 (first Bookshelf program on `manuscript.docx` and `catalogue.pdf`)
- [x] Task 5. Group 2 gate: build and validate
  - [x] Task 5.1. Delegate to `iru-gate-runner`: `npx antora antora-playbook.yml`; fix xref/AsciiDoc warnings in this group's files
  - [x] Task 5.2. Run the three `image::` greps, the inline-macro grep, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/apache-tika`, and `npm run validate:mermaid`; all must print nothing / parse every diagram
  - [x] Task 5.3. Confirm every new SVG is referenced and no `xref:` points to a not-yet-written page

### Group 3 -- Core concepts pages (rows 5-12)

Parallelizable: yes

- [x] Task 6. Write `media-types-and-detection.adoc` ★ (row 5)
  - [x] Task 6.1. Create the page per row 5, linking the JSF upload page as an applied example
  - [x] Task 6.2. Create `apache-tika-detection-pipeline.svg` and reference it
- [x] Task 7. Write `character-encoding-detection.adoc` (row 6)
  - [x] Task 7.1. Create the page per row 6 with the encoding-detector pipeline Mermaid and the `legacy-catalogue.txt` example
- [x] Task 8. Write `parser-api-and-autodetectparser.adoc` ★ (row 7)
  - [x] Task 8.1. Create the page per row 7 with the parse sequence-diagram Mermaid
- [x] Task 9. Write `content-handlers-and-output-formats.adoc` ★ (row 8)
  - [x] Task 9.1. Create the page per row 8, showing the same document in every output format
  - [x] Task 9.2. Create `apache-tika-xhtml-output.svg` and reference it
- [x] Task 10. Write `metadata.adoc` ★ (row 9)
  - [x] Task 10.1. Create the page per row 9 with the 1.x -> 3.x -> 4.x key-mapping table; verify the `tk:` key names against the Javadoc/source
- [x] Task 11. Write `embedded-documents-and-recursive-parsing.adoc` ★ (row 10)
  - [x] Task 11.1. Create the page per row 10 with the `publisher-email.eml` -> `samples.zip` walkthrough and the embedded-document tree Mermaid
  - [x] Task 11.2. Create `apache-tika-rmeta-list.svg` and reference it
- [x] Task 12. Write `language-detection-and-translation.adoc` (row 11)
  - [x] Task 12.1. Create the page per row 11 with the language-detection flow Mermaid; state translation maintenance status honestly
- [x] Task 13. Write `supported-formats-and-parser-families.adoc` (row 12)
  - [x] Task 13.1. Create the page per row 12 with the format-family table, linking Office Files and PDF Generation for internals
- [x] Task 14. Group 3 gate: build and validate (same checks as Task 5, scoped to this group; xrefs only to Groups 1-3 pages)

### Group 4 -- Configuration and specialised parsing pages (rows 13-17)

Parallelizable: yes

- [x] Task 15. Write `configuration.adoc` ★ (row 13)
  - [x] Task 15.1. Create the page per row 13 with JSON config (`TikaLoader`), the 3.x XML migration and the config -> `TikaLoader` Mermaid; verify top-level section names against the 4.1.x docs
- [x] Task 16. Write `pdf-parsing.adoc` ★ (row 14)
  - [x] Task 16.1. Create the page per row 14 with the per-page decision Mermaid and the `catalogue.pdf` / `scanned-loan-form.pdf` examples
- [x] Task 17. Write `ocr-with-tesseract.adoc` ★ (row 15)
  - [x] Task 17.1. Create the page per row 15
  - [x] Task 17.2. Create `apache-tika-ocr-flow.svg` and reference it
- [x] Task 18. Write `vlm-parsers-and-inference.adoc` (row 16)
  - [x] Task 18.1. Create the page per row 16 with the flow Mermaid; credentials only from environment variables
- [x] Task 19. Write `extending-tika.adoc` (row 17)
  - [x] Task 19.1. Create the page per row 17 with the class-diagram Mermaid (stereotypes as `&lt;&lt;interface&gt;&gt;`)
- [x] Task 20. Group 4 gate: build and validate (same checks as Task 5, scoped to this group)

### Group 5 -- Running Tika pages (rows 18-24)

Parallelizable: yes

- [x] Task 21. Write `tika-app-command-line.adoc` (row 18)
  - [x] Task 21.1. Create the page per row 18 with the "in flux" caveat; show `--help` output from the version used
- [x] Task 22. Write `tika-server-rest-api.adoc` ★ (row 19)
  - [x] Task 22.1. Create the page per row 19 with the client -> server -> forked JVM sequence Mermaid (429 / 503)
- [x] Task 23. Write `tika-grpc.adoc` (row 20)
  - [x] Task 23.1. Create the page per row 20
- [x] Task 24. Write `docker-and-kubernetes-deployment.adoc` (row 21)
  - [x] Task 24.1. Create the page per row 21, linking the Docker and Kubernetes sections
  - [x] Task 24.2. Create `apache-tika-deployment.svg` and reference it
- [x] Task 25. Write `tika-pipes.adoc` ★ (row 22)
  - [x] Task 25.1. Create the page per row 22
  - [x] Task 25.2. Create `apache-tika-pipes.svg` and reference it
- [x] Task 26. Write `robustness-limits-and-timeouts.adoc` ★ (row 23)
  - [x] Task 26.1. Create the page per row 23 with the forked-parse state-diagram Mermaid
- [x] Task 27. Write `security.adoc` ★ (row 24)
  - [x] Task 27.1. Create the page per row 24, linking the Office Files security page
  - [x] Task 27.2. Create `apache-tika-trust-boundaries.svg` and reference it
- [x] Task 28. Group 5 gate: build and validate (same checks as Task 5, scoped to this group)

### Group 6 -- Integrations and workflows pages (rows 25-31)

Parallelizable: yes

- [x] Task 29. Write `spring-boot-integration.adoc` ★ (row 25)
  - [x] Task 29.1. Create the page per row 25 with the upload sequence Mermaid; state there is no official starter
- [x] Task 30. Write `search-indexing-with-lucene-solr-and-elasticsearch.adoc` (row 26)
  - [x] Task 30.1. Create the page per row 26 with the files -> Tika -> index Mermaid, linking the Solr, Lucene and Elasticsearch pages
- [x] Task 31. Write `rag-and-llm-ingestion.adoc` (row 27)
  - [x] Task 31.1. Create the page per row 27, linking `ai/rag-systems/document-parsing.adoc`
- [x] Task 32. Write `tika-eval-and-extraction-quality.adoc` (row 28)
  - [x] Task 32.1. Create the page per row 28 with the corpus -> compare -> report Mermaid
- [x] Task 33. Write `testing-tika-integrations.adoc` (row 29)
  - [x] Task 33.1. Create the page per row 29
- [x] Task 34. Write `performance-and-scaling.adoc` (row 30)
  - [x] Task 34.1. Create the page per row 30 with the "which deployment shape?" decision table / Mermaid flow
- [x] Task 35. Write `whats-changed-and-migration.adoc` (row 31)
  - [x] Task 35.1. Create the page per row 31 with the version-timeline (Mermaid `timeline` or SVG `apache-tika-timeline.svg`, referenced) and the "outdated idiom -> current code" table
- [x] Task 36. Group 6 gate: build and validate (same checks as Task 5, scoped to this group)

### Group 7 -- Cheat sheet page and PDF (row 32)

Parallelizable: yes

- [x] Task 37. Create the cheat sheet
  - [x] Task 37.1. Create `modules/ROOT/pages/backend/apache-tika/cheat-sheet.adoc` ("Cheat Sheet (PDF)"): disclaimer include, short on-page summary, `link:{attachmentsdir}/apache-tika-cheat-sheet.pdf[Download the cheat sheet (PDF)]`
  - [x] Task 37.2. Generate `modules/ROOT/attachments/apache-tika-cheat-sheet.pdf` with `reportlab`, a single A4 page covering every item of the issue's "Cheat sheet" minimum-content list; render it to an image and check it is legible and fits one page
  - [x] Task 37.3. Run the Group 7 gate (Antora build, greps)

### Group 8 -- Index completion, nav, back-links and final verification

Parallelizable: no -- Task 39 and Task 40 edit shared files and depend on all pages from Groups 1-7 existing; Task 38 must land before them.

- [x] Task 38. Complete `backend/apache-tika/index.adoc`
  - [x] Task 38.1. Replace the page-list placeholder with the full page list in outline order (`xref:` to every page and the cheat sheet)
  - [x] Task 38.2. Fill `== Bibliography` with every source from the issue's Bibliography section, each linked to its official site (Manning page for *Tika in Action*), excluding the blacklisted 404 URLs
  - [x] Task 38.3. Add forward cross-links between pages where group isolation postponed them
- [x] Task 39. Navigation and landing pages
  - [x] Task 39.1. `modules/ROOT/nav.adoc`: add `*** xref:backend/apache-tika/index.adoc[Apache Tika]` after the Office Files cheat-sheet line and before `** xref:apps/index.adoc[Apps]`, with `****` children in outline order ending with the cheat sheet; labels identical to each page's `= Title`
  - [x] Task 39.2. `modules/ROOT/pages/backend/index.adoc`: add the Apache Tika bullet after Office Files (ending "plus a downloadable cheat sheet"), update `:description:` and extend `:keywords:` with the issue's list
  - [x] Task 39.3. `modules/ROOT/pages/index.adoc`: mention Apache Tika in `:description:` and add `Apache Tika, text extraction, content detection` to `:keywords:`
- [x] Task 40. Back-links (one line each, verified targets)
  - [x] Task 40.1. Add pointers in `backend/office-files/text-extraction-and-apache-tika.adoc`, `database/solr/indexing-and-updates.adoc`, `ai/rag-systems/document-parsing.adoc`, `web/jsf/primefaces-files-media-charts-and-drag-drop.adoc` and `programming-languages/java/io-and-files.adoc` ("Detecting and extracting file contents")
- [x] Task 41. Final verification (delegate to `iru-gate-runner`)
  - [x] Task 41.1. Run `npx antora antora-playbook.yml` for the whole site: no errors or warnings for the new files; spot-check the section rendering in `build/site/backend/apache-tika`
  - [x] Task 41.2. Run all `CLAUDE.md` greps (block/inline `image::` closure, `<p>image::` leak, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/backend/apache-tika`) and `npm run validate:mermaid`
  - [x] Task 41.3. Check that every `apache-tika-*.svg` is referenced, every `image::` target exists, every page has `== References` and the disclaimer include, every page except `index.adoc` is linked from `index.adoc` and the nav, and the 31 pages + cheat sheet all exist
  - [x] Task 41.4. Ensure `modules/ROOT/.DS_Store`, `api2.txt` and build output are not staged
