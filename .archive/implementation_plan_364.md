# Implementation Plan: Find gaps and restructure documentation (#364)

## Task summary

Restructure the "Guides & References" documentation (15 sections, 134 subsections, 5,627 pages under
`modules/ROOT/pages/`) per the specification in issue #364: one shared AI disclaimer (WP1), an expanded and
reordered navigation panel (WP2), a common index template (WP4), image cards on all section indexes (WP3), deeper
thin subsections (WP5), more diagrams and code examples (WP6) and new topics (WP7).

The issue was written to be split into child issues targeting an integration branch `docs-restructure-364`. No
child issues were created, so (user decision) the whole issue is implemented on this feature branch and PR'd
straight to `main`; no integration branch is created. Its size still means each group below is best executed one
at a time. Groups 1
and 2 are independent; Group 3 (WP4) precedes Group 4 (WP3); Groups 5-7 follow Groups 1-2.

Decisions:
- Base branch is `main`, with no integration branch (user decision, overriding issue decision 9).
- WP2 does not depend on #255 (user decision): the default expansion is a supplemental-UI override of
  `partials/nav-tree.hbs` in `antora-playbook.yml`, made now. When #255 later brings the UI bundle source into the
  repository, it folds this override into the bundle source.
- Disclaimer partials: 156 exist on disk (including `ai-disclaimer.adoc`), and all 156 are included by at least one
  page. No include references a missing partial, and git history shows no deleted one, so the issue's "157" is a
  miscount. WP1 rewrites `ai-disclaimer.adoc` and deletes the other 155.
- WP4 (user decision): long conceptual content in section indexes moves to a sibling `<section>/overview.adoc`
  (beside any existing `comparison.adoc`), linked from the index intro and from the nav, as
  `programming-languages/comparative.adoc` already is. The index keeps only the intro, the card grid,
  `== Sections`, `== Related material on this site` and `== Bibliography`/`== References`.
Choices made on the user's behalf:
- Tasks are untagged (documentation, SVG and Handlebars only; no `iru-*-code-one-task` skill applies), so they are
  implemented directly.
- Follow `CLAUDE.md` rules for images, inline code and Mermaid on every changed page.
- Verification common to every group: `npx antora antora-playbook.yml` completes with no xref/AsciiDoc errors, the
  `CLAUDE.md` image, inline-code and Mermaid greps print nothing for the changed sections, and changed pages are
  checked in the rendered site (use a temporary preview config for `build/site`).

Source: GitHub issue #364
Base branch: main

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`grep -rL 'include::partial$ai-disclaimer.adoc' modules/ROOT/pages --include='*.adoc'` prints only `index.adoc`" | Task 1, Task 2 |
| 2 | "`ls modules/ROOT/partials \| grep -c disclaimer` prints 1" | Task 3 |
| 3 | "no page contains 'assistance of AI' outside the partial; no version or caveat information was lost" | Task 2, Task 3, Task 4 |
| 4 | "on a fresh load of the home page and of a deep page, all projects and the 15 guide sections are visible without clicking; verified at desktop and mobile widths" | Task 6, Task 7, Task 8 |
| 5 | "every section index shows a card per subsection linking to that subsection's index; the existing text lists are unchanged; the three image greps print nothing; cards render in the built site" | Task 14, Task 15, Task 16, Task 17 |
| 6 | "a script listing the `==` headings of all 149 index pages shows only template headings in template order; the Antora build reports no broken xrefs" | Task 10, Task 11, Task 12, Task 13 |
| 7 | "every topic in the book's table of contents ... is covered or explicitly listed as out of scope; inline-code and Mermaid checks pass" (WP5, per subsection) | Task 18 |
| 8 | derived: WP6 subsections gain visuals and code examples and `npm run validate:mermaid` reports every diagram parsed | Task 19 |
| 9 | derived: WP7 topics exist, follow the WP4 template, use the shared disclaimer and have a card | Task 20 |
| 10 | "`npx antora antora-playbook.yml` completes with no xref or AsciiDoc errors; changed pages checked in the rendered site" | Task 21 |

## Current code state

- Repository: Antora playbook plus `ROOT` component; Antora 3.1.15, collector/mermaid/mathjax extensions
  (`antora-playbook.yml`). 5,627 pages, 176 `index.adoc` files, 3,128 images in `modules/ROOT/images/`.
- Disclaimers: 156 files matching `*disclaimer*` in `modules/ROOT/partials/`. `ai-disclaimer.adoc` already exists as
  the AI section's own `[IMPORTANT]` partial (to be replaced by the shared `[NOTE]` text). 29 other partials
  (`nav-*.adoc` etc.) must be kept.
- Navigation: `modules/ROOT/nav.adoc` lists Home, "Open Source Projects" (AI, Java Projects, Spring Boot Examples)
  then "Guides & References"; Programming Languages entries come from `partial$nav-<lang>.adoc` includes (Kotlin, C,
  C++ ... Rust last). `ui.bundle` is the binary `ui-bundle.zip`; `ui.supplemental_files` currently only carries
  `ui.yml`, `.nojekyll`, `ads.txt` (no template overrides).
- Home page: `modules/ROOT/pages/index.adoc` uses `[cols="1,1,1",frame=none,grid=none]` tables of
  `image::<name>.svg[xref="..."]` cells; "Open Source Projects" is first.
- Subsection index headings (counts): Bibliography 119, What's covered 95, References 48, Version baseline 32,
  Reading path 26, plus synonyms ("New here? Read in this order" 19, "Learning path" 14, "See also" 13, ...).
- `apps/hybrid/` has only `ides-and-tools.adoc` (no index).
- Existing generators under `scripts/` (chart generators, `validate-mermaid.mjs`); no tooling for heading audits.
- `.archive/` has 174 plans for earlier per-section builds; none is a cross-site restructure.

## Implementation steps

### Group 1 — WP1: shared AI disclaimer (Parallelizable: no — Tasks depend on the inventory and the partial from Task 1)

- [x] Task 1. Inventory and shared partial
  - [x] Task 1.1. Script `scripts/disclaimers/inventory.mjs` that lists every `*disclaimer*` partial with its non-AI
    content classified as version baseline, bibliography pointer, external links or topic caveat, and the pages
    that include it (156 partials, all in use; 155 to relocate and delete).
  - [x] Task 1.2. Rewrite `modules/ROOT/partials/ai-disclaimer.adoc` as the shared `[NOTE]` containing only the
    AI-assistance sentence from the issue; rename the AI section's old use if needed.
- [x] Task 2. Relocate content, then switch pages
  - [x] Task 2.1. Per partial, move the version baseline into the subsection index under `== Version baseline`.
  - [x] Task 2.2. Move topic caveats (jQuery legacy, accessibility legal notice, Quarkus 4 baseline, ASP.NET
    variants, ...) into the subsection index intro or a page-level admonition; drop bibliography pointers.
  - [x] Task 2.3. Replace every per-topic include with `include::partial$ai-disclaimer.adoc[]` directly after the
    header attributes on all pages except the home page; add it to the 7 other pages lacking one (apps/index,
    programming-languages index and comparative, one root page each in backend, backend/architecture, database, web).
  - [x] Task 2.4. Remove the 10 hand-written `[NOTE]` AI notices in `backend/graphql/`.
- [x] Task 3. Delete the per-topic partials
  - [x] Task 3.1. `git rm` the 155 `*-disclaimer.adoc` files other than `ai-disclaimer.adoc`, only after Task 2 is verified.
  - [x] Task 3.2. Run the issue's acceptance greps (`grep -rL ...` prints only `index.adoc`; partial count is 1; no
    "assistance of AI" outside the partial) and the `iru-gate-runner`-delegated Antora build.
- [x] Task 4. Traceability check: script/report mapping each removed partial's non-AI content to its new location;
  fail if any version or caveat text has no destination.

### Group 2 — WP2: navigation panel (Parallelizable: yes — touches the UI override and `nav.adoc`/home only)

- [x] Task 5. Home page and nav order
  - [x] Task 5.1. Move "Guides & References" before "Open Source Projects" in `modules/ROOT/pages/index.adoc` and
    `modules/ROOT/nav.adoc`; reword the home intro; keep "About me" last.
  - [x] Task 5.2. Reorder `programming-languages` entries in `nav.adoc` (and the `nav-<lang>.adoc` includes) to match
    the index page order; keep nav order equal to index card order in every section.
  - [x] Task 5.3. Normalise nav titles (bare product/topic names: "Java", "JavaScript", "Spring Boot", "FastAPI",
    "MongoDB"; drop "Reference"/"Development" suffixes and "Python " prefixes) and use the same title in nav, card and
    index link text.
- [x] Task 6. Default-expanded groups via supplemental UI
  - [x] Task 6.1. Add `ui.supplemental_files` entries in `antora-playbook.yml` overriding `partials/nav-tree.hbs` (and
    any needed CSS/JS) so "Open Source Projects" and "Guides & References" are expanded by default on every page,
    including remote components; deeper levels stay collapsed except the current page's path.
  - [x] Task 6.2. Keep current-page highlighting, collapse/expand toggles and the "toggle all" button working; navigation
    between pages must not collapse the default-open groups.
- [x] Task 7. Verify in the browser at desktop and mobile widths on the home page and a deep page (use the preview
  tools with a temporary config serving `build/site`).
- [x] Task 8. Record the WP2 nav override (`antora-playbook.yml` `ui.supplemental_files`, `partials/nav-tree.hbs`) in `CLAUDE.md` (Architecture section). Draft a short comment for #255 saying that this override should be folded into the bundle source there, and save it to `.archive/issue-255-comment-draft.md`. Do not post it: the main session posts it after the user confirms.

### Group 3 — WP4: index template (Parallelizable: no — Task 9 tooling precedes the page rewrites)

- [x] Task 9. Heading audit tooling: `scripts/index-template/audit.mjs` listing `==` headings of all index pages
  against the template order (section and subsection templates from the issue); report violations.
- [x] Task 10. Rename synonym headings to template names across the 26+19+14+... subsection indexes and update all
  `#_anchor` xrefs pointing at renamed headings (grep for xrefs to the old anchors first).
- [x] Task 11. Subsection index gaps
  - [x] Task 11.1. Add the missing `== Bibliography` to the 15 subsections without one (ecommerce, documentation-tools,
    graphics-games, backend/architecture).
  - [x] Task 11.2. Write a proper `backend/architecture/index.adoc` (currently 24 lines).
  - [x] Task 11.3. Create `apps/hybrid/index.adoc` and link it from the apps index and nav.
  - [x] Task 11.4. Cross-link the duplicated homes (`media-optimization` x3, `scikit-learn` x2) under
    `== Related material on this site`, stating in each intro what it covers.
- [x] Task 12. Section indexes: apply the section template and move conceptual content to `overview.adoc`
  - [x] Task 12.1. Create `ecommerce/overview.adoc` from "Three ways to run an online store", "The four platforms"
    and "Which subsection should I read?". Keep the cited-URL bibliography under `== Bibliography` in the index.
  - [x] Task 12.2. Create `graphics-games/overview.adoc` from "Graphics APIs and game engines", "Targeted versions",
    "Learning path", "Reading order", "Cheat sheets", the Bookshelf scene section, "Concept-to-page map" and
    "Coverage map".
  - [x] Task 12.3. Create `ml/overview.adoc` from "Scope and neighbouring sections", "Targeted versions", "Learning
    path", "Reading order" and "Concept-to-page map".
  - [x] Task 12.4. Create `cms/overview.adoc` from "What a CMS is made of", "Traditional, headless and hybrid CMSs",
    "Open source and SaaS" and "When a CMS is the right tool, and when a framework is".
  - [x] Task 12.5. Do the same for data-science, documentation-tools and ui-ux wherever their index carries content
    beyond the template.
  - [x] Task 12.6. Standalone section-level pages (for example the concept pages in `ml/` and `graphics-games/`) stay
    where they are, are linked from the overview, and are reached from `== Sections` through an entry for the overview.
  - [x] Task 12.7. Add each `overview.adoc` to `nav.adoc` (first entry under its section) and link it from the index
    intro. Update xrefs to anchors of moved headings so they point at `overview.adoc#...`. Every new page includes the
    shared disclaimer.
  - [x] Task 12.8. Apply the section template to the other section indexes (intro, card-grid position, `== Sections`,
    then the optional related and bibliography sections).
- [x] Task 13. Run the audit script: only template headings in template order across all 149 index pages; Antora build
  has no broken xrefs. (`npm run audit:index-template`: 150 pages audited, 0 violations; the 150th is the new `apps/hybrid/index.adoc`; Antora build exit 0 with no warnings.)

### Group 4 — WP3: image cards, art (Parallelizable: yes — one section per file set; SVG files are independent)

- [x] Task 14. Card tooling and art
  - [x] Task 14.1. `scripts/cards/generate-cards.mjs` generating `card-<section>-<subsection>.svg` (600x600, structure
    of `modules/ROOT/images/programming-languages.svg`, one gradient per section) from a manifest of title, subtitle,
    section and logo source.
  - [x] Task 14.2. Logos only from Simple Icons (CC0) and Devicon (MIT), as monochrome white marks in the top circle;
    drawn white-line glyphs where no logo is available or the mark was withdrawn (Java, AWS, Microsoft products); no
    redrawing of trademarks. Record source and licence per card in a table for the PR description. (`scripts/cards/LOGO-SOURCES.md`, generated; 85 marks from Simple Icons 16.37.0 and Devicon 2.18.0, rest drawn glyphs.)
  - [x] Task 14.3. Tests (`node --test`) for the generator: file names, dimensions, no orphan manifest entries. (`npm run test:cards`: 7 pass.)
- [x] Task 15. Card grids per section (one task per section group, each adding the table after the intro and before the
  text list; text lists unchanged)
  - [x] Task 15.1. programming-languages (22 subsections plus comparative), database (13), web (20)
  - [x] Task 15.2. backend (28), apps (8), cloud (3), ai (15)
  - [x] Task 15.3. documentation-tools (4), ecommerce (4), cms (4), ui-ux (2), data-science (3), ml (3), graphics-games (6)
  - [x] Task 15.4. `git-and-github` gets no grid; confirm and note it. (Confirmed: it had no subsections, no grid added. Superseded by Task 20.2: the new `github-actions` subsection gave it a card and a one-card grid.)
- [x] Task 16. Add the trademark notice to the home page ("logos are trademarks of their respective owners, used for
  identification only").
- [x] Task 17. Verification: the three image greps from `CLAUDE.md` print nothing, every new SVG is referenced, alt text
  with commas is quoted, and each of the 14 section pages is checked in the built site.

### Group 5 — WP5: deepen thin subsections (Parallelizable: yes — one subsection per task, disjoint files; use the books in `~/libros` read-only)

- [x] Task 18. Deepen subsections (each: check the Bibliography books' tables of contents, add concept explanations,
  worked examples on the section's running example, at least one diagram or figure per page where a concept/flow/
  structure is described, runnable code; list out-of-scope topics in the index; run the inline-code and Mermaid checks).
  Priority within each section follows list order, starting with react, kotlin, python, typescript, angular, vue.
  - [x] Task 18.1. programming-languages: kotlin, cpp, swift, typescript, python -- 170 pages deepened (Mermaid diagrams, worked examples, out-of-scope lists in each index); build, mermaid, audit and inline-code checks clean.
  - [x] Task 18.2. web: jquery, react, media-optimization, tailwind, aspnet, bootstrap, vaadin, angular, vue, sass -- all ten subsections deepened (Mermaid diagrams, worked examples, out-of-scope lists in each index); build, mermaid, audit and inline-code checks clean.
  - [x] Task 18.3. database: schema-evolution, neo4j, qdrant, lucene, prometheus, couchbase, mongodb -- all seven subsections deepened (Mermaid diagrams, worked examples run against real servers, out-of-scope lists in each index); build, mermaid, audit and inline-code checks clean.
  - [x] Task 18.4. backend: hibernate, media-optimization, spring-batch -- all three subsections deepened (Mermaid diagrams, worked examples run with Maven, Docker, Python and Node, out-of-scope lists in each index); build, mermaid, audit and inline-code checks clean.
  - [x] Task 18.5. apps: media-optimization -- seven pages and the index deepened (Swift and Node runs, Mermaid diagrams, out-of-scope list), consistent with the web and backend media-optimization subsections.
  - [x] Task 18.6. `ui-ux/figma` is excluded (figure-driven); confirm no change. (Confirmed: only the Group 1 disclaimer include differs; no Task 18 change.)

### Group 6 — WP6: diagrams, figures and code examples (Parallelizable: no — must follow Task 18 for overlapping subsections; otherwise per-subsection tasks are independent)

- [x] Task 19. Add Mermaid (flows, structures) or SVG figures to pages that describe an architecture, flow, lifecycle,
  data structure or comparison (not pure syntax references) and code examples to pages without any; validate with
  `npm run validate:mermaid` after `npm i --no-save mermaid@11 jsdom`.
  - [x] Task 19.1. programming-languages: csharp, scala, python, matlab, groovy, r, php, javascript, rust, java, c -- 42 Mermaid diagrams on 40 pages (php 6, others 4 each; python already had none left) and a worked example in every cheat-sheet; build, mermaid (4201 parsed), audit and image checks clean.
  - [x] Task 19.2. backend: nodejs, axum, graphql; web: php-laravel, e2e-testing, html-css
  - [x] Task 19.3. cms: wordpress; database: solr, elasticsearch, sql; ml: pytorch
  - [x] Task 19.4. ai: cli-for-agents, ai-assisted-development, customizing-ai-workflows, llmops, local-llms -- 33 Mermaid diagrams (cli-for-agents 7, ai-assisted-development 6, customizing-ai-workflows 5, llmops 7, local-llms 8) and a worked example in each cheat-sheet; inline-code defects fixed in the five subsections; build, mermaid (4282 parsed), audit and image checks clean.

### Group 7 — WP7: new topics (Parallelizable: yes — three independent topics; each follows the WP4 template, shared disclaimer and gets a card)

- [x] Task 20. New references
  - [x] Task 20.1. Hybrid apps: `apps/hybrid/` Flutter (and Dart) and Ionic/Capacitor references next to the IDEs & Tools page.
  - [x] Task 20.2. CI/CD and GitHub Actions reference (workflows, runners, caching, secrets, environments, reusable
    workflows, release pipelines), linked from Git & GitHub and the per-stack publishing pages.
  - [x] Task 20.3. Relational engines: PostgreSQL (14 pages) and MySQL (13 pages) references under `database/`, run against postgres 18.6 and mysql 26.10.0 in Docker, 48 Mermaid diagrams.
  - [x] Task 20.4. For each: nav entries, section index text entry, card, and cross-links (cards and grid refreshed, 20.4 items of hybrid and github-actions confirmed).

### Group 8 — final verification and publication (Parallelizable: yes — single task)

- [x] Task 21. Final checks
  - [x] Task 21.1. Full `npx antora antora-playbook.yml` build with no xref/AsciiDoc errors.
  - [x] Task 21.2. Image, inline-code and Mermaid greps from `CLAUDE.md` on every changed section; spot-check rendered pages.
  - [x] Task 21.3. Rebase this branch on `main`, re-run the verification, and open the PR into `main` (the site
    publishes from `main`, so nothing goes live before the merge). Done: the branch was 0 commits behind `main`; draft PR #391 opened.
  - [x] Task 21.4. Update `CLAUDE.md` with the new scripts (disclaimer inventory, index-template audit, card
    generator) and conventions (shared disclaimer, index templates, card naming). `/iru-update-docs` is not needed
    because the docs are the product.

### Group 9 — review follow-up: IDE cards, download buttons and a shared palette (Parallelizable: no — all three use the palette and template from Task 22)

Requested by the user while reviewing the implementation (2026-11-10).

- [x] Task 22. Shared palette and card template derived from the UI bundle's animated top bar (`#ff6ec4`, `#7873f5`,
  `#4ade80`): `scripts/cards/palette.mjs` (six diagonal three-stop variants, one per section and per non-section
  group) and one template in `scripts/cards/generate-cards.mjs` (highlight, lower scrim, logo disc, white pill
  button). All 147 section cards regenerated; the 30 hand-made home cards restyled in place
  (`home-cards.mjs`, `restyle()`), keeping their hand-drawn logos and text layout.
- [x] Task 23. IDE cards: `scripts/cards/ide-manifest.mjs` (91 products, aliases for name variants; Microsoft
  products as glyphs, VS Code extensions with the language's logo), `ide-<slug>.svg` cards with a "Visit" button,
  and `scripts/cards/insert-ide-grids.mjs` adding a card grid before the link list of each `==` group on the 26
  `ides-and-tools.adoc` pages (133 cards). Logos added to `logos.json` from Simple Icons 16.37.0 / Devicon 2.18.0.
- [x] Task 24. Cheat-sheet download buttons: `download-cheat-sheet-pdf.svg` (and `download-pdf-compact.svg` for
  table cells) and `scripts/cards/insert-download-buttons.mjs`. The main PDF moves to a button after the
  introduction, other standalone links become buttons, emptied `== Download` sections are removed (133 pages).
  The 5 new cheat sheets from Task 20 got their PDFs in Task 26.
- [x] Task 25. Tests (`npm run test:cards`, 12 passing), `npm run cards` runs every generator and inserter,
  `CLAUDE.md` documents the palette, IDE cards and download button; Antora build clean, image greps empty, index
  audit 0 violations, pages checked in the browser at desktop and mobile widths.
- [x] Task 26. One-page PDFs for the 5 new cheat sheets (Flutter, Ionic, MySQL, PostgreSQL, GitHub Actions):
  `scripts/cheat-sheet-pdfs/render.mjs` renders the house A4 layout through headless Chrome from content modules in
  `scripts/cheat-sheet-pdfs/sheets/` condensed from each cheat-sheet page, and fails if a sheet spills onto a second
  page (code lines limited to 44 characters, the column width). PDFs are written to `modules/ROOT/attachments/`, linked
  from each page and shown as its top download button. `npm run cheat-sheets` and `npm run test:cheat-sheets`
  (3 passing) are documented in `CLAUDE.md`.
