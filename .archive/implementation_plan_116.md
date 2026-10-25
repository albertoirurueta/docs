# Implementation Plan: "IDEs & Tools" link pages for languages, databases, web and apps (issue #116)

## Task summary

Source: GitHub issue #116
Base branch: main

Issue [#116](https://github.com/albertoirurueta/docs/issues/116) asks for dedicated pages that list the most common IDEs and
tools, each linking to its official web page: one page per programming-language section, one for Databases (cross-engine GUI
tools such as MongoDB Compass, DBeaver, DataGrip, Sequel Ace), one for Web Development, and pages for Apps (native Android,
native Apple platforms, hybrid React Native and Ionic). Each page is cross-referenced from its section `index.adoc` and wired
into the navigation. Existing inline IDE mentions stay, and gain an `xref:` to the new canonical page where one exists.

### Choices made on the user's behalf

1. **Language scope: all 21 documented language sections** (confirmed by the user): `java`, `kotlin`, `c`, `cpp`, `csharp`,
   `javascript`, `typescript`, `python`, `objective-c`, `swift`, `php`, `matlab`, `go`, `rust`, `ruby`, `scala`, `groovy`,
   `fortran`, `cobol`, `r`, `visual-basic`. `jvm-build-tools` is not a language and is excluded. The issue excluded PHP and MATLAB
   only because they were undocumented then; they now have full sections.
2. **Hybrid page: `apps/hybrid/ides-and-tools.adoc`** (confirmed): a new small `apps/hybrid/` directory covering React Native
   and Ionic. It is linked from `apps/index.adoc`, the nav and `apps/react-native/index.adoc`. A full hybrid/Ionic section is out of scope.
3. **Disclaimers: new partials for Database, Web and the three Apps pages** (confirmed), shaped exactly like
   `partials/go-disclaimer.adoc` (one `[IMPORTANT]` block pointing to the section index). Language pages reuse their existing
   `<lang>-disclaimer.adoc` (verified with `ls` in Task 1).
4. **Links only, no version numbers.** Each entry is a bold product name linked to its official page, a one-line
   description, and (where useful) the official extension/plugin page. This keeps the pages from going stale. Discontinued
   products (e.g. AppCode, Visual Studio for Mac) are stated as discontinued with the official announcement link, or omitted if
   no stable official link exists.
5. **Every URL is checked at implementation time** (Task 1): an HTTP check from the shell or browser pane, recorded in a
   scratchpad catalog. Links that cannot be verified are reported to the user instead of being guessed.
6. **Tasks are untagged**: no installed `*-code-one-task` key fits AsciiDoc authoring, so tasks are implemented directly.
7. **Nav depth.** Each `partials/nav-<lang>.adoc` has its own depth convention (absolute `***` for java, javascript, typescript,
   python and rust; relative `*` with `**`/`***` children for the others, e.g. go uses a `** Getting started` group). The new
   entry goes right after the language's Getting Started entry at the **same depth as the sibling entries it joins**, once in the
   partial, never in `nav.adoc` (the partials are mounted in several places).
8. **No images**, so the `CLAUDE.md` image rules do not apply. The inline-code passthrough rule does (use `+...+` for names with
   `->`, `*`, `~`, `__` and so on), as does the "no wrapped macros" rule.

Open clarifications: none

## Acceptance criteria coverage

The issue states no formal acceptance criteria; these are derived from its request and scope section.

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | derived: each documented programming-language section has a dedicated IDEs & tools page whose entries link to official product pages | Task 3.1-3.21 |
| 2 | derived: a Databases page lists cross-engine GUI tools (MongoDB Compass, DBeaver, DataGrip, Sequel Ace, ...) with official links | Task 4 |
| 3 | derived: a Web Development page lists popular web IDEs/editors with official links | Task 5 |
| 4 | derived: Apps pages cover Android Studio/IntelliJ, Xcode, and hybrid React Native/Ionic IDEs with official links | Task 6, Task 7, Task 8 |
| 5 | derived: every new page is linked from its section `index.adoc` and reachable from the site navigation | Task 3.x, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9 |
| 6 | derived: all links are official, verified and the Antora build and `CLAUDE.md` greps pass cleanly | Task 1, Task 10 |

## Current code state

- Docs repo only (Antora playbook plus `ROOT` component). Pages live in `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`
  plus `modules/ROOT/partials/nav-<lang>.adoc`, disclaimers in `modules/ROOT/partials/<name>-disclaimer.adoc`.
- No dedicated IDE page exists anywhere. Inline mentions exist in `programming-languages/<lang>/getting-started.adoc`,
  `build-and-tooling.adoc` (c, cpp, csharp, kotlin, objective-c, swift), `python/debugging-and-tooling.adoc`,
  `cobol/modern-tooling-vs-code-and-zowe.adoc`, `fortran/documentation-and-editor-tooling.adoc`, `apps/windows/development-environment-and-tooling.adoc`
  (Visual Studio, in depth) and `database/mongodb/drivers-and-tooling.adoc` (Compass).
- Section landing pages: language `index.adoc` files use `== What's covered` with `===` subsections of bullet `xref:` lists;
  `database/index.adoc` and `web/index.adoc` use `== Sections`; `apps/index.adoc` uses `== Sections` and a long
  `:description:`/`:keywords:` header listing every guide.
- Apps today: `apps/android` (nav mounts `nav-kotlin.adoc` above its own entries, `nav.adoc` ~1917), `apps/apple`
  (mounts `nav-swift.adoc`, ~2028), `apps/react-native`, `apps/kotlin-multiplatform`, `apps/windows`, `apps/media-optimization`. There is no
  `apps/hybrid` and no Ionic content.
- Partials mounted in several places: `nav-java`, `nav-python`, `nav-typescript`, `nav-javascript` (Programming Languages, Web, Backend),
  `nav-kotlin` (also Apps/Android), `nav-swift` (also Apps/Apple), `nav-rust` and others. Editing a partial updates every mount.
- Database nav block starts at `nav.adoc` ~46 (`database/index.adoc` with `***` children); Web block at ~301.

## Implementation steps

### Group 1 — Foundations (Parallelizable: yes — verification catalog and disclaimer partials touch different files)

- [x] Task 1. Build the verified official-link catalog and page template
  - Catalog at scratchpad ide-links.md (all URLs verified, 403 hosts via browser; AppCode announcement unlinkable); template at scratchpad ide-page-template.adoc; all 23 disclaimer partials exist under `<key>-disclaimer.adoc`.
  - [x] Task 1.1. In the scratchpad, write a catalog (`ide-links.md`) with the candidate products per page (below) and their official URLs. Reuse URLs already on the site (`grep -rhoE 'https://[^] ]+' modules | sort -u` filtered by product name) before deriving new ones.
  - [x] Task 1.2. Check every URL (`curl -sIL -o /dev/null -w '%{http_code}'`, falling back to the built-in browser for bot-blocked hosts) and record status. Replace dead or redirected-to-marketing URLs with the current official page. Report unverifiable ones to the user before finishing.
  - [x] Task 1.3. `ls modules/ROOT/partials/<lang>-disclaimer.adoc` for all 21 languages and `android-disclaimer`, `apple-disclaimer`, and note which are missing or named differently (e.g. `r`, `objective-c`, `visual-basic`, `matlab`, `jvm`). Use the real name in each page's `include::`.
  - [x] Task 1.4. Fix the page template: `= <Language> IDEs & Tools`, `:description:`, `:keywords:`, `include::partial$<name>-disclaimer.adoc[]`, a two-sentence intro, then a `==` group per category (IDEs, editors with extensions, online/notebook tools where relevant) with a bullet or table of `https://...[Product]` links and a one-line description, then a `== See also` list of `xref:`s to the section's getting-started and tooling pages. Candidates per page:
    - java: IntelliJ IDEA, Eclipse IDE, Apache NetBeans, VS Code (Extension Pack for Java), BlueJ
    - kotlin: Android Studio, IntelliJ IDEA, VS Code (Kotlin extension), Eclipse (Kotlin plugin)
    - c, cpp: CLion, Visual Studio, VS Code (C/C++ extension), Eclipse CDT, Qt Creator, Code::Blocks, Xcode
    - csharp, visual-basic: Visual Studio, JetBrains Rider, VS Code (C# Dev Kit); Visual Studio for Mac retirement note
    - javascript, typescript: VS Code, WebStorm, Sublime Text, Zed, Visual Studio
    - python: PyCharm, VS Code (Python extension), Spyder, JupyterLab, Thonny
    - objective-c, swift: Xcode, VS Code (Swift extension), AppCode discontinuation note; swift also Zed
    - php: PhpStorm, VS Code, Eclipse PDT, Apache NetBeans
    - matlab: MATLAB Desktop, MATLAB Online, VS Code (MATLAB extension), Live Editor
    - go: GoLand, VS Code (Go extension), Neovim/gopls
    - rust: RustRover, VS Code (rust-analyzer), Zed, CLion
    - ruby: RubyMine, VS Code (Ruby LSP), Neovim
    - scala: IntelliJ IDEA (Scala plugin), VS Code (Metals), Scala CLI
    - groovy: IntelliJ IDEA, Eclipse (Groovy-Eclipse), Apache NetBeans, VS Code
    - fortran: VS Code (Modern Fortran), Intel oneAPI toolkits, Eclipse Photran, fpm
    - cobol: VS Code (COBOL / IBM Z Open Editor), Visual COBOL, Eclipse Che4z/Zowe Explorer, GnuCOBOL
    - r: RStudio (Posit), Positron, VS Code (R extension)
    - database (Task 4): MongoDB Compass, DBeaver, DataGrip, Sequel Ace, pgAdmin, MySQL Workbench, Azure Data Studio (retirement note), Redis Insight, Neo4j Browser/Bloom, Kibana Dev Tools, Qdrant dashboard
    - web (Task 5): VS Code, WebStorm, Visual Studio, Sublime Text, Zed, browser DevTools (Chrome, Firefox, Safari), PhpStorm, IntelliJ IDEA Ultimate
    - android (Task 6): Android Studio, IntelliJ IDEA, VS Code for Kotlin, Android Emulator
    - apple (Task 7): Xcode, Xcode Simulator, VS Code (Swift extension), Xcode Cloud, TestFlight, Instruments
    - hybrid (Task 8): VS Code (React Native Tools, Ionic extension), WebStorm, Android Studio and Xcode as native toolchains, Expo Go/Dev Client, Ionic CLI, Capacitor
- [x] Task 2. Add disclaimer partials for the new non-language pages
  - Created database-, web-, apps-ides-and-tools-disclaimer.adoc (checked by inspection; include check deferred to Group 3/5). Android/Apple pages reuse apps-ides-and-tools-disclaimer.
  - [x] Task 2.1. Create `partials/database-ides-and-tools-disclaimer.adoc`, `partials/web-ides-and-tools-disclaimer.adoc`, `partials/apps-ides-and-tools-disclaimer.adoc` (used by the Android, Apple and Hybrid pages), each identical to `partials/go-disclaimer.adoc` except that the xref points to the target (`database/index.adoc`, `web/index.adoc`, `apps/index.adoc`) instead of a bibliography anchor that does not exist. If the Android and Apple pages are better served by `android-disclaimer`/`apple-disclaimer`, reuse those instead and say so in the task note.
  - [x] Task 2.2. Confirm none of the files contains a stray blank-line or anchor problem by including it from one page in Task 4 first.

### Group 2 — Programming-language pages (Parallelizable: yes — each task owns its own page, its section `index.adoc` and its own `nav-<lang>.adoc` partial)

Each task `3.n` does the same four steps for one language:
(a) create `modules/ROOT/pages/programming-languages/<lang>/ides-and-tools.adoc` from the Task 1.4 template with the catalog entries;
(b) add a bullet to the language `index.adoc`'s Getting started group (or the first suitable subsection) with a one-line description;
(c) add the nav entry to `partials/nav-<lang>.adoc` right after Getting Started at the matching depth;
(d) where an inline IDE mention exists in `getting-started.adoc` or `build-and-tooling.adoc`, add one sentence with an `xref:` to the new page (do not delete the inline text).

- [x] Task 3. Create the IDEs & tools page for every language section
  - [x] Task 3.1. java (`partial$nav-java.adoc`, absolute `***`/`****`; replace nothing in "IDEs and the Release Cadence", add the xref)
  - [x] Task 3.2. kotlin (`nav-kotlin.adoc`, relative depth; also appears under Apps/Android)
  - [x] Task 3.3. c
  - [x] Task 3.4. cpp (the display name uses `{cpp}`; use `+C+++...+` passthrough care in any literal text)
  - [x] Task 3.5. csharp
  - [x] Task 3.6. javascript (absolute depth; mounted under Web and Programming Languages)
  - [x] Task 3.7. typescript (absolute depth; mounted three times)
  - [x] Task 3.8. python (absolute depth; link from `debugging-and-tooling.adoc` too)
  - [x] Task 3.9. objective-c
  - [x] Task 3.10. swift (also appears under Apps/Apple)
  - [x] Task 3.11. php
  - [x] Task 3.12. matlab
  - [x] Task 3.13. go (nav uses a `** Getting started` group: add the entry inside it)
  - [x] Task 3.14. rust (absolute depth)
  - [x] Task 3.15. ruby
  - [x] Task 3.16. scala
  - [x] Task 3.17. groovy
  - [x] Task 3.18. fortran (xref from `documentation-and-editor-tooling.adoc`)
  - [x] Task 3.19. cobol (xref from `modern-tooling-vs-code-and-zowe.adoc`)
  - [x] Task 3.20. r
  - [x] Task 3.21. visual-basic

### Group 3 — Database, Web and Apps pages (Parallelizable: yes — distinct pages and distinct landing pages; `nav.adoc` is untouched here and edited once in Group 4)

- [x] Task 4. Database IDEs & tools page
  - [x] Task 4.1. Create `pages/database/ides-and-tools.adoc` (disclaimer from Task 2) grouping tools by engine family: cross-engine clients (DBeaver, DataGrip, Sequel Ace, TablePlus), SQL (pgAdmin, MySQL Workbench), document (MongoDB Compass), key-value (Redis Insight), graph (Neo4j), search (Kibana Dev Tools), vector (Qdrant dashboard); `xref:` to `database/mongodb/drivers-and-tooling.adoc` instead of repeating Compass details.
  - [x] Task 4.2. Add a bullet to `database/index.adoc` `== Sections` (place it after Diagnosing and Fixing Slow Queries, before the SQL Reference).
- [x] Task 5. Web Development IDEs & tools page
  - [x] Task 5.1. Create `pages/web/ides-and-tools.adoc`: editors and IDEs, browser DevTools, and `xref:` to the JavaScript, TypeScript, PHP and Python language IDE pages.
  - [x] Task 5.2. Add a bullet to `web/index.adoc` `== Sections`, after "E2E Testing in Real Browsers".
- [x] Task 6. Android IDEs & tools page
  - [x] Task 6.1. Create `pages/apps/android/ides-and-tools.adoc` (Android Studio, IntelliJ IDEA, Android Emulator, SDK command-line tools) with `xref:` to `apps/android/getting-started.adoc` and the Kotlin IDEs page.
  - [x] Task 6.2. Add a bullet to `apps/android/index.adoc`.
- [x] Task 7. Apple platforms IDEs & tools page
  - [x] Task 7.1. Create `pages/apps/apple/ides-and-tools.adoc` (Xcode for iOS, iPadOS, macOS, watchOS, tvOS and visionOS, Simulator, Instruments, Xcode Cloud, TestFlight, VS Code and AppCode notes) with `xref:` to `xcode-projects-and-previews.adoc` and `getting-started.adoc`.
  - [x] Task 7.2. Add a bullet to `apps/apple/index.adoc`.
- [x] Task 8. Hybrid IDEs & tools page and the Apps landing page
  - [x] Task 8.1. Create `pages/apps/hybrid/ides-and-tools.adoc` for React Native and Ionic: editors, native toolchains (Android Studio, Xcode), emulators/simulators, Expo and Ionic/Capacitor tooling; `xref:` to `apps/react-native/getting-started.adoc` and `tooling-metro-and-project-structure.adoc`. State that Ionic has no dedicated section on this site yet.
  - [x] Task 8.2. Add a back-link bullet to `apps/react-native/index.adoc`.
  - [x] Task 8.3. Edit `apps/index.adoc`: add a `Hybrid Apps: IDEs & Tools` bullet to `== Sections` and extend the `:description:`/`:keywords:` (Ionic, Capacitor, Expo, IDE, Xcode, Android Studio) without wrapping text.

### Group 4 — Navigation (Parallelizable: yes — one task, the only editor of `nav.adoc`)

- [x] Task 9. Wire the non-language pages into `modules/ROOT/nav.adoc`
  - [x] Task 9.1. Databases: add `*** xref:database/ides-and-tools.adoc[IDEs & Tools]` after the Diagnosing Slow Queries entry (~line 49).
  - [x] Task 9.2. Web Development: add `*** xref:web/ides-and-tools.adoc[IDEs & Tools]` after the E2E Testing entry.
  - [x] Task 9.3. Apps: add one `****` entry each right after Getting Started in the Android and Apple blocks, and a new `*** xref:apps/hybrid/ides-and-tools.adoc[Hybrid Apps: IDEs & Tools]` after React Native (before Windows Apps). Respect the open-block (`+`/`--`) partial includes: place `****` entries after the closing `--`.
  - [x] Task 9.4. Confirm no entry was duplicated into a partial that is also included here.

### Group 5 — Verification (Parallelizable: yes — read-only checks on the finished work)

- [x] Task 10. Build and verify
  - [x] Task 10.1. `npx antora antora-playbook.yml` completes without `xref`/include errors (run in the background, quote any output filters).
  - [x] Task 10.2. Run the `CLAUDE.md` greps (`'^image::'`, inline `image:`, `<p>image::`, inline-code substitutions on `build/site/programming-languages build/site/database build/site/web build/site/apps`, plus the rendered-HTML backtick scan). All must print nothing for the changed sections.
  - [x] Task 10.3. Check each new page appears in its section's rendered nav and landing page: grep `build/site` for `ides-and-tools.html` in every `index.html` and in a nav sample; confirm all 21 + 5 pages exist (26 pages: 21 languages, database, web, android, apple, hybrid).
  - [x] Task 10.4. Re-run the URL check from Task 1.2 over every URL in the new pages and confirm no new dead links; list any that cannot be verified.
  - [x] Task 10.5. Render a language page, the database page and the hybrid page in the built-in browser (preview config pointing at `build/site`, per the repo's preview note) and confirm the nav entries and disclaimers show.
