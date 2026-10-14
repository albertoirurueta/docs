# Implementation Plan: Guides & References — "Groovy" (Programming Languages)

## Task summary

Source: GitHub issue #297
Base branch: main

Issue [#297](https://github.com/albertoirurueta/docs/issues/297) adds an Antora section
`modules/ROOT/pages/programming-languages/groovy/` (nav title **Groovy**): a detailed, learning-oriented reference for
**Apache Groovy 6.0** (6.0.0, 2026-09-22, JDK 17+), its GDK, tools and official modules. **78 pages** (incl. `index.adoc`,
`ecosystem-and-groovy-in-other-tools.adoc` and `cheat-sheet.adoc`), a disclaimer partial, a nav partial, original
`groovy-*.svg` figures and Mermaid diagrams, and a one-page A4 PDF `modules/ROOT/attachments/groovy-cheat-sheet.pdf`.
Frameworks built on Groovy (Gradle, Grails, Spock, Geb, Micronaut, Jenkins, Nextflow…) are listed on the ecosystem page only.

**The binding spec** is the issue body plus the outline comment (split only for GitHub's size limit):
https://github.com/albertoirurueta/docs/issues/297#issuecomment-6170128356. Local copies are in the session scratchpad
(`issue297.md`, `outline297.md`; re-fetch with `gh issue view 297 --json body,comments` if missing). **Every page task must
re-read its own outline bullets** (★ depth, 📊 figures, G/ D/ GDK/ RN/ source paths, "book outdated" notes) from there.

### Choices made on the user's behalf

1. **One branch `feature/297`, one draft PR to `main`** with `Closes #297` (user-confirmed base). The issue's optional
   six-PR split on `feature/297-groovy` is not used; the groups below follow its six slices so the work could still be cut.
2. **Tasks are untagged.** Installed keys (`java`, `java-springboot`, `dotnet`, `database`) don't fit AsciiDoc/Mermaid/SVG/PDF
   authoring, so tasks are implemented directly. Groovy code in pages is illustrative but is **run for real** in a scratch
   directory (never committed) with Groovy 6.0.0 (Task 1).
3. **Book not available locally** (`~/Desktop/libros/groovy/` is absent). It is cited only on the landing-page bibliography
   (Manning publisher page) and in "book is outdated" prose from the issue's tables. No book text, listing or figure is
   reproduced and no PDF other than the cheat sheet is ever staged.
4. **Disclaimer** `groovy-disclaimer.adoc` is shaped exactly like `rust-disclaimer.adoc` (AI disclosure + bibliography xref
   to `programming-languages/groovy/index.adoc#_bibliography`). It is the **only** admonition in the section; release
   notes, incubating features, security remarks and book-outdated remarks are prose or table rows.
5. **Version baseline re-verified at implementation time and dated** (Task 1): Groovy 6.0.x, maintained lines, JDK, Spock
   release supporting Groovy 6, URLs and anchors. If a feature cannot be verified from the official docs, describe behaviour
   without naming it.
6. **Existing pages get real `xref:`s** (verified with `ls`); issues #196, #243, #248, #258, #263, #275, #276, #277, #280, #282,
   #299, #300 (and duplicate #298) are mentioned in prose only.
7. **Not-runnable examples** (servlet containers, remote JMX, GraalVM native-image, Android, Geb without a browser driver)
   are labelled "not run here" in prose and checked line by line against the docs.
8. **Mermaid/SVG floor:** every 📊 in the outline is delivered; SVGs are original (no Groovy logo, Apache artwork, docs or
   book figures).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$groovy-disclaimer.adoc[]`; intro states Groovy 6.0
  baseline and JDK used; features newer than 4.0 name their release and say "incubating" in prose where applicable.
- Each example: `[source,groovy]`, complete or marked fragment, **real output** (trailing `assert`s or a `[source,text]` block
  produced by running it), followed by a `Source: https://…[Groovy documentation: …]` link to the official page/anchor it
  derives from. Follows the greenhouse running scenario where it fits. No real secrets or external hosts.
- Each page ends with `== References` (official online docs only, plus the book's publisher page where consulted) and covers
  where the book is outdated for its concepts.
- AsciiDoc pitfalls: inline code containing `->`, `=>`, `'`, `...`, `..`, `*`, `~`, `^`, `{`, `${`, `__` uses `` `+…+` ``;
  containing `+` uses `` `pass:c[…]` ``. Image macros on one line, quoted alt when it has a comma, block macros at column 0.
- Mermaid: `<` directly followed by a letter written `&lt;`; stereotypes `&lt;&lt;trait&gt;&gt;`.
- Each task's own verification: run its examples, then grep its files for unquoted-comma image alt text and block-macro closure.

## Current code state

- No application code. Site definition: `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc`
  (Programming Languages open block at lines ~20-35: includes `nav-kotlin`, `nav-c`, `nav-cpp`, `nav-objective-c`,
  `nav-csharp`, `nav-swift`, `nav-php`, then JavaScript/TypeScript/Python/Java/Rust after the closing `--`).
- Templates: `modules/ROOT/partials/php-disclaimer.adoc`, `rust-disclaimer.adoc`, `nav-php.adoc` (relative-depth
  `* xref:…/index.adoc[…]` + `** xref:` children); `programming-languages/php/cheat-sheet.adoc` and `java/cheat-sheet.adoc`;
  PHP/Rust sections (44+ pages each) as structural precedents; archived precedent plans `.archive/implementation_plan_194.md`
  (PHP) and `_195.md` (Rust).
- `modules/ROOT/pages/programming-languages/index.adoc` lists sections with `:description:`/`:keywords:` and a "live only here"
  sentence; Groovy is not yet present. `modules/ROOT/attachments/` holds the other cheat-sheet PDFs; `modules/ROOT/images/` the SVGs.
- Existing pages to link, not repeat: `programming-languages/java/*` (collections-framework, lambdas-and-method-references,
  records-and-sealed-classes, pattern-matching, testing, build-and-tooling, virtual-threads), `kotlin/type-safe-builders-and-dsls`,
  `kotlin/coroutines-basics`, `backend/jmeter/scripting-with-jsr223-and-groovy.adoc`.
- Tooling on this machine: JDK 26, Node/Antora, Chrome, `detect-secrets`. **Missing:** Groovy, SDKMAN!, Homebrew, `pdfinfo`.

## Implementation steps

### Group 1 — Tooling, shared partials (Parallelizable: no — Task 2 needs Task 1's verified baseline)

- [x] Task 1. Prepare tooling and verify the baseline
  - Notes for later groups (baseline corrections, Spock 2.5-groovy-6.0, Geb 8.0.1, PDF page-count method): /private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/44156e66-d78b-47a2-be94-302ecf366d71/scratchpad/groovy-baseline-notes.md
  - [x] Task 1.1. Install Groovy 6.0.0 for running examples (neither `brew` nor `sdk` exists: download the official binary zip
    from groovy.apache.org into a scratch directory, **ask the user before downloading**, state filename/source/size) and
    confirm `groovy -v` on the available JDK (note the JDK used; JDK 21+ for virtual-thread examples)
  - [x] Task 1.2. Re-verify the version baseline table (releases/dates 1.5–2.5 against the release notes), maintained lines, and the
    Spock/Geb versions that support Groovy 6; curl-check every G/ and D/ URL listed in the inventory; record corrections
  - [x] Task 1.3. Pick a PDF page-count method (no `pdfinfo`): e.g. `mdls`/`python -I` pypdf or Chrome — note it for Task 21
- [x] Task 2. Create the shared partials
  - [x] Task 2.1. `modules/ROOT/partials/groovy-disclaimer.adoc` (copy of `rust-disclaimer.adoc` shape, Groovy bibliography xref)
  - [x] Task 2.2. `modules/ROOT/partials/nav-groovy.adoc`: `* xref:programming-languages/groovy/index.adoc[Groovy]`, grouped under
    non-link `**` headings with `***` children following the outline groups; last two entries Ecosystem and Cheat Sheet (PDF)
    (written now from the outline file names; adjusted in Task 22 if any page is renamed)

### Group 2 — Slice 1: getting started, syntax and fundamentals, operators (Parallelizable: yes — distinct files)

- [x] Task 3. Getting started pages (`index.adoc` is deferred to Task 20 because it needs every other page)
  - [x] Task 3.1. ★ `getting-started.adoc` (📊 SVG `groovy-toolchain.svg`)
  - [x] Task 3.2. ★ `differences-with-java.adoc` (every row of G/differences.html)
  - [x] Task 3.3. `groovy-and-other-languages.adoc`
  - [x] Task 3.4. `running-scripts-and-the-groovy-command.adoc`
  - [x] Task 3.5. `groovysh-and-groovyconsole.adoc`
- [x] Task 4. Syntax and fundamentals pages
  - [x] Task 4.1. `lexical-structure-comments-keywords-and-identifiers.adoc`
  - [x] Task 4.2. ★ `strings-and-gstrings.adoc`
  - [x] Task 4.3. `numbers-and-numeric-literals.adoc`
  - [x] Task 4.4. ★ `booleans-and-the-groovy-truth.adoc`
  - [x] Task 4.5. `lists-and-arrays.adoc`
  - [x] Task 4.6. `maps.adoc`
  - [x] Task 4.7. `ranges.adoc`
  - [x] Task 4.8. `variables-typing-def-var-and-val.adoc`
  - [x] Task 4.9. `program-structure-packages-imports-and-scripts.adoc`
- [x] Task 5. Operator pages
  - [x] Task 5.1. `operators-arithmetic-relational-and-logical.adoc`
  - [x] Task 5.2. ★ `object-operators.adoc`
  - [x] Task 5.3. `regular-expressions.adoc`
  - [x] Task 5.4. `operator-overloading.adoc`

### Group 3 — Slice 2: control structures, object orientation, closures (Parallelizable: yes — distinct files)

- [x] Task 6. Control structures and semantics
  - [x] Task 6.1. `control-structures.adoc`
  - [x] Task 6.2. `exceptions-and-error-handling.adoc`
  - [x] Task 6.3. `assertions-and-power-assert.adoc`
  - [x] Task 6.4. `type-coercion-and-promotion.adoc`
  - [x] Task 6.5. `optionality.adoc`
- [x] Task 7. Object orientation
  - [x] Task 7.1. `classes-fields-and-properties.adoc`
  - [x] Task 7.2. `methods-constructors-and-parameters.adoc`
  - [x] Task 7.3. `inheritance-interfaces-and-generics.adoc`
  - [x] Task 7.4. ★ `traits.adoc`
  - [x] Task 7.5. `records-and-sealed-types.adoc`
  - [x] Task 7.6. `enums-and-annotations.adoc`
- [x] Task 8. Closures and functional programming
  - [x] Task 8.1. ★ `closures.adoc`
  - [x] Task 8.2. ★ `closure-delegation-owner-delegate-and-this.adoc`
  - [x] Task 8.3. `functional-programming.adoc`

### Group 4 — Slice 3: typing, the GDK, metaprogramming (Parallelizable: yes — distinct files)

- [x] Task 9. Typing
  - [x] Task 9.1. ★ `static-type-checking-and-compile-static.adoc`
  - [x] Task 9.2. `type-checking-extensions.adoc`
  - [x] Task 9.3. `built-in-type-checkers.adoc`
- [x] Task 10. The GDK
  - [x] Task 10.1. `gdk-overview-and-object-methods.adoc`
  - [x] Task 10.2. ★ `working-with-collections.adoc`
  - [x] Task 10.3. `files-io-and-paths.adoc`
  - [x] Task 10.4. `external-processes.adoc`
  - [x] Task 10.5. `dates-and-times.adoc`
- [x] Task 11. Metaprogramming
  - [x] Task 11.1. ★ `runtime-metaprogramming-and-the-mop.adoc`
  - [x] Task 11.2. `metaclasses-expandometaclass-and-categories.adoc`
  - [x] Task 11.3. `extension-modules.adoc`
  - [x] Task 11.4. ★ `ast-transformations-code-generation-and-class-design.adoc`
  - [x] Task 11.5. `ast-transformations-logging-safety-concurrency-and-directives.adoc`
  - [x] Task 11.6. `writing-ast-transformations-and-macros.adoc`

### Group 5 — Slice 4: concurrency, data and module guides (Parallelizable: yes — distinct files)

- [x] Task 12. Concurrency (6.0, incubating — state in prose)
  - [x] Task 12.1. ★ `async-await.adoc`
  - [x] Task 12.2. `generators-channels-and-structured-concurrency.adoc`
  - [x] Task 12.3. `parallel-collections-and-dataflow.adoc`
  - [x] Task 12.4. `actors-agents-and-active-objects.adoc`
- [x] Task 13. Data and module guides
  - [x] Task 13.1. ★ `json.adoc`
  - [x] Task 13.2. ★ `xml-parsing-gpath-and-security.adoc`
  - [x] Task 13.3. `xml-creating-and-manipulating.adoc`
  - [x] Task 13.4. `yaml-and-toml.adoc`
  - [x] Task 13.5. `csv-and-markdown.adoc`
  - [x] Task 13.6. ★ `databases-with-groovy-sql.adoc` (in-memory H2 via `@Grab`)
  - [x] Task 13.7. ★ `ginq-sql-like-collection-queries.adoc`
  - [x] Task 13.8. `template-engines.adoc`
  - [x] Task 13.9. `http-client-with-httpbuilder.adoc` (local JDK `HttpServer` on localhost)
  - [x] Task 13.10. `builders.adoc` (link `kotlin/type-safe-builders-and-dsls.adoc`)

### Group 6 — Slice 5: DSLs, integration and tools, testing (Parallelizable: yes — distinct files)

- [x] Task 14. DSLs and scripting
  - [x] Task 14.1. ★ `domain-specific-languages.adoc` (watering DSL)
  - [x] Task 14.2. `compilation-customizers-and-secure-scripting.adoc`
- [x] Task 15. Integration and tools
  - [x] Task 15.1. `integrating-groovy-into-java-applications.adoc` (link JMeter JSR223 page)
  - [x] Task 15.2. `compiling-groovyc-and-joint-compilation.adoc`
  - [x] Task 15.3. `build-tools-gradle-maven-and-ant.adoc` (Gradle Groovy DSL as `[source,groovy]`, Kotlin DSL as `[source,kotlin]`; #300 prose only)
  - [x] Task 15.4. `grape-dependency-management.adoc`
  - [x] Task 15.5. `groovydoc.adoc`
  - [x] Task 15.6. `groovlets-servlets-and-jmx.adoc` ("not run here" where applicable)
  - [x] Task 15.7. `performance-invokedynamic-and-native-images.adoc`
- [x] Task 16. Testing
  - [x] Task 16.1. `testing-with-junit-and-groovy-test.adoc`
  - [x] Task 16.2. `testing-with-spock-and-geb.adoc`
  - [x] Task 16.3. `design-by-contract-with-groovy-contracts.adoc`

### Group 7 — Slice 6a: practice, ecosystem, extra figures (Parallelizable: yes — distinct files)

- [x] Task 17. `style-guide-and-idioms.adoc` (21 style rules) and `design-patterns-in-groovy.adoc` (21 patterns)
- [x] Task 18. `whats-new-and-migrating-from-older-versions.adoc`: version-baseline table with every release row, plus the book-outdated table
- [x] Task 19. `ecosystem-and-groovy-in-other-tools.adoc`: grouped table, one-line descriptions, embedded Groovy line checked at implementation time, official site and docs links, no further documentation
- [x] Task 19b. Remaining original figures: add `modules/ROOT/images/groovy-*.svg` / `[mermaid]` blocks for every 📊 in the outline not yet delivered by Groups 2-6; every SVG referenced by a page

### Group 8 — Slice 6b: landing page and cheat sheet (Parallelizable: no — both link to every page created in Groups 2-7)

- [x] Task 20. `index.adoc`: intro, history, release baseline, greenhouse scenario, how the book was used, reading path, `== What's covered` grouped as in the outline, Mermaid mind-map, and `== Bibliography` (every source cited anywhere in the section, each linked to its official site; groups as in the issue)
  - Done: `index.adoc` (409 lines, 76 pages linked, mind-map parses, `== Bibliography`).
- [x] Task 21. Cheat sheet
  - [x] Task 21.1. `cheat-sheet.adoc` following `php/cheat-sheet.adoc`: disclaimer, intro with `xref:attachment$groovy-cheat-sheet.pdf[…]`, grouped `*Group* --` xref paragraphs to every page, download line, `== References`
  - [x] Task 21.2. Build the throwaway HTML in the scratchpad and render `modules/ROOT/attachments/groovy-cheat-sheet.pdf` with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`); covers every concept group listed in the issue plus the "legacy → modern" strip; "Apache Groovy 6.0" and date in header
  - [x] Task 21.3. Check exactly one A4 page (method from Task 1.3) and preview as PNG; commit only the PDF

### Group 9 — Integration, back-links and verification (Parallelizable: no — depends on all previous groups)

- [x] Task 22. Site wiring
  - [x] Task 22.1. `modules/ROOT/nav.adoc`: add `include::partial$nav-groovy.adoc[]` as the last include inside the Programming Languages open block (after `nav-php.adoc`, before the closing `--`)
  - [x] Task 22.2. `programming-languages/index.adoc`: Groovy bullet (last in the open-block group, ends ", plus a downloadable cheat sheet."), `:description:`, the listed `:keywords:`, and the "live only here" sentence
  - [x] Task 22.3. Root `modules/ROOT/pages/index.adoc`: add Groovy to `:description:`/`:keywords:` only if they list language references (no new tile)
  - [x] Task 22.4. One-line back-links: `programming-languages/java/build-and-tooling.adoc` (`== See Also` → `build-tools-gradle-maven-and-ant`), `programming-languages/kotlin/type-safe-builders-and-dsls.adoc` (`== See Also` → `builders`), `backend/jmeter/scripting-with-jsr223-and-groovy.adoc` (references/See Also → Groovy section)
- [x] Task 23. Verification
  - [x] Task 23.1. `npx antora antora-playbook.yml` completes with no xref/AsciiDoc errors or warnings (delegate to `iru-gate-runner` / a sub-agent to keep build output out of the main context)
  - [x] Task 23.2. `CLAUDE.md` checks print nothing for `build/site/.../programming-languages/groovy/`: block/inline image macros closed, `<p>image::` leak, substitutions inside inline `<code>`, unquoted-comma alt text on changed files
  - [x] Task 23.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid` reports every diagram parsed
  - [x] Task 23.4. Coverage/consistency: 78 files exist, each page has `== References`, disclaimer include and Source links; the disclaimer is the only admonition (`grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'`); every `groovy-*.svg` is referenced; every `image::` target exists; no `xref:` to #-issue pages; built nav shows Groovy under Programming Languages
  - [x] Task 23.5. `iru-check-security` on the changed paths (`detect-secrets` skips untracked files — stage first or scan explicitly); `git status` lists no PDF other than `groovy-cheat-sheet.pdf` and no `.DS_Store`
