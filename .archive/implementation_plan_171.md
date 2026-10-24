# Implementation Plan: Guides & References / Backend Development — Terraform

## Task summary

Source: GitHub issue #171
Base branch: main

Issue [#171](https://github.com/albertoirurueta/docs/issues/171) asks for a new **Terraform** section under
*Guides & References → Backend Development*, placed right after Kubernetes. It is a practical, example-driven guide to
Terraform (and OpenTofu), authored directly into this repo's own `ROOT` Antora component.

The section is built from the official Terraform documentation (language, CLI, tutorials, registry, plugin development,
HCP Terraform, Terraform Enterprise, Stacks, Terraform Policy, release notes, the provider docs, and the OpenTofu docs).
It is cross-checked against two requester-provided books that are **not** committed and never copied:

* Hafner, *Terraform in Depth*, Manning, 2025
* Wang, *Terraform Made Easy*, Apress, 2024 (a Google Cloud angle, with several wrong or outdated snippets, so never a source for code)

The issue body is the specification. The issue comment **"Addendum: concepts contributed by each book"** is part of it:
it maps every book chapter's concepts to the page that must cover them. Re-read it in full (`gh issue view 171 --json
comments`) when auditing.

Deliverables:

1. **38 AsciiDoc pages** under `modules/ROOT/pages/backend/terraform/` (`index.adoc` with `== Bibliography`, plus 37 concept pages), plus **`cheat-sheet.adoc`**: 39 files.
2. **`modules/ROOT/attachments/terraform-cheat-sheet.pdf`**: one A4 page.
3. **`modules/ROOT/partials/terraform-disclaimer.adoc`**, included on every page.
4. **Site wiring:** nav entry after Kubernetes; bullet and metadata in `backend/index.adoc`; root `index.adoc` metadata.
5. **Back-links:** the seven "#171" mentions replaced by `xref:`s, plus a one-line back-link in `kubernetes/gitops-and-ci-cd.adoc`.

**Choices made on the user's behalf** (from codebase conventions and the Kubernetes precedent, `.archive/implementation_plan_162.md`):

* **Version baseline.** The issue states Terraform 1.17.0 (2026-10-21), OpenTofu 1.13.2, AWS provider v6, Google v8, `hashicorp/setup-terraform@v3`, Terraform Enterprise 2.0.x. **Re-verify every version, date and provider major** against the official docs before writing (the issue says so explicitly), and state the baseline in each page intro.
* **Running scenario.** *Bookshelf* (`catalog-api`, `reviews-api`, `web`, PostgreSQL, Redis, a covers bucket, network, DNS, secrets, IAM). Core pages run locally with the `kreuzwerker/docker` provider, the utility providers (`random`, `local`, `tls`, `time`, `null`) and LocalStack. Cloud variants live on the AWS / Azure / Google Cloud pages with a clean-up section.
* **Admonitions.** As in the Docker and Kubernetes sections, the disclaimer partial is the **only** admonition. Deprecations and "the book is outdated" remarks are prose or table rows.
* **Official-docs access.** If developer.hashicorp.com is blocked by the session egress policy, read the same content from the `hashicorp/web-unified-docs` GitHub repo. `Source:` links still point to the published docs.
* **Books.** Read from `~/Desktop/libros/terraform/` for concept narrative only. Nothing from them is copied, and the PDFs are never committed or attached. On any discrepancy the official docs win.
* **Figures.** `[mermaid]` blocks, or original `modules/ROOT/images/terraform-*.svg` drawings (no HashiCorp logos or diagrams, no book figures).
* **Task tags.** Every task is AsciiDoc/documentation authoring with no matching `*-code-one-task` skill, so tasks are untagged and implemented directly. HCL, Go, YAML and bash appear only as code listings.
* **Parallelism.** Pages are distinct files, so page groups are parallelizable. Pages link to each other by path, so forward xrefs to later groups are the only build warnings permitted until Group 15.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`index.adoc` exists. Terraform appears under Backend Development in `nav.adoc` right after Kubernetes, listing every page in order and ending with the cheat sheet." | Task 39, Task 42 |
| 2 | "`backend/index.adoc` has a Terraform bullet and updated `:description:` / `:keywords:`. The root `index.adoc` `:description:` / `:keywords:` mention Terraform." | Task 43 |
| 3 | "Every page in the outline exists" (foundations 4, language 7, plan/state 5, modules 2, changing 4, quality 3, automation 3, clouds 6, OpenTofu 1, putting together 3, plus the cheat sheet) | Tasks 2–38, Task 39, Task 40 |
| 4 | "Every area of the official Language and CLI docs is covered by at least one page … So is every row of both books' chapter tables in the addendum comment." | Task 52 |
| 5 | "Every page contains detailed information linked to the official documentation. Every ★ page is among the most detailed." | Tasks 2–38, Task 51 |
| 6 | "Every page has code examples … Each example is followed by a link to the official documentation page it derives from, follows the Bookshelf scenario, and contains no real credentials or state." | Tasks 2–38, Task 51 |
| 7 | "Deprecations, removals and outdated or wrong book statements are documented … `whats-changed-and-migration.adoc` collects them all." | Task 38, Task 52 |
| 8 | "Mermaid diagrams / `terraform-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`." | Tasks 2–39, Task 49 |
| 9 | "`terraform-disclaimer.adoc` exists and is included on every page under `backend/terraform/`." | Task 1, Task 51 |
| 10 | "`== Bibliography` on the landing page lists every source used, each linked … Each page has a `== References` section." | Task 39, Task 51 |
| 11 | "`cheat-sheet.adoc` exists and links `terraform-cheat-sheet.pdf`, a single-page A4 PDF summarising every concept." | Task 40, Task 41 |
| 12 | "The '#171' mentions … are replaced by `xref:`s … `gitops-and-ci-cd.adoc` gets a one-line back-link. No `xref:` points to a page that doesn't exist. #184 / #201 are referenced in prose only." | Tasks 44–48 |
| 13 | "The book PDFs are not committed or attached anywhere, and no book text, listing, figure or code is reproduced." | Task 51, Task 52 |
| 14 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings, the CLAUDE.md image, inline-code and Mermaid checks print nothing for the new pages, and the new pages render correctly in `build/site`." | Tasks 49–53 |

## Current code state

* **Repository shape.** This repo is the Antora playbook plus the root component (`antora.yml`: `name: ROOT`). Content is in `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`, and partials, images and PDFs in `modules/ROOT/partials/`, `images/`, `attachments/`. Mermaid is validated by `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`, after `npm i --no-save mermaid@11 jsdom`). The site builds with `npx antora antora-playbook.yml`. `CLAUDE.md` rules apply to every page: one-line `image::` macros, double-quoted alt text containing commas, passthrough for inline code containing `->`, `=>`, `__`, `*`, `~`, `^`, `...`, `'`, `{` or `+`, and `&lt;&lt;stereotype&gt;&gt;` entities in Mermaid.
* **Backend Development nav.** In `modules/ROOT/nav.adoc`, `*** xref:backend/kubernetes/index.adoc[Kubernetes]` is at ≈line 1580, with `****` children below it, followed by Media Optimization. The new Terraform entry goes between them.
* **Closest precedent.** The Kubernetes section (`backend/kubernetes/`, 39 topic pages + index + cheat sheet), built from `.archive/implementation_plan_162.md`:
  * `partials/kubernetes-disclaimer.adoc`: a single `[IMPORTANT]` block pointing at `xref:backend/kubernetes/index.adoc#_bibliography[the section bibliography]`
  * `backend/kubernetes/cheat-sheet.adoc`: intro, grouped `*Group* --` xref paragraphs and the `xref:attachment$kubernetes-cheat-sheet.pdf[…]` line
  * `attachments/kubernetes-cheat-sheet.pdf`: one A4 page from throwaway HTML via headless Chrome
  * `backend/kubernetes/index.adoc`: `[[_bibliography]]` / `== Bibliography`, "What's covered", and a table of related material elsewhere on the site
* **`backend/index.adoc`** has a `:description:`, a long `:keywords:` and one `* xref:…[…] -- …` bullet per section; the Kubernetes bullet is the last one.
* **Existing pages that mention #171** (each is edited, not rewritten):
  * `cloud/aws/infrastructure-as-code.adoc` (≈line 415), `cloud/azure/infrastructure-as-code.adoc` (≈line 253), `cloud/google-cloud/infrastructure-as-code.adoc` (≈line 37)
  * `cloud/aws/index.adoc` (≈467), `cloud/azure/index.adoc` (≈404), `cloud/google-cloud/index.adoc` (≈592)
  * `backend/kubernetes/index.adoc` (≈312)
* **Other pages to link, not repeat.** `cloud/google-cloud/developer-tools-and-devops.adoc`, `cloud/google-cloud/identity-and-access.adoc`, `cloud/aws/getting-started.adoc`, `backend/docker/*` (especially `ci-cd-with-github-actions.adoc`), `backend/kubernetes/*` (`helm.adoc`, `gitops-and-ci-cd.adoc`, `managed-kubernetes-and-distributions.adoc`), `database/redis/deploying-on-*.adoc`, and `git-and-github/*`. Verify each target with `ls` before writing an `xref:`.
* **Nothing to collide with.** No `backend/terraform/`, `terraform-disclaimer.adoc`, `terraform-*.svg` or `terraform-cheat-sheet.pdf` exists yet.
* **Prose-only references.** Issues #184 and #201 have no pages: mention them in prose, never with `xref:`.

## Implementation steps

**Conventions for every page task below** (from the issue's "Page conventions"):

* Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$terraform-disclaimer.adoc[]`.
* Intro states the baseline (Terraform 1.17, OpenTofu 1.13, provider majors, or whatever is current) and the page's place in the reading path.
* Detailed explanation: what the concept is and why it exists, core vs provider responsibility, every relevant argument / attribute / flag, the CLI commands, pitfalls, interactions with neighbouring concepts, and any Terraform vs OpenTofu difference.
* Complete runnable examples: `[source,hcl]` with `required_version` and `required_providers`, `[source,bash]` / `[source,console]` with abbreviated output, `[source,yaml]` for CI, `[source,go]` where needed. Each example is followed by `Source: https://developer.hashicorp.com/terraform/…[Title]`.
* "What changed recently" (the version that introduced, deprecated or removed a feature) and, for concepts the books touch, a prose passage on where the books are outdated or wrong, taken from the issue's tables.
* Ends with `== References`, listing only the official pages used (plus a book's publisher page if drawn on).
* No real credentials, account IDs, state or keys. Use placeholders and `TF_VAR_` / OIDC patterns.
* ★ pages are the most detailed in the section.
* No physical line starts with a bare `<number>.` token. Block image macros are on one line.
* Every task is docs-only, so no tests, coverage or quality tooling applies. Group validation is a Mermaid parse of the new blocks plus an Antora build in which forward xrefs to later groups are the only permitted warnings.

### Group 1 — Disclaimer partial (Parallelizable: yes)

- [x] Task 1. Create `modules/ROOT/partials/terraform-disclaimer.adoc`
  - [x] Task 1.1. Copy `kubernetes-disclaimer.adoc` word for word, changing only the xref target to `xref:backend/terraform/index.adoc#_bibliography[the section bibliography]`.
    - Created `modules/ROOT/partials/terraform-disclaimer.adoc` (only the xref target differs from the Kubernetes one; docs-only, no tests/coverage/quality applicable).

### Group 2 — Foundations (Parallelizable: yes — three distinct pages)

- [x] Task 2. `introduction-and-infrastructure-as-code.adoc` ★
  - [x] Task 2.1. IaC motivation, declarative vs imperative, idempotence, architecture (core, providers over the plugin protocol, state, registry), write → plan → apply, use cases, comparison with CloudFormation / Bicep / Pulumi / Crossplane / Ansible (link the cloud IaC pages).
  - [x] Task 2.2. Licensing history (MPL → BSL 1.1 on 2023-08-10, OpenTofu fork, IBM acquisition 2025-02-27), editions (CLI, HCP Terraform, Enterprise), and when Terraform is **not** the right tool.
  - [x] Task 2.3. 📊 SVG `terraform-core-provider-state.svg` (core ↔ provider ↔ API ↔ state); 📊 Mermaid of the core workflow.
  - [x] Task 2.4. `== References`.
- [x] Task 3. `getting-started.adoc` ★
  - [x] Task 3.1. Installation (Homebrew tap, apt / dnf, Windows, the `hashicorp/terraform` Docker image), version managers (tenv, tfenv, tfswitch, `.terraform-version`), editor support, shell completion.
  - [x] Task 3.2. The Docker get-started tutorial applied to *Bookshelf*: `init`, `fmt`, `validate`, `plan`, `apply`, `show`, `output`, `destroy`; plan output symbols; the `.terraform/` directory and `.gitignore`.
  - [x] Task 3.3. `== References`.
- [x] Task 4. `hcl-syntax-and-configuration-files.adoc` ★
  - [x] Task 4.1. Blocks, labels, arguments, attributes, nested blocks, comments, identifiers; JSON syntax variant; file types and loading (`.tf`, `.tf.json`, `.tfvars`, override files, `.tftest.hcl`, `.tfquery.hcl`, Stacks files, OpenTofu `.tofu`).
  - [x] Task 4.2. The `terraform` block (`required_version`, `required_providers`, `backend`, `cloud`, `experiments`), the full list of top-level block types, the style guide and `terraform fmt`.
  - [x] Task 4.3. `== References`.

### Group 3 — Configuration language I (Parallelizable: yes — four distinct pages)

- [x] Task 5. `providers.adoc` ★
  - [x] Task 5.1. Requirements and source addresses, version constraints, the dependency lock file (`providers lock` for several platforms, `init -upgrade`), configuration and authentication, aliases and multi-region / multi-account, passing providers to modules (`providers = {…}`, `configuration_aliases`).
  - [x] Task 5.2. Provider tiers, plugin cache, `providers mirror`, `.terraformrc` mirrors, provider-defined functions, variables and locals in provider requirements (1.17), OpenTofu provider `for_each`.
  - [x] Task 5.3. 📊 Mermaid of `init` resolving providers (registry, lock file, cache). `== References`.
- [x] Task 6. `resources-and-data-sources.adoc` ★
  - [x] Task 6.1. The `resource` block, arguments vs attributes, computed values, create / update / replace / destroy, `timeouts`; data sources (when read, depending on them); `terraform_data` with `store` (1.16); utility providers (`random`, `time`, `tls`, `null`).
  - [x] Task 6.2. 📊 Mermaid of the resource lifecycle (create, in-place update, replace). `== References`.
- [x] Task 7. `variables-outputs-and-locals.adoc` ★
  - [x] Task 7.1. Input variables (`type`, `default`, `description`, `validation` incl. cross-variable, `sensitive`, `nullable`, `ephemeral`, `deprecated`), precedence (defaults, `terraform.tfvars`, `*.auto.tfvars`, `-var-file`, `-var`, `TF_VAR_`), outputs (`sensitive`, `ephemeral`, `depends_on`, `precondition`), module outputs, locals.
  - [x] Task 7.2. Correct the Wang `tf.tfvars` and output `condition` errors in prose. 📊 Mermaid of variable-value precedence. `== References`.
- [x] Task 8. `types-and-expressions.adoc` ★
  - [x] Task 8.1. Types incl. `optional()` with defaults and conversion, references and named values, operators and precedence, conditionals, templates / heredocs / `%{ }` directives, `for` expressions, splat, dynamic blocks (and when not to use them), version constraints. `== References`.

### Group 4 — Configuration language II (Parallelizable: yes — three distinct pages)

- [x] Task 9. `functions.adoc`
  - [x] Task 9.1. The function library by category with *Bookshelf* examples (string, numeric, collection, encoding, filesystem incl. `templatefile` / `templatestring`, date/time `timestamp` vs `plantimestamp`, hash/crypto, IP network `cidrsubnet` / `cidrsubnets`, type conversion `try` / `can` / `convert`).
  - [x] Task 9.2. `sensitive` / `nonsensitive` / `issensitive`, `ephemeralasnull`, the `terraform::` functions, pure vs impure, `terraform console`. `== References`.
- [x] Task 10. `meta-arguments-count-for-each-and-depends-on.adoc` ★
  - [x] Task 10.1. `count` vs `for_each` with addresses, the unknown-values error and workarounds, `each` / `count` objects, why `for_each` is safer, `depends_on` and hidden dependencies, `provider` / `providers`, meta-arguments on modules.
  - [x] Task 10.2. 📊 Mermaid of address changes when an element is removed from a `count` list vs a `for_each` map. `== References`.
- [x] Task 11. `lifecycle-validation-and-checks.adoc` ★
  - [x] Task 11.1. `lifecycle` (`create_before_destroy`, `prevent_destroy`, `ignore_changes`, `replace_triggered_by`, `precondition`, `postcondition`, `action_trigger`), variable `validation`, `check` blocks with scoped data sources, how each failure affects plan / apply, OpenTofu `lifecycle { enabled }`, dynamic `prevent_destroy`, `destroy = false`. `== References`.

### Group 5 — Plan, apply and state (Parallelizable: yes — four distinct pages)

- [x] Task 12. `dependency-graph-and-plan.adoc` ★
  - [x] Task 12.1. The DAG (implicit vs explicit dependencies, `terraform graph`, parallelism), planning modes, `-replace`, `-target`, `-refresh=false`, `-minimal-refresh` (1.17), saved plans and `show -json`, apply options, and the pitfalls (cycles, cascading replacements, perpetual diffs, partial applies).
  - [x] Task 12.2. 📊 SVG `terraform-bookshelf-resource-graph.svg`; 📊 Mermaid sequence of plan → apply → state update. `== References`.
- [x] Task 13. `cli-essentials.adoc` ★
  - [x] Task 13.1. Every current CLI command grouped as the docs group them (init options, validate, fmt, plan / apply / destroy, show, output, console, graph, state, import, query, workspace, providers, modules, login / logout, force-unlock, test, version, stacks), global options, CLI configuration and the environment variables, deprecated commands and flags. Link the command reference. `== References`.
- [x] Task 14. `state.adoc` ★
  - [x] Task 14.1. Purpose, file format (`version`, `serial`, `lineage`), sensitive data in state, locking and `force-unlock`, inspection (`state list`, `show`, `identities`), changes (`state mv`, `rm`, `replace-provider`, `pull` / `push` and their dangers), backups, drift with `-refresh-only`. `== References`.
- [x] Task 15. `backends-and-remote-state.adoc` ★
  - [x] Task 15.1. `backend` block, partial configuration, migrating with `init -migrate-state`, the backend catalogue (`local`, `s3` with `use_lockfile` and the DynamoDB deprecation, `azurerm`, `gcs` with `bucket` / `prefix`, `pg`, `kubernetes`, `http`, `oci`, `consul`, `remote` vs `cloud`), securing state, OpenTofu state / plan encryption and early evaluation.
  - [x] Task 15.2. `terraform_remote_state` and alternatives; a LocalStack S3 backend example. 📊 SVG `terraform-remote-state-locking.svg`. `== References`.

### Group 6 — Environments and modules (Parallelizable: yes — three distinct pages)

- [x] Task 16. `workspaces-environments-and-project-structure.adoc`
  - [x] Task 16.1. CLI workspaces and their limits, directories vs workspaces vs HCP workspaces / projects, root-module layouts, monorepo vs polyrepo, DRY with `.tfvars`, Terragrunt, naming and tagging conventions.
  - [x] Task 16.2. 📊 Mermaid of the Bookshelf `envs/dev` and `envs/prod` layout. `== References`.
- [x] Task 17. `modules.adoc` ★
  - [x] Task 17.1. Root vs child modules, `source` types (local, registry, Git `?ref=`, HTTP, S3 / GCS, OCI in OpenTofu), `version`, variables and locals in `source` / `version` (1.15), inputs / outputs, `terraform get`, `terraform modules`, finding and evaluating third-party modules. `== References`.
- [x] Task 18. `module-development-and-publishing.adoc` ★
  - [x] Task 18.1. Standard module structure, design and composition, validation and `optional()` objects, terraform-docs, templates, SemVer and tagging, publishing to public and private registries; build the Bookshelf `network`, `database` and `service` modules.
  - [x] Task 18.2. 📊 Mermaid of module composition. `== References`.

### Group 7 — Changing existing infrastructure (Parallelizable: yes — four distinct pages)

- [x] Task 19. `import-and-query.adoc` ★
  - [x] Task 19.1. `terraform import` vs `import` blocks (`for_each`, identity-based, inside modules since 1.16), `plan -generate-config-out`, bulk import, list resources / `.tfquery.hcl` / `terraform query` (1.14), HCP search and import, link the Google bulk-export page. `== References`.
- [x] Task 20. `refactoring-moved-and-removed.adoc` ★
  - [x] Task 20.1. Internal vs external refactoring, `moved` blocks (rename, into modules, `count` → `for_each`, cross-module), `removed` blocks, `state mv` / `rm` as legacy, the `deprecated` attribute, module breaking changes.
  - [x] Task 20.2. 📊 Mermaid of a refactor with `moved` vs the destroy/create plan without it. `== References`.
- [x] Task 21. `sensitive-data-ephemeral-and-write-only.adoc` ★
  - [x] Task 21.1. Threat model, `sensitive` and its limits, ephemeral resources / variables / outputs, `ephemeralasnull`, write-only `*_wo` arguments, the `terraform_data` `store` block, reading secrets from Vault / AWS / Azure / Google, `random_password` vs ephemeral equivalents. `== References`.
- [x] Task 22. `provisioners-actions-and-post-apply-operations.adoc`
  - [x] Task 22.1. Provisioners (`local-exec`, `remote-exec`, `file`, `connection`, `when = destroy`, `on_failure`) and why they are a last resort, `terraform_data` with `triggers_replace`, `cloud-init`, the `external` and `local` providers, `action` blocks (`-invoke`, `action_trigger`, `on_failure`), Ansible and Packer hand-off. `== References`.

### Group 8 — Quality, testing and policy (Parallelizable: yes — three distinct pages)

- [x] Task 23. `testing.adoc` ★
  - [x] Task 23.1. Testing theory; `terraform test` (`.tftest.hcl`, `run`, `assert`, `expect_failures`, variables and providers, `mock_provider`, `override_*`, ephemeral mocks 1.17, parallelism, JUnit XML); Terratest in Go; testing modules from `examples/`; LocalStack; CI. `== References`.
- [x] Task 24. `code-quality-and-security-scanning.adoc` ★
  - [x] Task 24.1. `fmt` / `validate`, TFLint rulesets, terraform-docs, pre-commit-terraform, Checkov (built-in and custom) and Trivy (replacing tfsec), Infracost, Dependabot / Renovate, a Makefile. Use real current output, `checkov -f` for single files. `== References`.
- [x] Task 25. `policy-as-code.adoc`
  - [x] Task 25.1. Why policy as code; Sentinel (policy sets, enforcement levels, `tfplan/v2`); OPA / Rego and Conftest; Terraform Policy (`-policies`) at its current maturity; custom Checkov / TFLint rules. `== References`.

### Group 9 — Automation and platforms (Parallelizable: yes — three distinct pages)

- [x] Task 26. `ci-cd-and-automation.adoc` ★
  - Written `ci-cd-and-automation.adoc (1262 lines)` in modules/ROOT/pages/backend/terraform/; docs-only (no tests/coverage); Mermaid parsed, Antora build shows only forward-xref warnings.
  - [x] Task 26.1. Running in automation (`TF_IN_AUTOMATION`, `-input=false`, saved plans and their secrecy); a GitHub Actions pipeline (fmt / validate / lint / test / plan comment on PR, apply on merge with approval) using `hashicorp/setup-terraform@v3` and `opentofu/setup-opentofu`; a Terraform + OpenTofu matrix; OIDC to AWS / Azure / Google Cloud (link the identity pages); GitOps and drift; Atlantis; GitLab CI briefly; branch protection (link `git-and-github`).
  - [x] Task 26.2. 📊 Mermaid of PR → plan → review → merge → apply. `== References`.
- [x] Task 27. `hcp-terraform-and-enterprise.adoc` ★
  - Written `hcp-terraform-and-enterprise.adoc (1296 lines)` in modules/ROOT/pages/backend/terraform/; docs-only (no tests/coverage); Mermaid parsed, Antora build shows only forward-xref warnings.
  - [x] Task 27.1. Organizations, projects, workspaces, the `cloud` block, run modes, agents, variable sets, dynamic provider credentials, private registry and no-code modules, run tasks, health / drift detection, change requests, explorer, pricing (managed resources, free-tier change), Terraform Enterprise 2.0.x, other CD platforms in one paragraph. `== References`.
- [x] Task 28. `terraform-stacks.adoc`
  - Written `terraform-stacks.adoc (1020 lines)` in modules/ROOT/pages/backend/terraform/; docs-only (no tests/coverage); Mermaid parsed, Antora build shows only forward-xref warnings.
  - [x] Task 28.1. The problem Stacks solve, `*.tfcomponent.hcl` / `*.tfdeploy.hcl`, deployment groups and auto-approve rules, `publish_output` / `upstream_input`, `identity_token`, the `terraform stacks` CLI, Stacks vs Terragrunt vs workspaces.
  - [x] Task 28.2. 📊 Mermaid of a Stack with components fanned out to deployments. `== References`.

### Group 10 — Clouds and providers (Parallelizable: yes — four distinct pages)

- [x] Task 29. `terraform-on-aws.adoc` ★
  - [x] Task 29.1. `hashicorp/aws` v6 (authentication, `default_tags`, `assume_role`, multi-region aliases), S3 backend with `use_lockfile`, the Bookshelf baseline (VPC, ECS / Fargate or EC2, RDS PostgreSQL, ElastiCache, S3, IAM), terraform-aws-modules, LocalStack, the v5 → v6 upgrade guide, AWS Prescriptive Guidance; link `cloud/aws/*` and do not repeat service explanations; include a clean-up section. `== References`.
- [x] Task 30. `terraform-on-azure.adoc` ★
  - [x] Task 30.1. `azurerm` / `azapi` / `azuread` (CLI / OIDC / managed identity, `features {}`, `resource_provider_registrations`), the `azurerm` backend, the Bookshelf baseline on Azure, Azure Verified Modules; link `cloud/azure/*`; clean-up section. `== References`.
- [x] Task 31. `terraform-on-google-cloud.adoc` ★
  - [x] Task 31.1. `google` / `google-beta` (ADC, impersonation, WIF), the `gcs` backend, link the existing `cloud/google-cloud/infrastructure-as-code.adoc` baseline instead of duplicating it, Infrastructure Manager, terraform-google-modules / Cloud Foundation Fabric, Google's best practices, and Wang's chapters 4–5 rebuilt with current resources (Cloud Run v2, Cloud Functions gen 2, Artifact Registry, current Cloud SQL); clean-up section. `== References`.
- [x] Task 32. `docker-kubernetes-and-helm-providers.adoc`
  - [x] Task 32.1. `kreuzwerker/docker` (the local Bookshelf), `kubernetes` and `helm` providers (configuration from a cluster resource, the two-phase apply problem, `_v1` resources, `kubernetes_manifest`), when to hand off to GitOps / Helm (link the Kubernetes section), creating EKS / AKS / GKE. `== References`.

### Group 11 — Extending, integrating and OpenTofu (Parallelizable: yes — three distinct pages)

- [x] Task 33. `provider-development.adoc`
  - [x] Task 33.1. Plugin protocol and schemas, the Plugin Framework in Go (provider / resource / data source / ephemeral resource / function / action, plan modification, private state, logging), `dev_overrides`, acceptance tests with `terraform-plugin-testing`, tfplugindocs, GoReleaser and GPG, registry publishing; a tiny original *Bookshelf* provider wrapping its REST API. `== References`.
- [x] Task 34. `machine-readable-output-and-integrations.adoc`
  - [x] Task 34.1. JSON configuration syntax, `-json` JSON Lines UI, JSON plan / state, `providers schema -json`, wrapping Terraform from Python or Go (`terraform-exec`), the CDKTF deprecation (archived 2025-12-10) and `cdktf synth --hcl`, the Terraform MCP server. `== References`.
- [x] Task 35. `opentofu.adoc` ★
  - [x] Task 35.1. History and governance, compatibility (state, providers, registry), version mapping, installing `tofu`, migrating both ways, `.tofu` files, OpenTofu-only features (state / plan encryption, early evaluation, provider `for_each`, `-exclude`, OCI registry, `lifecycle { enabled }`, 1.12–1.13 additions), Terraform-only features, choosing between them.
  - [x] Task 35.2. 📊 Mermaid timeline of the fork. `== References`.

### Group 12 — Putting it together (Parallelizable: yes — three distinct pages; `bookshelf-end-to-end.adoc` only links earlier pages by path)

- [x] Task 36. `best-practices-and-troubleshooting.adoc`
  - [x] Task 36.1. Consolidated best practices (HashiCorp style guide and recommended practices, AWS / Google / Azure guides), network design with `cidrsubnet`, debugging with `TF_LOG` / `TF_LOG_CORE` / `TF_LOG_PROVIDER` and crash logs, common errors and fixes. `== References`.
- [x] Task 37. `bookshelf-end-to-end.adoc` ★
  - [x] Task 37.1. Provision all of *Bookshelf* from scratch: `network` / `database` / `service` modules, dev and prod, LocalStack S3 backend with locking, ephemeral / write-only secrets, checks, mock tests, TFLint / Checkov, GitHub Actions with OIDC, a real-cloud variant, an `import` of a pre-existing resource and a `moved` refactor. Show the final repository layout.
  - [x] Task 37.2. 📊 SVG `terraform-bookshelf-overview.svg`. `== References`.
- [x] Task 38. `whats-changed-and-migration.adoc`
  - [x] Task 38.1. Collect every deprecation, removal and version change: the "book era → current" tables, upgrade guides 1.10 → 1.17, provider majors (AWS v6, Google v7/v8, AzureRM v4), Terraform Cloud → HCP Terraform, CDKTF archival, DynamoDB → `use_lockfile`, tfsec → Trivy, the licensing timeline. Re-verify every date. `== References`.

### Group 13 — Landing page and cheat-sheet page (Parallelizable: yes — two distinct files; both need every earlier page's final title and path)

- [x] Task 39. `index.adoc` — "Terraform"
  - [x] Task 39.1. What Terraform is and who the section is for, baseline and release cadence in prose, the Bookshelf scenario, the reading path.
  - [x] Task 39.2. `== What's covered`, grouped as the outline, one `xref:` + description per page. Verify all 37 filenames with `ls` first.
  - [x] Task 39.3. A "where related material lives elsewhere on this site" table (the issue's existing-pages table, as xrefs). #184 / #201 in prose only.
  - [x] Task 39.4. `[[_bibliography]]` / `== Bibliography` with every group from the issue's Bibliography section, every entry linked to its official site; the two books get a full citation, ISBN and publisher link (Manning, Springer); note that the official docs win on any discrepancy.
  - [x] Task 39.5. 📊 SVG `terraform-bookshelf-infrastructure.svg`; 📊 Mermaid `mindmap` of the section.
- [x] Task 40. `cheat-sheet.adoc` — "Terraform Cheat Sheet"
  - [x] Task 40.1. Mirror `backend/kubernetes/cheat-sheet.adoc`: disclaimer include, intro with the baseline linking `xref:attachment$terraform-cheat-sheet.pdf[downloadable PDF]`, grouped `*Group* --` xref paragraphs to all topic pages, and a final `xref:attachment$terraform-cheat-sheet.pdf[Download the Terraform Cheat Sheet (PDF)]`.
  - Done: index.adoc (+ terraform-bookshelf-infrastructure.svg, mindmap) and cheat-sheet.adoc; no tests (docs-only); Mermaid/xmllint/source greps clean; full Antora build pending (run by caller).

### Group 14 — Cheat-sheet PDF (Parallelizable: yes)

- [x] Task 41. Produce `modules/ROOT/attachments/terraform-cheat-sheet.pdf` — one A4 portrait page (594.96×841.92 pt), 5-column layout matching the Kubernetes cheat sheet (Arial/Menlo, colour-coded bordered boxes, version header, breadcrumb footer); HTML kept in the session scratchpad; no tests/coverage/quality gates apply (binary docs attachment).
  - [x] Task 41.1. Inspect `kubernetes-cheat-sheet.pdf` (PyMuPDF / `pdftotext`) to match palette, fonts, colour-coded bordered boxes, header version line and breadcrumb footer ("Guides & References › Backend Development › Terraform").
  - [x] Task 41.2. Write the HTML/CSS layout **in the session scratchpad, not the repo**, covering every bullet of the issue's "Cheat sheet" section: workflow, CLI and env vars, HCL skeleton, types / expressions / 15 functions, meta-arguments, variable precedence, validation, state and backends, modules, refactoring and import, secrets, testing, quality and policy, CI / OIDC, HCP Terraform and Stacks, Terraform vs OpenTofu, troubleshooting table, and the "changed since older tutorials" strip.
  - [x] Task 41.3. Render with headless Chrome (`--headless --print-to-pdf`) on A4 portrait. Verify exactly one page of ~595×842 pt. Fix overflow by layout, never by dropping content or shrinking below legibility.

### Group 15 — Site wiring (Parallelizable: yes — three distinct files)

- [x] Task 42. `modules/ROOT/nav.adoc` — Terraform block (index + 37 topic pages + cheat sheet, 39 lines) inserted after the last Kubernetes entry, before Media Optimization; every xref target verified to exist.
  - [x] Task 42.1. Insert `*** xref:backend/terraform/index.adoc[Terraform]` after the last `backend/kubernetes/*` entry and before Media Optimization.
  - [x] Task 42.2. Add `****` children for the 37 topic pages in outline order, ending with `**** xref:backend/terraform/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 43. `modules/ROOT/pages/backend/index.adoc` and `modules/ROOT/pages/index.adoc` — Terraform bullet after Kubernetes; backend `:description:` mentions Terraform/OpenTofu and 33 issue keywords appended (none duplicated); root `:description:` mentions Terraform and OpenTofu, `OpenTofu, infrastructure as code, HCL` added (Terraform already present); no `pass:` in descriptions.
  - [x] Task 43.1. Add a `* xref:backend/terraform/index.adoc[Terraform] -- …` bullet after the Kubernetes bullet, ending "plus a downloadable cheat sheet".
  - [x] Task 43.2. Update `:description:` and append the issue's keyword list to `:keywords:` (skip duplicates).
  - [x] Task 43.3. Root `index.adoc`: mention Terraform in `:description:`; add `Terraform, OpenTofu, infrastructure as code, HCL` to `:keywords:` if absent.

### Group 16 — Back-links (Parallelizable: yes — every task edits a distinct file)

Each is one sentence or clause. No restructuring and no admonitions.

- [x] Task 44. `cloud/aws/infrastructure-as-code.adoc`: replace the "#171" sentence with an `xref:backend/terraform/terraform-on-aws.adoc[…]`. — done: `cloud/aws/infrastructure-as-code.adoc` links Terraform on AWS.
- [x] Task 45. `cloud/azure/infrastructure-as-code.adoc`: same, linking `terraform-on-azure.adoc`. — done: `cloud/azure/infrastructure-as-code.adoc` links Terraform on Azure.
- [x] Task 46. `cloud/google-cloud/infrastructure-as-code.adoc`: same, linking `terraform-on-google-cloud.adoc`. — done: `cloud/google-cloud/infrastructure-as-code.adoc` links Terraform on Google Cloud.
- [x] Task 47. `cloud/aws/index.adoc`, `cloud/azure/index.adoc`, `cloud/google-cloud/index.adoc` and `backend/kubernetes/index.adoc`: replace each issue mention with `xref:backend/terraform/index.adoc[Terraform]`. — done: the three cloud index pages and `backend/kubernetes/index.adoc` link the Terraform section; #184/#201 stay prose.
- [x] Task 48. `backend/kubernetes/gitops-and-ci-cd.adoc`: add a one-line back-link to the Terraform CI/CD and Kubernetes-provider pages. — done: one sentence before References links CI/CD and Automation and the Docker, Kubernetes and Helm Providers page.

### Group 17 — Validation, build and acceptance audit (Parallelizable: no — verifies the output of every prior group)

- [x] Task 49. Mermaid validation: `npm i --no-save mermaid@11 jsdom`, then `npm run validate:mermaid`; fix every failing block.
- [x] Task 50. Antora build: `npx antora antora-playbook.yml` must finish with zero `xref` / AsciiDoc errors and warnings; `build/site/backend/terraform/*.html` has 39 pages and the section sits after Kubernetes.
- [x] Task 51. CLAUDE.md checks and page audit
  - [x] Task 51.1. Run the three image greps and the inline-code substitution grep from `CLAUDE.md` (quoted `--include` patterns; the last one against `build/site/backend/terraform`); all must print nothing. Check alt-text commas on the new `.adoc` files.
  - [x] Task 51.2. Every page has `:description:`, `:keywords:`, the disclaimer include, `Source:` links after examples and `== References`; no admonitions other than the partial; every `image::terraform-*.svg` resolves and every `terraform-*.svg` is referenced.
  - [x] Task 51.3. Scan the rendered text for backtick / quote / bare `+` / `[[x]]` defects (not only the CLAUDE.md greps); no real credentials; no book text, listings or figures; no book PDFs in git status. Run `iru-check-security`.
- [x] Task 52. Acceptance audit against the issue
  - [x] Task 52.1. Walk both addendum tables row by row and confirm each concept appears on its target page; walk the official Language and CLI areas and confirm each has a page; confirm `whats-changed-and-migration.adoc` collects every "outdated or wrong" row.
  - [x] Task 52.2. Confirm no `xref:` points to a missing page and that #184 / #201 appear in prose only.
  - Group 17 audit: added Cookiecutter (module-development), why HCL vs JSON/YAML (hcl-syntax), PowerShell `$Env:TF_VAR_` (variables), module `depends_on` since 0.13 (meta-arguments), `aws_s3_bucket_acl` / `aws_db_instance` (terraform-on-aws), 13 Wang rows in whats-changed, `== References` on index; fixed modules.adoc end-to-end claim and LocalStack URL. Secret scan: 11 findings, all placeholders. Tasks 51, 51.1, 51.3, 53, 53.1 await the post-edit build.
- [x] Task 53. Final check
  - [x] Task 53.1. `terraform-cheat-sheet.pdf` is one A4 page, the cheat sheet's download link resolves under `_attachments/`, and a visual spot check of the landing page, one ★ page and the cheat sheet in `build/site` renders correctly.
