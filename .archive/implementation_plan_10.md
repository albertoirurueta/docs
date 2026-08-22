# Implementation Plan: Link bibliography book citations to their official publisher pages

## Task summary

Source: GitHub issue #10

Issue [#10](https://github.com/albertoirurueta/docs/issues/10) ("Reference Book Bibliographies") asks that book
citations in this site's `Bibliography` sections (SQL reference, HTML & Web) link out to each book's official
editorial/publisher web page, the same way a prior fix (commit `0736c00`) already added official links for the
ISO/IEC 9075 standard entry in `../modules/ROOT/pages/sql/index.adoc`.

**Choices made on the user's behalf** (nothing here blocks planning, but the exact targets and scope are worth
recording):

- **Scope: books only, not the standard.** `../modules/ROOT/pages/sql/aggregate-window-functions.adoc` also has an
  unlinked `ISO/IEC 9075-2:2003` entry in its own Bibliography, but the issue's wording ("official book editorial
  web pages... find the books on those web pages") is specifically about books with named authors/publishers,
  not standards documents — and the general ISO/IEC 9075 reference was already given official links elsewhere.
  Left unchanged; not part of this plan.
- **"SQL in a Nutshell" → O'Reilly's official page for the 3rd edition**,
  `https://www.oreilly.com/library/view/sql-in-a/9780596155322/`. Verified via web search (title, ISBN, author
  list, publisher, edition) that this specific edition is the one whose author byline
  (Kevin Kline, Daniel Kline, Brand Hunt) matches the existing citation exactly — the O'Reilly-listed 4th edition
  has different co-authors (Regina Obe, Leo Hsu) and would misattribute the link.
- **"Practical HTML and CSS" → Packt's official product page**,
  `https://www.packtpub.com/en-us/product/practical-html-and-css-9781835084854`. Verified via web search (title,
  subtitle, authors Brett Jephson/Lewis Coulson/Ana Carolina Silveira, Packt Publishing, 2024, 2nd edition) —
  matches the existing citation exactly.
- **Link phrasing**: append a new sentence to each citation, `See <url>[<Publisher>'s official book page].`,
  matching the existing "See ...[...]" phrasing already used for the ISO/ANSI links in
  `../modules/ROOT/pages/sql/index.adoc`, and wrapped to this section's existing ~110-column convention (continuation
  line indented 2 spaces, per commit `270e6c3`).

## Current code state

- `modules/ROOT/pages/sql/index.adoc:30-38` — `Bibliography` section. Line 32 cites *SQL in a Nutshell* with no
  link; the ISO/IEC 9075 and ISO/IEC JTC 1/SC 32 entries below it (lines 33-38) already link to official sources.
- `modules/ROOT/pages/sql/aggregate-window-functions.adoc:273-276` — `Bibliography` section. Line 275 cites the
  same *SQL in a Nutshell* book with no link; line 276 cites `ISO/IEC 9075-2:2003` (out of scope, see above).
- `modules/ROOT/pages/web/html-css/index.adoc:49-54` — `Bibliography` section. Line 51-52 cites *Practical HTML
  and CSS* with no link; the MDN Web Docs entry below it (line 53-54) is already linked.
- This repo has no application code (plain Antora/AsciiDoc docs site) — no `*-code-one-task` skill key applies,
  matching the precedent in `implementation_plan_9.md` (issue #9), which implemented similar
  bibliography/reference-link edits directly rather than dispatching to a language-specific skill.

## Implementation steps

### Group 1 — Add the two official book links

**Parallelizable: yes** (Task 1 and Task 2 touch entirely separate files with no shared state)

- [x] Task 1. Link the *SQL in a Nutshell* citation to O'Reilly's official book page, in both files where it
  appears
  - [x] Task 1.1. In `../modules/ROOT/pages/sql/index.adoc`, line 32, append after the existing sentence: `See
    https://www.oreilly.com/library/view/sql-in-a/9780596155322/[O'Reilly's official book page].` — wrap the
    line to match this file's existing ~110-column convention (continuation line indented 2 spaces, as line 34
    already does for the ISO citation directly below it).
  - [x] Task 1.2. In `../modules/ROOT/pages/sql/aggregate-window-functions.adoc`, line 275, append the identical
    sentence: `See https://www.oreilly.com/library/view/sql-in-a/9780596155322/[O'Reilly's official book
    page].`, wrapped the same way.
  - [x] Files touched: `../modules/ROOT/pages/sql/index.adoc`, `../modules/ROOT/pages/sql/aggregate-window-functions.adoc`.

- [x] Task 2. Link the *Practical HTML and CSS* citation to Packt's official book page
  - [x] Task 2.1. In `../modules/ROOT/pages/web/html-css/index.adoc`, line 52 (end of the citation sentence),
    append: `See https://www.packtpub.com/en-us/product/practical-html-and-css-9781835084854[Packt's official
    book page].`, wrapped to this file's existing convention.
  - [x] Files touched: `../modules/ROOT/pages/web/html-css/index.adoc`.

- [x] Task 3. Re-read all three edited files in full to confirm only the intended sentences were added, no
  existing text/links were altered, and AsciiDoc link syntax (`https://...[...]`) is well-formed in each case.
  — Confirmed clean: only the new "See <url>[...]" sentences were added, all other text/links untouched, and
  all lines fit within the ~110-column convention.

### Group 2 — Verify the site still builds

**Parallelizable: yes** (single task)

- [x] Task 4. Verify the Antora build still completes cleanly with the new links (no `xref`/AsciiDoc syntax
  errors from the inserted text). Delegate this to a sub-agent rather than running it inline:
  — Confirmed: `npx antora antora-playbook.yml` completed with no Antora/AsciiDoc errors or warnings; built
  `../build/site/index.html`.
  ```
  Agent({
    description: "Verify Antora docs build after adding bibliography links",
    subagent_type: "iru-gate-runner",
    prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site and report back
      only whether the build succeeded, and the exact error output if it did not."
  })
  ```
  If the build fails, fix the reported AsciiDoc syntax issue in the offending file and re-run this task before
  checking it off.
