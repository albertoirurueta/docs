# Implementation Plan: Guides & References / Cloud — Azure

## Task summary

Source: GitHub issue #192
Base branch: main

Issue [#192](https://github.com/albertoirurueta/docs/issues/192) asks for a new **Cloud** area under **Guides &
References**, whose first section is **Azure** (`modules/ROOT/pages/cloud/azure/`). It is a practical guide to
learning and using Microsoft Azure from the portal and the CLI, cross-checked against two O'Reilly books and the
current official Microsoft documentation.

The issue body is the primary spec. Its **"Addendum: concepts contributed by each book" comment**
(https://github.com/albertoirurueta/docs/issues/192#issuecomment-5849862932) is part of it and holds the two books'
chapter-by-chapter concept tables plus a condensed list of key official reference links. Any task below that needs
the exact chapter contents must read that comment in full (`gh issue view 192 --comments`).

Choices made during exploration/planning (none of them ambiguous enough to ask about; recorded here per this
skill's Step 4):

1. **Ship everything in one pass**, exactly as specified: 36 content pages (including `index.adoc`) +
   `cheat-sheet.adoc` + the one-page PDF. No consolidation.
2. **Tasks are untagged (no language key).** `.claude/skills/*-code-one-task` only covers `java`,
   `java-springboot`, `dotnet` and `database` — none apply to authoring AsciiDoc/SVG/PDF documentation, so every
   task here is implemented directly, mirroring `.archive/implementation_plan_187.md` (Vector Databases & RAG).
   The CLI/Bicep/Java/.NET/Python snippets inside the pages are page *content*, not repository source.
3. **Disclaimer shape follows the #145/#187 rule.** `azure-disclaimer.adoc` contains only the AI-assistance
   sentence and the bibliography pointer. No other admonition appears anywhere in the section. The version/tool
   baseline goes in prose on each page, not in the admonition.
4. **The books are named only in `index.adoc`'s `== Bibliography`**, never as the source of a command or code
   example. Where a book is outdated (Azure Active Directory, Azure Blueprints, CDN from Akamai/Edgio, Azure Cache
   for Redis, single-server PostgreSQL/MySQL, Cosmos DB MongoDB vCore naming, …), pages say "the current approach
   is X" in plain prose, citing the official docs — with no book reference attached to the correction.
5. **Versions are re-verified at implementation time.** Baseline established by this session's research
   (checked 2026-09-26); re-check each one against the live docs before publishing:

   | Component | Baseline |
   |---|---|
   | Azure CLI | 2.90.0 |
   | Bicep | 0.47.16 |
   | azd | 1.34.2 |
   | `containerapp` CLI extension | 1.3.0b5 (preview only; GA commands are in CLI core) |
   | `aks-preview` extension | 22.0.0b8 (preview only) |
   | AKS Kubernetes versions | 1.35 / 1.36 GA, 1.37 preview |
   | KEDA on AKS | 2.19 (1.36) / 2.20 (1.37) |
   | Container Apps Express | GA 2026-09-23 |
   | pgvector | 0.8.6 |
   | Azure Managed Redis | current first-party Redis Enterprise-based service |
   | Azure DocumentDB | renamed from Cosmos DB for MongoDB vCore on 2025-11-18 |

6. **One running scenario, *Bookshelf*.** Defined once below so pages authored in parallel stay consistent without
   needing to coordinate live.

## Current code state

- There is **no `modules/ROOT/pages/cloud/` directory**, no `partials/azure-disclaimer.adoc`, no
  `images/cloud.svg` / `images/azure-*.svg` and no `attachments/azure-cheat-sheet.pdf`. No page on this site
  documents any Azure service as a first-class topic (existing Azure mentions are all incidental — see the
  cross-link table below).
- **`modules/ROOT/nav.adoc`**: the Apps block ends with (per the current file)
  `*** xref:apps/apple/index.adoc[Apple Platforms (iOS, iPadOS, macOS, watchOS, visionOS)]` and its `****`
  children, and the very next top-level (`**`) line is
  `** xref:git-and-github/index.adoc[Git & GitHub]`. The new `** xref:cloud/index.adoc[Cloud]` block goes between
  them. Match on this text, not on line numbers — other sections may land first.
- **`modules/ROOT/pages/index.adoc`**: `== Guides & References` (around line 94) has a 3-column borderless table
  (`[cols="1,1,1",frame=none,grid=none]`) of `image::<name>.svg[xref="<section>/index.adoc"]` cells, in the order
  programming-languages, databases, web-development, backend-development, apps, git-and-github. The new `cloud`
  tile goes between the `apps` cell and the `git-and-github` cell. `:description:` and the long `:keywords:` line
  (line 3) also need the addition described in the issue.
- **Page shape to mirror** (`database/vector-rag/*.adoc`, `database/redis/*.adoc`, `apps/apple/*.adoc`):
  * header: `= Title`, `:description:` (one sentence), `:keywords:`, a blank line, the disclaimer include, then a
    lead paragraph and `==` sections
  * landing pages (`cloud/index.adoc`, `cloud/azure/index.adoc`): a reading-order paragraph, `== What's covered`
    / `== Sections` (grouped bullets) and, on the Azure page only, `== Bibliography`
  * footer: `== Related pages` (`xref:` list, optional) then a mandatory `== References` (online docs only)
  * cheat-sheet pages (`database/vector-rag/cheat-sheet.adoc`, `git-and-github/cheat-sheet.adoc`): grouped
    back-link paragraphs ending with `xref:attachment$<x>-cheat-sheet.pdf[Download … (PDF)]`
- **Figures**: `modules/ROOT/images/*.svg` are hand-authored SVGs with these conventions: a `viewBox`,
  `font-family="Helvetica, Arial, sans-serif"`, a flat light background, hard-coded hex colours, no CSS variables
  and no external references. Pages embed them with `image::<name>.svg[…]`. Mermaid blocks are `[mermaid]` +
  `....`, validated by `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`, needs
  `npm i --no-save mermaid@11 jsdom`).
- **Cheat-sheet PDF pipeline** (from `.archive/implementation_plan_121.md` / `.archive/implementation_plan_187.md`):
  1. Hand-author a single-page A4 HTML/CSS layout **in the scratchpad, never the repo**.
  2. Render with `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
     --print-to-pdf=<out> --no-pdf-header-footer <file.html>`.
  3. Verify with PyMuPDF (`python3 -c "import fitz; d=fitz.open('x.pdf'); print(d.page_count, d[0].rect)"` —
     PyMuPDF is installed; `pdfinfo` is not) that it is exactly 1 A4 page, and render a PNG preview to check
     nothing is clipped.
  4. Copy only the rendered PDF to `modules/ROOT/attachments/`; confirm via `git status --porcelain` that no
     `.html` scratch file ever lands in the repo.
- **Existing pages to link, never repeat** (from the issue's "What already exists" table and the earlier
  exploration agent's repo-overlap report):

  | Existing page | Link from |
  |---|---|
  | `database/redis/deploying-on-azure.adoc` (+ AWS/GCP siblings) | `redis-and-partner-databases.adoc` |
  | `backend/springboot/file-storage-and-object-stores.adoc` | `blob-storage.adoc`, `storage-accounts.adoc` |
  | `backend/springboot/configuration-and-profiles.adoc` (`=== Kubernetes ConfigMaps and Secrets`) | `runtime-configuration.adoc` |
  | `web/aspnet/core/deployment.adoc`, `aspire-and-cloud-native.adoc`, `configuration-and-options.adoc`, `security-hardening.adoc` | `container-apps.adoc`, `app-service-and-functions.adoc`, `key-vault-and-secrets.adoc`, `runtime-configuration.adoc` |
  | `backend/docker/orchestration-swarm-and-kubernetes.adoc`, `registries-and-docker-hub.adoc`, `ci-cd-with-github-actions.adoc` | `container-registry.adoc`, `aks-clusters.adoc`, `aks-microservices.adoc` |
  | `database/vector-rag/comparing-vector-databases.adoc`, `postgresql-pgvector.adoc` | `managed-databases-overview.adoc`, `postgresql-and-mysql.adoc` |
  | `backend/quarkus/serverless-and-cloud-functions.adoc`, `kubernetes-and-openshift.adoc` | `app-service-and-functions.adoc`, `aks-microservices.adoc` |
  | `backend/oauth/social-login-and-federation.adoc`, `backend/springboot/spring-security-authorization-server.adoc`, `backend/quarkus/security-jwt-oidc-and-keycloak.adoc` | `identity-and-access.adoc` |
  | `backend/messaging/protocols.adoc`, `backend/quarkus/messaging.adoc` | `messaging-and-integration.adoc` |
  | `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc` | `gateways-and-load-balancing.adoc`, `api-management.adoc` |
  | `web/aspnet/mvc/data-access-ef6.adoc` (`SqlAzureExecutionStrategy`) | `azure-sql.adoc` |
  | `backend/quarkus/scheduling-and-mail.adoc`, `backend/springboot/configuration-and-profiles.adoc` (`MailSender`) | `email-with-communication-services.adoc` |

  Each gets **one added sentence or bullet**, never repeated content.
- **Related open issues**, referenced in plain prose only (no `xref:` to a page that doesn't exist): #171
  (Terraform), #184 (API managers, secret managers, gateways & scaling in the cloud).
- **Verification** is the Antora build (`npx antora antora-playbook.yml`, zero errors/warnings) plus the Mermaid
  validator, run through a sub-agent so build output doesn't fill the main context. There is no test/coverage/
  quality tooling for AsciiDoc; "validation" for every task below is just "the file exists, is well-formed
  AsciiDoc, and its xrefs eventually resolve" — checked for real only in the final Build and verify group.
- **AsciiDoc gotchas** (hit repeatedly in earlier sections, per `.archive/implementation_plan_187.md`):
  * Outside `[source]` blocks, a literal `{word}` is an attribute reference and emits "skipping reference to
    missing attribute". This section's prose is full of braces: JSON/Bicep objects, KQL queries, shell variable
    expansions (`${RG}`), set-like metadata. Escape them as `\{ … \}` in prose, table cells and bullet text.
  * Never let a wrapped line start with `<digits>.` (e.g. a bare year like `2026.`), because it becomes an
    ordered-list marker.
- **Precedents**: `.archive/implementation_plan_187.md` (Vector Databases & RAG) for the section structure,
  conventions, and the wiring/verify groups; `.archive/implementation_plan_169.md` / `_170.md` (Android / Apple
  Platforms) for how a very large multi-page section was still delivered as one plan (even though those were
  eventually split across several PRs — this plan stays a single PR per the issue's own "hard, consider
  splitting" note, revisited only if execution turns out to be unworkable in one pass).

## Shared *Bookshelf* scenario

Every content page uses these names, so pages authored in parallel stay consistent.

*Bookshelf* is a small microservice application: a static web front end, a `catalog-api` (Spring Boot), an
`orders-api`, and a `notifier` worker that sends order-confirmation emails.

| Concern | Name / value |
|---|---|
| Resource group | `rg-bookshelf` |
| Region | `eastus2` (examples note this is a placeholder — pick the region closest to the reader) |
| ACR | `acrbookshelf` |
| Container Apps environment | `cae-bookshelf` |
| Container Apps | `catalog-api`, `orders-api`, `notifier` (as a job) |
| AKS cluster | `aks-bookshelf` |
| Storage account (static site + Blob) | `stbookshelf` |
| Front Door profile | `afd-bookshelf` |
| PostgreSQL flexible server | `pg-bookshelf` (database `catalog`) |
| Azure DocumentDB / Cosmos cluster | `docdb-bookshelf` (database `orders`) |
| Azure Managed Redis | `redis-bookshelf` |
| Key Vault | `kv-bookshelf` |
| App Configuration store | `appcs-bookshelf` |
| API Management | `apim-bookshelf` |
| VPN Gateway / VNet | `vnet-bookshelf`, `vgw-bookshelf` |
| Email Communication Service | `acs-bookshelf`, domain `DoNotReply@<managed-domain>` in examples |
| Java package | `com.example.bookshelf` |
| Shell variables used throughout | `$RG`, `$LOCATION`, `$ACR`, `$ENV`, `$APP` … (never real subscription/tenant IDs) |

## Conventions every content page must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:`, a blank line,
  `include::partial$azure-disclaimer.adoc[]`, then a lead paragraph stating the tool/version baseline the page's
  examples target (from the table above, re-verified at implementation time).
- **Two subsections per hands-on concept**: `=== In the Azure portal` (numbered blade-path steps, no
  screenshots) and `=== With the Azure CLI` (`[source,bash]` blocks using the shared shell variables). Every
  command/code example is followed by a link to the official page it derives from. Where the CLI genuinely can't
  do something (e.g. APIM v2 SKUs), say so in prose and show Bicep or `az rest` instead.
- **Application-side code** (where the page shows how an app uses the service) uses Java/Spring Boot as the
  default language, with .NET or Python only where the official quickstart is clearly better, and always
  `DefaultAzureCredential` / managed identity over connection strings or keys.
- **Pricing, limits, and what changed recently** are covered in prose (never an admonition), with dated links to
  the official pricing/retirement pages.
- **`== Clean up`** on every page that creates resources (`az group delete --name "$RG" --yes --no-wait`, plus any
  purge step such as Key Vault/APIM soft-delete).
- **`== References`** at the end of every page, linking only the official documentation it derives from.
- **No admonitions** anywhere in the section except the disclaimer include. Retirement dates, cost warnings,
  preview-feature caveats and security caveats are prose or table rows.
- **No real subscription IDs, tenant IDs, keys, connection strings or secrets** — placeholders only
  (`<subscription-id>`, `$(az … --query … -o tsv)`).
- **Figures**: add a `[mermaid]` block or an `azure-*.svg` in `modules/ROOT/images/` at least everywhere the
  issue's 📊 floor asks for one. Each task authors the SVGs its own page embeds; SVGs are original drawings, not
  copies of Microsoft architecture icons.
- **Cross-link, don't repeat**: engine/framework specifics that already exist on this site are linked, not
  re-explained (see the existing-pages table above).
- **Escape `{ }` in prose**, and avoid line-leading `<digits>.`.
- Every page must be reachable from both `cloud/azure/index.adoc` and `nav.adoc` once the wiring group lands.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every later page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/azure-disclaimer.adoc` — created, modeled on
  `vector-rag-disclaimer.adoc`/`android-disclaimer.adoc`'s markup shape.
  - [x] Task 1.1. Author an `[IMPORTANT]` / `====` block containing **only**: (a) "This content was generated
    with the assistance of AI and should be verified against the official documentation before being relied on
    in production." (b) a pointer to
    `xref:cloud/azure/index.adoc#_bibliography[the section bibliography]`. Copy the markup shape from
    `partials/vector-rag-disclaimer.adoc`; include no version line, no book name, and no other sentence. — done;
    no version line, no book name, no extra sentence.
  - [x] Task 1.2. Confirm the include line every page uses: `include::partial$azure-disclaimer.adoc[]`. —
    confirmed against the existing `android-disclaimer.adoc` include convention
    (`include::partial$android-disclaimer.adoc[]`); every `cloud/azure/*.adoc` page will use
    `include::partial$azure-disclaimer.adoc[]`.

### Group 2 — Content pages: foundations

**Parallelizable: yes.** Six independent pages (Tasks 2–7). Each includes the Group 1 partial and only `xref:`s
other pages by their planned final path — none needs another page's finished text. `cloud/azure/index.adoc`
itself is deferred to the wiring group (Group 10) because its Bibliography and "What's covered" need the final
page list.

- [x] Task 2. Create `cloud/azure/cloud-concepts.adoc` — done. Conceptual page: cloud computing, cloud vs.
  virtualization, benefits, IaaS/PaaS/SaaS + serverless/CaaS, shared responsibility model, deployment models,
  CapEx vs. OpEx, mapping table to later pages. Figures: `images/azure-shared-responsibility-matrix.svg`,
  `images/azure-iaas-paas-saas-stack.svg`. No admonitions/book names/secrets; portal/CLI subsections
  intentionally omitted as allowed for a purely conceptual page.
- [x] Task 3. Create `cloud/azure/getting-started.adoc` — done. Account/subscription/tenant, subscription
  types, free-account terms (re-verified 2026-09-26), portal tour, Cloud Shell, Azure CLI (install/login/
  `--query`/extensions), Azure PowerShell, azd, VS Code tooling, `az provider register`. Figure: mermaid
  tenant → subscription → resource-group flowchart.
- [x] Task 4. Create `cloud/azure/global-infrastructure.adoc` — done. Geographies, regions, availability zones,
  region pairs, sovereign clouds, choosing a region, `az account list-locations`. Figure:
  `images/azure-regions-zones-datacenters.svg`.
- [x] Task 5. Create `cloud/azure/resource-organization.adoc` — done. Management groups → subscriptions →
  resource groups → resources, ARM as control plane, naming/tags (not inherited without policy), resource
  locks, moving resources, `az group create`/`az tag`/`az lock create`/`az account management-group`. Figure:
  mermaid hierarchy diagram. Includes `== Clean up`.
- [x] Task 6. Create `cloud/azure/identity-and-access.adoc` — done. Microsoft Entra ID, SSO/MFA/passwordless/
  Conditional Access/Zero Trust, Azure RBAC, managed identities, `DefaultAzureCredential` +
  `AZURE_TOKEN_CREDENTIALS` (Java + .NET snippets), workload identity federation incl. GitHub Actions OIDC
  (links `backend/docker/ci-cd-with-github-actions.adoc`), Entra ID vs. Entra Domain Services. Figure: mermaid
  sequence diagram app → managed identity → token → Key Vault/Storage.
- [x] Task 7. Create `cloud/azure/infrastructure-as-code.adoc` — done. Declarative vs. imperative, ARM, Bicep
  (modules, parameters, `az deployment group create`, `what-if`), Deployment Stacks + Template Specs, Azure
  Verified Modules, Azure Blueprints retirement/migration, one Terraform `azurerm` example with a plain-prose
  pointer to #171, azd templates, and a runnable Bicep file for the *Bookshelf* baseline (RG-scoped Log
  Analytics, `acrbookshelf`, `cae-bookshelf`). Includes `== Clean up`.

### Group 3 — Content pages: compute

**Parallelizable: yes.** Seven independent pages (Tasks 8–14), each `xref:`ing the others by planned path only.

- [x] Task 8. Create `cloud/azure/choosing-a-compute-service.adoc` — done. Official compute decision tree (📊
  Mermaid flowchart), VMs/VM Scale Sets (`az vm create`/`az vmss create`, availability sets vs. zones,
  auto-shutdown), Azure Virtual Desktop in one paragraph, Azure Container Instances (`az container create`,
  Spot via `--priority spot`, confidential containers, NGroups noted as still preview), comparison table
  (Container Apps / Container Apps Express / App Service / Functions / AKS / ACI / VMs). Verified against current
  Microsoft Learn docs; Container Apps Express confirmed GA 2026-09-23.
- [x] Task 9. Create `cloud/azure/container-registry.adoc` — done. ACR SKU feature matrix, `az acr create`/
  `login`/`build`, ACR Tasks (`--commit-trigger-enabled`/`--base-image-trigger-enabled`), managed-identity pull
  from AKS (`--attach-acr`), Container Apps (`--registry-identity`) and App Service
  (`acrUseManagedIdentityCreds`) — each with its actual current attach mechanism, geo-replication/retention
  (flagged preview)/private endpoint, GitHub Actions OIDC push linking the Docker CI/CD page. No figure required
  by the plan; none added.
- [x] Task 10. Create `cloud/azure/container-apps.adoc` ★ — done, per the issue's ★ outline in full (environments
  incl. workload profiles v2 vs. legacy consumption-only v1, Container Apps Express vs. standard with its current
  feature-gap caveats, the three `az containerapp up` deploy paths, portal flow, ingress, custom domains/managed
  certs, revision modes/traffic splitting via `ingress traffic set --revision-weight`, ACR pull via managed
  identity, logs, pricing, troubleshooting, *Bookshelf* `catalog-api` end to end). 📊
  `images/azure-container-apps-environment-topology.svg` (environment → apps → revisions → replicas); 📊 Mermaid
  of the revision traffic split.
- [x] Task 11. Create `cloud/azure/container-apps-scaling-jobs-and-dapr.adoc` ★ — done. KEDA-based scaling (HTTP/
  TCP/custom scalers, scale-to-zero, `--scale-rule-identity`, the "no ingress + min 0" pitfall annotated on the
  figure), jobs (manual/scheduled/event-driven via `az containerapp job create/start/execution list`), Dapr
  (sidecar, components via `env dapr-component set`, service invocation, pub/sub — noting jobs can't run Dapr),
  health probes, volumes, networking, the *Bookshelf* `notifier` as an event-driven job on a Service Bus queue.
  Links Key Vault/runtime-configuration pages rather than repeating them. 📊 Mermaid of the KEDA scale loop.
  Verified end to end with a real `npx antora` build (compiles; only pre-existing forward-reference xref
  warnings shared with sibling pages).
- [x] Task 12. Create `cloud/azure/app-service-and-functions.adoc` — done. App Service plan tiers (incl. Premium
  v4, verified current), Web Apps from code/containers, deployment slots/swap, autoscale, sidecars,
  managed-identity ACR pull, Easy Auth; Static Web Apps briefly; Azure Functions triggers/bindings, Flex
  Consumption vs. Premium vs. Dedicated, Linux Consumption retirement (2028-09-30, verified), isolated worker
  model (in-process retirement 2026-11-10, verified), Durable Functions patterns rewritten for the isolated
  model, identity-based connections, Functions Core Tools, Functions on Container Apps; links the Quarkus
  serverless page and the ASP.NET deployment page. Verified with a real Antora build.
- [x] Task 13. Create `cloud/azure/aks-clusters.adoc` ★ — done, per the issue's ★ outline in full (AKS Automatic
  vs. Standard, Free/Standard/Premium+LTS tiers, `az aks create` both flavors, node pools, Azure CNI Overlay +
  Cilium default, `--attach-acr`, cluster autoscaler vs. node auto-provisioning, upgrades/channels/deprecated-API
  detection, Container Insights + managed Prometheus/Grafana, Azure Policy, backup, Fleet Manager, portal flow,
  retirements with verified dates — Azure Linux 2.0 2025-11-30, OSM 2027-09-30 — pricing). 📊
  `images/azure-aks-cluster-architecture.svg` (control plane, node pools, VNet, ACR, Key Vault, Azure Monitor).
  One caveat noted in-page: the KEDA-per-AKS-version pinning in this plan's baseline table could not be
  independently confirmed via research, so the page points to `az aks get-versions`/release notes instead of
  asserting the exact pairing.
- [x] Task 14. Create `cloud/azure/aks-microservices.adoc` ★ — done, per the issue's ★ outline in full
  (*Bookshelf* Deployments/Services manifests, Helm chart, app-routing Gateway API as the recommended path
  — confirmed GA — legacy managed NGINX with verified retirement dates, Application Gateway for Containers/ALB
  Controller, Istio service-mesh add-on with its "not auto-upgraded" caveat, HPA/KEDA add-on/VPA, workload
  identity, ConfigMaps/Key Vault CSI driver linked not repeated, rolling updates/probes/PodDisruptionBudgets,
  CI/CD via GitHub Actions OIDC or azd, Container Apps vs. AKS decision table). 📊 Mermaid of the request path;
  📊 `images/azure-aks-workload-identity-token-exchange.svg`.
### Group 4 — Content pages: storage and CDN

**Parallelizable: yes.** Three independent pages (Tasks 15–17).

- [x] Task 15. Create `cloud/azure/storage-accounts.adoc` — account types (StorageV2, Premium block blob, SSD
  file shares; the GPv1/legacy retirement), redundancy (LRS/ZRS/GRS/RA-GRS/GZRS/RA-GZRS with durability figures,
  failover, geo priority replication), secure-by-default creation flags, networking (firewall, private
  endpoints + private DNS zones), encryption, Azure Files/Queue/Table/Managed Disks briefly (link the Spring Boot
  CSI page), AzCopy with Entra login, Storage Explorer, Data Box, File Sync, Azurite. 📊 SVG comparing the six
  redundancy options. — `modules/ROOT/pages/cloud/azure/storage-accounts.adoc` +
  `modules/ROOT/images/azure-storage-redundancy-options.svg`, no other files touched.
- [x] Task 16. Create `cloud/azure/blob-storage.adoc` ★ — per the issue's ★ outline: containers, blob types,
  upload/download portal + CLI (`--auth-mode login`, AzCopy), access tiers incl. smart tier, lifecycle management
  policies, data protection (soft delete, versioning, PITR, immutability), authorization (Entra data roles,
  disabling Shared Key, user delegation SAS via `--as-user --auth-mode login`), CORS, static website hosting,
  Data Lake Gen2 briefly, events via Event Grid, Java/Spring Cloud Azure SDK snippet, pricing drivers. 📊 Mermaid
  of lifecycle tiering; 📊 Mermaid sequence diagram of user delegation SAS issuance. —
  `modules/ROOT/pages/cloud/azure/blob-storage.adoc` (both Mermaid figures, validated via
  `scripts/validate-mermaid.mjs`); one cross-link sentence added to
  `modules/ROOT/pages/backend/springboot/file-storage-and-object-stores.adoc` per the existing-pages table.
- [x] Task 17. Create `cloud/azure/front-door-and-cdn.adoc` ★ — per the issue's ★ outline: the CDN retirement
  history (Akamai, Edgio, CDN classic, Front Door classic) with dates and migration pointers, Front Door
  Standard vs. Premium, the object model (profile/endpoint/origin group/origin/route/rule set/security policy),
  `az afd …` putting the *Bookshelf* static site + `catalog-api` behind Front Door, caching behaviour
  (`--cache-configuration`, not a nonexistent `--enable-caching` flag), rules engine, purge, custom domains +
  managed certs, WAF policies, Private Link origins (Premium) with origin lock-down, observability, pricing. 📊
  SVG of client → edge POP → origin cache hit/miss; 📊 Mermaid of the Front Door object model. —
  `modules/ROOT/pages/cloud/azure/front-door-and-cdn.adoc` + `modules/ROOT/images/azure-front-door-edge-caching.svg`,
  no other files touched.

### Group 5 — Content pages: managed databases

**Parallelizable: yes.** Five independent pages (Tasks 18–22).

- [x] Task 18. Create `cloud/azure/managed-databases-overview.adoc` — the engine-to-Azure-option table for every
  database this site already documents (SQL, PostgreSQL/pgvector, MySQL, MongoDB, Redis, Elasticsearch,
  Couchbase, Neo4j, Qdrant, Solr/Lucene, Prometheus), each row linking both the engine reference and this
  section's page; common concerns across engines (networking, Entra auth, backups/PITR, HA/zone redundancy,
  scaling, Key Vault-stored connection strings); Azure Database Migration Service briefly. 📊 SVG decision map.
  — Done: `modules/ROOT/pages/cloud/azure/managed-databases-overview.adoc` (208 lines) +
  `modules/ROOT/images/azure-managed-databases-decision-map.svg`. All 13 engine xrefs verified to exist via
  `ls` first. Live-verified against Microsoft Learn: Azure CLI 2.90.0 baseline, DMS classic SQL-Server-scenario
  retirement (2026-03-15) with Azure Data Studio's own retirement (2026-02-28), Azure Managed Redis vs. Cache
  for Redis retirement dates, the Nov-2025 DocumentDB rename. `npx antora` shows only expected unresolved xrefs
  to sibling pages created by Tasks 19-22 in this same group (same pattern every existing cloud/azure page
  already shows).
- [x] Task 19. Create `cloud/azure/azure-sql.adoc` ★ — Database vs. Managed Instance vs. SQL Server on VMs,
  DTU vs. vCore, service tiers incl. Hyperscale, serverless (auto-pause), elastic pools, the free offer,
  `az sql server/db create` with Entra-only auth, firewall, private endpoint, Entra ID from Spring Boot JDBC,
  backups (PITR/LTR), failover groups, Defender for SQL/auditing/TDE briefly; link the SQL reference and
  `SqlAzureExecutionStrategy`.
  — Done: `modules/ROOT/pages/cloud/azure/azure-sql.adoc` (532 lines), one `[mermaid]` decision flowchart
  (Database vs. Managed Instance vs. VMs), validated with `node scripts/validate-mermaid.mjs` (0 errors). Xrefs
  to `database/sql/index.adoc` and `web/aspnet/mvc/data-access-ef6.adoc` verified with `ls`/`grep`. Live-verified
  against Microsoft Learn: Azure CLI 2.90.0, `--enable-ad-only-auth` + external-admin flags, auto-pause is
  General-Purpose-only, current free-offer terms (100,000 vCore-seconds/32 GB/month, updated 2026-09-01), PITR/
  LTR defaults, TDE on-by-default, current "Microsoft Defender for Azure SQL Database" naming.
- [x] Task 20. Create `cloud/azure/postgresql-and-mysql.adoc` ★ — PostgreSQL flexible server (tiers, HA modes,
  `az postgres flexible-server create` incl. Entra-only auth flags, firewall, extensions allowlist + pgvector,
  built-in PgBouncer, read replicas/backups, elastic clusters, the Single Server retirement), MySQL flexible
  server more briefly, Spring Boot passwordless JDBC, portal flows for both.
  — Done: `modules/ROOT/pages/cloud/azure/postgresql-and-mysql.adoc` (638 lines), no figure required/added.
  Xrefs to `database/vector-rag/postgresql-pgvector.adoc` and `comparing-vector-databases.adoc` verified with
  `ls`. Live-verified against Microsoft Learn: Azure CLI 2.90.0, pgvector 0.8.6, current
  `az postgres flexible-server create` flag set (tiers, HA modes, Entra-only auth flags), PgBouncer enablement
  via the `pgbouncer.enabled` parameter (corrected from an on-by-default assumption), `azure.extensions`
  allowlist mechanism, Single Server's completed retirement (28 Mar 2025), elastic clusters now GA, and the
  current Spring Cloud Azure passwordless JDBC dependency/property names.
- [x] Task 21. Create `cloud/azure/cosmos-db-and-documentdb.adoc` ★ — Cosmos DB account/database/container
  model, partition keys and hot-partition pitfalls, RUs (provisioned/autoscale/serverless), the five consistency
  levels, global distribution, continuous backup, data-plane RBAC, the emulator, `az cosmosdb …` incl.
  `sql database/container create`; Azure DocumentDB (MongoDB compatibility, cluster tiers, HA, free tier, Entra
  auth, vector search, `az cosmosdb mongocluster create`, migrating from MongoDB/from Cosmos DB RU); a comparison
  table (Atlas on Azure vs. DocumentDB vs. Cosmos DB MongoDB RU); link the MongoDB reference. 📊 SVG of
  partitions/RU consumption; 📊 SVG of the consistency spectrum.
  — Done: `modules/ROOT/pages/cloud/azure/cosmos-db-and-documentdb.adoc` (580 lines) + both required figures,
  `modules/ROOT/images/azure-cosmos-partitions-and-ru.svg` and `azure-cosmos-consistency-spectrum.svg`. Xref to
  `database/mongodb/index.adoc` verified with `ls`. Live-verified (WebSearch, since WebFetch returned
  search-summarized results for these Learn pages): the Nov-18-2025 DocumentDB rename (a rebrand of the same
  product, not a retirement, distinct from Cosmos DB for MongoDB RU), current `az cosmosdb …`/
  `az cosmosdb mongocluster create` (preview extension) flag names, the current Linux-based emulator name, and
  DocumentDB's current free-tier/HA/vector-index tier gating.
- [x] Task 22. Create `cloud/azure/redis-and-partner-databases.adoc` ★ — Azure Managed Redis concisely (tiers,
  `az redisenterprise create`, Entra auth, Spring Boot connection), linking
  `database/redis/deploying-on-azure.adoc` for depth without duplicating it; Elastic Cloud on Azure (`az
  elastic`); Couchbase Capella / Neo4j AuraDB / Qdrant Cloud / MongoDB Atlas via Azure Marketplace (billing model,
  private-link where offered, portal subscribe flow); self-hosting on AKS with operators/Helm briefly; Azure
  Monitor managed Prometheus (`az monitor account create`) + Managed Grafana, linking the Prometheus reference.
  — Done: `modules/ROOT/pages/cloud/azure/redis-and-partner-databases.adoc` (473 lines), no figure
  required/added. Xrefs to `database/redis/deploying-on-azure.adoc` and `database/prometheus/index.adoc`
  verified with `ls`; Redis content kept concise and linked out, not duplicated. Live-verified against
  Microsoft Learn/vendor docs: current `az redisenterprise create` flag set, corrected `az elastic` usage to the
  actual GA command `az elastic monitor create` (the task text's `az elastic` alone doesn't exist), current
  `az monitor account create` / `az grafana create` syntax, and each Marketplace partner's current Private Link
  support (noting Qdrant Cloud's is Premium-tier/sales-assisted only, unlike the other three).

### Group 6 — Content pages: security and runtime configuration

**Parallelizable: yes.** Two independent pages (Tasks 23–24).

- [x] Task 23. Create `cloud/azure/key-vault-and-secrets.adoc` ★ — done. Objects (secrets/keys/certs), Standard
  vs. Premium, Managed HSM briefly, RBAC vs. access policies (RBAC-default-for-new-vaults API version
  `2026-02-01` re-verified live, pre-`2026-02-01` control-plane API retirement `2027-02-27`), soft delete
  (7-90 days)/purge protection, `az keyvault …` (create/secret set/show/list, certificate create + rotation +
  Event Grid near-expiry events), networking (firewall/private endpoint), consumption patterns
  (`DefaultAzureCredential` SDK incl. Spring Cloud Azure, Key Vault references in App Service/Functions [24h
  refresh] and Container Apps [`keyvaultref:…,identityref:…`, ~30 min pickup], AKS Secrets Store CSI driver with
  workload identity), GitHub Actions secrets vs. Key Vault, logging/cost, troubleshooting, `== Clean up` incl.
  `az keyvault purge`. Figure: required `[mermaid]` flowchart of the three consumption paths — validated with
  `node scripts/validate-mermaid.mjs` (520 diagrams parsed OK). Live-verified against Microsoft Learn
  (access-control-default, release-notes-azure-cli, soft-delete-overview, rbac-guide, app-service-key-vault-
  references, container-apps/manage-secrets, aks csi-secrets-store-driver/identity-access,
  event-schema-key-vault, key-vault/network-security) on 2026-09-27. No license-header generation applicable
  (AsciiDoc content page, not source code). No blocker.
- [x] Task 24. Create `cloud/azure/runtime-configuration.adoc` ★ — done. Config vs. secrets vs. feature flags per
  environment; App Configuration (tiers Free/Developer/Standard/Premium re-verified live, key-values/labels/
  feature flags/Key Vault references/snapshots, import/export, geo-replication, `az appconfig …` incl.
  `kv set-keyvault`/`feature set/enable`/`snapshot create`/`replica create`); dynamic refresh (sentinel key,
  Event Grid push, Spring Cloud Azure App Configuration starter linking `@RefreshScope` in
  `backend/springboot/configuration-and-profiles.adoc`, .NET `ConfigureRefresh`/`IOptionsSnapshot` linking
  `web/aspnet/core/configuration-and-options.adoc`); Container Apps env vars/`secretref:` (application- vs.
  revision-scope); App Service app settings/connection strings/slot settings; Kubernetes ConfigMaps on AKS
  (plain ConfigMaps plus the App Configuration Kubernetes provider `AzureAppConfigurationProvider` CRD, linking
  the Spring ConfigMaps section and `backend/docker/orchestration-swarm-and-kubernetes.adoc`); comparison table;
  `== Clean up` incl. `az appconfig purge`. Figures: required `azure-app-configuration-fanout.svg` (hand-authored,
  viewBox/Helvetica/flat background/hex colours, no CSS vars) plus a `[mermaid]` dynamic-refresh sequence
  diagram — validated with `node scripts/validate-mermaid.mjs` (520 diagrams parsed OK, includes both new pages'
  diagrams). Live-verified against Microsoft Learn (azure-app-configuration faq/concept-soft-delete/
  concept-geo-replication/concept-feature-management/reference-kubernetes-provider, enable-dynamic-configuration-
  java-spring-app/aspnet-core, cli/azure/appconfig, container-apps/environment-variables and manage-secrets,
  app-service-configuration-references) on 2026-09-27. No license-header generation applicable (AsciiDoc content
  page, not source code). No blocker.

### Group 7 — Content pages: networking, gateways and VPN

**Parallelizable: yes.** Four independent pages (Tasks 25–28).

- [x] Task 25. Create `cloud/azure/virtual-networks.adoc` — VNets/subnets, NSGs, peering, private endpoints vs.
  service endpoints + private DNS zones, Azure DNS, Bastion SKUs, Azure Firewall SKUs, NAT Gateway StandardV2,
  the default-outbound-access change, UDRs, DDoS Protection briefly, Network Watcher, portal + CLI, the
  *Bookshelf* hub-spoke-lite network. 📊 SVG of the hub-and-spoke topology with private endpoints. —
  `modules/ROOT/pages/cloud/azure/virtual-networks.adoc` + `modules/ROOT/images/azure-hub-spoke-topology.svg`;
  live-doc verification done (Bastion/Firewall/NAT Gateway SKUs, default-outbound-access retirement scope,
  re-checked against current Microsoft Learn docs).
- [x] Task 26. Create `cloud/azure/gateways-and-load-balancing.adoc` ★ — the load-balancing decision tree, Azure
  Load Balancer (Standard; the Basic retirement), Application Gateway v2 + WAF policy (the v1/WAF-config
  retirements), Application Gateway for Containers summarised (linking the AKS microservices page), Front Door
  linked (not repeated), Traffic Manager, typical layered topologies, portal + CLI for each. 📊 SVG comparison
  matrix; 📊 Mermaid decision tree. — `modules/ROOT/pages/cloud/azure/gateways-and-load-balancing.adoc` +
  `modules/ROOT/images/azure-gateway-lb-comparison-matrix.svg` (plus 2 extra Mermaid diagrams); live-doc
  verification done (LB Basic retirement, App Gateway v1/WAF-classic retirement dates, AGC GA status, Traffic
  Manager routing methods); Mermaid validated.
- [x] Task 27. Create `cloud/azure/api-management.adoc` ★ — concepts (gateway/management plane/developer portal),
  classic vs. v2 tiers with the feature matrix, `az apim create` and its v2 limitation (Bicep/`az rest`
  alternative), importing APIs, products/subscriptions, policies with XML examples (rate-limit, `validate-jwt`
  against Entra ID, CORS, caching, rewrite, backend routing), named values with Key Vault, backends, versions/
  revisions, the self-hosted gateway on AKS, observability, soft-delete/purge; link the API gateway/BFF
  architecture page and #184 in prose. 📊 Mermaid of the policy pipeline. —
  `modules/ROOT/pages/cloud/azure/api-management.adoc` (mermaid-only, no new image); live-doc verification done
  (tier/feature matrix, v2 CLI limitation, soft-delete purge command, self-hosted gateway on AKS via Helm);
  Mermaid validated.
- [x] Task 28. Create `cloud/azure/vpn-and-hybrid-connectivity.adoc` ★ — VPN Gateway (`GatewaySubnet`,
  route-based, SKUs incl. the non-AZ consolidation and Basic public IP retirement, active-active), site-to-site
  (`az network local-gateway create`/`vpn-connection create`), point-to-site with Entra ID auth (the
  Microsoft-registered Azure VPN Client app ID) and certificate auth, VNet-to-VNet, ExpressRoute and Virtual WAN
  briefly, coexistence, troubleshooting, pricing; the *Bookshelf* admin path over P2S to private
  PostgreSQL/Key Vault. 📊 SVG of S2S + P2S topologies; 📊 Mermaid of P2S Entra auth. —
  `modules/ROOT/pages/cloud/azure/vpn-and-hybrid-connectivity.adoc` +
  `modules/ROOT/images/azure-vpn-s2s-p2s-topology.svg`; live-doc verification done (SKU consolidation timeline,
  Basic public-IP retirement date, ExpressRoute peering types, Entra VPN Client app ID); Mermaid validated.

### Group 8 — Content pages: email and integration

**Parallelizable: yes.** Two independent pages (Tasks 29–30).

- [x] Task 29. Create `cloud/azure/email-with-communication-services.adoc` ★ — done (601 lines). Per the issue's ★
  outline: the Email Communication Service resource model (Azure-managed vs. custom domain verification: TXT/
  SPF/DKIM/DKIM2/DMARC), the preview `communication` CLI extension end to end (`create`, `email create`,
  `domain create`, `domain initiate-verification`, `email send`/`status get`), matching portal-flow subsections,
  Email SDK from Java code with `DefaultAzureCredential`/managed identity, SMTP relay (`smtp.azurecomm.net:587`,
  Entra app username format) with a Spring `JavaMailSender` example and a Quarkus Mailer mention (cross-linked,
  not repeated, into `backend/springboot/configuration-and-profiles.adoc` and
  `backend/quarkus/scheduling-and-mail.adoc`), delivery/engagement status via Event Grid, quotas/limits table
  (per-minute/hour, recipients/size, quota-increase process), the outbound port 25 block, SendGrid via
  Marketplace, deliverability basics (SPF/DKIM/DMARC alignment, suppression list), the *Bookshelf* `notifier`
  sending order confirmations. 📊 Mermaid sequence diagram app → ACS → recipient with Event Grid status events
  (plus a resource-model flowchart). — `modules/ROOT/pages/cloud/azure/email-with-communication-services.adoc`
  only; no other file edited. Mermaid validated (`node scripts/validate-mermaid.mjs`, all 529 diagrams parsed
  OK). Live-verified against Microsoft Learn (communication-services quickstarts for the resource/domains/SMTP/
  send-email/handle-email-events, `cli/azure/communication/email[/domain]`, `concepts/service-limits`,
  `concepts/email/email-quota-increase`, outbound-SMTP troubleshooting, email authentication best practices,
  suppression list, SendGrid Marketplace listing) on 2026-09-27. No license-header generation applicable (AsciiDoc
  content page). No blocker.
- [x] Task 30. Create `cloud/azure/messaging-and-integration.adoc` — done (469 lines). Service Bus (queues/
  topics/subscriptions/sessions/DLQ, `az servicebus namespace/queue/topic create`, passwordless Spring Cloud
  Azure/Spring Cloud Stream via `DefaultAzureCredential`), Event Grid (system topics e.g. Blob `BlobCreated`, and
  custom topics), Event Hubs (Kafka-compatible endpoint, OAUTHBEARER vs. legacy PLAIN), Storage Queues briefly,
  Logic Apps (Consumption vs. Standard) briefly, Web PubSub/SignalR Service briefly (cross-linked to
  `web/aspnet/core/signalr.adoc` and `web/aspnet/mvc/signalr-2.adoc` rather than repeated), a "choosing between
  them" comparison table plus one optional Mermaid decision-flow diagram; cross-links `backend/messaging/
  index.adoc` and `backend/messaging/protocols.adoc` for generic messaging-pattern depth. —
  `modules/ROOT/pages/cloud/azure/messaging-and-integration.adoc` only; no other file edited. Mermaid validated
  (`node scripts/validate-mermaid.mjs`, all 527 diagrams parsed OK). Live-verified against Microsoft Learn
  (`cli/azure/servicebus/queue`/`namespace`, service-bus-authentication-and-authorization, Event Hubs' Kafka
  overview, Event Grid overview + `cli/azure/eventgrid/system-topic`, Logic Apps overview, Storage Queues intro,
  Web PubSub overview) on 2026-09-27. No license-header generation applicable (AsciiDoc content page). No
  blocker. Minor note: did not add a prose cross-link to `backend/quarkus/messaging.adoc` (read, but no natural
  fit found for an Azure-service-layer page anchored on Spring Boot per convention) — everything else in the
  task's scope is covered.

### Group 9 — Content pages: operations, governance and beyond

**Parallelizable: yes.** Six independent pages (Tasks 31–36).

- [x] Task 31. Create `cloud/azure/monitoring-and-observability.adoc` — Azure Monitor (metrics, Log Analytics/
  KQL examples for Container Apps/AKS/Front Door), Application Insights (workspace-based, connection strings, the
  Azure Monitor OpenTelemetry Distro), alerts + action groups, workbooks/dashboards, diagnostic settings, Service
  Health/Advisor/Network Watcher, CLI (`az monitor log-analytics workspace create`, `diagnostic-settings create`,
  `metrics alert create`). — done; one Mermaid flowchart (resource → diagnostic setting → Log Analytics workspace
  → KQL/workbooks, and alert → action group); live-verified against Microsoft Learn (Application Insights
  instrumentation-key retirement 2025-03-31, `az monitor` command flags); `validate-mermaid.mjs` passing.
- [x] Task 32. Create `cloud/azure/governance-and-compliance.adoc` — Azure Policy (definitions/initiatives/
  assignments/effects/remediation, `az policy assignment create` examples), Microsoft Defender for Cloud
  (Microsoft Cloud Security Benchmark, Defender plans), Microsoft Sentinel briefly, Microsoft Purview briefly,
  Service Trust Portal, compliance offerings. — done; one Mermaid flowchart (policy definition → initiative →
  assignment → evaluation → effect → remediation); live-verified against Microsoft Learn (policy effects,
  Defender plan roster, Sentinel's move to the Defender portal, Blueprints retirement dates); rename of Security
  Center/Sentinel/Security Benchmark stated in prose, no book cited; `validate-mermaid.mjs` passing.
- [x] Task 33. Create `cloud/azure/cost-management.adoc` — cost factors, pricing calculator, the Azure Migrate
  business case, Cost Management (analysis/budgets/alerts via `az consumption budget create`/anomaly alerts/
  exports), tags for chargeback, reservations vs. savings plans vs. spot, dev/test pricing, auto-shutdown,
  scale-to-zero services, Advisor cost recommendations, Book 1's saving tips adapted, a *Bookshelf* qualitative
  cost-driver breakdown. — done; saving tips rewritten from scratch as an original six-category checklist (no
  book named or cited, confirmed by grep); one Mermaid decision flowchart (reservations vs. savings plans vs.
  spot); live-verified against Microsoft Learn/Azure.com (`az consumption budget create`, anomaly-alert REST-only
  mechanics, `az costmanagement export create`, Advisor CLI); `validate-mermaid.mjs` passing.
- [x] Task 34. Create `cloud/azure/architecture-migration-and-hybrid.adoc` — the Well-Architected Framework
  (five pillars) and review, the Cloud Adoption Framework, migration (Azure Migrate, Database Migration Service,
  Site Recovery, Data Box, rationalization, anti-patterns), hybrid/multi-cloud (Azure Arc incl. Arc-enabled
  Kubernetes, Azure Local, Azure VMware Solution). — done; two Mermaid diagrams (CAF phases; Azure Arc control
  plane); live-verified against Microsoft Learn (WAF 5 pillars, CAF's current phases and migration strategies,
  Azure Local rename, `az connectedk8s`/`azcmagent` syntax, AVS Broadcom licensing dates); a full
  `npx antora antora-playbook.yml` build was run and showed only the expected forward-reference to the
  not-yet-created `cloud/azure/index.adoc#_bibliography` (Group 10); `validate-mermaid.mjs` passing.
- [x] Task 35. Create `cloud/azure/ai-data-and-iot-overview.adoc` — a concise map of the AI/data/IoT services
  from Book 2 so every book concept has a home, each with the old→new name mapping (Cognitive Services → Azure
  AI services/Foundry Tools, Machine Learning Studio classic retirement, Data Lake Gen1 retirement, Synapse vs.
  Fabric), Microsoft Foundry/Azure OpenAI/Azure AI Search/Azure Machine Learning, Fabric vs.
  Synapse/Databricks/Data Factory/Stream Analytics/Data Lake Gen2/HDInsight/Power BI Embedded, IoT Hub/Central/
  Edge/Digital Twins, Azure Maps, Azure Quantum; link
  `database/vector-rag/integrating-with-spring-ai.adoc` for Azure OpenAI from Spring AI. — done; every concept in
  the issue "Addendum" comment's Andersson book chapters 6/7/8 rows given a home (Purview deliberately limited to
  a one-line pointer to `governance-and-compliance.adoc`, per that page owning it); no figure added (judged the
  rename table + prose sufficient over a low-value mind-map); live-verified against Microsoft Learn (Foundry
  rename, ML Studio classic and Data Lake Gen1 retirement dates, Fabric-vs-Synapse positioning, IoT Central GA
  status).
- [x] Task 36. Create `cloud/azure/developer-tools-and-devops.adoc` — VS Code/Visual Studio/IntelliJ Azure
  toolkits, Azure SDK design principles, local emulators (Azurite, Cosmos DB emulator, Functions Core Tools,
  Service Bus emulator), GitHub Actions deploying *Bookshelf* with OIDC to Container Apps and AKS, Azure DevOps
  briefly, Dev Box/Deployment Environments/DevTest Labs briefly, GitHub Codespaces, DevSecOps practices from
  Book 2 (secret scanning, Defender for Cloud DevOps security, dependency scanning); link Git & GitHub and the
  Docker CI/CD section. — done; cross-links (not duplicates) `identity-and-access.adoc`'s federated-credential
  setup and `backend/docker/ci-cd-with-github-actions.adoc`'s build/push workflow, adding only the deploy steps
  (`az containerapp update`, `kubectl set image`/`az aks command invoke`); one Mermaid sequence diagram (OIDC
  token exchange → ACR push → Container Apps/AKS deploy); live-verified against Microsoft Learn/GitHub Docs
  (emulator invocations, Dev Box/Deployment Environments retirement dates, secret scanning/Dependabot,
  `az aks command invoke` caveat); `validate-mermaid.mjs` passing.

### Group 10 — Section index, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task creates or edits a **distinct** file, and all of them only reference pages
that exist after Groups 1–9.

- [x] Task 37. Create `modules/ROOT/pages/cloud/index.adoc` (the Cloud area landing page) — `:description:`/
  `:keywords:`, a short intro on what "cloud" guides will hold, `== Sections` with one bullet summarising Azure
  (mirroring how `database/index.adoc`/`backend/index.adoc` summarise their subsections), and one plain-prose
  sentence noting other providers may be added later, with no dangling `xref:`. — done; single new file, no
  admonition, single xref (`cloud/azure/index.adoc`) which resolves once Task 38 lands in this same group.
- [x] Task 38. Create `modules/ROOT/pages/cloud/azure/index.adoc` ("Azure") — header + disclaimer include; the
  re-verified tool/version baseline in prose; the *Bookshelf* scenario with an SVG of its final architecture
  (📊 `azure-bookshelf-architecture.svg`); a reading path (foundations → compute → storage/CDN → databases →
  security/config → networking/gateways → email/integration → operations); `== What's covered` grouped exactly
  as the 8 content groups above (Tasks 2–7, 8–14, 15–17, 18–22, 23–24, 25–28, 29–30, 31–36) plus the cheat sheet,
  with a 📊 Mermaid mind-map of the section; the "where related material lives elsewhere on this site" table (the
  existing-pages table above); `== Bibliography` — books linked to their O'Reilly pages
  (https://www.oreilly.com/library/view/azure-fundamentals-az-900/9781098167813/ and
  https://www.oreilly.com/library/view/learning-microsoft-azure/9781098113315/) plus the official documentation
  sources listed in the issue body and the addendum comment, grouped by section group, closing with the house
  sentence that the official docs win on any discrepancy. Watch the line-leading-digit gotcha in any bare year.
  — done: `modules/ROOT/pages/cloud/azure/index.adoc` (399 lines) + `modules/ROOT/images/azure-bookshelf-architecture.svg`
  (154 lines, AKS end-state, hub-spoke-topology palette). All 35 azure page xrefs + 22 external cross-link
  targets verified with `test -f`; `[[_bibliography]]` anchor matches the disclaimer's `#_bibliography` pointer.
  Bicep/Key Vault/VPN Gateway URLs corrected after WebFetch verification; CLI/Bicep/azd baseline re-confirmed
  current as of 2026-09-27. `node scripts/validate-mermaid.mjs` passes (30 diagrams in `cloud/azure/`, 536
  repo-wide). One line-leading-digit fix applied. No blocker.
- [x] Task 39. Create `modules/ROOT/pages/cloud/azure/cheat-sheet.adoc` and
  `modules/ROOT/attachments/azure-cheat-sheet.pdf`:
  - [x] Task 39.1. `= Azure Cheat Sheet` + disclaimer + a one-paragraph intro linking
    `xref:attachment$azure-cheat-sheet.pdf[downloadable PDF]`. Grouped back-link paragraphs to all 36 pages (same
    groups as Task 38's `== What's covered`), matching `database/vector-rag/cheat-sheet.adoc`'s shape. End with
    `xref:attachment$azure-cheat-sheet.pdf[Download the Azure Cheat Sheet (PDF)]`. — done; all 35 xref targets
    verified via `ls` first, no dangling xrefs.
  - [x] Task 39.2. Author a print-ready single A4 page HTML/CSS layout **in the scratchpad**: dense multi-column
    boxes covering everything the issue's cheat-sheet list asks for (hierarchy/regions, CLI essentials, the
    compute decision table, Container Apps, ACR, AKS, Blob + Front Door, databases, Key Vault, App Configuration,
    networking, the gateway decision tree + APIM, VPN, email, monitoring, governance/cost, a retirements-and-
    renames strip with dates), styled consistently with the existing qdrant/vector-rag/git PDFs. — done in
    scratchpad only; a CSS `column-span: all` page-fragmentation bug (blank pages in headless Chrome print) was
    found and fixed by restructuring wide tables outside the multi-column block.
  - [x] Task 39.3. Render with headless Chrome print-to-PDF; verify with PyMuPDF that `page_count == 1` and the
    page is A4; render a PNG preview and inspect for clipping, iterating until it fits. Copy only the PDF to
    `modules/ROOT/attachments/`. Confirm via `git status --porcelain` that no stray `.html` landed in the repo.
    — done: PyMuPDF confirms `page_count=1`, `rect=(0,0,594.96,841.92)` (A4); 150dpi PNG preview inspected, no
    clipping/overlap. `git status --porcelain` shows only the intended `cheat-sheet.adoc` +
    `azure-cheat-sheet.pdf`, no stray `.html`, no copy of the source book PDFs. Retirement dates in the PDF were
    carried from the task brief as given (WebSearch budget was exhausted in that sub-agent, so they were not
    independently re-verified beyond the Azure CLI version, which was confirmed current via WebFetch) — worth a
    spot re-check in Group 11's final verification pass.
- [x] Task 40. Site wiring (3 files, no others touched, none created):
  - [x] Task 40.1. `modules/ROOT/nav.adoc`: insert
    `** xref:cloud/index.adoc[Cloud]` → `*** xref:cloud/azure/index.adoc[Azure]` followed by 37 `****` lines (the
    36 content pages in Task 38's group order + `cheat-sheet.adoc[Cheat Sheet (PDF)]`) between the end of the
    Apps block and the start of the Git & GitHub block. Use short labels matching each page's `= Title`. — done;
    inserted between the Apple Platforms cheat-sheet line and Git & GitHub; verified 36 `****` content-page
    lines (`grep -c` check) plus the cheat-sheet line = 37, each labelled from the page's real `= Title`.
  - [x] Task 40.2. `modules/ROOT/images/cloud.svg`: author a new icon SVG matching the style/size of the other
    Guides & References tile icons (e.g. `apps.svg`, `git-and-github.svg` if present, or the closest sibling).
    — done; same 600x600 viewBox/card-clip/badge/title/tagline/button layout as siblings, original hand-drawn
    cloud glyph, new gradient stop-color not reused by any existing sibling.
  - [x] Task 40.3. `modules/ROOT/pages/index.adoc`: add a `image::cloud.svg[xref="cloud/index.adoc"]` cell to the
    Guides & References table between the `apps` cell and the `git-and-github` cell; add "cloud" / "Azure" to
    `:description:`; append the issue's keyword list to `:keywords:` (line 3), skipping any term already present.
    Make no other structural change. — done; cell inserted matching existing pattern; description integrated
    with "cloud,"; keyword list appended with word-boundary duplicate checking (only "Azure Managed Redis" was
    already present and skipped).
- [x] Task 41. Cross-links in existing pages. Add one sentence or bullet each and never repeat content. Each file
  is edited by exactly one sub-task.
  - [x] Task 41.1. `database/redis/deploying-on-azure.adoc` (+ the AWS/GCP siblings, one shared sentence pattern):
    link `redis-and-partner-databases.adoc`. — done; one shared-pattern sentence added to all three files
    (deploying-on-azure/aws/google-cloud.adoc), no content duplicated.
  - [x] Task 41.2. `backend/springboot/file-storage-and-object-stores.adoc`: link `blob-storage.adoc` and
    `storage-accounts.adoc`. `backend/springboot/configuration-and-profiles.adoc`
    (`=== Kubernetes ConfigMaps and Secrets`): link `runtime-configuration.adoc`. — file-storage-and-object-stores.adoc
    already had both links from Group 4, left untouched (no duplicate added); configuration-and-profiles.adoc
    got the `runtime-configuration.adoc` link in its ConfigMaps/Secrets section (same agent also handled 41.7's
    MailSender edit on this file, see below).
  - [x] Task 41.3. `web/aspnet/core/deployment.adoc`, `aspire-and-cloud-native.adoc`,
    `configuration-and-options.adoc`, `security-hardening.adoc`: link `container-apps.adoc` /
    `app-service-and-functions.adoc`, `key-vault-and-secrets.adoc`, `runtime-configuration.adoc` as relevant to
    each page's existing Azure mention. — done; deployment.adoc → container-apps.adoc + app-service-and-functions.adoc;
    aspire-and-cloud-native.adoc → container-apps.adoc; configuration-and-options.adoc → key-vault-and-secrets.adoc
    + runtime-configuration.adoc (two spots); security-hardening.adoc → key-vault-and-secrets.adoc (Data
    Protection/`ProtectKeysWithAzureKeyVault`).
  - [x] Task 41.4. `backend/docker/orchestration-swarm-and-kubernetes.adoc`, `registries-and-docker-hub.adoc`,
    `ci-cd-with-github-actions.adoc`: link `container-registry.adoc`, `aks-clusters.adoc`, `aks-microservices.adoc`
    as relevant. — done; orchestration-swarm-and-kubernetes.adoc → aks-clusters.adoc + aks-microservices.adoc;
    registries-and-docker-hub.adoc → container-registry.adoc; ci-cd-with-github-actions.adoc → container-registry.adoc
    only (no natural AKS fit found, its example targets ECR/Artifact Registry-style deploys, not Kubernetes).
  - [x] Task 41.5. `database/vector-rag/comparing-vector-databases.adoc`, `postgresql-pgvector.adoc`: link
    `managed-databases-overview.adoc` / `postgresql-and-mysql.adoc`. `backend/quarkus/serverless-and-cloud-functions.adoc`,
    `kubernetes-and-openshift.adoc`: link `app-service-and-functions.adoc` / `aks-microservices.adoc`. — done,
    one sentence added to each of the 4 files.
  - [x] Task 41.6. `backend/oauth/social-login-and-federation.adoc`,
    `backend/springboot/spring-security-authorization-server.adoc`,
    `backend/quarkus/security-jwt-oidc-and-keycloak.adoc`: link `identity-and-access.adoc`.
    `backend/messaging/protocols.adoc`, `backend/quarkus/messaging.adoc`: link `messaging-and-integration.adoc`.
    — done, all 5 files; `backend/quarkus/messaging.adoc`'s link (previously skipped in Group 8 for lack of a
    natural fit) is now in place, added near its AMQP 1.0/Service Bus discussion.
  - [x] Task 41.7. `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`: link
    `gateways-and-load-balancing.adoc` / `api-management.adoc`. `web/aspnet/mvc/data-access-ef6.adoc`: link
    `azure-sql.adoc`. `backend/quarkus/scheduling-and-mail.adoc`,
    `backend/springboot/configuration-and-profiles.adoc` (`MailSender`): link
    `email-with-communication-services.adoc`. — done; api-gateway-and-bff.adoc, data-access-ef6.adoc (near
    `SqlAzureExecutionStrategy`) and scheduling-and-mail.adoc each got one sentence; the
    `configuration-and-profiles.adoc` MailSender edit was combined into the same sub-agent as Task 41.2's edit
    on that file (added near the `prodMailSender()` example), per the no-duplicate-file-ownership rule.

### Group 11 — Build and verify

**Parallelizable: yes** (single task; nothing else depends on it, and it depends on every prior group).

- [x] Task 42. Verify the whole section builds cleanly. — done; build clean, mermaid clean, grep clean (one
  false positive investigated and confirmed harmless), git status clean, live spot-check found and fixed one
  real inaccuracy (blob-storage.adoc smart-tier commands) and one imprecise PDF date wording (Blueprints).
  - [x] Task 42.1. `npx antora antora-playbook.yml` — fixed the 3 known warnings: escaped `\{isbn}` (x2) in
    `cloud/azure/api-management.adoc` prose and `` `$\{ACS_SMTP_PASSWORD}` `` in
    `cloud/azure/email-with-communication-services.adoc` prose (both were unescaped attribute-reference braces
    outside source blocks). Re-ran the build afterward: zero errors/warnings.
  - [x] Task 42.2. `npm run validate:mermaid` — all 536 Mermaid diagrams parsed successfully, no fixes needed.
  - [x] Task 42.3. Grepped `cloud/` tree for line-leading `<digits>.` and unescaped bare `{`/`}` outside source
    blocks: one line-leading-digit match (`ai-data-and-iot-overview.adoc:41`, "2024. Anything...") — confirmed
    via rendered HTML it's inside a non-AsciiDoc-style table cell (`[cols="2,3,4"]`, no `a` cell style) so it
    renders as plain paragraph text, not a list; no fix needed. No unescaped-brace hits (the api-management.adoc
    lines flagged by a naive brace-count were the already-fixed, correctly-escaped `\{isbn}` occurrences).
  - [x] Task 42.4. `git status --porcelain` — only intended new/modified files; no stray `.html`, no copies of
    `~/Desktop/azure1.pdf`/`azure2.pdf`. `.secrets.baseline` modified as expected (earlier security scan).
  - [x] Live spot-check (Microsoft Learn, via WebFetch): (a) all 5 retirement dates in `cheat-sheet.adoc`'s PDF
    retirements strip cross-checked against Microsoft Learn and against the corresponding content pages — Basic
    Load Balancer (retired 2025-09-30), Application Gateway v1 (retired 2026-04-28), Azure Cache for Redis
    (Enterprise/Enterprise Flash 2027-03-31, Basic/Standard/Premium 2028-09-30), Azure Functions Linux
    Consumption (retiring 2028-09-30) all confirmed exact; Azure Blueprints' PDF wording ("support ending
    2026-07-31") was imprecise versus Microsoft's actual phased-retirement-from-2026-07-31/full-retirement-
    2027-01-31 timeline (which the content page already stated correctly) — fixed by editing the scratchpad
    HTML source and re-rendering the PDF (headless Chrome print-to-PDF, verified 1-page A4 with PyMuPDF, PNG
    preview inspected for clipping) before copying it over `modules/ROOT/attachments/azure-cheat-sheet.pdf`.
    (b) `blob-storage.adoc` CLI commands checked against Microsoft Learn CLI reference: `--auth-mode login` and
    `az storage blob generate-sas --as-user` confirmed valid; lifecycle policy JSON/CLI confirmed accurate.
    Found a real inaccuracy in the smart-tier section: `az storage container premium-policy update --auto-tier
    true` does not exist as an `az storage container` subcommand, and smart tier is not enabled per-container —
    per current Microsoft Learn docs it's an account-level default-access-tier setting
    (`az storage account update --access-tier Smart`). Rewrote the "smart tier" subsection with the correct
    mechanism, prerequisites (Standard GPv2, zone-redundant storage, block blobs only), and behavior (30/90-day
    Hot→Cool→Cold transitions, access resets to Hot, explicit-tier blobs excluded).
