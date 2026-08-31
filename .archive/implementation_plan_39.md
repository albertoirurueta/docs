# Implementation Plan: Web Development / Vue.js Reference

## Task summary

Source: GitHub issue #39

Issue [#39](https://github.com/albertoirurueta/docs/issues/39) ("Vue.js Reference") asks to add a new
**"Vue.js Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/vue/` — an 11th sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, `web/react/`, `web/angular/`, `web/aspnet/`,
`web/tailwind/`, and `web/typescript/`. It documents **Vue 3.x** (Composition API + `<script setup>` first,
Options API only as a labelled contrast) as published at https://vuejs.org/ — the reactivity system, template
syntax and directives, computed/watchers, the component model (props, events, `v-model`, slots,
provide/inject, async components), reusability (composables, custom directives, plugins), the built-in
components and transitions/animation, SFCs and tooling, Vue Router, Pinia, testing, SSR, Vue + TypeScript,
the rendering mechanism and render functions, and the Best Practices (performance, deployment, security,
accessibility, the Style Guide), plus a one-page downloadable PDF cheat sheet. Explanations must be brief and
example-driven, every concept must carry at least one runnable example and at least one link to the specific
https://vuejs.org/ (guide or `/api/`) page — plus the relevant `router.vuejs.org` / `pinia.vuejs.org` /
`test-utils.vuejs.org` / `vitest.dev` / `nuxt.com` page on the ecosystem pages — and `[mermaid]` diagrams
and/or hand-authored inline SVG figures are used where they clarify a concept.

Three PDF books were consulted while planning this section — **all three are Packt Publishing project/tutorial
titles** — and each is cited **only as a bibliography entry**, never as the "primary" or "main" reference
(matching the Angular / ASP.NET / Tailwind / TypeScript / MongoDB disclaimers' "third variant" wording, and
unlike the jQuery / React ones):

- `~/Desktop/book1.pdf` — *Vue.js 3 for Beginners — Learn the essentials of Vue.js 3 and its ecosystem to
  build modern web applications*, Simone Cuomo, Packt Publishing, first edition August 2024, ISBN
  978-1-80512-677-5, ~302 pp / 14 chapters (Composition-API-first beginner→intermediate tutorial around a
  single "Companion App"; targets roughly Vue **3.4**). Publisher page:
  https://www.packtpub.com/en-us/product/vuejs-3-for-beginners-9781805126775 ; publisher home:
  https://www.packtpub.com/ ; O'Reilly listing: https://www.oreilly.com/library/view/vue-js-3-for/9781805126775/ ;
  code bundle: https://github.com/PacktPublishing/Vue.js-3-for-Beginners
- `~/Desktop/book2.pdf` — *Building Real-World Web Applications with Vue.js 3 — Build a portfolio of Vue.js and
  TypeScript web applications to advance your career in web development*, Joran Quinten, Packt Publishing,
  first edition January 2024, ISBN 978-1-83763-039-4 (print) / 978-1-83763-282-4 (ebook), ~318 pp / 10
  chapters (project portfolio, TypeScript throughout, ecosystem-heavy — Vuetify, Quasar, Nuxt, Pinia, Vitest,
  Supabase, Tailwind; targets roughly Vue **3.3**). Publisher page:
  https://www.packtpub.com/en-us/product/building-real-world-web-applications-with-vuejs-3-9781837632824 ;
  publisher home: https://www.packtpub.com/ ; O'Reilly listing:
  https://www.oreilly.com/library/view/building-real-world-web/9781837630394/ ; code bundle:
  https://github.com/PacktPublishing/Building-Real-world-Web-Applications-with-Vue.js-3
- `~/Desktop/book3.pdf` — *Frontend Development Projects with Vue.js 3 — Learn the fundamentals of building
  scalable web applications and dynamic user interfaces with Vue.js*, **Second edition**, Maya Shavin, Raymond
  Camden, Clifford Gurney, Hugo Di Francesco, Packt Publishing, 2023, ISBN 978-1-80323-499-1 (print) /
  978-1-80323-631-5 (ebook), ~800 pp / 13 chapters (broadest coverage, exercise/activity style, the main
  shape-setter for this section's ordering; targets roughly Vue **3.2/3.3**). Publisher page:
  https://www.packtpub.com/en-us/product/frontend-development-projects-with-vuejs-3-9781803236315 ; publisher
  home: https://www.packtpub.com/ ; O'Reilly listing:
  https://www.oreilly.com/library/view/frontend-development-projects/9781803234991/ ; code bundle:
  https://github.com/PacktPublishing/Frontend-Development-Projects-with-Vue.js-3

https://vuejs.org/ (plus the official ecosystem docs) is the source every page is written and verified
against. **All three books trail the current Vue 3 release line** (they predate stable `defineModel()`,
reactive props destructure, `useTemplateRef()` / `useId()`, the current Vue DevTools distribution, and parts
of the current tooling story), so where a book and the current docs disagree, **the official documentation
wins** and the difference is noted. Documentation prose must be written as original explanation verified
against https://vuejs.org/, **not** presented as derived from the books; the books appear only in
`== Bibliography` and the disclaimer's "consulted while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, Tailwind, and TypeScript reference sections. The closest precedents are
[.archive/implementation_plan_35.md](.archive/implementation_plan_35.md) (issue #35, "TypeScript Reference" —
same three `~/Desktop/bookN.pdf` paths, books bibliography-only, "third variant" disclaimer, mermaid + SVG,
`== Bibliography`, headless-Chrome one-page PDF cheat sheet) and
[.archive/implementation_plan_37.md](.archive/implementation_plan_37.md) (issue #37, "MongoDB Reference" —
same four-group structure, merged 2 commits ago as PR #38).

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **Document the current Vue 3.x line as published at https://vuejs.org/**, not pinned to a patch version.
   Examples use modern idioms: Composition API + `<script setup>` as the default, `ref` / `reactive` /
   `computed`, `defineProps` / `defineEmits` / `defineModel` (type-based where TS), `useTemplateRef()`, the
   `create-vue` / Vite scaffold. The Options API appears only as a short, clearly-labelled contrast where the
   official docs themselves show it. Where a book uses an older pattern (e.g. `modelValue` + `update:modelValue`
   instead of `defineModel()`), the page documents the current approach and notes the change.
2. **Page breakdown: 31 content pages + 1 cheat sheet + 1 section index (33 `.adoc` files).** Issue #39's
   ~36-item page list is followed closely, with **four merges** (the issue explicitly allows "the implementer
   may split or merge"):
   - issue page 5 *Class & Style Bindings* → folded into `template-syntax.adoc` (both are template-binding
     mechanics).
   - issue pages 14 *Component Events* + 15 *Component v-model & fallthrough attributes* → one
     `component-events-and-v-model.adoc` (the whole child→parent interface beyond props: `defineEmits`,
     `defineModel`, `v-model` args/modifiers, fallthrough attributes / `$attrs` / `inheritAttrs`).
   - issue page 30 *Reactivity in Depth* → folded into `reactivity-fundamentals.adoc` as a "How reactivity
     works" section plus the advanced reactivity APIs (`shallowRef` / `triggerRef` / `customRef`, `toRaw` /
     `markRaw`, `effectScope()`).
   - issue page 32 *Vue and Web Components* → folded into
     `rendering-render-functions-and-web-components.adoc` alongside the rendering mechanism and render
     functions / JSX (both are "under the hood / advanced output" topics).
   Every concept the issue lists is still covered somewhere and reachable from `index.adoc` and `nav.adoc`.
3. **All three books promoted to bibliography-only.** Neither the disclaimer nor any per-page admonition may
   describe any book as the primary or main reference; they appear only as `== Bibliography` entries and in the
   disclaimer's "consulted while preparing these pages" clause. Documentation prose is original explanation
   verified against the official docs.
4. **The subsection is named "Vue.js Reference"** in the section index title, the `web/index.adoc` bullet, the
   `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings.
5. **Placed last**, after TypeScript Reference, in `nav.adoc` (currently ending line 275
   `**** xref:web/typescript/cheat-sheet.adoc[Cheat Sheet (PDF)]`), `web/index.adoc` (bullet at line 41), and
   the root `index.adoc` (`== Guides & References` list, TypeScript bullet at line 116) — the same
   "append in the order added" ordering every prior subsection followed.
6. **Source-block style follows the other guides** — no `source-highlighter` handling or build-time
   highlighter verification (the user confirmed this is not needed). Use `[source,vue]` for full Single-File
   Components (consistent with how the React section uses `[source,jsx]`), and `[source,js]` / `[source,ts]` /
   `[source,bash]` / `[source,json]` / `[source,css]` / `[source,console]` otherwise, exactly as the existing
   `web/**` pages do.
7. **Mermaid is the default for flow/pipeline/sequence/state diagrams; eight hand-authored SVGs** where a
   spatial figure is clearer than a flowchart (all under `modules/ROOT/images/`, named `vue-*.svg`, following
   the existing `react-one-way-data-flow.svg` / `angular-data-flow.svg` / `typescript-*.svg` convention, legible
   in both light and dark site themes):
   `vue-composition-vs-options.svg`, `vue-reactivity-track-trigger.svg`, `vue-one-way-data-flow.svg`,
   `vue-slots.svg`, `vue-provide-inject.svg`, `vue-transition-classes.svg`, `vue-router-outlets.svg`,
   `vue-pinia-store.svg`. Mermaid covers: the component lifecycle flowchart, the `create-vue` + Vite pipeline,
   the async-component + `<Suspense>` state diagram, the render pipeline, and the SSR render→hydration
   sequence. The implementer may add further small `vue-*.svg` figures while writing a page if one adds real
   value — not pre-planned as separate tasks. No diagram where a short code block or small table is clearer.
8. **Cross-reference existing pages instead of duplicating them** — `xref:web/javascript/index.adoc[]` for the
   language baseline, `xref:web/typescript/index.adoc[]` for the type system (the Vue + TypeScript page
   documents only Vue-specific typing), `xref:web/react/index.adoc[]` / `xref:web/angular/index.adoc[]` for
   one-line framework contrasts, `xref:web/cors.adoc[]` and `xref:web/accessibility.adoc[]` from the Security &
   Accessibility page, and `xref:web/tailwind/index.adoc[]` where styling examples use it.
9. **No project-picker icon/xref** for Vue.js Reference — like the other Web Development subsections it lives
   only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    static checked-in asset at `modules/ROOT/attachments/vue-cheat-sheet.pdf`, linked via
    `xref:attachment$vue-cheat-sheet.pdf[Download the Vue.js Cheat Sheet (PDF)]`. The cheat sheet must be
    **exactly one A4 page** (page-count check + a rendered preview with no clipping). No HTML source is kept in
    the repo — only the rendered PDF is committed.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no lint/test
  suite; `build/` is gitignored). Installed `*-code-one-task` skills are `java` / `dotnet` / `database` only —
  **none applies**; every task below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left
  **untagged**.
- **Web Development** ([modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc)) currently lists
  two standalone pages (`web/cors.adoc`, `web/accessibility.adoc`) then ten subsections ending in **TypeScript
  Reference**. All follow one structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` / `====` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block plus one blank line.
    [modules/ROOT/partials/typescript-disclaimer.adoc](modules/ROOT/partials/typescript-disclaimer.adoc),
    `angular-disclaimer.adoc`, `aspnet-disclaimer.adoc`, `tailwind-disclaimer.adoc`, and
    `mongodb-disclaimer.adoc` are the **"third variant"** to follow: the official site is the reference the
    pages are written and verified against; the book(s) are named **only as bibliography entries**, not the
    primary source, and are noted to predate the current version.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph. Body uses `[source,…]` blocks
    fenced by `----`, `[mermaid]` blocks for diagrams, and
    `image::<name>.svg[alt,width=…,role=text-center]` for figures (see
    `modules/ROOT/pages/web/tailwind/states-and-variants.adoc`,
    `modules/ROOT/pages/web/react/getting-started.adoc`, and
    `modules/ROOT/pages/web/aspnet/dependency-injection.adoc` for the exact idiom).
  - A section `index.adoc` opening with the disclaimer and a short intro + "where to start" pointer, then a
    grouped `== What's covered` section `xref:`-linking every page with a one-line blurb, ending in a
    `== Bibliography` section (see
    [modules/ROOT/pages/web/react/index.adoc](modules/ROOT/pages/web/react/index.adoc) and
    `modules/ROOT/pages/web/angular/index.adoc` for the exact format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (13 today). **No HTML source for these PDFs is kept in the
    repo** — only the rendered PDF is committed.
  - [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) (275 lines) lists `Web Development` (`**` under
    `* Guides & References`) with each subsection (`***`) and its own detail pages (`****`). The **TypeScript
    block is currently last**, ending the file at line 275
    `**** xref:web/typescript/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    lists Web Development with its subsections nested one level under it (`**`), **TypeScript Reference last**
    (bullet at line 116).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used in this
  repo), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute is set; existing pages
  use `[source,html]` / `[source,css]` / `[source,javascript]` / `[source,jsx]` / `[source,ts]` and render
  fine. `modules/ROOT/images/` holds the existing hand-authored `*.svg` figures;
  `modules/ROOT/attachments/` holds the cheat-sheet PDFs.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` / `_25.md` / `_27.md` / `_29.md` / `_31.md` /
  `_33.md` / `_35.md`): inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute
  reference and emits a "skipping reference to missing attribute" build **warning**. This is acute for Vue
  prose, which is full of braces: mustache interpolation (`\{\{ count }}`), object bindings
  (`:class="\{ active: isActive }"`), `defineProps<\{ … }>()`, `v-slot="\{ … }"`, `withDefaults(defineProps(), \{ … })`,
  Pinia store option objects, `h('div', \{ … })` render-function args. **Escape any literal braces in prose as
  `\{ … }`.** Inside `[source,…]` blocks **no escaping is needed**. Angle brackets (`Ref<T>`, `PropType<T>`)
  and square brackets in prose are fine unescaped. The final build (Task 37) must come back with **zero** such
  warnings.
- **New file map** this plan creates under `modules/ROOT/pages/web/vue/` (all `.adoc`, 33 files):
  `getting-started.adoc`, `template-syntax.adoc`, `reactivity-fundamentals.adoc`, `computed-properties.adoc`,
  `conditional-and-list-rendering.adoc`, `event-handling.adoc`, `form-input-bindings.adoc`, `watchers.adoc`,
  `template-refs.adoc`, `lifecycle-hooks.adoc`, `components-basics.adoc`, `registration-and-props.adoc`,
  `component-events-and-v-model.adoc`, `slots.adoc`, `provide-inject.adoc`, `async-components.adoc`,
  `composables.adoc`, `custom-directives-and-plugins.adoc`, `transitions-and-animation.adoc`,
  `keepalive-teleport-suspense.adoc`, `single-file-components.adoc`, `tooling-and-project-setup.adoc`,
  `routing.adoc`, `state-management.adoc`, `testing.adoc`, `server-side-rendering.adoc`, `typescript.adoc`,
  `rendering-render-functions-and-web-components.adoc`, `performance-and-deployment.adoc`,
  `security-and-accessibility.adoc`, `style-guide-and-best-practices.adoc`, `cheat-sheet.adoc`, `index.adoc`.
  Plus `modules/ROOT/partials/vue-disclaimer.adoc`, eight hand-authored SVGs under `modules/ROOT/images/`
  (`vue-composition-vs-options.svg`, `vue-reactivity-track-trigger.svg`, `vue-one-way-data-flow.svg`,
  `vue-slots.svg`, `vue-provide-inject.svg`, `vue-transition-classes.svg`, `vue-router-outlets.svg`,
  `vue-pinia-store.svg`), `modules/ROOT/attachments/vue-cheat-sheet.pdf`, and edits to
  [modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc),
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), and
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc).

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then a
  blank line, then `include::partial$vue-disclaimer.adoc[]`, then a blank line, then a one/two-sentence lead
  paragraph — identical placement to `include::partial$react-disclaimer.adoc[]` in
  `modules/ROOT/pages/web/react/getting-started.adoc`.
- **Brief and concise** prose. **Every concept gets at least one runnable example** — `[source,vue]` for full
  SFCs, otherwise `[source,js]` / `[source,ts]` / `[source,bash]` / `[source,json]` / `[source,css]` /
  `[source,console]` as appropriate.
- **Every concept links to the specific https://vuejs.org/… page** (guide or `/api/` entry) for it (inline
  `https://vuejs.org/…[link text]`), not just a generic "see the Vue docs". Ecosystem pages additionally link
  the relevant official `router.vuejs.org` / `pinia.vuejs.org` / `test-utils.vuejs.org` / `vitest.dev` /
  `nuxt.com` page.
- Composition API + `<script setup>` is the default authoring style in every example; the Options API appears
  only as a short, clearly-labelled contrast where the official docs do the same.
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Admonitions and prose must **not** present any of the three books as the main/primary reference — they appear
  only in `== Bibliography` and the disclaimer partial. Prose is original explanation verified against
  https://vuejs.org/.
- Diagrams via `[mermaid]` blocks; figures via `image::vue-*.svg[alt,width=…,role=text-center]` with the SVG
  hand-authored under `modules/ROOT/images/`, readable in both light and dark themes.
- Cross-link the sibling `web/**` pages listed in choice 8 rather than restating their content.
- The full per-page concept checklist and official-link list is in issue #39's "Pages to create" section —
  each task below references its issue page number(s); implement every bullet the issue lists for that page,
  folding in the merged page's bullets where noted.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Vue.js disclaimer partial — `modules/ROOT/partials/vue-disclaimer.adoc`
  - Files touched: `modules/ROOT/partials/vue-disclaimer.adoc` (new). No tests (docs-only repo, no test suite).
    Verification: `npx antora antora-playbook.yml` completes with exit 0 and zero warnings/errors.
  - [x] Task 1.1. Create `modules/ROOT/partials/vue-disclaimer.adoc` as an `[IMPORTANT]` admonition
    (`[IMPORTANT]` then `====` … `====`) following the shape of
    `modules/ROOT/partials/typescript-disclaimer.adoc` and `modules/ROOT/partials/angular-disclaimer.adoc`. It
    must state:
    - this section documents **the current Vue 3.x release line** as published at
      https://vuejs.org/[the official Vue.js documentation], **which is the reference these pages are written
      and verified against**; no specific patch version is pinned; Composition API + `<script setup>` is the
      authoring style used throughout, with the Options API shown only as a contrast;
    - the content was generated with the assistance of AI and should be verified against https://vuejs.org/
      before being relied on in production, since Vue and its ecosystem iterate quickly;
    - *Vue.js 3 for Beginners* (Simone Cuomo, Packt, 2024), *Building Real-World Web Applications with Vue.js 3*
      (Joran Quinten, Packt, 2024), and *Frontend Development Projects with Vue.js 3*, 2nd ed.
      (Maya Shavin, Raymond Camden, Clifford Gurney, Hugo Di Francesco, Packt, 2023) are **listed in this
      section's bibliography** and were consulted while preparing these pages — worded so it does **not** state
      or imply any book is the primary or main reference — and **all three are project/tutorial books that
      predate parts of the current release line**, so on any discrepancy the official documentation at
      https://vuejs.org/ wins and the difference is noted.
  - [x] Task 1.2. Confirm it is included via `include::partial$vue-disclaimer.adoc[]` on every page created in
    Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` /
    `:keywords:` block and one blank line — identical syntax/placement to
    `include::partial$react-disclaimer.adoc[]` in `modules/ROOT/pages/web/react/getting-started.adoc`. Record
    the exact opening shape for Groups 2–4:
    1. `= <Page Title>`
    2. `:description: <one-line description>`
    3. `:keywords: <comma-separated keywords>`
    4. one blank line
    5. `include::partial$vue-disclaimer.adoc[]` (verbatim, its own line, flush left, no attributes)
    6. one blank line
    7. page body begins
  - Confirmed against `modules/ROOT/pages/web/react/getting-started.adoc` (lines 1–7): `= Title`, `:description:`,
    `:keywords:`, one blank line, `include::partial$react-disclaimer.adoc[]` on its own flush-left line with no
    attributes, one blank line, then the lead paragraph. Groups 2–4 pages must open exactly the same way,
    substituting `include::partial$vue-disclaimer.adoc[]`. The partial now exists; no Group 2–4 page exists yet.

### Group 2 — Content pages

**Parallelizable: yes** — 31 independent pages (Tasks 2–32). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` pages and the other new pages in this plan (cross-links between the new
pages are fine to write now — every target is listed in this plan and validated together in Task 37), but
**none depends on another new page's content**. Each page follows the "Conventions" section above and
implements every bullet the referenced issue #39 page lists (plus the merged page's bullets where noted).
Eight tasks also create a hand-authored SVG as a sub-task.

#### Essentials

- [x] Task 2. Create `modules/ROOT/pages/web/vue/getting-started.adoc` (issue #39 page 1; book 1 ch. 1–3;
  book 2 ch. 1; book 3 ch. 1, 3)
  - [x] _Done — `modules/ROOT/pages/web/vue/getting-started.adoc` + hand-authored `modules/ROOT/images/vue-composition-vs-options.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 2.1. Implement every bullet issue #39 page 1 lists: Vue as a progressive framework; declarative
    rendering + reactivity + components; the SFC file shape; API styles (Options vs. Composition +
    `<script setup>` — the default here, with a one-paragraph Options-API contrast and a pointer to the
    Composition API FAQ); ways of using Vue (CDN `<script>` + `createApp` / import maps, no build step; the
    `create-vue` scaffold on Vite; where Nuxt fits); `createApp` / `app.mount` / multiple app instances /
    `app.config`; the SFC Playground. `[source,bash]` + `[source,vue]` + `[source,js]`.
  - [x] Task 2.2. Create `modules/ROOT/images/vue-composition-vs-options.svg` — hand-authored, following the
    existing SVG convention: the same small component (a counter) written two ways side by side —
    `<script setup>` with `ref` + a handler, vs. Options API with `data()` + `methods` — with the shared
    `<template>` in the middle.
  - [x] Task 2.3. Embed `image::vue-composition-vs-options.svg[…]`. Links: at least
    https://vuejs.org/guide/introduction.html, https://vuejs.org/guide/quick-start.html,
    https://vuejs.org/guide/essentials/application.html, https://vuejs.org/guide/extras/ways-of-using-vue.html.

- [x] Task 3. Create `modules/ROOT/pages/web/vue/template-syntax.adoc` (issue #39 pages 2 **and 5** — *Class &
  Style Bindings* is merged in here; book 1 ch. 3–4; book 3 ch. 1)
  - [x] _Done — `modules/ROOT/pages/web/vue/template-syntax.adoc` (issue pages 2 + 5 merged); docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 3.1. Issue page 2 bullets: text interpolation `\{\{ }}`; `v-html` (with its XSS caveat —
    cross-link the Security & Accessibility page); attribute bindings with `v-bind` / `:` (boolean attributes,
    dynamic attribute names, binding an object of attributes); JavaScript expressions in bindings and their
    restrictions; directive anatomy — name, argument, dynamic argument, modifiers; the `:` / `@` / `#`
    shorthands. `[source,vue]`.
  - [x] Task 3.2. Issue page 5 bullets (merged): binding `class` with object / array syntax, mixing with
    static `class`, `class` on a component (fallthrough merge); binding inline `style` with object / array,
    auto-prefixing, multiple values. `[source,vue]`.
  - [x] Task 3.3. Links: at least https://vuejs.org/guide/essentials/template-syntax.html,
    https://vuejs.org/api/built-in-directives.html, https://vuejs.org/guide/essentials/class-and-style.html.

- [x] Task 4. Create `modules/ROOT/pages/web/vue/reactivity-fundamentals.adoc` (issue #39 pages 3 **and 30** —
  *Reactivity in Depth* is merged in here as a final section; book 1 ch. 2–3; book 3 ch. 1–2)
  - [x] _Done — `modules/ROOT/pages/web/vue/reactivity-fundamentals.adoc` (issue pages 3 + 30 merged) + hand-authored `modules/ROOT/images/vue-reactivity-track-trigger.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 4.1. Issue page 3 bullets: `ref()` (deep reactivity, `.value` vs. template auto-unwrap, ref
    unwrapping caveats); `reactive()` (proxy semantics, object-only, keep-the-reference, destructure loses
    reactivity → `toRefs()` / `toRef()`); `ref` vs. `reactive` guidance; the Options API `data()` equivalent
    in one contrast block; DOM update timing and `nextTick()`; `<script setup>` top-level bindings exposed to
    the template. `[source,vue]` + `[source,js]`.
  - [x] Task 4.2. Issue page 30 bullets (merged, as a "== How reactivity works" section): the Proxy-based
    dependency system — effects, **track** on read / **trigger** on write, the render effect; reactivity
    caveats (adding properties, replacing arrays, collections, destructuring); the advanced APIs
    `shallowRef` / `triggerRef` / `customRef`, `shallowReactive` / `shallowReadonly`, `toRaw` / `markRaw`,
    `effectScope()` / `onScopeDispose`; integrating external / immutable state. `[source,js]`.
  - [x] Task 4.3. Create `modules/ROOT/images/vue-reactivity-track-trigger.svg` — hand-authored: a component's
    render effect reading `ref` / `reactive` state, arrows to a "dep map" (tracked), and a mutation arrow that
    re-runs just the dependent effects.
  - [x] Task 4.4. Embed `image::vue-reactivity-track-trigger.svg[…]`. Links: at least
    https://vuejs.org/guide/essentials/reactivity-fundamentals.html, https://vuejs.org/api/reactivity-core.html,
    https://vuejs.org/api/reactivity-utilities.html, https://vuejs.org/guide/extras/reactivity-in-depth.html,
    https://vuejs.org/api/reactivity-advanced.html.

- [x] Task 5. Create `modules/ROOT/pages/web/vue/computed-properties.adoc` (issue #39 page 4; book 1 ch. 5;
  book 3 ch. 2)
  - [x] _Done — `modules/ROOT/pages/web/vue/computed-properties.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 5.1. Implement every bullet: `computed(() => …)`; caching vs. methods (re-evaluate only on
    dependency change); when a method is the right choice; writable computed with `get` / `set`; not mutating
    other state in a getter; `computed` vs. `watch` for derived data; `computed` debugging (`onTrack` /
    `onTrigger`) and returned-value stability (3.4+). `[source,vue]` + `[source,js]`. Links: at least
    https://vuejs.org/guide/essentials/computed.html, https://vuejs.org/api/reactivity-core.html#computed.

- [x] Task 6. Create `modules/ROOT/pages/web/vue/conditional-and-list-rendering.adoc` (issue #39 page 6;
  book 1 ch. 4; book 3 ch. 1)
  - [x] _Done — `modules/ROOT/pages/web/vue/conditional-and-list-rendering.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 6.1. Implement every bullet: `v-if` / `v-else` / `v-else-if`, `v-if` on `<template>`, `v-if` vs.
    `v-show` and their cost; `v-for` over arrays / objects / ranges / `<template>`; the `key` requirement;
    array mutation vs. replacement and reactive-array caveats; `v-for` with a component; `v-if` + `v-for` on
    the same element discouraged — the precedence and the fix. `[source,vue]`. Links: at least
    https://vuejs.org/guide/essentials/conditional.html, https://vuejs.org/guide/essentials/list.html.

- [x] Task 7. Create `modules/ROOT/pages/web/vue/event-handling.adoc` (issue #39 page 7; book 1 ch. 6;
  book 3 ch. 1)
  - [x] _Done — `modules/ROOT/pages/web/vue/event-handling.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 7.1. Implement every bullet: `v-on` / `@`; inline vs. method handlers; accessing the native event
    with `$event` / `(e) =>`; event modifiers (`.stop`, `.prevent`, `.self`, `.capture`, `.once`, `.passive`);
    key modifiers (`.enter`, `.esc`, system modifiers, `.exact`); mouse-button modifiers. `[source,vue]`.
    Links: at least https://vuejs.org/guide/essentials/event-handling.html.

- [x] Task 8. Create `modules/ROOT/pages/web/vue/form-input-bindings.adoc` (issue #39 page 8; book 1 ch. 12;
  book 3 ch. 1)
  - [x] _Done — `modules/ROOT/pages/web/vue/form-input-bindings.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 8.1. Implement every bullet: `v-model` on text / `<textarea>` / checkbox (single + array +
    `true-value` / `false-value`) / radio / select (single + multiple); what `v-model` desugars to
    (`:value` + `@input`); modifiers `.lazy` / `.number` / `.trim`; binding to dynamic values with
    `:true-value` / `:value`; a brief linked pointer to VeeValidate / schema validation for real forms (book 1
    ch. 12), not documented in depth; forward pointer to `component-events-and-v-model.adoc` for `v-model` on
    components. `[source,vue]`. Links: at least https://vuejs.org/guide/essentials/forms.html.

- [x] Task 9. Create `modules/ROOT/pages/web/vue/watchers.adoc` (issue #39 page 9; book 1 ch. 7; book 3 ch. 2)
  - [x] _Done — `modules/ROOT/pages/web/vue/watchers.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 9.1. Implement every bullet: `watch` (single / getter / multiple sources, `deep`, `immediate`,
    `once`); `watchEffect` and automatic dependency tracking; `watch` vs. `watchEffect`; callback flush timing
    (`pre` default, `post`, `sync`); `onWatcherCleanup()` / the cleanup argument; stopping a watcher and the
    "must be created synchronously" rule; Options API `watch:` in one contrast block; `watch` vs. `computed`.
    `[source,vue]` + `[source,js]`. Links: at least https://vuejs.org/guide/essentials/watchers.html,
    https://vuejs.org/api/reactivity-core.html#watch.

- [x] Task 10. Create `modules/ROOT/pages/web/vue/template-refs.adoc` (issue #39 page 10; book 1 ch. 9;
  book 3 ch. 4)
  - [x] _Done — `modules/ROOT/pages/web/vue/template-refs.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 10.1. Implement every bullet: `useTemplateRef('name')` (3.5) and the classic `ref="name"` +
    matching variable; timing (available after mount); refs inside `v-for`; function refs; refs on a component
    exposing the public instance / `defineExpose()`; when to reach for a ref vs. props / events. `[source,vue]`.
    Links: at least https://vuejs.org/guide/essentials/template-refs.html,
    https://vuejs.org/api/composition-api-helpers.html#usetemplateref.

- [x] Task 11. Create `modules/ROOT/pages/web/vue/lifecycle-hooks.adoc` (issue #39 page 11; book 1 ch. 2, 9;
  book 3 ch. 1)
  - [x] _Done — `modules/ROOT/pages/web/vue/lifecycle-hooks.adoc` + `[mermaid]` component-lifecycle flowchart; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 11.1. Implement every bullet: what each lifecycle phase means; registering hooks in
    `setup` / `<script setup>` (`onMounted`, `onUpdated`, `onUnmounted`, `onBeforeMount` / `Update` /
    `Unmount`, `onErrorCaptured`, `onRenderTracked` / `onRenderTriggered`, `onActivated` / `onDeactivated`,
    `onServerPrefetch`); hooks must be called synchronously during setup; Options API equivalents (`mounted`,
    `created`, …) in a mapping table. `[source,vue]` + `[source,js]`.
  - [x] Task 11.2. Add a `[mermaid]` flowchart of the component lifecycle mirroring the official diagram:
    `setup` → `beforeCreate` / `created` → `beforeMount` → `mounted` → (`beforeUpdate` / `updated`)* →
    `beforeUnmount` → `unmounted`, with the SSR and `<KeepAlive>` (`activated` / `deactivated`) branches.
    Links: at least https://vuejs.org/guide/essentials/lifecycle.html,
    https://vuejs.org/api/composition-api-lifecycle.html.

- [x] Task 12. Create `modules/ROOT/pages/web/vue/components-basics.adoc` (issue #39 page 12; book 1 ch. 3, 6;
  book 3 ch. 1, 4, 6)
  - [x] _Done — `modules/ROOT/pages/web/vue/components-basics.adoc` + hand-authored `modules/ROOT/images/vue-one-way-data-flow.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 12.1. Implement every bullet: defining an SFC component; local vs. global registration (pointer
    to the dedicated page); passing props; listening to events; a first look at slots; dynamic components with
    `<component :is>` and why `<KeepAlive>` matters there; DOM in-template parsing caveats
    (case-insensitivity, self-closing, element placement). `[source,vue]`.
  - [x] Task 12.2. Create `modules/ROOT/images/vue-one-way-data-flow.svg` — hand-authored: a small component
    tree with `props` arrows pointing **down** and `emit` event arrows pointing **up**.
  - [x] Task 12.3. Embed `image::vue-one-way-data-flow.svg[…]`. Links: at least
    https://vuejs.org/guide/essentials/component-basics.html.

#### Components In-Depth

- [x] Task 13. Create `modules/ROOT/pages/web/vue/registration-and-props.adoc` (issue #39 page 13; book 1
  ch. 3, 6; book 3 ch. 4)
  - [x] _Done — `modules/ROOT/pages/web/vue/registration-and-props.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 13.1. Implement every bullet: global (`app.component`) vs. local registration and the trade-offs;
    component name casing; `defineProps()` — runtime vs. type-based declaration; prop validation (`type`,
    `required`, `default`, `validator`), Boolean casting, object/array defaults as factories; one-way
    (top-down) flow and why you must not mutate a prop; the "editable prop" patterns (local copy, computed
    getter/setter, `defineModel`); reactive props destructure with defaults (3.5); `toRef` / `toRefs` for
    passing props into composables. `[source,vue]` + `[source,ts]`. Links: at least
    https://vuejs.org/guide/components/registration.html, https://vuejs.org/guide/components/props.html.

- [x] Task 14. Create `modules/ROOT/pages/web/vue/component-events-and-v-model.adoc` (issue #39 pages 14 **and
  15** — merged; book 1 ch. 6, 12; book 3 ch. 4)
  - [x] _Done — `modules/ROOT/pages/web/vue/component-events-and-v-model.adoc` (issue pages 14 + 15 merged); docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 14.1. Issue page 14 bullets: `$emit` / `defineEmits()` (runtime and type-based); declared emits;
    event validation; naming; arguments; events vs. callback props; the relationship to `v-model`
    (`update:xxx`). `[source,vue]` + `[source,ts]`.
  - [x] Task 14.2. Issue page 15 bullets: `defineModel()` (stable 3.4) — the returned ref, `props` / `emit`
    options, `v-model` arguments (`v-model:title`), multiple `v-model`s, `v-model` modifiers (custom); the
    pre-3.4 `modelValue` + `update:modelValue` equivalent in one contrast block; fallthrough attributes —
    automatic inheritance onto the single root, `class` / `style` / `v-on` merging, `inheritAttrs: false` +
    `$attrs` / `useAttrs()`, multi-root components and explicit `v-bind="$attrs"`. `[source,vue]`.
  - [x] Task 14.3. Links: at least https://vuejs.org/guide/components/events.html,
    https://vuejs.org/guide/components/v-model.html, https://vuejs.org/guide/components/attrs.html.

- [x] Task 15. Create `modules/ROOT/pages/web/vue/slots.adoc` (issue #39 page 16; book 1 ch. 9; book 3 ch. 4)
  - [x] _Done — `modules/ROOT/pages/web/vue/slots.adoc` + hand-authored `modules/ROOT/images/vue-slots.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 15.1. Implement every bullet: default slot + fallback content; named slots and the `#name`
    shorthand; conditional slots via `$slots`; dynamic slot names; scoped slots — passing data from child to
    slot content, destructuring slot props, named + scoped together; the renderless component pattern;
    `defineSlots()` for typing. `[source,vue]`.
  - [x] Task 15.2. Create `modules/ROOT/images/vue-slots.svg` — hand-authored: parent-provided template
    content projected into a child's named outlets, plus a scoped slot passing an object back up to the
    parent's slot template.
  - [x] Task 15.3. Embed `image::vue-slots.svg[…]`. Links: at least
    https://vuejs.org/guide/components/slots.html.

- [x] Task 16. Create `modules/ROOT/pages/web/vue/provide-inject.adoc` (issue #39 page 17; book 3 ch. 6)
  - [x] _Done — `modules/ROOT/pages/web/vue/provide-inject.adoc` + hand-authored `modules/ROOT/images/vue-provide-inject.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 16.1. Implement every bullet: `provide` / `inject`; app-level `app.provide`; injection keys
    (`InjectionKey<T>` with TypeScript); default values; keeping provided values reactive (and providing
    `readonly`); when to prefer provide/inject over prop drilling, and when a store (Pinia) is the better
    answer. `[source,vue]` + `[source,ts]`.
  - [x] Task 16.2. Create `modules/ROOT/images/vue-provide-inject.svg` — hand-authored side-by-side: prop
    drilling through every intermediate component vs. an ancestor `provide` consumed directly by a deep
    descendant `inject`.
  - [x] Task 16.3. Embed `image::vue-provide-inject.svg[…]`. Links: at least
    https://vuejs.org/guide/components/provide-inject.html.

- [x] Task 17. Create `modules/ROOT/pages/web/vue/async-components.adoc` (issue #39 page 18; book 1 ch. 7)
  - [x] _Done — `modules/ROOT/pages/web/vue/async-components.adoc` + `[mermaid]` async-component / `<Suspense>` state diagram; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 17.1. Implement every bullet: `defineAsyncComponent(() => import(...))`; the options object
    (`loadingComponent`, `errorComponent`, `delay`, `timeout`, `onError` / retry); pairing with route-level
    code splitting and with `<Suspense>`. `[source,js]` + `[source,vue]`.
  - [x] Task 17.2. Add a `[mermaid]` state diagram: async component + `<Suspense>` — pending → fallback shown →
    resolved / errored. Links: at least https://vuejs.org/guide/components/async.html.

#### Reusability

- [x] Task 18. Create `modules/ROOT/pages/web/vue/composables.adoc` (issue #39 page 19; book 2 ch. 4;
  book 3 ch. 5)
  - [x] _Done — `modules/ROOT/pages/web/vue/composables.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 18.1. Implement every bullet: what a composable is (a `use*` function using the Composition API);
    naming / convention; returning refs; accepting reactive args (`toValue()` / `MaybeRefOrGetter`);
    side-effect cleanup (`onUnmounted` / `onWatcherCleanup`); usage restrictions (call synchronously in
    `setup`); worked examples (`useMouse`, `useFetch`, `useLocalStorage`); composables vs. mixins vs.
    renderless components and why composables are preferred. `[source,js]` + `[source,vue]`. Links: at least
    https://vuejs.org/guide/reusability/composables.html.

- [x] Task 19. Create `modules/ROOT/pages/web/vue/custom-directives-and-plugins.adoc` (issue #39 page 20;
  book 3 ch. 6)
  - [x] _Done — `modules/ROOT/pages/web/vue/custom-directives-and-plugins.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 19.1. Implement every bullet: custom directives — the hook set (`mounted`, `updated`,
    `beforeUnmount`, …), the function shorthand, the binding object (`value`, `arg`, `modifiers`), directives
    on components (discouraged), local vs. global registration; plugins — the `install(app, options)`
    contract, `app.use()`, adding global properties / components / directives, providing values from a plugin,
    a small example (i18n or toast); mixins covered only as a legacy contrast with a "prefer composables"
    note. `[source,js]` + `[source,vue]`. Links: at least
    https://vuejs.org/guide/reusability/custom-directives.html, https://vuejs.org/guide/reusability/plugins.html.

#### Built-in Components & Animation

- [x] Task 20. Create `modules/ROOT/pages/web/vue/transitions-and-animation.adoc` (issue #39 page 21;
  book 3 ch. 8; book 1 ch. 9)
  - [x] _Done — `modules/ROOT/pages/web/vue/transitions-and-animation.adoc` + hand-authored `modules/ROOT/images/vue-transition-classes.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 20.1. Implement every bullet: `<Transition>` — the six transition classes, `name`, custom class
    names, `mode` (`out-in` / `in-out`), `appear`, transitioning between elements / dynamic components, the
    JavaScript hooks (`@enter`, `@leave`, …) and `:css="false"`; `<TransitionGroup>` — list enter/leave, the
    `key` requirement, move transitions (FLIP), staggering; broader animation techniques — class/style
    bindings driven by state, watchers driving imperative animation, state-driven tweening, the GSAP library,
    route/page transitions with `<RouterView>` + `<Transition>`. `[source,vue]` + `[source,css]`.
  - [x] Task 20.2. Create `modules/ROOT/images/vue-transition-classes.svg` — hand-authored timeline:
    `v-enter-from` → `v-enter-active` → `v-enter-to`, and `v-leave-from` → `v-leave-active` → `v-leave-to`.
  - [x] Task 20.3. Embed `image::vue-transition-classes.svg[…]`. Links: at least
    https://vuejs.org/guide/built-ins/transition.html, https://vuejs.org/guide/built-ins/transition-group.html,
    https://vuejs.org/guide/extras/animation.html.

- [x] Task 21. Create `modules/ROOT/pages/web/vue/keepalive-teleport-suspense.adoc` (issue #39 page 22;
  book 1 ch. 7)
  - [x] _Done — `modules/ROOT/pages/web/vue/keepalive-teleport-suspense.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 21.1. Implement every bullet: `<KeepAlive>` — caching dynamic components, `include` / `exclude` /
    `max`, `onActivated` / `onDeactivated`; `<Teleport>` — `to`, `disabled`, deferred teleport, multiple
    teleports to one target; `<Suspense>` (experimental) — `#default` / `#fallback`, `onPending` / `onResolve`
    / `onFallback`, pairing with async components and top-level `await` in `<script setup>`; special elements /
    attributes — `<component :is>`, `<slot>`, `<template>`, and `key` / `ref` / `is`. `[source,vue]`. Links: at
    least https://vuejs.org/guide/built-ins/keep-alive.html, https://vuejs.org/guide/built-ins/teleport.html,
    https://vuejs.org/guide/built-ins/suspense.html, https://vuejs.org/api/built-in-special-elements.html.

#### Scaling Up

- [x] Task 22. Create `modules/ROOT/pages/web/vue/single-file-components.adoc` (issue #39 page 23; book 1
  ch. 2; book 2 ch. 2; book 3 ch. 1)
  - [x] _Done — `modules/ROOT/pages/web/vue/single-file-components.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 22.1. Implement every bullet: SFC blocks (`<template>`, `<script>`, `<script setup>`, `<style>`),
    automatic name inference, `src` imports, pre-processors, comments, how SFCs are compiled; `<script setup>`
    — top-level bindings, `defineProps` / `defineEmits` / `defineModel` / `defineExpose` / `defineOptions` /
    `defineSlots`, using components & directives, top-level `await`, generics
    (`<script setup lang="ts" generic="T">`), restrictions; SFC CSS features — `<style scoped>` and the
    data-attribute mechanism + `:deep()` / `:slotted()` / `:global()`, CSS Modules (`<style module>` →
    `$style`), `v-bind()` in CSS. `[source,vue]` + `[source,css]`. Links: at least
    https://vuejs.org/guide/scaling-up/sfc.html, https://vuejs.org/api/sfc-script-setup.html,
    https://vuejs.org/api/sfc-css-features.html.

- [x] Task 23. Create `modules/ROOT/pages/web/vue/tooling-and-project-setup.adoc` (issue #39 page 24; book 2
  ch. 1, 3; book 3 ch. 3; book 1 ch. 13)
  - [x] _Done — `modules/ROOT/pages/web/vue/tooling-and-project-setup.adoc` + `[mermaid]` create-vue / Vite pipeline flow; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 23.1. Implement every bullet: `create-vue` + Vite (dev server, HMR, `vite build`), project
    structure, environment modes; Vue CLI in maintenance (pointer only); Vue Language Tools (Volar);
    `eslint-plugin-vue` + Prettier; `vue-tsc` for type-checking SFCs; Vue DevTools — the browser extension
    (v7), the standalone app, and the Vite plugin (component tree, props/state, timeline, Pinia and Router
    integration). `[source,bash]` + `[source,js]`.
  - [x] Task 23.2. Add a `[mermaid]` flow: `create-vue` scaffold → Vite dev server + HMR → `vite build` →
    static assets. Links: at least https://vuejs.org/guide/scaling-up/tooling.html,
    https://github.com/vuejs/create-vue, https://vite.dev/, https://devtools.vuejs.org/.

- [x] Task 24. Create `modules/ROOT/pages/web/vue/routing.adoc` (issue #39 page 25; book 1 ch. 10; book 2
  ch. 4; book 3 ch. 7)
  - [x] _Done — `modules/ROOT/pages/web/vue/routing.adoc` + hand-authored `modules/ROOT/images/vue-router-outlets.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 24.1. Implement every bullet: creating the router (`createRouter` + `createWebHistory` /
    `createWebHashHistory`), `<RouterView>` / `<RouterLink>`, `app.use(router)`; route records, dynamic
    segments and params, props decoupling, nested routes + nested `<RouterView>`, named routes / views,
    redirect / alias, 404 / catch-all (`/:pathMatch(.*)*`); programmatic navigation (`router.push` / `replace`
    / `go`), navigation guards (global `beforeEach` / `afterEach`, per-route, in-component) and the resolution
    flow, lazy-loaded route components, scroll behavior, `useRoute()` / `useRouter()`. `[source,js]` +
    `[source,vue]`.
  - [x] Task 24.2. Create `modules/ROOT/images/vue-router-outlets.svg` — hand-authored: a URL matched to a
    chain of route records rendering into nested `<RouterView>` outlets.
  - [x] Task 24.3. Embed `image::vue-router-outlets.svg[…]`. Links: at least
    https://vuejs.org/guide/scaling-up/routing.html and https://router.vuejs.org/.

- [x] Task 25. Create `modules/ROOT/pages/web/vue/state-management.adoc` (issue #39 page 26; book 1 ch. 11;
  book 2 ch. 5–6; book 3 ch. 9–10)
  - [x] _Done — `modules/ROOT/pages/web/vue/state-management.adoc` + hand-authored `modules/ROOT/images/vue-pinia-store.svg`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 25.1. Implement every bullet: the reactivity-API "simple store" and its limits; when you need
    global state vs. props / provide-inject; Pinia — `defineStore` (setup stores vs. option stores),
    `state` / `getters` / `actions`, using a store in a component, `storeToRefs()`, `$patch` / `$reset` /
    `$subscribe` / `$onAction`, plugins, DevTools, HMR, SSR note; Vuex as legacy (one-line pointer).
    `[source,js]` + `[source,vue]`.
  - [x] Task 25.2. Create `modules/ROOT/images/vue-pinia-store.svg` — hand-authored: a Pinia store box
    (`state` / `getters` / `actions`) with components reading state and calling actions.
  - [x] Task 25.3. Embed `image::vue-pinia-store.svg[…]`. Links: at least
    https://vuejs.org/guide/scaling-up/state-management.html and https://pinia.vuejs.org/.

- [x] Task 26. Create `modules/ROOT/pages/web/vue/testing.adoc` (issue #39 page 27; book 1 ch. 8; book 2
  ch. 3; book 3 ch. 11–12)
  - [x] _Done — `modules/ROOT/pages/web/vue/testing.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 26.1. Implement every bullet: the testing pyramid; Vitest setup for a Vite/Vue project;
    `@vue/test-utils` — `mount` / `shallowMount`, `props`, `emitted()`, `find` / `findComponent`, `trigger`,
    `setValue`, `await nextTick()` / `flushPromises`, stubs / mocks, testing slots; testing composables in
    isolation vs. via a host component; testing with Router and Pinia; snapshot testing; component testing vs.
    E2E; E2E with Cypress / Playwright — interacting with the UI, waiting for updates, intercepting HTTP.
    `[source,js]` + `[source,ts]`. Links: at least https://vuejs.org/guide/scaling-up/testing.html,
    https://test-utils.vuejs.org/, https://vitest.dev/.

- [x] Task 27. Create `modules/ROOT/pages/web/vue/server-side-rendering.adoc` (issue #39 page 28; book 2
  ch. 10)
  - [x] _Done — `modules/ROOT/pages/web/vue/server-side-rendering.adoc` + `[mermaid]` SSR render / hydration sequence; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 27.1. Implement every bullet: CSR vs. SSR vs. SSG vs. ISR and the trade-offs (TTFB, SEO,
    complexity); `createSSRApp`, `renderToString` / the streaming renderers, client hydration and `app.mount`;
    hydration mismatches and `data-allow-mismatch`; `onServerPrefetch`, `useSSRContext`, state transfer,
    cross-request state pollution (factory functions); `<ClientOnly>` / import-on-client patterns; Nuxt as the
    recommended full solution; VitePress for content sites. `[source,js]` + `[source,vue]`.
  - [x] Task 27.2. Add a `[mermaid]` sequence: server `createSSRApp` → `renderToString` → HTML sent → client
    hydration attaches listeners to existing DOM. Links: at least
    https://vuejs.org/guide/scaling-up/ssr.html, https://vuejs.org/api/ssr.html, https://nuxt.com/.

#### TypeScript

- [x] Task 28. Create `modules/ROOT/pages/web/vue/typescript.adoc` (issue #39 page 29; book 2 throughout)
  - [x] _Done — `modules/ROOT/pages/web/vue/typescript.adoc` (issue page 29); docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 28.1. Implement every bullet: project setup (`create-vue` with TS, `vue-tsc`,
    `"types": ["vite/client"]`), `.vue` shims; Composition API typing — typing `ref<T>()` / `reactive` /
    `computed`, type-based `defineProps` / `defineEmits` / `defineModel`, `withDefaults` /
    reactive-props-destructure defaults, typing `useTemplateRef<T>()`, typing provide / inject with
    `InjectionKey<T>`, typing event handlers, generic components; Options API typing — `defineComponent`,
    `PropType<T>`, typing `this`, augmenting `ComponentCustomProperties`; the TypeScript Utility Types
    (`PropType`, `MaybeRef`, `ExtractPropTypes`, …); cross-link `xref:web/typescript/index.adoc[]` for the
    language itself. `[source,ts]` + `[source,vue]`. Links: at least
    https://vuejs.org/guide/typescript/overview.html, https://vuejs.org/guide/typescript/composition-api.html,
    https://vuejs.org/guide/typescript/options-api.html.

#### Under the Hood

- [x] Task 29. Create `modules/ROOT/pages/web/vue/rendering-render-functions-and-web-components.adoc` (issue
  #39 pages 31 **and 32** — merged; book 3 ch. 6 for functional components)
  - [x] _Done — `modules/ROOT/pages/web/vue/rendering-render-functions-and-web-components.adoc` (issue pages 31 + 32 merged) + `[mermaid]` render-pipeline flow; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 29.1. Issue page 31 bullets: the virtual DOM; the render pipeline (compile → mount → patch);
    compiler-informed VDOM (static hoisting, patch flags, tree flattening); where `v-once` / `v-memo` help;
    render functions — `h()`, VNode shape, `v-if` / `v-for` / slots / `v-model` as plain JS, JSX in Vue,
    functional components; when a render function beats a template. `[source,js]` + `[source,jsx]`.
  - [x] Task 29.2. Issue page 32 bullets (merged): using custom elements in Vue
    (`compilerOptions.isCustomElement`, props vs. attributes, events); building custom elements with
    `defineCustomElement()`, `useHost()` / `useShadowRoot()`, style handling, the Vue-vs-Web-Components
    trade-offs. `[source,js]`.
  - [x] Task 29.3. Add a `[mermaid]` flow of the render pipeline: `<template>` → compiled `render()` → VNode
    tree → mount / patch → real DOM, with a patch-flags / static-hoisting callout. Links: at least
    https://vuejs.org/guide/extras/rendering-mechanism.html, https://vuejs.org/guide/extras/render-function.html,
    https://vuejs.org/guide/extras/web-components.html, https://vuejs.org/api/custom-elements.html.

#### Best Practices

- [x] Task 30. Create `modules/ROOT/pages/web/vue/performance-and-deployment.adoc` (issue #39 pages 33 **and
  34** — merged; book 2 ch. 3, 10; book 3 ch. 13)
  - [x] _Done — `modules/ROOT/pages/web/vue/performance-and-deployment.adoc` (issue pages 33 + 34 merged); docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 30.1. Issue page 33 bullets: profiling (DevTools timeline, browser perf panel,
    `app.config.performance`); page-load optimizations (bundle size + tree-shaking, code splitting, SSR/SSG,
    asset/CDN); update optimizations (`v-memo`, `shallowRef` / `shallowReactive`, `<KeepAlive>`, virtualized
    lists, stable keys, avoiding accidental reactivity, computed stability); `defineAsyncComponent` + route
    splitting; production feature flags (`__VUE_OPTIONS_API__`, `__VUE_PROD_DEVTOOLS__`). `[source,js]`.
  - [x] Task 30.2. Issue page 34 bullets (merged): dev vs. prod builds, `NODE_ENV`, removing warnings,
    `vite build` output, ahead-of-time template compilation; runtime error tracking
    (`app.config.errorHandler`, `errorCaptured`, `app.config.warnHandler`); deploying a static SPA
    (history-mode server fallback, cache headers); worked deployments — Netlify, AWS S3 + CloudFront, and a
    CI/CD pipeline (GitLab CI/CD / GitHub Actions) that lints, tests, builds, and deploys. `[source,bash]` +
    `[source,yaml]`. Links: at least https://vuejs.org/guide/best-practices/performance.html,
    https://vuejs.org/guide/best-practices/production-deployment.html.

- [x] Task 31. Create `modules/ROOT/pages/web/vue/security-and-accessibility.adoc` (issue #39 page 35)
  - [x] _Done — `modules/ROOT/pages/web/vue/security-and-accessibility.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 31.1. Security bullets: Vue's built-in HTML-escaping; the `v-html` injection risk; URL /
    attribute / style / `:is` injection; template injection (never compile user input); providing server data
    safely; CSP notes; SSR-specific concerns; cross-link `xref:web/cors.adoc[]`. `[source,vue]`.
  - [x] Task 31.2. Accessibility bullets: semantic templates; skip links; route-change focus management;
    `aria-*` bindings; labelled form controls; testing with `vue-axe` / Lighthouse; cross-link
    `xref:web/accessibility.adoc[]`. `[source,vue]`. Links: at least
    https://vuejs.org/guide/best-practices/security.html, https://vuejs.org/guide/best-practices/accessibility.html.

- [x] Task 32. Create `modules/ROOT/pages/web/vue/style-guide-and-best-practices.adoc` (issue #39 page 36;
  book 1 ch. 1; book 3 best-practice notes throughout)
  - [x] _Done — `modules/ROOT/pages/web/vue/style-guide-and-best-practices.adoc`; docs-only (this repo has no unit-test suite / coverage / static-analysis gate); verified by a clean `npx antora antora-playbook.yml` build — exit 0, zero WARN/ERROR, zero "skipping reference to missing attribute" warnings._
  - [x] Task 32.1. Implement every bullet: the Style Guide priority levels (Essential / Strongly Recommended /
    Recommended) — multi-word component names, detailed prop definitions, keyed `v-for`, avoiding `v-if` with
    `v-for`, component-scoped styling, component/file naming and order, self-closing components, directive
    shorthands; component-design guidance — single responsibility, props-down/events-up, slots vs. props,
    container vs. presentational, folder structure; the Composition API FAQ rationale. `[source,vue]`. Links:
    at least https://vuejs.org/style-guide/, https://vuejs.org/guide/extras/composition-api-faq.html.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 33), but it must run **after** Group 2 so its `xref:` back-links
point at pages that exist and its content reflects every page's final scope.

- [x] Task 33. Create the Vue.js cheat sheet — `modules/ROOT/pages/web/vue/cheat-sheet.adoc` +
  `modules/ROOT/attachments/vue-cheat-sheet.pdf`
  - [x] Task 33.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising **every concept explained in this reference**, per issue #39's cheat-sheet
    content list: `npm create vue@latest` + the SFC skeleton; reactivity (`ref` / `reactive` / `computed` /
    `readonly` / `toRefs`); template syntax (`\{\{ }}`, `v-bind` / `:`, `v-on` / `@`, event & key modifiers);
    directives (`v-if` / `v-else` / `v-show`, `v-for` + `key`, `v-model` + `.lazy` / `.number` / `.trim`,
    `v-html`, `v-once` / `v-memo`, `v-cloak`); `v-model` on form controls; watchers (`watch` opts
    `deep` / `immediate` / `once` / `flush`, `watchEffect`, `onWatcherCleanup`); lifecycle hooks list;
    component API (`defineProps` type-based + validation, `defineEmits`, `defineModel`, `defineExpose`,
    `useTemplateRef`, `useAttrs` / `useSlots`); slots (default / named `#` / scoped); provide / inject
    (+ `InjectionKey`); built-ins (`<Transition>` classes, `<TransitionGroup>`, `<KeepAlive>`
    include/exclude/max, `<Teleport>` to, `<Suspense>`); `defineAsyncComponent`; Vue Router (`createRouter` /
    `createWebHistory`, `<RouterLink>` / `<RouterView>`, dynamic params, nested routes, `beforeEach`,
    `useRoute` / `useRouter`, lazy route); Pinia (`defineStore` setup + option form, `state` / `getters` /
    `actions`, `storeToRefs`); Vitest + Vue Test Utils skeleton (`mount`, `props`, `emitted`, `trigger`,
    `flushPromises`); SSR one-liner (`createSSRApp` + `renderToString` + hydrate); and a short "Options API ⇄
    Composition API" mapping strip. Match the visual style of the existing cheat sheets (see
    `modules/ROOT/pages/web/react/cheat-sheet.adoc` + its PDF, and the Angular / TypeScript ones).
  - [x] Task 33.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=vue-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/vue-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count check
    + a rendered PNG preview with no clipping), readable in light and dark.
  - [x] Task 33.3. Create `modules/ROOT/pages/web/vue/cheat-sheet.adoc`:
    `include::partial$vue-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every Group 2
    page, and `xref:attachment$vue-cheat-sheet.pdf[Download the Vue.js Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 34 (section index) must link every page from Groups 2–3; Tasks 35 and 36 depend
on Task 34 existing and on the final page/file names; Task 37 (build) depends on every prior task having
landed.

- [x] Task 34. Create `modules/ROOT/pages/web/vue/index.adoc` — Vue.js Reference landing page
  - [x] Task 34.1. `= Vue.js Reference`, `:description:` / `:keywords:`,
    `include::partial$vue-disclaimer.adoc[]`, a short intro (https://vuejs.org/[Vue.js] is a progressive
    JavaScript framework for building user interfaces …; this section documents the current Vue 3.x line,
    Composition-API-first, verified against vuejs.org; where to start — `getting-started.adoc` →
    `template-syntax.adoc` → `reactivity-fundamentals.adoc` → `components-basics.adoc`).
  - [x] Task 34.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat
    sheet, one-line blurb each, under readable sub-headings: **Essentials** (getting-started, template-syntax,
    reactivity-fundamentals, computed-properties, conditional-and-list-rendering, event-handling,
    form-input-bindings, watchers, template-refs, lifecycle-hooks, components-basics); **Components in depth**
    (registration-and-props, component-events-and-v-model, slots, provide-inject, async-components);
    **Reusability** (composables, custom-directives-and-plugins); **Built-in components & animation**
    (transitions-and-animation, keepalive-teleport-suspense); **Scaling up** (single-file-components,
    tooling-and-project-setup, routing, state-management, testing, server-side-rendering); **TypeScript**
    (typescript); **Under the hood** (rendering-render-functions-and-web-components); **Best practices**
    (performance-and-deployment, security-and-accessibility, style-guide-and-best-practices); **Reference**
    (cheat-sheet). Mirror `web/react/index.adoc` / `web/angular/index.adoc`.
  - [x] Task 34.3. `== Bibliography` citing, in the order issue #39's Bibliography section gives:
    - **https://vuejs.org/** — the official Vue.js documentation, the source every page is written and verified
      against; call out https://vuejs.org/guide/introduction.html[the Guide] (Essentials, Components In-Depth,
      Reusability, Built-in Components, Scaling Up, Best Practices, TypeScript, Extra Topics), the
      https://vuejs.org/api/[API reference], the https://vuejs.org/style-guide/[Style Guide],
      https://vuejs.org/examples/[Examples], https://play.vuejs.org/[the SFC Playground],
      https://blog.vuejs.org/[the blog], and https://v3-migration.vuejs.org/[the Vue 2 → 3 migration guide].
    - Official ecosystem docs: https://router.vuejs.org/[Vue Router], https://pinia.vuejs.org/[Pinia],
      https://vite.dev/[Vite], https://github.com/vuejs/create-vue[create-vue],
      https://devtools.vuejs.org/[Vue DevTools], https://vitest.dev/[Vitest],
      https://test-utils.vuejs.org/[Vue Test Utils], https://eslint.vuejs.org/[eslint-plugin-vue],
      https://nuxt.com/[Nuxt], and https://vitepress.dev/[VitePress].
    - https://developer.mozilla.org/[MDN Web Docs] — the web-platform APIs Vue builds on (the DOM, events,
      `fetch`, custom elements / Shadow DOM, History API), cross-linked where used, together with the existing
      xref:web/javascript/index.adoc[JavaScript Development] and xref:web/typescript/index.adoc[TypeScript
      Reference] pages on this site.
    - Cuomo, Simone. _Vue.js 3 for Beginners — Learn the essentials of Vue.js 3 and its ecosystem to build
      modern web applications_. Packt Publishing, 2024. ISBN 978-1-80512-677-5. Consulted as part of the
      bibliography for this section — see
      https://www.packtpub.com/en-us/product/vuejs-3-for-beginners-9781805126775[the publisher's book page],
      https://www.packtpub.com/[packtpub.com],
      https://www.oreilly.com/library/view/vue-js-3-for/9781805126775/[the O'Reilly listing], and the
      https://github.com/PacktPublishing/Vue.js-3-for-Beginners[companion code repository].
    - Quinten, Joran. _Building Real-World Web Applications with Vue.js 3 — Build a portfolio of Vue.js and
      TypeScript web applications to advance your career in web development_. Packt Publishing, 2024. ISBN
      978-1-83763-039-4 (print), 978-1-83763-282-4 (ebook). Consulted as part of the bibliography for this
      section — see
      https://www.packtpub.com/en-us/product/building-real-world-web-applications-with-vuejs-3-9781837632824[the
      publisher's book page], https://www.packtpub.com/[packtpub.com],
      https://www.oreilly.com/library/view/building-real-world-web/9781837630394/[the O'Reilly listing], and
      the https://github.com/PacktPublishing/Building-Real-world-Web-Applications-with-Vue.js-3[companion code
      repository].
    - Shavin, Maya; Camden, Raymond; Gurney, Clifford; Di Francesco, Hugo. _Frontend Development Projects with
      Vue.js 3 — Learn the fundamentals of building scalable web applications and dynamic user interfaces with
      Vue.js_, 2nd ed. Packt Publishing, 2023. ISBN 978-1-80323-499-1 (print), 978-1-80323-631-5 (ebook).
      Consulted as part of the bibliography for this section — see
      https://www.packtpub.com/en-us/product/frontend-development-projects-with-vuejs-3-9781803236315[the
      publisher's book page], https://www.packtpub.com/[packtpub.com],
      https://www.oreilly.com/library/view/frontend-development-projects/9781803234991/[the O'Reilly listing],
      and the https://github.com/PacktPublishing/Frontend-Development-Projects-with-Vue.js-3[companion code
      repository].

- [x] Task 35. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 35.1. Add an 11th bullet to the `== Sections` list, after the TypeScript Reference entry (line
    41): `xref:web/vue/index.adoc[Vue.js Reference]` with a one-line blurb (the progressive framework:
    reactivity, the Composition API and `<script setup>`, components, slots and provide/inject, built-in
    components and transitions, Vue Router, Pinia, testing, SSR, and Vue with TypeScript, plus a downloadable
    cheat sheet).
  - [x] Task 35.2. Update the page's own `:description:` and `:keywords:` attributes to mention Vue.js / Vue 3
    / Composition API / Pinia / Vue Router.

- [x] Task 36. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 36.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/vue/index.adoc[Vue.js Reference]` block
    under `** xref:web/index.adoc[Web Development]`, **after** the TypeScript Reference block (which ends the
    file at line 275 `**** xref:web/typescript/cheat-sheet.adoc[Cheat Sheet (PDF)]`), with a `****` line per
    page in this reading order: getting-started, template-syntax, reactivity-fundamentals, computed-properties,
    conditional-and-list-rendering, event-handling, form-input-bindings, watchers, template-refs,
    lifecycle-hooks, components-basics, registration-and-props, component-events-and-v-model, slots,
    provide-inject, async-components, composables, custom-directives-and-plugins, transitions-and-animation,
    keepalive-teleport-suspense, single-file-components, tooling-and-project-setup, routing, state-management,
    testing, server-side-rendering, typescript, rendering-render-functions-and-web-components,
    performance-and-deployment, security-and-accessibility, style-guide-and-best-practices, cheat-sheet. Use
    short label text (e.g. `[Getting Started]`, `[Template Syntax]`, …, `[Cheat Sheet (PDF)]`).
  - [x] Task 36.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/vue/index.adoc[Vue.js Reference] -- …` after the TypeScript Reference bullet (line 116) under
    the Web Development entry, matching the existing one-line-blurb format, and update that page's
    `:keywords:` / `:description:` to include Vue.js / Vue 3 / Composition API.

- [x] Task 37. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for Vue.js Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/vue/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/vue/*.html (all 33 pages), the PDF attachment
      build/site/_attachments/vue-cheat-sheet.pdf, the eight images build/site/_images/vue-*.svg
      (vue-composition-vs-options, vue-reactivity-track-trigger, vue-one-way-data-flow, vue-slots,
      vue-provide-inject, vue-transition-classes, vue-router-outlets, vue-pinia-store), every new nav entry,
      and all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 37.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute"
    warnings (most likely an unescaped `\{ … }` in prose — a mustache interpolation, an object binding, a
    `defineProps<\{ … }>()` in prose, a `v-slot="\{ … }"` — a typo'd `xref:` target, or a missing nav entry),
    then re-run the agent until the build is clean, before checking this task off.
  - [x] Task 37.2. After the build is clean, per the repo convention (`update-docs`), confirm no other Antora
    page needs a cross-reference update for the new section (spot-check `web/typescript/index.adoc`,
    `web/react/index.adoc`, and `web/angular/index.adoc` — a "for Vue, see the Vue.js Reference" pointer may
    fit their existing style; add it only if it does, otherwise note the check).
