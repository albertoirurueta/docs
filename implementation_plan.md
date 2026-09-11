# Implementation plan — C# Reference section

## Task summary

Add a new **C# Reference** documentation section at **Guides & References / Programming Languages**, as a
seventh sibling of the existing JavaScript, TypeScript, Python, Java, Kotlin and C references: a landing page
with a **Bibliography**, **37 concept pages** (compilable code examples, links to official documentation, and
Mermaid/SVG figures where they help), and a one-page, printable, downloadable **C# cheat sheet PDF** styled like
`kotlin-cheat-sheet.pdf` / `java-cheat-sheet.pdf`. The section targets **C# 14 on .NET 10 (LTS)** as published at
learn.microsoft.com; **C# 15 / .NET 11 preview** features are documented only in clearly labelled *preview*
subsections, never as baseline, and C# 13/14 features are labelled with the version that introduced them.

Source: GitHub issue #110
Base branch: main

Choices made on the user's behalf (the issue is otherwise exceptionally explicit — it specifies the exact file
list, per-page content, nav placement, figure suggestions and bibliography entries, so nothing else needed a
decision):

- **.NET SDK for the "compilable examples" verification.** The issue requires every example verified with the
  .NET 10 SDK. `dotnet` is not installed in this environment and the direct Microsoft build host
  (`builds.dotnet.microsoft.com`) is blocked by the egress proxy, but **`dotnet-sdk-10.0` (10.0.104) is
  available from the Ubuntu `noble-updates/universe` apt repository** and `packages.microsoft.com` is reachable.
  Task 1 therefore installs the SDK via apt and every code example in Groups 2–3 is compile-checked against it,
  exactly as the acceptance criteria ask.
- **C# 15 preview snippets are not compile-verified.** The issue asks for preview snippets to additionally be
  verified with the .NET 11 RC SDK and `<LangVersion>preview</LangVersion>`. No .NET 11 package exists in any
  reachable feed (no `dotnet-sdk-11*` in apt; the build host is blocked), and .NET 11 is not GA until November
  2026. Preview snippets are therefore written from the official C# 15 feature specifications / `dotnet/csharplang`
  proposals and the *What's new in C# 15* page, kept short and syntactic, and **always** rendered inside a clearly
  labelled preview admonition stating they require .NET 11 previews and `<LangVersion>preview</LangVersion>`.
  This deviation is called out here so it can be re-verified once a .NET 11 SDK is reachable.
- **`nav-csharp.adoc` include site.** `nav-kotlin.adoc` is included in `modules/ROOT/nav.adoc` **twice** — under
  `Guides & References > Programming Languages` (line 23) and again under `Apps > Android` (line ~604, because
  Kotlin is *the* Android language). C# has no Android angle on this site, and the issue's own nav diagram shows
  only the Programming Languages placement, so `nav-csharp.adoc` is included **once**, in the Programming
  Languages open block, appended after `nav-c.adoc` (append-order convention; the C++ / Objective-C partials from
  issues #106 / #109 do not exist yet, so C# appends after C). No `:page-aliases:` are added to the C# pages.
- **Book citations.** Following the Kotlin / Java / C precedent, only `index.adoc`'s Bibliography cites the two
  consulted books (Albahari, Skeet) — no concept page or the cheat-sheet page cites them; each page's own
  `== References` links only official documentation (learn.microsoft.com, ecma-international.org, the `dotnet/*`
  GitHub repositories, dotnet.microsoft.com, plus xunit.net / nunit.org on the testing page only). The books are
  copyrighted and are not attached to the issue or available to this run; they are linked through their
  publisher/author pages only.
- **Web-framework material is cross-referenced, never duplicated.** ASP.NET Core / MVC / Web Forms specifics stay
  in the existing ASP.NET Reference (`modules/ROOT/pages/web/aspnet/`); C# pages `xref:` it. Shared-concept pages
  link the Java Reference (`modules/ROOT/pages/programming-languages/java/`) where a "C# for Java developers"
  comparison helps.

## Current code state

- This repository has no application source code — it is the Antora playbook and root component for the
  "Irurueta Docs" site (`antora.yml`: component `ROOT`, title "Irurueta Docs"; nav `modules/ROOT/nav.adoc`).
  Content is AsciiDoc under `modules/ROOT/`; the build is `npx antora antora-playbook.yml` (Node v22 present,
  `node_modules/` already installed).
- `modules/ROOT/pages/programming-languages/` currently holds six sibling language references: `javascript/`,
  `typescript/`, `python/`, `java/`, `kotlin/`, `c/` — **no `csharp/` directory exists yet**.
- **Closest precedents.** The **Kotlin Reference** (issue #73) is the template the issue names
  (`modules/ROOT/pages/programming-languages/kotlin/`, `modules/ROOT/partials/kotlin-disclaimer.adoc`,
  `modules/ROOT/partials/nav-kotlin.adoc`). The **C Reference** (issue #105, merged at `main` tip via commits
  `f1aaaf9`/`358d3b8`) is the freshest, structurally identical precedent — 29 pages + cheat sheet + `c-*.svg`
  figures — and its archived plan `.archive/implementation_plan_105.md` is the model this plan follows.
- **Per-page house style** (from `kotlin/` and `c/`): `= <Title>`, then `:description:`, `:keywords:`, then
  `include::partial$<lang>-disclaimer.adoc[]`, body with code blocks and `[mermaid]` blocks, ending in a
  `== References` section linking only official documentation.
- **Disclaimer partial style** (`modules/ROOT/partials/kotlin-disclaimer.adoc`): an `[IMPORTANT]` block with a
  scope/version sentence naming the reference site, an AI-assistance disclosure, and a pointer to the section's
  `#_bibliography` anchor.
- **Nav partial style** (`modules/ROOT/partials/nav-kotlin.adoc`): depth-agnostic flat list — `*
  xref:programming-languages/<lang>/index.adoc[<Lang> Reference]` followed by one `**` entry per page, cheat
  sheet last. Included in `modules/ROOT/nav.adoc` inside the open block (`+` / `--` … `--`) under
  `** xref:programming-languages/index.adoc[Programming Languages]` at line 20; the block currently contains
  `include::partial$nav-kotlin.adoc[]` then `include::partial$nav-c.adoc[]`.
- **Landing page style** (`kotlin/index.adoc`, `c/index.adoc`): intro paragraph, a "New here? read in this order"
  pointer, a `== What's covered` list grouped under the same headings the nav uses, and a `== Bibliography`
  section (anchor `_bibliography`) closing with a note that the official documentation wins on any discrepancy.
- **Section index** (`modules/ROOT/pages/programming-languages/index.adoc`): a `== Sections` bullet list, one
  bullet per language reference, each a one-sentence summary ending "plus a downloadable cheat sheet"; its
  `:description:`/`:keywords:` enumerate the languages.
- **Figures**: `modules/ROOT/images/` holds `c-*.svg` (6 files, from #105); Kotlin uses Mermaid only. Mermaid is
  available site-wide via `@sntke/antora-mermaid-extension` configured in `antora-playbook.yml`.
- **Cheat sheets**: `modules/ROOT/attachments/` holds 28 `*-cheat-sheet.pdf` files including `kotlin-`, `java-`
  and `c-cheat-sheet.pdf`; each is linked from a `cheat-sheet.adoc` page via
  `xref:attachment$<lang>-cheat-sheet.pdf[Download the <Lang> Cheat Sheet (PDF)]`. Per #105, the PDF is rendered
  from a print-ready HTML/CSS layout with headless Chrome and only the PDF is checked in. Chromium is
  pre-installed here (`/opt/pw-browsers/chromium`).
- **Tooling available**: Node v22 / npx (Antora build), Chromium (PDF rendering), apt-installable
  `dotnet-sdk-10.0` (example verification — Task 1). No .NET 11 / C# 15 compiler is obtainable (see "Choices
  made").

## Implementation steps

### Group 1 — Toolchain and the disclaimer partial _(untagged)_

**Parallelizable: yes** — the two tasks are independent (one installs an SDK, the other writes a partial), and
both must land before Group 2, whose every page includes the disclaimer and whose every example is compile-checked.

- [x] Task 1. Install and smoke-test the .NET 10 SDK used to verify every example
  - [x] Task 1.1. `sudo apt-get update && sudo apt-get install -y dotnet-sdk-10.0` (candidate 10.0.104 from
        `noble-updates/universe`); confirm with `dotnet --version` and `dotnet --list-sdks`.
  - [x] Task 1.2. Create a scratch verification project **outside the repository** (e.g. under the session
        scratchpad, never committed): a `net10.0` console project with `<Nullable>enable</Nullable>`,
        `<TreatWarningsAsErrors>true</TreatWarningsAsErrors>` and `<AllowUnsafeBlocks>true</AllowUnsafeBlocks>`
        (needed by the unsafe/spans page). Smoke-test it with a C# 14 feature (e.g. the `field` keyword or a
        `extension` block) to confirm the SDK really defaults to C# 14.
  - [x] Task 1.3. Record the verification recipe in the plan run notes so every page task in Group 2 uses the
        same harness: paste each snippet into the scratch project (or a `dotnet run file.cs` file-based app) and
        require a clean build with no warnings. **C# 15 preview snippets are exempt** — no .NET 11 SDK is
        obtainable (see "Choices made"); they are checked against the official feature specs instead and must be
        wrapped in a labelled preview admonition.
- [x] Task 2. Create `modules/ROOT/partials/csharp-disclaimer.adoc`, modelled exactly on
      `modules/ROOT/partials/kotlin-disclaimer.adoc`: an `[IMPORTANT]` block whose first sentence scopes the
      section to **C# 14 on .NET 10 (LTS)** as published at https://learn.microsoft.com/dotnet/csharp/ and states
      that C# 15 / .NET 11 features are flagged as preview, followed by the house AI-assistance disclosure
      sentence, followed by the pointer line
      `This section's xref:programming-languages/csharp/index.adoc#_bibliography[bibliography] lists the reference
      material consulted while preparing these pages.`

### Group 2 — The 37 concept pages _(untagged)_

**Parallelizable: yes** — every page is an independent new file with its own content; none reads another page's
finished result, and cross-page `xref:` targets are all known up front from the fixed file list below. (Pages may
be implemented in parallel batches; the group is validated once, together, by the Antora build in Group 4.)

Every page in this group, without exception:
- lives at `modules/ROOT/pages/programming-languages/csharp/<name>.adoc`;
- starts with `= <Title>`, then `:description:`, then `:keywords:`, then
  `include::partial$csharp-disclaimer.adoc[]`;
- contains compilable examples verified per Task 1.3 (C# 15 preview snippets excepted and labelled);
- labels every C# 13 / C# 14 feature with the version that introduced it, and confines every C# 15 / .NET 11
  feature to a clearly labelled *preview* subsection or admonition;
- ends with a `== References` section linking **only** official documentation (learn.microsoft.com,
  ecma-international.org, `github.com/dotnet/*`, dotnet.microsoft.com; xunit.net / nunit.org only on Task 38);
- cross-references the ASP.NET Reference (`xref:web/aspnet/…`) rather than duplicating web-framework material,
  and the Java Reference (`xref:programming-languages/java/…`) where a "C# for Java developers" note helps;
- adds the 📊 figure named in its task — a `[mermaid]` block inline, or an SVG committed to
  `modules/ROOT/images/` under the exact `csharp-*.svg` name given — plus any further figure that genuinely
  clarifies a concept (the 📊 list is a floor, not a ceiling).

#### Getting started

- [x] Task 3. `getting-started.adoc` — "Getting Started": what C# is (general-purpose, type-safe,
      object-oriented *and* functional, designed by Anders Hejlsberg); short history (C# 1.0 in 2002 →
      generics/LINQ → `async` → .NET Core → C# 14 / .NET 10, with C# 15 / .NET 11 on the horizon); where C# is
      used (ASP.NET Core, Blazor, MAUI, WPF/WinForms, Unity/Godot, Azure Functions, ML.NET); installing the
      .NET 10 SDK on Windows/macOS/Linux; IDEs (Visual Studio 2026, VS Code + C# Dev Kit, Rider);
      `dotnet new console` / `dotnet run`; "Hello, World" with top-level statements; **file-based apps**
      (`dotnet run hello.cs`, `#:package`/`#:sdk`/`#:property` directives); C# for Java developers pointers.
      📊 **SVG `modules/ROOT/images/csharp-compilation-pipeline.svg`** — C# source → Roslyn → IL + metadata in an
      assembly → JIT / ReadyToRun / Native AOT → native code.
- [x] Task 4. `csharp-and-dotnet.adoc` — "C# and .NET": the CLR (managed code, IL, JIT, tiered compilation,
      Native AOT), assemblies and metadata, the BCL, the runtimes (.NET 10, .NET Framework 4.8, Mono/MAUI,
      Blazor WebAssembly), the support policy (LTS vs. STS), target framework monikers and language versioning
      (`LangVersion`, default language version per TFM), the `dotnet` CLI at a glance, the .NET Standard legacy,
      and C# ↔ F# / VB interoperability. 📊 **mermaid** — runtime architecture (application layer / BCL / CLR / OS).
- [x] Task 5. `lexical-structure-and-style.adoc` — identifiers, keywords and contextual keywords, `@` verbatim
      identifiers, literals, comments and XML doc comments, statements vs. expressions, blocks and scope,
      `namespace` (block and file-scoped), `using` directives (plain, `static`, alias, `global`, implicit global
      usings), `Main` vs. top-level statements, and the naming/layout conventions from Microsoft's C# coding
      conventions.
- [x] Task 6. `basic-types-and-variables.adoc` — value vs. reference types, the built-in types table
      (`sbyte`…`ulong`, `nint`/`nuint`, `float`/`double`/`decimal`, `bool`, `char`, `object`, `string`), numeric
      literals and suffixes, `var` and implicit typing, `const` vs. `readonly`, default values and `default`,
      implicit/explicit numeric conversions, `checked`/`unchecked` overflow, `Convert`/`Parse`/`TryParse`,
      boxing and unboxing, `typeof` and `sizeof`. 📊 **SVG `modules/ROOT/images/csharp-stack-vs-heap.svg`** —
      stack vs. heap, value copy vs. reference copy.
- [x] Task 7. `strings-and-text.adoc` — `string` immutability and interning, concatenation vs. `StringBuilder`,
      interpolation `$"…"` (alignment, format specifiers, `FormattableString`, interpolated string handlers),
      verbatim `@"…"` and raw `"""…"""` literals, UTF-8 literals `"…"u8`, `nameof`, comparison and culture
      (`StringComparison`, `CultureInfo`), searching/splitting/trimming, `Span<char>`/`ReadOnlySpan<char>`,
      `char` vs. `Rune`, composite formatting and `IFormattable`.
- [x] Task 8. `operators-and-expressions.adoc` — arithmetic, comparison, boolean logical and bitwise/shift
      operators, assignment and compound assignment, `++`/`--`, the conditional operator, null-coalescing
      `??`/`??=`, null-conditional `?.`/`?[]` (including **null-conditional assignment**, C# 14), the
      null-forgiving `!`, `is`/`as`/`typeof`/casts, index `^` and range `..` operators, `default`, `new`
      (including target-typed `new()`), `with`, `switch` expressions (pointing to Task 24), `await`,
      `stackalloc`, `checked`/`unchecked` expressions, `nameof` (including unbound generics, C# 14), and an
      operator precedence/associativity table.
- [x] Task 9. `control-flow.adoc` — `if`/`else`, the `switch` statement (case guards with `when`, fall-through
      rules) vs. the `switch` expression, `while`/`do`/`for`/`foreach` (including `foreach` over spans, tuples
      and a custom `GetEnumerator`), `break`/`continue`/`goto`/`return`, **labeled `break` and `continue`
      (C# 15 preview)**, `throw` as statement and expression, `yield` (pointer to Task 25). 📊 **mermaid** —
      `switch` statement vs. `switch` expression decision.
- [x] Task 10. `methods-and-parameters.adoc` — declaration and expression-bodied members, overloading and
      overload resolution, optional and named arguments, `params` arrays and **`params` collections (C# 13)**,
      pass-by-value vs. `ref`/`out`/`in`/`ref readonly` parameters, `ref` locals and `ref` returns, `scoped`,
      local functions (static local functions, attributes on local functions), recursion, method groups,
      `Deconstruct` methods, `CallerArgumentExpression` and friends.

#### Types and object-oriented programming

- [x] Task 11. `classes-and-objects.adoc` — `class` declaration, fields and constants, instance and static
      members, `static` classes, constructors (instance, static, private, **primary constructors** for classes
      and structs, **partial constructors — C# 14**, chaining with `this(...)`/`base(...)`), object and
      collection initializers, `required` members, properties (auto-implemented, `init`-only, expression-bodied,
      the **`field` keyword — C# 14**, property patterns), indexers, `this`, nested types, `partial` classes and
      members, access modifiers (`public`/`private`/`protected`/`internal`/`protected internal`/
      `private protected`/`file`), finalizers, the `object` base type. 📊 **SVG
      `modules/ROOT/images/csharp-class-anatomy.svg`** — anatomy of a class (members, accessibility, static vs.
      instance).
- [x] Task 12. `structs-and-value-types.adoc` — `struct` semantics (copying, `default`, parameterless
      constructors, field initializers), `readonly struct` and `readonly` members, `ref struct` (and
      `allows ref struct` constraints), `record struct`, `in` parameters and defensive copies, `with`
      expressions on structs, **inline arrays**, `Nullable<T>` as a struct, struct layout and `StructLayout`,
      and when to choose a struct over a class. 📊 **mermaid** — choosing between class, struct, record and tuple.
- [x] Task 13. `inheritance-and-polymorphism.adoc` — base and derived classes, `virtual`/`override`/`new`
      (hiding), `abstract` classes and members, `sealed` classes and members, **`closed` hierarchies (C# 15
      preview)**, `base` access, constructors and inheritance, upcasting/downcasting, covariant return types,
      the `object` members (`Equals`, `GetHashCode`, `ToString`, `GetType`), `is`/`as` with hierarchies,
      composition over inheritance. 📊 **mermaid class diagram** of a small hierarchy with a `closed` root.
- [x] Task 14. `interfaces.adoc` — declaring and implementing interfaces, interface
      properties/events/indexers, explicit interface implementation (including implementing members of two
      interfaces), interface inheritance, **default interface members** (versioning, mixins), **static abstract
      and static virtual members** and generic math (`INumber<T>`, `IAdditionOperators<TSelf, TOther, TResult>`),
      the everyday BCL interfaces (`IDisposable`, `IEquatable<T>`, `IComparable<T>`, `IEnumerable<T>`,
      `IFormattable`, `IParsable<T>`), and interfaces vs. abstract classes vs. delegates.
- [x] Task 15. `records.adoc` — `record class` and `record struct`, positional records and primary constructors,
      synthesized value equality, `ToString`, `with` expressions and non-destructive mutation, `Deconstruct`,
      `init`-only properties, record inheritance and `EqualityContract`, records vs. classes vs. structs vs.
      tuples (the official "choosing" tutorial). 📊 **SVG `modules/ROOT/images/csharp-record-synthesis.svg`** —
      what the compiler synthesizes for a positional record.
- [x] Task 16. `enums.adoc` — declaring enums and underlying types, explicit values, `[Flags]` and bitwise
      combination, conversions to/from integers and strings (`Enum.Parse`, `Enum.TryParse`,
      `Enum.GetValues<T>`), `switch` over enums and exhaustiveness, enum constraints in generics
      (`where T : struct, Enum`), and enum best practices.
- [x] Task 17. `generics.adoc` — generic classes, structs, interfaces, methods and delegates; type parameters
      and type inference; constraints (`where T : class/struct/notnull/unmanaged/new()/BaseType/IInterface/
      default`, `allows ref struct`); `default(T)`; static members and static constructors in generic types;
      generics at run time (reification vs. Java erasure, JIT sharing for reference types); **covariance and
      contravariance** (`out`/`in` on interfaces and delegates, array covariance); generic math via static
      abstract members; open vs. closed types and `typeof(List<>)`. 📊 **mermaid** — variance
      (`IEnumerable<out T>` vs. `IComparer<in T>`).
- [x] Task 18. `tuples-deconstruction-and-anonymous-types.adoc` — `ValueTuple` syntax, named elements and
      inference, tuple equality, returning multiple values, deconstruction of tuples/records/user types
      (`Deconstruct`), discards `_`, anonymous types (projection initializers, `with` on anonymous types), the
      `System.Tuple` legacy, and when to promote a tuple to a record.
- [x] Task 19. `nullable-types-and-null-safety.adoc` — `Nullable<T>` and `T?` for value types (lifted operators,
      `HasValue`/`Value`/`GetValueOrDefault`, boxing), **nullable reference types** (`#nullable enable`,
      `<Nullable>`, `?`/`!`, nullable warnings, flow analysis, null-state), the nullable static-analysis
      attributes (`[NotNull]`, `[MaybeNull]`, `[NotNullWhen]`, `[MemberNotNull]`…),
      `ArgumentNullException.ThrowIfNull`, `required` as an alternative to constructors, and migration
      strategies for existing code. 📊 **mermaid** — how the compiler tracks null-state through a method.
- [x] Task 20. `equality-and-operator-overloading.adoc` — reference vs. value equality, `==` on
      strings/records/structs, overriding `Equals`/`GetHashCode` correctly, `IEquatable<T>`,
      `IEqualityComparer<T>` and `IComparer<T>`/`IComparable<T>`, `EqualityComparer<T>.Default`, overloading
      operators (`+`, `==`/`!=` pairs, `<`/`>`, `true`/`false`, unary, `checked` operators), **user-defined
      compound assignment operators (C# 14)**, user-defined `implicit`/`explicit` conversions, and operators via
      static abstract interface members.
- [x] Task 21. `extension-members.adoc` — classic extension methods (`this` parameter, discovery via `using`,
      LINQ as the canonical example, extension methods on `null` receivers, guidelines), **extension blocks
      (C# 14 — `extension(T receiver) { … }` with extension properties, static extension members and extension
      operators)**, **extension indexers (C# 15 preview)**, and how the compiler resolves extension members vs.
      instance members.

#### Functional programming

- [x] Task 22. `delegates-lambdas-and-events.adoc` — `delegate` types, `Func<>`/`Action<>`/`Predicate<>`, method
      group conversions, multicast delegates and invocation lists, lambda expressions (expression vs. statement
      bodies, implicitly typed parameters, **modifiers on simple lambda parameters — C# 14**, `static` lambdas,
      default parameter values, natural type, attributes on lambdas), closures and captured variables (including
      the `foreach` capture rule), anonymous methods (legacy), delegate variance, events (`event` keyword,
      `EventHandler`/`EventHandler<TEventArgs>`, the standard .NET event pattern, custom `add`/`remove`
      accessors, **partial events — C# 14**, unsubscribing and memory leaks), and delegates vs. interfaces.
      📊 **SVG `modules/ROOT/images/csharp-closure-capture.svg`** — a closure capturing a local variable across
      calls.
- [x] Task 23. `pattern-matching.adoc` — `is` patterns, `switch` statements and expressions,
      declaration/type, constant, relational, logical (`and`/`or`/`not`), property, positional
      (deconstruction), tuple, `var`, discard and **list/slice** patterns, nested patterns, case guards,
      exhaustiveness and the compiler's "not exhaustive" warnings, **union types** and **closed hierarchies**
      (both C# 15 preview) as the way to get exhaustive matching over a fixed set of cases, and the
      "data-driven algorithms" tutorial. 📊 **mermaid** — how a `switch` expression is evaluated top to bottom.
- [x] Task 24. `collections-and-iterators.adoc` — arrays (single-, multi-dimensional, jagged, `Array` methods,
      array covariance), **collection expressions** `[a, b, .. rest]` (and **collection-expression arguments
      `with(...)` — C# 15 preview**), `List<T>`, `Dictionary<TKey,TValue>`, `HashSet<T>`, `Queue<T>`/`Stack<T>`,
      `LinkedList<T>`, `SortedDictionary`/`SortedSet`, `PriorityQueue<T,P>`, the
      `IEnumerable<T>`/`IEnumerator<T>` contract, `foreach` desugaring, **iterators with `yield return`/`yield
      break`** (lazy evaluation, state machines), `IReadOnlyList<T>`/`IReadOnlyDictionary`, immutable and frozen
      collections, indices and ranges on arrays/lists/spans, `Span<T>` as a collection view,
      `Comparer<T>`/`EqualityComparer<T>` in collections, and a thread-safe collections pointer (Task 30).
      📊 **mermaid** — the collection interface hierarchy.
- [x] Task 25. `linq.adoc` — what LINQ is, query syntax vs. method syntax and how query expressions are
      translated (`from`/`where`/`select`/`orderby`/`group … by`/`join`/`let`/`into`), deferred vs. immediate
      execution, the standard query operators by family (filtering, projection incl. `SelectMany`, ordering,
      grouping, joining, set operations, partitioning, quantifiers, aggregation, element operators, conversion —
      `ToList`/`ToArray`/`ToDictionary`/`ToLookup`), `IEnumerable<T>` vs. `IQueryable<T>` (expression trees and
      providers such as EF Core), LINQ to XML in brief, `System.Text.Json` and JSON nodes in brief, a PLINQ
      pointer (Task 30), writing your own operators (extension methods + iterators), and performance tips
      (`Span`-based alternatives, avoiding multiple enumeration). 📊 **mermaid** — a query pipeline with deferred
      execution.
- [x] Task 26. `expression-trees-and-dynamic.adoc` — `Expression<TDelegate>` vs. delegates, building trees by
      hand (`Expression.Lambda`, `Parameter`, `Call`), compiling and executing, interpreting and translating
      trees (`ExpressionVisitor`), how `IQueryable` providers use them, restrictions on expression-tree lambdas;
      the `dynamic` type and the DLR (late binding, `ExpandoObject`, `DynamicObject`,
      `IDynamicMetaObjectProvider`, `dynamic` with COM), and when `dynamic` is and is not appropriate.

#### Error handling and resources

- [x] Task 27. `exceptions-and-error-handling.adoc` — `try`/`catch`/`finally`, exception filters (`when`),
      `throw` vs. `throw;` (rethrow) vs. `ExceptionDispatchInfo`, throw expressions, the `System.Exception`
      hierarchy and the common exception types, designing custom exceptions,
      `ArgumentException.ThrowIfNullOrEmpty`-style guard helpers, `AggregateException` and async exceptions,
      `finally` and `using` for cleanup, `TryParse`-style and result-object alternatives, unhandled-exception
      handlers, and best practices from the framework design guidelines. 📊 **mermaid** — exception propagation
      through the call stack with filters and `finally`.
- [x] Task 28. `memory-management-and-disposal.adoc` — the generational garbage collector (gen 0/1/2, LOH,
      server vs. workstation, concurrent GC), what allocates and what does not, `IDisposable` and the dispose
      pattern, `using` statements and **`using` declarations**, `IAsyncDisposable`/`await using`, finalizers and
      `SafeHandle`, `GC.SuppressFinalize`, weak references, `GC.Collect` and when not to call it, memory
      diagnostics (`dotnet-counters`, `dotnet-gcdump`), `ArrayPool<T>`/`MemoryPool<T>`. 📊 **SVG
      `modules/ROOT/images/csharp-gc-generations.svg`** — generations and promotion.

#### Concurrency and asynchrony

- [x] Task 29. `async-and-await.adoc` — the task-based asynchronous pattern, `async`/`await`,
      `Task`/`Task<T>`/`ValueTask<T>`, async return types (including `void` for event handlers and custom
      task-like types), how the compiler builds the state machine, synchronization contexts and
      `ConfigureAwait(false)`, composing tasks (`Task.WhenAll`/`WhenAny`/`WhenEach`), cancellation
      (`CancellationToken`/`CancellationTokenSource`, `WaitAsync`), timeouts, exceptions in async code,
      **async streams** (`IAsyncEnumerable<T>`, `await foreach`, `yield` in async iterators), `async Main`, and
      common pitfalls (sync-over-async deadlocks, `async void`, forgotten `await`). 📊 **mermaid sequence
      diagram** — an `await` yielding to the caller and resuming.
- [x] Task 30. `threads-and-synchronization.adoc` — `Thread` and `ThreadPool`, `Task.Run`, the `lock` statement
      and **`System.Threading.Lock` (.NET 9+)**, `Monitor`, `Mutex`/`Semaphore`/`SemaphoreSlim`, `Interlocked`,
      `volatile` and memory ordering, `ReaderWriterLockSlim`, thread-local storage, `Lazy<T>`,
      `ConcurrentDictionary`/`ConcurrentQueue`/`BlockingCollection`, `Channel<T>`, the Task Parallel Library
      (`Parallel.For`/`ForEach`/`ForEachAsync`, `Parallel.Invoke`), PLINQ (`AsParallel`), timers
      (`PeriodicTimer`), and race-condition/deadlock diagnosis. 📊 **mermaid** — producer/consumer over a channel.

#### Advanced language features

- [x] Task 31. `attributes-and-reflection.adoc` — applying attributes (targets, positional/named parameters,
      generic attributes), the compiler-recognised attributes (`[Obsolete]`, `[Conditional]`,
      caller-information attributes, `[ModuleInitializer]`, `[SkipLocalsInit]`, nullable-analysis attributes,
      `[InlineArray]`), writing custom attributes, reading attributes with reflection, the reflection API
      (`Type`, `MemberInfo`, `MethodInfo.Invoke`, `Activator.CreateInstance`, generics and reflection, `typeof`
      vs. `GetType`), `Assembly` loading, `System.Reflection.Emit` in brief, reflection's cost and its
      trimming/AOT-unfriendly nature, and **source generators / interceptors** as the modern alternative.
- [x] Task 32. `unsafe-code-spans-and-performance.adoc` — `Span<T>`/`ReadOnlySpan<T>`/`Memory<T>` and the
      **implicit span conversions (C# 14)**, `stackalloc`, `ref` locals/returns and `ref` fields in `ref
      struct`s, `scoped`, `unsafe` contexts and pointers (`*`, `&`, `->`, pointer arithmetic), `fixed`
      statements and fixed-size buffers, function pointers (`delegate*`), `sizeof`, `Unsafe`/`MemoryMarshal`
      helpers, the **updated memory-safety model (C# 15 preview — pointer relaxations, `unsafe(expr)`,
      `safe`)**, struct layout and `[StructLayout]`, the performance-engineering tutorials (reducing
      allocations, custom interpolated string handlers), and a BenchmarkDotNet pointer. 📊 **SVG
      `modules/ROOT/images/csharp-span-slicing.svg`** — a `Span<T>` slicing a stack buffer and a heap array
      without copying. (Requires `<AllowUnsafeBlocks>` in the Task 1.2 verification project.)
- [x] Task 33. `native-interop.adoc` — P/Invoke with `[DllImport]` and the source-generated `[LibraryImport]`,
      marshalling rules (strings, structs, arrays, callbacks via delegates and `[UnmanagedCallersOnly]`),
      `Marshal` and `SafeHandle`, `NativeLibrary`, COM interop (`[ComImport]`, RCW/CCW, `dynamic` with Office),
      C++/CLI in brief, calling C# from native code (Native AOT exports), cross-platform library probing, and
      interop with the **C reference on this site** (`xref:programming-languages/c/…`).
- [x] Task 34. `preprocessor-directives-and-compilation.adoc` — `#if`/`#elif`/`#else`/`#endif`,
      `#define`/`#undef` and `DefineConstants`, `#region`, `#nullable`, `#pragma warning`/`checksum`, `#line`,
      `#warning`/`#error`, the **file-based app directives (`#:package`, `#:sdk`, `#:property`, `#!` shebang —
      C# 14)**, the `[Conditional]` attribute, the compiler options that matter day to day (`LangVersion`,
      `Nullable`, `TreatWarningsAsErrors`, `WarningLevel`/warning waves, `AllowUnsafeBlocks`, `Deterministic`,
      `DocumentationFile`), and how `csc`/Roslyn is invoked by MSBuild.

#### Code organisation and tooling

- [x] Task 35. `namespaces-assemblies-and-projects.adoc` — namespaces vs. assemblies, `internal` and
      `[InternalsVisibleTo]`, `extern alias`, the SDK-style `.csproj` (target frameworks, multi-targeting,
      `PackageReference`, properties), solutions (`.sln`/`.slnx`), `global.json`, NuGet packages (consuming,
      authoring, `dotnet pack`), assembly versioning and strong names, deployment models (framework-dependent,
      self-contained, single-file, ReadyToRun, **trimming and Native AOT**), and how this relates to the ASP.NET
      Reference's project layouts (`xref:web/aspnet/…`). 📊 **mermaid** — from source files to assemblies to a
      published app.
- [x] Task 36. `coding-conventions-and-documentation.adoc` — Microsoft's C# coding conventions and identifier
      naming rules, the framework design guidelines (naming, member design), `.editorconfig` and code-style
      rules (IDE0xxx), analyzers and `dotnet format`, XML documentation comments (`<summary>`, `<param>`,
      `<returns>`, `<exception>`, `<see cref>`, `<inheritdoc/>`), generating docs with DocFX and
      `GenerateDocumentationFile`, and common idioms (guard clauses, expression-bodied members, `var` guidance,
      `is null` vs. `== null`).
- [ ] Task 37. `build-and-tooling.adoc` — the `dotnet` CLI in depth (`new`, `build`, `run`, `watch`, `test`,
      `publish`, `pack`, `tool`, templates), MSBuild basics and `Directory.Build.props`, Visual Studio 2026 /
      VS Code C# Dev Kit / Rider, debugging (breakpoints, conditional breakpoints, hot reload), diagnostics
      tools (`dotnet-counters`, `dotnet-trace`, `dotnet-dump`), Roslyn analyzers and source generators, LINQPad
      and `dotnet run file.cs` as scratchpads, and CI with GitHub Actions (`actions/setup-dotnet`).
- [ ] Task 38. `testing.adoc` — test projects and `dotnet test`, **xUnit** (facts, theories with
      `InlineData`/`MemberData`, fixtures, `IAsyncLifetime`), NUnit and MSTest equivalents in brief, the
      Microsoft Testing Platform, assertions, mocking with NSubstitute/Moq, test data builders, testing async
      code and cancellation, code coverage with coverlet, and integration-test pointers to the ASP.NET Core
      reference (`xref:web/aspnet/core/…`). This is the **only** page whose `== References` may link xunit.net /
      nunit.org alongside official Microsoft documentation.
- [ ] Task 39. `csharp-versions-and-whats-new.adoc` — a version table (C# 1.0 → 14 with year, paired
      .NET/Visual Studio release and headline features), the C# 13 / 14 features in one place with links to the
      pages above, the **C# 15 preview** feature list with its .NET 11 timeline, how to opt into preview
      features (`<LangVersion>preview</LangVersion>`), breaking changes and warning waves, and the
      language-design process (`dotnet/csharplang`, feature specs, Roslyn feature status). 📊 **mermaid
      timeline** of C# releases.

### Group 3 — Cheat sheet _(untagged)_

**Parallelizable: yes** (single task, but it must follow Group 2 — the cheat sheet's content and its
cross-references depend on every concept page's final heading structure).

- [ ] Task 40. C# cheat sheet
  - [ ] Task 40.1. Build a print-ready, single-page HTML/CSS layout — dense multi-column, colour-coded boxed
        sections covering: built-in types and literals; `var`/`const`/`readonly`; string interpolation and raw
        literals; operators (`??`, `?.`, `^`, `..`, `is`/`as`, `switch`); control-flow one-liners; method
        parameters (`ref`/`out`/`in`/`params`); class/struct/record/interface/enum skeletons; properties
        (`init`, `required`, `field`); primary constructors; generics and constraints; pattern-matching forms;
        delegates/lambdas/events; LINQ query and method syntax with the most-used operators; collection
        expressions and common collections; nullable annotations; exceptions; `using`/`IDisposable`;
        `async`/`await`/`Task` idioms; `lock`/`Interlocked`/`Parallel`; `Span<T>`/`stackalloc`; attributes and
        reflection one-liners; and `dotnet` CLI commands. Header line "C# Cheat Sheet — C# 14 / .NET 10",
        breadcrumb footer "Irurueta Docs · Guides & References / Programming Languages / C# Reference" —
        visually consistent with `kotlin-cheat-sheet.pdf` / `java-cheat-sheet.pdf` / `c-cheat-sheet.pdf`.
  - [ ] Task 40.2. Render it to PDF with headless Chromium (`--headless --print-to-pdf
        --no-pdf-header-footer`, binary at `/opt/pw-browsers/chromium`), verify it is **exactly one A4 page**
        with no clipping (page-object inspection plus a rendered preview screenshot), and save as
        `modules/ROOT/attachments/csharp-cheat-sheet.pdf`. Discard the HTML source — it is not checked in.
  - [ ] Task 40.3. Create `modules/ROOT/pages/programming-languages/csharp/cheat-sheet.adoc` — `= C# Cheat
        Sheet`, `:description:`, `:keywords:`, `include::partial$csharp-disclaimer.adoc[]`, a short paragraph
        listing what the sheet covers, cross-references to every concept page (Tasks 3–39) grouped under the
        same seven headings used in Group 2 and in the "What's covered" list (Task 41.2), ending with
        `xref:attachment$csharp-cheat-sheet.pdf[Download the C# Cheat Sheet (PDF)]`.

### Group 4 — Landing page, nav/index wiring, and build verification _(untagged)_

**Parallelizable: no** — the landing page's "What's covered" list must reflect the final file set from Groups
2–3, `nav-csharp.adoc` / `nav.adoc` / `programming-languages/index.adoc` must reference files that already
exist, and the build-verification task must run last against the fully-wired tree.

- [ ] Task 41. Create `modules/ROOT/pages/programming-languages/csharp/index.adoc` — the "C# Reference" landing
      page, mirroring `programming-languages/kotlin/index.adoc` and `programming-languages/c/index.adoc`:
  - [ ] Task 41.1. `= C# Reference`, `:description:`, `:keywords:` (including `C#, C# 14, .NET 10, LINQ,
        async/await`), `include::partial$csharp-disclaimer.adoc[]`, one intro paragraph on what C# is and that
        the section targets C# 14 on .NET 10, and a "New here? read in this order" pointer (Getting Started →
        C# and .NET → the Getting started pages in order → Types and object-oriented programming, then the
        remaining groups as needed). Point server-side/web readers at the ASP.NET Reference
        (`xref:web/aspnet/index.adoc[…]`) and Java readers at the Java Reference for the "C# for Java
        developers" comparison.
  - [ ] Task 41.2. `== What's covered` — the full bulleted list of Tasks 3–39 plus Task 40 (cheat sheet),
        grouped under the same seven headings used in Group 2: Getting started; Types and object-oriented
        programming; Functional programming; Error handling and resources; Concurrency and asynchrony; Advanced
        language features; Code organisation and tooling. One line per page, each a short summary in the same
        style/length as the Kotlin and C landing pages.
  - [ ] Task 41.3. `== Bibliography` section (anchor `_bibliography`), listing **every** source from the issue,
        each linked: Microsoft's *C# documentation* hub (with its Tour of C#, Fundamentals, Programming guide,
        LINQ, Asynchronous programming and Advanced topics sections); the *C# language reference*; *What's new
        in C#* (C# 14, C# 15 preview, and the version history); the *C# language specification* (the draft
        standard on Microsoft Learn, the feature specifications, ECMA-334 and ECMA-335, plus
        `dotnet/csharpstandard`, `dotnet/csharplang` and `dotnet/roslyn`); the *.NET documentation* (fundamentals,
        API browser, garbage collection, managed threading, parallel programming, memory and spans, native
        interop, collections, framework design guidelines, the SDK/CLI, deployment, unit testing, NuGet, DocFX);
        the *.NET support policy* and *.NET downloads*; *xUnit.net* and *NUnit* (testing page only); and the two
        consulted books — Albahari, *C# 12 in a Nutshell* (O'Reilly, December 2023, ISBN 978-1-098-14744-0),
        linked to the publisher's page and the author's companion site, and Skeet, *C# in Depth* 1st ed.
        (Manning, 2008, ISBN 1-933988-36-3), linked to the publisher's page (now listing the 4th edition) and
        csharpindepth.com, each marked as a consulted reference. Close with the house note (matching the Kotlin
        and C bibliographies) that the official documentation and the ECMA standard win on any discrepancy.
- [ ] Task 42. Wire navigation:
  - [ ] Task 42.1. Create `modules/ROOT/partials/nav-csharp.adoc`, written exactly like `nav-kotlin.adoc` /
        `nav-c.adoc` (its own `*`/`**` bullet depth, nesting via the open-block continuation at its include
        site): `* xref:programming-languages/csharp/index.adoc[C# Reference]`, then one `**` entry per page from
        Tasks 3–39 in the same grouped order as Task 41.2, then
        `** xref:programming-languages/csharp/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - [ ] Task 42.2. In `modules/ROOT/nav.adoc`, add `include::partial$nav-csharp.adoc[]` on its own line
        immediately **after** the existing `include::partial$nav-c.adoc[]` line inside the **same open block**
        under `Guides & References > Programming Languages` (the block at lines ~21–25, before
        `nav-javascript.adoc`) — the issue's append-order convention. Do **not** add a second include at the
        other `nav-kotlin.adoc` site (the `Apps > Android` block, line ~604) — that site is Kotlin/Android
        specific (see "Choices made").
- [ ] Task 43. Update `modules/ROOT/pages/programming-languages/index.adoc`:
  - [ ] Task 43.1. Add a seventh `== Sections` bullet,
        `xref:programming-languages/csharp/index.adoc[C# Reference]`, after the C bullet, in the same
        style/length as the other six (one-sentence summary of what the section covers — the C# language and the
        .NET BCL, targeting C# 14 on .NET 10 — ending "plus a downloadable cheat sheet").
  - [ ] Task 43.2. Refresh the page's `:description:`/`:keywords:` to mention C# / C# 14 / .NET 10.
- [ ] Task 44. Update `modules/ROOT/pages/index.adoc`'s `:keywords:` line to add `C#, C# 14, .NET 10, LINQ,
      async/await` (the issue's explicit instruction) — no other change to this file.
- [ ] Task 45. Build verification — delegate to a sub-agent so Antora's build output doesn't consume the main
      context window:
      ```
      Agent({
        description: "Verify Antora build for the C# Reference section",
        subagent_type: "iru-gate-runner",
        prompt: "Run `npm install` if node_modules is missing, then `npx antora antora-playbook.yml` at the
          repository root. Report back: whether the build succeeded, and the full text of any new AsciiDoc/xref
          warnings or errors (especially unresolved `xref:` targets under programming-languages/csharp/, any
          missing csharp-*.svg image reference, a malformed mermaid block, or a broken
          xref:attachment$csharp-cheat-sheet.pdf). Do not report a clean, unrelated build log verbatim — only
          problems, or a one-line confirmation that none were found."
      })
      ```
      Fix any reported broken `xref:`/image reference before considering this task done. Also confirm (directly,
      outside the sub-agent) that: `modules/ROOT/attachments/csharp-cheat-sheet.pdf` exists and is exactly one A4
      page (per Task 40.2); every `modules/ROOT/images/csharp-*.svg` referenced by a page (Tasks 3, 6, 11, 15,
      22, 28, 32) exists on disk; the `csharp/` directory contains exactly 39 `.adoc` files (37 concept pages +
      `index.adoc` + `cheat-sheet.adoc`); and the new section renders in both the site nav and the Lunr search
      index under `build/site`.
