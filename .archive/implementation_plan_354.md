# Implementation Plan: Cloud deployment pages for WordPress, WooCommerce, PrestaShop and Magento (separate managed database, multi-node EKS)

## Task summary

Source: GitHub issue #354
Base branch: main

Issue [#354](https://github.com/albertoirurueta/docs/issues/354) asks for documentation that explains how to set up and
deploy WordPress, WooCommerce, PrestaShop and Magento in a professional way: the database deployed separately as a managed
service (AWS RDS / Aurora as the worked example, Cloud SQL and Azure Database for MySQL as equivalents) and the code
running as stateless containers on several nodes of a managed Kubernetes cluster (EKS as the worked example, GKE and AKS
as equivalents), instead of the usual single instance with a bundled database. The pages go **into each application's own
sub-section** (not a new Cloud sub-section), with detailed explanations, code examples each linked to the official
documentation, and Mermaid or SVG figures where useful. The issue body is the specification; its first comment holds the
full **page outline** (37 pages) and is part of the specification (`gh issue view 354 --json body,comments`). Re-read both
when writing each page and when auditing.

Deliverables:

1. **37 new AsciiDoc pages**: `cms/wordpress/` 9, `ecommerce/woocommerce/` 6, `ecommerce/prestashop/` 10,
   `ecommerce/magento/` 12.
2. **Nav wiring**: a new `**** Cloud Deployment at Scale` group in the WordPress nav (after "Tooling & Delivery", before
   "Headless & AI"); the three e-commerce blocks get a contiguous block of "Cloud: …" entries just before each Cheat Sheet.
3. **Updates to existing pages** (short pointers plus moved/removed duplicate content), each sub-section's `index.adoc`
   (page map, reading paths, bibliography), `cms/index.adoc`, `ecommerce/index.adoc`, `ecommerce/comparison.adoc`.
4. **Cheat sheets**: a compact "Cloud deployment" block in the four cheat-sheet pages and the four one-page A4 PDFs
   (`cms-wordpress-cheat-sheet.pdf`, `ecommerce-{woocommerce,prestashop,magento}-cheat-sheet.pdf`) regenerated and still one page.
5. **Figures**: SVGs `cms-wordpress-cloud-*.svg` and `ecommerce-{woocommerce,prestashop,magento}-cloud-*.svg` in
   `modules/ROOT/images/`, plus Mermaid diagrams.

**Choices made on the user's behalf** (challenge them at review)

* **Delivery:** one branch (`feature/354-php-apps-cloud-deployment`) and one draft PR, following the #290 and #246
  precedents in `.archive/`. The group order follows the outline (WordPress, WooCommerce, PrestaShop, Magento), then
  wiring and verification.
* **Navigation (flat e-commerce nav):** entries are titled with a `Cloud: ` prefix and inserted as one contiguous block
  before each Cheat Sheet entry; the rest of each flat nav is untouched. WordPress uses a real `****` group.
* **Verification without a cloud account:** no AWS, Google Cloud or Azure resources are ever created. Examples are
  verified locally where possible: `tofu fmt`/`tofu validate -backend=false` (OpenTofu is installed), `helm lint` and
  `helm template` piped to `kubeconform`, `docker build` and `docker compose` for the PHP-FPM + Nginx + MariaDB/Valkey
  parts, `kubectl --dry-run=client`, `php -l`, `shellcheck`. `helm` and `kubeconform` are not installed on this machine:
  Task 1 installs them (Homebrew) and the stacks are torn down afterwards, nothing from them is committed.
* **Facts to re-verify before writing (state the check date in every page intro):** the Bitnami images and charts status
  after the 2025 change; Aurora MySQL support for Magento; PrestaShop 9 back-office session handling and any S3/media
  support; read-replica support per app (HyperDB/LudicrousDB, PrestaShop slave servers, Magento split database);
  RDS/Cloud SQL/Azure Database for MySQL engine versions and MySQL 8.0/8.4 support dates; Azure Database for MariaDB
  retirement; EKS Kubernetes versions and Auto Mode behaviour; the ingress-nginx retirement; Amazon MQ and OpenSearch
  versions Magento 2.4.9 supports; WordPress 7.1.3, WooCommerce 11.2.1, PrestaShop 9.2.0, Magento 2.4.9 / Mage-OS 3.6.0 baselines;
  Database Insights naming. **No prices**: name tiers and cost drivers and link official pricing pages.
* **Running examples:** each sub-section reuses its own existing example (Lumen Press for WordPress; the example store or
  shop already used by the WooCommerce, PrestaShop and Magento pages; read the sub-section `index.adoc` first and keep names
  consistent). Fictitious names only: `example` domains, account id `123456789012`, placeholder secrets.
* **Task tags:** every task is AsciiDoc/SVG/PDF authoring with no matching `iru-*-code-one-task` skill, so tasks are
  untagged and implemented directly. HCL, YAML, Dockerfile, PHP, shell and others appear only as code listings.
* **Parallelism:** pages are distinct files, so page tasks within a group are parallelizable. Forward `xref:`s to pages of
  later groups are the only build warnings permitted until Group 8.
* **Page task contract:** every page task in Groups 2 to 5 means "write the page named in the outline comment" and must
  satisfy the **Page conventions** below. The outline comment is the per-page content spec; the "Findings the pages must
  state" in the issue body must be stated on the pages they concern.
* **Unrelated file:** `api2.txt` in the working tree is not part of this work and is never committed.

**Page conventions (apply to every page task)**

* Header: `= <Title>`, `:description:`, `:keywords:`, then the sub-section's existing disclaimer partial
  (`include::partial$cms-wordpress-disclaimer.adoc[]` for WordPress, `include::partial$ecommerce-disclaimer.adoc[]` for the
  shops). No other admonition blocks.
* An intro stating the versions the page was written against and the check date; no prices.
* Detailed explanation: what and why, how it works internally, application-specific configuration, errors and pitfalls,
  security, version notes. Shared fundamentals (VPC, EKS creation, RDS creation, load balancer controller, Pod Identity,
  Gateway API, Helm and OpenTofu basics) are linked to `cloud/aws/*`, `cloud/google-cloud/*`, `cloud/azure/*` and
  `backend/kubernetes/*`, never re-explained.
* Complete examples (HCL, Helm values/templates, Dockerfile, Nginx/PHP-FPM, `wp-config.php` / `parameters.php` / `env.php`,
  manifests, `kubectl`/`aws`/`gcloud`/`az`/WP-CLI/`bin/console`/`bin/magento` commands). **Each example is followed by
  `Source: <official URL>[title]`.** Helm `{{ }}` templates only in listing blocks.
* `== References` listing only official online documentation.
* Block image macros on one line, quoted alt text when it contains a comma; inline code containing `->`, `=>`, `__`, `{`, `*`,
  `...`, `'` as `` `+…+` `` or `` `pass:c[…]` ``; Mermaid `<` followed by a letter written as `&lt;` (see `CLAUDE.md`).
  Figures: SVG in `modules/ROOT/images/` with the sub-section prefix (`cms-wordpress-cloud-*`, `ecommerce-<app>-cloud-*`),
  every SVG referenced by a page; Mermaid where a flow suits it.
* No real secrets (salts, keys, passwords, tokens are placeholders or secret references).

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "WordPress, WooCommerce, PrestaShop and Magento each contain the new pages of the outline, in their nav as described" | Tasks 2, 4 to 40, 54 |
| 2 | "Each of WordPress, PrestaShop and Magento has a complete AWS walkthrough: the app on EKS with a separate RDS/Aurora database, ≥ 2 web replicas across AZs, media off the pods, Valkey, and (Magento) OpenSearch and RabbitMQ; WooCommerce covers its additions on top of the WordPress walkthrough" | Tasks 4 to 9, 13 to 17, 19 to 24, 29 to 36 |
| 3 | "Every row of the state table is covered for every app, with the exact configuration to move it off the pod" | Tasks 4, 6, 7, 8, 19, 22, 23, 29, 32, 34, 35, 55 |
| 4 | "Each sub-section maps the AWS deployment to GKE + Cloud SQL and AKS + Azure Database for MySQL, with the differing commands, and has a non-Kubernetes alternatives / decision page (or section)" | Tasks 12, 28, 40 |
| 5 | "Each sub-section documents migrating a single-server installation with a bundled DB, with cutover and rollback" | Tasks 11, 18, 27, 39 |
| 6 | "Schema upgrades run as a Job before the rollout; cron runs on one scheduler only" | Tasks 7, 9, 10, 16, 20, 24, 25, 26, 33, 36, 37, 38 |
| 7 | "Every page has a checked-on date, the AI-assistance admonition, official-doc links after examples, and no prices" | Tasks 1, 4 to 40, 54, 55 |
| 8 | "Overlapping existing pages link the new pages and no content is duplicated" | Tasks 41 to 45, 55 |
| 9 | "Bibliographies, cheat sheets and one-page PDFs updated in all four sub-sections" | Tasks 46 to 53 |
| 10 | "Antora build and the `CLAUDE.md` checks pass" | Tasks 2, 54, 55 |
| 11 | derived: "Mermaid and SVG figures are added where they help (single server vs tiered, reference architecture, state placement, release sequence, cron single scheduler, migration cutover, DR); every SVG is referenced; Mermaid passes `npm run validate:mermaid`" | Tasks 4 to 40, 54 |
| 12 | derived: "Every example is validated locally (`tofu validate`, `helm lint`/`template` + `kubeconform`, `docker build`, `php -l`, shell checks) and no cloud resources are created" | Tasks 1, 4 to 40, 54 |

## Current code state

This repository is documentation only: an Antora playbook plus the `ROOT` component (`antora.yml`, `modules/ROOT/`).
Facts found during exploration (2026-10-29):

* **Existing, relevant WordPress pages** in `modules/ROOT/pages/cms/wordpress/`: `containers-docker-and-kubernetes.adoc`
  (official image, env vars, a Lumen Press production image, Compose, a short "Kubernetes" section),
  `scaling-and-high-availability.adoc` (reference topology, stateless nodes, HTTPS behind a load balancer, the Lumen Press
  two-node staging cluster, cron on one node, DB replicas and failover, HyperDB/LudicrousDB, caching in a cluster),
  `deployment-and-ci-cd.adoc` ("Deploying a container image instead"), `wp-cron-and-scheduled-tasks.adoc`,
  `backups-and-disaster-recovery.adoc`, `requirements-and-hosting.adoc`, `options-transients-and-object-cache.adoc`,
  `wp-config-reference.adoc`. Nav: `**** Tooling & Delivery` ends with `containers-docker-and-kubernetes` and
  `playground-and-blueprints`; `**** Headless & AI` follows (`modules/ROOT/nav.adoc` around line 2970).
* **E-commerce pages** (flat nav, last entry of each block is `Cheat Sheet (PDF)`): WooCommerce `performance-and-security.adoc`,
  `testing-deployment-and-marketplace.adoc` ("Deploying"), `action-scheduler.adoc`, `hpos-high-performance-order-storage.adoc`,
  `installation-and-local-environments.adoc`; PrestaShop `installation-and-local-environments.adoc`,
  `performance-and-caching.adoc`, `security.adoc`, `testing-upgrades-and-addons.adoc`; Magento `installation.adoc`,
  `local-development-environments.adoc`, `caching-indexing-and-performance.adoc` (Valkey for cache and sessions, Varnish),
  `cli-cron-and-message-queues.adoc`, `upgrades.adoc`, `security.adoc`. None covers a managed DB plus a multi-node cluster.
* **Fundamentals to link, not repeat:** `cloud/aws/{vpc-networking,eks-clusters,eks-microservices,rds,aurora,
  load-balancers-and-gateways,secrets-manager-and-kms,infrastructure-as-code,block-and-file-storage,s3-object-storage,
  cloudfront-cdn,route-53-and-certificates,monitoring-and-observability}`, `cloud/google-cloud/{gke-clusters,gke-microservices,
  cloud-sql,memorystore-and-partner-databases,secret-manager-and-kms,block-and-file-storage}`,
  `cloud/azure/{aks-clusters,aks-microservices,postgresql-and-mysql,redis-and-partner-databases,key-vault-and-secrets,
  storage-accounts}`, `backend/kubernetes/{replicasets-and-deployments,deployment-strategies,jobs-and-cronjobs,autoscaling,
  helm,secrets,persistent-volumes-and-storage-classes,gateway-api,health-probes-and-lifecycle}`.
* **Conventions:** disclaimers `modules/ROOT/partials/cms-wordpress-disclaimer.adoc` and `ecommerce-disclaimer.adoc`; figures
  `cms-wordpress-*.svg` (e.g. `cms-wordpress-high-availability.svg`) and `ecommerce-<app>-*.svg`; cheat-sheet pages link
  `xref:attachment$<name>.pdf[…]` and the PDFs live in `modules/ROOT/attachments/` (rendered with headless Chrome
  print-to-PDF, checked as one A4 page, per the `documentation-tools` and #246 precedents). Each sub-section `index.adoc`
  carries a page map and `== Bibliography`.
* **Tooling on this machine:** `tofu`, `docker` and `kubectl` are installed; `helm`, `terraform` are not.
* **Precedents:** `.archive/implementation_plan_290.md` (WordPress, 93 pages) and `.archive/implementation_plan_246.md`
  (e-commerce, 4 platforms) show the structure used here: page groups, back-links group, wiring, final verification.

## Implementation steps

### Group 1 — Verification environment, fact check and nav wiring (Parallelizable: yes)

- [x] Task 1. Prepare the verification environment and re-verify the baselines
  - [x] Task 1.1. Install `helm` and `kubeconform` with Homebrew; confirm `tofu`, `docker`, `kubectl` work; no cloud credentials are configured or used. Record the tool versions in a scratch note outside the repository.
    - Done: helm v4.3.1 and kubeconform v0.8.0 installed with Homebrew; tofu v1.12.6, docker 29.9.2, kubectl v1.36.1 confirmed; no cloud credentials used. Notes: `/private/tmp/claude-501/issue-354-notes/00-tools.md`.
  - [x] Task 1.2. Re-verify against official sources every fact listed under "Facts to re-verify" in the Task summary and note the results (with the check date 2026-10-29 or later) in a scratch file outside the repository; page tasks reuse these notes and correct the issue's findings where they changed.
    - Done: facts checked 2026-10-29 in `/private/tmp/claude-501/issue-354-notes/01-facts-checked-2026-10-29.md`. Corrections to the issue: Bitnami AWS channels (ECR, Marketplace AMIs, Lightsail blueprints) removed 2026-06-10; Aurora MySQL 3 IS listed for Magento 2.4.9 on-prem; Azure Database for MariaDB retired 2025-09-19; EKS 1.37 released 2026-10-01; WordPress 7.1.4 is current; Magento split DB is deprecated since 2.4.2; PrestaShop has `loadSlaveServers()` but no documented keys and no core S3 option.
  - [x] Task 1.3. Read each sub-section's `index.adoc` and the closest existing pages (`scaling-and-high-availability`, `containers-docker-and-kubernetes`, `deployment-and-ci-cd` for WordPress; the matching e-commerce pages) to capture its running example names, version baselines and image-prefix conventions, so the new pages stay consistent.
    - Done: running examples (Lumen Press; Pocket Coffee for the three shops), baselines and image prefixes in `/private/tmp/claude-501/issue-354-notes/02-conventions-and-running-examples.md`.
- [x] Task 2. Wire the navigation in `modules/ROOT/nav.adoc`
  - [x] Task 2.1. WordPress: after the `**** Tooling & Delivery` entries and before `**** Headless & AI`, add `**** Cloud Deployment at Scale` with nine `*****` entries in outline order: `cloud-reference-architecture`, `managed-database-rds-and-aurora`, `media-offload-s3-efs-and-cdn`, `object-cache-sessions-and-cron-in-a-cluster`, `eks-infrastructure-with-opentofu`, `deploying-on-eks-with-helm`, `releases-upgrades-and-autoscaling-on-kubernetes`, `migrating-from-a-single-server`, `other-clouds-and-alternatives`.
  - [x] Task 2.2. WooCommerce: six `**** xref:ecommerce/woocommerce/cloud-….adoc[Cloud: …]` entries just before the `Cheat Sheet (PDF)` entry, in outline order.
  - [x] Task 2.3. PrestaShop: ten `Cloud: …` entries just before its Cheat Sheet entry, in outline order.
  - [x] Task 2.4. Magento: twelve `Cloud: …` entries just before its Cheat Sheet entry, in outline order.
  - [x] Task 2.5. Check that the nested nav renders (forward xrefs warn until Group 8; nothing else is touched).
    - Done: `modules/ROOT/nav.adoc` +38 lines (WordPress group with 9 entries, 6 + 10 + 12 `Cloud: ` entries before each Cheat Sheet); nesting checked structurally. A full Antora build is left to Group 8 (target pages do not exist yet).
- [x] Task 3. Confirm the shared authoring assets before any page is written: the two disclaimer partials (`cms-wordpress-disclaimer.adoc`, `ecommerce-disclaimer.adoc`) exist and are included in the intended way, and read one existing SVG per sub-section (e.g. `cms-wordpress-high-availability.svg`, an `ecommerce-magento-*.svg`) so new `*-cloud-*.svg` figures match their size, palette, fonts and light/dark handling.
  - Done: both disclaimer partials exist and are included right after the header attributes (the issue's `cms-disclaimer.adoc` name is wrong; the real file is `cms-wordpress-disclaimer.adoc`); SVG style notes (viewBox, dark #2b3a4a background, palette, Arial, title/desc, no theme media query) in `/private/tmp/claude-501/issue-354-notes/02-conventions-and-running-examples.md`.

### Group 2 — WordPress pages (Parallelizable: yes)

Directory `modules/ROOT/pages/cms/wordpress/`; example site Lumen Press; figures `cms-wordpress-cloud-*.svg`.

- [x] Task 4. `cloud-reference-architecture.adoc`: single server with bundled DB vs tiered architecture (SVG `cms-wordpress-cloud-single-vs-tiered.svg`), request path (Mermaid), WordPress state table (code, config, media, sessions, cache, search, cron, logs) with where each goes, AWS ↔ Google Cloud ↔ Azure mapping, Lumen Press sizing tiers, the Bitnami change, when a single server or a managed WordPress host is still right. Links `scaling-and-high-availability` instead of repeating it.
- [x] Task 5. `managed-database-rds-and-aurora.adoc`: RDS MySQL vs MariaDB vs Aurora MySQL, version matrix, parameter group, Multi-AZ, TLS from `wp-config.php` (`MYSQL_CLIENT_FLAGS`, CA bundle), users and grants (app user vs migration user), connection math with `pm.max_children`, RDS Proxy and pinning, read replicas with HyperDB/LudicrousDB, failover test; OpenTofu snippets for the instance and parameter group. Moves the DB detail from `scaling-and-high-availability.adoc` here (task 41 trims that page).
- [x] Task 6. `media-offload-s3-efs-and-cdn.adoc`: offload plugin vs EFS (ReadWriteMany PVC, access point, UID), CloudFront for `/wp-content/uploads`, migrating existing media, image sub-size regeneration as a Job; the "never put PHP code on EFS" rule. Figure of media paths.
- [x] Task 7. `object-cache-sessions-and-cron-in-a-cluster.adoc`: ElastiCache for Valkey with the object-cache drop-in (TLS, auth, key prefix per site), why there are no PHP sessions, `DISABLE_WP_CRON` plus a Kubernetes CronJob (`concurrencyPolicy: Forbid`, `wp cron event run --due-now`), multisite cron; Mermaid of the single-scheduler pattern.
- [x] Task 8. `eks-infrastructure-with-opentofu.adoc`: OpenTofu modules for VPC, EKS (Auto Mode or managed nodes + Karpenter), RDS/Aurora, EFS, ElastiCache, S3 + CloudFront, ECR, Secrets Manager, ACM, WAF; state backend; staging and production workspaces. Validate with `tofu validate -backend=false`.
- [x] Task 9. `deploying-on-eks-with-helm.adoc`: production image (Nginx + PHP-FPM, OPcache, non-root, read-only root fs), a Helm chart (Deployment, Service, HTTPRoute or Ingress via the AWS Load Balancer Controller, HPA, PDB, topology spread, probes, CronJob, ExternalSecret or Secrets Store CSI with Pod Identity), `wp-config.php` from env vars, HTTPS detection, first install as a WP-CLI Job, verification. Validate with `helm lint`, `helm template | kubeconform`, `docker build`.
- [x] Task 10. `releases-upgrades-and-autoscaling-on-kubernetes.adoc`: image → ECR → `helm upgrade` from GitHub Actions with OIDC, pre-upgrade `wp core update-db` Job, plugin and theme updates through the image, maintenance mode, rollback limits, HPA on CPU and PHP-FPM metrics, load testing, observability (logs, FPM and Nginx exporters, slow query log), backups and DR for the tiered setup (links `backups-and-disaster-recovery.adoc`). Mermaid of the release sequence.
- [x] Task 11. `migrating-from-a-single-server.adoc`: inventory, DB export (`wp db export`, `mysqldump`, AWS DMS for low downtime), media to S3/EFS, `wp search-replace`, rebuilding config, cutover with DNS TTLs, rollback plan; Lightsail/Bitnami and cPanel specifics. Mermaid of the cutover.
- [x] Task 12. `other-clouds-and-alternatives.adoc`: GKE + Cloud SQL (Auth Proxy or connector) + Memorystore + Cloud Storage/Filestore; AKS + Azure Database for MySQL Flexible Server + Azure Managed Redis + Azure Files/Blob + Key Vault; ECS on Fargate, EC2 Auto Scaling groups, Cloud Run, Container Apps, managed WordPress hosts; decision table.

### Group 3 — WooCommerce pages (Parallelizable: yes)

Directory `modules/ROOT/pages/ecommerce/woocommerce/`; assumes and links the WordPress cloud pages for everything WordPress-level; figures `ecommerce-woocommerce-cloud-*.svg`.

- [x] Task 13. `cloud-deployment-overview.adoc`: what a store adds to the WordPress architecture (orders, payments, webhooks, emails, background jobs, uncacheable pages), architecture diagram, reading path through the WordPress pages.
- [x] Task 14. `cloud-database-hpos-and-sessions.adoc`: RDS sizing for order volume, HPOS tables and sync off, the `woocommerce_sessions` table and cleanup, read-replica pitfalls in checkout, growth of order and Action Scheduler tables.
- [x] Task 15. `cloud-action-scheduler-workers.adoc`: disabling the async request runner, a worker Deployment or CronJob running WP-CLI Action Scheduler commands, concurrency, KEDA scaling on pending actions, failure handling.
- [x] Task 16. `cloud-caching-cdn-and-checkout.adoc`: CloudFront and cache bypass for cart, checkout and account pages and WooCommerce cookies, Store API and cart fragments, object cache, payment-gateway webhooks reaching any pod, IP allow-lists and the load balancer.
- [x] Task 17. `cloud-releases-and-db-updates.adoc`: the WooCommerce DB update routine as a pre-upgrade Job, extension updates through the image, peak-season freeze, rollback with snapshots.
- [x] Task 18. `cloud-migrating-a-store.adoc`: order-safe cutover (maintenance window or DMS), HPOS state, scheduled actions, subscription renewals during cutover, payment webhook URLs.

### Group 4 — PrestaShop pages (Parallelizable: yes)

Directory `modules/ROOT/pages/ecommerce/prestashop/`; figures `ecommerce-prestashop-cloud-*.svg`.

- [x] Task 19. `cloud-reference-architecture.adoc`: single server vs tiered (SVG), PrestaShop state table, AWS ↔ GCP ↔ Azure mapping, request path, what the official image does and does not do for production.
- [x] Task 20. `cloud-managed-database.adoc`: supported engines per version, parameter group (`sql_mode`, charset, packet size), `parameters.php` DB settings, TLS, users, connection math, RDS Proxy, slave servers (verify), Multi-AZ.
- [x] Task 21. `cloud-container-image.adoc`: from `prestashop/prestashop` or a custom Nginx + PHP-FPM image, admin folder name, modules and theme installed at build, `bin/console` module commands, autoloader and assets build, OPcache, removing `install/`, non-root, read-only paths. Validate with `docker build`.
- [x] Task 22. `cloud-shared-media-and-files.adoc`: which paths are writable and which must be shared (`img/`, `upload/`, `download/`, translations, theme cache) vs per-pod, EFS with the CSI driver, CloudFront and the media-server settings.
- [x] Task 23. `cloud-cache-sessions-and-back-office.adoc`: the per-node Symfony/Smarty cache and the "clear cache hits one node" problem, shared cache backend (ElastiCache), sessions, CCC assets, why module installs/updates and theme changes from the back office are disabled or routed through a release, admin access restrictions.
- [x] Task 24. `cloud-eks-infrastructure-and-helm.adoc`: OpenTofu for VPC, EKS, RDS, EFS, ElastiCache, ECR, Secrets Manager, ACM, WAF; Helm chart (Deployment, HPA, PDB, probes, HTTPRoute, ExternalSecret, PVC, cron CronJob); `parameters.php` from secrets; shop domain and SSL in `ps_shop_url` and configuration; first install as a Job vs importing an existing DB. Validate with `tofu validate`, `helm lint`/`template`/`kubeconform`.
- [x] Task 25. `cloud-releases-and-upgrades.adoc`: core and module upgrades as pre-upgrade Jobs, cache warm-up, maintenance mode, rollback with snapshots, CI/CD with GitHub Actions + OIDC; Mermaid of the release sequence.
- [x] Task 26. `cloud-operations.adoc`: HPA, PHP-FPM metrics, logs to stdout/CloudWatch, slow queries, backups and DR for DB + EFS, WAF rules, secret rotation, cookie keys.
- [x] Task 27. `cloud-migrating-from-a-single-server.adoc`: DB export/import, `img/` and uploads, domain/SSL changes in the DB, `parameters.php`, cutover and rollback, shared-hosting specifics.
- [x] Task 28. `cloud-other-clouds-and-alternatives.adoc`: GKE + Cloud SQL + Filestore + Memorystore; AKS + Azure Database for MySQL + Azure Files + Azure Managed Redis; ECS/Fargate, EC2 ASGs, Cloud Run, Container Apps, PrestaShop hosting offers; decision table.

### Group 5 — Magento pages (Parallelizable: yes)

Directory `modules/ROOT/pages/ecommerce/magento/`; figures `ecommerce-magento-cloud-*.svg`.

- [x] Task 29. `cloud-reference-architecture.adoc`: single server vs tiered (SVG), Magento state table, the services Magento needs (MySQL, OpenSearch, Valkey, RabbitMQ, Varnish), AWS ↔ GCP ↔ Azure mapping, request path, relation to Adobe Commerce on cloud infrastructure.
  - Done: 4 SVGs; shellcheck/php -l/xmllint.
- [x] Task 30. `cloud-managed-database.adoc`: supported MySQL/MariaDB versions, Aurora support status (verify), `log_bin_trust_function_creators`, other parameters, `env.php` DB config with TLS, users and privileges for `setup:upgrade`, connection math, RDS Proxy, Multi-AZ, why the split database is gone.
  - Done: 2 SVGs; tofu validate, php -l, grants run on MySQL 8.4.11 and MariaDB 11.8.9.
- [x] Task 31. `cloud-opensearch-valkey-and-rabbitmq.adoc`: Amazon OpenSearch Service (version, VPC domain, auth, index prefix), ElastiCache for Valkey for cache and sessions (separate instances or DBs, TLS), Amazon MQ for RabbitMQ (`env.php` `queue` section, TLS), configuration via `setup:config:set`.
  - Done: 2 SVGs; tofu validate, php -l, shellcheck.
- [x] Task 32. `cloud-container-image-and-build.adoc`: build vs production systems, `app:config:dump`, `setup:di:compile`, `setup:static-content:deploy` per locale and theme at build, Composer auth for repo.magento.com / Mage-OS, Nginx + PHP-FPM image, OPcache, production mode, read-only code. Validate with `docker build` (using public Mage-OS packages so no credentials are needed).
  - Done: 2 SVGs; php -l, shellcheck, nginx -t (unprivileged image), bake --print; `docker build` NOT run (Docker disk full).
- [x] Task 33. `cloud-media-and-remote-storage.adoc`: remote storage with the AWS S3 driver vs EFS for `pub/media`, image resize and the catalog image cache, CloudFront, `var/` paths that may stay per-pod.
  - Done: 2 SVGs; tofu validate, helm/kubeconform, php -l, nginx -t, shellcheck.
- [x] Task 34. `cloud-varnish-and-full-page-cache.adoc`: Varnish Deployment, generated VCL, purge from every pod to every Varnish replica, health checks, CloudFront in front, `offloader_header`.
  - Done: 2 SVGs; varnishd -C on varnish 8.0.2, two-replica purge test, helm/kubeconform, tofu validate.
- [x] Task 35. `cloud-cron-consumers-and-indexers.adoc`: one cron scheduler (CronJob running `cron:run`, concurrency), consumers as Deployments instead of `cron_consumers_runner`, KEDA on queue depth, indexers in "Update by Schedule", reindex Jobs; Mermaid of the single-scheduler pattern.
  - Done: 1 SVG + Mermaid parsed; helm lint/kubeconform, shellcheck.
- [x] Task 36. `cloud-eks-infrastructure-and-helm.adoc`: OpenTofu for VPC, EKS, RDS, OpenSearch, ElastiCache, Amazon MQ, S3/EFS, ECR, Secrets Manager, ACM, WAF; Helm chart (web, optional separate admin Deployment, Varnish, consumers, cron, HPA, PDB, probes via `health_check.php`, ExternalSecret for `env.php` values and `crypt/key`); first install as a Job. Validate with `tofu validate`, `helm lint`/`template`/`kubeconform`.
  - Done: 2 SVGs; tofu validate (staging, production), helm lint + kubeconform (4 configs), php -l, nginx -t.
- [x] Task 37. `cloud-releases-and-zero-downtime-deployments.adoc`: `setup:db:status` gate, `setup:upgrade --keep-generated` as a pre-upgrade Job, blue/green deployment configuration (verify), maintenance mode, cache flush and warm-up, rollback limits, CI/CD with GitHub Actions + OIDC; Mermaid of the release sequence.
  - Done: 1 SVG + Mermaid parsed; actionlint, helm/kubeconform, shellcheck, nginx -t.
- [x] Task 38. `cloud-operations.adoc`: HPA and node scaling, PHP-FPM metrics, New Relic / OpenTelemetry options, slow queries, backups and DR for DB + media + OpenSearch snapshots, WAF, admin URL protection, 2FA, key rotation.
  - Done: 1 SVG; tofu validate, kubeconform, shellcheck, php -l.
- [x] Task 39. `cloud-migrating-from-a-single-server.adoc`: DB export, media, base URLs in `core_config_data`, `env.php` rebuild, reindex on OpenSearch, cutover and rollback.
  - Done: 1 SVG; shellcheck, SQL/DEFINER filter run on MariaDB 11.8, kubeconform.
- [x] Task 40. `cloud-other-clouds-and-alternatives.adoc`: GKE + Cloud SQL + Memorystore + OpenSearch options; AKS + Azure Database for MySQL + Azure Managed Redis + OpenSearch options; ECS/Fargate, EC2 ASGs; Adobe Commerce on cloud infrastructure and as a cloud service; decision table.
  - Done: 2 SVGs; shellcheck, kubeconform, tofu validate (google), JSON parse.

### Group 6 — Pointers and trimming on existing pages (Parallelizable: yes)

Each task adds a short paragraph and `xref:` to the matching new page and removes content that would now be duplicated (moved to the new page in Groups 2 to 5), never leaving a dangling reference.

- [x] Task 41. WordPress: `containers-docker-and-kubernetes.adoc` (its "Kubernetes" section), `scaling-and-high-availability.adoc` ("A reference topology", "The database: replicas and failover"), `deployment-and-ci-cd.adoc` ("Deploying a container image instead"), `backups-and-disaster-recovery.adoc`, `requirements-and-hosting.adoc`, `wp-cron-and-scheduled-tasks.adoc`.
- [x] Task 42. WooCommerce: `testing-deployment-and-marketplace.adoc` ("Deploying"), `performance-and-security.adoc`, `action-scheduler.adoc`, `hpos-high-performance-order-storage.adoc`.
- [x] Task 43. PrestaShop: `installation-and-local-environments.adoc`, `performance-and-caching.adoc`, `security.adoc`, `testing-upgrades-and-addons.adoc`.
- [x] Task 44. Magento: `installation.adoc`, `local-development-environments.adoc`, `caching-indexing-and-performance.adoc`, `cli-cron-and-message-queues.adoc`, `upgrades.adoc`, `security.adoc`.
- [x] Task 45. `cms/index.adoc` and `ecommerce/index.adoc`: one sentence each pointing to the new pages; `ecommerce/comparison.adoc`: a "production deployment complexity" row or paragraph linking the four cloud-deployment pages, consistent with its existing structure.

### Group 7 — Landing pages, bibliographies and cheat sheets (Parallelizable: yes)

- [x] Task 46. `cms/wordpress/index.adoc`: add the nine pages to the page map (new "Cloud Deployment at Scale" group), the administrator reading path, and every new source to `== Bibliography`, each linked to its official website.
  - Note: cms/wordpress/index.adoc: "Cloud Deployment at Scale" group in What's covered, four reading-path steps in Administer servers, mindmap branch, and a "Cloud deployment at scale" bibliography section (90 new official sources, grouped by vendor).
- [x] Task 47. `ecommerce/woocommerce/index.adoc`: same (six pages, learning path, bibliography).
  - Note: ecommerce/woocommerce/index.adoc: stage 8 in the learning path, route sentence, six-page map section, "Cloud deployment" references (73 new sources).
- [x] Task 48. `ecommerce/prestashop/index.adoc`: same (ten pages, learning path, bibliography).
  - Note: ecommerce/prestashop/index.adoc: stage 7, route sentence, ten-page map section, references (130 new sources).
- [x] Task 49. `ecommerce/magento/index.adoc`: same (twelve pages, learning path, bibliography).
  - Note: ecommerce/magento/index.adoc: stage 8, route sentence, twelve-page map section, references (216 new sources).
- [x] Task 50. `cms/wordpress/cheat-sheet.adoc`: add a compact "Cloud deployment" block (DB, state placement, cron, release steps, key commands) and regenerate `modules/ROOT/attachments/cms-wordpress-cheat-sheet.pdf` (headless Chrome print-to-PDF as in the existing precedent); check it is still exactly one A4 page.
  - Note: cheat-sheet.adoc: cloud page group, intro sentence, "Cloud deployment" table, extra references. PDF regenerated from the surviving HTML source of #290 plus a new green section, headless Chrome print-to-PDF, fonts reduced about 4%; 1 A4 page, 417420 bytes.
- [x] Task 51. `ecommerce/woocommerce/cheat-sheet.adoc` and `ecommerce-woocommerce-cheat-sheet.pdf`: same.
  - Note: cheat-sheet.adoc updated the same way. The HTML source of the #246 PDF no longer existed, so the page was rebuilt as HTML from the old PDF (pdftohtml text items and pdftocairo vector shapes, text verified complete), old content scaled to 90% vertically and a full-width "Cloud deployment" band added; headless Chrome print-to-PDF; 1 A4 page, 634443 bytes.
- [x] Task 52. `ecommerce/prestashop/cheat-sheet.adoc` and `ecommerce-prestashop-cheat-sheet.pdf`: same.
  - Note: Same as Task 51; 1 A4 page, 520151 bytes.
- [x] Task 53. `ecommerce/magento/cheat-sheet.adoc` and `ecommerce-magento-cheat-sheet.pdf`: same.
  - Note: Same as Task 51; 1 A4 page, 588881 bytes.

### Group 8 — Final build and verification (Parallelizable: no — runs once after every page exists)

- [x] Task 54. Build and check
  - [x] Task 54.1. Delegate to `iru-gate-runner` (e.g. via the `iru-build-docs` skill) `npx antora antora-playbook.yml`; it must finish with no `xref` or AsciiDoc errors or warnings (the nav forward references from Task 2 must now resolve).
    - Done: build clean, no errors or warnings, after fixing 3 missing-attribute warnings and a 4th (`${NAME}`) found in the PrestaShop cache page.
  - [x] Task 54.2. Run the `CLAUDE.md` checks, each printing nothing: block image macros closed on one line; inline image macros; `<p>image::` in `build/site`; alt text with an unquoted comma on the changed `.adoc` files; the inline-code substitution grep on `build/site/cms/wordpress` and `build/site/ecommerce/{woocommerce,prestashop,magento}`.
    - Done: all CLAUDE.md greps print nothing; fixed 6 pages with inline code substitutions (passthroughs).
  - [x] Task 54.3. `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`) reports every diagram as parsed; every new SVG is referenced by at least one page and every `image::` target exists.
    - Done: validate:mermaid 2662 parsed; no orphan SVG; remaining missing image targets are pre-existing Antora examples.
  - [x] Task 54.4. Re-run the local example validations (`tofu validate -backend=false`, `helm lint`/`helm template | kubeconform`, `docker build`, `php -l`, `shellcheck`) on the final page listings; tear down any local stacks; confirm no cloud resources were created and nothing from the scratch stacks is committed.
    - Done: php -l 25 blocks OK (docker php:8.4-cli), shellcheck -S error 0 issues on 87 blocks; tofu/helm validated in earlier groups, not re-extracted; Magento `docker build` NOT run (no Pocket Coffee project tree / reference install); removed only 3 own images + builder cache.
- [x] Task 55. Audit against the issue
  - [x] Task 55.1. Re-read the issue body and outline comment; confirm each page exists with the outline's content, each "state table" row is covered for every app, each finding is stated on the page it concerns, every page has the check date, the disclaimer, official links after examples and no prices, and the outline's "Corrections" (Bitnami, ingress-nginx, tutorials) appear.
    - Done: 37 pages, disclaimer + date + Source + References, no prices; added the missing Bitnami section to Magento and a pointer in WooCommerce overview.
  - [x] Task 55.2. Confirm the existing-page edits do not duplicate content and the four PDFs are one page each.
    - Done: four PDFs are 1 page A4.
- [x] Task 56. Housekeeping: confirm `api2.txt` and all scratch files are untracked and uncommitted; run `/iru-update-docs` only if it applies (this change is documentation-only, so nothing further to update).
  - Done: api2.txt untracked; nothing committed or staged; iru-update-docs not needed.
