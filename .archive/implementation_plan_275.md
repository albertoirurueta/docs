# Implementation Plan: Guides & References — "Go" (Programming Languages)

## Task summary

Source: GitHub issue #275
Base branch: main

Issue [#275](https://github.com/albertoirurueta/docs/issues/275) adds an Antora section
`modules/ROOT/pages/programming-languages/go/` (nav title **Go Reference**): a detailed, learning-oriented reference for the
**Go language and standard library, targeting Go 1.27** (go1.27.2 or the newest release at implementation time). **59 pages**
(incl. `index.adoc` with the bibliography and `cheat-sheet.adoc`), a disclaimer partial, a nav partial, original `go-*.svg`
figures and Mermaid diagrams, back-links from existing pages, and a one-page A4 PDF
`modules/ROOT/attachments/go-cheat-sheet.pdf`. Running scenario: the original *shelf* module (`example.com/shelf`, `go 1.27`),
the same library-catalogue domain as the Rust Reference.

**The binding spec** is the issue body plus one comment (split only for GitHub's size limit): the page outline
(https://github.com/albertoirurueta/docs/issues/275#issuecomment-6096109873). Local copy: session scratchpad `outline.md`
(`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/6c507ca3-f4b4-46dc-a895-5d4c07765f4c/scratchpad/outline.md`);
re-fetch with `gh issue view 275 --json body,comments` if missing. **Every page task must re-read its own outline bullets**
(★ depth, 📊 figures, S/MM/T/EG/D/M/CMD/P/B/RN/W source abbreviations, Bodner/Vivien chapter notes, "book outdated" notes) and the
issue body's "Concepts contributed by the books", "Where the books are outdated" and "Errata" tables.

### Choices made on the user's behalf

1. **Branch `feature/275-add-go-section-programming-languages` (already created from `main`, user-confirmed base), one draft PR to
   `main`** with `Closes #275`. The issue's optional five-PR split is not used; the groups below follow its five slices so the
   work could still be cut.
2. **Tasks are untagged.** The `go` coding key is installed but targets Go projects, not AsciiDoc/Mermaid/SVG/PDF authoring, so tasks
   are implemented directly. Go code in pages is **compiled, vetted and run for real** in a scratch directory (never committed).
3. **Books**: the two PDFs exist in `~/Desktop/libros/go/` but are copyrighted. They are consulted only for structure/idioms,
   cited on the landing-page bibliography by publisher page, and used for "book is outdated" prose. No book text, listing, figure
   or sample project is reproduced; nothing from them is committed or attached.
4. **Disclaimer** `go-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc` (AI disclosure + xref to
   `programming-languages/go/index.adoc#_bibliography`). It is the **only** admonition in the section; no other
   NOTE/TIP/WARNING/CAUTION/IMPORTANT blocks.
5. **Nav placement**: the issue says "after `nav-php.adoc`", but the open block now also holds `nav-groovy`, `nav-scala` and
   `nav-jvm-build-tools`. `include::partial$nav-go.adoc[]` goes inside the same open block, **after `nav-scala` and before
   `nav-jvm-build-tools`**, so the languages stay grouped and the build-tools reference stays last in the block.
6. **Version baseline re-verified at implementation time and dated** (Task 1): Go 1.27.x, supported releases, Go 1.28 status,
   URLs/anchors, `golang.org/x` versions, tool versions. Anything unverifiable is described without naming a release.
7. **Existing pages get real `xref:`s** (verified with `ls`); issues #196, #263 and #236 are mentioned in prose only.
8. **Not-runnable examples** (cgo without a C compiler, WASM without a runtime, publishing, network/DB examples) are labelled in
   prose and checked line by line against the docs; DB examples use env-provided DSNs, never real secrets.
9. **Mermaid/SVG floor:** every 📊 in the outline is delivered; SVGs are `go-*.svg`, original (no Gopher, no Go logo, no docs or
   book figures).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$go-disclaimer.adoc[]`; intro states the Go 1.27 baseline;
  every `go.mod` shown has `go 1.27`; features newer than the oldest still-supported release name their version.
- Each example: `[source,go]`, gofmt-formatted, passing `go vet`, compiling with Go 1.27 (complete `package main` or `_test.go`
  where practical, else a clearly marked fragment), with **real output** (`[source,bash]`/`[source,text]` produced by running it;
  real compiler/vet messages for error demos); followed by `Source: https://…[…]` to the official page/anchor it derives from
  (URLs looked up, never guessed; std packages `pkg.go.dev/<pkg>` unversioned; `x/...` and third-party pinned). Uses current APIs:
  `any`, `os`/`io` not `io/ioutil`, `math/rand/v2`, `b.Loop`, `//go:build`, ServeMux patterns, `log/slog`. Follows the *shelf*
  scenario. No real secrets.
- Depth: rationale, spec rules (linked), every relevant keyword/builtin/type/function/flag/env var/directive, common compile errors,
  vet reports and panics, pitfalls, version notes. ★ pages are the most detailed in the section.
- Each page covers where the books are outdated for the concepts it touches (in prose/tables, never reproducing errata or bad
  practices) and ends with `== References` (official online docs only, plus book publisher pages where consulted).
- AsciiDoc pitfalls: inline code containing `<-`, `->`, `=>`, `...`, `{name}`, `{{.X}}`, `*`, `~T`, `^`, `&^`, `__`, `#[`, `'` uses
  `` `+…+` ``; containing `+` uses `` `pass:c[…]` ``; `|` in table cells escaped `\|`. Image macros on one line, quoted alt when it
  contains a comma, block macros at column 0 with blank lines around.
- Mermaid: `<` directly followed by a letter written `&lt;`; stereotypes `&lt;&lt;interface&gt;&gt;`.
- Per-task verification: run its examples; grep its files for unquoted-comma image alt text, block-macro closure and
  `NOTE|TIP|WARNING|CAUTION|IMPORTANT` blocks (only the disclaimer include may exist).

## Current code state

- No application code. Site definition: `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc`
  (Programming Languages open block, lines ~20-31: `nav-kotlin`, `nav-c`, `nav-cpp`, `nav-objective-c`, `nav-csharp`, `nav-swift`,
  `nav-php`, `nav-groovy`, `nav-scala`, `nav-jvm-build-tools`; JavaScript/TypeScript/Python/Java/Rust follow after the closing `--`).
- Templates: `modules/ROOT/partials/rust-disclaimer.adoc` (single `[IMPORTANT]` block), `nav-c.adoc` (relative-depth nav),
  `nav-scala.adoc`; `programming-languages/rust/cheat-sheet.adoc`, `scala/cheat-sheet.adoc`; archived precedent plans
  `.archive/implementation_plan_299.md` (Scala, 96 pages), `_297.md` (Groovy), `_300.md`, `_294.md`.
- `programming-languages/index.adoc`: `:description:`/`:keywords:` (lines 2-3), "live only here" sentence (line ~8), Groovy bullet
  (line ~58) and Scala bullet (line ~63) — the Go bullet goes after the Scala bullet. `modules/ROOT/attachments/` holds
  cheat-sheet PDFs; `modules/ROOT/images/` the SVGs. `scripts/validate-mermaid.mjs` backs `npm run validate:mermaid`.
- Back-link targets (all exist): `ai/cli-for-agents/frameworks-go-and-rust.adoc` (line ~14), `ai/mcp/index.adoc` (Go SDK row ~238),
  `ai/agents/frameworks-landscape.adoc` (~78), `backend/kubernetes/custom-resources-and-operators.adoc` (~161-225),
  `backend/kubernetes/helm.adoc`, `database/prometheus/instrumenting-applications.adoc` (`=== Go (client_golang)` ~24),
  `programming-languages/rust/{async-await-and-futures,threads-and-message-passing,ownership-and-moves,ffi-and-c-interop}.adoc`,
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (`Rust / Axum` row at line 405).
- Existing pages to link, not repeat: Rust Reference, C Reference (pointers, memory), `ai/cli-for-agents/*` (Cobra, Bubble Tea,
  testscript, GoReleaser), `backend/kubernetes/*`, `database/{redis,mongodb,couchbase,sql,prometheus}/*`, `backend/docker/*`,
  `backend/oauth/*`, `web/cors.adoc`, other languages' concurrency pages (see the issue's table).
- Tooling on this machine: Node 24 / Antora, Chrome (`/Applications/Google Chrome.app`), `detect-secrets` expected. **Missing:**
  `go`, `pdfinfo`. Books present locally in `~/Desktop/libros/go/` (not to be committed).

## Implementation steps

### Group 1 — Tooling, baseline, shared partials (Parallelizable: no — Task 2 needs Task 1's verified baseline)

- [x] Task 1. Prepare tooling and verify the baseline
  - [x] Task 1.1. Install Go 1.27.x for running examples
    - Done (user-approved download, sha256 verified): `go1.27.2.darwin-arm64.tar.gz` from go.dev/dl extracted to
      `~/sdk/go1.27.2`; **not on PATH** — call `~/sdk/go1.27.2/bin/go` / `gofmt` (or `export PATH="$HOME/sdk/go1.27.2/bin:$PATH"` per
      command). `go version` → `go1.27.2 darwin/arm64`. Install `govulncheck`/`staticcheck` (via `go install`, into `GOBIN` outside the
      repo) only if needed for the security/static-analysis pages.
  - [x] Task 1.2. Re-verify the version baseline (current stable/patch, supported releases, Go 1.28 status, spec header date,
    Memory Model date), `golang.org/x` versions (`sync`, `tools`, `vuln`, `exp`, `sys`), and curl-check every URL in the inventory
    and outline; record corrections in a scratchpad `go-baseline-notes.md`. If Go 1.28 is out, pages target it and mark additions.
  - [x] Task 1.3. Pick PDF page-count method (no `pdfinfo`: `mdls -name kMDItemNumberOfPages` or `python3 -I` with pypdf); check
    whether highlight.js in the UI bundle has a `go` grammar and what renders `go-module`/`text` for `go.mod`.
  - [x] Task 1.4. Create the *shelf* scratch module skeleton (`catalog`, `internal`, `cmd/shelf`, `cmd/shelfd`) used to compile the
    examples across pages, so the scenario stays consistent.
- [x] Task 2. Create the shared partials
  - [x] Task 2.1. `modules/ROOT/partials/go-disclaimer.adoc` (shape of `rust-disclaimer.adoc`, Go bibliography xref)
  - [x] Task 2.2. `modules/ROOT/partials/nav-go.adoc`: `* xref:programming-languages/go/index.adoc[Go Reference]`, `**` entries in
    outline order grouped under non-link headings with `***` children, ending with Cheat Sheet (PDF) (written now from the outline
    file names; adjusted in the final group if any page is renamed)

### Group 2 — Slice 1: getting started, core language, composite types (Parallelizable: yes — distinct files; `index.adoc` deferred)

- [x] Task 3. Getting started pages
  - [x] Task 3.1. ★ `getting-started.adoc` (📊 per outline)
  - [x] Task 3.2. `toolchain-versions-and-compatibility.adoc`
  - [x] Task 3.3. `program-structure-and-lexical-elements.adoc`
  - [x] Task 3.4. `design-philosophy-and-coming-from-other-languages.adoc`
- [x] Task 4. Core language pages
  - [x] Task 4.1. `variables-constants-and-iota.adoc`
  - [x] Task 4.2. ★ `types-and-values.adoc`
  - [x] Task 4.3. `operators-and-expressions.adoc`
  - [x] Task 4.4. ★ `control-flow.adoc`
  - [x] Task 4.5. ★ `functions-closures-and-defer.adoc`
  - [x] Task 4.6. `pointers-and-value-semantics.adoc`
- [x] Task 5. Composite type pages
  - [x] Task 5.1. ★ `arrays-and-slices.adoc`
  - [x] Task 5.2. `maps.adoc`
  - [x] Task 5.3. `strings-runes-and-utf8.adoc`
  - [x] Task 5.4. `structs-and-embedding.adoc`

### Group 3 — Slice 2: abstraction and concurrency (Parallelizable: yes — distinct files)

- [x] Task 6. Abstraction pages
  - [x] Task 6.1. `methods-and-receivers.adoc`
  - [x] Task 6.2. ★ `interfaces.adoc`
  - [x] Task 6.3. `composition-and-object-oriented-design.adoc`
  - [x] Task 6.4. ★ `generics.adoc`
  - [x] Task 6.5. ★ `iterators-and-range-over-func.adoc`
  - [x] Task 6.6. ★ `error-handling.adoc`
- [x] Task 7. Concurrency pages
  - [x] Task 7.1. ★ `goroutines-and-the-scheduler.adoc`
  - [x] Task 7.2. ★ `channels-and-select.adoc`
  - [x] Task 7.3. `concurrency-patterns.adoc`
  - [x] Task 7.4. ★ `context.adoc`
  - [x] Task 7.5. `sync-and-atomics.adoc`
  - [x] Task 7.6. `memory-model-and-data-races.adoc`

### Group 4 — Slice 3: packages, modules and tooling (Parallelizable: yes — distinct files)

- [x] Task 8. Packages, modules and tooling pages
  - [x] Task 8.1. `packages-imports-and-initialization.adoc`
  - [x] Task 8.2. ★ `modules-and-dependency-management.adoc`
  - [x] Task 8.3. `workspaces-versioning-and-publishing.adoc`
  - [x] Task 8.4. `the-go-command-builds-and-cross-compilation.adoc`
  - [x] Task 8.5. `directives-code-generation-and-embedding.adoc`
  - [x] Task 8.6. ★ `testing.adoc`
  - [x] Task 8.7. `benchmarks-fuzzing-and-synctest.adoc`
  - [x] Task 8.8. `formatting-vet-fix-and-static-analysis.adoc`
  - [x] Task 8.9. `documentation-and-doc-comments.adoc`

### Group 5 — Slice 4: standard library (Parallelizable: yes — distinct files)

- [x] Task 9. Standard library pages
  - [x] Task 9.1. `fmt-strings-and-text-processing.adoc`
  - [x] Task 9.2. `text-and-html-templates.adoc`
  - [x] Task 9.3. ★ `io-files-and-the-filesystem.adoc`
  - [x] Task 9.4. `time-and-timers.adoc`
  - [x] Task 9.5. ★ `encoding-json.adoc` (v1 and v2/`jsontext`)
  - [x] Task 9.6. `structured-logging-with-slog.adoc`
  - [x] Task 9.7. ★ `net-http-clients-and-servers.adoc`
  - [x] Task 9.8. `database-sql.adoc`
  - [x] Task 9.9. `command-line-programs.adoc`
  - [x] Task 9.10. `collections-and-utility-packages.adoc`
  - [x] Task 9.11. `crypto-and-security.adoc`

### Group 6 — Slice 5a: runtime, advanced topics, interop, practice and evolution (Parallelizable: yes — distinct files)

- [x] Task 10. Runtime, advanced topics and interop pages
  - [x] Task 10.1. `reflection.adoc`
  - [x] Task 10.2. `unsafe-and-low-level-programming.adoc`
  - [x] Task 10.3. ★ `memory-management-and-garbage-collection.adoc`
  - [x] Task 10.4. `cleanups-weak-pointers-and-interning.adoc`
  - [x] Task 10.5. ★ `profiling-tracing-and-diagnostics.adoc`
  - [x] Task 10.6. `performance-and-pgo.adoc`
  - [x] Task 10.7. `cgo-and-c-interop.adoc`
  - [x] Task 10.8. `webassembly-and-wasi.adoc`
- [x] Task 11. Practice and evolution pages
  - [x] Task 11.1. `idioms-style-and-code-review.adoc`
  - [x] Task 11.2. `common-mistakes-and-gotchas.adoc`
  - [x] Task 11.3. `whats-new-and-migrating-older-code.adoc` (collects every outdated-book statement and erratum, with versions)

### Group 7 — Slice 5b: landing page, cheat sheet, nav, back-links (Parallelizable: no — landing page and nav depend on the final page set; cheat-sheet page depends on the PDF)

- [x] Task 12. Landing page `programming-languages/go/index.adoc`: what Go is, version baseline, *shelf* scenario, "New here? Read in
  this order" path, page tables by group, and `== Bibliography` listing every source used with official links (books with
  publisher pages and companion code plus the "consulted references, not primary source" note, the 2nd-edition remark, official
  docs, blog posts, wiki, `golang.org/x` tools, community references, specifications and standards)
- [x] Task 13. Cheat sheet
  - [x] Task 13.1. Build the throwaway HTML in the scratchpad and render `modules/ROOT/attachments/go-cheat-sheet.pdf` with headless
    Chrome (`--headless --print-to-pdf --no-pdf-header-footer`); exactly one A4 page (verify page count), previewed as PNG; covers
    every concept listed in the issue plus the "changed since older tutorials" strip, Go version and date in the header
  - [x] Task 13.2. `programming-languages/go/cheat-sheet.adoc` (shape of `rust/cheat-sheet.adoc`): disclaimer include, intro with
    `xref:attachment$go-cheat-sheet.pdf[downloadable PDF]`, baseline/check date, grouped xref paragraphs to every page, final download
    line, `== References`
- [x] Task 14. Figures: confirm every 📊 in the outline has a Mermaid block or `go-*.svg`; every SVG is referenced by at least one page
- [x] Task 15. Navigation and landing-page integration
  - [x] Task 15.1. `modules/ROOT/nav.adoc`: add `include::partial$nav-go.adoc[]` inside the Programming Languages open block (see choice 5)
  - [x] Task 15.2. `programming-languages/index.adoc`: Go Reference bullet after the Scala bullet (names Go 1.27, ends ", plus a
    downloadable cheat sheet."), `:description:`, `:keywords:` (including `Go, Golang, Go 1.27, Go modules, goroutines, channels,
    generics, iterators, gofmt, go vet`) and the "live only here" sentence
  - [x] Task 15.3. Root `modules/ROOT/pages/index.adoc`: add Go to `:description:`/`:keywords:` only if they list the language references
- [x] Task 16. Back-links (one line each, real `xref:`s to existing pages)
  - [x] Task 16.1. `ai/cli-for-agents/frameworks-go-and-rust.adoc` (Go sentence next to the Rust one), `ai/mcp/index.adoc`,
    `ai/agents/frameworks-landscape.adoc`
  - [x] Task 16.2. `backend/kubernetes/custom-resources-and-operators.adoc`, `backend/kubernetes/helm.adoc`,
    `database/prometheus/instrumenting-applications.adoc`
  - [x] Task 16.3. `programming-languages/rust/{async-await-and-futures,threads-and-message-passing,ownership-and-moves,ffi-and-c-interop}.adoc`
  - [x] Task 16.4. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`: new `| Go / net/http` row after `| Rust / Axum`
  - [x] Task 16.5. Optional one-line links from `backend/axum/csrf-and-security-hardening.adoc` and
    `backend/nestjs/security-headers-cors-and-csrf.adoc` to `net-http-clients-and-servers` (`CrossOriginProtection`)

### Group 8 — Verification (Parallelizable: no — runs on the finished site)

- [x] Task 17. Build and verify
  - [x] Task 17.1. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings; no `xref:` to missing pages
    (#196, #263, #236 prose only); Go nav appears under Programming Languages at the same level as other references
  - [x] Task 17.2. Run the `CLAUDE.md` checks (block/inline image macros closed on one line, `<p>image::` leak, unquoted-comma alt text,
    inline-code substitutions on `build/site/.../programming-languages/go/`) — all must print nothing; every `go-*.svg` referenced and every
    `image::` target exists
  - [x] Task 17.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid` reports every diagram parsed
  - [x] Task 17.4. Section-wide greps: no `NOTE|TIP|WARNING|CAUTION|IMPORTANT` outside the disclaimer partial; disclaimer included on every page;
    every page has `== References`; no `io/ioutil`/`golint`/`// +build`/`rand.Seed`/`v := v` outside the labelled older-code passage; no book PDF
    or book text committed
  - [x] Task 17.5. Render check of several pages in `build/site` (nav, a ★ page, cheat sheet link to the PDF, a Mermaid page)
  - [x] Task 17.6. Delegate `Skill({skill: "iru-check-security"})` to the `iru-gate-runner` agent for the changed files (docs repo: label
    detect-secrets findings in docs as false positives unless real) and confirm no secrets in examples
  - [x] Task 17.7. Confirm `git status` shows only intended files and `modules/ROOT/.DS_Store` is not staged (`/iru-update-docs` is not
    needed: the change is the docs themselves)
