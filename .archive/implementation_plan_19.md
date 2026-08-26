# Implementation Plan: Web Development / Bootstrap Reference

## Task summary

Source: GitHub issue #19

Issue [#19](https://github.com/albertoirurueta/docs/issues/19) ("Bootstrap Reference") asks to add a new
**"Bootstrap Reference"** section under the existing **"Web Development"** section of this repo's own `ROOT`
Antora component, at `modules/ROOT/pages/web/bootstrap/`, covering the Bootstrap CSS/JS framework
(https://getbootstrap.com/): getting started, the grid system, content basics (typography, reboot, images,
tables, colors), forms, components, utilities (including the Utility API), layout helpers, customization
(Sass-based theming), JavaScript behavior, and accessibility — with links to the official documentation, code
examples, images/SVG figures (especially of rendered components), mermaid diagrams where they clarify a
concept, a bibliography, and a one-page downloadable PDF cheat sheet. This is the same pattern already used for
the existing SQL Reference, HTML & CSS Reference, Sass Reference, and JavaScript Development sections
([.archive/implementation_plan_3.md](.archive/implementation_plan_3.md),
[.archive/implementation_plan_7.md](.archive/implementation_plan_7.md),
[.archive/implementation_plan_15.md](.archive/implementation_plan_15.md),
[.archive/implementation_plan_17.md](.archive/implementation_plan_17.md) — the last of these, adding Sass
Reference as a third sibling subsection of Web Development, is the closest and most direct precedent, since
this plan adds Bootstrap Reference as a **fourth** sibling subsection the same way).

**Choices made on the user's behalf** (best-practice defaults, consistent with this repo's established pattern
for the SQL, HTML & CSS, Sass, and JavaScript reference sections — stated here so they can be challenged during
review):

- **Documenting Bootstrap 5.x** (the current major version) — the issue itself notes "Bootstrap 5 dropped
  jQuery, uses vanilla JS + Popper.js", which only applies from v5 onward, and vanilla-JS behavior is what
  `javascript-behavior.adoc` (Task 21) documents. No specific patch version is pinned; the disclaimer (Task 1)
  points readers at the live official docs to check current specifics.
- **"Content Basics" and "Components" are split into multiple pages, one per distinct sub-concept**, rather than
  one page per issue bullet — unlike Sass's flat 1-page-per-bullet mapping, these two issue bullets each bundle
  several materially distinct topics (typography vs. Reboot vs. images vs. tables vs. colors; six distinct
  component families). This mirrors this repo's own precedent for large bundled bullets: the JavaScript section
  split its single "Standard Library"/"browser APIs" bullets into 6 and 12 separate pages respectively
  ([.archive/implementation_plan_15.md](.archive/implementation_plan_15.md),
  [.archive/implementation_plan_20260823190147.md](.archive/implementation_plan_20260823190147.md)). Concretely:
  - Issue bullet 3 ("Content Basics") → `typography.adoc`, `reboot.adoc`, `images.adoc`, `tables.adoc`,
    `colors.adoc` (5 pages).
  - Issue bullet 4 ("Forms") → `forms.adoc` (controls, layout options, input groups/floating labels) and
    `forms-validation.adoc` (validation states and feedback) — matching the existing HTML & CSS section's own
    `forms.adoc`/`forms-accessibility-validation.adoc` split.
  - Issue bullet 5 ("Components") → `navigation-components.adoc` (navbars, breadcrumbs, pagination),
    `content-components.adoc` (cards, list groups, badges), `feedback-components.adoc` (alerts, modals, toasts),
    `interactive-components.adoc` (dropdowns, accordions, carousels), `buttons.adoc` (buttons and button
    groups), `tooltips-popovers.adoc` (6 pages).
  - Issue bullet 6 ("Utilities (Utility API)") → `utilities.adoc` (the utility classes themselves: spacing,
    colors/backgrounds/borders, flexbox/display, position/sizing/shadows) and `utility-api.adoc` (the
    customizable Sass-based Utility API for generating new utility classes) — 2 pages, since the issue itself
    frames the Utility API as a distinct capability from the utility classes it ships by default.
  - All other issue bullets (1, 2, 7, 8, 9, 10) map to exactly one page each, since each is a single coherent
    concept, same as most of Sass's bullets.
  - Total: 21 content pages (vs. Sass's 12), proportionate to Bootstrap's broader surface area and comparable in
    scale to the HTML & CSS section's 19.
- **"Bootstrap Reference" is placed last**, as a fourth subsection of "Web Development", after HTML & CSS
  Reference, Sass Reference, and JavaScript Development — unlike Sass (placed next to the CSS reference it
  directly extends), Bootstrap has no single nearest neighbor: it's a framework built on top of all three
  preceding subsections (HTML markup, CSS/Sass theming, vanilla JS component behavior), so appending it after
  all three, in the order they were added, is the simplest defensible ordering.
- **Cross-reference existing sections instead of duplicating them**: `customization.adoc` (Task 20) should link
  to `web/sass/variables.adoc` and `web/sass/compilation.adoc` for the underlying Sass mechanics Bootstrap's
  theming builds on, rather than re-explaining Sass variables/maps from scratch; `accessibility.adoc` (Task 22)
  should link to `web/html-css/forms-accessibility-validation.adoc` for general form-accessibility guidance
  rather than repeating it.
- **Mermaid is the default; SVG is the fallback for concept diagrams; real SVG figures for rendered components**
  — same convention as every existing section, plus the issue's own explicit ask for images of rendered
  components:
  - Mermaid: a 12-column grid/breakpoint diagram (`grid-system.adoc`), a data-attribute → JS API → component
    event flow diagram (`javascript-behavior.adoc`), and a Sass variable override → compile → CSS output
    diagram (`customization.adoc`, mirroring `web/sass/compilation.adoc`'s own pipeline diagram).
  - SVG figures: one or two small illustrative SVGs per component page in the Components group (Tasks 11-16) —
    e.g. a rendered navbar layout, a card anatomy diagram, an alert/modal/toast visual — depicting structure and
    styling, not attempting to be pixel-perfect Bootstrap renders.
  - The remaining pages are primarily syntax/class/code-example driven and don't need a diagram forced in.
- **`:description:`/`:keywords:` on every new page**, per the SEO-metadata convention already rolled out
  repo-wide in [.archive/implementation_plan_20260823190147.md](.archive/implementation_plan_20260823190147.md).
- **PDF cheat sheet generation approach**: same as every prior section — a hand-built, print-ready single-page
  HTML/CSS layout rendered to PDF via headless Chrome (`--headless --print-to-pdf`), saved as a static checked-in
  asset at `modules/ROOT/attachments/bootstrap-cheat-sheet.pdf`, and linked from `cheat-sheet.adoc` via
  `xref:attachment$bootstrap-cheat-sheet.pdf[Download the Bootstrap Cheat Sheet (PDF)]` (the correct Antora
  attachment family/macro, per the already-corrected convention noted in
  `.archive/implementation_plan_3.md`).
- **No project-picker icon/xref** for "Bootstrap Reference" — like HTML & CSS, Sass, and JavaScript, it lives
  under the root `index.adoc`'s `== Guides & References` section, not as one of the remote-component picker
  tiles.

## Current code state

- This repo's Antora component is `ROOT` ([antora.yml](antora.yml)), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under `modules/ROOT/pages/`.
- **Web Development** (`modules/ROOT/pages/web/index.adoc`) currently lists three subsections: **HTML & CSS
  Reference** (`modules/ROOT/pages/web/html-css/*.adoc`, 19 pages), **Sass Reference**
  (`modules/ROOT/pages/web/sass/*.adoc`, 12 pages), and **JavaScript Development**
  (`modules/ROOT/pages/web/javascript/*.adoc`, 35 pages). All three follow the identical structural pattern this
  plan reuses:
  - A `partial$<name>-disclaimer.adoc` (an `[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` at the top of every page in the section.
  - One `.adoc` page per topic, each with `:description:`/`:keywords:` attributes.
  - A section `index.adoc` linking every page with a one-line blurb, ending in a `== Bibliography` section.
  - A `cheat-sheet.adoc` linking back to every detail page and to a downloadable PDF via
    `xref:attachment$<name>-cheat-sheet.pdf[Download the ... Cheat Sheet (PDF)]`, with the actual file under
    `modules/ROOT/attachments/`.
  - `nav.adoc` lists `Web Development` (`*`) with each subsection (`**`) and its own detail pages (`***`).
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    (around line 77) lists Web Development, with its subsections nested one level under it.
  - No Bootstrap content exists anywhere in the repo today.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks) — the only diagram mechanism used anywhere in
  this repo's docs so far — and `@djencks/asciidoctor-mathjax` (unused by this ticket).
- **New page map** this plan creates under `modules/ROOT/pages/web/bootstrap/` (all `.adoc` unless noted):
  - `getting-started.adoc`, `grid-system.adoc`, `typography.adoc`, `reboot.adoc`, `images.adoc`, `tables.adoc`,
    `colors.adoc`, `forms.adoc`, `forms-validation.adoc`, `navigation-components.adoc`,
    `content-components.adoc`, `feedback-components.adoc`, `interactive-components.adoc`, `buttons.adoc`,
    `tooltips-popovers.adoc`, `utilities.adoc`, `utility-api.adoc`, `layout-helpers.adoc`, `customization.adoc`,
    `javascript-behavior.adoc`, `accessibility.adoc` (21 content pages).
  - `cheat-sheet.adoc` + `modules/ROOT/attachments/bootstrap-cheat-sheet.pdf`.
  - `index.adoc` (section index, same role as `sql/index.adoc` / `web/html-css/index.adoc` /
    `web/sass/index.adoc` / `web/javascript/index.adoc`).
  - Plus `modules/ROOT/partials/bootstrap-disclaimer.adoc`, and updates to `modules/ROOT/pages/web/index.adoc`,
    `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task, nothing else in this plan can safely include it before it exists)

- [x] Task 1. Create the Bootstrap disclaimer partial — `modules/ROOT/partials/bootstrap-disclaimer.adoc` created,
  mirroring `sass-disclaimer.adoc`'s shape. No tests/coverage apply (AsciiDoc content).
  - [x] Task 1.1. Create `modules/ROOT/partials/bootstrap-disclaimer.adoc`, an `[IMPORTANT]` admonition following
    the same shape as `modules/ROOT/partials/sass-disclaimer.adoc`: states this section documents
    **Bootstrap 5.x as implemented by https://getbootstrap.com/[the official Bootstrap project]**, that content
    was generated with AI assistance from general knowledge of Bootstrap and should be verified against the
    current official docs at https://getbootstrap.com/docs/[getbootstrap.com/docs] before relying on it in
    production, and notes Bootstrap 5 dropped jQuery in favor of vanilla JS + Popper.js for component
    positioning.
  - No tests/coverage apply (AsciiDoc content; verified by the Task 27 Antora build gate).

### Group 2 — Content pages (all issue topics 1-10)

**Parallelizable: yes** (21 independent pages; each includes the Group 1 disclaimer partial and may
cross-reference existing Sass/HTML-CSS pages, but none depends on another new page in this plan)

- [x] Task 2. Create `modules/ROOT/pages/web/bootstrap/getting-started.adoc` — Getting Started: installation
  methods (CDN links, npm/yarn package, downloading source files), basic template structure (required `<meta>`
  tags, viewport settings, file structure), browser/OS support and accessibility basics. Include the CDN
  `<link>`/`<script>` snippet and the minimal HTML5 starter template as code examples, with a link to
  https://getbootstrap.com/docs/[the official "Introduction"/"Download" pages].
  - getting-started.adoc created (CDN/npm install methods, starter template). No tests/coverage apply (AsciiDoc content).
- [x] Task 3. Create `modules/ROOT/pages/web/bootstrap/grid-system.adoc` — The Grid System: containers
  (`.container`, `.container-fluid`, `.container-{breakpoint}`), rows/columns and the 12-column layout logic,
  breakpoints (`sm`/`md`/`lg`/`xl`/`xxl`), column sizing/offsetting/ordering/nesting, how it relates to
  responsive design (classes don't conflict because each breakpoint uses a separate media query), and the
  nesting-containers antipattern plus fluid-container exceptions. Include a mermaid diagram of the 12-column
  grid across breakpoints and a breakpoint reference table. Link to
  https://getbootstrap.com/docs/[the official "Layout" docs].
  - grid-system.adoc created with mermaid 12-column/breakpoint diagram and breakpoint table. No tests/coverage apply.
- [x] Task 4. Create `modules/ROOT/pages/web/bootstrap/typography.adoc` — Typography: headings, display
  headings, text utilities, lead paragraphs, with rendered-heading code examples.
  - typography.adoc created. No tests/coverage apply.
- [x] Task 5. Create `modules/ROOT/pages/web/bootstrap/reboot.adoc` — Reboot: Bootstrap's CSS reset/
  normalization layer, what it changes relative to raw browser defaults, and how it relates to (and differs
  from) the plain `normalize.css`/reset approaches already covered generally in
  `web/html-css/box-model.adoc`.
  - reboot.adoc created, cross-referencing web/html-css/box-model.adoc. No tests/coverage apply.
- [x] Task 6. Create `modules/ROOT/pages/web/bootstrap/images.adoc` — Images: responsive images (`.img-fluid`),
  thumbnails, figures (`.figure`, `.figure-img`, `.figure-caption`).
  - images.adoc created. No tests/coverage apply.
- [x] Task 7. Create `modules/ROOT/pages/web/bootstrap/tables.adoc` — Tables: styling variants (striped,
  bordered, hover, responsive), with an SVG or code-rendered example of a styled table.
  - tables.adoc created. No tests/coverage apply.
- [x] Task 8. Create `modules/ROOT/pages/web/bootstrap/colors.adoc` — Colors: the theme color system
  (`primary`/`secondary`/`success`/`danger`/`warning`/`info`/`light`/`dark`), text/background/border color
  utility classes, and how these tie into `customization.adoc`'s Sass color variables.
  - colors.adoc created, cross-referencing customization.adoc. No tests/coverage apply.
- [x] Task 9. Create `modules/ROOT/pages/web/bootstrap/forms.adoc` — Forms: form controls (inputs, selects,
  textareas, checkboxes, radios), layout options (inline, horizontal, grid-based), input groups, and floating
  labels.
  - forms.adoc created. No tests/coverage apply.
- [x] Task 10. Create `modules/ROOT/pages/web/bootstrap/forms-validation.adoc` — Forms: validation states and
  feedback (`.is-valid`/`.is-invalid`, `.valid-feedback`/`.invalid-feedback`, browser vs. custom validation),
  cross-referencing `web/html-css/forms-accessibility-validation.adoc` for the underlying accessibility
  concerns.
  - forms-validation.adoc created, cross-referencing web/html-css/forms-accessibility-validation.adoc. No tests/coverage apply.
- [x] Task 11. Create `modules/ROOT/pages/web/bootstrap/navigation-components.adoc` — Navbars, breadcrumbs,
  pagination, with a simple SVG figure of a rendered navbar layout.
  - navigation-components.adoc created with new modules/ROOT/images/bootstrap-navbar.svg figure. No tests/coverage apply.
- [x] Task 12. Create `modules/ROOT/pages/web/bootstrap/content-components.adoc` — Cards, list groups, badges,
  with a simple SVG figure of a rendered card's anatomy (header/body/footer).
  - content-components.adoc created with new modules/ROOT/images/bootstrap-card-anatomy.svg figure. No tests/coverage apply.
- [x] Task 13. Create `modules/ROOT/pages/web/bootstrap/feedback-components.adoc` — Alerts, modals, toasts, with
  a simple SVG figure contrasting the three (inline alert vs. overlay modal vs. corner toast).
  - feedback-components.adoc created with new modules/ROOT/images/bootstrap-feedback-components.svg figure. No tests/coverage apply.
- [x] Task 14. Create `modules/ROOT/pages/web/bootstrap/interactive-components.adoc` — Dropdowns, accordions,
  carousels, noting each relies on Popper.js (dropdowns) and the vanilla-JS component API described in
  `javascript-behavior.adoc`.
  - interactive-components.adoc created, linking javascript-behavior.adoc and tooltips-popovers.adoc. No tests/coverage apply.
- [x] Task 15. Create `modules/ROOT/pages/web/bootstrap/buttons.adoc` — Buttons and button groups (variants,
  sizes, states, `.btn-group`/`.btn-toolbar`).
  - buttons.adoc created. No tests/coverage apply.
- [x] Task 16. Create `modules/ROOT/pages/web/bootstrap/tooltips-popovers.adoc` — Tooltips and popovers,
  including their Popper.js-based positioning and required JS initialization.
  - tooltips-popovers.adoc created. No tests/coverage apply.
- [x] Task 17. Create `modules/ROOT/pages/web/bootstrap/utilities.adoc` — Utilities: spacing (margin/padding
  helper classes), colors/backgrounds/borders, flexbox and display utilities, position/sizing/shadows.
  - utilities.adoc created, linking utility-api.adoc. No tests/coverage apply.
- [x] Task 18. Create `modules/ROOT/pages/web/bootstrap/utility-api.adoc` — The customizable Utility API: how to
  add/modify/remove utility classes via Sass maps, with a mermaid diagram of Utility API config → generated
  utility classes.
  - utility-api.adoc created with mermaid Utility API config to generated-classes diagram. No tests/coverage apply.
- [x] Task 19. Create `modules/ROOT/pages/web/bootstrap/layout-helpers.adoc` — Layout Helpers: Flexbox/Grid CSS
  integration, responsive visibility/display classes, z-index and positioning helpers — cross-referencing
  `grid-system.adoc` and `utilities.adoc` rather than duplicating their content.
  - layout-helpers.adoc created, cross-referencing grid-system.adoc and utilities.adoc. No tests/coverage apply.
- [x] Task 20. Create `modules/ROOT/pages/web/bootstrap/customization.adoc` — Customization: Sass variables and
  maps for theming colors/spacing/fonts, compiling custom builds to reduce file size, and Bootstrap 5's
  extensive use of CSS custom properties — cross-referencing `web/sass/variables.adoc` and
  `web/sass/compilation.adoc`, with a mermaid diagram of the Sass variable override → compile → CSS output
  pipeline (mirroring `web/sass/compilation.adoc`'s own diagram).
  - customization.adoc created, cross-referencing web/sass/variables.adoc and web/sass/compilation.adoc, with mermaid override to compile to CSS pipeline diagram. No tests/coverage apply.
- [x] Task 21. Create `modules/ROOT/pages/web/bootstrap/javascript-behavior.adoc` — JavaScript Behavior: data
  attributes vs. the JavaScript API for programmatic control, dependencies (no jQuery in Bootstrap 5, vanilla JS
  + Popper.js for positioning), and component events (e.g. `shown.bs.modal`) — with a mermaid diagram of the
  data-attribute-triggered event flow.
  - javascript-behavior.adoc created with mermaid data-attribute event-flow diagram. No tests/coverage apply.
- [x] Task 22. Create `modules/ROOT/pages/web/bootstrap/accessibility.adoc` — Accessibility: ARIA attributes
  built into components, keyboard navigation support, color contrast guidance — cross-referencing
  `web/html-css/forms-accessibility-validation.adoc`.
  - accessibility.adoc created, cross-referencing web/html-css/forms-accessibility-validation.adoc. No tests/coverage apply.

### Group 3 — Cheat sheet

**Parallelizable: yes** (single task, but depends on every page from Group 2 existing so it can link to and
summarize them)

- [x] Task 23. Add the one-page Bootstrap cheat sheet (PDF) and its documentation page — PDF confirmed 1 page via
  `file` command and a rendered screenshot preview; `cheat-sheet.adoc` created with grouped xrefs to all 21
  detail pages. No tests/coverage apply (AsciiDoc/PDF content).
  - [x] Task 23.1. Design a single-page, print-ready HTML/CSS layout (as a scratch file, e.g. under the session
    scratchpad) summarizing the Bootstrap essentials: grid classes, breakpoints, common component classes,
    key utility classes, and the Utility API basics — following the same visual style as
    `web/sass/cheat-sheet.adoc`'s underlying layout.
  - [x] Task 23.2. Render that HTML layout to a single-page PDF via headless Chrome
    (`--headless --print-to-pdf=bootstrap-cheat-sheet.pdf`), then move it to
    `modules/ROOT/attachments/bootstrap-cheat-sheet.pdf`.
  - [x] Task 23.3. Verify the rendered PDF is exactly one page and visually legible (check page count and render
    a preview).
  - [x] Task 23.4. Create `modules/ROOT/pages/web/bootstrap/cheat-sheet.adoc`: include the disclaimer partial,
    a short summary, grouped `xref:` links to every page from Group 2, and
    `xref:attachment$bootstrap-cheat-sheet.pdf[Download the Bootstrap Cheat Sheet (PDF)]` linking the asset from
    Task 23.2.

### Group 4 — Section index, nav wiring, and final verification

**Parallelizable: no** — Task 24 (section index) depends on every page from Groups 2-3 existing to link to;
Task 25 (`web/index.adoc` update) and Task 26 (nav/root-index wiring) both depend on Task 24 existing; Task 27
(build verification) depends on every prior task having landed.

- [x] Task 24. Create `modules/ROOT/pages/web/bootstrap/index.adoc` — Bootstrap Reference landing page: include
  the disclaimer partial, a short introduction, a `== What's covered` section linking every page from Group 2
  with a one-line blurb (grouped under Getting Started / Grid / Content / Forms / Components / Utilities /
  Layout Helpers / Customization / JavaScript Behavior / Accessibility headings, matching the issue's own
  topic groupings), a link to the cheat sheet, and a `== Bibliography` section citing
  https://getbootstrap.com/[the official Bootstrap site] and its docs.
  - `modules/ROOT/pages/web/bootstrap/index.adoc` created with all 21 pages + cheat sheet linked under the
    grouped headings, plus Bibliography. No tests/coverage apply.
- [x] Task 25. Update `modules/ROOT/pages/web/index.adoc` — add Bootstrap Reference as a fourth `== Sections`
  bullet, after JavaScript Development, following the exact same one-line-blurb format as the other three
  bullets; update the page's own `:description:`/`:keywords:` to mention Bootstrap.
  - `modules/ROOT/pages/web/index.adoc` updated: new bullet added, `:description:`/`:keywords:` updated. No
    tests/coverage apply.
- [x] Task 26. Wire the new section into navigation
  - [x] Task 26.1. Add a new nested entry to `modules/ROOT/nav.adoc`, positioned after the existing
    `xref:web/javascript/...` block and before the next top-level entry: a `**` line for
    `xref:web/bootstrap/index.adoc[Bootstrap Reference]` followed by `***` lines for each of the 21 content
    pages (Tasks 2-22) plus the cheat sheet (Task 23.4), in the same reading order as Task 24's `index.adoc`.
    - `modules/ROOT/nav.adoc` updated with the full Bootstrap Reference block. No tests/coverage apply.
  - [x] Task 26.2. Add a `**` bullet for `xref:web/bootstrap/index.adoc[Bootstrap Reference]` under the existing
    `* xref:web/index.adoc[Web Development]` entry in `modules/ROOT/pages/index.adoc`'s `== Guides & References`
    section, immediately after the existing JavaScript Development bullet, matching the one-line-blurb format
    already used there.
    - `modules/ROOT/pages/index.adoc` updated with the new bullet. No tests/coverage apply.
- [x] Task 27. Delegate the full-site build check to the `iru-gate-runner` agent rather than running it inline —
  first run surfaced 18 "skipping reference to missing attribute" AsciiDoc warnings (unescaped literal
  `{color}`/`{n}`/`{breakpoint}`/`{event}`/`{component}` placeholder text in colors.adoc, grid-system.adoc,
  javascript-behavior.adoc, tables.adoc, interpreted as undefined Antora attributes); fixed by escaping each
  with a backslash (`\{color}`, etc.). Re-run confirmed a fully clean build: exit code 0, zero warnings/errors
  anywhere, including modules/ROOT/nav.adoc and modules/ROOT/pages/index.adoc.
  ```
  Agent({
    description: "Verify Antora site build",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root and report whether the build completed
      without xref/AsciiDoc errors, calling out any warnings specifically about the new
      modules/ROOT/pages/web/bootstrap/** pages, modules/ROOT/nav.adoc, or modules/ROOT/pages/index.adoc."
  })
  ```
  Fix any reported `xref`/AsciiDoc errors (most likely a typo'd `xref:` target or a missing nav entry) before
  checking this task off.
