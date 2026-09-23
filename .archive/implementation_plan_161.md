# Implementation Plan: Guides & References / Apps — React Native

## Task summary

Source: GitHub issue #161
Base branch: main

Issue [#161](https://github.com/albertoirurueta/docs/issues/161) asks for a new **React Native** section under
*Guides & References → Apps*, the second sibling of the existing Android guide, authored directly into this
repo's own `ROOT` Antora component (this repo has no application source code — it *is* the Antora playbook +
root component, per `CLAUDE.md`). Concretely:

1. **31 new AsciiDoc pages** under `modules/ROOT/pages/apps/react-native/`: a landing `index.adoc` (with a
   `== Bibliography`), **29 concept pages**, and a `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/react-native-disclaimer.adoc` — like `messaging-disclaimer.adoc`
   and `ddd-microservices-disclaimer.adoc` (and unlike `oauth-disclaimer.adoc`/`springboot-disclaimer.adoc`),
   this contains **only** the house AI-assistance disclosure and the bibliography pointer, per the issue's
   explicit instruction that admonitions in this section state nothing else. The code baseline (React Native
   0.87, React 19.2, New Architecture, Hermes V1, Strict TypeScript API, Expo SDK 57) goes in ordinary prose on
   `index.adoc` and each page's intro, never inside an admonition.
3. **Site wiring**: a "React Native" bullet in `modules/ROOT/pages/apps/index.adoc`, a cross-reference sentence
   in `modules/ROOT/pages/apps/android/index.adoc`, an inline nav block in `modules/ROOT/nav.adoc` appended after
   the Android block, and React Native/Expo/Hermes/Fabric/Turbo-Modules terms added to the root
   `modules/ROOT/pages/index.adoc` `:keywords:`.
4. **Reciprocal cross-links** added to `web/react/index.adoc`, `web/react/getting-started.adoc`,
   `web/react/routing.adoc`, `web/react/styling-and-ui-libraries.adoc`,
   `programming-languages/typescript/jsx-and-frameworks.adoc`,
   `programming-languages/kotlin/kotlin-for-android.adoc`, `programming-languages/swift/index.adoc`,
   `programming-languages/objective-c/index.adoc`, `backend/oauth/native-and-mobile-apps.adoc`,
   `database/couchbase/sdks-and-mobile.adoc`,
   `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`, and
   `web/e2e-testing-real-browsers.adoc`.
5. **One new cheat-sheet PDF**: `modules/ROOT/attachments/react-native-cheat-sheet.pdf`, exactly one A4 page,
   rendered from a print-ready HTML/CSS layout via headless Chrome, visually consistent with
   `react-cheat-sheet.pdf` / `kotlin-cheat-sheet.pdf`.
6. Figures live under `modules/ROOT/images/` named `react-native-*.svg` (matching the `ddd-*.svg` /
   `decisions-and-migrations-*.svg` convention), and every `[mermaid]` block must pass
   `npm run validate:mermaid` before the final build task.

The full page outline, book sources (Kuttig's *Professional React Native*; Sakhniuk & Boduch's *React and React
Native*, 5th ed., Part II), online-source list, concept-to-book comparison table, and bibliography are already
fully specified in the issue body — this plan does not re-derive them, it sequences their creation into
buildable, reviewable groups and adds the one thing the issue leaves implicit: **a single canonical running app
every page's code examples must share** (the issue names it *Places* and sketches its screens in prose; this
plan gives it concrete TypeScript types, file paths, and API shapes), so pages build on each other without
diverging and the cheat sheet can reference one codebase. Neither book PDF is uploaded or read verbatim into any
page — only their publisher-page links and the already-worked-out bibliography entries are used; every code
example is written fresh against current React Native 0.87 / Expo SDK 57 and verified against the official
documentation, not transcribed from either book's own (RN 0.68-era, or React-18-era) listings.

Nothing in the issue is ambiguous enough to need a user decision: it already names every file, every source URL,
every page's required content and figures, the disclaimer's reduced content, and the bibliography structure. One
design choice is made here, on the user's behalf, per this skill's Step 4 (stated so it can be challenged during
review): the canonical navigation stack is **React Navigation 7 with the static configuration API** (a native
stack nested in bottom tabs) as the primary style every non-navigation page's screens are wired into, with
**Expo Router** shown as the file-based alternative only on `navigation.adoc` itself (restructuring the same
screens as files) rather than as a second parallel example on every other page — this keeps every other page's
code focused on its own topic instead of doubling every navigation-adjacent snippet.

No task below carries a language/framework tag: this repository has no installed `*-code-one-task` skill for
AsciiDoc/Antora documentation (only `iru-java-code-one-task`, `iru-java-springboot-code-one-task`,
`iru-dotnet-code-one-task` and `iru-database-code-one-task` are installed), per the same convention followed by
every prior plan in `.archive/` for this repository (e.g. `implementation_plan_152.md`, `implementation_plan_154.md`).
Every task here is a direct AsciiDoc/Antora documentation edit; the TypeScript/Kotlin/Swift snippets inside the
pages are illustrative prose content, not code this repository builds or tests.

## Current code state

This repository is the Antora playbook + `ROOT` component for https://albertoirurueta.github.io/docs. Relevant
existing structure (confirmed on `main` at commit `53a9ab36`, which already includes the `backend/architecture/`
regrouping from issue #154/#155):

- `modules/ROOT/nav.adoc` — the site nav; *Guides & References → Apps* currently reads:
  ```
  ** xref:apps/index.adoc[Apps]
  *** xref:apps/android/index.adoc[Android]
  +
  --
  include::partial$nav-kotlin.adoc[]
  --
  ```
  (line 801-805). The React Native block is inserted as a new `***` entry immediately after this Android block,
  before whatever nav entry currently follows *Guides & References → Apps* — React Native's own children are
  written inline (no separate `partial$nav-react-native.adoc`, since — unlike Android's Kotlin reference, which
  is shared with `programming-languages/kotlin/` — every React Native page lives only under
  `apps/react-native/`).
- `modules/ROOT/pages/apps/index.adoc` — the Apps landing page; one `== Sections` bullet (Android), one-line
  `:description:`/`:keywords:` naming Android/Kotlin only.
- `modules/ROOT/pages/apps/android/index.adoc` — the Android guide; currently just one `== Sections` bullet
  pointing at `programming-languages/kotlin/index.adoc[Kotlin Reference]`, no other prose.
- `modules/ROOT/pages/index.adoc` — root landing page; its `:keywords:` line already ends with
  `..., monolith, modular monolith, strangler fig, migration, API gateway, backends for frontends, SaaS,
  multi-tenant` (from #154).
- `modules/ROOT/partials/messaging-disclaimer.adoc` (and `ddd-microservices-disclaimer.adoc`,
  `decisions-and-migrations-disclaimer.adoc`) — the exact template to follow for the new
  `react-native-disclaimer.adoc`: a bare `[IMPORTANT]`/`====` block with the AI-assistance sentence plus a
  `xref:....adoc#_bibliography[...]` pointer, nothing else:
  ```
  [IMPORTANT]
  ====
  This content was generated with the assistance of AI and should be verified against the official documentation
  before being relied on in production; see xref:apps/react-native/index.adoc#_bibliography[the section
  bibliography] for the reference material consulted while preparing these pages.
  ====
  ```
- `modules/ROOT/pages/web/react/index.adoc` (21 sibling pages) — the existing React reference; its bibliography
  already cites `Sakhniuk, Mikhail & Boduch, Adam. React and React Native, 5th ed.` for Part I only, and its
  intro/`getting-started.adoc`/`routing.adoc`/`styling-and-ui-libraries.adoc` already mention React Native or
  Expo Router in passing (one line each) — the new pages must not re-explain JSX, Hooks, Context, effects,
  Suspense, Actions or the Rules of React; they link the React reference instead.
- `modules/ROOT/pages/programming-languages/typescript/jsx-and-frameworks.adoc` — already documents the
  `react-native` `jsx` compiler option in one line; the new `typescript.adoc` page links here for the language
  itself.
- `modules/ROOT/pages/programming-languages/kotlin/kotlin-for-android.adoc`,
  `modules/ROOT/pages/programming-languages/swift/index.adoc`,
  `modules/ROOT/pages/programming-languages/objective-c/index.adoc` — the native-language landing pages that
  the new `native-modules-and-components.adoc` page links to (Turbo Native Modules are written in Kotlin on
  Android and Swift/Objective-C++ on iOS).
- `modules/ROOT/pages/backend/oauth/native-and-mobile-apps.adoc` — documents PKCE, custom-scheme vs.
  universal/app links, and token storage for native apps generically; the new `security.adoc` page links here
  for the protocol and adds only the React Native realization (`react-native-app-auth`, Keychain/Keystore-backed
  storage).
- `modules/ROOT/pages/database/couchbase/sdks-and-mobile.adoc` — already mentions Couchbase Lite for
  "JavaScript/React Native" in one line; the new `storage-and-offline.adoc` page links here as one sync option.
- `modules/ROOT/pages/backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` — its mobile
  decision table has a "Cross-platform (Flutter, React Native)" row (line 461); the new `index.adoc` gains a
  link from that row.
- `modules/ROOT/pages/web/e2e-testing-real-browsers.adoc` — documents Selenium/Playwright/Cypress for browsers;
  the new `testing.adoc` page links here and covers only mobile-specific E2E (Detox/Maestro/Appium) itself.
- `modules/ROOT/attachments/react-cheat-sheet.pdf`, `kotlin-cheat-sheet.pdf` — the visual precedent for the new
  cheat sheet: A4 portrait, one page, multi-column colour-coded boxes, header line, italic breadcrumb footer.
  `.archive/implementation_plan_152.md` (Task 19.1) records that this style was reverse-engineered from a
  rendered PDF via PyMuPDF when no HTML/CSS source survived in git — the same approach applies here (inspect
  `react-cheat-sheet.pdf`, the closest in spirit to a JavaScript/TypeScript-ecosystem cheat sheet, rather than
  starting from a blank layout).
- `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` — validates every `[mermaid]` block in the repo;
  runs in CI and must pass before this plan's final task.
- Locally available tooling (confirmed during exploration): headless Chrome (`/Applications/Google Chrome.app`)
  and PyMuPDF (`python3 -c "import fitz"`) for producing and verifying the cheat-sheet PDF, matching the
  precedent's tooling exactly.
- `.archive/implementation_plan_152.md` (DDD and Microservices, issue #152) is the direct structural precedent
  for this plan: disclaimer group first, content pages grouped 2-4 per group in outline order, landing +
  cheat-sheet page last among content (needs every other page's final title/path), a dedicated cheat-sheet-PDF
  group, a non-parallel site-wiring group, a parallel cross-links group, and a final Mermaid-validation +
  build-verify group. `.archive/implementation_plan_154.md` is the most recent instance of the same pattern and
  confirms current nav.adoc/disclaimer conventions post-#154/#155.
- All 179 links in issue #161's body were checked by `curl` during its drafting; only `packtpub.com` (bot-blocking
  403) and `reactnavigation.org` (slow to automated fetches) failed to answer directly — both pages are live, per
  the issue text — so no source substitution is needed before writing `== References` sections.

### Running app model reference (canonical across every page — new, defined here)

Every code example in every page below must use **these exact names and shapes** unless a task explicitly says
otherwise, so `worked-example`-style assembly stays consistent and the cheat sheet can reference one codebase.
The app is **Places**, a travel-notes app: a list of places (`FlatList`), a place-details screen, an "add place"
form, favourites, a REST backend, local persistence with offline sync, OAuth sign-in, one native Turbo Module,
and a release pipeline. Project created with `npx create-expo-app@latest` (TypeScript template), package root
`com.irurueta.places` (iOS bundle id / Android application id).

**Feature-based source layout** (established in full on `tooling-metro-and-project-structure.adoc`, referenced
by file path from every other page):
```
src/
  app/App.tsx                        # root component, providers, RootNavigator
  navigation/RootNavigator.tsx        # React Navigation static config (native stack + bottom tabs)
  theme/{colors,spacing,typography}.ts, theme/ThemeProvider.tsx
  lib/apiClient.ts, lib/netinfo.ts
  native/HapticTap.ts                 # Turbo Native Module JS spec
  features/
    places/
      types.ts
      api/placesApi.ts
      hooks/usePlaces.ts, useAddPlace.ts, useTogglePlaceFavourite.ts
      components/PlaceCard.tsx
      screens/PlacesListScreen.tsx, PlaceDetailsScreen.tsx, AddPlaceScreen.tsx, FavouritesScreen.tsx
      store/useFavouritesStore.ts
      storage/placesRepository.ts
    auth/
      authSession.ts, secureTokenStore.ts, SignInScreen.tsx
    settings/
      SettingsScreen.tsx
```

**Domain type** (`src/features/places/types.ts`):
```typescript
export type PlaceId = string; // client-generated UUID

export type PlaceCategory = 'restaurant' | 'landmark' | 'nature' | 'other';

export interface Place {
  id: PlaceId;
  name: string;
  notes: string;
  category: PlaceCategory;
  favourite: boolean;
  visitedAt: string;          // ISO date
  latitude: number | null;
  longitude: number | null;
  photoUri: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewPlaceInput {
  name: string;
  notes: string;
  category: PlaceCategory;
  visitedAt: string;
  latitude: number | null;
  longitude: number | null;
  photoUri: string | null;
}
```

**Navigation params** (`src/navigation/RootNavigator.tsx`, React Navigation 7 static config — the canonical
style; `navigation.adoc` additionally shows the same tree as Expo Router files):
```typescript
export type RootStackParamList = {
  Tabs: undefined;
  PlaceDetails: { placeId: PlaceId };
  AddPlace: undefined;
  SignIn: undefined;
};

export type TabParamList = {
  PlacesList: undefined;
  Favourites: undefined;
  Settings: undefined;
};
```

**API client** (`src/lib/apiClient.ts` wraps `fetch` + `AbortController`; `src/features/places/api/placesApi.ts`):
```typescript
export interface PlacesPage {
  items: Place[];
  nextCursor: string | null;
}

export interface PlacesApi {
  listPlaces(cursor?: string): Promise<PlacesPage>;
  getPlace(id: PlaceId): Promise<Place>;
  addPlace(input: NewPlaceInput): Promise<Place>;
  toggleFavourite(id: PlaceId, favourite: boolean): Promise<Place>;
  deletePlace(id: PlaceId): Promise<void>;
}
```
Consumed through TanStack Query hooks: `usePlaces()` (`useInfiniteQuery`, pagination via `nextCursor`),
`useAddPlace()` / `useTogglePlaceFavourite()` (`useMutation` with optimistic updates and cache invalidation).

**Local persistence** (`src/features/places/storage/placesRepository.ts`, `expo-sqlite`): a `places` table
mirroring `Place`, plus a `pending_writes` queue table (`id`, `op`, `payload`, `created_at`) for offline
mutations, drained by a NetInfo-triggered sync worker.

**Global state**: `useFavouritesStore` (`src/features/places/store/useFavouritesStore.ts`, Zustand with the
`persist` middleware backed by MMKV) — `{ favouriteIds: Record<PlaceId, boolean>; toggleFavourite(id: PlaceId): void }`.
`state-management.adoc` additionally implements the same favourites use case with Context + `useReducer` and
with Redux Toolkit, for side-by-side comparison — none of the three replaces `useFavouritesStore` as the
canonical store the other pages import.

**Security** (`src/features/auth/`): `authSession.ts` wraps `react-native-app-auth`'s `authorize()`/`refresh()`
against a PKCE-enabled IdP, returning `{ accessToken, refreshToken, expiresAt }`; `secureTokenStore.ts` persists
that shape via `expo-secure-store`, never via AsyncStorage or the Zustand `persist` MMKV store; `apiClient.ts`'s
`authFetch` wrapper attaches `Authorization: Bearer` and calls `refresh()` on a 401.

**Native module** (`src/native/HapticTap.ts`, a Turbo Native Module spec):
```typescript
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type HapticStyle = 'light' | 'medium' | 'heavy';

export interface Spec extends TurboModule {
  tap(style: HapticStyle): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('HapticTap');
```
Realized on Android as a Kotlin `HapticTapModule`/`HapticTapPackage`, and on iOS as `HapticTap.swift` +
`HapticTap.mm`, both produced from this spec via Codegen (`codegenConfig` in `package.json`); called from
`PlaceCard`'s favourite toggle. `native-modules-and-components.adoc` also shows the same capability built with
the **Expo Modules API** as the framework-native alternative.

**Theme** (`src/theme/`): `colors`, `spacing`, `typography` token objects plus a `ThemeProvider`/`useTheme()`
Hook reading `useColorScheme()` for dark mode — used first on `styling.adoc` and `flexbox-layout.adoc`, then
reused (not redefined) by every later UI page.

**Release identity**: `app.config.ts` reading `EXPO_PUBLIC_API_URL` per environment; `eas.json` with
`development` / `preview` / `production` build profiles — established on `building-and-publishing.adoc`, reused
by `ci-cd-and-over-the-air-updates.adoc`.

Every task below that adds a TypeScript/Kotlin/Swift snippet must reuse these exact type/file/hook names; a task
may *add* a page-specific detail (e.g. a test, an extra field, a platform-specific variant) but must not rename
or reshape something another page already establishes.

## Implementation steps

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/react-native-disclaimer.adoc` — created; single `[IMPORTANT]`/`====`
      block, valid AsciiDoc, identical to `messaging-disclaimer.adoc` apart from the xref target (diffed to
      confirm). No tests/coverage apply (docs repo); license-header generation skipped (no license-header
      convention for `.adoc` partials in this repo). No blocker.
  - [x] Task 1.1. Write a single `[IMPORTANT]`/`====` block containing **only**: (a) the standard AI-assistance
        disclosure sentence ("This content was generated with the assistance of AI and should be verified
        against the official documentation before being relied on in production."); (b) a pointer to
        `xref:apps/react-native/index.adoc#_bibliography[the section bibliography]`. No version-baseline
        sentence, no book title, no evaluation paragraph.
  - [x] Task 1.2. Match `messaging-disclaimer.adoc`'s exact phrasing style (single short paragraph inside the
        admonition, semicolon joining the two clauses).

### Group 2 — Foundations, part 1 (Parallelizable: yes)

- [x] Task 2. `getting-started.adoc` — "Getting Started with React Native" — created
      `modules/ROOT/pages/apps/react-native/getting-started.adoc`; valid AsciiDoc (verified with the
      Asciidoctor gem, zero warnings/errors). No tests/coverage apply (docs repo); license-header generation
      skipped (no license-header convention for `.adoc` pages in this repo). No blocker.
  - [x] Task 2.1. What React Native is and is not (renders real native views, not a WebView; one JS codebase,
        two native apps; "learn once, write anywhere"); Android/iOS "different yet the same"; one-paragraph
        comparison with native (Kotlin/Swift), Flutter, PWAs and mobile web.
  - [x] Task 2.2. Frameworks: why the docs recommend one; **Expo** (`npx create-expo-app@latest`, Expo Go vs.
        development builds, Snack, `npx expo run:ios|android`) vs. the **React Native Community CLI**
        (`npx @react-native-community/cli init`, Xcode/Android Studio/Watchman/JDK/Node ≥ 22.13 requirements).
  - [x] Task 2.3. The generated project tree (`app/`, `app.json`, `ios/`, `android/`, `metro.config.js`,
        `babel.config.js`, `tsconfig.json`); running on the iOS Simulator, an Android emulator, and a physical
        device (Expo Go QR code, `adb`); the Dev Menu and Fast Refresh; troubleshooting the first run (port
        8081, Metro cache, `pod install`, Gradle).
  - [x] Task 2.4. Code: the *Places* `App.tsx` hello-world root component (`View`/`Text`/`StyleSheet`) and the
        `package.json` scripts, from the canonical layout.
  - [x] Task 2.5. Add: 📊 SVG "one codebase → Metro bundle → native app shell on each platform" — created
        `modules/ROOT/images/react-native-codebase-to-native-shells.svg` (valid XML); 📊 mermaid timeline of
        releases 0.76 → 0.82 → 0.84 → 0.87, verified against reactnative.dev's own 0.76/0.82/0.84/0.87 release
        posts — passes `npm run validate:mermaid`.
  - [x] Task 2.6. `== References` linking reactnative.dev's Getting Started / Environment setup / Set Up Your
        Environment pages and docs.expo.dev's Get Started page.

- [x] Task 3. `architecture-under-the-hood.adoc` — "React Native Architecture Under the Hood" — created
      `modules/ROOT/pages/apps/react-native/architecture-under-the-hood.adoc`; valid AsciiDoc (verified with
      the Asciidoctor gem, zero warnings/errors). No tests/coverage apply (docs repo); license-header
      generation skipped (no license-header convention for `.adoc` pages in this repo). No blocker.
  - [x] Task 3.1. The three threads (JS/Hermes, main/UI, background layout); **JSI** as the synchronous C++
        interface replacing the serialized bridge; **Fabric**'s render pipeline (render → commit → mount),
        shadow tree (Yoga layout), view flattening; **Turbo Native Modules** loaded lazily via a registry;
        **Codegen** producing native interfaces from TypeScript specs; bridgeless mode.
  - [x] Task 3.2. What concurrent React gives on native (automatic batching, Suspense, transitions, synchronous
        `useLayoutEffect` for measurements); the Legacy Bridge in one subsection (why it was async/serialized,
        why it was removed 0.82-0.84, what the interop layer still does).
  - [x] Task 3.3. Code: a `useLayoutEffect` + `measureInWindow` tooltip-positioning example next to its old
        `onLayout` equivalent; a `startTransition` search filter on the *Places* list.
  - [x] Task 3.4. Add: 📊 SVG of the three threads with JSI/Fabric between them — created
        `modules/ROOT/images/react-native-threads-and-jsi.svg`; 📊 mermaid sequence of the Fabric render
        pipeline for one state update — passes `npm run validate:mermaid`; 📊 SVG comparing bridge vs. JSI
        paths — created `modules/ROOT/images/react-native-bridge-vs-jsi.svg` (both SVGs valid XML).
  - [x] Task 3.5. `== References` linking reactnative.dev's Architecture Overview, Landing Page, Fabric Renderer,
        Render Pipeline, Threading Model, and Bundled Hermes pages.

### Group 3 — Foundations, part 2 (Parallelizable: yes)

- [x] Task 4. `core-components-and-react-fundamentals.adoc` — "Core Components and React Fundamentals" — created
      `modules/ROOT/pages/apps/react-native/core-components-and-react-fundamentals.adoc`; build-verified via
      `npx antora antora-playbook.yml` (exits 0; only pre-expected forward xrefs to not-yet-written pages in the
      plan's page list, same pattern as Group 2). No tests/coverage apply (docs repo); license-header generation
      skipped (no license-header convention for `.adoc` pages in this repo). No blocker.
  - [x] Task 4.1. Core Components (`View`, `Text`, `Image`, `TextInput`, `ScrollView`, …) vs. Native Components
        vs. community components, with a "which component for what" table including the Android-/iOS-only ones.
  - [x] Task 4.2. What is unchanged from React (JSX, props, state, Hooks, Context — linked to the React
        reference, not repeated) vs. what has no DOM equivalent here: text only inside `<Text>`, `onPress` not
        `onClick`, no `<div>`/`<span>`/CSS classes, no `react-dom`; `AppRegistry` and the root component; class
        components in one paragraph as legacy.
  - [x] Task 4.3. Code: the *Places* `PlaceCard` component built from `View`/`Text`/`Image`/`Pressable`, shown
        next to the same card's hypothetical React-DOM markup for contrast.
  - [x] Task 4.4. Add: 📊 SVG of the component → native-view mapping on both platforms — created
        `modules/ROOT/images/react-native-component-to-native-view-mapping.svg` (valid XML, verified with
        `python3 -c "import xml.dom.minidom"`).
  - [x] Task 4.5. `== References` linking reactnative.dev's Core Components and Native Components, React
        Fundamentals, and Components and APIs pages, plus react.dev.

- [x] Task 5. `typescript.adoc` — "TypeScript in React Native" — created
      `modules/ROOT/pages/apps/react-native/typescript.adoc`; build-verified via
      `npx antora antora-playbook.yml` (exits 0; only pre-expected forward xrefs). No tests/coverage apply
      (docs repo); license-header generation skipped (no license-header convention for `.adoc` pages in this
      repo). No blocker.
  - [x] Task 5.1. TypeScript as the template default (`tsconfig.json` extending `expo/tsconfig.base` /
        `@react-native/typescript-config`); the **Strict TypeScript API**: root exports only, types generated
        from source, `ViewInstance`/`TextInputInstance` ref types, the `customConditions` opt-out until 0.88,
        migrating deep imports.
  - [x] Task 5.2. Typing props (`ViewProps`, `TextProps`, `StyleProp<ViewStyle>`, `PressableProps`), refs
        (`useRef<TextInputInstance>(null)`), events (`NativeSyntheticEvent<TextInputChangeEventData>`,
        `LayoutChangeEvent`, `GestureResponderEvent`); forward pointers to typed navigation params and typed
        native-module specs (later pages); links to the TypeScript reference and the React TypeScript page for
        the language/React-typing patterns themselves.
  - [x] Task 5.3. Code: a fully typed `PlaceCard` with a `StyleProp<ViewStyle>` prop and a forwarded
        `ViewInstance` ref, plus the project's `tsconfig.json`.
  - [x] Task 5.4. Add: 📊 mermaid of the Strict-API import resolution (root export accepted vs. deep import
        rejected) — passes `npm run validate:mermaid`.
  - [x] Task 5.5. `== References` linking reactnative.dev's Using TypeScript and Strict TypeScript API pages,
        and the 0.87 release blog post.

- [x] Task 6. `javascript-runtime-and-hermes.adoc` — "The JavaScript Runtime and Hermes" — created
      `modules/ROOT/pages/apps/react-native/javascript-runtime-and-hermes.adoc`; build-verified via
      `npx antora antora-playbook.yml` (exits 0; only pre-expected forward xrefs). No tests/coverage apply
      (docs repo); license-header generation skipped (no license-header convention for `.adoc` pages in this
      repo). No blocker.
  - [x] Task 6.1. Which syntax Metro/Babel transform (`@react-native/babel-preset`) and which globals exist
        (`fetch`, `URL`/`URLSearchParams`, `FormData`, `Blob`/`File`, `AbortController`, timers,
        `requestAnimationFrame`, `requestIdleCallback`, `performance`, `console`, `__DEV__`) vs. what does not
        (`document`, `window` DOM, `localStorage`).
  - [x] Task 6.2. **Hermes**: why a purpose-built engine (ahead-of-time bytecode, startup time, memory);
        **Hermes V1** default since 0.84 and how to pin the previous compiler; JavaScriptCore/V8 as history;
        timers and `requestIdleCallback` replacing the 0.87-removed `InteractionManager`.
  - [x] Task 6.3. Code: a Hermes-capability check (`typeof HermesInternal`), an `AbortController`-driven fetch
        with a timeout, a `requestIdleCallback` deferral — link the JavaScript reference for `async`/`await` and
        Promises themselves.
  - [x] Task 6.4. Add: 📊 SVG of source → Metro → Hermes bytecode → device — created
        `modules/ROOT/images/react-native-metro-to-hermes.svg` (valid XML).
  - [x] Task 6.5. `== References` linking reactnative.dev's JavaScript Environment, Timers, and Using Hermes
        pages, and github.com/facebook/hermes.

### Group 4 — UI & layout, part 1 (Parallelizable: yes)

- [x] Task 7. `styling.adoc` — "Styling" — `modules/ROOT/pages/apps/react-native/styling.adoc` (all topics
      confirmed present: `StyleSheet.flatten`, `StyleSheet.absoluteFill`, `hairlineWidth`, `PixelRatio`,
      `Dimensions`/`useWindowDimensions`, `PlatformColor`/`DynamicColorIOS`, `useColorScheme`/`Appearance`,
      `expo-font`, design tokens, the landscape table, and a `[mermaid]` decision-flow diagram); one new SVG
      (`react-native-style-prop-families.svg`, valid XML); `== References` present with all required links; only
      canonical `xref:apps/react-native/*.adoc` file names used. No tests/coverage applicable (AsciiDoc-only
      repository); no license-header convention applies to `.adoc`/`.svg` files.
  - [x] Task 7.1. Inline styles vs. `StyleSheet.create` (validation, reuse, `StyleSheet.flatten`,
        `StyleSheet.absoluteFill`, `hairlineWidth`); style arrays and conditional styles; the style-prop
        families (view/text/image/layout/shadow); units in density-independent points, `PixelRatio`,
        `Dimensions` vs. `useWindowDimensions`.
  - [x] Task 7.2. Colours (`PlatformColor`, `DynamicColorIOS`); dark mode with `useColorScheme`/`Appearance` and
        a theme Context; custom fonts (`expo-font`); "make styling maintainable" (design tokens, a theme
        object, variants); the styling-solution landscape table (`StyleSheet`, Styled Components, NativeWind,
        Tamagui, Unistyles) and how to choose.
  - [x] Task 7.3. Code: the *Places* theme (`colors`/`spacing`/`typography`) and `useTheme()` Hook from the
        canonical model; `PlaceCard` styled with `StyleSheet`, then again with Styled Components and NativeWind
        for comparison.
  - [x] Task 7.4. Add: 📊 SVG of the style-prop families and which components accept them
        (`react-native-style-prop-families.svg`).
  - [x] Task 7.5. `== References` linking reactnative.dev's Style, Colors, and `StyleSheet`/`PixelRatio`/
        `Appearance`/`useColorScheme` API pages, plus NativeWind and Tamagui docs.

- [x] Task 8. `flexbox-layout.adoc` — "Flexbox Layout" — `modules/ROOT/pages/apps/react-native/flexbox-layout.adoc`
      (all topics confirmed present: full Flexbox prop set, safe areas/edge-to-edge, layout catalogue, the
      *Places* home-screen layout and tablet grid); two new SVGs (`react-native-flexbox-axes.svg`,
      `react-native-flexbox-layouts.svg`, both valid XML); `== References` present with all required links; only
      canonical `xref:apps/react-native/*.adoc` file names used. No tests/coverage applicable; no license-header
      convention applies.
  - [x] Task 8.1. Yoga's Flexbox: `flexDirection` (column by default — the key CSS difference), `justifyContent`,
        `alignItems`/`alignSelf`/`alignContent`, `flex`/`flexGrow`/`flexShrink`/`flexBasis`, `flexWrap`,
        `gap`/`rowGap`/`columnGap`, `position: 'absolute'` and `inset`, percentages/`aspectRatio`, `overflow`,
        `zIndex`.
  - [x] Task 8.2. Safe areas (`SafeAreaView`, `react-native-safe-area-context`) and edge-to-edge on Android 15+
        (0.86); responsive layouts with `useWindowDimensions`; rebuild the book's layout catalogue: three-column,
        flexible rows, flexible grids, rows and columns.
  - [x] Task 8.3. Code: the *Places* home-screen layout (header, list, floating action button) using the
        canonical theme tokens; a responsive two-column grid for tablets.
  - [x] Task 8.4. Add: 📊 SVG of the main/cross axis and alignment props (`react-native-flexbox-axes.svg`); 📊
        SVG of the three-column and grid layouts (`react-native-flexbox-layouts.svg`).
  - [x] Task 8.5. `== References` linking reactnative.dev's Layout with Flexbox, Layout Props, and
        `useWindowDimensions` pages, and yogalayout.dev.

- [x] Task 9. `images-and-icons.adoc` — "Images and Icons" —
      `modules/ROOT/pages/apps/react-native/images-and-icons.adoc` (all topics confirmed present: `Image`
      source shapes, `resizeMode`/`defaultSource`, `ImageBackground` deprecation, HEIC/HEIF, `expo-image`,
      aspect-ratio sizing, `react-native-svg`, icon sets, splash-screen forward link); one new SVG
      (`react-native-image-resize-modes.svg`, valid XML); `== References` present with all required links; only
      canonical `xref:apps/react-native/*.adoc` file names used. No tests/coverage applicable; no license-header
      convention applies.
  - [x] Task 9.1. `Image` sources: static (`require`, `@2x`/`@3x`), network (URI, headers, explicit size),
        `data:` URIs, `resizeMode`, `defaultSource`; the `ImageBackground` deprecation (0.87 — a `View` with a
        positioned `Image`); HEIC/HEIF (0.84); `expo-image` (blurhash, caching, transitions).
  - [x] Task 9.2. Resizing to the screen and aspect ratios; lazy-loading images in a `FlatList` (forward link to
        the lists page); SVG with `react-native-svg`; icon sets (`@expo/vector-icons`,
        `react-native-vector-icons`); app icons/splash screens noted as covered on the publishing page.
  - [x] Task 9.3. Code: the *Places* photo header using `expo-image` with a placeholder; an SVG marker icon for
        the map (forward reference to `device-capabilities.adoc`).
  - [x] Task 9.4. Add: 📊 SVG of the `resizeMode` values (`react-native-image-resize-modes.svg`).
  - [x] Task 9.5. `== References` linking reactnative.dev's Images and Image Style Props pages, docs.expo.dev's
        Image SDK page, and react-native-svg's docs.

### Group 5 — UI & layout, part 2 (Parallelizable: yes)

- [x] Task 10. `lists-and-scrolling.adoc` — "Lists and Scrolling" —
      `modules/ROOT/pages/apps/react-native/lists-and-scrolling.adoc` (all topics confirmed present:
      ScrollView vs. FlatList vs. SectionList/VirtualizedList, `useMemo`/`useDeferredValue` search,
      `onEndReached` pagination, `RefreshControl`, `onViewableItemsChanged`, FlatList tuning props, memoized
      rows, FlashList; the *Places* `PlacesListScreen` on `usePlaces()`; a `[mermaid]` sequence diagram); one
      new SVG (`react-native-flatlist-virtualization.svg`, valid XML); `== References` present with all
      required links; only canonical `xref:apps/react-native/*.adoc` file names used. No tests/coverage
      applicable (AsciiDoc-only repository); no license-header convention applies to `.adoc`/`.svg` files.
  - [x] Task 10.1. `ScrollView` (everything rendered, `contentContainerStyle`, horizontal, paging,
        `keyboardShouldPersistTaps`) vs. `FlatList` (virtualization, `data`/`renderItem`/`keyExtractor`,
        header/footer/empty components, `horizontal`, `numColumns`, `extraData`, `getItemLayout`);
        `SectionList`, `VirtualizedList`.
  - [x] Task 10.2. Sorting/filtering with `useMemo` and a search box with `useDeferredValue`; pagination with
        `onEndReached`/`onEndReachedThreshold`; pull to refresh with `RefreshControl`; `onViewableItemsChanged`;
        FlatList tuning props (`windowSize`, `maxToRenderPerBatch`, `initialNumToRender`,
        `removeClippedSubviews`, memoized items) and FlashList as the drop-in alternative.
  - [x] Task 10.3. Code: the *Places* list screen using `usePlaces()` (TanStack Query infinite pagination),
        search, and pull to refresh, from the canonical model.
  - [x] Task 10.4. Add: 📊 SVG of virtualization windows (`react-native-flatlist-virtualization.svg`); 📊 mermaid
        sequence of `onEndReached` → fetch next page → append.
  - [x] Task 10.5. `== References` linking reactnative.dev's Using a ScrollView, Using a ListView, and
        Optimizing FlatList Configuration pages, and Shopify's FlashList docs.

- [x] Task 11. `text-input-and-forms.adoc` — "Text Input and Forms" —
      `modules/ROOT/pages/apps/react-native/text-input-and-forms.adoc` (all topics confirmed present:
      controlled `TextInput`, `Switch`, list/date-time pickers, `KeyboardAvoidingView`/`Keyboard`/
      `InputAccessoryView`, React Hook Form + Zod, input accessibility forward link; the *Places*
      `AddPlaceScreen` on the canonical `NewPlaceInput` type; a `[mermaid]` state diagram). No new SVG
      required by this task. `== References` present with all required links; only canonical
      `xref:apps/react-native/*.adoc` file names used. No tests/coverage applicable; no license-header
      convention applies.
  - [x] Task 11.1. `TextInput` as a controlled input (`value`/`onChangeText`), `keyboardType`, `returnKeyType`/
        `onSubmitEditing`, `secureTextEntry`, `autoCapitalize`/`autoCorrect`/`autoComplete`, `multiline`, focus
        management with refs; `Switch`.
  - [x] Task 11.2. Selecting from a list (`@react-native-picker/picker`, a custom `Modal` picker); date/time
        (`@react-native-community/datetimepicker`); `KeyboardAvoidingView`, `Keyboard` events/dismissal,
        `InputAccessoryView` on iOS; form state/validation with React Hook Form + Zod; input accessibility.
  - [x] Task 11.3. Code: the *Places* "add place" form (name, notes, category picker, visited date, favourite
        switch) built with React Hook Form and the canonical `NewPlaceInput` type.
  - [x] Task 11.4. Add: 📊 mermaid state diagram of a controlled input's value flow.
  - [x] Task 11.5. `== References` linking reactnative.dev's Handling Text Input page and the `TextInput`/
        `Switch`/`KeyboardAvoidingView`/`Keyboard` API pages, plus React Hook Form's docs.

- [x] Task 12. `touches-and-gestures.adoc` — "Touches and Gestures" —
      `modules/ROOT/pages/apps/react-native/touches-and-gestures.adoc` (all topics confirmed present:
      `Pressable`/`Button`/legacy Touchables, the gesture responder system lifecycle and `PanResponder`, React
      Native Gesture Handler and `Swipeable`/cancellable gestures; a press-feedback `PlaceCard`, a draggable
      map pin via both `PanResponder` and Gesture Handler, and a `Swipeable` swipe-to-delete row; a `[mermaid]`
      sequence diagram of the responder negotiation); one new SVG (`react-native-pressable-states.svg`, valid
      XML); `== References` present with all required links; only canonical `xref:apps/react-native/*.adoc`
      file names used. No tests/coverage applicable; no license-header convention applies.
  - [x] Task 12.1. `Pressable` (press/long-press states as a style function, `hitSlop`, `android_ripple`,
        `disabled`); `Button`; the Touchables (`TouchableOpacity`/`TouchableHighlight`/`TouchableWithoutFeedback`/
        `TouchableNativeFeedback`) and why `Pressable` replaces them.
  - [x] Task 12.2. The gesture responder system lifecycle (`onStartShouldSetResponder` … `onResponderRelease`)
        and `PanResponder`; React Native Gesture Handler (`GestureDetector`, `Gesture.Pan()/Tap()/Pinch()`
        running on the UI thread), `Swipeable` rows and cancellable gestures.
  - [x] Task 12.3. Code: a `PlaceCard` with press feedback; a draggable map pin with `PanResponder` and again
        with Gesture Handler; a swipe-to-delete row on the *Places* list.
  - [x] Task 12.4. Add: 📊 mermaid sequence of the responder negotiation; 📊 SVG of `Pressable`'s state
        transitions (`react-native-pressable-states.svg`).
  - [x] Task 12.5. `== References` linking reactnative.dev's Handling Touches and Gesture Responder System
        pages, and Gesture Handler's docs.swmansion.com reference.

### Group 6 — UI & layout, part 3 (Parallelizable: yes)

- [x] Task 13. `animations.adoc` — "Animations" — created `modules/ROOT/pages/apps/react-native/animations.adoc`
      plus `modules/ROOT/images/react-native-animation-paths.svg`; mermaid validation passed (340/340 diagrams);
      SVG well-formed XML.
  - [x] Task 13.1. Why animations must not depend on the JS thread; the `Animated` API (`Animated.Value`/
        `useAnimatedValue`, `timing`/`spring`/`decay`, `Easing`, `interpolate`, `sequence`/`parallel`/`stagger`/
        `loop`, `Animated.event`); `useNativeDriver` and the 0.85 shared animation backend animating layout
        props natively; `LayoutAnimation`.
  - [x] Task 13.2. Reanimated (shared values, worklets on the UI thread, `useAnimatedStyle`, `withTiming`/
        `withSpring`, gesture-driven animations, entering/exiting/layout animations); `react-native-animatable`;
        Lottie for designer animations; an updated pros/cons comparison table.
  - [x] Task 13.3. Code: a fade-in `PlaceCard` with `Animated`; a scroll-driven collapsing header; the same fade
        with Reanimated; a Lottie loading animation.
  - [x] Task 13.4. Add: 📊 SVG of JS-driven vs. native-driven animation paths (`react-native-animation-paths.svg`);
        📊 mermaid sequence of a Reanimated worklet running on the UI thread.
  - [x] Task 13.5. `== References` linking reactnative.dev's Animations, `Animated`, and `LayoutAnimation` pages,
        Reanimated's docs, and Lottie's docs.

- [x] Task 14. `modals-alerts-and-progress.adoc` — "Modals, Alerts, and Progress" — created
      `modules/ROOT/pages/apps/react-native/modals-alerts-and-progress.adoc` plus
      `modules/ROOT/images/react-native-feedback-decision-table.svg`; no mermaid block added (none required);
      SVG well-formed XML.
  - [x] Task 14.1. The vocabulary (alert/modal/sheet/toast/activity indicator); `Alert` for confirmations and
        error confirmation; `Modal` (`animationType`, `presentationStyle`, `transparent`, `onRequestClose`) and
        bottom sheets.
  - [x] Task 14.2. Passive notifications (`ToastAndroid`, in-app banners); `ActivityIndicator`, measured progress
        bars, step progress, navigation indicators; activity modals; `StatusBar`, `Share`, `Vibration`/haptics
        (`expo-haptics`), `ActionSheetIOS`.
  - [x] Task 14.3. Code: a "delete place?" `Alert`; the *Places* `AddPlaceScreen` presented as a `Modal`; a
        sync-progress bar; a toast on save.
  - [x] Task 14.4. Add: 📊 SVG decision table of which feedback pattern to use when
        (`react-native-feedback-decision-table.svg`).
  - [x] Task 14.5. `== References` linking reactnative.dev's `Alert`, `Modal`, `ActivityIndicator`, `StatusBar`,
        `Share`, `Vibration`, `ToastAndroid`, and `ActionSheetIOS` API pages.

- [x] Task 15. `accessibility.adoc` — "Accessibility" — created
      `modules/ROOT/pages/apps/react-native/accessibility.adoc` plus
      `modules/ROOT/images/react-native-accessibility-tree.svg`; links `web/accessibility.adoc` (confirmed to
      exist) for WCAG; no mermaid block added (none required); SVG well-formed XML.
  - [x] Task 15.1. The props (`accessible`, `accessibilityLabel`/`Role`/`State`/`Value`/`Hint`,
        `accessibilityActions`/`onAccessibilityAction`, `accessibilityLiveRegion`, `importantForAccessibility`,
        `aria-*` aliases); grouping and focus order.
  - [x] Task 15.2. `AccessibilityInfo` (screen-reader/reduce-motion status, `announceForAccessibility`); large
        text and `allowFontScaling`; colour contrast and dark mode; testing with VoiceOver/TalkBack and the
        Accessibility Inspector; link the web accessibility page for WCAG.
  - [x] Task 15.3. Code: an accessible `PlaceCard` and favourite toggle with `accessibilityRole`,
        `accessibilityState`, and an `accessibilityAction`.
  - [x] Task 15.4. Add: 📊 SVG of a card annotated with its accessibility tree
        (`react-native-accessibility-tree.svg`).
  - [x] Task 15.5. `== References` linking reactnative.dev's Accessibility and `AccessibilityInfo` pages.

### Group 7 — Navigation, platform & device (Parallelizable: yes)

- [x] Task 16. `navigation.adoc` — "Navigation" — created
      `modules/ROOT/pages/apps/react-native/navigation.adoc`; valid AsciiDoc following the established page
      conventions. No tests/coverage apply (docs repo); license-header generation skipped (no license-header
      convention for `.adoc`/`.svg` files in this repo). No blocker.
  - [x] Task 16.1. Mobile navigation patterns (stack/tabs/drawer/modal) and platform conventions; **React
        Navigation 7**'s static configuration API (`createNativeStackNavigator`, `createStaticNavigation`,
        `StaticParamList`, `useNavigation`/`useRoute`), headers and header buttons, bottom tabs and drawer,
        nesting, `navigate` vs. `push` vs. `goBack`.
  - [x] Task 16.2. **Expo Router**: file-based routes under `app/`, `_layout.tsx`, dynamic segments, `Link`/
        `router`, typed routes, tabs/stacks as layouts — shown restructuring the *same* screen tree as files;
        deep links and universal/app links with `Linking`; Android hardware back with `BackHandler`;
        react-native-navigation named as the native alternative.
  - [x] Task 16.3. Code: the *Places* stack (Tabs → PlaceDetails with a typed `placeId` param, AddPlace, SignIn)
        + bottom tabs (PlacesList/Favourites/Settings) in React Navigation, from `RootNavigator.tsx`'s canonical
        types; the same tree as Expo Router files.
  - [x] Task 16.4. Add: 📊 SVG of the *Places* navigation tree (`react-native-places-navigation-tree.svg`,
        valid XML, styled after `react-native-accessibility-tree.svg`); 📊 mermaid sequence of a deep link
        opening the details screen — passes `npm run validate:mermaid`.
  - [x] Task 16.5. `== References` linking reactnative.dev's Navigating Between Screens and `Linking` pages,
        reactnavigation.org's Getting Started guide, and docs.expo.dev's Router Introduction.

- [x] Task 17. `platform-specific-code-and-device-apis.adoc` — "Platform-Specific Code and Device APIs" —
      created `modules/ROOT/pages/apps/react-native/platform-specific-code-and-device-apis.adoc`; valid
      AsciiDoc following the established page conventions. No tests/coverage apply (docs repo); license-header
      generation skipped (no license-header convention for `.adoc`/`.svg` files in this repo). No blocker.
  - [x] Task 17.1. `Platform.OS`/`Version`/`select`/`isPad`/`isTV`; platform file extensions (`.ios.tsx`,
        `.android.tsx`, `.native.tsx`, `.web.tsx`) and Metro's resolution order.
  - [x] Task 17.2. The device/app-state APIs: `Dimensions`/`useWindowDimensions`, `AppState`, `Appearance`,
        `Linking`, `Share`, `Vibration`, `Keyboard`, `I18nManager`/RTL, `PermissionsAndroid`, `BackHandler`,
        `Settings` (iOS), `DevSettings`; the DOM-like ref node APIs since 0.82 (`getBoundingClientRect`,
        `parentNode`).
  - [x] Task 17.3. Code: a `Platform.select`-styled header; an `AppState` listener pausing the *Places* sync
        worker in the background; a "share this place" button using `Share`.
  - [x] Task 17.4. Add: 📊 mermaid of `AppState` transitions; 📊 SVG of the extension-resolution order
        (`react-native-platform-extension-resolution.svg`, valid XML) — mermaid passes
        `npm run validate:mermaid`.
  - [x] Task 17.5. `== References` linking reactnative.dev's Platform-Specific Code, `Platform`, `AppState`, and
        `Linking` pages.

- [x] Task 18. `device-capabilities.adoc` — "Device Capabilities" — created
      `modules/ROOT/pages/apps/react-native/device-capabilities.adoc`; valid AsciiDoc following the established
      page conventions. No tests/coverage apply (docs repo); license-header generation skipped (no
      license-header convention for `.adoc`/`.svg` files in this repo). No blocker.
  - [x] Task 18.1. The permission model on iOS (`Info.plist` usage strings) and Android (`AndroidManifest.xml`,
        runtime permissions, `PermissionsAndroid`, Expo's `permissions` config).
  - [x] Task 18.2. Geolocation with `expo-location` (foreground/background, accuracy, watching); maps with
        `react-native-maps` (provider, region, markers, callouts, overlays); camera/media with `expo-camera`/
        `expo-image-picker`; push notifications (APNs/FCM via `expo-notifications`, tokens, foreground handling,
        deep links from notifications); sensors/haptics/biometrics in one table; how to choose a community
        module (React Native Directory, New-Architecture support).
  - [x] Task 18.3. Code: the *Places* "use my location" button and a map showing saved places as markers; a
        notification permission request.
  - [x] Task 18.4. Add: 📊 mermaid sequence of a runtime permission request; 📊 SVG of the push-notification
        delivery path (`react-native-push-notification-path.svg`, valid XML) — mermaid passes
        `npm run validate:mermaid`.
  - [x] Task 18.5. `== References` linking docs.expo.dev's Location, Camera, and Notifications SDK pages,
        react-native-maps's docs, and reactnative.directory.

### Group 8 — Data & state (Parallelizable: yes)

- [x] Task 19. `state-management.adoc` — "State Management" — created
      `modules/ROOT/pages/apps/react-native/state-management.adoc`; valid AsciiDoc (fences balanced, xrefs on the
      approved list), no license header applicable (docs-only repo).
  - [x] Task 19.1. Local vs. global vs. server state; props drilling and when to stop; Context + `useReducer`
        (its re-render cost); Zustand (store, selectors, `persist` middleware); Redux Toolkit (slices,
        `createAsyncThunk`, RTK Query) and when a team wants it; MobX in one subsection.
  - [x] Task 19.2. TanStack Query for server state (forward link to networking); mobile-specific concerns:
        navigation state is not app state, persisting/rehydrating on cold start, `AppState`-aware refetching; a
        decision table.
  - [x] Task 19.3. Code: the *Places* favourites use case implemented three ways — Context + `useReducer`,
        `useFavouritesStore` (Zustand + `persist`, the canonical store other pages import), and Redux Toolkit —
        for side-by-side comparison.
  - [x] Task 19.4. Add: 📊 SVG of local/global/server state boundaries in *Places*
        (`react-native-state-boundaries.svg`, new); 📊 mermaid of the reducer flow (validated via
        `npm run validate:mermaid`).
  - [x] Task 19.5. `== References` linking Zustand, Redux Toolkit, and MobX docs, and TanStack Query's docs
        (forward-linked from the networking page too).

- [x] Task 20. `networking-and-data-fetching.adoc` — "Networking and Data Fetching" — created
      `modules/ROOT/pages/apps/react-native/networking-and-data-fetching.adoc`; valid AsciiDoc (fences balanced,
      xrefs on the approved list, GraphQL/backend xrefs verified to exist), no realistic-looking secrets found
      (grepped for credential-like patterns), no license header applicable (docs-only repo).
  - [x] Task 20.1. `fetch` (JSON, headers, `FormData` uploads, `AbortController`, timeouts), `XMLHttpRequest`
        (progress events), `WebSocket`; App Transport Security on iOS and cleartext traffic on Android (dev
        servers on `10.0.2.2`/`localhost`).
  - [x] Task 20.2. TanStack Query (queries, mutations, invalidation, infinite queries, `networkMode`,
        persistence), axios, GraphQL with Apollo (link the GraphQL reference); error handling/retries/backoff;
        inspecting requests in React Native DevTools (forward link); typed API clients.
  - [x] Task 20.3. Code: the *Places* `apiClient.ts` (`fetch` + Zod validation) and `placesApi.ts` from the
        canonical model; `usePlaces()`/`useAddPlace()` with TanStack Query; a WebSocket live-update hook.
  - [x] Task 20.4. Add: 📊 mermaid sequence of a mutation with an optimistic update and cache invalidation
        (validated via `npm run validate:mermaid`).
  - [x] Task 20.5. `== References` linking reactnative.dev's Networking and Security (ATS/cleartext) pages, and
        TanStack Query's docs.

- [x] Task 21. `storage-and-offline.adoc` — "Storage and Offline" — created
      `modules/ROOT/pages/apps/react-native/storage-and-offline.adoc`; valid AsciiDoc (fences balanced, xrefs on
      the approved list, `database/couchbase/sdks-and-mobile.adoc` xref verified to exist), no license header
      applicable (docs-only repo).
  - [x] Task 21.1. The options and what each is for: AsyncStorage (async, unencrypted, not for secrets); MMKV
        (synchronous, fast, optionally encrypted); SQLite (`expo-sqlite`/`react-native-quick-sqlite`,
        migrations); document/sync databases (WatermelonDB, Realm/Atlas Device SDK, Couchbase Lite — link
        `database/couchbase/sdks-and-mobile.adoc`); files (`expo-file-system`); secure storage forward-linked to
        the security page.
  - [x] Task 21.2. Detecting connectivity with NetInfo (`isConnected` vs. `isInternetReachable`, `useNetInfo`);
        offline-first strategies (cache-then-network, a local write queue with retry on reconnect,
        timestamps/versions and conflict resolution, TanStack Query's offline mutation queue); storage limits
        and OS eviction.
  - [x] Task 21.3. Code: `placesRepository.ts` on `expo-sqlite` with the `places` and `pending_writes` tables
        from the canonical model; a queued `addPlace` mutation that syncs when NetInfo reports reachability; an
        MMKV-backed settings store.
  - [x] Task 21.4. Add: 📊 SVG comparing the storage options (`react-native-storage-options.svg`, new); 📊 mermaid
        sequence of offline write → reconnect → sync → conflict (validated via `npm run validate:mermaid`).
  - [x] Task 21.5. `== References` linking reactnative.dev's Security (Async Storage section) page,
        react-native-async-storage's, MMKV's, and `expo-sqlite`'s docs, and NetInfo's docs.

- [x] Task 22. `security.adoc` — "Security" — created
      `modules/ROOT/pages/apps/react-native/security.adoc`; valid AsciiDoc (fences balanced, xrefs on the
      approved list, `backend/oauth/native-and-mobile-apps.adoc` xref verified to exist); `detect-secrets scan`
      run directly against the new file returned zero findings (only obvious placeholders like `<client-id>` were
      used); no license header applicable (docs-only repo).
  - [x] Task 22.1. Secrets do not belong in the bundle; secure storage with `expo-secure-store`/
        `react-native-keychain` (Keychain Services, Android Keystore/EncryptedSharedPreferences) vs. AsyncStorage,
        and not leaking tokens into persisted Zustand/Redux state or crash reports.
  - [x] Task 22.2. Deep-link hijacking and why `app://auth?token=` is unsafe — universal/app links; **OAuth 2.0
        with PKCE** in a native app with `react-native-app-auth`/`expo-auth-session` (link
        `backend/oauth/native-and-mobile-apps.adoc` for the protocol); network security (HTTPS/ATS, certificate
        pinning trade-offs); biometric gating (`expo-local-authentication`); jailbreak/root detection and
        screenshot prevention in one paragraph; a checklist.
  - [x] Task 22.3. Code: the *Places* `authSession.ts`/`secureTokenStore.ts` sign-in with `react-native-app-auth`
        (PKCE), storing the refresh token in `expo-secure-store` and never in AsyncStorage; the `authFetch`
        wrapper.
  - [x] Task 22.4. Add: 📊 mermaid sequence of the PKCE flow through the system browser back into the app
        (validated via `npm run validate:mermaid`); 📊 SVG of the storage security ladder
        (`react-native-storage-security-ladder.svg`, new).
  - [x] Task 22.5. `== References` linking reactnative.dev's Security page, `react-native-app-auth`'s docs, and
        Apple's/Android's universal-links/app-links documentation.

### Group 9 — Quality: debugging, testing & performance (Parallelizable: yes)

- [x] Task 23. `debugging-and-devtools.adoc` — "Debugging and DevTools" —
      `modules/ROOT/pages/apps/react-native/debugging-and-devtools.adoc` (all topics confirmed present: Dev
      Menu, LogBox, React Native DevTools panels with a table mapped to the new SVG, 0.85 multi-connection note,
      what's gone (Flipper, remote Chrome debugger); Xcode/Android Studio native debugging, `adb logcat`/`xcrun
      simctl`, `debugOptimized`, release-build source maps; `PlacesErrorBoundary`, global `ErrorUtils` handler,
      Sentry init with a safe placeholder DSN and forward link to `ci-cd-and-over-the-air-updates.adoc`,
      `DevSettings`/`__DEV__`; closing `[mermaid]` error-path flowchart); one new SVG
      (`react-native-devtools-panels.svg`, valid XML); `== References` present with all five required links; only
      canonical `xref:apps/react-native/*.adoc` file names used; no real-looking credential (Sentry DSN uses an
      obvious `<key>`/`<project>` placeholder, confirmed clean by `detect-secrets scan`). No tests/coverage
      applicable; no license-header convention applies.
  - [x] Task 23.1. The Dev Menu (reload, Fast Refresh, element inspector, performance monitor); LogBox; React
        Native DevTools (console, sources/breakpoints, network, memory, React Components/Profiler panels;
        multiple connections since 0.85); what is gone (Flipper, the remote Chrome debugger).
  - [x] Task 23.2. Debugging native code in Xcode/Android Studio (`adb logcat`, `xcrun simctl`), the
        `debugOptimized` Android variant; debugging release builds with source maps; error boundaries, global
        error handlers, crash reporting (Sentry, Crashlytics) with symbolicated stacks; `DevSettings`/`__DEV__`.
  - [x] Task 23.3. Code: a `PlacesErrorBoundary`; Sentry initialization with source-map upload noted as a build
        step (forward link to CI/CD).
  - [x] Task 23.4. Add: 📊 SVG of the DevTools panels mapped to what they inspect
        (`react-native-devtools-panels.svg`); 📊 mermaid of the error path (throw → boundary → report).
  - [x] Task 23.5. `== References` linking reactnative.dev's Debugging, React Native DevTools, Debugging Native
        Code, and Debugging Release Builds pages, and Sentry's React Native docs.

- [x] Task 24. `testing.adoc` — "Testing" — `modules/ROOT/pages/apps/react-native/testing.adoc` (all topics
      confirmed present: mobile test pyramid with the new SVG, ESLint 9 flat config, `tsc --noEmit`,
      `jest-expo`/`@react-native/jest-preset`, native/Expo module mocking; React Native Testing Library
      (`render`/`screen`, queries, `userEvent`/`fireEvent`, `waitFor`, `renderHook`), testing navigation and
      TanStack Query, snapshot-test guidance, Detox/Maestro/Appium E2E, Storybook, link to
      `web/e2e-testing-real-browsers.adoc`; unit test of the *Places* favourites reducer reused verbatim from
      `state-management.adoc`, RNTL test of `AddPlaceScreen` reused verbatim from `text-input-and-forms.adoc`, a
      Detox flow and a Maestro flow for "add a place and see it in the list"); one new SVG
      (`react-native-test-pyramid.svg`, valid XML); `== References` present with all five required links; only
      canonical `xref:apps/react-native/*.adoc` file names used (plus the required `web/e2e-testing-real-browsers.adoc`
      link, verified to exist). No tests/coverage applicable to this docs-only repo (all test code is illustrative
      `[source]` content, not files executed by this repository); no license-header convention applies.
  - [x] Task 24.1. The mobile test pyramid (static analysis → unit → component → E2E); ESLint 9 flat config and
        `tsc --noEmit` as tests; Jest with `@react-native/jest-preset` (0.85)/`jest-expo`, mocking native and
        Expo modules.
  - [x] Task 24.2. React Native Testing Library (`render`/`screen`, queries, `userEvent`/`fireEvent`,
        `waitFor`, testing Hooks); testing navigation and TanStack Query; snapshot tests and why to keep them
        small; E2E with Detox, Maestro, and Appium; Storybook for components; link
        `web/e2e-testing-real-browsers.adoc` for the browser-side tools.
  - [x] Task 24.3. Code: a unit test of the favourites reducer; an RNTL test of the "add place" form; a Detox
        flow and a Maestro flow for "add a place and see it in the list".
  - [x] Task 24.4. Add: 📊 SVG of the mobile test pyramid with tools per level
        (`react-native-test-pyramid.svg`).
  - [x] Task 24.5. `== References` linking reactnative.dev's Testing Overview page, React Native Testing
        Library's, Detox's, Maestro's, and Appium's docs.

- [x] Task 25. `performance.adoc` — "Performance" — `modules/ROOT/pages/apps/react-native/performance.adoc`
      (all topics confirmed present: 60fps/two-thread frame budget with the new SVG, common jank causes, the
      Performance Monitor; FlatList tuning linked back to `lists-and-scrolling.adoc`; JavaScript loading
      (Hermes bytecode linked to `javascript-runtime-and-hermes.adoc`, inline/lazy `require`, `React.lazy`);
      memoization and the React Compiler linked to `web/react/performance.adoc`; native-driven
      animations/gestures linked back to `animations.adoc`/`touches-and-gestures.adoc`; profiling with DevTools
      Profiler, Perfetto/`Systrace`, Xcode Instruments, `performance.mark`/`PerformanceObserver`; build speed
      (precompiled iOS binaries since 0.84, Gradle caching, ccache); `React.memo` + `useCallback` list-item code,
      a lazy-required `SettingsScreen`, `performance.mark`/`measure` startup code; closing `[mermaid]`
      "which thread is dropping frames?" flowchart); one new SVG (`react-native-frame-budget.svg`, valid XML);
      `== References` present with all four required links; only canonical `xref:apps/react-native/*.adoc` file
      names used (plus the verified `web/react/performance.adoc` link). No tests/coverage applicable; no
      license-header convention applies.
  - [x] Task 25.1. What "60 fps" means with two threads and which thread each stall belongs to; common causes
        (dev-mode logging, slow list rendering, JS-thread work during animations, unnecessary re-renders,
        oversized images, heavy startup work); the Performance Monitor.
  - [x] Task 25.2. FlatList tuning (link back); optimizing JavaScript loading (Hermes bytecode, inline/lazy
        `require`, `React.lazy` for screens); memoization and the React Compiler (link the React performance
        page); native-driven animations/gestures (link back); profiling with DevTools' Performance/Profiler
        panels, Perfetto/`Systrace` on Android, Xcode Instruments on iOS, `performance.mark`/`PerformanceObserver`;
        build speed (precompiled iOS binaries since 0.84, Gradle caching, ccache).
  - [x] Task 25.3. Code: a `React.memo` + `useCallback` list item; a lazy-required heavy screen;
        `performance.mark`/`measure` around startup.
  - [x] Task 25.4. Add: 📊 SVG of the two-thread frame budget (`react-native-frame-budget.svg`); 📊 mermaid
        flowchart "which thread is dropping frames?".
  - [x] Task 25.5. `== References` linking reactnative.dev's Performance Overview, Speeding up your Build phase,
        Optimizing JavaScript loading, and Profiling pages.

### Group 10 — Native modules & brownfield (Parallelizable: yes)

- [x] Task 26. `native-modules-and-components.adoc` — "Native Modules and Components"
  - [ ] Task 26.1. When native code is necessary; the Turbo Native Module workflow: a TypeScript spec →
        `codegenConfig` → Codegen output → Kotlin implementation (`TurboModule`, `ReactPackage`) → iOS
        implementation (Objective-C++/Swift) → promises/events/constants.
  - [ ] Task 26.2. Cross-platform C++ modules; a Fabric Native Component (`codegenNativeComponent`, the Kotlin
        `ViewManager`, the iOS `RCTViewComponentView`), props and commands; packaging as a library
        (`create-react-native-library`/`react-native-builder-bob`); the Expo Modules API (Swift/Kotlin DSL) and
        config plugins as the framework path; the legacy `NativeModules`/`requireNativeComponent` in one
        subsection as history; link the Kotlin/Swift/Objective-C references.
  - [ ] Task 26.3. Code: the *Places* `HapticTap` Turbo Native Module end to end — the `src/native/HapticTap.ts`
        spec from the canonical model, the Kotlin implementation, the Swift/Objective-C++ implementation, and
        its use from `PlaceCard`'s favourite toggle; a minimal Fabric component; the same capability with the
        Expo Modules API.
  - [ ] Task 26.4. Add: 📊 mermaid flowchart of spec → Codegen → native interfaces → implementation; 📊 SVG of
        the Turbo Module registry and JSI call path (`react-native-turbo-module-registry.svg`).
  - [ ] Task 26.5. `== References` linking reactnative.dev's Native Platform, Turbo Native Modules, Codegen,
        and Fabric Native Components pages, and docs.expo.dev's Modules Overview.

- [x] Task 27. `brownfield-integration.adoc` — "Brownfield Integration"
  - [ ] Task 27.1. Adding React Native to an existing Android app (Gradle setup, the React Native Gradle plugin,
        `ReactHost`/`ReactActivity` or a `ReactFragment` inside an existing activity) and iOS app (CocoaPods or
        the experimental Swift Package Manager, `RCTReactNativeFactory`, a `UIViewController` hosting the React
        root view).
  - [ ] Task 27.2. Passing initial props, sending events native→JS and calling native from JS (link back to
        native modules), sharing navigation between native and React screens; Headless JS for background tasks
        on Android; iOS app extensions and their memory limits; multiple React roots; upgrading a brownfield app.
  - [ ] Task 27.3. Code: an Android `ReactFragment` embedding of the *Places* `PlacesListScreen` and the iOS
        view-controller equivalent; a Headless JS sync task.
  - [ ] Task 27.4. Add: 📊 SVG of a native app hosting two React Native roots
        (`react-native-brownfield-roots.svg`); 📊 mermaid sequence of native → JS event → native callback.
  - [ ] Task 27.5. `== References` linking reactnative.dev's Integration with Existing Apps, Integration with an
        Android Fragment, Communication (Android/iOS), Headless JS, and App Extensions pages.

### Group 11 — Tooling & delivery (Parallelizable: yes)

- [x] Task 28. `tooling-metro-and-project-structure.adoc` — "Tooling, Metro, and Project Structure"
  - [ ] Task 28.1. Metro (resolver → transformer → serializer), `metro.config.js`/`.mts` (0.87), platform and
        `.native`/`.web` resolution, `watchFolders` for monorepos, source maps, Metro TLS; Babel; installing and
        autolinking libraries (CocoaPods/SwiftPM, Gradle, `npx expo install`), New-Architecture/Expo
        compatibility checks.
  - [ ] Task 28.2. ESLint 9 flat config, Prettier, `@react-native/eslint-config`; boilerplates and UI libraries
        (React Native Paper, gluestack, Tamagui) in one table; **project structure for large teams** (the
        feature-based layout from the canonical model, path aliases); universal apps with `react-native-web` and
        `.native.tsx`/`.web.tsx` splits; monorepos (workspaces, `watchFolders`, `nodeModulesPaths`); publishing a
        library with `react-native-builder-bob`; upgrading (Upgrade Helper) and release levels (stable/
        experimental/canary); TV and out-of-tree platforms.
  - [ ] Task 28.3. Code: `metro.config.js` for a monorepo; the *Places* `src/` tree as a fenced block (the
        canonical layout); a `PlaceCard.web.tsx` split; a `.bob` config sketch.
  - [ ] Task 28.4. Add: 📊 SVG of the Metro pipeline (`react-native-metro-pipeline.svg`); 📊 SVG of the
        feature-based folder layout (`react-native-project-structure.svg`).
  - [ ] Task 28.5. `== References` linking reactnative.dev's Metro, Using Libraries, Upgrading, Release Levels,
        and Out-of-Tree Platforms pages, and react-native-web's, react-native-builder-bob's docs.

- [x] Task 29. `building-and-publishing.adoc` — "Building and Publishing"
  - [ ] Task 29.1. App identity (bundle id/application id, display name, version/build number, `app.json`/
        `app.config.ts` from the canonical model, icons/splash screens with `expo-splash-screen`).
  - [ ] Task 29.2. Android release builds (`./gradlew bundleRelease`, upload keystore, Play App Signing, AAB vs.
        APK, ProGuard/R8, Play Console tracks); iOS (certificates, identifiers, provisioning profiles, Xcode
        archiving, App Store Connect, TestFlight, review guidelines, privacy manifests); EAS Build/Submit vs.
        local builds; environment variables per environment; store assets/metadata.
  - [ ] Task 29.3. Code: the *Places* `eas.json` profiles (development/preview/production) and `app.config.ts`
        with per-environment ids from the canonical model; the Gradle signing config sketch.
  - [ ] Task 29.4. Add: 📊 mermaid flowchart from commit to store listing on each platform; 📊 SVG of the iOS
        signing pieces (`react-native-ios-signing-pieces.svg`).
  - [ ] Task 29.5. `== References` linking reactnative.dev's Publishing to Google Play Store and Publishing to
        Apple App Store pages, docs.expo.dev's Build/Submit Introduction pages, and Android's app-signing docs.

- [x] Task 30. `ci-cd-and-over-the-air-updates.adoc` — "CI/CD and Over-the-Air Updates"
  - [ ] Task 30.1. A CI pipeline for *Places* on GitHub Actions: install, lint, type-check, Jest, a Detox or
        Maestro E2E job on a macOS runner with the iOS Simulator and an Android emulator, caching (npm, Gradle,
        CocoaPods).
  - [ ] Task 30.2. CD with EAS Workflows or Fastlane (`match`/`gym`/`supply`/`pilot`); over-the-air updates — what
        the stores allow (JS/assets only), EAS Update (channels, branches, runtime versions, rollouts/rollbacks,
        `expo-updates` in a bare app), the retired Microsoft CodePush and its self-hosted successor as the
        migration path; stability monitoring, feature flags, and A/B testing; the book's six tips restated for
        2026.
  - [ ] Task 30.3. Code: `.github/workflows/ci.yml`; the `eas.json` update channels and an `expo-updates`
        check-on-launch snippet; a Fastlane lane sketch.
  - [ ] Task 30.4. Add: 📊 mermaid flowchart of the pipeline (PR → CI → build → store/OTA); 📊 SVG of runtime
        versions vs. update branches (`react-native-runtime-versions-vs-branches.svg`).
  - [ ] Task 30.5. `== References` linking docs.expo.dev's EAS Workflows and EAS Update Introduction pages,
        Fastlane's docs, and GitHub Actions' docs.

### Group 12 — Landing page and cheat-sheet page (Parallelizable: yes — both only read the finished state of Groups 1-11, neither touches the other's file)

- [x] Task 31. `index.adoc` — "React Native" landing page
  - [ ] Task 31.1. One paragraph on what the section is about; the code baseline in prose (React Native 0.87,
        React 19.2, New Architecture, Hermes V1, Strict TypeScript API, Expo SDK 57), including the version
        timeline table (0.76 → 0.82 → 0.84 → 0.87) per the issue.
  - [ ] Task 31.2. A "new here? read in this order" pointer: getting started → core components → styling and
        Flexbox → lists and input → navigation → state and networking → storage and security → debugging,
        testing and performance → native modules → build, publish and OTA.
  - [ ] Task 31.3. The full "What's covered" list grouped exactly as the issue's page outline (Foundations; UI &
        layout; Navigation, platform & device; Data & state; Quality; Native, tooling & delivery), each item an
        `xref:` with a one-line description, plus a `cheat-sheet.adoc` line.
  - [ ] Task 31.4. Relationship to the React, JavaScript, TypeScript, Kotlin, Swift, Objective-C, OAuth, and
        Couchbase references — one short paragraph naming each with its xref.
  - [ ] Task 31.5. `== Bibliography` section, grouped exactly as the issue specifies: official React Native
        documentation; Expo documentation; ecosystem documentation; language references; consulted reference
        books (Kuttig — Packt; Sakhniuk & Boduch — Packt, noting Part I is already the React reference's basis),
        each linked to its official/publisher page; close with the house-style note that the books are
        consulted references only and reactnative.dev/docs.expo.dev/each library's own docs are authoritative on
        any discrepancy.

- [x] Task 32. `cheat-sheet.adoc` — "React Native Cheat Sheet"
  - [ ] Task 32.1. A short intro paragraph naming everything the sheet covers, cross-referencing all 29 topic
        pages by `xref:`, grouped the same way as `index.adoc`'s "What's covered".
  - [ ] Task 32.2. Link the PDF: `xref:attachment$react-native-cheat-sheet.pdf[Download the React Native Cheat
        Sheet (PDF)]`.

### Group 13 — Cheat-sheet PDF (Parallelizable: yes — single task)

Depends on Group 12 (needs `cheat-sheet.adoc`'s finalized content list) and, for visual consistency, on
`react-cheat-sheet.pdf` existing as the style reference (it already does).

- [x] Task 33. Produce `modules/ROOT/attachments/react-native-cheat-sheet.pdf`
  - [ ] Task 33.1. Inspect `react-cheat-sheet.pdf` directly with PyMuPDF (`fitz`) to extract its exact page size,
        column layout, palette RGB values, fonts, and border/header treatment — the same reverse-engineering
        approach `implementation_plan_152.md` Task 19.1 used, since no HTML/CSS source survives in git for any
        precedent cheat sheet.
  - [ ] Task 33.2. Build a print-ready HTML/CSS layout (multi-column flexbox, colour-coded bordered boxes with
        uppercase coloured headers, a header line with the code-baseline subtitle, an italic breadcrumb footer)
        as a scratch file (not committed to the repository).
  - [ ] Task 33.3. Content, one box per group, per the issue's cheat-sheet outline: setup; architecture
        (threads/JSI/Fabric/Turbo Modules/Codegen/Hermes V1); core-components table; styling; Flexbox; lists;
        input; touch/gesture; animation; navigation; platform/device; state/data; storage/security; debugging/
        testing/performance; native modules; build/release — wording drawn from the 31 finished pages under
        `modules/ROOT/pages/apps/react-native/`.
  - [ ] Task 33.4. Render to PDF via headless Chrome (`Google Chrome --headless --print-to-pdf`), verify with
        PyMuPDF that the output is exactly one A4 page, iterating the layout (flexbox columns,
        `table-layout:fixed`, `hyphens:auto`, `<wbr>` in long tokens) rather than cropping or truncating content
        if it overflows.
  - [ ] Task 33.5. Check in only the rendered PDF at `modules/ROOT/attachments/react-native-cheat-sheet.pdf`;
        keep the scratch HTML/CSS source in the session scratchpad directory, not the repository.

### Group 14 — Site wiring (Parallelizable: no — small, order-sensitive edits across shared navigation/index files, matching the precedent's Group 11/14 treatment)

- [x] Task 34. `modules/ROOT/nav.adoc` — add the React Native nav block
  - [ ] Task 34.1. Insert `*** xref:apps/react-native/index.adoc[React Native]` immediately after the Android
        block's closing `--` (the `include::partial$nav-kotlin.adoc[]` block, per current line 801-805), before
        whatever nav entry currently follows *Guides & References → Apps*.
  - [ ] Task 34.2. Add the 29 concept-page `****` children plus the `****` cheat-sheet child, in the same order
        as Task 31.3's "What's covered" list, with titles taken verbatim from each page's `= Title`.

- [x] Task 35. `modules/ROOT/pages/apps/index.adoc` — add the "React Native" bullet
  - [ ] Task 35.1. Add a new `* xref:apps/react-native/index.adoc[...]` bullet to `== Sections`, after the
        existing Android bullet, with a one-line description mentioning React Native, Expo, and cross-platform.
  - [ ] Task 35.2. Update the page's `:description:`/`:keywords:` to include React Native/Expo terms.

- [x] Task 36. `modules/ROOT/pages/apps/android/index.adoc` — cross-reference the new section
  - [ ] Task 36.1. Add one sentence after the intro pointing at `xref:apps/react-native/index.adoc[React
        Native]` as the cross-platform alternative to native Android.

- [x] Task 37. `modules/ROOT/pages/index.adoc` — root keywords
  - [ ] Task 37.1. Append `React Native, React Native 0.87, Expo, cross-platform mobile, iOS, Hermes, Fabric,
        Turbo Native Modules, React Navigation, Reanimated` to the existing `:keywords:` line.

### Group 15 — Reciprocal cross-links in existing pages (Parallelizable: yes — twelve distinct files)

- [x] Task 38. `web/react/index.adoc`
  - [ ] Task 38.1. In the intro, add "for building Android and iOS apps with the same component model, see
        xref:apps/react-native/index.adoc[React Native]."
  - [ ] Task 38.2. In the bibliography entry for _React and React Native_, note that Part II (chapters 15-28) is
        the basis of the new React Native section.

- [x] Task 39. `web/react/getting-started.adoc`
  - [ ] Task 39.1. From the existing paragraph mentioning React Native, add a link to
        `xref:apps/react-native/getting-started.adoc[]`.

- [x] Task 40. `web/react/routing.adoc`
  - [ ] Task 40.1. From the existing Expo Router mention, add a link to `xref:apps/react-native/navigation.adoc[]`.

- [x] Task 41. `web/react/styling-and-ui-libraries.adoc`
  - [ ] Task 41.1. From the existing gluestack mention, add a link to `xref:apps/react-native/styling.adoc[]`.

- [x] Task 42. `programming-languages/typescript/jsx-and-frameworks.adoc`
  - [ ] Task 42.1. From the `react-native` `jsx` compiler-option line, add a link to
        `xref:apps/react-native/typescript.adoc[]`.

- [x] Task 43. `programming-languages/kotlin/kotlin-for-android.adoc`, `programming-languages/swift/index.adoc`,
      `programming-languages/objective-c/index.adoc`
  - [ ] Task 43.1. Add one line to each, linking `xref:apps/react-native/native-modules-and-components.adoc[]`
        ("writing native modules for React Native in this language").

- [x] Task 44. `backend/oauth/native-and-mobile-apps.adoc`
  - [ ] Task 44.1. From the PKCE/token-storage guidance, add a link to
        `xref:apps/react-native/security.adoc[]` as the React Native realization.

- [x] Task 45. `database/couchbase/sdks-and-mobile.adoc`
  - [ ] Task 45.1. From the existing Couchbase Lite/React Native mention, add a link to
        `xref:apps/react-native/storage-and-offline.adoc[]`.

- [x] Task 46. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`
  - [ ] Task 46.1. From the "Cross-platform (Flutter, React Native)" row (line 461), add a link to
        `xref:apps/react-native/index.adoc[]`.

- [x] Task 47. `web/e2e-testing-real-browsers.adoc`
  - [ ] Task 47.1. Add one sentence pointing at `xref:apps/react-native/testing.adoc[]` for E2E on simulators
        and devices.

### Group 16 — Mermaid validation and final build verification (Parallelizable: no — verifies the output of every prior group)

- [x] Task 48. Validate every Mermaid block added in Groups 2-12
  - [ ] Task 48.1. Run `npm run validate:mermaid` and fix any diagram that fails to parse before proceeding.

- [x] Task 49. Build the site and verify
  - [ ] Task 49.1. Run `npx antora antora-playbook.yml` (local content only, no `--fetch`), redirect output to a
        log file, and grep for `ERROR`/`WARN`/`xref`/`unresolved`/`include`/`image`/`attachment`/`react-native`;
        fix any warning found in this plan's own files (e.g. unescaped `{...}` attribute references in prose,
        matching the existing repo convention of `\{id}`) and rebuild until the log is clean.
  - [ ] Task 49.2. Verify `build/site/apps/react-native/` contains all 31 HTML pages (index, cheat-sheet, and 29
        concept pages) and `build/site/_attachments/react-native-cheat-sheet.pdf` exists; verify every
        `modules/ROOT/images/react-native-*.svg` is referenced by exactly one page via `image::react-native-`
        and resolves under `build/site/_images/`; verify the built site's nav contains the "React Native" entry
        under Apps.
  - [ ] Task 49.3. Verify every `xref:` target collected from `modules/ROOT/pages/apps/react-native/` resolves
        to an existing file under `modules/ROOT/pages/`, and that every reciprocal cross-link added in Group 15
        is present in its target file's built HTML.
