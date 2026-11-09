# Implementation Plan: "Database Migration" section (Debezium change data capture) under Guides & References / Databases

## Task summary

Source: GitHub issue #382
Base branch: main
Branch: feature/382-database-migration

Issue [#382](https://github.com/albertoirurueta/docs/issues/382) asks for a new sub-section **Database Migration**
(`modules/ROOT/pages/database/migration/`). It teaches how to use Debezium to generate change events from a legacy
database, listen to them, and use them to migrate the data to a new database while both systems run side by side.
The issue body is the specification (scope, version baseline, conventions, bibliography, acceptance criteria). Its two
comments contain the 44-page outline and the coverage table from the official Debezium docs to pages
(`gh issue view 382 --json body,comments`).

Deliverables:

1. **44 AsciiDoc pages** in `database/migration/`, in the outline order.
2. **Nav wiring**: a `*** Database Migration` block after "Evolving the Database Model", with `****` group headings and
   `*****` entries.
3. **Partial** `partials/database-migration-disclaimer.adoc`. The AI-assistance notice is the only admonition allowed.
4. **Figures**: `database-migration-*.svg` in `modules/ROOT/images/` (overview, phases, deployment options, change
   event anatomy, Oracle LogMiner, incremental snapshot watermarks, anti-corruption stream, Bookshop stack, reverse
   replication), plus Mermaid diagrams.
5. **Bibliography** on `index.adoc` listing every source used, each linked to its official website.
6. **Cheat sheet** page + a one-page PDF `attachments/database-migration-cheat-sheet.pdf`.
7. **Cross-links** from the existing architecture, messaging and database pages.

**Choices made on the user's behalf** (challenge them at review)

* Baseline: Debezium 3.7.1.Final (verified 2026-11-09), Kafka 4.x KRaft, Spring Boot 4.1, Java 21.
* Running example: the Bookshop system from the architecture pages, with legacy Oracle AI Database 26ai Free
  (`gvenzl/oracle-free:23.26.3`) migrated to PostgreSQL 18, plus a small MongoDB `bookshop.reviews` example.
  Canonical names are in the agent brief.
* Execution: pages are written by background agents, two to four pages per agent, all sharing one brief. Facts
  verified during the work are added to the brief's addendum.
* Verification: the getting-started tutorial (MySQL/PostgreSQL) and the Oracle → PostgreSQL worked example are actually
  run in Docker. Java examples are compiled against the released jars where practical. All other configuration is
  derived from the official docs, and each page states what was run.
* Official docs vs the 3.7.1 jars: where they disagree (MongoDB sink class name, JDBC sink DLQ flag, bundled ojdbc11,
  Oracle PDB signal table name), the pages follow the jars or the run and explain the difference.

## Acceptance criteria coverage

| Criterion (issue body) | Covered by |
|---|---|
| 44 pages + nav + index reading paths | Groups 1–6 |
| Every official Debezium 3.7 doc concept covered | Groups 2–5 (coverage table in issue comment 2), Group 8 audit |
| Detailed prose + code examples linked to official docs | All page tasks, Group 8 review |
| Mermaid validates, SVGs referenced and rendering, CLAUDE.md greps clean | Group 7 |
| Only the AI-assistance admonition | Partial (Group 1), grep in Group 7 |
| Bibliography with official links | Task 6.3 |
| Cheat sheet + one-page PDF | Task 6.4 |
| Existing pages cross-link the section | Task 1.4 |
| Antora build without xref/AsciiDoc errors | Group 7 |

## Implementation steps

### Group 1 — Scaffolding and wiring (Parallelizable: no)

- [x] Task 1.1. Create branch `feature/382-database-migration`.
- [x] Task 1.2. Write the shared agent brief: conventions, canonical Bookshop names, page list, checks.
- [x] Task 1.3. Add the nav block (44 entries, 11 groups) and the disclaimer partial.
- [x] Task 1.4. Cross-link `database/index.adoc`, `migration-path-legacy-to-modern-stack.adoc`,
  `migration-path-monolith-to-microservices.adoc`, `decisions-and-migrations/index.adoc`, `transactional-outbox.adoc`,
  `kafka-connect.adoc` and `messaging-patterns-in-practice.adoc` (Debezium 3.6 URLs moved to `stable`), and
  `choosing-the-right-database.adoc`.
- [x] Task 1.5. Write `index.adoc` (running example, reading paths, page map, baseline) and `database-migration-overview.svg`.
  The bibliography is filled in at Task 6.3.

### Group 2 — Introduction and fundamentals (Parallelizable: yes)

- [x] Task 2.1. Pages 2–3: `migration-strategies`, `migration-patterns-with-cdc` + `database-migration-phases.svg`.
- [x] Task 2.2. Pages 4, 5, 7: `debezium-architecture`, `debezium-features-and-guarantees`,
  `installation-and-deployment` + `database-migration-debezium-deployment-options.svg`.
- [x] Task 2.3. Page 6: `getting-started-tutorial`, run in Docker (MySQL and PostgreSQL variants).
- [x] Task 2.4. Pages 8–10: `change-event-structure`, `serialization-avro-and-schema-registries`,
  `data-types-and-precision` + `database-migration-change-event-anatomy.svg`.

### Group 3 — Source connectors, snapshots and signals (Parallelizable: yes)

- [x] Task 3.1. Page 11: `oracle-connector` + `database-migration-oracle-logminer.svg`.
- [x] Task 3.2. Pages 12–13: `postgresql-connector`, `mysql-and-mariadb-connectors`.
- [x] Task 3.3. Pages 14–16: `sql-server-connector`, `mongodb-connector`, `other-source-connectors`.
- [x] Task 3.4. Pages 17–19: `initial-snapshots`, `incremental-and-blocking-snapshots`, `signaling-and-notifications`
  + `database-migration-incremental-snapshot-watermarks.svg` (fix the Mermaid `Off` participant; align the Oracle
  PDB signal table name with the worked-example result).

### Group 4 — Transformations, sinks and consumers (Parallelizable: yes)

- [x] Task 4.1. Pages 20–23: `single-message-transformations`, `event-flattening`, `outbox-event-router`,
  `custom-converters-and-post-processors`.
- [x] Task 4.2. Pages 24–25: `jdbc-sink-connector`, `mongodb-sink-connector`.
- [x] Task 4.3. Pages 26–28: `consuming-change-events-in-applications`, `debezium-engine`, `debezium-server`
  + `database-migration-anti-corruption-stream.svg` (Java compiled against the released jars).

### Group 5 — Schema changes, runbook and operations (Parallelizable: yes)

- [x] Task 5.1. Pages 29, 31, 32: `schema-changes-during-migration`, `verification-and-reconciliation`,
  `cut-over-and-reverse-replication` + `database-migration-reverse-replication.svg`.
- [x] Task 5.2. Page 30: `worked-example-oracle-to-postgresql`, run in Docker + `database-migration-bookshop-stack.svg`.
  It decides the Oracle PDB signal table name.
- [x] Task 5.3. Pages 33–35: `running-on-kubernetes`, `monitoring-logging-and-tracing`, `offsets-restarts-and-exactly-once`.
- [x] Task 5.4. Pages 36–38: `troubleshooting-and-failure-recovery`, `security-and-data-protection`, `testing-cdc-pipelines`.
- [x] Task 5.5. Pages 39–41: `cloud-and-managed-services`, `other-uses-of-change-events`,
  `choosing-a-deployment-for-your-migration`.

### Group 6 — Wrap-up pages, bibliography and cheat sheet (Parallelizable: no; needs Groups 2–5)

- [x] Task 6.1. Page 43: `glossary`.
- [x] Task 6.2. Page 42: `best-practices`, built from the finished pages.
- [x] Task 6.3. Fill the `index.adoc` bibliography from every page's *References* list plus the issue's list. Check
  that every URL resolves.
- [x] Task 6.4. Page 44: `cheat-sheet` + `attachments/database-migration-cheat-sheet.pdf`, exactly one page, with the
  generator kept out of the repository.

### Group 7 — Build and verification (Parallelizable: no)

- [x] Task 7.1. `npx antora antora-playbook.yml` with no xref/AsciiDoc errors.
- [x] Task 7.2. The CLAUDE.md image and inline-code greps, the unquoted-comma alt text check on the new files, the
  admonition grep, and a check that every `database-migration-*.svg` is referenced.
- [x] Task 7.3. `npm run validate:mermaid` reports every diagram as parsed.
- [x] Task 7.4. Spot-check the rendered pages and the SVGs in the browser, and confirm that the PDF downloads.

### Group 8 — Review (Parallelizable: yes)

- [x] Task 8.1. (run as 5 review-and-fix agents, one block each, fixing in place) Split read-only review (4 agents, one block of pages each): contradictions across pages, canonical
  name drift, wrong or renamed properties, missing official-doc links, authoring leftovers (first person, local
  paths, "scratch").
- [x] Task 8.2. Apply the fixes and re-run Group 7.
- [x] Task 8.3. Check the coverage table in issue comment 2 against the finished pages.
- [x] Task 8.4. Archive this plan to `.archive/implementation_plan_382.md`. Commit and open a PR only when the user asks.

## Outcome notes (2026-11-09)

* 44 pages (~37,000 lines), 9 SVGs, 51 Mermaid diagrams, a one-page A4 PDF, and a bibliography of 296 sources
  (all HTTP 200 except dev.mysql.com, which returns 403 to automated clients).
* Runs in Docker: the tutorial (MySQL, PostgreSQL), the Oracle to PostgreSQL worked example, the PostgreSQL/MySQL/MariaDB/MongoDB
  connector labs, Debezium Server, the offsets API, and the Testcontainers tests (12 green). The SQL Server lab could not run
  (out of memory) and that page says so.
* Canonical source configuration settled by the worked-example run: JSON with schemas enabled, `decimal.handling.mode=string`,
  `provide.transaction.metadata=true`, mirror sink URL with `?stringtype=unspecified`, signal table
  `FREEPDB1.BOOKSHOP.DEBEZIUM_SIGNAL` (the official docs' CDB form is ignored), plus `INSERT, DELETE` on it (ORA-41900).
* Out of scope, pre-existing: `database/solr/solr-vs-elasticsearch.adoc` links to a wrong anchor in choosing-the-right-database.
