# Implementation Plan: Web Development / jQuery Reference

## Task summary

Source: GitHub issue #25

Issue [#25](https://github.com/albertoirurueta/docs/issues/25) ("jQuery Reference") asks to add a new
**"jQuery Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/jquery/` — a fifth sibling of
`web/html-css/`, `web/sass/`, `web/javascript/`, and `web/bootstrap/`. It covers the jQuery library
(https://jquery.com/): getting started, selectors, traversal & chaining, DOM manipulation, CSS/classes/
attributes/dimensions, effects & animation, event handling, element data & utility functions, AJAX, and
plugins/modern usage — plus an optional worked mini-project. Explanations must be brief and example-driven,
with `[mermaid]` diagrams and/or inline SVG figures where they clarify a concept. It also asks for: a
bibliography, a one-page downloadable PDF cheat sheet, and a "book review questions" page transcribing **every**
multiple-choice question from the reference book, each validated against authoritative jQuery knowledge with a
clearly marked correction where the book is wrong, plus a downloadable PDF of those questions/answers.

The primary reference book is the PDF at `~/Desktop/book.pdf`: *Ultimate Modern jQuery for Web App
Development*, Laurence Svekis, 2024, published by **Orange Education Pvt Ltd** under the **AVA™** label
(ISBN-13 978-81-97081-94-1 print / 978-81-97081-99-6 ebook). Publisher site: https://orangeava.com/ ; book
page: https://orangeava.com/products/ultimate-modern-jquery-for-web-app-development .

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, and Bootstrap reference
sections. The closest and most direct precedent is
[.archive/implementation_plan_19.md](.archive/implementation_plan_19.md) (issue #19, "Bootstrap Reference"):
a new sibling subsection of Web Development grounded in an official site plus a reference book, with mermaid
diagrams, hand-authored SVG figures, a `== Bibliography`, and a headless-Chrome-rendered one-page PDF cheat
sheet. [.archive/implementation_plan_15.md](.archive/implementation_plan_15.md) (issue #15, "JavaScript
Development") is the precedent for the book-grounded disclaimer wording and the bibliography format.

**Choices made on the user's behalf** (best-practice defaults consistent with this repo's established pattern
— stated here so they can be challenged during review):

- **Documenting jQuery 3.x** (the current major line). No specific patch version is pinned; the disclaimer
  (Task 1) points readers at https://api.jquery.com/ to check current specifics, and every page notes the
  modern native equivalent (`querySelectorAll`, `classList`, `fetch`, `addEventListener`, …) as the issue
  requests.
- **Page breakdown follows the issue's own topic list roughly 1:1** — 10 concept pages plus one optional
  worked-example page (`interactive-list-project.adoc`, included: it mirrors book ch. 6, ties the concepts
  together, and is low cost). The issue's grouping is already granular enough that no further splitting is
  warranted (unlike the Bootstrap section, whose "Content Basics"/"Components" bullets each bundled many
  distinct topics).
- **The subsection is named "jQuery Reference"** in the section index title, the `web/index.adoc` bullet, the
  `nav.adoc` `**` entry, and the root `index.adoc` bullet — matching the four existing siblings ("HTML & CSS
  Reference", "Sass Reference", "JavaScript Development", "Bootstrap Reference") rather than the bare "jQuery"
  the issue body used in one spot.
- **Placed last**, after Bootstrap Reference, in `nav.adoc`, `web/index.adoc`, and the root `index.adoc` — the
  same "append in the order added" ordering every prior subsection followed.
- **Mermaid is the default for concept diagrams; one SVG figure** (`jquery-dimensions.svg`, the
  `width`/`innerWidth`/`outerWidth`/`outerWidth(true)` box overlay) where a visual overlay is genuinely
  clearer than a flowchart. Mermaid covers: DOM-traversal relationships (ancestors/descendants/siblings),
  event bubbling up the ancestor chain, the per-element effects queue, and the AJAX request lifecycle
  sequence. The implementer may add further small SVGs under `modules/ROOT/images/` if one turns out to add
  real value while writing a page, following the existing `*.svg` convention — not pre-planned as separate
  tasks.
- **Cross-reference existing pages instead of duplicating them**: the AJAX page links
  `xref:web/cors.adoc[]` for cross-origin behavior; the events page links
  `xref:web/javascript/browser-events.adoc[]` for the underlying capture/target/bubble model and native
  `addEventListener`; the AJAX page links `xref:web/javascript/browser-networking.adoc[]` for `fetch()`; the
  getting-started / DOM-manipulation / plugins pages link `xref:web/javascript/browser-dom-basics.adoc[]` for
  the native DOM equivalents.
- **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
  layout rendered to PDF via headless Chrome (`--headless --print-to-pdf`), saved as a static checked-in asset
  under `modules/ROOT/attachments/`, and linked via `xref:attachment$<name>.pdf[Download …]`. The cheat sheet
  must be exactly one page; the quiz PDF may run to several pages (the issue explicitly relaxes the one-page
  constraint for it).
- **No project-picker icon/xref** for jQuery Reference — like the other four Web Development subsections it
  lives only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker
  tile.

## Current code state

- This repo has no application source code — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no
  lint/test suite). No `*-code-one-task` skill applies — every task below is AsciiDoc/HTML/PDF content,
  implemented directly and left untagged.
- **Web Development** (`modules/ROOT/pages/web/index.adoc`) currently lists two standalone pages
  (`web/cors.adoc`, `web/accessibility.adoc`) then four subsections: **HTML & CSS Reference**
  (`web/html-css/*.adoc`), **Sass Reference** (`web/sass/*.adoc`), **JavaScript Development**
  (`web/javascript/*.adoc`), **Bootstrap Reference** (`web/bootstrap/*.adoc`). All four subsections follow
  the identical structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (an `[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. `javascript-disclaimer.adoc` and `html-css-disclaimer.adoc` name a primary
    book; `sass-`/`bootstrap-disclaimer.adoc` are "no single book". jQuery has a primary book → follow the
    JavaScript pattern.
  - One `.adoc` page per topic, each with `:description:` / `:keywords:` attributes.
  - A section `index.adoc` linking every page with a one-line blurb, ending in a `== Bibliography` section
    (see `modules/ROOT/pages/web/javascript/index.adoc` for the exact bibliography format).
  - A `cheat-sheet.adoc` including the disclaimer, a short summary, `xref:` links back to every detail page,
    and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the actual PDF under
    `modules/ROOT/attachments/` (existing: `html-css-cheat-sheet.pdf`, `sass-cheat-sheet.pdf`,
    `javascript-cheat-sheet.pdf`, `bootstrap-cheat-sheet.pdf`, `sql-cheat-sheet.pdf`).
  - `nav.adoc` lists `Web Development` (`**` under `* Guides & References`) with each subsection (`***`) and
    its own detail pages (`****`).
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References`
    section (around lines 85-95) lists Web Development with its subsections nested one level under it (`**`).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml):
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only
  diagram mechanism used in this repo, ~20 existing usages e.g. `web/cors.adoc`,
  `web/javascript/browser-events.adoc`), `@djencks/asciidoctor-mathjax` (unused here).
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` Task 27): inline `{foo}` text *outside*
  `[source]` blocks is parsed as an Antora attribute reference and emits a "skipping reference to missing
  attribute" build warning. Escape any such literal braces in prose as `\{foo}` (e.g. when mentioning
  `\{duration: 400}` or `\{opacity: 0.5}` outside a code block). Inside `[source,...]` blocks no escaping is
  needed.
- **Reference book text**: `~/Desktop/book.pdf` (238 pp., 12 chapters). Chapter-end multiple-choice quizzes
  appear at the end of chapters 3, 4, 5, 6, 7, 8, 9, 11, and 12, plus a final book-wide quiz near the end
  (chapters 1, 2, and 10 have none) — roughly 45-55 questions total. The chapter-5 answer key is mis-lettered
  in the book (`a. a) …` / `b. b) …` / `c. a) …` instead of `1. / 2. / 3.`).
- **New page map** this plan creates under `modules/ROOT/pages/web/jquery/` (all `.adoc`):
  `getting-started.adoc`, `selectors.adoc`, `traversal-and-chaining.adoc`, `dom-manipulation.adoc`,
  `css-attributes-dimensions.adoc`, `effects-and-animation.adoc`, `events.adoc`, `data-and-utilities.adoc`,
  `ajax.adoc`, `plugins-and-modern-usage.adoc`, `interactive-list-project.adoc`, `cheat-sheet.adoc`,
  `quiz.adoc`, `index.adoc` (14 pages). Plus `modules/ROOT/partials/jquery-disclaimer.adoc`,
  `modules/ROOT/images/jquery-dimensions.svg`, `modules/ROOT/attachments/jquery-cheat-sheet.pdf`,
  `modules/ROOT/attachments/jquery-quiz.pdf`, and updates to `modules/ROOT/pages/web/index.adoc`,
  `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; nothing else in this plan can safely include it before it exists).

- [x] Task 1. Create the jQuery disclaimer partial — `modules/ROOT/partials/jquery-disclaimer.adoc`
  - Created `modules/ROOT/partials/jquery-disclaimer.adoc` (`[IMPORTANT]` admonition; jQuery 3.x; primary book cited; AI-assisted note; points at api.jquery.com; legacy-leaning / prefer-native note). No tests apply (AsciiDoc content); verified by the Task 18 Antora build.
  - [x] Task 1.1. Create `modules/ROOT/partials/jquery-disclaimer.adoc`, an `[IMPORTANT]` admonition
    following the shape of `modules/ROOT/partials/javascript-disclaimer.adoc`: state that this section
    documents **jQuery 3.x**, that it was built primarily from *"Ultimate Modern jQuery for Web App
    Development"* (Laurence Svekis, Orange Education / AVA™, 2024) plus general and official jQuery
    documentation where the book didn't cover a topic, that it was generated with AI assistance, and that it
    should be verified against https://api.jquery.com/[the official jQuery API reference] before being relied
    on in production. Add a sentence noting jQuery is legacy-leaning and that modern native DOM/`fetch` APIs
    are usually preferable for new work.

### Group 2 — Content pages

**Parallelizable: yes** — 11 independent pages. Each includes the Group 1 disclaimer partial and may
cross-reference existing `web/**` pages, but none depends on another new page in this plan. Each page uses the
standard header block (`= Title`, `:description:`, `:keywords:`, then
`include::partial$jquery-disclaimer.adoc[]`), keeps explanations brief, and gives at least one runnable
`[source,html]` / `[source,javascript]` example per concept. Every page ends with a short "Modern equivalent"
note pointing at the native API and, where relevant, `xref:web/javascript/…`.

- [x] Task 2. Create `modules/ROOT/pages/web/jquery/getting-started.adoc` (book ch. 1)
  - Created `modules/ROOT/pages/web/jquery/getting-started.adoc`. SRI `integrity` shown as `sha256-...` placeholder (not a literal high-entropy hash) to avoid introducing a detect-secrets finding; reader is told to copy the real value from releases.jquery.com. Verified by Task 18 build.
  - [x] Task 2.1. Cover: what jQuery is; the `jQuery` function and the `$` alias; the wrapped set / "jQuery
    object" vs. raw DOM nodes. Why use jQuery and — with equal weight — when not to (native
    `querySelectorAll`, `classList`, `fetch`, `addEventListener`; note Bootstrap 5 and most modern stacks
    dropped it).
  - [x] Task 2.2. Adding jQuery to a page: local `<script>` download, the official CDN
    (https://code.jquery.com/), the `slim` vs. full build, and `integrity`/`crossorigin` (SRI). Include the
    CDN `<script>` snippet as a code example.
  - [x] Task 2.3. `$(document).ready(fn)` / `$(fn)` vs. `window.onload`; how deferred `<script>` changes the
    picture today. `jQuery.noConflict()` and why it exists. A one-line note on using the DevTools console to
    experiment. Link `xref:web/javascript/browser-dom-basics.adoc[]`.

- [x] Task 3. Create `modules/ROOT/pages/web/jquery/selectors.adoc` (book ch. 2, parts of ch. 8)
  - Created `modules/ROOT/pages/web/jquery/selectors.adoc`. Verified by Task 18 build.
  - [x] Task 3.1. Basic selectors (type, `#id`, `.class`, `*`, grouping) and hierarchy/combinators
    (descendant, child `>`, adjacent sibling `+`, general sibling `~`), each with a compact example.
  - [x] Task 3.2. Attribute selectors (`[attr]`, `[attr="v"]`, `^=`, `$=`, `*=`, `~=`).
  - [x] Task 3.3. jQuery filter/pseudo selectors (`:first`, `:last`, `:eq()`, `:gt()`, `:lt()`, `:even`,
    `:odd`, `:not()`, `:has()`, `:contains()`, `:header`, `:animated`) and form/state pseudo selectors
    (`:input`, `:checkbox`, `:radio`, `:selected`, `:checked`, `:disabled`, `:enabled`, `:visible`,
    `:hidden`). Call out which are jQuery extensions (not valid CSS, can't use the native engine, cost
    performance). Mention verifying a selection with `.length`.

- [x] Task 4. Create `modules/ROOT/pages/web/jquery/traversal-and-chaining.adoc` (book ch. 2, ch. 8)
  - Created `modules/ROOT/pages/web/jquery/traversal-and-chaining.adoc` with a `[mermaid]` graph of ancestor/descendant/sibling relationships. Verified by Task 18 build.
  - [x] Task 4.1. Down (`.find()`, `.children()`), up (`.parent()`, `.parents()`, `.parentsUntil()`,
    `.closest()`), sideways (`.siblings()`, `.next()`, `.nextAll()`, `.nextUntil()`, `.prev()`,
    `.prevAll()`, `.prevUntil()`).
  - [x] Task 4.2. Filtering a set (`.filter()`, `.not()`, `.is()`, `.has()`, `.eq()`, `.first()`, `.last()`,
    `.slice()`) and iterating (`.each(fn)` — how `this` / index / element work; `.map()`).
  - [x] Task 4.3. Method chaining and the destructive-operation stack: `.end()`, `.addBack()`, with a
    before/after chaining example.
  - [x] Task 4.4. Add a `[mermaid]` diagram of the traversal relationships (a sample DOM tree with
    ancestors / descendants / siblings of a highlighted node labelled).

- [x] Task 5. Create `modules/ROOT/pages/web/jquery/dom-manipulation.adoc` (book ch. 3-5)
  - Created `modules/ROOT/pages/web/jquery/dom-manipulation.adoc`; literal `\{ ... }` escaped in the create-element prose per the AsciiDoc gotcha. Verified by Task 18 build.
  - [x] Task 5.1. Reading/writing content: `.html()`, `.text()`, `.val()`.
  - [x] Task 5.2. Inserting inside (`.append()`, `.prepend()`, `.appendTo()`, `.prependTo()`) and outside
    (`.after()`, `.before()`, `.insertAfter()`, `.insertBefore()`); wrapping (`.wrap()`, `.wrapAll()`,
    `.wrapInner()`, `.unwrap()`).
  - [x] Task 5.3. Removing (`.remove()`, `.detach()` — and how it differs from `.remove()`, `.empty()`),
    copying/replacing (`.clone()` with/without event data, `.replaceWith()`, `.replaceAll()`), and creating
    elements (`$('<li>', \{ text: '…', class: '…' })` — note the escaped braces per the AsciiDoc gotcha when
    referring to this outside a source block).
  - [x] Task 5.4. "Modern equivalent" note: `append`/`prepend`/`before`/`after`/`remove`/`replaceWith` are
    now native; link `xref:web/javascript/browser-dom-basics.adoc[]`.

- [x] Task 6. Create `modules/ROOT/pages/web/jquery/css-attributes-dimensions.adoc` (book ch. 5, ch. 7)
  - Created `modules/ROOT/pages/web/jquery/css-attributes-dimensions.adoc` and `modules/ROOT/images/jquery-dimensions.svg` (hand-authored, verified rendering in the browser pane). Verified by Task 18 build.
  - [x] Task 6.1. Classes: `.addClass()`, `.removeClass()`, `.toggleClass()`, `.hasClass()`. Inline styles:
    `.css()` (get one, get many, set one, set object, functional setter).
  - [x] Task 6.2. Attributes vs. properties: `.attr()` / `.removeAttr()` vs. `.prop()` — the
    `checked`/`selected`/`disabled` gotcha, with a concrete example.
  - [x] Task 6.3. Dimensions (`.width()`/`.height()`, `.innerWidth/Height()`,
    `.outerWidth/Height([includeMargin])`) and position/scroll (`.offset()`, `.position()`, `.scrollTop()`,
    `.scrollLeft()`).
  - [x] Task 6.4. Create `modules/ROOT/images/jquery-dimensions.svg` — a labelled box overlay showing which
    of `width()` / `innerWidth()` / `outerWidth()` / `outerWidth(true)` includes content / padding / border
    / margin — and embed it with `image::jquery-dimensions.svg[...]`. Follow the existing hand-authored SVG
    convention (`box-model.svg`, `flex-axes.svg`).

- [x] Task 7. Create `modules/ROOT/pages/web/jquery/effects-and-animation.adoc` (book ch. 3)
  - Created `modules/ROOT/pages/web/jquery/effects-and-animation.adoc` with a `[mermaid]` flowchart of the per-element FIFO effects queue. Verified by Task 18 build.
  - [x] Task 7.1. Show/hide (`.show()`, `.hide()`, `.toggle()`), fading (`.fadeIn()`, `.fadeOut()`,
    `.fadeToggle()`, `.fadeTo()`), sliding (`.slideDown()`, `.slideUp()`, `.slideToggle()`).
  - [x] Task 7.2. Custom `.animate(props, duration, easing, complete)` — what can be animated,
    `toggle`/`+=`/`-=` values, duration and completion callbacks; built-in easing (`swing`, `linear`) and
    where jQuery UI adds more.
  - [x] Task 7.3. Controlling the queue: `.stop()`, `.finish()`, `.delay()`, `jQuery.fx.off`,
    `jQuery.fx.speeds`. Add a `[mermaid]` diagram of the per-element effects queue (queued animations
    draining one at a time). "Modern equivalent" note: CSS transitions/animations and the Web Animations
    API.

- [x] Task 8. Create `modules/ROOT/pages/web/jquery/events.adoc` (book ch. 10-11)
  - Created `modules/ROOT/pages/web/jquery/events.adoc` with a `[mermaid]` flowchart of a click bubbling up to a delegated handler. Verified by Task 18 build.
  - [x] Task 8.1. Binding: `.on(type, [selector], [data], handler)`, `.off()`, `.one()`; why `.on()`
    supersedes `.bind()` / `.live()` / `.delegate()`. Shorthand handlers (`.click()`, `.dblclick()`,
    `.hover()`, `.focus()`, `.blur()`, `.change()`, `.submit()`, `.keydown()`, `.keyup()`, `.keypress()`,
    the mouse-event family) — note jQuery 3.3+ deprecated the no-argument shorthand *signatures* in favour of
    `.on()`.
  - [x] Task 8.2. The jQuery event object: `.type`, `.target`, `.currentTarget`, `.which` / `.key`,
    `.pageX/Y`, `.data`; `.preventDefault()`, `.stopPropagation()`, `.stopImmediatePropagation()`; returning
    `false`.
  - [x] Task 8.3. Event delegation: one handler on a stable ancestor with a `selector` argument — why it
    matters for dynamically added elements and for memory/performance. Triggering programmatically
    (`.trigger()`, `.triggerHandler()`); custom/namespaced events (`click.myPlugin`). Window/document events
    (`.scroll()`, `.resize()`, `.on('load')`).
  - [x] Task 8.4. Add a `[mermaid]` diagram of a click bubbling up the ancestor chain (target → parents →
    document), and link `xref:web/javascript/browser-events.adoc[]` for the underlying
    capture/target/bubble model and native `addEventListener`.

- [x] Task 9. Create `modules/ROOT/pages/web/jquery/data-and-utilities.adoc` (book ch. 9)
  - Created `modules/ROOT/pages/web/jquery/data-and-utilities.adoc` (includes a deprecated-utility -> native-replacement table). Verified by Task 18 build.
  - [x] Task 9.1. `.data()` — store/read/remove arbitrary data on elements; relationship to `data-*`
    attributes and the fact that `.data()` reads them once then caches (does not write back to the
    attribute). `.index()` (no-arg, selector, element signatures). `.get()` / `.toArray()` — getting real
    DOM nodes out; `.get(0)` vs. `[0]`.
  - [x] Task 9.2. Static utilities: `jQuery.each()`, `jQuery.map()`, `jQuery.grep()`, `jQuery.extend()`,
    `jQuery.merge()`, `jQuery.inArray()`, `jQuery.now()`, and the deprecated ones with their native
    replacements (`jQuery.trim` → `String.prototype.trim`, `jQuery.type`/`jQuery.isArray` → `typeof` /
    `Array.isArray`, `jQuery.parseJSON` → `JSON.parse`). `jQuery.fn.jquery` for the version string.

- [x] Task 10. Create `modules/ROOT/pages/web/jquery/ajax.adoc` (book ch. 12)
  - Created `modules/ROOT/pages/web/jquery/ajax.adoc` with a `[mermaid]` sequence diagram of the request lifecycle; links `xref:web/cors.adoc` and `xref:web/javascript/browser-networking.adoc`. Verified by Task 18 build.
  - [x] Task 10.1. `jQuery.ajax(url, settings)` — `method`, `url`, `data`, `dataType`, `headers`,
    `contentType`, `timeout`, `beforeSend`. Shorthand: `jQuery.get()`, `jQuery.post()`, `jQuery.getJSON()`,
    `jQuery.getScript()`, and the element method `.load(url)`.
  - [x] Task 10.2. Handling responses: the jqXHR object; `.done()` / `.fail()` / `.always()` / `.then()`
    (Promise/A+ since jQuery 3); the legacy `success` / `error` / `complete` callbacks and why the deferred
    style is preferred. `jQuery.Deferred()` and `jQuery.when()` (brief; jqXHR is a thenable). Serializing
    form data: `.serialize()`, `.serializeArray()`, `jQuery.param()`. Global AJAX events (`.ajaxStart()`,
    `.ajaxStop()`, `.ajaxError()`) — brief.
  - [x] Task 10.3. Add a `[mermaid]` sequence diagram of an AJAX call (page → `$.ajax` → server →
    `.done`/`.fail`). "Modern equivalent" note: `fetch()` + `AbortController`; cross-origin requests are
    subject to CORS — link `xref:web/cors.adoc[]` and `xref:web/javascript/browser-networking.adoc[]`.

- [x] Task 11. Create `modules/ROOT/pages/web/jquery/plugins-and-modern-usage.adoc`
  - Created `modules/ROOT/pages/web/jquery/plugins-and-modern-usage.adoc` (minimal `$.fn` plugin, ecosystem orientation, jquery-migrate, jQuery -> native table). Verified by Task 18 build.
  - [x] Task 11.1. The chaining / `$.fn` pattern; a minimal jQuery plugin
    (`$.fn.myThing = function () \{ return this.each(...); };`), accepting an options object with
    `$.extend`, preserving chainability. One-paragraph orientation (with links) to jQuery UI, jQuery Mobile,
    and common plugins — not a full reference.
  - [x] Task 11.2. Migrating off jQuery: the official **jquery-migrate** plugin, and a short "jQuery →
    native" table (`$(sel)` → `document.querySelectorAll`, `.addClass` → `classList.add`, `.on` →
    `addEventListener`, `$.ajax` → `fetch`, `.each` → `for...of`).

- [x] Task 12. Create `modules/ROOT/pages/web/jquery/interactive-list-project.adoc` (book ch. 6)
  - Created `modules/ROOT/pages/web/jquery/interactive-list-project.adoc` (single self-contained HTML file + a walkthrough cross-linking every concept page). Verified by Task 18 build.
  - [x] Task 12.1. One self-contained mini-project — a dynamic list with add / remove / reorder driven by
    **delegated** events — presented as a single annotated `[source,html]` block plus a walkthrough that
    calls out which earlier page each piece comes from (selectors + manipulation + events + effects).

### Group 3 — Cheat sheet and book-review-questions pages

**Parallelizable: yes** — two independent tasks. Both depend on every Group 2 page existing (they link to and
summarize them) but touch entirely disjoint files (`cheat-sheet.adoc` + `jquery-cheat-sheet.pdf` vs.
`quiz.adoc` + `jquery-quiz.pdf`) and neither depends on the other.

- [x] Task 13. Create the jQuery cheat sheet — `cheat-sheet.adoc` + `modules/ROOT/attachments/jquery-cheat-sheet.pdf`
  - HTML scratch layout at `<scratchpad>/jquery-cheat-sheet.html`; rendered with headless Chrome `--print-to-pdf --no-pdf-header-footer`; `modules/ROOT/attachments/jquery-cheat-sheet.pdf` is **A4, exactly 1 page** (verified with PyMuPDF page_count and a rendered PNG preview — no clipping). `modules/ROOT/pages/web/jquery/cheat-sheet.adoc` created. Verified by Task 18 build.
  - [x] Task 13.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarizing: loading jQuery (CDN + `ready`), the most common selectors, traversal
    methods, DOM-manipulation methods, class/`css`/`attr`, effects, `.on()` + the event object, `.data()` /
    `.each()`, `$.ajax` + shorthands, and the "jQuery → native" mini-table. Match the visual style of the
    existing cheat sheets (see `modules/ROOT/pages/web/javascript/cheat-sheet.adoc` and its PDF).
  - [x] Task 13.2. Render to a single-page PDF via headless Chrome
    (`--headless --print-to-pdf=jquery-cheat-sheet.pdf`), move it to
    `modules/ROOT/attachments/jquery-cheat-sheet.pdf`, and verify it is **exactly one page** (`file` /
    page-count check + a rendered preview), same as `.archive/implementation_plan_19.md` Task 23.
  - [x] Task 13.3. Create `modules/ROOT/pages/web/jquery/cheat-sheet.adoc`:
    `include::partial$jquery-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every
    Group 2 page, and `xref:attachment$jquery-cheat-sheet.pdf[Download the jQuery Cheat Sheet (PDF)]`.

- [x] Task 14. Create the book review questions — `quiz.adoc` + `modules/ROOT/attachments/jquery-quiz.pdf`
  - Extracted all 51 MCQs (ch 3:5, 4:5, 5:3, 6:3, 7:5, 8:5, 9:4, 11:5, 12:6, final:10) from `~/Desktop/book.pdf` via the scratchpad `book.txt`. Created `modules/ROOT/pages/web/jquery/quiz.adoc` (`[qanda]` lists per chapter, book answer + marked Correction admonitions, summary-of-corrections table, xref links to the detail pages) and `modules/ROOT/attachments/jquery-quiz.pdf` (7-page A4, content through p6 + footer on p7; multi-page is allowed for the quiz). Verified by Task 18 build.
  - [x] Task 14.1. Extract every multiple-choice question and its stated answer from `~/Desktop/book.pdf`
    (chapters 3, 4, 5, 6, 7, 8, 9, 11, 12, and the final book-wide quiz). Capture question text, all
    options, and the book's answer key verbatim (noting the chapter-5 answer-key mis-lettering).
  - [x] Task 14.2. Validate every question and answer against authoritative jQuery knowledge
    (https://api.jquery.com/). Substantive corrections recorded: ch5 answer-key mis-lettering; ch7 Q5
    (`.css()` only by elimination vs. dedicated `.width()/.height()/.inner/.outer`); ch8 Q2 (`.next()` = next
    sibling only); ch11 Q1 (`.bind()` removed in 3.0); ch11 Q3 (answer key prints non-existent `.stopEvent()`
    — correct is `.stopPropagation()`); ch11 Q4 (book answer wrong — `.preventDefault()` cancels only the
    default action); ch11 Q5 (`.bind()`/`.live()`/`.delegate()` removed); ch12 Q5 (legacy `success/error/
    complete` vs. jqXHR Promises/A+); final Q8 (`.keypress()` deprecated).
  - [x] Task 14.3. Create `modules/ROOT/pages/web/jquery/quiz.adoc`:
    `include::partial$jquery-disclaimer.adoc[]`, a short intro stating the source book and that answers were
    verified against the official API, then one `====` example block (or numbered subsection) per chapter
    containing its questions, each with the options, a collapsed/labelled "Book answer", and an inline
    "Correction" admonition where applicable, with `xref:` links to the relevant Group 2 detail page or an
    `https://api.jquery.com/...` link. Escape any literal `{…}` in prose per the AsciiDoc gotcha.
  - [x] Task 14.4. Produce `modules/ROOT/attachments/jquery-quiz.pdf` (questions + answers + corrections)
    from a print-ready HTML/CSS layout via headless Chrome — may be multiple pages — and link it from
    `quiz.adoc` via `xref:attachment$jquery-quiz.pdf[Download the jQuery review questions (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 15 (section index) must link every page from Groups 2-3; Tasks 16 and 17 depend
on Task 15 existing and on the final page/file names; Task 18 (build) depends on every prior task having
landed.

- [x] Task 15. Create `modules/ROOT/pages/web/jquery/index.adoc` — jQuery Reference landing page
  - Created `modules/ROOT/pages/web/jquery/index.adoc` (grouped `== What's covered` with sub-headings Core / Selecting & traversing / Changing the page / Behaviour / Talking to the server / Beyond jQuery / Reference, and a `== Bibliography` citing the book with both ISBNs + publisher pages, api.jquery.com, jquery.com, learn.jquery.com, jquery-migrate, MDN). Verified by Task 18 build.
  - [x] Task 15.1. `include::partial$jquery-disclaimer.adoc[]`, a short intro, a `== What's covered` section
    `xref:`-linking every Group 2 page plus the cheat sheet and the quiz with a one-line blurb each (grouped
    under readable sub-headings: "Core", "Selecting & traversing", "Changing the page", "Behaviour",
    "Talking to the server", "Beyond jQuery", "Reference"), mirroring `web/javascript/index.adoc`.
  - [x] Task 15.2. `== Bibliography` section citing: the reference book with full details (title, author,
    publisher **Orange Education Pvt Ltd / AVA™**, 2024, both ISBNs) linking the publisher's book page
    (https://orangeava.com/products/ultimate-modern-jquery-for-web-app-development) and home page
    (https://orangeava.com/); the official jQuery API reference (https://api.jquery.com/), project site
    (https://jquery.com/), learning centre (https://learn.jquery.com/), and the jquery-migrate project
    (https://github.com/jquery/jquery-migrate); and https://developer.mozilla.org/[MDN] as the source for
    the "modern native equivalent" notes.

- [x] Task 16. Update `modules/ROOT/pages/web/index.adoc`
  - Added the fifth `== Sections` bullet (`xref:web/jquery/index.adoc[jQuery Reference]`) after Bootstrap and updated the page `:description:` / `:keywords:` to mention jQuery. Verified by Task 18 build.
  - [x] Task 16.1. Add a fifth bullet to the `== Sections` list, after the Bootstrap Reference entry:
    `xref:web/jquery/index.adoc[jQuery Reference]` with a one-line blurb (DOM traversal/manipulation, events,
    effects, and AJAX with jQuery 3.x, when to prefer native APIs, plus a downloadable cheat sheet and a
    validated book-review quiz). Update the page's own `:description:` / `:keywords:` to mention jQuery.

- [x] Task 17. Wire the new subsection into the site navigation and the root landing page
  - Added the `*** xref:web/jquery/index.adoc[jQuery Reference]` block (13 `****` page entries in reading order) to `modules/ROOT/nav.adoc` after the Bootstrap block, and the `** xref:web/jquery/index.adoc[jQuery Reference] -- …` bullet to the root `modules/ROOT/pages/index.adoc` `== Guides & References` list after Bootstrap. Verified by Task 18 build.
  - [x] Task 17.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/jquery/index.adoc[jQuery Reference]`
    block under `** xref:web/index.adoc[Web Development]`, placed after the Bootstrap Reference block, with a
    `****` line per page in this reading order: getting-started, selectors, traversal-and-chaining,
    dom-manipulation, css-attributes-dimensions, effects-and-animation, events, data-and-utilities, ajax,
    plugins-and-modern-usage, interactive-list-project, cheat-sheet, quiz.
  - [x] Task 17.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/jquery/index.adoc[jQuery Reference] -- …` after the Bootstrap Reference bullet under the
    Web Development entry, matching the existing one-line-blurb format.

- [x] Task 18. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out
  of the main context:
  - **PASS.** `npx antora antora-playbook.yml` exited 0 with **zero WARN and zero ERROR lines** (no `xref`/AsciiDoc errors, no "skipping reference to missing attribute" warnings anywhere, including the four touched wiring files). `build/site/web/jquery/` has all 14 HTML pages; PDFs at `build/site/_attachments/jquery-cheat-sheet.pdf` and `jquery-quiz.pdf`; image at `build/site/_images/jquery-dimensions.svg`; `jQuery Reference` present in `build/site/web/index.html` and the rendered nav (wired to `web/jquery/index.html`); mermaid blocks rendered on all 4 of traversal-and-chaining, effects-and-animation, events, ajax. No fixes needed.
  ```
  Agent({
    description: "Verify Antora site build for jQuery Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero warnings/errors; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/jquery/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/jquery/*.html, the two PDF attachments
      (build/site/_attachments/jquery-cheat-sheet.pdf and jquery-quiz.pdf), the jquery-dimensions.svg image,
      every new nav entry, and all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  Fix any reported `xref`/AsciiDoc errors or missing-attribute warnings (most likely an unescaped `{…}` in
  prose, a typo'd `xref:` target, or a missing nav entry) before checking this task off.
