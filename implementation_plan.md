# Implementation Plan: Guides & References / Apps — "Windows Apps" (XAML, WPF, MVVM, WinUI 3, Windows Forms, publishing & distribution on .NET 10)

## Task summary

Source: GitHub issue #191
Base branch: main

Issue [#191](https://github.com/albertoirurueta/docs/issues/191) adds an Antora section `modules/ROOT/pages/apps/windows/` (nav
title **Windows Apps**) under Guides & References → Apps: a detailed, example-driven reference for building Windows desktop apps
with C# / **.NET 10 LTS** — **XAML**, **WPF**, the **MVVM** pattern with **CommunityToolkit.Mvvm 8.4.x**, **WinUI 3 / Windows App SDK 2.x**,
**Windows Forms** — and for **publishing and distributing** them (`dotnet publish`, MSIX, signing, Microsoft Store, WinGet, App
Installer, ClickOnce, CI/CD). **50 files**: `index.adoc` (with `== Bibliography`), 48 concept pages (outline rows 2–49) and
`cheat-sheet.adoc`; a `windows-disclaimer.adoc` partial; nav + landing-page edits; four back-links; original `windows-apps-*.svg`
figures plus Mermaid diagrams; a one-page A4 PDF `modules/ROOT/attachments/windows-apps-cheat-sheet.pdf`.

**The binding spec** is the issue body only (no comments, no labels). Local copy: scratchpad
`/tmp/claude-0/-home-user-docs/2bc7f2d3-bf3b-5c3b-a451-83d620f497fa/scratchpad/issue191_body.md`; re-fetch with the GitHub MCP
`issue_read` (`get`, owner `albertoirurueta`, repo `docs`, issue 191) if missing. It holds: the version baseline and the "Official
documentation explored" table (~35 concept rows with source URLs), "Gaps in the official docs", "URLs found to 404", the books
comparison and "Concepts the books contribute", "What already exists", nav placement, page conventions, the *Bookshelf Desktop*
running scenario, the **page outline (rows 1–50: file, title, content, figures)**, bibliography, cheat-sheet content and acceptance
criteria. **Every page task must re-read its own outline row** (★ depth, 📊 figures, content bullets) from that file.

### Choices made on the user's behalf

1. **Branch `feature/191-windows-apps-section-xaml-wpf-mvvm`, one draft PR to `main`** with `Closes #191` (base `main` confirmed by
   the user). The issue's optional five-PR split is not used (same decision as #297/#299/#300/#305); the groups below follow its
   five slices so the work could still be cut.
2. **Tasks are untagged.** Installed keys (`windows`, `dotnet`, …) code *applications*; none fits AsciiDoc/Mermaid/SVG/PDF authoring, so tasks
   are implemented directly. The `windows` key is deliberately not used: this repo contains no Windows app code.
3. **Examples cannot all run on this machine.** There is no .NET SDK (`dotnet` not found) and no Windows. Plan (Task 1.1): try to install
   the .NET 10 SDK into the scratchpad (via the official `dotnet-install` script from dotnet.microsoft.com; `learn.microsoft.com`, `nuget.org`
   and `dotnet.microsoft.com` answer 200 here, but **ask the user before each download**, stating file, source and size, as in #300). With it:
   - UI-free code (view models, `RelayCommand`/messenger tests, converters' logic, publishing of a console/`net10.0` project) is built and run for
     real on Linux, with real output;
   - WPF/WinForms projects are compile-checked on Linux with `EnableWindowsTargeting=true` (build only, nothing runs; stated on the page);
   - WinUI 3, MSIX, SignTool, Store, WinGet, ClickOnce, App Installer, GitHub Actions and everything else Windows-only is labelled **"not run
     here"** and checked line by line against the docs. Output is never invented.
   If the SDK cannot be obtained, every example is "not run here".
4. **Books are not available locally** (`~/Desktop/libros/windows/` does not exist here, and Packt answers 403). They are cited only through
   publisher pages in the index bibliography and in "book is outdated" prose taken from the issue's tables. No book text, listing or figure is reproduced.
5. **Version baseline is re-verified at implementation time and dated** (Task 1.2): .NET 10 patch (10.0.12 at filing), .NET 11 GA (expected Nov 2026),
   Windows App SDK (2.5.1), CommunityToolkit.Mvvm (8.4.2, NuGet API), VS 2026, Store Policies (7.20), winapp CLI (0.7.1). Update the baseline everywhere if
   newer releases landed.
6. **Existing pages get real `xref:`s** (verified with `ls`). `programming-languages/visual-basic/` now exists on `main`, so #280 may be `xref:`-linked both ways
   (VB side: only if a one-line back-link is clearly useful; otherwise one-way). #236, #196, #263 and #247 stay prose-only unless their pages exist.
7. **Disclaimer** `windows-disclaimer.adoc` copies `apple-disclaimer.adoc` (an `[IMPORTANT]` block) and points to
   `xref:apps/windows/index.adoc#_bibliography[the section bibliography]`. It is the **only** admonition in the section; the issue's grep must print nothing.
8. **Figures**: every 📊 in the outline is delivered (Mermaid or original `windows-apps-*.svg`; no Microsoft/Windows logos or screenshots). Each SVG is referenced by a page.
9. **Official-doc gaps are stated honestly** (no MVVM article for WPF, no official ViewModel-first navigation or dialog service, Native AOT/trimming unsupported for WPF/WinForms, etc.).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title` (identical to the nav label), `:description:`, `:keywords:`, then `include::partial$windows-disclaimer.adoc[]`; the intro states the versions
  written against (.NET 10 LTS / C# 14, VS 2026, Windows App SDK 2.x, CommunityToolkit.Mvvm 8.4.x, Windows 10/11 support) and notes .NET 11 differences once GA.
- Each concept: what/why with the official mental model; every relevant option/property/attribute/setting in tables; WPF vs WinUI 3 vs WinForms differences
  (short table where relevant); pitfalls, performance, security; what changed .NET Framework → .NET 8/9/10 (and 11).
- Each example follows the *Bookshelf Desktop* scenario, uses current APIs only (file-scoped namespaces, nullable enabled, partial-property `[ObservableProperty]`,
  async commands) and is **followed by** `Source: https://…[…]` to the official page/anchor it derives from (looked up, never guessed). Block types: `xml` (XAML,
  `.csproj`, `Package.appxmanifest`, `.appinstaller`), `csharp`, `powershell`/`bash`, `yaml` (WinGet manifests, GitHub Actions). No screenshots (original SVG mock-ups instead).
  No real secrets, certificate passwords or signing keys; signing reads them from CI secrets/environment variables.
- Each page ends with `== References` (official sources only; book chapters where a book contributed).
- AsciiDoc pitfalls: **every XAML markup extension and brace in inline code is a passthrough** (`` `+{Binding Title}+` ``, `` `+{x:Bind ViewModel.Title, Mode=OneWay}+` ``,
  `` `+{StaticResource AccentBrush}+` ``, `` `+() => …+` ``); inline code containing `+`, `->`, `=>`, `*`, `...`, `'`, `__`, `#`, `^`, `~` uses `+…+` / `pass:c[…]`
  (`]` as `\]`); URLs inside inline code are passthroughs too; `|` in table cells escaped `\|`. Image macros on one line at column 0, quoted alt text when it
  contains a comma. Mermaid: `&lt;&lt;interface&gt;&gt;` stereotypes for every class diagram with `INotifyPropertyChanged`, `ICommand` or `IMessenger`; `<`
  directly followed by a letter or `/` written as `&lt;`.
- Each task's own verification: grep its files for admonitions, unquoted-comma image alt text, unclosed block macros, a missing `Source:` after a code block,
  and `{…}` or `+` outside passthroughs in inline code; compile/run what can be compiled/run; check `Source:` URLs with `curl` as far as the network allows.

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`apps/windows/index.adoc`, `cheat-sheet.adoc` and every page in the outline (50 files) exist." | Tasks 3–39 (concept pages), Task 40 (`index.adoc`), Task 42 (`cheat-sheet.adoc`) |
| 2 | "**Windows Apps** appears in `nav.adoc` under Apps, after the Apple Platforms block and before Media Optimization. It lists every page in outline order and ends with the cheat sheet." | Task 2.2 |
| 3 | "`apps/index.adoc` has the new bullet, and its intro, `:description:` and `:keywords:` are updated. The root `index.adoc` `:description:` / `:keywords:` mention Windows apps." | Task 41.1 |
| 4 | "The back-links listed under 'New nav placement' are added, including replacing the 'planned but does not exist yet' sentence in `ai/hugging-face/windows-and-dotnet.adoc`. No `xref:` points to a page that doesn't exist. Issues #280, #236, #196, #263 and #247 are referenced in prose only, unless already merged." | Task 41.2, Task 41.3 |
| 5 | "Every concept row of the 'Official documentation explored' table has a dedicated page (or a clearly titled section of a page in the outline). XAML, WPF, MVVM and publishing / distribution are covered by the ★ pages in full detail." | Groups 2–7 (Tasks 3–39); checked in Task 44.2 |
| 6 | "Every row of 'Concepts the books contribute' is covered by the page named. The book-outdated points are reflected (.NET 10, no AOT/trimming for WPF/WinForms, signing added to WinGet)." | Tasks 4, 16, 28, 30, 32, 33, 34, 35, 37, 38, 39; checked in Task 44.2 |
| 7 | "Every ★ page has **detailed** content: explanation, all relevant options and settings, a cross-stack comparison where relevant, pitfalls / performance / security notes, and complete runnable examples." | ★ tasks in Groups 2–7; length/coverage check in Task 44.3 |
| 8 | "Every code example uses current APIs (.NET 10, C# 14, MVVM Toolkit 8.4.x partial properties, Windows App SDK 2.x) and follows the *Bookshelf Desktop* scenario." | Task 1.1 (scenario skeleton), every page task |
| 9 | "Each example is **followed by a link to the official documentation page it derives from**." | every page task; checked in Task 44.4 |
| 10 | "Pages state honestly what the official docs do **not** provide (see 'Gaps') instead of inventing APIs, and third-party tools are labelled as such." | Tasks 12, 15, 16, 17, 19, 23, 24, 29, 30, 31, 32 and others named in "Gaps" |
| 11 | "Versions and dates were re-verified at implementation time (.NET 10 / 11, Windows App SDK, MVVM Toolkit, VS 2026, Store Policies, winapp CLI). `whats-new-and-version-history.adoc` collects the changes." | Task 1.2, Task 39 |
| 12 | "Every page passes the `CLAUDE.md` checks: the three `image::` grep checks and the unquoted-comma alt-text check print nothing; the inline-code substitution grep prints nothing for `build/site/**/apps/windows`." | Task 44.4 |
| 13 | "Mermaid diagrams and `windows-apps-*.svg` figures are added at least where 📊 is suggested. Every new SVG is referenced by a page." | figure sub-tasks in Groups 2–7, Task 44.1 |
| 14 | "`npm run validate:mermaid` reports every diagram as parsed." | Task 44.5 |
| 15 | "`partials/windows-disclaimer.adoc` exists and is included on every page of the section." | Task 2.1, Task 44.4 |
| 16 | "The **only** admonition in the section is the AI-assistance notice. This must print nothing: `grep -rnE '^(NOTE\|TIP\|IMPORTANT\|WARNING\|CAUTION):\|^\[(NOTE\|TIP\|IMPORTANT\|WARNING\|CAUTION)\]' modules/ROOT/pages/apps/windows`" | Task 44.4 |
| 17 | "`index.adoc` has `== Bibliography` listing every source used, each linked to its official website (books to the publisher's page), and all links resolve (Packt links checked in a browser). Every page has `== References`." | Task 40, Task 44.7 (Packt links cannot be checked here — reported) |
| 18 | "`cheat-sheet.adoc` links `modules/ROOT/attachments/windows-apps-cheat-sheet.pdf`, which is a **single A4 page** summarising every concept of the section." | Tasks 42, 43 |
| 19 | "`npx antora antora-playbook.yml` completes with no `xref` / AsciiDoc errors or warnings, and the section renders correctly in `build/site`." | Task 44.6 |

## Current code state

- No application code. Site definition `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc` (Apps block starts at line ~1798:
  `*** xref:apps/android/index.adoc[Android]`, Kotlin Multiplatform ~1844, React Native ~1877, Apple Platforms ~1908 with its last child
  `**** xref:apps/apple/cheat-sheet.adoc[Cheat Sheets (PDF)]` at line ~1961, then `*** xref:apps/media-optimization/index.adoc[Media Optimization]` at ~1962).
  Nav entries are written inline in `nav.adoc` for Apps (no `nav-<section>.adoc` partial); verify before editing.
- `modules/ROOT/pages/apps/` contains `android/` (41 pages), `apple/` (50), `kotlin-multiplatform/` (33), `react-native/`, `media-optimization/` and `index.adoc`
  (sections list, `:description:`/`:keywords:`). `apps/windows/` does **not** exist; no `feature/191*` branch existed before this run.
- Template: `modules/ROOT/partials/apple-disclaimer.adoc` (an `[IMPORTANT]` block with an `xref:apps/apple/index.adoc#_bibliography[…]`). Cheat-sheet convention:
  `apps/apple/cheat-sheet.adoc` + `modules/ROOT/attachments/*-cheat-sheet.pdf` (A4, headless-Chrome print-to-PDF). Images: `modules/ROOT/images/` (no `windows-apps-*` yet).
- Structural precedents: `.archive/implementation_plan_172.md`–`175.md` (Apple Platforms, 4 parts), `168`/`169` (KMP, Android), `300` (JVM build tools), `305` (Python build tools).
- Back-link targets (all exist): `programming-languages/csharp/getting-started.adoc` (line ~47 lists WPF / WinForms / MAUI), `web/aspnet/core/blazor-webassembly-hybrid-and-deployment.adoc`,
  `ai/hugging-face/windows-and-dotnet.adoc` (line ~16: "A dedicated Windows Apps section of this site is planned but does not exist yet"),
  `apps/apple/macos-distribution-outside-the-app-store.adoc`. Pages to link (not edit): `programming-languages/csharp/*`, `programming-languages/visual-basic/*`,
  `apps/android/app-architecture.adoc`, `apps/apple/app-architecture.adoc`, `apps/kotlin-multiplatform/architecture-and-shared-viewmodels.adoc`, `web/gwt/mvp-activities-and-places.adoc`,
  `web/aspnet/web-forms/migrating-to-modern-aspnet.adoc`, `apps/android/publishing-on-google-play.adoc`.
- Tooling here: Node 22, Antora, `pdfinfo`, Chromium (`/opt/pw-browsers`), `curl`. **Missing:** .NET SDK, Windows. Reachable: learn.microsoft.com, nuget.org, dotnet.microsoft.com.
  Blocked (403): github.com web pages, packtpub.com.
- Stack: documentation-only (AsciiDoc, Mermaid, SVG, PDF) about C# / .NET 10, XAML, WPF, WinUI 3, WinForms, MVVM Toolkit. User interface of the repo: none (so no
  accessibility/UI-test tasks and no `/iru-update-docs` UI task).

## Implementation steps

### Group 1 — Tooling, baseline, partial and nav skeleton (Parallelizable: no — every later group depends on the verified baseline, the scenario skeleton and the nav/partial)

- [ ] Task 1. Prepare tooling and verify the baseline
  - [ ] Task 1.1. Ask the user before downloading; then install the .NET 10 SDK into the scratchpad (official `dotnet-install` script) and verify `dotnet --info`. Scaffold the
    *Bookshelf Desktop* solution in scratch dirs: `Bookshelf.Core` (`net10.0`, view models, `IBookRepository`, services) + `Bookshelf.Tests`, `Bookshelf.Wpf` / `Bookshelf.WinForms`
    (`net10.0-windows`, compile-check with `EnableWindowsTargeting=true`), and note that WinUI 3 cannot be built here. If the SDK cannot be obtained, record that every example is "not run here".
  - [ ] Task 1.2. Re-verify the version baseline (.NET 10/11, Windows App SDK, CommunityToolkit.Mvvm via `https://api.nuget.org/v3-flatcontainer/communitytoolkit.mvvm/index.json`, VS 2026,
    Store Policies, winapp CLI, WinGet/wingetcreate) against Microsoft Learn/NuGet and record the date.
  - [ ] Task 1.3. Check highlight.js in `ui-bundle.zip` for `xml`, `csharp`, `powershell`, `yaml`, `bash`; check how the nav renders the `****` children under Apps. Write the findings and the
    URL check results (the issue's 404 list, every "Official documentation explored" URL) to scratchpad `windows-apps-baseline-notes.md`; URLs on blocked hosts are recorded as "not re-verified".
- [ ] Task 2. Create the shared partial and nav skeleton
  - [ ] Task 2.1. `modules/ROOT/partials/windows-disclaimer.adoc`, copying `apple-disclaimer.adoc` and pointing at `xref:apps/windows/index.adoc#_bibliography[the section bibliography]`.
  - [ ] Task 2.2. `modules/ROOT/nav.adoc`: between `**** xref:apps/apple/cheat-sheet.adoc[Cheat Sheets (PDF)]` and `*** xref:apps/media-optimization/index.adoc[Media Optimization]` add
    `*** xref:apps/windows/index.adoc[Windows Apps]` with `****` children for pages 2–49 in outline order, ending with `**** xref:apps/windows/cheat-sheet.adoc[Cheat Sheet (PDF)]`; each label equals the page `= Title`.
    Keep xrefs to not-yet-written pages until Group 10 verifies none dangle.

### Group 2 — Slice 1a: platforms, tooling and XAML (Parallelizable: yes — distinct files; `index.adoc` and `cheat-sheet.adoc` are deferred to Groups 8–9)

- [ ] Task 3. ★ `windows-app-platforms.adoc` (row 2; 📊 SVG `windows-apps-platform-map.svg`, Mermaid decision flow)
- [ ] Task 4. `development-environment-and-tooling.adoc` (row 3) and `project-structure-and-build.adoc` (row 4; 📊 Mermaid project-dependency graph) — Price ch. 4 mapping
- [ ] Task 5. ★ `xaml-language-fundamentals.adoc` (row 5; 📊 SVG `windows-apps-xaml-to-object-tree.svg`; `XamlReader` security caveat)
- [ ] Task 6. `markup-extensions-and-namescopes.adoc` (row 6) — brace-heavy: every markup extension in inline code is a passthrough
- [ ] Task 7. `resources-and-resource-dictionaries.adoc` (row 7; 📊 Mermaid resource-lookup flow)
- [ ] Task 8. `xaml-dialects-wpf-winui-and-maui.adoc` (row 8; WPF/WinUI/MAUI comparison table)

### Group 3 — Slice 2a: WPF architecture, layout, controls, properties, binding (Parallelizable: yes — distinct files)

- [ ] Task 9. ★ `wpf-architecture-and-application-model.adoc` (row 9; 📊 Mermaid class diagram with `&lt;&lt;…&gt;&gt;` stereotypes if any, SVG `windows-apps-logical-vs-visual-tree.svg`)
- [ ] Task 10. `windows-dialogs-and-navigation.adoc` (row 10; 📊 Mermaid window-lifetime state diagram; .NET 10 `MessageBox`, `OpenFolderDialog`)
- [ ] Task 11. ★ `layout-and-panels.adoc` (row 11; 📊 SVGs `windows-apps-measure-arrange.svg`, `windows-apps-bookshelf-layout.svg`; .NET 10 `Grid` short form)
- [ ] Task 12. `controls-and-the-content-model.adoc` and `lists-grids-and-trees.adoc` (rows 12–13; Ribbon stated honestly as API-reference-only)
- [ ] Task 13. ★ `dependency-properties-and-attached-properties.adoc` (row 14; 📊 SVG `windows-apps-dp-value-precedence.svg`)
- [ ] Task 14. `routed-events-and-input.adoc` (row 15; 📊 Mermaid tunnel + bubble sequence diagram)
- [ ] Task 15. ★ `commands.adoc` (row 16; 📊 Mermaid routed-command flow)
- [ ] Task 16. ★ `data-binding.adoc` (row 17; 📊 SVG `windows-apps-binding-anatomy.svg`; C# pages linked for events/delegates)
- [ ] Task 17. `converters-collection-views-and-data-templates.adoc` and `validation.adoc` (rows 18–19; 📊 SVG `windows-apps-validation-error-template.svg`; no WPF-specific `INotifyDataErrorInfo` how-to — say so)

### Group 4 — Slice 2b: WPF styling, graphics, threading, interop, globalization, accessibility (Parallelizable: yes — distinct files)

- [ ] Task 18. ★ `styles-templates-and-triggers.adoc` (row 20)
- [ ] Task 19. `themes-and-fluent-design.adoc` (row 21; `ThemeMode` experimental `WPF0001`; Fluent deep-dive gap stated) and `user-controls-and-custom-controls.adoc` (row 22; 📊 Mermaid decision flow)
- [ ] Task 20. `graphics-animation-and-multimedia.adoc` and `documents-printing-and-text.adoc` (rows 23–24)
- [ ] Task 21. ★ `threading-dispatcher-and-async.adoc` (row 25; 📊 Mermaid async-load sequence diagram; link C# async/await and threads pages)
- [ ] Task 22. `interop-win32-winforms-and-web-content.adoc` (row 26; 📊 SVG `windows-apps-airspace.svg`; link the Blazor Hybrid and C# native-interop pages; XAML Islands status honest)
- [ ] Task 23. `globalization-and-localization.adoc` and `accessibility-and-ui-automation.adoc` (rows 27–28; no official WPF accessibility hub — say so)

### Group 5 — Slice 3: MVVM (Parallelizable: yes — distinct files; `mvvm-from-scratch` and `mvvm-toolkit` examples are built from the same scratch solution but do not depend on each other's pages)

- [ ] Task 24. ★ `mvvm-pattern.adoc` (row 29; 📊 SVG `windows-apps-mvvm-layers.svg`, Mermaid class diagram with `&lt;&lt;interface&gt;&gt;`; comparison paragraph linking the Android, Apple, KMP and GWT architecture pages; no official WPF MVVM article — say so)
- [ ] Task 25. `mvvm-from-scratch.adoc` (row 30; hand-written `ViewModelBase`/`RelayCommand`, built and run on Linux)
- [ ] Task 26. ★ `mvvm-toolkit.adoc` (row 31; 📊 Mermaid attribute → generator → generated members; partial-property `[ObservableProperty]`, MVVMTK0042 and the `LangVersion preview` doc inconsistency; generated code inspected for real if the SDK is available)
- [ ] Task 27. `messaging-between-view-models.adoc` (row 32; 📊 Mermaid book-saved sequence diagram)
- [ ] Task 28. ★ `dependency-injection-and-generic-host.adoc` (row 33; 📊 Mermaid startup sequence; Belmansour ch. 8 mapping)
- [ ] Task 29. `navigation-dialogs-and-services-in-mvvm.adoc` (row 34; 📊 Mermaid ViewModel-first navigation flow; presented as user patterns — no official API)
- [ ] Task 30. ★ `testing-view-models-and-ui.adoc` (row 35; view-model tests run for real; WinAppDriver unmaintained/Appium/FlaUI labelled; Belmansour ch. 10 mapping)

### Group 6 — Slice 4: other stacks and platform integration (Parallelizable: yes — distinct files)

- [ ] Task 31. ★ `winui-3-and-windows-app-sdk.adoc` (row 36; 📊 Mermaid activation flow; WinUI cannot be built here — "not run here")
- [ ] Task 32. `windows-forms-on-dotnet.adoc` (row 37; compile-checked with `EnableWindowsTargeting`) and `maui-uwp-and-other-options.adoc` (row 38; third-party options in prose only)
- [ ] Task 33. `windows-platform-integration.adoc` (row 39; 📊 SVG `windows-apps-package-identity.svg`; Windows AI APIs Limited Access Feature caveat) and `local-data-settings-and-files.adoc` (row 40; EF Core + SQLite part run for real)
- [ ] Task 34. `security-and-app-isolation.adoc` (row 41; Belmansour ch. 13 mapped to desktop) and `performance-and-diagnostics.adoc` (row 42; Belmansour ch. 12 mapping)

### Group 7 — Slice 5: publishing and distribution (Parallelizable: yes — distinct files)

- [ ] Task 35. ★ `dotnet-publishing-options.adoc` (row 43; 📊 SVG `windows-apps-publish-matrix.svg`; publish matrix verified for real on `net10.0` and compile-checked for WPF where possible; Price ch. 7 mapping; NETSDK1168 for WPF/WinForms trimming/AOT)
- [ ] Task 36. ★ `msix-packaging-and-signing.adoc` (row 44; 📊 SVG `windows-apps-msix-package.svg`, Mermaid build → package → sign → publish flow; "not run here"; no real certificates/passwords; Azure Artifact Signing, SmartScreen)
- [ ] Task 37. ★ `distribution-channels.adoc` (row 45; 📊 Mermaid decision flow, SVG `windows-apps-distribution-channels.svg`; Store/App Installer/WinGet/ClickOnce/MSI prose; Belmansour ch. 11 mapping; link `apps/apple/macos-distribution-outside-the-app-store.adoc` and `apps/android/publishing-on-google-play.adoc`)
- [ ] Task 38. `updates-versioning-and-telemetry.adoc` (row 46) and `ci-cd-with-github-actions.adoc` (row 47; 📊 Mermaid pipeline diagram; workflows "not run here"; secrets from CI only)
- [ ] Task 39. `migrating-from-dotnet-framework.adoc` (row 48; 📊 Mermaid migration flow; link `web/aspnet/web-forms/migrating-to-modern-aspnet.adoc`; Upgrade Assistant deprecated) and `whats-new-and-version-history.adoc` (row 49; timeline Mermaid or SVG `windows-apps-timeline.svg`; collects the version changes)

### Group 8 — Index, landing pages and back-links (Parallelizable: no — the index bibliography and the apps landing page depend on every page's final title and sources)

- [ ] Task 40. `apps/windows/index.adoc` (row 1): intro, "choose your path" Mermaid flow, version baseline table, page list in outline order, `== Bibliography` grouped as in the issue (two Packt books via publisher pages; official docs grouped under Windows app development, WPF/XAML/WinForms, MVVM, publishing and distribution, tooling/testing/support policy; third-party tools labelled)
- [ ] Task 41. Landing pages and back-links
  - [ ] Task 41.1. `apps/index.adoc`: Windows Apps bullet before Media Optimization (ends "plus a downloadable cheat sheet"), intro sentence, `:description:` and `:keywords:` (at least the issue's list); root `modules/ROOT/pages/index.adoc` `:description:`/`:keywords:` mention Windows apps (`WPF, WinUI, MVVM, MSIX`).
  - [ ] Task 41.2. One-line back-links in `programming-languages/csharp/getting-started.adoc`, `web/aspnet/core/blazor-webassembly-hybrid-and-deployment.adoc`, `apps/apple/macos-distribution-outside-the-app-store.adoc`, and replace the "planned but does not exist yet" sentence in `ai/hugging-face/windows-and-dotnet.adoc` with an `xref:` to this section.
  - [ ] Task 41.3. Cross-links to #280: `xref:` to `programming-languages/visual-basic/index.adoc` from the interop/WinForms/WPF pages where useful; #236, #196, #263, #247 in prose only.

### Group 9 — Cheat sheet and PDF (Parallelizable: no — summarises every page)

- [ ] Task 42. `apps/windows/cheat-sheet.adoc` (row 50): disclaimer, short summary with `xref:`s to every page, `link:{attachmentsdir}/windows-apps-cheat-sheet.pdf[Download the cheat sheet (PDF)]` as in other sections, `== References`
- [ ] Task 43. One-page A4 PDF `modules/ROOT/attachments/windows-apps-cheat-sheet.pdf` from a throwaway HTML page in the scratchpad via headless Chrome `--print-to-pdf --no-pdf-header-footer`; content per the issue's "Cheat sheet" minimum (stacks/versions, XAML, WPF, MVVM, other stacks, shipping: publish matrix, MSIX/signing, channels, CI/CD, migration checklist); check `pdfinfo` = 1 page and preview as PNG; commit only the PDF

### Group 10 — Final verification (Parallelizable: no — needs everything in place)

- [ ] Task 44. Verify the section
  - [ ] Task 44.1. All 50 files exist; every nav entry resolves; no `xref:` to a missing page; no unreferenced `windows-apps-*.svg`; every nav label equals its page title.
  - [ ] Task 44.2. Coverage checks: every concept row of the official-docs table and every "Concepts the books contribute" row maps to its page (tick through the issue's tables).
  - [ ] Task 44.3. ★ pages are the longest/most detailed (compare line counts with the other pages; expand any thin ★ page).
  - [ ] Task 44.4. Convention greps: admonition grep from the issue prints nothing; `CLAUDE.md` image/inline-code greps print nothing on `build/site/**/apps/windows`; every code block is followed by a `Source:` line (script as in #305); no unpassed `{…}` in inline code; every page has the disclaimer include and `== References`.
  - [ ] Task 44.5. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` reports every diagram parsed (restore `package-lock.json`/`node_modules/.package-lock.json` if touched).
  - [ ] Task 44.6. `npx antora antora-playbook.yml` exits 0 with no errors or warnings; spot-check ★ pages in `build/site`.
  - [ ] Task 44.7. Secret check (`/iru-check-security` on the new files; no certificates, passwords or tokens); confirm `build/` and scratch files are not committed; report which URLs could not be re-verified (blocked hosts, Packt).
