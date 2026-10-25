# Implementation Plan: HTML tags with multiple classes (compound class selectors)

## Task summary

Source: GitHub issue #214
Base branch: main

Issue [#214](https://github.com/albertoirurueta/docs/issues/214) asks for documentation of HTML elements carrying
several classes and how CSS selects them (`.a.b` vs `.a .b`, specificity of chained classes, irrelevance of
attribute order), and for the Sass, Bootstrap and Tailwind references to take it into account. This is a docs-only
change under `modules/ROOT/pages/web/` plus one PDF attachment; there is no application code.

Choices made on the user's behalf:

* The canonical explanation lives once, in `html-css/selectors-specificity.adoc`, in stable anchors
  (`[#multiple-classes]`, `[#class-combinators-compared]`, `[#chained-class-specificity]`, `[#class-order]`).
  Sass, Bootstrap and Tailwind pages link to them with `xref:web/html-css/selectors-specificity.adoc#...[]` and add
  only the framework-specific angle (as the issue's acceptance criteria require).
* The Bootstrap override example goes in `customization.adoc` (the issue allows `customization.adoc` *or*
  `utility-api.adoc`; overriding components in custom SCSS is a customization topic).
* The side-by-side comparison of `.a.b` / `.a .b` / `.a > .b` / `.a, .b` is a table plus one SVG figure; no Mermaid
  diagram is added (avoids the HTML-tag-in-Mermaid pitfall), so `validate:mermaid` is only a regression check.
* The cheat-sheet PDF has no source in the repo, so it is rebuilt from a throwaway HTML page in the session
  scratchpad (headless Chrome print-to-PDF, one A4 page, checked with PyMuPDF) following
  `.archive/implementation_plan_264.md` Task 70. The existing PDF's content is extracted first so nothing else changes.
* The Spanish example names (`tarjeta destacado activo`) are kept verbatim as the issue gives them.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`selectors-specificity.adoc` has a dedicated \"multiple classes\" subsection with the full, partial, and type-plus-class selection examples, and a clearly highlighted warning about the space (`.a.b` vs `.a .b`)." | Task 1, Task 2 |
| 2 | "Specificity of chained classes, and the irrelevance of class order in the HTML attribute, are explained with a worked example." | Task 3, Task 4 |
| 3 | "The Sass, Bootstrap and Tailwind pages listed above cross-reference the HTML & CSS subsection (`xref:web/html-css/selectors-specificity.adoc#...[]`) instead of re-explaining the basics." | Tasks 8–14 |
| 4 | "The HTML & CSS cheat sheet (page and PDF) includes the `.a.b` vs `.a .b` distinction." | Task 15 |
| 5 | "The Antora build passes, and the verification checks in `CLAUDE.md` ... print nothing." | Task 16 |
| 6 | derived: the remaining items of the issue's "Documentation changes needed" list (nesting, `:has()`, `html-structure`, `index`, Tailwind detection note) are each addressed | Tasks 5, 6, 7, 11, 14 |

## Current code state

All files are AsciiDoc under `modules/ROOT/pages/web/`.

* `html-css/selectors-specificity.adoc` (506 lines): `== Element, Class, and ID Selectors` (line 17; the Class bullet
  shows `<h1 class="heading">` only), `== Combining Selectors: Combinators` (160; closes with a one-line `li.primary`
  remark), `== CSS Specificity` (228) with `=== Worked examples` (254) and `=== The special case of
  `!important`` (265; `<div class="media hide">` example), `=== Native CSS nesting` (305), `=== The `:has()`
  relational selector` (371).
* `html-css/html-structure.adoc`: `div` examples use single classes (`class="header"`, `class="navigation"`, ...) and
  a reference table row `<div class="navigation">...</div>` (line ~369).
* `html-css/cheat-sheet.adoc`: only a description plus the PDF link; the "Selectors and specificity" box exists only
  inside `modules/ROOT/attachments/html-css-cheat-sheet.pdf`.
* `html-css/index.adoc`: line 24 bullet "Selectors & specificity", plus `:description:`/`:keywords:`.
* Sass: `sass/nesting.adoc` (`== The `&` parent selector` 84, `=== Suffixing `&` for BEM` 123), `sass/extend.adoc`
  (`=== Extending compound selectors` 221).
* Bootstrap: `bootstrap/buttons.adoc` (`== Base class and color variants` 13), `utilities.adoc` (`== Where these
  classes come from` 209), `customization.adoc`.
* Tailwind: `tailwind/utility-first-fundamentals.adoc` (11, 58), `custom-styles-and-arbitrary-values.adoc`
  (`== `@apply` and `@reference`` 119), `states-and-variants.adoc` (`== `group-*` and `peer-*`` 90, arbitrary variants
  142), `customization-and-configuration.adoc` (`== Detecting classes in source files` 29).
* Conventions (`CLAUDE.md`): images in `modules/ROOT/images/`, block macro on one line, alt text with a comma in double
  quotes, every SVG referenced; inline code containing `->`, `&`-adjacent sequences, `~`, `*`, `^`, `...`, `'`, `{`
  written as `` `+...+` `` passthroughs (`` `pass:c[...]` `` when it contains `+`); no `<<...>>` in Mermaid.
* Tooling: Node 24, `npx antora antora-playbook.yml`; PyMuPDF and reportlab available; `pdfinfo`/`pandoc` are not.

## Implementation steps

### Group 1 — Canonical explanation (Parallelizable: no — all tasks edit `html-css/selectors-specificity.adoc`)

- [x] Task 1. Add `=== Elements with multiple classes` (anchor `[#multiple-classes]`) after the Class/ID/element block in `selectors-specificity.adoc`
  - [x] Task 1.1. Explain that `class` is a space-separated list (`<div class="tarjeta destacado activo">`), each class targetable alone, and that an element receives the rules of every class it carries
  - [x] Task 1.2. Show full selection (`.tarjeta.destacado.activo`), partial selection (`.tarjeta.activo`, matches `class="activo tarjeta"` and `class="tarjeta otro activo"` too) and type-plus-class (`div.tarjeta.destacado.activo`, type selector first) in one `[source,css]` block with comments, plus a small table of which HTML elements each selector matches
  - [x] Task 1.3. Add the base-and-modifier pattern (`card card--featured is-active`), linking to BEM in `xref:web/sass/nesting.adoc#...[]`, and a short `classList.add/remove/toggle/contains` vs `className` note
- [x] Task 2. Expand `== Combining Selectors: Combinators` with `[#class-combinators-compared]`
  - [x] Task 2.1. Replace the closing `li.primary` sentence with a comparison table: `.a.b` (same element, AND), `.a .b` (descendant), `.a > .b` (child), `.a, .b` (selector list, OR), each with an HTML snippet and the elements matched
  - [x] Task 2.2. Add a `WARNING` admonition about the accidental space ("the most common error")
  - [x] Task 2.3. Add `modules/ROOT/images/html-css-multiple-classes-selectors.svg` (four selectors, same markup, matched elements highlighted; light/dark safe like sibling SVGs) and reference it with a one-line `image::` macro (quoted alt text)
- [x] Task 3. Add a worked example to `=== Worked examples` (`[#chained-class-specificity]`): `.tarjeta.destacado.activo` = `(0, 0, 3, 0)`, `.tarjeta.activo` = `(0, 0, 2, 0)`, `div.tarjeta.destacado.activo` = `(0, 0, 3, 1)`; compare `.tarjeta.destacado.activo` against `#main .tarjeta` and `div.tarjeta.destacado.activo` against `.tarjeta.activo`; mention `.activo.activo` as a known specificity booster
- [x] Task 4. Add `[#class-order]` content: in the `!important` section state that `media hide` order in the attribute has no effect and that a later `.hide` helps only at equal specificity; also state the general rule (equal specificity: later rule in the stylesheet wins, not the class written last in HTML) in the new multiple-classes subsection
- [x] Task 5. Extend `=== Native CSS nesting`: `&.activo` inside `.tarjeta { }` compiles to `.tarjeta.activo`, while `& .activo` and a bare `.activo` compile to `.tarjeta .activo`; use passthroughs for inline code containing `&`/`.`-adjacent sequences if needed
- [x] Task 6. Extend `=== The `:has()` relational selector` with one line showing `.card:has(.a.b)`

### Group 2 — Cross-references and framework pages (Parallelizable: yes — one file per task; all depend on Group 1 anchors only)

- [x] Task 7. `html-css/html-structure.adoc`: in the `div` section add an example `<div class="navigation navigation--sticky is-open">` with an `xref:web/html-css/selectors-specificity.adoc#multiple-classes[]` pointer; add to the "Reference: metadata and semantic structural elements" table (or note under it) that the global `class` attribute accepts a space-separated list
- [x] Task 8. `html-css/index.adoc`: update the Selectors & specificity bullet and the page `:description:`/`:keywords:` to mention multiple classes and compound selectors
- [x] Task 9. `sass/nesting.adoc`: under `== The `&` parent selector` compare `&.is-active`, `& .is-active` and plain nested `.is-active` (both descendant) with compiled output, include a chained `&.destacado.activo` example, and link to `#multiple-classes`; under `=== Suffixing `&` for BEM` clarify that `&--featured` creates a new class name (`.card--featured`) to be added alongside the base class (`class="card card--featured"`) whereas `&.featured` targets two classes on one element
- [x] Task 10. `sass/extend.adoc`: in `=== Extending compound selectors` link to `#multiple-classes` and show the allowed alternative `@extend .a; @extend .b;`, explaining how its output differs from matching `.a.b`
- [x] Task 11. `bootstrap/buttons.adoc`: in `== Base class and color variants` use `btn` + `btn-primary` + `btn-lg` as the canonical multiple-classes example, note each class contributes independent declarations and that `class="btn-primary"` without `btn` is not a complete button; link to `#multiple-classes`
- [x] Task 12. `bootstrap/utilities.adoc`: in `== Where these classes come from` (or the intro) explain combining components and utilities (`class="card shadow-sm p-3 text-center"`), and that utilities win because Bootstrap declares them with `!important`, not because of attribute position; link to `#class-order`
- [x] Task 13. `bootstrap/customization.adoc`: add a short section on overriding components in custom SCSS by targeting the combination (`.btn.btn-primary`, `.nav-link.active`, `.form-control.is-invalid`) with the resulting specificity against Bootstrap's own selectors; link to `#chained-class-specificity`
- [x] Task 14. Tailwind pages (four files, independent edits):
  - [x] Task 14.1. `utility-first-fundamentals.adoc`: state that Tailwind is multiple classes per element (one class per declaration) and add a conflicting-utilities note (`class="p-2 p-4"` — the rule later in the generated CSS wins, attribute order is irrelevant; avoid conflicts; `clsx`/`tailwind-merge` for dynamic composition); link to `#class-order`
  - [x] Task 14.2. `custom-styles-and-arbitrary-values.adoc`: in `== `@apply` and `@reference`` show `.tarjeta.activo { @apply ... }` and the trade-off versus utilities in the markup
  - [x] Task 14.3. `states-and-variants.adoc`: add `[&.is-active]:bg-sky-500` and `group-[.is-open]:block` examples with the compound selector they compile to
  - [x] Task 14.4. `customization-and-configuration.adoc`: in `== Detecting classes in source files` note each class of a multi-class string is detected individually and must appear complete (never concatenated fragments)

### Group 3 — Cheat sheet (Parallelizable: yes — one page and one PDF, no overlap with Group 2)

- [x] Task 15. Cheat sheet update
  - [x] Task 15.1. `html-css/cheat-sheet.adoc`: add a sentence to the description (and `:keywords:`) that the Selectors and specificity box covers `.a.b` vs `.a .b`, and link to `#class-combinators-compared`
  - [x] Task 15.2. Extract the current content/layout of `modules/ROOT/attachments/html-css-cheat-sheet.pdf` with PyMuPDF, add `.a.b` (same element) vs `.a .b` (descendant) to the "Selectors and specificity" box in a throwaway HTML page in the session scratchpad, render with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), confirm exactly one A4 page with PyMuPDF, preview as PNG, and replace only the PDF in the repo

### Group 4 — Build and verification (Parallelizable: yes — single task; depends on Groups 1–3)

- [x] Task 16. Verify
  - [x] Task 16.1. Run `npx antora antora-playbook.yml` (delegate to the `iru-gate-runner` agent or a generic sub-agent so build output stays out of the main context) and confirm no `xref`/AsciiDoc errors, including the new anchors
  - [x] Task 16.2. Run the `CLAUDE.md` checks and confirm they print nothing: block/inline image macros not closed on one line, `<p>image::` in `build/site`, alt text with an unquoted comma on the changed `.adoc` files, inline-code substitutions on `build/site/web/html-css`, `build/site/web/sass`, `build/site/web/bootstrap`, `build/site/web/tailwind`
  - [x] Task 16.3. Scan the rendered HTML text for backtick/quote/bare `+`/`[[x]]` defects on the changed pages; confirm the new SVG is referenced and every `image::` target exists; run `npm run validate:mermaid` as a regression check (after the one-off `npm i --no-save mermaid@11 jsdom`)
  - [x] Task 16.4. Run `/iru-check-security`-style secret scan expectations: any `detect-secrets` finding in this docs repo is labelled `is_secret: false`
