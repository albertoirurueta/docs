# Implementation Plan: SQL Reference

## Task summary

Source: GitHub issue #3

Issue [#3](https://github.com/albertoirurueta/docs/issues/3) ("SQL Reference") asks for a new standard-SQL
reference section under `modules/ROOT/pages/sql/` in this repo's own `ROOT` Antora component (this repo has no
application source — it *is* the playbook + root component for the aggregated "Irurueta Docs" site). The section
must:

- Cover only **standard** SQL (no vendor-specific/DBMS-specific extensions), and carry an explicit disclaimer to
  that effect plus a disclaimer that it was AI-generated.
- Document DDL (`CREATE`/`ALTER`/`DROP`/etc.), DML (`SELECT` with `DISTINCT`/`GROUP BY`/aggregate & window
  functions/`WHERE`/joins, `INSERT`, `UPDATE`, `DELETE`, `MERGE`, `TRUNCATE`, transaction control), DCL
  (`GRANT`/`REVOKE`/`SET`), a function reference (built-in scalar, aggregate/window, JSON-handling,
  XML-handling), and triggers/stored procedures — each entry with its allowed parameters/options, a brief
  description, and typical examples.
- End with a one-page "cheat sheet" summarizing the most relevant statements/examples, generated as a downloadable
  PDF, linked from the AsciiDoc pages, and visually structured (colors, boxed groups) for easy memorization.

**Choices made on the user's behalf:**

- **Page structure**: this repo has no prior convention for a multi-page reference *within* the `ROOT` module
  (every other entry in `modules/ROOT/nav.adoc` links to a whole separate remote Antora component, not a local
  `pages/` subtree). This plan splits the reference into one page per statement family/topic (see "Current code
  state" below) rather than one giant page, for skimmability and so `nav.adoc` can offer a proper sub-menu —
  standard Antora/AsciiDoc practice for a reference of this breadth.
- **Shared disclaimer**: rather than repeating the "standard SQL only" / "AI-generated" notice by hand on every
  page (error-prone, easy to drift), it's authored once as an AsciiDoc partial and `include::`-d at the top of
  every SQL reference page.
- **PDF generation approach** (confirmed with the user): this repo has zero PDF-generation tooling today (only
  Antora/Node for HTML). Per the user's explicit choice, the cheat sheet PDF is a **static, checked-in asset**:
  generated once now (by designing an HTML/CSS layout and rendering it to a single-page PDF) and committed under
  `modules/ROOT/assets/attachment/`, rather than adding a new build dependency/pipeline step to regenerate it on
  every Antora build.
- Optional source material offered in the issue — `~/Desktop/book.pdf` ("SQL in a Nutshell") — exists on disk
  (confirmed, ~5.7MB) and may be used alongside general SQL knowledge as reference material; no other source is
  required to write standard-SQL-only content.
- **Bibliography** (per user request during plan review): the landing page must include a bibliographic
  reference to "SQL in a Nutshell" crediting it as source material, per Task 1.2 below.

No language/framework key applies to any task below — this is pure AsciiDoc content authoring plus one static
binary asset (a PDF), not source code, so no `*-code-one-task` skill is relevant. Per this plan's own tagging
convention, an untagged task is implemented directly by `iru-code` rather than dispatched to a language-specific
skill.

## Current code state

- Repo root `antora.yml` declares the `ROOT` component (title "Irurueta Docs"); its nav is
  `modules/ROOT/nav.adoc`, currently 14 entries, each an `xref:` to another remote component's own
  `index.adoc` (e.g. `xref:irurueta-algebra::index.adoc[Algebra]`) — there is no existing sub-menu/nested nav
  entry anywhere in this file to mirror, so the new entries follow plain Antora nav nesting conventions instead.
- `modules/ROOT/pages/` currently contains only `index.adoc` (the site's project-picker home page). There is no
  `modules/ROOT/pages/sql/` directory yet — this is greenfield.
- There is no `modules/ROOT/partials/` directory yet, and no `modules/ROOT/assets/` directory yet (neither
  `assets/images/` nor `assets/attachment/` — the existing `modules/ROOT/images/` directory holds the picker's
  SVG icons and is unrelated to Antora's `attachment$` family, which must live under
  `modules/ROOT/assets/attachment/`).
- Antora's `attachment:` inline macro (e.g. `attachment:sql-cheat-sheet.pdf[Download the cheat sheet (PDF)]`)
  resolves a file placed at `modules/ROOT/assets/attachment/sql-cheat-sheet.pdf` into a downloadable link in the
  generated site — this needs no UI-bundle changes (confirmed: `ui-bundle.zip` has no attachment-specific
  templates, and none are needed — it's a plain generated link).
- `antora-playbook.yml` already enables `@sntke/antora-mermaid-extension` and `@djencks/asciidoctor-mathjax` —
  not needed for this content (no diagrams/equations called for) but available if a page benefits from an ER-type
  diagram; not used in this plan to keep scope tight to what the issue asks for.
- The only existing verification method in this repo (per `CLAUDE.md` and `.archive/implementation_plan_1.md`,
  the one prior archived plan) is running `npx antora antora-playbook.yml` (or `--fetch`) and checking the build
  completes with no `xref`/AsciiDoc errors, then inspecting `build/site`. There is no lint/test suite.
- `.archive/implementation_plan_1.md` (Google Analytics wiring, issue #1) is unrelated in topic and not used as
  structural precedent here beyond confirming this repo's build-only verification convention.

## Implementation steps

### Group 1 — Task 1 only

**Parallelizable: yes** (single task — nothing else in this group to conflict with)

- [x] Task 1. Create the shared SQL-reference disclaimer partial and the section's landing page
  - [x] Task 1.1. Create `modules/ROOT/partials/sql-disclaimer.adoc` containing a single AsciiDoc admonition
    block reused by every SQL reference page, e.g.:
    ```adoc
    [IMPORTANT]
    ====
    This section documents **standard SQL** (ISO/IEC 9075) functionality only. Vendor-specific extensions or
    behavior of any particular database management system are intentionally left out. This content was
    generated with the assistance of AI and should be verified against your target DBMS's own documentation
    before relying on it in production.
    ====
    ```
  - [x] Task 1.2. Create `modules/ROOT/pages/sql/index.adoc`: an `= SQL Reference` landing page that
    `include::partial$sql-disclaimer.adoc[]`s the notice above, briefly explains the scope (DDL, DML, DCL,
    functions, triggers/procedures, cheat sheet) and links (via `xref:`) to every sub-page created in Group 2
    (the exact filenames are fixed by this plan, so the links can be written now even though those pages don't
    exist yet). Add a closing `== Bibliography` section citing the reference material used, e.g.:
    ```adoc
    == Bibliography

    * Kline, Kevin; Kline, Daniel; Hunt, Brand. _SQL in a Nutshell_. O'Reilly Media.
    ```
  - [x] Task 1.3. Confirm the two new files parse as valid AsciiDoc — a quick local `npx antora
    antora-playbook.yml` build focused on catching syntax errors is sufficient here; the full cross-page link
    check happens in Group 3's build verification once every page exists.
  - Note: created `modules/ROOT/partials/sql-disclaimer.adoc` and `modules/ROOT/pages/sql/index.adoc`. Quick
    build confirmed valid AsciiDoc syntax (only expected "xref not found" errors for Group 2 pages that don't
    exist yet).

### Group 2 — Tasks 2–11

**Parallelizable: yes** — every task in this group creates exactly one new, independent file under
`modules/ROOT/pages/sql/` (Task 11 also adds one new binary asset) and none of them edit a file another task in
this group also edits, so they can be authored concurrently. Each page must
`include::partial$sql-disclaimer.adoc[]` at the top (from Group 1) and use `[source,sql]` blocks for every
example.

- [x] Task 2. Create `modules/ROOT/pages/sql/ddl.adoc` — Data Definition Language
  - Cover, each with syntax/parameters, description, and a runnable example: `CREATE` (TABLE, VIEW, INDEX,
    SCHEMA), `ALTER` (TABLE ADD/DROP/MODIFY COLUMN, constraints), `DROP`, plus standard constraint clauses
    (`PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, `DEFAULT`).
  - Note: created `modules/ROOT/pages/sql/ddl.adoc` covering CREATE (SCHEMA/TABLE/VIEW/INDEX), ALTER TABLE,
    DROP, and Constraints, each with `[source,sql]` examples.
- [x] Task 3. Create `modules/ROOT/pages/sql/dml-queries.adoc` — Querying data with `SELECT`
  - Cover `SELECT` core clause order (`SELECT`/`FROM`/`WHERE`/`GROUP BY`/`HAVING`/`ORDER BY`), `DISTINCT`,
    `GROUP BY` (with `HAVING`), `WHERE` predicates (comparison, `BETWEEN`, `IN`, `LIKE`, `IS NULL`, boolean
    combinators), table joins (`INNER`, `LEFT OUTER`, `RIGHT OUTER`, `FULL OUTER`, `CROSS`), and a short
    introduction to aggregate and window functions in this context (`OVER`, `PARTITION BY`) that cross-references
    Task 9's page for the full function-by-function reference rather than duplicating it.
  - Note: created `modules/ROOT/pages/sql/dml-queries.adoc` covering clause order, DISTINCT, GROUP BY/HAVING,
    WHERE predicates, joins, and a window-function intro cross-referencing
    `sql/aggregate-window-functions.adoc`.
- [x] Task 4. Create `modules/ROOT/pages/sql/dml-modifications.adoc` — Modifying data
  - Cover `INSERT` (single-row, multi-row, `INSERT ... SELECT`), `UPDATE`, `DELETE`, `MERGE` (matched/not-matched
    branches), `TRUNCATE`, each with parameters/options, description, and example.
  - Note: created `modules/ROOT/pages/sql/dml-modifications.adoc` covering INSERT/UPDATE/DELETE/MERGE/TRUNCATE.
- [x] Task 5. Create `modules/ROOT/pages/sql/transactions.adoc` — Transaction control statements
  - Cover `START TRANSACTION`/`BEGIN`, `COMMIT`, `ROLLBACK` (including `ROLLBACK TO SAVEPOINT`), `SAVEPOINT`,
    and a brief note on standard transaction isolation levels (`SET TRANSACTION ISOLATION LEVEL ...`).
  - Note: created `modules/ROOT/pages/sql/transactions.adoc` covering START TRANSACTION/COMMIT/ROLLBACK/
    SAVEPOINT and isolation levels.
- [x] Task 6. Create `modules/ROOT/pages/sql/dcl.adoc` — Data Control Language
  - Cover `GRANT`, `REVOKE` (privileges on tables/schemas, `WITH GRANT OPTION`), and the standard `SET` statement
    (session/transaction-scoped options), each with parameters/options, description, and example.
  - Note: created `modules/ROOT/pages/sql/dcl.adoc` covering GRANT/REVOKE/SET.
- [x] Task 7. Create `modules/ROOT/pages/sql/functions.adoc` — Built-in scalar functions
  - Cover the standard scalar function families with signature, description, and example each: string
    (`SUBSTRING`, `CONCAT`, `TRIM`, `UPPER`/`LOWER`, `REPLACE`, `LENGTH`), numeric (`ABS`, `ROUND`, `CEIL`/
    `FLOOR`, `MOD`), date/time (`CURRENT_DATE`, `CURRENT_TIMESTAMP`, `EXTRACT`), and type-conversion (`CAST`).
  - Note: created `modules/ROOT/pages/sql/functions.adoc` covering string/numeric/date-time/type-conversion
    scalar functions, cross-referencing the aggregate/window and JSON/XML pages.
- [x] Task 8. Create `modules/ROOT/pages/sql/aggregate-window-functions.adoc` — Aggregate and window functions
  - Cover aggregate functions (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) and window functions (`ROW_NUMBER`, `RANK`,
    `DENSE_RANK`, `LAG`/`LEAD`, `NTILE`) with the `OVER (PARTITION BY ... ORDER BY ...)` syntax, parameters,
    description, and example for each.
  - Note: created `modules/ROOT/pages/sql/aggregate-window-functions.adoc` covering aggregate and window
    functions plus the OVER clause.
- [x] Task 9. Create `modules/ROOT/pages/sql/json-xml-functions.adoc` — JSON and XML handling functions
  - Cover the standard (SQL:2016+) JSON functions (`JSON_VALUE`, `JSON_QUERY`, `JSON_TABLE`, `JSON_EXISTS`) and
    standard XML functions (`XMLELEMENT`, `XMLFOREST`, `XMLQUERY`, `XMLTABLE`), each with parameters,
    description, and example — noting where DBMS support for these standard functions varies, without
    documenting any single vendor's proprietary equivalent.
  - Note: created `modules/ROOT/pages/sql/json-xml-functions.adoc` covering the standard JSON and XML functions.
- [x] Task 10. Create `modules/ROOT/pages/sql/triggers-procedures.adoc` — Triggers and stored procedures
  - Cover standard `CREATE TRIGGER` (`BEFORE`/`AFTER`, `FOR EACH ROW`) and `CREATE PROCEDURE`/`CREATE FUNCTION`
    (SQL/PSM: parameters, `RETURNS`, basic control-flow statements `IF`/`WHILE`/`LOOP`), each with parameters,
    description, and example.
  - Note: created `modules/ROOT/pages/sql/triggers-procedures.adoc` covering CREATE TRIGGER, CREATE PROCEDURE/
    FUNCTION, and SQL/PSM control-flow statements.
- [x] Task 11. Add the one-page SQL cheat sheet (PDF) and its documentation page
  - [x] Task 11.1. Design a single-page, print-ready HTML/CSS layout (build it as a scratch file, e.g. under the
    session scratchpad) summarizing the most-used statements/examples from Tasks 2–10 (one compact, color-coded
    box per statement family: DDL, SELECT, INSERT/UPDATE/DELETE, transactions, DCL, common functions) —
    structured for quick visual scanning/memorization, sized to fit one A4/Letter page.
  - [x] Task 11.2. Render that HTML layout to a single-page PDF and save it as
    `modules/ROOT/assets/attachment/sql-cheat-sheet.pdf` (creating the `modules/ROOT/assets/attachment/`
    directory, which doesn't exist yet).
  - [x] Task 11.3. Verify the rendered PDF is exactly one page and visually legible (e.g. check its page count
    and render a preview) before committing it.
  - [x] Task 11.4. Create `modules/ROOT/pages/sql/cheat-sheet.adoc`: include the disclaimer partial, a short
    intro, and `attachment:sql-cheat-sheet.pdf[Download the SQL Cheat Sheet (PDF)]` linking the asset from
    Task 11.2.
  - Note: designed `scratchpad/sql-cheat-sheet.html` (color-coded, 8 boxes: DDL, SELECT, DML, Transactions, DCL,
    Common Functions, Aggregate & Window, JSON/XML/Triggers), rendered via headless Chrome
    (`--headless --print-to-pdf`) — confirmed exactly 1 page (`file` command reports "PDF document ... 1 pages")
    and visually legible via a browser screenshot preview. Created `modules/ROOT/pages/sql/cheat-sheet.adoc`
    linking it and cross-referencing every other SQL reference page. Corrected during Task 12's build
    verification: Antora's attachment family resolves from `modules/ROOT/attachments/` (not
    `modules/ROOT/assets/attachment/`, which this plan had assumed) and the link macro is
    `xref:attachment$sql-cheat-sheet.pdf[]` (not the non-existent `attachment:` inline macro) — the PDF was
    moved to `modules/ROOT/attachments/sql-cheat-sheet.pdf` and the page's link macro fixed accordingly.

### Group 3 — Task 12 only

**Parallelizable: yes** (single task)

- [x] Task 12. Wire the new section into navigation and verify the full site build
  - [x] Task 12.1. Add a new nested entry to `modules/ROOT/nav.adoc` linking every page from Groups 1–2:
    ```adoc
    * xref:sql/index.adoc[SQL Reference]
    ** xref:sql/ddl.adoc[DDL]
    ** xref:sql/dml-queries.adoc[Queries (SELECT)]
    ** xref:sql/dml-modifications.adoc[Data Modification]
    ** xref:sql/transactions.adoc[Transactions]
    ** xref:sql/dcl.adoc[Data Control (DCL)]
    ** xref:sql/functions.adoc[Built-in Functions]
    ** xref:sql/aggregate-window-functions.adoc[Aggregate & Window Functions]
    ** xref:sql/json-xml-functions.adoc[JSON & XML Functions]
    ** xref:sql/triggers-procedures.adoc[Triggers & Stored Procedures]
    ** xref:sql/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```
  - [x] Task 12.2. Delegate the full-site build check to the `iru-gate-runner` agent rather than running it
    inline (per this repo's only verification convention):
    ```
    Agent({
      description: "Build and verify the Antora docs site",
      subagent_type: "iru-gate-runner",
      prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site. Report back:
        whether the build completed with no xref/AsciiDoc errors, whether every new page under
        modules/ROOT/pages/sql/ rendered into build/site, whether the new 'SQL Reference' nav section appears
        correctly (including nested entries), and whether the cheat sheet page's attachment link resolves to
        an actual downloadable sql-cheat-sheet.pdf under the generated site output."
    })
    ```
  - [x] Task 12.3. If the agent reports any xref/build error or a broken/missing attachment link, fix the
    offending page/nav entry/asset path and re-run Task 12.2 until the build is clean.
  - Note: added the nested "SQL Reference" nav section to `modules/ROOT/nav.adoc`. First `iru-gate-runner` build
    check found the cheat-sheet attachment link broken (invalid `attachment:` macro, and the PDF placed under
    `modules/ROOT/assets/attachment/` instead of Antora's real `modules/ROOT/attachments/` family directory);
    fixed both (see Task 11's note) and re-ran the same check, which confirmed a clean build (no xref/AsciiDoc
    errors), all 11 `sql/` pages rendered, the nav section renders with all nested entries, and the cheat sheet
    now renders a real downloadable link resolving to `build/site/_attachments/sql-cheat-sheet.pdf`.
