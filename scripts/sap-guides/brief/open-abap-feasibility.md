# open-abap feasibility for the ABAP guides, checked on 2026-11-13

Probe project: a throwaway project outside the repository (`abaplint` transpiler plus the open-abap runtime). Nothing needed an account, a sign-in or a licence acceptance. Every statement below was run, not read.

## Versions used

| Component | Version | Licence | Source |
|---|---|---|---|
| Node.js | 24.21.0 (Node 22 or newer is required by the CAP side of the lab) | MIT-style (OpenJS) | local install |
| `@abaplint/transpiler-cli` | 2.14.30 | MIT | public npm |
| `@abaplint/runtime` | 2.14.30 | MIT | public npm |
| `@abaplint/database-sqlite` | 2.14.12 (sql.js, WebAssembly SQLite) | MIT | public npm |
| `@abaplint/cli` | 2.120.103 | MIT | public npm |
| open-abap-core | commit `a9acc41` (2026-11-12), cloned by the transpiler from https://github.com/open-abap/open-abap-core | MIT | public GitHub |

The project template is the one in `open-abap-core` itself (its `abap_transpile.json` and `test/setup.mjs`), not a separate template repository: `abaplint` publishes no starter repository for this. The configuration that works is `libs` with open-abap-core, `write_unit_tests: true`, `options.addCommonJS: true`, `options.addFilenames: true` and a `setup` module that connects the SQLite client. Without `addCommonJS` the generated modules fail at start with `cl_abap_objectdescr is not defined` (import order of the library classes). `npm test` transpiles and runs the unit tests; the exit code is 1 when an assertion fails (checked with a deliberately wrong expected value) and 0 when all pass.

## What the statements do

Result `works` means a test method that asserts the result passed. `fails` means the transpiler stops, or the assertion shows a different result from real ABAP.

| Feature | Result | Note |
|---|---|---|
| Local and global classes, interfaces, `INTERFACES` and `zif~method` calls, `NEW` | works | |
| Exception class (inherits `cx_static_check`), `RAISE EXCEPTION NEW`, `TRY` / `CATCH` | works | |
| `VALUE` for structured tables, `CONV`, `CORRESPONDING`, `FINAL(...)`, inline `DATA(...)` | works | |
| `REDUCE` | works | |
| `FILTER` on a sorted table with a non-unique key | works | |
| String templates `\|Hello { name }, { 1 + 2 }\|`, `PAD`, `DECIMALS` | works | |
| `to_upper`, `condense`, `replace`, `strlen`, `substring`, `find` with regex, `SPLIT ... INTO TABLE`, `concat_lines_of` | works | |
| `WIDTH` with `ALIGN = RIGHT` in a template | **fails** | the result is left aligned (`'ab  '`), real ABAP right-aligns. Not taught on open-abap |
| Table expressions `itab[ grp = 'b' ]`, `line_exists( )` | works | |
| `SORT`, `READ TABLE ... INTO`, `AT NEW`, `lines( )` | works | |
| `LOOP AT ... GROUP BY ...` (with members, `ASSIGNING`, `WITHOUT MEMBERS`) | **fails** | the transpiler reports `Void type: todoGroupBy` |
| `COLLECT` | **fails** | two groups collapse to one row (wrong result). Do not use |
| ABAP Unit: `FOR TESTING`, `cl_abap_unit_assert=>assert_equals`, `assert_true`, `fail` | works | a failing assertion ends the run with exit code 1 |
| Program output with `REPORT` and `WRITE` | works | `node build/project/<name>.prog.mjs` prints the line |
| `if_oo_adt_classrun` output (`out->write`) | **not available** | the interface exists but no output class exists in open-abap-core (`cl_oo_adt_classrun_out` is not found). Guides print with `WRITE` in a report. A local stand-in class is not written, because it would imitate an SAP feature |
| `INSERT ... FROM @structure` and `FROM TABLE @( VALUE ty_tab( ... ) )` | works | the type must be given: `VALUE #( ... )` inside `@( )` fails with "type not found: #" |
| `SELECT SINGLE`, `SELECT ... INTO TABLE @DATA(...)`, `WHERE` with `IN`, `BETWEEN`, `LIKE`, `ORDER BY ... DESCENDING`, `UP TO n ROWS`, `DISTINCT`, `COUNT( * )`, `SELECT ... ENDSELECT`, `FOR ALL ENTRIES`, `INNER JOIN` | works | on SQLite through the setup module |
| `UPDATE ... SET ... WHERE`, `SET amount = amount + 5`, `DELETE FROM ... WHERE`, `MODIFY` | works | `sy-subrc` 4 after an update without a match works |
| `sy-dbcnt` after `UPDATE` | **fails** | returns 0 instead of the number of rows |
| `SUM`, `AVG`, `MIN`, `MAX` in `SELECT` | **fails** | `Void type: SELECT_todo11` / `SELECT_todo12` |
| SQL `GROUP BY` | **fails** | `Void type: SELECT_todo7` |
| SQL `CASE` expression | **fails** | `Void type: SELECT_todo7` |
| DDIC tables | works only as abapGit `.tabl.xml` files (no SE11, no CDS, no RAP) | the transpiler creates a SQLite table from each one |
| abaplint CLI | works | with an explicit `rules` section (the generated default from `abaplint -d` has 232 rules; a configuration without `rules` reports nothing). Findings carry the rule key |
| abaplint VS Code extension | **not run here** | it comes from the VS Code Marketplace without an account; its steps are run when the guide is written |

## Verdict per ABAP guide

| Guide | Verdict | Reason and steps |
|---|---|---|
| `guide-set-up-a-local-abap-playground.adoc` | **keep** | Install, transpile and run all work. The VS Code extension steps are checked at writing time |
| `guide-first-abap-program.adoc` | **keep** | A `REPORT` with `WRITE` prints the output; an error message is reproduced from a deliberate syntax error (`check_syntax ...` from the transpiler). Output is through `WRITE`, not `out->write` |
| `guide-data-types-strings-and-templates.adoc` | **trim** | Drop the `WIDTH`/`ALIGN` formatting step. Keep declarations, inline `DATA( )`, `CONV`, templates, `PAD`, `DECIMALS`, string functions, `SPLIT`, regex `find` |
| `guide-work-with-internal-tables.adoc` | **trim** | Drop the `LOOP AT ... GROUP BY` step and any `COLLECT`. Keep `VALUE`, table expressions, `line_exists`, `SORT`, `READ TABLE`, `REDUCE`, `FILTER` and `AT NEW` after a `SORT`. Grouping with `GROUP BY` stays on the reference page (`internal-tables-processing-and-grouping`) with a "requires a real ABAP system; not run here" label |
| `guide-classes-interfaces-and-exceptions.adoc` | **keep** | Classes, interface, exception class and `TRY`/`CATCH` all run |
| `guide-write-abap-unit-tests.adoc` | **keep** | A passing and a failing test run, with exit codes 0 and 1 |
| `guide-check-code-with-abaplint.adoc` | **keep** | The CLI runs with Clean ABAP style rules and reports findings; the VS Code view is checked at writing time. ATC is explained in prose only |
| `guide-abap-sql-on-a-local-database.adoc` | **trim** | Keep `SELECT` into a table, `WHERE` (`IN`, `BETWEEN`, `LIKE`), `ORDER BY`, `DISTINCT`, `UP TO`, `COUNT( * )`, `INSERT`, `UPDATE`, `DELETE`, `MODIFY`, `SELECT SINGLE`. Drop `SUM`, `AVG`, `MIN`, `MAX`, `GROUP BY`, `CASE` and any use of `sy-dbcnt`. The aggregates step is limited to `COUNT( * )` |

No guide is dropped. No step is replaced by a look-alike substitute: where open-abap lacks a feature, the step is removed and the feature is taught on the reference page with an "requires an SAP system; not run here" label.

## Reproducing the probe

The probe sources are the ones the `abap-lab/` skeleton starts from (task 6.2): a global class with an interface and an exception class, a test class, an abapGit table definition, `abap_transpile.json`, `setup.mjs` and `abaplint.json`.
