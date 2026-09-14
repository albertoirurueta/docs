# Implementation Plan

## Task summary

Source: GitHub issue #139
Base branch: main

Fix overlapping, hard-to-read text in `modules/ROOT/images/oauth-timeline.svg` — the OAuth history timeline
diagram embedded in `history-and-evolution.adoc` (created in PR #129). The issue floats displaying the timeline
vertically as one possible fix, but does not mandate it; the actual acceptance criterion is just that the text
can be read clearly.

**Approach chosen (no user ambiguity — decided from repository convention):** re-space and trim the existing
*horizontal* timeline rather than rewriting it as a vertical one. `modules/ROOT/images/aspnet-evolution-timeline.svg`
is the same pattern (baseline timeline, dated dots, staggered above/below multi-line labels) and already solves
this exact class of problem by keeping any point with a 2–3 line label sufficiently isolated from its neighbors,
and by folding overflow detail into a single shared annotation row (e.g. its "functionally frozen,
security-fixes-only since 2021" line) instead of stacking it under every individual point. Reusing that convention:
- keeps `oauth-timeline.svg` visually consistent with ~150 other hand-authored SVGs in this docs site (nearly all
  horizontal-timeline or layered-diagram style — a vertical redesign would be a one-off outlier),
- is a much smaller, lower-risk change than redesigning ~85 lines of hand-placed coordinates into a vertical
  layout,
- and directly targets the actual confirmed defect (see below) rather than the diagram's orientation, which the
  issue itself only raised as a "maybe."

## Current code state

- `modules/ROOT/images/oauth-timeline.svg` (single hand-authored SVG, `viewBox="0 0 900 360"`): a horizontal
  timeline with a baseline at `y="190"`, dated event dots on the baseline, and `text-anchor="middle"` labels
  stacked above or below the baseline (2–3 `<text>` lines per event, ~10–17px font sizes).
- Referenced from `modules/ROOT/pages/backend/oauth/history-and-evolution.adoc:14` via
  `image::oauth-timeline.svg[...,width=760,role=text-center]`.
- **Confirmed overlap**: the below-axis clusters at `x=200` (`2009` / `Security Advisory 2009.1` /
  `(session fixation)`) and `x=290` (`Jun 2009` / `Revision A` / `(fixes the flaw)`) are only 90px apart, but each
  is a 3-line block roughly 100–145px wide when centered — their text spans collide around `x≈250–272`. This is
  the specific defect the issue reports.
- Other event clusters in the same file (`x=90` proprietary era, `x=370` RFC 5849, `x=440` WRAP, `x=510` RFC
  6749/6750, the `x=590/650/710` extension-decade trio, `x=800` 2.1 draft) were not confirmed to overlap during
  exploration but were not exhaustively bounding-box-checked either — Task 1.1 below covers verifying all of
  them, not just the known pair.
- No test suite or linter applies to this repository (per `CLAUDE.md`) — verification is: the Antora build
  completes cleanly, and the rendered page/diagram is visually correct.

## Implementation steps

### Group 1 — Fix the timeline SVG (Parallelizable: yes — single task)

- [x] Task 1. Eliminate overlapping/colliding text in `modules/ROOT/images/oauth-timeline.svg` — rebuilt the
      SVG's coordinate layout with wider, individually-verified gaps (`viewBox` `900`→`1340`×`360`), fixed the
      confirmed `x=200`/`x=290` collision plus four additional collisions found during audit (two header-row
      overlaps, two caption-line overlaps around the extension-decade/2.1-draft clusters), consolidated the
      extension-decade's overflow detail into its existing shared annotation row, and scaled the `image::` macro's
      `width` `760`→`1130` to preserve legibility at the new aspect ratio. Verified zero collisions
      programmatically (`getBBox()` pairwise overlap check, 3px margin) and visually in both the raw SVG and the
      Antora-built page; the Antora build completed with no xref/AsciiDoc errors.
  - [x] Task 1.1. Audit every label cluster in the file for text-span collisions, not just the confirmed
        `x=200`/`x=290` pair: for each `<text text-anchor="middle">` element, estimate its rendered width from
        its `font-size` and character count (or render the SVG — e.g. via the in-app Browser tool — and read
        actual layout), and list every pair of horizontally-adjacent text blocks whose spans overlap.
        — Audited by grouping every `<text>` by its `y` (same horizontal band) and estimating each span from
        `font-size` × character count. Found four real collisions beyond the confirmed pair: (1) the
        left-anchored "Proprietary era" header (`x=90`) vs. the centered "OAuth Core 1.0" header (`x=200`) at
        `y=70`, ~44px overlap; (2) the left-anchored "The extension decade" header (`x=650`) vs. the centered,
        bold "draft-ietf-oauth-v2-1-16" header (`x=800`) at `y=70`, ~80px overlap — the worst collision in the
        file; (3)/(4) the extension-decade's 2nd/3rd caption lines vs. the 2.1-draft's 2nd/3rd caption lines at
        `y=113`/`y=126`, ~10–18px overlap each. The confirmed `x=200`/`x=290` below-axis pair (`y=259`/`y=272`)
        also verified as colliding by ~3.5px per line at the given font sizes.
  - [x] Task 1.2. Fix the confirmed `x=200` / `x=290` collision (the 2009 Security Advisory vs. Jun 2009 Revision
        A below-axis blocks) using the `aspnet-evolution-timeline.svg` convention: widen the horizontal gap
        between these two points (shifting them and every following point further right as needed) and/or shorten
        one block to fewer/narrower lines so the two 3-line stacks no longer compete for the same horizontal band.
        Increase the `viewBox` width (from `900` to whatever the new layout needs) and update the background
        `<rect>` width, the baseline `<line>` endpoints, and the closing warning `<rect>`/`<text>` block at the
        bottom accordingly, so nothing is clipped and the timeline still spans edge-to-edge.
        — Rebuilt the entire coordinate layout with generous, individually-verified gaps: `x=200`→`270` and
        `x=290`→`440` (170px apart instead of 90px). `viewBox` widened `900`→`1340`×`360`; background `<rect>`,
        baseline `<line>` (`x1=40`/`x2=1300`), and the closing warning `<rect>` (`width=1260`) and its two
        `<text>` blocks (recentered to `x=670`) all updated to match, edge-to-edge.
  - [x] Task 1.3. Fix every additional collision found in Task 1.1 using the same techniques (more horizontal
        spacing between competing points; consolidating repeated overflow detail — e.g. per-point captions that
        say essentially the same thing — into a single shared annotation row, the way the ASP.NET sibling does
        with its "functionally frozen..." line, where that reads more naturally than duplicating it per point).
        — Every remaining point shifted right with individually-checked clearances (era `90→80`, RFC 5849
        `370→570`, WRAP `440→710`, RFC 6749/6750 `510→860`, extension-decade trio `590/650/710→980/1040/1100`,
        2.1-draft `800→1240`). Both colliding headers ("Proprietary era", "The extension decade") switched from
        left-anchored to `text-anchor="middle"`, consistent with every other header in this same file. The
        extension-decade's above-axis caption trimmed from 4 lines to 2 ("2012-2025: PKCE, JWT, DPoP," / "PAR/JAR,
        mTLS, device flow"), folding the RFC-count/table-pointer detail into the existing single shared
        below-axis annotation row ("around twenty RFCs total -- see the table in this page") instead of
        duplicating it — the same consolidation technique `aspnet-evolution-timeline.svg` uses.
  - [x] Task 1.4. Re-render the SVG (in-app Browser tool, or an equivalent local render) and visually confirm: no
        text span overlaps anywhere in the diagram, every event's date/label is legible, and the diagram still
        reads left-to-right in the same chronological order as before.
        — Rendered via the in-app Browser tool and verified programmatically: computed `getBBox()` for every
        `<text>` element and checked all pairwise overlaps (both same-row and a ≥3px-margin variant) — 0
        collisions and 0 elements clipped outside the `viewBox`. Also visually screenshotted at native
        resolution (1340×400 viewport): every label legible, diagram still reads left-to-right in the same
        chronological order (era → OAuth Core 1.0 → 2009 advisory/Revision A → RFC 5849 → WRAP → RFC 6749/6750 →
        extension decade → 2.1 draft).
  - [x] Task 1.5. Check `modules/ROOT/pages/backend/oauth/history-and-evolution.adoc:14`'s `image::` macro: if the
        SVG's aspect ratio (`viewBox` width÷height) changed meaningfully, adjust the `width=760` attribute so the
        displayed image isn't stretched/squashed; otherwise leave the macro as-is. The alt text already describes
        the milestones generically and needs no change.
        — Aspect ratio changed meaningfully (2.5:1 → ~3.72:1). Since the macro has no explicit `height`,
        Asciidoctor always scales the SVG proportionally from its own `viewBox` (no stretch/squash risk either
        way), but keeping `width=760` against the now much wider `viewBox` would render the diagram's text
        noticeably smaller than before. Scaled `width` proportionally to the `viewBox` growth: `760` → `1130`
        (`760 × 1340/900 ≈ 1132`, rounded), preserving the original effective text size. Alt text left unchanged
        as instructed.
  - [x] Task 1.6. Build the Antora site and confirm it completes without `xref`/AsciiDoc errors, then visually
        check the rendered `history-and-evolution.adoc` page shows the fixed diagram correctly. Delegate this to
        the `iru-gate-runner` agent so the build log doesn't consume the main context window:
        ```
        Agent({
          description: "Build Antora docs site",
          subagent_type: "iru-gate-runner",
          prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site and report
            back only: whether the build completed without xref/AsciiDoc errors, and the path to the built
            history-and-evolution.adoc output page for a follow-up visual check.",
          run_in_background: false
        })
        ```
        Then open the built page (or the raw SVG) in the in-app Browser tool for a final visual check that the
        diagram renders with no overlapping text.
        — `iru-gate-runner` reported the build completed cleanly (`npx antora antora-playbook.yml`, no
        xref/AsciiDoc errors), producing
        `build/site/backend/oauth/history-and-evolution.html`. Confirmed the built page's `image::` macro
        carries `width="1130"` and references `../../_images/oauth-timeline.svg`; confirmed
        `build/site/_images/oauth-timeline.svg` is byte-identical to the fixed source SVG. Opened the built SVG
        directly in the in-app Browser tool and visually confirmed: no overlapping text anywhere, every date/label
        legible, left-to-right chronological order intact.
