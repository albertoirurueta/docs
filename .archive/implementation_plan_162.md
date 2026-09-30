# Implementation Plan: Guides & References / Backend Development — Kubernetes

## Task summary

Source: GitHub issue #162
Base branch: main

Issue [#162](https://github.com/albertoirurueta/docs/issues/162) asks for a new **Kubernetes** section under
*Guides & References → Backend Development*, placed right after Docker. It is a practical guide to learning and using
Kubernetes, and it is authored directly into this repo's own `ROOT` Antora component.

The section is built from the official Kubernetes documentation (kubernetes.io Concepts / Tasks / Tutorials /
Reference, release notes and blog, plus the Gateway API, Helm, Kustomize, kind, minikube and kubeadm docs). It is
cross-checked against two requester-provided O'Reilly books, which are **not** committed:

* Rensin, *Kubernetes: Scheduling the Future at Cloud Scale*, 2015
* a 5-chapter sampler of Hightower / Burns / Beda, *Kubernetes: Up and Running*, 1st ed., 2017

The issue body is the specification. It gives the page outline, the conventions, the version baseline, the "book era
→ current" tables, the existing-pages table and the acceptance criteria. The issue comment **"Addendum: concepts
contributed by each book"** is also part of the specification: it maps every book chapter's concepts to the page that
covers them.

Deliverables:

1. **40 AsciiDoc pages** under `modules/ROOT/pages/backend/kubernetes/`: `index.adoc` (with `== Bibliography`) plus 39 concept pages.
   * Every page has detailed prose linked to kubernetes.io.
   * Every page has `kubectl` / `helm` / `kind` commands and YAML manifests. Each example is followed by a `Source:` link to its official page.
   * Every page has Mermaid and/or `kubernetes-*.svg` figures, and a `== References` section.
2. **`cheat-sheet.adoc`**, plus a one-page A4 **`modules/ROOT/attachments/kubernetes-cheat-sheet.pdf`**.
3. **`modules/ROOT/partials/kubernetes-disclaimer.adoc`**, included on every page.
4. **Site wiring:** nav entry after Docker; bullet and metadata in `backend/index.adoc`; root `index.adoc` metadata.
5. **One-line back-links** from six existing pages.

**Choices made on the user's behalf** (from codebase conventions; nothing in the issue was ambiguous enough to ask):

* **Version baseline.** Write against Kubernetes **1.37** (1.37.1), kubectl 1.37, kind 0.33 (`kindest/node:v1.37.0`), minikube 1.39, Helm 4.3, Kustomize 5.8 and Gateway API 1.6. **Re-verify each version before writing** (1.38 is due 2026-12-16), and state it in each page's intro.
* **Running scenario.** Every example deploys the *Bookshelf* app on **kind**:
  * `catalog-api`, `reviews-api` and `web` Deployments
  * PostgreSQL as a StatefulSet, and Redis
  * a `notifier` Job, CronJob and worker

  Container images are neutral placeholders such as `ghcr.io/example/bookshelf-catalog-api:1.0.0` and
  `postgres:18`, so there is no dependency on real published images.
* **Admonitions.** Following the Docker precedent (#158), the disclaimer partial is the **only** admonition in the section. Deprecations and "the book is outdated" remarks are prose or table rows, which keeps the section consistent with its closest sibling.
* **Official-docs access.** If kubernetes.io is blocked by the session egress policy, read the same content from the `kubernetes/website` GitHub repo (`content/en/docs/...`), as the Docker plan did for docs.docker.com. `Source:` links still point to the kubernetes.io URLs.
* **Figure naming.** Figures are `modules/ROOT/images/kubernetes-<topic>.svg`. They are original drawings in the existing SVG style (compare `docker-architecture-stack.svg`), with no Kubernetes logo and no copied docs images.

## Current code state

* **Repository shape.** This repo is the Antora playbook plus the root component (`antora.yml`: `name: ROOT`, `title: Irurueta Docs`).
  * Content: `modules/ROOT/pages/`
  * Nav: `modules/ROOT/nav.adoc`
  * Partials, images, PDFs: `modules/ROOT/partials/`, `modules/ROOT/images/`, `modules/ROOT/attachments/`
  * Mermaid is validated by `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`, which needs `mermaid@11` and `jsdom` installed with `--no-save`).
  * The site builds with `npx antora antora-playbook.yml`.
* **Backend Development nav.** In `modules/ROOT/nav.adoc`, `** xref:backend/index.adoc[Backend Development]` (≈line 574) is followed by the Java partial, then Hibernate, …, Architecture (≈line 821) and **Docker** (≈line 852), whose last child is `**** xref:backend/docker/cheat-sheet.adoc[Cheat Sheet (PDF)]`. The Kubernetes block goes immediately after that line. Confirm the exact line with `grep -n "backend/docker/cheat-sheet" modules/ROOT/nav.adoc`.
* **Closest precedent.** The Docker section (`backend/docker/`, 22 topic pages + index + cheat sheet), built from `.archive/implementation_plan_158.md`.
  * `partials/docker-disclaimer.adoc`: a single `[IMPORTANT]` block with the AI-assistance sentence and `xref:backend/docker/index.adoc#_bibliography[the section bibliography]`
  * `backend/docker/cheat-sheet.adoc`: an intro, grouped `*Group* --` xref paragraphs, and the `xref:attachment$docker-cheat-sheet.pdf[…]` download line
  * `attachments/docker-cheat-sheet.pdf`: one A4 page, rendered from scratch HTML with headless Chromium
* **`backend/index.adoc`** has a `:description:` listing every subsection, a long `:keywords:` list, and one `* xref:…[…] -- …` bullet per section. The Docker bullet is the last one.
* **Existing Kubernetes-adjacent pages.** The new section links to these rather than repeating them, and each gets a back-link.
  * `backend/docker/orchestration-swarm-and-kubernetes.adoc`: its `== Kubernetes` section (≈line 91) says Kubernetes is out of scope beyond a pointer.
  * `cloud/azure/aks-clusters.adoc`, `cloud/azure/aks-microservices.adoc`: AKS specifics, Gateway API on AKS, workload identity, KEDA, Istio add-on.
  * `backend/quarkus/kubernetes-and-openshift.adoc`: the Quarkus Kubernetes extension, OpenShift, Fabric8, Operator SDK.
  * `backend/springboot/configuration-and-profiles.adoc` `=== Kubernetes ConfigMaps and Secrets` (≈line 447), and `backend/springboot/metrics-and-observability.adoc` (Actuator liveness/readiness).
  * `database/prometheus/containers-and-kubernetes-monitoring.adoc`: cAdvisor, `kubernetes_sd_configs`, kube-state-metrics.
  * Also linked (no back-link required): `database/redis/redis-software-cloud-kubernetes-and-valkey.adoc`, `web/aspnet/core/aspire-and-cloud-native.adoc`, `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc`, `backend/docker/ci-cd-with-github-actions.adoc`, `backend/docker/registries-and-docker-hub.adoc`, `backend/docker/image-best-practices-and-security.adoc`.
* **No existing Kubernetes pages to collide with.** No `backend/kubernetes/`, `kubernetes-disclaimer.adoc`, `kubernetes-*.svg` or `kubernetes-cheat-sheet.pdf` exists yet.
* **Prose-only references.** Issues #163 (AWS/EKS), #164 (GCP/GKE), #199 (FastAPI), #184, #171 and #201 have no pages yet. They are mentioned in prose only, never with `xref:`.

## Implementation steps

**Conventions for every page task below** (from the issue's "Page conventions"):
* The header is `= Title`, `:description:`, `:keywords:`, then `include::partial$kubernetes-disclaimer.adoc[]`.
* The intro gives the version baseline and the page's place in the reading path.
* Explanations are detailed: what the concept is and why it exists, which component or controller does the work, every relevant field, the `kubectl` commands, pitfalls, and interactions with neighbouring concepts.
* Examples are complete: `[source,yaml]` manifests with current `apiVersion`s, and `[source,bash]` commands with abbreviated `[source,text]` output. Each example is followed by `Source: https://kubernetes.io/docs/…[Title]`.
* Pages touched by a book add a short prose "where the book is outdated" passage, using the issue's tables.
* Pages end with `== References`, listing only the official pages used (plus the book's O'Reilly page if drawn on).
* Examples contain no real secrets, tokens or kubeconfigs.
* The addendum comment's "Covered by" column says which book concepts each page must cover. Tick them off in the Group 15 audit.
* No physical line may start with a bare `<number>.` token (AsciiDoc would render it as a list). Re-wrap if needed.
* Every page task is docs-only, so no tests, coverage or quality tooling applies. Group validation is a Mermaid parse of the new blocks, plus an Antora build in which forward xrefs to later-group pages are the only permitted warnings until Group 15.

### Group 1 — Disclaimer partial (Parallelizable: yes)

This group must land first, because every page includes the partial.

- [x] Task 1. Create `modules/ROOT/partials/kubernetes-disclaimer.adoc` — created, word-for-word copy of
      `docker-disclaimer.adoc` with only the xref target changed; docs-only file, no tests/coverage/quality
      tooling applies.
  - [x] Task 1.1. Copy `docker-disclaimer.adoc` word for word, changing only the xref target to
        `xref:backend/kubernetes/index.adoc#_bibliography[the section bibliography]`.

### Group 2 — Foundations (Parallelizable: yes — four distinct pages with distinct figures)

- [x] Task 2. `introduction-and-architecture.adoc` — "Introduction and Architecture" — created (`modules/ROOT/pages/backend/kubernetes/introduction-and-architecture.adoc`), plus `modules/ROOT/images/kubernetes-cluster-architecture.svg`; detect-secrets clean, Mermaid blocks parse, Antora build has only expected forward-xref errors.
  - [x] Task 2.1. Why orchestration exists: scheduling, self-healing, scaling and designing for failure (Book 1 ch. 1–2, Book 2 ch. 1). The Borg/Omega lineage. Velocity, immutable infrastructure, declarative configuration and reconciliation loops. Separation of concerns between app, cluster and OS operators. When *not* to use Kubernetes. Kubernetes vs Compose/Swarm (link `backend/docker/orchestration-swarm-and-kubernetes.adoc` and `compose-in-practice.adoc`).
  - [x] Task 2.2. Control-plane components (kube-apiserver, etcd, kube-scheduler, kube-controller-manager, cloud-controller-manager). Node components (kubelet, kube-proxy, runtime via CRI). Addons (CoreDNS, CNI). Node ↔ control-plane communication, leases, controllers. The Book 1 "minion" and "cAdvisor daemon" terms, and dockershim, as history.
  - [x] Task 2.3. 📊 `kubernetes-cluster-architecture.svg`. 📊 Mermaid `sequenceDiagram` of `kubectl apply` → API server → etcd → scheduler → kubelet → runtime. 📊 Mermaid flowchart of a reconciliation loop (observe → diff → act).
  - [x] Task 2.4. `== References`: `concepts/overview/`, `concepts/overview/components/`, `concepts/architecture/` and its sub-pages (nodes, control-plane-node-communication, controllers, leases, cri), both books' O'Reilly pages.
- [x] Task 3. `getting-started.adoc` — "Getting Started with Kubernetes" — created; detect-secrets clean, Mermaid block parses, Antora build has only expected forward-xref errors. `Derived from` lines following code examples were tightened to explicit `Source:` links per the plan's page conventions.
  - [x] Task 3.1. Installing kubectl (Homebrew / `pkgs.k8s.io` apt/yum repos / binary), and the ±1 version-skew rule.
  - [x] Task 3.2. Local clusters. **kind**, including a multi-node `kind-config.yaml` with an ingress-ready port mapping that later Gateway pages reuse. minikube. Docker Desktop. A comparison table of the three.
  - [x] Task 3.3. Kubeconfig contexts, `kubectl config get-contexts|use-context|set-context --current --namespace`.
  - [x] Task 3.4. The first *Bookshelf* deploy, following the Kubernetes Basics tutorial flow: `create deployment`, `get`, `expose`, `port-forward`, `scale`, `set image`, `rollout status`, `delete`. Shell completion.
  - [x] Task 3.5. 📊 Mermaid of the local dev loop (build image → `kind load docker-image` → apply → port-forward).
  - [x] Task 3.6. `== References`: `tasks/tools/`, `tutorials/kubernetes-basics/`, `tutorials/hello-minikube/`, `releases/version-skew-policy/`, kind quick start, minikube start, the `pkgs.k8s.io` blog post.
- [x] Task 4. `kubectl-essentials.adoc` — "kubectl Essentials" — created; detect-secrets clean, Antora build has only expected forward-xref errors; already used `Source:` links per convention.
  - [x] Task 4.1. Command structure. The three object-management techniques (imperative commands, imperative object config, declarative `apply`) with a table.
  - [x] Task 4.2. `get` / `describe` / `explain` (`--recursive`). Output formats: `-o wide|yaml|json|name|jsonpath|custom-columns|go-template`. `-l`, `--field-selector`, `--watch`, `--sort-by`, `-A`.
  - [x] Task 4.3. `logs` (`-f -p -c --since --tail -l`), `exec -it … --`, `cp`, `port-forward`, `proxy`, `top`, `events`, `wait`.
  - [x] Task 4.4. Generating manifests with `--dry-run=client -o yaml`. `diff`. **Server-side apply** and field managers, and conflicts. `--prune` with an applyset. `edit`, `patch` (strategic / merge / JSON), `label`, `annotate`.
  - [x] Task 4.5. `api-resources`, `api-versions`, `auth can-i`, `auth whoami`. Plugins and krew. The "kubectl for Docker users" mapping table. The Book 2 `kubectl run` / `-a` / `exec` without `--` corrections.
  - [x] Task 4.6. `== References`: `reference/kubectl/`, `reference/kubectl/quick-reference/`, `reference/kubectl/jsonpath/`, `reference/kubectl/docker-cli-to-kubectl/`, `concepts/overview/working-with-objects/object-management/`, `reference/using-api/server-side-apply/`, `tasks/extend-kubectl/kubectl-plugins/`, krew.
- [x] Task 5. `objects-and-the-api.adoc` — "Objects and the Kubernetes API" — created; detect-secrets clean, Mermaid block parses, Antora build has only expected forward-xref errors; already used `Source:` links per convention.
  - [x] Task 5.1. The object model (`apiVersion`, `kind`, `metadata`, `spec`, `status`). API groups and versions. The deprecation policy and the deprecated API migration guide. API discovery. Watching the API through `kubectl proxy` + `curl`. `resourceVersion` and optimistic concurrency.
  - [x] Task 5.2. Names and UIDs, and **namespaces** (when to use them; namespaced vs cluster-scoped). **Labels and selectors**: syntax and limits, equality- and set-based (Book 1 ch. 3), and the recommended `app.kubernetes.io/*` labels used across all *Bookshelf* manifests. **Annotations** (the Book 1 use cases). Field selectors.
  - [x] Task 5.3. Owner references and garbage collection (`--cascade=foreground|background|orphan`). Finalizers.
  - [x] Task 5.4. 📊 Mermaid of Deployment → ReplicaSet → Pod owner references.
  - [x] Task 5.5. `== References`: `concepts/overview/working-with-objects/` and its sub-pages (names, namespaces, labels, annotations, field-selectors, finalizers, owners-dependents, common-labels), `concepts/overview/kubernetes-api/`, `reference/using-api/deprecation-policy/`, `reference/using-api/deprecation-guide/`, `reference/using-api/api-concepts/`, `concepts/architecture/garbage-collection/`.

### Group 3 — Workloads I (Parallelizable: yes — four distinct pages)

- [x] Task 6. `pods.adoc` — "Pods" — created (`modules/ROOT/pages/backend/kubernetes/pods.adoc`), plus
      `modules/ROOT/images/kubernetes-pod-anatomy.svg`; detect-secrets clean (no results), all 546 Mermaid diagrams
      site-wide parse (including this page's new `stateDiagram-v2`), Antora build has only the expected forward-xref
      / missing-`index.adoc` warnings (same class as every other Group 2/3 page). Covers the addendum's Book 1 ch. 2
      Pod concepts (co-scheduling, shared IP/localhost, logical host, shared fate, one process per container, Pods
      not durable / externalising state) and Book 2 ch. 2's Kubernetes-side `imagePullPolicy`/`imagePullSecrets`
      view, plus Book 2 ch. 4/5's ConfigMap-mounted init-sidecar pattern, generalised into the sidecar/ambassador/
      adapter table.
  - [x] Task 6.1. The Pod as the unit of scheduling: shared network namespace, IP and volumes; shared fate; the "logical host"; one process per container (Book 1 ch. 2). Why bare Pods are not durable.
  - [x] Task 6.2. Lifecycle: phases, conditions, container states, `restartPolicy`, restart back-off.
  - [x] Task 6.3. Init containers. **Native sidecars** (`restartPolicy: Always`, GA 1.33 -- re-verified against kubernetes.io: stable since v1.33, first available in v1.28). Multi-container patterns (sidecar, ambassador, adapter). Ephemeral containers (link the debugging page). Static pods.
  - [x] Task 6.4. Environment variables, `envFrom`, the Downward API, hostname / subdomain / `hostAliases`, `imagePullPolicy` and `imagePullSecrets` (link `backend/docker/registries-and-docker-hub.adoc`).
  - [x] Task 6.5. 📊 Mermaid `stateDiagram-v2` of Pod phases. 📊 `kubernetes-pod-anatomy.svg` (containers sharing network and volumes).
  - [x] Task 6.6. `== References`: `concepts/workloads/pods/` and its sub-pages (pod-lifecycle, init-containers, sidecar-containers, ephemeral-containers, downward-api), `concepts/containers/images/`, `concepts/containers/container-environment/`, `tasks/configure-pod-container/static-pod/`, `tutorials/configuration/pod-sidecar-containers/`.
- [x] Task 7. `health-probes-and-lifecycle.adoc` — "Health Probes and Container Lifecycle" — created
      (`modules/ROOT/pages/backend/kubernetes/health-probes-and-lifecycle.adoc`); detect-secrets clean, Mermaid
      block parses (545/545 diagrams repo-wide), Antora build has only expected forward-xref errors
      (`backend/kubernetes/index.adoc#_bibliography` and `backend/kubernetes/pods.adoc`, both not yet written).
  - [x] Task 7.1. Liveness, readiness and startup probes, with all four mechanisms (`httpGet`, `tcpSocket`, `exec`, `grpc`) and every timing field. What each failure triggers. Pitfalls: liveness probes that check dependencies, slow starters without a startup probe. Book 1's pre-v1 probe fields as history.
  - [x] Task 7.2. `postStart` / `preStop` hooks (including the `sleep` action). Graceful termination: SIGTERM, `terminationGracePeriodSeconds`, the endpoint-removal race. Readiness gates.
  - [x] Task 7.3. Application side: a Spring Boot Actuator probes config (link `backend/springboot/metrics-and-observability.adoc`) and a minimal FastAPI health endpoint with SIGTERM handling. The Book 1 "prober relabels pods" idea reframed as readiness.
  - [x] Task 7.4. 📊 Mermaid `sequenceDiagram` of a Pod's termination (endpoint removal ∥ preStop → SIGTERM → grace period → SIGKILL).
  - [x] Task 7.5. `== References`: `concepts/configuration/liveness-readiness-startup-probes/` (or the current probes concept page), `tasks/configure-pod-container/configure-liveness-readiness-startup-probes/`, `concepts/containers/container-lifecycle-hooks/`, the termination section of `concepts/workloads/pods/pod-lifecycle/`, Spring Boot's Kubernetes probes docs.
- [x] Task 8. `replicasets-and-deployments.adoc` — "ReplicaSets and Deployments" — created (`modules/ROOT/pages/backend/kubernetes/replicasets-and-deployments.adoc`); detect-secrets clean, Mermaid `sequenceDiagram` block parses (545/545 diagrams site-wide), Antora build's only errors for this file are the three expected forward xrefs (`index.adoc#_bibliography`, `pods.adoc`, `configmaps.adoc`, all not-yet-written pages). All deprecated-API mentions (`extensions/v1beta1`, `apps/v1beta1`/`apps/v1beta2`, `kind: ReplicationController`) confirmed inside the history section only, none in live examples. No bare `<number>.` line starts. No admonitions besides the disclaimer.
  - [x] Task 8.1. The ReplicationController → ReplicaSet → Deployment history (Book 1 ch. 3, Book 2 `extensions/v1beta1`). ReplicaSet selectors and templates. Loose coupling via labels. Relabelling a Pod out of a ReplicaSet for debugging.
  - [x] Task 8.2. Deployment spec: `strategy` (`RollingUpdate` `maxSurge` / `maxUnavailable` vs `Recreate`), `minReadySeconds`, `progressDeadlineSeconds`, `revisionHistoryLimit`, proportional scaling.
  - [x] Task 8.3. `kubectl rollout status|history|undo --to-revision|pause|resume|restart`, `set image`, the `kubernetes.io/change-cause` annotation, `scale`. `kubectl rolling-update` removed in 1.18.
  - [x] Task 8.4. 📊 Mermaid of a rolling update step by step (old RS ↓, new RS ↑).
  - [x] Task 8.5. `== References`: `concepts/workloads/controllers/deployment/`, `…/replicaset/`, `…/replicationcontroller/`, `tasks/run-application/run-stateless-application-deployment/`, `tutorials/kubernetes-basics/update/`.
- [x] Task 9. `deployment-strategies.adoc` — "Deployment Strategies" — created (`modules/ROOT/pages/backend/kubernetes/deployment-strategies.adoc`); detect-secrets clean (empty results), all Mermaid blocks parse (544/544 diagrams site-wide including this page's 3), Antora build has only expected forward-xref errors (to `index.adoc`, `services.adoc`, `gateway-api.adoc`, `configmaps.adoc` and other not-yet-written Kubernetes pages) and no other warnings/errors. Verified against kubernetes.io (Service, canary-deployment tutorial), gateway-api.sigs.k8s.io/guides/traffic-splitting (Gateway API 1.6), argo-rollouts.readthedocs.io and docs.flagger.app as of 2026-09-27.
  - [x] Task 9.1. Blue/green by switching a Service selector. Canary with two Deployments behind one Service (the official canary tutorial). Weighted canary with Gateway API `HTTPRoute` `backendRefs[].weight`, linked to `gateway-api.adoc` without repeating it. A/B by labels (Book 1). Argo Rollouts / Flagger in brief. Feature flags vs deployment strategies.
  - [x] Task 9.2. 📊 One Mermaid diagram per strategy — blue/green, canary, weighted canary flowcharts (A/B testing described in prose, reusing the canary/weighted-canary diagrams' mechanism as the plan's addendum maps it to this page without a separate figure).
  - [x] Task 9.3. `== References`: `tutorials/stateless-application/canary-deployment/`, `concepts/services-networking/service/`, Gateway API traffic-splitting guide, Argo Rollouts and Flagger docs.

### Group 4 — Workloads II (Parallelizable: yes — four distinct pages)

- [x] Task 10. `statefulsets.adoc` — "StatefulSets" — created
      (`modules/ROOT/pages/backend/kubernetes/statefulsets.adoc`); detect-secrets clean (empty results), Mermaid
      `flowchart` block parses (549/549 diagrams site-wide including this page's 1), Antora build's only errors for
      this file are five expected forward xrefs (`index.adoc#_bibliography`, `persistent-volumes-and-storage-classes.adoc`,
      `stateful-applications-in-practice.adoc` x2, `custom-resources-and-operators.adoc`, all not-yet-written pages).
      Covers both addendum book-4 concepts mapped here (StatefulSets' stable ordinal hostnames/ordered
      creation-deletion, the manually replicated MongoDB headless-Service/per-pod-DNS precursor, `volumeClaimTemplates`)
      and the addendum book-5 concept (the two-container Redis Sentinel StatefulSet), the latter pointed forward to
      `stateful-applications-in-practice.adoc` rather than repeated. No bare `<number>.` line starts. No admonitions
      besides the disclaimer.
  - [x] Task 10.1. Stable identity: ordinals, a **headless Service** as `serviceName`, per-pod DNS (`postgres-0.postgres.bookshelf.svc.cluster.local`). Stable storage: `volumeClaimTemplates`, `persistentVolumeClaimRetentionPolicy`. `podManagementPolicy` (`OrderedReady` / `Parallel`). Updates: `RollingUpdate` with `partition` and `maxUnavailable`, and `OnDelete`. `ordinals.start`.
  - [x] Task 10.2. The *Bookshelf* PostgreSQL StatefulSet, following the basic StatefulSet tutorial's steps (scale, update, delete). `apps/v1beta1` as history (Book 2). When to use an operator instead (link `stateful-applications-in-practice.adoc`).
  - [x] Task 10.3. 📊 `kubernetes-statefulset.svg` (per-pod PVCs + DNS names).
  - [x] Task 10.4. `== References`: `concepts/workloads/controllers/statefulset/`, `tutorials/stateful-application/basic-stateful-set/`, `tasks/run-application/run-replicated-stateful-application/`.
- [x] Task 11. `daemonsets.adoc` — "DaemonSets" — created (`modules/ROOT/pages/backend/kubernetes/daemonsets.adoc`); no
      figure task was listed for this page, so a `flowchart TB` Mermaid diagram was added (one DaemonSet Pod per
      selected node, including a tainted control-plane node) since the convention requires every page to carry
      Mermaid and/or a `kubernetes-*.svg`; detect-secrets clean (empty results), Mermaid block parses (550/550
      diagrams site-wide), Antora build's only errors for this file are the five expected forward xrefs
      (`index.adoc#_bibliography`, `index.adoc`, `configmaps.adoc`, `scheduling-and-disruptions.adoc`,
      `volumes-and-ephemeral-storage.adoc`, `pod-security.adoc`, all not-yet-written Kubernetes pages) — a first
      build caught a wrong xref target (`backend/prometheus/...` instead of the actual
      `database/prometheus/containers-and-kubernetes-monitoring.adoc`), fixed before the final clean rebuild. No
      book chapter maps to DaemonSets in the addendum (both books' samplers omit that chapter), so the page draws
      only on official docs and carries no "book era" table. No bare `<number>.` line starts. No admonitions besides
      the disclaimer.
  - [x] Task 11.1. One Pod per (selected) node, with use cases (log shipper, node exporter, CNI agent). Scheduling (node affinity, tolerations). `updateStrategy` (`maxUnavailable` / `maxSurge`). DaemonSets vs static pods. A Fluent Bit–style log-agent example with placeholder config.
  - [x] Task 11.2. `== References`: `concepts/workloads/controllers/daemonset/`, `tasks/manage-daemon/update-daemon-set/`.
- [x] Task 12. `jobs-and-cronjobs.adoc` — "Jobs and CronJobs" — created
      (`modules/ROOT/pages/backend/kubernetes/jobs-and-cronjobs.adoc`); detect-secrets clean (empty results), all
      Mermaid diagrams parse (549/549 site-wide, including this page's new work-queue flowchart), Antora build's
      only errors for this file are the four expected forward xrefs (`index.adoc#_bibliography`,
      `gitops-and-ci-cd.adoc`, `persistent-volumes-and-storage-classes.adoc`, `configmaps.adoc`, all
      not-yet-written pages). No bare `<number>.` line starts, no admonitions besides the disclaimer. The Redis
      work-queue example uses a `secretKeyRef` (no inline password) plus a `kubectl create secret ... --from-literal`
      snippet using `openssl rand -base64 24`, per the shared brief's secret-hygiene rule.
  - [x] Task 12.1. The Job spec: `completions`, `parallelism`, `backoffLimit`, `activeDeadlineSeconds`, `ttlSecondsAfterFinished`, `podFailurePolicy`, `successPolicy`, `backoffLimitPerIndex`, `completionMode: Indexed`, `suspend`. `restartPolicy: OnFailure` vs `Never` (Book 2). Auto-generated labels and `manualSelector`.
  - [x] Task 12.2. The three Book 2 patterns rebuilt for the `notifier`: one-shot, fixed-completion parallel (Indexed), and work queue with a Redis list plus a consumer Job. Book 2's `kubectl run --restart=OnFailure` and `get -a` shown as removed.
  - [x] Task 12.3. CronJobs (`batch/v1` GA 1.21): schedule syntax, `timeZone`, `concurrencyPolicy`, `startingDeadlineSeconds`, history limits, `kubectl create job --from=cronjob/…`.
  - [x] Task 12.4. 📊 Mermaid of the work-queue pattern.
  - [x] Task 12.5. `== References`: `concepts/workloads/controllers/job/`, `…/cron-jobs/`, `…/ttlafterfinished/`, `tasks/job/` (coarse / fine parallel processing, indexed job, pod failure policy).
- [x] Task 13. `autoscaling.adoc` — "Autoscaling" — created
      (`modules/ROOT/pages/backend/kubernetes/autoscaling.adoc`); detect-secrets clean (empty results), all Mermaid
      diagrams parse (14/14 across `backend/kubernetes/`, including this page's new HPA-control-loop flowchart),
      Antora build's only errors for this file are the two expected forward xrefs (`index.adoc#_bibliography`,
      `scheduling-and-disruptions.adoc`, both not-yet-written pages). Feature-maturity re-verification against
      kubernetes.io on 2026-09-27: HPA scale-to-zero (`HPAScaleToZero`) confirmed **Beta since Kubernetes v1.37,
      enabled by default**; in-place Pod resize confirmed **Stable (GA) since Kubernetes v1.35**. Covers the
      addendum's `autoscaling` mapping (Book 1 ch. 3's "scheduling vs scaling" and the health-check/Service
      concepts shared with `health-probes-and-lifecycle`/`services`, plus the "New since the books" HPA
      `autoscaling/v2`, scale-to-zero and in-place-resize items), reframes Book 1's "external LB changes replica
      counts" as node autoscaling reacting to Pending Pods, and links (does not repeat)
      `cloud/azure/aks-microservices.adoc` for the managed KEDA add-on. No bare `<number>.` line starts. No
      admonitions besides the disclaimer.
  - [x] Task 13.1. HPA `autoscaling/v2`: resource, pods, object and external metrics; `behavior` policies and stabilisation; scale-to-zero (beta 1.37, verify). metrics-server and the Metrics API. The official HPA walkthrough with a load generator.
  - [x] Task 13.2. VPA modes, including `InPlaceOrRecreate`. **In-place Pod resize** (`resizePolicy`, `kubectl patch --subresource resize`, GA 1.35).
  - [x] Task 13.3. Node autoscaling: Cluster Autoscaler vs Karpenter. **KEDA** `ScaledObject` for the `notifier` on queue length (link the AKS microservices page for the managed add-on). Book 1's "external LB changes replica counts" reframed.
  - [x] Task 13.4. 📊 Mermaid of the HPA control loop.
  - [x] Task 13.5. `== References`: `concepts/workloads/autoscaling/` and its HPA / VPA sub-pages, `tasks/run-application/horizontal-pod-autoscale-walkthrough/`, `tasks/configure-pod-container/resize-container-resources/`, `concepts/cluster-administration/node-autoscaling/`, metrics-server, KEDA, Karpenter, Cluster Autoscaler.

### Group 5 — Services and networking (Parallelizable: yes — six distinct pages)

- [x] Task 14. `services.adoc` — "Services" — created: services.adoc (+ kubernetes-service-types.svg, Mermaid kube-proxy diagram); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 14.1. Why Services exist. ClusterIP, NodePort, LoadBalancer and ExternalName, with a table. Headless Services. Selectorless Services plus manual **EndpointSlices** for legacy / external backends (Books 1 and 2), and per-namespace resolution for test/prod parity. The deprecated Endpoints API. Multi-port and named ports. `sessionAffinity`.
  - [x] Task 14.2. `externalTrafficPolicy` / `internalTrafficPolicy`, source-IP preservation, `trafficDistribution` / topology-aware routing. kube-proxy modes: nftables recommended, iptables, IPVS deprecated in 1.35. `externalIPs` deprecated in 1.36. `kubectl expose`. Book 1's portal IP, `CreateExternalLoadBalancer` and userspace proxy as history.
  - [x] Task 14.3. 📊 `kubernetes-service-types.svg`. 📊 Mermaid of kube-proxy programming node rules from EndpointSlices.
  - [x] Task 14.4. `== References`: `concepts/services-networking/service/`, `…/endpoint-slices/`, `…/topology-aware-routing/`, `…/service-traffic-policy/`, `reference/networking/virtual-ips/`, `tutorials/services/connect-applications-service/`, `tutorials/services/source-ip/`, the Endpoints deprecation and externalIPs blog posts.
- [x] Task 15. `dns-and-service-discovery.adoc` — "DNS and Service Discovery" — created: dns-and-service-discovery.adoc (Mermaid); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 15.1. CoreDNS. A/AAAA/SRV records for Services and Pods. `<svc>.<ns>.svc.cluster.local` (with Book 2's wrong forms corrected). Search domains and `ndots`. `dnsPolicy` / `dnsConfig`. Env-var discovery vs DNS and the ordering caveat (Book 1). Debugging with a `dnsutils` Pod. NodeLocal DNSCache. SkyDNS / kube2sky as history.
  - [x] Task 15.2. `== References`: `concepts/services-networking/dns-pod-service/`, `tasks/administer-cluster/dns-debugging-resolution/`, `tasks/administer-cluster/nodelocaldns/`, coredns.io.
- [x] Task 16. `ingress.adoc` — "Ingress" — created: ingress.adoc (Mermaid); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 16.1. The Ingress API: rules, `pathType`, TLS, `ingressClassName`, default backend. Ingress controllers.
  - [x] Task 16.2. The Ingress API freeze and the **Ingress-NGINX retirement** (dates from the official blog posts), and what it means for existing clusters. Migrating with `ingress2gateway` 1.0. cert-manager for TLS.
  - [x] Task 16.3. `== References`: `concepts/services-networking/ingress/`, `…/ingress-controllers/`, the Ingress-NGINX retirement posts, the ingress2gateway release post, cert-manager docs.
- [x] Task 17. `gateway-api.adoc` — "Gateway API" — created: gateway-api.adoc (+ kubernetes-gateway-api-roles.svg, Mermaid; v1.6.2 Standard-channel CRDs verified against the tag); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 17.1. The role model (GatewayClass / Gateway / HTTPRoute, plus GRPCRoute, TLSRoute, TCPRoute, UDPRoute, ReferenceGrant, BackendTLSPolicy) and release channels. **Verify** in `gateway-api.sigs.k8s.io/concepts/versioning/` which resources are Standard in v1.6.
  - [x] Task 17.2. Installing the CRDs plus one implementation on kind. Default to Envoy Gateway; name Istio and NGINX Gateway Fabric as alternatives.
  - [x] Task 17.3. The *Bookshelf* routes: host / path / header matching; filters (redirect, URL rewrite, header modifier, mirror); weighted canary; TLS termination; cross-namespace routing with ReferenceGrant. GAMMA in brief. An Ingress → Gateway mapping table. Link `backend/architecture/decisions-and-migrations/api-gateway-and-bff.adoc` and the AKS pages.
  - [x] Task 17.4. 📊 `kubernetes-gateway-api-roles.svg`. 📊 Mermaid of the *Bookshelf* request path.
  - [x] Task 17.5. `== References`: `concepts/services-networking/gateway/`, gateway-api.sigs.k8s.io (overview, API types, guides, versioning), the Envoy Gateway quickstart.
- [x] Task 18. `network-policies.adoc` — "Network Policies" — created: network-policies.adoc (Mermaid); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 18.1. The allow-all default. `NetworkPolicy` `podSelector`, `policyTypes`, ingress/egress with pod, namespace and `ipBlock` peers and ports. A default-deny-all policy, and an allow-DNS-egress policy. *Bookshelf* policies (only `catalog-api` / `reviews-api` → PostgreSQL). CNI requirement: kind's default kindnet enforces NetworkPolicy in recent releases, so **verify** that; otherwise document installing Calico. AdminNetworkPolicy in brief. Testing with a temporary Pod.
  - [x] Task 18.2. 📊 Mermaid of the allowed flows.
  - [x] Task 18.3. `== References`: `concepts/services-networking/network-policies/`, `tasks/administer-cluster/declare-network-policy/`, Calico / Cilium docs.
- [x] Task 19. `cluster-networking-and-cni.adoc` — "Cluster Networking, CNI and Service Mesh" — created: cluster-networking-and-cni.adoc (+ kubernetes-pod-networking.svg); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 19.1. The network model (a routable IP per Pod, no NAT). Pod, Service and node CIDRs. CNI plugins (Flannel, Calico, Cilium) and eBPF dataplanes. Dual-stack. ClusterIP allocation.
  - [x] Task 19.2. Service mesh in one section: mTLS, traffic management, sidecar vs ambient (Istio, Linkerd). Link the AKS Istio add-on.
  - [x] Task 19.3. 📊 `kubernetes-pod-networking.svg` (Pod-to-Pod across nodes).
  - [x] Task 19.4. `== References`: `concepts/cluster-administration/networking/`, `concepts/services-networking/dual-stack/`, `concepts/services-networking/cluster-ip-allocation/`, `concepts/extend-kubernetes/compute-storage-net/network-plugins/`, the CNI spec, Istio / Linkerd docs.

### Group 6 — Configuration and storage (Parallelizable: yes — four distinct pages)

- [x] Task 20. `configmaps.adoc` — "ConfigMaps" — created configmaps.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 20.1. Creating ConfigMaps: `--from-literal`, `--from-file`, `--from-env-file`, YAML. Book 2's `kubectl apply cm` erratum corrected.
  - [x] Task 20.2. Consuming them via `env` / `envFrom`, command args, and volumes (whole directory vs `items`, vs `subPath`, and why `subPath` doesn't update). Book 2's Ghost copy-into-place workaround explained and superseded by `subPath` / `items`. Multi-file ConfigMaps for init scripts (Book 2 Redis).
  - [x] Task 20.3. Update propagation. Restart on change (`rollout restart`, checksum annotation, Kustomize hash suffix). Immutable ConfigMaps. The 1 MiB limit. Following the official "updating configuration via a ConfigMap" tutorial. Link the Spring Boot ConfigMap subsection.
  - [x] Task 20.4. `== References`: `concepts/configuration/configmap/`, `tasks/configure-pod-container/configure-pod-configmap/`, `tutorials/configuration/updating-configuration-via-a-configmap/`.
- [x] Task 21. `secrets.adoc` — "Secrets" — created secrets.adoc (Mermaid External Secrets sequence; placeholders only); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 21.1. Secret types. base64 is not encryption. Env vs volume consumption. Immutable Secrets. `kubectl create secret generic|tls|docker-registry`.
  - [x] Task 21.2. Encryption at rest (`EncryptionConfiguration`, KMS v2). RBAC for Secrets. The official Secrets good practices.
  - [x] Task 21.3. External stores: External Secrets Operator (`SecretStore` / `ExternalSecret`), the Secrets Store CSI driver, Sealed Secrets, SOPS. Link `cloud/azure/key-vault-and-secrets.adoc`.
  - [x] Task 21.4. 📊 Mermaid of the External Secrets sync flow.
  - [x] Task 21.5. `== References`: `concepts/configuration/secret/`, `concepts/security/secrets-good-practices/`, `tasks/configmap-secret/`, `tasks/administer-cluster/encrypt-data/`, `tasks/administer-cluster/kms-provider/`, External Secrets / Secrets Store CSI / Sealed Secrets / SOPS docs.
- [x] Task 22. `volumes-and-ephemeral-storage.adoc` — "Volumes and Ephemeral Storage" — created volumes-and-ephemeral-storage.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 22.1. Container filesystem vs Pod volume (Book 1). `emptyDir` (`medium: Memory`, `sizeLimit`). `hostPath` and its risks. Projected volumes. Generic and CSI ephemeral volumes. **Image volumes** (stable 1.36; verify). `subPath`, `readOnly`, mount propagation. Local ephemeral storage requests and limits.
  - [x] Task 22.2. `== References`: `concepts/storage/volumes/`, `…/projected-volumes/`, `…/ephemeral-volumes/`, `tasks/configure-pod-container/image-volumes/`, the local-ephemeral-storage section of `concepts/configuration/manage-resources-containers/`.
- [x] Task 23. `persistent-volumes-and-storage-classes.adoc` — "Persistent Volumes and Storage Classes" — created persistent-volumes-and-storage-classes.adoc (+ kubernetes-storage-model.svg); Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 23.1. PV/PVC binding, access modes (including `ReadWriteOncePod`), volume modes and reclaim policies. StorageClasses: the default class, `volumeBindingMode: WaitForFirstConsumer`, `allowVolumeExpansion`. Dynamic provisioning with kind's `standard` (local-path) class. Book 2's beta annotations corrected to `storageClassName`.
  - [x] Task 23.2. The CSI architecture and the in-tree → CSI migration (Books 1 and 2). VolumeSnapshots and classes. Cloning. Volume populators. VolumeAttributesClass (GA 1.34). Storage capacity. Book 2's reliable-singleton MySQL-on-NFS rebuilt with a StorageClass.
  - [x] Task 23.3. 📊 `kubernetes-storage-model.svg` (PVC ↔ PV ↔ StorageClass ↔ CSI driver).
  - [x] Task 23.4. `== References`: `concepts/storage/persistent-volumes/`, `…/storage-classes/`, `…/dynamic-provisioning/`, `…/volume-snapshots/`, `…/volume-attributes-classes/`, `tutorials/configuration/configure-persistent-volume-storage/`, the kind local-path provisioner docs.

### Group 7 — Resources, scheduling and security (Parallelizable: yes — six distinct pages)

- [x] Task 24. `resource-management.adoc` — "Resource Management" — created resource-management.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 24.1. Requests vs limits for CPU, memory and ephemeral storage. Throttling vs OOM-kill. QoS classes. Pod-level resources. LimitRange. ResourceQuota (including object counts and scopes). PID limiting. Pod overhead. Node allocatable, swap, cgroup v2 and the cgroup v1 deprecation. Right-sizing with metrics and VPA recommendations. Bin-packing efficiency (Book 2 ch. 1).
  - [x] Task 24.2. 📊 Mermaid: requests → scheduling, limits → enforcement.
  - [x] Task 24.3. `== References`: `concepts/configuration/manage-resources-containers/`, `concepts/workloads/pods/pod-qos/`, `concepts/policy/limit-range/`, `…/resource-quotas/`, `…/pid-limiting/`, `concepts/scheduling-eviction/pod-overhead/`, `concepts/architecture/cgroups/`.
- [x] Task 25. `scheduling-and-disruptions.adoc` — "Scheduling and Disruptions" — created scheduling-and-disruptions.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 25.1. How kube-scheduler works: filter, score, the scheduling framework. `nodeSelector`. Node affinity. Pod affinity and anti-affinity. Taints and tolerations (including `NoExecute`). Topology spread constraints (zone spreading for *Bookshelf*, using kind node labels). PriorityClasses and preemption. Scheduling gates.
  - [x] Task 25.2. PodDisruptionBudgets. Voluntary vs involuntary disruptions. Node-pressure vs API-initiated eviction. `cordon` / `drain` / `uncordon`. Gang / PodGroup scheduling in brief, at its verified maturity.
  - [x] Task 25.3. 📊 Mermaid of the scheduling cycle.
  - [x] Task 25.4. `== References`: `concepts/scheduling-eviction/` (kube-scheduler, assign-pod-node, taint-and-toleration, topology-spread-constraints, pod-priority-preemption, pod-scheduling-readiness, node-pressure-eviction, api-eviction), `concepts/workloads/pods/disruptions/`, `tasks/run-application/configure-pdb/`, `tasks/administer-cluster/safely-drain-node/`.
- [x] Task 26. `dynamic-resource-allocation-and-devices.adoc` — "Dynamic Resource Allocation and Devices" — created dynamic-resource-allocation-and-devices.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 26.1. Device plugins (GPUs). DRA, GA 1.34: DeviceClass, ResourceClaim, ResourceClaimTemplate, ResourceSlice, CEL selectors. A GPU / example-driver workload following the official DRA tutorial. RuntimeClass (gVisor, Kata).
  - [x] Task 26.2. `== References`: `concepts/extend-kubernetes/compute-storage-net/device-plugins/`, `concepts/scheduling-eviction/dynamic-resource-allocation/` (or its current Resource Management path), `tutorials/cluster-management/install-use-dra/`, `concepts/containers/runtime-class/`.
- [x] Task 27. `authentication-authorization-and-rbac.adoc` — "Authentication, Authorization and RBAC" — created authentication-authorization-and-rbac.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 27.1. The authn → authz → admission pipeline. User auth methods (X.509, OIDC, webhook) and kubeconfig `users`. ServiceAccounts: TokenRequest, projected bound tokens, no auto-created token Secrets since 1.24, `automountServiceAccountToken`. Pod certificates (1.37; verify maturity).
  - [x] Task 27.2. RBAC: Role, ClusterRole, RoleBinding, ClusterRoleBinding, aggregation, default roles. Least-privilege examples (the *Bookshelf* `notifier` reading a ConfigMap; a CI deployer scoped to one namespace). `kubectl auth can-i --as=system:serviceaccount:…`. RBAC good practices. Cloud workload identity (link the AKS page).
  - [x] Task 27.3. 📊 Mermaid of the API request pipeline.
  - [x] Task 27.4. `== References`: `concepts/security/controlling-access/`, `reference/access-authn-authz/authentication/`, `…/rbac/`, `concepts/security/service-accounts/`, `tasks/configure-pod-container/configure-service-account/`, `concepts/security/rbac-good-practices/`.
- [x] Task 28. `pod-security.adoc` — "Pod Security" — created pod-security.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 28.1. `securityContext` at Pod and container level (`runAsNonRoot`, `runAsUser` / `Group`, `fsGroup`, `readOnlyRootFilesystem`, `allowPrivilegeEscalation`, capabilities drop ALL, `seccompProfile: RuntimeDefault`, AppArmor fields, SELinux options).
  - [x] Task 28.2. Pod Security Standards (privileged / baseline / restricted) and Pod Security Admission namespace labels (`enforce` / `audit` / `warn` + `-version`), following the official PSS tutorials. PSP removed in 1.25, with migration. User namespaces (`hostUsers: false`, GA 1.36). The security and application-security checklists. Image supply chain (link `backend/docker/image-best-practices-and-security.adoc`).
  - [x] Task 28.3. `== References`: `concepts/security/pod-security-standards/`, `…/pod-security-admission/`, `tasks/configure-pod-container/security-context/`, `concepts/workloads/pods/user-namespaces/`, `tutorials/security/ns-level-pss/`, `…/cluster-level-pss/`, `…/seccomp/`, `concepts/security/security-checklist/`, `tasks/configure-pod-container/migrate-from-psp/`.
- [x] Task 29. `admission-control-and-policy.adoc` — "Admission Control and Policy" — created admission-control-and-policy.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 29.1. Built-in admission controllers. ValidatingAdmissionPolicy (CEL, GA 1.30), with a *Bookshelf* "require resource limits" policy and binding. MutatingAdmissionPolicy (stable 1.36; verify), with a "default labels" example. Admission webhooks and their good practices. Kyverno / OPA Gatekeeper in brief. Multi-tenancy (namespaces + quotas + policies; soft vs hard). API Priority and Fairness in brief.
  - [x] Task 29.2. `== References`: `reference/access-authn-authz/admission-controllers/`, `…/validating-admission-policy/`, `…/mutating-admission-policy/`, `…/extensible-admission-controllers/`, `concepts/cluster-administration/admission-webhooks-good-practices/`, `concepts/security/multi-tenancy/`, `concepts/cluster-administration/flow-control/`, `tutorials/cluster-management/admission-policies/`.

### Group 8 — Packaging, delivery and extending (Parallelizable: yes — four distinct pages)

- [x] Task 30. `kustomize.adoc` — "Kustomize" — created kustomize.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 30.1. `kubectl apply -k` and `kubectl kustomize` vs standalone `kustomize`. `kustomization.yaml` fields: `resources`, `namespace`, `namePrefix`, `labels`, `images`, `replicas`, `configMapGenerator` / `secretGenerator` with hash suffixes, `patches` (strategic merge and JSON 6902), `components`.
  - [x] Task 30.2. The *Bookshelf* repository layout: `k8s/base/` and `k8s/overlays/{dev,prod}/`, with the full tree shown. A Kustomize ↔ Helm decision table.
  - [x] Task 30.3. `== References`: `tasks/manage-kubernetes-objects/kustomization/`, kustomize.io, the kubernetes-sigs/kustomize docs.
- [x] Task 31. `helm.adoc` — "Helm" — created helm.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 31.1. Helm 4 concepts: charts, releases, repositories, OCI registries. The Helm 3 → 4 changes (verify against the Helm 4 release notes). The CLI: `install`, `upgrade --install`, `rollback`, `uninstall`, `list`, `history`, `template`, `lint`, `get values`, `show`, `--set` / `-f`.
  - [x] Task 31.2. The `charts/bookshelf/` chart: `Chart.yaml`, `values.yaml`, `values.schema.json`, `templates/` with `_helpers.tpl` and `NOTES.txt`. The template language (`include`, `tpl`, `range`, `with`, `toYaml` / `nindent`, `required`, `default`). Dependencies. Hooks. `helm test`. Artifact Hub. Provenance and signing.
  - [x] Task 31.3. 📊 Mermaid: values + templates → rendered manifests → release revision.
  - [x] Task 31.4. `== References`: helm.sh/docs (intro, chart_template_guide, topics/charts, topics/registries, helm commands), artifacthub.io.
- [x] Task 32. `gitops-and-ci-cd.adoc` — "GitOps and CI/CD" — created gitops-and-ci-cd.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 32.1. The OpenGitOps principles. Argo CD `Application` and Flux `GitRepository` + `Kustomization` / `HelmRelease` for *Bookshelf*. Sync and drift detection.
  - [x] Task 32.2. A GitHub Actions workflow: build and push the image (link `backend/docker/ci-cd-with-github-actions.adoc`), then either bump the image tag in the overlay or run `helm upgrade`. Tag vs digest pinning. Environment promotion. Secrets in GitOps (Sealed Secrets / SOPS / ESO, linking `secrets.adoc`).
  - [x] Task 32.3. 📊 Mermaid of the GitOps loop.
  - [x] Task 32.4. `== References`: opengitops.dev, Argo CD docs, Flux docs, GitHub Actions docs.
- [x] Task 33. `custom-resources-and-operators.adoc` — "Custom Resources and Operators" — created custom-resources-and-operators.adoc; Mermaid parse, detect-secrets and Antora build clean (only forward xrefs to later-group pages).
  - [x] Task 33.1. CRDs: schema, CEL validation rules, versions and conversion, the status / scale subresources, printer columns. A `BookshelfBackup` CRD example. The API aggregation layer.
  - [x] Task 33.2. Controllers and the operator pattern: reconcile loop, watches, status, finalizers, owner references. A Kubebuilder scaffold with an abbreviated Go reconcile snippet, plus pointers to the Java Operator SDK and Quarkus (link `backend/quarkus/kubernetes-and-openshift.adoc`). Well-known operators. ThirdPartyResources as history. kubectl plugins as a lighter extension.
  - [x] Task 33.3. 📊 Mermaid of an operator reconcile loop.
  - [x] Task 33.4. `== References`: `concepts/extend-kubernetes/api-extension/custom-resources/`, `tasks/extend-kubernetes/custom-resources/custom-resource-definitions/`, `concepts/extend-kubernetes/operator/`, `concepts/extend-kubernetes/api-extension/apiserver-aggregation/`, book.kubebuilder.io, the Java Operator SDK.

### Group 9 — Operations (Parallelizable: yes — four distinct pages)

- [x] Task 34. `observability-logging-and-metrics.adoc` — "Observability: Logging, Metrics and Tracing" — `observability-logging-and-metrics.adoc` (390 lines, 1 Mermaid; Mermaid/detect-secrets/Antora clean; Metrics API stable at 1.37 kept).
  - [x] Task 34.1. Container logs and rotation. Node-level vs sidecar vs cluster-level logging (Fluent Bit DaemonSet). Events. metrics-server and `kubectl top`. The Metrics API (stable 1.37; verify). kube-state-metrics and system metrics.
  - [x] Task 34.2. kube-prometheus-stack via Helm and Grafana, linking the Prometheus section (especially `containers-and-kubernetes-monitoring.adoc`) without repeating its service discovery. OpenTelemetry: the Collector as DaemonSet / Deployment, and Operator auto-instrumentation. System logs and traces. Link `backend/springboot/logging.adoc`.
  - [x] Task 34.3. `== References`: `concepts/cluster-administration/logging/`, `…/system-metrics/`, `…/kube-state-metrics/`, `…/system-logs/`, `…/system-traces/`, `tasks/debug/debug-cluster/resource-metrics-pipeline/`, Fluent Bit, kube-prometheus-stack, OpenTelemetry Operator.
- [x] Task 35. `debugging-and-troubleshooting.adoc` — "Debugging and Troubleshooting" — `debugging-and-troubleshooting.adoc` (425 lines, Mermaid decision tree; validation clean).
  - [x] Task 35.1. A systematic flow: Pod → Service → Gateway / Ingress → node. `describe` + events. `kubectl debug` (ephemeral container, `--copy-to`, `node/…`). `get --raw`, audit logs, `crictl`.
  - [x] Task 35.2. A failure-state table with a reproduction for each, and a fix: `Pending` (resources / affinity / unbound PVC), `ImagePullBackOff`, `CrashLoopBackOff`, `OOMKilled`, `CreateContainerConfigError`, readiness failing, Service without endpoints, DNS failure, NetworkPolicy block.
  - [x] Task 35.3. 📊 Mermaid decision tree for "my Pod isn't working".
  - [x] Task 35.4. `== References`: `tasks/debug/` (debug-application / debug-pods, debug-running-pod, debug-service, debug-cluster, crictl), `tasks/debug/debug-application/determine-reason-pod-failure/`.
- [x] Task 36. `cluster-setup-and-administration.adoc` — "Cluster Setup and Administration" — `cluster-setup-and-administration.adoc` (440 lines, Mermaid upgrade sequence; release dates re-verified against kubernetes.io patch-releases; placeholders only for tokens/hashes).
  - [x] Task 36.1. Production options. kubeadm: `init` / `join`, HA with stacked vs external etcd, `ClusterConfiguration`. Installing packages from `pkgs.k8s.io` (the legacy repos are gone). containerd / CRI-O, and the dockershim removal.
  - [x] Task 36.2. The release cycle and support windows. The version-skew policy. Upgrades: `kubeadm upgrade plan|apply`, draining one node at a time, pre-upgrade deprecated-API detection (`kubectl convert`, pluto / kubent). etcd `snapshot save|restore`. Certificate rotation. Windows nodes in brief. Book 1's Vagrant setup as history.
  - [x] Task 36.3. 📊 Mermaid of the upgrade sequence.
  - [x] Task 36.4. `== References`: `setup/production-environment/`, `setup/production-environment/tools/kubeadm/` sub-pages, `tasks/administer-cluster/kubeadm/kubeadm-upgrade/`, `…/change-package-repository/`, `…/kubeadm-certs/`, `tasks/administer-cluster/configure-upgrade-etcd/`, `releases/`, `releases/patch-releases/`, `releases/version-skew-policy/`, `concepts/windows/intro/`.
- [x] Task 37. `managed-kubernetes-and-distributions.adoc` — "Managed Kubernetes and Distributions" — `managed-kubernetes-and-distributions.adoc` (267 lines, 1 Mermaid; validation clean).
  - [x] Task 37.1. The bare metal vs IaaS vs managed choice (Book 1 ch. 4, updated). AKS (link `cloud/azure/aks-clusters.adoc` and `aks-microservices.adoc`). EKS and GKE (prose references to #163 / #164, no xref). What "managed" covers (Automatic / Autopilot modes).
  - [x] Task 37.2. Distributions: OpenShift (link the Quarkus page), RKE2, k3s, MicroK8s, Talos. Multi-cluster: KubeFed history ("Ubernetes"), Cluster API, GitOps fleets. CNCF Certified Kubernetes conformance. Cost awareness. Book 2's ACS / "GCE" / "no AWS" statements corrected.
  - [x] Task 37.3. `== References`: `setup/production-environment/turnkey-solutions/` (or current page), cluster-api.sigs.k8s.io, the CNCF conformance programme, AKS / EKS / GKE product docs.

### Group 10 — Putting it together (Parallelizable: yes — three distinct pages; `bookshelf-end-to-end.adoc` only links earlier pages by path)

- [x] Task 38. `stateful-applications-in-practice.adoc` — "Stateful Applications in Practice" -- done: `stateful-applications-in-practice.adoc` (Mermaid, detect-secrets and Antora validated; only forward xrefs to index.adoc remain).
  - [x] Task 38.1. Book 2 ch. 4–5 rebuilt with current APIs:
    - importing a managed database via ExternalName and via a selectorless Service + EndpointSlice
    - a reliable singleton
    - a replicated Redis StatefulSet (primary/replica + Sentinel) with a headless Service, a multi-file ConfigMap and an init sidecar
  - [x] Task 38.2. Why production databases run on an operator or a managed service (CloudNativePG `Cluster` example; link `database/redis/redis-software-cloud-kubernetes-and-valkey.adoc`). Backups (CloudNativePG backups, VolumeSnapshots). Data gravity.
  - [x] Task 38.3. `== References`: `tutorials/stateful-application/` pages, `tasks/run-application/run-single-instance-stateful-application/`, `concepts/services-networking/service/` (ExternalName / selectorless), cloudnative-pg.io.
- [x] Task 39. `bookshelf-end-to-end.adoc` — "Bookshelf End to End" -- done: `bookshelf-end-to-end.adoc` and `images/kubernetes-bookshelf-deployment.svg`; validated (Mermaid, detect-secrets, Antora; only forward xrefs to index.adoc remain).
  - [x] Task 39.1. From an empty kind cluster to the full *Bookshelf*: namespace with PSA labels; ConfigMaps / Secrets; the PostgreSQL StatefulSet; the three Deployments with probes, resources and security contexts; Services; Gateway + HTTPRoutes; NetworkPolicies; RBAC; HPA; PDB; the `notifier` CronJob.
  - [x] Task 39.2. The same stack packaged as Kustomize overlays and the Helm chart, delivered with Argo CD, linking back to each page. App-side notes linking the Spring Boot, Quarkus, ASP.NET Core / Aspire sections; FastAPI (#199) in prose only.
  - [x] Task 39.3. 📊 `kubernetes-bookshelf-deployment.svg` (the complete deployment).
  - [x] Task 39.4. `== References`: the union of the official pages used.
- [x] Task 40. `whats-changed-and-migration.adoc` — "What's Changed and Migration" -- done: `whats-changed-and-migration.adoc`, versions and dates re-verified 2026-09-30 against kubernetes.io releases, the 1.35-1.37 release notes and blogs; validated.
  - [x] Task 40.1. The issue's "Outdated in the books" table (book era → current, with versions) and the "New since the books" list, rewritten as tables with version and date columns, **re-verified** at implementation time.
  - [x] Task 40.2. Deprecated API removals by version (from the migration guide). Dockershim, PSP, Ingress-NGINX, Endpoints, `externalIPs`, cgroup v1, IPVS, legacy package repos, `kubectl run` generators. Finding deprecated APIs in a cluster (`apiserver_requested_deprecated_apis` metric, pluto / kubent) and in manifests.
  - [x] Task 40.3. `== References`: `reference/using-api/deprecation-guide/`, release blogs 1.24 → 1.37, the individual deprecation posts.

### Group 11 — Landing page and cheat-sheet page (Parallelizable: yes — two distinct files; both need every earlier page's final title and path)

- [x] Task 41. `index.adoc` — "Kubernetes" -- created `index.adoc` and `images/kubernetes-bookshelf-overview.svg`; Mermaid (568 diagrams) parse, detect-secrets clean, Antora build clean (all index / `#_bibliography` xref errors gone).
  - [x] Task 41.1. What Kubernetes is and who the section is for. The version baseline and release/support policy in prose. The *Bookshelf* scenario. The reading path.
  - [x] Task 41.2. `== What's covered`, grouped as the outline, with one `xref:` + description per page. Verify all 39 filenames with `ls` first.
  - [x] Task 41.3. A "where related material lives elsewhere on this site" table (the issue's existing-pages table, as xrefs). Issues #163 / #164 / #199 / #184 / #171 / #201 in prose only.
  - [x] Task 41.4. `[[_bibliography]]` / `== Bibliography`, with every group from the issue's Bibliography section and every entry linked.
    * The two books get a full citation, ISBN and O'Reilly link. Book 2 also gets a note that the provided copy was a sampler, plus a link to the current 3rd edition.
    * Close with a note that the official docs win on any discrepancy.
  - [x] Task 41.5. 📊 `kubernetes-bookshelf-overview.svg` (can be a simplified version of Task 39.3's figure). 📊 Mermaid `mindmap` of the section.
- [x] Task 42. `cheat-sheet.adoc` — "Kubernetes Cheat Sheet" -- created `cheat-sheet.adoc`; detect-secrets clean, Antora build has only the permitted missing `kubernetes-cheat-sheet.pdf` attachment error (produced by Group 12).
  - [x] Task 42.1. Mirror `backend/docker/cheat-sheet.adoc`:
    * the disclaimer include
    * an intro listing what the sheet covers and the version baseline, linking `xref:attachment$kubernetes-cheat-sheet.pdf[downloadable PDF]`
    * grouped `*Group* --` xref paragraphs to all 39 topic pages
    * a final `xref:attachment$kubernetes-cheat-sheet.pdf[Download the Kubernetes Cheat Sheet (PDF)]`

### Group 12 — Cheat-sheet PDF (Parallelizable: yes)

- [x] Task 43. Produce `modules/ROOT/attachments/kubernetes-cheat-sheet.pdf` -- done: 1 page, 594.96x841.92 pt (A4), 304 KB; Docker palette/fonts/5-column bordered boxes, header version line, breadcrumb footer; HTML source kept in scratchpad only; detect-secrets clean; Antora build clean (no attachment xref errors).
  - [x] Task 43.1. Inspect `docker-cheat-sheet.pdf` (PyMuPDF / `pdftotext`) to match its palette, fonts, colour-coded bordered boxes, header version line and breadcrumb footer ("Guides & References › Backend Development › Kubernetes").
  - [x] Task 43.2. Write the HTML/CSS layout **in the session scratchpad, not the repo**. It covers every bullet in the issue's "Cheat sheet" section:
    * architecture; local clusters; kubectl
    * object skeleton; workloads + rollout
    * probes; Services / DNS / Ingress vs Gateway
    * NetworkPolicy; ConfigMap / Secret; storage
    * resources / QoS; scheduling / PDB / drain; autoscaling
    * security (RBAC, tokens, `securityContext`, PSA labels)
    * Kustomize; Helm; CRDs / operators
    * a troubleshooting table
    * the "changed since older tutorials" strip

    Draw the content from the pages written in Groups 2–10.
  - [x] Task 43.3. Render with headless Chromium (Playwright or `--headless --print-to-pdf`) on A4 portrait. Verify it is exactly one page of ~595×842 pt. Fix overflow by layout (columns, `table-layout:fixed`, font scaling within legibility), never by silently dropping content. Commit only the PDF.

### Group 13 — Site wiring (Parallelizable: yes — three distinct files)

- [x] Task 44. `modules/ROOT/nav.adoc`
  - [x] Task 44.1. Insert `*** xref:backend/kubernetes/index.adoc[Kubernetes]` directly after `**** xref:backend/docker/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - [x] Task 44.2. Add `****` children for the 39 topic pages in outline order, ending with `**** xref:backend/kubernetes/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 45. `modules/ROOT/pages/backend/index.adoc`
  - [x] Task 45.1. Add a `* xref:backend/kubernetes/index.adoc[Kubernetes] -- …` bullet after the Docker bullet, styled like it: one clause per area, ending "plus a downloadable cheat sheet".
  - [x] Task 45.2. Add Kubernetes to `:description:`. Append the issue's keyword list to `:keywords:`, skipping duplicates.
- [x] Task 46. `modules/ROOT/pages/index.adoc`
  - [x] Task 46.1. Mention Kubernetes in `:description:`. Append `Kubernetes, kubectl, Helm, Kustomize, Gateway API` to `:keywords:`, skipping any already present.

_Group 13 done: nav.adoc (Kubernetes + 39 topics + cheat sheet after Docker), backend/index.adoc (bullet, description, keywords), index.adoc (description, keywords). Antora build clean; 41 kubernetes HTML pages._

### Group 14 — Reciprocal back-links (Parallelizable: yes — every task edits a distinct file)

Each back-link is one sentence or clause. No restructuring and no admonitions.

- [x] Task 47. `backend/docker/orchestration-swarm-and-kubernetes.adoc`: in `== Kubernetes`, link `xref:backend/kubernetes/index.adoc[Kubernetes]` and reword the "out of scope beyond a pointer" sentence to point there.
  - Done: back-link added; Antora build clean, detect-secrets no findings.
- [x] Task 48. `cloud/azure/aks-clusters.adoc`: in the intro, link the Kubernetes section for generic concepts.
  - Done: back-link added; Antora build clean, detect-secrets no findings.
- [x] Task 49. `cloud/azure/aks-microservices.adoc`: in the intro, the same link, plus `gateway-api.adoc` / `autoscaling.adoc` where those topics start.
  - Done: back-link added; Antora build clean, detect-secrets no findings.
- [x] Task 50. `backend/quarkus/kubernetes-and-openshift.adoc`: in the intro, link the Kubernetes section (plus `custom-resources-and-operators.adoc` from the Operator SDK subsection).
  - Done: back-link added; Antora build clean, detect-secrets no findings.
- [x] Task 51. `backend/springboot/configuration-and-profiles.adoc`: in `=== Kubernetes ConfigMaps and Secrets`, link `configmaps.adoc` and `secrets.adoc`.
  - Done: back-link added; Antora build clean, detect-secrets no findings.
- [x] Task 52. `database/prometheus/containers-and-kubernetes-monitoring.adoc`: link `observability-logging-and-metrics.adoc`.
  - Done: back-link added; Antora build clean, detect-secrets no findings.

### Group 15 — Validation, build and acceptance audit (Parallelizable: no — verifies the output of every prior group)

- [x] Task 53. Mermaid validation: run `npm i --no-save mermaid@11 jsdom`, then `npm run validate:mermaid`. Fix every failing block. -- done in Group 15 audit.
- [x] Task 54. Antora build: `npx antora antora-playbook.yml` must finish with zero `xref` / AsciiDoc errors and warnings. -- done in Group 15 audit.
  * `build/site/backend/kubernetes/*.html` has 41 pages (39 topic pages, the index and the cheat sheet).
  * The section appears under Backend Development after Docker, and in `build/site/search-index.js`.
- [x] Task 55. Acceptance audit against the issue's criteria -- done in Group 15 audit.
  - [x] Task 55.1. `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]|^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):' modules/ROOT/pages/backend/kubernetes/` returns nothing. Every page has `:description:`, `:keywords:`, the disclaimer include, at least one `Source:` link and `== References`. -- done in Group 15 audit.
  - [x] Task 55.2. Every `image::kubernetes-*.svg` resolves to a file, and every `modules/ROOT/images/kubernetes-*.svg` is referenced. No alt text contains a comma. -- done in Group 15 audit.
  - [x] Task 55.3. Deprecated APIs appear only in history / "book era" passages. The command is `grep -rnE 'extensions/v1beta1|apps/v1beta[12]|batch/v1beta1|autoscaling/v2beta|policy/v1beta1|storage.k8s.io/v1beta1|volume\.(alpha|beta)\.kubernetes\.io|kind: ReplicationController|kind: PodSecurityPolicy' modules/ROOT/pages/backend/kubernetes/`, and every hit must be inside such a passage. -- done in Group 15 audit.
  - [x] Task 55.4. Walk the addendum comment's two tables row by row and confirm each concept appears on its "Covered by" page(s). Walk the official Concepts areas list and confirm each has a page. -- done in Group 15 audit.
  - [x] Task 55.5. `kubernetes-cheat-sheet.pdf` is one A4 page, and `cheat-sheet.html`'s download link resolves to `_attachments/kubernetes-cheat-sheet.pdf`. -- done in Group 15 audit.
  - [x] Task 55.6. `git status` shows no PDF books, scratch HTML or `build/` output staged. No `xref:` targets a non-existent page (covered by a clean build). -- done in Group 15 audit.

Delegate Tasks 53–54 to the `iru-gate-runner` agent so build output stays out of the main context:

```
Agent({
  description: "Validate Mermaid and build the Antora site",
  subagent_type: "iru-gate-runner",
  prompt: "In the repository root, run `npm i --no-save mermaid@11 jsdom`, then `npm run validate:mermaid`, then
    `npx antora antora-playbook.yml`. Report: whether Mermaid validation passed (file:line of each failure if not),
    whether the Antora build had zero errors/warnings (exact text of each if not), and how many
    build/site/backend/kubernetes/*.html pages exist. Summarize pass/fail only; do not dump the log."
})
```
