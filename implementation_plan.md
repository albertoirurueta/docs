# Implementation Plan: Guides & References — "PHP" (Programming Languages) and "PHP and Laravel" (Web Development)

## Task summary

Source: GitHub issue #194
Base branch: main

Issue [#194](https://github.com/albertoirurueta/docs/issues/194) adds two Antora sections, written from the **official
documentation** (PHP Manual for the language; Laravel 13.x docs, Livewire 4, Inertia 3 and each ecosystem project's own
docs for the web section). Six requester-provided books (`~/Desktop/libros/php/`, all pre-PHP 8) are consulted references
for concept coverage, narrative and the bibliography only.

1. **PHP Reference** — `modules/ROOT/pages/programming-languages/php/`: 44 concept pages + `index.adoc`-led landing +
   `cheat-sheet.adoc` (PHP 8.5; running scenario: library catalogue `Book`/`Author`/`Loan`, CLI).
2. **PHP and Laravel** — `modules/ROOT/pages/web/php-laravel/`: 62 pages + `cheat-sheet.adoc` (Laravel 13.x on PHP 8.3–8.5;
   running scenarios *Bookshelf* in Laravel and *Bookshelf Lite* in plain PHP + PDO).

Each section also ships: a disclaimer partial (the only admonition allowed), a landing page with `== Bibliography`, a
`cheat-sheet.adoc` + one-page A4 PDF in `modules/ROOT/attachments/`, original `php-*.svg` / `php-laravel-*.svg` figures
and Mermaid diagrams (at least wherever the outlines mark 📊), and a `== References` section on every page.

Plus integration work: `modules/ROOT/nav.adoc`, new `partials/nav-php.adoc`, the Programming Languages / Web / Backend /
root index pages, and five back-link edits (Django comparison table + sentence, `starting-a-new-project.adoc` row,
Tailwind ×2, NestJS resilience, MongoDB drivers).

**The binding spec** is the issue body (conventions, nav placement, cheat sheets, bibliography, acceptance criteria) **plus
two outline comments** (split only for GitHub's size limit): Part 1
https://github.com/albertoirurueta/docs/issues/194#issuecomment-5992099639, Part 2
https://github.com/albertoirurueta/docs/issues/194#issuecomment-5992100060. Local copies of body/comments were saved in the
session scratchpad (`body.md`, `c0.md`, `c1.md`); every page task must re-read its own outline bullets (📊 figures, ★ depth,
Manual/docs paths, "books outdated" notes) from there or from the issue.

### Choices made on the user's behalf

1. **One branch `feature/194`, one draft PR to `main`** with `Closes #194` (user-confirmed branch/base). The issue suggests an
   optional 5-PR split on `feature/194-php`; this plan keeps one pass, as #253/#237 did. Groups are ordered so the work could
   still be cut into the issue's five slices.
2. **Tasks are untagged.** Installed keys (`java`, `java-springboot`, `dotnet`, `database`) don't fit AsciiDoc/Mermaid/SVG/PDF
   authoring, so tasks are implemented directly. PHP/Blade/bash content in pages is illustrative, but every example is run in
   a scratch PHP/Laravel app (Task 2), never committed.
3. **Books appear only in `== Bibliography` and in prose notes on outdated material.** No text/listing/figure/sample project is
   copied; PDFs are never staged (`git status` must never list a `*.pdf` other than the two cheat sheets).
4. **Disclaimers:** `php-disclaimer.adoc` and `php-laravel-disclaimer.adoc` are a single `[IMPORTANT]` block shaped like
   `django-disclaimer.adoc` (AI-assistance disclosure + bibliography `xref:`). No other `NOTE/TIP/WARNING/CAUTION/IMPORTANT`
   block anywhere in either section; deprecations, security caveats and "book is outdated" remarks are prose or table rows.
5. **Version baseline re-verified at implementation time and dated** (Group 1): PHP 8.5 (8.6 GA due 2026-11-19 — if GA by then,
   baseline moves to 8.6 and 8.5 differences are noted), Laravel 13.x, Livewire 4, Inertia 3, PHPUnit/Pest current.
6. **Existing pages get real `xref:`s; not-yet-existing ones stay prose** (#157, #263, #196, #201, future Symfony issue). Every
   `xref:` target outside the section is verified with `ls` first. `index.adoc` and `cheat-sheet.adoc` are written after their pages.
7. **Page-count discrepancy:** the issue states 44 / 62 pages "incl. index + cheat sheet", but the outlines list 44 / 62 pages
   *plus* `cheat-sheet.adoc` (45 / 63 files). The outline lists below are authoritative; the cheat sheet is added to each.
8. **Symfony is out of scope** (mentioned only where Laravel builds on Symfony components).
9. **Mermaid/SVG floor:** every 📊 is delivered; SVGs are original (no PHP elephant, Laravel logo, docs or book figures).

### Lessons from earlier section reviews (#198, #199, #230, #237, #253) — mandatory for every page task

**Verify every name against its official page before writing it** (function, class, directive, Artisan command, config key,
package name, version); if the docs don't confirm a detail, describe behaviour without naming it. **Security is correctness:**
no real secrets (`APP_KEY` via `php artisan key:generate`, DB credentials from env), prepared statements, escaping on output,
CSRF/authorisation shown correctly. **Every concept gets at least one example, each followed by a `Source:` link**, with the
URL repeated in `== References`; Laravel links pin `/13.x/`. **Run the examples** in the scratch apps. **Never reproduce the
books' errors** (issue's outdated/errata lists). **AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes;
`{placeholders}`/braces literal inside `[source]` and escaped (`+...+`) in prose; no prose line starting with `<digits>.`; no
`xref:` inside backticks; no empty link text on fragment xrefs; block `image::` macros on one line, alt text with commas in
double quotes (see CLAUDE.md "Images and figures"). **Every ★ page is among the most detailed in its section**: explanation, all
relevant options, request-lifecycle position (web), pitfalls, version notes, complete runnable examples.

## Current code state

- Repo is the Antora playbook + root component `ROOT` (`antora.yml`, `modules/ROOT/nav.adoc`, `modules/ROOT/pages/**`,
  `modules/ROOT/partials/**`, `modules/ROOT/images/**`, `modules/ROOT/attachments/**`). No source code. Remote content sources
  live in `antora-playbook.yml` and are unaffected.
- Neither `programming-languages/php/` nor `web/php-laravel/` exists. Siblings: `programming-languages/{c,cpp,csharp,java,
  javascript,kotlin,objective-c,python,swift,typescript}`, `web/{django,nextjs,aspnet,react,vue,…}`.
- Templates: `modules/ROOT/partials/nav-c.adoc` (depth-relative nav partial, `*`/`**`), `partials/django-disclaimer.adoc`,
  `web/django/cheat-sheet.adoc` (+ its PDF in `attachments/`), `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`).
- `modules/ROOT/nav.adoc`: `include::partial$nav-swift.adoc[]` at line 28 (insert `nav-php` after it); Django block children end
  ~line 674; `** xref:backend/index.adoc[Backend Development]` at ~684 (insert PHP and Laravel `***` block just before it).
- Landing pages to edit: `programming-languages/index.adoc`, `web/index.adoc`, `backend/index.adoc`, `modules/ROOT/pages/index.adoc`.
- Back-link targets: `web/django/introduction-and-architecture.adoc` (~756 Laravel row, ~836 "no page for … Laravel"),
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (~359 table), `web/tailwind/getting-started.adoc`
  (~106), `web/tailwind/build-and-production.adoc` (~101), `backend/nestjs/resilience-idempotency-and-locks.adoc` (~825),
  `database/mongodb/drivers-and-tooling.adoc`.
- Precedent: `.archive/implementation_plan_253.md` (Next.js, 39 files; same group structure), plus #156/#157/#166.
- Books exist in `~/Desktop/libros/php/` (never staged). Line numbers above are from the issue and must be re-checked.

## Conventions every page task must follow

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$php-disclaimer.adoc[]` (language) or
  `include::partial$php-laravel-disclaimer.adoc[]` (web) immediately after the header attributes.
- Intro states the version baseline (language: PHP 8.5, noting 8.4/8.3 differences; web: Laravel 13.x on PHP 8.3–8.5, noting
  Laravel 12 differences).
- Code blocks: `[source,php]` (with `declare(strict_types=1);` where idiomatic), `[source,blade]`, `[source,bash]`,
  `[source,ini]`, `[source,nginx]`, `curl` + `[source,json]`; current APIs only; each followed by `Source: <official URL>[Title]`.
- Cover where the books are outdated for the touched concepts (prose/table with versions).
- End with `== References` (official docs and, where used, publisher pages only).
- Figures: `[mermaid]` or `php-*.svg` / `php-laravel-*.svg` in `modules/ROOT/images/`, referenced by bare filename.
- Per-task finish: confirm file has disclaimer include, no admonition, every code block has a `Source:`, `== References` present.

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create the two disclaimer partials.
  - [x] Task 1.1. `modules/ROOT/partials/php-disclaimer.adoc` — single `[IMPORTANT]` block copied in shape from
    `django-disclaimer.adoc`, with the AI-assistance sentence and `xref:programming-languages/php/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. `modules/ROOT/partials/php-laravel-disclaimer.adoc` — same, pointing at `xref:web/php-laravel/index.adoc#_bibliography[…]`.
- [x] Task 2. (done 2026-10-05: PHP 8.5.11 current, 8.6.0RC2 not GA; Laravel 13.34.0; php.net/laravel.com/publishers blocked by egress policy, so manual/docs verified from php/doc-en and laravel/docs 13.x sources; PHP 8.5 via docker php:8.5-cli, Laravel scratch app on host PHP 8.3) Verify and record the version baseline and build the scratch environments (scratchpad, never committed).
  - [x] Task 2.1. Re-read PHP release state (https://www.php.net/supported-versions.php, https://www.php.net/releases/): confirm 8.5.x
    latest, support windows, whether 8.6 is GA; record dated baseline in scratchpad `194/versions-194.md`.
  - [x] Task 2.2. Re-read Laravel 13.x state (https://laravel.com/framework/docs/13.x/releases, `/upgrade`, support policy), Livewire 4,
    Inertia 3, Pest/PHPUnit, Composer/PIE, PHPStan/Psalm/Rector, FrankenPHP, Reverb, Octane, Sail/Herd versions on Packagist.
  - [x] Task 2.3. Re-verify the issue's "outdated in the books / new since the books" lists against the PHP migration guides
    (`appendices`) and the Laravel upgrade guide; record deviations for `whats-new-and-migration.adoc` and `whats-changed-and-upgrading.adoc`.
  - [x] Task 2.4. Diff the PHP Manual and the Laravel 13.x sidebar (Prologue → Packages incl. AI) against the issue's inventories;
    add any new/renamed page to the matching page task and record changed URLs.
  - [x] Task 2.5. `curl -sIL -o /dev/null -w '%{http_code} %{url_effective}'` every URL in the issue's Bibliography and book table;
    record canonical forms and dead links (publishers may 403 automated fetches; Springer redirects).
  - [x] Task 2.6. Create a scratch PHP 8.5 CLI project (Composer, PHPUnit/Pest, PHPStan) with the library-catalogue scenario, and a
    scratch Laravel 13 app (`laravel new`, SQLite, Pest) with *Bookshelf* plus a plain-PHP *Bookshelf Lite*, so every example is run
    before it is pasted.
  - [x] Task 2.7. Check `git status` never lists any book PDF; confirm `node_modules` is installed (`npm install`) for `validate:mermaid` and Antora.
- [x] Task 3. Create `modules/ROOT/partials/nav-php.adoc` (relative-depth `*`/`**` like `nav-c.adoc`) listing every PHP Reference page in
  outline order, last child `** xref:programming-languages/php/cheat-sheet.adoc[Cheat Sheet (PDF)]`. (Written last in Group 6 if page
  titles change; create the skeleton now so the nav build works.)

### Group 2 — PHP Reference: getting started and types

**Parallelizable: yes — one new file per task, no shared files**

- [x] Task 4. `programming-languages/php/getting-started.adoc` ★ (install, CLI, `php -S`, history/RFC process; 📊 SVG `php-script-execution.svg`: source → lexer/parser → AST → opcodes → Zend VM, OPcache, JIT). — done: 591 lines, php-script-execution.svg, 6 examples run on PHP 8.5.11 + php -S/curl check
- [x] Task 5. `configuration-and-extensions.adoc` (php.ini cascade, `INI_*`, extensions, PECL vs PIE, SAPIs). — done: 373 lines, ini/extension examples run on 8.5; PIE verified against php/pie docs
- [x] Task 6. `basic-syntax-and-style.adoc` (tags, comments, reserved words, PSR-1, PER Coding Style 3, PHPDoc). — done: 417 lines, 9 examples run
- [x] Task 7. `types-and-the-type-system.adoc` ★ (scalar/compound/union/intersection/DNF, nullable, `never`, `strict_types`, `mixed`, `void`, `static`). — done: 826 lines, php-type-lattice.svg, 23 examples run
- [x] Task 8. `type-juggling-and-comparisons.adoc` ★ (PHP 8 comparison rules, `==` vs `===`, `<=>`, juggling tables). — done: 378 lines, comparison tables generated from PHP 8.5.11 and PHP 7.4 runs
- [x] Task 9. `variables-scope-and-constants.adoc`. — done: 446 lines, 11 examples run
- [x] Task 10. `operators-and-expressions.adoc` ★ (every `language.operators.*` page incl. `??`, `??=`, `?->`, `|>`, spread). — done: 584 lines, 17 examples run (pipe operator on 8.5)
- [x] Task 11. `control-structures.adoc` ★ (`match`, loops, `goto`, alternative syntax, `declare`). — done: 474 lines, 12 examples run
- [x] Task 12. Group validation: delegate `npm run validate:mermaid` and a scoped Antora build to `iru-gate-runner`; fix findings. — done: Antora build: 0 unexpected errors/warnings (only xrefs to not-yet-written section pages); no Mermaid blocks in group

### Group 3 — PHP Reference: strings, arrays, functions and OOP core

**Parallelizable: yes — one new file per task**

- [x] Task 13. `strings.adoc` ★. — done: 490 lines, 14 examples run on 8.5
- [x] Task 14. `unicode-mbstring-and-intl.adoc`. — done: 406 lines, 12 examples run on 8.5 with intl (ICU 74) incl. IntlListFormatter/grapheme_levenshtein
- [x] Task 15. `regular-expressions.adoc` (PCRE). — done: 301 lines, 7 examples run (PCRE2 10.44)
- [x] Task 16. `arrays.adoc` ★ (incl. `array_find`/`array_first`/`array_last`, destructuring, spread). — done: 610 lines, 16 examples run (array_find/array_first)
- [x] Task 17. `functions.adoc` ★ (named args, variadics, by-ref, return types, first-class callables). — done: 424 lines, 12 examples run (#[\NoDiscard])
- [x] Task 18. `closures-and-callables.adoc` ★ (closures, arrow functions, `Closure::bind`, callables, pipe operator). — done: 416 lines, 9 examples run; PFA example run on PHP 8.6.0RC2
- [x] Task 19. `classes-and-objects.adoc` ★ (constructor promotion, `new` in initializers, constants, static). — done: 463 lines, Mermaid class diagram, 11 examples run
- [x] Task 20. `visibility-readonly-and-asymmetric-visibility.adoc` ★ (8.1 readonly, 8.2 readonly classes, 8.4 asymmetric visibility). — done: 414 lines, 8 examples run; readonly defaults on 8.6 RC
- [x] Task 21. `property-hooks.adoc` ★ (8.4 `get`/`set` hooks, virtual properties, interfaces, `final`, inheritance). — done: 368 lines, 7 examples run
- [x] Task 22. `inheritance-interfaces-and-abstract-classes.adoc` ★. — done: 426 lines, 7 examples run
- [x] Task 23. `traits.adoc`. — done: 290 lines, 6 examples run
- [x] Task 24. Group validation (Mermaid + scoped build via `iru-gate-runner`). — done: validate:mermaid OK; Antora build: no unexpected errors/warnings after fixing brace/table issues

### Group 4 — PHP Reference: OOP advanced, errors, iteration and concurrency

**Parallelizable: yes — one new file per task**

- [ ] Task 25. `enumerations.adoc` ★ (pure/backed enums, methods, interfaces, constants, `tryFrom`).
- [ ] Task 26. `magic-methods-and-overloading.adoc`.
- [ ] Task 27. `cloning-late-static-binding-and-object-lifecycle.adoc`.
- [ ] Task 28. `namespaces-and-autoloading.adoc` ★ (namespaces, `use`, PSR-4, `spl_autoload_register`).
- [ ] Task 29. `attributes.adoc` ★ (syntax, built-in attributes such as `#[\Override]`, `#[\Deprecated]`, `#[\NoDiscard]`, reflection access).
- [ ] Task 30. `reflection.adoc`.
- [ ] Task 31. `errors-and-exceptions.adoc` ★ (Throwable hierarchy, `try`/`catch`/`finally`, error handlers, `error_reporting`).
- [ ] Task 32. `iterators-and-generators.adoc` ★.
- [ ] Task 33. `fibers-and-asynchronous-php.adoc`.
- [ ] Task 34. `references-and-memory-management.adoc`.
- [ ] Task 35. Group validation.

### Group 5 — PHP Reference: standard library and tooling

**Parallelizable: yes — one new file per task**

- [ ] Task 36. `spl-data-structures.adoc`.
- [ ] Task 37. `date-and-time.adoc` ★ (`DateTimeImmutable`, time zones, `DatePeriod`, `strftime` removal, Clock).
- [ ] Task 38. `math-numbers-and-randomness.adoc` (BCMath/GMP, `Random\Randomizer`).
- [ ] Task 39. `files-streams-and-io.adoc` ★.
- [ ] Task 40. `json-xml-and-serialization.adoc`.
- [ ] Task 41. `cryptography-hashing-and-passwords.adoc` (`password_hash`, sodium, OpenSSL; no hardcoded keys).
- [ ] Task 42. `command-line-php.adoc`.
- [ ] Task 43. `composer-and-packages.adoc` ★ (`composer.json`, autoload, lock, scripts, audit, PIE).
- [ ] Task 44. `psr-standards-and-coding-style.adoc`.
- [ ] Task 45. `static-analysis-and-refactoring.adoc` (PHPStan, Psalm, Rector, PHP-CS-Fixer).
- [ ] Task 46. `testing-with-phpunit-and-pest.adoc` ★.
- [ ] Task 47. `debugging-and-profiling.adoc` (Xdebug, profilers).
- [ ] Task 48. `opcache-jit-and-performance.adoc`.
- [ ] Task 49. `whats-new-and-migration.adoc` ★ (7.0 → 8.5/8.6 migration guides, "changed since older tutorials" table incl. `each()`, `create_function`, mysql/mcrypt removal, `FILTER_SANITIZE_STRING`, `strftime`, dynamic properties, `__sleep`).
- [ ] Task 50. Group validation.

### Group 6 — PHP Reference: landing page, bibliography, cheat sheet

**Parallelizable: no — landing page and cheat sheet link to every page written in Groups 2–5; PDF is rendered after the cheat sheet content is fixed**

- [ ] Task 51. `programming-languages/php/index.adoc`: landing page per outline (what PHP is, version baseline/support policy in prose, "New here? Read in this order", grouped `== What's covered`, relationship to PHP and Laravel (prose until Group 12 creates it, then xref), 📊 Mermaid mind-map, `== Bibliography` listing every source with its official website: six book publisher pages, php.net, tooling docs, PSR/PER specs).
- [ ] Task 52. `cheat-sheet.adoc` following `web/django/cheat-sheet.adoc` (disclaimer, intro linking `xref:attachment$php-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` xrefs to every page, download line, `== References`).
- [ ] Task 53. `modules/ROOT/attachments/php-cheat-sheet.pdf`: throwaway HTML → headless Chrome print-to-PDF, exactly one A4 page, dense/multi-column/colour-coded, version and date in header, content per the issue's "Cheat sheets" list; verify page count; commit only the PDF.
- [ ] Task 54. Finalise `partials/nav-php.adoc` against final page titles.

### Group 7 — PHP Reference: site wiring

**Parallelizable: no — Tasks edit `nav.adoc` and shared index pages that Group 12 edits again**

- [ ] Task 55. `modules/ROOT/nav.adoc`: add `include::partial$nav-php.adoc[]` after `include::partial$nav-swift.adoc[]` inside the Programming Languages open block.
- [ ] Task 56. `programming-languages/index.adoc`: add a **PHP Reference** bullet in the existing style (ends ", plus a downloadable cheat sheet."); add PHP to `:description:` and `PHP, PHP 8.5, Composer, PSR, PHPStan, PHPUnit, Pest` to `:keywords:`; fix the "C, {cpp}, Objective-C, C# and Swift have no such secondary home…" sentence accurately.
- [ ] Task 57. Build check (`npx antora antora-playbook.yml` via `iru-gate-runner`): PHP section renders, nav correct, 0 errors/warnings.

### Group 8 — PHP and Laravel: foundations and plain PHP

**Parallelizable: yes — one new file per task**

- [ ] Task 58. `web/php-laravel/introduction-and-architecture.adoc` ★ (PHP web ecosystem, framework comparison table with Django/ASP.NET/Vaadin/NestJS/FastAPI/Spring Boot "same idea in other stacks", Laravel vs Symfony components in prose, #263 prose only).
- [ ] Task 59. `php-request-model-and-servers.adoc` ★ (shared-nothing model, PHP-FPM, Nginx/Apache, FrankenPHP, built-in server; 📊 figure).
- [ ] Task 60. `http-requests-and-responses.adoc` ★ (superglobals, headers, status codes, redirects, PSR-7 in prose).
- [ ] Task 61. `forms-validation-and-output-escaping.adoc` ★ (*Bookshelf Lite*).
- [ ] Task 62. `sessions-and-cookies.adoc` ★ (hardening, `session_*`, cookie flags).
- [ ] Task 63. `file-uploads-and-images.adoc`.
- [ ] Task 64. `databases-with-pdo.adoc` ★ (prepared statements, transactions, fetch modes, `PDO` subclasses in 8.4).
- [ ] Task 65. `authentication-without-a-framework.adoc`.
- [ ] Task 66. `web-security-fundamentals.adoc` ★ (OWASP: XSS, CSRF, SQLi, session fixation, file inclusion, headers; link `backend/oauth/*`).
- [ ] Task 67. `templating-routing-and-middleware-by-hand.adoc`.
- [ ] Task 68. `http-clients-apis-and-email.adoc`.
- [ ] Task 69. Group validation.

### Group 9 — PHP and Laravel: Laravel foundations, HTTP and views

**Parallelizable: yes — one new file per task**

- [ ] Task 70. `laravel-getting-started.adoc` ★ (`laravel new`, Herd, Sail, starter kits, Boost).
- [ ] Task 71. `directory-structure-and-configuration.adoc` ★ (`bootstrap/app.php`, `.env`, config caching, no `Kernel`).
- [ ] Task 72. `request-lifecycle.adoc` ★ (📊 sequence diagram).
- [ ] Task 73. `service-container-providers-and-facades.adoc` ★.
- [ ] Task 74. `artisan-tinker-and-prompts.adoc`.
- [ ] Task 75. `routing.adoc` ★ (verbs, params, binding, groups, resource map table, rate limiting, route caching).
- [ ] Task 76. `middleware.adoc`.
- [ ] Task 77. `controllers.adoc` ★ (`[Controller::class, 'method']`, resource/invokable, `#[Middleware]`/`#[Authorize]` attributes where documented).
- [ ] Task 78. `requests-input-and-responses.adoc` ★.
- [ ] Task 79. `validation-and-form-requests.adoc` ★.
- [ ] Task 80. `sessions-cookies-and-flash-data.adoc`.
- [ ] Task 81. `error-handling-and-logging.adoc`.
- [ ] Task 82. `blade-templates.adoc` ★.
- [ ] Task 83. `blade-components-and-layouts.adoc` ★.
- [ ] Task 84. `vite-and-frontend-assets.adoc` (link Tailwind/JS/TS/React/Vue pages, no re-explaining).
- [ ] Task 85. `livewire.adoc` ★ (Livewire 4).
- [ ] Task 86. `inertia-and-starter-kits.adoc` ★ (Inertia 3, React/Vue/Svelte starter kits).
- [ ] Task 87. Group validation.

### Group 10 — PHP and Laravel: database, security, APIs

**Parallelizable: yes — one new file per task**

- [ ] Task 88. `database-and-query-builder.adoc` ★.
- [ ] Task 89. `migrations-seeders-and-factories.adoc` ★ (class factories, `database/schema-evolution` link).
- [ ] Task 90. `eloquent-models.adoc` ★ (`app/Models`, `casts()`).
- [ ] Task 91. `eloquent-relationships.adoc` ★ (📊 ER/relationship diagram).
- [ ] Task 92. `eloquent-casts-accessors-and-serialization.adoc`.
- [ ] Task 93. `collections-and-pagination.adoc` (link `database/pagination-strategies.adoc`).
- [ ] Task 94. `query-performance-and-n-plus-1.adoc` ★ (eager loading, `preventLazyLoading`, link `database/diagnosing-slow-queries.adoc`).
- [ ] Task 95. `redis-mongodb-and-search.adoc` (Scout, MongoDB package, Redis; link `database/redis`, `database/mongodb`, `database/elasticsearch`).
- [ ] Task 96. `authentication.adoc` ★ (starter kits, Fortify, guards, Socialite, passkeys per docs).
- [ ] Task 97. `authorization-gates-and-policies.adoc` ★.
- [ ] Task 98. `api-authentication-sanctum-and-passport.adoc` ★ (link `backend/oauth/*`).
- [ ] Task 99. `security-csrf-encryption-and-hashing.adoc` ★ (`PreventRequestForgery`, encryption, hashing, rate limiting).
- [ ] Task 100. `building-apis-and-api-resources.adoc` ★ (versioning, JSON:API resources, `curl` + `[source,json]`, GraphQL/Lighthouse in prose, link `backend/graphql/*`).
- [ ] Task 101. `http-client.adoc`.
- [ ] Task 102. `ai-sdk-mcp-and-boost.adoc` (Laravel AI SDK, MCP, Boost; link `ai/mcp/*`, `ai/agents/*`, `ai/ai-assisted-development/*`, `ai/rag-systems/*`).
- [ ] Task 103. Group validation.

### Group 11 — PHP and Laravel: services, testing, production

**Parallelizable: yes — one new file per task**

- [ ] Task 104. `queues-and-jobs.adoc` ★ (Horizon, batching, failed jobs; link `backend/messaging/*`).
- [ ] Task 105. `events-and-listeners.adoc`.
- [ ] Task 106. `broadcasting-and-reverb.adoc` ★ (Reverb, Echo, SSE variant).
- [ ] Task 107. `task-scheduling.adoc` (`onOneServer()`/`withoutOverlapping()`; #157 prose only).
- [ ] Task 108. `mail-and-notifications.adoc`.
- [ ] Task 109. `cache-and-rate-limiting.adoc` (link `backend/resilience/*`).
- [ ] Task 110. `file-storage-and-images.adoc`.
- [ ] Task 111. `localization.adoc`.
- [ ] Task 112. `processes-concurrency-and-context.adoc`.
- [ ] Task 113. `testing.adoc` ★ (Pest HTTP tests, fakes, database testing).
- [ ] Task 114. `browser-testing-with-dusk.adoc` (link `web/e2e-testing-real-browsers.adoc`).
- [ ] Task 115. `deployment.adoc` ★ (link `backend/docker`, `backend/kubernetes`, `cloud/*`).
- [ ] Task 116. `docker-and-sail.adoc`.
- [ ] Task 117. `octane-and-performance.adoc`.
- [ ] Task 118. `monitoring-and-debugging.adoc` (Telescope, Pulse, Nightwatch per docs).
- [ ] Task 119. `package-development-and-ecosystem.adoc`.
- [ ] Task 120. `whats-changed-and-upgrading.adoc` ★ (Laravel 5.8 → 13 table: `app/Models`, class factories, Kernel removal, Mix → Vite, `$dates`, `make:auth`, `VerifyCsrfToken` → `PreventRequestForgery`, Homestead → Herd/Sail).
- [ ] Task 121. `best-practices.adoc`.
- [ ] Task 122. Group validation.

### Group 12 — PHP and Laravel: landing page, bibliography, cheat sheet

**Parallelizable: no — landing page and cheat sheet link to every page of Groups 8–11; PDF is rendered after the cheat sheet content is fixed**

- [ ] Task 123. `web/php-laravel/index.adoc`: landing page (what the section covers, plain PHP vs Laravel, reading order, `== What's covered` grouped as the outline, link to PHP Reference, 📊 mind-map, `== Bibliography` per issue: books' publisher pages, php.net/laravel.com, tooling/component/database/server docs, specifications).
- [ ] Task 124. `cheat-sheet.adoc` (same shape as Task 52 with `php-laravel-cheat-sheet.pdf`).
- [ ] Task 125. `modules/ROOT/attachments/php-laravel-cheat-sheet.pdf`: one A4 page via headless Chrome, content per the issue's "Cheat sheets" list; verify page count; commit only the PDF.
- [ ] Task 126. Add real `xref:` back to the PHP Reference landing page and replace prose placeholders in the PHP section that pointed at this section.

### Group 13 — Site wiring and back-links

**Parallelizable: no — several tasks edit `nav.adoc` and the shared index pages**

- [ ] Task 127. `modules/ROOT/nav.adoc`: add `*** xref:web/php-laravel/index.adoc[PHP and Laravel]` after the Django block's last `****` child (just before `** xref:backend/index.adoc[Backend Development]`) with `****` children in outline order (optional non-link `****` group headings with `*****` children) ending with the cheat sheet; verify nav renders.
- [ ] Task 128. `web/index.adoc`: add a **PHP and Laravel** bullet after Django (also linking the PHP Reference); append to `:description:`; add the issue's `:keywords:`.
- [ ] Task 129. `backend/index.adoc`: one line "the full-stack PHP framework, including REST/JSON:API backends with Sanctum and Passport"; add `Laravel, PHP` to `:keywords:`.
- [ ] Task 130. `modules/ROOT/pages/index.adoc`: `(including Next.js, Django and Laravel)` in `:description:`; append `PHP, Laravel, Eloquent, Blade` to `:keywords:` (no new tile).
- [ ] Task 131. Back-links (one line each, re-verify line numbers): `web/django/introduction-and-architecture.adoc` (Laravel comparison row linked; replace "no page for … Laravel" sentence), `starting-a-new-project.adoc` (new `| PHP / Laravel` row after `| Python / FastAPI`), `web/tailwind/getting-started.adoc`, `web/tailwind/build-and-production.adoc`, `backend/nestjs/resilience-idempotency-and-locks.adoc` (link to the scheduling page), `database/mongodb/drivers-and-tooling.adoc` (PHP driver → Redis/MongoDB/search page).

### Group 14 — Build, validation and review

**Parallelizable: no — depends on every page, the nav and both PDFs**

- [ ] Task 132. Validate both sections.
  - [ ] Task 132.1. `npm run validate:mermaid` passes for every block.
  - [ ] Task 132.2. `grep -rn -E '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/programming-languages/php modules/ROOT/pages/web/php-laravel` returns nothing; each page includes its disclaimer; every page ends with `== References`; every code example has a `Source:` link; Laravel links pin `/13.x/`.
  - [ ] Task 132.3. Run the CLAUDE.md figure checks (all must print nothing; quote `--include` patterns): block `image::` not closed on one line, inline `image:` not closed, `<p>image::` in `build/site`; unquoted-comma alt-text check on changed `.adoc` files; every new `php-*.svg`/`php-laravel-*.svg` is referenced and every `image::` target exists.
  - [ ] Task 132.4. No `xref:` to a non-existent page (#157/#263/#196/#201/Symfony prose only); no secrets; no book text/figures (word-overlap scan against the six books); `git status` shows no `*.pdf` except the two cheat sheets and no scratch files; every ★ page is among the longest of its section (note deviations rather than padding).
  - [ ] Task 132.5. Delegate `npx antora antora-playbook.yml` (or `iru-build-docs`) to `iru-gate-runner`: 0 errors / 0 warnings; spot-check nav placement (PHP after Swift; PHP and Laravel after Django), both cheat-sheet downloads, a Mermaid page, and each edited back-link page in `build/site`.
- [ ] Task 133. Run the security scan: delegate `iru-check-security` to `iru-gate-runner`; resolve any finding before archiving.
- [ ] Task 134. Final consistency pass: counts of files vs the outlines (45 + 63 incl. cheat sheets), acceptance-criteria checklist in the issue ticked off item by item, README/CLAUDE.md need no change.
