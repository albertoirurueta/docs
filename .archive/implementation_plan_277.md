# Implementation Plan: Guides & References — "Fortran" (Programming Languages)

## Task summary

Source: GitHub issue #277
Base branch: main

Issue [#277](https://github.com/albertoirurueta/docs/issues/277) adds an Antora section
`modules/ROOT/pages/programming-languages/fortran/` (nav title **Fortran Reference**): a detailed, learning-oriented reference for
**modern Fortran, targeting Fortran 2023** (ISO/IEC 1539-1:2023, J3/23-007r1; Cor 1:2026; Fortran 2028 only as "upcoming").
**55 pages** (incl. `index.adoc` with the Bibliography and `cheat-sheet.adoc`), `fortran-disclaimer.adoc` and `nav-fortran.adoc`
partials, original `fortran-*.svg` figures and Mermaid diagrams, back-links from existing pages, and a one-page A4 PDF
`modules/ROOT/attachments/fortran-cheat-sheet.pdf`. Running scenario: the original **heatflow** fpm project (2D heat diffusion).
Unlike Rust/Go/Ruby it deliberately does not use the *shelf* scenario.

**The binding spec** is the issue body plus one comment (the page outline, split for GitHub's size limit):
https://github.com/albertoirurueta/docs/issues/277#issuecomment-6096428295. Local copies (session scratchpad):
`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/0c8fd8f8-10ce-4196-89c0-db97e45c3bf5/scratchpad/issue277.md`
(body) and `issue277c.md` (outline); re-fetch with `gh issue view 277 --json body,comments` if missing. **Every page task must re-read
its own outline bullets** (★ depth, 📊 figures, source abbreviations S/NF/F28/FL/FPM/SL/GF/FN/IX/MW, MRCB/MATLAB chapter notes, "book
outdated" notes) and the issue's "Concepts contributed by the books" and "Where the books are outdated" tables.

### Choices made on the user's behalf

1. **Branch `feature/277-add-fortran-section-language-reference`** (from `main`, user-confirmed base), **one draft PR to `main`** with
   `Closes #277`. Groups follow the outline sections so the work could still be cut into several PRs.
2. **Tasks are untagged.** No `fortran` coding key exists in the catalog and the work is AsciiDoc/Mermaid/SVG/PDF authoring, so tasks are
   implemented directly. Fortran code in pages is **compiled and run for real** in a scratch directory (never committed).
3. **Toolchain** (Task 1): the host has no Fortran toolchain and no Homebrew. **The user approved Docker** (confirmed in chat): examples are
   compiled and run in official Docker images (e.g. `gcc` for gfortran, a LLVM Flang image, fpm/CMake/Meson/OpenMP/MPI added inside the
   containers as needed) mounting a scratchpad directory; nothing is installed on the host and nothing is committed. If an image for a tool
   (Flang, MPI, OpenCoarrays) cannot be obtained, the affected examples are labelled per the issue and the PR description says so.
4. **Books**: the two PDFs in `~/Desktop/libros/fortran/` are copyrighted. Consulted only for concept coverage, structure and the
   "book is outdated" prose; cited on the landing-page bibliography by publisher page. No book text, listing, figure, exercise or sample
   is reproduced; nothing from them is committed or attached.
5. **Disclaimer** `fortran-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc` (single `[IMPORTANT]` AI-assistance disclosure +
   xref to `programming-languages/fortran/index.adoc#_bibliography`). It is the **only** admonition in the section; every other remark
   is prose or a table row.
6. **Nav placement**: `nav.adoc`'s Programming Languages open block currently ends `nav-go`, `nav-jvm-build-tools`, `nav-ruby`. The
   `include::partial$nav-fortran.adoc[]` goes **after `nav-ruby.adoc`**, as the last include before the closing `--`. `nav-fortran.adoc` is
   a relative-depth partial like `nav-php.adoc`, entries in outline order, ending with the cheat sheet.
7. **Version baseline re-verified at implementation time and dated** (Task 1): gfortran/Flang/ifx/NAG/Cray versions, fpm/stdlib/
   fortls/FORD/test-drive versions, OpenMP/OpenACC/MPI versions, Fortran 2028 draft status, MATLAB release, and every URL in the issue.
   Unverifiable items are described without naming a release.
8. **Existing pages get real `xref:`s** (targets verified with `ls`); #196, #243, #244, #248, #275 and #276 are mentioned in prose only.
9. **Figures**: every 📊 in the outline is delivered as Mermaid or an original `fortran-*.svg` (no fortran-lang logo, no book or
   standard figures); every SVG is referenced by a page.
10. **Cheat-sheet PDF** is rendered from a throwaway HTML page in the scratchpad with headless Chrome (as for the other cheat sheets),
    checked to be exactly one A4 page; only the PDF is committed.

### Current code state

- Repo is the Antora playbook + `ROOT` component; no application source. Build: `npm install`, `npx antora antora-playbook.yml`.
- Precedent sections (use as structural templates): `programming-languages/go/` (#275, 60+ pages) and `programming-languages/ruby/`
  (#276, 70 pages); disclaimer templates `partials/rust-disclaimer.adoc`, `partials/go-disclaimer.adoc`, `partials/ruby-disclaimer.adoc`;
  nav partials `partials/nav-php.adoc`, `partials/nav-go.adoc`, `partials/nav-ruby.adoc`; cheat sheets
  `programming-languages/{go,ruby,php}/cheat-sheet.adoc` and `modules/ROOT/attachments/*-cheat-sheet.pdf`; archived precedent plans
  `.archive/implementation_plan_275.md` and `implementation_plan_276.md`.
- Files to modify: `modules/ROOT/nav.adoc` (include), `modules/ROOT/pages/programming-languages/index.adoc` (bullet, `:description:`,
  `:keywords:`, "live only here" sentence), and the back-link pages listed in Group 10.
- `modules/ROOT/pages/programming-languages/fortran/` does not exist yet.
- Repository host: GitHub (albertoirurueta/docs). Project type: `other` (documentation-only).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$fortran-disclaimer.adoc[]`; intro states the baseline
  (Fortran 2023, J3/23-007r1, examples checked on gfortran 16.2 and LLVM Flang 23 or newest at implementation time).
- Each example: `[source,fortran]` free form, `implicit none` (or `(type, external)`), `intent` on every dummy, kinds from a kinds module or
  `iso_fortran_env`; compiles warning-free under `gfortran -std=f2023 -Wall -Wextra -pedantic -fimplicit-none -fcheck=all` and runs; real
  output in `[source,text]`; followed by a `Source: https://…[…]` link to the exact official page (standard links cite J3/23-007r1 with
  clause number; compiler links versioned where the vendor versions them; looked up, never guessed). Follows the heatflow scenario.
  Other languages/files use the tags given in the issue (`toml`, `cmake`, `meson`/`text`, `makefile`, `c`, `cpp`, `python`, `matlab`, `bash`).
  No real secrets or machine-specific paths.
- Depth: rationale, standard rules with clause numbers, every relevant statement/attribute/intrinsic/module entity/compiler option,
  runtime errors and diagnostics, pitfalls, standard-version provenance (F90…F2023, obsolescent/deleted) and compiler support. ★ pages are
  the most detailed in the section.
- Each page covers where the books are outdated for its concepts (prose/tables only, never reproducing errata) and ends with `== References`.
- AsciiDoc pitfalls (`CLAUDE.md` + issue): inline code with `**`, `*`, `=>`, `<=`, `'`, `...`, `__`, `{`, `~`, `^` → `` `+…+` ``; with `+` →
  `` `pass:c[…]` `` (`]` written `\]`, e.g. `x[2]`, `[1, 2]`); same in headings and link text. Image macros one line, quoted alt text if it
  contains a comma, column 0, blank lines around. Mermaid: `&lt;` before letters, stereotypes as `&lt;&lt;abstract&gt;&gt;`.
- Admonitions: none except the disclaimer include.
- Each group's last task runs that group's verification: compile/run every extracted example, plus the image/inline-code/admonition greps on
  the group's files (see Task 14). For compiling/running, delegate to a sub-agent (`iru-gate-runner`/general) so output stays out of the
  main context.

## Implementation steps

### Group 1 — Foundations (Parallelizable: no — Task 2 depends on the baseline verified in Task 1)

- [x] Task 1. Toolchain and baseline
  - [x] Task 1.1. Pull the Docker images approved by the user (GNU Fortran, fpm, LLVM Flang if available; add OpenMP/MPI/CMake/Meson/NumPy f2py inside containers only where later pages need them); record which tools are available and the containerised compile/run script used for example checks (scratchpad only)
  - [x] Task 1.2. Re-verify the issue's version baseline and every cited URL (standards, WG5/J3 docs, fortran-lang, compiler manuals, MATLAB R2026b pages, publisher pages) and record the dated results in the scratchpad
  - [x] Task 1.3. Build the heatflow reference project in the scratchpad (kinds, `grid_t`, boundary enumeration, abstract `solver_t` + Jacobi/FTCS in submodules, namelist config, CSV/stream output, `do concurrent`, OpenMP, coarray, `mpi_f08` variants, C API, f2py, MEX) so pages share consistent names
- [x] Task 2. Shared partials and skeleton
  - [x] Task 2.1. `modules/ROOT/partials/fortran-disclaimer.adoc` modelled on `rust-disclaimer.adoc`
  - [x] Task 2.2. `modules/ROOT/partials/nav-fortran.adoc` (relative-depth, modelled on `nav-php.adoc`; entries for all 55 pages in outline order, cheat sheet last)
  - [x] Task 2.3. `include::partial$nav-fortran.adoc[]` in `modules/ROOT/nav.adoc` after `nav-ruby.adoc`, inside the open block

### Group 2 — Getting started and core language (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 3. Write the getting-started pages (3, excluding the landing page) and core language pages (8) under `modules/ROOT/pages/programming-languages/fortran/`
  - [x] Task 3.1. `getting-started.adoc` ★
  - [x] Task 3.2. `history-standards-and-compilers.adoc`
  - [x] Task 3.3. `fortran-for-programmers-of-other-languages.adoc`
  - [x] Task 3.4. `program-structure-and-source-form.adoc`
  - [x] Task 3.5. `intrinsic-types-and-kinds.adoc` ★
  - [x] Task 3.6. `variables-declarations-and-attributes.adoc`
  - [x] Task 3.7. `expressions-and-assignment.adoc` ★
  - [x] Task 3.8. `control-flow.adoc`
  - [x] Task 3.9. `procedures-functions-and-subroutines.adoc` ★
  - [x] Task 3.10. `modules-and-submodules.adoc` ★
  - [x] Task 3.11. `interfaces-generics-and-operator-overloading.adoc`
  - [x] Task 3.12. Run this group's verification (compile/run examples; greps on the group's files)

### Group 3 — Arrays, characters and pointers (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 4. Write the arrays (5), characters/strings (1) and pointers (1) pages
  - [x] Task 4.1. `arrays-fundamentals.adoc` ★
  - [x] Task 4.2. `allocatable-arrays-and-dynamic-memory.adoc` ★
  - [x] Task 4.3. `array-arguments-assumed-shape-size-and-rank.adoc`
  - [x] Task 4.4. `array-intrinsics-and-reductions.adoc`
  - [x] Task 4.5. `generic-and-rank-independent-programming.adoc`
  - [x] Task 4.6. `characters-and-strings.adoc` ★
  - [x] Task 4.7. `pointers-and-targets.adoc`
  - [x] Task 4.8. Run this group's verification

### Group 4 — Derived types, object orientation and input/output (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 5. Write the derived-type/OOP pages (5) and input/output pages (4)
  - [x] Task 5.1. `derived-types.adoc` ★
  - [x] Task 5.2. `parameterized-derived-types.adoc`
  - [x] Task 5.3. `object-oriented-programming.adoc` ★
  - [x] Task 5.4. `type-bound-procedures-abstract-types-and-finalization.adoc`
  - [x] Task 5.5. `enumerations.adoc`
  - [x] Task 5.6. `input-output-units-and-files.adoc` ★
  - [x] Task 5.7. `format-specifications-and-edit-descriptors.adoc`
  - [x] Task 5.8. `internal-files-namelist-and-non-advancing-io.adoc`
  - [x] Task 5.9. `derived-type-and-asynchronous-io.adoc`
  - [x] Task 5.10. Run this group's verification

### Group 5 — Intrinsics, numerics and parallel programming (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 6. Write the intrinsics/numerics/errors pages (5) and parallel programming pages (5)
  - [x] Task 6.1. `intrinsic-procedures-overview.adoc`
  - [x] Task 6.2. `numeric-model-bit-manipulation-and-conversion.adoc`
  - [x] Task 6.3. `intrinsic-modules-and-iso-fortran-env.adoc`
  - [x] Task 6.4. `floating-point-and-ieee-arithmetic.adoc` ★
  - [x] Task 6.5. `error-handling-and-program-termination.adoc`
  - [x] Task 6.6. `coarrays-images-and-synchronization.adoc` ★
  - [x] Task 6.7. `coarray-teams-events-collectives-and-atomics.adoc`
  - [x] Task 6.8. `do-concurrent-and-gpu-offload.adoc`
  - [x] Task 6.9. `openmp-and-openacc.adoc`
  - [x] Task 6.10. `mpi-with-mpi-f08.adoc`
  - [x] Task 6.11. Run this group's verification (coarray/OpenMP/MPI examples only where the toolchain from Task 1.1 supports them; otherwise labelled as checked against the docs)

### Group 6 — Interoperability and tooling (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 7. Write the interoperability pages (4) and tooling/ecosystem pages (7)
  - [x] Task 7.1. `interoperability-with-c.adoc` ★
  - [x] Task 7.2. `c-descriptors-and-iso-fortran-binding.adoc`
  - [x] Task 7.3. `calling-fortran-from-c-cpp-and-python.adoc`
  - [x] Task 7.4. `matlab-mex-engine-and-mat-file-apis.adoc` (documented from MathWorks R2026b pages; MEX code is not run — say so)
  - [x] Task 7.5. `compilers-and-compiler-options.adoc` ★
  - [x] Task 7.6. `building-with-make-cmake-and-meson.adoc`
  - [x] Task 7.7. `fortran-package-manager-fpm.adoc` ★
  - [x] Task 7.8. `fortran-stdlib.adoc`
  - [x] Task 7.9. `blas-lapack-and-numerical-libraries.adoc`
  - [x] Task 7.10. `testing-debugging-and-profiling.adoc`
  - [x] Task 7.11. `documentation-and-editor-tooling.adoc`
  - [x] Task 7.12. Run this group's verification

### Group 7 — Practice, modernization and evolution (Parallelizable: yes — same reasoning as Group 2)

- [x] Task 8. Write the practice and evolution pages (5)
  - [x] Task 8.1. `best-practices-and-style.adoc` ★
  - [x] Task 8.2. `common-gotchas-and-pitfalls.adoc`
  - [x] Task 8.3. `performance-and-memory-layout.adoc`
  - [x] Task 8.4. `legacy-features-and-modernization.adoc` ★ (collects book-outdated and errata notes; legacy code appears only here, labelled)
  - [x] Task 8.5. `whats-new-and-fortran-2028-preview.adoc` (collects book-outdated notes)
  - [x] Task 8.6. Run this group's verification

### Group 8 — Landing page, cheat sheet and PDF (Parallelizable: no — landing page and cheat sheet summarise every earlier page; the bibliography needs every source used)

- [x] Task 9. `index.adoc` landing page
  - [x] Task 9.1. Intro, version baseline, heatflow scenario, reading path, `== What's covered` grouped as the outline, Mermaid mind-map
  - [x] Task 9.2. `== Bibliography`: both books (publisher pages, re-verified), ISO/WG5/J3, fortran-lang and its projects, compiler manuals, OpenMP/OpenACC/MPI specs, interop and build-system docs, community tools (labelled); every source used on any page appears here
- [x] Task 10. Cheat sheet
  - [x] Task 10.1. `cheat-sheet.adoc` (disclaimer, intro with baseline/date and PDF xref, grouped `xref:` paragraphs to every page, final download line, `== References`; modelled on `go/cheat-sheet.adoc`)
  - [x] Task 10.2. Generate the one-page A4 PDF covering every concept in the issue's cheat-sheet list, with header "Fortran 2023" + date and the legacy → modern strip; verify exactly one page and preview as PNG; commit only the PDF
- [x] Task 11. Original `fortran-*.svg` figures not already created by page tasks; confirm every SVG is referenced and every 📊 is delivered

### Group 9 — Integration and back-links (Parallelizable: yes — disjoint files, none depends on another)

- [x] Task 12. `programming-languages/index.adoc`: Fortran Reference bullet after the Ruby/PHP bullets ending ", plus a downloadable cheat sheet."; `:description:`; `:keywords:` (Fortran, Fortran 2023, ISO/IEC 1539-1:2023, gfortran, ifx, LLVM Flang, fpm, coarrays, do concurrent, OpenMP, MPI, iso_c_binding, f2py, MEX); "live only here" sentence; root `index.adoc` description/keywords only if they list language references
- [x] Task 13. Back-links (one line each, `xref:` targets verified with `ls`)
  - [x] Task 13.1. `rust/numbers-and-numeric-computing.adoc` (`== Interop with existing numeric code`) and `rust/ffi-and-c-interop.adoc` (`== FFI in other languages on this site`)
  - [x] Task 13.2. `c/numbers-and-math.adoc` and `python/numbers.adoc` (`== See Also`)
  - [x] Task 13.3. `rust/data-parallelism-with-rayon.adoc` (`== Parallel numeric loops`)

### Group 10 — Verification, docs build and secrets (Parallelizable: no — runs on the finished section)

- [x] Task 14. Build and verify
  - [x] Task 14.1. `npm install` if needed, then `npx antora antora-playbook.yml`; zero xref/AsciiDoc errors or warnings; Fortran nav appears under Programming Languages
  - [x] Task 14.2. Run the `CLAUDE.md` greps (block/inline image closure, `<p>image::`, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/programming-languages/fortran`); all must print nothing
  - [x] Task 14.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`; every diagram parsed
  - [x] Task 14.4. Checks: 55 page files exist and match `nav-fortran.adoc`; no admonition other than the disclaimer; every `image::` target exists and every `fortran-*.svg` is referenced; no `xref:` to #196/#243/#244/#248/#275/#276 targets; no book content or book PDF committed
  - [x] Task 14.5. Run `/iru-check-security` (docs repo: detect-secrets findings in examples are expected false positives; update `.secrets.baseline` per repo practice)
- [x] Task 15. Final hygiene: review `git status` so only intended files are staged (nothing under `~/Desktop/libros`, no `.DS_Store`)
