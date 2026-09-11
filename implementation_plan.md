# Implementation Plan: Guides & References / Programming Languages — Objective-C Reference

## Task summary

Source: GitHub issue #109
Base branch: main

Issue [#109](https://github.com/albertoirurueta/docs/issues/109) asks for a new **Objective-C Reference**
section under *Guides & References → Programming Languages*, a sibling of the existing JavaScript, TypeScript,
Python, Java and Kotlin references, authored directly into this repo's own `ROOT` Antora component (this repo
has no application source code — it *is* the Antora playbook + root component). Concretely:

1. **28 new AsciiDoc pages** under `modules/ROOT/pages/programming-languages/objective-c/`: a landing
   `index.adoc` (with a `== Bibliography`), **26 topic pages**, and a `cheat-sheet.adoc`.
2. **Two new partials**: `modules/ROOT/partials/objective-c-disclaimer.adoc` (house 3-sentence template) and
   `modules/ROOT/partials/nav-objective-c.adoc` (depth-agnostic `*`/`**` nav partial).
3. **Site wiring**: include the nav partial in `modules/ROOT/nav.adoc` (inside the same open block as
   `nav-kotlin.adoc`), add an "Objective-C Reference" bullet to
   `modules/ROOT/pages/programming-languages/index.adoc`, and extend the root `modules/ROOT/pages/index.adoc`
   `:keywords:` with `Objective-C, Cocoa, Foundation`.
4. **Figures**: 6 hand-authored `modules/ROOT/images/objective-c-*.svg` files plus 10 `[mermaid]` blocks, placed
   per the issue's 📊 markers (a floor, not a ceiling).
5. **`modules/ROOT/attachments/objective-c-cheat-sheet.pdf`** — exactly one A4 page, rendered from a
   throwaway print-ready HTML/CSS layout via headless Chrome; only the PDF is checked in.

Scope: **modern Objective-C as implemented by Apple Clang** (Objective-C 2.0 plus ARC, literals/subscripting,
`instancetype`, Clang modules, lightweight generics, nullability, `@available`, class properties), with GCC /
GNUstep noted for Linux, and removed legacy features (`poseAsClass:`, GC) flagged as historical only. The
issue's own page outline, sourcing table, bibliography and acceptance criteria are exhaustive and are treated as
the source of truth for content — this plan sequences them into buildable tasks, it does not restate them.

### Choices made on your behalf (stated here so they can be challenged during review)

1. **This is a content-only, untagged plan.** Installed `*-code-one-task` skills are `java`,
   `java-springboot`, `dotnet` and `database` — none applies to AsciiDoc/SVG/PDF authoring, matching every prior
   documentation plan in `.archive/`. Every task below is therefore deliberately **untagged**, which a
   downstream `iru-code` run treats as "implement directly" rather than dispatch. `[source,objc]` blocks are
   illustrative AsciiDoc content, not a compiled module.
2. **The C Reference cross-references are made adaptively, not assumed.** Issue #109 says the C-level pages
   should `xref:` the C Reference of #105 instead of duplicating it — but **`modules/ROOT/pages/programming-languages/c/`
   does not exist on `main`**: #105 and #106 are each closed by an *open, unmerged* PR
   ([#108](https://github.com/albertoirurueta/docs/pull/108) for C,
   [#107](https://github.com/albertoirurueta/docs/pull/107) for C++). Adding `xref:` links to pages that aren't
   in this branch would emit Antora "target of xref not found" warnings and render visibly broken links.
   So: **Task 34 re-checks at implementation time** whether `programming-languages/c/` is present in the branch
   (i.e. #108 has landed and been merged into this branch) and, if so, converts the C-level summaries in
   Tasks 3–4 into `xref:` cross-references; if it is not present, those pages stay self-contained — a concise
   but usable summary of the C material with the Objective-C angle primary — and the cross-referencing becomes
   a follow-up. This works under *every* merge order of #107/#108/#109 and never trades a green build for it.
3. **Closest precedent: `.archive/implementation_plan_73.md` (issue #73, Kotlin Reference)**, read in full —
   the same "one language reference under Programming Languages" shape at comparable scale (28 pages + cheat
   sheet). Its conventions are carried over verbatim: page anatomy, the 3-sentence disclaimer template, the
   `*`/`**` nav partial inside an open block, book sources cited **only** in `== Bibliography` and the
   disclaimer's "consulted while preparing" clause (never as a page's primary source), and the cheat-sheet
   mechanism (hand-built HTML/CSS → headless Chrome → single A4 PDF, HTML not checked in).
4. **Figures: 6 SVGs + 10 mermaid blocks**, assigned per the issue's own 📊 markers — hand-authored SVG for the
   genuinely spatial figures (pipeline, memory/object layout, capture, interop), `[mermaid]` for flow, sequence,
   class-hierarchy and decision figures. Note the Kotlin Reference used mermaid exclusively, but the site has
   125 existing `modules/ROOT/images/*.svg` figures, so both mechanisms are house-standard; #109 names which is
   wanted per page and that is followed. An implementer may add further small `objective-c-*.svg` figures where
   one adds real value.
5. **Nav placement: appended after `nav-kotlin.adoc`** inside the existing open block in `nav.adoc`
   (append-order convention). Task 31.2 re-checks whether `nav-c.adoc`/`nav-cpp.adoc` are present by then and, if
   so, places `nav-objective-c.adoc` after them instead, exactly as #109 asks.
6. **No project-picker tile** — like every other Guides & References subsection, the Objective-C Reference lives
   only in `nav.adoc`, `programming-languages/index.adoc`, and its own subsection index. Only the root
   `pages/index.adoc` **keywords** change, per the issue.
7. **Page grouping below is thematic batching, not hard dependency**, for Groups 2–7: the 26 topic pages are
   independent files and inter-page `xref:`s resolve once all of them land (Antora resolves xrefs at build time
   across the whole component, and the build gate is Task 32, after every page exists). Groups 8–11 *do* carry
   real ordering dependencies and are ordered accordingly.

## Current code state

- **Repository shape**: no application source code. `antora.yml` declares component `irurueta`;
  `antora-playbook.yml` is the site definition; pages live under `modules/ROOT/pages/`, partials under
  `modules/ROOT/partials/`, figures under `modules/ROOT/images/`, downloadable assets under
  `modules/ROOT/attachments/`. The only verification is a clean `npx antora antora-playbook.yml` (no lint/test
  suite). `build/` is gitignored. Per `CLAUDE.md`, adding a documented topic means editing nav + index + pages,
  not adding tooling.
- **Branch**: `feature/109`, forked from `origin/main` (commit `6e748f7`).
- **`modules/ROOT/pages/programming-languages/`** currently contains only `index.adoc`, `java/`, `javascript/`,
  `kotlin/`, `python/`, `typescript/`. **No `c/` or `cpp/` directory** (see choice 2 above).
- **`modules/ROOT/nav.adoc`** — the Programming Languages block (lines 21–29) is:
  ```
  ** xref:programming-languages/index.adoc[Programming Languages]
  +
  --
  include::partial$nav-kotlin.adoc[]
  --
  include::partial$nav-javascript.adoc[]
  ...
  ```
  i.e. `nav-kotlin.adoc` is the only partial inside the open block (`--`); the other language partials are
  included after it and are *also* included elsewhere in the file under their own topic areas.
  `nav-kotlin.adoc` itself (28 entries) is included twice — here and under *Apps → Android* (line 604) — which
  is why the partials use depth-agnostic `*`/`**` levels.
- **`modules/ROOT/partials/kotlin-disclaimer.adoc`** is the exact template for the new disclaimer: an
  `[IMPORTANT]` block with (1) a scope/version sentence naming the reference it is verified against, (2) the
  AI-assistance disclosure, (3) a pointer to the section's `#_bibliography` anchor.
- **`modules/ROOT/partials/nav-kotlin.adoc`** is the exact template for the new nav partial: a single `*` entry
  for the reference's `index.adoc` followed by one `**` entry per page, ending with `Cheat Sheet (PDF)`.
- **Page anatomy** (e.g. `modules/ROOT/pages/programming-languages/kotlin/null-safety.adoc`): `= <Title>`,
  `:description:`, `:keywords:`, `include::partial$<lang>-disclaimer.adoc[]`, body with `[source,<lang>]`
  blocks, an optional "see also" bullet list, and a closing `== References` section of official links only.
- **Landing page anatomy** (`programming-languages/kotlin/index.adoc`): title/description/keywords, disclaimer
  include, a one-paragraph "what the language is", a "read in this order" paragraph, `== What's covered` with
  one bullet per page grouped by the same section headings used in the nav, and (per #109) `== Bibliography`.
- **Cheat-sheet page anatomy** (`programming-languages/kotlin/cheat-sheet.adoc`): description of what the sheet
  covers, grouped cross-references to every topic page, and the `xref:attachment$...pdf[...]` download link.
- **Figures**: `modules/ROOT/images/` holds 125 SVGs, included as
  `image::<name>.svg["<alt text>",width=750,role=text-center]`. SVGs are hand-authored, `viewBox`-based, with an
  explicit white `<rect>` background and `font-family="Helvetica, Arial, sans-serif"` (see
  `modules/ROOT/images/aspnet-di-lifetimes.svg`). Mermaid blocks are written as `[mermaid]` + `....` delimiters.
- **Attachments**: `modules/ROOT/attachments/` holds 26 existing `*-cheat-sheet.pdf` files, including
  `kotlin-cheat-sheet.pdf` and `java-cheat-sheet.pdf` — the visual templates for the new sheet.
- **Tooling available in this environment**: Chromium is pre-installed at `/opt/pw-browsers/chromium` (do not
  run `playwright install`), which is what renders the cheat-sheet PDF. Antora and its three extensions are
  already in `node_modules/`.
- **`modules/ROOT/pages/index.adoc`** — the `:keywords:` line (line 3) currently ends `... Kotlin coroutines,
  Jetpack`; it gains `Objective-C, Cocoa, Foundation`.

## Implementation steps

> Conventions every page task below inherits (do not restate per task): create the file under
> `modules/ROOT/pages/programming-languages/objective-c/`; start with `= <Title>`, a `:description:`, a
> `:keywords:`, then `include::partial$objective-c-disclaimer.adoc[]`; write compilable examples in
> `[source,objc]` blocks, verified in intent against `clang -fobjc-arc -fmodules -Wall -Wextra -framework
> Foundation` and noting where GNUstep differs; close with a `== References` section linking **only** official
> documentation (Apple Documentation Archive / developer.apple.com, Clang, GCC, GNUstep). Prefer `xref:` links
> to sibling Objective-C pages over repeating material.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/objective-c-disclaimer.adoc`
  - [x] Task 1.1. Copy the shape of `modules/ROOT/partials/kotlin-disclaimer.adoc` exactly: an `[IMPORTANT]`
        block (`====` delimiters) of three sentences — (a) scope/version: this section documents *modern
        Objective-C as implemented by Apple Clang in the current Xcode release*, written and verified against
        Apple's Objective-C documentation and the Clang language specifications; (b) the standard AI-assistance
        disclosure sentence, pointing at developer.apple.com for verification before production use; (c) a
        pointer to `xref:programming-languages/objective-c/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Keep it to the 2–3 sentence short template — no book titles, no evaluation paragraph (books
        are cited only in the landing page's `== Bibliography`).

### Group 2 — Getting started and C-level fundamentals (Parallelizable: yes)

- [ ] Task 2. `getting-started.adoc` — "Getting Started"
  - [ ] Task 2.1. What Objective-C is (C plus Smalltalk-style messaging); short history (Cox & Love → NeXT →
        Apple → Objective-C 2.0 → ARC → the Swift era and where Objective-C is still used); Objective-C vs. C++
        and vs. Swift; toolchains (Xcode/Apple Clang; GCC and GNUstep on Linux/Windows); file extensions
        `.h`/`.m`/`.mm`.
  - [ ] Task 2.2. "Hello, World" with `#import <Foundation/Foundation.h>`, `@autoreleasepool` and `NSLog`, plus
        command-line build/run lines for both `clang -fobjc-arc -framework Foundation` and
        `` `gnustep-config --objc-flags` ``.
  - [ ] Task 2.3. Add `modules/ROOT/images/objective-c-compilation-pipeline.svg` — preprocess → compile →
        assemble → link → run, showing where the Objective-C runtime library sits — and include it with
        `image::objective-c-compilation-pipeline.svg["…",width=750,role=text-center]`.
- [ ] Task 3. `basic-syntax-and-types.adoc` — "Basic Syntax and Types"
  - [ ] Task 3.1. Tokens, comments, identifiers, keywords and the `@`-directives table; the C scalar types in
        brief; Objective-C's own: `BOOL`/`YES`/`NO`, `NSInteger`/`NSUInteger`/`CGFloat`, `id`, `Class`, `SEL`,
        `IMP`, `instancetype`, and the `nil`/`Nil`/`NULL`/`NSNull` distinction.
  - [ ] Task 3.2. Variables and constants, literals, `typedef`, `NS_ENUM`/`NS_OPTIONS`, casts and the usual
        arithmetic conversions — **summarised**, with the C detail deferred (see choice 2 / Task 31).
- [ ] Task 4. `operators-control-flow-and-functions.adoc` — "Operators, Control Flow and Functions"
  - [ ] Task 4.1. Operators and precedence, `if`/`else`, `switch`, the loop forms, the ternary operator — each
        briefly, Objective-C-specific notes (e.g. `BOOL` truthiness, messaging inside conditions) foregrounded.
  - [ ] Task 4.2. C functions vs. Objective-C methods, pointers, `struct`/`union`, and the preprocessor as used
        in Objective-C: `#import` vs. `#include`, `#pragma mark`, `#if TARGET_OS_*`.

### Group 3 — Objects, classes and messaging (Parallelizable: yes)

- [ ] Task 5. `classes-and-objects.adoc` — "Classes and Objects"
  - [ ] Task 5.1. `@interface`/`@implementation`, instance variables and visibility
        (`@private`/`@protected`/`@public`/`@package`), `@class` forward declarations, class vs. instance
        methods, method declaration syntax and named arguments.
  - [ ] Task 5.2. `alloc`/`init`, designated and convenience initializers (`NS_DESIGNATED_INITIALIZER`,
        `instancetype`, `new`), `self` and `super`, `dealloc`, `NSObject` as root class and the `isa` pointer,
        `description`.
  - [ ] Task 5.3. Add `modules/ROOT/images/objective-c-interface-implementation-anatomy.svg` — a labelled
        `.h`/`.m` pair showing which declaration lives where — and include it.
- [ ] Task 6. `messaging-and-selectors.adoc` — "Messaging and Selectors"
  - [ ] Task 6.1. Message-send syntax, nested messages, **messages to `nil`** and what they return; selectors
        (`@selector`, `SEL`, `NSSelectorFromString`), `respondsToSelector:`, `performSelector:`, `IMP`.
  - [ ] Task 6.2. Dynamic binding and polymorphism; dynamic vs. static typing (`id` vs. typed pointers,
        `__kindof`); introspection (`isKindOfClass:`, `isMemberOfClass:`, `class`, `conformsToProtocol:`).
  - [ ] Task 6.3. Add a `[mermaid]` flowchart of how a message send is resolved (cache → method list →
        superclass chain → resolution/forwarding), forward-referencing
        `xref:programming-languages/objective-c/dynamic-method-resolution-and-forwarding.adoc[]`.
- [ ] Task 7. `properties-and-encapsulation.adoc` — "Properties and Encapsulation"
  - [ ] Task 7.1. `@property` and the full attribute table: `strong`/`weak`/`copy`/`assign`/`unsafe_unretained`,
        `atomic`/`nonatomic`, `readonly`/`readwrite`, `getter=`/`setter=`, `class`, nullability.
  - [ ] Task 7.2. Autosynthesis, `@synthesize` and `@dynamic`, backing ivars (`_name`), dot syntax vs. accessor
        messages, KVC-compliant accessor naming, private properties in class extensions, the
        `readonly` publicly / `readwrite` privately idiom.
- [ ] Task 8. `inheritance-and-polymorphism.adoc` — "Inheritance and Polymorphism"
  - [ ] Task 8.1. Subclassing, overriding and calling `super`, abstract classes and
        `doesNotRecognizeSelector:`, `isEqual:`/`hash` contract, `NSCopying`/`NSMutableCopying`.
  - [ ] Task 8.2. Class clusters (`NSString`, `NSArray`, `NSNumber`) and composite objects; when to subclass vs.
        compose.
  - [ ] Task 8.3. Add a `[mermaid]` class diagram of a small hierarchy illustrating the above.
- [ ] Task 9. `categories-and-extensions.adoc` — "Categories and Extensions"
  - [ ] Task 9.1. Categories (adding methods to existing classes, splitting large classes), class extensions
        (the private interface), associated objects (`objc_setAssociatedObject`/`objc_getAssociatedObject`).
  - [ ] Task 9.2. The category pitfalls (no ivars, name collisions, overriding is undefined-order) and **posing
        (`poseAsClass:`) documented as a removed legacy feature only**.
- [ ] Task 10. `protocols-and-delegation.adoc` — "Protocols and Delegation"
  - [ ] Task 10.1. `@protocol`, `@required`/`@optional`, adopting and conforming, `id<Protocol>` typing,
        protocol inheritance, the `NSObject` protocol, run-time conformance checks.
  - [ ] Task 10.2. The delegate and data-source patterns and why delegates are `weak`.
  - [ ] Task 10.3. Add a `[mermaid]` sequence diagram of a delegate callback.
- [ ] Task 11. `blocks.adoc` — "Blocks"
  - [ ] Task 11.1. Block syntax and `typedef`s, blocks as method arguments and completion handlers, capturing
        variables and `__block`, stack vs. heap blocks and copying.
  - [ ] Task 11.2. Retain cycles and the `__weak`/`__strong self` dance, `NSArray` block enumeration, blocks vs.
        C function pointers.
  - [ ] Task 11.3. Add `modules/ROOT/images/objective-c-block-capture.svg` — variable capture and the stack→heap
        copy — and include it.

### Group 4 — Foundation values and collections (Parallelizable: yes)

- [ ] Task 12. `strings-numbers-and-values.adoc` — "Strings, Numbers and Values"
  - [ ] Task 12.1. `NSString`/`NSMutableString` (literals `@"…"`, formatting, comparison, ranges, encoding
        conversions); `NSNumber` and boxing literals (`@42`, `@YES`, `@(expr)`); `NSValue`.
  - [ ] Task 12.2. `NSData`, `NSDate`, `NSNull`, `NSURL`; `NSString` vs. C strings; toll-free bridging to
        CoreFoundation (`CFStringRef`), forward-referencing the ARC bridging casts page.
- [ ] Task 13. `collections-and-fast-enumeration.adoc` — "Collections and Fast Enumeration"
  - [ ] Task 13.1. `NSArray`/`NSDictionary`/`NSSet` and their mutable variants; collection literals (`@[]`,
        `@{}`) and subscripting; immutability and copying semantics.
  - [ ] Task 13.2. Fast enumeration (`for…in`), `NSEnumerator`, block-based enumeration, sorting and filtering
        (`NSPredicate`, comparators), `NSIndexSet`, `NSCache`, collection thread-safety.
  - [ ] Task 13.3. Add a `[mermaid]` class diagram of the Foundation collection hierarchy.
- [ ] Task 14. `lightweight-generics-and-nullability.adoc` — "Lightweight Generics and Nullability"
  - [ ] Task 14.1. `NSArray<NSString *> *`, generic class declarations (`__covariant`/`__contravariant`),
        `__kindof`.
  - [ ] Task 14.2. `NS_ASSUME_NONNULL_BEGIN`/`END`, `nullable`/`nonnull`/`null_resettable`/`null_unspecified`
        and their `_Nullable`/`_Nonnull` spellings, `@available` and `API_AVAILABLE`/`API_DEPRECATED`, and what
        each annotation means on the Swift side (forward-reference `swift-interoperability.adoc`).

### Group 5 — Memory management, the runtime and dynamism (Parallelizable: yes)

- [ ] Task 15. `manual-retain-release.adoc` — "Manual Retain Release"
  - [ ] Task 15.1. The ownership model and retain counts, the four rules (`alloc`/`new`/`copy`/`mutableCopy`
        own; `retain`/`release`/`autorelease`), autorelease pools, accessor patterns under MRR, `dealloc`.
  - [ ] Task 15.2. The classic bugs (leaks, over-release, dangling pointers). Keep the page **short** — ARC is
        the default; this page exists to read older code — and link forward to
        `automatic-reference-counting.adoc`.
  - [ ] Task 15.3. Add a `[mermaid]` diagram of an object's lifecycle under MRR.
- [ ] Task 16. `automatic-reference-counting.adoc` — "Automatic Reference Counting"
  - [ ] Task 16.1. What ARC does and does not do; ownership qualifiers (`__strong`, `__weak`,
        `__unsafe_unretained`, `__autoreleasing`); method families and naming conventions
        (`NS_RETURNS_RETAINED` etc.).
  - [ ] Task 16.2. Retain cycles and weak references (delegates, blocks, parent/child), `dealloc` under ARC,
        `@autoreleasepool` in loops.
  - [ ] Task 16.3. Bridging casts with CoreFoundation (`__bridge`, `__bridge_retained`, `__bridge_transfer`),
        `-fobjc-arc`/`-fno-objc-arc` per file, diagnosing leaks with Instruments and the static analyzer.
  - [ ] Task 16.4. Add `modules/ROOT/images/objective-c-retain-cycle.svg` — a retain cycle and how `weak` breaks
        it — and include it.
- [ ] Task 17. `the-objective-c-runtime.adoc` — "The Objective-C Runtime"
  - [ ] Task 17.1. `objc_msgSend` and the dispatch path; classes, metaclasses and `isa`; method lists and
        caches.
  - [ ] Task 17.2. The runtime API (`objc_getClass`, `class_addMethod`, `class_copyMethodList`,
        `method_exchangeImplementations` — **method swizzling and when not to use it**);
        `Method`/`Ivar`/`objc_property_t` introspection; type encodings and `@encode`; `NSInvocation`;
        `NSProxy`.
  - [ ] Task 17.3. Add `modules/ROOT/images/objective-c-class-metaclass-isa.svg` — the class / metaclass /
        superclass `isa` diagram — and include it.
- [ ] Task 18. `dynamic-method-resolution-and-forwarding.adoc` — "Dynamic Method Resolution and Forwarding"
  - [ ] Task 18.1. `+resolveInstanceMethod:`/`+resolveClassMethod:` (with `@dynamic` properties),
        `-forwardingTargetForSelector:`, `-methodSignatureForSelector:` + `-forwardInvocation:`,
        `-doesNotRecognizeSelector:`, proxies and transparent forwarding.
  - [ ] Task 18.2. Add a `[mermaid]` diagram of the full message-forwarding chain (continuing the figure from
        Task 6.3).
- [ ] Task 19. `key-value-coding-and-observing.adoc` — "Key-Value Coding and Observing"
  - [ ] Task 19.1. KVC: `valueForKey:`, `setValue:forKey:`, key paths, collection operators (`@sum`, `@avg`),
        validation, `NSKeyValueCoding` compliance.
  - [ ] Task 19.2. KVO: `addObserver:forKeyPath:options:context:`, `observeValueForKeyPath:…`, automatic vs.
        manual change notification, `keyPathsForValuesAffectingValueForKey:`, removing observers; plus
        `NSNotificationCenter` as the broadcast alternative.
  - [ ] Task 19.3. Add a `[mermaid]` sequence diagram of a KVO notification.

### Group 6 — Error handling, concurrency and interoperability (Parallelizable: yes)

- [ ] Task 20. `errors-and-exceptions.adoc` — "Errors and Exceptions"
  - [ ] Task 20.1. The `NSError` pattern: `NSError **` out-parameters, the return-value-then-error discipline,
        domains/codes/`userInfo`, creating and propagating errors, `NSErrorDomain`/`NS_ERROR_ENUM`.
  - [ ] Task 20.2. Exceptions (`@try`/`@catch`/`@finally`/`@throw`, `NSException`, uncaught-exception handlers)
        and **why exceptions are for programmer errors only**; assertions (`NSAssert`, `NSParameterAssert`);
        logging (`NSLog`, `os_log`) and disabling logs in release builds.
  - [ ] Task 20.3. Add a `[mermaid]` decision diagram: choosing between `NSError` and an exception.
- [ ] Task 21. `concurrency.adoc` — "Concurrency"
  - [ ] Task 21.1. Threads (`NSThread`, the main thread); synchronisation (`@synchronized`, `NSLock`, atomic
        properties and **why `atomic` is not thread safety**).
  - [ ] Task 21.2. GCD (`dispatch_async`, serial/concurrent queues, `dispatch_group`, `dispatch_semaphore`,
        `dispatch_once`, barriers, QoS); `NSOperation`/`NSOperationQueue` and dependencies; `NSRunLoop` basics;
        Foundation collection thread-safety.
  - [ ] Task 21.3. Add a `[mermaid]` sequence diagram: background work dispatched back to the main queue.
- [ ] Task 22. `objective-c-plus-plus-and-c-interop.adoc` — "Objective-C++ and C Interoperability"
  - [ ] Task 22.1. Objective-C++ (`.mm` files, C++ objects as ivars, calling C++ from methods, C++11 lambdas
        vs. blocks, ARC and C++ containers).
  - [ ] Task 22.2. Calling plain C libraries, `extern "C"` and header hygiene, CoreFoundation and toll-free
        bridging, wrapping opaque C types in Objective-C classes.
- [ ] Task 23. `swift-interoperability.adoc` — "Swift Interoperability"
  - [ ] Task 23.1. The bridging header, the generated `<Module>-Swift.h` header, `@objc`/`@objcMembers` on the
        Swift side, `NS_SWIFT_NAME`, `NS_REFINED_FOR_SWIFT`, `NS_SWIFT_UNAVAILABLE`.
  - [ ] Task 23.2. How nullability, lightweight generics, `NS_ENUM`/`NS_OPTIONS`, error out-parameters and
        `instancetype` are imported into Swift; mixed-language projects.
  - [ ] Task 23.3. Add `modules/ROOT/images/objective-c-swift-interop.svg` — how the two languages see each
        other within one target — and include it.

### Group 7 — Code organisation and tooling (Parallelizable: yes)

- [ ] Task 24. `modules-frameworks-and-code-organization.adoc` — "Modules, Frameworks and Code Organization"
  - [ ] Task 24.1. `#import` vs. `#include` vs. `@import`; Clang modules and `module.modulemap`; umbrella
        headers; static vs. dynamic frameworks; public/private/project header visibility.
  - [ ] Task 24.2. `NS_UNAVAILABLE` and `NS_DESIGNATED_INITIALIZER` in public APIs, `@compatibility_alias`,
        organising a class into files and `#pragma mark` sections, class prefixes as namespaces-by-convention.
  - [ ] Task 24.3. Add a `[mermaid]` diagram of a framework bundle's anatomy.
- [ ] Task 25. `coding-conventions-and-style.adoc` — "Coding Conventions and Style"
  - [ ] Task 25.1. Apple's Coding Guidelines for Cocoa (method, accessor, delegate, constant and notification
        naming; prefixes) and the "Conventions" chapter of *Programming with Objective-C*.
  - [ ] Task 25.2. Documentation comments (`///`, `/** */`, HeaderDoc / Xcode Quick Help), deprecation and
        availability attributes.
  - [ ] Task 25.3. The Cocoa design patterns every Objective-C programmer meets: delegation, target-action,
        notifications, singleton via `dispatch_once`, MVC and its MVP/MVVM variants.
- [ ] Task 26. `build-and-tooling.adoc` — "Build and Tooling"
  - [ ] Task 26.1. Xcode and `xcodebuild`; Apple Clang flags (`-fobjc-arc`, `-fmodules`, `-ObjC`,
        `-Wall -Wextra`, `-Werror`); building on Linux with GCC/GNUstep (`gnustep-config --objc-flags`) and on
        Windows.
  - [ ] Task 26.2. The Clang Static Analyzer (`xcodebuild analyze`), sanitizers (Address/Thread/Undefined),
        Instruments (Leaks, Allocations, Zombies), debugging with `lldb` (`po`, `expr`, breakpoints, exception
        breakpoints).
  - [ ] Task 26.3. Dependency managers (CocoaPods, Swift Package Manager with Objective-C targets) and
        `clang-format`.
- [ ] Task 27. `testing.adoc` — "Testing"
  - [ ] Task 27.1. XCTest: `XCTestCase`, `setUp`/`tearDown`, the `XCTAssert…` family, `XCTestExpectation` for
        asynchronous code, performance tests with `measureBlock:`.
  - [ ] Task 27.2. Mocking with OCMock (link its official site), running tests with `xcodebuild test`, and
        unit-testing on Linux with GNUstep's test framework.

### Group 8 — Landing page and cheat-sheet page (Parallelizable: yes)

Depends on Groups 2–7: both pages enumerate and cross-reference every topic page by its final title.

- [ ] Task 28. `index.adoc` — "Objective-C Reference" landing page
  - [ ] Task 28.1. Title/description/keywords + disclaimer include; one paragraph on what Objective-C is; a
        "New here? read in this order" paragraph (Getting Started → the C-level pages → Objects/classes/
        messaging → the rest as needed).
  - [ ] Task 28.2. `== What's covered` — one bullet per page with a one-line summary, grouped under the **same
        section headings** used in `nav-objective-c.adoc` (Getting started; Objects, classes and messaging;
        Foundation values and collections; Memory management; The runtime and dynamism; Error handling;
        Concurrency; Interoperability; Code organisation and tooling; Reference).
  - [ ] Task 28.3. `== Bibliography` — every source listed in issue #109's Bibliography section, **all linked**:
        Apple's *Programming with Objective-C*, *The Objective-C Programming Language*, *Objective-C Runtime
        Programming Guide* + the current runtime API reference + the `objc4` source, *Advanced Memory
        Management Programming Guide* + *Transitioning to ARC Release Notes*, the topic guides (Blocks,
        Concepts in Objective-C Programming, Coding Guidelines for Cocoa, Exceptions, Error Handling, KVC, KVO,
        Collections, Strings, Threading, Concurrency), the Foundation/Dispatch/XCTest references and the three
        Swift-interop pages; the six Clang specifications; the GCC Objective-C chapter and GNUstep; and the two
        bin Uzayr books as **consulted references** with their publisher/DOI links (never as a page's primary
        source).
- [ ] Task 29. `cheat-sheet.adoc` — "Objective-C Cheat Sheet"
  - [ ] Task 29.1. Short description of what the sheet covers, mirroring
        `programming-languages/kotlin/cheat-sheet.adoc`'s structure.
  - [ ] Task 29.2. Grouped cross-references to **every** topic page (same grouping as Task 28.2).
  - [ ] Task 29.3. The download link:
        `xref:attachment$objective-c-cheat-sheet.pdf[Download the Objective-C Cheat Sheet (PDF)]`.

### Group 9 — Cheat-sheet PDF (Parallelizable: yes)

Depends on Group 8: the sheet's contents must match what `cheat-sheet.adoc` says it covers.

- [ ] Task 30. Produce `modules/ROOT/attachments/objective-c-cheat-sheet.pdf`
  - [ ] Task 30.1. Author a throwaway print-ready A4 HTML/CSS layout (scratch directory, **not** checked in),
        visually consistent with `kotlin-cheat-sheet.pdf`/`java-cheat-sheet.pdf`: dense multi-column
        colour-coded boxes, a header line and a breadcrumb footer.
  - [ ] Task 30.2. Cover, per issue #109: Objective-C types (`id`, `BOOL`, `SEL`, `nil`),
        `@interface`/`@implementation` skeleton, method declaration and message syntax, `alloc`/`init` and
        initializer patterns, the `@property` attributes table, categories/extensions/protocols one-liners,
        block syntax with `__block`/`__weak`, literals and subscripting, `NSString`/`NSArray`/`NSDictionary`
        quick examples, fast enumeration, ARC qualifiers and bridging casts, `NSError`/`@try` patterns, GCD
        one-liners, KVC/KVO calls, runtime and Swift-interop annotations, and `clang`/`gnustep-config` build
        commands. Cross-check completeness against book 2's own 4-page cheat sheet as issue #109 suggests.
  - [ ] Task 30.3. Render with headless Chromium (pre-installed at `/opt/pw-browsers/chromium` — do **not** run
        `playwright install`), e.g. `--headless --print-to-pdf=… --no-pdf-header-footer`, and save to
        `modules/ROOT/attachments/objective-c-cheat-sheet.pdf`.
  - [ ] Task 30.4. Verify it is **exactly one A4 page** with no clipped content (page-count check plus a
        rendered preview); iterate on the layout density until it is.

### Group 10 — Site wiring (Parallelizable: yes)

Depends on Groups 2–9: the nav partial lists every page, and the index bullet describes the finished section.

- [ ] Task 31. Nav partial and `nav.adoc` include
  - [ ] Task 31.1. Create `modules/ROOT/partials/nav-objective-c.adoc` modelled exactly on
        `nav-kotlin.adoc`: a single `* xref:programming-languages/objective-c/index.adoc[Objective-C Reference]`
        followed by one `**` entry per page in the Group 2–7 order above, ending with
        `** xref:programming-languages/objective-c/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use the depth-agnostic
        `*`/`**` levels — never absolute `***`/`****` — so the partial stays includable from any depth.
  - [ ] Task 31.2. Include it in `modules/ROOT/nav.adoc` **inside the same open block (`--`) as
        `nav-kotlin.adoc`**, after it. Re-check at this point whether `nav-c.adoc`/`nav-cpp.adoc` are present
        in the branch (PRs #108/#107 may have merged by then) and, if so, place the include **after** those,
        per issue #109's append-order instruction.
- [ ] Task 32. Add the "Objective-C Reference" bullet to
      `modules/ROOT/pages/programming-languages/index.adoc`
  - [ ] Task 32.1. Append a bullet to the `== Sections` list in the same style as the existing five (an
        `xref:` link plus a one-sentence summary ending "…plus a downloadable cheat sheet"), and extend the
        page's own `:description:`/`:keywords:` to mention Objective-C.
- [ ] Task 33. Extend the root `modules/ROOT/pages/index.adoc` keywords
  - [ ] Task 33.1. Append `Objective-C, Cocoa, Foundation` to the `:keywords:` line (line 3), preserving the
        existing order and formatting. Do not add a project-picker tile or image (see choice 6).

### Group 11 — C-Reference cross-references and final verification (Parallelizable: no — Task 35 must run after Task 34's edits)

- [ ] Task 34. Resolve the C Reference cross-reference decision (see choice 2)
  - [ ] Task 34.1. Check whether `modules/ROOT/pages/programming-languages/c/` exists in the branch at this
        point (i.e. PR #108 has merged and been brought in).
  - [ ] Task 34.2. **If it exists**: replace the self-contained C-level summaries in
        `basic-syntax-and-types.adoc` and `operators-control-flow-and-functions.adoc` (Tasks 3–4) with
        `xref:programming-languages/c/<page>.adoc[…]` cross-references to the matching C Reference pages,
        trimming each summary to the Objective-C-specific angle, exactly as issue #109's fourth acceptance
        criterion asks. Do the same for any other page that summarises plain-C material.
  - [ ] Task 34.3. **If it does not exist**: leave the pages self-contained, add **no** `xref:` to a
        non-existent `programming-languages/c/` page (it would emit "target of xref not found" and render a
        broken link), and record in the run's summary that the cross-referencing acceptance criterion is
        deferred pending #108 — so it can be raised as a follow-up issue.
- [ ] Task 35. Build and verify the site
  - [ ] Task 35.1. Delegate the build to the `iru-gate-runner` agent so its output doesn't consume the main
        context, e.g.
        `Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Run `npx antora antora-playbook.yml` at the repository root and report only: whether the build completed, and every AsciiDoc/xref warning or error with its file and line. Do not paste the full build log."})`.
  - [ ] Task 35.2. Confirm **zero** `xref`/AsciiDoc warnings or errors — in particular no unresolved
        `xref:programming-languages/objective-c/*` or `attachment$objective-c-cheat-sheet.pdf` targets, and no
        missing `modules/ROOT/images/objective-c-*.svg`. Fix and re-run until clean.
  - [ ] Task 35.3. Spot-check the generated `build/site`: the Objective-C Reference appears in the nav under
        *Guides & References → Programming Languages*, every page renders, each `[mermaid]` block renders as a
        diagram (not as literal text), each SVG displays, the cheat-sheet PDF downloads, and the section is
        present in the Lunr search index.
  - [ ] Task 35.4. Walk issue #109's eight acceptance criteria one by one and confirm each, noting explicitly
        any deferred per Task 34.3.
