# Implementation Plan: Guides & References — Documentation Tools

## Task summary

Source: GitHub issue #247
Base branch: main

Issue [#247](https://github.com/albertoirurueta/docs/issues/247) asks for a new top-level **Documentation Tools**
section under *Guides & References*, authored into this repo's own `ROOT` Antora component
(`modules/ROOT/pages/documentation-tools/`, nav title **Documentation Tools**), placed after Git & GitHub. It teaches
docs-as-code with four tools, each a subsection with one page per concept in the issue's outline: **Antora** (18 pages,
plus an 8-page **UI Bundle** sub-subsection: create, customise, build, preview, publish), **Docusaurus** (19),
**Zensical** (14) and **DocFX** (13). It also adds a `comparison.adoc` (feature matrix, strengths/weaknesses, dated
metrics, time-series/radar/bar charts, recommendations), a landing `index.adoc` ending in `== Bibliography`, and a
`cheat-sheet.adoc` linking a one-page A4 PDF. The issue body is the specification; re-read it
(`gh issue view 247 --json body -q .body`) when writing each page, because its per-page concept lists, findings,
bibliography and page conventions are not repeated here.

Deliverables: 72 tool pages (including the four tool landing pages) plus the section root's `index.adoc`, `comparison.adoc` and `cheat-sheet.adoc` (75 pages); the disclaimer partial; nav block;
home-page tile and icon plus metadata; `documentation-tools-*.svg` figures and Mermaid diagrams; chart data and
generator; `documentation-tools-cheat-sheet.pdf`; back-links on 7 existing pages.

**Choices made on the user's behalf**

* **Delivery (user-confirmed):** one branch (`feature/247-add-documentation-tools-section`) and one draft PR.
* **Tooling (user-confirmed):** the implementation may install npm/pip packages and Docker images and run Docker, in
  the session scratchpad only, to run the examples. DocFX runs in the `mcr.microsoft.com/dotnet/sdk` image because
  `dotnet` is not installed. Anything that cannot be installed or run is documented in full and the page says in
  plain prose (never an admonition) that it was not executed and why.
* **Running example:** *Pocket Units* (C# + Python units library) in all four subsections, as the issue specifies.
  The sources are shown in the pages and not committed as projects.
* **Version baseline:** the issue's table (Antora 3.2.x, Docusaurus 3.10.x, Zensical 0.0.x, DocFX 2.81.x), re-verified
  at implementation time; every page states its baseline and check date. Metrics are re-fetched, not copied.
* **Admonitions:** the disclaimer partial is the only admonition in the section; version, maintenance, alpha and
  security caveats are prose or table rows.
* **Task tags:** all tasks are AsciiDoc/SVG/PDF authoring with no matching `iru-*-code-one-task` skill, so they are
  untagged and implemented directly. YAML, TOML, TS, C# and Python appear only as listings verified in the scratchpad.
* **Parallelism:** page tasks are distinct files, so tasks within a group are parallelizable. Forward xrefs to pages in
  later groups are the only build errors allowed until Group 9.
* **Cross-issue references:** #196 and #255 are mentioned in prose only, never as `xref:`. This repo's playbook is not
  changed.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "New **Documentation Tools** section under Guides & References at `modules/ROOT/pages/documentation-tools/`, in the nav after Git & GitHub, with a tile and icon on the home page and updated `:description:`/`:keywords:`." | Tasks 2, 3 |
| 2 | "One subsection per tool (Antora with its UI Bundle sub-subsection, Docusaurus, Zensical, DocFX), each with a landing page and one page per concept in the outline, with detailed explanations and complete, runnable examples, each followed by a link to the official documentation." | Tasks 6 to 77, Task 5 |
| 3 | "The Antora UI Bundle pages explain how to create, customise, build (`npx gulp bundle`), preview and publish a UI bundle, and how a playbook consumes it." | Tasks 24 to 31 |
| 4 | "Every finding listed in \"Findings from the exploration\" is stated in the relevant page (re-verified)." | Task 4, Tasks 6 to 77 |
| 5 | "Mermaid diagrams and original SVG figures where they help; all Mermaid blocks pass `npm run validate:mermaid` and every SVG is referenced." | Tasks 6 to 77, Tasks 80, 84 |
| 6 | "`comparison.adoc` with feature matrix, strengths and weaknesses, dated and cited metrics, time-series, radar and other charts (SVG or a configured extension, data and generator kept if scripted), and recommendations by purpose." | Tasks 78, 79 |
| 7 | "`index.adoc` ends with a Bibliography listing every source used, each linked to its official website." | Task 80 |
| 8 | "The only admonition in the section is the AI-assistance disclaimer partial, included in every page." | Task 1, Tasks 6 to 77, Task 84 |
| 9 | "`cheat-sheet.adoc` links a one-page A4 `documentation-tools-cheat-sheet.pdf` summarising the four tools." | Tasks 81, 82 |
| 10 | "Back-links added to the existing pages listed in \"What already exists\"." | Task 83 |
| 11 | "The Antora build completes with no errors, and the `CLAUDE.md` verification greps (images, inline code, Mermaid) print nothing for the new section." | Task 84 |

## Current code state

There is no application code. The Antora root component is `ROOT` (`antora.yml`, `antora-playbook.yml`,
`modules/ROOT/`), the docs root is the repository root, and the host is GitHub (`albertoirurueta/docs`). Tooling: Node
v24, Docker, Python 3 and Chrome at `/Applications/Google Chrome.app` (not on PATH); no `dotnet`, no `pdfinfo` (use
PyMuPDF). The repo uses `antora` 3.1.15, so the new pages describe 3.2 from a scratch project, not from this repo.

* `documentation-tools/` does not exist; no `implementation_plan.md` existed before this plan.
* **Nav:** `modules/ROOT/nav.adoc:2691` is the last Git & GitHub entry; the block goes right after it. The section
  appears once, so no nav partial.
* **Home page:** `modules/ROOT/pages/index.adoc` Guides & References table; the last used cell is
  `image::git-and-github.svg` (line 119) followed by `image::ai.svg` and an empty cell; `:description:`/`:keywords:` on lines 2-3.
* **Partials:** one `<section>-disclaimer.adoc` per section; model `ai-mcp-disclaimer.adoc` (single `[IMPORTANT]`).
* **Cheat-sheet precedent:** `git-and-github/cheat-sheet.adoc` and PDFs in `modules/ROOT/attachments/`.
* **Chart precedent (#196):** `scripts/language-charts/` (`generate-charts.mjs`, `chart-definitions.mjs`, `data-utils.mjs`,
  `data/*.csv`, tests) and `partials/programming-languages-comparative/`; `package.json` scripts `charts`, `tables`, `test:charts`.
* **Existing material to link, not repeat:** the C#/Visual Basic XML-doc pages, `programming-languages/python/docstrings.adoc`,
  `ai/cli-for-agents/documenting-clis.adoc`, `web/nextjs/index.adoc`, and this repo's own playbook/`ui-bundle.zip`/CI as the case study.
* **Precedent plans in `.archive/`:** `implementation_plan_258.md` (same one-branch, many-page, cheat-sheet structure),
  plus the #196 plan for the comparison charts.
* **Conventions from `CLAUDE.md`:** one-line image macros, quoted alt text with commas, passthroughs for `{`, `*`, `->`,
  `__` and similar, Mermaid stereotypes/`<` written as entities, every SVG referenced, verification greps and
  `npm run validate:mermaid`.

## Implementation steps

**Page conventions (every page task).** Follow `scratchpad/page-conventions.md` (Task 5) and the issue's
"Page conventions", "Figures" and "AsciiDoc pitfalls" sections. ★ pages are the most detailed in their subsection.
When a page is done, append a one-line progress note under its task (what was written, which examples ran, build
status).

### Group 1 — Scaffolding, wiring and verification environment (Parallelizable: yes)

- [x] Task 1. Create `modules/ROOT/partials/documentation-tools-disclaimer.adoc`: a single `[IMPORTANT]` block identical in shape to `partials/ai-mcp-disclaimer.adoc`, containing only the house AI-assistance sentence ("This content was generated with the assistance of AI and should be verified against the official documentation of each tool before being relied on in production") and a pointer to `xref:documentation-tools/index.adoc#_bibliography[the section bibliography]`. It is the only admonition allowed in the section.
  - Progress: modules/ROOT/partials/documentation-tools-disclaimer.adoc created (shape of ai-mcp-disclaimer).
- [x] Task 2. In `modules/ROOT/nav.adoc`, after line 2691 (`*** xref:git-and-github/cheat-sheet.adoc[Cheat Sheet (PDF)]`), add `** xref:documentation-tools/index.adoc[Documentation Tools]` with `***` per tool landing page (Antora, Docusaurus, Zensical, DocFX), `****` per outline page in outline order (Antora UI Bundle nested as `**** xref:documentation-tools/antora/ui/index.adoc[UI Bundle]` with `*****` children), then `*** xref:documentation-tools/comparison.adoc[Comparison]` and `*** xref:documentation-tools/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Nav titles follow page titles. Forward-xref build errors for pages from later groups are expected until Group 9.
  - Progress: nav.adoc: 75-line Documentation Tools block added after Git & GitHub Cheat Sheet (forward xrefs until Group 9).
- [x] Task 3. Draw the original tile icon `modules/ROOT/images/documentation-tools.svg` in the style and size of `git-and-github.svg` (no tool logos; readable in light and dark themes). In `modules/ROOT/pages/index.adoc`, put `image::documentation-tools.svg[xref="documentation-tools/index.adoc"]` in the empty last cell of the Guides & References table (after line 121, before the closing `|===`), add "documentation tools (Antora, Docusaurus, Zensical and DocFX)" to `:description:` and append `documentation tools, docs as code, static site generator, Antora, Antora UI bundle, Docusaurus, Zensical, Material for MkDocs, MkDocs, DocFX, API documentation` to `:keywords:`.
  - Progress: images/documentation-tools.svg drawn; tile, :description: and :keywords: updated in pages/index.adoc.
- [x] Task 4. Build the verification environment in the session scratchpad (nothing committed; installs and Docker use confirmed by the user in this session):
  - [x] Task 4.1. Pocket Units running example: a tiny C# library plus a Python implementation with documented code, getting-started, two guides, a changelog and an API reference; Antora variant with components `pocket-units` (branches for 1.0 and 2.0) and `shared`.
    - Progress: Pocket Units C# (net8.0 csproj, Converter, LengthUnit) and Python (pocket_units) sources plus Antora variant (pocket-units v1.0/v2.0 branches + shared) in scratchpad env/; Antora variant builds.
  - [x] Task 4.2. Install and smoke-test Antora (3.2.x in a scratch project, not this repo's `antora` 3.1.15), Docusaurus 3.10 (classic TypeScript), Zensical in a Python venv (plus `mkdocstrings-python`), and DocFX via the `mcr.microsoft.com/dotnet/sdk` Docker image (`dotnet tool install -g docfx`), plus `antora-ui-default` (clone, `npm ci`, `npx gulp bundle`).
    - Progress: Antora 3.2.1 (+lunr, collector, atlas), Docusaurus 3.10.2 classic TS, Zensical 0.0.72 (py3.13 venv, mkdocstrings-python), DocFX 2.81.0 in dotnet sdk 10 docker, antora-ui-default (npm ci, gulp bundle/lint/preview:build) installed and smoke-built.
  - [x] Task 4.3. Re-verify the issue's version baseline, every finding in "Findings from the exploration" and the metrics snapshot against the official sources; record results, URLs and the check date in `scratchpad/verified-facts.md`, which every page task reads. Record which tools or examples could not run, so pages can say so in prose (not in an admonition).
    - Progress: scratchpad/verified-facts.md written (2026-10-26; V/L/P/U per fact, corrections, metrics, not-run list).
- [x] Task 5. Record in `scratchpad/page-conventions.md` the shared page skeleton used by every page task: `= Title`, `:description:`, `:keywords:`, `include::partial$documentation-tools-disclaimer.adoc[]`; intro with tool version and check date; detailed explanation (what/why, every key/option/command/file/front-matter field, output, errors and pitfalls, version introduced/changed/deprecated); complete examples in the issue's listed source languages, each followed by a `Source: <url>[<title>]` line; `== References`; no real secrets (placeholders); `CLAUDE.md` rules for image macros, inline-code passthroughs, AsciiDoc-in-AsciiDoc (`[source,asciidoc]` with escaped attribute references or `subs=-attributes`) and Mermaid `&lt;`.
    - Progress: scratchpad/page-conventions.md and lint-page.sh written.

### Group 2 — Antora pages (Parallelizable: yes)

- [x] Task 6. ★ Write `documentation-tools/antora/index` (**Antora overview**): AsciiDoc and Asciidoctor.js, how Antora works (aggregate, classify, convert, navigation, compose with UI, publish), adopters, when to choose it, subsection map; Mermaid pipeline flowchart.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 7. Write `documentation-tools/antora/install-and-quickstart` (**Install and Quickstart**): Node.js setup, `npm i -D -E antora`, `npx antora`, minimal playbook and component, local preview with a static server, upgrading from 3.1 to 3.2.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 8. ★ Write `documentation-tools/antora/playbook` (**Playbook**): every key (`site`, `content`, `ui`, `asciidoc`, `urls`, `output`, `runtime`, `git`, `network`), precedence of CLI options and environment variables.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 9. ★ Write `documentation-tools/antora/content-sources` (**Content Sources**): `url`, `branches`, `tags`, refname globs and brace ranges, `worktrees`, `HEAD@<worktree>`, `start_path`/`start_paths`, `edit_url`, `git.fetch_depth`, submodules, `commits` filter; SVG of repositories and branches aggregated into one site.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 10. Write `documentation-tools/antora/component-version-descriptor` (**Component Version Descriptor**): `antora.yml` keys (`name`, `version`, `title`, `display_version`, `prerelease`, `nav`, `start_page`, `asciidoc.attributes`), versionless components.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 11. Write `documentation-tools/antora/versioning-and-prerelease` (**Versioning and Prerelease**): versioning methods, `prerelease`, sorting, `latest_version_segment` strategies, the 3.2 `versionSegment` change; Mermaid branches to versions to URLs.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 12. ★ Write `documentation-tools/antora/modules-and-families` (**Modules and Families**): ROOT and named modules; `pages`, `partials`, `examples`, `images`, `attachments`; standard layout; SVG mapping directory tree to output URLs.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 13. ★ Write `documentation-tools/antora/resource-ids-and-xrefs` (**Resource IDs and Xrefs**): `version@component:module:family$path`, relative and absolute IDs, xrefs to pages, fragments, components and versions, include/image targets, broken-xref reporting.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 14. Write `documentation-tools/antora/navigation` (**Navigation**): nav files, registration in `antora.yml`, nested lists, non-link entries, composition across files and partials, component ordering.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 15. Write `documentation-tools/antora/partials-examples-and-attachments` (**Partials, Examples and Attachments**): `include::partial$`, `include::example$` with tags and line ranges, `xref:attachment$` downloads.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 16. Write `documentation-tools/antora/asciidoc-attributes-and-extensions` (**AsciiDoc Attributes and Extensions**): site, component and page attributes and precedence; `asciidoc.extensions` (Mermaid, MathJax, Kroki) as used by this site.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 17. ★ Write `documentation-tools/antora/antora-extensions` (**Antora Extensions**): extension API (`register`, context, `on`/`once`, variables, helpers), generator-events reference in order, writing an extension (report unused images), enabling/disabling from the CLI; Mermaid timeline of events.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 18. Write `documentation-tools/antora/site-search` (**Site Search**): `@antora/lunr-extension`, its UI contract and options, Lunr size/performance limits, Pagefind and Algolia DocSearch alternatives (upgrade of this site stays in #255, mentioned in prose only).
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 19. Write `documentation-tools/antora/collector-atlas-and-assembler` (**Collector, Atlas and Assembler**): Collector at `contentAggregated`, Atlas (alpha; not a UI) manifests and cross-site xrefs, Assembler and the PDF extension needing `asciidoctor-pdf`.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 20. Write `documentation-tools/antora/cli-docker-cache-and-private-repositories` (**CLI, Docker, Cache and Private Repositories**): CLI options, `--fetch`, `--log-failure-level`, exit code 2, cache dir, `antora/antora` image (UID not 1000), private-repository credentials (no SSH keys; placeholders only).
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 21. Write `documentation-tools/antora/publishing` (**Publishing**): GitHub Pages with `actions/deploy-pages`, branch deployment with `.nojekyll`, GitLab Pages, Netlify, `urls.redirect_facility`, sitemaps.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 22. Write `documentation-tools/antora/case-study-this-site` (**Case Study: This Site**): how Irurueta Docs is built from the real `antora-playbook.yml`, `antora.yml`, `ui-bundle.zip`, `package.json` and workflows (multi-repo `content.sources` with release-branch globs, root component, project picker, custom UI with `snapshot: true`, supplemental files, Mermaid/MathJax, nightly CI to `gh-pages`); SVG of the architecture. Do not change the playbook.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.
- [x] Task 23. Write `documentation-tools/antora/troubleshooting` (**Troubleshooting**): missing `antora.yml`, start_path mismatch, duplicate component versions, unresolved xrefs/includes, stale UI cache, Jekyll-stripped folders, and how to diagnose them.
  - Page written; examples run on Antora 3.2.1 (see page for any not run); per-page lint-page.sh and Mermaid validation clean; spot-check passed.

### Group 3 — Antora UI Bundle pages (Parallelizable: yes)

UI pages build on the Antora pages' playbook and `ui` concepts but are distinct files; xrefs between them resolve at the final build.

- [x] Task 24. ★ Write `documentation-tools/antora/ui/index` (**UI Bundle**): what a bundle is (layouts, partials, helpers, CSS, JS, fonts, images, `ui.yml`), how Antora loads it (`ui.bundle.url`, `snapshot`, `start_path`, `output_dir`, `default_layout`), the cache-by-URL rule, the Default UI; SVG of bundle anatomy and where each part lands in the site.
  - Progress: written (447 lines) with SVG documentation-tools-antora-ui-bundle-anatomy.svg; ran a two-theme start_path/output_dir build, directory bundle with ui.yml, and missing-layout/bundle errors in scratch; lint-page clean; no Mermaid on the page.
- [x] Task 25. ★ Write `documentation-tools/antora/ui/building-a-custom-ui` (**Building a Custom UI**): prerequisites, cloning `antora-ui-default`, structure, `npx gulp` tasks (`preview` on port 5252, `preview:build`, `lint`, `bundle`, `bundle:pack`), `preview-src/ui-model.yml`, iterating against a real site with an unzipped local bundle; Mermaid dev-loop flowchart. Examples run in the scratchpad.
- [x] Task 26. ★ Write `documentation-tools/antora/ui/templates-and-ui-model` (**Templates and UI Model**): Handlebars layouts and partials, UI model variables (`site`, `page`, `env`, `uiRootPath`, `siteRootPath`, `antoraVersion`, `contentCatalog`, `page.file`), adding a layout selected with `:page-layout:`; only `layouts/default.hbs` (and `404.hbs`) required.
  - Written (451 lines) plus SVG documentation-tools-antora-ui-templates.svg; ran layout/404/default/missing-layout/missing-partial/default_layout experiments on Antora 3.2.1 in env/ui/work-templates; lint and Mermaid clean; standalone render checked.
- [x] Task 27. Write `documentation-tools/antora/ui/helpers` (**Helpers**): built-in helpers, writing a helper, `resolvePage`/`resolvePageURL`/`resolveResource`.
  - Written (helpers.adoc, about 440 lines, Mermaid flowchart, no SVG). Examples ran in scratchpad env/ui/work-helpers + env/site-helpers (lint, bundle, Antora 3.2.1 build, preview:build failures); lint-page.sh and Mermaid validation clean.
- [x] Task 28. Write `documentation-tools/antora/ui/stylesheets-fonts-and-static-files` (**Stylesheets, Fonts and Static Files**): CSS structure and variables, dark mode, fonts, images, static files and `ui.yml` `static_files`.
  - Progress: stylesheets-fonts-and-static-files.adoc written plus documentation-tools-antora-ui-static-files.svg; Default UI copy built, dark mode, npm font and static_files promotion built into a scratch Antora site; lint clean, no Mermaid blocks.
- [x] Task 29. Write `documentation-tools/antora/ui/supplemental-ui` (**Supplemental UI**): `ui.supplemental_files` directory vs list form (mutually exclusive), overrides, `ui.yml` replacement rule, `contents` pitfalls, `.nojekyll` and `ads.txt` as this site does.
  - Progress: page and SVG written; directory, list, ui.yml replacement and contents pitfalls ran on Antora 3.2.1; lint and Mermaid clean; standalone render checked.
- [x] Task 30. Write `documentation-tools/antora/ui/search-and-analytics-integration` (**Search and Analytics Integration**): satisfying the Lunr contract (`env.SITE_SEARCH_PROVIDER`, `input#search-input`, `search-scripts` partial, no bundled `lunr.js`), Algolia DocSearch or Pagefind widget, analytics/consent via supplemental partials (placeholder keys).
  - Done: page written; Lunr contract, Pagefind (1.5.2), DocSearch v5 and consent-gated analytics examples built in a scratch Antora 3.2.1 site (Pagefind and consent run in a browser; DocSearch rendered only); lint and Mermaid pass.
- [x] Task 31. ★ Write `documentation-tools/antora/ui/publishing-a-ui-bundle` (**Publishing a UI Bundle**): CI build (GitLab job artifact as in Default UI; GitHub Actions release asset stated as an inference), versioned URLs vs `snapshot: true` with `--fetch`, committing the bundle as this site does; Mermaid sequence of release and consumption.
  - Written; snapshot/fetch/cache matrix run on Antora 3.2.1, gulp bundle run; CI workflows only YAML-validated; lint and Mermaid pass.

### Group 4 — Docusaurus pages (Parallelizable: yes)

- [x] Task 32. Write `documentation-tools/docusaurus/index` (**Docusaurus Overview**): React + MDX, classic preset, adopters, when to choose it, subsection map; Mermaid build flowchart (MD/MDX, plugins, React SSG, static HTML + hydration).
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 33. Write `documentation-tools/docusaurus/installation-and-project-structure` (**Installation and Project Structure**): `npx create-docusaurus@latest my-website classic --typescript`, `docs/`, `blog/`, `src/pages`, `static/`, `sidebars.ts`, scripts.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 34. ★ Write `documentation-tools/docusaurus/configuration` (**Configuration**): `docusaurus.config.ts`: metadata, `url`/`baseUrl`, presets, `themeConfig`, `customFields`, `markdown`, `storage`, `future`, TypeScript types; deprecated `onBrokenMarkdownLinks`.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 35. ★ Write `documentation-tools/docusaurus/docs-and-front-matter` (**Docs and Front Matter**): docs plugin, ids and slugs, `sidebar_position`, `sidebar_label`, tags, `draft`, `unlisted`, multiple docs instances.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 36. ★ Write `documentation-tools/docusaurus/sidebars` (**Sidebars**): item types (doc, link, category, html, ref), category index pages, `_category_.json`, autogenerated sidebars and number prefixes; SVG file tree to sidebar.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 37. Write `documentation-tools/docusaurus/blog-and-pages` (**Blog and Pages**): posts, truncate marker (and JSX-comment successor), `authors.yml`, tags, feeds; React and Markdown pages in `src/pages`.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 38. ★ Write `documentation-tools/docusaurus/mdx-and-react-components` (**MDX and React Components**): JSX in Markdown, imports, `MDXComponents`, MDX v3 strictness (stray `{` and `<`), `markdown.format` modes.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 39. Write `documentation-tools/docusaurus/markdown-features` (**Markdown Features**): admonitions `:::note[Title]`, code blocks (titles, highlighting, line numbers, live editor), tabs (`groupId`, `queryString`), links and assets, TOC, head metadata.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 40. Write `documentation-tools/docusaurus/diagrams-and-math` (**Diagrams and Math**): `@docusaurus/theme-mermaid` + `markdown.mermaid: true`, ELK layout, light/dark; remark-math/rehype-katex (ESM-only, KaTeX CSS).
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 41. ★ Write `documentation-tools/docusaurus/versioning` (**Versioning**): `docs:version`, `versioned_docs`/`versioned_sidebars`, `lastVersion`, `onlyIncludeVersions`, version dropdown, keeping versions few; Mermaid version snapshots.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 42. Write `documentation-tools/docusaurus/i18n` (**Internationalization**): locales, `write-translations`, folder layout, per-locale `url`/`baseUrl` (3.9), Git and Crowdin workflows.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 43. Write `documentation-tools/docusaurus/search` (**Search**): Algolia DocSearch v4 (Ask AI opt-in), Typesense, local search plugins, swizzled `SearchBar` (placeholder keys).
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 44. ★ Write `documentation-tools/docusaurus/styling-theming-and-swizzling` (**Styling, Theming and Swizzling**): Infima and CSS variables, dark mode, CSS modules, swizzling (wrap vs eject, safe vs unsafe).
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 45. Write `documentation-tools/docusaurus/plugins-and-presets` (**Plugins and Presets**): using plugins and presets, remark/rehype plugins, writing a plugin with lifecycle APIs.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 46. Write `documentation-tools/docusaurus/seo-and-static-assets` (**SEO and Static Assets**): metadata, sitemap plugin, robots, `static/` assets.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 47. Write `documentation-tools/docusaurus/deployment` (**Deployment**): GitHub Pages (`docusaurus deploy` and Actions artifact flow), Netlify, Vercel, `trailingSlash`, `.nojekyll`, `CNAME`, `url`/`baseUrl` slash pitfalls, `process.env` only in config (`customFields`).
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 48. Write `documentation-tools/docusaurus/cli-and-typescript` (**CLI and TypeScript**): every command (`start`, `build`, `swizzle`, `deploy`, `serve`, `clear`, `write-translations`, `write-heading-ids`, `docs:version`), TypeScript support (3.10 TS 6).
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 49. ★ Write `documentation-tools/docusaurus/docusaurus-faster-and-v4-readiness` (**Docusaurus Faster and v4 Readiness**): `future.faster` flags (Rspack, SWC, Lightning CSS, worker threads) needing `@docusaurus/faster`, `future.v4` flags, phased-out syntax, v2 to v3 migration summary, upgrade checklist; bar chart only if an official figure exists.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).
- [x] Task 50. Write `documentation-tools/docusaurus/openapi-docs` (**OpenAPI Docs**): community `docusaurus-plugin-openapi-docs` and theme (stated as community-maintained), generating API pages from an OpenAPI file.
  - Page written; lint-page.sh and Mermaid validation clean (Group 4).

### Group 5 — Zensical pages (Parallelizable: yes)

- [x] Task 51. ★ Write `documentation-tools/zensical/index` (**Zensical Overview**): history MkDocs, Material for MkDocs, Zensical; maintenance status (Material maintenance mode since 9.7.0 with critical fixes until 2027-05-05), alpha status and 0.1.0 line, MIT licence, Studio and Spark; SVG timeline.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 52. Write `documentation-tools/zensical/installation-and-cli` (**Installation and CLI**): pip/uv/conda-forge/Docker, `zensical new` (generated files incl. GitHub workflow), `serve`, `build` (`--clean`, `--strict`).
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 53. ★ Write `documentation-tools/zensical/configuration` (**Configuration**): `zensical.toml` `[project]` next to `mkdocs.yml` equivalents, `site_url`, `docs_dir`, `site_dir`, `exclude_docs`, `draft_docs`, `not_in_nav`.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 54. Write `documentation-tools/zensical/navigation` (**Navigation**): explicit `nav`, instant navigation and previews, tabs, sections, breadcrumbs, pruning, section index pages, TOC.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 55. ★ Write `documentation-tools/zensical/markdown-authoring` (**Markdown Authoring**): Python Markdown and pymdownx extensions, admonitions, code blocks, content tabs, tables, footnotes, grids, tooltips, buttons.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 56. Write `documentation-tools/zensical/diagrams-math-and-icons` (**Diagrams, Math and Icons**): Mermaid via SuperFences, MathJax/KaTeX via arithmatex, bundled icons and emojis, logo and favicon.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 57. ★ Write `documentation-tools/zensical/theming-and-customization` (**Theming and Customization**): palette and schemes, fonts, header/footer, `extra_css`/`extra_javascript`, `custom_dir` MiniJinja overrides (no Python calls), custom error pages.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 58. Write `documentation-tools/zensical/search` (**Search**): built-in client-side engine and configuration, English-only UI.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 59. Write `documentation-tools/zensical/blog-tags-and-plugins` (**Blog, Tags and Plugins**): native blog and tags, supported plugin list, silently ignored plugins.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 60. Write `documentation-tools/zensical/api-docs-with-mkdocstrings` (**API Docs with mkdocstrings**): `mkdocstrings-python` (since 0.0.11), docstring styles (link to Python docstrings page), `autoapi`/`api-autonav`; Mermaid sources to API pages.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 61. Write `documentation-tools/zensical/versioning-and-i18n` (**Versioning and i18n**): transitional `mike` fork, UI language and direction, content i18n status.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 62. Write `documentation-tools/zensical/validation-and-publishing` (**Validation and Publishing**): `[project.validation]` (`invalid_links`, `invalid_link_anchors`), strict builds, GitHub Pages and GitLab Pages workflows.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 63. ★ Write `documentation-tools/zensical/migrating-from-material-for-mkdocs` (**Migrating from Material for MkDocs**): gradual reversible migration, `classic` variant, gaps (hooks, plugins, CLI flags, `gh-deploy`, `gen-files`), migration checklist.
  - Page written, lint and Mermaid clean (Group 5).
- [x] Task 64. Write `documentation-tools/zensical/roadmap-and-upgrade-policy` (**Roadmap and Upgrade Policy**): version policy, upgrade notes, roadmap items, Spark-only features.
  - Page written, lint and Mermaid clean (Group 5).

### Group 6 — DocFX pages (Parallelizable: yes)

- [x] Task 65. Write `documentation-tools/docfx/index` (**DocFX Overview**): governance (community-maintained under .NET Foundation since Nov 2022), when to choose it, quick start (`dotnet tool update -g docfx`, `docfx init`, `docfx docfx.json --serve`), subsection map.
  - Written: index.adoc; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 66. ★ Write `documentation-tools/docfx/basic-concepts-and-pipeline` (**Basic Concepts and Pipeline**): metadata, build, pdf, Markdig, Jint templates, `_site`; Mermaid pipeline flowchart.
  - Written: basic-concepts-and-pipeline.adoc; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 67. ★ Write `documentation-tools/docfx/docfx-json` (**docfx.json**): `metadata`, `build` (`content`, `resource`, `overwrite`, `globalMetadata`, `fileMetadata`, `xref`, `template`, `output`, `sitemap`, `postProcessors`, `markdownEngineProperties`, `disableGitFeatures`), file mappings, metadata precedence, redirects.
  - Written: docfx-json.adoc; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 68. ★ Write `documentation-tools/docfx/dotnet-api-docs` (**DotNet API Docs**): projects/solutions/assemblies as input, XML comments as Markdown, `<exclude />`, `apiRules` filter, `namespaceLayout`, `memberLayout`, `enumSortOrder`, `outputFormat`, `properties`, `noRestore`, SDK compatibility, F# limitation; SVG documented C# to rendered API page. Links the existing C# pages.
  - Written: dotnet-api-docs.adoc + comments-to-api-page SVG; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 69. Write `documentation-tools/docfx/rest-api-docs` (**REST API Docs**): Swagger 2.0 files, tags, `x-bookmark-id`, handling OpenAPI 3 (stated as outside the official docs).
  - Written: rest-api-docs.adoc + rest-tag-layout SVG; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 70. ★ Write `documentation-tools/docfx/markdown` (**Markdown**): DocFX Flavored Markdown: alerts, includes (exclude from build), snippets with regions/lines/highlight, tabs and dependent tabs, Mermaid, PlantUML, math, video, YAML header and `uid`; `modern` template needed for Mermaid and math.
  - Written: markdown.adoc + code-snippet-syntax SVG; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 71. Write `documentation-tools/docfx/table-of-contents` (**Table of Contents**): `toc.yml` keys, nested and reference TOCs, root TOC as navbar, `expanded` (modern).
  - Written: table-of-contents.adoc + toc-structure SVG; DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 72. Write `documentation-tools/docfx/links-and-cross-references` (**Links and Cross References**): `<xref:uid>`, `@uid`, `displayProperty`, `xrefmap.yml`, `build.xref`, .NET BCL xref map, `~/` paths, duplicate UIDs, undocumented `xrefService`.
  - Written under documentation-tools/docfx (+ SVG where listed in page); DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 73. ★ Write `documentation-tools/docfx/templates-and-customization` (**Templates and Customization**): `default` vs `modern`, custom CSS/JS (`public/main.css` vs `styles/`), partials, `_appTitle`, `_appLogoPath`, `_enableSearch`, `_disableContribution`, dark mode, `docfx template export`, `--exportRawModel`, 2.81 preprocessor limits.
  - Written under documentation-tools/docfx (+ SVG where listed in page); DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 74. Write `documentation-tools/docfx/pdf-output` (**PDF Output**): `pdf: true`, `docfx pdf`, cover/TOC pages, headers/footers, Playwright and Node.js >= 20 requirements (`PLAYWRIGHT_NODEJS_PATH`, `DOCFX_PDF_TIMEOUT`).
  - Written under documentation-tools/docfx (+ SVG where listed in page); DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 75. Write `documentation-tools/docfx/additional-languages` (**Additional Languages**): custom converters producing API Page YAML plus a `toc.yml`.
  - Written under documentation-tools/docfx (+ SVG where listed in page); DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 76. Write `documentation-tools/docfx/cli` (**CLI**): `docfx`, `metadata`, `build` (`--serve`, `--warningsAsErrors`, `--dryRun`), `pdf`, `serve`, `init`, `template`, `download`, `merge`; environment variables; `Docfx.App`.
  - Written under documentation-tools/docfx (+ SVG where listed in page); DocFX 2.81.0 examples ran in Docker; lint clean.
- [x] Task 77. Write `documentation-tools/docfx/deployment` (**Deployment**): GitHub Pages with current action versions, Azure DevOps, sitemap and search settings.
  - Written under documentation-tools/docfx (+ SVG where listed in page); DocFX 2.81.0 examples ran in Docker; lint clean.

### Group 7 — Comparison data, charts and page (Parallelizable: no — the comparison page embeds the charts the data task generates)

- [x] Task 78. Create the chart data and generator for the comparison: re-fetch all metrics (GitHub/GitLab API stars, forks, contributors; npm range API; pypistats/pepy; NuGet; Stack Exchange; releases) into CSVs under `scripts/documentation-tools-charts/data/` with a `NOTES.md` (sources, dates, caveats, 0-10 radar rubric and how scores are assigned), plus a dependency-free Node generator reusing helpers from `scripts/language-charts/` (`generate-charts.mjs`, `data-utils.mjs`) that writes `modules/ROOT/images/documentation-tools-comparison-*.svg` (time series, radar per tool, current stars and downloads bars, release timeline). Add `charts:docs-tools` to `package.json` scripts and a `node --test` file. Charts readable in light and dark with axes, units, legend.
  - Done: `scripts/documentation-tools-charts/` (data CSVs with snapshot 2026-10-26, NOTES.md, generate-charts.mjs, chart-definitions.mjs, scores.mjs, node --test file with 14 passing tests), 11 `documentation-tools-comparison-*.svg`, `charts:docs-tools` and `test:charts:docs-tools` in package.json; optional `xFormat` added to `renderLineChart`. Stars-over-time omitted: stargazers API returned 404 on 2026-10-26 (recorded in NOTES.md).
- [x] Task 79. ★ Write `documentation-tools/comparison.adoc`: feature matrix (input formats, multi-repo aggregation, versioning, i18n, API reference, search, diagrams, math, theming model, PDF, blog, build runtime, licence, governance and maintenance status); strengths and weaknesses table and prose with cited sources; dated metrics tables (stars/forks, latest release, downloads, Stack Overflow questions, contributors, cadence, issue ratio, adopters, Google Trends) with the caveats from the issue; the generated charts with captions naming source and date and referring to the Bibliography; Mermaid decision flowchart; recommendations by purpose justified by the data with snapshot date; `== References`. Mention #196 and #255 in prose only.
  - Done: `documentation-tools/comparison.adoc` (feature matrix, strengths/weaknesses, dated metrics, 11 charts, score table, Mermaid decision flowchart, recommendations, References); lint-page.sh clean, Mermaid 42/42 parsed, all SVGs referenced and XML-valid.

### Group 8 — Landing page, cheat sheet, PDF and back-links (Parallelizable: yes)

- [x] Task 80. ★ Write `documentation-tools/index.adoc`: docs-as-code explained; the four tools in one paragraph each with version baseline and check date; "which subsection should I read" guide; `== What's covered` grouped like the nav; related-material table (the existing pages); SVG `documentation-tools-docs-as-code-pipeline.svg` (sources in Git, generator, static site, hosting, with each tool's input formats); `== Bibliography` listing every source from the issue's Bibliography with official links, using the house "(unverified)" note for entries that could not be opened.
  - Progress: index.adoc written (docs as code, four tools, chooser table, What's covered from nav, related table, References, [[_bibliography]] Bibliography with 2 npm entries marked unverified after 403s) plus documentation-tools-docs-as-code-pipeline.svg; lint clean.
- [x] Task 81. Write `documentation-tools/cheat-sheet.adoc` following `git-and-github/cheat-sheet.adoc`: disclaimer include, intro linking `xref:attachment$documentation-tools-cheat-sheet.pdf[downloadable PDF]` with version baseline and check date, grouped `*Group* --` paragraphs of xrefs to every page of the section, a final `xref:attachment$documentation-tools-cheat-sheet.pdf[Download the Documentation Tools Cheat Sheet (PDF)]` line, `== References`.
  - Progress: cheat-sheet.adoc written (disclaimer, intro with baselines and 2026-10-26, grouped xrefs for all nav pages plus index/comparison, PDF download line, References); lint clean.
- [x] Task 82. Produce `modules/ROOT/attachments/documentation-tools-cheat-sheet.pdf`, exactly one A4 page, from a throwaway HTML page in the scratchpad rendered with headless Chrome (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --print-to-pdf --no-pdf-header-footer`): dense, multi-column, colour-coded per tool, version baseline and date in the header; tool chooser strip with mini feature matrix; per-tool column (install, create/serve/build, minimal config, layout, link syntax, admonitions, diagrams and math, versioning, search, theming entry point, GitHub Pages recipe); Antora UI bundle strip; "changed recently" strip. Check one page with PyMuPDF (`fitz`; `pdfinfo` is not installed), preview as PNG, commit only the PDF.
  - Progress: documentation-tools-cheat-sheet.pdf, 1 A4 page (PyMuPDF), 290 KB, built via headless Chrome from scratchpad HTML and previewed as PNG.
- [x] Task 83. Add one-line back-links to existing pages: `programming-languages/csharp/coding-conventions-and-documentation.adoc`, `programming-languages/csharp/build-and-tooling.adoc` and `programming-languages/visual-basic/xml-documentation-analyzers-and-code-style.adoc` to `documentation-tools/docfx/dotnet-api-docs.adoc`; `programming-languages/python/docstrings.adoc` to `documentation-tools/zensical/api-docs-with-mkdocstrings.adoc` with a note that Material for MkDocs is in maintenance mode; `ai/cli-for-agents/documenting-clis.adoc` to the Antora landing page; `web/nextjs/index.adoc` to the Docusaurus subsection. Plain prose, no admonitions.
  - Progress: back-links added to 3 C#/VB pages (DocFX), python/docstrings (mkdocstrings, maintenance-mode note), documenting-clis (Antora), nextjs index (Docusaurus; replaced the planned-topic mention).

### Group 9 — Final verification (Parallelizable: no — the docs check follows the final build)

- [x] Task 84. Final verification and fixes:
  - [x] Task 84.1. Run `npx antora antora-playbook.yml` (local content): no `xref`/AsciiDoc errors or warnings; all forward xrefs resolved. — local build clean: 0 errors, 0 warnings (also with --log-failure-level=warn); fixed include/xref/pipe/attribute defects in 8 pages.
  - [x] Task 84.2. Run the `CLAUDE.md` greps (image macros not closed on one line, inline macros, `<p>image::` leaks, unquoted-comma alt text on changed files, substitutions inside `<code>` on `build/site/documentation-tools`); all print nothing. — CLAUDE.md greps all print nothing after wrapping BEM `--`, `...`, `#`, `*` inline code in passthroughs.
  - [x] Task 84.3. Run `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`: every diagram parses. Every `documentation-tools-*.svg` and the tile icon is referenced by a page; every `image::` target exists. — validate:mermaid: all 2487 diagrams parsed (43 blocks in this section); every documentation-tools SVG referenced, every image target exists.
  - [x] Task 84.4. Confirm the only admonition in the section is the disclaimer partial: `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]|^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):' modules/ROOT/pages/documentation-tools` prints nothing; every page includes the partial and has `== References`; `index.adoc` has `== Bibliography`. — no admonitions besides the disclaimer; all 75 pages include the partial and have References; index has Bibliography.
  - [x] Task 84.5. Scan rendered text for backtick, quote, bare `+` and `[[x]]` defects (memory: the CLAUDE.md grep misses these); verify AsciiDoc-in-AsciiDoc examples do not resolve `include::`/`image::`. — rendered-HTML scan prints nothing (fixed `::` definition-list splits, `[[x]]` anchors, em-dash/ellipsis substitutions, preprocessor includes in listings).
  - [x] Task 84.6. Check the nav renders correctly (nested UI Bundle level) and the home tile links; run `npm run test:charts` and the new chart tests. — nav renders nested; test:charts 41/41 and test:charts:docs-tools 14/14 pass.
  - [x] Task 84.7. Run `Skill({skill: "iru-check-security"})` (detect-secrets findings in this docs repo are false positives: label `is_secret:false`); confirm no real secrets or tokens in examples. — detect-secrets: 1 new finding (docusaurus/deployment.adoc:336 Basic Auth Credentials, placeholder GIT_PASS), labelled is_secret:false.
  - [x] Task 84.8. Confirm no tool logos or official-docs images were used, and that `antora-playbook.yml` is unchanged. — no logos/official images; antora-playbook.yml unchanged.
- [x] Task 85. Run `/iru-update-docs`: this repository's `docs/` convention does not apply (the site is the docs), so confirm no further docs update is needed and note it. — iru-update-docs: diff is docs-only, no UI, no documentation MCP connected; no further update needed.

