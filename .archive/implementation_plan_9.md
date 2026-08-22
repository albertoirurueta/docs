# Implementation Plan: Add official-documentation links to the HTML & CSS appendix pages

## Task summary

Source: GitHub issue #9

Issue [#9](https://github.com/albertoirurueta/docs/issues/9) ("Add links to Official standard documentation for
HTML and CSS reference") asks that the two existing appendix pages under the Web Development / HTML & CSS
Reference section — `appendix-html-elements.adoc` and `appendix-css-properties.adoc` — link out to official
documentation for every HTML element and CSS property they document, since today they only link once, generically,
to MDN's top-level HTML/CSS reference index near the top of each page. The issue names MDN (per-element/
per-property pages) as the primary source, and the WHATWG HTML Living Standard / W3C CSS specs as more
authoritative but less readable alternatives.

**Choices made on the user's behalf** (nothing in the issue is genuinely ambiguous enough to block on, but the
exact placement/format of links is an implementation detail the issue leaves open):

- **Per-item link → MDN only.** Every documented HTML element and CSS property gets one MDN link, added right
  after its subsection heading, in a `MDN reference: ...` line. Adding a WHATWG/W3C spec link to all ~60 items
  as well would add a lot of near-duplicate noise for comparatively little reader value.
- **Spec links (WHATWG HTML / W3C CSS) → page intro only.** Each page's existing intro paragraph (which already
  links the generic MDN reference) gets one additional sentence linking the relevant living-standard/spec index,
  satisfying the issue's mention of those sources without repeating them per item.
- **Link format**: `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/<tag>[\`<tag>\`]` for elements and
  `https://developer.mozilla.org/en-US/docs/Web/CSS/<property>[\`<property>\`]` for properties — matching the
  `/Web/HTML/Element` and `/Web/CSS` URL prefixes the pages' own existing top-of-page links already use, with the
  link text kept in monospace (backticks) to match how element/property names are already styled everywhere else
  in these pages. A heading covering multiple elements/properties (e.g. "strong and em") gets one link per name,
  comma-separated.
- **No change to `modules/ROOT/partials/html-css-disclaimer.adoc`** — it already tells readers to verify content
  against MDN/caniuse.com; the per-item and per-page links this plan adds are additive, not a replacement for
  that disclaimer.

## Current code state

- Both target pages live under `modules/ROOT/pages/web/html-css/` and already include
  `partial$html-css-disclaimer.adoc` at the top ([modules/ROOT/partials/html-css-disclaimer.adoc](modules/ROOT/partials/html-css-disclaimer.adoc)).
- [modules/ROOT/pages/web/html-css/appendix-html-elements.adoc](modules/ROOT/pages/web/html-css/appendix-html-elements.adoc) —
  intro paragraph (lines 5-8) links only `https://developer.mozilla.org/en-US/docs/Web/HTML/Element[MDN's HTML
  element reference]`. It documents 21 `===` subsections (37 individual elements) across 4 `==` sections:
  Text-level semantics, Lists, Tables, Embedded content and media, Interactive and miscellaneous elements. Each
  subsection currently opens directly with a descriptive paragraph, immediately followed by a `[source,html]`
  example block — no per-element link exists anywhere in the body.
- [modules/ROOT/pages/web/html-css/appendix-css-properties.adoc](modules/ROOT/pages/web/html-css/appendix-css-properties.adoc) —
  intro paragraph (lines 5-15) links only `https://developer.mozilla.org/en-US/docs/Web/CSS[MDN's CSS
  reference]`. It documents 23 `===` subsections (23 properties, one per subsection) across 6 `==` sections:
  Typography, Color and background, Borders and visual effects, Display and overflow, Lists, Miscellaneous. Same
  structure: descriptive paragraph then `[source,css]` block, no per-property link.
- These are the same two pages created by `.archive/implementation_plan_7.md` (issue #7); no other archived plan
  is relevant to this change.
- This repo has no application code — `implementation_plan.md`'s tasks below are plain AsciiDoc content edits,
  untagged with any language/framework key (none of the installed `*-code-one-task` skills — `java`, `dotnet`,
  `database` — apply to Antora/AsciiDoc content), so `iru-code` implements them directly rather than dispatching
  to a language-specific skill.

## Implementation steps

### Group 1 — Edit the two appendix pages

**Parallelizable: yes** (Task 1 and Task 2 touch entirely separate files with no shared state)

- [x] Task 1. Add per-element MDN links and a WHATWG spec intro link to `appendix-html-elements.adoc`
  - [x] Task 1.1. In the intro paragraph (lines 5-8), append a new sentence after the existing MDN-link
    sentence: `For the authoritative (if less readable) specification, see the
    https://html.spec.whatwg.org/[WHATWG HTML Living Standard].`
  - [x] Task 1.2. Immediately below each `===` subsection heading, before its descriptive paragraph, insert one
    `MDN reference: ...` line per the mapping below (a blank line before and after, per this file's existing
    AsciiDoc block spacing). Every element name link uses
    `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/<tag>[\`<tag>\`]`; multi-element headings get
    one comma-separated link per element, in heading order:

    | Section | Heading | `MDN reference:` line |
    |---|---|---|
    | Text-level semantics | `strong and em` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong[\`<strong>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em[\`<em>\`]` |
    | Text-level semantics | `mark` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark[\`<mark>\`]` |
    | Text-level semantics | `time` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time[\`<time>\`]` |
    | Text-level semantics | `abbr` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/abbr[\`<abbr>\`]` |
    | Text-level semantics | `code` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code[\`<code>\`]` |
    | Text-level semantics | `small` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small[\`<small>\`]` |
    | Text-level semantics | `sub and sup` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub[\`<sub>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup[\`<sup>\`]` |
    | Lists | `ul, ol, and li` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul[\`<ul>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol[\`<ol>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li[\`<li>\`]` |
    | Lists | `dl, dt, and dd` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl[\`<dl>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt[\`<dt>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd[\`<dd>\`]` |
    | Tables | `table, thead, tbody, and tfoot` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table[\`<table>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead[\`<thead>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody[\`<tbody>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot[\`<tfoot>\`]` |
    | Tables | `tr, th, and td` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr[\`<tr>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th[\`<th>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td[\`<td>\`]` |
    | Tables | `colgroup and col` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup[\`<colgroup>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col[\`<col>\`]` |
    | Embedded content and media | `img` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img[\`<img>\`]` |
    | Embedded content and media | `picture and source` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture[\`<picture>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source[\`<source>\`]` |
    | Embedded content and media | `video and audio` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video[\`<video>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio[\`<audio>\`]` |
    | Embedded content and media | `iframe` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe[\`<iframe>\`]` |
    | Embedded content and media | `embed and object` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed[\`<embed>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object[\`<object>\`]` |
    | Interactive and miscellaneous elements | `details and summary` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details[\`<details>\`], https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary[\`<summary>\`]` |
    | Interactive and miscellaneous elements | `dialog` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog[\`<dialog>\`]` |
    | Interactive and miscellaneous elements | `template` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template[\`<template>\`]` |
    | Interactive and miscellaneous elements | `canvas` | `https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas[\`<canvas>\`]` |
  - [x] Task 1.3. Re-read the full file after editing to confirm every `===` subsection now has a `MDN
    reference:` line and that no existing content (descriptions, `xref:` cross-references, code blocks) was
    altered.
  - [x] Files touched: `modules/ROOT/pages/web/html-css/appendix-html-elements.adoc` — added one intro
    sentence linking the WHATWG HTML Living Standard, and one `MDN reference:` line per all 21 `===`
    subsections (37 elements). No content-quality tooling applies to this repo (plain AsciiDoc docs, no
    language/framework key).

- [x] Task 2. Add per-property MDN links and a W3C/WHATWG spec intro link to `appendix-css-properties.adoc`
  - [x] Task 2.1. In the intro paragraph (lines 5-15), append a new sentence after the existing MDN-link
    sentence: `For the authoritative specifications, see the
    https://www.w3.org/Style/CSS/specs.html[W3C/WHATWG CSS specifications].`
  - [x] Task 2.2. Immediately below each `===` subsection heading, before its descriptive paragraph, insert one
    `MDN reference: ...` line per the mapping below, using
    `https://developer.mozilla.org/en-US/docs/Web/CSS/<property>[\`<property>\`]`:

    | Section | Heading | `MDN reference:` line |
    |---|---|---|
    | Typography | `font-family` | `https://developer.mozilla.org/en-US/docs/Web/CSS/font-family[\`font-family\`]` |
    | Typography | `font-size` | `https://developer.mozilla.org/en-US/docs/Web/CSS/font-size[\`font-size\`]` |
    | Typography | `font-weight` | `https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight[\`font-weight\`]` |
    | Typography | `line-height` | `https://developer.mozilla.org/en-US/docs/Web/CSS/line-height[\`line-height\`]` |
    | Typography | `text-align` | `https://developer.mozilla.org/en-US/docs/Web/CSS/text-align[\`text-align\`]` |
    | Typography | `text-decoration` | `https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration[\`text-decoration\`]` |
    | Typography | `text-transform` | `https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform[\`text-transform\`]` |
    | Typography | `letter-spacing` | `https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing[\`letter-spacing\`]` |
    | Color and background | `background-color` | `https://developer.mozilla.org/en-US/docs/Web/CSS/background-color[\`background-color\`]` |
    | Color and background | `background-image` | `https://developer.mozilla.org/en-US/docs/Web/CSS/background-image[\`background-image\`]` |
    | Color and background | `background-position` | `https://developer.mozilla.org/en-US/docs/Web/CSS/background-position[\`background-position\`]` |
    | Color and background | `background-size` | `https://developer.mozilla.org/en-US/docs/Web/CSS/background-size[\`background-size\`]` |
    | Color and background | `background-repeat` | `https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat[\`background-repeat\`]` |
    | Color and background | `opacity` | `https://developer.mozilla.org/en-US/docs/Web/CSS/opacity[\`opacity\`]` |
    | Borders and visual effects | `border-radius` | `https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius[\`border-radius\`]` |
    | Borders and visual effects | `box-shadow` | `https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow[\`box-shadow\`]` |
    | Borders and visual effects | `outline` | `https://developer.mozilla.org/en-US/docs/Web/CSS/outline[\`outline\`]` |
    | Borders and visual effects | `filter` | `https://developer.mozilla.org/en-US/docs/Web/CSS/filter[\`filter\`]` |
    | Display and overflow | `display (values overview)` | `https://developer.mozilla.org/en-US/docs/Web/CSS/display[\`display\`]` |
    | Display and overflow | `visibility` | `https://developer.mozilla.org/en-US/docs/Web/CSS/visibility[\`visibility\`]` |
    | Display and overflow | `overflow` | `https://developer.mozilla.org/en-US/docs/Web/CSS/overflow[\`overflow\`]` |
    | Lists | `list-style` | `https://developer.mozilla.org/en-US/docs/Web/CSS/list-style[\`list-style\`]` |
    | Miscellaneous | `cursor` | `https://developer.mozilla.org/en-US/docs/Web/CSS/cursor[\`cursor\`]` |
  - [x] Task 2.3. Re-read the full file after editing to confirm every `===` subsection now has a `MDN
    reference:` line and that no existing content was altered.
  - [x] Files touched: `modules/ROOT/pages/web/html-css/appendix-css-properties.adoc` — added one intro
    sentence linking the W3C/WHATWG CSS specifications, and one `MDN reference:` line per all 23 `===`
    subsections (23 properties). No content-quality tooling applies to this repo (plain AsciiDoc docs, no
    language/framework key).

### Group 2 — Verify the site still builds

**Parallelizable: yes** (single task)

- [x] Task 3. Verify the Antora build still completes cleanly with the new links (no `xref`/AsciiDoc syntax
  errors introduced by the inserted lines — e.g. unescaped `<`/`>` inside link text breaking parsing). Delegate
  this to a sub-agent rather than running it inline:
  ```
  Agent({
    description: "Verify Antora docs build after adding MDN links",
    subagent_type: "iru-gate-runner",
    prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site and report back
      only whether the build succeeded, and the exact error output if it did not."
  })
  ```
  If the build fails, fix the reported AsciiDoc syntax issue in the offending file and re-run this task before
  checking it off.
