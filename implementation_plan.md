# Implementation Plan: Guides & References / Backend Development — Docker

## Task summary

Source: GitHub issue #158
Base branch: main

Issue [#158](https://github.com/albertoirurueta/docs/issues/158) asks for a new **Docker** section under
*Guides & References → Backend Development*, a sibling of the existing Hibernate, SpringBoot, GraphQL, Spring Batch,
OAuth, Quarkus, Messaging and Architecture references, authored directly into this repo's own `ROOT` Antora
component. It teaches how Docker works and how to use it (architecture and the OCI, images, Dockerfiles, the build
cache and multi-stage builds, BuildKit/Buildx, running/debugging containers, storage, networking, resources/logging,
Compose, registries, security, orchestration) and then applies it to the Java / Spring Boot loop: building Spring Boot
images, Compose for local development, Testcontainers, **Spring Boot integration tests with Testcontainers run locally
and in GitHub Actions** (the page the request singles out), and CI/CD image builds with the official `docker/*`
actions.

Concretely:

1. **23 new AsciiDoc pages** under `modules/ROOT/pages/backend/docker/`: a landing `index.adoc` (with a
   `== Bibliography`), **21 topic pages**, and a `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/docker-disclaimer.adoc` — AI-assistance disclosure + bibliography
   pointer only, exactly like `messaging-disclaimer.adoc`.
3. **Figures**: `modules/ROOT/images/docker-*.svg` plus `[mermaid]` blocks, per the 📊 notes on each page.
4. **Site wiring**: nav block after the Architecture block in `modules/ROOT/nav.adoc`; a "Docker" bullet and keywords
   in `backend/index.adoc`; a Docker mention in `backend/springboot/index.adoc`; Docker keywords in the root
   `pages/index.adoc`.
5. **Reciprocal cross-links** from the existing SpringBoot, Messaging, Hibernate, Quarkus and Prometheus pages the
   issue names, so nothing already documented is duplicated.
6. **One cheat-sheet PDF**: `modules/ROOT/attachments/docker-cheat-sheet.pdf`, exactly one A4 page, rendered from a
   scratch HTML/CSS layout via headless Chrome, visually consistent with `messaging-cheat-sheet.pdf` /
   `springboot-cheat-sheet.pdf`. Only the PDF is committed.

The full page outline, source list, book-comparison table, superseded-construct list and bibliography are already
specified in the issue body — this plan does not re-derive them; it sequences their creation into buildable,
reviewable groups. **Each task must re-read its page's section of the issue body** (`GitHub issue #158`, section
"Docker page outline") while writing, since that is the authoritative content spec; the sub-tasks below summarise it.

Decisions made on the user's behalf (no question was needed — state them so review can challenge them):

- **Page count.** The issue's outline enumerates 21 topic pages + `index.adoc` + `cheat-sheet.adoc`; its acceptance
  criterion says "22 concept pages + `index.adoc` + `cheat-sheet.adoc`". The only reading consistent with the outline
  is that the "22" counts `index.adoc`. This plan creates exactly the 21 enumerated topic pages and invents no extra
  page.
- **GitHub Actions versions.** The pages use the issue's current majors (`actions/checkout@v7`,
  `actions/setup-java@v6`, `docker/*` majors as listed in the issue). The house skill
  `.claude/skills/iru-setup-java-springboot-github-workflows/SKILL.md` still pins `actions/checkout@v5` /
  `actions/setup-java@v5`; the pages follow the skill's workflow **shape** (`ubuntu-latest`, `mvn -B -ntp clean verify`,
  upload `**/target/failsafe-reports/**` on failure, `spring-boot:build-image` + `docker.publishRegistry.*` in
  `deploy.yml`) with the current action majors. Updating the skill is out of scope; flag it as a follow-up in the
  final report.
- **Verification source.** Version-sensitive facts (Engine 29 changes, Compose Specification keys, BuildKit/Dockerfile
  flags, Testcontainers 2.0 artifact/package names, Spring Boot 4.1 property names and defaults, action inputs) are
  checked live at write time against the official pages (Docker docs expose `https://docs.docker.com/llms.txt` and a
  per-page `<page-url>.md` route), never assumed from memory — the same practice the Messaging plan used
  (`.archive/implementation_plan_150.md`).

No task carries a language/framework tag: the installed `*-code-one-task` skills are `java`, `java-springboot`,
`dotnet` and `database`, none of which covers AsciiDoc/Antora documentation — same convention as every prior docs
plan in `.archive/` (e.g. `implementation_plan_150.md`, `implementation_plan_161.md`). Java/YAML/Dockerfile snippets
inside pages are documentation content, not compiled code.

## Current code state

- **Antora component**: `antora.yml` declares the `irurueta` ROOT component; `modules/ROOT/nav.adoc` is its nav. The
  Backend Development subtree starts at `nav.adoc:523` (`** xref:backend/index.adoc[Backend Development]`); its last
  block is Architecture (`nav.adoc:770` `*** xref:backend/architecture/index.adoc[Architecture]` through
  `nav.adoc:800` `***** xref:backend/architecture/architectural-patterns/cheat-sheet.adoc[Cheat Sheet (PDF)]`),
  immediately followed by `nav.adoc:801` `** xref:apps/index.adoc[Apps]`. The Docker block goes between 800 and 801.
- **`modules/ROOT/pages/backend/index.adoc`**: `== Sections` lists Java, Hibernate, SpringBoot, GraphQL, Spring Batch,
  OAuth, Quarkus, Messaging, then Architecture (with two `**` sub-bullets, lines 53-60) last. `:description:` and
  `:keywords:` are single long lines.
- **Disclaimer precedent**: `modules/ROOT/partials/messaging-disclaimer.adoc` — one `[IMPORTANT]` / `====` block, one
  sentence of AI-assistance disclosure + `xref:backend/messaging/index.adoc#_bibliography[the section bibliography]`.
- **Section precedent**: `modules/ROOT/pages/backend/messaging/` (landing page with `== Bibliography`, one page per
  concept ending in `== References`, `cheat-sheet.adoc` linking `xref:attachment$messaging-cheat-sheet.pdf[...]`
  under `== Download`), figures `modules/ROOT/images/messaging-*.svg`.
- **Nothing Docker-specific exists**: no `backend/docker/` directory, no `docker-*.svg`, no `docker-cheat-sheet.pdf`.
  56 pages mention Docker in passing (one-liners); none explains Docker itself or how Testcontainers uses it.
- **Existing pages to link, never duplicate** (all present, line counts as quoted by the issue):
  - `backend/springboot/unit-and-integration-testing.adoc` (285) — `@SpringBootTest` + `@Container`/`@ServiceConnection`.
  - `backend/springboot/maven-quality-plugins.adoc` (377) — Surefire vs. Failsafe, `*IT`, JaCoCo.
  - `backend/messaging/spring-boot-testing-messaging.adoc` (351) — broker containers, Docker Compose support for
    brokers (lines ~122-142).
  - `backend/hibernate/integration-testing.adoc` (205), `backend/hibernate/hibernate-search-integration-testing.adoc` (168).
  - `backend/springboot/file-storage-and-object-stores.adoc`, `backend/springboot/mongodb-atlas-search.adoc`,
    `database/solr/spring-boot-integration.adoc`, `backend/oauth/testing-and-debugging.adoc` — Testcontainers modules.
  - `backend/quarkus/container-images.adoc` (237), `developer-experience.adoc`, `testing.adoc`,
    `kubernetes-and-openshift.adoc`.
  - `database/{couchbase,elasticsearch,mongodb,neo4j,prometheus,qdrant,solr}/getting-started.adoc`,
    `backend/messaging/getting-started.adoc`, `backend/messaging/kafka-operations-and-monitoring.adoc` — `docker run`
    one-liners.
  - `database/prometheus/containers-and-kubernetes-monitoring.adoc`; `web/aspnet/core/deployment.adoc`;
    `web/vaadin/production-and-deployment.adoc`; `backend/architecture/decisions-and-migrations/*`.
- **House conventions the Java pages must match**:
  - `.claude/skills/iru-setup-java-springboot-testcontainers/SKILL.md` — one `compose.yaml` at the repository root
    (every service with a `healthcheck`, development-only credentials labelled as such); an abstract IT base class with
    `static final ComposeContainer ENVIRONMENT = new ComposeContainer(new File("../compose.yaml"))
    .withExposedService("<svc>", <port>, Wait.forListeningPort())`, random mapped ports bound via
    `@DynamicPropertySource`; `@ServiceConnection` for narrow per-adapter bases; `spring.docker.compose.skip.in-tests:
    true` so Boot does not start a second stack; `*IT` run by Failsafe under `mvn verify`, `mvn test` Docker-free.
  - `.claude/skills/iru-setup-java-springboot-github-workflows/SKILL.md` — `build.yml`: `ubuntu-latest`,
    `actions/checkout`, `actions/setup-java` (`distribution: temurin`), `mvn -B -ntp clean verify` ("Docker is
    available on ubuntu-latest runners"), upload `**/target/failsafe-reports/**`; `deploy.yml`: OIDC, then
    `mvn -B -ntp -pl boot -am spring-boot:build-image -DskipTests -Dspring-boot.build-image.imageName=...
    -Dspring-boot.build-image.publish=true -Ddocker.publishRegistry.username/password=...`.
- **Validation tooling**: `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`) needs
  `npm i --no-save mermaid@11 jsdom` first (not vendored); CI (`.github/workflows/publish.yml`) runs it before
  `npx antora antora-playbook.yml`.
- **Known pitfalls from the Messaging run** (`.archive/implementation_plan_150.md`): every page reports
  `target of xref not found: backend/docker/index.adoc#_bibliography` until `index.adoc` lands (Group 8) — expected,
  not a regression; `image::` alt text must contain no commas; no physical line in the bibliography may start with a
  bare `<number>.` token (e.g. a wrapped `2015.`), which Asciidoctor parses as an ordered-list marker.

## Implementation steps

> Conventions every page task inherits (do not restate per task):
>
> - Create the file under `modules/ROOT/pages/backend/docker/`; start with `= <Title>`, `:description:`, `:keywords:`,
>   then `include::partial$docker-disclaimer.adoc[]`; the intro paragraph states the version baseline in prose
>   (Docker Engine 29.8.x, Compose v5.5.x, Buildx 0.37.x / BuildKit 0.33.x with `docker/dockerfile:1`, Docker Desktop
>   4.91.x; plus Testcontainers 2.0.5 / Spring Boot 4.1.x / Java 25 on the Java pages).
> - Every code example is a runnable shell command, Dockerfile (`# syntax=docker/dockerfile:1`), `compose.yaml`
>   (no `version:` key), GitHub Actions workflow or Java 25 / Spring Boot 4.1 snippet, and is **followed by a link to
>   the official page it is derived from**.
> - Add the issue's 📊 figures: SVGs under `modules/ROOT/images/` named `docker-<topic>.svg`, embedded with
>   `image::docker-<topic>.svg[<alt text without commas>,width=700]`; `[mermaid]` blocks inline. The 📊 list is a
>   floor, not a ceiling. SVGs must be legible in the site's light theme (dark text on light fill), self-contained
>   (no external fonts/images).
> - End with `== References` linking **only** official documentation (docs.docker.com, opencontainers.org and the
>   OCI/moby/docker GitHub repos, java.testcontainers.org / testcontainers.com, docs.spring.io, buildpacks.io,
>   paketo.io, the Jib repo, docs.oracle.com, docs.github.com, github.com/docker/* and github.com/actions/*) — never
>   the two books, which appear only in `index.adoc`'s Bibliography.
> - Superseded constructs (Boot2Docker, Docker Machine, `MAINTAINER`, `--link`, `--volumes-from`, `docker-compose` v1
>   and `version:`, the Python `docker-registry`, Hub autobuilds, the legacy builder, AUFS/devicemapper, execution
>   drivers, standalone Swarm/Centurion, `nsenter` as the way in, Docker Content Trust in the CLI) appear **only** as
>   historical, with their replacement named.
> - Testcontainers is always 2.0: `org.testcontainers:testcontainers-<module>` artifacts, `org.testcontainers.<module>`
>   packages, `testcontainers-junit-jupiter`, no JUnit 4 `@Rule` — never 1.x names.
> - Prefer `xref:` to sibling Docker pages and to the existing pages listed under "Current code state" over repeating
>   material.
> - **No admonition block** (`NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT`, block or inline `NOTE:` form) anywhere
>   under `backend/docker/` other than the disclaimer include — write it as prose or a table row.
> - Verify version-sensitive facts live against the cited official page at write time (Docker pages: fetch
>   `<page-url>.md`); do not assume flags, defaults, property names or action inputs from memory.
> - After finishing a page, run `node scripts/validate-mermaid.mjs modules/ROOT/pages/backend/docker` for its Mermaid
>   blocks (after a one-time `npm i --no-save mermaid@11 jsdom`).
> - After each group, delegate a build check to the `iru-gate-runner` agent (`npx antora antora-playbook.yml`, report
>   only errors/warnings other than the expected `index.adoc#_bibliography` one) rather than running the build in the
>   main conversation.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land first: every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/docker-disclaimer.adoc` — done; mirrors `messaging-disclaimer.adoc` with the Docker bibliography xref (docs-only: no tests/coverage/quality tooling applies).
  - [x] Task 1.1. One `[IMPORTANT]` / `====` block containing only: "This content was generated with the assistance of
        AI and should be verified against the official documentation before being relied on in production; see
        xref:backend/docker/index.adoc#_bibliography[the section bibliography] for the reference material consulted
        while preparing these pages." — mirroring `messaging-disclaimer.adoc` word for word except the xref target.
  - [x] Task 1.2. No version baseline, no book title inside the admonition.

### Group 2 — Foundations (Parallelizable: yes — three distinct pages, each with its own SVGs)

> Done: `getting-started.adoc`, `architecture-and-the-oci.adoc`, `images-layers-and-tags.adoc`; figures `docker-platform-map.svg`, `docker-architecture-stack.svg`, `docker-image-layers.svg` + 3 Mermaid blocks (all parse). Build: no errors other than forward xrefs to later-group pages. Verified live against docker/docs sources (docs.docker.com is blocked by the session egress policy; the same content was read from the github.com/docker/docs repository): Engine 29.2 lowered the minimum API to v1.40 and 29.8 serves v1.56 (the issue text says 1.44/1.52 — pages state the verified history); nftables is opt-in via `firewall-backend`.

- [x] Task 2. `getting-started.adoc` — "Getting Started with Docker"
  - [x] Task 2.1. The problem Docker solves; what Docker is not (not a VM, not configuration management, not an
        orchestrator — the _Up & Running_ ch. 1 narrative restated against `get-started/docker-overview/`); containers
        vs. virtual machines.
  - [x] Task 2.2. The platform map: Engine, CLI, Desktop, Hub, Build/Buildx, Compose, Scout, Hardened Images,
        Testcontainers; Sandboxes, Model Runner, Offload, Build Cloud **named only** (out of scope).
  - [x] Task 2.3. Installing Docker Desktop vs. Docker Engine on Linux; post-install (`docker` group and why it is
        root-equivalent); `docker version`, `docker info`, `docker run hello-world`, `docker context ls/use`.
  - [x] Task 2.4. The version history explaining the books' numbers: 1.x → 17.03 (CalVer, CE/EE) → 20.10 → 23.0
        (BuildKit default) → 29 (containerd image store default on fresh installs); Boot2Docker/Machine flagged
        historical → Desktop.
  - [x] Task 2.5. 📊 `docker-platform-map.svg` (laptop, CI, registry, runtime); 📊 mermaid contrasting a VM stack
        and a container stack.
  - [x] Task 2.6. `== References`: `get-started/docker-overview/`, `get-started/get-docker/`, `engine/install/`,
        `engine/install/linux-postinstall/`, `desktop/`, `engine/manage-resources/contexts/`, `engine/release-notes/29/`.

- [x] Task 3. `architecture-and-the-oci.adoc` — "Docker Architecture and the OCI"
  - [x] Task 3.1. Client/daemon: `docker` CLI → Engine API (Unix socket / TCP / SSH) → `dockerd` → containerd →
        shim → runc → kernel; why the socket is root-equivalent; API versioning (Engine 29 minimum 1.44, current 1.52
        — verify against `engine/release-notes/29/` and `reference/api/engine/version-history/`).
  - [x] Task 3.2. BuildKit as the build engine; the OCI image, runtime and distribution specifications and what
        "OCI-compatible" means.
  - [x] Task 3.3. Linux primitives: namespaces, cgroups v2 (v1 deprecated in 29), capabilities, seccomp; storage:
        overlay2 vs. the containerd image store and snapshotters; execution drivers and AUFS/devicemapper flagged
        historical.
  - [x] Task 3.4. Docker Desktop's Linux VM (VMM, WSL 2) and what it implies for file sharing and networking;
        alternative runtimes (`--runtime`, gVisor/Kata named).
  - [x] Task 3.5. 📊 `docker-architecture-stack.svg` (CLI → API → dockerd → containerd → shim → runc → kernel);
        📊 mermaid `sequenceDiagram` of `docker run` end to end (pull if missing → create → start).
  - [x] Task 3.6. `== References`: `get-started/docker-overview/`, `engine/`, `engine/storage/containerd/`,
        `engine/storage/drivers/`, `engine/security/`, `engine/daemon/alternative-runtimes/`, the three OCI spec repos,
        runc, containerd.io, moby/buildkit.

- [x] Task 4. `images-layers-and-tags.adoc` — "Images, Layers and Tags"
  - [x] Task 4.1. An image = read-only layers + config, addressed by content digest; layer sharing and copy-on-write;
        the writable container layer; the books' image-vs-container explanation reused.
  - [x] Task 4.2. References `registry/namespace/repository:tag`; tags vs. `@sha256:` digests; why `latest` is a trap;
        manifests and manifest lists / OCI image indexes (multi-platform).
  - [x] Task 4.3. Commands: `pull`, `image ls` (29 tree view, `--all`), `image inspect`, `image history`, `tag`,
        `rmi`, `save`/`load` (air-gapped), `export`/`import` and `commit` (and why not), `image prune`; labels vs.
        annotations.
  - [x] Task 4.4. 📊 `docker-image-layers.svg` (two containers sharing one image's layers); 📊 mermaid of a
        reference resolving index → platform manifest → config + layers.
  - [x] Task 4.5. `== References`: `get-started/docker-concepts/the-basics/what-is-an-image/`,
        `get-started/docker-concepts/building-images/understanding-image-layers/`, `reference/cli/docker/image/`,
        OCI image-spec.

### Group 3 — Building images (Parallelizable: yes — four distinct pages; later pages link earlier ones by path only, which does not require the target to exist until the build check)

> Done: `dockerfile-fundamentals.adoc`, `build-cache-and-multi-stage-builds.adoc`, `buildkit-and-buildx.adoc`, `image-best-practices-and-security.adoc`; figures `docker-cmd-entrypoint-matrix.svg`, `docker-multi-stage-build.svg`, `docker-buildx-drivers.svg`, `docker-image-supply-chain.svg` + 4 Mermaid blocks (all 7 so far parse). Build: 0 messages besides forward xrefs; every docs.docker.com link resolves against the docker/docs source; ad hoc detect-secrets scan clean. Verified against the Dockerfile reference (moby/buildkit), build docs and DHI Java example; the build-policies page lives at `build/policies/` (experimental), not `build/policies/intro/`.

- [x] Task 5. `dockerfile-fundamentals.adoc` — "Dockerfile Fundamentals"
  - [x] Task 5.1. Parser directives (`# syntax=docker/dockerfile:1`, `escape`, `check`); `FROM` (`ARG` before `FROM`,
        `--platform`, `AS`); `RUN` shell vs. exec form, `--mount`, `--network`, `--security`.
  - [x] Task 5.2. `CMD` vs. `ENTRYPOINT` with the interaction matrix; `COPY` vs. `ADD` (`--chown`, `--chmod`,
        `--link`, `--parents`, `--exclude`, `ADD --checksum`); `WORKDIR`; `ENV` vs. `ARG` (scope, predefined args,
        cache impact); `EXPOSE`; `USER`; `VOLUME`; `LABEL` (`MAINTAINER` historical); `HEALTHCHECK`; `STOPSIGNAL`;
        `SHELL`; `ONBUILD`; here-documents.
  - [x] Task 5.3. Build context and `.dockerignore`; `docker build` with `--target`, `--build-arg`, `--no-cache`,
        `--progress=plain`; the _Learning Docker_ ch. 3 survey brought up to date.
  - [x] Task 5.4. 📊 `docker-cmd-entrypoint-matrix.svg`; 📊 mermaid build context → BuildKit → layers.
  - [x] Task 5.5. `== References`: `reference/dockerfile/`, `build/concepts/context/`, `build/concepts/dockerfile/`,
        `reference/cli/docker/buildx/build/`.

- [x] Task 6. `build-cache-and-multi-stage-builds.adoc` — "Build Cache and Multi-Stage Builds"
  - [x] Task 6.1. How the layer cache works and what invalidates it (instruction order, `COPY` checksums, `ARG`
        changes); ordering for cache hits (dependencies before sources).
  - [x] Task 6.2. `RUN --mount=type=cache` (Maven/Gradle/npm), `bind`, `secret`, `ssh`, `tmpfs` mounts.
  - [x] Task 6.3. Multi-stage builds: named stages, `COPY --from`, `--target`, external images as stages, build vs.
        runtime images, a test stage; base-image choice (Official Images, Debian slim vs. Alpine vs. Ubuntu vs.
        distroless vs. Docker Hardened Images, glibc vs. musl).
  - [x] Task 6.4. Java example: `eclipse-temurin:25-jdk` build stage caching `/root/.m2`, `eclipse-temurin:25-jre`
        runtime stage — kept generic here, with an `xref:` to `java-and-spring-boot-images.adoc` for the Spring Boot
        layered-jar version.
  - [x] Task 6.5. 📊 `docker-multi-stage-build.svg` (deps → build → runtime, what is copied forward); 📊 mermaid of
        cache hit/miss propagation.
  - [x] Task 6.6. `== References`: `build/cache/`, `build/cache/invalidation/`, `build/cache/optimize/`,
        `build/building/multi-stage/`, `build/building/base-images/`, `reference/dockerfile/#run---mount`.

- [x] Task 7. `buildkit-and-buildx.adoc` — "BuildKit and Buildx"
  - [x] Task 7.1. BuildKit as default builder (parallel/skipped stages, frontends); `docker buildx` builders and
        drivers (`docker`, `docker-container`, `kubernetes`, `remote`, `cloud`).
  - [x] Task 7.2. Multi-platform builds (`--platform`, QEMU vs. cross-compilation with `$BUILDPLATFORM`/`TARGETARCH`);
        exporters; remote cache backends (`registry`, `gha`, `local`, `inline`, `s3`).
  - [x] Task 7.3. Build checks (`docker build --check`); attestations (SBOM, SLSA provenance,
        `docker buildx imagetools inspect`); annotations; Bake (targets, matrices, variables, Compose-file input);
        build policies (introduced only); Build Cloud and the GitHub Builder named.
  - [x] Task 7.4. 📊 `docker-buildx-drivers.svg`; 📊 mermaid of a multi-platform build fanning out per platform into
        a manifest list.
  - [x] Task 7.5. `== References`: `build/buildkit/`, `build/builders/`, `build/builders/drivers/`,
        `build/building/multi-platform/`, `build/exporters/`, `build/cache/backends/`, `build/checks/`,
        `build/metadata/attestations/`, `build/bake/`, `build/policies/intro/`, docker/buildx repo.

- [x] Task 8. `image-best-practices-and-security.adoc` — "Image Best Practices and Supply-Chain Security"
  - [x] Task 8.1. The official "building best practices", each with its reason: minimal pinned bases, one concern per
        image, ephemeral containers, `.dockerignore`, multi-stage, non-root `USER`, no secrets in layers/`ENV`
        (`--mount=type=secret`), `HEALTHCHECK`, reproducible builds (`SOURCE_DATE_EPOCH`, pinned digests), OCI labels.
  - [x] Task 8.2. Linting (build checks, hadolint); Docker Scout (`quickview`, `cves`, `recommendations`, policies);
        Docker Hardened Images incl. the Java migration example; attestations + Sigstore signing now that Content
        Trust is removed from the CLI in 29 (_Learning Docker_ ch. 11 flagged historical).
  - [x] Task 8.3. 📊 mermaid base-image decision flow; 📊 `docker-image-supply-chain.svg` (source → build →
        attestations → registry → scan → deploy).
  - [x] Task 8.4. `== References`: `build/building/best-practices/`, `build/building/secrets/`, `scout/`,
        `scout/quickstart/`, `scout/policy/`, `dhi/`, `dhi/migration/examples/java/`, `build/metadata/attestations/`,
        hadolint, slsa.dev, sigstore.dev.

### Group 4 — Running containers (Parallelizable: yes — five distinct pages)

> Done: `running-containers.adoc`, `storage-volumes-and-bind-mounts.adoc`, `networking.adoc`, `resources-logging-and-monitoring.adoc`, `debugging-containers.adoc`; figures `docker-run-option-groups.svg`, `docker-storage-mounts.svg`, `docker-networking-bridges.svg`, `docker-cgroup-limits.svg`, `docker-debug-sidecar.svg` + 5 Mermaid blocks (12 total, all parse). Build: 0 messages besides forward xrefs; docs.docker.com links and xref anchors verified; every image tag checked against Docker Hub; ad hoc detect-secrets scan clean.

- [x] Task 9. `running-containers.adoc` — "Running Containers"
  - [x] Task 9.1. Lifecycle (`create` → `start` → running → `stop`/`kill` → exited → `rm`; `pause`; `restart`).
  - [x] Task 9.2. `docker run` options: `-d`, `-it`, `--rm`, `--name`, `-e`/`--env-file`, `-p`/`-P`, `-v`/`--mount`,
        `--network`, `-w`, `-u`, `--entrypoint`, `--init`, `--restart`, `--stop-timeout`, `--label`, `--platform`;
        overriding image defaults.
  - [x] Task 9.3. `exec`, `logs`, `ps`, `inspect`, `top`, `stats`, `cp`, `attach`, `port`, `update`, `wait`; signals
        and exit codes (PID 1, `SIGTERM` → `SIGKILL`, `--init`/tini, graceful shutdown); restart policies vs. process
        managers; one process per container; pruning.
  - [x] Task 9.4. 📊 mermaid `stateDiagram-v2` of the lifecycle; 📊 `docker-run-option-groups.svg`.
  - [x] Task 9.5. `== References`: `engine/containers/run/`, `engine/containers/start-containers-automatically/`,
        `engine/containers/multi-service_container/`, `reference/cli/docker/container/`.

- [x] Task 10. `storage-volumes-and-bind-mounts.adoc` — "Storage: Volumes, Bind Mounts and tmpfs"
  - [x] Task 10.1. Ephemeral writable layer; named/anonymous volumes and `docker volume`; bind mounts (UID mapping,
        read-only, `:z`/`:Z`); tmpfs; `--mount` vs. `-v`; image mounts.
  - [x] Task 10.2. Backup/restore a volume with a throwaway container; Desktop file sharing and synchronized file
        shares; overlay2 vs. containerd image store (link Task 3); `--volumes-from` flagged historical.
  - [x] Task 10.3. 📊 `docker-storage-mounts.svg`; 📊 mermaid backup/restore round trip.
  - [x] Task 10.4. `== References`: `engine/storage/`, `engine/storage/volumes/`, `engine/storage/bind-mounts/`,
        `engine/storage/tmpfs/`, `desktop/features/synchronized-file-sharing/`.

- [x] Task 11. `networking.adoc` — "Networking"
  - [x] Task 11.1. Drivers: default `bridge` vs. user-defined bridge (embedded DNS, discovery by name), `host`,
        `none`, `overlay`, `macvlan`, `ipvlan`; `docker network` commands.
  - [x] Task 11.2. Port publishing (`-p host:container/proto`, interface binding, `-P`, `EXPOSE` as documentation);
        `host.docker.internal`, `--add-host host-gateway`; DNS; IPv6.
  - [x] Task 11.3. iptables/nftables (`DOCKER-USER`, the 29 nftables backend, published ports bypass host
        firewalls); proxies; `--link` historical (no env vars injected in 29); the `docker0`/NAT explanation modernised.
  - [x] Task 11.4. 📊 `docker-networking-bridges.svg`; 📊 mermaid request through the published-port NAT.
  - [x] Task 11.5. `== References`: `engine/network/`, `engine/network/drivers/bridge/` (and siblings),
        `engine/network/port-publishing/`, `engine/network/packet-filtering-firewalls/`, `engine/network/links/`.

- [x] Task 12. `resources-logging-and-monitoring.adoc` — "Resources, Logging and Monitoring"
  - [x] Task 12.1. cgroup limits (`--memory`, `--memory-swap`, `--cpus`, `--cpuset-cpus`, `--pids-limit`,
        `--ulimit`, `--gpus`); OOM; what the JVM sees (container awareness, `-XX:MaxRAMPercentage`,
        `-XX:ActiveProcessorCount`).
  - [x] Task 12.2. Logging drivers (`json-file`/`local` with rotation, `journald`, `fluentd`, `gelf`, `awslogs`,
        `syslog`), dual logging, stdout/stderr as the contract.
  - [x] Task 12.3. `docker stats`, `events`, `system df`, health states, daemon Prometheus metrics (`xref:` to the
        Prometheus reference incl. `database/prometheus/containers-and-kubernetes-monitoring.adoc`), cAdvisor named;
        pruning and labels.
  - [x] Task 12.4. 📊 `docker-cgroup-limits.svg`; 📊 mermaid logging pipeline.
  - [x] Task 12.5. `== References`: `engine/containers/resource_constraints/`, `engine/containers/runmetrics/`,
        `engine/logging/`, `engine/logging/configure/`, `engine/daemon/prometheus/`, the Java 25 `java` man page.

- [x] Task 13. `debugging-containers.adoc` — "Debugging Containers"
  - [x] Task 13.1. The toolbox in order: `logs`, `ps -a` and exit codes, `inspect --format` Go templates,
        `exec -it … sh`, `docker debug` for shell-less images, `top`, `diff`, `cp`, `image history`, `events`;
        namespace-sharing sidecars (`--pid=container:`, `--network=container:`); `nsenter` historical; daemon logs and
        `dockerd --debug`.
  - [x] Task 13.2. Common-failures table (port already allocated, `docker.sock` permission denied, no space left, DNS
        in containers, `exec format error`, OOM-killed, healthcheck never healthy, bind-mount changes not visible).
  - [x] Task 13.3. 📊 mermaid troubleshooting flowchart; 📊 `docker-debug-sidecar.svg`.
  - [x] Task 13.4. `== References`: `reference/cli/docker/debug/`, `reference/cli/docker/container/inspect/`,
        `engine/cli/formatting/`, `engine/daemon/troubleshoot/`, `engine/daemon/logs/`.

### Group 5 — Compose, registries, security and orchestration (Parallelizable: yes — five distinct pages)

> Done: `compose-fundamentals.adoc`, `compose-in-practice.adoc`, `registries-and-docker-hub.adoc`, `security.adoc`, `orchestration-swarm-and-kubernetes.adoc`; figures `docker-compose-application-model.svg`, `docker-compose-merge.svg`, `docker-registry-push-pull.svg`, `docker-isolation-layers.svg`, `docker-swarm-routing-mesh.svg` + 5 Mermaid blocks (17 total, all parse). Build: 0 messages besides forward xrefs (inline `${VAR}` escaped as passthrough to avoid attribute warnings). Verified against docker/docs (Compose history/precedence/hooks/watch incl. `sync+exec`, Hub pull limits 100/200 per 6 h, automated builds removal 2027-04-01) and the CNCF Distribution docs. The Docker Java guide sub-pages are now one page (`guides/java/`), linked directly.

- [x] Task 14. `compose-fundamentals.adoc` — "Docker Compose Fundamentals"
  - [x] Task 14.1. Compose and the Compose Specification: the `docker compose` plugin (v2; v5 = v2 + Go SDK) vs. the
        retired Python `docker-compose` v1; file formats 1/2.x/3.x merged into the Specification; `compose.yaml` naming
        and lookup order; `version:` ignored.
  - [x] Task 14.2. Application model (project, services, networks, volumes, configs, secrets); service essentials
        (`image`/`build`, `ports`, `environment`/`env_file`, `volumes`, `networks`, `depends_on` with
        `condition: service_healthy`, `healthcheck`, `restart`, `command`/`entrypoint`, `deploy.resources`,
        `profiles`).
  - [x] Task 14.3. CLI (`up -d --build`, `down -v`, `ps`, `logs -f`, `exec`, `run --rm`, `config`, `watch`); project
        names; interpolation (`.env`, precedence, `${VAR:-default}`); startup order and readiness; a first
        `compose.yaml` (web app + PostgreSQL); _Learning Docker_ ch. 8 file rewritten to the Specification.
  - [x] Task 14.4. 📊 `docker-compose-application-model.svg`; 📊 mermaid `up` ordering with `depends_on` conditions.
  - [x] Task 14.5. `== References`: `compose/intro/`, `compose/intro/history/`, `compose/gettingstarted/`,
        `compose/how-tos/startup-order/`, `compose/how-tos/environment-variables/`, `reference/compose-file/`,
        `reference/cli/docker/compose/`, the compose-spec repo.

- [x] Task 15. `compose-in-practice.adoc` — "Compose in Practice"
  - [x] Task 15.1. Multiple files (`-f` merge rules, `extends`, `include`), profiles, Compose Watch (`develop.watch`:
        `sync`, `rebuild`, `sync+restart`), lifecycle hooks, init containers.
  - [x] Task 15.2. Secrets (file-based, why not `environment:`), configs, provider services, GPU, `models:` and Compose
        Bridge with one example each; Compose apps as OCI artifacts; Compose in production; the trust model.
  - [x] Task 15.3. 📊 mermaid Watch sync/rebuild decision; 📊 `docker-compose-merge.svg` (base + override + profile).
  - [x] Task 15.4. `== References`: every `compose/how-tos/*` page used, `compose/bridge/`, `compose/trust-model/`.

- [x] Task 16. `registries-and-docker-hub.adoc` — "Registries and Docker Hub"
  - [x] Task 16.1. OCI distribution API (blobs, manifests, pull by tag vs. digest); Docker Hub (repositories, tags,
        immutable tags, Official Images, Verified Publishers, access tokens, `docker login`, pull usage/rate limits and
        avoiding them in CI — authenticated pulls, mirrors, GHCR).
  - [x] Task 16.2. Pushing (`tag` + `push`, multi-platform via Buildx); GHCR, ECR, Artifact Registry, ACR (OIDC named);
        a private registry with CNCF Distribution (TLS, auth, pull-through cache); OCI artifacts; webhooks; autobuilds
        legacy; Python `docker-registry` historical.
  - [x] Task 16.3. 📊 `docker-registry-push-pull.svg`; 📊 mermaid CI pulling via a mirror.
  - [x] Task 16.4. `== References`: `docker-hub/quickstart/`, `docker-hub/repos/`, `docker-hub/usage/pulls/`,
        `security/access-tokens/`, `docker-hub/repos/manage/builds/migrate/`, distribution.github.io/distribution/,
        OCI distribution-spec, docs.github.com "Working with the Container registry".

- [x] Task 17. `security.adoc` — "Docker Security"
  - [x] Task 17.1. Threat model (daemon root, socket root, images are code); protecting the socket and remote access
        (TLS, SSH contexts); rootless mode; `userns-remap`; non-root inside the container.
  - [x] Task 17.2. Capabilities (`--cap-drop=ALL --cap-add`), seccomp, AppArmor/SELinux, `--read-only`/`--tmpfs`,
        `no-new-privileges`, `--privileged` and devices, resource limits as DoS guard, build/run-time secrets, image
        hygiene (`xref:` Task 8), Enhanced Container Isolation named, CIS Docker Benchmark, "security non-events".
  - [x] Task 17.3. The two books' checklists consolidated into one table with the official page per row; Content Trust
        historical.
  - [x] Task 17.4. 📊 `docker-isolation-layers.svg`; 📊 mermaid build-time vs. run-time secret paths.
  - [x] Task 17.5. `== References`: `engine/security/`, `engine/security/rootless/`, `engine/security/userns-remap/`,
        `engine/security/seccomp/`, `engine/security/apparmor/`, `engine/security/protect-access/`,
        `engine/security/non-events/`, `compose/how-tos/use-secrets/`.

- [x] Task 18. `orchestration-swarm-and-kubernetes.adoc` — "Orchestration: Swarm Mode and Kubernetes"
  - [x] Task 18.1. When one host is not enough; Swarm mode summary (nodes, managers/Raft, services/tasks,
        `docker stack deploy`, rolling updates, routing mesh, secrets/configs, overlay networks) with an honest note on
        its position today.
  - [x] Task 18.2. Kubernetes as the default (Desktop's cluster, Compose Bridge, what changes) pointing to
        `xref:backend/quarkus/kubernetes-and-openshift.adoc`; Twelve-Factor recap linking
        `xref:backend/architecture/decisions-and-migrations/index.adoc`; 2015 Swarm/Centurion/ECS historical.
  - [x] Task 18.3. 📊 `docker-swarm-routing-mesh.svg`; 📊 mermaid single host → Compose → Swarm/Kubernetes decision.
  - [x] Task 18.4. `== References`: `engine/swarm/`, `engine/swarm/key-concepts/`, `engine/swarm/ingress/`,
        `engine/swarm/stack-deploy/`, `desktop/features/kubernetes/`, `compose/bridge/`, 12factor.net.

### Group 6 — Java/Spring Boot I: images, Compose for local dev, Testcontainers fundamentals (Parallelizable: yes — three distinct pages)

> Done: `java-and-spring-boot-images.adoc`, `compose-for-local-development.adoc`, `testcontainers-fundamentals.adoc`; figures `docker-spring-boot-layered-jar.svg`, `docker-local-dev-laptop.svg`, `docker-testcontainers-ryuk.svg` + 3 Mermaid blocks (20 total, all parse). Build clean apart from forward xrefs. Verified against the Spring Boot 4.1.x sources (`extract --layers --destination`, `DockerComposeProperties` defaults incl. `skip.in-tests=true`, the service-connection tables -- Kafka has no Docker Compose service connection, so the local profile sets `spring.kafka.bootstrap-servers`), the Testcontainers 2.0.5 source (module packages, `ComposeContainer` constructors -- `withLocalCompose` no longer exists, no JUnit 4 in core; Testcontainers does not read Docker contexts, `getting-started.adoc` corrected accordingly) and the Temurin JRE Dockerfile (no curl/wget, so the HEALTHCHECK example installs curl).

Deliberately thin on anything the SpringBoot, Hibernate, Messaging and Quarkus sections already cover — `xref:` it.

- [x] Task 19. `java-and-spring-boot-images.adoc` — "Java and Spring Boot Images"
  - [x] Task 19.1. Path 1, multi-stage Dockerfile: `eclipse-temurin:25-jdk` + Maven wrapper +
        `RUN --mount=type=cache,target=/root/.m2`; `java -Djarmode=tools -jar app.jar extract --layers --launcher`
        (verify the exact 4.1 flags against `reference/packaging/container-images/efficient-images.html`) into
        dependencies / spring-boot-loader / snapshot-dependencies / application layers; `eclipse-temurin:25-jre` (or
        DHI) runtime; non-root `USER`; `EXPOSE 8080`; `HEALTHCHECK` against `/actuator/health/readiness`;
        `ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", …]`; graceful shutdown; `STOPSIGNAL`.
  - [x] Task 19.2. Path 2, Cloud Native Buildpacks via `./mvnw spring-boot:build-image` (Paketo, `image.name`,
        `builder`, `env` for JVM options, `publish`) — the house `deploy.yml` option.
  - [x] Task 19.3. Path 3, Jib (daemonless, reproducible), cross-referenced to `xref:backend/quarkus/container-images.adoc`
        rather than repeated; `docker init` for Java; `.dockerignore` for Maven; native images pointer only.
  - [x] Task 19.4. 📊 `docker-spring-boot-layered-jar.svg` (layered vs. fat-jar single layer); 📊 mermaid comparing
        the three build paths.
  - [x] Task 19.5. `== References`: Spring Boot `reference/packaging/container-images/*`,
        `maven-plugin/build-image.html`, buildpacks.io, paketo.io, the Jib repo, `guides/java/containerize/`,
        `reference/cli/docker/init/`, `dhi/migration/examples/java/`, hub.docker.com/_/eclipse-temurin.

- [x] Task 20. `compose-for-local-development.adoc` — "Compose for Local Development"
  - [x] Task 20.1. The house root `compose.yaml` for a Spring Boot service (one pinned service per backing technology,
        each with `healthcheck`, named volumes, an `observability` profile for Prometheus/Grafana, a WireMock mock),
        matching `iru-setup-java-springboot-testcontainers` Step 1; credentials labelled development-only.
  - [x] Task 20.2. App on the host vs. inside Compose (a `develop.watch` service built from the Dockerfile's build
        stage, JDWP 5005).
  - [x] Task 20.3. Spring Boot's Docker Compose support in full — the **single** place `spring.docker.compose.*` is
        documented: `spring-boot-docker-compose` as `optional`; `enabled`, `file`, `lifecycle-management`,
        `start.command`, `stop.command`, `skip.in-tests` (verify its 4.1 default), `readiness.*`, `profiles.active`,
        `arguments`; service connections for supported images; `org.springframework.boot.service-connection`,
        `.ignore`, `.readiness-check.*` labels; SSL bundles via labels; this stack is the one the ITs start.
  - [x] Task 20.4. From the intro, `xref:backend/messaging/spring-boot-testing-messaging.adoc` for broker-specific
        Compose usage — do not repeat it.
  - [x] Task 20.5. 📊 `docker-local-dev-laptop.svg`; 📊 mermaid `SpringApplication.run` → Compose up → readiness →
        service connections → app ready.
  - [x] Task 20.6. `== References`: Spring Boot `reference/features/dev-services.html`, `how-to/docker-compose.html`,
        `guides/java/develop/`, `compose/how-tos/file-watch/`.

- [x] Task 21. `testcontainers-fundamentals.adoc` — "Testcontainers Fundamentals"
  - [x] Task 21.1. How Testcontainers uses Docker: environment discovery (`DOCKER_HOST`, socket, Desktop, contexts,
        `~/.testcontainers.properties`, `TESTCONTAINERS_*`), Ryuk.
  - [x] Task 21.2. The 2.0 artifact/package model (`org.testcontainers:testcontainers`, `testcontainers-junit-jupiter`,
        `testcontainers-<module>` with `org.testcontainers.<module>` classes, JUnit 4 removed) — verified against the
        2.0 release notes.
  - [x] Task 21.3. `GenericContainer` (`withExposedPorts`, `getHost()`/`getMappedPort()`, `withEnv`, `withCommand`,
        `withCopyFileToContainer`, `withNetwork` + aliases, `withLogConsumer`, `execInContainer`); wait strategies;
        `@Testcontainers`/`@Container`, static vs. instance, singleton pattern, manual lifecycle; `ComposeContainer`
        (`withExposedService`, `withLocalCompose`, `waitingFor`, `getServiceHost/Port`).
  - [x] Task 21.4. Module table (databases, Kafka, RabbitMQ, MongoDB, Elasticsearch, LocalStack, MinIO, Keycloak,
        WireMock, MockServer, Redis), each linked to the repository page already using it; reuse mode (local only);
        pull policies and rate limits; supported environments (Desktop, Engine, remote, Colima/Podman/Rancher caveats);
        Testcontainers Desktop/Cloud named.
  - [x] Task 21.5. 📊 `docker-testcontainers-ryuk.svg` (test JVM → Docker API → containers + Ryuk); 📊 mermaid test
        class lifecycle with a static container.
  - [x] Task 21.6. `== References`: java.testcontainers.org `quickstart/junit_5_quickstart/`, `features/*`,
        `test_framework_integration/junit_5/`, `modules/docker_compose/`, `supported_docker_environment/`, the 2.0
        release notes, `testcontainers/` on docs.docker.com.

### Group 7 — Java/Spring Boot II: integration tests and CI/CD (Parallelizable: yes — two distinct pages; both depend on Group 6's pages existing to link into)

> Done: `spring-boot-integration-tests-with-testcontainers.adoc` (worked example: `compose.yaml` with PostgreSQL + Kafka + WireMock, `AbstractIT` with a `ComposeContainer` singleton, `OrderIT`, the Failsafe block, `build.yml` -- same service names, ports and properties throughout) and `ci-cd-with-github-actions.adoc`; figures `docker-one-compose-two-stacks.svg`, `docker-github-actions-pipeline.svg` + 3 Mermaid blocks (22 total, all parse). Build: 0 messages besides forward xrefs to `index.adoc`. Verified: action inputs/outputs against each action README (majors confirmed via tags: checkout v7, setup-java v6, upload-artifact v7, configure-aws-credentials v6), Spring Boot starter-parent already binds Failsafe goals and `classesDirectory`, runner sizes (public 4 vCPU/16 GB, private 2 vCPU/8 GB), `KafkaTestUtils.getOneRecord` signature. Anchor to the Buildpacks section made explicit (`#buildpacks-build-image`) because Asciidoctor drops the colon of `spring-boot:build-image` from generated IDs.

- [x] Task 22. `spring-boot-integration-tests-with-testcontainers.adoc` — "Spring Boot Integration Tests with
      Testcontainers (Locally and in GitHub Actions)" — **the page the request singles out**
  - [x] Task 22.1. The split: Surefire `*Test` (no Docker) vs. Failsafe `*IT` (Docker), linking
        `xref:backend/springboot/maven-quality-plugins.adoc`; dependencies (`spring-boot-starter-test`,
        `spring-boot-testcontainers`, `testcontainers-junit-jupiter`, modules — versions managed by Spring Boot 4.1,
        Testcontainers 2.0.5).
  - [x] Task 22.2. The three wiring options: `@Container @ServiceConnection` static fields (link
        `xref:backend/springboot/unit-and-integration-testing.adoc`, not repeated); containers as `@Bean`s in a
        `@TestConfiguration` (recommended — context caching reuses containers); `@DynamicPropertySource` /
        `DynamicPropertyRegistrar`; the connection-details table; `@ImportTestcontainers`.
  - [x] Task 22.3. The house shared-`compose.yaml` harness exactly as in `iru-setup-java-springboot-testcontainers`:
        `AbstractIT` with `ComposeContainer` started once, `withExposedService(...)` + real wait strategies, mapped
        ports via `@DynamicPropertySource`, `spring.docker.compose.skip.in-tests=true`, the module-relative
        `compose.yaml` path pitfall; WireMock/Microcks for downstream APIs; Testcontainers at development time
        (`SpringApplication.from(...).with(...)`, `@RestartScope`, `spring-boot:test-run`).
  - [x] Task 22.4. **Running locally**: Docker running, `mvn verify` vs. `mvn test`, `-DskipITs`, reuse mode,
        troubleshooting (Ryuk on restricted sockets, Colima/Podman `DOCKER_HOST` / `TESTCONTAINERS_HOST_OVERRIDE`,
        Apple silicon and `linux/amd64`-only images).
  - [x] Task 22.5. **Running in GitHub Actions**: the house `build.yml` shape (`ubuntu-latest` ships Docker and
        Compose, `actions/checkout@v7`, `actions/setup-java@v6` with `distribution: temurin`, `java-version: 25`,
        `cache: maven`, `mvn -B -ntp clean verify`, upload `**/target/failsafe-reports/**` on failure); Docker Hub rate
        limits (`docker/login-action@v4` with a PAT, or GHCR/a mirror); `services:` job containers and why they are
        worse here (fixed ports, no wait strategies, no Compose parity); `container:` jobs and DinD caveats;
        Testcontainers Cloud / larger runners; timeouts and parallelism (`-T`, Failsafe `forkCount`); brokers via
        `xref:backend/messaging/spring-boot-testing-messaging.adoc`.
  - [x] Task 22.6. A complete worked example: `compose.yaml` (PostgreSQL + Kafka + WireMock), `AbstractIT`, `OrderIT`,
        the Failsafe `pom.xml` block, `.github/workflows/build.yml` — internally consistent (same service names, ports,
        property names across all five snippets).
  - [x] Task 22.7. 📊 `docker-one-compose-two-stacks.svg` (local via `spring-boot-docker-compose` vs. Failsafe via
        `ComposeContainer`, one `compose.yaml`); 📊 mermaid GitHub Actions job: checkout → setup-java → mvn verify →
        Testcontainers pulls/starts → tests → reports.
  - [x] Task 22.8. `== References`: Spring Boot `reference/testing/testcontainers.html`,
        `reference/features/dev-services.html`, java.testcontainers.org `modules/docker_compose/` and
        `supported_docker_environment/continuous_integration/`, `image_registry_rate_limiting/`, `guides/java/run-tests/`,
        `guides/testcontainers-java-*` used, docs.github.com "About service containers", actions/runner-images,
        actions/checkout, actions/setup-java, docker/login-action.

- [x] Task 23. `ci-cd-with-github-actions.adoc` — "Docker CI/CD with GitHub Actions"
  - [x] Task 23.1. `setup-qemu-action@v4` + `setup-buildx-action@v4`; `login-action@v4` (GHCR with `GITHUB_TOKEN` +
        `packages: write`, Hub PAT, cloud OIDC); `metadata-action@v6` (branch/tag/semver/sha tags, OCI labels);
        `build-push-action@v7` (`context`, `file`, `platforms`, `push`, `load`, `tags`, `labels`,
        `cache-from`/`cache-to: type=gha`, `secrets`, `provenance`/`sbom`) — inputs verified against each action's
        README.
  - [x] Task 23.2. Test-before-push, sharing an image between jobs, multi-platform, `bake-action@v7`,
        `scout-action@v1` CVE gate, `setup-docker-action@v5` / `setup-compose-action@v2`, GitHub Builder named.
  - [x] Task 23.3. The house `deploy.yml` variant (`spring-boot:build-image` + `docker.publishRegistry.*`, OIDC) as in
        `iru-setup-java-springboot-github-workflows` Step 2; immutable tags and `latest`; a full workflow example.
  - [x] Task 23.4. 📊 `docker-github-actions-pipeline.svg`; 📊 mermaid of the tags `metadata-action` produces for a
        push, a release tag and a PR.
  - [x] Task 23.5. `== References`: `build/ci/github-actions/` and sub-pages used, each `docker/*` action repo,
        docs.github.com "Publishing Docker images", "Working with the Container registry", `scout/integrations/ci/gha/`.

### Group 8 — Landing page and cheat-sheet page (Parallelizable: yes — two distinct files; both need every earlier page's final title/path)

- [ ] Task 24. `index.adoc` — "Docker" landing page
  - [ ] Task 24.1. One paragraph on what Docker is; the version baseline in prose (not an admonition); "new here? read
        in this order" (getting started → architecture → images → Dockerfile → running containers → storage and
        networking → Compose → the Java/Spring Boot pages).
  - [ ] Task 24.2. "What's covered" grouped as the issue's outline (Foundations; Building images; Running containers;
        Compose; Registries and distribution; Security; Orchestration and beyond; Docker in the Java and Spring Boot
        development loop; Other framework bindings — the three Quarkus xrefs; Reference — the cheat sheet), each bullet
        a one-line `xref:` + description. Verify all 21 filenames with `ls` before writing xrefs.
  - [ ] Task 24.3. Relationship to the SpringBoot, Hibernate, Messaging, Quarkus and Prometheus references (one short
        paragraph each, like `messaging/index.adoc`).
  - [ ] Task 24.4. `== Bibliography` (anchor `_bibliography`) with the seven groups from the issue's "Bibliography"
        section, every source linked; both 2015 books with full citation, ISBN, publisher link and superseded-material
        call-out; closing note that official docs win on any discrepancy. Re-wrap so no physical line starts with a
        bare `<number>.` token.
  - [ ] Task 24.5. `include::partial$docker-disclaimer.adoc[]` right after `:keywords:`.

- [ ] Task 25. `cheat-sheet.adoc` — "Docker Cheat Sheet"
  - [ ] Task 25.1. Short page listing what the sheet covers, cross-referencing all 21 topic pages grouped like
        `index.adoc`.
  - [ ] Task 25.2. `== Download` with `xref:attachment$docker-cheat-sheet.pdf[Download the Docker Cheat Sheet (PDF)]`,
        matching `messaging/cheat-sheet.adoc`'s structure (the PDF lands in Group 9).

### Group 9 — Cheat-sheet PDF (Parallelizable: yes)

- [ ] Task 26. Produce `modules/ROOT/attachments/docker-cheat-sheet.pdf`
  - [ ] Task 26.1. Inspect `messaging-cheat-sheet.pdf` / `springboot-cheat-sheet.pdf` (PyMuPDF or `pdftotext`) to match
        palette, fonts, colour-coded bordered boxes, header line and breadcrumb footer
        ("Guides & References › Backend Development › Docker").
  - [ ] Task 26.2. Write a scratch HTML/CSS layout **in the session scratchpad, not the repository**: architecture
        one-liners; image commands; Dockerfile instruction table (`CMD`/`ENTRYPOINT` forms, `RUN --mount` types);
        multi-stage skeleton; `docker run` option groups; lifecycle commands; volume/bind/tmpfs syntax; networking
        one-liners; Compose skeleton + CLI; Buildx essentials (`--platform`, `--cache-to type=gha`,
        `--sbom --provenance`, `bake`); security checklist; clean-up commands; Spring Boot mapping
        (`spring-boot:build-image`, `jarmode=tools extract --layers`, `spring-boot-docker-compose`,
        `spring-boot-testcontainers` + `@ServiceConnection`, `ComposeContainer`, Surefire `*Test` vs. Failsafe `*IT`);
        GitHub Actions skeleton (`setup-buildx` → `login` → `metadata` → `build-push`). Content drawn from the actual
        pages written in Groups 2-7 for consistency.
  - [ ] Task 26.3. Render with headless Chromium (`/opt/pw-browsers` Playwright Chromium, or `--headless
        --print-to-pdf`), A4 portrait; verify exactly one page of ~595×842 pt; fix overflow by layout (flex columns,
        `table-layout:fixed`, `<wbr>`), never by dropping content silently. Commit only the PDF.

### Group 10 — Site wiring (Parallelizable: yes — four distinct files)

- [ ] Task 27. `modules/ROOT/nav.adoc` — insert `*** xref:backend/docker/index.adoc[Docker]` after line 800 (the
      Architecture cheat-sheet entry) and before `** xref:apps/index.adoc[Apps]`, with `****` children for all 21 topic
      pages + `cheat-sheet.adoc` (`[Cheat Sheet (PDF)]`), in `index.adoc`'s "What's covered" order. Do not duplicate
      the Quarkus pages.
- [ ] Task 28. `modules/ROOT/pages/backend/index.adoc`
  - [ ] Task 28.1. Add a `* xref:backend/docker/index.adoc[Docker] -- …` bullet after the Architecture bullet and its
        sub-bullets, styled like the Messaging bullet (one clause per sub-area: platform and architecture, images and
        builds, running containers, Compose, security, Spring Boot/Testcontainers/GitHub Actions, cheat sheet).
  - [ ] Task 28.2. Add "Docker" to `:description:`'s section list and append
        `Docker, containers, Dockerfile, Docker Compose, BuildKit, Buildx, OCI, Testcontainers, container images,
        GitHub Actions` to `:keywords:`.
- [ ] Task 29. `modules/ROOT/pages/backend/springboot/index.adoc` — add one sentence/bullet pointing to
      `xref:backend/docker/index.adoc[Docker]` (images, local Compose, Testcontainers integration tests) and add
      `Docker, Testcontainers, Docker Compose` to `:keywords:` where missing.
- [ ] Task 30. `modules/ROOT/pages/index.adoc` — append
      `Docker, containers, Dockerfile, Docker Compose, BuildKit, OCI, Testcontainers, container images` to the root
      `:keywords:` (skip any term already present).

### Group 11 — Reciprocal cross-links in existing pages (Parallelizable: yes — every task edits a distinct file)

One sentence or clause per link; no restructuring; no admonitions added.

- [ ] Task 31. `backend/springboot/unit-and-integration-testing.adoc` — from its Testcontainers section, link
      `xref:backend/docker/testcontainers-fundamentals.adoc` and
      `xref:backend/docker/spring-boot-integration-tests-with-testcontainers.adoc`.
- [ ] Task 32. `backend/springboot/maven-quality-plugins.adoc` — from its Failsafe section, the same two links.
- [ ] Task 33. `backend/messaging/spring-boot-testing-messaging.adoc` — from the Docker Compose support subsection
      (~line 122), link `xref:backend/docker/compose-for-local-development.adoc`.
- [ ] Task 34. `backend/hibernate/integration-testing.adoc` — from the intro, link
      `xref:backend/docker/testcontainers-fundamentals.adoc`.
- [ ] Task 35. `backend/hibernate/hibernate-search-integration-testing.adoc` — from the intro, the same link.
- [ ] Task 36. `backend/quarkus/container-images.adoc` — from the intro, link
      `xref:backend/docker/java-and-spring-boot-images.adoc` and
      `xref:backend/docker/build-cache-and-multi-stage-builds.adoc`.
- [ ] Task 37. `backend/quarkus/developer-experience.adoc` — from the Dev Services section, link
      `xref:backend/docker/testcontainers-fundamentals.adoc`.
- [ ] Task 38. `database/prometheus/containers-and-kubernetes-monitoring.adoc` — link
      `xref:backend/docker/resources-logging-and-monitoring.adoc`.
- [ ] Task 39. Optional inbound links (issue: "optional") — one clause beside the existing `docker run` / Compose
      one-liner in `database/{couchbase,elasticsearch,mongodb,neo4j,prometheus,qdrant,solr}/getting-started.adoc` and
      `backend/messaging/getting-started.adoc`, linking `xref:backend/docker/running-containers.adoc` (or
      `compose-fundamentals.adoc` where the snippet is Compose). Skip a page if it has no such snippet.

### Group 12 — Validation, build and acceptance audit (Parallelizable: no — verifies the output of every prior group)

- [ ] Task 40. Mermaid validation — `npm i --no-save mermaid@11 jsdom` then `npm run validate:mermaid`; fix every
      failing block.
- [ ] Task 41. Antora build — `npx antora antora-playbook.yml` completes with zero `xref`/AsciiDoc errors and
      warnings; `build/site/backend/docker/*.html` has 23 pages; the section appears in the nav under Backend
      Development and in `build/site/search-index.js`.
- [ ] Task 42. Acceptance audit against the issue's criteria
  - [ ] Task 42.1. `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]|^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):'
        modules/ROOT/pages/backend/docker/` returns nothing; every page has `:description:`, `:keywords:`, the
        disclaimer include and `== References`.
  - [ ] Task 42.2. Every `image::docker-*.svg` resolves to a file and every `modules/ROOT/images/docker-*.svg` is
        referenced; no alt text contains a comma.
  - [ ] Task 42.3. `grep -rn 'org.testcontainers:\(postgresql\|kafka\|junit-jupiter\|mongodb\)\b\|org.testcontainers.containers.\(PostgreSQL\|Kafka\)'
        modules/ROOT/pages/backend/docker/` finds no 1.x names; `grep -rn '^version:'` inside Compose snippets finds
        nothing; superseded terms (`MAINTAINER`, `--link`, `--volumes-from`, `docker-compose `, `nsenter`,
        `Content Trust`) appear only in historical context.
  - [ ] Task 42.4. `docker-cheat-sheet.pdf` is one A4 page and `cheat-sheet.html`'s download link resolves to
        `_attachments/docker-cheat-sheet.pdf`.
  - [ ] Task 42.5. All reciprocal links from Group 11 resolve (covered by a clean build).

Delegate Tasks 40-41 to the `iru-gate-runner` agent so build output stays out of the main context:

```
Agent({
  description: "Validate Mermaid and build the Antora site",
  subagent_type: "iru-gate-runner",
  prompt: "In the repository root, run `npm i --no-save mermaid@11 jsdom`, then `npm run validate:mermaid`, then
    `npx antora antora-playbook.yml`. Report: whether Mermaid validation passed (file:line of each failure if not),
    whether the Antora build had zero errors/warnings (exact text of each if not), and how many
    build/site/backend/docker/*.html pages exist. Summarize pass/fail only; do not dump the log."
})
```

Follow-up to report (out of scope for this issue): `.claude/skills/iru-setup-java-springboot-github-workflows/SKILL.md`
pins `actions/checkout@v5` / `actions/setup-java@v5`, behind the `@v7` / `@v6` majors the new CI pages document.
