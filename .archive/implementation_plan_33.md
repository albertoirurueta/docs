# Implementation Plan: Web Development / Tailwind Reference

## Task summary

Source: GitHub issue #33

Issue [#33](https://github.com/albertoirurueta/docs/issues/33) ("Tailwind Reference") asks to add a new
**"Tailwind Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/tailwind/` — a ninth sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, `web/react/`, `web/angular/`, and `web/aspnet/`.
It documents **Tailwind CSS v4.x** (the CSS-first configuration line, v4.0 shipped January 2025) as published at
https://tailwindcss.com/docs/ — the utility-first workflow, states/variants, responsive design & container
queries, dark mode, theme variables & the OKLCH palette, Preflight, the utility families (layout, flexbox/grid,
spacing/sizing, typography, backgrounds/borders/effects, filters/transitions/transforms, tables, interactivity,
SVG, accessibility), CSS-first customization (`@theme` / `@utility` / `@custom-variant` / `@apply` / `@source` /
`@reference` / the `--spacing()` / `--alpha()` functions), arbitrary values and escape hatches, build &
production, a v3→v4 upgrade page, a worked example, plus a one-page downloadable PDF cheat sheet. Explanations
must be brief and example-driven, every concept must carry at least one runnable code example and a link to the
specific page on https://tailwindcss.com/docs/, and `[mermaid]` diagrams and/or hand-authored inline SVG figures
are used where they clarify a concept.

Two PDF books were consulted while planning this section:

- `~/Desktop/book1.pdf` — *Modern CSS with Tailwind*, **Second Edition**, Noel Rappin, The Pragmatic Bookshelf
  (The Pragmatic Programmers, LLC), 2022 (supplied PDF is beta build B3.0, 19 April 2022), ISBN
  978-1-68050-940-3, ~100 pp, 8 chapters (concise guided intro; explicitly targets **Tailwind 3.0** and its JIT
  engine). Publisher page:
  https://pragprog.com/titles/tailwind2/modern-css-with-tailwind-second-edition/ ; publisher home:
  https://pragprog.com/
- `~/Desktop/book2.pdf` — *Ultimate Tailwind CSS Handbook*, Kartik Bhat, Orange Education Pvt Ltd (AVA™), first
  published August 2023, ISBN 978-93-88590-76-1, ~293 pp, 7 chapters (utility-by-utility catalogue + two
  end-to-end worked website builds + best practices; targets **Tailwind v3.x** — `tailwind.config.js` +
  `@tailwind` directives). Publisher page: https://orangeava.com/products/ultimate-tailwind-css-handbook ;
  publisher home: https://orangeava.com/ ; code bundle:
  https://github.com/OrangeAVA/Ultimate-Tailwind-CSS-Handbook

**Both books are cited only as bibliography entries** — never as the "primary" or "main" reference — matching the
Angular and ASP.NET disclaimers' "third variant" wording, and unlike the jQuery/React ones.
https://tailwindcss.com/docs/ is the source every page is written and verified against; **both books predate the
Tailwind v4 rewrite**, so where a book and the current docs disagree (`tailwind.config.js` vs. `@theme`,
`@tailwind base/components/utilities` vs. `@import "tailwindcss"`, `flex-shrink-*` / `flex-grow-*` vs.
`shrink-*` / `grow-*`, `bg-opacity-*` vs. the `/` modifier, `shadow-sm` / `rounded-sm` / `outline-none`
renames, the default `border` / `ring` colour, `!flex` vs. `flex!`, `bg-[--x]` vs. `bg-(--x)`), the docs win
and the difference is noted (concentrated in `upgrading-v3-to-v4.adoc`).

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, and ASP.NET reference sections. The closest and most direct precedents are
[.archive/implementation_plan_31.md](.archive/implementation_plan_31.md) (issue #31, "ASP.NET Reference") and
[.archive/implementation_plan_29.md](.archive/implementation_plan_29.md) (issue #29, "Angular Reference"): a new
Web Development sibling grounded in an official doc site plus reference books that are bibliography-only and
predate the current version, with mermaid diagrams, hand-authored SVG figures, a `== Bibliography`, and a
headless-Chrome-rendered one-page PDF cheat sheet, organised into four task groups (scaffold the disclaimer →
parallel content pages → cheat sheet → section index + nav/landing wiring + build verification).

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's pattern and the issue text — stated here so they can be challenged during review)

1. **Document the current stable Tailwind CSS v4.x line as published at https://tailwindcss.com/docs/**, not
   pinned to a patch version. Every example uses **CSS-first configuration** (`@import "tailwindcss";` +
   `@theme { … }`), the **Vite plugin** (`@tailwindcss/vite`) as the default install path, `@utility` /
   `@custom-variant` for extension, built-in container queries, the `/` opacity modifier, and the OKLCH
   palette. Where a book uses a v3 pattern, the page documents the v4 approach and notes the change; the
   systematic v3→v4 delta lives on its own page (`upgrading-v3-to-v4.adoc`).
2. **Page breakdown: 19 content pages + 1 cheat sheet + 1 section index (21 `.adoc` files).** The issue's page
   list is followed as-is, with the issue's own suggested merge applied: **Tables** utilities fold into
   `layout.adoc` (too small for a standalone page), and **SVG + Accessibility** utilities share
   `interactivity-svg-accessibility.adoc`. No further splitting is warranted.
3. **Both books promoted to bibliography-only.** Neither the disclaimer nor any per-page admonition may describe
   either book as the primary or main reference; they appear only as `== Bibliography` entries and in the
   disclaimer's "consulted while preparing these pages" clause.
4. **The subsection is named "Tailwind Reference"** in the section index title, the `web/index.adoc` bullet, the
   `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings.
5. **Placed last**, after ASP.NET Reference, in `nav.adoc`, `web/index.adoc`, and the root `index.adoc` — the
   same "append in the order added" ordering every prior subsection followed.
6. **Mermaid is the default for flow/decision diagrams; four hand-authored SVGs** where a spatial figure is
   clearer than a flowchart: `tailwind-class-anatomy.svg` (a class like
   `dark:md:hover:bg-sky-500/75` split into variant · variant · variant · property · colour · shade ·
   opacity), `tailwind-group-peer.svg` (`group` parent-state → descendant reacts / `peer` prior-sibling-state
   → later sibling reacts), `tailwind-breakpoints.svg` (the mobile-first number line base → `sm` 40rem → `md`
   48rem → `lg` 64rem → `xl` 80rem → `2xl` 96rem), and `tailwind-cascade-layers.svg` (the
   `theme` → `base` → `components` → `utilities` layer order and why utilities win). Mermaid covers: the
   build/scan pipeline (source files → class-token scan → matched utilities → generated CSS → minified
   stylesheet), a `@theme` variable generating both a utility class and a CSS custom property, the container
   query vs. media query reaction model, and the dark-mode strategy decision
   (`prefers-color-scheme` vs. `.dark` class vs. `data-theme`). The implementer may add further small
   `tailwind-*.svg` figures under `modules/ROOT/images/` while writing a page if one adds real value — not
   pre-planned as separate tasks. No diagram where a short code block is clearer; prefer linking Tailwind's own
   flexbox/grid illustrations over redrawing them.
7. **Cross-reference existing pages instead of duplicating them**: `dark-mode.adoc` →
   `xref:web/html-css/theming.adoc[]`; `layout.adoc` / `flexbox-and-grid.adoc` →
   `xref:web/html-css/layout.adoc[]`; `spacing-and-sizing.adoc` → `xref:web/html-css/box-model.adoc[]`;
   `filters-transitions-transforms.adoc` → `xref:web/html-css/transitions.adoc[]` +
   `xref:web/html-css/animations.adoc[]`; `interactivity-svg-accessibility.adoc` →
   `xref:web/accessibility.adoc[]` + `xref:web/html-css/svg-styling-animation.adoc[]`;
   `build-and-production.adoc` → `xref:web/html-css/performance-build-optimization.adoc[]`;
   `utility-first-fundamentals.adoc` → `xref:web/bootstrap/index.adoc[]` (utility-vs-component-framework
   contrast) + `xref:web/sass/index.adoc[]` (preprocessor contrast); `customization-and-configuration.adoc` →
   `xref:web/html-css/variables-media-queries.adoc[]` (CSS custom properties); `getting-started.adoc` →
   `xref:web/html-css/index.adoc[]`.
8. **No "quiz"/"related questions" page** — book 2 has chapter-end multiple-choice questions, but that is not
   this repo's section pattern (the jQuery section carried one only because the issue explicitly asked for it).
9. **No project-picker icon/xref** for Tailwind Reference — like the other Web Development subsections it lives
   only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    static checked-in asset at `modules/ROOT/attachments/tailwind-cheat-sheet.pdf`, linked via
    `xref:attachment$tailwind-cheat-sheet.pdf[Download the Tailwind Cheat Sheet (PDF)]`. The cheat sheet must
    be **exactly one A4 page** (page-count check + a rendered preview with no clipping).

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no lint/test
  suite). Installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none applies**; every
  task below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left **untagged**.
- **Web Development** ([modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc)) currently lists
  two standalone pages (`web/cors.adoc`, `web/accessibility.adoc`) then eight subsections: **HTML & CSS
  Reference**, **Sass Reference**, **JavaScript Development**, **Bootstrap Reference**, **jQuery Reference**,
  **React Reference**, **Angular Reference**, **ASP.NET Reference**. All follow one structural pattern this plan
  reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. [modules/ROOT/partials/aspnet-disclaimer.adoc](modules/ROOT/partials/aspnet-disclaimer.adoc)
    and `angular-disclaimer.adoc` are the **"third variant"** to follow: the official site is the reference the
    pages are written and verified against; the book(s) are named **only as bibliography entries**, not the
    primary source, and are noted to predate the current major version.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph. Body uses `[source,html]` /
    `[source,css]` / etc. fenced by `----`, `[mermaid]` blocks for diagrams, and
    `image::<name>.svg[alt,width=…,role=text-center]` for figures (see
    `modules/ROOT/pages/web/bootstrap/utilities.adoc` and `modules/ROOT/pages/web/aspnet/dependency-injection.adoc`
    for the exact idiom).
  - A section `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    [modules/ROOT/pages/web/aspnet/index.adoc](modules/ROOT/pages/web/aspnet/index.adoc) and
    `modules/ROOT/pages/web/bootstrap/index.adoc` for the exact format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (existing: `html-css-`, `sass-`, `javascript-`, `bootstrap-`,
    `jquery-`, `react-`, `angular-`, `aspnet-`, `sql-cheat-sheet.pdf`).
  - [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) lists `Web Development` (`**` under `* Guides & References`)
    with each subsection (`***`) and its own detail pages (`****`). The **ASP.NET block is currently last**,
    ending line 209 `**** xref:web/aspnet/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    (lines ~77–107) lists Web Development with its subsections nested one level under it (`**`), ASP.NET
    Reference last (line ~105).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used in this
  repo), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute is set; existing pages
  use `[source,html]` / `[source,css]` / `[source,javascript]` and render fine. `modules/ROOT/images/` holds
  the existing hand-authored `*.svg` figures (`aspnet-*.svg`, `angular-*.svg`, `react-*.svg`, `box-model.svg`,
  …); `modules/ROOT/attachments/` holds the cheat-sheet PDFs.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` / `_25.md` / `_27.md` / `_29.md` / `_31.md`):
  inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference and emits a
  "skipping reference to missing attribute" build **warning**. This is acute for Tailwind prose, which is full
  of `@theme \{ … }`, `content-['*']`, safelist patterns like `\{hover:,focus:,}underline` and
  `bg-red-\{50,\{100..900..100},950}`, arbitrary variants `[&_p]:mt-4` / `[&.is-open]:block`, and
  `@custom-variant dark (&:where(.dark, .dark *))`. **Escape any literal braces in prose as `\{ … }`**. Inside
  `[source,…]` blocks **no escaping is needed**. Square brackets in prose (`min-[720px]:`, `bg-[#bada55]`) are
  fine unescaped. The final build (Task 25) must come back with **zero** such warnings.
- **`[source]` language tokens**: `[source,html]` for markup with utility classes, `[source,css]` for
  `@import` / `@theme` / `@utility` / `@custom-variant` / `@apply` / `@layer` / plain CSS, `[source,javascript]`
  for the dark-mode toggle and any legacy `tailwind.config.js`, `[source,bash]` for install/build/CLI commands,
  `[source,json]` for `package.json` fragments. If a token ever produces a build issue, fall back progressively
  (`css` → `scss` → `text`; `javascript` → `js` → `text`) — verified by the Task 25 build.
- **New file map** this plan creates under `modules/ROOT/pages/web/tailwind/` (all `.adoc`, 21 files):
  `getting-started.adoc`, `utility-first-fundamentals.adoc`, `states-and-variants.adoc`,
  `responsive-design.adoc`, `dark-mode.adoc`, `theme-and-colors.adoc`, `preflight-and-base-styles.adoc`,
  `layout.adoc`, `flexbox-and-grid.adoc`, `spacing-and-sizing.adoc`, `typography.adoc`,
  `backgrounds-borders-effects.adoc`, `filters-transitions-transforms.adoc`,
  `interactivity-svg-accessibility.adoc`, `customization-and-configuration.adoc`,
  `custom-styles-and-arbitrary-values.adoc`, `build-and-production.adoc`, `upgrading-v3-to-v4.adoc`,
  `worked-example.adoc`, `cheat-sheet.adoc`, `index.adoc`. Plus
  `modules/ROOT/partials/tailwind-disclaimer.adoc`, `modules/ROOT/images/tailwind-class-anatomy.svg`,
  `modules/ROOT/images/tailwind-group-peer.svg`, `modules/ROOT/images/tailwind-breakpoints.svg`,
  `modules/ROOT/images/tailwind-cascade-layers.svg`,
  `modules/ROOT/attachments/tailwind-cheat-sheet.pdf`, and edits to
  [modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc),
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), and
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc).

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then a
  blank line, then `include::partial$tailwind-disclaimer.adoc[]`, then a one/two-sentence lead paragraph.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** — `[source,html]` /
  `[source,css]` / `[source,javascript]` / `[source,bash]` / `[source,json]` as appropriate.
- **Every concept links to the specific https://tailwindcss.com/docs/ page** for it (inline
  `https://tailwindcss.com/docs/…[link text]`), not just a generic "see the Tailwind docs".
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Prefer **modern, CSS-first Tailwind v4** everywhere: `@import "tailwindcss";`, `@theme`, `@utility`,
  `@custom-variant`, the Vite plugin, container queries, the `/` opacity modifier, `bg-(--var)`. Where a book
  uses a v3 pattern, document the current one and note the change.
- Diagrams via `[mermaid]` blocks; figures via `image::tailwind-*.svg[alt,width=…,role=text-center]` with the
  SVG hand-authored under `modules/ROOT/images/`.
- The full per-page concept checklist and official-link list is in issue #33's "Pages to create" section — each
  task below references its issue page number; implement every bullet the issue lists for that page.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Tailwind disclaimer partial — `modules/ROOT/partials/tailwind-disclaimer.adoc` — created the `[IMPORTANT]`/`====` partial modelled on `aspnet-disclaimer.adoc`; `npx antora antora-playbook.yml` builds clean with zero warnings/errors. No tests/coverage/quality tooling in this repo (docs only).
  - [x] Task 1.1. Create `modules/ROOT/partials/tailwind-disclaimer.adoc` as an `[IMPORTANT]` admonition
    (`[IMPORTANT]` then `====` … `====`) following the shape of
    `modules/ROOT/partials/aspnet-disclaimer.adoc`. It must state:
    - this section documents **Tailwind CSS v4.x** (the CSS-first configuration line; v4.0 shipped January
      2025) as published at https://tailwindcss.com/docs/[the official Tailwind CSS documentation], **which is
      the reference these pages are written and verified against**; no specific patch version is pinned;
    - the content was generated with the assistance of AI and should be verified against
      https://tailwindcss.com/docs/[the official documentation] before being relied on in production, since
      Tailwind iterates quickly;
    - *Modern CSS with Tailwind*, 2nd ed. (Noel Rappin, The Pragmatic Bookshelf, 2022) and *Ultimate Tailwind
      CSS Handbook* (Kartik Bhat, Orange Education / AVA, 2023) are **listed in this section's bibliography**
      and were consulted while preparing these pages — worded so it does **not** state or imply either book is
      the primary or main reference — and **both predate Tailwind v4** (they target v3.x), so on any
      discrepancy the official documentation wins and the difference is noted.
  - [x] Task 1.2. Confirm it is included via `include::partial$tailwind-disclaimer.adoc[]` on every page
    created in Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` /
    `:keywords:` block — identical syntax/placement to `include::partial$aspnet-disclaimer.adoc[]` in
    `modules/ROOT/pages/web/aspnet/index.adoc`.
    - Convention recorded for Groups 2–4 (nothing to retrofit — Groups 2–4 not yet implemented). Every new
      page must open exactly like `modules/ROOT/pages/web/aspnet/index.adoc`:
      1. `= <Page Title>`
      2. `:description: <one-line description>`
      3. `:keywords: <comma-separated keywords>`
      4. one blank line
      5. `include::partial$tailwind-disclaimer.adoc[]` (verbatim, its own line, no attributes)
      6. one blank line
      7. page body begins
      i.e. the include is the first non-blank line after the doc header, flush left, separated from the
      `:keywords:` line and from the body by a single blank line each.

### Group 2 — Content pages

**Parallelizable: yes** — 19 independent pages (Tasks 2–20). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` pages and the other new pages in this plan (cross-links between the new
pages are fine to write now — every target is listed in this plan and validated together in Task 25), but
**none depends on another new page's content**. Each page follows the "Conventions" section above and implements
every bullet the referenced issue #33 page lists. Four tasks also create a hand-authored SVG as a sub-task.

- [x] Task 2. Create `modules/ROOT/pages/web/tailwind/getting-started.adoc` (issue #33 page 1; book 1 ch. 1–2;
  book 2 ch. 1; docs "Installation", "Editor setup", "Compatibility")
  - [x] Task 2.1. Utility-first vs. component frameworks in one paragraph — the same button as a semantic class
    vs. as composed utilities; what "rapidly build modern websites without ever leaving your HTML" means.
    Cross-link `xref:web/bootstrap/index.adoc[]`. `[source,html]`.
  - [x] Task 2.2. Install paths and when to use each: **Vite plugin** (`@tailwindcss/vite`, the recommended
    default), **PostCSS** (`@tailwindcss/postcss`), **Tailwind CLI**
    (`npx @tailwindcss/cli -i input.css -o output.css --watch`, plus the standalone no-Node binary),
    **framework guides**, and **Play CDN** (`<script src="https://cdn.tailwindcss.com">`, prototyping only).
    `[source,bash]` + `[source,javascript]` (the `vite.config` plugin) + `[source,html]`. Links:
    https://tailwindcss.com/docs/installation/using-vite,
    https://tailwindcss.com/docs/installation/tailwind-cli, https://tailwindcss.com/docs/installation/play-cdn.
  - [x] Task 2.3. The one-line stylesheet `@import "tailwindcss";` (replaces v3's `@tailwind base;
    @tailwind components; @tailwind utilities;`) and the minimal HTML starter. `[source,css]` + `[source,html]`.
  - [x] Task 2.4. Editor setup: the Tailwind CSS IntelliSense VS Code extension,
    `prettier-plugin-tailwindcss` (class sorting), the Language Server. Link
    https://tailwindcss.com/docs/editor-setup.
  - [x] Task 2.5. Browser-support baseline (Safari 16.4+, Chrome 111+, Firefox 128+; relies on `@property` and
    `color-mix()`) and the compatibility notes. Cross-link `xref:web/html-css/index.adoc[]`. Link
    https://tailwindcss.com/docs/compatibility.

- [x] Task 3. Create `modules/ROOT/pages/web/tailwind/utility-first-fundamentals.adoc` (issue #33 page 2; book 1
  Introduction + ch. 2; book 2 ch. 2; docs "Styling with utility classes")
  - [x] Task 3.1. What a utility class is: a thin wrapper around one declaration (`m-4` → `margin: 1rem`,
    `text-lg` → `font-size` + `line-height`); the `--spacing` scale (`4` = `1rem`). `[source,html]`.
  - [x] Task 3.2. Why not inline styles: design constraints from the theme, variants (`hover:` / `md:` /
    `dark:`) inline `style` can't express, shorter consistent values. `[source,html]`. Link
    https://tailwindcss.com/docs/styling-with-utility-classes#why-not-just-use-inline-styles.
  - [x] Task 3.3. Managing duplication — the recommended order: **loops** in templates, **framework
    components**, **multi-cursor** edits, and **only as a last resort** custom CSS; an explicit "prefer
    components over `@apply`" note. `[source,html]` (a template loop) + a short component sketch. Cross-link
    `xref:web/sass/index.adoc[]` for the preprocessor contrast.
  - [x] Task 3.4. Hover/focus/responsive/dark at a glance (each detailed on its own page); the "state → variant
    prefix" mental model; how to read a utility page's Quick reference table. Links:
    https://tailwindcss.com/docs/styling-with-utility-classes,
    https://tailwindcss.com/docs/hover-focus-and-other-states#quick-reference.
  - [x] Task 3.5. Embed `image::tailwind-class-anatomy.svg[…]` (created in Task 3.6) showing
    `dark:md:hover:bg-sky-500/75` split into its parts.
  - [x] Task 3.6. Create `modules/ROOT/images/tailwind-class-anatomy.svg` — a hand-authored figure following
    the existing SVG convention (`box-model.svg`, `aspnet-di-lifetimes.svg`): the class string with labelled
    brackets under each segment (variant · variant · variant · property · colour · shade · opacity).

- [x] Task 4. Create `modules/ROOT/pages/web/tailwind/states-and-variants.adoc` (issue #33 page 3; book 1 ch. 2
  "Modifiers"; book 2 ch. 2 "Events and states"; docs "Hover, Focus, and Other States")
  - [x] Task 4.1. Pseudo-class variants: `hover`, `focus`, `focus-visible`, `focus-within`, `active`,
    `visited`, `target`, `disabled` / `enabled`, `checked`, `indeterminate`, `required`, `valid` / `invalid`,
    `in-range`, `placeholder-shown`, `autofill`, `read-only`, `first` / `last` / `only`, `odd` / `even`,
    `first-of-type` / `last-of-type`, `empty`, `nth-*`. `[source,html]`.
  - [x] Task 4.2. Pseudo-element variants: `before` / `after` (with `content-['…']` / `content-*`),
    `placeholder`, `file`, `marker`, `selection`, `first-line`, `first-letter`, `backdrop`,
    `details-content`. `[source,html]`.
  - [x] Task 4.3. `group-*` / `peer-*` (named `group/label`, `peer/label`; `group-has-*` / `peer-has-*`); the
    `*` (direct children) and `**` (all descendants) variants. `[source,html]`.
  - [x] Task 4.4. `has-*`, `not-*`, `in-*`, and arbitrary variants `[&.is-active]:…` / `[&_p]:…`. `[source,html]`.
  - [x] Task 4.5. Attribute-driven variants: `aria-*` (`aria-checked:…`, `aria-[sort=ascending]:…`), `data-*`
    (`data-active:…`, `data-[size=large]:…`), `rtl` / `ltr`, `open`, `inert`. `[source,html]`.
  - [x] Task 4.6. Media / feature variants: responsive (`sm:` …), `dark:`, `motion-safe` / `motion-reduce`,
    `contrast-more` / `contrast-less`, `forced-colors`, `print`, `supports-[…]`,
    `pointer-fine` / `pointer-coarse`, `portrait` / `landscape`. `[source,html]`.
  - [x] Task 4.7. **Stacking order** — v4 reads **left-to-right** (`*:first:pt-0`), unlike v3's right-to-left —
    and `@custom-variant` for reusable custom variants. `[source,html]` + `[source,css]`. Links:
    https://tailwindcss.com/docs/hover-focus-and-other-states,
    https://tailwindcss.com/docs/hover-focus-and-other-states#using-arbitrary-variants.
  - [x] Task 4.8. Embed `image::tailwind-group-peer.svg[…]` (created in Task 4.9).
  - [x] Task 4.9. Create `modules/ROOT/images/tailwind-group-peer.svg` — a hand-authored figure: a parent box
    marked `.group` with a hover state and an arrow down to a child that restyles (`group-hover:`), and a
    sibling box marked `.peer` with an arrow to a *later* sibling that restyles (`peer-checked:`).

- [x] Task 5. Create `modules/ROOT/pages/web/tailwind/responsive-design.adoc` (issue #33 page 4; book 1 ch. 7;
  book 2 ch. 2; docs "Responsive design")
  - [x] Task 5.1. Mobile-first: unprefixed = all sizes; `sm` / `md` / `lg` / `xl` / `2xl` = "at this width
    **and up**"; the "don't use `sm:` to target mobile" gotcha. `[source,html]`.
  - [x] Task 5.2. Default breakpoint values (`40` / `48` / `64` / `80` / `96rem`) and how they map to
    `@media (width >= …)`; a small table.
  - [x] Task 5.3. Targeting a single range with `max-*` (`md:max-lg:…`); arbitrary breakpoints `min-[720px]:` /
    `max-[600px]:`. `[source,html]`.
  - [x] Task 5.4. Customizing via `--breakpoint-*` theme variables (add `xs`, `3xl`; remove one with
    `--breakpoint-2xl: initial`). `[source,css]`.
  - [x] Task 5.5. **Container queries** (built in, no plugin in v4): `@container`, `@sm` / `@md` / `@lg`,
    `@max-md`, ranges `@sm:@max-md:`, named containers `@container/main` + `@lg/main:`, arbitrary
    `@min-[475px]:`, and `cqw` / `cqh` units. `[source,html]`. A `[mermaid]` (or short prose) contrast of
    reacting to the container box vs. the viewport. Links: https://tailwindcss.com/docs/responsive-design,
    https://tailwindcss.com/docs/responsive-design#container-queries.
  - [x] Task 5.6. Embed `image::tailwind-breakpoints.svg[…]` (created in Task 5.7).
  - [x] Task 5.7. Create `modules/ROOT/images/tailwind-breakpoints.svg` — a hand-authored horizontal number
    line: `base` at 0 then labelled ticks at `sm` 40rem / 640px, `md` 48rem / 768px, `lg` 64rem / 1024px,
    `xl` 80rem / 1280px, `2xl` 96rem / 1536px, with a "utilities apply from here rightward" band.

- [x] Task 6. Create `modules/ROOT/pages/web/tailwind/dark-mode.adoc` (issue #33 page 5; book 2 ch. 2; docs
  "Dark mode")
  - [x] Task 6.1. The `dark:` variant; default behaviour follows `prefers-color-scheme`. `[source,html]`.
  - [x] Task 6.2. Switching to a **manual/class** strategy: `@custom-variant dark (&:where(.dark, .dark *));`
    and toggling `document.documentElement.classList`. `[source,css]` + `[source,javascript]`.
  - [x] Task 6.3. The **data-attribute** strategy:
    `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`. `[source,css]`.
  - [x] Task 6.4. A three-state (light / dark / system) toggle in JS with `localStorage` + `matchMedia`, plus
    the inline `<head>` snippet that avoids the flash of wrong theme. `[source,javascript]` + `[source,html]`.
  - [x] Task 6.5. Cross-link `xref:web/html-css/theming.adoc[Light & Dark Theming]` for the underlying CSS
    mechanism. A `[mermaid]` flowchart of the strategy decision (media query vs. `.dark` class vs. `data-theme`).
    Link https://tailwindcss.com/docs/dark-mode.

- [x] Task 7. Create `modules/ROOT/pages/web/tailwind/theme-and-colors.adoc` (issue #33 page 6; book 1 ch. 8;
  book 2 ch. 3; docs "Theme variables", "Colors")
  - [x] Task 7.1. `@theme { … }` vs. `:root` — theme variables are **design tokens** that also *generate
    utilities*. `[source,css]` + `[source,html]`.
  - [x] Task 7.2. Namespaces and what each generates: `--color-*`, `--font-*`, `--text-*`, `--font-weight-*`,
    the single `--spacing` multiplier, `--radius-*`, `--shadow-*`, `--blur-*`, `--breakpoint-*` (responsive
    variants), `--container-*` (`@` container variants + `max-w-*`), `--animate-*`, `--ease-*` — a table.
  - [x] Task 7.3. Extending vs. overriding a single value vs. clearing a namespace (`--color-*: initial`) vs. a
    full custom theme (`--*: initial`); `@theme inline` and `@theme static`. `[source,css]`.
  - [x] Task 7.4. The default **palette**: 22 families × shades `50…950` in **OKLCH**; the `/` **opacity
    modifier** (`bg-sky-500/75`, `text-black/50`, arbitrary `/[71.37%]`) — replacing v3's `bg-opacity-*`.
    `[source,html]`.
  - [x] Task 7.5. Using tokens outside utilities: `var(--color-blue-500)` / `var(--text-2xl)` in custom CSS;
    in arbitrary values `rounded-[calc(var(--radius-xl)-1px)]`; from JS via `getComputedStyle`. `[source,css]`
    + `[source,html]` + `[source,javascript]`. Cross-link `xref:web/html-css/variables-media-queries.adoc[]`.
  - [x] Task 7.6. Defining `@keyframes` inside `@theme` for `--animate-*`. `[source,css]`. A `[mermaid]`
    showing one `@theme` variable → a utility class **and** a CSS custom property. Links:
    https://tailwindcss.com/docs/theme, https://tailwindcss.com/docs/colors,
    https://tailwindcss.com/docs/theme#theme-variable-namespaces.

- [x] Task 8. Create `modules/ROOT/pages/web/tailwind/preflight-and-base-styles.adoc` (issue #33 page 7; book 1
  ch. 2 "Preflight"; book 2 ch. 3; docs "Preflight")
  - [x] Task 8.1. What Preflight resets (modern-normalize + Tailwind opinions): margins zeroed,
    headings/lists unstyled, images/`svg`/`video` `display:block` + `max-width:100%`, borders `0 solid`,
    `button` cursor, placeholder colour, `hidden` attribute wins, dialog margins. `[source,css]` (illustrative).
  - [x] Task 8.2. It ships automatically with `@import "tailwindcss";`.
  - [x] Task 8.3. Adding your own element defaults with `@layer base { h1 { … } a { … } }` (theme vars for
    values). `[source,css]`. Link https://tailwindcss.com/docs/adding-custom-styles#adding-base-styles.
  - [x] Task 8.4. Disabling / partially adopting Preflight by importing the layers individually
    (`@import "tailwindcss/theme.css" layer(theme);` + `@import "tailwindcss/utilities.css" layer(utilities);`,
    omitting `preflight.css`). `[source,css]`. Link https://tailwindcss.com/docs/preflight.

- [x] Task 9. Create `modules/ROOT/pages/web/tailwind/layout.adoc` (issue #33 page 8; book 1 ch. 5; book 2
  ch. 3; docs "Layout", "Tables")
  - [x] Task 9.1. `display` (`block` / `inline-block` / `flex` / `grid` / `contents` / `hidden`), `box-sizing`,
    `isolation`, `float` / `clear`, `object-fit` / `object-position`, `overflow` / `overscroll-behavior`,
    `position` + `top/right/bottom/left` + `inset-*` (incl. negative), `visibility`, `z-index`. `[source,html]`.
  - [x] Task 9.2. `aspect-ratio` (`aspect-video` / `aspect-square` / `aspect-[4/3]`), `columns-*` +
    `break-before/after/inside`, `box-decoration-break`. `[source,html]`.
  - [x] Task 9.3. `container` — in v4 it is just `max-width` per breakpoint; centering/padding is done by
    redefining it with `@utility container { … }` (no more `center` / `padding` config keys). `[source,css]`.
  - [x] Task 9.4. Tables: `border-collapse` / `border-separate`, `border-spacing-*`, `table-auto` /
    `table-fixed`, `caption-side`. `[source,html]`. Cross-link `xref:web/html-css/layout.adoc[]`. Links:
    https://tailwindcss.com/docs/display, https://tailwindcss.com/docs/position,
    https://tailwindcss.com/docs/aspect-ratio, https://tailwindcss.com/docs/container,
    https://tailwindcss.com/docs/table-layout.

- [x] Task 10. Create `modules/ROOT/pages/web/tailwind/flexbox-and-grid.adoc` (issue #33 page 9; book 1 ch. 5;
  book 2 ch. 3; docs "Flexbox & Grid")
  - [x] Task 10.1. Flex container: `flex`, `flex-row` / `flex-col` (+ `-reverse`), `flex-wrap` / `flex-nowrap`;
    items: `flex-1` / `flex-auto` / `flex-initial` / `flex-none`, `basis-*`, `grow` / `grow-0`, `shrink` /
    `shrink-0` (note v4 renamed `flex-grow-*` / `flex-shrink-*`), `order-*`. `[source,html]`.
  - [x] Task 10.2. Grid: `grid`, `grid-cols-*` / `grid-rows-*` (+ arbitrary `grid-cols-[24rem_2fr]`),
    `col-span-*` / `col-start/end-*`, `row-span-*`, `grid-flow-*`, `auto-cols-*` / `auto-rows-*`, `gap-*` /
    `gap-x-*` / `gap-y-*`. `[source,html]`.
  - [x] Task 10.3. Box alignment (both layouts): `justify-*`, `justify-items-*`, `justify-self-*`, `content-*`,
    `items-*`, `self-*`, `place-content/items/self-*`. `[source,html]`.
  - [x] Task 10.4. Prefer linking Tailwind's interactive flex/grid diagrams; add an SVG only for a specific
    worked layout (not planned here). Cross-link `xref:web/html-css/layout.adoc[]`. Links:
    https://tailwindcss.com/docs/flex-basis, https://tailwindcss.com/docs/grid-template-columns,
    https://tailwindcss.com/docs/gap, https://tailwindcss.com/docs/justify-content.

- [x] Task 11. Create `modules/ROOT/pages/web/tailwind/spacing-and-sizing.adoc` (issue #33 page 10; book 1
  ch. 4 "The Box"; book 2 ch. 3; docs "Spacing", "Sizing")
  - [x] Task 11.1. Padding `p-*` / `px-*` / `py-*` / `ps-*` / `pe-*` / `pt-*…`; margin `m-*` (+ negative
    `-mt-4`, `mx-auto`); `space-x-*` / `space-y-*` (note the v4 selector change to `:not(:last-child)`).
    `[source,html]`.
  - [x] Task 11.2. The single `--spacing` multiplier and the numeric scale; arbitrary `p-[5px]`, fraction
    `w-1/2`, and the `--spacing()` function in custom CSS. `[source,html]` + `[source,css]`. Cross-link
    `xref:web/html-css/box-model.adoc[]`.
  - [x] Task 11.3. Sizing: `w-*` / `h-*` / `size-*`, `min-w-*` / `max-w-*` / `min-h-*` / `max-h-*`, `w-full` /
    `w-screen` / `w-dvw` / `w-fit` / `w-min` / `w-max`, `max-w-prose`, and the `--container-*` scale for
    `max-w-md` etc. `[source,html]`. Links: https://tailwindcss.com/docs/padding,
    https://tailwindcss.com/docs/margin, https://tailwindcss.com/docs/width,
    https://tailwindcss.com/docs/max-width.

- [x] Task 12. Create `modules/ROOT/pages/web/tailwind/typography.adoc` (issue #33 page 11; book 1 ch. 3;
  book 2 ch. 4; docs "Typography")
  - [x] Task 12.1. Font: `font-sans` / `serif` / `mono` (+ custom `--font-*`), `text-xs…text-9xl` (size +
    paired line-height, or `text-lg/7`), `font-thin…font-black`, `italic` / `not-italic`, `antialiased`,
    `font-stretch-*`, `tabular-nums` & the `font-variant-numeric` set. `[source,html]`.
  - [x] Task 12.2. Spacing & flow: `tracking-*`, `leading-*`, `line-clamp-*`, `text-left/center/right/justify/
    start/end`, `indent-*`, `align-*`, `whitespace-*`, `break-normal/words/all` + `text-wrap` / `text-nowrap` /
    `text-balance` / `text-pretty`, `hyphens-*`. `[source,html]`.
  - [x] Task 12.3. Colour & decoration: `text-*` colour + `/` opacity, `underline` / `overline` /
    `line-through` / `no-underline`, `decoration-*` (colour / style / thickness), `underline-offset-*`,
    `uppercase` / `lowercase` / `capitalize` / `normal-case`, `truncate` / `text-ellipsis` / `text-clip`.
    `[source,html]`.
  - [x] Task 12.4. Lists: `list-disc` / `list-decimal` / `list-none`, `list-inside` / `list-outside`,
    `list-image-*`, the `marker:` variant. `[source,html]`.
  - [x] Task 12.5. The official plugins: **`@tailwindcss/typography`** (`prose`, `prose-lg`, `prose-invert`,
    `prose-headings:…`) and **`@tailwindcss/forms`**; how to add a plugin in v4
    (`@plugin "@tailwindcss/typography";`). `[source,css]` + `[source,html]`. Links:
    https://tailwindcss.com/docs/font-size, https://tailwindcss.com/docs/text-color,
    https://github.com/tailwindlabs/tailwindcss-typography,
    https://github.com/tailwindlabs/tailwindcss-forms.

- [x] Task 13. Create `modules/ROOT/pages/web/tailwind/backgrounds-borders-effects.adoc` (issue #33 page 12;
  book 1 ch. 4; book 2 ch. 4; docs "Backgrounds", "Borders", "Effects")
  - [x] Task 13.1. Backgrounds: `bg-*` colour (+ `/` opacity), `bg-[url(…)]`, `bg-cover` / `bg-contain`,
    `bg-center` / `bg-top` …, `bg-no-repeat` / `bg-repeat-x`, `bg-fixed` / `bg-local`, `bg-clip-text` /
    `bg-clip-border`, `bg-origin-*`. `[source,html]`.
  - [x] Task 13.2. Gradients: `bg-linear-to-r` / `bg-linear-<angle>` / `bg-radial` / `bg-conic`, `from-*` /
    `via-*` / `to-*` (+ `from-30%`), and how gradient stops survive variant overrides (`dark:from-…`).
    `[source,html]`.
  - [x] Task 13.3. Borders: `border` / `border-2` / `border-x` / `border-t-*`, `border-*` colour (**default is
    now `currentColor`, not `gray-200` — always set a colour**), `border-solid` / `dashed` / `dotted`,
    `rounded-*` / `rounded-t-*` / `rounded-[…]` (note `rounded` → `rounded-sm`, old `rounded-sm` →
    `rounded-xs`), `divide-x` / `divide-y` + `divide-*` colour / style. `[source,html]`.
  - [x] Task 13.4. Outline & ring: `outline` / `outline-2` / `outline-offset-*` (colour default
    `currentColor`), `outline-hidden` (was `outline-none`), `ring` / `ring-2` (**`ring` is now 1px, colour
    `currentColor`; v3's `ring` = 3px `blue-500`**), `ring-offset-*`, `inset-ring-*`. `[source,html]`.
  - [x] Task 13.5. Effects: `shadow-2xs…shadow-2xl` (+ `shadow-*` colour, `inset-shadow-*`), `text-shadow-*`
    (new in v4), `opacity-*`, `mix-blend-*` / `bg-blend-*`, `mask-*` utilities (new in v4). `[source,html]`.
    Links: https://tailwindcss.com/docs/background-image, https://tailwindcss.com/docs/border-color,
    https://tailwindcss.com/docs/box-shadow, https://tailwindcss.com/docs/mask-image.

- [x] Task 14. Create `modules/ROOT/pages/web/tailwind/filters-transitions-transforms.adoc` (issue #33
  page 13; book 1 ch. 6; book 2 ch. 4; docs "Filters", "Transitions & Animation", "Transforms")
  - [x] Task 14.1. Filters: `blur-*` (note `blur-sm` → `blur-xs`), `brightness-*`, `contrast-*`, `grayscale`,
    `hue-rotate-*`, `invert`, `saturate-*`, `sepia`, `drop-shadow-*`; the `backdrop-*` equivalents.
    `[source,html]`.
  - [x] Task 14.2. Transitions: `transition` / `transition-colors` / `transition-transform` /
    `transition-none`, `duration-*`, `ease-in` / `ease-out` / `ease-[…]` (+ `--ease-*`), `delay-*`,
    `transition-discrete` + `starting:` for `@starting-style`; note `transition` now also animates
    `outline-color`. `[source,html]`. Cross-link `xref:web/html-css/transitions.adoc[]`.
  - [x] Task 14.3. Animation: `animate-spin` / `animate-ping` / `animate-pulse` / `animate-bounce` /
    `animate-none`, and a custom animation via `--animate-*` + `@keyframes` in `@theme`. `[source,html]` +
    `[source,css]`. Cross-link `xref:web/html-css/animations.adoc[]`.
  - [x] Task 14.4. Transforms: `scale-*` / `scale-x-*`, `rotate-*` / `-rotate-*`, `translate-*` /
    `translate-x-*`, `skew-*`, `transform-gpu`, `origin-*`, plus v4's 3D transforms — `rotate-x-*` /
    `rotate-y-*` / `rotate-z-*`, `perspective-*`, `perspective-origin-*`, `transform-3d`, `backface-visible` /
    `backface-hidden`; reset with `scale-none` (not `transform-none`). `[source,html]`. Links:
    https://tailwindcss.com/docs/filter, https://tailwindcss.com/docs/transition-property,
    https://tailwindcss.com/docs/animation, https://tailwindcss.com/docs/scale.

- [x] Task 15. Create `modules/ROOT/pages/web/tailwind/interactivity-svg-accessibility.adoc` (issue #33
  page 14; book 2 ch. 4; docs "Interactivity", "SVG", "Accessibility")
  - [x] Task 15.1. Interactivity: `accent-*`, `appearance-none` / `appearance-auto`, `caret-*`,
    `color-scheme-*` (new), `cursor-*`, `field-sizing-content` / `field-sizing-fixed` (new),
    `pointer-events-none` / `-auto`, `resize` / `resize-none` / `resize-y`, `scroll-smooth`, `scroll-m-*` /
    `scroll-p-*`, scroll-snap (`snap-x` / `snap-mandatory` / `snap-center` / `snap-start` / `snap-align-none` /
    `snap-normal` / `snap-always`), `touch-*`, `select-none` / `select-text` / `select-all`, `will-change-*`.
    `[source,html]`.
  - [x] Task 15.2. SVG: `fill-*`, `stroke-*`, `stroke-<width>` — styling inline icons with `currentColor`.
    `[source,html]`. Cross-link `xref:web/html-css/svg-styling-animation.adoc[]`.
  - [x] Task 15.3. Accessibility: `sr-only` / `not-sr-only`, `forced-color-adjust-auto` / `-none`, and a recap
    of the `motion-reduce` / `contrast-more` / `forced-colors` variants. `[source,html]`. Cross-link
    `xref:web/accessibility.adoc[]`. Links: https://tailwindcss.com/docs/cursor,
    https://tailwindcss.com/docs/scroll-snap-type, https://tailwindcss.com/docs/fill,
    https://tailwindcss.com/docs/forced-color-adjust, https://tailwindcss.com/docs/screen-readers.

- [x] Task 16. Create `modules/ROOT/pages/web/tailwind/customization-and-configuration.adoc` (issue #33
  page 15; book 1 ch. 8; book 2 ch. 2–3; docs "Theme", "Functions and directives", "Detecting classes in
  source files")
  - [x] Task 16.1. The v4 model: **everything is CSS** — `@import "tailwindcss";` then `@theme`, `@utility`,
    `@custom-variant`, `@plugin`, `@source`; no `tailwind.config.js` required. `[source,css]`.
  - [x] Task 16.2. Content detection: automatic, `.gitignore`-aware, skips `node_modules` / binaries / CSS /
    lock files; the **"classes must be complete unbroken strings"** rule (no `text-${color}-500`);
    `@source "…"` to add paths, `@source not "…"` to exclude, `@source inline("…")` to safelist (with
    `\{hover:,focus:,}` and `\{100..900..100}` expansion), and `@import "tailwindcss" source(none);` to opt
    out. `[source,css]` + `[source,html]`. Link
    https://tailwindcss.com/docs/detecting-classes-in-source-files.
  - [x] Task 16.3. `@plugin "@tailwindcss/typography";` / `@plugin "./my-plugin.js";`; community plugins.
    `[source,css]`.
  - [x] Task 16.4. Using a **legacy JS config**: `@config "../tailwind.config.js";` — and what v4 drops
    (`corePlugins`, `safelist`, `separator`, `content` in favour of `@source`). `[source,css]` +
    `[source,javascript]`. Link
    https://tailwindcss.com/docs/upgrade-guide#using-a-javascript-config-file.
  - [x] Task 16.5. `prefix(tw)` and how prefixes now look (`tw:flex`, `tw:hover:bg-black`). `[source,css]` +
    `[source,html]`.
  - [x] Task 16.6. Functions in custom CSS: `--spacing(4)`, `--alpha(var(--color-lime-300)/50%)`, and why
    `theme(…)` dot-notation is deprecated in favour of `var(--…)` / `theme(--breakpoint-xl)`. `[source,css]`.
    Link https://tailwindcss.com/docs/functions-and-directives.
  - [x] Task 16.7. A `[mermaid]` of the build/scan pipeline (source files → class-token scan → matched
    utilities → generated CSS → minified stylesheet). Cross-link
    `xref:web/html-css/variables-media-queries.adoc[]`. Link https://tailwindcss.com/docs/theme.
  - [x] Task 16.8. Embed `image::tailwind-cascade-layers.svg[…]` (created in Task 16.9) and explain why a bare
    utility overrides a `@layer components` rule.
  - [x] Task 16.9. Create `modules/ROOT/images/tailwind-cascade-layers.svg` — a hand-authored stacked-bands
    figure: `@layer theme` → `base` → `components` → `utilities` bottom-to-top, with a note that later layers
    win regardless of selector specificity.

- [x] Task 17. Create `modules/ROOT/pages/web/tailwind/custom-styles-and-arbitrary-values.adoc` (issue #33
  page 16; book 1 ch. 8; book 2 ch. 2; docs "Adding custom styles")
  - [x] Task 17.1. Arbitrary **values**: `top-[117px]`, `bg-[#bada55]`, `grid-cols-[1fr_500px_2fr]`,
    `max-h-[calc(100dvh-...)]`; underscores → spaces (and `\_` / `url()` caveats). `[source,html]`.
  - [x] Task 17.2. Arbitrary **properties**: `[mask-type:luminance]`, `[--gutter:1rem] lg:[--gutter:2rem]`.
    `[source,html]`.
  - [x] Task 17.3. Arbitrary **variants**: `[&.is-open]:block`, `[&_p]:mt-4`,
    `[@supports(display:grid)]:grid`. `[source,html]`.
  - [x] Task 17.4. The **CSS-variable shorthand** `bg-(--brand)` / `fill-(--icon)` and setting the var via
    inline `style` for truly dynamic values; data-type hints for ambiguity `text-(length:--x)` vs.
    `text-(color:--x)`. `[source,html]`.
  - [x] Task 17.5. `@utility` for your own utilities — simple
    (`@utility content-auto { content-visibility: auto }`), nested selectors, and **functional** utilities with
    `--value(integer)` / `--value(--tab-size-*)` / `--modifier(…)` / `--value(…, --default(…))`. `[source,css]`.
  - [x] Task 17.6. `@custom-variant` (`@custom-variant pointer-coarse (@media (pointer: coarse));`) and
    `@variant` inside a rule. `[source,css]`.
  - [x] Task 17.7. `@apply` — the "use sparingly, prefer components" note — and `@reference "../app.css";` so
    `@apply` / `@variant` work inside Vue/Svelte `<style>` blocks without duplicating CSS; "when to just write
    plain CSS in `@layer components` / `base`". `[source,css]`. Links:
    https://tailwindcss.com/docs/adding-custom-styles,
    https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values,
    https://tailwindcss.com/docs/adding-custom-styles#functional-utilities.

- [x] Task 18. Create `modules/ROOT/pages/web/tailwind/build-and-production.adoc` (issue #33 page 17; book 1
  ch. 1; book 2 ch. 1 "Tailwind CSS in production"; docs "Installation", "Optimizing for production")
  - [x] Task 18.1. How the build works end to end: scan sources → generate only used utilities → one small
    stylesheet; why there is **no `purge` / `content` array and no separate PurgeCSS step** in v4.
  - [x] Task 18.2. Minification: `--minify` with the CLI, or the framework's own build (Vite); typical
    production size. `[source,bash]`.
  - [x] Task 18.3. The three integration shapes: bundler plugin (`@tailwindcss/vite`),
    `@tailwindcss/postcss`, standalone CLI (incl. the no-Node binary for Rails / Laravel / Go / Phoenix);
    pointer to the framework guides. `[source,bash]` + `[source,javascript]`.
  - [x] Task 18.4. Play CDN is **prototyping only**; a CI note (run the same build; the stylesheet is a
    deterministic artifact). Cross-link `xref:web/html-css/performance-build-optimization.adoc[]`. Links:
    https://tailwindcss.com/docs/installation/using-postcss,
    https://tailwindcss.com/docs/installation/framework-guides,
    https://tailwindcss.com/blog/tailwindcss-v4.

- [x] Task 19. Create `modules/ROOT/pages/web/tailwind/upgrading-v3-to-v4.adoc` (issue #33 page 18; docs
  "Upgrade guide"; bridges both books, which are v3)
  - [x] Task 19.1. The automated tool `npx @tailwindcss/upgrade` (Node 20+); review the diff. `[source,bash]`.
  - [x] Task 19.2. Config: `tailwind.config.js` → `@theme` in CSS (or keep it via `@config`);
    `@tailwind base/components/utilities` → `@import "tailwindcss"`; PostCSS plugin → `@tailwindcss/postcss`;
    Vite plugin `@tailwindcss/vite`. `[source,css]` + `[source,javascript]`.
  - [x] Task 19.3. Renamed: `shadow-sm` → `shadow-xs` & `shadow` → `shadow-sm` (same for `drop-shadow`,
    `blur`, `rounded`, `backdrop-blur`); `outline-none` → `outline-hidden`; `bg-gradient-to-*` →
    `bg-linear-to-*`. A table.
  - [x] Task 19.4. Removed: `flex-shrink-*` / `flex-grow-*` → `shrink-*` / `grow-*`; `overflow-ellipsis` →
    `text-ellipsis`; `bg-opacity-*` / `text-opacity-*` / … → the `/` opacity modifier; `corePlugins`,
    `safelist`, `separator` config keys.
  - [x] Task 19.5. Behaviour: default `border` / `divide` colour → `currentColor`; `ring` → 1px +
    `currentColor` (was 3px + `blue-500`); `space-*` / `divide-*` selector change; important marker `!flex` →
    `flex!`; arbitrary variable `bg-[--x]` → `bg-(--x)`; variant stacking now left-to-right; hover only on
    devices that support it; Preflight tweaks (placeholder colour, button cursor, dialog margins). `[source,html]`.
  - [x] Task 19.6. Browser baseline raised (Safari 16.4+, Chrome 111+, Firefox 128+); if you must support
    older browsers, stay on v3.4. A short "reading the v3-era books" note: which concepts still apply verbatim
    (utility-first, variants, responsive, most utility names) vs. which to mentally translate. Link
    https://tailwindcss.com/docs/upgrade-guide.

- [x] Task 20. Create `modules/ROOT/pages/web/tailwind/worked-example.adoc` (issue #33 page 19; book 2 ch. 5–6;
  book 1 ch. 5; docs examples)
  - [x] Task 20.1. Build one realistic responsive block end to end with utilities only — a site header with a
    `md:`-collapsing nav, a hero, and a responsive card grid
    (`grid gap-6 sm:grid-cols-2 lg:grid-cols-3`). `[source,html]`.
  - [x] Task 20.2. Show the progression: layout utilities → responsive variants → states (`hover:` /
    `focus-visible:`) → `dark:` → extract the repeated card into a framework component. `[source,html]` + a
    short component sketch.
  - [x] Task 20.3. One `@theme` customization (a brand colour + font) feeding the example; keep the whole page
    to about one screen of code; link Tailwind's own examples and https://play.tailwindcss.com/. `[source,css]`.
    Links: https://tailwindcss.com/docs/styling-with-utility-classes#why-not-just-use-inline-styles,
    https://play.tailwindcss.com/.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 21), but it must run **after** Group 2 so its `xref:` back-links
point at pages that exist and its content reflects every page's final scope.

- [x] Task 21. Create the Tailwind cheat sheet — `modules/ROOT/pages/web/tailwind/cheat-sheet.adoc` +
  `modules/ROOT/attachments/tailwind-cheat-sheet.pdf`
  - [x] Task 21.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising **every concept explained in this reference**, per issue #33's cheat-sheet
    content list: the install one-liner + `@import "tailwindcss"`; the class-name anatomy
    (`variant:variant:utility-color-shade/opacity`); the breakpoint table (`sm` / `md` / `lg` / `xl` / `2xl` +
    rem); the most-used variants (`hover focus focus-visible active disabled first last odd even group-*
    peer-* has-* not-* dark sm: md: @container @md`); the spacing-scale reminder (`4 = 1rem`); the top utility
    families with 4–6 examples each (layout / flex / grid, spacing / sizing, typography, colour / bg / border,
    effects, transitions / transforms); `@theme` / `@utility` / `@custom-variant` / `@apply` / `@source`
    one-liners; the `/` opacity modifier and `bg-(--var)`; and a short "v3→v4" rename strip
    (`shadow` → `shadow-sm`, `rounded` → `rounded-sm`, `outline-none` → `outline-hidden`, `!flex` → `flex!`,
    `bg-[--x]` → `bg-(--x)`). Match the visual style of the existing cheat sheets (see
    `modules/ROOT/pages/web/bootstrap/cheat-sheet.adoc` + its PDF, and the Angular / ASP.NET ones).
  - [x] Task 21.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=tailwind-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/tailwind-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count
    check + a rendered PNG preview with no clipping).
  - [x] Task 21.3. Create `modules/ROOT/pages/web/tailwind/cheat-sheet.adoc`:
    `include::partial$tailwind-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every
    Group 2 page, and `xref:attachment$tailwind-cheat-sheet.pdf[Download the Tailwind Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 22 (section index) must link every page from Groups 2–3; Tasks 23 and 24 depend
on Task 22 existing and on the final page/file names; Task 25 (build) depends on every prior task having landed.

- [x] Task 22. Create `modules/ROOT/pages/web/tailwind/index.adoc` — Tailwind Reference landing page
  - [x] Task 22.1. `= Tailwind Reference`, `:description:` / `:keywords:`,
    `include::partial$tailwind-disclaimer.adoc[]`, a short intro (https://tailwindcss.com/[Tailwind CSS] is a
    utility-first framework …; this section documents the current v4.x release verified against
    tailwindcss.com/docs; where to start — `getting-started.adoc` → `utility-first-fundamentals.adoc` →
    `states-and-variants.adoc` → `responsive-design.adoc`).
  - [x] Task 22.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat
    sheet, one-line blurb each, under readable sub-headings, e.g.: **Getting started** (getting-started);
    **Core concepts** (utility-first-fundamentals, states-and-variants, responsive-design, dark-mode,
    theme-and-colors); **Base styles** (preflight-and-base-styles); **Utility families** (layout,
    flexbox-and-grid, spacing-and-sizing, typography, backgrounds-borders-effects,
    filters-transitions-transforms, interactivity-svg-accessibility); **Customization**
    (customization-and-configuration, custom-styles-and-arbitrary-values); **Build & upgrade**
    (build-and-production, upgrading-v3-to-v4); **Putting it together** (worked-example); **Reference**
    (cheat-sheet). Mirror `web/aspnet/index.adoc` / `web/bootstrap/index.adoc`.
  - [x] Task 22.3. `== Bibliography` citing, in this order (matching issue #33's Bibliography section):
    - **https://tailwindcss.com/docs/** — the official Tailwind CSS documentation, the source every page is
      written and verified against; call out
      https://tailwindcss.com/docs/styling-with-utility-classes[Styling with utility classes],
      https://tailwindcss.com/docs/hover-focus-and-other-states[Hover, Focus & Other States],
      https://tailwindcss.com/docs/responsive-design[Responsive Design],
      https://tailwindcss.com/docs/dark-mode[Dark Mode], https://tailwindcss.com/docs/theme[Theme Variables],
      https://tailwindcss.com/docs/colors[Colors],
      https://tailwindcss.com/docs/functions-and-directives[Functions & Directives],
      https://tailwindcss.com/docs/detecting-classes-in-source-files[Detecting classes in source files], and
      https://tailwindcss.com/docs/upgrade-guide[the v3 → v4 Upgrade Guide].
    - https://tailwindcss.com/blog/tailwindcss-v4["Tailwind CSS v4.0"] and
      https://tailwindcss.com/blog[the Tailwind blog].
    - https://github.com/tailwindlabs/tailwindcss[tailwindlabs/tailwindcss] — source and issue tracker;
      https://github.com/tailwindlabs/tailwindcss-typography[`@tailwindcss/typography`] and
      https://github.com/tailwindlabs/tailwindcss-forms[`@tailwindcss/forms`];
      https://play.tailwindcss.com/[Tailwind Play].
    - Rappin, Noel. _Modern CSS with Tailwind — Flexible Styling Without the Fuss_, 2nd ed. The Pragmatic
      Bookshelf, 2022. ISBN 978-1-68050-940-3. Consulted as part of the bibliography for this section (targets
      Tailwind 3.0) — see
      https://pragprog.com/titles/tailwind2/modern-css-with-tailwind-second-edition/[the publisher's book
      page] and https://pragprog.com/[pragprog.com].
    - Bhat, Kartik. _Ultimate Tailwind CSS Handbook — Build sleek and modern websites with immersive UIs using
      Tailwind CSS_. Orange Education Pvt Ltd (AVA™), 2023. ISBN 978-93-88590-76-1. Consulted as part of the
      bibliography for this section (targets Tailwind v3.x) — see
      https://orangeava.com/products/ultimate-tailwind-css-handbook[the publisher's book page],
      https://orangeava.com/[orangeava.com], and the code bundle at
      https://github.com/OrangeAVA/Ultimate-Tailwind-CSS-Handbook[OrangeAVA/Ultimate-Tailwind-CSS-Handbook].
    - https://developer.mozilla.org/[MDN Web Docs] — the underlying CSS properties every utility wraps
      (flexbox, grid, custom properties, `color-mix()`, `@property`, container queries), cross-linked where
      used; and the existing xref:web/html-css/index.adoc[HTML & CSS Reference] and
      xref:web/sass/index.adoc[Sass Reference] on this site.

- [x] Task 23. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 23.1. Add a ninth bullet to the `== Sections` list, after the ASP.NET Reference entry:
    `xref:web/tailwind/index.adoc[Tailwind Reference]` with a one-line blurb (the utility-first CSS framework:
    the utility-first workflow, states and variants, responsive design and container queries, dark mode, theme
    variables and the OKLCH palette, Preflight, the utility families, CSS-first customization with `@theme` /
    `@utility` / `@custom-variant`, arbitrary values, build and production, and a v3→v4 upgrade guide with
    Tailwind CSS v4, plus a downloadable cheat sheet).
  - [x] Task 23.2. Update the page's own `:description:` and `:keywords:` attributes to mention Tailwind CSS /
    Tailwind v4 / utility-first CSS.

- [x] Task 24. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 24.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/tailwind/index.adoc[Tailwind Reference]`
    block under `** xref:web/index.adoc[Web Development]`, **after** the ASP.NET Reference block (which ends
    line 209 `**** xref:web/aspnet/cheat-sheet.adoc[Cheat Sheet (PDF)]`), with a `****` line per page in this
    reading order: getting-started, utility-first-fundamentals, states-and-variants, responsive-design,
    dark-mode, theme-and-colors, preflight-and-base-styles, layout, flexbox-and-grid, spacing-and-sizing,
    typography, backgrounds-borders-effects, filters-transitions-transforms, interactivity-svg-accessibility,
    customization-and-configuration, custom-styles-and-arbitrary-values, build-and-production,
    upgrading-v3-to-v4, worked-example, cheat-sheet. Use the same `xref:web/tailwind/<page>.adoc[Label]` link
    text style as the ASP.NET block (e.g. `[Getting Started with Tailwind]`, `[Utility-First Fundamentals]`,
    `[States & Variants]`, …, `[Cheat Sheet (PDF)]`).
  - [x] Task 24.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/tailwind/index.adoc[Tailwind Reference] -- …` after the ASP.NET Reference bullet (line ~105)
    under the Web Development entry, matching the existing one-line-blurb format, and update that page's
    `:keywords:` to include Tailwind CSS.

- [x] Task 25. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for Tailwind Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/tailwind/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/tailwind/*.html (all 21 pages), the PDF attachment
      build/site/_attachments/tailwind-cheat-sheet.pdf, the images build/site/_images/tailwind-class-anatomy.svg,
      tailwind-group-peer.svg, tailwind-breakpoints.svg and tailwind-cascade-layers.svg, every new nav entry,
      and all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 25.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute"
    warnings (most likely an unescaped `\{ … }` in prose — `@theme \{ … }`, a safelist pattern, an arbitrary
    variant `[&_p]` — a typo'd `xref:` target, a bad `[source,css]` token, or a missing nav entry), then
    re-run the agent until the build is clean, before checking this task off.
  - [x] Task 25.2. After the build is clean, per the repo convention (`update-docs`), confirm no other Antora
    page needs a cross-reference update for the new section (spot-check `web/aspnet/index.adoc`,
    `web/bootstrap/index.adoc`, and `web/html-css/index.adoc` — none is expected to need changes, but note the
    check).

## Completion

All 25 tasks completed on branch `feature/33`.

- **Group 1:** `modules/ROOT/partials/tailwind-disclaimer.adoc` (Angular/ASP.NET "third variant" wording; both books bibliography-only, noted to predate v4).
- **Group 2:** 19 content pages under `modules/ROOT/pages/web/tailwind/` + 4 hand-authored SVGs
  (`tailwind-class-anatomy.svg`, `tailwind-group-peer.svg`, `tailwind-breakpoints.svg`,
  `tailwind-cascade-layers.svg`). Every page carries the disclaimer include, `[source,...]` examples, and
  inline `https://tailwindcss.com/docs/` links. Mermaid used for the build/scan pipeline, the `@theme` token
  flow, the container-vs-media contrast, and the dark-mode strategy decision.
- **Group 3:** `cheat-sheet.adoc` + `modules/ROOT/attachments/tailwind-cheat-sheet.pdf` — rendered from an
  HTML source via headless Chrome, verified **exactly one A4 page** (595x842, no clipping).
- **Group 4:** `index.adoc` (grouped `== What's covered` + `== Bibliography`), plus wiring into
  `modules/ROOT/pages/web/index.adoc`, `modules/ROOT/nav.adoc` (21 `****` entries after the ASP.NET block),
  and `modules/ROOT/pages/index.adoc`.
- **Build:** `npx antora antora-playbook.yml` exits 0 with **zero WARN/ERROR lines** (no "skipping reference
  to missing attribute", no broken xref). `build/site/web/tailwind/` has all 21 HTML pages;
  `build/site/_attachments/tailwind-cheat-sheet.pdf` and all four `build/site/_images/tailwind-*.svg` present;
  mermaid blocks render. Spot-checked `web/aspnet/index.adoc`, `web/bootstrap/index.adoc`,
  `web/html-css/index.adoc` -- no cross-reference updates needed elsewhere.
- **Security gate:** not run in this recovery pass (the delegated `iru-code` run was interrupted by a
  rate-limit before its Step 7). This change adds only AsciiDoc/HTML/SVG documentation and a binary PDF -- no
  code, credentials, or config secrets. A `/iru-check-security` pass is advisable before merge.
