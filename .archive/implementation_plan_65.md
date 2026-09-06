# Implementation Plan: Transaction Isolation & Locking (SpringBoot Reference)

## Task summary

Source: GitHub issue #65

Add **one new page** to the existing **SpringBoot Reference** section
(`modules/ROOT/pages/backend/springboot/`) explaining transaction isolation levels, their performance impact,
pessimistic locking, and how pessimistic and optimistic locking compare — then add a short **isolation-level
subsection to all five Spring Data pages** and wire the new page into navigation, the section landing page, and
the section bibliography.

| Page file | Title | Scope |
|-----------|-------|-------|
| `transaction-isolation-and-locking.adoc` | Transaction Isolation & Locking | The `@Transactional(isolation = …)` attribute and the `Isolation` enum; a one-table recap of the four isolation levels and the read phenomena they permit (deferring the full SQL model to the database reference); how isolation level affects performance and concurrency (lock scope/duration, MVCC snapshot cost, blocking vs. serialization failures/deadlock + retry, throughput as the level rises); **pessimistic locking** via `@Lock(LockModeType.PESSIMISTIC_*)` + `@QueryHints` lock timeouts; a **pessimistic-vs-optimistic** pros/cons comparison that links to (does not repeat) the existing `@Version` material; and a per-store support table. |

Everything targets **Spring Boot 4.1.x / Spring Framework 7.0.x** on the Java 17/21+ baseline
(`partial$springboot-disclaimer.adoc`); Java code samples use Jakarta Persistence names
(`jakarta.persistence.LockModeType`, `jakarta.persistence.lock.timeout`).

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **Dedicated new page, all five module pages updated.** Confirmed with the user before planning: the
   explanatory comparison lives in a new `transaction-isolation-and-locking.adoc`; `spring-data-overview.adoc`
   plus `spring-data-{jpa,mongodb,couchbase,neo4j}.adoc` each gain an isolation-level subsection.
2. **DB/SQL isolation theory is not re-derived.** `modules/ROOT/pages/database/sql/transactions.adoc` already
   has a full treatment of the four ANSI levels, the dirty/non-repeatable/phantom matrix, and a
   pessimistic-vs-optimistic "Choosing between the two strategies" section. The new page recaps the phenomena in
   one short table and `xref`s that page for depth, matching how the SpringBoot section already defers
   engine-level theory to the `database/` reference pages. The new page's contribution is the **Spring layer**:
   the `isolation` attribute, `@Lock`, per-store `PlatformTransactionManager` behaviour, and the trade-off
   framed for a Spring Data developer (retry on `OptimisticLockingFailureException` vs. hold a row lock).
3. **Content-only, untagged plan.** This repo has no application source; every task is AsciiDoc authoring.
   `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns only `java` / `dotnet` /
   `iru-database` — none covers AsciiDoc — so **no task carries a language/framework tag**, matching every prior
   documentation plan in `.archive/` (`_55`, `_57`, `_59`, `_61`, `_63`).
4. **Closest precedent: `.archive/implementation_plan_63.md`** (issue #63) and `_61`. This plan copies their
   shape: author the new page in house style (`= Title` → `:description:` → `:keywords:` →
   `include::partial$springboot-disclaimer.adoc[]` → `==`/`===` sections → `[source,java]` with `----` →
   optional `[mermaid]` `....` → `== References`); wire `nav.adoc` + `backend/springboot/index.adoc`
   ("What's covered" group + `:description:`/`:keywords:` + Bibliography) + a light touch on
   `backend/index.adoc`; verify the Antora build via the `iru-gate-runner` agent.
5. **One `[mermaid]` diagram** — a decision flow for "optimistic or pessimistic?" (contention level → conflict
   cost → transaction length). No hand-authored SVG (no spatial layout to draw).
6. **Page placement:** immediately after `spring-data-neo4j.adoc` in `nav.adoc` (line 442→443) and in the
   `=== Spring Data` group of `index.adoc` — it is a Spring Data cross-cutting concern, not an ORM/search/batch
   topic.
7. **Neo4j page gains a new `== Transactions` section** (it has none today — only `== Optimistic locking with
   @Version`), in addition to the isolation note, so the isolation paragraph has a home consistent with the
   MongoDB and Couchbase pages.
8. **Page ends with `== References`** (bare official Spring doc links) and a short `== Summary` bullet list —
   matching the newest section pages (`spring-batch.adoc`, `spring-security.adoc`) and the `spring-data-*`
   summaries respectively.
9. **Out of scope:** no change to `partial$springboot-disclaimer.adoc`; no cheat-sheet page; no new SVG image;
   no new Bibliography *book* entries (only official-doc URLs added to the existing list).

## Current code state

- **Section directory** `modules/ROOT/pages/backend/springboot/` — 32 existing `.adoc` pages, one house style
  (`= Title` → `:description:` → `:keywords:` → disclaimer include → `==`/`===` sections → `[source,java|yaml|xml]`
  with `----` → `[mermaid]` `....` → closing `== References` or `== Summary`). `xref`s use **explicit link
  text** (`xref:path.adoc[Text]`) — enforced in prior PR reviews. No transactions/isolation/locking page exists.
- **`modules/ROOT/pages/backend/springboot/spring-data-overview.adoc`** — `== `@Transactional`` is lines
  **223–254**; it ends with *"Whether `@Transactional` maps onto a real ACID transaction, and how strong its
  isolation guarantees are, depends entirely on the underlying store … Each store-specific page covers its own
  transactional behavior."* — the hand-wave issue #65 wants replaced with a real `isolation`-attribute
  explanation + `xref` to the new page. `== Optimistic locking with @Version` is line **257**.
- **`modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc`** — `== Transactions, optimistic locking, and
  auditing` line **313**; `=== @Transactional and propagation` lines **315–355** document `propagation` only,
  **no `isolation`**. Lines **415–418** already contrast `@Version` with
  `@Lock(LockModeType.PESSIMISTIC_WRITE)` in one sentence — the anchor to expand into a worked `@Lock` +
  `@QueryHints` example. Page ends `== Summary` (line 578).
- **`modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc`** — `== Transactions` lines **277–319**
  (`MongoTransactionManager` + `@Transactional`), then `== Change streams (brief)` line 321. No isolation note.
- **`modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc`** — `== Transactions` lines **343–374**
  (`CouchbaseCallbackTransactionManager`); already defers concurrency/durability detail to
  `xref:database/couchbase/concurrency-locking-and-durability.adoc`. `== Summary` line 376.
- **`modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc`** — **no `== Transactions` section**;
  `== Auditing` ends ~line 288, `== Optimistic locking with @Version` is line **290**, `== Custom queries with
  Neo4jClient` line 320.
- **`modules/ROOT/pages/database/sql/transactions.adoc`** — full ANSI isolation-level treatment
  (§"Setting the isolation level", per-level sections, phenomena matrix) and a "Concurrency Control" section
  with `=== Pessimistic locking`, `=== Optimistic locking`, `=== Choosing between the two strategies`. The
  new page and every per-store subsection `xref` this for the database-level model.
- **`modules/ROOT/nav.adoc`** — SpringBoot Reference block lines **433–465**; entries are
  `**** xref:backend/springboot/<file>[Label]`. `spring-data-neo4j.adoc` is line **442**, `hibernate.adoc`
  is line **443**. Single contiguous block.
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — `:description:` (line **2**) and `:keywords:`
  (line **3**) enumerate every sub-topic; `=== Spring Data` group is lines **41–57** (five `xref` bullets,
  neo4j bullet ends ~line 57); `== Bibliography` (line **158**) has an
  `**Official documentation (primary source for every page)**` bulleted list (lines ~160–252).
- **`modules/ROOT/pages/backend/index.adoc`** — parent "Backend Development" landing page; line **14** is a
  one-paragraph `xref:backend/springboot/index.adoc[SpringBoot Reference]` blurb enumerating section topics;
  `:description:`/`:keywords:` (lines 2–3) also enumerate. Light touch only.
- **Build / verification:** `npx antora antora-playbook.yml` (local content only) must complete with **no
  `xref`/AsciiDoc warnings**; `build/` is gitignored. `iru-build-docs` wraps this; the `iru-gate-runner` agent
  is installed (`.claude/agents/iru-gate-runner.md`). No `*-code-one-task` / test / coverage / quality gate
  applies — AsciiDoc authoring is implemented directly and the Antora build is the only gate.

## Implementation steps

### Group 1 — Author the new page (Parallelizable: yes — single new file)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/transaction-isolation-and-locking.adoc`** — new
      page, ~250–400 lines, house style, one `[mermaid]` decision-flow block, closing `== Summary` +
      `== References`. All `xref`s use explicit link text. Docs-only; Antora build verified in Group 3.
  - [x] Task 1.1. **Header.** `= Transaction Isolation & Locking`; `:description:` (one sentence — the
        `@Transactional` isolation attribute, its performance impact, pessimistic locking with `@Lock`, and how
        it compares to `@Version` optimistic locking across Spring Data stores); `:keywords:` (`Spring
        transaction isolation, @Transactional isolation, Isolation enum, READ_COMMITTED, REPEATABLE_READ,
        SERIALIZABLE, dirty read, non-repeatable read, phantom read, pessimistic locking, @Lock, LockModeType,
        PESSIMISTIC_WRITE, PESSIMISTIC_READ, @QueryHints, jakarta.persistence.lock.timeout, SELECT FOR UPDATE,
        optimistic locking, @Version, OptimisticLockingFailureException, deadlock, PlatformTransactionManager,
        JpaTransactionManager, MongoTransactionManager`); then `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. **Intro paragraph.** Where isolation and locking sit relative to `@Transactional` boundaries
        and propagation (link `xref:backend/springboot/spring-data-jpa.adoc[Spring Data JPA]` and
        `xref:backend/springboot/spring-data-overview.adoc[Spring Data Overview]`); state that the ANSI/SQL
        model itself is covered in `xref:database/sql/transactions.adoc[SQL Reference: Transaction Control]` and
        this page is the Spring layer over it.
  - [x] Task 1.3. **`== Isolation levels in Spring`.** The `isolation` attribute of `@Transactional` and the
        `org.springframework.transaction.annotation.Isolation` enum (`DEFAULT`, `READ_UNCOMMITTED`,
        `READ_COMMITTED`, `REPEATABLE_READ`, `SERIALIZABLE`). A compact table: level → dirty / non-repeatable /
        phantom (permitted or prevented), with a line pointing to `xref:database/sql/transactions.adoc` for the
        per-level detail. Note `DEFAULT` = keep the datasource/DB default, and typical engine defaults
        (PostgreSQL/Oracle/SQL Server `READ COMMITTED`, MySQL InnoDB `REPEATABLE READ`). Short
        `[source,java]` example: `@Transactional(isolation = Isolation.REPEATABLE_READ)` on a service method.
  - [x] Task 1.4. **`== How isolation level affects performance`.** Lock scope and duration grow with the
        level; MVCC snapshot bookkeeping cost; stricter levels convert silent anomalies into explicit
        outcomes — blocking, lock-wait timeouts, deadlocks, or serialization failures the caller must retry;
        throughput/contention trade-off as the level rises; keep transactions short and prefer
        `@Transactional(readOnly = true)` for read paths. No code; prose + a short bullet list.
  - [x] Task 1.5. **`== Pessimistic locking`.** `@Lock(LockModeType.PESSIMISTIC_READ | PESSIMISTIC_WRITE |
        PESSIMISTIC_FORCE_INCREMENT)` on a `JpaRepository` query method; `@QueryHints({ @QueryHint(name =
        "jakarta.persistence.lock.timeout", value = "3000") })` for the wait cap; note it emits
        `SELECT … FOR UPDATE` (or the dialect equivalent) and holds the row lock until commit; when it is the
        right call (high contention, short transactions, a write that must not fail-and-retry). `[source,java]`
        repository + service snippet:
        ```java
        interface AccountRepository extends JpaRepository<Account, Long> {
            @Lock(LockModeType.PESSIMISTIC_WRITE)
            @QueryHints(@QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000"))
            Optional<Account> findWithLockById(Long id);
        }
        ```
  - [x] Task 1.6. **`== Optimistic locking (recap)`.** Two short paragraphs only — `@Version`, the
        `OptimisticLockingFailureException` family, retry the read-modify-write cycle — then `xref` to
        `spring-data-overview.adoc` (cross-store mechanism) and each store page's "Optimistic locking with
        `@Version`" section for the concrete detail. Do **not** duplicate those examples.
  - [x] Task 1.7. **`== Optimistic vs. pessimistic: choosing`.** A pros/cons table (columns: optimistic /
        pessimistic; rows: how conflicts surface, cost under low contention, cost under high contention,
        deadlock risk, scalability, caller complexity, fit for long "user think time" edits) plus a short
        guidance paragraph. One `[mermaid]` `flowchart` decision tree: *conflicts rare?* → optimistic; *rare
        but expensive to redo, or long transaction?* → weigh; *frequent + short transaction + must-not-retry?*
        → pessimistic. Reference (don't restate) `xref:database/sql/transactions.adoc` "Choosing between the two
        strategies".
  - [x] Task 1.8. **`== Per-store support`.** A table: **JPA / relational** — full `isolation` support via
        `DataSourceTransactionManager`/`JpaTransactionManager` + `@Lock`; **MongoDB** — `isolation` attribute
        unsupported (`MongoTransactionManager` → `InvalidIsolationLevelException`); governed by read/write
        concern + read preference; **Couchbase** — custom isolation unsupported; transactions carry their own
        model; **Neo4j** — custom isolation unsupported; read-committed with write locks. Each cell links to
        that store's Spring Data page and, where relevant, its `database/` reference page.
  - [x] Task 1.9. **`== Summary` + `== References`.** Summary: 4–6 bullets. References: bare official links —
        Spring Framework "Data Access → Transaction Management" (`data-access/transaction.html` and
        `…/declarative.html`), Spring Data JPA locking (`spring-data/jpa/reference/…/locking.html`), and the
        `Isolation` / `LockModeType` Javadoc.
  - _Done:_ created `modules/ROOT/pages/backend/springboot/transaction-isolation-and-locking.adoc` (~290 lines,
    house style, 4 tables, 1 `[mermaid]` decision flow, `== Summary` + `== References`). No tests/coverage apply
    (AsciiDoc authoring); Antora build verified in Group 3.

### Group 2 — Add isolation-level subsections to the Spring Data pages and wire the new page in (Parallelizable: yes — each task edits a distinct file; all depend only on Group 1's new page existing)

- [x] **Task 2. `spring-data-overview.adoc` — replace the isolation hand-wave.** In `== `@Transactional``
      (lines 223–254), rewrite the closing paragraph so it: (a) keeps the "depends on the underlying store"
      point; (b) states `@Transactional` carries an `isolation` attribute (`Isolation` enum) honoured by
      relational stores via JPA/JDBC and **not** by the document/graph transaction managers; (c) adds
      `xref:backend/springboot/transaction-isolation-and-locking.adoc[Transaction Isolation & Locking]` for the
      full treatment and pessimistic-vs-optimistic comparison. Keep it to ~4–6 lines; no new code block.
- [x] **Task 3. `spring-data-jpa.adoc` — isolation + a worked pessimistic-lock example.** In
      `== Transactions, optimistic locking, and auditing`:
  - [x] Task 3.1. In `=== @Transactional and propagation` (lines 315–355), after the propagation paragraph,
        add a paragraph on `@Transactional(isolation = Isolation.REPEATABLE_READ)` — a per-transaction override
        of the DB session default, applied by `DataSourceTransactionManager`/`JpaTransactionManager` on the
        JDBC `Connection` and reset on release; note the caveat that some `JpaTransactionManager` setups need
        datasource-level support for a non-default isolation. `xref` the new page and
        `xref:database/sql/transactions.adoc[SQL Reference: Transaction Control]`.
  - [x] Task 3.2. Expand the single sentence at lines 415–418 into a short `=== Pessimistic locking`
        subsection: a `JpaRepository` method annotated `@Lock(LockModeType.PESSIMISTIC_WRITE)` with a
        `@QueryHints` `jakarta.persistence.lock.timeout`, a two-line service caller, one line on the emitted
        `SELECT … FOR UPDATE` and lock lifetime, and a pointer to the new page for when to prefer it over
        `@Version`.
- [x] **Task 4. `spring-data-mongodb.adoc` — isolation note.** After the `== Transactions` example (ends line
      319), add `=== Isolation level`: `@Transactional`'s `isolation` attribute is **not** supported by
      `MongoTransactionManager` (a non-default value raises `InvalidIsolationLevelException`); concurrency for
      multi-document transactions is governed by read concern, write concern, read preference and causal
      consistency. `xref:database/mongodb/transactions.adoc[MongoDB Reference: Transactions]` and
      `xref:backend/springboot/transaction-isolation-and-locking.adoc[Transaction Isolation & Locking]`.
- [x] **Task 5. `spring-data-couchbase.adoc` — isolation note.** After the `== Transactions` section (ends line
      374, before `== Summary`), add `=== Isolation level`: `CouchbaseCallbackTransactionManager` does not
      support a custom `@Transactional` isolation level; Couchbase distributed transactions provide their own
      isolation model (staged writes, read-your-own-writes) rather than exposing the ANSI levels. `xref` the
      existing `xref:database/couchbase/concurrency-locking-and-durability.adoc[…]` and the new page.
- [x] **Task 6. `spring-data-neo4j.adoc` — new `== Transactions` section + isolation note.** Insert a new
      `== Transactions` section between `== Auditing` (~line 288) and `== Optimistic locking with @Version`
      (line 290): a short intro, a `[source,java]` `@Configuration` bean returning `Neo4jTransactionManager`
      and a `@Transactional` service method, then `=== Isolation level` stating that a custom `@Transactional`
      isolation level is not supported by `Neo4jTransactionManager` and Neo4j runs at read-committed with write
      locks taken on modified nodes/relationships. `xref` the new page.
- [x] **Task 7. Wire the new page into navigation, the landing page, and the bibliography.**
  - [x] Task 7.1. `modules/ROOT/nav.adoc` — insert
        `**** xref:backend/springboot/transaction-isolation-and-locking.adoc[Transaction Isolation & Locking]`
        as a new line between line 442 (`spring-data-neo4j.adoc`) and line 443 (`hibernate.adoc`).
  - [x] Task 7.2. `modules/ROOT/pages/backend/springboot/index.adoc` — add a sixth bullet to the
        `=== Spring Data` group (after the `spring-data-neo4j.adoc` bullet, ~line 57):
        `* xref:backend/springboot/transaction-isolation-and-locking.adoc[Transaction Isolation & Locking] --
        the `@Transactional` isolation attribute and its performance impact, pessimistic locking with `@Lock`,
        and how it compares to `@Version` optimistic locking across the Spring Data stores.` Extend
        `:description:` (line 2) and `:keywords:` (line 3) with "transaction isolation levels", "pessimistic
        locking", "@Lock", "LockModeType".
  - [x] Task 7.3. `modules/ROOT/pages/backend/springboot/index.adoc` `== Bibliography` — add to the
        `**Official documentation**` list the Spring Framework transaction-management reference URL and the
        Spring Data JPA locking reference URL (same bare-link style as the surrounding entries).
  - [x] Task 7.4. `modules/ROOT/pages/backend/index.adoc` — light touch: add "transaction isolation & locking"
        to the topic enumeration in the line-14 `SpringBoot Reference` blurb and to `:keywords:` (line 3).

### Group 3 — Verify the Antora build (Parallelizable: yes — single task)

- [x] **Task 8. Build the docs site and confirm no warnings.** Delegate to the `iru-gate-runner` agent:
      `Agent({description: "Build Antora docs site", subagent_type: "iru-gate-runner", prompt: "Invoke
      Skill({skill: \"iru-build-docs\"}) (or run `npx antora antora-playbook.yml`) at the repository root.
      Report only: whether the build completed, and the full text of any AsciiDoc/xref warning or error —
      especially any unresolved `xref` to `transaction-isolation-and-locking.adoc` or from it, and any nav
      entry that did not resolve."}` Fix any reported unresolved `xref`s / malformed blocks and re-run until the
      build is clean. Confirm the new page renders under `build/site/backend/springboot/` and the nav entry
      appears.

  - _Done:_ `npx antora antora-playbook.yml` completed with **zero** AsciiDoc/xref warnings or errors (exit 0).
    All 8 inbound `xref`s to `transaction-isolation-and-locking.adoc` resolved, the `nav.adoc:443` entry
    resolved, no `class="xref unresolved"` markers anywhere in `build/site`, and
    `build/site/backend/springboot/transaction-isolation-and-locking.html` was generated.

### Group 2 notes

Files modified: `modules/ROOT/pages/backend/springboot/spring-data-overview.adoc` (isolation paragraph replacing
the hand-wave), `spring-data-jpa.adoc` (isolation paragraph + new `=== Pessimistic locking` subsection),
`spring-data-mongodb.adoc` / `spring-data-couchbase.adoc` (new `=== Isolation level` subsections),
`spring-data-neo4j.adoc` (new `== Transactions` section + `=== Isolation level`),
`modules/ROOT/nav.adoc`, `modules/ROOT/pages/backend/springboot/index.adoc` (bullet, `:description:`,
`:keywords:`, Bibliography), `modules/ROOT/pages/backend/index.adoc` (blurb + `:keywords:`). Docs-only — no
tests/coverage/static analysis apply; verified by the clean Antora build above.
