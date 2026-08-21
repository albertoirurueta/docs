# Implementation Plan: Web Development / HTML & CSS Reference

## Task summary

Source: GitHub issue #7

Issue [#7](https://github.com/albertoirurueta/docs/issues/7) ("Web Development / HTML & CSS Reference") asks to add a
new **"Web Development"** section to this repo's own `ROOT` Antora component (this repo has no application source
code — it *is* the playbook + root component for the aggregated "Irurueta Docs" site), with a first subsection
**"HTML & CSS Reference"** under it, at `modules/ROOT/pages/web/html-css/`. The content must be grounded in the book
*"Practical HTML and CSS"* (492-page PDF at `~/Desktop/practical-html.pdf`), supplemented with general HTML/CSS
knowledge where the book doesn't cover something the issue asks for, and end with a single-page downloadable PDF
cheat sheet — the same pattern as the existing SQL Reference section
([.archive/implementation_plan_3.md](.archive/implementation_plan_3.md),
[.archive/implementation_plan_5.md](.archive/implementation_plan_5.md)).

**The book was read during planning** (via a dedicated research pass over all 492 pages) specifically to ground this
plan's page breakdown and to identify, per topic, what the book actually covers vs. what must come from general
knowledge. Key findings that shape task scoping below:

- The book has **no dedicated HTML-element or CSS-property reference appendix** — the two "full reference" pages
  (Tasks 17–18) must be built primarily from general/MDN-grounded knowledge, using only the book's element
  groupings (Ch.1) as a loose starting skeleton.
- The book has **zero coverage of inline SVG styling/animation** (Task 12), **zero coverage of `<input type="file">`
  or drag-and-drop file upload** (part of Task 13), and only light coverage of animation-performance techniques
  (part of Task 11, `will-change`/compositor/`requestAnimationFrame` concepts absent) — these must be written from
  general web-development knowledge, called out explicitly in each task below rather than silently invented.
- Everywhere else, concrete chapter/page ranges, terminology, and worked examples exist in the book and should be
  the starting point per-task (cited by chapter/page below); each task should still supplement with general
  knowledge for anything the issue asks for that the book only mentions in passing (e.g. `position: sticky`,
  `grid-template-areas`, CSS Constraint Validation API).

**Choices made on the user's behalf** (per the user's own follow-up clarifications, which supersede the issue text
where they differ):

- **One dedicated page per issue bullet, split into more than one page where a bullet's scope genuinely warrants
  it** (per the book's own natural chapter splits, noted per-task below) — see the page map in "Current code state"
  below for the full breakdown.
- **The "full reference" bullet is a separate appendix**, distinct from (and not duplicating) the per-topic deep-dive
  pages — it covers elements/properties *not* already covered in depth elsewhere, cross-referencing back to the
  relevant deep-dive page instead of repeating it.
- **Mermaid is the default; SVG is the fallback**, used only where mermaid genuinely cannot depict the concept (e.g.
  precise nested-box geometry, real proportional layout of flex/grid items) — this is called out per task where a
  figure is needed, leaving the final mermaid-vs-SVG call to the page's own author since it depends on how the
  concept renders once drafted.
- **File/directory naming**: flat `.adoc` files directly under `modules/ROOT/pages/web/html-css/`, mirroring the SQL
  Reference's flat layout under `modules/ROOT/pages/sql/` — the two-level "Web Development > HTML & CSS Reference"
  nesting the issue asks for is expressed via the *directory path* (`web/html-css/...`) and *nav nesting*, not by
  nesting files further.
- **No project-picker icon/xref** for "Web Development" — like SQL Reference, this is a standalone reference section
  under the root `index.adoc`'s "Other" list, not one of the remote-component picker tiles.
- **Disclaimer partial**: a new `modules/ROOT/partials/html-css-disclaimer.adoc`, following the exact `[IMPORTANT]`
  admonition pattern of [modules/ROOT/partials/sql-disclaimer.adoc](modules/ROOT/partials/sql-disclaimer.adoc), but
  naming *this* book as the source and noting supplementary general knowledge was used where the book was silent.

## Current code state

- This repo's Antora component is `ROOT` ([antora.yml](antora.yml)), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under `modules/ROOT/pages/`.
- The existing **SQL Reference** section (`modules/ROOT/pages/sql/*.adoc`) is the direct precedent for structure:
  - A `partial$sql-disclaimer.adoc` included via `include::partial$sql-disclaimer.adoc[]` at the top of every page.
  - One page per major topic, an `index.adoc` linking to each with a one-line blurb plus a closing bibliography,
    and a `cheat-sheet.adoc` that links back to every detail page and links the PDF via
    `xref:attachment$sql-cheat-sheet.pdf[Download ...]`, with the actual file under `modules/ROOT/attachments/`.
  - `nav.adoc` lists it flat: `* xref:sql/index.adoc[SQL Reference]` then `**` children for each topic page.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc) lists it under an `== Other` section as
    a plain bullet (not a picker tile, which is reserved for remote sibling components).
  - `[mermaid]` blocks are used sparingly (only in `sql/relations.adoc`, for ER diagrams) — no SVG figures exist
    anywhere in this repo's docs yet, so the SVG figures this ticket needs (box model, etc.) have no local
    structural precedent to copy, only the general Antora image-embedding convention (`image::foo.svg[]` under
    `modules/ROOT/images/`).
  - `.archive/implementation_plan_1.md` (Google Analytics) is unrelated to this ticket.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks), `@djencks/asciidoctor-mathjax` (unused by this
  ticket — no equations needed).
- **New page map** this plan creates under `modules/ROOT/pages/web/html-css/` (all `.adoc` unless noted):
  - `html-structure.adoc`, `seo.adoc` (issue bullet 1)
  - `layout.adoc`, `positioning.adoc` (issue bullet 2)
  - `box-model.adoc` (issue bullet 3)
  - `selectors-specificity.adoc`, `variables-media-queries.adoc`, `theming.adoc` (issue bullet 4)
  - `transitions.adoc`, `animations.adoc` (issue bullet 5)
  - `svg-styling-animation.adoc` (issue bullet 6)
  - `forms.adoc`, `forms-accessibility-validation.adoc` (issue bullet 7)
  - `performance-loading.adoc`, `performance-build-optimization.adoc` (new issue bullet, added after the user
    updated the issue with a page-performance requirement)
  - `appendix-html-elements.adoc`, `appendix-css-properties.adoc` (issue bullet 9 — full reference, kept as a
    separate appendix per the user's explicit instruction)
  - `cheat-sheet.adoc` + `modules/ROOT/attachments/html-css-cheat-sheet.pdf`
  - `index.adoc` (section index, same role as `sql/index.adoc`)
  - Plus `modules/ROOT/pages/web/index.adoc` (the "Web Development" section landing page, one level up, since
    HTML & CSS Reference is its first of potentially several future subsections) and
    `modules/ROOT/partials/html-css-disclaimer.adoc`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task, nothing else in this plan can safely include it before it exists)

- [x] Task 1. Create the HTML/CSS disclaimer partial — `modules/ROOT/partials/html-css-disclaimer.adoc` created,
  mirroring `sql-disclaimer.adoc`'s `[IMPORTANT]` structure.
  - [x] Task 1.1. Create `modules/ROOT/partials/html-css-disclaimer.adoc`, an `[IMPORTANT]` admonition following
    the structure of `modules/ROOT/partials/sql-disclaimer.adoc`: state that this section covers general HTML5 and
    CSS concepts (not any specific framework/library), that it was built from the book *"Practical HTML and CSS"*
    plus general web-development knowledge where the book didn't cover an asked-for topic, that it was generated
    with AI assistance, and that it should be verified against current MDN documentation / browser support tables
    (caniuse.com) before relying on it in production, since CSS/HTML features evolve and browser support varies.

### Group 2 — Content pages (all issue bullets 1–8)

**Parallelizable: yes** — every task below is an independent page (or pair of pages) with no dependency on any
other task in this group; each only depends on Group 1's disclaimer partial existing. All tasks share the
`include::partial$html-css-disclaimer.adoc[]` convention at the top of every page.

- [x] Task 2. Write the HTML5 structural & semantic elements page (issue bullet 1, part A)
  - [x] Task 2.1. Create `modules/ROOT/pages/web/html-css/html-structure.adoc`. Ground it in the book's Ch.1
    (pp.28–37) and Ch.2 (pp.64–72): the HTML5 content-type taxonomy (metadata, flow, sectioning, phrasing, heading,
    embedded, interactive content), `<!DOCTYPE html>`, `<html lang="">`, the `<head>`/`<body>` split, metadata
    elements (`base`, `link`, `meta`, `title`, including viewport/charset meta tags), and the semantic structural
    elements `header`/`footer`/`section`/`article`/`nav`/`aside`/`main`/`div` — contrast the "old div+class" way
    vs. the "new HTML5 way" as the book does.
  - [x] Task 2.2. Include a reference table of these specific structural/semantic tags with their typical
    attributes and a short example each (this is the "reference of tags and attributes... along with examples"
    the issue's bullet 1 asks for — scoped to *this page's* tags, not the full appendix in Task 17).
  - [x] Task 2.3. Add a diagram of how a semantic page skeleton nests (`html > head/body > header/main/footer`,
    with `main` containing `article`/`section`/`aside`) — default to a `[mermaid]` graph/flowchart; fall back to
    an SVG figure under `modules/ROOT/images/` only if mermaid can't clearly show the nesting.

- [x] Task 3. Write the SEO implications page (issue bullet 1, part B) — `modules/ROOT/pages/web/html-css/seo.adoc`
  created, grounded in book Ch.10 (pp.341-348), cross-references `html-structure.adoc`.
  - [x] Task 3.1. Create `modules/ROOT/pages/web/html-css/seo.adoc`, grounded in the book's Ch.10 (pp.341–348):
    how semantic markup helps crawlers understand page structure (with a worked before/after example rewriting a
    `div`-soup page into semantic elements), title tags, meta descriptions, heading-tag hierarchy (`h1`-`h6`),
    internal linking, canonical tags (`<link rel="canonical">`), and clean URL structure.
  - [x] Task 3.2. Cross-reference `html-structure.adoc` (Task 2) rather than repeating the tag list — this page's
    focus is *why*/*how* structure affects SEO, not re-documenting the tags themselves.

- [x] Task 4. Write the CSS layout page: float, flexbox, grid (issue bullet 2, part A)
  - [x] Task 4.1. Create `modules/ROOT/pages/web/html-css/layout.adoc`, grounded in the book's Ch.2 (pp.80–88,
    fundamentals), Ch.8 (pp.290–297, flexbox deep dive incl. `justify-content`/`align-items`/`align-content`/
    `order`/`flex-grow`/`flex-shrink`/`flex-basis`/`gap`), and Ch.13 (pp.447–453, container queries) — plus general
    knowledge to fill gaps the book leaves thin (the book's grid coverage is minimal: only `display: grid` +
    `grid-template-columns`, with no `grid-template-areas`, `grid-gap`, or named lines — add these from general
    CSS Grid knowledge since the issue explicitly asks to "explain all types of layout").
  - [x] Task 4.2. For each of float/flexbox/grid: explain how elements are laid out relative to each other, how
    they behave on viewport resize (responsive behavior, media queries, `srcset`/`sizes`/`<picture>`), and scroll
    behavior (the book only mentions `overflow: hidden` for float-clearing and `animation-timeline: scroll()` for
    scroll-driven animation — supplement with `overflow-x/y`, `scroll-snap-*` from general knowledge since the
    issue explicitly asks about scrolling behavior).
  - [x] Task 4.3. Add a diagram per layout mode showing how items are arranged (flex main/cross axis directions,
    grid track/line layout). These need real proportional box geometry that mermaid's flowchart/graph primitives
    can't faithfully represent — default to attempting a mermaid `block-beta` or graph-as-boxes diagram first, but
    expect to fall back to an authored SVG figure (`modules/ROOT/images/`) for at least the flex axis and grid
    track diagrams if mermaid renders them ambiguously.

- [x] Task 5. Write the CSS positioning page (issue bullet 2, part B)
  - [x] Task 5.1. Create `modules/ROOT/pages/web/html-css/positioning.adoc`, grounded in the book's Ch.5
    (pp.211–213): `static` (default/normal flow), `relative` (offset from original position via
    `top`/`right`/`bottom`/`left`), `fixed` (relative to viewport), `absolute` (relative to nearest positioned
    ancestor, removed from flow). The book only *names* `sticky` without explaining it — write `sticky` (relative
    until a scroll threshold, then fixed within its container) from general knowledge. Cover `z-index` stacking
    order alongside positioning, since it only matters once `position` is set.
  - [x] Task 5.2. Add a diagram contrasting how each positioning value displaces (or doesn't displace) surrounding
    content — default to mermaid; fall back to SVG only if mermaid can't show the offset-from-original-position
    concept clearly.

- [x] Task 6. Write the CSS box model page (issue bullet 3)
  - [x] Task 6.1. Create `modules/ROOT/pages/web/html-css/box-model.adoc`, grounded in the book's Ch.2 (pp.88–96):
    the margin → border → padding → content nesting, `width`/`height` (content box), the `padding`/`border`/
    `margin` longhand + shorthand properties (including the border width/style/color triplet), and the universal
    `box-sizing: border-box` reset pattern (`html{box-sizing:border-box} *,*:before,*:after{box-sizing:inherit}`).
  - [x] Task 6.2. Add the box-model diagram the issue explicitly asks for ("Use diagrams or figures"). This is a
    strong SVG candidate — precise nested-rectangle proportions with labeled layers (content/padding/border/
    margin) are exactly the kind of thing mermaid cannot depict accurately. Attempt a mermaid diagram first per
    the general mermaid-first rule, but expect this page to be the one that actually needs an authored SVG figure
    under `modules/ROOT/images/` (e.g. `box-model.svg`).

- [x] Task 7. Write the CSS selectors & specificity page (issue bullet 4, part A)
  - [x] Task 7.1. Create `modules/ROOT/pages/web/html-css/selectors-specificity.adoc`, grounded in the book's
    Ch.1 (pp.47–59): element/class/ID/universal/attribute selectors, pseudo-classes (link states with the
    "LoVe HAte" order mnemonic, `:checked`/`:disabled`/`:focus`, structural `:nth-child()`/`:first-of-type`/etc.),
    pseudo-elements (`::before`/`::after`/`::first-letter`/`::first-line`/`::selection`/`::backdrop`), combinators
    (descendant, child `>`, adjacent sibling `+`, general sibling `~`), and specificity (the 4-value notation,
    worked examples, `!important`).
  - [x] Task 7.2. Add a "modern selectors" subsection from the book's Ch.13 (pp.453–459): native CSS nesting
    (`&` syntax), the `:has()` relational selector (incl. AND/OR composition), cascade layers (`@layer`), and
    scoped styles (`@scope ... to (...)`).
  - [x] Task 7.3. Add a diagram contrasting adjacent-sibling (`+`) vs. general-sibling (`~`) combinators, matching
    the figure the book itself uses — default to mermaid; SVG only if mermaid can't render the sibling
    relationship clearly.

- [x] Task 8. Write the CSS variables & media queries page (issue bullet 4, part B) —
  `modules/ROOT/pages/web/html-css/variables-media-queries.adoc` created, grounded in book Ch.1/Ch.8/Ch.9.
  - [x] Task 8.1. Create `modules/ROOT/pages/web/html-css/variables-media-queries.adoc`, grounded in the book's
    Ch.1 (pp.60–62) and Ch.8 (pp.273–276): custom properties (`--name: value` on `:root`, `var(--name, fallback)`,
    scoping), and `@media screen and (max-width/min-width: Npx)` breakpoint patterns, plus `prefers-reduced-motion`
    (book Ch.9, `reduce`/`no-preference` values) as a media-query example relevant to accessibility.

- [x] Task 9. Write the light/dark theming page (issue bullet 4, part C)
  - [x] Task 9.1. Create `modules/ROOT/pages/web/html-css/theming.adoc`, grounded in the book's Ch.6 (entire
    chapter, pp.222–247): color models (hex, RGB, `hsl(hue, sat%, light%)`, the HSL color wheel, complementary
    colors), theming techniques (separate light/dark stylesheets, the `filter: invert(100%)` shortcut, the
    `color-scheme` property with `prefers-color-scheme`, and the experimental `light-dark()` function).
  - [x] Task 9.2. Cross-reference `variables-media-queries.adoc` (Task 8) for the underlying custom-property and
    media-query mechanics this page builds on, rather than re-explaining them.

- [x] Task 10. Write the CSS transitions page (issue bullet 5, part A)
  - [x] Task 10.1. Create `modules/ROOT/pages/web/html-css/transitions.adoc`, grounded in the book's Ch.5
    (pp.192–220): the full transition property table (`transition`, `transition-property`, `transition-duration`,
    `transition-timing-function`, `transition-delay`, `transition-behavior` incl. `allow-discrete`), shorthand
    ordering rules, and the `@starting-style` rule (standalone and nested forms) for animating first-render/
    `display:none` transitions.

- [x] Task 11. Write the CSS animations, keyframes & performance page (issue bullet 5, part B)
  - [x] Task 11.1. Create `modules/ROOT/pages/web/html-css/animations.adoc`, grounded in the book's Ch.5
    (pp.192–220): the full animation property table (`animation` shorthand, `animation-delay/direction/duration/
    fill-mode/iteration-count/name/play-state/timeline/timing-function`, with the shorthand's 8-item order),
    `@keyframes` syntax (`from`/`to` or percentage steps), and worked examples in the book's style (hover-menu
    transition, staggered slide-in via `@starting-style`, a CSS spinner via `transform: rotate(360deg)`, a shake
    effect via multi-step keyframes). Add Ch.13's modern additions: individual transform properties (`translate`,
    `rotate`, `scale`), `transition-behavior: allow-discrete`, and scroll-driven animations
    (`animation-timeline: scroll()`/`view()`).
  - [x] Task 11.2. Cover the issue's explicit "how to optimize performance of animations" ask as its own
    subsection. The book only gives three concrete, quotable tips (naming specific properties instead of `all`;
    keyframe animations outperforming `.gif`/JS-driven alternatives; `prefers-reduced-motion` for accessibility) —
    supplement from general web-performance knowledge with `will-change`, preferring `transform`/`opacity` for
    GPU-compositable animation, and avoiding layout-triggering properties (`width`/`height`/`top`/`left`) in
    animated properties, since the book itself has no coverage of compositor/GPU-layer concepts.

- [x] Task 12. Write the SVG styling & animation page (issue bullet 6)
  - [x] Task 12.1. Create `modules/ROOT/pages/web/html-css/svg-styling-animation.adoc`. **The book has no
    coverage of this topic at all** (it only ever references `.svg` as an external image-file format, never
    inline `<svg>` markup) — write this page entirely from general web-development knowledge: inline `<svg>` vs.
    `<img src="*.svg">` (only inline SVG can be styled/scripted), styling via `fill`/`stroke`/`stroke-width`/
    `stroke-dasharray` and CSS targeting SVG child elements, CSS transitions/animations applied to SVG properties
    (e.g. animating `stroke-dashoffset` for a "draw-in" line effect, transforming `<path>`/`<circle>` elements),
    and a brief mention of SMIL (`<animate>`) as the legacy alternative to CSS-based SVG animation.
  - [x] Task 12.2. Add a small worked example (e.g. an animated icon or a simple line-draw effect) with its SVG
    markup and the CSS/keyframes that animate it.

- [x] Task 13. Write the forms & styling page (issue bullet 7, part A) — `modules/ROOT/pages/web/html-css/forms.adoc`
  created, grounded in book Ch.4 (pp.148-191), with file-input/drag-and-drop sections flagged as general knowledge.
  - [x] Task 13.1. Create `modules/ROOT/pages/web/html-css/forms.adoc`, grounded in the book's Ch.4 (entire
    chapter, pp.148–191): `form` (`action`/`method`), `input` types covered by the book (`text`, `email`,
    `password`, `checkbox`, `radio`), `label` (`for` or wrapping), `textarea` (`rows`/`cols`), `fieldset`+
    `legend`, `select`/`option`, `button` types, and key attributes (`maxlength`, `placeholder`, `required`).
    Styling: custom text/textarea underline style, custom button styling, the custom select-box arrow trick
    (`-webkit-appearance: none` + `::after`), and `:valid`/`:invalid` styling.
  - [x] Task 13.2. Cover the input types the issue asks for that the book omits — `textarea` is covered above, but
    add `<input type="file">` and multi-file (`fileset`) selection, plus how to style a custom file-input control
    (hiding the native control, styling a `label[for]` as the visible button) — all from general knowledge, since
    the book never mentions file inputs.
  - [x] Task 13.3. Add a drag-and-drop file upload subsection (**entirely absent from the book** — write from
    general knowledge): the `draggable` attribute, `dragenter`/`dragover`/`dragleave`/`drop` events, `DataTransfer`/
    `event.dataTransfer.files`, preventing the browser's default open-file navigation
    (`e.preventDefault()` on `dragover`/`drop`), and a minimal JS snippet wiring a drop zone to a hidden
    `<input type="file">`.

- [x] Task 14. Write the forms accessibility & validation page (issue bullet 7, part B) —
  `modules/ROOT/pages/web/html-css/forms-accessibility-validation.adoc` created, grounded in book Ch.9
  (pp.315-325) plus general-knowledge JS Constraint Validation API section.
  - [x] Task 14.1. Create `modules/ROOT/pages/web/html-css/forms-accessibility-validation.adoc`, grounded in the
    book's Ch.9 (pp.315–324): correct `label`/`for`-`id` association (with the book's own failure-mode example of
    unassociated text not being read by screen readers), grouping via `fieldset`+`legend`, keyboard navigation
    (Tab/Shift+Tab/Enter/Space, the `:focus` pseudo-class, testing tab order), and the `required` attribute.
  - [x] Task 14.2. Cover form validation. The book only shows native HTML5 constraint validation (`required`,
    `type="email"`, `:valid`/`:invalid` styling) — supplement with the JavaScript Constraint Validation API
    (`checkValidity()`, `setCustomValidity()`, the `invalid` event) since the issue explicitly asks for
    "validation... using javascript examples if needed", with a worked example combining a custom error message
    and custom styling for an invalid field.

- [x] Task 15. Write the page-performance loading techniques page (new issue bullet, part A)
  - [x] Task 15.1. Create `modules/ROOT/pages/web/html-css/performance-loading.adoc`, grounded in the book's Ch.7
    (pp.250–269) and Ch.10 (pp.353–377): a brief Core Web Vitals primer (LCP/CLS/INP/FCP with good/poor
    thresholds) and the Lighthouse tool as a measurement reference point, then the loading techniques the issue
    asks for: inlining critical above-the-fold CSS in `<head><style>` with non-critical CSS deferred via
    `<link rel="preload" as="style" onload="this.rel='stylesheet'">` + `<noscript>` fallback; lazy-loading
    JS/CSS via `async`/`defer` and on-demand `document.createElement('script')`; native `loading="lazy"`/
    `loading="eager"` for offscreen images; and image format/size selection (`srcset`+`sizes`, `<picture>`+
    `<source>` for format negotiation across JPEG/PNG/WebP/AVIF, `width`/`height` attributes to prevent CLS,
    `fetchpriority`, and `<link rel="preload|prefetch|preconnect">` resource hints).

- [x] Task 16. Write the page-performance build optimization page (new issue bullet, part B)
  - [x] Task 16.1. Create `modules/ROOT/pages/web/html-css/performance-build-optimization.adoc`, grounded in the
    book's Ch.11 (pp.408–412) and Ch.10: minification (Webpack `mode: 'production'`/`TerserPlugin`, Gulp
    `gulp-uglify`/`gulp-clean-css`, and CSS minification as a direct SEO/speed factor with the book's before/after
    figure), bundling/code-splitting (Webpack `SplitChunksPlugin`, dynamic imports), reducing DOM size/nesting
    (the book's Ch.10 before/after DOM-simplification example), and a brief mention of image-compression tools
    (TinyPNG, ImageOptim, Squoosh) and CDNs.
  - [x] Task 16.2. Cross-reference `performance-loading.adoc` (Task 15) rather than repeating the Core Web Vitals
    primer.

- [x] Task 17. Write the full HTML element reference appendix (issue bullet 9, part A) —
  `modules/ROOT/pages/web/html-css/appendix-html-elements.adoc` created from general/MDN knowledge,
  cross-references other deep-dive pages instead of repeating them.
  - [x] Task 17.1. Create `modules/ROOT/pages/web/html-css/appendix-html-elements.adoc`. **The book has no
    element/attribute reference table** — build this primarily from general/MDN-grounded knowledge, using only
    the book's Ch.1 element groupings (metadata, sectioning, block/inline text, media, table, form, web component)
    as a loose starting skeleton. Scope it to elements **not already covered in depth** by Tasks 2–16 (structural/
    semantic tags, form elements, and SVG are covered elsewhere) — cover text-level semantics (`strong`/`em`/
    `mark`/`time`/`abbr`/`code`/`small`/`sub`/`sup`), lists (`ul`/`ol`/`li`/`dl`/`dt`/`dd`), tables (`table`/
    `thead`/`tbody`/`tfoot`/`tr`/`th`/`td`/`colgroup`), embedded/media (`img`/`picture`/`source`/`video`/`audio`/
    `iframe`/`embed`/`object`), and interactive/misc (`details`/`summary`/`dialog`/`template`/`canvas`) — each
    with its key attributes/parameters and a short example, cross-referencing the relevant deep-dive page
    (`html-structure.adoc`, `forms.adoc`, `svg-styling-animation.adoc`) instead of repeating those elements here.

- [x] Task 18. Write the full CSS property reference appendix (issue bullet 9, part B) —
  `modules/ROOT/pages/web/html-css/appendix-css-properties.adoc` created from general/MDN knowledge,
  cross-references other deep-dive pages instead of repeating them.
  - [x] Task 18.1. Create `modules/ROOT/pages/web/html-css/appendix-css-properties.adoc`. **The book has no
    general CSS property table** (only narrow transition/animation/flexbox tables, already used in Tasks 4/10/11)
    — build this primarily from general/MDN-grounded knowledge. Scope it to properties **not already covered in
    depth** elsewhere (layout, box model, selectors/specificity, variables, animations/transitions are covered by
    Tasks 4–11) — cover typography (`font-family`/`font-size`/`font-weight`/`line-height`/`text-align`/
    `text-decoration`/`text-transform`/`letter-spacing`), color/background (`background-color`/`background-image`/
    `background-position`/`background-size`/`background-repeat`/`opacity`), borders/effects (`border-radius`/
    `box-shadow`/`outline`/`filter`), display/overflow (`display` values overview, `visibility`, `overflow`), lists
    (`list-style`), and misc common properties (`cursor`), cross-referencing the relevant deep-dive page instead of
    repeating properties already covered there.

### Group 3 — Cheat sheet

**Parallelizable: yes** (single task) — depends on Group 2's pages existing, since the cheat sheet summarizes and
links to all of them; must not start until Group 2 is complete.

- [x] Task 19. Create the HTML & CSS cheat sheet
  - [x] Task 19.1. Following the pattern of `modules/ROOT/pages/sql/cheat-sheet.adoc`, design a single-page,
    color-coded PDF summarizing the most-used HTML5 structural elements, the box model, flexbox/grid basics,
    common selectors, transition/animation shorthand syntax, and form accessibility essentials — grouped into
    boxes by topic, generated as a downloadable PDF.
  - [x] Task 19.2. Save the generated PDF to `modules/ROOT/attachments/html-css-cheat-sheet.pdf`.
  - [x] Task 19.3. Create `modules/ROOT/pages/web/html-css/cheat-sheet.adoc`
    (`include::partial$html-css-disclaimer.adoc[]` at the top), briefly describing the cheat sheet, linking back
    to every page from Group 2 for full detail, and linking the PDF via
    `xref:attachment$html-css-cheat-sheet.pdf[Download the HTML & CSS Cheat Sheet (PDF)]`.

### Group 4 — Section indexes, nav wiring, and final verification

**Parallelizable: yes** — the four tasks below touch different files and each only needs to know the filenames
decided in Groups 2–3 (not each other's finished content), but this whole group must run last since every task
references the complete page set.

- [x] Task 20. Create the HTML & CSS Reference section index
  - [x] Task 20.1. Create `modules/ROOT/pages/web/html-css/index.adoc` (mirroring `sql/index.adoc`): an
    `include::partial$html-css-disclaimer.adoc[]`, a short intro, a "What's covered" bullet list `xref:`-linking
    every page from Group 2 plus the cheat sheet (Task 19) with a one-line blurb each, and a closing bibliography
    section citing *"Practical HTML and CSS"* (and MDN as the general reference used throughout).

- [x] Task 21. Create the Web Development section landing page
  - [x] Task 21.1. Create `modules/ROOT/pages/web/index.adoc`: a short intro to the "Web Development" section, and
    a bullet list (structured to make adding future siblings straightforward) currently containing just one entry
    — `xref:web/html-css/index.adoc[HTML & CSS Reference]` — with a one-line blurb.

- [x] Task 22. Wire the new section into the site navigation
  - [x] Task 22.1. Update [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), adding a new three-level entry after the
    existing SQL Reference entry:
    ```
    * xref:web/index.adoc[Web Development]
    ** xref:web/html-css/index.adoc[HTML & CSS Reference]
    *** xref:web/html-css/html-structure.adoc[HTML5 Structure & Semantics]
    *** xref:web/html-css/seo.adoc[SEO with Semantic HTML]
    *** xref:web/html-css/layout.adoc[Layout: Float, Flexbox & Grid]
    *** xref:web/html-css/positioning.adoc[Positioning]
    *** xref:web/html-css/box-model.adoc[The Box Model]
    *** xref:web/html-css/selectors-specificity.adoc[Selectors & Specificity]
    *** xref:web/html-css/variables-media-queries.adoc[Variables & Media Queries]
    *** xref:web/html-css/theming.adoc[Light & Dark Theming]
    *** xref:web/html-css/transitions.adoc[Transitions]
    *** xref:web/html-css/animations.adoc[Animations & Keyframes]
    *** xref:web/html-css/svg-styling-animation.adoc[Styling & Animating SVGs]
    *** xref:web/html-css/forms.adoc[Forms & Styling]
    *** xref:web/html-css/forms-accessibility-validation.adoc[Form Accessibility & Validation]
    *** xref:web/html-css/performance-loading.adoc[Performance: Loading Techniques]
    *** xref:web/html-css/performance-build-optimization.adoc[Performance: Build Optimization]
    *** xref:web/html-css/appendix-html-elements.adoc[Appendix: HTML Elements]
    *** xref:web/html-css/appendix-css-properties.adoc[Appendix: CSS Properties]
    *** xref:web/html-css/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```

- [x] Task 23. Add the section to the root landing page
  - [x] Task 23.1. Update [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Other` section,
    adding (after the existing SQL Reference bullet) a nested entry:
    ```
    * xref:web/index.adoc[Web Development] -- a growing collection of web-development references, starting
      with HTML & CSS.
    ** xref:web/html-css/index.adoc[HTML & CSS Reference] -- structure, layout, styling, forms, performance,
      and a downloadable cheat sheet.
    ```

- [x] Task 24. Final build verification — `npx antora antora-playbook.yml` via `iru-build-docs` passed cleanly
  (exit 0, no xref/AsciiDoc errors) across two runs; all new pages, images, and the PDF attachment render.
  - [x] Task 24.1. Delegate to the `iru-gate-runner` agent to invoke `Skill({skill: "iru-build-docs"})` and confirm
    the full site builds cleanly (no `xref`/AsciiDoc errors, particularly for every new cross-reference added
    across Groups 2–4), reporting back only a pass/fail summary and any error list rather than the full build log.
    Fix any reported errors before considering this task complete.
