# Implementation Plan: Web Development / ASP.NET Reference

## Task summary

Source: GitHub issue #31

Issue [#31](https://github.com/albertoirurueta/docs/issues/31) ("ASP.NET Reference") asks to add a new
**"ASP.NET Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/aspnet/` — an eighth sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, `web/react/`, and `web/angular/`. It documents
**ASP.NET Core on .NET 10 (LTS, C# 14)** as published at https://learn.microsoft.com/en-us/aspnet/core/ — the
minimal hosting model, the middleware pipeline, dependency injection, configuration and the Options pattern,
endpoint routing, Minimal APIs, MVC & Razor Pages, model binding & validation, controller-based Web APIs &
OpenAPI, Blazor with the current render modes, SignalR & gRPC, EF Core data access, authentication & ASP.NET
Core Identity, authorization, security hardening (Data Protection, HTTPS, CSRF, XSS, secrets), error handling /
logging / observability, performance & caching, solution architecture & patterns, testing, deployment, a page
on the most-used UI component libraries, plus a one-page downloadable PDF cheat sheet. Explanations must be
brief and example-driven, every concept must carry at least one runnable code example and a link to the
specific page on https://learn.microsoft.com/en-us/aspnet/core/, and `[mermaid]` diagrams and/or hand-authored
inline SVG figures are used where they clarify a concept.

Two PDF books were consulted while planning this section, both from **Packt Publishing Ltd**, Birmingham, UK:

- `~/Desktop/book1.pdf` — *Architecting ASP.NET Core Applications*, **Third Edition**, Carl-Hugo Marcotte,
  March 2024, ISBN 978-1-80512-338-5, ~800 pp, 20 chapters (design patterns / architecture; targets .NET 8 /
  C# 12). Publisher page:
  https://www.packtpub.com/en-us/product/architecting-aspnet-core-applications-third-edition-9781805123385 ;
  code bundle: https://github.com/PacktPublishing/Architecting-ASP.NET-Core-Applications-3E
- `~/Desktop/book2.pdf` — *ASP.NET Core 5 for Beginners*, Andreas Helland, Vincent Maverick Durano, Jeffrey
  Chilberto & Ed Price, December 2020, ISBN 978-1-80056-718-4, ~600 pp, 13 chapters (tutorial-driven beginner
  path; targets .NET 5). Publisher page:
  https://www.packtpub.com/en-us/product/asp-net-core-5-for-beginners-9781800567184 ; code bundle:
  https://github.com/PacktPublishing/ASP.NET-Core-5-for-Beginners

**Both books are cited only as bibliography entries** — never as the "primary" or "main" reference — a
deliberate wording difference from the jQuery and React disclaimers, matching the Angular disclaimer's "third
variant". https://learn.microsoft.com/en-us/aspnet/core/ is the source every page is written and verified
against; where a book (≈ .NET 5 or .NET 8) and the current docs (.NET 10) disagree, the docs win and the
difference is noted.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React, and
Angular reference sections. The closest and most direct precedent is
[.archive/implementation_plan_29.md](.archive/implementation_plan_29.md) (issue #29, "Angular Reference"): a new
sibling subsection of Web Development grounded in an official site plus reference books, with mermaid diagrams,
hand-authored SVG figures, a `== Bibliography`, and a headless-Chrome-rendered one-page PDF cheat sheet,
organised into four task groups (scaffold the disclaimer → parallel content pages → cheat sheet → section index
+ nav/landing wiring + build verification).
[.archive/implementation_plan_27.md](.archive/implementation_plan_27.md) (issue #27, "React Reference") is the
precedent for the `ui-component-libraries.adoc` "open-source first, commercial last, no examples for commercial"
treatment; [.archive/implementation_plan_25.md](.archive/implementation_plan_25.md) (issue #25) is the
precedent for the AsciiDoc literal-brace warning note and the one-A4-page PDF verification step;
[.archive/implementation_plan_19.md](.archive/implementation_plan_19.md) (issue #19) is the precedent for
splitting an issue's coarse topic bullets into finer pages.

**Choices made on the user's behalf** (best-practice defaults consistent with this repo's established pattern
and the issue text — stated here so they can be challenged during review):

- **Documenting the current stable ASP.NET Core line as published at
  https://learn.microsoft.com/en-us/aspnet/core/** (ASP.NET Core 10.0 on .NET 10 LTS, C# 14; released 11
  November 2025, supported to November 2028). Pages are not pinned to a patch version. All examples use the
  **minimal hosting model** (`WebApplication.CreateBuilder` in `Program.cs`, no `Startup` class), top-level
  statements, `builder.Services` registration, endpoint routing, **Minimal APIs as the default for new HTTP
  APIs** (with controller-based APIs shown as the documented alternative), `AddAuthorizationBuilder`, typed
  results (`TypedResults` / `Results<T…>`), the built-in `Microsoft.AspNetCore.OpenApi` package, output
  caching, `HybridCache`, rate limiting, and the current **Blazor Web App** render-mode model (Static SSR /
  Interactive Server / Interactive WebAssembly / Interactive Auto). Where a book uses an older pattern
  (`Startup.cs` + `Configure`/`ConfigureServices`, `IWebHostBuilder`, pre-Minimal-API controllers only, Blazor
  Server/WASM as separate project types, `Newtonsoft.Json` defaults, `HttpClientFactory` idioms from .NET 5),
  the page documents the current approach and notes the change.
- **Page breakdown: 22 concept/library pages + 1 cheat sheet + 1 section index (24 `.adoc` files).** The
  issue's own page list is already granular; no further splitting is warranted. The `ui-component-libraries.adoc`
  page (issue page 22, added on the user's follow-up) is treated as mandatory.
- **`ui-component-libraries.adoc` lists free / open-source libraries first, ordered roughly by adoption, then a
  short "commercial suites" note last**, per the issue: styling options (Bootstrap/LibMan, Tailwind, Sass,
  Blazor CSS isolation) → open-source Blazor component libraries (MudBlazor → Radzen → Blazorise → Microsoft
  Fluent UI Blazor → Ant Design Blazor → HAVIT Blazor / Blazor Bootstrap → MatBlazor), each with licence, an
  install/register + `Button`/`Dialog`/`Grid` example, and its **official site link** → a one-line note that
  server-rendered MVC/Razor Pages UI is mostly Bootstrap + Tailwind + custom Tag Helpers → commercial suites
  (Telerik, Syncfusion, DevExpress, Ignite UI) one line + official link each, no examples, flagged paid.
- **Both books promoted to bibliography-only.** Neither the disclaimer nor any per-page admonition may describe
  either book as the primary or main reference; they appear only as `== Bibliography` entries and (for
  `architecture-and-patterns.adoc`) as "informed by" context.
- **The subsection is named "ASP.NET Reference"** in the section index title, the `web/index.adoc` bullet, the
  `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing siblings.
- **Placed last**, after Angular Reference, in `nav.adoc`, `web/index.adoc`, and the root `index.adoc` — the
  same "append in the order added" ordering every prior subsection followed.
- **Mermaid is the default for concept diagrams; three hand-authored SVGs** where a spatial figure is clearer
  than a flowchart: `aspnet-di-lifetimes.svg` (singleton / scoped / transient resolution across two requests),
  `aspnet-clean-architecture.svg` (Domain / Application / Infrastructure / Presentation dependency rings), and
  `aspnet-blazor-hosting-models.svg` (Interactive Server vs. Interactive WebAssembly vs. Auto). Mermaid covers:
  the request → middleware pipeline → endpoint flow, the endpoint-routing match, the MVC request flow, content
  negotiation, the Blazor render-mode decision tree, a SignalR client/hub sequence, the OAuth 2.0 / OIDC
  authorization-code flow, the authentication → authorization → endpoint sequence, the Data Protection key
  ring, output vs. response caching hit paths, a request crossing the Clean Architecture layers, and the
  container build-and-deploy flow. The implementer may add further small SVGs under `modules/ROOT/images/` if
  one adds real value while writing a page (following the existing `*.svg` convention) — not pre-planned as
  separate tasks.
- **Cross-reference existing pages instead of duplicating them**: `security-hardening.adoc` and `web-apis.adoc`
  link `xref:web/cors.adoc[]`; `ui-component-libraries.adoc` links `xref:web/bootstrap/index.adoc[]`,
  `xref:web/sass/index.adoc[]`, and `xref:web/accessibility.adoc[]`; `data-access-ef-core.adoc` links
  `xref:database/sql/index.adoc[]`; `getting-started.adoc` links `xref:web/react/index.adoc[]` and
  `xref:web/angular/index.adoc[]` from its client-side-integration note; `real-time-and-rpc.adoc` links
  `xref:web/javascript/browser-networking.adoc[]` for the underlying WebSocket/SSE model.
- **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
  layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
  static checked-in asset at `modules/ROOT/attachments/aspnet-cheat-sheet.pdf`, and linked via
  `xref:attachment$aspnet-cheat-sheet.pdf[Download the ASP.NET Cheat Sheet (PDF)]`. The cheat sheet must be
  **exactly one A4 page** (page-count check + a rendered preview with no clipping).
- **No "quiz"/"related questions" page** — neither book has chapter-end multiple-choice quizzes to transcribe
  (the jQuery section had one only because its book did).
- **No project-picker icon/xref** for ASP.NET Reference — like the other Web Development subsections it lives
  only under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no lint/test
  suite). The installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none applies**;
  every task below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left **untagged**.
- **Web Development** (`modules/ROOT/pages/web/index.adoc`) currently lists two standalone pages
  (`web/cors.adoc`, `web/accessibility.adoc`) then seven subsections: **HTML & CSS Reference**, **Sass
  Reference**, **JavaScript Development**, **Bootstrap Reference**, **jQuery Reference**, **React Reference**,
  **Angular Reference**. All follow the identical structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. `modules/ROOT/partials/angular-disclaimer.adoc` is the **"third variant"** to
    follow: the official site is the reference the pages are written and verified against; the book(s) are named
    **only as bibliography entries**, not as the primary source.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph.
  - A section `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    `modules/ROOT/pages/web/react/index.adoc` and `modules/ROOT/pages/web/angular/index.adoc` for the exact
    format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the
    actual PDF under `modules/ROOT/attachments/` (existing: `html-css-`, `sass-`, `javascript-`, `bootstrap-`,
    `jquery-`, `react-`, `angular-`, `sql-cheat-sheet.pdf`).
  - `nav.adoc` lists `Web Development` (`**` under `* Guides & References`) with each subsection (`***`) and
    its own detail pages (`****`). The Angular block is currently last, ending
    `**** xref:web/angular/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    (around lines 99–104) lists Web Development with its subsections nested one level under it (`**`), Angular
    last.
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml):
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram
  mechanism used in this repo; ~20 existing usages), `@djencks/asciidoctor-mathjax` (unused here). No
  `source-highlighter` attribute is set; existing pages use `[source,javascript]` / `[source,html]` etc. and
  render fine.
- **AsciiDoc gotcha** (from `.archive/implementation_plan_19.md` / `_25.md` / `_27.md` / `_29.md`): inline
  `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference and emits a "skipping
  reference to missing attribute" build **warning**. This is acute for ASP.NET prose, which is full of C#
  object initializers (`new Foo \{ Bar = 1 }`), route templates (`\{id:int}`, `[HttpGet("\{id}")]`), string
  interpolation (`$"\{userId}"`), and config keys. Escape any literal braces in prose as `\{ … }` (e.g.
  `[HttpGet("\{id}")]`). Inside `[source,…]` blocks **no escaping is needed**. Angle-bracket generics
  (`ActionResult<T>`, `IOptions<T>`, `Results<Ok<T>, NotFound>`) are fine unescaped. The final build (Task 28)
  must come back with **zero** such warnings.
- **`[source]` language tokens**: use `[source,csharp]` for C#, `[source,razor]` / `[source,cshtml]` for Razor
  components and views, `[source,json]` for `appsettings`/config, `[source,xml]` for `.csproj`/`web.config`,
  `[source,bash]` for the `dotnet` CLI, `[source,yaml]` for GitHub Actions / Docker Compose, `[source,dockerfile]`
  or `[source,docker]` for Dockerfiles. If a token ever produces a build issue, fall back progressively
  (`csharp` → `c#` → `text`) — verified by the Task 28 build.
- **New file map** this plan creates under `modules/ROOT/pages/web/aspnet/` (all `.adoc`, 24 files):
  `getting-started.adoc`, `request-pipeline-and-middleware.adoc`, `hosting-servers-and-environments.adoc`,
  `configuration-and-options.adoc`, `dependency-injection.adoc`, `routing.adoc`, `minimal-apis.adoc`,
  `mvc-and-razor-pages.adoc`, `model-binding-and-validation.adoc`, `web-apis.adoc`, `blazor.adoc`,
  `real-time-and-rpc.adoc`, `data-access-ef-core.adoc`, `authentication-and-identity.adoc`, `authorization.adoc`,
  `security-hardening.adoc`, `error-handling-logging-and-observability.adoc`, `performance-and-caching.adoc`,
  `architecture-and-patterns.adoc`, `testing.adoc`, `deployment.adoc`, `ui-component-libraries.adoc`,
  `cheat-sheet.adoc`, `index.adoc`. Plus `modules/ROOT/partials/aspnet-disclaimer.adoc`,
  `modules/ROOT/images/aspnet-di-lifetimes.svg`, `modules/ROOT/images/aspnet-clean-architecture.svg`,
  `modules/ROOT/images/aspnet-blazor-hosting-models.svg`,
  `modules/ROOT/attachments/aspnet-cheat-sheet.pdf`, and edits to `modules/ROOT/pages/web/index.adoc`,
  `modules/ROOT/nav.adoc`, and `modules/ROOT/pages/index.adoc`.

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then
  a blank line, then `include::partial$aspnet-disclaimer.adoc[]`, then a one/two-sentence lead paragraph.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** —
  `[source,csharp]` / `[source,razor]` / `[source,json]` / `[source,bash]` / `[source,xml]` as appropriate.
- **Every concept links to the specific https://learn.microsoft.com/en-us/aspnet/core/ page** for it (inline
  `https://learn.microsoft.com/…[link text]`), not just a generic "see the ASP.NET Core docs".
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Prefer **modern, minimal-hosting ASP.NET Core** everywhere: `Program.cs` with `WebApplication` (no `Startup`),
  Minimal APIs as the default for new HTTP APIs, `builder.Services` + `provide*`/`Add*` extensions, endpoint
  routing, `AddAuthorizationBuilder`, typed results, the built-in OpenAPI package, output caching, the current
  Blazor Web App render modes. Where a book uses an older pattern, document the current one and note the change.
- Diagrams via `[mermaid]` blocks; figures via `image::<name>.svg[alt,…]` with the SVG hand-authored under
  `modules/ROOT/images/` (named `aspnet-*.svg`).

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2 page includes the partial it creates).

- [x] Task 1. Create the ASP.NET disclaimer partial — `modules/ROOT/partials/aspnet-disclaimer.adoc`
  - [x] Task 1.1. Create `modules/ROOT/partials/aspnet-disclaimer.adoc` as an `[IMPORTANT]` admonition
    following the shape of `modules/ROOT/partials/angular-disclaimer.adoc`. It must state:
    - this section documents **ASP.NET Core on .NET 10 (LTS)**, the current release — the minimal hosting model,
      the middleware pipeline, dependency injection, Minimal APIs, MVC & Razor Pages, Blazor with the current
      render modes, SignalR/gRPC, EF Core, Identity & policy-based authorization, output caching, rate limiting,
      and Native-AOT-aware building — as described by the official documentation at
      https://learn.microsoft.com/en-us/aspnet/core/[Microsoft Learn], **which is the reference these pages are
      written and verified against**;
    - the content was generated with the assistance of AI and should be verified against
      https://learn.microsoft.com/en-us/aspnet/core/[the official documentation] before being relied on in
      production, since .NET ships a major release every November and APIs continue to evolve (examples target
      **.NET 10 / C# 14**);
    - *Architecting ASP.NET Core Applications* (Marcotte, 3rd ed., Packt Publishing, 2024) and *ASP.NET Core 5
      for Beginners* (Helland et al., Packt Publishing, 2020) are **listed in the bibliography** and were
      consulted while preparing the section — worded so it does **not** state or imply either book is the
      primary or main reference, and noting that both predate .NET 10 so the official documentation wins on any
      discrepancy.
  - [x] Task 1.2. Confirm it is included via `include::partial$aspnet-disclaimer.adoc[]` on every page created
    in Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` /
    `:keywords:` block — identical syntax/placement to `include::partial$angular-disclaimer.adoc[]` in
    `modules/ROOT/pages/web/angular/index.adoc`.

- [x] **Task 1 done** — created `modules/ROOT/partials/aspnet-disclaimer.adoc` (`[IMPORTANT]` admonition,
  third-variant wording: MS Learn is the reference, both Packt books bibliography-only and explicitly not the
  primary/main reference). Verified included on every Group 2–4 page below.

### Group 2 — Content pages

**Parallelizable: yes** — 22 independent pages (Tasks 2–23). Each includes the Group 1 disclaimer partial and
may cross-reference existing `web/**` / `database/**` pages, but **none depends on another new page in this
plan** (cross-links between the new pages are fine to write now — the targets are all listed in this plan and
validated together in Task 28). Each page follows the "Conventions" section above. Every page lists the
learn.microsoft.com area it is checked against and, where relevant, the book chapter(s) that informed it.

- [x] Task 2. Create `modules/ROOT/pages/web/aspnet/getting-started.adoc` (book 2 ch. 1–2; book 1 ch. 1; MS
  Learn "Overview", "Tutorials", `dotnet` CLI)
  - [x] Task 2.1. What ASP.NET Core is: a cross-platform, open-source web framework on .NET for web apps, HTTP
    APIs, and real-time services; **.NET 10 LTS**, C# 14, the yearly November cadence and the LTS/STS support
    model. Links: https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core,
    https://dotnet.microsoft.com/platform/support/policy/dotnet-core.
  - [x] Task 2.2. The SDK & CLI: `dotnet --info`, `dotnet new` (templates `web`, `webapi`, `webapp`, `mvc`,
    `blazor`), `dotnet run`, `dotnet watch`, `dotnet build`, `dotnet publish`, `dotnet test`, `dotnet add
    package`. `[source,bash]`. Link https://learn.microsoft.com/en-us/dotnet/core/tools/.
  - [x] Task 2.3. Project layout: `Program.cs`, the `Microsoft.NET.Sdk.Web` `.csproj`, `appsettings.json` /
    `appsettings.{Environment}.json`, `Properties/launchSettings.json`, `wwwroot/`. `[source,xml]` +
    `[source,json]`.
  - [x] Task 2.4. The **minimal hosting model**: `WebApplication.CreateBuilder(args)` → register services on
    `builder.Services` → `builder.Build()` → configure middleware → `app.Run()`. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/.
  - [x] Task 2.5. The app models at a glance and how to choose (Minimal API vs. MVC vs. Razor Pages vs. Blazor
    vs. SignalR vs. gRPC) — one short paragraph + link each, then a decision table. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/apis.
  - [x] Task 2.6. Tooling & dev setup: Visual Studio / VS Code + C# Dev Kit / Rider; `dotnet dev-certs https
    --trust`; the `.localhost` TLD support added in .NET 10. Client-side integration (brief): SPA templates,
    `LibMan`, bundling — one paragraph + `xref:web/react/index.adoc[]` / `xref:web/angular/index.adoc[]`.

- [x] Task 3. Create `modules/ROOT/pages/web/aspnet/request-pipeline-and-middleware.adoc` (book 2 ch. 8; MS
  Learn "Middleware", "HttpContext", "Static files")
  - [x] Task 3.1. Request/response over HTTP; the pipeline as an ordered chain of `RequestDelegate`s; `next()`
    and short-circuiting. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/.
  - [x] Task 3.2. `app.Use(...)`, `app.Run(...)`, `app.Map(...)` / `app.MapWhen(...)`; the **recommended
    middleware order** (exception handler → HSTS → HTTPS redirection → static files → routing → CORS →
    authentication → authorization → endpoints). `[source,csharp]`.
  - [x] Task 3.3. Built-in middleware tour: `UseExceptionHandler`, `UseStaticFiles` / `MapStaticAssets`,
    `UseRouting` / endpoint execution, `UseCors`, `UseAuthentication` / `UseAuthorization`,
    `UseResponseCompression`, `UseResponseCaching` / `UseOutputCache`, `UseRateLimiter`, `UseRequestLocalization`.
  - [x] Task 3.4. Writing custom middleware: inline lambda, the convention-based class
    (`InvokeAsync` + constructor `RequestDelegate`), and **factory-based** middleware (`IMiddleware` +
    `AddTransient`); when to use each. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/write.
  - [x] Task 3.5. `HttpContext`: `Request` / `Response` / `User` / `Items` / `RequestServices` / `Features`;
    reading the body; `IHttpContextAccessor` caveats. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/httpcontext.
  - [x] Task 3.6. A `[mermaid]` diagram of one request flowing through the pipeline to an endpoint and back
    (each middleware wrapping the next; a short-circuit branch).

- [x] Task 4. Create `modules/ROOT/pages/web/aspnet/hosting-servers-and-environments.adoc` (book 2 ch. 2; MS
  Learn "Host", "Servers", "Environments")
  - [x] Task 4.1. `WebApplication` / `WebApplicationBuilder` vs. the **Generic Host**
    (`Host.CreateApplicationBuilder`); host vs. app configuration; `IHostApplicationLifetime`. `[source,csharp]`.
    Link https://learn.microsoft.com/en-us/aspnet/core/fundamentals/host/generic-host.
  - [x] Task 4.2. **Background work**: `IHostedService` and `BackgroundService`; `AddHostedService`; graceful
    shutdown. `[source,csharp]`.
  - [x] Task 4.3. Servers: **Kestrel** (endpoints via config / `ConfigureKestrel`, HTTP/1.1, HTTP/2, HTTP/3,
    TLS, limits), **IIS / ASP.NET Core Module** (in-process vs. out-of-process), **HTTP.sys**. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel.
  - [x] Task 4.4. Reverse proxies (Nginx, Apache, YARP) and `UseForwardedHeaders` for scheme / client IP behind
    a proxy or load balancer.
  - [x] Task 4.5. **Environments**: `ASPNETCORE_ENVIRONMENT`, `IWebHostEnvironment`,
    `app.Environment.IsDevelopment()`, environment-specific config and the Razor `<environment>` tag helper.
    Link https://learn.microsoft.com/en-us/aspnet/core/fundamentals/environments.

- [x] Task 5. Create `modules/ROOT/pages/web/aspnet/configuration-and-options.adoc` (book 1 ch. 9; book 2 ch. 2;
  MS Learn "Configuration", "Options")
  - [x] Task 5.1. Configuration providers and precedence: `appsettings.json`, `appsettings.{Environment}.json`,
    **User Secrets** (`dotnet user-secrets`), environment variables, command-line args, in-memory, Azure Key
    Vault; hierarchical keys and `:` / `__`. `[source,json]` + `[source,bash]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/.
  - [x] Task 5.2. Reading config: `IConfiguration`, `GetValue`, `GetSection`, `GetConnectionString`,
    `Configuration.Bind`. `[source,csharp]`.
  - [x] Task 5.3. The **Options pattern**: `services.Configure<TOptions>(section)`; `IOptions<T>` vs.
    `IOptionsSnapshot<T>` vs. `IOptionsMonitor<T>`; **named options**. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/options.
  - [x] Task 5.4. **Validation**: DataAnnotations + `ValidateDataAnnotations()`, `Validate(...)` delegates,
    `IValidateOptions<T>`, `ValidateOnStart()`; the configuration-binding and options-validation **source
    generators**. Cross-link `xref:web/aspnet/security-hardening.adoc[]` for "never store secrets in
    `appsettings.json`".

- [x] Task 6. Create `modules/ROOT/pages/web/aspnet/dependency-injection.adoc` (book 1 ch. 8; book 2 ch. 3; MS
  Learn "Dependency injection")
  - [x] Task 6.1. What DI is and why the framework is built on it; `IServiceCollection` → `IServiceProvider`.
    Link https://learn.microsoft.com/en-us/aspnet/core/fundamentals/dependency-injection.
  - [x] Task 6.2. **Lifetimes**: `AddSingleton` / `AddScoped` / `AddTransient`; what a "scope" is (one per
    request); the **captive-dependency** pitfall and scope validation in Development. `[source,csharp]`.
  - [x] Task 6.3. Registration techniques: implementation type, instance, **factory delegate**, `TryAdd*`,
    `TryAddEnumerable`, **keyed services** (`AddKeyedScoped` / `[FromKeyedServices]`). Link
    https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection.
  - [x] Task 6.4. Consuming services: constructor injection in controllers / Razor Pages / hubs / middleware;
    implicit service parameters and `[FromServices]` in **Minimal API** handlers; `@inject` in Razor;
    `IServiceScopeFactory` for manual scopes in singletons / background services. `[source,csharp]` +
    `[source,razor]`.
  - [x] Task 6.5. Replacing the built-in container (e.g. Autofac) via `UseServiceProviderFactory` — brief. Link
    https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection-guidelines.
  - [x] Task 6.6. Embed `image::aspnet-di-lifetimes.svg[…]` (created in Task 6.7) showing singleton / scoped /
    transient resolution across two consecutive requests.
  - [x] Task 6.7. Create `modules/ROOT/images/aspnet-di-lifetimes.svg` — a hand-authored figure following the
    existing SVG convention (`box-model.svg`, `react-one-way-data-flow.svg`, `angular-injector-hierarchy.svg`).

- [x] Task 7. Create `modules/ROOT/pages/web/aspnet/routing.adoc` (MS Learn "Routing"; MVC "Routing")
  - [x] Task 7.1. The two-step model: `UseRouting` matches, endpoint middleware executes; the
    `EndpointDataSource`. Link https://learn.microsoft.com/en-us/aspnet/core/fundamentals/routing.
  - [x] Task 7.2. Route templates: literals, `\{param}`, `\{param?}`, `\{*catchAll}`, defaults, **constraints**
    (`:int`, `:guid`, `:regex(...)`, custom `IRouteConstraint`). `[source,csharp]`.
  - [x] Task 7.3. `MapGet` / `MapPost` / …, `MapControllers`, `MapControllerRoute` (conventional),
    `MapRazorPages`, `MapHub`, `MapGrpcService`; **route groups** (`MapGroup`) and shared metadata.
  - [x] Task 7.4. Attribute routing (`[Route]`, `[HttpGet("\{id:int}")]`, `[controller]` / `[action]` tokens)
    vs. conventional routing; route precedence & `Order`. Link
    https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/routing.
  - [x] Task 7.5. URL generation with `LinkGenerator` / `IUrlHelper`; endpoint metadata; **short-circuit
    routes** (`.ShortCircuit()` / `MapShortCircuit`).
  - [x] Task 7.6. A `[mermaid]` diagram: incoming URL → template match → constraint check → selected endpoint.

- [x] Task 8. Create `modules/ROOT/pages/web/aspnet/minimal-apis.adoc` (book 1 ch. 5; MS Learn "Minimal APIs
  quick reference")
  - [x] Task 8.1. `WebApplication` + `Map{Get,Post,Put,Patch,Delete}`; lambda and method-group handlers;
    `MapGroup` for a resource; per-group metadata (`.WithTags`, `.RequireAuthorization`, `.AddEndpointFilter`).
    `[source,csharp]`. Link https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/overview.
  - [x] Task 8.2. **Parameter binding**: route / query / header / body (JSON) / `IFormFile` / services /
    `HttpContext` / `[AsParameters]`; explicit `[FromRoute]` / `[FromQuery]` / `[FromBody]` / `[FromForm]` /
    `[FromServices]`; `TryParse` / `BindAsync` on custom types. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/parameter-binding.
  - [x] Task 8.3. **Results**: `IResult`, `Results.Ok/NotFound/Problem/...`, strongly-typed `TypedResults`,
    `Results<T1,T2>` union for OpenAPI; returning plain objects (auto-JSON); `TypedResults.Stream` and
    `TypedResults.ServerSentEvents` (.NET 10). Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/responses.
  - [x] Task 8.4. **Endpoint filters** (`IEndpointFilter` / `AddEndpointFilter`) for cross-cutting concerns; the
    filter chain vs. middleware. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/min-api-filters.
  - [x] Task 8.5. **Validation** with `builder.Services.AddValidation()` (.NET 10) — DataAnnotations /
    `IValidatableObject` / records — plus the manual validation-filter pattern for earlier approaches. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis/validation.
  - [x] Task 8.6. Error handling (`AddProblemDetails`, `Results.Problem`, `Results.ValidationProblem`); a note
    that OpenAPI metadata (`WithName` / `ProducesProblem`) is detailed on `web-apis.adoc`; auth
    (`.RequireAuthorization` / `.AllowAnonymous`).
  - [x] Task 8.7. A full worked example: an in-memory `TodoDb` CRUD API with `MapGroup`, `TypedResults`, a
    validation `IEndpointFilter`, and OpenAPI metadata. `[source,csharp]`.

- [x] Task 9. Create `modules/ROOT/pages/web/aspnet/mvc-and-razor-pages.adoc` (book 2 ch. 4; book 1 ch. 6; MS
  Learn "MVC overview", "Razor Pages")
  - [x] Task 9.1. The **MVC** pattern; `AddControllersWithViews()` / `AddControllers()` / `AddRazorPages()`.
    Link https://learn.microsoft.com/en-us/aspnet/core/mvc/overview.
  - [x] Task 9.2. **Controllers**: `Controller` vs. `ControllerBase`; action methods; results (`View`, `Ok`,
    `NotFound`, `RedirectToAction`, `File`); `[ApiController]` conventions. `[source,csharp]`.
  - [x] Task 9.3. **Views**: Razor syntax (`@`, `@\{ }`, `@model`, `@if` / `@foreach`, `@functions`), `_ViewStart`
    / `_ViewImports`, **layouts** & sections, **partial views** (`<partial>`), **view components**
    (`ViewComponent`, `InvokeAsync`), strongly-typed views. `[source,cshtml]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/mvc/views/overview.
  - [x] Task 9.4. **Razor Pages**: `@page`, the `PageModel`, handler methods (`OnGet` / `OnPostAsync` / named
    handlers), `[BindProperty]`, page routes & conventions, `RedirectToPage`; when Razor Pages beats MVC — a
    short comparison table. `[source,cshtml]` + `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/razor-pages/.
  - [x] Task 9.5. **Tag Helpers**: built-in (`asp-for`, `asp-action` / `asp-controller`, `asp-page`,
    `asp-validation-for`, `<environment>`, `<cache>`, `<partial>`, script/link cache-busting); writing a custom
    `TagHelper`; Tag Helper Components. `[source,cshtml]` + `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/mvc/views/tag-helpers/intro.
  - [x] Task 9.6. **Session & state**: `AddSession` / `ISession`, `TempData`, cookies; the state-management
    options table. **Globalization & localization** (brief): `AddLocalization`, `IStringLocalizer`, `.resx`,
    `RequestLocalizationOptions`. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/localization.
  - [x] Task 9.7. A `[mermaid]` diagram of the MVC request flow (routing → controller → model → view →
    response).

- [x] Task 10. Create `modules/ROOT/pages/web/aspnet/model-binding-and-validation.adoc` (book 1 ch. 4; MS Learn
  "Model binding", "Model validation")
  - [x] Task 10.1. **Model binding** sources and order (form values, route data, query string, headers, body);
    binding simple types, complex objects, collections, dictionaries, `DateOnly`/`TimeOnly`, files
    (`IFormFile`). `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/mvc/models/model-binding.
  - [x] Task 10.2. Attributes: `[BindRequired]`, `[BindNever]`, `[FromHeader]`, `[FromForm]`, `[ModelBinder]`;
    `[Bind]` / `[BindProperty]`; input formatters for JSON bodies.
  - [x] Task 10.3. **Custom model binding**: `IModelBinder` + `IModelBinderProvider`; the `TryParse` shortcut
    for route/query. Link
    https://learn.microsoft.com/en-us/aspnet/core/mvc/advanced/custom-model-binding.
  - [x] Task 10.4. **Validation**: DataAnnotations (`[Required]`, `[Range]`, `[StringLength]`, `[EmailAddress]`,
    `[RegularExpression]`, `[Compare]`), `ModelState.IsValid`, automatic 400 under `[ApiController]`,
    `IValidatableObject`, custom `ValidationAttribute`, model-level/cross-field validation. `[source,csharp]`.
    Link https://learn.microsoft.com/en-us/aspnet/core/mvc/models/validation.
  - [x] Task 10.5. **Client-side**: unobtrusive validation with jQuery Validation, `asp-validation-summary`,
    `[Remote]`; nullable reference types and implicit `[Required]`.

- [x] Task 11. Create `modules/ROOT/pages/web/aspnet/web-apis.adoc` (book 1 ch. 4–5; MS Learn "Create web
  APIs", "OpenAPI")
  - [x] Task 11.1. `ControllerBase` + `[ApiController]` + attribute routing; when to choose controllers over
    Minimal APIs. `[source,csharp]`. Link https://learn.microsoft.com/en-us/aspnet/core/web-api/.
  - [x] Task 11.2. Action return types: `IActionResult`, `ActionResult<T>`, `Results<Ok<T>, NotFound>`;
    status-code helpers. Link
    https://learn.microsoft.com/en-us/aspnet/core/web-api/action-return-types.
  - [x] Task 11.3. **Content negotiation & formatting**: `System.Text.Json` options (naming policy, enums,
    source generation), the XML formatter, custom `TextOutputFormatter`, `Produces` / `Consumes`. Link
    https://learn.microsoft.com/en-us/aspnet/core/web-api/advanced/formatting.
  - [x] Task 11.4. **Error responses**: `ProblemDetails` / `ValidationProblemDetails` (RFC 9457),
    `AddProblemDetails`, exception → problem mapping. Link
    https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors.
  - [x] Task 11.5. **DTOs & API contracts** (book 1): shaping request/response models, not leaking entities;
    one short example.
  - [x] Task 11.6. **OpenAPI**: the built-in `Microsoft.AspNetCore.OpenApi` package (`AddOpenApi` / `MapOpenApi`,
    OpenAPI **3.1**, YAML, XML-doc comments in .NET 10); UI options — Swagger UI (Swashbuckle), Scalar, NSwag;
    `[ProducesResponseType(Description=…)]`. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview.
  - [x] Task 11.7. **API versioning** with `Asp.Versioning.*` (URL segment, query, header, media type); **CORS**
    for APIs (cross-link `xref:web/cors.adoc[]`); `JsonPatch`; the `.http` file for manual testing.
  - [x] Task 11.8. A `[mermaid]` diagram of content negotiation (Accept header → formatter selection →
    serialized body).

- [x] Task 12. Create `modules/ROOT/pages/web/aspnet/blazor.adoc` (book 2 ch. 5–6; MS Learn "Blazor")
  - [x] Task 12.1. What Blazor is: interactive web UI with C# components (`.razor`); the **Blazor Web App**
    project and its unified model. Link https://learn.microsoft.com/en-us/aspnet/core/blazor/.
  - [x] Task 12.2. **Render modes**: Static SSR, Interactive Server (SignalR circuit), Interactive WebAssembly,
    Interactive Auto; per-page / per-component `@rendermode`; when to use which; standalone Blazor WebAssembly
    and Blazor Hybrid (MAUI) as pointers. `[source,razor]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/blazor/components/render-modes.
  - [x] Task 12.3. **Components**: `[Parameter]`, `[CascadingParameter]`, `[EditorRequired]`, `EventCallback`,
    `RenderFragment` / templated components, `@key`, `@ref`, lifecycle (`OnInitializedAsync`,
    `OnParametersSetAsync`, `OnAfterRenderAsync`, `ShouldRender`, `IDisposable` / `IAsyncDisposable`),
    `StateHasChanged` and `InvokeAsync`. `[source,razor]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/blazor/components/.
  - [x] Task 12.4. **Routing & navigation**: `@page`, `NavigationManager`, route params & constraints,
    `NavLink`, `NotFoundPage` / `NavigationManager.NotFound()` (.NET 10), enhanced navigation.
  - [x] Task 12.5. **Forms**: `EditForm`, `EditContext`, `InputText` / `InputNumber` / `InputSelect` /
    `InputDate` / `InputHidden` (.NET 10), `DataAnnotationsValidator`, `ValidationSummary`, nested-model
    validation (.NET 10). `[source,razor]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/blazor/forms/.
  - [x] Task 12.6. **JS interop**: `IJSRuntime.InvokeAsync`, `[JSInvokable]`, `IJSObjectReference`, isolated JS
    modules, `[JSImport]` / `[JSExport]` for Wasm. Link
    https://learn.microsoft.com/en-us/aspnet/core/blazor/javascript-interoperability/.
  - [x] Task 12.7. **State**: cascading state, DI-scoped services, `PersistentComponentState` /
    `[PersistentState]` (.NET 10), protected browser storage. **Data & performance**: `HttpClient` / typed
    clients, `QuickGrid`, `Virtualize`, streaming rendering, prerendering, Wasm lazy-loading & AOT.
  - [x] Task 12.8. **Security**: `AuthorizeView`, `[Authorize]`, `AuthenticationStateProvider`, cascading auth
    state; passkey support in the template (.NET 10). Link
    https://learn.microsoft.com/en-us/aspnet/core/blazor/security/.
  - [x] Task 12.9. A `[mermaid]` decision tree for render modes; embed `image::aspnet-blazor-hosting-models.svg[…]`
    (created in Task 12.10) comparing Interactive Server vs. WebAssembly vs. Auto.
  - [x] Task 12.10. Create `modules/ROOT/images/aspnet-blazor-hosting-models.svg` — hand-authored, existing SVG
    convention.

- [x] Task 13. Create `modules/ROOT/pages/web/aspnet/real-time-and-rpc.adoc` (MS Learn "SignalR", "gRPC")
  - [x] Task 13.1. **SignalR**: real-time push; **hubs** (`Hub`, `Hub<T>` strongly-typed), `Clients.All` /
    `Clients.Caller` / `Clients.Group`, `Groups.AddToGroupAsync`, `OnConnectedAsync` / `OnDisconnectedAsync`.
    `[source,csharp]`. Link https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction.
  - [x] Task 13.2. **Transports**: WebSockets → Server-Sent Events → long polling (auto negotiation &
    fallback); `MapHub<T>`. Cross-link `xref:web/javascript/browser-networking.adoc[]`.
  - [x] Task 13.3. **Clients**: the JavaScript client (`@microsoft/signalr`), the .NET client
    (`HubConnectionBuilder`), reconnection (`withAutomaticReconnect`). `[source,javascript]` +
    `[source,csharp]`.
  - [x] Task 13.4. `IHubContext<T>` from outside a hub; **streaming** (`IAsyncEnumerable`), **MessagePack**,
    **hub filters**, authentication/authorization on hubs; **scale-out** (Redis backplane, Azure SignalR
    Service). Links: https://learn.microsoft.com/en-us/aspnet/core/signalr/hubs,
    https://learn.microsoft.com/en-us/aspnet/core/signalr/scale.
  - [x] Task 13.5. **gRPC** (shorter subsection): `.proto` contract-first, `Grpc.AspNetCore`,
    `MapGrpcService<T>`, unary / server / client / bidirectional streaming, **gRPC-Web** for browsers,
    code-first with protobuf-net.Grpc, gRPC JSON transcoding, gRPC vs. REST trade-offs. `[source,csharp]`.
    Links: https://learn.microsoft.com/en-us/aspnet/core/grpc/,
    https://learn.microsoft.com/en-us/aspnet/core/grpc/aspnetcore.
  - [x] Task 13.6. A `[mermaid]` sequence diagram: browser client ⇄ hub (connect → invoke → broadcast to
    group).

- [x] Task 14. Create `modules/ROOT/pages/web/aspnet/data-access-ef-core.adoc` (book 2 ch. 7; MS Learn "EF
  Core", "EF Core with ASP.NET Core")
  - [x] Task 14.1. Registering a context: `AddDbContext<T>` vs. `AddDbContextPool<T>` vs.
    `AddDbContextFactory<T>` (Blazor / background work); connection strings from configuration; provider
    packages (SQL Server, SQLite, Npgsql). `[source,csharp]` + `[source,json]`. Link
    https://learn.microsoft.com/en-us/ef/core/.
  - [x] Task 14.2. `DbContext` & `DbSet<T>`; **LINQ queries** (async: `ToListAsync`, `FirstOrDefaultAsync`);
    **change tracking** vs. `AsNoTracking`; **loading related data** (eager `Include` / `ThenInclude`, explicit,
    lazy); projections to DTOs. `[source,csharp]`.
  - [x] Task 14.3. Saving: `Add` / `Update` / `Remove` / `SaveChangesAsync`; `DbContext` as unit of work;
    **concurrency tokens** (`[Timestamp]` / `IsRowVersion`).
  - [x] Task 14.4. **Modelling**: conventions, data annotations, the **Fluent API** (`OnModelCreating`);
    relationships; value converters; owned types. Link
    https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/.
  - [x] Task 14.5. **Migrations**: `dotnet ef migrations add` / `database update` / `script`; applying at
    startup vs. in a pipeline; `dotnet ef dbcontext scaffold` for database-first. `[source,bash]`. Link
    https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/.
  - [x] Task 14.6. **Connection resiliency** (`EnableRetryOnFailure`); logging generated SQL. The
    **repository / unit-of-work** debate (`DbContext` already is both; when a repository still helps) — brief
    and balanced. **Dapper** as a lightweight alternative — one example + link. Cross-link
    `xref:database/sql/index.adoc[SQL Reference]`.

- [x] Task 15. Create `modules/ROOT/pages/web/aspnet/authentication-and-identity.adoc` (book 2 ch. 8; MS Learn
  "Authentication", "Identity")
  - [x] Task 15.1. AuthN vs. authZ; authentication **schemes** and **handlers**;
    `AddAuthentication(defaultScheme)` + `UseAuthentication`; `HttpContext.User` as a `ClaimsPrincipal`; claims.
    `[source,csharp]`. Link https://learn.microsoft.com/en-us/aspnet/core/security/authentication/.
  - [x] Task 15.2. **Cookie authentication**: `AddCookie`, `SignInAsync` / `SignOutAsync`, options, sliding
    expiration; the .NET 10 change where cookie auth returns **401/403 for API endpoints** instead of
    redirecting. Link https://learn.microsoft.com/en-us/aspnet/core/security/authentication/cookie.
  - [x] Task 15.3. **JWT bearer**: `AddJwtBearer`, token validation parameters, issuers/audiences/signing keys,
    `[Authorize]` with bearer tokens. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-jwt-bearer-authentication.
  - [x] Task 15.4. **OAuth 2.0 / OpenID Connect**: `AddOpenIdConnect`, the **authorization-code + PKCE** flow,
    `AddOAuth`, social providers (Google, Microsoft account, GitHub); Microsoft Entra ID with
    `Microsoft.Identity.Web`. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/authentication/social/.
  - [x] Task 15.5. **ASP.NET Core Identity**: `AddIdentity` / `AddIdentityCore`, `IdentityDbContext`,
    scaffolding the Identity UI, `UserManager<T>` / `SignInManager<T>` / `RoleManager<T>`, password hashing,
    email confirmation & password reset, **2FA / TOTP + QR codes**, external logins, lockout, custom stores.
    `[source,csharp]`. Link https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity.
  - [x] Task 15.6. **Identity API endpoints** (`MapIdentityApi<T>`) + bearer tokens for SPA / mobile; a
    paragraph each on certificate auth, Windows auth, API keys.
  - [x] Task 15.7. A `[mermaid]` sequence diagram of the OIDC authorization-code flow (user → app → identity
    provider → callback → tokens → authenticated session).

- [x] Task 16. Create `modules/ROOT/pages/web/aspnet/authorization.adoc` (book 2 ch. 8; MS Learn
  "Authorization")
  - [x] Task 16.1. `[Authorize]` / `[AllowAnonymous]` on controllers / actions / Razor Pages / hubs;
    `.RequireAuthorization()` on minimal endpoints & route groups. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/authorization/introduction.
  - [x] Task 16.2. **Simple**, **role-based** (`[Authorize(Roles = "…")]`), and **claims-based**
    (`RequireClaim`) authorization. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/authorization/roles.
  - [x] Task 16.3. **Policy-based**: `AddAuthorizationBuilder().AddPolicy(...)`, `IAuthorizationRequirement` +
    `AuthorizationHandler<TRequirement>`, combining requirements, `RequireAssertion`. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/authorization/policies.
  - [x] Task 16.4. **Resource-based**: `IAuthorizationService.AuthorizeAsync(user, resource, policy)` for
    per-object checks. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/authorization/resourcebased.
  - [x] Task 16.5. Custom `IAuthorizationRequirementData` attributes; default / fallback policies; multiple
    schemes; view-level checks (`IAuthorizationService` in views, `<AuthorizeView>` in Blazor).

- [x] Task 17. Create `modules/ROOT/pages/web/aspnet/security-hardening.adoc` (book 2 ch. 8; MS Learn
  "Security", "Data protection")
  - [x] Task 17.1. **Data Protection API**: the key ring, purposes (`CreateProtector`), key lifetime &
    rotation, persisting keys (file system, Azure Blob, Redis) and encrypting them at rest, sharing across a
    web farm. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/data-protection/introduction.
  - [x] Task 17.2. **HTTPS**: `UseHttpsRedirection`, `UseHsts`, dev certificates, HTTPS in production behind a
    proxy. Link https://learn.microsoft.com/en-us/aspnet/core/security/enforcing-ssl.
  - [x] Task 17.3. **Secret management**: User Secrets in Development; environment / Key Vault / **managed
    identity** in production; never commit secrets — cross-link
    `xref:web/aspnet/configuration-and-options.adoc[]`.
  - [x] Task 17.4. **CORS**: `AddCors` / `UseCors` / policies / `[EnableCors]`; cross-link `xref:web/cors.adoc[]`.
  - [x] Task 17.5. **Antiforgery / CSRF**: the token, `[ValidateAntiForgeryToken]` /
    `[AutoValidateAntiforgeryToken]`, `AddAntiforgery`, automatic protection for forms and for
    `[ApiController]` / minimal endpoints. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/anti-request-forgery.
  - [x] Task 17.6. **XSS**: output encoding (Razor auto-encoding, `HtmlEncoder` / `JavaScriptEncoder` /
    `UrlEncoder`), a **Content Security Policy** header. Link
    https://learn.microsoft.com/en-us/aspnet/core/security/cross-site-scripting.
  - [x] Task 17.7. **Open redirect** prevention (`LocalRedirect`, validating `returnUrl`); **SQL injection**
    avoidance (parameterized queries / EF Core); **IP safelist** middleware; security response headers; rate
    limiting as an abuse control (pointer to `performance-and-caching.adoc`); **GDPR** cookie consent; a short
    OWASP Top 10 → ASP.NET Core mitigation map. Link https://learn.microsoft.com/en-us/aspnet/core/security/.

- [x] Task 18. Create `modules/ROOT/pages/web/aspnet/error-handling-logging-and-observability.adoc` (book 1
  ch. 10, ch. 13; MS Learn "Handle errors", "Logging", "Health checks")
  - [x] Task 18.1. **Error handling**: the Developer Exception Page; `UseExceptionHandler` (lambda or path) +
    `IExceptionHandler`; `UseStatusCodePages` / `WithReExecute`; `AddProblemDetails`; the
    `DatabaseDeveloperPageExceptionFilter`. `[source,csharp]`. Links:
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/error-handling,
    https://learn.microsoft.com/en-us/aspnet/core/web-api/handle-errors.
  - [x] Task 18.2. **The Operation Result pattern** (book 1) as an alternative to exceptions for expected
    failures — a short `Result<T>` example translated to `IResult` / `ActionResult`.
  - [x] Task 18.3. **Logging**: `ILogger<T>`, log levels, categories, **structured logging** with message
    templates and named placeholders, `BeginScope`, the `LoggerMessage` source generator; providers (Console,
    Debug, EventSource, ApplicationInsights) and third-party (**Serilog**); filtering via config. `[source,csharp]`.
    Link https://learn.microsoft.com/en-us/aspnet/core/fundamentals/logging/.
  - [x] Task 18.4. **HTTP logging** middleware, the **W3C logger**, request-log enrichment.
  - [x] Task 18.5. **Health checks**: `AddHealthChecks`, `MapHealthChecks`, custom `IHealthCheck`, readiness vs.
    liveness. Link https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/health-checks.
  - [x] Task 18.6. **Metrics & tracing**: `System.Diagnostics.Metrics`, the built-in ASP.NET Core meters,
    **OpenTelemetry** wiring (`OpenTelemetry.Extensions.Hosting` + exporters), `Activity` / distributed
    tracing. Link https://learn.microsoft.com/en-us/aspnet/core/log-mon/metrics/metrics.

- [x] Task 19. Create `modules/ROOT/pages/web/aspnet/performance-and-caching.adoc` (book 1 ch. 2 context; MS
  Learn "Performance", "Caching")
  - [x] Task 19.1. **Response caching** (`[ResponseCache]` / `UseResponseCaching`, HTTP cache headers) vs.
    **output caching** (`AddOutputCache` / `UseOutputCache`, policies, tags & `EvictByTagAsync`, auth-aware);
    the `<cache>` tag helper. `[source,csharp]`. Links:
    https://learn.microsoft.com/en-us/aspnet/core/performance/caching/overview,
    https://learn.microsoft.com/en-us/aspnet/core/performance/caching/output.
  - [x] Task 19.2. **`IMemoryCache`** (size limits, eviction, `GetOrCreateAsync`); **`IDistributedCache`**
    (Redis, SQL Server); **`HybridCache`** (.NET 9+, stampede protection, tag invalidation). Link
    https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid.
  - [x] Task 19.3. **Rate limiting middleware**: fixed-window, sliding-window, token-bucket, concurrency
    limiters; partitioned limiters; `OnRejected`; per-endpoint policies. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/performance/rate-limit.
  - [x] Task 19.4. **Request timeouts** middleware (`AddRequestTimeouts` / `[RequestTimeout]`); **response
    compression**; **`ObjectPool`**; `ArrayPool`; `RecyclableMemoryStream`.
  - [x] Task 19.5. **Resilience** for outbound calls: `IHttpClientFactory`, typed clients,
    `Microsoft.Extensions.Http.Resilience` / Polly (retry, circuit breaker, timeout, hedging). `[source,csharp]`.
  - [x] Task 19.6. **EF Core** (`AddDbContextPool`, `AsNoTracking`, `AsSplitQuery`, compiled queries, N+1) and
    **runtime** (async all the way, server GC, Kestrel limits, **ReadyToRun**, **trimming**, **Native AOT** for
    Minimal APIs) — a best-practices checklist. Link
    https://learn.microsoft.com/en-us/aspnet/core/fundamentals/best-practices.
  - [x] Task 19.7. A `[mermaid]` diagram contrasting response caching (client/proxy) vs. output caching (server)
    hit paths.

- [x] Task 20. Create `modules/ROOT/pages/web/aspnet/architecture-and-patterns.adoc` (book 1, most chapters; MS
  Learn architecture guides) — keep every entry brief (orientation, not a patterns text); each gets a small
  snippet + link
  - [x] Task 20.1. **Principles**: separation of concerns, DRY, KISS, YAGNI, and **SOLID** as they show up in
    ASP.NET Core (interfaces + DI, thin controllers, `Options` for config, small middleware). Link
    https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/.
  - [x] Task 20.2. **Layering & Clean Architecture**: Domain / Application / Infrastructure / Presentation; the
    dependency rule; a solution layout with project references. Embed
    `image::aspnet-clean-architecture.svg[…]` (Task 20.7) and a `[mermaid]` of a request crossing the layers.
  - [x] Task 20.3. **DTOs & object mapping**: manual mapping, **Mapperly** (source-generated), **AutoMapper**;
    mapping at the edge, not in the domain. `[source,csharp]`. Links: https://mapperly.riok.app/,
    https://automapper.org/.
  - [x] Task 20.4. **Cross-cutting patterns in DI**: Strategy (multiple implementations + a selector), Decorator
    (`services.Decorate` via Scrutor), Factory, Singleton — each a few lines. **The Operation Result pattern**
    recap and its interplay with `ProblemDetails`.
  - [x] Task 20.5. **CQRS & the Mediator pattern**: separating commands from queries; **MediatR** handlers and
    pipeline behaviors (validation, logging); when a mediator is overkill. `[source,csharp]`. Link
    https://github.com/jbogard/MediatR.
  - [x] Task 20.6. **Vertical Slice Architecture** & the **REPR** (Request–EndPoint–Response) pattern: feature
    folders, one endpoint per file; contrast with layered/onion. **Modular monolith vs. microservices**: module
    boundaries, in-process messaging, when to split; the **Backend-for-Frontend** pattern; event-driven
    integration (one-paragraph pointer). Link
    https://learn.microsoft.com/en-us/dotnet/architecture/microservices/.
  - [x] Task 20.7. Create `modules/ROOT/images/aspnet-clean-architecture.svg` — a hand-authored ring figure
    (Domain at the centre → Application → Infrastructure / Presentation), existing SVG convention.

- [x] Task 21. Create `modules/ROOT/pages/web/aspnet/testing.adoc` (book 1 ch. 2; MS Learn "Testing",
  "Integration tests")
  - [x] Task 21.1. The test project: `xUnit` (`[Fact]` / `[Theory]` / `[InlineData]`), Arrange–Act–Assert;
    **Moq** / **NSubstitute** for test doubles. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/test/.
  - [x] Task 21.2. **Unit-testing** controllers, Razor Page models, minimal-endpoint handler methods, services,
    custom middleware (`RequestDelegate` + `DefaultHttpContext`), validators, and authorization handlers. Link
    https://learn.microsoft.com/en-us/aspnet/core/mvc/controllers/testing.
  - [x] Task 21.3. **Integration testing** with `Microsoft.AspNetCore.Mvc.Testing`:
    `WebApplicationFactory<TEntryPoint>`, `CreateClient`, `WithWebHostBuilder` / `ConfigureTestServices` to
    swap dependencies, `TestServer`. `[source,csharp]`. Link
    https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests.
  - [x] Task 21.4. Test infrastructure: overriding configuration, a **test authentication handler**
    (`AuthenticationHandler<AuthenticationSchemeOptions>`), seeding an **EF Core SQLite in-memory** database,
    handling antiforgery tokens (AngleSharp), asserting `ProblemDetails`. Link
    https://learn.microsoft.com/en-us/aspnet/core/test/middleware.
  - [x] Task 21.5. Contract/snapshot testing for APIs; a pointer to **Playwright for .NET** for end-to-end and
    `bombardier` / `k6` for load tests. Link https://learn.microsoft.com/en-us/aspnet/core/test/load-tests.

- [x] Task 22. Create `modules/ROOT/pages/web/aspnet/deployment.adoc` (book 2 ch. 9–13; MS Learn "Host and
  deploy")
  - [x] Task 22.1. `dotnet publish -c Release`: the publish folder, **framework-dependent** vs.
    **self-contained**, RID targeting; **trimming**, **ReadyToRun**, **Native AOT**; **publish profiles**
    (`.pubxml`) and the Web SDK; `dotnet publish /t:PublishContainer`. `[source,bash]` + `[source,xml]`. Links:
    https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/,
    https://learn.microsoft.com/en-us/dotnet/core/deploying/.
  - [x] Task 22.2. **IIS**: the ASP.NET Core Module, `web.config`, **in-process** hosting model, app pools.
    Link https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/iis/.
  - [x] Task 22.3. **Linux**: Kestrel behind **Nginx** (or Apache) as a reverse proxy, a **systemd** unit;
    **Windows Service** hosting (`AddWindowsService`). Link
    https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/linux-nginx.
  - [x] Task 22.4. **Containers**: a multi-stage `Dockerfile` (SDK build → runtime), the official
    `mcr.microsoft.com/dotnet` images, **chiseled / distroless** images, non-root, `ASPNETCORE_HTTP_PORTS`;
    **Azure App Service** / **Azure Container Apps** as targets; a brief AWS pointer. `[source,dockerfile]`.
    Link https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/docker/.
  - [x] Task 22.5. **Behind a proxy / load balancer**: `UseForwardedHeaders`, `KnownProxies` / `KnownNetworks`,
    path base. Link https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/proxy-load-balancer.
  - [x] Task 22.6. **Config & secrets in production**: environment variables, Key Vault, managed identity;
    **health-check** endpoints for readiness/liveness probes; a **web farm** + Data Protection key sharing
    note. **CI/CD** (book 2 ch. 12): a minimal **GitHub Actions** workflow (`dotnet build` / `test` / `publish`
    → deploy) — one `[source,yaml]` example + link.
  - [x] Task 22.7. A `[mermaid]` diagram of the container build-and-deploy flow (source → `dotnet publish` →
    image → registry → host).

- [x] Task 23. Create `modules/ROOT/pages/web/aspnet/ui-component-libraries.adoc` (book 2 ch. 4–6 context; MS
  Learn Blazor "Class libraries" / templates) — model on
  `modules/ROOT/pages/web/angular/styling-and-ui-libraries.adoc`
  - [x] Task 23.1. **Styling options for an ASP.NET Core UI**, one short paragraph + example each: **Bootstrap**
    (template-bundled, `wwwroot/lib/bootstrap`, LibMan; cross-link `xref:web/bootstrap/index.adoc[]`);
    **https://tailwindcss.com/[Tailwind CSS]** (standalone CLI or Node build, utility classes in `.cshtml` /
    `.razor`); **Sass** (`AspNetCore.SassCompiler`; cross-link `xref:web/sass/index.adoc[]`); **Blazor CSS
    isolation** (`Component.razor.css` → scoped `b-*`, `::deep`, global `wwwroot/app.css`); Tag Helpers vs.
    Razor **component** libraries (which context each entry targets). Link
    https://learn.microsoft.com/en-us/aspnet/core/blazor/components/class-libraries.
  - [x] Task 23.2. **Blazor component libraries — free / open-source first, in rough order of adoption**, each
    with a one-line description, its **licence**, an install/register + `Button` / `Dialog` / `Grid` example,
    and its **official site link** (`[source,bash]` + `[source,razor]`):
    1. **https://mudblazor.com/[MudBlazor]** (MIT) — Material-Design components, the most widely used
       open-source Blazor library; `dotnet add package MudBlazor`, `builder.Services.AddMudServices()`,
       `<MudButton>` / `<MudDialog>`.
    2. **https://blazor.radzen.com/[Radzen Blazor Components]** (MIT) — ~90 free components incl.
       `RadzenDataGrid`; `Radzen.Blazor`, `AddRadzenComponents()`. Note Radzen Blazor Studio (the visual
       designer) is a separate paid product; the components are free.
    3. **https://blazorise.com/[Blazorise]** (Apache-2.0 core) — a provider model rendering through Bootstrap /
       Bulma / Tailwind / Material / AntDesign; a few advanced extensions are licensed.
    4. **https://www.fluentui-blazor.net/[Microsoft Fluent UI Blazor]** (MIT) —
       `Microsoft.FluentUI.AspNetCore.Components`, the Fluent 2 design system, maintained by Microsoft and used
       by the .NET Aspire dashboard; `AddFluentUIComponents()`.
    5. **https://antblazor.com/[Ant Design Blazor]** (MIT) — an enterprise-oriented Ant Design port with a rich
       `Table` / `Form`.
    6. **https://havit.blazor.cz/[HAVIT Blazor]** (MIT) and **https://demos.blazorbootstrap.com/[Blazor
       Bootstrap]** (Apache-2.0) — Bootstrap 5 component sets (+ charts); cross-link
       `xref:web/bootstrap/index.adoc[]`.
    7. **https://www.matblazor.com/[MatBlazor]** (MIT) — Material components; note it is less actively
       maintained than MudBlazor.
  - [x] Task 23.3. **Server-rendered (MVC / Razor Pages) UI**: mostly **Bootstrap + Tailwind + custom Tag
    Helpers**; the richer grid/scheduler kits (Telerik, Syncfusion, DevExpress) are commercial — one line
    pointing to the next sub-task.
  - [x] Task 23.4. **Commercial suites (paid / licensed)** — one line + **official link** each, listed last, no
    examples, explicitly flagged paid (some offer a free community licence for small teams/individuals):
    **https://www.telerik.com/blazor-ui[Telerik UI for Blazor]** /
    **https://www.telerik.com/aspnet-core-ui[Telerik UI for ASP.NET Core]**,
    **https://www.syncfusion.com/blazor-components[Syncfusion Blazor]** /
    **https://www.syncfusion.com/aspnet-core-ui-controls[Syncfusion ASP.NET Core]**,
    **https://www.devexpress.com/blazor/[DevExpress Blazor]** /
    **https://www.devexpress.com/aspnet-core/[DevExpress ASP.NET Core]**,
    **https://www.infragistics.com/products/ignite-ui-blazor[Ignite UI for Blazor]**.
  - [x] Task 23.5. **Accessibility**: a component library gives accessible primitives but you still own the
    wiring (label controls, manage focus in dialogs/menus, honour `prefers-reduced-motion`, test with keyboard
    + a screen reader). Cross-link `xref:web/accessibility.adoc[Web Accessibility]`.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task. Depends on every Group 2 page existing (it links to and summarises
them); touches only `cheat-sheet.adoc` + `aspnet-cheat-sheet.pdf`.

- [x] Task 24. Create the ASP.NET cheat sheet — `modules/ROOT/pages/web/aspnet/cheat-sheet.adoc` +
  `modules/ROOT/attachments/aspnet-cheat-sheet.pdf`
  - [x] Task 24.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising **every concept explained in this reference**: the `dotnet` CLI (`new` /
    `run` / `watch` / `publish` / `ef`); a minimal `Program.cs` (builder → services → middleware → `Run`); the
    recommended middleware order; a custom middleware skeleton; DI lifetimes + registration + keyed services;
    configuration + the Options pattern (`IOptions` / `IOptionsSnapshot` / `IOptionsMonitor` + validation); a
    Minimal API `MapGroup` CRUD with `TypedResults` + an endpoint filter; a controller action with
    `ActionResult<T>` + `[ApiController]` validation; route-template syntax & constraints; a Razor Page
    `PageModel` with `[BindProperty]` + `OnPostAsync`; key Tag Helpers; a Blazor component with a parameter,
    `@rendermode`, and `EditForm`; a SignalR hub + JS client snippet; `AddDbContext` + an async LINQ query + a
    migration command; `AddAuthentication` / `AddAuthorizationBuilder` + `[Authorize(Policy=…)]` + a
    requirement handler; `UseExceptionHandler` + `AddProblemDetails`; an `ILogger` structured-logging call;
    output caching + rate limiting registration; a `WebApplicationFactory<Program>` integration-test skeleton;
    `dotnet publish` + a multi-stage `Dockerfile`; a one-line "UI component libraries" box (MudBlazor / Radzen
    / Fluent UI Blazor / Blazorise + register call). Match the visual style of the existing cheat sheets (see
    `modules/ROOT/pages/web/react/cheat-sheet.adoc` + its PDF, and the Angular / JavaScript ones).
  - [x] Task 24.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=aspnet-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/aspnet-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count
    check + a rendered PNG preview with no clipping).
  - [x] Task 24.3. Create `modules/ROOT/pages/web/aspnet/cheat-sheet.adoc`:
    `include::partial$aspnet-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every
    Group 2 page, and `xref:attachment$aspnet-cheat-sheet.pdf[Download the ASP.NET Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 25 (section index) must link every page from Groups 2–3; Tasks 26 and 27 depend
on Task 25 existing and on the final page/file names; Task 28 (build) depends on every prior task having
landed.

- [x] Task 25. Create `modules/ROOT/pages/web/aspnet/index.adoc` — ASP.NET Reference landing page
  - [x] Task 25.1. `= ASP.NET Reference`, `:description:` / `:keywords:`,
    `include::partial$aspnet-disclaimer.adoc[]`, a short intro (what ASP.NET Core is, that this section
    documents the current .NET 10 release verified against learn.microsoft.com, where to start —
    `getting-started.adoc` then `request-pipeline-and-middleware.adoc` / `minimal-apis.adoc`).
  - [x] Task 25.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat
    sheet, one-line blurb each, under readable sub-headings, e.g.: **Getting started** (getting-started);
    **Fundamentals** (request-pipeline-and-middleware, hosting-servers-and-environments,
    configuration-and-options, dependency-injection, routing); **Building HTTP APIs & apps** (minimal-apis,
    mvc-and-razor-pages, model-binding-and-validation, web-apis); **Interactive & real-time UI** (blazor,
    real-time-and-rpc); **Data** (data-access-ef-core); **Security** (authentication-and-identity,
    authorization, security-hardening); **Operations** (error-handling-logging-and-observability,
    performance-and-caching); **Architecture & delivery** (architecture-and-patterns, testing, deployment);
    **UI libraries** (ui-component-libraries); **Reference** (cheat-sheet). Mirror `web/react/index.adoc` /
    `web/angular/index.adoc`.
  - [x] Task 25.3. `== Bibliography` citing, in this order:
    - **https://learn.microsoft.com/en-us/aspnet/core/** — the official ASP.NET Core documentation, the source
      every page is written and verified against:
      https://learn.microsoft.com/en-us/aspnet/core/introduction-to-aspnet-core[Overview],
      https://learn.microsoft.com/en-us/aspnet/core/fundamentals/[Fundamentals], the app-model guides (Minimal
      APIs, MVC, Razor Pages, Blazor, Web API, SignalR, gRPC),
      https://learn.microsoft.com/en-us/aspnet/core/security/[Security & Identity],
      https://learn.microsoft.com/en-us/aspnet/core/performance/overview[Performance],
      https://learn.microsoft.com/en-us/aspnet/core/host-and-deploy/[Host and deploy],
      https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests[Testing], and
      https://learn.microsoft.com/en-us/aspnet/core/release-notes/aspnetcore-10.0[What's new in ASP.NET Core
      10.0].
    - **https://learn.microsoft.com/en-us/ef/core/** — the Entity Framework Core documentation (data-access
      page).
    - **https://learn.microsoft.com/en-us/dotnet/** — the .NET & C# documentation and the
      https://learn.microsoft.com/en-us/dotnet/core/tools/[`dotnet` CLI reference].
    - Marcotte, Carl-Hugo. _Architecting ASP.NET Core Applications_, 3rd ed. Packt Publishing, 2024. ISBN
      978-1-80512-338-5. Consulted as part of the bibliography for this section — see
      https://www.packtpub.com/en-us/product/architecting-aspnet-core-applications-third-edition-9781805123385[the
      publisher's book page], https://www.packtpub.com/[packtpub.com], and the code bundle at
      https://github.com/PacktPublishing/Architecting-ASP.NET-Core-Applications-3E[PacktPublishing/Architecting-ASP.NET-Core-Applications-3E].
    - Helland, Andreas; Durano, Vincent Maverick; Chilberto, Jeffrey & Price, Ed. _ASP.NET Core 5 for
      Beginners_. Packt Publishing, 2020. ISBN 978-1-80056-718-4. Consulted as part of the bibliography for
      this section — see
      https://www.packtpub.com/en-us/product/asp-net-core-5-for-beginners-9781800567184[the publisher's book
      page], https://www.packtpub.com/[packtpub.com], and the code bundle at
      https://github.com/PacktPublishing/ASP.NET-Core-5-for-Beginners[PacktPublishing/ASP.NET-Core-5-for-Beginners].
    - https://developer.mozilla.org/[MDN Web Docs] — the underlying web-platform concepts referenced (HTTP,
      cookies, CORS, WebSockets, Server-Sent Events), cross-linked where used.
    - Ecosystem docs actually cited: https://mudblazor.com/[MudBlazor], https://blazor.radzen.com/[Radzen
      Blazor], https://blazorise.com/[Blazorise], https://www.fluentui-blazor.net/[Microsoft Fluent UI Blazor],
      https://tailwindcss.com/[Tailwind CSS], https://github.com/jbogard/MediatR[MediatR],
      https://mapperly.riok.app/[Mapperly], https://automapper.org/[AutoMapper], https://serilog.net/[Serilog],
      https://www.pollydocs.org/[Polly], https://xunit.net/[xUnit], https://opentelemetry.io/[OpenTelemetry],
      https://redis.io/[Redis], and https://www.docker.com/[Docker].

- [x] Task 26. Update `modules/ROOT/pages/web/index.adoc`
  - [x] Task 26.1. Add an eighth bullet to the `== Sections` list, after the Angular Reference entry:
    `xref:web/aspnet/index.adoc[ASP.NET Reference]` with a one-line blurb (the minimal hosting model, the
    middleware pipeline, DI and configuration, Minimal APIs, MVC & Razor Pages, Web APIs & OpenAPI, Blazor,
    SignalR & gRPC, EF Core, authentication & authorization, caching, testing, and deployment with ASP.NET Core
    on .NET 10, plus a downloadable cheat sheet).
  - [x] Task 26.2. Update the page's own `:description:` and `:keywords:` attributes to mention ASP.NET Core /
    .NET 10 / Blazor.

- [x] Task 27. Wire the new subsection into the site navigation and the root landing page
  - [x] Task 27.1. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/aspnet/index.adoc[ASP.NET Reference]`
    block under `** xref:web/index.adoc[Web Development]`, **after** the Angular Reference block (which ends
    `**** xref:web/angular/cheat-sheet.adoc[Cheat Sheet (PDF)]`), with a `****` line per page in this reading
    order: getting-started, request-pipeline-and-middleware, hosting-servers-and-environments,
    configuration-and-options, dependency-injection, routing, minimal-apis, mvc-and-razor-pages,
    model-binding-and-validation, web-apis, blazor, real-time-and-rpc, data-access-ef-core,
    authentication-and-identity, authorization, security-hardening, error-handling-logging-and-observability,
    performance-and-caching, architecture-and-patterns, testing, deployment, ui-component-libraries,
    cheat-sheet.
  - [x] Task 27.2. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/aspnet/index.adoc[ASP.NET Reference] -- …` after the Angular Reference bullet under the Web
    Development entry, matching the existing one-line-blurb format.

- [x] Task 28. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for ASP.NET Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/aspnet/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/aspnet/*.html (all 24 pages), the PDF attachment
      build/site/_attachments/aspnet-cheat-sheet.pdf, the images build/site/_images/aspnet-di-lifetimes.svg,
      aspnet-clean-architecture.svg and aspnet-blazor-hosting-models.svg, every new nav entry, and all mermaid
      diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 28.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute"
    warnings (most likely an unescaped `\{ … }` in C#/route-template prose, a typo'd `xref:` target, a bad
    `[source,csharp]` token, or a missing nav entry), then re-run the agent until the build is clean, before
    checking this task off.
  - [x] Task 28.2. After the build is clean, per the repo convention (`update-docs`), confirm no other Antora
    page needs a cross-reference update for the new section (spot-check `web/angular/index.adoc` and
    `web/accessibility.adoc` — none is expected to need changes, but note the check).
