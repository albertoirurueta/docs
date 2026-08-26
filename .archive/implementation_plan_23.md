# Implementation Plan: Web Development / "Web Accessibility"

## Task summary

Source: GitHub issue #23

Issue [#23](https://github.com/albertoirurueta/docs/issues/23) ("Web Accessibility") asks for a new documentation
page (or small set of pages) within the existing **Guides & References / Web Development** section explaining
what web accessibility is and what has to be taken into account to make a page accessible (color contrast, text
size, alternative text, screen-reader support, keyboard/tab support for forms), links to and brief explanations
of specific accessibility rules/laws (Spain: UNE 139803:2004 and UNE 139803:2012; Europe: CWA 15554:2006; USA:
Section 508 of the 1973 Rehabilitation Act), the WCAG conformance categories A/AA/AAA and their requirements, and
validation tools (TAW, HERA) with links and usage guidance. It explicitly invites multiple pages if needed, and
diagrams (mermaid) or figures (SVG) where they clarify concepts.

**Choices made on the user's behalf** (nothing here is genuinely ambiguous enough to block on):

- **A single standalone page, `modules/ROOT/pages/web/accessibility.adoc`, not a multi-page subsection.**
  Two accessibility-adjacent pages already exist:
  `modules/ROOT/pages/web/bootstrap/accessibility.adoc` (Bootstrap-component-specific: ARIA state managed by
  Bootstrap's JS, keyboard support for its widgets, contrast of its default theme) and
  `modules/ROOT/pages/web/html-css/forms-accessibility-validation.adoc` (HTML form labeling, fieldset/legend,
  keyboard/focus, native validation). Neither covers general page-level accessibility principles, WCAG
  conformance levels, legal standards, or validation tools — that gap is what this issue actually asks to fill,
  and it is one cohesive topic (not a broad framework/language reference needing dozens of pages the way
  Bootstrap/HTML & CSS/Sass/JavaScript do). This mirrors the most direct and most recent precedent,
  `modules/ROOT/pages/web/cors.adoc` ([.archive/implementation_plan_21.md](.archive/implementation_plan_21.md)):
  a standalone page directly under `web/`, sibling to the four subsection folders, listed directly in
  `web/index.adoc`'s "Sections" list rather than nested under any of them.
- **New disclaimer partial**, `modules/ROOT/partials/accessibility-disclaimer.adoc`, following the same
  no-single-book, AI-generated-content pattern as `cors-disclaimer.adoc`/`bootstrap-disclaimer.adoc` — pointing
  readers at the W3C's own WCAG documentation as the technical source of truth, and adding an explicit note that
  the legal-standards section is general informational summary, not legal advice, and must be verified against
  each jurisdiction's own official text before being relied on for compliance purposes.
- **No URLs are pre-filled in this plan for the legal standards (UNE 139803, CWA 15554, Section 508) or the
  validation tools (TAW, HERA).** Per this repository's own guidance against guessing URLs, whoever implements
  Task 2's legal-standards and tools sub-tasks must look up and confirm each current official URL (a web search
  tool) before adding it as a link, rather than the plan asserting one that could be stale or wrong — these are
  government/standards-body/tool URLs, not something to invent from training data.
- **One new SVG figure**, `modules/ROOT/images/color-contrast.svg`, illustrating a failing vs. passing text/
  background contrast pair — the one concept in this issue (color contrast) that benefits from an actual visual
  example rather than a table or prose description, matching the issue's own invitation for figures and this
  repo's existing convention of small illustrative SVGs under `modules/ROOT/images/` (e.g. `box-model.svg`,
  `hsl-color-wheel.svg`).
- **One mermaid diagram** for the WCAG POUR principles (Perceivable / Operable / Understandable / Robust),
  mapping each principle to a couple of concrete examples — the other natural diagram candidate (Simple vs.
  preflight, in CORS's case) doesn't apply here since accessibility isn't a request/response protocol; POUR is
  the one structural relationship in this content worth a diagram.
- **Cross-reference, don't duplicate, the two existing accessibility pages.** `bootstrap/accessibility.adoc` and
  `html-css/forms-accessibility-validation.adoc` cover keyboard/tab support and screen-reader-relevant markup in
  detail already; the new page links to both instead of re-explaining ARIA attributes or `fieldset`/`legend`
  markup, and both existing pages get a one-line cross-reference back to the new page for WCAG-level/legal
  context they don't currently cover.

## Current code state

- This repository has no application source code — it *is* the Antora playbook + root (`irurueta`) component for
  the aggregated "Irurueta Docs" site. All content lives under `modules/ROOT/`.
- `modules/ROOT/nav.adoc` defines the **Web Development** section (`** xref:web/index.adoc[Web Development]`),
  currently with one standalone leaf page (`*** xref:web/cors.adoc[What is CORS?]`) followed by four `***`
  sub-references, each with its own `****`-nested page list: HTML & CSS Reference (`web/html-css/`), Sass
  Reference (`web/sass/`), JavaScript Development (`web/javascript/`), and Bootstrap Reference (`web/bootstrap/`).
- `modules/ROOT/pages/web/index.adoc` is the Web Development landing page: a short intro plus a `== Sections`
  bulleted list, one `xref:` bullet per subsection/standalone page with a one-line summary — `web/cors.adoc` is
  currently listed first.
- `modules/ROOT/pages/web/cors.adoc` is the closest structural precedent for a standalone concept page: header
  block (`= Title`, `:description:`, `:keywords:`), `include::partial$<name>-disclaimer.adoc[]`, several `==`
  sections mixing prose, tables, `[source,...]` code blocks, and `[mermaid]` `sequenceDiagram` blocks, ending in a
  closing section that reinforces a key caveat (there, "CORS Does Not Replace Authentication").
- `modules/ROOT/pages/web/bootstrap/accessibility.adoc` covers Bootstrap-specific ARIA/keyboard/contrast support
  and explicitly says it does not repeat general form-accessibility guidance, deferring to
  `xref:web/html-css/forms-accessibility-validation.adoc[]`. It has no forward reference to any general
  page-level accessibility page (none currently exists).
- `modules/ROOT/pages/web/html-css/forms-accessibility-validation.adoc` covers label association, `fieldset`/
  `legend` grouping, and keyboard navigation/focus for HTML forms specifically — no WCAG-level or legal-standards
  content.
- Mermaid diagrams are already in use via `[mermaid]` blocks (e.g. `modules/ROOT/pages/web/cors.adoc`,
  `modules/ROOT/pages/web/bootstrap/javascript-behavior.adoc`), backed by the `@sntke/antora-mermaid-extension`
  wired up in `antora-playbook.yml`. SVG figures already exist under `modules/ROOT/images/` (e.g. `box-model.svg`,
  `hsl-color-wheel.svg`, `bootstrap-navbar.svg`) and are referenced from pages via `image::<file>.svg[...]`.
- No `*-code-one-task` skill applies (AsciiDoc documentation content, not application code in a language this
  repository's installed skills cover) — every task below is left untagged and implemented directly.

## Implementation steps

### Group 1

**Parallelizable: yes** (single task)

- [x] Task 1. Create the accessibility disclaimer partial —
  `modules/ROOT/partials/accessibility-disclaimer.adoc`
  - [x] Task 1.1. Create `modules/ROOT/partials/accessibility-disclaimer.adoc`, an `[IMPORTANT]` admonition
    following the exact structure of `modules/ROOT/partials/cors-disclaimer.adoc`: state that this page documents
    general web accessibility concepts as defined by the W3C Web Content Accessibility Guidelines (WCAG),
    generated with AI assistance from general knowledge, and should be verified against the W3C's own WCAG
    documentation before relying on it. Add a second, explicit caveat that the legal-standards section
    summarizes accessibility regulations in different countries/regions for general informational purposes only,
    is not legal advice, and must be checked against each jurisdiction's own current official text before being
    relied on for compliance.
  - [x] Files: `modules/ROOT/partials/accessibility-disclaimer.adoc` created (AsciiDoc content only, no
    tests/coverage/quality tooling applies to this repository).

### Group 2

**Parallelizable: yes** (single task, depends on Group 1's partial existing to include)

- [x] Task 2. Write the "Web Accessibility" page — `modules/ROOT/pages/web/accessibility.adoc`
  - [x] Task 2.1. Create `modules/ROOT/pages/web/accessibility.adoc` with the standard header block:
    `= Web Accessibility`, a `:description:` summarizing the page (what web accessibility is, building accessible
    pages, WCAG conformance levels, legal standards by region, validation tools), and a `:keywords:` line (e.g.
    `web accessibility, a11y, WCAG, WCAG conformance levels, color contrast, alt text, screen readers, keyboard
    navigation, UNE 139803, CWA 15554, Section 508, TAW, HERA, accessibility validation tools`), followed by
    `include::partial$accessibility-disclaimer.adoc[]`. Open with a short intro paragraph on what web
    accessibility is and why it matters (usable by people with visual, auditory, motor, or cognitive
    disabilities, and by assistive technology such as screen readers).
  - [x] Task 2.2. `== Core Principles: POUR` — explain WCAG's four foundational principles (Perceivable,
    Operable, Understandable, Robust), each with one or two concrete examples (e.g. Perceivable: alt text and
    sufficient color contrast; Operable: full keyboard support; Understandable: consistent navigation and clear
    error messages; Robust: valid, semantic markup that works with assistive technology). Include a `[mermaid]`
    diagram (e.g. a `flowchart`/`mindmap` with POUR as the four branches and each principle's examples as
    leaves) mapping principle → example techniques.
  - [x] Task 2.3. `== Building an Accessible Page` — a practical checklist covering: color contrast (state the
    WCAG AA numeric ratios: 4.5:1 for normal text, 3:1 for large text/UI components) with a reference to the new
    `color-contrast.svg` figure (Task 2.4); text size (relative units so a user's browser zoom/text-size
    preference is respected, rather than fixed pixel sizes that resist resizing); alternative text for images
    (meaningful images need descriptive `alt`, purely decorative images use `alt=""` so screen readers skip
    them); screen-reader support (semantic HTML5 elements and ARIA landmarks convey structure — cross-reference
    `xref:web/bootstrap/accessibility.adoc[]` for the ARIA patterns Bootstrap manages automatically, rather than
    re-explaining them here); keyboard/tab support for forms (cross-reference
    `xref:web/html-css/forms-accessibility-validation.adoc[]`'s own "Keyboard navigation and focus" section
    rather than duplicating it).
  - [x] Task 2.4. Create `modules/ROOT/images/color-contrast.svg`, a small illustrative SVG figure showing two
    side-by-side text/background swatches: one with a contrast ratio that fails WCAG AA (e.g. light gray text on
    white, labeled "Fails AA") and one that passes (e.g. dark text on a light background, labeled "Passes AA"),
    matching the style/scale of existing figures such as `modules/ROOT/images/box-model.svg`. Reference it from
    `accessibility.adoc` (Task 2.3) via `image::color-contrast.svg[...]` with descriptive alt text.
  - [x] Task 2.5. `== WCAG Conformance Levels: A, AA, AAA` — explain that WCAG success criteria are grouped into
    three increasingly strict conformance levels, as a table (`[cols="1,3", options="header"]`, columns "Level"
    and "What it requires / example criteria"): Level A (minimum — e.g. alt text for images, keyboard
    accessibility for all functionality), Level AA (the level most legal standards mandate — e.g. 4.5:1 color
    contrast, resizable text, consistent navigation), Level AAA (the highest — e.g. 7:1 color contrast, sign
    language for prerecorded video), noting that AAA is not recommended as a blanket site-wide target even by
    WCAG itself, since some AAA criteria aren't achievable for all content types.
  - [x] Task 2.6. `== Legal Standards and Regulations` — three subsections, one per region named in the issue.
    For each, before writing, look up and confirm the current official reference URL (a web search tool, not an
    assumed/guessed URL):
    - [x] Task 2.6.1. `=== Spain: UNE 139803` — explain UNE 139803:2004 (Spain's original web-accessibility
      standard, AENOR-published) and its 2012 revision, UNE 139803:2012 (realigned to WCAG 2.0), with a link to
      each standard's official reference page and a brief explanation of what changed between the two versions.
    - [x] Task 2.6.2. `=== Europe: CWA 15554:2006` — explain the CEN Workshop Agreement CWA 15554:2006
      (harmonizing accessibility requirements for public-sector web content across EU member states, a precursor
      to the later EN 301 549 standard), with a link to its official reference page and a brief explanation of
      its scope/purpose.
    - [x] Task 2.6.3. `=== USA: Section 508` — explain Section 508 of the Rehabilitation Act of 1973 (federal
      requirement that agencies' electronic/information technology be accessible), including that its 2017
      refresh incorporated WCAG 2.0 Level AA by reference, with a link to the official Section508.gov reference
      page.
  - [x] Task 2.7. `== Validation Tools` — two subsections:
    - [x] Task 2.7.1. `=== TAW` — explain what TAW is (an automated WCAG conformance checker, widely used in
      Spain), link to its official site (confirm current URL via a web search tool), and briefly explain how to
      use it (enter a page URL or upload an HTML file, choose a WCAG level, read the categorized
      problem/warning/not-reviewed report).
    - [x] Task 2.7.2. `=== HERA` — explain what HERA is/was (a WCAG 1.0 manual-review-assistance tool), link to
      its reference page if it has one still reachable (confirm via a web search tool; if the tool is no longer
      maintained/reachable, say so explicitly rather than linking to a dead or unrelated page, and note a
      currently maintained alternative such as WAVE or axe DevTools), and briefly explain its intended workflow
      (walking through each WCAG checkpoint manually rather than a fully automated scan).
  - [x] Task 2.8. `== Automated Checks Are Not Enough` — closing section: automated tools like TAW catch only a
    minority of WCAG success criteria (things like missing `alt` attributes, insufficient contrast, missing form
    labels), while others (logical reading order, whether alt text is actually meaningful, whether keyboard focus
    order makes sense) require manual review — keyboard-only navigation and an actual screen reader (e.g.
    NVDA, VoiceOver) — reinforcing that conformance-level tables and validator reports are a starting point, not
    a substitute for testing with real assistive technology.
  - [x] Task 2.9. Add a one-line `xref:web/accessibility.adoc[]` cross-reference to
    `modules/ROOT/pages/web/bootstrap/accessibility.adoc`'s intro paragraph, pointing readers there for WCAG
    conformance levels, legal standards, and general page-level accessibility principles, alongside its existing
    cross-reference to `forms-accessibility-validation.adoc`.
  - [x] Task 2.10. Add a one-line `xref:web/accessibility.adoc[]` cross-reference to
    `modules/ROOT/pages/web/html-css/forms-accessibility-validation.adoc`'s intro paragraph, pointing readers
    there for the broader page-level accessibility context (WCAG levels, legal standards, tools) this page
    doesn't cover.
  - [x] Files: `modules/ROOT/pages/web/accessibility.adoc` created (all sections + 1 mermaid diagram);
    `modules/ROOT/images/color-contrast.svg` created; `modules/ROOT/pages/web/bootstrap/accessibility.adoc` and
    `modules/ROOT/pages/web/html-css/forms-accessibility-validation.adoc` each updated with a cross-reference.
    AsciiDoc/SVG content only — no tests/coverage/quality tooling applies to this repository.

### Group 3

**Parallelizable: no** — depends on `web/accessibility.adoc` (Group 2) existing to link to.

- [x] Task 3. Wire the new page into the site's navigation and landing page
  - [x] Task 3.1. Add `*** xref:web/accessibility.adoc[Web Accessibility]` to `modules/ROOT/nav.adoc`, directly
    under the `** xref:web/index.adoc[Web Development]` line, as a `***`-level entry placed immediately after
    `xref:web/cors.adoc[What is CORS?]` (both are short standalone concept pages, siblings of the four reference
    subsections) and before the four `****`-nested subsections.
  - [x] Task 3.2. Add a bullet to `modules/ROOT/pages/web/index.adoc`'s `== Sections` list, immediately after the
    existing `web/cors.adoc` bullet: `xref:web/accessibility.adoc[Web Accessibility] -- ` followed by a one-line
    summary (what web accessibility is, WCAG conformance levels, legal standards, and validation tools).
  - [x] Task 3.3. Build the Antora site locally (`npx antora antora-playbook.yml`, per this repository's
    `CLAUDE.md`) and confirm it completes without `xref`/AsciiDoc errors, and that the new nav entry, page, new
    SVG figure, and both updated cross-references all render correctly in `build/site`. Delegate this to the
    `iru-gate-runner` agent so the build log doesn't consume the main context window:
    ```
    Agent({
      description: "Build Antora docs site and verify no errors",
      subagent_type: "iru-gate-runner",
      prompt: "Run `npx antora antora-playbook.yml` at the repository root (/Users/albertoirurueta/repositories/common/docs).
        Report back only: whether the build completed successfully, any xref/AsciiDoc errors or warnings (with
        file/line), and confirmation that modules/ROOT/pages/web/accessibility.adoc, the new nav.adoc entry, the
        new modules/ROOT/images/color-contrast.svg figure, and the updated cross-references in
        web/bootstrap/accessibility.adoc and web/html-css/forms-accessibility-validation.adoc all appear in the
        generated build/site output. Do not paste the full build log."
    })
    ```
