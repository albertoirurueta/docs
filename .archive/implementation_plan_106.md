# Implementation Plan: Guides & References / Programming Languages — C++ Reference

## Task summary

Source: GitHub issue #106
Base branch: main

Issue [#106](https://github.com/albertoirurueta/docs/issues/106) asks for a brand-new **C++ Reference**
documentation section under *Guides & References / Programming Languages*, authored directly into this repo's
own `ROOT` Antora component (this repo has no application source code — it *is* the Antora playbook + root
component): a landing page, 36 topic pages, and a one-page downloadable PDF cheat sheet, at
`modules/ROOT/pages/programming-languages/cpp/`, targeting **C++23 (ISO/IEC 14882:2024)** while flagging
C++20/23-only features and their C++17 fallbacks, and closing with a page on the (technically complete but not
yet ISO-published) **C++26**.

The issue's own page outline, sourcing/bibliography list, wiring instructions, and acceptance criteria are
exhaustive and are treated as the source of truth for content below — this plan does not restate every sentence
of them, it sequences them into buildable tasks with concrete file paths, diagram choices, and cross-link
targets.

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's own pattern — stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** No installed `*-code-one-task` skill (`java`, `dotnet`, `database`,
   `java-springboot`) applies — every task below is AsciiDoc/SVG/PDF authoring, matching every prior
   documentation plan in `.archive/`, including the two closest precedents read in full below.
   `[source,cpp]`/`[source,shell]` blocks are illustrative AsciiDoc content, and are also this section's actual
   compilable examples per the issue's own requirement (see point 4 below) — not a compiled Antora module.
2. **The issue's stated precedent, issue #105 ("C Reference"), does not exist in this codebase yet** — it is
   still an open, unimplemented ticket: there is no `modules/ROOT/pages/programming-languages/c/` directory, no
   `nav-c.adoc`/`c-disclaimer.adoc` partials, no `feature/105` branch, and no `.archive/implementation_plan_105.md`.
   Issue #106 asks to follow "the exact structure/conventions of the C Reference (issue #105) and Kotlin
   Reference (issue #73)" — since only the latter is real, this plan follows the **Kotlin Reference** directly
   (`modules/ROOT/pages/programming-languages/kotlin/`, 29 pages, archived at
   `.archive/implementation_plan_73.md`), which is exactly what issue #105's own (unimplemented) body already
   re-derives from Kotlin, so following Kotlin directly reaches the same structure #106 asks for. Two concrete
   consequences, both mechanical rather than open design questions:
   - **Nav placement**: `nav-cpp.adoc` is inserted immediately after `include::partial$nav-kotlin.adoc[]` inside
     the existing open block in `modules/ROOT/nav.adoc` (lines 22–24) — i.e. right after the last *actually
     present* sibling, per the append-order convention the issue itself states. If issue #105 is implemented
     later, its `nav-c.adoc` would land between `nav-kotlin.adoc` and `nav-cpp.adoc`; reordering at that point is
     that ticket's concern, not this one's.
   - **Sibling count**: `programming-languages/index.adoc` gains "C++ Reference" as its **sixth** bullet (after
     Kotlin), not the "seventh" the issue describes (which assumes a C Reference bullet that doesn't exist yet).
3. **Page breakdown: 36 C++ Reference content pages + 1 cheat sheet + 1 landing page (`index.adoc`) = 38 `.adoc`
   files**, exactly as issue #106 lists them under `modules/ROOT/pages/programming-languages/cpp/`. No page is
   merged or split beyond what the issue specifies.
4. **Compilable-examples requirement, and a real local-toolchain constraint found during planning**: every code
   example must be written to compile under `clang++ -std=c++23 -Wall -Wextra` (the issue's own bar), and
   verified against this environment's actual toolchain (Clang 18.1.3 / GCC 13.3, libstdc++) wherever that
   toolchain can express it. Verification during planning found this toolchain's libstdc++ does **not** yet ship
   several C++23 **library** headers, even though the compiler frontend accepts `-std=c++23` for **language**
   features: `<print>` (`std::println`), `<generator>`, `<flat_map>`, `<mdspan>` all fail with "file not found";
   `<expected>` and `<stacktrace>` **are** available. Affected tasks (Task 3 "Hello, World" with `std::println`,
   Task 9 `std::format`/`std::print`, Task 24 `flat_map`/`mdspan`, Task 34 `std::generator`, Task 22
   `std::print` vs. streams) call this out individually below: compile everything that *does* compile locally,
   and for the handful of APIs that don't, write the example to the same standard-conformant syntax verified
   against cppreference/the WG21 draft, and add a short one-sentence note in the page (in the same spirit as the
   issue's own "flag C++20/23-only features" ask) that local verification used GCC 14+/an up-to-date libc++ for
   that specific snippet rather than silently implying this toolchain compiled it.
5. **Diagrams — mermaid by default, hand-authored SVG only for genuinely spatial layouts** (object/vtable
   layout, struct/ownership diagrams, decision charts, hierarchies), matching every prior language-reference
   plan's pattern. The 📊 markers in the issue are a floor, not a ceiling — an implementer may add further small
   `cpp-*.svg` figures while writing a page if one adds real value. `@sntke/antora-mermaid-extension` is already
   wired into `antora-playbook.yml` and is confirmed in active use elsewhere in this repo (e.g.
   `modules/ROOT/pages/web/react/data-fetching.adoc`).
6. **PDF generation approach — same as every prior section**: a hand-built, print-ready single-page HTML/CSS
   layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`; this
   environment has Chromium pre-installed at `/opt/pw-browsers/chromium`), saved as a static checked-in asset at
   `modules/ROOT/attachments/cpp-cheat-sheet.pdf`, linked via
   `xref:attachment$cpp-cheat-sheet.pdf[Download the C++ Cheat Sheet (PDF)]`. Must be **exactly one A4 page**
   (page-count check + a rendered preview with no clipping). No HTML source is kept in the repo.
7. **No project-picker tile** for the C++ Reference — like every other Programming Languages entry, it lives
   only in `nav.adoc`, `programming-languages/index.adoc`, and the root `pages/index.adoc` keywords line.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml), component `irurueta`), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc),
  pages under `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no
  lint/test suite). `build/` is gitignored.
- `modules/ROOT/pages/programming-languages/` currently has five reference subsections: `javascript/`,
  `typescript/`, `python/`, `java/`, `kotlin/` (29 pages) plus its own `index.adoc` cross-reference landing page
  — no `c/` and no `cpp/` yet.
- `modules/ROOT/pages/programming-languages/kotlin/*.adoc` (29 files) is the direct structural template for
  every C++ Reference content page: `= <Title>` / `:description:` / `:keywords:` / (optional `:page-aliases:`,
  not needed here — C++ has no secondary home the way Kotlin has Android) / `include::partial$kotlin-disclaimer.adoc[]`
  header, body sections, an optional `== See Also`, and a closing `== References` section, `[mermaid]` blocks
  (e.g. `kotlin/inheritance-and-interfaces.adoc`), and hand-authored SVGs would live in `modules/ROOT/images/`
  (none exist yet for Kotlin — the section uses mermaid throughout; C++'s more spatial topics like object layout
  and pointer arithmetic are better candidates for actual SVGs, per Choice 5 above).
- `modules/ROOT/partials/kotlin-disclaimer.adoc` is the exact template for `cpp-disclaimer.adoc`: an
  `[IMPORTANT]` admonition, 3 sentences — (a) scope/version pin, (b) AI-generation disclosure, (c) a pointer to
  `xref:programming-languages/cpp/index.adoc#_bibliography[bibliography]`.
- `modules/ROOT/partials/nav-kotlin.adoc` is the exact template for `nav-cpp.adoc`: a flat `*`/`**` xref list (the
  index page as `*`, every topic page as `**`, cheat sheet last), included via the depth-agnostic open-block
  technique.
- `modules/ROOT/nav.adoc` lines 19–28:
  ```
  * Guides & References
  ** xref:programming-languages/index.adoc[Programming Languages]
  +
  --
  include::partial$nav-kotlin.adoc[]
  --
  include::partial$nav-javascript.adoc[]
  include::partial$nav-typescript.adoc[]
  include::partial$nav-python.adoc[]
  include::partial$nav-java.adoc[]
  ```
  `nav-cpp.adoc` is inserted as a new `include::partial$nav-cpp.adoc[]` line between line 23
  (`include::partial$nav-kotlin.adoc[]`) and line 24 (the closing `--`) — i.e. inside the same open block, right
  after Kotlin (see Choice 2 above for why not "after `nav-c.adoc`," which doesn't exist).
- `modules/ROOT/pages/programming-languages/index.adoc` currently lists five bullets (JavaScript, TypeScript,
  Python, Java, Kotlin) under `== Sections`, and its `:description:`/`:keywords:` enumerate those five languages
  — the C++ Reference becomes the sixth bullet, appended after Kotlin's.
- `modules/ROOT/pages/index.adoc`'s single long `:keywords:` line (line 3) currently ends with `..., Android,
  Kotlin, Kotlin 2.4, Kotlin coroutines, Jetpack` — per the issue, gains `C++, C++23, C++26` appended.
- `modules/ROOT/attachments/kotlin-cheat-sheet.pdf` / `java-cheat-sheet.pdf` are the exact visual templates for
  `cpp-cheat-sheet.pdf` (dense multi-column colour-coded boxes, header line, breadcrumb footer).
- Toolchain available in this environment for verifying compilable examples: `clang++` 18.1.3 and `g++` 13.3.0
  (Ubuntu), both accepting `-std=c++23`; libstdc++ from GCC 13.3 lacks `<print>`, `<generator>`, `<flat_map>`,
  `<mdspan>` (see Choice 4 above) but has `<expected>` and `<stacktrace>`.

## Implementation steps

### Group 1 — Scaffold the disclaimer _(untagged)_

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/cpp-disclaimer.adoc`
  - [x] Task 1.1. `[IMPORTANT]` admonition, 3 sentences only, matching `kotlin-disclaimer.adoc`'s shape: (a) one
        sentence — "documents C++23 (ISO/IEC 14882:2024), as published by ISO/IEC JTC1/SC22/WG21
        (https://www.open-std.org/jtc1/sc22/wg21/[wg21]), verified against the freely available working draft
        N5046 (https://eel.is/c++draft/[eel.is/c++draft]) and https://en.cppreference.com/w/cpp[cppreference.com]";
        (b) one sentence disclosing AI assistance and pointing to those same sources for verification; (c) one
        line pointing to `xref:programming-languages/cpp/index.adoc#_bibliography[bibliography]`. No book
        titles, no evaluation paragraph — every content page in this section `include::`s this file.

### Group 2 — Parallel content pages _(untagged)_

**Parallelizable: yes** — every page is an independent file with its own content; none reads another page's
finished text (forward `xref:`s to not-yet-written sibling pages resolve fine once the whole group lands, and
Group 4's build-verification task is what actually checks this). All 36 tasks below `include::` the disclaimer
from Group 1, so Group 1 must land first.

All C++ Reference pages live under `modules/ROOT/pages/programming-languages/cpp/`; each starts with
`= <Title>`, a `:description:`, a `:keywords:`, `include::partial$cpp-disclaimer.adoc[]`, contains compilable
code examples per Choice 4 above, and ends with a `== References` section linking only official documentation
(the WG21 working draft, cppreference, the C++ Core Guidelines, or GCC/Clang/MSVC/tool manuals as applicable) —
no page here has its own Bibliography, that lives only on the landing page (Group 4).

#### Getting started

- [x] Task 2. `getting-started.adoc` — what C++ is, the standard editions (C++98/03/11/14/17/20/23/26) and who
      publishes them (WG21), compilers (GCC, Clang, MSVC), "Hello, World" with `std::println`, compiling with
      `-std=c++23 -Wall -Wextra`, Compiler Explorer.
  - [x] Task 2.1. Add an SVG (`modules/ROOT/images/cpp-compilation-pipeline.svg`) of the compilation pipeline
        (preprocess → compile → assemble → link).
  - [x] Task 2.2. Per Choice 4: the `std::println` "Hello, World" example is standard-conformant C++23 but
        `<print>` isn't in this environment's libstdc++ — verify the syntax against cppreference and note in the
        page (one sentence) that it needs GCC 14+ or a recent libc++/MSVC, alongside a `<cstdio>`/`std::cout`
        fallback that *does* compile locally, matching the issue's own "how to fall back on C++17" framing.
- [x] Task 3. `program-structure-and-compilation.adoc` — translation units, declarations vs. definitions, the
      One Definition Rule, headers and include guards, linkage, `main`, a first look at modules, static vs.
      dynamic libraries.
  - [x] Task 3.1. Add an SVG (`modules/ROOT/images/cpp-headers-tus-objects.svg`) of headers/TUs/objects/executable.

#### Language fundamentals

- [x] Task 4. `lexical-structure-and-style.adoc` — tokens, identifiers and reserved names, keywords, literals
      (integer, floating, character, string, raw, user-defined), comments, attributes, and the C++ Core
      Guidelines naming/formatting conventions.
- [x] Task 5. `basic-types-and-values.adoc` — fundamental types, fixed-width integers, `char8_t`/`char16_t`/
      `char32_t`, `bool`, `auto` and `decltype`, type aliases and alias templates, implicit/explicit
      conversions, `<limits>`, `sizeof`/`alignof`.
- [x] Task 6. `constants-enumerations-and-initialization.adoc` — `const`, `constexpr`, `consteval`,
      `constinit`, scoped and unscoped enumerations (`std::to_underlying`, `using enum`), uniform/list
      initialization and its pitfalls, default member initializers, aggregate initialization and designated
      initializers.
- [x] Task 7. `operators-and-expressions.adoc` — operator precedence and associativity, value categories
      (lvalue/prvalue/xvalue), sequencing, integer promotions, `<=>` three-way comparison, safe integer
      comparison (`std::cmp_less`), bit manipulation.
- [x] Task 8. `control-flow.adoc` — `if`/`switch` with initializers, `if constexpr`/`if consteval`, loops and
      range-based `for` (including for custom types), structured bindings, `[[likely]]`, `goto`.
- [x] Task 9. `functions-and-lambdas.adoc` — declarations and overloading, default arguments, defaulted/deleted
      functions, lambdas (captures, generic, template lambdas, recursive), `std::function`, `std::invoke`,
      higher-order functions (map/fold), function composition, `noexcept` and `[[nodiscard]]`.
- [x] Task 10. `strings-and-text.adoc` — `std::string`/`std::string_view`, character types and Unicode, raw
      string literals, user-defined literals, `<charconv>` conversions, `std::format`/`std::print` (including
      custom formatters), `<regex>`.
  - [x] Task 10.1. Per Choice 4: `<format>`/`std::format` compiles locally; `std::print` doesn't (no `<print>`)
        — show `std::format` fully verified, and give `std::print` the same one-sentence toolchain note as
        Task 2.2.
- [x] Task 11. `numbers-and-math.adoc` — numeric types and `<limits>`, floating point pitfalls, `<cmath>`,
      `<numbers>`, `<random>` engines/distributions and seeding, `<bit>` utilities, `std::bitset`, checked
      conversions.

#### Object-oriented programming

- [x] Task 12. `classes-and-objects.adoc` — members, constructors and member-initializer lists, special member
      functions, the rule of zero/three/five, `explicit`, `static` members, `friend`, `const`/`mutable`
      correctness, `this`.
  - [x] Task 12.1. Add a mermaid diagram of the special-member generation decision (which of the six special
        members the compiler implicitly declares/deletes, and why).
- [x] Task 13. `inheritance-and-polymorphism.adoc` — public/protected/private inheritance, virtual functions,
      `override`/`final`, abstract classes, virtual destructors, object slicing, `dynamic_cast` and RTTI, the
      casts (`static_cast`, `reinterpret_cast`, `const_cast`).
  - [x] Task 13.1. Add an SVG (`modules/ROOT/images/cpp-object-layout-vtable.svg`) of object layout with a
        vtable pointer.
- [x] Task 14. `operator-overloading-and-conversions.adoc` — member vs. non-member operators, `operator<=>` and
      defaulted comparisons, `operator[]` (multidimensional in C++23), `operator()`, conversion operators,
      `explicit`, user-defined literals, stream operators.
- [x] Task 15. `move-semantics-and-value-categories.adoc` — rvalue references, `std::move`, `std::forward`, move
      constructors/assignment, copy elision and guaranteed elision, `noexcept` moves, returning by value.
  - [x] Task 15.1. Add an SVG (`modules/ROOT/images/cpp-copy-vs-move.svg`) contrasting copy vs. move of a
        buffer-owning object.
- [x] Task 16. `memory-management-and-smart-pointers.adoc` — stack vs. free store, `new`/`delete`, RAII,
      `std::unique_ptr`, `std::shared_ptr`/`std::weak_ptr`, `make_unique`/`make_shared`, custom deleters,
      alignment, allocators overview.
  - [x] Task 16.1. Add an SVG (`modules/ROOT/images/cpp-smart-pointer-ownership.svg`) of the ownership graph of
        `unique_ptr`/`shared_ptr`/`weak_ptr`.

#### Generic and compile-time programming

- [x] Task 17. `templates.adoc` — function and class templates, template argument deduction, CTAD and deduction
      guides, non-type template parameters, alias templates, variadic templates and fold expressions,
      specialization and partial specialization, two-phase lookup basics.
- [x] Task 18. `concepts-and-constraints.adoc` — `concept`, `requires` clauses and `requires` expressions,
      standard concepts (`std::integral`, `std::same_as`, …), abbreviated function templates, subsumption.
  - [x] Task 18.1. Add a mermaid diagram of the constraint-check flow (candidate → constraints evaluated →
        satisfied/not satisfied → overload chosen).
- [x] Task 19. `compile-time-programming.adoc` — `constexpr` functions and variables, `consteval` immediate
      functions, `constinit`, `static_assert`, `<type_traits>` (querying and writing traits),
      `std::conditional`, `std::enable_if` vs. concepts, `if constexpr`, `std::is_constant_evaluated`,
      constexpr virtual functions.
- [x] Task 20. `namespaces-modules-and-the-preprocessor.adoc` — namespaces, unnamed and inline namespaces,
      `using`-declarations/directives, ADL, the preprocessor (conditional compilation, stringification and
      concatenation indirection, `__VA_OPT__`), modules and module partitions, feature-test macros and
      `<version>`.

#### Standard library

- [x] Task 21. `standard-library-overview.adoc` — how the library is organized (headers by area), the `std`
      namespace, C compatibility headers, freestanding vs. hosted, `std::size`/`std::data`/`std::ssize`,
      `std::hash` and hashing custom types, `std::exit`/`std::atexit`.
- [x] Task 22. `containers.adoc` — sequence (`vector`, `array`, `deque`, `list`, `forward_list`), associative
      (`map`, `set`, `multimap`) and unordered containers, `flat_map`/`flat_set` (C++23), container adaptors,
      `std::span` and `std::mdspan`, `std::bitset`/`vector<bool>`, choosing the right container and invalidation
      rules.
  - [x] Task 22.1. Add an SVG (`modules/ROOT/images/cpp-container-decision-chart.svg`) container decision
        chart.
  - [x] Task 22.2. Per Choice 4: `flat_map`/`flat_set`/`mdspan` aren't in this environment's libstdc++ — write
        both to verified-correct C++23 syntax per cppreference and add the same one-sentence toolchain note as
        Task 2.2; every other container in this page compiles locally.
- [x] Task 23. `iterators-and-algorithms.adoc` — iterator categories, `begin`/`end` and non-member access,
      `<algorithm>` and `<numeric>` (finding, sorting, set operations, `iota`, `fill`, `generate`), insert
      iterators, writing a random-access iterator, `std::erase_if`.
  - [x] Task 23.1. Add an SVG (`modules/ROOT/images/cpp-iterator-category-hierarchy.svg`) of the iterator
        category hierarchy.
- [x] Task 24. `ranges-and-views.adoc` — ranges concepts, `std::ranges` constrained algorithms, projections,
      views and range adaptors (`filter`, `transform`, `take`, `drop`, `zip`, `enumerate`, `chunk`, …),
      `ranges::to`, writing a custom view.
  - [x] Task 24.1. Add a mermaid diagram of a lazy view pipeline.
- [x] Task 25. `vocabulary-types.adoc` — `std::pair`/`std::tuple`, `std::optional` and its monadic operations,
      `std::variant` and `std::visit`, `std::any`, `std::expected`, `std::reference_wrapper`.
- [x] Task 26. `dates-times-and-chrono.adoc` — `chrono::duration`, clocks and `time_point`, measuring execution
      time, calendars (`year_month_day`), time zones, formatting/parsing times.
- [x] Task 27. `input-output-and-streams.adoc` — the iostreams hierarchy, formatted vs. unformatted I/O,
      manipulators and `<iomanip>`, string streams, binary file I/O, `std::span` buffers (`<spanstream>`),
      locales, `std::osyncstream`, `std::print` vs. streams.
  - [x] Task 27.1. Add an SVG (`modules/ROOT/images/cpp-stream-class-hierarchy.svg`) of the stream class
        hierarchy.
  - [x] Task 27.2. Per Choice 4: give the `std::print` comparison the same one-sentence toolchain note as Task
        2.2; the iostreams examples themselves compile locally.
- [x] Task 28. `filesystem.adoc` — `std::filesystem::path`, creating/copying/removing files and directories,
      file properties, directory iteration, finding files, error handling with `error_code`.

#### Error handling and robustness

- [x] Task 29. `error-handling.adoc` — exceptions and the standard hierarchy, `throw`/`try`/`catch`, exception
      safety guarantees, `noexcept`, `std::exception_ptr`, `std::error_code`/`system_error`, `std::expected` as
      an alternative, `assert`, `std::source_location`, `<stacktrace>`, `std::terminate`.
  - [x] Task 29.1. Add a mermaid diagram of exception propagation and stack unwinding.

#### Concurrency

- [x] Task 30. `threads-and-synchronization.adoc` — `std::thread`/`std::jthread`, `stop_token` cancellation,
      mutexes and lock helpers (`lock_guard`, `scoped_lock`, `unique_lock`, `shared_mutex`), condition
      variables, `latch`, `barrier`, `counting_semaphore`, `thread_local`, exceptions from threads,
      `osyncstream`.
  - [x] Task 30.1. Add an SVG (`modules/ROOT/images/cpp-synchronization-primitives.svg`) of the synchronization
        primitives at a glance.
- [x] Task 31. `async-futures-and-atomics.adoc` — `std::promise`/`std::future`/`shared_future`, `std::async` and
      launch policies, `std::packaged_task`, `std::atomic` and memory orders, `atomic_ref`,
      `atomic<shared_ptr>`, parallel algorithms with execution policies, parallel map/fold.
- [x] Task 32. `coroutines.adoc` — `co_await`/`co_yield`/`co_return`, promise types and awaitables, a `task`
      type, a `generator` type, `std::generator` (C++23).
  - [x] Task 32.1. Add a mermaid state-machine diagram of a coroutine's suspend/resume states.
  - [x] Task 32.2. Per Choice 4: `<generator>`/`std::generator` isn't in this environment's libstdc++ — the
        hand-written `task`/`generator` awaitable types compile locally (verify them); give `std::generator`
        itself the same one-sentence toolchain note as Task 2.2.

#### Design, performance and tooling

- [x] Task 33. `patterns-and-idioms.adoc` — RAII, pimpl, NVI, CRTP and static polymorphism (with `deducing
      this`), mixins, type erasure, the named-parameter idiom, attorney–client, factories without `if`/`else`,
      thread-safe singleton.
- [x] Task 34. `performance.adoc` — the zero-overhead principle, measuring before optimizing, avoiding copies
      (moves, `string_view`, `span`), reserving and contiguous containers, `constexpr` evaluation, inlining and
      `[[likely]]`, allocation strategies, undefined behavior and the optimizer, profiling and sanitizers.
- [x] Task 35. `build-and-tooling.adoc` — compilers and flags, CMake (targets, `CMakePresets`), package
      managers (vcpkg, Conan), `clang-format`, `clang-tidy`, sanitizers (ASan/UBSan/TSan),
      `compile_commands.json`, Compiler Explorer.
- [x] Task 36. `testing.adoc` — GoogleTest (assertions, fixtures, parameterized tests, GoogleMock), Catch2
      (sections, matchers, generators), Boost.Test, CTest integration, testing constexpr code with
      `static_assert`.
- [x] Task 37. `cpp-standards-and-cpp26.adoc` — the editions from C++98 to C++23 and their headline features,
      feature-test macros, compiler support pages, and C++26 (reflection, contracts, `std::execution`,
      erroneous behaviour, hardened library) with links to N5046 and cppreference.
  - [x] Task 37.1. Add a mermaid timeline of the C++ standards.

### Group 3 — Cheat sheet _(untagged)_

**Parallelizable: yes** (single task, but depends on Group 2's final page list/titles to cross-reference
accurately — so it lands after Group 2).

- [x] Task 38. C++ cheat sheet
  - [x] Task 38.1. Build a print-ready, single-page HTML/CSS layout (dense multi-column, colour-coded boxed
        sections, a header line "Irurueta Docs — C++ Reference" and a breadcrumb footer "Guides & References /
        Programming Languages / C++ Reference") covering, at minimum, one box per Group 2 subsection: getting
        started; language fundamentals (types, operators, control flow, functions/lambdas); OOP (classes,
        inheritance, operator overloading, move semantics, memory/smart pointers); generic/compile-time
        programming (templates, concepts, `constexpr`); standard library (containers, iterators/algorithms,
        ranges, vocabulary types, chrono, I/O, filesystem); error handling; concurrency (threads, futures/atomics,
        coroutines); and design/performance/tooling — visually consistent with `kotlin-cheat-sheet.pdf` /
        `java-cheat-sheet.pdf`.
  - [x] Task 38.2. Render it to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`,
        e.g. using `/opt/pw-browsers/chromium`), verify it is **exactly one A4 page** with no clipping (page
        count via PDF page-object inspection, plus a rendered preview screenshot), save to
        `modules/ROOT/attachments/cpp-cheat-sheet.pdf`. Discard the HTML source (not checked in).
  - [x] Task 38.3. Create `modules/ROOT/pages/programming-languages/cpp/cheat-sheet.adoc` — `:description:`/
        `:keywords:`, `include::partial$cpp-disclaimer.adoc[]`, one summary paragraph, then every topic page
        from Group 2 cross-referenced grouped by subsection (same grouping as Task 39.2 below), ending with
        `xref:attachment$cpp-cheat-sheet.pdf[Download the C++ Cheat Sheet (PDF)]`.

### Group 4 — Landing page, nav/index wiring, and build verification _(untagged)_

**Parallelizable: no** — the landing page's "What's covered" list and the nav partial both need the final page
list from Groups 2–3, `nav.adoc`/`programming-languages/index.adoc`/root `index.adoc` are single shared files
edited once each, and build verification must run last, against everything already in place.

- [x] Task 39. Create `modules/ROOT/pages/programming-languages/cpp/index.adoc` — "C++ Reference" landing page:
  - [x] Task 39.1. `= C++ Reference`, `:description:`, `:keywords:` (C++, C++23, C++26, WG21, cppreference,
        RAII, templates, concepts, ranges, coroutines, smart pointers, move semantics, …),
        `include::partial$cpp-disclaimer.adoc[]`, one intro paragraph on what C++ is and that this section
        targets C++23, a "New here? read in this order" pointer (Task 2 → Task 3 → *Language fundamentals* in
        order → the rest as needed).
  - [x] Task 39.2. `== What's covered` — full bulleted list of Tasks 2–37 + Task 38 (cheat sheet), grouped
        exactly as Group 2's subsections above (Getting started; Language fundamentals; Object-oriented
        programming; Generic and compile-time programming; Standard library; Error handling and robustness;
        Concurrency; Design, performance and tooling; Reference).
  - [x] Task 39.3. `== Bibliography` section, anchor `_bibliography`, reproducing the issue's own bibliography
        list verbatim (all linked): the Standard C++ Foundation's "The Standard"/status pages, WG21 + the N5046
        working draft + eel.is/c++draft, cppreference.com (with its C++20/23/26 feature pages), the C++ Core
        Guidelines, GCC/Clang/MSVC documentation and conformance pages, CMake/vcpkg/Conan/GoogleTest/Catch2/
        Boost.Test documentation, and the two consulted books (Stroustrup's *A Tour of C++, 3rd ed.* and
        Bancila's *Modern C++ Programming Cookbook, 3rd ed.*, each marked "Consulted reference" and linked to
        their publisher/author pages per the issue's own citation text) — closing with the same "on any
        discrepancy, the standard and cppreference win" sentence the Kotlin/Java landing pages use.
- [x] Task 40. Create `modules/ROOT/partials/nav-cpp.adoc` — flat `*`/`**` xref list: `programming-languages/cpp/index.adoc`
      as `*`, every page from Tasks 2–37 as `**` in the same order as Task 39.2, `cheat-sheet.adoc` (Task 38.3)
      last — written exactly like `nav-kotlin.adoc`'s depth-agnostic technique.
- [x] Task 41. Update `modules/ROOT/nav.adoc`: insert `include::partial$nav-cpp.adoc[]` as a new line between
      the existing `include::partial$nav-kotlin.adoc[]` (line 23) and the closing `--` (line 24) of that open
      block — see Choice 2 above for why this is the correct insertion point (right after the last sibling that
      actually exists) rather than "after `nav-c.adoc`."
- [x] Task 42. Update `modules/ROOT/pages/programming-languages/index.adoc`:
  - [x] Task 42.1. Add a sixth `== Sections` bullet, after the Kotlin bullet: `xref:programming-languages/cpp/index.adoc[C++
        Reference] -- ...` (one-line summary in the same style as the other five, covering language
        fundamentals, OOP, generics/compile-time programming, the standard library, concurrency, and tooling,
        plus a downloadable cheat sheet).
  - [x] Task 42.2. Refresh the page's `:description:`/`:keywords:` to mention C++/C++23.
- [x] Task 43. Update `modules/ROOT/pages/index.adoc`: append `C++, C++23, C++26` to the end of the existing
      `:keywords:` line (line 3) — no other change to this page is required by the issue.
- [x] Task 44. Build verification — delegate to a sub-agent so Antora's build output doesn't consume the main
      context window:
      ```
      Agent({
        description: "Verify Antora build for the C++ Reference section",
        subagent_type: "iru-gate-runner",
        prompt: "Run `npm install` if node_modules is missing, then `npx antora antora-playbook.yml` at the
          repository root. Report back: whether the build succeeded, and the full text of any new AsciiDoc/xref
          warnings or errors (especially unresolved `xref:` targets under programming-languages/cpp/, or any
          cpp-*.svg image reference, or the mermaid blocks added in Group 2/Group 3). Do not report a clean,
          unrelated build log verbatim — only problems, or a one-line confirmation that none were found."
      })
      ```
      Fix any reported broken `xref:`/image reference before considering this task done.
