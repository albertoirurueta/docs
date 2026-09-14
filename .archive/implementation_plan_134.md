# Implementation Plan: File Storage & Object Stores (SpringBoot Reference)

## Task summary

Source: GitHub issue #134
Base branch: main

Add one new page, `modules/ROOT/pages/backend/springboot/file-storage-and-object-stores.adoc`, to the existing
**SpringBoot Reference** section (`modules/ROOT/pages/backend/springboot/`). The page explains why a Spring Boot
app deployed as multiple ephemeral, horizontally-scaled instances (Kubernetes pods on EKS/GKE/AKS) cannot rely on
local/ephemeral container disk for anything that must survive a restart or be seen by more than one replica, then
documents two alternative approaches — network-mounted filesystems (AWS EFS, Google Filestore, Azure Files, each
via its CSI driver) and object storage client libraries (Spring Cloud AWS S3, Spring Cloud GCP Storage, Spring
Cloud Azure Blob Storage) — plus storage access tiers (fast/CDN-backed, normal, archive) across all three clouds,
closing with decision guidance. Per explicit user request during review, the object storage approach also covers
**cloud-agnostic abstractions that avoid vendor lock-in** — Spring's own `Resource`/`WritableResource` abstraction
(a common Java API across all three providers' Spring Cloud starters), Apache jclouds' `BlobStore` API (one
dependency, one API, provider selected at configuration time), and Spring Content's `ContentStore` abstraction
(Spring-Data-style, associates stored content with a JPA/Mongo entity) — with an honest comparison of what each
gains and gives up versus a provider-specific SDK. Then wire the page into `nav.adoc`, the section landing page's
`index.adoc`, and cross-link it both ways with `backend/spring-batch/cloud-native-batch.adoc`'s existing
"Processes are stateless" point.

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **Content-only, untagged plan.** This repo has no application source code — every task is AsciiDoc authoring.
   `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns only `java`, `dotnet`,
   `java-springboot`, and `database` — none covers AsciiDoc — so no task carries a language/framework tag,
   matching every prior documentation plan in `.archive/`.
2. **Closest precedents:** `.archive/implementation_plan_123.md` (issue #123, "Near-Far Caches") and
   `.archive/implementation_plan_120.md` (issue #120, "Distributed ID Generation") — both single-page additions
   to this exact section. This plan follows their conventions directly: page header (`= Title` /
   `:description:`/`:keywords:` / disclaimer include), `==`/`===` sections, a closing `== References` section of
   official-doc links only, nav insertion immediately after a named sibling, an `index.adoc` "What's covered" +
   bibliography update, and a single Group-1 task (all sub-tasks touch the same new file, so they cannot be
   parallelized against each other) followed by a parallelizable wiring group and a build-verification group.
3. **One primary figure — SVG, not mermaid.** Every other page in this section uses `[mermaid]` only for
   behavioral/flow diagrams and reaches for a hand-authored SVG under `modules/ROOT/images/` for spatial/topology
   diagrams (e.g. `spring-batch-partitioning-topology.svg`, `springboot-solrcloud-topology.svg`,
   `springboot-elasticsearch-shards.svg`). This page's core visual — several pod replicas fanning out to either a
   shared network volume or an external object-storage service, contrasted with each pod's own vanishing local
   disk — is exactly that kind of spatial topology, not a control-flow sequence, so it gets a new SVG,
   `modules/ROOT/images/springboot-file-storage-topology.svg`, matching the existing palette/style (Helvetica/
   Arial, `#1c4b73`/`#eef4fa` and `#2f5424`/`#f4f7ee` box colors, title + subtitle text, ~760x480 viewBox).
4. **Page length:** longer than the ~200-300 line budget used for a single-concept page like `near-far-caches.adoc`
   — this page covers two full approaches across three clouds, a vendor-lock-in-avoidance comparison, plus a
   tiers comparison, so it runs longer than `distributed-id-generation.adoc` (361 lines); budget ~600-750 lines.
5. **Kubernetes YAML worked example:** the issue asks for "at least one provider" — AWS EFS is used (a
   `StorageClass` + `PersistentVolumeClaim` with `ReadWriteMany`, and a `Deployment`'s `volumeMounts`/`volumes`
   referencing the claim), since it's listed first in the issue and is the most commonly deployed of the three.
   GCP Filestore and Azure Files are documented in prose (driver name, access mode, provisioning options) without
   a full duplicate YAML listing, per the issue's own "for at least one provider" scope.
6. **Object storage code examples:** one Maven dependency snippet + one short upload/download Java snippet per
   provider (`S3Template`/`S3Client` for AWS, the auto-configured `Storage` bean for GCP, `BlobServiceClient` for
   Azure), each with an inline note to verify the exact current starter artifact id/version against that
   project's own reference docs before publishing — mirroring the existing convention in `near-far-caches.adoc`
   of flagging where an upstream library's API surface moves fast enough that a snippet shouldn't be trusted
   verbatim.
7. **`rest-apis.adoc` is left untouched.** The issue's Background section cites its one-line "multipart uploads"
   mention only as motivating context for why this gap exists, not as a file the acceptance criteria require
   changing — no acceptance-criteria bullet mentions `rest-apis.adoc`, so no edit is made there, to avoid
   unrequested scope creep.
8. **Vendor-lock-in-avoidance options — which three, and how deep.** Per the user's explicit review request, three
   cloud-agnostic alternatives to a provider-specific SDK are covered, each with what was actually verified (via
   web search) about it, not assumed:
   - **Spring's `Resource`/`WritableResource` abstraction** — Spring Cloud AWS's `S3Resource`, Spring Cloud GCP's
     `gs://` resolver, and Spring Cloud Azure's `AzureStorageBlobProtocolResolver` (confirmed via
     https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/resource-handling: the
     `spring-cloud-azure-starter-storage-blob` starter, `azure-blob://container/blob` via `@Value`/
     `ResourceLoader`, `WritableResource.getOutputStream()` for uploads) **all** implement Spring's own
     `org.springframework.core.io.Resource`/`WritableResource` interfaces. This gives application code one common
     Java API (`getInputStream()`/`getOutputStream()`) across all three clouds — but each still needs its own
     starter dependency and its own URI scheme (`s3://`, `gs://`, `azure-blob://`), so switching providers means
     a dependency and configuration change, not a zero-change swap.
   - **Apache jclouds' `BlobStore` API** — a genuinely provider-agnostic single API
     (`BlobStore.putBlob()`/`getBlob()`/`list()`) covering S3, Azure Blob, and Google Cloud Storage (plus ~30
     other backends) through one `jclouds-blobstore` dependency plus a provider module, with the provider chosen
     at `ContextBuilder.newBuilder("aws-s3"|"azureblob"|"google-cloud-storage")` configuration time rather than
     compile time. This is the strongest actual portability of the three, at the cost of not exposing every
     provider-specific feature (storage-tier/lifecycle control, presigned URLs) through the common API — those
     still need a provider-specific escape hatch.
   - **Spring Content** (`paulcwarren/spring-content`, `com.github.paulcwarren` group id) — a Spring-Data-style
     `ContentStore`/`Store` abstraction that associates file content with a JPA/MongoDB entity, swappable between
     filesystem, S3, Azure, and MongoDB GridFS backends via dependency choice alone, with no call-site code
     change. Verified as **actively maintained** (recent dependency bumps for Azure/GCP storage, targets Spring
     Boot 3.5.x/JDK 17) but it is a **community project under a personal GitHub org, not an official Spring/
     Pivotal project** — this caveat is stated explicitly in the page, the same way this section's bibliography
     already flags ShedLock as README-only-documented. It's also the most opinionated of the three: it couples
     storage to the Spring Data entity model, which is a good fit only when content is already modeled that way.
   These are placed in their own subsection after the three provider-specific SDKs (Task 1.4.5), not folded into
   them, so a reader who only needs one cloud can skip straight past it, and the closing "Choosing an approach"
   section (Task 1.6) gets an explicit rule of thumb for when portability outweighs full feature access.
9. **Nav & index placement:** insert the new page as a new `=== File Storage` subsection in `index.adoc`'s "What's
   covered" list, positioned immediately between the existing `=== Caching` (index.adoc:92-99) and `=== APIs`
   (index.adoc:101-106) subsections — exactly as the issue specifies. In `nav.adoc`, insert the new
   `**** xref:...` line between the existing `near-far-caches.adoc` (line 524) and `rest-apis.adoc` (line 525)
   entries, since `nav.adoc` itself has no `===` subsection markers (those only exist in `index.adoc`).
10. **Cross-link direction:** `cloud-native-batch.adoc`'s existing twelve-factor table row ("Processes are
    stateless" -- currently a single cell of prose, line 18) gets its "Stage files in object storage" clause
    turned into an `xref:` to the new page, and the new page's own "why local disk doesn't work" section opens by
    naming and cross-linking the same twelve-factor principle back at `cloud-native-batch.adoc`.

## Current code state

- **Section directory:** `modules/ROOT/pages/backend/springboot/` — every page follows one house style: `= Title`,
  `:description:`/`:keywords:` attribute lines, `include::partial$springboot-disclaimer.adoc[]`, `==`/`===`
  sections, fenced code as `[source,java]`/`[source,yaml]`/`[source,xml]` with `----` delimiters, diagrams as
  `[mermaid]` (behavioral) or `image::....svg[]` (spatial), pages ending in `== References`.
- **`modules/ROOT/pages/backend/springboot/index.adoc`** (429 lines) — `:description:` (line 2) and `:keywords:`
  (line 3) enumerate every sub-topic as comma-separated prose/lists; `== What's covered` (line 19) is grouped by
  `===` subsection; `=== Caching` is lines 92-99 (`caching.adoc`, `near-far-caches.adoc`), `=== APIs` is lines
  101-106 (`rest-apis.adoc`, `grpc-apis.adoc`), with a one-line note about GraphQL (line 108-109) between the API
  bullets and `=== Security`. `== Bibliography` starts at line 193, grouped into bullet clusters of related
  official-doc links per topic — no existing S3/GCS/Azure Blob/EFS/Filestore/Azure Files entries.
- **`modules/ROOT/nav.adoc`** — the SpringBoot Reference block runs roughly lines 506-544; line 524 is
  `**** xref:backend/springboot/near-far-caches.adoc[Near-Far Caches]`, immediately before line 525
  `**** xref:backend/springboot/rest-apis.adoc[REST APIs]`. Entries are flat `**** xref:backend/springboot/<file>
  [Label]` lines — `nav.adoc` has no `===` section markers of its own (those exist only in `index.adoc`).
- **`modules/ROOT/pages/backend/spring-batch/cloud-native-batch.adoc`** — a twelve-factor table (lines ~15-23)
  whose "Processes are stateless" row (line 18) currently reads: *"Local disk vanishes when the pod does. Stage
  files in object storage, and keep the only durable state in the `JobRepository`."* — this is the cross-link
  target/source for the new page.
- **`modules/ROOT/pages/backend/springboot/rest-apis.adoc`** (lines ~88-89) — a passing "multipart uploads"
  mention inside a link to Spring's own MVC reference; left unchanged (see Choice 7).
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — the shared `[IMPORTANT]` admonition included at the
  top of every section page; no change needed.
- **`modules/ROOT/images/`** — existing spatial-topology SVGs to match style against: `spring-batch-partitioning-
  topology.svg`, `springboot-solrcloud-topology.svg`, `springboot-elasticsearch-shards.svg`,
  `springboot-data-access-layers.svg` (viewBox ~760x470/700-wide, `#1c4b73`/`#eef4fa` blue and `#2f5424`/`#f4f7ee`
  green box palette, title + subtitle `<text>` header, `Helvetica, Arial, sans-serif` font).
- **Build/verification:** `npx antora antora-playbook.yml` (local content only) must complete with no
  `xref`/AsciiDoc errors; `build/` is gitignored. The `iru-build-docs` skill wraps this; the `iru-gate-runner`
  agent is installed at `.claude/agents/iru-gate-runner.md`.
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly (see Choice 1).

## Implementation steps

### Group 1 — Author the new page and its diagram (Parallelizable: yes — Task 1 and Task 2 are independent files;
only the image filename is a shared, non-blocking dependency between them)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/file-storage-and-object-stores.adoc`** — new page,
      ~600-750 lines. Done — 603 lines, house style (`= Title` / `:description:`/`:keywords:` /
      `include::partial$springboot-disclaimer.adoc[]`, `==`/`===` sections, closing `== References`).
  - [x] Task 1.1. Header: `= File Storage & Object Stores`, `:description:` and `:keywords:` attributes (cover
        EFS, Filestore, Azure Files, CSI drivers, S3, Cloud Storage, Blob Storage, Spring Cloud AWS/GCP/Azure,
        storage tiers/lifecycle policies, presigned URLs/SAS tokens, and vendor-lock-in avoidance: Spring
        `Resource`/`WritableResource` abstraction, Apache jclouds `BlobStore`, Spring Content), then
        `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. `== Why ephemeral local disk doesn't work here` — explain that Spring Boot apps typically run
        as multiple horizontally-scaled, ephemeral container/pod instances (EKS/GKE/AKS); local/container disk is
        wiped on restart or rescheduling, isn't shared between replicas, and doesn't scale independently of the
        instance, so `java.io.File`/`java.nio.file.Path`/`MultipartFile.transferTo()` writes to local disk cannot
        survive a restart or be seen by other replicas. Frame this explicitly as the same "Processes are
        stateless" twelve-factor principle already stated in
        `xref:backend/spring-batch/cloud-native-batch.adoc[Cloud-Native Batch]`'s twelve-factor table, and
        cross-link to it. Include the new `image::springboot-file-storage-topology.svg[...]` figure here (see
        Task 6) illustrating N pod replicas each with vanishing local disk vs. a shared network volume vs. an
        external object-storage service.
  - [x] Task 1.3. `== Network-mounted filesystems` — intro paragraph: for code that expects a real mounted
        filesystem path (existing libraries, `File`/`Path`/`MultipartFile.transferTo()`), mount a managed network
        filesystem into the Kubernetes nodes/pods via each cloud's CSI driver so application code needs no new
        library, only a mount path.
    - [x] Task 1.3.1. `=== Amazon EFS (AWS)` — Amazon EFS (NFSv4.1) mounted via the `aws-efs-csi-driver` on EKS:
          `ReadWriteMany` access, dynamic vs. static provisioning, the `AmazonEFSCSIDriverPolicy` IAM policy the
          driver's role needs, and the note that pods on Fargate mount EFS automatically without installing the
          driver.
    - [x] Task 1.3.2. `=== Google Cloud Filestore` — Filestore (managed NFS) mounted via the Filestore CSI driver
          on GKE: `ReadWriteMany`, dynamic or pre-provisioned Filestore instances, and Filestore multishares for
          allocating several smaller volumes from one instance.
    - [x] Task 1.3.3. `=== Azure Files` — Azure Files mounted via the `azurefile-csi-driver` on AKS: SMB and
          NFSv4.1 protocol support, `ReadWriteMany`, and the fact that AKS 1.21+ installs/manages this driver by
          default.
    - [x] Task 1.3.4. `=== Kubernetes example: mounting Amazon EFS` — one worked YAML example (a `StorageClass`
          with `provisioner: efs.csi.aws.com`, a `PersistentVolumeClaim` requesting `ReadWriteMany`, and a
          `Deployment` snippet showing the pod template's `volumeMounts`/`volumes` referencing that claim), with
          a closing note that the same shape applies to Filestore/Azure Files with their own provisioner names
          and that the Spring Boot side needs no special library for this approach.
  - [x] Task 1.4. `== Object storage client libraries` — intro paragraph: for the common case (uploads, exports,
        generated reports, static assets) object storage is usually the better fit than a mounted filesystem.
    - [x] Task 1.4.1. `=== Amazon S3 (Spring Cloud AWS)` — the `spring-cloud-aws-starter-s3` starter
          (`[source,xml]` Maven dependency), the auto-configured `S3Template`/`S3Client` beans, and a short
          `[source,java]` upload/download example using `S3Template`. Note to verify the current starter's
          artifact id/version against the Spring Cloud AWS reference before publishing.
    - [x] Task 1.4.2. `=== Google Cloud Storage (Spring Cloud GCP)` — the `spring-cloud-gcp-starter-storage`
          starter (`[source,xml]`), the auto-configured `Storage` bean, and/or the Spring `Resource` abstraction
          via the `gs://` protocol resolver, with a short `[source,java]` upload/download example. Same
          verify-current-version note.
    - [x] Task 1.4.3. `=== Azure Blob Storage (Spring Cloud Azure)` — Spring Cloud Azure's Storage Blob starter
          (`[source,xml]`), the `BlobServiceClient` bean and/or the Spring `Resource` abstraction for Azure
          Storage, with a short `[source,java]` upload/download example. Same verify-current-version note.
    - [x] Task 1.4.4. `=== Presigned URLs and SAS tokens` — a brief note on using S3 presigned URLs / Azure SAS
          tokens / (GCS signed URLs) to let a client upload or download directly against the bucket/container,
          bypassing the application server for the actual bytes.
    - [x] Task 1.4.5. `=== Avoiding vendor lock-in: cloud-agnostic abstractions` (see Choice 8) — a short intro
          framing the tradeoff (provider-specific SDK = full feature access, one cloud; abstraction = portability,
          fewer provider-specific features exposed), then three subsections:
      - `Spring's Resource abstraction` — a `[source,java]` snippet showing the *same* `Resource storageResource`
        field/`getInputStream()`/`(WritableResource) ... .getOutputStream()` code working against
        `@Value("s3://bucket/key")`, `@Value("gs://bucket/object")`, and
        `@Value("azure-blob://container/blob")` side by side, noting each still needs its own starter dependency
        and protocol resolver bean.
      - `Apache jclouds' BlobStore` — `[source,xml]` dependency (`jclouds-blobstore` + the relevant provider
        module, e.g. `aws-s3`/`azureblob`/`google-cloud-storage`) and a `[source,java]` snippet building a
        `BlobStore` via `ContextBuilder.newBuilder(<provider>)` and calling `putBlob`/`getBlob`, with a note that
        provider-specific features (storage tiers, presigned URLs) fall outside the common API.
      - `Spring Content` — `[source,xml]` dependency (e.g. `com.github.paulcwarren:spring-content-s3-boot-starter`
        or the filesystem/Azure equivalent) and a short `[source,java]` sketch of a `ContentStore<Document, UUID>`
        interface plus `contentStore.setContent(document, inputStream)`, with an explicit note that this is a
        community-maintained project (`paulcwarren/spring-content`, not an official Spring/Pivotal project) that
        couples stored content to a Spring Data JPA/MongoDB entity — verify current starter artifact ids/provider
        support against its own reference docs before publishing, same as the other libraries on this page.
  - [x] Task 1.5. `== Storage access tiers` — intro: the tradeoff between read latency/cost and storage cost, and
        how to place or move objects between tiers.
    - [x] Task 1.5.1. `=== Fast / CDN-backed access` — Amazon CloudFront in front of S3 (or S3 Transfer
          Acceleration for uploads), Google Cloud CDN in front of a GCS bucket, Azure Front Door/CDN in front of
          Blob Storage.
    - [x] Task 1.5.2. `=== Normal access` — S3 Standard, GCS Standard, Azure Blob Hot tier, as the default for
          actively-used files.
    - [x] Task 1.5.3. `=== Storage-only / archive access` — S3 Glacier (Instant Retrieval, Flexible Retrieval,
          Deep Archive), GCS Coldline/Archive, Azure Blob Cool/Cold/Archive tiers, and how each provider
          automates tier transitions with a lifecycle policy rather than manual moves.
    - [x] Task 1.5.4. Closing comparison table mapping the three "fast / normal / archive" categories to the
          concrete storage class/tier name in each of the three clouds (AsciiDoc `|===` table, columns: Category,
          AWS, Google Cloud, Azure).
  - [x] Task 1.6. `== Choosing an approach` — closing decision-guidance bullets, matching `near-far-caches.adoc`'s/
        `web-ui-frameworks.adoc`'s closing-table style:
      - Network-mounted filesystem vs. object storage: when the extra operational complexity of a mounted
        filesystem is worth it (existing code needing a real filesystem, POSIX semantics, shared scratch space
        between processes) vs. when object storage is the simpler, more cost-effective default (most new Spring
        Boot services).
      - Provider-specific SDK vs. a cloud-agnostic abstraction: use a provider-specific SDK/starter when the app
        targets one cloud and needs its full feature set (presigned URLs, fine-grained tier/lifecycle control);
        reach for Spring's `Resource` abstraction when the code should stay portable at the API level even though
        config/dependencies still change per provider; reach for jclouds' `BlobStore` when true multi-cloud
        portability (e.g. a product deployed to more than one cloud, or one whose target cloud isn't fixed yet)
        outweighs needing every provider-specific feature; reach for Spring Content only when content is already
        modeled as a Spring Data JPA/MongoDB entity and that coupling is acceptable.
      - A short pointer on picking a tier (fast/CDN for frequently-read public assets, normal for actively-used
        files, archive for cold data with a lifecycle policy automating the move).
  - [x] Task 1.7. `== References` — official-source links only: the CSI driver docs/repos, Spring Cloud AWS/GCP/
        Azure reference docs, the S3/GCS/Azure storage-tier docs already listed in the issue's References section,
        plus the Apache jclouds BlobStore guide (https://jclouds.apache.org/start/blobstore/) and Spring
        Content's own docs/GitHub (https://github.com/paulcwarren/spring-content).

- [x] **Task 2. Create `modules/ROOT/images/springboot-file-storage-topology.svg`** — a spatial topology diagram
      matching this repo's existing SVG style (viewBox ~760x480, `Helvetica, Arial, sans-serif`, title + subtitle
      `<text>` header, `#1c4b73`/`#eef4fa` and `#2f5424`/`#f4f7ee` box palette — see
      `modules/ROOT/images/spring-batch-partitioning-topology.svg` for the reference pattern): several pod
      replicas, each shown with its own ephemeral local disk (crossed out / labeled "vanishes on restart, not
      shared"), fanning out on one side to a shared network-mounted filesystem box (EFS/Filestore/Azure Files)
      and on the other to an external object-storage service box (S3/GCS/Blob Storage) — making clear both
      alternatives are shared and durable across replicas where local disk is neither. Referenced from Task 1.2
      via `image::springboot-file-storage-topology.svg[...]`. Done — matches the
      `spring-batch-partitioning-topology.svg` palette/style, 760x480 viewBox.

### Group 2 — Wire the new page in (Parallelizable: yes — `nav.adoc`, `index.adoc`, and `cloud-native-batch.adoc` are three different files; all require Group 1 complete so `xref`s resolve)

- [x] **Task 3. Add the nav entry in `modules/ROOT/nav.adoc`** — insert
      `**** xref:backend/springboot/file-storage-and-object-stores.adoc[File Storage & Object Stores]`
      immediately after the `**** xref:backend/springboot/near-far-caches.adoc[Near-Far Caches]` line (currently
      line 524) and before `**** xref:backend/springboot/rest-apis.adoc[REST APIs]` (currently line 525). Confirm
      via `grep -n` that only one such insertion point exists before editing.
      Done — confirmed via `grep -n` a single insertion point (lines 524/525), then inserted the nav line between
      them.
- [x] **Task 4. Update `modules/ROOT/pages/backend/springboot/index.adoc`**
  - [x] Task 4.1. Insert a new `=== File Storage` subsection between the existing `=== Caching` (ending line 99)
        and `=== APIs` (starting line 101) subsections, with one bullet cross-linking
        `xref:backend/springboot/file-storage-and-object-stores.adoc[File Storage & Object Stores]` and
        summarizing its scope (ephemeral-disk problem, EFS/Filestore/Azure Files, S3/GCS/Azure Blob client
        libraries, storage tiers, and avoiding vendor lock-in with Spring's `Resource` abstraction, Apache
        jclouds, and Spring Content).
        Done — new `=== File Storage` subsection with one summarizing bullet added between `=== Caching` and
        `=== APIs`.
  - [x] Task 4.2. Extend `:description:` (line 2) and `:keywords:` (line 3) with the new topic, matching the
        existing comma-separated style — e.g. add "file storage and object stores (network-mounted filesystems
        and S3/Cloud Storage/Blob Storage client libraries, storage access tiers, and cloud-agnostic abstractions
        to avoid vendor lock-in)" to `:description:`, and terms like `EFS, Filestore, Azure Files, CSI driver, S3,
        Cloud Storage, Blob Storage, presigned URL, SAS token, storage tier, lifecycle policy, vendor lock-in,
        Resource abstraction, WritableResource, Apache jclouds, BlobStore, Spring Content, ContentStore` to
        `:keywords:`.
        Done — both attribute lines extended with the specified phrase/terms in the existing comma-separated
        style.
  - [x] Task 4.3. Add a new bibliography bullet cluster in `== Bibliography` citing the CSI driver docs/repos,
        the Spring Cloud AWS/GCP/Azure storage references, the Apache jclouds BlobStore guide, and Spring
        Content's GitHub/docs — cross-checked against `file-storage-and-object-stores.adoc`'s own
        `== References` so nothing already covered by an existing generic bullet is duplicated.
        Done — new bullet cluster added right after the existing near-far-caching bibliography bullet: the CSI
        driver docs/repos (EFS/Filestore/Azure Files), the Spring Cloud GCP/Azure storage references, the
        Apache jclouds BlobStore guide, and Spring Content's GitHub repo. The pre-existing Spring Cloud AWS
        reference bullet (already listed for `@RefreshScope` config-change providers) was cross-noted rather
        than duplicated, since it points at the same Spring Cloud AWS reference root that also documents the S3
        integration.
- [x] **Task 5. Cross-link `modules/ROOT/pages/backend/spring-batch/cloud-native-batch.adoc`** — edit the
      "Processes are stateless" table row (line 18) so its "Stage files in object storage" clause becomes an
      `xref:backend/springboot/file-storage-and-object-stores.adoc[...]` link, keeping the rest of the sentence
      ("and keep the only durable state in the `JobRepository`") unchanged.
      Done — the "Stage files in object storage" clause is now an `xref:` link to the new page; the rest of the
      sentence is unchanged.

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1-2 complete)

- [x] **Task 6. Verify the Antora build is clean** — delegated to the `iru-gate-runner` agent per plan text.
      Done — build completed successfully (exit code 0), no xref/AsciiDoc warnings or errors. All four
      touched/new files built cleanly: `file-storage-and-object-stores.adoc`, `index.adoc`, `nav.adoc` (no broken
      nav references), and `cloud-native-batch.adoc`. The new
      `modules/ROOT/images/springboot-file-storage-topology.svg` resolves — copied to
      `build/site/_images/springboot-file-storage-topology.svg` and correctly referenced by the rendered page's
      `<img>` tag.
  - [x] Task 6.1. No unresolved `xref`, missing image, or AsciiDoc error was reported — nothing to fix; the
        first build was already clean.
  - [x] Task 6.2. Confirmed — new page is 603 lines. Note: this task's own text says "~450-600 line budget," but
        Choice 4 above (the plan's authoritative sizing rationale) states the actual target is ~600-750 lines,
        and Task 1 was explicitly authored and marked done against that ~600-750 budget. This is a stale/
        inconsistent leftover in this task's text, not a real discrepancy in the page — 603 lines is within the
        operative ~600-750 budget (and just barely outside the stale ~450-600 figure, which was never the
        intended target per Choice 4). `== References` (lines 581-603) contains only official-source links:
        AWS/GCP/Azure CSI-driver and storage docs, Spring Cloud AWS/GCP/Azure reference docs, the Apache jclouds
        BlobStore guide, and Spring Content's own GitHub repo — no blogs or third-party tutorials.
