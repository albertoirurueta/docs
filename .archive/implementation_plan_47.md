# Implementation plan — Add LinkedIn profile link to the main documentation page

## Task summary

The "About me" section of the site landing page currently links only to the GitHub
profile. Add a link to the LinkedIn profile
(`https://www.linkedin.com/in/alberto-irurueta-carro/`) alongside the existing GitHub
link, keeping the GitHub link intact, and verify the Antora build still completes
without AsciiDoc/xref errors.

Source: GitHub issue #47

Decisions made on the user's behalf (per issue guidance, no user input needed):

- **Link text casing**: normalize the existing `[Github]` to `[GitHub]` while editing
  the same sentence, matching the issue's suggested snippet and the correct product
  spelling. Low-risk copy polish confined to the line already being changed.
- **Phrasing**: join the two links with "and" in a single sentence, exactly as the
  issue's example shows, rather than introducing a list or separate sentences.

## Current code state

- This repo is the Antora playbook + root component for the "Irurueta Docs" site. It
  has no application source code; the only content pages live under
  `modules/ROOT/pages/`.
- `modules/ROOT/pages/index.adoc` is the site landing page (component `ROOT`, title
  "Irurueta Docs", declared in `antora.yml`).
- The `== About me` section is at `modules/ROOT/pages/index.adoc:130`. It is plain
  prose ending, at lines 141-142, with a single external-link macro:
  ```asciidoc
  You can find more about me, and all these projects, on
  https://github.com/albertoirurueta/albertoirurueta[Github].
  ```
- This is the only profile link anywhere under `modules/`. No nav entry, image, or
  `antora-playbook.yml` `content.sources` change is involved — this is page copy only.
- Verification per `CLAUDE.md`: there is no lint/test suite; the only meaningful check
  is that `npx antora antora-playbook.yml` builds `build/site` without `xref`/AsciiDoc
  errors. A bare-URL macro carries no cross-reference, so this change cannot introduce
  an `xref` error.

## Implementation steps

### Group 1 — Add the LinkedIn link (Parallelizable: yes — single task)

- [x] Task 1. Add the LinkedIn link to the "About me" section of
  `modules/ROOT/pages/index.adoc`
  — edited `modules/ROOT/pages/index.adoc` (lines 141-143) only. No test suite or coverage
  applies (this repo has no application source code per `CLAUDE.md`); verification is the
  Antora build, which completed with zero AsciiDoc/xref errors or warnings, and the rendered
  `build/site/index.html` shows both links with the correct hrefs.
  - [x] Task 1.1. Replace the closing sentence of the `== About me` section
    (`modules/ROOT/pages/index.adoc:141-142`) so it links to both profiles:
    ```asciidoc
    You can find more about me, and all these projects, on
    https://github.com/albertoirurueta/albertoirurueta[GitHub] and
    https://www.linkedin.com/in/alberto-irurueta-carro/[LinkedIn].
    ```
    Keep the existing GitHub URL unchanged; only add the LinkedIn macro and the
    connecting "and", and normalize `[Github]` → `[GitHub]`.
  - [x] Task 1.2. Verify the Antora build is clean: run
    `npx antora antora-playbook.yml` and confirm it completes with no AsciiDoc/`xref`
    errors, then spot-check the rendered `build/site/*/index.html` "About me" section
    shows both links with correct hrefs (`https://github.com/albertoirurueta/albertoirurueta`
    and `https://www.linkedin.com/in/alberto-irurueta-carro/`). If `npx antora` cannot
    fetch remote content sources in this environment, a local-only build
    (`npx antora antora-playbook.yml` without `--fetch`) still validates the edited
    page's AsciiDoc.

## Acceptance criteria (from issue #47)

- [x] The "About me" section links to the LinkedIn profile
  (`https://www.linkedin.com/in/alberto-irurueta-carro/`).
- [x] The existing GitHub link is preserved.
- [x] The Antora build completes without xref/AsciiDoc errors.
