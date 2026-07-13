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

## Architecture

- **`antora-playbook.yml`** is the site definition. Its `content.sources` list is the core of this repo: one
  entry is `url: .` (this repo's own local component, see below), and the rest are remote GitHub repos
  (`hermes`, `irurueta-units`, `irurueta-statistics`, `irurueta-sorting`, `irurueta-algebra`, `ai-catalog`),
  each pointed at a `start_path: docs` and a branch-glob pattern (e.g. `release_1.{4..99}*`) so only tagged
  release branches of each dependent repo are pulled in. **Adding/removing a documented project means editing
  this file's `content.sources` list**, not writing new pages here.
- The playbook also wires up the UI (`ui-bundle.zip`, a custom Antora UI bundle used with `snapshot: true`) and
  three Antora/Asciidoctor extensions: `@antora/lunr-extension` (site search), `@sntke/antora-mermaid-extension`
  (`[mermaid]` diagram blocks), and `@djencks/asciidoctor-mathjax` (LaTeX via `\( \)` / `\[ \]`). Any doc content
  using diagrams or math depends on these staying configured here.
- **`antora.yml`** declares this repo's own Antora component, named `irurueta`, whose nav is
  `modules/ROOT/nav.adoc`. This is the site's landing/root component — its pages don't describe this repo, they
  describe the overall site and link out to each remote component.
- **`modules/ROOT/nav.adoc`** and **`modules/ROOT/pages/index.adoc`** form the site home page: a project
  picker that cross-references each remote component's own `index.adoc` via `xref:<component>::index.adoc[]`
  syntax (e.g. `xref:irurueta-algebra::index.adoc[]`), with a matching icon in `modules/ROOT/images/`. **Adding a
  new project to the picker means: an image in `modules/ROOT/images/`, a nav entry, and an `xref:` block in
  `index.adoc`** — in addition to the `content.sources` entry above.
- **CI** (`.github/workflows/publish.yml` on a nightly cron, `.github/workflows/manual_publish.yml` on
  `workflow_dispatch`) both run the same steps: install Antora + its three extensions, `npx antora
  antora-playbook.yml`, then deploy `build/site` to the `gh-pages` branch via `crazy-max/ghaction-github-pages`.
  Because the remote content sources track release branches, a fresh build can pick up newly published releases
  from any of the dependent repos without any change in this repo.

## `.claude/skills/`

This repo carries a shared catalog of Claude Code skills used across this GitHub account's repositories
(covering the full issue → plan → code → PR → release flow for Java/.NET projects, plus docs-specific ones).
Two are directly relevant here:

- **`antora-setup`** / **`update-docs`** — scaffold or update an Antora module in *any* repo (including this
  one) so its docs track its own code changes.
- **`analyze-claude-skills-and-agents`** — regenerates this catalog's own documentation (a skills/agents
  reference and dependency graph) under `docs/modules/ROOT/pages/` — note that skill runs against a `docs/`
  subdirectory convention used by other repos in this account, not this repo's own root-level `modules/`.
