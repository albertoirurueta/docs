# Implementation Plan: Add irurueta-android-gesture-bitmap-view as an Antora content source in the Android Projects group (#407)

## Task summary

Source: GitHub issue #407
Base branch: main

Issue [#407](https://github.com/albertoirurueta/docs/issues/407) asks to aggregate the Antora component of
[irurueta-android-gesture-bitmap-view](https://github.com/albertoirurueta/irurueta-android-gesture-bitmap-view) (component
`irurueta-android-gesture-bitmap-view`, version 1.3.0, `docs/antora.yml` already present on its `release_1.3.0` branch) into
the Irurueta Docs site and to list it as the second project of the existing **Android Projects** group (added by #405), in
the nav and on the home page, with a home card. The change follows `.archive/implementation_plan_405.md`; the group, its
palette variant (`indigoPink`) and the `androidProjects` card list already exist.

Choices made on the user's behalf (none changes the issue's stated scope):
- **Branches**: `release_1.{3..99}*` and `release_{2..99}*` (version 1.3.0 onwards), as in the issue.
- **Logo**: the white Android mark from Simple Icons (CC0-1.0, key `si:android`), copied from the existing
  `irurueta-android-test-utils.svg` card, so both Android Projects cards share one look. `scripts/cards/LOGO-SOURCES.md`
  is generated from the manifests and does not list hand-made home cards, so it is unchanged (as in #405).
- **Card text**: title `Gesture Bitmap View` (also the nav entry and the home page link text), subtitle
  `Touch-gesture bitmap view`, button `Explore`.
- **Placement**: second entry of `** Android Projects` in the nav and second cell of its home page card grid.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`antora-playbook.yml` has a `content.sources` entry for `https://github.com/albertoirurueta/irurueta-android-gesture-bitmap-view.git` with `start_path: docs` and branches `release_1.{3..99}*` and `release_{2..99}*` (version 1.3.0 onwards)" | Task 1 |
| 2 | "`modules/ROOT/nav.adoc` `** Android Projects` has `*** xref:irurueta-android-gesture-bitmap-view::index.adoc[Gesture Bitmap View]` after Android Test Utils" | Task 4 |
| 3 | "`modules/ROOT/pages/index.adoc` `=== Android Projects` card grid has the new card in the second cell ... linking to `irurueta-android-gesture-bitmap-view::index.adoc`, in the same order as the nav" | Task 5.1 |
| 4 | "A new home card SVG `irurueta-android-gesture-bitmap-view.svg` in `modules/ROOT/images/` in the house structure, added to `androidProjects` in `scripts/cards/home-cards.mjs`; any logo used is recorded in `LOGO-SOURCES.md`" | Task 2, Task 3 |
| 5 | "The home page `:description:` / `:keywords:` mention the new project where they list projects" | Task 5.2 |
| 6 | "`npx antora --fetch antora-playbook.yml` completes without xref/AsciiDoc errors and the component renders; `npm run search:index`, `npm run test:cards`, `npm run test:nav` and `npm run test:nav:site` pass; the image checks from CLAUDE.md print nothing" | Task 7 |
| 7 | "`du -sk build/site` measured on a fresh build and reported in the PR" | Task 7.4 |
| 8 | "`CLAUDE.md` lists `irurueta-android-gesture-bitmap-view` among the content sources (Architecture section)" | Task 6 |

## Current code state

Project type: other (Antora playbook repository, no application code). Repository host: GitHub. No language-specific
`*-code-one-task` skill applies, so every task is untagged and is implemented directly.

- `antora-playbook.yml` (line ~102): the last `content.sources` entry is `irurueta-android-test-utils` with
  `# Support version 1.3.0+`, `release_1.{3..99}*`, `release_{2..99}*`, `start_path: docs`. The new entry goes right after it.
- Remote component (read from GitHub): `docs/antora.yml` has `name: irurueta-android-gesture-bitmap-view`, `version: 1.3.0`,
  `title: Irurueta Android Gesture Bitmap View`, nav `modules/ROOT/nav.adoc`. Only `release_1.3.0` matches the globs today
  (`sync_1.3.1` is the next one). The remote's `ui-bundle.zip`, `ui-overrides/`, playbook and `video.gif` are ignored here.
- `modules/ROOT/nav.adoc` (line ~4600): `** Android Projects` holds only
  `*** xref:irurueta-android-test-utils::index.adoc[Android Test Utils]`. `ui-overrides/helpers/nav-item-state.js` matches
  `Open Source Projects` exactly (unchanged).
- `modules/ROOT/pages/index.adoc` (line ~156): `=== Android Projects` has a `[cols="1,1,1",frame=none,grid=none]` table with the
  Test Utils card and two empty `a|` cells. The header `:description:` ("Android libraries (Android Test Utils)") and
  `:keywords:` ("open-source Android libraries, Android Test Utils") name the project.
- `scripts/cards/home-cards.mjs` line 31: `const androidProjects = ['irurueta-android-test-utils.svg'];`, mapped with
  `variants[otherVariant['android-projects']]`; `scripts/cards/palette.mjs` already has `'android-projects': 'indigoPink'`.
- `modules/ROOT/images/irurueta-android-test-utils.svg` is the template (600x600, logo at (300,170), title y=285 size 52,
  subtitle y=368, button `rect` at `y="440"` followed by its `text`). `npm run cards` restyles it with the palette.
- `CLAUDE.md` lines 46-51 list the content sources and describe the Android project's release branches.

## Implementation steps

### Group 1 — Content wiring (Parallelizable: yes — the tasks touch different files)

- [x] Task 1. Add the content source in `antora-playbook.yml`
  - [x] Task 1.1. After the `irurueta-android-test-utils` entry add `- url: https://github.com/albertoirurueta/irurueta-android-gesture-bitmap-view.git` with `branches:` (comment `# Support version 1.3.0+`, `release_1.{3..99}*`, `release_{2..99}*`) and `start_path: docs`.
- [x] Task 2. Create the home card `modules/ROOT/images/irurueta-android-gesture-bitmap-view.svg`
  - [x] Task 2.1. Copy `irurueta-android-test-utils.svg`; change only the title text to `Gesture Bitmap View` (check it fits on one line at 52 px, else lower the size as other long home cards do) and the subtitle to `Touch-gesture bitmap view`. Keep the Android logo path, gradient, and the button `rect` at `y="440"` followed by its `text`.
- [x] Task 3. Register the card in `scripts/cards/home-cards.mjs`
  - [x] Task 3.1. Change line 31 to `const androidProjects = ['irurueta-android-test-utils.svg', 'irurueta-android-gesture-bitmap-view.svg'];`. `palette.mjs` and `LOGO-SOURCES.md` stay unchanged.
  - [x] Task 3.2. Run `npm run cards` and confirm `git status` shows no change to any other SVG.
- [x] Task 4. Add the nav entry in `modules/ROOT/nav.adoc`
  - [x] Task 4.1. Under `** Android Projects`, after the Test Utils line, add `*** xref:irurueta-android-gesture-bitmap-view::index.adoc[Gesture Bitmap View]`.

### Group 2 — Home page and contributor docs (Parallelizable: no — Task 5.1 uses the SVG from Task 2, and Task 6 describes the finished source list)

- [x] Task 5. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 5.1. In `=== Android Projects`, replace the second empty `a|` cell with `a|` followed by `image::irurueta-android-gesture-bitmap-view.svg[xref="irurueta-android-gesture-bitmap-view::index.adoc"]` (on one line, column 0, blank lines around); leave the third cell empty. If the intro sentence names the project, keep it generic ("Open-source Android libraries and tools.").
  - [x] Task 5.2. Header: `:description:` "Android libraries (Android Test Utils and Gesture Bitmap View)"; `:keywords:` add `Android Gesture Bitmap View`, `gesture bitmap view` next to `Android Test Utils`.
- [x] Task 6. Update `CLAUDE.md` (Architecture section)
  - [x] Task 6.1. Add `irurueta-android-gesture-bitmap-view` to the list of remote sources, and change the sentence on `irurueta-android-test-utils` to say both Android projects use release branches `release_1.{3..99}*` and `release_{2..99}*` (from 1.3.0).

### Group 3 — Verification (Parallelizable: no — everything runs on one build of the finished change)

- [x] Task 7. Build and check
  - [x] Task 7.1. `rm -rf build/site`, then `npx antora --fetch antora-playbook.yml`: no xref/AsciiDoc errors; the component `irurueta-android-gesture-bitmap-view` renders and the card and nav link resolve.
  - [x] Task 7.2. `npm run search:index`, `npm run test:cards`, `npm run test:nav`, `npm run test:nav:site` (delegate to the `iru-gate-runner` agent or a generic sub-agent so output stays out of the main context).
  - [x] Task 7.3. CLAUDE.md image checks (block and inline macros closed on one line, no `<p>image::` in `build/site`, no alt text with an unquoted comma in `index.adoc`) print nothing.
  - [x] Task 7.4. `du -sk build/site` on the fresh build; record the figure for the PR description. Result: 1,237,796 KiB (the new component adds 30,688 KiB, almost all its 30 MB `video.gif`).
  - [x] Task 7.5. Preview the home page card grid and the new component's index page in the browser pane.
