# Implementation Plan: Guides & References / CMS (Content Management System) — WordPress

## Task summary

Source: GitHub issue #290
Base branch: main

Issue [#290](https://github.com/albertoirurueta/docs/issues/290) asks for a new top-level **CMS (Content Management System)**
section under *Guides & References*, with a **WordPress** sub-section, authored directly into this repo's own `ROOT`
Antora component (`modules/ROOT/pages/cms/` and `modules/ROOT/pages/cms/wordpress/`). It teaches how to **use**,
**administer**, **customize** and **develop on top of** WordPress 7.1, and ends with a bibliography and a one-page A4
cheat sheet PDF. The issue body is the specification. Its first comment holds the full **page outline** (93 pages plus
`cms/index.adoc`) and is part of the specification
(`gh issue view 290 --json comments`). Re-read both when writing each page and when auditing.

Deliverables:

1. **`cms/index.adoc`** and **93 AsciiDoc pages** under `modules/ROOT/pages/cms/wordpress/` (getting started 7 incl. `index.adoc`, using WordPress 12, administration 12, block themes 12, classic themes 6, plugin development 12, block development 10, APIs & data 9, tooling & delivery 7, headless & AI 3, reference 3 incl. `cheat-sheet.adoc`).
2. **`modules/ROOT/attachments/cms-wordpress-cheat-sheet.pdf`**: exactly one A4 page.
3. **`modules/ROOT/partials/cms-disclaimer.adoc`** (for `cms/index.adoc`) and **`cms-wordpress-disclaimer.adoc`** (every WordPress page).
4. **Site wiring:** nav block after the last top-level Guides & References block; `cms.svg` tile and `:description:`/`:keywords:` in the root `index.adoc`.
5. **Back-links:** one-line `xref:` back-links on the existing pages listed in the issue.
6. `cms-wordpress-*.svg` / `cms-*.svg` figures in `modules/ROOT/images/` and Mermaid diagrams where the outline suggests them.

**Choices made on the user's behalf**

* **Delivery (user-confirmed):** one branch (`feature/290-cms-wordpress`) and one draft PR, not the six PRs the issue suggests. The group order below still follows the issue's suggested slices.
* **Running examples (user-confirmed):** the implementation may start wp-env / Docker Compose stacks (WordPress, MariaDB, Redis, Mailpit), install npm/Composer dependencies locally, and run WP-CLI, PHPCS, `wp-scripts` and headless Chrome to verify examples. Everything is torn down afterwards, and nothing from those stacks is committed.
* **Base branch:** `main`, user-confirmed. The unmerged #263 commits on `feature/263-add-backend-web-frameworks-comparison-pages` are not part of this branch.
* **Version baseline:** use the baseline table in the issue (found 2026-10-28). **Re-verify every version, date, URL and status** (WordPress 7.1.x / 7.2 release status, PHP and database requirements, Gutenberg, `@wordpress/*` and WP-CLI versions, the MCP Adapter version, DataViews status, the `wp-now` deprecation, RTC status) against official sources before writing, and state the baseline and check date in each page intro.
* **Running scenario:** *Lumen Press* (original; nothing copied from any source). The plugin `lumen-catalog`, the block theme `lumen`, the blocks `lumen/*` and the REST namespace `lumen/v1` stay consistent across pages.
* **Books:** `~/Desktop/libros/wordpress` is read-only reference material. Nothing from it is committed, copied or screenshotted. Corrections are stated in our own words and cite the official source.
* **Admonitions:** the two disclaimer partials (a single `[IMPORTANT]` block copied in shape from `documentation-tools-disclaimer.adoc`) are the only admonitions in the section.
* **Task tags:** every task is AsciiDoc/documentation authoring with no matching `iru-*-code-one-task` skill, so tasks are untagged and implemented directly. PHP, JavaScript, JSON, shell etc. appear only as code listings.
* **Parallelism:** pages are distinct files, so page tasks within a group are parallelizable. Forward `xref:`s to later groups are the only build warnings permitted until Group 14.
* **Page task contract:** every page task in Groups 2 to 12 means "write the page named in the outline comment" and must satisfy the **Page conventions** below. The outline comment is the per-page content spec.
* **WooCommerce:** out of scope (issue #246). It is referenced in prose only, with no `xref:` to `ecommerce/`.
* **Unrelated file:** `api2.txt` in the working tree is not part of this work and is never committed.

**Page conventions (apply to every page task)**

* Header: `= <Title>`, `:description:`, `:keywords:`, then `include::partial$cms-wordpress-disclaimer.adoc[]` (`cms/index.adoc` includes `cms-disclaimer.adoc`).
* An intro stating the versions the page was written against and the check date.
* Detailed explanation per the issue (what/why/who, internals, errors and pitfalls, security, version notes, book corrections in prose).
* Complete, runnable Lumen Press examples with pinned dependencies and a `.wp-env.json` or Compose file where a running site is needed. **Each example is followed by `Source: <official URL>[title]`.**
* `== References` listing only official online documentation (and publisher pages where used). No other admonition blocks.
* Block macros on one line, quoted alt text with commas, `` `+…+` `` / `` `pass:c[…]` `` passthrough for `->`, `=>`, `__()`, `{$…}` etc., Mermaid `<` as `&lt;` (see `CLAUDE.md`).
* No real secrets (salts, passwords, keys are placeholders or environment variables).

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/partials/cms-disclaimer.adoc` and `modules/ROOT/partials/cms-wordpress-disclaimer.adoc` exist, following `documentation-tools-disclaimer.adoc`." | Task 1 |
| 2 | "`nav.adoc` has the **CMS (Content Management System)** block with the **WordPress** sub-block, its group headings and one entry per outline page in outline order; the grouped nav renders correctly." | Task 3, Task 105 |
| 3 | "The root `index.adoc` has the `cms.svg` tile (original drawing, no WordPress logo) in a complete table row, and its `:description:`/`:keywords:` are updated." | Task 4 |
| 4 | "`cms/index.adoc` exists, with the CMS overview, the list of sub-sections and its own bibliography." | Task 5 |
| 5 | "Every outline page exists under `modules/ROOT/pages/cms/wordpress/` (93 pages)" | Tasks 6 to 98 |
| 6 | "Every concept explored for this issue has its own page(s) with detailed information and code examples linked to the official documentation, covering how to use, customize and develop on top of WordPress." | Tasks 6 to 98, Task 104 |
| 7 | "Every finding listed under 'Findings from the exploration' is stated, in prose, on the page(s) it concerns." | Tasks 6 to 98, Task 104 |
| 8 | "Every outdated claim in 'Comparison with the requester-provided books' is corrected on the page it concerns and collected in `where-older-books-and-tutorials-are-outdated.adoc`, citing the book and the official source (no text copied from the books)." | Tasks 6 to 95, Task 96, Task 104 |
| 9 | "Every ★ page has detailed content: explanation and all relevant screens/settings/APIs, internals, security, common errors and pitfalls, version notes, complete runnable examples." | Tasks 6 to 98, Task 104 |
| 10 | "Every code example runs against the versions pinned in its dependency snippet, comes with a `.wp-env.json` or Compose file where it needs a running site, and is followed by a link to the official documentation page it derives from. Examples use the Lumen Press scenario and contain no real secrets." | Tasks 6 to 95, Task 103 |
| 11 | "The Lumen Press plugin, block theme and blocks shown across the pages pass WPCS (`phpcs --standard=WordPress`) and `wp-scripts lint-js`." | Task 103 |
| 12 | "Mermaid diagrams and `cms-wordpress-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`. Every SVG is referenced by a page; none uses the WordPress logo." | Tasks 4, 6 to 98, Task 106 |
| 13 | "The disclaimer partials are the only admonitions in the section and say only that the content was generated with AI assistance, plus the bibliography pointer." | Task 1, Task 106 |
| 14 | "`cms/wordpress/index.adoc`'s `== Bibliography` lists every source used, each linked to its official website, and the three books linked to their publisher pages with correct ISBNs. Each page has a `== References` section." | Task 6, Task 101, Task 106 |
| 15 | "`cms/wordpress/cheat-sheet.adoc` links `modules/ROOT/attachments/cms-wordpress-cheat-sheet.pdf`." | Task 98 |
| 16 | "The PDF is a single-page A4, downloadable summary of every concept in the sub-section." | Task 99 |
| 17 | "The back-links listed above are added." | Tasks 100, 101 |
| 18 | "No `xref:` points to a page that doesn't exist: #246 is referenced in prose only unless it has landed." | Task 105, Task 106 |
| 19 | "The books are not committed, and no text, figure or screenshot is copied from them." | Task 107 |
| 20 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings, and the `CLAUDE.md` image, inline-code and Mermaid checks print nothing for `build/site/.../cms`." | Task 105, Task 106 |

## Current code state

* This repository is the Antora playbook and root component (`antora-playbook.yml`, `antora.yml`, component `ROOT`). All site content lives in `modules/ROOT/` (`pages/`, `partials/`, `images/`, `attachments/`, `nav.adoc`). It currently has about 117 attachments and 1112 images.
* `modules/ROOT/pages/cms/` does not exist. `modules/ROOT/pages/ecommerce/` does not exist either (#246 is open).
* `modules/ROOT/nav.adoc` ends with the Documentation Tools block under `* Guides & References`; its last line is `*** xref:documentation-tools/cheat-sheet.adoc[Cheat Sheet (PDF)]`. The new block is appended after it as `** xref:cms/index.adoc[CMS (Content Management System)]` with `***`/`****`/`*****` levels. Re-check at implementation time whether #246 has landed (then append after its last entry).
* `modules/ROOT/pages/index.adoc`: the Guides & References table (`[cols="1,1,1",frame=none,grid=none]`) is full; its last cell is `image::documentation-tools.svg[xref="documentation-tools/index.adoc"]`. The tile for `cms.svg` starts a new row (followed by two empty `a|` cells). `:description:` and `:keywords:` are long single lines to extend.
* Disclaimer shape: `modules/ROOT/partials/documentation-tools-disclaimer.adoc` (single `[IMPORTANT]` block: AI-assistance sentence, then "This section's xref:…#_bibliography[bibliography] lists the reference material consulted…").
* Cheat sheet convention: `documentation-tools/cheat-sheet.adoc` (disclaimer include, intro linking `xref:attachment$….pdf[downloadable PDF]`, grouped `*Group* --` paragraphs of `xref:`s, final download line, `== References`). PDFs are rendered from a throwaway HTML page with headless Chrome print-to-PDF and checked with `pdfinfo`.
* Tile icon convention: `modules/ROOT/images/documentation-tools.svg` is a 600×600 SVG (gradient card, `cardClip`, white line-art glyph). `cms.svg` follows it with no WordPress logo.
* Existing pages that receive one-line back-links (the issue's "What already exists" table): `web/php-laravel/introduction-and-architecture.adoc` (its "WordPress, Drupal and other platforms" section), `web/php-laravel/index.adoc`, `programming-languages/php/index.adoc`, `backend/frameworks-comparison.adoc`, `backend/kubernetes/persistent-volumes-and-storage-classes.adoc`, `backend/kubernetes/stateful-applications-in-practice.adoc`, `backend/kubernetes/bookshelf-end-to-end.adoc`.
* Link targets for cross-references (verified to exist): `programming-languages/php/*` (composer-and-packages, testing-with-phpunit-and-pest, static-analysis-and-refactoring, opcache-jit-and-performance, debugging-and-profiling), `database/sql/*`, `database/redis/*`, `backend/docker/*`, `backend/kubernetes/*`, `backend/oauth/*`, `backend/jmeter/*`, `web/react/*`, `web/nextjs/*`, `web/e2e-testing/*`, `web/accessibility.adoc`, `web/media-optimization/*`, `web/cors.adoc`, `ai/mcp/*`, `web/frameworks-comparison.adoc`, `backend/frameworks-comparison.adoc`.
* Tooling: Antora 3.1.15 (`npx antora antora-playbook.yml`), `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`), `pdfinfo`, headless Chrome. No test suite.
* Precedent: `.archive/implementation_plan_264.md` (WebRTC & WebSockets, 65 pages) and `.archive/implementation_plan_247.md`.
* `CLAUDE.md` rules that every task must respect: one-line image macros, quoted alt text with commas, passthrough for inline code with `->`/`=>`/`__`/`{`, Mermaid `<` as `&lt;`, every SVG referenced.

## Implementation steps

### Group 1: Foundations, wiring and landing pages — Parallelizable: no — Task 3 and Task 5 to 6 depend on the partials and the page list from Task 1 and Task 2; Task 6 links the pages of every later group

- [x] Task 1. Add the two disclaimer partials
  - [x] Task 1.1. Create `modules/ROOT/partials/cms-wordpress-disclaimer.adoc`: a single `[IMPORTANT]` block in the exact shape of `documentation-tools-disclaimer.adoc`, with only the AI-assistance sentence ("…verified against the official documentation before being relied on in production") and a pointer to `xref:cms/wordpress/index.adoc#_bibliography[the WordPress bibliography]`.
  - [x] Task 1.2. Create `modules/ROOT/partials/cms-disclaimer.adoc` the same way, pointing to `xref:cms/index.adoc#_bibliography[the section bibliography]`.
- [x] Task 2. Re-verify the version baseline and set up the shared Lumen Press example workspace
  - [x] Task 2.1. Re-verify every item of the issue's baseline table and "Findings" against the official sources (release status of WordPress 7.1.x and 7.2, PHP/database requirements, Gutenberg, `@wordpress/scripts`, `@wordpress/create-block`, `@wordpress/env`, WP-CLI, WPCS, MCP Adapter, DataViews, Playground CLI, RTC status). _Done 2026-10-28: the exploration for #290 ran the same day; page agents re-check items on their own pages._ Record the confirmed values and check date in the session scratchpad (`baseline.md`) for use in every page intro; note anything that changed.
  - [x] Task 2.2. Create a throwaway wp-env / Compose workspace in the scratchpad with WordPress, MariaDB, Redis and Mailpit and a skeleton of `lumen-catalog`, `lumen` and the `lumen/*` blocks, used by later tasks to run and lint the examples (never committed). _Done per page instead: each page agent built its own Docker/wp-env stack from the shared brief, ran its examples and tore it down._
- [x] Task 3. Add the nav block to `modules/ROOT/nav.adoc`
  - [x] Task 3.1. After the last top-level Guides & References block, add `** xref:cms/index.adoc[CMS (Content Management System)]`, `*** xref:cms/wordpress/index.adoc[WordPress]`, the non-link `****` group headings (Getting Started, Using WordPress, Administration, Block Themes, Classic Themes, Plugin Development, Block Development, APIs & Data, Tooling & Delivery, Headless & AI) each with one `*****` entry per outline page in outline order, then `**** xref:cms/wordpress/where-older-books-and-tutorials-are-outdated.adoc[Outdated Advice]`, `**** …/comparison-and-decision-guide.adoc[Comparison & Decision Guide]` and `**** …/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Check first whether #246 has landed and place the block after its last entry if so.
- [x] Task 4. Add the home tile and root metadata
  - [x] Task 4.1. Draw `modules/ROOT/images/cms.svg`: an original 600×600 SVG in the style of `documentation-tools.svg` (gradient card, white line-art glyph such as a page with content blocks), with no WordPress logo or trademark.
  - [x] Task 4.2. In `modules/ROOT/pages/index.adoc`, add `image::cms.svg[xref="cms/index.adoc"]` in a new table row followed by two empty `a|` cells (or in the first empty cell of the #246 row if it landed), and update `:description:` ("content management systems (WordPress)") and `:keywords:` per the issue.
- [x] Task 5. Write `modules/ROOT/pages/cms/index.adoc` (CMS landing page): what a CMS is, traditional vs headless vs hybrid, sub-section list (WordPress), related material (E-commerce #246 in prose, PHP and Laravel, PHP Reference, Docker), its own `== Bibliography` and `== References`; include `cms-disclaimer.adoc`. 📊 `modules/ROOT/images/cms-architectures.svg` (traditional, headless and hybrid CMS) referenced from the page.
- [x] Task 6. Write `cms/wordpress/index.adoc` (landing page) with the version baseline and check date, a reading path per goal, `== What's covered` grouped like the nav, the related-material table, a **link back to `cms/index.adoc`**, and the `== Bibliography` (books with correct ISBNs and publisher pages, official documentation, ecosystem; "(unverified)" for the Apress page if it still cannot be opened). 📊 Mermaid mind-map and `cms-wordpress-lumen-press-map.svg`. The bibliography is completed in Task 101 once every page's `== References` is known.

### Group 2: Getting Started — Parallelizable: yes

- [x] Task 7. `introduction-and-architecture.adoc` ★ — WordPress.org vs .com, GPL, history, the request lifecycle, core directories, drop-ins and mu-plugins, the hook model; 📊 Mermaid sequence of the request lifecycle and `cms-wordpress-architecture.svg`.
- [x] Task 8. `versions-and-release-cycle.adoc` — X.Y majors vs Z minors, cadence and 2026 roadmap, "what's new 6.5 → 7.2" table, PHP compatibility table; 📊 Mermaid timeline.
- [x] Task 9. `requirements-and-hosting.adoc` — PHP/database/HTTPS requirements and the disagreeing official pages, hosting types and evaluation, domains and DNS.
- [x] Task 10. `installation.adoc` — the 5-minute install, WP-CLI install, `wp-config.php` and salts, own-directory install, common install errors.
- [x] Task 11. `local-development-environments.adoc` — wp-env, Compose with official images, Playground (and Playground CLI vs `wp-now`), staging, `WP_ENVIRONMENT_TYPE`; 📊 Mermaid local → staging → production.
- [x] Task 12. `database-schema.adoc` — the 12 tables, Multisite tables, EAV model, autoload, indexes, charset; 📊 Mermaid ER diagram.

### Group 3: Using WordPress — Parallelizable: yes

- [x] Task 13. `dashboard-and-admin-screens.adoc`
- [x] Task 14. `block-editor-for-authors.adoc` ★ — 📊 original SVG of the editor layout (`cms-wordpress-editor-layout.svg`, not a screenshot).
- [x] Task 15. `posts-and-pages.adoc` — 📊 Mermaid post-status state diagram.
- [x] Task 16. `media-library.adoc`
- [x] Task 17. `categories-tags-and-comments.adoc`
- [x] Task 18. `users-roles-and-profiles.adoc`
- [x] Task 19. `settings-screens.adoc`
- [x] Task 20. `site-editor-and-global-styles.adoc` ★ — 📊 Mermaid of where edits are stored.
- [x] Task 21. `patterns-for-site-builders.adoc`
- [x] Task 22. `choosing-and-managing-plugins-and-themes.adoc`
- [x] Task 23. `seo-analytics-and-privacy.adoc`
- [x] Task 24. `importing-exporting-and-migrating.adoc` — 📊 Mermaid migration checklist flow.

### Group 4: Administration — Parallelizable: yes

- [x] Task 25. `wp-config-reference.adoc` ★
- [x] Task 26. `web-servers-apache-and-nginx.adoc`
- [x] Task 27. `file-permissions-and-filesystem.adoc`
- [x] Task 28. `updates-and-auto-updates.adoc` — 📊 Mermaid decision tree.
- [x] Task 29. `security-hardening.adoc` ★ — 📊 `cms-wordpress-layered-defense.svg`.
- [x] Task 30. `backups-and-disaster-recovery.adoc`
- [x] Task 31. `performance-and-caching.adoc` ★ — 📊 `cms-wordpress-caching-layers.svg`.
- [x] Task 32. `scaling-and-high-availability.adoc` — 📊 `cms-wordpress-high-availability.svg`.
- [x] Task 33. `wp-cron-and-scheduled-tasks.adoc` — 📊 Mermaid cron sequence.
- [x] Task 34. `email-delivery.adoc`
- [x] Task 35. `debugging-site-health-and-troubleshooting.adoc` ★ — 📊 Mermaid troubleshooting flowchart.
- [x] Task 36. `multisite-networks.adoc` ★ — 📊 `cms-wordpress-multisite-topology.svg`.

### Group 5: Block Themes — Parallelizable: yes

- [x] Task 37. `themes-overview.adoc` ★ — 📊 `cms-wordpress-theme-file-trees.svg`.
- [x] Task 38. `block-theme-templates-and-template-parts.adoc` ★
- [x] Task 39. `template-hierarchy.adoc` — 📊 `cms-wordpress-template-hierarchy.svg` and a Mermaid single-post resolution.
- [x] Task 40. `theme-json-settings.adoc` ★ — 📊 Mermaid style layers (core < parent < child < user).
- [x] Task 41. `theme-json-styles.adoc` ★
- [x] Task 42. `typography-and-fonts.adoc`
- [x] Task 43. `theme-patterns.adoc`
- [x] Task 44. `style-variations-and-section-styles.adoc`
- [x] Task 45. `navigation-and-menus.adoc`
- [x] Task 46. `child-themes.adoc`
- [x] Task 47. `create-block-theme-and-version-control.adoc` — 📊 Mermaid edit → save → commit loop.
- [x] Task 48. `theme-accessibility-and-releasing.adoc`

### Group 6: Classic Themes — Parallelizable: yes

- [x] Task 49. `classic-theme-anatomy-and-the-loop.adoc` ★ — 📊 Mermaid of The Loop.
- [x] Task 50. `functions-php-theme-supports-and-assets.adoc`
- [x] Task 51. `customizer-api.adoc`
- [x] Task 52. `widgets-and-sidebars.adoc`
- [x] Task 53. `hybrid-themes-and-migration-to-block-themes.adoc` — 📊 Mermaid migration path.
- [x] Task 54. `page-builders-and-commercial-themes.adoc`

### Group 7: Plugin Development — Parallelizable: yes

- [x] Task 55. `plugin-fundamentals.adoc` ★
- [x] Task 56. `hooks-actions-and-filters.adoc` ★ — 📊 Mermaid hook firing order.
- [x] Task 57. `security-for-developers.adoc` ★ — 📊 Mermaid input → output flow.
- [x] Task 58. `custom-post-types-and-taxonomies.adoc` ★
- [x] Task 59. `metadata-and-custom-fields.adoc`
- [x] Task 60. `administration-menus-and-settings-api.adoc`
- [x] Task 61. `shortcodes.adoc`
- [x] Task 62. `roles-and-capabilities-api.adoc`
- [x] Task 63. `javascript-ajax-and-heartbeat.adoc`
- [x] Task 64. `internationalization.adoc`
- [x] Task 65. `privacy-and-personal-data.adoc`
- [x] Task 66. `publishing-to-the-plugin-directory.adoc`

### Group 8: Block Development — Parallelizable: yes

- [x] Task 67. `block-development-environment.adoc` ★
- [x] Task 68. `block-json-and-registration.adoc` ★ — 📊 Mermaid block registration.
- [x] Task 69. `static-and-dynamic-blocks.adoc` ★ — 📊 Mermaid save → content → render.
- [x] Task 70. `attributes-supports-and-inner-blocks.adoc`
- [x] Task 71. `variations-styles-transforms-and-deprecations.adoc`
- [x] Task 72. `block-bindings-api.adoc` — 📊 Mermaid binding resolution.
- [x] Task 73. `block-hooks.adoc`
- [x] Task 74. `interactivity-api.adoc` ★ — 📊 Mermaid hydration flow.
- [x] Task 75. `data-layer-and-editor-extensibility.adoc`
- [x] Task 76. `components-dataviews-and-admin-screens.adoc`

### Group 9: APIs & Data — Parallelizable: yes

- [x] Task 77. `wp-query-and-the-database-api.adoc` ★
- [x] Task 78. `options-transients-and-object-cache.adoc`
- [x] Task 79. `http-and-filesystem-apis.adoc`
- [x] Task 80. `rewrite-api-and-permalinks.adoc` — 📊 Mermaid URL → template flow.
- [x] Task 81. `authentication-and-login-api.adoc`
- [x] Task 82. `rest-api-using.adoc` ★ — 📊 Mermaid authenticated request.
- [x] Task 83. `rest-api-extending.adoc` ★
- [x] Task 84. `images-and-media-api.adoc`
- [x] Task 85. `multisite-development.adoc`

### Group 10: Tooling & Delivery — Parallelizable: yes

- [x] Task 86. `wp-cli.adoc` ★
- [x] Task 87. `coding-standards-and-static-analysis.adoc` (consistent with the `iru-setup-php-wordpress` toolchain)
- [x] Task 88. `testing.adoc` ★ — 📊 Mermaid test pyramid.
- [x] Task 89. `composer-based-wordpress.adoc`
- [x] Task 90. `deployment-and-ci-cd.adoc` — 📊 Mermaid pipeline.
- [x] Task 91. `containers-docker-and-kubernetes.adoc`
- [x] Task 92. `playground-and-blueprints.adoc`

### Group 11: Headless & AI — Parallelizable: yes

- [x] Task 93. `headless-wordpress.adoc` ★ — 📊 `cms-wordpress-headless-architecture.svg` and a Mermaid preview flow.
- [x] Task 94. `abilities-api-and-mcp-adapter.adoc` — 📊 Mermaid ability → REST/MCP → agent.
- [x] Task 95. `ai-client-and-connectors.adoc`

### Group 12: Reference and cheat sheet — Parallelizable: no — Task 96 and Task 98 summarise and link every page written in Groups 2 to 11

- [x] Task 96. `where-older-books-and-tutorials-are-outdated.adoc`: the table per area (platform, administration, security, performance, SEO, Multisite, themes, development) from the issue's book comparison, in our own words, with the official source for each correction, and the "changed since older tutorials" list.
- [x] Task 97. `comparison-and-decision-guide.adoc`: the decision tables and a 📊 Mermaid decision tree; links to the framework comparison pages.
- [x] Task 98. `cheat-sheet.adoc` (page): disclaimer, intro linking `xref:attachment$cms-wordpress-cheat-sheet.pdf[downloadable PDF]` with baseline and date, grouped `*Group* --` paragraphs of `xref:`s to every page, final download line, `== References`.
- [x] Task 99. Render `modules/ROOT/attachments/cms-wordpress-cheat-sheet.pdf` from a throwaway HTML page in the scratchpad with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`); dense multi-column colour-coded A4 page covering every concept listed in the issue's "Cheat sheet" section, with the version baseline and date in the header. Check `pdfinfo` says exactly one page, preview as a PNG, commit only the PDF.

### Group 13: Integration — Parallelizable: no — Task 101 needs every page's `== References`; Task 100 edits existing pages other tasks do not touch

- [x] Task 100. Add the one-line back-links (each an `xref:` to the matching new page) to the seven existing pages listed under "Current code state", and make the `introduction-and-architecture` WordPress section of `web/php-laravel/` point to `cms/wordpress/index.adoc`. Do not touch any `ecommerce/` link (#246 stays prose-only).
- [x] Task 101. Finalise `cms/wordpress/index.adoc`'s `== Bibliography`: collect every source used across all pages' `== References`, ensure each is linked to its official website, the books are linked to their publisher pages with correct ISBNs, unverifiable entries are marked "(unverified)", and `cms/index.adoc`'s bibliography is consistent.
- [x] Task 102. Link every page of the sub-section from `cms/wordpress/index.adoc`'s `== What's covered` and ensure the nav entries of Task 3 match the files that actually exist (page names and titles).

### Group 14: Verification — Parallelizable: no — runs once everything has landed

- [x] Task 103. Run and lint the examples: execute the Lumen Press plugin, theme and block examples in the Task 2.2 workspace, run `phpcs --standard=WordPress`, `wp-scripts lint-js`, `wp-scripts build` and the REST/WP-CLI snippets, and fix any page whose example fails. Tear the stacks down. Delegate long runs to the `iru-gate-runner` agent where it fits, so output stays out of the main context.
- [x] Task 104. Audit coverage against the issue: every "Findings" bullet and every outdated-claim row appears on its page; every ★ page is detailed; every code example is followed by a `Source:` link; every page has `== References`.
- [x] Task 105. Build the site with `npx antora antora-playbook.yml` and confirm no `xref`/AsciiDoc errors or warnings; check the grouped nav renders in `build/site` (four levels) and that no `xref:` points to a missing page (the Group 2 to 11 forward links resolve now).
- [x] Task 106. Run the `CLAUDE.md` verification checks and make sure each prints nothing for the new section: block image macros closed on one line, inline macros, `<p>image::` leaks, unquoted-comma alt text on the changed files, inline-code substitutions in `build/site/cms`, `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid`; every SVG referenced by a page; the only admonitions are the disclaimers (`grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/cms` prints nothing; the partials hold the only blocks).
- [x] Task 107. Final hygiene: `git status` shows no book files, no scratchpad content and no `api2.txt`; no real secrets in any example (`/iru-check-security` or `detect-secrets` on the changed files); the PDF is committed as one page.
- [x] Task 108. Run `/iru-update-docs` only if the repository's own docs (README, `CLAUDE.md` project list) mention sections that need a one-line update; otherwise record that nothing is needed. _Nothing needed: README.md and CLAUDE.md do not list the guide sections._
