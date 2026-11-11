# Implementation Plan: Update Antora (#255)

## Task summary

Issue #255 asks to upgrade Antora and its extensions, make local and CI builds install identical versions, fix the
navigation tree that bloats every page (about 1.1 MB of nav markup on each of the 5,627 `ROOT` pages, `build/site`
6.5 GB), and bring site search back in a form that scales (Pagefind first, Algolia DocSearch as fallback).

Source: GitHub issue #255
Base branch: main

Choices made on the user's behalf (confirmed in `/iru-issue`):

- Scope is **everything in the issue**, except the UI bundle source: the user will supply any rebuilt
  `ui-bundle.zip` themselves, so no bundle source or build script is created here. Instead every UI change this
  plan needs (nav tree, search box, placeholder menu removal, `data-pagefind-body`) is made as a supplemental-file
  override in `antora-playbook.yml` (`ui.supplemental_files`), the mechanism the repository already uses for
  `partials/nav-tree.hbs`. When the user supplies a new bundle, those overrides are folded into it and removed
  (stated in the issue).
- Antora target is `3.2.2` (latest on npm 2026-11-11), pinned exactly together with every extension. Evidence that
  no bundle rebuild is needed for 3.2 is in the issue comment of 2026-11-11 (same bundle built identically under
  3.1.15 and 3.2.2 on `ai-catalog`).
- The nav fix follows the issue's recommended option 1 (render the top levels plus the branch of the current page),
  done before search so Pagefind never indexes the duplicated tree.
- Pagefind is a trial with measurements and a go/no-go gate (Task 10). Algolia is not implemented unless the gate
  fails and the user then chooses it.
- Out of scope for this PR: propagating the changes to the `albertoirurueta/ai-catalog` repository and its new
  `iru-update-antora` skill (specified in the issue comment). Task 16 only posts the final versions there.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`npx antora antora-playbook.yml` builds with the upgraded, pinned versions, with no new warnings; diagrams, math and the collector-based `irurueta-auth-server` pages render as before." | Task 1, Task 3, Task 4 |
| 2 | "CI and local builds install identical versions." | Task 2, Task 3 |
| 3 | "A typical guide page is under 150 KB of HTML and `build/site` is under 1 GB." | Task 5, Task 6, Task 7 |
| 4 | "Navigation still shows all sections, highlights the current page and works on mobile." | Task 6, Task 7 |
| 5 | "Search is available on every page, returns results from all components, and a first query downloads no more than a few hundred KB." | Task 8, Task 9, Task 10, Task 11 |
| 6 | "The image, inline-code and Mermaid checks in `CLAUDE.md` still pass." | Task 4, Task 7, Task 12 |
| 7 | derived: the placeholder navbar menu is gone and `README.md` and `CLAUDE.md` describe the new versions, search and verification steps | Task 14, Task 15 |

## Current code state

- Repository: Antora playbook and root component `ROOT` (`antora.yml`, `modules/ROOT/`). No application code. Node 24
  locally and in CI. Project type `other`; no `*-code-one-task` skill applies, so tasks are untagged.
- `package.json`: `antora` `3.1.15` (devDependency, exact); `@antora/collector-extension ^1.0.3`,
  `@antora/lunr-extension ^1.0.0-alpha.13`, `@djencks/asciidoctor-mathjax ^0.0.9`,
  `@sntke/antora-mermaid-extension ^0.0.13`. `package-lock.json` is committed.
- `.github/workflows/publish.yml` (nightly) and `manual_publish.yml`: step "Install Antora" runs `npm i -D -E antora`
  plus four `npm i` lines (including the Lunr extension, which the playbook has commented out). They also run
  `npm i --no-save mermaid@11 jsdom` and `node scripts/validate-mermaid.mjs`, then `npx antora antora-playbook.yml`
  and deploy `build/site` to `gh-pages` (`fqdn: www.irurueta.com`).
- `antora-playbook.yml`: `ui.bundle` `ui-bundle.zip` (76 files, no source in the repo, `snapshot: true`);
  `ui.supplemental_files` with `ui.yml`, `.nojekyll`, `ads.txt` and `partials/nav-tree.hbs` from
  `ui-overrides/partials/nav-tree.hbs`; extensions collector, Mermaid (`script_stem: header-scripts`), MathJax;
  Lunr commented out (`#- require: "@antora/lunr-extension"`).
- `ui-overrides/partials/nav-tree.hbs`: copy of the bundle partial with `is-active` on depth-0 items and an `open`
  parameter for the child partial. It still emits every descendant of every item.
- Bundle partials relevant here (extracted from `ui-bundle.zip`): `partials/article.hbs` (`<article class="doc">`,
  no `data-pagefind-body`), `partials/footer-scripts.hbs` (loads `site.js`, `highlight.js`, and
  `search-scripts` only when `env.SITE_SEARCH_PROVIDER` is set), `partials/header-content.hbs` (placeholder menu
  "Products", "Services", "Download", hidden with CSS), `partials/head-scripts.hbs` (Google Analytics key).
- Measured on `main` (issue #255): typical guide page 1.19 MB HTML of which 1.11 MB is nav (7,249 items);
  `build/site` 6.5 GB, 6,249 HTML files; remote component page 17 KB.
- `README.md` lines 7-56 describe the Antora install and run commands. `CLAUDE.md` documents the extensions, the
  nav override, and the search status ("site search is disabled").
- Verification commands that exist: the `grep` checks in `CLAUDE.md` (image macros, inline code), `npm run
  validate:mermaid` (needs `npm i --no-save mermaid@11 jsdom`), `npm run test:cards`, `npm run test:guides`.
- Antora 3.2 facts used (from the 2026-11-11 research): Node 20 minimum; additive UI-model changes; nav entries
  with empty content are skipped and an xref mixed with text is stripped from a nav entry (3.2.0-rc.1); keys under
  `ext` in `antora.yml` are no longer camelCased (3.2.0-alpha.8); CLI exits with 2 when the log failure level is
  reached; `site.url` loses a trailing slash.

## Implementation steps

### Group 1 — Baseline (Parallelizable: yes)

- [x] Task 1. Capture a baseline build with Antora 3.1.15 before touching anything
  - [x] Task 1.1. Build with `npx antora --fetch antora-playbook.yml --to-dir <scratchpad>/baseline-3.1.15` and keep
    the full log (warnings and errors) in `<scratchpad>/baseline-build.log`
    Done: build exit 0, 6,360 HTML files, 6,563 MB, no warnings or errors (log has only the time line); 5m28s.
  - [x] Task 1.2. Record in `<scratchpad>/baseline.json`: HTML file count, total size, size of five sample pages
    (a guide page, a section index, the home page, an `irurueta-algebra` page, an `irurueta-auth-server` page),
    the `<nav class="nav-menu">` HTML of each sample, and the `generator` meta tag. Write a small Node script
    `scripts/site-metrics/measure.mjs` that prints these numbers for any build directory (it is reused in Tasks 5, 7 and 11)
    Done: baseline.json written; script scripts/site-metrics/measure.mjs (flags --json, --out, --no-nav, --guide, --section-index, --home, --algebra, --auth-server).

### Group 2 — Upgrade and pin (Parallelizable: no — Task 3 consumes the lockfile Task 2 produces, Task 4 verifies both)

- [x] Task 2. Pin Antora and every extension to exact versions in `package.json` and `package-lock.json`
  - [x] Task 2.1. Put all packages in one place with exact versions (no `^`): `antora` `3.2.2`,
    `@antora/collector-extension`, `@sntke/antora-mermaid-extension`, `@djencks/asciidoctor-mathjax`, all taken
    from `npm view <pkg> version` at the time of the change. Move `antora` back to `dependencies` or keep it in
    `devDependencies` consistently with the extensions, so one `npm ci` installs all of them
  - [x] Task 2.2. Remove `@antora/lunr-extension` (commented out in the playbook). Add `"engines": {"node": ">=20"}`
  - [x] Task 2.3. Run `npm install` to regenerate `package-lock.json`; confirm `npm ls antora @antora/cli` shows
    one 3.2.2 tree and `npx antora -v` prints `3.2.2`
  - [x] Task 2.4. Re-read the 3.2 notes against this repo's playbook: no `site.url` trailing slash issue
    (`https://www.irurueta.com`), no unquoted YAML attribute values that changed meaning (`experimental: ''`,
    `mathjax-tex-tags: ams`), `ext.collector` keys of the `irurueta-auth-server` component still read correctly;
    write any needed playbook edit in `antora-playbook.yml`
    - Done: `package.json` pins antora 3.2.2, collector 1.0.3, mermaid 0.0.13, mathjax 0.0.9 (all in `dependencies`, no lunr, `engines.node >=20`); `package-lock.json` regenerated. No playbook edit needed: `site.url` has no trailing slash, `experimental: ''` and `mathjax-tex-tags: ams` unchanged, collector keys (`scan`, `dir`, `files`, `into`) are single lowercase words so the no-camelCase change does not affect them. Note: `node_modules/` is tracked in git, so `npm install` modified it.
- [x] Task 3. Make CI use the lockfile
  - [x] Task 3.1. In `.github/workflows/publish.yml` and `.github/workflows/manual_publish.yml` replace the
    "Install Antora" step with `run: npm ci`; drop the per-package `npm i` lines and the Lunr install
  - [x] Task 3.2. Keep `npm i --no-save mermaid@11 jsdom` for the Mermaid validation step, and add a first step
    that prints `npx antora -v` so the version used appears in the log
  - [x] Task 3.3. Do not change the deploy step. Check that the workflows still run with Node 24
    - Done: both workflows now run `npm ci` then `npx antora -v` (after install, so the pinned version is printed); deploy step untouched; Node 24 unchanged (local Node v24.21.0, `engines >=20`).
- [x] Task 4. Verify the upgrade did not change the site
  - [x] Task 4.1. Build with 3.2.2 into `<scratchpad>/build-3.2.2` and diff it against the Task 1 baseline with a
    recursive diff ignoring the `generator` meta tag; every other difference must be explained
  - [x] Task 4.2. Compare the build log with `baseline-build.log`: no new warning or error, exit code 0
  - [x] Task 4.3. Compare the nav HTML of the five samples (the `ui-overrides` partial interacts with the 3.2
    nav changes) and open one `irurueta-auth-server` page to confirm the collector `example$` includes render
  - [x] Task 4.4. Run the `CLAUDE.md` checks on the new build: the three `image::` greps, the `<code>` substitution
    grep on `build/site/<section>` for sections touched, and `npm run validate:mermaid`
    - Done: build with `--fetch` exit 0, empty log (baseline also empty). Recursive diff vs baseline: 6,197 differing files = 6,181 HTML differing only by the `generator` meta tag (3.1.15 vs 3.2.2, hence 1 byte less per page), 16 sitemap XMLs differing only by `<lastmod>`; no files added or removed, no remote branch movement. Nav HTML of all five samples identical. auth-server pages render 189 java listings from collector `example$`, no unresolved includes. image greps 0/0/0, `<code>` grep 0 (monitoring-alerting), `validate:mermaid` 4365 diagrams parsed. `build-3.2.2` deleted, baseline kept.

### Group 3 — Navigation fix (Parallelizable: no — Task 6 needs the helper from Task 5, Task 7 verifies both)

- [x] Task 5. Add a UI helper that tells whether a nav entry contains the current page
  - [x] Task 5.1. Create `ui-overrides/helpers/nav-contains-current.js` exporting a Handlebars helper
    `(navContainsCurrent item currentUrl)` that returns true when `item.url === currentUrl` or any descendant in
    `item.items` does (recursive, no state). Antora loads `helpers/*.js` from the UI, so register it in
    `ui.supplemental_files` as `path: helpers/nav-contains-current.js`
  - [x] Task 5.2. Add a unit test `scripts/nav-fix/nav-contains-current.test.mjs` run with `node --test` over a
    small nav fixture: current page at depth 0, at depth 3, absent, entry without `items`, entry without `url`.
    Add `"test:nav": "node --test \"scripts/nav-fix/*.test.mjs\""` to `package.json`
- [x] Task 6. Render only the levels a reader needs in `ui-overrides/partials/nav-tree.hbs`
  - [x] Task 6.1. Keep the existing `is-active` / `open` rules. Render a child list only when the item is at depth
    0 or 1 (the groups and the 15 sections), or `navContainsCurrentPage` is true for it, or its parent asked for
    open children (`open`). Everything else is not emitted, so its subtree does not appear in the HTML
  - [x] Task 6.2. Every section entry keeps its link to the section `index.adoc` (the image-card page from #364),
    which is how readers reach the other subsections; do not add `#fragment` links (`CLAUDE.md`)
  - [x] Task 6.3. Keep the header comment of the partial accurate (what it renders and why) and keep the `Open
    Source Projects` text match
- [x] Task 7. Verify the nav fix
  - [x] Task 7.1. Build and run `scripts/site-metrics/measure.mjs`: a typical guide page must be under 150 KB and
    `build/site` under 1 GB; record both numbers
  - [x] Task 7.2. In the preview of `build/site` (use a temporary launch configuration that serves `build/site`,
    not the tracked one) check on a deep guide page: all groups and sections visible, the current page highlighted
    and its ancestors open, the "toggle all" button still works, and the mobile width (375 px) nav opens
  - [x] Task 7.3. Run `npm run test:nav` and `npm run test:cards` (it checks nav order, titles and that no nav entry
    links to a `#fragment`), and the `CLAUDE.md` greps

### Group 4 — Search with Pagefind (Parallelizable: no — each task builds on the previous one)

- [x] Task 8. Add Pagefind to the toolchain and mark what is indexed
  - [x] Task 8.1. Add `pagefind` as an exact-version dependency in `package.json`, regenerate the lockfile
  - [x] Task 8.2. Override `partials/article.hbs` in `ui-overrides/partials/article.hbs` (copy of the bundle partial)
    with `data-pagefind-body` on `<article class="doc">`, so the nav, header and footer are not indexed; add
    `data-pagefind-filter="component:{{page.component.title}}"` through a hidden `<span>` (or the `meta` form
    Pagefind documents) so results can be filtered by component. Register it in `ui.supplemental_files`
- [x] Task 9. Build the index and add the search box
  - [x] Task 9.1. Add scripts `"search:index": "pagefind --site build/site"` and make the README document running
    it after `antora`. Pagefind writes `build/site/pagefind/`
  - [x] Task 9.2. Override `partials/header-content.hbs` (`ui-overrides/partials/header-content.hbs`) to carry the
    search container `<div id="search"></div>`, and `partials/footer-scripts.hbs` to load
    `{{{siteRootPath}}}/pagefind/pagefind-ui.js` and `{{{siteRootPath}}}/pagefind/pagefind-ui.css` and
    initialise `new PagefindUI({ element: "#search", showSubResults: true })`; keep the bundle's
    existing scripts (`site.js`, `highlight.js`) in the override unchanged
  - [x] Task 9.3. Style the search box in a supplemental `css/pagefind-site.css` file registered in
    `ui.supplemental_files` and linked from `partials/head-styles.hbs` (override), using the existing navbar
    colour variables; it must not show before the script loads and must work at mobile width
- [x] Task 10. Measure Pagefind and decide (gate)
  - [x] Task 10.1. Build the site and index it. Record: index size on disk, time added to the build (`time`),
    bytes downloaded for a first query (network log in the preview), and results for about 20 queries (product
    names, API names such as `@McpTool`, concepts such as "transactional outbox") with whether the right page is in
    the top 5
  - [x] Task 10.2. Put the numbers in `<scratchpad>/pagefind-measurements.md` and compare with the criterion
    (first query a few hundred KB at most, results from all components). If they pass, continue. **If they fail,
    stop and ask the user whether to tune Pagefind or evaluate Algolia DocSearch (issue fallback); do not
    implement Algolia without that answer**
- [x] Task 11. Wire search into CI and verify
  - [x] Task 11.1. In both workflows add the step `npx pagefind --site build/site` after the Antora build and before
    the deploy; the deploy step publishes `build/site` unchanged, so the `pagefind/` folder is included
  - [x] Task 11.2. Confirm `build/site` with the index is still under 1 GB (`measure.mjs`) and that search works on a
    home page, a guide page and a remote component page (`irurueta-algebra`) in the preview
  - [x] Task 11.3. Confirm `ads.txt`, `.nojekyll` and Google Analytics still work (they come from the unchanged
    parts of `ui.supplemental_files` and `head-scripts.hbs`)

### Group 5 — UI cleanup, documentation and checks (Parallelizable: yes — Tasks 14 and 15 edit different files; Task 12 is only a read-only check)

- [x] Task 12. Final repository checks
  - [x] Task 12.1. Run the three `CLAUDE.md` `image::` greps, the alt-text comma grep on changed `.adoc` files, the — all greps empty; audit 0 violations; test:cards 16/16, test:guides 16/16, test:nav 5/5; validate:mermaid 4365 parsed; no changed .adoc
    inline-code substitution grep on the sections touched, `npm run audit:index-template`, `npm run test:cards`,
    `npm run test:guides` and `npm run validate:mermaid`; all must print nothing or pass
  - [x] Task 12.2. Run the rendered-HTML scan from the project memory for stray backticks and `[[x]]` text on the — 0 backticks and 0 [[x]] in 122 monitoring-alerting pages (1267 backend pages)
    pages whose nav changed (only the nav partial changed, so expect no content differences)
- [x] Task 13. Check the secrets baseline
  - [x] Task 13.1. This repository's detect-secrets findings are false positives by project convention; if the scan — detect-secrets: 0 new/unlabeled findings; only generated_at changed
    flags anything in the new files, label them `is_secret: false` and continue
- [x] Task 14. Remove the placeholder navbar menu through an override
  - [x] Task 14.1. If Task 9.2 did not already do it, make `ui-overrides/partials/header-content.hbs` not render — already done in Task 9.2; header-content.hbs renders no placeholder menu
    the "Products", "Product A", "Services", "Download" placeholder items (they are hidden with CSS today)
  - [x] Task 14.2. Confirm the page header still shows the logo, site title and search box on desktop and mobile — logo, title and search visible at 1024 and 375 px (tight at 375, not clipped; no fix needed)
- [x] Task 15. Update contributor documentation
  - [x] Task 15.1. `README.md` (lines 7-56): new install command (`npm ci`), the pinned versions, the — README.md updated
    `npx pagefind --site build/site` step, and Node 20+ requirement
  - [x] Task 15.2. `CLAUDE.md`: replace the extension list and the "site search is disabled" text, document the — CLAUDE.md updated
    `ui-overrides/` files (`nav-tree`, `article`, `header-content`, `footer-scripts`, `head-styles`, helper), the
    rule that overrides are folded into the bundle when the user supplies a new `ui-bundle.zip`, the `npm ci`
    CI, the nav rule "only top levels and the current branch are rendered", and the new `npm run test:nav` /
    `npm run search:index` commands in the Commands list
  - [x] Task 15.3. Update the issue-255 comment on the issue with what changed only if the PR text needs it — not needed / deferred to PR text
    (no edit of the issue body without being asked)

### Group 6 — Follow-up for `ai-catalog` (Parallelizable: yes — a single task, nothing else in the group)

- [x] Task 16. Hand over the final versions to the `ai-catalog` work
  - [x] Task 16.1. After Groups 2 to 5 are merged-ready, add a comment to issue #255 listing the exact versions of
    Antora, each extension and Pagefind, and the final workflow snippet (`npm ci`, Pagefind step), so the
    `ai-catalog` changes and the new `iru-update-antora` skill can use them. Do not edit the `ai-catalog` repository
    in this plan
    Posted 2026-11-11: https://github.com/albertoirurueta/docs/issues/255#issuecomment-6800702898
