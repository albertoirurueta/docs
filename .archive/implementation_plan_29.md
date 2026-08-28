# Implementation Plan: Web Development / Angular Reference

## Task summary

Source: GitHub issue #29

Issue [#29](https://github.com/albertoirurueta/docs/issues/29) ("Angular Reference") asks to add a new
**"Angular Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/angular/` — a seventh sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, and `web/react/`. It documents **modern,
standalone Angular** as published at https://angular.dev — the standalone-component + `bootstrapApplication`
model, signals, the built-in `@if` / `@for` / `@switch` control flow, `@defer`, typed reactive forms,
`provideHttpClient`, functional guards/interceptors, and SSR with hydration. Coverage: getting started &
project setup, TypeScript essentials, components, templates & data binding, built-in control flow & `@defer`,
directives, pipes, component communication (inputs/outputs/queries/content projection), lifecycle & change
detection, signals & reactivity, services & dependency injection, reactive patterns with RxJS, the HTTP client,
routing & navigation, forms, error handling, unit testing, production build & performance, styling & UI
component libraries, Angular Material & the CDK, and the NgModule→standalone migration & ecosystem — plus a
one-page downloadable PDF cheat sheet. Explanations must be brief and example-driven, every concept must carry
at least one runnable code example and a link to the specific page on https://angular.dev, and `[mermaid]`
diagrams and/or hand-authored inline SVG figures are used where they clarify a concept.

One of the works consulted while planning this section is the PDF at `~/Desktop/book.pdf`: *Learning Angular —
A practical guide to building web applications with modern Angular*, **Fifth Edition**, Aristeidis Bampakos,
**Packt Publishing Ltd** (Grosvenor House, 11 St Paul's Square, Birmingham B3 1RB, UK), 2024 (print run
January 2025), ISBN 978-1-83508-748-0 (print) / 978-1-83508-155-6 (ebook), ~494 pp, 15 chapters. Publisher
book page: https://www.packtpub.com/en-us/product/learning-angular-fifth-edition-9781835087480 ; publisher
home: https://www.packtpub.com/ . **The book is cited only as a bibliography entry** — never as the "primary"
or "main" reference — which is a deliberate wording difference from the jQuery and React disclaimers.
https://angular.dev is the source every page is written and verified against; where the book (≈ Angular 18)
and the current docs disagree, the docs win and the difference is noted.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, and React
reference sections. The closest and most direct precedent is
[.archive/implementation_plan_27.md](.archive/implementation_plan_27.md) (issue #27, "React Reference"): a new
sibling subsection of Web Development grounded in an official site plus a single reference book, with mermaid
diagrams, hand-authored SVG figures, a `== Bibliography`, and a headless-Chrome-rendered one-page PDF cheat
sheet, organised into four task groups (scaffold the disclaimer → parallel content pages → cheat sheet →
section index + nav/landing wiring + build verification).
[.archive/implementation_plan_25.md](.archive/implementation_plan_25.md) (issue #25, "jQuery Reference") is the
precedent for the AsciiDoc literal-brace warning note and the one-A4-page PDF verification step;
[.archive/implementation_plan_19.md](.archive/implementation_plan_19.md) (issue #19, "Bootstrap Reference") is
the precedent for splitting an issue's coarse topic bullets into finer pages.

**Choices made on the user's behalf** (best-practice defaults consistent with this repo's established pattern
and the issue text — stated here so they can be challenged during review):

- **Documenting the current stable Angular line as published at https://angular.dev** (v20 or newer; v22 is
  current as of 2026, with v20/v21 in LTS). Pages are not pinned to a patch version. All examples use
  **standalone components**, `bootstrapApplication` + `ApplicationConfig`, `inject()`, signal
  `input()` / `output()` / `model()` / queries, the built-in `@if` / `@for` / `@switch` control flow (not
  `*ngIf` / `*ngFor`), `provideRouter` / `provideHttpClient`, functional guards/interceptors, and typed
  reactive forms. Where the Bampakos book uses an older pattern (`NgModule`, `HttpClientModule`, class-based
  guards, `*ngIf`), the page documents the current approach and notes the change.
- **The two pages the issue marks "optional" — `angular-material.adoc` and `ecosystem-and-migration.adoc` —
  are included as mandatory** (matching how the React plan promoted its "optional but recommended" pages).
- **`styling-and-ui-libraries.adoc` lists free / open-source libraries first, ordered roughly by adoption,
  then a short "commercial suites" note last**, per the issue's follow-up instruction: Angular Material →
  PrimeNG → ng-bootstrap / ngx-bootstrap → NG-ZORRO → Taiga UI → spartan/ui → Clarity / Nebular → the CDK
  alone; commercial (Kendo UI, Ignite UI, Syncfusion, AG Grid) get one line + link each, no examples, flagged
  paid/licensed. `angular-material.adoc` is the deep-dive; `styling-and-ui-libraries.adoc` keeps the Material
  entry to a pointer + one example.
- **`typescript-essentials.adoc` stays short and cross-links `xref:web/javascript/*`** rather than
  duplicating the JavaScript/TypeScript language reference — it covers only the subset that matters for
  Angular (types, interfaces, generics, decorators, `strict` / `strictTemplates`, utility types).
- **Signal Forms** (`@angular/forms/signals`) is still experimental — `forms.adoc` covers it in one short
  paragraph with a link, not as main content.
- **Page breakdown: 21 concept pages + 1 cheat sheet + 1 section index** (23 `.adoc` files). The issue's own
  page list is already granular; no further splitting is warranted.
- **The subsection is named "Angular Reference"** in the section index title, the `web/index.adoc` bullet, the
  `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings.
- **Placed last**, after React Reference, in `nav.adoc`, `web/index.adoc`, and the root `index.adoc` — the
  same "append in the order added" ordering every prior subsection followed.
- **Mermaid is the default for concept diagrams; two hand-authored SVGs** where a spatial figure is clearer
  than a flowchart: `angular-data-flow.svg` (inputs flow down, events flow up) and
  `angular-injector-hierarchy.svg` (environment → route → element injectors). Mermaid covers: the component
  tree, the change-detection pass (Default vs. `OnPush`), the `@defer` block state machine, a signal
  dependency graph, an RxJS operator pipeline, the HTTP interceptor chain, the router match → guard → resolve
  → activate flow, a reactive-form model tree, and the SSR → hydration → incremental-hydration request flow.
  The implementer may add further small SVGs under `modules/ROOT/images/` if one adds real value while writing
  a page (following the existing `*.svg` convention) — not pre-planned as separate tasks.
- **Cross-reference existing pages instead of duplicating them**: `http-client.adoc` links
  `xref:web/cors.adoc[]` for cross-origin behaviour and `xref:web/javascript/browser-networking.adoc[]` for
  `fetch`; `templates-and-binding.adoc` / `lifecycle-and-change-detection.adoc` link
  `xref:web/javascript/browser-events.adoc[]` and `xref:web/javascript/browser-dom-basics.adoc[]`;
  `rxjs-and-async.adoc` links `xref:web/javascript/async-javascript.adoc[]`; `typescript-essentials.adoc`
  links `xref:web/javascript/*`; `styling-and-ui-libraries.adoc` links `xref:web/sass/index.adoc[]`,
  `xref:web/bootstrap/index.adoc[]`, and `xref:web/accessibility.adoc[]`; `angular-material.adoc` links
  `xref:web/accessibility.adoc[]`.
- **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
  layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
  static checked-in asset under `modules/ROOT/attachments/angular-cheat-sheet.pdf`, and linked via
  `xref:attachment$angular-cheat-sheet.pdf[Download …]`. The cheat sheet must be **exactly one A4 page**
  (page-count check + a rendered preview with no clipping).
- **No "quiz"/"related questions" page** — the Bampakos book has no chapter-end multiple-choice quizzes, so
  there is nothing to transcribe (the jQuery section had one only because its book did).
- **No project-picker icon/xref** for Angular Reference — like the other Web Development subsections it lives
  only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no lint/test
  suite). The installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none applies**;
  every task below is AsciiDoc / HTML / PDF content, implemented directly and left **untagged**.
- **Web Development** (`modules/ROOT/pages/web/index.adoc`) currently lists two standalone pages
  (`web/cors.adoc`, `web/accessibility.adoc`) then six subsections: **HTML & CSS Reference**, **Sass
  Reference**, **JavaScript Development**, **Bootstrap Reference**, **jQuery Reference**, **React Reference**.
  All follow the identical structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. `javascript-`/`html-css-`/`jquery-`/`react-disclaimer.adoc` name a book;
    `sass-`/`bootstrap-disclaimer.adoc` are "no single book". Angular's disclaimer follows a **third variant**:
    angular.dev is the reference; the book is named **only as a bibliography entry**, not as the primary
    source.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph.
  - A section `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    `modules/ROOT/pages/web/react/index.adoc` and `modules/ROOT/pages/web/jquery/index.adoc` for the exact
    format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (existing: `html-css-`, `sass-`, `javascript-`, `bootstrap-`,
    `jquery-`, `react-`, `sql-cheat-sheet.pdf`).
  - `nav.adoc` lists `Web Development` (`**` under `* Guides & References`) with each subsection (`***`) and
    its own detail pages (`****`). React's block is currently last, ending with
    `**** xref:web/react/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    (around lines 85–101) lists Web Development with its subsections nested one level under it (`**`), React
    last.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml):
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram
  mechanism used in this repo; ~20 existing usages e.g. `web/cors.adoc`, `web/react/state-and-events.adoc`,
  `web/jquery/events.adoc`), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute
  is set; existing pages use `[source,javascript]` / `[source,html]` and render fine.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` / `_25.md` / `_27.md`): inline `{foo}` text
  *outside* `[source]` blocks is parsed as an Antora attribute reference and emits a "skipping reference to
  missing attribute" build **warning**. This is acute for Angular prose, which is full of `{{ }}`
  interpolation, `@for (item of items; track item.id) { … }` blocks, and TypeScript generics
  (`Signal<T>`, `WritableSignal<number>`). Escape any literal braces in prose as `\{{ … }}` / `\{ … }` (e.g.
  `\{{ user.name }}`, `signal(\{ count: 0 })`). Inside `[source,…]` blocks **no escaping is needed**. The
  final build (Task 27) must come back with **zero** such warnings.
- **`[source]` language tokens**: use `[source,typescript]` for component/service/TS code, `[source,html]` for
  templates, `[source,bash]` for CLI, `[source,scss]` / `[source,json]` where relevant. If `typescript` as a
  `[source]` language ever produces a build issue, fall back to `[source,ts]` and then `[source,javascript]` —
  verified by the Task 27 build.
- **Reference book text**: `~/Desktop/book.pdf` (487-page PDF, Adobe InDesign 19.5, © 2024 Packt). 15
  chapters: 1 Building Your First Angular Application, 2 Introduction to TypeScript, 3 Structuring User
  Interfaces with Components, 4 Enriching Applications Using Pipes and Directives, 5 Managing Complex Tasks
  with Services, 6 Reactive Patterns in Angular, 7 Tracking Application State with Signals, 8 Communicating
  with Data Services over HTTP, 9 Navigating through Applications with Routing, 10 Collecting User Data with
  Forms, 11 Handling Application Errors, 12 Introduction to Angular Material, 13 Unit Testing Angular
  Applications, 14 Bringing Applications to Production, 15 Optimizing Application Performance. No chapter-end
  multiple-choice quizzes.
- **New file map** this plan creates under `modules/ROOT/pages/web/angular/` (all `.adoc`, 23 files):
  `getting-started.adoc`, `typescript-essentials.adoc`, `components.adoc`, `templates-and-binding.adoc`,
  `control-flow-and-defer.adoc`, `directives.adoc`, `pipes.adoc`, `component-communication.adoc`,
  `lifecycle-and-change-detection.adoc`, `signals.adoc`, `dependency-injection.adoc`, `rxjs-and-async.adoc`,
  `http-client.adoc`, `routing.adoc`, `forms.adoc`, `error-handling.adoc`, `testing.adoc`,
  `production-and-performance.adoc`, `styling-and-ui-libraries.adoc`, `angular-material.adoc`,
  `ecosystem-and-migration.adoc`, `cheat-sheet.adoc`, `index.adoc`. Plus
  `modules/ROOT/partials/angular-disclaimer.adoc`, `modules/ROOT/images/angular-data-flow.svg`,
  `modules/ROOT/images/angular-injector-hierarchy.svg`,
  `modules/ROOT/attachments/angular-cheat-sheet.pdf`, and edits to `modules/ROOT/pages/web/index.adoc`,
  `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then
  a blank line, then `include::partial$angular-disclaimer.adoc[]`, then a one/two-sentence lead paragraph.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** —
  `[source,typescript]` / `[source,html]` / `[source,bash]` / `[source,scss]` as appropriate.
- **Every concept links to the specific https://angular.dev page** for it (inline
  `https://angular.dev/…[link text]`), not just a generic "see the Angular docs".
- Escape literal `\{{ … }}` / `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha
  above).
- Prefer **modern, standalone Angular** everywhere: standalone components (no `NgModule` except the single
  migration note on `ecosystem-and-migration.adoc`), `inject()`, signal APIs, the built-in control flow,
  `provide*` bootstrap functions, functional guards/interceptors, typed reactive forms. Where the book uses an
  older pattern, document the current one and note the change.
- Diagrams via `[mermaid]` blocks; figures via `image::<name>.svg[alt,…]` with the SVG hand-authored under
  `modules/ROOT/images/`.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2 page includes the partial it creates).

- [x] Task 1. Create the Angular disclaimer partial — `modules/ROOT/partials/angular-disclaimer.adoc` —
  created `modules/ROOT/partials/angular-disclaimer.adoc` (`[IMPORTANT]` admonition, third variant: angular.dev
  is the reference; the Bampakos book is named only as a bibliography entry, not the primary source). No
  tests/coverage/static-analysis apply in this docs repo; Antora build verified later by Task 27. Include line
  for Groups 2–4: `include::partial$angular-disclaimer.adoc[]` (placed right after each page's header block,
  matching how `partial$react-disclaimer.adoc` is included in `modules/ROOT/pages/web/react/*.adoc`).
  - [x] Task 1.1. Create `modules/ROOT/partials/angular-disclaimer.adoc` as an `[IMPORTANT]` admonition
    following the shape of `modules/ROOT/partials/react-disclaimer.adoc` /
    `modules/ROOT/partials/javascript-disclaimer.adoc`. It must state:
    - this section documents **modern, standalone Angular** — signals, the built-in `@if` / `@for` / `@switch`
      control flow, `@defer`, typed reactive forms, `provideHttpClient`, functional guards/interceptors, and
      SSR with hydration — as described by the official documentation at https://angular.dev[angular.dev],
      **which is the reference these pages are written and verified against**;
    - the content was generated with the assistance of AI and should be verified against
      https://angular.dev[angular.dev] before being relied on in production, since Angular ships a major
      release roughly every six months and APIs continue to evolve (examples target the current major; the
      book referenced below targets ≈ Angular 18);
    - *Learning Angular* (Bampakos, 5th ed., Packt Publishing, 2024) is **listed in the bibliography** and was
      consulted while preparing the section — worded so it does **not** state or imply the book is the primary
      or main reference (deliberately unlike the jQuery/React disclaimers).
  - [x] Task 1.2. Confirm it is included via `include::partial$angular-disclaimer.adoc[]` on every page created
    in Groups 2–4 (index and cheat sheet included). Verified: Antora resolves `partial$angular-disclaimer.adoc`
    to `modules/ROOT/partials/angular-disclaimer.adoc`; identical syntax/placement to
    `include::partial$react-disclaimer.adoc[]` in `modules/ROOT/pages/web/react/index.adoc` and
    `state-and-events.adoc` (immediately after the `= Title` / `:description:` / `:keywords:` block). Groups 2–4
    tasks add this exact line to each page.

### Group 2 — Content pages

**Parallelizable: yes** — 21 independent pages (Tasks 2–22). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` pages, but **none depends on another new page in this plan** (cross-links
between the new pages are fine to write now — the targets are all listed in this plan and validated together in
Task 27). Each page follows the "Conventions" section above.

- [x] Task 2. Create `modules/ROOT/pages/web/angular/getting-started.adoc` (book ch. 1; angular.dev "What is
  Angular?", "Installation", CLI)
  - [x] Task 2.1. What Angular is: a TypeScript-first web **framework** (contrast: a view library); the SPA
    model; the reactive rendering model at a high level. Links: https://angular.dev/overview,
    https://angular.dev/essentials.
  - [x] Task 2.2. The Angular CLI workspace: `npm create @angular@latest` / `ng new`; project layout
    (`angular.json`, `src/main.ts`, `src/app/`); `ng serve` / `ng build` / `ng test` / `ng generate` /
    `ng add` / `ng update`. `[source,bash]`. Links: https://angular.dev/installation,
    https://angular.dev/tools/cli.
  - [x] Task 2.3. Bootstrapping without a root `NgModule`:
    `bootstrapApplication(App, \{ providers: [provideRouter(routes), provideHttpClient()] })` and the
    `ApplicationConfig` / `provide*` model. `[source,typescript]`.
  - [x] Task 2.4. Modern baseline / "what's new": standalone by default, signals, `@if` / `@for` / `@switch`,
    `@defer`, zoneless change detection, SSR + hydration — a short bullet list, each linking its own page in
    this section and/or the angular.dev guide. How to read https://angular.dev/update and
    https://angular.dev/reference/releases (6-month major cadence, LTS windows).
  - [x] Task 2.5. Tooling: Angular DevTools, the Angular Language Service, editor setup (one short paragraph
    each). Links: https://angular.dev/tools/devtools, https://angular.dev/tools/language-service.

- [x] Task 3. Create `modules/ROOT/pages/web/angular/typescript-essentials.adoc` (book ch. 2) — keep short,
  cross-link the JS/TS reference
  - [x] Task 3.1. The subset that matters for Angular: types, interfaces, `readonly`, union / literal types,
    generics, utility types (`Partial`, `Pick`, `Record`). `[source,typescript]`. Cross-link
    `xref:web/javascript/types.adoc[]` and `xref:web/javascript/classes.adoc[]`.
  - [x] Task 3.2. Decorators as used by Angular (`@Component`, `@Injectable`, `@Directive`, `@Pipe`,
    `@Input`/`@Output` legacy) — what a decorator is, one example; note the modern signal APIs replace most
    property decorators.
  - [x] Task 3.3. `tsconfig` essentials Angular sets: `strict`, and template type-checking
    (`strictTemplates` / `fullTemplateTypeCheck`). Link https://angular.dev/tools/language-service and
    https://www.typescriptlang.org/docs/.

- [x] Task 4. Create `modules/ROOT/pages/web/angular/components.adoc` (book ch. 3; angular.dev "Components")
  - [x] Task 4.1. `@Component` metadata: `selector`, `template` / `templateUrl`, `styles` / `styleUrl`,
    `standalone` (default true), `imports`, `host`. A minimal standalone component. `[source,typescript]`.
    Links: https://angular.dev/guide/components, https://angular.dev/guide/components/selectors.
  - [x] Task 4.2. The component class and the render tree; selectors (element, attribute, class forms). Embed
    a `[mermaid]` diagram of a small component tree (`App` → `Header` / `ProductList` → `ProductCard`).
  - [x] Task 4.3. Styling & view encapsulation (`Emulated` default, `None`, `ShadowDom`); `:host`,
    `:host-context()`, the deprecated `::ng-deep`; global `src/styles.css`. `[source,typescript]` +
    `[source,scss]`. Link https://angular.dev/guide/components/styling.
  - [x] Task 4.4. Host elements: `host` bindings/listeners, `hostDirectives`. Link
    https://angular.dev/guide/components/host-elements.
  - [x] Task 4.5. Programmatic rendering: `NgComponentOutlet` and `ViewContainerRef.createComponent` (brief).
    Link https://angular.dev/guide/components/programmatic-rendering.

- [x] Task 5. Create `modules/ROOT/pages/web/angular/templates-and-binding.adoc` (book ch. 3; angular.dev
  "Templates")
  - [x] Task 5.1. Interpolation `\{{ expr }}`; property binding `[prop]`; attribute binding `[attr.x]`; class
    binding `[class.x]` / `[class]`; style binding `[style.x.px]` / `[style]`. `[source,html]`. Links:
    https://angular.dev/guide/templates, https://angular.dev/guide/templates/binding.
  - [x] Task 5.2. Event binding `(event)="handler($event)"`; two-way binding `[(x)]` with `ngModel` and with a
    `model()` signal. Links: https://angular.dev/guide/templates/event-listeners,
    https://angular.dev/guide/templates/two-way-binding.
  - [x] Task 5.3. Template reference variables `#ref`; the `@let` template variable; the pipe operator `|`;
    safe navigation `?.` and non-null `!`; the expression-syntax rules (what is **not** allowed) and
    whitespace handling. Links: https://angular.dev/guide/templates/variables,
    https://angular.dev/guide/templates/expression-syntax, https://angular.dev/guide/templates/whitespace.
    Cross-link `xref:web/javascript/browser-events.adoc[]` for the underlying DOM event model.

- [x] Task 6. Create `modules/ROOT/pages/web/angular/control-flow-and-defer.adoc` (book ch. 3, 15; angular.dev
  "Control flow", "@defer")
  - [x] Task 6.1. `@if` / `@else if` / `@else`; `@for (item of items; track item.id)` with `$index` /
    `$first` / `$last` / `$count` and `@empty`; `@switch` / `@case` / `@default`. `[source,html]`. Why
    `track` matters (list reconciliation). Link https://angular.dev/guide/templates/control-flow.
  - [x] Task 6.2. Migrating from `*ngIf` / `*ngFor` / `*ngSwitch` (`ng generate @angular/core:control-flow`);
    a two-column before/after example.
  - [x] Task 6.3. `@defer` blocks: triggers (`on idle`, `on viewport`, `on interaction`, `on hover`,
    `on timer(…)`, `on immediate`, `when <expr>`), `@placeholder` / `@loading` / `@error`, `prefetch`.
    `[source,html]`. Link https://angular.dev/guide/templates/defer.
  - [x] Task 6.4. A `[mermaid]` state diagram of a `@defer` block: `placeholder → (trigger) → loading →
    complete`, with a side edge `loading → error`.

- [x] Task 7. Create `modules/ROOT/pages/web/angular/directives.adoc` (book ch. 4; angular.dev "Directives")
  - [x] Task 7.1. Attribute directives: `@Directive`, `host` bindings/listeners, reading a value with
    `input()`, reacting to events. A `HighlightDirective` example. `[source,typescript]`. Link
    https://angular.dev/guide/directives.
  - [x] Task 7.2. Structural directives: the `*` shorthand desugaring to `<ng-template>`; `ng-container`;
    writing one with `TemplateRef` / `ViewContainerRef`. Links:
    https://angular.dev/guide/directives/structural-directives,
    https://angular.dev/guide/templates/ng-container, https://angular.dev/guide/templates/ng-template.
  - [x] Task 7.3. Built-in attribute directives still in use (`NgClass`, `NgStyle`, `NgModel`,
    `NgOptimizedImage`) and the directive composition API (`hostDirectives`). Link
    https://angular.dev/guide/directives/directive-composition-api.

- [x] Task 8. Create `modules/ROOT/pages/web/angular/pipes.adoc` (book ch. 4; angular.dev "Pipes")
  - [x] Task 8.1. Built-in pipes: `date`, `currency`, `number`, `percent`, `json`, `keyvalue`, `slice`,
    `uppercase` / `lowercase` / `titlecase`, `async`. Passing parameters and chaining. `[source,html]`.
    Links: https://angular.dev/guide/templates/pipes, https://angular.dev/api/common/AsyncPipe.
  - [x] Task 8.2. Pure vs. impure pipes and the change-detection implications.
  - [x] Task 8.3. A custom pipe: `@Pipe(\{ name })`, `transform(value, …args)`, standalone. `[source,typescript]`.

- [x] Task 9. Create `modules/ROOT/pages/web/angular/component-communication.adoc` (book ch. 3; angular.dev
  inputs/outputs/queries/ng-content)
  - [x] Task 9.1. **Signal inputs**: `input()`, `input.required()`, `alias`, `transform`; the legacy
    `@Input()` + setter pattern (one note). `[source,typescript]`. Links:
    https://angular.dev/guide/components/inputs, https://angular.dev/guide/signals/inputs.
  - [x] Task 9.2. **Outputs**: `output()`, emitting custom events, `outputFromObservable`; the legacy
    `@Output()` + `EventEmitter` (one note). Link https://angular.dev/guide/components/outputs.
  - [x] Task 9.3. **Two-way**: `model()` and the `xChange` convention. Link
    https://angular.dev/guide/signals/model.
  - [x] Task 9.4. **Queries**: signal queries `viewChild()` / `viewChildren()` / `contentChild()` /
    `contentChildren()` and the decorator forms `@ViewChild` / `@ContentChild` (`\{ static }`, `read`). Links:
    https://angular.dev/guide/components/queries, https://angular.dev/guide/signals/queries.
  - [x] Task 9.5. **Content projection**: `<ng-content>`, `select=`, multi-slot projection, default/fallback
    content. `[source,html]`. Link https://angular.dev/guide/components/content-projection.
  - [x] Task 9.6. Embed `image::angular-data-flow.svg[…]` (created in Task 9.7) showing `input()` flowing
    **down** parent → child and `output()` events flowing **up** child → parent.
  - [x] Task 9.7. Create `modules/ROOT/images/angular-data-flow.svg` — a hand-authored figure (following the
    existing SVG convention: `box-model.svg`, `flex-axes.svg`, `react-one-way-data-flow.svg`).

- [x] Task 10. Create `modules/ROOT/pages/web/angular/lifecycle-and-change-detection.adoc` (book ch. 3;
  angular.dev "Lifecycle")
  - [x] Task 10.1. Hooks in order: `ngOnChanges`, `ngOnInit`, `ngDoCheck`, `ngAfterContentInit` / `Checked`,
    `ngAfterViewInit` / `Checked`, `ngOnDestroy`; `constructor` vs. `ngOnInit`. `[source,typescript]`. Link
    https://angular.dev/guide/components/lifecycle.
  - [x] Task 10.2. `DestroyRef` + `takeUntilDestroyed()`; `afterNextRender` / `afterRender` (brief).
  - [x] Task 10.3. Change detection: Zone.js and how it triggers CD; `ChangeDetectionStrategy.Default` vs.
    `OnPush`; `ChangeDetectorRef` (`markForCheck`, `detach`, `detectChanges`); how signals mark a component
    dirty; **zoneless** CD (`provideZonelessChangeDetection`). Links:
    https://angular.dev/best-practices/runtime-performance, https://angular.dev/guide/zoneless.
  - [x] Task 10.4. A `[mermaid]` diagram of one CD pass: event/signal change → check from the root →
    `OnPush` components skipped unless dirty → re-render.

- [x] Task 11. Create `modules/ROOT/pages/web/angular/signals.adoc` (book ch. 7; angular.dev "Signals")
  - [x] Task 11.1. `signal()`, `.set()` / `.update()`, reading in templates and code; equality functions.
    `[source,typescript]`. Link https://angular.dev/guide/signals.
  - [x] Task 11.2. `computed()` (lazy, memoised, glitch-free); `effect()` and when it runs; cleanup;
    `untracked()`. Link https://angular.dev/guide/signals/effect.
  - [x] Task 11.3. `linkedSignal()` for derived-but-writable state; `resource()` / `rxResource()` for async
    state (brief — HTTP detail on `http-client.adoc`). Links: https://angular.dev/guide/signals/linked-signal,
    https://angular.dev/guide/signals/resource.
  - [x] Task 11.4. Signals vs. RxJS — when to use which; recap of signal-based inputs / model / queries. Link
    https://angular.dev/ecosystem/rxjs-interop.
  - [x] Task 11.5. A `[mermaid]` graph of a signal dependency chain: `signal → computed → effect`, with a
    second `signal` feeding the same `computed`.

- [x] Task 12. Create `modules/ROOT/pages/web/angular/dependency-injection.adoc` (book ch. 5, 11; angular.dev
  "Dependency Injection")
  - [x] Task 12.1. `@Injectable(\{ providedIn: 'root' })`; creating and consuming a service.
    `[source,typescript]`. Links: https://angular.dev/guide/di,
    https://angular.dev/guide/di/creating-and-using-services.
  - [x] Task 12.2. `inject()` vs. constructor injection; the injection context and `runInInjectionContext`.
    Link https://angular.dev/guide/di/dependency-injection-context.
  - [x] Task 12.3. Providers: `useClass`, `useValue`, `useFactory`, `useExisting`, `multi`; `InjectionToken`.
    Link https://angular.dev/guide/di/dependency-injection-providers.
  - [x] Task 12.4. Hierarchical injectors: environment vs. element injectors; component-level `providers` /
    `viewProviders`; `@Optional`, `@Self`, `@SkipSelf`, `@Host`; route-level providers / lazy-loaded scope.
    Link https://angular.dev/guide/di/hierarchical-dependency-injection.
  - [x] Task 12.5. Embed `image::angular-injector-hierarchy.svg[…]` (created in Task 12.6): environment
    injector → router (route) injectors → element (component) injectors, with resolution walking up.
  - [x] Task 12.6. Create `modules/ROOT/images/angular-injector-hierarchy.svg` — hand-authored, existing SVG
    convention.

- [x] Task 13. Create `modules/ROOT/pages/web/angular/rxjs-and-async.adoc` (book ch. 6; angular.dev "RxJS
  interop")
  - [x] Task 13.1. Callbacks → promises → observables; observables are lazy, cancellable, multi-value.
    Cross-link `xref:web/javascript/async-javascript.adoc[]`. Link https://rxjs.dev/guide/overview.
  - [x] Task 13.2. Creating: `of`, `from`, `fromEvent`, `interval`, `timer`; `Subject` / `BehaviorSubject`.
    `[source,typescript]`.
  - [x] Task 13.3. Operators: `map`, `filter`, `tap`, `switchMap` / `mergeMap` / `concatMap`, `debounceTime`,
    `distinctUntilChanged`, `combineLatest`, `catchError`, `retry`, `takeUntil`. A typeahead example with
    `switchMap` + `debounceTime`.
  - [x] Task 13.4. Subscribing and **unsubscribing** (`takeUntilDestroyed`, the `async` pipe, manual
    `Subscription`); the `async` pipe; `toSignal()` / `toObservable()` bridges. Links:
    https://angular.dev/ecosystem/rxjs-interop, https://angular.dev/api/common/AsyncPipe.
  - [x] Task 13.5. A `[mermaid]` diagram of an operator pipeline: `source$ → debounceTime → switchMap(http) →
    subscribe/async pipe`.

- [x] Task 14. Create `modules/ROOT/pages/web/angular/http-client.adoc` (book ch. 8, 11; angular.dev "HTTP
  Client")
  - [x] Task 14.1. `provideHttpClient(withInterceptors([...]), withFetch())`; `HttpClient` `get` / `post` /
    `put` / `patch` / `delete` with typed responses; `HttpParams`, `HttpHeaders`; `observe: 'response'` /
    `'events'`, `responseType`. `[source,typescript]`. Links: https://angular.dev/guide/http,
    https://angular.dev/guide/http/setup, https://angular.dev/guide/http/making-requests.
  - [x] Task 14.2. Error handling: `catchError`, `HttpErrorResponse`, retry with backoff (cross-link
    `error-handling.adoc`).
  - [x] Task 14.3. **Functional interceptors** (`HttpInterceptorFn`): attach an auth token; log; retry. Link
    https://angular.dev/guide/http/interceptors.
  - [x] Task 14.4. `httpResource()` for reactive, signal-based fetching (brief). Link
    https://angular.dev/guide/http/http-resource.
  - [x] Task 14.5. Testing with `provideHttpClientTesting` / `HttpTestingController` (brief — full treatment
    on `testing.adoc`). Link https://angular.dev/guide/http/testing.
  - [x] Task 14.6. Cross-origin requests are subject to CORS — cross-link `xref:web/cors.adoc[]` and
    `xref:web/javascript/browser-networking.adoc[]`. A `[mermaid]` sequence: `component → HttpClient →
    interceptor chain → server → response → operators`.

- [x] Task 15. Create `modules/ROOT/pages/web/angular/routing.adoc` (book ch. 9; angular.dev "Routing")
  - [x] Task 15.1. `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`;
    `<router-outlet>`; the `Routes` array; a base `href`. `[source,typescript]`. Links:
    https://angular.dev/guide/routing, https://angular.dev/guide/routing/define-routes.
  - [x] Task 15.2. `routerLink`, `routerLinkActive`, `Router.navigate` / `navigateByUrl`, relative
    navigation, named outlets. `[source,html]` + `[source,typescript]`. Link
    https://angular.dev/guide/routing/navigate-to-routes.
  - [x] Task 15.3. Route params, `data`, `title`, query params & fragments; reading state via `ActivatedRoute`
    or bound `input()` properties (`withComponentInputBinding`). Link
    https://angular.dev/guide/routing/read-route-state.
  - [x] Task 15.4. Child routes; **lazy loading** with `loadComponent` / `loadChildren`. Link
    https://angular.dev/guide/routing/loading-strategies.
  - [x] Task 15.5. **Functional guards** (`CanActivateFn`, `CanActivateChildFn`, `CanDeactivateFn`,
    `CanMatchFn`) and **resolvers** (`ResolveFn`); route-level `providers`. Links:
    https://angular.dev/guide/routing/route-guards, https://angular.dev/guide/routing/data-resolvers.
  - [x] Task 15.6. A `[mermaid]` flow: `URL → route match → CanMatch → resolve → CanActivate → component
    activation` (with a `redirect` branch).

- [x] Task 16. Create `modules/ROOT/pages/web/angular/forms.adoc` (book ch. 10; angular.dev "Forms")
  - [x] Task 16.1. **Template-driven** forms (`FormsModule`, `ngModel`, `ngForm`, `NgModelGroup`) — quick,
    simple forms. `[source,html]` + `[source,typescript]`. Links: https://angular.dev/guide/forms,
    https://angular.dev/guide/forms/template-driven-forms.
  - [x] Task 16.2. **Reactive** forms (`ReactiveFormsModule`, `FormControl` / `FormGroup` / `FormArray`,
    `FormBuilder`, **strictly typed forms**, `nonNullable`). Links:
    https://angular.dev/guide/forms/reactive-forms, https://angular.dev/guide/forms/typed-forms.
  - [x] Task 16.3. Reading & reacting to state: `value` / `valueChanges`, `status` / `statusChanges`, `dirty`
    / `touched` / `pristine`, `setValue` / `patchValue` / `reset`.
  - [x] Task 16.4. **Validation**: built-in `Validators`, custom sync validators (`ValidatorFn`), async
    validators (`AsyncValidatorFn`), cross-field validation on the group, CSS state classes. Link
    https://angular.dev/guide/forms/form-validation.
  - [x] Task 16.5. Custom form controls with `ControlValueAccessor`; dynamic forms (brief, link
    https://angular.dev/guide/forms/dynamic-forms); a one-paragraph pointer to experimental **Signal Forms**
    (`@angular/forms/signals`) with a link.
  - [x] Task 16.6. A `[mermaid]` (or the SVG if clearer) figure of a reactive-form model tree: `FormGroup →
    controls / nested FormGroup / FormArray`.

- [x] Task 17. Create `modules/ROOT/pages/web/angular/error-handling.adoc` (book ch. 11; angular.dev
  "Unhandled errors")
  - [x] Task 17.1. Runtime vs. framework errors; the `NG0000`-style error codes and the reference
    (https://angular.dev/errors). Link https://angular.dev/best-practices/error-handling.
  - [x] Task 17.2. A custom global `ErrorHandler`; `provideBrowserGlobalErrorListeners()`. `[source,typescript]`.
    Link https://angular.dev/api/core/ErrorHandler.
  - [x] Task 17.3. Catching HTTP errors centrally in a functional interceptor; responding to `401` (redirect
    to login) and `403` (cross-link `http-client.adoc` and `routing.adoc`).
  - [x] Task 17.4. Surfacing errors to users (a snackbar/toast) and reporting to a backend (brief).

- [x] Task 18. Create `modules/ROOT/pages/web/angular/testing.adoc` (book ch. 13; angular.dev "Testing")
  - [x] Task 18.1. The anatomy of a test; `TestBed.configureTestingModule`, `ComponentFixture`,
    `fixture.detectChanges()`, `fixture.componentInstance`, `DebugElement` / `By.css`. `[source,typescript]`.
    Links: https://angular.dev/guide/testing, https://angular.dev/guide/testing/components-basics.
  - [x] Task 18.2. Testing components with inputs/outputs; replacing dependencies with stubs; spying
    (`jasmine.createSpy`). Link https://angular.dev/guide/testing/components-scenarios.
  - [x] Task 18.3. Testing services; testing HTTP with `HttpTestingController`; async testing (`fakeAsync` /
    `tick` / `flush`, `waitForAsync`, `whenStable`). Links: https://angular.dev/guide/testing/services,
    https://angular.dev/guide/http/testing.
  - [x] Task 18.4. Testing pipes, attribute directives, the router (routed components, guards, resolvers);
    **component harnesses** (`@angular/cdk/testing`, `HarnessLoader`). Link
    https://angular.dev/guide/testing/component-harnesses-overview.
  - [x] Task 18.5. Code coverage (`ng test --code-coverage`); the Karma → **Vitest** (or Jest) migration note.
    Links: https://angular.dev/guide/testing/code-coverage, https://angular.dev/guide/testing/migrating-to-vitest.

- [x] Task 19. Create `modules/ROOT/pages/web/angular/production-and-performance.adoc` (book ch. 14, 15;
  angular.dev SSR & performance)
  - [x] Task 19.1. `ng build`: production optimizations, output hashing, source maps, **bundle budgets** in
    `angular.json`, `--configuration`, environment file replacement, `ng deploy`. `[source,bash]` +
    `[source,json]`. Links: https://angular.dev/tools/cli/build, https://angular.dev/tools/cli/deployment,
    https://angular.dev/reference/configs/workspace-config.
  - [x] Task 19.2. **Core Web Vitals** (LCP, INP, CLS) and how Angular features map to them; `NgOptimizedImage`
    for image loading; `@defer` recap; route-level code splitting recap. Link
    https://angular.dev/guide/performance.
  - [x] Task 19.3. **SSR / hybrid rendering** with `@angular/ssr`: `provideClientHydration(withEventReplay())`,
    full vs. **incremental hydration** (`hydrate on …`), prerendering (**SSG**), the app-shell pattern.
    `[source,typescript]`. Links: https://angular.dev/guide/ssr, https://angular.dev/guide/hydration,
    https://angular.dev/guide/incremental-hydration.
  - [x] Task 19.4. A `[mermaid]` diagram of the SSR request flow: `server render → serialized HTML → browser
    paints → hydration → incremental hydration of deferred islands on trigger`.

- [x] Task 20. Create `modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc` (book ch. 12; angular.dev
  "Styling", material.angular.dev) — model on `modules/ROOT/pages/web/react/styling-and-ui-libraries.adoc`
  - [x] Task 20.1. Styling options for an Angular app, one short paragraph + example each: component styles +
    view encapsulation (`styles` / `styleUrl`, `:host`, `:host-context()`, `::ng-deep` deprecated, global
    `styles.css`); **Sass** (`ng new --style=scss`, cross-link `xref:web/sass/index.adoc[]`); **Tailwind CSS**
    (`ng add`, utility classes, `[class]` bindings); a brief note that **CSS-in-JS is uncommon in Angular**
    (scoped component styles cover the same need) plus CSS custom properties + `[style.--x]` for dynamic
    theming; `NgClass` / `NgStyle` vs. `[class.x]` / `[style.x]`. Link
    https://angular.dev/guide/components/styling.
  - [x] Task 20.2. **Component libraries — free / open-source first, in rough order of adoption**, each with a
    one-line description, its **licence**, an install/use snippet with a `Button` or `Dialog` example, and the
    official link:
    1. **https://material.angular.dev/[Angular Material]** (MIT) — first-party Material Design on the Angular
       CDK, by far the most used; `ng add @angular/material`, M3 theming. Pointer + one example only (deep
       dive on `angular-material.adoc`).
    2. **https://primeng.org/[PrimeNG]** (MIT) — large free suite (~90 components), design-token theming;
       `providePrimeNG()`. Note only the optional *templates* are paid.
    3. **https://www.ng-bootstrap.org/[ng-bootstrap]** (MIT) & **https://valor-software.com/ngx-bootstrap/[ngx-bootstrap]**
       (MIT) — Bootstrap 5 widgets as native Angular components, no jQuery; cross-link
       `xref:web/bootstrap/index.adoc[]`.
    4. **https://ng.ant.design/[NG-ZORRO]** (MIT) — Ant Design port, rich `nz-table` / `nz-form`.
    5. **https://taiga-ui.dev/[Taiga UI]** (Apache-2.0) — large, modular, Angular-native kit.
    6. **https://spartan.ng/[spartan/ui]** (MIT) — unstyled accessible primitives (`brain`) + copy-in
       Tailwind-styled components (`helm`); the Angular analogue of Radix + shadcn/ui.
    7. **https://clarity.design/[Clarity]** (MIT) & **https://akveo.github.io/nebular/[Nebular]** (MIT) — one
       line each; note both are less actively maintained.
    8. **https://material.angular.dev/cdk/categories[Angular CDK] alone** (MIT) — overlay, a11y, drag-drop,
       virtual scroll, `BreakpointObserver` — to build bespoke components without a full design system.
  - [x] Task 20.3. **Commercial suites (paid / licensed)** — one line + link each, listed last, no examples:
    **https://www.telerik.com/kendo-angular-ui[Kendo UI for Angular]**,
    **https://www.infragistics.com/products/ignite-ui-angular[Ignite UI for Angular]**,
    **https://www.syncfusion.com/angular-components[Syncfusion]** (free community licence for small
    teams/individuals), **https://www.ag-grid.com/angular-data-grid/[AG Grid]** (MIT community edition; the
    enterprise grid features are paid).
  - [x] Task 20.4. Accessibility: a component library gives accessible primitives but you still own the wiring
    (label controls, manage focus in dialogs/menus, honour `prefers-reduced-motion`, test with keyboard + a
    screen reader); the CDK `a11y` package (`LiveAnnouncer`, `cdkTrapFocus`, `FocusMonitor`). Cross-link
    `xref:web/accessibility.adoc[]`.

- [x] Task 21. Create `modules/ROOT/pages/web/angular/angular-material.adoc` (book ch. 12; material.angular.dev)
  - [x] Task 21.1. `ng add @angular/material`; Material 3 theming (`mat.theme`), typography, dark mode.
    `[source,bash]` + `[source,scss]`. Links: https://material.angular.dev/,
    https://material.angular.dev/guide/theming.
  - [x] Task 21.2. Common components: form field + input, select, checkbox/radio, datepicker, table
    (`MatTableDataSource`, sorting, pagination), dialog, snackbar, menu, tabs, stepper — a compact example or
    two. `[source,typescript]` + `[source,html]`.
  - [x] Task 21.3. The **CDK**: overlay, portal, a11y (`LiveAnnouncer`, `FocusTrap`), layout
    (`BreakpointObserver`), drag-and-drop, virtual scroll. Link https://material.angular.dev/cdk/categories.
  - [x] Task 21.4. Accessibility of interactive components — cross-link `xref:web/accessibility.adoc[]`; note
    the broader library survey lives on `styling-and-ui-libraries.adoc`.

- [x] Task 22. Create `modules/ROOT/pages/web/angular/ecosystem-and-migration.adoc` (book ch. 1; angular.dev
  NgModules / update)
  - [x] Task 22.1. What `NgModule` was (`declarations` / `imports` / `providers` / `bootstrap`) and why
    **standalone** replaced it; the `ng generate @angular/core:standalone` migration; the `@if` / `@for`
    migration schematic. `[source,typescript]`. Links: https://angular.dev/guide/ngmodules,
    https://angular.dev/reference/migrations.
  - [x] Task 22.2. Keeping up to date: `ng update`, https://angular.dev/update, the 6-month major cadence, LTS
    windows.
  - [x] Task 22.3. State-management orientation — one short paragraph + link each: **NgRx** (Store + Effects),
    **NgRx SignalStore**, **NGXS**, **Elf**, and "signals + services" for smaller apps. Links:
    https://ngrx.io/ .
  - [x] Task 22.4. Build/monorepo tooling (**Nx**, https://nx.dev/), meta-framework (**AnalogJS**,
    https://analogjs.org/), zoneless (cross-link `lifecycle-and-change-detection.adoc`). One line each.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task. Depends on every Group 2 page existing (it links to and summarises
them); touches only `cheat-sheet.adoc` + `angular-cheat-sheet.pdf`.

- [x] Task 23. Create the Angular cheat sheet — `modules/ROOT/pages/web/angular/cheat-sheet.adoc` +
  `modules/ROOT/attachments/angular-cheat-sheet.pdf`
  - [x] Task 23.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising: key `ng` CLI commands; `bootstrapApplication` + `ApplicationConfig`; a
    standalone component skeleton; the template binding table (`\{{}}`, `[x]`, `(x)`, `[(x)]`, `[class.x]`,
    `[style.x]`, `#ref`, `@let`); `@if` / `@for` (with `track`) / `@switch` / `@defer`; `input()` / `output()`
    / `model()`; `signal` / `computed` / `effect`; DI (`inject()`, `@Injectable(\{providedIn:'root'})`,
    `InjectionToken`); RxJS + `async` pipe + `toSignal`; `provideHttpClient` + `HttpClient` + a functional
    interceptor; `provideRouter` + `routerLink` + a functional guard; a typed reactive `FormGroup` +
    `Validators`; the lifecycle-hook order; a `TestBed` skeleton. Match the visual style of the existing cheat
    sheets (see `modules/ROOT/pages/web/react/cheat-sheet.adoc` + its PDF, and the JavaScript/jQuery ones).
  - [x] Task 23.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=angular-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/angular-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count
    check + a rendered PNG preview with no clipping).
  - [x] Task 23.3. Create `modules/ROOT/pages/web/angular/cheat-sheet.adoc`:
    `include::partial$angular-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every
    Group 2 page, and `xref:attachment$angular-cheat-sheet.pdf[Download the Angular Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 24 (section index) must link every page from Groups 2–3; Tasks 25 and 26 depend
on Task 24 existing and on the final page/file names; Task 27 (build) depends on every prior task having
landed.

- [x] Task 24. Create `modules/ROOT/pages/web/angular/index.adoc` — Angular Reference landing page
  - [x] Task 24.1. `= Angular Reference`, `:description:` / `:keywords:`,
    `include::partial$angular-disclaimer.adoc[]`, a short intro (what Angular is, that this section documents
    modern standalone Angular verified against angular.dev, where to start —
    `getting-started.adoc` then `components.adoc` / `templates-and-binding.adoc`).
  - [x] Task 24.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat
    sheet, one-line blurb each, under readable sub-headings, e.g.: **Getting started** (getting-started,
    typescript-essentials); **Components & templates** (components, templates-and-binding,
    control-flow-and-defer, directives, pipes); **Communication & lifecycle** (component-communication,
    lifecycle-and-change-detection); **Reactivity** (signals, rxjs-and-async); **Services, data & routing**
    (dependency-injection, http-client, routing); **Forms & errors** (forms, error-handling); **Quality &
    delivery** (testing, production-and-performance); **UI & ecosystem** (styling-and-ui-libraries,
    angular-material, ecosystem-and-migration); **Reference** (cheat-sheet). Mirror
    `web/react/index.adoc` / `web/jquery/index.adoc`.
  - [x] Task 24.3. `== Bibliography` citing, in this order:
    - **https://angular.dev/** — the official Angular documentation, the source every page is written against:
      https://angular.dev/overview[What is Angular?], https://angular.dev/essentials[Essentials], the in-depth
      guides (Components, Templates, Directives, Signals, Dependency Injection, Routing, Forms, HTTP Client,
      SSR, Testing), https://angular.dev/api[API reference], https://angular.dev/tools/cli[CLI],
      https://angular.dev/style-guide[style guide], https://angular.dev/update[update guide],
      https://blog.angular.dev/[the blog].
    - **https://rxjs.dev/** — the RxJS documentation (reactive-patterns page).
    - **https://material.angular.dev/** — Angular Material & CDK documentation (Material / UI-libraries pages).
    - Bampakos, Aristeidis. _Learning Angular — A practical guide to building web applications with modern
      Angular_, 5th ed. Packt Publishing, 2024. ISBN 978-1-83508-748-0 (print), 978-1-83508-155-6 (ebook).
      Consulted as part of the bibliography for this section — link
      https://www.packtpub.com/en-us/product/learning-angular-fifth-edition-9781835087480[the publisher's book
      page] and https://www.packtpub.com/[packtpub.com].
    - https://developer.mozilla.org/[MDN Web Docs] — the underlying web-platform APIs referenced (`fetch`, the
      DOM, events, Core Web Vitals), cross-linked where used.
    - Ecosystem docs actually cited: https://ngrx.io/[NgRx], https://nx.dev/[Nx], https://analogjs.org/[AnalogJS],
      https://www.typescriptlang.org/[TypeScript], https://tailwindcss.com/[Tailwind CSS].

- [x] Task 25. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 25.1. Add a seventh bullet to the `== Sections` list, after the React Reference entry:
    `xref:web/angular/index.adoc[Angular Reference]` with a one-line blurb (components & templates, signals,
    control flow & `@defer`, DI, RxJS, the HTTP client, routing, forms, testing, SSR & performance, plus a
    downloadable cheat sheet).
  - [x] Task 25.2. Update the page's own `:description:` and `:keywords:` attributes to mention Angular.

- [x] Task 26. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 26.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/angular/index.adoc[Angular Reference]`
    block under `** xref:web/index.adoc[Web Development]`, **after** the React Reference block, with a `****`
    line per page in this reading order: getting-started, typescript-essentials, components,
    templates-and-binding, control-flow-and-defer, directives, pipes, component-communication,
    lifecycle-and-change-detection, signals, dependency-injection, rxjs-and-async, http-client, routing,
    forms, error-handling, testing, production-and-performance, styling-and-ui-libraries, angular-material,
    ecosystem-and-migration, cheat-sheet.
  - [x] Task 26.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/angular/index.adoc[Angular Reference] -- …` after the React Reference bullet under the Web
    Development entry, matching the existing one-line-blurb format.

- [x] Task 27. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for Angular Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/angular/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/angular/*.html (all 23 pages), the PDF attachment
      build/site/_attachments/angular-cheat-sheet.pdf, the images
      build/site/_images/angular-data-flow.svg and angular-injector-hierarchy.svg, every new nav entry, and
      all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 27.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute"
    warnings (most likely an unescaped `\{{ … }}` in template prose, a typo'd `xref:` target, a bad
    `[source,typescript]` token, or a missing nav entry), then re-run the agent until the build is clean,
    before checking this task off.
  - [x] Task 27.2. After the build is clean, per the repo convention (`update-docs`), confirm no other Antora
    page needs a cross-reference update for the new section (spot-check `web/react/index.adoc` and
    `web/accessibility.adoc` — none is expected to need changes, but note the check).
