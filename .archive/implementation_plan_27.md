# Implementation Plan: Web Development / React Reference

## Task summary

Source: GitHub issue #27

Issue [#27](https://github.com/albertoirurueta/docs/issues/27) ("React Reference") asks to add a new
**"React Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/react/` — a sixth sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, and `web/jquery/`. It documents **React for the web**
(current stable **React 19**): what React is and project setup, JSX & rendering, components & props, state &
events, the Rules of Hooks and the core Hooks, Effects & lifecycle, sharing/scaling state & Context,
performance & concurrent features, code-splitting & Suspense, forms & Actions, client-side routing, data
fetching, refs & the DOM, custom Hooks, TypeScript, testing, server-side rendering / SSG / React Server
Components, bundling & deployment, styling & UI component libraries, and the Rules of React — plus a one-page
downloadable PDF cheat sheet. Explanations must be brief and example-driven, every concept must carry at least
one runnable code example and a link to the specific page on https://react.dev, and `[mermaid]` diagrams
and/or hand-authored inline SVG figures are used where they clarify a concept.

The primary reference book is the PDF at `~/Desktop/book.pdf`: *React and React Native, Fifth Edition — Build
cross-platform JavaScript and TypeScript apps for the web, desktop, and mobile*, Mikhail Sakhniuk & Adam
Boduch, **Packt Publishing Ltd** (Birmingham, UK), April 2024, ISBN 978-1-80512-730-7 (print) /
978-1-80512-687-4 (ebook). 28 chapters: **Part I: React (ch. 1–14)** — in scope — and Part II: React Native
(ch. 15–28) — out of scope. Publisher book page:
https://www.packtpub.com/en-us/product/react-and-react-native-9781805127307 ; publisher home:
https://www.packtpub.com/ ; official code bundle: https://github.com/PacktPublishing/React-and-React-Native-5E .

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, and jQuery
reference sections. The closest and most direct precedent is
[.archive/implementation_plan_25.md](.archive/implementation_plan_25.md) (issue #25, "jQuery Reference"): a new
sibling subsection of Web Development grounded in an official site plus a single reference book, with mermaid
diagrams, hand-authored SVG figures, a `== Bibliography`, and a headless-Chrome-rendered one-page PDF cheat
sheet, organised into four task groups (scaffold the disclaimer → parallel content pages → cheat sheet →
section index + nav/landing wiring + build verification).
[.archive/implementation_plan_15.md](.archive/implementation_plan_15.md) (issue #15, "JavaScript Development")
is the precedent for the book-grounded disclaimer wording and the bibliography format;
[.archive/implementation_plan_19.md](.archive/implementation_plan_19.md) (issue #19, "Bootstrap Reference") is
the precedent for splitting an issue's coarse topic bullets into finer pages and for the SVG-figure / PDF
workflow.

**Choices made on the user's behalf** (best-practice defaults consistent with this repo's established pattern
and the user's answers during planning — stated here so they can be challenged during review):

- **Documenting React 19** (the current stable major line — 19.2.x as of 2026). All React-19-era features in
  the issue (Actions, `useActionState`, `useFormStatus`, `useOptimistic`, `use`, `ref` as a prop, native
  document metadata, resource-preloading APIs, stable Server Components, the React Compiler) are covered from
  https://react.dev, not from the book, which targets React 18. The disclaimer (Task 1) states this and points
  readers at https://react.dev to check current specifics.
- **Scope is React on the web.** The book covers both web and React Native; per the user, this section focuses
  on web development. React Native gets a one-paragraph pointer in `getting-started.adoc` and nothing more.
- **The two pages the issue marked "optional but recommended" — `styling-and-ui-libraries.adoc` and
  `rules-of-react.adoc` — are included as mandatory** (per the user).
- **`routing.adoc` is a brief orientation page**, not a full router reference: React ships no router, so the
  page gives a short explanation, minimal examples, and links out to React Router / TanStack Router / framework
  routers for the full reference (per the user).
- **Server-side rendering and bundling get brief, example-led treatment across two pages** (per the user):
  `server-rendering.adoc` covers the rendering strategies (CSR / SSR / SSG / ISR), hydration, `react-dom/server`,
  streaming, and React Server Components, and carries **worked example A** — a small e-commerce whose product
  pages fetch dynamic data client-side with AJAX but also ship a server-rendered version so Google can index
  them. `build-and-deployment.adoc` covers bundling (Vite) and the three deployment models, and carries
  **worked example B** — a React SPA (static build) that calls a REST API with `fetch`/`axios` and is deployed
  as static files to AWS S3 + CloudFront. Both pages link out to framework/host references.
- **Page breakdown follows the issue's own topic list**, with `build-and-deployment.adoc` added per the user's
  bundling/deployment request: **20 concept pages + 1 cheat sheet + 1 section index**. The issue's grouping is
  already granular enough that no further splitting is warranted.
- **The subsection is named "React Reference"** in the section index title, the `web/index.adoc` bullet, the
  `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings ("HTML & CSS
  Reference", "Sass Reference", "JavaScript Development", "Bootstrap Reference", "jQuery Reference").
- **Placed last**, after jQuery Reference, in `nav.adoc`, `web/index.adoc`, and the root `index.adoc` — the
  same "append in the order added" ordering every prior subsection followed.
- **Mermaid is the default for concept diagrams; a small number of hand-authored SVGs** where a spatial/overlay
  figure is genuinely clearer than a flowchart (`react-one-way-data-flow.svg`, `react-rendering-strategies.svg`).
  Mermaid covers: the render → commit → effects phases, the Effect lifecycle, Context propagation past
  intermediate components, a Suspense boundary resolving, the data-fetching sequence, the RSC request flow, and
  the SPA-vs-SSR deployment topologies. The implementer may add further small SVGs under `modules/ROOT/images/`
  if one adds real value while writing a page, following the existing `*.svg` convention — not pre-planned as
  separate tasks.
- **Cross-reference existing pages instead of duplicating them**: `data-fetching.adoc` links
  `xref:web/cors.adoc[]` for cross-origin behavior and `xref:web/javascript/browser-networking.adoc[]` for
  `fetch()`; `state-and-events.adoc` links `xref:web/javascript/browser-events.adoc[]` for the underlying
  capture/target/bubble model; `refs-and-the-dom.adoc` and `jsx-and-rendering.adoc` link
  `xref:web/javascript/browser-dom-basics.adoc[]`; `styling-and-ui-libraries.adoc` links
  `xref:web/accessibility.adoc[]` and the `xref:web/html-css/*` pages; `typescript.adoc` links
  `xref:web/javascript/*` where useful.
- **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
  layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
  static checked-in asset under `modules/ROOT/attachments/react-cheat-sheet.pdf`, and linked via
  `xref:attachment$react-cheat-sheet.pdf[Download …]`. The cheat sheet must be **exactly one A4 page**
  (verified with a page-count check and a rendered preview).
- **No "quiz"/"related questions" page.** The jQuery section had one because its Packt-style book carried
  chapter multiple-choice quizzes; the Sakhniuk/Boduch React book has no chapter MCQ quizzes, so there is
  nothing to transcribe and validate.
- **No project-picker icon/xref** for React Reference — like the other Web Development subsections it lives only
  under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no
  lint/test suite). The installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none
  applies**; every task below is AsciiDoc / HTML / PDF content, implemented directly and left **untagged**.
- **Web Development** (`modules/ROOT/pages/web/index.adoc`) currently lists two standalone pages
  (`web/cors.adoc`, `web/accessibility.adoc`) then five subsections: **HTML & CSS Reference**
  (`web/html-css/*.adoc`), **Sass Reference** (`web/sass/*.adoc`), **JavaScript Development**
  (`web/javascript/*.adoc`), **Bootstrap Reference** (`web/bootstrap/*.adoc`), **jQuery Reference**
  (`web/jquery/*.adoc`). All follow the identical structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (an `[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. `javascript-disclaimer.adoc` and `html-css-disclaimer.adoc` name a primary
    book; `sass-`/`bootstrap-disclaimer.adoc` are "no single book". React has a primary book → follow the
    **JavaScript pattern** (name the book).
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header.
  - A section `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    `modules/ROOT/pages/web/jquery/index.adoc` and `modules/ROOT/pages/web/javascript/index.adoc` for the exact
    format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (existing: `html-css-cheat-sheet.pdf`, `sass-cheat-sheet.pdf`,
    `javascript-cheat-sheet.pdf`, `bootstrap-cheat-sheet.pdf`, `jquery-cheat-sheet.pdf`, `sql-cheat-sheet.pdf`).
  - `nav.adoc` lists `Web Development` (`**` under `* Guides & References`) with each subsection (`***`) and
    its own detail pages (`****`).
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    (around lines 85–98) lists Web Development with its subsections nested one level under it (`**`).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml):
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram
  mechanism used in this repo, Mermaid 11 from the jsDelivr CDN; ~20 existing usages e.g. `web/cors.adoc`,
  `web/javascript/browser-events.adoc`, `web/jquery/events.adoc`), `@djencks/asciidoctor-mathjax` (unused
  here). No `source-highlighter` attribute is set; existing pages use `[source,javascript]` / `[source,html]`
  and render fine.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` Task 27 / `.archive/implementation_plan_25.md`):
  inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference and emits a
  "skipping reference to missing attribute" build **warning**. This is acute for React prose, which is full of
  JSX braces — escape any literal braces in prose as `\{foo}` (e.g. `\{count}`, `\{children}`,
  `style=\{{ color: 'red' }}`, `\{isLoggedIn && <Nav />}`). Inside `[source,...]` blocks no escaping is
  needed. The Task 26 build must come back with **zero** such warnings.
- **Reference book text**: `~/Desktop/book.pdf` (509 pp., 28 chapters; Adobe InDesign, © 2024 Packt). Part I
  "React" is chapters 1–14: 1 Why React?, 2 Rendering with JSX, 3 Understanding React Components and Hooks,
  4 Event Handling in the React Way, 5 Crafting Reusable Components, 6 Type-Checking and Validation with
  TypeScript, 7 Handling Navigation with Routes, 8 Code Splitting Using Lazy Components and Suspense, 9 User
  Interface Framework Components, 10 High-Performance State Updates, 11 Fetching Data from a Server, 12 State
  Management in React, 13 Server-Side Rendering, 14 Unit Testing in React. Chapters 15–28 are React Native
  (out of scope). The book has **no chapter-end multiple-choice quizzes**.
- **New file map** this plan creates under `modules/ROOT/pages/web/react/` (all `.adoc`, 22 pages):
  `getting-started.adoc`, `jsx-and-rendering.adoc`, `components-and-props.adoc`, `state-and-events.adoc`,
  `hooks-core.adoc`, `effects.adoc`, `state-management.adoc`, `performance.adoc`,
  `code-splitting-and-suspense.adoc`, `forms-and-actions.adoc`, `routing.adoc`, `data-fetching.adoc`,
  `refs-and-the-dom.adoc`, `custom-hooks.adoc`, `typescript.adoc`, `testing.adoc`, `server-rendering.adoc`,
  `build-and-deployment.adoc`, `styling-and-ui-libraries.adoc`, `rules-of-react.adoc`, `cheat-sheet.adoc`,
  `index.adoc`. Plus `modules/ROOT/partials/react-disclaimer.adoc`,
  `modules/ROOT/images/react-one-way-data-flow.svg`, `modules/ROOT/images/react-rendering-strategies.svg`,
  `modules/ROOT/attachments/react-cheat-sheet.pdf`, and edits to `modules/ROOT/pages/web/index.adoc`,
  `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then
  a blank line, then `include::partial$react-disclaimer.adoc[]`, then a one/two-sentence lead paragraph.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** —
  `[source,jsx]` for component/JSX code, `[source,tsx]` on the TypeScript page and wherever types are the
  point, `[source,javascript]` for plain JS, `[source,html]`/`[source,bash]` where relevant. If `jsx`/`tsx`
  as a `[source]` language ever produces a build issue, fall back to `[source,javascript]` — verified by the
  Task 26 build.
- **Every concept links to the specific https://react.dev page** for it (inline
  `https://react.dev/…[link text]`), not just a generic "see the React docs".
- Escape literal `\{…}` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Prefer **modern React**: function components + Hooks only. Class components get at most a one-paragraph note
  (plus the error-boundary exception on `code-splitting-and-suspense.adoc`). Where the book uses a React-18-era
  or outdated pattern, document the current React 19 one and note the change.
- Diagrams via `[mermaid]` blocks; figures via `image::<name>.svg[alt,...]` with the SVG hand-authored under
  `modules/ROOT/images/`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2 page includes the partial it creates).

- [x] Task 1. Create the React disclaimer partial — `modules/ROOT/partials/react-disclaimer.adoc`
  - Created `modules/ROOT/partials/react-disclaimer.adoc` ([IMPORTANT] admonition, React 19.x for the web, book primary + react.dev for React 19 features, AI-assisted, verify against react.dev). No tests (docs repo); verified by the Task 26 Antora build.
  - [x] Task 1.1. Create `modules/ROOT/partials/react-disclaimer.adoc` as an `[IMPORTANT]` admonition
    following the shape of `modules/ROOT/partials/javascript-disclaimer.adoc`. It must state: this section
    documents **React 19.x** (function components + Hooks); it was built primarily from *React and React
    Native, Fifth Edition* (Sakhniuk & Boduch, Packt Publishing, 2024), which targets React 18, supplemented
    and corrected against the official https://react.dev[React documentation] wherever the book is out of date
    or does not cover a topic (React 19 Actions, the `use` API, `ref` as a prop, the React Compiler, Server
    Components, etc. come from react.dev); it covers **React for the web**, not React Native; it was generated
    with AI assistance; and it should be verified against https://react.dev[react.dev] before being relied on
    in production, since React APIs continue to evolve between releases.

### Group 2 — Content pages

**Parallelizable: yes** — 20 independent pages (Tasks 2–21). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` pages, but **none depends on another new page in this plan** (cross-links
between the new pages are fine to write now — the targets are all listed in this plan and validated together in
Task 26). Each page follows the "Conventions" section above.

- [x] Task 2. Create `modules/ROOT/pages/web/react/getting-started.adoc` (book ch. 1; react.dev "Installation"/"Setup")
  - Created `getting-started.adoc` — what React is (virtual DOM/reconciliation, declarative vs imperative), React Native pointer, What's new in React 19 (Actions/use/ref-as-prop/metadata/preloading/RSC/Compiler) with links, framework vs Vite creation (CRA deprecated Feb 2025), minimal `main.jsx` with `createRoot`+`StrictMode`, setup essentials. Verified by Task 26 build.
  - [x] Task 2.1. What React is: a declarative, component-based JavaScript library for building UIs; the
    virtual DOM and reconciliation at a high level; declarative vs. imperative. One-paragraph pointer that
    React Native reuses React for mobile and is out of scope here.
  - [x] Task 2.2. What's new in React 19 (brief bullet list with links: Actions, `useActionState` /
    `useFormStatus` / `useOptimistic`, `use`, `ref` as a prop, document metadata, resource preloading, stable
    Server Components, the React Compiler); how to read https://react.dev/versions and
    https://react.dev/blog.
  - [x] Task 2.3. Creating an app: the framework route (Next.js, React Router / Remix, Expo) vs.
    build-from-scratch with **Vite** (`npm create vite@latest`); note **Create React App was deprecated
    (February 2025)**; "Add React to an existing project"; a `<script type="module">` + `esm.sh` / CDN setup
    for a quick experiment. Include a minimal `main.jsx` with `createRoot(...).render(<App />)` inside
    `<StrictMode>`. Links: https://react.dev/learn/installation,
    https://react.dev/learn/creating-a-react-app, https://react.dev/learn/build-a-react-app-from-scratch.
  - [x] Task 2.4. Setup essentials: editor setup, **React Developer Tools**, `StrictMode`, `eslint-plugin-react-hooks`,
    the **React Compiler** (one paragraph — it auto-memoizes; see `performance.adoc`). Links:
    https://react.dev/learn/setup, https://react.dev/learn/react-compiler.

- [x] Task 3. Create `modules/ROOT/pages/web/react/jsx-and-rendering.adoc` (book ch. 2; react.dev "Describing the UI" pt. 1)
  - [x] Task 3.1. JSX: markup inside JavaScript; a single root / Fragments (`<>...</>`); `className`,
    camelCase attributes, self-closing tags; converting HTML to JSX. Link
    https://react.dev/learn/writing-markup-with-jsx.
  - [x] Task 3.2. Curly braces `\{ }`: expressions in children and attributes; strings vs. `\{}`; "double
    curlies" for objects / inline `style`. Link https://react.dev/learn/javascript-in-jsx-with-curly-braces.
    (Escape every literal brace in the prose.)
  - [x] Task 3.3. Conditional rendering: `if`, ternary, `&&`, returning `null`. Link
    https://react.dev/learn/conditional-rendering.
  - [x] Task 3.4. Rendering lists: `.map()` / `.filter()`, and **keys** — why they matter, stable identity,
    the index-as-key pitfall. Link https://react.dev/learn/rendering-lists.
  - [x] Task 3.5. Rendering into the page: `createRoot` / `root.render` from `react-dom/client`; `StrictMode`
    double-invoke in development. Links: https://react.dev/reference/react-dom/client/createRoot,
    https://react.dev/reference/react/StrictMode, and `xref:web/javascript/browser-dom-basics.adoc[]` for the
    underlying DOM.

- [x] Task 4. Create `modules/ROOT/pages/web/react/components-and-props.adoc` (book ch. 3, 5; "Describing the UI" pt. 2)
  - [x] Task 4.1. Function components; capitalization rule; importing/exporting (default vs. named); the
    one-component-per-file convention. Links: https://react.dev/learn/your-first-component,
    https://react.dev/learn/importing-and-exporting-components.
  - [x] Task 4.2. Props: passing and reading (destructuring), default values, `children`, spreading/forwarding
    props; props are **read-only** — one-way data flow. Embed
    `image::react-one-way-data-flow.svg[...]` (created in Task 4.5). Link
    https://react.dev/learn/passing-props-to-a-component.
  - [x] Task 4.3. Composition over inheritance; container vs. presentational split; render props (brief — note
    `children` and custom Hooks usually replace them).
  - [x] Task 4.4. Keeping components **pure** (same inputs → same JSX, no side effects in render); "your UI as
    a tree" (render tree vs. module dependency tree). Links:
    https://react.dev/learn/keeping-components-pure, https://react.dev/learn/understanding-your-ui-as-a-tree.
  - [x] Task 4.5. Create `modules/ROOT/images/react-one-way-data-flow.svg` — a hand-authored figure showing
    props flowing **down** from parent to children and events/callbacks flowing **up**, following the existing
    SVG convention (`box-model.svg`, `flex-axes.svg`, `jquery-dimensions.svg`).

- [x] Task 5. Create `modules/ROOT/pages/web/react/state-and-events.adoc` (book ch. 3, 4; "Adding Interactivity")
  - [x] Task 5.1. Event handlers: passing a function vs. calling it; inline handlers; `onClick` / `onChange`
    / `onSubmit`; the `SyntheticEvent`; `e.preventDefault()` / `e.stopPropagation()`; propagation and
    `onClickCapture`. Link https://react.dev/learn/responding-to-events and
    `xref:web/javascript/browser-events.adoc[]` for the capture/target/bubble model.
  - [x] Task 5.2. `useState`: declaring, reading, updating; multiple state variables; state is
    per-component-instance. Link https://react.dev/learn/state-a-components-memory.
  - [x] Task 5.3. Render & commit: trigger → render → commit; a `[mermaid]` flowchart of the three phases.
    Link https://react.dev/learn/render-and-commit.
  - [x] Task 5.4. State as a snapshot; automatic batching; updater functions (`setX(x => x + 1)`); queueing
    several updates. Links: https://react.dev/learn/state-as-a-snapshot,
    https://react.dev/learn/queueing-a-series-of-state-updates.
  - [x] Task 5.5. Updating **objects and arrays** immutably (spread, `map`/`filter`, never mutate); mention
    Immer. Links: https://react.dev/learn/updating-objects-in-state,
    https://react.dev/learn/updating-arrays-in-state.

- [x] Task 6. Create `modules/ROOT/pages/web/react/hooks-core.adoc` (book ch. 3; https://react.dev/reference/react/hooks)
  - [x] Task 6.1. **Rules of Hooks**: call only at the top level, only from React functions; why (call
    order); `eslint-plugin-react-hooks`. Link https://react.dev/reference/rules/rules-of-hooks.
  - [x] Task 6.2. `useState` vs. `useReducer` — when to graduate to a reducer; a pure reducer; dispatching
    actions. Links: https://react.dev/reference/react/useState,
    https://react.dev/reference/react/useReducer.
  - [x] Task 6.3. `useRef` for values that don't trigger a re-render (full DOM treatment on
    `refs-and-the-dom.adoc`); `useId`, `useDebugValue` (brief). Links:
    https://react.dev/reference/react/useRef, https://react.dev/reference/react/useId.
  - [x] Task 6.4. A reference **table of every built-in Hook**, grouped State / Context / Ref / Effect /
    Performance / Other, one-line description + `https://react.dev/reference/react/<hook>` link each
    (`useState`, `useReducer`, `useContext`, `useRef`, `useImperativeHandle`, `useEffect`, `useLayoutEffect`,
    `useInsertionEffect`, `useMemo`, `useCallback`, `useTransition`, `useDeferredValue`, `useDebugValue`,
    `useId`, `useSyncExternalStore`, `useActionState`, `useOptimistic`, `use`), with a note on which page in
    this section covers each in depth.

- [x] Task 7. Create `modules/ROOT/pages/web/react/effects.adoc` (book ch. 3; "Escape Hatches")
  - [x] Task 7.1. `useEffect`: synchronizing with an external system; the dependency array; the cleanup
    function; when it runs. Link https://react.dev/reference/react/useEffect and
    https://react.dev/learn/synchronizing-with-effects.
  - [x] Task 7.2. Fetching data in an Effect with cleanup / a race guard (`ignore` flag or `AbortController`),
    and a note that a framework or data library is usually better (cross-link `data-fetching.adoc`).
  - [x] Task 7.3. **"You Might Not Need an Effect"** — derive during render, move logic into event handlers,
    use `key` to reset state. Link https://react.dev/learn/you-might-not-need-an-effect.
  - [x] Task 7.4. Lifecycle of reactive effects; reactive dependencies; `useEffectEvent` (separating events
    from Effects); removing dependencies. Links: https://react.dev/learn/lifecycle-of-reactive-effects,
    https://react.dev/learn/separating-events-from-effects,
    https://react.dev/learn/removing-effect-dependencies.
  - [x] Task 7.5. `useLayoutEffect` vs. `useEffect` vs. `useInsertionEffect` (brief). A `[mermaid]` diagram:
    mount → deps change → cleanup → re-run → unmount.

- [x] Task 8. Create `modules/ROOT/pages/web/react/state-management.adoc` (book ch. 12; "Managing State")
  - [x] Task 8.1. Lifting state up; controlled vs. uncontrolled inputs; single source of truth. Link
    https://react.dev/learn/sharing-state-between-components.
  - [x] Task 8.2. Choosing the state structure; avoiding redundant/duplicated state; preserving and resetting
    state (position in the tree, `key`). Links: https://react.dev/learn/choosing-the-state-structure,
    https://react.dev/learn/preserving-and-resetting-state.
  - [x] Task 8.3. **Context**: `createContext`, the provider, `useContext`; the prop-drilling problem; when
    *not* to use context; the re-render caveat. A `[mermaid]` diagram of context reaching a deep child past
    intermediate components. Links: https://react.dev/learn/passing-data-deeply-with-context,
    https://react.dev/reference/react/createContext, https://react.dev/reference/react/useContext.
  - [x] Task 8.4. The reducer + context pattern for app-wide state. Link
    https://react.dev/learn/scaling-up-with-reducer-and-context.
  - [x] Task 8.5. Third-party libraries — one short paragraph + link each: Redux (Redux Toolkit), Zustand,
    Jotai, MobX (the book's ch. 12 covers Redux and MobX). Server-state libraries (TanStack Query, SWR, RTK
    Query) get a one-liner here and fuller treatment on `data-fetching.adoc`.

- [x] Task 9. Create `modules/ROOT/pages/web/react/performance.adoc` (book ch. 10; the Performance Hooks)
  - [x] Task 9.1. The re-render model recap; measuring with `<Profiler>` and the React DevTools Profiler.
    Link https://react.dev/reference/react/Profiler.
  - [x] Task 9.2. `React.memo`, `useMemo`, `useCallback` — what they do, when they help and when they don't;
    referential identity. Links: https://react.dev/reference/react/memo,
    https://react.dev/reference/react/useMemo, https://react.dev/reference/react/useCallback.
  - [x] Task 9.3. The **React Compiler** — automatic memoization, why hand-written memo becomes largely
    unnecessary. Link https://react.dev/learn/react-compiler.
  - [x] Task 9.4. Concurrent features: `useTransition` / `startTransition` (non-blocking updates),
    `useDeferredValue`; `useSyncExternalStore` for external stores; list virtualization (brief, link
    `react-window`). Links: https://react.dev/reference/react/useTransition,
    https://react.dev/reference/react/useDeferredValue.

- [x] Task 10. Create `modules/ROOT/pages/web/react/code-splitting-and-suspense.adoc` (book ch. 8)
  - [x] Task 10.1. `React.lazy` + dynamic `import()`; `<Suspense fallback>`; top-level vs. granular
    boundaries; spinner fallbacks; route-based code splitting; when to avoid `lazy`. Links:
    https://react.dev/reference/react/lazy, https://react.dev/reference/react/Suspense.
  - [x] Task 10.2. Suspense for data (framework-driven); the `use` API for reading a promise or context
    during render. Link https://react.dev/reference/react/use.
  - [x] Task 10.3. **Error boundaries** (class `getDerivedStateFromError` / `componentDidCatch`, or
    `react-error-boundary`) as the sibling of Suspense — the one place a class component is still required.
  - [x] Task 10.4. A `[mermaid]` diagram of a Suspense boundary resolving: pending → fallback → content.

- [x] Task 11. Create `modules/ROOT/pages/web/react/forms-and-actions.adoc` (book ch. 4; ch. 11 in part)
  - [x] Task 11.1. Controlled inputs recap; `<form>`, `<input>`, `<textarea>`, `<select>`; `onSubmit`. Link
    https://react.dev/reference/react-dom/components/form.
  - [x] Task 11.2. **React 19 Actions**: `<form action=\{fn}>`, `useActionState`, `useFormStatus` (from
    `react-dom`), `useOptimistic`; `startTransition` for pending UI; a note on progressive enhancement. Links:
    https://react.dev/reference/react/useActionState,
    https://react.dev/reference/react-dom/hooks/useFormStatus,
    https://react.dev/reference/react/useOptimistic.

- [x] Task 12. Create `modules/ROOT/pages/web/react/routing.adoc` (book ch. 7) — brief orientation, not a full reference
  - [x] Task 12.1. State plainly that React ships **no router**; name the options: **React Router** (data
    APIs), **TanStack Router**, and framework routers (Next.js App/Pages Router, Expo Router).
  - [x] Task 12.2. Minimal examples only, using React Router as the representative library: declaring routes,
    nested routes, a route param, a query param, `<Link>` / `<NavLink>`, programmatic navigation
    (`useNavigate`), and a lazy route. Keep each to a few lines.
  - [x] Task 12.3. Link out for the full reference: https://reactrouter.com/ , https://tanstack.com/router ,
    https://nextjs.org/docs/app . Cross-link `code-splitting-and-suspense.adoc` for lazy routes.

- [x] Task 13. Create `modules/ROOT/pages/web/react/data-fetching.adoc` (book ch. 11)
  - [x] Task 13.1. `fetch` inside an Effect (with cleanup) — the baseline, and its problems (waterfalls,
    races, no cache). Cross-link `effects.adoc`, `xref:web/javascript/browser-networking.adoc[]`, and — for
    cross-origin requests — `xref:web/cors.adoc[]`.
  - [x] Task 13.2. `axios` (brief); then **TanStack Query / SWR** — caching, deduplication, revalidation,
    mutations (the recommended approach), with a compact `useQuery` example. Link https://tanstack.com/query.
  - [x] Task 13.3. GraphQL clients (Apollo, urql, Relay) — one short paragraph of orientation. Server
    Components / framework data loading as the modern answer (cross-link `server-rendering.adoc`).
  - [x] Task 13.4. A `[mermaid]` sequence diagram: component → query hook → cache / network → server →
    render.

- [x] Task 14. Create `modules/ROOT/pages/web/react/refs-and-the-dom.adoc` (book ch. 3; "Escape Hatches")
  - [x] Task 14.1. `useRef` for mutable values that survive re-renders without causing one. Link
    https://react.dev/learn/referencing-values-with-refs.
  - [x] Task 14.2. DOM refs: the `ref` attribute, accessing nodes, focus / scroll / measure, ref callbacks.
    Link https://react.dev/learn/manipulating-the-dom-with-refs and
    `xref:web/javascript/browser-dom-basics.adoc[]`.
  - [x] Task 14.3. `ref` as a prop in **React 19** (and the legacy `forwardRef`); `useImperativeHandle`
    (rare); `flushSync` for a synchronous DOM update (rare); when to avoid refs. Links:
    https://react.dev/reference/react/useImperativeHandle, https://react.dev/reference/react-dom/flushSync.

- [x] Task 15. Create `modules/ROOT/pages/web/react/custom-hooks.adoc` (book ch. 3, 5)
  - [x] Task 15.1. Extracting stateful logic into `useSomething` functions; naming; a custom Hook shares
    **logic, not state**. Link https://react.dev/learn/reusing-logic-with-custom-hooks.
  - [x] Task 15.2. Worked examples: `useToggle`, `useLocalStorage`, `useDebounce`, `useFetch`,
    `useOnlineStatus` (with `useSyncExternalStore`). Composing Hooks; passing reactive values in and out;
    keeping them pure.

- [x] Task 16. Create `modules/ROOT/pages/web/react/typescript.adoc` (book ch. 6)
  - [x] Task 16.1. Why type props; `.tsx`; typing props (interface vs. type alias), `children`
    (`React.ReactNode`), default values. Link https://react.dev/learn/typescript. Use `[source,tsx]`.
  - [x] Task 16.2. Typing `useState`, `useReducer` actions, `useRef`, event handlers
    (`React.ChangeEvent<HTMLInputElement>` etc.), context, refs.
  - [x] Task 16.3. Generic components; `PropsWithChildren`; useful utility types; `as const`. Note
    `PropTypes` was **removed from React core in React 19**. Link
    https://react-typescript-cheatsheet.netlify.app/.

- [x] Task 17. Create `modules/ROOT/pages/web/react/testing.adoc` (book ch. 14)
  - [x] Task 17.1. Test types (unit / integration / e2e) and the test pyramid; tooling: **Vitest** / Jest.
  - [x] Task 17.2. **React Testing Library** — query by role/label, `user-event`, `render`, `screen`; `act()`
    and why RTL wraps it; mocking modules and network (MSW); testing Hooks (`renderHook`). Link
    https://testing-library.com/docs/react-testing-library/intro/ and
    https://react.dev/reference/react/act.
  - [x] Task 17.3. Snapshot testing (use sparingly); coverage; e2e with Playwright / Cypress (brief).

- [x] Task 18. Create `modules/ROOT/pages/web/react/server-rendering.adoc` (book ch. 13)
  - [x] Task 18.1. CSR vs. SSR vs. SSG vs. ISR — a short comparison table; what each optimizes (TTFB, SEO,
    interactivity, hosting cost). Embed `image::react-rendering-strategies.svg[...]` (created in Task 18.6).
  - [x] Task 18.2. Hydration and `hydrateRoot`; common hydration-mismatch causes. Link
    https://react.dev/reference/react-dom/client/hydrateRoot.
  - [x] Task 18.3. `react-dom/server` APIs: `renderToPipeableStream` (Node), `renderToReadableStream`
    (web/edge), legacy `renderToString` / `renderToStaticMarkup`; static `prerender` /
    `prerenderToNodeStream`. Link https://react.dev/reference/react-dom/server. Streaming SSR with
    `<Suspense>` (one paragraph).
  - [x] Task 18.4. **React Server Components & Server Functions**: the `'use client'` / `'use server'`
    directives; what runs where; a `[mermaid]` diagram of an RSC request (server render → serialized RSC
    payload → client hydrates interactive islands). Next.js (App Router) as the reference implementation —
    brief, link https://nextjs.org/docs/app . React 19 document-metadata hoisting (`<title>`, `<meta>`,
    `<link>`) and the resource-preloading APIs (`preload`, `preinit`, `prefetchDNS`, `preconnect`). Links:
    https://react.dev/reference/rsc/server-components, https://react.dev/reference/rsc/use-client,
    https://react.dev/reference/rsc/use-server.
  - [x] Task 18.5. **Worked example A — SEO-friendly e-commerce**: product pages are server-rendered so
    Googlebot gets full HTML (title, description, price, JSON-LD) on first response, while dynamic pieces
    (stock, "customers also bought", reviews) hydrate and then fetch client-side via AJAX (`fetch` / TanStack
    Query). Show: a server component/route that renders product markup from a data fetch, a `'use client'`
    child that does the follow-up AJAX call, and a note on why a pure CSR SPA indexes poorly for this case.
    Keep code compact; cross-link `data-fetching.adoc` and `xref:web/html-css/seo.adoc[]`.
  - [x] Task 18.6. Create `modules/ROOT/images/react-rendering-strategies.svg` — a hand-authored figure
    comparing CSR / SSR / SSG / ISR on a timeline (server work vs. client work vs. time-to-interactive),
    following the existing SVG convention.

- [x] Task 19. Create `modules/ROOT/pages/web/react/build-and-deployment.adoc` (react.dev "Build a React App from Scratch"; general)
  - [x] Task 19.1. **Bundling**: what a bundler does (module graph, transforms, tree-shaking, minification,
    hashed filenames); **Vite** (Rollup under the hood) as the default — `npm run build` → `dist/`; code
    splitting output (dynamic `import()` → separate chunks, cross-link `code-splitting-and-suspense.adoc`);
    `import.meta.env` for build-time config; source maps. Links: https://vite.dev/guide/build ,
    https://react.dev/learn/build-a-react-app-from-scratch.
  - [x] Task 19.2. Three deployment models, each one short paragraph + when to pick it: (a) **SPA / static
    build** — `dist/` of static assets on any static host/CDN, SPA fallback rewrite to `index.html`;
    (b) **SSR** — a long-running Node/edge server (or a platform like Vercel/Netlify) running
    `renderToPipeableStream`; (c) **SSG / prerender** — build-time HTML per route, served as static files
    (cross-link `server-rendering.adoc`).
  - [x] Task 19.3. **Worked example B — React SPA on AWS S3**: a Vite React SPA that calls a REST API with
    `fetch`/`axios`, built to static files and deployed to an **S3** bucket behind **CloudFront** (static
    website hosting, `index.html` error-document fallback for client-side routes, `Cache-Control` on hashed
    assets, CORS handled by the API — cross-link `xref:web/cors.adoc[]`). Show the `vite build` output, an
    example `aws s3 sync dist/ s3://…` deploy step, and a note that no server is needed because all rendering
    is client-side. A `[mermaid]` diagram contrasting the request path: browser → CDN/S3 (SPA) vs. browser →
    SSR server → origin API.
  - [x] Task 19.4. Brief note on CI/CD (build on push, publish artifact) and environment variables at build
    vs. run time.

- [x] Task 20. Create `modules/ROOT/pages/web/react/styling-and-ui-libraries.adoc` (book ch. 9) — mandatory
  - [x] Task 20.1. Styling options, one short paragraph + example each: plain CSS / **CSS Modules**,
    **Tailwind**, CSS-in-JS (styled-components / Emotion — note runtime cost and the RSC `'use client'`
    constraint), vanilla-extract, inline `style`. Cross-link the `xref:web/html-css/*` pages and
    `xref:web/sass/index.adoc[]`.
  - [x] Task 20.2. Component libraries — one paragraph of orientation + link each: **MUI** (the book's ch. 9),
    Ant Design, Chakra UI, Radix Primitives + shadcn/ui. Theming; responsive layout.
  - [x] Task 20.3. Accessibility of interactive components — cross-link `xref:web/accessibility.adoc[]`;
    mention `useId` for label/`aria-*` wiring.

- [x] Task 21. Create `modules/ROOT/pages/web/react/rules-of-react.adoc` (https://react.dev/reference/rules) — mandatory
  - [x] Task 21.1. Components and Hooks must be **pure and idempotent**; side effects outside render; props
    and state are immutable; don't mutate values already passed to JSX. Link
    https://react.dev/reference/rules/components-and-hooks-must-be-pure.
  - [x] Task 21.2. React calls your components and Hooks — never call a component as a plain function, never
    pass Hooks around as values. Link https://react.dev/reference/rules/react-calls-components-and-hooks.
  - [x] Task 21.3. The Rules of Hooks (cross-link `hooks-core.adoc`); the `key` prop, component identity, and
    why position in the tree matters. Link https://react.dev/reference/rules/rules-of-hooks.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task. Depends on every Group 2 page existing (it links to and summarizes
them); touches only `cheat-sheet.adoc` + `react-cheat-sheet.pdf`.

- [x] Task 22. Create the React cheat sheet — `modules/ROOT/pages/web/react/cheat-sheet.adoc` + `modules/ROOT/attachments/react-cheat-sheet.pdf`
  - [x] Task 22.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising: `createRoot` boilerplate, JSX rules, a function component with props,
    `useState` / `useReducer`, `useEffect` + cleanup, `useContext`, `useRef`, `useMemo` / `useCallback` /
    `memo`, event handling, lists + keys, conditional rendering, `lazy` + `Suspense`, a custom-Hook skeleton,
    the Rules of Hooks, and the React 19 `use` / Actions APIs. Match the visual style of the existing cheat
    sheets (see `modules/ROOT/pages/web/javascript/cheat-sheet.adoc` and its PDF, and
    `modules/ROOT/pages/web/jquery/cheat-sheet.adoc`).
  - [x] Task 22.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=react-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/react-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count
    check + a rendered PNG preview with no clipping), same as `.archive/implementation_plan_25.md` Task 13.
  - [x] Task 22.3. Create `modules/ROOT/pages/web/react/cheat-sheet.adoc`:
    `include::partial$react-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every Group
    2 page, and `xref:attachment$react-cheat-sheet.pdf[Download the React Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 23 (section index) must link every page from Groups 2–3; Tasks 24 and 25 depend
on Task 23 existing and on the final page/file names; Task 26 (build) depends on every prior task having
landed.

- [x] Task 23. Create `modules/ROOT/pages/web/react/index.adoc` — React Reference landing page
  - [x] Task 23.1. `= React Reference`, `:description:` / `:keywords:`, `include::partial$react-disclaimer.adoc[]`,
    a short intro (what React is, that this section targets React 19 for the web, where to start —
    `getting-started.adoc` then `jsx-and-rendering.adoc`).
  - [x] Task 23.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat
    sheet, one-line blurb each, under readable sub-headings, e.g.: **Fundamentals** (getting-started,
    jsx-and-rendering, components-and-props, state-and-events); **Hooks & effects** (hooks-core, effects,
    custom-hooks); **State, performance & Suspense** (state-management, performance,
    code-splitting-and-suspense); **Forms, routing & data** (forms-and-actions, routing, data-fetching,
    refs-and-the-dom); **TypeScript & testing** (typescript, testing); **Rendering, build & delivery**
    (server-rendering, build-and-deployment, styling-and-ui-libraries); **Reference** (rules-of-react,
    cheat-sheet). Mirror `web/javascript/index.adoc` / `web/jquery/index.adoc`.
  - [x] Task 23.3. `== Bibliography` citing: the reference book with full details — Sakhniuk, Mikhail &
    Boduch, Adam. *React and React Native*, 5th ed. Packt Publishing, 2024. ISBN 978-1-80512-730-7 (print),
    978-1-80512-687-4 (ebook) — linking
    https://www.packtpub.com/en-us/product/react-and-react-native-9781805127307[the publisher's book page] and
    https://www.packtpub.com/[packtpub.com], and optionally
    https://github.com/PacktPublishing/React-and-React-Native-5E[the official code bundle]; the official React
    documentation (https://react.dev/, https://react.dev/learn, https://react.dev/reference/react,
    https://react.dev/reference/react-dom, https://react.dev/reference/rules, https://react.dev/blog,
    https://react.dev/versions); https://developer.mozilla.org/[MDN] for the web-platform APIs referenced
    (`fetch`, the DOM, events); and the ecosystem docs actually cited (React Router, TanStack Query, Redux
    Toolkit, React Testing Library, Vite, Next.js).

- [x] Task 24. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 24.1. Add a sixth bullet to the `== Sections` list, after the jQuery Reference entry:
    `xref:web/react/index.adoc[React Reference]` with a one-line blurb (components & Hooks, state, effects,
    Suspense, forms & Actions, data fetching, SSR/SSG/RSC, build & deployment with React 19, plus a
    downloadable cheat sheet).
  - [x] Task 24.2. Update the page's own `:description:` and `:keywords:` attributes to mention React.

- [x] Task 25. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 25.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/react/index.adoc[React Reference]`
    block under `** xref:web/index.adoc[Web Development]`, **after** the jQuery Reference block, with a `****`
    line per page in this reading order: getting-started, jsx-and-rendering, components-and-props,
    state-and-events, hooks-core, effects, state-management, performance, code-splitting-and-suspense,
    forms-and-actions, routing, data-fetching, refs-and-the-dom, custom-hooks, typescript, testing,
    server-rendering, build-and-deployment, styling-and-ui-libraries, rules-of-react, cheat-sheet.
  - [x] Task 25.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/react/index.adoc[React Reference] -- …` after the jQuery Reference bullet under the Web
    Development entry, matching the existing one-line-blurb format.

- [x] Task 26. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for React Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/react/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/react/*.html (all 22 pages), the PDF attachment
      build/site/_attachments/react-cheat-sheet.pdf, the images
      build/site/_images/react-one-way-data-flow.svg and react-rendering-strategies.svg, every new nav entry,
      and all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 26.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute"
    warnings (most likely an unescaped `\{…}` in JSX prose, a typo'd `xref:` target, or a missing nav entry),
    then re-run the agent until the build is clean, before checking this task off.
  - [x] Task 26.2. After the build is clean, per the repo convention (`update-docs`), confirm no other
    Antora page needs a cross-reference update for the new section (spot-check `web/javascript/index.adoc` and
    `web/accessibility.adoc` — none is expected to need changes, but note the check).
