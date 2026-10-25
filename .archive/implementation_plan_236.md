# Implementation Plan: Guides & References / Apps — CLI

## Task summary

Source: GitHub issue #236
Base branch: main

Issue [#236](https://github.com/albertoirurueta/docs/issues/236) asks for a new **CLI** section at
**Guides & References → Apps → CLI** (`modules/ROOT/pages/apps/cli/`): building command-line and terminal (TUI)
applications for Windows, macOS and Linux. It covers terminals and POSIX / Win32 foundations, native programs in C,
C++, Swift, Objective-C, .NET, Go, Rust and JVM / Kotlin, TUI libraries (Ratatui in depth, Bubble Tea, Textual,
Terminal.Gui, ncurses, FTXUI and more), interaction and integration, and shipping native binaries. It ships 35 files
(landing page + 33 concept pages = outline rows 1–34, plus `cheat-sheet.adoc` = row 35), a one-page A4 cheat-sheet
PDF, a disclaimer partial, a shared nav partial for the existing *Building CLIs for AI Agents* pages, `cli-*.svg`
figures, nav / landing / root updates and back-links. One running scenario, the *Bookshelf* `shelf` / `shelfd` tool,
is used by every example. The existing `ai/cli-for-agents/*` material is linked, never re-documented.

**The issue body is the primary, authoritative spec.** It holds the per-page outline (file name, title, content,
figures, ★ marks), the "Sources explored" table, the "What already exists" table, page conventions, the full
bibliography, the URLs to avoid and the acceptance criteria. Every task that authors a page **must re-read its
outline row and the shared sections in full** (`gh issue view 236 --json body -q .body`; a copy is saved at
`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/afa7afdb-8879-4086-8909-ad9a4b676073/scratchpad/issue236.md`).
This plan lists files and the contract, not the whole text.

Choices made during exploration / planning (none ambiguous enough to ask about):

1. **One branch, one pass** (`feature/236-cli-section-guides-references-apps`), instead of the issue's optional four-PR
   split. The groups below follow that split (foundations, native languages, TUIs, interaction + shipping), so a split
   into PRs stays possible. Mirrors `.archive/implementation_plan_191.md` (Windows Apps) and `_168.md` (KMP).
2. **Tasks are untagged (no language key).** No installed `*-code-one-task` skill authors AsciiDoc / SVG / PDF
   documentation; every task is implemented directly. The C, Rust, Swift … snippets are page *content*, not
   repository source.
3. **Stale statements in the issue, corrected here:**
   - #275 (Go) and #191 (Windows Apps) are **already merged** (`0222f9aaf`, `75bab2357`); `programming-languages/go/`
     and `apps/windows/` exist. Pages use real `xref:` links to them (the issue says "prose only until merged").
   - **Windows Apps now sits between Apple Platforms / Hybrid IDEs and Media Optimization** in `nav.adoc` (line ~2087).
     The CLI entry therefore goes **after the Windows Apps block's `Cheat Sheet (PDF)` line and immediately before
     `*** xref:apps/media-optimization/index.adoc[Media Optimization]`**, not directly after Apple.
   - In `apps/index.adoc` the CLI bullet goes after the Windows Apps bullet (before Media Optimization), matching the nav.
4. **Disclaimer rule:** `apps-cli-disclaimer.adoc` is an `[IMPORTANT]` block saying only that the content was
   AI-assisted and should be verified against official documentation, linking
   `xref:apps/cli/index.adoc#_bibliography[the section bibliography]` (structure copied from `apple-disclaimer.adoc`).
   It is the **only** admonition in `apps/cli/**`; every other remark is prose, tables or a "Pitfalls" subsection.
5. **Versions and URLs are re-verified at implementation time** (Task 1) against live sources before any page states
   them; deviations from the 2026-10-10 baseline in the issue are recorded under Task 1 and applied consistently. The
   landing page's version baseline table collects them. Snippets that could not be compiled or run say so on the page.
6. **Nav sharing:** `partials/nav-cli-for-agents.adoc` lists the 23 child pages of *Building CLIs for AI Agents* at `*`
   depth, included through an open block (`+` / `--` / `include::partial$nav-cli-for-agents.adoc[]` / `--`) at both
   sites, exactly the mechanism `nav-swift.adoc` uses (`nav.adoc` lines 29 and 2034).
7. **Cheat-sheet PDF pipeline** (from #168/#169/#175/#187/#191): HTML/CSS authored in the scratchpad and never
   committed → headless Chrome `--print-to-pdf --no-pdf-header-footer` → PyMuPDF check `page_count == 1` and
   595×842 pt → PNG preview inspected for clipping → only the PDF is committed.
8. **`CLAUDE.md` rules apply to every page:** one-line block `image::` macros; quoted alt text when it contains a
   comma; inline code with `->`, `=>`, `*`, `{`, `...`, `'`, `~`, `^`, `__`, `#[` written as `+...+` passthroughs and
   code containing `+` as `pass:c[...]`; Mermaid stereotypes as `&lt;&lt;interface&gt;&gt;`. Escape sequences
   (`ESC [ 1 ; 31 m`, `\x1b[?1049h`), Rust (`Result<(), Box<dyn Error>>`, closures), C pointers (`char **argv`), shell
   globs and Windows paths need particular care.
9. **No `xref:` to a page that does not exist.** Landing page list, nav, apps/index, root index and back-links are
   added last (Group 7), after every target page exists.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`apps/cli/index.adoc` exists, and every page in the outline (34 pages including `index.adoc`) plus `cheat-sheet.adoc` exists." | Tasks 3–13 |
| 2 | "**CLI** appears in `nav.adoc` under Apps, after the Apple Platforms block and before Media Optimization. It lists every new page in outline order, then *Building CLIs for AI Agents* (through `partials/nav-cli-for-agents.adoc`), *Related Guides*, and ends with the cheat sheet." (placement adjusted for Windows Apps, see summary item 3) | Task 14 |
| 3 | "`partials/nav-cli-for-agents.adoc` is used at both nav sites (AI and Apps / CLI), and both render at the right depth in `build/site`." | Tasks 14, 16 |
| 4 | "`apps/index.adoc` has the new bullet, and its `:description:` / `:keywords:` are updated. The root `index.adoc` `:description:` / `:keywords:` mention CLI / TUI." | Task 15 |
| 5 | "The back-links listed under \"New nav placement\" are added. No `xref:` points to a page that doesn't exist. #275 and #191 are referenced in prose only, unless already merged." | Tasks 15, 16 |
| 6 | "No concept already documented in the repository (see \"What already exists\") is re-documented; new pages link to the existing pages instead." | Tasks 3–11, 16 |
| 7 | "Windows, macOS and Linux are covered on every page where behaviour differs, with POSIX and Win32 both explained." | Tasks 3–7, 10, 11 |
| 8 | "Native options are covered for C, C++, Swift, Objective-C and .NET, plus Go, Rust and JVM / Kotlin." | Task 7 |
| 9 | "Ratatui is covered in depth (pages 17–20), including the 0.30 crate split, layout, every built-in widget, events, async, architectures, panic hooks, backends and testing." | Task 8 |
| 10 | "Every ★ page has **detailed** content: explanation, all relevant options and APIs, platform differences, pitfalls and security notes, and complete runnable examples." | Tasks 3–11 |
| 11 | "Every code example uses current APIs (see the version baseline) and follows the *shelf* scenario." | Tasks 1, 3–11 |
| 12 | "Each example is **followed by a link to the official documentation page it derives from**." | Tasks 3–11, 13 |
| 13 | "Pages state honestly what official docs do **not** provide (see \"Context\") instead of inventing APIs or guidance." | Tasks 3–11 |
| 14 | "Versions and dates were re-verified at implementation time and are collected in the landing page's version baseline table." | Tasks 1, 13 |
| 15 | "Every page passes the `CLAUDE.md` checks: the three `image::` grep checks and the unquoted-comma alt-text check print nothing; the inline-code substitution grep prints nothing for `build/site/**/apps/cli`." | Task 16 |
| 16 | "Mermaid diagrams and `cli-*.svg` figures are added at least where 📊 is suggested. Every new SVG is referenced by a page." | Tasks 3–11, 13, 16 |
| 17 | "`npm run validate:mermaid` reports every diagram as parsed." | Task 16 |
| 18 | "`partials/apps-cli-disclaimer.adoc` exists and is included on every new page of the section. No other admonitions are used on these pages." | Tasks 2, 3–13 |
| 19 | "`index.adoc` has `== Bibliography` listing every source used, each linked to its official website, and all links resolve. Every page has `== References`." | Tasks 1, 3–12, 13 |
| 20 | "`cheat-sheet.adoc` links `modules/ROOT/attachments/apps-cli-cheat-sheet.pdf`, which is a **single A4 page** summarising every concept of the section." | Task 12 |
| 21 | "`npx antora antora-playbook.yml` completes with no `xref` / AsciiDoc errors or warnings, and the section renders correctly in `build/site`." | Task 16 |

## Current code state

- Antora documentation repo (project type `other`): playbook `antora-playbook.yml`, component `ROOT` (`antora.yml`),
  pages under `modules/ROOT/pages/`, images in `modules/ROOT/images/` (flat, bare filenames; no `cli-*.svg` exists
  yet), PDFs in `modules/ROOT/attachments/` (precedent: `ai-cli-for-agents-cheat-sheet.pdf`), partials in
  `modules/ROOT/partials/` (disclaimers `<section>-disclaimer.adoc`, nav partials `nav-<lang>.adoc`).
- `modules/ROOT/pages/apps/` has `android`, `apple`, `hybrid`, `kotlin-multiplatform`, `media-optimization`,
  `react-native`, `windows` and `index.adoc`; **no `cli/`** directory. `apps/index.adoc` has a description, a long
  `:keywords:` line and a `== Sections` bullet list (Android, KMP, Apple, React Native, Windows Apps, Media
  Optimization, Hybrid IDEs & Tools).
- `modules/ROOT/nav.adoc` Apps block: `** xref:apps/index.adoc[Apps]` (line 1919) → Android (1920), KMP (1967),
  React Native (2000), Apple (2031, includes `partial$nav-swift.adoc` at 2034), Hybrid IDEs (2086), Windows Apps
  (2087 … ends with `Cheat Sheet (PDF)`), Media Optimization (2137). AI block: `*** xref:ai/cli-for-agents/index.adoc[Building
  CLIs for AI Agents]` at line 2393 with 23 hard-coded `****` children (2394–2416).
- `modules/ROOT/partials/apple-disclaimer.adoc` is the disclaimer model (an `[IMPORTANT]` block with the bibliography
  xref). `nav-swift.adoc` is the working model of a nav partial included at two depths.
- All link targets named in the issue exist (verified): the 24 `ai/cli-for-agents/*` pages, Node.js CLI pages
  (`building-cli-tools`, `console-readline-and-terminal-io`, `process-signals-and-exit-codes`, `child-processes`,
  `single-executable-applications`, `running-scripts-cli-and-repl`), `backend/quarkus/command-mode-and-cli-applications`,
  `programming-languages/php/command-line-php`, `programming-languages/rust/io-files-processes-and-environment`,
  Flask / Django / Pyramid / NestJS CLI pages, C `program-structure` / `standard-library-overview` /
  `input-output-and-files`, `swift/swift-package-manager`, `apps/apple/macos-distribution-outside-the-app-store`,
  C# / Java `build-and-tooling`, Python `standard-library-tour`, `programming-languages/go/index.adoc`.
- Tooling: `npx antora antora-playbook.yml`; `npm run validate:mermaid` after a one-off
  `npm i --no-save mermaid@11 jsdom`; `build/` is gitignored. No lint or test suite besides the CLAUDE.md greps.
- Precedents: `.archive/implementation_plan_191.md` (closest, same nav slot), `_168`, `_190`, `_262`, `_275`.

## Implementation steps

### Group 1 — Baseline verification and shared scaffolding
Parallelizable: no — every page depends on the versions / URL decisions recorded by Task 1 and on the disclaimer partial.

- [x] Task 1. Re-verify the version baseline and source URLs
  - **Check date: 2026-10-25.** Full URL results: `/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/afa7afdb-8879-4086-8909-ad9a4b676073/scratchpad/cli-url-check.md`.
  - **Version deviations from the 2026-10-10 baseline (apply on every page and in the landing table):** TamboUI 0.5.0 ->
    **0.6.0** (2026-10-12); JLine 4.4.7 -> **4.4.8**; swift-subprocess 1.0.1 -> **1.0.2**; Swift 6.4 -> **6.4.1**
    (2026-10-15); Python 3.15.0 -> **3.15.1** (2026-10-21; `suggest_on_error` default `True` re-confirmed in What's New
    3.15); Go 1.27.2 -> **1.27.3**; tcell v3.5.0 -> **v3.6.0**; rustyline 18.0.1 -> **19.0.0**; `dist` 0.33.0 -> **0.33.1**;
    Nuitka 4.3 -> **4.3.1**; .NET 10 LTS 10.0.12 -> **10.0.13**; System.CommandLine NuGet 2.0.12 -> **2.0.13** (3.0.0
    preview exists, not used); @inquirer/prompts 8.7.3 -> **8.7.4**. Note: .NET 11.0 is at rc.2 (not GA).
  - **Unchanged (confirmed):** Ratatui 0.30.2, ratatui-core 0.1.2, crossterm 0.29.0, termion 4.0.6, termwiz 0.23.3,
    tui-realm 4.1.0, ratatui-textarea 0.9.3, color-eyre 0.6.5, clap 4.6.7, indicatif 0.18.6, dialoguer 0.12.0, inquire
    0.9.4, reedline 0.52.1, insta 1.49.0, cross 0.2.5; Bubble Tea v2.1.0, Bubbles v2.2.1, Lip Gloss v2.0.6, Huh v2.0.3,
    Glamour v2.0.1, VHS v0.12.1, tview v0.42.0, Cobra v1.10.2, urfave/cli v3.14.0; Textual 8.2.8, Rich 15.0.0,
    prompt_toolkit 3.0.53, windows-curses 2.4.2, Click 8.5.0, Typer 0.27.3, PyInstaller 6.22.3, pexpect 4.9.0,
    pytest-textual-snapshot 1.1.0; Ink 8.0.0 (React >=19.3, Node >=22), @clack/prompts 1.8.1, chalk 6.0.1, ora 9.4.1;
    Spectre.Console 0.57.2, Terminal.Gui v2.5.0 (`tui-cs/Terminal.Gui`); FTXUI v7.0.3, CLI11 v2.7.2, cxxopts v3.3.1,
    notcurses v3.0.17, PDCursesMod v4.5.4, ncurses 6.6, glibc 2.44; swift-argument-parser 1.8.2, swift-system 1.8.1;
    Clikt 5.1.0, Mordant 3.1.0, Mosaic 0.18.0, picocli 4.7.7, Lanterna 3.1.5 (3.2.0-alpha1 exists, not used).
  - **Not re-verified (no live source reachable or no release feed):** Boost 1.92, GNU Readline 8.3, libedit
    20260512-3.1, linenoise, replxx (no releases), GraalVM 25, Java 22 FFM claim, kotlinx-cli obsolete status, JLine 4
    Java 11 requirement: keep the baseline wording and do not add finer-grained claims.
  - **URLs:** 189 distinct Bibliography URLs checked, none dead. Redirects to cite by destination: Click -> `/en/stable/`,
    bats-core -> `/en/stable/`, pexpect -> `/en/stable/`, `swift.org/*` -> `www.swift.org/*`, swift-argument-parser ->
    `/1.8.2/documentation/argumentparser`, docs.rs crate roots -> `/latest/<crate>/`, learn.microsoft.com pages gain a
    `?view=` suffix (cite without it). `gnu.org`, `man7.org`, `sourceware.org`, `kernel.org` all returned 200.
    `ratatui.rs`, `typer.tiangolo.com` and `bomb.sh` (Clack) **timed out from this network** (no route, retried with
    `-4`): not verified live, cite as in the issue; the Ratatui GitHub release feed confirms 0.30.2. Medium (12 Factor
    CLI Apps) returns 403 to curl (bot protection): link kept, flagged as not machine-verifiable. No "avoid" URL appears
    in the Bibliography.
  - **Toolchains available locally:** Swift 6.4 (Apple Swift 6.4, swift-driver 1.168.6), Apple clang 21 (`gcc` / `clang`),
    Node v24.21.0 / npm 11, Python 3.9.6 system (older than the 3.15 the pages target: argparse 3.14+/3.15 features cannot
    be run). **Not installed:** cargo/rustc, go, dotnet. So Swift and C/C++/Objective-C (clang, macOS only) snippets can be
    compiled and run; Rust, Go, .NET, Python 3.15 / Textual, JVM/Kotlin snippets must be stated on the page as **not
    compiled or run during writing**. Windows-specific code and Linux-only code (`signalfd`, `argp`, systemd) cannot be run
    on this macOS host.
  - [x] Task 1.1. Re-check every version in the issue's "Sources explored" table against live sources (Ratatui 0.30.x,
    Bubble Tea v2, Terminal.Gui v2, Textual / Rich, Ink 8, JLine 4, Python 3.15, .NET 10 / System.CommandLine 2.0,
    Swift 6.4, glibc, ncurses, FTXUI, CLI11, Clikt, TamboUI, Spectre.Console). Record deviations and the check date at
    the top of this task, to be applied on every page and in the landing page's version baseline table.
  - [x] Task 1.2. Check every URL in the issue's Bibliography (curl with redirects). Record redirects (cite the
    destination), dead URLs (replace) and bot-protected hosts (`gnu.org`, `man7.org`: re-check in a browser). Never use
    the "avoid" URLs listed at the end of the Bibliography.
  - [x] Task 1.3. Decide which shell sessions / toolchains are available locally (cargo, go, swift, dotnet, gcc / clang,
    python) so each page can say which snippets were compiled or run and which were not.
- [x] Task 2. Create `modules/ROOT/partials/apps-cli-disclaimer.adoc`
  - [x] Task 2.1. Copy the structure of `apple-disclaimer.adoc` ([IMPORTANT] block, AI-assistance disclosure, link to
    `xref:apps/cli/index.adoc#_bibliography[the section bibliography]`).

### Group 2 — Foundations (outline pages 2–7)
Parallelizable: yes — six independent new files; figures use distinct `cli-*.svg` names. Each page: header attributes
(`= Title`, `:description:`, `:keywords:`), the disclaimer include, intro with versions / platforms, detailed explanation
with Windows / macOS / Linux behaviour, option tables, pitfalls, complete *shelf* examples each followed by a `Source:`
link, honest "not documented" notes, and a closing `== References`.

- [x] Task 3. `apps/cli/cli-landscape-and-choosing-a-stack.adoc` ★ "The CLI Landscape & Choosing a Stack" (row 2): kinds of
  terminal program, native vs managed runtimes compared, decision matrix per audience, where each option is documented;
  figures: SVG `cli-landscape.svg` + Mermaid decision flow.
- [x] Task 4. `apps/cli/terminals-ttys-and-ptys.adoc` ★ "Terminals, TTYs & Pseudo-Terminals" (row 3): line discipline,
  `termios`, PTYs, sessions / process groups / job control, window size (`tcgetwinsize`), `SIGWINCH`, conhost / Windows
  Terminal / ConPTY; figures: SVG `cli-terminal-stack.svg` + Mermaid key-press sequence.
- [x] Task 5. Two pages
  - [x] Task 5.1. `apps/cli/escape-sequences-and-terminal-capabilities.adoc` ★ (row 4): ECMA-48, SGR, cursor, alternate
    screen, mouse, bracketed paste, sync output, OSC 8 / 52, Kitty protocols, terminal queries, `TERM` / terminfo, Unicode
    width, Windows VT, injection warning; figure SVG `cli-escape-sequence-anatomy.svg`. Escape sequences in inline code
    use `+...+` passthroughs.
  - [x] Task 5.2. `apps/cli/posix-processes-signals-and-io.adoc` ★ (row 5): `main` / `environ`, fds and redirection
    (`pipe`, `dup2`), `fork` / `exec` / `posix_spawn` / `waitpid`, `sigaction`, `SIGPIPE`, stdio buffering, locale, the
    POSIX Utility Syntax Guidelines as a checklist; figures: Mermaid fork→exec→waitpid + SVG `cli-fd-redirection.svg`.
- [x] Task 6. Two pages
  - [x] Task 6.1. `apps/cli/windows-console-and-processes.adoc` ★ (row 6): console vs GUI subsystem, classic API vs VT
    sequences, code pages / UTF-8, argv parsing rules, Ctrl handlers, `CreateProcess` / job objects, ConPTY, Windows
    Terminal; figures: Mermaid argv flow + Win32 ↔ POSIX table. Link `apps/windows/` pages with `xref:`.
  - [x] Task 6.2. `apps/cli/cross-platform-portability.adoc` (row 7): Windows / macOS / Linux / BSD differences table,
    portable abstractions per language, i18n, CI matrix; figure SVG `cli-platform-differences.svg`.

### Group 3 — Native command-line programs by language (outline pages 8–15)
Parallelizable: yes — eight independent files, none edits another's content. Link, don't repeat, the C, Swift, Rust, Go,
Java and AI-section pages.

- [x] Task 7. Command-line programs in the native languages
  - [x] Task 7.1. `c-command-line-programs.adoc` ★ (row 8)
  - [x] Task 7.2. `cpp-command-line-programs.adoc` (row 9; parser comparison table)
  - [x] Task 7.3. `swift-command-line-tools.adoc` ★ (row 10; Mermaid build matrix)
  - [x] Task 7.4. `objective-c-command-line-tools.adoc` (row 11)
  - [x] Task 7.5. `dotnet-console-applications.adoc` ★ (row 12; Mermaid publish decision flow)
  - [x] Task 7.6. `go-command-line-programs.adoc` (row 13; `xref:` to `programming-languages/go/index.adoc`)
  - [x] Task 7.7. `rust-command-line-programs.adoc` (row 14; builds on the Rust I/O page)
  - [x] Task 7.8. `jvm-and-kotlin-command-line-programs.adoc` (row 15)

### Group 4 — Terminal user interfaces (outline pages 16–25)
Parallelizable: yes — ten independent files; the Ratatui pages cross-link each other by file name only.

- [x] Task 8. TUI concepts and Ratatui
  - [x] Task 8.1. `tui-architecture-and-concepts.adoc` ★ (row 16; SVG `cli-tui-render-pipeline.svg` + Mermaid TEA loop)
  - [x] Task 8.2. `ratatui-getting-started.adoc` ★ (row 17; Mermaid app loop)
  - [x] Task 8.3. `ratatui-layout-widgets-and-styling.adoc` ★ (row 18; SVG `cli-ratatui-layout.svg`, every built-in widget)
  - [x] Task 8.4. `ratatui-events-async-and-architecture.adoc` ★ (row 19; Mermaid architecture)
  - [x] Task 8.5. `ratatui-testing-and-ecosystem.adoc` (row 20; state honestly that Ratatui has no 1.0)
- [x] Task 9. Other TUI libraries
  - [x] Task 9.1. `go-tuis-with-bubble-tea.adoc` ★ (row 21; Bubble Tea v2 import path and `UPGRADE_GUIDE_V2.md`)
  - [x] Task 9.2. `python-tuis-with-textual-and-rich.adoc` ★ (row 22; Mermaid DOM / message bubbling)
  - [x] Task 9.3. `dotnet-tuis-with-spectre-and-terminal-gui.adoc` (row 23; use `tui-cs.github.io`, never `gui-cs.github.io`)
  - [x] Task 9.4. `c-and-cpp-tuis-ncurses-and-ftxui.adoc` (row 24; prefer PDCursesMod)
  - [x] Task 9.5. `other-tui-libraries.adoc` (row 25)

### Group 5 — Interaction, output, integration and shipping (outline pages 26–34)
Parallelizable: yes — nine independent files. Link the AI section for the rules it already owns (TTY / `NO_COLOR`,
"ship completions", packaging channels, CLI-level tests).

- [x] Task 10. Interaction, output and integration
  - [x] Task 10.1. `interactive-prompts-and-line-editing.adoc` (row 26)
  - [x] Task 10.2. `progress-colour-and-rich-output.adoc` (row 27)
  - [x] Task 10.3. `shells-completions-and-shell-integration.adoc` (row 28)
  - [x] Task 10.4. `long-running-processes-and-services.adoc` (row 29; Mermaid client ↔ daemon IPC; `shelfd`)
  - [x] Task 10.5. `accessibility-and-internationalization.adoc` (row 30; do not invent official screen-reader guidance)
- [x] Task 11. Shipping
  - [x] Task 11.1. `native-binaries-and-cross-compilation.adoc` ★ (row 31; Mermaid build → sign → package → publish)
  - [x] Task 11.2. `signing-notarization-and-os-trust.adoc` ★ (row 32; SVG `cli-signing-trust.svg`; bare Mach-O tools cannot be stapled)
  - [x] Task 11.3. `native-packages-and-installers.adoc` (row 33; channel × OS × signing table)
  - [x] Task 11.4. `testing-terminal-apps-and-tuis.adoc` (row 34)

### Group 6 — Cheat sheet page and PDF
Parallelizable: no — summarises every concept, so it depends on the content of Groups 2–5.

- [x] Task 12. Cheat sheet
  - [x] Task 12.1. Author the single-A4 HTML/CSS in the scratchpad covering every minimum-content bullet of the issue's
    "Cheat sheet" section; render with headless Chrome; verify `page_count == 1`, 595×842 pt and no clipping via PNG preview.
  - [x] Task 12.2. Commit only `modules/ROOT/attachments/apps-cli-cheat-sheet.pdf`. (PDF produced, not committed; HTML in scratchpad `cs/cs.html`; PyMuPDF: page_count 1, 594.96x841.92 pt, PNG inspected, no clipping.)
  - [x] Task 12.3. `apps/cli/cheat-sheet.adoc` (row 35): disclaimer include, grouped back-links to the section's pages,
    `xref:attachment$apps-cli-cheat-sheet.pdf[downloadable PDF]`, `== References`.

### Group 7 — Landing page, nav, landing / root updates and back-links
Parallelizable: no — they need every page and figure to exist, and Tasks 14 and 15 both edit `nav.adoc`.

- [x] Task 13. `apps/cli/index.adoc` "CLI" (row 1)
  - [x] Task 13.1. Header, disclaimer include, scope statement and what it deliberately links to, reading map, the *shelf*
    scenario, the version baseline table (from Task 1), the page list with `xref:` to every page, the Mermaid "choose your
    page" flow, link to `ai/cli-for-agents/index.adoc#_bibliography`.
  - [x] Task 13.2. `== Bibliography` listing every source in the issue's Bibliography, grouped as there, each linked to its
    official site, with community conventions cited as such and the verified URLs from Task 1.
- [x] Task 14. Navigation
  - [x] Task 14.1. Create `modules/ROOT/partials/nav-cli-for-agents.adoc` listing the 23 children of *Building CLIs for AI
    Agents* at `*` depth, with a header comment naming both usage sites.
  - [x] Task 14.2. In `nav.adoc`, replace the hard-coded `****` children at the AI site with the open-block include
    (same pattern as `nav-swift.adoc`).
  - [x] Task 14.3. Add `*** xref:apps/cli/index.adoc[CLI]` after the Windows Apps block and before Media Optimization, with
    `****` children in outline order (labels identical to each page's `= Title`, `&` house style), then
    `**** xref:ai/cli-for-agents/index.adoc[Building CLIs for AI Agents]` + the include, `**** Related Guides` with `*****`
    links to the Node.js, Quarkus, PHP, Rust, Flask, Django, Pyramid and NestJS pages, and last
    `**** xref:apps/cli/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 15. Landing, root and back-links
  - [x] Task 15.1. `apps/index.adoc`: add the CLI bullet after Windows Apps ("... plus a downloadable cheat sheet"), update
    `:description:` and extend `:keywords:` with the issue's keyword list.
  - [x] Task 15.2. Root `modules/ROOT/pages/index.adoc`: mention CLI / terminal apps in `:description:`, add `CLI, TUI,
    Ratatui` to `:keywords:`; no new tile.
  - [x] Task 15.3. One-line back-links to the new section from `ai/cli-for-agents/index.adoc`, `tuis-vs-clis.adoc`,
    `frameworks-go-and-rust.adoc`, `packaging-and-distribution.adoc`, `testing-clis.adoc`,
    `backend/nodejs/building-cli-tools.adoc`, `programming-languages/rust/io-files-processes-and-environment.adoc`,
    `programming-languages/c/program-structure.adoc`, `programming-languages/swift/index.adoc`.
  - [x] Task 15.4. Resolve any prose-only mention of #275 / #191 in the new pages to real `xref:` links (both are merged).

### Group 8 — Build, verification and documentation check
Parallelizable: no — verification runs once on the finished section.

- [x] Task 16. Verify
  - [x] Task 16.1. `npx antora antora-playbook.yml`: no `xref` / AsciiDoc errors or warnings; both nav sites render the AI
    pages at the right depth; the CLI section renders in `build/site` (preview via a temporary launch config pointing at
    `build/site`, see memory note on the docs-site preview).
  - [x] Task 16.2. Run the `CLAUDE.md` greps (quote every `--include`): block `image::` not closed on one line; inline
    `image:` not closed; `<p>image::` leaked into paragraphs; the unquoted-comma alt-text check on the changed `.adoc`
    files; the inline-code substitution grep on `build/site/apps/cli`. All must print nothing. Check every `image::`
    target exists and every new `cli-*.svg` is referenced. Also scan rendered text for backtick / quote / bare `+` and
    `[[x]]` defects.
  - [x] Task 16.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`: every diagram parses.
  - [x] Task 16.4. Check there are no admonitions other than the disclaimer in `apps/cli/**`, every page has
    `== References`, every `xref:` target exists, and every Bibliography link resolves (re-check bot-protected hosts in a
    browser).
- [x] Task 17. Run `/iru-update-docs` to confirm no further docs updates are needed (docs-only change; expected no-op),
  then `git status` to confirm only intended files changed (pages, partials, SVGs, one PDF, `nav.adoc`, index pages, back-links).
