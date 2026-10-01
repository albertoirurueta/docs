# Implementation Plan: Guides & References / Cloud — AWS (Amazon Web Services)

## Task summary

Source: GitHub issue #163
Base branch: main

Issue [#163](https://github.com/albertoirurueta/docs/issues/163) asks for a new **AWS** section under
**Guides & References → Cloud** (`modules/ROOT/pages/cloud/aws/`), next to the existing Azure section: a practical
guide to learning and using Amazon Web Services from the **AWS Management Console** and the **AWS CLI v2**, built
from the current official AWS documentation and cross-checked against three requester-provided books (Wittig &
Wittig *AWS in Action* 3e, Taulli *CLF-C02 Study Guide*, Culkin & Zazon *AWS Cookbook*). It is 42 content pages
(including `index.adoc`) + `cheat-sheet.adoc` + a one-page A4 PDF.

The issue body is the primary spec. Its **five comments are part of it** and every content task below must read the
relevant one in full (`gh issue view 163 --comments`, or the comment list):

| Comment (title) | Holds |
|---|---|
| "Addendum: concepts contributed by each book" | chapter-by-chapter concept tables of the 3 books (every concept must land on ≥ 1 page) |
| "Addendum: where the books are outdated, narrower, or silent" | verified retirements/renames/new-since-the-books list (dates verified 2026-09-27) |
| "Page outline (1/2): foundations and compute" | per-page spec for Foundations + Compute (first 3 compute pages) |
| "Page outline (2/2): storage, databases, security, networking, email and operations" | per-page spec for everything else |
| "Key references" | starting bibliography URLs |

Choices made during exploration/planning (none ambiguous enough to ask the user about):

1. **Ship everything in one pass**, exactly as specified (no consolidation), mirroring how Azure (#192) was delivered
   (`.archive/implementation_plan_192.md`).
2. **Tasks are untagged (no language key).** The installed `*-code-one-task` skills only cover `java`,
   `java-springboot`, `dotnet`, `database`; none applies to authoring AsciiDoc/SVG/PDF. Every task is implemented
   directly. CLI/SDK/CloudFormation/CDK snippets inside pages are page *content*, not repo source.
3. **Disclaimer shape follows the #145/#187/#192 rule.** `aws-disclaimer.adoc` contains only the AI-assistance
   sentence and the bibliography pointer. **No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block anywhere in
   the section**: retirements, cost warnings, preview caveats, security caveats and "book is outdated" remarks are
   prose or table rows.
4. **Books are named only in `index.adoc`'s `== Bibliography`**, never as the source of a command or code example.
   Where a book is outdated (gp2, OAI, Aurora Serverless v1, Node SDK v2, CLI v1, Copilot, Amazon Linux 2, …) the
   page says "the current approach is X" in prose citing the official docs; the issue also asks that book-outdated
   remarks be present, so phrase them as "older guides/tutorials still show …" without naming a book on the page.
5. **Versions are re-verified at implementation time.** Issue baseline (checked 2026-09-27): AWS CLI 2.37, CDK 2.27x,
   SAM CLI 1.16x, eksctl 0.23x, EKS 1.36, Terraform AWS provider v6, Spring Cloud AWS 4.x (Boot 4) / 3.4.x (Boot 3.5).
   Re-check each against live docs before publishing and write the verified value in each page's intro.
6. **One running scenario, *Bookshelf*** (defined below) so pages authored in parallel stay consistent.

## Current code state

- There is **no `modules/ROOT/pages/cloud/aws/`**, no `partials/aws-disclaimer.adoc`, no `partials/cloud-disclaimer.adoc`,
  no `images/aws-*.svg` and no `attachments/aws-cheat-sheet.pdf`. `cloud/azure/*` (36 pages + cheat sheet),
  `partials/azure-disclaimer.adoc`, `images/azure-*.svg`, `images/cloud.svg` and `attachments/azure-cheat-sheet.pdf`
  already exist and are the structural template.
- **`modules/ROOT/pages/cloud/index.adoc`** exists: includes `partial$azure-disclaimer.adoc`, has a `== Sections` list
  with one Azure bullet and a sentence that other providers may be added. It must switch to
  `partial$cloud-disclaimer.adoc` and gain an AWS bullet + `:description:`/`:keywords:`.
- **`modules/ROOT/nav.adoc`**: the Azure block ends with `**** xref:cloud/azure/cheat-sheet.adoc[Cheat Sheet (PDF)]`;
  the next top-level line is `** xref:git-and-github/index.adoc[Git & GitHub]`. The AWS block (`***` entry + flat
  `****` children) goes between them. Match on text, not line numbers.
- **`modules/ROOT/pages/index.adoc`**: Cloud tile already exists → **no new tile**; only `:description:` (mention AWS)
  and the long `:keywords:` line (append the issue's AWS keyword list, skipping terms already present) change.
- **Page shape to mirror** (`cloud/azure/*.adoc`, `database/vector-rag/*.adoc`): `= Title`, `:description:`,
  `:keywords:`, blank line, disclaimer include, lead paragraph with tool/version baseline, `==` sections, per hands-on
  concept `=== In the AWS Management Console` + `=== With the AWS CLI`, `== Clean up` where resources are created,
  mandatory `== References` (official online docs only), optional `== Related pages`.
- **Figures**: hand-authored `modules/ROOT/images/aws-*.svg` (viewBox, `font-family="Helvetica, Arial, sans-serif"`,
  flat light background, hard-coded hex colours, no CSS variables/external refs, original drawings — never AWS
  Architecture Icons or book figures) and `[mermaid]` blocks (`....`) validated by `npm run validate:mermaid`
  (`scripts/validate-mermaid.mjs`; needs `npm i --no-save mermaid@11 jsdom`).
- **Cheat-sheet PDF pipeline** (from `.archive/implementation_plan_121.md`/`_187.md`/`_192.md`): author a single-page
  A4 HTML/CSS **in the scratchpad, never the repo**; render with
  `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --print-to-pdf=<out> --no-pdf-header-footer <file.html>`;
  verify with PyMuPDF (`fitz`) that `page_count == 1` and the rect is A4, render a PNG and check no clipping (beware
  `column-span: all` blank-page bug — keep wide tables outside the multi-column block); copy only the PDF to
  `modules/ROOT/attachments/aws-cheat-sheet.pdf`; `git status --porcelain` must show no `.html`.
- **Existing pages to link, never repeat** (issue's "What already exists" table; each gets **one sentence/bullet**):
  `database/redis/deploying-on-aws.adoc`, `backend/springboot/file-storage-and-object-stores.adoc`,
  `backend/springboot/configuration-and-profiles.adoc` (`=== AWS Secrets Manager and Parameter Store`,
  `=== Kubernetes ConfigMaps and Secrets`), `backend/quarkus/serverless-and-cloud-functions.adoc` (`== AWS Lambda`),
  `backend/quarkus/scheduling-and-mail.adoc`, `backend/docker/{registries-and-docker-hub,ci-cd-with-github-actions,orchestration-swarm-and-kubernetes}.adoc`,
  `backend/quarkus/kubernetes-and-openshift.adoc`, `backend/messaging/*`, `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`,
  `web/react/build-and-deployment.adoc`, `web/aspnet/core/{deployment,security-hardening}.adoc`,
  `web/vaadin/production-and-deployment.adoc`, `web/vue/performance-and-deployment.adoc`,
  `database/vector-rag/{comparing-vector-databases,postgresql-pgvector}.adoc`, `database/choosing-the-right-database.adoc`,
  `backend/springboot/{logging,metrics-and-observability}.adoc`, `database/prometheus/*`, all engine references
  (`database/{sql,mongodb,elasticsearch,lucene,solr,neo4j,couchbase,qdrant,redis,prometheus}/*`) and `cloud/azure/*`.
- **Related open issues** referenced in **plain prose only** (no `xref:` to pages that don't exist): #171 (Terraform —
  IaC page shows one `hashicorp/aws` v6 example), #184 (cloud API/secret managers/gateways), #162 (Kubernetes — EKS
  pages cover only EKS-specific concerns; note #162 is already merged for generic K8s, check `database`/`backend`
  nav before wording), #164 (Google Cloud, future sibling).
- **Verification** is the Antora build (`npx antora antora-playbook.yml`, zero errors/warnings) plus the Mermaid
  validator, run via a sub-agent so output doesn't flood the main context. No test/coverage/quality tooling exists for
  AsciiDoc.
- **AsciiDoc gotchas** (from earlier sections): escape literal `{word}` outside `[source]` blocks as `\{ … \}`
  (JSON, shell `${VAR}`, ARNs/templates in prose and table cells); never let a wrapped line start with `<digits>.`.

## Shared *Bookshelf* scenario

*Bookshelf*: a static web front end, a `catalog-api` (Spring Boot), an `orders-api`, and a `notifier` worker that
sends order-confirmation emails. Same app as the Azure section, so the clouds compare side by side.

| Concern | Name / value |
|---|---|
| Region | `us-east-1` unless a page needs another (examples note it is a placeholder; CloudFront certs must be in `us-east-1`) |
| Account ID | placeholder `111122223333` / `$ACCOUNT_ID` (`aws sts get-caller-identity --query Account --output text`) |
| ECR repositories | `bookshelf/catalog-api`, `bookshelf/orders-api`, `bookshelf/notifier` |
| ECS | cluster `bookshelf`, services `catalog-api` (Express Mode first, then full service behind ALB `alb-bookshelf`), `orders-api` |
| Lambda | `notifier` (SQS-triggered), `thumbnailer` (S3-triggered) |
| S3 | `bookshelf-web-<account-id>` (static site, private, OAC), `bookshelf-uploads-<account-id>` |
| CloudFront | distribution `bookshelf-cdn` |
| Databases | Aurora PostgreSQL Serverless v2 `bookshelf-catalog` (db `catalog`); DynamoDB table `Orders` (or DocumentDB `bookshelf-orders` as the MongoDB variant); ElastiCache for Valkey serverless `bookshelf-cache` |
| Secrets/config | Secrets Manager `bookshelf/catalog/db`; Parameter Store `/bookshelf/*`; AppConfig app `bookshelf` |
| EKS | cluster `bookshelf-eks` (eksctl, Pod Identity) |
| API Gateway | HTTP API `bookshelf-api` |
| VPN | Client VPN endpoint `cvpn-bookshelf` |
| SES | domain `example.com` placeholder, `no-reply@example.com` |
| Java package | `com.example.bookshelf` |
| Shell variables | `AWS_REGION`, `ACCOUNT_ID`, `CLUSTER`, `BUCKET`, … (never real IDs/keys) |

## Conventions every content page must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:`, blank line,
  `include::partial$aws-disclaimer.adoc[]`, lead paragraph stating tool/version baseline (re-verified).
- **Two subsections per hands-on concept**: `=== In the AWS Management Console` (numbered navigation-path steps, no
  screenshots, mention the region selector and CloudShell where relevant) and `=== With the AWS CLI` (`[source,bash]`,
  shell variables, `--query`/`--output`). **Every command/code example is followed by a link to the official page it
  derives from** (CLI Command Reference or user-guide page). Where the CLI is impractical, give JSON +
  CloudFormation/CDK alternative.
- **Application code** where an app uses the service: Java (AWS SDK for Java 2.x, Spring Cloud AWS 4.x/3.4.x) primary;
  boto3 / Node.js SDK v3 only where the official example is clearly better; always default credential chain and
  IAM roles (task roles, Lambda execution roles, EKS Pod Identity, instance profiles) — never long-lived keys.
- **Every page** covers pricing model/cost drivers (prose, **no hard-coded prices**, dated pricing link), limits and
  quotas, recent changes (with dates), and where older guides are outdated.
- **★ pages** additionally: complete console + CLI walkthroughs, configuration options, security (full IAM policy
  JSON), networking, scaling, pricing model, troubleshooting.
- **`== Clean up`** on every page creating resources (delete in dependency order / `delete-stack` / `cdk destroy` /
  `sam delete` / `eksctl delete cluster`; empty versioned buckets; Secrets Manager recovery window; KMS deletion
  scheduling). **`== References`** on every page (official docs only).
- **No admonitions** except the disclaimer. **No real account IDs/keys/ARNs/secrets.**
- **Figures**: `[mermaid]` or `aws-*.svg` at least wherever the outline's 📊 suggests; each task authors the SVGs its
  own page embeds. All Mermaid must pass the validator.
- **Cross-link, don't repeat** existing site material; escape `{ }`; avoid line-leading `<digits>.`.
- Every page must be reachable from both `cloud/aws/index.adoc` and `nav.adoc` once Group 10 lands. Pages `xref:` each
  other by planned final path only.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every content page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/aws-disclaimer.adoc`
  - [x] Task 1.1. Single `[IMPORTANT]` / `====` block (copy markup shape from `partials/azure-disclaimer.adoc`)
    containing **only**: "This content was generated with the assistance of AI and should be verified against the
    official documentation before being relied on in production." and a pointer to
    `xref:cloud/aws/index.adoc#_bibliography[the section bibliography]`. No version line, book name or other sentence.
  - [x] Task 1.2. Confirm the include line every page uses: `include::partial$aws-disclaimer.adoc[]`.

### Group 2 — Content pages: foundations

**Parallelizable: yes.** Six independent pages; `cloud/aws/index.adoc` is deferred to Group 10 because its Bibliography
and "What's covered" need the final page list. Spec: comment "Page outline (1/2)" → *Foundations*.

- [x] Task 2. Create `cloud/aws/cloud-concepts.adoc` (conceptual; console/CLI subsections may be omitted) — cloud
  computing, IaaS/PaaS/SaaS, shared responsibility, deployment models, CapEx vs. OpEx, Well-Architected pillars, Cloud
  Adoption Framework, example architectures; mapping table to later pages. 📊 shared-responsibility SVG, stack SVG.
- [x] Task 3. Create `cloud/aws/getting-started.adoc` — account creation/root user hygiene, IAM Identity Center user,
  Free Tier plans (re-verify current terms), Console tour, CloudShell, AWS CLI v2 install/`aws configure sso`/
  `aws login`/profiles/`--query`/`--output`, SDKs, region selection. 📊 Mermaid account → user → profile flow.
- [x] Task 4. Create `cloud/aws/global-infrastructure.adoc` — regions, AZs, Local Zones, Wavelength, edge locations,
  opt-in regions, GovCloud/China partitions, choosing a region, `aws ec2 describe-regions/availability-zones`.
  📊 regions/AZs SVG.
- [x] Task 5. Create `cloud/aws/accounts-and-organizations.adoc` — Organizations, OUs, SCPs, Control Tower, landing
  zone, consolidated billing, tags/tag policies, account factory, multi-account strategy; `aws organizations …` CLI.
  📊 Mermaid org hierarchy. `== Clean up`.
- [x] Task 6. Create `cloud/aws/identity-and-access.adoc` — IAM users/groups/roles/policies (identity vs. resource vs.
  boundary vs. SCP), policy evaluation, IAM Identity Center, STS/assume-role, instance profiles, default credential
  chain (Java snippet), OIDC federation for GitHub Actions (link `backend/docker/ci-cd-with-github-actions.adoc`),
  Cognito briefly, IAM Access Analyzer, root-user MFA; links `backend/oauth/*`, Quarkus/Spring security pages.
  📊 Mermaid sequence diagram of role assumption.
- [x] Task 7. Create `cloud/aws/infrastructure-as-code.adoc` — CloudFormation (stacks, change sets, drift), CDK v2,
  SAM, one Terraform `hashicorp/aws` v6 example with plain-prose pointer to #171, Copilot CLI end-of-support note,
  runnable CloudFormation template for the Bookshelf baseline. `== Clean up`.

### Group 3 — Content pages: compute

**Parallelizable: yes.** Nine independent pages. Spec: "Page outline (1/2)" → *Compute* (+ comment holding ECS/Lambda/EKS ★ outlines).

- [x] Task 8. Create `cloud/aws/choosing-a-compute-service.adoc` — AWS decision guide, EC2/Lightsail/App Runner
  availability change/Elastic Beanstalk/Batch in one paragraph each, comparison table (EC2 / ECS / ECS Express Mode /
  Lambda / EKS / App Runner / Beanstalk). 📊 Mermaid decision flowchart.
- [x] Task 9. Create `cloud/aws/ec2-and-auto-scaling.adoc` — instance families/Graviton, AMIs/Amazon Linux 2 end of
  support → AL2023, EBS/instance store (link storage page), user data, security groups, key pairs vs. SSM Session
  Manager, purchasing options (On-Demand/Savings Plans/Spot), Auto Scaling groups + scaling policies, launch templates,
  Packer/CodeDeploy mention; `aws ec2 run-instances` etc. `== Clean up`.
- [x] Task 10. Create `cloud/aws/container-registry.adoc` — ECR: repositories, `aws ecr get-login-password`, push/pull,
  image scanning, lifecycle policies, replication, pull-through cache, immutability; GitHub Actions OIDC push linking
  the Docker CI/CD page. `== Clean up`.
- [x] Task 11. Create `cloud/aws/ecs-and-fargate.adoc` ★ — clusters, task definitions (task role vs. execution role),
  services, Fargate vs. EC2 capacity, **ECS Express Mode** (`create-express-gateway-service`, console flow,
  limitations), Bookshelf `catalog-api` end to end, secrets/config injection syntax, logging, pricing, troubleshooting.
  📊 SVG ECS building blocks; 📊 Mermaid Express Mode vs. full service.
- [x] Task 12. Create `cloud/aws/ecs-deployments-scaling-and-networking.adoc` ★ — `awsvpc` networking, ALB integration,
  Service Connect, rolling vs. blue/green vs. canary/linear deployments, deployment circuit breaker, Application Auto
  Scaling (target tracking, scheduled), capacity providers/Fargate Spot, `execute-command`, ECS scheduled/standalone
  tasks, observability, troubleshooting. 📊 Mermaid deployment strategies.
- [x] Task 13. Create `cloud/aws/lambda.adoc` ★ — functions, runtimes (re-verify deprecations), packaging (zip/
  container), execution role + resource policy IAM JSON, invocation models, function URLs, layers, versions/aliases,
  concurrency/provisioned concurrency, SnapStart for Java, memory/timeout/limits, VPC access, pricing, troubleshooting;
  links `backend/quarkus/serverless-and-cloud-functions.adoc`. 📊 Mermaid lifecycle/cold start.
- [x] Task 14. Create `cloud/aws/lambda-event-driven-and-serverless-apps.adoc` ★ — event source mappings (SQS,
  DynamoDB Streams, Kinesis), S3 triggers, EventBridge, Step Functions, API Gateway/function URL front ends, SAM
  (`sam init/build/deploy/delete`), partial batch responses, DLQ/destinations, Powertools, Bookshelf `notifier` (SQS)
  and `thumbnailer` (S3). 📊 Mermaid event flow. `== Clean up`.
- [x] Task 15. Create `cloud/aws/eks-clusters.adoc` ★ — EKS Auto Mode vs. managed node groups vs. Fargate,
  `eksctl create cluster`, console flow, `aws eks update-kubeconfig`, access entries, Pod Identity vs. IRSA, VPC CNI,
  add-ons, version support/upgrades (1.36 baseline), Karpenter, observability, pricing (control-plane + extended
  support), troubleshooting; only EKS-specific concerns (generic Kubernetes linked, not repeated). 📊 SVG cluster
  architecture.
- [x] Task 16. Create `cloud/aws/eks-microservices.adoc` ★ — Bookshelf manifests/Helm chart, AWS Load Balancer
  Controller + **Gateway API**, ingress retirement/ingress-nginx note (re-verify dates), HPA/KEDA/Karpenter, Pod
  Identity for workloads, ConfigMaps/Secrets/External Secrets Operator (linked to the runtime-configuration and
  secrets pages, not repeated), probes/PDBs, CI/CD, ECS vs. EKS decision table; links
  `backend/docker/orchestration-swarm-and-kubernetes.adoc`, `backend/quarkus/kubernetes-and-openshift.adoc`.
  📊 Mermaid request path; 📊 SVG Pod Identity token exchange.

### Group 4 — Content pages: storage and CDN

**Parallelizable: yes.** Four independent pages. Spec: "Page outline (2/2)" → *Storage and CDN*.

- [x] Task 17. Create `cloud/aws/block-and-file-storage.adoc` — EBS (gp3 default, io2 Block Express, st1/sc1,
  snapshots/restore a file, KMS encryption + account default encryption), instance store, EFS (Elastic throughput),
  FSx briefly, Storage Gateway/Snow family/DataSync/Transfer Family one paragraph each; links
  `backend/springboot/file-storage-and-object-stores.adoc` (EFS CSI). 📊 SVG storage-options comparison. `== Clean up`.
- [x] Task 18. Create `cloud/aws/s3-object-storage.adoc` ★ — buckets/keys/consistency, `aws s3`/`s3api` + CloudShell,
  storage classes (incl. Intelligent-Tiering), lifecycle, versioning, replication, multipart, presigned URLs, S3
  Tables/Vectors briefly if verified, Java SDK/Spring Cloud AWS snippet, pricing drivers. 📊 Mermaid lifecycle;
  `== Clean up` (versioned-bucket emptying).
- [x] Task 19. Create `cloud/aws/s3-security-and-static-hosting.adoc` ★ — Block Public Access, bucket policy full JSON,
  ACLs disabled (BucketOwnerEnforced), SSE-S3/SSE-KMS/DSSE, Object Lock, access points, CORS, event notifications,
  Bookshelf private bucket + static site via CloudFront OAC (links CloudFront page), S3 website-endpoint limitations,
  troubleshooting 403s. 📊 Mermaid presigned-URL/OAC flow.
- [x] Task 20. Create `cloud/aws/cloudfront-cdn.adoc` ★ — distributions/origins/behaviors, **OAC (OAI is outdated)**,
  cache policies, origin request policies, response headers policies, functions vs. Lambda@Edge, ACM cert in
  `us-east-1`, custom domains + Route 53, invalidation, WAF, flat-rate plans (re-verify), pricing, `create-distribution`
  JSON + CloudFormation/CDK alternative, troubleshooting. 📊 SVG edge caching; 📊 Mermaid object model.

### Group 5 — Content pages: managed databases

**Parallelizable: yes.** Seven independent pages. Spec: "Page outline (2/2)" → *Managed databases*. Engine pages cover
only how to run each engine on AWS and link the engine reference on this site.

- [x] Task 21. Create `cloud/aws/managed-databases-overview.adoc` — map **every engine this site documents** (SQL,
  PostgreSQL/pgvector, MySQL, MongoDB, Redis, Elasticsearch, Lucene/Solr, Couchbase, Neo4j, Qdrant, Prometheus, vector
  search) to its AWS option with `xref:` to both the engine reference and the AWS page; common concerns (subnet groups,
  IAM auth, backups/PITR, Multi-AZ, encryption, secrets); links `database/choosing-the-right-database.adoc`. 📊 SVG
  decision map.
- [x] Task 22. Create `cloud/aws/rds.adoc` ★ — engines, instance classes, Multi-AZ (instance vs. cluster), read
  replicas, parameter groups, subnet groups, backups/PITR, IAM database auth, RDS Proxy, Blue/Green deployments,
  upgrades/extended support, maintenance, monitoring (Performance Insights end-of-life note — re-verify),
  `create-db-instance`, pgvector, Spring Boot datasource snippet, pricing, troubleshooting. `== Clean up`.
- [x] Task 23. Create `cloud/aws/aurora.adoc` ★ — Aurora PostgreSQL/MySQL architecture, **Serverless v2** (v1 end of
  life), Aurora DSQL/Global Database/I/O-Optimized, Data API, clones, backtrack, Bookshelf `bookshelf-catalog`, IAM auth,
  pricing, troubleshooting. 📊 SVG storage/compute architecture. `== Clean up`.
- [x] Task 24. Create `cloud/aws/dynamodb.adoc` ★ — tables/keys/GSIs/LSIs, capacity modes, single-table design basics,
  TTL, Streams, PITR/backups, global tables, DAX, transactions, `aws dynamodb` CLI, Enhanced Client Java snippet,
  Bookshelf `Orders`, IAM policy with fine-grained access, pricing, troubleshooting; links
  `database/choosing-the-right-database.adoc`. `== Clean up`.
- [x] Task 25. Create `cloud/aws/documentdb-and-mongodb.adoc` ★ — Amazon DocumentDB (elastic/instance clusters,
  MongoDB compatibility caveats), MongoDB Atlas on AWS (Marketplace/PrivateLink), TLS/auth, `create-db-cluster`, Spring
  Data MongoDB snippet, Bookshelf `orders` variant; links `database/mongodb/*`. `== Clean up`.
- [x] Task 26. Create `cloud/aws/opensearch-and-search.adoc` ★ — Amazon OpenSearch Service (domains vs. Serverless),
  Elastic Cloud on AWS, access policies/fine-grained access control, VPC vs. public, ingestion, snapshots, UltraWarm,
  vector search; links `database/elasticsearch/*`, `lucene`, `solr`, `qdrant`/vector-rag. `== Clean up`.
- [x] Task 27. Create `cloud/aws/caching-graph-and-partner-databases.adoc` ★ — ElastiCache (Valkey vs. Redis OSS,
  serverless, IAM auth) and MemoryDB as a **short summary with console/CLI quick start** linking
  `database/redis/deploying-on-aws.adoc` for depth; Neptune, Couchbase Capella, Neo4j Aura, Qdrant Cloud, Timestream/
  Managed Prometheus pointers; Keyspaces/QLDB retirement notes (re-verify). `== Clean up`.

### Group 6 — Content pages: security and runtime configuration

**Parallelizable: yes.** Two independent pages. Spec: "Page outline (2/2)" → *Security and runtime configuration*.

- [x] Task 28. Create `cloud/aws/secrets-manager-and-kms.adoc` ★ — Secrets Manager (create/rotate/replicate,
  resource policies, recovery window), Parameter Store `SecureString` (standard vs. advanced), AWS KMS (key types, key
  policies, grants, rotation, envelope encryption, multi-Region keys, deletion scheduling), comparison table, consuming
  from ECS/Lambda/EKS (exact syntax), Spring Cloud AWS import (links `backend/springboot/configuration-and-profiles.adoc`),
  IAM JSON policies, pricing, troubleshooting. 📊 Mermaid envelope encryption. `== Clean up`.
- [x] Task 29. Create `cloud/aws/runtime-configuration.adoc` ★ — **AppConfig** (profiles, deployment strategies,
  feature flags, Agent port 2772, Lambda extension), Parameter Store hierarchies, env vars, **ConfigMaps on EKS**,
  Spring Cloud AWS 4 AppConfig example complementing (not repeating) the existing config page, refresh strategies,
  precedence table. 📊 SVG config fan-out. `== Clean up`.

### Group 7 — Content pages: networking, gateways and VPN

**Parallelizable: yes.** Five independent pages. Spec: "Page outline (2/2)" → *Networking, gateways and VPN*.

- [x] Task 30. Create `cloud/aws/vpc-networking.adoc` — VPC/CIDR/subnets, IGW, NAT gateway (hourly cost prose),
  route tables, SG vs. NACL, VPC endpoints (gateway/interface), PrivateLink, peering/Transit Gateway, IPv6, public
  IPv4 charges, Flow Logs; Bookshelf VPC CloudFormation. 📊 SVG three-tier VPC. `== Clean up`.
- [x] Task 31. Create `cloud/aws/route-53-and-certificates.adoc` — hosted zones, record types, routing policies,
  health checks, private zones, ACM (DNS validation, `us-east-1` for CloudFront), resolver, domain registration.
- [x] Task 32. Create `cloud/aws/load-balancers-and-gateways.adoc` ★ — ALB/NLB/GWLB, listeners/rules/target groups,
  health checks, TLS termination, sticky sessions, WAF integration, NAT gateways, VPC Lattice, Global Accelerator,
  **Gateway API on EKS**, load-balancer decision tree, pricing, troubleshooting; links
  `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`. 📊 Mermaid decision tree. `== Clean up`.
- [x] Task 33. Create `cloud/aws/api-gateway.adoc` ★ — HTTP vs. REST vs. WebSocket APIs, routes/integrations (Lambda,
  ALB/VPC link), authorizers (JWT, Lambda, IAM, Cognito — links OIDC pages), throttling/usage plans, stages/custom
  domains, CORS, OpenAPI import, Bookshelf `bookshelf-api`, pricing, troubleshooting. 📊 Mermaid request flow.
  `== Clean up`.
- [x] Task 34. Create `cloud/aws/vpn-and-hybrid-connectivity.adoc` ★ — **Client VPN** (endpoint, auth: mutual TLS /
  SAML / Active Directory, authorization rules, split tunnel, CLI + console), **Site-to-Site VPN** (VGW vs. TGW,
  customer gateway, tunnels/BGP), Direct Connect, **Verified Access** as the VPN-less alternative, hybrid DNS; Bookshelf
  admin access. 📊 SVG S2S/Client VPN topology. `== Clean up`.

### Group 8 — Content pages: email and integration

**Parallelizable: yes.** Two independent pages. Spec: "Page outline (2/2)" → *Email and integration*.

- [x] Task 35. Create `cloud/aws/ses-email.adoc` ★ — identities, DKIM/SPF/DMARC, leaving the sandbox, configuration
  sets, SES v2 API vs. SMTP, Spring `JavaMailSender` and Quarkus Mailer pointed at the SES SMTP endpoint (links
  `backend/quarkus/scheduling-and-mail.adoc`, `backend/springboot/configuration-and-profiles.adoc`), bounces/complaints
  via SNS/EventBridge, suppression list, quotas, pricing, troubleshooting, Pinpoint/WorkMail end-of-support notes.
  📊 Mermaid sending/feedback flow. `== Clean up`.
- [x] Task 36. Create `cloud/aws/messaging-and-integration.adoc` — SQS (standard/FIFO, DLQ, visibility timeout), SNS,
  EventBridge (bus/pipes/scheduler), Step Functions, MSK, Amazon MQ, Kinesis; Bookshelf `notifier` queue; links
  `backend/messaging/*`, `backend/quarkus/messaging.adoc`. 📊 Mermaid fan-out.

### Group 9 — Content pages: operations, governance and beyond

**Parallelizable: yes.** Six independent pages. Spec: "Page outline (2/2)" → *Operations, governance and beyond*.

- [x] Task 37. Create `cloud/aws/monitoring-and-observability.adoc` — CloudWatch metrics/logs/alarms/Logs Insights,
  Application Signals/OpenTelemetry (X-Ray SDK end of support), CloudTrail, Managed Prometheus/Grafana (links
  `database/prometheus/*`, `backend/springboot/{logging,metrics-and-observability}.adoc`).
- [x] Task 38. Create `cloud/aws/governance-security-and-compliance.adoc` — Config, Security Hub, GuardDuty, Inspector,
  Macie, Audit Manager, Artifact, shared responsibility, compliance programs, defence in depth.
- [x] Task 39. Create `cloud/aws/cost-management-and-support.adoc` — pricing models, Cost Explorer, Budgets
  (`aws budgets`), Cost Anomaly Detection, hidden cost drivers table, Savings Plans/RIs, support plans (current
  post-change plans, re-verify), TCO/Pricing Calculator.
- [x] Task 40. Create `cloud/aws/architecture-migration-and-hybrid.adoc` — Well-Architected tool, 7 Rs, Migration
  Hub/MGN/DMS/Application Migration, Outposts/Local Zones/Snow, disaster recovery strategies, backup (AWS Backup).
- [x] Task 41. Create `cloud/aws/ai-data-and-analytics-overview.adoc` — one paragraph + CLI/console pointer for each
  service the books explore (Bedrock, SageMaker AI, Athena, Glue, Redshift, EMR, Kinesis/Firehose, QuickSight, Rekognition,
  Comprehend, …) so every book concept has a home.
- [x] Task 42. Create `cloud/aws/developer-tools-and-devops.adoc` — CodeBuild/CodePipeline/CodeDeploy (CodeCommit
  status — re-verify), GitHub Actions `aws-actions/configure-aws-credentials` with OIDC, CloudShell/Cloud9 status,
  CDK/SAM CI, AWS Toolkit, Amplify briefly.

### Group 10 — Section index, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task creates or edits a **distinct** file and only references pages that exist after
Groups 1–9.

- [x] Task 43. Create `cloud/aws/index.adoc` ("AWS (Amazon Web Services)") + `images/aws-bookshelf-architecture.svg`
  - [x] Task 43.1. Header + disclaimer; what the section is/who it's for; re-verified tool/version baseline in prose;
    the *Bookshelf* scenario with the final-architecture SVG; reading path (foundations → compute → storage/CDN →
    databases → security/config → networking/gateways/VPN → email/integration → operations); `== What's covered`
    grouped as Groups 2–9 (7/9/4/7/2/5/2/6) plus cheat sheet, with a 📊 Mermaid mind-map; related-material-elsewhere
    table (existing-pages table above).
  - [x] Task 43.2. **`== Coming from Azure`** mapping table with working `xref:` to both sections (Container Apps →
    ECS on Fargate / Express Mode, AKS → EKS, Blob → S3, Front Door → CloudFront, Key Vault → Secrets Manager + KMS,
    App Configuration → AppConfig, APIM → API Gateway, ACS Email → SES, …).
  - [x] Task 43.3. **`== Bibliography`** with anchor `[[_bibliography]]` (matches the disclaimer): the three books linked
    to publisher pages (Manning, 2 × O'Reilly), official docs grouped by section group (guides, CLI v2 User Guide +
    Command Reference + changelog, CloudFormation/CDK/SAM, Decision Guides, Well-Architected, CAF, service-lifecycle
    pages and each cited retirement announcement, pricing, Free Tier), partner/third-party docs; closing sentence that
    official docs win on discrepancy. Take URLs from the "Key references" comment and verify each. Mind line-leading
    digits (bare years).
- [x] Task 44. Create `cloud/aws/cheat-sheet.adoc` and `modules/ROOT/attachments/aws-cheat-sheet.pdf`
  - [x] Task 44.1. `= AWS Cheat Sheet` + disclaimer + intro linking `xref:attachment$aws-cheat-sheet.pdf[downloadable PDF]`
    with a bullet summary and version baseline; grouped `*Group* --` paragraphs of `xref:`s to **all 42** pages (same
    groups as Task 43.1); final line `xref:attachment$aws-cheat-sheet.pdf[Download the AWS Cheat Sheet (PDF)]`. Verify
    every target file exists first.
  - [x] Task 44.2. Author the single-A4 HTML/CSS **in the scratchpad** covering everything in the issue's cheat-sheet
    list (hierarchy + credentials, compute decision table, ECS/Fargate, Lambda, ECR, EKS, S3, CloudFront, databases +
    engine→AWS map, Secrets Manager/Parameter Store/KMS, AppConfig/ConfigMaps, VPC, LB decision tree + API Gateway,
    VPN, SES, monitoring, cost, retirements-and-renames strip with dates re-verified against the lifecycle pages),
    styled consistently with `azure-cheat-sheet.pdf`.
  - [x] Task 44.3. Render with headless Chrome; verify with PyMuPDF `page_count == 1` and A4; inspect a PNG for clipping;
    copy only the PDF into `modules/ROOT/attachments/`; `git status --porcelain` shows no `.html`.
- [x] Task 45. Site wiring (edit only these files, create none)
  - [x] Task 45.1. `modules/ROOT/partials/cloud-disclaimer.adoc` (create): same AI-assistance sentence, pointing to
    **both** bibliographies (`xref:cloud/azure/index.adoc#_bibliography[Azure]`, `xref:cloud/aws/index.adoc#_bibliography[AWS]`).
  - [x] Task 45.2. `modules/ROOT/pages/cloud/index.adoc`: replace `include::partial$azure-disclaimer.adoc[]` with
    `cloud-disclaimer`; add an AWS bullet under `== Sections` (summarised like Azure); update `:description:`/`:keywords:`
    (add `AWS, Amazon Web Services`); keep the "other providers may be added" sentence.
  - [x] Task 45.3. `modules/ROOT/nav.adoc`: insert `*** xref:cloud/aws/index.adoc[AWS (Amazon Web Services)]` right after
    `**** xref:cloud/azure/cheat-sheet.adoc[Cheat Sheet (PDF)]`, then 41 flat `****` content-page entries in outline
    order (labels from each page's `= Title`) and `**** xref:cloud/aws/cheat-sheet.adoc[Cheat Sheet (PDF)]`; verify
    count with `grep -c`.
  - [x] Task 45.3b. `modules/ROOT/pages/index.adoc`: mention AWS in `:description:`; append the issue's AWS keyword list
    to `:keywords:` skipping existing terms; **no new tile**.
  - [x] Task 45.4. `modules/ROOT/pages/cloud/azure/index.adoc`: add a one-line reciprocal link to the AWS section
    ("Coming from AWS" / see AWS) — no other change.
- [x] Task 46. Back-links in existing pages — one sentence/bullet each, never repeat content; each file edited by
  exactly one sub-task. Link the most relevant AWS pages for each page's existing AWS mention.
  - [x] Task 46.1. `database/redis/deploying-on-aws.adoc` → `caching-graph-and-partner-databases.adoc`;
    `backend/springboot/file-storage-and-object-stores.adoc` → `s3-object-storage.adoc`, `block-and-file-storage.adoc`;
    `backend/springboot/configuration-and-profiles.adoc` → `secrets-manager-and-kms.adoc`, `runtime-configuration.adoc`
    (+ `ses-email.adoc` near the `MailSender` example).
  - [x] Task 46.2. `backend/quarkus/serverless-and-cloud-functions.adoc` → `lambda.adoc`;
    `backend/quarkus/scheduling-and-mail.adoc` → `ses-email.adoc`;
    `backend/quarkus/kubernetes-and-openshift.adoc` → `eks-microservices.adoc`;
    `backend/quarkus/messaging.adoc` and `backend/messaging/protocols.adoc` → `messaging-and-integration.adoc`.
  - [x] Task 46.3. `backend/docker/registries-and-docker-hub.adoc` → `container-registry.adoc`;
    `backend/docker/ci-cd-with-github-actions.adoc` → `container-registry.adoc`/`developer-tools-and-devops.adoc`;
    `backend/docker/orchestration-swarm-and-kubernetes.adoc` → `eks-clusters.adoc`, `eks-microservices.adoc`.
  - [x] Task 46.4. `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc` →
    `load-balancers-and-gateways.adoc`, `api-gateway.adoc`;
    `backend/oauth/social-login-and-federation.adoc` → `identity-and-access.adoc`;
    `database/vector-rag/comparing-vector-databases.adoc` → `managed-databases-overview.adoc`;
    `database/vector-rag/postgresql-pgvector.adoc` → `rds.adoc`/`aurora.adoc`.
  - [x] Task 46.5. `web/react/build-and-deployment.adoc` → `s3-security-and-static-hosting.adoc`, `cloudfront-cdn.adoc`;
    `web/aspnet/core/deployment.adoc` → `ecs-and-fargate.adoc`/`choosing-a-compute-service.adoc`;
    `web/aspnet/core/security-hardening.adoc` → `secrets-manager-and-kms.adoc`;
    `web/vaadin/production-and-deployment.adoc`, `web/vue/performance-and-deployment.adoc` → the matching AWS
    compute/CDN pages; `database/choosing-the-right-database.adoc` → `dynamodb.adoc`.

### Group 11 — Build and verify

**Parallelizable: yes** (single task; depends on every prior group).

- [x] Task 47. Verify the whole section builds cleanly (run builds via a sub-agent so output doesn't flood the
  main context).
  - [x] Task 47.1. `npx antora antora-playbook.yml` — zero errors/warnings; fix every `xref`/attribute-reference/AsciiDoc
    issue found; confirm the new pages render in `build/site/irurueta/cloud/aws/`.
  - [x] Task 47.2. `npm run validate:mermaid` (install `mermaid@11 jsdom` with `--no-save` if needed) — all diagrams pass.
  - [x] Task 47.3. Grep `cloud/aws/` for line-leading `<digits>.`, unescaped `{`/`}` outside source blocks, any
    admonition other than the disclaimer (`grep -nE '^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):|^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]'`),
    real-looking account IDs/keys, `AKIA`, and mentions of book titles outside `index.adoc`.
  - [x] Task 47.4. `git status --porcelain` — only intended files; no stray `.html`, no copies of
    `~/Desktop/aws{1,2,3}.pdf`; every one of the 42 pages is linked from `nav.adoc`, `cloud/aws/index.adoc` and
    `cheat-sheet.adoc`.
  - [x] Task 47.5. Live spot-check against the official AWS docs: the retirements/renames strip in the PDF and the
    dates on the pages (service-lifecycle pages), the CLI/CDK/SAM/eksctl/EKS versions, and a sample of CLI commands
    on ★ pages (flags exist in the current Command Reference). Fix inaccuracies found (re-render the PDF if it changes).
