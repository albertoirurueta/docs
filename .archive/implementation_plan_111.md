# Implementation Plan: Guides & References / Programming Languages — Swift Reference

## Task summary

Source: GitHub issue #111
Base branch: main

Issue [#111](https://github.com/albertoirurueta/docs/issues/111) asks for a new **Swift Reference** section
under *Guides & References → Programming Languages*, the ninth sibling of the existing JavaScript, TypeScript,
Python, Java, Kotlin, C, {cpp}, Objective-C and C# references, authored directly into this repo's own `ROOT`
Antora component (this repo has no application source code — it *is* the Antora playbook + root component).
Concretely:

1. **45 new AsciiDoc pages** under `modules/ROOT/pages/programming-languages/swift/`: a landing `index.adoc`
   (with a `== Bibliography`), **43 topic pages**, and a `cheat-sheet.adoc`.
2. **Two new partials**: `modules/ROOT/partials/swift-disclaimer.adoc` (house 3-part template) and
   `modules/ROOT/partials/nav-swift.adoc` (depth-agnostic `*`/`**` nav partial).
3. **Site wiring**: include the nav partial in `modules/ROOT/nav.adoc` (inside the same open block as
   `nav-kotlin.adoc`/`nav-c.adoc`/`nav-cpp.adoc`/`nav-objective-c.adoc`/`nav-csharp.adoc`, appended last), add a
   "Swift Reference" bullet to `modules/ROOT/pages/programming-languages/index.adoc`, and extend the root
   `modules/ROOT/pages/index.adoc` `:keywords:` with `Swift, Swift 6, Swift Package Manager, Swift Testing`.
4. **Figures**: 12 hand-authored `modules/ROOT/images/swift-*.svg` files plus 12 `[mermaid]` blocks, placed per
   the issue's 📊 markers (a floor, not a ceiling).
5. **`modules/ROOT/attachments/swift-cheat-sheet.pdf`** — exactly one A4 page, rendered from a throwaway
   print-ready HTML/CSS layout via headless Chromium; only the PDF is checked in.

Scope: **the Swift 6 language mode as shipped by Swift 6.3** (6.3.2 current, September 2026) on macOS and Linux,
written and verified against *The Swift Programming Language* (TSPL) on docs.swift.org. Features from 6.1–6.3
are documented as current; **6.4-beta-only** additions are flagged as such; Swift 5 language-mode differences are
noted wherever Swift 6 is stricter. Apple-only frameworks (SwiftUI, UIKit, Combine, CoreML, ARKit, Swift Charts)
are **out of scope**; Foundation, Dispatch and XCTest appear only where the language pages need them. The issue's
own page outline, sourcing table, bibliography and nine acceptance criteria are exhaustive and are treated as the
source of truth for content — this plan sequences them into buildable tasks, it does not restate them.

### Choices made on your behalf (stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** Installed `*-code-one-task` skills are `database`, `dotnet`,
   `java` and `java-springboot` — none applies to AsciiDoc/SVG/PDF authoring, matching every prior documentation
   plan in `.archive/`. Every task below is therefore deliberately **untagged**, which a downstream `iru-code` run
   treats as "implement directly" rather than dispatch. `[source,swift]` blocks are illustrative AsciiDoc
   content, not a compiled module.
2. **The C / {cpp} / Objective-C cross-references are made directly, with no hedge.** Unlike the Objective-C plan
   (`.archive/implementation_plan_109.md`), which had to write pages self-contained because
   `programming-languages/c/` didn't exist on its branch yet, **all three target sections are present and merged
   on `main` today** (`c/`, `cpp/`, `objective-c/`). Task 41 therefore `xref:`s them from the start; no adaptive
   re-check task is needed, and the issue's fifth acceptance criterion is met outright rather than deferred.
3. **Closest precedent: `.archive/implementation_plan_109.md` (issue #109, Objective-C Reference)**, read in full
   during exploration — the same "one language reference under Programming Languages" shape (28 pages + cheat
   sheet; #110's C# Reference is larger at 36). Its conventions are carried over verbatim: page anatomy, the
   3-part disclaimer template, the `*`/`**` nav partial inside the open block, books cited **only** in
   `== Bibliography` and the disclaimer's "consulted while preparing" clause (never as a page's primary source),
   and the cheat-sheet mechanism (hand-built HTML/CSS → headless Chromium → single A4 PDF, HTML not checked in).
4. **Figures: 12 SVGs + 12 mermaid blocks**, assigned per the issue's own 📊 markers — hand-authored SVG for the
   genuinely spatial figures (pipeline, memory layout, capture, hierarchy, isolation, interop), `[mermaid]` for
   flow, sequence, class-diagram and decision figures. An implementer may add further small `swift-*.svg` figures
   where one adds real value, per the issue's "a floor, not a ceiling".
5. **Nav placement: appended after `nav-csharp.adoc`** inside the existing open block in `nav.adoc` — it is
   currently the last partial there, and the issue asks for the append-order convention.
6. **No project-picker tile** — like every other Guides & References subsection, the Swift Reference lives only
   in `nav.adoc`, `programming-languages/index.adoc`, and its own subsection index. Only the root
   `pages/index.adoc` **keywords** change, per the issue.
7. **Cheat-sheet rendering needs a browser this machine doesn't have yet.** The archived plans ran in a sandbox
   with Chromium pre-installed at `/opt/pw-browsers/chromium`; **this local checkout has no `chromium`,
   `chromium-browser` or `google-chrome` on `PATH`**. `npx playwright` resolves (1.63.0) but its browser binary
   must be fetched first. Task 47.3 therefore begins by locating a usable browser — a local Chrome/Chromium
   install, `npx playwright install chromium`, or any other headless-capable Chromium — rather than assuming one,
   and says so explicitly so the step doesn't fail opaquely.
8. **Page grouping below is thematic batching, not hard dependency**, for Groups 2–12: the 43 topic pages are
   independent files and inter-page `xref:`s resolve once all of them land (Antora resolves xrefs at build time
   across the whole component, and the build gate is Group 16, after every page exists). Groups 13–16 *do* carry
   real ordering dependencies and are ordered accordingly.

## Current code state

- **Repository shape**: no application source code. `antora.yml` declares component `ROOT` ("Irurueta Docs");
  `antora-playbook.yml` is the site definition; pages live under `modules/ROOT/pages/`, partials under
  `modules/ROOT/partials/`, figures under `modules/ROOT/images/`, downloadable assets under
  `modules/ROOT/attachments/`. The only verification is a clean `npx antora antora-playbook.yml` (no lint/test
  suite). `build/` is gitignored. Per `CLAUDE.md`, adding a documented topic means editing nav + index + pages,
  not adding tooling.
- **Branch**: `feature/111`, forked from `main`.
- **`modules/ROOT/pages/programming-languages/`** currently contains `index.adoc`, `c/`, `cpp/`, `csharp/`,
  `java/`, `javascript/`, `kotlin/`, `objective-c/`, `python/`, `typescript/`. **No `swift/` directory.**
- **`modules/ROOT/nav.adoc`** — the Programming Languages block (lines 20–33) is:
  ```
  ** xref:programming-languages/index.adoc[Programming Languages]
  +
  --
  include::partial$nav-kotlin.adoc[]
  include::partial$nav-c.adoc[]
  include::partial$nav-cpp.adoc[]
  include::partial$nav-objective-c.adoc[]
  include::partial$nav-csharp.adoc[]
  --
  include::partial$nav-javascript.adoc[]
  ...
  ```
  i.e. five partials sit inside the open block (`--`); the other language partials are included after it and are
  *also* included elsewhere in the file under their own topic areas. That double-inclusion is why the partials
  use depth-agnostic `*`/`**` levels.
- **`modules/ROOT/partials/csharp-disclaimer.adoc`** (most recent sibling) and `c-disclaimer.adoc` are the
  templates for the new disclaimer: an `[IMPORTANT]` block with (1) a scope/version sentence naming the reference
  it is verified against and how newer/preview features are flagged, (2) the AI-assistance disclosure, (3) a
  pointer to the section's `#_bibliography` anchor.
- **`modules/ROOT/partials/nav-c.adoc`** / `nav-csharp.adoc` are the templates for the new nav partial: a single
  `*` entry for the reference's `index.adoc` followed by one `**` entry per page, ending with
  `Cheat Sheet (PDF)`.
- **Page anatomy** (e.g. `modules/ROOT/pages/programming-languages/c/pointers.adoc`): `= <Title>`,
  `:description:`, `:keywords:`, `include::partial$<lang>-disclaimer.adoc[]`, body with `[source,<lang>]` blocks,
  an optional "see also" bullet list, and a closing `== References` section of official links only.
- **Landing page anatomy** (`programming-languages/c/index.adoc`): title/description/keywords, disclaimer
  include, a one-paragraph "what the language is", a "read in this order" paragraph, `== What's covered` with one
  bullet per page grouped by the same section headings used in the nav, and `== Bibliography`.
- **Cheat-sheet page anatomy** (`programming-languages/c/cheat-sheet.adoc`): description of what the sheet
  covers, grouped cross-references to every topic page, and the `xref:attachment$...pdf[...]` download link.
- **Figures**: `modules/ROOT/images/` holds the site's SVGs, included as
  `image::<name>.svg["<alt text>",width=750,role=text-center]`. SVGs are hand-authored, `viewBox`-based, with an
  explicit white `<rect>` background and `font-family="Helvetica, Arial, sans-serif"`. Mermaid blocks are written
  as `[mermaid]` + `....` delimiters.
- **Attachments**: `modules/ROOT/attachments/` holds 31 existing `*-cheat-sheet.pdf` files, including
  `c-cheat-sheet.pdf`, `kotlin-cheat-sheet.pdf` and `objective-c-cheat-sheet.pdf` — the visual templates.
- **`modules/ROOT/pages/programming-languages/index.adoc`** — `== Sections` lists eight bullets today; its intro
  paragraph says "C, {cpp}, Objective-C and C# have no such secondary home and live only here" (Swift joins that
  list). Its `:description:`/`:keywords:` also enumerate the languages.
- **`modules/ROOT/pages/index.adoc`** — the `:keywords:` line (line 3) currently ends `... C#, C# 14, .NET 10,
  LINQ, async/await`; it gains `Swift, Swift 6, Swift Package Manager, Swift Testing`.
- **Tooling available in this environment**: Antora 3.1.15 and its three extensions are already in
  `node_modules/`. **No Chromium/Chrome on `PATH`** (see choice 7).

## Implementation steps

> Conventions every page task below inherits (do not restate per task): create the file under
> `modules/ROOT/pages/programming-languages/swift/`; start with `= <Title>`, a `:description:`, a `:keywords:`,
> then `include::partial$swift-disclaimer.adoc[]`; write compilable examples in `[source,swift]` blocks, verified
> in intent against the Swift 6.3 toolchain in Swift 6 language mode (`swiftc -swift-version 6` / `swift run`) on
> macOS and Linux, noting where a snippet needs Foundation, Dispatch or an Apple platform; name the **TSPL
> chapter(s) the page is built on** in its `== References`, and close that section with links to **only** official
> documentation (docs.swift.org, swift.org, developer.apple.com, swiftlang GitHub repos, Swift Evolution
> proposals). Features introduced after Swift 6.0 carry the version they arrived in; 6.4-beta-only items are
> flagged as such. Prefer `xref:` links to sibling Swift pages over repeating material.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/swift-disclaimer.adoc` — created, modelled on
      `csharp-disclaimer.adoc`/`c-disclaimer.adoc`; `npx antora antora-playbook.yml` builds cleanly (exit 0, no
      output) with the new partial in place.
  - [x] Task 1.1. Copy the shape of `modules/ROOT/partials/csharp-disclaimer.adoc` exactly: an `[IMPORTANT]`
        block (`====` delimiters) with (a) a scope/version sentence — this section documents *the Swift 6
        language mode as shipped by Swift 6.3*, written and verified against *The Swift Programming Language* on
        https://docs.swift.org/swift-book/documentation/the-swift-programming-language/[docs.swift.org], with
        6.4-beta-only features always flagged as such and never presented as baseline; (b) the standard
        AI-assistance disclosure sentence, pointing at docs.swift.org for verification before production use;
        (c) a pointer to `xref:programming-languages/swift/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Keep it to the short 3-part template — no book titles, no evaluation paragraph (books are
        cited only in the landing page's `== Bibliography`).

### Group 2 — Getting started (Parallelizable: yes)

- [x] Task 2. `getting-started.adoc` — "Getting Started" — created at
      `modules/ROOT/pages/programming-languages/swift/getting-started.adoc`; `npx antora antora-playbook.yml`
      builds cleanly (only the expected forward-xref warnings to not-yet-created sibling Swift pages, resolved by
      the Group 16 build gate).
  - [x] Task 2.1. What Swift is (safe, fast, expressive; value semantics, optionals, protocols, structured
        concurrency); short history (2014 → open source 2015 → ABI stability with Swift 5 → Swift 6 strict
        concurrency → 6.1–6.3 and the 6.4 beta), making the **language-mode vs. compiler-version** distinction
        explicit.
  - [x] Task 2.2. Toolchains (Xcode, Swiftly, swift.org toolchains for Linux and Windows, the VS Code
        extension), the `swift` REPL, scripts and `swiftc`, "Hello, World", `swift package init`, playgrounds,
        and *A Swift Tour* as the official crash course. (TSPL: About Swift, Version Compatibility, A Swift
        Tour.)
  - [x] Task 2.3. Add `modules/ROOT/images/swift-compilation-pipeline.svg` — parse → type-check → SIL → LLVM IR
        → machine code, showing where SwiftPM, the REPL and LLDB sit — and include it with
        `image::swift-compilation-pipeline.svg["…",width=750,role=text-center]`.
- [x] Task 3. `lexical-structure-and-style.adoc` — "Lexical Structure and Style" — created at
      `modules/ROOT/pages/programming-languages/swift/lexical-structure-and-style.adoc`; builds cleanly (same
      expected forward-xref warnings only).
  - [x] Task 3.1. Whitespace and comments (including `///` and `/** */` documentation comments), identifiers and
        backtick-escaped keywords, the keyword list, every literal form (integer, floating-point, string, regex),
        operator characters and how operators are tokenised, semicolons.
  - [x] Task 3.2. The **API Design Guidelines** (clarity at the point of use, naming methods and arguments,
        argument labels, fluent usage, `-ed`/`-ing` for non-mutating variants), `MARK`/`TODO`, and `swift-format`.
        (TSPL: Lexical Structure; API Design Guidelines.)

### Group 3 — Language fundamentals I: values, optionals, operators, strings (Parallelizable: yes)

- [x] Task 4. `basics-constants-variables-and-types.adoc` — "Basics: Constants, Variables and Types" —
      created at `modules/ROOT/pages/programming-languages/swift/basics-constants-variables-and-types.adoc`;
      `npx antora antora-playbook.yml` builds cleanly (only the expected forward-xref warnings to not-yet-created
      sibling Swift pages, resolved by the Group 16 build gate).
  - [x] Task 4.1. `let`/`var`, type annotations and inference, printing and interpolation, `Int`/`UInt`/
        `Int8…64`, `Double`/`Float` and choosing between integers and floating-point, numeric literals,
        conversions.
  - [x] Task 4.2. Type aliases, `Bool`, tuples, assertions and preconditions, `fatalError`. (TSPL: The Basics.)
- [x] Task 5. `optionals.adoc` — "Optionals" — created at
      `modules/ROOT/pages/programming-languages/swift/optionals.adoc`; builds cleanly (same expected forward-xref
      warnings only).
  - [x] Task 5.1. `nil` and the `Optional` enum, optional binding (`if let`, `guard let`, the `if let x`
        shorthand, `while let`), the nil-coalescing operator, forced unwrapping, implicitly unwrapped optionals.
  - [x] Task 5.2. Optional chaining across properties, methods and subscripts, the optional pattern
        (`case let x?`), `map`/`flatMap` on optionals, comparing optionals. (TSPL: The Basics → Optionals;
        Optional Chaining.)
  - [x] Task 5.3. Add a `[mermaid]` "how do I get the value out?" decision flow — added as a `flowchart TD`
        block at the end of the page.
- [x] Task 6. `operators.adoc` — "Operators" — created at
      `modules/ROOT/pages/programming-languages/swift/operators.adoc`; builds cleanly (same expected
      forward-xref warnings only).
  - [x] Task 6.1. Assignment, arithmetic and remainder, compound assignment, comparison (including tuple
        comparison), ternary, nil-coalescing.
  - [x] Task 6.2. Closed/half-open/one-sided ranges, logical operators and short-circuiting, explicit
        parentheses, and the full precedence-group table. (TSPL: Basic Operators; Advanced Operators →
        Precedence and Associativity.) Link forward to
        `xref:programming-languages/swift/advanced-operators.adoc[]`.
- [x] Task 7. `strings-and-characters.adoc` — "Strings and Characters" — created at
      `modules/ROOT/pages/programming-languages/swift/strings-and-characters.adoc`; builds cleanly (same
      expected forward-xref warnings only).
  - [x] Task 7.1. String literals (multiline, special characters, extended delimiters), mutability, value
        semantics, `Character`, concatenation and interpolation.
  - [x] Task 7.2. Unicode scalars vs. extended grapheme clusters, counting, `String.Index` and why there is no
        integer indexing, inserting/removing, `Substring` and slicing, comparison and prefix/suffix equality, the
        UTF-8/UTF-16/scalar views, common `StringProtocol` operations. (TSPL: Strings and Characters; stdlib →
        Strings and Text.)
  - [x] Task 7.3. Add `modules/ROOT/images/swift-string-grapheme-clusters.svg` — a string as grapheme clusters
        over UTF-8 code units, with indices — and include it. Created and included with
        `image::swift-string-grapheme-clusters.svg[...]`.

### Group 4 — Language fundamentals II: collections, control flow, patterns, functions, closures (Parallelizable: yes)

- [x] Task 8. `collections.adoc` — "Collections" — created at
      `modules/ROOT/pages/programming-languages/swift/collections.adoc`; builds cleanly (same expected
      forward-xref warnings only, to not-yet-created sibling pages).
  - [x] Task 8.1. `Array`, `Set`, `Dictionary` (creation, access, mutation, iteration, set algebra, hash values),
        mutability via `let`/`var`, `ArraySlice` and slices, ranges as collections.
  - [x] Task 8.2. The `Sequence`/`Collection` protocol family and what each adds; the higher-order essentials
        (`map`, `filter`, `reduce`, `compactMap`, `flatMap`, `sorted`, `first(where:)`, `contains`), `lazy`,
        `zip`, `enumerated`, `stride`; and the fixed-size `InlineArray` and non-owning `Span` (**Swift 6.2**).
        (TSPL: Collection Types; stdlib → Collections.)
  - [x] Task 8.3. Add `modules/ROOT/images/swift-collection-protocol-hierarchy.svg` — `Sequence` → `Collection`
        → `BidirectionalCollection` → `RandomAccessCollection` / `MutableCollection` /
        `RangeReplaceableCollection` — and include it. Created and included with
        `image::swift-collection-protocol-hierarchy.svg[...]`.
- [x] Task 9. `control-flow.adoc` — "Control Flow" — created at
      `modules/ROOT/pages/programming-languages/swift/control-flow.adoc`; builds cleanly (same expected
      forward-xref warnings only).
  - [x] Task 9.1. `for-in` over ranges, collections, dictionaries and `stride`; `while` and `repeat-while`;
        `if`/`else` and `switch` as statements **and as expressions**; `if case`/`guard case`.
  - [x] Task 9.2. `switch` exhaustiveness, interval and tuple matching, value binding, `where`, compound cases,
        `@unknown default`; `continue`/`break`/`fallthrough`/labeled statements; `guard` early exit; `defer`;
        `#available`/`#unavailable`. (TSPL: Control Flow; Statements.)
- [x] Task 10. `pattern-matching.adoc` — "Pattern Matching" — created at
      `modules/ROOT/pages/programming-languages/swift/pattern-matching.adoc`; builds cleanly (same expected
      forward-xref warnings only).
  - [x] Task 10.1. The eight pattern kinds (wildcard, identifier, value-binding, tuple, enumeration case,
        optional, type-casting `is`/`as`, expression via `~=`) and where each may appear (`switch`, `if case`,
        `for case`, `while case`, `catch`).
  - [x] Task 10.2. Nested destructuring, custom `~=` overloads, matching against ranges and regular expressions.
        (TSPL: Patterns; Control Flow → Patterns.)
  - [x] Task 10.3. Add a `[mermaid]` diagram of how a `switch` evaluates its cases in order. Added as a
        `flowchart TD` block.
- [x] Task 11. `functions.adoc` — "Functions" — created at
      `modules/ROOT/pages/programming-languages/swift/functions.adoc`; builds cleanly (same expected
      forward-xref warnings only).
  - [x] Task 11.1. Definition and calling, parameters and return values (multiple returns via tuples, implicit
        return), argument labels vs. parameter names, default values, variadic parameters.
  - [x] Task 11.2. `inout` parameters and the copy-in copy-out model, `borrowing`/`consuming` parameter
        modifiers, function types as parameters/returns/values, nested functions, `@discardableResult`,
        overloading, and `rethrows`/`async`/`throws` signatures in outline. (TSPL: Functions; Declarations →
        Function Declaration.)
- [x] Task 12. `closures.adoc` — "Closures" — created at
      `modules/ROOT/pages/programming-languages/swift/closures.adoc`; builds cleanly (same expected
      forward-xref warnings only).
  - [x] Task 12.1. Closure expressions and the `sorted(by:)` progression (type inference, implicit return,
        shorthand `$0`, operator methods), trailing closures including multiple trailing closures.
  - [x] Task 12.2. Capturing values and reference semantics, escaping vs. non-escaping, autoclosures, capture
        lists (`[weak self]`, `[unowned self]`, value copies), `@Sendable` closures, closures vs. named
        functions. (TSPL: Closures; Attributes → `autoclosure`, `escaping`.)
  - [x] Task 12.3. Add `modules/ROOT/images/swift-closure-capture.svg` — a closure capturing a variable from an
        enclosing scope that has already returned — and include it. Created and included with
        `image::swift-closure-capture.svg[...]`.

### Group 5 — Types and object modelling I: enums, structs/classes, properties, methods (Parallelizable: yes)

- [x] Task 13. `enumerations.adoc` — "Enumerations" — created at
      `modules/ROOT/pages/programming-languages/swift/enumerations.adoc`; builds cleanly (only the expected
      forward-xref warnings to not-yet-created sibling Swift pages, resolved by the Group 16 build gate).
  - [x] Task 13.1. Enum syntax, matching with `switch`, `CaseIterable`, associated values (with labels and
        pattern extraction), raw values (implicit assignment, `init?(rawValue:)`), recursive enums with
        `indirect`.
  - [x] Task 13.2. Methods, computed properties and initializers on enums, enums as namespaces, `OptionSet`
        structs vs. enums, `Comparable` synthesis, enums as state machines. (TSPL: Enumerations; Declarations →
        Enumeration Declaration.)
  - [x] Task 13.3. Add a `[mermaid]` state-machine diagram modelled as an enum. Added as a `stateDiagram-v2`
        block.
- [x] Task 14. `structures-and-classes.adoc` — "Structures and Classes" — created at
      `modules/ROOT/pages/programming-languages/swift/structures-and-classes.adoc`; builds cleanly (same
      expected forward-xref warnings only).
  - [x] Task 14.1. Definition syntax, instances and property access, memberwise initializers, value types
        (structs and enums) vs. reference types (classes), identity operators `===`/`!==`, the official
        *Choosing Between Structures and Classes* guidance.
  - [x] Task 14.2. Copy-on-write and how to implement it with `isKnownUniquelyReferenced`; noncopyable types
        (`~Copyable`), `consume`/`borrowing`/`consuming`, and `deinit` on noncopyable structs. (TSPL: Structures
        and Classes; *Value and Reference Types*; SE-0390.)
  - [x] Task 14.3. Add `modules/ROOT/images/swift-value-vs-reference.svg` — value copy vs. reference sharing,
        then copy-on-write — and include it. Created and included with
        `image::swift-value-vs-reference.svg[...]`.
- [x] Task 15. `properties.adoc` — "Properties" — created at
      `modules/ROOT/pages/programming-languages/swift/properties.adoc`; builds cleanly (same expected
      forward-xref warnings only).
  - [x] Task 15.1. Stored properties (and constant struct instances), `lazy` stored properties, computed
        properties and shorthand getters/setters, read-only computed properties, property observers
        (`willSet`/`didSet`, including on inherited and lazy properties).
  - [x] Task 15.2. Property wrappers (declaring, `wrappedValue`, initial values, `projectedValue` and `$`),
        global and local variables, type properties (`static` vs. `class`), and the `Observation` module's
        `@Observable`. (TSPL: Properties; Observation.)
  - [x] Task 15.3. Add a `[mermaid]` diagram of the `willSet` → assignment → `didSet` order. Added as a
        `flowchart LR` block.
- [x] Task 16. `methods-and-subscripts.adoc` — "Methods and Subscripts" — created at
      `modules/ROOT/pages/programming-languages/swift/methods-and-subscripts.adoc`; builds cleanly (same
      expected forward-xref warnings only).
  - [x] Task 16.1. Instance methods and `self`, `mutating` methods on value types and assigning to `self`, type
        methods.
  - [x] Task 16.2. Subscripts (syntax, parameters with defaults, read-only, multi-parameter and
        multidimensional, type subscripts, subscripts in extensions), callable values via `callAsFunction`, and
        `@dynamicCallable`. (TSPL: Methods; Subscripts; Attributes → `dynamicCallable`.)

### Group 6 — Types and object modelling II: inheritance, initialization, extensions, protocols (Parallelizable: yes)

- [x] Task 17. `inheritance.adoc` — "Inheritance" — created at
      `modules/ROOT/pages/programming-languages/swift/inheritance.adoc`; builds cleanly (only the expected
      forward-xref warnings to not-yet-created sibling Swift pages — `index.adoc#_bibliography` and
      `type-casting-and-reflection.adoc` — resolved by the Group 16 build gate).
  - [x] Task 17.1. Base classes, subclassing, overriding methods/properties/observers and calling `super`,
        `final`, dynamic dispatch and polymorphism.
  - [x] Task 17.2. When to subclass vs. compose or use protocols — the OOP-design worked example and its known
        problems, as the motivation for protocol-oriented design; link forward to
        `xref:programming-languages/swift/protocols.adoc[]`. (TSPL: Inheritance.)
  - [x] Task 17.3. Add a `[mermaid]` class diagram of the small hierarchy used in the example. Added as a
        `classDiagram` block (Animal/Dog/Cat).
- [x] Task 18. `initialization-and-deinitialization.adoc` — "Initialization and Deinitialization" — created at
      `modules/ROOT/pages/programming-languages/swift/initialization-and-deinitialization.adoc`; builds cleanly
      (only the expected forward-xref warnings to `index.adoc#_bibliography` and
      `automatic-reference-counting.adoc`).
  - [x] Task 18.1. Setting initial values, initializer parameters and labels, optional properties, constants
        during initialization, default and memberwise initializers, initializer delegation for value types.
  - [x] Task 18.2. Designated vs. convenience initializers, the two-phase initialization rules and safety
        checks, initializer inheritance and overriding, `required`, failable initializers (`init?`, `init!`,
        enums with raw values), setting defaults with closures, and `deinit`. (TSPL: Initialization;
        Deinitialization.)
  - [x] Task 18.3. Add `modules/ROOT/images/swift-two-phase-initialization.svg` — designated/convenience
        delegation across a class hierarchy and the two phases — and include it. Created (hand-authored SVG,
        white background, Helvetica/Arial font-family, per house style) and included with
        `image::swift-two-phase-initialization.svg[...]`.
- [x] Task 19. `extensions-and-nested-types.adoc` — "Extensions and Nested Types" — created at
      `modules/ROOT/pages/programming-languages/swift/extensions-and-nested-types.adoc`; builds cleanly (only
      the expected forward-xref warnings to `index.adoc#_bibliography` and `access-control.adoc`).
  - [x] Task 19.1. Extension syntax; adding computed properties, initializers, methods (including `mutating`),
        subscripts and nested types; retroactive conformance and its `@retroactive` warning.
  - [x] Task 19.2. Organising a type across extensions, nested types for namespacing and scoped enums, referring
        to nested types. (TSPL: Extensions; Nested Types.)
- [x] Task 20. `protocols.adoc` — "Protocols" — created at
      `modules/ROOT/pages/programming-languages/swift/protocols.adoc`; builds cleanly (only the expected
      forward-xref warnings to `index.adoc#_bibliography`, `opaque-and-boxed-protocol-types.adoc`,
      `codable-and-serialization.adoc`, `memory-safety-and-unsafe-pointers.adoc`, `type-casting-and-reflection.adoc`
      and `generics.adoc`).
  - [x] Task 20.1. Protocol syntax; property, method, `mutating`, initializer and subscript requirements;
        protocols with only semantic requirements; protocols as types (`any P`, and when `any` is required);
        delegation.
  - [x] Task 20.2. Conformance via extensions, conditional conformance, synthesized
        `Equatable`/`Hashable`/`Comparable`/`Codable`; implicit conformance and suppressing it (`~Copyable`,
        `~Escapable`); collections of protocol types; protocol inheritance, class-only protocols (`AnyObject`),
        composition (`A & B`); checking conformance with `is`/`as?`; `@objc optional` requirements.
  - [x] Task 20.3. Protocol extensions with default implementations and constraints; protocol-oriented design
        with the standard library as a case study. (TSPL: Protocols; *Adopting Common Protocols*.)
  - [x] Task 20.4. Add a `[mermaid]` diagram of the protocol inheritance/composition graph for the worked
        example. Added as a `classDiagram` block (TextRepresentable/PrettyTextRepresentable/Hamster/Stack).

### Group 7 — Generics, opaque types and type casting (Parallelizable: yes)

- [x] Task 21. `generics.adoc` — "Generics" — created at
      `modules/ROOT/pages/programming-languages/swift/generics.adoc`; builds cleanly (only the expected
      forward-xref warnings to not-yet-created sibling Swift pages — `index.adoc#_bibliography` — resolved by
      the Group 16 build gate).
  - [x] Task 21.1. The problem generics solve, generic functions and types, type parameters and naming,
        extending generic types, type constraints.
  - [x] Task 21.2. Associated types (with constraints and `where`), generic `where` clauses on declarations,
        extensions and contextual positions, generic subscripts, implicit constraints (`Copyable`), integer
        generic parameters (**Swift 6.2**, `InlineArray<3, Int>`), and `some P` as lightweight generic-parameter
        syntax. (TSPL: Generics; Generic Parameters and Arguments.)
  - [x] Task 21.3. Added `modules/ROOT/images/swift-generic-instantiation.svg` — how a generic `Stack<Element>` is
        instantiated for `Int` and `String` — and included it.
- [x] Task 22. `opaque-and-boxed-protocol-types.adoc` — "Opaque and Boxed Protocol Types" — created at
      `modules/ROOT/pages/programming-languages/swift/opaque-and-boxed-protocol-types.adoc`; builds cleanly
      (only the expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 22.1. The problem opaque types solve, returning `some P`, boxed protocol (existential) types
        `any P` and their runtime cost, the differences (type identity, associated types, `Self` requirements).
  - [x] Task 22.2. Opaque parameter types, implicitly opened existentials, and choosing between `some`, `any`
        and explicit generics. (TSPL: Opaque and Boxed Protocol Types; SE-0335, SE-0352.)
  - [x] Task 22.3. Added `modules/ROOT/images/swift-some-vs-any.svg` — `some` (static type, hidden) vs. `any`
        (existential box) — and included it.
- [x] Task 23. `type-casting-and-reflection.adoc` — "Type Casting and Reflection" — created at
      `modules/ROOT/pages/programming-languages/swift/type-casting-and-reflection.adoc`; builds cleanly (only
      the expected forward-xref warnings — `index.adoc#_bibliography`, `foundation-essentials.adoc`,
      `interoperability-with-c-objective-c-and-cpp.adoc`, `codable-and-serialization.adoc`).
  - [x] Task 23.1. `is`, `as?`, `as!`, upcasting with `as`, `Any` vs. `AnyObject`, casting in `switch`,
        metatypes (`T.Type`, `.self`, `type(of:)`), `Self`, bridging casts to Foundation types.
  - [x] Task 23.2. Reflection with `Mirror` (`children`, `displayStyle`, `CustomReflectable`, a serializer built
        on reflection), `dump`, `CustomStringConvertible`/`CustomDebugStringConvertible`. (TSPL: Type Casting;
        stdlib → Type Casting and Existential Types, Debugging and Reflection.)

### Group 8 — Errors, safety and memory (Parallelizable: yes)

- [x] Task 24. `error-handling.adoc` — "Error Handling" — created at
      `modules/ROOT/pages/programming-languages/swift/error-handling.adoc`; builds cleanly (only the expected
      forward-xref warnings to not-yet-created sibling Swift pages — `index.adoc#_bibliography`,
      `async-await-and-tasks.adoc`, `interoperability-with-c-objective-c-and-cpp.adoc` — resolved by the
      Group 16 build gate).
  - [x] Task 24.1. The `Error` protocol and representing errors with enums/structs, `throw`, the four ways to
        handle (`throws` propagation, `do`/`catch` with patterns and multi-pattern `catch`, `try?`, `try!`).
  - [x] Task 24.2. Typed throws (`throws(MyError)`, **Swift 6**), `rethrows`, `Result<Success, Failure>` and
        converting between throwing and `Result`, `LocalizedError`/`CustomNSError`, `defer` for cleanup, errors
        in `async` code, and errors vs. `fatalError`/`precondition`/`assert`. (TSPL: Error Handling; SE-0413.)
  - [x] Task 24.3. Added a `[mermaid]` decision diagram: choosing between `Optional`, `Result`, `throws` and a
        trap.
- [x] Task 25. `automatic-reference-counting.adoc` — "Automatic Reference Counting" — created at
      `modules/ROOT/pages/programming-languages/swift/automatic-reference-counting.adoc`; builds cleanly (only
      the expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 25.1. How ARC works, strong references in action, strong reference cycles between class instances
        and resolving them with `weak` and `unowned` (including unowned optional references and the
        IUO-property pattern).
  - [x] Task 25.2. Strong reference cycles in closures and capture lists, `weak` vs. `unowned` decision
        guidance, and diagnosing leaks (Xcode Memory Graph, Instruments). (TSPL: Automatic Reference Counting.)
  - [x] Task 25.3. Added `modules/ROOT/images/swift-retain-cycle.svg` — a retain cycle and how `weak` breaks it
        (hand-authored SVG, white background, Helvetica/Arial font-family, per house style) — and included it
        with `image::swift-retain-cycle.svg[...]`.
- [x] Task 26. `memory-safety-and-unsafe-pointers.adoc` — "Memory Safety and Unsafe Pointers" — created at
      `modules/ROOT/pages/programming-languages/swift/memory-safety-and-unsafe-pointers.adoc`; builds cleanly
      (only the expected forward-xref warning to
      `interoperability-with-c-objective-c-and-cpp.adoc` and `index.adoc#_bibliography`).
  - [x] Task 26.1. Conflicting access to memory, the exclusivity rules for `inout` parameters, `self` in
        mutating methods and struct properties, compile-time vs. run-time enforcement.
  - [x] Task 26.2. The unsafe layer: `UnsafePointer`/`UnsafeMutablePointer`/raw and buffer pointers,
        `withUnsafeBytes`/`withUnsafeMutablePointer`, `Unmanaged`, temporary allocations, and the safe
        non-owning alternatives `Span`/`RawSpan` (**Swift 6.2**). (TSPL: Memory Safety; stdlib → Manual Memory
        Management; SE-0447.)
  - [x] Task 26.3. Added `modules/ROOT/images/swift-exclusive-access.svg` — overlapping write/read access on an
        `inout` argument (hand-authored SVG, white background, Helvetica/Arial font-family, per house style) —
        and included it with `image::swift-exclusive-access.svg[...]`.
- [x] Task 27. `access-control.adoc` — "Access Control" — created at
      `modules/ROOT/pages/programming-languages/swift/access-control.adoc`; builds cleanly (only the expected
      forward-xref warnings to not-yet-created sibling Swift pages — `index.adoc#_bibliography`,
      `swift-package-manager.adoc` — resolved by the Group 16 build gate).
  - [x] Task 27.1. Modules, source files and packages; the six levels (`open`, `public`, `package`, `internal`,
        `fileprivate`, `private`); the guiding principle and defaults; access levels for apps, frameworks and
        test targets (`@testable`).
  - [x] Task 27.2. Access levels for custom types, tuples, functions, enums, nested types, subclassing,
        properties and getters/setters (`private(set)`), initializers, protocols and conformance, extensions and
        private members, generics, type aliases; and best practices. (TSPL: Access Control.)

### Group 9 — Concurrency (Parallelizable: yes)

- [x] Task 28. `async-await-and-tasks.adoc` — "Async/Await and Tasks" — created at
      `modules/ROOT/pages/programming-languages/swift/async-await-and-tasks.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`, resolved by the Group 16 build gate).
  - [x] Task 28.1. Asynchronous functions and `await` suspension points, calling from synchronous code,
        asynchronous sequences (`AsyncSequence`, `for await`, `AsyncStream`), calling asynchronous functions in
        parallel with `async let`.
  - [x] Task 28.2. Structured concurrency with `Task` and `withTaskGroup`/`withThrowingTaskGroup`, task
        cancellation (`checkCancellation`, `isCancelled`, `withTaskCancellationHandler`), unstructured and
        detached tasks, task priorities and naming, task-local values, and bridging completion handlers with
        continuations. Flagged `withTaskCancellationShield` as **6.4-beta only** in an `[IMPORTANT]` callout.
        (TSPL: Concurrency; stdlib → Concurrency.)
  - [x] Task 28.3. Added a `[mermaid]` sequence diagram of a task group fanning out (3 child tasks) and
        collecting results in completion order.
- [x] Task 29. `actors-isolation-and-sendable.adoc` — "Actors, Isolation and Sendable" — created at
      `modules/ROOT/pages/programming-languages/swift/actors-isolation-and-sendable.adoc`; builds cleanly (only
      the expected forward-xref warnings to `index.adoc#_bibliography`, `build-and-tooling.adoc` (x2) and
      `swift-package-manager.adoc`, resolved by the Group 16 build gate).
  - [x] Task 29.1. Data races and what Swift 6 guarantees, isolation domains, the main actor and `@MainActor`,
        actors (`actor`, actor-isolated state, cross-actor `await`, reentrancy, `nonisolated`, `isolated`
        parameters), global actors.
  - [x] Task 29.2. `Sendable` and `@Sendable` closures, sending values across isolation boundaries (`sending`),
        `@unchecked Sendable` and `@preconcurrency`, strict concurrency checking and the Swift 6 language mode,
        default actor isolation (**Swift 6.2**), the `Synchronization` module (`Mutex`, `Atomic`), and the
        *Migrating to Swift 6* guide. Noted Swift 5 language-mode differences explicitly in their own section.
        (TSPL: Concurrency → Isolation, The Main Actor, Actors, Global Actors, Sendable Types; Migrating to
        Swift 6.)
  - [x] Task 29.3. Added `modules/ROOT/images/swift-isolation-domains.svg` — three isolation domains (main
        actor, a `BankAccount` actor, non-isolated concurrent code) with a `Sendable` value crossing in and a
        result crossing back — and included it.
- [x] Task 30. `dispatch-and-legacy-concurrency.adoc` — "Dispatch and Legacy Concurrency" — created at
      `modules/ROOT/pages/programming-languages/swift/dispatch-and-legacy-concurrency.adoc`; builds cleanly
      (only the expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 30.1. Concurrency vs. parallelism; Grand Central Dispatch (serial and concurrent queues, `async`
        vs. `sync`, the main queue, `asyncAfter`, `DispatchGroup`, `DispatchWorkItem`, barriers, semaphores,
        quality of service).
  - [x] Task 30.2. `Operation`/`OperationQueue` with dependencies, when to still use them, and how to wrap them
        for `async`/`await`. (Dispatch and Foundation references.)
  - [x] Task 30.3. Added a `[mermaid]` sequence diagram: background work dispatched back to the main queue.

### Group 10 — Advanced language features (Parallelizable: yes)

- [x] Task 31. `advanced-operators.adoc` — "Advanced Operators" — created at
      `modules/ROOT/pages/programming-languages/swift/advanced-operators.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`, resolved by the Group 16 build gate).
  - [x] Task 31.1. Bits and bytes, endianness, bitwise NOT/AND/OR/XOR and shifts (unsigned and signed), overflow
        operators `&+`/`&-`/`&*` and `addingReportingOverflow`.
  - [x] Task 31.2. Precedence and associativity, operator methods on custom types (prefix/postfix, compound
        assignment, `==` and `Equatable`), custom operators and precedence groups, and the
        `BinaryInteger`/`FixedWidthInteger` protocol tools. (TSPL: Advanced Operators; Declarations → Operator /
        Precedence Group Declaration.)
- [x] Task 32. `result-builders.adoc` — "Result Builders" — created at
      `modules/ROOT/pages/programming-languages/swift/result-builders.adoc`; builds cleanly (only the expected
      forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 32.1. `@resultBuilder`, `buildBlock`, `buildOptional`/`buildEither`, `buildArray`,
        `buildExpression`, `buildPartialBlock`, `buildFinalResult`, and how the compiler rewrites a builder body.
  - [x] Task 32.2. Building a small DSL (e.g. an HTML or validation builder) and how SwiftUI's `ViewBuilder`
        uses it — named only as an illustration, since SwiftUI itself is out of scope. (TSPL: Advanced Operators
        → Result Builders; Attributes → `resultBuilder`; SE-0289.)
  - [x] Task 32.3. Added a `[mermaid]` diagram of the transformation from builder body to `buildBlock`/
        `buildPartialBlock`/`buildFinalResult` calls.
- [x] Task 33. `key-paths-and-dynamic-member-lookup.adoc` — "Key Paths and Dynamic Member Lookup" — created at
      `modules/ROOT/pages/programming-languages/swift/key-paths-and-dynamic-member-lookup.adoc`; builds cleanly
      (only the expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 33.1. Key-path expressions and the
        `KeyPath`/`WritableKeyPath`/`ReferenceWritableKeyPath`/`PartialKeyPath`/`AnyKeyPath` hierarchy, reading
        and writing through key paths, key paths as functions (`map(\.name)`), appending key paths.
  - [x] Task 33.2. `@dynamicMemberLookup` with string and key-path members, and combining the two for type-safe
        wrappers. (TSPL: Expressions → Key-Path Expression; Attributes → `dynamicMemberLookup`; stdlib →
        Key-Path Expressions.)
- [x] Task 34. `regular-expressions.adoc` — "Regular Expressions" — created at
      `modules/ROOT/pages/programming-languages/swift/regular-expressions.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 34.1. Regex syntax refresher (literals, metacharacters, quantifiers, anchors, character classes,
        groups, assertions), regex literals `/…/` and extended `#/…/#`, the `Regex` type and run-time
        construction.
  - [x] Task 34.2. `firstMatch`/`matches`/`wholeMatch`/`contains`/`replacing`/`split`, typed captures, and the
        `RegexBuilder` DSL (`Capture`, `TryCapture`, `One`/`OneOrMore`/`ZeroOrMore`, `ChoiceOf`, `Repeat`,
        transforms). (TSPL: Lexical Structure → Regular Expression Literals; stdlib `Regex`; RegexBuilder;
        SE-0350/0351/0354.)
- [x] Task 35. `macros.adoc` — "Macros" — created at
      `modules/ROOT/pages/programming-languages/swift/macros.adoc`; builds cleanly (only the expected
      forward-xref warnings to not-yet-created sibling Swift pages — `index.adoc#_bibliography`,
      `swift-package-manager.adoc`, `testing.adoc` — resolved by the Group 16 build gate).
  - [x] Task 35.1. Freestanding (`#…`) and attached (`@…`) macros, the built-in ones (`#expect`, `#Predicate`,
        `@Observable`, `@Test`), macro declarations and roles, macro expansion and its hygiene guarantees.
  - [x] Task 35.2. Implementing a macro in a package with swift-syntax and `CompilerPlugin`, expanding and
        debugging macros in Xcode/SwiftPM, and testing macros. (TSPL: Macros; stdlib → Macros; swift-syntax.)
  - [x] Task 35.3. Added a `[mermaid]` diagram of how a macro package (client / declaration / plugin targets) is
        compiled and plugged into the compiler.
- [x] Task 36. `attributes-and-compiler-control.adoc` — "Attributes and Compiler Control" — created at
      `modules/ROOT/pages/programming-languages/swift/attributes-and-compiler-control.adoc`; builds cleanly
      (only the expected forward-xref warnings to not-yet-created sibling Swift pages —
      `index.adoc#_bibliography`, `interoperability-with-c-objective-c-and-cpp.adoc`, `testing.adoc` — resolved
      by the Group 16 build gate).
  - [x] Task 36.1. The declaration attributes that matter day to day (`@available` and its
        platform/version/deprecation forms, `@discardableResult`, `@main`, `@frozen`,
        `@inlinable`/`@usableFromInline`, `@backDeployed`, `@objc`/`@objcMembers`/`@nonobjc`, `@preconcurrency`,
        `@testable`, `@dynamicMemberLookup`, `@propertyWrapper`, `@resultBuilder`, `@globalActor`) and type
        attributes (`@escaping`, `@autoclosure`, `@Sendable`, `@convention`).
  - [x] Task 36.2. `@unknown default`; declaration modifiers (`final`, `static`/`class`, `override`, `required`,
        `lazy`, `weak`/`unowned`, `indirect`, `nonisolated`, `mutating`/`nonmutating`, `optional`, `dynamic`);
        conditional compilation (`#if os()`/`arch()`/`swift()`/`compiler()`/`canImport()`/`hasFeature()`);
        `#warning`/`#error`; `#file`/`#line`/`#function`; `#available`/`#unavailable`. (TSPL: Attributes;
        Declarations → Declaration Modifiers; Statements → Compiler Control Statements.)
- [x] Task 37. `functional-programming.adoc` — "Functional Programming" — created at
      `modules/ROOT/pages/programming-languages/swift/functional-programming.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 37.1. Immutability with `let` and value types, pure functions, first-class and higher-order
        functions, function composition and custom composition operators, currying and partial application,
        recursion.
  - [x] Task 37.2. `map`/`filter`/`reduce` pipelines and `lazy`, `Optional` and `Result` as containers with
        `map`/`flatMap`, and where functional style meets protocols and actors. (TSPL: Closures, Functions.)

### Group 11 — Standard library, Foundation and interoperability (Parallelizable: yes)

- [x] Task 38. `standard-library-overview.adoc` — "Standard Library Overview" — created at
      `modules/ROOT/pages/programming-languages/swift/standard-library-overview.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`, resolved by the Group 16 build gate).
  - [x] Task 38.1. A map of the `Swift` module: numeric protocols (`Numeric`, `BinaryInteger`, `FloatingPoint`),
        `Equatable`/`Hashable`/`Comparable`/`Identifiable`, the `CustomStringConvertible` family, the
        `ExpressibleBy…Literal` protocols for custom literal syntax.
  - [x] Task 38.2. `Sequence`/`Collection` and iterators, `Optional`/`Result`, ranges and `Stride`,
        `print`/`readLine`, random numbers, `Codable` in overview (detail deferred to Task 39), `Never`, and the
        official *Adopting Common Protocols* guidance. Flagged `UniqueArray`/`Ref` as **6.4-beta only** in an
        `[IMPORTANT]` callout. (stdlib → Swift Standard Library, Basic Behaviors, Initialization with Literals,
        Input and Output.)
- [x] Task 39. `codable-and-serialization.adoc` — "Codable and Serialization" — created at
      `modules/ROOT/pages/programming-languages/swift/codable-and-serialization.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 39.1. `Encodable`/`Decodable`/`Codable`, synthesized conformance and `CodingKeys`,
        `JSONEncoder`/`JSONDecoder` and their key/date/data strategies.
  - [x] Task 39.2. Custom `init(from:)`/`encode(to:)` with keyed, unkeyed and single-value containers, nested
        containers, polymorphic and enum-with-associated-values encoding, `PropertyListEncoder`, and parsing XML
        with Foundation's `XMLParser`. (stdlib → Encoding, Decoding, and Serialization; Foundation.)
- [x] Task 40. `foundation-essentials.adoc` — "Foundation Essentials" — created at
      `modules/ROOT/pages/programming-languages/swift/foundation-essentials.adoc`; builds cleanly (only the
      expected forward-xref warning to `index.adoc#_bibliography`).
  - [x] Task 40.1. What Foundation adds and the cross-platform swift-foundation; `Date`, `Calendar`,
        `DateComponents`, `Date.FormatStyle`/`DateFormatter`, `TimeZone`/`Locale`, `Measurement`.
  - [x] Task 40.2. `URL`, `Data`, `FileManager` and file I/O, `URLSession` with `async`/`await`, `UUID`,
        `NotificationCenter`, `NumberFormatter`, and bridging between Swift and `NS` types. (Foundation
        reference; swift-foundation.)
- [x] Task 41. `interoperability-with-c-objective-c-and-cpp.adoc` — "Interoperability with C, Objective-C and {cpp}"
      — created at
      `modules/ROOT/pages/programming-languages/swift/interoperability-with-c-objective-c-and-cpp.adoc`; builds
      cleanly (only the expected forward-xref warnings to `index.adoc#_bibliography` and
      `swift-package-manager.adoc` (x2), resolved by the Group 16 build gate).
  - [x] Task 41.1. How the Clang importer maps C types, structs, unions, functions, pointers and macros into
        Swift; module maps and system-library targets in SwiftPM.
  - [x] Task 41.2. Objective-C interop (bridging headers, `@objc`/`@objcMembers`, `NS_SWIFT_NAME`, nullability
        and lightweight generics as seen from Swift, calling Objective-C completion-handler APIs as `async`,
        exposing Swift to Objective-C); {cpp} interop (`-cxx-interoperability-mode=default`, importing {cpp}
        classes, references, containers and templates, exposing Swift to {cpp}). (stdlib → C Interoperability;
        *Imported C and Objective-C APIs*; *Mixing Swift and {cpp}*.)
  - [x] Task 41.3. Added `xref:` cross-references to the **C Reference**
        (`xref:programming-languages/c/index.adoc[]`, `c/pointers.adoc`, `c/structures-unions-and-type-aliases.adoc`,
        `c/preprocessor-and-macros.adoc`), the **{cpp} Reference** (`xref:programming-languages/cpp/index.adoc[]`,
        `cpp/templates.adoc`, `cpp/containers.adoc`, `cpp/memory-management-and-smart-pointers.adoc`) and the
        **Objective-C Reference** (`xref:programming-languages/objective-c/index.adoc[]`, in particular
        `swift-interoperability.adoc` and `lightweight-generics-and-nullability.adoc`) instead of re-documenting
        those languages — all target files verified to exist on disk before linking, and confirmed resolving
        with zero xref errors in the build. This satisfies issue #111's fifth acceptance criterion.
  - [x] Task 41.4. Added `modules/ROOT/images/swift-interop.svg` — how Swift, C, {cpp} and Objective-C see each
        other within one build target — and included it.

### Group 12 — Tooling and testing (Parallelizable: yes)

- [x] Task 42. `swift-package-manager.adoc` — "Swift Package Manager" — created at
      `modules/ROOT/pages/programming-languages/swift/swift-package-manager.adoc` with the disclaimer include;
      `npx antora antora-playbook.yml` builds cleanly (only the expected, pre-existing
      `index.adoc#_bibliography` unresolved-xref errors shared by every Swift page, resolved at the Group 16
      gate once Group 13 adds `index.adoc`).
  - [x] Task 42.1. `Package.swift` and `PackageDescription` (swift-tools-version, products, targets, test
        targets, dependencies with version rules, conditions, resources, plugins, macro targets, system-library
        targets).
  - [x] Task 42.2. The `swift build`/`run`/`test`/`package` commands, `Package.resolved`, local and registry
        dependencies, the `package` access level, `swift-format` integration, and publishing a package. (SwiftPM
        documentation; PackageDescription.)
  - [x] Task 42.3. Added a `[mermaid]` products → targets → dependencies graph of an example package.
- [x] Task 43. `build-and-tooling.adoc` — "Build and Tooling" — created at
      `modules/ROOT/pages/programming-languages/swift/build-and-tooling.adoc`; build verified clean alongside
      Task 42/44 (same expected bibliography-xref-only errors).
  - [x] Task 43.1. `swiftc` essentials (`-swift-version`, `-O`/`-Osize`, `-enable-upcoming-feature`,
        `-strict-concurrency`, `-warnings-as-errors`), language modes vs. compiler versions, Swiftly toolchain
        management, Xcode and the VS Code extension / SourceKit-LSP.
  - [x] Task 43.2. Cross-platform builds (Linux and the static Linux SDK, Windows, WebAssembly, Android,
        Embedded Swift — each in one paragraph linking its official guide), debugging with LLDB (`po`, `expr`,
        `frame variable`, breakpoints), reading compiler diagnostics, DocC documentation comments and
        `swift package generate-documentation`, and `swift-format`. (Swift compiler; Swiftly; VS Code extension;
        platform guides; diagnostics; LLDB; DocC.)
- [x] Task 44. `testing.adoc` — "Testing" — created at
      `modules/ROOT/pages/programming-languages/swift/testing.adoc`; build verified clean alongside Task 42/43
      (same expected bibliography-xref-only errors).
  - [x] Task 44.1. **Swift Testing** (`@Test`, `#expect`, `#require`, `@Suite`, parameterized tests, traits —
        `.tags`, `.enabled(if:)`, `.disabled`, `.timeLimit`, `.serialized` —, `confirmation` for callbacks, exit
        tests, known issues, attachments, running with `swift test` and in Xcode).
  - [x] Task 44.2. **XCTest** (`XCTestCase`, `setUp`/`tearDown`, the `XCTAssert…` family, `XCTestExpectation`,
        `measure`, and the official migration guide from XCTest to Swift Testing), `@testable import`, and a
        pointer to UI testing with XCUITest as Apple-platform-only. (Swift Testing documentation; XCTest
        reference.)

### Group 13 — Landing page and cheat-sheet page (Parallelizable: yes)

Depends on Groups 2–12: both pages enumerate and cross-reference every topic page by its final title.

- [x] Task 45. `index.adoc` — "Swift Reference" landing page — created at
      `modules/ROOT/pages/programming-languages/swift/index.adoc`, modelled on `csharp/index.adoc`; the grouping
      into 10 sections (Getting started; Language fundamentals; Types and object modelling; Errors, safety and
      memory; Concurrency; Advanced language features; Standard library and Foundation; Interoperability;
      Tooling and testing; Reference) was derived from the issue's own page-outline headings, since
      `nav-swift.adoc` does not exist yet (it lands in Group 15); all 43 actual files on disk under
      `modules/ROOT/pages/programming-languages/swift/` (verified via `ls`) were cross-referenced by title, one
      bullet each. `npx antora antora-playbook.yml` builds clean for this page (zero xref/AsciiDoc errors).
  - [x] Task 45.1. Title/description/keywords + disclaimer include; one paragraph on what Swift is; a "New
        here? read in this order" pointer (Getting Started → Language fundamentals → Types and object modelling
        → the rest as needed); and a short paragraph on the relationship to the C, {cpp} and Objective-C
        references.
  - [x] Task 45.2. `== What's covered` — one bullet per page with a one-line summary, grouped under the same 10
        section headings named above (43 bullets total, matching the 43 files on disk exactly).
  - [x] Task 45.3. `== Bibliography` (anchored `[[_bibliography]]`) — every source listed in issue #111's
        Bibliography section, all linked: TSPL (with its *Document Revision History*); the Swift Documentation
        hub and every DocC archive it names (standard library, Swift Testing, SwiftPM, PackageDescription,
        DocC, Swiftly, VS Code extension, the Linux/Windows/WebAssembly/Android/Apple-platforms/Embedded
        guides, compiler diagnostics, Migrating to Swift 6); the swift.org pages (About, Getting Started,
        Install, API Design Guidelines, Mixing Swift and {cpp}, Swift Concurrency, Swift on Server, The Swift
        Compiler, LLDB, Value and Reference Types, and the 6 / 6.1 / 6.2 / 6.3 release announcements); Swift
        Evolution; the swiftlang tooling repositories (swift-syntax, swift-format, swift-testing,
        swift-package-manager, swift-docc, swift-foundation); the Apple framework references (Foundation,
        Dispatch, XCTest, Xcode → Writing documentation, and the three Objective-C interop pages); and the two
        Packt books as consulted references — Hoffman, *Mastering Swift 6* (7th ed., 2025, ISBN
        978-1-83620-369-8) and Moon/Barker/Bolella/Lawlor, *Swift Cookbook* (3rd ed., 2024, ISBN
        978-1-80323-958-3) — each linked to its publisher page, packtpub.com, and its code repository, never as
        a page's primary source. This resolves the `index.adoc#_bibliography` anchor that every Swift page's
        disclaimer partial links to — the one previously-outstanding broken xref across the whole site.
  - [x] Task 45.4. Closed the bibliography with the house-style note that the two books are consulted
        references: on any discrepancy, or wherever they are silent on a post-publication feature, TSPL and
        docs.swift.org win.
- [x] Task 46. `cheat-sheet.adoc` — "Swift Cheat Sheet" — created at
      `modules/ROOT/pages/programming-languages/swift/cheat-sheet.adoc`, modelled on `csharp/cheat-sheet.adoc`;
      build verified clean for this page except the one expected forward-reference error below.
  - [x] Task 46.1. Short description of what the sheet covers, mirroring
        `programming-languages/c/cheat-sheet.adoc`'s structure.
  - [x] Task 46.2. Grouped cross-references to every topic page (same 10-way grouping as Task 45.2, minus the
        Reference group which only lists the cheat sheet itself).
  - [x] Task 46.3. The download link:
        `xref:attachment$swift-cheat-sheet.pdf[Download the Swift Cheat Sheet (PDF)]` — added as specified.
        `npx antora antora-playbook.yml` reports exactly one error for the whole site,
        `target of xref not found: attachment$swift-cheat-sheet.pdf` on this page, which is the expected
        forward reference to the PDF Group 14 has not generated yet; every other xref across the site
        (including every Swift page's `index.adoc#_bibliography` disclaimer link) now resolves with zero
        warnings/errors.

### Group 14 — Cheat-sheet PDF (Parallelizable: yes)

Depends on Group 13: the sheet's contents must match what `cheat-sheet.adoc` says it covers.

- [x] Task 47. Produce `modules/ROOT/attachments/swift-cheat-sheet.pdf` — one A4 page (595x842 pt),
      26 colour-coded boxes across 4 balanced columns, rendered from a throwaway HTML/CSS layout in the
      scratch directory with headless Google Chrome 153. No tests/coverage apply (content-only plan);
      verification was a clean `npx antora antora-playbook.yml` build (exit 0, no warnings) plus a
      page-count and clipping check on the PDF.
  - [x] Task 47.1. Author a throwaway print-ready A4 HTML/CSS layout (scratch directory, **not** checked in),
        visually consistent with `c-cheat-sheet.pdf`/`kotlin-cheat-sheet.pdf`: dense multi-column colour-coded
        boxes, a header line and a breadcrumb footer.
  - [x] Task 47.2. Cover, per issue #111: `let`/`var` and basic types; optionals (`if let`, `guard let`, `??`,
        `?.`, `!`); strings and interpolation; `Array`/`Set`/`Dictionary` one-liners and the higher-order
        functions; control flow (`for`, `while`, `if`/`switch` expressions, `guard`, `defer`, patterns);
        functions and closures (labels, `inout`, trailing closures, `$0`, capture lists); enums with
        associated/raw values; a struct vs. class table; properties (computed, `lazy`, observers, wrappers);
        initializers (designated/convenience/failable); protocols and extensions; generics and `some`/`any`;
        error handling (`throws`, `do`/`catch`, `try?`, typed throws, `Result`); ARC (`weak`/`unowned`); an
        access-levels table; concurrency (`async`/`await`, `Task`, task groups, `actor`, `@MainActor`,
        `Sendable`); regex and key-path one-liners; macros; an attributes quick list; a `Package.swift`
        skeleton; Swift Testing / XCTest snippets; and the `swift`/`swiftc` command lines.
  - [x] Task 47.3. **Locate a headless-capable browser first** (see choice 7): check for a local
        Chrome/Chromium (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`,
        `/Applications/Chromium.app/...`, `which chromium google-chrome`), else run `npx playwright install
        chromium` and use its binary. Then render with e.g.
        `--headless --print-to-pdf=… --no-pdf-header-footer --print-to-pdf-no-header`, saving to
        `modules/ROOT/attachments/swift-cheat-sheet.pdf`. If no browser can be obtained, stop and report it
        rather than checking in a placeholder.
  - [x] Task 47.4. Verify it is **exactly one A4 page** with no clipped content (page-count check plus a
        rendered preview); iterate on layout density until it is.
        Verified: `file` reports "1 pages", `pdfinfo` reports `Pages: 1` / `Page size: 594.96 x 841.92 pts
        (A4)`, `pdftoppm` enumerates exactly one page, and `pdftotext -f 2` errors with "the first page (2)
        can not be after the last page (1)". No clipping: a DOM probe over all 26 boxes at the exact print
        content width (752.4px) reports no element exceeding its box on either axis, and the rendered page was
        inspected visually at 150 dpi plus 240 dpi edge crops. One real clipping defect found this way (the
        Macros note's long `@attached(...)` token overflowed its box) was fixed with `overflow-wrap: anywhere`.
        Density was tuned to `--fs: 4.10pt`; the layout uses explicit flex columns rather than CSS multicol,
        which paginated unstably near the fit boundary.

### Group 15 — Site wiring (Parallelizable: yes)

Depends on Groups 2–14: the nav partial lists every page, and the index bullet describes the finished section.

- [x] Task 48. Nav partial and `nav.adoc` include
  - [x] Task 48.1. Create `modules/ROOT/partials/nav-swift.adoc` modelled exactly on `nav-c.adoc`: a single
        `* xref:programming-languages/swift/index.adoc[Swift Reference]` followed by one `**` entry per page in
        the Group 2–12 order above, ending with
        `** xref:programming-languages/swift/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use the depth-agnostic
        `*`/`**` levels — never absolute `***`/`****` — so the partial stays includable from any depth.
  - [x] Task 48.2. Include it in `modules/ROOT/nav.adoc` **inside the same open block (`--`)**, appended
        **after `include::partial$nav-csharp.adoc[]`** (append-order convention — `nav-csharp.adoc` is currently
        last in that block).
- [x] Task 49. Add the "Swift Reference" bullet to `modules/ROOT/pages/programming-languages/index.adoc`
  - [x] Task 49.1. Append a bullet to the `== Sections` list in the same style as the existing eight (an
        `xref:` link plus a one-sentence summary ending "…plus a downloadable cheat sheet"), extend the page's
        own `:description:`/`:keywords:` to mention Swift, and add Swift to the intro paragraph's "C, {cpp},
        Objective-C and C# have no such secondary home and live only here" sentence.
  - [x] Task 49.2. While here, fix the stray blank line that currently separates the Objective-C and C# bullets
        (it splits the list into two `<ul>`s in the rendered output) so the new nine-bullet list renders as one
        list.
- [x] Task 50. Extend the root `modules/ROOT/pages/index.adoc` keywords
  - [x] Task 50.1. Append `Swift, Swift 6, Swift Package Manager, Swift Testing` to the `:keywords:` line
        (line 3), preserving the existing order and formatting. Do not add a project-picker tile or image
        (see choice 6).

**Group 15 completed.** Files touched: `modules/ROOT/partials/nav-swift.adoc` (new: 1 `*` section entry +
44 `**` entries = 43 topic pages + `cheat-sheet.adoc`, depth-agnostic levels, ordered to match the landing
page's 10-way `== What's covered` grouping), `modules/ROOT/nav.adoc` (include appended last inside the
existing `--` open block, immediately after `nav-csharp.adoc`),
`modules/ROOT/pages/programming-languages/index.adoc` (ninth `Swift Reference` bullet, `:description:` and
`:keywords:` extended, intro "live only here" sentence now lists Swift, stray blank line between the
Objective-C and C# bullets removed so the list renders as one `<ul>`),
`modules/ROOT/pages/index.adoc` (`:keywords:` only — no project-picker tile, per choice 6).
Verification: `npx antora antora-playbook.yml` completed with **zero AsciiDoc/xref warnings and zero
errors** (empty build log, exit 0, verified on both a fresh and an incremental build). Rendered nav confirmed:
45 Swift links under *Guides & References -> Programming Languages*, positioned after C# and before
Databases; `{cpp}` resolves to `C++` in the interoperability label. No tests/coverage/code-quality tooling
applies (content-only AsciiDoc authoring).

### Group 16 — Build and final verification (Parallelizable: no — Task 52 verifies the output Task 51 must first make clean)

- [x] Task 51. Build the site and drive it to zero warnings — `npx antora antora-playbook.yml` completed with an
      empty log (exit 0): zero AsciiDoc/xref warnings or errors. `build/site/programming-languages/swift/` holds
      45 HTML pages and `build/site/_attachments/swift-cheat-sheet.pdf` resolves.
  - [x] Task 51.1. Delegate the build to the `iru-gate-runner` agent so its output doesn't consume the main
        context, e.g.
        `Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Run `npx antora antora-playbook.yml` at the repository root and report only: whether the build completed, and every AsciiDoc/xref warning or error with its file and line. Do not paste the full build log."})`.
  - [x] Task 51.2. Confirm **zero** `xref`/AsciiDoc warnings or errors — in particular no unresolved
        `xref:programming-languages/swift/*` targets, no unresolved `xref:` into `c/`, `cpp/` or `objective-c/`
        from Task 41.3, no missing `attachment$swift-cheat-sheet.pdf`, and no missing
        `modules/ROOT/images/swift-*.svg`. Fix and re-run until clean.
- [x] Task 52. Spot-check the rendered site and walk the acceptance criteria — all nine of issue #111's
      acceptance criteria confirmed met (see notes on 52.1/52.2).
  - [x] Task 52.1. Spot-check the generated `build/site`: the Swift Reference appears in the nav under *Guides
        & References → Programming Languages* after C#, every page renders, each `[mermaid]` block renders as a
        diagram (not literal text), each SVG displays, the cheat-sheet PDF downloads, and the section is present
        in the Lunr search index.
        *Verified*: nav renders Kotlin -> C -> {cpp} -> Objective-C -> C# -> **Swift Reference** under
        *Guides & References -> Programming Languages*; 45 HTML pages built; 12 `<div class="mermaid content">`
        diagrams and 12 `_images/swift-*.svg` `<img>` tags render; `cheat-sheet.html` links
        `../../_attachments/swift-cheat-sheet.pdf`, which exists; 91 Swift page refs in `search-index.js`;
        0 broken internal links and 0 unresolved xrefs across all 45 pages.
  - [x] Task 52.2. Walk issue #111's **nine** acceptance criteria one by one and confirm each explicitly,
        including the page count (43 topic pages + `index.adoc` + `cheat-sheet.adoc`), the per-page TSPL chapter
        attribution, the version-flagging rules, and the one-A4-page cheat sheet.
