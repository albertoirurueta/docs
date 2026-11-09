# Implementation plan: Drupal and Joomla sub-sections under CMS (issue #355)

## Task summary

Add **Drupal** (`modules/ROOT/pages/cms/drupal/`, 89 pages) and **Joomla** (`modules/ROOT/pages/cms/joomla/`, 76 pages)
sub-sections to Guides & References / CMS (Content Management System), between Webflow and Comparison, teaching how to
use, customize and develop on each CMS with the Meridian Museum and Tallpine Hiking Club running scenarios, a
disclaimer partial each, Mermaid diagrams and original SVG figures, a bibliography on each landing page and a one-page
A4 cheat-sheet PDF each. The issue body (conventions, findings, book comparison, bibliography, acceptance criteria) and
its two outline comments (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201 and https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) are authoritative; every page task refers to them rather
than repeating them.

Choices made:
* **One branch and one PR** (`feature/355-drupal-joomla`), like #289 (Webflow, 80 pages) and #290, rather than the
  issue's suggested eight PRs: the earlier CMS sub-sections landed as single PRs and the review flow (`iru-issue`) opens
  one PR. The groups below follow the issue's suggested split, so the work can still be reviewed group by group.
* The branch is named from the issue title per the branch-naming rule (`feature/355-drupal-joomla`), not the issue's
  suggested `feature/355-cms-drupal-joomla`.
* All tasks are documentation only and therefore untagged (implemented directly).
* Facts are re-verified against the official documentation at implementation time. The baseline date is 2026-10-30, so
  Drupal 12.0.0 (week of 2026-12-07) and the Drupal 10 end of life (2026-12-09) are written as scheduled, not as
  released. Unconfirmed values (Drupal 12 PostgreSQL minimum, Joomla 6 MariaDB/PostgreSQL minimums, Packt URLs) are
  stated with both official values or marked unverified, in prose.
* Code examples are written to the pinned versions and checked for syntax; running them on a live DDEV or Docker site
  is best effort and not a gate (no Drupal/Joomla runtime is set up in this repository).
* The books in `~/Desktop/libros/drupal-joomla` are never committed and no text from them is copied.

Source: GitHub issue #355
Base branch: main
Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/partials/cms-drupal-disclaimer.adoc` and `modules/ROOT/partials/cms-joomla-disclaimer.adoc` exist, following `cms-wordpress-disclaimer.adoc`." | Task 1 |
| 2 | "`nav.adoc` has the **Drupal** and **Joomla** blocks between Webflow and Comparison … The grouped nav renders correctly." | Task 170, Task 175 |
| 3 | "`cms/index.adoc` lists both sub-sections, no longer says they \"can be added later\", and its bibliography is updated. `cms/comparison.adoc` links both sub-sections. The root `index.adoc` `:description:`/`:keywords:` are updated." | Task 171, Task 172, Task 173 |
| 4 | "Every Drupal outline page exists under `modules/ROOT/pages/cms/drupal/` (89 pages)" | Task 2–86, Task 159–Task 162, Task 176 |
| 5 | "Every Joomla outline page exists under `modules/ROOT/pages/cms/joomla/` (76 pages)" | Task 87–158, Task 164–Task 167, Task 176 |
| 6 | "**Every concept explored for this issue** … has its own page(s) with **detailed information and code examples linked to the official documentation**" | Task 2–86, Task 87–158 |
| 7 | "Every finding listed under \"Findings from the exploration\" is stated, in prose, on the page(s) it concerns." | Task 2–86, Task 87–158 |
| 8 | "Every outdated claim in \"Comparison with the requester-provided books\" is corrected on the page it concerns and collected in the sub-section's `where-older-books-and-tutorials-are-outdated.adoc`" | Task 2–86, Task 87–158, Task 160, Task 165 |
| 9 | "Every ★ page has **detailed** content" | the ★-marked tasks in Task 2–86 and Task 87–158 |
| 10 | "Every code example runs against the versions pinned in its dependency snippet … followed by a link to the official documentation page it derives from … no real secrets." | Task 2–86, Task 87–158, Task 177 |
| 11 | "The `meridian_collection` module and `meridian` theme pass PHPCS … PHPStan … The `pkg_tallpine` PHP passes PHPCS with PSR-12. Both install and run on the pinned versions" | Task 2–86, Task 87–158 (written to those standards; running them is best effort, see Task summary) |
| 12 | "Mermaid diagrams and `cms-drupal-*.svg` / `cms-joomla-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`. Every SVG is referenced by a page, and none uses the Drupal, Druplicon or Joomla logos." | the 📊-marked tasks, Task 161, Task 166, Task 169, Task 176 |
| 13 | "The two disclaimer partials are the **only** admonitions in the new sub-sections" | Task 1, Task 176 |
| 14 | "Each sub-section's `index.adoc` `== Bibliography` lists **every source used** … Each page has a `== References` section." | Task 159, Task 164, Task 176 |
| 15 | "`cms/drupal/cheat-sheet.adoc` links `modules/ROOT/attachments/cms-drupal-cheat-sheet.pdf`, and `cms/joomla/cheat-sheet.adoc` links `modules/ROOT/attachments/cms-joomla-cheat-sheet.pdf`." | Task 162, Task 167 |
| 16 | "Each PDF is a **single-page** A4, downloadable summary of every concept in its sub-section." | Task 163, Task 168 |
| 17 | "The back-links listed in \"What already exists\" are added." | Task 174 |
| 18 | "No `xref:` points to a page that doesn't exist." | Task 175, Task 176 |
| 19 | "The books are **not** committed, and no text, figure or screenshot is copied from them." | Task 177, Task 178 |
| 20 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings. The `CLAUDE.md` image, inline-code and Mermaid checks print nothing" | Task 175, Task 176 |

## Current code state

- `modules/ROOT/pages/cms/` has `index.adoc`, `comparison.adoc`, `wordpress/` (102 files) and `webflow/` (80 pages); no
  `drupal/` or `joomla/`.
- `modules/ROOT/nav.adoc` (CMS block around lines 2925–3121): WordPress block, Webflow block ending with
  `**** xref:cms/webflow/cheat-sheet.adoc[Cheat Sheet (PDF)]`, then `*** xref:cms/comparison.adoc[Comparison]`.
- `cms/index.adoc:223` has the "can be added later" sentence; its bibliography (~line 285) already lists About Drupal,
  the Drupal JSON:API module and About Joomla. `cms/comparison.adoc` names Drupal and Joomla throughout with external
  links.
- Templates: `partials/cms-webflow-disclaimer.adoc`, `cms/webflow/cheat-sheet.adoc`, `cms/webflow/index.adoc`,
  `cms/webflow/where-older-books-and-tutorials-are-outdated.adoc`, `cms/webflow/comparison-and-decision-guide.adoc`;
  PDFs in `modules/ROOT/attachments/`; images in `modules/ROOT/images/` referenced by bare filename.
- Back-link targets exist: `web/php-laravel/{index,introduction-and-architecture}.adoc`,
  `programming-languages/php/index.adoc`, `backend/frameworks-comparison.adoc`; link-only targets `backend/docker/`,
  `backend/kubernetes/`, `backend/oauth/`, `database/sql/`, `database/redis/`, `web/react/`, `web/nextjs/`,
  `web/e2e-testing/`, `web/cors.adoc`, `web/accessibility.adoc`, `ai/mcp/`, `ecommerce/comparison.adoc`.
- Precedent: `.archive/implementation_plan_289.md` (Webflow), `_290.md` (WordPress), `_351.md` (CMS comparison).
- Docs root: repository root (`antora.yml`, component `ROOT`). Host: GitHub albertoirurueta/docs.

## Per-page contract (applies to every page task)

Start with `= Title`, `:description:`, `:keywords:`, then `include::partial$cms-drupal-disclaimer.adoc[]` or
`include::partial$cms-joomla-disclaimer.adoc[]`. Then an intro with the check date (2026-10-30) and, for developer pages,
the pinned versions (Drupal 11.4.x, Drush 13/14, PHP 8.3+; Joomla 6.2.x, PHP 8.3+). Write a detailed explanation of the
concept, covering:
* the relevant screens, settings and APIs
* internals
* security
* common errors and pitfalls
* version notes and the issue's findings, in prose
* corrections of the books, in prose

Code examples use the Meridian Museum (`meridian_collection`, `meridian`, `meridian_events`) or Tallpine Hiking Club
(`pkg_tallpine`, `com_tallpine`, `cassiopeia_tallpine`) scenario. Each example is followed by a `Source:` link to the
official page it derives from. Pages contain no admonitions other than the disclaimer, and no real secrets.

Inline code containing `->`, `=>`, `<=`, `<-`, `__`, `#[`, `~`, `*`, `^`, `...`, `'` or `{` is written as
`` `+...+` ``, or as `pass:c[...]` when it contains `+`. PHP attributes (`#[Hook]`, `#[Block]`) and Drupal `__construct`
need this.

Mermaid blocks write `<` followed by a letter as `&lt;`. Image macros stay on one line, and alt text containing a comma
is wrapped in double quotes.

End every page with `== References` listing its official sources. ★ pages are the most detailed. Run the `CLAUDE.md`
source greps on each page as it is written.

## Implementation steps

### Group 1: Disclaimer partials

Parallelizable: yes

- [x] Task 1. Create `modules/ROOT/partials/cms-drupal-disclaimer.adoc` and `modules/ROOT/partials/cms-joomla-disclaimer.adoc`, each a single `[IMPORTANT]` block identical in shape to `cms-webflow-disclaimer.adoc`: the house AI-assistance sentence naming "the official Drupal documentation" / "the official Joomla documentation", and the pointer `xref:cms/drupal/index.adoc#_bibliography[Drupal bibliography]` / `xref:cms/joomla/index.adoc#_bibliography[Joomla bibliography]`. Nothing else.

### Group 2: Drupal Getting Started (6 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 2. Write `modules/ROOT/pages/cms/drupal/introduction-and-architecture.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 3. Write `modules/ROOT/pages/cms/drupal/versions-release-cycle-and-support.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 4. Write `modules/ROOT/pages/cms/drupal/requirements-and-hosting.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 5. Write `modules/ROOT/pages/cms/drupal/installation-with-composer-and-ddev.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 6. Write `modules/ROOT/pages/cms/drupal/drupal-cms-and-site-templates.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 7. Write `modules/ROOT/pages/cms/drupal/project-layout-and-local-development.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 3: Drupal Site Building (17 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 8. Write `modules/ROOT/pages/cms/drupal/content-types-and-fields.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 9. Write `modules/ROOT/pages/cms/drupal/field-types-and-entity-references.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 10. Write `modules/ROOT/pages/cms/drupal/taxonomy.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 11. Write `modules/ROOT/pages/cms/drupal/media-and-media-library.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 12. Write `modules/ROOT/pages/cms/drupal/text-formats-and-ckeditor-5.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 13. Write `modules/ROOT/pages/cms/drupal/menus-and-path-aliases.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 14. Write `modules/ROOT/pages/cms/drupal/blocks-and-block-layout.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 15. Write `modules/ROOT/pages/cms/drupal/views.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 16. Write `modules/ROOT/pages/cms/drupal/display-modes-and-image-styles.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 17. Write `modules/ROOT/pages/cms/drupal/layout-builder.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 18. Write `modules/ROOT/pages/cms/drupal/canvas-visual-page-building.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 19. Write `modules/ROOT/pages/cms/drupal/users-roles-and-permissions.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 20. Write `modules/ROOT/pages/cms/drupal/content-moderation-workflows-and-revisions.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 21. Write `modules/ROOT/pages/cms/drupal/workspaces.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 22. Write `modules/ROOT/pages/cms/drupal/multilingual.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 23. Write `modules/ROOT/pages/cms/drupal/search-and-search-api.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 24. Write `modules/ROOT/pages/cms/drupal/forms-for-visitors-contact-and-webform.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 4: Drupal Administration (13 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 25. Write `modules/ROOT/pages/cms/drupal/settings-php-and-environments.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 26. Write `modules/ROOT/pages/cms/drupal/configuration-management.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 27. Write `modules/ROOT/pages/cms/drupal/updates-composer-and-security-advisories.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 28. Write `modules/ROOT/pages/cms/drupal/automatic-updates-and-project-browser.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 29. Write `modules/ROOT/pages/cms/drupal/recipes.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 30. Write `modules/ROOT/pages/cms/drupal/cron-queues-and-maintenance.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 31. Write `modules/ROOT/pages/cms/drupal/performance-and-caching.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 32. Write `modules/ROOT/pages/cms/drupal/security-hardening.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 33. Write `modules/ROOT/pages/cms/drupal/file-system-and-private-files.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 34. Write `modules/ROOT/pages/cms/drupal/backups-and-disaster-recovery.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 35. Write `modules/ROOT/pages/cms/drupal/multisite.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 36. Write `modules/ROOT/pages/cms/drupal/logging-status-report-and-troubleshooting.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 37. Write `modules/ROOT/pages/cms/drupal/admin-ui-navigation-and-admin-themes.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 5: Drupal Theming (13 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 38. Write `modules/ROOT/pages/cms/drupal/theming-overview-and-render-pipeline.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 39. Write `modules/ROOT/pages/cms/drupal/theme-info-and-regions.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 40. Write `modules/ROOT/pages/cms/drupal/libraries-and-assets.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 41. Write `modules/ROOT/pages/cms/drupal/twig-templates-and-debugging.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 42. Write `modules/ROOT/pages/cms/drupal/template-suggestions-and-preprocess.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 43. Write `modules/ROOT/pages/cms/drupal/starterkit-and-subthemes.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 44. Write `modules/ROOT/pages/cms/drupal/single-directory-components.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 45. Write `modules/ROOT/pages/cms/drupal/breakpoints-and-responsive-images.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 46. Write `modules/ROOT/pages/cms/drupal/theme-settings-and-configurable-themes.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 47. Write `modules/ROOT/pages/cms/drupal/twig-extensions-in-modules.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 48. Write `modules/ROOT/pages/cms/drupal/front-end-tooling.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 49. Write `modules/ROOT/pages/cms/drupal/accessibility-and-performance-in-themes.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 50. Write `modules/ROOT/pages/cms/drupal/email-and-error-pages-theming.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 6: Drupal Module Development (19 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 51. Write `modules/ROOT/pages/cms/drupal/module-anatomy-and-info-yml.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 52. Write `modules/ROOT/pages/cms/drupal/routing-and-controllers.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 53. Write `modules/ROOT/pages/cms/drupal/services-and-dependency-injection.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 54. Write `modules/ROOT/pages/cms/drupal/hooks-and-oop-hooks.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 55. Write `modules/ROOT/pages/cms/drupal/events-and-subscribers.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 56. Write `modules/ROOT/pages/cms/drupal/form-api.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 57. Write `modules/ROOT/pages/cms/drupal/configuration-api-and-schema.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 58. Write `modules/ROOT/pages/cms/drupal/plugin-api-and-attributes.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 59. Write `modules/ROOT/pages/cms/drupal/block-field-type-widget-and-formatter-plugins.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 60. Write `modules/ROOT/pages/cms/drupal/entity-api.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 61. Write `modules/ROOT/pages/cms/drupal/custom-entity-types.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 62. Write `modules/ROOT/pages/cms/drupal/database-api-and-entity-queries.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 63. Write `modules/ROOT/pages/cms/drupal/render-api-and-cache-metadata.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 64. Write `modules/ROOT/pages/cms/drupal/access-control-and-permissions-in-code.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 65. Write `modules/ROOT/pages/cms/drupal/queue-batch-and-cron-apis.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 66. Write `modules/ROOT/pages/cms/drupal/update-api-and-post-updates.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 67. Write `modules/ROOT/pages/cms/drupal/ajax-and-htmx.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 68. Write `modules/ROOT/pages/cms/drupal/translation-in-code.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 69. Write `modules/ROOT/pages/cms/drupal/migrate-api.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 7: Drupal APIs & Headless (5 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 70. Write `modules/ROOT/pages/cms/drupal/json-api.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — 1079 lines
- [x] Task 71. Write `modules/ROOT/pages/cms/drupal/rest-and-serialization.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 571 lines
- [x] Task 72. Write `modules/ROOT/pages/cms/drupal/graphql.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 845 lines
- [x] Task 73. Write `modules/ROOT/pages/cms/drupal/authentication-and-oauth.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 414 lines
- [x] Task 74. Write `modules/ROOT/pages/cms/drupal/decoupled-drupal-with-nextjs.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — 1197 lines

### Group 8: Drupal Tooling & Delivery (6 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 75. Write `modules/ROOT/pages/cms/drupal/drush.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — 1243 lines
- [x] Task 76. Write `modules/ROOT/pages/cms/drupal/automated-testing.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — 1198 lines
- [x] Task 77. Write `modules/ROOT/pages/cms/drupal/coding-standards-and-static-analysis.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 564 lines
- [x] Task 78. Write `modules/ROOT/pages/cms/drupal/deployment-and-ci-cd.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 578 lines
- [x] Task 79. Write `modules/ROOT/pages/cms/drupal/docker-and-containers.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 752 lines
- [x] Task 80. Write `modules/ROOT/pages/cms/drupal/contributing-and-the-drupal-community.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. — 346 lines

### Group 9: Drupal Upgrades (4 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 81. Write `modules/ROOT/pages/cms/drupal/upgrading-drupal-10-to-11.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 82. Write `modules/ROOT/pages/cms/drupal/preparing-for-drupal-12.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 83. Write `modules/ROOT/pages/cms/drupal/migrating-from-drupal-7.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 84. Write `modules/ROOT/pages/cms/drupal/removed-core-modules-and-replacements.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 10: Drupal AI (2 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 85. Write `modules/ROOT/pages/cms/drupal/ai-module-and-providers.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.
- [x] Task 86. Write `modules/ROOT/pages/cms/drupal/mcp-server-and-ai-agents.adoc` per its entry in the Drupal outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339201) and the "Page conventions" in the issue body.

### Group 11: Joomla Getting Started (6 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 87. Write `modules/ROOT/pages/cms/joomla/introduction-and-architecture.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 88. Write `modules/ROOT/pages/cms/joomla/versions-release-cycle-and-support.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 89. Write `modules/ROOT/pages/cms/joomla/requirements-and-hosting.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 90. Write `modules/ROOT/pages/cms/joomla/installation-and-the-public-folder.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 91. Write `modules/ROOT/pages/cms/joomla/local-development-with-docker.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 92. Write `modules/ROOT/pages/cms/joomla/administrator-tour-dashboards-and-guided-tours.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.

### Group 12: Joomla Using Joomla (16 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 93. Write `modules/ROOT/pages/cms/joomla/articles.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 94. Write `modules/ROOT/pages/cms/joomla/categories-and-tags.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 95. Write `modules/ROOT/pages/cms/joomla/custom-fields.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 96. Write `modules/ROOT/pages/cms/joomla/menus-and-menu-items.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 97. Write `modules/ROOT/pages/cms/joomla/modules-and-positions.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 98. Write `modules/ROOT/pages/cms/joomla/media-manager.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 99. Write `modules/ROOT/pages/cms/joomla/users-groups-access-levels-and-acl.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 100. Write `modules/ROOT/pages/cms/joomla/workflows.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 101. Write `modules/ROOT/pages/cms/joomla/multilingual-sites.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 102. Write `modules/ROOT/pages/cms/joomla/contacts-banners-and-news-feeds.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 103. Write `modules/ROOT/pages/cms/joomla/smart-search.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 104. Write `modules/ROOT/pages/cms/joomla/privacy-and-action-logs.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 105. Write `modules/ROOT/pages/cms/joomla/mail-templates-and-email-settings.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 106. Write `modules/ROOT/pages/cms/joomla/scheduled-tasks.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 107. Write `modules/ROOT/pages/cms/joomla/global-configuration.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 108. Write `modules/ROOT/pages/cms/joomla/seo-sef-urls-redirects-and-schema-org.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.

### Group 13: Joomla Administration (10 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 109. Write `modules/ROOT/pages/cms/joomla/updating-joomla-and-automated-core-updates.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 110. Write `modules/ROOT/pages/cms/joomla/extensions-installing-updating-and-update-sites.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 111. Write `modules/ROOT/pages/cms/joomla/security-hardening-mfa-and-passkeys.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 112. Write `modules/ROOT/pages/cms/joomla/configuration-php-and-htaccess.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 113. Write `modules/ROOT/pages/cms/joomla/caching-and-performance.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 114. Write `modules/ROOT/pages/cms/joomla/backups-and-recovery.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 115. Write `modules/ROOT/pages/cms/joomla/system-information-maintenance-and-troubleshooting.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 116. Write `modules/ROOT/pages/cms/joomla/command-line-interface.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 117. Write `modules/ROOT/pages/cms/joomla/web-server-reverse-proxy-and-https.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 118. Write `modules/ROOT/pages/cms/joomla/multi-site-options-and-scaling.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.

### Group 14: Joomla Templates (11 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 119. Write `modules/ROOT/pages/cms/joomla/templates-and-template-styles.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 120. Write `modules/ROOT/pages/cms/joomla/cassiopeia-and-cassiopeia-extended.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 121. Write `modules/ROOT/pages/cms/joomla/child-templates.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 122. Write `modules/ROOT/pages/cms/joomla/template-overrides-and-alternative-layouts.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 123. Write `modules/ROOT/pages/cms/joomla/layouts-and-module-chromes.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 124. Write `modules/ROOT/pages/cms/joomla/web-asset-manager.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 125. Write `modules/ROOT/pages/cms/joomla/building-a-template-from-scratch.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 126. Write `modules/ROOT/pages/cms/joomla/administrator-template-atum.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 127. Write `modules/ROOT/pages/cms/joomla/colour-modes-rtl-and-accessibility.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 128. Write `modules/ROOT/pages/cms/joomla/error-offline-and-component-pages.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 129. Write `modules/ROOT/pages/cms/joomla/template-frameworks-and-page-builders.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.

### Group 15: Joomla Extension Development (17 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 130. Write `modules/ROOT/pages/cms/joomla/extension-types-manifests-and-packaging.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 131. Write `modules/ROOT/pages/cms/joomla/namespaces-autoloading-and-dependency-injection.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 132. Write `modules/ROOT/pages/cms/joomla/component-mvc-administrator.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 133. Write `modules/ROOT/pages/cms/joomla/component-site-views-and-routing.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 134. Write `modules/ROOT/pages/cms/joomla/forms-and-form-fields.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 135. Write `modules/ROOT/pages/cms/joomla/database-api.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 136. Write `modules/ROOT/pages/cms/joomla/acl-in-extensions.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 137. Write `modules/ROOT/pages/cms/joomla/categories-custom-fields-and-workflow-integration.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 138. Write `modules/ROOT/pages/cms/joomla/language-files-and-internationalisation.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 139. Write `modules/ROOT/pages/cms/joomla/module-development.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 140. Write `modules/ROOT/pages/cms/joomla/plugin-development-and-events.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 141. Write `modules/ROOT/pages/cms/joomla/console-command-plugins.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 142. Write `modules/ROOT/pages/cms/joomla/scheduled-task-plugins.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 143. Write `modules/ROOT/pages/cms/joomla/installer-scripts-and-sql-updates.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 144. Write `modules/ROOT/pages/cms/joomla/update-servers-and-the-jed.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 145. Write `modules/ROOT/pages/cms/joomla/error-handling-and-legacy-apis.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 146. Write `modules/ROOT/pages/cms/joomla/security-in-extensions.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.

### Group 16: Joomla Web Services API (3 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 147. Write `modules/ROOT/pages/cms/joomla/web-services-api.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — 875 lines
- [x] Task 148. Write `modules/ROOT/pages/cms/joomla/extending-the-web-services-api.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. — 840 lines
- [x] Task 149. Write `modules/ROOT/pages/cms/joomla/headless-joomla.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. — 460 lines

### Group 17: Joomla Tooling & Delivery (4 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 150. Write `modules/ROOT/pages/cms/joomla/coding-standards-and-static-analysis.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 151. Write `modules/ROOT/pages/cms/joomla/testing-extensions.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 152. Write `modules/ROOT/pages/cms/joomla/build-and-ci-for-extensions.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 153. Write `modules/ROOT/pages/cms/joomla/debugging.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.

### Group 18: Joomla Upgrades (4 pages)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 154. Write `modules/ROOT/pages/cms/joomla/migrating-from-joomla-3.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 155. Write `modules/ROOT/pages/cms/joomla/upgrading-joomla-4-to-5.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.
- [x] Task 156. Write `modules/ROOT/pages/cms/joomla/upgrading-joomla-5-to-6.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 157. Write `modules/ROOT/pages/cms/joomla/deprecations-and-preparing-for-joomla-7.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body.

### Group 19: Joomla AI & Roadmap (1 page)

Parallelizable: yes — each task creates its own new file; cross-page `xref:` targets may not exist until later groups land, so xref errors are checked in the verification group

- [x] Task 158. Write `modules/ROOT/pages/cms/joomla/ai-mcp-and-the-roadmap.adoc` per its entry in the Joomla outline comment (https://github.com/albertoirurueta/docs/issues/355#issuecomment-6509339692) and the "Page conventions" in the issue body. — 325 lines

### Group 20: Drupal landing and reference pages

Parallelizable: yes — each task creates its own file; the landing page lists sources cited by the page groups, so it is written after them

- [x] Task 159. Write `cms/drupal/index.adoc` per the outline's `index.adoc` entry: audience, the Meridian Museum scenario, check date and pinned versions, reading paths per goal, `== What's covered` grouped like the nav, a related-material table linking the existing pages in the issue's "What already exists" table, `== Bibliography` listing **every** source cited across `cms/drupal/` (each linked to its official website; the books linked to their Packt pages with the ISBNs in the issue body, Packt URLs re-verified or marked as unverified in prose), `== References`.
- [x] Task 160. Write `cms/drupal/where-older-books-and-tutorials-are-outdated.adoc`: every Drupal row of the issue's "Comparison with the requester-provided books" table as "older advice → current state → official source" rows by area, plus generic outdated tutorial advice; cite the book by title, copy no text, figure or screenshot from it.
- [x] Task 161. Write `cms/drupal/comparison-and-decision-guide.adoc` per the outline: decision tables, a 📊 Mermaid decision tree (any `<` followed by a letter written as `&lt;`), links to `cms/comparison.adoc` for cross-CMS metrics (not repeated), to `cms/wordpress/` and `cms/webflow/`, and one sentence on shop extensions linking `ecommerce/comparison.adoc`.
- [x] Task 162. Write `cms/drupal/cheat-sheet.adoc` modelled on `cms/webflow/cheat-sheet.adoc`: disclaimer, intro with check date and pinned versions, a PDF download line `xref:attachment$cms-drupal-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` paragraphs linking every page, `== References`.
- [x] Task 163. Create the one-page A4 `modules/ROOT/attachments/cms-drupal-cheat-sheet.pdf`: HTML in the session scratchpad, headless Chrome `--headless --print-to-pdf --no-pdf-header-footer`, dense colour-coded multi-column layout covering everything the outline's cheat-sheet specification lists, check date and versions in the header; verify exactly one page (PyMuPDF, since `pdfinfo` is not installed), preview as PNG, commit only the PDF.

### Group 21: Joomla landing and reference pages

Parallelizable: yes — each task creates its own file; the landing page lists sources cited by the page groups, so it is written after them

- [x] Task 164. Write `cms/joomla/index.adoc` per the outline's `index.adoc` entry: audience, the Tallpine Hiking Club scenario, check date and pinned versions, reading paths per goal, `== What's covered` grouped like the nav, a related-material table linking the existing pages in the issue's "What already exists" table, `== Bibliography` listing **every** source cited across `cms/joomla/` (each linked to its official website; the books linked to their Packt pages with the ISBNs in the issue body, Packt URLs re-verified or marked as unverified in prose), `== References`.
- [x] Task 165. Write `cms/joomla/where-older-books-and-tutorials-are-outdated.adoc`: every Joomla row of the issue's "Comparison with the requester-provided books" table as "older advice → current state → official source" rows by area, plus generic outdated tutorial advice; cite the book by title, copy no text, figure or screenshot from it.
- [x] Task 166. Write `cms/joomla/comparison-and-decision-guide.adoc` per the outline: decision tables, a 📊 Mermaid decision tree (any `<` followed by a letter written as `&lt;`), links to `cms/comparison.adoc` for cross-CMS metrics (not repeated), to `cms/wordpress/` and `cms/webflow/`, and one sentence on shop extensions linking `ecommerce/comparison.adoc`.
- [x] Task 167. Write `cms/joomla/cheat-sheet.adoc` modelled on `cms/webflow/cheat-sheet.adoc`: disclaimer, intro with check date and pinned versions, a PDF download line `xref:attachment$cms-joomla-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` paragraphs linking every page, `== References`.
- [x] Task 168. Create the one-page A4 `modules/ROOT/attachments/cms-joomla-cheat-sheet.pdf`: HTML in the session scratchpad, headless Chrome `--headless --print-to-pdf --no-pdf-header-footer`, dense colour-coded multi-column layout covering everything the outline's cheat-sheet specification lists, check date and versions in the header; verify exactly one page (PyMuPDF, since `pdfinfo` is not installed), preview as PNG, commit only the PDF.

### Group 22: Figures audit

Parallelizable: yes

- [x] Task 169. Audit every page whose outline entry marks 📊 and confirm it has a `[mermaid]` block or an original `modules/ROOT/images/cms-drupal-*.svg` / `cms-joomla-*.svg` figure (a floor, not a ceiling); no Drupal, Druplicon or Joomla logos and no screenshots copied from any source; each SVG referenced by a page through a one-line `image::` macro (alt text containing a comma wrapped in double quotes); add anything missing.
  - Audited 41 outline pages marked 📊: all have a mermaid block or SVG; every outline-named SVG exists and is referenced; all cms-drupal-*/cms-joomla-* SVGs pass xmllint, have a title and are referenced; all image:: targets exist, one-line, no unquoted-comma alt text, no logos. No changes needed.

### Group 23: Navigation, landing updates and back-links

Parallelizable: yes — each task edits different files

- [x] Task 170. In `modules/ROOT/nav.adoc`, insert after `**** xref:cms/webflow/cheat-sheet.adoc[Cheat Sheet (PDF)]` and before `*** xref:cms/comparison.adoc[Comparison]`: `*** xref:cms/drupal/index.adoc[Drupal]`, its nine non-link `****` group headings with one `*****` entry per outline page in outline order (index not repeated), then `**** ...where-older-books-and-tutorials-are-outdated.adoc[Outdated Advice]`, `**** ...comparison-and-decision-guide.adoc[Comparison & Decision Guide]`, `**** ...cheat-sheet.adoc[Cheat Sheet (PDF)]`; the same shape for `*** xref:cms/joomla/index.adoc[Joomla]`. Check the five-level nav renders.
- [x] Task 171. Update `modules/ROOT/pages/cms/index.adoc`: add Drupal and Joomla rows to the sub-section table, remove the "can be added later" sentence (line ~223), add one paragraph each to the traditional/headless/hybrid and open-source/SaaS discussion, add bibliography entries. No admonitions.
- [x] Task 172. Update `modules/ROOT/pages/cms/comparison.adoc`: where it links product names, change `https://www.drupal.org/[Drupal]` and the Joomla equivalent to `xref:cms/drupal/index.adoc[Drupal] (documented on this site)` / `xref:cms/joomla/index.adoc[Joomla] (documented on this site)`, in the WordPress style. Metrics are not re-computed.
- [x] Task 173. Update root `modules/ROOT/pages/index.adoc`: append "Drupal and Joomla" to `:description:` and `Drupal, Drupal 11, Drupal CMS, Twig, Single Directory Components, Drush, Joomla, Joomla 6, Cassiopeia, Joomla extensions` to `:keywords:`; the CMS tile stays as is.
- [x] Task 174. Add the one-line back-links from the issue's "What already exists" table: `web/php-laravel/introduction-and-architecture.adoc` and `web/php-laravel/index.adoc` (→ `cms/drupal/index.adoc`, plus `cms/joomla/index.adoc` where the sentence fits), `programming-languages/php/index.adoc` (→ both), `backend/frameworks-comparison.adoc` (→ `cms/drupal/index.adoc` next to the WordPress link).

### Group 24: Verification

Parallelizable: no — depends on every previous group

- [x] Task 175. Run `npx antora antora-playbook.yml` through the `iru-gate-runner` agent (`Skill iru-build-docs`) and fix every `xref`/AsciiDoc error or warning; review `build/site/cms/drupal` and `build/site/cms/joomla` in the preview with a temporary launch config serving `build/site` (the tracked `launch.json` serves the wrong directory).
- [x] Task 176. Run the `CLAUDE.md` checks: the three image-macro greps, the unquoted-comma alt grep on the new/changed `.adoc` files, the inline-code substitution grep on `build/site/ROOT/cms/drupal` and `build/site/ROOT/cms/joomla` (actual paths confirmed after the build), plus rendered-text scans for stray backticks, bare `+` and `[[x]]`; `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`; confirm no admonition other than the two disclaimers, every new SVG referenced and every `image::` target present, every page has `== References`, and the page counts are 89 and 76.
- [x] Task 177. Run `Skill iru-check-security` on the changes (detect-secrets findings in this docs repo are false positives per project memory: label them `is_secret:false`) and confirm nothing from `~/Desktop/libros/drupal-joomla` is committed.
- [x] Task 178. Confirm `git status` lists only intended files (no `build/`, no book content, no scratch HTML or extracted text). `/iru-update-docs` is not needed because the change is itself documentation.
