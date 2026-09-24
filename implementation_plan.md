# Implementation Plan: Apple Platforms, part 3: platform specifics, quality and distribution

## Task summary

Source: GitHub issue #174
Base branch: feature/170

Issue [#174](https://github.com/albertoirurueta/docs/issues/174) asks for **pages 36–48** of the *Apple Platforms
(iOS, iPadOS, macOS, watchOS, visionOS)* section, in `modules/ROOT/pages/apps/apple/`:

- 36–39: platform specifics (iPadOS, macOS, watchOS, visionOS);
- 40–44: quality (Swift Testing, UI tests and test plans, debugging, logging/MetricKit/crash reports, performance);
- 45–48: distribution (signing and configuration, App Store Connect/TestFlight/App Review, Developer ID and
  notarization, CI/CD).

Every page follows the section rules in #170 and the rules parts 1–2 settled:

- the only admonition is the `apple-disclaimer` include;
- `:description:` and `:keywords:`;
- a Swift, shell or Xcode-configuration example for every concept or API the page names, each followed by a link to
  the official Apple page;
- the 📊 figures listed in #174;
- a `=== Platform availability` table on every page, in plain AsciiDoc;
- `== References` last.

Work happens on `feature/174` (created from `origin/feature/170` after #179 merged); its PR targets `feature/170`.

**Approach chosen (best practices, as for #173; no open question needed a user decision):**

1. **Extend FieldNotes, never fork it.** The four platform pages add scenes, targets and helpers to the same app
   (iPad windows and commands, the Mac menu bar extra and utility window, the watch app with WatchConnectivity and a
   complication, the visionOS volume). The quality and distribution pages test, debug, profile, sign and ship that
   same app. A canonical names sheet (below) keeps parallel writers consistent.
2. **Dated rules carry their date and source.** Every SDK requirement, guideline update, deadline and Xcode Cloud
   allowance states the date it applies from and links `news/upcoming-requirements`, the guideline page or the
   official article, per the acceptance criteria.
3. **Facts the issue flags as secondary-only** (Instruments 27 actor integration, Memory Graph SwiftUI state graphs,
   Xcode Cloud without Program membership, Xcode 27/Swift 6.4 release dates) are verified against Apple's
   documentation JSON at writing time. Where sources conflict, the page states both with their sources; every
   unresolved item goes to the #170 comment.
4. **Forward links stay real `xref:`s.** Only `cheat-sheet.adoc` (#175) remains missing after this part; #170's
   final review re-checks it.
5. **Swift examples are not compiled here** (no Xcode in the container). Each is checked against Apple's
   documentation JSON; entitlement, paid-account and device needs are stated in plain sentences.
6. **Additions under "add what's needed":** a canonical names sheet for part 3; the rendering rules learned in #179;
   normalizing the link text of the ~100 existing forward links to the real page titles; reciprocal links from the
   Swift/Objective-C testing and React Native CI pages; the landing page's FieldNotes paragraph and bibliography
   extended for part 3; a #170 comment with the unverified facts.

## Current code state

- **On `feature/170` (parts 1–2 merged):** pages 1–35, `index.adoc` (landing page with *What's covered*, *The
  FieldNotes app* and `== Bibliography` covering pages 1–35), `modules/ROOT/partials/apple-disclaimer.adoc`,
  16 `modules/ROOT/images/apple-*.svg`, `.archive/implementation_plan_172.md` and `_173.md`.
- **`nav.adoc` already lists pages 36–48** (lines ~878–890) with their titles from #174, plus `cheat-sheet.adoc`.
- **Forward links into pages 36–48:** about 100 `xref:`s across pages 1–35 already target these slugs (file-level,
  no anchors). Several use outdated link text, e.g. "Signing, Capabilities and Configuration", "Testing with Swift
  Testing", "App Store Connect, TestFlight and Review", "macOS Distribution Outside the App Store", "visionOS:
  Windows, Volumes, Immersive Spaces and Spatial Design". The Antora build on `feature/170` has 0 warnings and 104
  `xref` errors, all to pages 36–48 and the cheat sheet.
- **FieldNotes as it stands** (parts 1–2):
  - Packages `FieldNotesModel` (`Note`, `Notebook`, `NoteLocation`, `PhotoAttachment`, `NoteSortOrder`,
    `FieldTripAttributes`), `FieldNotesServices` (`NoteStore` with `persistence:`/`load()`/`add(_ notebook:)`/
    `waitForPendingWrites()`, `NotePersisting`, `@ModelActor SwiftDataNotePersistence`, `ModelContainer.fieldNotes(inMemory:)`,
    `NotesAPIClient`, `CloudNoteSyncer`), `FieldNotesUI`.
  - App target `FieldNotes` (iPhone, iPad, Mac, Vision): `FieldNotesApp` with `WindowGroup`, `Settings`
    (`SettingsView`), `MenuBarExtra` (`QuickCaptureMenu`), `ImmersiveSpace(id: "map") { NotesMapSpace() }`;
    `AppServices.shared` (store + persistence owner, `pendingNoteID`); `ContentView` (`NavigationSplitView`,
    `open(_:)`, `DeepLink`); `IntentRouter`; `NoteList`, `NoteDetail`, `NoteEditor`, `NoteComposer`.
  - `FieldNotesWatch` (`FieldNotesWatchApp`, `WatchNoteList`, `WKApplicationDelegateAdaptor`),
    `FieldNotesWidgets` (`FieldNotesWidgetBundle`: `PinnedNotesWidget`, `FieldTripLiveActivity`, controls),
    `FieldNotesWatchWidgets` (`FieldNotesWatchWidgetBundle`, `FieldTripRelevanceWidget`), `FieldNotesTests`
    (`PersistenceTests`, `StoreManagerTests`, …), `FieldNotesUITests` (snippets on the accessibility and App Intents
    pages).
  - Page 32's `FieldTripWorkoutSession` (HealthKit) and page 35's `RealityKitContent` package (`FieldSiteTerrain`),
    `NotePinComponent`/`NotePinSystem`.
  - Identifiers: bundle prefix `com.example.fieldnotes`, App Group `group.com.example.fieldnotes`, iCloud container
    `iCloud.com.example.fieldnotes`, logging subsystem `com.example.fieldnotes`.
- **Pages to link, not duplicate** (all confirmed to exist): `programming-languages/swift/testing.adoc`,
  `programming-languages/swift/build-and-tooling.adoc`, `programming-languages/objective-c/testing.adoc`,
  `web/e2e-testing-real-browsers.adoc`, `database/prometheus/index.adoc`,
  `apps/react-native/building-and-publishing.adoc` (its `== iOS Release Builds` already links pages 45–46;
  figure `react-native-ios-signing-pieces.svg`), `apps/react-native/ci-cd-and-over-the-air-updates.adoc`
  (Fastlane, GitHub Actions macOS runners; no link to the Apple pages yet).
- **Specs:** #174's text (per-page scope, 📊 figures, verified links, URL pitfalls, facts to verify) is in
  `/tmp/claude-0/-home-user-docs/e2258b98-0a71-58e0-8d77-2095994c46ac/scratchpad/issues/sub3.md`; the live issue
  #174 is authoritative where they differ.
- **Rendering rules from #179** (apply to every new line):
  - inline code directly followed by letters or `'s` uses unconstrained backticks: ``` ``Component``s ```;
  - prose `C++` is written `{cpp}`;
  - links whose URL or text contains `_` use `link:++URL++[+text+]`;
  - image alt text containing commas is quoted.
- **Tooling:** `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` (then
  `git checkout -- node_modules/.package-lock.json`); `npx antora antora-playbook.yml`; `detect-secrets` (the
  SwiftPM placeholder checksum in `swift-packages-and-modularization.adoc` is a confirmed false positive).
- **Precedent:** `.archive/implementation_plan_173.md` (same structure: brief, parallel page writers, wiring,
  consistency pass, validation, #170 comment).

## Canonical FieldNotes additions for part 3 (every page writer must use these exact names)

A page may add small page-local helpers with distinctive names, but never a second definition of a listed or
existing type. Part 1–2 signatures stay unchanged.

- **iPadOS (page 36):**
  - `WindowGroup(id: "note", for: Note.ID.self) { $noteID in NoteWindow(noteID: noteID) }`, opened with
    `openWindow(id: "note", value: note.id)`; `NoteWindow` is the app-target view for a single note in its own window.
  - `struct FieldNotesCommands: Commands` (shared by iPad and Mac): *New Note* ⌘N, *New Window for Note* ⌥⌘N,
    *Toggle Pin* ⌘P, *Find* ⌘F, reading the selected note through `@FocusedValue(\.selectedNote)`.
  - `extension FocusedValues { @Entry var selectedNote: Note? }`.
  - `NoteSketchView` (PencilKit `PKCanvasView` wrapper) and the Pencil handlers `onPencilDoubleTap`/`onPencilSqueeze`.
- **macOS (page 37):**
  - `UtilityWindow("Tag Inspector", id: "tag-inspector") { TagInspector() }` (macOS 15+).
  - `Settings { SettingsView() }` gains tabs (`TabView` with `GeneralSettings`, `SyncSettings`); `SettingsLink`.
  - `MenuBarExtra("FieldNotes", systemImage: "note.text") { QuickCaptureMenu() }` shown in both `.menu` and `.window`
    styles.
  - `ExportFolderBookmark` (security-scoped bookmark of the user-chosen export folder, stored in
    `UserDefaults.fieldNotesShared`).
- **watchOS (page 38):**
  - `final class WatchAppDelegate: NSObject, WKApplicationDelegate` (the existing adaptor's delegate, named here).
  - `@Observable @MainActor final class WatchConnectivityBridge: NSObject, WCSessionDelegate`, compiled into both
    `FieldNotes` (iOS) and `FieldNotesWatch`, with the keys `"quickNote"` (message), `"pinnedNoteIDs"`
    (application context) and `"noteTransfer"` (user info). Note data itself still syncs through CloudKit (page 21);
    WatchConnectivity carries quick capture and the pinned list.
  - Workouts reuse page 32's `FieldTripWorkoutSession`, adding mirroring to iPhone.
  - `struct NextFieldTripComplication: Widget` in `FieldNotesWatchWidgets`, next to the existing
    `FieldTripRelevanceWidget`.
- **visionOS (page 39):**
  - `WindowGroup(id: "field-site") { FieldSiteVolume() }.windowStyle(.volumetric).defaultSize(width:height:depth:in:)`,
    showing page 35's `FieldSiteTerrain` from `RealityKitContent` with note pins.
  - The existing `ImmersiveSpace(id: "map") { NotesMapSpace().environment(store) }` gains `.immersionStyle`.
  - `NoteOrnament` (the capture ornament on the main window).
- **Testing (pages 40–41):**
  - Test targets `FieldNotesTests` (Swift Testing) and `FieldNotesUITests` (XCUIAutomation); test plan
    `FieldNotes.xctestplan` with configurations *Default*, *German*, *Sanitizers*.
  - Tags: `extension Tag { @Tag static var persistence, sync, intents, ui }`.
  - Suites: `NoteStoreTests`, `PersistenceTests` (existing), `NoteSortOrderTests`, `FieldNotesShortcutsTests`
    (AppIntentsTesting, 27).
  - UI tests launch with the argument `--uitesting`; `AppServices` (page 25) reads it and uses
    `ModelContainer.fieldNotes(inMemory: true)`. Page 41 shows this as a labelled revision of `AppServices.init()`.
  - Accessibility identifiers `"note-list"`, `"capture-button"`, `"note-title-field"`.
- **Diagnostics (pages 42–44):**
  - Logging uses `Logger(subsystem: "com.example.fieldnotes", category:)` with the categories `persistence` (already
    used by `NoteStore`), `sync`, `intents`, `ui`; `extension Logger { static let sync = …, … }` lives on page 43.
  - `OSSignposter(subsystem: "com.example.fieldnotes", category: .pointsOfInterest)` as `FieldNotesSignposts.loading`.
  - `MetricsReporter` (MetricKit `MetricManager`, 27, with an `MXMetricManager` path for 26).
- **Distribution (pages 45–48):**
  - Team ID placeholder `ABCDE12345`; bundle IDs `com.example.fieldnotes` (+ `.watchkitapp`, `.widgets`,
    `.watchwidgets`, `.share`, `.notificationservice`).
  - `FieldNotes.entitlements` (App Groups, iCloud/CloudKit, Push, Associated Domains, Sign in with Apple).
  - `ExportOptions.plist` (method `app-store-connect`), Developer ID export for the Mac build, `FieldNotes.dmg`,
    notarytool keychain profile `fieldnotes-notary`.
  - Xcode Cloud workflows *PR Checks* and *Release to TestFlight*; `ci_scripts/ci_post_clone.sh`,
    `ci_scripts/ci_post_xcodebuild.sh`; a GitHub Actions workflow `.github/workflows/ios.yml` on a macOS runner.

## Implementation steps

### Group 1: Page-writer brief for part 3

Parallelizable: yes (one task).

- [x] Task 1. Update the page brief `.../scratchpad/apple-page-brief.md` for part 3
  - [x] Task 1.1. Point it to `sub3.md` (pages 36–48), the live issue #174, and this plan's canonical sheet.
  - [x] Task 1.2. Keep the part 2 hard rules; add the #179 rendering rules (double backticks, `{cpp}`,
    `link:++…++[+…+]`, quoted alt text) and the dated-rule requirement (date + official source for every
    requirement, deadline, allowance or guideline revision).
  - [x] Task 1.3. List the valid slugs (only `cheat-sheet` is still missing) and the report format (files and line
    counts, figures, uncovered sub-concepts, unverified API shapes and claims, new type names).

### Group 2: Pages 36–48

Parallelizable: yes. Each page is a new file with its own `apple-*.svg` names, and shared types come from the
canonical sheet. Writers run as parallel agents grouped by topic: 36–37, 38–39, 40–41, 42–44, 45–46, 47–48.

**Per-page checklist:** as in part 2 (header, disclaimer, baseline sentence, examples with official links,
platform-availability table, "needs" sentences, `== References`), every 📊 figure from #174, the URL pitfalls from
#174 (`xcuiautomation/recording-ui-automation-for-testing`, `xcode/diagnosing-memory-thread-and-crash-issues-early`),
and the rendering rules.

- [x] Task 2. `apps/apple/ipados.adoc`: *iPadOS: Windows, Multitasking, Pointer and Apple Pencil*
  - Content: multiple scenes and resizable windows (`UIApplicationSupportsMultipleScenes`, `openWindow`,
    `UISceneSizeRestrictions`, effective geometry); the iPad menu bar with `FieldNotesCommands` and keyboard
    shortcuts; `.sidebarAdaptable`; pointer (`hoverEffect`, `pointerStyle`, `UIPointerInteraction`); Apple Pencil
    (`onPencilDoubleTap`, `onPencilSqueeze`, hover, `UIPencilInteraction`, PencilKit `NoteSketchView`); `Table` and
    inspector on iPad.
  - Figures: 📊 Mermaid process → `UIWindowScene`s/sessions; 📊 `apple-ipad-window-sizes.svg` (compact vs regular vs
    resized window).
- [x] Task 3. `apps/apple/macos.adoc`: *macOS: Windows, Menus, Commands, Settings and Menu Bar Extras*
  - Content: `WindowGroup`/`Window`/`UtilityWindow`, sizing, placement, styles, restoration, `openWindow`/
    `dismissWindow`; `.commands` with `CommandMenu`/`CommandGroup`/`keyboardShortcut`/`FocusedValue`; `Settings` +
    `SettingsLink`; `MenuBarExtra` in `.menu` and `.window` styles; AppKit modernization in 27 (`NSControl` events,
    Observation tracking); App Sandbox with `ExportFolderBookmark`; Apple silicon only and Rosetta's end; choosing
    native SwiftUI vs Mac Catalyst vs Designed for iPad vs AppKit, linking page 7.
  - Figures: 📊 Mermaid Mac scene graph; 📊 Mermaid approach decision flowchart.
- [x] Task 4. `apps/apple/watchos.adoc`: *watchOS: App Structure, Connectivity, Workouts and the Smart Stack*
  - Content: single-target app, dependent vs independent, `WKApplicationDelegateAdaptor`/`WatchAppDelegate`
    (ClockKit/`WKExtensionDelegate` deprecation); vertical-page `TabView`, `NavigationStack`, Digital Crown,
    `handGestureShortcut`, Always On, watch sizes; `WatchConnectivityBridge` with the four transfer types;
    `FieldTripWorkoutSession` with mirroring and WorkoutKit; `WKExtendedRuntimeSession` and background refresh;
    complications and Smart Stack (`NextFieldTripComplication`, accessory families, `RelevanceConfiguration`),
    controls, Live Activities in the Smart Stack, ClockKit migration; watchOS 27 (Foundation Models, Vision).
  - Figures: 📊 Mermaid four WatchConnectivity transfer types; 📊 Mermaid watch app + widget extension App Group →
    complication/Smart Stack.
- [x] Task 5. `apps/apple/visionos.adoc`: *visionOS: Windows, Volumes, Immersive Spaces and RealityKit*
  - Content: Shared vs Full Space; windows and `NoteOrnament`; `FieldSiteVolume` volume; `ImmersiveSpace` immersion
    styles and `openImmersiveSpace`/`dismissImmersiveSpace`; look-and-tap with private gaze, hover effects,
    `targetedToAnyEntity`; `RealityView` attachments and `Model3D` (link page 35); porting iPad/iPhone apps; visionOS
    27 highlights.
  - Figures: 📊 `apple-visionos-immersion-spectrum.svg`; 📊 Mermaid FieldNotes visionOS scene graph.
- [x] Task 6. `apps/apple/testing-with-swift-testing.adoc`: *Unit Testing with Swift Testing*
  - Content (app-focused, linking Swift `testing.adoc` for basics): `@Test`/`@Suite`, `#expect`/`try #require`,
    `#expect(throws:)`, `confirmation`, `withKnownIssue`; `@Test(arguments:)`; traits (`.tags`, `.enabled(if:)`,
    `.timeLimit`, `.serialized`, custom `TestScoping`); attachments and exit tests (not on iOS); testing SwiftData
    and `@Observable` models (`NoteStoreTests`, `PersistenceTests`), App Intents via AppIntentsTesting
    (`FieldNotesShortcutsTests`); Xcode 27 XCTest interop modes `limited`/`complete`/`strict`/`none`.
  - Figure: 📊 Mermaid Swift Testing vs XCTest decision.
- [x] Task 7. `apps/apple/ui-tests-test-plans-and-coverage.adoc`: *UI Tests, Test Plans, Performance Tests and Coverage*
  - Content: `XCUIApplication`, identifier queries, `--uitesting` launch argument (with the `AppServices` revision),
    recording, `performAccessibilityAudit()`, video/screenshot attachments; `measure(metrics:)` with `XCTClockMetric`
    and `XCTApplicationLaunchMetric`; `FieldNotes.xctestplan` configurations, tags, repetitions, parallelization;
    coverage reports; snapshot testing (none from Apple; previews, screenshots, attachments; one line on third-party
    libraries).
  - Figures: 📊 Mermaid test pyramid; 📊 Mermaid test plan × destinations → report.
- [x] Task 8. `apps/apple/debugging-with-xcode-and-lldb.adoc`: *Debugging with Xcode and LLDB*
  - Content: breakpoints (line, symbolic, Swift error, exception, runtime issue; conditions, actions,
    log-and-continue); LLDB `p`/`po`/`v`/`expr`/`bt`, `@DebugDescription`; stepping across `await`; view debugger,
    environment overrides, memory graph with malloc stack logging; Address/Thread/UB sanitizers and Main Thread
    Checker; crashes from missing privacy keys; Device Hub (27). Link Swift `build-and-tooling.adoc` for LLDB basics.
  - Figures: 📊 Mermaid state run → break → inspect/step → continue; 📊 `apple-retain-cycle.svg` (an `@Observable`
    model and a closure).
- [x] Task 9. `apps/apple/logging-metrics-and-crash-reports.adoc`: *Logging, MetricKit, Crash Reports and Organizer*
  - Content: `Logger` (levels, privacy interpolation, Xcode console filtering, Console.app, `log stream`),
    `OSLogStore`; `OSSignposter`; MetricKit `MetricManager` (27) replacing `MXMetricManager`, StateReporting;
    crash report anatomy, symbolication and dSYMs; Xcode Organizer 27 (insights, metric goals, hitches, storage). Link
    the Prometheus section for server-side metrics.
  - Figure: 📊 Mermaid device → MetricKit/crash logs/TestFlight feedback → App Store Connect/Organizer → developer.
- [x] Task 10. `apps/apple/performance-and-instruments.adoc`: *Performance and Instruments*
  - Content: profiling Release builds (⌘I) in a measure → identify → fix → verify loop; Time Profiler (Call Tree,
    Flame Graph, Top Functions 27), Run Comparison (27); hangs and Animation Hitches; the SwiftUI instrument; Swift
    Concurrency template and Swift Executors instrument (27); System Trace; Allocations and Leaks; Power Profiler;
    launch time; app size and thinning.
  - Figures: 📊 Mermaid loop; 📊 Mermaid decision tree high CPU vs blocked main thread.
- [x] Task 11. `apps/apple/signing-capabilities-and-configuration.adoc`: *Membership, Signing, Capabilities and Info.plist*
  - Content: Program membership (individual, organization, Enterprise); certificate types; App IDs and bundle IDs;
    devices; provisioning profiles; automatic vs manual signing; `FieldNotes.entitlements`; Info.plist identity
    keys, usage descriptions, launch screen; privacy manifest (link page 33); Icon Composer layered icons; Developer
    Mode.
  - Figure: 📊 `apple-signing-pieces.svg` (Team → Certificate; App ID + Entitlements + Devices + Certificate →
    Provisioning Profile → signed build), cross-linked with the React Native figure.
- [x] Task 12. `apps/apple/app-store-connect-testflight-and-review.adoc`: *App Store Connect, TestFlight and App Review*
  - Content: app record; archive → Organizer → Distribute, `xcodebuild -exportArchive`, App Store Connect API;
    TestFlight internal vs external, beta review, public links, feedback; App Privacy details; Accessibility
    Nutrition Labels; age-rating questionnaire (date); App Review Guidelines sections 1–5 (revision date); phased
    release; upcoming SDK requirements with dates; EU alternative distribution and MarketplaceKit.
  - Figure: 📊 Mermaid sequence archive → … → phased release.
- [x] Task 13. `apps/apple/macos-distribution-outside-the-app-store.adoc`: *Distributing Mac Apps with Developer ID and Notarization*
  - Content: Developer ID Application/Installer certificates (Account Holder); hardened runtime;
    `xcrun notarytool submit --wait` with the `fieldnotes-notary` profile, `xcrun stapler staple`, `altool` retired;
    Gatekeeper; DMG, `pkgbuild`/`productbuild`, ZIP; common notarization issues.
  - Figure: 📊 Mermaid build → sign → notarize → staple → distribute → Gatekeeper.
- [x] Task 14. `apps/apple/ci-cd-xcode-cloud-and-command-line.adoc`: *CI/CD with Xcode Cloud and the Command Line*
  - Content: Xcode Cloud workflows (start conditions, actions, post-actions to TestFlight), `ci_scripts/`,
    environment variables, webhooks and simpler TestFlight workflows (27), included compute hours (dated), the
    membership question from #174 resolved or both sources stated; `xcodebuild` build/`test -testPlan`/archive/
    `-exportArchive`, `xcrun simctl`, `xcrun devicectl`, `notarytool`; App Store Connect API; GitHub Actions on
    macOS runners (`.github/workflows/ios.yml`); fastlane as an external note linking the React Native CI page.
  - Figure: 📊 Mermaid push/PR → workflow (build → test matrix → archive) → TestFlight → webhook.

### Group 3: Section wiring and reciprocal links

Parallelizable: yes. Each task edits different files. Runs after Group 2, because the bibliography and link texts
depend on the finished pages.

- [x] Task 15. `apps/apple/index.adoc` § `== Bibliography`: add every official URL used by pages 36–48 that isn't
  listed, merged into the existing groups, using the `link:++…++[+…+]` form where needed; keep the closing
  paragraph about #175.
- [x] Task 16. `apps/apple/index.adoc` § *The FieldNotes app*: one sentence on what part 3 adds (iPad windows and
  commands, the Mac utility window and menu bar extra, the watch bridge and complication, the visionOS volume,
  the test targets and test plan, and the release pipeline).
- [x] Task 17. Normalize the link text of every existing `xref:` to pages 36–48 across `apps/apple/*.adoc` to the
  page's real title from `nav.adoc` (e.g. "Signing, Capabilities and Configuration" → "Membership, Signing,
  Capabilities and Info.plist").
- [x] Task 18. Reciprocal links:
  - `apps/react-native/ci-cd-and-over-the-air-updates.adoc`: one sentence in its iOS/TestFlight part linking pages
    46 and 48;
  - `apps/react-native/building-and-publishing.adoc` § *Certificates, Identifiers, and Provisioning Profiles*: one
    sentence pointing to `apple-signing-pieces.svg` on page 45 (it already links pages 45–46);
  - `programming-languages/swift/testing.adoc` and `programming-languages/objective-c/testing.adoc` § *See Also*:
    link pages 40–41.

### Group 4: Consistency pass, validation, #170 comment and commit

Parallelizable: no. Each task depends on the one before it.

- [x] Task 19. Consistency pass over pages 36–48 and any page they touch:
  - [x] Task 19.1. Exactly one definition per canonical name (the duplicate-definition scan from #173), and no
    redefinition of part 1–2 types.
  - [x] Task 19.2. Part 1–2 signatures used unchanged (`NoteStore(...)`, `NoteEditor(noteID:)`,
    `NoteList(notebookID:selection:)`, `TagChip(_:isSelected:)`, `CaptureButton(action:)`, `AppServices.shared`,
    `SharedNoteAccess.persistence()`).
  - [x] Task 19.3. Store injection wherever `@Environment(NoteStore.self)` is read; new scenes (`NoteWindow`,
    `TagInspector`, `FieldSiteVolume`) get `.environment(store)`.
  - [x] Task 19.4. Platform guards (`#if os(...)`, `canImport`, `#available` for 27-only APIs).
  - [x] Task 19.5. Every dated rule has a date and an official link.
  - [x] Task 19.6. Fix everything found.
- [x] Task 20. Validation:
  - [x] Task 20.1. No admonitions under `apps/apple` except the disclaimer include.
  - [x] Task 20.2. Every new page has `:description:`, `:keywords:`, the disclaimer, a `=== Platform availability`
    table and `== References`.
  - [x] Task 20.3. Every example block is followed by an official link (deliberate exceptions only).
  - [x] Task 20.4. `npm run validate:mermaid` passes; restore `node_modules/.package-lock.json`.
  - [x] Task 20.5. Every new `apple-*.svg` is well-formed XML.
  - [x] Task 20.6. Antora build: 0 warnings; the only remaining `xref` errors target `cheat-sheet.adoc`; record the
    count.
  - [x] Task 20.7. Rendering check on the built HTML: no literal backticks outside code, no `<em>` inside Apple link
    URLs, no raw `xref:` text.
  - [x] Task 20.8. `detect-secrets` over the changed files; triage findings (the known placeholder checksum is a
    confirmed false positive).
- [ ] Task 21. Post a comment on #170 listing the unverified claims and API shapes per page, how the #174 "facts to
  verify" were resolved, and the final forward-link count.
- [ ] Task 22. Commit on `feature/174` with messages starting `Apple Platforms part 3:`, reviewing `git status` and
  excluding `build/` and `node_modules/`, then push.
