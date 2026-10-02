# Implementation Plan: Guides & References / Apps — Kotlin Multiplatform

## Task summary

Source: GitHub issue #168
Base branch: main

Issue [#168](https://github.com/albertoirurueta/docs/issues/168) asks for a new **Kotlin Multiplatform** section at
**Guides & References → Apps → Kotlin Multiplatform** (`modules/ROOT/pages/apps/kotlin-multiplatform/`), placed in
`nav.adoc` between *Android* and *React Native*. It teaches KMP and Compose Multiplatform (CMP) as JetBrains and
Google document them today, covering both "share logic only" (native UI) and "share UI with CMP" (Android, iOS,
desktop, web), cross-checked against the book `~/Desktop/kotlin-multiplatform.pdf` (Róbert Nagy, Packt 2022).

**The issue body is the primary, authoritative spec.** It holds, per page, the exact coverage list, official
source URLs and planned figures (`## Pages`), plus the section-wide rules (`## Section-wide rules`), the TrailMate
Everywhere running example, the version baseline, the URL exclusion list, the book cross-check tables, the landing
page/cheat sheet/nav/cross-link specs and the acceptance criteria. Every task below that authors a page **must
re-read its page entry and the shared sections in full** (`gh issue view 168`; a local copy may be fetched with
`gh issue view 168 --json body -q .body`) — this plan lists the files and the contract, not the whole text.
`K`, `D`, `A` URL shorthands are defined in the issue's *Context* section.

Choices made during exploration/planning (none ambiguous enough to ask about):

1. **Ship everything in one pass**, exactly as specified: landing page + 31 concept pages + cheat-sheet page + the
   one-page PDF + disclaimer partial + figures + nav + cross-links. No consolidation.
2. **Tasks are untagged (no language key).** The installed `*-code-one-task` skills cover only `java`,
   `java-springboot`, `dotnet` and `database`; none applies to authoring AsciiDoc/SVG/PDF documentation, so every
   task is implemented directly, mirroring `.archive/implementation_plan_192.md` (Azure) and `_187.md`. The
   Kotlin/Swift/Gradle/YAML snippets inside the pages are page *content*, not repository source.
3. **Disclaimer rule (issue Rule 1):** `kotlin-multiplatform-disclaimer.adoc` is an `[IMPORTANT]` block that says
   only that the content was AI-assisted, should be verified against the official Kotlin Multiplatform
   documentation, and links `xref:apps/kotlin-multiplatform/index.adoc#_bibliography[the section bibliography]`. It
   is the **only** admonition in `apps/kotlin-multiplatform/**`; caveats are prose, tables or bold text.
4. **The book is named only on the landing page** (`== Book and official sources compared` and `== Bibliography`).
   Pages never cite or quote it; outdated book techniques appear as "legacy, replaced by X" with official links.
   The book PDF is read locally and never copied into the repo.
5. **Versions are re-verified at implementation time** (Task 2) against the live docs / Maven Central / GitHub
   releases before any page states them. Baseline from the issue (verified 2026-09-27): Kotlin 2.4.20, CMP 1.12.1,
   AGP 9.4 (`com.android.kotlin.multiplatform.library`), Xcode 26.4, Ktor 3.6.0, SQLDelight 2.4.0, Koin 4.2.2,
   SKIE 0.10.15, KMP-NativeCoroutines 1.0.6, Room 3 (`androidx.room3`) 3.0.3, Mokkery 3.5.0, vanniktech 0.37.0,
   Dokka 2.2.0. Swift export and SwiftPM import are Alpha; Kotlin/Wasm and CMP web are Beta. Any deviation found is
   recorded as a note under Task 2 and applied consistently in every later task.
6. **No URL from the issue's exclusion list** (404s and JS/meta-refresh redirect stubs) may be cited anywhere.
7. **Cheat-sheet PDF pipeline** (from #169/#175/#187/#192): HTML/CSS authored in the scratchpad and never committed →
   headless Chrome `--print-to-pdf --no-pdf-header-footer` → PyMuPDF check `page_count == 1` and 595×842 pt → PNG
   preview inspected for clipping → only the PDF is committed.

## Current code state

- **No `modules/ROOT/pages/apps/kotlin-multiplatform/` directory**, no
  `modules/ROOT/partials/kotlin-multiplatform-disclaimer.adoc`, no `modules/ROOT/images/kmp-*.svg` and no
  `modules/ROOT/attachments/kotlin-multiplatform-cheat-sheet.pdf`.
- **`modules/ROOT/nav.adoc`**: `** xref:apps/index.adoc[Apps]` is at line 917; `*** xref:apps/android/index.adoc[Android]`
  at 918 (followed by `include::partial$nav-kotlin.adoc[]` and the `****` Android entries ending with
  `apps/android/cheat-sheet.adoc`); `*** xref:apps/react-native/index.adoc[React Native]` at ~964. The new block goes
  after the last Android `****` entry and before React Native.
- **Models to mirror:** `modules/ROOT/partials/android-disclaimer.adoc` (disclaimer shape);
  `modules/ROOT/pages/apps/android/index.adoc` and `cheat-sheet.adoc` (landing/cheat-sheet shape);
  `modules/ROOT/images/android-*.svg`, `apple-*.svg` (SVG style); `modules/ROOT/attachments/*-cheat-sheet.pdf`
  (house PDF style); `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`).
- **Existing pages to link, never re-teach:** `programming-languages/kotlin/*` (29 pages + cheat sheet),
  `apps/android/*` (40 pages; running example TrailMate), `apps/apple/*`, `apps/react-native/*`.
  `apps/apple/multiplatform-projects.adoc` is about *Apple's* multi-platform targets, not KMP — say so where
  confusable.
- **Existing pages to edit (cross-links, Group 7):** `apps/index.adoc` (lists only Android/Apple/React Native; its
  `:description:`/`:keywords:` need updating); `programming-languages/kotlin/build-and-tooling.adoc` (§ *A Pointer to
  Kotlin Multiplatform*; **line 140 links the 404 URL
  `https://kotlinlang.org/docs/multiplatform-getting-started.html`** → replace with K`get-started.html`);
  `programming-languages/kotlin/kotlin-and-the-jvm.adoc`, `programming-languages/kotlin/index.adoc`;
  `apps/android/{networking-retrofit-okhttp-and-ktor,room-database-and-paging,dependency-injection-hilt-and-koin,image-loading-coil-and-glide,compose-fundamentals}.adoc`;
  `apps/android/index.adoc`, `apps/apple/index.adoc`, `apps/react-native/index.adoc` (*Related sections*);
  `backend/architecture/decisions-and-migrations/index.adoc` (~line 231, external KMP link at
  `https://kotlinlang.org/docs/multiplatform.html` → add an `xref:` next to it).
- **Tooling:** Antora build `npx antora antora-playbook.yml` (extensions: lunr, mermaid, mathjax);
  Mermaid validation `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid`.
- `.archive/` precedents: `implementation_plan_169.md` (Android), `_175.md`, `_187.md`, `_192.md` (Azure, 11 groups).

## Shared *TrailMate Everywhere* scenario

Every code example is a slice of one project (package `com.example.trailmate`), defined in the issue's
*Running example* section so pages authored in parallel stay consistent without coordinating live:
modules `sharedLogic` · `sharedUI` · `androidApp` · `iosApp` · `desktopApp` · `webApp` (`wasmJs`); domain
`Trail(id, name, region, lengthKm, difficulty, photoUrl, isFavorite)`, `enum class Difficulty`, `TrailPhoto`;
Ktor `TrailApiClient` + `TrailDto` (`https://api.example.com/v1/`); SQLDelight `TrailMateDatabase` (`Trail.sq`) with
Room 3 alternative; DataStore `UserPreferencesRepository`; `TrailRepository` → `OfflineFirstTrailRepository`;
`expect`/`actual` `platformName()`/`currentTimeZone()`; `LocationProvider` (`AndroidLocationProvider`/
`IosLocationProvider`); `TrailListViewModel`/`TrailDetailViewModel` exposing `StateFlow<TrailListUiState>`; Koin
`trailMateModule`; tests `OfflineFirstTrailRepositoryTest`, `FakeTrailApiClient` (Ktor `MockEngine`),
`TrailListViewModelTest` (Turbine), `TrailListScreenTest` (`runComposeUiTest`); library example
`com.example:trail-geo`. Two UI paths: native UI (SwiftUI + Jetpack Compose) and shared UI (CMP everywhere, with an
`MKMapView` embedded on iOS).

## Conventions every content page must follow (issue *Section-wide rules*)

- **Header:** `= <Title>`, `:description:` (one long sentence), `:keywords:` (15–30 terms), blank line,
  `include::partial$kotlin-multiplatform-disclaimer.adoc[]` right after the header, intro paragraphs (stating the
  version baseline the examples target), `==` sections, and a final `== References` list formatted
  `https://…[Kotlin docs -- <title>]` (or `Android Developers --`, `Ktor --`, …).
- **Every code example is followed by an official link**, e.g. `See https://kotlinlang.org/docs/multiplatform/…[Kotlin docs -- <title>].`; third-party libraries link their own official docs. Only verified URLs.
- **Code conventions:** Kotlin, Gradle Kotlin DSL, TOML, Swift, YAML, shell, XML/plist. Each block starts with a
  comment giving its TrailMate path (e.g. `// sharedLogic/src/commonMain/kotlin/com/example/trailmate/data/TrailRepository.kt`).
  Code compiles against the baseline, non-obvious imports shown. **Swift snippets wherever the iOS side matters.**
  Every Gradle snippet uses `com.android.kotlin.multiplatform.library` for shared modules (no `com.android.library`).
- **Depth:** explain every concept/API a page names, with an example; ~350–700 lines of AsciiDoc per page; explain
  *why*; comparison tables; common mistakes; always state the stability level (Stable/Beta/Alpha/Experimental) of
  non-Stable APIs.
- **Figures:** Mermaid blocks (`[mermaid]`) or hand-written SVG in `modules/ROOT/images/kmp-*.svg`, included with
  `image::kmp-….svg[<detailed alt text>, width=760, role=text-center]`; SVG with `viewBox`, width ≤ 800, white
  background, system fonts, no scripts/external references. Each task authors the SVGs its own page embeds.
- **Cross-links:** `xref:` to related KMP pages, the Kotlin Reference, the Android section and the Apple section.
  The Kotlin language, Jetpack Compose basics and SwiftUI basics are **never re-taught**, only linked.
- **No admonitions** other than the disclaimer include (checked by grep in Task 38). **No book citation.**
  **Escape `{ }` in prose** (`\{…}`) and avoid line-leading `<digits>.`. No real keys/secrets (placeholders only).
- Every page must be reachable from both `apps/kotlin-multiplatform/index.adoc` and `nav.adoc` once Group 7 lands;
  pages `xref:` other pages by their planned final path (no page needs another page's finished text).

## Implementation steps

### Group 1 — Foundations: partial and baseline re-verification

**Parallelizable: yes** (two independent tasks: one creates a file, the other only verifies facts).

- [x] Task 1. Create `modules/ROOT/partials/kotlin-multiplatform-disclaimer.adoc`
  - [x] Task 1.1. Author an `[IMPORTANT]` / `====` block modelled on `partials/android-disclaimer.adoc` containing
    **only**: (a) the content was generated with AI assistance and should be verified against the official Kotlin
    Multiplatform documentation before being relied on in production; (b)
    `xref:apps/kotlin-multiplatform/index.adoc#_bibliography[the section bibliography]`. No version line, no book name.
  - [x] Task 1.2. Confirm the include line every page uses: `include::partial$kotlin-multiplatform-disclaimer.adoc[]`.
- [x] Task 2. Re-verify the version/stability baseline against live sources and record deviations
  - [x] Task 2.1. Check Kotlin latest stable and compatibility table (D`releases.html`,
    K`multiplatform-compatibility-guide.html`), CMP (K`compose-compatibility-and-versioning.html`, GitHub releases),
    AGP/Gradle/Xcode, Jetpack KMP library versions (A`/kotlin/multiplatform`), Swift export / SwiftPM import status
    (D`native-swift-export.html`, K`multiplatform-spm-import.html`), CMP Jetpack ports, and third-party versions
    (Maven Central / GitHub releases via `gh api`). Also re-test a sample of the issue's source URLs for HTTP 200 and
    confirm none of the exclusion-list URLs is reused.
  - [x] Task 2.2. Append the findings (confirmed values, any changed values and stability changes) as a short note under
    this task in this file, so all later tasks use one consistent set of versions.
  - Version verification note (re-verified 2026-10-01): **no deviations** from the issue baseline. Confirmed via
    GitHub releases / Maven Central / Google Maven: Kotlin 2.4.20, CMP 1.12.1, Ktor 3.6.0, SQLDelight 2.4.0,
    Koin 4.2.2, SKIE 0.10.15, KMP-NativeCoroutines 1.0.6, Mokkery 3.5.0, vanniktech 0.37.0, Dokka 2.2.0,
    Turbine 1.2.1, Room 3 `androidx.room3` 3.0.3, AGP 9.4.1 stable (9.5.0-alpha08 exists; not used). Swift export
    and SwiftPM import still Alpha. 12 source URLs returned HTTP 200; `docs/multiplatform-getting-started.html`
    still 404. Third-party libs not independently re-queried (Metro, kotlin-inject, Kermit, Coil, Kotest, settings,
    KMMBridge, GitLive, Jetpack lifecycle/navigation ports, Gradle 9.8.0, Xcode 26.4) keep the issue baseline.
    Stated versions in every later task: use the issue's baseline table unchanged.

### Group 2 — Content pages: Foundations (issue pages 1–8)

**Parallelizable: yes.** Eight independent pages (Tasks 3–10), each in its own file, each including the Group 1
partial and only `xref:`ing other pages by planned path. Each task: read its page entry in the issue (`### Foundations`)
and author the page + the figures listed for it.

- [x] Task 3. Create `apps/kotlin-multiplatform/what-is-kotlin-multiplatform.adoc` — *What Kotlin Multiplatform Is and When to Use It* (issue page 1)
  - [x] Task 3.1. Page: native vs cross-platform vs multiplatform and the economics (synchronization cost, assumed vs actual cost of cross-platform); sharing spectrum; use cases/adopters; stability tables for KMP and CMP with the Stable/Beta/Alpha/Experimental definitions; Google's support tiers; comparison with Flutter and React Native (xref `apps/react-native/index.adoc`); how the section is organized.
  - [x] Task 3.2. Figures: `images/kmp-sharing-spectrum.svg`; a Mermaid decision flow (KMP / CMP / React Native / Flutter / native).
- [x] Task 4. Create `apps/kotlin-multiplatform/how-kmp-compiles-targets-and-tiers.adoc` — *How KMP Compiles* (page 2)
  - [x] Task 4.1. Page: K2 frontend and the JVM/Native(LLVM)/JS IR/Wasm backends, `.klib`, per-target compilation, Kotlin/Native target list + tiers + deprecated targets, Apple minimum OS versions, host requirements (Apple binaries need macOS).
  - [x] Task 4.2. Figure: `images/kmp-compilers.svg` (commonMain → per-target compilers → AAR/JAR, framework/XCFramework, .js, .wasm).
- [x] Task 5. Create `apps/kotlin-multiplatform/getting-started-and-tooling.adoc` — *Getting Started: IDEs, the KMP Plugin and Your First Project* (page 3)
  - [x] Task 5.1. Page: IDE choices and the KMP plugin (preflight checks replace kdoctor — do not link the kdoctor 404), Xcode, JDK/JBR, `ANDROID_HOME`, New Project wizard and https://kmp.jetbrains.com/, generated project and run configurations, emulator/simulator, debugging, the two tutorial paths, Kotlin Toolchain (Alpha, mention only), learning resources.
- [x] Task 6. Create `apps/kotlin-multiplatform/project-structure-and-source-sets.adoc` — *Project Structure, Targets, Source Sets and the Hierarchy Template* (page 4)
  - [x] Task 6.1. Page: targets/compilations/source sets, default hierarchy template (`appleMain`, `iosMain`, `nativeMain`, `webMain`…), manual `dependsOn` (legacy), visibility between source sets, recommended layout (`androidApp`/`iosApp`/`desktopApp`/`webApp`/`sharedLogic`/`sharedUI`; legacy `composeApp`), umbrella framework for iOS.
  - [x] Task 6.2. Figures: `images/kmp-source-set-hierarchy.svg`; Mermaid module graph of TrailMate Everywhere.
- [x] Task 7. Create `apps/kotlin-multiplatform/gradle-configuration-and-compatibility.adoc` — *Gradle Configuration, the Multiplatform DSL and Compatibility* (page 5)
  - [x] Task 7.1. Page: `settings.gradle.kts`, a complete `gradle/libs.versions.toml`, the `kotlin {}` DSL (targets, type-safe `sourceSets`, `compilerOptions`, Experimental top-level `dependencies {}`), compilations, native binaries (`framework`, `staticLib`, `executable`, `XCFramework`, `export()`, `isStatic`), `gradle.properties` flags, configuration/build cache, compatibility table, removal of `ios()` shortcuts.
- [x] Task 8. Create `apps/kotlin-multiplatform/android-target-and-agp-9.adoc` — *The Android Target: the Android-KMP Library Plugin and AGP 9* (page 6)
  - [x] Task 8.1. Page: `com.android.kotlin.multiplatform.library` and `kotlin { android { namespace; compileSdk; minSdk } }`, single-variant model (BuildKonfig alternative), opt-ins (`withJava()`, `withHostTest {}`/`withDeviceTest {}`, `androidResources`, consumer keep rules), `androidRuntimeClasspath`, why AGP 9 forces the `androidApp` split, built-in Kotlin, migration steps, `android.enableLegacyVariantApi` until AGP 10, `androidTarget` → `android`, legacy layout removed in 2.4.0, custom Gradle plugins.
  - [x] Task 8.2. Figure: Mermaid "before and after AGP 9" module diagram. Link `xref:apps/android/project-structure-and-gradle.adoc`.
- [x] Task 9. Create `apps/kotlin-multiplatform/expect-actual-and-platform-apis.adoc` — *expect/actual and Calling Platform APIs* (page 7)
  - [x] Task 9.1. Page: expect/actual functions/properties/classes/objects/interfaces/enums/annotations, matching rules, `typealias` actualization, expect/actual classes **Beta** (`-Xexpect-actual-classes`), alternatives comparison table (interfaces, factories, DI), Foundation/UIKit from `iosMain`, Android APIs from `androidMain`, `@OptionalExpectation`, `platformName()` and `LocationProvider`.
  - [x] Task 9.2. Figure: Mermaid class diagram of `LocationProvider` and implementations.
- [x] Task 10. Create `apps/kotlin-multiplatform/dependencies-and-the-library-ecosystem.adoc` — *Dependencies, klibs.io, cinterop and SwiftPM Import* (page 8)
  - [x] Task 10.1. Page: multiplatform dependencies in `commonMain`/platform source sets, per-target variant resolution, klibs.io (and its MCP server), Android and iOS dependencies, cinterop `.def` files, CocoaPods `pod()`, **SwiftPM import (Alpha)** `swiftPMDependencies {}`, KSP in multiplatform (`kspCommonMainMetadata`, `kspAndroid`, `kspIosArm64`; use `/docs/ksp-multiplatform.html`, not the 404), `api` vs `implementation` and what reaches the iOS framework.

### Group 3 — Content pages: Sharing business logic (issue pages 9–15)

**Parallelizable: yes.** Seven independent pages (Tasks 11–17). Read the issue's `### Sharing business logic` entries.

- [x] Task 11. Create `apps/kotlin-multiplatform/kotlin-for-swift-developers.adoc` — *Kotlin for Swift Developers* (page 9)
  - [x] Task 11.1. Page: Swift ↔ Kotlin mapping tables (optionals/nullable, struct/data class, protocols/interfaces, extensions, enums/sealed, closures/lambdas, `async`/`await` vs `suspend`, Combine/`AsyncSequence` vs `Flow`, SPM vs Gradle, access control, `throws` vs exceptions + `@Throws`); link `programming-languages/kotlin/*` and `apps/apple/*` instead of re-teaching.
- [x] Task 12. Create `apps/kotlin-multiplatform/coroutines-flow-and-concurrency.adoc` — *Coroutines, Flow and Concurrency in Shared Code* (page 10)
  - [x] Task 12.1. Page: kotlinx-coroutines in `commonMain`, dispatchers per platform (iOS Main via main queue, IO on Native, `kotlinx-coroutines-swing` for desktop), structured concurrency in shared ViewModels, `StateFlow`/`SharedFlow`, freezing/`native-mt` history vs the new memory manager, `kotlin.concurrent.atomics`, UIKit thread confinement, link to the Testing page; link `programming-languages/kotlin/coroutines-basics.adoc` and `flows.adoc`.
- [x] Task 13. Create `apps/kotlin-multiplatform/architecture-and-shared-viewmodels.adoc` — *Architecture, Shared ViewModels and State* (page 11)
  - [x] Task 13.1. Page: layers to share, offline-first repository, UI state as sealed interface, Jetpack ViewModel in KMP (`viewModelScope`, `viewModelFactory { initializer {} }`, `export()` to iOS), SwiftUI `ViewModelStoreOwner` pattern, SavedState, DTOs vs domain models at the Swift boundary, callbacks from shared ViewModels, error modelling, modularization and `api` vs `implementation` impact, MVVM vs MVI, Decompose (mention).
  - [x] Task 13.2. Figure: `images/kmp-architecture-layers.svg`.
- [x] Task 14. Create `apps/kotlin-multiplatform/networking-with-ktor.adoc` — *Networking with the Ktor Client* (page 12)
  - [x] Task 14.1. Page: `HttpClient` in common code, engines per platform (OkHttp, Darwin, CIO/Java, Js) via source sets, `ContentNegotiation` + kotlinx.serialization, `defaultRequest`, timeouts, retries, logging, bearer auth refresh, `expectSuccess` and error handling, WebSockets (brief), `MockEngine`, Ktor 1.x → 3.x changes, `TrailApiClient`; link `xref:apps/android/networking-retrofit-okhttp-and-ktor.adoc`.
- [x] Task 15. Create `apps/kotlin-multiplatform/local-storage-sqldelight-room-and-datastore.adoc` — *Local Storage: SQLDelight, Room, SQLite Drivers, DataStore and Settings* (page 13)
  - [x] Task 15.1. Page: SQLDelight 2.4 (plugin, `.sq`, generated queries, drivers per platform, coroutines extensions, migrations); Room KMP/Room 3 (`androidx.room3`, KSP per target, `@ConstructedBy`/`RoomDatabaseConstructor`, platform `databaseBuilder`s, `BundledSQLiteDriver`, `suspend`/`Flow` DAO rule); `androidx.sqlite` drivers table; Preferences DataStore KMP with `OkioStorage`/`FileStorage` path producers; multiplatform-settings; kotlinx-io/Okio files; SQLDelight vs Room comparison table; link `xref:apps/android/room-database-and-paging.adoc`.
- [x] Task 16. Create `apps/kotlin-multiplatform/dependency-injection-koin-and-metro.adoc` — *Dependency Injection in KMP: Koin, Metro and Manual DI* (page 14)
  - [x] Task 16.1. Page: why Hilt/Dagger does not apply, manual constructor injection, Koin 4.2 (modules, `single`/`factory`/`viewModel`, platform modules via expect/actual, `startKoin` from Android and Swift `doInitKoin`, `koinViewModel()` in CMP, `verify()`), Metro and kotlin-inject as compile-time alternatives, comparison table; link `xref:apps/android/dependency-injection-hilt-and-koin.adoc`.
- [x] Task 17. Create `apps/kotlin-multiplatform/essential-multiplatform-libraries.adoc` — *Essential Multiplatform Libraries* (page 15)
  - [x] Task 17.1. Page: curated tour with a snippet each — kotlinx-serialization, kotlinx-datetime, kotlinx-io, kotlinx-collections-immutable, Kermit, Coil 3 (link the Android image-loading page), GitLive Firebase, Store5 (mention); how to judge a library (targets, klibs.io, maintenance; Napier and PreCompose are stale).

### Group 4 — Content pages: iOS integration and interop (issue pages 16–19)

**Parallelizable: yes.** Four independent pages (Tasks 18–21). Read the issue's `### iOS integration and interop` entries. Swift snippets are mandatory throughout; link `apps/apple/*` for Xcode/SPM/SwiftUI basics.

- [x] Task 18. Create `apps/kotlin-multiplatform/ios-integration-options.adoc` — *Integrating Shared Code into iOS: Direct, SwiftPM and CocoaPods* (page 16)
  - [x] Task 18.1. Page: direct integration (`embedAndSignAppleFrameworkForXcode` run-script phase, framework search paths, user-script sandboxing setting), local SwiftPM package, local CocoaPods podspec; remote XCFramework with a `Package.swift` binary target (`assemble…XCFramework`, `swift package compute-checksum`, GitHub Releases, `Package.swift` generated since 2.4.20), KMMBridge (mention); CocoaPods DSL and why it cannot be combined with embedAndSign; CocoaPods → SwiftPM migration (`integrateEmbedAndSign`, `integrateLinkagePackage`); monorepo vs separate iOS repo decision table; link `xref:apps/apple/swift-packages-and-modularization.adoc`.
  - [x] Task 18.2. Figure: Mermaid flow of the Xcode build (build phase → Gradle → framework → link → embed & sign).
- [x] Task 19. Create `apps/kotlin-multiplatform/objective-c-and-swift-interop.adoc` — *Objective-C Interop, Swift Export and SKIE* (page 17)
  - [x] Task 19.1. Page: how Kotlin appears through the Obj-C header (naming/clashes, flattened packages, `…Kt` classes, generics limits, sealed classes/enums, default args, `Unit`/`Nothing`, collections bridging, exceptions + `@Throws`); annotations (`@ObjCName`, `@HiddenFromObjC`, `@ShouldRefineInSwift`, `@HidesFromObjC`); `export()`/transitive export and binary-size/header-size impact; SKIE; Swift export (Alpha) with `swiftExport {}`/`embedSwiftExportForXcode`; calling Swift-only APIs via an interface implemented in Swift; privacy manifest for SDKs. Use `/docs/native-objc-interop.html` (not the `/docs/multiplatform/` 404).
  - [x] Task 19.2. Figure: `images/kmp-objc-swift-mapping.svg` (Kotlin → Obj-C header → Swift, with and without SKIE / Swift export).
- [x] Task 20. Create `apps/kotlin-multiplatform/coroutines-and-flow-from-swift.adoc` — *Consuming Coroutines and Flow from Swift and SwiftUI* (page 18)
  - [x] Task 20.1. Page: default `suspend` in Swift (completion handlers/`async`, no cancellation); KMP-NativeCoroutines 1.0.6 (`@NativeCoroutines`, `asyncFunction`, `asyncSequence`, Combine/RxSwift adapters); SKIE native `async`/`AsyncSequence` with cancellation; Swift export mapping; observing a shared `StateFlow` ViewModel from SwiftUI (`@Observable`/`@StateObject`, `.task {}`); lifecycle, cancellation, threading; three-way comparison table.
  - [x] Task 20.2. Figure: Mermaid sequence (SwiftUI view → wrapper → shared ViewModel → Flow emissions → cancellation).
- [x] Task 21. Create `apps/kotlin-multiplatform/kotlin-native-memory-performance-and-debugging.adoc` — *Kotlin/Native Memory, Performance, Binary Size and Debugging* (page 19)
  - [x] Task 21.1. Page: memory manager (shared heap, tracing GC), CMS GC default in 2.4.0 (`kotlin.native.binary.gc`), ARC integration (deinit, retain cycles across the boundary, background state), binary options (`smallBinary`, `stackProtector`, `bundleId`, `sourceInfoType`…), static vs dynamic frameworks, app-size practices, compile-time tips, debugging in Xcode/LLDB, dSYM symbolication, Instruments profiling, C interop basics. Use `/docs/native-memory-manager.html` (not the `/docs/multiplatform/` 404).

### Group 5 — Content pages: Sharing UI with Compose Multiplatform (issue pages 20–26)

**Parallelizable: yes.** Seven independent pages (Tasks 22–28). Read the issue's `### Sharing UI with Compose Multiplatform` entries. Jetpack Compose and SwiftUI basics are linked (`apps/android/compose-*.adoc`, `apps/apple/*`), never re-taught.

- [x] Task 22. Create `apps/kotlin-multiplatform/compose-multiplatform-fundamentals.adoc` — *Compose Multiplatform Fundamentals* (page 20)
  - [x] Task 22.1. Page: CMP vs Jetpack Compose, artifact and version mapping, stability and minimum OS per platform, compiler plugin `org.jetbrains.kotlin.plugin.compose`/`composeCompiler {}`, deprecated plugin aliases (`compose.ui`…) → direct coordinates, entry points (`MainActivity`/`setContent`, `ComposeUIViewController`, `application { Window }`, `ComposeViewport`), common `@Preview`, Compose Hot Reload (desktop JVM, `hotRun`), Android-only APIs to avoid in common code, platform-specific defaults. Do not use the 404 `whats-new-compose-113.html`.
  - [x] Task 22.2. Figure: `images/kmp-compose-multiplatform-stack.svg`.
- [x] Task 23. Create `apps/kotlin-multiplatform/compose-multiplatform-resources.adoc` — *Resources and Localization in Compose Multiplatform* (page 21)
  - [x] Task 23.1. Page: `composeResources/` (`drawable`, `font`, `values`, `files`) and the generated `Res` class (`publicResClass`, `packageOfResClass`), `painterResource`, `stringResource`/`getString`, `pluralStringResource`, `stringArrayResource`, `Font`, `Res.readBytes`/`getUri`, qualifiers and priority, library/non-common resources, localization and `LocalAppLocale` via expect/actual, regional formats, RTL, localization tests, web preloading/caching, moko-resources as legacy.
- [x] Task 24. Create `apps/kotlin-multiplatform/compose-multiplatform-navigation-and-lifecycle.adoc` — *Lifecycle, ViewModel and Navigation in Compose Multiplatform* (page 22)
  - [x] Task 24.1. Page: common `LifecycleOwner` and iOS/desktop mappings; `viewModel { … }` (no reflection on Native) and `koinViewModel()`; Navigation Compose (type-safe `@Serializable` routes, `NavHost`, deep links on iOS/web, `bindToBrowserNavigation()`); Navigation 3 in CMP (`NavKey`, back stack, `NavDisplay`, `SavedStateConfiguration` polymorphic serializers, browser-history gap); navigationevent (`NavigationEventHandler` replaces `PredictiveBackHandler`) and the iOS back gesture; Decompose/Voyager (brief); link `xref:apps/android/compose-navigation.adoc`.
  - [x] Task 24.2. Figure: Mermaid TrailMate navigation graph and back stack.
- [x] Task 25. Create `apps/kotlin-multiplatform/compose-multiplatform-ui-adaptive-and-accessibility.adoc` — *Layouts, Material 3, Adaptive UI, Popups and Accessibility* (page 23)
  - [x] Task 25.1. Page: layouts/modifiers in common code, Material 3 in CMP (versioned separately; `MaterialExpressiveTheme` Experimental), window size classes (`currentWindowAdaptiveInfoV2`) and adaptive layouts, `Popup`/`Dialog`, drag and drop (Experimental), accessibility (common semantics, iOS VoiceOver mapping `testTag` → `accessibilityIdentifier`, desktop macOS/Windows Java Access Bridge, web), images and icons.
- [x] Task 26. Create `apps/kotlin-multiplatform/compose-multiplatform-on-ios.adoc` — *Compose Multiplatform on iOS: UIKit and SwiftUI Interop* (page 24)
  - [x] Task 26.1. Page: `ComposeUIViewController` hosted in UIKit and SwiftUI (`UIViewControllerRepresentable`), UIKit in Compose (`UIKitView`, `UIKitViewController`, `UIKitInteropProperties`), SwiftUI in Compose (`UIHostingController`), cooperative vs non-cooperative touch, `CADisableMinimumFrameDurationOnPhone`, native text input (Experimental), IME options, frame rate, iOS accessibility, mixing native and CMP screens (Liquid Glass tutorial pattern), incremental adoption, migration notes, embedding an `MKMapView` for TrailMate; Swift snippets throughout.
  - [x] Task 26.2. Figure: `images/kmp-cmp-ios-interop.svg` (SwiftUI ⇄ UIKit ⇄ Compose nesting options).
- [x] Task 27. Create `apps/kotlin-multiplatform/compose-multiplatform-desktop.adoc` — *Compose Multiplatform for Desktop* (page 25)
  - [x] Task 27.1. Page: `application {}`, `Window`, `WindowState`, `DialogWindow`, window API v2 (Experimental), `Tray` and notifications, `MenuBar`/`KeyShortcut`, keyboard/mouse/focus, scrollbars, tooltips, context menus, images, Swing interop (`ComposePanel`, `SwingPanel`); distribution (`nativeDistributions` DMG/PKG/MSI/EXE/DEB/RPM, jpackage, JDK 17+, ProGuard release builds, macOS signing and notarization); desktop UI tests.
- [x] Task 28. Create `apps/kotlin-multiplatform/web-with-kotlin-wasm-and-js.adoc` — *Web Targets: Kotlin/Wasm, Kotlin/JS and Compose for Web* (page 26)
  - [x] Task 28.1. Page: `wasmJs` vs `wasmWasi` vs `js`, WasmGC browser requirement, `webMain` source set; Compose for Web (`ComposeViewport`, CSS, compatibility build with JS fallback `composeCompatibilityBrowserDistribution`, `HtmlElementView`, browser navigation); JS interop from Wasm (`@JsModule`, `external`), npm dependencies; Kotlin/JS sharing logic with TypeScript (`@JsExport`, generated `.d.ts`); browser debugging; `wasmJsBrowserDistribution` and GitHub Pages deployment. State Wasm/CMP-web as Beta.

### Group 6 — Content pages: Quality, shipping and adoption (issue pages 27–31)

**Parallelizable: yes.** Five independent pages (Tasks 29–33). Read the issue's `### Quality, shipping and adoption` entries.

- [x] Task 29. Create `apps/kotlin-multiplatform/testing.adoc` — *Testing Multiplatform Code* (page 27)
  - [x] Task 29.1. Page: `kotlin.test` in `commonTest` and per-target tasks (`allTests`, `jvmTest`, `iosSimulatorArm64Test`, `testAndroidHostTest`, `wasmJsTest`), reports, macOS-only Apple tests, `kotlinx-coroutines-test` (`runTest`, `StandardTestDispatcher`, `Dispatchers.setMain`), Turbine, fakes vs mocks on Native, Mokkery (and why MockK is JVM-only), Kotest, Ktor `MockEngine`, in-memory SQLDelight/Room drivers, Koin `verify()`, platform tests (Android host/device, XCTest calling the framework), CMP UI tests `runComposeUiTest` (v2, Experimental), Kover (mention); link `programming-languages/kotlin/testing.adoc`.
- [x] Task 30. Create `apps/kotlin-multiplatform/publishing-multiplatform-libraries.adoc` — *Publishing Multiplatform Libraries (Maven Central, SwiftPM, npm)* (page 28)
  - [x] Task 30.1. Page: `maven-publish` with KMP (root and per-target publications, Gradle module metadata, single macOS host, Android library variants); Maven Central Portal, namespace, GPG, vanniktech 0.37.0 (`publishToMavenCentral()`, `signAllPublications()`, `pom {}`), `com.example:trail-geo` worked example; XCFramework release for SwiftPM; npm publishing (`npm-publish`, Trusted Publishing); API guidelines for multiplatform libraries, explicit API mode, ABI validation in KGP (`abiValidation()`, `checkKotlinAbi`, Experimental), Dokka 2 (`dokkaGenerate`) to GitHub Pages. Do not use `multiplatform-publish-lib.html` (404).
  - [x] Task 30.2. Figure: Mermaid publishing flow (tag → macOS CI → Maven Central + XCFramework release + `Package.swift` + docs).
- [x] Task 31. Create `apps/kotlin-multiplatform/publishing-apps.adoc` — *Publishing KMP Apps to Google Play, the App Store, Desktop and the Web* (page 29)
  - [x] Task 31.1. Page: Android release build of `androidApp` (link `apps/android/building-signing-and-releasing.adoc`, `publishing-on-google-play.adoc`); iOS bundle ID, versioning, signing, archiving, TestFlight (link Apple App Store pages), dSYM crash symbolication for Kotlin frames, privacy manifest for the app and KMP frameworks; desktop installers (link the desktop page) and static web deployment; release checklist per platform.
- [x] Task 32. Create `apps/kotlin-multiplatform/ci-cd-with-github-actions.adoc` — *CI/CD for KMP with GitHub Actions* (page 30)
  - [x] Task 32.1. Page: CI workflow (JVM/Android/Wasm on `ubuntu-latest`, iOS/Apple on `macos-latest` with Xcode pinned via setup-xcode — pin Xcode 26.4; `setup-java@v6`, `setup-gradle@v6`, caching `~/.konan`; `allTests`, `xcodebuild` simulator build, report upload, concurrency, matrix); library release workflow (`release: [released]`, `ORG_GRADLE_PROJECT_*` secrets, XCFramework zip + checksum); app delivery (Play upload link to the Android CI page, TestFlight via fastlane or TeamCity Cloud mention); Dependabot and secrets hygiene; link `git-and-github/index.adoc`. Use the action versions re-verified in Task 2.
  - [x] Task 32.2. Figure: Mermaid pipeline (PR → Linux and macOS jobs → merge → release → Maven Central / SwiftPM / stores).
- [x] Task 33. Create `apps/kotlin-multiplatform/adopting-kmp-in-existing-apps.adoc` — *Adopting KMP in Existing Android and iOS Apps* (page 31)
  - [x] Task 33.1. Page: migrating an Android app (swap Retrofit → Ktor, Room → Room KMP/SQLDelight, Hilt → Koin/Metro, then move logic, then optionally UI with CMP; TrailMate as worked example), making an Android app work on iOS, monorepo vs separate shared-library repository and their consumption models, team structure/ownership, review across Kotlin and Swift, introducing KMP to a team (iOS engineers' concerns), what to share first, measuring success, common pitfalls.
  - [x] Task 33.2. Figure: `images/kmp-repository-strategies.svg` (monorepo vs multi-repo with a published framework).

### Group 7 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task creates or edits a **distinct** file (or a distinct set of files per sub-task) and only
references pages that exist after Groups 1–6. The Bibliography task must read the External URLs actually cited in
Tasks 3–33 (`grep -rhoE 'https?://[^] ]+' modules/ROOT/pages/apps/kotlin-multiplatform/`).

- [x] Task 34. Create `apps/kotlin-multiplatform/index.adoc` — landing page *Kotlin Multiplatform*
  - [x] Task 34.1. Header + `:description:`/`:keywords:` + disclaimer include; intro (what KMP/CMP are, the version baseline from Task 2, the Kotlin Reference and the Android/Apple/React Native sibling sections).
  - [x] Task 34.2. `== How Kotlin Multiplatform got here` year/change table (2017–2018 Kotlin/Native → 2026 AGP 9 plugin, Swift export Alpha, SwiftPM import) as specified in the issue.
  - [x] Task 34.3. `== New here? Read in this order`: shared-logic path 1→3→4→7→10→11→12→13→16→18; shared-UI path 1→3→4→20→21→22→24; existing-app path 31→6→16 (xref each page).
  - [x] Task 34.4. `== The TrailMate Everywhere project` (from the scenario above) and `== What's covered` grouped exactly like the nav, one line per page plus the cheat sheet.
  - [x] Task 34.5. `== Book and official sources compared`: every table of the issue's *Book cross-check* (concept × book matrix, concepts found mostly in the book, official concepts missing from the book, outdated book material with modern replacements) in prose and tables. This is the only place the book is described.
  - [x] Task 34.6. `== Related sections` (Kotlin Reference, Android, Apple Platforms, React Native, Git & GitHub) and `== Bibliography` (anchor `_bibliography`) with the subsections listed in the issue (Kotlin Multiplatform documentation; Kotlin/Native-Wasm-JS-Gradle-API guidelines; Compose Multiplatform; Android Developers; Tools; Third-party libraries; Publishing and CI; Book with the Packt link, ISBN 978-1-80181-258-0 and the companion GitHub repo). It lists **every** external URL cited on any page.
  - Verified: `apps/kotlin-multiplatform/index.adoc` created (history table, 3 reading paths, TrailMate Everywhere, What's covered, book cross-check tables, Related sections, Bibliography with 307 deduplicated URLs plus the Packt entry; every external URL cited on the 31 concept pages is listed, placeholder/example URLs excluded). Antora build clean.
- [x] Task 35. Create `apps/kotlin-multiplatform/cheat-sheet.adoc` and `modules/ROOT/attachments/kotlin-multiplatform-cheat-sheet.pdf`
  - [x] Task 35.1. Page `= Kotlin Multiplatform Cheat Sheet` shaped like `apps/android/cheat-sheet.adoc`: disclaimer, links to every page grouped by nav section (verify every xref target exists with `ls` first), `== Download` with `xref:attachment$kotlin-multiplatform-cheat-sheet.pdf[Download the Kotlin Multiplatform Cheat Sheet (PDF)]`.
  - [x] Task 35.2. Author a print-ready single-A4 HTML/CSS layout **in the scratchpad**, min font 6 pt, in the house style of the existing cheat-sheet PDFs, with one box per concept group listed in the issue's cheat-sheet spec (what to share + stability; compilers/targets + tiers; layout + source-set mini diagram; `kotlin {}` DSL + version catalog; Android-KMP plugin/AGP 9; expect/actual vs interfaces; dependency ecosystem; coroutines and dispatchers per platform; shared ViewModel; Ktor; SQLDelight/Room/DataStore; Koin; iOS integration mini table; Obj-C/Swift mapping, SKIE, Swift export; `suspend`/`Flow` from Swift; Native memory and binary options; CMP entry points; CMP resources; CMP navigation; CMP iOS interop; desktop packaging; Wasm and JS; testing; publishing; CI snippet; adoption checklist).
  - [x] Task 35.3. Render with headless Chrome `--print-to-pdf --no-pdf-header-footer`; verify with PyMuPDF `page_count == 1` and 595×842 pt; render and inspect a PNG preview for clipping, iterating until it fits. Copy only the PDF into `modules/ROOT/attachments/`; confirm via `git status --porcelain` that no stray `.html`/`.png` landed in the repo and nothing from the book was copied.
  - Verified: `cheat-sheet.adoc` (all 31 xref targets exist) and `modules/ROOT/attachments/kotlin-multiplatform-cheat-sheet.pdf` (PyMuPDF: 1 page, 595x842 pt, min font 6 pt, PNG preview inspected, no clipping). HTML/CSS/PNG stayed in the scratchpad.
- [x] Task 36. Wire `modules/ROOT/nav.adoc`
  - [x] Task 36.1. Insert `*** xref:apps/kotlin-multiplatform/index.adoc[Kotlin Multiplatform]` right after the last Android `****` entry (`apps/android/cheat-sheet.adoc`) and before `*** xref:apps/react-native/index.adoc[React Native]`, followed by 32 `****` entries: pages 1–31 in the issue's order (labels from each page's `= Title`), then `**** xref:apps/kotlin-multiplatform/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Verify with `grep -c` that exactly 32 `****` lines were added.
  - Verified: `nav.adoc` has the landing entry plus exactly 32 `****` entries between Android and React Native.
- [x] Task 37. Cross-links in existing pages (one sentence/bullet each; never repeat content; each file edited by exactly one sub-task)
  - [x] Task 37.1. `modules/ROOT/pages/apps/index.adoc`: add a Kotlin Multiplatform bullet summarizing the section (between Android and Apple, matching the nav order); update `:description:` and `:keywords:`.
  - [x] Task 37.2. `modules/ROOT/pages/programming-languages/kotlin/build-and-tooling.adoc`: in § *A Pointer to Kotlin Multiplatform*, link the new section; replace the 404 URL on line 140 (`multiplatform-getting-started.html`) with `https://kotlinlang.org/docs/multiplatform/get-started.html`.
  - [x] Task 37.3. `modules/ROOT/pages/programming-languages/kotlin/kotlin-and-the-jvm.adoc` (KMP section and *See Also*) and `programming-languages/kotlin/index.adoc`: link the new section.
  - [x] Task 37.4. `modules/ROOT/pages/apps/android/networking-retrofit-okhttp-and-ktor.adoc` (§ Ktor), `room-database-and-paging.adoc` (Room 3 KMP), `dependency-injection-hilt-and-koin.adoc` (§ Metro), `image-loading-coil-and-glide.adoc`, `compose-fundamentals.adoc`: one *See also* line each pointing to the matching KMP page.
  - [x] Task 37.5. `modules/ROOT/pages/apps/android/index.adoc`, `apps/apple/index.adoc`, `apps/react-native/index.adoc`: in *Related sections*, point to the new section.
  - [x] Task 37.6. `modules/ROOT/pages/backend/architecture/decisions-and-migrations/index.adoc` (~line 231): add `xref:apps/kotlin-multiplatform/index.adoc[Kotlin Multiplatform]` next to the external KMP link.
  - Verified: edited `apps/index.adoc`, `kotlin/build-and-tooling.adoc` (404 URL replaced), `kotlin/kotlin-and-the-jvm.adoc`, `kotlin/index.adoc`, five Android pages, `apps/{android,apple,react-native}/index.adoc`, `decisions-and-migrations/index.adoc`; Antora build clean.

### Group 8 — Build and verify

**Parallelizable: yes** (single task; depends on every prior group).

- [x] Task 38. Verify the whole section builds cleanly and meets the acceptance criteria
  - [x] Task 38.1. Admonition rule: `grep -rE '^\[(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]|^(NOTE|TIP|WARNING|IMPORTANT|CAUTION):' modules/ROOT/pages/apps/kotlin-multiplatform/` returns nothing; the only admonition in the section is the partial's `[IMPORTANT]`.
  - [x] Task 38.2. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` (delegate to the `iru-gate-runner` agent so output stays out of the main context); fix any failing block.
  - [x] Task 38.3. Run `npx antora antora-playbook.yml` (via `iru-gate-runner`); fix every xref/AsciiDoc error and warning (escape `\{ }` in prose, line-leading `<digits>.`, include/image paths); re-run until zero errors/warnings.
  - [x] Task 38.4. Content checks: all 31 pages + index + cheat sheet exist and are listed in `nav.adoc` (32 `****` entries + the landing entry); each page has `:description:`, `:keywords:`, the disclaimer include and `== References`; every `image::kmp-*.svg` reference exists; no `com.android.library` in shared-module Gradle snippets; no URL from the exclusion list is present (`grep` each); no book citation outside `index.adoc`; the Bibliography lists every external URL cited on any page.
  - [x] Task 38.5. Browse `build/site/apps/kotlin-multiplatform/` page by page (Browser pane or served build): figures render, Mermaid renders, nav entry order is correct, the cheat-sheet PDF downloads and is one A4 page.
  - [x] Task 38.6. Spot-check at least one external link per page (and the three stability/status claims with the highest churn: Swift export, SwiftPM import, CMP web) for HTTP 200/accuracy against the live docs; fix any 404 or stale fact found.
  - [x] Task 38.7. `git status --porcelain`: only intended new/modified files; no scratchpad HTML/PNG, no copy of `~/Desktop/kotlin-multiplatform.pdf`; run `/iru-check-security`-style scan only if `iru-code`'s gate requires it.
  - Verified (2026-10-02): no admonitions in the section; Mermaid 684/684 diagrams parse; Antora build exit 0 with empty log (no warnings); 33 pages (index + 31 + cheat sheet) in nav with 32 `****` entries and correct order; headers/disclaimer/References present; all `kmp-*.svg` exist; no `com.android.library` in code blocks; no exclusion-list URL; no book citation outside `index.adoc`; Bibliography covers every cited URL. Browsed the built site (served locally, all 33 pages loaded in the Browser pane): 0 broken images, all 14 Mermaid diagrams rendered, no unresolved xref/include text, cheat-sheet PDF served as application/pdf and is 1 page 595x842 pt. 308 unique external URLs curl-checked: all 200 except Okio docs site (square.github.io/okio, 404, replaced by github.com/square/okio) and Packt (403 to curl, bot block; page exists). Swift export / SwiftPM import Alpha and Kotlin/Wasm Beta confirmed live. Fixes: Koin `verify()` is JVM-only (testing.adoc moved the test to androidHostTest and dropped a stale OptIn); Material 3 placeholder versions replaced with 1.12.0-alpha03 / adaptive 1.3.0-rc01 (CMP 1.12.1 release notes, verified on Maven Central); Room 3 artifacts (`room3-runtime`, `room3-compiler`, plugin `androidx.room3`, 3.0.3) confirmed on Google Maven. `git status`: only intended files plus `.secrets.baseline` and this plan; no stray HTML/PNG.
