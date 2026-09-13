# Implementation Plan: Distributed ID Generation (SpringBoot Reference)

## Task summary

Source: GitHub issue #120
Base branch: main

Add one new page, `modules/ROOT/pages/backend/springboot/distributed-id-generation.adoc`, to the existing
**SpringBoot Reference** section (`modules/ROOT/pages/backend/springboot/`). The page explains why classic
database-native primary-key strategies (`IDENTITY`/`SEQUENCE`/`TABLE`) become a coordination bottleneck once
multiple app instances (microservices, a horizontally-scaled server farm) insert concurrently, introduces the
Snowflake bit-layout approach to generating roughly time-sortable, unique IDs locally on each node without a
per-ID database round-trip, briefly compares it against ULID/TSID/UUIDv7, and shows how to wire a
Snowflake-style generator into a Spring Boot application (a custom Hibernate `IdentifierGenerator`, or a plain
bean for non-JPA use), closing with links to the official primary sources and to the popular Java libraries
that implement this. Then wire the page into `nav.adoc`, the section landing page's `index.adoc`, and the
existing one-line Snowflake/TSID mention in `backend/hibernate/entities-and-identifiers.adoc`.

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **Content-only, untagged plan.** This repo has no application source code — every task is AsciiDoc authoring.
   `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns only `database`, `dotnet`,
   `java-springboot`, and `java` — none covers AsciiDoc — so no task carries a language/framework tag, matching
   every prior documentation plan in `.archive/`.
2. **Closest precedent:** `.archive/implementation_plan_123.md` (issue #123 — "Near-Far Caches", added one new
   page to this same `backend/springboot/` section). This plan follows its conventions directly: page header
   (`= Title` / `:description:` / `:keywords:` / disclaimer include), one primary figure per page (here, a
   `[mermaid]` `block-beta` diagram of the Snowflake ID bit layout — a structural/spatial layout, which is what
   this repo's SVG-vs-mermaid convention would normally reserve for hand-authored SVG, but Mermaid's `block-beta`
   diagram type renders labeled, proportioned blocks natively and needs no new image asset, so it's used here
   instead of an SVG), a closing `== References` section of official-source links only (third-party Java
   libraries are named in prose instead, exactly like near-far-caches.adoc's "Reference implementations"
   section), nav insertion immediately after a named sibling, and an `index.adoc` "What's covered" + bibliography
   update, verified with a delegated Antora build.
3. **Page length:** ~200–260 lines — one problem statement, one core concept, one comparison table, one
   framework-integration section, and a short library-choice section; narrower in scope than near-far-caches.adoc
   (261 lines, which covered three separate implementation options in depth).
4. **Section placement: "Architecture", not "Spring Data".** The topic is framed (per the issue) as a
   cross-service/deployment concern — avoiding coordination against a shared database across microservices/a
   server farm — not a single-store persistence feature, so it belongs alongside
   `xref:backend/springboot/architectural-patterns.adoc[Architectural Patterns]` (DDD, sagas, the transactional
   outbox — all cross-cutting distributed-systems concerns) rather than under the Spring Data heading. It is
   added as a **second bullet under the existing `=== Architecture` heading** in `index.adoc` (which today holds
   only the `architectural-patterns.adoc` bullet), the same way `near-far-caches.adoc` was added as a second
   bullet under the existing `=== Caching` heading rather than as a new heading of its own.
5. **Nav & index placement:** insert `distributed-id-generation.adoc` immediately **after**
   `architectural-patterns.adoc` in both `nav.adoc` (currently line 541) and `index.adoc`'s `=== Architecture`
   bullet list (currently lines 181–182) — right before the closing `=== Reference` / `cheat-sheet.adoc` entries
   in both files.
6. **Cross-link, don't duplicate, the existing `@GeneratedValue` coverage.** The `@GeneratedValue` strategies
   table in `backend/hibernate/entities-and-identifiers.adoc` (`IDENTITY`/`SEQUENCE`/`TABLE`/`UUID`, plus a
   "Custom" row already namechecking "a `TSID`/Snowflake-style generator") stays the owner of that table — the
   new page recaps the *problem* those strategies run into at scale in one short paragraph with an `xref:` back
   to that table, and does not re-explain `@GeneratedValue`/`@SequenceGenerator` mechanics. The existing "Custom"
   row's text gets a small edit (Task 5) to point at the new page for the full treatment, mirroring how
   `implementation_plan_69.md` (Hibernate Reference) turned an existing placeholder sentence into a real `xref:`
   once its target page existed.
7. **Primary figure:** a `[mermaid]` `block-beta` diagram laying out a 64-bit Snowflake ID as proportioned,
   labeled blocks (unused sign bit, 41-bit timestamp, datacenter ID, worker ID, 12-bit per-millisecond sequence)
   — this is what makes the "no per-ID coordination" property concrete, so it anchors `== The Snowflake
   approach`.
8. **Java libraries named in prose (not in `== References`), matching the near-far-caches.adoc convention of
   keeping `== References` official-source-only:**
   - `com.github.f4b6a3:tsid-creator` — dependency-free TSID (Time-Sortable ID) generation, the library most
     often pointed to for exactly this use case.
   - `com.baidu.fsg:uid-generator` — Baidu's open-source Snowflake-based generator with a Spring integration and
     a DB-backed worker-ID assigner used only once at startup (not per generated ID, so it doesn't reintroduce
     the per-request coordination problem).
   - Hutool's `Snowflake` utility class (`cn.hutool:hutool-core`) — a minimal, widely-used standalone
     implementation with no Spring integration of its own, offered as the "just the algorithm" option.
   - Exact current version numbers, package/class names, and any API details quoted in the page must be verified
     against each library's own README/Javadoc while writing — this plan fixes *which* libraries and *why*, not
     unverified version pins.
9. **`== References` (official/primary sources only):** Twitter Engineering's original Snowflake announcement
   (and its archived GitHub repository, since the project itself is retired/archived — note that explicitly
   rather than linking it as if actively maintained), Instagram Engineering's sharded-ID-generation post, the
   ULID specification, and IETF RFC 9562 (UUID Version 7). Discord's own Snowflake-ID blog post is used only if,
   while writing, it adds something the Twitter/Instagram sources don't already cover (worker-ID/epoch framing) —
   otherwise omitted rather than padding the list.

## Current code state

- **Section directory:** `modules/ROOT/pages/backend/springboot/` — AsciiDoc pages all following one house
  style: `= Title`, `:description:`/`:keywords:` attribute lines, `include::partial$springboot-disclaimer.adoc[]`,
  `==`/`===` sections, fenced code as `[source,java]`/`[source,yaml]`/`[source,xml]` with `----` delimiters,
  diagrams as `[mermaid]` + `....`-delimited blocks, pages ending in `== References`.
- **`modules/ROOT/pages/backend/springboot/architectural-patterns.adoc`** — the current last content page before
  the section's cheat sheet; covers SOLID, hexagonal architecture, DDD vocabulary, transactional outbox,
  listen-to-yourself, and sagas. No changes needed to this file; it's only the nav/index sibling the new page is
  inserted after.
- **`modules/ROOT/pages/backend/hibernate/entities-and-identifiers.adoc`** (lines 47–76) — the `@GeneratedValue`
  strategies table: `IDENTITY` (line 53), `SEQUENCE` (58), `TABLE` (64), `UUID` (68), and a "Custom" row (lines
  73–75):
  > Implement the SPI directly (e.g. a `TSID`/Snowflake-style generator) and reference it via
  > `@GenericGenerator`.

  This is the row to edit in Task 5.
- **`modules/ROOT/nav.adoc`** — the SpringBoot Reference block runs lines 505–542; confirmed current lines:
  ```
  541: **** xref:backend/springboot/architectural-patterns.adoc[Architectural Patterns]
  542: **** xref:backend/springboot/cheat-sheet.adoc[Cheat Sheet (PDF)]
  ```
  Entries are `**** xref:backend/springboot/<file>[Label]`.
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — the section landing page: `:description:` (line 2)
  and `:keywords:` (line 3) enumerate every sub-topic; `== What's covered` is grouped by topic, with
  `=== Architecture` at lines 179–183 holding one bullet for `architectural-patterns.adoc`:
  ```
  179: === Architecture
  180:
  181: * xref:backend/springboot/architectural-patterns.adoc[Architectural Patterns] -- SOLID, hexagonal (ports &
  182:   adapters) architecture, core DDD vocabulary, the transactional outbox pattern, listen-to-yourself, and sagas.
  183:
  184: === Reference
  ```
  `== Bibliography` starts at line 189, grouped into bullet clusters of related official-doc links; the most
  recent Spring Security/Authorization Server entries end around line 333, immediately before the "Local books"
  heading (line 335) — the new bibliography bullet cluster is added there.
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — the shared `[IMPORTANT]` admonition included at the
  top of every section page; no change needed.
- **Build/verification:** `npx antora antora-playbook.yml` (local content only) must complete with no
  `xref`/AsciiDoc errors; `build/` is gitignored. The `iru-build-docs` skill wraps this; the `iru-gate-runner` agent
  is installed at `.claude/agents/iru-gate-runner.md`.
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly (see Choice 1).

## Implementation steps

### Group 1 — Author the new page (Parallelizable: yes — single task)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/distributed-id-generation.adoc`** — new page,
      259 lines; primary figure is a `[mermaid]` `block-beta` diagram of the 64-bit Snowflake ID layout;
      cross-links to `backend/hibernate/entities-and-identifiers.adoc`'s `@GeneratedValue` table (for the
      `IDENTITY`/`SEQUENCE`/`TABLE`/`UUID` recap) instead of re-explaining it; docs-only. No test
      suite/coverage/quality tool applies to AsciiDoc; balanced delimiters (4 `----` pairs, 1 `....` mermaid
      pair, 1 `|===` table pair) and valid `xref:` targets verified manually — full Antora build verification is
      Group 3/Task 6.
  - [x] Task 1.1. Header: `= Distributed ID Generation`, `:description:` (one-line summary covering the
        coordination problem, Snowflake, ULID/TSID/UUIDv7, and Spring Boot wiring), `:keywords:` (Snowflake ID,
        distributed ID generation, TSID, ULID, UUIDv7, worker ID, datacenter ID, clock drift, IdentifierGenerator,
        tsid-creator, uid-generator), `include::partial$springboot-disclaimer.adoc[]`.
  - [x] Task 1.2. `== The coordination problem` — one to two short paragraphs: why `GenerationType.IDENTITY`/
        `SEQUENCE`/`TABLE` (recap via `xref:backend/hibernate/entities-and-identifiers.adoc[Entities and
        Identifiers]`) each depend on a single database owning the next value, becoming a contention point once
        several app instances (microservices, a scaled-out server farm) insert concurrently; note that a random
        `UUID` (also in that table) removes the bottleneck but sacrifices sortability and index locality —
        setting up "what if we want unique *and* sequential *and* no coordination?".
  - [x] Task 1.3. `== The Snowflake approach` — explain Twitter's original design: a 64-bit signed long packed
        from an unused sign bit, a ~41-bit millisecond timestamp relative to a custom epoch, datacenter-ID and
        worker-ID bits, and a 12-bit per-millisecond sequence counter — generated entirely locally on each node
        (only the worker/datacenter ID is assigned once, not looked up per ID), yielding IDs that are unique
        without cross-node locking and roughly time-ordered/sortable because the timestamp is the high-order
        bits. Include the `[mermaid]` `block-beta` bit-layout diagram as the primary figure.
  - [x] Task 1.4. `== Trade-offs and operational concerns` — clock drift/NTP sensitivity and what a generator
        must do if the system clock moves backwards (block and wait, or reject); how a Spring Boot deployment
        assigns each instance a distinct worker/datacenter ID (static per-instance config/profile, a Kubernetes
        `StatefulSet` pod's ordinal parsed from `HOSTNAME`, or startup-only coordination via a shared store); and
        the finite lifespan of a fixed-width timestamp field before it wraps.
  - [x] Task 1.5. `== Related schemes` — a comparison table (`[cols=...]`) with rows for DB
        `IDENTITY`/`SEQUENCE`, random `UUID` (v4), Snowflake, ULID, TSID, and UUIDv7, and columns for: requires
        DB coordination?, time-sortable?, size, and standardization status (e.g. UUIDv7 is IETF RFC 9562; ULID is
        a community spec; Snowflake/TSID are conventions, not standards).
  - [x] Task 1.6. `== Using it from Spring Boot` — two integration sketches:
        (a) a custom `org.hibernate.id.IdentifierGenerator` wrapping a Snowflake/TSID generator bean, referenced
        via `@GenericGenerator` on an entity's `@Id` — the concrete realization of the "Custom" row already
        named in `entities-and-identifiers.adoc`;
        (b) a plain `@Component`/`@Service` bean (constructed from a `@ConfigurationProperties`-bound worker ID)
        for non-JPA use — document-store keys, message/event IDs — where there's no `@GeneratedValue` to hook
        into.
  - [x] Task 1.7. `== Choosing a Java library` — short prose paragraphs (not a `== References`-style bare link
        list) introducing `com.github.f4b6a3:tsid-creator`, `com.baidu.fsg:uid-generator`, and Hutool's
        `Snowflake` utility (`cn.hutool:hutool-core`), each with one or two sentences on what it provides and its
        one distinguishing trade-off (dependency-free vs. Spring-integrated-with-a-startup-only-DB-assigner vs.
        minimal-standalone-utility), each name inline-linked to its project page/README.
  - [x] Task 1.8. `== References` — official/primary sources only, per Choice 9 above: Twitter Engineering's
        original Snowflake announcement (noting the project itself is now archived/retired), Instagram
        Engineering's sharded-ID-generation post, the ULID specification, and IETF RFC 9562 (UUIDv7) — plus
        Discord's Snowflake blog post only if it adds genuinely new framing while writing.

### Group 2 — Wire the new page in (Parallelizable: yes — `nav.adoc`, `index.adoc`, and `entities-and-identifiers.adoc` are three different files; all require Group 1 complete so `xref`s resolve)

- [x] **Task 2. Add the nav entry in `modules/ROOT/nav.adoc`** — inserted
      `**** xref:backend/springboot/distributed-id-generation.adoc[Distributed ID Generation]` immediately after
      the `**** xref:backend/springboot/architectural-patterns.adoc[Architectural Patterns]` line (now line 541),
      before the `cheat-sheet.adoc` entry (now line 543), at the same `****` depth. Docs-only; no test/coverage/
      quality tool applies.
- [x] **Task 3. Update `modules/ROOT/pages/backend/springboot/index.adoc` "What's covered"**
  - [x] Task 3.1. Added a second bullet under the existing `=== Architecture` heading (now lines 179–186),
        immediately after the `architectural-patterns.adoc` bullet, cross-linking
        `xref:backend/springboot/distributed-id-generation.adoc[Distributed ID Generation]` with a one-line
        summary (the coordination problem, the Snowflake bit layout, ULID/TSID/UUIDv7, and Spring Boot wiring).
  - [x] Task 3.2. Extended `:description:` (line 2) with a clause covering distributed ID generation/Snowflake
        IDs, and `:keywords:` (line 3) with `Snowflake ID, distributed ID generation, TSID, ULID, UUIDv7, worker
        ID`, matching the existing comma-separated style.
- [x] **Task 4. Add a bibliography entry in `modules/ROOT/pages/backend/springboot/index.adoc`** — added one new
      bullet cluster in `== Bibliography` (now lines 338–346), after the Spring Authorization Server entries and
      before the "Local books" heading, citing the same four official sources as the new page's `== References`
      (Task 1.8): Twitter Engineering's Snowflake announcement (archived), Instagram Engineering's sharded-ID
      post, the ULID specification, and IETF RFC 9562 — URLs cross-checked directly against
      `distributed-id-generation.adoc`'s `== References` section and match exactly.
- [x] **Task 5. Edit the "Custom" row in `modules/ROOT/pages/backend/hibernate/entities-and-identifiers.adoc`**
      (lines 73–75) — replaced the parenthetical example with an `xref:` to the new page: "Implement the SPI
      directly (see `xref:backend/springboot/distributed-id-generation.adoc[Distributed ID Generation]` for a
      `TSID`/Snowflake-style example) and reference it via `@GenericGenerator`." Row's existing meaning preserved.

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1–2 complete)

- [x] **Task 6. Verify the Antora build is clean** — delegated to the `iru-gate-runner` agent, which ran
      `Skill({skill: "iru-build-docs"})`; `npx antora antora-playbook.yml` completed with empty stdout/stderr (no
      warnings or errors at all), and `backend/springboot/distributed-id-generation.adoc`,
      `backend/springboot/index.adoc`, `nav.adoc`, and `backend/hibernate/entities-and-identifiers.adoc` all
      rendered cleanly into `build/site`.
  - [x] Task 6.1. Confirmed no unresolved `xref`, missing image, or AsciiDoc error was reported; no fix/re-run
        needed.
  - [x] Task 6.2. Confirmed `distributed-id-generation.adoc` is 259 lines (within the ~200–260 target) and that
        `== References` (lines 251–259) holds only the four official sources (archived Twitter Snowflake
        announcement + archived `twitter-archive/snowflake` repo, Instagram Engineering, ULID spec, IETF RFC
        9562), while `tsid-creator`, `uid-generator`, and Hutool `Snowflake` remain in prose under `== Choosing a
        Library` (lines 233–249), not in `== References`.
