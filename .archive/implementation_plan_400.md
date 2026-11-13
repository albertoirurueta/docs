# Implementation Plan: Guides & References — "ABAP" (Programming Languages) and "ERP (Enterprise Resource Planning)" / "SAP"

## Task summary

Add a detailed, beginner-first ABAP reference under Programming Languages and a new ERP section with an SAP subsection (general SAP, Finance, Human Resources) to the Irurueta Docs Antora site, with account-free step-by-step guides, four one-page cheat-sheet PDFs and two bibliographies, as specified in GitHub issue #400 and its four outline comments. The pages are drawn from the official SAP documentation; eight requester-provided books are consulted for concept coverage only and are cited through their publisher pages.

Source: GitHub issue #400
Base branch: main

Choices made on the user's behalf (challenge them at review):
- **One branch, one pull request**, planned as 25 groups, because the issue is one specification. Page groups are `Parallelizable: yes`, so the work can still run concurrently inside a group.
- **One task per page or guide.** The page content is the outline item named in the task (comments 1-3 for pages, comment 4 for guides), including its 📊 figure, Σ math, ⚠ outdated-book note and source links. The per-page rules are the issue's "Page conventions" and "Beginner-first writing".
- **Cross-links are added late.** Page tasks may name later pages in plain text; the `xref:` links to guides (`== Try it`) and the index, nav and cards are added in the wiring group, when everything exists. The full build must be clean only at the end.
- **Guides are feasibility-gated.** The first group probes open-abap, CAP and UI5 offline and marks each guide keep, trim or drop; dropped guides are listed in the pull request description and removed from indexes, nav and `== Try it`.
- **SAP logo.** Use a Simple Icons or Devicon mark only if present and its terms allow it; otherwise a drawn glyph. Never redraw the SAP logo.
- **No accounts.** No task creates or uses an account, trial, API key or login.
- **Tagging.** Documentation tasks are untagged. Node scripts (`.mjs`) are tagged `javascript`, which has no installed `*-code-one-task` skill, so `iru-code-one-task-group` implements them directly.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "Add a new ABAP section under Guides & References / Programming Languages" | Tasks 15-96, Tasks 243-252 |
| 2 | "a new section called SAP within Guides & References / ERP (Enterprise Resource Planning)" | Tasks 97-138, Tasks 243-252 |
| 3 | "documentation pages about ... Financing and Human Resources modules" | Tasks 139-178, Tasks 179-210 |
| 4 | "Each documentation page will need to contain detailed information, if possible with code examples, and linked to its official documentation" | Tasks 15-210 (each page task follows its outline item) |
| 5 | "Mermaid diagrams, figures in SVG format and Mathjax equations can be added if they help" | Tasks 15-210, Tasks 9-14, Tasks 211-235 |
| 6 | "Bibliography pages ... each source linked to its official website (or the official editorial website for provided pdf books)" | Tasks 253-258 (bibliography tasks), Tasks 1-8 (publisher pages) |
| 7 | "Admonitions must only indicate that documentation was generated with AI assistance" | Tasks 259-267 (admonition check), page and guide tasks |
| 8 | "One or multiple cheat sheet pages ... one page downloadable pdfs" | Tasks 253-258 |
| 9 | "step-by-step guides with screenshots (similar to grafana or kibana guides)" | Tasks 9-14, Tasks 211-235 |
| 10 | "SAP documentation must be addressed to teach concepts to people who has no prior knowledge" | Tasks 1-8 (templates, audit), Tasks 236-242, Tasks 259-267 (audit run) |
| 11 | "No accounts will be created. ... search for alternative sources or do not include such guides at all" | Tasks 1-8 (feasibility), Tasks 211-235, Tasks 259-267 (account-free check) |
| 12 | Acceptance: nav, templates and cards pass (`test:nav`, `test:nav:site`, `audit:index-template`, `test:cards`) | Tasks 243-252, Tasks 259-267 |
| 13 | Acceptance: concepts contributed by books B1-B8 are covered and each outdated book form is stated in prose | Tasks 15-210 |
| 14 | Acceptance: the build is clean, greps print nothing, the site stays under the size limit | Tasks 259-267 |

## Current code state

The repository is the Antora playbook and ROOT component of the site; there is no application code. Verified during exploration (`iru-explore`, repository host GitHub, project type `other`):
- Pages live in `modules/ROOT/pages/<section>/`; `modules/ROOT/nav.adoc` includes per-language partials such as `modules/ROOT/partials/nav-cobol.adoc` (template for `nav-abap.adoc`). The ABAP section and the `erp/` section do not exist yet.
- `modules/ROOT/pages/ecommerce/{index,overview}.adoc` and `programming-languages/cobol/*` are the templates for the ERP index/overview and for a language section; `.archive/implementation_plan_243.md` (COBOL), `_389.md` (Grafana/Kibana guides) and `_385.md` (Monitoring & Alerting) are the precedent plans.
- `scripts/cards/` (manifest, palette, logos, generators and tests), `scripts/cheat-sheet-pdfs/` (render plus `sheets/*.mjs`), `scripts/index-template/audit.mjs`, `scripts/nav-fix/` and `scripts/validate-mermaid.mjs` enforce the house rules; `scripts/monitoring-guides/` is the figure generator the SAP guides extend (`lib/blocks.mjs`, `lib/shells.mjs`, `lib/render.mjs`, `themes/`, `figures/`, `generate-figures.mjs`).
- `modules/ROOT/examples/monitoring-alerting-lab/` is the lab precedent; `modules/ROOT/attachments/` holds the cheat-sheet PDFs; every page includes `partial$ai-disclaimer.adoc`, the only admonition allowed.
- `CLAUDE.md` rules apply to every task: image macros on one line, quoted alt text when it contains a comma, inline code with `->`, `#`, `{`, `*`, `~`, `+` written as passthroughs, Mermaid stereotypes as entities, `:stem: latexmath` for math, nav entries never link to a `#fragment`, and every nav entry is a link or a heading with children.

**Page task contract** (applies to every "Write ..." task below): the page follows the outline item it names in issue #400; starts with `= <Title>`, `:description:`, `:keywords:`, the AI notice include; has the plain-words intro, `== Before you read`, `== Key terms`, body, `== Summary` and `== References` (plus the guide template for guides); states its release baseline and where it applies (ABAP Cloud / classic / on-premise / Public Edition / SuccessFactors); has a source link after every code example; adds its diagram, SVG or MathJax block; and says in prose where a requester book is outdated. Examples that need an SAP system are checked against the official docs and labelled "requires an SAP system; not run here".

## Implementation steps


### Group 1 — Baseline verification, feasibility probes and shared assets (Parallelizable: no — every later group depends on the verified facts, the feasibility verdicts and the shared templates)

Everything later depends on verified facts, on which guides survive their feasibility check, and on the shared templates and audit script, so this group runs first and alone.

- [x] Task 1. Verify the version baseline of issue #400 and record it in `scripts/sap-guides/brief/baseline.md`
  - Done: `scripts/sap-guides/brief/baseline.md`. Verified in a browser session: Standard ABAP 8.16, ABAP Cloud 9.20 (2608), S/4HANA 2025 FPS02, Cloud Public 2608, CAP 10.2 / CAP Java 5.2, SAPUI5 1.154 (2611) and 1.148 LTS, SuccessFactors 2H 2026, H4S4 (separate licence, active by default in 2025), maintenance dates, Build Apps deprecation, clean core levels exist. Unverified: ADT version, SAP_BASIS 816 mapping (SAP says internal), H4S4 until 2040 (no official page), per-level definitions of clean core C and D; BTP rename only partly verified.
  - [x] Task 1.1. Open each baseline row in a real browser (Browser pane; help.sap.com needs JavaScript): Standard ABAP 8.16 and ABAP Cloud 2608 release news, S/4HANA 2025 FPS02 and Cloud Public 2608 product pages, CAP 10.x and CAP Java 5.x releases, SAPUI5 1.154 version overview, SuccessFactors 2H 2026, the H4S4 page
  - [x] Task 1.2. Verify the facts the issue marks unverified: H4S4 maintained until 2040 (SAP Notes need a login, so record "unverified" if no official page exists), the SAP BTP to "SAP Business AI Platform" renaming, clean-core levels A-D, the Build Apps standalone deprecation
  - [x] Task 1.3. Record every result as verified/unverified with the page URL and the date; pages cite only verified facts as fact
- [x] Task 2. Open and fix the outline links: for every URL in outline comments 1-4 tagged (u) or (T), open it, correct moved pages, and write the confirmed URL map to `scripts/sap-guides/brief/links.md`
  - Done: `scripts/sap-guides/brief/links.md`. All 194 help.sap.com topics and 19 Keyword Documentation files resolve; `abap-keyword` is now `abap-keywords` (old slug still works); 5 outline URLs replaced (two payroll topics moved deliverable, HDI and generative AI hub pages do not exist, `abap-cloud/abap-cloud/test` points at an unrelated page); informit URL had a stray full stop; B3, B8 and B1 first editions have no publisher page, the current-edition pages are cited.
  - [x] Task 2.1. Find the current SAP PRESS publisher pages for B3 (ABAP Development for SAP HANA, 1st edition out of print) and B8 (HCM Technical Principles, 1st edition) and the Jotev 3rd edition page; record them for the bibliographies
  - [x] Task 2.2. Record which help.sap.com topics have no official page (HR_READ_INFOTYPE, HR_INFOTYPE_OPERATION, PM01, S/4 off-cycle payroll) so the pages label them "in-system documentation"
- [x] Task 3. Probe the account-free ABAP playground and record what it supports in `scripts/sap-guides/brief/open-abap-feasibility.md` _(javascript)_
  - Done: `scripts/sap-guides/brief/open-abap-feasibility.md` (transpiler 2.14.30, runtime 2.14.30, database-sqlite 2.14.12, open-abap-core `a9acc41`). Verdicts: keep 1, 2, 5, 6, 7; trim 3 (no WIDTH/ALIGN), 4 (no GROUP BY, no COLLECT), 8 (no SUM/AVG/MIN/MAX, no GROUP BY, no CASE, no sy-dbcnt); none dropped.
  - [x] Task 3.1. Install Node.js 22+ and the abaplint transpiler with the open-abap runtime from npm/GitHub; run the project template and record every version
  - [x] Task 3.2. Probe each ABAP feature the 8 ABAP guides need: classes, interfaces, exceptions, `VALUE`/`REDUCE`/`FILTER`, string templates, internal tables and `GROUP BY`, ABAP Unit, and ABAP SQL on SQLite (`SELECT`, `INSERT`, `UPDATE`)
  - [x] Task 3.3. Mark each ABAP guide `keep`, `trim` (which steps) or `drop` and record the reason; a dropped guide is also removed from its area index, nav and `== Try it` links
  - [x] Task 3.4. Never use a substitute that imitates an SAP feature the playground lacks
- [x] Task 4. Probe the CAP and UI5 toolchain and record it in `scripts/sap-guides/brief/cap-ui5-feasibility.md` _(javascript)_
  - Done: `scripts/sap-guides/brief/cap-ui5-feasibility.md` (`@sap/cds-dk` 10.2.1, `@sap/cds` 10.2.2, `@ui5/cli` 4.0.73, OpenUI5 1.154.0, `mbt` 1.2.52). Public EDMX found: https://github.com/capire/s4 (Apache-2.0). Verdicts: all 9 SAP-general guides keep except guide 7 (trim: no headless QUnit/OPA5 runner); Finance and HR guides keep; none dropped.
  - [x] Task 4.1. Install `@sap/cds-dk` 10.x, UI5 Tooling with OpenUI5 and `mbt` from public npm without signing in; record versions and package licences
  - [x] Task 4.2. Run `cds init`, `cds watch`, a Fiori elements preview and `mbt build` on a throwaway project outside the repository
  - [x] Task 4.3. Look for a login-free public EDMX for SAP Business Partner (an Apache-2.0 SAP-samples repository); record its URL and licence, or mark guide `guide-consume-an-sap-api-from-cap.adoc` as dropped
- [x] Task 5. Check the SAP logo options for the cards: look for an SAP mark in the pinned `simple-icons` and `devicon` packages and read their terms; if there is none, or SAP's trademark guidelines object, use a drawn glyph (`gl:...`) and never redraw the SAP logo
  - Done: `scripts/sap-guides/brief/sap-logo-decision.md`. Simple Icons has `sap.svg` but without licence or guidelines data, and SAP's trademark page requires written permission for its logos: use a drawn glyph (`gl:`), never the SAP logo.
- [x] Task 6. Create the lab skeletons under `modules/ROOT/examples/` _(javascript)_
  - Done: `modules/ROOT/examples/sap-lab/` (README.md, `expenses/` with db, srv, app, http, test, pinned `package.json` and lock file) and `modules/ROOT/examples/abap-lab/` (README.md, pinned `package.json` and lock file, `abap_transpile.json`, `abaplint.json`, `setup.mjs`, `src/`). Both were run in a copy or removed after the run: `npm test` passes in both, `cds watch` serves, `npm run lint` reports 0 findings.
  - [x] Task 6.1. `sap-lab/` with the CAP project `expenses` (db/, srv/, app/, `.http` files, `package.json` pinned) and a README stating the account-free rule
  - [x] Task 6.2. `abap-lab/` with the abaplint/open-abap project template and `abaplint.json`
  - [x] Task 6.3. Pin every dependency version; the `ledger` and `people` teaching models are created by their guide tasks
- [x] Task 7. Add `scripts/sap-docs/audit-beginner.mjs` and the `audit:sap-beginner` npm script _(javascript)_
  - Done: `scripts/sap-docs/audit-beginner.mjs`, `scripts/sap-docs/audit-beginner.test.mjs` (12 tests pass with `node --test`), fixtures under `scripts/sap-docs/fixtures/`, npm scripts `audit:sap-beginner` and `test:sap-docs`. Exempt from the audit: `index.adoc`, `guide-*`, `glossary*`, `cheat-sheet*`, `bibliography.adoc`.
  - [x] Task 7.1. For every non-guide, non-index `.adoc` under `programming-languages/abap/` and `erp/`, check the plain-words intro, `== Key terms`, `== Summary` and a glossary link for every key term; guide pages keep the guide template and are exempt
  - [x] Task 7.2. Add `scripts/sap-docs/audit-beginner.test.mjs` with fixtures for a passing and a failing page and run it with `node --test`
- [x] Task 8. Add the shared page skeletons used by every page task: `scripts/sap-docs/page-template.adoc` (header, AI notice include, plain-words intro, `== Before you read`, `== Key terms`, `== Summary`, `== References`) and `scripts/sap-docs/guide-template.adoc`
  - Done: `scripts/sap-docs/page-template.adoc` (passes the audit) and `scripts/sap-docs/guide-template.adoc` (headings tested in order).

### Group 2 — Figure generator, themes and shells (Parallelizable: no — the shared-module refactor must leave the Grafana/Kibana output unchanged and every later guide depends on the generator)

The generator extends `scripts/monitoring-guides/`; the shared-module refactor must leave the Grafana/Kibana output unchanged, so this group is sequential.

- [x] Task 9. Factor the product-neutral modules of `scripts/monitoring-guides/lib/` (`blocks.mjs`, `render.mjs`, `text.mjs`, `tokens.mjs`) into a shared location imported by both generators _(javascript)_
  - Done: moved blocks/render/text/tokens to `scripts/figure-lib/`; `scripts/monitoring-guides/lib/` re-exports them (render keeps the monitoring file naming). `npm run guides:figures` wrote 0 changed of 526 figures; `npm run test:guides` 16 pass; no Grafana/Kibana SVG changed.
  - [x] Task 9.1. Move or re-export without changing behaviour; run `npm run guides:figures` and `npm run test:guides` and confirm the Grafana and Kibana SVGs are byte-identical (`git status` shows no change under `modules/ROOT/images/`)
    - Done: `git status` shows nothing modified under `modules/ROOT/images/` (only the four new SAP maps are untracked).
- [x] Task 10. Add the themes `scripts/sap-guides/themes/{sap-fiori,vscode,terminal,browser}.mjs` _(javascript)_
  - Done: `scripts/sap-guides/themes/{sap-fiori,vscode,terminal,browser}.mjs`, all pass the token contract.
  - [x] Task 10.1. Read the Fiori Horizon colours from the open-source theming base content (record its licence in the file header) and from the running lab, never from memory
    - Done: Horizon values read from OpenUI5 1.154.0 `base.less` (Apache-2.0, licence in the header) and confirmed on the running lab preview (computed styles); VS Code values from the editor's own theme files and colour registry (1.135.0).
  - [x] Task 10.2. Only the annotation marks (highlight, callout) use the site accent
    - Done: the annotation marks keep the site accent (shared `highlight` and `callout` blocks); themes hold product colours only.
- [x] Task 11. Add `scripts/sap-guides/lib/sap-shells.mjs`: Fiori elements list report and object page, UI5 app frame, VS Code with explorer/editor/terminal, browser with OData output, terminal _(javascript)_
  - Done: `scripts/sap-guides/lib/sap-shells.mjs` (Fiori list report and object page, UI5 app frame, VS Code, browser, terminal).
  - [x] Task 11.1. No SAP logos: the shell bar shows a neutral placeholder mark; product names only as text where the real screen shows them
    - Done: neutral placeholder mark in the shell bar; no logo block anywhere (test checks it).
- [x] Task 12. Add `scripts/sap-guides/generate-figures.mjs`, `lib/guide-maps.mjs` and `figures/` with the output naming `sap-<area>-guide-<id>-<nn>-<what>.svg` and `sap-<area>-map-<screen>.svg` _(javascript)_
  - Done: `generate-figures.mjs`, `lib/guide-maps.mjs`; naming `sap-<area>-guide-<guide>-<nn>-<what>.svg` and `sap-<area>-map-<screen>.svg` (areas abap, general, finance, hr).
  - [x] Task 12.1. Add the npm scripts `sap-guides:figures [spec]` and `test:sap-guides`
    - Done: npm scripts `sap-guides:figures` and `test:sap-guides` in package.json.
  - [x] Task 12.2. Add `generate-figures.test.mjs` with the checks of `test:guides`: themes exist, figures up to date and not orphaned, each guide figure referenced by exactly one page, every step group has a figure, no spec hard-codes a colour, no text wider than its box
    - Done: `scripts/sap-guides/generate-figures.test.mjs`, 15 tests pass.
- [x] Task 13. Draw the four screen maps (Fiori elements list report, Fiori elements object page, VS Code with the CAP project, abaplint/open-abap terminal workflow) as specs `figures/sap-maps.mjs` _(javascript)_
  - Done: `figures/sap-maps.mjs` renders four maps, reviewed as PNG; the SVGs await their guides (orphan until Groups 17-18 reference them).
- [x] Task 14. Add the "SAP guides" section to `CLAUDE.md` beside "Monitoring guides": the no-account rule, the lab, naming, generator, maps, the no-logo rule
  - Done: "SAP guides" section and three command lines added to `CLAUDE.md`.

### Group 3 — ABAP basics and internal tables (Parallelizable: yes)

- [x] Task 15. Write `programming-languages/abap/getting-started.adoc` — Getting Started _(outline comment 1, item 1)_
- [x] Task 16. Write `programming-languages/abap/programming-concepts-for-newcomers.adoc` — Programming Concepts for Newcomers _(outline comment 1, item 2)_
- [x] Task 17. Write `programming-languages/abap/abap-language-versions-and-released-apis.adoc` — Language Versions and Released APIs _(outline comment 1, item 4)_
- [x] Task 18. Write `programming-languages/abap/adt-eclipse-setup.adoc` — ABAP Development Tools (ADT) _(outline comment 1, item 5)_
- [x] Task 19. Write `programming-languages/abap/classic-tools-se80-and-se11.adoc` — Classic Tools: SE80, SE38, SE11, SE37 and SE16 _(outline comment 1, item 6)_
- [x] Task 20. Write `programming-languages/abap/program-types-and-structure.adoc` — Program Types and Structure _(outline comment 1, item 7)_
- [x] Task 21. Write `programming-languages/abap/memory-organization-and-sessions.adoc` — Memory Organization and Sessions _(outline comment 1, item 8)_
- [x] Task 22. Write `programming-languages/abap/whats-new-in-abap.adoc` — What's New in ABAP _(outline comment 1, item 9)_
- [x] Task 23. Write `programming-languages/abap/data-types-and-data-objects.adoc` — Data Types and Data Objects _(outline comment 1, item 10)_
- [x] Task 24. Write `programming-languages/abap/expressions-and-operators.adoc` — Expressions, Operators and Assignments _(outline comment 1, item 11)_
- [x] Task 25. Write `programming-languages/abap/constructor-expressions.adoc` — Constructor Expressions _(outline comment 1, item 12)_
- [x] Task 26. Write `programming-languages/abap/strings-and-string-templates.adoc` — Strings, String Templates and Regular Expressions _(outline comment 1, item 13)_
- [x] Task 27. Write `programming-languages/abap/control-flow.adoc` — Control Flow _(outline comment 1, item 14)_
- [x] Task 28. Write `programming-languages/abap/date-time-and-numeric-functions.adoc` — Dates, Times and Built-in Functions _(outline comment 1, item 15)_
- [x] Task 29. Write `programming-languages/abap/currencies-units-and-conversions.adoc` — Currencies, Units and Conversion Exits _(outline comment 1, item 16)_
- [x] Task 30. Write `programming-languages/abap/messages.adoc` — Messages _(outline comment 1, item 17)_
- [x] Task 31. Write `programming-languages/abap/text-elements-and-translation.adoc` — Text Elements and Translation _(outline comment 1, item 18)_
- [x] Task 32. Write `programming-languages/abap/internal-tables.adoc` — Internal Tables _(outline comment 1, item 19)_
- [x] Task 33. Write `programming-languages/abap/table-expressions-and-keys.adoc` — Table Expressions and Secondary Keys _(outline comment 1, item 20)_
- [x] Task 34. Write `programming-languages/abap/internal-tables-processing-and-grouping.adoc` — Looping, Grouping and Control Levels _(outline comment 1, item 21)_

### Group 4 — ABAP SQL, Dictionary and CDS (Parallelizable: yes)

- [x] Task 35. Write `programming-languages/abap/abap-sql-basics.adoc` — ABAP SQL: Reading Data _(outline comment 1, item 22)_
- [x] Task 36. Write `programming-languages/abap/abap-sql-joins-ctes-and-window-functions.adoc` — Joins, CTEs, Window Functions and Path Expressions _(outline comment 1, item 23)_
- [x] Task 37. Write `programming-languages/abap/abap-sql-writing-data.adoc` — ABAP SQL: Writing Data _(outline comment 1, item 24)_
- [x] Task 38. Write `programming-languages/abap/native-sql-adbc-and-amdp.adoc` — Native SQL, ADBC and AMDP _(outline comment 1, item 25)_
- [x] Task 39. Write `programming-languages/abap/abap-for-sap-hana-and-code-pushdown.adoc` — ABAP for SAP HANA and Code Pushdown _(outline comment 1, item 26)_
- [x] Task 40. Write `programming-languages/abap/hana-search-and-predictive-functions.adoc` — SAP HANA Search and Predictive Functions from ABAP _(outline comment 1, item 27)_
- [x] Task 41. Write `programming-languages/abap/ddic-domains-and-data-elements.adoc` — Domains and Data Elements _(outline comment 1, item 28)_
- [x] Task 42. Write `programming-languages/abap/ddic-tables-and-structures.adoc` — Database Tables and Structures _(outline comment 1, item 29)_
- [x] Task 43. Write `programming-languages/abap/ddic-foreign-keys-and-indexes.adoc` — Foreign Keys, Check Tables and Indexes _(outline comment 1, item 30)_
- [x] Task 44. Write `programming-languages/abap/ddic-views-and-search-helps.adoc` — Dictionary Views and Search Helps _(outline comment 1, item 31)_
- [x] Task 45. Write `programming-languages/abap/locks-and-enqueue.adoc` — Lock Objects and the SAP Lock Concept _(outline comment 1, item 32)_
- [x] Task 46. Write `programming-languages/abap/cds-view-entities.adoc` — CDS View Entities _(outline comment 1, item 33)_
- [x] Task 47. Write `programming-languages/abap/cds-associations.adoc` — CDS Associations and Compositions _(outline comment 1, item 34)_
- [x] Task 48. Write `programming-languages/abap/cds-annotations-and-metadata-extensions.adoc` — CDS Annotations and Metadata Extensions _(outline comment 1, item 35)_
- [x] Task 49. Write `programming-languages/abap/cds-access-control.adoc` — CDS Access Control (DCL) _(outline comment 1, item 36)_
- [x] Task 50. Write `programming-languages/abap/cds-table-functions-and-advanced-features.adoc` — Table Functions, Hierarchies, Custom Entities and Aspects _(outline comment 1, item 37)_

### Group 5 — ABAP Objects, modularization and classic user interfaces (Parallelizable: yes)

- [x] Task 51. Write `programming-languages/abap/classes-and-objects.adoc` — Classes and Objects _(outline comment 1, item 38)_
- [x] Task 52. Write `programming-languages/abap/interfaces-and-inheritance.adoc` — Interfaces, Inheritance and Polymorphism _(outline comment 1, item 39)_
- [x] Task 53. Write `programming-languages/abap/events.adoc` — Events _(outline comment 1, item 40)_
- [x] Task 54. Write `programming-languages/abap/exceptions.adoc` — Class-Based Exceptions _(outline comment 1, item 41)_
- [x] Task 55. Write `programming-languages/abap/rtti-and-dynamic-programming.adoc` — RTTI, RTTC and Dynamic Programming _(outline comment 1, item 42)_
- [x] Task 56. Write `programming-languages/abap/design-patterns-in-abap.adoc` — Design Patterns in ABAP _(outline comment 1, item 43)_
- [x] Task 57. Write `programming-languages/abap/object-services-and-persistence.adoc` — Object Services: Persistence and Transaction Services _(outline comment 1, item 44)_
- [x] Task 58. Write `programming-languages/abap/modularization-overview.adoc` — Modularization Overview _(outline comment 1, item 45)_
- [x] Task 59. Write `programming-languages/abap/function-modules-and-function-groups.adoc` — Function Modules and Function Groups _(outline comment 1, item 46)_
- [x] Task 60. Write `programming-languages/abap/calling-programs-and-memory.adoc` — Calling Programs, Transactions and Memory _(outline comment 1, item 47)_
- [x] Task 61. Write `programming-languages/abap/classic-reports-and-events.adoc` — Classic Reports and Event Blocks _(outline comment 1, item 48)_
- [x] Task 62. Write `programming-languages/abap/selection-screens.adoc` — Selection Screens and Variants _(outline comment 1, item 49)_
- [x] Task 63. Write `programming-languages/abap/classic-lists-and-interactive-reports.adoc` — Classic Lists and Interactive Reports _(outline comment 1, item 50)_
- [x] Task 64. Write `programming-languages/abap/alv.adoc` — ALV (SAP List Viewer) _(outline comment 1, item 51)_
- [x] Task 65. Write `programming-languages/abap/dynpros-and-module-pools.adoc` — Dynpros, Module Pools and Transactions _(outline comment 1, item 52)_
- [x] Task 66. Write `programming-languages/abap/control-framework-and-gui-controls.adoc` — Control Framework and GUI Controls _(outline comment 1, item 53)_
- [x] Task 67. Write `programming-languages/abap/forms-sapscript-smart-forms-and-adobe.adoc` — Forms: SAPscript, Smart Forms and SAP Forms by Adobe _(outline comment 1, item 54)_
- [x] Task 68. Write `programming-languages/abap/sap-query-and-quickviewer.adoc` — SAP Query and QuickViewer _(outline comment 1, item 55)_

### Group 6 — RAP, transactions, integration and runtime services (Parallelizable: yes)

- [x] Task 69. Write `programming-languages/abap/rap-overview.adoc` — RAP Overview _(outline comment 1, item 56)_
- [x] Task 70. Write `programming-languages/abap/bopf-and-the-fiori-programming-model.adoc` — BOPF and the ABAP Programming Model for SAP Fiori _(outline comment 1, item 57)_
- [x] Task 71. Write `programming-languages/abap/rap-behavior-definitions.adoc` — Behavior Definitions and Implementations _(outline comment 1, item 58)_
- [x] Task 72. Write `programming-languages/abap/rap-managed-and-unmanaged.adoc` — Managed, Unmanaged and Unmanaged Save _(outline comment 1, item 59)_
- [x] Task 73. Write `programming-languages/abap/eml.adoc` — Entity Manipulation Language (EML) _(outline comment 1, item 60)_
- [x] Task 74. Write `programming-languages/abap/rap-draft.adoc` — Draft Handling _(outline comment 1, item 61)_
- [x] Task 75. Write `programming-languages/abap/rap-services-and-odata-v4.adoc` — Projections, Service Definitions and OData V4 Bindings _(outline comment 1, item 62)_
- [x] Task 76. Write `programming-languages/abap/rap-authorization-and-concurrency.adoc` — RAP Authorization, Locking and Concurrency _(outline comment 1, item 63)_
- [x] Task 77. Write `programming-languages/abap/rap-business-events.adoc` — RAP Business Events _(outline comment 1, item 64)_
- [x] Task 78. Write `programming-languages/abap/sap-luw-and-update-tasks.adoc` — SAP LUW, Update Tasks and Commit _(outline comment 1, item 65)_
- [x] Task 79. Write `programming-languages/abap/authority-checks.adoc` — Authorization Checks _(outline comment 1, item 66)_
- [x] Task 80. Write `programming-languages/abap/background-processing.adoc` — Background Jobs and Parallel Processing _(outline comment 1, item 67)_
- [x] Task 81. Write `programming-languages/abap/rfc-bapis-and-idocs.adoc` — RFC, BAPIs and IDocs _(outline comment 1, item 68)_
- [x] Task 82. Write `programming-languages/abap/outbound-http-json-and-xml.adoc` — HTTP Clients, JSON and XML Transformations _(outline comment 1, item 69)_
- [x] Task 83. Write `programming-languages/abap/abap-channels-apc-and-amc.adoc` — ABAP Channels: APC and AMC _(outline comment 1, item 70)_
- [x] Task 84. Write `programming-languages/abap/enhancements-and-badis.adoc` — Enhancements and BAdIs _(outline comment 1, item 71)_
- [x] Task 85. Write `programming-languages/abap/modifications-and-modification-assistant.adoc` — Modifications, Modification Assistant and SPAU/SPDD _(outline comment 1, item 72)_
- [x] Task 86. Write `programming-languages/abap/batch-input-and-data-migration.adoc` — Batch Input, Direct Input and Data Migration _(outline comment 1, item 73)_
- [x] Task 87. Write `programming-languages/abap/files-and-frontend-services.adoc` — Files: Application Server and Front End _(outline comment 1, item 74)_

### Group 7 — ABAP quality, tools, delivery and evolution (Parallelizable: yes)

- [x] Task 88. Write `programming-languages/abap/abap-unit-and-test-doubles.adoc` — ABAP Unit and Test Doubles _(outline comment 1, item 75)_
- [x] Task 89. Write `programming-languages/abap/debugging.adoc` — Debugging _(outline comment 1, item 76)_
- [x] Task 90. Write `programming-languages/abap/performance-and-sql-trace.adoc` — Performance, SQL Trace and Profiling _(outline comment 1, item 77)_
- [x] Task 91. Write `programming-languages/abap/atc-and-code-inspector.adoc` — ABAP Test Cockpit (ATC) _(outline comment 1, item 78)_
- [x] Task 92. Write `programming-languages/abap/transports-packages-and-gcts.adoc` — Packages, Transports, gCTS and abapGit _(outline comment 1, item 79)_
- [x] Task 93. Write `programming-languages/abap/coding-standards-and-clean-abap.adoc` — Coding Standards and Clean ABAP _(outline comment 1, item 80)_
- [x] Task 94. Write `programming-languages/abap/clean-core-and-cloud-readiness.adoc` — Clean Core and Cloud Readiness _(outline comment 1, item 81)_
- [x] Task 95. Write `programming-languages/abap/obsolete-language-elements.adoc` — Obsolete Language Elements _(outline comment 1, item 82)_
- [x] Task 96. Write `programming-languages/abap/migrating-classic-code-to-abap-cloud.adoc` — Migrating Classic Code to ABAP Cloud _(outline comment 1, item 83)_

### Group 8 — SAP basics, business fundamentals and administration (Parallelizable: yes)

- [x] Task 97. Write `erp/sap/what-is-sap.adoc` — What Is SAP _(outline comment 2, item 3)_
- [x] Task 98. Write `erp/sap/deployment-options.adoc` — Deployment Options _(outline comment 2, item 4)_
- [x] Task 99. Write `erp/sap/architecture-and-virtual-data-model.adoc` — Architecture and the Virtual Data Model _(outline comment 2, item 5)_
- [x] Task 100. Write `erp/sap/sap-gui-basics.adoc` — SAP GUI Basics _(outline comment 2, item 6)_
- [x] Task 101. Write `erp/sap/fiori-launchpad.adoc` — SAP Fiori Launchpad _(outline comment 2, item 7)_
- [x] Task 102. Write `erp/sap/clients-and-system-landscape.adoc` — Clients and the System Landscape _(outline comment 2, item 8)_
- [x] Task 103. Write `erp/sap/organizational-structures.adoc` — Organizational Structures _(outline comment 2, item 9)_
- [x] Task 104. Write `erp/sap/master-data-and-business-partner.adoc` — Master Data and the Business Partner _(outline comment 2, item 10)_
- [x] Task 105. Write `erp/sap/end-to-end-processes.adoc` — End-to-End Processes _(outline comment 2, item 11)_
- [x] Task 106. Write `erp/sap/customizing-and-implementation-guide.adoc` — Customizing and the IMG _(outline comment 2, item 12)_
- [x] Task 107. Write `erp/sap/implementation-projects-and-go-live.adoc` — Implementation Projects and Go-Live _(outline comment 2, item 13)_
- [x] Task 108. Write `erp/sap/transports-and-change-management.adoc` — Transports and Change Management _(outline comment 2, item 14)_
- [x] Task 109. Write `erp/sap/users-roles-and-authorizations.adoc` — Users, Roles and Authorizations _(outline comment 2, item 15)_
- [x] Task 110. Write `erp/sap/security-and-operations.adoc` — Security and Operations _(outline comment 2, item 16)_
- [x] Task 111. Write `erp/overview.adoc` — ERP Overview, with the SVG `erp-integrated-modules.svg` _(outline comment 2, ERP section)_

### Group 9 — SAP BTP and CAP (Parallelizable: yes)

- [x] Task 112. Write `erp/sap/btp-account-model.adoc` — SAP BTP Account Model _(outline comment 2, item 17)_
- [x] Task 113. Write `erp/sap/btp-environments-cloud-foundry-and-kyma.adoc` — Cloud Foundry and Kyma Environments _(outline comment 2, item 18)_
- [x] Task 114. Write `erp/sap/btp-connectivity-and-destinations.adoc` — Connectivity, Destinations and Cloud Connector _(outline comment 2, item 19)_
- [x] Task 115. Write `erp/sap/btp-security-xsuaa-and-identity.adoc` — Security: XSUAA and Cloud Identity Services _(outline comment 2, item 20)_
- [x] Task 116. Write `erp/sap/cap-getting-started.adoc` — CAP Getting Started _(outline comment 2, item 21)_
- [x] Task 117. Write `erp/sap/cap-concepts.adoc` — CAP Concepts _(outline comment 2, item 22)_
- [x] Task 118. Write `erp/sap/cap-domain-modeling.adoc` — CAP Domain Modeling _(outline comment 2, item 23)_
- [x] Task 119. Write `erp/sap/cap-services-and-handlers-nodejs.adoc` — Services and Custom Handlers in Node.js _(outline comment 2, item 24)_
- [x] Task 120. Write `erp/sap/cap-java.adoc` — CAP Java _(outline comment 2, item 25)_
- [x] Task 121. Write `erp/sap/cap-security.adoc` — CAP Security _(outline comment 2, item 26)_
- [x] Task 122. Write `erp/sap/cap-consuming-remote-services.adoc` — Consuming SAP APIs from CAP _(outline comment 2, item 27)_
- [x] Task 123. Write `erp/sap/cap-deployment-and-mta.adoc` — Deploying CAP: HANA, XSUAA and MTA _(outline comment 2, item 28)_

### Group 10 — SAP user interfaces, integration and extensibility (Parallelizable: yes)

- [x] Task 124. Write `erp/sap/sapui5-basics.adoc` — SAPUI5 and OpenUI5 Basics _(outline comment 2, item 29)_
- [x] Task 125. Write `erp/sap/fiori-elements.adoc` — SAP Fiori Elements _(outline comment 2, item 30)_
- [x] Task 126. Write `erp/sap/fiori-design-guidelines.adoc` — SAP Fiori Design Guidelines _(outline comment 2, item 31)_
- [x] Task 127. Write `erp/sap/deploying-apps-to-the-fiori-launchpad.adoc` — Deploying Apps to the SAP Fiori Launchpad _(outline comment 2, item 32)_
- [x] Task 128. Write `erp/sap/odata-and-sap-gateway.adoc` — OData and SAP Gateway _(outline comment 2, item 33)_
- [x] Task 129. Write `erp/sap/integration-suite-and-business-accelerator-hub.adoc` — SAP Integration Suite and Business Accelerator Hub _(outline comment 2, item 34)_
- [x] Task 130. Write `erp/sap/api-management.adoc` — API Management _(outline comment 2, item 35)_
- [x] Task 131. Write `erp/sap/business-events.adoc` — Business Events _(outline comment 2, item 36)_
- [x] Task 132. Write `erp/sap/rfc-bapi-idoc-and-soap-integration.adoc` — RFC, BAPI, IDoc and SOAP Integration _(outline comment 2, item 37)_
- [x] Task 133. Write `erp/sap/extensibility-and-clean-core.adoc` — Extensibility and Clean Core _(outline comment 2, item 38)_
- [x] Task 134. Write `erp/sap/key-user-extensibility.adoc` — Key-User Extensibility _(outline comment 2, item 39)_
- [x] Task 135. Write `erp/sap/sap-hana-basics.adoc` — SAP HANA Basics _(outline comment 2, item 40)_
- [x] Task 136. Write `erp/sap/sap-build-low-code.adoc` — SAP Build _(outline comment 2, item 41)_
- [x] Task 137. Write `erp/sap/ci-cd-and-testing.adoc` — CI/CD and Testing _(outline comment 2, item 42)_
- [x] Task 138. Write `erp/sap/joule-and-business-ai.adoc` — Joule and Business AI _(outline comment 2, item 43)_

### Group 11 — Finance foundations and General Ledger (Parallelizable: yes)

- [x] Task 139. Write `erp/sap/finance/accounting-basics.adoc` — Accounting Basics _(outline comment 3, item 1)_
- [x] Task 140. Write `erp/sap/finance/finance-overview.adoc` — Finance Overview _(outline comment 3, item 2)_
- [x] Task 141. Write `erp/sap/finance/organizational-units.adoc` — Organizational Units in Finance _(outline comment 3, item 3)_
- [x] Task 142. Write `erp/sap/finance/fiscal-year-and-posting-periods.adoc` — Fiscal Year Variants and Posting Periods _(outline comment 3, item 4)_
- [x] Task 143. Write `erp/sap/finance/charts-of-accounts-and-gl-accounts.adoc` — Charts of Accounts and G/L Accounts _(outline comment 3, item 5)_
- [x] Task 144. Write `erp/sap/finance/ledgers-and-currencies.adoc` — Ledgers, Currencies and Exchange Rates _(outline comment 3, item 6)_
- [x] Task 145. Write `erp/sap/finance/universal-parallel-accounting.adoc` — Universal Parallel Accounting _(outline comment 3, item 7)_
- [x] Task 146. Write `erp/sap/finance/universal-journal.adoc` — The Universal Journal (ACDOCA) _(outline comment 3, item 8)_
- [x] Task 147. Write `erp/sap/finance/journal-entries-document-types-and-posting-keys.adoc` — Journal Entries, Document Types and Posting Keys _(outline comment 3, item 9)_
- [x] Task 148. Write `erp/sap/finance/number-ranges-field-status-and-tolerance-groups.adoc` — Number Ranges, Field Status Variants and Tolerance Groups _(outline comment 3, item 10)_
- [x] Task 149. Write `erp/sap/finance/document-splitting.adoc` — Document Splitting _(outline comment 3, item 11)_
- [x] Task 150. Write `erp/sap/finance/account-determination-and-automatic-postings.adoc` — Account Determination and Automatic Postings _(outline comment 3, item 12)_
- [x] Task 151. Write `erp/sap/finance/open-items-and-clearing.adoc` — Open Item Management and Clearing _(outline comment 3, item 13)_

### Group 12 — Finance AP/AR, assets, bank and Controlling (Parallelizable: yes)

- [x] Task 152. Write `erp/sap/finance/business-partners-customers-and-suppliers.adoc` — Business Partners as Customers and Suppliers _(outline comment 3, item 14)_
- [x] Task 153. Write `erp/sap/finance/accounts-payable.adoc` — Accounts Payable _(outline comment 3, item 15)_
- [x] Task 154. Write `erp/sap/finance/accounts-receivable-dunning-and-credit.adoc` — Accounts Receivable, Dunning and Credit Management _(outline comment 3, item 16)_
- [x] Task 155. Write `erp/sap/finance/automatic-payment-program.adoc` — Automatic Payment Program (F110) _(outline comment 3, item 17)_
- [x] Task 156. Write `erp/sap/finance/payment-terms-and-cash-discount.adoc` — Payment Terms, Cash Discount and Installment Plans _(outline comment 3, item 18)_
- [x] Task 157. Write `erp/sap/finance/special-gl-transactions.adoc` — Special G/L Transactions _(outline comment 3, item 19)_
- [x] Task 158. Write `erp/sap/finance/asset-accounting.adoc` — Asset Accounting _(outline comment 3, item 20)_
- [x] Task 159. Write `erp/sap/finance/bank-accounting-and-cash-management.adoc` — Bank Accounting and Cash Management _(outline comment 3, item 21)_
- [x] Task 160. Write `erp/sap/finance/cash-journal.adoc` — Cash Journal _(outline comment 3, item 22)_
- [x] Task 161. Write `erp/sap/finance/tax.adoc` — Tax Codes and Tax Calculation _(outline comment 3, item 23)_
- [x] Task 162. Write `erp/sap/finance/controlling-overview-and-cost-elements.adoc` — Controlling Overview and Cost Elements _(outline comment 3, item 24)_
- [x] Task 163. Write `erp/sap/finance/cost-centers-and-internal-orders.adoc` — Cost Centers and Internal Orders _(outline comment 3, item 25)_
- [x] Task 164. Write `erp/sap/finance/profit-center-accounting.adoc` — Profit Center Accounting _(outline comment 3, item 26)_
- [x] Task 165. Write `erp/sap/finance/planning-and-budgeting.adoc` — Planning and Budgeting _(outline comment 3, item 27)_
- [x] Task 166. Write `erp/sap/finance/allocations.adoc` — Allocations: Assessment, Distribution and Activity Allocation _(outline comment 3, item 28)_
- [x] Task 167. Write `erp/sap/finance/product-costing-and-material-ledger.adoc` — Product Costing and the Material Ledger _(outline comment 3, item 29)_
- [x] Task 168. Write `erp/sap/finance/margin-analysis.adoc` — Margin Analysis (Profitability Analysis) _(outline comment 3, item 30)_
- [x] Task 169. Write `erp/sap/finance/predictive-accounting.adoc` — Predictive Accounting _(outline comment 3, item 31)_

### Group 13 — Finance closing, reporting and developer topics (Parallelizable: yes)

- [x] Task 170. Write `erp/sap/finance/period-end-closing.adoc` — Period-End Closing _(outline comment 3, item 32)_
- [x] Task 171. Write `erp/sap/finance/group-reporting.adoc` — Group Reporting and Consolidation _(outline comment 3, item 33)_
- [x] Task 172. Write `erp/sap/finance/financial-reporting-and-analytics.adoc` — Financial Reporting and Embedded Analytics _(outline comment 3, item 34)_
- [x] Task 173. Write `erp/sap/finance/financial-statement-versions.adoc` — Financial Statement Versions _(outline comment 3, item 35)_
- [x] Task 174. Write `erp/sap/finance/finance-apis.adoc` — Finance APIs _(outline comment 3, item 36)_
- [x] Task 175. Write `erp/sap/finance/bapi-acc-document-post.adoc` — Posting from ABAP: BAPI_ACC_DOCUMENT_POST _(outline comment 3, item 37)_
- [x] Task 176. Write `erp/sap/finance/substitutions-validations-and-badis.adoc` — Substitutions, Validations and BAdIs _(outline comment 3, item 38)_
- [x] Task 177. Write `erp/sap/finance/transactions-and-fiori-apps.adoc` — Finance Transactions and Fiori Apps _(outline comment 3, item 39)_
- [x] Task 178. Write `erp/sap/finance/finance-implementation-migration-and-testing.adoc` — Finance Implementation, Migration and Testing _(outline comment 3, item 40)_

### Group 14 — HR foundations, OM/PA and Time Management (Parallelizable: yes)

- [x] Task 179. Write `erp/sap/human-resources/hr-and-payroll-basics.adoc` — HR and Payroll Basics _(outline comment 3, item 43)_
- [x] Task 180. Write `erp/sap/human-resources/hr-landscape-hcm-h4s4-and-successfactors.adoc` — SAP HCM, H4S4 and SuccessFactors _(outline comment 3, item 44)_
- [x] Task 181. Write `erp/sap/human-resources/enterprise-and-personnel-structure.adoc` — Enterprise and Personnel Structure _(outline comment 3, item 45)_
- [x] Task 182. Write `erp/sap/human-resources/organizational-management.adoc` — Organizational Management _(outline comment 3, item 46)_
- [x] Task 183. Write `erp/sap/human-resources/infotypes.adoc` — Infotypes _(outline comment 3, item 47)_
- [x] Task 184. Write `erp/sap/human-resources/hr-data-structures-and-tables.adoc` — HR Data Structures and Tables _(outline comment 3, item 48)_
- [x] Task 185. Write `erp/sap/human-resources/time-constraints-and-validity.adoc` — Time Constraints and Validity Periods _(outline comment 3, item 49)_
- [x] Task 186. Write `erp/sap/human-resources/personnel-actions.adoc` — Personnel Actions and Master Data Maintenance _(outline comment 3, item 50)_
- [x] Task 187. Write `erp/sap/human-resources/time-management.adoc` — Time Management Basics _(outline comment 3, item 51)_
- [x] Task 188. Write `erp/sap/human-resources/time-evaluation.adoc` — Time Evaluation (RPTIME00) _(outline comment 3, item 52)_

### Group 15 — HR payroll, self-services and HR ABAP (Parallelizable: yes)

- [x] Task 189. Write `erp/sap/human-resources/payroll-process.adoc` — The Payroll Process _(outline comment 3, item 53)_
- [x] Task 190. Write `erp/sap/human-resources/payroll-schemas-and-pcrs.adoc` — Payroll Schemas and Personnel Calculation Rules _(outline comment 3, item 54)_
- [x] Task 191. Write `erp/sap/human-resources/wage-types-and-payroll-results.adoc` — Wage Types, Internal Tables and Payroll Results _(outline comment 3, item 55)_
- [x] Task 192. Write `erp/sap/human-resources/factoring-and-retroactive-accounting.adoc` — Partial Periods and Retroactive Accounting _(outline comment 3, item 56)_
- [x] Task 193. Write `erp/sap/human-resources/posting-payroll-to-accounting.adoc` — Posting Payroll to Accounting _(outline comment 3, item 57)_
- [x] Task 194. Write `erp/sap/human-resources/employee-and-manager-self-services.adoc` — Employee and Manager Self-Services _(outline comment 3, item 58)_
- [x] Task 195. Write `erp/sap/human-resources/hr-authorizations.adoc` — HR Authorizations _(outline comment 3, item 59)_
- [x] Task 196. Write `erp/sap/human-resources/data-privacy-blocking-and-destruction.adoc` — Data Privacy: Blocking and Destruction _(outline comment 3, item 60)_
- [x] Task 197. Write `erp/sap/human-resources/hr-abap-logical-databases-and-macros.adoc` — Logical Databases PNP/PNPCE and HR Macros _(outline comment 3, item 61)_
- [x] Task 198. Write `erp/sap/human-resources/reading-and-writing-infotypes.adoc` — Reading and Writing Infotypes _(outline comment 3, item 62)_
- [x] Task 199. Write `erp/sap/human-resources/custom-infotypes-and-enhancements.adoc` — Custom Infotypes and Enhancements _(outline comment 3, item 63)_
- [x] Task 200. Write `erp/sap/human-resources/hr-reporting-tools.adoc` — HR Reporting Tools _(outline comment 3, item 64)_
- [x] Task 201. Write `erp/sap/human-resources/custom-hr-reports-and-performance.adoc` — Custom HR Reports and Performance _(outline comment 3, item 65)_
- [x] Task 202. Write `erp/sap/human-resources/hr-forms-and-payslips.adoc` — HR Forms and Payslips _(outline comment 3, item 66)_
- [x] Task 203. Write `erp/sap/human-resources/hr-interfaces-and-data-conversion.adoc` — HR Interfaces and Data Conversion _(outline comment 3, item 67)_

### Group 16 — SuccessFactors and integration (Parallelizable: yes)

- [x] Task 204. Write `erp/sap/human-resources/successfactors-overview.adoc` — SAP SuccessFactors Overview _(outline comment 3, item 68)_
- [x] Task 205. Write `erp/sap/human-resources/employee-central-data-models.adoc` — Employee Central Data Models and MDF _(outline comment 3, item 69)_
- [x] Task 206. Write `erp/sap/human-resources/successfactors-odata-api.adoc` — SuccessFactors OData API _(outline comment 3, item 70)_
- [x] Task 207. Write `erp/sap/human-resources/successfactors-talent-modules.adoc` — Recruiting, Onboarding, Performance, Compensation and Learning _(outline comment 3, item 71)_
- [x] Task 208. Write `erp/sap/human-resources/employee-central-payroll.adoc` — Employee Central Payroll _(outline comment 3, item 72)_
- [x] Task 209. Write `erp/sap/human-resources/ec-to-s4hana-integration.adoc` — Employee Central to SAP S/4HANA Integration _(outline comment 3, item 73)_
- [x] Task 210. Write `erp/sap/human-resources/hire-to-retire.adoc` — Hire to Retire, End to End _(outline comment 3, item 74)_

### Group 17 — Pilot guides (Parallelizable: no — the pilots tune the guide template and the generator that every other guide copies)

The pilots tune the guide template, the shells and the rules brief that every other guide copies, so they are done first and in order.

- [x] Task 211. Pilot guide `programming-languages/abap/guide-first-abap-program.adoc` — Your First ABAP Program: page, figure spec `scripts/sap-guides/figures/abap-<id>.mjs`, its SVGs, and its runnable code under `modules/ROOT/examples/`; run it end to end on the lab first _(outline comment 4, abap guide 2)_
  - [x] Task 211.1. Record any template or generator change this pilot forced into `scripts/sap-guides/brief/guide-rules.md`
  - [x] Task 211.2. Show the guide steps to the lab output; a step the lab cannot run is dropped, never imitated
- [x] Task 212. Pilot guide `erp/sap/guide-first-cap-service.adoc` — Your First CAP Service: page, figure spec `scripts/sap-guides/figures/sap-<id>.mjs`, its SVGs, and its runnable code under `modules/ROOT/examples/`; run it end to end on the lab first _(outline comment 4, sap guide 1)_
  - [x] Task 212.1. Record any template or generator change this pilot forced into `scripts/sap-guides/brief/guide-rules.md`
  - [x] Task 212.2. Show the guide steps to the lab output; a step the lab cannot run is dropped, never imitated
- [x] Task 213. Pilot guide `erp/sap/guide-cap-fiori-elements-app.adoc` — Add a Fiori Elements App to a CAP Service: page, figure spec `scripts/sap-guides/figures/sap-<id>.mjs`, its SVGs, and its runnable code under `modules/ROOT/examples/`; run it end to end on the lab first _(outline comment 4, sap guide 3)_
  - [x] Task 213.1. Record any template or generator change this pilot forced into `scripts/sap-guides/brief/guide-rules.md`
  - [x] Task 213.2. Show the guide steps to the lab output; a step the lab cannot run is dropped, never imitated
- [x] Task 214. Pilot guide `erp/sap/finance/guide-post-balanced-journal-entries.adoc` — Post Balanced Journal Entries in a Teaching Ledger: page, figure spec `scripts/sap-guides/figures/finance-<id>.mjs`, its SVGs, and its runnable code under `modules/ROOT/examples/`; run it end to end on the lab first _(outline comment 4, finance guide 1)_
  - [x] Task 214.1. Record any template or generator change this pilot forced into `scripts/sap-guides/brief/guide-rules.md`
  - [x] Task 214.2. Show the guide steps to the lab output; a step the lab cannot run is dropped, never imitated
- [x] Task 215. Pilot guide `erp/sap/human-resources/guide-model-employee-records-with-validity-periods.adoc` — Model Employee Records with Validity Periods: page, figure spec `scripts/sap-guides/figures/hr-<id>.mjs`, its SVGs, and its runnable code under `modules/ROOT/examples/`; run it end to end on the lab first _(outline comment 4, hr guide 1)_
  - [x] Task 215.1. Record any template or generator change this pilot forced into `scripts/sap-guides/brief/guide-rules.md`
  - [x] Task 215.2. Show the guide steps to the lab output; a step the lab cannot run is dropped, never imitated

### Group 18 — ABAP guides (Parallelizable: yes)

- [x] Task 216. Write guide `programming-languages/abap/guide-set-up-a-local-abap-playground.adoc` — Set Up a Local ABAP Playground: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 1)_
- [x] Task 217. Write guide `programming-languages/abap/guide-data-types-strings-and-templates.adoc` — Data Types, Strings and String Templates: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 3)_
- [x] Task 218. Write guide `programming-languages/abap/guide-work-with-internal-tables.adoc` — Work with Internal Tables: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 4)_
- [x] Task 219. Write guide `programming-languages/abap/guide-classes-interfaces-and-exceptions.adoc` — Classes, Interfaces and Exceptions: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 5)_
- [x] Task 220. Write guide `programming-languages/abap/guide-write-abap-unit-tests.adoc` — Write ABAP Unit Tests: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 6)_
- [x] Task 221. Write guide `programming-languages/abap/guide-check-code-with-abaplint.adoc` — Check Code against Clean ABAP Rules: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 7)_
- [x] Task 222. Write guide `programming-languages/abap/guide-abap-sql-on-a-local-database.adoc` — ABAP SQL on a Local Database: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, abap guide 8)_

### Group 19 — SAP general guides (Parallelizable: yes)

- [x] Task 223. Write guide `erp/sap/guide-cap-domain-model-and-custom-logic.adoc` — Model a Domain and Add Custom Logic in CAP: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 2)_
- [x] Task 224. Write guide `erp/sap/guide-first-sapui5-app.adoc` — Your First SAPUI5 App: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 4)_
- [x] Task 225. Write guide `erp/sap/guide-query-odata-services.adoc` — Query OData Services: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 5)_
- [x] Task 226. Write guide `erp/sap/guide-secure-a-cap-service.adoc` — Secure a CAP Service with Roles: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 6)_
- [x] Task 227. Write guide `erp/sap/guide-test-cap-and-ui5.adoc` — Test a CAP Service and a UI5 App: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 7)_
- [x] Task 228. Write guide `erp/sap/guide-build-an-mta-archive.adoc` — Package a CAP App as an MTA Archive: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 8)_
- [x] Task 229. Write guide `erp/sap/guide-consume-an-sap-api-from-cap.adoc` — Consume an SAP API Specification in CAP: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, sap guide 9)_

### Group 20 — Finance guides (Parallelizable: yes)

- [x] Task 230. Write guide `erp/sap/finance/guide-follow-purchase-and-sale-postings.adoc` — Follow a Purchase and a Sale through the Ledger: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, finance guide 2)_
- [x] Task 231. Write guide `erp/sap/finance/guide-compute-a-depreciation-schedule.adoc` — Compute a Depreciation Schedule: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, finance guide 3)_
- [x] Task 232. Write guide `erp/sap/finance/guide-allocate-costs-and-read-a-trial-balance.adoc` — Allocate Costs and Read a Trial Balance: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, finance guide 4)_

### Group 21 — HR guides (Parallelizable: yes)

- [x] Task 233. Write guide `erp/sap/human-resources/guide-build-an-org-structure-model.adoc` — Build an Organizational Structure Model: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, hr guide 2)_
- [x] Task 234. Write guide `erp/sap/human-resources/guide-compute-pay-for-a-partial-period.adoc` — Compute Pay for a Partial Period and Gross-to-Net: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, hr guide 3)_
- [x] Task 235. Write guide `erp/sap/human-resources/guide-query-effective-dated-employee-data.adoc` — Query Effective-Dated Employee Data: page following the guide template, figure spec, SVGs, example code run end to end _(outline comment 4, hr guide 4)_

### Group 22 — Lab pages, start-here and glossaries (Parallelizable: yes)

Written after the content pages and guides so each glossary entry links to a page that exists.

- [x] Task 236. Write `programming-languages/abap/hands-on-lab.adoc` — Hands-on Lab _(outline comment 1, item 3)_
  - ABAP hands-on-lab.adoc (lab commands run in a copy; audit ok)
- [x] Task 237. Write `programming-languages/abap/glossary.adoc` — Glossary _(outline comment 1, item 84)_
  - ABAP glossary.adoc, 472 entries, 0 missing, 0 duplicate
- [x] Task 238. Write `erp/sap/start-here.adoc` — Start Here: SAP from Zero _(outline comment 2, item 1)_
  - erp/sap/start-here.adoc with Mermaid learning map
- [x] Task 239. Write `erp/sap/hands-on-lab.adoc` — Hands-on Lab _(outline comment 2, item 2)_
  - erp/sap/hands-on-lab.adoc (expenses, claims-secured, ledger, org-structure tests run in copies)
- [x] Task 240. Write `erp/sap/glossary.adoc` — Glossary _(outline comment 2, item 44)_
  - erp/sap/glossary.adoc, 258 entries, 0 missing, 0 duplicate
- [x] Task 241. Write `erp/sap/finance/glossary.adoc` — Finance Glossary _(outline comment 3, item 41)_
  - finance/glossary.adoc, 269 entries, 0 missing, 0 duplicate
- [x] Task 242. Write `erp/sap/human-resources/glossary.adoc` — HR Glossary _(outline comment 3, item 75)_
  - human-resources/glossary.adoc, 185 entries, 0 missing, 0 duplicate

### Group 23 — Index pages, nav, cards, home page and back-links (Parallelizable: no — the indexes, nav and cards list every page and guide, so all earlier groups must have landed)

The indexes, nav and cards list every page and guide, so all previous groups must have landed.

- [x] Task 243. Write the four index pages with the subsection template and a Mermaid concept map each: `programming-languages/abap/index.adoc`, `erp/sap/index.adoc`, `erp/sap/finance/index.adoc`, `erp/sap/human-resources/index.adoc` — four indexes with Mermaid maps; audit 0 violations.
  - [x] Task 243.1. `== Version baseline`, `== What's covered`, `== Reading path` (three paths), `== Running example`, `== Related material on this site`, `== Bibliography` (summary plus link), `== References` — the Bibliography paragraph has no link yet; Group 24 adds it (scripts/sap-guides/brief/group24-wiring.md).
  - [x] Task 243.2. The `== Sections` text list order equals the nav order equals the card order — What's covered lists mirror the nav groups.
- [x] Task 244. Write `erp/index.adoc` (section index): intro, card grid with the SAP card, `== Sections`, `== Related material on this site`, `== Bibliography`, `== References` — erp/index.adoc, card grid inserted by npm run cards.
- [x] Task 245. Add `partials/nav-abap.adoc` (relative depth, text-only headings with children, ends with the cheat sheet and bibliography) and include it in `nav.adoc` right after `nav-cobol.adoc` — nav-abap.adoc included after nav-cobol; cheat sheet and bibliography entries are listed in group24-wiring.md (the pages do not exist yet).
- [x] Task 246. Add the ERP entries to `nav.adoc` between E-commerce and CMS: the section, Overview, SAP, its general groups, Finance and Human Resources with their groups, the Step-by-step guides group of each area, cheat sheets and bibliography — ERP block in nav.adoc; cheat sheet and bibliography entries are listed in group24-wiring.md.
  - [x] Task 246.1. Every entry is an `xref:` or a text-only heading with children; no `#fragment` links; titles are bare names — test:nav and test:nav:site pass.
- [x] Task 247. Update the cards: `scripts/cards/manifest.mjs` entries for ABAP and SAP, `erp` in `scripts/cards/palette.mjs` `sectionVariant`, the logo decision from Task 5 recorded in `LOGO-SOURCES.md` _(javascript)_ — manifest, palette, home-cards entry and LOGO-SOURCES note; test:cards passes.
- [x] Task 248. Add the hand-made home card `erp.svg` (house structure: logo at (300,170), button `rect` at `y="44x"` then its `text`) and its entry in `modules/ROOT/pages/index.adoc` between E-commerce and CMS; add ERP, SAP, ABAP, S/4HANA, Finance, SAP HCM and SuccessFactors to its `:description:` and `:keywords:` — erp.svg and home page entry; description and keywords extended.
- [x] Task 249. Update `programming-languages/index.adoc` (ABAP card, text-list entry, `:description:`, `:keywords:`, the "live only here" sentence) and run `npm run cards` — ABAP entry, description, keywords and sentence updated; npm run cards run.
- [x] Task 250. Add the back-links: ABAP in `programming-languages/cobol/index.adoc`, ABAP SQL and CDS in `database/sql/index.adoc`, SAP BTP security in `backend/oauth/index.adoc` — back-links added.
- [x] Task 251. Add the `== Try it` link to every reference page whose outline names a guide, now that all guides exist; drop links to guides removed in Task 3 — 52 reference pages got == Try it; plain-text page mentions turned into xrefs; guide-to-guide mentions linked.
- [x] Task 252. Run `npm run cards`, `npm run test:cards`, `npm run test:nav` and `npm run audit:index-template` and fix every report _(javascript)_ — cards, test:cards, test:nav, audit:index-template all pass.

### Group 24 — Cheat sheets and bibliographies (Parallelizable: yes)

- [x] Task 253. Cheat sheet `abap`: content module `scripts/cheat-sheet-pdfs/sheets/abap.mjs` (6-12 boxes, code lines at most 44 characters, built from the finished pages, never from memory), render `modules/ROOT/attachments/abap-cheat-sheet.pdf` as one A4 page, and write `programming-languages/abap/cheat-sheet.adoc` with the download link _(javascript)_
  - [x] Task 253.1. Run `npm run cheat-sheets abap`; the run fails if the sheet spills onto a second page
- [x] Task 254. Cheat sheet `sap`: content module `scripts/cheat-sheet-pdfs/sheets/sap.mjs` (6-12 boxes, code lines at most 44 characters, built from the finished pages, never from memory), render `modules/ROOT/attachments/sap-cheat-sheet.pdf` as one A4 page, and write `erp/sap/cheat-sheet.adoc` with the download link _(javascript)_
  - [x] Task 254.1. Run `npm run cheat-sheets sap`; the run fails if the sheet spills onto a second page
- [x] Task 255. Cheat sheet `sap-finance`: content module `scripts/cheat-sheet-pdfs/sheets/sap-finance.mjs` (6-12 boxes, code lines at most 44 characters, built from the finished pages, never from memory), render `modules/ROOT/attachments/sap-finance-cheat-sheet.pdf` as one A4 page, and write `erp/sap/finance/cheat-sheet.adoc` with the download link _(javascript)_
  - [x] Task 255.1. Run `npm run cheat-sheets sap-finance`; the run fails if the sheet spills onto a second page
- [x] Task 256. Cheat sheet `sap-hr`: content module `scripts/cheat-sheet-pdfs/sheets/sap-hr.mjs` (6-12 boxes, code lines at most 44 characters, built from the finished pages, never from memory), render `modules/ROOT/attachments/sap-hr-cheat-sheet.pdf` as one A4 page, and write `erp/sap/human-resources/cheat-sheet.adoc` with the download link _(javascript)_
  - [x] Task 256.1. Run `npm run cheat-sheets sap-hr`; the run fails if the sheet spills onto a second page
- [x] Task 257. Write `programming-languages/abap/bibliography.adoc`: every source cited in the ABAP section, grouped (Keyword Documentation, guides, tools, samples and style guides, learning, requester-provided books B1-B4 with publisher pages), with the date the links were checked
- [x] Task 258. Write `erp/sap/bibliography.adoc` with the exact `===` groups General, Finance, Human Resources; requester-provided books B4-B8 inside the group that uses them; a separate list of non-official and login-only sources

### Group 25 — Build, validation and review (Parallelizable: no — it verifies the finished whole and needs every earlier group)

Verifies the finished whole; it needs every earlier group.

- [x] Task 259. Run `npm run cards` once more (it turns each cheat-sheet link into the download button) and `npm run test:cards`, `npm run test:cheat-sheets`, `npm run test:sap-guides`, `npm run test:guides` _(javascript)_
- [x] Task 260. Run `npm run audit:sap-beginner` and fix every page it reports _(javascript)_
- [x] Task 261. Build: `rm -rf build/site`, `npx antora antora-playbook.yml`; fix every `xref`/AsciiDoc error and every missing-attribute warning, then `npm run test:nav:site`, `npm run search:index`, and check `du -sk build/site` stays under 900,000 KiB
  - Blocked on the size check only (2026-11-13): build exit 0 with no errors or warnings, test:nav:site 0 problems, search:index 6397 pages; but `du -sk build/site` = 959,172 KiB, above the 900,000 KiB target and the workflows' warning threshold, 828 KiB under their 960,000 KiB hard-fail threshold (erp 14,772 KiB, abap 7,212 KiB, pagefind 157,876 KiB). Requester decision (2026-11-13): accept the size and rely on the 960,000 KiB hard-fail threshold.
- [x] Task 262. Run the `CLAUDE.md` checks on the new directories: the three image-macro greps, the unquoted-comma alt-text grep on changed files, the inline-code substitution grep on `build/site/programming-languages/abap` and `build/site/erp`, and `npm run validate:mermaid` after `npm i --no-save mermaid@11 jsdom`
- [x] Task 263. Run the admonition check: `grep -rnE '^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):|^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/programming-languages/abap modules/ROOT/pages/erp` prints nothing, and every page includes the shared AI notice
- [x] Task 264. Check images: every new SVG is referenced by exactly one page and exists in `modules/ROOT/images/`; no SAP logo, screenshot or real user, host or tenant datum appears in any figure
- [x] Task 265. Check the account-free rule: no page, lab or example asks for an account, trial, API key or login (`grep -rniE "sign up|register|trial account|api key" ...` reviewed by hand)
- [x] Task 266. Review the rendered pages in the Browser pane: nav under Programming Languages and under ERP, the ERP home card, one page of each area, one guide, a search from the home page and from a deep page
- [x] Task 267. Run `/iru-check-security` (a docs repository; detect-secrets findings are labelled `is_secret: false` after review) and `/iru-update-docs`
