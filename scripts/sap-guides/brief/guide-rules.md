# Rules every SAP and ABAP guide follows

Recorded while the five pilot guides were written (Group 17). Read this before writing a guide; it adds to the guide template
(`scripts/sap-docs/guide-template.adoc`), to the "SAP guides" section of `CLAUDE.md` and to the issue's beginner-first rules.

## Run first, write second
* Copy the lab (`modules/ROOT/examples/abap-lab` or `sap-lab/<project>`) to the scratchpad, never into the repository, and run
  every step there. Keep `node_modules`, `output`, `gen` and build folders out of the repo. For the ABAP lab, `node_modules` can be
  copied from an earlier copy when `package.json` has the same versions.
* Anything the reader types or runs goes into the repo lab as a file and is shown with `include::example$<path>[]`, so the page and
  the lab cannot drift. A guide adds one npm script per runnable report (`run:<name>` in `abap-lab/package.json`) and names it in
  the lab README.
* A step the lab cannot run is dropped, never imitated. Text that quotes tool output is copied from the real run.

## Figures
* One spec per guide: `scripts/sap-guides/figures/<area>-<guide>.mjs` (`abap-first-program.mjs`), `guide` = page name without
  `guide-` and `.adoc`. Output `sap-<area>-guide-<guide>-<nn>-<what>.svg`; the `<nn>` of the result figure is the last number.
* The figure sources and terminal text come from the lab: a spec reads the lab's source files with `readFileSync` (see
  `abap-first-program.mjs`) and types terminal lines as they were printed. A figure may leave out lines (the page says so).
* Callout numbers are the page's step numbers; a step without a figure simply has no callout. Every `===` phase with numbered steps
  has at least one figure, attached to the last step it illustrates with a `+` continuation.
* ABAP source in an editor figure: `abapCode(text)` in `lib/sap-shells.mjs` splits it into keyword, string and number runs (the
  word list is in that file; add words there, backward compatible).
* The alt text of an image macro contains no double quote (a `\"` inside a quoted alt breaks the macro); write the name without
  quotes. Quote the whole alt when it has a comma.
* After every guide run `npm run sap-guides:figures` and `npm run test:sap-guides`; then view each SVG as a PNG (headless Chrome,
  `--screenshot`) after the last edit.

## Page
* The first paragraph of `Before you start` says no account is needed; a previous guide that does not exist yet is named in plain
  text, not as an `xref:` (Group 23 adds the links). Reference pages that exist are linked with `xref:`.
* The only admonition is the AI disclaimer include. No "requester", "the issue", "the plan" or "scratch copy" in prose.
* `What can go wrong` rows are symptoms that were produced in the lab, not guesses.
* A stale build is a real trap: when the transpile fails, `output/` still holds the last good build and running it directly shows
  the old result. Teach the npm script that stops on a failed transpile.

## What the CAP pilots added (guides 1 and 3 of SAP general, finance guide 1, HR guide 1)

### Lab projects and listings
* `sap-lab/expenses` is the finished state of three guides. A guide that builds only the first part includes the lab files with
  tags: the lab file marks a region with `// tag::x[]` and `// end::x[]` comment lines and the page includes it with
  `[tags=**;!x]` (everything except x), `[tag=x]` (only x) or `[lines=1]`. The marker lines never reach the page. Figure
  specs apply the same selection with `labText(text, { drop, only, lines })` from `lib/sap-shells.mjs`.
* Each teaching model is its own CAP project in `sap-lab/` (`ledger`, `people`) with `package.json` (versions pinned like
  `expenses`), a lock file made with `npm install --package-lock-only`, `.gitignore`, `db/`, `srv/`, `app/annotations.cds`,
  `http/` (request files and the JSON bodies that the guide posts with `curl --json @http/<file>.json`) and a `test/` file
  that runs with `npm test` in a copy. Run the test in a copy before the page is written.
* A guide starts its project with `cds init <name> --nodejs` and `npm install`, and every later file is one the reader types.
  The lab file is what the page includes, so the page and the lab cannot drift.
* Keep lab source lines at 84 characters or fewer (the editor figure fits about 90) and comment lines shorter. Figures that
  show a long file show an excerpt of it, and the alt text says so.
* An entity that Fiori elements shows must have `@title` labels, or the object page shows values without labels. Number and
  year fields that look like codes are strings (`FiscalYear` is `String(4)`), otherwise the preview prints 2,026.
* Fiori elements without `@odata.draft.enabled`: no Create button, no Edit button (Delete only), and the filter bar has only
  the search field. With drafts: Editing Status filter, Create, Edit, a Draft marker, a Header tab and the footer buttons
  Save (Create for a new row) and Discard Draft. Read this from the running preview, never from memory.
* Delimiting, validation and period rules are written as `before` handlers in `srv/<name>-service.js`; messages that the
  service sends with `req.info` arrive in the `sap-messages` header (`curl -i | grep -E "^(HTTP|sap-messages)"`), and
  `req.error` answers HTTP 400 with the message.
* The Fiori preview takes the browser language: add `?sap-language=EN` to its address. It loads SAPUI5 from the internet.
* `curl --json` needs curl 7.82 or newer; state it in `Before you start`.

### Figures (generator)
* Shell changes made by the pilots, all backward compatible for earlier figures: `fioriShell({ title, back })` (default title
  `Preview – List of ExpenseService.Claims`, `back` draws the arrow), `fioriListReport({ entity, columns, editing, create })`,
  `fioriObjectPage({ mode: 'display' | 'edit' | 'create', status, amount, footerNote })` with the tabs, labelled sections,
  Draft marker and footer of the real preview, `fioriValueHelp({ rows })` for the value help dialog, the explorer width of
  `vscodeShell` (300 px), the icon `chevronLeft` in `figure-lib/blocks.mjs`, and the source helpers `abapCode`, `cdsCode`,
  `plainCode` and `labText`. A guide with a screen that none of these draws adds a function to `lib/sap-shells.mjs` rather
  than drawing it in its spec, unless only that one guide needs it.
* The four screen maps were redrawn from the running lab: the VS Code map shows the real `cds watch` log and no draft
  annotation, and the list report and object page maps show the preview's real regions (the object page map is in display
  mode, with the tabs General and Administration).
* Limits found by the text-fit check: a terminal line holds about 118 characters (wrap longer commands and answers into
  continuation lines the way a terminal does and compute the callout rows from the wrapped lines); the browser address bar
  holds about 123 characters (shorten the request with a navigation path or a shorter `$select`); an editor line holds about 90.
* A figure takes its text from a real run: terminal answers, JSON and log lines are copied, and a generated id may differ from
  the run (the page says so). A figure may leave out the banner or the annotation block of an answer; the page says so.
* A numbered step has one callout per figure: if a step needs two marks, split it into two steps. Every `===` phase with numbered
  steps has a figure, so a one-step phase is merged into the next phase. Each phase restarts with `[start=N]`.
* One figure per file name: the result figure (`<last nn>-result`) is shown under `== What you build` and is never shown a
  second time, so a step that would show the same screen shows a different one.

### Page text
* A teaching model's `What you build` starts with the sentence "This is a teaching model built with CAP. It is not SAP S/4HANA or
  SAP SuccessFactors and does not reproduce their screens.", and `Before you start` says which names come from an SAP page that
  was read (name the page) and which are the model's own; codes and amounts are said to be made up.
* A `What can go wrong` row or a variation is only written after it was produced in the lab; messages are quoted exactly.
* Dates in the HR guides are `YYYY-MM-DD` in code, with the SAP-style `DD.MM.YYYY` stated once where the reference pages use it.
