# Implementation Plan: Guides & References — "Visual Basic" (Programming Languages)

## Task summary

Source: GitHub issue #280
Base branch: main

Issue [#280](https://github.com/albertoirurueta/docs/issues/280) adds an Antora section
`modules/ROOT/pages/programming-languages/visual-basic/` (nav title **Visual Basic Reference**): a detailed language reference for
**Visual Basic 17.13 on .NET 10 (LTS) with Visual Studio 2026** (.NET 11 marked upcoming, or current if GA'd by implementation time).
**66 pages** (incl. `index.adoc` with the Bibliography and `cheat-sheet.adoc`), `visual-basic-disclaimer.adoc` and `nav-visual-basic.adoc`
partials, original `visual-basic-*.svg` figures and Mermaid diagrams, back-links from existing pages, and a one-page A4 PDF
`modules/ROOT/attachments/visual-basic-cheat-sheet.pdf`. Running scenario: the original **shelf** library-catalogue .NET solution
(`Shelf.slnx`: `Shelf.Core`, `Shelf.Data`, `Shelf.Cli`, `Shelf.Desktop`, `Shelf.Wpf`, `Shelf.Tests`, a small legacy corner), the same domain as
the Rust/Go/Ruby references.

**The binding spec** is the issue body plus one comment (the page outline, split for GitHub's size limit):
https://github.com/albertoirurueta/docs/issues/280#issuecomment-6096735049. Local copies (session scratchpad):
`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/dca94ac7-0c58-4c76-a5ae-d6c42de6b014/scratchpad/issue280.md` (body) and
`comment280.md` (outline); re-fetch with `gh issue view 280 --json body,comments` if missing. **Every page task must re-read its own outline
bullets** (★ depth, 📊 figures, source abbreviations VB/LR/PG/DA/SPEC/VBC/API/NET/WF/WPF/RO, QS/MV chapter notes, "book outdated" notes) plus
the issue's "Concepts contributed by the books", "Where the books are outdated" and "Book errata" tables.

### Choices made on the user's behalf

1. **Branch `feature/280-add-visual-basic-reference-section`** (from `main`, user-confirmed base), **one draft PR to `main`** with `Closes #280`
   (the issue suggests 5 PRs on `feature/280-visual-basic`; groups follow the outline sections so the work could still be cut that way).
2. **Tasks are untagged.** No VB/docs coding key exists and the work is AsciiDoc/Mermaid/SVG/PDF authoring, so tasks are implemented directly.
   VB code in pages is **built and run for real** in a scratch directory (never committed).
3. **Toolchain** (Task 1): the host has no `dotnet`, but Docker 29.8.1 is running. Following the Fortran (#277) precedent, examples are built/run in
   the official `mcr.microsoft.com/dotnet/sdk` images (.NET 10, and .NET 11 if available) mounting a scratchpad directory; nothing is installed on
   the host and nothing is committed. **Task 1.1 confirms Docker use with the user before pulling images.** Windows-only examples (WinForms, WPF,
   COM, `Declare` against Windows DLLs, `My.Computer` devices) are built with `-p:EnableWindowsTargeting=true` and labelled "built, not run".
4. **Books**: the two PDFs in `~/Desktop/libros/vb/` are copyrighted. Consulted only for concept coverage, structure and the "book is outdated"
   prose; cited on the landing-page bibliography by publisher page (Sonar Publishing: labelled Bookshop.org retailer listing unless an official
   page exists). No book text, listing, figure, exercise or project is reproduced; nothing from them is committed or attached.
5. **Disclaimer** `visual-basic-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc` (single `[IMPORTANT]` AI-assistance disclosure + xref to
   `programming-languages/visual-basic/index.adoc#_bibliography`). It is the **only** admonition in the section; every other remark is prose or a
   table row. It does not copy the version paragraph of `csharp-disclaimer.adoc`.
6. **Nav placement**: `include::partial$nav-visual-basic.adoc[]` goes **directly after `nav-csharp.adoc`** (currently `modules/ROOT/nav.adoc` line 27),
   inside the Programming Languages open block (this differs from the Fortran/Ruby precedent, which went last). `nav-visual-basic.adoc` is a
   relative-depth partial like `nav-csharp.adoc`: first line `* xref:programming-languages/visual-basic/index.adoc[Visual Basic Reference]`, one
   `**` entry per page in outline order (optionally grouped under non-link headings), ending with `** …cheat-sheet.adoc[Cheat Sheet (PDF)]`.
7. **Version baseline re-verified at implementation time and dated** (Task 1.2): .NET 10 SDK/LTS dates, .NET 11 GA status (expected 10–13 Nov 2026),
   VS 2026 version, VB `LangVersion` values, the book publisher pages (Packt, Sonar), VBScript/VB6 support dates, and every URL in the issue.
   Unverifiable items are described without naming a release. The stale Learn `Like` note and the `LangVersion` doc gap are verified by test.
8. **Existing pages get real `xref:`s** (targets verified with `ls`: C# pages, `web/aspnet/{web-forms,mvc,core}/*`, `backend/office-files/*`,
   `database/*`); #191, #196, #243, #247, #255, #275, #276 and #277 are mentioned in prose only (no `xref:`).
9. **Figures**: every 📊 in the outline is delivered as Mermaid or an original `visual-basic-*.svg` (no Microsoft logos, Learn figures or book
   figures); every SVG is referenced by a page; every Mermaid block passes `npm run validate:mermaid`.
10. **Cheat-sheet PDF** is rendered from a throwaway HTML page in the scratchpad with headless Chrome (as for the other cheat sheets), checked to be
    exactly one A4 page (`pdfinfo` is not installed — use a Python PDF library or Chrome output check) and previewed as PNG; only the PDF is committed.
11. `highlight.js` in the UI bundle has no `vbnet` language: keep `[source,vbnet]` anyway (adding it is out of scope; may be raised with #255).

### Current code state

- Repo is the Antora playbook + `ROOT` component; no application source. Build: `npm install` (node_modules present, Node v24),
  `npx antora antora-playbook.yml`; Mermaid check `npm run validate:mermaid` (after one-off `npm i --no-save mermaid@11 jsdom`).
- Precedent sections (structural templates): `programming-languages/{go,ruby,fortran}/` (#275–#277); `programming-languages/csharp/` for the .NET
  platform pages to link (`csharp-and-dotnet`, `linq`, `async-and-await`, `generics`, `memory-management-and-disposal`, `native-interop`,
  `build-and-tooling`, `testing`, `namespaces-assemblies-and-projects`, `cheat-sheet`); templates `partials/rust-disclaimer.adoc`,
  `partials/nav-csharp.adoc`, `partials/fortran-disclaimer.adoc`/`nav-fortran.adoc`; cheat sheets `programming-languages/{csharp,go,ruby,fortran}/cheat-sheet.adoc`
  with `modules/ROOT/attachments/*-cheat-sheet.pdf`; archived precedent plans `.archive/implementation_plan_{275,276,277}.md` (277 is the closest).
- `modules/ROOT/pages/programming-languages/visual-basic/` does not exist yet. No VB partials exist.
- Files to modify: `modules/ROOT/nav.adoc` (include), `modules/ROOT/pages/programming-languages/index.adoc` (bullet after the C# bullet at ~line 42,
  `:description:` line 2, `:keywords:` line 3, "live only here" sentence ~line 8), `programming-languages/csharp/csharp-and-dotnet.adoc`
  (`== Interoperating with F# and Visual Basic`, ~line 176) and `web/aspnet/web-forms/index.adoc` (one-line back-links); root `index.adoc`
  description/keywords only if they list language references.
- Images live flat in `modules/ROOT/images/` (bare filenames). `.secrets.baseline` is updated by the security scan per repo practice.
- Repository host: GitHub (albertoirurueta/docs). Project type: `other` (documentation-only). Antora docs: repo root is the Antora component `ROOT`.

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$visual-basic-disclaimer.adoc[]`; intro states the baseline (Visual Basic 17.13
  on .NET 10, SDK 10.0.4xx or newest at implementation time).
- Each example: `[source,vbnet]`, complete program/module/class where practical, starts with `Option Strict On` (except the labelled late-binding file
  on `early-and-late-binding`), `&` for concatenation, `AndAlso`/`OrElse`, `Is Nothing`, PascalCase, no Hungarian prefixes; builds warning-free on the
  .NET 10 SDK and runs with `dotnet run`; real output in `[source,text]`; other tags: `xml` (`.vbproj`/XAML), `bash`, `powershell`/`text`,
  `csharp` (interop), `sql`, `json`. Followed by `Source: https://learn.microsoft.com/dotnet/…[…]` (locale-free link, looked up, never guessed; API links
  without `?view=` unless framework-specific). Follows the shelf scenario; no real secrets, credentials or machine-specific paths.
- Depth: rationale, exact rules (spec chapter, Language Reference page per keyword/operator/modifier/function/option), VB version that introduced it,
  C# differences, common BC errors (links to `misc/bcNNNNN`), runtime exceptions, pitfalls, platform notes (.NET vs Framework, Windows-only, `MyType`,
  trimming/AOT). ★ pages are the most detailed in the section.
- Each page covers where the books are outdated for its concepts (prose/tables only; never reproduce QS/MV errata) and ends with `== References`
  (official docs and publisher pages only).
- AsciiDoc pitfalls (`CLAUDE.md` + issue): inline code containing `'`, `#`, `^`, `*`, `~`, `<=`, `=>`, `<-`, `->`, `...`, `{`, `__` → `` `+…+` ``;
  containing `+` → `` `pass:c[…]` `` (`]` written `\]`); same in headings and link text. Image macros on one line, quoted alt when it contains a comma,
  column 0 with blank lines around. Mermaid: `&lt;` before letters, stereotypes as `&lt;&lt;interface&gt;&gt;`.
- Admonitions: none except the disclaimer include.
- Each group's last task runs that group's verification: build/run extracted examples (delegate to a sub-agent so output stays out of the main
  context — `iru-gate-runner`/general), plus the `CLAUDE.md` greps on the group's files (see Task 18.2).

## Implementation steps

### Group 1 — Foundations (Parallelizable: no — Task 2 depends on the baseline verified in Task 1)

- [x] Task 1. Toolchain and baseline
  - [x] Task 1.1. Confirm with the user, then pull the `mcr.microsoft.com/dotnet/sdk` images (.NET 10; .NET 11 if published); record the containerised build/run script used for example checks (scratchpad only); note which examples can only be "built, not run"
  - [x] Task 1.2. Re-verify the issue's version baseline and every cited URL (VB Guide, Language Spec, strategy, What's new, `LangVersion` values, .NET/VS 2026 versions and dates, .NET 11 status, VB6/VBScript/Upgrade Assistant/Copilot modernization status, Packt and Sonar pages, Packt errata) and record dated results in the scratchpad; verify by test the `Like` operator on .NET and the `Option` defaults of the SDK props
  - [x] Task 1.3. Build the *shelf* reference solution in the scratchpad (`Shelf.slnx`: Core with `Isbn`/`Book`/`Author`/`LoanState`/`Loan`/`CatalogItem`/`Magazine`/`ICatalogStore`/`Catalog`; Data in-memory/JSON/SQLite+EF Core; Cli with `TextFieldParser`, XML literals, LINQ, async ISBN lookup; WinForms and WPF fronts; MSTest/xUnit/NUnit tests; legacy corner) so pages share consistent names
- [x] Task 2. Shared partials and skeleton
  - [x] Task 2.1. `modules/ROOT/partials/visual-basic-disclaimer.adoc` modelled on `rust-disclaimer.adoc`
  - [x] Task 2.2. `modules/ROOT/partials/nav-visual-basic.adoc` (relative-depth, modelled on `nav-csharp.adoc`; all 66 pages in outline order, cheat sheet last)
  - [x] Task 2.3. `include::partial$nav-visual-basic.adoc[]` in `modules/ROOT/nav.adoc` directly after `nav-csharp.adoc`, inside the open block

### Group 2 — Getting started and core language (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 3. Write the getting-started pages (4, excluding the landing page) and core-language pages (12) under `modules/ROOT/pages/programming-languages/visual-basic/`
  - [x] Task 3.1. `getting-started.adoc` ★ (📊 build-pipeline SVG `visual-basic-build-pipeline.svg`)
  - [x] Task 3.2. `visual-basic-and-dotnet.adoc` (📊 "can I build X in VB on .NET 10?" Mermaid flowchart; app-model support matrix)
  - [x] Task 3.3. `history-versions-and-language-strategy.adoc` (📊 timeline; version table with `LangVersion`; collects book-outdated notes)
  - [x] Task 3.4. `visual-basic-for-programmers-of-other-languages.adoc` (📊 "which VB feature replaces …" flowchart)
  - [x] Task 3.5. `program-structure-and-code-conventions.adoc` (📊 source-file layout diagram)
  - [x] Task 3.6. `option-statements.adoc` ★
  - [x] Task 3.7. `data-types-and-literals.adoc` ★ (📊 numeric-types SVG `visual-basic-numeric-types.svg`)
  - [x] Task 3.8. `type-conversions.adoc` ★ (📊 "which cast?" flowchart)
  - [x] Task 3.9. `variables-constants-and-scope.adoc` (includes the uninitialized loop-local pitfall)
  - [x] Task 3.10. `enumerations.adoc`
  - [x] Task 3.11. `operators-and-expressions.adoc` ★ (📊 precedence-ladder SVG `visual-basic-operator-precedence.svg`; stale `Like` note)
  - [x] Task 3.12. `control-flow.adoc` ★ (📊 `Do While` vs `Do … Loop While` flowcharts)
  - [x] Task 3.13. `nothing-and-nullable-value-types.adoc`
  - [x] Task 3.14. `strings-and-text.adoc` ★
  - [x] Task 3.15. `dates-times-and-formatting.adoc`
  - [x] Task 3.16. `numbers-and-math.adoc`
  - [x] Task 3.17. Run this group's verification (build/run examples via sub-agent; greps on the group's files)

### Group 3 — Procedures, types and object-oriented programming (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 4. Write the procedures and functional-features pages (5)
  - [x] Task 4.1. `procedures-sub-and-function.adoc` ★
  - [x] Task 4.2. `delegates-and-lambda-expressions.adoc`
  - [x] Task 4.3. `extension-methods-and-partial-methods.adoc`
  - [x] Task 4.4. `iterators-and-yield.adoc`
  - [x] Task 4.5. `generics.adoc` ★ (📊 class diagram `ICatalogStore` / `Repository(Of T …)`)
- [x] Task 5. Write the types and OOP pages (10)
  - [x] Task 5.1. `classes-and-objects.adoc` ★
  - [x] Task 5.2. `properties-and-default-properties.adoc`
  - [x] Task 5.3. `modules-and-shared-members.adoc`
  - [x] Task 5.4. `structures-and-value-types.adoc`
  - [x] Task 5.5. `inheritance-and-polymorphism.adoc` ★ (📊 `CatalogItem`/`Book`/`Magazine` class diagram)
  - [x] Task 5.6. `interfaces.adoc`
  - [x] Task 5.7. `events-and-handlers.adoc` ★ (📊 sequence diagram `Loan.Return()` → `RaiseEvent` → `Handles`)
  - [x] Task 5.8. `operator-overloading-and-equality.adoc`
  - [x] Task 5.9. `tuples-and-anonymous-types.adoc`
  - [x] Task 5.10. `object-lifetime-and-disposal.adoc`
- [x] Task 6. Run this group's verification (Tasks 4–5)

### Group 4 — Arrays/collections/LINQ/XML, errors, async and concurrency, runtime library and I/O (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 7. Write the arrays, collections, LINQ and XML pages (4)
  - [x] Task 7.1. `arrays.adoc` ★
  - [x] Task 7.2. `collections.adoc` ★
  - [x] Task 7.3. `linq-query-expressions.adoc` ★ (📊 query clause-pipeline flowchart)
  - [x] Task 7.4. `xml-literals-and-axis-properties.adoc` ★
- [x] Task 8. Write the errors, async and concurrency pages (4)
  - [x] Task 8.1. `structured-exception-handling.adoc` ★
  - [x] Task 8.2. `unstructured-error-handling-on-error.adoc` (the only page besides legacy ones where `On Error` appears)
  - [x] Task 8.3. `async-and-await.adoc` ★ (📊 awaited `HttpClient` sequence diagram)
  - [x] Task 8.4. `threads-parallelism-and-synchronization.adoc`
- [x] Task 9. Write the runtime library, `My` and I/O pages (4)
  - [x] Task 9.1. `the-my-namespace.adoc` ★
  - [x] Task 9.2. `visual-basic-runtime-library.adoc`
  - [x] Task 9.3. `files-directories-and-streams.adoc` (includes `TextFieldParser` CSV)
  - [x] Task 9.4. `serialization-json-and-xml.adoc` (`BinaryFormatter` removal)
- [x] Task 10. Run this group's verification (Tasks 7–9)

### Group 5 — Compilation/binding, interoperability and applications (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 11. Write the compilation, binding and reflection pages (3) and interoperability pages (3)
  - [x] Task 11.1. `conditional-compilation-and-directives.adoc`
  - [x] Task 11.2. `attributes-caller-info-and-reflection.adoc`
  - [x] Task 11.3. `early-and-late-binding.adoc` (the only page with `Option Strict Off`, in one labelled file)
  - [x] Task 11.4. `interop-with-csharp-and-other-dotnet-languages.adoc` (📊 `Shelf.slnx` VB+C# project diagram; C# side as `[source,csharp]`)
  - [x] Task 11.5. `native-interop-declare-and-pinvoke.adoc` (Windows-only examples labelled)
  - [x] Task 11.6. `com-interop-and-office-automation.adoc` (links `backend/office-files/*`)
- [x] Task 12. Write the applications pages (6)
  - [x] Task 12.1. `console-applications.adoc`
  - [x] Task 12.2. `windows-forms-applications.adoc` ★ (📊 Application Framework start-up SVG `visual-basic-application-framework-startup.svg`; built, not run)
  - [x] Task 12.3. `wpf-applications.adoc`
  - [x] Task 12.4. `data-access-ado-net-and-ef-core.adoc` ★ (📊 "which data-access API?" flowchart; links `web/aspnet/core/data-access-ef-core`, `web/aspnet/mvc/data-access-ef6`, `database/*`)
  - [x] Task 12.5. `web-http-and-services.adoc` (links `web/aspnet/{web-forms,mvc,core}`)
  - [x] Task 12.6. `libraries-packaging-and-deployment.adoc`
- [x] Task 13. Run this group's verification (Tasks 11–12)

### Group 6 — Tooling, practice, legacy and migration (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 14. Write the tooling pages (4) and practice/legacy/migration pages (5)
  - [x] Task 14.1. `projects-msbuild-and-the-dotnet-cli.adoc` ★ (📊 properties → `vbc` options diagram; every `vbc` option and VB MSBuild property by name and purpose)
  - [x] Task 14.2. `debugging-and-diagnostics.adoc`
  - [x] Task 14.3. `testing.adoc` ★ (MSTest/xUnit/NUnit variants)
  - [x] Task 14.4. `xml-documentation-analyzers-and-code-style.adoc`
  - [x] Task 14.5. `best-practices-and-common-pitfalls.adoc` (gotcha table)
  - [x] Task 14.6. `security-and-cryptography.adoc`
  - [x] Task 14.7. `design-patterns-in-visual-basic.adoc`
  - [x] Task 14.8. `the-vb-family-vb6-vba-and-vbscript.adoc` (📊 family-tree SVG `visual-basic-family-tree.svg`; legacy snippets only here, labelled; collects book-outdated and errata notes)
  - [x] Task 14.9. `migrating-legacy-visual-basic.adoc` (📊 migration-paths flowchart; "legacy → modern" table matching the cheat-sheet strip)
- [x] Task 15. Run this group's verification (Task 14)

### Group 7 — Landing page, cheat sheet and PDF (Parallelizable: no — landing page and cheat sheet summarise every earlier page; the bibliography needs every source used)

- [x] Task 16. `index.adoc` landing page, cheat sheet and PDF
  - [x] Task 16.1. `index.adoc`: what VB is, version baseline and strategy paragraph, shelf scenario, "New here? Read in this order" path, "Coming from VB6, VBA or VBScript?", `== What's covered` grouped as the outline, 📊 section mind-map, `== Bibliography` (both books, VB Guide and Spec, .NET/desktop/data/testing/VS docs, support policies, language-design repos, legacy-family pages, labelled community tools, specifications; every source used on any page appears here)
  - [x] Task 16.2. `cheat-sheet.adoc` (disclaimer, intro with baseline/date and `xref:attachment$visual-basic-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` paragraphs of `xref:`s to every page, final download line, `== References`; modelled on `csharp/cheat-sheet.adoc`)
  - [x] Task 16.3. Generate the one-page A4 PDF `modules/ROOT/attachments/visual-basic-cheat-sheet.pdf` covering every concept in the issue's cheat-sheet list (header "Visual Basic 17.13 · .NET 10" + date, the "legacy → modern" strip); verify exactly one page and preview as PNG; commit only the PDF
  - [x] Task 16.4. Add any original `visual-basic-*.svg` figures not yet created; confirm every SVG is referenced and every 📊 is delivered

### Group 8 — Integration and back-links (Parallelizable: yes — disjoint files, none depends on another)

- [x] Task 17. Integration
  - [x] Task 17.1. `programming-languages/index.adoc`: Visual Basic Reference bullet after the C# bullet naming VB 17.13 on .NET 10 and ending ", plus a downloadable cheat sheet."; `:description:`; `:keywords:` (add `Visual Basic, VB.NET, Visual Basic 17.13, .NET 10, Option Strict, My namespace, Windows Forms, WPF, LINQ, XML literals, VB6, VBA`); "live only here" sentence; root `index.adoc` description/keywords only if they list language references
  - [x] Task 17.2. Back-links (one line each, `xref:` targets verified with `ls`): `programming-languages/csharp/csharp-and-dotnet.adoc` (`== Interoperating with F# and Visual Basic`, link `interop-with-csharp-and-other-dotnet-languages` and `early-and-late-binding`) and `web/aspnet/web-forms/index.adoc` ("Visual Basic code-behind" link)

### Group 9 — Verification, docs build and secrets (Parallelizable: no — runs on the finished section)

- [x] Task 18. Build and verify
  - [x] Task 18.1. `npx antora antora-playbook.yml`: zero xref/AsciiDoc errors or warnings; Visual Basic nav appears under Programming Languages directly after C#
  - [x] Task 18.2. Run the `CLAUDE.md` greps (block/inline image closure, `<p>image::` in `build/site`, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/programming-languages/visual-basic`); all must print nothing
  - [x] Task 18.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`; every diagram parsed
  - [x] Task 18.4. Checks: 66 page files exist and match `nav-visual-basic.adoc`; no admonition other than the disclaimer; every `image::` target exists and every `visual-basic-*.svg` is referenced; no `xref:` to #191/#196/#243/#247/#255/#275/#276/#277 targets; no `Option Strict Off`, `+` concatenation, `IIf`-for-`If()`, `On Error`, `BinaryFormatter`, `HttpWebRequest`, `System.Data.SqlClient`, `WebClient` or `SHA256Managed` outside their permitted pages; no book content or book PDF committed
  - [x] Task 18.5. Run `/iru-check-security` (docs repo: detect-secrets findings in examples are expected false positives, label `is_secret: false`; update `.secrets.baseline` per repo practice)
- [x] Task 19. Final hygiene: review `git status` so only intended files are staged (nothing under `~/Desktop/libros`, no `.DS_Store`, no `implementation_plan.md` left unarchived)
