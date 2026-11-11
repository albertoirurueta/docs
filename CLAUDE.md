# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This repo has no application source code — it is the **Antora playbook and root component** for the
"Irurueta Docs" documentation site (https://albertoirurueta.github.io/docs), which aggregates the Antora
documentation modules of several *other* GitHub repositories into a single published site.

## Commands

Requires Node.js (v24 in CI; see README.md for `nvm` install steps).

```bash
npm install                              # install antora + extensions (see package.json)
npx antora antora-playbook.yml           # build the site into build/site (local content only)
npx antora --fetch antora-playbook.yml   # same, but first fetch latest branches of remote content sources
```

There is no lint/test suite — the only meaningful verification is that the Antora build completes without
`xref`/AsciiDoc errors and that `build/site` renders correctly. `build/` is gitignored (generated output only).
The helper scripts below are plain Node scripts (no build step) that audit or generate content under `modules/`:

```bash
npm run audit:index-template   # check the `==` heading order of every section/subsection index.adoc (0 violations)
npm run cards                  # regenerate card-*/ide-*/download SVGs, restyle home cards, refresh grids and buttons
npm run test:cards             # card structure, palette, up-to-date, orphan, IDE-grid and download-button checks
npm run cheat-sheets [name]    # render one-page cheat-sheet PDFs from scripts/cheat-sheet-pdfs/sheets/
npm run validate:mermaid       # needs a one-off `npm i --no-save mermaid@11 jsdom` (see Mermaid diagrams)
node scripts/cards/insert-grids.mjs        # insert/refresh the card grid of every section index (part of npm run cards)
node scripts/disclaimers/traceability.mjs  # disclaimer consolidation check (see Disclaimer below)
```

## Architecture

- **`antora-playbook.yml`** is the site definition. Its `content.sources` list is the core of this repo: one
  entry is `url: .` (this repo's own local component, see below), and the rest are remote GitHub repos
  (`hermes`, `irurueta-units`, `irurueta-statistics`, `irurueta-sorting`, `irurueta-algebra`,
  `irurueta-numerical`, `irurueta-geometry`, `irurueta-geometry-io`, `irurueta-ar`, `irurueta-navigation`,
  `irurueta-navigation-indoor`, `irurueta-navigation-inertial`, `irurueta-navigation-inertial-extra`,
  `ai-catalog` and `irurueta-auth-server`), each pointed at a `start_path: docs` and a branch-glob pattern (e.g. `release_1.{4..99}*`) so only
  tagged release branches of each dependent repo are pulled in (`ai-catalog` and `irurueta-auth-server` track
  `main`; `irurueta-auth-server` does so until its 1.0.0 release). **Adding/removing a documented project means
  editing this file's `content.sources` list**, not writing new pages here.
- The playbook also wires up the UI (`ui-bundle.zip`, a custom Antora UI bundle used with `snapshot: true`) and
  Antora/Asciidoctor extensions: `@sntke/antora-mermaid-extension` (`[mermaid]` diagram blocks) and
  `@djencks/asciidoctor-mathjax` (LaTeX math) are active, and so is
  `@antora/collector-extension`, which the site now depends on: the `irurueta-auth-server` example's
  `docs/antora.yml` uses `ext.collector` to populate its `example$` family, and the pages' includes fail without
  it. `@antora/lunr-extension` (site search) is
  currently commented out, so site search is disabled. Any doc content using diagrams or math depends on the
  active extensions staying configured here.
- **Math needs `:stem: latexmath` in the page header** and is written as `stem:[…]` inline or as a `[stem]` block
  delimited by `++++`. Bare `\( \)` / `\[ \]` in the AsciiDoc source are not converted and render as raw LaTeX, and the
  Antora build reports nothing. Braces inside LaTeX that look like `{name}` attributes trigger "missing attribute"
  warnings, so check the build output and the rendered page.
- **The nav panel renders its top-level groups expanded by default** through a UI override: `antora-playbook.yml`
  `ui.supplemental_files` maps `partials/nav-tree.hbs` to `ui-overrides/partials/nav-tree.hbs`, a copy of the
  bundle's `nav-tree` partial (extracted from `ui-bundle.zip`, which stays unmodified) with two additions: an item is
  rendered with `is-active` when it is at depth 0 or its parent asked for open children, and the children of an
  untitled list wrapper and of the "Open Source Projects" group are open. The bundle's `site.js` toggles and the
  "toggle all" button only flip `is-active`, so they keep working. Keep the override in step with the bundle's own
  partial when the bundle is rebuilt (issue #255 will fold it into the bundle source). Nav entries must follow the
  same order and the same titles as the section index's text list. **Nav entries never link to a `#fragment`**: on
  the target page that link renders as `href="#..."`, which makes the bundle's `site.js` hash handler strip every
  `is-active` class and collapse the default-open groups. The override also matches the top-level entry text
  `Open Source Projects` exactly, so renaming it needs the same change in the override. `npm run test:cards` checks both.
- **`antora.yml`** declares this repo's own Antora component, named `ROOT`, whose nav is
  `modules/ROOT/nav.adoc`. This is the site's landing/root component — its pages don't describe this repo, they
  describe the overall site and link out to each remote component.
- **`modules/ROOT/nav.adoc`** and **`modules/ROOT/pages/index.adoc`** form the site home page: a project
  picker that cross-references each remote component's own `index.adoc` via `xref:<component>::index.adoc[]`
  syntax (e.g. `xref:irurueta-algebra::index.adoc[]`), with a matching icon in `modules/ROOT/images/` (which also
  holds the content figures for every guide, not just the project-picker icons).
  **Adding a new project to the picker means: an image in `modules/ROOT/images/`, a nav entry, and an `xref:`
  block in `index.adoc`** — in addition to the `content.sources` entry above.
- **CI** (`.github/workflows/publish.yml` on a nightly cron, `.github/workflows/manual_publish.yml` on
  `workflow_dispatch`) both run the same steps: install Antora + its four extensions, `npx antora
  antora-playbook.yml`, then deploy `build/site` to the `gh-pages` branch via `crazy-max/ghaction-github-pages`.
  Because the remote content sources track release branches, a fresh build can pick up newly published releases
  from any of the dependent repos without any change in this repo.

## Disclaimer, index templates and cards

- **One shared disclaimer.** Every page except the home page (`modules/ROOT/pages/index.adoc`) includes
  `include::partial$ai-disclaimer.adoc[]` directly after its header, and no per-topic disclaimer partials exist any
  more (`modules/ROOT/partials/ai-disclaimer.adoc` is the only `*disclaimer*` partial). Anything a topic-specific
  disclaimer used to say (legacy status, versions, "not legal advice", ...) lives in the page body or in the
  subsection index's `== Version baseline`, never in a new partial. New pages copy the include line from a sibling.
  `scripts/disclaimers/` holds the one-off consolidation tooling: `inventory.mjs` (lists disclaimer partials, their
  non-AI content and including pages), `relocate.mjs` (moved that content and switched pages to the shared include,
  writing `relocation-map.json`) and `traceability.mjs` (fails when a relocated version or caveat sentence has no
  destination; `--ref <git-rev>` also checks that every partial present at that revision is in the map).
  `relocate.mjs` refuses to run now that the per-topic partials are gone, so the committed map is the record. When a
  relocated sentence is later rewritten on purpose (for example a version baseline that moves to a newer release),
  update its `text` in `relocation-map.json` and keep the old wording in a `superseded` field.
- **Index templates.** Every `index.adoc` of a section (`<section>/index.adoc`) and of a subsection
  (`<section>/<subsection>/index.adoc`) uses a fixed `==` heading order, audited by `npm run audit:index-template`
  (`scripts/index-template/audit.mjs`, `--list`/`--json` for details; it must report 0 with violations). Nested
  indexes one level deeper (`<section>/<subsection>/<topic>/index.adoc`) are outside the template: the audit lists
  them as warnings only (`--strict` makes them fail). Section
  index: `Sections`, `Related material on this site`, `Bibliography`, `References` (optional ones may be absent, the order
  never changes). Subsection index: `Version baseline`, `What's covered`, `Reading path`, `Running example`, `Related
  material on this site`, `Bibliography`, `References`. Use these exact names (no "Reading order", "Learning path"
  and the like) and update `#_anchor` xrefs when a heading is renamed. Long conceptual content of a section index
  (what the area is, targeted versions, learning path, concept-to-page map) goes in a sibling `<section>/overview.adoc`
  (beside any `comparison.adoc`), linked from the index intro and as the first nav entry of the section; the index
  keeps only the intro, the card grid and the template sections.
- **Section cards.** Each section index shows a three-column card grid (the home page's table/card pattern) with one
  `image::card-<section>-<subsection>.svg[...]` per subsection, in the same order and with the same titles as the
  index's `== Sections` text list and the nav. Cards are 600x600 SVG files in `modules/ROOT/images/` generated by
  `scripts/cards/`, never drawn by hand: `manifest.mjs` (one entry per subsection or comparison page, section
  gradients, logo key), `extract-logos.mjs` (reads logo path data into `logos.json` from the Simple Icons and Devicon
  npm packages, treated as untrusted input), `generate-cards.mjs` (`npm run cards`; also rewrites `LOGO-SOURCES.md`),
  `insert-grids.mjs` (inserts/refreshes each section's grid between the intro and `== Sections`) and
  `generate-cards.test.mjs` (`npm run test:cards`). Logos are white monochrome marks from Simple Icons (CC0-1.0, key
  `si:<slug>`) or Devicon (MIT, `dv:<slug>`); where neither has the mark, or the owner is not represented (Java,
  AWS, Microsoft products), a drawn white-line glyph (`gl:<name>`) is used and no trademark is redrawn.
  `LOGO-SOURCES.md` lists the source and licence of every card and the home page carries the trademark notice.
  **Adding a subsection means a manifest entry, then `npm run cards` and `npm run test:cards`**, plus the nav entry
  and the `== Sections` text entry.
- **One palette for every card-like SVG.** `scripts/cards/palette.mjs` derives all colours from the UI bundle's
  animated top bar (`--navbar-background1/2/3`: `#ff6ec4`, `#7873f5`, `#4ade80`, the green one step deeper at a
  gradient's end so white text stays legible). It defines six diagonal three-stop variants and assigns one per
  section (`sectionVariant`) and per non-section group (`otherVariant`: Java projects, AI catalog, auth server, IDE
  cards). All cards share one template in `generate-cards.mjs`: gradient, soft highlight, dark lower scrim, a
  translucent logo disc, and a white pill button with indigo text ("Explore", or "Visit" for external links). Never
  hand-pick a colour in an SVG: change the palette and run `npm run cards`. The 30 hand-made home page cards
  (`home-cards.mjs`) keep their hand-drawn logo and text layout. `npm run cards` only re-applies the palette to them
  (`restyle()`), so a new home card must keep the house structure: logo at (300,170), the button `rect` at
  `y="44x"` followed by its `text`.
- **IDE cards.** Every product link on an `ides-and-tools.adoc` page (`* https://...[*<name>*] -- description`)
  also shows as a card. Each `==` group gets a three-column grid, inserted before its list by
  `scripts/cards/insert-ide-grids.mjs`, with cells `image::ide-<slug>.svg["<name>",link="<url>"]`. The text list
  stays. Cards come from `ide-manifest.mjs`, one per product, with aliases for name variants on different pages.
  Microsoft products get a glyph, and a VS Code extension shows the logo of the language it supports, never the
  editor's. **A new product link means a manifest entry (and its logo in `logos.json` via `extract-logos.mjs`),
  then `npm run cards`.** The tests fail on a link without a card and on an unused card.
- **Cheat-sheet download button.** `download-cheat-sheet-pdf.svg` is the one download button for every
  `cheat-sheet*.adoc` page. `scripts/cards/insert-download-buttons.mjs` moves the page's main PDF
  (`xref:attachment$<x>.pdf[Download ...]`) to a block button right after the introduction, written as
  `image::download-cheat-sheet-pdf.svg["<label>",width=320,xref=attachment$<x>.pdf]`. It also turns any other
  standalone "Download ..." line into a button in place, turns a table cell holding only a download link into an
  inline `image:` button, and removes a `== Download` section left empty. Links in running text stay as text. A
  new cheat sheet with a PDF gets the button from `npm run cards`. A cheat sheet without a PDF in
  `modules/ROOT/attachments/` gets none, and the script lists those pages.
- **Cheat-sheet PDFs.** A cheat sheet's printable PDF is a single A4 page in the house layout: title, subtitle with
  the version baseline and "AI-generated summary — verify against …", a three-column grid of tinted boxes, and a
  footer. Older PDFs were rendered by hand, so their sources are not in the repository. New ones are rendered by
  `scripts/cheat-sheet-pdfs/render.mjs` (`npm run cheat-sheets [name]`) from a content module in
  `scripts/cheat-sheet-pdfs/sheets/<name>.mjs` (`file`, `title`, `subtitle`, `footer`, 6–12 `boxes` of
  `{ title, color, items: [{ label, code | text }] }`, code lines ≤ 44 characters, the column width) through headless Chrome. The run
  fails if a sheet spills onto a second page. The content condenses the cheat-sheet page, so it is never written
  from memory. Link the PDF from the page with `xref:attachment$<file>[Download the <Name> Cheat Sheet (PDF)]`, then
  run `npm run cards` to turn the link into the top button. Check with `npm run test:cheat-sheets`.
- **Nav titles and order.** The nav (`modules/ROOT/nav.adoc` and the `partials/nav-<name>.adoc` includes) uses bare
  product or topic names ("Java", "JavaScript", "Spring Boot", "MongoDB"; no "Reference"/"Development" suffix, no
  "Python " prefix, no parenthetical expansion such as "AWS (Amazon Web Services)"), and the nav entry, the card
  title and the index link text are the same string (`npm run test:cards` checks it; a title too long for one line is
  drawn on two lines, never abbreviated). Nav order equals
  the card order equals the order of the section's text list; the home page lists "Guides & References" before
  "Open Source Projects", with "About me" last.

## Monitoring guides (Grafana and Kibana step-by-step)

- **What they are.** `modules/ROOT/pages/backend/monitoring-alerting/grafana/` and `kibana/` hold 20 and 19 hands-on pages
  named `guide-<name>.adoc` (the `guide-` prefix marks them; reference pages never carry it). They run in the lab under
  `modules/ROOT/examples/monitoring-alerting-lab/` and are linked from the nav (a **Step-by-step guides** group after
  **Getting started**), from each subsection's `== Reading path`, and by a one-line pointer
  (`To do this by hand, follow xref:...[guide title].`) right after the `Checked on` line of each reference page they
  exercise. Nav entries, index text and page titles agree (title minus the "Grafana Guide:"/"Kibana Guide:" prefix).
- **Guide template.** Header (`:description:`, `:keywords:`), `include::partial$ai-disclaimer.adoc[]`, a
  `Checked on <date> against Grafana 13.3.x|Kibana 9.5.x` line, then exactly these `==` headings in order: `What you
  build`, `Before you start`, `Steps` (`===` phases only here, numbering continuous with `[start=N]`), `Check the
  result`, `Variations` (optional), `What can go wrong` (table), `Clean up` (when the guide creates resources),
  `Where to go next`, `Sources`. The reader builds resources prefixed `guide-` and never edits provisioned ones. Every
  `===` phase has a figure; a figure is attached to the last step it illustrates with a `+` list continuation, and its
  callout numbers are the page's step numbers. Labels and layouts come from the lab, never from memory; a screen nobody
  opened stays generic.
- **Maps in figures are real geography.** The `worldMap` block of `lib/blocks.mjs` draws the Natural Earth 1:110m country
  outlines in Web Mercator from `scripts/monitoring-guides/data/world-110m.json`, generated once by `extract-geo.mjs` from
  the `world-atlas` npm package (`npm i --no-save world-atlas@2.0.2`, then pass it `countries-110m.json`). Basemap colours
  are the theme tokens `colour.map.*` (Grafana: CARTO Dark Matter; Kibana: Elastic Maps Service road map, desaturated).
  Never draw a map as a grid of cells; a country the figures colour or mark needs its ISO code in `ALPHA2` there.
- **Figures are generated, never hand-drawn.** `scripts/monitoring-guides/` holds `lib/blocks.mjs` (building blocks:
  window, nav, toolbar, field, dropdown, table, charts, highlight and callout), `lib/shells.mjs` (shared product screens
  such as the Grafana panel editor and the Kibana Lens editor; add new ones there, backward compatible), `lib/render.mjs`,
  `lib/tokens.mjs`, `figures/<product>-<id>.mjs` (one spec per guide, `grafana-g5.mjs`, `kibana-k5.mjs`; colours are token
  names only, 1080 px wide) and `generate-figures.mjs`. `npm run guides:figures [spec]` renders the SVGs named
  `monitoring-alerting-<product>-guide-<id>-<nn>-<what>.svg` into `modules/ROOT/images/` and fails on text wider than its
  box. `npm run test:guides` checks the themes, that files are up to date and not orphaned, that every guide figure is
  referenced by exactly one page, that every step group has a figure and that no spec hard-codes a colour.
- **Screen maps.** The eight numbered overviews (`monitoring-alerting-<product>-map-<area>.svg`, specs
  `figures/<product>-maps.mjs`) are each shown once, right under `== Steps`, by the guide designated in
  `lib/guide-maps.mjs`; other guides link to that guide instead of repeating the map. A new map area needs a map spec and
  an entry there.
- **Product themes are the stated exception to the single-palette rule.** `themes/grafana.mjs` (dark) and
  `themes/kibana.mjs` (light) hold colours read from the real UI, so guide figures look like the product; the site
  palette of `scripts/cards/palette.mjs` still applies to cards, and only the annotation marks (highlight, callout) use the
  site accent. A change of look is made in the theme module, never in a spec or an SVG.
- **Logos in figures.** Coloured product marks come from `scripts/cards/guide-logos.mjs` (key into `logos.json`, a solid
  `colour` field per product; card marks stay white and ignore it). A mark Simple Icons and Devicon lack is a vendor asset
  (`scripts/cards/vendor-logos/tempo.svg`) with its source and licence recorded in `guide-logos.mjs` and listed in
  `LOGO-SOURCES.md`. Run `npm run cards` and `npm run test:cards` after a change.
- **One admonition only.** In the Monitoring & Alerting section the AI-assistance notice (`partial$ai-disclaimer.adoc`)
  is the only admonition: no `NOTE:`, `TIP:`, `WARNING:`, `CAUTION:` or `IMPORTANT:` blocks on guides or reference
  pages; a difference between product versions is one short sentence in the step.

## Images and figures

- All images go in `modules/ROOT/images/` and are referenced by bare filename (`image::foo.svg[...]`), with no
  `images/` prefix and no module path.
- **A block image macro `image::target[alt, attrs]` must be on one line**, with the closing `]` on that line. Never
  hard-wrap alt text or attribute lists, even past the usual 120-column prose length. A wrapped macro silently
  renders as a plain paragraph showing the filename and alt text, and the Antora build reports no error. The same
  applies to inline `image:` macros.
- **Wrap the alt text in double quotes whenever it contains a comma** (`image::foo.svg["A, B and C",width=720]`).
  An unquoted comma ends the alt text (the first positional attribute) and the rest spills into the positional
  `width`/`height` attributes, so the alt is silently truncated (e.g. `alt="A" height="B and C"`). Keep named
  attributes such as `width=` outside the quotes.
- Block macros start at column 0 (never indented), with a blank line before and after.
- Every SVG added to `modules/ROOT/images/` must be referenced by at least one page. An orphaned image means the
  reference was forgotten.
- Verification for doc changes, since a green build doesn't prove figures render. Quote every `--include` pattern
  (an unquoted `*.adoc`/`*.html` makes zsh abort with "no matches found" and print nothing, which looks like a
  pass). All of these must print nothing:
  ```bash
  grep -rnE '^image::' modules | grep -vE '\]\s*$'                          # block macros not closed on the same line
  grep -rnE '(^|[^:+])image:[^:[ ]+\[[^]]*$' modules --include='*.adoc'     # inline macros not closed on the same line
  grep -rn '<p>image::' build/site --include='*.html'                       # unrendered block macro leaked into a paragraph
  ```
  The last check matches only paragraph text, so `image::` shown inside a code listing (`<pre>`/`<code>`) in this or
  any remote component is not reported. For the files you changed, also check for alt text with an unquoted comma
  (pre-existing pages still have some, so run it on your own files rather than the whole tree):
  ```bash
  grep -nE '^image::[^[]+\[[^"][^]]*,[^]=,]*(,|\]$)' <changed .adoc files>   # alt text with an unquoted comma
  ```
  Optionally also check that every `image::` target exists in `modules/ROOT/images/`, and that every image is
  referenced.

## Inline code

- Plain backtick code (`` `x` ``) still gets Asciidoctor's normal substitutions, and the Antora build reports none of
  them: `->`, `=>`, `<=` and `<-` become arrows, `...` an ellipsis, `'` between letters a curly apostrophe, and
  `__name__`, `#[...]`, `*`, `~` and `^` pair with a later one in the same paragraph or table cell into italics,
  highlight, bold, subscript or superscript. A `{name}` that matches a defined attribute is replaced.
- **Write inline code that contains `->`, `=>`, `<=`, `<-`, `__`, `#[`, `~`, `*`, `^`, `...`, `'` or `{` as a
  constrained passthrough, `` `+$book->author+` ``.** The content is shown exactly as written (with `<`, `>` and `&`
  escaped). Inside `+...+` a `{plus}` is shown literally and a `+` can end the passthrough, so **code that contains a
  `+` uses `` `pass:c[$a + $b]` ``** instead, with any `]` in it written as `\]`. Names with `__` outside backticks,
  in headings or link text, need the same `+__construct()+` passthrough.
- Verification for doc changes, after a build (quote the `--include` pattern, as above). It must print nothing for
  the sections you changed; other sections still have pre-existing matches, so pass their `build/site/<section>`
  directories rather than the whole of `build/site`:
  ```bash
  grep -rnE '<code>[^<]*(<(em|strong|mark|sub|sup)>|&#8594;|&#8658;|&#8656;|&#8592;|&#8230;|&#8217;|&#8203;|\{plus\})' \
    build/site/<section> --include='*.html'                                 # substitutions inside inline code
  ```
  It checks inline `<code>` only; a pair of `__` in a heading or link text shows as stray italics in the page.

## Mermaid diagrams

- `@sntke/antora-mermaid-extension` copies a `[mermaid]` block into the page as **raw HTML**, and Mermaid then reads
  the element's `innerHTML` and decodes its entities. So **anything that looks like an HTML tag is parsed by the
  browser, not passed to Mermaid**. Class-diagram stereotypes are the usual case: `<<interface>>` becomes an
  `<interface>` element. Its closing `</interface>` is appended after the diagram's last line, and if that line is a
  relationship (`A <|-- B`) the diagram renders as Mermaid's error graphic. The Antora build still reports nothing.
- **Write stereotypes/annotations (`<<interface>>`, `<<enumeration>>`, `<<data class>>`, …) as entities:
  `&lt;&lt;interface&gt;&gt;`.** Mermaid decodes them and renders `<<interface>>`. Do the same for any other `<`
  directly followed by a letter, `/`, `!` or `?` inside a diagram. Arrows such as `<|--`, `<<->>` and `-->` are safe.
- Verify with `npm run validate:mermaid`, after a one-off `npm i --no-save mermaid@11 jsdom`. It must report every
  diagram as parsed. The script validates the text after the browser's HTML parsing, so it catches this problem; a
  plain `mermaid.parse` of the source does not.

## `.claude/skills/`

This repo carries a shared catalog of Claude Code skills used across this GitHub account's repositories
(covering the full issue → plan → code → PR → release flow for Java/.NET projects, plus docs-specific ones).
Two are directly relevant here:

- **`antora-setup`** / **`update-docs`** — scaffold or update an Antora module in *any* repo (including this
  one) so its docs track its own code changes.
- **`analyze-claude-skills-and-agents`** — regenerates this catalog's own documentation (a skills/agents
  reference and dependency graph) under `docs/modules/ROOT/pages/` — note that skill runs against a `docs/`
  subdirectory convention used by other repos in this account, not this repo's own root-level `modules/`.
