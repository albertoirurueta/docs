# Implementation Plan: "JMeter" section under Backend Development

## Task summary

Source: GitHub issue #260
Base branch: main

Add a new documentation section **JMeter** under Guides & References -> Backend Development, in
`modules/ROOT/pages/backend/jmeter/`: 38 content pages (including `index.adoc`) plus `cheat-sheet.adoc` and a one-page
A4 PDF cheat sheet (`modules/ROOT/attachments/jmeter-cheat-sheet.pdf`). It teaches Apache JMeter 5.6.3 (planned 6.0
differences noted, 6.0 is unreleased) for load and performance testing of backend services: test plans, load models,
HTTP / REST / GraphQL / JDBC / JMS / gRPC testing, plugins, CLI / distributed / CI runs and result analysis. The full spec
is the issue body (`gh issue view 260`): the page outline tables (rows 1-39), the *Bookshelf* scenario, the
books-vs-docs table, the "things the docs do not provide" list, the bibliography URL list, the 404 URL blacklist, the
cheat-sheet minimum content and the acceptance criteria. **Every page task below refers to its row number (`#`) in the
issue's "Page outline" tables** and must cover that row's content, include its suggested figures, and follow the shared
conventions.

### Choices made on the user's behalf

1. **One branch, one PR (`feature/260`), groups mirror the issue's suggested 4-PR split** (foundations + load
   modelling, HTTP, other protocols + plugins + gRPC, running / scaling / reference), so the work can be cut into
   separate PRs later. Cheat sheet and the link pass are their own groups.
2. **Page-level independence inside a group.** A page only `xref:`s pages in the same or an earlier group (plus existing
   site pages). Forward links are added in the final link pass, so intermediate builds have no unresolved `xref`.
3. **`index.adoc` skeleton in Group 1, completed in Group 9.** Every page links to
   `xref:backend/jmeter/index.adoc#_bibliography[...]` via the disclaimer, so the landing page with an anchored
   `== Bibliography` must exist first. Nav entries and back-links are added once, in Group 9.
4. **Content-only, untagged tasks.** The repo is AsciiDoc-only and no installed `*-code-one-task` skill covers it
   (same as the archived plans for #261, #262 and #286).
5. **Facts re-verified at writing time.** The issue was verified 2026-10-10 against web sources. Group 1 re-checks
   versions and dates (JMeter 5.6.x vs a released 6.0, Plugins Manager 2.0, gRPC plugin status, jmeter-maven-plugin 3.8.x,
   Java DSL 2.3) and later groups verify property names, CLI flags and plugin ids against the official docs. Anything
   unverifiable is stated honestly, never invented. Where feasible, key examples (`.jmx` fragments, CLI run, Maven,
   Groovy) are exercised against a real JMeter 5.6.3 in a throwaway directory in the scratchpad, never committed.
6. **Cheat sheet PDF** is generated with Python `reportlab` (not installed yet; `pip install reportlab` in Group 8). No
   generator is committed, as for the existing cheat sheets.
7. **Large-section orchestration** (memory: large-docs-section-orchestration): `iru-code` drives each group from the
   main session, one background page agent per page with a shared brief file in the scratchpad, then runs the group
   gate directly and ticks the boxes. A split read-only review (4 agents) and a grep for "scratch", "this review",
   "/Users/", "/var/folders" and first-person voice happen in Group 9.
8. **#258 and #263 are referenced in prose only**; #286 (Apache Tika) is merged but is also kept prose-only for
   consistency with the issue. No `xref:` to pages that don't exist.
9. **Disclaimer partial differs from `apache-tika-disclaimer.adoc`**: per the issue, the `[IMPORTANT]` admonition holds
   only the AI-assistance notice, and the sentence pointing at `xref:backend/jmeter/index.adoc#_bibliography[the section bibliography]`
   follows the closing `====`.

### Conventions every page task must follow (from the issue and `CLAUDE.md`)

* Skeleton: `= Title`, `:description:`, `:keywords:`, `include::partial$jmeter-disclaimer.adoc[]` right after the header
  attributes, an intro stating the versions (JMeter 5.6.3 with planned 6.0 differences, Java 17+ with 21 recommended,
  Plugins Manager 2.0, jmeter-maven-plugin 3.8.x, gRPC Request plugin 2.0.x), `==` sections with detailed explanations
  and examples, and `== References` (official sources only; books cited with chapter where used).
* Per concept: what and why, position in the test-plan tree, scope and execution order, **every** GUI field and its
  property equivalent (tables), load-generator cost (CPU, memory), pitfalls, and 2.x/3.0 (books) -> 5.6 -> 6.0 changes.
* Examples: complete and runnable. Step-by-step GUI instructions naming exact menu paths; small valid `.jmx` fragments
  as `[source,xml]`; CLI as `[source,bash]` with output; `[source,properties]`, `[source,groovy]`, `[source,yaml]`,
  `[source,protobuf]`, `[source,java]` where relevant; worked numeric example wherever load is configured. **Each example
  is followed by a `Source:` link** to the official page it derives from (manual chapter, component-reference anchor,
  functions / properties reference, jmeter-plugins.org wiki, plugin README, jmeter-maven-plugin wiki).
* No real secrets, tokens or passwords (CSV / `-J` placeholders); load only against `localhost` or the reader's own
  systems.
* Running *Bookshelf* scenario (original, not copied): `bookshelf-load.jmx` built step by step (login -> search -> view
  book -> create loan -> view loan; `users.csv`, `search-terms.csv`; JWT via JSON Extractor; assertions, think time,
  transactions), profiles smoke / load / stress / spike / soak / arrival-rate, plus `bookshelf-grpc.jmx` for
  `bookshelf.v1.LoanService`.
* **No admonitions** other than the disclaimer: no `[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`, `[CAUTION]` blocks or
  `NOTE:`-style lines. Use prose, bold lead-ins, lists or tables.
* Images: `modules/ROOT/images/jmeter-*.svg`, bare filename, single-line `image::` macro at column 0 with blank lines
  around, alt text in double quotes when it contains a comma, original drawings (no JMeter logo, GUI screenshots or
  book / site images), legible in light and dark themes, each SVG referenced by a page. Mermaid blocks where 📊 is
  suggested (a floor, not a ceiling); stereotypes as `&lt;&lt;interface&gt;&gt;`.
* Inline code containing `->`, `=>`, `<=`, `<-`, `__`, `#[`, `~`, `*`, `^`, `...`, `'` or `{` uses `` `+...+` ``; code
  containing `+` uses `` `pass:c[...]` ``. This matters throughout: `${__P(threads,10)}`, `${var}`, `$1$`,
  `rate(10/sec)`, `load_profile=const(10,10s)`, `**/*.jmx`. `${...}` must always be in a passthrough or a source block.
* ★ pages (rows 2, 3, 6, 7, 8, 9, 12, 14, 15, 16, 17, 19, 23, 25, 26, 28, 30, 31, 33) are the most detailed pages.
* Bibliography URLs come from the issue; never use the 404 / obsolete URLs it lists (`dns-cache-manager.html`,
  `extending/jmeter_tutorial.html`, `build-monitor-test-plan.html`, `releases/tag/v6.0.0`).
* Group gate (run directly from the main session, or via `iru-gate-runner`, so build output stays out of context):
  `npx antora antora-playbook.yml` with no errors or warnings for the new files; the `CLAUDE.md` grep checks scoped to
  the new files and `build/site/backend/jmeter`; the admonition grep
  `grep -rnE '^\[(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]|^(NOTE|TIP|IMPORTANT|WARNING|CAUTION): ' modules/ROOT/pages/backend/jmeter`
  matching nothing; and `npm run validate:mermaid` (needs a one-off `npm i --no-save mermaid@11 jsdom`).

## Current code state

* Repo is the Antora root component `ROOT` (`antora.yml`); pages in `modules/ROOT/pages/`, images in
  `modules/ROOT/images/`, PDF cheat sheets in `modules/ROOT/attachments/`, disclaimers in
  `modules/ROOT/partials/<section>-disclaimer.adoc`. There is no `docs/` directory and no `backend/jmeter/` yet and no
  `jmeter-*` images.
* Closest precedent: `backend/apache-tika/` (32 files, `apache-tika-disclaimer.adoc`, `apache-tika-cheat-sheet.pdf`,
  archived plan `.archive/implementation_plan_286.md`). Its `cheat-sheet.adoc` shows the on-page summary plus the
  `link:{attachmentsdir}/...pdf[...]` mechanism (the issue writes it as `xref:attachment$...`; follow whatever the
  existing cheat-sheet pages actually use and verify the PDF link resolves in the build).
* `modules/ROOT/nav.adoc`: the Apache Tika block ends at line 1745
  (`**** xref:backend/apache-tika/cheat-sheet.adoc[Cheat Sheet (PDF)]`), followed by `** xref:apps/index.adoc[Apps]` at
  line 1746. The new `***` block goes between them. Re-check exact lines at write time.
* `modules/ROOT/pages/backend/index.adoc`: add a JMeter bullet after the Apache Tika bullet (last under `== Sections`),
  update `:description:` and extend `:keywords:` with the issue's list.
* `modules/ROOT/pages/index.adoc`: no tile; update `:description:` / `:keywords:` only.
* `backend/springboot/performance-testing-jmeter.adoc` already exists (short Spring-Boot-specific page, header carries
  `include::partial$springboot-disclaimer.adoc[]`). Keep it; add a pointer at its top and in its references, and keep
  versions consistent (JMeter, jmeter-maven-plugin).
* Back-link targets (all verified to exist): `backend/springboot/performance-testing-jmeter.adoc`,
  `backend/springboot/cheat-sheet.adoc`, `backend/springboot/grpc-apis.adoc`,
  `backend/springboot/metrics-and-observability.adoc`, `backend/docker/ci-cd-with-github-actions.adoc`,
  `database/prometheus/grafana-dashboards-and-visualization.adoc`.
* Existing pages to link instead of re-documenting (all verified): `backend/springboot/{grpc-apis,api-first-rest-and-grpc,rest-apis,unit-and-integration-testing,metrics-and-observability}.adoc`,
  `backend/quarkus/observability.adoc`, `backend/docker/{testcontainers-fundamentals,compose-for-local-development,ci-cd-with-github-actions}.adoc`,
  `backend/kubernetes/{autoscaling,resource-management}.adoc`, `backend/oauth/*`, `backend/messaging/*`,
  `database/prometheus/*`, `database/neo4j/*`. There is no InfluxDB page; describe only JMeter's side and link the
  official InfluxDB docs. Verify each target again before writing an `xref:`.
* `.claude/skills/iru-java-springboot-performance-tests/SKILL.md` generates JMeter projects (jmeter-maven-plugin,
  Concurrency / Ultimate thread groups, `vn.zalopay.benchmark:jmeter-grpc-request`). It is not changed; pages mention it
  in prose and state the plugin's current status (zalopay-oss archived, bakthava continuation).
* `scripts/validate-mermaid.mjs` / `npm run validate:mermaid` validates diagrams. `java`, `docker` and `pdfinfo` are
  installed; `jmeter` and Python `reportlab` are not.
* Untracked `api2.txt` and modified `.secrets.baseline` pre-date this work; `modules/ROOT/.DS_Store` and build output
  must not be committed.

## Implementation steps

### Group 1 -- Foundation scaffolding: disclaimer partial and landing-page skeleton

Parallelizable: yes

- [x] Task 1. Create the disclaimer partial and landing-page skeleton
  - [x] Task 1.1. Create `modules/ROOT/partials/jmeter-disclaimer.adoc` with only the AI-assistance `[IMPORTANT]` admonition (wording as in the other `*-disclaimer.adoc` partials) followed, after the closing `====`, by a plain sentence with `xref:backend/jmeter/index.adoc#_bibliography[the section bibliography]`
  - [x] Task 1.2. Create `modules/ROOT/pages/backend/jmeter/index.adoc` (row 1): intro, learning path from first test to CI, version baseline (5.6.3, planned 6.0), books-vs-docs note, Mermaid "choose your page" flow, page-list placeholder (no `xref:` to unwritten pages), and an empty-but-anchored `== Bibliography` heading
  - [x] Task 1.3. Re-verify at writing time the baseline (latest 5.6.x or a released 6.0, Java requirement, Plugins Manager 2.0, jmeter-maven-plugin 3.8.x, JMeter Java DSL 2.3, gRPC Request plugin 2.0.x and the zalopay-oss archive status, `jpgc-casutg` / `jpgc-tst` versions) and record the verified values in a brief file in the scratchpad for later groups; also write the shared page-agent brief there
  - [x] Task 1.4. Run the group gate

### Group 2 -- Foundations pages (rows 2-7)

Parallelizable: yes

- [x] Task 2. Write `introduction-and-architecture.adoc` -- "Introduction & Architecture" ★ (row 2)
  - [x] Task 2.1. Create the page per row 2, `== References`
  - [x] Task 2.2. Create `jmeter-architecture.svg` and the element-family mind-map Mermaid and reference them
- [x] Task 3. Write `performance-testing-fundamentals.adoc` -- "Performance Testing Fundamentals" ★ (row 3)
  - [x] Task 3.1. Create the page per row 3 (test types, criteria, lifecycle, workload modelling, open vs closed models, Little's Law with Bookshelf numbers, percentiles, APDEX, coordinated omission); cite the books by chapter
  - [x] Task 3.2. Create `jmeter-test-types.svg` and the lifecycle Mermaid and reference them
- [x] Task 4. Write `installation-and-configuration.adoc` -- "Installation & Configuration" (row 4)
  - [x] Task 4.1. Create the page per row 4 (Java, checksum / PGP verification, layout table, `HEAP` / `JVM_ARGS` / `setenv.sh`, property files and load order, classpath, logging, proxy, Docker with a community image)
- [x] Task 5. Write `gui-and-test-plan-workflow.adoc` -- "GUI & Test Plan Workflow" (row 5)
  - [x] Task 5.1. Create the page per row 5
- [x] Task 6. Write `test-plan-elements-execution-order-and-scoping.adoc` -- "Test Plan Elements, Execution Order & Scoping" ★ (row 6)
  - [x] Task 6.1. Create the page per row 6 with worked scoping examples
  - [x] Task 6.2. Create `jmeter-scoping.svg` and the execution-order Mermaid and reference them
- [x] Task 7. Write `properties-variables-and-functions.adoc` -- "Properties, Variables & Functions" ★ (row 7)
  - [x] Task 7.1. Create the page per row 7 with the grouped function catalogue table; verify function names against `functions.html`
- [x] Task 8. Group 2 gate: build and validate
  - [x] Task 8.1. Run `npx antora antora-playbook.yml`; fix `xref` / AsciiDoc warnings in this group's files
  - [x] Task 8.2. Run the three `image::` greps, the unquoted-comma alt-text grep on this group's `.adoc` files, the inline-code substitution grep on `build/site/backend/jmeter`, the admonition grep and `npm run validate:mermaid`; all must print nothing / parse every diagram
  - [x] Task 8.3. Confirm every new SVG is referenced and no `xref:` points to a not-yet-written page

### Group 3 -- Load modelling pages (rows 8-11)

Parallelizable: yes

- [x] Task 9. Write `thread-groups-concurrent-users-and-ramp-up.adoc` ★ (row 8)
  - [x] Task 9.1. Create the page per row 8 with every Thread Group field and worked smoke / load / soak numbers
  - [x] Task 9.2. Create `jmeter-ramp-up.svg` and reference it
- [x] Task 10. Write `open-model-and-throughput-control.adoc` ★ (row 9)
  - [x] Task 10.1. Create the page per row 9 (Open Model Thread Group marked experimental, Constant and Precise Throughput timers, Throughput Controller, a 20 req/s Bookshelf example per option)
  - [x] Task 10.2. Create `jmeter-open-vs-closed-model.svg` and the "which load model?" Mermaid and reference them
- [x] Task 11. Write `timers-and-think-time.adoc` (row 10)
  - [x] Task 11.1. Create the page per row 10 with the timer comparison table
- [x] Task 12. Write `logic-controllers-and-transactions.adoc` (row 11)
  - [x] Task 12.1. Create the page per row 11 with the Bookshelf user-journey Mermaid and the 60/30/10 transaction mix
- [x] Task 13. Group 3 gate: build and validate (same checks as Task 8, scoped to this group; xrefs only to Groups 1-3 pages)

### Group 4 -- HTTP testing pages (rows 12-19)

Parallelizable: yes

- [x] Task 14. Write `http-requests.adoc` ★ (row 12)
  - [x] Task 14.1. Create the page per row 12 (every HTTP Request field, HTTPS, DNS, throttling) with the first Bookshelf test and the request sequence Mermaid
- [x] Task 15. Write `http-sessions-headers-cookies-and-authentication.adoc` (row 13)
  - [x] Task 15.1. Create the page per row 13 with the JWT bearer flow, linking the OAuth section
- [x] Task 16. Write `rest-json-graphql-and-soap-apis.adoc` ★ (row 14)
  - [x] Task 16.1. Create the page per row 14; state that JMeter has no OpenAPI importer
- [x] Task 17. Write `recording-and-curl-import.adoc` ★ (row 15)
  - [x] Task 17.1. Create the page per row 15 with the recorder TLS sequence Mermaid; do not mention the removed WorkBench as current
- [x] Task 18. Write `parameterization-and-test-data.adoc` ★ (row 16)
  - [x] Task 18.1. Create the page per row 16 with every CSV Data Set Config field
  - [x] Task 18.2. Create `jmeter-csv-sharing-modes.svg` and reference it
- [x] Task 19. Write `correlation-and-extractors.adoc` ★ (row 17)
  - [x] Task 19.1. Create the page per row 17 with the extractor fields and the extraction sequence Mermaid
- [x] Task 20. Write `assertions.adoc` (row 18)
  - [x] Task 20.1. Create the page per row 18 with the assertion cost table
- [x] Task 21. Write `scripting-with-jsr223-and-groovy.adoc` ★ (row 19)
  - [x] Task 21.1. Create the page per row 19 with the compiled-script caching rule (no `${var}` in cached scripts) and the recipes
- [x] Task 22. Group 4 gate: build and validate (same checks as Task 8, scoped to this group)

### Group 5 -- Other protocols, plugins and gRPC pages (rows 20-25)

Parallelizable: yes

- [x] Task 23. Write `database-testing-with-jdbc.adoc` (row 20)
  - [x] Task 23.1. Create the page per row 20
- [x] Task 24. Write `messaging-jms-mail-and-tcp.adoc` (row 21)
  - [x] Task 24.1. Create the page per row 21, linking the Messaging section
- [x] Task 25. Write `other-samplers.adoc` (row 22)
  - [x] Task 25.1. Create the page per row 22 with the sampler overview table, linking the Neo4j section
- [x] Task 26. Write `plugins-and-plugins-manager.adoc` ★ (row 23)
  - [x] Task 26.1. Create the page per row 23 (GUI and `PluginsManagerCMD` installs, manual jars, Maven `<jmeterExtensions>`, plugin catalogue with maintenance status) with the install flow Mermaid
- [x] Task 27. Write `custom-thread-groups-and-load-shaping.adoc` (row 24)
  - [x] Task 27.1. Create the page per row 24
  - [x] Task 27.2. Create `jmeter-load-profiles.svg` and reference it
- [x] Task 28. Write `grpc-load-testing.adoc` ★ (row 25)
  - [x] Task 28.1. Create the page per row 25: honest plugin status (zalopay-oss archived, bakthava 2.0.x), every field, Bookshelf `LoanService` end to end with `bookshelf.proto`, correlation, assertions, CLI / distributed runs, unary-only limit, alternatives; links to the Spring Boot gRPC pages
  - [x] Task 28.2. Create `jmeter-grpc-plugin-setup.svg` and the gRPC sequence Mermaid and reference them
- [x] Task 29. Group 5 gate: build and validate (same checks as Task 8, scoped to this group)

### Group 6 -- Running tests and results pages (rows 26-30)

Parallelizable: yes

- [x] Task 30. Write `running-tests-in-cli-mode.adoc` ★ (row 26)
  - [x] Task 30.1. Create the page per row 26 with the full option table and sample output from a real CLI run where feasible
- [x] Task 31. Write `listeners-and-results-files.adoc` (row 27)
  - [x] Task 31.1. Create the page per row 27
  - [x] Task 31.2. Create `jmeter-timing-breakdown.svg` and reference it
- [x] Task 32. Write `html-dashboard-report.adoc` ★ (row 28)
  - [x] Task 32.1. Create the page per row 28
  - [x] Task 32.2. Create `jmeter-dashboard-anatomy.svg` (schematic, not a screenshot) and reference it
- [x] Task 33. Write `real-time-monitoring-with-backend-listener.adoc` (row 29)
  - [x] Task 33.1. Create the page per row 29 with the metrics-flow Mermaid, linking the Prometheus / Grafana and Spring Boot observability pages
- [x] Task 34. Write `analyzing-results-and-finding-bottlenecks.adoc` ★ (row 30)
  - [x] Task 34.1. Create the page per row 30
  - [x] Task 34.2. Create `jmeter-saturation-curve.svg` and reference it
- [x] Task 35. Group 6 gate: build and validate (same checks as Task 8, scoped to this group)

### Group 7 -- Scaling, automation and reference pages (rows 31-38)

Parallelizable: yes

- [x] Task 36. Write `distributed-testing.adoc` ★ (row 31)
  - [x] Task 36.1. Create the page per row 31 (RMI over SSL, keystore, ports, sample senders, failed workers; Kubernetes link)
  - [x] Task 36.2. Create `jmeter-distributed-topology.svg` and the remote-start sequence Mermaid and reference them
- [x] Task 37. Write `best-practices-and-load-generator-tuning.adoc` (row 32)
  - [x] Task 37.1. Create the page per row 32 with the checklist table
- [x] Task 38. Write `ci-cd-with-maven-docker-and-github-actions.adoc` ★ (row 33)
  - [x] Task 38.1. Create the page per row 33 with the CI pipeline Mermaid; link the Spring Boot JMeter page and the Docker CI/CD and Compose pages instead of repeating them; state there is no official Docker image or Gradle plugin
- [x] Task 39. Write `programmatic-test-plans-and-dsls.adoc` (row 34)
  - [x] Task 39.1. Create the page per row 34
- [x] Task 40. Write `extending-jmeter.adoc` (row 35)
  - [x] Task 40.1. Create the page per row 35 with the extension-points class diagram Mermaid (stereotypes as `&lt;&lt;interface&gt;&gt;`)
- [x] Task 41. Write `troubleshooting-and-debugging.adoc` (row 36)
  - [x] Task 41.1. Create the page per row 36 with the symptom -> cause -> fix table
- [x] Task 42. Write `security-and-responsible-load-testing.adoc` (row 37)
  - [x] Task 42.1. Create the page per row 37
- [x] Task 43. Write `whats-changed-and-migration.adoc` (row 38)
  - [x] Task 43.1. Create the page per row 38 with the version timeline (Mermaid `timeline` or SVG `jmeter-timeline.svg`, referenced), 6.0 described as planned, and the "outdated idiom -> current practice" table
- [x] Task 44. Group 7 gate: build and validate (same checks as Task 8, scoped to this group)

### Group 8 -- Cheat sheet page and PDF (row 39)

Parallelizable: yes

- [x] Task 45. Create the cheat sheet
  - [x] Task 45.1. Create `modules/ROOT/pages/backend/jmeter/cheat-sheet.adoc` ("Cheat Sheet (PDF)"): disclaimer include, short on-page summary, link to `jmeter-cheat-sheet.pdf` using the mechanism of the existing cheat sheets
  - [x] Task 45.2. Install `reportlab` (`pip install reportlab`) and generate `modules/ROOT/attachments/jmeter-cheat-sheet.pdf`: a single A4 page, colour-coded and multi-column with the JMeter version and date in the header, covering every item of the issue's "Cheat sheet" minimum-content list; check `pdfinfo` reports 1 page and render it to an image to confirm it is legible
  - [x] Task 45.3. Run the Group 8 gate

### Group 9 -- Index completion, nav, back-links and final verification

Parallelizable: no -- Tasks 47-49 edit shared files and depend on all pages from Groups 1-8 existing; Task 46 must land before them.

- [x] Task 46. Complete `backend/jmeter/index.adoc`
  - [x] Task 46.1. Replace the page-list placeholder with the full list in outline order (`xref:` to every page and the cheat sheet)
  - [x] Task 46.2. Fill `== Bibliography` with every source from the issue's Bibliography section, each linked to its official site (publisher pages for the three books), excluding the blacklisted URLs; check links resolve (Packt and Springer block bots, so caveat or verify in a browser; APDEX site per the issue note)
  - [x] Task 46.3. Add forward cross-links between pages where group isolation postponed them
- [x] Task 47. Navigation and landing pages
  - [x] Task 47.1. `modules/ROOT/nav.adoc`: add `*** xref:backend/jmeter/index.adoc[JMeter]` after the Apache Tika cheat-sheet line and before `** xref:apps/index.adoc[Apps]`, with `****` children in outline order ending with `**** xref:backend/jmeter/cheat-sheet.adoc[Cheat Sheet (PDF)]`; labels identical to each page's `= Title`
  - [x] Task 47.2. `modules/ROOT/pages/backend/index.adoc`: add the JMeter bullet last under `== Sections` (ending "plus a downloadable cheat sheet"), update `:description:` and extend `:keywords:` with the issue's list
  - [x] Task 47.3. `modules/ROOT/pages/index.adoc`: mention JMeter / load testing in `:description:` and add `JMeter, load testing, performance testing` to `:keywords:`
- [x] Task 48. Back-links (one line each, verified targets)
  - [x] Task 48.1. Add pointers in `backend/springboot/performance-testing-jmeter.adoc` (top and references), `backend/springboot/cheat-sheet.adoc`, `backend/springboot/grpc-apis.adoc`, `backend/springboot/metrics-and-observability.adoc`, `backend/docker/ci-cd-with-github-actions.adoc` and `database/prometheus/grafana-dashboards-and-visualization.adoc`; keep plugin and JMeter versions consistent with the new section
- [x] Task 49. Split read-only review (4 agents, one block of pages each)
  - [x] Task 49.1. Check cross-page contradictions, authoring leftovers and factual claims against the official docs; fix findings
  - [x] Task 49.2. Grep the section for "scratch", "this review", "/Users/", "/var/folders", first-person voice and any real username or local path in sample output
- [x] Task 50. Final verification
  - [x] Task 50.1. Run `npx antora antora-playbook.yml` for the whole site: no errors or warnings for the new files; spot-check rendering in `build/site/backend/jmeter`
  - [x] Task 50.2. Run all `CLAUDE.md` greps (block / inline `image::` closure, `<p>image::` leak, unquoted-comma alt text on changed files, inline-code substitutions on `build/site/backend/jmeter`), the admonition grep and `npm run validate:mermaid`
  - [x] Task 50.3. Check that every `jmeter-*.svg` is referenced, every `image::` target exists, every page has `== References` and the disclaimer include, every page except `index.adoc` is linked from `index.adoc` and the nav, and the 38 pages + cheat sheet + PDF all exist (`pdfinfo` = 1 page)
  - [x] Task 50.4. Ensure `modules/ROOT/.DS_Store`, `api2.txt`, `.secrets.baseline` changes unrelated to this work, and build output are not staged
