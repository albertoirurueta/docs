# Implementation Plan: Add irurueta-android-recycler-view-manager as an Antora content source in the Android Projects group (#409)

## Task summary

Source: GitHub issue #409
Base branch: main

Issue [#409](https://github.com/albertoirurueta/docs/issues/409) asks to aggregate the Antora component of
[irurueta-android-recycler-view-manager](https://github.com/albertoirurueta/irurueta-android-recycler-view-manager) (component
`irurueta-android-recycler-view-manager`, version 1.1.6, `docs/antora.yml` already present on its `release_1.1.6` branch) into
the Irurueta Docs site and to list it as the third project of the existing **Android Projects** group (added by #405, extended
by #407), in the nav and on the home page, with a home card. The change follows `.archive/implementation_plan_407.md`; the
group, its palette variant (`indigoPink`) and the `androidProjects` card list already exist.

Choices made on the user's behalf (none changes the issue's stated scope):
- **Branches**: `release_1.{1..99}*` and `release_{2..99}*` (version 1.1.6 onwards, the first release with a release branch),
  as in the issue. The comment line reads `# Support version 1.1.6+`.
- **Logo**: the white Android mark from Simple Icons (CC0-1.0, key `si:android`), copied from the existing Android cards so
  the three Android Projects cards share one look. `scripts/cards/LOGO-SOURCES.md` is generated from the manifests and does not
  list hand-made home cards, so it is unchanged (as in #405 and #407).
- **Card text**: title `Recycler View Manager` (also the nav entry and the home page link text), subtitle
  `Adapter change notifications`, button `Explore`.
- **Placement**: third entry of `** Android Projects` in the nav and third (last) cell of its home page card grid, which
  completes the row.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`antora-playbook.yml` has a `content.sources` entry for `https://github.com/albertoirurueta/irurueta-android-recycler-view-manager.git` with `start_path: docs` and branches `release_1.{1..99}*` and `release_{2..99}*` (version 1.1.6 onwards, the first release with a release branch)" | Task 1 |
| 2 | "`modules/ROOT/nav.adoc` `** Android Projects` has `*** xref:irurueta-android-recycler-view-manager::index.adoc[Recycler View Manager]` after Gesture Bitmap View" | Task 4 |
| 3 | "`modules/ROOT/pages/index.adoc` `=== Android Projects` card grid has the new card in the third cell (replacing the last empty padding cell), linking to `irurueta-android-recycler-view-manager::index.adoc`, in the same order as the nav" | Task 5.1 |
| 4 | "A new home card SVG `irurueta-android-recycler-view-manager.svg` in `modules/ROOT/images/` in the house structure, added to `androidProjects` in `scripts/cards/home-cards.mjs`; any logo used is recorded in `LOGO-SOURCES.md`" | Task 2, Task 3 |
| 5 | "The home page `:description:` / `:keywords:` mention the new project where they list projects" | Task 5.2 |
| 6 | "`npx antora --fetch antora-playbook.yml` completes without xref/AsciiDoc errors and the component renders; `npm run search:index`, `npm run test:cards`, `npm run test:nav` and `npm run test:nav:site` pass; the image checks from CLAUDE.md print nothing" | Task 7.1, 7.2, 7.3 |
| 7 | "`du -sk build/site` measured on a fresh build and reported in the PR" | Task 7.4 |
| 8 | "`CLAUDE.md` lists `irurueta-android-recycler-view-manager` among the content sources (Architecture section), with its release-branch range" | Task 6 |

## Current code state

Project type: other (Antora playbook repository, no application code). Repository host: GitHub. No language-specific
`*-code-one-task` skill applies, so every task is untagged and is implemented directly.

- `antora-playbook.yml` (line ~108): the last `content.sources` entry is `irurueta-android-gesture-bitmap-view` with
  `# Support version 1.3.0+`, `release_1.{3..99}*`, `release_{2..99}*`, `start_path: docs`. The new entry goes right after it.
- Remote component (read from GitHub): `docs/antora.yml` has `name: irurueta-android-recycler-view-manager`, `version: 1.1.6`,
  `title: Irurueta Android Recycler View Manager`, nav `modules/ROOT/nav.adoc` (Overview, What's new, Installation, Usage,
  Sample app, User interface, Building). Only `release_1.1.6` matches the globs today (`sync_1.1.7` is the next one). The
  remote's `ui-bundle.zip`, `ui-overrides/`, `scripts/`, playbook and `recycler-view-manager.gif` are ignored here (only
  `antora.yml` and `modules/` are read), but the gif may add to the site size.
- `modules/ROOT/nav.adoc` (line ~4600): `** Android Projects` holds the Test Utils and Gesture Bitmap View entries.
  `ui-overrides/helpers/nav-item-state.js` matches `Open Source Projects` exactly (unchanged).
- `modules/ROOT/pages/index.adoc` (line ~156): `=== Android Projects` has a `[cols="1,1,1",frame=none,grid=none]` table with two
  cards and one empty `a|` cell. The header `:description:` ("Android libraries (Android Test Utils and Gesture Bitmap View)")
  and `:keywords:` (`... Android Test Utils, Android Gesture Bitmap View, gesture bitmap view, ...`) name the projects.
- `scripts/cards/home-cards.mjs` line 31: `const androidProjects = ['irurueta-android-test-utils.svg', 'irurueta-android-gesture-bitmap-view.svg'];`, mapped with
  `variants[otherVariant['android-projects']]`; `scripts/cards/palette.mjs` already has `'android-projects': 'indigoPink'`.
- `modules/ROOT/images/irurueta-android-gesture-bitmap-view.svg` is the template (600x600, logo at (300,170), title y=285
  size 46, subtitle y=368 size 25, button `rect` at `y="440"` followed by its `text`). `npm run cards` restyles it with the palette.
- `CLAUDE.md` lines 49-52 list the content sources and describe the Android projects' release branches.

## Implementation steps

### Group 1 — Content wiring (Parallelizable: yes — the tasks touch different files)

- [x] Task 1. Add the content source in `antora-playbook.yml`
  - [x] Task 1.1. After the `irurueta-android-gesture-bitmap-view` entry add `- url: https://github.com/albertoirurueta/irurueta-android-recycler-view-manager.git` with `branches:` (comment `# Support version 1.1.6+`, `release_1.{1..99}*`, `release_{2..99}*`) and `start_path: docs`.
    - Done: playbook source added after gesture-bitmap-view; no tests apply (config only).
- [x] Task 2. Create the home card `modules/ROOT/images/irurueta-android-recycler-view-manager.svg`
  - [x] Task 2.1. Copy `irurueta-android-gesture-bitmap-view.svg`; change only the title text to `Recycler View Manager` (check it fits on one line at 46 px, else lower the size as other long home cards do) and the subtitle to `Adapter change notifications`. Keep the Android logo path, gradient, and the button `rect` at `y="440"` followed by its `text`.
- [x] Task 3. Register the card in `scripts/cards/home-cards.mjs`
  - [x] Task 3.1. Add `'irurueta-android-recycler-view-manager.svg'` as the third entry of `androidProjects` (line 31). `palette.mjs` and `LOGO-SOURCES.md` stay unchanged.
  - [x] Task 3.2. Run `npm run cards` and confirm `git status` shows no change to any other SVG.
- [x] Task 4. Add the nav entry in `modules/ROOT/nav.adoc`
  - [x] Task 4.1. Under `** Android Projects`, after the Gesture Bitmap View line, add `*** xref:irurueta-android-recycler-view-manager::index.adoc[Recycler View Manager]`.

### Group 2 — Home page and contributor docs (Parallelizable: no — Task 5.1 uses the SVG from Task 2, and Task 6 describes the finished source list)

- [x] Task 5. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 5.1. In `=== Android Projects`, replace the last empty `a|` cell with `a|` followed by `image::irurueta-android-recycler-view-manager.svg[xref="irurueta-android-recycler-view-manager::index.adoc"]` (on one line, column 0, blank lines around). Keep the intro sentence generic.
  - [x] Task 5.2. Header: `:description:` "Android libraries (Android Test Utils, Gesture Bitmap View and Recycler View Manager)"; `:keywords:` add `Android Recycler View Manager`, `RecyclerView`, `recycler view manager` after `gesture bitmap view`.
- [x] Task 6. Update `CLAUDE.md` (Architecture section)
  - [x] Task 6.1. Add `irurueta-android-recycler-view-manager` to the list of remote sources and to the Android projects sentence, stating that test-utils and gesture-bitmap-view use `release_1.{3..99}*` and `release_{2..99}*` (from 1.3.0) while recycler-view-manager uses `release_1.{1..99}*` and `release_{2..99}*` (from 1.1.6).

### Group 3 — Verification (Parallelizable: no — everything runs on one build of the finished change)

- [x] Task 7. Build and check
  - [x] Task 7.1. `rm -rf build/site`, then `npx antora --fetch antora-playbook.yml`: no xref/AsciiDoc errors; the component `irurueta-android-recycler-view-manager` renders and the card and nav link resolve.
  - [x] Task 7.2. `npm run search:index`, `npm run test:cards`, `npm run test:nav`, `npm run test:nav:site` (delegate to the `iru-gate-runner` agent or a generic sub-agent so output stays out of the main context).
  - [x] Task 7.3. CLAUDE.md image checks (block and inline macros closed on one line, no `<p>image::` in `build/site`, no alt text with an unquoted comma in `index.adoc`) print nothing.
  - [x] Task 7.4. `du -sk build/site` on the fresh build; record the figure for the PR description. Result: 1241880 KiB.
  - [x] Task 7.5. Preview the home page card grid and the new component's index page in the browser pane.
