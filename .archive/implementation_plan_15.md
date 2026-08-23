# Implementation Plan: Web Development / JavaScript Reference

## Task summary

Source: GitHub issue #15

Issue [#15](https://github.com/albertoirurueta/docs/issues/15) ("Javascript Developement") asks to add a new
**"Javascript Development"** section under the existing **"Web Development"** section of this repo's own `ROOT`
Antora component, at `modules/ROOT/pages/web/javascript/`, alongside the existing HTML & CSS Reference
(`modules/ROOT/pages/web/html-css/`). Content must be grounded in the book *"JavaScript: The Definitive Guide"*
(7th ed., David Flanagan, 707-page PDF at `~/Downloads/book.pdf`), supplemented with general/official-documentation
knowledge where the book doesn't cover something the issue asks for, and end with a single-page downloadable PDF
cheat sheet — the same pattern as the existing SQL Reference and HTML & CSS Reference sections
([.archive/implementation_plan_3.md](.archive/implementation_plan_3.md),
[.archive/implementation_plan_5.md](.archive/implementation_plan_5.md),
[.archive/implementation_plan_7.md](.archive/implementation_plan_7.md) — the last of these is the closest and most
direct precedent, since it built an entire new "Web Development" subsection from a single reference book the same
way this ticket does).

**Book research performed during planning** (via a dedicated pass over the book's table of contents and chapter
structure) to ground this plan's page breakdown and identify, per topic, what the book covers vs. what must come
from general/official-documentation knowledge:

- Book structure: Ch.1 Introduction, Ch.2 Lexical Structure (p.33), Ch.3 Types/Values/Variables (p.41), Ch.4
  Expressions & Operators (p.79), Ch.5 Statements (p.115), Ch.6 Objects (p.147), Ch.7 Arrays (p.173), Ch.8
  Functions (p.199), Ch.9 Classes (p.239), Ch.10 Modules (p.267), Ch.11 Standard Library (p.285), Ch.12
  Iterators/Generators (p.345), Ch.13 Asynchronous JavaScript (p.359), Ch.14 Metaprogramming (p.397), Ch.15
  JavaScript in Web Browsers (p.427), Ch.16 Node (p.595, not relevant to this ticket), Ch.17 Tools and Extensions
  (p.653).
- **The book has essentially no coverage** of WebGL (2 passing mentions only), Three.js (zero mentions),
  `requestAnimationFrame`-driven animation (one "further reading" pointer only), the Geolocation API (pointer
  only), WebRTC (pointer only), or a dedicated Video API walkthrough — these must be written from general/official
  knowledge, called out explicitly in each task below rather than silently invented.
- **Ch.17 (tooling: ESLint, Prettier, Jest, npm, bundling, Babel)** is a brief ~30-page survey only — each tooling
  page below needs substantial supplementation from that tool's own official documentation to meet the issue's
  "extensive explanation" ask; this is called out per task.
- Everywhere else, concrete chapter/section/page ranges exist in the book and are the starting point per-task
  (cited below); each task should still supplement with general knowledge for anything the issue asks for that the
  book only mentions in passing.

**Choices made on the user's behalf** (best-practice defaults, consistent with this repo's established pattern for
the SQL and HTML & CSS reference sections — stated here so they can be challenged during review):

- **One dedicated page per issue bullet, split into more than one page where a bullet's scope genuinely warrants
  it** (matching the book's own natural chapter/section splits, noted per-task below) — see the page map in
  "Current code state" for the full breakdown. In particular, the issue's "Standard Library" bullet is split into
  six pages (collections, RegExp, dates/errors/JSON, `Intl`, misc utilities, metaprogramming) since the book's own
  Ch.11/Ch.14 material spans that many distinct sub-topics.
- **Flat file layout**: `.adoc` files directly under `modules/ROOT/pages/web/javascript/`, mirroring the flat
  layout of both `modules/ROOT/pages/sql/` and `modules/ROOT/pages/web/html-css/` — nesting ("Web Development >
  JavaScript Development") is expressed via directory path and nav nesting, not further file nesting.
- **JavaScript Development is a second subsection of "Web Development"**, sibling to "HTML & CSS Reference" (not
  a new top-level "Other" entry) — this is exactly what the issue asks for ("Within Web Development section...
  add a new section called Javascript Developement").
- **Mermaid is the default; SVG is the fallback**, used only where mermaid genuinely cannot depict the concept
  (e.g. precise nested-box/geometry diagrams) — same convention as the HTML & CSS reference.
- **Disclaimer partial**: a new `modules/ROOT/partials/javascript-disclaimer.adoc`, following the exact
  `[IMPORTANT]` admonition pattern of
  [modules/ROOT/partials/sql-disclaimer.adoc](modules/ROOT/partials/sql-disclaimer.adoc) and
  `html-css-disclaimer.adoc`, naming this book as the primary source, explicitly noting that WebGL/Three.js/
  Geolocation/WebRTC/Video APIs and the tooling chapter (ESLint/Prettier/Jest/Babel/npm) were written primarily
  from general/official documentation rather than the book, and recommending verification against the current
  ECMAScript spec (tc39.es/ecma262) and MDN before relying on this content in production.
- **Official spec links** (tc39.es/ecma262, the ratified ECMA-262 editions at ecma-international.org, and
  github.com/tc39/proposals) are added directly on the relevant language-reference pages, not just in the closing
  bibliography, per the issue's explicit request.
- **No project-picker icon/xref** for "JavaScript Development" — like the rest of Web Development, it lives under
  the root `index.adoc`'s `== Other` section, not as one of the remote-component picker tiles.

## Current code state

- This repo's Antora component is `ROOT` ([antora.yml](antora.yml)), navigated by
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under `modules/ROOT/pages/`.
- The existing **Web Development** section (`modules/ROOT/pages/web/index.adoc`) currently lists a single
  subsection, **HTML & CSS Reference** (`modules/ROOT/pages/web/html-css/*.adoc`), which is the direct structural
  precedent:
  - A `partial$html-css-disclaimer.adoc` included via `include::partial$html-css-disclaimer.adoc[]` at the top of
    every page.
  - One page per major topic, an `index.adoc` linking to each with a one-line blurb plus a closing bibliography,
    and a `cheat-sheet.adoc` that links back to every detail page and links a PDF via
    `xref:attachment$html-css-cheat-sheet.pdf[Download ...]`, with the actual file under
    `modules/ROOT/attachments/`.
  - `nav.adoc` lists `Web Development` (`*`) with `HTML & CSS Reference` (`**`) and its own detail pages (`***`).
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc) lists `Web Development` under an
    `== Other` section, with `HTML & CSS Reference` nested one level under it.
  - `[mermaid]` blocks are the only diagram mechanism used anywhere in this repo's docs so far (in
    `sql/relations.adoc` and several `web/html-css/*.adoc` pages) — no bespoke SVG figures currently exist.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks), `@djencks/asciidoctor-mathjax` (unused by this
  ticket).
- **New page map** this plan creates under `modules/ROOT/pages/web/javascript/` (all `.adoc` unless noted):
  - **Language reference**: `legacy-features.adoc`, `lexical-structure.adoc`, `types.adoc`, `arrays.adoc`,
    `functions-expressions-operators.adoc`, `iterators-generators.adoc`, `statements.adoc`,
    `objects-destructuring.adoc`, `function-parameters-namespaces.adoc`, `classes.adoc`, `modules.adoc`,
    `stdlib-collections.adoc`, `stdlib-regexp.adoc`, `stdlib-dates-errors-json.adoc`, `stdlib-intl.adoc`,
    `stdlib-utilities.adoc`, `stdlib-metaprogramming.adoc`, `async-javascript.adoc`.
  - **JavaScript in the browser**: `browser-dom-basics.adoc`, `browser-events.adoc`, `browser-css.adoc`,
    `browser-geometry-scrolling.adoc`, `browser-animations.adoc`, `browser-canvas-webgl.adoc`,
    `browser-audio-video.adoc`, `browser-location-navigation-history.adoc`, `browser-storage.adoc`,
    `browser-networking.adoc`, `browser-workers.adoc`.
  - **Tooling**: `tooling-eslint-prettier.adoc`, `tooling-jest.adoc`, `tooling-babel.adoc`,
    `tooling-bundling-npm-publishing.adoc`.
  - `cheat-sheet.adoc` + `modules/ROOT/attachments/javascript-cheat-sheet.pdf`.
  - `index.adoc` (section index, same role as `sql/index.adoc` / `web/html-css/index.adoc`).
  - Plus `modules/ROOT/partials/javascript-disclaimer.adoc`, and updates to `modules/ROOT/pages/web/index.adoc`,
    `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task, nothing else in this plan can safely include it before it exists)

- [x] Task 1. Create the JavaScript disclaimer partial — `modules/ROOT/partials/javascript-disclaimer.adoc` created.
  - [x] Task 1.1. Create `modules/ROOT/partials/javascript-disclaimer.adoc`, an `[IMPORTANT]` admonition following
    the structure of `modules/ROOT/partials/html-css-disclaimer.adoc`: state that this section covers modern
    ECMAScript and core browser JavaScript APIs (not any specific framework/library), that it was built primarily
    from *"JavaScript: The Definitive Guide"* (7th ed., David Flanagan) plus general/official-documentation
    knowledge where the book didn't cover an asked-for topic — explicitly naming WebGL/Three.js, the Geolocation
    API, WebRTC, Video APIs, and the developer-tooling pages (ESLint/Prettier/Jest/Babel/npm) as primarily
    general-knowledge-sourced — that it was generated with AI assistance, and that it should be verified against
    the current ECMAScript specification (https://tc39.es/ecma262/) and MDN before relying on it in production.

### Group 2 — Language reference pages

**Parallelizable: yes** — every task is an independent page with no dependency on any other task in this group;
each only depends on Group 1's disclaimer partial existing. All tasks share the
`include::partial$javascript-disclaimer.adoc[]` convention at the top of every page.

- [x] Task 2. Write the legacy-JavaScript-to-avoid summary page — `legacy-features.adoc` created (63 lines).
  - [x] Task 2.1. Create `modules/ROOT/pages/web/javascript/legacy-features.adoc`, grounded in the book's §3.10
    (pp.71–78): `var`'s function-scoping and hoisting pitfalls vs. `let`/`const` block scoping, why prototype-based
    inheritance patterns (`Object.create`, manual `.prototype` assignment, constructor-function "classes") are
    superseded by the `class` keyword (Task 11), and a brief mention of other legacy patterns to avoid (the
    `arguments` object superseded by rest parameters, `var`-based IIFE namespacing superseded by ES modules). Keep
    this brief and orientation-only — it exists so later pages can assume modern syntax without re-justifying it
    each time.

- [x] Task 3. Write the lexical structure page — `lexical-structure.adoc` created (187 lines).
  - [x] Task 3.1. Create `modules/ROOT/pages/web/javascript/lexical-structure.adoc`, grounded in the book's Ch.2
    (pp.33–39): comments (`//`, `/* */`), literals, identifiers and reserved words, `let`/`const` declaration
    syntax (contrasted briefly with Task 2's `var` critique via cross-reference), semicolon insertion rules, and
    Unicode/encoding notes. Link the official spec (https://tc39.es/ecma262/#sec-ecmascript-language-lexical-grammar[
    ECMA-262 §Lexical Grammar]) alongside the syntax reference.

- [x] Task 4. Write the types, values & conversions page — `types.adoc` created (421 lines).
  - [x] Task 4.1. Create `modules/ROOT/pages/web/javascript/types.adoc`, grounded in the book's §3.2–3.6 and §3.9
    (pp.43–70): numbers (including `BigInt`), strings (including template literals and tagged templates),
    booleans, `null`/`undefined` and their distinction, `Symbol`, and type conversion rules (implicit coercion in
    `==`/`+`, explicit `Number()`/`String()`/`Boolean()`). Cross-reference `arrays.adoc` (Task 5) rather than
    duplicating array coverage. Link https://tc39.es/ecma262/#sec-ecmascript-data-types-and-values[ECMA-262's data
    types section].

- [x] Task 5. Write the arrays & typed arrays page — `arrays.adoc` created (252 lines).
  - [x] Task 5.1. Create `modules/ROOT/pages/web/javascript/arrays.adoc`, grounded in the book's Ch.7 (pp.173–198)
    and §11.2 (pp.293–298): array literals, sparse arrays, array-like objects, and a comprehensive table of array
    methods (`map`/`filter`/`reduce`/`forEach`/`find`/`findIndex`/`some`/`every`/`sort`/`slice`/`splice`/`flat`/
    `flatMap`/`includes`/spread syntax) each with a short example. Cover typed arrays (`Int8Array` … `Float64Array`,
    `ArrayBuffer`, `DataView`) and when to reach for them (binary data, `WebGL`/`Canvas` pixel buffers — cross-ref
    `browser-canvas-webgl.adoc`, Task 25).

- [x] Task 6. Write the functions, expressions & operators page — `functions-expressions-operators.adoc` created (478 lines).
  - [x] Task 6.1. Create `modules/ROOT/pages/web/javascript/functions-expressions-operators.adoc`, grounded in the
    book's Ch.4 (pp.79–114) and §8.1–8.2 (pp.199–210): expressions vs. statements, the full operator reference
    (arithmetic, comparison, logical incl. `&&`/`||`/`??` short-circuiting, nullish coalescing `??`, optional
    chaining `?.`, bitwise, `typeof`/`instanceof`), and function fundamentals (function declarations, function
    expressions, arrow functions and their `this`-binding difference, immediately-invoked function expressions).

- [x] Task 7. Write the iterators & generators page — `iterators-generators.adoc` created (405 lines) with a mermaid diagram.
  - [x] Task 7.1. Create `modules/ROOT/pages/web/javascript/iterators-generators.adoc`, grounded in the book's
    Ch.12 (pp.345–357): the iterator protocol (`Symbol.iterator`, `next()`/`{value, done}`), `for...of`, writing a
    custom iterable, generator functions (`function*`, `yield`), delegating generators (`yield*`), and generator
    `return()`/`throw()`. Cross-reference `async-javascript.adoc` (Task 19) for how `yield`/generators relate to
    `for await...of` and async iteration.
  - [x] Task 7.2. Add a diagram of the iterator protocol's `next()` → `{value, done}` request/response cycle —
    default to a mermaid sequence diagram; fall back to SVG only if mermaid can't render it clearly.

- [x] Task 8. Write the statements page — `modules/ROOT/pages/web/javascript/statements.adoc` created (218 lines).
  - [x] Task 8.1. Create `modules/ROOT/pages/web/javascript/statements.adoc`, grounded in the book's §5.3–5.4
    (pp.118–130): conditionals (`if`/`else if`/`else`, `switch` with fall-through and `default`), loops (`for`,
    `for...in`, `for...of`, `while`, `do...while`), and loop-control statements (`break`/`continue`, with and
    without labels).

- [x] Task 9. Write the objects, properties & destructuring page — `objects-destructuring.adoc` created (246 lines).
  - [x] Task 9.1. Create `modules/ROOT/pages/web/javascript/objects-destructuring.adoc`, grounded in the book's
    Ch.6 (pp.147–171): object literal syntax, property access (dot vs. bracket notation), computed property names,
    shorthand properties/methods, property enumeration (`for...in`, `Object.keys`/`values`/`entries`), spread in
    object literals, and object/array destructuring (including default values, nested destructuring, and
    destructuring in function parameters — cross-referenced from Task 10).

- [x] Task 10. Write the function parameters & namespaces page — `function-parameters-namespaces.adoc` created (~200 lines).
  - [x] Task 10.1. Create `modules/ROOT/pages/web/javascript/function-parameters-namespaces.adoc`, grounded in the
    book's §8.3 and §8.5 (pp.211–221): default parameter values, rest parameters (`...args`) for variable-length
    argument lists, destructured parameters (cross-ref Task 9), and the `arguments` object (noted as legacy,
    cross-ref Task 2). Cover namespacing: the pre-ES6 IIFE/closure "namespace object" pattern the book describes
    in §8.5, explicitly framed as superseded by ES modules (cross-ref `modules.adoc`, Task 12) for organizing code
    today.

- [x] Task 11. Write the classes page — `classes.adoc` created (~290 lines) with a mermaid classDiagram.
  - [x] Task 11.1. Create `modules/ROOT/pages/web/javascript/classes.adoc`, grounded in the book's Ch.9
    (pp.239–266): `class` declarations/expressions, constructors, instance fields and methods, `#private` fields
    and methods (non-exported/inaccessible outside the class), static members (fields, methods, and the
    private-static combination), getters/setters (`get`/`set`), abstract-class patterns (a base class with methods
    that throw `"not implemented"`, since JS has no native `abstract` keyword), subclassing (`extends`, `super()`
    in constructors, method overriding, and calling `super.method()`).
  - [x] Task 11.2. Add a class-hierarchy diagram illustrating a base class and a subclass overriding a method
    (mermaid `classDiagram`), to make the subclassing/overriding relationship concrete.

- [x] Task 12. Write the modules page — `modules.adoc` created (211 lines).
  - [x] Task 12.1. Create `modules/ROOT/pages/web/javascript/modules.adoc`, grounded in the book's Ch.10
    (pp.267–284): ES module syntax (`export`/`export default`, named vs. default imports, `import * as ns`,
    dynamic `import()`), module scoping (each module has its own top-level scope — the modern replacement for the
    namespace pattern in Task 10), and a brief note on CommonJS (`require`/`module.exports`) as the pattern found
    in older Node.js code, contrasted with ES modules.

- [x] Task 13. Write the standard library: collections page — `stdlib-collections.adoc` created (~150 lines):
  `Set`/`Map`/`WeakSet`/`WeakMap`, core methods, iteration order, and when to prefer each over plain objects/arrays.
  - [x] Task 13.1. Create `modules/ROOT/pages/web/javascript/stdlib-collections.adoc`, grounded in the book's §11.1
    (pp.286–293): `Set`/`WeakSet` and `Map`/`WeakMap`, their core methods (`add`/`has`/`delete`, `get`/`set`/`has`),
    iteration order guarantees, and when to prefer them over plain objects/arrays (unique-value sets, non-string
    keys, weak references for memory-sensitive caches).

- [x] Task 14. Write the standard library: regular expressions page — `stdlib-regexp.adoc` created (296 lines).
  - [x] Task 14.1. Create `modules/ROOT/pages/web/javascript/stdlib-regexp.adoc`, grounded in the book's §11.3
    (pp.299–318): regex literal syntax, character classes, quantifiers, groups (capturing, non-capturing, named),
    flags (`g`/`i`/`m`/`s`/`u`/`y`), and the `RegExp`/`String` methods that use them (`test`, `exec`, `match`,
    `matchAll`, `replace`/`replaceAll`, `split`).

- [x] Task 15. Write the standard library: dates, errors & JSON page — `stdlib-dates-errors-json.adoc` created (~280 lines).
  - [x] Task 15.1. Create `modules/ROOT/pages/web/javascript/stdlib-dates-errors-json.adoc`, grounded in the book's
    §11.4–11.6 (pp.318–327): the `Date` object (construction, getters/setters, formatting pitfalls), the `Error`
    class hierarchy (`TypeError`/`RangeError`/etc.) and custom error subclassing (cross-ref Task 11's `extends`),
    `try`/`catch`/`finally` (cross-ref Task 8 for control flow), and `JSON.stringify`/`JSON.parse` (including the
    `replacer`/`reviver` parameters).

- [x] Task 16. Write the standard library: internationalization (`Intl`) page — `stdlib-intl.adoc` created (126 lines).
  - [x] Task 16.1. Create `modules/ROOT/pages/web/javascript/stdlib-intl.adoc`, grounded in the book's §11.7
    (pp.327–335): `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.Collator` for locale-aware sorting, and
    `Intl.PluralRules`, each with a short locale-formatting example.

- [x] Task 17. Write the standard library: console, URL & timers page — `stdlib-utilities.adoc` created (198 lines).
  - [x] Task 17.1. Create `modules/ROOT/pages/web/javascript/stdlib-utilities.adoc`, grounded in the book's
    §11.8–11.10 (pp.335–343): the `console` API beyond `log` (`table`/`group`/`time`/`trace`), the `URL`/
    `URLSearchParams` classes for parsing and building URLs, and the timer functions
    (`setTimeout`/`setInterval`/`clearTimeout`/`clearInterval`, plus `queueMicrotask`).

- [x] Task 18. Write the standard library: metaprogramming page — `stdlib-metaprogramming.adoc` created (266 lines).
  - [x] Task 18.1. Create `modules/ROOT/pages/web/javascript/stdlib-metaprogramming.adoc`, grounded in the book's
    Ch.14 (pp.397–424): property attributes and descriptors (`Object.defineProperty`, `Object.getOwnPropertyDescriptor`,
    enumerable/writable/configurable), object extensibility controls (`Object.freeze`/`seal`/`preventExtensions`),
    the `Reflect` API, and the `Proxy` API (a worked example intercepting `get`/`set` traps, e.g. for validation or
    logging).

- [x] Task 19. Write the asynchronous JavaScript page — `modules/ROOT/pages/web/javascript/async-javascript.adoc`
  created (337 lines).
  - [x] Task 19.1. Create `modules/ROOT/pages/web/javascript/async-javascript.adoc`, grounded in the book's Ch.13
    (pp.359–395): callback-based async as the historical starting point, `Promise` (`then`/`catch`/`finally`,
    `Promise.all`/`allSettled`/`race`/`any`), `async`/`await` syntax and error handling (`try`/`catch` around
    `await`), and async iteration (§13.4) explicitly tying `for await...of` back to the generator/iterator protocol
    from Task 7 (an async generator is a generator function that also yields promises).
  - [x] Task 19.2. Add a worked example of a typical asynchronous task the issue explicitly asks for: fetching a
    REST API with `fetch()`, once with `.then()` chaining and once with `async`/`await`, including error handling
    for a failed/non-OK response. Cross-reference `browser-networking.adoc` (Task 29) for the full `fetch()` API
    surface (headers, request options, streaming bodies) rather than repeating it here.
  - [x] Task 19.3. Add a sequence diagram of promise resolution / the microtask queue relative to the call
    stack and macrotasks — default to mermaid `sequenceDiagram`; fall back to SVG only if mermaid can't show the
    timing relationship clearly.

### Group 3 — JavaScript in the browser pages

**Parallelizable: yes** — every task is an independent page; each only depends on Group 1's disclaimer partial
(and, where noted, cross-references pages from Group 2, which does not create an implementation dependency since
cross-references are just links added once the target page exists — safe because Group 2 and Group 3 both run
before Group 5's cheat sheet, which is the only task that needs every page finished).

- [x] Task 20. Write the web programming basics (DOM) page — `browser-dom-basics.adoc` created (336 lines).
  - [x] Task 20.1. Create `modules/ROOT/pages/web/javascript/browser-dom-basics.adoc`, grounded in the book's
    §15.1 and §15.3 (pp.429–443, 455–469): the `window`/`document` global objects, querying elements
    (`getElementById`/`querySelector`/`querySelectorAll`), creating/inserting/removing elements
    (`createElement`/`appendChild`/`insertBefore`/`remove`/`replaceChildren`), and reading/writing attributes,
    properties, and `textContent`/`innerHTML` (with a brief XSS caution on unsanitized `innerHTML`).

- [x] Task 21. Write the events page — `browser-events.adoc` created (323 lines) with a mermaid diagram.
  - [x] Task 21.1. Create `modules/ROOT/pages/web/javascript/browser-events.adoc`, grounded in the book's §15.2
    (pp.444–454): registering handlers (`addEventListener`/`removeEventListener` vs. `on*` properties), the event
    object, the capturing/target/bubbling phases, `stopPropagation()`/`stopImmediatePropagation()`/
    `preventDefault()`, and event delegation (attaching one listener on a common ancestor instead of many) as the
    memory/performance-conscious pattern the issue explicitly asks about, contrasted with attaching a listener
    per-element.
  - [x] Task 21.2. Add a diagram of the capturing → target → bubbling phases for a nested element (mermaid
    flowchart/sequence diagram) to make event propagation order concrete.

- [x] Task 22. Write the accessing CSS from JavaScript page — `browser-css.adoc` created (202 lines).
  - [x] Task 22.1. Create `modules/ROOT/pages/web/javascript/browser-css.adoc`, grounded in the book's §15.4
    (pp.470–476): reading/writing inline styles (`element.style`), computed styles (`getComputedStyle()`), the
    `classList` API (`add`/`remove`/`toggle`/`contains`), and reacting to CSS animation/transition lifecycle events
    (`animationstart`/`animationend`/`transitionend`) — cross-reference `web/html-css/animations.adoc` and
    `web/html-css/transitions.adoc` for the CSS-authoring side of these features.

- [x] Task 23. Write the document geometry & scrolling page — `browser-geometry-scrolling.adoc` created (239 lines).
  - [x] Task 23.1. Create `modules/ROOT/pages/web/javascript/browser-geometry-scrolling.adoc`, grounded in the
    book's §15.5 (pp.477–481): `getBoundingClientRect()`, the `offsetWidth`/`offsetHeight`/`clientWidth`/
    `scrollWidth` family and what each measures, viewport vs. document vs. element coordinate systems, and
    controlling scroll position (`scrollTo`/`scrollBy`/`scrollIntoView`, `scroll-behavior: smooth`).

- [x] Task 24. Write the animations via JavaScript page — `browser-animations.adoc` created (277 lines).
  - [x] Task 24.1. Create `modules/ROOT/pages/web/javascript/browser-animations.adoc`. The book covers only CSS
    animation/transition *events* from JavaScript (§15.4.5, p.476) — write the rest of this page from general
    knowledge, called out here explicitly: driving CSS animations/transitions by toggling classes or custom
    properties from JS, the `requestAnimationFrame` loop for JS-driven animation (with a worked example animating
    a value over time), the Web Animations API (`element.animate()`) as a native alternative to CSS-class
    toggling, and animating SVG properties from JS (cross-ref `web/html-css/svg-styling-animation.adoc` for the
    CSS-only approach).

- [x] Task 25. Write the Canvas & WebGL page — `browser-canvas-webgl.adoc` created (389 lines).
  - [x] Task 25.1. Create `modules/ROOT/pages/web/javascript/browser-canvas-webgl.adoc`, grounded in the book's
    §15.8 (pp.502–524) for the 2D canvas API: the `2d` rendering context, paths (`beginPath`/`moveTo`/`lineTo`/
    `arc`/`closePath`), fill/stroke styles, text, images (`drawImage`), pixel manipulation
    (`getImageData`/`putImageData`, cross-ref Task 5's typed arrays), and the render-loop pattern via
    `requestAnimationFrame` (cross-ref Task 24).
  - [x] Task 25.2. Add a WebGL section. **The book has essentially no WebGL coverage** — write from general/
    official knowledge: what WebGL is (a low-level GPU/OpenGL ES binding exposed via a canvas `webgl`/`webgl2`
    context), why raw WebGL is verbose (manual shaders, buffers, matrices), and a link to the official spec
    (https://www.khronos.org/registry/webgl/specs/latest/2.0/[WebGL 2.0 Specification]). Per the issue's own
    suggestion, recommend a higher-level library — Three.js — for anything beyond trivial WebGL use, rather than
    documenting raw WebGL calls in depth.
  - [x] Task 25.3. Add a Three.js subsection (also general-knowledge-sourced, zero book coverage): the core
    scene/camera/renderer/mesh(geometry+material)/light object model, a minimal "spinning cube" example, and a
    link to the official docs (https://threejs.org/docs/[Three.js documentation]) for the full API.

- [x] Task 26. Write the audio & video APIs page — `browser-audio-video.adoc` created (260 lines).
  - [x] Task 26.1. Create `modules/ROOT/pages/web/javascript/browser-audio-video.adoc`. Audio playback is grounded
    in the book's §15.9 (pp.525–526): the `HTMLAudioElement`/`<audio>` API (`play`/`pause`/`currentTime`/`volume`,
    the `ended` event). Audio *recording* (`MediaDevices.getUserMedia`, `MediaRecorder`) and the entire Video APIs
    section (`HTMLVideoElement`/`<video>` playback control, `<track>` for captions) have **no dedicated book
    coverage** — write these from general/official (MDN) knowledge, called out explicitly.

- [x] Task 27. Write the location, navigation, history & geolocation page —
  `browser-location-navigation-history.adoc` created (314 lines).
  - [x] Task 27.1. Create `modules/ROOT/pages/web/javascript/browser-location-navigation-history.adoc`, grounded
    in the book's §15.10 (pp.527–535) for `window.location` (navigating, reloading, parsing URL parts) and the
    History API (`history.pushState`/`replaceState`/`back`/`forward`, the `popstate` event, and how these enable
    single-page-app routing without full reloads).
  - [x] Task 27.2. Add a Geolocation API subsection. **Not covered by the book** (only a further-reading pointer)
    — write from general/official (MDN) knowledge: `navigator.geolocation.getCurrentPosition`/`watchPosition`,
    the permission-prompt flow, and accuracy/privacy considerations.

- [x] Task 28. Write the storage page — `browser-storage.adoc` created (285 lines).
  - [x] Task 28.1. Create `modules/ROOT/pages/web/javascript/browser-storage.adoc`, grounded in the book's §15.12
    (pp.554–565): cookies (`document.cookie`, and why the modern APIs below largely superseded them for
    non-server-visible data), `localStorage`/`sessionStorage` (synchronous key/value, string-only, per-origin
    scoping and size limits), and `IndexedDB` (asynchronous, structured, larger-capacity storage) at an overview
    level with a minimal worked example.

- [x] Task 29. Write the networking page — `browser-networking.adoc` created (382 lines) with a mermaid diagram.
  - [x] Task 29.1. Create `modules/ROOT/pages/web/javascript/browser-networking.adoc`, grounded in the book's
    §15.11 (pp.536–553): the `fetch()` API in full (request options, headers, response body handling, streaming),
    Server-Sent Events (`EventSource`), and WebSockets (`new WebSocket(url)`, `send`/`onmessage`/`onclose`, and why
    they suit real-time bidirectional use cases like games and chat, as the issue asks to note).
  - [x] Task 29.2. Add a WebRTC subsection. **Not covered by the book** (only a further-reading pointer) — write
    from general/official knowledge: the peer-connection/signaling/ICE/STUN-TURN model at a conceptual level (full
    signaling-server implementation is out of scope), `RTCPeerConnection`/`getUserMedia` for live audio/video
    conferencing, and a link to the official spec
    (https://www.w3.org/TR/webrtc/[W3C WebRTC specification]).
  - [x] Task 29.3. Add a diagram contrasting the request/response `fetch()` model against the persistent
    bidirectional WebSocket connection (mermaid sequence diagram).

- [x] Task 30. Write the Web Workers page — `browser-workers.adoc` created (373 lines) with a mermaid diagram.
  - [x] Task 30.1. Create `modules/ROOT/pages/web/javascript/browser-workers.adoc`, grounded in the book's §15.13
    (pp.566–572): why long-running JS blocks the single UI thread, creating a dedicated `Worker`, `postMessage`/
    `onmessage` for structured-clone message passing, terminating workers, and a brief mention of shared workers
    and (from general knowledge, since the book's coverage is thin here) service workers as a distinct
    background/offline/caching-oriented worker type.
  - [x] Task 30.2. Add a message-passing sequence diagram between the main thread and a worker (mermaid
    `sequenceDiagram`).

### Group 4 — Tooling pages

**Parallelizable: yes** — every task is an independent page; each only depends on Group 1's disclaimer partial.
Each tooling page must draw primarily on that tool's own official documentation, since the book's Ch.17 survey of
this material is only ~30 pages total across all four topics and is not sufficient on its own for the issue's
"extensive explanation" ask — this is called out per task.

- [x] Task 31. Write the static analysis & formatting (ESLint & Prettier) page —
  `tooling-eslint-prettier.adoc` created (296 lines).
  - [x] Task 31.1. Create `modules/ROOT/pages/web/javascript/tooling-eslint-prettier.adoc`. Use the book's Ch.17
    survey (pp.654–683) as a starting skeleton, then supplement substantially from
    https://eslint.org/docs/latest/[ESLint's official docs] and https://prettier.io/docs/[Prettier's official
    docs]: ESLint's rule/config model (flat `eslint.config.js`, recommended rule sets, `--fix`), a worked example
    catching a real bug (e.g. an unused variable or missing `await`), Prettier's role as a purely-formatting tool
    (opinionated, no logic rules) versus ESLint's logic/style linting, and how the two are typically composed
    together (`eslint-config-prettier` to disable ESLint's own formatting rules so the two tools don't conflict).

- [x] Task 32. Write the unit testing (Jest) page — `tooling-jest.adoc` created (418 lines).
  - [x] Task 32.1. Create `modules/ROOT/pages/web/javascript/tooling-jest.adoc`. Use the book's Ch.17 survey as a
    starting skeleton, then write an extensive page grounded in
    https://jestjs.io/docs/getting-started[Jest's official documentation] per the issue's explicit "add an
    extensive explanation" ask: project setup (`jest.config.js`, the `test`/`describe`/`it` API), assertions
    (`expect` matchers — equality, truthiness, exceptions, async matchers), mocking (`jest.fn()`, `jest.mock()`,
    spies), testing async code (`async`/`await` in tests, resolved/rejected promise matchers), snapshot testing,
    and code coverage reporting (`--coverage`). Include a worked example test file.

- [x] Task 33. Write the transpilation (Babel) page — `tooling-babel.adoc` created (328 lines).
  - [x] Task 33.1. Create `modules/ROOT/pages/web/javascript/tooling-babel.adoc`. Use the book's Ch.17 survey as a
    starting skeleton, then write an extensive page grounded in
    https://babeljs.io/docs/[Babel's official documentation] per the issue's "extensive explanation" ask: what
    transpilation solves (shipping new syntax to older browsers/engines that don't support it), the plugin/preset
    model (`@babel/preset-env` and its `browserslist`-driven targeting, `@babel/preset-react` for JSX), a worked
    before/after example of ES2022+ syntax transpiled to ES5, source maps for debugging transpiled code, and the
    distinction between Babel (syntax transformation) and polyfills (`core-js`, for missing runtime APIs) as two
    complementary but different concerns.

- [x] Task 34. Write the bundling & npm publishing page — `tooling-bundling-npm-publishing.adoc` created (358 lines).
  - [x] Task 34.1. Create `modules/ROOT/pages/web/javascript/tooling-bundling-npm-publishing.adoc`. Use the book's
    Ch.17 survey as a starting skeleton, then write an extensive page per the issue's "extensive instructions" ask:
    what bundlers solve (module resolution + tree-shaking + code-splitting + minification into browser-deliverable
    bundles), a brief comparative overview of the current landscape (Webpack, Rollup, esbuild, Vite) and when
    each is typically chosen (app bundling vs. authoring a library), and production build concerns (minification,
    source maps, `.browserslistrc`/target matrices).
  - [x] Task 34.2. Add a step-by-step "publish an open-source library to npm" walkthrough grounded in
    https://docs.npmjs.com/[npm's official documentation]: `package.json` essentials (`name`/`version`/`main`/
    `module`/`exports`/`types`/`files`/`peerDependencies`), authoring dual ESM+CJS output (or ESM-only with an
    `exports` map) via the bundler chosen above, semantic versioning, `npm login`/`npm publish` (including scoped
    packages and the `--access public` flag), and a brief mention of automating releases via `npm version` +
    CI (cross-ref this repo's own release-automation conventions only if genuinely analogous — otherwise keep this
    generic).

### Group 5 — Cheat sheet

**Parallelizable: yes** (single task) — depends on Groups 2–4's pages existing, since the cheat sheet summarizes
and links to all of them; must not start until those groups are complete.

- [x] Task 35. Create the JavaScript cheat sheet — `javascript-cheat-sheet.pdf` (1 page, Letter, 4-column
  color-coded layout) and `cheat-sheet.adoc` created.
  - [x] Task 35.1. Following the pattern of `modules/ROOT/pages/web/html-css/cheat-sheet.adoc`, design a
    single-page, color-coded PDF summarizing the most-used language essentials (`let`/`const`, arrow functions,
    destructuring, template literals, classes, modules, promises/`async`/`await`), the most common array/string
    methods, and the core browser APIs (DOM selection, `addEventListener`, `fetch`) — grouped into boxes by topic,
    generated as a downloadable PDF.
  - [x] Task 35.2. Save the generated PDF to `modules/ROOT/attachments/javascript-cheat-sheet.pdf`.
  - [x] Task 35.3. Create `modules/ROOT/pages/web/javascript/cheat-sheet.adoc`
    (`include::partial$javascript-disclaimer.adoc[]` at the top), briefly describing the cheat sheet, linking back
    to every page from Groups 2–4 for full detail, and linking the PDF via
    `xref:attachment$javascript-cheat-sheet.pdf[Download the JavaScript Cheat Sheet (PDF)]`.

### Group 6 — Section index, nav wiring, and final verification

**Parallelizable: yes** — these tasks touch different files and each only needs to know the filenames decided in
Groups 2–5 (not each other's finished content), but this whole group must run last since every task references
the complete page set.

- [x] Task 36. Create the JavaScript Development section index — `index.adoc` created (organized under
  Language reference / JavaScript in the browser / Tooling, plus bibliography).
  - [x] Task 36.1. Create `modules/ROOT/pages/web/javascript/index.adoc` (mirroring `web/html-css/index.adoc`): an
    `include::partial$javascript-disclaimer.adoc[]`, a short intro, a "What's covered" bullet list `xref:`-linking
    every page from Groups 2–5 with a one-line blurb each (organized under "Language reference", "JavaScript in
    the browser", and "Tooling" sub-headings for readability), and a closing bibliography section citing
    *"JavaScript: The Definitive Guide"* (7th ed., David Flanagan, O'Reilly), MDN as the general reference used
    throughout, the official ECMAScript spec (https://tc39.es/ecma262/[tc39.es/ecma262]) and its ratified editions
    (https://www.ecma-international.org/publications-and-standards/standards/ecma-262/[ecma-international.org]),
    the TC39 proposal process (https://github.com/tc39/proposals[github.com/tc39/proposals]), and the official
    docs for Three.js, ESLint, Prettier, Jest, Babel, and npm used by the tooling pages.

- [x] Task 37. Update the Web Development section landing page — `web/index.adoc` updated.
  - [x] Task 37.1. Update `modules/ROOT/pages/web/index.adoc`, adding a second bullet after the existing "HTML &
    CSS Reference" entry: `xref:web/javascript/index.adoc[JavaScript Development]` with a one-line blurb (modern
    ECMAScript, core browser APIs, and the surrounding developer-tooling ecosystem, plus a downloadable cheat
    sheet).

- [x] Task 38. Wire the new section into the site navigation — `nav.adoc` updated with all 33 detail-page entries.
  - [x] Task 38.1. Update [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), adding a new three-level entry directly
    after the existing HTML & CSS Reference block (still nested under `Web Development`):
    ```
    ** xref:web/javascript/index.adoc[JavaScript Development]
    *** xref:web/javascript/legacy-features.adoc[Legacy Features to Avoid]
    *** xref:web/javascript/lexical-structure.adoc[Lexical Structure]
    *** xref:web/javascript/types.adoc[Types & Conversions]
    *** xref:web/javascript/arrays.adoc[Arrays & Typed Arrays]
    *** xref:web/javascript/functions-expressions-operators.adoc[Functions, Expressions & Operators]
    *** xref:web/javascript/iterators-generators.adoc[Iterators & Generators]
    *** xref:web/javascript/statements.adoc[Statements]
    *** xref:web/javascript/objects-destructuring.adoc[Objects & Destructuring]
    *** xref:web/javascript/function-parameters-namespaces.adoc[Function Parameters & Namespaces]
    *** xref:web/javascript/classes.adoc[Classes]
    *** xref:web/javascript/modules.adoc[Modules]
    *** xref:web/javascript/stdlib-collections.adoc[Standard Library: Collections]
    *** xref:web/javascript/stdlib-regexp.adoc[Standard Library: Regular Expressions]
    *** xref:web/javascript/stdlib-dates-errors-json.adoc[Standard Library: Dates, Errors & JSON]
    *** xref:web/javascript/stdlib-intl.adoc[Standard Library: Internationalization]
    *** xref:web/javascript/stdlib-utilities.adoc[Standard Library: Console, URL & Timers]
    *** xref:web/javascript/stdlib-metaprogramming.adoc[Standard Library: Metaprogramming]
    *** xref:web/javascript/async-javascript.adoc[Asynchronous JavaScript]
    *** xref:web/javascript/browser-dom-basics.adoc[Web Programming Basics]
    *** xref:web/javascript/browser-events.adoc[Events]
    *** xref:web/javascript/browser-css.adoc[Accessing CSS from JavaScript]
    *** xref:web/javascript/browser-geometry-scrolling.adoc[Document Geometry & Scrolling]
    *** xref:web/javascript/browser-animations.adoc[Animations via JavaScript]
    *** xref:web/javascript/browser-canvas-webgl.adoc[Canvas, WebGL & Three.js]
    *** xref:web/javascript/browser-audio-video.adoc[Audio & Video APIs]
    *** xref:web/javascript/browser-location-navigation-history.adoc[Location, Navigation, History & Geolocation]
    *** xref:web/javascript/browser-storage.adoc[Storage]
    *** xref:web/javascript/browser-networking.adoc[Networking]
    *** xref:web/javascript/browser-workers.adoc[Web Workers]
    *** xref:web/javascript/tooling-eslint-prettier.adoc[Static Analysis & Formatting]
    *** xref:web/javascript/tooling-jest.adoc[Unit Testing with Jest]
    *** xref:web/javascript/tooling-babel.adoc[Transpilation with Babel]
    *** xref:web/javascript/tooling-bundling-npm-publishing.adoc[Bundling & npm Publishing]
    *** xref:web/javascript/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```

- [x] Task 39. Add the section to the root landing page — `modules/ROOT/pages/index.adoc` updated.
  - [x] Task 39.1. Update `modules/ROOT/pages/index.adoc`'s `== Other` section, updating the existing "Web
    Development" nested bullet list to add a second child entry after "HTML & CSS Reference":
    ```
    ** xref:web/javascript/index.adoc[JavaScript Development] -- modern ECMAScript, core browser APIs, and the
      surrounding tooling ecosystem (ESLint, Jest, Babel, npm), plus a downloadable cheat sheet.
    ```

- [x] Task 40. Final build verification — `npx antora antora-playbook.yml` passed cleanly (exit 0, zero
  warnings after fixing two stray `{...}`-as-attribute-reference spots flagged as warnings in `stdlib-regexp.adoc`
  and `tooling-babel.adoc`); all 35 pages, nav/index wiring, mermaid diagrams, and the PDF attachment verified.
  - [x] Task 40.1. Delegate to the `iru-gate-runner` agent to invoke `Skill({skill: "iru-build-docs"})` and confirm
    the full site builds cleanly (no `xref`/AsciiDoc errors, particularly for every new cross-reference added
    across Groups 2–6, and correct rendering of all mermaid diagrams and the new PDF attachment), reporting back
    only a pass/fail summary and any error list rather than the full build log. Fix any reported errors before
    considering this task complete.
