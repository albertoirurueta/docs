# Implementation Plan: Guides & References / Apps / Android — Kotlin Reference

## Task summary

Source: GitHub issue #73

Issue [#73](https://github.com/albertoirurueta/docs/issues/73) asks for three things this repo has never had
before, all authored directly into this repo's own `ROOT` Antora component (this repo has no application source
code — it *is* the Antora playbook + root component):

1. A brand-new **top-level "Apps" guide** under *Guides & References* — a fourth sibling of `database/`, `web/`,
   and `backend/`, each currently ending its own block in `modules/ROOT/nav.adoc` and
   `modules/ROOT/pages/index.adoc`'s `== Guides & References` list.
2. Inside it, a new **"Android" landing page**, one level deeper than any existing category (`Apps > Android >
   Kotlin Reference`, vs. the usual `Category > Reference`), deliberately left able to host more Android
   references later without re-nesting.
3. Inside *that*, the **"Kotlin Reference"** subsection itself at `modules/ROOT/pages/apps/android/kotlin/`: a
   landing page, 28 concept pages, and a one-page downloadable PDF cheat sheet — documenting **Kotlin 2.4.x**,
   verified against `kotlinlang.org`, cross-checked against the public table of contents of *Kotlin in Action,
   2nd Edition* (bibliography-only, per the issue's own sourcing note — the actual PDF wasn't reachable when the
   issue was filed).
4. Two smaller additions: a new `backend/springboot/java-or-kotlin.adoc` page in the **existing** SpringBoot
   Reference (Java vs. Kotlin pros/cons table + side-by-side code + recommendation), and the Kotlin Reference's
   cheat sheet PDF.

The issue's own page outline, pros/cons table, wiring instructions, and acceptance criteria are exhaustive and
are treated as the source of truth for content below — this plan does not restate every sentence of them, it
sequences them into buildable tasks with concrete file paths, diagram choices, and cross-link targets.

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's own pattern — stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** No installed `*-code-one-task` skill (`java`, `dotnet`, `database`)
   applies — every task below is AsciiDoc/SVG/PDF authoring, matching every prior documentation plan in
   `.archive/`. `[source,kotlin]`/`[source,java]` blocks are illustrative AsciiDoc content, not a compiled module.
2. **Closest precedents, both read in full**:
   - `.archive/implementation_plan_55.md` (issue #55, "SpringBoot Reference") — the last time a **brand-new
     top-level Guides & References category** was created (`Backend Development`). It added a distinct task for
     the new top-level landing page separate from the subsection's own index, placed the new category **last**
     in `nav.adoc`/`pages/index.adoc` (append-order convention), kept local books bibliography-only, and
     cross-linked instead of duplicating overlapping content. This plan follows the same shape for `apps/` +
     `apps/android/` (one extra nesting level, since "Android" itself isn't the reference — "Kotlin Reference"
     is, one level under it).
   - `.archive/implementation_plan_57.md` (issue #57, "Java Reference") — the other JVM-language reference at
     comparable depth/scale (33 content pages + cheat sheet). Confirms the cheat-sheet mechanism this repo
     actually uses (below), and that source books are cited **only** in `== Bibliography` + the disclaimer's
     "consulted while preparing" clause, never as the page's primary source.
3. **Page breakdown: 28 Kotlin Reference content pages + 1 cheat sheet + 1 subsection index + 2 new landing pages
   (`apps/index.adoc`, `apps/android/index.adoc`) + 1 new SpringBoot page (33 `.adoc` files total)**, exactly as
   issue #73 lists them. No page is merged or split beyond what the issue specifies.
4. **Placed last**: `Apps` becomes the **fourth** top-level `Guides & References` entry, appended after the
   existing `Backend Development` block in both `nav.adoc` and `pages/index.adoc`, per the same append-order
   convention `implementation_plan_55.md` used for `Backend Development` itself.
5. **`java-or-kotlin.adoc` is inserted into the existing SpringBoot Reference** nav block right after
   `core-annotations.adoc`/before `configuration-and-profiles.adoc` — i.e. immediately after the two "what is
   Spring Boot" pages and before any concrete integration page, since "which language" is a before-you-start
   decision (issue #73 says "right after `core-concepts.adoc`"; placing it after `core-annotations.adoc` instead
   keeps the two foundational "what Spring Boot is" pages together before the language choice — a one-page
   reordering the implementer/reviewer can trivially move if the sequential placement is preferred).
6. **Diagrams — mermaid by default, hand-authored SVG only for genuinely spatial layouts** (the JVM/multiplatform
   compile-target fan-out is the one candidate for an SVG rather than mermaid, since it's a spatial "one source,
   many targets" figure, not a flow/state/sequence one — implementer's call per page, matching
   `implementation_plan_57.md`'s "mermaid default, few hand-authored SVGs" pattern). The 📊 markers in the issue
   are a floor, not a ceiling — an implementer may add further small `kotlin-*.svg` figures while writing a page
   if one adds real value.
7. **PDF generation approach — same as every prior section**: a hand-built, print-ready single-page HTML/CSS
   layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
   static checked-in asset at `modules/ROOT/attachments/kotlin-cheat-sheet.pdf`, linked via
   `xref:attachment$kotlin-cheat-sheet.pdf[Download the Kotlin Cheat Sheet (PDF)]`. Must be **exactly one A4
   page** (page-count check + a rendered preview with no clipping). No HTML source is kept in the repo.
8. **No project-picker tile** for Apps/Android/Kotlin Reference — like every other Guides & References
   subsection, it lives only in `nav.adoc`, its own subsection index, and the root `pages/index.adoc` "Guides &
   References" list.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml), component `irurueta`), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc),
  pages under `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no
  lint/test suite). `build/` is gitignored.
- **Base branch**: `claude/kotlin-docs-reference-87o8ph`, currently identical to `origin/main` (fresh checkout —
  this session's environment pins development to this branch rather than a fresh `feature/73`).
- `modules/ROOT/nav.adoc` currently ends its `Guides & References` block at
  `xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]` (last line, 466). `modules/ROOT/pages/index.adoc`'s
  `== Guides & References` list ends at the Backend Development bullet (~line 148), right before `== About me`
  (line 150).
- `modules/ROOT/pages/backend/index.adoc` and `modules/ROOT/pages/backend/springboot/index.adoc` are the direct
  structural templates for the two new landing pages (`apps/index.adoc`, `apps/android/index.adoc`) and the
  subsection index (`apps/android/kotlin/index.adoc`) respectively.
- `modules/ROOT/pages/backend/java/*.adoc` (30 files) is the direct template for every Kotlin Reference content
  page: `= <Title>` / `:description:` / `:keywords:` / `include::partial$java-disclaimer.adoc[]` header, a
  `== References` closing section, `[mermaid]` blocks (see `backend/java/control-flow.adoc`,
  `high-level-concurrency.adoc`, `testing.adoc`), and hand-authored SVGs in `modules/ROOT/images/java-*.svg`.
- `modules/ROOT/partials/*-disclaimer.adoc` — the **post-#71/#72 short template** is confirmed by
  `html-css-disclaimer.adoc`/`sql-disclaimer.adoc` (one scope/version sentence + one AI-disclosure sentence) and
  `java-disclaimer.adoc`/`springboot-disclaimer.adoc` (same, plus a third sentence pointing at the section's
  `#_bibliography` anchor). `kotlin-disclaimer.adoc` must match this 2–3 sentence shape exactly — no book
  titles/evaluation paragraph.
- `modules/ROOT/pages/backend/springboot/index.adoc` "What's covered" and `nav.adoc`'s SpringBoot Reference block
  are the insertion points for `java-or-kotlin.adoc`.
- `modules/ROOT/attachments/java-cheat-sheet.pdf` / `springboot-cheat-sheet.pdf` are the exact visual templates
  for `kotlin-cheat-sheet.pdf` (dense multi-column colour-coded boxes, header line, breadcrumb footer).

## Implementation steps

### Group 1 — Scaffold the disclaimer _(untagged)_

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/kotlin-disclaimer.adoc`
  - [x] Task 1.1. `[IMPORTANT]` admonition, 2–3 sentences only, matching the short post-#72 template: (a) one
        sentence — "documents Kotlin 2.4.x on the JVM, as published at https://kotlinlang.org/[kotlinlang.org],
        which is the reference these pages are written and verified against"; (b) one sentence disclosing AI
        assistance and pointing to kotlinlang.org for verification; (c) one line pointing to
        `xref:apps/android/kotlin/index.adoc#_bibliography[bibliography]`. No book titles, no evaluation
        paragraph — every content page in this section `include::`s this file.
  - Note: created `modules/ROOT/partials/kotlin-disclaimer.adoc` (3-sentence short template, matches `html-css-disclaimer.adoc`/`java-disclaimer.adoc` shape).

### Group 2 — Parallel content pages _(untagged)_

**Parallelizable: yes** — every page is an independent file with its own content; none reads another page's
finished text (forward `xref:`s to not-yet-written sibling pages resolve fine once the whole group lands, and
Group 4's build-verification task is what actually checks this). All 29 tasks below `include::` the disclaimer
from Group 1, so Group 1 must land first.

All Kotlin Reference pages live under `modules/ROOT/pages/apps/android/kotlin/`; each starts with `= <Title>`, a
`:description:`, a `:keywords:`, `include::partial$kotlin-disclaimer.adoc[]`, and ends with a `== References`
section linking only official Kotlin documentation (kotlinlang.org / developer.android.com / docs.spring.io as
applicable) — no page here has its own Bibliography, that lives only on the subsection index (Group 4).

- [x] Task 2. `getting-started.adoc` — what Kotlin is (JetBrains, Apache 2.0 license, JVM-first with
  - Note: `apps/android/kotlin/getting-started.adoc` created.
      Multiplatform targets — one-sentence pointer forward to Task 3), installing (SDKMAN/Homebrew/IntelliJ
      bundled), `kotlinc`, the Kotlin REPL, the Kotlin Playground, "Hello, World", compiling to JVM bytecode.
- [x] Task 3. `kotlin-and-the-jvm.adoc` — **the "Kotlin is a JVM language" page.** States clearly: Kotlin/JVM
  - Note: `apps/android/kotlin/kotlin-and-the-jvm.adoc` created, with a mermaid flowchart (Task 3.1) fanning out to Server/Desktop/CLI/Android/Java-interop plus Kotlin/JS/Native/Wasm.
      compiles to the same `.class`/bytecode the JVM runs, is fully Java-interoperable, and runs anywhere a JVM
      runs — servers (`xref:backend/springboot/java-or-kotlin.adoc[]`), CLI tools, desktop (Compose
      Multiplatform, JavaFX), build tooling (Gradle Kotlin DSL) — **not only Android**, which is simply Kotlin's
      best-known/officially-preferred use case (Google, since 2019) and one target among several (Kotlin/JVM,
      Kotlin/JS, Kotlin/Native, Kotlin/Wasm under Kotlin Multiplatform).
  - [x] Task 3.1. Add a diagram (mermaid flowchart or hand-authored `modules/ROOT/images/kotlin-compile-targets.svg`)
        showing Kotlin source → compiler → JVM bytecode fanning out to Server / Desktop / CLI / **Android** /
        Java interop, plus a side branch to Kotlin/JS, Kotlin/Native, Kotlin/Wasm.
- [x] Task 4. `lexical-structure-and-style.adoc` — file/package structure, identifiers, comments, optional
  - Note: `apps/android/kotlin/lexical-structure-and-style.adoc` created.
      semicolons, literals, the official Kotlin coding conventions.
- [x] Task 5. `basic-types-and-variables.adoc` — `val`/`var`, type inference, `Int`/`Long`/`Double`/`Float`/
  - Note: `apps/android/kotlin/basic-types-and-variables.adoc` created.
      `Boolean`/`Char`, `Any`/`Unit`/`Nothing`, arrays, unsigned integer types.
- [x] Task 6. `strings-and-text.adoc` — string templates (`$name`, `${expr}`), raw/triple-quoted strings, common
  - Note: `apps/android/kotlin/strings-and-text.adoc` created (dollar-brace interpolation escaped outside source blocks to avoid an AsciiDoc attribute-substitution warning, fixed during Task 38's build verification).
      `String` operations, comparison to Java's `String`.
- [x] Task 7. `operators-and-ranges.adoc` — arithmetic/comparison/logical operators, ranges & progressions
  - Note: `apps/android/kotlin/operators-and-ranges.adoc` created.
      (`1..10`, `downTo`, `step`), infix notation.
- [x] Task 8. `control-flow.adoc` — `if`/`when` as **expressions**, `for`/`while`, labeled `break`/`continue`.
  - Note: `apps/android/kotlin/control-flow.adoc` created.
- [x] Task 9. `functions.adoc` — function declarations, default & named arguments, single-expression functions,
  - Note: `apps/android/kotlin/functions.adoc` created.
      `vararg`, local functions, `tailrec`.
- [x] Task 10. `classes-and-objects.adoc` — class declarations, primary/secondary constructors, properties
  - Note: `apps/android/kotlin/classes-and-objects.adoc` created.
      (custom get/set, backing fields), `init` blocks, visibility modifiers, and the "classes are `final` by
      default" rule (foreshadows Task 30's all-open plugin discussion).
- [x] Task 11. `inheritance-and-interfaces.adoc` — `open`/`override`, abstract classes, interfaces with
  - Note: `apps/android/kotlin/inheritance-and-interfaces.adoc` created, with a mermaid class diagram (Task 11.1) contrasting Kotlin's explicit `open` with Java's implicit-open default.
      default/property members, class delegation via `by`.
  - [x] Task 11.1. Add a mermaid class diagram contrasting Kotlin's explicit `open` with Java's implicit-open
        default.
- [x] Task 12. `data-classes-and-destructuring.adoc` — `data class`, generated `equals`/`hashCode`/`toString`/
  - Note: `apps/android/kotlin/data-classes-and-destructuring.adoc` created.
      `copy`, `componentN()`, destructuring declarations (in `for`, lambdas).
- [x] Task 13. `sealed-classes-and-enums.adoc` — `sealed class`/`sealed interface`, exhaustive `when`, `enum
  - Note: `apps/android/kotlin/sealed-classes-and-enums.adoc` created, with a mermaid class diagram (Task 13.1) of a small sealed hierarchy plus the exhaustive `when`.
      class` with members/methods.
  - [x] Task 13.1. Add a mermaid diagram of a small sealed hierarchy plus the exhaustive `when` over it.
- [x] Task 14. `objects-and-companion-objects.adoc` — `object` declarations (singletons), companion objects
  - Note: `apps/android/kotlin/objects-and-companion-objects.adoc` created.
      (static-like members, factory functions), object expressions (anonymous classes).
- [x] Task 15. `extension-functions-and-scope-functions.adoc` — extension functions/properties and the five
  - Note: `apps/android/kotlin/extension-functions-and-scope-functions.adoc` created, with the `let`/`run`/`with`/`apply`/`also` decision table.
      scope functions (`let`, `run`, `with`, `apply`, `also`) with a decision table for which to use when.
- [x] Task 16. `lambdas-and-higher-order-functions.adoc` — lambda syntax, trailing-lambda convention, closures,
  - Note: `apps/android/kotlin/lambdas-and-higher-order-functions.adoc` created.
      function types, higher-order functions, `inline`/`noinline`/`crossinline`.
- [x] Task 17. `generics-and-variance.adoc` — generic classes/functions, declaration-site variance (`in`/`out`),
  - Note: `apps/android/kotlin/generics-and-variance.adoc` created.
      use-site (star) projections, `reified` type parameters with `inline` functions, contrast with Java
      wildcards/erasure.
- [x] Task 18. `null-safety.adoc` — nullable types (`String?`), safe call `?.`, Elvis `?:`, not-null assertion
  - Note: `apps/android/kotlin/null-safety.adoc` created, with a mermaid flowchart (Task 18.1) of the safe-call/Elvis path vs. the `!!`/NPE path.
      `!!`, safe cast `as?`, platform types from Java interop, smart casts.
  - [x] Task 18.1. Add a mermaid flowchart: nullable value → safe-call chain → Elvis default, vs. the `!!`/NPE
        path.
- [x] Task 19. `equality-and-operator-overloading.adoc` — structural (`==`) vs. referential (`===`) equality,
  - Note: `apps/android/kotlin/equality-and-operator-overloading.adoc` created.
      `this` expressions, the full set of overloadable operator conventions (`plus`, `times`, `invoke`,
      `compareTo`, `iterator`, etc.).
- [x] Task 20. `collections-and-sequences.adoc` — read-only vs. mutable collection interfaces, collection
  - Note: `apps/android/kotlin/collections-and-sequences.adoc` created.
      builders, functional operations (`map`/`filter`/`fold`/`groupBy`/`associateBy`), `Sequence` (lazy) vs.
      eager collections and when the difference matters.
- [x] Task 21. `annotations-and-reflection.adoc` — declaring annotations, meta-annotations (`@Target`,
  - Note: `apps/android/kotlin/annotations-and-reflection.adoc` created.
      `@Retention`), using built-ins, basic `kotlin.reflect` (`KClass`, `::class`).
- [x] Task 22. `type-safe-builders-and-dsls.adoc` — lambdas with receiver, building a small type-safe
  - Note: `apps/android/kotlin/type-safe-builders-and-dsls.adoc` created, with a mermaid diagram (Task 22.1) of the receiver-lambda call chain building a tree.
      builder/DSL (HTML-builder-style example), how this underpins `kotlinx.html`/Gradle Kotlin DSL/routing
      DSLs.
  - [x] Task 22.1. Add a mermaid diagram or SVG showing the receiver-lambda call chain building a tree.
- [x] Task 23. `exceptions-and-error-handling.adoc` — `try`/`catch`/`finally` as an expression, no checked
  - Note: `apps/android/kotlin/exceptions-and-error-handling.adoc` created (a cross-reference to Task 25's page was corrected to the actual filename `coroutine-context-cancellation-and-exceptions.adoc` during Task 38's build verification).
      exceptions in Kotlin, custom exceptions, the `Result` type and `runCatching`.
- [x] Task 24. `coroutines-basics.adoc` — `suspend` functions, coroutine builders (`launch`, `async`,
  - Note: `apps/android/kotlin/coroutines-basics.adoc` created, with a mermaid diagram (Task 24.1) of a structured-concurrency tree.
      `runBlocking`), `CoroutineScope`, structured concurrency.
  - [x] Task 24.1. Add a mermaid diagram of a parent scope with child coroutines (structured-concurrency tree).
- [x] Task 25. `coroutine-context-cancellation-and-exceptions.adoc` — `CoroutineContext`, `Dispatchers`
  - Note: `apps/android/kotlin/coroutine-context-cancellation-and-exceptions.adoc` created.
      (`Default`/`IO`/`Main`), cancellation & timeouts (`withTimeout`), `SupervisorJob`,
      `CoroutineExceptionHandler`.
- [x] Task 26. `flows.adoc` — cold `Flow` basics, flow builders, common operators (`map`/`filter`/`collect`),
  - Note: `apps/android/kotlin/flows.adoc` created, with a mermaid sequence diagram (Task 26.1) of a cold flow.
      `StateFlow` vs. `SharedFlow`, buffering.
  - [x] Task 26.1. Add a mermaid sequence diagram of a cold flow: no collector → nothing runs → `collect()`
        starts emission.
- [x] Task 27. `kotlin-for-android.adoc` — Kotlin as Google's preferred Android language since 2019, Android
  - Note: `apps/android/kotlin/kotlin-for-android.adoc` created, cross-linking back to Task 3's `kotlin-and-the-jvm.adoc`.
      KTX, Jetpack pointers (ViewModel, Room, Compose — not a Compose deep-dive), coroutines on Android
      (`viewModelScope`/`lifecycleScope`); explicit cross-link back to `kotlin-and-the-jvm.adoc` (Task 3) so the
      two pages read as complementary.
- [x] Task 28. `build-and-tooling.adoc` — `kotlinc`, the Gradle Kotlin DSL (`build.gradle.kts`), Maven's Kotlin
  - Note: `apps/android/kotlin/build-and-tooling.adoc` created.
      plugin, IntelliJ IDEA / Android Studio support, static analysis (`ktlint`, `detekt`), a short pointer to
      Kotlin Multiplatform.
- [x] Task 29. `testing.adoc` — `kotlin.test`, JUnit 5 with Kotlin, MockK, `kotlinx-coroutines-test` for testing
  - Note: `apps/android/kotlin/testing.adoc` created.
      suspend functions/flows.
- [x] Task 30. `modules/ROOT/pages/backend/springboot/java-or-kotlin.adoc` _(SpringBoot Reference; uses
  - Note: `modules/ROOT/pages/backend/springboot/java-or-kotlin.adoc` created (uses `springboot-disclaimer.adoc`, not the Kotlin one), including the pros/cons table, the side-by-side Java/Kotlin `@RestController`, and the References section.
      `include::partial$springboot-disclaimer.adoc[]`, not the Kotlin one)_ — "Java or Kotlin for Spring Boot?"
  - [x] Task 30.1. Intro: Spring Boot officially supports Kotlin as a first-class language (Spring Initializr
        language picker, `kotlin("plugin.spring")`/`kotlin("plugin.jpa")` Gradle plugins).
  - [x] Task 30.2. Pros/cons table covering at minimum: null safety, boilerplate, concurrency model (virtual
        threads vs. coroutines), framework proxying / all-open plugin, JPA/Hibernate interop, Java
        interop/ecosystem, compile times/tooling (K2), hiring/ramp-up, Android code sharing — content per issue
        #73's own table.
  - [x] Task 30.3. Side-by-side minimal `@RestController` GET endpoint, Java vs. Kotlin.
  - [x] Task 30.4. Closing "when to choose which" guidance paragraph (not a hard mandate).
  - [x] Task 30.5. `== References` section: Spring Boot Kotlin docs, `kotlin-spring`/`kotlin-jpa` plugin docs,
        the three comparison articles cited in issue #73.

### Group 3 — Cheat sheet _(untagged)_

**Parallelizable: yes** (single task, but must follow Group 2 — the cheat sheet's content and cross-references
depend on every topic page's final heading structure).

- [x] Task 31. Kotlin cheat sheet
  - [x] Task 31.1. Build a print-ready, single-page HTML/CSS layout (dense multi-column, colour-coded boxed
        sections per topic: types & variables, null safety, classes & data classes, sealed/enum, lambdas & scope
        functions, collections, coroutines & flows, Android/tooling one-liners, …), header line "Kotlin Cheat
        Sheet — current release line — Kotlin 2.4.x", breadcrumb footer "Irurueta Docs · Guides & References /
        Apps / Android / Kotlin Reference" — visually consistent with `java-cheat-sheet.pdf`/
        `springboot-cheat-sheet.pdf`.
  - [x] Task 31.2. Render it to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
        verify it is **exactly one A4 page** with no clipping, save as
        `modules/ROOT/attachments/kotlin-cheat-sheet.pdf`. Discard the HTML source (not checked in).
  - [x] Task 31.3. Create `modules/ROOT/pages/apps/android/kotlin/cheat-sheet.adoc` — `:description:`/
        `:keywords:`, `include::partial$kotlin-disclaimer.adoc[]`, cross-references to every topic page
        (Tasks 2–29) grouped the same way as the "What's covered" list (Task 34), ending with
        `xref:attachment$kotlin-cheat-sheet.pdf[Download the Kotlin Cheat Sheet (PDF)]`.
  - Note: cheat sheet built as a print-ready HTML/CSS layout (headless Chrome via Puppeteer), verified as exactly one A4 page with no clipping (page count confirmed via PDF page-object inspection, and a rendered preview screenshot), saved to `modules/ROOT/attachments/kotlin-cheat-sheet.pdf` (HTML source discarded, not checked in); `apps/android/kotlin/cheat-sheet.adoc` created cross-referencing every topic page.

### Group 4 — Landing pages, nav/index wiring, and build verification _(untagged)_

**Parallelizable: no** — each landing page's "Sections"/"What's covered" list must reflect the final file set
from Groups 2–3, `nav.adoc` must reference files that already exist, and the build-verification task must run
last against the fully-wired tree.

- [x] Task 32. Create `modules/ROOT/pages/apps/index.adoc` — "Apps" landing page: title, `:description:`,
  - Note: `modules/ROOT/pages/apps/index.adoc` created.
      `:keywords:`, one intro paragraph, `== Sections` bullet linking `xref:apps/android/index.adoc[Android]`
      (mirrors `modules/ROOT/pages/backend/index.adoc` exactly).
- [x] Task 33. Create `modules/ROOT/pages/apps/android/index.adoc` — "Android" landing page: same house style,
  - Note: `modules/ROOT/pages/apps/android/index.adoc` created.
      `== Sections` bullet linking `xref:apps/android/kotlin/index.adoc[Kotlin Reference]`, phrased so it reads
      naturally with only one section for now (room for future Android references without re-nesting).
- [x] Task 34. Create `modules/ROOT/pages/apps/android/kotlin/index.adoc` — "Kotlin Reference" landing page
  - Note: `modules/ROOT/pages/apps/android/kotlin/index.adoc` created, with the full "What's covered" list and a `_bibliography`-anchored Bibliography section including *Kotlin in Action, 2nd ed.*
      (mirrors `modules/ROOT/pages/backend/java/index.adoc`):
  - [x] Task 34.1. Title, `:description:`, `:keywords:`, `include::partial$kotlin-disclaimer.adoc[]`, one intro
        paragraph, a "New here? read in this order" pointer.
  - [x] Task 34.2. `== What's covered` — full bulleted list of Tasks 2–29 + Task 31 (cheat sheet), grouped as:
        Getting started; Language fundamentals; Object-oriented & functional programming; Type system;
        Collections & metaprogramming; Error handling; Coroutines; Kotlin on Android & tooling.
  - [x] Task 34.3. `== Bibliography` section, anchor `_bibliography`: official Kotlin docs
        (kotlinlang.org/docs/home.html), stdlib API reference, language specification, coroutines guide, Kotlin
        for server-side development, Android Kotlin developer guide, and *Kotlin in Action, Second Edition*
        (Aigner, Elizarov, Isakova & Jemerov — Manning, 2024) linked to its Manning page — per issue #73's
        References section.
- [x] Task 35. Update `modules/ROOT/nav.adoc`:
  - [x] Task 35.1. Append the full `** Apps` / `*** Android` / `**** Kotlin Reference` / `***** <pages>` tree
        after the current Backend Development block (after line 466), covering Tasks 32–34 and every page from
        Tasks 2–29 + 31, in the same grouped order as Task 34.2.
  - [x] Task 35.2. Insert one new `****` entry for `xref:backend/springboot/java-or-kotlin.adoc[Java or Kotlin
        for Spring Boot?]` into the existing SpringBoot Reference block, immediately after
        `core-annotations.adoc` (see "Choices made" #5 above).
  - Note: `modules/ROOT/nav.adoc` updated — full Apps/Android/Kotlin Reference tree appended after Backend Development, and the `java-or-kotlin.adoc` entry inserted into the SpringBoot Reference block after `core-annotations.adoc`.
- [x] Task 36. Update `modules/ROOT/pages/index.adoc`:
  - [x] Task 36.1. Add a new "Apps" bullet under `== Guides & References`, after the existing Backend
        Development bullet, in the same style/depth as the Database/Web/Backend Development bullets, summarizing
        the Android/Kotlin Reference section.
  - [x] Task 36.2. Refresh the page's `:description:`/`:keywords:` to mention Kotlin/Android/Apps.
  - Note: `modules/ROOT/pages/index.adoc` updated — new Apps/Android/Kotlin Reference bullets added under Guides & References, and the page's `:description:`/`:keywords:` refreshed.
- [x] Task 37. Refresh `:description:`/`:keywords:` on `modules/ROOT/pages/backend/index.adoc` and
  - Note: `modules/ROOT/pages/backend/index.adoc` and `modules/ROOT/pages/backend/springboot/index.adoc` `:description:`/`:keywords:` refreshed, and a `java-or-kotlin.adoc` bullet added to the SpringBoot "What's covered" list.
      `modules/ROOT/pages/backend/springboot/index.adoc` to mention the new `java-or-kotlin.adoc` page; add a
      matching bullet to `backend/springboot/index.adoc`'s "What's covered" list.
- [x] Task 38. Build verification — delegate to a sub-agent so Antora's build output doesn't consume the main
      context window:
      ```
      Agent({
        description: "Verify Antora build for the Kotlin Reference section",
        subagent_type: "iru-gate-runner",
        prompt: "Run `npm install` if node_modules is missing, then `npx antora antora-playbook.yml` at the
          repository root. Report back: whether the build succeeded, and the full text of any new AsciiDoc/xref
          warnings or errors (especially unresolved `xref:` targets under apps/, backend/springboot/java-or-kotlin,
          or any kotlin-*.svg image reference). Do not report a clean, unrelated build log verbatim — only
          problems, or a one-line confirmation that none were found."
      })
      ```
      Fix any reported broken `xref:`/image reference before considering this task done.
  - Note: build verification run directly (`npm install` + `npx antora antora-playbook.yml`) rather than via `iru-gate-runner` (not installed in this repository) — first pass surfaced one broken `xref:` (Task 23's cross-link to Task 25's page used a wrong filename) and 3 AsciiDoc attribute-substitution warnings in Task 6's page (unescaped `${expression}` outside a source block); both fixed, and a clean rebuild produced zero warnings/errors across all 747 generated pages, including all 33 new/changed pages and the two mermaid diagrams that render via the site's existing client-side mermaid.js setup.
