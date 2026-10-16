# Implementation Plan: Guides & References — "Scala" (Programming Languages)

## Task summary

Source: GitHub issue #299
Base branch: main

Issue [#299](https://github.com/albertoirurueta/docs/issues/299) adds an Antora section
`modules/ROOT/pages/programming-languages/scala/` (nav title **Scala**): a detailed, learning-oriented reference for
**Scala 3.10** (3.10.0, 2026-10-12, JDK 17+) with notes on the **3.9 LTS** line, its standard library, tools and the
official **Scala Toolkit**. **96 pages** (incl. `index.adoc`, `ecosystem-and-learning-resources.adoc` and `cheat-sheet.adoc`),
a disclaimer partial, a nav partial, original `scala-*.svg` figures and Mermaid diagrams, and a one-page A4 PDF
`modules/ROOT/attachments/scala-cheat-sheet.pdf`. Frameworks/libraries built on Scala (Typelevel, ZIO, Pekko/Akka, Play,
Spark, Ox…) are listed on the ecosystem page only.

**The binding spec** is the issue body plus two comments (split only for GitHub's size limit): the page outline
(https://github.com/albertoirurueta/docs/issues/299#issuecomment-6170670837) and the books table
(https://github.com/albertoirurueta/docs/issues/299#issuecomment-6170671487). Local copies: session scratchpad
`i299.json` (body + comments) and `outline.md`; re-fetch with `gh issue view 299 --json body,comments` if missing.
**Every page task must re-read its own outline bullets** (★ depth, 📊 figures, B/ R/ T/ O/ M/ K/ S/ source paths, "book
outdated" notes) from there.

### Choices made on the user's behalf

1. **Branch `feature/299` (already exists, local only), one draft PR to `main`** with `Closes #299` (user-confirmed base).
   The issue's optional seven-PR split on `feature/299-scala` is not used; the groups below follow its seven slices so the
   work could still be cut.
2. **Tasks are untagged.** Installed keys (`java`, `java-springboot`, `dotnet`, `database`) don't fit AsciiDoc/Mermaid/SVG/PDF
   authoring, so tasks are implemented directly. Scala code in pages is **run for real** in a scratch directory (never
   committed) with Scala 3.10.0.
3. **Books not available locally** (`~/Desktop/libros/scala/` absent). Cited only on the landing-page bibliography
   (publisher pages) and in "book is outdated" prose from the issue's tables. No book text, listing or figure reproduced.
4. **Disclaimer** `scala-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc`/`groovy-disclaimer.adoc` (AI disclosure +
   bibliography xref to `programming-languages/scala/index.adoc#_bibliography`). It is the **only** admonition in the section.
5. **Version baseline re-verified at implementation time and dated** (Task 1): Scala 3.10.x, 3.9 LTS, JDK matrix, sbt, Scala
   CLI, Toolkit, URLs and anchors. SIP-74's release must be looked up before `partial-functions`. If something cannot be
   verified from the official docs, describe behaviour without naming the release.
6. **Existing pages get real `xref:`s** (verified with `ls`); issues #196, #243, #248, #263, #275, #276, #277, #280, #282, #297,
   #300 are mentioned in prose only (`programming-languages/groovy/*` already exists and may be `xref:`-linked).
7. **Not-runnable examples** (Scala.js/Wasm without Node, Scala Native without clang, publishing) are labelled "not run here"
   in prose and checked line by line against the docs.
8. **Mermaid/SVG floor:** every 📊 in the outline is delivered; SVGs are original (no Scala logo, EPFL/Scala Center artwork,
   docs or book figures).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$scala-disclaimer.adoc[]`; intro states the Scala 3.10
  baseline and JDK used; features newer than 3.3 LTS name their release, say experimental/preview where applicable, and
  whether they work on 3.9 LTS.
- Each example: `[source,scala]`, complete Scala CLI program (`//> using scala 3.10.0` + `@main`) or `.sc`, or a clearly marked
  fragment; **real output** (trailing `assert`s or a `[source,text]` block produced by running it; real compiler messages for
  error demos); followed by `Source: https://…[Scala 3 Book: …]` to the official page/anchor it derives from (URLs looked up,
  never guessed; check `$` in API URLs after the build). Braceless style per the style guide. Uses the *trailhead* scenario
  where it fits. No real secrets or external hosts; network examples use `localhost`.
- Depth: explanation + design rationale, keywords/modifiers/annotations/library members/compiler options, Scala 2 form, Java
  (and Kotlin) differences, pitfalls with real error codes, release notes; `//> using dep` + sbt `libraryDependencies` once when
  a non-stdlib module is needed.
- Each page covers where the books are outdated, and ends with `== References` (official online docs only, plus book publisher
  pages where consulted).
- AsciiDoc pitfalls: inline code containing `=>`, `?=>`, `=>>`, `<-`, `->`, `'`, `...`, `*`, `~`, `^`, `_`/`__`, `{`, `#`, `|` uses
  `` `+…+` ``; containing `+` uses `` `pass:c[…]` ``; `|` in table cells escaped `\|`. Image macros on one line, quoted alt when
  it has a comma, block macros at column 0.
- Mermaid: `<` directly followed by a letter written `&lt;`; stereotypes `&lt;&lt;trait&gt;&gt;`; `<:` written `&lt;:`.
- Each task's own verification: run its examples, then grep its files for unquoted-comma image alt text, block-macro closure,
  and `NOTE|TIP|WARNING|CAUTION|IMPORTANT` blocks (only the disclaimer include may exist).

## Current code state

- No application code. Site definition: `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc`
  (Programming Languages open block lines ~20-30: includes `nav-kotlin`, `nav-c`, `nav-cpp`, `nav-objective-c`, `nav-csharp`,
  `nav-swift`, `nav-php`, `nav-groovy`; then JavaScript/TypeScript/Python/Java/Rust after the closing `--`). `nav-scala` is
  added after `nav-groovy`.
- Templates: `modules/ROOT/partials/groovy-disclaimer.adoc`, `rust-disclaimer.adoc`, `nav-groovy.adoc`, `nav-php.adoc`;
  `programming-languages/php/cheat-sheet.adoc`, `groovy/cheat-sheet.adoc`, `java/cheat-sheet.adoc`; Groovy section (78 pages)
  as structural precedent; archived precedent plan `.archive/implementation_plan_297.md` (Groovy, same shape).
- `modules/ROOT/pages/programming-languages/index.adoc` has `:description:`/`:keywords:`, a "live only here" sentence (line ~8)
  and a Groovy bullet (line ~58) — Scala goes after it. `modules/ROOT/attachments/` holds cheat-sheet PDFs;
  `modules/ROOT/images/` the SVGs. `scripts/validate-mermaid.mjs` backs `npm run validate:mermaid`.
- Existing pages to link, not repeat: `programming-languages/java/*` (collections-framework, lambdas-and-method-references,
  records-and-sealed-classes, pattern-matching, generics, build-and-tooling, virtual-threads, optional), `kotlin/*`
  (extension-functions-and-scope-functions, generics-and-variance, sealed-classes-and-enums, null-safety, coroutines-basics,
  type-safe-builders-and-dsls), `python/index.adoc`, `javascript/index.adoc`, `groovy/*`.
- Back-link targets: `kotlin/generics-and-variance.adoc` (`== See Also`), `backend/quarkus/build-tooling-and-languages.adoc`
  (`=== Scala and Groovy`, line ~212).
- Tooling on this machine: JDK 26, Node 24 / Antora, Chrome, `detect-secrets`. **Missing:** Scala/Scala CLI/Coursier, Homebrew,
  SDKMAN!, `pdfinfo`. `~/Desktop/libros/scala/` absent.

## Implementation steps

### Group 1 — Tooling, shared partials (Parallelizable: no — Task 2 needs Task 1's verified baseline)

- [x] Task 1. Prepare tooling and verify the baseline
  - [x] Task 1.1. Install Scala 3.10.0
    - Done (user-approved download, sha256 verified): `scala` binary at
      `/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/b0eadfc5-bfdb-45fe-a21e-6e0c1c147a8d/scratchpad/scala-dist/x/scala3-3.10.0-aarch64-apple-darwin/bin/scala`
      (Scala CLI 1.17.1, Scala 3.10.0, JDK 26). Run examples in `.../scratchpad/scala-run/`. Node v24.21.0 and Apple clang 21.0.0 are available (checked 2026-10-15).
    - Original sub-task text: Install Scala 3.10.0 for running examples (no `brew`/`cs`/`sdk`: download the official Scala CLI/Coursier or
    Scala distribution into a scratch directory; **ask the user before downloading**, stating filename/source/size). Confirm
    `scala -version` reports 3.10.x on the available JDK (note JDK used; Scala 3.8+ needs 17+). Check Node/clang availability
    for the Scala.js/Native pages.
  - [x] Task 1.2. Re-verify the version baseline table (releases/dates 2.13–3.10), maintained lines, sbt/Scala CLI/Toolkit/
    Scala.js versions, SIP-74's release; curl-check every URL listed in the inventory and outline; record corrections in a
    scratchpad `scala-baseline-notes.md`
    - Done: notes in `/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/b0eadfc5-bfdb-45fe-a21e-6e0c1c147a8d/scratchpad/scala-baseline-notes.md` (Toolkit is 0.9.2 not 0.7.0; sbt 2.0.10; Scala CLI 1.18.0; SIP-74 = preview in 3.10.0; 3.8 announced 2026-01-22; 410/417 URLs 200, 161/162 anchors OK)
  - [x] Task 1.3. Pick a PDF page-count method (no `pdfinfo`): e.g. `python3 -I` with pypdf, or Chrome — note it for Task 24;
    check that highlight.js in the UI bundle has a `scala` grammar
    - Done: `mdls -name kMDItemNumberOfPages` for PDF page counts; highlight.js in the UI bundle has a `scala` grammar (yes).
- [x] Task 2. Create the shared partials
  - [x] Task 2.1. `modules/ROOT/partials/scala-disclaimer.adoc` (shape of `rust-disclaimer.adoc`, Scala bibliography xref)
  - [x] Task 2.2. `modules/ROOT/partials/nav-scala.adoc`: `* xref:programming-languages/scala/index.adoc[Scala]`, grouped under
    non-link `**` headings with `***` children following the outline groups; last two entries Ecosystem and Cheat Sheet (PDF)
    (written now from the outline file names; adjusted in Task 25 if any page is renamed)

### Group 2 — Slice 1: getting started, syntax and fundamentals, control structures (Parallelizable: yes — distinct files)

- [x] Task 3. Getting started pages (`index.adoc` deferred to Task 22)
  - [x] Task 3.1. ★ `getting-started-and-versions.adoc` (📊 per outline)
  - [x] Task 3.2. `installing-scala.adoc`
  - [x] Task 3.3. ★ `hello-world-and-main-methods.adoc`
  - [x] Task 3.4. `repl-worksheets-and-scastie.adoc`
  - [x] Task 3.5. ★ `scala-for-java-python-and-javascript-developers.adoc`
- [x] Task 4. Syntax and fundamentals pages
  - [x] Task 4.1. ★ `values-variables-and-literals.adoc`
  - [x] Task 4.2. ★ `type-hierarchy-and-matchable.adoc`
  - [x] Task 4.3. `strings-and-interpolation.adoc`
  - [x] Task 4.4. ★ `methods-and-parameters.adoc`
  - [x] Task 4.5. ★ `optional-braces-and-indentation.adoc`
  - [x] Task 4.6. `packages-imports-and-top-level-definitions.adoc`
  - [x] Task 4.7. ★ `tuples-and-named-tuples.adoc`
- [x] Task 5. Control structure pages
  - [x] Task 5.1. `conditionals-and-loops.adoc`
  - [x] Task 5.2. ★ `for-comprehensions.adoc`
  - [x] Task 5.3. ★ `pattern-matching.adoc`
  - [x] Task 5.4. `extractors-and-pattern-bindings.adoc`
  - [x] Task 5.5. ★ `exceptions-boundary-and-early-exit.adoc`

### Group 3 — Slice 2: object orientation, functional programming (Parallelizable: yes — distinct files)

- [x] Task 6. Object orientation and domain modeling pages
  - [x] Task 6.1. ★ `classes-and-constructors.adoc`
  - [x] Task 6.2. `objects-and-companions.adoc`
  - [x] Task 6.3. ★ `traits-and-mixins.adoc`
  - [x] Task 6.4. `inheritance-abstract-sealed-open-and-final.adoc`
  - [x] Task 6.5. ★ `case-classes.adoc`
  - [x] Task 6.6. ★ `enums.adoc`
  - [x] Task 6.7. ★ `algebraic-data-types-and-gadts.adoc`
  - [x] Task 6.8. `composition-export-and-self-types.adoc`
  - [x] Task 6.9. `annotations-and-visibility.adoc`
- [x] Task 7. Functional programming pages
  - [x] Task 7.1. `functional-programming-principles.adoc`
  - [x] Task 7.2. ★ `functions-as-values.adoc`
  - [x] Task 7.3. ★ `higher-order-functions-and-closures.adoc`
  - [x] Task 7.4. `partial-functions.adoc` (look up SIP-74's release first)
  - [x] Task 7.5. `currying-and-parameter-lists.adoc`
  - [x] Task 7.6. `recursion-and-tail-calls.adoc`
  - [x] Task 7.7. `laziness.adoc`

### Group 4 — Slice 3: the type system, contextual abstractions (Parallelizable: yes — distinct files)

- [x] Task 8. Type system pages
  - [x] Task 8.1. `type-inference.adoc`
  - [x] Task 8.2. ★ `generics-and-bounds.adoc`
  - [x] Task 8.3. ★ `variance.adoc`
  - [x] Task 8.4. ★ `union-and-intersection-types.adoc`
  - [x] Task 8.5. ★ `opaque-types-and-value-classes.adoc`
  - [x] Task 8.6. `structural-types-selectable-and-dynamic.adoc`
  - [x] Task 8.7. `dependent-and-polymorphic-function-types.adoc`
  - [x] Task 8.8. `type-lambdas-and-higher-kinds.adoc`
  - [x] Task 8.9. ★ `match-types.adoc`
- [x] Task 9. Contextual abstraction pages
  - [x] Task 9.1. ★ `contextual-abstractions-overview.adoc`
  - [x] Task 9.2. ★ `givens-and-using-clauses.adoc`
  - [x] Task 9.3. `context-bounds-and-deferred-givens.adoc`
  - [x] Task 9.4. ★ `extension-methods.adoc`
  - [x] Task 9.5. ★ `type-classes.adoc`
  - [x] Task 9.6. ★ `type-class-derivation.adoc`
  - [x] Task 9.7. `multiversal-equality.adoc`
  - [x] Task 9.8. `context-functions.adoc`
  - [x] Task 9.9. ★ `conversions-into-and-implicit-resolution.adoc`

### Group 5 — Slice 4: collections, error handling, concurrency, Java interop (Parallelizable: yes — distinct files)

- [x] Task 10. Collections pages
  - [x] Task 10.1. ★ `collections-overview.adoc`
  - [x] Task 10.2. `sequences.adoc`
  - [x] Task 10.3. `sets-and-maps.adoc`
  - [x] Task 10.4. ★ `collection-operations.adoc`
  - [x] Task 10.5. `views-iterators-and-lazylist.adoc`
  - [x] Task 10.6. `collection-performance-and-equality.adoc`
  - [x] Task 10.7. `collections-architecture-and-custom-collections.adoc`
- [x] Task 11. Error handling and concurrency pages
  - [x] Task 11.1. ★ `option-and-null-safety.adoc`
  - [x] Task 11.2. ★ `either-and-try.adoc`
  - [x] Task 11.3. ★ `futures-and-promises.adoc`
  - [x] Task 11.4. `parallel-collections-and-concurrency-libraries.adoc`
- [x] Task 12. Java interoperability pages
  - [x] Task 12.1. ★ `using-java-from-scala.adoc`
  - [x] Task 12.2. `calling-scala-from-java.adoc`

### Group 6 — Slice 5: metaprogramming, tooling (Parallelizable: yes — distinct files)

- [x] Task 13. Metaprogramming pages
  - [x] Task 13.1. ★ `metaprogramming-overview.adoc`
  - [x] Task 13.2. ★ `inline.adoc`
  - [x] Task 13.3. `compiletime-operations.adoc`
  - [x] Task 13.4. ★ `macros-quotes-and-splices.adoc`
  - [x] Task 13.5. `quoted-pattern-matching.adoc`
  - [x] Task 13.6. `reflection-with-quotes-reflect.adoc`
  - [x] Task 13.7. `staging-and-tasty-inspection.adoc`
- [x] Task 14. Tooling pages
  - [x] Task 14.1. ★ `scala-cli.adoc`
  - [x] Task 14.2. ★ `sbt-and-build-tools.adoc` (Maven/Gradle in prose → #300)
  - [x] Task 14.3. `ides.adoc`
  - [x] Task 14.4. ★ `compiler-options-linting-and-errors.adoc`
  - [x] Task 14.5. `scaladoc.adoc`
  - [x] Task 14.6. `scala-js-and-scala-native.adoc`
  - [x] Task 14.7. ★ `versions-compatibility-and-jdks.adoc`

### Group 7 — Slice 6: testing and the Toolkit, migration (Parallelizable: yes — distinct files)

- [x] Task 15. Testing and Scala Toolkit pages
  - [x] Task 15.1. ★ `testing-with-munit.adoc`
  - [x] Task 15.2. `munit-async-fixtures-and-other-frameworks.adoc`
  - [x] Task 15.3. `property-based-testing.adoc`
  - [x] Task 15.4. `files-and-processes-with-os-lib.adoc`
  - [x] Task 15.5. ★ `json-with-upickle.adoc`
  - [x] Task 15.6. `http-client-with-sttp.adoc` (Cask server started on `localhost` by the example)
  - [x] Task 15.7. `web-servers-with-cask.adoc`
- [x] Task 16. Migration pages
  - [x] Task 16.1. ★ `scala-2-and-scala-3-compatibility.adoc`
  - [x] Task 16.2. ★ `migrating-from-scala-2.adoc`
  - [x] Task 16.3. ★ `incompatibilities-and-dropped-features.adoc` (collect every "book outdated" row)
  - [x] Task 16.4. `upgrading-between-scala-3-versions.adoc`

### Group 8 — Slice 7a: practice and reference pages (Parallelizable: yes — distinct files; excludes pages needing all others)

- [x] Task 17. `style-guide.adoc` (every page of the official style guide)
- [x] Task 18. `domain-specific-languages.adoc`
- [x] Task 19. `language-evolution-sips-preview-and-experimental.adoc`
- [x] Task 20. ★ `release-history-and-whats-new.adoc` (every row of the version-baseline table with its release)
- [x] Task 21. ★ `ecosystem-and-learning-resources.adoc` (table per area, versions checked, selection criterion stated, no code beyond one-liners)

### Group 9 — Slice 7b: landing page, cheat sheet, integration (Parallelizable: no — Tasks 22-25 need every page to exist)

- [x] Task 22. `programming-languages/scala/index.adoc`: intro, page map grouped like the nav, ending with `== Bibliography`
  (all groups from the issue: official docs, specifications, official tools, books with notes, third-party; each linked)
- [x] Task 23. `programming-languages/scala/cheat-sheet.adoc` (disclaimer, intro linking `xref:attachment$scala-cheat-sheet.pdf[…]`
  with baseline and check date, grouped `*Group* --` paragraphs of `xref:` to every page, final download line, `== References`)
- [x] Task 24. `modules/ROOT/attachments/scala-cheat-sheet.pdf`: A4 one-page, dense, colour-coded, "Scala 3.10 (LTS 3.9)" + date in
  the header, written from scratch (not adapted from the official cheatsheet), covering every topic list in the issue incl.
  the "Scala 2 → Scala 3" strip; HTML in the scratchpad → headless Chrome `--print-to-pdf --no-pdf-header-footer`; verify exactly
  one page and preview as PNG; commit only the PDF
- [x] Task 25. Integration
  - [x] Task 25.1. `nav.adoc`: add `include::partial$nav-scala.adoc[]` after `nav-groovy.adoc`; reconcile `nav-scala.adoc` with final names
  - [x] Task 25.2. `programming-languages/index.adoc`: Scala bullet (after Groovy), `:description:`, `:keywords:` terms from the issue,
    "live only here" sentence
  - [x] Task 25.3. Root `modules/ROOT/pages/index.adoc`: add Scala to `:description:`/`:keywords:` only if they list languages
  - [x] Task 25.4. Back-links: one line in `kotlin/generics-and-variance.adoc` (`== See Also`) → `variance`; one line in
    `backend/quarkus/build-tooling-and-languages.adoc` (`=== Scala and Groovy`) → Scala section

### Group 10 — Verification (Parallelizable: no — depends on all previous groups)

- [x] Task 26. Build and checks
  - [x] Task 26.1. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings (Scala nav under Programming Languages)
  - [x] Task 26.2. Run the `CLAUDE.md` image, inline-code (on `build/site/**/programming-languages/scala`) and `<p>image::` greps;
    unquoted-comma alt-text grep on changed files; every `scala-*.svg` referenced; no stray admonitions; `$` in API URLs render
  - [x] Task 26.3. `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`) reports every diagram parsed
  - [x] Task 26.4. Check no `xref:` targets #196/#243/… pages; no real secrets/hosts (`/iru-check-security` or `detect-secrets` on changed files);
    confirm acceptance-criteria checklist item by item and render-check a sample of pages in the browser pane
