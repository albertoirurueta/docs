# Implementation Plan: Reactive pitfalls — transactions and `block()` (SpringBoot Reference)

## Task summary

Source: GitHub issue #67

The **Reactive Programming with Project Reactor** page
(`modules/ROOT/pages/backend/springboot/reactive-programming.adoc`) teaches Reactor's model well but never
warns about two ways it is misused in a Spring application:

1. **Reactive transaction context lives in the Reactor `Context`, not a `ThreadLocal`.** Work that leaves the
   reactive chain (an inner `subscribe()`, a `Mono`/`Flux` fired from `doOnNext`, a `CompletableFuture` bridged
   in without `Mono.fromFuture`, a blocking `@Transactional` proxy returning a `Publisher`, over-parallel
   `flatMap` over one R2DBC connection) silently escapes the surrounding transaction. A *plain thread hop* via
   `publishOn`/`subscribeOn` inside a single chain does **not** — the danger is breaking the chain, not
   switching threads.
2. **Calling `block()` / `blockFirst()` / `blockLast()` from a thread already running a reactive pipeline** —
   `IllegalStateException` on `parallel`/`single`/Netty event-loop threads, pool-starvation deadlock on
   `boundedElastic` under load, immediate feedback deadlock on the event loop. Preferred fix is to compose
   instead; `Schedulers.boundedElastic()` for unavoidable legacy blocking; BlockHound to detect accidents; and,
   as a genuine last resort, a guarded pattern for starting an independent flow and awaiting it (a *dedicated*
   `Scheduler`, `subscribeOn`, `toFuture().get(timeout)`, invoked off the event loop, with `Context` **not**
   crossing the boundary).

Add this as **two new `==` sections** in the existing `reactive-programming.adoc` page, plus cross-links from
two Spring Data pages and light landing-page/bibliography wiring.

### Choices made on the user's behalf (confirmed in planning — challenge in review)

1. **Two new sections in the existing page, not a new page.** Confirmed with the user via `AskUserQuestion`.
   The material is tightly coupled to the page's existing `== Schedulers and context` section (threads,
   `Context`, "never block in a `parallel()`/event-loop thread"), so a dedicated `reactive-pitfalls.adoc` (the
   `_65` precedent shape) would fragment closely related content. New sections:
   - `== Reactive transactions and thread affinity`
   - `== Bridging to blocking code safely`
   inserted **after `== Schedulers and context` (ends line 197) and before `== Error handling` (line 199)**,
   in the issue's own order (transactions first). No `nav.adoc` change (no new page); no new `index.adoc`
   *bullet* — but the page's own `:description:`/`:keywords:`, the `index.adoc` `=== Reactive programming`
   bullet text, and the `index.adoc` Bibliography get light updates.
2. **One `[mermaid]` decision-flow diagram** in the `== Bridging to blocking code safely` section (confirmed
   via `AskUserQuestion`): *must I block? → which thread am I on? → compose / offload with `subscribeOn` /
   dedicated `Scheduler` + `toFuture().get(timeout)`*. Matches the one-diagram-per-page pattern of recent
   section pages (`spring-batch.adoc`, `spring-security-authorization-server.adoc`). `[mermaid]` + `....`
   delimiters, per house style. This is the page's first diagram — no hand-authored SVG (no spatial layout to
   draw).
3. **Content-only, untagged plan.** This repo has no application source; every task is AsciiDoc authoring.
   `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` yields only `java` / `dotnet` /
   `iru-database` — none covers AsciiDoc — so **no task carries a language/framework tag**, matching every prior
   documentation plan in `.archive/` (`_55`, `_57`, `_59`, `_61`, `_63`, `_65`).
4. **Closest precedent: `.archive/implementation_plan_65.md`** (issue #65). This plan copies its shape: author
   in house style (`==`/`===` sections → `[source,java]` `----` blocks → `[mermaid]` `....` → cross-links with
   explicit link text), edit related pages, verify via the `iru-gate-runner` agent running the Antora build.
5. **The issue body is raw material, not copy.** Issue #67 carries a research draft with a *"needs a
   correctness pass before it becomes page copy"* note and 10 reference URLs. Task 1 verifies the load-bearing
   claims against those primary sources (Reactor reference guide, the Spring "Reactive Transactions with
   Spring" blog, the Spring Framework programmatic-transaction reference) before writing, and rewrites in house
   voice rather than pasting the bulleted draft.
6. **Boundary with the freshly-merged `transaction-isolation-and-locking.adoc` (#65).** That page is about
   *isolation levels and pessimistic vs. optimistic locking*; this section is about *transaction-context
   propagation through the reactive chain*. The new section states that boundary explicitly and `xref`s that
   page for the per-store `PlatformTransactionManager` / isolation detail rather than restating it.
7. **Out of scope:** no change to `partial$springboot-disclaimer.adoc`; no cheat-sheet page; no new SVG image;
   no `nav.adoc` change; no new page; no changes to the reactive Couchbase/MongoDB/Neo4j pages (the issue only
   names `spring-data-overview.adoc` and `spring-data-jpa.adoc`).

## Current code state

- **`modules/ROOT/pages/backend/springboot/reactive-programming.adoc`** — 315 lines, house style
  (`= Reactive Programming with Project Reactor` → `:description:` line **2** → `:keywords:` line **3** →
  `include::partial$springboot-disclaimer.adoc[]` line 5 → `==` sections → closing `== Further learning`
  line **308**). Section map:
  - `== Mono and Flux` (12), `== Assembly vs. subscription` (38), `== Core operators` (73) with
    `=== map and flatMap` (75) / `=== zip` (99) / `=== merge and concat` (113), `== Backpressure` (130),
  - **`== Schedulers and context` (165)** — ends line **197**. Already contains: the four `Schedulers`
    factories, `publishOn` vs. `subscribeOn`, the sentence *"**Never block inside a `parallel()` or event-loop
    thread** -- wrap unavoidable blocking calls in `boundedElastic()`"* (lines 183–185), and the
    `Context` / `deferContextual` / `contextWrite` explanation (188–197). The two new sections extend this
    directly.
  - `== Error handling` (**199**), `== Testing reactive streams with StepVerifier` (226),
    `== How WebFlux, R2DBC, and reactive Spring Data build on Reactor` (**266**) — its closing paragraph
    (303–306) is the natural spot for a one-line forward reference, `== Further learning` (308).
  - No `[mermaid]` block anywhere in the file today.
- **`modules/ROOT/pages/backend/springboot/spring-data-overview.adoc`** — `== `@Transactional`` is line
  **223**; lines **252–265** already discuss the `isolation` attribute and `xref` the
  `transaction-isolation-and-locking.adoc` page. `== Optimistic locking with `@Version`` is line 267. The
  reactive cross-link lands at the end of this section (after line ~265, before line 267). `:keywords:` line 3
  has no reactive terms yet.
- **`modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc`** — `== Transactions, optimistic locking, and
  auditing` (**313**) → `=== @Transactional and propagation` (**315**); lines **357–366** already cover the
  `isolation` attribute and `xref` the isolation page. `=== `@Version` and optimistic locking` (368),
  `=== Pessimistic locking` (**429**), `=== Auditing…` (463). The "don't mix blocking `@Transactional` with a
  reactive chain" warning fits as a short paragraph at the end of `=== @Transactional and propagation` (before
  line 368).
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — `:description:` line **2** and `:keywords:` line
  **3** enumerate every sub-topic (already list "Project Reactor"). `=== Reactive programming` group is lines
  **122–125**, one bullet:
  `* xref:backend/springboot/reactive-programming.adoc[Reactive Programming] -- `Mono`/`Flux`, operators,
  backpressure, testing with `StepVerifier`, and a link to a hands-on Reactor workshop.`
  `== Bibliography` (line ~156+) has an `**Official documentation (primary source for every page)**` bulleted
  list of bare links; a Reactor-reference / Spring reactive-transactions entry belongs there. The
  `github.com/albertoirurueta/reactor-workshop` link is already present (~line 250).
- **`modules/ROOT/nav.adoc`** — SpringBoot block lines **433–466**; `reactive-programming.adoc` is line
  **458**. **Not modified** by this plan (no new page).
- **Cross-cutting `xref` targets that already exist:** `xref:backend/springboot/transaction-isolation-and-locking.adoc`
  (isolation / locking — #65), `xref:database/sql/transactions.adoc` (ACID theory).
- **Build / verification:** `npx antora antora-playbook.yml` (local content only) must complete with **no
  `xref`/AsciiDoc warnings**; `build/` is gitignored. `iru-build-docs` wraps this; the `iru-gate-runner` agent
  is installed (`.claude/agents/iru-gate-runner.md`). No `*-code-one-task` / test / coverage / quality gate
  applies — AsciiDoc authoring is implemented directly and the Antora build is the only gate.
- **`.archive/` precedent:** `implementation_plan_65.md` (new SpringBoot Reference page + related-page
  subsections + nav/index/bibliography wiring + `iru-gate-runner` Antora-build verification) — same shape,
  minus the `nav.adoc`/new-page parts which this plan omits. `_55` created `reactive-programming.adoc` itself
  (commit `da66b1c`).

## Implementation steps

### Group 1 — Author the two new sections in `reactive-programming.adoc` (Parallelizable: no — Task 2 and Task 3 edit the same file and Task 4 depends on the anchors both introduce)

- [x] **Task 1. Verify the load-bearing technical claims against the issue's primary sources.** No file
      changes — research only, to ground Tasks 2–3. `WebFetch` (or `WebSearch` where a fetch is blocked) the
      following and confirm each claim the sections will assert:
  - [x] Task 1.1. Reactor reference — *Threading and Schedulers*
        (`https://projectreactor.io/docs/core/release/reference/coreFeatures/schedulers.html`): confirm
        `block()`/`blockFirst()`/`blockLast()` throw `IllegalStateException` on `parallel()` and `single()`
        threads; confirm `boundedElastic` default sizing wording (cap = 10 × CPU cores, bounded queue) and its
        stated purpose (offload blocking I/O). Capture the exact exception message text to quote.
  - [x] Task 1.2. Spring blog — *Reactive Transactions with Spring* (2019-05-16)
        (`https://spring.io/blog/2019/05/16/reactive-transactions-with-spring/`): confirm `TransactionalOperator`
        usage (`.as(txOperator::transactional)` and `execute(status -> …)` callback style), that transaction
        resources ride the Reactor `Context`, and the *"Reactor `Context` is to reactive programming what
        `ThreadLocal` is to imperative programming"* framing. Confirm `@Transactional` on `Publisher`-returning
        methods requires a `ReactiveTransactionManager` bean.
  - [x] Task 1.3. Spring Framework reference — *Programmatic Transaction Management*
        (`https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html`):
        confirm the reactive `TransactionalOperator` API shape and the "no XA / no savepoints" limitation for
        reactive transactions on the current (Spring Framework 7.0.x) docs.
  - [x] Task 1.4. Skim, for accuracy of the deadlock explanation only: Apache **JAMES-3004**
        (`https://issues.apache.org/jira/browse/JAMES-3004`) and the Baeldung
        *IllegalStateException: block()…* article. Confirm BlockHound is `reactor-tools`' and installed via
        `BlockHound.install()`. Note any claim the issue draft makes that the sources do **not** support, and
        adjust the section wording in Tasks 2–3 accordingly (record the discrepancy in the Group 1 notes).
  - [x] Task 1.5. Verify against the repo: read `transaction-isolation-and-locking.adoc` in full to fix the
        exact boundary line ("that page covers X, this section covers Y") and pick the precise `xref` target
        text; re-read `reactive-programming.adoc` lines 165–225 so the new sections dovetail with the existing
        `Schedulers`/`Context` wording and don't repeat it.

- [x] **Task 2. Add `== Reactive transactions and thread affinity` to `reactive-programming.adoc`.** Insert as
      a new `==` section immediately after `== Schedulers and context` (after line 197) and before
      `== Error handling` (line 199). ~45–60 lines. Contents:
  - [x] Task 2.1. **Lead paragraph** — imperative Spring transactions are thread-bound
        (`JpaTransactionManager` / `DataSourceTransactionManager` bind the JDBC `Connection` to the thread via
        `ThreadLocal` / `TransactionSynchronizationManager`); reactive transactions
        (`ReactiveTransactionManager` — `R2dbcTransactionManager`, `ReactiveMongoTransactionManager`) instead
        put the transaction resources in the Reactor `Context`, which flows along **one** subscription. Reuse
        the `Context` concept from the section just above rather than re-explaining it. One sentence drawing
        the boundary with
        `xref:backend/springboot/transaction-isolation-and-locking.adoc[Transaction Isolation & Locking]`
        (isolation levels & pessimistic/optimistic locking) — "this section is about whether a statement is in
        the transaction at all".
  - [x] Task 2.2. **What detaches work from the transaction** — a short bullet list: an inner `.subscribe()`;
        a `Mono`/`Flux` fired from `doOnNext`/`doOnEach` for side effects; a `CompletableFuture` bridged in
        without `Mono.fromFuture`; `@Async`; a blocking-JDBC `@Transactional` proxy method that returns a
        `Mono` (the transaction commits when the method returns the *unsubscribed* publisher, before any data
        access runs). Each: one line on why, and that on rollback the detached write is **not** undone.
  - [x] Task 2.3. **Thread hop ≠ chain break** — call out explicitly that `publishOn` / `subscribeOn` /
        `parallel()` change the executing thread but keep the same `Context`, so a single correctly-built
        chain stays transactional across thread hops; the failure mode is leaving the chain. State that
        concurrent `flatMap` (default concurrency 256) runs its inner publishers over one single-threaded
        R2DBC connection, so inside a transaction prefer `concatMap` (or `flatMap(fn, 1)`) for predictable
        ordering.
  - [x] Task 2.4. **`[source,java]` — the correct pattern** — a two-write unit of work wrapped with
        `TransactionalOperator` (`chain.as(txOperator::transactional)`), rollback handled with `onErrorResume`
        *after* the transactional operator; a comment noting the `@Transactional`-on-`Publisher` +
        `ReactiveTransactionManager` bean alternative and the "no XA, no savepoints" limitation. Then a second
        short snippet showing the **broken** version — the second write fired via a bare `.subscribe()` inside
        `doOnNext` — with a one-line comment on why it leaks out of the transaction.
  - [x] Task 2.5. Ensure the generated section id will be `reactive-transactions-and-thread-affinity` (default
        AsciiDoc id from the title) so Task 5 / Task 6 can `xref` it; no explicit `[#id]` needed unless the
        build warns.

- [x] **Task 3. Add `== Bridging to blocking code safely` to `reactive-programming.adoc`.** Insert
      immediately after the Task 2 section, still before `== Error handling`. ~55–75 lines incl. the diagram.
      Contents:
  - [x] Task 3.1. **Lead paragraph** — extends the "never block in a `parallel()`/event-loop thread" note
        from `== Schedulers and context`: `block()`/`blockFirst()`/`blockLast()` on a `parallel()` or
        `single()` thread (and Netty event-loop threads) throw `IllegalStateException` — quote the exact
        message captured in Task 1.1 — and even where not forbidden (`boundedElastic`) blocking risks
        pool-starvation deadlock: a blocked task holds its thread while waiting on work that needs another
        thread from the same capped pool. Blocking an event-loop thread is worse (all I/O shares those few
        threads → immediate feedback deadlock).
  - [x] Task 3.2. **`[mermaid]` decision flow** (`[mermaid]` then `....` fenced block, per house style —
        cf. `spring-batch.adoc:42`). A `flowchart TD`:
        *Need a value from a `Mono`/`Flux`?* → *Can you compose (`flatMap`/`zip`/`expand`)?* → **yes:** do
        that, never `block()`. → **no, it's a legacy blocking library:** `Mono.fromCallable(...)` +
        `subscribeOn(Schedulers.boundedElastic())`. → *Must return synchronously across a non-reactive SPI
        boundary?* → offload onto a **dedicated** `Scheduler` (not the shared `boundedElastic`), `subscribeOn`
        it, `toFuture().get(timeout)`, and only ever from a worker thread — never an event-loop / `parallel()`
        thread. Keep node labels short; use `\n` for line breaks as in existing diagrams.
  - [x] Task 3.3. **Preferred alternatives, ordered** — bullet list: (1) compose instead of bridging;
        (2) `Mono.fromCallable(() -> legacyBlockingCall()).subscribeOn(Schedulers.boundedElastic())` for an
        unavoidable blocking client; (3) in tests use `StepVerifier`, not `block()` (cross-reference the
        existing `== Testing reactive streams with StepVerifier` section); (4) install **BlockHound**
        (`reactor-tools`, `BlockHound.install()` in a dev/test profile) to catch accidental blocking on
        non-blocking scheduler threads.
  - [x] Task 3.4. **`[source,java]` — the guarded last-resort pattern** — an adapter method that must return
        `T` synchronously: a `private final Scheduler bridgeScheduler = Schedulers.newBoundedElastic(...)`
        field (disposed on shutdown), `innerFlow.subscribeOn(bridgeScheduler).toFuture().get(timeout, unit)`
        with an explicit timeout, and a comment block spelling out each precaution: dedicated pool (not the
        shared one), never called from an event-loop / `parallel()` thread, treat pool exhaustion as
        backpressure (reject / 503) not unbounded growth, and that the reactive `Context` — including
        transaction context — does **not** cross the `toFuture()` boundary (re-attach with `contextWrite` if
        the inner flow needs it).
  - [x] Task 3.5. Section id will default to `bridging-to-blocking-code-safely`.

- [x] **Task 4. Update `reactive-programming.adoc` front matter and add one forward reference.**
  - [x] Task 4.1. Extend `:description:` (line 2) — append a clause on the two new topics (reactive
        transaction context / thread affinity, and safely bridging to blocking code). Keep it one sentence,
        matching the existing style.
  - [x] Task 4.2. Extend `:keywords:` (line 3) — add: `ReactiveTransactionManager`, `TransactionalOperator`,
        `R2dbcTransactionManager`, `reactive transactions`, `block()`, `blockFirst`, `IllegalStateException`,
        `boundedElastic`, `BlockHound`, `Schedulers.newBoundedElastic`, `toFuture`, `thread affinity`.
  - [x] Task 4.3. In the closing paragraph of `== How WebFlux, R2DBC, and reactive Spring Data build on
        Reactor` (lines 303–306), add one sentence pointing forward to the two new sections for the
        transaction-context and blocking-bridge caveats that apply once these pieces are combined in a real
        request path. Use explicit `xref`/internal-link text.

- _Group 1 notes (completed):_ **Three issue-draft claims were not supported by the primary sources and the
  wording was changed accordingly:**
  1. **"No XA / no savepoints" (Task 1.3).** The Spring Framework 7.0.9 *Programmatic Transaction Management*
     page states no such limitation for reactive transactions. It was dropped and replaced with the
     limitation the page *does* document: since Spring Framework 5.3 a cancel signal triggers a rollback, so a
     `Flux` inside a transaction must be consumed in full to commit.
  2. **"BlockHound is `reactor-tools`'" (Task 1.4).** False. BlockHound is a separate artifact,
     `io.projectreactor.tools:blockhound`; `reactor-tools` is a different artifact. The section says so
     explicitly, and notes BlockHound throws `BlockingOperationError` (an `Error`, not an exception).
  3. **"`@Transactional` on a `Publisher` method *requires* a `ReactiveTransactionManager` bean" (Task 1.2).**
     The blog does not word it as a hard requirement; it says the `Publisher` return type *routes to* reactive
     transaction management. Wording softened to "routes to ... which needs a `ReactiveTransactionManager`
     bean rather than a `PlatformTransactionManager`".
  - Confirmed as written: the `IllegalStateException` message text
    (`block()/blockFirst()/blockLast() are blocking, which is not supported in thread <name>`, verified across
    multiple independent reactor-core/WebFlux bug reports since the Reactor reference does not quote it);
    `boundedElastic` sizing (10 x CPU cores, 100 000-task queue, 60s idle TTL); the exact Spring quote
    *"Reactor `Context` is to reactive programming what `ThreadLocal` is to imperative programming"*; and the
    `TransactionalOperator.create(...)` / `.as(operator::transactional)` API shape.
  - Final size: `reactive-programming.adoc` grew 315 -> 493 lines (+178).
  - **Generated section ids as built: not the kebab-case defaults assumed.** This site does not set
    `idprefix`/`idseparator`, so Asciidoctor emitted `_reactive_transactions_and_thread_affinity` etc., and the
    `#fragment` cross-links were silently dead (Antora validates the page part of an `xref` but not the
    fragment, so the build stayed green). Fixed per Task 8.1 by adding explicit `[#...]` anchors above three
    headings -- the two new sections plus the pre-existing `== Testing reactive streams with StepVerifier`,
    which the new Task 3.3 bullet links to.

### Group 2 — Cross-link the two new sections from the Spring Data pages (Parallelizable: yes — Task 5 and Task 6 edit distinct files; both depend only on Group 1's sections/anchors existing)

- [x] **Task 5. `spring-data-overview.adoc` — add a reactive cross-link in `== `@Transactional``.** At the
      end of the `== `@Transactional`` section (after the isolation paragraph ending ~line 265, before
      `== Optimistic locking with `@Version`` line 267), add 2–3 sentences: with a `ReactiveTransactionManager`
      the transaction rides the Reactor `Context`, not a `ThreadLocal`, so the unit of work must stay in one
      reactive chain; point to
      `xref:backend/springboot/reactive-programming.adoc#reactive-transactions-and-thread-affinity[Reactive
      transactions and thread affinity]` (use the anchor id as built in Task 2.5; fall back to a plain
      `xref:backend/springboot/reactive-programming.adoc[Reactive Programming]` if the build flags the
      fragment). No new code block. Add `ReactiveTransactionManager` / `TransactionalOperator` to `:keywords:`
      (line 3).

- [x] **Task 6. `spring-data-jpa.adoc` — add the "don't mix blocking `@Transactional` with a reactive chain"
      warning.** At the end of `=== @Transactional and propagation` (after the isolation paragraph ending
      ~line 366, before `=== `@Version` and optimistic locking` line 368), add a short paragraph: `@Transactional`
      here is the **blocking** JPA variant — a proxied method that returns a `Mono`/`Flux` commits when it
      returns the unsubscribed publisher, before any data access runs, so JPA `@Transactional` and a reactive
      return type must not be combined; reactive transactions need a `ReactiveTransactionManager` and R2DBC/
      reactive Mongo, covered in
      `xref:backend/springboot/reactive-programming.adoc#reactive-transactions-and-thread-affinity[Reactive
      transactions and thread affinity]` (same anchor-fallback rule as Task 5). No new code block.

### Group 3 — Landing-page & bibliography wiring (Parallelizable: yes — single file, single task; depends on Group 1 for the described content)

- [x] **Task 7. `modules/ROOT/pages/backend/springboot/index.adoc` — reflect the expanded page.**
  - [x] Task 7.1. `=== Reactive programming` bullet (lines 124–125) — extend the description to mention the
        two new topics, e.g. append `…, plus the reactive-transaction `Context` model and safely bridging to
        blocking code`. One bullet, no new bullet added.
  - [x] Task 7.2. `:description:` (line 2) / `:keywords:` (line 3) — add "reactive transactions",
        "TransactionalOperator", "BlockHound" if not already implied; keep consistent with the page's existing
        enumeration style.
  - [x] Task 7.3. `== Bibliography` → `**Official documentation…**` list — add two bare links in the
        surrounding style: Spring Framework *Data Access → Transaction Management* reactive section
        (`https://docs.spring.io/spring-framework/reference/data-access/transaction/programmatic.html`) and the
        Reactor reference *Threading and Schedulers* page
        (`https://projectreactor.io/docs/core/release/reference/coreFeatures/schedulers.html`), each with a
        short "-- …" gloss. Skip any that already appear in the list (check first).

### Group 4 — Verify the Antora build (Parallelizable: yes — single task)

- [x] **Task 8. Build the docs site and confirm no warnings.** Delegate to the `iru-gate-runner` agent:
      `Agent({description: "Build Antora docs site", subagent_type: "iru-gate-runner", prompt: "Invoke
      Skill({skill: \"iru-build-docs\"}) (or run `npx antora antora-playbook.yml`) at the repository root.
      Report only: whether the build completed, and the full text of any AsciiDoc/xref warning or error --
      especially any unresolved `xref` into `reactive-programming.adoc` (including the
      `#reactive-transactions-and-thread-affinity` / `#bridging-to-blocking-code-safely` fragment anchors from
      `spring-data-overview.adoc` and `spring-data-jpa.adoc`), and any malformed `[mermaid]` / `[source,java]`
      block in the two new sections."}`
  - [x] Task 8.1. Fix any reported unresolved `xref`s (if a `#fragment` anchor doesn't resolve, either add an
        explicit `[#reactive-transactions-and-thread-affinity]` / `[#bridging-to-blocking-code-safely]` anchor
        above the respective `==` heading in `reactive-programming.adoc`, or drop the fragment from the two
        cross-links) and any malformed block; re-run until the build is clean (exit 0, no
        `class="xref unresolved"` in `build/site`).
  - [x] Task 8.2. Confirm `build/site/backend/springboot/reactive-programming.html` renders both new sections
        and the Mermaid diagram container is present.
  - _Done:_ `npx antora antora-playbook.yml` exit code **0**, **zero** lines of warning/error output, and
    `grep -c 'class="xref unresolved"' -r build/site` = **0** site-wide. Required two passes: the first build
    was green but revealed the snake_case-id problem above; after adding the explicit anchors, all three ids
    (`reactive-transactions-and-thread-affinity`, `bridging-to-blocking-code-safely`,
    `testing-reactive-streams-with-stepverifier`) are emitted exactly as referenced. Every in-page fragment
    link in `reactive-programming.html` resolves (15 fragments vs. 22 ids, empty set difference), and both
    `spring-data-overview.html` and `spring-data-jpa.html` link to
    `reactive-programming.html#reactive-transactions-and-thread-affinity`. Both new `<h2>` sections render and
    the Mermaid container (`<div class="mermaid ...">`, 1 occurrence) is present; 14 `[source,java]` blocks map
    1:1 to 14 rendered listing blocks.
