# Implementation plan: Search results images (#396)

## Task summary

Searching from the home page (for example "epipolar") shows broken thumbnails in the Pagefind results. The same
search from any deeper page shows them correctly.

Root cause: Pagefind stores each result's `meta.image` exactly as authored in the indexed page, relative to that
page (`_images/x.svg`, `../../_images/y.svg`, `../../../../_images/z.svg`). `PagefindUI` then uses the value as
`<img src>`, which the browser resolves against the page the reader is currently on. The path is only right when
the reader's page has the same depth as the indexed page. The fix resolves each image against the result's own
URL (`result.url`, which is root-absolute) before it is rendered, using the `processResult` option of
`PagefindUI`.

Choices made on the user's behalf: fix at render time in the existing UI override rather than rewriting the
indexed HTML, so the index stays unchanged. A cheap regression guard is added to the site checks, and a note is
added to `CLAUDE.md`, as the issue asks.

Source: GitHub issue #396
Base branch: main
Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "Determine the reason why links are broken and fix it." | Task 1 |
| 2 | derived: a search from the home page shows working result images (including sub-result images) | Task 1, Task 3 |
| 3 | derived: a search from a deep page keeps working | Task 1, Task 3 |
| 4 | "If this error might occur in the future, consider adding instructions to CLAUDE.md" | Task 2 |

## Current code state

- `ui-overrides/partials/footer-scripts.hbs:6-15` initialises the search: `new PagefindUI({ element: '#search',
  showSubResults: true })`. It has no `processResult` hook, so `result.meta.image` and
  `result.sub_results[].meta.image` reach the DOM page-relative.
- `ui-overrides/partials/article.hbs` marks the article with `data-pagefind-body`, so the first `<img>` of the
  article (`../../_images/...`) becomes `meta.image`.
- The override is registered through `ui.supplemental_files` in `antora-playbook.yml`, so no playbook change is
  needed.
- `CLAUDE.md`, "Site search is Pagefind." paragraph, documents the search; the new note lands there.
- There is no browser test suite. Existing checks are `scripts/nav-fix/` (`npm run test:nav`, `test:nav:site`).

## Implementation steps

### Group 1 (Parallelizable: yes)

- [x] Task 1. Resolve result images against the result URL _(javascript)_
  - [x] Task 1.1. In `ui-overrides/partials/footer-scripts.hbs`, add a `processResult` function to the
    `PagefindUI` options. For `result.meta.image` and each `result.sub_results[].meta.image`, when the value is
    not already absolute (no scheme, no leading `/`), replace it with
    `new URL(image, new URL(result.url, location.href)).pathname` (use the sub-result's own `url` for its image).
    Keep the handler defensive: skip a missing `meta` or `image`, and never throw.
  - [x] Task 1.2. Keep the Handlebars comment above the script in step with the change (one sentence on why the
    images are resolved).
- [x] Task 2. Document the pitfall in `CLAUDE.md` _(untagged)_
  - [x] Task 2.1. In the "Site search is Pagefind." paragraph, add a short note: Pagefind indexes `meta.image`
    and URLs relative to the indexed page, so any page-relative value shown in the search UI must be resolved
    against `result.url` in `processResult`; check a search from the home page and from a deep page.

### Group 2 (Parallelizable: yes — one task; depends on Group 1)

- [x] Task 3. Verify in a real build _(untagged)_
  - [x] Task 3.1. Run `rm -rf build/site`, `npx antora antora-playbook.yml` and `npm run search:index`, then
    serve `build/site` over HTTP (a temporary config, see the project memory on the preview config).
  - [x] Task 3.2. Search "epipolar" from the home page and from a deep page. Check with `javascript_tool` that
    every `.pagefind-ui__result-image` loads (`naturalWidth > 0`) in both cases, and take a screenshot.
  - [x] Task 3.3. Run `npm run test:nav` and `npm run test:nav:site` to confirm nothing regressed. Run
    `npm run test:cards` too, since an override changed.
