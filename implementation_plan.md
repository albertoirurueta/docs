# Implementation Plan: Backend Development / Spring Batch Reference

## Task summary

Source: GitHub issue #82

Issue [#82](https://github.com/albertoirurueta/docs/issues/82) ("Add \"Spring Batch Reference\" documentation
section under Guides & References / Backend Development") asks to add a new **"Spring Batch Reference"**
subsection under the existing **Guides & References / Backend Development** guide, at
`modules/ROOT/pages/backend/spring-batch/` — the third sibling of the existing `programming-languages/java/` and
`backend/springboot/` subsections. It documents **Spring Batch** as a batch-developer reference — the domain
language (jobs, steps, executions, the job repository), configuring and running jobs, chunk-oriented and tasklet
steps, fault tolerance, `ItemReader`/`ItemProcessor`/`ItemWriter`, scaling and partitioning, Spring Batch
Integration, observability, cloud-native batch, and testing — plus a one-page downloadable PDF cheat sheet.
Content is written and verified against **the current Spring Batch line** (6.0.x on Spring Framework 7 / Spring
Boot 4.1.x, Java 17+ baseline; no specific patch version pinned) at
https://docs.spring.io/spring-batch/reference/. Explanations must be brief and example-driven; **every concept
carries at least one runnable example** (`[source,java]` Java-config `@Bean` definitions as the primary style,
plus `[source,xml]` / `[source,yaml]` / `[source,properties]` / `[source,sql]` where useful) and links to the
specific official documentation page it documents. `[mermaid]` diagrams and hand-authored SVG figures (under
`modules/ROOT/images/`, named `spring-batch-*.svg`) are used only where they clarify a concept.

One PDF book was consulted while planning this section — Michael T. Minella, *The Definitive Guide to Spring
Batch: Modern Finite Batch Processing in the Cloud*, 2nd ed., Apress, 2019, ISBN 978-1-4842-3723-6 /
978-1-4842-3724-3. Its code targets **Spring Boot 2.1.x / Spring Batch 4.x on Java 8** and predates the removal
of `JobBuilderFactory`/`StepBuilderFactory`/`@EnableBatchProcessing`'s auto-config-disabling behavior/
`BatchConfigurer`, the `javax.*` → `jakarta.*` move, the resourceless job-repository default, the MongoDB job
repository, the unified `JobOperator`/`JobRepository`, Spring Framework 7 retry (replacing Spring Retry), the
`CommandLineJobOperator`, `recover()`/`StoppableStep`, and JUnit 5-only testing. It is cited **only** as a
bibliography entry, never as "the primary/main reference" for any page. The official Spring Batch reference
documentation is the source every page is written and verified against; where the book and the current
documentation disagree, the official documentation wins and the difference is noted.

This is the same pattern already used for the Java, Hibernate, and SpringBoot reference sections in
`backend/`, and for the Elasticsearch/MongoDB/Couchbase sections in `database/`. The closest structural precedent
is [.archive/implementation_plan_70.md](.archive/implementation_plan_70.md) (issue #70, "Elasticsearch
Reference") — the issue itself names this as the closest analog for structure and for the "admonitions carry no
source attribution" deviation — a new `<area>/<tech>/` subsection grounded in an official doc site plus a
bibliography-only book that predates the current version, with mermaid diagrams, hand-authored SVG figures, a
`== Bibliography`, and a headless-Chrome-rendered one-page PDF cheat sheet, organized into four dependency-ordered
task groups. This plan follows that same four-group shape.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **All 25 pages from the issue's proposed page structure are kept as separate pages** (no consolidation) — each
   already maps to a substantial, self-contained area of the official documentation (comparable in scope to the
   Elasticsearch section's 22 content pages), so no merge is warranted. If a downstream `iru-code` run finds two
   pages too thin once drafted, it may merge them (the issue explicitly allows this) — not re-planned as separate
   tasks here.
2. **`[source,java]` is the primary example style** (the `JobBuilder`/`StepBuilder`/`*ItemReaderBuilder` Java-config
   idiom the current docs use), with `[source,xml]` for the `spring-boot-starter-batch` dependency,
   `[source,yaml]`/`[source,properties]` for `application.yml`/`spring.batch.*`, and `[source,sql]` for the
   metadata schema — matching the issue's explicit requirement and the existing `backend/springboot/spring-batch.adoc`
   page's style. No `source-highlighter` is configured in `antora-playbook.yml`; Antora renders these as plain
   monospace blocks, consistent with the rest of the site.
3. **Document the current Spring Batch line as published at https://docs.spring.io/spring-batch/reference/**, not
   pinned to a patch version — "6.0.x on Spring Framework 7 / Spring Boot 4.1.x, Java 17+ baseline" — mirroring
   the "current line, no patch pinned" convention of the `springboot-disclaimer.adoc` / `elasticsearch-disclaimer.adoc`
   partials. Examples use the current builder idiom (`new JobBuilder("name", jobRepository)`,
   `new StepBuilder("name", jobRepository).<In,Out>chunk(size, tx)`, the 6.0 `ChunkOrientedStepBuilder` where
   relevant); the book's `JobBuilderFactory`/`StepBuilderFactory`/`BatchConfigurer`/`@EnableBatchProcessing`
   idiom, and any other Spring Batch 4.x-era pattern the book uses, is shown only where the page explicitly notes
   it as removed/changed in 6.0.
4. **The disclaimer partial and every per-page admonition name no source at all** (stricter than the
   Elasticsearch precedent's "book-free" variant, per the issue's explicit requirement): no mention of the
   Minella book, "the consulted book", or "the sources below" **anywhere** in an admonition — not even naming the
   official documentation as "the reference this was written from". The `spring-batch-disclaimer.adoc` partial
   states the Spring Batch line documented, the official doc site it targets, and the AI-assistance caveat (the
   same shape as `elasticsearch-disclaimer.adoc`, which does name the official doc site in that role — the issue's
   "no source" rule targets book/consulted-source framing, and normal cross-referencing to a specific official
   page remains fine throughout). All source attribution — official doc pages *and* the book — lives **only** in
   `index.adoc`'s `== Bibliography`.
5. **The subsection is named "Spring Batch Reference"** in the section index title, the `backend/index.adoc`
   bullet, the `nav.adoc` `***` entry — matching the existing "Java Reference"/"SpringBoot Reference" siblings.
6. **Placed after "SpringBoot Reference"**, as the third subsection of Backend Development, in `nav.adoc` and
   `backend/index.adoc` — the issue's own explicit placement instruction (after the SpringBoot Reference block's
   final `**** … Cheat Sheet (PDF)` line, before `** xref:apps/index.adoc[Apps]`).
7. **Mermaid is the default for flow/sequence/state diagrams; a handful of hand-authored SVGs** where a spatial
   figure is clearer, per the issue's suggested list — the batch domain model, the metadata-table ER diagram, the
   partitioning topology, and the remote-chunking topology are strong SVG candidates (spatial/relational
   structure); the chunk-oriented read/process/write loop (already partly sketched as Mermaid in
   `backend/springboot/spring-batch.adoc` and promoted here), the `BatchStatus`/`ExitStatus` lifecycle, and step
   flow with a `JobExecutionDecider` are Mermaid. The implementer may add or drop a figure while writing a page if
   it changes the value — not re-planned as separate tasks. **No diagram where a short code block or small table
   is clearer.**
8. **No project-picker icon/xref and no root `index.adoc` update**: like Java/Hibernate/SpringBoot Reference, this
   subsection lives only under `backend/index.adoc` and the nav, not as a remote-component picker tile on the
   site home page — the issue's file list never mentions `modules/ROOT/pages/index.adoc`.
9. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
   layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
   static checked-in asset at `modules/ROOT/attachments/spring-batch-cheat-sheet.pdf`, no HTML source committed.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root (`ROOT`) component for the
  "Irurueta Docs" site. The Spring Batch section is entirely new `.adoc` files plus small wiring edits.
- **`antora-playbook.yml`** — wires the `ROOT` local component (`url: .`), the UI bundle, `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks), and `@djencks/asciidoctor-mathjax`. No
  `source-highlighter` is set. `build/` is gitignored. Build command: `npx antora antora-playbook.yml` (no
  lint/test suite; success = build completes with no `xref`/AsciiDoc/mermaid errors and **zero** "skipping
  reference to missing attribute" warnings, and `build/site` renders).
- **`modules/ROOT/nav.adoc`** — the Backend Development block (`nav.adoc:466-536`) is:
  ```
  ** xref:backend/index.adoc[Backend Development]
  *** xref:programming-languages/java/index.adoc[Java Reference]   (elsewhere, referenced from backend/index.adoc)
  *** xref:backend/hibernate/index.adoc[Hibernate Reference]
  **** … (31 **** lines) …
  *** xref:backend/springboot/index.adoc[SpringBoot Reference]
  **** … (35 **** lines) …
  **** xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]     ← last SpringBoot line (nav.adoc:535)
  ** xref:apps/index.adoc[Apps]                                        ← next entry (nav.adoc:536)
  ```
  The new `*** xref:backend/spring-batch/index.adoc[Spring Batch Reference]` block with its `****` page lines is
  inserted between `nav.adoc:535` and `nav.adoc:536`.
- **`modules/ROOT/pages/backend/index.adoc`** — `= Backend Development`, a lead paragraph, and a `== Sections`
  list currently holding three bullets (Java Reference, Hibernate Reference, SpringBoot Reference). Add a Spring
  Batch Reference bullet after the SpringBoot Reference one; extend `:description:`/`:keywords:` to mention
  Spring Batch.
- **`modules/ROOT/pages/backend/springboot/spring-batch.adoc`** (added by #61, ~230 lines) — a Spring-Boot-
  integration-focused overview: what batch processing is, jobs/steps/chunks with a Mermaid chunk-loop diagram,
  job metadata & restartability, Spring Boot auto-configuration (`spring-boot-starter-batch`, `initialize-schema`,
  the `@EnableBatchProcessing` warning), a runnable chunk job (`FlatFileItemReader` → `ItemProcessor` →
  `JdbcBatchItemWriter`), and a brief "Scaling (in brief)" section closing with: *"the future deep-dive guide and
  the [reference] cover them in detail"* and, in `== What batch processing is`, the sentence *"A dedicated
  in-depth guide to Spring Batch will follow; here the goal is only to place the moving parts and show one
  runnable job."* — this sentence must be replaced with an `xref:backend/spring-batch/index.adoc[Spring Batch
  Reference]` pointer, plus one additional cross-link near the top. **Keep the rest of the page as-is** — do not
  restate its content in the new section (only cross-link back to it, e.g. from
  `batch-infrastructure-configuration.adoc`/`configuring-a-job.adoc`, for the Boot auto-configuration specifics).
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — has a one-line `spring-batch.adoc` blurb in
  `=== ORM, search & batch` (~line 78) and already lists the Minella book in its own `== Bibliography` (~line
  334, unchanged by this plan). Update the blurb to also mention
  `xref:backend/spring-batch/index.adoc[Spring Batch Reference]`.
- **`modules/ROOT/partials/`** — one disclaimer partial per section. `elasticsearch-disclaimer.adoc` (book-free:
  states the line documented, the official source it targets, and the AI-assistance caveat, no book named) is the
  closest structural model; the new `spring-batch-disclaimer.adoc` follows the same shape (choice 4).
  `springboot-disclaimer.adoc` is the sibling this new section sits directly under in the nav and is the other
  structural reference for wording register.
- **`modules/ROOT/pages/database/elasticsearch/`** and **`backend/hibernate/`** (both large, mature reference
  subsections) — the shape to mirror. Page shape: `= Title` → `:description:` → `:keywords:` → blank line →
  `include::partial$spring-batch-disclaimer.adoc[]` → one/two-sentence lead → `==` sections. `index.adoc` =
  header + disclaimer include + lead + `== What's covered` (one bullet per page, grouped) + `== Bibliography`.
  `cheat-sheet.adoc` = header + disclaimer include + short intro + grouped `xref:` back-links +
  `xref:attachment$spring-batch-cheat-sheet.pdf[…]`.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures, one prefix per section, embedded
  with `image::<name>.svg[Alt text]`, authored for both light and dark themes.
- **`modules/ROOT/attachments/`** — flat directory of checked-in `*-cheat-sheet.pdf` files, linked with
  `xref:attachment$<name>.pdf[…]`. No HTML sources are checked in.
- **`.claude/skills/` `*-code-one-task`** — only `java`, `dotnet`, and `database` keys are installed
  (`iru-java-code-one-task`, `iru-dotnet-code-one-task`, `iru-database-code-one-task`); none apply to this
  docs-only repo (AsciiDoc content, no application code), so no task below carries a language/framework tag —
  every task is implemented directly by `iru-code-one-task-group`'s fallback path. There is no test/coverage/
  quality gate for a docs-only change; the only verification is the Antora build (the final task), run via a
  sub-agent to keep the main context clean.
- **AsciiDoc gotcha**: inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference
  and emits a "skipping reference to missing attribute" build warning. Escape literal braces in prose as
  `\{ … }`; inside `[source]` blocks no escaping is needed. This matters for SpEL late-binding expressions such
  as `#{jobParameters['run.date']}` and `#{stepExecutionContext['fileName']}` — keep them inside `[source]`
  blocks or escape braces in prose. The final build must have **zero** such warnings.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma-separated list), a blank
  line, then `include::partial$spring-batch-disclaimer.adoc[]`, then a one/two-sentence lead.
- **Brief, example-driven prose.** Every distinct concept on the page gets **at least one runnable example**
  (`[source,java]` as the primary style; `[source,xml]`/`[source,yaml]`/`[source,properties]`/`[source,sql]`
  where useful) **and at least one link to the specific
  `https://docs.spring.io/spring-batch/reference/<area>.html` (or `https://docs.spring.io/spring-boot/reference/io/spring-batch.html`)
  page** it documents.
- **No source is ever named in an admonition or in prose as "what this was written from".** Source attribution
  (official doc pages and the book) appears **only** in `index.adoc`'s `== Bibliography`. Cross-referencing a
  specific official doc page for further detail is fine and encouraged; admonitions otherwise carry only the
  AI-assistance/verify-before-production caveat.
- **Current builder idiom only**: `new JobBuilder("name", jobRepository)` / `new StepBuilder("name", jobRepository)`
  (and the 6.0 `ChunkOrientedStepBuilder` where relevant). The removed `JobBuilderFactory`/`StepBuilderFactory`/
  `BatchConfigurer` idiom, and any other 4.x-era pattern, is shown only to note it as removed/changed — never as
  the documented way to do something.
- **Diagrams**: `[mermaid]` for flow/sequence/state diagrams; hand-authored inline **SVG** under
  `modules/ROOT/images/` named `spring-batch-*.svg` for spatial/relational figures (choice 7); **no diagram where
  a code block or small table is clearer.**
- **Cross-links**: `xref:backend/spring-batch/<page>.adoc[…]` between sibling pages in this section;
  `xref:backend/springboot/spring-batch.adoc[…]` back to the short Boot-integration page for auto-configuration
  specifics (not restated here); `xref:backend/springboot/spring-data-jpa.adoc[…]` and
  `xref:database/sql/index.adoc[…]` from the database `ItemReader`/`ItemWriter` pages instead of restating
  JPA/SQL basics.
- Every page must be reachable from both `modules/ROOT/pages/backend/spring-batch/index.adoc` and
  `modules/ROOT/nav.adoc` once the wiring group lands.
- **Escape literal `{ }` in prose** as `\{ … }` (the AsciiDoc gotcha above) — this matters especially for SpEL
  late-binding expressions.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–3 page includes the partial it creates).

- [x] Task 1. Create the Spring Batch disclaimer partial —
  `modules/ROOT/partials/spring-batch-disclaimer.adoc`
  - [x] Task 1.1. Author it as an `[IMPORTANT]` / `====` admonition following the `elasticsearch-disclaimer.adoc`
    shape (choice 4). It must state, in order: (a) this section documents **the current Spring Batch line**
    (6.0.x on Spring Framework 7 / Spring Boot 4.1.x, Java 17+ baseline) as published at
    https://docs.spring.io/spring-batch/reference/[the Spring Batch reference documentation]; no specific patch
    version is pinned; some surfaces (Spring Cloud Task / Spring Cloud Data Flow orchestration, the
    deployer-based partition handler, JSR-352) are **linked, not documented in depth**; (b) this content was
    generated with the assistance of AI and should be verified against
    https://docs.spring.io/spring-batch/reference/[the official documentation] before being relied on in
    production. **It must not name any book, "consulted references", or "the sources below".**
  - [x] Task 1.2. Confirm the include path is `include::partial$spring-batch-disclaimer.adoc[]` (Antora resolves
    `partial$` to `modules/ROOT/partials/`) — this exact line is placed after the header on every page created in
    Groups 2–3.

### Group 2 — Content pages

**Parallelizable: yes** — 25 independent pages (Tasks 2–26). Each includes the Group 1 disclaimer partial and
only cross-links other pages by `xref:` (no page needs another Group 2 page's finished text). Each page also
authors any `spring-batch-*.svg` figure it embeds. Consolidated validation for the group is the final build task.

- [x] Task 2. Create `modules/ROOT/pages/backend/spring-batch/getting-started.adoc` — What Spring Batch is &
  running a first job
  - [x] Task 2.1. Spring Batch as a lightweight framework for **finite, bounded bulk processing** — explicitly
    **not** a scheduler (runs under cron / Quartz / Control-M / a Kubernetes `CronJob`); a short history
    (Accenture + SpringSource origin, JSR-352 alignment).
  - [x] Task 2.2. Module layout: `spring-batch-core`, `spring-batch-infrastructure`, `spring-batch-test`,
    `spring-batch-integration`, and `spring-boot-starter-batch`; the release line (6.0.x on Spring Framework 7 /
    Spring Boot 4.1.x, Java 17+).
  - [x] Task 2.3. A first runnable "Hello, World" job with `new JobBuilder("...", jobRepository)` /
    `new StepBuilder("...", jobRepository)` and a single tasklet step; how to run it (Boot startup via
    `spring.batch.job.name` vs. on demand).
  - [x] Task 2.4. Forward-pointers to `jobs-instances-and-parameters.adoc`, `chunk-oriented-processing.adoc`, and
    `xref:backend/springboot/spring-batch.adoc[Spring Batch (SpringBoot Reference)]` for the Boot
    auto-configuration specifics.
  - [x] Task 2.5. Links: https://docs.spring.io/spring-batch/reference/spring-batch-intro.html,
    https://docs.spring.io/spring-batch/reference/whatsnew.html,
    https://docs.spring.io/spring-boot/reference/io/spring-batch.html
- [x] Task 3. Create `modules/ROOT/pages/backend/spring-batch/architecture-and-processing-strategies.adoc` —
  Architecture & processing strategies
  - [x] Task 3.1. The layered architecture (application / core / infrastructure) and the batch stereotypes
    overview; general batch principles & guidelines (idempotent steps, keep steps small, log liberally). Embed a
    `[mermaid]` diagram of the layered architecture if it clarifies the layering more than prose.
  - [x] Task 3.2. Batch processing strategies: the normal batch window, concurrent batch + online access with
    logical locking, parallel processing, and partitioning — with the six partitioning break-up approaches
    (fixed-length, range, list, hashing, modulus, and custom).
  - [x] Task 3.3. Links: https://docs.spring.io/spring-batch/reference/spring-batch-architecture.html
- [x] Task 4. Create `modules/ROOT/pages/backend/spring-batch/jobs-instances-and-parameters.adoc` — Jobs,
  instances & parameters
  - [x] Task 4.1. `Job` as a container of an ordered sequence of `Step`s plus global configuration.
    `JobInstance` = a `Job` + its *identifying* `JobParameters`. `JobParameters`: typing, the `identifying` flag,
    and what "resume where you left off" vs. "start fresh" means in practice.
  - [x] Task 4.2. `JobExecution` — `BatchStatus`, `ExitStatus`, `startTime`/`endTime`/`failureExceptions`; the
    job lifecycle as a small state machine. Embed a `[mermaid]` state diagram of `BatchStatus` transitions
    (choice 7).
  - [x] Task 4.3. Runnable example: a `JobParametersValidator`-friendly job launched with a unique `run.id` via
    `RunIdIncrementer`, showing two `JobExecution`s of the same `JobInstance`.
  - [x] Task 4.4. Links: https://docs.spring.io/spring-batch/reference/domain.html
- [x] Task 5. Create `modules/ROOT/pages/backend/spring-batch/steps-executions-and-context.adoc` — Steps,
  executions & the `ExecutionContext`
  - [x] Task 5.1. `Step` as an independent, sequential phase; `StepExecution` and its counters (`readCount`,
    `writeCount`, `commitCount`, `rollbackCount`, `filterCount`, `readSkipCount`, `processSkipCount`,
    `writeSkipCount`).
  - [x] Task 5.2. The `ExecutionContext` — one per `JobExecution`, one per `StepExecution`; step-scoped context is
    saved at each commit point, job-scoped context between steps; the `Serializable` constraint on stored values.
  - [x] Task 5.3. Reading/writing the context and **promoting keys job-ward** with
    `ExecutionContextPromotionListener` to pass data between steps — a runnable `@Bean` example.
  - [x] Task 5.4. Links: https://docs.spring.io/spring-batch/reference/domain.html,
    https://docs.spring.io/spring-batch/reference/common-patterns.html
- [x] Task 6. Create `modules/ROOT/pages/backend/spring-batch/batch-infrastructure-configuration.adoc` —
  Infrastructure configuration
  - [x] Task 6.1. `@EnableBatchProcessing` and why to **leave it off under Spring Boot** (it disables the
    auto-configuration); the 6.0 split into `@EnableBatchProcessing` (common attributes, e.g. `taskExecutorRef`)
    plus `@EnableJdbcJobRepository` / `@EnableMongoJobRepository` for explicit manual configuration.
  - [x] Task 6.2. `DefaultBatchConfiguration` for full manual control (extending it and overriding beans); the
    **resourceless infrastructure default** (`ResourcelessJobRepository` / `ResourcelessTransactionManager` — no
    database needed to try Spring Batch).
  - [x] Task 6.3. The 6.0 interface unification: `JobRepository` extends `JobExplorer`; `JobOperator` extends
    `JobLauncher`; `JobRegistry` is optional with automatic registration.
  - [x] Task 6.4. Cross-link `xref:backend/springboot/spring-batch.adoc[Spring Batch (SpringBoot Reference)]` for
    the concrete `spring-boot-starter-batch` auto-configuration walkthrough (not restated here).
  - [x] Task 6.5. Links: https://docs.spring.io/spring-batch/reference/job.html,
    https://docs.spring.io/spring-batch/reference/whatsnew.html,
    https://docs.spring.io/spring-boot/reference/io/spring-batch.html
- [x] Task 7. Create `modules/ROOT/pages/backend/spring-batch/job-repository-and-metadata-schema.adoc` — The job
  repository & metadata schema
  - [x] Task 7.1. The metadata tables: `BATCH_JOB_INSTANCE`, `BATCH_JOB_EXECUTION`,
    `BATCH_JOB_EXECUTION_PARAMS`, `BATCH_JOB_EXECUTION_CONTEXT`, `BATCH_STEP_EXECUTION`,
    `BATCH_STEP_EXECUTION_CONTEXT`, and the sequences; a `[source,sql]` excerpt of the schema shape. Consider
    embedding `image::spring-batch-metadata-schema.svg[…]` (an ER diagram of the tables) (choice 7).
  - [x] Task 7.2. Per-vendor DDL location (`org/springframework/batch/core/schema-*.sql`);
    `spring.batch.jdbc.initialize-schema` (`always` / `embedded` / `never`), `table-prefix`, `platform`.
  - [x] Task 7.3. JDBC vs. MongoDB vs. resourceless repositories; the `ISOLATION_SERIALIZABLE` transaction
    isolation used when creating a `JobExecution`, and why. Cross-link
    `xref:database/sql/ddl.adoc[SQL DDL]`/`xref:database/sql/transactions.adoc[SQL Transactions]`.
  - [x] Task 7.4. Querying history with `JobExplorer`/`JobRegistry`/the `JobOperator` read methods — a runnable
    example listing past executions of a job.
  - [x] Task 7.5. Links: https://docs.spring.io/spring-batch/reference/job.html,
    https://docs.spring.io/spring-batch/reference/schema-appendix.html
- [x] Task 8. Create `modules/ROOT/pages/backend/spring-batch/configuring-a-job.adoc` — Configuring a job
  - [x] Task 8.1. `new JobBuilder("name", jobRepository)`; step ordering with `.start(...)`/`.next(...)`/`.flow(...)`;
    restartability (`.preventRestart()`) and start limits.
  - [x] Task 8.2. `JobParametersValidator` — `DefaultJobParametersValidator` (required/optional keys) and a
    custom validator example.
  - [x] Task 8.3. `JobParametersIncrementer` — `RunIdIncrementer` and a custom date-based incrementer.
  - [x] Task 8.4. `JobExecutionListener` (`@BeforeJob`/`@AfterJob`) — a runnable example logging start/end.
  - [x] Task 8.5. Links: https://docs.spring.io/spring-batch/reference/job.html
- [x] Task 9. Create `modules/ROOT/pages/backend/spring-batch/running-a-job.adoc` — Running a job
  - [x] Task 9.1. `JobLauncher` vs. `JobOperator` (`start`/`stop`/`restart`/`startNextInstance`/`abandon`/
    `recover`); `TaskExecutorJobOperator` and synchronous vs. asynchronous launching.
  - [x] Task 9.2. Spring Boot's `JobLauncherApplicationRunner` with `spring.batch.job.name` /
    `spring.batch.job.enabled`; the 6.0 `CommandLineJobOperator` (replacing `CommandLineJobRunner`) for
    standalone/CLI launches — note the replacement explicitly.
  - [x] Task 9.3. Launching on demand from a `@RestController` endpoint, a `@Scheduled` method, or a Quartz job;
    converting `--key=value` args to `JobParameters`; graceful shutdown.
  - [x] Task 9.4. Links: https://docs.spring.io/spring-batch/reference/job.html,
    https://docs.spring.io/spring-boot/reference/io/spring-batch.html
- [x] Task 10. Create `modules/ROOT/pages/backend/spring-batch/stopping-restart-and-recovery.adoc` — Stopping,
  restart & recovery
  - [x] Task 10.1. Natural completion vs. programmatic stop — the `stop()` transition,
    `StepExecution.setTerminateOnly()`, and the 6.0 `StoppableStep` making external stop work for every step type
    (not just chunk steps).
  - [x] Task 10.2. Job failure and `ExitStatus`; controlling restart (`restartable(false)`, `startLimit`,
    `allowStartIfComplete`); rerunning a completed step.
  - [x] Task 10.3. The 6.0 `JobOperator.recover()` for stranded executions (e.g. after a process crash);
    `NoWorkFoundStepExecutionListener` to fail a step that read nothing.
  - [x] Task 10.4. Links: https://docs.spring.io/spring-batch/reference/step.html,
    https://docs.spring.io/spring-batch/reference/common-patterns.html,
    https://docs.spring.io/spring-batch/reference/whatsnew.html
- [x] Task 11. Create `modules/ROOT/pages/backend/spring-batch/chunk-oriented-processing.adoc` — Chunk-oriented
  processing
  - [x] Task 11.1. The read-one / process-one / accumulate / write-chunk loop; the **commit interval** = chunk
    size = transaction boundary. Promote/adapt the existing Mermaid chunk-loop diagram from
    `backend/springboot/spring-batch.adoc` here as the canonical version (choice 7); leave a simpler pointer in
    the SpringBoot page rather than duplicating it in full.
  - [x] Task 11.2. `CompletionPolicy` for dynamic chunk sizing; the classic
    `new StepBuilder("step", jobRepository).<In,Out>chunk(size, tx)` and the new 6.0 `ChunkOrientedStep` /
    `ChunkOrientedStepBuilder(name, jobRepository, chunkSize)` — note both, current idiom first.
  - [x] Task 11.3. Transaction attributes (propagation, isolation, timeout, `noRollback`); registering an
    `ItemStream` with the step.
  - [x] Task 11.4. Links: https://docs.spring.io/spring-batch/reference/step.html
- [x] Task 12. Create `modules/ROOT/pages/backend/spring-batch/tasklet-steps.adoc` — Tasklet steps
  - [x] Task 12.1. The `Tasklet` interface and `RepeatStatus.FINISHED`/`CONTINUABLE`; `TaskletStep`.
  - [x] Task 12.2. The adapter tasklets: `MethodInvokingTaskletAdapter`, `CallableTaskletAdapter`,
    `SystemCommandTasklet` — a runnable example wrapping an existing service method.
  - [x] Task 12.3. Transaction semantics of a tasklet (one transaction, succeed/fail as a whole); when a tasklet
    beats a chunk step (DDL, file move, single remote call, stored-proc invocation).
  - [x] Task 12.4. Links: https://docs.spring.io/spring-batch/reference/step.html#tasklet-step
- [x] Task 13. Create `modules/ROOT/pages/backend/spring-batch/fault-tolerance-skip-and-retry.adoc` — Fault
  tolerance: skip & retry
  - [x] Task 13.1. `.faultTolerant()`; **skip** — `.skip(...)`/`.skipLimit(...)`, `SkipPolicy` /
    `LimitCheckingExceptionHierarchySkipPolicy`, `SkipListener`, `.noSkip(...)`.
  - [x] Task 13.2. **Retry** — `.retry(...)`/`.retryLimit(...)`, `RetryPolicy` — **now built on Spring Framework
    7's retry support, not the Spring Retry library** — state this explicitly — `BackOffPolicy`, `RetryListener`.
  - [x] Task 13.3. `.noRollback(...)`; the read/process/write replay semantics on a rolled-back chunk, and why the
    `ItemProcessor` must be **idempotent**.
  - [x] Task 13.4. Links: https://docs.spring.io/spring-batch/reference/step.html,
    https://docs.spring.io/spring-batch/reference/retry.html,
    https://docs.spring.io/spring-batch/reference/whatsnew.html
- [x] Task 14. Create `modules/ROOT/pages/backend/spring-batch/step-flow-and-listeners.adoc` — Step flow &
  listeners
  - [x] Task 14.1. Sequential (`.next(...)`), conditional (`.on("FAILED").to(...)`, `.from(...)`, wildcards),
    `JobExecutionDecider`; `.end()`/`.fail()`/`.stopAndRestart()`. Embed a `[mermaid]` flowchart of a conditional
    step flow with a decider (choice 7).
  - [x] Task 14.2. Split flows for parallel steps; externalized/reusable flows (`FlowStep`).
  - [x] Task 14.3. Listener interfaces — `StepExecutionListener`, `ChunkListener`, `ItemReadListener` /
    `ItemProcessListener` / `ItemWriteListener`, `SkipListener`, `RetryListener` — and their annotation
    equivalents.
  - [x] Task 14.4. **Late binding** with `@StepScope`/`@JobScope` and SpEL expressions
    `#{jobParameters['run.date']}` / `#{stepExecutionContext['fileName']}` — a runnable example. Keep the SpEL
    expressions inside `[source]` blocks (AsciiDoc gotcha).
  - [x] Task 14.5. Links: https://docs.spring.io/spring-batch/reference/step.html
- [x] Task 15. Create `modules/ROOT/pages/backend/spring-batch/item-readers-files.adoc` — `ItemReader`s: files &
  XML/JSON
  - [x] Task 15.1. The `ItemReader`/`ItemStreamReader` contract.
  - [x] Task 15.2. `FlatFileItemReader` and the `LineMapper` → `LineTokenizer`
    (`DelimitedLineTokenizer`/`FixedLengthTokenizer`) → `FieldSet` → `FieldSetMapper` chain, via
    `FlatFileItemReaderBuilder` — a runnable example reading a delimited CSV.
  - [x] Task 15.3. Multi-format lines (`PatternMatchingCompositeLineMapper`), multi-line records,
    `MultiResourceItemReader` for reading a directory of files.
  - [x] Task 15.4. `StaxEventItemReader` for XML; `JsonItemReader` for JSON (Jackson 3); custom readers; "dealing
    with no input" (pointer to `NoWorkFoundStepExecutionListener` in `stopping-restart-and-recovery.adoc`).
  - [x] Task 15.5. Links: https://docs.spring.io/spring-batch/reference/readersAndWriters.html
- [x] Task 16. Create `modules/ROOT/pages/backend/spring-batch/item-readers-databases.adoc` — `ItemReader`s:
  databases
  - [x] Task 16.1. `JdbcCursorItemReader` vs. `JdbcPagingItemReader` (+ `PagingQueryProvider` /
    `SqlPagingQueryProviderFactoryBean`); the cursor-vs-paging trade-off (one long transaction & thread affinity
    vs. restartable stateless pages).
  - [x] Task 16.2. `JpaCursorItemReader`/`JpaPagingItemReader`, `HibernateCursorItemReader`/
    `HibernatePagingItemReader`, `StoredProcedureItemReader`. Cross-link
    `xref:backend/springboot/spring-data-jpa.adoc[Spring Data JPA]` and
    `xref:backend/hibernate/index.adoc[Hibernate Reference]` instead of restating JPA/Hibernate basics.
  - [x] Task 16.3. Spring Data readers (`RepositoryItemReader`, `MongoPagingItemReader`); the **driving-query
    pattern** (read keys, hydrate in the processor). Cross-link `xref:database/sql/dml-queries.adoc[SQL Queries]`.
  - [x] Task 16.4. Links: https://docs.spring.io/spring-batch/reference/readersAndWriters.html,
    https://docs.spring.io/spring-batch/reference/common-patterns.html
- [x] Task 17. Create `modules/ROOT/pages/backend/spring-batch/item-processors.adoc` — `ItemProcessor`s
  - [x] Task 17.1. `ItemProcessor<I, O>` — transform, including a type change; **filtering** by returning `null`
    (vs. skipping via `SkipPolicy`).
  - [x] Task 17.2. `CompositeItemProcessor` and `ClassifierCompositeItemProcessor`; `ItemProcessorAdapter` over an
    existing service.
  - [x] Task 17.3. Validation — `ValidatingItemProcessor`, `BeanValidatingItemProcessor` (Jakarta Bean
    Validation); `ScriptItemProcessor`.
  - [x] Task 17.4. Processor **idempotency** under retry/skip — why a processor with side effects breaks replay
    semantics from `fault-tolerance-skip-and-retry.adoc`.
  - [x] Task 17.5. Links: https://docs.spring.io/spring-batch/reference/processor.html
- [x] Task 18. Create `modules/ROOT/pages/backend/spring-batch/item-writers-files.adoc` — `ItemWriter`s: files &
  XML/JSON
  - [x] Task 18.1. The `ItemWriter`/`ItemStreamWriter` contract — write a whole chunk at once.
  - [x] Task 18.2. `FlatFileItemWriter` and the `LineAggregator` (`DelimitedLineAggregator`,
    `FormatterLineAggregator`) → `FieldExtractor` chain; header/footer callbacks; file-management options
    (`shouldDeleteIfExists`, `appendAllowed`, `transactional`).
  - [x] Task 18.3. `StaxEventItemWriter` for XML; `JsonFileItemWriter` for JSON; `MultiResourceItemWriter` for
    output rollover; `CompositeItemWriter`/`ClassifierCompositeItemWriter`.
  - [x] Task 18.4. Links: https://docs.spring.io/spring-batch/reference/readersAndWriters.html
- [x] Task 19. Create `modules/ROOT/pages/backend/spring-batch/item-writers-databases-and-adapters.adoc` —
  `ItemWriter`s: databases & alternative destinations
  - [x] Task 19.1. `JdbcBatchItemWriter` (bean-mapped vs. `ItemPreparedStatementSetter`/
    `ItemSqlParameterSourceProvider`); `JpaItemWriter`/`HibernateItemWriter`. Cross-link
    `xref:backend/springboot/spring-data-jpa.adoc[Spring Data JPA]`.
  - [x] Task 19.2. Spring Data writers (`RepositoryItemWriter`, `MongoItemWriter`).
  - [x] Task 19.3. Alternative-destination adapters: `ItemWriterAdapter`,
    `PropertyExtractingDelegatingItemWriter`; a pointer to the messaging/mail writers via
    `xref:backend/spring-batch/spring-batch-integration.adoc[Spring Batch Integration]`.
  - [x] Task 19.4. Links: https://docs.spring.io/spring-batch/reference/readersAndWriters.html,
    https://docs.spring.io/spring-batch/reference/common-patterns.html
- [x] Task 20. Create `modules/ROOT/pages/backend/spring-batch/repeat-and-retry-internals.adoc` — Repeat & retry
  internals
  - [x] Task 20.1. `RepeatOperations`/`RepeatTemplate` with `CompletionPolicy` and `ExceptionHandler` — the
    lower-level abstraction the chunk loop is built on.
  - [x] Task 20.2. `RetryOperations`/`RetryTemplate` (Spring Framework 7 retry) with `RetryPolicy`/
    `BackOffPolicy`/`RetryListener`; stateful vs. stateless retry, and how skip/retry in a fault-tolerant step map
    onto them (cross-link `xref:backend/spring-batch/fault-tolerance-skip-and-retry.adoc[Fault Tolerance]`).
  - [x] Task 20.3. Links: https://docs.spring.io/spring-batch/reference/repeat.html,
    https://docs.spring.io/spring-batch/reference/retry.html
- [x] Task 21. Create `modules/ROOT/pages/backend/spring-batch/scaling-and-parallel-processing.adoc` — Scaling &
  parallel processing
  - [x] Task 21.1. The "measure first" warning and a decision table of the options below.
  - [x] Task 21.2. **Single-JVM**: multi-threaded step (`taskExecutor` on the step, reader thread-safety and
    `SynchronizedItemStreamReader`, processor thread-safety); parallel steps via split flows; the 6.0
    producer/consumer concurrency model + **local chunking** (`ChunkTaskExecutorItemWriter`).
  - [x] Task 21.3. **Multi-process**: `AsyncItemProcessor`/`AsyncItemWriter`; **partitioning** (`Partitioner` →
    per-partition `ExecutionContext`, `StepExecutionSplitter`, `PartitionHandler`/
    `TaskExecutorPartitionHandler`/`gridSize`, binding partition data with `#{stepExecutionContext[...]}`). Embed
    `image::spring-batch-partitioning-topology.svg[…]` — manager step → `PartitionHandler` → N worker step
    executions (choice 7).
  - [x] Task 21.4. **Remote chunking & remote partitioning** (`MessageChannelPartitionHandler` over Spring
    Integration), the 6.0 **remote step**, and the `DeployerPartitionHandler` (linked, not documented in depth).
    Embed `image::spring-batch-remote-chunking-topology.svg[…]` — manager reads → durable queue → workers
    process + write (choice 7).
  - [x] Task 21.5. Each option's restartability/ordering/middleware-durability trade-offs, summarized in a small
    table.
  - [x] Task 21.6. Links: https://docs.spring.io/spring-batch/reference/scalability.html,
    https://docs.spring.io/spring-batch/reference/spring-batch-integration.html
- [x] Task 22. Create `modules/ROOT/pages/backend/spring-batch/profiling-and-tuning.adoc` — Profiling & tuning
  - [x] Task 22.1. Profiling a batch job (CPU/memory — e.g. VisualVM, Java Flight Recorder — cross-link
    `xref:backend/spring-batch/observability.adoc[Observability]` for the 6.0 JFR events).
  - [x] Task 22.2. Choosing a chunk size; cursor vs. paging cost; turning off `saveState` for non-restartable
    readers; keeping the `ExecutionContext` small.
  - [x] Task 22.3. The cost of metadata writes per chunk, and indexing the metadata tables (cross-link
    `xref:backend/spring-batch/job-repository-and-metadata-schema.adoc[Job Repository & Metadata Schema]`).
  - [x] Task 22.4. Common anti-patterns: huge chunks, per-item transactions, chatty readers.
  - [x] Task 22.5. Links: https://docs.spring.io/spring-batch/reference/spring-batch-architecture.html,
    https://docs.spring.io/spring-batch/reference/spring-batch-observability.html
- [x] Task 23. Create `modules/ROOT/pages/backend/spring-batch/spring-batch-integration.adoc` — Spring Batch
  Integration
  - [x] Task 23.1. Launching jobs from messages — `JobLaunchRequest`, `JobLaunchingMessageHandler` /
    `JobLaunchingGateway`; informational-message feedback on a reply channel.
  - [x] Task 23.2. `AsyncItemProcessor`/`AsyncItemWriter` (cross-referenced from
    `xref:backend/spring-batch/scaling-and-parallel-processing.adoc[Scaling & Parallel Processing]`); the
    `BlockingQueueItemReader`/`BlockingQueueItemWriter` SEDA-style stage decoupling.
  - [x] Task 23.3. How remote chunking/remote partitioning are wired over Spring Integration `MessageChannel`s —
    a runnable outbound/inbound channel adapter example.
  - [x] Task 23.4. Links: https://docs.spring.io/spring-batch/reference/spring-batch-integration.html
- [x] Task 24. Create `modules/ROOT/pages/backend/spring-batch/observability.adoc` — Observability
  - [x] Task 24.1. Micrometer meters under the `spring.batch.*` prefix: `spring.batch.job`,
    `spring.batch.job.active`, `spring.batch.step`, `spring.batch.item.read`, `spring.batch.item.process`,
    `spring.batch.chunk.write`.
  - [x] Task 24.2. Tracing via the Observation API — one observation per job/step/chunk; wiring a
    `MeterRegistry`/`ObservationRegistry`. Cross-link
    `xref:backend/springboot/metrics-and-observability.adoc[Metrics & Observability]` for the general
    Micrometer/OTel/Prometheus/Grafana setup (not restated here).
  - [x] Task 24.3. The 6.0 **Java Flight Recorder (JFR)** events, and what Spring Boot Actuator adds.
  - [x] Task 24.4. Links: https://docs.spring.io/spring-batch/reference/spring-batch-observability.html,
    https://docs.spring.io/spring-batch/reference/spring-batch-observability/micrometer.html,
    https://docs.spring.io/spring-batch/reference/spring-batch-observability/jfr.html
- [x] Task 25. Create `modules/ROOT/pages/backend/spring-batch/cloud-native-batch.adoc` — Cloud-native batch
  - [x] Task 25.1. The twelve-factor lens applied to a batch app; externalized config with Spring Cloud Config;
    guarding a remote call in a step with a circuit breaker.
  - [x] Task 25.2. **Spring Cloud Task** (`@EnableTask`, task-execution metadata, exit codes) and how it
    complements Spring Batch — linked, not documented in depth (this material is mostly grounded in the
    sibling-project docs).
  - [x] Task 25.3. Orchestration with **Spring Cloud Data Flow** (task / composed-task launcher) — linked.
  - [x] Task 25.4. Running batch on Kubernetes (`Job`/`CronJob`) and the `DeployerPartitionHandler` (linked).
  - [x] Task 25.5. Links: https://spring.io/projects/spring-cloud-task, https://dataflow.spring.io/docs/,
    https://docs.spring.io/spring-batch/reference/spring-batch-integration.html
- [x] Task 26. Create `modules/ROOT/pages/backend/spring-batch/testing.adoc` — Testing batch jobs
  - [x] Task 26.1. The `spring-batch-test` module; `@SpringBatchTest` + `@SpringJUnitConfig`;
    `JobOperatorTestUtils` (`startJob()`/`startStep("stepName")`); `JobRepositoryTestUtils`.
  - [x] Task 26.2. `MetaDataInstanceFactory` for building domain objects in isolation; testing `@StepScope`/
    `@JobScope` beans (`StepScopeTestExecutionListener` via a `getStepExecution()` method, or
    `StepScopeTestUtils.doInStepScope`).
  - [x] Task 26.3. End-to-end job assertions on `JobExecution`/`ExitStatus`; testing a single step; validating
    output; mocking with Mockito. **State explicitly: JUnit 4 support was removed in 6.0 — JUnit Jupiter only.**
  - [x] Task 26.4. Links: https://docs.spring.io/spring-batch/reference/testing.html

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 28 renders the PDF that Task 27's page links, and Task 27's back-links reference
the Group 2 page titles. Depends on Group 2.

- [ ] Task 27. Create `modules/ROOT/pages/backend/spring-batch/cheat-sheet.adoc`
  - [ ] Task 27.1. Header (`= Spring Batch Cheat Sheet`, `:description:`, `:keywords:`) +
    `include::partial$spring-batch-disclaimer.adoc[]` + a short intro sentence, then grouped `xref:` back-links
    to every Group 2 page (grouped as in the section index — see Task 29.2's grouping), modelled on
    `modules/ROOT/pages/database/elasticsearch/cheat-sheet.adoc`. No literal `{ }` braces in prose; every `xref:`
    target verified present on disk.
  - [ ] Task 27.2. End with `xref:attachment$spring-batch-cheat-sheet.pdf[Download the Spring Batch Cheat Sheet
    (PDF)]`. **No mention of the book** (all bibliography lives in `index.adoc`).
- [ ] Task 28. Build `modules/ROOT/attachments/spring-batch-cheat-sheet.pdf`
  - [ ] Task 28.1. In a scratch location (not the repo), hand-build a print-ready single-page HTML/CSS layout —
    colour-coded boxes summarizing: the `Job`/`Step`/`JobInstance`/`JobExecution`/`StepExecution` domain model;
    the chunk-loop (read/process/write + commit interval); `new JobBuilder(...)`/`new StepBuilder(...).chunk(...)`
    skeletons; the metadata table names; `spring.batch.*` properties; the `@EnableBatchProcessing`-off-under-Boot
    warning; skip/retry (`.faultTolerant().skip(...).retry(...)`) skeleton; step-flow transition syntax
    (`.on("FAILED").to(...)`); the partitioning topology; the `spring-batch-test` `JobOperatorTestUtils`
    one-liners; and the `spring.batch.job`/`spring.batch.step` Micrometer meter names.
  - [ ] Task 28.2. Render to PDF with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
    verify it is **exactly one page** with no clipped content (a rendered preview check), then copy the PDF to
    `modules/ROOT/attachments/spring-batch-cheat-sheet.pdf`. Do **not** check in the HTML source.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 29–33 each edit a shared wiring file and Task 34 builds on all prior groups; the
build must run last.

- [ ] Task 29. Create `modules/ROOT/pages/backend/spring-batch/index.adoc`
  - [ ] Task 29.1. Header (`= Spring Batch Reference`, `:description:`, `:keywords:`) +
    `include::partial$spring-batch-disclaimer.adoc[]` + a lead paragraph introducing Spring Batch (a lightweight
    framework for finite, bounded bulk processing, built on the `Job`/`Step`/`ItemReader`-`ItemProcessor`-
    `ItemWriter` model) and pointing new readers to `getting-started.adoc` →
    `jobs-instances-and-parameters.adoc` → `chunk-oriented-processing.adoc` first; a short line pointing to the
    sibling `xref:backend/springboot/spring-batch.adoc[Spring Batch (SpringBoot Reference)]` short overview page.
  - [ ] Task 29.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped: *Getting
    started* (getting-started); *Architecture & domain language* (architecture-and-processing-strategies,
    jobs-instances-and-parameters, steps-executions-and-context); *Configuring & running jobs*
    (batch-infrastructure-configuration, job-repository-and-metadata-schema, configuring-a-job, running-a-job,
    stopping-restart-and-recovery); *Steps* (chunk-oriented-processing, tasklet-steps,
    fault-tolerance-skip-and-retry, step-flow-and-listeners); *ItemReaders, ItemProcessors & ItemWriters*
    (item-readers-files, item-readers-databases, item-processors, item-writers-files,
    item-writers-databases-and-adapters, repeat-and-retry-internals); *Scaling & tuning*
    (scaling-and-parallel-processing, profiling-and-tuning); *Integration, observability & cloud-native batch*
    (spring-batch-integration, observability, cloud-native-batch); *Testing* (testing); *Cheat sheet*.
  - [ ] Task 29.3. `== Bibliography` — **the only place any source is named.** List:
    - https://docs.spring.io/spring-batch/reference/ — the Spring Batch Reference Documentation (6.0.x), the
      source every page is written and verified against — with the specific sub-area links used across the
      pages (introduction, architecture, domain, job/step configuration, readers & writers, item processing,
      scalability, repeat, retry, testing, common patterns, Spring Batch Integration, observability +
      Micrometer + JFR, schema appendix, and the general appendix/glossary/FAQ).
    - https://docs.spring.io/spring-boot/reference/io/spring-batch.html — Spring Boot's Batch Applications
      support (`spring-boot-starter-batch`, auto-configured job repository stores, `spring.batch.*` properties,
      `JobLauncherApplicationRunner`).
    - https://github.com/spring-projects/spring-batch/wiki/Spring-Batch-6.0-Migration-Guide — the Spring Batch
      6.0 Migration Guide, used to describe what changed relative to the book's 4.x code.
    - https://spring.io/projects/spring-cloud-task and https://dataflow.spring.io/docs/ — Spring Cloud Task /
      Spring Cloud Data Flow, linked for the cloud-native-batch orchestration material.
    - Minella, Michael T. *The Definitive Guide to Spring Batch: Modern Finite Batch Processing in the Cloud*,
      2nd ed. Apress, 2019. ISBN 978-1-4842-3723-6 (paperback) / 978-1-4842-3724-3 (eBook), DOI
      10.1007/978-1-4842-3724-3. Foreword by Dave Syer. Consulted as part of the bibliography for this section;
      its code targets Spring Boot 2.1.x / Spring Batch 4.x on Java 8 and uses the removed
      `@EnableBatchProcessing` + `JobBuilderFactory`/`StepBuilderFactory` + `BatchConfigurer` idiom and
      `javax.*` imports, so where it and the official documentation disagree the official documentation is
      authoritative and the difference is noted; none of its content is the primary or main reference for this
      section. Publisher page: https://link.springer.com/book/10.1007/978-1-4842-3724-3 .
    - A closing sentence: the book is a consulted bibliography reference only and is **not** the primary
      reference for the section; the official documentation at https://docs.spring.io/spring-batch/reference/
      wins on any discrepancy.
- [ ] Task 30. Wire `modules/ROOT/nav.adoc`
  - [ ] Task 30.1. Insert a `*** xref:backend/spring-batch/index.adoc[Spring Batch Reference]` block with one
    `****` line per page **in the section-index order**, **after** the SpringBoot Reference block's
    `**** xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]` line (`nav.adoc:535`) and **before**
    `** xref:apps/index.adoc[Apps]` (`nav.adoc:536`). Page order: getting-started,
    architecture-and-processing-strategies, jobs-instances-and-parameters, steps-executions-and-context,
    batch-infrastructure-configuration, job-repository-and-metadata-schema, configuring-a-job, running-a-job,
    stopping-restart-and-recovery, chunk-oriented-processing, tasklet-steps, fault-tolerance-skip-and-retry,
    step-flow-and-listeners, item-readers-files, item-readers-databases, item-processors, item-writers-files,
    item-writers-databases-and-adapters, repeat-and-retry-internals, scaling-and-parallel-processing,
    profiling-and-tuning, spring-batch-integration, observability, cloud-native-batch, testing, then
    `**** xref:backend/spring-batch/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use short link labels matching each
    page's title (e.g. `[Getting Started]`, `[Architecture & Processing Strategies]`,
    `[Jobs, Instances & Parameters]`, `[Steps, Executions & Context]`, `[Infrastructure Configuration]`,
    `[Job Repository & Metadata Schema]`, `[Configuring a Job]`, `[Running a Job]`,
    `[Stopping, Restart & Recovery]`, `[Chunk-Oriented Processing]`, `[Tasklet Steps]`,
    `[Fault Tolerance: Skip & Retry]`, `[Step Flow & Listeners]`, `[ItemReaders: Files & XML/JSON]`,
    `[ItemReaders: Databases]`, `[ItemProcessors]`, `[ItemWriters: Files & XML/JSON]`,
    `[ItemWriters: Databases & Adapters]`, `[Repeat & Retry Internals]`, `[Scaling & Parallel Processing]`,
    `[Profiling & Tuning]`, `[Spring Batch Integration]`, `[Observability]`, `[Cloud-Native Batch]`, `[Testing]`).
- [ ] Task 31. Update `modules/ROOT/pages/backend/index.adoc`
  - [ ] Task 31.1. Add a `== Sections` bullet after the SpringBoot Reference one:
    `xref:backend/spring-batch/index.adoc[Spring Batch Reference] -- finite, bounded batch processing: the Job/
    Step/JobRepository domain model, configuring and running jobs, chunk-oriented and tasklet steps, fault
    tolerance (skip & retry), ItemReader/ItemProcessor/ItemWriter, scaling and partitioning, Spring Batch
    Integration, observability, cloud-native batch, and testing, plus a downloadable cheat sheet.`
  - [ ] Task 31.2. Extend the page `:description:` and `:keywords:` to mention Spring Batch, Job, Step,
    ItemReader, ItemProcessor, ItemWriter, chunk-oriented processing.
- [ ] Task 32. Update `modules/ROOT/pages/backend/springboot/spring-batch.adoc`
  - [ ] Task 32.1. In `== What batch processing is`, replace *"A dedicated in-depth guide to Spring Batch will
    follow; here the goal is only to place the moving parts and show one runnable job."* with a pointer to
    `xref:backend/spring-batch/index.adoc[Spring Batch Reference]` as that in-depth guide.
  - [ ] Task 32.2. Add one additional `xref:backend/spring-batch/index.adoc[...]` cross-link near the top of the
    page (e.g. in the opening paragraph). **Do not restate any Spring Batch Reference content on this page** —
    it stays the short Spring-Boot-integration-focused version.
  - [ ] Task 32.3. In `== Scaling (in brief)`, update the closing sentence's "the future deep-dive guide" wording
    to reference `xref:backend/spring-batch/scaling-and-parallel-processing.adoc[Scaling & Parallel Processing]`
    directly instead of a forward-looking promise.
- [ ] Task 33. Update `modules/ROOT/pages/backend/springboot/index.adoc`
  - [ ] Task 33.1. In `=== ORM, search & batch`, update the one-line `spring-batch.adoc` blurb to also point at
    `xref:backend/spring-batch/index.adoc[Spring Batch Reference]` for the in-depth guide. Leave the
    `== Bibliography` entry for the Minella book as-is (unchanged by this plan).
- [ ] Task 34. Build & verify
  - [ ] Task 34.1. Run `npx antora antora-playbook.yml` (via an `iru-gate-runner`/generic sub-agent to keep the
    main context clean). Fix any `xref`/AsciiDoc/missing-image/mermaid errors and any "skipping reference to
    missing attribute" warnings (unescaped `{ }` in prose, especially the SpEL expressions in
    `step-flow-and-listeners.adoc`) introduced by the new pages until the build completes clean.
  - [ ] Task 34.2. Confirm every new page is reachable from both
    `modules/ROOT/pages/backend/spring-batch/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/backend/spring-batch/…` HTML renders (spot-check a page with a `[mermaid]` diagram and one with
    an SVG), and that `xref:attachment$spring-batch-cheat-sheet.pdf` resolves to the checked-in PDF.
  - [ ] Task 34.3. Re-open `modules/ROOT/attachments/spring-batch-cheat-sheet.pdf` and confirm it is a single
    printable page with no clipped content.
  - [ ] Task 34.4. Grep the new pages and `spring-batch-disclaimer.adoc` for any admonition (`[NOTE]`, `[TIP]`,
    `[IMPORTANT]`, `[WARNING]`, `[CAUTION]`) and confirm none names Michael Minella, "the book", "consulted", or
    "the sources" — all source attribution must be in `index.adoc`'s `== Bibliography` only (choice 4).
  - [ ] Task 34.5. Confirm `backend/springboot/spring-batch.adoc` and `backend/springboot/index.adoc` were edited
    as scoped (Tasks 32–33) with no unrelated content changes, and that no page in this section restates content
    already covered by `backend/springboot/spring-batch.adoc` in full (only cross-links back to it).
