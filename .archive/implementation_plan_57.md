# Implementation Plan: Backend Development / Java Reference

## Task summary

Source: GitHub issue #57

Add a new **"Java Reference"** subsection under the existing **Guides & References / Backend Development** guide
of this repo's own `ROOT` Antora component, at `modules/ROOT/pages/backend/java/` — a **sibling of the existing
`backend/springboot/`** subsection. It documents **the Java language and its standard library**,
framework-agnostic (not Spring, not Jakarta EE, not JavaFX), anchored to the **current Java release line with
Java 25 LTS as the reference point** (no specific patch version pinned), as published at
https://dev.java/, the https://docs.oracle.com/javase/tutorial/[Java Tutorials], the
https://docs.oracle.com/en/java/javase/25/[JDK 25 documentation], the
https://docs.oracle.com/en/java/javase/25/docs/api/[Java SE 25 API specification (Javadoc)], and the
https://docs.oracle.com/javase/specs/jls/se25/html/index.html[Java Language Specification, Java SE 25].

Coverage: getting started (JDK/JVM, `javac`/`java`, JShell, single-file launch), language fundamentals (lexical
structure and style, primitive types and `var`, operators and expressions, strings and text blocks, control flow
including `switch` expressions, arrays), object-oriented programming (classes and objects, methods and
pass-by-value, inheritance and polymorphism, interfaces and default methods, records and sealed classes, enums,
nested/anonymous classes, lambdas and method references, generics), modern language features (pattern matching,
annotations and reflection), core library APIs (exceptions, `Optional`, the Collections Framework, streams and
collectors, functional programming with `java.util.function`, numbers and math, `java.time`, I/O and NIO.2,
regular expressions), concurrency (threads and the memory model, `java.util.concurrent` and `CompletableFuture`,
virtual threads), modularity/packaging/tooling (packages and the module system, the JDK tools and Maven/Gradle),
unit testing with JUnit 5 and Mockito, plus a one-page downloadable PDF cheat sheet.

Explanations must be brief and example-driven. **Every concept carries at least one runnable code example**
(`[source,java]` / `[source,console]` / `[source,bash]` / `[source,text]`), **links the concept** to the
specific page on dev.java / the Java Tutorials / the JLS (not a generic "see the Java docs"), and **links every
API type/method mentioned** to the Java SE 25 Javadoc (`https://docs.oracle.com/en/java/javase/25/docs/api/…`).
`[mermaid]` diagrams and/or hand-authored inline SVG figures (`modules/ROOT/images/java-*.svg`) are used where
they clarify a concept.

Three PDF books were consulted while preparing this section and appear **only as bibliography entries**, never as
the "primary" or "main" reference (matching the TypeScript / Python / SpringBoot disclaimers' wording):

- `~/Desktop/java1.pdf` — *Fundamentals of Java Programming*, Mitsunori Ogihara, Springer, 2018, ISBN
  978-3-319-89490-4 (print) / 978-3-319-89491-1 (eBook), DOI 10.1007/978-3-319-89491-1, 514 pp / 19 chapters. A
  CS-1 introductory textbook: "Hello, World!", the JVM/JRE/JDK and source→bytecode→compilation model, primitive
  types and literals, variables and arithmetic, `String` basics, `Scanner` input, procedural decomposition and
  methods (parameters, overloading, `Math`), `if`/`else`, `for`/`while`/`do-while`, `printf`,
  `String`/`StringBuilder`, `switch`, arrays / `Arrays` / multidimensional & jagged arrays / `args`, the `File`
  class and exception handling, designing object classes (encapsulation, `toString`), interfaces / inheritance /
  polymorphism, boxed types, `Comparable`, generics and the Collections Framework (`ArrayList`, `Comparator`),
  and recursion. **Predates Java 8 lambdas/streams and everything later** (no records, sealed types, pattern
  matching, text blocks, `switch` expressions, `var`, virtual threads, modules, JUnit, or Mockito). Publisher
  page: https://link.springer.com/book/10.1007/978-3-319-89491-1
- `~/Desktop/java2.pdf` — *Java in Two Semesters: Featuring JavaFX*, 4th ed., Quentin Charatan & Aaron Kans,
  Springer (Texts in Computer Science), 2019, ISBN 978-3-319-99419-2 (print) / 978-3-319-99420-8 (eBook), DOI
  10.1007/978-3-319-99420-8, 719 pp / 24 chapters. Semester 1: first program, building blocks, `Scanner` input,
  selection, iteration, methods, arrays (varargs, enhanced `for`, multidimensional, ragged), classes & objects,
  implementing classes (`static`, UML), inheritance (overriding, `abstract`, `final`, `Object`, `toString`,
  wrapper classes / autoboxing). Semester 2: interfaces & lambda expressions (inner / anonymous classes, method
  references, generics, bounded types, wildcards, functional interfaces), exceptions (checked/unchecked,
  try-with-resources, `Optional`, custom exceptions), the Collections Framework (`List`/`Set`/`Map`, iterators,
  sorting, `Comparable`/`Comparator`, `equals`/`hashCode`), files (text/binary, serialization, random access),
  packages (access, JDBC, Hibernate), multi-threaded programs (`Thread`, synchronization, thread states), the
  Stream API (creating, intermediate/terminal ops, collectors, infinite streams, parallelism), sockets, and
  "Java in context" (pointers, multiple inheritance, aliasing, `clone`, immutability, garbage collection, copy
  constructors). Also covers **JavaFX GUI development in depth (ch. 10, 16, 17)** — out of scope for this
  section. **Covers up to Java 8 (+ a little Java 9)**; predates records, sealed types, pattern matching, text
  blocks, `switch` expressions, `var`, virtual threads, and the modern `HttpClient`/NIO.2. Publisher page:
  https://link.springer.com/book/10.1007/978-3-319-99420-8
- `~/Desktop/java3.pdf` — *Modern Java in Action: Lambdas, streams, functional and reactive programming*,
  Raoul-Gabriel Urma, Mario Fusco & Alan Mycroft, Manning, 2019 (2nd ed. of *Java 8 in Action*), ISBN
  9781617293566, 592 pp / 21 chapters + 4 appendices. Java 8/9/10/11: behavior parameterization, lambda
  expressions, functional interfaces, method references, the Stream API (filtering, slicing, mapping,
  finding/matching, reducing, numeric streams, building streams, `Collectors` — grouping/partitioning/joining —
  custom collectors), parallel streams / fork-join / `Spliterator`, Collection API enhancements (factory
  methods, `removeIf`, `replaceAll`, `Map` methods, `ConcurrentHashMap`), refactoring/testing/debugging with
  lambdas, DSLs, `Optional`, the `java.time` API, `default` methods and resolution rules, the Java Module System,
  `CompletableFuture` and reactive programming (`Flow`, RxJava), functional-programming techniques (higher-order
  functions, currying, persistent data structures, lazy evaluation, pattern matching, memoization), a
  Java-vs-Scala comparison, and `var`. **Covers up to Java 11**; predates records, sealed types, pattern
  matching for `instanceof`/`switch`, text blocks, finalized `switch` expressions, virtual threads, sequenced
  collections, and the modern `HttpClient`. Publisher page: https://www.manning.com/books/modern-java-in-action

**All three books predate the current Java release line.** Where a book's material is dated or silent on a modern
feature — records (16+), sealed classes (17+), pattern matching for `instanceof` (16+) / `switch` (21+) / record
deconstruction (21+), text blocks (15+), `switch` expressions (14+), `var` (10+), virtual threads (21+),
sequenced collections (21+), the module system (9+), `java.net.http.HttpClient` (11+), NIO.2 `java.nio.file`
(7+), JShell (9+), and all of JUnit 5 / Mockito — **the official documentation and the JUnit 5 / Mockito docs
are the sole sources**, and the disclaimer/relevant pages say so plainly rather than presenting the gap as a
discrepancy to reconcile. Documentation prose must be original explanation verified against the official docs and
Javadoc, **not** presented as derived from the books; the books appear only in `== Bibliography` and the
disclaimer's "consulted while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, Tailwind, TypeScript, Vue.js, Vaadin, Python, and SpringBoot reference sections. The closest
precedents are [.archive/implementation_plan_53.md](.archive/implementation_plan_53.md) (issue #53, "Python
Reference" — a new whole-language reference grounded in an official doc site plus bibliography-only books that
predate the current version, with mermaid diagrams, hand-authored SVGs, a `== Bibliography`, and a
headless-Chrome one-page PDF cheat sheet) and
[.archive/implementation_plan_55.md](.archive/implementation_plan_55.md) (issue #55, "SpringBoot Reference" —
the first section under Backend Development, which created `backend/index.adoc` and the nav block this plan
extends). Both organise into four task groups: scaffold the disclaimer → parallel content pages → cheat sheet →
section index + nav/landing wiring + build verification.

### Choices made on the requester's behalf (best-practice defaults, consistent with this repo's pattern and issue #57's text — stated here so they can be challenged during review)

1. **Anchor to Java 25 LTS as "the current release line"**, no patch version pinned (matching the Python
   section). Examples use modern idioms throughout: `var` for obvious local types, `record` for immutable
   carriers, `switch` expressions and pattern matching, text blocks for multi-line strings, the enhanced `for`,
   try-with-resources, `java.time`, NIO.2 `Files`/`Path`, `java.net.http.HttpClient`. Where a book uses an older
   or now-discouraged pattern (e.g. `java1`'s pre-lambda anonymous classes, `java2`'s `SimpleDateFormat` /
   manual stream close, `java3`'s pre-finalization `switch`-expression syntax), the page documents the current
   approach and notes the difference is because the book predates it, not because the book is "wrong."
2. **Page breakdown: 33 content pages + 1 cheat sheet + 1 subsection index (35 `.adoc` files).** Issue #57's page
   list is followed **as-is** — every page maps to a distinct dev.java / Java Tutorials / JLS area and to real
   book chapters. The issue's suggested merges (`annotations-and-reflection` already merged; `optional` into
   `exceptions`/`streams`; `nested-and-anonymous-classes` into `lambdas`) are **not** applied: `Optional` gets a
   full chapter in `java3` and is a distinct concept; nested/anonymous classes are a distinct language construct
   from lambdas (`java2` ch. 13 treats them separately). No page is added beyond the issue's list.
3. **All three books are bibliography-only.** Neither the disclaimer nor any per-page admonition may describe any
   book as the primary or main reference; they appear only as `== Bibliography` entries and in the disclaimer's
   "consulted while preparing these pages" clause. Documentation prose is original explanation verified against
   the official docs and Javadoc.
4. **The subsection is named "Java Reference"** in the subsection index title, the `backend/index.adoc` bullet,
   the `nav.adoc` `***` entry, and the root `pages/index.adoc` bullet — matching the existing siblings.
5. **Placed first under Backend Development**, before **SpringBoot Reference**, in `nav.adoc`,
   `backend/index.adoc`, and `pages/index.adoc` — a deliberate deviation from this repo's usual "append in the
   order added" ordering, because the language is a prerequisite for the framework. (Challenge this in review if
   append-order consistency is preferred.)
6. **Mermaid is the default for flow/decision/state/graph diagrams; eight hand-authored SVGs** where a spatial
   figure is clearer (listed in Group 2 tasks). The implementer may add further small `java-*.svg` figures while
   writing a page if one adds real value — not pre-planned as separate tasks. No diagram where a short code block
   is clearer.
7. **No project-picker tile** for Java Reference — like every other Guides & References subsection it lives only
   in `nav.adoc`, its subsection index, and the root `pages/index.adoc` "== Guides & References" list.
8. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
   layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
   static checked-in asset at `modules/ROOT/attachments/java-cheat-sheet.pdf`, linked via
   `xref:attachment$java-cheat-sheet.pdf[Download the Java Cheat Sheet (PDF)]`. The cheat sheet must be
   **exactly one A4 page** (page-count check + a rendered preview with no clipping). No HTML source is kept in
   the repo.
9. **No language/framework tag on any task.** The installed `*-code-one-task` skills are `java` / `dotnet` /
   `database` only, and all of them operate on a real compiled project — this repo has **no application source
   code**; every task below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left **untagged**
   (identical to `.archive/implementation_plan_53.md` and `_55.md`). The `[source,java]` snippets in the pages
   are illustrative AsciiDoc, not a compiled module.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml), component name `irurueta`), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under `modules/ROOT/pages/`. The only verification
  is a clean `npx antora antora-playbook.yml` build (no lint/test suite). `build/` is gitignored.
- **Base branch:** `feature/57`, branched from `main` at `80e7a55` (local `main` was fast-forwarded to
  `origin/main` first). The **Backend Development** guide already exists at this ref (added by PR #56 / issue
  #55):
  - [modules/ROOT/pages/backend/index.adoc](modules/ROOT/pages/backend/index.adoc) — 15 lines: `= Backend
    Development` header with `:description:` / `:keywords:` (currently mention only Spring Boot), a one-paragraph
    intro ending "...server-side application development.", a `== Sections` heading, and **one** bullet:
    `* xref:backend/springboot/index.adoc[SpringBoot Reference] -- ...`.
  - [modules/ROOT/pages/backend/springboot/](modules/ROOT/pages/backend/springboot) — 26 `.adoc` pages + an
    `index.adoc` following the standard section pattern.
  - [modules/ROOT/partials/springboot-disclaimer.adoc](modules/ROOT/partials/springboot-disclaimer.adoc) — the
    `[IMPORTANT]` / `====` disclaimer to model `java-disclaimer.adoc`'s tone on (official docs are "the
    references these pages are written and verified against"; "Several local books ... were consulted while
    preparing these pages. None of them is the primary or main reference for this section ...").
  - [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) — under `* Guides & References` (line 16): the Database
    Development block, then `** xref:web/index.adoc[Web Development]` (line 84) with all its `***` subsections,
    then **`** xref:backend/index.adoc[Backend Development]` at line 397**, immediately followed by
    `*** xref:backend/springboot/index.adoc[SpringBoot Reference]` (line 398) and its 26 `****` page entries
    (lines 399–424), which end the file.
  - [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc) — the `== Guides & References` section (near
    line 77) lists Database Development, then Web Development with its `**` subsections (…Python Reference last),
    then at the end `* xref:backend/index.adoc[Backend Development] -- ... starting with Spring Boot.` followed by
    a single `** xref:backend/springboot/index.adoc[SpringBoot Reference] -- ...` bullet, then `== About me`.
    The page's own `:description:` / `:keywords:` (top of file) enumerate the sections and would need "Java"
    added.
- **Standard section pattern** (reused verbatim here), see `modules/ROOT/pages/web/python/`:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` / `====` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block and one blank line. Model on
    [modules/ROOT/partials/python-disclaimer.adoc](modules/ROOT/partials/python-disclaimer.adoc) and
    `springboot-disclaimer.adoc`.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph. Body uses `[source,java]` /
    `[source,console]` / `[source,bash]` / `[source,text]` fenced by `----`, `[mermaid]` blocks for diagrams, and
    `image::java-<name>.svg[alt,width=…,role=text-center]` for figures.
  - A subsection `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    [modules/ROOT/pages/web/python/index.adoc](modules/ROOT/pages/web/python/index.adoc) for the exact format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$java-cheat-sheet.pdf[Download the Java Cheat Sheet (PDF)]`, with the actual
    PDF under `modules/ROOT/attachments/`.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used in this
  repo), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute is set; `[source,java]`
  is a cosmetic class only. `modules/ROOT/images/` holds the existing hand-authored `*.svg` figures;
  `modules/ROOT/attachments/` holds the 18 existing cheat-sheet PDFs.
- **AsciiDoc gotcha** (carried over from every prior section): inline `{foo}` text *outside* `[source]` blocks
  is parsed as an Antora attribute reference and emits a "skipping reference to missing attribute" build
  **warning**. Acute for Java prose: annotation-heavy generics (`Map<K, V>` is fine; a literal `{ }` block,
  `String.format` placeholders like `%s`, or `record Point(int x, int y) { }` written inline in prose are the
  risk). **Escape any literal braces in prose as `\{ … }`.** Inside `[source,…]` blocks **no escaping is
  needed**. Angle-bracket generics in prose are fine unescaped. The final build (last task) must come back with
  **zero** such warnings and no `xref`/AsciiDoc errors.
- **`[source]` language tokens**: `[source,java]` for all Java code; `[source,console]` for JShell transcripts
  (`jshell>` prompts) and command output; `[source,bash]` for shell commands (`javac`, `java`, `jar`, `mvn`,
  `gradle`); `[source,text]` for plain-text layouts (directory trees, `module-info` graphs as text). If a token
  ever produces a build issue, fall back progressively (`java` → `text`; `console` → `text`) — verified by the
  final build task.
- **New file map** this plan creates under `modules/ROOT/pages/backend/java/` (all `.adoc`, 35 files):
  `index.adoc`, `getting-started.adoc`, `lexical-structure-and-style.adoc`, `primitive-types-and-variables.adoc`,
  `operators-and-expressions.adoc`, `strings-and-text.adoc`, `control-flow.adoc`, `arrays.adoc`,
  `classes-and-objects.adoc`, `methods-and-parameters.adoc`, `inheritance-and-polymorphism.adoc`,
  `interfaces.adoc`, `records-and-sealed-classes.adoc`, `enums.adoc`, `nested-and-anonymous-classes.adoc`,
  `lambdas-and-method-references.adoc`, `generics.adoc`, `pattern-matching.adoc`,
  `annotations-and-reflection.adoc`, `exceptions.adoc`, `optional.adoc`, `collections-framework.adoc`,
  `streams-and-collectors.adoc`, `functional-programming.adoc`, `numbers-and-math.adoc`, `dates-and-times.adoc`,
  `io-and-files.adoc`, `regular-expressions.adoc`, `concurrency-basics.adoc`, `high-level-concurrency.adoc`,
  `virtual-threads.adoc`, `packages-and-modules.adoc`, `build-and-tooling.adoc`, `testing.adoc`,
  `cheat-sheet.adoc`. Plus `modules/ROOT/partials/java-disclaimer.adoc`, eight hand-authored SVGs under
  `modules/ROOT/images/` (`java-compilation-pipeline.svg`, `java-jvm-memory.svg`, `java-object-hierarchy.svg`,
  `java-exception-hierarchy.svg`, `java-collections-hierarchy.svg`, `java-stream-pipeline.svg`,
  `java-thread-states.svg`, `java-virtual-vs-platform-threads.svg`),
  `modules/ROOT/attachments/java-cheat-sheet.pdf`, and edits to
  [modules/ROOT/pages/backend/index.adoc](modules/ROOT/pages/backend/index.adoc),
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), and
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc).

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then a
  blank line, then `include::partial$java-disclaimer.adoc[]`, then a blank line, then a one/two-sentence lead
  paragraph — identical placement to `include::partial$python-disclaimer.adoc[]` in
  `modules/ROOT/pages/web/python/index.adoc`.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** — `[source,java]` /
  `[source,console]` / `[source,bash]` / `[source,text]` as appropriate.
- **Every concept links to the specific dev.java / Java Tutorials / JLS page** for it (inline
  `https://dev.java/learn/…[link text]` or `https://docs.oracle.com/javase/tutorial/…[…]` or
  `https://docs.oracle.com/javase/specs/jls/se25/html/…[…]`), not just a generic "see the Java docs"; and
  **every API type/method mentioned links to its Java SE 25 Javadoc page**
  (`https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/…`). The testing page links primarily to
  https://junit.org/junit5/docs/current/user-guide/ and https://site.mockito.org/.
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Prefer **modern Java** everywhere (see Choice 1). Where a book uses an older pattern, document the current one
  and note the change is because the book predates it.
- Diagrams via `[mermaid]` blocks; figures via `image::java-*.svg[alt,width=…,role=text-center]` with the SVG
  hand-authored under `modules/ROOT/images/`.
- Each task below references its issue #57 page bullet and implements every concept it lists for that page,
  expanded with concrete sub-topics grounded in the three books' tables of contents and the official docs'
  tutorial/library structure.
- **Scope exclusions** (issue #57 "Out of scope"): no JavaFX/Swing/AWT, no Spring/Jakarta EE, no applets/RMI/
  JNI deep-dives, no FFM/Vector/incubator APIs beyond a passing mention, no Java-vs-Scala, no DSL construction,
  and reactive libraries only as a one-paragraph `java.util.concurrent.Flow` mention on the high-level
  concurrency page.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Java disclaimer partial — `modules/ROOT/partials/java-disclaimer.adoc` — created `modules/ROOT/partials/java-disclaimer.adoc` (`[IMPORTANT]` / `====` admonition modeled on `python-disclaimer.adoc` and `springboot-disclaimer.adoc`). No tests/coverage/quality gates apply (AsciiDoc partial in a docs-only repo, no license-header convention for partials); full-build validation is deferred to the plan's final task.
  - [x] Task 1.1. Create `modules/ROOT/partials/java-disclaimer.adoc` as an `[IMPORTANT]` admonition
    (`[IMPORTANT]` then `====` … `====`) following the shape of `modules/ROOT/partials/python-disclaimer.adoc`
    and `springboot-disclaimer.adoc`. It must state:
    - this section documents **the current Java release line, with Java 25 LTS as the reference point** (no
      specific patch version pinned), as published at https://dev.java/[the Java developer portal], the
      https://docs.oracle.com/javase/tutorial/[Java Tutorials], and the
      https://docs.oracle.com/en/java/javase/25/docs/api/[Java SE API specification], **which are the references
      these pages are written and verified against**;
    - the content was generated with the assistance of AI and should be verified against the official
      documentation before being relied on in production;
    - *Fundamentals of Java Programming* (Mitsunori Ogihara, Springer, 2018), *Java in Two Semesters*, 4th ed.
      (Quentin Charatan & Aaron Kans, Springer, 2019), and *Modern Java in Action* (Raoul-Gabriel Urma, Mario
      Fusco & Alan Mycroft, Manning, 2019) are **listed in this section's bibliography** and were consulted
      while preparing these pages — worded so it does **not** state or imply any book is the primary or main
      reference — and **all three predate the current release line** (`java1` predates Java 8's lambdas and
      streams; `java2` covers up to Java 8; `java3` covers up to Java 11), with no coverage of records, sealed
      classes, pattern matching, text blocks, `switch` expressions, `var`, virtual threads, the module system,
      or the modern `HttpClient`/NIO.2, so on any discrepancy — or wherever a book is simply silent on a modern
      feature — the official documentation wins.
  - [x] Task 1.2. Confirm it is included via `include::partial$java-disclaimer.adoc[]` on every page created in
    Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` /
    `:keywords:` block and one blank line. Record the exact opening shape for Groups 2–4:
    1. `= <Page Title>`
    2. `:description: <one-line description>`
    3. `:keywords: <comma-separated keywords>`
    4. one blank line
    5. `include::partial$java-disclaimer.adoc[]` (verbatim, its own line, flush left, no attributes)
    6. one blank line
    7. page body begins

### Group 2 — Content pages

**Parallelizable: yes** — 33 independent pages (Tasks 2–34). Each includes the Group 1 disclaimer partial and
may cross-reference the other new pages in this plan (cross-links between new pages are fine to write now — every
target is listed in this plan and validated together in the final build task), but **none depends on another new
page's content**. Each page follows the "Conventions" section above. Eight tasks also create a hand-authored SVG
as a sub-task.

> **Group 2 status: COMPLETE.** All 33 content pages exist under `modules/ROOT/pages/backend/java/` (181–306
> lines each, correct opening shape with `include::partial$java-disclaimer.adoc[]` on line 5, runnable
> `[source,java]` examples, dev.java / Java Tutorials / JLS + Java SE 25 Javadoc links, `== See Also` blocks)
> and all 8 `modules/ROOT/images/java-*.svg` figures exist. Authored across 7 parallel batches (A–G) after a
> rate-limit interruption; a NUL-byte artifact in `arrays.adoc` noted by a batch was corrected (verified: no
> NUL bytes remain). Full brace/xref/attribute validation happens in Task 40's Antora build.

#### Getting started

- [x] Task 2. Create `modules/ROOT/pages/backend/java/getting-started.adoc` (issue #57 "Getting started"; java1
  ch. 1; java2 ch. 1; dev.java "Running Your First Java Application" / "Staying Aware of New Features")
  - [x] Task 2.1. What Java is: a statically-typed, class-based, object-oriented language compiled to
    platform-neutral bytecode and run on the JVM ("write once, run anywhere"); the JDK vs. the JRE.
    `[source,text]`.
  - [x] Task 2.2. Installing a JDK — Oracle JDK, OpenJDK builds, Adoptium Temurin; verifying with
    `java -version` / `javac -version`; `JAVA_HOME`. `[source,bash]` + `[source,console]`.
  - [x] Task 2.3. Compiling and running: `javac Hello.java` → `Hello.class` → `java Hello`; the single-file
    source launcher (`java Hello.java`); `main(String[] args)` and the implicitly declared class / instance
    `main` form. `[source,java]` + `[source,bash]`.
  - [x] Task 2.4. **JShell** (the REPL): starting it, evaluating snippets, `/vars` `/methods` `/exit`.
    `[source,console]`.
  - [x] Task 2.5. IDEs (IntelliJ IDEA, Eclipse, VS Code + Java extensions) — brief, tool-agnostic; the
    six-month release cadence, LTS releases, and preview features (`--release`, `--enable-preview`).
    `[source,bash]`.
  - [x] Task 2.6. Embed `image::java-compilation-pipeline.svg[…]` (Task 2.7). Links:
    https://dev.java/learn/getting-started/, https://docs.oracle.com/javase/tutorial/getting-started/,
    https://docs.oracle.com/en/java/javase/25/docs/specs/man/java.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Runtime.Version.html.
  - [x] Task 2.7. Create `modules/ROOT/images/java-compilation-pipeline.svg` — hand-authored: `Hello.java` →
    `javac` → `Hello.class` (bytecode) → JVM box containing *class loader → bytecode verifier → interpreter +
    JIT compiler* → native execution, with a side note "the same `.class` runs on any JVM".

#### Language fundamentals

- [x] Task 3. Create `modules/ROOT/pages/backend/java/lexical-structure-and-style.adoc` (issue #57 "Language
  fundamentals"; JLS §3; java1 ch. 1–2; java2 ch. 1)
  - [x] Task 3.1. Source-file structure: one `public` top-level type per file, the file/type name rule,
    `package` and `import` order, Unicode source. `[source,java]`.
  - [x] Task 3.2. Identifiers and the reserved-word / contextual-keyword list; literals overview (forward to the
    types page); `//`, `/* */`, and Javadoc `/** */` comments. `[source,java]`.
  - [x] Task 3.3. Statements, blocks, and semicolons; whitespace insignificance.
  - [x] Task 3.4. Standard code conventions — `PascalCase` types, `camelCase` members, `UPPER_SNAKE` constants,
    `final` for constants, brace style — linking to the conventions doc rather than restating it. `[source,java]`.
    Links: https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html,
    https://docs.oracle.com/javase/tutorial/java/nutsandbolts/,
    https://www.oracle.com/java/technologies/javase/codeconventions-contents.html.

- [x] Task 4. Create `modules/ROOT/pages/backend/java/primitive-types-and-variables.adoc` (issue #57; dev.java
  "Java Language Basics"; java1 ch. 2; java2 ch. 2; java3 §21.3 for `var`)
  - [x] Task 4.1. The eight primitive types (`byte`/`short`/`int`/`long`/`float`/`double`/`char`/`boolean`),
    their sizes and ranges, and default field values. `[source,java]`.
  - [x] Task 4.2. Literals: decimal/hex/binary/octal integers, underscores in numeric literals, `L`/`f`/`d`
    suffixes, `char` escapes, `true`/`false`/`null`. `[source,java]`.
  - [x] Task 4.3. Declaration and initialization; `final` local variables and constants; definite assignment.
    `[source,java]`.
  - [x] Task 4.4. **`var`** local-variable type inference (Java 10+): where it is allowed and where it is not
    (no fields, no method parameters/returns, needs an initializer), and readability guidance. `[source,java]`.
  - [x] Task 4.5. Widening vs. narrowing primitive conversions, explicit casts, and integer overflow /
    `Math.addExact`. `[source,java]`. Links:
    https://dev.java/learn/language-basics/primitive-types/,
    https://dev.java/learn/language-basics/using-var/,
    https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Math.html.

- [x] Task 5. Create `modules/ROOT/pages/backend/java/operators-and-expressions.adoc` (issue #57; dev.java
  "Using Operators" / "Summary of Operators"; java1 ch. 2, ch. 6; java2 ch. 2–3)
  - [x] Task 5.1. Arithmetic (`+ - * / %`, integer vs. floating-point division), unary, increment/decrement.
    `[source,java]`.
  - [x] Task 5.2. Relational and equality operators; logical `&& || !` with short-circuiting; the conditional
    (ternary) operator. `[source,java]`.
  - [x] Task 5.3. Bitwise and shift operators (`& | ^ ~ << >> >>>`); assignment and compound assignment.
    `[source,java]`.
  - [x] Task 5.4. `instanceof` (with a forward pointer to pattern matching); operator precedence and
    associativity; left-to-right operand evaluation. `[source,java]` + `[source,text]` (precedence table).
    Links: https://dev.java/learn/language-basics/operators/,
    https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html,
    https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html.

- [x] Task 6. Create `modules/ROOT/pages/backend/java/strings-and-text.adoc` (issue #57; java1 ch. 2, ch. 8–9;
  java2 ch. 7; JEP 378 text blocks)
  - [x] Task 6.1. `String` immutability, the string constant pool, `==` vs. `equals` / `equalsIgnoreCase`,
    `hashCode`. `[source,java]`.
  - [x] Task 6.2. Common `String` methods (`length`, `charAt`, `substring`, `indexOf`, `split`, `strip`,
    `replace`, `chars`, `repeat`, `isBlank`), and `char` vs. Unicode code points (`codePointAt`,
    `String.codePoints`). `[source,java]`.
  - [x] Task 6.3. `StringBuilder` (and a note on `StringBuffer`); when concatenation in a loop is a problem.
    `[source,java]`.
  - [x] Task 6.4. **Text blocks** (`"""`): incidental-whitespace stripping, `\` and `\s`, when to use them.
    `[source,java]`.
  - [x] Task 6.5. Formatting: `String.format` / `formatted` / `String.join` / `"%s".formatted(...)`; a pointer
    to `java.util.Formatter`. `[source,java]`. Links:
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html,
    https://docs.oracle.com/en/java/javase/25/text-blocks/index.html,
    https://docs.oracle.com/javase/tutorial/java/data/strings.html.

- [x] Task 7. Create `modules/ROOT/pages/backend/java/control-flow.adoc` (issue #57; dev.java "Control Flow
  Statements" / "Branching with Switch Expressions"; java1 ch. 6–7, ch. 10–11; java2 ch. 3–4)
  - [x] Task 7.1. `if`/`else`, `while`, `do`/`while`. `[source,java]`.
  - [x] Task 7.2. The classic `for` and the enhanced `for` (for-each) over arrays and `Iterable`;
    `break`/`continue` and labeled statements. `[source,java]`.
  - [x] Task 7.3. **`switch` statements**: `case` labels, fall-through and `break`, `default`; `switch` on
    strings and enums. `[source,java]`.
  - [x] Task 7.4. **`switch` expressions** (Java 14+): arrow (`->`) labels, `yield`, multi-label cases,
    exhaustiveness, `switch` as a value — with a forward pointer to pattern matching in `switch`. `[source,java]`.
  - [x] Task 7.5. A `[mermaid]` decision flowchart contrasting a `switch` statement (fall-through, `break`) with
    an equivalent arrow-form `switch` expression. Links:
    https://dev.java/learn/language-basics/controlling-flow/,
    https://dev.java/learn/language-basics/switch-expression/,
    https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html.

- [x] Task 8. Create `modules/ROOT/pages/backend/java/arrays.adoc` (issue #57; dev.java "Creating Arrays"; java1
  ch. 12–14; java2 ch. 6)
  - [x] Task 8.1. Declaration, allocation (`new int[n]`), array literals, `length`, default element values,
    `ArrayIndexOutOfBoundsException`. `[source,java]`.
  - [x] Task 8.2. Iteration (indexed and enhanced `for`); arrays are covariant and reified (contrast with
    generics, forward pointer). `[source,java]`.
  - [x] Task 8.3. Multidimensional and jagged arrays. `[source,java]`.
  - [x] Task 8.4. `java.util.Arrays` (`sort`, `binarySearch`, `fill`, `copyOf`, `equals`, `deepEquals`,
    `toString`, `deepToString`, `asList`, `stream`); `varargs` and its relationship to arrays;
    `main(String[] args)` argument handling. `[source,java]`. Links:
    https://dev.java/learn/language-basics/arrays/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html,
    https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html.

#### Object-oriented programming

- [x] Task 9. Create `modules/ROOT/pages/backend/java/classes-and-objects.adoc` (issue #57; dev.java "Classes
  and Objects"; java1 ch. 16; java2 ch. 7–8)
  - [x] Task 9.1. Class declaration; fields, methods, constructors; `this`; constructor chaining with
    `this(...)`; the default constructor. `[source,java]`.
  - [x] Task 9.2. Object creation on the heap, reference semantics, `null` and `NullPointerException` (and
    helpful NPE messages); garbage collection conceptually (no `free`/`delete`). `[source,java]`.
  - [x] Task 9.3. `static` fields, methods, and initializer blocks; instance initializer blocks; constants
    (`static final`). `[source,java]`.
  - [x] Task 9.4. Access modifiers at a glance (`public` / `protected` / package-private / `private`) — full
    treatment on the packages page; encapsulation and accessors. `[source,java]`.
  - [x] Task 9.5. Embed `image::java-jvm-memory.svg[…]` (Task 9.6). Links:
    https://dev.java/learn/classes-objects/,
    https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html.
  - [x] Task 9.6. Create `modules/ROOT/images/java-jvm-memory.svg` — hand-authored: per-thread stacks (frames
    with local variables and object *references*) on one side, the shared heap (objects) on the other, arrows
    from stack references into heap objects, and a small "class metadata → metaspace" box.

- [x] Task 10. Create `modules/ROOT/pages/backend/java/methods-and-parameters.adoc` (issue #57; java1 ch. 4–5,
  ch. 19; java2 ch. 5)
  - [x] Task 10.1. Method declaration, parameters, return values, `void`; `static` vs. instance methods.
    `[source,java]`.
  - [x] Task 10.2. **Java is pass-by-value** — including for reference types (the *reference* is copied);
    worked example showing a reassigned parameter vs. a mutated object. `[source,java]`.
  - [x] Task 10.3. Overloading and overload resolution (most-specific, boxing/varargs phases); `varargs`
    methods. `[source,java]`.
  - [x] Task 10.4. Recursion (factorial, GCD, Towers of Hanoi) and the call stack / `StackOverflowError`;
    utility APIs `java.lang.Math` and `java.util.Objects` (`requireNonNull`, `equals`, `hash`). `[source,java]`.
    Links: https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html,
    https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html.

- [x] Task 11. Create `modules/ROOT/pages/backend/java/inheritance-and-polymorphism.adoc` (issue #57; dev.java
  "Inheritance"; java1 ch. 17; java2 ch. 9, ch. 24)
  - [x] Task 11.1. `extends`, single implementation inheritance, constructor chaining with `super(...)`, field
    hiding vs. method overriding. `[source,java]`.
  - [x] Task 11.2. Overriding vs. overloading; `@Override`; covariant return types; `final` methods/classes;
    `abstract` classes and methods. `[source,java]`.
  - [x] Task 11.3. Runtime polymorphism / dynamic dispatch; upcasting and downcasting; `ClassCastException`;
    `instanceof` before a cast. `[source,java]`.
  - [x] Task 11.4. The root `java.lang.Object`: `toString`, `equals`, `hashCode` (the contract and a correct
    implementation with `Objects.equals`/`Objects.hash`), `getClass`, and a note on `clone`/`Cloneable` being
    discouraged (prefer copy constructors / factories). `[source,java]`.
  - [x] Task 11.5. Embed `image::java-object-hierarchy.svg[…]` (Task 11.6). Links:
    https://dev.java/learn/inheritance/,
    https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html#equals(java.lang.Object).
  - [x] Task 11.6. Create `modules/ROOT/images/java-object-hierarchy.svg` — hand-authored: `java.lang.Object` at
    the root, an `interface Shape` and an `abstract class AbstractShape implements Shape`, two concrete
    subclasses (`Circle`, `Rectangle`), and a call site holding a `Shape` reference with an arrow to the
    concrete method actually dispatched.

- [x] Task 12. Create `modules/ROOT/pages/backend/java/interfaces.adoc` (issue #57; dev.java "Interfaces"; java1
  ch. 17; java2 ch. 13; java3 ch. 13)
  - [x] Task 12.1. Interface declaration; abstract methods; a class implementing multiple interfaces (multiple
    inheritance of *type*); `public static final` constant fields. `[source,java]`.
  - [x] Task 12.2. **`default` methods** (why they were added — API evolution), **`static`** interface methods,
    and **`private`** interface methods. `[source,java]`.
  - [x] Task 12.3. Functional interfaces and `@FunctionalInterface` (forward pointer to lambdas).
    `[source,java]`.
  - [x] Task 12.4. `Comparable<T>` vs. `Comparator<T>`; `Comparator.comparing` / `thenComparing` / `reversed`.
    `[source,java]`.
  - [x] Task 12.5. `default`-method resolution rules: class wins over interface, most-specific interface wins,
    explicit `Interface.super.method()` disambiguation, the diamond case. `[source,java]`. Links:
    https://dev.java/learn/interfaces/,
    https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Comparator.html.

- [x] Task 13. Create `modules/ROOT/pages/backend/java/records-and-sealed-classes.adoc` (issue #57 — **official
  documentation only; none of the three books cover these**; dev.java "Using Records to Model Immutable Data";
  JEP 395 / 409; JDK 25 language guide)
  - [x] Task 13.1. **`record`**: components, the canonical constructor, generated accessors / `equals` /
    `hashCode` / `toString`; the **compact constructor** for validation/normalization; custom and additional
    constructors; static factory methods; implementing interfaces; records as transparent immutable carriers
    (no inheritance, implicitly `final`). `[source,java]`.
  - [x] Task 13.2. When a `record` fits vs. a normal class vs. a plain `Map`/array. `[source,java]`.
  - [x] Task 13.3. **`sealed`** classes and interfaces: `permits`, and `final` / `sealed` / `non-sealed`
    subtypes; the same-module/same-package rule; exhaustiveness for `switch`. `[source,java]`.
  - [x] Task 13.4. Records + sealed types + pattern matching: record deconstruction patterns over a sealed
    hierarchy (short teaser; full treatment on the pattern-matching page). `[source,java]`. Links:
    https://dev.java/learn/records/, https://docs.oracle.com/en/java/javase/25/language/records.html,
    https://docs.oracle.com/en/java/javase/25/language/sealed-classes-and-interfaces.html.

- [x] Task 14. Create `modules/ROOT/pages/backend/java/enums.adoc` (issue #57; java2 ch. 21; dev.java; JDK 25
  Javadoc for `java.lang.Enum`)
  - [x] Task 14.1. `enum` constants; `values()`, `valueOf(String)`, `name()`, `ordinal()`; enums in `switch`.
    `[source,java]`.
  - [x] Task 14.2. Enums with fields, a constructor, and methods; constant-specific method bodies (abstract
    method per constant). `[source,java]`.
  - [x] Task 14.3. `java.util.EnumSet` and `EnumMap` and why they beat `HashSet`/`HashMap` for enum keys.
    `[source,java]`. Links:
    https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Enum.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/EnumSet.html.

- [x] Task 15. Create `modules/ROOT/pages/backend/java/nested-and-anonymous-classes.adoc` (issue #57; java2
  ch. 13; java3 ch. 2; dev.java)
  - [x] Task 15.1. `static` nested classes; when to use them (helper types scoped to the outer class).
    `[source,java]`.
  - [x] Task 15.2. Inner (non-`static`) classes and the enclosing instance (`Outer.this`); the
    `outer.new Inner()` syntax; memory-leak caveat. `[source,java]`.
  - [x] Task 15.3. Local classes and **anonymous classes**; capture of effectively-final variables; when an
    anonymous class is still the right tool vs. a lambda (multiple methods, state, a named type). `[source,java]`.
    Links: https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html,
    https://docs.oracle.com/javase/tutorial/java/javaOO/anonymousclasses.html.

- [x] Task 16. Create `modules/ROOT/pages/backend/java/lambdas-and-method-references.adoc` (issue #57; dev.java
  "Lambda Expressions"; java2 ch. 13; java3 ch. 2–3)
  - [x] Task 16.1. Lambda syntax (`(a, b) -> expr` / block body), target typing against a functional interface,
    parameter type inference and `var` parameters. `[source,java]`.
  - [x] Task 16.2. Capture of effectively-final variables; `this` refers to the enclosing instance (unlike an
    anonymous class). `[source,java]`.
  - [x] Task 16.3. The four method-reference kinds: `Type::staticMethod`, `instance::method`,
    `Type::instanceMethod`, `Type::new`. `[source,java]`.
  - [x] Task 16.4. Lambda vs. anonymous class (no new scope, no separate `.class`, no shadowing). `[source,java]`.
    Links: https://dev.java/learn/lambdas/,
    https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html,
    https://docs.oracle.com/javase/tutorial/java/javaOO/methodreferences.html.

- [x] Task 17. Create `modules/ROOT/pages/backend/java/generics.adoc` (issue #57; dev.java "Generics" + Java
  Tutorials Generics trail; java1 ch. 18; java2 ch. 13)
  - [x] Task 17.1. Generic classes and interfaces; type parameters; the diamond operator; generic methods and
    inference. `[source,java]`.
  - [x] Task 17.2. Bounded type parameters (`<T extends Comparable<T>>`); multiple bounds. `[source,java]`.
  - [x] Task 17.3. Wildcards: `? extends` (producer) vs. `? super` (consumer), the **PECS** rule, unbounded
    `?`. `[source,java]`.
  - [x] Task 17.4. **Type erasure** and its consequences: no `new T[]`, no `T.class`, no `instanceof T`,
    bridge methods, `@SafeVarargs`, heap pollution; reifiable vs. non-reifiable types (contrast with arrays).
    `[source,java]`. Links: https://dev.java/learn/generics/,
    https://docs.oracle.com/javase/tutorial/java/generics/,
    https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.4.

#### Modern language features

- [x] Task 18. Create `modules/ROOT/pages/backend/java/pattern-matching.adoc` (issue #57 — **official
  documentation only**; dev.java "Using Pattern Matching"; JEP 394 / 440 / 441; JDK 25 language guide)
  - [x] Task 18.1. Pattern matching for **`instanceof`**: the binding variable, scope/flow typing, combining
    with `&&`. `[source,java]`.
  - [x] Task 18.2. **Type patterns in `switch`**: `case Type t ->`, `null` handling (`case null`),
    exhaustiveness over a sealed hierarchy, the total pattern. `[source,java]`.
  - [x] Task 18.3. **Record deconstruction patterns**: `case Point(int x, int y)`, nested patterns, `var` in
    patterns. `[source,java]`.
  - [x] Task 18.4. **Guarded patterns** with `when`. `[source,java]`. Links:
    https://dev.java/learn/pattern-matching/,
    https://docs.oracle.com/en/java/javase/25/language/pattern-matching.html,
    https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.30.

- [x] Task 19. Create `modules/ROOT/pages/backend/java/annotations-and-reflection.adoc` (issue #57; Java
  Tutorials "Annotations" & "Reflection"; dev.java "Annotations" / "Introduction to Java Reflection")
  - [x] Task 19.1. Built-in annotations: `@Override`, `@Deprecated` (with `since`/`forRemoval`),
    `@SuppressWarnings`, `@FunctionalInterface`, `@SafeVarargs`. `[source,java]`.
  - [x] Task 19.2. Declaring a custom annotation; elements and defaults; meta-annotations `@Retention`,
    `@Target`, `@Documented`, `@Inherited`, `@Repeatable`. `[source,java]`.
  - [x] Task 19.3. Reading annotations and members at runtime via `java.lang.reflect` (`Class.forName`,
    `getDeclaredFields`/`Methods`, `getAnnotation`, `setAccessible`, `Constructor.newInstance`); a short "prefer
    not to reach for reflection in application code" note and the module-system `opens` caveat. `[source,java]`.
    Links: https://docs.oracle.com/javase/tutorial/java/annotations/,
    https://dev.java/learn/reflection/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/reflect/package-summary.html.

#### Core library APIs

- [x] Task 20. Create `modules/ROOT/pages/backend/java/exceptions.adoc` (issue #57; dev.java "Exceptions" + Java
  Tutorials Essential Classes; java1 ch. 15; java2 ch. 14)
  - [x] Task 20.1. The `Throwable` hierarchy: `Error` vs. `Exception` vs. `RuntimeException`; **checked vs.
    unchecked** and the "catch or specify" requirement. `[source,java]`.
  - [x] Task 20.2. `try`/`catch`/`finally`, multi-catch (`catch (A | B e)`), the `finally`-return pitfall.
    `[source,java]`.
  - [x] Task 20.3. **try-with-resources** and `AutoCloseable`/`Closeable`; multiple resources; suppressed
    exceptions (`getSuppressed`). `[source,java]`.
  - [x] Task 20.4. `throw` / `throws`; custom exception classes (extend `Exception` or `RuntimeException`);
    exception chaining (`new X("...", cause)` / `initCause` / `getCause`); reading a stack trace; `assert` and
    `-ea`. `[source,java]`.
  - [x] Task 20.5. A `[mermaid]` control-flow diagram of `try`/`catch`/`finally` + try-with-resources
    (auto-close order relative to `catch`/`finally`), for the exception and no-exception paths.
  - [x] Task 20.6. Embed `image::java-exception-hierarchy.svg[…]` (Task 20.7). Links:
    https://dev.java/learn/exceptions/, https://docs.oracle.com/javase/tutorial/essential/exceptions/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Throwable.html.
  - [x] Task 20.7. Create `modules/ROOT/images/java-exception-hierarchy.svg` — hand-authored: `Throwable` →
    `Error` (e.g. `OutOfMemoryError`, `StackOverflowError`) and `Exception` → `RuntimeException` (e.g.
    `NullPointerException`, `IllegalArgumentException`) plus checked leaves (e.g. `IOException`,
    `SQLException`), with the checked/unchecked line drawn through `Exception`/`RuntimeException`.

- [x] Task 21. Create `modules/ROOT/pages/backend/java/optional.adoc` (issue #57; java3 ch. 11; JDK 25 Javadoc
  for `java.util.Optional`)
  - [x] Task 21.1. Why `Optional` (a container that models "maybe a value" as part of a return type, not a
    replacement for every `null`). `[source,java]`.
  - [x] Task 21.2. Creating (`of`, `ofNullable`, `empty`); querying (`isPresent`, `isEmpty`); transforming
    (`map`, `flatMap`, `filter`). `[source,java]`.
  - [x] Task 21.3. Unwrapping (`orElse`, `orElseGet`, `orElseThrow`, `ifPresent`, `ifPresentOrElse`, `or`,
    `stream`). `[source,java]`.
  - [x] Task 21.4. Primitive variants (`OptionalInt`/`OptionalLong`/`OptionalDouble`) and anti-patterns (fields,
    method parameters, `Optional.get()` without a check, `Optional` of a collection). `[source,java]`. Links:
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html,
    https://dev.java/learn/api/optional/.

- [x] Task 22. Create `modules/ROOT/pages/backend/java/collections-framework.adoc` (issue #57; dev.java "The
  Collections Framework" + Java Tutorials Collections trail; java1 ch. 18; java2 ch. 15; java3 ch. 8)
  - [x] Task 22.1. The hierarchy: `Iterable` → `Collection` → `List` / `Set` / `Queue` / `Deque`, and `Map`
    alongside; interface-type variables over implementation types. `[source,java]`.
  - [x] Task 22.2. Implementations and how to choose: `ArrayList` vs. `LinkedList`, `HashSet` /
    `LinkedHashSet` / `TreeSet`, `HashMap` / `LinkedHashMap` / `TreeMap`, `ArrayDeque`, `PriorityQueue`.
    `[source,java]` + `[source,text]` (a Big-O quick table).
  - [x] Task 22.3. `Iterator` / `Iterable` / the for-each loop; `ListIterator`; fail-fast and
    `ConcurrentModificationException`; `Iterator.remove` and `Collection.removeIf`. `[source,java]`.
  - [x] Task 22.4. `java.util.Collections` utilities (`sort`, `unmodifiableList`, `emptyList`, `frequency`);
    the immutable factories `List.of` / `Set.of` / `Map.of` / `Map.entry` / `Map.ofEntries`; `copyOf`.
    `[source,java]`.
  - [x] Task 22.5. **Sequenced collections** (Java 21): `SequencedCollection` / `SequencedSet` /
    `SequencedMap`, `addFirst`/`addLast`/`getFirst`/`getLast`/`reversed`. `[source,java]`.
  - [x] Task 22.6. The `equals`/`hashCode` contract for elements and keys (tie back to
    inheritance-and-polymorphism); sorting with `Comparator`. `[source,java]`.
  - [x] Task 22.7. Embed `image::java-collections-hierarchy.svg[…]` (Task 22.8). Links:
    https://dev.java/learn/api/collections-framework/,
    https://docs.oracle.com/javase/tutorial/collections/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/SequencedCollection.html.
  - [x] Task 22.8. Create `modules/ROOT/images/java-collections-hierarchy.svg` — hand-authored: `Iterable` →
    `Collection` → `List` / `Set` (→ `SortedSet` → `NavigableSet`) / `Queue` → `Deque`, with `Map` (→ `SortedMap`
    → `NavigableMap`) drawn separately, and the common concrete classes hung under each interface.

- [x] Task 23. Create `modules/ROOT/pages/backend/java/streams-and-collectors.adoc` (issue #57; dev.java "The
  Stream API" / "The Gatherer API"; java2 ch. 22; java3 ch. 4–7)
  - [x] Task 23.1. What a stream is (a pipeline over a source, not a data structure); obtaining one
    (`Collection.stream`, `Arrays.stream`, `Stream.of`, `IntStream.range`, `Files.lines`); lazy intermediate
    ops vs. one eager terminal op; "traversable once". `[source,java]`.
  - [x] Task 23.2. Intermediate ops: `filter`, `map`, `flatMap`, `mapMulti`, `distinct`, `sorted`, `limit`,
    `skip`, `takeWhile`/`dropWhile`, `peek`. `[source,java]`.
  - [x] Task 23.3. Terminal ops: `forEach`, `count`, `anyMatch`/`allMatch`/`noneMatch`, `findFirst`/`findAny`
    (returning `Optional`), `reduce`, `toList`/`toArray`, `collect`. `[source,java]`.
  - [x] Task 23.4. `java.util.stream.Collectors`: `toList` / `toUnmodifiableList` / `toMap` / `toSet`,
    `groupingBy` (+ downstream), `partitioningBy`, `joining`, `counting`, `summingInt` / `averagingDouble`,
    `mapping`, `teeing`. `[source,java]`.
  - [x] Task 23.5. Primitive streams (`IntStream` / `LongStream` / `DoubleStream`, `summaryStatistics`,
    `boxed`); infinite streams (`Stream.iterate` / `generate` + `limit`); parallel streams — `parallel()`,
    when they help (large, CPU-bound, splittable, stateless) and when they hurt; a one-line mention of
    `Stream.Gatherer` as the extension point for custom intermediate ops. `[source,java]`.
  - [x] Task 23.6. Embed `image::java-stream-pipeline.svg[…]` (Task 23.7). Links:
    https://dev.java/learn/api/streams/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Collectors.html.
  - [x] Task 23.7. Create `modules/ROOT/images/java-stream-pipeline.svg` — hand-authored: `source` → boxes for
    `filter` / `map` / `sorted` (labelled "lazy — nothing runs yet") → a single `collect` / `reduce` terminal
    box (labelled "eager — pulls elements through"), with a "consumed once" annotation on the source.

- [x] Task 24. Create `modules/ROOT/pages/backend/java/functional-programming.adoc` (issue #57; dev.java
  "Refactoring from the Imperative to the Functional Style"; java3 ch. 3, ch. 18–19)
  - [x] Task 24.1. The `java.util.function` package: `Function<T,R>` / `BiFunction`, `Predicate<T>` /
    `BiPredicate`, `Consumer<T>` / `BiConsumer`, `Supplier<T>`, `UnaryOperator` / `BinaryOperator`, and the
    primitive specializations (`IntFunction`, `ToIntFunction`, `IntPredicate`, …). `[source,java]`.
  - [x] Task 24.2. Composition: `Function.andThen` / `compose`, `Predicate.and` / `or` / `negate`,
    `Consumer.andThen`, `Comparator` composition. `[source,java]`.
  - [x] Task 24.3. Higher-order functions (taking and returning functions), currying / partial application,
    closures over effectively-final state. `[source,java]`.
  - [x] Task 24.4. Refactoring an imperative loop to a declarative stream/function pipeline — a short
    before/after. `[source,java]`. Links:
    https://dev.java/learn/refactoring-to-functional-style/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/function/package-summary.html.

- [x] Task 25. Create `modules/ROOT/pages/backend/java/numbers-and-math.adoc` (issue #57; java1 ch. 5, ch. 17;
  java2 ch. 9)
  - [x] Task 25.1. Wrapper classes (`Integer`, `Long`, `Double`, `Boolean`, `Character`, …); **autoboxing /
    unboxing** and its pitfalls: NPE on unboxing a `null`, `==` comparing identities, the `Integer` cache
    (`-128..127`), boxing cost in loops. `[source,java]`.
  - [x] Task 25.2. `java.lang.Math` (and `StrictMath`), the `*Exact` overflow-checked methods,
    `Math.floorMod`/`floorDiv`. `[source,java]`.
  - [x] Task 25.3. `java.math.BigInteger` and `BigDecimal` — arbitrary precision, `MathContext`/`RoundingMode`,
    **why `BigDecimal` (not `double`) for money**, the `new BigDecimal(0.1)` trap. `[source,java]`.
  - [x] Task 25.4. Parsing and formatting (`Integer.parseInt`, `Double.parseDouble`, `NumberFormat`); IEEE-754
    caveats (`0.1 + 0.2`, `NaN`, `Double.compare`); `java.util.Random` / `RandomGenerator` /
    `ThreadLocalRandom`. `[source,java]`. Links:
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Math.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html,
    https://docs.oracle.com/javase/tutorial/java/data/numberclasses.html.

- [x] Task 26. Create `modules/ROOT/pages/backend/java/dates-and-times.adoc` (issue #57; dev.java "The Date Time
  API" + Java Tutorials Date-Time trail; java3 ch. 12)
  - [x] Task 26.1. `LocalDate` / `LocalTime` / `LocalDateTime` — creation (`now`, `of`, `parse`), fields,
    `plus`/`minus`, comparisons; immutability and fluent chaining. `[source,java]`.
  - [x] Task 26.2. `Instant` (machine time), `ZonedDateTime` / `OffsetDateTime`, `ZoneId` / `ZoneOffset`,
    conversions. `[source,java]`.
  - [x] Task 26.3. `Duration` vs. `Period`; `ChronoUnit`; `TemporalAdjusters`. `[source,java]`.
  - [x] Task 26.4. `DateTimeFormatter` (predefined, pattern, localized) for parse/format; interop with legacy
    `java.util.Date` / `Calendar` (`Date.toInstant`, `Date.from`). `[source,java]`. Links:
    https://dev.java/learn/date-time/,
    https://docs.oracle.com/javase/tutorial/datetime/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/time/package-summary.html.

- [x] Task 27. Create `modules/ROOT/pages/backend/java/io-and-files.adoc` (issue #57; dev.java "The Java I/O
  API" / "Common I/O Tasks in Modern Java"; java1 ch. 3, ch. 15; java2 ch. 18)
  - [x] Task 27.1. `java.io` byte streams (`InputStream`/`OutputStream`) vs. character streams
    (`Reader`/`Writer`); the decorator pattern (`Buffered*`, `InputStreamReader`); `System.in`/`out`/`err`;
    `java.util.Scanner` for console input. `[source,java]`.
  - [x] Task 27.2. **NIO.2** `java.nio.file`: `Path` / `Paths.get` / `Path.of`, `Files.readString` /
    `writeString` / `readAllLines` / `lines` / `newBufferedReader`, `Files.exists` / `createDirectories` /
    `copy` / `move` / `delete`, `Files.walk` / `newDirectoryStream`. `[source,java]`.
  - [x] Task 27.3. try-with-resources for every stream; a short note on `java.io.Serializable` and why it's
    risky (prefer JSON/records); the bundled `jwebserver` / `SimpleFileServer` for quick static serving.
    `[source,java]` + `[source,bash]`. Links:
    https://dev.java/learn/java-io/,
    https://docs.oracle.com/javase/tutorial/essential/io/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/file/Files.html.

- [x] Task 28. Create `modules/ROOT/pages/backend/java/regular-expressions.adoc` (issue #57; Java Tutorials
  "Regular Expressions" trail; dev.java "Regular Expressions")
  - [x] Task 28.1. `Pattern.compile` + `Matcher`; `matches` vs. `find` vs. `lookingAt`; `group(int)` and
    `start`/`end`. `[source,java]`.
  - [x] Task 28.2. Character classes, quantifiers (greedy / reluctant / possessive), anchors, groups,
    **named groups** (`(?<name>…)` / `group("name")`), backreferences. `[source,java]`.
  - [x] Task 28.3. Flags (`CASE_INSENSITIVE`, `MULTILINE`, `DOTALL`, `Pattern.quote`); the `String`
    conveniences (`matches`, `split`, `replaceAll` / `replaceFirst`, `Matcher.replaceAll` with a lambda);
    catastrophic backtracking and how to avoid it. `[source,java]`. Links:
    https://docs.oracle.com/javase/tutorial/essential/regex/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/regex/Pattern.html.

#### Concurrency

- [x] Task 29. Create `modules/ROOT/pages/backend/java/concurrency-basics.adoc` (issue #57; Java Tutorials
  "Concurrency" trail; java2 ch. 20; java3 ch. 15)
  - [x] Task 29.1. Processes vs. threads; creating a thread (`Thread` subclass, `Runnable`, `Callable`);
    `start` vs. `run`; `join`, `sleep`, `interrupt` and the interruption protocol; daemon threads. `[source,java]`.
  - [x] Task 29.2. `Thread.State` and the lifecycle; `synchronized` methods and blocks; intrinsic locks /
    monitors; `wait` / `notify` / `notifyAll`. `[source,java]`.
  - [x] Task 29.3. `volatile`, visibility, and the essence of the Java Memory Model (happens-before,
    publication); the classic hazards — race conditions, stale reads, deadlock (lock ordering). `[source,java]`.
  - [x] Task 29.4. Embed `image::java-thread-states.svg[…]` (Task 29.5). Links:
    https://docs.oracle.com/javase/tutorial/essential/concurrency/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.State.html,
    https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html.
  - [x] Task 29.5. Create `modules/ROOT/images/java-thread-states.svg` — hand-authored state diagram: `NEW` →
    `RUNNABLE` ⇄ (`BLOCKED` / `WAITING` / `TIMED_WAITING`) → `TERMINATED`, with the transition trigger labelled
    on each edge (`start()`, lock contention, `wait()`, `notify()`, `sleep(n)`, run completes).

- [x] Task 30. Create `modules/ROOT/pages/backend/java/high-level-concurrency.adoc` (issue #57; java3
  ch. 15–17; JDK 25 Javadoc)
  - [x] Task 30.1. `java.util.concurrent` executors: `Executor` / `ExecutorService` / `Executors`
    (`newFixedThreadPool`, `newCachedThreadPool`, `newSingleThreadExecutor`), `submit` / `invokeAll`,
    `shutdown` / `awaitTermination`, `Future`. `[source,java]`.
  - [x] Task 30.2. **`CompletableFuture`**: `supplyAsync` / `runAsync`, `thenApply` / `thenCompose` /
    `thenCombine` / `thenAccept`, `allOf` / `anyOf`, `exceptionally` / `handle`, custom executor. `[source,java]`.
  - [x] Task 30.3. Concurrent collections (`ConcurrentHashMap`, `CopyOnWriteArrayList`, `BlockingQueue` /
    `ArrayBlockingQueue`); `java.util.concurrent.atomic` (`AtomicInteger`, `AtomicReference`, `LongAdder`).
    `[source,java]`.
  - [x] Task 30.4. Explicit locks (`ReentrantLock`, `ReadWriteLock`, `StampedLock`) vs. `synchronized`; the
    synchronizers `CountDownLatch` / `Semaphore` / `CyclicBarrier` / `Phaser`; a one-paragraph mention of the
    reactive-streams `java.util.concurrent.Flow` API (and that full reactive libraries are out of scope).
    `[source,java]`.
  - [x] Task 30.5. A `[mermaid]` diagram of a `CompletableFuture` composition (two async stages feeding a
    `thenCombine`, then `exceptionally`). Links:
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/package-summary.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/CompletableFuture.html.

- [x] Task 31. Create `modules/ROOT/pages/backend/java/virtual-threads.adoc` (issue #57 — **official
  documentation only; none of the three books cover virtual threads**; dev.java "Virtual Threads"; JEP 444 /
  453 / 505; JDK 25 core-libraries guide)
  - [x] Task 31.1. Platform threads vs. **virtual threads**: what they are, why (cheap, many, blocking code is
    fine), the "thread-per-request" model; `Thread.ofVirtual().start(...)` /
    `Executors.newVirtualThreadPerTaskExecutor()` / `Thread.startVirtualThread`. `[source,java]`.
  - [x] Task 31.2. Carrier threads, mounting/unmounting, what pins a carrier (`synchronized` on a blocking op,
    native frames) and how to avoid it (`ReentrantLock`). `[source,java]`.
  - [x] Task 31.3. A short note on **structured concurrency** (`StructuredTaskScope`) and **scoped values** as
    the direction of travel (mention their preview/finalization status generically, don't pin a JEP number in
    prose). `[source,java]`.
  - [x] Task 31.4. Embed `image::java-virtual-vs-platform-threads.svg[…]` (Task 31.5). Links:
    https://dev.java/learn/virtual-threads/,
    https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html#ofVirtual().
  - [x] Task 31.5. Create `modules/ROOT/images/java-virtual-vs-platform-threads.svg` — hand-authored: a wide row
    of many small "virtual thread" boxes above a thin strip of 3–4 "carrier (platform) thread" boxes bound to OS
    threads, with a few arrows showing virtual threads mounting onto carriers and a "blocked → unmounted, carrier
    freed" callout.

#### Modularity, packaging & tooling

- [x] Task 32. Create `modules/ROOT/pages/backend/java/packages-and-modules.adoc` (issue #57; dev.java "Modules"
  + "Organizing your Application"; java1 ch. 16; java2 ch. 19; java3 ch. 14)
  - [x] Task 32.1. Packages: `package` and `import` (single-type, on-demand, `static` imports), the
    package-name ↔ directory mapping, the classpath. `[source,java]` + `[source,text]`.
  - [x] Task 32.2. The four access levels (`public` / `protected` / package-private / `private`) as a table,
    with what each means across package and subclass boundaries. `[source,text]`.
  - [x] Task 32.3. **The Java Platform Module System**: `module-info.java`, `requires` / `requires transitive` /
    `requires static`, `exports` / `exports … to`, `opens` / `opens … to`, `uses` / `provides … with`;
    `module-path` vs. classpath; automatic modules and the unnamed module. `[source,java]` + `[source,bash]`.
  - [x] Task 32.4. A one-paragraph pointer to `jlink` (custom runtime image) and `jpackage` (native
    installer), cross-referencing `build-and-tooling.adoc`. `[source,bash]`.
  - [x] Task 32.5. A `[mermaid]` graph of a small three-module `requires`/`exports` relationship. Links:
    https://dev.java/learn/modules/,
    https://docs.oracle.com/javase/tutorial/java/package/,
    https://docs.oracle.com/en/java/javase/25/docs/api/java.base/module-summary.html.

- [x] Task 33. Create `modules/ROOT/pages/backend/java/build-and-tooling.adoc` (issue #57; dev.java "Getting to
  know the JVM" / "The Core JDK Tools"; java2 ch. 19)
  - [x] Task 33.1. The core JDK tools: `javac`, `java`, `jar` (and executable JARs / `Main-Class`), `javadoc`,
    `jshell`, `jdeps`, `jlink`, `jpackage`, `jcmd` / `jstack` / `jmap`, and JDK Flight Recorder (`-XX:StartFlightRecording`).
    `[source,bash]`.
  - [x] Task 33.2. Maven — project layout (`src/main/java`, `src/test/java`), `pom.xml`, coordinates and
    dependencies, the build lifecycle (`compile` / `test` / `package` / `install`), running with
    `mvn -q package`. `[source,xml]` + `[source,bash]`.
  - [x] Task 33.3. Gradle — `build.gradle(.kts)`, the `java` plugin, `dependencies { }`, `./gradlew build`;
    a one-line "Maven vs. Gradle" framing (declarative/convention vs. programmable). `[source,groovy]` +
    `[source,bash]`.
  - [x] Task 33.4. Generating API docs with `javadoc` (doc comments, standard tags `@param`/`@return`/`@throws`/
    `{@code}`/`{@link}`), and running tests from the build (forward to `testing.adoc`). `[source,java]` +
    `[source,bash]`. Links:
    https://docs.oracle.com/en/java/javase/25/docs/specs/man/index.html,
    https://dev.java/learn/jvm/tools/core/,
    https://maven.apache.org/guides/, https://docs.gradle.org/current/userguide/userguide.html.
    If `[source,xml]` / `[source,groovy]` produce build issues, fall back to `[source,text]` (verified by the
    final build task).

#### Testing

- [x] Task 34. Create `modules/ROOT/pages/backend/java/testing.adoc` (issue #57 — **required regardless of what
  the three books cover**: none use JUnit 5 or document Mockito; primary sources are the JUnit 5 User Guide and
  the Mockito docs; analogous to the Python section's `testing.adoc`)
  - [x] Task 34.1. JUnit 5 (Jupiter) setup — the `junit-jupiter` dependency (Maven/Gradle), the Maven Surefire
    integration; a first `@Test`; `src/test/java` layout. `[source,xml]` + `[source,java]`.
  - [x] Task 34.2. Assertions (`assertEquals`, `assertTrue`, `assertThrows`, `assertAll`,
    `assertTimeout`), the lifecycle (`@BeforeEach` / `@AfterEach` / `@BeforeAll` / `@AfterAll`),
    `@DisplayName`, `@Nested`, `@Disabled`, `@Tag`, `Assumptions.assumeTrue`. `[source,java]`.
  - [x] Task 34.3. **Parameterized tests** (`@ParameterizedTest` with `@ValueSource` / `@CsvSource` /
    `@MethodSource` / `@EnumSource`); test instance lifecycle; a brief mention of AssertJ for fluent
    assertions. `[source,java]`.
  - [x] Task 34.4. **Mockito**: `mock()` / `@Mock` / `@ExtendWith(MockitoExtension.class)`, `when(...).thenReturn`
    / `thenThrow`, `verify(...)` with `times`/`never`, argument matchers (`any()`, `eq()`), `@InjectMocks`,
    `spy()`, `ArgumentCaptor`; stub vs. mock vs. spy, and "don't mock types you don't own". `[source,java]`.
  - [x] Task 34.5. A `[mermaid]` diagram of the JUnit 5 test lifecycle: discover → create instance →
    `@BeforeEach` → `@Test` → `@AfterEach` (→ repeat per test) → report. Links:
    https://junit.org/junit5/docs/current/user-guide/,
    https://docs.junit.org/current/user-guide/#writing-tests-parameterized-tests,
    https://site.mockito.org/, https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html.
    If `[source,xml]` produces a build issue, fall back to `[source,text]`.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 35), but it must run **after** Group 2 so its `xref:` back-links
point at pages that exist and the PDF's content reflects every finished page.

- [x] Task 35. Create the Java cheat sheet — `modules/ROOT/pages/backend/java/cheat-sheet.adoc` +
  `modules/ROOT/attachments/java-cheat-sheet.pdf`
  - [x] Task 35.1. Create `modules/ROOT/pages/backend/java/cheat-sheet.adoc` following
    `modules/ROOT/pages/web/python/cheat-sheet.adoc`: the header block + `include::partial$java-disclaimer.adoc[]`,
    a short description paragraph, grouped `xref:` links back to every Group 2 page (same group headings as the
    subsection index — Getting started / Language fundamentals / Object-oriented programming / Modern language
    features / Core library APIs / Concurrency / Modularity, packaging & tooling / Testing), and a final
    `xref:attachment$java-cheat-sheet.pdf[Download the Java Cheat Sheet (PDF)]` line.
  - [x] Task 35.2. Build a hand-authored, print-ready single-page HTML/CSS layout (colour-coded sections,
    dense) summarising every concept in the section: JDK/JVM one-liners and `javac`/`java`/`jar`; the eight
    primitives + `var`; operators & precedence; `String` / text blocks / formatting; control flow incl. `switch`
    expressions & `case` patterns; arrays & `Arrays`; class / constructor / `static` syntax; inheritance /
    `@Override` / `abstract` / `Object` methods; interfaces + `default`; `record` / `sealed`; `enum`; lambdas &
    the four method-reference forms; generics + PECS + erasure; pattern matching (`instanceof` / `switch` /
    record deconstruction / `when`); annotations; exceptions + try-with-resources; `Optional`; the collections
    hierarchy + factory methods + sequenced collections; the stream pipeline + key `Collectors`;
    `java.util.function` + composition; wrappers/autoboxing + `BigDecimal`; `java.time` core types; NIO.2
    `Files`/`Path`; regex `Pattern`/`Matcher`; threads + `synchronized`/`volatile`; executors +
    `CompletableFuture`; virtual threads; packages + `module-info` clauses; the JDK tool list + Maven/Gradle
    skeleton; JUnit 5 (`@Test` / lifecycle / `@ParameterizedTest`) + Mockito (`mock`/`when`/`verify`).
  - [x] Task 35.3. Render it to PDF via headless Chrome
    (`chrome --headless --disable-gpu --print-to-pdf=modules/ROOT/attachments/java-cheat-sheet.pdf
    --no-pdf-header-footer <file>.html`), confirm it is **exactly one A4 page** (page-count check) with no
    clipped content in a rendered preview, and commit **only** the resulting
    `modules/ROOT/attachments/java-cheat-sheet.pdf` (no HTML source kept in the repo). Match the on-disk size
    ballpark of the existing cheat-sheet PDFs (~100–260 KB).

### Group 4 — Subsection index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 36 (subsection index) must link every page from Groups 2–3; Tasks 37–39 edit three
shared wiring files and must be consistent with the index and each other; Task 40 (build) must run last, after
every other task in every group.

> **Group 4 status: COMPLETE.** `backend/java/index.adoc` created (grouped "What's covered" + full Bibliography
> with Javadoc/dev.java/JLS/JUnit/Mockito links and the three books as consulted-not-primary). `backend/index.adoc`,
> `nav.adoc` (35-entry `*** Java Reference` block before SpringBoot), and root `pages/index.adoc` all wired.
> `npx antora antora-playbook.yml` completes with **zero warnings and zero errors** (one initial
> "list item index" warning from an ISBN at a line start in `index.adoc` was fixed by moving it inside
> parentheses). `build/site/backend/java/` renders all 35 pages; nav shows the Java Reference tree before
> SpringBoot; all 8 `java-*.svg` and the mermaid diagrams render; the cheat-sheet page's PDF link resolves.
> `git status` shows only intended new/modified files, nothing under `build/`.

- [x] Task 36. Create `modules/ROOT/pages/backend/java/index.adoc` — the subsection landing page
  - [x] Task 36.1. Header block + `include::partial$java-disclaimer.adoc[]` + a 2–3 sentence intro (Java is a
    statically-typed, class-based, object-oriented language compiled to bytecode and run on the JVM; this
    section documents the current release line, framework-agnostic, verified against the official docs and
    Javadoc; suggested reading order: Getting Started → Language fundamentals → OOP → the rest).
  - [x] Task 36.2. A `== What's covered` section grouping all 33 Group 2 pages + the cheat sheet under the eight
    headings from Task 35.1, one `xref:backend/java/<slug>.adoc[Title]` per line with a one-line blurb — same
    format as `modules/ROOT/pages/web/python/index.adoc`.
  - [x] Task 36.3. A `== Bibliography` section listing, with links:
    - https://dev.java/ and https://dev.java/learn/ (the developer portal and learning paths);
    - https://docs.oracle.com/javase/tutorial/ (The Java Tutorials);
    - https://docs.oracle.com/en/java/javase/25/ and https://docs.oracle.com/en/java/javase/25/docs/api/ (JDK 25
      docs and the Java SE 25 API specification — the target for every API link);
    - https://docs.oracle.com/javase/specs/jls/se25/html/index.html (The Java Language Specification, Java SE 25);
    - https://openjdk.org/ and the JEP index (https://openjdk.org/jeps/0);
    - https://junit.org/junit5/docs/current/user-guide/ (JUnit 5 User Guide — primary source for the testing
      page) and https://site.mockito.org/ (Mockito — primary source for the mocking part);
    - Ogihara, M. *Fundamentals of Java Programming*. Springer, 2018. ISBN 978-3-319-89490-4 /
      978-3-319-89491-1 (eBook). https://link.springer.com/book/10.1007/978-3-319-89491-1 — *consulted as part
      of the bibliography, not the primary source; predates Java 8 lambdas/streams and all later features.*
    - Charatan, Q. & Kans, A. *Java in Two Semesters: Featuring JavaFX*, 4th ed. Springer (Texts in Computer
      Science), 2019. ISBN 978-3-319-99419-2 / 978-3-319-99420-8 (eBook).
      https://link.springer.com/book/10.1007/978-3-319-99420-8 — *consulted as part of the bibliography, not the
      primary source; covers up to Java 8; its JavaFX chapters are out of scope here.*
    - Urma, R.-G., Fusco, M. & Mycroft, A. *Modern Java in Action*. Manning, 2019. ISBN 9781617293566.
      https://www.manning.com/books/modern-java-in-action — *consulted as part of the bibliography, not the
      primary source; covers up to Java 11.*
    - A closing sentence: as with the other reference sections, the three books are consulted references, not
      the primary source, and on any discrepancy the official documentation wins.

- [x] Task 37. Wire the subsection into `modules/ROOT/pages/backend/index.adoc`
  - [x] Task 37.1. Add, **before** the existing SpringBoot Reference bullet in the `== Sections` list:
    `* xref:backend/java/index.adoc[Java Reference] -- the Java language and its standard library: language
    fundamentals, OOP, records and sealed classes, pattern matching, generics, the Collections Framework,
    streams, `+"`java.time`"+`, I/O and NIO.2, concurrency and virtual threads, the module system, and unit
    testing with JUnit 5 and Mockito, plus a downloadable cheat sheet.`
  - [x] Task 37.2. Reword the intro sentence so it no longer implies Spring Boot is the only content (e.g.
    "...core technologies of server-side application development, from the Java language itself to the Spring
    Boot framework."), and extend the page's `:description:` / `:keywords:` to include Java / the language
    topics.

- [x] Task 38. Wire the subsection into `modules/ROOT/nav.adoc`
  - [x] Task 38.1. Directly under `** xref:backend/index.adoc[Backend Development]` (line 397) and **before**
    `*** xref:backend/springboot/index.adoc[SpringBoot Reference]` (line 398), insert:
    - `*** xref:backend/java/index.adoc[Java Reference]`
    - then one `**** xref:backend/java/<slug>.adoc[<Nav label>]` line per Group 2 page **in the reading order
      from the subsection index** (Getting Started; Lexical Structure & Style; Primitive Types & Variables;
      Operators & Expressions; Strings & Text; Control Flow; Arrays; Classes & Objects; Methods & Parameters;
      Inheritance & Polymorphism; Interfaces; Records & Sealed Classes; Enums; Nested & Anonymous Classes;
      Lambdas & Method References; Generics; Pattern Matching; Annotations & Reflection; Exceptions; Optional;
      Collections Framework; Streams & Collectors; Functional Programming; Numbers & Math; Dates & Times; I/O &
      Files; Regular Expressions; Concurrency Basics; High-Level Concurrency; Virtual Threads; Packages &
      Modules; Build & Tooling; Unit Testing with JUnit 5 & Mockito), then
    - `**** xref:backend/java/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - [x] Task 38.2. Confirm indentation/marker depth matches the existing SpringBoot block exactly (`***` for the
    subsection, `****` for pages).

- [x] Task 39. Wire the subsection into `modules/ROOT/pages/index.adoc`
  - [x] Task 39.1. In the `== Guides & References` list, under the `* xref:backend/index.adoc[Backend
    Development]` bullet and **before** the `** xref:backend/springboot/index.adoc[SpringBoot Reference]`
    bullet, add `** xref:backend/java/index.adoc[Java Reference] -- the Java language itself: language
    fundamentals and OOP, records and sealed classes, pattern matching, generics, the Collections Framework and
    streams, `+"`java.time`"+` and NIO.2, concurrency and virtual threads, the module system, and unit testing
    with JUnit 5 and Mockito, plus a downloadable cheat sheet.`
  - [x] Task 39.2. Reword the `* xref:backend/index.adoc[Backend Development]` blurb so it no longer says
    "starting with Spring Boot" (e.g. "...backend-development references, covering the Java language and the
    Spring Boot framework."), and add Java-related terms to the page's top-of-file `:description:` /
    `:keywords:`.

- [x] Task 40. Final build verification
  - [x] Task 40.1. Run `npx antora antora-playbook.yml` from the repo root. Delegate to the `iru-gate-runner`
    agent (`Agent({description: "Antora build for Java Reference", subagent_type: "iru-gate-runner", prompt:
    "Run `npx antora antora-playbook.yml` from the repository root and report the full stderr/stdout, every
    WARN/ERROR line verbatim, and whether the build completed. Do not fix anything."})`) so the full build log
    stays out of the main context.
  - [x] Task 40.2. Require: **zero** AsciiDoc/`xref` errors, **zero** "skipping reference to missing attribute"
    warnings (fix by escaping `\{ … }` in prose on the offending page), **zero** unresolved-`xref` or missing
    `image::`/`attachment$` warnings for any `backend/java/**` page, `java-*.svg`, or `java-cheat-sheet.pdf`.
    Iterate on the offending pages until clean.
  - [x] Task 40.3. Spot-check `build/site/irurueta/backend/java/index.html` and 3–4 content pages render (nav
    shows the new **Java Reference** tree under Backend Development, before SpringBoot Reference; mermaid
    diagrams and SVGs display; the cheat-sheet page's PDF link resolves).
  - [x] Task 40.4. Confirm `git status` shows only intended new/modified files (35 new `backend/java/*.adoc`,
    `partials/java-disclaimer.adoc`, 8 `images/java-*.svg`, `attachments/java-cheat-sheet.pdf`, and edits to
    `backend/index.adoc`, `nav.adoc`, `pages/index.adoc`) and nothing under `build/`.
