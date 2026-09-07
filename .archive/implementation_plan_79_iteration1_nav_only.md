# Implementation Plan: "Programming Languages" section under Guides & References

## Task summary

Source: GitHub issue #79

Add a new **"Programming Languages"** grouping under **Guides & References**, gathering the five
general-purpose-language reference subsections that currently live scattered under other categories:
`JavaScript Development` and `TypeScript Reference` and `Python Reference` (all under Web Development),
`Java Reference` (under Backend Development), and `Kotlin Reference` (under Apps → Android). Each of these five
must be **listed under both** its existing category **and** the new Programming Languages category — this is a
navigation-only duplication (the same `xref:` target repeated at a second location in `modules/ROOT/nav.adoc`),
not a move. No `.adoc` file is relocated, renamed, or has its content changed, so every existing inbound
`xref:`/bookmark keeps resolving exactly as before.

### Choices made on the user's behalf (stated so they can be challenged during review)

1. **Placed last.** `Programming Languages` becomes the **fifth** top-level `Guides & References` entry, appended
   after the existing `Apps` block in both `modules/ROOT/nav.adoc` and the `== Guides & References` list in
   `modules/ROOT/pages/index.adoc` — the same append-order convention `.archive/implementation_plan_55.md` (new
   "Backend Development" category) and `.archive/implementation_plan_73.md` (new "Apps" category) both used.
2. **Gets its own landing page**, `modules/ROOT/pages/programming-languages/index.adoc`, matching every other
   existing top-level category (`database/index.adoc`, `web/index.adoc`, `backend/index.adoc`, `apps/index.adoc`)
   — confirmed with the user over the issue's own "implementer's judgment" open point.
3. **`modules/ROOT/pages/index.adoc`'s root picker list also gets a matching bullet block** for Programming
   Languages, mirroring `nav.adoc`, so the site's landing page and its sidebar don't disagree about how content
   is organized — confirmed with the user (issue's acceptance criteria only mentioned `nav.adoc`, but this repo's
   existing convention is that `index.adoc` mirrors every `nav.adoc` top-level category one-for-one).
4. **No project-picker tile** (`modules/ROOT/pages/index.adoc`'s `== Projects` section, or a new image under
   `modules/ROOT/images/`) — Programming Languages is a Guides & References subsection, not a project, same as
   every other subsection in that area.
5. **Kotlin Reference's nested `xref:` lines are re-indented one level shallower** when duplicated. Today it sits
   one level deeper than the other four languages (`apps/android/kotlin/index.adoc` is reached via
   `Apps > Android > Kotlin Reference`, i.e. `****` for the index page and `*****` for its children). Directly
   under the new `** Programming Languages` heading it sits at the same depth as the other four languages
   (`***` for the index page, `****` for its children). Its original location in the Apps block is untouched.
6. **Untagged plan.** No installed `*-code-one-task` skill (`java`, `dotnet`, `database`) applies — every task
   below is pure AsciiDoc nav/page authoring, matching every prior documentation-only plan in `.archive/` (e.g.
   `implementation_plan_73.md`).
7. **Closest precedent, read in full**: `.archive/implementation_plan_73.md` (issue #73, "Kotlin Reference").
   Confirms the append-last convention, the landing-page-per-category pattern, and that the root `index.adoc`
   picker and `nav.adoc` are always updated together for a new top-level category. No prior plan has duplicated a
   subsection under two parents before — this plan follows nav.adoc's ordinary list-repetition mechanism
   (Antora renders whatever `xref:` lines appear in `nav.adoc`, regardless of how many times a given target is
   listed) rather than any special-cased feature, and Task 4's build check is what confirms that assumption holds
   in this repo's actual Antora version.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) (501 lines), with pages
  under `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no
  lint/test suite). `build/` is gitignored.
- **Base branch**: `feature/79`, branched from `main` (clean, up to date).
- `modules/ROOT/nav.adoc`'s `* Guides & References` block currently has four top-level (`**`) categories in
  order: `Database Development` (lines 17-83), `Web Development` (lines 84-397), `Backend Development` (lines
  398-469), `Apps` (lines 470-501, the last line of the file). The five language blocks to duplicate, with their
  exact current line ranges (children included) inside those categories:
  - [nav.adoc:120-156](modules/ROOT/nav.adoc:120) — `*** xref:web/javascript/index.adoc[JavaScript Development]`
    + 35 `****` children, under Web Development.
  - [nav.adoc:284-308](modules/ROOT/nav.adoc:284) — `*** xref:web/typescript/index.adoc[TypeScript Reference]` +
    23 `****` children, under Web Development.
  - [nav.adoc:371-397](modules/ROOT/nav.adoc:371) — `*** xref:web/python/index.adoc[Python Reference]` + 25
    `****` children, under Web Development.
  - [nav.adoc:399-434](modules/ROOT/nav.adoc:399) — `*** xref:backend/java/index.adoc[Java Reference]` + 34
    `****` children, under Backend Development.
  - [nav.adoc:472-501](modules/ROOT/nav.adoc:472) — `**** xref:apps/android/kotlin/index.adoc[Kotlin Reference]`
    + 28 `*****` children, under Apps → Android (one nesting level deeper than the other four).
  None of these five ranges are edited by this plan — they stay exactly as they are; only new lines are appended
  after line 501.
- `modules/ROOT/pages/index.adoc`'s `== Guides & References` list (lines 77-156) mirrors the same four
  categories, one bullet (`*`) per category with a hand-written description, one sub-bullet (`**`) per
  subsection with its own hand-written description (a *different*, usually shorter, wording than the
  subsection's own landing page uses — see below). It ends at line 156 (Kotlin Reference's description), with a
  blank line 157, then `== About me` at line 158.
- `modules/ROOT/pages/backend/index.adoc`, `modules/ROOT/pages/web/index.adoc`, and
  `modules/ROOT/pages/apps/index.adoc` are the direct structural templates for the new
  `modules/ROOT/pages/programming-languages/index.adoc` landing page: an AsciiDoc header (`= Title`,
  `:description:`, `:keywords:`), one intro paragraph, an `== Sections` heading, and one `*` bullet per
  subsection reusing that subsection's own established description text (verified below) plus "a downloadable
  cheat sheet".
- The five subsections' own **landing-page-level** description text (used by `web/index.adoc`,
  `backend/index.adoc`, and `apps/index.adoc` in their own `== Sections` lists — this is the wording level to
  reuse in the new page, not the shorter root-`index.adoc`-level wording) is already established and must be
  copied verbatim, not re-authored:
  - JavaScript Development ([web/index.adoc:18-19](modules/ROOT/pages/web/index.adoc:18)): "modern ECMAScript,
    core browser APIs, and the surrounding developer-tooling ecosystem, plus a downloadable cheat sheet."
  - TypeScript Reference ([web/index.adoc:41-44](modules/ROOT/pages/web/index.adoc:41)): "the typed superset of
    JavaScript: the type system and structural typing, unions and narrowing, interfaces, generics and
    type-level programming, the utility types, `satisfies` and assertions, modules and declaration files,
    `tsconfig` and the compiler, decorators, and JavaScript interop and migration, plus a downloadable cheat
    sheet."
  - Python Reference ([web/index.adoc:53-55](modules/ROOT/pages/web/index.adoc:53)): "the Python language
    itself: core types and control flow, functions and scope, OOP and decorators, modern features -- type
    hints, dataclasses, `asyncio` -- the standard library, and unit testing with pytest and mocking, plus a
    downloadable cheat sheet."
  - Java Reference ([backend/index.adoc:10-13](modules/ROOT/pages/backend/index.adoc:10)): "the Java language
    and its standard library: language fundamentals, object-oriented programming, records and sealed classes,
    pattern matching, generics, the Collections Framework, streams, `java.time`, I/O and NIO.2, concurrency and
    virtual threads, the module system, and unit testing with JUnit 5 and Mockito, plus a downloadable cheat
    sheet."
  - Kotlin Reference ([apps/index.adoc:10-12](modules/ROOT/pages/apps/index.adoc:10), via the Android bullet's
    own wording — the only one of the five reached through an intermediate category): "the Kotlin language on
    the JVM: language fundamentals, object-oriented and functional programming, null safety, generics and
    variance, collections and sequences, exceptions and `Result`, coroutines and flows, and Kotlin on Android,
    plus a downloadable cheat sheet."
- `iru-build-docs` is the installed skill for building this site; `iru-gate-runner` is the installed agent for
  running a verification skill in an isolated context and reporting back a compact summary instead of dumping
  raw Antora build output into the main conversation.

## Implementation steps

### Group 1 — Programming Languages landing page _(untagged)_

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/pages/programming-languages/index.adoc`
  - [x] Task 1.1. Header: `= Programming Languages`, a `:description:` summarizing it as a cross-reference
        landing page linking to the JavaScript, TypeScript, Python, Java, and Kotlin language references (each
        already documented under its own topic-area section), and a `:keywords:` line listing: programming
        languages, JavaScript, ECMAScript, TypeScript, Python, Java, Kotlin, plus "programming languages
        reference".
  - [x] Task 1.2. One intro paragraph (matching the tone/length of `web/index.adoc`'s and `backend/index.adoc`'s
        own intro paragraphs), explaining that this section gathers, in one place, the general-purpose
        programming languages documented elsewhere on the site — each language reference also remains listed
        under its own topic area (Web Development, Backend Development, Apps → Android) for readers who arrive
        by topic instead of by language.
  - [x] Task 1.3. `== Sections` heading followed by five `*` bullets, one per language, each
        `xref:<path>/index.adoc[<Title>] -- <description>` using the exact landing-page-level description text
        captured above verbatim (no re-authoring), in this order: JavaScript Development, TypeScript Reference,
        Python Reference, Java Reference, Kotlin Reference.
  - Note: created `modules/ROOT/pages/programming-languages/index.adoc`. JavaScript/TypeScript/Python/Java
    descriptions were copied byte-for-byte from `web/index.adoc` and `backend/index.adoc` as the plan specified.
    For Kotlin, re-checking the actual current source (`modules/ROOT/pages/apps/android/index.adoc`'s own
    `== Sections` bullet, the true landing-page-level wording for that subsection) found it now reads "the
    Kotlin language on the JVM: language fundamentals, object-oriented and functional programming, the type
    system and null safety, collections, coroutines and flows, and Kotlin on Android, plus a downloadable cheat
    sheet." — shorter than the text the plan's "Current code state" section had captured for it (that captured
    text actually matches the root `pages/index.adoc` Apps-block wording, not `apps/android/index.adoc`'s own
    wording; the two apparently diverged after the plan was drafted). Used the verified current source text
    verbatim rather than the plan's stale quote, consistent with the plan's own principle of reusing each
    subsection's actual established landing-page-level description without re-authoring. No tests apply — this
    repository has no test suite (pure Antora/AsciiDoc content).

### Group 2 — Wire the new section into the navigation and home page _(untagged)_

**Parallelizable: yes** — Task 2 only edits `nav.adoc`, Task 3 only edits `pages/index.adoc`; neither reads the
other's result, and both only need Group 1's new page to exist as an `xref:` target.

- [x] Task 2. Append the new "Programming Languages" nav section to `modules/ROOT/nav.adoc`, after its current
      last line (501, the Kotlin Reference cheat-sheet entry), following the exact structure below:
      ```
      ** xref:programming-languages/index.adoc[Programming Languages]
      *** xref:web/javascript/index.adoc[JavaScript Development]
      **** xref:web/javascript/legacy-features.adoc[Legacy Features to Avoid]
      ... (copy all 35 JavaScript Development child lines from nav.adoc:121-156 verbatim, unchanged depth)
      *** xref:web/typescript/index.adoc[TypeScript Reference]
      **** xref:web/typescript/getting-started.adoc[Getting Started with TypeScript]
      ... (copy all 23 TypeScript Reference child lines from nav.adoc:285-308 verbatim, unchanged depth)
      *** xref:web/python/index.adoc[Python Reference]
      **** xref:web/python/getting-started.adoc[Getting Started]
      ... (copy all 25 Python Reference child lines from nav.adoc:372-397 verbatim, unchanged depth)
      *** xref:backend/java/index.adoc[Java Reference]
      **** xref:backend/java/getting-started.adoc[Getting Started]
      ... (copy all 34 Java Reference child lines from nav.adoc:400-434 verbatim, unchanged depth)
      *** xref:apps/android/kotlin/index.adoc[Kotlin Reference]
      **** xref:apps/android/kotlin/getting-started.adoc[Getting Started]
      ... (copy all 28 Kotlin Reference child lines from nav.adoc:473-501, but with every line's leading
      asterisks reduced by exactly one: the index line goes from **** to ***, and every child line goes from
      ***** to ****)
      ```
      Every `xref:` target line is copied byte-for-byte from its source range (same path, same title text) —
      only the leading `*` nesting-depth prefix changes, and only for the Kotlin block. Do not touch
      lines 1-501; this is a pure append.
  - [x] Task 2.1. Diff-check afterward: `git diff modules/ROOT/nav.adoc` should show only additions at the end
        of the file, with zero lines removed or modified above line 501.
  - Note: verified via `git diff --stat` (156 insertions, 0 deletions) and confirmed no removed/changed lines
    above line 501. All five `xref:` target lines were copied byte-for-byte from their source ranges (JavaScript
    120-156, TypeScript 284-308, Python 371-397, Java 399-434, Kotlin 472-501 with each line's leading `*`
    reduced by exactly one). No tests apply (no test suite in this repo).
- [x] Task 3. Add a matching bullet block to `modules/ROOT/pages/index.adoc`'s `== Guides & References` list,
      inserted after the current last line of that list (156, the Kotlin Reference description) and before the
      existing blank line 157 / `== About me` (158):
      ```
      * xref:programming-languages/index.adoc[Programming Languages] -- a cross-reference of the
        general-purpose programming languages covered across this site's other guides: JavaScript, TypeScript,
        Python, Java, and Kotlin.
      ** xref:web/javascript/index.adoc[JavaScript Development] -- modern ECMAScript, core browser APIs, and the
        surrounding tooling ecosystem (ESLint, Jest, Babel, npm), plus a downloadable cheat sheet.
      ** xref:web/typescript/index.adoc[TypeScript Reference] -- the typed superset of JavaScript: the type
        system and structural typing, unions and narrowing, interfaces, generics and type-level programming,
        the utility types, `satisfies` and assertions, modules and declaration files, `tsconfig` and the
        compiler, decorators, and JavaScript interop and migration, plus a downloadable cheat sheet.
      ** xref:web/python/index.adoc[Python Reference] -- the Python language itself: core types and control
        flow, functions and scope, iterators and generators, modules and packages, exceptions, OOP and
        decorators, modern features -- type hints, dataclasses, `asyncio` -- the standard library, and unit
        testing with pytest and mocking, plus a downloadable cheat sheet.
      ** xref:backend/java/index.adoc[Java Reference] -- the Java language itself: language fundamentals and
        OOP, records and sealed classes, pattern matching, generics, the Collections Framework and streams,
        `java.time` and NIO.2, concurrency and virtual threads, the module system, and unit testing with JUnit 5
        and Mockito, plus a downloadable cheat sheet.
      ** xref:apps/android/kotlin/index.adoc[Kotlin Reference] -- the Kotlin language on the JVM: language
        fundamentals, object-oriented and functional programming, null safety, generics and variance,
        collections and sequences, exceptions and `Result`, coroutines and flows, and Kotlin on Android, plus a
        downloadable cheat sheet.
      ```
      Note this block reuses the exact same per-language description text already present in `index.adoc`'s
      existing Web Development / Backend Development / Apps bullets (lines 100-101, 122-125, 135-137, 141-144,
      153-156) — the root `index.adoc` convention already established there — not the fuller landing-page-level
      wording used in Task 1's new page.
  - [x] Task 3.1. Diff-check afterward: `git diff modules/ROOT/pages/index.adoc` should show only additions
        between the existing Apps block and `== About me`, with zero lines removed or modified elsewhere.
  - Note: verified via `git diff` — 21 lines added, 0 removed, inserted directly after the existing Kotlin
    Reference bullet (line 156) and before `== About me`. Text reuses this file's existing root-level
    per-language descriptions verbatim, as specified. No tests apply (no test suite in this repo).

### Group 3 — Build verification _(untagged)_

**Parallelizable: yes** (single task, depends on Groups 1-2 being complete).

- [x] Task 4. Verify the site builds cleanly with the new section wired in and duplicated correctly.
  - [x] Task 4.1. Delegate to the `iru-gate-runner` agent rather than running the build inline:
        ```
        Agent({
          description: "Build Antora site for issue #79",
          subagent_type: "iru-gate-runner",
          prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site
            (npx antora antora-playbook.yml). Report back: whether the build completed with zero xref/AsciiDoc
            errors or warnings, and specifically confirm the built site's left-hand navigation shows
            'Programming Languages' as a new top-level entry under 'Guides & References' containing JavaScript
            Development, TypeScript Reference, Python Reference, Java Reference, and Kotlin Reference (each with
            its full child page list), AND that Web Development, Backend Development, and Apps still show those
            same five sections in their original locations unchanged. Report any xref resolution errors or
            warnings verbatim if the build isn't clean."
        })
        ```
  - [x] Task 4.2. If the sub-agent reports any `xref` errors/warnings tied to the new Programming Languages
        block (e.g. a target that doesn't resolve, a duplicate-id nav warning), fix the specific line(s) in
        `nav.adoc`/`pages/index.adoc`/`programming-languages/index.adoc` and re-run Task 4.1 until clean.
  - [x] Task 4.3. If the sub-agent reports the duplication didn't render as expected (e.g. Antora deduplicates
        repeated `xref:` targets in `nav.adoc` instead of showing them twice), stop and report this to the user
        before proceeding further — it would mean this repo's Antora/UI-bundle version doesn't support the
        navigation-duplication approach the ticket asks for, which is a decision only the user can make on how
        to proceed (e.g. accept a single canonical location instead, or investigate a UI-bundle-level
        workaround).
  - Note: build via `iru-gate-runner` → `iru-build-docs` (`npx antora antora-playbook.yml`) completed with zero
    xref/AsciiDoc errors or warnings. Confirmed in the rendered site: `Programming Languages` appears as a new
    top-level `Guides & References` entry with all five language sections and their full child-page lists, and
    Web Development, Backend Development, and Apps → Android still show those same five sections, unchanged, in
    their original locations. Antora renders the repeated `xref:` targets in `nav.adoc` twice as intended — no
    deduplication — so Task 4.2/4.3's fallback paths were not needed.
