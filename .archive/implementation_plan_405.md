# Implementation Plan: Add irurueta-android-test-utils as an Antora content source in a new Android Projects group (#405)

## Task summary

Source: GitHub issue #405
Base branch: main

Issue [#405](https://github.com/albertoirurueta/docs/issues/405) asks to aggregate the Antora component of
[irurueta-android-test-utils](https://github.com/albertoirurueta/irurueta-android-test-utils) (a personal open source
Android project, component `irurueta-android-test-utils`, version 1.3.3, `docs/antora.yml` already present on its
`release_1.3.3` branch) into the Irurueta Docs site and to list it under *Open Source Projects* in a new **Android
Projects** group, in the nav and on the home page, with a home card. More Android repositories will join the group later.

Choices made on the user's behalf (none changes the issue's stated scope):
- **Branches**: `release_1.{3..99}*` and `release_{2..99}*` (version 1.3.0 onwards), as chosen in the issue.
- **Logo**: the Android mark from Simple Icons (CC0-1.0, key `si:android`, already in `scripts/cards/logos.json` and
  used by `card-apps-android.svg`), drawn white in the hand-made card, not redrawn by hand. The hand-made home cards
  are not listed in `scripts/cards/LOGO-SOURCES.md` (it is generated from the manifests), so that file is unchanged.
- **Palette variant**: `indigoPink` for `otherVariant['android-projects']`; `sweep` (Java), `pinkIndigo` (AI) and
  `greenIndigo` (Auth Server) are taken, and a future Android card reuses this variant.
- **Card text**: title `Android Test Utils`, subtitle `Android test utilities`, button `Explore`.
- **Nav title**: `Android Test Utils` (the bare product name, like the other entries); the card title and the home
  page link text carry the same string.
- **Placement**: the new group goes after `** Java Projects` and before `** Spring Boot Examples` in both the nav and
  the home page, so Android sits next to the Java libraries.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`antora-playbook.yml` has a `content.sources` entry for `https://github.com/albertoirurueta/irurueta-android-test-utils.git` with `start_path: docs` and branches `release_1.{3..99}*` and `release_{2..99}*`" | Task 1 |
| 2 | "`modules/ROOT/nav.adoc` has a new `** Android Projects` group under `* Open Source Projects` with `*** xref:irurueta-android-test-utils::index.adoc[Android Test Utils]`" | Task 5 |
| 3 | "`modules/ROOT/pages/index.adoc` has a new `=== Android Projects` subsection (one-line description and a three-column card grid) linking to `irurueta-android-test-utils::index.adoc`, in the same position as the nav group" | Task 6.1, Task 6.2 |
| 4 | "A new home card SVG in `modules/ROOT/images/` in the house structure, registered in `scripts/cards/home-cards.mjs` with an Android-group variant in `scripts/cards/palette.mjs`; any logo used is recorded in `LOGO-SOURCES.md`" | Task 2, Task 3 |
| 5 | "The home page `:description:` / `:keywords:` and the 'Open Source Projects' text mention Android projects where they list project families" | Task 6.3 |
| 6 | "`npx antora --fetch antora-playbook.yml` completes without xref/AsciiDoc errors and the component renders; `npm run search:index`, `npm run test:cards`, `npm run test:nav` and `npm run test:nav:site` pass; the image checks from CLAUDE.md print nothing" | Task 7 |
| 7 | "`du -sk build/site` measured on a fresh build and reported in the PR" | Task 7.4 |
| 8 | "`CLAUDE.md` lists `irurueta-android-test-utils` among the content sources (Architecture section)" | Task 4 |

## Current code state

- `antora-playbook.yml`: `content.sources` has `url: .` then the Java projects (each with `release_*` globs and
  `start_path: docs`), then `ai-catalog` and `irurueta-auth-server` (both `main`). The new entry goes last, with the
  Java projects' glob style and a `# Support version 1.3.0+` comment.
- Remote component (read from GitHub): `docs/antora.yml` has `name: irurueta-android-test-utils`, `version: 1.3.3`,
  `title: Irurueta Android Test Utils`, nav `modules/ROOT/nav.adoc`. Only `release_1.3.3` matches the globs today.
  The remote's own `ui-bundle.zip`, `ui-overrides/` and playbook are ignored by this site.
- `modules/ROOT/nav.adoc` (around line 4583): `* Open Source Projects` > `** AI`, `** Java Projects`,
  `** Spring Boot Examples`, each with `***` xref entries. `ui-overrides/helpers/nav-item-state.js` matches the
  top-level text `Open Source Projects` exactly (unchanged). Every text-only heading must have children.
- `modules/ROOT/pages/index.adoc` `== Open Source Projects` (lines 87-170): `=== AI`, `=== Java Projects`,
  `=== Spring Boot Examples`, each a one-line description plus a `[cols="1,1,1",frame=none,grid=none]` table of
  `image::<name>.svg[xref="<component>::index.adoc"]` cells, padded with empty `a|` cells. The page header carries
  `:description:` and `:keywords:`.
- `scripts/cards/home-cards.mjs`: `bySection` map, `javaProjects` array, then `ai-catalog.svg` and
  `irurueta-auth-server.svg` entries with `variants[otherVariant[...]]`.
- `scripts/cards/palette.mjs`: `otherVariant` = `java-projects: sweep`, `ai-catalog: pinkIndigo`,
  `auth-server: greenIndigo`, `ide: sweep`; `variants` defines `indigoPink`.
- `modules/ROOT/images/irurueta-auth-server.svg` is the template: 600x600, gradient, glow, scrim, logo disc at
  (300,170) r=58, title (`y=285`, 52px, weight 800), rule (`y=318`), subtitle (`y=368`, 25px), white pill button
  `rect` at `y="440"` followed by its `text` ("Explore", fill `#4c46c9`), border `rect`. `restyle()` in
  `generate-cards.mjs` rewrites its gradient stops, scrim and button colour from the palette.
- `scripts/cards/generate-cards.test.mjs`: every `image::` on the home page must have a `homeCards` entry, and
  `restyle(svg, colors)` must be a no-op on each home card.
- `scripts/cards/logos.json` key `si:android` (viewBox 24, `paths` array) is the mark to reuse.
- Precedent: `.archive/implementation_plan_343.md` (added the `irurueta-auth-server` source and picker entry).

Project type: `other` (Antora playbook repository, Node scripts). No code language key applies, so no task is tagged.

## Implementation steps

### Group 1 (Parallelizable: yes, the tasks touch disjoint files)

- [x] Task 1. Add the content source to `antora-playbook.yml`
  - [x] Task 1.1. Append after the `irurueta-auth-server` source:
    ```yaml
        - url: https://github.com/albertoirurueta/irurueta-android-test-utils.git
          branches:
            # Support version 1.3.0+
            - release_1.{3..99}*
            - release_{2..99}*
          start_path: docs
    ```
- [x] Task 2. Add the home card and register it
  - [x] Task 2.1. In `scripts/cards/palette.mjs` add `'android-projects': 'indigoPink'` to `otherVariant`.
  - [x] Task 2.2. In `scripts/cards/home-cards.mjs` add `const androidProjects = ['irurueta-android-test-utils.svg'];`
    and `...androidProjects.map((file) => ({ file, colors: variants[otherVariant['android-projects']] })),` to
    `homeCards`.
  - [x] Task 2.3. Create `modules/ROOT/images/irurueta-android-test-utils.svg` by copying
    `irurueta-auth-server.svg` and changing only: the logo group (the `si:android` path data from `logos.json`,
    white, scaled to fit the disc at (300,170), viewBox 24), the title text `Android Test Utils`, and the subtitle
    `Android test utilities`. Keep the structure (button `rect` at `y="440"` then its `text`, border `rect`).
  - [x] Task 2.4. Run `npm run cards` (restyles the new card with the `indigoPink` stops) and check `git status`
    shows only the new SVG, `home-cards.mjs` and `palette.mjs` changed (every other SVG unchanged).
- [x] Task 3. Check the logo bookkeeping
  - [x] Task 3.1. Confirm `scripts/cards/LOGO-SOURCES.md` is unchanged by `npm run cards` (hand-made home cards are
    not listed there) and that the Android mark's `si:android` entry is already recorded (`card-apps-android.svg`).
- [x] Task 4. Update `CLAUDE.md`
  - [x] Task 4.1. In the Architecture section's list of `content.sources`, add `irurueta-android-test-utils`
    (Android project, release branches from 1.3.0, `start_path: docs`) after `irurueta-auth-server`.
  - [x] Task 4.2. Mention the Android Projects group where CLAUDE.md describes the home page project picker and
    the `otherVariant` groups (`Java projects, AI catalog, auth server, IDE cards`), adding the Android projects.

### Group 2 (Parallelizable: yes, nav and index edit different files; both depend on Group 1's card and source)

- [x] Task 5. Add the nav group to `modules/ROOT/nav.adoc`
  - [x] Task 5.1. After the last `*** xref:irurueta-navigation-inertial-extra::index.adoc[Inertial Navigation Extra]`
    line and before `** Spring Boot Examples`, add:
    ```
    ** Android Projects
    *** xref:irurueta-android-test-utils::index.adoc[Android Test Utils]
    ```
- [x] Task 6. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 6.1. Between `=== Java Projects` and `=== Spring Boot Examples` add `=== Android Projects` with the
    one-line description `Open-source Android libraries and tools.` and a `[cols="1,1,1",frame=none,grid=none]`
    table holding `image::irurueta-android-test-utils.svg[xref="irurueta-android-test-utils::index.adoc"]` then two
    empty `a|` cells.
  - [x] Task 6.2. Keep the block macro on one line, at column 0, with blank lines around it.
  - [x] Task 6.3. Add Android projects to the `:description:` / `:keywords:` project-family wording and to the
    `== Open Source Projects` intro where it lists families.

### Group 3 (Parallelizable: yes, a single task; depends on Groups 1 and 2)

- [x] Task 7. Verify (delegate each build, test or grep run to `iru-gate-runner` or run it in a shell, and keep the output out of the main context)
  - [x] Task 7.1. `rm -rf build/site && npx antora --fetch antora-playbook.yml`: no xref or AsciiDoc errors, and
    `build/site/irurueta-android-test-utils/` exists.
  - [x] Task 7.2. `npm run search:index`, `npm run test:cards`, `npm run test:nav` and `npm run test:nav:site`
    all pass.
  - [x] Task 7.3. The CLAUDE.md image checks print nothing:
    `grep -rnE '^image::' modules | grep -vE '\]\s*$'`,
    `grep -rnE '(^|[^:+])image:[^:[ ]+\[[^]]*$' modules --include='*.adoc'`,
    `grep -rn '<p>image::' build/site --include='*.html'`, and the alt-text comma check on `index.adoc`.
  - [x] Task 7.4. Report `du -sk build/site` and `node scripts/site-metrics/measure.mjs build/site` for the PR.
  - [x] Task 7.5. Open the built home page and a page of the new component to confirm the card, the nav group and
    the component render (browser preview of `build/site`, not a temporary dev server entry in `.claude/launch.json`).
