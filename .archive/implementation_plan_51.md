# Implementation Plan

## Task summary

Add a new multi-page guide, **"Evolving the Database Model"**, under *Guides & References → Database Development*,
documenting how to evolve a database schema/model safely and consistently using version-controlled migration
tools: **Liquibase** (relational/SQL), **Mongock** (MongoDB, Java-native), and **Flamingock** (Mongock's
successor/generalization to any external system). Each concept gets its own page, each with an example linked to
that tool's official documentation, key execution flows illustrated with Mermaid diagrams or an SVG figure, and a
bibliography listing every official source used.

Source: GitHub issue #51

**Decisions made on the user's behalf, applying this repo's existing conventions (not asked about — no genuine
ambiguity once the conventions below were found):**

- **Directory**: `modules/ROOT/pages/database/schema-evolution/`, flat (no further subdirectories) — matches the
  existing `database/sql/`, `database/mongodb/`, `database/couchbase/` sections, which are flat despite covering
  several sub-areas each.
- **Bibliography placement**: a `== Bibliography` section at the end of `index.adoc`, *not* a separate
  `bibliography.adoc` page. The original issue proposed a standalone page, but every existing section
  ([database/sql/index.adoc](../modules/ROOT/pages/database/sql/index.adoc),
  [database/mongodb/index.adoc](../modules/ROOT/pages/database/mongodb/index.adoc)) puts its bibliography as a
  section inside `index.adoc` — there is no `bibliography.adoc` anywhere in the repo. Following the issue text
  literally here would be inconsistent with house style.
- **Disclaimer partial**: every section's `index.adoc` opens with `include::partial$<topic>-disclaimer.adoc[]`
  (e.g. `sql-disclaimer.adoc`, `mongodb-disclaimer.adoc`, `couchbase-disclaimer.adoc`), stating the content was
  AI-generated and must be verified against the linked official docs. This guide needs its own:
  `modules/ROOT/partials/schema-evolution-disclaimer.adoc`.
- **No cheat sheet**: the issue explicitly said a cheat-sheet PDF is optional/not required for this guide, so none
  is added.
- **No language/framework task tag**: this repository has no matching `*-code-one-task` skill for AsciiDoc/Antora
  content (only `java`, `dotnet`, `database` — the last is for actual SQL/migration *code* in an application
  repo, not for writing documentation *about* migration tools). All tasks below are left untagged and will be
  implemented directly.

## Current code state

This repository has no application source — it is the Antora playbook + root component for
https://albertoirurueta.github.io/docs. Relevant existing structure:

- [modules/ROOT/nav.adoc](../modules/ROOT/nav.adoc) — the site nav. Under `* Guides & References` /
  `** xref:database/index.adoc[Database Development]`, three sibling sections already exist as
  `*** xref:database/<topic>/index.adoc[...]` blocks with `****` sub-entries per page: `database/sql/`,
  `database/mongodb/`, `database/couchbase/` (in that order), followed by `** xref:web/index.adoc[Web
  Development]`. The new section's nav block goes after the Couchbase Reference block and before Web Development.
- [modules/ROOT/pages/database/index.adoc](../modules/ROOT/pages/database/index.adoc) — the Database Development
  landing page, with a `== Sections` bullet list (one bullet per section, each summarizing what it covers). A new
  bullet for this guide goes after the Couchbase Reference bullet.
- Each section (`database/sql/`, `database/mongodb/`, `database/couchbase/`) is a flat directory of `.adoc` files:
  an `index.adoc` with `:description:`/`:keywords:` attributes, a disclaimer-partial include, prose, a `==
  What's covered` xref list (grouped into `===` subsections for larger sections like MongoDB), and a `==
  Bibliography` section — followed by one `.adoc` per concept, and (optionally) a `cheat-sheet.adoc`.
- Diagrams use two mechanisms, both already wired up per [CLAUDE.md](../CLAUDE.md) (no new tooling needed):
  - Mermaid, via `[mermaid]` / `....` fenced blocks directly in the `.adoc` source (e.g.
    [database/choosing-the-right-database.adoc](../modules/ROOT/pages/database/choosing-the-right-database.adoc),
    [database/mongodb/replication.adoc](../modules/ROOT/pages/database/mongodb/replication.adoc)).
  - Hand-authored flat-color SVG figures under `modules/ROOT/images/`, referenced as
    `image::<file>.svg["<long descriptive alt text>",width=740-760,role=text-center]` — see e.g.
    [modules/ROOT/images/mongodb-embed-vs-reference.svg](../modules/ROOT/images/mongodb-embed-vs-reference.svg):
    a `viewBox="0 0 760 470"` canvas, `font-family="Helvetica, Arial, sans-serif"`, white `#ffffff` background
    rect, dark `#222222` body text, muted `#666666` captions, `#999999` borders/dividers, `#f4f4f4` box fills,
    with two accent colors (`#2f5424` green / `#1c4b73` blue in that file) used only for the two things being
    contrasted. New SVGs in this plan must match this exact palette/style rather than inventing a new one.

No `*-code-one-task` skill matches "Antora/AsciiDoc documentation" as a key, so every task is implemented
directly rather than dispatched.

## Implementation steps

### Group 1 — Foundation: disclaimer partial and landing page

Parallelizable: yes (two independent files; the include is a syntactic reference only, not a content
dependency).

- [x] Task 1. Add the disclaimer partial `modules/ROOT/partials/schema-evolution-disclaimer.adoc`
  - Created `modules/ROOT/partials/schema-evolution-disclaimer.adoc` following the existing
    `[IMPORTANT] ==== ==== ` admonition style, covering Liquibase/Mongock/Flamingock sourcing, the AI-generated
    content caveat, and the Mongock-to-Flamingock succession note. No tests apply (documentation-only content).
  - Follow the `[IMPORTANT] ==== ... ====` admonition style used by every other `*-disclaimer.adoc` partial.
  - State that this section documents **schema/database evolution using Liquibase, Mongock, and Flamingock**, as
    described by each tool's own official documentation — https://www.liquibase.org/[liquibase.org] /
    https://docs.liquibase.com/[docs.liquibase.com] (Liquibase), https://docs.mongock.io/[docs.mongock.io]
    (Mongock), and https://docs.flamingock.io/[docs.flamingock.io] (Flamingock) — which are the references these
    pages are written and verified against.
  - Note explicitly that content was generated with the assistance of AI and must be verified against those
    official docs before being relied on in production, and that all three tools evolve their APIs/CLI over
    time — examples target each tool's current major version referenced in the Bibliography.
  - Note that Mongock is now maintained under the Flamingock GitHub organization
    (https://github.com/flamingock/mongock[github.com/flamingock/mongock]) and that Flamingock is positioned as
    its successor (see xref:database/schema-evolution/flamingock-getting-started.adoc[Coming from Mongock]) —
    readers starting a new project should default to Flamingock unless they have a reason to stay on Mongock.

- [x] Task 2. Create `modules/ROOT/pages/database/schema-evolution/index.adoc`
  - Created the landing page with disclaimer include, opening prose, an "At a Glance" comparison table, a
    "What's Covered" xref list grouped by the plan's task groups, and a Bibliography grouped by tool. No tests
    apply (documentation-only content).
  - `:description:` and `:keywords:` attributes summarizing the guide (schema evolution, migrations as code,
    Liquibase, Mongock, Flamingock, changelog, changeset, changeunit, rollback, audit trail).
  - `include::partial$schema-evolution-disclaimer.adoc[]` at the top.
  - Opening prose: why ad-hoc/manual schema changes are risky (untracked drift between environments, no audit
    trail, no safe rollback), what "migrations as code" solves (repeatability, auditability, team coordination
    via version control, environment parity), framed the same way
    [database/choosing-the-right-database.adoc](../modules/ROOT/pages/database/choosing-the-right-database.adoc)
    opens its own topic before diving into detail pages.
  - A short **comparison table** (AsciiDoc `[cols="..."]` table) with one row per tool: target system(s),
    primary language/changelog format, tracking/audit mechanism, typical ecosystem fit. Columns: Tool | Target
    system(s) | Changelog format | Tracking mechanism | Best fit.
  - A `== What's covered` xref list, grouped into `===` subsections matching the task groups below: Core
    Concepts; Choosing a Migration Tool; Liquibase (5 pages); Mongock (3 pages); Flamingock (4 pages); Best
    Practices. Mirror the descriptive-bullet style of
    [database/mongodb/index.adoc](../modules/ROOT/pages/database/mongodb/index.adoc)'s `== What's covered`
    section (one bullet per page, one clause per major topic that page covers).
  - A `== Bibliography` section, grouped by tool exactly like
    [database/mongodb/index.adoc](../modules/ROOT/pages/database/mongodb/index.adoc)'s own Bibliography, listing:
    - **Liquibase**: https://www.liquibase.org/[liquibase.org] (project home),
      https://docs.liquibase.com/concepts/changelogs/home.html[What is a Changelog?],
      https://docs.liquibase.com/concepts/changelogs/changeset.html[What is a Changeset?],
      https://docs.liquibase.com/community/user-guide-5-0/what-are-preconditions[What are Preconditions?],
      https://docs.liquibase.com/secure/reference-guide-5-2-1/changelog-attributes/what-are-contexts[What are
      Contexts?], https://docs.liquibase.com/secure/reference-guide-5-2-1/changelog-attributes/what-are-labels[What
      are Labels?], https://docs.liquibase.com/secure/user-guide-5-2-1/what-is-a-rollback[What is a Rollback?],
      https://docs.liquibase.com/community/user-guide-5-0-3/create-custom-rollback-statements-in-liquibase[Create
      custom rollback statements], https://docs.liquibase.com/pro/user-guide-4-33[User guide].
    - **Mongock**: https://docs.mongock.io/[Mongock Documentation],
      https://docs.mongock.io/v5/migration/[Migration / ChangeUnit reference],
      https://github.com/flamingock/mongock[GitHub repository].
    - **Flamingock**: https://docs.flamingock.io/get-started/Introduction[Introduction],
      https://docs.flamingock.io/get-started/quick-start[Quick start],
      https://docs.flamingock.io/flamingock-library-config/setup-and-stages[Setup & Stages],
      https://docs.flamingock.io/target-systems/introduction[Target Systems — Introduction],
      https://docs.flamingock.io/testing/flamingock-bdd-api[Flamingock BDD API],
      https://docs.flamingock.io/resources/coming-from-mongock[Coming from Mongock],
      https://docs.flamingock.io/resources/faq[FAQ], https://github.com/flamingock/flamingock-java[GitHub
      repository].
  - Every URL cited anywhere in Groups 2-6 below must appear in this Bibliography — if a later task's author
    needs to cite a doc page not already listed here, add it to this Bibliography section too, in the matching
    tool's group.

### Group 2 — Cross-tool concepts and tool choice

Parallelizable: yes (two independent pages; each references Group 1's index.adoc but not each other).

- [x] Task 3. Create `modules/ROOT/pages/database/schema-evolution/core-concepts.adoc`
  - Created with a Mermaid sequence diagram of the generic migration flow, one subsection per shared concept
    (each naming the Liquibase/Mongock/Flamingock term and linking a Bibliography doc page), and a
    vocabulary-at-a-glance comparison table. No tests apply (documentation-only content).
  - `:description:`/`:keywords:` (change unit, changelog, idempotency, checksum, audit table, distributed lock,
    contexts, rollback, dry run).
  - `include::partial$schema-evolution-disclaimer.adoc[]`.
  - Cover, as its own subsections, the vocabulary shared across all three tools before any tool-specific page
    uses it: change unit (changeset / changeunit / change — one atomic, uniquely-identified unit of migration),
    changelog/ordering (an ordered, append-only list of change units), idempotency (why a change unit must be
    safe to define once and run exactly one time, and what happens if it isn't), checksums/hashes (detecting a
    modified already-applied change), the audit/tracking table (where each tool records what ran and when),
    distributed locking during execution (preventing two instances from migrating concurrently on startup),
    contexts/environments (running different change units per environment), forward-only vs. reversible changes,
    and dry-run/preview.
  - Add one Mermaid sequence diagram showing the generic flow common to all three tools:
    ```
    [mermaid]
    ....
    sequenceDiagram
        participant App as Application startup
        participant Tool as Migration tool
        participant Lock as Distributed lock
        participant Audit as Audit / tracking table
        participant DB as Target system
        App->>Tool: run migrations
        Tool->>Lock: acquire lock
        Tool->>Audit: read applied change units
        Tool->>Tool: compute pending change units
        loop each pending change unit, in order
            Tool->>DB: execute change
            Tool->>Audit: record change as applied
        end
        Tool->>Lock: release lock
        Tool-->>App: startup continues
    ....
    ```
  - For each concept, name which tool calls it what (e.g. "changeset" in Liquibase, "changeunit" in Mongock,
    "change" in Flamingock) so the vocabulary carries into the tool-specific pages without re-explaining it.
  - Link each concept to at least one official doc page from the Bibliography (e.g. checksums →
    the Changeset page; distributed lock → the Mongock/Flamingock docs covering it, added to Task 2's
    Bibliography if not already listed there).

- [x] Task 4. Create `modules/ROOT/pages/database/schema-evolution/choosing-a-migration-tool.adoc`
  - Created a decision guide with a default-plus-named-deviations structure, a Mermaid `flowchart TD` decision
    tree, and a summary table; cross-links to the Flamingock "Coming from Mongock" page instead of restating it.
    No tests apply (documentation-only content).
  - `:description:`/`:keywords:` (Liquibase vs. Mongock vs. Flamingock, choosing a migration tool).
  - `include::partial$schema-evolution-disclaimer.adoc[]`.
  - A decision guide in the style of
    [database/choosing-the-right-database.adoc](../modules/ROOT/pages/database/choosing-the-right-database.adoc):
    default recommendation plus named reasons to deviate. Cover: Liquibase for relational/SQL databases with a
    declarative XML/YAML/JSON/SQL changelog and no requirement to be on the JVM; Mongock for an existing
    MongoDB + Java/Spring project already invested in code-first changeunits; Flamingock as the forward path when
    starting fresh or migrating off Mongock — one Change-as-Code model across SQL, MongoDB, DynamoDB, Couchbase,
    and non-database systems (message brokers, APIs, cloud services) instead of one tool per target.
  - Include a short decision flowchart, Mermaid `flowchart TD`, branching on "single relational DB?" → Liquibase,
    "existing Mongock project, no reason to migrate?" → Mongock, "new project / multiple target systems /
    migrating off Mongock?" → Flamingock.
  - Cross-link to xref:database/schema-evolution/flamingock-getting-started.adoc[] for the Mongock→Flamingock
    migration path instead of restating it.

### Group 3 — Liquibase

Parallelizable: yes (five independent pages).

- [x] Task 5. Create `modules/ROOT/pages/database/schema-evolution/liquibase-getting-started.adoc`
  - Created, covering CLI install, Maven plugin, Spring Boot auto-run, the four changelog formats, and a first
    minimal `createTable` example applied via `liquibase update`. No tests apply (documentation-only content).
  - `:description:`/`:keywords:`; disclaimer include.
  - Cover: installing the Liquibase CLI, running via Maven/Gradle plugin and Spring Boot auto-run-on-startup,
    the four changelog formats (SQL, XML, YAML, JSON) at a glance, and a first minimal changelog + changeset
    example (e.g. `createTable`) with the exact `liquibase update` command to apply it.
  - Link the install/CLI steps and the `update` command to
    https://docs.liquibase.com/pro/user-guide-4-33[the User guide] and the changelog-format overview to
    https://docs.liquibase.com/concepts/changelogs/home.html[What is a Changelog?].

- [x] Task 6. Create `modules/ROOT/pages/database/schema-evolution/liquibase-changelogs-and-changesets.adoc`
  - Created, covering changeset identity, one-change-type-per-changeset, `include`/`includeAll`,
    `generateChangeLog`/`diffChangeLog`, and a two-changeset YAML ordering example. No tests apply
    (documentation-only content).
  - Cover: changeset identity (`id`/`author`/`filename` uniquely identifying a changeset, per
    https://docs.liquibase.com/concepts/changelogs/changeset.html[What is a Changeset?]), the "one change type
    per changeset" recommendation, `include`/`includeAll` for splitting large changelogs across files/teams, and
    generating a changelog from an existing database (`generateChangeLog`) or a schema diff (`diff`/
    `diffChangeLog`).
  - Include a YAML changeset example creating a table plus a follow-up changeset adding a column, to show
    ordering across changesets.

- [x] Task 7. Create `modules/ROOT/pages/database/schema-evolution/liquibase-preconditions-contexts-labels.adoc`
  - Created, covering preconditions, contexts, labels, the author-vs-operator distinction, and a combined
    precondition+context example. No tests apply (documentation-only content).
  - Cover preconditions (state checks that gate whether a changeset runs, e.g. `tableExists`), contexts (logical
    expressions tagging which environment a changeset belongs to, e.g. `test` vs. `production`), and labels
    (a simpler tag list matched at run time) — including when to prefer contexts (author decides the logic) vs.
    labels (the person running `update` decides).
  - Link to https://docs.liquibase.com/community/user-guide-5-0/what-are-preconditions[What are Preconditions?],
    https://docs.liquibase.com/secure/reference-guide-5-2-1/changelog-attributes/what-are-contexts[What are
    Contexts?], and
    https://docs.liquibase.com/secure/reference-guide-5-2-1/changelog-attributes/what-are-labels[What are
    Labels?].
  - Include one example changeset combining a precondition with a context expression.

- [x] Task 8. Create `modules/ROOT/pages/database/schema-evolution/liquibase-rollback.adoc`
  - Created, covering automatic rollback, a `dropTable`-inverse custom `<rollback>` example, and
    tag/count/date/one-changeset rollback commands. No tests apply (documentation-only content).
  - Cover: automatic rollback (Liquibase-generated inverse SQL for change types like `createTable`/
    `addColumn`), custom `<rollback>` blocks for change types with no well-defined inverse (`dropTable`,
    `insert`, raw SQL), and rolling back by tag/count/date via the `rollback`/`rollback-one-changeset` commands.
  - Link to https://docs.liquibase.com/secure/user-guide-5-2-1/what-is-a-rollback[What is a Rollback?] and
    https://docs.liquibase.com/community/user-guide-5-0-3/create-custom-rollback-statements-in-liquibase[Create
    custom rollback statements].
  - Include one changeset with an explicit `<rollback>` block for a `dropTable`-inverse case.

- [x] Task 9. Create `modules/ROOT/pages/database/schema-evolution/liquibase-tracking-and-locking.adoc`
  - Created, covering `DATABASECHANGELOG`/`DATABASECHANGELOGLOCK`, checksum mismatches and `clearCheckSums`, and
    `releaseLocks` for a stuck lock. No tests apply (documentation-only content).
  - Cover the `DATABASECHANGELOG` table (what ran, when, its checksum) and `DATABASECHANGELOGLOCK` table
    (preventing concurrent `update` runs), what happens on a checksum mismatch (an already-applied changeset was
    edited) and how to resolve it (`clearCheckSums`/`validate`), and how to release a stuck lock after an
    interrupted run (`releaseLocks`).
  - Link to https://docs.liquibase.com/concepts/changelogs/home.html[What is a Changelog?] (source of the
    DATABASECHANGELOG description) — add any more specific tracking-table doc page found while writing this task
    to the Bibliography in Task 2.

### Group 4 — Mongock

Parallelizable: yes (three independent pages).

- [x] Task 10. Create `modules/ROOT/pages/database/schema-evolution/mongock-getting-started.adoc`
  - Created, covering drivers (Sync/Spring Data/Reactive), runners (Standalone/Spring Boot), and a first
    `@ChangeUnit` example. No tests apply (documentation-only content).
  - Cover: the available drivers (MongoDB Sync, Spring Data, Reactive) and runners (Standalone vs. Spring Boot),
    and a first minimal `@ChangeUnit` class example.
  - Link to https://docs.mongock.io/[Mongock Documentation] and https://docs.mongock.io/v5/migration/[the
    Migration / ChangeUnit reference].

- [x] Task 11. Create `modules/ROOT/pages/database/schema-evolution/mongock-changeunits.adoc`
  - Created, covering `@ChangeUnit` attributes, `@Execution`, `@RollbackExecution`, `@BeforeExecution`, and a
    full example class contrasting code-first migrations with Liquibase's declarative changelogs. No tests
    apply (documentation-only content).
  - Cover: `@ChangeUnit(id, order, author, systemVersion)`, the mandatory `@Execution` method, the (highly
    recommended) `@RollbackExecution` method, the optional `@BeforeExecution` hook for non-transactional
    preparation (e.g. DDL-like operations MongoDB won't allow inside a transaction), and code-first migrations
    (Java classes) as the key contrast with Liquibase's declarative changelog files.
  - Link to https://docs.mongock.io/v5/migration/[the Migration / ChangeUnit reference].
  - Include one full `@ChangeUnit` class example with matching `@Execution`/`@RollbackExecution` methods.

- [x] Task 12. Create `modules/ROOT/pages/database/schema-evolution/mongock-transactions-and-locking.adoc`
  - Created, covering transactional execution on a replica set/sharded cluster, the distributed lock, and
    multi-tenant migration considerations. No tests apply (documentation-only content).
  - Cover: transactional execution where the MongoDB deployment supports it (replica set/sharded cluster, not a
    standalone `mongod`), the distributed lock acquired before a migration run, and multi-tenant considerations
    (running the same change units against many tenant databases).
  - Link to https://docs.mongock.io/[Mongock Documentation] (add a more specific transactions/locking doc URL to
    the Bibliography in Task 2 if one is found while writing this page).

### Group 5 — Flamingock

Parallelizable: yes (four independent pages).

- [x] Task 13. Create `modules/ROOT/pages/database/schema-evolution/flamingock-getting-started.adoc`
  - Created, covering the Change-as-Code philosophy's three principles, a quick-start `@Change` example, and the
    Coming from Mongock migration path. No tests apply (documentation-only content).
  - Cover: the Change-as-Code (CaC) philosophy and its three principles (safety by default — stop and require
    manual intervention when a safe outcome can't be guaranteed; complete auditability; configurable recovery
    strategies), a quick-start example, and the "coming from Mongock" migration path (why and how to move an
    existing Mongock project to Flamingock).
  - Link to https://docs.flamingock.io/get-started/Introduction[Introduction],
    https://docs.flamingock.io/get-started/quick-start[Quick start], and
    https://docs.flamingock.io/resources/coming-from-mongock[Coming from Mongock].

- [x] Task 14. Create `modules/ROOT/pages/database/schema-evolution/flamingock-changes-and-target-systems.adoc`
  - Created, covering the anatomy of a Change, target systems, the audit store, and a non-transactional-target
    example (a message queue) justifying the required `@Rollback`. No tests apply (documentation-only content).
  - Cover: the anatomy of a Change (unique identifier, target system, `@Apply`/`@Rollback` methods — noting
    `@Rollback` is required for non-transactional target systems like an object store, message queue, or REST
    API, since Flamingock has no generic inverse for those), and target systems (SQL, MongoDB
    sync/Spring Data, DynamoDB, Couchbase, and non-transactional systems), plus the audit store that tracks
    execution history.
  - Link to https://docs.flamingock.io/target-systems/introduction[Target Systems — Introduction].
  - Include one Change class example targeting a non-transactional system to justify why its `@Rollback` method
    matters more there than for a transactional database.

- [x] Task 15. Create `modules/ROOT/pages/database/schema-evolution/flamingock-stages-and-pipelines.adoc`
  - Created, covering stages, pipelines, and the pre-deploy/post-deploy rollout rationale, with the plan's
    Mermaid two-stage pipeline diagram. No tests apply (documentation-only content).
  - Cover: grouping Changes into stages (sequential, ordered execution within a stage) and pipelines (multiple
    stages, with execution order guaranteed within but not across stages), and why this matters for
    environment/lifecycle-scoped rollout (e.g. a "pre-deploy" stage vs. a "post-deploy" stage).
  - Link to https://docs.flamingock.io/flamingock-library-config/setup-and-stages[Setup & Stages].
  - Include a Mermaid diagram of a two-stage pipeline:
    ```
    [mermaid]
    ....
    flowchart TB
        subgraph Stage1["Stage: pre-deploy (sequential, ordered)"]
            C1[Change A] --> C2[Change B] --> C3[Change C]
        end
        subgraph Stage2["Stage: post-deploy (sequential, ordered)"]
            C4[Change D] --> C5[Change E]
        end
        Stage1 -.order not guaranteed across stages.-> Stage2
    ....
    ```

- [x] Task 16. Create `modules/ROOT/pages/database/schema-evolution/flamingock-testing.adoc`
  - Created, covering the change validator, unit testing a single Change, the BDD-style Given-When-Then API (with
    a `given/when/verify` example), and Spring Boot integration testing. No tests apply (documentation-only
    content).
  - Cover: the change validator (filtering an audit log's intermediate states, e.g. `STARTED`, down to final
    outcomes for assertions), unit testing a single Change in isolation, the BDD-style Given-When-Then testing
    API shared between standalone and Spring Boot tests (nothing executes until `verify()` is called), and
    Spring Boot integration testing.
  - Link to https://docs.flamingock.io/testing/flamingock-bdd-api[Flamingock BDD API].
  - Include one BDD-style test example sketch (`given(...).when(...).verify(...)`) for a single Change.

### Group 6 — Best practices

Parallelizable: yes (single task).

- [x] Task 17. Create `modules/ROOT/pages/database/schema-evolution/best-practices.adoc`
  - Created, covering expand/contract (with the new `schema-evolution-expand-contract.svg` figure), one logical
    change per change unit, never editing an applied change, CI testing, deploy coordination, and zero-downtime
    strategies. Added `modules/ROOT/images/schema-evolution-expand-contract.svg` matching the existing
    flat-color palette/style (viewBox 760x340, `#ffffff`/`#222222`/`#666666`/`#999999`/`#f4f4f4`, with
    `#2f5424`/`#1c4b73`/`#8a3d10` as the three phase accents). No tests apply (documentation-only content).
  - `:description:`/`:keywords:` (expand/contract, backward-compatible migrations, zero-downtime schema change).
  - `include::partial$schema-evolution-disclaimer.adoc[]`.
  - Cover, cross-tool: backward-compatible ("expand/contract") changes, one logical change per change
    unit, never editing an already-applied change (append a new one instead — ties back to
    xref:database/schema-evolution/core-concepts.adoc[the checksum concept]), testing migrations in CI against
    production-like data, coordinating a migration's rollout with the application deploy that depends on it
    (e.g. deploy code that tolerates both old and new schema before running the migration that removes the old
    shape), and zero-downtime strategies in general.
  - Add one new SVG figure, `modules/ROOT/images/schema-evolution-expand-contract.svg`, illustrating the
    expand → migrate → contract timeline (three horizontal phases/boxes with a short caption each: "Expand —
    add the new column/collection field, application still writes only the old one", "Migrate — backfill
    existing rows/documents, deploy application code that writes both", "Contract — stop writing the old
    shape, drop it once nothing reads it"). Match the palette/style of
    [modules/ROOT/images/mongodb-embed-vs-reference.svg](../modules/ROOT/images/mongodb-embed-vs-reference.svg)
    exactly: `viewBox="0 0 760 <height>"`, `font-family="Helvetica, Arial, sans-serif"`, white `#ffffff`
    background, `#222222` body text, `#666666` captions, `#999999` borders, `#f4f4f4` box fills, one accent
    color per phase. Reference it as
    `image::schema-evolution-expand-contract.svg["<full descriptive alt text of the three-phase timeline>",
    width=760,role=text-center]`.

### Group 7 — Wire up navigation

Parallelizable: yes (two independent files, both depending only on Groups 1-6 already existing).

- [x] Task 18. Add the new section to `modules/ROOT/nav.adoc`
  - Inserted the `Evolving the Database Model` nav block after the Couchbase Reference block and before Web
    Development, with `****` entries whose titles exactly match each page's `=` document title. No tests apply
    (documentation-only content).
  - Insert a new nav block for `Evolving the Database Model` right after the existing Couchbase Reference block
    (after the `**** xref:database/couchbase/cheat-sheet.adoc[Cheat Sheet (PDF)]` line) and before
    `** xref:web/index.adoc[Web Development]`, following the exact `***`/`****` nesting used by the sibling
    sections:
    ```
    *** xref:database/schema-evolution/index.adoc[Evolving the Database Model]
    **** xref:database/schema-evolution/core-concepts.adoc[Core Concepts]
    **** xref:database/schema-evolution/choosing-a-migration-tool.adoc[Choosing a Migration Tool]
    **** xref:database/schema-evolution/liquibase-getting-started.adoc[Liquibase: Getting Started]
    **** xref:database/schema-evolution/liquibase-changelogs-and-changesets.adoc[Liquibase: Changelogs & Changesets]
    **** xref:database/schema-evolution/liquibase-preconditions-contexts-labels.adoc[Liquibase: Preconditions, Contexts & Labels]
    **** xref:database/schema-evolution/liquibase-rollback.adoc[Liquibase: Rollback]
    **** xref:database/schema-evolution/liquibase-tracking-and-locking.adoc[Liquibase: Tracking & Locking]
    **** xref:database/schema-evolution/mongock-getting-started.adoc[Mongock: Getting Started]
    **** xref:database/schema-evolution/mongock-changeunits.adoc[Mongock: ChangeUnits]
    **** xref:database/schema-evolution/mongock-transactions-and-locking.adoc[Mongock: Transactions & Locking]
    **** xref:database/schema-evolution/flamingock-getting-started.adoc[Flamingock: Getting Started]
    **** xref:database/schema-evolution/flamingock-changes-and-target-systems.adoc[Flamingock: Changes & Target Systems]
    **** xref:database/schema-evolution/flamingock-stages-and-pipelines.adoc[Flamingock: Stages & Pipelines]
    **** xref:database/schema-evolution/flamingock-testing.adoc[Flamingock: Testing]
    **** xref:database/schema-evolution/best-practices.adoc[Best Practices]
    ```
    (Titles here must exactly match each page's `=` document title, per this repo's nav convention.)

- [x] Task 19. Add a new bullet to `modules/ROOT/pages/database/index.adoc`'s `== Sections` list
  - Added the bullet after the Couchbase Reference bullet, exactly as specified in the plan. No tests apply
    (documentation-only content).
  - After the existing Couchbase Reference bullet, add:
    ```
    * xref:database/schema-evolution/index.adoc[Evolving the Database Model] -- safe, consistent schema
      evolution with Liquibase, Mongock and Flamingock: changelogs, changesets, changeunits and changes,
      preconditions/contexts/labels, rollback, distributed locking, target systems, stages and pipelines,
      testing, and the expand/contract pattern.
    ```

### Group 8 — Full-site build verification

Parallelizable: yes (single task).

- [x] Task 20. Build the site and fix any errors
  - Ran `npx antora antora-playbook.yml` via a sub-agent; the first run succeeded with one Asciidoctor warning
    ("list item index: expected A, got B" at `mongock-transactions-and-locking.adoc:39`, caused by "tenant A ...
    tenant\nB." being misread as an ordered-list marker across a line wrap). Reworded the sentence to remove the
    letter-plus-period pattern and re-ran the build via a sub-agent: it now succeeds with zero warnings/errors.
  - Delegate to a sub-agent so build log output doesn't consume the main context window:
    ```
    Agent({
      description: "Build Antora site and check for errors",
      subagent_type: "iru-gate-runner",
      prompt: "In /Users/albertoirurueta/repositories/common/docs, run `npm install` if node_modules is missing,
        then `npx antora antora-playbook.yml`. Report back: whether the build succeeded, and the full text of
        any xref-resolution or AsciiDoc errors/warnings (unresolved xref, missing include, broken image path)
        it produced, with file:line for each."
    })
    ```
  - If it reports any xref/include/image errors (e.g. a nav entry or `What's covered` xref pointing at a
    filename that doesn't match what an earlier task actually created, or a nav title that doesn't match a
    page's `=` document title), fix the specific file(s) at fault and re-run the build until it completes clean.
  - This is the acceptance-criteria gate from GitHub issue #51: "`npx antora antora-playbook.yml` builds without
    `xref`/AsciiDoc errors."
