# Implementation Plan: Concurrency Alternatives to Reactive Programming (SpringBoot Reference)

## Task summary

Source: GitHub issue #95

Add a new page to the **SpringBoot Reference** section, `modules/ROOT/pages/backend/springboot/concurrency-alternatives.adoc`,
that lays out three concurrency models for a Spring Boot backend side by side -- **Project Reactor**, **Java
Virtual Threads**, and **Kotlin Coroutines** -- each with its execution model, pros/cons, a code example, and
(critically) its own transaction-management story analogous to the existing
xref:backend/springboot/reactive-programming.adoc[Reactive Programming] page's "Reactive transactions and thread
affinity" section:

* **Virtual Threads**: `ThreadLocal`-based transaction management keeps working unchanged (one virtual thread per
  request, no thread-pool reuse), with operational pitfalls (`ThreadLocal` cleanup, `InheritableThreadLocal`
  semantics, pinning) called out.
* **Coroutines**: `@Transactional` on a `suspend` function needs a `ReactiveTransactionManager`, the working
  pattern is `TransactionalOperator.executeAndAwait`, and there's a known coroutine-context-loss pitfall across
  suspension points (spring-projects/spring-framework#28290).

It must also document mixed Java+Kotlin Spring Boot project setup for both Maven (`kotlin-maven-plugin` ordering,
`kotlin-spring`/`kotlin-jpa` compiler plugins, dependencies) and Gradle (Kotlin DSL plugins/dependencies), link out
to this repo's existing language-fundamentals pages instead of re-explaining them, and add a short comparison note
that other languages (JavaScript, Python, C#) have their own native `async`/`await`.

**Choices made on the user's behalf (no ambiguity worth blocking on):**

* **File name / title**: `concurrency-alternatives.adoc` (the issue's own suggested name), page title "Concurrency
  Alternatives to Reactive Programming", nav label "Concurrency Alternatives" -- mirrors the existing pattern
  where the nav label ("Reactive Programming") is shorter than the full page title ("Reactive Programming with
  Project Reactor").
* **Nav placement**: immediately after `reactive-programming.adoc`, before `lombok-and-mapstruct.adoc`, per the
  issue's own suggestion.
* **One-way linking to language-fundamentals pages**: the new page links out to
  `programming-languages/java/virtual-threads.adoc`, the three Kotlin coroutines pages, and the JS/Python/TS
  pages, but those pages themselves are **not** edited to link back -- the issue's acceptance criteria only
  requires the two-way link with `reactive-programming.adoc` specifically, and touching five unrelated
  language-fundamentals pages would be scope creep beyond what was asked.
* **`== Choosing a Model` summary table**: added even though not literally listed in the acceptance criteria,
  because the issue's own stated motivation is "backend teams choosing a concurrency model... need a page that
  lays out all three options side by side" -- a compact side-by-side table directly serves that stated purpose.
* **C# follow-up issue**: the issue says a dedicated internal C# `async`/`await` page is "worth a separate
  follow-up issue rather than folding it into this one's scope" but does not make filing that issue part of
  *this* ticket's acceptance criteria. This plan documents the gap (linking to Microsoft's docs) but does not
  file a new GitHub issue automatically -- left as a suggestion for the user to file themselves if they want it,
  consistent with `iru-code`'s own end-of-run prompt about opening follow-up tickets.
* **`backend/index.adoc` blurb update**: included as an optional, light task (Task 5 below) mirroring how the
  prior Spring Security addition (`.archive/implementation_plan_63.md`, its own Task 5) folded a one-line mention
  into the top-level Backend Development landing page's SpringBoot Reference blurb.
* **No `*-code-one-task` skill applies** -- this repository has no application source code (per `CLAUDE.md`, it
  is the Antora playbook/root component), so every task here is AsciiDoc authoring implemented directly, same as
  the precedent plans for this section (e.g. `.archive/implementation_plan_63.md`).

## Current code state

* This repo is the Antora playbook + root (`irurueta`) component; page content lives under
  `modules/ROOT/pages/`, nav is `modules/ROOT/nav.adoc`.
* `modules/ROOT/pages/backend/springboot/reactive-programming.adoc` (488 lines) documents Project Reactor:
  `Mono`/`Flux`, assembly vs. subscription, operators, backpressure, schedulers/context, and -- at
  **`== Reactive transactions and thread affinity`** (line 200-284) -- how classic `PlatformTransactionManager`/
  `JpaTransactionManager`/`DataSourceTransactionManager` bind the JDBC connection to the calling thread via
  `TransactionSynchronizationManager`'s `ThreadLocal`, while `ReactiveTransactionManager` implementations
  (`R2dbcTransactionManager`, etc.) instead bind transactional resources to the Reactor `Context`, with a
  working/broken `TransactionalOperator`-based code pair illustrating how a nested `.subscribe()` breaks the
  chain and escapes the transaction. The page ends with `== Further learning` (line 482-488), pointing to an
  external Reactor workshop and the official reference docs -- the natural place to add a forward cross-link to
  the new page.
* `modules/ROOT/pages/backend/springboot/java-or-kotlin.adoc` already has a "Concurrency model" row in its
  pros/cons table contrasting virtual threads (`xref:programming-languages/java/virtual-threads.adoc`) vs.
  coroutines (`xref:programming-languages/kotlin/coroutines-basics.adoc`), and a Gradle Kotlin DSL example for a
  Kotlin-only (not mixed Java+Kotlin) Spring Boot project with the `kotlin-spring`/`kotlin-jpa` plugins -- the
  new page should stay consistent with this framing and cross-link to it rather than repeating the language
  comparison, per the issue.
* `modules/ROOT/pages/backend/springboot/index.adoc` (385 lines) is the section landing page: `== What's covered`
  (line 19) has one `===` subsection per page/topic group, in the same order as `nav.adoc`, ending with
  `=== Reactive programming` (line 133-137, one bullet) then `=== Developer productivity tools` (line 139); then
  `== Bibliography` (line 173) has an "Official documentation" list and other sourced-material lists.
* `modules/ROOT/pages/backend/index.adoc` is the top-level "Backend Development" landing page (one level above
  `backend/springboot/`), whose `:description:`, `:keywords:`, and `== Sections` blurb enumerate SpringBoot
  Reference's topics in one dense sentence.
* `modules/ROOT/nav.adoc` line 527 is `**** xref:backend/springboot/reactive-programming.adoc[Reactive
  Programming]`, immediately followed by line 528 `**** xref:backend/springboot/lombok-and-mapstruct.adoc[Lombok
  & MapStruct]`.
* All pages the new content must link out to already exist and were verified present:
  `programming-languages/java/virtual-threads.adoc`, `programming-languages/kotlin/coroutines-basics.adoc`,
  `.../flows.adoc`, `.../coroutine-context-cancellation-and-exceptions.adoc`,
  `programming-languages/javascript/async-javascript.adoc`, `programming-languages/python/concurrency-and-async.adoc`,
  `programming-languages/typescript/async-and-iterators.adoc`, `backend/springboot/java-or-kotlin.adoc`. No
  dangling `xref`s expected.
* House page structure (confirmed across `reactive-programming.adoc`, `java-or-kotlin.adoc`, and precedent plans):
  `= Title` -> `:description:` -> `:keywords:` -> `include::partial$springboot-disclaimer.adoc[]` -> intro
  paragraph -> `==` sections with `[source,java]`/`[source,kotlin]` code blocks (fenced with `----`) -> a closing
  `== References` (or, on this page, a house-style list of official docs).
* **Build / verification**: `npx antora antora-playbook.yml` (local content only, per `CLAUDE.md`) must complete
  with no new `xref`/AsciiDoc warnings or errors; `build/` is gitignored. The `iru-build-docs` skill wraps this
  build, and the `iru-gate-runner` agent is installed (`.claude/agents/`) for running it out of the main context.

## Implementation steps

### Group 1 — Author the new page (Parallelizable: yes — single new file, no shared file)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/concurrency-alternatives.adoc`** -- new 400-line
      AsciiDoc page (Reactor recap, Virtual Threads + ThreadLocal transactions, Kotlin Coroutines + reactive
      transactions, mixed Java+Kotlin Maven/Gradle setup, async/await-in-other-languages, Choosing a Model
      table, References); all `xref:` targets verified to exist beforehand, all `References` URLs verified with
      `curl` (HTTP 200), no unescaped `{...}` literals outside source/code spans. Docs-only repo -- no
      tests/coverage/code-quality tooling applies (per `CLAUDE.md`); Antora build verification is Group 3's job.
  - [x] Task 1.1. Header: `= Concurrency Alternatives to Reactive Programming`; `:description:` (a Spring Boot
        backend's three concurrency models side by side -- Project Reactor, Java Virtual Threads, and Kotlin
        Coroutines -- their execution models, pros/cons, code examples, and how each handles transaction
        management; plus mixed Java+Kotlin Maven/Gradle setup); `:keywords:` (`Project Reactor, virtual threads,
        Project Loom, JEP 444, Kotlin coroutines, suspend function, TransactionSynchronizationManager,
        ThreadLocal, PlatformTransactionManager, ReactiveTransactionManager, TransactionalOperator,
        executeAndAwait, InheritableThreadLocal, carrier thread pinning, kotlin-maven-plugin, kotlin-spring,
        kotlin-jpa, kotlin-stdlib, kotlin-reflect, jackson-module-kotlin, Xjsr305, async/await, spring.threads.virtual.enabled`);
        then `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. Intro paragraph: frame the page as a side-by-side comparison for teams choosing a concurrency
        model for a new (or migrating) Spring Boot service; one sentence recapping that
        xref:backend/springboot/reactive-programming.adoc[Reactive Programming] already covers Project Reactor
        in depth, so this page recaps it only briefly before focusing on the two newer alternatives.
  - [x] Task 1.3. `== Project Reactor (Recap)` -- 1-2 short paragraphs recapping the execution model
        (non-blocking, operator-composed `Mono`/`Flux` pipelines) with an `xref:backend/springboot/reactive-programming.adoc[]`
        pointer for the full explanation (do not duplicate the assembly/subscription/backpressure material); a
        pros/cons list (pros: no thread-per-request memory cost even before virtual threads existed, mature
        backpressure, composability; cons: steep learning curve, stack traces, debugging difficulty, viral --
        one blocking call anywhere in the chain breaks it); one short `[source,java]` WebFlux controller example
        (can reuse/adapt the existing `OrderController` example style from `reactive-programming.adoc`).
  - [x] Task 1.4. `== Java Virtual Threads` -- execution model: 1-2 paragraphs recapping virtual threads
        (JVM-scheduled, cheap, one thread per request) with `xref:programming-languages/java/virtual-threads.adoc[]`
        for the full mounting/unmounting/pinning explanation (do not duplicate); explain how Spring Boot 4.1.x
        opts a whole application into virtual threads (`spring.threads.virtual.enabled=true`, swapping the
        embedded server's request-handling executor to a virtual-thread-per-task executor) -- verify this
        property name/mechanism against `docs.spring.io/spring-boot/reference` while authoring; pros/cons list
        (pros: existing blocking-style code/libraries/stack traces/debuggers keep working unchanged, no reactive
        rewrite, JDBC drivers work as-is; cons: `synchronized` blocks and other pinning causes still cost a
        platform-thread carrier, not every blocking library or native call is virtual-thread-friendly yet); one
        short `[source,java]` example of an ordinary blocking `@RestController` method plus the
        `application.properties`/`.yml` line that enables virtual threads.
  - [x] Task 1.5. `== Virtual Thread Transactions and ThreadLocal Affinity` (transaction-management subsection
        for Virtual Threads) -- explain that classic `ThreadLocal`-based transaction management
        (`TransactionSynchronizationManager`, `PlatformTransactionManager`/`JpaTransactionManager`) keeps working
        **unchanged** under virtual threads, and *why*: each request gets its own fresh virtual thread (created,
        not pooled/reused the way platform worker threads are), so the `ThreadLocal` set by the transaction
        interceptor at the start of the method is never seen by an unrelated request the way it could be if a
        `ThreadLocal` were accidentally left set on a reused pooled thread. Cover the stated operational
        pitfalls with concrete detail: (a) `ThreadLocal` cleanup on cancellation/timeout -- if a request is
        cancelled/times out, whatever cleans up the transaction (the interceptor's `finally`) must still run for
        the `ThreadLocal` to be cleared, since the virtual thread itself isn't pooled but any *platform* thread
        pool code paths still are; (b) `InheritableThreadLocal` -- explain the actual difference from pooled
        platform threads: a pooled worker thread is created once and inherits from whoever created the pool, so
        per-request `InheritableThreadLocal` values set by the submitting thread do **not** reach it, whereas a
        *fresh* virtual thread created per task *does* copy `InheritableThreadLocal` values from its creator at
        creation time -- call out that this is a behavioral difference worth knowing, not assume it is a strict
        downgrade either way; (c) pinning caveats -- a `synchronized` block anywhere in the transactional call
        path (a legacy DAO, a JDBC driver internal, a third-party library) pins the virtual thread to its
        carrier for that block's duration, same general mechanism as
        `xref:programming-languages/java/virtual-threads.adoc[]`'s "Carrier Threads, Mounting, and Pinning"
        section, but specifically relevant here because it can serialize concurrent transactional work onto a
        small pool of carrier threads under load. Include one short `[source,java]` example showing a
        `@Transactional` blocking-style service method working unchanged with virtual threads enabled.
  - [x] Task 1.6. `== Kotlin Coroutines` -- execution model: 1-2 paragraphs recapping `suspend` functions and
        structured concurrency with `xref:programming-languages/kotlin/coroutines-basics.adoc[]`,
        `xref:programming-languages/kotlin/flows.adoc[]`, and
        `xref:programming-languages/kotlin/coroutine-context-cancellation-and-exceptions.adoc[]` for the full
        explanation (do not duplicate); explain that Spring MVC and WebFlux controllers can both declare
        `suspend fun` handlers directly (per `java-or-kotlin.adoc`'s existing mention) -- and that under
        WebFlux, coroutines bridge to Reactor via `kotlinx-coroutines-reactor`; pros/cons list (pros: sequential-
        looking code without the reactive operator vocabulary, structured concurrency and cancellation built in,
        interop with `Flow` for streaming; cons: needs Kotlin (mixed-language setup cost, see Task 1.8/1.9),
        context-propagation pitfalls bridging to/from Reactor's `Context` -- see Task 1.7, smaller
        talent pool than Java); one short `[source,kotlin]` example of a `suspend fun` REST controller method.
  - [x] Task 1.7. `== Coroutine Transactions and Reactive Transaction Management` (transaction-management
        subsection for Coroutines) -- explain that `@Transactional` on a `suspend` function routes through
        Spring's **reactive** transaction management (needs a `ReactiveTransactionManager` bean, e.g.
        `R2dbcTransactionManager`), *not* the classic thread-bound `PlatformTransactionManager` -- because a
        `suspend` function may resume on a different thread after suspension, so there is no single calling
        thread to bind a `ThreadLocal` to. Show the working declarative/programmatic pattern with a
        `[source,kotlin]` example using `TransactionalOperator.executeAndAwait` for a suspending function (per
        the Spring Framework Coroutines reference docs). Call out the known pitfall, with a broken/working code
        pair in the same style as `reactive-programming.adoc`'s transaction section: naive `@Transactional` +
        `suspend` combinations can lose the transaction/coroutine context across a suspension point (link
        https://github.com/spring-projects/spring-framework/issues/28290[spring-projects/spring-framework#28290]
        as the known issue), and the fix is to keep the transactional unit of work inside one
        `executeAndAwait { ... }` block rather than spanning suspension points with ambient `@Transactional`
        state assumed to persist.
  - [x] Task 1.8. `== Mixed Java + Kotlin Spring Boot Projects` intro paragraph (a real coroutines adoption is
        usually a mixed-language codebase, not a Kotlin-only rewrite) then `=== Maven` subsection: explain
        `kotlin-maven-plugin` must run *before* `maven-compiler-plugin` (bind its `compile`/`test-compile`
        executions to the same phases as the Java compiler but list the plugin earlier in `<plugins>`, or use
        the documented `<executions>` phase ordering) so Kotlin compiles first and Java code can reference
        Kotlin classes and vice versa; `<sourceDirs>` covering both `src/main/kotlin` and `src/main/java`; the
        `kotlin-spring` and `kotlin-jpa` compiler plugins configured via `kotlin-maven-plugin`'s
        `<compilerPlugins>`/`<pluginOptions>` (the `all-open`/`no-arg` presets, needed because Kotlin classes are
        `final` by default and Spring/JPA need to subclass `@Component`/`@Configuration`/`@Entity` classes); the
        `kotlin-maven-allopen`/`kotlin-maven-noarg` plugin artifact dependencies these presets require; the
        `-Xjsr305=strict` compiler arg for Kotlin null-safety interop with Spring's `@Nullable`; and the runtime
        dependencies `kotlin-stdlib` (or `kotlin-stdlib-jdk8`), `kotlin-reflect`, and `jackson-module-kotlin`.
        Provide one representative `[source,xml]` `pom.xml` snippet (`<build><plugins>` entry for
        `kotlin-maven-plugin` with the ordering/executions/compilerPlugins, plus the four dependency entries) --
        verify the exact element names/ordering against the official
        https://kotlinlang.org/docs/maven-configure-project.html[Kotlin Maven docs] while authoring.
  - [x] Task 1.9. `=== Gradle` subsection (still under `== Mixed Java + Kotlin Spring Boot Projects`): the
        `org.jetbrains.kotlin.jvm`, `org.jetbrains.kotlin.plugin.spring`, and (if Kotlin JPA entities are used)
        `org.jetbrains.kotlin.plugin.jpa` plugins alongside the standard `java`/`org.springframework.boot`/
        `io.spring.dependency-management` plugins; the `kotlin-reflect` and `jackson-module-kotlin` dependency
        entries; explain that Gradle's Kotlin and Java source sets (`src/main/kotlin`, `src/main/java`) compile
        via separate tasks wired automatically by the Kotlin Gradle plugin (`compileKotlin` runs before
        `compileJava` by default when both are present) so no explicit ordering like Maven's is needed. Provide
        one `[source,kotlin]` `build.gradle.kts` snippet with the plugins block and dependencies -- can adapt
        the existing plugins block already shown in `java-or-kotlin.adoc` (`kotlin("jvm")`,
        `kotlin("plugin.spring")`, `kotlin("plugin.jpa")`) plus the two added dependencies, styled consistently
        with that page.
  - [x] Task 1.10. `== `async`/`await` in Other Languages` -- one short paragraph noting that sequential-looking
        asynchronous code via native `async`/`await` syntax isn't unique to the JVM world, then a bullet list:
        JavaScript (`xref:programming-languages/javascript/async-javascript.adoc[]`), noting TypeScript's
        `xref:programming-languages/typescript/async-and-iterators.adoc[]` alongside it; Python
        (`xref:programming-languages/python/concurrency-and-async.adoc[]`); C# -- no dedicated internal
        fundamentals page exists yet (only scattered Task-based usage under `web/aspnet/**`, e.g.
        `xref:web/aspnet/core/http-client-and-resilience.adoc[]`), so link directly to
        https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/[Microsoft's official C#
        async/await documentation] and note this as a documentation gap that could be a separate follow-up
        issue (do not file one automatically -- see "Choices made" above).
  - [x] Task 1.11. `== Choosing a Model` -- a compact `[cols="1,3,3,3"]` comparison table (rows: Execution model /
        Transaction management / Best fit / Key risk; columns: Project Reactor, Virtual Threads, Kotlin
        Coroutines), summarizing the three sections above at a glance, plus 1-2 sentences of closing guidance
        (no strictly "best" choice -- Virtual Threads is the lowest-migration-cost option for existing blocking
        Java code, Reactor remains the right choice for genuinely streaming/backpressure-sensitive workloads or
        an already-reactive stack, Coroutines fits a team already writing Kotlin). Cross-link
        `xref:backend/springboot/java-or-kotlin.adoc[]` for the broader Java-vs-Kotlin decision (not just
        concurrency) instead of repeating that page's own pros/cons table.
  - [x] Task 1.12. `== References` -- house-style bullet list of official sources actually used while authoring
        (verify each URL resolves before including): Project Reactor reference, JEP 444, Kotlin Coroutines
        guide, Spring Framework -- Coroutines reference (documents `executeAndAwait`/reactive transaction
        support), the spring-framework#28290 issue, the foojay.io "Transactions and ThreadLocal in Spring"
        article, the Kotlin "Configure a Maven project" docs, the rieckpil.de and codecentric mixed-language
        articles, and the Microsoft Learn C# async/await docs.

### Group 2 — Wire the page into navigation, the landing page, and reactive-programming.adoc (Parallelizable: yes — `nav.adoc`, `backend/springboot/index.adoc`, `backend/springboot/reactive-programming.adoc`, and `backend/index.adoc` are four different files; all require Group 1 complete so new `xref`s resolve)

- [x] **Task 2. Add one nav entry in `modules/ROOT/nav.adoc`** -- inserted, confirmed one contiguous SpringBoot
      Reference block (lines 500-536) via `grep -n "backend/springboot" modules/ROOT/nav.adoc`.
  - [x] Task 2.1. Insert `**** xref:backend/springboot/concurrency-alternatives.adoc[Concurrency Alternatives]`
        immediately after line 527 (`**** xref:backend/springboot/reactive-programming.adoc[Reactive
        Programming]`) and before the `lombok-and-mapstruct.adoc` entry (which shifts down one line). Confirm
        afterward with `grep -n "backend/springboot" modules/ROOT/nav.adoc` that there is still exactly one
        contiguous SpringBoot Reference block.

- [x] **Task 3. Update `modules/ROOT/pages/backend/springboot/index.adoc`** -- new subsection, extended
      `:description:`/`:keywords:`, 4 genuinely-new bibliography URLs added (JEP 444, Kotlin Coroutines guide,
      Spring Framework Coroutines reference, Kotlin Maven config docs); the Project Reactor reference URL was
      already present; the spring-framework#28290 GitHub issue, the foojay.io blog post, and the Microsoft
      Learn C# docs were left page-local per house style (same precedent as the Reactor workshop link in
      `reactive-programming.adoc`'s "Further learning").
  - [x] Task 3.1. In `== What's covered`, add a new `=== Concurrency Alternatives` subsection immediately after
        the existing `=== Reactive programming` subsection (currently lines 133-137) and before
        `=== Developer productivity tools` (currently line 139), one bullet in the house one-line style:
        ```
        === Concurrency Alternatives

        * xref:backend/springboot/concurrency-alternatives.adoc[Concurrency Alternatives] -- Project Reactor,
          Java Virtual Threads, and Kotlin Coroutines side by side: execution model, pros/cons, code examples,
          how each handles transaction management, and setting up a mixed Java+Kotlin Maven/Gradle project.
        ```
  - [x] Task 3.2. Extend this page's own `:description:` (line 2) -- insert a short clause (e.g. "concurrency
        alternatives to reactive programming (virtual threads, Kotlin coroutines),") into the existing topic
        enumeration, near the existing "reactive programming (including reactive transactions..." clause.
  - [x] Task 3.3. Extend this page's own `:keywords:` (line 3) -- append `virtual threads, Kotlin coroutines,
        suspend function, TransactionalOperator, ReactiveTransactionManager` (skip any already present, e.g.
        `Project Reactor`/`Kotlin` are already listed). `TransactionalOperator`/`ReactiveTransactionManager`
        were already present, so only `virtual threads, Kotlin coroutines, suspend function` were appended.
  - [x] Task 3.4. In `== Bibliography` -> "Official documentation" list, add bullets for any of Task 1.12's
        sources not already covered there (check first -- the Project Reactor reference and the reactive-
        transactions blog post are likely already present per the existing Reactive Programming bibliography
        entries; add only genuinely new URLs, e.g. JEP 444, the Kotlin Coroutines guide, the Spring Framework
        Coroutines reference, and the Kotlin Maven config docs), matching the existing bullet style (URL, one-
        line description, which page it's the primary source for). Added exactly those 4 URLs; the Project
        Reactor reference was confirmed already present.
  - [x] Task 3.5. Cross-check: every URL in the new page's own `== References` either now appears in this
        Bibliography or is left only in the page's own References per house style (as `rest-apis.adoc` and the
        Security pages already do) -- add a genuinely missing *official* doc URL only. Confirmed: Project
        Reactor reference + the 4 newly-added URLs are in the Bibliography; the spring-framework#28290 GitHub
        issue, the foojay.io blog article, and the Microsoft Learn C# docs are left page-local (same house-style
        precedent as the Reactor workshop GitHub link in `reactive-programming.adoc`'s "Further learning").

- [x] **Task 4. Add the reverse cross-link in `modules/ROOT/pages/backend/springboot/reactive-programming.adoc`**
      -- added to `== Further learning`, existing workshop/reference-docs sentences kept intact.
  - [x] Task 4.1. In `== Further learning` (currently lines 482-488), add one sentence pointing to the new page,
        e.g.: "If Project Reactor isn't the right fit for a given service, see
        xref:backend/springboot/concurrency-alternatives.adoc[Concurrency Alternatives to Reactive Programming]
        for a side-by-side comparison with Java Virtual Threads and Kotlin Coroutines, including how transaction
        management differs under each." Keep the existing workshop/reference-docs sentences intact.

- [x] **Task 5. (Optional, light) Update `modules/ROOT/pages/backend/index.adoc`** -- topic clause added;
      keywords left unchanged since `virtual threads`/`Kotlin` were already present.
  - [x] Task 5.1. In the `xref:backend/springboot/index.adoc[SpringBoot Reference]` sentence under `== Sections`,
        add ", concurrency alternatives (virtual threads, Kotlin coroutines)" into the enumerated topic list
        (near the existing "reactive programming with Project Reactor" clause), mirroring how the prior Spring
        Security addition folded in a one-line mention (`.archive/implementation_plan_63.md` Task 5.1).
  - [x] Task 5.2. Add `virtual threads, Kotlin coroutines` to this page's `:keywords:` if not already implied by
        existing entries (`virtual threads` and `Kotlin` already appear -- check before adding duplicates).
        Confirmed both already present in `backend/index.adoc`'s `:keywords:` -- no change made (duplicate
        avoidance per the task's own instruction).

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1–2 complete)

- [x] **Task 6. Verify the Antora build is clean.**
  - [x] Task 6.1. Delegate to the `iru-gate-runner` agent:
        `Agent({description: "Build Antora docs and report warnings", subagent_type: "iru-gate-runner",
        prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repo's Antora site (npx antora
        antora-playbook.yml). Report only: whether the build completed, and any xref/AsciiDoc warnings or
        errors (file + message), especially any referencing concurrency-alternatives.adoc, reactive-programming.adoc,
        backend/springboot/index.adoc, backend/index.adoc, or nav.adoc."})`.
  - [x] Task 6.2. If any warning/error references the new or edited files, fix it directly (most likely causes:
        a mistyped `xref` target, an unescaped `{...}` literal in prose/code needing `\{...}` escaping per the
        precedent in `.archive/implementation_plan_63.md`'s Task 6, or a malformed table/source block) and
        re-run Task 6.1 until the build is clean.
  - [x] Task 6.3. Sanity-check the new page reads consistently with `reactive-programming.adoc` and
        `java-or-kotlin.adoc` in tone/structure, and that every acceptance criterion in GitHub issue #95 is
        covered (new page + nav wiring; all three models with execution model/pros-cons/code example; both
        transaction-management stories with examples; two-way cross-link with `reactive-programming.adoc`;
        Maven and Gradle mixed-project setup with the required dependencies and one snippet each; links to the
        existing Java/Kotlin language-fundamentals pages; the async/await-in-other-languages comparison note;
        clean Antora build).
