# Implementation Plan: Apple Platforms, part 4: book cross-check, bibliography and three cheat sheets

## Task summary

Source: GitHub issue #175
Base branch: feature/170

Issue [#175](https://github.com/albertoirurueta/docs/issues/175) closes the *Apple Platforms (iOS, iPadOS, macOS,
watchOS, visionOS)* section (parent #170) with four deliverables:

1. **Book cross-check** — identify the 15 reference books (`~/Desktop/ios1.pdf` … `ios15.pdf`), compare their
   tables of contents against the 48 concept pages, add or explicitly rule out every book-only concept, and record
   where a book is outdated.
2. **Bibliography** — complete `== Bibliography` on `apps/apple/index.adoc`.
3. **`apps/apple/cheat-sheet.adoc`** — the cheat-sheet landing page (already linked from nav and the index, but
   missing).
4. **Three one-page A4 PDFs** — `apple-swiftui-cheat-sheet.pdf`, `apple-frameworks-cheat-sheet.pdf`,
   `apple-platforms-cheat-sheet.pdf` in `modules/ROOT/attachments/`.

Work happens on `feature/175`, created from `origin/feature/170` at `26843f87` (after #181 merged); its PR targets
`feature/170`, never `main`.

**Approach chosen (no open question needed a user decision):**

1. **Books are narrative sources only.** Every concept added because of a book is researched and exemplified
   against Apple's official documentation; no code example comes from a book, and no book text is reproduced
   (copyrighted). Bibliography entries link the publisher page and the official code repository instead.
2. **Book-only concept policy.** A book-only concept is *added* when it is current, in scope for app development on
   the five platforms, and not already covered (checked by `grep` over `apps/apple/`); it lands as a new `==`/`===`
   section of the best-matching existing page rather than a new page, unless it clearly needs a page of its own
   (then it also gets a nav entry, an index "What's covered" entry and a cheat-sheet mention). It goes to *Out of
   scope* on #170 when it is legacy/superseded, games-specific, or a separate platform. Default verdicts to confirm
   against the actual books and pages:
   - add as sections (if not already covered): Swift Charts; Auto Layout/storyboards/Interface Builder essentials
     (UIKit interop page); Core Animation, Core Graphics, Core Image (drawing page or UIKit interop page); Combine
     and its bridge to async/await (concurrency page, framed as "existing code"); GCD/`OperationQueue` (concurrency
     page, framed as legacy with the Swift concurrency replacement named); Handoff/`NSUserActivity` and App Clips
     (App Intents page); Apple Pay/PassKit/Wallet (StoreKit page, distinguishing physical goods from IAP);
     SharePlay/Group Activities (visionOS or app-intents page).
   - out of scope: SpriteKit, SceneKit, GameplayKit, Game Center (games-specific; SceneKit deprecated in favour of
     RealityKit); CarPlay and HomeKit (specialised entitlements/accessory programs); SiriKit legacy intents
     (superseded by App Intents — mentioned as history only); tvOS (not one of the section's five platforms).
3. **Outdated material is named, never taught as current.** Where a book teaches `NavigationView`,
   `ObservableObject`-first data flow, `UIApplicationDelegate`-only life cycle, pre-Swift-6 concurrency, ClockKit,
   `altool`, XCTest-only testing or pre-Liquid Glass UI, the matching page states the current approach (and, if
   the page doesn't already, one sentence naming the old API as superseded). Every such case is noted in the
   comparison table.
4. **Bibliography scope.** The existing `== Bibliography` (index.adoc lines 302–1716) already groups framework
   roots, HIG, tutorials/samples/release notes, WWDC by year and Swift references. This part adds the two missing
   groups (*App Store, distribution and account help*; *Consulted reference books*), renames the first heading to
   the issue's wording, and closes the gaps: every WWDC session, every HIG page, every framework root and every
   official *article/guide/help/news* page linked from any Apple page must appear. Individual API-symbol pages
   (e.g. `documentation/swiftui/view/task(priority:_:)`) are covered by their framework-root entry, matching the
   React Native bibliography's granularity — ~357 deep symbol links would bury the list. Placeholder hosts
   (`fieldnotes.example.com`, `$(FIELDNOTES_API_HOST)`, etc.) are excluded.
5. **Cheat sheets reuse the #161 Task 33 pipeline**: reverse-engineer `swift-cheat-sheet.pdf` and
   `react-native-cheat-sheet.pdf` with PyMuPDF, build scratch HTML/CSS in the session scratchpad (never committed),
   render with `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --print-to-pdf`, verify
   one A4 page and a minimum font size ≥ 7 pt with PyMuPDF, commit only the PDFs. If a sheet can't fit at ≥ 7 pt,
   split it (e.g. frameworks → "Data & Services" + "Quality & Shipping") and record the split on `cheat-sheet.adoc`.

## Current code state

- **Pages:** 48 concept pages + `index.adoc` under `modules/ROOT/pages/apps/apple/` (parts 1–3, #172–#174, all
  merged into `feature/170`). Each page has `:description:`, `:keywords:`, `include::partial$apple-disclaimer.adoc[]`,
  a `=== Platform availability` table and a closing `== References`. The running example is the *FieldNotes* app.
- **Nav:** `modules/ROOT/nav.adoc` lines 838–891 list the section; line 891 already has
  `**** xref:apps/apple/cheat-sheet.adoc[Cheat Sheets (PDF)]`. `index.adoc` line 274 (`=== Reference`) links it too.
  Both are dangling xrefs today (the only remaining Antora errors after #174, per `implementation_plan_174.md` Task
  20.6).
- **`apps/apple/index.adoc` bibliography** (`[[_bibliography]]` at line 302):
  `=== Apple Developer Documentation` (305), `=== Human Interface Guidelines` (1430),
  `=== Apple tutorials, sample code and release notes` (1468), `=== WWDC sessions` with `==== 2026/2025/2024/Older`
  (1538–1689), `=== Swift language references` (1690), `=== Other official sources` (1707), then a placeholder
  paragraph deferring the books and App Store/distribution help to #175. A script comparison found 1 477 distinct
  links on the concept pages, 410 of them absent from the bibliography (357 `developer.apple.com/documentation`
  deep links, 13 HIG, 8 App Store Connect API, a few GitHub/swift.org, 1 WWDC video, plus placeholders).
- **Precedents:**
  - `apps/react-native/index.adoc` lines 318–352 — *Consulted reference books* entry format and lead-in.
  - `apps/react-native/cheat-sheet.adoc` — cheat-sheet page structure (title, `:description:`, `:keywords:`,
    disclaimer include, intro, bold group xref lists, `== Download`).
  - `.archive/implementation_plan_161.md` Task 33 — PDF pipeline; `.archive/implementation_plan_174.md` Group 4 —
    validation checklist and #170 comment.
- **Books:** `~/Desktop/ios1.pdf` … `ios15.pdf` (265–799 pages, all with embedded TOCs). Partly identified from
  metadata/imprint: ios3 ISBN 978-1-83763-056-1; ios5 978-1-80324-631-4; ios6 978-1-83864-379-9; ios8
  978-1-80323-445-8; ios9 Neuburg, *iOS 15 Programming Fundamentals with Swift* (O'Reilly, 978-1-098-11850-1);
  ios10 Catalan, *SwiftUI Cookbook* (978-1-80512-173-2); ios11 Moon et al., *Swift Cookbook* (978-1-80323-958-3);
  ios12 *iOS Architecture Patterns* (Apress, 978-1-4842-9068-2). ios1, 2, 4, 7, 13, 14, 15 need their imprint pages
  read.
- **Tooling:** PyMuPDF 1.26.5 (Python 3.9) and Google Chrome are installed; `npx antora antora-playbook.yml` builds
  the site; `npm run validate:mermaid` exists.

## Implementation steps

### Group 1: Book identification and comparison

Parallelizable: yes — each book is read independently (one agent per 3–5 books); the merge into one table happens
in Group 2.

- [x] Task 1. Identify every book (ios1–ios15) — all 15 books identified via PyMuPDF metadata/imprint pages;
  merged into scratchpad `books.json`. Doc-only task, no repo files touched, no tests/coverage/license applicable.
  - [x] Task 1.1. Title/subtitle/edition/author(s)/publisher/pub date/ISBN(s) recorded for all 15 books in
    `books.json` (7 of 15 have no printed ISBN — Kodeco/raywenderlich PDF-only editions — noted as such rather
    than guessed).
  - [x] Task 1.2. Xcode/Swift/iOS (and other OS) target versions recorded per book in `books.json`.
  - [x] Task 1.3. Publisher product page and official code repo recorded per book; every URL curl-verified
    (`curl -sI`) except 5 `packtpub.com`/`catalogue.packt.com` product pages, which 403 site-wide to automated
    fetchers (bot protection, not a broken link) — marked `publisher_url_verified: false` with the URL kept
    (corroborated by independent listings), never guessed. No URL was fabricated.
  - [x] Task 1.4. Results saved as `books.json` (15 objects) in the session scratchpad, not the repo.
- [x] Task 2. Map each book's TOC (`doc.get_toc()`) to the 48 pages — all 15 `book-map-iosN.md` files produced in
  the scratchpad; no book prose copied (spot-checked).
  - [x] Task 2.1. Chapter → concept-page (page + slug) mappings recorded per book.
  - [x] Task 2.2. Book-only candidate chapters (no matching page) listed per book with one-line, own-words
    summaries.
  - [x] Task 2.3. Outdated-material notes (e.g. `NavigationView`, `ObservableObject`-only state,
    `@UIApplicationMain`-only life cycle, GCD-first concurrency, `altool`, XCTest-only, pre-Liquid-Glass styling)
    recorded per chapter where applicable.
  - [x] Task 2.4. Saved as `book-map-ios1.md` … `book-map-ios15.md` in the scratchpad, not the repo.

### Group 2: Comparison table and book-only concept decisions

Parallelizable: no — Task 4 depends on Task 3's merged table.

- [x] Task 3. Build the comparison table (scratchpad `comparison.md`) — written to the scratchpad, not the repo.
  - [x] Task 3.1. One row per concept page (48 rows, in "What's covered" order):
    `| Concept (page) | Official docs | Books covering it (iosN: chapter) | Notes |`; "Official docs" is ✅ for every
    page (every page cites Apple's docs); Notes carries outdated-material remarks.
  - [x] Task 3.2. A second table of book-only concepts with a verdict column (*added to <page>#<section>* or *out of
    scope — <reason>*), applying the policy in the Task summary after `grep -ril` over `modules/ROOT/pages/apps/apple/`
    confirms it isn't already covered — 23 verdicts recorded (1 added: Swift Charts; 5 already covered: Combine,
    GCD/`OperationQueue`, Handoff/`NSUserActivity`, drag and drop, Spotlight/Universal Links, dependency injection
    strategies; 1 gap confirmed still open but book-covered, Auto Layout/storyboards/IB, added; 16 out of scope).
    Apple Pay/PassKit/Wallet, Core Animation/Graphics/Image, Handoff/App Clips beyond what's covered, and
    SharePlay/Group Activities are not applicable — no book in the library actually teaches them, so the plan's
    default candidates for them could not be confirmed either way.
- [x] Task 4. Record the out-of-scope list (scratchpad `out-of-scope.md`) — concept, which books cover it,
  one-line reason. 17 entries recorded (plus the 7 not-applicable defaults noted separately). Posted to #170 in
  Task 17/21.

### Group 3: Add book-only concepts to parts 1–3

Parallelizable: yes — one task per target page; if two concepts target the same page they belong to the same task.
The exact task list is fixed by Task 3.2; the entries below are adjusted to its verdicts (see `comparison.md`
Table 2 and `out-of-scope.md`): Task 7 (GCD/`OperationQueue` and Combine), Task 8 (Handoff/`NSUserActivity` and
App Clips), Task 9 (Apple Pay/PassKit/Wallet) and Task 10 (SharePlay/Group Activities) are dropped — Combine and
GCD/`OperationQueue` are already covered on `concurrency-in-apps.adoc` (`== Where Combine Stands` and the
`dispatch-and-legacy-concurrency.adoc` cross-reference); Handoff/`NSUserActivity` is already covered on
`app-intents-and-system-integration.adoc`; and no book in the library actually teaches App Clips, Apple
Pay/PassKit/Wallet or SharePlay/Group Activities, so there is no book-sourced material to add for them. Task 5's
Core Graphics/Core Image/Core Animation clause is dropped for the same reason (not applicable — no book covers
them); its Swift Charts half stands, confirmed as a real gap. No extra "added" verdicts require a new task beyond
the two Task 3.2 confirmed (Swift Charts, Auto Layout/storyboards/IB), both already represented below.

Rules for every addition: official Apple docs only as the source; a Swift example per concept, followed by a link
to the official page; FieldNotes names from `implementation_plan_172/173/174.md` canonical-names sheets; update the
page's `:keywords:`, its `=== Platform availability` table if a new API row is needed, and its `== References`; no
admonitions other than the disclaimer.

- [x] Task 5. `swiftui-drawing-animation-and-gestures.adoc` — `== Visualizing Data with Swift Charts` (`Chart`,
  `BarMark`, `LineMark`, `chartXSelection`) — new section added before `== Putting It Together`, with a
  `NotebookActivityChart` FieldNotes example (`Chart`, `BarMark`, `LineMark`, `.chartXSelection(value:)`) and a
  follow-up `selectedCount` snippet; `:keywords:` and `== References` updated (5 new links: Charts framework
  root, `Chart`, `BarMark`, `LineMark`, `chartXSelection(value:)`). No `=== Platform availability` table exists on
  this page, so none was added (task's "if a new API row is needed" did not apply).
- [x] Task 6. `uikit-and-appkit-interop.adoc` — Auto Layout, storyboards and Interface Builder essentials (anchors,
  `NSLayoutConstraint.activate`, when you still meet storyboards), framed as maintaining existing UIKit code — new
  `=== Auto Layout, Storyboards and Interface Builder` subsection added under `== UIKit Essentials`, right after
  `=== View Controllers`, with two Swift examples (`NSLayoutAnchor`/`NSLayoutConstraint.activate(_:)`, and
  `UIStoryboard`/`@IBOutlet`/`@IBAction`); `:keywords:` and `== References` updated (6 new links). No
  `=== Platform availability` table exists on this page. This section itself already satisfies Task 11 for this
  page's own Notes entry (storyboards/IB framed explicitly as the legacy maintenance path, not the primary
  approach).
- [x] Task 11. Outdated-material pass: for each Notes entry in Task 3.1 whose page doesn't already name the
  current approach against the outdated one, add one sentence doing so on that page (grep-first, add only where
  genuinely missing). Complete across all 29 pages with a Notes entry:
  - Edited (one sentence each, unless noted): `swiftui-drawing-animation-and-gestures.adoc` (`=== Composing
    Gestures`, `UIGestureRecognizer`/RxGesture vs. SwiftUI's gesture combinators); `uikit-and-appkit-interop.adoc`
    (satisfied by Task 6's own framing, no separate edit); `swiftui-views-and-modifiers.adoc` (`== Modifiers`,
    pre-Liquid-Glass styling, forward xref to `liquid-glass-and-the-design-system.adoc`);
    `swiftui-lists-tables-and-collections.adoc` (opening paragraph, `UITableView`/`UICollectionView` vs.
    `List`/`ForEach`/`Table`); `accessibility.adoc` (Accessibility Nutrition Labels vs. prior internal-only
    auditing); `background-execution.adoc` (`== Scheduled Tasks with BGTaskScheduler`,
    `setMinimumBackgroundFetchInterval`/`performFetchWithCompletionHandler` vs. `BGTaskScheduler`);
    `notifications-and-live-activities.adoc` (`== Categories and Actions`, fire-and-forget banners vs.
    categories/actions + Live Activities); `widgets-and-controls.adoc` (two sentences: `== How WidgetKit Works`,
    Today Extension/`NCWidgetProviding` vs. WidgetKit; `== Watch Complications and the Smart Stack`, `ClockKit` vs.
    WidgetKit-based complications); `app-intents-and-system-integration.adoc` (intro, SiriKit
    `.intentdefinition`/`INIntent` vs. App Intents); `apple-intelligence-and-machine-learning.adoc`
    (`== Foundation Models: the On-Device Model`, Core ML/Vision-only vs. on-device Foundation Models);
    `security-and-privacy.adoc` (`== Signing In: AccountManager`, Sign in with Apple vs. passkeys);
    `watchos.adoc` (`=== WatchConnectivityBridge`, `ObservableObject` vs. `@Observable`, plus new
    `https://developer.apple.com/documentation/observation` reference); `debugging-with-xcode-and-lldb.adoc` (two
    sentences: `== Inspecting State with LLDB`, Python 2 vs. Python 3 LLDB scripting; `=== The memory graph and
    malloc stack logging`, DTrace vs. Instruments, plus new
    `https://developer.apple.com/documentation/security/disabling-and-enabling-system-integrity-protection`
    reference); `performance-and-instruments.adoc` (`== Memory: Allocations and Leaks`, manual
    `malloc_history`/breakpoint leak-hunting vs. Instruments/`os_signpost`/MetricKit).
  - Already covered, no edit needed: `app-structure-and-lifecycle.adoc`, `concurrency-in-apps.adoc`,
    `swiftui-layout.adoc`, `swiftui-navigation-and-presentation.adoc`, `swiftui-controls-forms-text-and-images.adoc`,
    `core-data-cloudkit-and-icloud.adoc`, `preferences-files-and-documents.adoc`, `augmented-reality.adoc`,
    `visionos.adoc` (watchOS's ClockKit sub-point also already covered), `testing-with-swift-testing.adoc`,
    `ui-tests-test-plans-and-coverage.adoc`, `signing-capabilities-and-configuration.adoc`,
    `app-store-connect-testflight-and-review.adoc`, `app-architecture.adoc`.
  - No admonitions used anywhere; verified with a repo-wide grep across all 14 touched files.
  - New official URLs added (for Group 4's bibliography): `https://developer.apple.com/documentation/charts`,
    `https://developer.apple.com/documentation/charts/chart`, `https://developer.apple.com/documentation/charts/barmark`,
    `https://developer.apple.com/documentation/charts/linemark`,
    `https://developer.apple.com/documentation/swiftui/view/chartxselection(value:)`,
    `https://developer.apple.com/documentation/uikit/nslayoutanchor`,
    `https://developer.apple.com/documentation/uikit/nslayoutconstraint`,
    `https://developer.apple.com/documentation/uikit/nslayoutconstraint/activate(_:)`,
    `https://developer.apple.com/documentation/uikit/uistoryboard`,
    `https://developer.apple.com/documentation/uikit/uistoryboard/1616214-instantiateviewcontroller`,
    `https://developer.apple.com/documentation/security/disabling-and-enabling-system-integrity-protection`,
    `https://developer.apple.com/documentation/observation`.
- [x] Task 12. If any addition got its own page: nav entry in `modules/ROOT/nav.adoc`, "What's covered" entry in
  `apps/apple/index.adoc`, and a reciprocal link from the nearest related page. **n/a** — both additions (Swift
  Charts, Auto Layout/Storyboards/IB) are new sections on existing pages, not new pages, so no nav/index/reciprocal
  link changes are needed.

### Group 4: Bibliography

Parallelizable: no — every task edits `apps/apple/index.adoc`.

- [x] Task 13. Restructure and complete `== Bibliography` in `modules/ROOT/pages/apps/apple/index.adoc`
  - [x] Task 13.1. Rename `=== Apple Developer Documentation` to
    `=== Apple Developer Documentation (primary source for every page and every code example)`; add any framework
    root page used by a page but missing (check SwiftUI, UIKit, AppKit, SwiftData, Observation, Foundation Models,
    App Intents, WidgetKit, ActivityKit, UserNotifications, BackgroundTasks, Core Location, MapKit, HealthKit,
    RealityKit, ARKit, StoreKit, Security, AuthenticationServices, Testing, XCTest, Xcode, plus Swift Charts,
    PassKit, GroupActivities etc. from Group 3), and any `documentation/<framework>/<article>` *article* (not
    symbol) linked from a page.
  - [x] Task 13.2. Add the missing HIG pages (the 13 found) under `=== Human Interface Guidelines`, including every
    "Designing for …" page.
  - [x] Task 13.3. Under `=== Apple tutorials, sample code and release notes`, confirm Develop in Swift, SwiftUI
    tutorials, App Dev Training, the Landmarks/Food Truck/Backyard Birds/Destination Video samples, the Xcode 27,
    iOS 27 and watchOS 27 release notes and the `documentation/updates/*` pages; add any missing.
  - [x] Task 13.4. Under `=== WWDC sessions`, add every session linked from any page that is missing, in its year
    group (2026, 2025, 2024, Older).
  - [x] Task 13.5. New `=== App Store, distribution and account help`: App Review Guidelines, App Store Connect Help
    (and the App Store Connect API root that the 8 `api.appstoreconnect.apple.com` references use), Developer
    Account Help, TestFlight, Xcode Cloud, `news/upcoming-requirements`, Developer ID — moving any such entry now
    under another group here.
  - [x] Task 13.6. `=== Swift language references`: confirm the Swift 6.4 release post, API Design Guidelines,
    C++ interop, LLDB, and the site's Swift and Objective-C references; add the missing `github.com/swiftlang`,
    `github.com/apple` links (or put them under *Other official sources*).
  - [x] Task 13.7. New `=== Consulted reference books`: lead-in *"These were consulted for the concept narrative
    and the practitioner's perspective, never as the source of any code example. They are copyrighted works and
    are not reproduced here; their publisher pages are linked instead."*; then 15 entries, each
    `Author(s). _Title_, edition. Publisher, Month Year. ISBN …` -- see `<publisher page>[the publisher's book
    page]`, with the official code repository link, and one sentence on what it was used for and which
    Xcode/iOS/Swift version it targets (and what is superseded). Order alphabetically by first author.
  - [x] Task 13.8. Replace the placeholder paragraph at the end with a closing paragraph: on any discrepancy,
    Apple's current documentation is authoritative; every example targets Xcode 27, Swift 6.4 and the 27 SDKs and
    was verified against it, not transcribed from a book.
  - [x] Task 13.9. Re-run the link-coverage script (every non-placeholder, non-symbol official link on the 48 pages
    appears in the bibliography; every WWDC session appears) and fix the gaps.
  - Implementation note: edited `modules/ROOT/pages/apps/apple/index.adoc` only. Apple Developer Documentation:
    +1 framework root (Swift Charts) plus AppKit/WatchKit root links and ~45 article-level additions across
    existing framework bullets; Human Interface Guidelines: +13 entries (12 HIG pages + Apple Design Resources);
    WWDC sessions: +1 (WWDC24 -- Demystify SwiftUI containers, under 2024); Swift language references: +4 entries
    (Swift 6 migration guide, swift-collections/swift-async-algorithms, 2 Swift Evolution proposals, plus a
    cxx-interop sub-page); App Store, distribution and account help: new section with 10 entries, consolidated by
    moving Account Help, Xcode Cloud, App Store Connect API, App Store Connect Help, Developer ID, MarketplaceKit,
    App Store privacy requirements, Membership and App Store Connect, Upcoming Requirements and App Review
    Guidelines out of their previous locations (no duplicates left behind); Consulted reference books: new section
    with exactly 15 entries, alphabetical by first author's surname. A scratch link-coverage script
    (`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/7c985c62-7743-49b5-87b4-7ff1739e3328/scratchpad/diff_links2.py`)
    confirmed 0 genuinely missing non-symbol, non-placeholder official links and 0 missing WWDC sessions across the
    48 concept pages.

### Group 5: Cheat sheet PDFs

Parallelizable: yes (Tasks 15–17 each produce an independent PDF) after Task 14.

- [x] Task 14. Extract the house style with PyMuPDF from `modules/ROOT/attachments/swift-cheat-sheet.pdf` and
  `react-native-cheat-sheet.pdf`: page size (A4 595×842 pt), margins, column count, palette RGB, fonts and sizes,
  box border/header treatment, header/subtitle and footer breadcrumb layout. Write a shared scratch `base.css` in
  the scratchpad. — Confirmed both PDFs are exactly one A4 page (595×842 pt). Extracted palette (`#1D3F66` blue,
  `#26303A` slate, `#78838F` gray, `#6B4B96` purple, `#A03030` red, `#1F7A72` teal, plus a brown accent), fonts
  (Helvetica body, Menlo code), a 3–4 column flexbox grid, bordered/tinted boxes with an uppercase colored header
  rule, a title+subtitle header with a bottom rule, and an italic breadcrumb footer with a bottom rule. Wrote
  `base.css`, `render.sh` (headless Chrome `--print-to-pdf --no-pdf-header-footer`) and `verify_pdf.py`
  (page_count/size/min-font/clipping checks) to the scratchpad
  (`cheatsheets/` subfolder); noted the new ≥7 pt floor for Tasks 15–17 is far above the precedents' ~4–6 pt, so
  density must be lower. No license header applicable (scratch files, not repo source).
- [x] Task 15. `apple-swiftui-cheat-sheet.pdf` — **SwiftUI & App Essentials**. Boxes: project/`@main`/scenes; view +
  modifier order; layout (stacks, grids, `ViewThatFits`, `Layout`); state wrappers decision table (`@State`,
  `@Binding`, `@Observable`, `@Bindable`, `@Environment`, `@AppStorage`, `@SceneStorage`); lists/`ForEach`/`Table`/
  `searchable`; navigation (`NavigationStack`+`NavigationPath`, `NavigationSplitView`, `TabView`,
  sheets/detents/inspector/alerts); controls & forms; animation/gesture one-liners; Liquid Glass (`glassEffect`,
  `.glass`); accessibility modifiers; localization (`String(localized:)`, `.xcstrings`); previews (`#Preview`);
  UIKit/AppKit interop (`UIViewRepresentable`, `UIHostingController`) (+ Swift Charts one-liner if added in
  Group 3). — 14 boxes built in the scratchpad and rendered to `modules/ROOT/attachments/apple-swiftui-cheat-sheet.pdf`
  (verified: 1 page, 594.96×841.92 pt, min font 7.00 pt, no clipping — independently re-checked). Every API name
  grepped verbatim against `modules/ROOT/pages/apps/apple/*.adoc`. No license header applicable (PDF asset).
- [x] Task 16. `apple-frameworks-cheat-sheet.pdf` — **Data, Services & Shipping**. Boxes: concurrency (`.task`,
  `@MainActor`, `@concurrent`, `AsyncStream`); SwiftData (`@Model`, `@Query`, `ModelContainer`, `#Predicate`,
  migrations); preferences/files/documents; `URLSession` async; background tasks; notifications + APNs payload;
  Live Activities; WidgetKit timeline + controls; App Intents / App Shortcuts / universal links; Foundation Models
  (`LanguageModelSession`, `@Generable`, `Tool`); location/maps/photos permission keys; Keychain /
  LocalAuthentication / passkeys / privacy manifest; StoreKit 2 purchase loop; Swift Testing (`@Test`, `#expect`,
  `#require`, traits); debugging & Instruments (LLDB `po`/`v`, templates); signing pieces;
  `xcodebuild`/`notarytool`/`simctl`/`devicectl`; TestFlight → App Review flow. Most likely to overflow — apply the
  split fallback if needed. — all 18 boxes fit on one page at the 7 pt floor with room to spare; **no split was
  needed**, kept as the single `modules/ROOT/attachments/apple-frameworks-cheat-sheet.pdf` (verified: 1 page,
  594.96×841.92 pt, min font 7.00 pt, no clipping — independently re-checked, plus the agent's own
  scrollHeight/clientHeight overflow spot-check). ~80 distinct API/tool names grepped verbatim against the actual
  pages. No license header applicable (PDF asset).
- [x] Task 17. `apple-platforms-cheat-sheet.pdf` — **Platform Differences at a Glance**. A platform ×
  {UI framework, scene types, primary input, windowing model, widget/complication surfaces, background model,
  distribution channel, min Xcode/SDK} matrix; one box each for iOS, iPadOS, macOS, watchOS, visionOS (contents per
  the issue); conditional compilation & availability (`#if os`, `@available`, `#available`). — matrix + conditional
  compilation box rendered to `modules/ROOT/attachments/apple-platforms-cheat-sheet.pdf` (verified: 1 page,
  594.96×841.92 pt, min font 7.00 pt, no clipping — independently re-checked). Terms grepped verbatim against
  ipados/macos/watchos/visionos/getting-started/multiplatform-projects/background-execution/widgets-and-controls/
  macos-distribution-outside-the-app-store/app-store-connect-testflight-and-review.adoc. No license header
  applicable (PDF asset). Note: this task's agent found the shared scratch `render.sh` (Chrome CLI
  `--print-to-pdf`) intermittently ignored `@page` CSS and fell back to US Letter in this environment; it worked
  around this with a DevTools-protocol script (`render_devtools.py`, same scratchpad folder) rather than editing
  the shared `render.sh` — flagging for Group 6/any future cheat-sheet work in case the same flakiness recurs.
- Common to Tasks 15–17:
  - content wording is drawn from the finished Apple pages (every API named must appear on a page), never from the
    books;
  - header subtitle exactly **"iOS · iPadOS · macOS · watchOS · visionOS 27 — Xcode 27 — Swift 6.4"**; footer
    breadcrumb *Guides & References › Apps › Apple Platforms*;
  - render with headless Chrome `--print-to-pdf --no-pdf-header-footer`; verify with PyMuPDF: `page_count == 1`,
    page rect ≈ 595×842 pt, minimum span font size ≥ 7 pt, no text clipped outside the page; iterate layout rather
    than truncating;
  - write the PDF to `modules/ROOT/attachments/`; keep HTML/CSS in the scratchpad only.

### Group 6: Cheat sheet page

Parallelizable: yes (single task). Depends on Group 5 (it names the final PDFs, including any split).

- [x] Task 18. Create `modules/ROOT/pages/apps/apple/cheat-sheet.adoc` modelled on
  `apps/react-native/cheat-sheet.adoc` — new file `modules/ROOT/pages/apps/apple/cheat-sheet.adoc`; no tests
  applicable (docs-only Antora page); `npx antora antora-playbook.yml` build completed with 0 errors/warnings.
  - [x] Task 18.1. `= Apple Platforms Cheat Sheets`, `:description:` (three printable one-page A4 references for
    iOS/iPadOS/macOS/watchOS/visionOS 27, Xcode 27, Swift 6.4) and `:keywords:`; `include::partial$apple-disclaimer.adoc[]`.
  - [x] Task 18.2. Intro paragraph explaining the three-sheet split (≈80 % shared across platforms; grouped by what
    you look up together).
  - [x] Task 18.3. One bold group per index "What's covered" group (Foundations & tooling; SwiftUI, UI & design;
    Data & networking; Background work & system integration; Intelligence & devices; Security & commerce; Platform
    specifics; Quality; Distribution), each an xref list of all its pages, titles verbatim from each page's
    `= Title` — every one of the 48 (+ any new) pages linked.
  - [x] Task 18.4. `== Download` with `xref:attachment$apple-swiftui-cheat-sheet.pdf[…]`,
    `xref:attachment$apple-frameworks-cheat-sheet.pdf[…]`, `xref:attachment$apple-platforms-cheat-sheet.pdf[…]`,
    each with a one-line description (and a note on any split made in Group 5) — no split was made; all three
    sheets described in one line each.
  - [x] Task 18.5. Confirm nav line 891 title and `index.adoc` line 274 description match the final page (plural
    "Cheat Sheets", three sheets) — both already matched; no edits needed.

### Group 7: Validation, issue comments and commit

Parallelizable: no — each task depends on the one before it.

- [x] Task 19. Validation
  - [x] Task 19.1. No admonitions under `apps/apple` except the disclaimer include; new sections follow the page
    rules (example + official link, availability rows, references). — `grep -rn -E '^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):'`
    and `grep -rn -E '^\[(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]'` over `modules/ROOT/pages/apps/apple/` both
    returned zero matches (only the disclaimer `include::` is present, on all 48 pages). Confirmed the two new
    sections (`swiftui-drawing-animation-and-gestures.adoc` § "Visualizing Data with Swift Charts",
    `uikit-and-appkit-interop.adoc` § "Auto Layout, Storyboards and Interface Builder") each carry a *FieldNotes*
    code example plus official `developer.apple.com` links.
  - [x] Task 19.2. `npm run validate:mermaid` passes if any diagram was touched; restore
    `node_modules/.package-lock.json` afterwards. — n/a: `git diff -- modules/ROOT/pages/apps/apple/` contains no
    `[mermaid]` blocks (0 matches), so the validator was not run. `node_modules/.package-lock.json` was already
    modified before this run started (per `git status`); a copy was saved to
    `<scratchpad>/package-lock.before.json` before any command touched it, and since the mermaid validator never
    ran, nothing further changed it in this run — no restore needed.
  - [x] Task 19.3. `npx antora antora-playbook.yml`: 0 errors and 0 warnings (the dangling `cheat-sheet.adoc`
    xrefs are now resolved). — build completed with empty stdout/stderr (no error/warning lines); `build/site`
    regenerated with fresh timestamps for all touched pages.
  - [x] Task 19.4. In `build/site/apps/apple/cheat-sheet.html`, each download link resolves to an existing file in
    `build/site/_attachments/` (or wherever Antora publishes attachments) of the expected size; re-run the PyMuPDF
    one-page/≥ 7 pt check on those built copies. — all 3 links (`apple-swiftui-cheat-sheet.pdf`,
    `apple-frameworks-cheat-sheet.pdf`, `apple-platforms-cheat-sheet.pdf`) resolve to files in
    `build/site/_attachments/` whose sizes exactly match their `modules/ROOT/attachments/` sources (199415,
    221927, 155374 bytes respectively). PyMuPDF on the built copies: all 3 are 1 page; minimum font size on every
    page is 6.9975pt (float representation of the 7pt spec) on all three, i.e. meets the ≥7pt threshold.
  - [x] Task 19.5. Rendering check on built HTML: no literal backticks outside code, no raw `xref:` text, no
    `<em>` inside link URLs. — checked all 16 touched pages' built HTML (`index`, `cheat-sheet`,
    `swiftui-drawing-animation-and-gestures`, `uikit-and-appkit-interop`, plus the 13 pages with outdated-API
    sentences: `accessibility`, `app-intents-and-system-integration`, `apple-intelligence-and-machine-learning`,
    `background-execution`, `debugging-with-xcode-and-lldb`, `notifications-and-live-activities`,
    `performance-and-instruments`, `security-and-privacy`, `swiftui-lists-tables-and-collections`,
    `swiftui-views-and-modifiers`, `watchos`, `widgets-and-controls`) — zero matches for all three patterns on
    every page.
  - [x] Task 19.6. Delegate a secret scan of the changed files to the `iru-gate-runner` agent
    (`Agent({description: "Secret scan for #175", subagent_type: "iru-gate-runner", prompt: "Invoke
    Skill({skill: \"iru-check-security\", args: \"modules/ROOT/pages/apps/apple modules/ROOT/attachments\"}) and
    report findings"})`); triage findings. — one finding: `swift-packages-and-modularization.adoc:472`, Hex High
    Entropy String, a placeholder SHA-256 `checksum:` value in a `.binaryTarget(...)` Swift Package sample.
    Triaged as a false positive (synthetic example checksum, not a real credential); no `.secrets.baseline`
    change made by this scoped scan. No other findings across the scanned pages or `modules/ROOT/attachments/`.
- [x] Task 20. Post the comparison table (Task 3, both tables) as a comment on #175
  (`gh issue comment 175 --body-file <scratchpad>/comparison.md`), and keep a copy for the PR description. —
  re-read `comparison.md` first (no copied book prose, own-words summaries/chapter refs only; consistent with the
  final state: Swift Charts and Auto Layout/IB additions, one-sentence outdated-API notes, no cheat-sheet split);
  confirmed via `gh issue view 175 --comments` that no identical comment existed yet, then posted:
  https://github.com/albertoirurueta/docs/issues/175#issuecomment-5823800977. A copy remains at
  `<scratchpad>/comparison.md` for the PR description.
- [x] Task 21. Post the out-of-scope list (Task 4) as a comment on #170, plus a line listing any concepts added to
  parts 1–3 by this part (page + section). — re-read `out-of-scope.md` first (same own-words/consistency check);
  confirmed via `gh issue view 170 --comments` no duplicate existed, then posted `out-of-scope.md` plus an added
  "Concepts added to parts 1–3's pages by this part" section (Swift Charts →
  `swiftui-drawing-animation-and-gestures.adoc` § "Visualizing Data with Swift Charts"; Auto Layout/Storyboards/IB
  → `uikit-and-appkit-interop.adoc` § "Auto Layout, Storyboards and Interface Builder"):
  https://github.com/albertoirurueta/docs/issues/170#issuecomment-5823805394.
- [x] Task 22. Commit on `feature/175` with messages starting `Apple Platforms part 4 (#175):`, reviewing
  `git status` and excluding `build/`, `node_modules/` and any scratch file; don't commit `.secrets.baseline`
  changes unrelated to this work.
