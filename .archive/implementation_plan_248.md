# Implementation Plan: Guides & References — "MATLAB" (Programming Languages)

## Task summary

Source: GitHub issue #248
Base branch: main

Issue [#248](https://github.com/albertoirurueta/docs/issues/248) adds an Antora section
`modules/ROOT/pages/programming-languages/matlab/` (nav title **MATLAB**): a detailed, learning-oriented reference for the
MATLAB language targeting **MATLAB R2026b** (announced 2026-09-28). Base MATLAB only; add-on toolboxes and Simulink are only
listed, with a short description and links, on `toolboxes-and-add-on-products.adoc`. It has **85 pages** (including
`index.adoc` with the Bibliography, `toolboxes-and-add-on-products.adoc` and `cheat-sheet.adoc`), the `matlab-disclaimer.adoc` and
`nav-matlab.adoc` partials, original `matlab-*.svg` figures and Mermaid diagrams, three back-links, a landing-page update and a
one-page A4 PDF `modules/ROOT/attachments/matlab-cheat-sheet.pdf`. The running scenario is the original **heatflow** domain
(2-D heat diffusion on a plate: `+heatflow` namespace with `Plate`, `BoundaryKind`, `Simulation`, a sparse 5-point system solved
with `\`, `sensors.csv` thermocouple log, `plate.json`, tests, `buildfile.m`, `mpackage.json`, an App Designer viewer, Python
interop and a C++ MEX kernel).

**The binding spec** is the issue body plus one comment (the 85-page outline, split for GitHub's size limit,
https://github.com/albertoirurueta/docs/issues/248#issuecomment-6123819890). Local copies (session scratchpad):
`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/75e74e1e-fb6d-4225-b674-5b239a4f7109/scratchpad/body.md`
(issue body: Official documentation inventory, Version baseline, Page conventions, Toolboxes page, Cheat sheet, Bibliography,
Acceptance criteria) and `.../scratchpad/comment.md` (outline plus the books' concept table). Re-fetch with
`gh issue view 248 --json body,comments` if missing. **Every page task must re-read its own outline bullets** (★ depth, 📊 figures,
Sources lines) plus the body's "Official documentation inventory", "Version baseline", "Where the books are outdated" and
"Page conventions" sections before writing.

### Choices made on the user's behalf

1. **One branch, one draft PR.** Branch `feature/248-add-matlab-language-reference` (from `main`, base confirmed by the user), one
   draft PR to `main` with `Closes #248`. Confirmed by the user. The groups follow the outline so the work could still be cut into the
   issue's seven suggested PRs.
2. **Tasks are untagged.** No documentation or MATLAB coding key exists; the work is AsciiDoc/Mermaid/SVG/PDF authoring, implemented
   directly.
3. **Example verification (confirmed by the user).** MATLAB R2026b is not installed and cannot be installed or signed into by the
   agent. Examples that are valid in GNU Octave run in a throwaway Docker container (Octave image, scratchpad directory mounted,
   nothing installed on the host, nothing committed) and their captured output is shown. Everything Octave cannot run (`arguments`
   blocks, `classdef` features, `dictionary`, tables/timetables, `buildtool`, `matlab.unittest`, App Designer, live scripts, MEX,
   Python/Engine, projects/MPM, R2026b features) is checked line by line against the R2026b documentation and labelled in prose
   ("not run here" / output shown is illustrative, as the issue allows for fragments). No fabricated output is presented as captured.
4. **Highlighter (confirmed by the user).** The UI bundle's highlight.js has no MATLAB grammar, so code blocks use `[source,matlab]`
   and render unhighlighted today (as COBOL and R do). The PR description notes it.
5. **Books.** The two PDFs in `~/Desktop/libros/matlab/` are outside the session folders and copyrighted. They are consulted for
   concept coverage only via the concept table in the outline comment; no text, listing or figure is copied. Official publisher /
   Lulu / retailer links go in the Bibliography.
6. **Disclaimer.** `matlab-disclaimer.adoc` is shaped exactly like `rust-disclaimer.adoc` (single `[IMPORTANT]` AI-assistance
   disclosure plus an xref to `programming-languages/matlab/index.adoc#_bibliography`). It is the **only** admonition in the section;
   release notes, beta remarks, "needs a toolbox", Octave differences and "the book is outdated" remarks are prose or table rows.
7. **Nav placement.** `include::partial$nav-matlab.adoc[]` is the **last** include inside the Programming Languages open block,
   after `nav-r.adoc` (currently `modules/ROOT/nav.adoc` line 38, before the closing `--`). `nav-matlab.adoc` is a relative-depth
   partial like `nav-php.adoc`/`nav-r.adoc`: first line `* xref:programming-languages/matlab/index.adoc[MATLAB]`, then non-link `**`
   group headings with `***` children (the 15 outline groups), ending with the toolboxes page and `Cheat Sheet (PDF)`.
8. **Version baseline re-verified at implementation time and dated** (Task 1): the R2026b / R2027a status, the version-baseline
   table (including the six rows flagged "from memory": R2014b, R2016b, R2017a, R2019b, R2020b, R2021a), every Bibliography URL and
   every doc URL used in a `Source:` line. MathWorks blocks scripted fetches, so URLs are verified in the built-in browser.
9. **Cross-page xrefs.** Pages link to each other heavily, so per-group verification only checks syntax and the `CLAUDE.md` greps;
   **all `xref:` targets are verified by the full Antora build in Group 17**. Issues #196, #243, #244, #245, #275, #276, #277, #280
   and #282 are mentioned in prose only (never `xref:`), as the acceptance criteria require.
10. **Figures.** Every 📊 in the outline is delivered as Mermaid or an original `matlab-*.svg` (no MathWorks logos or doc figures).
    Every SVG is referenced by a page; every Mermaid block passes `npm run validate:mermaid` (stereotypes as entities, `<` before a
    letter written as `&lt;`). Figures produced by plotting code (`exportgraphics`) cannot be generated without MATLAB, so SVGs are
    hand-authored from the data the example computes.
11. **Cheat-sheet PDF** is rendered from a throwaway HTML page in the scratchpad with headless Chrome (A4, one page) and committed
    only as the PDF, as in the R/COBOL precedents.
12. **Ordering inside groups.** Pages in a group are different files and are marked `Parallelizable: yes`; shared files
    (`index.adoc` Bibliography, nav partial, `nav.adoc`, landing page, back-links, `.secrets.baseline`) are touched only in Groups
    15 to 17.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/partials/matlab-disclaimer.adoc` and `nav-matlab.adoc` exist, following the `rust-disclaimer.adoc` and `nav-php.adoc` templates." | Task 2, Task 90 |
| 2 | "`nav.adoc` includes `nav-matlab.adoc` inside the Programming Languages open block, as its last include." | Task 91 |
| 3 | "`programming-languages/index.adoc` has a **MATLAB** bullet, and its `:description:`/`:keywords:` and 'live only here' sentence are updated." | Task 92 |
| 4 | "Every page in the outline comment exists under `modules/ROOT/pages/programming-languages/matlab/` (85 pages)" | Tasks 3 to 87, Task 94 |
| 5 | "`toolboxes-and-add-on-products.adoc` exists and lists the products described in **Toolboxes page**, each with a brief description and links ..., and nothing more." | Task 85 |
| 6 | "Every row of the official documentation inventory table is covered ... Every row of the books' concept table is covered." | Tasks 3 to 87, Task 96 |
| 7 | "Every change in the version-baseline table appears, with its release, on the relevant page and on `whats-new-and-migrating-older-code.adoc`." | Task 1, Task 83, Task 96 |
| 8 | "Every ★ page has **detailed** content" | Tasks marked ★ in Groups 2 to 15, Task 96 |
| 9 | "No page documents a toolbox function. Toolbox needs are stated in prose and link to the toolboxes page." | Tasks 3 to 87, Task 96 |
| 10 | "Every code example runs on MATLAB R2026b with base MATLAB only (or is clearly marked as a fragment or 'not run here'), shows real output, ... and is **followed by a link to the official documentation page it derives from**." | Task 1, Tasks 3 to 87 |
| 11 | "Examples follow the *heatflow* running scenario and contain no real secrets." | Tasks 3 to 87, Task 97 |
| 12 | "Outdated forms from the books are documented in prose or tables with releases, never reproduced as recommended code. No book text, listing or figure is reproduced." | Task 83, Tasks 3 to 87 |
| 13 | "Mermaid diagrams and `matlab-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`. Every SVG is referenced by a page" | Tasks 3 to 87, Task 96 |
| 14 | "The disclaimer partial is included on every page of the section. It is the **only** admonition in the section" | Task 2, Tasks 3 to 87, Task 96 |
| 15 | "The landing page's `== Bibliography` lists every source used ... Each page has a `== References` section." | Task 3, Task 90, Tasks 3 to 87 |
| 16 | "`cheat-sheet.adoc` links `modules/ROOT/attachments/matlab-cheat-sheet.pdf`." | Task 87, Task 93 |
| 17 | "The PDF is a **single-page** A4 summary of every concept ... including the 'legacy → modern' strip." | Task 93 |
| 18 | "The back-links listed above are added." | Task 95 |
| 19 | "No `xref:` points to a page that doesn't exist: #196, #243, #244, #245, #275, #276, #277, #280 and #282 are referenced in prose only." | Task 96 |
| 20 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings, and the `CLAUDE.md` image, inline-code and Mermaid checks print nothing" | Task 96, Task 97 |

## Current code state

- Repo is the Antora playbook and `ROOT` component (`antora.yml`, `antora-playbook.yml`, `modules/ROOT`); no application code.
  Build: `npx antora antora-playbook.yml` into `build/site`; `npm run validate:mermaid` after
  `npm i --no-save mermaid@11 jsdom`. CI deploys `build/site` to `gh-pages`.
- Sibling language sections under `modules/ROOT/pages/programming-languages/{c,cobol,cpp,csharp,fortran,go,groovy,java,javascript,
  jvm-build-tools,kotlin,objective-c,php,python,r,ruby,rust,scala,swift,typescript,visual-basic}/` and
  `programming-languages/index.adoc`. `matlab/` does not exist yet.
- Templates: `modules/ROOT/partials/rust-disclaimer.adoc` and `cobol-disclaimer.adoc`; `nav-php.adoc` and `nav-r.adoc`;
  `programming-languages/r/cheat-sheet.adoc` and `rust/cheat-sheet.adoc`; the most recent whole-section plans
  `.archive/implementation_plan_282.md` (R), `_243.md` (COBOL), `_280.md` (VB).
- `modules/ROOT/nav.adoc` lines 25 to 39 hold the Programming Languages open block ending with `include::partial$nav-r.adoc[]`;
  `programming-languages/index.adoc` line 91 already mentions MATLAB (MEX) under Fortran.
- Images go in `modules/ROOT/images/` referenced by bare filename; the CLAUDE.md rules on image macros, inline-code passthroughs
  and Mermaid entities apply to every page.
- Tooling: Docker (`/usr/local/bin/docker`) and Node 24 are available; MATLAB and Octave are not installed on the host.

## Implementation steps

Conventions applying to every page task below (not repeated): file in `modules/ROOT/pages/programming-languages/matlab/`; header
attributes (`:description:`, `:keywords:`) in the style of `r/` pages, then `include::partial$matlab-disclaimer.adoc[]`; code in
`[source,matlab]`; each example followed by a `Source:` link to the official R2026b doc page it derives from; heatflow scenario
where it fits; releases stated in prose or table rows; release-specific facts from the version-baseline table; a prose note where
the books' forms are outdated; no toolbox functions (toolbox needs linked to the toolboxes page in prose); `== See Also` and
`== References` sections; ★ pages are the most detailed (rationale, all relevant functions and arguments, error identifiers,
pitfalls, complete examples); 📊 per outline as Mermaid or `matlab-*.svg`. Per page: write it, run Octave-compatible examples in
Docker, run the `CLAUDE.md` greps on the page.

### Group 1 — Foundation (Parallelizable: no — everything else depends on the toolchain, baseline and partial)

- [x] Task 1. Toolchain and version baseline
  - [x] Task 1.1. Re-read `body.md` and `comment.md`; re-verify R2026b / R2027a status, the version-baseline table (esp. the six
    unchecked rows) and the doc/product URLs in the built-in browser; record the dated results in the scratchpad.
  - [x] Task 1.2. Build a throwaway Octave Docker image/container and a run script in the scratchpad that executes a snippet file
    and captures output; confirm Octave version for the `gnu-octave-compatibility` page (issue says 11.3.0, 2026-06-01).
  - [x] Task 1.3. Write a `verify-page.sh` in the scratchpad running the CLAUDE.md greps (image macros, inline code, unquoted
    comma alt text) on given files.
- [x] Task 2. Create `modules/ROOT/partials/matlab-disclaimer.adoc` (copy of `rust-disclaimer.adoc` shape; bibliography xref to
  `programming-languages/matlab/index.adoc#_bibliography`)
  - Done: file created (matches rust-disclaimer shape). Group 1 scratchpad artifacts: `scratchpad/version-baseline-verified.md`, `scratchpad/octave/run-octave.sh` (Octave 11.3.0, amd64 image), `scratchpad/verify-page.sh`.

### Group 2 — Getting started (Parallelizable: yes — distinct files)

- [x] Task 3. `index.adoc` landing page skeleton: scenario overview (heatflow), section map, version baseline table, terminology
  trap (package/toolbox), `== Bibliography` filled in Task 90, `== References` — written last (content in Task 90)
- [x] Task 4. ★ `getting-started.adoc` (what MATLAB is, LINPACK/EISPACK history, installing and licensing, MATLAB Online/Drive,
  the new R2025a desktop)
- [x] Task 5. `design-philosophy-and-coming-from-other-languages.adoc` (Python/NumPy, R, Julia, Fortran, C mapping; link to
  `python/numbers.adoc`)
- [x] Task 6. `desktop-and-command-window.adoc`
- [x] Task 7. `getting-help-and-documentation.adoc`
- [x] Task 8. `workspace-variables-and-mat-files.adoc`
- [x] Task 9. `search-path-startup-and-files.adoc`

### Group 3 — Language fundamentals (Parallelizable: yes)

- [x] Task 10. ★ `syntax-statements-and-variables.adoc`
- [x] Task 11. ★ `matrices-and-arrays.adoc`
- [x] Task 12. ★ `indexing.adoc`
- [x] Task 13. ★ `operators-and-precedence.adoc`
- [x] Task 14. `logical-type-and-conditions.adoc`
- [x] Task 15. ★ `implicit-expansion-and-compatible-sizes.adoc`
- [x] Task 16. `comma-separated-lists.adoc`

### Group 4 — Data types (Parallelizable: yes)

- [x] Task 17. ★ `numeric-types-and-floating-point.adoc`
- [x] Task 18. ★ `strings-and-character-arrays.adoc`
- [x] Task 19. `regular-expressions-and-patterns.adoc`
- [x] Task 20. ★ `cell-arrays.adoc`
- [x] Task 21. ★ `structures.adoc`
- [x] Task 22. ★ `tables.adoc`
- [x] Task 23. `timetables.adoc`
- [x] Task 24. ★ `dates-and-times.adoc`
- [x] Task 25. `categorical-arrays.adoc`
- [x] Task 26. `dictionaries-and-containers-map.adoc`
- [x] Task 27. `missing-data.adoc`
- [x] Task 28. `type-identification-and-conversion.adoc`
- [x] Task 29. `sets-and-sorting.adoc`

### Group 5 — Control flow, scripts and functions (Parallelizable: yes)

- [x] Task 30. ★ `control-flow.adoc`
- [x] Task 31. ★ `scripts-and-code-sections.adoc`
- [x] Task 32. ★ `functions.adoc`
- [x] Task 33. `local-nested-and-private-functions.adoc`
- [x] Task 34. ★ `anonymous-functions-and-function-handles.adoc`
- [x] Task 35. ★ `argument-validation.adoc`
- [x] Task 36. `variable-number-of-arguments.adoc`
- [x] Task 37. `workspaces-scope-global-and-persistent.adoc`
- [x] Task 38. `function-precedence-and-name-resolution.adoc`
- [x] Task 39. `eval-and-its-alternatives.adoc`

### Group 6 — Errors, debugging and code quality (Parallelizable: yes)

- [x] Task 40. ★ `errors-warnings-and-exceptions.adoc` (7 Octave runs g6_err_01..08; MException and cancel not run here; verified incl. rendered HTML and Mermaid)
- [x] Task 41. ★ `debugging.adoc` (done: 2 Octave debug sessions run via piped stdin, MATLAB sessions marked not run here; verify-page incl. rendered HTML, Mermaid parsed)
- [x] Task 42. `code-analyzer-and-code-quality.adoc` (done: g6_ca_1..3 Octave runs, 1 Mermaid figure, verify-page + rendered HTML clean; xrefs to later-group pages pending)
- [x] Task 43. `help-text-and-documenting-code.adoc` (written; Octave g6_help_run ran; verify-page and rendered HTML clean; only later-group xrefs pending)
- [x] Task 44. `secrets-and-protecting-code.adoc` (placeholder secrets only)
  - Done: vault/loadenv/importSecrets/env vars, pcode, obfuscateNames; one Octave run (g6_sec_env.m); verify-page + rendered HTML clean; xrefs to later-group pages pending.

### Group 7 — Object-oriented programming (Parallelizable: yes)

- [x] Task 45. ★ `classdef-basics.adoc`
- [x] Task 46. ★ `value-and-handle-classes.adoc`
- [x] Task 47. `properties-and-methods.adoc`
- [x] Task 48. `inheritance-and-abstract-classes.adoc`
- [x] Task 49. `events-and-listeners.adoc`
- [x] Task 50. `enumerations.adoc`
- [x] Task 51. `namespaces-and-class-folders.adoc`
- [x] Task 52. `object-arrays-customization-and-introspection.adoc`

### Group 8 — Graphics (Parallelizable: yes)

- [x] Task 53. ★ `plotting-2d.adoc` -- 2-D plotting; figure matlab-sensor-time-series.svg (hand-authored from Octave-computed data); Octave structure checks run; verify-page.sh clean on source and rendered HTML
- [x] Task 54. `plotting-3d-and-surfaces.adoc` -- 3-D plotting; figure matlab-temperature-field.svg (hand-authored from Octave contourc data); Octave grid/gradient/sphere checks run; verify-page.sh clean on source and rendered HTML
- [x] Task 55. `graphics-objects-and-customization.adoc` -- graphics hierarchy Mermaid (validated); Octave handle-structure check run; verify-page.sh clean on source and rendered HTML
- [x] Task 56. `exporting-figures-and-images.adoc` -- exportgraphics/print/savefig and image I/O; Octave imwrite/imread/imfinfo round trip run; verify-page.sh clean on source and rendered HTML (only expected xref to a later-group page)

### Group 9 — Data import and export (Parallelizable: yes)

- [x] Task 57. ★ `reading-and-writing-tabular-data.adoc`
- [x] Task 58. `low-level-file-io-and-the-file-system.adoc`
- [x] Task 59. `json-xml-and-web-access.adoc`
- [x] Task 60. `large-data-datastores-and-tall-arrays.adoc`

### Group 10 — Mathematics (Parallelizable: yes)

- [x] Task 61. ★ `linear-algebra.adoc`
- [x] Task 62. `sparse-matrices-and-graphs.adoc`
- [x] Task 63. `elementary-math-polynomials-and-interpolation.adoc`
- [x] Task 64. `random-numbers-and-reproducibility.adoc`
- [x] Task 65. `descriptive-statistics-and-preprocessing.adoc`
- [x] Task 66. `integration-odes-and-optimization.adoc`
- [x] Task 67. `fourier-analysis.adoc`

### Group 11 — Performance, testing and build (Parallelizable: yes)

- [x] Task 68. ★ `vectorization-and-preallocation.adoc`
- [x] Task 69. `profiling-and-timing.adoc`
- [x] Task 70. `background-and-asynchronous-execution.adoc`
- [x] Task 71. ★ `unit-testing-with-matlab-unittest.adoc`
- [x] Task 72. `test-fixtures-parameterization-and-mocking.adoc`
- [x] Task 73. ★ `build-automation-with-buildtool.adoc`
- [x] Task 74. `continuous-integration.adoc`

### Group 12 — Interfaces with other languages (Parallelizable: yes)

- [x] Task 75. ★ `calling-python-from-matlab.adoc` (link to `rust/python-interop-with-pyo3.adoc`)
- [x] Task 76. `matlab-engine-api-for-python.adoc`
- [x] Task 77. `c-cpp-libraries-and-mex.adoc` (links to C/C++ pages; #277 in prose)
- [x] Task 78. `java-dotnet-and-system-commands.adoc`

### Group 13 — Live scripts, apps and sharing (Parallelizable: yes)

- [x] Task 79. ★ `live-scripts-and-the-live-editor.adoc`
- [x] Task 80. `building-apps-with-app-designer.adoc`
- [x] Task 81. `projects-and-source-control.adoc`
- [x] Task 82. ★ `packages-and-the-matlab-package-manager.adoc` (terminology timeline figure)
  - Group 13 done: pages verified (verify-page.sh clean on sources and rendered HTML); timeline figure matlab-package-terminology-timeline.svg; xref to toolboxes-and-add-on-products pending a later group.

### Group 14 — Practice and reference (Parallelizable: yes)

- [x] Task 83. ★ `whats-new-and-migrating-older-code.adoc` (every version-baseline row and every "books outdated" row; Mermaid timeline)
- [x] Task 84. `coding-style-and-idioms.adoc` and `gnu-octave-compatibility.adoc` (Octave examples run in Docker; Octave
  documentation labelled third-party)
- [x] Task 85. ★ `toolboxes-and-add-on-products.adoc` (brief description plus official links only, per the issue's Toolboxes page)

- [x] Task 86. Cross-page sweep: re-read each group's pages for the books' concept table (outline comment) and the inventory
  table; add any missing row to its target page
- [x] Task 87. `cheat-sheet.adoc` (links `matlab-cheat-sheet.pdf`, includes the disclaimer, per the Cheat sheet section of the body)

### Group 15 — Figures (Parallelizable: yes)

- [x] Task 88. Author the `matlab-*.svg` figures for every 📊 not delivered as Mermaid (column-major storage, indexing, implicit
  expansion, value vs handle, namespace/package terminology timeline, heatflow grid and stencil, etc.), with accessible `<title>`
  and quoted alt text where it has commas; reference each from its page
  - Audit: every outline marker maps to a Mermaid block or existing matlab-*.svg; only the missing heatflow grid-and-stencil figure added (matlab-heatflow-grid-stencil.svg, vectorization-and-preallocation.adoc). Clipped text fixed in matlab-sparse-csc-storage.svg and matlab-sparse-spy-laplacian.svg.
- [x] Task 89. Validate Mermaid blocks with `npm run validate:mermaid`; fix stereotype and `<` entities
  - `npm run validate:mermaid`: all 2236 diagrams parsed; sample of 8 built pages rendered svg, no Syntax error.

### Group 16 — Landing page, bibliography, nav and integration (Parallelizable: no — shared files)

- [x] Task 90. Finish `index.adoc`: `== Bibliography` (MathWorks docs, learning resources, history paper, both books with publisher /
      - Done: index.adoc Bibliography rebuilt (871 cited MathWorks topics grouped by section group, books, history, Octave, specs) + partials/nav-matlab.adoc (85 entries); verify-page clean, scratch build clean.
  Lulu / retailer links, GNU Octave, specifications), section map, scenario; create `modules/ROOT/partials/nav-matlab.adoc` (labels
  from the page titles)
- [x] Task 91. Add `include::partial$nav-matlab.adoc[]` as the last include in the Programming Languages block of
      - Done: nav.adoc: include after nav-r.adoc.
  `modules/ROOT/nav.adoc`
- [x] Task 92. Update `programming-languages/index.adoc`: MATLAB bullet, `:description:`, `:keywords:`, "live only here" sentence;
      - Done: programming-languages/index.adoc bullet/description/keywords/sentence; root index.adoc keywords.
  update root `modules/ROOT/pages/index.adoc` `:description:`/`:keywords:` if it lists the language references
- [x] Task 93. Render `modules/ROOT/attachments/matlab-cheat-sheet.pdf` (single A4 page, every concept, legacy → modern strip) from
      - Done: matlab-cheat-sheet.pdf, 1 page A4 landscape, 233,828 bytes, headless Chrome.
  HTML with headless Chrome; confirm one page with `pdfinfo`/page count
- [x] Task 94. Count the pages: exactly 85 `.adoc` files in the folder, 6 getting-started + `index.adoc`, group counts matching the
      - Done: 85 .adoc files = 6 getting-started + index + 78 others; groups match index.
  issue
- [x] Task 95. Back-links: one line each in `python/numbers.adoc` (`== See Also`), `rust/numbers-and-numeric-computing.adoc`
      - Done: back-links added in python/numbers, rust/numbers-and-numeric-computing, rust/ffi-and-c-interop.
  (`== The scientific ecosystem`), `rust/ffi-and-c-interop.adoc` (`== FFI in other languages on this site`)

### Group 17 — Verification and wrap-up (Parallelizable: no — depends on everything)

- [x] Task 96. Build and verify
  - [x] Task 96.1. `npx antora antora-playbook.yml`: no `xref`/AsciiDoc errors or warnings; MATLAB appears under Programming Languages
    in the built nav
  - [x] Task 96.2. Run the CLAUDE.md greps (block and inline image macros, `<p>image::`, inline-code substitutions on
    `build/site/.../programming-languages/matlab`, alt-text commas on the changed `.adoc` files) and confirm each prints nothing
  - [x] Task 96.3. Check every SVG is referenced and every `image::` target exists; check the disclaimer is the only admonition
    (`grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'`); check no `xref:` to the issues' unwritten pages; scan the rendered text
    for stray backticks, `+`, `[[x]]` defects (per the rendered-HTML scan memory)
  - [x] Task 96.4. Final pass over the acceptance criteria: ★ page depth, inventory rows, books' concept rows, version-baseline rows
- [x] Task 97. Secrets: run `/iru-check-security`; update `.secrets.baseline` (docs-repo findings are false positives)
- [x] Task 98. Documentation update via `/iru-update-docs` is not needed (this change is the documentation); skip and note

## Notes for the executor

- Do not run examples on the host; use the scratchpad Docker run script from Task 1.2.
- Never create a MathWorks account or enter credentials; the built-in browser is for read-only URL checks.
- Commit order follows the groups; `.archive/implementation_plan_248.md` is produced by `iru-code` when the plan completes.
