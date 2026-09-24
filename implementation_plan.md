# Implementation Plan: Apple Platforms, part 1: foundations, Xcode tooling, SwiftUI and design (+ #170 scaffolding)

## Task summary

Source: GitHub issue #172
Base branch: feature/170

Issue [#172](https://github.com/albertoirurueta/docs/issues/172) covers **pages 1–20** of the new *Apple Platforms
(iOS, iPadOS, macOS, watchOS, visionOS)* section under *Guides & References → Apps*. The pages go in
`modules/ROOT/pages/apps/apple/`:

- 8 foundation and tooling pages;
- 12 pages on SwiftUI, UI and design.

Parent issue [#170](https://github.com/albertoirurueta/docs/issues/170) defines the section-wide rules and owns the scaffolding. The shared
branch model is: this work is on `feature/172`, and its PR targets `feature/170`, never `main`.

Decisions taken with the user for this run:

1. **#170's pending work is included here.** `feature/170` has no commits beyond `main`, so this plan also
   delivers #170's scaffolding and cross-links:
   - the disclaimer partial;
   - the landing page;
   - the full nav block;
   - the Apps / Android / root-index wiring;
   - cross-links from existing pages.

   #170's own final review is **not** part of this plan.
2. **Forward links stay as real `xref:`s.** Links to pages that #173, #174 and #175 will create are written as
   real links, even though `npx antora` will report them as unresolved until those parts land. The final review
   on #170 checks them; this was recorded in a comment on #170.
3. **Swift examples are not compiled here.** They are written and checked against Apple's official
   documentation only, because the cloud container has no Xcode or Swift toolchain. The user compiles them
   locally once all parts are done (recorded on #170).
4. **Deferred to #170's final review** (recorded on #170):
   - a final check of Apple link reachability and rendering in both themes;
   - the facts #172 flags as "verify at implementation time": MainActor-by-default isolation and the Swift 6.4
     feature list.

   Pages still state them as the issue describes, citing the official source page.

**Approach:** follow the React Native section (#161, `.archive/implementation_plan_161.md`) exactly for
structure, disclaimer, figures and references. Every page follows the rules in #170:

- the only admonition is the `apple-disclaimer` include;
- `:description:` and `:keywords:`;
- a Swift (or shell/Xcode config) example for every concept or API the page names, each followed by a link to
  its official Apple page;
- the 📊 figures listed in #172;
- a closing `== References`;
- the language itself is never re-explained; the Swift and Objective-C reference pages are linked instead.

Target depth is about 350–550 lines per page, in line with the React Native pages (about 470).

## Current code state

- **Repository:** Antora playbook plus root component `irurueta`. There is no app source. Pages live under
  `modules/ROOT/pages`, and the nav is `modules/ROOT/nav.adoc`.
- **Apple section:** nothing exists yet. There is no `modules/ROOT/pages/apps/apple/`, no
  `modules/ROOT/partials/apple-disclaimer.adoc` and no Apple nav entry.
- **Apps wiring:**
  - `modules/ROOT/nav.adoc` has the Apps block at lines 801–837: `** xref:apps/index.adoc[Apps]`, then the
    Android block (embedding `partial$nav-kotlin.adoc`), then `*** xref:apps/react-native/index.adoc[React Native]`
    with 30 `****` children ending in `cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - `modules/ROOT/pages/apps/index.adoc`: `:description:`, `:keywords:` (line 3), and `== Sections` with Android
    and React Native bullets.
  - `modules/ROOT/pages/apps/android/index.adoc`: has one "cross-platform alternative" paragraph pointing to
    React Native.
  - `modules/ROOT/pages/index.adoc`: line 3 `:keywords:` has no SwiftUI, UIKit, AppKit, iPadOS, macOS,
    watchOS, visionOS, Xcode, SwiftData, WidgetKit, App Intents or Foundation Models.
- **Templates to mirror:**
  - `modules/ROOT/partials/react-native-disclaimer.adoc` (AI notice plus bibliography xref only);
  - `modules/ROOT/pages/apps/react-native/index.adoc` (history table, "New here? Read in this order", running
    app, "What's covered", "Related sections", `[[_bibliography]] == Bibliography`);
  - `apps/react-native/getting-started.adoc`, for the concept-page shape: header → disclaimer include → `==`
    sections with `[source,…]` blocks → `image::react-native-*.svg[…,width=760,role=text-center]` / `[mermaid]` →
    `== References`.
- **Existing pages to link, never duplicate** (all verified to exist):
  - `programming-languages/swift/`:
    - `async-await-and-tasks.adoc`, `actors-isolation-and-sendable.adoc`, `dispatch-and-legacy-concurrency.adoc`;
    - `properties.adoc` (§ *The Observation Module's @Observable*), `macros.adoc`, `result-builders.adoc`;
    - `attributes-and-compiler-control.adoc`, `swift-package-manager.adoc`, `build-and-tooling.adoc`;
    - `codable-and-serialization.adoc`, `interoperability-with-c-objective-c-and-cpp.adoc`, `testing.adoc`,
      `index.adoc`.
  - `programming-languages/objective-c/`: `swift-interoperability.adoc`, `build-and-tooling.adoc`, `index.adoc`.
  - `backend/architecture/architectural-patterns/index.adoc`.
  - `web/accessibility.adoc`.
- **Cross-link targets for #170's checklist:**
  - `programming-languages/swift/index.adoc` lines 18–20: the "Apple-only frameworks … out of scope" sentence.
  - `programming-languages/objective-c/index.adoc`.
  - `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` line 458: the
    `xref:programming-languages/swift/index.adoc[Swift / iOS]` row of the `=== Mobile` table.
  - `apps/react-native/`:
    - `index.adoc`, § *Related sections*;
    - `building-and-publishing.adoc`, § `== iOS Release Builds`;
    - `native-modules-and-components.adoc`, § iOS implementation;
    - `brownfield-integration.adoc`, § adding React Native to an existing iOS app.
  - `backend/oauth/native-and-mobile-apps.adoc`: the `ASWebAuthenticationSession`, universal links and Keychain
    passages.
- **Tooling:**
  - `npm run validate:mermaid` runs `scripts/validate-mermaid.mjs`, and needs
    `npm i --no-save mermaid@11 jsdom` first.
  - `npx antora antora-playbook.yml` builds into `build/site`, which is gitignored.
  - Test agent available: `.claude/agents/iru-gate-runner.md`.
- **No Swift toolchain** in the container, so examples are not compiled (decision 3).

## The FieldNotes running app (canonical reference for every example)

Every Swift example in pages 1–20, and in #173/#174 later, is a slice of this one app. Keep these names
exactly, so parts 2 and 3 extend the same codebase. Page 1 introduces it; page 3 shows its package layout; page 5
shows its architecture.

- **Xcode project:** `FieldNotes.xcodeproj`.
  - **Targets:**
    - `FieldNotes`: a multiplatform app for iOS, iPadOS, macOS and visionOS;
    - `FieldNotesWatch`: the watchOS app;
    - `FieldNotesWidgets`: the widget extension, added in #173;
    - `FieldNotesTests`: Swift Testing, added in #174.
  - **Deployment minimum:** iOS/iPadOS/macOS/watchOS/visionOS **26**. 27-only APIs are guarded with
    `if #available(iOS 27, macOS 27, watchOS 27, visionOS 27, *)` and labelled "new in 27" in prose.
  - **Bundle ID prefix:** `com.example.fieldnotes`. **App Group:** `group.com.example.fieldnotes`.
- **Local packages** (`Packages/`):
  - `FieldNotesKit`, with modules `FieldNotesModel` (types) and `FieldNotesServices` (services);
  - `FieldNotesUI`, with shared views and styles.
- **Model** (`FieldNotesModel`; persisted with SwiftData in #173, so declare them as plain types here and
  mention `@Model` only as a forward link to page 21):
  ```swift
  struct Note: Identifiable, Hashable { var id: UUID; var title: String; var body: String
      var createdAt: Date; var notebookID: Notebook.ID?; var tags: [String]; var isPinned: Bool }
  struct Notebook: Identifiable, Hashable { var id: UUID; var name: String; var symbolName: String }
  ```
- **Observable store** (`FieldNotesServices`):
  `@Observable @MainActor final class NoteStore { var notes: [Note]; var notebooks: [Notebook];
  func add(_:), delete(_:), togglePin(_:) }`. It is injected once from the `App` with
  `.environment(store)` and read with `@Environment(NoteStore.self)`.
- **Service protocols** (for testable injection on page 5):
  - `protocol NoteSyncing: Sendable { func sync() async throws }`;
  - `protocol SummaryGenerating { func summary(for: Note) async throws -> String }`, implemented with Foundation
    Models in #173.
- **App entry:**
  - `@main struct FieldNotesApp: App` with `WindowGroup { ContentView() }`;
  - `#if os(macOS)` adds `Settings { SettingsView() }` and `MenuBarExtra`;
  - `#if os(visionOS)` adds `ImmersiveSpace(id: "map")`.
- **Main views:**
  - `ContentView` is a `NavigationSplitView` with `NotebookList` (sidebar), `NoteList` (content) and
    `NoteDetail`/`NoteEditor` (detail);
  - `NoteRow`;
  - `TagChip` (custom `ViewModifier` example);
  - `CaptureButton` (Liquid Glass example).

## Implementation steps

### Group 1: #170 scaffolding (landing page, disclaimer, nav, apps wiring)

Parallelizable: yes. Each task edits a different file, and none needs another's finished result.

- [x] Task 1. Create the disclaimer partial `modules/ROOT/partials/apple-disclaimer.adoc`
  - [x] Task 1.1. Copy the text verbatim from #170, following `react-native-disclaimer.adoc`: an `[IMPORTANT]`
        block with the AI-assistance sentence and
        `xref:apps/apple/index.adoc#_bibliography[the section bibliography]`, and nothing else.
- [x] Task 2. Create the landing page `modules/ROOT/pages/apps/apple/index.adoc`
  - [x] Task 2.1. Header:
        - `= Apple Platforms`;
        - `:description:`;
        - `:keywords:` with the terms #170 lists: the version baseline, SwiftUI, UIKit, AppKit, SwiftData,
          Observation, Liquid Glass, WidgetKit, App Intents, Foundation Models, visionOS, watchOS, iPadOS, macOS,
          Xcode 27, Swift 6.4, TestFlight, App Store, notarization;
        - `include::partial$apple-disclaimer.adoc[]`;
        - an intro paragraph stating the baseline in prose: 27 releases, Xcode 27, Swift 6.4, deployment
          minimum 26.
  - [x] Task 2.2. `== How Apple app development got here`: a `[cols="1,4",options="header"]` milestones table:
        - Objective-C/Cocoa and UIKit (2008);
        - Swift (2014);
        - SwiftUI (2019);
        - Swift concurrency (2021);
        - Observation and SwiftData, visionOS announced (2023);
        - year-based versions 26 with Liquid Glass and Foundation Models (2025);
        - the 27 releases: `@State` macro, `ContentBuilder`, mandatory UIKit scene life cycle, Swift 6.4 (2026).
  - [x] Task 2.3. `== New here? Read in this order`: an xref chain through pages 1 → 4 → 9 → 10 → 11 → 13 → 5.
  - [x] Task 2.4. `== The FieldNotes app`: one or two paragraphs introducing the running app (the canonical
        reference above, in reader-facing prose).
  - [x] Task 2.5. `== What's covered`:
        - `===` groups for all **48** pages plus the cheat sheet, in #170's order:
          - Foundations & tooling;
          - SwiftUI, UI & design;
          - Data & networking;
          - Background work & system integration;
          - Intelligence & devices;
          - Security & commerce;
          - Platform specifics;
          - Quality;
          - Distribution;
          - Reference.
        - Each entry is `* xref:apps/apple/<slug>.adoc[<Title>] -- <one-line summary>`.
        - Titles come from #172, #173 and #174. Pages 21–48 and the cheat sheet are forward links (decision 2).
  - [x] Task 2.6. `== Related sections`: prose linking every "What already exists" row of #170:
        - the Swift and Objective-C references;
        - Android;
        - React Native;
        - `backend/oauth/native-and-mobile-apps.adoc`;
        - `database/couchbase/sdks-and-mobile.adoc`;
        - `web/accessibility.adoc`;
        - `web/e2e-testing-real-browsers.adoc`;
        - the architectural-patterns section.
  - [x] Task 2.7. `[[_bibliography]]` then `== Bibliography`:
        - Seed it with the sources used by pages 1–20, grouped as #175 specifies:
          - `=== Apple Developer Documentation`: SwiftUI, UIKit, AppKit, Observation, Xcode, Swift/concurrency,
            PackageDescription, Accessibility, localization;
          - `=== Human Interface Guidelines`: root and the six "Designing for …" pages;
          - `=== Apple tutorials, sample code and release notes`: the Develop in Swift, SwiftUI, App Dev Training
            and SwiftUI Concepts tutorials; the Landmarks, Food Truck and Backyard Birds samples; the Xcode 27
            release notes; `updates/swiftui`, `updates/uikit`, `updates/xcode`;
          - `=== WWDC sessions`: every session linked from pages 1–20, grouped by year;
          - `=== Swift language references`: swift.org (6.4 release post, API Design Guidelines, C++ interop).
        - End with one plain sentence: the book sources and the remaining groups are completed in #175. This is a
          plain paragraph, not an admonition.
- [x] Task 3. Add the nav block to `modules/ROOT/nav.adoc` — done: nav-swift embedded (verified: Apple item gets Swift Reference + 48 pages + cheat sheet as children)
  - [x] Task 3.1. After the React Native block (line 837), insert `*** xref:apps/apple/index.adoc[Apple Platforms
        (iOS, iPadOS, macOS, watchOS, visionOS)]` and 49 `****` entries:
        - pages 1–48 in #170's order, titled as in #172, #173 and #174;
        - `apps/apple/cheat-sheet.adoc[Cheat Sheets (PDF)]`.
  - [ ] Task 3.2. Embed the Swift reference, the way Android embeds `nav-kotlin`: a `+` / `--` open block with
        `include::partial$nav-swift.adoc[]`, placed right after the Apple `***` line and before its `****`
        children, as #170 specifies.
        - `nav-swift.adoc` starts at `*` and would nest wrongly here. If it can't be embedded cleanly, don't
          embed it, and rely on page 1 and the landing page's *Related sections* to link the Swift and
          Objective-C references (#170's stated fallback).
        - Record which option was taken in the checkbox note.
- [x] Task 4. Wire the section into `apps/index.adoc`, `apps/android/index.adoc` and `pages/index.adoc`
  - [x] Task 4.1. `modules/ROOT/pages/apps/index.adoc`:
        - add Apple terms to `:description:` and `:keywords:` (Apple Platforms, iOS, iPadOS, macOS, watchOS,
          visionOS, SwiftUI, Xcode 27, Swift 6.4);
        - update the intro sentence to mention native Apple development;
        - add a third `== Sections` bullet:
          `* xref:apps/apple/index.adoc[Apple Platforms (iOS, iPadOS, macOS, watchOS, visionOS)] -- …` with a
          one-sentence summary.
  - [x] Task 4.2. `modules/ROOT/pages/apps/android/index.adoc`: add one sentence pointing to
        `xref:apps/apple/index.adoc[Apple Platforms]` as the native counterpart on Apple devices, next to the
        existing React Native sentence.
  - [x] Task 4.3. `modules/ROOT/pages/index.adoc` line 3: append SwiftUI, UIKit, AppKit, iPadOS, macOS, watchOS,
        visionOS, Xcode, SwiftData, WidgetKit, App Intents, Foundation Models and Apple Platforms to `:keywords:`.
        Do not duplicate the existing `iOS`.

### Group 2: Foundations & tooling pages (1–8)

Parallelizable: yes. Each page is its own new file with its own `apple-*.svg` names, and every page draws
FieldNotes names from the canonical reference above rather than from another page. These pages come before
Group 3 because the SwiftUI pages cross-link section anchors on pages 4, 5 and 6.

Every page in Groups 2 and 3 must satisfy the checklist below. The scope, sub-concepts, figures and links for
each page are specified in #172 under the same page number and must all be covered.

Per-page checklist:
- header `= Title`, `:description:`, `:keywords:`;
- `include::partial$apple-disclaimer.adoc[]`;
- a baseline sentence in the intro;
- no other admonition anywhere;
- one example per concept or API, each followed by
  `https://developer.apple.com/documentation/…[Apple Developer Documentation -- <Title>]`;
- 27-only APIs marked with their availability;
- the 📊 figures (SVG at `modules/ROOT/images/apple-<topic>.svg`, embedded as
  `image::apple-<topic>.svg[<alt>,width=760,role=text-center]` under `=== Figure: …`, or an inline `[mermaid]`
  block);
- `xref:`s to the Swift/Objective-C reference instead of re-explaining the language;
- `== References` last.

- [x] Task 5. `apps/apple/getting-started.adoc`: *Getting Started with Apple Platforms*
  - [x] Task 5.1. Sections:
        - *The five platforms (and tvOS)*;
        - *Year-based versions and the 27 baseline*;
        - *One UI framework everywhere, three by platform*: SwiftUI vs UIKit vs AppKit, WatchKit remnants,
          RealityKit;
        - *Liquid Glass in one paragraph*;
        - *Accounts: free Apple Account vs Apple Developer Program*;
        - *Installing Xcode 27*: needs macOS Tahoe 26.6+;
        - *Creating FieldNotes*: the new-project steps and the first `FieldNotesApp` / `ContentView`;
        - *Running on a simulator and a device*: Developer Mode;
        - *A learning path through Apple's tutorials*;
        - *References*.
  - [x] Task 5.2. Figures:
        - Mermaid `graph LR`: each platform → its UI framework and key system frameworks;
        - `apple-toolchain.svg`: Xcode → Simulator/Device Hub → Instruments → App Store Connect.
- [x] Task 6. `apps/apple/xcode-projects-and-previews.adoc`: *Xcode Projects, Targets, Schemes and Previews*
  - [x] Task 6.1. Content:
        - workspace, project, target and product;
        - scheme actions;
        - Debug and Release configurations;
        - an `.xcconfig` example for FieldNotes;
        - the build settings table (`SWIFT_VERSION`, `SWIFT_STRICT_CONCURRENCY`, `SWIFT_DEFAULT_ACTOR_ISOLATION`,
          `SWIFT_APPROACHABLE_CONCURRENCY`);
        - Info.plist vs build settings;
        - the Signing & Capabilities tab, with a forward xref to page 45;
        - `#Preview`, `PreviewModifier` and preview traits, with FieldNotes sample data;
        - `#Playground`;
        - Device Hub;
        - an Xcode 27 coding-intelligence sidebar as a plain subsection.
  - [x] Task 6.2. Figures:
        - Mermaid `classDiagram`: Workspace → Project → Target; Scheme → Actions → Configurations;
        - Mermaid build pipeline: compile → link → copy resources → sign.
- [x] Task 7. `apps/apple/swift-packages-and-modularization.adoc`: *Swift Packages and Modularizing an App*
  - [x] Task 7.1. Content:
        - adding a remote dependency;
        - the full `Packages/FieldNotesKit/Package.swift`: `FieldNotesModel` and `FieldNotesServices` targets, a
          test target, platforms `.iOS(.v26)`, `.macOS(.v26)`, `.watchOS(.v26)`, `.visionOS(.v26)`, and
          `swiftLanguageModes: [.v6]`;
        - `resources:` and localization;
        - `.binaryTarget`;
        - explicit modules and mergeable libraries;
        - Swift Build as the default engine in 6.4.
        - Link `swift/swift-package-manager.adoc` for the tool itself.
  - [x] Task 7.2. Figure: Mermaid graph of the `FieldNotes` target → `FieldNotesUI` → `FieldNotesKit`
        (Model/Services) → remote packages.
- [x] Task 8. `apps/apple/app-structure-and-lifecycle.adoc`: *App Structure and Life Cycle (SwiftUI, UIKit, AppKit)*
  - [x] Task 8.1. Content:
        - `FieldNotesApp`: `@main`, the scene list per platform, `ScenePhase` handling (save on `.background`);
        - `UIApplicationDelegateAdaptor`, `NSApplicationDelegateAdaptor`, `WKApplicationDelegateAdaptor`;
        - UIKit: `UIApplicationDelegate` plus `UIWindowSceneDelegate` with the `UIApplicationSceneManifest`
          Info.plist snippet, stating that the scene life cycle is **mandatory with the 27 SDK**;
        - AppKit: `NSApplicationDelegate`;
        - migrating to the SwiftUI life cycle;
        - `@SceneStorage` restoration, with a forward xref to page 23.
  - [x] Task 8.2. Figures:
        - Mermaid `stateDiagram-v2` of scene phases;
        - Mermaid `sequenceDiagram` of UIKit launch.
- [ ] Task 9. `apps/apple/app-architecture.adoc`: *App Architecture the Apple Way*
  - [ ] Task 9.1. Content:
        - the model-driven SwiftUI app with `NoteStore` (`@Observable`), view-local `@State` and `@Bindable`;
        - `.environment(store)` / `@Environment(NoteStore.self)`;
        - an `@Entry` custom environment value for `SummaryGenerating`;
        - a fair MVVM comparison: an `@Observable` view model is just another observable type;
        - protocol-typed services with a test double, linking forward to page 40;
        - value vs reference types;
        - modularization, linking page 7;
        - the Swift API Design Guidelines with before/after naming examples;
        - Apple's samples as references.
        - Link `backend/architecture/architectural-patterns/index.adoc`.
  - [ ] Task 9.2. Figures:
        - Mermaid `classDiagram`: App → NoteStore → environment → views → services;
        - Mermaid side-by-side: MV with Observation vs MVVM.
- [ ] Task 10. `apps/apple/concurrency-in-apps.adoc`: *Swift Concurrency in Apps*
  - [ ] Task 10.1. Content:
        - the approachable-concurrency build settings and MainActor default isolation, citing the build-settings
          reference;
        - leaving the main actor with `@concurrent` / `nonisolated`;
        - `.task(id:)` loading notes, with automatic cancellation;
        - `Task.immediate`;
        - named tasks;
        - `withCheckedContinuation`;
        - `AsyncStream` wrapping a delegate;
        - the Swift 6.4 additions as a labelled subsection;
        - migrating to Swift 6 mode;
        - Combine's status.
        - Link the Swift concurrency pages for language semantics.
  - [ ] Task 10.2. Figures:
        - Mermaid `sequenceDiagram`: MainActor → `@concurrent` → resume;
        - `apple-isolation-domains.svg`;
        - Mermaid task tree showing cancellation.
- [x] Task 11. `apps/apple/multiplatform-projects.adoc`: *One Codebase for iOS, iPadOS, macOS, watchOS and visionOS*
  - [x] Task 11.1. Content:
        - the FieldNotes multiplatform target and Supported Destinations;
        - the separate `FieldNotesWatch` target;
        - per-SDK build settings;
        - `#if os(...)`, `canImport`, `targetEnvironment(macCatalyst)` and `targetEnvironment(simulator)`;
        - `@available`, `#available`, `#unavailable`;
        - platform-specific scenes;
        - native macOS vs Mac Catalyst vs "Designed for iPad";
        - iPad/iPhone apps on visionOS and Apple silicon Macs;
        - an `ArrangementView` sidebar (new in iOS 27.1).
        - Forward xrefs to pages 36–39.
  - [x] Task 11.2. Figures:
        - Mermaid: shared packages → multiplatform target plus watchOS target;
        - an availability-pattern table.
- [x] Task 12. `apps/apple/language-interoperability.adoc`: *Mixing Swift, Objective-C and C++ in an App*
  - [x] Task 12.1. Content:
        - bridging header vs module map;
        - the generated `FieldNotes-Swift.h`;
        - `@objc` / `@objcMembers`;
        - `NS_SWIFT_NAME`, nullability and `NS_REFINED_FOR_SWIFT`, with an Objective-C header snippet and the
          resulting Swift interface;
        - completion handlers imported as `async`;
        - enabling C++ interop in Xcode and with `.interoperabilityMode(.Cxx)`;
        - step-by-step migration.
        - Link the Swift interop and Objective-C `swift-interoperability.adoc` pages for language rules.
  - [x] Task 12.2. Figure: Mermaid Swift ↔ Objective-C ↔ C++ bridging graph.

### Group 3: SwiftUI, UI & design pages (9–20)

Parallelizable: yes. Each page is an independent new file. Pages link to one another only by `xref:` to a file
name, not to content, so they can be written in any order. The per-page checklist from Group 2 applies.

- [ ] Task 13. `apps/apple/swiftui-views-and-modifiers.adoc`: *SwiftUI Views and Modifiers*
  - [ ] Task 13.1. Content:
        - `View` and `body` with `NoteRow`;
        - composition;
        - modifier order (`padding` before or after `background`);
        - a custom `TagChip` `ViewModifier`;
        - `ViewBuilder` / `ContentBuilder` (Xcode 27);
        - conditional content and view identity (structural vs `.id`);
        - `@Entry` environment values and the Xcode 27 warning.
        - Link `swift/result-builders.adoc`.
  - [ ] Task 13.2. Figure: `apple-modifier-chain.svg`.
- [ ] Task 14. `apps/apple/swiftui-layout.adoc`: *SwiftUI Layout*
  - [ ] Task 14.1. Content:
        - the propose/choose/place protocol;
        - stacks and lazy stacks;
        - `Grid` and lazy grids (a notebook grid);
        - alignment guides;
        - `frame`, `padding` and `Spacer`;
        - `containerRelativeFrame` / `onGeometryChange` vs `GeometryReader`;
        - `ViewThatFits`;
        - a custom radial `Layout` for tags, and `AnyLayout`;
        - size classes;
        - `scrollPosition` / `onScrollGeometryChange`;
        - `ArrangementView` / `ReservedRegion` (new in iOS 27.1).
  - [ ] Task 14.2. Figures:
        - Mermaid `sequenceDiagram` of layout negotiation;
        - `apple-layout-comparison.svg`.
- [ ] Task 15. `apps/apple/swiftui-state-and-data-flow.adoc`: *State and Data Flow with Observation*
  - [ ] Task 15.1. Content:
        - source of truth;
        - `@State` as a macro in Xcode 27, and its initializer pitfalls;
        - `@Binding`;
        - `@Observable` `NoteStore`, `@ObservationIgnored`, `@Bindable` in `NoteEditor`;
        - `@Environment`;
        - `@AppStorage` / `@SceneStorage`, with a forward xref to page 23;
        - `onChange`;
        - `Observations` async sequence (SE-0506);
        - migrating from `ObservableObject`, `@StateObject` and `@Published`;
        - Observation tracking in UIKit and AppKit.
        - Link `swift/properties.adoc`.
  - [ ] Task 15.2. Figures:
        - Mermaid flowchart: source of truth → bindings → views;
        - a "which property wrapper?" decision table.
- [ ] Task 16. `apps/apple/swiftui-lists-tables-and-collections.adoc`: *Lists, Tables and Collections*
  - [ ] Task 16.1. Content:
        - `NoteList` with `List`, `ForEach` and `Section` (pinned vs others);
        - selection and edit mode;
        - `.swipeActions` (pin, delete), now available on any container;
        - `reorderable()` / `reorderContainer`;
        - `Table` of notes on macOS and iPadOS;
        - `ScrollView` with `LazyVGrid`;
        - `.searchable`, `.refreshable`;
        - a custom container view.
  - [ ] Task 16.2. Figure: `apple-list-anatomy.svg`.
- [ ] Task 17. `apps/apple/swiftui-navigation-and-presentation.adoc`: *Navigation and Presentation*
  - [ ] Task 17.1. Content:
        - `ContentView` as a three-column `NavigationSplitView`;
        - `NavigationStack` with `navigationDestination(for: Note.self)` and `NavigationPath`;
        - deep-link navigation, with a forward xref to page 28;
        - `TabView` with `Tab`, `.sidebarAdaptable`, `TabRole.prominent` and tab-bar minimization;
        - sheets with detents, popovers, `.inspector`;
        - `alert(error:)` and confirmation dialogs;
        - zoom transitions;
        - toolbars (`ToolbarSpacer`, `ToolbarOverflowMenu`, `visibilityPriority`);
        - search placement.
  - [ ] Task 17.2. Figures:
        - Mermaid of `NavigationPath` push and pop;
        - `apple-split-view-columns.svg`.
- [ ] Task 18. `apps/apple/swiftui-controls-forms-text-and-images.adoc`: *Controls, Forms, Text, Images and SF Symbols*
  - [ ] Task 18.1. Content:
        - `SettingsView` as a `Form`;
        - `Button` styles including `.glass`;
        - `Toggle`, `Picker`, `Slider`, `Stepper`, `DatePicker`, `Menu`, `LabeledContent`;
        - `@FocusState` in `NoteEditor`;
        - `Text` with `AttributedString` and Markdown;
        - `TextField` (`.bordered`) and `TextEditor`;
        - `Image` and `AsyncImage` caching;
        - SF Symbols rendering modes, variable values and `symbolEffect`;
        - Dynamic Type.
  - [ ] Task 18.2. Figure: a table of how the same `Form` renders on iOS, macOS and watchOS.
- [ ] Task 19. `apps/apple/swiftui-drawing-animation-and-gestures.adoc`: *Drawing, Animation and Gestures*
  - [ ] Task 19.1. Content:
        - `Shape`/`Path` (a note-card corner shape), `Canvas` and `TimelineView`;
        - a Metal `Shader` effect;
        - implicit vs explicit animation, springs, transitions and `matchedGeometryEffect`;
        - `PhaseAnimator` and `KeyframeAnimator`;
        - sharing animations with UIKit and AppKit;
        - tap, long-press, drag, magnify and rotate gestures;
        - `@GestureState`;
        - `simultaneously`, `sequenced`, `exclusively`;
        - gesture input sources (2026).
  - [ ] Task 19.2. Figures:
        - `apple-animation-curves.svg`;
        - Mermaid `stateDiagram-v2` of gesture states.
- [ ] Task 20. `apps/apple/liquid-glass-and-the-design-system.adoc`: *Liquid Glass, Materials and Icons*
  - [ ] Task 20.1. Content:
        - the functional layer vs the content layer;
        - automatic adoption, and removing custom bar backgrounds;
        - `glassEffect(_:in:)`, `GlassEffectContainer` and `glassEffectID` with the FieldNotes `CaptureButton`;
        - `.glass` button styles;
        - scroll edge effects and `backgroundExtensionEffect`;
        - `UIGlassEffect` and `NSGlassEffectView`;
        - how Reduce Transparency and Reduce Motion change rendering;
        - Icon Composer layered icons with Xcode 27 refraction, and a forward xref to page 45.
  - [ ] Task 20.2. Figure: `apple-liquid-glass-layers.svg`.
- [ ] Task 21. `apps/apple/uikit-and-appkit-interop.adoc`: *UIKit and AppKit Essentials, and Mixing Them with SwiftUI*
  - [ ] Task 21.1. Content:
        - UIKit essentials: view controllers, `UINavigationController`, diffable collection views, traits;
        - AppKit essentials: `NSWindow`/`NSWindowController`, `NSMenu`;
        - `UIHostingController` and `UIHostingConfiguration` cells;
        - `NSHostingController`, `NSHostingView` and `NSHostingMenu`;
        - a `UIViewRepresentable` wrapping a UIKit view, with a `Coordinator`, plus `NSViewRepresentable`;
        - `UITraitBridgedEnvironmentKey`;
        - unified animations;
        - `UIArrangementViewController`.
  - [ ] Task 21.2. Figure: Mermaid of the representable life cycle.
- [ ] Task 22. `apps/apple/human-interface-guidelines.adoc`: *Human Interface Guidelines in Practice*
  - [ ] Task 22.1. Content:
        - the HIG structure;
        - the design principles;
        - key foundations (layout, color, typography, Dark Mode, materials, SF Symbols, motion, writing,
          privacy), each tied to a FieldNotes decision;
        - one subsection per platform (iOS, iPadOS, macOS, watchOS, visionOS, iPhone Duo), each forward-linking
          its part-3 page (36–39).
        - Summarize and link only; never copy the HIG.
  - [ ] Task 22.2. Figure: Mermaid `mindmap` of the HIG.
- [ ] Task 23. `apps/apple/accessibility.adoc`: *Accessibility*
  - [ ] Task 23.1. Content:
        - VoiceOver label, value, hint and traits on `NoteRow`;
        - `accessibilityElement(children: .combine)`;
        - `accessibilityRepresentation`;
        - custom and adjustable actions;
        - `accessibilityIdentifier`, used only by UI tests (forward xref to page 41);
        - Dynamic Type with `@ScaledMetric` and a layout that switches at accessibility sizes;
        - Reduce Motion, Reduce Transparency, Increase Contrast and Differentiate Without Color;
        - an accessible custom control;
        - testing: Accessibility Inspector, `performAccessibilityAudit()`, Device Hub, VoiceOver;
        - Accessibility Nutrition Labels, with a forward xref to page 46;
        - Assistive Access.
        - Link `web/accessibility.adoc`.
  - [ ] Task 23.2. Figures:
        - Mermaid: view tree → accessibility tree;
        - a table mapping each nutrition label to its APIs and a test.
- [ ] Task 24. `apps/apple/localization.adoc`: *Localization with String Catalogs*
  - [ ] Task 24.1. Content:
        - `Localizable.xcstrings`, including a JSON excerpt;
        - `LocalizedStringKey` vs `LocalizedStringResource` vs `String(localized:comment:)`;
        - plural and device variations;
        - generated symbols;
        - "don't translate" and translator comments;
        - grammar agreement (`^[…](inflect: true)`);
        - `FormatStyle` for note dates;
        - RTL: leading/trailing, mirrored symbols and pseudolanguages;
        - XLIFF/`.xcloc` export and import;
        - package resources;
        - testing with scheme/test-plan languages and preview variants;
        - Xcode 27 localization with agents.
  - [ ] Task 24.2. Figures:
        - Mermaid localization pipeline;
        - `apple-ltr-rtl.svg`.

### Group 4: #170 cross-links in existing pages

Parallelizable: yes. Each task edits a different existing file. This group comes after Groups 1–3 so that each
link names a page that now exists, or a forward target (pages 23–48) that #173 and #174 will create (decision 2).

- [x] Task 25. `programming-languages/swift/index.adoc` lines 18–20: turn "Apple-only frameworks -- SwiftUI, UIKit,
      Combine, CoreML, ARKit, Swift Charts -- are out of scope" into a sentence ending with "see
      xref:apps/apple/index.adoc[Apple Platforms] for them".
- [x] Task 26. `programming-languages/objective-c/index.adoc`: add a one-sentence pointer to
      `xref:apps/apple/uikit-and-appkit-interop.adoc[…]` and `xref:apps/apple/language-interoperability.adoc[…]`
      for UIKit/AppKit usage and mixed-language apps.
- [x] Task 27. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` line 458: change the row to
      `xref:apps/apple/index.adoc[Swift / Apple platforms]` and widen its "When" text to Apple platforms.
- [x] Task 28. React Native pages
  - [x] Task 28.1. `apps/react-native/index.adoc` § *Related sections*: add
        `xref:apps/apple/index.adoc[Apple Platforms]` as the native iOS/macOS/watchOS/visionOS counterpart.
  - [x] Task 28.2. `apps/react-native/building-and-publishing.adoc` § `== iOS Release Builds`: add one sentence
        pointing to `xref:apps/apple/signing-capabilities-and-configuration.adoc[…]` and
        `xref:apps/apple/app-store-connect-testflight-and-review.adoc[…]` (forward links to pages 45 and 46).
  - [x] Task 28.3. `apps/react-native/native-modules-and-components.adoc`, iOS implementation section: link
        `xref:apps/apple/language-interoperability.adoc[…]`.
  - [x] Task 28.4. `apps/react-native/brownfield-integration.adoc`, "Adding React Native to an Existing iOS App":
        link `xref:apps/apple/uikit-and-appkit-interop.adoc[…]` and
        `xref:apps/apple/app-structure-and-lifecycle.adoc[…]`.
- [x] Task 29. `backend/oauth/native-and-mobile-apps.adoc`: next to the `ASWebAuthenticationSession`, universal-link
      and Keychain passages, add links to `xref:apps/apple/security-and-privacy.adoc[…]` and
      `xref:apps/apple/app-intents-and-system-integration.adoc[…]` (forward links to pages 33 and 28).

### Group 5: Validation and commit

Parallelizable: no. Task 31 depends on Task 30's results, and Task 32 commits only after both.

- [ ] Task 30. Static checks, delegated to the `iru-gate-runner` agent (or a generic sub-agent) so output stays out
      of the main context
  - [ ] Task 30.1. Admonitions: `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]|^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):' modules/ROOT/pages/apps/apple`
        must return nothing. The disclaimer's only `[IMPORTANT]` lives in the partial, not the pages.
  - [ ] Task 30.2. Structure: every `apps/apple/*.adoc` from this plan has `:description:`, `:keywords:`,
        `include::partial$apple-disclaimer.adoc[]` and `== References`.
  - [ ] Task 30.3. Mermaid: `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` must pass (exit 0).
  - [ ] Task 30.4. SVGs: each new `modules/ROOT/images/apple-*.svg` is well-formed XML
        (`python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse(sys.argv[1])" <file>`).
  - [ ] Task 30.5. Antora build: `npm install` (if needed) then `npx antora antora-playbook.yml`.
        - Collect every reported `xref` error.
        - Every error must point to a **forward target**: an `apps/apple/` page from 21–48, `cheat-sheet.adoc`,
          or a `_bibliography` anchor that #175 extends.
        - Any error pointing anywhere else (a typo, a wrong Swift/Objective-C page name, a broken anchor inside
          pages 1–20) must be fixed.
        - Record the remaining forward-link errors in the checkbox note (decision 2).
- [ ] Task 31. Fix every non-forward error found in Task 30, then re-run the failing check until only forward-link
      `xref` errors remain.
- [ ] Task 32. Commit on `feature/172`
  - [ ] Task 32.1. Stage the new pages, partial and images, plus the modified `nav.adoc`, `apps/index.adoc`,
        `apps/android/index.adoc`, `pages/index.adoc` and the Group 4 files.
        - Review `git status` and the diff.
        - Do not stage `build/` or `node_modules/`.
  - [ ] Task 32.2. Commit with the message
        `Apple Platforms part 1: foundations, tooling, SwiftUI and design pages + section scaffolding (#172, #170)`,
        ending with the session's attribution trailer lines.
