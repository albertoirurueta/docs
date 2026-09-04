# Implementation Plan: Database Development / Couchbase Reference

## Task summary

Source: GitHub issue #45

Issue [#45](https://github.com/albertoirurueta/docs/issues/45) ("Couchbase Reference") asks to add a new
**"Couchbase Reference"** subsection under the existing **Guides & References / Database Development** section of
this repo's own `ROOT` Antora component, at `modules/ROOT/pages/database/couchbase/` — the second sibling of the
existing `database/sql/` and `database/mongodb/` subsections. It documents **Couchbase Server** as a
database-developer reference — the JSON-document / key-value model, buckets/scopes/collections, the KV and
sub-document APIs, concurrency and durability, data modeling, SQL++ querying, indexing, Full-Text and Vector
Search, Analytics and Eventing, clustering/replication/failover and XDCR, storage internals, security,
administration and tooling, the SDKs, and Couchbase Mobile — plus a one-page downloadable PDF cheat sheet.
Content is written and verified against **the current Couchbase Server 7.6.x line** at
https://docs.couchbase.com/server/current/. Explanations must be brief and example-driven; **every concept
carries at least one runnable example and at least one link to the specific
https://docs.couchbase.com/ page it documents**. `[mermaid]` diagrams and hand-authored inline **SVG** figures
(under `modules/ROOT/images/`, named `couchbase-*.svg`) are used **only where a diagram genuinely helps**.

Three PDF books were consulted while planning this section — *Couchbase Essentials* (John Zablocki, Packt
Publishing, 2015, ISBN 978-1-78439-449-3), *Pro Couchbase Development* (Deepak Vohra, Apress, 2015, ISBN
978-1-4842-1435-0) and *Pro Couchbase Server*, 2nd ed. (David Ostrovsky, Mohammed Haji, Yaniv Rodenski, Apress,
2015, ISBN 978-1-4842-1186-1). All three target roughly **Couchbase Server 3.x / 4.0** and predate scopes &
collections, the N1QL→SQL++ rename, the six-service split, GSI-over-Views, distributed ACID transactions, RBAC,
synchronous-replication durability, the sub-document API, and Capella. They are cited **only as bibliography
entries**, never as the "primary" or "main" reference. https://docs.couchbase.com/ is the source every page is
written and verified against; where a book and the current documentation disagree, **the official documentation
wins** and the difference is noted. Documentation prose is original explanation verified against the official
docs, **not** presented as derived from the books; the books appear only in `== Bibliography` and the
disclaimer partial's "consulted while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, Tailwind, TypeScript, Vue.js, and MongoDB reference sections. The closest structural
precedent is [.archive/implementation_plan_37.md](.archive/implementation_plan_37.md) (issue #37, "MongoDB
Reference") — a new `database/<engine>/` subsection grounded in an official doc site plus bibliography-only
books that predate the current version, with mermaid diagrams, hand-authored SVG figures, a `== Bibliography`,
and a headless-Chrome-rendered one-page PDF cheat sheet, organised into four task groups —
and [.archive/implementation_plan_3.md](.archive/implementation_plan_3.md) / `_5.md` (issues #3 / #5, "SQL
Reference"), which established the `database/index.adoc` + `database/sql/` + `sql-disclaimer.adoc` +
`sql-cheat-sheet.pdf` shape this subsection mirrors.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **Page count consolidated to 13 content pages + 1 cheat sheet + 1 section index (15 `.adoc` files)**, per the
   user's instruction to merge the issue's 26-page list into fewer pages. Each page still maps to a coherent
   area of the official documentation; related areas the issue listed separately are folded into one page:
   documents+metadata+expiration; KV+sub-document ops; concurrency+durability; SQL++ select+joins;
   SQL++ DML+functions+transactions; GSI indexing+legacy Views; Search+Analytics+Eventing;
   clusters+replication+failover+XDCR; storage+security+administration; SDKs+Mobile.
2. **No source-code syntax highlighting**, per the user's instruction. All examples use plain AsciiDoc delimited
   listing blocks (`----` … `----`) with **no `[source,<lang>]` attribute**. This also sidesteps the unverified
   `sqlpp` highlighter question. (Existing MongoDB/SQL pages use `[source,…]`; the new Couchbase pages
   deliberately do not — noted so review does not flag it as an inconsistency.)
3. **Document the current Couchbase Server 7.6.x line as published at
   https://docs.couchbase.com/server/current/**, not pinned to a patch version. Examples use modern idioms:
   `bucket.scope(...).collection(...)`, SQL++ (not "N1QL") with ANSI joins and `WITH`/recursive CTEs, `CREATE
   INDEX … USING GSI`, durable-write levels (`majority` / `majorityAndPersistToActive` / `persistToMajority`),
   `transactions.run(...)` and `BEGIN`/`COMMIT`/`ROLLBACK`, the Search/Analytics/Eventing services, `cbbackupmgr`
   / `cbimport`. Where a book uses an older pattern (bucket-password auth, MapReduce Views, `cbbackup`,
   two-phase-commit, `PersistTo`/`ReplicateTo`), the page documents the current approach and notes the change.
4. **The books are bibliography-only.** Neither the disclaimer nor any per-page admonition describes any of them
   as the primary or main reference; they appear only as `== Bibliography` entries and in the disclaimer's
   "consulted while preparing these pages" clause.
5. **The subsection is named "Couchbase Reference"** in the section index title, the `database/index.adoc`
   bullet, the `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing "SQL Reference"
   / "MongoDB Reference" siblings.
6. **Placed after "MongoDB Reference"**, as the third subsection of Database Development, in `nav.adoc`,
   `database/index.adoc`, and the root `index.adoc` — the "append in the order added" ordering every prior
   subsection followed.
7. **Mermaid is the default for flow / sequence / state diagrams; six hand-authored SVGs** where a spatial
   figure is clearer (all `couchbase-*.svg` under `modules/ROOT/images/`, authored to render in both the light
   and dark site themes like the existing `*.svg` figures): `couchbase-services-mds.svg` (the six services
   distributed across nodes — Multi-Dimensional Scaling), `couchbase-keyspace-hierarchy.svg`
   (cluster → bucket → scope → collection → document beside the relational catalog → schema → table → row
   analogy), `couchbase-embed-vs-reference.svg` (a 1:N relationship embedded vs. referenced with the "queried on
   its own? / unbounded?" decision), `couchbase-gsi-scan.svg` (predicate → index scan on the Index service →
   key + doc-id → document fetch on the Data service), `couchbase-vbucket-map.svg` (1024 vBuckets, active +
   replica, spread across nodes with the cluster map), and `couchbase-xdcr-topology.svg` (two clusters,
   unidirectional and bidirectional). Mermaid covers: the optimistic CAS retry loop (flowchart), the
   `majority`-durable write path (sequence), the transaction / ATR lifecycle (state diagram), the SQL++ query
   execution pipeline (flowchart), and the managed-cache → disk-write-queue → storage-engine + DCP fan-out
   (flowchart). The implementer may add or drop a figure while writing a page if it changes the value — not
   re-planned as separate tasks. **No diagram where a short code block or small table is clearer.**
8. **Cross-link the sibling `xref:database/sql/…` and `xref:database/mongodb/…` pages** instead of restating
   relational or document-database theory — `xref:database/sql/dml-queries.adoc` beside SQL++ `SELECT`,
   `xref:database/sql/relations.adoc` beside joins, `xref:database/sql/normalization.adoc` beside
   embed-vs-reference, `xref:database/sql/transactions.adoc` and `xref:database/mongodb/transactions.adoc`
   beside Couchbase transactions, `xref:database/mongodb/indexes.adoc` beside GSI,
   `xref:database/mongodb/replication.adoc` / `sharding.adoc` beside clusters/XDCR,
   `xref:database/mongodb/change-streams.adoc` beside Eventing/DCP,
   `xref:database/mongodb/special-indexes-and-search.adoc` beside FTS. Specific cross-links are listed per task.
9. **No project-picker icon / `xref`** for Couchbase Reference — like SQL and MongoDB Reference it lives only
   under the root `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile; no
   `modules/ROOT/images/` picker icon.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    **static checked-in asset** at `modules/ROOT/attachments/couchbase-cheat-sheet.pdf`, linked via
    `xref:attachment$couchbase-cheat-sheet.pdf[Download the Couchbase Cheat Sheet (PDF)]`. Must be **exactly one
    A4 page** (page-count check + a rendered preview with no clipping). The HTML source is **not** checked in.
11. **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site
    with no application source; none of the installed `*-code-one-task` keys (`java`, `dotnet`, `database`)
    applies. Every task below is implemented directly, matching `.archive/implementation_plan_37.md`.
12. **No "related questions" / quiz page** — not this section's pattern; issue #45 does not ask for one.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root component for the
  "Irurueta Docs" site. The Couchbase section is entirely new `.adoc` files plus small wiring edits.
- **`antora-playbook.yml`** — wires the `ROOT` local component (`url: .`, `branches: HEAD`), the UI bundle,
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks, CDN `mermaid@11`),
  and `@djencks/asciidoctor-mathjax`. No `source-highlighter` is set. `build/` is gitignored. Build command:
  `npx antora antora-playbook.yml` (no lint/test suite; success = build completes with no `xref`/AsciiDoc/mermaid
  errors and `build/site` renders).
- **`modules/ROOT/nav.adoc`** — single nav tree. The Database Development block is:
  ```
  * Guides & References
  ** xref:database/index.adoc[Database Development]
  *** xref:database/sql/index.adoc[SQL Reference]
  **** … (12 **** lines) …
  *** xref:database/mongodb/index.adoc[MongoDB Reference]
  **** … (19 **** lines) …
  **** xref:database/mongodb/cheat-sheet.adoc[Cheat Sheet (PDF)]      ← last MongoDB line
  ** xref:web/index.adoc[Web Development]                              ← next sibling
  ```
  The new `*** xref:database/couchbase/index.adoc[Couchbase Reference]` block with its `****` page lines is
  inserted after the MongoDB `Cheat Sheet (PDF)` line and before the Web Development `**`.
- **`modules/ROOT/pages/database/index.adoc`** — `= Database Development`, a lead paragraph, and a `== Sections`
  list currently holding two bullets (SQL Reference, MongoDB Reference). Add a third for Couchbase Reference;
  update `:description:` / `:keywords:`.
- **`modules/ROOT/pages/index.adoc`** — the site home. `== Guides & References` (line 77) has a
  `* xref:database/index.adoc[Database Development]` bullet (line 81) with nested
  `** xref:database/sql/index.adoc[SQL Reference] -- …` (line 83) and
  `** xref:database/mongodb/index.adoc[MongoDB Reference] -- …` (line 85) sub-bullets. Add a third nested
  sub-bullet for Couchbase Reference after the MongoDB one; update the page `:keywords:`.
- **`modules/ROOT/partials/`** — one disclaimer partial per section. `mongodb-disclaimer.adoc` and
  `typescript-disclaimer.adoc` are the **"third variant"** (names the book(s), states they are *not* the
  primary/main reference, states they predate the current line, states the official docs win on any
  discrepancy). The new `couchbase-disclaimer.adoc` follows this variant.
- **`modules/ROOT/pages/database/mongodb/`** — 19 content pages + `index.adoc` + `cheat-sheet.adoc`. Page shape:
  `= Title` → `:description:` (one sentence) → `:keywords:` (comma list) → blank line →
  `include::partial$mongodb-disclaimer.adoc[]` → one/two-sentence lead → `==` sections. `index.adoc` = disclaimer
  include + lead + `== What's covered` (one bullet per page, grouped) + `== Bibliography`. `cheat-sheet.adoc` =
  disclaimer include + short intro + grouped `xref:` back-links + `xref:attachment$mongodb-cheat-sheet.pdf[…]`.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures, one prefix per section
  (`mongodb-*.svg`, `typescript-*.svg`, …), embedded with `image::<name>.svg[Alt text]`, authored for both
  light and dark themes.
- **`modules/ROOT/attachments/`** — flat directory of checked-in `*-cheat-sheet.pdf` files, linked with
  `xref:attachment$<name>.pdf[…]`. No HTML sources are checked in.
- **`.claude/agents/iru-gate-runner.md`** exists; there is no test/coverage/quality gate for a docs-only change,
  so the only verification is the Antora build (Task 21), which the implementer may run via a sub-agent to keep
  the main context clean.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma-separated list), a blank
  line, then `include::partial$couchbase-disclaimer.adoc[]`, then a one/two-sentence lead — identical placement
  to `include::partial$mongodb-disclaimer.adoc[]` in the MongoDB pages.
- **Brief, example-driven prose.** Every distinct concept on the page gets **at least one runnable example** in
  a plain `----` listing block (no `[source]` attribute) **and at least one `https://docs.couchbase.com/…`
  link** — in prose and/or as a comment in the example.
- **The books are never presented as the source.** No admonition or prose on any content page may describe a
  book as the primary/main reference or attribute the explanation to it. The books appear **only** in
  `index.adoc`'s `== Bibliography` (mirrored briefly on `cheat-sheet.adoc`) and in the disclaimer partial.
- **Diagrams**: `[mermaid]` for flow / sequence / state diagrams; hand-authored inline **SVG** under
  `modules/ROOT/images/` named `couchbase-*.svg` for the spatial figures in choice 7; **no diagram where a code
  block or small table is clearer.**
- **Cross-links**: `xref:database/sql/<page>.adoc[…]` and `xref:database/mongodb/<page>.adoc[…]` for the
  relational / document-database contrast (choice 8); link sibling Couchbase pages with
  `xref:database/couchbase/<page>.adoc[…]` rather than repeating material.
- Every page must be reachable from both `modules/ROOT/pages/database/couchbase/index.adoc` and
  `modules/ROOT/nav.adoc` once Group 4 lands.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Couchbase disclaimer partial — `modules/ROOT/partials/couchbase-disclaimer.adoc`
  - Files touched: `modules/ROOT/partials/couchbase-disclaimer.adoc` (new, 21 lines). Docs-only — no tests,
    coverage, or code-quality tooling applies; no license-header convention for `partials/*.adoc` (existing
    disclaimer partials start directly with `[IMPORTANT]`). Deferred Antora build is Task 21.
  - [x] Task 1.1. Author it as an `[IMPORTANT]` / `====` admonition following the **`mongodb-disclaimer.adoc` /
    `typescript-disclaimer.adoc` "third variant"** wording. It must state, in this order: (a) these pages
    document **the current Couchbase Server 7.6.x line** as published at
    https://docs.couchbase.com/server/current/[the Couchbase Server documentation], **which is the reference
    these pages are written and verified against**; no specific patch version is pinned, and some capabilities
    (Enterprise-Edition-only Analytics / auditing / encryption at rest / the Backup service / rack-zone
    awareness, and Capella-only App Services / Columnar) are **linked, not documented in depth**; (b) this
    content was generated with the assistance of AI and should be verified against
    https://docs.couchbase.com/[the official documentation] before being relied on in production, as Couchbase
    iterates quickly; (c) *Couchbase Essentials* (John Zablocki, Packt, 2015), *Pro Couchbase Development*
    (Deepak Vohra, Apress, 2015) and *Pro Couchbase Server*, 2nd ed. (David Ostrovsky, Mohammed Haji, Yaniv
    Rodenski, Apress, 2015) are listed in this section's bibliography and were consulted while preparing these
    pages — **none of them is the primary or main reference**, and all three **predate the current server
    line** (they target roughly Couchbase Server 3.x / 4.0, before scopes & collections, the SQL++ rename, the
    Query/Index/Search/Analytics/Eventing service split, GSI-over-Views, distributed ACID transactions, RBAC,
    synchronous-replication durability, the sub-document API, and Capella), so on any discrepancy the official
    documentation at https://docs.couchbase.com/[docs.couchbase.com] wins, and the difference is noted.
  - [x] Task 1.2. Confirm the include path is `include::partial$couchbase-disclaimer.adoc[]` (Antora resolves
    `partial$` to `modules/ROOT/partials/`) — this exact line is placed after the header on every page created
    in Groups 2–4. Confirmed: `partial$couchbase-disclaimer.adoc` resolves to the file created above.

### Group 2 — Content pages

**Parallelizable: yes** — 13 independent pages (Tasks 2–14). Each includes the Group 1 disclaimer partial and
only cross-links other pages by `xref:` (no page needs another Group 2 page's finished text). Each page also
authors any `couchbase-*.svg` figure it embeds. Consolidated validation for the group is the Task 21 Antora
build.

- [x] Task 2. Create `modules/ROOT/pages/database/couchbase/getting-started.adoc` — What Couchbase Server is &
  how to run it
  - [x] Task 2.1. Couchbase Server as a **distributed, memory-first JSON document database that is also a
    key-value store**; the document model vs. the relational model; where it fits and the trade-offs (flexible
    schema, horizontal scale, memory-first latency). Contrast `xref:database/sql/index.adoc[SQL Reference]` and
    `xref:database/mongodb/index.adoc[MongoDB Reference]`.
  - [x] Task 2.2. The **services model** and **Multi-Dimensional Scaling** — Data, Query, Index, Search,
    Analytics, Eventing, Backup services co-located or scaled independently. Embed
    `image::couchbase-services-mds.svg[…]` (Task 2.6).
  - [x] Task 2.3. **Editions & how you run it**: Enterprise vs. Community, and **Capella** (managed DBaaS);
    start a node with Docker or a native install; the **Web Console** (port 8091), the `cbq` shell, **Couchbase
    Shell (`cbsh`)**; load the `travel-sample` / `beer-sample` sample buckets.
  - [x] Task 2.4. What Couchbase is **not** (not only a cache; not schemaless in the "no rules" sense; not a
    drop-in SQL RDBMS).
  - [x] Task 2.5. Links in prose/examples: https://docs.couchbase.com/server/current/introduction/intro.html,
    https://docs.couchbase.com/server/current/learn/architecture-overview.html,
    https://docs.couchbase.com/server/current/learn/services-and-indexes/services/services.html,
    https://docs.couchbase.com/server/current/getting-started/start-here.html,
    https://docs.couchbase.com/server/current/tools/cbq-shell.html
  - [x] Task 2.6. Author `modules/ROOT/images/couchbase-services-mds.svg` — the six services distributed across
    a set of nodes (Multi-Dimensional Scaling); light/dark-theme safe.
- [x] Task 3. Create `modules/ROOT/pages/database/couchbase/buckets-scopes-collections.adoc` — Buckets, scopes
  & collections
  - [x] Task 3.1. The `bucket.scope.collection` **keyspace**; the `_default` scope and collection and the
    `_system` scope (7.6); a collection ≈ an RDBMS table, a scope ≈ a schema. Embed
    `image::couchbase-keyspace-hierarchy.svg[…]` (Task 3.5).
  - [x] Task 3.2. **Bucket types**: Couchbase vs. **Ephemeral** vs. (legacy) **Memcached**; bucket **RAM
    quota**, **replica count**, **bucket-level durability**, and **max-TTL**.
  - [x] Task 3.3. How the keyspace path appears in **SQL++** (`` `travel-sample`.inventory.airline ``) and in
    the **SDKs** (`cluster.bucket("travel-sample").scope("inventory").collection("airline")`); creating
    scopes/collections with `couchbase-cli` / SQL++ `CREATE SCOPE` / `CREATE COLLECTION`.
  - [x] Task 3.4. Links: https://docs.couchbase.com/server/current/learn/data/scopes-and-collections.html,
    https://docs.couchbase.com/server/current/learn/buckets-memory-and-storage/buckets-memory-and-storage.html,
    https://docs.couchbase.com/server/current/manage/manage-scopes-and-collections/manage-scopes-and-collections.html
  - [x] Task 3.5. Author `modules/ROOT/images/couchbase-keyspace-hierarchy.svg` —
    cluster → bucket → scope → collection → document beside the relational catalog → schema → table → row
    analogy.
- [x] Task 4. Create `modules/ROOT/pages/database/couchbase/documents-keys-and-metadata.adoc` — Documents,
  keys, metadata & expiration
  - [x] Task 4.1. An **item** = key + value + metadata. **Document keys**: UTF-8, ≤ 250 bytes; key-design
    patterns — predictable / composite keys, `counter`-generated keys, UUIDs; a short example each.
  - [x] Task 4.2. **Values**: JSON documents; **binary / non-JSON** values and their limits; the **20 MB**
    value-size limit.
  - [x] Task 4.3. **Metadata**: CAS, expiry, flags, seqno, `rev` — reached via `META()` in SQL++ and the SDK
    result object. **Extended Attributes** (system vs. user XATTRs) and why they exist.
  - [x] Task 4.4. **Expiration / TTL**: per-item TTL, **bucket max-TTL**, **collection TTL** (7.6), the expiry
    precedence rules, `preserveExpiry` (7.0+), `touch` / `getAndTouch`; **tombstones** and the **metadata purge
    interval**.
  - [x] Task 4.5. The SDK **data structures** (map / list / set / queue) layered over a single JSON document.
  - [x] Task 4.6. Links: https://docs.couchbase.com/server/current/learn/data/data.html,
    https://docs.couchbase.com/server/current/learn/data/document-data-model.html,
    https://docs.couchbase.com/server/current/learn/data/extended-attributes-fundamentals.html,
    https://docs.couchbase.com/server/current/learn/data/expiration.html
- [x] Task 5. Create `modules/ROOT/pages/database/couchbase/kv-and-subdocument-operations.adoc` — Key-value &
  sub-document operations
  - [x] Task 5.1. Connect: `Cluster` → `Bucket` → `Scope` → `Collection`; `insert` / `upsert` / `replace` /
    `get` / `remove`; `exists`; `getAndTouch`; the result shape and typed errors
    (`DocumentNotFoundException`, `DocumentExistsException`).
  - [x] Task 5.2. Atomic **counters** (`increment` / `decrement` with initial + delta); **`append` / `prepend`**
    on binary values; **KV Range Scan** (7.6); **bulk** and **async / reactive** variants.
  - [x] Task 5.3. **Sub-document API**: `lookupIn` / `mutateIn`, JSON **paths**, the per-path operations
    (`get`, `exists`, `upsert`, `insert`, `replace`, `remove`, `arrayAppend` / `arrayPrepend` /
    `arrayAddUnique` / `arrayInsert`, `increment`), `createPath`, operating on **XATTRs**; why it saves
    bandwidth versus fetch-modify-store.
  - [x] Task 5.4. Cross-link `xref:database/mongodb/crud-update-and-delete.adoc[MongoDB Updating & Deleting]`
    for the operator-update contrast.
  - [x] Task 5.5. Links: https://docs.couchbase.com/java-sdk/current/howtos/kv-operations.html,
    https://docs.couchbase.com/java-sdk/current/howtos/subdocument-operations.html,
    https://docs.couchbase.com/server/current/learn/data/data.html
- [x] Task 6. Create `modules/ROOT/pages/database/couchbase/concurrency-locking-and-durability.adoc` —
  Concurrency, locking & durable writes
  - [x] Task 6.1. **CAS** optimistic locking; the compare-and-swap **retry loop** (`get` → modify → `replace`
    with CAS → on `CasMismatchException`, retry). Embed a `[mermaid]` flowchart of the retry loop.
  - [x] Task 6.2. **Pessimistic** locking: `getAndLock` / `unlock`, the lock TTL, when to prefer it; the
    **CAS-as-ETag** pattern for HTTP APIs.
  - [x] Task 6.3. **Durable writes** / synchronous replication: `majority`, `majorityAndPersistToActive`,
    `persistToMajority`; how they supersede the observe-based `PersistTo` / `ReplicateTo` client durability the
    older books use. Embed a `[mermaid]` sequence of a `majority`-durable write (client → active → replicas →
    ack).
  - [x] Task 6.4. Cross-link `xref:database/mongodb/transactions.adoc[MongoDB single-document atomicity]` and
    `xref:database/mongodb/storage-and-durability.adoc[MongoDB write/read concern]`.
  - [x] Task 6.5. Links: https://docs.couchbase.com/java-sdk/current/howtos/concurrent-document-mutations.html,
    https://docs.couchbase.com/server/current/learn/data/durability.html,
    https://docs.couchbase.com/java-sdk/current/howtos/kv-operations.html#durability
- [x] Task 7. Create `modules/ROOT/pages/database/couchbase/data-modeling.adoc` — Document-oriented data
  modeling
  - [x] Task 7.1. **Embed vs. reference**: "data accessed together is stored together"; bounded vs. unbounded
    arrays (the 20 MB ceiling); read/write ratio; single-document atomicity. Embed
    `image::couchbase-embed-vs-reference.svg[…]` (Task 7.5).
  - [x] Task 7.2. **Key-based relationships** and relationship cardinality (1:1, 1:few, 1:many, many:many);
    modelling high-cardinality relationships without unbounded arrays.
  - [x] Task 7.3. **Normalization vs. denormalization** and the consistency cost of duplicated data;
    **collections as a first-class modeling tool** (a collection per entity type); **schema versioning** with a
    `type` / `schemaVersion` field. Cross-link `xref:database/sql/normalization.adoc[SQL Normalization]` and
    `xref:database/mongodb/data-modeling.adoc[MongoDB Schema Design]`.
  - [x] Task 7.4. **Anti-patterns**: massive arrays, oversized documents, one giant `_default` collection,
    unindexed case-insensitive lookups; **when not to use Couchbase**.
  - [x] Task 7.5. Author `modules/ROOT/images/couchbase-embed-vs-reference.svg` — a 1:N relationship embedded
    vs. referenced, side by side, with the "queried on its own? / unbounded?" decision.
  - [x] Task 7.6. Links: https://docs.couchbase.com/server/current/learn/data/document-data-model.html,
    https://www.couchbase.com/blog/couchbase-data-modeling/ (or the current data-modeling guide page under
    docs.couchbase.com if one exists at build time)
- [x] Task 8. Create `modules/ROOT/pages/database/couchbase/sql-plus-plus-querying.adoc` — Querying with SQL++
  (SELECT & joins)
  - [x] Task 8.1. **SQL++** (formerly N1QL): the **Query service**; how you run a query — `cbq`, the Query
    Workbench, the `/query/service` REST endpoint, the SDK `cluster.query(...)` / `scope.query(...)`;
    **keyspaces** and `USE KEYS`; how SQL++ generalises SQL to JSON (nested-path navigation, arrays, `MISSING`
    vs. `NULL`, heterogeneous results). Cross-link `xref:database/sql/dml-queries.adoc[SQL Queries (SELECT)]`.
  - [x] Task 8.2. `SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT / OFFSET`; `SELECT RAW` /
    `VALUE`; nested-path and array-subscript expressions; `UNNEST` and `NEST`.
  - [x] Task 8.3. **Joins**: `USE KEYS` lookup joins, **ANSI `JOIN` / `LEFT JOIN`**, index joins; join to the
    same or another keyspace. Cross-link `xref:database/sql/relations.adoc[SQL Relations]` and
    `xref:database/mongodb/aggregation-pipeline.adoc[MongoDB Aggregation ($lookup)]`.
  - [x] Task 8.4. `WITH` (common table expressions) and **recursive CTEs** (7.6) for hierarchy traversal;
    **subqueries**; `LET` / `LETTING`; collection operators (`ANY` / `EVERY` / `ARRAY` / `FIRST`).
  - [x] Task 8.5. Embed a `[mermaid]` flowchart of SQL++ query execution (parse → plan → index scan → fetch →
    filter/project).
  - [x] Task 8.6. Links: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/index.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/selectintro.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/join.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/nest.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/with.html
- [x] Task 9. Create `modules/ROOT/pages/database/couchbase/sql-plus-plus-dml-functions-transactions.adoc` —
  SQL++ data modification, functions & transactions
  - [x] Task 9.1. **DML**: `INSERT` / `UPSERT` / `UPDATE` / `DELETE` / `MERGE`; the `KEY` / `VALUE` clauses;
    `USE KEYS` targeting; `RETURNING`; `SET` / `UNSET` on nested paths and arrays. Cross-link
    `xref:database/sql/dml-modifications.adoc[SQL Data Modification]`.
  - [x] Task 9.2. **Functions**: scalar / aggregate / **window** functions, `ARRAY_*` and `OBJECT_*` functions,
    date / string / number / type / conditional functions, `META()`, `SEARCH()` / `SEARCH_SCORE()`;
    **user-defined functions** (inline SQL++ and external JavaScript). Cross-link
    `xref:database/sql/functions.adoc[SQL Built-in Functions]` and
    `xref:database/sql/aggregate-window-functions.adoc[SQL Aggregate & Window Functions]`.
  - [x] Task 9.3. **Distributed ACID transactions**: the SDK `transactions.run(ctx -> …)` lambda API and the
    SQL++ `BEGIN` / `SET TRANSACTION` / `COMMIT` / `ROLLBACK` / `SAVEPOINT` statements; **Read Committed**
    isolation; how it works (Active Transaction Records, mutations staged in XATTRs, the atomic commit point);
    durability levels inside a transaction; limits (document < 10 MB, NTP-synced nodes, single-node replica
    caveat). Explicitly contrast the older books' hand-rolled two-phase commit. Embed a `[mermaid]` state
    diagram of the ATR / transaction lifecycle. Cross-link `xref:database/sql/transactions.adoc[SQL
    Transactions]` and `xref:database/mongodb/transactions.adoc[MongoDB Transactions]`.
  - [x] Task 9.4. Links: https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/dml.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/functions.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/windowfunctions.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/userfun.html,
    https://docs.couchbase.com/server/current/learn/data/transactions.html
- [x] Task 10. Create `modules/ROOT/pages/database/couchbase/indexes-and-views.adoc` — Indexing with the Index
  service (and legacy Views)
  - [x] Task 10.1. The **Index service** and **Global Secondary Indexes (GSI)**: the **primary index** (and why
    it is development-only); secondary indexes; **composite** indexes; **partial** (`WHERE`-clause) indexes;
    **array indexing** (`DISTINCT ARRAY … FOR … IN … END`); **adaptive** indexes; **covering** indexes;
    **partitioned** indexes and index replicas; deferred build (`BUILD INDEX`). Embed
    `image::couchbase-gsi-scan.svg[…]` (Task 10.4).
  - [x] Task 10.2. **`EXPLAIN`** and **`ADVISE`**; the **cost-based optimizer** and `UPDATE STATISTICS`;
    `IndexScan` vs. `PrimaryScan`, covering vs. fetch. Cross-link
    `xref:database/mongodb/indexes.adoc[MongoDB Indexing]`.
  - [x] Task 10.3. **Legacy MapReduce Views** (design documents, `map` / `reduce`, `stale` / consistency,
    spatial views) — documented **briefly** and explicitly framed as **deprecated in favour of GSI + SQL++**,
    retained only for reading and upgrading pre-4.x applications. This is the area the bibliography books lean
    on most; the page states plainly that the current documentation supersedes them here.
  - [x] Task 10.4. Author `modules/ROOT/images/couchbase-gsi-scan.svg` — predicate → index scan on the Index
    service → key + doc-id → document fetch on the Data service.
  - [x] Task 10.5. Links:
    https://docs.couchbase.com/server/current/learn/services-and-indexes/indexes/global-secondary-indexes.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/createindex.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/indexing-arrays.html,
    https://docs.couchbase.com/server/current/n1ql/n1ql-language-reference/cost-based-optimizer.html,
    https://docs.couchbase.com/server/current/learn/views/views-intro.html
- [x] Task 11. Create `modules/ROOT/pages/database/couchbase/search-analytics-eventing.adoc` — Full-Text &
  Vector Search, Analytics, Eventing
  - [x] Task 11.1. The **Search service (FTS)**: search indexes and index definitions, **analyzers**
    (tokenizers, token filters, languages), the query types (match, match-phrase, prefix, fuzzy, wildcard,
    regexp, term, numeric / date range, geo, boolean, conjunction / disjunction, query-string), relevance
    **scoring**, index **partitions** and **replicas**, `SEARCH()` / `SEARCH_SCORE()` from SQL++;
    **Vector Search** and **hybrid search** (7.6) for embeddings / semantic search / RAG. Cross-link
    `xref:database/mongodb/special-indexes-and-search.adoc[MongoDB Text & Atlas Search]`.
  - [x] Task 11.2. The **Analytics service** (Enterprise): shadow datasets / analytical collections
    (`CREATE DATASET`), the SQL++ for Analytics dialect vs. the Query service, the **columnar** engine and
    **MPP** execution, `CREATE ANALYTICS INDEX`, `CREATE LINK`; when to reach for it. Overview + link depth for
    **Enterprise Analytics** / **Capella Columnar**. Cross-link
    `xref:database/sql/aggregate-window-functions.adoc[SQL Aggregate & Window Functions]`.
  - [x] Task 11.3. The **Eventing service**: JavaScript **Functions**, the `OnUpdate` / `OnDelete` handlers,
    **bucket bindings**, **timers**, **cURL bindings**, the **feed boundary** and deployment lifecycle; typical
    uses (enrichment, cascade delete, notifications, denormalized-view maintenance); **DCP** as the lower-level
    change stream. Cross-link `xref:database/mongodb/change-streams.adoc[MongoDB Change Streams]`.
  - [x] Task 11.4. Links: https://docs.couchbase.com/server/current/fts/fts-introduction.html,
    https://docs.couchbase.com/server/current/fts/fts-query-types.html,
    https://docs.couchbase.com/server/current/vector-search/vector-search.html,
    https://docs.couchbase.com/server/current/analytics/introduction.html,
    https://docs.couchbase.com/server/current/eventing/eventing-overview.html
- [x] Task 12. Create `modules/ROOT/pages/database/couchbase/clusters-replication-and-xdcr.adoc` — Clusters,
  replication, failover & XDCR
  - [x] Task 12.1. **Nodes**, per-node **service** placement and Multi-Dimensional Scaling; the **1024
    vBuckets** and the **cluster map**; the **smart client** and the `couchbase://` connection string; adding /
    removing nodes; **rebalance** and **swap rebalance**; sizing (RAM / storage / CPU / node count). Embed
    `image::couchbase-vbucket-map.svg[…]` (Task 12.5).
  - [x] Task 12.2. **Intra-cluster replication** via **DCP**; active vs. replica vBuckets and `numReplicas`;
    reading from replicas (`getAnyReplica` / `getAllReplicas`).
  - [x] Task 12.3. **Failover**: automatic vs. graceful vs. hard; the auto-failover quorum and count;
    **Server Group (rack-zone) awareness**. Cross-link `xref:database/mongodb/replication.adoc[MongoDB Replica
    Sets]`.
  - [x] Task 12.4. **XDCR** (Cross Data Center Replication): unidirectional and bidirectional, replication
    **topologies**, **filter expressions**, **conflict resolution** (revision-ID / sequence vs.
    timestamp / LWW), XDCR with mobile, monitoring inbound / outbound. Embed
    `image::couchbase-xdcr-topology.svg[…]` (Task 12.6). Cross-link
    `xref:database/mongodb/sharding.adoc[MongoDB Sharding]` for the horizontal-scale contrast.
  - [x] Task 12.5. Author `modules/ROOT/images/couchbase-vbucket-map.svg` — 1024 vBuckets (active + replica)
    spread across nodes with the cluster map.
  - [x] Task 12.6. Author `modules/ROOT/images/couchbase-xdcr-topology.svg` — two clusters, unidirectional and
    bidirectional replication.
  - [x] Task 12.7. Links:
    https://docs.couchbase.com/server/current/learn/clusters-and-availability/clusters-and-availability.html,
    https://docs.couchbase.com/server/current/learn/clusters-and-availability/rebalance.html,
    https://docs.couchbase.com/server/current/learn/clusters-and-availability/automatic-failover.html,
    https://docs.couchbase.com/server/current/learn/clusters-and-availability/groups.html,
    https://docs.couchbase.com/server/current/learn/clusters-and-availability/xdcr-overview.html
- [x] Task 13. Create `modules/ROOT/pages/database/couchbase/storage-security-and-administration.adoc` —
  Storage internals, security & administration
  - [x] Task 13.1. **Storage & internals**: the **managed cache** (memory-first design, working-set management
    / ejection), the append-only **Couchstore** engine and the **Magma** engine for large datasets,
    **ephemeral** buckets, **compaction** and auto-compaction, the **disk write queue**, **DCP** (superseding
    **TAP**), **tombstones** and the metadata purge interval, **server warm-up**. Embed a `[mermaid]` flowchart:
    managed cache → disk write queue → storage engine, with DCP fanning out to replicas / GSI / Search /
    Analytics / XDCR. Cross-link `xref:database/mongodb/storage-and-durability.adoc[MongoDB WiredTiger]`.
  - [x] Task 13.2. **Security**: **RBAC** (users, groups, roles, privileges, built-in roles); local vs.
    external authentication (**LDAP**, **PAM**, **SAML SSO**); client **X.509** certificates; **TLS** and
    node-to-node encryption; **encryption at rest**; **auditing**; network / port hardening; the `_system`
    scope. A **security checklist** as the summary. Cross-link `xref:database/mongodb/security.adoc[MongoDB
    Security]`.
  - [x] Task 13.3. **Administration & tooling**: the **Web Console**, the **REST API**, `couchbase-cli`, `cbq`,
    **Couchbase Shell (`cbsh`)**; the **Backup service** and `cbbackupmgr` (noting the deprecated `cbbackup` /
    `cbrestore` / `cbtransfer` tools the older books use); `cbimport` / `cbexport`; monitoring
    (`/pools/default`, the stats REST API, `cbstats`, the Prometheus metrics endpoint), logs and alerts; an
    **Autonomous Operator** (Kubernetes) overview + link. Cross-link
    `xref:database/mongodb/administration-and-monitoring.adoc[MongoDB Administration]`.
  - [x] Task 13.4. Links:
    https://docs.couchbase.com/server/current/learn/buckets-memory-and-storage/storage-engines.html,
    https://docs.couchbase.com/server/current/learn/security/security-overview.html,
    https://docs.couchbase.com/server/current/learn/security/authorization-overview.html,
    https://docs.couchbase.com/server/current/manage/manage-backup-and-restore/manage-backup-and-restore.html,
    https://docs.couchbase.com/server/current/cli/cli-intro.html,
    https://docs.couchbase.com/operator/current/overview.html
- [x] Task 14. Create `modules/ROOT/pages/database/couchbase/sdks-and-mobile.adoc` — SDKs, connectors &
  Couchbase Mobile
  - [x] Task 14.1. The **SDK family** (Java, .NET, Node.js, Python, Go, C, PHP, Ruby, Scala, Kotlin); the
    shared API surface; the **connection string** and `ClusterOptions` / cluster environment; the **singleton
    `Cluster`** and connection pooling; timeouts and the retry / error model.
  - [x] Task 14.2. The big-data **connectors** (Kafka, Spark, Elasticsearch) — noting that the manual
    Elasticsearch integration in the older books is superseded by the Elasticsearch connector and the built-in
    Search service.
  - [x] Task 14.3. **Couchbase Mobile** — **Couchbase Lite** (the embedded database; CRUD; **SQL++** and the
    `QueryBuilder` API; on-device full-text and **vector** search; the replicator configuration), **Sync
    Gateway** (**channels**, the **sync function**, access control and authentication, replication and
    **Delta Sync**), **Capella App Services**, **Edge Server**, and **peer-to-peer** sync — documented as an
    **overview + links** (the mobile stack is a large surface of its own).
  - [x] Task 14.4. Links: https://docs.couchbase.com/home/sdk.html,
    https://docs.couchbase.com/java-sdk/current/howtos/managing-connections.html,
    https://docs.couchbase.com/couchbase-lite/current/index.html,
    https://docs.couchbase.com/sync-gateway/current/introduction.html,
    https://docs.couchbase.com/couchbase-edge-server/current/introduction/intro.html

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 16 renders the PDF that Task 15's page links, and Task 15's back-links reference
the Group 2 page titles. Depends on Group 2.

- [x] Task 15. Create `modules/ROOT/pages/database/couchbase/cheat-sheet.adoc`
  - [x] Task 15.1. Header + `include::partial$couchbase-disclaimer.adoc[]` + a short intro sentence, then
    grouped `xref:` back-links to every Group 2 page (grouped as in the section index), following the shape of
    `modules/ROOT/pages/database/mongodb/cheat-sheet.adoc`.
  - [x] Task 15.2. A one-line note that the three books are listed in the section's bibliography and are not the
    primary reference (mirroring the MongoDB cheat sheet's equivalent line).
  - [x] Task 15.3. End with `xref:attachment$couchbase-cheat-sheet.pdf[Download the Couchbase Cheat Sheet
    (PDF)]`.
- [x] Task 16. Build `modules/ROOT/attachments/couchbase-cheat-sheet.pdf`
  - [x] Task 16.1. In a scratch location, hand-build a print-ready single-page HTML/CSS layout — colour-coded
    boxes summarising: the `cbq` / `couchbase-cli` one-liners and the connection string; the
    `bucket.scope.collection` keyspace; the KV API (`insert`/`upsert`/`replace`/`get`/`remove`, counters,
    `getAndLock`); the sub-document ops; CAS retry + the three durability levels; a SQL++ `SELECT` / `JOIN` /
    DML skeleton and `WITH`; `CREATE INDEX` forms (composite, partial, array, covering) + `EXPLAIN` / `ADVISE`;
    the FTS query types + `SEARCH()`; an Eventing `OnUpdate` skeleton; the transaction skeleton
    (`transactions.run` / `BEGIN…COMMIT`); rebalance / failover / XDCR one-liners; and an "embed vs. reference"
    decision strip.
  - [x] Task 16.2. Render to PDF with headless Chrome
    (`--headless --print-to-pdf --no-pdf-header-footer`), verify it is **exactly one A4 page** (page-count
    check) and a rendered preview shows no clipping, then copy the PDF to
    `modules/ROOT/attachments/couchbase-cheat-sheet.pdf`. Do **not** check in the HTML source.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 17–20 each edit a shared wiring file and Task 21 builds on all prior groups;
the build must run last.

- [x] Task 17. Create `modules/ROOT/pages/database/couchbase/index.adoc`
  - [x] Task 17.1. Header (`= Couchbase Reference`, `:description:`, `:keywords:`) +
    `include::partial$couchbase-disclaimer.adoc[]` + a lead paragraph introducing Couchbase and pointing new
    readers to `getting-started.adoc` first.
  - [x] Task 17.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped
    (Getting started / Data & modeling / Querying — SQL++ / Indexing / Search, Analytics & Eventing /
    Distributed architecture & operations / SDKs & Mobile / Cheat sheet).
  - [x] Task 17.3. `== Bibliography` — list https://docs.couchbase.com/server/current/ as the source every page
    is verified against (with the specific sub-site links: Learn/architecture, Data, scopes & collections,
    services, SQL++ language reference, FTS, Analytics, Eventing, clusters & availability, XDCR, storage
    engines, security, CLI/REST/tools, SDKs, Couchbase Mobile), then the three books as consulted bibliography
    entries, each with author/publisher/year/ISBN and its **publisher's book page** and **publisher home**:
    - *Couchbase Essentials*, John Zablocki, Packt Publishing, 2015, ISBN 978-1-78439-449-3 —
      https://www.packtpub.com/product/couchbase-essentials/9781784394493 · https://www.packtpub.com/
    - *Pro Couchbase Development*, Deepak Vohra, Apress, 2015, ISBN 978-1-4842-1435-0 —
      https://link.springer.com/book/10.1007/978-1-4842-1434-3 · https://www.apress.com/
    - *Pro Couchbase Server*, 2nd ed., David Ostrovsky, Mohammed Haji, Yaniv Rodenski, Apress, 2015, ISBN
      978-1-4842-1186-1 — https://link.springer.com/book/10.1007/978-1-4842-1185-4 · https://www.apress.com/
    - A closing sentence: the books target roughly Couchbase Server 3.x / 4.0, are consulted bibliography
      references only, and are **not** the primary reference for the section.
- [x] Task 18. Wire `modules/ROOT/nav.adoc`
  - [x] Task 18.1. Insert a `*** xref:database/couchbase/index.adoc[Couchbase Reference]` block with one `****`
    line per page (in the section-index order), **after** the MongoDB block's
    `**** xref:database/mongodb/cheat-sheet.adoc[Cheat Sheet (PDF)]` line and **before**
    `** xref:web/index.adoc[Web Development]`. Last `****` line is
    `xref:database/couchbase/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 19. Update `modules/ROOT/pages/database/index.adoc`
  - [x] Task 19.1. Add a third `== Sections` bullet:
    `xref:database/couchbase/index.adoc[Couchbase Reference] -- the distributed JSON document & key-value
    database: buckets/scopes/collections, the KV and sub-document APIs, SQL++ querying, GSI indexing, Full-Text
    & Vector Search, Analytics and Eventing, clustering/replication/XDCR, storage, security, the SDKs and
    Couchbase Mobile, plus a downloadable one-page cheat sheet.`
  - [x] Task 19.2. Update the page `:description:` and `:keywords:` to mention Couchbase / SQL++ / key-value.
- [x] Task 20. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 20.1. Add a third nested sub-bullet under Database Development (after the MongoDB Reference line,
    ~line 85): `** xref:database/couchbase/index.adoc[Couchbase Reference] -- the distributed document &
    key-value database: SQL++, buckets/scopes/collections, indexing, search, eventing, clustering and XDCR,
    plus a one-page cheat sheet.`
  - [x] Task 20.2. Update the page `:keywords:` to include Couchbase.
- [x] Task 21. Build & verify
  - [x] Task 21.1. Run `npx antora antora-playbook.yml` (optionally via an `iru-gate-runner` / generic
    sub-agent to keep the main context clean). Fix any `xref` / AsciiDoc / missing-image / mermaid warnings
    introduced by the new pages until the build completes clean.
  - [x] Task 21.2. Confirm every new page is reachable from both
    `modules/ROOT/pages/database/couchbase/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/database/couchbase/…` HTML renders (spot-check a page with a mermaid diagram and one with an
    SVG), and that `xref:attachment$couchbase-cheat-sheet.pdf` resolves to the checked-in PDF.
  - [x] Task 21.3. Re-open `modules/ROOT/attachments/couchbase-cheat-sheet.pdf` and confirm it is a single A4
    page with no clipped content.
