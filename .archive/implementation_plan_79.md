# Implementation Plan: "Programming Languages" section under Guides & References (physical move)

## Task summary

Source: GitHub issue #79

Move the five general-purpose-language reference sections that currently live scattered under other categories
— `JavaScript Development` and `TypeScript Reference` and `Python Reference` (under Web Development),
`Java Reference` (under Backend Development), and `Kotlin Reference` (under Apps → Android) — into a new
top-level **"Programming Languages"** category, physically relocating their page files on disk into
`modules/ROOT/pages/programming-languages/<language>/`. Each of the five must still be **listed under both**
its original topic category **and** the new Programming Languages category in `nav.adoc`. Every existing link
into these sections — internal `xref:`s across the site and any external/bookmarked URL to the old paths — must
keep working.

**This supersedes the plan's first iteration**, which took a nav-only-duplication approach (no files moved) per
the issue's original acceptance criteria. The user has since clarified the real requirement is a physical move
with link preservation via redirects, not just navigation duplication — see the issue's own "Scope update"
comment. That first iteration is already reflected as uncommitted changes in the working tree (`nav.adoc`,
`pages/index.adoc`, and the new `pages/programming-languages/index.adoc`, all still pointing at the *old* paths)
and gets corrected in place by this plan rather than being reverted and redone from scratch.

### Choices made on the user's behalf (stated so they can be challenged during review)

1. **Directory layout**: `modules/ROOT/pages/programming-languages/<language>/`, one subfolder per language
   (`javascript/`, `typescript/`, `python/`, `java/`, `kotlin/`) — matches this repo's existing one-folder-per-
   language convention and the landing page already created at `programming-languages/index.adoc`. Confirmed
   with the user.
2. **Link preservation mechanism**: Antora's native `:page-aliases:` page attribute (confirmed via Antora's own
   docs: same-module aliases need only the relative page path, e.g. `:page-aliases: backend/java/index.adoc`;
   Antora's default "static" redirect facility — this playbook sets none explicitly, so the default applies —
   generates a redirect page at the old URL with no playbook changes needed). Applied to **all 155 moved pages**
   (not just the 5 section index pages), since every content page in this site has its own stable, individually
   navigable/bookmarkable/search-indexed URL.
3. **Internal xrefs are rewritten to the new canonical path everywhere**, rather than left pointing at the old
   path and relying on the alias redirect internally — confirmed with the user. This is a single repo-wide,
   mechanical path-prefix substitution (see Group 2), safe because the 5 old-path prefixes are unambiguous,
   distinct strings that only ever appear inside `xref:` targets (verified: no `link:`/`<<...>>` macro forms
   reference them, and `image::`/`xref:attachment$...` resources are family-resolved and never carry a page path
   prefix, so images/PDFs need no changes).
4. **`page-aliases` values use bare same-module relative paths** (e.g. `backend/java/control-flow.adoc`, not
   `xref:...` or a fully qualified `version@component:module:...` form) — the simplest correct form per Antora's
   own docs, since every moved page stays in the same component (`ROOT`) and module (`ROOT`).
5. **Untagged plan.** No installed `*-code-one-task` skill (`java`, `dotnet`, `database`) applies — this is pure
   file-move/text-substitution/AsciiDoc authoring, matching every prior documentation-only plan in `.archive/`.
6. **The nav.adoc/index.adoc structural decisions from the plan's first iteration stand unchanged**: Programming
   Languages is still the fifth, last-appended top-level category; it still has its own landing page; the root
   `index.adoc` picker still mirrors it. Only the underlying `xref:` **targets** change (old path -> new path)
   everywhere they appear — nesting depth, ordering, and bullet text are untouched by this plan.

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component, pages
  under `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build. `build/`
  is gitignored.
- **Branch**: `feature/79`, off `main`. The working tree currently has the first iteration's **uncommitted**
  changes: `modules/ROOT/nav.adoc` (+156 lines, a "Programming Languages" block appended after line 501, still
  using the *old* 5 paths), `modules/ROOT/pages/index.adoc` (+21 lines, a matching bullet block, also still using
  the *old* 5 paths), and a new `modules/ROOT/pages/programming-languages/index.adoc` (already correctly
  structured — header, intro paragraph, `== Sections` with 5 bullets — but its `xref:` targets are still the
  *old* 5 paths too). Nothing has been committed yet.
- **Exact directories to move** (verified file counts):
  - `modules/ROOT/pages/web/javascript/` (37 `.adoc` files, including `index.adoc`) -> `.../programming-languages/javascript/`
  - `modules/ROOT/pages/web/typescript/` (25 files) -> `.../programming-languages/typescript/`
  - `modules/ROOT/pages/web/python/` (27 files) -> `.../programming-languages/python/`
  - `modules/ROOT/pages/backend/java/` (36 files) -> `.../programming-languages/java/`
  - `modules/ROOT/pages/apps/android/kotlin/` (30 files) -> `.../programming-languages/kotlin/`
  - Total: 155 files physically relocated. Nothing else in `web/`, `backend/`, or `apps/` moves.
- **Old-path-prefix occurrence counts** (files containing at least one `xref:` match, repo-wide, verified via
  grep — this is the blast radius Group 2 must rewrite): `web/javascript/` in 78 files, `web/typescript/` in 41,
  `web/python/` in 32, `backend/java/` in 43, `apps/android/kotlin/` in 36. This includes: every moved page's own
  references to its siblings (this repo's convention is fully-qualified `xref:` paths even for same-directory
  siblings, confirmed e.g. in `backend/java/classes-and-objects.adoc`), the 5 disclaimer partials'
  bibliography-anchor xrefs (`modules/ROOT/partials/{java,javascript,typescript,python,kotlin}-disclaimer.adoc`),
  `nav.adoc` itself (both the old-topic-section blocks and the new Programming Languages block from the first
  iteration), `modules/ROOT/pages/index.adoc`, `web/index.adoc`, `backend/index.adoc`, `apps/android/index.adoc`,
  `programming-languages/index.adoc`, and ~25 other content pages across React/Angular/Vue/jQuery/Vaadin/ASP.NET
  (linking into JavaScript/TypeScript/Python) and SpringBoot's `java-or-kotlin.adoc` (linking into both Java and
  Kotlin).
- **Header convention confirmed on all 155 moved files**: `= Title` / `:description: ...` / `:keywords: ...` /
  blank line / `include::partial$<lang>-disclaimer.adoc[]` — every file has a `:keywords:` line, giving a
  reliable, uniform insertion point for the new `:page-aliases:` line.
- `antora-playbook.yml` sets no explicit `urls.redirect_facility`, so Antora's default ("static") redirect
  facility applies with no playbook changes needed.

## Implementation steps

### Group 1 — Move the five language directories _(untagged)_

**Parallelizable: yes** — five independent `git mv` operations on disjoint directory trees; none reads another's
result.

- [x] Task 1. `git mv modules/ROOT/pages/web/javascript modules/ROOT/pages/programming-languages/javascript`
- [x] Task 2. `git mv modules/ROOT/pages/web/typescript modules/ROOT/pages/programming-languages/typescript`
- [x] Task 3. `git mv modules/ROOT/pages/web/python modules/ROOT/pages/programming-languages/python`
- [x] Task 4. `git mv modules/ROOT/pages/backend/java modules/ROOT/pages/programming-languages/java`
- [x] Task 5. `git mv modules/ROOT/pages/apps/android/kotlin modules/ROOT/pages/programming-languages/kotlin`
  - [x] Task 5.1. Confirm afterward with `git status` that exactly 155 files show as renames (not
        delete+add pairs with no similarity, which would suggest content was altered during the move) and that
        `web/`, `backend/`, and `apps/android/` no longer contain a `javascript/`, `typescript/`, `python/`,
        `java/`, or `kotlin/` subdirectory respectively.
  - **Done** — `git status` confirmed exactly 155 renames (100% similarity, no content changes); `web/`,
    `backend/`, and `apps/android/` no longer contain the moved subdirectories. Untagged doc-authoring task, no
    tests/coverage/code-quality tooling applicable.

### Group 2 — Rewrite every internal reference and add link-preservation aliases _(untagged)_

**Parallelizable: no** — both tasks touch an overlapping, wide set of shared files (`nav.adoc`, `pages/index.adoc`,
the moved files themselves, and ~25 other cross-referencing pages); running them as one coordinated, sequential
pass avoids any file being in an inconsistent half-updated state. Depends on Group 1 (edits happen at the new
paths, not the old ones).

- [x] Task 6. Repo-wide path-prefix substitution. Run, from the repository root:
      ```bash
      find modules/ROOT -name "*.adoc" -print0 | xargs -0 sed -i '' \
        -e 's#xref:web/javascript/#xref:programming-languages/javascript/#g' \
        -e 's#xref:web/typescript/#xref:programming-languages/typescript/#g' \
        -e 's#xref:web/python/#xref:programming-languages/python/#g' \
        -e 's#xref:backend/java/#xref:programming-languages/java/#g' \
        -e 's#xref:apps/android/kotlin/#xref:programming-languages/kotlin/#g'
      ```
      (macOS/BSD `sed` syntax — `-i ''` for no backup suffix; this matches the darwin environment this repo is
      developed on. `modules/ROOT/nav.adoc` matches the `*.adoc` glob and is included automatically.) This single
      pass corrects: `nav.adoc`'s old-topic-section entries (Web Development/Backend Development/Apps→Android,
      unchanged nesting, new target paths) and its Programming Languages block (from the first iteration);
      `pages/index.adoc`'s old bullets and its new Programming Languages bullet block; the new
      `programming-languages/index.adoc` landing page's 5 section links; the 5 disclaimer partials' bibliography
      anchors; every moved page's own sibling cross-references; and every other page across the site
      (React/Angular/Vue/jQuery/Vaadin/ASP.NET/SpringBoot, etc.) that links into these 5 sections.
  - [x] Task 6.1. Verify with `grep -rn "xref:web/javascript/\|xref:web/typescript/\|xref:web/python/\|xref:backend/java/\|xref:apps/android/kotlin/" modules/` that **zero** matches remain anywhere in the tree.
  - **Done** — ran the exact sed pass repo-wide; verification grep returned zero matches. Confirmed nav.adoc's
    original topic sections (Web Development, Backend Development, Apps→Android) and the Programming Languages
    block both now point at the new paths, plus pages/index.adoc and the 5 disclaimer partials' bibliography
    anchors. Untagged doc-authoring task, no tests/coverage/code-quality tooling applicable.
- [x] Task 7. Add a `:page-aliases:` line to every one of the 155 moved pages, mapping each new page back to its
      old resource ID (same-module relative path, no `xref:` prefix, per Antora's own alias syntax), inserted
      immediately after that file's existing `:keywords:` line. For example,
      `modules/ROOT/pages/programming-languages/java/control-flow.adoc` (moved from
      `backend/java/control-flow.adoc`) gets:
      ```
      :page-aliases: backend/java/control-flow.adoc
      ```
      Implement as a small script rather than 155 manual edits — for each of the 5 language moves, iterate its
      files under the new path, compute the old relative path by substituting the new prefix back to the old one
      (the exact inverse of Task 6's 5 mappings), and insert the `:page-aliases:` line after the first line
      matching `^:keywords:` in that file. Example (one language shown; repeat the pattern for all 5 mappings):
      ```bash
      for f in modules/ROOT/pages/programming-languages/java/*.adoc; do
        old="backend/java/$(basename "$f")"
        sed -i '' "/^:keywords:/a\\
      :page-aliases: ${old}
      " "$f"
      done
      ```
  - [x] Task 7.1. Verify with `grep -rL "^:page-aliases:" modules/ROOT/pages/programming-languages/*/*.adoc` that
        **no** moved file is missing its alias line (empty output = every file has one), and spot-check 2-3 files
        per language (including each language's own `index.adoc`) to confirm the alias value's path is correct
        and the line landed right after `:keywords:` without corrupting surrounding content.
  - **Done** — implemented as a script (one loop per language, inverse of Task 6's mapping), inserting
    `:page-aliases:` immediately after `:keywords:` in all 155 moved files. Verification grep for missing alias
    lines returned empty (all 155 covered); spot-checked each language's `index.adoc` plus `java/control-flow.adoc`
    — alias values match the exact pre-move paths and formatting is intact. Untagged doc-authoring task, no
    tests/coverage/code-quality tooling applicable.

### Group 3 — Build verification _(untagged)_

**Parallelizable: yes** (single task, depends on Groups 1-2 being complete).

- [x] Task 8. Delegate to the `iru-gate-runner` agent rather than running the build inline:
      ```
      Agent({
        description: "Build Antora site for issue #79 (physical move)",
        subagent_type: "iru-gate-runner",
        prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site
          (npx antora antora-playbook.yml). Report back: (1) whether the build completed with zero xref/AsciiDoc
          errors or warnings; (2) confirm the built site's left-hand navigation shows 'Programming Languages' as
          a top-level entry under 'Guides & References' containing JavaScript Development, TypeScript Reference,
          Python Reference, Java Reference, and Kotlin Reference, each with its full child page list, resolving
          to content under programming-languages/<language>/...; (3) confirm Web Development, Backend
          Development, and Apps still show those same five sections in their original nav locations, now
          pointing at the new programming-languages/<language>/... paths; (4) check build/site for redirect
          stub files generated by page-aliases at a sample of old URLs -- e.g. build/site/web/javascript/index.html,
          build/site/backend/java/control-flow.html, build/site/apps/android/kotlin/index.html -- and confirm
          each is a redirect page pointing at its new programming-languages/... location rather than a 404;
          (5) report any xref resolution errors or warnings verbatim if the build isn't clean."
      })
      ```
  - [x] Task 8.1. If the sub-agent reports any `xref` errors/warnings, or any old-path page failing to generate
        a redirect stub, fix the specific file(s) and re-run Task 8 until clean.
  - [x] Task 8.2. If redirects aren't being generated at all (e.g. this Antora version's default redirect
        facility behaves differently than expected), stop and report this to the user before proceeding
        further — this is the crux of the "preserve existing links" requirement, not something to silently
  - **Done** — build completed with exit code 0, zero xref/AsciiDoc warnings or errors (only 4 pre-existing
    informational notices from unrelated remote content sources, not caused by this plan). Confirmed:
    Programming Languages appears as a new top-level entry under Guides & References with all 5 languages and
    their full child page lists (JS 37, TS 25, Python 27, Java 36, Kotlin 30); the original Web
    Development/Backend Development/Apps locations still list the same 5 sections, now pointing at the new
    `programming-languages/<language>/...` paths (each page appears exactly twice in nav, matching counts);
    sampled redirect stubs at `build/site/web/javascript/index.html`, `build/site/backend/java/control-flow.html`,
    and `build/site/apps/android/kotlin/index.html` are all valid Antora page-aliases redirects to their new
    locations (not 404s). No fixes needed (8.1 n/a), redirects generated correctly by Antora's default facility
    (8.2 n/a — no stop condition hit).
        accept as a gap.

## Addendum — nav ordering fix (post-implementation)

After the physical move landed, testing revealed that Antora's vendored UI bundle (`ui-bundle-cookiebot.zip`)
highlights/expands the sidebar branch using `document.querySelector(".is-current-page")` client-side, which only
returns the **first** DOM match. Since a page listed twice in `nav.adoc` gets `is-current-page` on *both*
occurrences (verified in the built HTML), whichever occurrence appears first in document order always wins the
auto-expand/scroll behavior, regardless of which link the user actually clicked.

Considered and rejected: a supplemental JS override (via `antora-playbook.yml`'s `supplemental_files`, without
touching the vendored zip) that remembers the browsing branch in `sessionStorage`. The user opted for a simpler
fix instead: **reorder `Guides & References` so "Programming Languages" is the first top-level entry**, in both
`modules/ROOT/nav.adoc` and `modules/ROOT/pages/index.adoc`. This makes the Programming Languages occurrence
always appear first in document order, so navigating to any of the 5 languages (from any entry point) now
auto-expands/scrolls to the Programming Languages branch. Trade-off, accepted by the user: navigating via the
old topic-section links (Web Development / Backend Development / Apps -> Android) no longer keeps the sidebar
expanded in that topic's branch when landing on one of these 5 language pages -- it always resolves to
Programming Languages instead. Verified via a fresh `iru-build-docs` build: the Programming Languages
`is-current-page` `<li>` now appears before the topic-section one in every one of the 5 languages' rendered
pages.

## Addendum 2 — extracted shared nav partials for maintainability (post-implementation)

Per further user feedback, the duplicated nav sub-trees (each language's list of child pages, repeated once under
Programming Languages and once under its original topic section -- ~25-40 lines each) were extracted into 5
shared partial files under `modules/ROOT/partials/`: `nav-javascript.adoc`, `nav-typescript.adoc`,
`nav-python.adoc`, `nav-java.adoc`, `nav-kotlin.adoc`. Each is now the single source of truth for that language's
nav sub-tree; adding/removing/renaming a child page only requires editing one file instead of two.

`nav.adoc` now references each via `include::partial$nav-<language>.adoc[]`. Four languages (javascript,
typescript, python, java) sit at the same absolute nav depth in both their old and new locations (Programming
Languages and Web/Backend Development are both depth-2 top-level categories), so their partials are written at
plain absolute depth (`***` for the index page) and included directly with no special handling.

Kotlin is the exception: its old location (Apps -> Android -> Kotlin, depth 4) is one level deeper than its new
location (Programming Languages -> Kotlin, depth 3), because Android is an intermediate category with no
equivalent under Programming Languages. `nav-kotlin.adoc` is written at *relative* depth (starting at a single
`*`) and included via Antora's documented "child of a specific parent list item" technique -- an open block
wrapped in a `+` continuation, placed immediately after the relevant parent bullet
(`** xref:programming-languages/index.adoc[Programming Languages]` in one place,
`*** xref:apps/android/index.adoc[Android]` in the other) -- letting Antora nest the same partial one level
deeper than whatever parent it's attached to, without needing two copies of the content.

Verified via a fresh build: each language appears exactly twice with its full, correct child list in both
locations; Kotlin's nav-item `data-depth` is 3 under Programming Languages and 4 under Android (children 4 and 5
respectively), confirming the depth-promotion behaves as intended. `nav.adoc` itself shrank from 657 to 363
lines as a result.
