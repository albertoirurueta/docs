# Implementation Plan: "Swift Vapor" section under Backend Development (reused under Web Development)

## Task summary

Source: GitHub issue #294
Base branch: main

Issue [#294](https://github.com/albertoirurueta/docs/issues/294) adds the Antora section **Swift Vapor** in
`modules/ROOT/pages/backend/vapor/`: 61 files (landing `index.adoc`, 59 concept pages, `cheat-sheet.adoc`), written
against the current official documentation (Vapor 4.122.x, Swift 6, docs.vapor.codes, the `vapor/*` repositories,
swift.org server docs and each integrated package's docs). Three requester-provided books (Condon et al./Kodeco,
Yeung/Packt, Patel/Packt) are consulted references for concept coverage and the bibliography only; they are not
available here and nothing is copied. Running scenario: the original *Bookshelf* domain shared with the Axum, FastAPI,
NestJS, Django and Laravel sections.

**The binding spec** is the issue body plus the outline comment (issuecomment on #294, 61 page entries with ★ marks,
concept coverage and 📊 figure suggestions). Local copies are in the session scratchpad (`body.md`, `c0.md`); every
page task re-reads its own outline bullets there, and the book-concept table in `body.md` for its "Goes to" rows.

The section also ships: `partials/vapor-disclaimer.adoc` (the only admonition allowed), `partials/nav-vapor.adoc`
(nesting the Swift Reference), a `== Bibliography` on the landing page, `== References` on every page, Mermaid diagrams
and original `vapor-*.svg` figures (at least where the outline marks 📊), a one-page A4 PDF
`modules/ROOT/attachments/vapor-cheat-sheet.pdf`, and the integration edits (nav x2, index pages, back-links).

### Choices made on the user's behalf

1. **One branch `feature/294-swift-vapor-section`, one draft PR to `main`** (base user-confirmed). Groups follow the issue's
   suggested five-PR split so the work can still be cut later.
2. **Tasks are untagged**: no installed `*-code-one-task` key fits AsciiDoc/Mermaid/SVG/PDF authoring (as in the plans for
   #195 and #286). Swift examples are compiled in throwaway SwiftPM packages in the scratchpad, never committed.
3. **Page-level independence inside a group**: a page `xref:`s only pages in the same or an earlier group (plus existing
   site pages); forward links are added in the final link pass, so intermediate builds have no unresolved `xref`.
4. **Foundations first**: the disclaimer partial and a skeleton `index.adoc` (with an anchored `== Bibliography`) exist
   before any page, since every page links `backend/vapor/index.adoc#_bibliography`. The landing page, nav partial,
   nav includes and back-links are finalised last so they list the final page set.
5. **Facts re-verified at writing time** (Vapor 5 status, Swift version, package versions, URLs); anything unverifiable
   is stated honestly, never invented. Official docs win over the books; where the official 4.0 docs are stale
   (Environment, APNs, Heroku, no `Sendable` guidance) the template and source break the tie.
6. **Admonitions**: only the disclaimer partial. Deprecations, Vapor 5 changes, security caveats and "the book is
   outdated" remarks are prose or table rows.
7. **Nonexistent targets** (#263, #196, #264, #236, #258) are referenced in prose only, no `xref:`.
8. **Cheat sheet PDF** generated with Python `reportlab` (available locally); no generator is committed.

### Rules every page task must follow

- Template (from the issue's "Page conventions" and the `backend/axum/` pages): `= Title`, `:description:`, `:keywords:`,
  `include::partial$vapor-disclaimer.adoc[]` right after the header attributes, an intro stating the versions targeted,
  detailed explanation, complete Swift 6 examples (async/await; futures only labelled legacy) each followed by a
  `Source:` link to the official page it derives from, a prose note where the books are outdated for the concepts
  touched, and a `== References` section with official sources only. No real secrets.
- Every code example compiles (Swift language mode 6) against Vapor 4.122.x in a scratch package with versions pinned.
- `CLAUDE.md` rules: one-line `image::` macros (alt text in double quotes if it has a comma), inline code with
  `->`, `=>`, `__`, `#[`, `*`, `~`, `^`, `...`, `'`, `{` as `+...+` or `pass:c[...]` passthroughs, Mermaid stereotypes as
  `&lt;&lt;interface&gt;&gt;`, every SVG referenced by at least one page, block macros at column 0 with blank lines around.
- ★ pages are the most detailed (explanation, all relevant APIs, request-lifecycle position, Swift 6 concurrency notes,
  common errors, version notes, complete runnable examples); 📊 figures are a floor.

## Current code state

- No application code: this repo is the Antora playbook and `ROOT` component (`antora.yml`, `antora-playbook.yml`,
  `modules/ROOT/`). Build: `npx antora antora-playbook.yml`; Mermaid check: `npm run validate:mermaid`
  (`scripts/validate-mermaid.mjs`, needs `npm i --no-save mermaid@11 jsdom`).
- `modules/ROOT/pages/backend/vapor/` does not exist. `backend/axum/` (55 pages) is the closest template for page layout;
  `partials/axum-disclaimer.adoc` and `partials/nav-axum.adoc` are the templates for the new partials.
- `modules/ROOT/nav.adoc` includes `nav-axum.adoc` at lines ~984 (Backend Development) and ~1208 (Web Development) and
  `nav-swift.adoc` at lines ~28 (Programming Languages) and ~1902 (Apple Platforms). `nav-vapor.adoc` is included right
  after each `nav-axum.adoc` at absolute depth `***/****`, with the Swift Reference nested under it (documented in its
  header comment; fallback in the issue if nesting `nav-swift.adoc` does not render).
- `programming-languages/swift/` has 45 files already; Vapor pages link to it instead of re-explaining Swift.
- Cheat-sheet convention: `backend/axum/cheat-sheet.adoc` plus `modules/ROOT/attachments/axum-cheat-sheet.pdf`.
- Existing back-link targets: `programming-languages/swift/{index,async-await-and-tasks,actors-isolation-and-sendable,codable-and-serialization}.adoc`,
  `apps/apple/{networking,notifications-and-live-activities,index}.adoc`,
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`, `backend/axum/migration-and-framework-comparison.adoc`,
  `web/cors.adoc`, `backend/index.adoc`, `web/index.adoc`, root `index.adoc`.
- Precedents: `.archive/implementation_plan_195.md` (Rust + Axum), `.archive/implementation_plan_286.md` (Apache Tika).
- Tooling: `swift` (local toolchain), Node 24, Python `reportlab` present; `pdfinfo` not installed (verify the PDF page
  count with `reportlab`/`pypdf` or `mdls`).

## Implementation steps

### Group 1: Baseline, tooling, disclaimer and landing skeleton

Parallelizable: no, Task 2 and Task 3 depend on the verified baseline from Task 1 and on the skeleton landing page.

- [x] Task 1. Re-verify the version baseline and tooling; write the shared facts file in the scratchpad
  - [x] Task 1.1. Confirm the current Vapor release (4.122.x or newer), Vapor 5 status, Swift release, and the package versions used (Fluent + drivers, Leaf, JWT, Queues, swift-openapi-generator, APNSwift, swift-otel, VaporTesting); record them in `versions.md`
  - [x] Task 1.2. Create the scratch SwiftPM package from the official `vapor/template` and confirm it builds and runs with Swift 6 mode
  - [x] Task 1.3. Re-check the bibliography URLs (books' publisher pages, companion repos, docs.vapor.codes, API docs, swift.org); record any that fail
- [x] Task 2. Add `modules/ROOT/partials/vapor-disclaimer.adoc` _(single `[IMPORTANT]` block like `axum-disclaimer.adoc`, AI-assistance disclosure plus the pointer to `xref:backend/vapor/index.adoc#_bibliography[the section bibliography]` only)_
- [x] Task 3. Create the skeleton `modules/ROOT/pages/backend/vapor/index.adoc` with header, disclaimer include and an empty `== Bibliography` (completed in Group 9)

### Group 2: Foundations (7 pages, minus the landing page already skeletoned)

Parallelizable: yes, the pages are independent of each other; examples use separate scratch packages.

- [x] Task 4. `introduction-and-architecture.adoc` (★), with the Bookshelf architecture SVG `vapor-bookshelf-architecture.svg` and a SwiftNIO layering figure
- [x] Task 5. `installation-and-toolchain.adoc` (Swiftly, Vapor Toolbox, SwiftPM, Xcode vs. Linux)
- [x] Task 6. `getting-started.adoc` (★)
- [x] Task 7. `project-structure-and-swiftpm.adoc`
- [x] Task 8. `application-lifecycle-and-entrypoint.adoc` (★)
- [x] Task 9. `swift-concurrency-in-vapor.adoc` (★; async/await, `Sendable`, legacy `EventLoopFuture`, bridging)

### Group 3: Routing and HTTP, first half

Parallelizable: yes.

- [x] Task 10. `routing.adoc` (★)
- [x] Task 11. `controllers-and-route-collections.adoc`
- [x] Task 12. `request-and-response.adoc` (★)
- [x] Task 13. `content-and-codable.adoc` (★)
- [x] Task 14. `validation.adoc`
- [x] Task 15. `error-handling.adoc`
- [x] Task 16. `middleware.adoc` (★), with a middleware-ordering figure

### Group 4: Routing and HTTP, second half

Parallelizable: yes.

- [x] Task 17. `static-files-and-file-io.adoc`
- [x] Task 18. `file-uploads-and-streaming.adoc`
- [x] Task 19. `http-client.adoc`
- [x] Task 20. `configuration-and-environment.adoc`
- [x] Task 21. `services-storage-and-dependency-injection.adoc`
- [x] Task 22. `server-configuration.adoc`

### Group 5: Data (9 pages)

Parallelizable: yes, one shared scratch package with per-page targets; pages only `xref:` earlier groups.

- [x] Task 23. `fluent-overview-and-drivers.adoc` (★)
- [x] Task 24. `fluent-models.adoc` (★)
- [x] Task 25. `fluent-relations.adoc` (★)
- [x] Task 26. `migrations-and-schema.adoc` (★)
- [x] Task 27. `fluent-queries-and-pagination.adoc` (★)
- [x] Task 28. `transactions-model-middleware-and-soft-delete.adoc`
- [x] Task 29. `sql-kit-and-raw-sql.adoc`
- [x] Task 30. `mongodb.adoc`
- [x] Task 31. `redis-and-caching.adoc`

### Group 6: Views, web apps and real-time (6 pages)

Parallelizable: yes.

- [x] Task 32. `leaf-templates.adoc` (★)
- [x] Task 33. `leaf-custom-tags-and-html-dsls.adoc`
- [x] Task 34. `server-rendered-web-apps-and-forms.adoc` (★)
- [x] Task 35. `sessions.adoc`
- [x] Task 36. `websockets.adoc` (★)
- [x] Task 37. `server-sent-events.adoc`

### Group 7: Security (8 pages)

Parallelizable: yes, pages cross-reference only earlier groups; links between security pages are added in the link pass (Task 65).

- [x] Task 38. `authentication.adoc` (★)
- [x] Task 39. `fluent-authentication-and-tokens.adoc` (★)
- [x] Task 40. `session-authentication-and-web-login.adoc`
- [x] Task 41. `jwt.adoc` (★)
- [x] Task 42. `authorization.adoc`
- [x] Task 43. `oauth-and-sign-in-with-apple.adoc`
- [x] Task 44. `passwords-and-crypto.adoc`
- [x] Task 45. `security-hardening.adoc` (★)

### Group 8: APIs, integration, background work and operations (15 pages)

Parallelizable: yes.

- [x] Task 46. `api-design-versioning-and-dtos.adoc`
- [x] Task 47. `openapi.adoc` (★)
- [x] Task 48. `queues-and-background-jobs.adoc` (★)
- [x] Task 49. `scheduled-jobs.adoc`
- [x] Task 50. `apns-push-notifications.adoc`
- [x] Task 51. `email.adoc`
- [x] Task 52. `commands.adoc`
- [x] Task 53. `full-stack-swift-with-ios-clients.adoc` (★; implements the FieldNotes sync contract named in the outline)
- [x] Task 54. `testing.adoc` (★; VaporTesting + Swift Testing)
- [x] Task 55. `logging.adoc` and `tracing-metrics-and-opentelemetry.adoc`
  - [x] Task 55.1. `logging.adoc`
  - [x] Task 55.2. `tracing-metrics-and-opentelemetry.adoc`
- [x] Task 56. `deployment-with-docker.adoc` (★), with a Docker multi-stage build figure
- [x] Task 57. `deployment-targets.adoc`
- [x] Task 58. `production-and-performance.adoc`
- [x] Task 59. `microservices-and-api-gateway.adoc`
- [x] Task 60. `whats-new-upgrading-and-vapor-5.adoc` (★; collects every outdated-book statement and erratum, with versions)

### Group 9: Reference, landing page, nav, cheat sheet and back-links

Parallelizable: no, these tasks need the final page set from Groups 2-8.

- [x] Task 61. `ecosystem-and-framework-comparison.adoc`
- [x] Task 62. Complete `index.adoc`: scope, version baseline, Bookshelf package layout, reading path, `== What's covered`, related-material table, the Mermaid mind-map, and `== Bibliography` listing every source with its official website link
- [x] Task 63. Write `partials/nav-vapor.adoc` (absolute depth, header comment explaining the nesting of `nav-swift.adoc`) and include it in `nav.adoc` right after both `nav-axum.adoc` includes
- [x] Task 64. Generate `modules/ROOT/attachments/vapor-cheat-sheet.pdf` (single A4 page covering every concept in the section, with `reportlab`) and write `backend/vapor/cheat-sheet.adoc` linking it
- [x] Task 65. Link pass: add the deferred cross-page `xref:`s between sections, and ensure every page has `== References`
- [x] Task 66. Integration and back-links:
  - [x] Task 66.1. `backend/index.adoc` and `web/index.adoc`: Swift Vapor bullet; update `:description:`/`:keywords:` there and in the root `index.adoc` (append `Vapor, Swift Vapor, server-side Swift, Fluent, Leaf`)
  - [x] Task 66.2. One-line back-links in `programming-languages/swift/{index,async-await-and-tasks,actors-isolation-and-sendable,codable-and-serialization}.adoc`
  - [x] Task 66.3. `apps/apple/networking.adoc` (to `full-stack-swift-with-ios-clients`), `apps/apple/notifications-and-live-activities.adoc` (to `apns-push-notifications`), one sentence in `apps/apple/index.adoc`
  - [x] Task 66.4. `starting-a-new-project.adoc`: `| Swift / Vapor` row after `| Rust / Axum`
  - [x] Task 66.5. `backend/axum/migration-and-framework-comparison.adoc` Vapor row (if a comparison table exists) and a `web/cors.adoc` line (if a framework-examples list exists)

### Group 10: Verification

Parallelizable: yes, trivially (single task).

- [x] Task 67. Build and verify, delegating the build to the `iru-gate-runner` agent (or a generic sub-agent) so the log stays out of the main context:
  - [x] Task 67.1. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings
  - [x] Task 67.2. Run the `CLAUDE.md` image checks (block macros closed on one line, no `<p>image::`, unquoted-comma alt text in changed files), the inline-code substitution check on `build/site/.../backend/vapor`, and `npm run validate:mermaid`; all must print nothing / report every diagram parsed
  - [x] Task 67.3. Confirm every `vapor-*.svg` is referenced, every `image::` target exists, no admonition other than the disclaimer exists in the section (`grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/backend/vapor` prints nothing), no `xref:` points at #263/#196/#264/#236/#258, and the PDF is exactly one A4 page
  - [x] Task 67.4. Confirm the Swift Vapor nav (with the nested Swift Reference) renders under both Backend Development and Web Development, and that the Programming Languages and Apple Platforms Swift sites are unchanged
  - [x] Task 67.5. Run `/iru-check-security` (detect-secrets findings here are false positives per repo convention) and confirm no book PDF is staged
