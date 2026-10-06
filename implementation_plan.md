# Implementation Plan: Guides & References — "Rust" (Programming Languages) and "Axum" (Backend Development)

## Task summary

Source: GitHub issue #195
Base branch: main

Issue [#195](https://github.com/albertoirurueta/docs/issues/195) adds two Antora sections, written from the **official
documentation** (The Rust Book, Rust by Example, the Reference, std, Cargo, Edition Guide, Async Book, Nomicon; the axum
0.8.9 docs, its repository examples and each ecosystem crate's own docs). Six requester-provided books are consulted
references only for concept coverage and the bibliography (their concept table is in the issue body); they are not
available in this environment and are never copied.

1. **Rust Reference** — `modules/ROOT/pages/programming-languages/rust/`: 55 files (landing `index.adoc`, 53 concept pages, `cheat-sheet.adoc`); Rust 1.99 / edition 2024; running scenario *shelf* (library catalogue).
2. **Axum** — `modules/ROOT/pages/backend/axum/`: 55 files (landing, 53 pages, `cheat-sheet.adoc`); axum 0.8.9 on Rust >= 1.80; running scenario *Bookshelf* reusing `shelf-core`.

Each section also ships a disclaimer partial (the only admonition allowed), a nav partial, `== Bibliography` on the landing page,
`== References` on every page, Mermaid diagrams and original `rust-*.svg` / `axum-*.svg` figures (at least wherever the outlines
mark 📊), and a one-page A4 cheat-sheet PDF in `modules/ROOT/attachments/`. Plus integration: `nav.adoc` (Rust x3, Axum x2),
the Programming Languages / Backend / Web / root index pages, and the back-links listed in the issue.

**The binding spec** is the issue body plus two outline comments (Part 1: issuecomment-6019817057, Part 2: issuecomment-6019817667).
Local copies are in the session scratchpad (`body.md`, `c0.md`, `c1.md`); each page task re-reads its own outline bullets there.

### Choices made on the user's behalf

1. **One branch `feature/195`, one draft PR to `main`** (user-confirmed base). The issue suggests an optional six-PR split on
   `feature/195-rust`; groups below follow those six slices so the work can still be cut that way.
2. **Tasks are untagged**: no installed `*-code-one-task` key fits AsciiDoc/Mermaid/SVG/PDF authoring, so tasks are implemented
   directly. Rust examples are compiled in scratch Cargo workspaces (Task 2) that are never committed.
3. **Page count:** the outline lists are authoritative (55 files per section, `index.adoc` and `cheat-sheet.adoc` included, as counted from the comments).
4. **Books appear only in the bibliography and in prose notes about outdated material.** No book text, listing, figure or sample project is reproduced; no PDF other than the two cheat sheets is ever staged. *Rust Unleashed* is not used or listed.
5. **Admonitions:** only the disclaimer partial. Nightly-only notes, deprecations, security caveats, version pitfalls and "the book is outdated" remarks are prose or table rows.
6. **Existing pages get real `xref:`s; not-yet-existing ones (#263, #196, #236, #257, #191, #249) stay prose.** Verify each target with `ls`.
7. **Versions are re-verified at implementation time** (Task 1); newer stable Rust or axum 0.9 moves the baseline and the additions are marked with versions.
8. **Nav partials and landing/cheat-sheet pages are written after their pages** so they list the final page set.

### Rules every page task must follow

- Page template: `= Title`, `:description:`, `:keywords:`, `include::partial$<rust|axum>-disclaimer.adoc[]` right after the header attributes, an intro stating the versions targeted, detailed explanation (what/why/how, every relevant type/trait/method/attribute/Cargo key, common compiler errors with `E0xxx` linked to the error index, pitfalls, version notes), complete examples, a prose note on where the books are outdated for the concepts touched, and `== References` listing only official sources.
- Every code example compiles (stable, edition 2024, clippy-clean) in the scratch workspace and is followed by a `Source: <url>[title]` line; docs.rs links pin crate versions, std links use `stable`. No real secrets; no `unwrap()` in handlers (use `?` and `AppError`).
- `CLAUDE.md` rules: one-line `image::` macros (alt in double quotes if it has a comma), `+...+`/`pass:c[...]` passthroughs for inline code containing `->`, `=>`, `'a`, `{id}`, `*`, `__`, `#[`, `...`, `~`, `^`, Mermaid stereotypes as `&lt;&lt;trait&gt;&gt;`, every SVG referenced by a page.
- ★ pages are the most detailed in the section; 📊 figures are a floor, not a ceiling. Figures are original drawings.

## Current code state

- No application code: this repo is the Antora playbook and `ROOT` component (`antora.yml`, `antora-playbook.yml`, `modules/ROOT/`).
- Neither `programming-languages/rust/` nor `backend/axum/` exists yet; `programming-languages/` holds c, cpp, csharp, java, javascript, kotlin, objective-c, php, python, swift, typescript; `backend/` has fastapi, nestjs, springboot etc.; `web/` has php-laravel, django, etc.
- Templates: `partials/nav-python.adoc` (absolute-depth `***/****` nav partial included at three sites; template for `nav-rust.adoc`), `partials/nav-javascript.adoc` (two-site template for `nav-axum.adoc`), `partials/fastapi-disclaimer.adoc` (the `[IMPORTANT]` disclaimer), `backend/fastapi/cheat-sheet.adoc` and `modules/ROOT/attachments/*-cheat-sheet.pdf` (cheat-sheet convention).
- `modules/ROOT/nav.adoc` includes `nav-php.adoc` (~line 29) and `nav-python.adoc` (lines ~33 and ~613); PHP and Laravel block starts ~line 685.
- Precedent: `.archive/implementation_plan_194.md` (PHP and PHP and Laravel) — same structure.
- Tooling in the sandbox: `cargo`/`rustc`, Node, Chromium (`/opt/pw-browsers`), `pdfinfo`; `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`).

## Implementation steps

### Group 1 — Baseline and tooling

Parallelizable: yes — read-only verification and independent scratch setup

- [x] Task 1. Re-verify the version baseline and tooling, and pin the shared facts — done: Rust 1.99.0 stable confirmed (rustup channel manifest, 2026-10-01) and installed; axum 0.8.9 still current (no 0.9); crate table in scratchpad versions.md
  - [x] Task 1.1. Re-check against the official sources, dated today: current Rust stable/beta (issue baseline 1.99.0; 1.100 due 2026-11-12), edition 2024, axum (0.8.9; any 0.9?), tokio, tower/tower-http, sqlx, SeaORM, jsonwebtoken, argon2, utoipa, OpenTelemetry crates, pyo3, wasm-bindgen. Record the table in the scratchpad as `versions.md`; every page cites it. If a newer stable/axum is out, pages target it and mark additions with versions — done: versions.md; deltas vs issue: hyper 1.12.0, rand 0.10.3, pyo3 0.29.3, wasm-bindgen 0.2.129
  - [x] Task 1.2. Check what the sandbox can reach (docs.rs, doc.rust-lang.org, crates.io); if an official page cannot be fetched, describe behaviour without inventing names and flag it in the report — done: docs.rs, doc.rust-lang.org, github.com and crates.io web are blocked by the egress proxy; crates index/downloads and static.rust-lang.org work, so APIs are verified against crate sources and by compiling; doc URLs could not be fetched and follow the documented URL structure
  - [x] Task 1.3. Confirm tooling: `cargo`, `rustc`, `node`, headless Chromium, `pdfinfo`; run `npm install` and `npm i --no-save mermaid@11 jsdom` once for `npm run validate:mermaid` — done: cargo/rustc 1.99.0, node 22, Chromium 1194, pdfinfo; mermaid@11 + jsdom installed (--no-save); local Postgres 16 and Redis started for examples
  - [x] Task 1.4. Local copies of the spec already exist in the scratchpad (`body.md`, `c0.md`, `c1.md`); every page task re-reads its own outline bullets (★ depth, 📊 figures, source paths, "books outdated" notes) from `c0.md`/`c1.md` — done
- [x] Task 2. Create the scratch Cargo workspaces used to compile every example (never committed; kept in the scratchpad) — done
  - [x] Task 2.1. `shelf` workspace: `shelf-core` (Book, Author, Isbn newtype, Loan, Catalog trait + in-memory impl) and the `shelf` CLI binary, edition 2024; this is the code the Rust pages' examples are drawn from — done: scratchpad/shelf (shelf-core, shelf, rx example harness), clippy pedantic clean, tests pass
  - [x] Task 2.2. `bookshelf` workspace: axum 0.8.9 app reusing `shelf-core`, with the pinned crate set (tower-http 0.7, sqlx 0.9, jsonwebtoken 11, argon2 0.6, utoipa 6, tower-sessions/axum-login pairing, OpenTelemetry 0.33). Pin compatible versions per the issue's version-pairing pitfalls — done: scratchpad/bookshelf/bx with the pinned crate set (tower-sessions 0.14 for axum-login, utoipa-swagger-ui vendored feature since GitHub downloads are blocked)
  - [x] Task 2.3. Each page task compiles its examples there with `cargo check`/`cargo clippy -- -D warnings` before writing them into the page — done: scratchpad/check.py extracts every [source,rust] block and runs cargo clippy -D warnings (compile-fail blocks verified against their E-codes)

### Group 2 — Shared partials (disclaimers)

Parallelizable: yes — two independent files

- [x] Task 3. Create the shared partials — done
  - [x] Task 3.1. `modules/ROOT/partials/rust-disclaimer.adoc`: single `[IMPORTANT]` block shaped like `fastapi-disclaimer.adoc` (AI-assistance sentence + `xref:programming-languages/rust/index.adoc#_bibliography[the section bibliography]`) — done
  - [x] Task 3.2. `modules/ROOT/partials/axum-disclaimer.adoc`: same shape, pointing to `xref:backend/axum/index.adoc#_bibliography[...]` — done
  - [x] Task 3.3. `nav-rust.adoc` and `nav-axum.adoc` are written in Groups 6 and 10, once their page lists are final — done (deferred by design to Groups 6 and 10)

### Group 3 — Rust Reference: getting started, core language, ownership, data and errors (issue PR slice 1)

Parallelizable: yes — each page is its own file; pages only xref each other by path and all targets exist by the end of the group set

- [x] Task 4. `programming-languages/rust/getting-started.adoc` ★ — write per Part 1 outline, "Getting started"; examples compiled in the scratch workspace (Task 2) — done: 408 lines, compilation-pipeline SVG, 3 rust blocks (1 compile-fail E0382) compiled on 1.99
- [x] Task 5. `programming-languages/rust/toolchain-rustup-and-editions.adoc` — write per Part 1 outline, "Getting started"; examples compiled in the scratch workspace (Task 2) — done: 290 lines, rustup proxy SVG + Mermaid timeline, let-chain example compiled
- [x] Task 6. `programming-languages/rust/syntax-comments-and-style.adoc` — write per Part 1 outline, "Getting started"; examples compiled in the scratch workspace (Task 2) — done: 309 lines, 5 examples compiled
- [x] Task 7. `programming-languages/rust/variables-mutability-and-constants.adoc` — write per Part 1 outline, "Core language"; examples compiled in the scratch workspace (Task 2) — done: 359 lines, 14 examples (E0384/E0381/static_mut_refs failures verified)
- [x] Task 8. `programming-languages/rust/types-and-values.adoc` ★ — write per Part 1 outline, "Core language"; examples compiled in the scratch workspace (Task 2) — done: 461 lines, primitives table, 11 examples run; strict_* (1.91) verified on 1.90/1.91 toolchains
- [x] Task 9. `programming-languages/rust/functions-and-expressions.adoc` — write per Part 1 outline, "Core language"; examples compiled in the scratch workspace (Task 2) — done: 338 lines, 10 examples run
- [x] Task 10. `programming-languages/rust/control-flow.adoc` ★ — write per Part 1 outline, "Core language"; examples compiled in the scratch workspace (Task 2) — done: 427 lines, 14 examples run; if-let guards verified stable in 1.95 (unstable on 1.94)
- [x] Task 11. `programming-languages/rust/ownership-and-moves.adoc` ★ — write per Part 1 outline, "Ownership"; examples compiled in the scratch workspace (Task 2) — done: 398 lines, String move SVG, 9 examples (E0382/E0505 verified)
- [x] Task 12. `programming-languages/rust/borrowing-and-references.adoc` ★ — write per Part 1 outline, "Ownership"; examples compiled in the scratch workspace (Task 2) — done: 408 lines, Mermaid state diagram, 12 examples (E0502/E0597/E0716/E0506 verified)
- [x] Task 13. `programming-languages/rust/slices-and-dynamically-sized-types.adoc` — write per Part 1 outline, "Ownership"; examples compiled in the scratch workspace (Task 2) — done: 282 lines, fat-pointer SVG, 7 examples run
- [x] Task 14. `programming-languages/rust/lifetimes.adoc` ★ — write per Part 1 outline, "Ownership"; examples compiled in the scratch workspace (Task 2) — done: 398 lines, lifetime-scope SVG, 9 examples (E0106/E0597 verified)
- [x] Task 15. `programming-languages/rust/structs-and-methods.adoc` — write per Part 1 outline, "Data and errors"; examples compiled in the scratch workspace (Task 2) — done: 339 lines, 6 examples run
- [x] Task 16. `programming-languages/rust/enums-and-pattern-matching.adoc` ★ — write per Part 1 outline, "Data and errors"; examples compiled in the scratch workspace (Task 2) — done: 449 lines, Loan state-machine Mermaid, 11 examples; assert_matches! verified stable 1.96 as std::assert_matches!
- [x] Task 17. `programming-languages/rust/option-result-and-combinators.adoc` ★ — write per Part 1 outline, "Data and errors"; examples compiled in the scratch workspace (Task 2) — done: 320 lines, 7 examples run; bool::ok_or verified 1.98
- [x] Task 18. `programming-languages/rust/error-handling.adoc` ★ — write per Part 1 outline, "Data and errors"; examples compiled in the scratch workspace (Task 2) — done: 365 lines, decision Mermaid flowchart, thiserror/anyhow examples compiled
- [x] Task 19. `programming-languages/rust/collections.adoc` — write per Part 1 outline, "Data and errors"; examples compiled in the scratch workspace (Task 2) — done: 352 lines, Vec growth SVG, 8 examples run; push_mut 1.95 verified
- [x] Task 20. `programming-languages/rust/strings-and-text.adoc` — write per Part 1 outline, "Data and errors"; examples compiled in the scratch workspace (Task 2) — done: 355 lines, 9 examples run; strip_circumfix 1.98, from_utf8_lossy_owned 1.99, fmt::from_fn 1.93 verified

### Group 4 — Rust Reference: abstraction, memory, concurrency and async (slice 2)

Parallelizable: yes — distinct files

- [x] Task 21. `programming-languages/rust/generics-and-const-generics.adoc` — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 365 lines, 9 examples run; inferred const args verified 1.89
- [x] Task 22. `programming-languages/rust/traits.adoc` ★ — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 550 lines, Catalog trait class diagram (entity stereotypes), 11 examples incl. E0117 and custom on_unimplemented message verified
- [x] Task 23. `programming-languages/rust/trait-objects-and-dyn-compatibility.adoc` ★ — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 361 lines, vtable SVG, 7 examples (E0038 verified), trait upcasting example
- [x] Task 24. `programming-languages/rust/any-and-downcasting.adoc` — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 286 lines, 6 examples; as_any vs upcasting, TypeId event bus
- [x] Task 25. `programming-languages/rust/closures-and-fn-traits.adoc` — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 328 lines, Fn/FnMut/FnOnce Mermaid, 8 examples incl. AsyncFn retry
- [x] Task 26. `programming-languages/rust/iterators.adoc` ★ — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 399 lines, lazy-pipeline Mermaid, 10 examples; tuple collect verified (pairs 1.79, larger 1.85)
- [x] Task 27. `programming-languages/rust/type-conversions-and-coercions.adoc` — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 379 lines, 8 examples
- [x] Task 28. `programming-languages/rust/standard-traits-and-operator-overloading.adoc` — write per Part 1 outline, "Abstraction"; examples compiled in the scratch workspace (Task 2) — done: 333 lines, trait-law Mermaid, 4 examples
- [x] Task 29. `programming-languages/rust/smart-pointers.adoc` ★ — write per Part 1 outline, "Memory"; examples compiled in the scratch workspace (Task 2) — done: 294 lines, Rc/Weak tree SVG, 6 examples; new_zeroed verified 1.92
- [x] Task 30. `programming-languages/rust/interior-mutability-and-lazy-initialization.adoc` — write per Part 1 outline, "Memory"; examples compiled in the scratch workspace (Task 2) — done: 230 lines, 5 examples
- [x] Task 31. `programming-languages/rust/drop-raii-and-drop-check.adoc` — write per Part 1 outline, "Memory"; examples compiled in the scratch workspace (Task 2) — done: 343 lines, 7 examples (dropck E0597 verified)
- [x] Task 32. `programming-languages/rust/memory-layout-and-repr.adoc` — write per Part 1 outline, "Memory"; examples compiled in the scratch workspace (Task 2) — done: 257 lines, repr layout SVG (offsets measured), 5 examples; size_of_val_raw verified 1.99
- [x] Task 33. `programming-languages/rust/threads-and-message-passing.adoc` ★ — write per Part 1 outline, "Concurrency and async"; examples compiled in the scratch workspace (Task 2) — done: 310 lines, channel sequence Mermaid, 7 examples run
- [x] Task 34. `programming-languages/rust/shared-state-send-sync-and-atomics.adoc` ★ — write per Part 1 outline, "Concurrency and async"; examples compiled in the scratch workspace (Task 2) — done: 305 lines, Send/Sync matrix SVG (claims compile-checked), 6 examples; RwLock downgrade 1.92 and Atomic update 1.95 verified
- [x] Task 35. `programming-languages/rust/data-parallelism-with-rayon.adoc` — write per Part 1 outline, "Concurrency and async"; examples compiled in the scratch workspace (Task 2) — done: 225 lines, 6 Rayon examples run
- [x] Task 36. `programming-languages/rust/async-await-and-futures.adoc` ★ — write per Part 1 outline, "Concurrency and async"; examples compiled in the scratch workspace (Task 2) — done: 373 lines, poll/wake sequence Mermaid, 8 examples run
- [x] Task 37. `programming-languages/rust/pin-and-unpin.adoc` — write per Part 1 outline, "Concurrency and async"; examples compiled in the scratch workspace (Task 2) — done: 229 lines, 4 examples incl. pin-project-lite wrapper
- [x] Task 38. `programming-languages/rust/async-runtimes-and-tokio.adoc` — write per Part 1 outline, "Concurrency and async"; examples compiled in the scratch workspace (Task 2) — done: 398 lines, tokio scheduler SVG, 7 examples run

### Group 5 — Rust Reference: code organization, advanced/interop, applied topics (slice 3, part 1)

Parallelizable: yes — distinct files

- [x] Task 39. `programming-languages/rust/modules-crates-and-visibility.adoc` ★ — write per Part 1 outline, "Code organization and tooling"; examples compiled in the scratch workspace (Task 2) — done: 344 lines, shelf-core module-tree Mermaid, 5 examples run
- [x] Task 40. `programming-languages/rust/cargo-and-workspaces.adoc` ★ — write per Part 1 outline, "Code organization and tooling"; examples compiled in the scratch workspace (Task 2) — done: 430 lines, workspace Mermaid; manifest/features/build.rs/config include/workspace/lints/profile snippets verified in scratch packages (cargotest, wstest)
- [x] Task 41. `programming-languages/rust/testing-and-benchmarking.adoc` — write per Part 1 outline, "Code organization and tooling"; examples compiled in the scratch workspace (Task 2) — done: 316 lines, unit/integration/proptest/insta tests executed (cargo test), criterion bench run
- [x] Task 42. `programming-languages/rust/documentation-with-rustdoc.adoc` — write per Part 1 outline, "Code organization and tooling"; examples compiled in the scratch workspace (Task 2) — done: 261 lines, doctests verified in scratch crate (3 pass incl. should_panic and compile_fail)
- [x] Task 43. `programming-languages/rust/tooling-clippy-rustfmt-and-rust-analyzer.adoc` — write per Part 1 outline, "Code organization and tooling"; examples compiled in the scratch workspace (Task 2) — done: 251 lines, clippy.toml and rustfmt.toml validated by running clippy/fmt; CI YAML
- [x] Task 44. `programming-languages/rust/debugging-and-diagnostics.adoc` — write per Part 1 outline, "Code organization and tooling"; examples compiled in the scratch workspace (Task 2) — done: 255 lines, 4 examples run; payload_as_str verified 1.91
- [x] Task 45. `programming-languages/rust/macros.adoc` ★ — write per Part 1 outline, "Advanced and interop"; examples compiled in the scratch workspace (Task 2) — done: 349 lines, expansion Mermaid; syn 3 derive(Builder) proc-macro crate built and used; cfg_select 1.95 and attribute macros on file modules 1.99 verified
- [x] Task 46. `programming-languages/rust/unsafe-rust.adoc` ★ — write per Part 1 outline, "Advanced and interop"; examples compiled in the scratch workspace (Task 2) — done: 312 lines, 6 examples run
- [x] Task 47. `programming-languages/rust/ffi-and-c-interop.adoc` — write per Part 1 outline, "Advanced and interop"; examples compiled in the scratch workspace (Task 2) — done: 420 lines, FFI boundary SVG; ffitest crate (cc + bindgen 0.73, C caller, cbindgen header, C-variadic 1.99) built and run
- [x] Task 48. `programming-languages/rust/python-interop-with-pyo3.adoc` — write per Part 1 outline, "Advanced and interop"; examples compiled in the scratch workspace (Task 2) — done: 300 lines, PyO3 0.29.3 extension built with maturin, pytest 4 passed; embedding example run
- [x] Task 49. `programming-languages/rust/webassembly.adoc` — write per Part 1 outline, "Advanced and interop"; examples compiled in the scratch workspace (Task 2) — done: 293 lines, target Mermaid; wasm-bindgen 0.2.129 module run under Node, WASI p1/p2 builds, p1 run under Node WASI
- [x] Task 50. `programming-languages/rust/io-files-processes-and-environment.adoc` — write per Part 1 outline, "Applied topics and evolution"; examples compiled in the scratch workspace (Task 2) — done: 351 lines, 8 examples run; File::lock 1.89, set_times 1.99, io::pipe 1.87 verified
- [x] Task 51. `programming-languages/rust/serialization-with-serde.adoc` — write per Part 1 outline, "Applied topics and evolution"; examples compiled in the scratch workspace (Task 2) — done: 443 lines, 10 examples run (JSON, TOML, YAML fork, MessagePack, path_to_error)
- [x] Task 52. `programming-languages/rust/numbers-and-numeric-computing.adoc` — write per Part 1 outline, "Applied topics and evolution"; examples compiled in the scratch workspace (Task 2) — done: 222 lines, 5 examples run; algebraic float methods verified 1.98
- [x] Task 53. `programming-languages/rust/performance-and-profiling.adoc` — write per Part 1 outline, "Applied topics and evolution"; examples compiled in the scratch workspace (Task 2) — done: 218 lines, 3 examples run; cold_path verified 1.95
- [x] Task 54. `programming-languages/rust/idioms-patterns-and-api-guidelines.adoc` ★ — write per Part 1 outline, "Applied topics and evolution"; examples compiled in the scratch workspace (Task 2) — done: 350 lines, 5 examples run
- [x] Task 55. `programming-languages/rust/incremental-adoption-and-refactoring.adoc` — write per Part 1 outline, "Applied topics and evolution"; examples compiled in the scratch workspace (Task 2) — done: 183 lines, strategy Mermaid, differential proptest executed

### Group 6 — Rust Reference: evolution page, landing, cheat sheet, nav at three sites, index bullets (slice 3, part 2)

Parallelizable: no — the landing page, cheat sheet and nav list every page, so they need Groups 3–5 finished; the nav include edits share `nav.adoc`

- [x] Task 56. Rust `whats-new-and-edition-migration.adoc` ★ — collects every outdated-book statement, erratum and "new since the books" item from the issue (editions table, 1.80–1.99 features, FFI/PyO3/WebAssembly/crate changes), with versions, in prose and tables only — done: example compiled and run
- [x] Task 57. Rust `index.adoc` — landing page per the Part 1 outline: baseline, *shelf* scenario, reading path, `== What's covered`, the one sentence on why *Rust Unleashed* is not used, Mermaid mind-map, and `== Bibliography` listing every source used (books with author/title/edition/publisher/year/ISBN/DOI and official pages, doc.rust-lang.org resources, ecosystem docs; Crossley entry marked "consulted for topic coverage only") — done: mindmap parsed, grouped xrefs to all 53 pages
- [x] Task 58. Rust `cheat-sheet.adoc` and `modules/ROOT/attachments/rust-cheat-sheet.pdf` — done
  - [x] Task 58.1. Write `cheat-sheet.adoc` per the Cheat sheets convention (disclaimer, intro with `xref:attachment$rust-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` xrefs to every page, final download line, `== References`) — done: 55 xrefs, References section
  - [x] Task 58.2. Render the one-page A4 PDF from a throwaway HTML in the scratchpad with headless Chromium (`--headless --print-to-pdf --no-pdf-header-footer`), covering every item in the issue's Rust cheat-sheet list; verify `pdfinfo` reports exactly 1 page and preview as PNG; commit only the PDF — done: pdfinfo 1 page A4, previewed as PNG
- [x] Task 59. `modules/ROOT/partials/nav-rust.adoc` (absolute-depth, modelled on `nav-python.adoc`, with its explanatory header comment) and three includes in `modules/ROOT/nav.adoc`: under Programming Languages after `nav-java.adoc`, under Backend Development after the NestJS block, under Web Development after the PHP and Laravel block — done: 60-line partial; includes at nav.adoc lines 35, 749, 858
- [x] Task 60. Add a **Rust Reference** bullet and update `:description:`/`:keywords:` in `programming-languages/index.adoc`, `backend/index.adoc` and `web/index.adoc` — done: bullets plus description/keywords in the three landing pages

### Group 7 — Axum: foundations, routing/handlers/extractors/responses, middleware, building APIs (slice 4)

Parallelizable: yes — distinct files

- [ ] Task 61. `backend/axum/introduction-and-architecture.adoc` ★ — write per Part 2 outline, "Foundations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 62. `backend/axum/tower-service-model.adoc` ★ — write per Part 2 outline, "Foundations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 63. `backend/axum/getting-started.adoc` ★ — write per Part 2 outline, "Foundations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 64. `backend/axum/project-structure.adoc` — write per Part 2 outline, "Foundations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 65. `backend/axum/routing.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 66. `backend/axum/routing-composition.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 67. `backend/axum/handlers.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 68. `backend/axum/extractors.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 69. `backend/axum/custom-extractors.adoc` — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 70. `backend/axum/axum-extra.adoc` — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 71. `backend/axum/responses.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 72. `backend/axum/error-handling.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 73. `backend/axum/state-and-dependency-injection.adoc` ★ — write per Part 2 outline, "Routing, handlers, extractors and responses"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 74. `backend/axum/writing-middleware.adoc` ★ — write per Part 2 outline, "Middleware and HTTP concerns"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 75. `backend/axum/applying-middleware-and-ordering.adoc` ★ — write per Part 2 outline, "Middleware and HTTP concerns"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 76. `backend/axum/tower-http-catalog.adoc` — write per Part 2 outline, "Middleware and HTTP concerns"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 77. `backend/axum/request-limits-and-timeouts.adoc` — write per Part 2 outline, "Middleware and HTTP concerns"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 78. `backend/axum/cors-and-compression.adoc` — write per Part 2 outline, "Middleware and HTTP concerns"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 79. `backend/axum/rate-limiting-and-load-shedding.adoc` — write per Part 2 outline, "Middleware and HTTP concerns"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 80. `backend/axum/json-rest-apis.adoc` ★ — write per Part 2 outline, "Building APIs"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 81. `backend/axum/validation.adoc` — write per Part 2 outline, "Building APIs"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 82. `backend/axum/openapi-with-utoipa.adoc` — write per Part 2 outline, "Building APIs"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 83. `backend/axum/forms-and-content-negotiation.adoc` — write per Part 2 outline, "Building APIs"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 84. `backend/axum/graphql-and-grpc.adoc` — write per Part 2 outline, "Building APIs"; examples compiled in the scratch workspace (Task 2)

### Group 8 — Axum: data, security, web UI and real-time (slice 5)

Parallelizable: yes — distinct files

- [ ] Task 85. `backend/axum/databases-with-sqlx.adoc` ★ — write per Part 2 outline, "Data"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 86. `backend/axum/migrations-and-transactions.adoc` ★ — write per Part 2 outline, "Data"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 87. `backend/axum/seaorm-and-diesel.adoc` — write per Part 2 outline, "Data"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 88. `backend/axum/redis-and-caching.adoc` — write per Part 2 outline, "Data"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 89. `backend/axum/sessions-and-cookies.adoc` ★ — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 90. `backend/axum/password-authentication.adoc` ★ — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 91. `backend/axum/jwt-and-bearer-tokens.adoc` ★ — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 92. `backend/axum/oauth2-and-openid-connect.adoc` — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 93. `backend/axum/authorization.adoc` — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 94. `backend/axum/csrf-and-security-hardening.adoc` — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 95. `backend/axum/tls-and-https.adoc` — write per Part 2 outline, "Security"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 96. `backend/axum/server-side-templates.adoc` ★ — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 97. `backend/axum/htmx.adoc` — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 98. `backend/axum/static-files-and-spas.adoc` — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 99. `backend/axum/websockets.adoc` ★ — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 100. `backend/axum/server-sent-events-and-streaming.adoc` — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 101. `backend/axum/file-uploads.adoc` — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 102. `backend/axum/fullstack-leptos-and-dioxus.adoc` — write per Part 2 outline, "Web UI and real-time"; examples compiled in the scratch workspace (Task 2)

### Group 9 — Axum: operations (slice 6, part 1)

Parallelizable: yes — distinct files

- [ ] Task 103. `backend/axum/background-jobs-and-tasks.adoc` — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 104. `backend/axum/http-clients-and-proxies.adoc` — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 105. `backend/axum/graceful-shutdown.adoc` ★ — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 106. `backend/axum/configuration.adoc` — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 107. `backend/axum/logging-and-tracing.adoc` ★ — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 108. `backend/axum/opentelemetry-and-distributed-tracing.adoc` — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 109. `backend/axum/metrics-and-slos.adoc` — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 110. `backend/axum/testing.adoc` ★ — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 111. `backend/axum/performance-tuning.adoc` — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)
- [ ] Task 112. `backend/axum/deployment.adoc` ★ — write per Part 2 outline, "Operations"; examples compiled in the scratch workspace (Task 2)

### Group 10 — Axum: reference pages, landing, cheat sheet, nav at two sites, index bullets, back-links (slice 6, part 2)

Parallelizable: no — landing, cheat sheet and nav depend on all Axum pages; nav/index/back-link edits touch shared files

- [ ] Task 113. Axum `migration-and-framework-comparison.adoc` — 0.7→0.8 and older-tutorial migration, version-pairing pitfalls, upcoming 0.9 items flagged as upcoming, comparison table (actix-web, Rocket, poem, warp, Loco) with official links
- [ ] Task 114. Axum `index.adoc` — landing page per Part 2 outline with `== Bibliography` (books, axum/tokio/tower docs, crates and services, specifications and standards — each linked to its official site)
- [ ] Task 115. Axum `cheat-sheet.adoc` and `modules/ROOT/attachments/axum-cheat-sheet.pdf` (same procedure and one-page check as the Rust sheet, covering the issue's Axum cheat-sheet list)
- [ ] Task 116. `modules/ROOT/partials/nav-axum.adoc` and two includes in `nav.adoc`, each right after a `nav-rust.adoc` include (Backend Development and Web Development); add an **Axum** bullet in `backend/index.adoc` and `web/index.adoc`; mention Rust and Axum in the root `modules/ROOT/pages/index.adoc` `:description:`/`:keywords:`
- [ ] Task 117. Back-links in existing pages (verify each target with `ls` first; add only what the page lacks)
  - [ ] Task 117.1. `ai/cli-for-agents/frameworks-go-and-rust.adoc`: replace the "planned and is not linked yet" sentence with an `xref:` to the Rust Reference; one-line links in `packaging-and-distribution.adoc` (→ `cargo-and-workspaces`) and `testing-clis.adoc` (→ `testing-and-benchmarking`)
  - [ ] Task 117.2. `ai/mcp/index.adoc` (Rust SDK row) and `ai/agents/frameworks-landscape.adoc` (Rig row): link to the Rust Reference
  - [ ] Task 117.3. `backend/fastapi/performance-and-observability.adoc` (PyO3/maturin) → `python-interop-with-pyo3`; `web/django/deployment.adoc` (Granian) → Axum introduction; `database/prometheus/instrumenting-applications.adoc` → Axum `metrics-and-slos`
  - [ ] Task 117.4. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`: add a `| Rust / Axum` row to the "Backend framework" table
  - [ ] Task 117.5. `programming-languages/swift/memory-safety-and-unsafe-pointers.adoc` → `borrowing-and-references`; `apps/kotlin-multiplatform/web-with-kotlin-wasm-and-js.adoc` and `web/aspnet/core/blazor-webassembly-hybrid-and-deployment.adoc` gain a one-line link back to `webassembly`
  - [ ] Task 117.6. Check the C, C++, C#, Swift, concurrency and `backend/oauth/*` pages named in the issue's "What already exists" table are linked **from** the new Rust/Axum pages (done in the page tasks), and add reverse links only where the issue lists them

### Group 11 — Final verification

Parallelizable: yes — single task

- [ ] Task 118. Final verification and clean-up
  - [ ] Task 118.1. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings; inspect `build/site` for the Rust nav (3 sites) and Axum nav (2 sites)
  - [ ] Task 118.2. Run the `CLAUDE.md` image checks (block macros closed on one line; no `<p>image::`; unquoted-comma alt text on changed files), the inline-code substitution grep on `build/site/programming-languages/rust` and `build/site/backend/axum`, and `npm run validate:mermaid` (all diagrams parsed)
  - [ ] Task 118.3. Every `modules/ROOT/images/rust-*.svg` / `axum-*.svg` is referenced by a page and every `image::` target exists; SVGs are original (no Ferris/logos/book figures)
  - [ ] Task 118.4. Confirm: exactly 55 + 55 section files (plus the two PDFs, each 1 page via `pdfinfo`); each page has the disclaimer include after its header attributes, `:description:`, `:keywords:`, a `== References` section, and no other `NOTE/TIP/WARNING/CAUTION/IMPORTANT` blocks; every example is followed by a `Source:` link; no real secrets; no `xref:` to #263/#196/#236/#257/#191/#249 or other missing pages
  - [ ] Task 118.5. `git status` shows no book PDF and no scratch workspace; only the two cheat-sheet PDFs are new binaries
  - [ ] Task 118.6. Run `/iru-check-security` scoped to the changed paths