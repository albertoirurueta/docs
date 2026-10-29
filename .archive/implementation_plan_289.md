# Implementation plan: Webflow sub-section under CMS (issue #289)

## Task summary

Add a **Webflow** sub-section (`modules/ROOT/pages/cms/webflow/`, 80 pages in 13 outline groups) to a new top-level
**CMS (Content Management System)** section under Guides & References, teaching how to use, customize and develop on
Webflow, with the Fernbrook Gardens running scenario, a disclaimer partial, figures, bibliography and a one-page A4
cheat sheet PDF. The full per-page outline is in the issue comment
https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824 and the conventions are in the issue body;
both are authoritative and every page task below refers to them rather than repeating them.

Choices made: #290 (WordPress) has not landed, so this plan creates the shared `cms/` scaffolding exactly as #290
specifies, listing only Webflow. All tasks are documentation-only and therefore untagged (implemented directly). Pages
are grouped by outline area; a single final group wires nav, landing and back-links once every page exists, and the
last group runs the full build and checks. Facts must be re-verified against the official documentation at
implementation time (baseline date 2026-10-28). The requester's book in `~/Desktop/libros/webflow` is never committed.

Source: GitHub issue #289
Base branch: main
Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "The shared CMS scaffolding exists (from #290, or created here exactly as #290 specifies)." | Task 1, Task 2, Task 3 |
| 2 | "`modules/ROOT/partials/cms-webflow-disclaimer.adoc` exists, following `documentation-tools-disclaimer.adoc`." | Task 1 |
| 3 | "`nav.adoc` has the **Webflow** block under **CMS (Content Management System)** … the grouped nav renders correctly." | Task 86, Task 89 |
| 4 | "`cms/index.adoc` lists Webflow, and the root `index.adoc` `:description:`/`:keywords:` mention Webflow." | Task 2, Task 87 |
| 5 | "Every outline page exists under `modules/ROOT/pages/cms/webflow/` (80 pages)" | Task 4–79, Task 80–83 |
| 6 | "Every concept explored for this issue has its own page(s) with detailed information and code examples linked to the official documentation" | Task 4–79 |
| 7 | "Every finding listed under 'Findings from the exploration' is stated, in prose, on the page(s) it concerns, with plans named by tier and no prices." | Task 4–79, Task 90 |
| 8 | "Every outdated claim in 'Comparison with the requester-provided book' is corrected on the page it concerns and collected in `where-older-books-and-tutorials-are-outdated.adoc`" | Task 4–79, Task 81 |
| 9 | "Every ★ page has detailed content" | Tasks 4, 5, 8, 10, 11, 12, 18, 20, 21, 24, 28, 29, 31, 37, 40, 41, 43, 46, 48, 53, 58, 60, 63, 66, 67, 68, 69, 72, 73, 74, 77 |
| 10 | "Every developer example runs against the pinned versions … followed by a link to the official documentation page … Fernbrook Gardens … no real tokens" | Task 4–79, Task 90 |
| 11 | "Unofficial techniques (`Webflow.push`, `Webflow.require('ix2')`) are labelled unofficial in prose." | Task 54, Task 90 |
| 12 | "Mermaid diagrams and `cms-webflow-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`." | Task 85, Task 82, Task 90 |
| 13 | "The disclaimer partial is the only admonition in the sub-section" | Task 1, Task 90 |
| 14 | "`cms/webflow/index.adoc`'s `== Bibliography` lists every source used, each linked to its official website, and the book linked to its publisher page with correct ISBNs. Each page has a `== References` section." | Task 80, Task 4–79 |
| 15 | "`cms/webflow/cheat-sheet.adoc` links `modules/ROOT/attachments/cms-webflow-cheat-sheet.pdf`." | Task 83 |
| 16 | "The PDF is a single-page A4, downloadable summary of every concept in the sub-section." | Task 84 |
| 17 | "The back-links listed above are added." | Task 88 |
| 18 | "No `xref:` points to a page that doesn't exist: #290, #246 and #351 are referenced in prose only unless they have landed." | Task 82, Task 89, Task 90 |
| 19 | "The book is not committed, and no text, figure or screenshot is copied from it." | Task 91, Task 92 |
| 20 | "`npx antora antora-playbook.yml` completes without `xref`/AsciiDoc errors, and every verification command in `CLAUDE.md` prints nothing for `build/site/cms/webflow`." | Task 89, Task 90 |

## Current code state

- No `modules/ROOT/pages/cms/` exists; no CMS branch or PR exists; #290 is open.
- Precedent: `modules/ROOT/pages/ecommerce/` (#246, `.archive/implementation_plan_246.md`) and
  `documentation-tools/` (#247); disclaimer template `modules/ROOT/partials/documentation-tools-disclaimer.adoc`;
  cheat-sheet convention `documentation-tools/cheat-sheet.adoc` and PDFs in `modules/ROOT/attachments/`.
- `modules/ROOT/nav.adoc` has the `** xref:ecommerce/index.adoc[E-commerce]` block (~line 2770) with `***`/`****` levels.
- Images live in `modules/ROOT/images/`, referenced by bare filename on one line. Mermaid and MathJax extensions are active.
- Docs root: repository root (`antora.yml`, component `ROOT`). Host: GitHub albertoirurueta/docs.

## Per-page contract (applies to every page task)

Start with `= Title`, `:description:`, `:keywords:`, `include::partial$cms-webflow-disclaimer.adoc[]`; intro with check
date, plans by tier name only (no prices) and pinned versions for developer pages; detailed concept explanation, generated
HTML/CSS/JS output, pitfalls, security, change dates, corrections of the book as prose; code examples on Developer
workspace sites with Fernbrook Gardens data, each followed by a `Source:` link to the official page; no admonitions other
than the disclaimer; no real secrets; inline code containing `=>`, `->`, `...`, `{}`, `*`, `^`, `~`, `__`, `'` written as
`` `+...+` `` (or `pass:c[...]` when it contains `+`); end with `== References` listing official sources. ★ pages are the
most detailed. Check each page with the `CLAUDE.md` grep checks as it is written.

## Implementation steps

### Group 1: Shared CMS scaffolding (created here because #290 has not landed)

Parallelizable: yes

- [x] Task 1. Create `modules/ROOT/partials/cms-disclaimer.adoc` (single `[IMPORTANT]` AI-assistance block pointing at `xref:cms/index.adoc#_bibliography[the CMS bibliography]`), modelled on `documentation-tools-disclaimer.adoc`, and `modules/ROOT/partials/cms-webflow-disclaimer.adoc` pointing at `xref:cms/webflow/index.adoc#_bibliography[the Webflow bibliography]`.
- [x] Task 2. Create `modules/ROOT/pages/cms/index.adoc` exactly as #290 specifies (header attributes, disclaimer include, intro to traditional vs headless vs hybrid and open source vs SaaS, sub-section list containing only Webflow for now, `== Bibliography` with Webflow's official sites each linked to its website, `== References`). Model on `ecommerce/index.adoc`.
- [x] Task 3. Create the original `modules/ROOT/images/cms.svg` home tile (no trademarked logos), in the style of the other section tiles (e.g. the e-commerce tile), and reference it from the root `index.adoc` tile block (Task 87).

### Group 2: Getting Started (5 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 4. Write `modules/ROOT/pages/cms/webflow/introduction-and-architecture.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 5. Write `modules/ROOT/pages/cms/webflow/plans-workspaces-seats-and-roles.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 6. Write `modules/ROOT/pages/cms/webflow/product-changes-and-deprecations.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 7. Write `modules/ROOT/pages/cms/webflow/first-site-and-the-dashboard.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 8. Write `modules/ROOT/pages/cms/webflow/designer-tour.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.

### Group 3: Designing (11 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 9. Write `modules/ROOT/pages/cms/webflow/html-and-css-in-webflow.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 10. Write `modules/ROOT/pages/cms/webflow/elements-and-page-structure.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 11. Write `modules/ROOT/pages/cms/webflow/style-panel-and-box-model.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 12. Write `modules/ROOT/pages/cms/webflow/classes-combo-classes-and-selectors.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 13. Write `modules/ROOT/pages/cms/webflow/class-naming-systems.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 14. Write `modules/ROOT/pages/cms/webflow/flexbox-and-grid-layouts.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 15. Write `modules/ROOT/pages/cms/webflow/positioning-and-overflow.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 16. Write `modules/ROOT/pages/cms/webflow/typography-and-fonts.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 17. Write `modules/ROOT/pages/cms/webflow/backgrounds-borders-and-effects.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 18. Write `modules/ROOT/pages/cms/webflow/responsive-design-and-breakpoints.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.
- [x] Task 19. Write `modules/ROOT/pages/cms/webflow/images-and-assets.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — written, doc-only (no tests/coverage applicable); CLAUDE.md image/inline-code greps clean.

### Group 4: Design Systems (4 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 20. Write `modules/ROOT/pages/cms/webflow/variables-and-modes.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 21. Write `modules/ROOT/pages/cms/webflow/components-props-slots-and-variants.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 22. Write `modules/ROOT/pages/cms/webflow/shared-libraries.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 23. Write `modules/ROOT/pages/cms/webflow/building-a-design-system.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 5: Interactions (4 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 24. Write `modules/ROOT/pages/cms/webflow/interactions-with-gsap.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 25. Write `modules/ROOT/pages/cms/webflow/scroll-and-page-animations.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 26. Write `modules/ROOT/pages/cms/webflow/classic-interactions.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 27. Write `modules/ROOT/pages/cms/webflow/lottie-spline-rive-and-video.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 6: CMS (8 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 28. Write `modules/ROOT/pages/cms/webflow/cms-concepts-and-content-modeling.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 29. Write `modules/ROOT/pages/cms/webflow/collections-and-field-types.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 30. Write `modules/ROOT/pages/cms/webflow/reference-and-multi-reference-fields.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 31. Write `modules/ROOT/pages/cms/webflow/collection-lists.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 32. Write `modules/ROOT/pages/cms/webflow/collection-template-pages.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 33. Write `modules/ROOT/pages/cms/webflow/conditional-visibility-and-dynamic-embeds.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 34. Write `modules/ROOT/pages/cms/webflow/csv-import-and-export.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 35. Write `modules/ROOT/pages/cms/webflow/cms-limits-and-scaling.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 7: Content & Publishing (4 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 36. Write `modules/ROOT/pages/cms/webflow/content-editing-on-the-canvas.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 37. Write `modules/ROOT/pages/cms/webflow/publishing-and-scheduling.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 38. Write `modules/ROOT/pages/cms/webflow/page-branching-releases-and-approvals.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 39. Write `modules/ROOT/pages/cms/webflow/collaboration-comments-and-activity-log.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 8: Site Settings & Operations (9 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 40. Write `modules/ROOT/pages/cms/webflow/forms.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 41. Write `modules/ROOT/pages/cms/webflow/seo-and-aeo.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 42. Write `modules/ROOT/pages/cms/webflow/redirects-and-site-migration.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 43. Write `modules/ROOT/pages/cms/webflow/domains-hosting-and-publishing-options.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 44. Write `modules/ROOT/pages/cms/webflow/backups-and-recovery.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 45. Write `modules/ROOT/pages/cms/webflow/password-protection-and-site-search.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 46. Write `modules/ROOT/pages/cms/webflow/accessibility.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 47. Write `modules/ROOT/pages/cms/webflow/performance-optimization.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 48. Write `modules/ROOT/pages/cms/webflow/localization.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.

### Group 9: Commerce, Growth & AI (4 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 49. Write `modules/ROOT/pages/cms/webflow/ecommerce-overview.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 50. Write `modules/ROOT/pages/cms/webflow/analyze-and-optimize.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 51. Write `modules/ROOT/pages/cms/webflow/integrations-and-marketplace-apps.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 52. Write `modules/ROOT/pages/cms/webflow/ai-features-and-credits.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 10: Custom Code (5 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 53. Write `modules/ROOT/pages/cms/webflow/custom-code-head-footer-and-embeds.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 54. Write `modules/ROOT/pages/cms/webflow/custom-attributes-and-javascript.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 55. Write `modules/ROOT/pages/cms/webflow/third-party-libraries-and-scripts.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 56. Write `modules/ROOT/pages/cms/webflow/reverse-proxy-and-custom-hosting.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 57. Write `modules/ROOT/pages/cms/webflow/code-export-and-portability.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 11: Data API & Headless (10 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 58. Write `modules/ROOT/pages/cms/webflow/developer-platform-overview.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 59. Write `modules/ROOT/pages/cms/webflow/webflow-cli.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 60. Write `modules/ROOT/pages/cms/webflow/data-api-authentication-and-scopes.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 61. Write `modules/ROOT/pages/cms/webflow/data-api-sdks-limits-and-errors.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 62. Write `modules/ROOT/pages/cms/webflow/data-api-sites-pages-and-components.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 63. Write `modules/ROOT/pages/cms/webflow/data-api-cms.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 64. Write `modules/ROOT/pages/cms/webflow/data-api-assets-forms-and-custom-code.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 65. Write `modules/ROOT/pages/cms/webflow/data-api-ecommerce-and-localization.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 66. Write `modules/ROOT/pages/cms/webflow/webhooks.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 67. Write `modules/ROOT/pages/cms/webflow/content-delivery-api-and-headless.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.

### Group 12: Apps & Extensions (4 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 68. Write `modules/ROOT/pages/cms/webflow/apps-overview-and-oauth.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 69. Write `modules/ROOT/pages/cms/webflow/designer-extensions-and-designer-api.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 70. Write `modules/ROOT/pages/cms/webflow/hybrid-apps.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.
- [x] Task 71. Write `modules/ROOT/pages/cms/webflow/publishing-apps-and-marketplace.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body.

### Group 13: DevLink, Cloud & Agents (8 pages)

Parallelizable: yes — each task creates its own new file; cross-group `xref:` targets may not exist until later groups land, so xref errors are checked in Group 17

- [x] Task 72. Write `modules/ROOT/pages/cms/webflow/devlink-export.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — devlink-export.adoc, 1374 lines, Mermaid; docs-only, greps clean.
- [x] Task 73. Write `modules/ROOT/pages/cms/webflow/code-components.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section.
- [x] Task 74. Write `modules/ROOT/pages/cms/webflow/webflow-cloud.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — webflow-cloud.adoc, 918 lines, cms-webflow-cloud-routing.svg; docs-only, greps clean.
- [x] Task 75. Write `modules/ROOT/pages/cms/webflow/webflow-cloud-storage.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — webflow-cloud-storage.adoc, 862 lines; docs-only, greps clean.
- [x] Task 76. Write `modules/ROOT/pages/cms/webflow/webflow-cloud-deployments-and-environments.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — webflow-cloud-deployments-and-environments.adoc, 565 lines, Mermaid; docs-only, greps clean.
- [x] Task 77. Write `modules/ROOT/pages/cms/webflow/mcp-server-and-ai-agents.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. ★ central page: must be among the most detailed in the sub-section. — mcp-server-and-ai-agents.adoc, 868 lines, cms-webflow-mcp-architecture.svg + 2 Mermaid; docs-only, greps clean.
- [x] Task 78. Write `modules/ROOT/pages/cms/webflow/enterprise-apis-and-governance.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — enterprise-apis-and-governance.adoc, 953 lines; docs-only, greps clean.
- [x] Task 79. Write `modules/ROOT/pages/cms/webflow/testing-ci-and-devops.adoc` per its entry in the outline comment (https://github.com/albertoirurueta/docs/issues/289#issuecomment-6465385824) and the "Page conventions" in the issue body. — testing-ci-and-devops.adoc, 692 lines, Mermaid; docs-only, greps clean.

### Group 14: Sub-section landing and reference pages (3 + index)

Parallelizable: yes

- [x] Task 80. Write `cms/webflow/index.adoc` (audience, Fernbrook Gardens scenario, check date and pinned tool versions, reading paths per goal, `== What's covered` grouped like the nav, related-material table, `== Bibliography` listing every source with official-website links and the book linked to its publisher page with correct ISBNs, `== References`). Done: index.adoc with audience, Fernbrook scenario, check date and pinned versions, reading paths, nav-grouped coverage, related material and a Bibliography of every source cited across cms/webflow (Packt page unified to webflow-by-example-9781801075398, ISBNs 978-1-80107-539-8 and 978-1-80107-177-2); docs-only, no tests or coverage.
- [x] Task 81. Write `cms/webflow/where-older-books-and-tutorials-are-outdated.adoc`: every outdated claim from the issue's book-comparison table as "older advice → current state → source" rows by area, plus generic outdated tutorial advice; cite the book, copy no text from it. Done: where-older-books-and-tutorials-are-outdated.adoc; docs-only.
- [x] Task 82. Write `cms/webflow/comparison-and-decision-guide.adoc` with the criteria tables and a Mermaid decision flowchart (`<` followed by a letter written as `&lt;`); #290, #246 and #351 in prose only. Done: comparison-and-decision-guide.adoc with criteria tables and a Mermaid decision flowchart; docs-only.
- [x] Task 83. Write `cms/webflow/cheat-sheet.adoc` (disclaimer, intro with check date and tool versions, grouped `*Group* --` xref paragraphs to every page, PDF download line, `== References`). Done: cheat-sheet.adoc linking every page and the PDF; docs-only.
- [x] Task 84. Create the one-page A4 `modules/ROOT/attachments/cms-webflow-cheat-sheet.pdf`: HTML in the session scratchpad, headless Chrome `--headless --print-to-pdf --no-pdf-header-footer`, dense colour-coded multi-column covering every concept listed in the issue's "Cheat sheet" section, check date and tool versions in the header; verify exactly 1 page with `pdfinfo`, preview as PNG, commit only the PDF. Done: modules/ROOT/attachments/cms-webflow-cheat-sheet.pdf, exactly 1 A4 page, previewed as PNG; source HTML kept in the scratchpad.

### Group 15: Figures

Parallelizable: yes

- [x] Task 85. Add `[mermaid]` blocks or original `modules/ROOT/images/cms-webflow-*.svg` figures on every page where the outline marks 📊 (a floor, not a ceiling); no Webflow/GSAP logos, no Designer screenshots; each SVG referenced by a page via one-line `image::` macros (quote alt text containing commas); all Mermaid pass `npm run validate:mermaid`.

### Group 16: Navigation, landing updates and back-links

Parallelizable: yes

- [x] Task 86. In `modules/ROOT/nav.adoc` add `** xref:cms/index.adoc[CMS (Content Management System)]` under Guides & References and the Webflow block: `*** xref:cms/webflow/index.adoc[Webflow]`, the 12 non-link `****` group headings, one `*****` entry per outline page in outline order, then the Outdated Advice, Comparison & Decision Guide and Cheat Sheet (PDF) `****` entries. Check the five-level nav renders.
  - nav.adoc: CMS block, Webflow, 12 group headings, 80 page entries (build renders nav, no xref errors)
- [x] Task 87. Update root `modules/ROOT/pages/index.adoc`: CMS tile (`cms.svg`, xref to `cms/index.adoc`), add Webflow to `:description:` and append `Webflow, Webflow Designer, Webflow CMS, Webflow Interactions, GSAP, Webflow Data API, Webflow DevLink, Webflow Cloud, Webflow MCP` to `:keywords:`.
  - pages/index.adoc: CMS tile, description, keywords
- [x] Task 88. Add the one-line back-links: `web/html-css/index.adoc`, `web/nextjs/index.adoc` and the other pages in the issue's "What already exists" table that "gain a one-line link".
  - back-links in web/html-css/index.adoc and web/nextjs/index.adoc (the #290 WordPress comparison page does not exist yet)

### Group 17: Verification

Parallelizable: no — depends on all previous groups

- [x] Task 89. Run `npx antora antora-playbook.yml` and fix every `xref`/AsciiDoc error; delegate to `iru-gate-runner` (`Skill iru-build-docs`) to keep logs out of the main context. Review `build/site/cms` in the preview using a temporary launch config (tracked `launch.json` serves the wrong directory). — Antora build clean for cms/ (0 errors, 0 missing-attribute warnings); fixed `{...}` spans in data-api-*, webhooks.
- [x] Task 90. Run the `CLAUDE.md` verification greps (image macros, `<p>image::`, inline-code substitutions on `build/site/cms/webflow`) plus the rendered-text scans for stray backticks, bare `+` and `[[x]]`; run `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`); check no admonition other than the disclaimer, every SVG referenced, every `image::` target exists, no `xref:` to #290/#246/#351 pages, no prices, no secrets. — all CLAUDE.md greps and rendered-HTML scans clean after fixes; validate:mermaid: 2614 diagrams parsed; no admonitions, no orphan SVGs, no missing image targets, no prices.
- [x] Task 91. Run `Skill iru-check-security` on the changes (detect-secrets findings in this docs repo are false positives per project memory — label `is_secret:false`), confirm `~/Desktop/libros/webflow` content is not committed. — ad hoc detect-secrets scan: 3 findings (reported, baseline untouched); no book content in repo.
- [x] Task 92. Confirm `git status` lists only intended files (no `build/`, no book content, no scratch HTML); `/iru-update-docs` is not needed because the change is itself documentation. — git status lists only intended files; no build/, scratch files or backups.
