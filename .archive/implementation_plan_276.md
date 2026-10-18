# Implementation Plan: Guides & References — "Ruby" (Programming Languages)

## Task summary

Source: GitHub issue #276
Base branch: main

Issue [#276](https://github.com/albertoirurueta/docs/issues/276) adds an Antora section
`modules/ROOT/pages/programming-languages/ruby/` (nav title **Ruby Reference**): a detailed, learning-oriented reference for the
**Ruby language, core classes and standard library, targeting Ruby 4.0** (4.0.7, or the newest release at implementation time).
**70 pages** (incl. `index.adoc` with the Bibliography and `cheat-sheet.adoc`), `ruby-disclaimer.adoc` and `nav-ruby.adoc`
partials, original `ruby-*.svg` figures and Mermaid diagrams, back-links from existing pages, and a one-page A4 PDF
`modules/ROOT/attachments/ruby-cheat-sheet.pdf`. Running scenario: the original *shelf* gem (library catalogue), same domain as the
Rust and Go references. Rails is out of scope.

**The binding spec** is the issue body plus one comment (the page outline, split for GitHub's size limit):
https://github.com/albertoirurueta/docs/issues/276#issuecomment-6096241956. Local copy: session scratchpad `issue276.md`
(`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/54a79b3c-92bb-4d05-88f7-e0e9ece2f867/scratchpad/issue276.md`);
re-fetch with `gh issue view 276 --json body,comments` if missing. **Every page task must re-read its own outline bullets** (★ depth,
📊 figures, source abbreviations D/RL/N/RA/BR/RG/BU/GH, DiLeo/Dementyev chapter notes, "book outdated" notes) and the issue's
"Concepts contributed by the books" and "Where the books are outdated" tables.

### Choices made on the user's behalf

1. **Branch `feature/276-add-ruby-section-language-reference`** (created from `main`, user-confirmed base), **one draft PR to `main`**
   with `Closes #276`. The issue's optional five-PR split is not used; groups follow its slices so the work could still be cut.
2. **Tasks are untagged.** No `ruby` coding key is installed (the catalog has none), and the work is AsciiDoc/Mermaid/SVG/PDF authoring,
   so tasks are implemented directly. Ruby code in pages is **syntax-checked (`ruby -wc`), run and RuboCop-linted for real** on Ruby 4.0
   in a scratch directory (never committed).
3. **Toolchain**: the machine only has system Ruby 2.6.10 (no rbenv/mise/asdf/RuboCop). Task 1 installs Ruby 4.0 (user-level version
   manager, e.g. `brew install rbenv ruby-build` or `mise`) and RuboCop/Minitest/RSpec/RBS in a scratch environment. Installing
   software is confirmed with the user first; if declined, examples are checked against the docs only and that is stated in the PR.
4. **Books**: the two PDFs in `~/Desktop/libros/ruby/` are copyrighted. Consulted only for structure/idioms, cited on the landing-page
   bibliography by publisher page, and used for "book is outdated" prose. No book text, listing, figure or sample project is reproduced;
   nothing from them is committed.
5. **Disclaimer** `ruby-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc` (single `[IMPORTANT]` AI-assistance disclosure +
   xref to `programming-languages/ruby/index.adoc#_bibliography`). It is the **only** admonition in the section: no other
   NOTE/TIP/WARNING/CAUTION/IMPORTANT blocks.
6. **Nav placement**: the issue says `include::partial$nav-ruby.adoc[]` goes last inside the Programming Languages open block. That block
   now ends `nav-go`, `nav-jvm-build-tools`; the include goes **after `nav-jvm-build-tools`**, before the closing `--`, as the issue
   specifies. `nav-ruby.adoc` is relative-depth like `nav-php.adoc`.
7. **Version baseline re-verified at implementation time and dated** (Task 1): Ruby 4.0.x patch, whether 4.1 (due 2026-12-25) is out,
   supported branches, docs.ruby-lang.org/en/4.0 URLs, tool versions. Unverifiable items are described without naming a release.
8. **Existing pages get real `xref:`s** (verified with `ls`); #196, #263, #275 and #236 are mentioned in prose only (no xref to pages
   that don't exist). No Rails page and no `starting-a-new-project.adoc` row.
9. **Mermaid/SVG floor:** every 📊 in the outline is delivered; SVGs are original `ruby-*.svg` (no Ruby logo, no docs or book figures),
   each referenced by a page.

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$ruby-disclaimer.adoc[]`; intro states the Ruby 4.0 baseline;
  features newer than 3.0 name their version.
- Each example: `[source,ruby]`, `# frozen_string_literal: true` for library/script files, passes `ruby -wc`, runs on Ruby 4.0 without
  warnings, RuboCop-clean with default config, with real output (`# =>` in 3.4+ `inspect` format, real error messages); followed by
  `Source: https://docs.ruby-lang.org/en/4.0/...[...]` (versioned URL, never `master`; looked up, never guessed). Current APIs only
  (`Data`, `it`, `Set` without `require`; no `OpenStruct`/`DateTime`/`Kernel#open` pipes). Follows the *shelf* scenario. No real secrets.
  Experimental features (Ruby::Box, ZJIT) avoided or labelled in prose.
- Depth: rationale, documented rules, every relevant keyword/class/method/option/magic comment/env var, common exceptions and warnings,
  pitfalls, version notes. ★ pages are the most detailed in the section.
- Each page covers where the books are outdated for its concepts (prose/tables, never reproducing errata) and ends with `== References`.
- AsciiDoc pitfalls: inline code containing `->`, `=>`, `<=`, `<=>`, `...`, `*`, `**`, `^`, `~`, `__`, `{`, `#[`, `'` uses `` `+…+` ``;
  containing `+` uses `` `pass:c[…]` `` (with `]` as `\]`). Image macros on one line, quoted alt when it contains a comma, block
  macros at column 0 with blank lines around.
- Mermaid: `<` directly followed by a letter written `&lt;`; stereotypes `&lt;&lt;module&gt;&gt;`; `class << self` with entities.
- Per-task verification: run its examples; grep its files for unquoted-comma image alt text, block-macro closure and
  `NOTE|TIP|WARNING|CAUTION|IMPORTANT` blocks (only the disclaimer include may exist).

## Current code state

- No application code. Site definition: `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc` (Programming
  Languages open block includes `nav-kotlin`, `nav-c`, `nav-cpp`, `nav-objective-c`, `nav-csharp`, `nav-swift`, `nav-php`, `nav-groovy`,
  `nav-scala`, `nav-go`, `nav-jvm-build-tools`; JavaScript/TypeScript/Python/Java/Rust follow after the closing `--`).
- Templates: `modules/ROOT/partials/rust-disclaimer.adoc`, `nav-php.adoc`, `nav-go.adoc`; `programming-languages/php/cheat-sheet.adoc`,
  `rust/cheat-sheet.adoc`, `go/cheat-sheet.adoc`; precedent plans `.archive/implementation_plan_275.md` (Go, 59 pages), `_299.md`
  (Scala), `_297.md` (Groovy), `_300.md`, `_294.md`.
- `modules/ROOT/pages/programming-languages/ruby/` does not exist; `programming-languages/index.adoc` has no Ruby entry.
- `modules/ROOT/attachments/` holds cheat-sheet PDFs; `modules/ROOT/images/` the SVGs; `scripts/validate-mermaid.mjs` backs
  `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`).
- Back-link targets named in the issue: `web/django/introduction-and-architecture.adoc`, `web/php-laravel/introduction-and-architecture.adoc`
  and `web/php-laravel/index.adoc`, `database/prometheus/instrumenting-applications.adoc`, `backend/flask/introduction-and-architecture.adoc`,
  `cloud/aws/lambda.adoc`, `ai/mcp/index.adoc`, `programming-languages/rust/async-await-and-futures.adoc`,
  `backend/springboot/concurrency-alternatives.adoc`, plus Podfile/Fastfile/Homebrew pages (`programming-languages/objective-c/build-and-tooling.adoc`,
  `apps/react-native/*`, `apps/kotlin-multiplatform/*`, `ai/cli-for-agents/*`). Each must be `ls`-verified and read before editing.
- Build/verify: `npx antora antora-playbook.yml` (Node 24 present); the CLAUDE.md image, inline-code and Mermaid greps.

## Implementation steps

### Group 1 — Foundations (Parallelizable: no — Task 2 depends on the baseline verified in Task 1)

- [x] Task 1. Install and verify the Ruby 4.0 toolchain and re-verify the version baseline
  - [x] Task 1.1. User approved (via iru-issue); mise 2026.10.12 installed at `~/.local/bin/mise`, Ruby 4.0.7 + RuboCop 1.92.0, RSpec, RBS 4.2.0 installed (Minitest ships as a bundled gem). Not activated globally: run Ruby via `export PATH=$HOME/.local/bin:$PATH; mise exec ruby@4.0 -- <cmd>`
  - [x] Task 1.2. Re-verify against docs.ruby-lang.org/en/4.0 and ruby-lang.org: latest 4.0.x, whether 4.1 is released, supported branches, URL layout; record in the scratchpad
  - [x] Task 1.3. Build a scratch *shelf* gem skeleton (`Gemfile`, `shelf.gemspec`, `lib/shelf/…`, `exe/shelf`, `test/`, `sig/`, `Rakefile`, `.rubocop.yml`) so all pages share one verified scenario
- [x] Task 2. Create the section scaffolding
  - [x] Task 2.1. `modules/ROOT/partials/ruby-disclaimer.adoc` modelled on `rust-disclaimer.adoc`
  - [x] Task 2.2. `modules/ROOT/partials/nav-ruby.adoc` modelled on `nav-php.adoc`: relative-depth, one `**` entry per page in outline order (grouped headings allowed), ending with the cheat sheet
  - [x] Task 2.3. `modules/ROOT/nav.adoc`: add `include::partial$nav-ruby.adoc[]` as the last include in the Programming Languages open block

### Group 2 — Getting started and core language (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 3. Write the getting started and core language pages (13) under `modules/ROOT/pages/programming-languages/ruby/`
  - [x] Task 3.1. `getting-started.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.2. `versions-releases-and-compatibility.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.3. `program-structure-and-lexical-elements.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.4. `design-philosophy-and-coming-from-other-languages.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.5. `literals.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.6. `variables-constants-and-scope.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.7. `assignment-and-multiple-assignment.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.8. `operators-and-precedence.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.9. `control-expressions.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.10. `methods-and-parameters.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.11. `calling-methods-and-argument-forwarding.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.12. `blocks-procs-and-lambdas.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.13. `exceptions-and-error-handling.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 3.14. Run this group's verification: `ruby -wc` and RuboCop on every extracted example; image/inline-code/admonition greps on the group's files

### Group 3 — Object model (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 4. Write the object model pages (9) under `modules/ROOT/pages/programming-languages/ruby/`
  - [x] Task 4.1. `classes-and-objects.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.2. `modules-and-mixins.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.3. `singleton-classes-and-class-level-behavior.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.4. `method-lookup-and-super.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.5. `visibility-and-encapsulation.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.6. `refinements-and-monkey-patching.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.7. `conversions-and-coercion.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.8. `equality-hashing-and-comparison.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.9. `object-lifecycle-freezing-and-copying.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 4.10. Run this group's verification: `ruby -wc` and RuboCop on every extracted example; image/inline-code/admonition greps on the group's files

### Group 4 — Core types (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 5. Write the core types pages (11) under `modules/ROOT/pages/programming-languages/ruby/`
  - [x] Task 5.1. `numbers.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.2. `strings.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.3. `encodings-and-unicode.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.4. `symbols.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.5. `arrays.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.6. `hashes.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.7. `ranges.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.8. `struct-data-and-value-objects.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.9. `sets.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.10. `time-and-dates.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.11. `regular-expressions.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 5.12. Run this group's verification: `ruby -wc` and RuboCop on every extracted example; image/inline-code/admonition greps on the group's files

### Group 5 — Iteration, pattern matching, metaprogramming and concurrency (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 6. Write the iteration, pattern matching, metaprogramming and concurrency pages (9) under `modules/ROOT/pages/programming-languages/ruby/`
  - [x] Task 6.1. `enumerable.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.2. `enumerators-and-lazy-evaluation.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.3. `pattern-matching.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.4. `dynamic-dispatch-and-method-definition.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.5. `hooks-eval-and-dsls.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.6. `reflection-introspection-and-tracing.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.7. `threads-and-the-gvl.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.8. `fibers-and-the-fiber-scheduler.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.9. `ractors.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 6.10. Run this group's verification: `ruby -wc` and RuboCop on every extracted example; image/inline-code/admonition greps on the group's files

### Group 6 — Code organization, tooling, packaging and standard library (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 7. Write the code organization, tooling, packaging and standard library pages (13) under `modules/ROOT/pages/programming-languages/ruby/`
  - [x] Task 7.1. `code-loading-require-and-autoload.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.2. `rubygems-and-bundler.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.3. `creating-and-publishing-gems-and-rake.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.4. `ruby-command-line-and-environment.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.5. `irb-and-debugging.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.6. `documentation-with-rdoc-and-yard.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.7. `command-line-programs.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.8. `io-files-and-directories.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.9. `processes-signals-and-shell.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.10. `networking-and-http.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.11. `serialization-json-yaml-csv-and-marshal.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.12. `standard-library-tour.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.13. `security.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 7.14. Run this group's verification: `ruby -wc` and RuboCop on every extracted example; image/inline-code/admonition greps on the group's files

### Group 7 — Quality, design, performance, interop and evolution (Parallelizable: yes — each page is its own file; all share the Task 1.3 scenario and use only the disclaimer partial)

- [x] Task 8. Write the quality, design, performance, interop and evolution pages (13) under `modules/ROOT/pages/programming-languages/ruby/`
  - [x] Task 8.1. `testing-with-minitest.adoc` ★ (most detailed): follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.2. `rspec-and-test-doubles.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.3. `type-checking-with-rbs-typeprof-steep-and-sorbet.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.4. `style-linting-and-static-analysis.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.5. `idioms-style-and-clean-code.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.6. `solid-and-design-patterns.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.7. `application-architecture-in-plain-ruby.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.8. `common-mistakes-and-gotchas.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.9. `performance-benchmarking-and-profiling.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.10. `yjit-zjit-and-the-vm.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.11. `garbage-collection-and-memory.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.12. `c-extensions-ffi-and-webassembly.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.13. `whats-new-and-migrating-older-code.adoc`: follow its outline bullets, conventions above, runnable verified examples with `Source:` links, 📊 figures where marked, `== References`
  - [x] Task 8.14. Run this group's verification: `ruby -wc` and RuboCop on every extracted example; image/inline-code/admonition greps on the group's files

### Group 8 — Landing page, cheat sheet and PDF (Parallelizable: no — the landing page and cheat sheet summarise every earlier page and the bibliography needs every source used)

- [x] Task 9. `index.adoc` landing page
  - [x] Task 9.1. Intro, version baseline, *shelf* scenario, reading path, `== What's covered`, `== Ruby on Rails` paragraph (out of scope), Mermaid mind-map
  - [x] Task 9.2. `== Bibliography`: both books (publisher pages https://link.springer.com/book/10.1007/979-8-8688-2643-6 and the Packt page, re-verified), ruby-lang.org / docs.ruby-lang.org, RubyGems, Bundler, `ruby/*` tool sites, community tools (labelled), specifications; every source used on any page appears here
- [x] Task 10. Cheat sheet
  - [x] Task 10.1. `cheat-sheet.adoc` linking `modules/ROOT/attachments/ruby-cheat-sheet.pdf` (modelled on `go/cheat-sheet.adoc`)
  - [x] Task 10.2. Generate the single-page A4 PDF covering every concept in the section, including the "changed since older tutorials" strip; check it is exactly one page
- [x] Task 11. Original `ruby-*.svg` figures not already created by page tasks; confirm every SVG is referenced by a page
  - Notes: index.adoc (landing, mind-map, What's covered, Rails paragraph, generated bibliography of every URL cited on the 68 pages), cheat-sheet.adoc, attachments/ruby-cheat-sheet.pdf (1 page A4, Chrome headless). Task 11: all 7 outline SVGs already existed (15 ruby-*.svg, all referenced); none created. Packt page URL could not be fetched (403 bot block); search lists the Packt page as ...9781806114221 (the issue's ...238 is another format's ISBN), index uses ...221.

### Group 9 — Integration and back-links (Parallelizable: yes — disjoint files, none depends on another)

- [x] Task 12. `programming-languages/index.adoc`: Ruby Reference bullet (after the Go bullet, ending ", plus a downloadable cheat sheet."), `:description:`, `:keywords:` and the "live only here" sentence; root `index.adoc` description/keywords only if they list language references
- [x] Task 13. Back-links (one line each, `xref:` targets verified with `ls`; nothing outside the issue's list)
  - [x] Task 13.1. `web/django/introduction-and-architecture.adoc` (Rails row and the "no page for Rails" sentence reworded)
  - [x] Task 13.2. `web/php-laravel/introduction-and-architecture.adoc` (Rails row) and `web/php-laravel/index.adoc`
  - [x] Task 13.3. `database/prometheus/instrumenting-applications.adoc`, `backend/flask/introduction-and-architecture.adoc`, `cloud/aws/lambda.adoc`, `ai/mcp/index.adoc`
  - [x] Task 13.4. `programming-languages/rust/async-await-and-futures.adoc`, `backend/springboot/concurrency-alternatives.adoc`
  - [x] Task 13.5. Ruby-as-tool-language pages (Podfile/Fastfile/Homebrew) where it reads naturally

### Group 10 — Verification, docs build and secrets (Parallelizable: no — runs on the finished section)

- [x] Task 14. Build and verify
  - [x] Task 14.1. `npm install` if needed, then `npx antora antora-playbook.yml`; zero xref/AsciiDoc errors or warnings; Ruby nav appears under Programming Languages
  - [x] Task 14.2. Run the CLAUDE.md greps (block/inline image closure, `<p>image::`, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/programming-languages/ruby`); all must print nothing
  - [x] Task 14.3. `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`; every diagram parsed
  - [x] Task 14.4. Check: 70 page files exist and match `nav-ruby.adoc`; no admonition other than the disclaimer; every `image::` target exists and every `ruby-*.svg` is referenced; no `xref:` to #196/#263/#275/#236 targets; no book content or PDF committed
  - [x] Task 14.5. Run `/iru-check-security` (docs repo: detect-secrets findings in examples are expected false positives; update `.secrets.baseline`)
  - Notes: Antora build 0 warnings/errors; fixed hooks-eval table pipes, attribute refs, inline-code substitutions; mermaid 2094 parsed; Packt URL kept as issue's ...238; baseline updated, 12 new unlabeled findings (all false positives).
