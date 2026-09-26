# Implementation Plan: Guides & References / Apps — Android

## Task summary

Source: GitHub issue #169
Base branch: main

Issue [#169](https://github.com/albertoirurueta/docs/issues/169) asks for a new **Android** section under
*Guides & References → Apps*, a sibling of the existing Apple Platforms and React Native guides, authored
directly into this repo's own `ROOT` Antora component (this repo has no application source code — it *is* the
Antora playbook + root component, per `CLAUDE.md`). Concretely:

1. **42 new AsciiDoc pages** under `modules/ROOT/pages/apps/android/`: a landing `index.adoc` (rewriting the
   existing stub, which today only links the Kotlin Reference), **40 concept pages**, and a `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/android-disclaimer.adoc` — the **only** admonition anywhere in
   the section, stating only that the content was generated with AI assistance and pointing to the section
   bibliography (matching `vector-rag-disclaimer.adoc`, and unlike `oauth-disclaimer.adoc`/
   `springboot-disclaimer.adoc`, which carry extra warnings). The version baseline (Android 17/API 37,
   AGP 9.4, Kotlin 2.4.20, Compose BOM 2026.09.00, Navigation 3 1.2) goes in ordinary prose on `index.adoc` and
   each page's intro, never inside an admonition.
3. **One running example app, TrailMate**, built in two versions (classic Views/Fragments/Activities, and
   modern Compose) and reused across almost every page — see *Current code state* below for its full shape.
   Pages 37–40 (build/sign/publish/CI) use the real `com.irurueta:irurueta-android-glutils` library instead.
4. **Site wiring**: rewrite the Android bullet in `modules/ROOT/pages/apps/index.adoc`, append 41 new nav
   entries under the existing `*** xref:apps/android/index.adoc[Android]` block in `modules/ROOT/nav.adoc`
   (after the existing `include::partial$nav-kotlin.adoc[]` include, which stays untouched).
5. **Reciprocal cross-links** added to `programming-languages/kotlin/kotlin-for-android.adoc`,
   `apps/react-native/index.adoc`, `apps/react-native/building-and-publishing.adoc`, `apps/apple/index.adoc`,
   and `programming-languages/javascript/browser-canvas-webgl.adoc`.
6. **One new cheat-sheet PDF**: `modules/ROOT/attachments/android-cheat-sheet.pdf`, exactly one A4 page,
   rendered from a print-ready HTML/CSS layout via headless Chrome, visually consistent with
   `kotlin-cheat-sheet.pdf` / `react-native-cheat-sheet.pdf`.
7. Figures live under `modules/ROOT/images/` named `android-*.svg`, and every `[mermaid]` block must pass
   `npm run validate:mermaid` before the final build task.
8. **Book cross-check**: the landing page's `== Books and official sources compared` section and part of its
   `== Bibliography` are built from six PDF books that live only at `~/Desktop/android1.pdf` … `android6.pdf`
   on this machine — they are read locally for reference and **never** copied into the repository, and no page
   quotes them directly. Their identification and the concept×book matrix are already fully worked out in
   issue #169's body and reproduced below so no task needs to re-read the PDFs from scratch; a task may still
   open a specific book locally to confirm a detail.
9. **No language/framework key applies.** This repository's installed `*-code-one-task` skills are
   `iru-java-code-one-task`, `iru-dotnet-code-one-task`, `iru-java-springboot-code-one-task` and
   `iru-database-code-one-task` — none matches "AsciiDoc documentation" or "Android app code" (the pages
   *document* Kotlin/Compose/Gradle, they don't contain a buildable Android project). Every task below is
   therefore **untagged**, matching the precedent in `.archive/implementation_plan_187.md` (Vector Databases &
   RAG): each task authors AsciiDoc/SVG/PDF content directly.

The full version baseline, book identification, concept×book matrix, and per-page coverage/sources/figures used
below were produced from live research (developer.android.com, Google/Maven Central metadata, GitHub releases,
and the six books' front matter) on 2026-09-26, and were already reviewed by the user as issue #169's body —
this plan does not re-derive them, it operationalizes them into file-level tasks.

## Current code state

This repository has no application source code; "current code state" here means the existing Antora content
this new section must fit into.

- **`modules/ROOT/pages/apps/`**: `index.adoc` (the Apps landing page, lists Android/Apple/React Native
  bullets), `android/index.adoc` (a 15-line stub that only links the Kotlin Reference — **this file is
  rewritten, not appended to**), `apple/*` (48 pages + cheat-sheet, the closest structural precedent, esp.
  `apple/index.adoc`'s *How Apple app development got here* / *New here? Read in this order* / *The FieldNotes
  app* / *What's covered* / `== Bibliography` structure, and `apple/app-architecture.adoc` for the level of
  code-example detail and Mermaid class-diagram style expected), `react-native/*` (29 pages + cheat-sheet, the
  closest precedent for cheat-sheet-page structure and its PDF).
- **`modules/ROOT/pages/programming-languages/kotlin/*`** (29 pages + `cheat-sheet.adoc`): covers the Kotlin
  language, including `kotlin-for-android.adoc` (Android KTX, Jetpack pointers, `viewModelScope`/
  `lifecycleScope`), `coroutines-basics.adoc`, `coroutine-context-cancellation-and-exceptions.adoc`,
  `flows.adoc`, `build-and-tooling.adoc`, `testing.adoc`. **Every page in this directory carries
  `:page-aliases: apps/android/kotlin/<file>.adoc`** (confirmed by `grep -n page-aliases
  modules/ROOT/pages/programming-languages/kotlin/*.adoc`) — no new file may be created under
  `apps/android/kotlin/`, and none of the Kotlin language itself is re-taught; every Android page links to the
  matching Kotlin Reference page instead.
- **`modules/ROOT/nav.adoc`** lines ~876–882 already contain:
  ```
  ** xref:apps/index.adoc[Apps]
  *** xref:apps/android/index.adoc[Android]
  +
  --
  include::partial$nav-kotlin.adoc[]
  --
  *** xref:apps/react-native/index.adoc[React Native]
  ...
  ```
  The 41 new entries (40 concept pages + cheat sheet) are inserted as `****` lines directly after the
  `include::partial$nav-kotlin.adoc[]` block's closing `--`, before the `*** xref:apps/react-native/...` line.
- **`modules/ROOT/attachments/`** holds one PDF per section's cheat sheet (`kotlin-cheat-sheet.pdf`,
  `react-native-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf`, etc.) — flat directory, kebab-case names.
- **`modules/ROOT/partials/`** holds one `*-disclaimer.adoc` per section. `vector-rag-disclaimer.adoc` is the
  exact shape to copy (IMPORTANT block, AI-assistance sentence, bibliography-anchor xref, nothing else).
- **`scripts/validate-mermaid.mjs`** (`npm run validate:mermaid`) parses every `[mermaid]` block under
  `modules/ROOT/pages` with the real `mermaid` parser; it needs `npm i --no-save mermaid@11 jsdom` once per
  environment (deliberately not a committed dependency).
- **The author's real library**, used verbatim by pages 33, 39 and 40: `github.com/albertoirurueta/
  irurueta-android-glutils` — `lib/build.gradle.kts` (vanniktech `maven-publish` 0.36.0 in the live repo, plan
  uses the verified-current 0.37.0 in prose but keeps the real repo's structure/task names), `GLTextureView.kt`
  (public API: `setEGLContextClientVersion`, `setEGLConfigChooser`, `setRenderer`, `renderMode`,
  `requestRender`, `onPause`/`onResume`, `queueEvent`, `preserveEGLContextOnPause`, `debugFlags`),
  `.github/workflows/main.yml` and `publish.yml`.

### TrailMate — the running example (used by pages 1–36; not by 37–40)

- **Package** `com.example.trailmate`. **Domain:** `Trail(id, name, region, lengthKm, difficulty, photoUrl,
  isFavorite)`, `enum class Difficulty { EASY, MODERATE, HARD }`, `TrailPhoto`.
- **Remote:** `TrailApi` (Retrofit) / `TrailApiClient` (Ktor) against `https://api.example.com/v1/trails`;
  `TrailDto` wire format.
- **Local:** Room `TrailMateDatabase` (`TrailEntity`, `TrailDao`, `PhotoEntity`, `PhotoDao`);
  `UserPreferencesRepository` on DataStore.
- **Data layer:** `TrailRepository` interface, `OfflineFirstTrailRepository` implementation; optional
  `GetTrailsUseCase`.
- **Compose UI:** single `ComponentActivity` → `TrailMateApp()` → `TrailMateTheme`; screens
  `TrailListScreen`/`TrailDetailScreen`/`SettingsScreen`/`PhotoCaptureScreen`; `TrailListViewModel` exposing
  `StateFlow<TrailListUiState>`; `TrailDetailViewModel` reading `trailId` via `SavedStateHandle`; routes
  `TrailList`/`TrailDetail(trailId)`/`Settings`.
- **Legacy Views UI:** `AppCompatActivity` hosting `NavHostFragment` + `nav_graph.xml`; `TrailListFragment`
  (RecyclerView, `TrailAdapter : ListAdapter`, ViewBinding); `TrailDetailFragment` (Safe Args); a custom
  `ElevationProfileView`; LiveData in older snippets.
- **Background:** `TrailSyncWorker` (`CoroutineWorker`); `RecordHikeService` (foreground service, type
  `location`); channel `trail_updates`.
- **DI:** Hilt `TrailMateApplication` + `NetworkModule`/`DatabaseModule`/`RepositoryModule`; Koin alternative
  `trailMateModule`.
- **Images:** Coil in Compose; Glide in the legacy `TrailViewHolder`.
- **Modules:** `:app`, `:core:model`, `:core:data`, `:core:database`, `:core:network`, `:feature:trails`,
  `:feature:settings`.
- **Tests:** `TrailListViewModelTest`, `OfflineFirstTrailRepositoryTest`, `FakeTrailRepository`,
  `TrailDaoTest`, `TrailListScreenTest`, `TrailListFragmentTest`.

### Version baseline (verified 2026-09-26 — use these exact values on every page; re-verify anything time-sensitive at implementation time)

Android 17 / API 37 (Play requires targeting API 36 since 2026-08-31) · Android Studio Quail 4 · AGP 9.4.1
(Gradle 9.6, JDK 17, built-in Kotlin, new DSL default) · Kotlin 2.4.20 · KSP 2.3.12 (kapt in maintenance mode) ·
Compose BOM 2026.09.00 (Compose 1.12.1, Material 3 1.4.0, Expressive still experimental) · Navigation 2.10.2 /
Navigation 3 1.2.0 · Lifecycle 2.11.0 · Activity 1.13.0 · Fragment 1.9.1 · Room 2.8.5 / Room 3.0.3
(`androidx.room3`) · DataStore 1.2.1 · WorkManager 2.12.0 · Paging 3.5.1 · CameraX 1.6.2 · Media3 1.11.1 ·
Hilt/Dagger 2.60.1, androidx.hilt 1.4.0 · Koin 4.2.2 · Metro 1.4.5 (mention only) · Retrofit 3.0.0 · OkHttp
5.5.0 · Ktor client 3.6.0 · kotlinx.serialization 1.11.0 · Moshi 1.15.2 · Coil 3.6.3 · Glide 5.0.9 (Compose
integration 1.0.0-beta10) · Picasso deprecated · JUnit 4.13.2 · Robolectric 4.17 · Mockito 5.24.0 ·
mockito-kotlin 6.4.0 · MockK 1.14.11 · Turbine 1.2.1 · coroutines-test 1.11.0 · AndroidX Test 1.7.0 · Espresso
3.7.0 · UI Automator 2.4.0 · OSSRH shut down 2025-06-30 → Central Publisher Portal · vanniktech
`maven-publish` 0.37.0 · GitHub Actions: checkout@v7, setup-java@v6, gradle/actions/setup-gradle@v6,
reactivecircus/android-emulator-runner@v2, upload-artifact@v7, r0adkll/upload-google-play@v1.

Known-404 official URLs to avoid: `/develop/ui/compose/designsystems/material3-expressive`,
`/develop/ui/views/window-insets`, bare `/privacy-and-security`, `/build/gradle-plugin-dsl`,
`/develop/ui/compose/graphics/draw/shaders`, `/develop/ui/compose/layouts/adaptive/adaptive-navigation-suite`,
`/guide/topics/resources/pluralization`, `/guide/topics/resources/resources-overview`,
`/training/testing/instrumented-tests/ui-tests`, `/games/develop/gameloops/angle`,
`/google/play/developer-verification`.

### Books (identification only — never copied into the repo, never quoted)

| # | File | Book | Publisher / year / ISBN | Publisher link |
|---|---|---|---|---|
| B1 | `~/Desktop/android1.pdf` | Harun Wangereka, *Mastering Kotlin for Android 14* | Packt, 2024, 978-1-83763-171-1 | https://www.packtpub.com/en-us/product/mastering-kotlin-for-android-14-9781837631711 |
| B2 | `~/Desktop/android2.pdf` | Kevin Brothaler, *OpenGL ES 2 for Android: A Quick-Start Guide* | Pragmatic Bookshelf, 2013, 978-1-937785-34-5 | https://pragprog.com/titles/kbogla/opengl-es-2-for-android/ |
| B3 | `~/Desktop/android3.pdf` | Forrester, Boudjnah, Dumbravan, Tigcal, *How to Build Android Apps with Kotlin* | Packt, 2021, 978-1-83898-411-3 | https://www.packtpub.com/en-us/product/how-to-build-android-apps-with-kotlin-9781838984113 |
| B4 | `~/Desktop/android4.pdf` | Marcin Moskała, Igor Wojda, *Android Development with Kotlin* | Packt, 2017, 978-1-78712-368-7 | https://www.packtpub.com/en-us/product/android-development-with-kotlin-9781787123687 |
| B5 | `~/Desktop/android5.pdf` | Dave Smith, Jeff Friesen, *Android Recipes*, 3rd ed. | Apress, 2014, 978-1-4302-6322-7 | https://link.springer.com/book/10.1007/978-1-4302-6323-4 |
| B6 | `~/Desktop/android6.pdf` | Grant Allen, *Android for Absolute Beginners* | Apress, 2021, 978-1-4842-6645-8 | https://link.springer.com/book/10.1007/978-1-4842-6646-5 |

Concepts found mostly in the books (fold into the named page, no page of their own): LeakCanary/Chucker/
ktlint/detekt (B1 → page 36), Crashlytics/FCM (B1 → pages 30/36), RxJava (B3/B4 → page 20, legacy), Data
Binding (B3 → page 7, legacy), MotionLayout/CoordinatorLayout (B3/B6 → page 9), Moshi (B3 → page 26), Bluetooth/
NFC/USB/WebView (B5 → page 32), content providers (B5/B6 → page 3), AppWidgets (B5 → page 30), NDK/RenderScript
(B5 → page 33, RenderScript deprecated). Official concepts missing from all six books (documented from official
sources only): Navigation 3, adaptive layouts/window size classes, edge-to-edge/predictive back, targetSdk
36/37 large-screen rules, Credential Manager, Baseline Profiles/Macrobenchmark, AGP 9 built-in Kotlin, KSP2,
Room 3, the photo picker, Compose testing APIs, UI Automator 2.4, the Central Publisher Portal/vanniktech,
developer verification, the 16 KB page-size rule, Coil 3, Glide 5. Outdated book material to name only as
legacy: Eclipse/ADT, JCenter, OSSRH, kapt, Kotlin synthetics, `AsyncTask`/Loaders, `IntentService`,
`onRetainNonConfigurationInstance`, `ListView`, RenderScript, Tracer for OpenGL ES, `startActivityForResult`,
`onBackPressed`, Picasso, Navigation 2 string routes, LiveData-first design.

## Implementation steps

### Group 1 — Disclaimer partial (Parallelizable: yes)

- [x] Task 1. Create `modules/ROOT/partials/android-disclaimer.adoc` — created, modeled on
      `vector-rag-disclaimer.adoc` (no tests/coverage applicable; content-only AsciiDoc partial).
  - [x] Task 1.1. `[IMPORTANT]` block states only that the content was generated with AI assistance and should
        be verified against the official Android documentation, plus a line pointing to
        `xref:apps/android/index.adoc#_bibliography[the section bibliography]`. No other admonition content
        (baseline facts, warnings, etc.) goes here — those go in ordinary prose on the pages that need them.

### Group 2 — Foundations & tooling: pages 1–4 (Parallelizable: yes)

- [x] Task 2. Create `modules/ROOT/pages/apps/android/getting-started.adoc` — *Getting Started with Android*
      — created `modules/ROOT/pages/apps/android/getting-started.adoc` (374 lines) and
      `modules/ROOT/images/android-platform-architecture.svg`.
  - [x] Task 2.1. `:description:`/`:keywords:`, the disclaimer include, then cover: the platform architecture
        (Linux kernel, HAL, ART, framework, apps) with a figure; versions/API levels table through Android 17
        / API 37 and the Q2/Q4 cadence; `compileSdk`/`minSdk`/`targetSdk` and the Play target-API requirement;
        installing Android Studio Quail and the SDK Manager; creating TrailMate from the Empty Activity
        (Compose) template with a walk-through of generated files; running on an AVD and a physical device
        (USB + wireless debugging); adb essentials and Logcat; Gemini in Android Studio; learning resources
        (Android Basics with Compose, codelabs, samples); how this section is organized. Every code/CLI example
        followed by an official link (`/get-started/overview`, `/studio/intro`, `/studio/run/emulator`,
        `/studio/run/device`, `/tools/adb`, `/studio/debug/logcat`, `/about/versions/17`, etc. — see issue #169
        page-1 sources).
  - [x] Task 2.2. Create `modules/ROOT/images/android-platform-architecture.svg` (Linux kernel → HAL → ART/
        native libs → Java/Kotlin framework → apps, layered box diagram, detailed alt text), referenced with
        `image::android-platform-architecture.svg[...,width=760,role=text-center]`.
  - [x] Task 2.3. `== References` listing every official URL cited on the page.

- [x] Task 3. Create `modules/ROOT/pages/apps/android/project-structure-and-gradle.adoc` — *Project Structure,
      Gradle and Build Variants* — created (698 lines); touched
      `modules/ROOT/pages/apps/android/project-structure-and-gradle.adoc` only.
  - [x] Task 3.1. Cover: project/module layout; `settings.gradle.kts` (`pluginManagement`,
        `dependencyResolutionManagement`); a complete TrailMate `gradle/libs.versions.toml`; root and module
        `build.gradle.kts` under AGP 9.4 with built-in Kotlin (no `kotlin-android` plugin), the Compose
        compiler plugin, and KSP; the `android {}` DSL (`namespace`, `applicationId`, `defaultConfig`,
        `buildTypes`, `productFlavors`/flavor dimensions, `buildFeatures`, JVM toolchain); build variants,
        source sets, manifest merging; `BuildConfig`, `gradle.properties`, the wrapper; dependency
        configurations (`implementation`/`api`/`ksp`/`testImplementation`/`androidTestImplementation`/
        `debugImplementation`) and BOMs; common Gradle tasks; convention plugins (`build-logic`); AGP 9
        migration (`androidComponents.onVariants` replacing the old variant API, `newDsl`); kapt → KSP; the
        configuration cache and build cache. Every snippet followed by an official link.
  - [x] Task 3.2. Add a Mermaid build-pipeline figure (sources → compile → dex → package → sign).
  - [x] Task 3.3. `== References`.

- [x] Task 4. Create `modules/ROOT/pages/apps/android/app-components-manifest-and-intents.adoc` — *App
      Components, the Manifest and Intents* — created (650 lines); figure at
      `modules/ROOT/images/android-launch-modes.svg`.
  - [x] Task 4.1. Cover: the manifest (`application`, component elements, permissions, `uses-feature`,
        `<queries>`/package visibility, `exported`); the four components with Kotlin examples; the
        `Application` class; explicit vs implicit intents and intent filters; `PendingIntent` mutability
        flags; common intents; deep links and verified App Links (`assetlinks.json`); tasks, the back stack
        and launch modes; content providers and `FileProvider`; bound services/AIDL (brief); broadcast
        receivers (manifest vs runtime registration, `RECEIVER_EXPORTED`); process priority.
  - [x] Task 4.2. Add an SVG or Mermaid figure of tasks/back stack under each launch mode
        (`android-launch-modes.svg` or a Mermaid state diagram).
  - [x] Task 4.3. `== References`.

- [x] Task 5. Create `modules/ROOT/pages/apps/android/resources-and-configuration.adoc` — *Resources,
      Configuration, Localization and Themes* — created (430 lines); forward mention of Task 25's
      state-persistence page written as plain text (no xref, since that page does not exist yet).
  - [x] Task 5.1. Cover: `res/` directories and resource types (strings, plurals, dimens, colors, vector
        drawables, mipmaps/adaptive icons, fonts, raw, xml); the `R` class and reading resources from Views and
        Compose (`stringResource`, `pluralStringResource`, `painterResource`); configuration qualifiers and the
        best-match algorithm; dp/sp/density buckets; localization, RTL, per-app languages (`LocaleConfig`,
        `AppCompatDelegate.setApplicationLocales`); night qualifiers; configuration changes (activity
        recreation, why to avoid `android:configChanges`, link forward to Task 25's state-persistence page);
        resource shrinking.
  - [x] Task 5.2. `== References`.

- [x] Task 6. Run the group's build check
  - [x] Task 6.1. `npx antora antora-playbook.yml`, confirm no new `xref`/AsciiDoc errors from pages 1–4 (they
        will still show as orphaned/unreferenced by nav at this point — that's expected until Group 18).

### Group 3 — Classic View-based UI, part 1: pages 5–8 (Parallelizable: yes)

- [x] Task 7. Create `modules/ROOT/pages/apps/android/activities-and-lifecycle.adoc` — *Activities and the
      Activity Lifecycle* — page created; `== References` uses verified developer.android.com URLs.
  - [x] Task 7.1. Cover: `ComponentActivity` vs `AppCompatActivity`; lifecycle states/callbacks; what happens
        on rotation/back/home/multi-window/process death; `onSaveInstanceState` basics (cross-link to Task 25);
        the Activity Result API replacing `startActivityForResult`; extras and `finish()`; `enableEdgeToEdge()`;
        predictive back, `OnBackPressedDispatcher`/`OnBackPressedCallback` (mandatory at targetSdk 36); the
        SplashScreen API; an intro to `LifecycleObserver`.
  - [x] Task 7.2. Add `modules/ROOT/images/android-activity-lifecycle.svg` and a Mermaid sequence diagram for
        process death. — SVG + `[mermaid]` sequence diagram added; validated with `npm run validate:mermaid`.
  - [x] Task 7.3. `== References`.

- [x] Task 8. Create `modules/ROOT/pages/apps/android/fragments.adoc` — *Fragments and the Fragment Lifecycle*
      — page created.
  - [x] Task 8.1. Cover: why fragments exist; fragment vs view lifecycle (`viewLifecycleOwner`, nulling the
        binding in `onDestroyView`); `FragmentContainerView`/`commit {}`; transactions, back stack,
        `setReorderingAllowed`; child fragments; arguments; the Fragment Result API; `activityViewModels()`;
        `DialogFragment`/`FragmentFactory`; dual-pane layouts; pitfalls (leaks, committing after state saved);
        `FragmentScenario` pointer to Task 39.
  - [x] Task 8.2. Add `modules/ROOT/images/android-fragment-lifecycle.svg`. — self-contained SVG added.
  - [x] Task 8.3. `== References`.

- [x] Task 9. Create `modules/ROOT/pages/apps/android/views-and-layouts.adoc` — *Views, XML Layouts, View
      Binding and Material Components* — page created.
  - [x] Task 9.1. Cover: View/ViewGroup hierarchy and measure/layout/draw; `LinearLayout`, `FrameLayout`,
        `ConstraintLayout` (chains, guidelines, barriers) via the full trail-detail layout; common widgets
        (`TextInputLayout`, etc.); View Binding; Data Binding (legacy, why not preferred); the history of
        `findViewById`/Kotlin synthetics; themes vs styles; MDC components; `DynamicColors`/DayNight; menus and
        the app bar; edge-to-edge insets (`ViewCompat.setOnApplyWindowInsetsListener`); pointer to Task 41
        (images).
  - [x] Task 9.2. `== References`.

- [x] Task 10. Create `modules/ROOT/pages/apps/android/recyclerview-and-lists.adoc` — *RecyclerView and Lists*
      — page created.
  - [x] Task 10.1. Cover: `ListView` history; RecyclerView architecture (Adapter/ViewHolder/LayoutManager/
        ItemDecoration/ItemAnimator); `TrailAdapter` as `ListAdapter` with `DiffUtil.ItemCallback`; click
        lambdas; multiple view types; grid/staggered layout managers; `ConcatAdapter`; `ItemTouchHelper`
        (swipe/drag); stable ids and payloads; submitting lists from a Flow with `repeatOnLifecycle`;
        `PagingDataAdapter` pointer to Task 33; performance tips; Glide in `onBind` pointer to Task 41;
        ViewPager2.
  - [x] Task 10.2. Add a Mermaid or SVG figure of the RecyclerView components. — chose a self-contained SVG
        (`android-recyclerview-architecture.svg`).
  - [x] Task 10.3. `== References`.

### Group 4 — Classic View-based UI, part 2: pages 9–10 (Parallelizable: yes)

- [x] Task 11. Create `modules/ROOT/pages/apps/android/custom-views-drawing-and-animation.adoc` —
      *Custom Views, Touch, Drawing and View Animation*
  — created custom-views-drawing-and-animation.adoc with References section.
  - [x] Task 11.1. Cover: `ElevationProfileView` (custom attributes via `attrs.xml`/`withStyledAttributes`,
        `onMeasure` with `MeasureSpec`, `onSizeChanged`, `onDraw` with Canvas/Paint/Path); `invalidate` vs
        `requestLayout`; `onTouchEvent`/`GestureDetector`/`ScaleGestureDetector`; accessibility for custom
        views; compound views; hardware acceleration; `ViewPropertyAnimator`/`ObjectAnimator`/`ValueAnimator`/
        `AnimatorSet`, interpolators; layout transitions; `AnimatedVectorDrawable`; MotionLayout (a collapsing
        header); CoordinatorLayout/AppBarLayout behaviors; shared-element transitions; pointer to Task 28
        (Compose animation equivalent).
  - [x] Task 11.2. `== References`.

- [x] Task 12. Create `modules/ROOT/pages/apps/android/navigation-with-fragments.adoc` — *Navigation with
      Fragments (Navigation Component, Drawer, Bottom Nav, Tabs)*
      — created navigation-with-fragments.adoc with Mermaid nav-graph figure and References section.
  - [x] Task 12.1. Cover: `nav_graph.xml` (destinations/actions/arguments/deep links); `NavHostFragment`/
        `findNavController`; Safe Args; the Kotlin DSL with type-safe routes; `popUpTo`/`launchSingleTop`;
        nested graphs, `navGraphViewModels`; NavigationUI with `AppBarConfiguration`; `BottomNavigationView`,
        `DrawerLayout`+`NavigationView`, `NavigationRailView`; `TabLayout`+ViewPager2+`TabLayoutMediator`;
        `NavDeepLinkBuilder`; `TestNavHostController`.
  - [x] Task 12.2. Add a Mermaid TrailMate navigation-graph figure.
  - [x] Task 12.3. `== References`.

### Group 5 — Compose fundamentals: pages 11–13 (Parallelizable: yes)

- [x] Task 13. **Create compose-fundamentals.adoc** — files:
      `modules/ROOT/pages/apps/android/compose-fundamentals.adoc`,
      `modules/ROOT/images/android-compose-view-tree-vs-state.svg`. Build check: clean. Mermaid: n/a (SVG only).
  - [x] Task 13.1. Cover: declarative vs imperative UI; Compose setup (compiler plugin, BOM,
        `buildFeatures.compose`); `@Composable`/`setContent`; composition/recomposition; the three phases;
        idempotence; `@Preview` (parameters, `PreviewParameterProvider`, multipreview, interactive mode);
        Text/Image/Icon/Button/TextField basics; resources in Compose; a first `TrailCard` and
        `TrailListScreen` skeleton; the Compose layers (runtime/ui/foundation/material3); an intro to
        stability; the Layout Inspector.
  - [x] Task 13.2. Add an SVG contrasting View-tree mutation with "UI = f(state)", plus the three phases.
  - [x] Task 13.3. `== References`.

- [x] Task 14. **Create compose-layouts-lists-and-modifiers.adoc** — files: modules/ROOT/pages/apps/android/compose-layouts-lists-and-modifiers.adoc. Build check: clean. Mermaid: n/a.
  - [x] Task 14.1. Cover: Row/Column/Box with arrangement/alignment/weight; modifiers and why order matters;
        custom modifiers (`Modifier.Node`); `Surface`/`Card`; ConstraintLayout for Compose; `FlowRow`/
        `BoxWithConstraints`; lazy lists/grids incl. staggered; `key`/`contentType`/`animateItem`; sticky
        headers; `LazyListState`; `PullToRefreshBox`; `HorizontalPager`; a custom `Layout` and intrinsics; list
        performance; the full `TrailListScreen` with `TrailCard`.
  - [x] Task 14.2. `== References`.

- [x] Task 15. **Create compose-state-and-side-effects.adoc** — files:
      modules/ROOT/pages/apps/android/compose-state-and-side-effects.adoc. Build check: clean. Mermaid: valid.
      Cross-link to the state-persistence page correctly points at Task 23's actual file
      (`state-persistence-views-vs-compose.adoc`), not "Task 25" (a stale plan cross-reference from an earlier
      renumbering).
  - [x] Task 15.1. Cover: `remember`/`mutableStateOf` and primitive/collection variants; state hoisting,
        stateless vs stateful composables; `rememberSaveable` basics (cross-link to Task 25); state-holder
        classes; `derivedStateOf`/`snapshotFlow`; `collectAsStateWithLifecycle`; stability
        (`@Stable`/`@Immutable`, strong skipping, the stability config file); effect APIs (`LaunchedEffect`,
        `rememberCoroutineScope`, `rememberUpdatedState`, `DisposableEffect`, `SideEffect`, `produceState`,
        `LifecycleEventEffect`/`LifecycleResumeEffect`); `CompositionLocal`; common mistakes; recomposition
        counts.
  - [x] Task 15.2. Add a Mermaid UDF figure (state down, events up).
  - [x] Task 15.3. `== References`.

### Group 6 — Compose UI, continued: pages 14–16 (Parallelizable: yes)

- [x] Task 16. Create `modules/ROOT/pages/apps/android/compose-material3-and-theming.adoc` — *Material 3 and
      Theming in Compose*. File created:
      modules/ROOT/pages/apps/android/compose-material3-and-theming.adoc. No image/Mermaid figure for this
      page. No tests/coverage apply (documentation only).
  - [x] Task 16.1. Cover: `MaterialTheme` (color scheme, typography, shapes); `TrailMateTheme` (light/dark/
        dynamic color); fonts; `Scaffold` (top-app-bar scroll behaviors, bottom app bar, FAB,
        `SnackbarHost`); core components (Buttons, Cards, Chips, Dialogs, `ModalBottomSheet`,
        NavigationBar/Rail, TextField, Switch, Slider, SearchBar, DatePicker brief); Material 3 Expressive
        status (`@ExperimentalMaterial3ExpressiveApi` in 1.4, graduating in 1.5 alphas, `MotionScheme`); custom
        design systems; migrating XML themes (cross-link to Task 26 + the official guide); icons. Note: Task 26
        itself is a cross-check task with no own file, so the actual migration cross-link points at Task 25's
        page, `xref:apps/android/migrating-from-views-to-compose.adoc[Migrating from Views to Compose]`.
  - [x] Task 16.2. `== References`.

- [x] Task 17. Create `modules/ROOT/pages/apps/android/compose-navigation.adoc` — *Navigation in Compose
      (Navigation Compose and Navigation 3)*
  - [x] Task 17.1. Cover Navigation Compose 2.10 (type-safe `@Serializable` routes, `NavHost`, `composable<T>`,
        `toRoute`, `popUpTo`, `launchSingleTop`, nested graphs via `navigation<T>`, deep links,
        `hiltViewModel` scoping) and Navigation 3 1.2 (own back stack via `NavKey`/`rememberNavBackStack`,
        `NavDisplay`+`entryProvider`, entry decorators for saveable state/ViewModel scoping, scenes
        (list-detail), the results API, predictive back, deep links). Cover how to choose; TrailMate
        implemented both ways; a bottom bar via `NavigationSuiteScaffold` (cross-link to Task 22); testing
        (brief); migrating Nav2 → Nav3 (cross-link the official migration guide).
        **Verify the exact Navigation 3 API names against `/guide/navigation/navigation-3/*` before writing
        code** (this API surface is newer than the training cutoff for some models; the concept map's URLs are
        confirmed live but exact symbol names were not exhaustively verified).
  - [x] Task 17.2. Add a Mermaid back-stack-operations figure.
  - [x] Task 17.3. `== References`.

  Completion note: created `modules/ROOT/pages/apps/android/compose-navigation.adoc` (Navigation Compose 2.10.2
  and Navigation 3 1.2.0, choice table, TrailMate both ways, `NavigationSuiteScaffold` bottom bar cross-linked to
  Task 22's `viewmodel-lifecycle-and-coroutines.adoc`, testing, Nav2→Nav3 migration link, Mermaid back-stack
  figure, References). Navigation 3 API names (`NavKey`, `rememberNavBackStack`, `NavDisplay`, `entryProvider`/
  `entry<T>`, `rememberSaveableStateHolderNavEntryDecorator`, `rememberViewModelStoreNavEntryDecorator`,
  `SceneStrategy`/`rememberListDetailSceneStrategy`, `ResultEventBus`/`sendResult`/`conflateAsState`,
  `DeepLinkMatcher`/`UriDeepLinkMatcher`/`StaticKeyDeepLinkMatcher`) were verified live via WebFetch against
  `/guide/navigation/navigation-3`, `/basics`, `/get-started`, `/save-state`, `/naventrydecorators`, `/scenes`,
  `/return-results`, `/deep-links` and `/migration-guide` on developer.android.com (fetched 2026-09-26); `npm run
  validate:mermaid` and the buildcheck script both pass clean.

- [x] Task 18. Create `modules/ROOT/pages/apps/android/compose-animation-and-gestures.adoc` — *Compose
      Animation and Gestures* — created `modules/ROOT/pages/apps/android/compose-animation-and-gestures.adoc`;
      cross-linked `graphicsLayer`/`drawBehind` to Task 36 (`graphics-canvas-and-opengl-es.adoc`, the actual
      target — plan task numbers are offset from the pages.md list numbers by +3 at this point in the plan).
  - [x] Task 18.1. Cover: choosing an animation API; `animate*AsState`, `AnimatedVisibility`,
        `AnimatedContent`/`Crossfade`, `updateTransition`, `rememberInfiniteTransition`; `Animatable`;
        animation specs; `animateContentSize`/`animateItem`; shared-element transitions; predictive-back
        animations; gestures (`clickable`/`combinedClickable`, `draggable`, `AnchoredDraggable`,
        `transformable`, `scrollable`/`nestedScroll`, `pointerInput` with `detect*Gestures`);
        `graphicsLayer`/`drawBehind` (brief, cross-link to Task 33). Examples: favorite-heart animation,
        expanding card, photo zoom.
  - [x] Task 18.2. Add a Mermaid decision-flow figure for choosing an animation API. — validated with
        `npm run validate:mermaid` (497 diagrams parsed successfully).
  - [x] Task 18.3. `== References`.

### Group 7 — Adaptive layouts & accessibility: pages 17–18 (Parallelizable: yes)

- [x] Task 19. Create `modules/ROOT/pages/apps/android/adaptive-layouts-edge-to-edge-and-large-screens.adoc` —
      *Adaptive Layouts, Edge-to-Edge and Large Screens* — files:
      modules/ROOT/pages/apps/android/adaptive-layouts-edge-to-edge-and-large-screens.adoc,
      modules/ROOT/images/android-adaptive-list-detail.svg.
  - [x] Task 19.1. Cover: the device range (foldables, tablets, desktop windowing, ChromeOS, XR); window size
        classes/`currentWindowAdaptiveInfo`; canonical layouts (`ListDetailPaneScaffold`,
        `NavigableListDetailPaneScaffold`, supporting pane, feed); `NavigationSuiteScaffold`; foldables
        (`WindowInfoTracker`, `FoldingFeature`, tabletop posture); the targetSdk 36/37 orientation/resizability
        rules and the Android 17 opt-out removal; multi-window; keyboard/mouse/stylus input; edge-to-edge
        (`enableEdgeToEdge`, Compose `WindowInsets` incl. `safeDrawing`/`ime`/Scaffold insets, Views insets);
        display cutouts/system bar appearance; the adaptive app quality guidelines.
  - [x] Task 19.2. Add `modules/ROOT/images/android-adaptive-list-detail.svg` (compact vs expanded layouts).
  - [x] Task 19.3. `== References`.

- [x] Task 20. Create `modules/ROOT/pages/apps/android/accessibility.adoc` — *Accessibility (Views and
      Compose)* -- file created (no new SVG/Mermaid needed).
  - [x] Task 20.1. Cover: TalkBack/Switch Access/Select to Speak; Views `contentDescription`/
        `importantForAccessibility`; Compose semantics (`mergeDescendants`, `clearAndSetSemantics`,
        `stateDescription`, `role`, `heading`, `customActions`, traversal order); 48dp touch targets; contrast;
        `sp`/non-linear font scaling; live regions/focus; `AccessibilityDelegateCompat` for custom views;
        testing (Accessibility Scanner, Espresso `AccessibilityChecks`, Compose semantics/accessibility
        checks). Cross-link `web/accessibility.adoc` for WCAG.
  - [x] Task 20.2. `== References`.

### Group 8 — Architecture foundations: pages 19–20 (Parallelizable: yes)

- [x] Task 21. Create `modules/ROOT/pages/apps/android/app-architecture.adoc` — *Recommended App Architecture
      (UI, Domain and Data Layers)* — created app-architecture.adoc (607 lines) + android-architecture-layers.svg
      + Mermaid module-dependency graph; build check clean (only expected forward-xref errors to the sibling
      Task 22 page), mermaid valid.
  - [x] Task 21.1. Cover: separation of concerns, driving UI from data, single source of truth, UDF; the
        UI/domain/data layers; `TrailListUiState` (sealed interface); `TrailListViewModel` with
        `stateIn(WhileSubscribed(5_000))`; UI events; `GetTrailsUseCase`; `TrailRepository`/
        `OfflineFirstTrailRepository` (Room + Retrofit); offline-first/sync; main-safety/dispatcher injection;
        error modelling; modularization (`:app`, `:core:*`, `:feature:*`, `api` vs `implementation`, convention
        plugins pointer); the architecture recommendations checklist; a table relating MVC/MVP/MVVM
        (LiveData/Data Binding)/MVI to current guidance. Cross-link the Kotlin flows/coroutines pages instead of
        re-teaching them.
  - [x] Task 21.2. Add `modules/ROOT/images/android-architecture-layers.svg` and a Mermaid module-dependency
        graph.
  - [x] Task 21.3. `== References`.

- [x] Task 22. Create `modules/ROOT/pages/apps/android/viewmodel-lifecycle-and-coroutines.adoc` — *ViewModel,
      Lifecycle-Aware Components, Coroutines and Flow* — created viewmodel-lifecycle-and-coroutines.adoc
      (665 lines) + android-viewmodel-lifecycle.svg (referenced by exactly this one page); build check clean
      (only expected forward xrefs to planned-but-unwritten pages: dependency-injection-hilt-and-koin.adoc,
      state-persistence-views-vs-compose.adoc, unit-testing-junit-mockito-and-robolectric.adoc); no Mermaid used.
  - [x] Task 22.1. Cover: ViewModel scopes (activity/fragment/nav entry); creating ViewModels
        (`viewModels()`, `activityViewModels()`, `viewModel()`, `hiltViewModel()`, `viewModelFactory`+
        `CreationExtras`); the ViewModel lifecycle (survives config changes, **not** process death);
        `onCleared`/`addCloseable`; `Lifecycle`/`DefaultLifecycleObserver`/`ProcessLifecycleOwner`;
        `viewModelScope`/`lifecycleScope`; `repeatOnLifecycle`/`flowWithLifecycle`;
        `collectAsStateWithLifecycle`; dispatchers/main-safety; StateFlow vs SharedFlow vs Channel and the
        one-off-events guidance; `stateIn`/`shareIn`; LiveData as legacy with interop; RxJava as legacy with a
        migration table; the history of `AsyncTask`/Loaders; `Dispatchers.setMain` pointer to Task 39.
  - [x] Task 22.2. Add a figure of the ViewModel lifecycle against the activity lifecycle.
  - [x] Task 22.3. `== References`.

### Group 9 — Views vs. Compose, state persistence and migration: pages 21–23 (Parallelizable: yes — each writes its own file; content consistency across the three is achieved by all three tasks reading this plan's shared TrailMate/baseline sections and each other's target page names before writing, per the note below)

These are the **core pages** requested by issue #169 (R4). Aim for 500–800 lines of AsciiDoc each, with
thorough tables and figures — do not compress them to match the other groups' length.

- [x] Task 23. Create `modules/ROOT/pages/apps/android/state-persistence-views-vs-compose.adoc` — *Saving UI
      State: Views vs. Compose* — created (925 lines; disclaimer include only, no other admonitions).
  - [x] Task 23.1. Cover the three state-loss events (configuration change, system-initiated process death,
        user dismissal) with a table of what survives each.
  - [x] Task 23.2. Cover Views mechanisms: ViewModel (config changes only); `onSaveInstanceState` in activity/
        fragment; automatic View state saving (requires `android:id`); custom View `BaseSavedState`;
        `freezesText`; Bundle size limits/`TransactionTooLargeException`; `@Parcelize`; fragment arguments;
        `SavedStateHandle` (`get`/`set`, `getStateFlow`, the `saveable` delegate; nav args populate it).
  - [x] Task 23.3. Cover Compose mechanisms: `remember` vs `rememberSaveable`; `Saver`/`listSaver`/`mapSaver`;
        saveable scroll states; `SaveableStateHolder`; Navigation 3 entry decorators.
  - [x] Task 23.4. Cover persistent storage (DataStore/Room) for data that must outlive the task; pitfalls of
        `android:configChanges`; testing process death (`adb shell am kill`, *Don't keep activities*,
        `ActivityScenario.recreate()`, `StateRestorationTester`, `SavedStateHandle` unit tests).
  - [x] Task 23.5. Add a big comparison table (Views vs Compose) per state kind: scroll position, text input,
        selection, screen UI state, navigation back stack, business data. Add
        `modules/ROOT/images/android-state-survival.svg`. Show TrailMate examples in both stacks (search query,
        difficulty filter, scroll position, draft photo caption). — SVG created, referenced only by this page.
  - [x] Task 23.6. `== References`. — 23 verified developer.android.com links.

- [x] Task 24. Create `modules/ROOT/pages/apps/android/views-vs-compose-architecture.adoc` — *Views, Fragments
      and Activities vs. Compose: Architecture Comparison* — created (922 lines, above the 500-800 target per
      explicit instruction not to compress this core page; fixed one incomplete-row table error found during
      build validation).
  - [x] Task 24.1. Side-by-side comparison tables covering: UI definition; update model (imperative mutation
        vs recomposition); lifecycles (activity+fragment+view vs composition); state persistence (summary,
        cross-link Task 23); navigation/back stack; lists; theming/animation; dependency on `Context`; testing
        (Espresso/Robolectric vs Compose testing); tooling (Layout Editor vs Previews); performance (inflation,
        recomposition, Baseline Profiles); startup/APK size; interop; learning curve/maturity.
  - [x] Task 24.2. Cover when Views are still the right choice (large existing codebases; `MapView`/
        `SurfaceView`/`TextureView`-based GL views wrapped via `AndroidView`).
  - [x] Task 24.3. Add `modules/ROOT/images/android-views-vs-compose.svg`. Implement the same feature (a trail
        list with a favorite toggle) completely in both stacks for direct comparison. — SVG created, referenced
        only by this page.
  - [x] Task 24.4. `== References`. — 30 verified developer.android.com/GitHub links.

- [x] Task 25. Create `modules/ROOT/pages/apps/android/migrating-from-views-to-compose.adoc` — *Migrating
      from Views to Compose* — created (727 lines).
  - [x] Task 25.1. State the migration strategy (new features in Compose first; build the design system;
        bottom-up vs top-down).
  - [x] Task 25.2. Write the phased migration path for TrailMate with complete before/after code for each
        phase: 0) prerequisites; 1) MDC XML theme → `TrailMateTheme` (coexisting); 2) `ComposeView` in XML/
        fragments with `ViewCompositionStrategy` options; 3) `AndroidView`/`AndroidViewBinding` to keep a
        MapView/`GLTextureView`/`ElevationProfileView`; 4) `RecyclerView`+`ListAdapter` → `LazyColumn`; 5)
        LiveData → StateFlow+`collectAsStateWithLifecycle` (or `observeAsState` transitionally), removing Data
        Binding; 6) Navigation XML → Navigation Compose → optionally Navigation 3; 7) removing fragments for a
        single `ComponentActivity`; 8) tests (Espresso → Compose testing, hybrid tests); 9) cleanup
        (dependencies, Baseline Profiles).
  - [x] Task 25.3. Add a Mermaid flowchart/timeline of the phases. Cover shared ViewModels between fragments
        and composables, `Context`/resources, insets interop, accessibility parity, pitfalls, and a final
        checklist. — one `[mermaid]`/`....` flowchart block, validated with `npm run validate:mermaid`.
  - [x] Task 25.4. `== References`. — 13 verified developer.android.com links.

- [x] Task 26. Cross-check consistency across Tasks 23–25 — consistency verified across TrailMate names, version
      numbers, and cross-links; one drift found and fixed (Task 25's Phase 5 "after" ViewModel snippet used a
      non-canonical `TrailListUiState` shape; rewritten to match the canonical `@HiltViewModel`/sealed-interface
      shape used in Task 24's page).
  - [x] Task 26.1. Re-read all three files together; ensure they use identical TrailMate names, identical
        version numbers, and cross-link each other correctly (`xref:apps/android/state-persistence-views-vs-compose.adoc[...]`
        etc.). Fix any drift found.

### Group 10 — Data, storage & networking: pages 24–26 (Parallelizable: yes)

- [x] Task 27. Create `modules/ROOT/pages/apps/android/local-storage-datastore-and-files.adoc` — *Local
      Storage: DataStore, Files, Scoped Storage and MediaStore* — file created; no Mermaid needed; buildcheck.sh
      clean (only expected forward-xref warnings to not-yet-written pages).
  - [x] Task 27.1. Cover: a storage-options decision table; SharedPreferences (legacy; `apply` vs `commit`) and
        `SharedPreferencesMigration`; Preferences DataStore (`UserPreferencesRepository`) and typed DataStore
        with a kotlinx.serialization `Serializer`; DataStore singleton rules and multi-process DataStore;
        internal/external app-specific files; scoped storage; MediaStore (saving to `Pictures/TrailMate`);
        Storage Access Framework contracts; the photo picker; `FileProvider`; Auto Backup
        `dataExtractionRules`; `EncryptedSharedPreferences` (deprecated) → Keystore; raw SQLite (legacy).
  - [x] Task 27.2. `== References`. — 19 developer.android.com links added.

- [x] Task 28. Create `modules/ROOT/pages/apps/android/room-database-and-paging.adoc` — *Room Database and
      Paging* — file created with `modules/ROOT/images/android-room-components.svg` (SVG figure, referenced by
      this page only); buildcheck.sh clean (no new errors); no Mermaid used (SVG option taken).
  - [x] Task 28.1. Cover Room: KSP+Room Gradle plugin setup (`schemaDirectory`); `TrailEntity`/`PhotoEntity`,
        `TrailDao` (Flow queries, `@Upsert`, `@Transaction`), `TrailMateDatabase`; type converters; relations
        (`@Relation`/`@Embedded`, trail→photos); indices; migrations (auto-migrations with specs, manual
        `Migration`, exported schemas, `MigrationTestHelper`); prepopulating; a Hilt-provided singleton;
        main-safety; FTS (brief); Room 3.0 (`androidx.room3`, KSP-only, Kotlin codegen, KMP) migration notes;
        testing DAOs with an in-memory db.
  - [x] Task 28.2. Cover Paging 3: `PagingSource`, `Pager`, `PagingData`, `cachedIn`; `collectAsLazyPagingItems`
        and `PagingDataAdapter`; `RemoteMediator` with remote keys for offline-first; `LoadState`; `asSnapshot`
        tests.
  - [x] Task 28.3. Add a Mermaid or SVG Room-components figure. — `android-room-components.svg` added.
  - [x] Task 28.4. `== References`. — 11 developer.android.com links added.

- [x] Task 29. Create `modules/ROOT/pages/apps/android/networking-retrofit-okhttp-and-ktor.adoc` —
      *Networking with Retrofit, OkHttp and Ktor* — file created; no Mermaid/images needed; buildcheck.sh: fixed
      one unescaped `{id}` attribute-reference warning, then clean (no new errors).
  - [x] Task 29.1. Cover basics: `INTERNET` permission, main-thread rule, cleartext/network security config.
  - [x] Task 29.2. Cover OkHttp 5 (client config/timeouts; application vs network interceptors — logging, auth
        headers; `Authenticator` for token refresh; HTTP `Cache`/`Cache-Control`; `CertificatePinner` vs
        network-security-config pinning; `EventListener`); Retrofit 3 (`TrailApi` suspend functions,
        `@GET`/`@Path`/`@Query`/`@Body`, `Response<T>`, kotlinx.serialization/Moshi converters, error mapping);
        Ktor client 3.6 (OkHttp engine, `ContentNegotiation`/`defaultRequest`/`Logging`/`HttpTimeout`/`Auth`
        plugins, `TrailApiClient`).
  - [x] Task 29.3. Add comparison tables: kotlinx.serialization vs Moshi vs Gson; Retrofit vs Ktor. Cover
        `ConnectivityManager.NetworkCallback` as a Flow; testing with `mockwebserver3`/Ktor `MockEngine`;
        WebSockets; Cronet; Apollo (mention); legacy `HttpURLConnection`/Volley/`AsyncTask`.
  - [x] Task 29.4. `== References`. — all OkHttp/Retrofit/Ktor/library-doc URLs verified.

### Group 11 — Libraries: images & DI, pages 27–28 (Parallelizable: yes)

- [x] Task 30. Create `modules/ROOT/pages/apps/android/image-loading-coil-and-glide.adoc` — *Image Loading,
      Caching and Transformations with Coil and Glide* — modules/ROOT/pages/apps/android/image-loading-coil-and-glide.adoc, modules/ROOT/images/android-image-pipeline.svg; build check passes (no new errors, only expected forward xrefs); no Mermaid used.
  - [x] Task 30.1. Cover why an image library is needed and the loading pipeline (request → memory cache →
        disk cache → network → decode → transform → display); add
        `modules/ROOT/images/android-image-pipeline.svg`.
  - [x] Task 30.2. Cover Coil 3 (`coil-compose`/`coil-network-okhttp`; `AsyncImage`/`SubcomposeAsyncImage`/
        `rememberAsyncImagePainter`; `ImageRequest`; singleton `ImageLoader` via `SingletonImageLoader.Factory`
        in `TrailMateApplication`; `MemoryCache`/`DiskCache` config, cache policies/keys; transformations
        (circle crop, rounded corners, custom grayscale); `ImageView.load()`; SVG/GIF/video decoders; sharing
        an `OkHttpClient`; preloading; `coil-test`).
  - [x] Task 30.3. Cover Glide 5 (`Glide.with(fragment).load().into()` in `TrailViewHolder`; `RequestOptions`;
        `DiskCacheStrategy` values/`skipMemoryCache`; signatures for cache invalidation; transformations
        (centerCrop, circleCrop, RoundedCorners, MultiTransformation, custom `BitmapTransformation`);
        `AppGlideModule` with KSP; `RecyclerViewPreloader`; Glide Compose (beta)).
  - [x] Task 30.4. Cover Bitmap fundamentals (`inSampleSize`, `ImageDecoder`, hardware bitmaps,
        `ExifInterface`, `compress`); Fresco and Picasso (deprecated); a Coil vs Glide comparison table and
        recommendation.
  - [x] Task 30.5. `== References`.

- [x] Task 31. Create `modules/ROOT/pages/apps/android/dependency-injection-hilt-and-koin.adoc` —
      *Dependency Injection with Hilt, Dagger and Koin* — modules/ROOT/pages/apps/android/dependency-injection-hilt-and-koin.adoc,
      modules/ROOT/images/android-hilt-component-hierarchy.svg; build check passes (no mermaid used).
  - [x] Task 31.1. Cover DI concepts (constructor/field injection, service locator vs DI, manual DI with an
        `AppContainer`); Dagger basics (components, modules, `@Inject`/`@Provides`/`@Binds`, scopes,
        qualifiers).
  - [x] Task 31.2. Cover Hilt: setup (plugin, KSP); `@HiltAndroidApp`/`@AndroidEntryPoint`; a components/scopes
        table; `@Module`/`@InstallIn` for `NetworkModule`/`DatabaseModule`/`RepositoryModule`; `@Binds` for
        `TrailRepository`; an `@IoDispatcher` qualifier; `@HiltViewModel`+`SavedStateHandle`; `hiltViewModel()`
        (`hilt-lifecycle-viewmodel-compose` 1.4.0, and `hilt-navigation-compose`); assisted injection
        (`@AssistedInject`/`@AssistedFactory` with `creationCallback`); `@HiltWorker`; `@EntryPoint`; testing
        (`@HiltAndroidTest`, `HiltAndroidRule`, `@TestInstallIn`/`@UninstallModules`, `@BindValue`, custom test
        runner).
  - [x] Task 31.3. Cover Koin 4.2 (`module {}` with `single`/`factory`/`viewModelOf`/`singleOf`; `startKoin`;
        `by inject()`/`koinViewModel()`; scopes; Koin annotations brief; `verify()`/`KoinTestRule`); Metro
        (brief, compile-time DI for KMP); a comparison table (Hilt vs Koin vs manual vs Metro).
  - [x] Task 31.4. Add a figure of the Hilt component hierarchy.
  - [x] Task 31.5. `== References`.

### Group 12 — Background, notifications & security: pages 29–31 (Parallelizable: yes)

- [x] Task 32. Create `modules/ROOT/pages/apps/android/background-work-and-services.adoc` — *Background Work:
      WorkManager, Services and Alarms* — file created; covers the API decision tree, WorkManager
      (`CoroutineWorker`/`TrailSyncWorker`, constraints, one-time/periodic work, chaining, unique work, backoff,
      input/output `Data`, expedited work, `WorkInfo`/`Flow` observation, `@HiltWorker`, `work-testing`),
      foreground services (`RecordHikeService`, required types, `startForeground`, Android 14+ restrictions),
      UIDT, `AlarmManager`/exact alarms, broadcasts, Doze/App Standby buckets, and legacy
      `IntentService`/`JobScheduler`/Firebase JobDispatcher, including the Mermaid decision-tree figure and a
      final `== References` section (verified developer.android.com links); `buildcheck.sh` and
      `npm run validate:mermaid` both pass with no new issues.
  - [x] Task 32.1. Cover a decision tree for choosing an API; WorkManager (`CoroutineWorker`/`TrailSyncWorker`,
        constraints, one-time/periodic work, chaining, unique work, backoff, input/output data, expedited work,
        observing work, `@HiltWorker`, `work-testing`); foreground services (required types, `location`-type
        `RecordHikeService`, `startForeground`, Android 14+ restrictions); user-initiated data transfer (UIDT);
        `AlarmManager`/exact alarms; broadcasts; Doze/App Standby; legacy `IntentService`/`JobScheduler`.
  - [x] Task 32.2. Add a Mermaid decision-tree figure.
  - [x] Task 32.3. `== References`.

- [x] Task 33. Create `modules/ROOT/pages/apps/android/notifications-and-app-widgets.adoc` — *Notifications,
      Firebase Cloud Messaging and App Widgets (Glance)* — file created; covers notifications, FCM and Glance
      widgets in full, with a final `== References` section (11 verified developer.android.com/firebase.google.com
      links); `buildcheck.sh` and `npm run validate:mermaid` both pass with no new issues.
  - [x] Task 33.1. Cover notifications (anatomy; channels/`trail_updates`/importance; `POST_NOTIFICATIONS`;
        `NotificationCompat.Builder`; styles — BigText/BigPicture/Inbox/progress; actions/direct reply;
        `PendingIntent` deep links; foreground-service notifications; groups/badges); FCM (setup,
        `FirebaseMessagingService`, tokens, data vs notification messages); app widgets (Glance
        `GlanceAppWidget`/`GlanceAppWidgetReceiver`/state/WorkManager updates; the classic `AppWidgetProvider`
        with `RemoteViews`, legacy).
  - [x] Task 33.2. `== References`.

- [x] Task 34. Create `modules/ROOT/pages/apps/android/permissions-privacy-and-security.adoc` —
      *Permissions, Privacy and Security*
      Done: created `modules/ROOT/pages/apps/android/permissions-privacy-and-security.adoc`, including the
      runtime-permission-flow Mermaid figure and a `== References` section.
  - [x] Task 34.1. Cover permissions (install-time/runtime/special; request flow in Views and Compose and
        rationale UX; approximate vs precise location; background location; minimizing requests); privacy
        (Privacy Dashboard, data access auditing, advertising ID, Data safety form, SMS/Call Log policy);
        security (Keystore/Tink; biometrics `BiometricPrompt`; Credential Manager/passkeys; network security
        config; WebView hardening; exported-component risks; R8 obfuscation; Play Integrity; cross-link
        `backend/oauth/native-and-mobile-apps.adoc`).
  - [x] Task 34.2. Add a Mermaid runtime-permission-flow figure.
  - [x] Task 34.3. `== References`.

### Group 13 — Device features & graphics: pages 32–33 (Parallelizable: yes)

- [x] Task 35. Create `modules/ROOT/pages/apps/android/device-features-camera-location-sensors-media.adoc` —
      *Camera, Location, Sensors, Media and Connectivity*
      (tests: n/a; coverage: n/a; build: clean — `bash scratchpad/buildcheck.sh` reports no errors/warnings
      attributable to this file)
  - [x] Task 35.1. Cover CameraX (use cases `Preview`/`ImageCapture`/`ImageAnalysis`/`VideoCapture`,
        `CameraXViewfinder`/`PreviewView`, `PhotoCaptureScreen`; Camera2 vs CameraX); the fused location
        provider (`getCurrentLocation`, updates as a Flow); maps (mention); geofencing; sensors
        (`SensorManager`, exposed as a Flow); Media3 (ExoPlayer in Compose, `MediaSessionService`); audio
        recording (brief); Bluetooth LE/NFC/USB (brief); WebView; other form factors (Wear OS/TV/Auto/XR,
        pointers only).
  - [x] Task 35.2. `== References`.

- [x] Task 36. Create `modules/ROOT/pages/apps/android/graphics-canvas-and-opengl-es.adoc` — *Graphics:
      Canvas, OpenGL ES and GLTextureView* (brief — match the depth of
      `programming-languages/javascript/browser-canvas-webgl.adoc`)
  - [x] Task 36.1. Cover 2D drawing (Canvas in Views vs `DrawScope` in Compose; `Brush`/AGSL/`RuntimeShader`;
        `RenderEffect`).
  - [x] Task 36.2. Cover OpenGL ES: supported versions; what OpenGL ES is and why raw GL is verbose (EGL
        context, shaders, buffers); `GLSurfaceView`+`GLSurfaceView.Renderer` with a minimal triangle;
        `GLSurfaceView` vs `TextureView` (separate surface vs part of the view hierarchy — transforms, alpha,
        animation; cost; threading); **`GLTextureView`** from `com.irurueta:irurueta-android-glutils:1.1.11`
        (why it exists; usage mirroring `GLSurfaceView` — `setEGLContextClientVersion(2)`,
        `setEGLConfigChooser`, `setRenderer`, `renderMode`, `requestRender`, `onPause`/`onResume`,
        `queueEvent`, `preserveEGLContextOnPause`; embedding it in Compose via `AndroidView`); the pinhole
        camera helpers; Vulkan as the recommended low-level API, and ANGLE (describe cautiously); the NDK
        (brief; the 16KB note); RenderScript as deprecated.
  - [x] Task 36.3. Add a *Further reading* list (AGI, Khronos specs, Brothaler's book topics, the author's
        `irurueta-android-gl-cube`/`irurueta-android-gl-curl` repos, a note that a full 3D guide may come
        later) and an SVG comparing `GLSurfaceView` with `TextureView`/`GLTextureView`.
  - [x] Task 36.4. `== References`, including `https://github.com/albertoirurueta/irurueta-android-glutils`.
  - Files touched: `modules/ROOT/pages/apps/android/graphics-canvas-and-opengl-es.adoc`,
    `modules/ROOT/images/android-glsurfaceview-vs-textureview.svg`. GLTextureView API verified directly against
    `GLTextureView.kt` on GitHub (`com.irurueta:irurueta-android-glutils`, `main` branch) — matches baseline.md
    exactly. tests: n/a; coverage: n/a; build: clean (buildcheck.sh, no new errors; no Mermaid blocks used).

### Group 14 — Quality: pages 34–36 (Parallelizable: yes)

- [x] Task 37. Create `modules/ROOT/pages/apps/android/unit-testing-junit-mockito-and-robolectric.adoc` —
      *Unit Testing with JUnit, Mockito, MockK and Robolectric* — page + `modules/ROOT/images/android-test-pyramid.svg`;
      build check clean (only expected forward-xref to not-yet-written `ci-cd-with-github-actions.adoc`); no
      Mermaid used (hand-authored SVG figure instead).
  - [x] Task 37.1. Cover basics (test pyramid, `test/` vs `androidTest/`, dependencies, JUnit 4 and optional
        JUnit 5/6 via `android-junit5`, fakes vs mocks with `FakeTrailRepository`); Mockito 5 + mockito-kotlin
        6 (`mock()`/`whenever`/`doReturn`, suspend stubbing, `verify`/captors/`inOrder`, the inline mock maker,
        `mockito-android`); MockK (`coEvery`/`coVerify`, relaxed mocks, `mockkStatic`); coroutines/Flow testing
        (`runTest`, `StandardTestDispatcher`/`UnconfinedTestDispatcher`, a `MainDispatcherRule`, testing
        `TrailListViewModel` StateFlows with Turbine and `backgroundScope`, testing `SavedStateHandle`);
        Robolectric 4.17/SDK 37 (setup, `@Config`, `ActivityScenario`/`FragmentScenario` on the JVM, testing
        `TrailListFragment`, Compose tests under Robolectric, shadows, Room tests, `@GraphicsMode`/screenshot
        tests mention); repository tests with MockWebServer; JaCoCo coverage.
  - [x] Task 37.2. Add a test-pyramid figure. — `modules/ROOT/images/android-test-pyramid.svg`.
  - [x] Task 37.3. `== References`. — 17 verified developer.android.com/robolectric.org/mockito/mockk URLs.

- [x] Task 38. Create `modules/ROOT/pages/apps/android/instrumented-and-ui-testing.adoc` — *Instrumented and
      UI Testing (Espresso, Compose Testing, UI Automator)* — build check clean (only expected forward-xrefs to
      not-yet-written sibling pages); no Mermaid/figure used (none required by this task).
  - [x] Task 38.1. Cover setup (`AndroidJUnitRunner`, AndroidX Test core/runner/rules/ext.junit,
        `ActivityScenarioRule`); Espresso (`onView`/`withId`/`perform`/`check`, `RecyclerViewActions`, Intents,
        IdlingResource, accessibility checks); Compose testing (`createComposeRule`/
        `createAndroidComposeRule`, finders/actions/assertions, `testTag`, `printToLog`, `mainClock`/
        `waitUntil`, `StateRestorationTester`, hybrid View+Compose tests); UI Automator 2.4 (cross-app flows,
        permission dialogs); Hilt instrumented tests; Room DAO tests on device; Test Orchestrator; Gradle
        Managed Devices; screenshot testing (Compose Preview Screenshot Testing); Firebase Test Lab (mention).
  - [x] Task 38.2. `== References`.

- [x] Task 39. Create `modules/ROOT/pages/apps/android/debugging-code-quality-and-performance.adoc` —
      *Debugging, Code Quality and Performance* — build check clean (antora exit=0, only expected forward-xrefs);
      no Mermaid/figure used (none required by this task); cross-links Compose performance to
      `compose-state-and-side-effects.adoc` (Task 15 resolved by topic).
  - [x] Task 39.1. Cover debugging (Studio debugger, Logcat, Layout Inspector incl. recomposition counts, App
        Inspection — Database/Network/Background Task inspectors, StrictMode, LeakCanary, Chucker); code
        quality (Android Lint, ktlint, detekt); profiling/performance (Profiler CPU/memory/heap dumps, Perfetto
        traces, ANRs, rendering/jank, app startup + App Startup library, Baseline Profiles, Macrobenchmark/
        Microbenchmark, R8 app optimization, cross-link Task 15 for Compose performance); production monitoring
        (Android vitals, Firebase Crashlytics/Performance Monitoring).
  - [x] Task 39.2. `== References`.

### Group 15 — Build, ship & automate: pages 37–40 (Parallelizable: yes — all four use the real irurueta-android-glutils repo as their example, read-only reference, so no shared-file conflicts)

- [x] Task 40. Create `modules/ROOT/pages/apps/android/building-signing-and-releasing.adoc` — *Building,
      Signing and Preparing a Release*
  - [x] Task 40.1. Cover building (debug vs release, R8 shrinking/obfuscation, `proguard-rules.pro`, keep
        rules, mapping files, resource shrinking); packaging (APK vs AAB, `bundletool`, `versionCode`/
        `versionName` strategies); signing (keystores via `keytool`/Studio, `signingConfigs` from
        `keystore.properties`/env vars — never committed, v1–v4 schemes, `apksigner verify`, debug keystore SHA
        fingerprints, upload key vs app signing key cross-link to Task 41); the 16KB page-size check; a release
        checklist.
  - [x] Task 40.2. Add an SVG of the signing chain (upload key → Play → app signing key → device).
  - [x] Task 40.3. `== References`.

- [x] Task 41. Create `modules/ROOT/pages/apps/android/publishing-on-google-play.adoc` — *Publishing on
      Google Play*
  - [x] Task 41.1. Cover accounts (personal vs organization, identity verification, developer verification
        incl. the 2026–2027 enforcement timeline for BR/ID/SG/TH then global); app setup (creating the app,
        store listing, content rating, target audience, Data safety form, privacy policy, app access, ads
        declaration); releases (Play App Signing enrollment, uploading the AAB, testing tracks incl. the
        12-testers/14-days rule for new personal accounts, pre-launch report, staged rollout, review process);
        policies (target API level, Android vitals thresholds); Play libraries (Feature Delivery brief,
        in-app updates `app-update-ktx`, in-app review `review-ktx`, Play Billing mention, cross-link Task 34
        for Play Integrity); alternative distribution (sideloading, other stores).
  - [x] Task 41.2. Add a Mermaid release-flow figure (build → sign → upload → internal → closed → open →
        production staged rollout).
  - [x] Task 41.3. `== References`.

- [x] Task 42. Create `modules/ROOT/pages/apps/android/android-libraries-and-maven-central.adoc` —
      *Building and Publishing Android Libraries to Maven Central*
  - [x] Task 42.1. Cover library modules (`com.android.library`, AAR contents, `namespace`, `minSdk` choices,
        `api` vs `implementation`, `consumer-rules.pro`, resource/R-class namespacing, explicit API mode,
        binary-compatibility validation mention); publication (`publishing { singleVariant("release") {
        withSourcesJar(); withJavadocJar() } }`, `maven-publish` to a private repo, Dokka to GitHub Pages as
        glutils does).
  - [x] Task 42.2. Cover Maven Central: the Central Publisher Portal (namespace verification, user tokens,
        POM/sources/javadoc/GPG/checksum requirements); OSSRH's end of life; GPG key generation/export for
        in-memory signing; the vanniktech plugin using the **real** `irurueta-android-glutils` `lib/
        build.gradle.kts` verbatim as the worked example (`AndroidSingleVariantLibrary`,
        `publishToMavenCentral()`, `signAllPublications()`, `coordinates`, the `pom {}` block); the properties/
        env vars; `publishToMavenCentral` vs `publishAndReleaseToMavenCentral`; SNAPSHOT publishing; consuming
        the library. Cover alternatives (JitPack, GitHub Packages, Google Maven; JCenter is shut down).
  - [x] Task 42.3. Add a Mermaid publishing-flow figure.
  - [x] Task 42.4. `== References`, including `https://github.com/albertoirurueta/irurueta-android-glutils`.

- [x] Task 43. Create `modules/ROOT/pages/apps/android/ci-cd-with-github-actions.adoc` — *CI/CD with GitHub
      Actions*
  - [x] Task 43.1. Cover the CI workflow modelled on the **real** glutils `main.yml`, modernized to the
        verified-current action versions (checkout@v7, setup-java@v6 temurin 17, gradle/actions/
        setup-gradle@v6 caching, lint/unit tests/assemble, instrumented tests on an emulator via the KVM udev
        rule + reactivecircus/android-emulator-runner@v2, EnricoMi/publish-unit-test-result-action, JaCoCo
        coverage conversion, SonarCloud via `./gradlew :lib:sonar`, Dokka to GitHub Pages, upload-artifact@v7,
        matrix builds, concurrency).
  - [x] Task 43.2. Cover the app release (CD) workflow (tag/release trigger, base64 keystore secret,
        `bundleRelease` with env-var signing, uploading to Play with r0adkll/upload-google-play@v1 or Gradle
        Play Publisher, track promotion) and the library publish workflow (the **real** glutils `publish.yml`
        on `release: [released]`, `./gradlew lib:publishAndReleaseToMavenCentral --no-configuration-cache` with
        `ORG_GRADLE_PROJECT_*` secrets).
  - [x] Task 43.3. Cover Dependabot, secrets hygiene, Gradle Managed Devices in CI, Firebase App
        Distribution/Test Lab (mention). Cross-link `git-and-github/index.adoc`.
  - [x] Task 43.4. Add a Mermaid pipeline figure (PR → CI → merge → release → Play / Maven Central).
  - [x] Task 43.5. `== References`, including `https://github.com/albertoirurueta/irurueta-android-glutils/tree/main/.github/workflows`.

### Group 16 — Landing page and cheat-sheet page (Parallelizable: yes — both only read the finished state of Groups 1–15, neither touches the other's file)

- [x] Task 44. Rewrite `modules/ROOT/pages/apps/android/index.adoc` — *Android* (landing page)
      Note: touched `modules/ROOT/pages/apps/android/index.adoc` only; `buildcheck.sh` clean for this file (its
      only reported item is the pre-existing, expected `attachment$android-cheat-sheet.pdf` xref warning from
      the concurrently-authored `cheat-sheet.adoc`, owned by Task 45); no `[mermaid]` blocks were added, so
      `validate:mermaid` was not applicable.
  - [x] Task 44.1. New `:description:`/`:keywords:`; the disclaimer include; an intro explaining native Android
        development and the baseline, naming the Kotlin Reference and the React Native/Apple sibling sections.
  - [x] Task 44.2. `== How Android app development got here` — a year/change table (2008 SDK/Java; Fragments
        2011; Android Studio/Gradle/ART 2014; Material Design 2014; Kotlin first 2019; Architecture Components
        2017/Jetpack 2018; AndroidX 2018; Compose 1.0 2021; the App Bundle requirement 2021; Material 3 2022;
        OSSRH end of life 2025; Navigation 3 stable 2025; AGP 9 built-in Kotlin 2026; Android 17/developer
        verification 2026).
  - [x] Task 44.3. `== New here? Read in this order` — path 1: getting-started → project-structure-and-gradle
        → compose-fundamentals → compose-layouts-lists-and-modifiers → compose-state-and-side-effects →
        app-architecture → viewmodel-lifecycle-and-coroutines → compose-navigation; path 2 (existing View-based
        apps): activities-and-lifecycle → fragments → views-and-layouts → state-persistence-views-vs-compose →
        views-vs-compose-architecture → migrating-from-views-to-compose.
  - [x] Task 44.4. `== The TrailMate app` — the running-example description from *Current code state* above.
  - [x] Task 44.5. `== What's covered` — grouped exactly like the nav (Foundations & tooling; Classic
        View-based UI; Jetpack Compose; Architecture: old vs. new; Data, networking & libraries; System
        integration & device features; Quality; Build, ship & automate), one-line summary per page, plus the
        Kotlin Reference and the cheat sheet.
  - [x] Task 44.6. `== Books and official sources compared` — the book identification table, the concept×book
        matrix, concepts found only in the books, official concepts missing from the books, and outdated
        material, all reproduced from issue #169's body (and this plan's *Books* section above) in prose/
        tables.
  - [x] Task 44.7. `== Related sections` — Kotlin Reference, React Native, Apple Platforms,
        `backend/oauth/native-and-mobile-apps.adoc`, `git-and-github/index.adoc`, `backend/docker/index.adoc`.
  - [x] Task 44.8. `== Bibliography` (anchor `_bibliography`) with subsections: Android Developers
        documentation (every developer.android.com URL cited on any of the 40 pages, grouped by topic — collect
        these by grepping every new page for `developer.android.com` links once Groups 2–15 are done); Google
        Play Console Help and Google blogs; Kotlin/Jetpack/AndroidX release notes; third-party libraries
        (Retrofit, OkHttp, Ktor, kotlinx.serialization, Moshi, Coil, Glide, Fresco, Dagger/Hilt, Koin, Metro,
        Mockito, mockito-kotlin, MockK, Robolectric, Turbine, LeakCanary, Chucker, ktlint, detekt, Firebase);
        publishing and CI (Sonatype Central, vanniktech, Dokka, GitHub Actions docs and each action's repo);
        graphics (Khronos OpenGL ES registry, Vulkan); the author's repositories (irurueta-android-glutils and
        the other Android repos named in this plan); books (all six, each with author/title/edition/publisher/
        year/ISBN/publisher link).

- [x] Task 45. Create `modules/ROOT/pages/apps/android/cheat-sheet.adoc` — *Android Development Cheat Sheet*
  - Created `modules/ROOT/pages/apps/android/cheat-sheet.adoc` linking all 40 concept pages grouped by nav
    section; buildcheck passed with exactly the expected missing-attachment warning for
    `attachment$android-cheat-sheet.pdf` (produced later by Group 17 / Task 46).
  - [x] Task 45.1. Model the page on `apps/react-native/cheat-sheet.adoc`: the disclaimer, links to every page
        grouped by nav section, then `== Download` with
        `xref:attachment$android-cheat-sheet.pdf[Download the Android Development Cheat Sheet (PDF)]`.

### Group 17 — Cheat-sheet PDF (Parallelizable: yes — single task)

- [x] Task 46. Produce `modules/ROOT/attachments/android-cheat-sheet.pdf` — built in the session scratchpad
      (`cheatsheet.html`/CSS, headless Chrome render, PyMuPDF verification) and copied only the finished PDF
      into the repo; 1 page, 594.96×841.92pt (A4), 197 KB, minimum font 6.0pt confirmed page-wide via PyMuPDF
      span inspection, no clipped/overflowing boxes in the rendered preview; `buildcheck.sh` now shows a clean
      `antora exit=0` with zero `android-cheat-sheet` xref errors (previously the one expected
      `attachment$android-cheat-sheet.pdf` missing-attachment warning noted in Task 45).
  - [x] Task 46.1. Reverse-engineered house style from `kotlin-cheat-sheet.pdf` and `react-native-cheat-sheet.pdf`
        with PyMuPDF (page 595.92×841.92pt A4, ~14pt margins, 3–5 balanced CSS columns, colored header bars with
        white bold text, dark monospace code boxes, thin-bordered rounded boxes, italic footer attribution line).
  - [x] Task 46.2. Built `cheatsheet.html` with one box per group (20 boxes: platform/SDK settings; Gradle +
        version catalog; app components/intents; activity+fragment lifecycle mini SVG diagram; Views essentials;
        Compose essentials; Views vs Compose + state-survival table; architecture layers with
        ViewModel/StateFlow; navigation (Nav Compose + Nav3); storage (DataStore/Room); networking
        (Retrofit/OkHttp/Ktor); images (Coil/Glide); DI (Hilt/Koin); background work & notifications;
        permissions & security; testing (JUnit/Mockito/MockK/Robolectric/Espresso/Compose test); build/sign/Play
        tracks; Maven Central publishing; CI/CD (GitHub Actions); OpenGL ES one-liner (GLSurfaceView vs
        GLTextureView)) using the plan's version baseline (Android 17/API 37, AGP 9.4.1, Kotlin 2.4.20, Compose
        BOM 2026.09.00). All CSS/inline-SVG font sizes set to exactly 6.0pt or above (verified below).
  - [x] Task 46.3. Rendered with `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
        --disable-gpu --no-pdf-header-footer --print-to-pdf`. Iterated twice: (1) 4-column layout overflowed to
        2 pages and had several sub-6pt spans — fixed by moving to 5 balanced CSS columns, tightening
        padding/line-height, and normalizing every font-size to 6.0–6.4pt; (2) two-column tables (e.g. Testing,
        Views vs Compose) clipped their value column off the right edge of narrow boxes — fixed with
        `table-layout: fixed` + `word-wrap: break-word` + explicit first-column width; the lifecycle diagram's
        inline SVG text was being shrunk by viewBox scaling to ~3.3pt and its boxes then overlapped when
        naively enlarged — fixed by rebuilding the diagram's viewBox/box geometry near 1:1 with its final
        rendered size. Final PyMuPDF check: `page_count == 1`, page rect ≈ 594.96×841.92pt (A4), minimum text
        span size 6.0pt page-wide, PNG preview inspected at 200/400/500 dpi shows no clipped or overflowing
        boxes.
  - [x] Task 46.4. Copied only `android-cheat-sheet.pdf` (not the scratchpad HTML/scripts) to
        `modules/ROOT/attachments/android-cheat-sheet.pdf`.

### Group 18 — Site wiring (Parallelizable: no — small, order-sensitive edits across shared navigation/index files)

- [x] Task 47. Update `modules/ROOT/nav.adoc` — inserted 41 `****` entries (pages 1–40 plus the cheat sheet)
      immediately after the `nav-kotlin.adoc` include's closing `--` and before `*** xref:apps/react-native/...`;
      link text taken from each page's real `= Title`. Verified in `build/site/apps/android/index.html` that all
      41 links render at depth 4 under Android, right after Kotlin Reference and right before React Native.
  - [x] Task 47.1. Under the existing `*** xref:apps/android/index.adoc[Android]` block, immediately after the
        existing `include::partial$nav-kotlin.adoc[]` include's closing `--` and before the
        `*** xref:apps/react-native/index.adoc[...]` line, insert 41 new `****` entries: pages 1–40 in the nav
        order from Groups 2–15 above, followed by
        `**** xref:apps/android/cheat-sheet.adoc[Cheat Sheet (PDF)]`.

- [x] Task 48. Update `modules/ROOT/pages/apps/index.adoc` — rewrote the Android bullet to summarize the full
      section (Kotlin, classic Views/Fragments, Compose, architecture/migration, data/networking, system
      integration, testing, and build/publish), matching the Apple Platforms/React Native bullet style, and
      added Compose/Views/architecture/library keywords to `:keywords:`.
  - [x] Task 48.1. Rewrite the Android bullet to summarize the full section (matching the style of the Apple
        Platforms and React Native bullets already there) and update `:keywords:` to include the new section's
        key terms.

### Group 19 — Reciprocal cross-links in existing pages (Parallelizable: yes — five distinct files)

- [x] Task 49. Add a *See Also* entry in `modules/ROOT/pages/programming-languages/kotlin/kotlin-for-android.adoc`
      pointing to the new Android section's `index.adoc`, `app-architecture.adoc`, and
      `viewmodel-lifecycle-and-coroutines.adoc`. — added one *See Also* bullet linking all three by their real
      titles.
- [x] Task 50. Update `modules/ROOT/pages/apps/react-native/index.adoc`'s *Related sections* to point to the new
      Android section (it currently only names `apps/android/index.adoc` generically per issue context — verify
      current wording and adjust to reference specific new pages where useful). — kept the existing
      `apps/android/index.adoc` link and added specific pointers to `app-architecture.adoc` and
      `building-signing-and-releasing.adoc` as the counterparts to this section's own architecture/release pages.
- [x] Task 51. Update `modules/ROOT/pages/apps/react-native/building-and-publishing.adoc` to link
      `apps/android/building-signing-and-releasing.adoc` and `apps/android/publishing-on-google-play.adoc` from
      its Android-specific subsections. — added an intro sentence under `== Android Release Builds` linking both.
- [x] Task 52. Update `modules/ROOT/pages/apps/apple/index.adoc` line ~290's paragraph naming Android as the
      native counterpart, to name the new section's actual scope. — expanded the existing
      `xref:apps/android/index.adoc[Android]` mention with the section's actual coverage (Views/Compose UI, app
      architecture, data/networking, system integration, quality, building/signing/publishing).
- [x] Task 53. Update `modules/ROOT/pages/programming-languages/javascript/browser-canvas-webgl.adoc`'s
      *Further Reading* to link `apps/android/graphics-canvas-and-opengl-es.adoc` as the Android counterpart. —
      added a closing sentence under *Further Reading* cross-linking it by its real title.

### Group 20 — Mermaid validation and final build verification (Parallelizable: no — verifies the output of every prior group)

- [x] Task 54. Validate every Mermaid block added in Groups 2–17
  - [x] Task 54.1. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` and fix any diagram that
        fails to parse before proceeding.

- [x] Task 55. Verify admonition discipline
  - [x] Task 55.1. Run
        `grep -RnE '^\[(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]|^(NOTE|TIP|WARNING|IMPORTANT|CAUTION):' modules/ROOT/pages/apps/android/`
        and confirm every match is the `android-disclaimer.adoc` include's own `[IMPORTANT]` block (i.e. no
        page defines a *second* admonition of its own).

- [x] Task 56. Build the site and verify
  - [x] Task 56.1. Run `npx antora antora-playbook.yml` (local content only, no `--fetch`), redirect output to
        a log file, and grep for `ERROR`/`WARN`/`xref`/`unresolved`/`include`/`image`/`attachment`/`android`;
        fix any warning found in this plan's own files and rebuild until the log is clean.
  - [x] Task 56.2. Verify `build/site/apps/android/` contains all 42 HTML pages (index, cheat-sheet, and 40
        concept pages) and `build/site/_attachments/android-cheat-sheet.pdf` exists; verify every
        `modules/ROOT/images/android-*.svg` is referenced by exactly one page via `image::android-` and
        resolves under `build/site/_images/`; verify the built site's nav contains all 41 new entries under
        Apps → Android, after the existing Kotlin Reference block.
  - [x] Task 56.3. Verify every `xref:` target collected from `modules/ROOT/pages/apps/android/` resolves to an
        existing file under `modules/ROOT/pages/`, and that every reciprocal cross-link added in Group 19 is
        present in its target file's built HTML.
  - [x] Task 56.4. Spot-check at least one external URL per page (40+ checks) for a 404, prioritizing any URL
        not already confirmed live in issue #169's research; fix or replace any that fail.
        _Done: checked all 681 unique external URLs (not just a sample): 43 genuine 404s replaced with verified-live official
        alternatives (square.github.io → GitHub repos, WorkManager how-to → getting-started, etc.); re-check 657×200,
        only the 4 schemas.android.com XML namespace URIs (not links) and 3 bot-blocked Packt pages (403) remain._
