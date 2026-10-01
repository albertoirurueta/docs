# Implementation Plan: Guides & References / Cloud — Google Cloud

## Task summary

Source: GitHub issue #164
Base branch: main

Issue [#164](https://github.com/albertoirurueta/docs/issues/164) asks for a new **Google Cloud** section under
**Guides & References → Cloud** (`modules/ROOT/pages/cloud/google-cloud/`), next to the existing Azure and AWS sections:
a practical guide to learning and using Google Cloud from the **Google Cloud console** and the **gcloud CLI**, built from
the current official Google Cloud documentation and cross-checked against the requester-provided O'Reilly book
*Google Cloud Cookbook* (Costa & Hodun, 2021; `~/Desktop/gcloud.pdf`, never committed). It is 40 content pages
(including `index.adoc`) + `cheat-sheet.adoc` + a one-page A4 PDF.

The issue body is the primary spec. Its **comments are part of it** (saved locally during exploration at
`/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/4293fbcc-5f82-48de-9afd-64e569388993/scratchpad/comments.md`;
re-fetch with `gh issue view 164 --comments` if missing). Every content task must read the relevant one in full:

| Comment (title) | Holds |
|---|---|
| "Addendum: concepts contributed by the book" | chapter-by-chapter concept table of the book (every concept must land on ≥ 1 page) + book errata to correct in prose |
| "Addendum: where the book is outdated, narrower, or silent" | verified retirements/renames/new-since-the-book list (dates verified 2026-09-27) |
| "Page outline (1/2): foundations and compute" | per-page spec for Foundations + Compute |
| "Page outline (2/2): storage, databases, security, networking, email and operations" | per-page spec for everything else |
| "Key references" | starting bibliography URLs |

Choices made during exploration/planning (none ambiguous enough to ask the user about):

1. **Ship everything in one plan/PR**, mirroring AWS (#163, `.archive/implementation_plan_163.md`) and Azure (#192,
   `.archive/implementation_plan_192.md`). The issue merely suggests splitting into four PRs; groups below keep that
   option open (G1–G3 / G4–G5 / G6–G8 / G9–G11).
2. **Tasks are untagged (no language key).** Installed `*-code-one-task` skills only cover `java`, `java-springboot`,
   `dotnet`, `database`; none applies to authoring AsciiDoc/SVG/PDF. CLI/client-library/YAML/Terraform snippets are page
   *content*, not repository source. Every task is implemented directly.
3. **Disclaimer rule.** `google-cloud-disclaimer.adoc` contains only the AI-assistance sentence and the bibliography
   pointer. **No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block anywhere in the section**: deprecation dates,
   cost warnings, Preview caveats, security caveats and "book is outdated" remarks are prose or table rows.
4. **The book is named only in `index.adoc`'s `== Bibliography`**, never as the source of a command or code example, and
   no book text/code/figure is reproduced. Where it is outdated (gsutil, Container Registry, Cloud Functions naming,
   downloaded SA keys, konlet, Cloud Debugger, Cloud Source Repositories, …) pages say "the current approach is X"
   citing the official docs, phrased as "older guides still show …".
5. **Versions are re-verified at implementation time** against live docs (issue baseline checked 2026-09-27: gcloud CLI
   586, GKE 1.35 Regular channel, Terraform `hashicorp/google` v8, Spring Cloud GCP 8.x for Boot 4 / 7.4.x for Boot 3).
   Each page intro states the verified value. Cite `docs.cloud.google.com`, not the old `cloud.google.com/...` host.
6. **AWS has landed (#163)**, so: `index.adoc` gets both "Coming from Azure" and "Coming from AWS" mappings with real
   `xref:`s; the existing `partials/cloud-disclaimer.adoc` is *extended* (not created). #162 (merged) is referenced
   where useful; #171 and #184 stay plain-prose pointers (no `xref:` to non-existent pages).
7. **One running scenario, *Bookshelf*** (below), shared with the Azure/AWS sections so parallel-authored pages stay
   consistent.

## Current code state

- No `modules/ROOT/pages/cloud/google-cloud/`, no `partials/google-cloud-disclaimer.adoc`, no `images/google-cloud-*.svg`,
  no `attachments/google-cloud-cheat-sheet.pdf`. Structural templates: `cloud/aws/*` (42 pages + cheat sheet),
  `cloud/azure/*`, `partials/{aws,azure}-disclaimer.adoc`, `images/{aws,azure}-*.svg`, `attachments/{aws,azure}-cheat-sheet.pdf`.
- `modules/ROOT/partials/cloud-disclaimer.adoc` exists (added by #163) and points to the Azure and AWS bibliographies;
  `modules/ROOT/pages/cloud/index.adoc` includes it and has a `== Sections` list (Azure, AWS bullets).
- `modules/ROOT/nav.adoc`: the AWS block ends with `**** xref:cloud/aws/cheat-sheet.adoc[Cheat Sheet (PDF)]`; the next
  top-level line is `** xref:git-and-github/index.adoc[Git & GitHub]`. The Google Cloud `***` block goes between them
  (match on text, not line numbers).
- `modules/ROOT/pages/index.adoc`: Cloud tile exists → **no new tile**; only `:description:` and `:keywords:` change.
- **Page shape to mirror** (`cloud/aws/*.adoc`): `= Title`, `:description:`, `:keywords:`, blank line, disclaimer include,
  lead paragraph with tool/version baseline, `==` sections, per hands-on concept `=== In the Google Cloud console` +
  `=== With the gcloud CLI`, `== Clean up` where resources are created, mandatory `== References` (official online docs
  only), optional `== Related pages`.
- **Figures**: hand-authored `modules/ROOT/images/google-cloud-*.svg` (viewBox, `font-family="Helvetica, Arial, sans-serif"`,
  flat light background, hard-coded hex colours, no CSS variables/external refs, original drawings — never Google Cloud
  architecture icons, Google diagrams or book figures) and `[mermaid]` blocks (`....`) validated by
  `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`; needs `npm i --no-save mermaid@11 jsdom`).
- **Cheat-sheet PDF pipeline** (from `.archive/implementation_plan_121.md`/`_187.md`/`_192.md`/`_163.md`): author a
  single-page A4 HTML/CSS **in the scratchpad, never the repo**; render with
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --print-to-pdf=<out> --no-pdf-header-footer <file.html>`;
  verify with PyMuPDF (`fitz`) `page_count == 1` and A4, render a PNG and check no clipping (beware the
  `column-span: all` blank-page bug); copy only the PDF to `modules/ROOT/attachments/google-cloud-cheat-sheet.pdf`;
  `git status --porcelain` must show no `.html`.
- **Existing pages to link, never repeat** (issue's "What already exists" table; one sentence/bullet each):
  `database/redis/deploying-on-google-cloud.adoc`, `backend/springboot/file-storage-and-object-stores.adoc`,
  `backend/springboot/configuration-and-profiles.adoc`, `backend/quarkus/serverless-and-cloud-functions.adoc`,
  `backend/quarkus/kubernetes-and-openshift.adoc`, `backend/quarkus/scheduling-and-mail.adoc`,
  `backend/docker/*` (registries, CI/CD, orchestration, build cache, logging), `backend/oauth/social-login-and-federation.adoc`,
  `backend/springboot/spring-security-authorization-server.adoc`, `backend/quarkus/security-jwt-oidc-and-keycloak.adoc`,
  `backend/messaging/*`, `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`,
  `backend/springboot/{logging,metrics-and-observability}.adoc`, `database/prometheus/*`,
  `database/vector-rag/{comparing-vector-databases,postgresql-pgvector,vector-database-landscape}.adoc`,
  all engine references (`database/{sql,mongodb,elasticsearch,lucene,solr,neo4j,couchbase,qdrant,redis,prometheus}/*`),
  `database/mongodb/security.adoc`, `apps/android/publishing-on-google-play.adoc`,
  `web/vaadin/production-and-deployment.adoc`, `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`,
  `cloud/azure/*`, `cloud/aws/*`.
- **Verification** is the Antora build (`npx antora antora-playbook.yml`, zero errors/warnings) plus the Mermaid
  validator, both run via a sub-agent so output doesn't flood the main context. No test/coverage/quality tooling exists.
- **AsciiDoc gotchas**: escape literal `{word}` outside `[source]` blocks as `\{ … \}` (JSON, `${VAR}`, resource names in
  prose/tables); never let a wrapped line start with `<digits>.`.

## Shared *Bookshelf* scenario

*Bookshelf*: a static web front end, a `catalog-api` (Spring Boot), an `orders-api`, and a `notifier` worker that sends
order-confirmation emails.

| Concern | Name / value |
|---|---|
| Project / region | `PROJECT_ID=$(gcloud config get-value project)` (placeholder `my-project-id`, `<project-number>`); region `us-central1` unless a page needs another |
| Artifact Registry | Docker repo `bookshelf` → `us-central1-docker.pkg.dev/$PROJECT_ID/bookshelf/{catalog-api,orders-api,notifier}` |
| Cloud Run | services `catalog-api` (source deploy, then image, then revisions/traffic split), `orders-api`; job `nightly-report`; `notifier` as Eventarc-triggered service / Cloud Run function on Pub/Sub topic `orders` |
| Cloud Storage | `bookshelf-web-$PROJECT_ID` (static site, behind global external ALB + Cloud CDN), `bookshelf-uploads-$PROJECT_ID` |
| Databases | Cloud SQL for PostgreSQL `bookshelf-catalog` (db `catalog`; AlloyDB `bookshelf-alloy` as scale-up variant); Firestore with MongoDB compatibility `orders` (or MongoDB Atlas); Memorystore for Valkey `bookshelf-cache` |
| Secrets/config | Secret Manager `catalog-db-password`, `sendgrid-api-key`; Parameter Manager parameter `bookshelf-settings` |
| GKE | Autopilot cluster `bookshelf-gke`, Workload Identity Federation for GKE, Gateway API |
| Gateways | API Gateway `bookshelf-api` (Apigee as enterprise variant), Cloud Armor policy `bookshelf-policy` |
| VPN | HA VPN `bookshelf-vpn` + Cloud Router to a simulated on-premises VPC; IAP TCP forwarding for admin access |
| Email | third-party SMTP relay/API (SendGrid), key in Secret Manager |
| Java package | `com.example.bookshelf` |
| Shell variables | `PROJECT_ID`, `REGION`, `SERVICE`, `BUCKET`, … (never real IDs/keys) |

## Conventions every content page must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:`, blank line,
  `include::partial$google-cloud-disclaimer.adoc[]`, lead paragraph stating the re-verified tool/version baseline.
- **Two subsections per hands-on concept**: `=== In the Google Cloud console` (numbered navigation paths, no screenshots;
  mention project picker, enabling the API, Cloud Shell) and `=== With the gcloud CLI` (`[source,bash]`, shell variables,
  `--format`/`--filter`; start each page with the `gcloud services enable …` it needs). **Every command/code example is
  followed by a link to the official page it derives from.** Where the CLI is impractical, give YAML/JSON/XML plus a
  Terraform alternative.
- **Application code** where an app uses the service: Java (Google Cloud Client Libraries via `libraries-bom`, Spring Cloud GCP
  8.x/Boot 4, 7.4.x/Boot 3) primary; Python/Node only where the official sample is clearly better. Always Application
  Default Credentials with attached service accounts / Workload Identity Federation / impersonation locally — **never
  downloaded service-account keys**.
- **Every page** covers pricing model/cost drivers (prose, **no hard-coded prices**, dated pricing link), free tier where
  one exists, quotas/limits, launch stages (Preview vs GA) and recent changes with dates, and where older guides are outdated.
- **★ pages** additionally: complete console + CLI walkthroughs, configuration options, security (IAM roles and bindings in
  full), networking, scaling, pricing model, troubleshooting; they are the most detailed pages.
- **`== Clean up`** on every page creating resources (dependency order; throwaway project deletion; Cloud Storage soft-delete
  retention, Secret Manager versions, Cloud SQL retained backups, KMS key-version destruction scheduling).
  **`== References`** on every page (official docs only).
- **No admonitions** except the disclaimer. **No real project IDs/numbers, billing IDs, keys, secrets.**
- **Figures**: `[mermaid]` or `google-cloud-*.svg` at least wherever the outline's 📊 suggests; each task authors the SVGs its
  own page embeds. All Mermaid must pass the validator.
- **Cross-link, don't repeat** existing site material; escape `{ }`; avoid line-leading `<digits>.`.
- Every page must be reachable from `cloud/google-cloud/index.adoc`, `cheat-sheet.adoc` and `nav.adoc` once Group 10 lands.
  Pages `xref:` each other by planned final path only.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every content page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/google-cloud-disclaimer.adoc`
  - [x] Task 1.1. Single `[IMPORTANT]` / `====` block (copy markup shape from `partials/aws-disclaimer.adoc`) containing
    **only**: "This content was generated with the assistance of AI and should be verified against the official
    documentation before being relied on in production." and a pointer to
    `xref:cloud/google-cloud/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. Confirm the include line every page uses: `include::partial$google-cloud-disclaimer.adoc[]`.

### Group 2 — Content pages: foundations

**Parallelizable: yes.** Six independent pages; `index.adoc` is deferred to Group 10. Spec: "Page outline (1/2)" → *Foundations*.

- [x] Task 2. Create `cloud/google-cloud/cloud-concepts.adoc` — book ch.1 first, then Google's "What is cloud computing";
  IaaS/PaaS/SaaS, shared responsibility, Well-Architected Framework, Cloud Adoption Framework, mapping to later pages.
- [x] Task 3. Create `cloud/google-cloud/getting-started.adoc` — account/free trial ($300/90 days) and Always Free,
  console tour, Cloud Shell/Cloud Shell Editor limits, gcloud CLI install/`gcloud init`/configurations/`--format`,
  `gcloud <service> <resource> <verb>` grammar, `gsutil` → `gcloud storage`, `bq`, `kubectl get-credentials`, client libraries
  and ADC, Cloud Code, link `apps/android/publishing-on-google-play.adoc`. 📊 Mermaid account → project → config flow.
- [x] Task 4. Create `cloud/google-cloud/global-infrastructure.adoc` — regions, zones, multi-regions, edge PoPs, scopes
  (zonal/regional/multi-regional/global), choosing a region, `gcloud compute regions/zones list`. 📊 regions/zones SVG.
- [x] Task 5. Create `cloud/google-cloud/resource-hierarchy-and-projects.adoc` — organization → folders → projects, project
  ID/name/number, labels/tags, org policies and secure-by-default constraints (orgs from 2024-05-03), billing-account link,
  one project per app per stage; `gcloud projects/organizations/resource-manager …`. 📊 Mermaid hierarchy. `== Clean up`.
- [x] Task 6. Create `cloud/google-cloud/identity-and-access.adoc` — principals, roles (basic/predefined/custom), policy
  inheritance, service accounts, attached SAs, impersonation, Workload Identity Federation (GitHub Actions/GitLab; link
  `backend/docker/ci-cd-with-github-actions.adoc`), SA-key creation blocked by default, IAP (incl. direct on Cloud Run GA
  2026-03-13), Identity Platform briefly, links to `backend/oauth/*` and Quarkus/Spring security pages. 📊 Mermaid WIF sequence.
- [x] Task 7. Create `cloud/google-cloud/infrastructure-as-code.adoc` — Infrastructure Manager (managed Terraform),
  Deployment Manager end of support 2026-04-01 / shutdown 2027-06-30 and DM Convert, Runtime Configurator going with it,
  one Terraform `hashicorp/google` v8 example (plain-prose pointer to #171), Config Connector, Bookshelf baseline
  template/Terraform module. `== Clean up`.

### Group 3 — Content pages: compute

**Parallelizable: yes.** Eight independent pages. Spec: "Page outline (1/2)" → *Compute*.

- [x] Task 8. Create `cloud/google-cloud/choosing-a-compute-service.adoc` — Google decision guide; Compute Engine, App Engine
  (Cloud Run recommended for new users; legacy runtimes decommissioned 2027-01-31; `migrate-to-run` Preview), Cloud Run,
  Cloud Run functions, GKE, Batch; comparison table. 📊 Mermaid decision flowchart.
- [x] Task 9. Create `cloud/google-cloud/compute-engine.adoc` — machine families (E2/N4/C4/C4A/…), Hyperdisk, images,
  Spot VMs, OS Login (`compute.requireOsLogin`), IAP TCP forwarding, startup scripts, instance templates + MIGs
  (autohealing/autoscaling), konlet/`create-with-container` retirement (2026-07-31 / 2027-07-31), VM Manager/OS patching,
  snapshot schedules + Backup and DR. `== Clean up`.
- [x] Task 10. Create `cloud/google-cloud/container-registry-and-builds.adoc` — Artifact Registry (Container Registry
  `gcr.io` shut down 2025-03-18, gcr.io repositories in AR), Docker/Maven/npm/Python repos, cleanup policies, remote/virtual
  repos, Cloud Build (triggers, 2nd-gen repository connections, Cloud Source Repositories closed to new customers
  2024-06-17, Secure Source Manager), Jib/buildpacks, GitHub Actions + WIF push linking `backend/docker/*`. `== Clean up`.
- [x] Task 11. Create `cloud/google-cloud/cloud-run.adoc` ★ — services, source vs image deploy, config, env vars/secret
  mounts, IAM invoker, authenticated vs public (`--no-invoker-iam-check`), custom domains (domain mapping Preview →
  global ALB + serverless NEG), Direct VPC egress, sidecars, volume mounts, request/instance-based billing, limits (60-min
  timeout, 8 vCPU/32 GiB), Bookshelf `catalog-api` end to end, troubleshooting. 📊 SVG + Mermaid.
- [x] Task 12. Create `cloud/google-cloud/cloud-run-scaling-traffic-and-jobs.adoc` ★ — autoscaling, concurrency, min/max
  instances, startup CPU boost, revisions, rollback, gradual rollout/blue-green, tags, jobs (168 h, 10,000 tasks) +
  Cloud Scheduler, worker pools (GA 2026-04-14), instances (Preview), GPUs, multi-region (GA 2026-06-29). 📊 Mermaid traffic split.
- [x] Task 13. Create `cloud/google-cloud/cloud-run-functions-and-events.adoc` ★ — Cloud Functions → Cloud Run functions
  (rename 2024-08-22; direct deploy 2025-02-19; 1st gen), HTTP vs event-driven, Eventarc triggers vs Pub/Sub push, runtimes,
  Functions Framework, Bookshelf `notifier`, links `backend/quarkus/serverless-and-cloud-functions.adoc`.
- [x] Task 14. Create `cloud/google-cloud/gke-clusters.adoc` ★ — Autopilot vs Standard, zonal vs regional, release channels
  (1.35 Regular), node pools/resizing, upgrades/maintenance windows, private clusters, Workload Identity Federation for GKE,
  fleets/Multi-Cluster Ingress, pricing, troubleshooting. 📊 SVG clusters. `== Clean up`.
- [x] Task 15. Create `cloud/google-cloud/gke-microservices.adoc` ★ — deploying Bookshelf (`kubectl`/Helm/Kustomize),
  Jib + Skaffold + Cloud Code, Gateway API (HTTPRoute), IAP on GKE, ConfigMaps/Secrets and Config Sync, HPA/VPA,
  Deployments/Services only linking generic K8s pages (#162 merged; check nav) and `backend/quarkus/kubernetes-and-openshift.adoc`.
  📊 Mermaid. `== Clean up`.

### Group 4 — Content pages: storage and CDN

**Parallelizable: yes.** Four independent pages. Spec: "Page outline (2/2)" → *Storage and CDN*.

- [x] Task 16. Create `cloud/google-cloud/block-and-file-storage.adoc` — Persistent Disk/Hyperdisk, snapshots (instant/archive),
  Filestore (CSI on GKE), Parallelstore/Managed Lustre briefly; links `backend/springboot/file-storage-and-object-stores.adoc`.
- [x] Task 17. Create `cloud/google-cloud/cloud-storage.adoc` ★ — buckets/objects, storage classes, locations, versioning,
  soft delete, lifecycle, Autoclass, `gcloud storage` (gsutil retirement after March 2027), parallel composite uploads,
  Storage Transfer Service, Cloud Storage FUSE, Spring Cloud GCP Storage link. 📊 SVG. `== Clean up`.
- [x] Task 18. Create `cloud/google-cloud/cloud-storage-security-and-static-sites.adoc` ★ — uniform bucket-level access,
  IAM roles, signed URLs (V4), public access prevention, CMEK, retention/holds, managed folders, static website hosting
  (behind ALB), CORS. `== Clean up`.
- [x] Task 19. Create `cloud/google-cloud/cloud-cdn-and-media-cdn.adoc` ★ — global external Application Load Balancer + Cloud CDN
  backend buckets/services, cache modes, signed URLs/cookies, invalidation, Media CDN, certificates, Bookshelf front end.
  📊 Mermaid request flow. `== Clean up`.

### Group 5 — Content pages: managed databases

**Parallelizable: yes.** Six independent pages. Spec: "Page outline (2/2)" → *Managed databases*.

- [x] Task 20. Create `cloud/google-cloud/managed-databases-overview.adoc` — table mapping **every engine documented on this
  site** (PostgreSQL, MySQL, SQL Server, MongoDB, Redis, Elasticsearch, Lucene/Solr, Couchbase, Neo4j, Qdrant, Prometheus,
  vector search) to its Google Cloud option, linking engine reference + Google Cloud page; BigQuery vector search; decision flow.
  📊 Mermaid decision tree.
- [x] Task 21. Create `cloud/google-cloud/cloud-sql.adoc` ★ — PostgreSQL/MySQL/SQL Server, editions, HA, replicas, backups/PITR,
  private IP/PSC, Auth Proxy + Language Connectors, IAM database auth, pgvector, Spring Boot/Cloud SQL wiring.
  `== Clean up` (retained backups).
- [x] Task 22. Create `cloud/google-cloud/alloydb.adoc` ★ — clusters/instances, columnar engine, read pools, ScaNN, AlloyDB
  Omni briefly, connectivity, backups, Bookshelf scale-up variant. `== Clean up`.
- [x] Task 23. Create `cloud/google-cloud/spanner-firestore-and-bigtable.adoc` ★ — Spanner (processing units, interleaving),
  Firestore (Native, security rules), Bigtable; when to choose each.
- [x] Task 24. Create `cloud/google-cloud/mongodb-on-google-cloud.adoc` ★ — Firestore with MongoDB compatibility, MongoDB Atlas
  on Google Cloud (Marketplace/PSC), self-managed on GCE/GKE; links `database/mongodb/*` and `database/mongodb/security.adoc`
  (CSFLE with Cloud KMS). Bookshelf `orders`.
- [x] Task 25. Create `cloud/google-cloud/memorystore-and-partner-databases.adoc` ★ — Memorystore (Valkey/Redis Cluster/Redis)
  console/CLI quick start, short summary linking `database/redis/deploying-on-google-cloud.adoc` for depth; partner/self-managed
  options for Elasticsearch, Couchbase, Neo4j, Qdrant, Solr, Prometheus (Managed Service for Prometheus).

### Group 6 — Content pages: security and runtime configuration

**Parallelizable: yes.** Two independent pages. Spec: "Page outline (2/2)" → *Security and runtime configuration*.

- [x] Task 26. Create `cloud/google-cloud/secret-manager-and-kms.adoc` ★ — Secret Manager (versions, rotation, regional secrets,
  IAM, Cloud Run/GKE integration, Spring Cloud GCP), Cloud KMS (keys, rings, protection levels, CMEK, destruction scheduling),
  link `database/mongodb/security.adoc`. `== Clean up`.
- [x] Task 27. Create `cloud/google-cloud/runtime-configuration.adoc` ★ — Parameter Manager, Cloud Run env vars + secret mounts,
  ConfigMaps on GKE + Config Sync, Runtime Configurator end-of-life; links `backend/springboot/configuration-and-profiles.adoc`.

### Group 7 — Content pages: networking, gateways and VPN

**Parallelizable: yes.** Five independent pages. Spec: "Page outline (2/2)" → *Networking, gateways and VPN*.

- [x] Task 28. Create `cloud/google-cloud/vpc-networking.adoc` — custom-mode VPC, subnets, Private Google Access, firewall rules
  and policies, static IPs, flow logs, Cloud NAT, Private Service Connect, VPC peering (documented from official docs), Shared VPC,
  VPC Service Controls. 📊 SVG. `== Clean up`.
- [x] Task 29. Create `cloud/google-cloud/cloud-dns-and-certificates.adoc` — Cloud DNS zones, DNSSEC, Certificate Manager,
  Google-managed certs, domain verification. `== Clean up`.
- [x] Task 30. Create `cloud/google-cloud/load-balancing-and-cloud-armor.adoc` ★ — the Cloud Load Balancing family and chooser,
  global external Application LB, serverless NEGs, URL maps, custom request headers, Cloud Armor (WAF, rate limiting, allow/deny),
  Cloud NAT, custom domains for Cloud Run. 📊 Mermaid decision tree.
- [x] Task 31. Create `cloud/google-cloud/api-gateway-apigee-and-endpoints.adoc` ★ — API Gateway (OpenAPI), Apigee, Cloud Endpoints
  + ESPv2, Gateway API on GKE, JWT validation; links `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`
  and OAuth/OIDC pages.
- [x] Task 32. Create `cloud/google-cloud/vpn-and-hybrid-connectivity.adoc` ★ — states plainly there is **no managed
  point-to-site/client VPN**; HA VPN + Cloud Router (BGP), Cloud Interconnect, user-access alternatives (IAP TCP forwarding,
  OS Login, third-party/self-managed VPN), site-to-site lab to a simulated on-premises VPC. `== Clean up`.

### Group 8 — Content pages: email and integration

**Parallelizable: yes.** Two independent pages. Spec: "Page outline (2/2)" → *Email and integration*.

- [x] Task 33. Create `cloud/google-cloud/email-sending.adoc` ★ — states plainly there is **no first-party transactional email
  service** and **outbound port 25 is blocked**; third-party providers (SendGrid, Mailgun, Mailjet) via API and SMTP on 587,
  Google Workspace SMTP relay, Gmail API; key in Secret Manager; authenticated invoker (correct the book's open-relay example);
  Spring `JavaMailSender` / Quarkus Mailer wiring linking `backend/springboot/configuration-and-profiles.adoc` and
  `backend/quarkus/scheduling-and-mail.adoc`. `== Clean up`.
- [x] Task 34. Create `cloud/google-cloud/messaging-and-integration.adoc` — Pub/Sub (push/pull, ordering, DLQ), Eventarc, Cloud Tasks,
  Cloud Scheduler, Workflows, Managed Service for Apache Kafka; links `backend/messaging/*`, `backend/quarkus/messaging.adoc`.

### Group 9 — Content pages: operations, governance and beyond

**Parallelizable: yes.** Six independent pages. Spec: "Page outline (2/2)" → *Operations, governance and beyond*.

- [x] Task 35. Create `cloud/google-cloud/monitoring-and-observability.adoc` — Cloud Monitoring/Logging/Trace/Profiler/Error Reporting,
  OpenTelemetry, Managed Service for Prometheus, alerting, log sinks; Cloud Debugger shutdown (2023-05-31); links
  `backend/springboot/{logging,metrics-and-observability}.adoc`, `database/prometheus/*`, `backend/docker/resources-logging-and-monitoring.adoc`.
- [x] Task 36. Create `cloud/google-cloud/governance-security-and-compliance.adoc` — org policies, Security Command Center, Cloud Asset
  Inventory, audit logs, VPC Service Controls, Assured Workloads, compliance resources, Cloud Run Threat Detection.
- [x] Task 37. Create `cloud/google-cloud/cost-management-and-billing.adoc` — billing accounts vs projects, budgets (alert, not cap),
  pricing calculator, committed use discounts, labels, billing export to BigQuery, Free tier/trial details, per-second billing.
- [x] Task 38. Create `cloud/google-cloud/architecture-migration-and-multicloud.adoc` — Architecture Framework, Migration Center,
  Migrate to Virtual Machines, Database Migration Service, Anthos/Google Distributed Cloud, multicloud, "Coming from" pointers;
  links `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`.
- [x] Task 39. Create `cloud/google-cloud/ai-data-and-analytics-overview.adoc` — BigQuery (partitioning/clustering, time travel,
  ML), Dataflow/Dataproc/Data Fusion/Pub-Sub streaming, Vertex AI, Gemini; gives every book ch.8–10 concept a home.
- [x] Task 40. Create `cloud/google-cloud/developer-tools-and-devops.adoc` — Cloud Code, Cloud Workstations, Cloud Build CI/CD,
  Cloud Deploy, GitHub/GitLab with WIF, Terraform/IaC pointers, Cloud Source Repositories closure; links `backend/docker/ci-cd-with-github-actions.adoc`.

### Group 10 — Section index, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task creates or edits a **distinct** file and only references pages that exist after Groups 1–9.

- [x] Task 41. Create `cloud/google-cloud/index.adoc` ("Google Cloud") + `images/google-cloud-bookshelf-architecture.svg`
  (done; only the xref to `cheat-sheet.adoc` awaits Task 42; bibliography URLs verified 200, except O'Reilly which returns 403 to curl)
  - [x] Task 41.1. Header + disclaimer; what the section is/who it's for; re-verified tool/version baseline; the *Bookshelf* scenario
    with the final-architecture SVG; reading path; `== What's covered` grouped as Groups 2–9 (6/8/4/6/2/5/2/6 + index) plus cheat
    sheet, with a 📊 Mermaid mind-map; related-material-elsewhere table (existing-pages table above).
  - [x] Task 41.2. **`== Coming from Azure`** and **`== Coming from AWS`** mapping tables with working `xref:`s (Container Apps/ECS →
    Cloud Run, AKS/EKS → GKE, Blob/S3 → Cloud Storage, Front Door/CloudFront → Cloud CDN + global ALB, Key Vault/Secrets Manager →
    Secret Manager + KMS, App Configuration/AppConfig → Parameter Manager, APIM/API Gateway → Apigee/API Gateway, VPN Gateway/Client VPN →
    HA VPN, ACS Email/SES → third-party providers).
  - [x] Task 41.3. **`== Bibliography`** with anchor `[[_bibliography]]`: the O'Reilly publisher page, docs.cloud.google.com / cloud.google.com
    grouped by section, gcloud reference + release notes, deprecations pages, partner docs; closing sentence that official docs win on
    discrepancy. Take URLs from the "Key references" comment and verify each.
- [x] Task 42. (done: 40 xrefs verified; PDF 1 page A4; konlet dates 2025-07-21/2026-07-31) Create `cloud/google-cloud/cheat-sheet.adoc` and `modules/ROOT/attachments/google-cloud-cheat-sheet.pdf`
  - [x] Task 42.1. `= Google Cloud Cheat Sheet` + disclaimer + intro linking `xref:attachment$google-cloud-cheat-sheet.pdf[downloadable PDF]`
    with bullet summary and version baseline; grouped `xref:` paragraphs to **all 40** pages; final download link. Verify every target exists.
  - [x] Task 42.2. Author the single-A4 HTML/CSS **in the scratchpad** covering the issue's cheat-sheet list (see issue body), styled
    consistently with `aws-cheat-sheet.pdf`.
  - [x] Task 42.3. Render with headless Chrome; verify with PyMuPDF `page_count == 1` and A4; inspect a PNG for clipping; copy only the PDF
    into `modules/ROOT/attachments/`; `git status --porcelain` shows no `.html`.
- [x] Task 43. Site wiring (edit only these files)
  - [x] Task 43.1. `modules/ROOT/partials/cloud-disclaimer.adoc`: extend to also point to
    `xref:cloud/google-cloud/index.adoc#_bibliography[Google Cloud]`.
  - [x] Task 43.2. `modules/ROOT/pages/cloud/index.adoc`: add a Google Cloud bullet under `== Sections`; update `:description:`/`:keywords:`
    (add `Google Cloud, GCP, Google Cloud Platform`); keep the "other providers may be added" sentence.
  - [x] Task 43.3. `modules/ROOT/nav.adoc`: insert `*** xref:cloud/google-cloud/index.adoc[Google Cloud]` right after
    `**** xref:cloud/aws/cheat-sheet.adoc[Cheat Sheet (PDF)]`, then 39 flat `****` content-page entries in outline order (labels from each
    page's `= Title`) and `**** xref:cloud/google-cloud/cheat-sheet.adoc[Cheat Sheet (PDF)]`; verify count with `grep -c`.
  - [x] Task 43.4. `modules/ROOT/pages/index.adoc`: mention Google Cloud in `:description:`; append the issue's keyword list to
    `:keywords:` skipping existing terms; **no new tile**.
  - [x] Task 43.5. `modules/ROOT/pages/cloud/azure/index.adoc` (and `cloud/aws/index.adoc`, one line each): reciprocal link to the Google
    Cloud section — no other change.
- [x] Task 44. Back-links in existing pages — one sentence/bullet each, never repeat content; each file edited by exactly one sub-task.
  - [x] Task 44.1. `database/redis/deploying-on-google-cloud.adoc` → `memorystore-and-partner-databases.adoc`;
    `backend/springboot/file-storage-and-object-stores.adoc` → `cloud-storage.adoc`, `block-and-file-storage.adoc`;
    `backend/springboot/configuration-and-profiles.adoc` → `secret-manager-and-kms.adoc`, `runtime-configuration.adoc`.
  - [x] Task 44.2. `backend/quarkus/serverless-and-cloud-functions.adoc` → `cloud-run-functions-and-events.adoc`;
    `backend/quarkus/scheduling-and-mail.adoc` → `email-sending.adoc`; `backend/quarkus/kubernetes-and-openshift.adoc` → `gke-microservices.adoc`.
  - [x] Task 44.3. `backend/docker/registries-and-docker-hub.adoc` → `container-registry-and-builds.adoc`;
    `backend/docker/ci-cd-with-github-actions.adoc` → `container-registry-and-builds.adoc`/`developer-tools-and-devops.adoc`;
    `backend/docker/orchestration-swarm-and-kubernetes.adoc` → `gke-clusters.adoc`, `gke-microservices.adoc`.
  - [x] Task 44.4. `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc` → `load-balancing-and-cloud-armor.adoc`,
    `api-gateway-apigee-and-endpoints.adoc`; `database/vector-rag/comparing-vector-databases.adoc` → `managed-databases-overview.adoc`;
    `database/vector-rag/postgresql-pgvector.adoc` → `cloud-sql.adoc`/`alloydb.adoc`.
  - [x] Task 44.5. `web/vaadin/production-and-deployment.adoc` → `cloud-run.adoc`/`gke-microservices.adoc`;
    `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` → `architecture-migration-and-multicloud.adoc`.

### Group 11 — Build and verify

**Parallelizable: yes** (single task; depends on every prior group).

- [x] Task 45. Verify the whole section builds cleanly (run builds via a sub-agent so output doesn't flood the main context).
  - [x] Task 45.1. `npx antora antora-playbook.yml` — zero errors/warnings; fix every `xref`/attribute/AsciiDoc issue; confirm the pages
    render in `build/site/irurueta/cloud/google-cloud/`.
  - [x] Task 45.2. `npm run validate:mermaid` (install `mermaid@11 jsdom` with `--no-save` if needed) — all diagrams pass.
  - [x] Task 45.3. Grep `cloud/google-cloud/` for line-leading `<digits>.`, unescaped `{`/`}` outside source blocks, any admonition other
    than the disclaimer (`grep -nE '^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):|^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'`), real-looking project
    IDs/keys (`AIza`, `-----BEGIN`), `gsutil` used as the primary tool, and mentions of the book title outside `index.adoc`.
  - [x] Task 45.4. `git status --porcelain` — only intended files; no stray `.html`, no copy of `~/Desktop/gcloud.pdf`; each of the 40 pages is
    linked from `nav.adoc`, `cloud/google-cloud/index.adoc` and `cheat-sheet.adoc`.
  - [x] Task 45.5. Live spot-check against the official docs: dates/retirements strip in the PDF and pages, gcloud/GKE/Terraform/Spring Cloud
    GCP versions, and a sample of gcloud commands on ★ pages (flags exist in the current reference). Fix inaccuracies (re-render the PDF if it changes).
