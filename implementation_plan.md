# Implementation Plan: Apple Platforms, part 2: data, networking, system integration, intelligence, devices, security and commerce

## Task summary

Source: GitHub issue #173
Base branch: feature/170

Issue [#173](https://github.com/albertoirurueta/docs/issues/173) asks for **pages 21–35** of the *Apple Platforms
(iOS, iPadOS, macOS, watchOS, visionOS)* section, in `modules/ROOT/pages/apps/apple/`:

- 21–24: data and networking;
- 25–28: background work and system integration;
- 29–32: Apple Intelligence, machine learning and device capabilities;
- 33–35: security, commerce and AR.

Every page follows the section rules in #170:

- the only admonition is the `apple-disclaimer` include;
- `:description:` and `:keywords:`;
- a Swift example for every concept or API the page names, each followed by a link to the official Apple page;
- the 📊 figures listed in #173;
- a **platform-availability table** on every page, in plain AsciiDoc (never an admonition);
- `== References` last.

The examples extend the FieldNotes app that part 1 (#172, merged into `feature/170`) defined. This work is on
`feature/173`, and its PR targets `feature/170`.

**Decisions taken with the user** (use best practices; forward links are checked on #170; add what's needed):

1. **SwiftData alongside the value model, not instead of it.** Part 1's `Note`/`Notebook` are `Sendable` value
   types used by every page. Turning them into `@Model` classes would break part 1, and it would also mix
   persistence with the UI model.
   - Best practice for a layered SwiftUI app is a persistence layer in `FieldNotesServices`: `@Model` records that
     map to and from the value types, reached through a `NotePersisting` protocol implemented by a `@ModelActor`.
   - Page 21 also shows the simpler "`@Model` straight in the views with `@Query`" style for small apps, and
     states the trade-off.
   - Recorded on #170.
2. **Forward links stay as real `xref:`s.** Links to pages 36–48 (#174) and to `cheat-sheet.adoc` (#175) are
   intentional. #170's final review re-checks them, and this is recorded on #170.
3. **Swift examples are not compiled here**, because the container has no Xcode. Each is checked against Apple's
   documentation JSON. When an example needs an entitlement, a paid account or a physical device, the page says so
   in a plain sentence, not an admonition, and #170 lists these for the local run.
4. **Additions this plan brings** (under "add what's needed"):
   - a canonical names sheet, to avoid the drift #178's review found;
   - a mandatory consistency pass;
   - reciprocal cross-links from the existing Couchbase, React Native and messaging pages;
   - the landing page's bibliography extended with pages 21–35's sources;
   - a comment on #170 listing the unverified facts;
   - a small, backward-compatible extension to `Note` for location and photo attachments (below).

## Current code state

- **Section files from part 1 (on `feature/170`):**
  - pages 1–20 and `index.adoc` in `modules/ROOT/pages/apps/apple/`;
  - `modules/ROOT/partials/apple-disclaimer.adoc`;
  - 9 `modules/ROOT/images/apple-*.svg`;
  - `nav.adoc` already lists pages 21–35, with their titles from #173;
  - `index.adoc` § *What's covered* already lists them, and its `== Bibliography` covers only pages 1–20 so far.
- **Links into pages 21–35 from part 1:** 50 `xref:`s already point at them. All are file-level, with no anchors,
  so the slugs are fixed and headings are free. Once these pages exist, the build's forward-link errors drop to
  pages 36–48 and the cheat sheet only.
- **FieldNotes as defined by part 1** (after #178's fixes):
  - `FieldNotesModel` (`app-architecture.adoc`):
    - `public struct Note: Identifiable, Hashable, Sendable`, with `id, title, body, createdAt, notebookID, tags,
      isPinned` and a public memberwise-style `init` with defaults;
    - `public struct Notebook`, with `id, name, symbolName`;
    - `public enum NoteSortOrder`, with `newestFirst, oldestFirst, title` and a `LocalizedStringResource` title
      (`localization.adoc`).
  - `FieldNotesServices`:
    - `@Observable @MainActor public final class NoteStore`, with
      `init(notes: = [], notebooks: = [], syncer: any NoteSyncing = NoOpNoteSyncer())` and
      `add/delete/togglePin/refresh()`;
    - `public protocol NoteSyncing: Sendable { func sync() async throws }`, with `NoOpNoteSyncer` and
      `CloudNoteSyncer`;
    - `public protocol SummaryGenerating { func summary(for: Note) async throws -> String }`.
  - `FieldNotesUI`: `NoteRow`, `TagChip(_:isSelected:)` + `TagChipStyle`, `CaptureButton(action:)`, `SettingsView`,
    `TagEditor`.
  - App target: `FieldNotesApp` (with `Settings`, `MenuBarExtra` and `ImmersiveSpace(id: "map")`), `ContentView`,
    `NoteList(notebookID:selection:)`, `NoteDetail(note:)`, `NoteEditor(noteID:)`; watch app `WatchNoteList`.
  - Identifiers:
    - App Group `group.com.example.fieldnotes`;
    - bundle prefix `com.example.fieldnotes`;
    - deep links `fieldnotes://note/<uuid>` and `https://fieldnotes.example.com/note/<uuid>`;
    - `@AppStorage("noteSortOrder")`.
- **Specs:** #173's issue text, with a per-page scope, sub-concepts, 📊 figures and verified links, copied to
  `/tmp/claude-0/-home-user-docs/e2258b98-0a71-58e0-8d77-2095994c46ac/scratchpad/issues/sub2.md`. The URL pitfalls
  it lists apply (`clmonitor-2r51v`, `clservicesession-2ddhd`, the moved `usernotificationsui`/`photokit`/
  `foundation` articles).
- **Page brief for writers:**
  `/tmp/claude-0/-home-user-docs/e2258b98-0a71-58e0-8d77-2095994c46ac/scratchpad/apple-page-brief.md`. It covers
  the rules, templates, slug list and report format; Task 1 updates it for part 2.
- **Existing pages to link, not duplicate** (all confirmed to exist):
  - `backend/oauth/native-and-mobile-apps.adoc`, which already links pages 28 and 33;
  - `database/couchbase/sdks-and-mobile.adoc` § `== Couchbase Mobile`;
  - `backend/messaging/index.adoc`;
  - `apps/react-native/storage-and-offline.adoc` § *Choosing a Storage Mechanism*;
  - `apps/react-native/security.adoc` § *Secure Storage*;
  - Swift `codable-and-serialization.adoc`, `foundation-essentials.adoc`, `macros.adoc`,
    `async-await-and-tasks.adoc`, `actors-isolation-and-sendable.adoc`.
- **Tooling:**
  - `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid`. This rewrites the tracked
    `node_modules/.package-lock.json`, so restore it afterwards with
    `git checkout -- node_modules/.package-lock.json`.
  - `npx antora antora-playbook.yml`.
  - `detect-secrets`, which is installed.

## Canonical FieldNotes additions for part 2 (every page writer must use these exact names)

These extend part 1 without breaking it. A page that needs a type from this list uses it with this name, module and
shape. A page may add small local helpers, but never a second definition of a listed type.

- **Model extension** (`FieldNotesModel`, introduced on page 21; additive, so part 1's `Note(...)` calls still
  compile):
  - `public struct NoteLocation: Hashable, Sendable, Codable { public var latitude: Double; public var longitude: Double; public var placeName: String? }`
  - `public struct PhotoAttachment: Identifiable, Hashable, Sendable { public var id: UUID; public var fileName: String }`
    (the image data lives in SwiftData external storage).
  - Two new `Note` properties with defaults: `public var location: NoteLocation? = nil` and
    `public var attachments: [PhotoAttachment] = []`. The `init` gains matching defaulted parameters at the end.
- **Persistence** (`FieldNotesServices/Persistence/`, page 21):
  - `@Model final class NoteRecord` (`@Attribute(.unique) var id: UUID`, title, body, createdAt, tags, isPinned,
    latitude/longitude/placeName, `@Relationship var notebook: NotebookRecord?`,
    `@Relationship(deleteRule: .cascade) var photos: [PhotoRecord]`) and `@Model final class NotebookRecord`.
  - `@Model final class PhotoRecord` (`@Attribute(.externalStorage) var data: Data`).
  - Mapping: `NoteRecord.init(_ note: Note)`, `func update(from note: Note)`, `var note: Note { get }`.
  - Schema: `enum FieldNotesSchemaV1: VersionedSchema`, `enum FieldNotesSchemaV2: VersionedSchema` (adds location),
    `enum FieldNotesMigrationPlan: SchemaMigrationPlan`.
  - `public protocol NotePersisting: Sendable { func fetchNotes() async throws -> [Note]; func save(_ note: Note) async throws; func deleteNote(id: Note.ID) async throws }`
  - `@ModelActor actor SwiftDataNotePersistence: NotePersisting`.
  - `extension ModelContainer { static func fieldNotes(inMemory: Bool = false) throws -> ModelContainer }`: the
    App Group store with CloudKit container `iCloud.com.example.fieldnotes`.
  - `NoteStore` gains `public init(..., persistence: (any NotePersisting)? = nil)`, keeping the existing defaults,
    plus `func load() async`. A `NotePersisting` save happens in `add`/`delete`/`togglePin`.
- **Preferences, files and documents** (page 23):
  - `extension UserDefaults { static let fieldNotesShared = UserDefaults(suiteName: "group.com.example.fieldnotes")! }`
  - `struct NotebookExportDocument` (`ReadableDocument`/`WritableDocument`, new in 27, with a `FileDocument` variant
    for 26) and the UTType `com.example.fieldnotes.notebook` (`.fieldnotes`).
- **Networking** (page 24):
  - `actor NotesAPIClient` with base URL `https://api.fieldnotes.example.com` and `struct RemoteNote: Codable`;
  - `final class AttachmentDownloader` for the background session, with identifier
    `com.example.fieldnotes.attachments`;
  - `@Observable final class ConnectivityMonitor` (`NWPathMonitor`).
- **Background** (page 25): task identifiers `com.example.fieldnotes.refresh` (app refresh),
  `com.example.fieldnotes.reindex` (processing) and `com.example.fieldnotes.export` (continued processing).
- **Notifications and Live Activities** (page 26):
  - `NoteReminderScheduler` (category `NOTE_REMINDER`, actions `MARK_DONE`/`SNOOZE`);
  - Notification Service Extension target `FieldNotesNotificationService`;
  - `struct FieldTripAttributes: ActivityAttributes` (`ContentState`: `notesCaptured: Int`, `lastPlaceName: String?`);
  - `FieldTripLiveActivity` in `FieldNotesWidgets`.
- **Widgets and controls** (page 27): in the `FieldNotesWidgets` target:
  - `PinnedNotesWidget` with `PinnedNotesProvider: AppIntentTimelineProvider` and `PinnedNotesEntry`;
  - `QuickCaptureControl: ControlWidget`;
  - `FieldNotesWidgetBundle`.
- **App Intents and system integration** (page 28):
  - `struct NoteEntity: AppEntity, IndexedEntity` and `struct NoteEntityQuery: EntityQuery`;
  - `OpenNoteIntent`, `CreateNoteIntent`, `TogglePinIntent`;
  - `struct FieldNotesShortcuts: AppShortcutsProvider`;
  - deep links reuse `fieldnotes://note/<uuid>` and `fieldnotes.example.com`;
  - share extension target `FieldNotesShareExtension`.
- **Apple Intelligence** (page 29):
  - `FoundationModelSummaryGenerator: SummaryGenerating`;
  - `@Generable struct NoteSummary { @Guide(...) var headline: String; var keyPoints: [String] }`;
  - `struct TagSuggestionTool: Tool`.
- **Location and maps** (page 30): `@Observable @MainActor final class LocationService` (`CLLocationUpdate.liveUpdates`,
  `CLServiceSession`) and `NotesMapView`.
- **Camera, media and photos** (page 31): `NotePhotoPicker` (`PhotosPicker`), `CameraCaptureModel`,
  `AttachmentThumbnail`.
- **Health, motion and accessories** (page 32): `FieldTripWorkoutSession` (HealthKit), `StepCounter` (`CMPedometer`),
  `FieldSensorScanner` (Core Bluetooth), `NFCNoteTagReader`.
- **Security and privacy** (page 33): `KeychainStore` (service `com.example.fieldnotes.auth`), `AccountManager`
  (Sign in with Apple and passkeys, relying party `fieldnotes.example.com`), `BiometricLock`.
- **StoreKit** (page 34): `@Observable @MainActor final class StoreManager`, with product IDs
  `com.example.fieldnotes.pro.monthly` and `com.example.fieldnotes.pro.yearly` ("FieldNotes Pro"), and
  `Products.storekit` for local testing.
- **AR** (page 35): `NotePinComponent: Component`, `NotePinSystem: System`, `FieldNotesARView` (iOS `RealityView`) and
  `NotesMapSpace` (the visionOS immersive space part 1 declared).

## Implementation steps

### Group 1: Page-writer brief for part 2

Parallelizable: yes (one task).

- [x] Task 1. Update the page brief `.../scratchpad/apple-page-brief.md` for part 2
  - [x] Task 1.1. Point it to `sub2.md` (pages 21–35) and this plan's "Canonical FieldNotes additions".
  - [x] Task 1.2. Add the lessons from #178's review as hard rules:
    - use the canonical names only, and never redefine a part 1 or part 2 type;
    - guard every API with limited platform availability (`#if os(...)` / `#available`);
    - inject `NoteStore` wherever a view reads it;
    - `// swift-tools-version:` goes first in any `Package.swift`;
    - use a stable identity in `ForEach`.
  - [x] Task 1.3. Add the part 2 hard requirements:
    - a `=== Platform availability` table on every page;
    - a plain-sentence "Needs: entitlement / paid account / device" note where an example needs one;
    - a report section listing unverified claims.

### Group 2: Pages 21–35

Parallelizable: yes. Each page is a new file with its own `apple-*.svg` names, and every shared type comes from the
canonical sheet, not from another page. Page writers run as parallel agents, two or three pages each, grouped by
topic so related pages share a writer: 21–22, 23–24, 25–26, 27–28, 29–30, 31–32, 33–35.

**Per-page checklist.** It is the same as part 1's, plus:
- the platform-availability table;
- "needs" sentences where an example needs an entitlement, a paid account or a device;
- the forward links allowed by decision 2.

The scope, sub-concepts, 📊 figures and links for each page are in `sub2.md` under the same page number, and all of
them must be covered.

- [ ] Task 2. `apps/apple/swiftdata.adoc`: *Persisting Models with SwiftData*
  - [ ] Task 2.1. Content:
    - the `NoteRecord`/`NotebookRecord`/`PhotoRecord` models, attributes and relationships, `#Unique`/`#Index`,
      and inheritance;
    - `ModelContainer.fieldNotes(inMemory:)` in the App Group with CloudKit, `ModelContext`, and undo;
    - `@Query` with `#Predicate`/`SortDescriptor`, plus sectioned queries (27);
    - `FieldNotesSchemaV1` → `V2` with `FieldNotesMigrationPlan`;
    - `SwiftDataNotePersistence` as a `@ModelActor`, passing `PersistentIdentifier`s;
    - the mapping to and from the `Note` value type, with the rationale of decision 1;
    - the "`@Model` in views" alternative for small apps;
    - persistent history, and `ResultsObserver`/`HistoryObserver` (27);
    - the rule that only the main app migrates.
  - [ ] Task 2.2. Figures:
    - Mermaid class diagram: container → context → records → `@Query`, and the `NotePersisting` layer;
    - Mermaid migration stages;
    - `apple-swiftdata-app-group.svg`.
- [ ] Task 3. `apps/apple/core-data-cloudkit-and-icloud.adoc`: *Core Data, CloudKit and iCloud*
  - Content:
    - the Core Data stack (for a legacy "FieldNotes 1.x" store);
    - `NSPersistentCloudKitContainer` with private/shared/public databases and `CKShare` sharing of a notebook;
    - CloudKit directly, including what `CloudNoteSyncer` does;
    - `NSUbiquitousKeyValueStore`, capabilities, and migrating Core Data to SwiftData;
    - a link to Couchbase Lite.
  - Figures: 📊 a Mermaid sync-flow diagram and a decision tree.
- [x] Task 4. `apps/apple/preferences-files-and-documents.adoc`: *Preferences, Files and Document-Based Apps*
  - Content:
    - `UserDefaults.fieldNotesShared`, `@AppStorage("noteSortOrder")` and `@SceneStorage`;
    - the sandbox layout, App Group containers and backup exclusion;
    - file coordination;
    - Codable export: link the Swift page, don't repeat it;
    - `NotebookExportDocument` with `DocumentGroup`/`ReadableDocument`/`WritableDocument` (27) and a 26 fallback;
    - `fileImporter`/`fileExporter` and the UTType declaration.
  - Figure: 📊 `apple-sandbox-containers.svg`.
- [x] Task 5. `apps/apple/networking.adoc`: *Networking: URLSession, Network Framework and ATS*
  - Content:
    - `NotesAPIClient` with the async `data`/`bytes`, `RemoteNote` decoding, and errors and retries with
      cancellation;
    - `AttachmentDownloader` background session and relaunch;
    - `ConnectivityMonitor`;
    - `NetworkConnection` (26) plus a legacy note;
    - ATS exceptions;
    - pinning, linked to page 33;
    - a gRPC pointer.
  - Figure: 📊 Mermaid background-download sequence.
- [ ] Task 6. `apps/apple/background-execution.adoc`: *Background Execution*
  - Content:
    - the suspension model;
    - the `BGTaskScheduler` identifiers above, `BGAppRefreshTask`/`BGProcessingTask`/`BGContinuedProcessingTask`
      (26) for export;
    - `.backgroundTask(.appRefresh)`/`.urlSession`, and background modes with Info.plist;
    - `LongRunningIntent` (27);
    - a watchOS `WKExtendedRuntimeSession` note with a forward link to page 38;
    - debugging with `_simulateLaunchForTaskWithIdentifier`.
  - Figures: 📊 Mermaid decision tree and state diagram.
- [ ] Task 7. `apps/apple/notifications-and-live-activities.adoc`: *Notifications, APNs and Live Activities*
  - Content:
    - `NoteReminderScheduler` (permission, triggers, categories and actions, delegate);
    - APNs registration and payload JSON, token auth, and a link to `backend/messaging` for the provider side;
    - the `FieldNotesNotificationService` extension;
    - a content extension;
    - Live Activities: `FieldTripAttributes`, the Dynamic Island and Lock Screen, push updates, broadcast,
      `LiveActivityIntent`, `isDynamicIslandLimitedInWidth` (27) and the `.small` family.
  - Figures: 📊 Mermaid APNs sequence and `apple-live-activity-surfaces.svg`.
- [ ] Task 8. `apps/apple/widgets-and-controls.adoc`: *Widgets, Complications and Controls (WidgetKit)*
  - Content:
    - `FieldNotesWidgetBundle`, `PinnedNotesWidget` with its provider, reload budget, families and interactivity
      through `TogglePinIntent`;
    - `WidgetPushHandler` (26);
    - `QuickCaptureControl`;
    - watch complications and relevance, visionOS widgets and accented rendering, with forward links to pages 38
      and 39;
    - App Group data and previews.
  - Figures: 📊 Mermaid timeline flow and a family × surface × OS table.
- [ ] Task 9. `apps/apple/app-intents-and-system-integration.adoc`: *App Intents, Siri, Shortcuts, Spotlight, Deep Links and Extensions*
  - Content:
    - `NoteEntity`/`NoteEntityQuery`, `OpenNoteIntent`/`CreateNoteIntent`/`TogglePinIntent` and
      `FieldNotesShortcuts`;
    - `IndexedEntity` and Spotlight, visual intelligence, and app schema domains;
    - the 27 additions, AppIntentsTesting, and a forward link to page 40;
    - universal links: an AASA JSON for `fieldnotes.example.com`, `onOpenURL` and `NSUserActivity`;
    - App Groups and `FieldNotesShareExtension` with `ShareLink`.
  - Figures: 📊 Mermaid intent-to-surfaces diagram and link-resolution sequence.
- [x] Task 10. `apps/apple/apple-intelligence-and-machine-learning.adoc`: *Apple Intelligence and Machine Learning*
  - Content:
    - `FoundationModelSummaryGenerator` (availability check, session, streaming, `NoteSummary` guided generation,
      `TagSuggestionTool`, context window, guardrails);
    - the 27 additions (PCC with its entitlement, multimodal, `SpotlightSearchTool`);
    - Core AI and Evaluations;
    - Core ML and Create ML, Vision (`RecognizeDocumentsRequest`), VisionKit, Natural Language, Speech and
      Translation;
    - Writing Tools and Image Playground;
    - prompt-injection risks.
  - Figures: 📊 Mermaid approach chooser and tool-calling sequence.
- [x] Task 11. `apps/apple/location-and-maps.adoc`: *Location and Maps*
  - Content:
    - usage strings and the permission flow;
    - `LocationService` (`CLServiceSession`, `liveUpdates`, `CLMonitor` geofence per notebook,
      `CLBackgroundActivitySession`), writing `NoteLocation`;
    - `NotesMapView` (`Map`, `Marker`, camera, `MKMapItem`, Look Around, `MKGeocodingRequest` 26).
  - Figure: 📊 Mermaid permission flow.
- [ ] Task 12. `apps/apple/camera-media-and-photos.adoc`: *Camera, Media and Photos*
  - Content:
    - `NotePhotoPicker` with `PhotosPicker` and no permission needed, saving `PhotoAttachment`/`PhotoRecord`;
    - PhotoKit full access;
    - `CameraCaptureModel` (`AVCaptureSession`, `AVCapturePhotoOutput`, the AVCam 27 patterns);
    - `VideoPlayer` and audio session;
    - Now Playing (27);
    - an iOS ARKit pointer to page 35.
  - Figure: 📊 Mermaid capture pipeline.
- [ ] Task 13. `apps/apple/health-motion-and-accessories.adoc`: *Health, Motion and Accessories*
  - Content:
    - HealthKit authorization and `FieldTripWorkoutSession` (iPhone since 26, zones in 27), with a forward link
      to page 38;
    - `StepCounter`;
    - a HomeKit mention;
    - `FieldSensorScanner` (Core Bluetooth) and AccessorySetupKit;
    - `NFCNoteTagReader`.
  - Figure: 📊 framework × platform table.
- [ ] Task 14. `apps/apple/security-and-privacy.adoc`: *Security and Privacy*
  - Content:
    - `KeychainStore` (add, query, update, delete; accessibility classes; access group for the App Group apps);
    - `BiometricLock` (LocalAuthentication, Keychain access control);
    - CryptoKit (hash, HPKE, Secure Enclave key);
    - `AccountManager` (Sign in with Apple, passkey registration and assertion against `fieldnotes.example.com`);
      link the OAuth page for the protocol;
    - entitlements and sandbox, with a forward link to page 45;
    - `PrivacyInfo.xcprivacy` with required-reason APIs;
    - ATT;
    - App Attest;
    - Trust Insights (27).
  - Figures: 📊 Mermaid passkey sequence and protection-class flowchart.
- [ ] Task 15. `apps/apple/storekit-in-app-purchases.adoc`: *In-App Purchases and Subscriptions with StoreKit 2*
  - Content:
    - `StoreManager` (products, purchase, verification, the `Transaction.updates` listener started at launch,
      entitlements, `AppStore.sync()`);
    - `SubscriptionStoreView` for FieldNotes Pro;
    - `Products.storekit` testing;
    - the 2026 commitment plans;
    - a forward link to page 46 for review rules.
  - Figure: 📊 Mermaid purchase sequence.
- [ ] Task 16. `apps/apple/augmented-reality.adoc`: *Augmented Reality with ARKit and RealityKit*
  - Content:
    - RealityKit's ECS with `NotePinComponent`/`NotePinSystem`;
    - `FieldNotesARView` on iOS (world tracking, planes, anchors);
    - visionOS `ARKitSession` providers in `NotesMapSpace` (Full Space);
    - Reality Composer Pro;
    - a forward link to page 39.
  - Figure: 📊 Mermaid ECS class diagram.

### Group 3: Section wiring and reciprocal links

Parallelizable: yes. Each task edits a different file. This group runs after Group 2, because the bibliography
collects the URLs the pages actually use.

- [ ] Task 17. `apps/apple/index.adoc` § `== Bibliography`: add every official URL used by pages 21–35 that isn't
  already listed.
  - Merge them into the existing groups: Apple Developer Documentation (one bullet per framework, with subpages
    inline), Apple tutorials, sample code and release notes, and WWDC sessions by year.
  - Keep the closing plain paragraph saying #175 completes the books and the remaining groups.
- [x] Task 18. `apps/apple/index.adoc` § *The FieldNotes app*: add one sentence on what part 2 adds: persistence
  and sync, widgets and a Live Activity, App Intents, on-device summaries, location and photos, Keychain/passkey
  sign-in, and FieldNotes Pro.
- [x] Task 19. `database/couchbase/sdks-and-mobile.adoc` § `== Couchbase Mobile`: add one sentence linking
  `xref:apps/apple/core-data-cloudkit-and-icloud.adoc[…]` and `xref:apps/apple/swiftdata.adoc[…]` as Apple's
  first-party alternatives on Apple platforms.
- [x] Task 20. `apps/react-native/storage-and-offline.adoc` § *Choosing a Storage Mechanism* and
  `apps/react-native/security.adoc` § *Secure Storage*: add one sentence each pointing to the native pages
  (`swiftdata`, `preferences-files-and-documents` and `security-and-privacy`).
- [x] Task 21. `backend/messaging/index.adoc`: add one sentence in its related or overview section linking
  `xref:apps/apple/notifications-and-live-activities.adoc[…]`, for delivering push to Apple devices through APNs.

### Group 4: Consistency pass, validation, #170 comment and commit

Parallelizable: no. Each task depends on the one before it.

- [ ] Task 22. Consistency pass over pages 21–35, and any part 1 page they touch:
  - [ ] Task 22.1. Grep every canonical name from the sheet (`NoteRecord`, `NotePersisting`, `NoteEntity`,
    `KeychainStore`, `StoreManager`, `LocationService`, `FieldTripAttributes`, and so on) for conflicting
    definitions. There must be exactly one `struct`/`class`/`enum`/`actor`/`protocol` definition per name, or
    explicitly labelled revisions of it.
  - [ ] Task 22.2. Check that part 1 types are only used, never redefined, with part 1's signatures:
    - `NoteStore(...)`, including the new `persistence:` parameter where used;
    - `NoteEditor(noteID:)`, `NoteList(notebookID:selection:)`, `TagChip(_:)`, `CaptureButton(action:)`;
    - `NoteSortOrder`.
  - [ ] Task 22.3. Check that views reading `@Environment(NoteStore.self)` get it injected in scene or preview
    code.
  - [ ] Task 22.4. Check platform guards:
    - `ActivityKit`, `BackgroundTasks`, `HealthKit`, `NFC`, `ARKit` and `VisionKit` usages sit behind `#if os(...)`
      or `canImport` where the page's target includes platforms without them;
    - 27-only APIs are behind `#available`.
  - [ ] Task 22.5. Check that every `Package.swift` starts with `// swift-tools-version: 6.4`.
  - [ ] Task 22.6. Fix everything found.
- [ ] Task 23. Validation:
  - [ ] Task 23.1. No admonitions under `apps/apple` except the disclaimer include.
  - [ ] Task 23.2. Every new page has `:description:`, `:keywords:`, the disclaimer, a `=== Platform availability`
    table and `== References`.
  - [ ] Task 23.3. Every example block is followed by an official link. Use the same script as #172; any exception
    must be a deliberate one (the first half of a two-block example, a directory tree, a "don't do this" example).
  - [ ] Task 23.4. `npm run validate:mermaid` passes, then restore `node_modules/.package-lock.json`.
  - [ ] Task 23.5. Every new `apple-*.svg` is well-formed XML.
  - [ ] Task 23.6. Antora build:
    - 0 warnings;
    - every remaining `xref` error targets a page from 36–48 or `cheat-sheet.adoc`;
    - no error targets pages 1–35;
    - record the count.
  - [ ] Task 23.7. Run `detect-secrets` over the changed files and triage any finding.
- [ ] Task 24. Post a comment on #170 listing the unverified claims and API shapes the page writers reported,
  grouped by page, plus the final forward-link count.
- [ ] Task 25. Commit on `feature/173` with a message starting `Apple Platforms part 2:`, reviewing `git status` and
  excluding `build/` and `node_modules/`, then push.
