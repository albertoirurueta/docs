# Implementation Plan: Web Development / SASS Reference

## Task summary

Source: GitHub issue #17

Issue [#17](https://github.com/albertoirurueta/docs/issues/17) ("SASS Reference") asks to add a new **"SASS
Reference"** section under the existing **"Web Development"** section of this repo's own `ROOT` Antora
component, at `modules/ROOT/pages/web/sass/`, covering the SASS/SCSS CSS preprocessor: syntax (SCSS vs. Sass),
variables, nesting, partials/`@use`/`@forward`, mixins, functions, `@extend`, operators, control flow, lists/
maps, built-in modules, and compilation — with links to the official documentation
(https://sass-lang.com/), a bibliography citing that official page, optional mermaid diagrams/SVG figures where
they clarify a concept, and a one-page downloadable PDF cheat sheet. This is the same pattern already used for
the existing SQL Reference, HTML & CSS Reference, and JavaScript Development sections
([.archive/implementation_plan_3.md](.archive/implementation_plan_3.md),
[.archive/implementation_plan_7.md](.archive/implementation_plan_7.md),
[.archive/implementation_plan_15.md](.archive/implementation_plan_15.md) — the last of these, adding JavaScript
Development as a second sibling subsection of Web Development, is the closest and most direct precedent, since
this plan adds SASS Reference as a **third** sibling subsection the same way).

**Choices made on the user's behalf** (best-practice defaults, consistent with this repo's established pattern
for the SQL, HTML & CSS, and JavaScript reference sections — stated here so they can be challenged during
review):

- **One dedicated page per issue bullet** (12 pages, matching the issue's own 12 numbered topics 1–12) — flat
  file layout directly under `modules/ROOT/pages/web/sass/`, mirroring `web/html-css/` and `web/javascript/`.
  No topic in this issue is large enough to warrant a further split, unlike JavaScript's "Standard Library"
  bullet.
- **No single source book this time** — unlike the SQL/HTML-CSS/JavaScript sections (each grounded primarily in
  one reference book), issue #17 names only the official documentation site
  (https://sass-lang.com/) as the reference to cite, with no book supplied. Content is therefore written from
  general/AI knowledge of Dart Sass (the current official implementation) and must be verified against
  sass-lang.com — stated plainly in the new disclaimer partial (Task 1), the same way the existing disclaimers
  already flag AI-generated content.
- **"SASS Reference" is a third subsection of "Web Development"**, sibling to "HTML & CSS Reference" and
  "JavaScript Development" — matching the issue's framing ("Within documentation for web development... add a
  section for SASS CSS preprocessor"), the same way issue #15 added JavaScript Development as a sibling of HTML
  & CSS Reference rather than nesting it inside another section. Ordered directly after "HTML & CSS Reference"
  and before "JavaScript Development" in `nav.adoc`/`web/index.adoc`, since SASS is a CSS preprocessor and reads
  most naturally next to the CSS reference it extends.
- **Mermaid is the default; SVG is the fallback**, used only where mermaid genuinely cannot depict the concept —
  same convention as every existing section. Concretely: a mermaid diagram illustrating the source → Dart Sass
  compiler → CSS output pipeline (`compilation.adoc`) and one illustrating a `@use`/`@forward` module graph
  between partials (`partials-modules.adoc`) are worth adding; the remaining topics are primarily
  syntax/code-example driven and don't need one forced in.
- **`:description:`/`:keywords:` on every new page**, per the SEO-metadata convention already rolled out
  repo-wide in [.archive/implementation_plan_20260823190147.md](.archive/implementation_plan_20260823190147.md)
  (task 4 of that plan) — every existing page carries these AsciiDoc document attributes, rendered as `<meta>`
  tags by the custom UI bundle's `head-info.hbs` partial, so the new pages must too.
- **Cross-reference existing content, don't duplicate it**: `web/sass/nesting.adoc` should cross-reference
  `web/html-css/selectors-specificity.adoc`'s existing "Native CSS nesting" subsection (which already mentions
  "the way Sass has long allowed") rather than re-explaining native CSS nesting from scratch.
- **PDF cheat sheet generation approach**: same as every prior section — a hand-built, print-ready single-page
  HTML/CSS layout rendered to PDF via headless Chrome (`--headless --print-to-pdf`), saved as a static checked-in
  asset at `modules/ROOT/attachments/sass-cheat-sheet.pdf`, and linked from `cheat-sheet.adoc` via
  `xref:attachment$sass-cheat-sheet.pdf[Download the SASS Cheat Sheet (PDF)]` (the correct Antora attachment
  family/macro — `.archive/implementation_plan_3.md`'s notes record that an earlier attempt at
  `modules/ROOT/assets/attachment/` + the `attachment:` inline macro was wrong and had to be corrected; this
  plan uses the already-corrected path/macro from the start).
- **No project-picker icon/xref** for "SASS Reference" — like HTML & CSS and JavaScript, it lives under the root
  `index.adoc`'s `== Other` section, not as one of the remote-component picker tiles.

## Current code state

- This repo's Antora component is `ROOT` ([antora.yml](antora.yml)), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under `modules/ROOT/pages/`.
- **Web Development** (`modules/ROOT/pages/web/index.adoc`) currently lists two subsections: **HTML & CSS
  Reference** (`modules/ROOT/pages/web/html-css/*.adoc`, 19 pages) and **JavaScript Development**
  (`modules/ROOT/pages/web/javascript/*.adoc`, 35 pages). Both follow the identical structural pattern this plan
  reuses:
  - A `partial$<name>-disclaimer.adoc` (an `[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` at the top of every page in the section.
  - One `.adoc` page per topic, each with `:description:`/`:keywords:` attributes.
  - A section `index.adoc` linking every page with a one-line blurb, ending in a `== Bibliography` section.
  - A `cheat-sheet.adoc` linking back to every detail page and to a downloadable PDF via
    `xref:attachment$<name>-cheat-sheet.pdf[Download the ... Cheat Sheet (PDF)]`, with the actual file under
    `modules/ROOT/attachments/`.
  - `nav.adoc` lists `Web Development` (`*`) with each subsection (`**`) and its own detail pages (`***`).
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Other` section (line 77) lists
    Web Development, with its subsections nested one level under it.
  - No SASS/SCSS content exists anywhere in the repo today — the only mention is a passing reference in
    `modules/ROOT/pages/web/html-css/selectors-specificity.adoc:307` ("Nesting lets you group related selectors
    the way Sass has long allowed...") inside its "Native CSS nesting" subsection.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks) — the only diagram mechanism used anywhere in
  this repo's docs so far — and `@djencks/asciidoctor-mathjax` (unused by this ticket).
- **New page map** this plan creates under `modules/ROOT/pages/web/sass/` (all `.adoc` unless noted):
  - `syntax.adoc`, `variables.adoc`, `nesting.adoc`, `partials-modules.adoc`, `mixins.adoc`, `functions.adoc`,
    `extend.adoc`, `operators.adoc`, `control-flow.adoc`, `lists-maps.adoc`, `built-in-modules.adoc`,
    `compilation.adoc`.
  - `cheat-sheet.adoc` + `modules/ROOT/attachments/sass-cheat-sheet.pdf`.
  - `index.adoc` (section index, same role as `sql/index.adoc` / `web/html-css/index.adoc` /
    `web/javascript/index.adoc`).
  - Plus `modules/ROOT/partials/sass-disclaimer.adoc`, and updates to `modules/ROOT/pages/web/index.adoc`,
    `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task, nothing else in this plan can safely include it before it exists)

- [x] Task 1. Create the SASS disclaimer partial — created `modules/ROOT/partials/sass-disclaimer.adoc`
  (no tests/coverage apply: AsciiDoc content, verified by the Task 18 Antora build gate).
  - [x] Task 1.1. Create `modules/ROOT/partials/sass-disclaimer.adoc`, an `[IMPORTANT]` admonition following the
    structure of `modules/ROOT/partials/javascript-disclaimer.adoc`: state that this section documents **Sass/
    SCSS as implemented by Dart Sass** (the current official compiler) — not tied to any specific book or
    framework — that the content was generated with the assistance of AI, and that it should be verified against
    the current official documentation at https://sass-lang.com/documentation/[sass-lang.com] before relying on
    it in production, since Sass features continue to evolve (e.g. the `@import` deprecation in favor of `@use`/
    `@forward`).

### Group 2 — Content pages (all issue topics 1–12)

**Parallelizable: yes** (12 independent pages; each includes the Group 1 disclaimer partial but doesn't depend
on any other page in this group)

- [x] Task 2. Create `modules/ROOT/pages/web/sass/syntax.adoc` — Syntax: SCSS vs. Sass
  - Include the disclaimer partial and `:description:`/`:keywords:` attributes.
  - Cover: the two syntaxes Dart Sass accepts — SCSS (`.scss`, curly braces `{}`, semicolons `;`, a superset of
    CSS syntax) vs. the indented Sass syntax (`.sass`, no braces/semicolons, indentation-significant) — with a
    side-by-side example of the same stylesheet written both ways, and when each is typically preferred (SCSS is
    the default/most common in practice; note this explicitly).
- [x] Task 3. Create `modules/ROOT/pages/web/sass/variables.adoc` — Variables
  - Cover: `$name: value;` declaration syntax, variable scoping (global vs. local, the `!global` flag), default
    values via `!default`, and typical uses (colors, sizes, fonts) with worked examples.
- [x] Task 4. Create `modules/ROOT/pages/web/sass/nesting.adoc` — Nesting (includes the selector-flattening
  mermaid diagram and the native-CSS-nesting cross-reference)
  - Cover: nested selectors mirroring HTML hierarchy, the `&` parent-selector reference (including pseudo-class/
    element nesting like `&:hover`, `&::before`, and compound-selector patterns like `&.active`), and nested
    property syntax (e.g. `font: { weight: bold; size: 2em; }`).
  - Cross-reference `xref:web/html-css/selectors-specificity.adoc[]`'s existing "Native CSS nesting" subsection —
    note briefly how Sass nesting compares to (and predates) native CSS nesting, without re-explaining native CSS
    nesting in full here.
  - A short mermaid diagram (nested selector tree → flattened CSS selectors) is a good candidate here if it aids
    clarity; use judgment during writing.
- [x] Task 5. Create `modules/ROOT/pages/web/sass/partials-modules.adoc` — Partials and Modules (`@use` /
  `@forward`) (includes the module-graph mermaid diagram and the `@import` deprecation comparison table)
  - Cover: partial files (`_name.scss`, not compiled on their own), `@use` as the modern way to load a module
    (namespacing rules, `as`/`*` aliasing, `with` for configuring `!default` variables), `@forward` for
    re-exporting one module's rules through another (including `show`/`hide` and prefixing), and an explicit note
    that `@import` is deprecated in favor of `@use`/`@forward`.
  - Add a mermaid diagram illustrating a small module graph (e.g. an entry stylesheet `@use`-ing two partials,
    one of which `@forward`s a shared partial) — this is a good candidate for a diagram since the relationship
    between multiple files is otherwise hard to follow in prose.
- [x] Task 6. Create `modules/ROOT/pages/web/sass/mixins.adoc` — Mixins
  - Cover: `@mixin` definition, `@include` usage, arguments (positional and named), default argument values,
    variable-length argument lists (`$args...`), and passing content blocks via `@content`.
- [x] Task 7. Create `modules/ROOT/pages/web/sass/functions.adoc` — Functions
  - Cover: user-defined functions via `@function` / `@return`, arguments (including defaults), and how they
    differ from mixins (return a value vs. emit styles). Note that Sass also ships built-in functions across
    several categories, and cross-reference `xref:web/sass/built-in-modules.adoc[]` for those rather than
    listing them here.
- [x] Task 8. Create `modules/ROOT/pages/web/sass/extend.adoc` — Selector Inheritance (`@extend`)
  - Cover: `@extend` syntax, how it merges selectors at compile time (vs. a mixin's copy-the-declarations
    approach — a short comparison table is useful here), placeholder selectors (`%placeholder`) as the
    recommended `@extend` target, and caveats (extending across media queries, selector bloat).
- [x] Task 9. Create `modules/ROOT/pages/web/sass/operators.adoc` — Operators
  - Cover: arithmetic operators (`+ - * / %`, including the modern `math.div()`/`/`-as-division-operator
    nuance in current Dart Sass), comparison operators (`== != < > <= >=`), and boolean operators (`and or not`)
    used directly in property values and control-flow conditions.
- [x] Task 10. Create `modules/ROOT/pages/web/sass/control-flow.adoc` — Control Flow
  - Cover: `@if`/`@else if`/`@else`, `@for` (`through` vs. `to`), `@each` (over lists and maps, including
    multiple-variable destructuring), and `@while`, each with a worked example (e.g. generating a set of utility
    classes with `@each`).
- [x] Task 11. Create `modules/ROOT/pages/web/sass/lists-maps.adoc` — Lists and Maps
  - Cover: lists (comma- or space-separated, indexing, common list functions), and maps (`$map: (key: value,
    ...)` syntax, key/value access, common map functions), with a realistic example of each (e.g. a breakpoints
    map used for a responsive mixin).
- [x] Task 12. Create `modules/ROOT/pages/web/sass/built-in-modules.adoc` — Built-in Modules
  - Cover: loading built-in modules via `@use "sass:math"`, `sass:color`, `sass:list`, `sass:map`, `sass:string`
    (and briefly `sass:meta`), with a short table of the most commonly used function per module (e.g.
    `math.div()`, `color.adjust()`, `list.append()`, `map.get()`, `string.quote()`).
- [x] Task 13. Create `modules/ROOT/pages/web/sass/compilation.adoc` — Compilation
  - Cover: Sass is not interpreted directly by the browser and must be compiled to plain CSS; Dart Sass as the
    current official/actively maintained implementation (note LibSass/Ruby Sass are deprecated/EOL); compilation
    paths — the `sass` CLI, bundler integrations (Webpack's `sass-loader`, Vite's built-in Sass support), and
    editor/IDE extensions with Sass compile-on-save.
  - Add a mermaid diagram showing the compilation pipeline: `.scss`/`.sass` source → Dart Sass compiler → plain
    `.css` output, branching to show the CLI/bundler/editor-extension entry points feeding the same compiler.

### Group 3 — Cheat sheet

**Parallelizable: yes** (single task, but depends on every page from Group 2 existing so it can link to and
summarize all of them)

- [x] Task 14. Add the one-page SASS cheat sheet (PDF) and its documentation page — rendered to a verified
  single A4 page (595x842pt) via headless Chrome; asset at `modules/ROOT/attachments/sass-cheat-sheet.pdf`,
  page at `modules/ROOT/pages/web/sass/cheat-sheet.adoc`.
  - [x] Task 14.1. Design a single-page, print-ready HTML/CSS layout (as a scratch file, e.g. under the session
    scratchpad) summarizing the most-used essentials from Tasks 2–13 — one compact, color-coded box per topic
    group (e.g. Syntax, Variables, Nesting, Partials/Modules, Mixins & Functions, `@extend`, Operators, Control
    Flow, Lists & Maps, Built-in Modules, Compilation) — sized to fit one A4/Letter page.
  - [x] Task 14.2. Render that HTML layout to a single-page PDF via headless Chrome
    (`--headless --print-to-pdf`) and save it as `modules/ROOT/attachments/sass-cheat-sheet.pdf`.
  - [x] Task 14.3. Verify the rendered PDF is exactly one page and visually legible (check page count and render
    a preview) before committing it.
  - [x] Task 14.4. Create `modules/ROOT/pages/web/sass/cheat-sheet.adoc`: include the disclaimer partial,
    `:description:`/`:keywords:` attributes, a short intro, `xref:` links to every page from Tasks 2–13, and
    `xref:attachment$sass-cheat-sheet.pdf[Download the SASS Cheat Sheet (PDF)]` linking the asset from Task 14.2
    (this is the correct Antora attachment macro/path — see the "Choices made on the user's behalf" note above).

### Group 4 — Section index, nav wiring, and final verification

**Parallelizable: no** — Task 15 (section index) depends on every page from Groups 2–3 existing to link to;
Task 16 (`web/index.adoc` update) and Task 17 (nav/root-index wiring) both depend on Task 15 existing; Task 18
(build verification) depends on Tasks 15–17 being in place.

- [x] Task 15. Create `modules/ROOT/pages/web/sass/index.adoc` — SASS Reference landing page
  - Include the disclaimer partial and `:description:`/`:keywords:` attributes.
  - A short intro paragraph, then a `== What's covered` list with one `xref:` bullet + one-line blurb per page
    from Tasks 2–14 (matching the style of `modules/ROOT/pages/web/html-css/index.adoc`'s `== What's covered`
    list), then a `== Bibliography` section citing
    https://sass-lang.com/[the official Sass documentation] as the primary reference (matching the citation
    style of the MDN entry in `web/html-css/index.adoc`'s own Bibliography).
- [x] Task 16. Update `modules/ROOT/pages/web/index.adoc` — add SASS Reference as a third `== Sections` bullet,
  positioned between the existing HTML & CSS Reference and JavaScript Development bullets, with a one-line blurb
  mirroring the style of the other two (e.g. "...the SASS/SCSS CSS preprocessor: syntax, variables, nesting,
  mixins, functions, and modules, plus a downloadable cheat sheet.").
- [x] Task 17. Wire the new section into navigation
  - [x] Task 17.1. Add a new nested entry to `modules/ROOT/nav.adoc`, positioned between the existing
    `HTML & CSS Reference` (`**`) block and the `JavaScript Development` (`**`) block:
    ```adoc
    ** xref:web/sass/index.adoc[SASS Reference]
    *** xref:web/sass/syntax.adoc[Syntax: SCSS vs. Sass]
    *** xref:web/sass/variables.adoc[Variables]
    *** xref:web/sass/nesting.adoc[Nesting]
    *** xref:web/sass/partials-modules.adoc[Partials & Modules]
    *** xref:web/sass/mixins.adoc[Mixins]
    *** xref:web/sass/functions.adoc[Functions]
    *** xref:web/sass/extend.adoc[Selector Inheritance (@extend)]
    *** xref:web/sass/operators.adoc[Operators]
    *** xref:web/sass/control-flow.adoc[Control Flow]
    *** xref:web/sass/lists-maps.adoc[Lists & Maps]
    *** xref:web/sass/built-in-modules.adoc[Built-in Modules]
    *** xref:web/sass/compilation.adoc[Compilation]
    *** xref:web/sass/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```
  - [x] Task 17.2. **Plan correction.** This sub-task asserted that no per-subsection edit was needed in
    `modules/ROOT/pages/index.adoc` "matching how JavaScript Development required none either" — but that
    premise is factually wrong: the root `index.adoc`'s `== Other` section *does* carry a `**` bullet for
    JavaScript Development (and for HTML & CSS Reference) nested under Web Development, exactly as the
    plan's own "Current code state" section records at line 79-80. Followed the real precedent instead and
    added a matching `**` bullet for SASS Reference between the HTML & CSS and JavaScript ones; skipping it
    would have left SASS as the only Web Development subsection missing from the site's landing page.
- [x] Task 18. Delegate the full-site build check to the `iru-gate-runner` agent rather than running it inline
  (per this repo's only verification convention):
  ```
  Agent({
    description: "Build and verify the Antora docs site",
    subagent_type: "iru-gate-runner",
    prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site. Report back:
      whether the build completed with no xref/AsciiDoc errors, whether every new page under
      modules/ROOT/pages/web/sass/ rendered into build/site, whether the new 'SASS Reference' nav section
      appears correctly nested between HTML & CSS Reference and JavaScript Development (including all its
      detail-page entries), whether every mermaid diagram added in Group 2 renders, and whether the cheat
      sheet page's attachment link resolves to an actual downloadable sass-cheat-sheet.pdf under the generated
      site output."
  })
  ```
  - If the agent reports any xref/build error, missing render, or broken/missing attachment link, fix the
    offending page/nav entry/asset path and re-run this task until the build is clean.

  - **Result:** build passed with exit code 0 and an empty log — zero xref/AsciiDoc errors or warnings, and 0
    unresolved xrefs site-wide. All 14 `web/sass/` pages rendered into `build/site/web/sass/`. `SASS Reference`
    appears at nav depth 2 immediately between `HTML & CSS Reference` and `JavaScript Development`, with all 13
    detail entries nested at depth 3 in source order. All 3 mermaid blocks (`nesting`, `partials-modules`,
    `compilation`) emitted `<div class="mermaid content">` with the init script wired on every page. The cheat
    sheet macro resolves to `build/site/_attachments/sass-cheat-sheet.pdf` (258,996 bytes, valid PDF, 1 page).
