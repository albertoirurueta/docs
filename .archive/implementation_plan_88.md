# Implementation Plan: Restructure root docs site (Open Source Projects grouping + Guides & References simplification)

## Task summary

Source: GitHub issue #88

Restructure `modules/ROOT/pages/index.adoc` and `modules/ROOT/nav.adoc` so the site's two top-level groupings
read more clearly:

1. Replace the flat `== Projects` section with `== Open Source Projects`, split into an **AI** subsection (AI
   Catalog only) and a **Java Projects** subsection (the other 13 libraries).
2. Collapse `== Guides & References` from a fully expanded nested bullet list (5 areas x many sub-pages) down to
   a single row of icon cards, one per main area: Programming Languages, **Databases** (renamed display label
   for "Database Development"), Web Development, Backend Development, Apps.
3. Create one new 600x600 SVG "figure" per Guides & References area, styled like the existing project cards
   (e.g. `algebra.svg`), each with a title, a short subtitle, and a new representative icon.
4. Restructure `nav.adoc`'s top level to mirror the landing page: a root `Open Source Projects` entry with `AI`
   and `Java Projects` children, replacing the current flat list of 14 top-level project xrefs. Rename the
   `Database Development` nav label to `Databases` (target/sub-tree unchanged).

This repo has no application source code (per `CLAUDE.md`) -- it *is* the Antora playbook + root component. Every
task below is AsciiDoc/SVG authoring; none maps to an installed `*-code-one-task` skill (`java`, `dotnet`,
`database`), so all tasks are **untagged** and executed directly, consistent with the closest prior precedent,
`.archive/implementation_plan_79.md` (the "Programming Languages" nav restructuring).

### Choices made on the user's behalf (stated so they can be challenged during review)

1. **Only the display label changes for "Database Development" -> "Databases"**: the underlying page
   `modules/ROOT/pages/database/index.adoc` keeps its own `= Database Development` title, `:description:`, and
   `:keywords:` untouched -- the issue's acceptance criteria only asks to rename the nav entry's label and the
   new landing-page card's title, not the target page itself. Same principle applies to the other 4 areas: their
   own `index.adoc` titles (`Programming Languages`, `Web Development`, `Backend Development`, `Apps`) are
   unchanged; only the new card figures and (for Databases) the nav label carry the display text.
2. **New SVG file names**: `programming-languages.svg`, `databases.svg`, `web-development.svg`,
   `backend-development.svg`, `apps.svg` under `modules/ROOT/images/` -- descriptive, hyphenated, matching this
   repo's existing per-project image naming convention (`geometry-io.svg`, `navigation-indoor.svg`, etc.). File
   names don't need to match their target page path exactly (existing precedent: `ar.svg` -> `irurueta-ar`,
   `geometry-io.svg` -> `irurueta-geometry-io`).
3. **Gradient colors for the 5 new cards continue the existing rotation** rather than inventing new colors.
   Every existing card's gradient starts at `#FCA3AF` and ends in one of three colors, cycling in this fixed
   order across the 14 existing cards: `#ff6ec4` (pink) -> `#7873f5` (purple) -> `#4ade80` (green) -> repeat.
   Continuing that exact rotation for the 15th-19th cards gives: Programming Languages = `#4ade80`,
   Databases = `#ff6ec4`, Web Development = `#7873f5`, Backend Development = `#4ade80`, Apps = `#ff6ec4`.
4. **Subtitles** (one short line per card, matching the existing style, e.g. "Matrix algebra" under Algebra):
   - Programming Languages -> "General-purpose languages"
   - Databases -> "Where your data lives"
   - Web Development -> "Frontend frameworks & the DOM"
   - Backend Development -> "Server-side Java & Spring Boot"
   - Apps -> "Native & mobile platforms"
5. **New icons** are simple line-art pictograms in the same stroke style as existing cards (white stroke on the
   gradient, centered in the existing 46px-radius circle at (300,170)), each newly designed to be representative
   and visually distinct from all 14 existing project icons (exact path data specified per task below).
6. **`nav.adoc`'s "Guides & References" sub-tree is otherwise untouched**: only the top-level project list is
   regrouped and the one "Database Development" -> "Databases" label is renamed. Every other nav entry --
   Programming Languages, Web Development, Backend Development, Apps, and all their many sub-page xrefs -- stays
   exactly as-is, since the issue's acceptance criteria explicitly scope the landing-page simplification to
   `index.adoc` only, not `nav.adoc`.
7. **Untagged plan**: no installed `*-code-one-task` skill applies (pure AsciiDoc/SVG authoring, no test suite).
   Verification is a clean `npx antora antora-playbook.yml` build, per this repo's own `CLAUDE.md`.

## Current code state

- **`modules/ROOT/pages/index.adoc`** (204 lines): `== Projects` (lines 25-75) is a `[cols="1,1,1",frame=none,
  grid=none]` AsciiDoc table, one `a|` cell per project holding `image::<name>.svg[xref="<component>::
  index.adoc"]`, 14 real cards + 1 blank filler cell (15 cells = 5 rows x 3 cols). `== Guides & References`
  (lines 77-188) is a nested bullet list: 5 top-level `* xref:.../index.adoc[Area]` bullets, each followed by
  many `** xref:...[Sub-page]` bullets with inline descriptions. `== About me` starts at line 190 and is
  untouched by this plan.
- **`modules/ROOT/nav.adoc`** (453 lines): lines 1-15 are `* xref:index.adoc[Home]` plus 14 flat top-level
  project xrefs (AI Catalog first, then the 13 Java libraries in the same order as `index.adoc`'s table). Line
  16 onward is `* Guides & References` (a non-clickable category heading, no xref -- same convention this plan
  reuses for the new `* Open Source Projects` heading) with 5 `**` children (`Programming Languages`,
  `Database Development` at line 26, `Web Development`, `Backend Development`, `Apps`), each expanding into a
  large multi-level sub-tree. Only line 26's label changes; nothing else in this range moves.
- **`modules/ROOT/images/algebra.svg`** is the reference card style: 600x600 `viewBox`, a `linearGradient`
  (`#FCA3AF` -> an accent color) clipped to a 28px-rounded rect, a white-stroke icon inside a `r="46"` circle at
  `(300,170)`, a bold 52px title at `y="285"`, a thin divider line at `y="318"`, a 25px subtitle at `y="368"`
  (opacity 0.9), and an "Explore" pill (rounded rect + 26px bold text) centered at `y="446"-"492"`. All 14
  existing project cards follow this exact structure, varying only the gradient end color, icon path data,
  title, and subtitle.
- **No existing card-style SVG exists for any Guides & References area** -- `modules/ROOT/images/` has 90+ files,
  but the 5 needed here (`programming-languages.svg`, `databases.svg`, `web-development.svg`,
  `backend-development.svg`, `apps.svg`) don't exist yet and must be created from scratch.
- The target pages for the new cards' `xref` attributes already exist and are unaffected by this plan:
  `programming-languages/index.adoc`, `database/index.adoc`, `web/index.adoc`, `backend/index.adoc`,
  `apps/index.adoc`.
- Closest precedent: `.archive/implementation_plan_79.md` (nav/index restructuring for the "Programming
  Languages" category) -- confirms this repo's convention of stating structural choices explicitly for review,
  and that the sole verification gate for a docs-only change here is a clean Antora build.

## Implementation steps

### Group 1 -- Create the 5 new Guides & References card figures _(untagged)_

**Parallelizable: yes** -- five independent new SVG files, no shared state, none reads another's output.

- [x] Task 1. Create `modules/ROOT/images/programming-languages.svg`
  - Files: `modules/ROOT/images/programming-languages.svg` created. Title overflowed at font-size 52 (confirmed
    visually in browser preview); reduced to `font-size="40"` per the plan's fallback, then re-verified it fits.
  - Card shell: copy the `algebra.svg` structure (600x600, `bgGradient` clipped to a 28px-rounded rect,
    `#FFFFFF`-opacity-0.1 border stroke, `r="46"` icon circle at `(300,170)` with `opacity="0.12"` fill, title at
    `y="285"` font-size 52 weight 800, divider line at `y="318"`, subtitle at `y="368"` font-size 25 opacity 0.9,
    "Explore" pill at `y="446"`).
  - Gradient: `stop-color="#FCA3AF"` at 0%, `stop-color="#4ade80"` at 100% (per choice 3 above).
  - Icon (a `</>` code-brackets glyph), centered at the icon circle's origin:
    ```xml
    <g fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-10 -20 L-26 0 L-10 20"/>
      <path d="M10 -20 L26 0 L10 20"/>
      <path d="M4 -24 L-4 24"/>
    </g>
    ```
  - Title text: `Programming Languages` (note: at font-size 52 this is noticeably wider than existing one-word
    titles like `Algebra` -- keep `text-anchor="middle"` at `x="300"` as-is; if it visually overflows the
    600px-wide card when rendered, reduce this title's `font-size` to `40` so it still fits within the ~460px
    the divider line's endpoints suggest as the safe text width -- check visually in the Group 3 verification
    step and adjust only this file if needed).
  - Subtitle text: `General-purpose languages`.
- [x] Task 2. Create `modules/ROOT/images/databases.svg`
  - Files: `modules/ROOT/images/databases.svg` created. Title fits comfortably at font-size 52; verified visually.
  - Same card shell as Task 1.
  - Gradient: `#FCA3AF` -> `#ff6ec4`.
  - Icon (a stacked-cylinder database glyph):
    ```xml
    <g fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round">
      <ellipse cx="0" cy="-18" rx="22" ry="8"/>
      <path d="M-22 -18 v14 a22 8 0 0 0 44 0 v-14"/>
      <path d="M-22 -4 v14 a22 8 0 0 0 44 0 v-14"/>
    </g>
    ```
  - Title text: `Databases` (fits comfortably at font-size 52, unlike Task 1/3/4).
  - Subtitle text: `Where your data lives`.
- [x] Task 3. Create `modules/ROOT/images/web-development.svg`
  - Files: `modules/ROOT/images/web-development.svg` created. Title fits at font-size 52 (verified visually); no
    fallback needed.
  - Same card shell as Task 1.
  - Gradient: `#FCA3AF` -> `#7873f5`.
  - Icon (a browser window with a globe, representing the web):
    ```xml
    <g fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">
      <rect x="-26" y="-22" width="52" height="42" rx="4"/>
      <line x1="-26" y1="-10" x2="26" y2="-10"/>
      <circle cx="0" cy="6" r="12"/>
      <path d="M-12 6 h24 M0 -6 v24 M-8.5 -2.5 a14 9 0 0 0 17 0 M-8.5 14.5 a14 9 0 0 1 17 0"/>
    </g>
    <g fill="#FFFFFF" stroke="none">
      <circle cx="-19" cy="-16" r="1.6"/>
      <circle cx="-12" cy="-16" r="1.6"/>
      <circle cx="-5" cy="-16" r="1.6"/>
    </g>
    ```
  - Title text: `Web Development` (same overflow caveat as Task 1 -- verify visually, drop to `font-size="40"`
    if it overflows).
  - Subtitle text: `Frontend frameworks & the DOM`.
- [x] Task 4. Create `modules/ROOT/images/backend-development.svg`
  - Files: `modules/ROOT/images/backend-development.svg` created. Title overflowed at font-size 52 (confirmed
    visually); reduced to `font-size="40"` per the plan's fallback, then re-verified it fits.
  - Same card shell as Task 1.
  - Gradient: `#FCA3AF` -> `#4ade80`.
  - Icon (a 3-unit server rack with status LEDs):
    ```xml
    <g fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <rect x="-26" y="-24" width="52" height="16" rx="3"/>
      <rect x="-26" y="-4" width="52" height="16" rx="3"/>
      <rect x="-26" y="16" width="52" height="16" rx="3"/>
    </g>
    <g fill="#FFFFFF" stroke="none">
      <circle cx="-18" cy="-16" r="1.8"/>
      <circle cx="-18" cy="4" r="1.8"/>
      <circle cx="-18" cy="24" r="1.8"/>
    </g>
    ```
  - Title text: `Backend Development` (same overflow caveat -- likely needs `font-size="40"`, verify visually).
  - Subtitle text: `Server-side Java & Spring Boot`.
- [x] Task 5. Create `modules/ROOT/images/apps.svg`
  - Files: `modules/ROOT/images/apps.svg` created. Title fits comfortably at font-size 52; verified visually.
  - Same card shell as Task 1.
  - Gradient: `#FCA3AF` -> `#ff6ec4`.
  - Icon (a mobile phone outline with a 2x2 home-screen app grid, distinct from `ai-catalog.svg`'s floating
    rounded-square + sparkle icon):
    ```xml
    <g fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
      <rect x="-16" y="-26" width="32" height="52" rx="6"/>
      <line x1="-16" y1="-16" x2="16" y2="-16"/>
      <line x1="-16" y1="16" x2="16" y2="16"/>
    </g>
    <g fill="#FFFFFF" stroke="none">
      <circle cx="0" cy="21" r="2"/>
      <rect x="-9" y="-9" width="7" height="7" rx="1.5"/>
      <rect x="2" y="-9" width="7" height="7" rx="1.5"/>
      <rect x="-9" y="2" width="7" height="7" rx="1.5"/>
      <rect x="2" y="2" width="7" height="7" rx="1.5"/>
    </g>
    ```
  - Title text: `Apps` (fits comfortably at font-size 52).
  - Subtitle text: `Native & mobile platforms`.

### Group 2 -- Restructure `index.adoc` and `nav.adoc` _(untagged)_

**Parallelizable: yes** -- the two tasks edit different files and neither depends on the other's output (only
on Group 1's new SVG files already existing on disk, for Task 6's image references to resolve).

- [x] Task 6. Update `modules/ROOT/pages/index.adoc`
  - Files: `modules/ROOT/pages/index.adoc` restructured (Open Source Projects w/ AI + Java Projects subsections,
    Guides & References collapsed to 5 icon cards). No test suite (docs-only repo); verified structurally by
    diff and visually in Group 3.
  - [x] Task 6.1. Replace the `== Projects` heading and its table (current lines 25-75) with:
    ```asciidoc
    == Open Source Projects
    Below is the growing family of open-source projects I maintain -- pick one to explore its docs, or just
    fire up the search box if you already know what you're after.

    === AI

    [cols="1,1,1",frame=none,grid=none]
    |===
    a|
    image::ai-catalog.svg[xref="ai-catalog::index.adoc"]

    a|

    a|

    |===

    === Java Projects

    [cols="1,1,1",frame=none,grid=none]
    |===
    a|
    image::hermes.svg[xref="hermes::index.adoc"]

    a|
    image::units.svg[xref="irurueta-units::index.adoc"]

    a|
    image::statistics.svg[xref="irurueta-statistics::index.adoc"]

    a|
    image::sorting.svg[xref="irurueta-sorting::index.adoc"]

    a|
    image::algebra.svg[xref="irurueta-algebra::index.adoc"]

    a|
    image::numerical.svg[xref="irurueta-numerical::index.adoc"]

    a|
    image::geometry.svg[xref="irurueta-geometry::index.adoc"]

    a|
    image::geometry-io.svg[xref="irurueta-geometry-io::index.adoc"]

    a|
    image::ar.svg[xref="irurueta-ar::index.adoc"]

    a|
    image::navigation.svg[xref="irurueta-navigation::index.adoc"]

    a|
    image::navigation-indoor.svg[xref="irurueta-navigation-indoor::index.adoc"]

    a|
    image::navigation-inertial.svg[xref="irurueta-navigation-inertial::index.adoc"]

    a|
    image::navigation-inertial-extra.svg[xref="irurueta-navigation-inertial-extra::index.adoc"]

    a|

    a|

    |===
    ```
    (13 cards + 2 blank filler cells = 15 cells = 5 rows x 3 cols, same filler convention as the current table.)
  - [x] Task 6.2. Replace the `== Guides & References` heading and its nested bullet list (current lines 77-188)
        with a short intro paragraph plus a single icon-card row:
    ```asciidoc
    == Guides & References
    Beyond the projects above, this site also hosts a few standalone guides and references that don't belong to
    any single project -- pick an area to explore its full reference tree.

    [cols="1,1,1",frame=none,grid=none]
    |===
    a|
    image::programming-languages.svg[xref="programming-languages/index.adoc"]

    a|
    image::databases.svg[xref="database/index.adoc"]

    a|
    image::web-development.svg[xref="web/index.adoc"]

    a|
    image::backend-development.svg[xref="backend/index.adoc"]

    a|
    image::apps.svg[xref="apps/index.adoc"]

    a|

    |===
    ```
    (5 cards + 1 blank filler cell = 6 cells = 2 rows x 3 cols.)
  - [x] Task 6.3. Leave `== About me` and everything after it untouched. -- confirmed unchanged (diff shows no
        hunks past line 91).
  - [x] Task 6.4. Update the page's `:description:` attribute (line 2) if it still says "Landing page for ...
        alongside standalone database, web-development, backend, and apps references" in a way that reads oddly
        against the new structure -- a light wording touch-up only, not a rewrite (e.g. it can keep listing the
        same topics; just confirm it doesn't explicitly claim a structure that no longer exists on the page).
        -- reviewed: the description only lists topics/projects, it never asserted the old flat-list/nested-bullet
        layout, so left byte-for-byte unchanged.
- [x] Task 7. Update `modules/ROOT/nav.adoc`
  - Files: `modules/ROOT/nav.adoc` restructured (top-level Open Source Projects > AI / Java Projects tree;
    "Database Development" label renamed to "Databases"). No test suite (docs-only repo); `git diff` confirms
    only the two intended hunks changed (verified in Task 7.3).
  - [x] Task 7.1. Replace the flat top-level project list (current lines 2-15) with:
    ```asciidoc
    * Open Source Projects
    ** AI
    *** xref:ai-catalog::index.adoc[AI Catalog]
    ** Java Projects
    *** xref:hermes::index.adoc[Hermes]
    *** xref:irurueta-units::index.adoc[Units]
    *** xref:irurueta-statistics::index.adoc[Statistics]
    *** xref:irurueta-sorting::index.adoc[Sorting]
    *** xref:irurueta-algebra::index.adoc[Algebra]
    *** xref:irurueta-numerical::index.adoc[Numerical]
    *** xref:irurueta-geometry::index.adoc[Geometry]
    *** xref:irurueta-geometry-io::index.adoc[Geometry I/O]
    *** xref:irurueta-ar::index.adoc[Augmented Reality]
    *** xref:irurueta-navigation::index.adoc[Navigation]
    *** xref:irurueta-navigation-indoor::index.adoc[Indoor Navigation]
    *** xref:irurueta-navigation-inertial::index.adoc[Inertial Navigation]
    *** xref:irurueta-navigation-inertial-extra::index.adoc[Inertial Navigation Extra]
    ```
    (`* xref:index.adoc[Home]` at line 1 stays as the first line, unchanged; this block replaces lines 2-15
    directly beneath it.)
  - [x] Task 7.2. On the existing `Database Development` line (currently line 26, `**
        xref:database/index.adoc[Database Development]`), change only the link text to
        `** xref:database/index.adoc[Databases]` -- the `xref:` target and every line after it (the full
        `database/...` sub-tree) stay byte-for-byte identical.
  - [x] Task 7.3. Confirm no other line in `nav.adoc` changes -- diff the file after editing and verify the only
        hunks are the Task 7.1 replacement and the single-word Task 7.2 label change. -- `git diff` confirmed
        exactly these two hunks, nothing else changed.

### Group 3 -- Verify the Antora build _(untagged)_

**Parallelizable: yes** -- single task.

- [x] Task 8. Build and spot-check the site
  - Files: no source files touched; verification only. `npx antora antora-playbook.yml` completed cleanly (exit
    0, no xref/image/nav warnings), `build/site/index.html` and all 5 new card images under `build/site/_images/`
    confirmed present, and a served local preview confirmed the landing page (AI/Java Projects sub-sections, 5
    Guides & References cards, all links resolving) and nav sidebar (Open Source Projects > AI/Java Projects,
    "Databases" label) render as intended.
  - [x] Task 8.1. Delegate the build to a sub-agent so its output doesn't consume the main context window:
    ```
    Agent({
      description: "Build the Antora site and report errors",
      subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` in the repository root and report back: whether it
        completed successfully, the full text of any warning or error mentioning `xref`, `image`, `nav`, or
        `index.adoc`, and confirm `build/site/index.html` and the 5 new image files
        (`build/site/_images/programming-languages.svg`, `databases.svg`, `web-development.svg`,
        `backend-development.svg`, `apps.svg` -- or wherever Antora places component images, check the actual
        output path) exist after the build.",
      run_in_background: false
    })
    ```
  - [x] Task 8.2. If the build reports any `xref`/AsciiDoc error or warning touching the changed files, fix it
        directly (most likely causes: a mismatched table cell count, an unresolved `xref` target, or a malformed
        SVG) and re-run Task 8.1 until clean. -- not needed; the build was clean on the first attempt.
  - [x] Task 8.3. Serve `build/site` locally (e.g. `npx http-server build/site` or equivalent) and open it in a
        browser (via the browser preview tool) at the root page: confirm the "Open Source Projects" heading
        shows the AI/Java Projects sub-sections with all 14 project cards rendering and clickable, the "Guides &
        References" heading shows exactly 5 clickable icon cards with legible titles/subtitles/icons (checking
        in particular whether the Task 1/3/4 title-overflow caveat needs the `font-size="40"` fallback), and that
        clicking each of the 5 new cards navigates to its area's own `index.adoc`. Also open the nav sidebar and
        confirm the new "Open Source Projects > AI / Java Projects" tree renders correctly and every link
        resolves, and that "Databases" (not "Database Development") shows under Guides & References with its
        full sub-tree intact.
