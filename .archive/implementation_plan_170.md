# Implementation Plan: Apple Platforms — final #170 review and close-out

## Task summary

Source: GitHub issue #170
Base branch: main

Issue [#170](https://github.com/albertoirurueta/docs/issues/170) is the parent of the *Apple Platforms (iOS, iPadOS,
macOS, watchOS, visionOS)* section. Its four parts — #172 (pages 1–20), #173 (21–35), #174 (36–48) and #175 (book
cross-check, bibliography, cheat sheets) — are all merged into `feature/170` (head `f38e7adc`) and closed. #170 says
`feature/170` reaches `main` only through **one final PR that closes #170**, after a final review that picks up
the items the parts deferred to it (the eight comments on #170).

The validation run in this session (one agent per issue plus a site/build/link pass) found:

- **Every acceptance criterion of #170, #172, #173, #174 and #175 passes** — 48 pages + landing page + cheat-sheet
  page, nav, disclaimer-only admonitions, `:description:`/`:keywords:`, `== References`, figures (20 SVGs, 408
  Mermaid diagrams, all valid), platform-availability tables, cross-links into the rest of the site, the 15-book
  bibliography, three one-page A4 cheat-sheet PDFs, and a clean Antora build (0 errors, 0 warnings, no broken
  internal links). 80 sampled `developer.apple.com` links all resolve; 776 Swift blocks pass `swiftc -parse`.
- **Two small open defects** from the #170 comment trail:
  1. `ci-cd-xcode-cloud-and-command-line.adoc:327` — `` `chmod +x` `` breaks inline-code rendering (the `+` is read
     as a passthrough delimiter); the built HTML shows literal backticks for the rest of the paragraph.
  2. `.secrets.baseline` — the illustrative SwiftPM `.binaryTarget` checksum at
     `swift-packages-and-modularization.adoc:472` is still un-audited (no `is_secret`), which #172's comment asked to
     confirm.
- **Two items that needed a user decision**, now decided:
  1. *Should `SharedNoteAccess` honour `--uitesting`?* — **Keep as is and document why** (user choice): widgets and
     intents run in their own extension processes, which never receive the app's launch arguments, so they keep
     reading the real App Group store; the UI-tests page already says this and gets one sentence explaining the
     reason and how tests that exercise extensions should seed data.
  2. *How deep should the deferred "compile the examples" check go?* — **Type-check per page** (user choice)
     against the 27 SDKs with the local Xcode 27 / Swift 6.4 toolchain, using scratch stubs for FieldNotes types
     defined on other pages, and fix real API/type errors in the docs. Scratch harness files are never committed.

Then the section is committed on `feature/170`, the final-review outcome is posted on #170, and the final PR
`feature/170 → main` (closing #170) is opened by the `iru-issue` flow.

## Current code state

- **Section:** `modules/ROOT/pages/apps/apple/` — 48 concept pages, `index.adoc` (landing page with `== Bibliography`
  at line ~303), `cheat-sheet.adoc`; nav in `modules/ROOT/nav.adoc` (lines ~838–891); disclaimer
  `modules/ROOT/partials/apple-disclaimer.adoc`; figures `modules/ROOT/images/apple-*.svg` (20); PDFs
  `modules/ROOT/attachments/apple-{swiftui,frameworks,platforms}-cheat-sheet.pdf`.
- **Running example:** *FieldNotes*. Canonical type/API names are defined in the "canonical names" sheets of
  `.archive/implementation_plan_172.md`, `_173.md` and `_174.md` (e.g. `Note`, `Notebook`, `Tag`, `NoteStore`,
  `AppServices.shared`, `SharedNoteAccess.persistence()`, `NoteEditor(noteID:)`, `NoteList(notebookID:selection:)`,
  `TagChip(_:isSelected:)`, `CaptureButton(action:)`, `NotesAPIClient`, `KeychainStore`, `AccountManager`).
- **`--uitesting`:** `ui-tests-test-plans-and-coverage.adoc` lines 97–141 — `AppServices.shared` switches to an
  in-memory store; lines 134–139 already state that `SharedNoteAccess` users (widgets, `NoteEntityQuery`,
  `TogglePinIntent`) still read the real store and that the App Intents tests launch without `--uitesting`.
- **Toolchain available locally:** Xcode 27.0 (27A266a), Swift 6.4, iPhoneSimulator27.0 SDK (plus macOS, watchOS and
  visionOS 27 SDKs shipped with Xcode 27). PyMuPDF 1.26.5 and headless Chrome for the cheat sheets; the cheat-sheet
  HTML sources and `render_devtools.py`/`verify_pdf.py` are in the session scratchpad
  (`…/scratchpad/cheatsheets/`).
- **Uncommitted, pre-existing:** `.secrets.baseline` (adds the two un-audited entries: the Apple checksum and
  `backend/messaging/spring-boot-rabbitmq.adoc:50`, which is the documented `amqp://user:pass@host:port` URI
  pattern in a property table) and `node_modules/.package-lock.json` (never commit; restore after
  `npm run validate:mermaid`).
- **Precedents:** `.archive/implementation_plan_174.md` Group 4 (validation checklist and #170 comment);
  `.archive/implementation_plan_175.md` (cheat-sheet pipeline).

## Implementation steps

### Group 1: Small fixes from the #170 comments

Parallelizable: yes — three distinct files.

- [x] Task 1. Fix the broken inline code in `modules/ROOT/pages/apps/apple/ci-cd-xcode-cloud-and-command-line.adoc`
  — line 327 now reads `` `+chmod +x+` ``; verified in a local build (see Task 1.3).
  - [x] Task 1.1. Line 327: written as `` `+chmod +x+` `` (literal-passthrough form, the section's rule for inline
    code containing `+`, `*` or `_`), keeping `` `zsh` `` and `` `sudo` `` as plain inline code.
  - [x] Task 1.2. `grep -n '`[^`]*+[^`]*`' modules/ROOT/pages/apps/apple/*.adoc` re-run — the only genuinely broken
    span was line 327 (fixed above). The other matches it flags (`swiftui-state-and-data-flow.adoc:943`,
    `swiftui-lists-tables-and-collections.adoc:719,724`, `ui-tests-test-plans-and-coverage.adoc:291`) are regex
    false positives: the grep backtracks across two separate, already-correct `` `+…+` `` spans joined by a
    literal " + " in the text (e.g. `` `+.listStyle(_:)+` + `+.tag(_:)+` ``); no further edits needed.
  - [x] Task 1.3. Verified ahead of Task 8 by running `npx antora antora-playbook.yml` (0 errors) and inspecting
    `build/site/apps/apple/ci-cd-xcode-cloud-and-command-line.html` line 5104: renders
    `<code>chmod +x</code>`, no literal backticks in the paragraph. Will be re-confirmed as part of Task 8's
    full-site validation.
- [x] Task 2. Document the `SharedNoteAccess` / `--uitesting` decision in
  `modules/ROOT/pages/apps/apple/ui-tests-test-plans-and-coverage.adoc`
  - [x] Task 2.1. Added 3 sentences after the paragraph ending "launch *without* `--uitesting`." explaining the
    extension-process rationale and that extension-surface UI tests seed/clean the App Group store themselves
    (via the app, launched without `--uitesting`), with a link to the existing `launchArguments` reference; no
    admonition added. Verified in the built HTML (`ui-tests-test-plans-and-coverage.html` line 4784).
  - [x] Task 2.2. `grep -i uitesting widgets-and-controls.adoc app-intents-and-system-integration.adoc` — no
    matches in either file; nothing to contradict the new text.
- [x] Task 3. Audit `.secrets.baseline`
  - [x] Task 3.1. `swift-packages-and-modularization.adoc:472` entry marked `"is_secret": false` directly in the
    JSON (formatting preserved).
  - [x] Task 3.2. `backend/messaging/spring-boot-rabbitmq.adoc:50` entry marked `"is_secret": false` too.
  - [x] Task 3.3. `detect-secrets scan --baseline .secrets.baseline` (updates in place; only the two new
    `is_secret: false` fields and `generated_at` changed) then `detect-secrets audit --report .secrets.baseline`
    — every entry, including the two just marked, reports `"category": "VERIFIED_FALSE"`; no un-audited entries
    remain.

### Group 2: Per-page type-check of the Swift examples

Parallelizable: yes — one task per page batch; each task edits only the pages in its batch. A shared stub file is
built first inside each task from the canonical-names sheets (read-only inputs), so batches don't depend on each
other.

Harness (same for every task; all files under the session scratchpad `…/scratchpad/typecheck/`, never in the repo):

- Extract every `[source,swift]` block of a page in order (Python). Skip blocks that are self-labelled excerpts or
  sketches (a leading comment such as `// excerpt`, `// …`, `// updated: … only`, or containing `...`/`…` as code),
  and blocks whose first line is clearly a fragment (starts with a modifier chain `.foo(`, or is a bare expression
  in a list of options) — list every skipped block with its reason.
- Build `stubs.swift` declaring the FieldNotes types/APIs that the page uses but defines elsewhere, with the exact
  names and signatures from the canonical-names sheets (bodies `fatalError()`); never stub an Apple API.
- Concatenate the page's remaining blocks into one file per page (split into several files if blocks redeclare the
  same type deliberately, e.g. "before/after" versions), and type-check with
  `xcrun --sdk <sdk> swiftc -typecheck -swift-version 6 -target <triple> stubs.swift page.swift`, using
  `arm64-apple-ios27.0-simulator` (iphonesimulator) by default; `arm64-apple-macos27.0` for macOS/AppKit pages and
  `#if os(macOS)` code; `arm64-apple-watchos27.0-simulator` for watchOS; `arm64-apple-xros27.0-simulator` for
  visionOS/RealityKit. Pages with `#if os(...)` branches are checked on each platform they target. Add
  `-default-isolation MainActor` (or the equivalent upcoming-feature flag) where the page says the target uses
  main-actor default isolation.
- Classify each diagnostic: **doc error** (wrong/nonexistent Apple API, wrong signature or label, wrong type,
  wrong availability guard, Swift 6 strict-concurrency error the page's own configuration would hit, typo) →
  fix the page; **harness artefact** (missing stub, duplicate declaration across deliberate variants, fragment,
  third-party package such as gRPC not present) → adjust the harness or record as skipped. Never "fix" a page to
  silence a harness artefact.
- For each fix: keep FieldNotes names canonical, keep the example followed by its official link, update the page's
  `=== Platform availability` table and `== References` if an API changes, and check the same API isn't named
  differently on `cheat-sheet.adoc` or the cheat-sheet PDFs (record any PDF mismatch for Task 7).
- Record per page: blocks checked / skipped (with reasons) / doc errors fixed, in
  `…/scratchpad/typecheck/report-<batch>.md`.

- [x] Task 4. Type-check pages 1–12 (foundations, tooling, SwiftUI views/layout/state/lists) —
  203 blocks extracted, 147 checked, 56 skipped, 3 doc errors fixed (missing `import SwiftUI` in
  getting-started.adoc, missing `import Foundation` in language-interoperability.adoc, missing
  `nonisolated` on `NoteGroup` in swiftui-lists-tables-and-collections.adoc); no Task 7 mismatches;
  report at `…/scratchpad/typecheck/report-1.md`.
  - [x] Task 4.1. getting-started, xcode-projects-and-previews, swift-packages-and-modularization,
    app-structure-and-lifecycle, app-architecture, concurrency-in-apps.
  - [x] Task 4.2. multiplatform-projects (every platform it targets), language-interoperability (Swift blocks only;
    Objective-C/C++ blocks out of scope), swiftui-views-and-modifiers, swiftui-layout, swiftui-state-and-data-flow,
    swiftui-lists-tables-and-collections.
  - [x] Task 4.3. Fix doc errors found; write `report-1.md`.
- [x] Task 5. Type-check pages 13–30 (SwiftUI navigation → location) — ~300 blocks compiled, ~65
  skipped, 15 doc errors fixed across 10 pages (missing `@MainActor`/`nonisolated`/`@preconcurrency`
  annotations, a wrong `NoteList` call, a mistyped `@Query` property, a missing `@unknown default`,
  an ambiguous `LanguageModelSession` overload, etc.); the iOS-27.1-only `UIArrangementViewController`
  section in uikit-and-appkit-interop.adoc was investigated, confirmed to be a harness/SDK-version
  limitation (APIs absent from the local 27.0 SDK, not a doc error) and restored verbatim, recorded
  as skipped; no Task 7 mismatches; report at `…/scratchpad/typecheck/report-2.md`.
  - [x] Task 5.1. swiftui-navigation-and-presentation, swiftui-controls-forms-text-and-images,
    swiftui-drawing-animation-and-gestures, liquid-glass-and-the-design-system, uikit-and-appkit-interop (iOS and
    macOS), human-interface-guidelines, accessibility, localization.
  - [x] Task 5.2. swiftdata, core-data-cloudkit-and-icloud, preferences-files-and-documents, networking,
    background-execution, notifications-and-live-activities, widgets-and-controls (iOS and watchOS),
    app-intents-and-system-integration, apple-intelligence-and-machine-learning, location-and-maps.
  - [x] Task 5.3. Fix doc errors found; write `report-2.md`.
- [x] Task 6. Type-check pages 31–48 (devices → distribution) — ~180 blocks checked, ~34 skipped,
  5 doc errors fixed across 3 pages (missing `import SwiftUI` around `AuthorizationController` uses
  and on `PasskeySignInButton` in security-and-privacy.adoc; a nonexistent `SpatialTrackingSession`
  overload in augmented-reality.adoc rewritten to run `ARSession` directly; a redundant
  `HKWorkoutSessionDelegate` conformance and a non-Sendable `ClockKit` async-return fixed with
  `@preconcurrency import ClockKit` in watchos.adoc); pre-existing edits in
  ci-cd-xcode-cloud-and-command-line.adoc and ui-tests-test-plans-and-coverage.adoc preserved
  (verified via diff); no Task 7 mismatches (two harmless deprecation notices left as-is:
  `ASCredentialUpdater` deprecated in iOS 26.2, `PlaneAnchor.classification` renamed to
  `surfaceClassification` in visionOS 26); report at `…/scratchpad/typecheck/report-3.md`.
  - [x] Task 6.1. camera-media-and-photos, health-motion-and-accessories, security-and-privacy,
    storekit-in-app-purchases, augmented-reality (iOS and visionOS), ipados, macos (macOS), watchos (watchOS),
    visionos (visionOS).
  - [x] Task 6.2. testing-with-swift-testing (`import Testing`), ui-tests-test-plans-and-coverage (`import XCTest`
    in the UI-test bundle), debugging-with-xcode-and-lldb, logging-metrics-and-crash-reports,
    performance-and-instruments, signing-capabilities-and-configuration, app-store-connect-testflight-and-review,
    macos-distribution-outside-the-app-store, ci-cd-xcode-cloud-and-command-line (Swift blocks only).
  - [x] Task 6.3. Fix doc errors found; write `report-3.md`.

### Group 3: Cheat-sheet consistency

Parallelizable: yes (single task). Depends on Group 2's fixes.

- [x] Task 7. No PDF change needed. Checked `git diff -- modules/ROOT/pages/apps/apple` for every API Group 2
  touched (`NoteList(notebookID:selection:)`, `SectionedResults`/`ForEach(notes)`, `List(notes, id: \.objectID)`,
  `SharedNoteAccess.pinnedNotesWidgetKind`, `PinnedNotesProvider.recommendations()`, `SiriNoteEntity.init(_:)`,
  `LanguageModelSession(model:tools:instructions:)`, `ARSession`/`SpatialTrackingSession` (`TableFinder`),
  `HKWorkoutSessionDelegate`, `ClockKit`, `AuthorizationController`, `accessibilityAdjustableAction`, plus the
  `@MainActor`/`nonisolated`/`@preconcurrency` annotations) and extracted text from `cheat-sheet.adoc` and all
  three PDFs (`apple-{swiftui,frameworks,platforms}-cheat-sheet.pdf`) via PyMuPDF. None of the renamed/re-signed
  identifiers appear anywhere in `cheat-sheet.adoc` (confirmed also via `git diff`/`git status`, which shows it
  untouched) or in the PDFs; the only PDF hits were two generic, unrelated glossary entries in
  `apple-frameworks-cheat-sheet.pdf` (`@MainActor : default actor isolation for unannotated code` and
  `@concurrent : leaves the main actor for a nonisolated async function`), which describe the annotations in the
  abstract and don't reference any of Group 2's specific renamed signatures.

### Group 4: Final validation, #170 comment and commit

Parallelizable: no — each task depends on the previous one.

- [x] Task 8. Validation
  - [x] Task 8.1. `npx antora antora-playbook.yml`: 0 errors, 0 warnings.
  - [x] Task 8.2. Built `build/site/apps/apple/*.html`: no literal backticks outside `<code>`, no raw `xref:`,
    no `include::`, every relative href/anchor resolves, all images and the three PDFs present.
  - [x] Task 8.3. `npm run validate:mermaid` passes (back up `node_modules/.package-lock.json` first with `cp` and
    restore it afterwards — it carries unrelated local changes).
  - [x] Task 8.4. No admonitions under `apps/apple` except the disclaimer include.
  - [x] Task 8.5. Delegate a secret scan to the `iru-gate-runner` agent
    (`Agent({description: "Secret scan for #170", subagent_type: "iru-gate-runner", prompt: "Invoke
    Skill({skill: \"iru-check-security\"}) and report new or un-audited findings"})`); expect none after Task 3.
- [x] Task 9. Post a comment on #170 — "Final review" — listing: the validation results per issue (#170, #172–#175
  all PASS), the resolution of each deferred item from the #170 comments (forward xrefs, Mermaid, SVGs, secrets
  baseline, rendering rules, the `chmod +x` fix, the `SharedNoteAccess` decision, the type-check results with
  per-batch counts and every doc error fixed, the fact-checks done), and anything still unverified with its
  reason. Build it from the three `report-*.md` files and this plan.
- [x] Task 10. Commit on `feature/170`: messages starting `Apple Platforms final review (#170):`; stage by name
  (pages, `.secrets.baseline`, any changed PDF); never stage `node_modules/`, `build/` or scratch files; review
  `git status` before committing. Do not push (the `iru-issue` flow pushes and opens the PR).
