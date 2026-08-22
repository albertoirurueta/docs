# Implementation Plan: Add official-documentation links to the SQL reference section

## Task summary

Source: GitHub issue #12

Issue [#12](https://github.com/albertoirurueta/docs/issues/12) ("Add links to official documentation for SQL
reference") asks that the SQL reference pages under `modules/ROOT/pages/sql/` link out to the official standard
SQL documentation (ISO/IEC 9075, jointly maintained by ISO and ANSI) for the statements/functions/clauses they
document — the same kind of enrichment `.archive/implementation_plan_9.md` (issue #9) already did for the HTML &
CSS appendix pages using per-item MDN links.

**Key difference from the #9 precedent, and the choice made based on it (confirmed with the user):** MDN
publishes a free, canonical page *per* HTML element/CSS property, which is what made per-item linking valuable
there. ISO/IEC 9075 has **no free per-statement equivalent** — it is sold as ~16 separate Parts (e.g. Part 2
"Foundation" alone covers nearly all core-language features: DDL, DML, transactions, DCL, functions, window
functions). Linking every individual heading would therefore repeat the *identical* Part-level URL dozens of
times per page, unlike MDN's genuinely distinct per-item targets. After presenting this finding, the user chose:

- **Page-level links only.** Each page's own intro paragraph gets one sentence naming and linking the specific
  ISO/IEC 9075 Part that defines its content (mirroring the existing style already used for the WHATWG/W3C
  spec-level link in the HTML/CSS appendix intros: "For the authoritative (if less readable) specification, see
  the `<link>`."). No link is repeated after every subsection/heading.
- **The shared disclaimer partial** (`modules/ROOT/partials/sql-disclaimer.adoc`, included at the top of every
  SQL page) gets the standard's own existing "ISO/IEC 9075" mention turned into a link to the Part 1 (Framework)
  overview page, plus one added sentence naming the ANSI webstore as the US distributor — satisfying the issue's
  mention of both ISO and ANSI sources exactly once, instead of repeating it on every page.
- **`modules/ROOT/pages/sql/index.adoc`'s Bibliography** section gets a new entry listing the official standard
  itself and the free JTC1/SC32 committee page the issue names, so the site's own "sources to consult" section
  matches what the issue asked to surface.

### Part-to-page mapping used below

Verified against ISO's own catalogue (iso.org) and modern-sql.com/standard/parts:

| ISO/IEC 9075 Part | Covers | Catalogue link |
|---|---|---|
| Part 1 — Framework | Overall framework/entry point | `https://www.iso.org/standard/76583.html` |
| Part 2 — Foundation | Core language: DDL, DML, transactions, DCL, scalar/aggregate/window functions, JSON (SQL:2016+) | `https://www.iso.org/standard/76584.html` |
| Part 4 — SQL/PSM (Persistent Stored Modules) | Triggers, stored procedures/functions, control-flow | `https://www.iso.org/standard/76585.html` |
| Part 14 — SQL/XML | XML data type and functions | `https://www.iso.org/standard/76587.html` |

Other sources named in the issue: ANSI webstore (`https://webstore.ansi.org/`, search "ISO/IEC 9075") and the
JTC1/SC32 committee page (`https://www.iso.org/committee/45342.html`) — both used once each, per above.

`modules/ROOT/pages/sql/cheat-sheet.adoc` is out of scope: it only cross-references the other pages and links a
downloadable PDF, it documents no statements of its own.

## Current code state

- `modules/ROOT/partials/sql-disclaimer.adoc` — a 7-line `[IMPORTANT]` admonition, included via
  `include::partial$sql-disclaimer.adoc[]` at the top of every page under `modules/ROOT/pages/sql/`. It currently
  states "This section documents **standard SQL** (ISO/IEC 9075) functionality only" with no link anywhere.
- Every content page (`ddl.adoc`, `relations.adoc`, `dml-queries.adoc`, `dml-modifications.adoc`,
  `transactions.adoc`, `dcl.adoc`, `functions.adoc`, `aggregate-window-functions.adoc`, `json-xml-functions.adoc`,
  `triggers-procedures.adoc`) follows the same shape: `= Title`, the disclaimer include, then one intro paragraph
  before the first `==` section. None currently contain a link. `json-xml-functions.adoc`'s intro already names
  "SQL/XML, or ISO/IEC 9075-14" in plain text, and `triggers-procedures.adoc`'s intro already names "the SQL/PSM
  (Persistent Stored Modules) standard" in plain text — both just need that existing mention turned into a link
  rather than new prose added.
- `modules/ROOT/pages/sql/index.adoc` — the section's landing/nav page. Its `== Bibliography` section (lines
  30-33) currently lists one book reference (Kline et al., _SQL in a Nutshell_) and nothing else.
- This repo has no application code — these are plain AsciiDoc content edits, untagged with any
  language/framework key (none of the installed `*-code-one-task` skills apply), so `iru-code` implements them
  directly, same as `.archive/implementation_plan_9.md`.
- Per `CLAUDE.md`, this repo has no lint/test suite; the only meaningful verification is that the Antora build
  completes without `xref`/AsciiDoc errors. The `iru-build-docs` skill runs that build (setting up the toolchain
  first if needed).

## Implementation steps

### Group 1 — Edit the disclaimer partial and every SQL content page

**Parallelizable: yes** (every task in this group touches a distinct file with no shared state)

- [x] Task 1. Add links to `modules/ROOT/partials/sql-disclaimer.adoc`
  - [x] Task 1.1. Turn the existing "ISO/IEC 9075" mention into a link to
    `https://www.iso.org/standard/76583.html[ISO/IEC 9075]` (the Part 1 Framework overview, the standard's own
    entry point).
  - [x] Task 1.2. Add one sentence noting the standard is also distributed in the US via
    `https://webstore.ansi.org/[ANSI's webstore]` (search "ISO/IEC 9075"), matching the issue's mention of both
    sources. Keep the admonition's existing tone/length — one added sentence, not a rewrite.
  - No tests applicable (plain AsciiDoc content, no code-one-task skill in play); no code-quality tooling
    applies to this repo per `CLAUDE.md`.

- [x] Task 2. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/ddl.adoc`'s intro paragraph
  - [x] Task 2.1. After the existing intro paragraph (lines 5-7), add a sentence in the style already used in
    `modules/ROOT/pages/web/html-css/appendix-html-elements.adoc`'s intro ("For the authoritative ... specification,
    see the ..."): reference `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the
    part of the standard that defines `CREATE`/`ALTER`/`DROP` and the constraint clauses this page covers.

- [x] Task 3. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/relations.adoc`'s intro paragraph
  - [x] Task 3.1. Same treatment as Task 2.1: one sentence in the intro paragraph (lines 5-10) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining the join
    syntax and relation modeling this page covers.

- [x] Task 4. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/dml-queries.adoc`'s intro paragraph
  - [x] Task 4.1. One sentence in the intro paragraph (lines 5-6) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining `SELECT`.

- [x] Task 5. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/dml-modifications.adoc`'s intro paragraph
  - [x] Task 5.1. One sentence in the intro paragraph (lines 5-6) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining
    `INSERT`/`UPDATE`/`DELETE`/`MERGE`/`TRUNCATE`.

- [x] Task 6. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/transactions.adoc`'s intro paragraph
  - [x] Task 6.1. One sentence in the intro paragraph (lines 5-7) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining
    transaction control and isolation levels.

- [x] Task 7. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/dcl.adoc`'s intro paragraph
  - [x] Task 7.1. One sentence in the intro paragraph (lines 5-7) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining
    `GRANT`/`REVOKE`/`SET`.

- [x] Task 8. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/functions.adoc`'s intro paragraph
  - [x] Task 8.1. One sentence in the intro paragraph (lines 5-9) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining the
    scalar functions this page covers.

- [x] Task 9. Add a Part 2 (Foundation) link to `modules/ROOT/pages/sql/aggregate-window-functions.adoc`'s intro
  - [x] Task 9.1. One sentence in the intro paragraph (lines 5-9) linking
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` as the standard defining aggregate
    and window functions.

- [x] Task 10. Link the existing Part 2 / Part 14 mentions in `modules/ROOT/pages/sql/json-xml-functions.adoc`'s intro
  - [x] Task 10.1. In the intro paragraph (lines 5-7), turn "SQL/XML, or ISO/IEC 9075-14" into a link to
    `https://www.iso.org/standard/76587.html[ISO/IEC 9075-14 (SQL/XML)]`, and add a link for the JSON functions to
    `https://www.iso.org/standard/76584.html[ISO/IEC 9075-2 (SQL/Foundation)]` (JSON support was added into
    Foundation by SQL:2016, not published as its own Part).

- [x] Task 11. Link the existing SQL/PSM mention in `modules/ROOT/pages/sql/triggers-procedures.adoc`'s intro
  - [x] Task 11.1. In the intro paragraph (lines 5-8), turn "the SQL/PSM (Persistent Stored Modules) standard"
    into a link to `https://www.iso.org/standard/76585.html[ISO/IEC 9075-4 (SQL/PSM)]`.

- [x] Task 12. Add a sources entry to `modules/ROOT/pages/sql/index.adoc`'s Bibliography
  - [x] Task 12.1. Add a new bullet under `== Bibliography` (after the existing Kline et al. entry) citing the
    standard itself, e.g. "International Organization for Standardization / American National Standards
    Institute. _ISO/IEC 9075, Information technology — Database languages — SQL_", linking
    `https://www.iso.org/standard/76583.html[ISO's catalogue entry]` and noting it's also distributed via
    `https://webstore.ansi.org/[ANSI's webstore]`.
  - [x] Task 12.2. Add one more bullet linking the free
    `https://www.iso.org/committee/45342.html[ISO/IEC JTC 1/SC 32 committee page]` (working drafts and standard
    status, maintained by the committee that develops SQL) as a no-cost supplementary source, per the issue.
  - Tasks 2-12 — files touched: `ddl.adoc`, `relations.adoc`, `dml-queries.adoc`, `dml-modifications.adoc`,
    `transactions.adoc`, `dcl.adoc`, `functions.adoc`, `aggregate-window-functions.adoc`,
    `json-xml-functions.adoc`, `triggers-procedures.adoc`, `index.adoc`. All new/changed lines checked against
    the ~110-column convention (existing lines in these files already range up to ~112-116 chars, so this is
    consistent with current practice); no unrelated prose changed.

Formatting note for every task above: wrap any line that exceeds this section's existing ~110-column convention
(per commit `270e6c3`, "Wrap overlong MDN reference lines to this section's ~110-column convention"), and keep
statement/function names in existing monospace (backtick) styling — don't change unrelated prose.

### Group 2 — Verify the Antora build

**Parallelizable: yes** (single task)

- [x] Task 13. Verify the site still builds cleanly after all edits
  - [x] Task 13.1. Delegate to a sub-agent (per this repository's convention of not running builds inline in the
    main context) to run `Skill({skill: "iru-build-docs"})` and report back only whether the build succeeded and
    any `xref`/AsciiDoc errors or warnings it produced — e.g.:
    ```
    Agent({
      description: "Build the Antora docs site",
      subagent_type: "iru-gate-runner",
      prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site. Report back only
        whether the build succeeded, and the full text of any xref/AsciiDoc errors or warnings produced — not the
        full build log."
    })
    ```
  - [x] Task 13.2. If the build reports any new `xref` or AsciiDoc syntax error introduced by Group 1's edits
    (e.g. an unescaped bracket in a link macro), fix it in the relevant file and re-run Task 13.1 until clean.
  - Build succeeded with an empty build log (no xref/AsciiDoc errors or warnings). Site output generated at
    `build/site/index.html`.
