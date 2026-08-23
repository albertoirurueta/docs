# Implementation Plan: JS/SQL content additions, SEO metadata rollout, and disclaimer legal-risk fix

## Task summary

Six manually-described documentation changes, continuing on the current `feature/15` branch (PR #16, still open/
draft) rather than a new branch — this is not tied to a GitHub issue or Jira ticket.

1. Add coverage of `data-*` custom attributes (the `dataset` API) and custom HTML tags (Web Components) to the
   JavaScript Development section.
2. Add a proper `==` vs `===` sample comparison table (truthy/falsy is already correctly covered elsewhere).
3. Add a relational database normalization page to the SQL Reference section.
4. Add `:description:`/`:keywords:` page-metadata attributes to all 68 existing `.adoc` pages (plus the 3 new
   pages this plan creates) for SEO.
5. Remove book-primacy language from the two disclaimers that currently frame a book as this content's main
   source (legal-risk fix) — keep AI-generation framing only; books stay as bibliography entries only.
6. Add a dedicated JavaScript exception-handling page.

**Research already performed** (grounds Tasks 1–5, no further exploration needed):

- The book (`~/Downloads/book.pdf`, *JavaScript: The Definitive Guide*, 7th ed.) covers "Dataset attributes" as
  its own subsection at book page 464 (§15.3.3, immediately before §15.3.4 "Element Content"), and "Web
  Components" as its own §15.6 spanning book pages ~482–495 (custom elements via `customElements.define()`,
  the `observedAttributes` static property and `attributeChangedCallback`, the Shadow DOM API, and
  `<template>`/`<slot>`).
- `modules/ROOT/pages/web/javascript/types.adoc` (lines 243–270) already has an accurate falsy-value table
  matching the book's own §3.4/§4.10 definition exactly (`false`, `null`, `undefined`, `0`, `-0`, `NaN`, `""`,
  plus a correct extra entry for `0n` BigInt zero) — this does **not** need fixing. What's missing is a proper
  comparison *table* (the existing content is 4 inline code lines) for `==` vs `===` in
  `modules/ROOT/pages/web/javascript/functions-expressions-operators.adoc`'s existing "Equality Operators: `==`
  vs. `===`" section (lines 98–116).
- Repo-wide grep confirms book-primacy language (`"built from the book"` / `"built primarily from the book"`)
  exists **only** in `modules/ROOT/partials/html-css-disclaimer.adoc` and
  `modules/ROOT/partials/javascript-disclaimer.adoc` — `modules/ROOT/partials/sql-disclaimer.adoc` already only
  cites the ISO/IEC standard plus AI-generation, so it needs no change. The three section `index.adoc` pages
  (`sql/index.adoc`, `web/html-css/index.adoc`, `web/javascript/index.adoc`) already have proper
  Bibliography-only sections citing these books — verified clean, no "primary source" framing there to remove.
- The custom UI bundle (`ui-bundle.zip`, `partials/head-info.hbs`) already renders `page.description` and
  `page.keywords` — sourced from AsciiDoc `:description:`/`:keywords:` document attributes — as `<meta>` tags
  automatically. Task 6 is a pure content change; no UI bundle change is needed.
- `modules/ROOT/pages/web/javascript/stdlib-dates-errors-json.adoc` already covers the `Error` class hierarchy
  and a brief `try`/`catch`/`finally` mention — the new exception-handling page (Task 5) must cross-reference it
  rather than duplicate it.
- Exactly 68 `.adoc` pages currently exist under `modules/ROOT/pages/`: 12 in `sql/`, 19 in `web/html-css/`, 35
  in `web/javascript/`, plus `index.adoc` and `web/index.adoc`.

**Choices made on the user's behalf** (best-practice defaults, stated here so they can be challenged during
review):

- **Task 1 split into two**: a small addition to the existing `browser-dom-basics.adoc` for `data-*`/`dataset`
  (naturally belongs there, next to other DOM element read/write APIs), and a **new** dedicated page,
  `browser-web-components.adoc`, for Web Components — that topic is substantial enough (custom elements,
  lifecycle, Shadow DOM, templates/slots) to warrant its own page rather than being folded into an existing one.
- **New page names**: `modules/ROOT/pages/web/javascript/browser-web-components.adoc`,
  `modules/ROOT/pages/sql/normalization.adoc`, `modules/ROOT/pages/web/javascript/exception-handling.adoc` — flat
  layout, consistent with every existing page in these sections.
- **Cheat sheets are not updated** for the two brand-new topic areas (Web Components, exception handling) — both
  section cheat sheets are explicitly scoped as "most-used essentials," not an exhaustive index, and are already
  large; the new pages are still fully discoverable via `nav.adoc` and each section's `index.adoc`.
- **SEO metadata content must be genuinely per-page**: a real one-sentence summary of that specific page's actual
  content for `:description:`, and terms actually relevant to that page for `:keywords:` — never a generic
  templated line reused across pages. Placed as document attributes directly under each page's `= Title` line
  (Antora/Asciidoctor convention), before any `include::partial$...`.
- **Ordering**: Tasks 1–5 (content additions/fixes) run before Task 6 (SEO metadata), since Task 6 must cover the
  final content of every page, including the three new pages Tasks 1/3/5 create and the two pages Tasks 1/2
  modify. Task 7 (build verification) runs last of all.

## Current code state

- Every page under `modules/ROOT/pages/{sql,web/html-css,web/javascript}/` includes its section's disclaimer
  partial (`include::partial$<section>-disclaimer.adoc[]`) directly under the `= Title` line, is wired into
  `modules/ROOT/nav.adoc`, and is linked with a one-line blurb from its section's `index.adoc`.
- `modules/ROOT/pages/web/javascript/browser-dom-basics.adoc` currently covers `window`/`document`, element
  query/creation/removal, and attribute/property/`textContent`/`innerHTML` access — no `dataset`/`data-*`
  coverage yet.
- `modules/ROOT/pages/web/javascript/functions-expressions-operators.adoc`'s "Equality Operators" section (lines
  98–116) explains `==`/`===` in prose plus 4 inline example lines — no table.
- `modules/ROOT/pages/sql/index.adoc` currently links 10 topic pages; no normalization page exists yet.
- `modules/ROOT/partials/html-css-disclaimer.adoc` and `modules/ROOT/partials/javascript-disclaimer.adoc` both
  currently state the content was "built from"/"built primarily from" a named book — see exact current wording
  quoted in Tasks 4.1/4.2 below.
- No `.adoc` page anywhere in the repo currently sets `:description:` or `:keywords:` (confirmed via grep).
- `modules/ROOT/pages/web/javascript/stdlib-dates-errors-json.adoc` covers `Error`/`TypeError`/`RangeError`, a
  brief custom-`Error`-subclass mention, and `try`/`catch`/`finally` for control flow — this plan's new
  exception-handling page must go deeper on `throw`/catch mechanics and add the async-specific material this
  page doesn't cover, cross-referencing it instead of repeating it.

## Implementation steps

1. [x] **Add `data-*`/`dataset` coverage to the DOM basics page**
   - [x] Update `modules/ROOT/pages/web/javascript/browser-dom-basics.adoc`: add a new section, grounded in the
     book's §15.3.3 (page 464), covering the `data-*` attribute convention (lowercase, `data-` prefix, doesn't
     affect presentation/validity), the `dataset` property (each `data-*` attribute exposed with its prefix
     removed, hyphenated names mapped to camelCase — e.g. `data-section-number` → `dataset.sectionNumber`), and a
     worked example reading a `data-*` value via `dataset`.
   - Added new "`data-*` Attributes and the `dataset` Property" subsection (with worked example) to
     `browser-dom-basics.adoc`, and trimmed the pre-existing naming-quirks bullet to cross-reference it.

2. [x] **Add a Web Components page**
   - [x] Create `modules/ROOT/pages/web/javascript/browser-web-components.adoc`
     (`include::partial$javascript-disclaimer.adoc[]` at the top), grounded in the book's §15.6 (pages ~482–495):
     defining a custom element (`class extends HTMLElement`, `customElements.define('tag-name', Class)`), the
     lifecycle callbacks (`connectedCallback`, `disconnectedCallback`, `attributeChangedCallback` paired with the
     static `observedAttributes` property), the Shadow DOM API (`attachShadow({mode: 'open'})`, shadow-root
     encapsulation of styles/markup from the rest of the document), and `<template>`/`<slot>` (defining reusable
     inert markup and projecting light-DOM children into named slots). Include a small worked example defining
     one custom element end to end.
   - [x] Add a diagram of the custom-element lifecycle callback sequence (construction → `connectedCallback` →
     `attributeChangedCallback` → `disconnectedCallback`) — default to a mermaid diagram; fall back to SVG only if
     mermaid can't render it clearly.
   - Created `browser-web-components.adoc` (new page) covering custom elements, lifecycle callbacks (with a
     mermaid sequence diagram), Shadow DOM, `<template>`/`<slot>`, and a full worked `<user-card>` example.

3. [x] **Add an `==` vs `===` comparison table**
   - [x] Update `modules/ROOT/pages/web/javascript/functions-expressions-operators.adoc`'s existing "Equality
     Operators: `==` vs. `===`" section: add an AsciiDoc table with columns for the two operand values, the `==`
     result, the `===` result, and a one-line reason — covering representative pairs such as
     `1` / `"1"`, `0` / `false`, `null` / `undefined`, `NaN` / `NaN`, `0` / `-0`, `""` / `false`, `[]` / `false`,
     and `{}` / `{}` (two distinct object references) — supplementing, not replacing, the existing prose and
     inline code example.
   - [x] Add a cross-reference from this section to the truthy/falsy table in
     `modules/ROOT/pages/web/javascript/types.adoc` (that table is already accurate and does not need its own
     changes) so a reader linking `==`'s coercion behavior to truthy/falsy conversion has a direct path there.
   - Added an 8-row comparison table plus a cross-reference to `types.adoc#_boolean_values` in
     `functions-expressions-operators.adoc`.

4. [x] **Add a relational database normalization page**
   - [x] Create `modules/ROOT/pages/sql/normalization.adoc` (`include::partial$sql-disclaimer.adoc[]` at the
     top), covering: what a functional dependency is, First Normal Form (atomic values, no repeating groups),
     Second Normal Form (no partial dependency on a composite key), Third Normal Form (no transitive dependency),
     and Boyce-Codd Normal Form (every determinant is a candidate key) — each with a small worked example table
     showing an un-normalized/violating design and its normalized form, plus a brief note on the normalization
     vs. denormalization trade-off (query performance vs. update anomalies).
   - [x] Add a diagram illustrating the progressive decomposition of one running example table across 1NF → 2NF
     → 3NF (mermaid preferred; SVG fallback only if mermaid can't depict the table decomposition clearly).
   - Created `normalization.adoc` (new page): functional dependencies, 1NF/2NF/3NF/BCNF each with a running
     `academic.*` example (before/after tables + `CREATE TABLE` DDL), a mermaid flowchart of the full
     decomposition, and a normalization-vs-denormalization closing section.

5. [x] **Wire the three new pages into their sections' nav and index**
   - [x] Update `modules/ROOT/nav.adoc`: add
     `*** xref:web/javascript/browser-web-components.adoc[Web Components]` after the existing
     `browser-workers.adoc` entry (JavaScript-in-the-browser group), add
     `*** xref:web/javascript/exception-handling.adoc[Exception Handling]` in a sensible position within the
     language-reference group (after `async-javascript.adoc`, since exception handling touches both sync and
     async code), and add `** xref:sql/normalization.adoc[Normalization]` after the existing
     `sql/triggers-procedures.adoc` entry, before the SQL cheat sheet entry.
   - [x] Update `modules/ROOT/pages/web/javascript/index.adoc`'s "What's covered" list: add one-line blurbs for
     `browser-web-components.adoc` (under "JavaScript in the browser") and `exception-handling.adoc` (under
     "Language reference").
   - [x] Update `modules/ROOT/pages/sql/index.adoc`'s "What's covered" list: add a one-line blurb for
     `normalization.adoc`.
   - Updated `nav.adoc` (3 new entries), `web/javascript/index.adoc`, and `sql/index.adoc` with blurbs for the
     three new pages.

6. [x] **Fix the `html-css-disclaimer.adoc` book-primacy language**
   - [x] Update `modules/ROOT/partials/html-css-disclaimer.adoc`. Current text: *"This content was built from the
     book "Practical HTML and CSS", supplemented with general web-development knowledge where the book did not
     cover a topic in depth, and was generated with the assistance of AI."* Replace with wording that states only
     AI-assisted generation (matching `sql-disclaimer.adoc`'s pattern), dropping the book-primacy framing
     entirely — e.g. *"This content was generated with the assistance of AI."* — while keeping the rest of the
     disclaimer (the framework-agnostic scope statement, the MDN/caniuse.com verification recommendation) intact.
     The book itself stays cited only in `web/html-css/index.adoc`'s existing Bibliography section — do not
     remove that citation, only the "main source" framing in the disclaimer.
   - Replaced the book-primacy sentence in `html-css-disclaimer.adoc` with plain AI-generation wording; rest of
     the disclaimer and the Bibliography citation in `web/html-css/index.adoc` left untouched.

7. [x] **Fix the `javascript-disclaimer.adoc` book-primacy language**
   - [x] Update `modules/ROOT/partials/javascript-disclaimer.adoc`. Current text states the content "was built
     primarily from the book *JavaScript: The Definitive Guide*..." and names which topics (WebGL, Three.js,
     Geolocation, WebRTC, Video APIs, tooling pages) drew on general/official documentation "rather than the
     book." Replace with wording that states only AI-assisted generation, dropping every book-primacy reference —
     the general/official-documentation-sourced topics can still be mentioned as a factual note on scope/coverage
     if useful, but not framed relative to "the book." Keep the rest of the disclaimer (framework-agnostic scope
     statement, ECMAScript-spec/MDN verification recommendation) intact. The book stays cited only in
     `web/javascript/index.adoc`'s existing Bibliography section.
   - Replaced the book-primacy sentence in `javascript-disclaimer.adoc`; the WebGL/Three.js/Geolocation/WebRTC/
     Video/tooling scope note is kept as a plain factual statement, no longer framed relative to "the book."

8. [x] **Add a JavaScript exception-handling page**
   - [x] Create `modules/ROOT/pages/web/javascript/exception-handling.adoc`
     (`include::partial$javascript-disclaimer.adoc[]` at the top): `throw` (throwing any value, though an `Error`
     instance is conventional), `try`/`catch`/`finally` mechanics in depth (`finally` always runs, including
     during an uncaught exception or a `return` inside `try`/`catch`; `catch`'s optional binding), and how an
     uncaught exception propagates up the call stack. Cross-reference
     `modules/ROOT/pages/web/javascript/stdlib-dates-errors-json.adoc` for the built-in `Error` subclass hierarchy
     rather than repeating it.
   - [x] Add a "Custom Exception Types" section: subclassing `Error` (`class ValidationError extends Error`,
     calling `super(message)`, setting `this.name`), why `instanceof` checks against custom error classes are
     useful for handling different failure modes differently, and a worked example with a `try`/`catch` that
     branches on the caught error's type.
   - [x] Add an "Exceptions in Asynchronous JavaScript" section: `try`/`catch` around `await` (an awaited
     rejected promise throws at the `await` point, catchable exactly like a synchronous throw), `.catch()` on a
     promise chain, the interaction between `.then()`'s two-argument form and `.catch()`, and unhandled promise
     rejections (the `unhandledrejection` event in browsers). Include a worked example fetching from a REST API
     with both patterns (`try`/`catch` with `await`, and `.catch()` on the promise chain) — cross-reference
     `modules/ROOT/pages/web/javascript/async-javascript.adoc` for the broader async/await and promise mechanics
     this page assumes as background, rather than re-explaining them.
   - [x] Add a diagram showing exception propagation through nested `try`/`catch` (or up the call stack when
     uncaught) — default to mermaid; SVG fallback only if mermaid can't depict it clearly.
   - Created `exception-handling.adoc` (new page): `throw`/`try`/`catch`/`finally` mechanics, a mermaid
     propagation flowchart, Custom Exception Types, and Exceptions in Asynchronous JavaScript (`await`+`try`/
     `catch`, `.catch()` chains, `unhandledrejection`), cross-referencing `stdlib-dates-errors-json.adoc` and
     `async-javascript.adoc` rather than duplicating them.

9. [x] **Add SEO page metadata to the SQL Reference section**
   - [x] For each of the following files, add `:description:` (one real sentence summarizing that page's actual
     content) and `:keywords:` (a comma-separated list of terms actually relevant to that page) as document
     attributes directly under the `= Title` line: `aggregate-window-functions.adoc`, `cheat-sheet.adoc`,
     `dcl.adoc`, `ddl.adoc`, `dml-modifications.adoc`, `dml-queries.adoc`, `functions.adoc`, `index.adoc`,
     `json-xml-functions.adoc`, `relations.adoc`, `transactions.adoc`, `triggers-procedures.adoc`, and this
     plan's own new `normalization.adoc` (13 files total, all under `modules/ROOT/pages/sql/`).
   - All 13 SQL pages updated (dispatched to 3 sub-agents). Caught and fixed two systemic formatting bugs
     introduced by the sub-agents across all SEO batches: (1) a blank line left between the `= Title` line and
     `:description:` — this closes the AsciiDoc document header early, so Asciidoctor silently drops the
     attribute entirely (verified via `@asciidoctor/core`: `doc.getAttribute('description')` returned
     `undefined`) — fixed by removing that blank line on every affected file; (2) some files used a trailing
     `\` to wrap a long attribute value across lines, which Asciidoctor does not support for attribute entries
     (also silently dropped) — fixed by collapsing each onto a single line. Verified all 13 files now parse with
     both attributes present via a small Asciidoctor script.

10. [x] **Add SEO page metadata to the HTML & CSS Reference section**
    - [x] For each of the following 19 files under `modules/ROOT/pages/web/html-css/`, add `:description:`/
      `:keywords:` the same way: `animations.adoc`, `appendix-css-properties.adoc`, `appendix-html-elements.adoc`,
      `box-model.adoc`, `cheat-sheet.adoc`, `forms-accessibility-validation.adoc`, `forms.adoc`,
      `html-structure.adoc`, `index.adoc`, `layout.adoc`, `performance-build-optimization.adoc`,
      `performance-loading.adoc`, `positioning.adoc`, `selectors-specificity.adoc`, `seo.adoc`,
      `svg-styling-animation.adoc`, `theming.adoc`, `transitions.adoc`, `variables-media-queries.adoc`.
    - All 19 HTML/CSS pages updated (4 sub-agents), each verified via the Asciidoctor header-parsing check
      (both attributes present, no header-closed-early or line-wrap regressions).

11. [x] **Add SEO page metadata to the JavaScript Development section**
    - [x] For each of the following 37 files under `modules/ROOT/pages/web/javascript/` (the 35 existing pages
      plus this plan's two new pages), add `:description:`/`:keywords:` the same way: `arrays.adoc`,
      `async-javascript.adoc`, `browser-animations.adoc`, `browser-audio-video.adoc`, `browser-canvas-webgl.adoc`,
      `browser-css.adoc`, `browser-dom-basics.adoc`, `browser-events.adoc`, `browser-geometry-scrolling.adoc`,
      `browser-location-navigation-history.adoc`, `browser-networking.adoc`, `browser-storage.adoc`,
      `browser-web-components.adoc`, `browser-workers.adoc`, `cheat-sheet.adoc`, `classes.adoc`,
      `exception-handling.adoc`, `function-parameters-namespaces.adoc`, `functions-expressions-operators.adoc`,
      `index.adoc`, `iterators-generators.adoc`, `legacy-features.adoc`, `lexical-structure.adoc`, `modules.adoc`,
      `objects-destructuring.adoc`, `statements.adoc`, `stdlib-collections.adoc`, `stdlib-dates-errors-json.adoc`,
      `stdlib-intl.adoc`, `stdlib-metaprogramming.adoc`, `stdlib-regexp.adoc`, `stdlib-utilities.adoc`,
      `tooling-babel.adoc`, `tooling-bundling-npm-publishing.adoc`, `tooling-eslint-prettier.adoc`,
      `tooling-jest.adoc`, `types.adoc`.
    - All 37 JavaScript pages updated (8 sub-agents), each verified via the Asciidoctor header-parsing check.
      Final repo-wide check: all 71 target `.adoc` pages (13 SQL + 19 HTML/CSS + 37 JavaScript + 2 landing pages)
      now have both `:description:` and `:keywords:` recognized by Asciidoctor — 0 files failing.

12. [x] **Add SEO page metadata to the two landing pages**
    - [x] Add `:description:`/`:keywords:` to `modules/ROOT/pages/index.adoc` (the site's root landing/project
      picker page) and `modules/ROOT/pages/web/index.adoc` (the Web Development section landing page).
    - Both landing pages updated and verified (same header-blank-line fix applied as Task 9).

13. [x] **Final build verification**
    - [x] Delegate to a sub-agent (e.g. via `Agent({description: "Verify Antora build", prompt: "Invoke
      Skill({skill: \"build-docs\"}) ..."})` if a docs-build skill is installed, otherwise run `npx antora
      antora-playbook.yml` directly in an isolated context) to confirm the full site builds cleanly — no
      `xref`/AsciiDoc errors, particularly for the new pages' cross-references and nav entries, all new mermaid
      diagrams rendering, and every page's `:description:`/`:keywords:` attributes present — reporting back only
      a pass/fail summary and any error list. Fix any reported errors before considering this task complete.
    - Build verified clean via sub-agent: `npx antora antora-playbook.yml` exits 0 with no warn/error-level
      messages (only 2 pre-existing info-level notices in an unrelated remote content source). Both new-anchor
      xrefs (`types.adoc#_boolean_values`, `stdlib-dates-errors-json.adoc#_error_classes`) resolve correctly, all
      3 new nav.adoc entries point to pages that built successfully, all 4 mermaid diagrams (3 new + 1
      pre-existing) rendered without extension errors, and all 71/71 target pages carry both `:description:` and
      `:keywords:`. No fixes needed.

## Plan status: all 13 tasks complete.
