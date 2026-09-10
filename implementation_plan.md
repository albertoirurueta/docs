## Task summary

Add a new **C Reference** documentation section at **Guides & References / Programming Languages**, as a sixth
sibling of the existing JavaScript, TypeScript, Python, Java and Kotlin references: a landing page with a
**Bibliography**, 29 topic pages (code examples, links to official documentation, and Mermaid/SVG figures where
they help), and a one-page, printable, downloadable **C cheat sheet PDF** styled like `kotlin-cheat-sheet.pdf` /
`java-cheat-sheet.pdf`. The section targets **C23 (ISO/IEC 9899:2024)**, flagging C23-only features and their
C17/C11 fallbacks.

Source: GitHub issue #105
Base branch: main

Choices made on the user's behalf (nothing else in the issue was ambiguous — it specifies the exact file list,
per-page content, nav placement, and bibliography entries):
- **Compiler for "compilable examples" verification**: the issue asks for examples "verified with
  `clang -std=c23 -Wall -Wextra`". This environment has Clang 18.1.3 installed, and `-std=c23` is confirmed to
  work with it (`gcc` 13.3.0 is also present but only understands `-std=c2x`, not `-std=c23`, so `clang` is the
  tool used for every compile-check in this plan, exactly as the issue specifies).
- **`nav-c.adoc` include site**: `nav-kotlin.adoc` is actually included in `modules/ROOT/nav.adoc` **twice** —
  once under `Guides & References > Programming Languages` (line 23, the canonical Kotlin Reference location)
  and again under `Apps > Android` (line ~603, because Kotlin is also *the* Android language and that page tree
  reuses the same nav partial for the Android context via `page-aliases`). C has no Android angle, and the
  issue's own nav diagram shows only the `Programming Languages` placement, so `nav-c.adoc` is included **once**,
  right after the first `nav-kotlin.adoc` include (Programming Languages block only) — not duplicated under
  `Apps > Android`. No `:page-aliases:` are added to the C pages either, for the same reason.
- **Book citation**: following the Kotlin/Java precedent, only `index.adoc`'s Bibliography cites *Modern C, Third
  Edition* (Gustedt) — none of the 29 topic pages or the cheat sheet page cite it; each topic page's own
  `== References` links only WG14/N3220, cppreference.com, and the GCC/Clang/glibc manuals.

## Current code state

- This repo has no application source code — it is the Antora playbook/root component for the "Irurueta Docs"
  site. `modules/ROOT/pages/programming-languages/` currently holds five sibling language references:
  `javascript/`, `typescript/`, `python/`, `java/`, `kotlin/` — no `c/` directory exists yet.
- **Kotlin Reference** (`modules/ROOT/pages/programming-languages/kotlin/`, from issue #73) is the closest and
  most recent precedent, confirmed as a direct structural match:
  - `modules/ROOT/partials/kotlin-disclaimer.adoc` — a 3-sentence `[IMPORTANT]` admonition: (a) scope/version
    sentence, (b) AI-assistance disclosure pointing to the primary source, (c) a line pointing to
    `xref:programming-languages/kotlin/index.adoc#_bibliography[bibliography]`. `include::`d at the top of every
    content page in the section (after the page's `:description:`/`:keywords:`).
  - `modules/ROOT/partials/nav-kotlin.adoc` — written with its own `*`/`**` bullet depth starting from 1; nesting
    correctly wherever it's included because of the list-continuation (`+` then an open block `--…--`)
    immediately after the parent bullet in `nav.adoc` — this is the "depth-agnostic" technique the issue refers
    to. It's included in `modules/ROOT/nav.adoc` at line 23 (`** xref:programming-languages/index.adoc[...]` →
    `+` → `--` → `include::partial$nav-kotlin.adoc[]` → `--`) and again at line ~603 under `Apps > Android`.
  - `modules/ROOT/pages/programming-languages/kotlin/index.adoc` — landing page: title, `:description:`,
    `:keywords:`, `:page-aliases:` (Kotlin-specific, not needed for C), the disclaimer include, an intro
    paragraph, a "New here? read in this order" pointer, a `== What's covered` section grouping every topic page
    under the same headings used in the nav partial, and a `== Bibliography` section (anchor `_bibliography`)
    listing every source consulted, each linked, ending with the book citation and a note that the official docs
    win on any discrepancy.
  - 28 topic pages, each: `= <Title>`, `:description:`, `:keywords:`, the disclaimer include, prose + code
    examples, occasional `[mermaid]` blocks or `image::programming-languages/kotlin-*.svg[]` figures, ending in a
    `== References` section linking only official documentation (no book citations on topic pages).
  - `modules/ROOT/pages/programming-languages/kotlin/cheat-sheet.adoc` — lists what the cheat sheet covers,
    cross-references every topic page grouped the same way as `index.adoc`'s "What's covered" list, and ends with
    `xref:attachment$kotlin-cheat-sheet.pdf[Download the Kotlin Cheat Sheet (PDF)]`.
  - `modules/ROOT/attachments/kotlin-cheat-sheet.pdf` (and `java-cheat-sheet.pdf`, the closest visual template
    for a systems-language cheat sheet) — a dense, multi-column, colour-coded, exactly-one-A4-page PDF, built as
    a print-ready HTML/CSS layout and rendered via headless Chrome (`--headless --print-to-pdf
    --no-pdf-header-footer`); only the PDF is checked in, the HTML source is discarded.
- `modules/ROOT/pages/programming-languages/index.adoc` — cross-reference landing page with a `== Sections` list
  of the five existing language references (one bullet each); needs a sixth C Reference bullet.
- `modules/ROOT/pages/index.adoc` — the site root picker; its `:keywords:` line lists every topic covered
  site-wide (no free-standing "Programming Languages" prose section — the picker links to
  `programming-languages/index.adoc` via an image tile at line 101, and `programming-languages/index.adoc`'s own
  `== Sections` list is the actual per-language list, per above).
- `.archive/implementation_plan_73.md` — the archived Kotlin Reference plan, read in full as the structural
  precedent for grouping, task granularity, and the cheat-sheet/build-verification approach used below.
- Environment check: `clang` 18.1.3 and `gcc` 13.3.0 are both installed; only `clang -std=c23` is accepted
  (`gcc -std=c23` errors — GCC 13 only knows `-std=c2x`), so `clang -std=c23 -Wall -Wextra` (exactly what the
  issue specifies) is the compile-check command used throughout this plan.

## Implementation steps

### Group 1 — Scaffold the disclaimer _(untagged)_

**Parallelizable: yes** (single task).

- [ ] Task 1. Create `modules/ROOT/partials/c-disclaimer.adoc`
  - [ ] Task 1.1. `[IMPORTANT]` admonition, 2–3 sentences, matching the Kotlin/short-template shape: (a) one
        sentence — "documents **C23 (ISO/IEC 9899:2024)**, per ISO/IEC JTC1/SC22/WG14's freely available working
        draft N3220 (https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3220.pdf), which WG14 documents as
        differing from the published standard only editorially — the reference these pages are written and
        verified against"; (b) one sentence disclosing AI assistance and pointing to the WG14/cppreference
        sources for verification; (c) one line pointing to
        `xref:programming-languages/c/index.adoc#_bibliography[bibliography]`. No book titles, no evaluation
        paragraph. Every content page in this section `include::`s this file.

### Group 2 — Parallel content pages _(untagged)_

**Parallelizable: yes** — every page is an independent file with its own content; none reads another page's
finished text (forward `xref:`s to not-yet-written sibling pages resolve fine once the whole group lands, and
Group 4's build-verification task is what actually checks this). All 29 tasks below `include::` the disclaimer
from Group 1, so Group 1 must land first.

All C Reference pages live under `modules/ROOT/pages/programming-languages/c/`; each starts with `= <Title>`, a
`:description:`, a `:keywords:`, `include::partial$c-disclaimer.adoc[]`, contains code examples compile-checked
with `clang -std=c23 -Wall -Wextra` (zero warnings), and ends with a `== References` section linking only
official documentation (the WG14/N3220 draft, the relevant cppreference.com/w/c page(s), and the GCC/Clang/glibc
manuals where a page discusses compiler- or libc-specific behavior) — no page here has its own Bibliography, that
lives only on `index.adoc` (Group 4). Where noted 📊, add a `[mermaid]` diagram block or a hand-authored
`modules/ROOT/images/c-*.svg` (author's judgment which); these are a floor, not a ceiling — add more wherever a
picture genuinely clarifies a concept.

#### Getting started

- [ ] Task 2. `getting-started.adoc` — what C is (K&R origins, standardized by ISO/IEC JTC1/SC22 WG14), the
      standard editions (K&R, C89/C90, C95, C99, C11, C17, C23) and who publishes them, compilers (GCC, Clang,
      MSVC), "Hello, World", compiling/running with `-std=c23 -Wall -Wextra`, warnings-as-errors.
  - [ ] Task 2.1. 📊 SVG `c-compilation-pipeline.svg`: preprocess → compile → assemble → link → run.
- [ ] Task 3. `program-structure.adoc` — grammar at a glance, declarations vs. definitions, statements,
      translation units and headers, translation phases, `main` and its signatures, exit status.

#### Language fundamentals

- [ ] Task 4. `lexical-structure-and-style.adoc` — character sets, comments, identifiers and reserved names,
      keywords, punctuators, literals overview, formatting/naming conventions, attribute syntax (`[[...]]`).
- [ ] Task 5. `basic-types-and-values.adoc` — the abstract state machine (values, types, representations), `bool`,
      character types, signed/unsigned integers, fixed-width (`<stdint.h>`) and bit-precise (`_BitInt`) integers,
      floating-point types, integer/floating/character constants, implicit conversions and promotions, `sizeof`,
      `<limits.h>`/`<float.h>`.
  - [ ] Task 5.1. 📊 SVG `c-integer-promotion-ladder.svg`: the integer conversion/promotion ladder.
- [ ] Task 6. `constants-enumerations-and-initialization.adoc` — `const` objects, `enum` (including C23 fixed
      underlying types), macros vs. `constexpr`, compound literals, initializers (scalar, aggregate, designated,
      zero/empty `{}`), `static_assert`.
- [ ] Task 7. `operators-and-expressions.adoc` — arithmetic, division/remainder, assignment and compound
      assignment, increment/decrement, comparison and logical operators, bitwise and shift operators, the
      ternary operator, comma, casts, `sizeof`/`alignof`, lvalues vs. values, operator precedence table,
      evaluation order and sequencing (unsequenced side effects = UB).
- [ ] Task 8. `control-flow.adoc` — `if`/`else`, `switch` with fall-through, `for` (with declaration), `while`,
      `do`-`while`, `break`/`continue`, `goto` and labels, `return`.
  - [ ] Task 8.1. 📊 mermaid flowchart of the loop forms (`for`/`while`/`do-while`).
- [ ] Task 9. `functions.adoc` — prototypes vs. definitions, pass-by-value, array parameters, `main` is special,
      recursion, `static` (internal linkage) and `inline` functions, `[[noreturn]]`, variadic functions with
      `<stdarg.h>`.
  - [ ] Task 9.1. 📊 SVG `c-recursive-call-stack.svg`: call stack frames for a recursive call.
- [ ] Task 10. `arrays-and-strings.adoc` — array declaration and length, `sizeof` vs. element count,
      multidimensional arrays, variable-length arrays, array-to-pointer decay in parameters (`[static n]`),
      strings as `char` arrays, string literals, the `<string.h>` essentials.
- [ ] Task 11. `structures-unions-and-type-aliases.adoc` — `struct` declaration and designated initialization,
      nested structures, `typedef`, `union` and tagged unions, bit-fields, flexible array members, alignment and
      padding, `offsetof`.
  - [ ] Task 11.1. 📊 SVG `c-struct-layout-padding.svg`: struct layout with padding and alignment.

#### Pointers and memory

- [ ] Task 12. `pointers.adoc` — address-of and dereference, pointer arithmetic and differences (`ptrdiff_t`),
      validity, null pointers (`nullptr`, `NULL`), pointers to structures (`->`), pointers and arrays are the
      same access, `void *`, `const` and pointers, `restrict`, function pointers and callbacks (`qsort`).
  - [ ] Task 12.1. 📊 SVG `c-pointer-arithmetic.svg`: pointer, pointee and pointer arithmetic over an array.
- [ ] Task 13. `memory-model-and-alignment.adoc` — the uniform memory model, object representation as
      `unsigned char[]`, unions for type punning, effective types and strict aliasing, explicit conversions,
      alignment and `alignas`/`alignof`/`max_align_t`.
- [ ] Task 14. `dynamic-memory-allocation.adoc` — `malloc`/`calloc`/`realloc`/`free`/`aligned_alloc`/
      `free_sized`, growing arrays, ownership and consistency rules, flexible-array-member allocation, common
      defects (leaks, use-after-free, double free) and how sanitizers catch them.
  - [ ] Task 14.1. 📊 mermaid diagram: lifecycle of a heap object (allocate → use → free).
- [ ] Task 15. `storage-duration-scope-and-linkage.adoc` — the four storage durations (static, thread, automatic,
      allocated), lifetime, block/file/function scope, internal vs. external linkage, `extern`, tentative
      definitions, `static` inside functions, initialization rules per storage class, `thread_local`.
  - [ ] Task 15.1. 📊 mermaid/SVG `c-storage-duration-decision.svg`: storage-duration decision tree.

#### Preprocessor and generic programming

- [ ] Task 16. `preprocessor-and-macros.adoc` — object-like and function-like macros, `#include` and include
      guards, conditional compilation, `#if`/`#elif`/`#elifdef`, `__has_include`/`__has_c_attribute`, `defined`,
      stringification and token pasting, variadic macros and `__VA_OPT__`, `__FILE__`/`__LINE__`/`__func__`,
      `#error`/`#warning`, `_Pragma`, `#embed`, argument checking, default-argument tricks.
- [ ] Task 17. `type-generic-programming.adoc` — inherent generic features (operators, promotions, `void *`,
      function pointers), `_Generic` selection, `<tgmath.h>`, `typeof`/`typeof_unqual`, `auto` type inference,
      compound-statement-expression/lambda extensions as future directions.

#### Standard library

- [ ] Task 18. `standard-library-overview.adoc` — header catalogue table (every C23 header, with what it
      provides), interface conventions (return codes, `errno`, `perror`/`strerror`), the optional Annex K
      bounds-checking interfaces, feature-test macros (`__STDC_VERSION__`, `__STDC_NO_THREADS__`…), assertions,
      program termination (`exit`, `atexit`, `quick_exit`, `abort`), the environment (`getenv`, `system`).
- [ ] Task 19. `numbers-and-math.adoc` — `<stdlib.h>` integer functions, `<inttypes.h>` format macros, checked
      arithmetic (`<stdckdint.h>`), bit utilities (`<stdbit.h>`), `<math.h>` (classification, rounding, `fma`,
      error handling), `<fenv.h>`, `<complex.h>`, pseudo-random numbers.
- [ ] Task 20. `input-output-and-files.adoc` — streams and `FILE`, `stdin`/`stdout`/`stderr`, unformatted I/O
      (`puts`/`fputs`/`fgets`/`getchar`), the `printf` family and its format-specifier table, the `scanf` family
      and its pitfalls, `fopen` modes, `fread`/`fwrite`, positioning (`fseek`/`ftell`/`fgetpos`), buffering
      (`setvbuf`/`fflush`), EOF vs. error, binary streams.
  - [ ] Task 20.1. 📊 mermaid diagram: stream/buffer flow.
- [ ] Task 21. `strings-and-text-processing.adoc` — `<string.h>` (`strlen`, `strcpy`/`strncpy`, `strcat`,
      `strcmp`, `strchr`/`strstr`, `strtok`, `memcpy`/`memmove`/`memset`/`memcmp`, `strdup`), `<ctype.h>`, numeric
      conversion (`strtol`/`strtod`), `snprintf` as the safe formatter, extended character sets and locales,
      UTF-8 (`char8_t`, `u8""`), `<uchar.h>`/`<wchar.h>` and restartable conversions.
- [ ] Task 22. `dates-and-times.adoc` — `time_t`, `struct timespec`/`timespec_get`, `clock` and
      `CLOCKS_PER_SEC`, `struct tm` (`gmtime`/`localtime`/`mktime`/`timegm`), `strftime`, `difftime`, measuring
      elapsed time.

#### Robustness and performance

- [ ] Task 23. `error-handling-and-program-failure.adoc` — the catalogue of wrongdoings (arithmetic, conversion,
      value, type and access violations, misinterpretation, invalidation), state degradation (unbounded
      recursion, storage exhaustion), races/deadlocks pointers, dealing with failure: error codes, `errno`
      discipline, cleanup with `goto`, defensive assertions, sanitizers (`-fsanitize=address,undefined`).
- [ ] Task 24. `advanced-control-flow.adoc` — sequencing recap, short jumps (`goto` for cleanup), function calls
      as control, long jumps (`setjmp`/`longjmp` and `volatile`), signal handlers (`signal`, `raise`,
      `sig_atomic_t`, async-signal safety).
  - [ ] Task 24.1. 📊 mermaid diagram: `setjmp`/`longjmp` unwinding.
- [ ] Task 25. `performance.adoc` — measure first, `inline` functions and their linkage rules, `restrict`,
      `[[unsequenced]]`/`[[reproducible]]` and other attributes, measurement with `timespec_get`, profiling/
      inspection tools (`-O2`/`-O3`, `perf`/`gprof`, `objdump`), "UB lets the optimizer assume" rule.

#### Concurrency

- [ ] Task 26. `threads.adoc` — `<threads.h>`: `thrd_create`/`thrd_join`, return values, simple inter-thread
      control, race-free initialization with `call_once`, thread-local storage (`thread_local`, `tss_t`),
      critical sections with `mtx_t`, condition variables (`cnd_t`) and the wait loop, detach, liveness.
  - [ ] Task 26.1. 📊 mermaid sequence diagram: producer/consumer with a condition variable.
- [ ] Task 27. `atomics-and-memory-consistency.adoc` — data races and the memory model, `_Atomic` types and
      `<stdatomic.h>` operations (`atomic_load`/`store`/`fetch_add`/`compare_exchange`), lock-free flags,
      happened-before, sequential consistency vs. acquire/release/relaxed, fences.
  - [ ] Task 27.1. 📊 SVG `c-happens-before.svg`: happens-before edges between two threads.

#### Tooling and standards

- [ ] Task 28. `build-and-tooling.adoc` — GCC/Clang/MSVC invocation and warning flags, `-std=` and feature-test
      macros, Make and CMake minimal projects, sanitizers and Valgrind, static analysis (`clang-tidy`,
      `cppcheck`, `-fanalyzer`), formatting (`clang-format`), debugging (`gdb`/`lldb`), documentation with
      Doxygen.
- [ ] Task 29. `testing.adoc` — unit testing in C: `assert`-based self-checks, a minimal test harness, popular
      frameworks (Unity, CMocka, Check, Criterion — linked to their official sites), running tests through
      CTest, testing UB-sensitive code under sanitizers.
- [ ] Task 30. `c-standards-and-c23.adoc` — the editions timeline (K&R → C23), what C23 added (`bool`/`true`/
      `false` keywords, `nullptr`, `constexpr`, `typeof`, `auto`, `_BitInt`, binary literals and digit
      separators, `#embed`, `__VA_OPT__`, attributes, empty initializers, `static_assert`/`thread_local`
      keywords, checked arithmetic and bit utilities, removed K&R functions), transitional code (feature tests,
      fallback headers), compiler support matrix pointers.
  - [ ] Task 30.1. 📊 mermaid timeline: K&R → C89/90 → C95 → C99 → C11 → C17 → C23.

### Group 3 — Cheat sheet _(untagged)_

**Parallelizable: yes** (single task, but must follow Group 2 — the cheat sheet's content and cross-references
depend on every topic page's final heading structure).

- [ ] Task 31. C cheat sheet
  - [ ] Task 31.1. Build a print-ready, single-page HTML/CSS layout (dense multi-column, colour-coded boxed
        sections: types & literals, operators & precedence, control flow, functions, arrays & strings,
        structs/unions/enums, pointers, dynamic memory, storage classes, preprocessor, `_Generic`/`typeof`, the
        `printf` format table, common library calls, threads/atomics, and the C23 additions), header line "C
        Cheat Sheet — C23 / ISO/IEC 9899:2024", breadcrumb footer "Irurueta Docs · Guides & References /
        Programming Languages / C Reference" — visually consistent with `kotlin-cheat-sheet.pdf`/
        `java-cheat-sheet.pdf`.
  - [ ] Task 31.2. Render it to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
        verify it is **exactly one A4 page** with no clipping (page-object inspection plus a rendered preview
        screenshot), save as `modules/ROOT/attachments/c-cheat-sheet.pdf`. Discard the HTML source (not checked
        in).
  - [ ] Task 31.3. Create `modules/ROOT/pages/programming-languages/c/cheat-sheet.adoc` — `:description:`/
        `:keywords:`, `include::partial$c-disclaimer.adoc[]`, cross-references to every topic page (Tasks 2–30)
        grouped the same way as the "What's covered" list (Task 32), ending with
        `xref:attachment$c-cheat-sheet.pdf[Download the C Cheat Sheet (PDF)]`.

### Group 4 — Landing page, nav/index wiring, and build verification _(untagged)_

**Parallelizable: no** — the landing page's "What's covered" list must reflect the final file set from Groups
2–3, `nav.adoc`/`programming-languages/index.adoc` must reference files that already exist, and the
build-verification task must run last against the fully-wired tree.

- [ ] Task 32. Create `modules/ROOT/pages/programming-languages/c/index.adoc` — "C Reference" landing page
      (mirrors `programming-languages/kotlin/index.adoc`):
  - [ ] Task 32.1. Title, `:description:`, `:keywords:` (including `C, C23, ISO/IEC 9899:2024`),
        `include::partial$c-disclaimer.adoc[]`, one intro paragraph on what C is, a "New here? read in this
        order" pointer (Getting Started → Language fundamentals, then the remaining groups as needed).
  - [ ] Task 32.2. `== What's covered` — full bulleted list of Tasks 2–30 + Task 31 (cheat sheet), grouped under
        the same eight headings used in Group 2 above: Getting started; Language fundamentals; Pointers and
        memory; Preprocessor and generic programming; Standard library; Robustness and performance; Concurrency;
        Tooling and standards.
  - [ ] Task 32.3. `== Bibliography` section, anchor `_bibliography`, listing every source from the issue,
        each linked: ISO/IEC 9899:2024 (via WG14's site + the N3220 working draft), ISO/IEC JTC1/SC22/WG14,
        cppreference.com's C reference (and its C23 page), the GCC manual + C status page, the Clang User's
        Manual + C status page, the GNU C Library Reference Manual, and Gustedt's *Modern C, Third Edition*
        (Manning, 2025, ISBN 9781633437777) as a consulted reference, linked to the publisher's book page,
        manning.com, and the author's freely available manuscript/code archive — ending with a note (matching
        the Kotlin bibliography's own closing line) that the official standard and its working draft win on any
        discrepancy.
- [ ] Task 33. Wire navigation and disambiguate the include site:
  - [ ] Task 33.1. Create `modules/ROOT/partials/nav-c.adoc`, written exactly like `nav-kotlin.adoc` (its own
        `*`/`**` bullet depth, nesting correctly via the open-block continuation wherever it's included): `*
        xref:programming-languages/c/index.adoc[C Reference]`, then one `**` entry per page from Tasks 2–30 in
        the same grouped order as Task 32.2, then `** xref:programming-languages/c/cheat-sheet.adoc[Cheat Sheet
        (PDF)]`.
  - [ ] Task 33.2. In `modules/ROOT/nav.adoc`, add `include::partial$nav-c.adoc[]` on its own line immediately
        after the existing `include::partial$nav-kotlin.adoc[]` line inside the **same open block** under
        `Guides & References > Programming Languages` (the block starting at line 23) — i.e. right after
        `Programming Languages`'s nav-kotlin include, before `nav-javascript.adoc`. Do **not** add a second
        `nav-c.adoc` include at the other `nav-kotlin.adoc` site (the `Apps > Android` block, line ~603) — that
        site is Kotlin/Android-specific and C has no Android angle (see "Choices made" above).
- [ ] Task 34. Update `modules/ROOT/pages/programming-languages/index.adoc`:
  - [ ] Task 34.1. Add a sixth `== Sections` bullet, `xref:programming-languages/c/index.adoc[C Reference]`,
        after the Kotlin bullet, in the same style/length as the other five (one-sentence summary of what the
        section covers plus "a downloadable cheat sheet").
  - [ ] Task 34.2. Refresh the page's `:description:`/`:keywords:` to mention C/C23.
- [ ] Task 35. Update `modules/ROOT/pages/index.adoc`'s `:keywords:` line (line 3) to add `C, C23` (matching the
      issue's explicit instruction) — no other change to this file (it has no per-language prose section, see
      "Current code state" above).
- [ ] Task 36. Build verification — delegate to a sub-agent so Antora's build output doesn't consume the main
      context window:
      ```
      Agent({
        description: "Verify Antora build for the C Reference section",
        subagent_type: "iru-gate-runner",
        prompt: "Run `npm install` if node_modules is missing, then `npx antora antora-playbook.yml` at the
          repository root. Report back: whether the build succeeded, and the full text of any new AsciiDoc/xref
          warnings or errors (especially unresolved `xref:` targets under programming-languages/c/, or any
          c-*.svg image reference, or a malformed mermaid block). Do not report a clean, unrelated build log
          verbatim — only problems, or a one-line confirmation that none were found."
      })
      ```
      Fix any reported broken `xref:`/image reference before considering this task done. Also confirm (outside
      the sub-agent, directly) that `modules/ROOT/attachments/c-cheat-sheet.pdf` exists and is exactly one A4
      page (per Task 31.2) and that every `modules/ROOT/images/c-*.svg` referenced by a page (per the 📊 tasks
      above) actually exists on disk.
