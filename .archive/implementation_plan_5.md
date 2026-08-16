# Implementation Plan: SQL Reference update — locking and relations

## Task summary

Source: GitHub issue #5

Issue [#5](https://github.com/albertoirurueta/docs/issues/5) ("SQL Reference update") asks to extend the existing
standard-SQL reference under `modules/ROOT/pages/sql/` (created by the prior `.archive/implementation_plan_3.md`,
issue #3) with two new topics:

- **Optimistic vs. pessimistic locking** — what each is, when each is used, their advantages/disadvantages, and
  how each is implemented (pessimistic via transaction isolation level; optimistic via a versioning column),
  with examples.
- **Relations** — the standard relation types (1-to-1, 1-to-N, N-to-1, N-to-N), how each is modeled (foreign
  keys vs. auxiliary/junction tables), with diagrams, DDL statements, and example join queries per type.

**Choices made on the user's behalf:**

- **Locking placement**: added as a new `== Concurrency Control` section in the existing
  `modules/ROOT/pages/sql/transactions.adoc`, rather than a new standalone page. That page already documents
  transaction isolation levels (`READ UNCOMMITTED`…`SERIALIZABLE`) and the three read phenomena they
  prevent/allow — pessimistic locking is a direct extension of that same material (it *is* how isolation levels
  achieve their guarantees), so keeping it in the same page avoids splitting a single coherent concurrency-control
  narrative across two pages.
- **Relations placement**: added as a **new standalone page**, `modules/ROOT/pages/sql/relations.adoc`, rather
  than folding it into `ddl.adoc` (which already documents `FOREIGN KEY`/`PRIMARY KEY`) or `dml-queries.adoc`
  (which already documents joins). The ticket asks for four distinct relation types each carrying its own
  explanation, diagram, DDL, and join example — substantial enough content to warrant its own page under this
  repo's established "one page per topic" convention (per `.archive/implementation_plan_3.md`), while
  cross-referencing `ddl.adoc`'s existing constraint syntax and `dml-queries.adoc`'s existing join syntax rather
  than re-explaining either.
- **Diagrams**: use Mermaid `[mermaid]` ER-style (`erDiagram`) blocks for each relation type. `@sntke/antora-mermaid-extension`
  is already enabled in `antora-playbook.yml` but not yet used by any page in this repo — this is the first page
  to exercise it, so the build-verification step (Group 3) must specifically confirm the diagrams actually
  render, not just that the AsciiDoc parses.
- **Locking examples**: pessimistic locking is illustrated via `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`
  (already-documented standard syntax) rather than a vendor-specific row-lock clause like `SELECT ... FOR UPDATE`
  (nonstandard, and this reference is explicitly standard-SQL-only per the shared disclaimer). Optimistic
  locking is illustrated with a `version` column and a `WHERE version = <expected>` guard on `UPDATE`, which is a
  portable, standard-SQL pattern requiring no vendor-specific feature.

No language/framework key applies to any task below — this is pure AsciiDoc content authoring (plus Mermaid
diagram blocks within it), not source code, matching `.archive/implementation_plan_3.md`'s own precedent. Per this
plan's tagging convention, an untagged task is implemented directly by `iru-code` rather than dispatched to a
language-specific `*-code-one-task` skill.

## Current code state

- `modules/ROOT/pages/sql/transactions.adoc` currently has two top-level sections, `== Starting a transaction`
  and `== Ending a transaction`, followed by `== Setting the isolation level` (isolation levels, the three read
  phenomena, and a `=== Per-statement isolation clauses are not standard` note). The new locking content lands as
  a new `== Concurrency Control` section after that, so it can reference the already-documented isolation levels
  by name.
- `modules/ROOT/pages/sql/ddl.adoc` documents `CREATE TABLE`, `ALTER TABLE`, `DROP`, and, under `== Constraints`,
  `PRIMARY KEY`, `FOREIGN KEY` (with `ON DELETE`/`ON UPDATE` referential actions), `UNIQUE`, `NOT NULL`, `CHECK`,
  `DEFAULT` — all illustrated with a running `sales.orders` / `sales.customers` / `sales.order_items` example
  schema. The new `relations.adoc` page reuses this same example schema/domain for continuity, extending it with
  a `sales.products`, `sales.employees`, and a `sales.product_categories` junction table as needed per relation
  type.
- `modules/ROOT/pages/sql/dml-queries.adoc` documents every standard join type (`INNER`, `LEFT OUTER`,
  `RIGHT OUTER`, `FULL OUTER`, `CROSS`) under `== Joins`, with `e`/`d` (employees/departments) aliases. The new
  page's join examples cross-reference this page via `xref:sql/dml-queries.adoc[]` rather than re-explaining
  join syntax.
- `modules/ROOT/pages/sql/index.adoc` lists every SQL reference page under `== What's covered`, ending with the
  cheat sheet; the new `relations.adoc` page needs its own bullet there.
- `modules/ROOT/nav.adoc` (lines 16–26) nests every `sql/*.adoc` page under `* xref:sql/index.adoc[SQL Reference]`
  in table-of-contents order: `ddl.adoc`, `dml-queries.adoc`, `dml-modifications.adoc`, `transactions.adoc`,
  `dcl.adoc`, `functions.adoc`, `aggregate-window-functions.adoc`, `json-xml-functions.adoc`,
  `triggers-procedures.adoc`, `cheat-sheet.adoc`. `relations.adoc` is inserted right after `ddl.adoc`, since it is
  fundamentally about schema/constraint design.
- `modules/ROOT/partials/sql-disclaimer.adoc` is the shared "standard SQL only / AI-generated" admonition every
  `sql/*.adoc` page `include::`s at the top — `relations.adoc` must do the same; `transactions.adoc` already
  includes it, so no change needed there.
- `antora-playbook.yml` (lines 106–113) already enables `@sntke/antora-mermaid-extension` with
  `mermaid_initialize_options: { start_on_load: true }` — usable directly via a `[mermaid]` block, no further
  playbook change needed.
- The only verification method in this repo (per `CLAUDE.md` and both prior archived plans) is
  `npx antora antora-playbook.yml` (or `--fetch`), checking for a clean build with no `xref`/AsciiDoc errors, then
  inspecting `build/site`.

## Implementation steps

### Group 1 — Tasks 1 and 2

**Parallelizable: yes** — Task 1 only edits `transactions.adoc`; Task 2 only creates the new, independent
`relations.adoc`. Neither task's file is touched by the other, so they can be authored concurrently.

- [x] Task 1. Add a "Concurrency Control" section to `modules/ROOT/pages/sql/transactions.adoc`
  - [x] Task 1.1. Add a new `== Concurrency Control` section (after the existing `== Setting the isolation
    level` section) with a short intro framing pessimistic vs. optimistic locking as two different strategies
    for handling concurrent writes to the same row.
  - [x] Task 1.2. Add a `=== Pessimistic locking` subsection: explain that it prevents conflicts by acquiring
    locks up front (before reading/modifying data) so no other transaction can concurrently modify the same
    row, typically achieved in standard SQL by running the modifying statements inside a transaction with a
    sufficiently strict isolation level (e.g. `SERIALIZABLE`). Cover:
    * When it's used: high-contention workloads where conflicts are frequent enough that retrying after a
      failed optimistic check would be wasteful.
    * Advantages: guarantees no lost updates or read/write conflicts within the locked scope; simpler
      application logic (no retry loop needed).
    * Disadvantages: reduces concurrency (other transactions block or fail), and risks deadlocks between
      transactions that lock the same rows in different orders.
    * Example, reusing the `sales.orders`/`sales.order_items` example schema:
      ```adoc
      [source,sql]
      ----
      START TRANSACTION ISOLATION LEVEL SERIALIZABLE, READ WRITE;

      UPDATE sales.order_items
         SET quantity = quantity - 1
       WHERE order_id = 5001
         AND line_number = 1;

      COMMIT;
      ----
      ```
  - [x] Task 1.3. Add a `=== Optimistic locking` subsection: explain that it lets concurrent transactions
      proceed without locking, then detects conflicts at commit time by checking whether the row changed since
      it was read — typically via a `version` (or `row_version`) column incremented on every update, or a
      last-modified timestamp. Cover:
    * When it's used: low-contention workloads where conflicts are rare, so avoiding locks maximizes
      concurrency/throughput.
    * Advantages: no locks held between read and write, so higher concurrency and no deadlock risk from this
      pattern.
    * Disadvantages: requires explicit conflict handling (detect a zero-row-affected `UPDATE` and retry or
      surface an error to the caller); wasted work when a conflict does occur and the transaction must retry.
    * Example, adding a `version` column to the running example schema:
      ```adoc
      [source,sql]
      ----
      ALTER TABLE sales.orders
          ADD COLUMN version INTEGER NOT NULL DEFAULT 0;

      -- Application reads: SELECT total_amount, version FROM sales.orders WHERE order_id = 5001;
      -- ...and later writes back, checking the version read earlier (here, 3):

      UPDATE sales.orders
         SET total_amount = 150.00,
             version = version + 1
       WHERE order_id = 5001
         AND version = 3;

      -- Zero rows affected means another transaction updated (and incremented) the row first: the
      -- application must detect this and retry (re-read, then re-apply the update) or surface a conflict.
      ----
      ```
  - [x] Task 1.4. Add a brief closing comparison note (a short paragraph or bullet list) contrasting the two
    strategies directly: lock-based vs. version-check-based conflict handling, and the contention level each
    suits best.
  - Note: added a new `== Concurrency Control` section to `modules/ROOT/pages/sql/transactions.adoc` (after
    `== Setting the isolation level`), with `=== Pessimistic locking`, `=== Optimistic locking`, and
    `=== Choosing between the two strategies` subsections, each with a SQL example.

- [x] Task 2. Create `modules/ROOT/pages/sql/relations.adoc` — Relations between tables
  - [x] Task 2.1. Start the page with `= Relations` and `include::partial$sql-disclaimer.adoc[]`, then a short
    intro explaining that relational databases model associations between tables using foreign keys (and, for
    many-to-many associations, an auxiliary/junction table), and that this page covers the four standard
    relation cardinalities with a diagram, `CREATE TABLE` DDL, and an example join query for each.
  - [x] Task 2.2. Add a `== One-to-one (1:1)` section:
    * Explain: each row in one table corresponds to at most one row in another, typically modeled by placing a
      `UNIQUE` foreign key in one of the two tables (rather than a plain, non-unique one, which would allow
      many-to-one instead).
    * A `[mermaid]` `erDiagram` block showing e.g. `sales.orders ||--|| sales.order_invoices : has`.
    * DDL extending the running schema, e.g. a new `sales.order_invoices` table with a `UNIQUE` foreign key
      `order_id` referencing `sales.orders(order_id)`.
    * An example `INNER JOIN` query between the two tables, cross-referencing
      `xref:sql/dml-queries.adoc#_inner_join[]` (or the equivalent anchor) for join syntax rather than
      re-explaining it.
  - [x] Task 2.3. Add a `== One-to-many (1:N) and many-to-one (N:1)` section:
    * Explain these are the same physical relationship viewed from each side: a plain (non-unique) foreign key
      column on the "many" side referencing the "one" side's primary key — exactly the existing
      `sales.order_items.order_id -> sales.orders.order_id` and
      `sales.orders.customer_id -> sales.customers.customer_id` relationships already shown in `ddl.adoc`.
    * A `[mermaid]` `erDiagram` block showing e.g. `sales.orders ||--o{ sales.order_items : contains`.
    * Reuse (don't redefine) the existing `ddl.adoc` DDL for this relationship via a short reference/quote, plus
      a new example join query (`sales.orders` joined to `sales.order_items`) cross-referencing
      `dml-queries.adoc` for join syntax.
  - [x] Task 2.4. Add a `== Many-to-many (N:N)` section:
    * Explain that a direct foreign key cannot express many-to-many, so it requires an auxiliary/junction table
      holding one foreign key per side, typically with a composite primary key across both foreign keys.
    * A `[mermaid]` `erDiagram` block showing e.g.
      `sales.products ||--o{ sales.product_categories : has` and
      `sales.categories ||--o{ sales.product_categories : has`.
    * DDL for a new `sales.products`, `sales.categories`, and junction `sales.product_categories` (composite
      `PRIMARY KEY (product_id, category_id)`, two `FOREIGN KEY` clauses).
    * An example join query using two `INNER JOIN`s (`sales.products` → `sales.product_categories` →
      `sales.categories`) to list each product's categories.
  - [x] Task 2.5. Add a closing `== Summary` section: a short comparison table or bullet list mapping each
    relation type to how it's modeled (plain FK / unique FK / junction table).
  - Note: created `modules/ROOT/pages/sql/relations.adoc` with `== One-to-one (1:1)` (new
    `sales.order_invoices` table, `UNIQUE` FK), `== One-to-many (1:N) and many-to-one (N:1)` (reuses existing
    `sales.order_items`/`sales.orders` FK from `ddl.adoc`), `== Many-to-many (N:N)` (new `sales.products`,
    `sales.categories`, junction `sales.product_categories`), and a closing `== Summary` table. Each relation
    section has a `[mermaid]` `erDiagram` block, DDL, and a join example cross-referencing
    `dml-queries.adoc`/`ddl.adoc` anchors.

### Group 2 — Task 3 only

**Parallelizable: yes** (single task; depends on Group 1 completing so `relations.adoc` exists to link to)

- [x] Task 3. Wire `relations.adoc` into navigation and the section index, and verify the full site build
  - [x] Task 3.1. Add a new bullet to `modules/ROOT/pages/sql/index.adoc`'s `== What's covered` list, right
    after the `ddl.adoc` bullet: `xref:sql/relations.adoc[Relations] -- the standard relation types (1:1, 1:N,
    N:1, N:N), how each is modeled, and example join queries for each.`
  - [x] Task 3.2. Add `** xref:sql/relations.adoc[Relations]` to `modules/ROOT/nav.adoc`, right after the
    existing `** xref:sql/ddl.adoc[DDL]` line (currently line 17) and before `** xref:sql/dml-queries.adoc[...]`.
  - [x] Task 3.3. Delegate the full-site build check to the `iru-gate-runner` agent rather than running it
    inline (per this repo's only verification convention):
    ```
    Agent({
      description: "Build and verify the Antora docs site",
      subagent_type: "iru-gate-runner",
      prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site. Report back:
        whether the build completed with no xref/AsciiDoc errors, whether the new 'Concurrency Control' section
        in modules/ROOT/pages/sql/transactions.adoc rendered, whether the new
        modules/ROOT/pages/sql/relations.adoc page rendered (including its 'What's covered' entry in sql/index.adoc
        and its new nested nav.adoc entry), and specifically whether every [mermaid] erDiagram block on that page
        actually rendered as a diagram in the generated HTML rather than showing as raw text/an error (this is the
        first page in this repo to use the already-enabled @sntke/antora-mermaid-extension, so this needs an
        explicit check, not an assumption)."
    })
    ```
  - [x] Task 3.4. If the agent reports any `xref`/build error, a broken nav/index entry, or a Mermaid diagram
    that fails to render, fix the offending page/nav entry/diagram syntax and re-run Task 3.3 until the build is
    clean and every diagram renders.
  - Note: build completed with no xref/AsciiDoc errors. The `iru-gate-runner` agent confirmed the "Concurrency
    Control" section rendered in `transactions.html`, `relations.adoc` rendered with its nav and index entries
    working, and (via a headless-Chrome DOM check after mermaid.js's client-side render) all 3 `erDiagram`
    blocks rendered as actual `<svg>` diagrams rather than raw text. No fixes were needed.
