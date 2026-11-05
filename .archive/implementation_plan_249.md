# Implementation plan: Graphics & Games section with OpenGL, WebGL, Metal, Vulkan, Unity and Unreal Engine sub-sections (issue #249)

## Task summary

Add a top-level **Graphics & Games** section as the last entry under Guides & References
(`modules/ROOT/pages/graphics-games/`): 29 general pages (including the landing page, the comparison page and the
cheat sheet), and six sub-sections: **OpenGL** (41 pages), **WebGL** (32), **Metal** (40), **Vulkan** (37), **Unity** (40)
and **Unreal Engine** (39), 258 pages in total. It also needs seven one-page A4 cheat-sheet PDFs, seven AI-assistance
disclaimer partials (the only admonitions), a comparison page with a chart-generating script, a bibliography on the
section landing page, 600+ original figures (SVG first, Mermaid for flows) and the shared Bookshelf assets. The
per-page outline, official sources, version baseline (found 2026-10-31, re-verify at implementation), books
comparison, figure suggestions, outdated statements and cheat-sheet boxes are in issue #249 and its seven "Spec part N
of 7" comments, which are authoritative; the tasks below refer to them instead of repeating them.

Choices made:
- Scope: the whole issue in one plan, grouped by the issue's suggested PR slices (PR 1 scaffolding + general pages, PR 2
  comparison, PR 3-8 one library each). Each slice ends with its own verification task, so a PR can be cut at any
  slice boundary: (1) groups 1-4, (2) group 5, (3) groups 6-7, (4) groups 8-9, (5) groups 10-11, (6) groups 12-13,
  (7) groups 14-15, (8) groups 16-17, then the final integration group 18.
- All tasks are documentation-only and untagged (implemented directly; no language key applies, although the pages
  contain C/C++, Swift/MSL, JS/TS/GLSL/WGSL and C#/HLSL examples). Pages are new files, so page groups are parallelizable
  and clustered four to a task. Landing pages, whats-changed pages, cheat sheets, nav and back-links come after the
  pages of their slice.
- The nav entry goes after **ML (Machine Learning)**, which is now the last entry (the issue says after Data Science;
  that is stale).
- The section cheat sheet is built in the final group rather than in PR 2, and the general pages' "See it in" lines are
  added there too, because both link pages of every sub-section and no `xref:` may point to a page that does not exist.
- Bookshelf assets are generated procedurally and kept under `modules/ROOT/attachments/`; KTX2 only if `toktx` is
  available, otherwise PNG textures.
- Every fact is re-verified against official documentation at implementation (baseline date 2026-10-31); *unverified*
  spec items are verified or left out. The requester's 25 books are never committed, attached or copied from.
- Each page task follows the "Page conventions" and "Figures" sections of the issue body: `= Title`, `:description:`,
  `:keywords:`, disclaimer include, intro with check date and versions, detailed explanation, complete examples each
  followed by a `Source:` link, >=2 figures (>=4 on ★ pages), passthroughs for inline code containing `->`, `*`, `{`
  etc., `== References`.

Source: GitHub issue #249
Base branch: main
Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/pages/graphics-games/index.adoc` exists and is the target of a new `** xref:graphics-games/index.adoc[Graphics & Games]` nav entry, the last under **Guides & References**…" | Task 11, Task 14, Task 27 … Task 103 (16 tasks, see the page and verification tasks of every group) |
| 2 | "The root `index.adoc` has a **Graphics & Games** tile (`graphics-games.svg`), and its `:description:` and `:keywords:` mention the section and its libraries." | Task 3, Task 11 |
| 3 | "Every page in the seven outlines exists: general 29, OpenGL 41, WebGL 32, Metal 40, Vulkan 37, Unity 40, Unreal Engine 39 (258 in total…)" | Task 4, Task 5, Task 6 … Task 102 (83 tasks, see the page and verification tasks of every group) |
| 4 | "Every official documentation area listed in each spec comment is covered by at least one page and mapped on the matching landing page…" | Task 27, Task 40, Task 55 … Task 103 (7 tasks, see the page and verification tasks of every group) |
| 5 | "Every page explains its concepts **in detail**, and every ★ page has the depth described in "Page conventions"." | Task 4, Task 5, Task 6 … Task 102 (83 tasks, see the page and verification tasks of every group) |
| 6 | "Every code example is complete and is **followed by a link to the official documentation page it derives from**…" | Task 4, Task 5, Task 6 … Task 102 (83 tasks, see the page and verification tasks of every group) |
| 7 | "**Figures**: at least two per page and four per ★ page, including storyboards for procedures… Every Mermaid block passes `npm run validate:mermaid`…" | Task 1, Task 12, Task 14 … Task 104 (11 tasks, see the page and verification tasks of every group) |
| 8 | "Book statements that are outdated are documented in prose or tables with versions and dates… `whats-changed-since-older-guides.adoc` collects them." | Task 26, Task 39, Task 54 … Task 97 (6 tasks, see the page and verification tasks of every group) |
| 9 | "The seven disclaimer partials exist and are included on every page of the section. They are the **only** admonitions…" | Task 2, Task 12, Task 15 … Task 104 (10 tasks, see the page and verification tasks of every group) |
| 10 | "`== Bibliography` on `graphics-games/index.adoc` lists every source, each linked to its official website… Every page has a `== References` section." | Task 4, Task 5, Task 6 … Task 102 (84 tasks, see the page and verification tasks of every group) |
| 11 | "The seven cheat-sheet pages exist, and each links a **single-page** A4 PDF in `modules/ROOT/attachments/`…" | Task 28, Task 41, Task 56 … Task 102 (7 tasks, see the page and verification tasks of every group) |
| 12 | "`comparison.adoc` follows the existing comparison pages: CSV data and `sources.csv` under `scripts/graphics-games-comparison-charts/`, an `npm run charts:graphics-games-comparison` script…" | Task 13, Task 14 |
| 13 | "The existing pages listed in the spec comments get their one-line back-links… No `xref:` points to a page that does not exist." | Task 12, Task 15, Task 29 … Task 104 (15 tasks, see the page and verification tasks of every group) |
| 14 | "No book PDF is committed or attached anywhere… Every *unverified* item in the spec comments is either verified or left out." | Task 27, Task 40, Task 55 … Task 104 (7 tasks, see the page and verification tasks of every group) |
| 15 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings. The `CLAUDE.md` image and inline-code verification greps print nothing… The Graphics & Games nav renders under Guides & References." | Task 12, Task 15, Task 30 … Task 104 (9 tasks, see the page and verification tasks of every group) |

## Current code state

- Docs-only Antora repo (`antora.yml`, component `ROOT`, `modules/ROOT/`); no `graphics-games` pages, images, partials, attachments or chart scripts exist yet.
- `modules/ROOT/nav.adoc`: Guides & References entries end with `** xref:ml/index.adoc[ML (Machine Learning)]` (~line 3591), after `data-science` (~3420) and `ui-ux` (~3343).
- `modules/ROOT/pages/index.adoc`: tile table ends with the `data-science.svg` and `ml.svg` tiles; `:description:` and `:keywords:` are long single lines.
- Precedents: `data-science/` and `ml/` (landing, cheat sheet, sub-sections, bibliography on landings), `ui-ux/figma/` (figure-heavy), `scripts/ecommerce-comparison-charts/` (chart pipeline), `modules/ROOT/partials/*-disclaimer.adoc`, `modules/ROOT/attachments/*-cheat-sheet.pdf`; archived plans `.archive/implementation_plan_244.md`, `_245`, `_246`, `_250`.
- Existing pages to link or touch: `apps/android/graphics-canvas-and-opengl-es.adoc`, `programming-languages/javascript/browser-canvas-webgl.adoc`, `programming-languages/csharp/getting-started.adoc`, `apps/apple/{swiftui-drawing-animation-and-gestures,augmented-reality,visionos}.adoc`, `web/webrtc-websockets/multiplayer-game-architecture.adoc`, `programming-languages/rust/webassembly.adoc` (full per-library lists in the spec comments).
- Repo conventions from `CLAUDE.md` apply to every task: one-line image macros with quoted alt text containing commas, no orphan SVGs, passthroughs for inline code, Mermaid stereotypes as `&lt;&lt;x&gt;&gt;`, MathJax for math.

## Implementation steps

### Group 1 — PR 1 / scaffolding: partials, figure style and shared assets

Parallelizable: no — the figure style and asset path recorded by Task 1 are reused by Task 3 and by every later figure task

- [x] Task 1. Record the figure style and shared-asset decisions before any page is written
  - [x] Task 1.1. Inspect 3-4 SVGs from `modules/ROOT/images/ui-ux-figma-*.svg` and the Figma plan (`.archive/implementation_plan_250.md`); write down the palette, fonts, stroke widths, caption pattern and `graphics-games-<topic>.svg` / `graphics-games-<library>-<topic>.svg` naming in the scratchpad so every later figure task reuses one style
  - [x] Task 1.2. Decide the Bookshelf asset location (planned: `modules/ROOT/attachments/bookshelf.glb` plus textures) and record it for every library task
- [x] Task 2. Create the 7 disclaimer partials in `modules/ROOT/partials/`, following `data-science-disclaimer.adoc`
  - [x] Task 2.1. `graphics-games-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 2.2. `graphics-games-opengl-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 2.3. `graphics-games-webgl-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 2.4. `graphics-games-metal-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 2.5. `graphics-games-vulkan-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 2.6. `graphics-games-unity-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 2.7. `graphics-games-unreal-engine-disclaimer.adoc`: a single `[IMPORTANT]` block with only the house AI-assistance disclosure and a pointer to `xref:graphics-games/index.adoc#_bibliography[the section bibliography]`
- [x] Task 3. Create the original Bookshelf assets and the `graphics-games.svg` home tile
  - [x] Task 3.1. Generate `bookshelf.glb` (glTF 2.0, original procedural shelf and books) and textures for the site with a throwaway script kept in the scratchpad; produce KTX2 textures if `toktx` is available, otherwise ship PNG textures and say so on the section landing page
  - [x] Task 3.2. Draw `modules/ROOT/images/graphics-games.svg` matching the existing tiles (no Khronos/Apple/Unity/Epic logos)

### Group 2 — PR 1 / general concept pages (`graphics-games/`, spec part 1)

Parallelizable: yes — every page is a new file; no page reads another page's finished text (cross-links are added in the final integration group)

- [x] Task 4. Write 4 pages in `modules/ROOT/pages/graphics-games/`: `graphics-apis-vs-game-engines.adoc`, `history-of-real-time-graphics.adoc`, `gpu-architecture-basics.adoc`, `the-rendering-pipeline.adoc` (spec part 1: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - 4 pages and their SVG figures in `modules/ROOT/pages/graphics-games/` and `modules/ROOT/images/`; Antora build clean apart from the landing-page bibliography xref (page arrives in Group 3), image/inline-code greps clean, Mermaid validation passed.
  - [x] Task 4.1. `graphics-apis-vs-game-engines.adoc` — Graphics apis vs game engines: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 4.2. `history-of-real-time-graphics.adoc` — History of real time graphics: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 4.3. `gpu-architecture-basics.adoc` — Gpu architecture basics: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 4.4. `the-rendering-pipeline.adoc` — The rendering pipeline: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 5. Write 4 pages in `modules/ROOT/pages/graphics-games/`: `advanced-pipeline-stages.adoc`, `explicit-vs-implicit-apis.adoc`, `coordinate-spaces-and-transforms.adoc`, `vectors-matrices-and-homogeneous-coordinates.adoc` (spec part 1: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - 4 pages and their SVG figures in `modules/ROOT/pages/graphics-games/` and `modules/ROOT/images/`; Antora build clean apart from the landing-page bibliography xref (page arrives in Group 3), image/inline-code greps clean, Mermaid validation passed.
  - [x] Task 5.1. `advanced-pipeline-stages.adoc` — Advanced pipeline stages: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 5.2. `explicit-vs-implicit-apis.adoc` — Explicit vs implicit apis: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 5.3. `coordinate-spaces-and-transforms.adoc` — Coordinate spaces and transforms: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 5.4. `vectors-matrices-and-homogeneous-coordinates.adoc` — Vectors matrices and homogeneous coordinates: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 6. Write 4 pages in `modules/ROOT/pages/graphics-games/`: `rotations-and-quaternions.adoc`, `meshes-and-vertex-data.adoc`, `textures-sampling-and-mipmaps.adoc`, `lighting-and-shading-models.adoc` (spec part 1: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - 4 pages and their SVG figures in `modules/ROOT/pages/graphics-games/` and `modules/ROOT/images/`; Antora build clean apart from the landing-page bibliography xref (page arrives in Group 3), image/inline-code greps clean, Mermaid validation passed.
  - [x] Task 6.1. `rotations-and-quaternions.adoc` — Rotations and quaternions: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 6.2. `meshes-and-vertex-data.adoc` — Meshes and vertex data: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 6.3. `textures-sampling-and-mipmaps.adoc` — Textures sampling and mipmaps: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 6.4. `lighting-and-shading-models.adoc` — Lighting and shading models: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 7. Write 4 pages in `modules/ROOT/pages/graphics-games/`: `shadows-and-global-illumination.adoc`, `color-spaces-hdr-and-tone-mapping.adoc`, `transparency-blending-and-post-processing.adoc`, `shading-languages-landscape.adoc` (spec part 1: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - 4 pages and their SVG figures in `modules/ROOT/pages/graphics-games/` and `modules/ROOT/images/`; Antora build clean apart from the landing-page bibliography xref (page arrives in Group 3), image/inline-code greps clean, Mermaid validation passed.
  - [x] Task 7.1. `shadows-and-global-illumination.adoc` — Shadows and global illumination: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 7.2. `color-spaces-hdr-and-tone-mapping.adoc` — Color spaces hdr and tone mapping: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 7.3. `transparency-blending-and-post-processing.adoc` — Transparency blending and post processing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 7.4. `shading-languages-landscape.adoc` — Shading languages landscape: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 8. Write 4 pages in `modules/ROOT/pages/graphics-games/`: `scene-graphs-and-asset-formats.adoc`, `game-loop-and-frame-timing.adoc`, `entity-component-system.adoc`, `physics-audio-and-input-basics.adoc` (spec part 1: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - 4 pages and their SVG figures in `modules/ROOT/pages/graphics-games/` and `modules/ROOT/images/`; Antora build clean apart from the landing-page bibliography xref (page arrives in Group 3), image/inline-code greps clean, Mermaid validation passed.
  - [x] Task 8.1. `scene-graphs-and-asset-formats.adoc` — Scene graphs and asset formats: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 8.2. `game-loop-and-frame-timing.adoc` — Game loop and frame timing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 8.3. `entity-component-system.adoc` — Entity component system: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 8.4. `physics-audio-and-input-basics.adoc` — Physics audio and input basics: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 9. Write 4 pages in `modules/ROOT/pages/graphics-games/`: `augmented-and-mixed-reality-basics.adoc`, `cross-platform-translation-layers.adoc`, `choosing-an-api-or-engine.adoc`, `performance-and-profiling.adoc` (spec part 1: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - 4 pages and their SVG figures in `modules/ROOT/pages/graphics-games/` and `modules/ROOT/images/`; Antora build clean apart from the landing-page bibliography xref (page arrives in Group 3), image/inline-code greps clean, Mermaid validation passed.
  - [x] Task 9.1. `augmented-and-mixed-reality-basics.adoc` — Augmented and mixed reality basics: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 9.2. `cross-platform-translation-layers.adoc` — Cross platform translation layers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 9.3. `choosing-an-api-or-engine.adoc` — Choosing an api or engine: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 9.4. `performance-and-profiling.adoc` — Performance and profiling: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

### Group 3 — PR 1 / general pages that summarise the rest, and section landing skeleton

Parallelizable: no — the glossary and whats-changed page consume the terms and outdated statements found in the general pages; the landing page and nav consume both

- [x] Task 10. Write `glossary.adoc` and `whats-changed-since-older-guides.adoc` (general; the three general books: Selman, Sun Java 3D 1.3, Sood)
  - [x] Task 10.1. `glossary.adoc` — every term used by the general pages, linking each to the page that explains it
    - glossary.adoc with 139 terms, each linked to its page; Antora build clean, image and inline-code greps clean.
  - [x] Task 10.2. `whats-changed-since-older-guides.adoc` — outdated statements from the three general books in prose or table rows (no admonitions)
    - whats-changed-since-older-guides.adoc with two figures and per-book correction tables; Antora build clean, image and inline-code greps clean.
- [x] Task 11. Write the section landing page `graphics-games/index.adoc` (first version) and wire it into the nav and the home page
  - [x] Task 11.1. `graphics-games/index.adoc`: what graphics APIs and game engines are, general page list with the learning path, the Bookshelf scene and assets, the version baseline table (re-verified), a coverage map of the general official-documentation areas and book concepts, and `== Bibliography` with the general sources (3 books with publisher links, Khronos/MDN/W3C/etc. docs); library cards and library bibliography entries are added by each library slice
    - graphics-games/index.adoc with library map, version table, Mermaid learning path, Bookshelf assets (PNG note), coverage map, Bibliography; Antora build clean, image and inline-code greps clean.
  - [x] Task 11.2. `modules/ROOT/nav.adoc`: add `** xref:graphics-games/index.adoc[Graphics & Games]` as the **last** entry under Guides & References (after **ML (Machine Learning)**, line ~3591; the issue says after Data Science, which is stale), with the general pages as `***` entries grouped by unlinked `***` headings
    - nav.adoc entry added last under Guides & References; Antora build clean, image and inline-code greps clean.
  - [x] Task 11.3. `modules/ROOT/pages/index.adoc`: add the `image::graphics-games.svg[xref="graphics-games/index.adoc"]` tile after the ML tile, append "Graphics & Games" to `:description:` and the issue's keyword list to `:keywords:`
    - home tile, :description: and :keywords: updated; Antora build clean, image and inline-code greps clean.

### Group 4 — PR 1 / verification

Parallelizable: no — runs after every PR 1 page exists

- [x] Task 12. Build and verify PR 1
  - [x] Task 12.1. Run `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`) and `npx antora antora-playbook.yml`; fix every `xref`/AsciiDoc warning
  - [x] Task 12.2. Run the three `CLAUDE.md` image greps, the inline-code substitutions grep on `build/site/graphics-games`, the unquoted-comma alt-text grep on changed files, the rendered-text backtick scan from memory notes, and check every `graphics-games-*.svg` is referenced
  - [x] Task 12.3. Check no admonition other than the partial exists (`grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]' modules/ROOT/pages/graphics-games`)
  - [x] Task 12.4. Delegate the secret scan to `iru-gate-runner` (`iru-check-security`); a hit stops the run
    - 0 new secret findings (394 baseline entries unchanged; 21 pre-existing unlabeled in cms/ and ecommerce/ left untouched); Antora build clean, 3023 Mermaid diagrams parsed, all image/inline-code/rendered-text greps clean after one fix (backticks after a quote in entity-component-system.adoc).

### Group 5 — PR 2 / comparison page and chart scripts

Parallelizable: no — Task order follows the data pipeline: data, scripts, charts, page

- [x] Task 13. Create `scripts/graphics-games-comparison-charts/` following `scripts/ecommerce-comparison-charts/`
  - [x] Task 13.1. `data/*.csv` and `data/sources.csv` (Stack Exchange API, GitHub, npm, Steam Hardware Survey, GDC and JetBrains surveys), with the snapshot date; re-fetch live values at implementation -- files `scripts/graphics-games-comparison-charts/data/{current,timeseries,releases,radar-scores,sources}.csv` and `NOTES.md`, snapshot 2026-11-01 (Stack Exchange, GitHub and npm fetched live; JetBrains survey read from the report page; GDC report page returned 404, recorded as unverified n/a).
  - [x] Task 13.2. `chart-definitions.mjs`, `scores.mjs` (scoring rubric), `renderers.mjs`, `generate-charts.mjs`: time-series, bar and radar charts as SVG under `modules/ROOT/images/graphics-games-comparison-*.svg` -- `chart-definitions.mjs`, `scores.mjs`, `renderers.mjs`, `generate-charts.mjs`; 10 SVGs `graphics-games-comparison-*.svg` generated into `modules/ROOT/images/`.
  - [x] Task 13.3. `generate-charts.test.mjs` and `package.json` scripts `charts:graphics-games-comparison` and `test:charts:graphics-games-comparison`; run both -- `generate-charts.test.mjs` (14 tests pass) and `package.json` scripts `charts:graphics-games-comparison` / `test:charts:graphics-games-comparison`; both run.
- [x] Task 14. Write `graphics-games/comparison.adoc` (spec part 1, comparison page design) and add it to the nav after the general pages
  - [x] Task 14.1. Embed the generated charts, the scoring rubric and snapshot date, a decision-tree Mermaid, `== References`, disclaimer include; link `ecommerce/comparison.adoc`, `documentation-tools/comparison.adoc` and `cloud/comparing-cloud-providers.adoc` for the pattern only -- `modules/ROOT/pages/graphics-games/comparison.adoc` with 10 charts, rubric, snapshot date, decision-tree Mermaid, References and disclaimer; nav entry added after the general pages.
- [x] Task 15. Verify PR 2: run the chart test script, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps and `npm run validate:mermaid` -- chart tests, Antora build, CLAUDE.md greps on build/site/graphics-games, validate:mermaid (3024 diagrams parsed) and authoring-note scan all clean.

### Group 6 — PR 3 / OpenGL pages (`graphics-games/opengl/`, spec part 2)

Parallelizable: yes — every page is a new file; the running-example pages are independent

- [x] Task 16. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `opengl-in-2026.adoc`, `versions-profiles-and-extensions.adoc`, `getting-started-desktop.adoc`, `contexts-windows-and-loaders.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 16.1. `opengl/opengl-in-2026.adoc` — Opengl in 2026: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 16.2. `opengl/versions-profiles-and-extensions.adoc` — Versions profiles and extensions: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 16.3. `opengl/getting-started-desktop.adoc` — Getting started desktop: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 16.4. `opengl/contexts-windows-and-loaders.adoc` — Contexts windows and loaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 17. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `egl.adoc`, `hello-triangle.adoc`, `rendering-pipeline.adoc`, `buffers-and-vertex-specification.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 17.1. `opengl/egl.adoc` — Egl: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 17.2. `opengl/hello-triangle.adoc` — Hello triangle: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 17.3. `opengl/rendering-pipeline.adoc` — Rendering pipeline: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 17.4. `opengl/buffers-and-vertex-specification.adoc` — Buffers and vertex specification: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 18. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `glsl-language.adoc`, `shaders-and-programs.adoc`, `uniforms-ubos-and-ssbos.adoc`, `direct-state-access.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 18.1. `opengl/glsl-language.adoc` — Glsl language: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 18.2. `opengl/shaders-and-programs.adoc` — Shaders and programs: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 18.3. `opengl/uniforms-ubos-and-ssbos.adoc` — Uniforms ubos and ssbos: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 18.4. `opengl/direct-state-access.adoc` — Direct state access: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 19. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `glsl-es-and-portability.adoc`, `coordinate-systems-and-transforms.adoc`, `cameras-and-projection.adoc`, `textures-and-samplers.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 19.1. `opengl/glsl-es-and-portability.adoc` — Glsl es and portability: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 19.2. `opengl/coordinate-systems-and-transforms.adoc` — Coordinate systems and transforms: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 19.3. `opengl/cameras-and-projection.adoc` — Cameras and projection: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 19.4. `opengl/textures-and-samplers.adoc` — Textures and samplers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 20. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `lighting-blinn-phong.adoc`, `materials-and-normal-mapping.adoc`, `pbr-basics.adoc`, `blending-depth-and-stencil.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 20.1. `opengl/lighting-blinn-phong.adoc` — Lighting blinn phong: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 20.2. `opengl/materials-and-normal-mapping.adoc` — Materials and normal mapping: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 20.3. `opengl/pbr-basics.adoc` — Pbr basics: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 20.4. `opengl/blending-depth-and-stencil.adoc` — Blending depth and stencil: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 21. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `framebuffers-and-render-to-texture.adoc`, `shadow-mapping.adoc`, `instancing-and-indirect-drawing.adoc`, `geometry-and-tessellation-shaders.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 21.1. `opengl/framebuffers-and-render-to-texture.adoc` — Framebuffers and render to texture: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 21.2. `opengl/shadow-mapping.adoc` — Shadow mapping: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 21.3. `opengl/instancing-and-indirect-drawing.adoc` — Instancing and indirect drawing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 21.4. `opengl/geometry-and-tessellation-shaders.adoc` — Geometry and tessellation shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 22. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `compute-shaders.adoc`, `mesh-shaders.adoc`, `sync-queries-and-transform-feedback.adoc`, `antialiasing-and-hdr.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 22.1. `opengl/compute-shaders.adoc` — Compute shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 22.2. `opengl/mesh-shaders.adoc` — Mesh shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 22.3. `opengl/sync-queries-and-transform-feedback.adoc` — Sync queries and transform feedback: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 22.4. `opengl/antialiasing-and-hdr.adoc` — Antialiasing and hdr: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 23. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `opengl-es-on-android.adoc`, `opengl-es-on-ios-and-macos.adoc`, `embedded-and-linux.adoc`, `opengl-and-webgl.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 23.1. `opengl/opengl-es-on-android.adoc` — Opengl es on android: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 23.2. `opengl/opengl-es-on-ios-and-macos.adoc` — Opengl es on ios and macos: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 23.3. `opengl/embedded-and-linux.adoc` — Embedded and linux: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 23.4. `opengl/opengl-and-webgl.adoc` — Opengl and webgl: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 24. Write 4 pages in `modules/ROOT/pages/graphics-games/opengl/`: `debugging-and-tools.adoc`, `performance.adoc`, `asset-loading-gltf-and-obj.adoc`, `text-ui-and-input.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 24.1. `opengl/debugging-and-tools.adoc` — Debugging and tools: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 24.2. `opengl/performance.adoc` — Performance: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 24.3. `opengl/asset-loading-gltf-and-obj.adoc` — Asset loading gltf and obj: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 24.4. `opengl/text-ui-and-input.adoc` — Text ui and input: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 25. Write 2 pages in `modules/ROOT/pages/graphics-games/opengl/`: `skeletal-animation.adoc`, `porting-to-vulkan-metal-webgpu.adoc` (spec part 2: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 25.1. `opengl/skeletal-animation.adoc` — Skeletal animation: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 25.2. `opengl/porting-to-vulkan-metal-webgpu.adoc` — Porting to vulkan metal webgpu: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

### Group 7 — PR 3 / OpenGL landing page, what's changed, cheat sheet, nav and back-links

Parallelizable: no — each task consumes the finished pages of the previous group

- [x] Task 26. Write `opengl/whats-changed-since-older-guides.adoc` from the books' outdated statements (spec part 2, books table)
- [x] Task 27. Write `opengl/index.adoc` for OpenGL and extend the section bibliography
  - [x] Task 27.1. Landing: what OpenGL is and its 2026 status, re-verified version baseline, learning path, grouped page list, coverage map of the official documentation areas and every book-concept row/"missing from the books" concept from spec part 2, `== References`, link to the section bibliography
  - [x] Task 27.2. `graphics-games/index.adoc`: add the OpenGL card and its bibliography entries (each book with author, title, edition, publisher, year, ISBN and publisher page, companion repositories, official docs, release notes, tools), opening Packt/O'Reilly URLs to confirm them
- [x] Task 28. Write `opengl/cheat-sheet.adoc` and the one-page A4 PDF `modules/ROOT/attachments/graphics-games-opengl-cheat-sheet.pdf`
  - [x] Task 28.1. Page following `data-science/cheat-sheet.adoc`: partial include, intro with the PDF `xref:attachment$...` link and baseline date, grouped `*Group* --` paragraphs of `xref:` to every OpenGL page, final download line, `== References`
  - [x] Task 28.2. PDF: render a throwaway HTML page with headless Chrome print-to-PDF (boxes listed in spec part 2), dense, multi-column, colour-coded, with small inline diagrams; confirm it is exactly one page (e.g. `mdls -name kMDItemNumberOfPages`); commit only the PDF
- [x] Task 29. Add the OpenGL nav block and the back-links to existing pages
  - [x] Task 29.1. `modules/ROOT/nav.adoc`: `*** xref:graphics-games/opengl/index.adoc[OpenGL]`, unlinked `****` group headings, one `*****` per page in outline order, last entry the cheat sheet
  - [x] Task 29.2. One-line back-links (and the updated paragraph where the spec says so) in the existing pages listed in spec part 2's "existing pages to link" table
- [x] Task 30. Verify PR 3: `npm run validate:mermaid`, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps on `build/site/graphics-games`, orphan-image check, admonition grep, PDF page count, `iru-gate-runner` security scan

### Group 8 — PR 4 / WebGL pages (`graphics-games/webgl/`, spec part 3)

Parallelizable: yes — every page is a new file; the running-example pages are independent

- [x] Task 31. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `webgl-versions-and-browser-support.adoc`, `first-triangle-webgl2.adoc`, `rendering-pipeline.adoc`, `glsl-es-100-and-300.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 31.1. `webgl/webgl-versions-and-browser-support.adoc` — Webgl versions and browser support: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 31.2. `webgl/first-triangle-webgl2.adoc` — First triangle webgl2: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 31.3. `webgl/rendering-pipeline.adoc` — Rendering pipeline: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 31.4. `webgl/glsl-es-100-and-300.adoc` — Glsl es 100 and 300: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 32. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `buffers-attributes-uniforms-vaos.adoc`, `transforms-and-cameras.adoc`, `textures-and-samplers.adoc`, `lighting-in-shaders.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 32.1. `webgl/buffers-attributes-uniforms-vaos.adoc` — Buffers attributes uniforms vaos: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 32.2. `webgl/transforms-and-cameras.adoc` — Transforms and cameras: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 32.3. `webgl/textures-and-samplers.adoc` — Textures and samplers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 32.4. `webgl/lighting-in-shaders.adoc` — Lighting in shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 33. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `framebuffers-and-render-to-texture.adoc`, `webgl2-advanced-features.adoc`, `extensions.adoc`, `context-loss-and-robustness.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 33.1. `webgl/framebuffers-and-render-to-texture.adoc` — Framebuffers and render to texture: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 33.2. `webgl/webgl2-advanced-features.adoc` — Webgl2 advanced features: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 33.3. `webgl/extensions.adoc` — Extensions: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 33.4. `webgl/context-loss-and-robustness.adoc` — Context loss and robustness: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 34. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `offscreencanvas-and-workers.adoc`, `performance-and-debugging.adoc`, `security-cors-and-privacy.adoc`, `threejs-getting-started.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 34.1. `webgl/offscreencanvas-and-workers.adoc` — Offscreencanvas and workers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 34.2. `webgl/performance-and-debugging.adoc` — Performance and debugging: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 34.3. `webgl/security-cors-and-privacy.adoc` — Security cors and privacy: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 34.4. `webgl/threejs-getting-started.adoc` — Threejs getting started: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 35. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `threejs-scene-graph-and-transforms.adoc`, `threejs-geometry.adoc`, `threejs-materials-and-pbr.adoc`, `threejs-textures-and-color-management.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 35.1. `webgl/threejs-scene-graph-and-transforms.adoc` — Threejs scene graph and transforms: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 35.2. `webgl/threejs-geometry.adoc` — Threejs geometry: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 35.3. `webgl/threejs-materials-and-pbr.adoc` — Threejs materials and pbr: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 35.4. `webgl/threejs-textures-and-color-management.adoc` — Threejs textures and color management: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 36. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `threejs-lights-and-shadows.adoc`, `threejs-loading-models-gltf.adoc`, `threejs-animation-system.adoc`, `threejs-interaction-picking-controls.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 36.1. `webgl/threejs-lights-and-shadows.adoc` — Threejs lights and shadows: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 36.2. `webgl/threejs-loading-models-gltf.adoc` — Threejs loading models gltf: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 36.3. `webgl/threejs-animation-system.adoc` — Threejs animation system: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 36.4. `webgl/threejs-interaction-picking-controls.adoc` — Threejs interaction picking controls: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 37. Write 4 pages in `modules/ROOT/pages/graphics-games/webgl/`: `threejs-custom-shaders-glsl.adoc`, `threejs-postprocessing.adoc`, `threejs-webgpurenderer-and-tsl.adoc`, `threejs-performance-and-disposal.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 37.1. `webgl/threejs-custom-shaders-glsl.adoc` — Threejs custom shaders glsl: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 37.2. `webgl/threejs-postprocessing.adoc` — Threejs postprocessing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 37.3. `webgl/threejs-webgpurenderer-and-tsl.adoc` — Threejs webgpurenderer and tsl: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 37.4. `webgl/threejs-performance-and-disposal.adoc` — Threejs performance and disposal: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 38. Write 1 pages in `modules/ROOT/pages/graphics-games/webgl/`: `webgpu-overview-and-comparison.adoc` (spec part 3: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 38.1. `webgl/webgpu-overview-and-comparison.adoc` — Webgpu overview and comparison: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

### Group 9 — PR 4 / WebGL landing page, what's changed, cheat sheet, nav and back-links

Parallelizable: no — each task consumes the finished pages of the previous group

- [x] Task 39. Write `webgl/whats-changed-since-older-guides.adoc` from the books' outdated statements (spec part 3, books table)
- [x] Task 40. Write `webgl/index.adoc` for WebGL and extend the section bibliography
  - [x] Task 40.1. Landing: what WebGL is and its 2026 status, re-verified version baseline, learning path, grouped page list, coverage map of the official documentation areas and every book-concept row/"missing from the books" concept from spec part 3, `== References`, link to the section bibliography
  - [x] Task 40.2. `graphics-games/index.adoc`: add the WebGL card and its bibliography entries (each book with author, title, edition, publisher, year, ISBN and publisher page, companion repositories, official docs, release notes, tools), opening Packt/O'Reilly URLs to confirm them
- [x] Task 41. Write `webgl/cheat-sheet.adoc` and the one-page A4 PDF `modules/ROOT/attachments/graphics-games-webgl-cheat-sheet.pdf`
  - [x] Task 41.1. Page following `data-science/cheat-sheet.adoc`: partial include, intro with the PDF `xref:attachment$...` link and baseline date, grouped `*Group* --` paragraphs of `xref:` to every WebGL page, final download line, `== References`
  - [x] Task 41.2. PDF: render a throwaway HTML page with headless Chrome print-to-PDF (boxes listed in spec part 3), dense, multi-column, colour-coded, with small inline diagrams; confirm it is exactly one page (e.g. `mdls -name kMDItemNumberOfPages`); commit only the PDF
- [x] Task 42. Add the WebGL nav block and the back-links to existing pages
  - [x] Task 42.1. `modules/ROOT/nav.adoc`: `*** xref:graphics-games/webgl/index.adoc[WebGL]`, unlinked `****` group headings, one `*****` per page in outline order, last entry the cheat sheet
  - [x] Task 42.2. One-line back-links (and the updated paragraph where the spec says so) in the existing pages listed in spec part 3's "existing pages to link" table
- [x] Task 43. Verify PR 4: `npm run validate:mermaid`, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps on `build/site/graphics-games`, orphan-image check, admonition grep, PDF page count, `iru-gate-runner` security scan

  Group 9 result: pages webgl/index.adoc, cheat-sheet.adoc, whats-changed-since-older-guides.adoc; 4 SVGs (index timeline and stack, whats-changed before/after and removals); one-page A4 PDF; nav block; back-links; validate:mermaid (3064 parsed), Antora build with no warnings, CLAUDE.md greps clean, no orphan images, one admonition per page, 0 new secret findings.

### Group 10 — PR 5 / Metal pages (`graphics-games/metal/`, spec part 4)

Parallelizable: yes — every page is a new file; the running-example pages are independent

- [x] Task 44. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `whats-new-in-metal-4.adoc`, `setup-xcode-and-project.adoc`, `gpu-architecture-and-tbdr.adoc`, `math-for-3d.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 44.1. `metal/whats-new-in-metal-4.adoc` — Whats new in metal 4: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 44.2. `metal/setup-xcode-and-project.adoc` — Setup xcode and project: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 44.3. `metal/gpu-architecture-and-tbdr.adoc` — Gpu architecture and tbdr: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 44.4. `metal/math-for-3d.adoc` — Math for 3d: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 45. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `hello-triangle-metal4.adoc`, `metalkit-mtkview-and-swiftui.adoc`, `render-pipeline.adoc`, `msl-shading-language.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 45.1. `metal/hello-triangle-metal4.adoc` — Hello triangle metal4: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 45.2. `metal/metalkit-mtkview-and-swiftui.adoc` — Metalkit mtkview and swiftui: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 45.3. `metal/render-pipeline.adoc` — Render pipeline: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 45.4. `metal/msl-shading-language.adoc` — Msl shading language: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 46. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `buffers-vertex-descriptors.adoc`, `transforms-and-camera.adoc`, `textures-and-samplers.adoc`, `models-with-model-io-and-usd.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 46.1. `metal/buffers-vertex-descriptors.adoc` — Buffers vertex descriptors: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 46.2. `metal/transforms-and-camera.adoc` — Transforms and camera: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 46.3. `metal/textures-and-samplers.adoc` — Textures and samplers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 46.4. `metal/models-with-model-io-and-usd.adoc` — Models with model io and usd: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 47. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `lighting-fundamentals.adoc`, `pbr-materials.adoc`, `render-passes-and-load-store.adoc`, `shadows.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 47.1. `metal/lighting-fundamentals.adoc` — Lighting fundamentals: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 47.2. `metal/pbr-materials.adoc` — Pbr materials: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 47.3. `metal/render-passes-and-load-store.adoc` — Render passes and load store: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 47.4. `metal/shadows.adoc` — Shadows: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 48. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `deferred-and-tile-shading.adoc`, `synchronization-and-barriers.adoc`, `compute-kernels.adoc`, `particles.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 48.1. `metal/deferred-and-tile-shading.adoc` — Deferred and tile shading: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 48.2. `metal/synchronization-and-barriers.adoc` — Synchronization and barriers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 48.3. `metal/compute-kernels.adoc` — Compute kernels: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 48.4. `metal/particles.adoc` — Particles: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 49. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `image-processing-and-mps.adoc`, `argument-buffers-and-bindless.adoc`, `gpu-driven-rendering-icb.adoc`, `mesh-shaders.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 49.1. `metal/image-processing-and-mps.adoc` — Image processing and mps: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 49.2. `metal/argument-buffers-and-bindless.adoc` — Argument buffers and bindless: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 49.3. `metal/gpu-driven-rendering-icb.adoc` — Gpu driven rendering icb: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 49.4. `metal/mesh-shaders.adoc` — Mesh shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 50. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `tessellation.adoc`, `ray-tracing.adoc`, `image-based-lighting-and-hdr.adoc`, `metalfx-upscaling-and-frame-interpolation.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 50.1. `metal/tessellation.adoc` — Tessellation: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 50.2. `metal/ray-tracing.adoc` — Ray tracing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 50.3. `metal/image-based-lighting-and-hdr.adoc` — Image based lighting and hdr: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 50.4. `metal/metalfx-upscaling-and-frame-interpolation.adoc` — Metalfx upscaling and frame interpolation: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 51. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `machine-learning-in-metal-4.adoc`, `resource-loading-and-streaming.adoc`, `shader-compilation-and-pipeline-caching.adoc`, `debugging-and-profiling.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 51.1. `metal/machine-learning-in-metal-4.adoc` — Machine learning in metal 4: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 51.2. `metal/resource-loading-and-streaming.adoc` — Resource loading and streaming: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 51.3. `metal/shader-compilation-and-pipeline-caching.adoc` — Shader compilation and pipeline caching: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 51.4. `metal/debugging-and-profiling.adoc` — Debugging and profiling: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 52. Write 4 pages in `modules/ROOT/pages/graphics-games/metal/`: `performance-best-practices.adoc`, `metal-cpp-and-game-porting.adoc`, `metal-on-visionos.adoc`, `swiftui-shaders-and-realitykit-interop.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 52.1. `metal/performance-best-practices.adoc` — Performance best practices: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 52.2. `metal/metal-cpp-and-game-porting.adoc` — Metal cpp and game porting: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 52.3. `metal/metal-on-visionos.adoc` — Metal on visionos: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 52.4. `metal/swiftui-shaders-and-realitykit-interop.adoc` — Swiftui shaders and realitykit interop: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 53. Write 1 pages in `modules/ROOT/pages/graphics-games/metal/`: `migrating-from-opengl.adoc` (spec part 4: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 53.1. `metal/migrating-from-opengl.adoc` — Migrating from opengl: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

### Group 11 — PR 5 / Metal landing page, what's changed, cheat sheet, nav and back-links

Parallelizable: no — each task consumes the finished pages of the previous group

- [x] Task 54. Write `metal/whats-changed-since-older-guides.adoc` from the books' outdated statements (spec part 4, books table)
- [x] Task 55. Write `metal/index.adoc` for Metal and extend the section bibliography
  - [x] Task 55.1. Landing: what Metal is and its 2026 status, re-verified version baseline, learning path, grouped page list, coverage map of the official documentation areas and every book-concept row/"missing from the books" concept from spec part 4, `== References`, link to the section bibliography
  - [x] Task 55.2. `graphics-games/index.adoc`: add the Metal card and its bibliography entries (each book with author, title, edition, publisher, year, ISBN and publisher page, companion repositories, official docs, release notes, tools), opening Packt/O'Reilly URLs to confirm them
- [x] Task 56. Write `metal/cheat-sheet.adoc` and the one-page A4 PDF `modules/ROOT/attachments/graphics-games-metal-cheat-sheet.pdf`
  - [x] Task 56.1. Page following `data-science/cheat-sheet.adoc`: partial include, intro with the PDF `xref:attachment$...` link and baseline date, grouped `*Group* --` paragraphs of `xref:` to every Metal page, final download line, `== References`
  - [x] Task 56.2. PDF: render a throwaway HTML page with headless Chrome print-to-PDF (boxes listed in spec part 4), dense, multi-column, colour-coded, with small inline diagrams; confirm it is exactly one page (e.g. `mdls -name kMDItemNumberOfPages`); commit only the PDF
- [x] Task 57. Add the Metal nav block and the back-links to existing pages
  - [x] Task 57.1. `modules/ROOT/nav.adoc`: `*** xref:graphics-games/metal/index.adoc[Metal]`, unlinked `****` group headings, one `*****` per page in outline order, last entry the cheat sheet
  - [x] Task 57.2. One-line back-links (and the updated paragraph where the spec says so) in the existing pages listed in spec part 4's "existing pages to link" table
- [x] Task 58. Verify PR 5: `npm run validate:mermaid`, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps on `build/site/graphics-games`, orphan-image check, admonition grep, PDF page count, `iru-gate-runner` security scan

  - Group 11 done: 40 Metal pages, PDF one A4 page, full Antora build without warnings, mermaid validated (3082 diagrams), CLAUDE.md greps clean, secret scan 0 new findings.

### Group 12 — PR 6 / Vulkan pages (`graphics-games/vulkan/`, spec part 5)

Parallelizable: yes — every page is a new file; the running-example pages are independent

- [x] Task 59. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `versions-profiles-and-extensions.adoc`, `setup-sdk-and-toolchain.adoc`, `instance-loader-and-layers.adoc`, `validation-and-debug-utils.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 59.1. `vulkan/versions-profiles-and-extensions.adoc` — Versions profiles and extensions: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 59.2. `vulkan/setup-sdk-and-toolchain.adoc` — Setup sdk and toolchain: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 59.3. `vulkan/instance-loader-and-layers.adoc` — Instance loader and layers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 59.4. `vulkan/validation-and-debug-utils.adoc` — Validation and debug utils: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 60. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `physical-and-logical-devices.adoc`, `queues-and-command-buffers.adoc`, `window-system-integration-and-swapchain.adoc`, `synchronization-and-sync2.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 60.1. `vulkan/physical-and-logical-devices.adoc` — Physical and logical devices: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 60.2. `vulkan/queues-and-command-buffers.adoc` — Queues and command buffers: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 60.3. `vulkan/window-system-integration-and-swapchain.adoc` — Window system integration and swapchain: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 60.4. `vulkan/synchronization-and-sync2.adoc` — Synchronization and sync2: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 61. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `timeline-semaphores-and-frames-in-flight.adoc`, `memory-heaps-types-and-vma.adoc`, `buffers-images-and-views.adoc`, `shaders-spirv-and-shading-languages.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 61.1. `vulkan/timeline-semaphores-and-frames-in-flight.adoc` — Timeline semaphores and frames in flight: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 61.2. `vulkan/memory-heaps-types-and-vma.adoc` — Memory heaps types and vma: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 61.3. `vulkan/buffers-images-and-views.adoc` — Buffers images and views: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 61.4. `vulkan/shaders-spirv-and-shading-languages.adoc` — Shaders spirv and shading languages: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 62. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `descriptors-and-push-constants.adoc`, `bindless-descriptor-indexing-buffer-and-heap.adoc`, `shader-memory-layout.adoc`, `graphics-pipeline-overview.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 62.1. `vulkan/descriptors-and-push-constants.adoc` — Descriptors and push constants: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 62.2. `vulkan/bindless-descriptor-indexing-buffer-and-heap.adoc` — Bindless descriptor indexing buffer and heap: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 62.3. `vulkan/shader-memory-layout.adoc` — Shader memory layout: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 62.4. `vulkan/graphics-pipeline-overview.adoc` — Graphics pipeline overview: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 63. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `dynamic-rendering.adoc`, `dynamic-state-shader-objects-and-pipeline-libraries.adoc`, `vertex-input-and-drawing.adoc`, `depth-stencil-blending-and-msaa.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 63.1. `vulkan/dynamic-rendering.adoc` — Dynamic rendering: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 63.2. `vulkan/dynamic-state-shader-objects-and-pipeline-libraries.adoc` — Dynamic state shader objects and pipeline libraries: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 63.3. `vulkan/vertex-input-and-drawing.adoc` — Vertex input and drawing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 63.4. `vulkan/depth-stencil-blending-and-msaa.adoc` — Depth stencil blending and msaa: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 64. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `textures-samplers-and-mipmaps.adoc`, `tessellation-and-geometry-shaders.adoc`, `compute-shaders-and-subgroups.adoc`, `mesh-and-task-shaders.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 64.1. `vulkan/textures-samplers-and-mipmaps.adoc` — Textures samplers and mipmaps: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 64.2. `vulkan/tessellation-and-geometry-shaders.adoc` — Tessellation and geometry shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 64.3. `vulkan/compute-shaders-and-subgroups.adoc` — Compute shaders and subgroups: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 64.4. `vulkan/mesh-and-task-shaders.adoc` — Mesh and task shaders: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 65. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `ray-tracing.adoc`, `vulkan-video.adoc`, `multithreading-and-performance.adoc`, `debugging-and-capture-tools.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 65.1. `vulkan/ray-tracing.adoc` — Ray tracing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 65.2. `vulkan/vulkan-video.adoc` — Vulkan video: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 65.3. `vulkan/multithreading-and-performance.adoc` — Multithreading and performance: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 65.4. `vulkan/debugging-and-capture-tools.adoc` — Debugging and capture tools: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 66. Write 4 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `vulkan-on-android.adoc`, `vulkan-on-apple-moltenvk-and-kosmickrisp.adoc`, `vulkan-sc-and-embedded.adoc`, `vulkan-hpp-raii-and-cpp-bindings.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 66.1. `vulkan/vulkan-on-android.adoc` — Vulkan on android: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 66.2. `vulkan/vulkan-on-apple-moltenvk-and-kosmickrisp.adoc` — Vulkan on apple moltenvk and kosmickrisp: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 66.3. `vulkan/vulkan-sc-and-embedded.adoc` — Vulkan sc and embedded: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 66.4. `vulkan/vulkan-hpp-raii-and-cpp-bindings.adoc` — Vulkan hpp raii and cpp bindings: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 67. Write 2 pages in `modules/ROOT/pages/graphics-games/vulkan/`: `bookshelf-01-triangle-to-textured-book.adoc`, `bookshelf-02-scene-and-game.adoc` (spec part 5: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 67.1. `vulkan/bookshelf-01-triangle-to-textured-book.adoc` — Bookshelf 01 triangle to textured book: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 67.2. `vulkan/bookshelf-02-scene-and-game.adoc` — Bookshelf 02 scene and game: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

### Group 13 — PR 6 / Vulkan landing page, what's changed, cheat sheet, nav and back-links

Parallelizable: no — each task consumes the finished pages of the previous group

- [x] Task 68. Write `vulkan/whats-changed-since-older-guides.adoc` from the books' outdated statements (spec part 5, books table)
- [x] Task 69. Write `vulkan/index.adoc` for Vulkan and extend the section bibliography
  - [x] Task 69.1. Landing: what Vulkan is and its 2026 status, re-verified version baseline, learning path, grouped page list, coverage map of the official documentation areas and every book-concept row/"missing from the books" concept from spec part 5, `== References`, link to the section bibliography
  - [x] Task 69.2. `graphics-games/index.adoc`: add the Vulkan card and its bibliography entries (each book with author, title, edition, publisher, year, ISBN and publisher page, companion repositories, official docs, release notes, tools), opening Packt/O'Reilly URLs to confirm them
- [x] Task 70. Write `vulkan/cheat-sheet.adoc` and the one-page A4 PDF `modules/ROOT/attachments/graphics-games-vulkan-cheat-sheet.pdf`
  - [x] Task 70.1. Page following `data-science/cheat-sheet.adoc`: partial include, intro with the PDF `xref:attachment$...` link and baseline date, grouped `*Group* --` paragraphs of `xref:` to every Vulkan page, final download line, `== References`
  - [x] Task 70.2. PDF: render a throwaway HTML page with headless Chrome print-to-PDF (boxes listed in spec part 5), dense, multi-column, colour-coded, with small inline diagrams; confirm it is exactly one page (e.g. `mdls -name kMDItemNumberOfPages`); commit only the PDF
- [x] Task 71. Add the Vulkan nav block and the back-links to existing pages
  - [x] Task 71.1. `modules/ROOT/nav.adoc`: `*** xref:graphics-games/vulkan/index.adoc[Vulkan]`, unlinked `****` group headings, one `*****` per page in outline order, last entry the cheat sheet
  - [x] Task 71.2. One-line back-links (and the updated paragraph where the spec says so) in the existing pages listed in spec part 5's "existing pages to link" table
- [x] Task 72. Verify PR 6: `npm run validate:mermaid`, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps on `build/site/graphics-games`, orphan-image check, admonition grep, PDF page count, `iru-gate-runner` security scan

### Group 14 — PR 7 / Unity pages (`graphics-games/unity/`, spec part 6)

Parallelizable: yes — every page is a new file; the running-example pages are independent

- [x] Task 73. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `licensing-and-pricing.adoc`, `getting-started-hub-and-editor.adoc`, `gameobjects-components-and-transforms.adoc`, `csharp-scripting-and-monobehaviour-lifecycle.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 73.1. `unity/licensing-and-pricing.adoc` — Licensing and pricing: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 73.2. `unity/getting-started-hub-and-editor.adoc` — Getting started hub and editor: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 73.3. `unity/gameobjects-components-and-transforms.adoc` — Gameobjects components and transforms: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 73.4. `unity/csharp-scripting-and-monobehaviour-lifecycle.adoc` — Csharp scripting and monobehaviour lifecycle: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 74. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `prefabs-and-scenes.adoc`, `scriptableobjects-and-data-driven-design.adoc`, `project-architecture-and-design-patterns.adoc`, `input-system.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 74.1. `unity/prefabs-and-scenes.adoc` — Prefabs and scenes: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 74.2. `unity/scriptableobjects-and-data-driven-design.adoc` — Scriptableobjects and data driven design: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 74.3. `unity/project-architecture-and-design-patterns.adoc` — Project architecture and design patterns: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 74.4. `unity/input-system.adoc` — Input system: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 75. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `physics-3d.adoc`, `physics-2d.adoc`, `cameras-and-cinemachine.adoc`, `navigation-and-ai.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 75.1. `unity/physics-3d.adoc` — Physics 3d: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 75.2. `unity/physics-2d.adoc` — Physics 2d: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 75.3. `unity/cameras-and-cinemachine.adoc` — Cameras and cinemachine: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 75.4. `unity/navigation-and-ai.adoc` — Navigation and ai: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 76. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `saving-loading-and-networking-http.adoc`, `render-pipelines-overview.adoc`, `urp-in-depth.adoc`, `render-graph-and-custom-passes.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 76.1. `unity/saving-loading-and-networking-http.adoc` — Saving loading and networking http: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 76.2. `unity/render-pipelines-overview.adoc` — Render pipelines overview: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 76.3. `unity/urp-in-depth.adoc` — Urp in depth: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 76.4. `unity/render-graph-and-custom-passes.adoc` — Render graph and custom passes: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 77. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `materials-textures-and-lighting.adoc`, `shader-graph-and-hlsl.adoc`, `particles-and-vfx-graph.adoc`, `hdrp-overview.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 77.1. `unity/materials-textures-and-lighting.adoc` — Materials textures and lighting: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 77.2. `unity/shader-graph-and-hlsl.adoc` — Shader graph and hlsl: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 77.3. `unity/particles-and-vfx-graph.adoc` — Particles and vfx graph: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 77.4. `unity/hdrp-overview.adoc` — Hdrp overview: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 78. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `2d-games.adoc`, `animation-mecanim.adoc`, `timeline-and-cutscenes.adoc`, `audio.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 78.1. `unity/2d-games.adoc` — 2d games: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 78.2. `unity/animation-mecanim.adoc` — Animation mecanim: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 78.3. `unity/timeline-and-cutscenes.adoc` — Timeline and cutscenes: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 78.4. `unity/audio.adoc` — Audio: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 79. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `ui-toolkit.adoc`, `ugui-and-textmeshpro.adoc`, `assets-addressables-and-content.adoc`, `dots-ecs-jobs-and-burst.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 79.1. `unity/ui-toolkit.adoc` — Ui toolkit: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 79.2. `unity/ugui-and-textmeshpro.adoc` — Ugui and textmeshpro: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 79.3. `unity/assets-addressables-and-content.adoc` — Assets addressables and content: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 79.4. `unity/dots-ecs-jobs-and-burst.adoc` — Dots ecs jobs and burst: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 80. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `multiplayer-and-netcode.adoc`, `build-profiles-and-platforms.adoc`, `web-and-webgpu.adoc`, `xr-development.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 80.1. `unity/multiplayer-and-netcode.adoc` — Multiplayer and netcode: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 80.2. `unity/build-profiles-and-platforms.adoc` — Build profiles and platforms: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 80.3. `unity/web-and-webgpu.adoc` — Web and webgpu: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 80.4. `unity/xr-development.adoc` — Xr development: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 81. Write 4 pages in `modules/ROOT/pages/graphics-games/unity/`: `profiling-and-optimization.adoc`, `testing-and-ci.adoc`, `editor-scripting-and-tooling.adoc`, `asset-store-and-packages.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 81.1. `unity/profiling-and-optimization.adoc` — Profiling and optimization: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 81.2. `unity/testing-and-ci.adoc` — Testing and ci: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 81.3. `unity/editor-scripting-and-tooling.adoc` — Editor scripting and tooling: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 81.4. `unity/asset-store-and-packages.adoc` — Asset store and packages: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 82. Write 1 pages in `modules/ROOT/pages/graphics-games/unity/`: `unity-ai-and-ml.adoc` (spec part 6: outline entry, official sources, ★ marks, figure suggestions and book coverage per page)
  - [x] Task 82.1. `unity/unity-ai-and-ml.adoc` — Unity ai and ml: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

Group 14 validated: 37 pages and 139 figures in `graphics-games/unity/`; every star page has at least 4 figures; full Antora build clean, CLAUDE.md image and inline-code greps, rendered-text scan and `validate:mermaid` all pass.

### Group 15 — PR 7 / Unity landing page, what's changed, cheat sheet, nav and back-links

Parallelizable: no — each task consumes the finished pages of the previous group

- [x] Task 83. Write `unity/whats-changed-since-older-guides.adoc` from the books' outdated statements (spec part 6, books table) — done: book-by-book migration tables, upgrade procedure, 4 figures.
- [x] Task 84. Write `unity/index.adoc` for Unity and extend the section bibliography — done: 4 figures, baseline re-verified 2026-11-05 (Hub 3.22.5, 6.6 announced 2026-09-01, 7.0 alpha 2026-10-05).
  - [x] Task 84.1. Landing: what Unity is and its 2026 status, re-verified version baseline, learning path, grouped page list, coverage map of the official documentation areas and every book-concept row/"missing from the books" concept from spec part 6, `== References`, link to the section bibliography
  - [x] Task 84.2. `graphics-games/index.adoc`: add the Unity card and its bibliography entries (each book with author, title, edition, publisher, year, ISBN and publisher page, companion repositories, official docs, release notes, tools), opening Packt/O'Reilly URLs to confirm them
- [x] Task 85. Write `unity/cheat-sheet.adoc` and the one-page A4 PDF `modules/ROOT/attachments/graphics-games-unity-cheat-sheet.pdf` — done: PDF is exactly one A4 page by its page tree.
  - [x] Task 85.1. Page following `data-science/cheat-sheet.adoc`: partial include, intro with the PDF `xref:attachment$...` link and baseline date, grouped `*Group* --` paragraphs of `xref:` to every Unity page, final download line, `== References`
  - [x] Task 85.2. PDF: render a throwaway HTML page with headless Chrome print-to-PDF (boxes listed in spec part 6), dense, multi-column, colour-coded, with small inline diagrams; confirm it is exactly one page (e.g. `mdls -name kMDItemNumberOfPages`); commit only the PDF
- [x] Task 86. Add the Unity nav block and the back-links to existing pages
  - [x] Task 86.1. `modules/ROOT/nav.adoc`: `*** xref:graphics-games/unity/index.adoc[Unity]`, unlinked `****` group headings, one `*****` per page in outline order, last entry the cheat sheet
  - [x] Task 86.2. One-line back-links (and the updated paragraph where the spec says so) in the existing pages listed in spec part 6's "existing pages to link" table
- [x] Task 87. Verify PR 7: `npm run validate:mermaid`, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps on `build/site/graphics-games`, orphan-image check, admonition grep, PDF page count, `iru-gate-runner` security scan

### Group 16 — PR 8 / Unreal Engine pages (`graphics-games/unreal-engine/`, spec part 7)

Parallelizable: yes — every page is a new file; the running-example pages are independent

- [x] Task 88. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `versions-licensing-and-history.adoc`, `installing-and-building-from-source.adoc`, `editor-tour.adoc`, `project-structure-and-modules.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 10 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 88.1. `unreal-engine/versions-licensing-and-history.adoc` — Versions licensing and history: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 88.2. `unreal-engine/installing-and-building-from-source.adoc` — Installing and building from source: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 88.3. `unreal-engine/editor-tour.adoc` — Editor tour: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 88.4. `unreal-engine/project-structure-and-modules.adoc` — Project structure and modules: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 89. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `uobject-reflection-and-garbage-collection.adoc`, `actors-and-components.adoc`, `gameplay-framework.adoc`, `blueprints-visual-scripting.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 15 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 89.1. `unreal-engine/uobject-reflection-and-garbage-collection.adoc` — Uobject reflection and garbage collection: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 89.2. `unreal-engine/actors-and-components.adoc` — Actors and components: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 89.3. `unreal-engine/gameplay-framework.adoc` — Gameplay framework: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 89.4. `unreal-engine/blueprints-visual-scripting.adoc` — Blueprints visual scripting: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 90. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `blueprint-communication.adoc`, `cpp-and-blueprints-together.adoc`, `unreal-cpp-idioms.adoc`, `enhanced-input.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 13 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 90.1. `unreal-engine/blueprint-communication.adoc` — Blueprint communication: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 90.2. `unreal-engine/cpp-and-blueprints-together.adoc` — Cpp and blueprints together: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 90.3. `unreal-engine/unreal-cpp-idioms.adoc` — Unreal cpp idioms: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 90.4. `unreal-engine/enhanced-input.adoc` — Enhanced input: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 91. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `data-driven-gameplay.adoc`, `rendering-overview.adoc`, `materials-and-material-editor.adoc`, `lighting-lumen-and-megalights.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 16 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 91.1. `unreal-engine/data-driven-gameplay.adoc` — Data driven gameplay: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 91.2. `unreal-engine/rendering-overview.adoc` — Rendering overview: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 91.3. `unreal-engine/materials-and-material-editor.adoc` — Materials and material editor: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 91.4. `unreal-engine/lighting-lumen-and-megalights.adoc` — Lighting lumen and megalights: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 92. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `nanite-and-virtual-geometry.adoc`, `niagara-vfx.adoc`, `post-processing-and-cameras.adoc`, `animation-blueprints-and-state-machines.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 13 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 92.1. `unreal-engine/nanite-and-virtual-geometry.adoc` — Nanite and virtual geometry: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 92.2. `unreal-engine/niagara-vfx.adoc` — Niagara vfx: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 92.3. `unreal-engine/post-processing-and-cameras.adoc` — Post processing and cameras: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 92.4. `unreal-engine/animation-blueprints-and-state-machines.adoc` — Animation blueprints and state machines: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 93. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `control-rig-and-motion-matching.adoc`, `sequencer-cinematics.adoc`, `chaos-physics-and-collision.adoc`, `world-partition-and-pcg.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 15 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 93.1. `unreal-engine/control-rig-and-motion-matching.adoc` — Control rig and motion matching: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 93.2. `unreal-engine/sequencer-cinematics.adoc` — Sequencer cinematics: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 93.3. `unreal-engine/chaos-physics-and-collision.adoc` — Chaos physics and collision: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 93.4. `unreal-engine/world-partition-and-pcg.adoc` — World partition and pcg: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 94. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `umg-slate-and-commonui.adoc`, `ai-navigation-and-perception.adoc`, `behavior-trees-and-statetree.adoc`, `mass-entity.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 15 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 94.1. `unreal-engine/umg-slate-and-commonui.adoc` — Umg slate and commonui: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 94.2. `unreal-engine/ai-navigation-and-perception.adoc` — Ai navigation and perception: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 94.3. `unreal-engine/behavior-trees-and-statetree.adoc` — Behavior trees and statetree: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 94.4. `unreal-engine/mass-entity.adoc` — Mass entity: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 95. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `gameplay-ability-system.adoc`, `networking-and-replication.adoc`, `audio-metasounds.adoc`, `packaging-desktop.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 15 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 95.1. `unreal-engine/gameplay-ability-system.adoc` — Gameplay ability system: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 95.2. `unreal-engine/networking-and-replication.adoc` — Networking and replication: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 95.3. `unreal-engine/audio-metasounds.adoc` — Audio metasounds: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 95.4. `unreal-engine/packaging-desktop.adoc` — Packaging desktop: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
- [x] Task 96. Write 4 pages in `modules/ROOT/pages/graphics-games/unreal-engine/`: `android-and-mobile.adoc`, `profiling-and-optimization.adoc`, `testing-and-automation.adoc`, `verse-uefn-and-ue6-context.adoc` (spec part 7: outline entry, official sources, ★ marks, figure suggestions and book coverage per page) — done: 4 pages, 14 SVGs; build, image/inline-code greps, rendered-text scan and Mermaid validation clean
  - [x] Task 96.1. `unreal-engine/android-and-mobile.adoc` — Android and mobile: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 96.2. `unreal-engine/profiling-and-optimization.adoc` — Profiling and optimization: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 96.3. `unreal-engine/testing-and-automation.adoc` — Testing and automation: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include
  - [x] Task 96.4. `unreal-engine/verse-uefn-and-ue6-context.adoc` — Verse uefn and ue6 context: detailed concept explanation, complete code with a source link after each example, >=2 figures (>=4 if ★), `== References`, disclaimer include

### Group 17 — PR 8 / Unreal Engine landing page, what's changed, cheat sheet, nav and back-links

Parallelizable: no — each task consumes the finished pages of the previous group

- [x] Task 97. Write `unreal-engine/whats-changed-since-older-guides.adoc` from the books' outdated statements (spec part 7, books table)
- [x] Task 98. Write `unreal-engine/index.adoc` for Unreal Engine and extend the section bibliography
  - [x] Task 98.1. Landing: what Unreal Engine is and its 2026 status, re-verified version baseline, learning path, grouped page list, coverage map of the official documentation areas and every book-concept row/"missing from the books" concept from spec part 7, `== References`, link to the section bibliography
  - [x] Task 98.2. `graphics-games/index.adoc`: add the Unreal Engine card and its bibliography entries (each book with author, title, edition, publisher, year, ISBN and publisher page, companion repositories, official docs, release notes, tools), opening Packt/O'Reilly URLs to confirm them
- [x] Task 99. Write `unreal-engine/cheat-sheet.adoc` and the one-page A4 PDF `modules/ROOT/attachments/graphics-games-unreal-engine-cheat-sheet.pdf`
  - [x] Task 99.1. Page following `data-science/cheat-sheet.adoc`: partial include, intro with the PDF `xref:attachment$...` link and baseline date, grouped `*Group* --` paragraphs of `xref:` to every Unreal Engine page, final download line, `== References`
  - [x] Task 99.2. PDF: render a throwaway HTML page with headless Chrome print-to-PDF (boxes listed in spec part 7), dense, multi-column, colour-coded, with small inline diagrams; confirm it is exactly one page (e.g. `mdls -name kMDItemNumberOfPages`); commit only the PDF
- [x] Task 100. Add the Unreal Engine nav block and the back-links to existing pages
  - [x] Task 100.1. `modules/ROOT/nav.adoc`: `*** xref:graphics-games/unreal-engine/index.adoc[Unreal Engine]`, unlinked `****` group headings, one `*****` per page in outline order, last entry the cheat sheet
  - [x] Task 100.2. One-line back-links (and the updated paragraph where the spec says so) in the existing pages listed in spec part 7's "existing pages to link" table
- [x] Task 101. Verify PR 8: `npm run validate:mermaid`, `npx antora antora-playbook.yml`, the `CLAUDE.md` greps on `build/site/graphics-games`, orphan-image check, admonition grep, PDF page count, `iru-gate-runner` security scan — clean build with no warnings, 3183 Mermaid diagrams parsed, greps, orphan, admonition and backtick checks clean, PDF one A4 page, 0 new secret findings (394 total, all labelled).

### Group 18 — Final integration (after all PRs' pages exist)

Parallelizable: no — consumes every library's pages and PDFs

- [x] Task 102. Write `graphics-games/cheat-sheet.adoc` and `graphics-games-cheat-sheet.pdf` (one A4 page); link all six library PDFs — `graphics-games/cheat-sheet.adoc`, `attachments/graphics-games-cheat-sheet.pdf` (1 A4 page), nav entry added; no test framework in this docs repo.
  - [x] Task 102.1. Placed last because it must `xref:` pages from every sub-section; the issue lists it in PR 2, but that would leave broken xrefs until the libraries land
- [x] Task 103. Add the "See it in" lines to the general concept pages, linking the matching page in each sub-section, and complete the section landing page (library cards, learning path, full coverage map) — 25 pages with "See it in" (158 links), landing page completed, follow-ups a-h fixed.
- [x] Task 104. Final build: full `npx antora antora-playbook.yml` with no warnings, every `CLAUDE.md` verification grep, `npm run validate:mermaid`, page counts (general 29, OpenGL 41, WebGL 32, Metal 40, Vulkan 37, Unity 40, Unreal 39 = 258), 7 PDFs of exactly one page, no book file committed, every *unverified* spec item verified or removed, nav renders under Guides & References — all checks pass; clean Antora build, 3183 Mermaid diagrams parsed.
