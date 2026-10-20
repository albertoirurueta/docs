# Implementation Plan: Guides & References — "COBOL" (Programming Languages)

## Task summary

Source: GitHub issue #243
Base branch: main

Issue [#243](https://github.com/albertoirurueta/docs/issues/243) adds an Antora section
`modules/ROOT/pages/programming-languages/cobol/` (nav title **COBOL**): a detailed COBOL reference built on
**ISO/IEC 1989:2023**, **GnuCOBOL 3.2** (every portable example is compiled and run) and **IBM Enterprise COBOL for
z/OS 6.5** (z/OS pages). It has **57 pages** (including `index.adoc` with the Bibliography and `cheat-sheet.adoc`), the
`cobol-disclaimer.adoc` and `nav-cobol.adoc` partials, original `cobol-*.svg` figures and Mermaid diagrams, back-links
from five existing pages, a landing-page update, and a one-page A4 PDF `modules/ROOT/attachments/cobol-cheat-sheet.pdf`.
The running scenario is the original **Circulation** public-library back office (`BOOKMAST`, `MEMBMAST`, `LOANTRAN`,
copybooks `BOOKREC`/`MEMBREC`/`LOANREC`, a nightly batch run, and on z/OS a Db2 `LOAN` table and a CICS `CINQ` inquiry).

**The binding spec** is the issue body plus one comment (the page outline, split for GitHub's size limit). Local copy
(session scratchpad):
`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/8f3fc707-9ada-4fab-8538-87f7410759a2/scratchpad/issue243.txt`
(body, then `=====COMMENTS`, then the outline). Re-fetch with `gh issue view 243 --json body,comments` if missing.
**Every page task must re-read its own outline bullets** (★ depth, 📊 figures, source abbreviations
LR/PG/NEW/MG/GPG/GMAN/GQR/GSP/GFAQ/DB2/CICS/IMS/ZOS/OMP/ZOWE, "Taulli outdated/errata" notes) plus the issue's
"Concepts contributed by the book", "Where the book is outdated", "Book errata" and "Do not reproduce" tables.

### Choices made on the user's behalf

1. **One branch, one draft PR.** Branch `feature/243-add-cobol-section-programming-languages` (from `main`, base
   confirmed by the user), one draft PR to `main` with `Closes #243`. The issue suggests six PRs on
   `feature/243-cobol`; the groups below follow the outline so the work could still be cut that way.
2. **Tasks are untagged.** No documentation/COBOL coding key exists; the work is AsciiDoc/Mermaid/SVG/PDF authoring,
   implemented directly. COBOL code in pages is **compiled and run for real** in a scratch directory (never committed).
3. **Toolchain (Task 1).** `cobc` is not installed on the host, but Docker 29.8.1 is running. Following the Fortran
   (#277) and Visual Basic (#280) precedents, GnuCOBOL 3.2 is built/run in a throwaway container (for example
   `debian:stable` plus a source build of 3.2 from `ftp.gnu.org`, or a distro package that ships 3.2) with a scratchpad
   directory mounted; nothing is installed on the host and nothing is committed. **Task 1.1 confirms Docker use with
   the user before pulling or building anything.** z/OS-only code (JCL, IDCAMS, DFSORT, `EXEC SQL`, `EXEC CICS`, BMS,
   IMS, `VSAMDB`) cannot be run: it is checked statement by statement against the IBM docs and labelled
   "z/OS; not run here" in prose. Nobody signs in to or creates accounts on IBM Z Xplore on the user's behalf.
4. **Book.** `~/Desktop/libros/cobol/` EPUBs are copyrighted: consulted only for concept coverage, structure and the
   "book is outdated" prose; Taulli is cited by its O'Reilly publisher page; the Vickler book is excluded and mentioned
   in one sentence on `index.adoc` only. No text, listing, figure or sample is copied; nothing from them is committed.
5. **Disclaimer.** `cobol-disclaimer.adoc` is shaped exactly like `fortran-disclaimer.adoc`/`rust-disclaimer.adoc`
   (single `[IMPORTANT]` AI-assistance disclosure plus an xref to `programming-languages/cobol/index.adoc#_bibliography`).
   It is the **only** admonition in the section; every other remark is prose or a table row.
6. **Nav placement.** The issue requires `include::partial$nav-cobol.adoc[]` as the **last** include inside the
   Programming Languages open block, i.e. right after `nav-fortran.adoc` (currently `modules/ROOT/nav.adoc` line 36).
   `nav-cobol.adoc` is a relative-depth partial like `nav-fortran.adoc`: first line
   `* xref:programming-languages/cobol/index.adoc[COBOL]`, non-link `**` group headings with `***` children (the ten
   outline groups), ending with the `Cheat Sheet (PDF)` entry.
7. **Version baseline re-verified at implementation time and dated** (Task 1.2): ISO 1989:2023 and the 4th-edition DIS
   status, Enterprise COBOL 6.5 PTFs, GnuCOBOL 3.2 as latest, z/OS 3.2, Db2 13, CICS TS 6.x, IMS 15.6, Zowe 3.x, COBOL
   Check archive status, Test4z docs location, Rocket/Fujitsu doc URLs, and every URL in the issue's Bibliography. Pages
   that cannot be verified are worded without naming a release. iso.org/ibm.com pages that block scripted fetches are
   verified in the built-in browser.
8. **Cross-page xrefs.** Pages link to each other heavily, so per-group verification only checks syntax and the
   `CLAUDE.md` greps; **all `xref:` targets are verified by the full Antora build in Group 11**. Issues #196, #201, #275,
   #276, #277, #280 and #282 are mentioned in prose only (never `xref:`).
9. **Figures.** Every 📊 in the outline is delivered as Mermaid or an original `cobol-*.svg` (no IBM/vendor logos or
   documentation figures, no OMP course or book figures); every SVG is referenced by a page; every Mermaid block passes
   `npm run validate:mermaid` (stereotypes written as entities, `<` before a letter as `&lt;`).
10. **Cheat-sheet PDF** is rendered from a throwaway HTML page in the scratchpad with headless Chrome
    (`--headless --print-to-pdf --no-pdf-header-footer`), checked to be exactly one A4 page and previewed as PNG; only
    the PDF is committed.
11. **Highlighter.** The UI bundle may lack a `cobol` language; keep `[source,cobol]` regardless (render unhighlighted),
    checking once in Task 1.4.

### Current code state

- Repo is the Antora playbook plus the `ROOT` component; no application source. Build: `npm install` (node_modules
  present, Node v24), `npx antora antora-playbook.yml`; Mermaid check `npm run validate:mermaid` (after one-off
  `npm i --no-save mermaid@11 jsdom`).
- Project type `other` (documentation only). Repository host: GitHub (albertoirurueta/docs). Antora docs: repo root is
  component `ROOT`. No user interface.
- Precedent sections (structural templates): `programming-languages/fortran/` (55 pages; closest), `visual-basic/`, `go/`,
  `ruby/`; templates `partials/fortran-disclaimer.adoc`, `partials/nav-fortran.adoc`, `partials/nav-php.adoc`; cheat
  sheets `programming-languages/{fortran,php,rust}/cheat-sheet.adoc` with `modules/ROOT/attachments/*-cheat-sheet.pdf`;
  archived precedent plans `.archive/implementation_plan_{277,280,275,276}.md` (277 and 280 are closest).
- `modules/ROOT/pages/programming-languages/cobol/` and COBOL partials do not exist yet.
- Files to modify: `modules/ROOT/nav.adoc` (include after line 36), `modules/ROOT/pages/programming-languages/index.adoc`
  (`:description:` line 2, `:keywords:` line 3, "live only here" sentence line 8, a COBOL bullet after the Fortran bullet
  at ~line 87), `modules/ROOT/pages/index.adoc` (description/keywords only if they list language references), and the
  five back-link pages, all verified to exist:
  - `backend/architecture/decisions-and-migrations/migration-path-legacy-to-modern-stack.adoc` (new table row in
    `== Typical starting points and their modern targets`, linking prose to `modernization-strategies`)
  - `programming-languages/java/numbers-and-math.adoc` and `programming-languages/python/numbers.adoc` (`== See Also`)
  - `database/sql/index.adoc`
  - `programming-languages/rust/ffi-and-c-interop.adoc` (`== FFI in other languages on this site`)
- Images live flat in `modules/ROOT/images/` (bare filenames); attachments in `modules/ROOT/attachments/`.
  `.secrets.baseline` is updated by the security scan per repo practice (findings in this repo are false positives).

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$cobol-disclaimer.adoc[]`; intro states the
  baseline (ISO/IEC 1989:2023 with the feature's origin standard; GnuCOBOL 3.2 / Enterprise COBOL 6.5; z/OS 3.2, Db2 13,
  CICS TS 6.x or IMS 15.6 on mainframe pages).
- Each page: detailed explanation (what/why, syntax rewritten readably, every relevant clause/statement/register/
  function/option, pitfalls with real diagnostics, status codes, `SQLCODE`s, `RESP`s, abends, standard vs Enterprise vs
  GnuCOBOL differences with release of origin), "where the book is outdated" in prose for the concepts touched, and
  ends with `== References` listing only official online docs (and Taulli's publisher page where used).
- Examples: `[source,cobol]`, fixed reference format with IBM-compatible syntax unless the page says otherwise, complete
  program (or program + copybook) where practical; portable ones compile with `cobc -x -Wall` (plus `-std=ibm` where
  needed) **without warnings**, run, and show real output in `[source,text]`. Other tags: `bash`, `json`, `xml`, `sql`,
  `c`/`java`/`python`, `yaml`, `text` for JCL. **Each example is followed by `Source: <official URL>[label]`** (IBM links
  use pinned `SS6SG3_6.5` / `SSLTBW_3.2.0` / `SSEPEK_13.0.0` / `SSJL4D_6.x` paths; looked up, never guessed).
- Circulation scenario only; no real credentials, host names, user IDs or data-set qualifiers (use `USERID.CIRC.BOOKMAST`).
- No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks except the disclaimer include.
- Do not reproduce control-flow anti-patterns/obsolete elements outside `legacy-features-and-migration.adoc` (and a brief
  `GO TO` note in `perform-and-structured-programming.adoc`), each labelled "old code you may meet" with the modern form.
- AsciiDoc pitfalls (`CLAUDE.md`): inline code containing `*`, `**`, `*>`, `<=`, `>=`, `->`, `'`, `...`, `{`, `__`, `~`,
  `^` is written `` `+…+` ``; code containing `+` (PICTURE `+9(5)`, `COMPUTE A = B + C`, JCL `(+1)`, `SPACE=(TRK,(5,1))`)
  uses `` `pass:c[…]` `` with `]` as `\]`. Block `image::` macros on one line at column 0, alt text quoted if it has a
  comma, every SVG referenced.
- Per page verification (Task-level, run after writing): the three `image::` greps and the alt-comma grep from
  `CLAUDE.md` on the new files; confirm no admonition other than the disclaimer; run every portable example.

## Implementation steps

### Group 1 — Toolchain, baseline verification and shared assets (Parallelizable: no — everything else depends on the compiler, verified facts and shared copybooks)

- [x] Task 1. Prepare the toolchain, verify the version baseline and create the shared assets
  - [x] Task 1.1. Docker use to build GnuCOBOL 3.2 (image pulls and a source build in a container; nothing installed on
        the host) was **confirmed by the user in the planning session on 2026-10-20** ("Yes, use Docker"). Build a reusable throwaway image/container
        recipe in the scratchpad (for example `debian:stable` + `gnucobol` 3.2 source from `ftp.gnu.org`, with
        `libdb-dev`, `libgmp-dev`, `libncurses-dev` for indexed files, `-Wall`); write a `run-cobol.sh` helper in the
        scratchpad that compiles a file with `cobc -x -Wall [-std=ibm]` in the container and runs it, printing warnings.
        Check `cobc --version` reports 3.2.
        - Image `gnucobol32:scratch` (Dockerfile in scratchpad `docker/`), `cobc (GnuCOBOL) 3.2.0`; `run-cobol.sh [-std=ibm] file.cob` in the scratchpad.
  - [x] Task 1.2. Re-verify every version, date and URL in the issue's Bibliography and "Version baseline" (see choice 7)
        with `WebFetch`/the built-in browser; record a verification table (item, finding, date, URL, status) in the
        scratchpad `baseline.md`, flagging any item that moved (for example 6.5 PTFs, ISO 4th edition, Test4z URL, Rocket
        and Fujitsu docs, IBM Z Xplore) and the exact wording each page should use.
        - Scratchpad `baseline.md` (flags: Test4z docs, Rocket ED 11.0, Fujitsu V13, IMS/Zowe partial, COBOL Check archived 2026-05-28).
  - [x] Task 1.3. Create the shared *Circulation* assets in the scratchpad (never committed): copybooks
        `BOOKREC.cpy`, `MEMBREC.cpy`, `LOANREC.cpy`, sample data files (`BOOKMAST`, `MEMBMAST`, `LOANTRAN`), and a
        `scenario.md` fixing record layouts, field names and the nightly-run narrative so every page shows identical
        layouts. Compile a smoke program that reads them.
        - Scratchpad `circ/` (copybooks, BOOKMAST/MEMBMAST/LOANTRAN, scenario.md, smoke.cob compiled with -Wall and -std=ibm, no warnings).
  - [x] Task 1.4. Check that `[source,cobol]` renders in the site (build a one-page probe in a scratch copy or inspect the
        UI bundle's highlight.js languages) and record the result; keep `cobol` either way.
        - UI bundle has no cobol (nor fortran) highlighter: renders unhighlighted (`language-cobol`); keep `cobol`. See scratchpad `cobol-highlight-probe.md`.
  - [x] Task 1.5. Create `modules/ROOT/partials/cobol-disclaimer.adoc` (copy of `fortran-disclaimer.adoc` with the COBOL
        index xref) and an initial `modules/ROOT/partials/nav-cobol.adoc` skeleton following `nav-fortran.adoc`/
        `nav-php.adoc` (finalized in Group 10).
        - `modules/ROOT/partials/cobol-disclaimer.adoc`, `modules/ROOT/partials/nav-cobol.adoc` (skeleton: 10 groups, 57 xrefs; finalize in Group 10).

### Group 2 — Getting started and program structure (Parallelizable: yes — distinct new files; shared inputs already exist)

Outline sections "Getting started" and "Program structure"; `index.adoc` is written later in Group 10 because it lists
every page and the Bibliography.

- [x] Task 2. `getting-started.adoc` ★ (install GnuCOBOL 3.2 on macOS/Debian/Ubuntu/Windows/source; Hello world fixed and
      free; `cobc -x/-free/-j/-m/-std=/-Wall`, `cobcrun`; first Circulation program; free ways to try z/OS; reading `cobc`
      errors). 📊 SVG `cobol-gnucobol-pipeline.svg`.
- [x] Task 3. `history-and-standards.adoc` (CODASYL 1959 → COBOL 2023, 4th edition upcoming, WG4/INCITS, paywalled standard,
      dialects, Y2K). 📊 Mermaid timeline.
- [x] Task 4. `compilers-and-dialects.adoc` (IBM, GnuCOBOL `-std=` values and `.conf` files, Rocket, Fujitsu; feature-support
      table; conventions the examples follow).
- [x] Task 5. `mainframe-environment-primer.adoc` (z/OS, LPARs, data sets, TSO/ISPF, SDSF, JES2, USS, EBCDIC; developer's
      day). 📊 SVG `cobol-zos-system.svg`.
- [x] Task 6. `program-structure-and-divisions.adoc` ★ (four divisions, sections, `PROGRAM-ID` forms, `SPECIAL-NAMES`,
      `REPOSITORY`, nested programs, `STOP RUN`/`GOBACK`/`EXIT PROGRAM`). 📊 Mermaid hierarchy.
- [x] Task 7. `reference-format-fixed-and-free.adoc` ★ (areas, indicators, continuation, `*>`, free format, `-fformat=`). 📊 SVG
      `cobol-fixed-format-ruler.svg`.
- [x] Task 8. `words-literals-and-figurative-constants.adoc` (character set, reserved words, literal kinds, figurative
      constants).
- [x] Task 9. `copybooks-and-replace.adoc` (`COPY`/`REPLACING`/`REPLACE`, `SYSLIB` vs `cobc -I`/`COB_COPY_DIR`, Circulation
      copybooks, IEBCOPY remark).
- [x] Task 10. `compiler-directives-and-conditional-compilation.adoc` (`>>DEFINE/IF/EVALUATE/SET/TURN/CALL-CONVENTION`,
       `PROCESS`/`CBL`, 6.4 `DEFINE`/`CONDCOMP`, 6.5 `PUSH`/`POP`, `-D`, `>>D`).
- [x] Task 11. Verify Group 2: run all portable examples through the Task 1.1 helper (no warnings), apply the
       `CLAUDE.md` image/inline-code/alt-comma greps to the new files, check every cheat of the "Page conventions" list.
       Mermaid blocks of this group validated at Group 11 (or earlier by a scratch run of `npm run validate:mermaid`).

### Group 3 — Data division (Parallelizable: yes — nine distinct files)

- [x] Task 12. `data-division-and-level-numbers.adoc` ★ (sections, levels 01–49/66/77/88, `FILLER`, qualification and 6.5
       `::`, `GLOBAL`/`EXTERNAL`/`BASED`). 📊 SVG `cobol-record-layout.svg`.
- [x] Task 13. `picture-clause.adoc` ★ (every PICTURE symbol, editing, floating insertion, `BLANK WHEN ZERO`, `JUSTIFIED`,
       2023 `VALUE`/`EDITING`; input × picture × output table; Taulli `REDEFINES` erratum in prose).
- [x] Task 14. `usage-and-numeric-representation.adoc` ★ (DISPLAY/COMP-3/COMP/COMP-5/COMP-1/2/FLOAT-*/INDEX/POINTER/NATIONAL/
       UTF-8/`NO SIGN`, sizes, `SIGN SEPARATE`, `TRUNC`/`NUMPROC`, GnuCOBOL binary options, `HEX-OF`; binary-is-exact
       correction). 📊 SVG `cobol-numeric-bytes.svg`.
- [x] Task 15. `value-initialize-and-condition-names.adoc` (`VALUE`, 88-levels with `THRU`/`FALSE`, `SET … TO TRUE`,
       `INITIALIZE` forms, `INITCHECK`).
- [x] Task 16. `redefines-renames-and-typedef.adoc` (`REDEFINES`, `RENAMES`, `SYNCHRONIZED`, `TYPEDEF`/`TYPE`, 6.5 `STRONG`).
- [x] Task 17. `national-utf8-and-code-pages.adoc` (EBCDIC vs ASCII, collating sequence, `NATIONAL`, `UTF-8`/`PIC U`,
       `NATIONAL-OF`/`DISPLAY-OF`/`ULENGTH`/`USUBSTR`, `CODEPAGE`, GnuCOBOL UTF-8 experimental).
- [x] Task 18. `tables-and-occurs.adoc` ★ (`OCCURS`, multidimensional, subscripts vs indexes, `SET`, `OCCURS DEPENDING ON`,
       dynamic-capacity tables, loading tables, `SSRANGE`/bounds checks). 📊 SVG `cobol-table-storage.svg`.
- [x] Task 19. `searching-and-sorting-tables.adoc` (`SEARCH`, `SEARCH ALL`, table `SORT`, choosing serial/binary/keyed).
- [x] Task 20. `pointers-and-dynamic-storage.adoc` (`POINTER`, `ADDRESS OF`, `BASED`, `ALLOCATE`/`FREE`, procedure/function
       pointers, `POINTER-32`, `DYNAMIC LENGTH`).
- [x] Task 21. Verify Group 3 (same checks as Task 11).

### Group 4 — Procedure division (Parallelizable: yes — nine distinct files)

- [x] Task 22. `move-and-data-movement.adoc` ★ (MOVE legality table, truncation, `MOVE CORRESPONDING`, de-editing, `S0C7`,
       `NUMCHECK`/`INVDATA`).
- [x] Task 23. `arithmetic-and-compute.adoc` ★ (ADD/SUBTRACT/MULTIPLY/DIVIDE/COMPUTE, `ROUNDED [MODE]`, `ON SIZE ERROR`,
       `ARITH(EXTEND)`, fine calculation; links to Java `BigDecimal` and Python `decimal` pages).
- [x] Task 24. `conditions-if-and-evaluate.adoc` ★ (all condition kinds, abbreviated relations, `IF`/`EVALUATE`, stray period).
       📊 Mermaid `EVALUATE TRUE ALSO` decision flowchart.
- [x] Task 25. `perform-and-structured-programming.adoc` ★ (all `PERFORM` forms, `EXIT *`, `PERFORM UNTIL EXIT`, batch skeleton;
       brief "old code you may meet" for `GO TO`/`ALTER`). 📊 Mermaid main-line flowchart.
- [x] Task 26. `strings-string-unstring-inspect.adoc` (STRING/UNSTRING/INSPECT incl. `BACKWARD`, reference modification, CSV parsing).
- [x] Task 27. `intrinsic-functions.adoc` ★ (syntax, categories, one-line table of every Enterprise COBOL 6.5 and GnuCOBOL 3.2
       function marking vendor-specific ones; `NUMVAL*`, math, `LENGTH`). Cross-check the lists against the official indexes
       and `cobc --list-intrinsics` in the container.
- [x] Task 28. `dates-and-times.adoc` (`ACCEPT FROM DATE/DAY/TIME`, `CURRENT-DATE`, integer-date functions, formatted date functions,
       due date and days overdue, Y2K windowing as legacy).
- [x] Task 29. `accept-display-and-console-io.adoc` (`DISPLAY`/`ACCEPT` forms, `SYSIN`/`SYSOUT`/`PARM`, `SCREEN SECTION`, `CRT STATUS`).
- [x] Task 30. `error-handling-and-declaratives.adoc` ★ (conditional phrases, `DECLARATIVES`, exception conditions `EC-*`, `>>TURN`,
       `RETURN-CODE`, `STOP ERROR`).
- [x] Task 31. Verify Group 4 (same checks as Task 11).

### Group 5 — Files (Parallelizable: yes — seven distinct files; samples share the Task 1.3 data)

- [x] Task 32. `file-concepts-select-and-fd.adoc` ★ (file model, `SELECT`/`ASSIGN`/`ORGANIZATION`/`ACCESS`, `FD`, `OPEN`/`CLOSE`, DD name vs
       `DD_name` mapping). 📊 Mermaid program → FD → DD/env var → data set.
- [x] Task 33. `sequential-files.adoc` ★ (READ/WRITE/REWRITE/EXTEND, `LINE SEQUENTIAL`, variable-length records, **balance-line update**
       with a runnable program over `BOOKMAST`/`LOANTRAN`). 📊 Mermaid balance-line flowchart.
- [x] Task 34. `indexed-files-and-vsam.adoc` ★ (`RECORD KEY`, alternate keys, `START`/`READ`/`WRITE`/`REWRITE`/`DELETE`, VSAM KSDS/ESDS/RRDS/LDS,
       `IDCAMS DEFINE CLUSTER`, `VSAMDB`, GnuCOBOL back ends). 📊 SVG `cobol-ksds-structure.svg`.
- [x] Task 35. `relative-files.adoc`.
- [x] Task 36. `file-status-codes.adoc` (full status table, VSAM extension, reusable status-check paragraph/copybook).
- [x] Task 37. `sort-and-merge.adoc` ★ (`SD`, `SORT` forms, procedures with `RELEASE`/`RETURN`, `MERGE`, `FASTSRT`, DFSORT/ICETOOL).
       📊 Mermaid sort flow.
- [x] Task 38. `reports-and-report-writer.adoc` (print lines, `LINAGE`, single and multi-level control breaks, standard Report Writer in GnuCOBOL).
       📊 Mermaid two-level control-break flowchart.
- [x] Task 39. Verify Group 5 (same checks as Task 11; the file programs must run end to end on the sample data).
       - Verified 2026-10-20: all portable examples of Tasks 33, 36, 37, 38 compiled with `cobc -x -Wall` and `-std=ibm` with no warnings and run on the sample data; image/inline-code/alt-comma greps empty; no admonition besides the disclaimer; Antora build reports only forward xrefs (index bibliography, later-group pages); `npm run validate:mermaid` all parsed. Files: sequential-files, file-status-codes, sort-and-merge, reports-and-report-writer (.adoc).

### Group 6 — Modular programming and data interchange (Parallelizable: yes — six distinct files)

- [x] Task 40. `subprograms-call-and-linkage.adoc` ★ (static vs dynamic `CALL`, passing modes, `RETURNING`, `OMITTED`/`OPTIONAL`, `LINKAGE`,
       `IS INITIAL`/`RECURSIVE`, `cobc -m`). 📊 SVG `cobol-call-passing-modes.svg`.
- [x] Task 41. `user-defined-functions-and-prototypes.adoc`.
- [x] Task 42. `interoperability-with-c-java-and-python.adoc` (GnuCOBOL ↔ C and Python `ctypes` run for real; LE inter-language and 6.4/6.5 Java
       interop described from official docs; links to the C and Java references).
- [x] Task 43. `object-oriented-cobol.adoc`.
- [x] Task 44. `json-generate-and-parse.adoc` (`JSON GENERATE`/`PARSE` with all phrases; GnuCOBOL support checked in the container; `STRING`
       fallback; Circulation summary export).
- [x] Task 45. `xml-generate-and-parse.adoc`.
- [x] Task 46. Verify Group 6 (same checks as Task 11).

### Group 7 — Mainframe batch and middleware (Parallelizable: yes — six distinct files; none runnable, all checked against IBM docs)

- [x] Task 47. `jcl-for-cobol-programmers.adoc` ★ (JOB/EXEC/DD, GDGs, `IF/THEN/ELSE`, IBM compile procs, Circulation nightly job, Zowe submit/view).
       📊 SVG `cobol-nightly-job.svg`.
- [x] Task 48. `compiling-linking-and-language-environment.adoc` (compile/link flow, `cob2`, listings, option groups with 6.5 defaults, LE runtime options;
       GnuCOBOL counterpart `cobc` stages/`runtime.cfg`/`COB_*`, verified in the container).
- [x] Task 49. `datasets-and-mainframe-utilities.adoc`.
- [x] Task 50. `embedded-sql-and-db2.adoc` ★ (host/indicator variables, `INCLUDE SQLCA`/DCLGEN, cursors, program preparation, off-mainframe ESQL as labelled
       community tooling re-verified in Task 1.2). 📊 Mermaid program-preparation flowchart and cursor sequence diagram.
- [x] Task 51. `cics-online-programming.adoc` ★ (pseudo-conversational design, BMS, file/program control, `RESP`, translator, `CINQ` transaction).
       📊 Mermaid sequence diagram.
- [x] Task 52. `ims-dli-overview.adoc`. 📊 SVG `cobol-ims-hierarchy.svg`.
- [x] Task 53. Verify Group 7 (same checks as Task 11, plus statement-by-statement check of every z/OS example against the cited IBM page; each labelled "z/OS; not run here").

### Group 8 — Development practices (Parallelizable: yes — six distinct files)

- [x] Task 54. `modern-tooling-vs-code-and-zowe.adoc` ★ (Z Open Editor, COBOL Language Support, Zowe Explorer/CLI 3.x, IDz, Rocket, local GnuCOBOL VS Code task, Git for mainframe code).
  - Done: modern-tooling-vs-code-and-zowe.adoc; tasks.json + zowe.config.json validated as JSON, local build task command and problem-matcher regex run against real cobc output; no COBOL warnings.
- [x] Task 55. `debugging-and-troubleshooting.adoc` (GnuCOBOL `-g`/`--debug`/trace/`-fec`/`--coverage`; common abends and CEEDUMP reading; run the GnuCOBOL debugging examples).
  - Done: debugging-and-troubleshooting.adoc; LOANCHK/BADNUM/DBGLINE/COV compiled -Wall (+ -std=ibm) without warnings and run with -debug, -g -fec=bound, -ftrace/-ftraceall, COB_TRACE_FILE, --coverage+gcov.
- [x] Task 56. `testing-cobol-programs.adoc` ★ (runnable GnuCOBOL harness with a `Makefile`/script; zUnit, Test4z, Galasa; COBOL Check labelled archived May 2026).
  - Done: testing-cobol-programs.adoc; FINECALC + TESTFINE + Makefile harness run via make test (pass and deliberate-failure runs).
- [x] Task 57. `performance-and-compiler-options.adoc` (the Vickler volume is not used and its claims are not reproduced).
  - Done: performance-and-compiler-options.adoc; BENCH timed for DISPLAY/COMP-3/COMP/COMP-5, -O0/-O2, -fno-trunc; Vickler volume not used.
- [x] Task 58. `coding-standards-and-best-practices.adoc`.
  - Done: coding-standards-and-best-practices.adoc; VALLOAN compiled -Wall (+ -std=ibm) without warnings, run for good, reject and missing-file cases.
- [x] Task 59. `devops-and-ci-cd-for-cobol.adoc` (GitHub Actions workflow in `[source,yaml]`, validated syntactically; mainframe pipeline outline).
  - Done: devops-and-ci-cd-for-cobol.adoc; workflow passes actionlint and YAML parse; Mermaid parsed (26 diagrams in section).
- [x] Task 60. Verify Group 8 (same checks as Task 11).
  - Done: Group 8 verified: image/inline/alt greps clean, no admonitions, rendered-HTML substitution grep clean, Mermaid validated, xrefs checked (legacy-features-and-migration pending).

### Group 9 — Evolution and reference pages (Parallelizable: yes — three distinct files)

- [x] Task 61. `modernization-strategies.adoc` (options, strangler fig linked to the Backend migration page, watsonx Code Assistant for Z from official docs only, data migration concerns).
- [x] Task 62. `legacy-features-and-migration.adoc` (the only page that shows obsolete elements, each with the modern replacement; migration from OS/VS COBOL/COBOL II/4.2; IBM → GnuCOBOL moves).
- [x] Task 63. `whats-new-in-cobol.adoc` (2002/2014/2023, 6.3/6.4/6.5 incl. PTFs to Sept 2026 per Task 1.2, GnuCOBOL 3.2 and 4.0 status, the "where the book is outdated" table with every row from the issue).
- [x] Task 64. Verify Group 9 (same checks as Task 11).

### Group 10 — Landing page, nav, back-links (Parallelizable: no — `index.adoc` and the nav list every page, so all prior groups must have landed)

- [x] Task 65. Write `programming-languages/cobol/index.adoc`: what COBOL is, baseline in prose, the Circulation scenario, "New here? Read in this order", `== What's covered` by the ten groups,
       relationships to the C/Java/SQL/Backend-migration pages, the one-sentence Vickler exclusion, 📊 Mermaid mind-map, and `== Bibliography` (every source in the issue's Bibliography,
       each linked to its official site, grouped as in the issue; Taulli's list closes with the house-style note). Includes the disclaimer.
- [x] Task 66. Finalize `modules/ROOT/partials/nav-cobol.adoc`: one entry for each of the 57 pages in outline order, grouped under the ten non-link `**` headings with `***` children, ending with `Cheat Sheet (PDF)`.
- [x] Task 67. Edit `modules/ROOT/nav.adoc`: add `include::partial$nav-cobol.adoc[]` as the last include in the Programming Languages open block (after `nav-fortran.adoc`).
- [x] Task 68. Edit `programming-languages/index.adoc`: COBOL bullet after the Fortran bullet (names ISO/IEC 1989:2023, GnuCOBOL 3.2, Enterprise COBOL 6.5; ends ", plus a downloadable cheat sheet."), update `:description:`, append the issue's `:keywords:` terms, add COBOL to the "live only here" sentence. Edit `modules/ROOT/pages/index.adoc` only if it lists language references.
- [x] Task 69. Add the five back-links (one line each, real `xref:`s): the new "COBOL batch and CICS programs on a mainframe" row in `migration-path-legacy-to-modern-stack.adoc`; the `== See Also` lines in `java/numbers-and-math.adoc` and `python/numbers.adoc` → `arithmetic-and-compute`; the line in `database/sql/index.adoc` → `embedded-sql-and-db2`; the line in `rust/ffi-and-c-interop.adoc` → `interoperability-with-c-java-and-python`.

### Group 11 — Cheat sheet (Parallelizable: no — summarizes every page, so it follows Groups 2–10)

- [x] Task 70. Write `programming-languages/cobol/cheat-sheet.adoc` per the issue's "Cheat sheet" section (disclaimer include, intro linking `xref:attachment$cobol-cheat-sheet.pdf[downloadable PDF]` with the baseline and check date, grouped `*Group* --` paragraphs of `xref:`s to every page, the final download line, `== References`).
  - Files: `modules/ROOT/pages/programming-languages/cobol/cheat-sheet.adoc` (59 xrefs: every page; CLAUDE.md greps clean).
- [x] Task 71. Render `modules/ROOT/attachments/cobol-cheat-sheet.pdf`: a throwaway HTML page in the scratchpad, headless Chrome print-to-PDF, dense multi-column colour-coded layout covering every item in the issue's cheat-sheet list (toolchain, fixed-format ruler, skeleton, data division, PICTURE table, USAGE table with COMP-3 nibble diagram, tables, statements, errors, files and status codes, subprograms, JSON/XML, JCL, Db2, CICS, abends, tooling/testing, "legacy → modern" strip) and the header "COBOL 2023 · GnuCOBOL 3.2 · Enterprise COBOL 6.5" plus the date. Verify exactly one A4 page (Python PDF library, since `pdfinfo` may be missing) and preview as PNG; fix overflow. Commit only the PDF.
  - Files: `modules/ROOT/attachments/cobol-cheat-sheet.pdf` (one A4 landscape page, 5 columns, previewed as PNG; HTML kept in scratchpad).

### Group 12 — Build, validation and security (Parallelizable: no — verifies the finished whole)

- [x] Task 72. Run the full Antora build `npx antora antora-playbook.yml` (delegate to the `iru-gate-runner` agent so the log stays out of context); it must finish with no `xref`/AsciiDoc errors or warnings. Fix any broken xref, missing image or attachment.
- [x] Task 73. Run the `CLAUDE.md` verification greps (block `image::` not closed on the line; inline `image:` not closed; `<p>image::` in `build/site`; substitutions inside inline `<code>` for `build/site/.../programming-languages/cobol`; unquoted-comma alt text on changed files); all must print nothing. Check every `cobol-*.svg` is referenced and every `image::` target exists.
- [x] Task 74. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`; every diagram in the section must parse.
- [x] Task 75. Check admonitions (only the disclaimer include exists in the section), that no `xref:` targets #196/#201/#275/#276/#277/#280/#282-style non-pages, that no book text/EPUB is present, and open the built section in the browser pane (nav under Programming Languages, a ★ page, the cheat-sheet page and PDF link, a Mermaid diagram) taking a screenshot.
- [x] Task 76. Run `/iru-check-security` (detect-secrets; findings here are false positives per repo practice, labelled `is_secret: false`) and update `.secrets.baseline`.
- [x] Task 77. Final pass over the issue's acceptance-criteria checklist (page counts per group: 5/5/9/9/7/4/2/6/6/4 = 57, every row of the book concept table covered in its "Goes to" page, every example followed by a `Source:` link, every page with `== References`), then summarize remaining caveats (z/OS examples not run, PTF/version drift) for the PR description.
