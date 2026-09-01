# Implementation Plan: Web Development / Vue.js Reference — UI Component Libraries page

## Task summary

Source: GitHub issue #41

Issue [#41](https://github.com/albertoirurueta/docs/issues/41) ("Vue.js Reference: UI Component Libraries
page") asks to add **one new page**, `modules/ROOT/pages/web/vue/ui-component-libraries.adoc`, to the existing
**Guides & References / Web Development / Vue.js Reference** subsection (landed on `main` via PR #40). It
surveys the modern Vue 3 UI component library landscape — **free / open-source (MIT-style) first**, commercial
/ licensed last — and must:

- **Follow the structure and depth of the three sibling UI-library pages that already exist** in this docs
  site: [`modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc`](modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc)
  (same page title), [`modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc`](modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc)
  (the richest model, ~390 lines), and
  [`modules/ROOT/pages/web/react/styling-and-ui-libraries.adoc`](modules/ROOT/pages/web/react/styling-and-ui-libraries.adoc)
  (the concise variant). Adopt their shape: `== Styling options` → `== Component libraries -- free and
  open-source` (one `=== <Name> (<LICENSE>)` sub-section per library, in rough order of adoption) →
  `== Commercial suites -- paid / licensed` (listed **without examples**) → `== Accessibility`.
- **Give every referenced free / open-source library at least one code example** — an install `[source,bash]`
  command **and** a short usage snippet (`[source,vue]` `<script setup>` + `<template>`, or `[source,ts]` for
  the `app.use()` registration where that is the point). Commercial-only suites get **no** examples. A library
  with a free MIT core and a paid tier still gets an example for its free part, with the paid tier flagged.
- Cover the full grouped library list in the issue, a licence-first "how to choose" checklist, one worked
  install/registration example (global `app.use()` **and** `unplugin-vue-components` auto-import), a decision
  aid, and cross-links to the tooling / SFC / SSR / accessibility / Tailwind pages.
- Be wired into `modules/ROOT/nav.adoc`, `modules/ROOT/pages/web/vue/index.adoc` (`== What's covered` +
  `== Bibliography`), and `modules/ROOT/pages/web/vue/cheat-sheet.adoc` (back-link only — **no cheat-sheet PDF
  change**). No change to `modules/ROOT/pages/web/index.adoc` or the root `modules/ROOT/pages/index.adoc`.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **Decision aid = a comparison table, not a `[mermaid]` flowchart.** The three sibling pages use prose +
   code and no diagrams; a 4-column table (Library · Style model · Best for · Licence) renders cleanly in
   Antora and is the easiest form to scan for a "which one" comparison. (Issue #41 explicitly allows either.)
2. **The one worked install/registration example uses Element Plus.** Its `unplugin-vue-components` +
   `ElementPlusResolver` setup is the canonical documented auto-import example and is lighter to show than
   Vuetify's Vite plugin; the global `app.use(ElementPlus)` form is shown alongside it. (Issue suggests
   Vuetify or Element Plus.)
3. **Page placement:** `nav.adoc` — new `****` entry **between** `style-guide-and-best-practices` and
   `cheat-sheet` (nav lines 308–309). `index.adoc` — under the existing `=== Best practices` sub-heading,
   after the `style-guide-and-best-practices` bullet, before `=== Reference`. `cheat-sheet.adoc` — added to
   the existing `*Best practices*` back-link group.
4. **Source-block languages:** `[source,bash]` for installs, `[source,ts]` for `main.ts` / `vite.config.ts`,
   `[source,vue]` for `<script setup>` + `<template>` component usage — matching the rest of the `web/vue/`
   section. Composition API + `<script setup>` in every snippet. Literal `\{ … }` braces in prose outside
   `[source]` blocks are backslash-escaped (the section-wide AsciiDoc gotcha).
5. **No hand-authored `vue-*.svg`** for this page (the issue says none is expected; none of the sibling pages
   use one).
6. **This is a small, additive change** — one new content page plus three small wiring edits plus a build
   check. Modelled on the last two task groups of a full-section plan (e.g.
   [.archive/implementation_plan_39.md](.archive/implementation_plan_39.md), issue #39), minus the
   disclaimer/cheat-sheet/SVG work. The library-content shape follows
   [.archive/implementation_plan_29.md](.archive/implementation_plan_29.md) (Angular) and
   [.archive/implementation_plan_31.md](.archive/implementation_plan_31.md) (ASP.NET), which
   `.archive/implementation_plan_31.md` itself names as "the direct precedent for the
   `ui-component-libraries.adoc` open-source-first / commercial-last / no-examples-for-commercial treatment".

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), pages under
  `modules/ROOT/pages/`. Only verification is a clean `npx antora antora-playbook.yml` (no lint/test suite;
  `build/` is gitignored). Installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none
  applies**; every task below is AsciiDoc content, implemented directly and left **untagged**.
- **The Vue.js Reference subsection** (`modules/ROOT/pages/web/vue/`, 33 `.adoc` pages) is now on `main`. Its
  conventions (from `.archive/implementation_plan_39.md`): every page opens
  `= Title` / `:description:` / `:keywords:` / blank / `include::partial$vue-disclaimer.adoc[]` / blank /
  one–two-sentence lead; brief example-driven prose; Composition API + `<script setup>` in examples;
  `[source,vue]` for SFCs; escape literal `\{ … }` in prose outside `[source]` blocks or the Antora build
  emits `skipping reference to missing attribute` warnings.
- **Sibling UI-library pages** (the template for this one):
  - `modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc` — `== Styling options` (Bootstrap/LibMan,
    Tailwind, Sass, Blazor CSS isolation) → `== Blazor component libraries -- free and open-source`
    (`=== MudBlazor (MIT)` etc., each `[source,bash]` install + `[source,razor]` usage) →
    `== Server-rendered … UI` → `== Commercial suites -- paid / licensed` (bullets, no examples) →
    `== Accessibility`.
  - `modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc` — `== Styling options` (scoped styles &
    view encapsulation, Sass, Tailwind, dynamic theming, `NgClass`/`NgStyle`) →
    `== Component libraries -- free and open-source` ("listed roughly in order of adoption"; `=== Angular
    Material (MIT)` … each `[source,bash]` install + `[source,typescript]`/template usage; the deep library
    gets "a pointer only -- see xref:…") → `== Commercial suites -- paid / licensed` ("listed last and without
    examples", bullets with inline links + one line each) → `== Accessibility` (prose + one `[source]` example
    + `xref:web/accessibility.adoc[]`).
  - `modules/ROOT/pages/web/react/styling-and-ui-libraries.adoc` — same shape, terser: `== Styling options`
    bullets, `== Component libraries` (one bullet per library, each with a `[source,jsx]` snippet),
    `== Accessibility`.
  - None of the three use `image::` / SVG.
- **Insertion points** (verified):
  - `modules/ROOT/nav.adoc` line 308 `**** xref:web/vue/style-guide-and-best-practices.adoc[Style Guide &
    Best Practices]`, line 309 `**** xref:web/vue/cheat-sheet.adoc[Cheat Sheet (PDF)]` — new entry goes
    between them.
  - `modules/ROOT/pages/web/vue/index.adoc` — `=== Best practices` heading at line 105; its last bullet
    (`style-guide-and-best-practices`) ends at line ~112; `=== Reference` begins at line 114. `:keywords:` is
    line 3. `== Bibliography` "Official ecosystem documentation cited in this section" bullet spans lines
    ~134–138 (currently: Vue Router, Pinia, Vite, create-vue, Vue DevTools, Vitest, Vue Test Utils,
    eslint-plugin-vue, Nuxt, VitePress).
  - `modules/ROOT/pages/web/vue/cheat-sheet.adoc` — `*Best practices* --` group at lines 60–63 (currently
    lists only `style-guide-and-best-practices`).
- **`modules/ROOT/partials/vue-disclaimer.adoc`** — reused unchanged (already `include`d by every `web/vue/`
  page).
- **`iru-gate-runner`** agent is installed in `.claude/agents/` — used for the final build check so the log
  stays out of the main context.
- **New file map:** creates `modules/ROOT/pages/web/vue/ui-component-libraries.adoc`; edits
  `modules/ROOT/nav.adoc`, `modules/ROOT/pages/web/vue/index.adoc`,
  `modules/ROOT/pages/web/vue/cheat-sheet.adoc`.

## Conventions this page must follow

- Standard header: `= UI Component Libraries`, then `:description:` (one sentence) and `:keywords:` (comma
  list), a blank line, `include::partial$vue-disclaimer.adoc[]`, a blank line, then a one/two-sentence lead
  that states **"free and open-source first, commercial suites last, without examples"** — identical placement
  to every other `web/vue/*.adoc` page (e.g.
  [`modules/ROOT/pages/web/vue/tooling-and-project-setup.adoc`](modules/ROOT/pages/web/vue/tooling-and-project-setup.adoc)).
- **Brief and concise**, example-driven prose; Composition API + `<script setup>` in every code example.
- **Every free / open-source library entry** = a `=== <Name> (<LICENSE>)` sub-section with: a 1–2 sentence
  "what it is" carrying an **inline link to that library's official docs site**, its **licence** (MIT unless
  noted; any paid tier flagged), a note on Vue 3 / `<script setup>` / TypeScript / SSR support, **an install
  `[source,bash]` command, and a representative `[source,vue]` (or `[source,ts]`) usage snippet**.
- **Commercial-only suites** are listed as bullets in `== Commercial suites -- paid / licensed`, one line +
  inline link each, **no code examples**.
- Link the relevant https://vuejs.org/ pages where a Vue concept is referenced
  (https://vuejs.org/guide/reusability/plugins.html[Plugins] for `app.use()`,
  https://vuejs.org/guide/scaling-up/ssr.html[SSR], https://vuejs.org/api/sfc-css-features.html[SFC CSS
  features] for `:deep()`), and cross-link `xref:web/vue/tooling-and-project-setup.adoc[]`,
  `xref:web/vue/single-file-components.adoc[]`, `xref:web/vue/server-side-rendering.adoc[]`,
  `xref:web/vue/security-and-accessibility.adoc[]`, `xref:web/tailwind/index.adoc[Tailwind Reference]`,
  `xref:web/sass/index.adoc[Sass Reference]`, and `xref:web/accessibility.adoc[Web Accessibility]` where
  relevant.
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks.
- The full grouped library list and per-library detail is in issue #41's "What the page must cover" section —
  the task below references it; implement every library it lists.

## Implementation steps

### Group 1 — The content page

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/pages/web/vue/ui-component-libraries.adoc` (issue #41; model on
  `web/aspnet/ui-component-libraries.adoc` + `web/angular/styling-and-ui-libraries.adoc` +
  `web/react/styling-and-ui-libraries.adoc`)
  - [x] Task 1.1. Header + `include::partial$vue-disclaimer.adoc[]` + lead paragraph ("This page surveys how
    to style a Vue app and which ready-made component libraries to reach for. Free and open-source options come
    first, in rough order of adoption; commercial suites are listed last, without examples.").
  - [x] Task 1.2. `== How to choose` — a short bulleted checklist framing the page: **licence first** (prefer
    permissive MIT; flag paid "Pro" / templates / enterprise tiers — Nuxt UI Pro, PrimeVue templates, FormKit
    Pro, AG Grid Enterprise, Kendo UI); Vue 3 + `<script setup>` + TypeScript first-class support;
    tree-shaking / bundle size and auto-import (`unplugin-vue-components` resolvers) vs. a global `app.use()`
    plugin; styling model (own-CSS design system vs. Tailwind-based vs. headless/unstyled); accessibility
    (WAI-ARIA, keyboard nav, focus management) — cross-link
    `xref:web/vue/security-and-accessibility.adoc[]`; SSR / Nuxt compatibility — cross-link
    `xref:web/vue/server-side-rendering.adoc[]`; maintenance & community; theming / dark mode / i18n.
  - [x] Task 1.3. `== Styling options` — brief sub-sections (prose + a small snippet where it helps):
    **`<style scoped>` / CSS Modules / `v-bind()` in CSS** (cross-link
    `xref:web/vue/single-file-components.adoc[]`; note `:deep()` for reaching into a library component's
    internals, linking https://vuejs.org/api/sfc-css-features.html[SFC CSS features]);
    **https://tailwindcss.com/[Tailwind CSS]** utility classes in templates (cross-link
    `xref:web/tailwind/index.adoc[Tailwind Reference]`); **Sass** via `lang="scss"` in an SFC `<style>` block
    or a Vite Sass setup (cross-link `xref:web/sass/index.adoc[Sass Reference]`).
  - [x] Task 1.4. `== Installing and registering a library` — the one worked example with **Element Plus**:
    `[source,bash]` install (`npm i element-plus`), `[source,ts]` global registration in `main.ts`
    (`app.use(ElementPlus)` + `import 'element-plus/dist/index.css'`), then `[source,ts]` **on-demand
    auto-import** with `unplugin-vue-components` + `ElementPlusResolver` in `vite.config.ts` (noting the
    bundle-size win, no manual CSS import). Link https://vuejs.org/guide/reusability/plugins.html[Plugins] and
    cross-link `xref:web/vue/tooling-and-project-setup.adoc[]`.
  - [x] Task 1.5. `== Component libraries -- free and open-source` — a `=== <Name> (<LICENSE>)` sub-section
    per library, each with description + inline docs link + licence/paid-tier note + Vue 3 / TS / SSR note +
    `[source,bash]` install + `[source,vue]` (or `[source,ts]`) usage snippet. Cover **every** library issue
    #41 lists, grouped and roughly in adoption order:
    - **Comprehensive suites (styled, MIT):** https://vuetifyjs.com/[Vuetify 3],
      https://primevue.org/[PrimeVue] (MIT core, paid templates), https://element-plus.org/[Element Plus]
      (pointer to the Task 1.4 example + one component snippet), https://www.naiveui.com/[Naive UI],
      https://antdv.com/[Ant Design Vue], https://quasar.dev/[Quasar] (components + SPA/SSR/PWA/Electron/
      Capacitor build modes; MIT, no paid tier), https://ui.vuestic.dev/[Vuestic UI]; brief mentions of
      https://arco.design/vue/[Arco Design Vue] and https://tdesign.tencent.com/vue-next/[TDesign Vue Next].
    - **Tailwind-CSS-based / modern:** https://ui.nuxt.com/[Nuxt UI v3] (built on Reka UI + Tailwind v4;
      works in plain Vue — Vite/Inertia/SSR — not only Nuxt; MIT core, **Nuxt UI Pro** paid),
      https://www.shadcn-vue.com/[shadcn-vue] (copy components into your repo; built on Reka UI + Tailwind;
      MIT), https://daisyui.com/[daisyUI] (Tailwind component classes, no JS; MIT).
    - **Headless / unstyled primitives:** https://reka-ui.com/[Reka UI] (**formerly Radix Vue**, renamed
      2024; note https://reka-ui.com/docs/guides/migration[the migration guide]), https://headlessui.com/[
      Headless UI (Vue)], https://ark-ui.com/[Ark UI] (framework-agnostic, Vue adapter, built on Zag.js).
    - **Mobile-first:** https://vant-ui.github.io/vant/[Vant],
      https://varletjs.org/[Varlet], https://ionicframework.com/docs/vue/overview[Ionic Vue]; cross-reference
      Quasar's mobile mode.
    - **Bootstrap / Bulma flavour:**
      https://bootstrap-vue-next.github.io/bootstrap-vue-next/[BootstrapVueNext] (Bootstrap 5 for Vue 3),
      https://oruga-ui.com/[Oruga] (style-agnostic, by the Buefy team).
    - **Specialised (data grids, forms):** https://www.ag-grid.com/vue-data-grid/[AG Grid] (Community MIT,
      **Enterprise paid**), https://tanstack.com/table[TanStack Table] +
      https://tanstack.com/virtual[TanStack Virtual] (headless), https://formkit.com/[FormKit] (MIT core,
      **FormKit Pro** paid) — and note `xref:web/vue/form-input-bindings.adoc[]` already covers
      https://vee-validate.logaretm.com/[VeeValidate] and native `v-model`.
    - **Adjacent (one-liner + link each):** https://vueuse.org/[VueUse] (composables),
      https://github.com/unplugin/unplugin-vue-components[unplugin-vue-components] (auto-import),
      https://tailwindcss.com/[Tailwind CSS] (cross-link `xref:web/tailwind/index.adoc[]`).
  - [x] Task 1.6. `== A "which one?" decision aid` — a 4-column comparison **table**:
    `Library / group | Style model | Best for | Licence`, one row per major option
    (Vuetify · PrimeVue · Element Plus · Naive UI · Ant Design Vue · Nuxt UI · shadcn-vue · daisyUI · Reka UI ·
    Headless UI · Ark UI · Ionic Vue · Vant/Varlet · Quasar · BootstrapVueNext · Oruga · AG Grid · TanStack
    Table), summarising: full styled design system → Vuetify/PrimeVue/Element Plus/Naive UI/Ant Design Vue;
    Tailwind-first → Nuxt UI/shadcn-vue/daisyUI/Vuestic; full markup control, accessible behaviour only →
    Reka UI/Headless UI/Ark UI; mobile/hybrid → Ionic Vue/Vant/Varlet/Quasar; one codebase for web+desktop+
    mobile → Quasar; heavy data grids → AG Grid (Community) or TanStack Table.
  - [x] Task 1.7. `== Notes and caveats` — SSR: not every library hydrates cleanly (link
    `xref:web/vue/server-side-rendering.adoc[]`; Nuxt UI, Vuetify, PrimeVue, Element Plus, Quasar document
    SSR/Nuxt setup); scoped styles vs. library CSS — `:deep()` is often needed (link
    `xref:web/vue/single-file-components.adoc[]`); prefer libraries that ship their own TypeScript types and
    support **Volar** template IntelliSense.
  - [x] Task 1.8. `== Commercial suites -- paid / licensed` — a short intro ("These are licensed products;
    listed last and without examples."), then bullets: https://www.telerik.com/kendo-vue-ui[Kendo UI for Vue]
    (Progress/Telerik — broad commercial component + data-grid suite), plus a one-line reminder that Nuxt UI
    Pro, PrimeVue templates, FormKit Pro, and AG Grid Enterprise are the paid tiers of otherwise-free
    libraries covered above.
  - [x] Task 1.9. `== Accessibility` — prose: a component library gives accessible primitives, but you still
    own the wiring (label every control, manage focus in dialogs/menus, honour `prefers-reduced-motion`, test
    with a keyboard and a screen reader); Reka UI / Headless UI / Ark UI and the accessible-by-default suites
    (Vuetify, Nuxt UI) handle roving focus and ARIA for you; test with `vue-axe` / Lighthouse. Cross-link
    `xref:web/vue/security-and-accessibility.adoc[Security and Accessibility]` and
    `xref:web/accessibility.adoc[Web Accessibility]`.
  - [x] Task 1.10. Re-read the finished page: confirm every `=== <Name> (<LICENSE>)` sub-section has an
    install command **and** a usage snippet; every commercial entry has **no** snippet; every library has an
    inline official-docs link; all literal `\{ … }` in prose are escaped; Composition API + `<script setup>`
    throughout.

### Group 2 — Wiring

**Parallelizable: yes** (single task; three independent small edits, none depends on another's result, but the
group as a whole depends on Group 1's file existing so the new `xref:` targets resolve).

- [x] Task 2. Wire the new page into the section nav, index, and cheat sheet
  - [x] Task 2.1. `modules/ROOT/nav.adoc` — insert
    `**** xref:web/vue/ui-component-libraries.adoc[UI Component Libraries]` between the current line 308
    (`**** xref:web/vue/style-guide-and-best-practices.adoc[Style Guide & Best Practices]`) and line 309
    (`**** xref:web/vue/cheat-sheet.adoc[Cheat Sheet (PDF)]`).
  - [x] Task 2.2. `modules/ROOT/pages/web/vue/index.adoc` —
    - under `=== Best practices`, add a bullet after the `style-guide-and-best-practices` bullet (and before
      `=== Reference`):
      `* xref:web/vue/ui-component-libraries.adoc[UI Component Libraries] -- how to style a Vue app and which
      ready-made component libraries to reach for, free and open-source first (Vuetify, PrimeVue, Element Plus,
      Naive UI, Quasar, Nuxt UI, Reka UI, …), with commercial suites and accessibility last.`
    - append to the `:keywords:` line (line 3):
      `, UI component libraries, Vuetify, PrimeVue, Element Plus, Naive UI, Reka UI, Nuxt UI, Quasar, headless
      components`.
    - extend the `== Bibliography` "Official ecosystem documentation cited in this section" bullet with the
      library docs the new page cites, appended to the existing list in the same grouped-bullet style:
      `https://vuetifyjs.com/[Vuetify], https://primevue.org/[PrimeVue], https://element-plus.org/[Element
      Plus], https://www.naiveui.com/[Naive UI], https://quasar.dev/[Quasar], https://reka-ui.com/[Reka UI],
      https://ui.nuxt.com/[Nuxt UI], https://headlessui.com/[Headless UI], https://vant-ui.github.io/vant/[
      Vant], https://www.ag-grid.com/vue-data-grid/[AG Grid], and https://vueuse.org/[VueUse]`.
  - [x] Task 2.3. `modules/ROOT/pages/web/vue/cheat-sheet.adoc` — add
    `xref:web/vue/ui-component-libraries.adoc[UI Component Libraries]` to the `*Best practices* --` back-link
    group (lines 60–63), after the `style-guide-and-best-practices` entry, keeping the existing
    comma/`and`-joined inline-list style. **No change to `vue-cheat-sheet.pdf`.**
  - [x] Task 2.4. Confirm **no** change is needed to `modules/ROOT/pages/web/index.adoc` or the root
    `modules/ROOT/pages/index.adoc` (they list the subsection, not individual pages) — note the check.

### Group 3 — Build verification

**Parallelizable: yes** (single task; depends on Groups 1–2 having landed).

- [x] Task 3. Final Antora build verification — delegate to the `iru-gate-runner` agent so the build log stays
  out of the main context:
  ```
  Agent({
    description: "Verify Antora build for Vue UI Component Libraries page",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to
      modules/ROOT/pages/web/vue/ui-component-libraries.adoc, modules/ROOT/nav.adoc,
      modules/ROOT/pages/web/vue/index.adoc, and modules/ROOT/pages/web/vue/cheat-sheet.adoc; and confirmation
      that build/site/web/vue/ui-component-libraries.html exists, the new nav entry
      (web/vue/ui-component-libraries) appears in a built vue page's nav, and the page's external links and
      any table render. Do not paste the full log."
  })
  ```
  - [x] Task 3.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute"
    warnings (most likely an unescaped `\{ … }` in prose — e.g. a `:class="\{ … }"` binding written in prose,
    an object literal, a `defineProps<\{ … }>()` — or a typo'd `xref:` target), then re-run the agent until
    the build is clean, before checking this task off.
  - [x] Task 3.2. After the build is clean, spot-check that
    `modules/ROOT/pages/web/react/styling-and-ui-libraries.adoc` and
    `modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc` do **not** need a reciprocal "see the Vue
    UI Component Libraries page" pointer (the sibling pages don't cross-link each other's framework surveys —
    adding one would break their style); note the check, add nothing.
