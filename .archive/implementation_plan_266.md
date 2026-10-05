# Implementation plan — Fix not rendered figures in documentation

## Task summary

Some figures on the published site don't render. Instead of an `<img>`, the page shows the raw `image::<file>.svg[...`
macro text, because the block macro's alt text was hard-wrapped over several lines. Asciidoctor then treats the macro
as a plain paragraph and raises no error, so the Antora build still passes. There are three broken macros, on the
Azure, AWS and Google Cloud home pages. A fourth figure, `azure-aks-cluster-architecture.svg`, exists but no page
references it. `CLAUDE.md` gets new *Images and figures* guidance and fixes for four facts that are out of date.

Choices made on the user's behalf:
- The three broken macros are joined onto one line with their alt text **verbatim** (no caption/`title=` added). This
  is the smallest change and keeps the alt text unchanged in meaning, as the acceptance criteria require.
- The orphaned AKS figure is **kept and wired in**, not deleted. Its content (control plane, tiers, system/user node
  pools, Azure CNI Overlay + Cilium, private cluster, ACR, Key Vault, Azure Monitor) matches what the page covers. It
  goes in the page introduction, right after the "This page covers AKS as *cluster infrastructure*…" paragraph and
  before the `[source,bash]` `export` block. That paragraph lists exactly the topics the figure shows, so the figure
  works as an overview of the whole page.

Source: GitHub issue #266
Base branch: main

## Current code state

- Antora root component `ROOT` (`antora.yml`), playbook `antora-playbook.yml`. All figures live in
  `modules/ROOT/images/` and are referenced by bare filename (e.g.
  `modules/ROOT/pages/cloud/azure/cloud-concepts.adoc:98` →
  `image::azure-iaas-paas-saas-stack.svg[...,width=720]`, all on one line).
- Broken (multi-line) block macros, confirmed with `grep -rnE '^image::' modules | grep -vE '\]\s*$'`:
  - `modules/ROOT/pages/cloud/azure/index.adoc:87–91`: `azure-bookshelf-architecture.svg` (5 lines)
  - `modules/ROOT/pages/cloud/aws/index.adoc:88–93`: `aws-bookshelf-architecture.svg` (6 lines)
  - `modules/ROOT/pages/cloud/google-cloud/index.adoc:80–86`: `google-cloud-bookshelf-architecture.svg` (7 lines)
  - Each is preceded and followed by a blank line, followed by `== Reading path`.
- Orphaned image: a scan of every file in `modules/ROOT/images/` against `modules/ROOT/pages`, `nav.adoc` and
  `partials` finds exactly one orphan, `azure-aks-cluster-architecture.svg`.
- `modules/ROOT/pages/cloud/azure/aks-clusters.adoc`: the intro paragraphs run through line ~25, then come the
  `export RG/LOCATION/ACR` source block and `== AKS Automatic vs. AKS Standard` (line 29). The page has no `image::`
  yet.
- `CLAUDE.md` facts that are out of date:
  - It says the component is named `irurueta`; `antora.yml` has `name: ROOT`.
  - It lists `@antora/lunr-extension` as active; it is commented out at `antora-playbook.yml:112`.
  - The remote `content.sources` list is missing `irurueta-numerical`, `irurueta-geometry`, `irurueta-geometry-io`,
    `irurueta-ar`, `irurueta-navigation`, `irurueta-navigation-indoor`, `irurueta-navigation-inertial` and
    `irurueta-navigation-inertial-extra`.
  - It says `modules/ROOT/images/` holds only the project-picker icons; it now holds every guide's content figures.
- No tests and no language-specific skills apply. These are documentation-only (AsciiDoc/Markdown) tasks, so they
  carry no language tag. Verification is the Antora build plus grep audits.

## Implementation steps

### Group 1 — Content and guidance fixes (Parallelizable: yes, every task edits a different file)

- [x] Task 1. Join the three broken Bookshelf architecture macros onto one line each
  - [x] Task 1.1. In `modules/ROOT/pages/cloud/azure/index.adoc`, replace lines 87–91 with a single line
    `image::azure-bookshelf-architecture.svg[Bookshelf end-state architecture on AKS: Front Door in front of a static site on Blob Storage and an API Management gateway, ... and Azure Monitor observing everything]`.
    Join with single spaces and keep the alt text word-for-word. Keep the blank lines before and after.
  - [x] Task 1.2. Do the same in `modules/ROOT/pages/cloud/aws/index.adoc` (lines 88–93,
    `aws-bookshelf-architecture.svg`).
  - [x] Task 1.3. Do the same in `modules/ROOT/pages/cloud/google-cloud/index.adoc` (lines 80–86,
    `google-cloud-bookshelf-architecture.svg`).
  - [x] Task 1.4. Check that the alt text has no unescaped `]` or `,` that would split it into extra positional
    attributes. If a comma is present, wrap the whole alt text in double quotes (`image::x.svg["...,..."]`).
    Otherwise leave it bare.

- [x] Task 2. Wire `azure-aks-cluster-architecture.svg` into `modules/ROOT/pages/cloud/azure/aks-clusters.adoc`
  - [x] Task 2.1. After the "This page covers AKS as *cluster infrastructure*…" intro paragraph and before the
    `[source,bash]` `export` block, insert a single-line block macro at column 0 with a blank line on each side:
    ```asciidoc
    image::azure-aks-cluster-architecture.svg[AKS cluster architecture: a Microsoft-managed control plane (kube-apiserver, etcd, scheduler, controller-manager, cloud-controller-manager) billed by Free, Standard or Premium tier, and a virtual network holding a system node pool and autoscaled user and spot node pools on Azure CNI Overlay with the Cilium data plane, an optional private cluster or API server VNet integration, a Standard Load Balancer, and a kubelet managed identity pulling images from Azure Container Registry, Key Vault secrets mounted through the CSI secrets store driver, and Azure Monitor collecting Container Insights logs and managed Prometheus metrics shown in managed Grafana]
    ```
    Keep commas out of the alt text, or quote it (see Task 1.4). Re-read the SVG once to make sure every element
    named actually appears in it.

- [x] Task 3. Update `CLAUDE.md`
  - [x] Task 3.1. Add a new `## Images and figures` section after `## Architecture` covering:
    - All images go in `modules/ROOT/images/` and are referenced by bare filename (`image::foo.svg[...]`), with no
      `images/` prefix and no module path.
    - **A block image macro `image::target[alt, attrs]` must be on one line**, with the closing `]` on that line.
      Never hard-wrap alt text or attribute lists, even past the usual 120-column prose length. A wrapped macro
      silently renders as a plain paragraph showing the filename and alt text, and the Antora build reports no
      error. The same applies to inline `image:` macros.
    - Block macros start at column 0 (never indented), with a blank line before and after.
    - Every SVG added to `modules/ROOT/images/` must be referenced by at least one page. An orphaned image means
      the reference was forgotten.
    - Verification for doc changes, since a green build doesn't prove figures render. Both commands must print
      nothing:
      ```bash
      grep -rnE '^image::' modules | grep -vE '\]\s*$'      # block image macros not closed on the same line
      grep -rn 'image::' build/site --include=*.html         # unrendered macro text leaked into the built HTML
      ```
      Optionally also check that every `image::` target exists in `modules/ROOT/images/`, and that every image is
      referenced.
  - [x] Task 3.2. Fix the facts that are out of date:
    - In the `antora.yml` bullet, the component is named `ROOT`, not `irurueta`.
    - In the playbook bullet, say `@antora/lunr-extension` is currently commented out (site search disabled). Only
      the mermaid and MathJax extensions are active.
    - In the `content.sources` bullet, list all remote repos: `hermes`, `irurueta-units`, `irurueta-statistics`,
      `irurueta-sorting`, `irurueta-algebra`, `irurueta-numerical`, `irurueta-geometry`, `irurueta-geometry-io`,
      `irurueta-ar`, `irurueta-navigation`, `irurueta-navigation-indoor`, `irurueta-navigation-inertial`,
      `irurueta-navigation-inertial-extra` and `ai-catalog`.
    - In the `modules/ROOT/` bullet, say that `modules/ROOT/images/` holds the content figures for every guide as
      well as the project-picker icons.

### Group 2 — Repository-wide verification (Parallelizable: yes, a single task; depends on Group 1)

- [x] Task 4. Re-run the audit and the build
  - [x] Task 4.1. `grep -rnE '^image::' modules | grep -vE '\]\s*$'` must print nothing. Also check inline
    `image:` macros for an unclosed `[` at end of line, e.g.
    `grep -rnE 'image:[^:\[]+\[[^]]*$' modules --include=*.adoc`. Review any hits by hand, ignoring the known false
    positives inside `++…++`-escaped URLs in `apps/apple/ipados.adoc` and `apps/apple/index.adoc`.
  - [x] Task 4.2. Missing-target check: every `image::`/`image:` target under `modules/` exists in
    `modules/ROOT/images/`. Orphan check: every file in `modules/ROOT/images/` is referenced by at least one page
    (the expected result is zero orphans).
  - [x] Task 4.3. Build with `npx antora antora-playbook.yml` and confirm there are no new `xref`/AsciiDoc errors or
    warnings.
  - [x] Task 4.4. `grep -rn 'image::' build/site --include=*.html` must print nothing. Confirm that
    `build/site/cloud/azure/index.html`, `cloud/aws/index.html`, `cloud/google-cloud/index.html` and
    `cloud/azure/aks-clusters.html` each contain an `imageblock` with an `<img>` for the expected SVG.
