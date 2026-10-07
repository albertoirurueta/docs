# Implementation Plan: Add "Scheduling" section (standard scheduling vs Quartz, Quartz with SQL & NoSQL databases) under Guides & References / Backend Development

## Task summary

Source: GitHub issue #157
Base branch: main

Issue [#157](https://github.com/albertoirurueta/docs/issues/157) adds a new **top-level Scheduling section** to
**Guides & References → Backend Development** at `modules/ROOT/pages/backend/scheduling/`. It is a practical guide to
timed and recurring work in Java/Spring Boot services. It compares *standard scheduling* (`@Scheduled` / `TaskScheduler`,
optionally with ShedLock) with the advanced features of **Quartz Scheduler 2.5.x**. It documents Quartz on its own and
through `spring-boot-starter-quartz`, with **one page per database**: PostgreSQL (reference), MySQL/MariaDB, Oracle, SQL
Server, embedded/other SQL, MongoDB and Redis.

The issue body is the **binding spec** (`gh issue view 157`: "Page outline", "Cheat sheet", "Bibliography", "Acceptance
criteria", and the "stale docs" table in Context). Every page task must re-read its page's bullets in the issue and cover
**every** bullet. The issue body is saved verbatim at
`/private/tmp/claude-501/-Users-airurueta-irurueta2-common-docs/efa621d1-b496-41d8-bf69-c07c87e5b161/scratchpad/issue157.md`
for the session that created this plan; later sessions re-fetch it with `gh issue view 157`.

Deliverables:

* 25 pages in `backend/scheduling/` (incl. `index.adoc`) plus `cheat-sheet.adoc`:
  * foundations (2): `index`, `standard-scheduling-vs-quartz`
  * Quartz core (8): `quartz-fundamentals`, `getting-started-with-spring-boot`, `jobs-and-job-data`,
    `triggers-and-schedules`, `cron-expressions`, `misfires`, `calendars`, `listeners-and-plugins`
  * job stores and databases (8): `job-stores-and-persistence`, `database-postgresql`, `database-mysql-and-mariadb`,
    `database-oracle`, `database-sql-server`, `database-embedded-and-other-sql`, `database-mongodb`, `database-redis`
  * clustering and Spring Boot (3): `clustering`, `spring-boot-configuration`, `dynamic-scheduling-and-management`
  * quality and operations (4): `observability`, `testing`, `production-and-best-practices`,
    `migration-and-whats-changed`
* `partials/scheduling-disclaimer.adoc`, original `images/scheduling-*.svg` figures and Mermaid diagrams (at least every 📊
  in the issue), and `attachments/scheduling-cheat-sheet.pdf` (one A4 page)
* nav entry, `backend/index.adoc` bullet/description/keywords, pointers in `backend/springboot/index.adoc` and
  `cheat-sheet.adoc`, link + two factual refreshes in the existing `backend/springboot/scheduling-and-shedlock.adoc`
  (which **stays in place**), and one-line back-links in the related pages the issue lists

**Out of scope:** moving `scheduling-and-shedlock.adoc`; re-documenting existing material (link instead); the Resilience
section.

### Choices made on the user's behalf

1. **Branch:** `feature/157-scheduling` (user-confirmed), based on `main`; a single draft PR to `main` with `Closes #157`.
   The issue suggests optionally splitting into five PRs; this plan keeps one PR (as #156/#166 did) and groups the work so
   it could still be cut along the issue's five lines (groups 3 → 4 → 5 → 6 → 7 below map to them).
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet` and
   `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly. The Java/YAML/SQL in the
   pages is illustrative content, but every example is compiled and run in a scratch project (Task 1), kept **outside the
   repo** (scratchpad), never committed.
3. **Disclaimer:** new `partials/scheduling-disclaimer.adoc`, identical in shape to `partials/resilience-disclaimer.adoc`
   (single `[IMPORTANT]` block, AI-assistance disclosure + pointer to `backend/scheduling/index.adoc#_bibliography`). It is
   the **only** admonition in the section. Pitfalls, version changes, the archived MongoDB store and doc discrepancies are
   prose or table rows.
4. **Source of truth is the Quartz 2.5.2 source/Javadoc, Spring Boot 4.1.1 and Spring Framework 7.0.9 source**, not the
   websites. Every default, signature and property is checked before it is written; discrepancies are stated in prose/table
   rows and collected in `migration-and-whats-changed.adoc`. Versions are re-verified on Maven Central at implementation
   time.
5. **Running scenario is *Bookshelf*** (cache refresh, nightly overdue-loan reminders, per-member reminders, weekly
   statistics report, monthly retention cleanup), PostgreSQL as the reference database, every database page re-runs the
   same jobs.
6. **Within-section links are real `xref:`s** (the whole section lands in one PR). `index.adoc`, the comparison page and
   `cheat-sheet.adoc` are written after the pages they link. Every `xref:` outside the section is checked with `ls`.
7. **PDF:** rendered from a throwaway HTML page with headless Google Chrome (`Google Chrome.app` is installed), checked to
   be exactly one A4 page; only the PDF is committed. The Resilience cheat sheet PDF is the layout precedent.
8. **Docker prerequisite:** `docker info` reports the daemon is **down** at planning time. Task 1 needs it (Testcontainers
   for PostgreSQL, MySQL, MariaDB, Oracle Free, MSSQL, MongoDB, Redis). Task 1.1 starts Docker or asks the user to; if a
   container image cannot be run on this machine (Oracle/MSSQL on Apple Silicon is the likely one), the page states
   plainly what was and was not tested rather than claiming it was verified.

### Lessons from earlier section reviews (#156, #166, #198, #199, #230) — mandatory for every page task

**Verify every name against the official page or the 2.5.2 / 4.1.1 / 7.0.9 source before writing it** (class, method,
property key, default, import path, artifact id, version); if unconfirmed, describe the behaviour without naming it.
**Security is correctness:** no real secrets or real third-party endpoints. **Every concept gets at least one code
example**, each followed by a `Source:` link (also listed in `== References`). **Run the examples** in the scratch project.
**URL hygiene:** canonical URLs only. **Cross-links accurate:** never `xref:` to a non-existent page; no `xref:` inside
backticks; no empty link text on a fragment xref. **AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes;
`{placeholders}` literal inside `[source]` blocks and escaped in prose; no prose line starting with `<digits>.`; no
admonitions other than the disclaimer. Every page: `= Title`, `:description:`, `:keywords:`,
`include::partial$scheduling-disclaimer.adoc[]` right after the header attributes, an intro stating the baseline versions,
a "Spring Boot 3.5" delta where it differs, and a closing `== References`. ★★ pages (comparison, getting started with
Spring Boot, job stores, PostgreSQL, MongoDB, clustering, Spring Boot configuration, observability, testing) get ≥ 2 diagrams,
a worked *Bookshelf* example, a pitfalls table and a "what changed" subsection. Every Mermaid block must pass
`npm run validate:mermaid`.

## Current code state

* **Repo:** Antora root component `irurueta` (`antora.yml`), pages in `modules/ROOT/pages/`, nav `modules/ROOT/nav.adoc`,
  partials `modules/ROOT/partials/`, images `modules/ROOT/images/`, PDFs `modules/ROOT/attachments/` (75 PDFs today). No
  `docs/` subdirectory. Build: `npx antora antora-playbook.yml`; Mermaid check: `npm run validate:mermaid`
  (`scripts/validate-mermaid.mjs`). Antora 3.1.15, with lunr, Mermaid and MathJax extensions.
* **Does not exist yet:** `modules/ROOT/pages/backend/scheduling/`, `partials/scheduling-disclaimer.adoc`,
  `images/scheduling-*.svg`, `attachments/scheduling-cheat-sheet.pdf`.
* **`modules/ROOT/nav.adoc`:** `** xref:backend/index.adoc[Backend Development]` with `***` children. The Resilience entry
  (from #166) is `*** xref:backend/resilience/index.adoc[Resilience]` at l.864 with `****` children through l.899
  (`cheat-sheet.adoc`). The Spring Batch Reference block ends at l.961
  (`**** xref:backend/spring-batch/cheat-sheet.adoc[Cheat Sheet (PDF)]`) and `*** xref:backend/oauth/index.adoc[OAuth Reference]`
  is l.962. **The new `*** Scheduling` entry goes between l.961 and l.962.**
* **`backend/index.adoc`:** one bullet per Backend Development entry (the Spring Batch bullet is at l.58, the Resilience bullet
  at l.48); `:description:` (l.2) and `:keywords:` (l.3) are very long single lines to append to.
* **`backend/springboot/scheduling-and-shedlock.adoc` (294 lines):** sections `== Enabling in-process scheduling` (l.12),
  `== The TaskScheduler abstraction` (l.56), `== The multi-instance problem` (l.88), `== ShedLock` (l.97), `== Two instances,
  one tick` (l.240), `== Choosing lockAtMostFor and lockAtLeastFor` (l.260), `== References` (l.290). ShedLock `6.2.0` appears
  5× (l.116, 121, 190, 211, 233) and must become 7.x. It includes `springboot-disclaimer.adoc` and keeps it.
* **`backend/springboot/index.adoc`:** `=== Scheduling` at l.164–167 (one bullet). `:keywords:` and `== Bibliography` exist.
  **`backend/springboot/cheat-sheet.adoc`:** "Messaging and scheduling" line at l.38–40.
* **Back-link targets (all verified to exist):** `backend/spring-batch/running-a-job.adoc` (`=== From Quartz`),
  `backend/quarkus/{scheduling-and-mail,quarkus-vs-spring-boot}.adoc`, `backend/kubernetes/jobs-and-cronjobs.adoc`,
  `backend/nestjs/events-scheduling-and-queues.adoc`, `web/django/celery-integration.adoc`,
  `web/aspnet/core/hosting-servers-and-environments.adoc`, `database/sql/index.adoc`, `database/schema-evolution/index.adoc`,
  `backend/springboot/{spring-data-jpa,transaction-isolation-and-locking,spring-data-mongodb,metrics-and-observability,logging,
  unit-and-integration-testing,concurrency-alternatives,configuration-and-profiles,spring-security}.adoc`,
  `database/mongodb/index.adoc`, `database/redis/{index,use-cases-and-patterns}.adoc`,
  `backend/docker/spring-boot-integration-tests-with-testcontainers.adoc`, `backend/resilience/index.adoc`. The
  `database/schema-evolution/` directory has Mongock and Liquibase pages (`liquibase-*.adoc`, `mongock-*.adoc`,
  `choosing-a-migration-tool.adoc`); Flyway has no dedicated page there, so link `index.adoc`/`choosing-a-migration-tool.adoc`.
* **Precedents:** `.archive/implementation_plan_166.md` and `_156.md` (same section shape: partial, SVGs, cheat-sheet PDF, nav,
  back-links, aliases not needed here since nothing moves), `_230`, `_237`, `_253`.

## Implementation steps

### Group 1 — Foundations and verification (Parallelizable: yes — touches disjoint files; Task 1 works only in the scratchpad)

- [x] Task 1. Build the throwaway verification project and settle every "verify by test" item
  - [x] Task 1.1. Make Docker available (`docker info` is down at planning time): start Docker Desktop / ask the user to. Record
    which database images can actually run on this machine (PostgreSQL, MySQL, MariaDB, Oracle Free, MSSQL, MongoDB, Redis);
    note any that cannot (likely Oracle/MSSQL on Apple Silicon) so those pages state precisely what was tested.
    - Result: Docker was already up (server 29.8.1, later restarted as 29.8.2, arm64). **Every image ran**: postgres:17, mysql:9, mariadb:11, gvenzl/oracle-free:slim-faststart (arm64 native), mcr.microsoft.com/mssql/server:2022-latest (amd64-only, ran under Rosetta), mongo:8, redis:8; H2 in-process. Details in NOTES.md section 1.
  - [x] Task 1.2. Re-verify the version baseline on Maven Central / GitHub (Quartz latest, Spring Boot, Spring Framework,
    ShedLock, pgJDBC, Testcontainers, `quartz-mongodb` mirror, `quartz-redis-jobstore`) and record the exact versions used.
    Fetch the Quartz 2.5.2 sources/jar (DDL scripts under `org/quartz/impl/jdbcjobstore/`, delegates, `RAMJobStore`,
    `JobStoreSupport`, `CronExpression`, `StdSchedulerFactory`) and the Boot 4.1.1 `spring-boot-quartz` module (`QuartzProperties`,
    `QuartzJdbcProperties`, `QuartzEndpoint`) for later reading.
    - Result: Baseline re-verified: Quartz 2.5.2, Boot 4.1.1 (3.5.16), Spring Framework 7.0.9 (6.2.19), ShedLock 7.10.1, pgJDBC 42.7.13, Testcontainers 2.0.5, quartz-mongodb 2.2.0-rc2, quartz-redis-jobstore 1.2.0; sources unpacked in `scheduling-verification/src`. NOTES.md section 2.
  - [x] Task 1.3. In a Maven project under the scratchpad (outside the repo), implement the *Bookshelf* jobs on Spring Boot 4.1
    with `spring-boot-starter-quartz`. Run and record results for: `misfireThreshold` default in RAM mode under Spring;
    `quartz.properties` loading under Boot; a non-JDBC `jobStore.class` with `job-store-type=memory`; `initialize-schema`
    modes; `@QuartzDataSource`; the Actuator `quartz` endpoint (GET paths + POST trigger-now) with sample JSON; the 3-node/two-
    scheduler cluster test; listener-based metrics.
    - Result: Done in `scheduling-verification/bookshelf` (tests S01-S07, S10): misfireThreshold RAM = 5000 under Spring, `quartz.properties` ignored by Boot, custom non-JDBC `jobStore.class` honoured with `memory`, initialize-schema modes, `@QuartzDataSource`, Actuator JSON, 3-node + kill -9 cluster test, listener metrics. NOTES.md sections 3-4, 8.
  - [x] Task 1.4. Test the community stores: `quartz-mongodb` (`io.fluidsonic.mirror:quartz-mongodb:2.2.0-rc2`) against Quartz
    2.5.2 / Boot 4.1 with Testcontainers MongoDB, and `net.joelinn:quartz-redis-jobstore:1.2.0` with Testcontainers Redis.
    Record pass/fail and the exact failure output if any; the MongoDB/Redis pages state the real result.
    - Result: Done (S08): `quartz-mongodb` and `quartz-redis-jobstore` are **broken on Quartz 2.5.x** (Mongo: silent `NoSuchMethodError`, nothing fires; Redis: Jedis > 3.3.0 `NoSuchMethodError` and Jackson mixin error on 2.5); both work on Quartz <= 2.4.1 (Redis only with Jedis 3.3.0). NOTES.md section 5.
  - [x] Task 1.5. Run one Testcontainers JDBC-store test per supported database container (PostgreSQL, MySQL, MariaDB, Oracle
    Free, MSSQL, H2) that was runnable per Task 1.1; capture DDL edits actually needed (SQL Server script vs Boot reference
    text; unreleased 2.5.3 `nvarchar` change) and delegates actually required.
    - Result: Done (S09, S11): PostgreSQL (needs `PostgreSQLDelegate`), MySQL, MariaDB, Oracle Free (`tables_oracle23.sql` with ojdbc 23.x), SQL Server (edited script + `MSSQLDelegate`), H2 all pass; DDL edits and delegates in NOTES.md section 6.
  - [x] Task 1.6. Save the findings (versions, measured defaults, test results, working snippets) to a notes file in the
    scratchpad; page tasks in later groups read it instead of re-deriving it. Delegate long test runs to the `iru-gate-runner`
    agent (`Agent({subagent_type: "iru-gate-runner", ...})`) so output stays out of the main context.
    - Result: `scheduling-verification/NOTES.md` written (versions, defaults, results, snippets, discrepancy table, pitfalls, page header template).
- [x] Task 2. Create the disclaimer partial and the section skeleton
  - [x] Task 2.1. Create `modules/ROOT/partials/scheduling-disclaimer.adoc` copying the shape of
    `partials/resilience-disclaimer.adoc`, with the xref pointing at `backend/scheduling/index.adoc#_bibliography`.
    - Result: Created `modules/ROOT/partials/scheduling-disclaimer.adoc` (resilience shape, xref -> `backend/scheduling/index.adoc#_bibliography`).
  - [x] Task 2.2. Create the directory `modules/ROOT/pages/backend/scheduling/` (populated by later groups) and define the shared
    page header template used by every page (title, `:description:`, `:keywords:`, partial include, versions intro,
    `== References`).
    - Result: Created the empty directory `modules/ROOT/pages/backend/scheduling/` (untracked until a page is added); header template recorded in NOTES.md section 11.

### Group 2 — Quartz core concepts (Parallelizable: yes — one new file per task, no shared edits; shared notes from Task 1 are read-only)

Each task: write the page per the issue's bullets, add the 📊 figures listed, run examples in the scratch project, add a
`Source:` link after every example and a `== References` section. Add original SVGs as `images/scheduling-<name>.svg`.

- [x] Task 3. `quartz-fundamentals.adoc` ★: what Quartz is and its 2.4/2.5 lines (Java 8 + `javax` vs Java 11 + Jakarta);
  architecture (`Scheduler`, `SchedulerFactory`, `StdSchedulerFactory`, `DirectSchedulerFactory`, `QuartzSchedulerThread`,
  `ThreadPool`, `JobStore`, `JobFactory`); `Job` vs `JobDetail` vs `Trigger`, keys and groups; fluent DSL; scheduler lifecycle
  (`start`, `startDelayed`, `standby`, `shutdown(waitForJobsToComplete)`, `isInStandbyMode`); a plain-Java first example based on
  Example 1. Figures: SVG component architecture; Mermaid sequence of a trigger firing.
- [x] Task 4. `getting-started-with-spring-boot.adoc` ★★: dependencies (Maven + Gradle Kotlin DSL, Boot 3.5 delta);
  what `QuartzAutoConfiguration` does; `QuartzJobBean`, `JobDataMap` setter injection, constructor injection; first durable job +
  `CronTrigger` bean for overdue-loan reminders with YAML; running it and viewing `/actuator/quartz`; the official smoke test;
  Spring Framework's factory beans (`JobDetailFactoryBean`, `MethodInvokingJobDetailFactoryBean`, `SimpleTriggerFactoryBean`,
  `CronTriggerFactoryBean`). Figures: Mermaid auto-config wiring; SVG of job dependency injection. Plus pitfalls table and
  "what changed".
- [x] Task 5. `jobs-and-job-data.adoc` ★: job instance lifecycle; `JobDataMap` merge/persistence; `@DisallowConcurrentExecution`,
  `@PersistJobDataAfterExecution`; durability; `requestsRecovery`/`isRecovering()`; `JobExecutionException` flags; interruption
  (`InterruptableJob`, `Scheduler.interrupt`, `JobInterruptMonitorPlugin`); idempotent design; transactional services; launching a
  Spring Batch job (link `backend/spring-batch/running-a-job.adoc`); `quartz-jobs` minus `NativeJob`; link
  `backend/resilience/index.adoc` for retrying flaky calls. Figure: Mermaid `JobDataMap` merging.
- [x] Task 6. `triggers-and-schedules.adoc` ★: common trigger attributes; `SimpleTrigger`, `CronTrigger`,
  `CalendarIntervalTrigger`, `DailyTimeIntervalTrigger` with their builders; choosing a type; cookbook recipes rewritten with
  builders; per-member one-shot reminder. Figure: SVG timeline of the four trigger types across a DST week.
- [x] Task 7. `cron-expressions.adoc` ★: grammar, special characters incl. 2.5.1 `L`; `?` rule; `CronExpression` API; time zones
  and DST; translation table Quartz ↔ Spring ↔ Unix/Kubernetes (Sunday numbering, macros); 20+ annotated expressions;
  pitfalls. Verify each example with `CronExpression.getNextValidTimeAfter`. Figure: SVG cron field diagram. Link
  `backend/kubernetes/jobs-and-cronjobs.adoc`.
- [x] Task 8. `misfires.adoc` ★: what a misfire is; `misfireThreshold` with the RAM-vs-JDBC default discrepancy (use the measured
  result from Task 1.3); smart policy; every instruction per trigger type and builder methods; what "smart" resolves to;
  `maxMisfiresToHandleAtATime`; per-*Bookshelf*-job choice; Example 5; contrast with `@Scheduled`. Figure: Mermaid outage timeline.
- [x] Task 9. `calendars.adoc`: `Calendar` vs `java.util.Calendar`; `HolidayCalendar`, `AnnualCalendar`, `CronCalendar`,
  `DailyCalendar`, `WeeklyCalendar`, `MonthlyCalendar`; chaining; `addCalendar` or Spring `Calendar` bean; `modifiedByCalendar`;
  *Bookshelf* business-day calendar from configuration; Example 8.
- [x] Task 10. `listeners-and-plugins.adoc`: `JobListener`, `TriggerListener` (`vetoJobExecution`), `SchedulerListener`;
  `ListenerManager` and matchers; registration via `SchedulerFactoryBeanCustomizer`; plugins (`LoggingJobHistoryPlugin`,
  `LoggingTriggerHistoryPlugin`, `XMLSchedulingDataProcessorPlugin`, `ShutdownHookPlugin` and why not under Spring,
  `JobInterruptMonitorPlugin`); plugin properties via `spring.quartz.properties`; best practices. Figure: Mermaid listener sequence.

### Group 3 — Job stores and database pages (Parallelizable: yes — one new file per task; Task 11 must be readable before others link to it but links are validated only at the end)

Every database page follows the template in the issue (status, dependencies, schema with DDL script name + Flyway + Liquibase
variants, `application.yml` for Boot 4.1, transactions/locking, clustering, Testcontainers test running the *Bookshelf* jobs,
pitfalls, `== References` with driver/database docs). Use Task 1 results for every claim of "works".

- [x] Task 11. `job-stores-and-persistence.adoc` ★★: `JobStore` SPI; `RAMJobStore` vs `JobStoreTX`/`JobStoreCMT` vs
  `LocalDataSourceJobStore`; `spring.quartz.job-store-type`; `QRTZ_*` tables, `tablePrefix`, `useProperties`, real delegate list;
  schema management (`initialize-schema` modes and why `always` destroys triggers, `.schema`, `.platform`, `.comment-prefix`,
  `.continue-on-error`, Flyway/Liquibase with the bundled `liquibase.quartz.init.xml`, link `database/schema-evolution/`);
  `@QuartzDataSource`/`@QuartzTransactionManager`; pool sizing; `overwrite-existing-jobs`; never write to Quartz tables; non-JDBC
  store via `jobStore.class` (tested result); **database support matrix**. Figures: SVG ER diagram of `QRTZ_` tables; Mermaid of a
  `JobDetail` bean stored on startup.
- [x] Task 12. `database-postgresql.adoc` ★★ (reference page): `PostgreSQLDelegate`/`bytea`; `tables_postgres.sql`; dedicated
  schema/user; `@QuartzDataSource` variant; `SELECT … FOR UPDATE` locking; vacuuming `QRTZ_FIRED_TRIGGERS`; 3-node Testcontainers
  cluster test. Figure: Mermaid sequence of trigger acquisition with row locks.
- [x] Task 13. `database-mysql-and-mariadb.adoc` ★: `StdJDBCDelegate`, `tables_mysql_innodb.sql` (never the MyISAM script),
  InnoDB/isolation, MariaDB differences, Testcontainers MySQL and MariaDB modules.
- [x] Task 14. `database-oracle.adoc` ★: `oracle.OracleDelegate`, `tables_oracle.sql` vs `tables_oracle23.sql`, schema/user setup,
  Testcontainers Oracle Free (state clearly what was run).
- [x] Task 15. `database-sql-server.adoc` ★: `MSSQLDelegate`, `tables_sqlServer.sql` and the exact edits (verified against the script;
  name the unreleased 2.5.3 `nvarchar` change), Azure SQL, `selectWithLockSQL` lock hints verified against the source, Testcontainers
  MSSQL.
- [x] Task 16. `database-embedded-and-other-sql.adoc`: H2/HSQLDB/Derby for dev/test (`initialize-schema=embedded`, `HSQLDBDelegate`,
  H2 script); table for DB2, Sybase, CUBRID, GaussDB, InterSystems Caché; dev/prod profile split.
- [x] Task 17. `database-mongodb.adoc` ★★: status in prose (no official store; archived community store; JCenter/mirror; predates
  2.4/2.5); the four options (SQL for Quartz + MongoDB for data with full *Bookshelf* example; the community store with config,
  collections, indexes, write concern, locking and the **tested result**; custom `JobStore` outline; no Quartz + ShedLock
  `MongoLockProvider`); links to `database/mongodb/`, `backend/springboot/spring-data-mongodb.adoc`,
  `database/schema-evolution/mongock-*.adoc`. Figures: SVG option 1 vs option 2; Mermaid decision flowchart. If the community store
  fails on 2.5.2, the page documents the failure and keeps only options 1, 3 and 4.
- [x] Task 18. `database-redis.adoc`: community `quartz-redis-jobstore` status and compatibility (tested result); configuration via
  `spring.quartz.properties` (host/port/database/key prefix, Cluster/Sentinel); Redlock-based locking; durability caveats (link
  Redis pages); Quartz-on-SQL alternative; ShedLock `RedisLockProvider`; note that other NoSQL stores on this site have no Quartz
  store and follow the MongoDB option 1.

### Group 4 — Clustering and Spring Boot integration (Parallelizable: yes — one new file per task)

- [x] Task 19. `clustering.adoc` ★★: JDBC clustering mechanics (`QRTZ_LOCKS` `TRIGGER_ACCESS`/`STATE_ACCESS`,
  `QRTZ_SCHEDULER_STATE`, `clusterCheckinInterval` 7500 ms, `instanceId=AUTO`, identical config); load balancing; fail-over and
  `requestsRecovery`; clock sync ≤ 1 s; never mixing clustered/non-clustered; `acquireTriggersWithinLock`,
  `batchTriggerAcquisitionMaxCount`, `FireAheadTimeWindow`; scaling limits; NoSQL stores; Kubernetes (pod names as instance IDs,
  graceful shutdown with `wait-for-jobs-to-complete-on-shutdown`, link Kubernetes pages); Terracotta gone; Example 13; 3-node
  *Bookshelf* cluster (use Task 1.3 results). Figures: two Mermaid sequences (competing for a trigger; node failure → recovery),
  SVG cluster topology.
- [x] Task 20. `spring-boot-configuration.adoc` ★★: every `spring.quartz.*` property with its v4.1.1 default (read
  `QuartzProperties`/`QuartzJdbcProperties` from the 4.1.1 tag); raw Quartz properties via `spring.quartz.properties`;
  `quartz.properties` handling (tested result); `SchedulerFactoryBeanCustomizer`; why an `Executor` bean is not used;
  `LocalTaskExecutorThreadPool` and virtual threads; profiles; multiple schedulers; Boot 4 package moves; full property table;
  full *Bookshelf* configuration. Figure: Mermaid configuration resolution.
- [x] Task 21. `dynamic-scheduling-and-management.adoc` ★: the injected `Scheduler` API at runtime (all methods listed in the issue);
  list/update/unschedule recipes; *Bookshelf* reminders REST API + securing it (link `spring-security.adoc`); transactional
  consistency (`LocalDataSourceJobStore`, MongoDB case linked); contrast with `TaskScheduler.schedule`. Figure: Mermaid sequence
  loan created → reminder scheduled → book returned → reminder deleted.

### Group 5 — Quality and operations (Parallelizable: yes — one new file per task)

- [x] Task 22. `observability.adoc` ★★: Actuator `quartz` endpoint (all GET paths with real sample JSON from Task 1.3, POST trigger-now,
  exposure, `management.endpoint.quartz.access`, sanitization, securing); `/actuator/scheduledtasks` and
  `tasks.scheduled.execution`; absence of Quartz health indicator/Micrometer binder and how to build both (listener-based
  `Timer`/`Counter`, custom `HealthIndicator`); JMX; history plugins and MDC; alerting; tracing. Figures: SVG metrics pipeline;
  Mermaid of signal sources.
- [x] Task 23. `testing.adoc` ★★: unit-testing job logic; testing trigger definitions (`TriggerUtils.computeFireTimes`,
  `CronExpression`); `@SpringBootTest` with memory store and `auto-startup=false`; Awaitility; asserting on `/actuator/quartz`;
  Testcontainers JDBC test parameterized over containers; two-scheduler cluster test; testing `@Scheduled` + ShedLock; injectable
  `Clock`; `spring-boot-starter-quartz-test`. Figure: Mermaid cluster test topology.
- [x] Task 24. `production-and-best-practices.adoc` ★: expanded official best-practices page; graceful shutdown/rolling deployments;
  thread pool sizing; long-running jobs vs Spring Batch; DB maintenance; anti-patterns table (the seven rows in the issue).
- [x] Task 25. `migration-and-whats-changed.adoc`: Quartz 2.3 → 2.4 → 2.5; Boot 3.5 → 4.x; `StatefulJob` → annotations; migrating from
  `@Scheduled`/ShedLock; migrating a job store between databases; **the full stale-docs table** from the issue Context with the
  four "verify by test" items resolved from Task 1.
  - Result: Created `migration-and-whats-changed.adoc` (Quartz 2.3->2.4->2.5 incl. DDL diffs measured on the three jars, Boot 3.5->4.x, StatefulJob, @Scheduled/ShedLock->Quartz, job-store migration with a run copy program, stale-docs tables). Examples run in `scheduling-verification/g5-task25/` (H2 copy program, Boot 4.1.1 tests). Corrections made in `job-stores-and-persistence.adoc`, `database-postgresql.adoc`, `database-mongodb.adoc`, `database-redis.adoc`, `database-oracle.adoc`, `database-mysql-and-mariadb.adoc`, `database-sql-server.adoc`, `database-embedded-and-other-sql.adoc`, `getting-started-with-spring-boot.adoc` (continue-on-error 4.x only; @QuartzDataSource does not rescue two DataSources without @Primary). `npm run validate:mermaid` passed.

### Group 6 — Comparison and landing pages (Parallelizable: yes — two new files; each only links to pages from groups 2–5)

- [x] Task 26. `standard-scheduling-vs-quartz.adoc` ★★: compact standard-scheduling recap (links
  `backend/springboot/scheduling-and-shedlock.adoc`, no duplication); what standard scheduling cannot do; the Quartz model;
  feature-by-feature table (4 columns, ✔/✘/partial + note, all rows listed in the issue); cron dialect table; ShedLock-vs-Quartz
  clustering; out-of-process alternatives (Kubernetes `CronJob` linked, Spring Batch linked, db-scheduler/JobRunr in prose only);
  decision flowchart; `@Scheduled` → Quartz migration walkthrough on a *Bookshelf* job; "same idea in other stacks" table linking
  Quarkus, NestJS, Celery beat, ASP.NET `BackgroundService`, Kubernetes. Figures: Mermaid decision flowchart, SVG two
  architectures side by side, Mermaid node-crash sequence (ShedLock vs Quartz), Mermaid restart timeline.
  - Result: Created `standard-scheduling-vs-quartz.adoc` (22-row feature table, cron table, 4 Mermaid blocks, SVG `scheduling-standard-vs-quartz-architectures.svg`, migration of the weekly report). Run in scratch `g6-task26`: @Scheduled+ShedLock fired, Quartz job fired and trigger persisted across a second context, default scheduler = 1-thread ThreadPoolTaskScheduler / SimpleAsyncTaskScheduler with virtual threads, fixedRate never overlaps with pool 4. validate:mermaid passed.
- [x] Task 27. `index.adoc` (landing): what scheduling means for a backend service; version baseline in prose; the *Bookshelf*
  scenario with final layout and `application.yml`; reading path; `== What's covered` grouped as the issue; the "related material
  elsewhere" table (existing Scheduling & ShedLock first row, plus every row of the issue's "What already exists" table);
  `== Bibliography` listing **every** source from the issue's Bibliography, each linked to its official documentation;
  `== References`. Figures: SVG map of the five jobs, Mermaid mind-map of the section.
  - Result: Created `index.adoc` (scenario + layout + application.yml, reading path, What's covered, related-material table, full Bibliography, mind-map, SVG `scheduling-bookshelf-jobs-map.svg`). validate:mermaid passed; xrefs resolve (only `cheat-sheet.adoc` pending Group 7). The layout is a map of the pages (not a runnable project).

### Group 7 — Cheat sheet, navigation and existing-page edits (Parallelizable: yes — every task edits a different file)

- [x] Task 28. `cheat-sheet.adoc` and `attachments/scheduling-cheat-sheet.pdf`: page follows `backend/resilience/cheat-sheet.adoc`
  (disclaimer, intro with baseline linking `xref:attachment$scheduling-cheat-sheet.pdf[...]`, grouped `*Group* --` xref paragraphs to
  every page incl. Scheduling & ShedLock, final download line, `== References`). PDF "Scheduling Cheat Sheet: Standard Spring
  Scheduling & Quartz": one A4 page via throwaway HTML + headless Chrome, multi-column, colour-coded, versions and date in the
  header, one box per group listed in the issue (standard scheduling, ShedLock, decision table, cron dialects, Quartz model,
  misfires, Spring Boot integration with defaults, databases matrix, clustering, runtime API, observability, testing/anti-patterns).
  Verify the PDF has exactly one page; commit only the PDF.
  - Result: Created `cheat-sheet.adoc` and `attachments/scheduling-cheat-sheet.pdf` (1 A4 page, 4 columns, 12 boxes, checked with pdfinfo and a rendered PNG).
- [x] Task 29. `modules/ROOT/nav.adoc`: insert `*** xref:backend/scheduling/index.adoc[Scheduling]` between the Spring Batch cheat
  sheet (l.961) and OAuth (l.962), followed by `****` children in the outline order (foundations, core, stores/databases,
  clustering/Boot, quality/operations), ending with `**** xref:backend/scheduling/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
  - Result: `nav.adoc`: Scheduling block with 25 children.
- [x] Task 30. `backend/index.adoc`: add a Scheduling bullet after the Spring Batch bullet; append to `:description:` and `:keywords:`
  exactly as the issue lists.
  - Result: `backend/index.adoc`: bullet, description and keywords.
- [x] Task 31. `backend/springboot/index.adoc` (second bullet in `=== Scheduling`, `:keywords:` + "Quartz", Bibliography pointer) and
  `backend/springboot/cheat-sheet.adoc` (extend the "Messaging and scheduling" line, add a line to the Scheduling cheat sheet).
  - Result: `springboot/index.adoc` and `springboot/cheat-sheet.adoc` updated.
- [x] Task 32. `backend/springboot/scheduling-and-shedlock.adoc` (not moved): intro paragraph linking the Scheduling section and the
  comparison page; closing line contrasting ShedLock's lock-and-skip with Quartz clustering (`clustering.adoc`); a Scheduling-section
  link next to the existing Quarkus pointer; refresh ShedLock 6.2.0 → 7.x (verified current, 7.10.1 at planning) at all 5 versions; fix
  the "TaskScheduler abstraction" wording (1-thread `ThreadPoolTaskScheduler`, or virtual-thread `SimpleAsyncTaskScheduler`). Verify the
  ShedLock 7.x API/artifact names used in the page still match.
  - Result: `scheduling-and-shedlock.adoc`: intro link, closing contrast, Scheduling link, 5 x ShedLock 7.10.1 (artifacts and API verified with javap against the 7.10.1 jars), TaskScheduler wording.
- [x] Task 33. One-line back-links in related pages (verify each target with `ls` first): `spring-batch/running-a-job.adoc`,
  `quarkus/scheduling-and-mail.adoc` (to `clustering.adoc`), `kubernetes/jobs-and-cronjobs.adoc`, `database/mongodb/index.adoc`,
  `database/redis/use-cases-and-patterns.adoc`, `backend/springboot/metrics-and-observability.adoc`,
  `unit-and-integration-testing.adoc`, `backend/docker/spring-boot-integration-tests-with-testcontainers.adoc`, and any other
  "What already exists" row whose page deserves a pointer.
  - Result: Back-links added in running-a-job, quarkus scheduling-and-mail, kubernetes jobs-and-cronjobs, mongodb index, redis use-cases-and-patterns, metrics-and-observability, unit-and-integration-testing, docker testcontainers page, concurrency-alternatives.

### Group 8 — Build and validation (Parallelizable: no — every check needs the finished section; run in the order listed)

- [x] Task 34. Validate links and structure
  - [x] Task 34.1. Check every `xref:` in `backend/scheduling/**` and every edited outside page resolves to an existing file/anchor; no
    `xref:` inside backticks; no `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks other than the partial's (`grep -rn '^\[\(NOTE\|TIP\|WARNING\|CAUTION\|IMPORTANT\)\]'`);
    every page includes the disclaimer, has `== References`, and every code example is followed by a `Source:` link.
  - [x] Task 34.2. Check acceptance criteria one by one against the issue (page counts, ★★ depth, every `spring.quartz.*` property with
    default, misfire instructions per trigger type, comparison-page contents, database template items, Bibliography completeness,
    all "verify by test" items resolved and stated).
- [x] Task 35. `npm run validate:mermaid` passes; `npx antora antora-playbook.yml` completes with **no** `xref`/AsciiDoc errors or warnings;
  open the rendered pages in `build/site` (landing, comparison, PostgreSQL, MongoDB, cheat sheet) and confirm diagrams, tables and the PDF
  download render. Delegate the build to the `iru-gate-runner` agent to keep output out of the main context.
- [x] Task 36. Run the `iru-check-security` skill over the changed files (no secrets or real endpoints in examples/YAML), confirm
  `git status` contains only intended files (no scratch project, no HTML source for the PDF), and confirm `build/` is untracked.
