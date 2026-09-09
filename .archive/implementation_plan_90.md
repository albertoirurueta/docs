# Implementation Plan: Restructure "ASP.NET Reference" into three sub-sections

## Task summary

Source: GitHub issue #90

Issue [#90](https://github.com/albertoirurueta/docs/issues/90) ("Restructure \"ASP.NET Reference\" into three
sub-sections: ASP.NET Web Forms, ASP.NET MVC (Razor) and ASP.NET Core (Blazor)") asks to split the existing
single, **ASP.NET-Core-only** `modules/ROOT/pages/web/aspnet/` reference (24 files: 22 content pages +
`index.adoc` + `cheat-sheet.adoc`, all targeting .NET 10) into **three sub-sections**, each anchored to a
different real-world ASP.NET lineage:

1. **ASP.NET Web Forms** (`web/aspnet/web-forms/`) -- .NET Framework 4.8.1, security-fixes-only. 16 new content
   pages + `index.adoc`.
2. **ASP.NET MVC (Razor)** (`web/aspnet/mvc/`) -- ASP.NET MVC 5.3.x / Web API 2.2 / Web Pages 3 / OWIN / SignalR 2
   / Identity 2 on .NET Framework 4.8.1. 18 new content pages + `index.adoc`.
3. **ASP.NET Core (Blazor)** (`web/aspnet/core/`) -- .NET 10 (LTS) / C# 14, today's anchor. **18 of the existing
   pages move unchanged**, **4 existing pages are split** into 16 replacement pages (`mvc-and-razor-pages.adoc`
   -> 3, `web-apis.adoc` -> 2, `real-time-and-rpc.adoc` -> 2, `blazor.adoc` -> the 9-page Blazor cluster), and
   **5 pages are genuinely new**. 39 content pages + `index.adoc`.

Plus: two new shared pages (`evolution.adoc`, `choosing-a-framework.adoc`), a rewritten `index.adoc` landing
page carrying a consolidated, grouped `== Bibliography`, a rewritten `cheat-sheet.adoc` hub linking **three**
new one-page PDFs (`aspnet-web-forms-cheat-sheet.pdf`, `aspnet-mvc-cheat-sheet.pdf`,
`aspnet-core-cheat-sheet.pdf`, replacing today's single `aspnet-cheat-sheet.pdf`), 4 disclaimer partials
(split from today's single `aspnet-disclaimer.adoc`), 9 new SVG figures, Mermaid diagrams throughout, and a
5-level `nav.adoc` (today's is 4 levels deep). **Classic ASP (pre-.NET) stays explicitly out of scope**, named
once on the evolution page as the ancestor the "ASP" name comes from.

Every page must carry `:description:`/`:keywords:` attributes, include its sub-section's disclaimer partial,
carry at least one runnable code example per major concept, and link the specific official documentation page
it documents (Microsoft Learn for everything) rather than a generic "see Microsoft Learn."

### Choices made on the user's behalf (stated so they can be challenged during review)

1. **Plan scope**: the user was asked whether this plan should cover only the issue's own suggested "Phase 1
   (scaffolding)" or the entire restructure end-to-end, and chose **the entire restructure in one plan**. This
   plan therefore does not split delivery into 5 separate PRs the way the issue's own "Suggested delivery"
   section proposes -- `iru-issue` will open one pull request for the whole thing once this plan completes.
2. **Every task in this plan is untagged (no language/framework key)**: this repository has no application
   source code (per `CLAUDE.md`) -- it is the Antora playbook and root component for the docs site. None of the
   installed `*-code-one-task` skills (`java`, `dotnet`, `database`) apply; every task here is AsciiDoc/SVG
   content authoring, executed directly rather than dispatched to a language-specific skill. This matches the
   precedent in [.archive/implementation_plan_88.md](.archive/implementation_plan_88.md) and
   [.archive/implementation_plan_83.md](.archive/implementation_plan_83.md).
3. **Nav restructuring is deferred to one dedicated group (Group 5)** rather than touched once per sub-section
   group: `nav.adoc` is a single shared file, so every sub-section's content pages are authored first (each
   sub-section's own new `index.adoc` included, since that file is sub-section-local, not shared), and the full
   5-level tree is assembled once, after all three sub-sections exist. The one exception is the **mechanical
   path fix** in Group 1 (Task 2), which is required immediately -- without it, the existing `nav.adoc` entries
   for the 18 moved pages point at paths that stop existing the moment those pages move, breaking the build
   before any other group even starts.
4. **Per-page task descriptions are condensed, one line each, drawn verbatim from issue #90's own per-page
   tables** rather than re-deriving or re-typing the full topic breakdown for all 73 new content pages (16 +
   18 + 39). The issue itself is the authoritative, already-reviewed source for every page's scope -- each task
   below names the exact topics from the issue and the exact SVG/Mermaid requirement where the issue calls one
   out; consult [issue #90](https://github.com/albertoirurueta/docs/issues/90) directly for the surrounding
   framing (why each page exists, cross-linking guidance) when authoring, not just the condensed line here.
5. **The 4 split-source pages are deleted in place, not moved-then-deleted**: `mvc-and-razor-pages.adoc`,
   `web-apis.adoc`, `real-time-and-rpc.adoc` and `blazor.adoc` stay at their current `web/aspnet/*.adoc` path
   until Group 2 deletes them and creates their replacements directly under `web/aspnet/core/`. Group 1's move
   (Task 2) only touches the **18** pages the issue's own "Moves" table lists -- these 4 are **not** among them.
6. **Cheat-sheet PDF generation may need a manual hand-off**: the existing PDFs
   (`modules/ROOT/attachments/*-cheat-sheet.pdf`) were produced by printing an HTML source to PDF with headless
   Chrome (per their `Producer`/`Creator` metadata), and this repository has no in-repo script or skill that
   automates that step. Task 51.1 must first check what PDF-rendering tooling is actually available in the
   execution environment and use whichever works; if none is available, it must say so explicitly rather than
   silently skipping the PDFs, and ask the user to generate/attach them.

## Current code state

- `modules/ROOT/pages/web/aspnet/` currently holds exactly 24 files: `index.adoc`, `cheat-sheet.adoc`, and 22
  content pages (verified via `ls`). Of those 22: **18** move unchanged per the issue's "Moves" table
  (`getting-started.adoc`, `request-pipeline-and-middleware.adoc`, `hosting-servers-and-environments.adoc`,
  `configuration-and-options.adoc`, `dependency-injection.adoc`, `routing.adoc`, `minimal-apis.adoc`,
  `model-binding-and-validation.adoc`, `data-access-ef-core.adoc`, `authentication-and-identity.adoc`,
  `authorization.adoc`, `security-hardening.adoc`, `error-handling-logging-and-observability.adoc`,
  `performance-and-caching.adoc`, `architecture-and-patterns.adoc`, `testing.adoc`, `deployment.adoc`,
  `ui-component-libraries.adoc`), and **4** are split-source pages that get deleted and replaced
  (`mvc-and-razor-pages.adoc`, `web-apis.adoc`, `real-time-and-rpc.adoc`, `blazor.adoc`).
- `modules/ROOT/partials/aspnet-disclaimer.adoc` is the single disclaimer every current page includes via
  `include::partial$aspnet-disclaimer.adoc[]`. It states ".NET 10 (LTS)" and links the section bibliography
  anchor (`web/aspnet/index.adoc#_bibliography`).
- `modules/ROOT/nav.adoc:272-295` is the current ASP.NET block: a flat `*** xref:web/aspnet/index.adoc[ASP.NET
  Reference]` with 22 flat `****` children (18 moved pages + the 4 split-source pages, in their current
  filenames) plus the trailing `**** xref:web/aspnet/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Max nav depth
  site-wide today is 4 (`****`); this restructure needs a 5th level (`*****`) for pages nested under each new
  sub-section's `index.adoc`.
- **Verified internal cross-references that need fixing across the move/split boundary** (found by grepping the
  22 pages for `xref:web/aspnet/`):
  - `getting-started.adoc` links out to all 4 split-source pages (`web-apis.adoc`, `mvc-and-razor-pages.adoc`,
    `blazor.adoc`, `real-time-and-rpc.adoc`) via `xref:web/aspnet/<page>.adoc[Details]`.
  - `minimal-apis.adoc` links to `web-apis.adoc`.
  - `web-apis.adoc` (a split-source page, deleted in Group 2) links to `minimal-apis.adoc` and
    `error-handling-logging-and-observability.adoc` -- both in the "18 moved" set.
  - `mvc-and-razor-pages.adoc` (also deleted in Group 2) links to `web-apis.adoc`.
  - Several of the 18 moved pages (`architecture-and-patterns.adoc`, `authentication-and-identity.adoc`,
    `configuration-and-options.adoc`, `authorization.adoc`, `error-handling-logging-and-observability.adoc`,
    `deployment.adoc`, `request-pipeline-and-middleware.adoc`, `security-hardening.adoc`) link to each other or
    to `index.adoc` -- these need the `core/` prefix inserted (except the `index.adoc` target, which is **not**
    moving and stays as-is).
  - `cheat-sheet.adoc` and `index.adoc` (not moved; rewritten wholesale in Group 6) both link to many of these
    pages too, but are out of scope for the Group 1/2 xref-fix pass since they're rewritten from scratch later.
- No `web-forms/`, `mvc/`, or `core/` subdirectory exists yet under `web/aspnet/` -- nothing has started.
- `modules/ROOT/images/` already has `aspnet-blazor-hosting-models.svg`, `aspnet-clean-architecture.svg` and
  `aspnet-di-lifetimes.svg` -- kept and re-referenced from their new page locations, per the issue. 9 new SVGs
  are needed: `aspnet-evolution-timeline.svg`, `aspnet-web-forms-page-lifecycle.svg`,
  `aspnet-web-forms-postback-roundtrip.svg`, `aspnet-web-forms-control-tree.svg`,
  `aspnet-mvc5-request-pipeline.svg`, `aspnet-mvc5-filter-pipeline.svg`, `aspnet-mvc5-route-matching.svg`,
  `aspnet-core-filter-pipeline.svg`, `aspnet-core-blazor-component-lifecycle.svg`.
- `modules/ROOT/attachments/aspnet-cheat-sheet.pdf` exists today (A4, 1 page, headless-Chrome-rendered per its
  PDF metadata) and is deleted at the end of this restructure, superseded by `aspnet-core-cheat-sheet.pdf`.
- The only two files **outside** `web/aspnet/` that reference it: `modules/ROOT/pages/web/index.adoc:32-35`
  (the "ASP.NET Reference" bullet in the Web Development card list) and
  `modules/ROOT/partials/aspnet-disclaimer.adoc` itself (being split, not a cross-reference to fix).
- The closest structural precedent is
  [.archive/implementation_plan_83.md](.archive/implementation_plan_83.md) (issue #83, "Apache Solr
  Reference") -- same shape: a disclaimer-partial scaffolding group, a large parallelizable content-pages group,
  a cheat-sheet group, a dedicated nav/site-wiring group, and a final build-and-verify group. This plan follows
  that same group shape, scaled to three sub-sections instead of one.

## Implementation steps

### Group 1 -- Foundational scaffolding

**Parallelizable: no** -- Task 2 (the page move) depends on Task 1 (the new disclaimer partial names it must
switch its `include::` to), and Task 2's nav path-fix must land before anything else touches `nav.adoc`, or the
build breaks. Tasks 3-4 are content-only and could run alongside 1-2, but are kept in this group since they
share the "shared" disclaimer partial that Task 1 creates.

- [x] Task 1. Split `modules/ROOT/partials/aspnet-disclaimer.adoc` into four partials.
  - [x] Task 1.1. Rename the current file's content, unchanged, into
    `modules/ROOT/partials/aspnet-core-disclaimer.adoc` (states .NET 10 / C# 14, exactly today's text).
  - [x] Task 1.2. Create `modules/ROOT/partials/aspnet-shared-disclaimer.adoc` -- a short variant with no
    version-specific claims, for `index.adoc`, `evolution.adoc`, `choosing-a-framework.adoc` and
    `cheat-sheet.adoc`. Still links the section bibliography anchor
    (`xref:web/aspnet/index.adoc#_bibliography[bibliography]`) and keeps the "generated with the assistance of
    AI" wording.
  - [x] Task 1.3. Create `modules/ROOT/partials/aspnet-web-forms-disclaimer.adoc` -- states **ASP.NET Web Forms
    on .NET Framework 4.8.1**, security-fixes-only, referencing
    `https://learn.microsoft.com/en-us/aspnet/web-forms/` and
    `https://learn.microsoft.com/en-us/previous-versions/aspnet/` as the reference documentation.
  - [x] Task 1.4. Create `modules/ROOT/partials/aspnet-mvc-disclaimer.adoc` -- states **ASP.NET MVC 5.3.x / Web
    API 2.2 / Web Pages 3 on .NET Framework 4.8.1**, and explicitly that this is **not** ASP.NET Core MVC,
    referencing `https://learn.microsoft.com/en-us/aspnet/mvc/`, `.../web-api/`, `.../web-pages/`,
    `.../signalr/`, `.../identity/`.
  - [x] Task 1.5. Delete the original `modules/ROOT/partials/aspnet-disclaimer.adoc` (fully superseded by the
    four files above -- confirm nothing still references it: `grep -rl "aspnet-disclaimer.adoc" modules/`).
  - Note: done via `git mv` to `aspnet-core-disclaimer.adoc` (1.1), the three other partials created fresh
    (1.2-1.4). The five other files that still included the old filename at this point in plan order
    (`blazor.adoc`, `mvc-and-razor-pages.adoc`, `web-apis.adoc`, `real-time-and-rpc.adoc`, `index.adoc`,
    `cheat-sheet.adoc` -- not yet touched/deleted/rewritten until Groups 2/6) were repointed to
    `aspnet-core-disclaimer.adoc`/`aspnet-shared-disclaimer.adoc` as an interim fix so the build stays green at
    every checkpoint; Groups 2 and 6 supersede these files' content entirely regardless.

- [x] Task 2. Move the 18 unsplit pages into `web/aspnet/core/` and repair every reference the move breaks.
  - [x] Task 2.1. `git mv` these 18 files from `modules/ROOT/pages/web/aspnet/` to
    `modules/ROOT/pages/web/aspnet/core/` (content otherwise unchanged): `getting-started.adoc`,
    `request-pipeline-and-middleware.adoc`, `hosting-servers-and-environments.adoc`,
    `configuration-and-options.adoc`, `dependency-injection.adoc`, `routing.adoc`, `minimal-apis.adoc`,
    `model-binding-and-validation.adoc`, `data-access-ef-core.adoc`, `authentication-and-identity.adoc`,
    `authorization.adoc`, `security-hardening.adoc`, `error-handling-logging-and-observability.adoc`,
    `performance-and-caching.adoc`, `architecture-and-patterns.adoc`, `testing.adoc`, `deployment.adoc`,
    `ui-component-libraries.adoc`.
  - [x] Task 2.2. In each of the 18 moved files, change `include::partial$aspnet-disclaimer.adoc[]` to
    `include::partial$aspnet-core-disclaimer.adoc[]`.
  - [x] Task 2.3. Fix internal cross-references in the moved files: for any `xref:web/aspnet/<name>.adoc` where
    `<name>` is one of the 18 filenames above, rewrite to `xref:web/aspnet/core/<name>.adoc`. Leave
    `xref:web/aspnet/index.adoc[...]` targets unchanged (that page is not moving). **Do not yet touch** the 4
    `xref:web/aspnet/{web-apis,mvc-and-razor-pages,blazor,real-time-and-rpc}.adoc` references still present in
    `core/getting-started.adoc` and `core/minimal-apis.adoc` -- those still point at valid (not-yet-moved)
    files at this point, and are fixed in Task 11 once their replacements exist.
  - [x] Task 2.4. In `modules/ROOT/nav.adoc:272-295`, repoint the existing 18 `xref:web/aspnet/<name>.adoc[...]`
    lines that correspond to the moved files to `xref:web/aspnet/core/<name>.adoc[...]`, keeping their existing
    labels and the flat `****` structure unchanged for now (the full 5-level restructuring happens in Group 5).
    The 4 entries for the still-unmoved split-source pages, and the `evolution`/`choosing-a-framework`/
    `cheat-sheet` entries, are untouched here.
  - Note: all 18 files moved via `git mv`; disclaimers and internal xrefs repointed to `core/` with the 4
    split-source targets and `index.adoc` correctly left alone per the task's own instruction; `nav.adoc`
    repointed to match.

- [x] Task 3. Create `modules/ROOT/pages/web/aspnet/evolution.adoc` ("The Evolution of ASP.NET") -- the
  timeline from ASP.NET 1.0 (2002) to .NET 10 (2025): Web Forms 1.0/1.1 -> ASP.NET 2.0 (2005: master pages,
  themes, membership/roles/profile, Web Parts, data source controls) -> ASP.NET AJAX (2007) -> ASP.NET MVC 1.0
  (2009) -> **Razor in MVC 3 (2011)** -> Web API + Web Pages 2 (2012) -> MVC 5 + Web API 2 + OWIN/Katana +
  Identity (2013) -> the abandoned "MVC 6 / ASP.NET 5" -> **ASP.NET Core 1.0 (2016)** -> Core 2.x/3.x, Razor
  Pages (2017), Blazor Server (2019), Blazor WebAssembly (2020) -> .NET 5-10, Minimal APIs (2021), the unified
  Blazor Web App and render modes (2023), Aspire. One paragraph naming classic ASP as the pre-.NET ancestor,
  explicitly out of scope. `image::aspnet-evolution-timeline.svg[...]` (authored in this task) plus a Mermaid
  `timeline`/`gitGraph` block where it clarifies. Includes `aspnet-shared-disclaimer.adoc`.
  - Note: created with the full timeline, `aspnet-evolution-timeline.svg` (new), and a Mermaid `timeline` block.
    Forward-links to the three sub-section indexes and several Group 3/4 pages that don't exist until those
    groups land -- expected per the task's own "cross-links the migrating-... pages added in Groups 3-4" intent.

- [x] Task 4. Create `modules/ROOT/pages/web/aspnet/choosing-a-framework.adoc` ("Choosing an ASP.NET
  Framework") -- decision guide: green-field => ASP.NET Core, always; what to do with an existing Web Forms or
  MVC 5 codebase; pieces with no forward path (`System.Web`, ViewState, `HttpModule`/`HttpHandler`, WebForms
  server controls, ASMX/WCF server, Membership providers) and their replacements; incremental migration with
  `System.Web.Adapters` + YARP; a Web Forms -> MVC 5 -> ASP.NET Core concept-mapping table. Cross-links
  (doesn't restate) the `migrating-...` pages added in Groups 3-4. Mermaid decision flowchart. Includes
  `aspnet-shared-disclaimer.adoc`.
  - Note: created with the decision flowchart (Mermaid), the no-forward-path table, and the three-lineage
    concept map. Same expected forward-reference caveat as Task 3.

- [x] Task 5. Verify the build after this group: run the Antora build (see Group 7 for how to delegate this to
  a sub-agent) and confirm no *new* xref/AsciiDoc warnings were introduced -- the 4 split-source pages and
  their inbound references from `core/getting-started.adoc`/`core/minimal-apis.adoc` are still valid at this
  point (nothing has been deleted yet), so the build should be exactly as clean as before this group, plus two
  new, correctly-wired pages.
  - Note: ran `npx antora antora-playbook.yml`. All Group-1-introduced breakage (missing disclaimer partial in
    not-yet-touched files, moved-file xrefs in `index.adoc`) was fixed as an interim measure (see Task 1's
    note). Remaining new errors are exclusively forward references from `evolution.adoc`/`choosing-a-framework.adoc`
    to pages Groups 2-4 haven't created yet, plus `web-apis.adoc`'s existing inbound reference to the now-moved
    `core/minimal-apis.adoc` -- both resolve as Groups 2-6 land; Group 7 (Task 56) is the authoritative
    zero-warnings gate.

### Group 2 -- ASP.NET Core (Blazor) content

**Parallelizable: yes** -- every task below creates and/or deletes only its own distinct file(s); no two tasks
in this group touch the same file, and none touches `nav.adoc` (deferred to Group 5) or `web/aspnet/index.adoc`
(deferred to Group 6). Consolidated validation for the group is a build check after Task 12.

- [x] Task 6. Split `web/aspnet/mvc-and-razor-pages.adoc` (207 lines) into three new pages, then delete the
  original.
  - [x] Task 6.1. Create `modules/ROOT/pages/web/aspnet/core/razor-syntax-and-tag-helpers.adoc` -- Razor
    syntax, `_ViewImports`/`_ViewStart`, layouts, sections, partials, view components, built-in Tag Helpers,
    custom Tag Helpers, HTML encoding.
  - [x] Task 6.2. Create `modules/ROOT/pages/web/aspnet/core/mvc-controllers-and-views.adoc` -- controllers,
    action results, conventional vs. attribute routing, `ViewData`/`ViewBag`/`TempData`, areas, view discovery.
  - [x] Task 6.3. Create `modules/ROOT/pages/web/aspnet/core/razor-pages.adoc` -- `PageModel`, handler
    selection and naming, `@page` and route templates, `[BindProperty]`, page conventions, filters, when to
    prefer it over MVC.
  - [x] Task 6.4. `git rm modules/ROOT/pages/web/aspnet/mvc-and-razor-pages.adoc`.

- [x] Task 7. Split `web/aspnet/web-apis.adoc` (169 lines) into two new pages, then delete the original.
  - [x] Task 7.1. Create `modules/ROOT/pages/web/aspnet/core/web-api-controllers.adoc` -- `[ApiController]`
    conventions, action return types, content negotiation and `System.Text.Json` options, `ProblemDetails`,
    DTOs, CORS, minimal-API-vs-controller trade-off.
  - [x] Task 7.2. Create `modules/ROOT/pages/web/aspnet/core/openapi-and-api-versioning.adoc` -- the built-in
    `Microsoft.AspNetCore.OpenApi` package, **OpenAPI 3.1 + JSON Schema 2020-12 defaults in .NET 10**, YAML
    output, XML-doc-comment integration, document/operation/schema transformers, `IOpenApiDocumentProvider`,
    Scalar/Swagger UI, client generation with NSwag/Kiota, `Asp.Versioning.*`.
  - [x] Task 7.3. `git rm modules/ROOT/pages/web/aspnet/web-apis.adoc`.

- [x] Task 8. Split `web/aspnet/real-time-and-rpc.adoc` (145 lines) into two new pages, then delete the
  original.
  - [x] Task 8.1. Create `modules/ROOT/pages/web/aspnet/core/signalr.adoc` -- hubs, strongly typed hubs,
    clients and transports, groups and users, streaming, authentication, scale-out with Redis/Azure SignalR,
    the JS/.NET clients.
  - [x] Task 8.2. Create `modules/ROOT/pages/web/aspnet/core/grpc.adoc` -- contract-first `.proto`, the four
    call types, interceptors, gRPC-Web, JSON transcoding, deadlines/cancellation, client factory, gRPC vs.
    REST.
  - [x] Task 8.3. `git rm modules/ROOT/pages/web/aspnet/real-time-and-rpc.adoc`.

- [x] Task 9. Split `web/aspnet/blazor.adoc` (195 lines) into the 9-page Blazor cluster, then delete the
  original.
  - [x] Task 9.1. Create `modules/ROOT/pages/web/aspnet/core/blazor-overview-and-render-modes.adoc` -- what
    Blazor is and how it got here; the Blazor Web App project layout (server project + `.Client` project);
    Static SSR, streaming SSR and enhanced navigation; Interactive Server (the SignalR circuit), Interactive
    WebAssembly, Interactive Auto; global vs. per-page vs. per-component interactivity; standalone Blazor
    WebAssembly; prerendering and the double-render trap; choosing a mode. Reuses/extends the existing
    `image::aspnet-blazor-hosting-models.svg[...]` (no need to recreate it); Mermaid decision diagram.
  - [x] Task 9.2. Create `modules/ROOT/pages/web/aspnet/core/blazor-components-and-lifecycle.adoc` --
    `.razor` components, markup + `@code` vs. partial class vs. base class; `[Parameter]`, `[EditorRequired]`,
    `[CascadingParameter]` and root-level cascading values; `RenderFragment`/`ChildContent`/`RenderFragment<T>`;
    the lifecycle (`SetParametersAsync`, `OnInitialized(Async)`, `OnParametersSet(Async)`,
    `OnAfterRender(Async)`, `ShouldRender`, `IDisposable`/`IAsyncDisposable`); `StateHasChanged` and the render
    tree; `@key`; built-in components (`Virtualize`, `ErrorBoundary`, `SectionOutlet`/`SectionContent`,
    `FocusOnNavigate`, `HeadContent`/`PageTitle`, `DynamicComponent`); CSS isolation. Authors
    `image::aspnet-core-blazor-component-lifecycle.svg[...]`.
  - [x] Task 9.3. Create `modules/ROOT/pages/web/aspnet/core/blazor-data-binding-forms-and-validation.adoc` --
    one-way/two-way binding, `@bind`, `@bind:event`, `@bind:after`, `@bind:get`/`@bind:set`, format strings;
    `EventCallback` vs. `Action`; `EditForm`, `EditContext`, `InputText`/`InputNumber`/`InputSelect`/
    `InputCheckbox`/`InputDate`/`InputRadio(Group)`/`InputTextArea`/`InputFile`/**`InputHidden` (.NET 10)**;
    `DataAnnotationsValidator`, `ValidationMessage`, `ValidationSummary`, custom validation attributes,
    **nested-object and collection validation with `[ValidatableType]` (.NET 10)**; SSR form handling with
    `[SupplyParameterFromForm]` and antiforgery.
  - [x] Task 9.4. Create `modules/ROOT/pages/web/aspnet/core/blazor-routing-and-navigation.adoc` -- `@page`
    and route templates, route constraints, optional/catch-all parameters; `Router`, `AppAssembly`,
    `AdditionalAssemblies`; `NavigationManager` (`NavigateTo`, `LocationChanged`, `GetUriWithQueryParameter`);
    `[SupplyParameterFromQuery]`; `NavLink`/`NavLinkMatch`; navigation locks; **`NotFoundPage`/
    `NavigationManager.NotFound()` (.NET 10)**; enhanced navigation and form handling; layouts and nested
    layouts.
  - [x] Task 9.5. Create `modules/ROOT/pages/web/aspnet/core/blazor-state-management.adoc` -- what "state"
    means per render mode; `PersistentComponentState` and the **declarative `[PersistentState]` attribute
    (.NET 10)**, `PersistentComponentStateSerializer<T>`; **circuit state persistence across reconnects
    (.NET 10)**; in-memory state container services and DI lifetimes in Server vs. WebAssembly; browser
    `localStorage`/`sessionStorage` via JS interop or `Blazored.LocalStorage`; state in the URL; server-side
    stores; state-management libraries (Fluxor).
  - [x] Task 9.6. Create `modules/ROOT/pages/web/aspnet/core/blazor-javascript-interop.adoc` -- `IJSRuntime`,
    `InvokeAsync<T>`/`InvokeVoidAsync`; `IJSObjectReference` and JS modules; collocated JS
    (`Component.razor.js`); JS -> .NET (`[JSInvokable]` static and instance calls, `DotNetObjectReference`);
    **`InvokeConstructorAsync`, `GetValue`/`SetValue` (.NET 10)**; synchronous interop with `IJSInProcessRuntime`
    in WebAssembly; `ElementReference` and `FocusAsync`; wrapping an existing JS library; interop and
    prerendering.
  - [x] Task 9.7. Create `modules/ROOT/pages/web/aspnet/core/blazor-security.adoc` --
    `AuthenticationStateProvider`, `CascadingAuthenticationState`, `AuthorizeView`, `[Authorize]` on components,
    `AuthorizeRouteView`; auth in Server vs. WebAssembly (why WASM auth is never a trust boundary); ASP.NET
    Core Identity in a Blazor Web App; OIDC with an external identity provider (Entra ID, Auth0, Duende); token
    handling and `AuthorizationMessageHandler`; **passkeys/WebAuthn support (.NET 10)**; antiforgery, CSP and
    the reconnection UI.
  - [x] Task 9.8. Create `modules/ROOT/pages/web/aspnet/core/blazor-webassembly-hybrid-and-deployment.adoc` --
    the WebAssembly runtime, IL trimming, **AOT compilation**, SIMD, lazy loading of assemblies, native
    dependencies; **fingerprinted static assets and preloaded framework assets (.NET 10)**; boot config; PWAs
    and service workers; hosting standalone WASM on a CDN/static host vs. hosted; IIS/Nginx configuration for
    WASM; **Blazor Hybrid with .NET MAUI** (`BlazorWebView`, shared component libraries, native interop); Razor
    class libraries for sharing components; adding Blazor components to an existing MVC/Razor Pages/Angular/
    React app via custom elements.
  - [x] Task 9.9. Create `modules/ROOT/pages/web/aspnet/core/blazor-testing-and-diagnostics.adoc` -- **bUnit**
    (test project setup, rendering components, `Find`/`FindAll`, triggering events, `cut.Markup`, mocking
    services and `IJSRuntime`, testing authorization); Playwright for end-to-end; debugging Server vs.
    WebAssembly (browser debugging, Hot Reload, `WasmEnableHotReload`); **Blazor metrics, tracing and Event
    Pipe diagnostics (.NET 10)**; common production issues (circuit memory, concurrency, reconnection).
  - [x] Task 9.10. `git rm modules/ROOT/pages/web/aspnet/blazor.adoc`.

- [x] Task 10. Author the 5 genuinely new Core pages.
  - [x] Task 10.1. Create `modules/ROOT/pages/web/aspnet/core/filters-and-the-mvc-pipeline.adoc` -- the
    MVC/Razor Pages filter pipeline (not documented anywhere in the current section): authorization/resource/
    action/exception/result/page filters, order and scope, `IOrderedFilter`, short-circuiting, DI in filters
    (`ServiceFilter`, `TypeFilter`), filters vs. middleware vs. endpoint filters. Authors
    `image::aspnet-core-filter-pipeline.svg[...]` and a Mermaid pipeline diagram.
  - [x] Task 10.2. Create `modules/ROOT/pages/web/aspnet/core/static-files-and-asset-delivery.adoc` --
    `UseStaticFiles` vs. **`MapStaticAssets`**, static web assets, fingerprinting and compression, `ImportMap`,
    `wwwroot` conventions, RCL static assets, CDN and cache-control strategy.
  - [x] Task 10.3. Create `modules/ROOT/pages/web/aspnet/core/globalization-and-localization.adoc` --
    `IStringLocalizer`/`IViewLocalizer`, `.resx` conventions, `RequestLocalizationMiddleware` and culture
    providers, route/query/cookie culture, data annotations localization, Blazor localization.
  - [x] Task 10.4. Create `modules/ROOT/pages/web/aspnet/core/http-client-and-resilience.adoc` --
    `IHttpClientFactory`, named and typed clients, `HttpMessageHandler` chains,
    **`Microsoft.Extensions.Http.Resilience`/Polly** standard resilience handler, timeouts, retries, circuit
    breakers, `HttpClient` pitfalls (socket exhaustion, `DefaultRequestHeaders`), Refit/Kiota-generated clients.
  - [x] Task 10.5. Create `modules/ROOT/pages/web/aspnet/core/aspire-and-cloud-native.adoc` -- the AppHost and
    `ServiceDefaults` projects, resources and references, service discovery, the dashboard (structured logs,
    traces, metrics), integrations (PostgreSQL, Redis, RabbitMQ), local orchestration vs. deployment, and how
    it relates to Docker Compose/Kubernetes.

- [x] Task 11. Fix the forward cross-references identified in "Current code state" that still point at the
  now-deleted split-source pages.
  - [x] Task 11.1. In `core/getting-started.adoc`, repoint `xref:web/aspnet/web-apis.adoc[Details]` ->
    `xref:web/aspnet/core/web-api-controllers.adoc[Details]`,
    `xref:web/aspnet/mvc-and-razor-pages.adoc[Details]` ->
    `xref:web/aspnet/core/mvc-controllers-and-views.adoc[Details]`,
    `xref:web/aspnet/blazor.adoc[Details]` ->
    `xref:web/aspnet/core/blazor-overview-and-render-modes.adoc[Details]`, and
    `xref:web/aspnet/real-time-and-rpc.adoc[Details]` -> `xref:web/aspnet/core/signalr.adoc[Details]`.
  - [x] Task 11.2. In `core/minimal-apis.adoc`, repoint `xref:web/aspnet/web-apis.adoc[...]` ->
    `xref:web/aspnet/core/web-api-controllers.adoc[...]`.
  - [x] Task 11.3. `grep -rn "xref:web/aspnet/\(web-apis\|mvc-and-razor-pages\|blazor\|real-time-and-rpc\)\.adoc" modules/ROOT/pages/web/aspnet/core/`
    to confirm no other moved page still references the deleted filenames.

- [x] Task 12. Create `modules/ROOT/pages/web/aspnet/core/index.adoc` -- the Core sub-section's own landing
  page: what ASP.NET Core is, the .NET 10 anchor, and a page inventory grouped by theme (Getting started;
  Fundamentals: request pipeline, hosting, configuration, DI, routing, filters, static assets, HTTP client
  resilience; Building HTTP APIs & apps: Minimal APIs, MVC controllers/views, Razor syntax/Tag Helpers, Razor
  Pages, model binding, Web API controllers, OpenAPI/versioning; Interactive & real-time UI: the 9-page Blazor
  cluster, SignalR, gRPC; Data: EF Core; Security: authentication/Identity, authorization, security hardening;
  Operations: error handling/logging/observability, performance/caching; Architecture & delivery: patterns,
  testing, deployment; Cloud-native: Aspire; UI libraries; localization) covering all 39 pages, mirroring the
  "What's covered" style of today's `web/aspnet/index.adoc` but scoped to this sub-section only. Includes
  `aspnet-core-disclaimer.adoc`.

### Group 3 -- ASP.NET MVC (Razor) content

**Parallelizable: yes** -- 19 independent new files (Tasks 13-31); none exists today, so no two tasks touch the
same file, and none touches `nav.adoc`. Every page must state plainly it documents ASP.NET MVC 5.3.x on .NET
Framework 4.8.1, **not** ASP.NET Core MVC, and cross-link its Core sub-section counterpart from Group 2 where
one exists. Source material: Microsoft Learn primarily
(`https://learn.microsoft.com/en-us/aspnet/mvc/overview/`, `.../web-api/`, `.../web-pages/`, `.../signalr/`,
`.../identity/`, `https://learn.microsoft.com/en-us/previous-versions/aspnet/`), with Freeman's *Pro ASP.NET
MVC 5 Platform* (Apress, 2014) for the platform-level pages (life cycle, modules/handlers, configuration,
state, caching, Identity), and Herceg's *Modernizing .NET Web Applications* Ch. 9 for the migration page.
Consolidated validation for the group is a build check after Task 31.

- [x] Task 13. Create `modules/ROOT/pages/web/aspnet/mvc/index.adoc` -- landing, scope, the "MVC 5 != ASP.NET
  Core MVC" warning, support status, and a page inventory for all 18 content pages below. Includes
  `aspnet-mvc-disclaimer.adoc`.

- [x] Task 14. Create `modules/ROOT/pages/web/aspnet/mvc/getting-started.adoc` — The MVC 5 project template; `Global.asax` / `Application_Start`; `App_Start/RouteConfig.cs`, `BundleConfig.cs`, `FilterConfig.cs`, `WebApiConfig.cs`, `IdentityConfig.cs`, `Startup.Auth.cs`; the `Microsoft.AspNet.Mvc` / `.Razor` / `.WebPages` NuGet packages and how versions interlock; folder conventions (`Controllers`, `Views`, `Models`, `Areas`); Visual Studio scaffolding; `Views/web.config`.
- [x] Task 15. Create `modules/ROOT/pages/web/aspnet/mvc/mvc-pattern-and-request-lifecycle.adoc` — Model / View / Controller as applied here; `UrlRoutingModule` → `MvcRouteHandler` → `MvcHandler` → `IControllerFactory` → `IActionInvoker` → action → `ActionResult.ExecuteResult` → view engine; the extensibility points at each step; MVC vs. Web Forms in one table. **SVG + Mermaid sequence diagram.**
- [x] Task 16. Create `modules/ROOT/pages/web/aspnet/mvc/controllers-and-actions.adoc` — `Controller` / `ControllerBase`; action methods and selectors (`[HttpGet]`, `[HttpPost]`, `[ActionName]`, `[NonAction]`, `[AcceptVerbs]`); parameters and defaults; the `ActionResult` family (`ViewResult`, `PartialViewResult`, `JsonResult` and `JsonRequestBehavior`, `RedirectResult`, `RedirectToRouteResult`, `ContentResult`, `FileResult`, `HttpStatusCodeResult`, `HttpNotFoundResult`, `EmptyResult`); `ViewBag` vs. `ViewData` vs. `TempData` (and `TempData`'s provider/one-read semantics); async actions (`async Task<ActionResult>`); `Request`/`Response`/`Server`/`User` via `HttpContextBase`.
- [x] Task 17. Create `modules/ROOT/pages/web/aspnet/mvc/routing-and-areas.adoc` — `RouteCollection`/`RouteTable`, `MapRoute`, defaults, optional segments, constraints (regex and `IRouteConstraint`), `IgnoreRoute`, route order; **attribute routing** (`MapMvcAttributeRoutes`, `[Route]`, `[RoutePrefix]`, route names, inline constraints, optional/default values); `UrlHelper` / `Html.ActionLink` / `Url.Action` and outbound URL generation; **areas** (`AreaRegistration`, area folder layout, `AreaRegistration.RegisterAllAreas()`, ambiguous-controller pitfalls). **SVG route-matching figure.**
- [x] Task 18. Create `modules/ROOT/pages/web/aspnet/mvc/razor-syntax.adoc` — Where Razor came from (MVC 3, January 2011) and why; `@` implicit and explicit expressions; `@{ }` code blocks; `@:` and `<text>`; comments (`@* *@`); **automatic HTML encoding** and `Html.Raw`; `@model`, `@using`, `@inherits`, `@functions`, `@helper`; `_ViewStart.cshtml`; `Views/web.config` namespaces (the MVC 5 equivalent of Core's `_ViewImports`); the WebForms (`.aspx`) view engine and why Razor replaced it; **ASP.NET Web Pages 3** (`.cshtml` without MVC, `App_Start`, `@RenderPage`, `WebSecurity`) as the third framework of this era.
- [x] Task 19. Create `modules/ROOT/pages/web/aspnet/mvc/views-layouts-and-partials.adoc` — Layouts and `RenderBody`; sections (`@section`, `RenderSection`, `IsSectionDefined`); partial views — `Html.Partial` vs. `Html.RenderPartial` vs. `Html.Action` vs. `Html.RenderAction` and when each re-runs a controller; `ViewStart` chaining; display and editor templates (`DisplayFor`/`EditorFor`, `~/Views/Shared/DisplayTemplates`, `[UIHint]`, `[DataType]`); the `ViewEngines` collection and custom view engines; view compilation and `RazorGenerator`.
- [x] Task 20. Create `modules/ROOT/pages/web/aspnet/mvc/html-helpers-and-forms.adoc` — Standard vs. strongly typed vs. templated vs. inline (`@helper`) helpers; `Html.BeginForm`/`BeginRouteForm`; `LabelFor`, `TextBoxFor`, `PasswordFor`, `TextAreaFor`, `CheckBoxFor`, `RadioButtonFor`, `DropDownListFor`/`ListBoxFor` with `SelectList`, `HiddenFor`, `EditorFor`, `DisplayFor`; `ValidationMessageFor` / `ValidationSummary`; `Html.AntiForgeryToken()`; `HtmlHelper` extension methods and `MvcHtmlString`; `@Html.EnumDropDownListFor`; why Core replaced most of this with Tag Helpers (cross-link).
- [x] Task 21. Create `modules/ROOT/pages/web/aspnet/mvc/model-binding-and-validation.adoc` — Binding sources and precedence (route → query → form → files); prefixes and nested/complex/collection binding; `[Bind(Include/Exclude)]` and the **over-posting / mass-assignment** hazard; view models vs. entities; `IModelBinder`, `ModelBinderProvider`, `IValueProvider`; `DataAnnotations` (`[Required]`, `[StringLength]`, `[Range]`, `[RegularExpression]`, `[Compare]`, `[Remote]`) and `IValidatableObject`; `ModelState`, `ModelState.IsValid`, `AddModelError`; unobtrusive client validation with `jquery.validate` + `jquery.validate.unobtrusive`; `[AllowHtml]` and request validation.
- [x] Task 22. Create `modules/ROOT/pages/web/aspnet/mvc/filters.adoc` — The four filter kinds — authorization (`IAuthorizationFilter`, `[Authorize]`, `[AllowAnonymous]`, `[RequireHttps]`, `[ValidateAntiForgeryToken]`), action (`IActionFilter`, `OnActionExecuting`/`Executed`), result (`IResultFilter`, `[OutputCache]`), exception (`IExceptionFilter`, `[HandleError]`); order of execution, `Order` and `FilterScope` (global → controller → action); global filters via `FilterConfig`; `[ChildActionOnly]`; filter overrides (`[OverrideAuthorization]` …); `IFilterProvider` and DI in filters; writing a custom filter. **Mermaid filter-pipeline diagram.**
- [x] Task 23. Create `modules/ROOT/pages/web/aspnet/mvc/bundling-and-client-side-integration.adoc` — `System.Web.Optimization`: `BundleTable`, `ScriptBundle`/`StyleBundle`, `Scripts.Render`/`Styles.Render`, wildcards and ordering, `BundleTable.EnableOptimizations`, cache-busting `v=` tokens, debug vs. release; CDN fallbacks; the Bootstrap 3 + jQuery baseline of the MVC 5 template; the SPA templates (Knockout/Angular) and consuming a Web API from them; Web Essentials / Gulp / Grunt as the era's build tooling.
- [x] Task 24. Create `modules/ROOT/pages/web/aspnet/mvc/web-api-2.adoc` — `ApiController` vs. `Controller` and the two separate pipelines; `HttpConfiguration`/`WebApiConfig`; attribute routing and convention routing in Web API; `IHttpActionResult` and `ApiController` helpers (`Ok`, `NotFound`, `BadRequest`, `CreatedAtRoute`); content negotiation, media-type formatters, JSON.NET configuration; `HttpRequestMessage`/`HttpResponseMessage`; message handlers vs. filters; CORS (`Microsoft.AspNet.WebApi.Cors`); OData v4 (`Microsoft.AspNet.OData`); Help Pages and Swashbuckle; hosting: IIS vs. OWIN self-host; `HttpClient` as the client.
- [x] Task 25. Create `modules/ROOT/pages/web/aspnet/mvc/signalr-2.adoc` — Hubs and persistent connections; `Startup.MapSignalR()`; hub methods, `Clients.All`/`Caller`/`Group`/`User`, groups; the JavaScript client (`$.connection`, generated hub proxies) and the .NET client; transports and fallback (WebSockets → SSE → forever frame → long polling); authorization on hubs; scale-out backplanes (SQL Server, Redis, Azure Service Bus); how it differs from ASP.NET Core SignalR (cross-link).
- [x] Task 26. Create `modules/ROOT/pages/web/aspnet/mvc/authentication-identity-and-owin.adoc` — Forms authentication vs. **OWIN cookie authentication**; the OWIN/Katana pipeline, `Startup.cs`, `IAppBuilder`, `[assembly: OwinStartup]`; **ASP.NET Identity 2.x** — `IdentityUser`/`IdentityRole`, `UserManager`, `RoleManager`, `SignInManager`, `IdentityDbContext`, `IUserStore`, password hashing and validators, email/phone confirmation, two-factor, lockout, claims; external logins (Google, Facebook, Microsoft, Twitter) and `ExternalLoginCallback`; `[Authorize(Roles=…)]`; migrating from Membership to Identity.
- [x] Task 27. Create `modules/ROOT/pages/web/aspnet/mvc/security-hardening.adoc` — CSRF (`@Html.AntiForgeryToken()` + `[ValidateAntiForgeryToken]`, and the AJAX pattern); XSS and Razor's automatic encoding, `Html.Raw` discipline, `AntiXssEncoder`; request validation and `[AllowHtml]`; open redirect (`Url.IsLocalUrl`); clickjacking and security headers via `web.config` `<customHeaders>`; SQL injection with EF6/parameterisation; `machineKey` in farms; `[RequireHttps]`, HSTS, cookie `secure`/`httpOnly`; the OWASP Top 10 mapped onto MVC 5.
- [x] Task 28. Create `modules/ROOT/pages/web/aspnet/mvc/data-access-ef6.adoc` — EF6 `DbContext` in an MVC app; Code First, Database First and Model First; migrations (`Enable-Migrations`, `Add-Migration`, `Update-Database`, seeding); LINQ queries, eager/lazy/explicit loading and the N+1 trap; async EF6 in async actions; connection resiliency and `SetExecutionStrategy`; repository/unit-of-work over `DbContext` (and when not to); scaffolded CRUD controllers; `SelectList` for dropdowns; the EF6 vs. EF Core decision for a migrating app.
- [x] Task 29. Create `modules/ROOT/pages/web/aspnet/mvc/caching-and-performance.adoc` — `[OutputCache]` and cache profiles; donut caching and donut-hole caching (`Html.Action` + `[ChildActionOnly]`); `System.Runtime.Caching.MemoryCache` and the ASP.NET `Cache`; response compression and static-content caching in IIS; view precompilation; async all the way and thread-pool starvation; `Server.MapPath`/synchronous I/O costs; profiling with MiniProfiler and Glimpse.
- [x] Task 30. Create `modules/ROOT/pages/web/aspnet/mvc/testing-and-diagnostics.adoc` — Unit-testing controllers (asserting on `ActionResult` types and `ViewData.Model`); mocking `HttpContextBase`/`ControllerContext`/`HttpRequestBase`; testing routes (`RouteTable` resolution assertions); testing filters and helpers; testing Web API controllers; integration tests with OWIN `TestServer`; UI tests with Selenium; ELMAH and `Application_Error`; tracing and `<system.diagnostics>`.
- [x] Task 31. Create `modules/ROOT/pages/web/aspnet/mvc/migrating-to-aspnet-core.adoc` — A concrete MVC 5 → ASP.NET Core mapping table (`Global.asax`+`App_Start` → `Program.cs`; `IDependencyResolver`/third-party container → built-in DI; `HttpContextBase` → `HttpContext`; `ActionResult` → `IActionResult`; HTML helpers → Tag Helpers; `System.Web.Optimization` → `MapStaticAssets`/bundler; OWIN middleware → ASP.NET Core middleware; `ApiController` → `[ApiController]`; `AuthorizeAttribute` → policy-based authorization; `web.config` → `appsettings.json` + environment variables; Web API 2 filters → Core filters); the ASPX view engine problem; incremental migration with `System.Web.Adapters` + YARP; the .NET Upgrade Assistant; what changes semantically (sync-over-async, `HttpContext.Current`, `TempData` providers, model-binding differences).

### Group 4 -- ASP.NET Web Forms content

**Parallelizable: yes** -- 17 independent new files (Tasks 32-48); none exists today, none touches `nav.adoc`.
Every page must state plainly it documents ASP.NET Web Forms on .NET Framework 4.8.1 (security-fixes-only,
never runs on modern .NET). Source material: Esposito's *Programming Microsoft ASP.NET 4* (Microsoft Press,
2011) as the primary book, plus Evjen et al.'s *Professional ASP.NET 2.0*, Schackow's *Professional ASP.NET 2.0
Security, Membership, and Role Management* (the only deep source for `security.adoc`), Vogel's *Professional
Web Parts and Custom Controls with ASP.NET 2.0* (the only deep source for `user-and-custom-controls.adoc`), and
Freeman's *Pro ASP.NET MVC 5 Platform* for the platform pages this sub-section shares with MVC (`System.Web` is
the same runtime under both). Microsoft Learn (`https://learn.microsoft.com/en-us/aspnet/web-forms/`,
`https://learn.microsoft.com/en-us/previous-versions/aspnet/`, esp. the Page Life Cycle Overview) is
authoritative wherever it and the books disagree. Consolidated validation for the group is a build check after
Task 48.

- [x] Task 32. Create `modules/ROOT/pages/web/aspnet/web-forms/index.adoc` -- landing, scope, support status
  (security fixes only, no forward path on modern .NET, stated plainly and factually), what Web Forms is good
  at and what it costs, and a page inventory for all 16 content pages below. Includes
  `aspnet-web-forms-disclaimer.adoc`.

- [x] Task 33. Create `modules/ROOT/pages/web/aspnet/web-forms/getting-started.adoc` — Web Site Project vs. Web Application Project; `.aspx` / `.aspx.cs` anatomy; code-behind vs. inline; the `@Page` / `@Control` / `@Register` / `@Import` directives; `App_Code`, `App_Data`, `App_Themes`, `App_GlobalResources`, `App_LocalResources`, `App_Browsers`; `AutoEventWireup`; Visual Studio designer/tooling; targeting .NET Framework 4.8.1.
- [x] Task 34. Create `modules/ROOT/pages/web/aspnet/web-forms/page-lifecycle-and-postback.adoc` — The application life cycle vs. the page life cycle; the six stages (Page request, Start, Initialization, Load, Postback event handling, Rendering, Unload) and the events in order — `PreInit`, `Init`, `InitComplete`, `PreLoad`, `Load`, control events, `LoadComplete`, `PreRender`, `PreRenderComplete`, `SaveStateComplete`, `Render`, `Unload`; `IsPostBack` / `IsCallback` / `IsCrossPagePostBack`; bottom-up `Init` vs. top-down `Load`; catch-up events for dynamically added controls; data-binding events (`DataBinding` → `RowCreated`/`ItemCreated` → `RowDataBound`/`ItemDataBound` → `DataBound`); cross-page postback and `PreviousPage`. **SVG life-cycle figure + Mermaid sequence diagram of one postback.**
- [x] Task 35. Create `modules/ROOT/pages/web/aspnet/web-forms/view-state-and-control-state.adoc` — What `__VIEWSTATE` actually is; the `__doPostBack` hidden-field mechanism; ViewState vs. control state; `EnableViewState` / `ViewStateMode`; when values survive and when they do not; page-weight cost and how to measure it; `ViewStateUserKey`, MAC validation, `machineKey`, event validation; `EnableEventValidation`. **SVG round-trip figure.**
- [x] Task 36. Create `modules/ROOT/pages/web/aspnet/web-forms/server-controls.adoc` — `runat="server"` and the control tree; HTML server controls (`HtmlControl`, `HtmlContainerControl`, `HtmlGenericControl`); Web server controls (`Label`, `TextBox`, `Button`, `LinkButton`, `ImageButton`, `DropDownList`, `ListBox`, `CheckBox(List)`, `RadioButton(List)`, `Panel`, `PlaceHolder`, `HiddenField`, `Literal`); rich controls (`Calendar`, `AdRotator`, `MultiView`/`View`, `Wizard`, `FileUpload`, `Table`); common properties and styling; `Page.ClientScript.RegisterClientScriptBlock` / `RegisterStartupScript` / `RegisterClientScriptInclude`; client callbacks (`ICallbackEventHandler`) vs. postback.
- [x] Task 37. Create `modules/ROOT/pages/web/aspnet/web-forms/validation-controls.adoc` — `RequiredFieldValidator`, `RangeValidator`, `CompareValidator`, `RegularExpressionValidator`, `CustomValidator`, `ValidationSummary`; `ValidationGroup`; `Page.IsValid` and `Validate()`; the server/client duality; unobtrusive validation (4.5) and its jQuery dependency; `CausesValidation`.
- [x] Task 38. Create `modules/ROOT/pages/web/aspnet/web-forms/master-pages-themes-and-localization.adoc` — Master pages, `ContentPlaceHolder`/`Content`, nested masters, `@MasterType` and typed `Master` access, dynamic master selection in `PreInit`; themes and skins (`App_Themes`, `StyleSheetTheme` vs. `Theme`); site navigation (`Web.sitemap`, `SiteMapDataSource`, `SiteMapPath`, `Menu`, `TreeView`); URL routing for Web Forms (`System.Web.Routing`, `RouteTable`, `RouteCollection.MapPageRoute`, `RouteValues`); localization (`Culture`/`UICulture`, `InitializeCulture`, implicit `meta:resourcekey` and explicit `<%$ Resources: %>` expressions).
- [x] Task 39. Create `modules/ROOT/pages/web/aspnet/web-forms/user-and-custom-controls.adoc` — `.ascx` user controls, properties and events, `@Register` and `Reference`; custom server controls — deriving from `Control` vs. `WebControl`, `Render`/`RenderContents`, `CreateChildControls`, `INamingContainer`, composite and templated controls (`ITemplate`, `InstantiateIn`), designer attributes; building a data-bound control; **Web Parts and personalization** (`WebPartManager`, zones, `IWebPart`, connections, personalization providers, `Profile` properties).
- [x] Task 40. Create `modules/ROOT/pages/web/aspnet/web-forms/data-binding-and-data-controls.adoc` — Data-binding expressions (`<%# Eval() %>`, `Bind()`, `XPath`); data source controls (`SqlDataSource`, `ObjectDataSource`, `LinqDataSource`, `EntityDataSource`, `XmlDataSource`, `SiteMapDataSource`); data-bound controls (`GridView`, `DetailsView`, `FormView`, `Repeater`, `DataList`, `ListView`/`DataPager`); templates and `TemplateField`; paging, sorting, editing, inserting, deleting; optimistic concurrency (`ConflictDetection`); nested data-bound controls and the binding-order pitfall.
- [x] Task 41. Create `modules/ROOT/pages/web/aspnet/web-forms/model-binding-and-modern-web-forms.adoc` — The Web Forms 4.5+ story: `ItemType` and strongly typed data controls; model binding with `SelectMethod` / `UpdateMethod` / `InsertMethod` / `DeleteMethod`; value providers (`[QueryString]`, `[Control]`, `[Cookie]`, `[Form]`, `[Session]`, `[Profile]`, `[RouteData]`); DataAnnotations validation on Web Forms; friendly URLs; bundling and minification (`System.Web.Optimization`); async page methods (`RegisterAsyncTask`, `PageAsyncTask`, `Async="true"`).
- [x] Task 42. Create `modules/ROOT/pages/web/aspnet/web-forms/state-management-and-caching.adoc` — Client-side state (ViewState, control state, hidden fields, cookies, query string) vs. server-side (`Application`, `Session`, `Cache`, `Profile`); session modes `InProc` / `StateServer` / `SQLServer` / `Custom`, session-less pages, cookieless sessions; the `Cache` API, dependencies, priorities, callbacks; SQL cache dependency; output caching (`@OutputCache`, `VaryByParam`/`VaryByControl`/`VaryByCustom`/`VaryByHeader`), fragment caching, post-cache substitution (`<asp:Substitution>`); distributed output-cache providers.
- [x] Task 43. Create `modules/ROOT/pages/web/aspnet/web-forms/http-pipeline-handlers-and-configuration.adoc` — `HttpApplication` and `global.asax` events; `HttpContext`, `HttpRequest`, `HttpResponse`, `Server`; writing `IHttpHandler` / `IHttpHandlerFactory` and `.ashx`; writing `IHttpModule`; the IIS classic vs. integrated pipeline and where ASP.NET plugs in; `web.config` hierarchy and `machine.config`, `<location>`, config inheritance, `web.config` transforms, encrypting configuration sections (`aspnet_regiis -pe`); compilation models and precompilation (`aspnet_compiler`). **Mermaid pipeline diagram.**
- [x] Task 44. Create `modules/ROOT/pages/web/aspnet/web-forms/security.adoc` — Threat surface and the ASP.NET security context; Forms authentication (`FormsAuthentication`, the ticket, `<forms>` config, sliding expiration) and Windows authentication; URL authorization (`<authorization>`) and file authorization; the provider model — `MembershipProvider`, `RoleProvider`, `ProfileProvider`, `SqlMembershipProvider`, `ActiveDirectoryMembershipProvider`, `SqlRoleProvider`, `AuthorizationStoreRoleProvider`; login controls (`Login`, `LoginView`, `LoginStatus`, `CreateUserWizard`, `PasswordRecovery`, `ChangePassword`) and their events; ASP.NET Universal Providers; trust levels; request validation and `ValidateRequest`; `AntiForgery` / `ViewStateUserKey` for CSRF; `machineKey` and why it matters in a farm; claims-based identity and running ASP.NET Identity 2.x on Web Forms.
- [x] Task 45. Create `modules/ROOT/pages/web/aspnet/web-forms/ajax-and-client-side.adoc` — `ScriptManager` / `ScriptManagerProxy`; `UpdatePanel`, `UpdateProgress`, `Timer`; `UpdateMode`/`Triggers` and the real cost of partial rendering (the full page life cycle still runs); the ASP.NET AJAX client library and the AJAX Control Toolkit (historic); page methods (`[WebMethod]` static) and script services; ASMX web services and WCF from script; using jQuery and plain `fetch`/XHR against `.ashx` handlers instead; `ClientIDMode` (`Static`, `Predictable`, `AutoID`, `Inherit`).
- [x] Task 46. Create `modules/ROOT/pages/web/aspnet/web-forms/architecture-and-testing.adoc` — Why Web Forms resists unit testing; layering (presentation / business / data); the **Model-View-Presenter** pattern as the testability escape hatch (passive view vs. supervising controller, `IView`, presenter wiring, `PageViewHost`); SOLID applied to a `Page`; dependency injection in Web Forms (Unity/Autofac/StructureMap, and the built-in `IServiceProvider` hook added in .NET Framework 4.7.2); testing presenters and business logic; integration testing.
- [x] Task 47. Create `modules/ROOT/pages/web/aspnet/web-forms/deployment-and-diagnostics.adoc` — IIS application pools, integrated pipeline, 32/64-bit and CLR version settings; Web Deploy (MSDeploy) and Visual Studio publishing profiles; precompiled vs. updatable deployment; `<customErrors>` and error pages; page and application `Trace`; health monitoring (`<healthMonitoring>` events and providers); ELMAH; performance counters; the classic "works on my machine" `web.config` differences.
- [x] Task 48. Create `modules/ROOT/pages/web/aspnet/web-forms/migrating-to-modern-aspnet.adoc` — The honest support picture; the incremental-migration path with **`System.Web.Adapters` + YARP** (side-by-side, shared session/auth, page-by-page cutover); the .NET Upgrade Assistant; **Blazor Server as the closest conceptual target** (control tree → component tree, `Page_Load` → `OnInitializedAsync`, server events over SignalR instead of postbacks) with a Web Forms → Blazor concept-mapping table; in-place modernisation with DotVVM as an alternative; what has to be rewritten outright (ViewState-dependent logic, `HttpModule`s, WebParts, ASMX, Membership password hashes); realistic effort framing. Links Microsoft's free **"Blazor for ASP.NET Web Forms Developers"** e-book.

### Group 5 -- Site wiring: full `nav.adoc` restructuring

**Parallelizable: no** -- a single shared file (`modules/ROOT/nav.adoc`) must reflect the final state of all
three sub-sections plus the two new shared pages; depends on every `index.adoc` from Groups 2-4 already
existing so the nav entries and labels can be verified against real files.

- [x] Task 49. Restructure `modules/ROOT/nav.adoc`'s ASP.NET block (today at lines 272-295, already partly
  updated by Task 2.4) into the full 5-level shape:
  ```asciidoc
  *** xref:web/aspnet/index.adoc[ASP.NET Reference]
  **** xref:web/aspnet/evolution.adoc[The Evolution of ASP.NET]
  **** xref:web/aspnet/choosing-a-framework.adoc[Choosing an ASP.NET Framework]
  **** xref:web/aspnet/web-forms/index.adoc[ASP.NET Web Forms]
  ***** xref:web/aspnet/web-forms/getting-started.adoc[...]
  ***** ... (all 16 Web Forms content pages, in the order they appear in Group 4)
  **** xref:web/aspnet/mvc/index.adoc[ASP.NET MVC (Razor)]
  ***** xref:web/aspnet/mvc/getting-started.adoc[...]
  ***** ... (all 18 MVC content pages, in the order they appear in Group 3)
  **** xref:web/aspnet/core/index.adoc[ASP.NET Core (Blazor)]
  ***** xref:web/aspnet/core/getting-started.adoc[...]
  ***** ... (all 39 Core content pages, grouped by theme as in Task 12's index.adoc, replacing the flat list
    Task 2.4 wired temporarily)
  **** xref:web/aspnet/cheat-sheet.adoc[Cheat Sheets (PDF)]
  ```
  Use each page's own `=` title as its nav label (not the condensed task description above). Verify the
  resulting nesting depth (5 levels, `*****` at the deepest) renders correctly -- the custom UI bundle
  (`ui-bundle.zip`) nests `.nav-list` recursively with no depth cap per its `css/site.css`, so no UI change is
  expected, but confirm visually in `build/site` per Task 57.

### Group 6 -- Bibliography, landing page & cheat sheets

**Parallelizable: no** -- Task 50 needs to reference every sub-section by its real page count/structure (from
Groups 2-4), Task 51's PDFs are linked by Task 52, and Task 53 removes the file Task 52's rewritten page no
longer references.

- [x] Task 50. Rewrite `modules/ROOT/pages/web/aspnet/index.adoc` in full: a three-lineage overview table
  (runtime, current version/package line, support status, when to pick it), links into each sub-section's
  `index.adoc`, a trimmed "What's covered" that points at the three sub-section indexes instead of listing
  every page itself (each sub-section index now owns its own inventory, per Tasks 12/13/32), and the full,
  grouped `== Bibliography` -- adapt it directly from the already-vetted text in
  [issue #90](https://github.com/albertoirurueta/docs/issues/90)'s **Bibliography** section (its "Books
  consulted" list, grouped by era, plus the "Books deliberately excluded" table) rather than re-deriving it;
  that text was already reviewed and iterated on with the user across the issue's own comment thread. Includes
  `aspnet-shared-disclaimer.adoc`.

- [x] Task 51. Produce three new one-page, A4, printable PDFs in `modules/ROOT/attachments/`, matching the
  existing cheat-sheet PDFs' convention (headless-Chrome print-to-PDF, per their `Producer: Skia/PDF`/`Creator:
  ...HeadlessChrome...` metadata):
  - [x] Task 51.1. **First, check what PDF-rendering tooling is actually available** in this execution
    environment (a headless-Chrome/Chromium CLI, `wkhtmltopdf`, or the session's own Browser-pane tools with a
    print-to-PDF capability). If nothing suitable is available, say so explicitly in the task's progress notes
    and ask the user to generate/attach the three PDFs manually -- do not silently skip this task or fabricate
    placeholder files.
  - [x] Task 51.2. Author an HTML source per PDF (matching the visual style of the existing cheat sheets, if
    that source is recoverable, or a clean equivalent) and render `aspnet-web-forms-cheat-sheet.pdf` -- one
    page: `.aspx` skeleton and directives; the page life-cycle event order; postback/ViewState essentials; the
    server-control catalogue; validation controls and groups; master page + `ContentPlaceHolder`; a `GridView`
    + `SqlDataSource`/`ObjectDataSource` snippet; `Eval`/`Bind`; the state-management table; `@OutputCache`;
    `global.asax` events; `IHttpHandler`/`IHttpModule` skeletons; Forms auth `web.config` block; `ScriptManager`
    + `UpdatePanel`.
  - [x] Task 51.3. Render `aspnet-mvc-cheat-sheet.pdf` -- one page: `Global.asax` + `App_Start` layout; a
    controller with the main `ActionResult` types; conventional and attribute routes; Razor syntax essentials;
    layout/section/partial; the strongly typed HTML-helper set; a validated view model with DataAnnotations +
    `ModelState`; the four filter kinds and their order; `BundleConfig`; a Web API 2 `ApiController` +
    `WebApiConfig`; the OWIN `Startup` + Identity 2 registration; `@Html.AntiForgeryToken()` +
    `[ValidateAntiForgeryToken]`; an EF6 migration command block.
  - [x] Task 51.4. Render `aspnet-core-cheat-sheet.pdf` -- a refresh of today's `aspnet-cheat-sheet.pdf` for
    .NET 10, rebalanced now that Blazor has its own pages: `dotnet` CLI; minimal `Program.cs`; middleware
    order; DI lifetimes; options pattern; a `MapGroup` CRUD with `TypedResults` + endpoint filter and built-in
    validation (`AddValidation()`); a controller + `[ApiController]`; route templates; a Razor Page `PageModel`;
    Tag Helpers; a Blazor component with `@rendermode`, `EditForm` and `[PersistentState]`; SignalR hub;
    `AddDbContext` + async LINQ + migration; auth + policy; `UseExceptionHandler` + `AddProblemDetails`; output
    caching + rate limiting + `HybridCache`; `WebApplicationFactory<Program>`; `dotnet publish` + Dockerfile.

- [x] Task 52. Rewrite `modules/ROOT/pages/web/aspnet/cheat-sheet.adoc` as the 3-PDF hub: a one-line summary of
  each of the three PDFs, links to every detailed page grouped by sub-section, and three
  `xref:attachment$aspnet-<lineage>-cheat-sheet.pdf[Download the ASP.NET <Lineage> Cheat Sheet (PDF)]` links.
  Includes `aspnet-shared-disclaimer.adoc`.

- [x] Task 53. `git rm modules/ROOT/attachments/aspnet-cheat-sheet.pdf` (superseded by
  `aspnet-core-cheat-sheet.pdf`) and confirm nothing still references it:
  `grep -rl "aspnet-cheat-sheet.pdf" modules/`.

- [x] Task 54. Update `modules/ROOT/pages/web/index.adoc:32-35` (the "ASP.NET Reference" bullet in the Web
  Development card list) to describe all three lineages instead of only ASP.NET Core, matching the style of the
  other bullets in that list.

- [x] Task 55. Repo-wide safety-net grep: `grep -rn "xref:web/aspnet/" modules/ROOT/pages modules/ROOT/partials
  | grep -v "modules/ROOT/pages/web/aspnet/"` to catch any stale cross-reference introduced by Groups 2-6
  outside the section itself (the only two files found during exploration were `web/index.adoc`, fixed in Task
  54, and the disclaimer partial, replaced in Task 1 -- re-verify nothing else has appeared).

### Group 7 -- Build & verify

**Parallelizable: no** -- depends on every prior group having landed.

- [x] Task 56. Delegate a full Antora build to a sub-agent so its log doesn't consume the main context window:
  ```
  Agent({description: "Run Antora build for ASP.NET restructure", subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` in /Users/airurueta/irurueta2/common/docs and report back:
      whether it completed successfully, the full list of any warnings or errors (xref, AsciiDoc syntax,
      missing attachment/image), and a one-line pass/fail verdict. Do not summarize away any individual
      warning."})
  ```
  Fix every reported warning/error before proceeding -- the issue's acceptance criteria require **zero**
  unresolved-xref or AsciiDoc warnings.

- [x] Task 57. Spot-check the rendered site in `build/site`: confirm the 5-level nav renders and expands/
  collapses correctly for all three new sub-sections (open `build/site/web/aspnet/index.html` and its children
  via the Browser-pane tools, or inspect the generated nav HTML directly if no browser is available), and that
  `web/aspnet/core/index.adoc`, `web/aspnet/mvc/index.adoc` and `web/aspnet/web-forms/index.adoc` are all
  reachable from the sidebar.

- [x] Task 58. Confirm all three new cheat-sheet PDFs (or, per Task 51.1's fallback, the user-supplied ones)
  are correctly linked from `cheat-sheet.adoc` and open/render as single A4 pages, and that
  `aspnet-cheat-sheet.pdf` is genuinely gone and unreferenced (re-check Task 53's grep after the full build, in
  case a stale reference was introduced by a later group).
