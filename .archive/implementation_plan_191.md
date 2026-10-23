# Implementation Plan: Guides & References / Apps — Windows Apps

## Task summary

Source: GitHub issue #191
Base branch: main

Issue [#191](https://github.com/albertoirurueta/docs/issues/191) asks for a new **Windows Apps** section at
**Guides & References → Apps → Windows Apps** (`modules/ROOT/pages/apps/windows/`), placed in `nav.adoc` after the
Apple Platforms block and before Media Optimization. It teaches building Windows desktop apps with C# on .NET 10:
XAML, WPF (central), the MVVM pattern with the MVVM Toolkit (central), WinUI 3 / Windows App SDK, Windows Forms,
and publishing/distribution (central: .NET publish, MSIX, signing, Store, WinGet, App Installer, ClickOnce, CI/CD).
One running scenario, *Bookshelf Desktop*, spans all pages. It ships 50 pages (landing + 48 concept pages + cheat
sheet page), a one-page A4 cheat-sheet PDF, a disclaimer partial, `windows-apps-*.svg` figures, nav/landing/root
updates and back-links.

**The issue body is the primary, authoritative spec.** It holds the per-page outline (`## Page outline`, file name,
title, content, figures, ★ marks), the "Official documentation explored" table with source URLs, the book
cross-check tables, page conventions, bibliography and acceptance criteria. Every task that authors a page **must
re-read its outline row and the shared sections in full** (`gh issue view 191 --json body -q .body`; a local copy
can be saved to the scratchpad). This plan lists files and the contract, not the whole text.

Choices made during exploration/planning (none ambiguous enough to ask about):

1. **Ship everything in one branch and pass** (`feature/191-add-windows-apps-section`), exactly as specified, instead
   of the optional five-PR split — mirroring `.archive/implementation_plan_168.md` (Kotlin Multiplatform). The
   groups below follow the issue's suggested split (foundations/XAML, WPF, MVVM, other stacks, publishing), so a
   split into PRs remains possible.
2. **Tasks are untagged (no language key).** None of the installed `*-code-one-task` skills authors AsciiDoc/SVG/PDF
   documentation; every task is implemented directly. The C#/XAML/YAML snippets are page *content*, not
   repository source.
3. **Disclaimer rule:** `windows-disclaimer.adoc` is an `[IMPORTANT]` block saying only that the content was
   AI-assisted and should be verified against the official documentation, linking
   `xref:apps/windows/index.adoc#_bibliography[the section bibliography]`. It is the **only** admonition in
   `apps/windows/**`; caveats are prose, tables or a "Pitfalls" subsection.
4. **Versions and URLs are re-verified at implementation time** (Task 1) against live Microsoft Learn, NuGet,
   GitHub releases and the .NET support policy before any page states them. Baseline (verified 2026-10-10): .NET 10
   LTS (patch 10.0.12), .NET 8/9 EOL 2026-11-10, .NET 11 RC1 (GA expected 10–13 Nov 2026), Windows App SDK 2.x,
   CommunityToolkit.Mvvm 8.4.x, Visual Studio 2026. Deviations are recorded under Task 1 and applied consistently.
5. **No `xref:` to a page that does not exist.** Related issues #280, #236, #196, #263, #247 are mentioned in prose
   only. Nav, landing and back-links are added last (Group 9), after every target page exists.
6. **Books** (Packt) are named only on the landing page's bibliography and in `== References` where a book
   contributed; they are never quoted. Local book PDFs under `~/Desktop/libros/windows/` are read, never copied.
7. **Cheat-sheet PDF pipeline** (from #168/#169/#175/#187/#192): HTML/CSS authored in the scratchpad and never
   committed → headless Chrome `--print-to-pdf --no-pdf-header-footer` → PyMuPDF check `page_count == 1` and
   595×842 pt → PNG preview inspected for clipping → only the PDF is committed.
8. **XAML braces:** every inline XAML markup extension (`+{Binding Title}+`, `+{x:Bind ...}+`, lambdas
   `+() => …+`) uses a `+...+` or `pass:c[...]` passthrough per `CLAUDE.md`; Mermaid stereotypes use
   `&lt;&lt;interface&gt;&gt;`.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`apps/windows/index.adoc`, `cheat-sheet.adoc` and every page in the outline (50 files) exist." | Tasks 3–9, 11, 12 |
| 2 | "**Windows Apps** appears in `nav.adoc` under Apps, after the Apple Platforms block and before Media Optimization. It lists every page in outline order and ends with the cheat sheet." | Task 14 |
| 3 | "`apps/index.adoc` has the new bullet, and its intro, `:description:` and `:keywords:` are updated. The root `index.adoc` `:description:` / `:keywords:` mention Windows apps." | Task 15 |
| 4 | "The back-links listed under \"New nav placement\" are added, including replacing the \"planned but does not exist yet\" sentence in `ai/hugging-face/windows-and-dotnet.adoc`. No `xref:` points to a page that doesn't exist." | Task 16, Task 17 |
| 5 | "Every concept row of the \"Official documentation explored\" table has a dedicated page (or a clearly titled section of a page in the outline). XAML, WPF, MVVM and publishing / distribution are covered by the ★ pages in full detail." | Tasks 3–9 |
| 6 | "Every row of \"Concepts the books contribute\" is covered by the page named. The book-outdated points are reflected (.NET 10, no AOT/trimming for WPF/WinForms, signing added to WinGet)." | Tasks 3–9, Task 17 |
| 7 | "Every ★ page has **detailed** content: explanation, all relevant options and settings, a cross-stack comparison where relevant, pitfalls / performance / security notes, and complete runnable examples." | Tasks 3–9 |
| 8 | "Every code example uses current APIs (.NET 10, C# 14, MVVM Toolkit 8.4.x partial properties, Windows App SDK 2.x) and follows the *Bookshelf Desktop* scenario." | Task 1, Tasks 3–9 |
| 9 | "Each example is **followed by a link to the official documentation page it derives from**." | Tasks 3–9, Task 17 |
| 10 | "Pages state honestly what the official docs do **not** provide (see \"Gaps\") instead of inventing APIs, and third-party tools are labelled as such." | Tasks 3–9, Task 11 |
| 11 | "Versions and dates were re-verified at implementation time ... `whats-new-and-version-history.adoc` collects the changes." | Task 1, Task 9 |
| 12 | "Every page passes the `CLAUDE.md` checks: the three `image::` grep checks and the unquoted-comma alt-text check print nothing; the inline-code substitution grep prints nothing for `build/site/**/apps/windows`." | Task 17 |
| 13 | "Mermaid diagrams and `windows-apps-*.svg` figures are added at least where 📊 is suggested. Every new SVG is referenced by a page." | Tasks 3–9, Task 17 |
| 14 | "`npm run validate:mermaid` reports every diagram as parsed." | Task 17 |
| 15 | "`partials/windows-disclaimer.adoc` exists and is included on every page of the section." | Task 2, Tasks 3–9, 11, 12 |
| 16 | "The **only** admonition in the section is the AI-assistance notice" (grep prints nothing). | Task 17 |
| 17 | "`index.adoc` has `== Bibliography` listing every source used, each linked to its official website (books to the publisher's page), and all links resolve (Packt links checked in a browser). Every page has `== References`." | Task 11, Tasks 3–9 |
| 18 | "`cheat-sheet.adoc` links `modules/ROOT/attachments/windows-apps-cheat-sheet.pdf`, which is a **single A4 page** summarising every concept of the section." | Task 12, Task 13 |
| 19 | "`npx antora antora-playbook.yml` completes with no `xref` / AsciiDoc errors or warnings, and the section renders correctly in `build/site`." | Task 17 |

## Current code state

- **No `modules/ROOT/pages/apps/windows/` directory**, no `modules/ROOT/partials/windows-disclaimer.adoc`, no
  `modules/ROOT/images/windows-apps-*.svg` and no `modules/ROOT/attachments/windows-apps-cheat-sheet.pdf`.
- **`modules/ROOT/nav.adoc`**: `** xref:apps/index.adoc[Apps]` at line 1797; children Android (1798), Kotlin
  Multiplatform (1844), React Native (1877), Apple Platforms (1908, last child `apps/apple/cheat-sheet.adoc` at
  1961), then `*** xref:apps/media-optimization/index.adoc[Media Optimization]` (1962). The new `***` block goes
  between 1961 and 1962. Nav labels equal each page's `= Title`.
- **`modules/ROOT/pages/apps/index.adoc`**: has a bullet per section (Kotlin Multiplatform line 17, React Native
  line 26); add Windows Apps before Media Optimization and update intro, `:description:`, `:keywords:`.
- **Models to mirror:** `partials/apple-disclaimer.adoc` (disclaimer); `apps/kotlin-multiplatform/index.adoc` and
  `cheat-sheet.adoc` (landing/cheat-sheet shape: `link:{attachmentsdir}/...pdf[...]`); `images/apple-*.svg`,
  `images/android-*.svg` (SVG style); `attachments/kotlin-multiplatform-cheat-sheet.pdf` and
  `attachments/android-cheat-sheet.pdf` (house PDF style); `scripts/validate-mermaid.mjs`
  (`npm run validate:mermaid`, needs a one-off `npm i --no-save mermaid@11 jsdom`).
- **Existing pages to link, not duplicate:** `programming-languages/csharp/*`,
  `web/aspnet/core/blazor-webassembly-hybrid-and-deployment.adoc`, `ai/hugging-face/windows-and-dotnet.adoc`
  (line 16 says a Windows Apps section "is planned but does not exist yet"),
  `apps/android/app-architecture.adoc`, `apps/apple/app-architecture.adoc`,
  `apps/kotlin-multiplatform/architecture-and-shared-viewmodels.adoc`, `web/gwt/mvp-activities-and-places.adoc`,
  `web/aspnet/web-forms/migrating-to-modern-aspnet.adoc`, `apps/apple/macos-distribution-outside-the-app-store.adoc`,
  `apps/android/publishing-on-google-play.adoc`.
- Repo is a docs-only Antora site; no application source or test suite. Verification is the Antora build plus the
  `CLAUDE.md` greps and `npm run validate:mermaid`.
- Precedents in `.archive/`: `implementation_plan_168.md` (KMP, closest model), `_161` (React Native), `_169`/`_73`
  (Android), `_172`–`_175` (Apple, in parts), `_176` (Media Optimization).

## Implementation steps

### Group 1 — Baseline verification and shared scaffolding
Parallelizable: no — Task 2 and every later page depend on the versions and URL decisions recorded by Task 1.

- [x] Task 1. Re-verify the version baseline and source URLs
  - [x] Task 1.1. Save the issue body to the scratchpad (`gh issue view 191 --json body -q .body`) for reuse.
    Saved to `/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/64af6c9f-e5a4-4b8a-929d-8f03b1c64cd6/scratchpad/issue-191.md`
    (expanded URL list: `.../scratchpad/all.txt`, results `.../scratchpad/res.txt`).
  - [x] Task 1.2. Re-check against live sources (2026-10-23). Deviations from the 2026-10-10 baseline, to apply on
    every page and in `whats-new-and-version-history`:
    - **.NET 10 LTS latest patch is now 10.0.13 (2026-10-13)**, not 10.0.12; support until 2028-11-14 unchanged.
    - .NET 8 (8.0.32) and .NET 9 (9.0.21) still end support **2026-11-10** (maintenance phase).
    - **.NET 11 is at RC2 (11.0.0-rc.2, 2026-10-13, go-live)**, not RC1; GA still expected at .NET Conf 10-13 Nov
      2026. The WPF page is still titled "What's new in WPF for .NET 11 RC 1".
    - **Visual Studio 2026: latest is 18.11.1 (2026-10-20)**; 18.10.4 (2026-10-13) and 18.10.3 (2026-09-29) preceded
      it. Do not state 18.10.3 as latest.
    - Windows App SDK: Stable **2.5.1 (2026-09-16)** confirmed (NuGet latest stable 2.5.1; experimental 2.5.4-experimental
      2026-09-29; 2.0 Preview2 listed on the channels page). Unchanged.
    - CommunityToolkit.Mvvm **8.4.2 (2026-03-25)** confirmed on NuGet and GitHub (8.4.1 on 2026-03-24). Unchanged.
    - winapp CLI: still **public preview, v0.7.1 (2026-10-01)**, latest GitHub release. Unchanged.
    - Microsoft Store Policies: **version 7.20, published 2026-09-15 (baseline said 09-14), effective 2026-10-22**.
    - WinGet: winget-cli latest stable v1.29.380 (2026-09-21), preview v1.30.140-preview; winget-create v1.12.13.0.
    - WinAppDriver: last release v1.2.99 (2021-07-01), still unmaintained. Microsoft.Xaml.Behaviors.Wpf 1.1.161.
    - .NET Upgrade Assistant deprecation page and the Copilot modernization page still exist (see redirect below).
  - [x] Task 1.3. Checked all 200 distinct URLs (curl with redirects, 2026-10-23). 197 return 200; 3 return 403 only
    because of bot protection: both Packt book pages (must be confirmed in a browser, not automated) and
    `https://nsis.sourceforge.io/` (reachable in a browser; keep with the third-party list). **No dead (404) URLs.**
    Real redirects to apply (use the destination as the cited URL):
    - `/dotnet/core/extensions/dependency-injection` -> `/dotnet/core/extensions/dependency-injection/overview`
    - `/dotnet/core/porting/github-copilot-app-modernization/overview` -> `/dotnet/core/porting/github-copilot-upgrade/overview`
    - `/dotnet/desktop/wpf/controls/panels-overview` -> `/dotnet/desktop/wpf/controls/panel`
    - `/windows/apps/windows-app-sdk/notifications/app-notifications/` -> `/windows/apps/develop/notifications/app-notifications/`
    - `/windows/apps/windows-app-sdk/windowing/windowing-overview` -> `/windows/apps/develop/ui/manage-app-windows`
    - `/windows/apps/winui/winui3/testing/create-winui-unit-test-project` -> `/windows/apps/develop/testing/` (the
      specific WinUI unit-test page is gone; cite the testing hub and the MSTest-on-WinUI page)
    - `https://wixtoolset.org/` -> `https://www.firegiant.com/wixtoolset/` (cite the destination)
    Other redirects only append `?view=...` (API, MAUI, VS, ClickOnce pages); cite the plain URLs.
    The 12 URLs the issue already lists as 404 stay excluded. Not re-checked (non-URL): the `…/desktop/modernize/xaml-islands/xaml-islands` redirect.
  - [x] Task 1.4. Skimmed both PDFs in `~/Desktop/libros/windows/` (PyMuPDF keyword scan). Confirmed: Price (829 pp.)
    has `PublishSingleFile`/`DebugType` pp. 414-415, `PublishTrimmed`/`TrimMode` p. 416, Native AOT pp. 419-420,
    `dotnet workload` p. 412, WPF/WinForms publish note p. 414, Avalonia pp. 410/647-649, WinUI/WPF out of scope
    p. 647, SQLite/EF Core pp. 423/510/548, Hot Reload pp. 9/15/202/225, xUnit pp. 235-251. Belmansour (300 pp.) has
    `wingetcreate`/`LocalManifestFiles` pp. 231-234, `PublishSingleFile` pp. 232/240, WiX p. 220, semantic versioning
    pp. 236-237/294, dependency inversion pp. 156-164, xUnit pp. 201/285/294, profiling pp. 28-29. Neither book
    mentions WPF/WinUI UI content, MSIX, signing for WinGet or ClickOnce, so those pages rely on official docs
    only, as the issue states. Page numbers are PDF indices.
- [x] Task 2. Add `modules/ROOT/partials/windows-disclaimer.adoc` copying the structure of `apple-disclaimer.adoc`
  (`[IMPORTANT]`, AI-assistance wording, `xref:apps/windows/index.adoc#_bibliography[the section bibliography]`).
  Created `modules/ROOT/partials/windows-disclaimer.adoc`; no tests/coverage (docs-only).

### Group 2 — Foundations and XAML (outline pages 2–8)
Parallelizable: yes — independent files; each includes the partial from Task 2 and shares only the Bookshelf scenario.

- [x] Task 3. Author pages 2–8 in `modules/ROOT/pages/apps/windows/` (re-read each outline row and the page
  conventions first), each with header attrs, disclaimer include, versions intro, tables, runnable examples each
  followed by a `Source:` link, pitfalls, and `== References`; figures as Mermaid or `windows-apps-*.svg`:
  - [x] Task 3.1. `windows-app-platforms.adoc` ★ (stack chooser, comparison tables)
  - [x] Task 3.2. `development-environment-and-tooling.adoc`
  - [x] Task 3.3. `project-structure-and-build.adoc`
  - [x] Task 3.4. `xaml-language-fundamentals.adoc` ★
  - [x] Task 3.5. `markup-extensions-and-namescopes.adoc`
  - [x] Task 3.6. `resources-and-resource-dictionaries.adoc`
  - [x] Task 3.7. `xaml-dialects-wpf-winui-and-maui.adoc`

### Group 3 — WPF, part 1 (outline pages 9–19)
Parallelizable: yes — independent files.

- [x] Task 4. Author pages 9–19 in `modules/ROOT/pages/apps/windows/`, same contract as Task 3:
  - [x] Task 4.1. `wpf-architecture-and-application-model.adoc` ★
  - [x] Task 4.2. `windows-dialogs-and-navigation.adoc`
  - [x] Task 4.3. `layout-and-panels.adoc` ★ (Measure/Arrange figure)
  - [x] Task 4.4. `controls-and-the-content-model.adoc`
  - [x] Task 4.5. `lists-grids-and-trees.adoc`
  - [x] Task 4.6. `dependency-properties-and-attached-properties.adoc` ★ (value precedence figure)
  - [x] Task 4.7. `routed-events-and-input.adoc`
  - [x] Task 4.8. `commands.adoc` ★
  - [x] Task 4.9. `data-binding.adoc` ★
  - [x] Task 4.10. `converters-collection-views-and-data-templates.adoc`
  - [x] Task 4.11. `validation.adoc`

### Group 4 — WPF, part 2 (outline pages 20–28)
Parallelizable: yes — independent files.

- [x] Task 5. Author pages 20–28 in `modules/ROOT/pages/apps/windows/`, same contract as Task 3:
  - [x] Task 5.1. `styles-templates-and-triggers.adoc` ★
  - [x] Task 5.2. `themes-and-fluent-design.adoc` (Fluent `ThemeMode`)
  - [x] Task 5.3. `user-controls-and-custom-controls.adoc`
  - [x] Task 5.4. `graphics-animation-and-multimedia.adoc`
  - [x] Task 5.5. `documents-printing-and-text.adoc`
  - [x] Task 5.6. `threading-dispatcher-and-async.adoc` ★
  - [x] Task 5.7. `interop-win32-winforms-and-web-content.adoc` (links the Blazor Hybrid page)
  - [x] Task 5.8. `globalization-and-localization.adoc` (English / Spanish)
  - [x] Task 5.9. `accessibility-and-ui-automation.adoc`

### Group 5 — MVVM (outline pages 29–35)
Parallelizable: yes — independent files.

- [x] Task 6. Author pages 29–35 in `modules/ROOT/pages/apps/windows/`, same contract as Task 3 (class diagrams use
  `&lt;&lt;interface&gt;&gt;`; `mvvm-pattern.adoc` includes the comparison paragraph linking the Android, Apple, KMP
  and GWT pages):
  - [x] Task 6.1. `mvvm-pattern.adoc` ★
  - [x] Task 6.2. `mvvm-from-scratch.adoc`
  - [x] Task 6.3. `mvvm-toolkit.adoc` ★ (partial-property `[ObservableProperty]`, `[RelayCommand]`)
  - [x] Task 6.4. `messaging-between-view-models.adoc`
  - [x] Task 6.5. `dependency-injection-and-generic-host.adoc` ★
  - [x] Task 6.6. `navigation-dialogs-and-services-in-mvvm.adoc`
  - [x] Task 6.7. `testing-view-models-and-ui.adoc` ★

### Group 6 — Other stacks and platform integration (outline pages 36–42)
Parallelizable: yes — independent files.

- [x] Task 7. Author pages 36–42 in `modules/ROOT/pages/apps/windows/`, same contract as Task 3:
  - [x] Task 7.1. `winui-3-and-windows-app-sdk.adoc` ★ (`x:Bind`, `NavigationView`, Mica, `AppWindow`)
  - [x] Task 7.2. `windows-forms-on-dotnet.adoc` (`BindingSource`, dark mode, async APIs)
  - [x] Task 7.3. `maui-uwp-and-other-options.adoc` (third-party tools labelled as such)
  - [x] Task 7.4. `windows-platform-integration.adoc`
  - [x] Task 7.5. `local-data-settings-and-files.adoc` (EF Core + SQLite)
  - [x] Task 7.6. `security-and-app-isolation.adoc`
  - [x] Task 7.7. `performance-and-diagnostics.adoc`

### Group 7 — Publishing and distribution (outline pages 43–49)
Parallelizable: yes — independent files. Signing examples read secrets from CI secrets/env vars only.

- [x] Task 8. Author pages 43–49 in `modules/ROOT/pages/apps/windows/`, same contract as Task 3:
  - [x] Task 8.1. `dotnet-publishing-options.adoc` ★ (FDD / SCD / single-file / R2R / trimming / AOT matrix per stack)
  - [x] Task 8.2. `msix-packaging-and-signing.adoc` ★
  - [x] Task 8.3. `distribution-channels.adoc` ★ (links the Apple macOS distribution and Google Play pages)
  - [x] Task 8.4. `updates-versioning-and-telemetry.adoc`
  - [x] Task 8.5. `ci-cd-with-github-actions.adoc` (`[source,yaml]` workflows)
  - [x] Task 8.6. `migrating-from-dotnet-framework.adoc` (links the ASP.NET Web Forms migration page)
- [x] Task 9. Author `whats-new-and-version-history.adoc` (collects the Task 1 version changes, .NET 7–11 WPF notes,
  Windows App SDK history) in `modules/ROOT/pages/apps/windows/`.

### Group 8 — Landing page, bibliography and cheat sheet
Parallelizable: no — the landing page and cheat sheet summarise and link every page and source produced by Groups 2–7.

- [x] Task 10. Cross-page consistency pass over Groups 2–7: shared Bookshelf Desktop names (`BooksViewModel`,
  `IBookRepository`, `IDialogService`), identical version statements, `xref:` links between sibling pages resolve,
  and every page ends with `== References`.
  - **Canonical Bookshelf Desktop shapes (settled by Group 5, MVVM pages; align other pages to these):**
    - `Book` (namespace `Bookshelf.Core`): `public sealed record Book(int Id, string Title, string Author, int Year = 0, decimal Price = 0m, string? Isbn = null);` (positional record; no parameterless constructor, so no `new Book { Title = ... }` initializers).
    - `IBookRepository` (`Bookshelf.Core`): `Task<IReadOnlyList<Book>> GetAllAsync(CancellationToken)`, `Task<Book?> GetByIdAsync(int, CancellationToken)`, `Task<Book> AddAsync(Book, CancellationToken)`, `Task UpdateAsync(Book, CancellationToken)`, `Task DeleteAsync(int id, CancellationToken)`. `threading-dispatcher-and-async` adds an `IProgress<LoadProgress>?` overload of `GetAllAsync`.
    - `BookViewModel` (`Bookshelf.Desktop.ViewModels`): `partial class BookViewModel(Book book) : ObservableObject` wrapping an immutable `Book` (`Model`, `Id`, `Title`, `Author`, `Year`, `Price` read through) plus `[ObservableProperty] public partial bool IsFavorite`. Editing happens on a separate `BookEditorViewModel` (an `ObservableValidator`) that is created from a `Book` and produces a `Book` (`ToBook()`).
    - `BooksViewModel` (`Bookshelf.Desktop.ViewModels`): `partial class BooksViewModel(IBookRepository repository, IDialogService dialogs) : ObservableObject` (messenger-aware variant: `ObservableRecipient`), with `ObservableCollection<BookViewModel> Books`, `SelectedBook`, `SearchText`, `StatusMessage`, and commands `LoadCommand` (with `IncludeCancelCommand`), `AddBookCommand`, `EditSelectedCommand`, `DeleteSelectedCommand`, `ToggleFavoriteCommand`.
    - `IDialogService` (`Bookshelf.Desktop`): `Task<bool> ConfirmAsync(string title, string message)` and `Task<Book?> EditBookAsync(Book? existing)` (null on cancel); file dialogs live in a separate `IFileDialogService`. The `bool? ShowBookDetails(...)` / `bool Confirm(...)` shape in `windows-dialogs-and-navigation` is the older synchronous form to align.
    - `INavigationService` (`Bookshelf.Desktop`): ViewModel-first, `bool CanGoBack`, `void NavigateTo<TViewModel>() where TViewModel : class`, `void NavigateTo<TViewModel>(object parameter) where TViewModel : class`, `void GoBack()`. The `NavigateTo<TPage>() where TPage : Page` form in `windows-dialogs-and-navigation` is the Frame/page-first variant.
    - Known drifts to fix in Group 8: `commands`/`windows-dialogs-and-navigation` `IDialogService` differ; `data-binding` `BookViewModel`/`BooksViewModel` use `new BookViewModel { Title = ... }` with editable properties and a `Book` with `Year`/`Price`; `validation` uses `new Book { Title, Isbn, Pages }`; `threading` uses a 3-argument `Book` without the optional members (compatible).
- [x] Task 11. Author `modules/ROOT/pages/apps/windows/index.adoc` (`= Windows Apps`): disclaimer include, section
  overview, ★ guide, reading order by page, stack chooser, "Book and official sources compared", and the final
  `== Bibliography` grouped as in the issue (Books with Packt links, the five official-documentation groups, labelled
  third-party tools), using the URL decisions from Task 1.
- [x] Task 12. Author `modules/ROOT/pages/apps/windows/cheat-sheet.adoc`: disclaimer include, short on-page summary,
  `link:{attachmentsdir}/windows-apps-cheat-sheet.pdf[Download the cheat sheet (PDF)]`.
- [x] Task 13. Build `modules/ROOT/attachments/windows-apps-cheat-sheet.pdf` (single A4 page, house style; content as
  listed in the issue's "Cheat sheet" section) via the pipeline in choice 7; verify `page_count == 1`, 595×842 pt and a
  PNG preview without clipping; commit only the PDF.

### Group 9 — Nav, landing updates and back-links
Parallelizable: no — must follow Groups 2–8 so no `xref:` points to a missing page.

- [x] Task 14. Update `modules/ROOT/nav.adoc`: add `*** xref:apps/windows/index.adoc[Windows Apps]` after the last
  Apple child (line 1961) and before Media Optimization, with `****` children in outline order ending with
  `**** xref:apps/windows/cheat-sheet.adoc[Cheat Sheet (PDF)]`; labels identical to each page's `= Title`.
- [x] Task 15. Update `modules/ROOT/pages/apps/index.adoc` (new Windows Apps bullet before Media Optimization ending
  "plus a downloadable cheat sheet", intro sentence, `:description:`, `:keywords:` with the issue's list) and the root
  `modules/ROOT/pages/index.adoc` (`:description:` mentions Windows apps; `:keywords:` add `WPF, WinUI, MVVM, MSIX`;
  no new tile).
- [x] Task 16. Add one-line back-links: `programming-languages/csharp/getting-started.adoc` (near line 47),
  `web/aspnet/core/blazor-webassembly-hybrid-and-deployment.adoc`, `apps/apple/macos-distribution-outside-the-app-store.adoc`,
  and replace the "planned but does not exist yet" sentence at line 16 of `ai/hugging-face/windows-and-dotnet.adoc`
  with an `xref:` to this section. Reference #280, #236, #196, #263, #247 in prose only.

### Group 10 — Validation and fixes
Parallelizable: no — verifies the finished whole.

- [x] Task 17. Build and verify; fix everything found (re-run until clean):
  - [x] Task 17.1. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings; the section
    renders in `build/site` (preview with a temporary config serving `build/site`, per project memory).
  - [x] Task 17.2. The three `image::` greps from `CLAUDE.md` and the unquoted-comma alt-text grep (run on the
    changed `.adoc` files) print nothing.
  - [x] Task 17.3. The inline-code substitution grep prints nothing for `build/site/**/apps/windows`; also scan the
    rendered text for backtick/quote/bare-`+`/`[[x]]` defects (every XAML markup extension).
  - [x] Task 17.4. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid` reports every diagram parsed.
  - [x] Task 17.5. Admonition grep prints nothing: `grep -rnE '^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):|^\[(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]' modules/ROOT/pages/apps/windows`
    (the `[IMPORTANT]` lives in the partial only).
  - [x] Task 17.6. All 50 files exist; every `windows-apps-*.svg` is referenced and every `image::` target exists;
    every page includes the partial and has `== References`; no `xref:` target is missing; detect-secrets finds no
    real secret (false positives only, per project memory).
      - Group 10 result: build clean; all greps empty; 2279 Mermaid diagrams parsed; detect-secrets 0 findings in new files; README.md/CLAUDE.md need no update (playbook, antora.yml, CI unchanged).
- [x] Task 18. Run `/iru-update-docs` is **not applicable** (this change is the documentation itself); instead confirm
  `README.md`/`CLAUDE.md` need no update (the playbook, `antora.yml` and CI are unchanged) and note it in the PR.
