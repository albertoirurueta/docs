# Implementation Plan: Web Development / TypeScript Reference

## Task summary

Source: GitHub issue #35

Issue [#35](https://github.com/albertoirurueta/docs/issues/35) ("TypeScript Reference") asks to add a new
**"TypeScript Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/typescript/` — a tenth sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, `web/react/`, `web/angular/`, `web/aspnet/`, and
`web/tailwind/`. It documents the **TypeScript language itself**, framework-agnostic, as published at
https://www.typescriptlang.org/docs/ — the type system and structural typing, everyday types, unions and
control-flow narrowing, objects/interfaces, functions, arrays/tuples, classes, generics, type-level programming
(`keyof` / `typeof` / indexed-access / conditional / mapped / template-literal types), the built-in utility
types, assertions and `satisfies` and the top types, enums vs. literal unions, modules and module resolution and
namespaces, declaration files and `@types` / DefinitelyTyped, JavaScript interop and gradual migration,
`tsconfig.json` and the compiler options, project references and build/performance, decorators (TC39 standard +
legacy), a short JSX bridge, async / iterators / generators, type-design best practices, an end-to-end worked
migration example, plus a one-page downloadable PDF cheat sheet. Explanations must be brief and example-driven,
every concept must carry at least one runnable code example (`[source,ts]` / `[source,tsx]` / `[source,json]` /
`[source,bash]` / `[source,console]`) and a link to the specific page on https://www.typescriptlang.org/docs/
(or `/tsconfig/`), and `[mermaid]` diagrams and/or hand-authored inline SVG figures are used where they clarify a
concept.

Three PDF books were consulted while planning this section — **all three are O'Reilly Media titles**, and each is
cited **only as a bibliography entry**, never as the "primary" or "main" reference (matching the Angular / ASP.NET
/ Tailwind disclaimers' "third variant" wording, and unlike the jQuery / React ones):

- `~/Desktop/book1.pdf` — *Learning TypeScript — Enhance Your Web Development Skills Using Type-Safe JavaScript*,
  Josh Goldberg, O'Reilly Media, First edition, June 2022, ISBN 978-1-098-11033-8, ~320 pp / 15 chapters in four
  parts (guided beginner→advanced tutorial with end-of-chapter projects; targets roughly **TypeScript 4.7**).
  Publisher page: https://www.oreilly.com/library/view/learning-typescript/9781098110321/ ; publisher home:
  https://www.oreilly.com/ ; author's companion site with a free online edition:
  https://www.learningtypescript.com/
- `~/Desktop/book2.pdf` — *Programming TypeScript — Making Your JavaScript Applications Scale*, Boris Cherny,
  O'Reilly Media, First edition, May 2019, ISBN 978-1-492-03765-1, ~322 pp / 13 chapters + 7 appendices (deepest
  on type theory — variance, totality, type-level programming — plus async/parallelism, error-handling patterns,
  frameworks; targets roughly **TypeScript 3.x**). Publisher page:
  https://www.oreilly.com/library/view/programming-typescript/9781492037644/ ; publisher home:
  https://www.oreilly.com/
- `~/Desktop/book3.pdf` — *Effective TypeScript — 83 Specific Ways to Improve Your TypeScript*, **Second
  edition**, Dan Vanderkam, O'Reilly Media, May 2024, ISBN 978-1-098-15506-3, ~400 pp / 83 numbered "Items" in 10
  chapters (idioms / best-practices, *Effective Java* style; updated for **TypeScript ~5.x**). Publisher page:
  https://www.oreilly.com/library/view/effective-typescript-2nd/9781098155056/ ; publisher home:
  https://www.oreilly.com/ ; author's companion site: https://effectivetypescript.com/

https://www.typescriptlang.org/docs/ is the source every page is written and verified against. **All three books
predate the current TypeScript release line** (the 6.x line and the native "7.0" port were current as of 2026;
language semantics are continuous from 5.x), so where a book and the current docs disagree — legacy
`experimentalDecorators` vs. the TC39 **standard decorators**, `moduleResolution` defaults, the absence of
`satisfies` / `const` type parameters / `NoInfer<T>` / `using` explicit resource management / the `${configDir}`
tsconfig substitution / `--isolatedDeclarations`, etc. — **the official documentation wins** and the difference is
noted (concentrated on `type-assertions-and-modifiers.adoc`, `decorators-and-metadata.adoc`, `modules.adoc`,
`tsconfig-and-compiler-options.adoc`, and `javascript-interop.adoc`). Documentation prose must be written as
original explanation verified against the official docs, **not** presented as derived from the books; the books
appear only in `== Bibliography` and the disclaimer's "consulted while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, and Tailwind reference sections. The closest and most direct precedent is
[.archive/implementation_plan_33.md](.archive/implementation_plan_33.md) (issue #33, "Tailwind Reference"): a new
Web Development sibling grounded in an official doc site plus reference books that are bibliography-only and
predate the current version, with mermaid diagrams, hand-authored SVG figures, a `== Bibliography`, and a
headless-Chrome-rendered one-page PDF cheat sheet, organised into four task groups (scaffold the disclaimer →
parallel content pages → cheat sheet → section index + nav/landing wiring + build verification).

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's pattern and the issue text — stated here so they can be challenged during review)

1. **Document the current TypeScript release line as published at https://www.typescriptlang.org/docs/**, not
   pinned to a patch version. Examples use modern idioms: `satisfies`, standard (TC39) decorators as the default
   with `experimentalDecorators` shown as the legacy path, `const` type parameters and `NoInfer<T>` where
   relevant, `import type` / `verbatimModuleSyntax`, the `node16` / `nodenext` / `bundler` `moduleResolution`
   values, `using` / `await using` mentioned, and `strict` assumed on. Where a book uses an older pattern, the
   page documents the current approach and notes the change.
2. **Page breakdown: 23 content pages + 1 cheat sheet + 1 section index (25 `.adoc` files).** Issue #35's page
   list is followed **as-is** — every page maps to a distinct area of the official docs and to real book
   chapters/items, so no merges are applied (unlike Tailwind's Tables→layout fold). `jsx-and-frameworks.adoc`
   stays a deliberately short bridge page (like `preflight-and-base-styles.adoc` in the Tailwind section);
   `async-and-iterators.adoc` stays separate because the books devote whole chapters to it.
3. **All three books promoted to bibliography-only.** Neither the disclaimer nor any per-page admonition may
   describe any book as the primary or main reference; they appear only as `== Bibliography` entries and in the
   disclaimer's "consulted while preparing these pages" clause. Documentation prose is original explanation
   verified against the official docs.
4. **The subsection is named "TypeScript Reference"** in the section index title, the `web/index.adoc` bullet, the
   `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings.
5. **Placed last**, after Tailwind Reference, in `nav.adoc`, `web/index.adoc`, and the root `index.adoc` — the
   same "append in the order added" ordering every prior subsection followed.
6. **Mermaid is the default for flow/decision diagrams; six hand-authored SVGs** where a spatial figure is
   clearer than a flowchart: `typescript-structural-typing.svg` (two independently-declared object types
   assignable because their members line up, vs. nominal), `typescript-types-as-sets.svg` (an Euler diagram
   `never ⊂ literal ⊂ union ⊂ primitive ⊂ unknown`, with `&` = intersection / `|` = union), `typescript-narrowing-flow.svg`
   (one variable's type at successive points through `typeof` / truthy / `in` / `instanceof` / discriminant
   checks), `typescript-any-unknown-never.svg` (assignability arrows into and out of `any` / `unknown` / `never`),
   `typescript-declaration-files.svg` (your `.ts` → `.d.ts`; a JS dependency + its `@types/*` package; ambient
   `declare module`), and `typescript-migration-ladder.svg` (the `allowJs` → `checkJs`/`@ts-check` + JSDoc →
   rename `.ts` → `noImplicitAny` → full `strict` staircase). Mermaid covers: the compile pipeline
   (`.ts` → parse → bind → type-check → transform → emit `.js` + `.d.ts` + `.js.map`, with the "type errors don't
   block emit unless `noEmitOnError`" callout), the `type` vs. `interface` decision, the `moduleResolution`
   decision, and a `tsc -b` project-references graph. The implementer may add further small `typescript-*.svg`
   figures under `modules/ROOT/images/` while writing a page if one adds real value — not pre-planned as separate
   tasks. No diagram where a short code block is clearer.
7. **Cross-reference existing pages instead of duplicating them** — the framework-specific typing already covered
   in `xref:web/react/typescript.adoc[]` ("TypeScript with React") and
   `xref:web/angular/typescript-essentials.adoc[]` ("TypeScript Essentials for Angular"), and the runtime-language
   material in `xref:web/javascript/types.adoc[]`, `xref:web/javascript/classes.adoc[]`,
   `xref:web/javascript/modules.adoc[]`, `xref:web/javascript/async-javascript.adoc[]`,
   `xref:web/javascript/iterators-generators.adoc[]`, `xref:web/javascript/objects-destructuring.adoc[]`,
   `xref:web/javascript/tooling-babel.adoc[]`, and
   `xref:web/javascript/tooling-bundling-npm-publishing.adoc[]` — are linked, never restated. Specific per-page
   cross-links are listed in each task below.
8. **No "quiz"/"related questions" page** — book 1 has end-of-chapter projects and book 2 has chapter-end
   exercises, but that is not this repo's section pattern (the jQuery section carried one only because its issue
   explicitly asked for it). The `worked-example.adoc` page is the single "putting it together" page.
9. **No project-picker icon/xref** for TypeScript Reference — like the other Web Development subsections it lives
   only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    static checked-in asset at `modules/ROOT/attachments/typescript-cheat-sheet.pdf`, linked via
    `xref:attachment$typescript-cheat-sheet.pdf[Download the TypeScript Cheat Sheet (PDF)]`. The cheat sheet must
    be **exactly one A4 page** (page-count check + a rendered preview with no clipping).

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no lint/test
  suite). Installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none applies**; every
  task below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left **untagged**.
- **Web Development** ([modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc)) currently lists
  two standalone pages (`web/cors.adoc`, `web/accessibility.adoc`) then nine subsections: **HTML & CSS
  Reference**, **Sass Reference**, **JavaScript Development**, **Bootstrap Reference**, **jQuery Reference**,
  **React Reference**, **Angular Reference**, **ASP.NET Reference**, **Tailwind Reference**. All follow one
  structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` / `====` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. [modules/ROOT/partials/tailwind-disclaimer.adoc](modules/ROOT/partials/tailwind-disclaimer.adoc),
    `aspnet-disclaimer.adoc`, and `angular-disclaimer.adoc` are the **"third variant"** to follow: the official
    site is the reference the pages are written and verified against; the book(s) are named **only as bibliography
    entries**, not the primary source, and are noted to predate the current major version.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph. Body uses `[source,ts]` /
    `[source,json]` / etc. fenced by `----`, `[mermaid]` blocks for diagrams, and
    `image::<name>.svg[alt,width=…,role=text-center]` for figures (see
    `modules/ROOT/pages/web/tailwind/states-and-variants.adoc` and
    `modules/ROOT/pages/web/aspnet/dependency-injection.adoc` for the exact idiom).
  - A section `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    [modules/ROOT/pages/web/tailwind/index.adoc](modules/ROOT/pages/web/tailwind/index.adoc) and
    `modules/ROOT/pages/web/aspnet/index.adoc` for the exact format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (existing: `html-css-`, `sass-`, `javascript-`, `bootstrap-`,
    `jquery-`, `react-`, `angular-`, `aspnet-`, `tailwind-`, `sql-cheat-sheet.pdf`). **No HTML source for these
    PDFs is kept in the repo** — only the rendered PDF is committed.
  - [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) lists `Web Development` (`**` under `* Guides & References`)
    with each subsection (`***`) and its own detail pages (`****`). The **Tailwind block is currently last**,
    ending the file (line ~230) `**** xref:web/tailwind/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    (lines ~77–112) lists Web Development with its subsections nested one level under it (`**`), Tailwind
    Reference last (line ~109).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used in this
  repo), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute is set; existing pages
  use `[source,html]` / `[source,css]` / `[source,javascript]` and render fine. `modules/ROOT/images/` holds
  the existing hand-authored `*.svg` figures (`tailwind-*.svg`, `aspnet-*.svg`, `angular-*.svg`, `react-*.svg`,
  `box-model.svg`, …); `modules/ROOT/attachments/` holds the cheat-sheet PDFs.
- **Existing TypeScript-adjacent pages to cross-link, not duplicate**:
  [modules/ROOT/pages/web/react/typescript.adoc](modules/ROOT/pages/web/react/typescript.adoc) ("TypeScript with
  React"), [modules/ROOT/pages/web/angular/typescript-essentials.adoc](modules/ROOT/pages/web/angular/typescript-essentials.adoc)
  ("TypeScript Essentials for Angular"), and the JavaScript Development pages
  `modules/ROOT/pages/web/javascript/{types,classes,modules,async-javascript,iterators-generators,objects-destructuring,tooling-babel,tooling-bundling-npm-publishing}.adoc`.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` / `_25.md` / `_27.md` / `_29.md` / `_31.md` /
  `_33.md`): inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference and emits
  a "skipping reference to missing attribute" build **warning**. This is acute for TypeScript prose, which is
  full of mapped-type braces (`\{ [K in keyof T]: T[K] }`), `$\{configDir}`, template-literal type bodies,
  object-type literals in prose, and `Record<K, V>` / `Partial<T>` generics written inline. **Escape any literal
  braces in prose as `\{ … }`**. Inside `[source,…]` blocks **no escaping is needed**. Angle brackets
  (`Array<T>`, `Promise<T>`) and square brackets (`T['prop']`, `[number, string]`) in prose are fine unescaped.
  The final build (Task 29) must come back with **zero** such warnings.
- **`[source]` language tokens**: `[source,ts]` for TypeScript, `[source,tsx]` for JSX, `[source,js]` for
  plain-JavaScript / JSDoc contrasts, `[source,json]` for `tsconfig.json` / `package.json`, `[source,bash]` for
  `tsc` / `npm` / `npx` commands, `[source,console]` for compiler-error output. If a token ever produces a build
  issue, fall back progressively (`ts` → `typescript` → `js` → `text`; `tsx` → `jsx` → `text`;
  `console` → `text`) — verified by the Task 29 build.
- **New file map** this plan creates under `modules/ROOT/pages/web/typescript/` (all `.adoc`, 25 files):
  `getting-started.adoc`, `the-type-system.adoc`, `everyday-types.adoc`, `unions-and-narrowing.adoc`,
  `objects-and-interfaces.adoc`, `functions.adoc`, `arrays-and-tuples.adoc`, `classes.adoc`, `generics.adoc`,
  `type-manipulation.adoc`, `utility-types.adoc`, `type-assertions-and-modifiers.adoc`,
  `enums-and-literal-alternatives.adoc`, `modules.adoc`, `declaration-files.adoc`, `javascript-interop.adoc`,
  `tsconfig-and-compiler-options.adoc`, `project-references-and-build.adoc`, `decorators-and-metadata.adoc`,
  `jsx-and-frameworks.adoc`, `async-and-iterators.adoc`, `type-design-and-best-practices.adoc`,
  `worked-example.adoc`, `cheat-sheet.adoc`, `index.adoc`. Plus
  `modules/ROOT/partials/typescript-disclaimer.adoc`, the six hand-authored SVGs under `modules/ROOT/images/`
  (`typescript-structural-typing.svg`, `typescript-types-as-sets.svg`, `typescript-narrowing-flow.svg`,
  `typescript-any-unknown-never.svg`, `typescript-declaration-files.svg`, `typescript-migration-ladder.svg`),
  `modules/ROOT/attachments/typescript-cheat-sheet.pdf`, and edits to
  [modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc),
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), and
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc).

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then a
  blank line, then `include::partial$typescript-disclaimer.adoc[]`, then a blank line, then a one/two-sentence
  lead paragraph — identical placement to `include::partial$tailwind-disclaimer.adoc[]` in
  `modules/ROOT/pages/web/tailwind/index.adoc`.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** — `[source,ts]` /
  `[source,tsx]` / `[source,json]` / `[source,bash]` / `[source,console]` as appropriate.
- **Every concept links to the specific https://www.typescriptlang.org/docs/… (or /tsconfig/…) page** for it
  (inline `https://www.typescriptlang.org/docs/…[link text]`), not just a generic "see the TypeScript docs".
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Prefer **modern TypeScript** everywhere: `satisfies`, standard decorators (legacy shown as legacy), `import
  type`, the current `moduleResolution` values, `strict` assumed on. Where a book uses an older pattern,
  document the current one and note the change.
- Diagrams via `[mermaid]` blocks; figures via `image::typescript-*.svg[alt,width=…,role=text-center]` with the
  SVG hand-authored under `modules/ROOT/images/`.
- Do **not** duplicate `xref:web/react/typescript.adoc[]` or `xref:web/angular/typescript-essentials.adoc[]` —
  link to them. Cross-link the JavaScript Development pages for the runtime language.
- The full per-page concept checklist and official-link list is in issue #35's "Pages to create" section — each
  task below references its issue page number; implement every bullet the issue lists for that page.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the TypeScript disclaimer partial — `modules/ROOT/partials/typescript-disclaimer.adoc`
  - [x] Task 1.1. Create `modules/ROOT/partials/typescript-disclaimer.adoc` as an `[IMPORTANT]` admonition
    (`[IMPORTANT]` then `====` … `====`) following the shape of
    `modules/ROOT/partials/tailwind-disclaimer.adoc`. It must state:
    - this section documents **the current TypeScript release line** as published at
      https://www.typescriptlang.org/docs/[the official TypeScript documentation], **which is the reference these
      pages are written and verified against**; no specific patch version is pinned;
    - the content was generated with the assistance of AI and should be verified against
      https://www.typescriptlang.org/docs/[the official documentation] before being relied on in production,
      since TypeScript iterates quickly;
    - *Learning TypeScript* (Josh Goldberg, O'Reilly, 2022), *Programming TypeScript* (Boris Cherny, O'Reilly,
      2019), and *Effective TypeScript*, 2nd ed. (Dan Vanderkam, O'Reilly, 2024) are **listed in this section's
      bibliography** and were consulted while preparing these pages — worded so it does **not** state or imply any
      book is the primary or main reference — and **all three predate the current release line** (they target
      roughly TS 4.7 / 3.x / 5.x respectively), so on any discrepancy the official documentation wins and the
      difference is noted.
  - [x] Task 1.2. Confirm it is included via `include::partial$typescript-disclaimer.adoc[]` on every page
    created in Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` /
    `:keywords:` block and one blank line — identical syntax/placement to
    `include::partial$tailwind-disclaimer.adoc[]` in `modules/ROOT/pages/web/tailwind/index.adoc`. Record the
    exact opening shape for Groups 2–4:
    1. `= <Page Title>`
    2. `:description: <one-line description>`
    3. `:keywords: <comma-separated keywords>`
    4. one blank line
    5. `include::partial$typescript-disclaimer.adoc[]` (verbatim, its own line, flush left, no attributes)
    6. one blank line
    7. page body begins

### Group 2 — Content pages

**Parallelizable: yes** — 23 independent pages (Tasks 2–24). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` pages and the other new pages in this plan (cross-links between the new
pages are fine to write now — every target is listed in this plan and validated together in Task 29), but
**none depends on another new page's content**. Each page follows the "Conventions" section above and implements
every bullet the referenced issue #35 page lists. Six tasks also create a hand-authored SVG as a sub-task.

- [x] Task 2. Create `modules/ROOT/pages/web/typescript/getting-started.adoc` (issue #35 page 1; book 1 ch. 1–2;
  book 2 ch. 1–2; book 3 items 1, 3)
  - [x] Task 2.1. TypeScript as an **erasable typed superset** of JavaScript — "types are checked, then
    stripped"; no runtime types, no runtime cost; **code generation is independent of type-checking** (errors
    don't block emit by default). `[source,ts]` + `[source,js]` (the emitted output).
  - [x] Task 2.2. Install & first compile: `npm i -D typescript`, `npx tsc --init`, `npx tsc`, `npx tsc --watch`;
    a one-file `hello.ts`; running the output with Node, plus type-stripping runners (`ts-node`, `tsx`, Node
    `--experimental-strip-types`, Deno, Bun) with the caveat that they run but do **not** type-check.
    `[source,bash]` + `[source,ts]`.
  - [x] Task 2.3. The Playground (https://www.typescriptlang.org/play/) and the editor experience (VS Code ships
    the TS language service; "use your editor to interrogate the type system").
  - [x] Task 2.4. What TypeScript is **not**: not a runtime, not a linter, not a rewrite of your logic, not
    slower JS.
  - [x] Task 2.5. A `[mermaid]` flowchart of the compile pipeline: `.ts` → parse → bind → **type-check**
    (errors) → transform (strip types, downlevel) → emit `.js` + `.d.ts` + `.js.map`, with a callout that type
    errors do **not** block emit unless `noEmitOnError` is set. Links:
    https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html,
    https://www.typescriptlang.org/docs/handbook/2/basic-types.html,
    https://www.typescriptlang.org/download/, https://www.typescriptlang.org/play/.

- [x] Task 3. Create `modules/ROOT/pages/web/typescript/the-type-system.adoc` (issue #35 page 2; book 1 ch. 2;
  book 2 ch. 6 "Relationships Between Types"; book 3 items 4, 6, 7, 8, 9)
  - [x] Task 3.1. **Structural typing** ("if it has the right shape, it fits") vs. nominal typing;
    excess-property checking as the exception; assignability and how to read assignability errors. `[source,ts]`.
  - [x] Task 3.2. **Types as sets of values**: `never` (∅) → literal → union → primitive → `unknown`; `&` narrows
    (intersection), `|` widens (union); `A extends B` ≈ "A is a subset of B". `[source,ts]`.
  - [x] Task 3.3. **Type space vs. value space**: the same identifier meaning different things in a `type`
    position and an expression position; `typeof x` (value→type) vs. the JS runtime `typeof`. `[source,ts]`.
  - [x] Task 3.4. **Inference vs. annotation vs. assertion**: prefer inference; annotate signatures and empty
    containers; prefer annotations to `as`; where annotations are just noise; `let` vs `const` literal widening.
    `[source,ts]`.
  - [x] Task 3.5. Embed `image::typescript-structural-typing.svg[…]` (Task 3.7) and
    `image::typescript-types-as-sets.svg[…]` (Task 3.8). Links:
    https://www.typescriptlang.org/docs/handbook/type-compatibility.html,
    https://www.typescriptlang.org/docs/handbook/type-inference.html,
    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions.
  - [x] Task 3.6. _(placeholder — no sub-task; numbering continues at 3.7)_
  - [x] Task 3.7. Create `modules/ROOT/images/typescript-structural-typing.svg` — hand-authored, following the
    existing SVG convention (`box-model.svg`, `tailwind-class-anatomy.svg`): two independently-declared object
    types (`Point` / `Vec2`) with their member lists lined up, an "assignable ↔" between them, and a crossed-out
    nominal-typing comparison.
  - [x] Task 3.8. Create `modules/ROOT/images/typescript-types-as-sets.svg` — hand-authored Euler diagram: nested
    ovals `unknown ⊃ primitive (string) ⊃ union ('a' | 'b') ⊃ literal ('a') ⊃ never`, with side notes `&` =
    overlap, `|` = combined area.

- [x] Task 4. Create `modules/ROOT/pages/web/typescript/everyday-types.adoc` (issue #35 page 3; book 1 ch. 2–3;
  book 2 ch. 3; book 3 items 10, 18)
  - [x] Task 4.1. `string` / `number` / `boolean` / `bigint` / `symbol` / `null` / `undefined`; **object wrapper
    types** (`String`, `Number`, …) and why to avoid them. `[source,ts]`.
  - [x] Task 4.2. `Array<T>` / `T[]`, `ReadonlyArray<T>` / `readonly T[]`, tuple basics (deep treatment on the
    arrays page). `[source,ts]`.
  - [x] Task 4.3. Object type literals, optional (`?`) properties, `readonly` properties, method vs. property
    syntax. `[source,ts]`.
  - [x] Task 4.4. `any` (opt-out, use sparingly) and `unknown` (safe unknown); `void`; `never` intro.
    `[source,ts]`.
  - [x] Task 4.5. **Literal types** and literal inference; `as const`; `let` / `const` and destructuring
    annotations. `[source,ts]`. Cross-link `xref:web/javascript/objects-destructuring.adoc[]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html,
    https://www.typescriptlang.org/docs/handbook/variable-declarations.html,
    https://www.typescriptlang.org/docs/handbook/symbols.html.

- [x] Task 5. Create `modules/ROOT/pages/web/typescript/unions-and-narrowing.adoc` (issue #35 page 4; book 1
  ch. 3; book 2 ch. 6 "Refinement"; book 3 items 22, 20, 25, 24)
  - [x] Task 5.1. Declaring unions; accessing only the **common** members; the "billion-dollar mistake" and
    `strictNullChecks`. `[source,ts]`.
  - [x] Task 5.2. Narrowing guards: `typeof`, truthiness, equality / `===`, `in`, `instanceof`, assignment
    narrowing, and **control-flow analysis** (the type at each point). `[source,ts]`.
  - [x] Task 5.3. **Discriminated (tagged) unions**; the `default:` + `assertNever(x: never)` **exhaustiveness**
    check. `[source,ts]`.
  - [x] Task 5.4. **Type predicates** (`x is Fish`) and **assertion functions** (`asserts x is …`, `asserts x`);
    "evolving" `any` from an un-annotated `let`. `[source,ts]`.
  - [x] Task 5.5. Aliasing narrowed values consistently; narrowing not surviving a function boundary (extract a
    guard). `[source,ts]`.
  - [x] Task 5.6. Embed `image::typescript-narrowing-flow.svg[…]` (Task 5.7). Links:
    https://www.typescriptlang.org/docs/handbook/2/narrowing.html,
    https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions,
    https://www.typescriptlang.org/docs/handbook/2/narrowing.html#assertion-functions.
  - [x] Task 5.7. Create `modules/ROOT/images/typescript-narrowing-flow.svg` — hand-authored: a vertical strip
    for one parameter `x: string | number | null`, with the narrowed type annotated after each of
    `if (x == null) return` / `typeof x === "string"` / `else` branches.

- [x] Task 6. Create `modules/ROOT/pages/web/typescript/objects-and-interfaces.adoc` (issue #35 page 5; book 1
  ch. 4, 7; book 2 ch. 5; book 3 items 13, 11, 14, 16, 17, 31, 37)
  - [x] Task 6.1. `interface` vs. `type` alias — the decision, the differences (merging, `extends` vs `&`, what
    each can express), "pick one and be consistent". `[source,ts]`.
  - [x] Task 6.2. Property modifiers: optional `?`, `readonly`, index signatures (`[key: string]: T`) and **more
    precise alternatives** (`Record`, mapped types, `Map`); why numeric index signatures are a trap.
    `[source,ts]`.
  - [x] Task 6.3. Excess-property checking vs. plain assignability; nested types; `extends` (single & multiple);
    overridden properties. `[source,ts]`.
  - [x] Task 6.4. Call signatures, construct signatures, hybrid types; **interface declaration merging** and
    global interface merging (augmenting `Window`). `[source,ts]`.
  - [x] Task 6.5. `readonly` for mutation safety; don't repeat type info in doc comments. `[source,ts]`. A
    `[mermaid]` of the `type` vs. `interface` decision. Links:
    https://www.typescriptlang.org/docs/handbook/2/objects.html,
    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces,
    https://www.typescriptlang.org/docs/handbook/declaration-merging.html.

- [x] Task 7. Create `modules/ROOT/pages/web/typescript/functions.adoc` (issue #35 page 6; book 1 ch. 5; book 2
  ch. 4; book 3 items 12, 24, 38, 48, 69)
  - [x] Task 7.1. Parameter & return annotations; when to infer the return type vs. state it; **typing the whole
    function expression** with a type alias. `[source,ts]`.
  - [x] Task 7.2. Optional (`?`), default, and **rest** parameters; parameter destructuring with types; avoiding
    repeated same-type parameters (pass an object). `[source,ts]`.
  - [x] Task 7.3. `void` return (and the "a `void`-returning callback may return anything" rule), `never` return;
    `this` parameters and typing `this` in callbacks. `[source,ts]`.
  - [x] Task 7.4. **Call signatures**, **construct signatures**, and **function overloads** — and preferring a
    union / conditional type / generics to overloads where possible. `[source,ts]`.
  - [x] Task 7.5. **Contextual typing** (parameters inferred from the expected type). `[source,ts]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/functions.html,
    https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads,
    https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function.

- [x] Task 8. Create `modules/ROOT/pages/web/typescript/arrays-and-tuples.adoc` (issue #35 page 7; book 1 ch. 6;
  book 2 ch. 3; book 3 items 62, 16)
  - [x] Task 8.1. `T[]` vs `Array<T>`; readonly arrays; the **unsound member access** caveat (`arr[i]` is `T`,
    not `T | undefined`, unless `noUncheckedIndexedAccess`); evolving `any[]`. `[source,ts]`.
  - [x] Task 8.2. **Tuples**: fixed-length typed positions, optional (`[number, number?]`) and rest
    (`[string, ...number[]]`) elements, `readonly` tuples, labelled tuple elements, `as const` tuples.
    `[source,ts]`.
  - [x] Task 8.3. **Variadic tuple types** and rest parameters to model variadic functions; tuple inference
    caveats and `as const`; spreads and rests in calls and literals. `[source,ts]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types,
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types,
    https://www.typescriptlang.org/tsconfig/#noUncheckedIndexedAccess.

- [x] Task 9. Create `modules/ROOT/pages/web/typescript/classes.adoc` (issue #35 page 8; book 1 ch. 8; book 2
  ch. 5; book 3 items 8, 28, 51)
  - [x] Task 9.1. Fields, methods, getters/setters; field **initialization checking** and the
    definite-assignment `!:`; optional and `readonly` fields. `[source,ts]`.
  - [x] Task 9.2. **Visibility**: `public` / `protected` / `private` (compile-time) vs. JS `#private` (runtime);
    `static` members and `static` blocks; `abstract` classes and members. `[source,ts]`.
  - [x] Task 9.3. **Parameter properties** (`constructor(private readonly x: number)`). `[source,ts]`.
  - [x] Task 9.4. `implements` vs. `extends`; overriding members and `override`; a class declares **both a value
    and a type**; `this` types and polymorphic `this` return. `[source,ts]`.
  - [x] Task 9.5. Generic classes (full treatment on the generics page); the **mixin** pattern. `[source,ts]`.
    Cross-link `xref:web/javascript/classes.adoc[]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/classes.html,
    https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties,
    https://www.typescriptlang.org/docs/handbook/mixins.html.

- [x] Task 10. Create `modules/ROOT/pages/web/typescript/generics.adoc` (issue #35 page 9; book 1 ch. 10; book 2
  ch. 4 "Polymorphism"; book 3 items 50, 51, 52, 53)
  - [x] Task 10.1. Generic **functions**, **interfaces**, **classes**, and **type aliases**; where type
    parameters can be declared and when they're **bound** (inferred at call time). `[source,ts]`.
  - [x] Task 10.2. **Constraints** (`<T extends HasLength>`), **defaults** (`<T = string>`), multiple type
    parameters, `keyof` + constrained parameters. `[source,ts]`.
  - [x] Task 10.3. **Generic inference** and how to guide it; **`const` type parameters** (`<const T>`) and
    **`NoInfer<T>`**. `[source,ts]`.
  - [x] Task 10.4. "Generics as functions between types"; the **golden rule** (a type parameter must appear at
    least twice / relate two positions); avoiding unnecessary type parameters; naming conventions. `[source,ts]`.
  - [x] Task 10.5. `Promise<T>` typing and `async` functions returning `Promise` (detail on the async page).
    `[source,ts]`. Links: https://www.typescriptlang.org/docs/handbook/2/generics.html,
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters,
    https://www.typescriptlang.org/docs/handbook/utility-types.html#noinfertype.

- [x] Task 11. Create `modules/ROOT/pages/web/typescript/type-manipulation.adoc` (issue #35 page 10; book 1
  ch. 15; book 2 ch. 6 "Advanced Types"; book 3 items 15, 52, 53, 54, 55, 56, 57)
  - [x] Task 11.1. **`keyof`**, **`typeof`** (type query), **indexed access types** (`T['prop']`, `T[number]`).
    `[source,ts]`.
  - [x] Task 11.2. **Conditional types** (`T extends U ? X : Y`), **`infer`**, **distributive** conditionals over
    unions and turning distribution off (`[T] extends [U]`). `[source,ts]`.
  - [x] Task 11.3. **Mapped types** (`\{ [K in keyof T]: … }`), adding/removing `?` and `readonly` (`+` / `-`),
    **key remapping via `as`**, `Record`. `[source,ts]`.
  - [x] Task 11.4. **Template literal types**, key remapping with them, and the intrinsic `Uppercase` /
    `Lowercase` / `Capitalize` / `Uncapitalize`. `[source,ts]`.
  - [x] Task 11.5. `never` in unions/intersections/conditionals/mapped types; **testing your types**
    (`@ts-expect-error`, `expect-type` / `tsd`); "pay attention to how types display"; tail-recursive generic
    types and the instantiation-depth limit. `[source,ts]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/types-from-types.html,
    https://www.typescriptlang.org/docs/handbook/2/conditional-types.html,
    https://www.typescriptlang.org/docs/handbook/2/mapped-types.html,
    https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html.

- [x] Task 12. Create `modules/ROOT/pages/web/typescript/utility-types.adoc` (issue #35 page 11; book 1 ch. 15 as
  applications; book 2 Appendix B; book 3 items 15, 61)
  - [x] Task 12.1. Object-shape: `Partial` / `Required` / `Readonly` / `Record` / `Pick` / `Omit`. `[source,ts]`.
  - [x] Task 12.2. Union algebra: `Exclude` / `Extract` / `NonNullable`. `[source,ts]`.
  - [x] Task 12.3. Function / class reflection: `Parameters` / `ConstructorParameters` / `ReturnType` /
    `InstanceType` / `ThisParameterType` / `OmitThisParameter` / `Awaited`. `[source,ts]`.
  - [x] Task 12.4. String literals: `Uppercase` / `Lowercase` / `Capitalize` / `Uncapitalize`; inference control
    `NoInfer<T>`; a short "how each is implemented" note tying back to
    `xref:web/typescript/type-manipulation.adoc[]`; `Record` to keep two values in sync. `[source,ts]`. Link
    https://www.typescriptlang.org/docs/handbook/utility-types.html.

- [x] Task 13. Create `modules/ROOT/pages/web/typescript/type-assertions-and-modifiers.adoc` (issue #35 page 12;
  book 1 ch. 9; book 2 ch. 6 "Escape Hatches"; book 3 items 9, 43, 44, 45, 46, 49)
  - [x] Task 13.1. `as` assertions and the two-step `as unknown as T`; the "assertions can't lie too much" rule;
    asserting caught-error types (`catch (e)` is `unknown`). `[source,ts]`.
  - [x] Task 13.2. **Non-null assertion** `!`; **definite-assignment assertion** `!:`. `[source,ts]`.
  - [x] Task 13.3. **`const` assertions** (`as const`): literal-to-narrowest, `readonly` everywhere, tuple
    freezing. `[source,ts]`.
  - [x] Task 13.4. **`satisfies`**: check a value against a type **without widening it** — the modern replacement
    for many annotation / `as` pairs. `[source,ts]`.
  - [x] Task 13.5. **`any` vs `unknown` vs `never`** as top/bottom types; keep `any` at the **narrowest scope**;
    prefer precise variants (`any[]`, `(...args: any[]) => any`); hide unavoidable unsafe assertions inside
    well-typed functions; **track type coverage** (`type-coverage`). `[source,ts]`.
  - [x] Task 13.6. Embed `image::typescript-any-unknown-never.svg[…]` (Task 13.7). Links:
    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions,
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator,
    https://www.typescriptlang.org/docs/handbook/2/functions.html#assertion-functions.
  - [x] Task 13.7. Create `modules/ROOT/images/typescript-any-unknown-never.svg` — hand-authored: three labelled
    boxes with assignability arrows — everything → `unknown` (in only), `any` ↔ everything (both ways, marked
    "unsafe"), `never` → everything (out only).

- [x] Task 14. Create `modules/ROOT/pages/web/typescript/enums-and-literal-alternatives.adoc` (issue #35 page 13;
  book 1 ch. 14; book 2 ch. 3 §Enums; book 3 item 36)
  - [x] Task 14.1. Numeric enums (auto-increment), string enums, heterogeneous enums; reverse mappings (numeric
    only); `const enum` and why it's discouraged (`isolatedModules`, `--erasableSyntaxOnly`, bundlers).
    `[source,ts]`.
  - [x] Task 14.2. The **non-erasable** caveat: `enum` emits real runtime code, unlike the rest of the type
    layer. `[source,ts]` + `[source,js]` (emitted output).
  - [x] Task 14.3. The common alternative: a **union of string literals** + an `as const` object
    (`typeof Obj[keyof typeof Obj]`); trade-offs. `[source,ts]`. Links:
    https://www.typescriptlang.org/docs/handbook/enums.html,
    https://www.typescriptlang.org/docs/handbook/enums.html#const-enums.

- [x] Task 15. Create `modules/ROOT/pages/web/typescript/modules.adoc` (issue #35 page 14; book 1 ch. 14
  §type-only; book 2 ch. 10; book 3 items 72, 79)
  - [x] Task 15.1. ES module `import` / `export`, default vs. named, re-exports, `import()` **dynamic import**;
    module vs. script mode; top-level `await`. `[source,ts]`.
  - [x] Task 15.2. **`import type` / `export type`** and inline `type` specifiers; **`verbatimModuleSyntax`**;
    `isolatedModules`. `[source,ts]`.
  - [x] Task 15.3. **`moduleResolution`**: `node16` / `nodenext` / `bundler` / `classic`; `module`; `paths` /
    `baseUrl` mapping (and that `tsc` doesn't rewrite them); `resolveJsonModule`; package `exports` / `imports`,
    the `types` condition, `.js` import specifiers in `.ts` source. `[source,json]` + `[source,ts]`.
  - [x] Task 15.4. **CJS ⇄ ESM interop**: `esModuleInterop`, `allowSyntheticDefaultImports`, default-import
    pitfalls. `[source,ts]`.
  - [x] Task 15.5. **Ambient module declarations** (`declare module "name"`), wildcard module declarations
    (`*.css`). `[source,ts]`.
  - [x] Task 15.6. **Namespaces** (legacy `namespace` / internal modules), `declare namespace` in `.d.ts`, and
    **"prefer ES modules over namespaces"**; **triple-slash directives** (`/// <reference … />`) and where
    they're still used. `[source,ts]`. A `[mermaid]` of the module-resolution decision by `moduleResolution`
    setting. Cross-link `xref:web/javascript/modules.adoc[]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/modules.html,
    https://www.typescriptlang.org/docs/handbook/modules/theory.html,
    https://www.typescriptlang.org/docs/handbook/modules/reference.html,
    https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html.

- [x] Task 16. Create `modules/ROOT/pages/web/typescript/declaration-files.adoc` (issue #35 page 15; book 1
  ch. 11; book 2 ch. 11 + Appendix D; book 3 items 65, 66, 67, 68, 70, 71)
  - [x] Task 16.1. What a `.d.ts` is; `declare` (var / function / class / namespace / module); **ambient
    declarations** vs. module declarations; `declaration` / `declarationMap` / `emitDeclarationOnly` /
    `--isolatedDeclarations`. `[source,ts]`.
  - [x] Task 16.2. Consuming types: bundled (`"types"` in `package.json`) vs. **`@types/*` from
    DefinitelyTyped**; put TypeScript and `@types` in **`devDependencies`**; the **three versions** problem.
    `[source,json]` + `[source,bash]`.
  - [x] Task 16.3. Writing declarations for an untyped JS dependency (globals / ES2015 / CommonJS / UMD shapes);
    **module augmentation** and **global augmentation** (`declare global`). `[source,ts]`.
  - [x] Task 16.4. Publishing types with your package; export every type in a public API; TSDoc for API docs;
    mirroring types to sever a dependency. `[source,ts]`.
  - [x] Task 16.5. Embed `image::typescript-declaration-files.svg[…]` (Task 16.6). Links:
    https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html,
    https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html,
    https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html,
    https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html.
  - [x] Task 16.6. Create `modules/ROOT/images/typescript-declaration-files.svg` — hand-authored: your `app.ts`
    → emitted `app.d.ts`; a `lodash` JS box with a separate `@types/lodash` box feeding types into it; an
    ambient `declare module "*.svg"` box.

- [x] Task 17. Create `modules/ROOT/pages/web/typescript/javascript-interop.adoc` (issue #35 page 16; book 2
  ch. 11; book 3 items 80, 81, 82, 83, 79)
  - [x] Task 17.1. `allowJs`, `checkJs`, per-file `// @ts-check` / `// @ts-nocheck` / `// @ts-expect-error` /
    `// @ts-ignore`. `[source,js]` + `[source,json]`.
  - [x] Task 17.2. **JSDoc as types**: `@type`, `@param`, `@returns`, `@typedef`, `@template`, `import('...')` in
    JSDoc; what JSDoc can and can't express vs. `.ts`. `[source,js]`.
  - [x] Task 17.3. The **migration ladder**: `allowJs` → `checkJs` / `@ts-check` + JSDoc → rename `.js` → `.ts`
    **module by module up the dependency graph** → `noImplicitAny` → full `strict`; "don't consider migration
    done until `noImplicitAny`". `[source,bash]` + `[source,json]`.
  - [x] Task 17.4. **Prefer ECMAScript features to TypeScript features** where they overlap (modules over
    namespaces, `#private`, standard decorators, plain objects/unions over enums). `[source,ts]`.
  - [x] Task 17.5. Embed `image::typescript-migration-ladder.svg[…]` (Task 17.6). Links:
    https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html,
    https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html,
    https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html,
    https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html.
  - [x] Task 17.6. Create `modules/ROOT/images/typescript-migration-ladder.svg` — hand-authored staircase: five
    ascending steps labelled `allowJs` / `checkJs + @ts-check + JSDoc` / `rename .js → .ts` / `noImplicitAny` /
    `full strict`.

- [x] Task 18. Create `modules/ROOT/pages/web/typescript/tsconfig-and-compiler-options.adoc` (issue #35 page 17;
  book 1 ch. 13; book 2 ch. 2, 12; book 3 items 2, 83)
  - [x] Task 18.1. `tsc --init`; CLI vs. config; `files` / `include` / `exclude`; `extends` and shared **config
    bases** (`@tsconfig/*`); the `$\{configDir}` substitution. `[source,json]` + `[source,bash]`.
  - [x] Task 18.2. **`strict`** and its members (`noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`,
    `strictBindCallApply`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, `noImplicitThis`,
    `alwaysStrict`) + the linting-adjacent flags (`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`,
    `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`,
    `noImplicitOverride`). `[source,json]`.
  - [x] Task 18.3. **Emit**: `target`, `lib`, `module`, `moduleResolution`, `outDir` / `rootDir`, `declaration` /
    `sourceMap` / `inlineSourceMap`, `noEmit`, `noEmitOnError`, `removeComments`, `downlevelIteration`,
    `importHelpers` + `tslib`, `jsx`, `verbatimModuleSyntax`, `isolatedModules`, `--erasableSyntaxOnly`.
    `[source,json]`.
  - [x] Task 18.4. **Type-checking config**: `skipLibCheck`, `types` / `typeRoots`, `allowJs` / `checkJs`.
    `tsc --watch` (+ `assumeChangesOnlyAffectDirectlyDependentFiles`), `--pretty`, `--showConfig`,
    `--explainFiles`. `[source,json]` + `[source,bash]`. Cross-link `xref:web/react/typescript.adoc[]` and
    `xref:web/angular/typescript-essentials.adoc[]` for the framework presets. Links:
    https://www.typescriptlang.org/tsconfig/,
    https://www.typescriptlang.org/docs/handbook/tsconfig-json.html,
    https://www.typescriptlang.org/docs/handbook/compiler-options.html.

- [x] Task 19. Create `modules/ROOT/pages/web/typescript/project-references-and-build.adoc` (issue #35 page 18;
  book 1 ch. 13 §Project References; book 2 ch. 12; book 3 items 73, 78)
  - [x] Task 19.1. `composite`, `references`, `tsc -b` / `--build` (+ `--dry`, `--verbose`, `--clean`),
    `.tsbuildinfo`, `incremental`; a monorepo layout example. `[source,json]` + `[source,bash]`.
  - [x] Task 19.2. **Source maps** for debugging TypeScript (browser & Node), `sourceRoot` / `mapRoot`, Node
    `--enable-source-maps`. `[source,json]` + `[source,bash]`.
  - [x] Task 19.3. **Compiler performance**: `tsc --generateTrace` / `--diagnostics` / `--extendedDiagnostics`,
    `skipLibCheck`, keeping types shallow, `import type`, and the native **"7.0"** port being ~10× faster with
    the same semantics. `[source,bash]`.
  - [x] Task 19.4. Building/emitting with **other tools** (Babel, esbuild, SWC, Vite) — they strip types but
    don't check; run `tsc --noEmit` in CI. Cross-link `xref:web/javascript/tooling-babel.adoc[]` and
    `xref:web/javascript/tooling-bundling-npm-publishing.adoc[]`. A `[mermaid]` of a `tsc -b` project-reference
    graph. Links: https://www.typescriptlang.org/docs/handbook/project-references.html,
    https://www.typescriptlang.org/docs/handbook/integrating-with-build-tools.html,
    https://www.typescriptlang.org/docs/handbook/configuring-watch.html.

- [x] Task 20. Create `modules/ROOT/pages/web/typescript/decorators-and-metadata.adoc` (issue #35 page 19; book 1
  ch. 14 §Experimental Decorators; book 2 ch. 5 §Decorators)
  - [x] Task 20.1. The **TC39 standard decorators** (Stage 3, the default in current TypeScript): class, method,
    accessor, field, and `accessor` decorators; decorator signatures and the `context` object; decorator
    **factories**; evaluation/application order. `[source,ts]`.
  - [x] Task 20.2. The **legacy** path: `experimentalDecorators` + `emitDecoratorMetadata` + `reflect-metadata`
    (what Angular / NestJS / TypeORM still use) and how it differs. `[source,ts]` + `[source,json]`.
  - [x] Task 20.3. A short "which one do I have?" note keyed on `tsconfig`. Links:
    https://www.typescriptlang.org/docs/handbook/decorators.html,
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators,
    https://www.typescriptlang.org/tsconfig/#experimentalDecorators.

- [x] Task 21. Create `modules/ROOT/pages/web/typescript/jsx-and-frameworks.adoc` (issue #35 page 20; book 2
  ch. 9, Appendix G "TSX") — deliberately short bridge page
  - [x] Task 21.1. The `.tsx` extension and the `jsx` compiler option (`react-jsx` / `preserve` / …);
    `JSX.Element`, `React.ReactNode`, `JSX.IntrinsicElements`; the `jsxImportSource` pragma. `[source,tsx]` +
    `[source,json]`.
  - [x] Task 21.2. Typing a component's props / children / events / refs / generics — **kept brief**, deferring
    to `xref:web/react/typescript.adoc[]` and `xref:web/angular/typescript-essentials.adoc[]`, which this page
    cross-links rather than duplicates. `[source,tsx]`. Links:
    https://www.typescriptlang.org/docs/handbook/jsx.html, https://react.dev/learn/typescript.

- [x] Task 22. Create `modules/ROOT/pages/web/typescript/async-and-iterators.adoc` (issue #35 page 21; book 1
  ch. 10 §Promises; book 2 ch. 4 §Generators/Iterators, ch. 8; book 3 item 27)
  - [x] Task 22.1. `Promise<T>`, typing `new Promise`, `async` functions always return `Promise`, `await` and
    **`Awaited<T>`**, `Promise.all` / `allSettled` tuple typing, top-level `await`. `[source,ts]`.
  - [x] Task 22.2. **`async` over callbacks** "to improve type flow"; typing a callback-to-promise wrapper.
    `[source,ts]`.
  - [x] Task 22.3. `Iterator<T>` / `Iterable<T>` / `IterableIterator<T>`, `for…of` typing, `--downlevelIteration`
    / `target`, generator functions (`function*`, `Generator<T, TReturn, TNext>`), **async iterators**
    (`for await…of`, `AsyncGenerator`). `[source,ts]`.
  - [x] Task 22.4. A note on `using` / `await using` and `Disposable` / `AsyncDisposable` (explicit resource
    management). `[source,ts]`. Cross-link `xref:web/javascript/async-javascript.adoc[]` and
    `xref:web/javascript/iterators-generators.adoc[]`. Links:
    https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html,
    https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype,
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management.

- [x] Task 23. Create `modules/ROOT/pages/web/typescript/type-design-and-best-practices.adoc` (issue #35 page 22;
  book 3 chs. 4, 2, 5, 7 — items 29, 30, 32, 33, 34, 35, 36, 37, 39, 40, 41, 59, 63, 64; book 2 ch. 6
  §nominal types / §totality; book 1 scattered)
  - [x] Task 23.1. **Make illegal states unrepresentable**: prefer types that always represent valid states;
    unions of interfaces over one interface with many optional/union fields; a **distinct type for special
    values**. `[source,ts]`.
  - [x] Task 23.2. **`null` at the perimeter**: keep `null` / `undefined` out of type aliases and deep in
    structures; push them to the edges. `[source,ts]`.
  - [x] Task 23.3. **"Be liberal in what you accept, strict in what you produce"** (wide parameter types, narrow
    return types). `[source,ts]`.
  - [x] Task 23.4. **Precision**: more precise types than `string`; prefer imprecise-but-correct to
    precise-but-wrong; name types in the **language of the domain**; don't repeat type info in docs / variable
    names. `[source,ts]`.
  - [x] Task 23.5. **Nominal typing via branding** (`type UserId = string & \{ readonly __brand: unique symbol }`);
    **`never` for exhaustiveness**; optional-`never` properties for **exclusive-or**. `[source,ts]`. Links:
    https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking,
    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html,
    https://www.typescriptlang.org/docs/handbook/declaration-merging.html.

- [x] Task 24. Create `modules/ROOT/pages/web/typescript/worked-example.adoc` (issue #35 page 23; book 2 ch. 11;
  book 3 ch. 10; book 1 end-of-chapter projects)
  - [x] Task 24.1. Take one small realistic JavaScript module (e.g. a tiny HTTP client or a form-state reducer)
    and walk it all the way: add `tsconfig.json` (`allowJs`) → `// @ts-check` + JSDoc → rename to `.ts` and add
    explicit types → model the domain with a **discriminated union** and a couple of **utility types** → turn on
    `strict` and fix the fallout → add a `satisfies` check and a branded ID. `[source,js]` → `[source,ts]` →
    `[source,json]`.
  - [x] Task 24.2. Show the compiler output (`[source,console]`) at each step; keep the whole page to about one
    screen of code; link Tailwind-style to https://www.typescriptlang.org/play/. Links:
    https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html,
    https://www.typescriptlang.org/play/.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 25), but it must run **after** Group 2 so its `xref:` back-links
point at pages that exist and its content reflects every page's final scope.

- [x] Task 25. Create the TypeScript cheat sheet — `modules/ROOT/pages/web/typescript/cheat-sheet.adoc` +
  `modules/ROOT/attachments/typescript-cheat-sheet.pdf`
  - [x] Task 25.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising **every concept explained in this reference**, per issue #35's cheat-sheet
    content list: install / `tsc --init` / run one-liners; the primitives and `any` / `unknown` / `never`; array
    & tuple syntax; object type / `interface` / `type` and the `?` / `readonly` / index-signature modifiers;
    union + narrowing guards (`typeof`, `in`, `instanceof`, discriminant, `x is T`, `asserts`); function
    signatures, optional/default/rest params, overloads; generics + `extends` + defaults + `const T`; the type
    operators (`keyof`, `typeof`, `T[K]`, conditional `T extends U ? X : Y` + `infer`, mapped
    `\{[K in keyof T]}`, template literal); the utility types grouped
    (`Partial`/`Required`/`Readonly`/`Pick`/`Omit`/`Record`, `Exclude`/`Extract`/`NonNullable`,
    `ReturnType`/`Parameters`/`Awaited`); assertions (`as`, `as const`, `!`, **`satisfies`**); enums vs. literal
    unions; module + `import type` + key `moduleResolution` values; the `strict`-family flags; and a short
    "erasable vs. not" strip (types / interfaces / generics erased; `enum` / `namespace` / parameter-properties /
    legacy-decorator-metadata emit runtime code). Match the visual style of the existing cheat sheets (see
    `modules/ROOT/pages/web/tailwind/cheat-sheet.adoc` + its PDF, and the Angular / ASP.NET ones).
  - [x] Task 25.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=typescript-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/typescript-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count
    check + a rendered PNG preview with no clipping).
  - [x] Task 25.3. Create `modules/ROOT/pages/web/typescript/cheat-sheet.adoc`:
    `include::partial$typescript-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every
    Group 2 page, and `xref:attachment$typescript-cheat-sheet.pdf[Download the TypeScript Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 26 (section index) must link every page from Groups 2–3; Tasks 27 and 28 depend
on Task 26 existing and on the final page/file names; Task 29 (build) depends on every prior task having landed.

- [x] Task 26. Create `modules/ROOT/pages/web/typescript/index.adoc` — TypeScript Reference landing page
  - [x] Task 26.1. `= TypeScript Reference`, `:description:` / `:keywords:`,
    `include::partial$typescript-disclaimer.adoc[]`, a short intro (https://www.typescriptlang.org/[TypeScript]
    is a statically-typed superset of JavaScript …; this section documents the current release line verified
    against typescriptlang.org/docs; where to start — `getting-started.adoc` → `the-type-system.adoc` →
    `everyday-types.adoc` → `unions-and-narrowing.adoc`).
  - [x] Task 26.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat sheet,
    one-line blurb each, under readable sub-headings, e.g.: **Getting started** (getting-started); **Core type
    system** (the-type-system, everyday-types, unions-and-narrowing, objects-and-interfaces); **Functions,
    arrays & classes** (functions, arrays-and-tuples, classes); **Generics & type-level programming** (generics,
    type-manipulation, utility-types, type-assertions-and-modifiers, enums-and-literal-alternatives); **Modules,
    declarations & JS interop** (modules, declaration-files, javascript-interop); **Configuration & build**
    (tsconfig-and-compiler-options, project-references-and-build); **Language extensions** (decorators-and-metadata,
    jsx-and-frameworks, async-and-iterators); **Practice** (type-design-and-best-practices, worked-example);
    **Reference** (cheat-sheet). Mirror `web/tailwind/index.adoc` / `web/aspnet/index.adoc`.
  - [x] Task 26.3. `== Bibliography` citing, in this order (matching issue #35's Bibliography section):
    - **https://www.typescriptlang.org/docs/** — the official TypeScript documentation, the source every page is
      written and verified against; call out
      https://www.typescriptlang.org/docs/handbook/intro.html[the Handbook],
      https://www.typescriptlang.org/docs/handbook/2/everyday-types.html[Everyday Types],
      https://www.typescriptlang.org/docs/handbook/2/narrowing.html[Narrowing],
      https://www.typescriptlang.org/docs/handbook/2/functions.html[More on Functions],
      https://www.typescriptlang.org/docs/handbook/2/objects.html[Object Types],
      https://www.typescriptlang.org/docs/handbook/2/generics.html[Generics],
      https://www.typescriptlang.org/docs/handbook/2/types-from-types.html[Creating Types from Types],
      https://www.typescriptlang.org/docs/handbook/utility-types.html[Utility Types],
      https://www.typescriptlang.org/docs/handbook/2/modules.html[Modules] and the
      https://www.typescriptlang.org/docs/handbook/modules/introduction.html[Modules deep-dive],
      https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html[Declaration Files], and
      https://www.typescriptlang.org/tsconfig/[the TSConfig Reference].
    - https://www.typescriptlang.org/play/[the TypeScript Playground],
      https://www.typescriptlang.org/cheatsheets/[the official cheat sheets],
      https://www.typescriptlang.org/download/[Download], and
      https://www.typescriptlang.org/docs/handbook/release-notes/overview.html[the release notes] /
      https://devblogs.microsoft.com/typescript/[the TypeScript dev blog].
    - https://github.com/microsoft/TypeScript[microsoft/TypeScript] — source and issue tracker;
      https://github.com/DefinitelyTyped/DefinitelyTyped[DefinitelyTyped] and
      https://www.typescriptlang.org/dt/search[the `@types` search].
    - Goldberg, Josh. _Learning TypeScript — Enhance Your Web Development Skills Using Type-Safe JavaScript_.
      O'Reilly Media, 2022. ISBN 978-1-098-11033-8. Consulted as part of the bibliography for this section
      (targets roughly TypeScript 4.7) — see
      https://www.oreilly.com/library/view/learning-typescript/9781098110321/[the publisher's book page],
      https://www.oreilly.com/[oreilly.com], and the author's companion site with a free online edition at
      https://www.learningtypescript.com/[learningtypescript.com].
    - Cherny, Boris. _Programming TypeScript — Making Your JavaScript Applications Scale_. O'Reilly Media, 2019.
      ISBN 978-1-492-03765-1. Consulted as part of the bibliography for this section (targets roughly TypeScript
      3.x) — see
      https://www.oreilly.com/library/view/programming-typescript/9781492037644/[the publisher's book page] and
      https://www.oreilly.com/[oreilly.com].
    - Vanderkam, Dan. _Effective TypeScript — 83 Specific Ways to Improve Your TypeScript_, 2nd ed. O'Reilly
      Media, 2024. ISBN 978-1-098-15506-3. Consulted as part of the bibliography for this section (updated for
      TypeScript 5.x) — see
      https://www.oreilly.com/library/view/effective-typescript-2nd/9781098155056/[the publisher's book page],
      https://www.oreilly.com/[oreilly.com], and the author's companion site at
      https://effectivetypescript.com/[effectivetypescript.com].
    - https://developer.mozilla.org/[MDN Web Docs] — the underlying JavaScript language and runtime APIs the type
      layer describes; cross-linked where used, together with the existing
      xref:web/javascript/index.adoc[JavaScript Development], xref:web/react/typescript.adoc[TypeScript with
      React], and xref:web/angular/typescript-essentials.adoc[TypeScript Essentials for Angular] pages on this
      site.

- [x] Task 27. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 27.1. Add a tenth bullet to the `== Sections` list, after the Tailwind Reference entry:
    `xref:web/typescript/index.adoc[TypeScript Reference]` with a one-line blurb (the typed superset of
    JavaScript: the type system and structural typing, unions and narrowing, interfaces, generics and type-level
    programming, the utility types, `satisfies` and assertions, modules and declaration files, `tsconfig` and the
    compiler, decorators, and JS interop / migration, plus a downloadable cheat sheet).
  - [x] Task 27.2. Update the page's own `:description:` and `:keywords:` attributes to mention TypeScript / typed
    superset / static typing.

- [x] Task 28. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 28.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/typescript/index.adoc[TypeScript
    Reference]` block under `** xref:web/index.adoc[Web Development]`, **after** the Tailwind Reference block
    (which ends the file, line ~230 `**** xref:web/tailwind/cheat-sheet.adoc[Cheat Sheet (PDF)]`), with a `****`
    line per page in this reading order: getting-started, the-type-system, everyday-types, unions-and-narrowing,
    objects-and-interfaces, functions, arrays-and-tuples, classes, generics, type-manipulation, utility-types,
    type-assertions-and-modifiers, enums-and-literal-alternatives, modules, declaration-files, javascript-interop,
    tsconfig-and-compiler-options, project-references-and-build, decorators-and-metadata, jsx-and-frameworks,
    async-and-iterators, type-design-and-best-practices, worked-example, cheat-sheet. Use short label text (e.g.
    `[Getting Started]`, `[The Type System]`, `[Everyday Types]`, …, `[Cheat Sheet (PDF)]`).
  - [x] Task 28.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/typescript/index.adoc[TypeScript Reference] -- …` after the Tailwind Reference bullet (line
    ~109) under the Web Development entry, matching the existing one-line-blurb format, and update that page's
    `:keywords:` to include TypeScript.

- [x] Task 29. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for TypeScript Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/typescript/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/typescript/*.html (all 25 pages), the PDF attachment
      build/site/_attachments/typescript-cheat-sheet.pdf, the six images
      build/site/_images/typescript-structural-typing.svg, typescript-types-as-sets.svg,
      typescript-narrowing-flow.svg, typescript-any-unknown-never.svg, typescript-declaration-files.svg and
      typescript-migration-ladder.svg, every new nav entry, and all mermaid diagrams are present in build/site.
      Do not paste the full log."
  })
  ```
  - [x] Task 29.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute" warnings
    (most likely an unescaped `\{ … }` in prose — a mapped-type body, `$\{configDir}`, an inline object-type
    literal — a typo'd `xref:` target, a bad `[source,ts]` token, or a missing nav entry), then re-run the agent
    until the build is clean, before checking this task off.
  - [x] Task 29.2. After the build is clean, per the repo convention (`update-docs`), confirm no other Antora
    page needs a cross-reference update for the new section (spot-check `web/tailwind/index.adoc`,
    `web/aspnet/index.adoc`, `web/react/typescript.adoc`, and `web/angular/typescript-essentials.adoc` — the
    last two may benefit from a "for the language itself, see the TypeScript Reference" pointer; add it only if
    it fits their existing style, otherwise note the check).
