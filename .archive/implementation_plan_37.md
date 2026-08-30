# Implementation Plan: Database Development / MongoDB Reference

## Task summary

Source: GitHub issue #37

Issue [#37](https://github.com/albertoirurueta/docs/issues/37) ("MongoDB Reference") asks to add a new
**"MongoDB Reference"** subsection under the existing **Guides & References / Database Development** section of
this repo's own `ROOT` Antora component, at `modules/ROOT/pages/database/mongodb/` — the first sibling of the
existing `database/sql/` subsection. It documents **MongoDB** as a database-developer reference — the
document / BSON data model, databases & collections and schema control, the CRUD / Query API, indexing and
search, the aggregation pipeline, schema design for the document model, multi-document transactions and change
streams, replication and sharding, the WiredTiger storage engine and durability, security, administration &
monitoring, backup & data tools, and the drivers & tooling — plus a one-page downloadable PDF cheat sheet.
Content is written and verified against **the MongoDB 8.x Server Manual** at
https://www.mongodb.com/docs/manual/. Explanations must be brief and example-driven; **every concept carries at
least one runnable example** (`[source,javascript]` for `mongosh` / Query API code, `[source,json]` for
documents / results, `[source,bash]` for command lines, `[source,yaml]` for `mongod.conf`, `[source,console]`
for shell transcripts) and **at least one link to the specific https://www.mongodb.com/docs/manual/ page** (or
`docs/…` entry) it documents. `[mermaid]` diagrams and hand-authored inline **SVG** figures (under
`modules/ROOT/images/`, named `mongodb-*.svg`) are used **only where a diagram genuinely helps** — never where a
short code block or small table is clearer.

One PDF book was consulted while planning this section — *MongoDB: The Definitive Guide — Powerful and Scalable
Data Storage*, 3rd ed. (Shannon Bradshaw, Eoin Brazil, Kristina Chodorow, O'Reilly Media, December 2019, ISBN
978-1-491-95446-1; targets roughly **MongoDB 4.0 / 4.2**). It is cited **only as a bibliography entry**, never
as the "primary" or "main" reference (matching the SQL / Angular / ASP.NET / Tailwind disclaimers' "third
variant" wording, and unlike the jQuery / React ones). https://www.mongodb.com/docs/manual/ is the source every
page is written and verified against; the book **predates the current server line**, so where the book and the
current manual disagree — `mongosh` replacing the legacy `mongo` shell, multi-document transactions on sharded
clusters, time series & clustered collections, `$merge` / `$unionWith` / `$setWindowFields`, resharding /
shard-key refining, Atlas Search & Atlas Vector Search, Queryable Encryption, OIDC authentication, the removal
of MMAPv1, the deprecation of standalone map-reduce, etc. — **the official documentation wins** and the
difference is noted. Documentation prose is original explanation verified against the official manual, **not**
presented as derived from the book; the book appears only in `== Bibliography` and the disclaimer's "consulted
while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, Tailwind, and TypeScript reference sections. The closest structural precedents are
[.archive/implementation_plan_35.md](.archive/implementation_plan_35.md) (issue #35, "TypeScript Reference") — a
new reference subsection grounded in an official doc site plus a bibliography-only O'Reilly book that predates
the current version, with mermaid diagrams, hand-authored SVG figures, a `== Bibliography`, and a
headless-Chrome-rendered one-page PDF cheat sheet, organised into four task groups — and
[.archive/implementation_plan_3.md](.archive/implementation_plan_3.md) / `_5.md` (issues #3 / #5, "SQL
Reference"), which established the `database/index.adoc` + `database/sql/` + `sql-disclaimer.adoc` +
`sql-cheat-sheet.pdf` shape this new subsection mirrors as its first sibling.

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's pattern and the issue text — stated here so they can be challenged during review)

1. **Document the current MongoDB 8.x server line as published at https://www.mongodb.com/docs/manual/**, not
   pinned to a patch version. Examples use modern idioms: `mongosh` (not the legacy `mongo` shell),
   `insertOne` / `insertMany` / `updateOne` / `deleteOne` (not the removed `insert` / bare `update` / `remove`),
   `countDocuments` (not `count`), `w: "majority"` write concern, `readConcern` levels, `session.withTransaction`,
   the current aggregation stage set (`$merge` / `$unionWith` / `$setWindowFields` / `$documents` included),
   `$vectorSearch` / Atlas Search mentioned as Atlas-only, resharding and shard-key refining noted. Where the
   book uses an older pattern, the page documents the current approach and notes the change.
2. **Page breakdown: 19 content pages + 1 cheat sheet + 1 section index (21 `.adoc` files).** Issue #37's
   suggested page list is followed **as-is** — every page maps to a distinct top-level area of the official
   manual. No merges or splits are applied. Atlas-only capabilities (Atlas Search, Atlas Vector Search, Atlas
   backup, Queryable Encryption KMS setup) are covered as **overview + link**, not documented in depth, on the
   pages the issue assigns them to.
3. **The book is promoted to bibliography-only.** Neither the disclaimer nor any per-page admonition describes it
   as the primary or main reference; it appears only as a `== Bibliography` entry and in the disclaimer's
   "consulted while preparing these pages" clause. Documentation prose is original explanation verified against
   the official manual.
4. **The subsection is named "MongoDB Reference"** in the section index title, the `database/index.adoc` bullet,
   the `nav.adoc` `***` entry, and the root `index.adoc` bullet — matching the existing "SQL Reference" sibling.
5. **Placed after "SQL Reference"**, as the second subsection of Database Development, in `nav.adoc`,
   `database/index.adoc`, and the root `index.adoc` — the same "append in the order added" ordering every prior
   subsection followed.
6. **Mermaid is the default for flow / sequence / state / architecture diagrams; eight hand-authored SVGs**
   where a spatial figure is clearer than a flowchart (all named `mongodb-*.svg` under `modules/ROOT/images/`,
   authored to render in both the light and dark site themes like the existing `*.svg` figures):
   `mongodb-document-hierarchy.svg` (database → collection → document → field beside the relational
   database → table → row → column analogy), `mongodb-bson-document.svg` (an annotated BSON document with an
   embedded document and an array of embedded documents, callouts on `_id` / `ObjectId` and dot-notation paths),
   `mongodb-compound-index-esr.svg` (compound-index key order: equality prefix → sort → range),
   `mongodb-embed-vs-reference.svg` (a 1:N relationship embedded vs. referenced, side by side, with the
   "queried on its own? / unbounded array?" decision), `mongodb-replica-set-topology.svg` (primary + two
   secondaries + heartbeats, and the failover / election transition), `mongodb-sharded-cluster.svg`
   (app → `mongos` → shards, each a replica set, + the config-server replica set),
   `mongodb-chunk-balancer.svg` (chunk splitting and the balancer moving chunks toward an even distribution),
   and `mongodb-shard-key-distribution.svg` (ranged vs. hashed distribution of an ascending key). Mermaid
   covers: the `w: "majority"` write-acknowledgement path (sequence), an aggregation pipeline as documents
   flowing through `$match → $group → $sort → $merge` (flowchart), `explain()` plan selection (flowchart),
   initial sync + oplog tailing (sequence), the WiredTiger cache → checkpoint + journal → disk path
   (flowchart), the transaction lifecycle (state diagram), and the CSFLE / Queryable Encryption data flow
   (sequence). The implementer may add or drop a `mongodb-*.svg` / `[mermaid]` figure while writing a page if it
   changes the value — not re-planned as separate tasks. **No diagram where a short code block or small table is
   clearer.**
7. **Cross-link the sibling xref:database/sql/[…] pages instead of restating relational theory** —
   `xref:database/sql/dml-queries.adoc[Queries (SELECT)]` beside `find` / aggregation,
   `xref:database/sql/normalization.adoc[Normalization]` beside embed-vs-reference,
   `xref:database/sql/transactions.adoc[Transactions]` beside MongoDB transactions,
   `xref:database/sql/aggregate-window-functions.adoc[Aggregate & Window Functions]` beside `$group` /
   `$setWindowFields`. Specific cross-links are listed per task below.
8. **No "quiz" / "related questions" page** — that is not this section's pattern (the jQuery section carried one
   only because its issue explicitly asked for it). Issue #37 does not ask for one.
9. **No project-picker icon / `xref`** for MongoDB Reference — like SQL Reference it lives only under the root
   `index.adoc`'s `== Guides & References` list, not as a remote-component picker tile, and there is no
   `modules/ROOT/images/` picker icon for it.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    **static checked-in asset** at `modules/ROOT/attachments/mongodb-cheat-sheet.pdf`, linked via
    `xref:attachment$mongodb-cheat-sheet.pdf[Download the MongoDB Cheat Sheet (PDF)]`. The cheat sheet must be
    **exactly one A4 page** (page-count check + a rendered preview with no clipping). The HTML source is **not**
    checked in — no prior section checks in its cheat-sheet HTML source, only the rendered PDF lands in
    `modules/ROOT/attachments/`. Build it in a scratch location, render, verify, copy the PDF into place.
11. **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site
    with no application source; there is no `*-code-one-task` key that applies (`iru-database-code-one-task` is
    for database *code*, not docs). Every task below is implemented directly, matching how
    `.archive/implementation_plan_35.md` (also pure docs) was structured.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root component for the
  "Irurueta Docs" site. The MongoDB section is entirely new `.adoc` files plus small wiring edits.
- **`antora-playbook.yml`** — wires the `ROOT` local component (`url: .`, `branches: HEAD`), the `ui-bundle`,
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks, CDN
  `mermaid@11`), and `@djencks/asciidoctor-mathjax`. No `source-highlighter` is set in the playbook; the UI
  bundle handles highlighting client-side. `build/` is gitignored. Build command: `npx antora
  antora-playbook.yml` (no lint/test suite; success = build completes with no `xref`/AsciiDoc errors and
  `build/site` renders).
- **`modules/ROOT/nav.adoc`** — single nav tree. The Database Development block is:
  ```
  * Guides & References
  ** xref:database/index.adoc[Database Development]
  *** xref:database/sql/index.adoc[SQL Reference]
  **** xref:database/sql/ddl.adoc[DDL]
  … (10 more **** lines) …
  **** xref:database/sql/cheat-sheet.adoc[Cheat Sheet (PDF)]        ← line 30
  ** xref:web/index.adoc[Web Development]                            ← line 31
  ```
  The new `*** xref:database/mongodb/index.adoc[MongoDB Reference]` block with its `****` page lines is inserted
  between current line 30 and current line 31 (after the SQL cheat-sheet line, before the Web Development `**`).
- **`modules/ROOT/pages/database/index.adoc`** — `= Database Development`, a lead paragraph, and a `== Sections`
  list currently holding one bullet (`xref:database/sql/index.adoc[SQL Reference] -- …`). Add a second bullet
  for MongoDB Reference; update `:description:` / `:keywords:` (currently SQL-only).
- **`modules/ROOT/pages/index.adoc`** — the site home. Its `== Guides & References` section has a
  `* xref:database/index.adoc[Database Development]` bullet with one nested `** xref:database/sql/index.adoc[SQL
  Reference] -- …` sub-bullet. Add a second nested sub-bullet for MongoDB Reference after the SQL one; update the
  page `:keywords:`.
- **`modules/ROOT/partials/`** — one disclaimer partial per section (`sql-disclaimer.adoc`,
  `tailwind-disclaimer.adoc`, `typescript-disclaimer.adoc`, …). `sql-disclaimer.adoc` is a bare `[IMPORTANT] …
  ====` admonition included as the first line after the header on every SQL page. The new
  `mongodb-disclaimer.adoc` follows the **Tailwind / TypeScript "third variant"** wording (names the book,
  states it is *not* the primary/main reference, states it predates the current line, states the official docs
  win on any discrepancy).
- **`modules/ROOT/pages/database/sql/`** — 12 content pages + `index.adoc` + `cheat-sheet.adoc`. Page shape:
  `= Title` → `:description:` (one sentence) → `:keywords:` (comma list) → blank line →
  `include::partial$sql-disclaimer.adoc[]` → one/two-sentence lead → `==` sections. `cheat-sheet.adoc` is the
  disclaimer include + a short intro + grouped `xref:` back-links + `xref:attachment$sql-cheat-sheet.pdf[Download
  the SQL Cheat Sheet (PDF)]`. `index.adoc` is the disclaimer include + lead + `== What's covered` (one bullet
  per page) + `== Bibliography`.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures, one prefix per section
  (`typescript-*.svg`, `aspnet-*.svg`, `angular-*.svg`, …), embedded with `image::<name>.svg[Alt text]`. They
  are authored to work in both light and dark themes.
- **`modules/ROOT/attachments/`** — flat directory of checked-in `*-cheat-sheet.pdf` files (`sql-cheat-sheet.pdf`,
  `typescript-cheat-sheet.pdf`, …), linked with `xref:attachment$<name>.pdf[…]`. No HTML sources are checked in.
- **Source-block languages already in use across the site**: `[source,sql]`, `[source,ts]`, `[source,js]`,
  `[source,json]`, `[source,bash]`, `[source,console]`, `[source,tsx]`. `javascript`, `json`, `bash`, `yaml`,
  `console` all highlight cleanly under the UI bundle's highlighter; the final build (Task 25) must come back
  with no new AsciiDoc/highlighter warnings — if `[source,yaml]` or `[source,console]` ever warns, fall back to
  `[source,text]` for that block.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma-separated list), a blank
  line, then `include::partial$mongodb-disclaimer.adoc[]`, then a one/two-sentence lead — identical placement to
  `include::partial$sql-disclaimer.adoc[]` in `modules/ROOT/pages/database/sql/ddl.adoc`.
- **Brief, example-driven prose.** Every distinct concept on the page gets **at least one runnable snippet** and
  **at least one `https://www.mongodb.com/docs/manual/…` (or `docs/…`) link** — in prose and/or as a comment in
  the example.
- **The book is never presented as the source.** No admonition or prose on any content page may describe the
  book as the primary/main reference or attribute the explanation to it. The book appears **only** in
  `index.adoc`'s `== Bibliography` (mirrored briefly on `cheat-sheet.adoc`) and in the disclaimer partial.
- **Source blocks**: `[source,javascript]` for `mongosh` / Query API code, `[source,json]` for documents and
  query results, `[source,bash]` for `mongod` / `mongosh` / `mongodump` / `mongoimport` command lines,
  `[source,yaml]` for `mongod.conf`, `[source,console]` for shell session transcripts where the prompt matters.
- **Diagrams**: `[mermaid]` for flow / sequence / state / architecture diagrams; hand-authored inline **SVG**
  under `modules/ROOT/images/` named `mongodb-*.svg` for the spatial figures listed in choice 6; **no diagram
  where a code block or small table is clearer.**
- **Cross-links**: use `xref:database/sql/<page>.adoc[…]` for the relational contrast where it helps (per choice
  7); link sibling MongoDB pages with `xref:database/mongodb/<page>.adoc[…]` rather than repeating material.
- Every page must be reachable from both `modules/ROOT/pages/database/mongodb/index.adoc` and
  `modules/ROOT/nav.adoc` once Group 4 lands.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the MongoDB disclaimer partial — `modules/ROOT/partials/mongodb-disclaimer.adoc`
  - Files touched: `modules/ROOT/partials/mongodb-disclaimer.adoc` (new). Docs-only change — no tests, no
    coverage, no code-quality tooling applies; the Antora build in Group 4 (Task 25) is the only verification.
  - [x] Task 1.1. Create `modules/ROOT/partials/mongodb-disclaimer.adoc` as an `[IMPORTANT]` / `====`
    admonition, following the **`tailwind-disclaimer.adoc` / `typescript-disclaimer.adoc` "third variant"**
    wording. It must state, in this order: (a) these pages document **the current MongoDB 8.x server line** as
    published at https://www.mongodb.com/docs/manual/[the MongoDB Server Manual], **which is the reference these
    pages are written and verified against**; no specific patch version is pinned, and some capabilities
    (Atlas Search, Atlas Vector Search, parts of encryption/backup) are **Atlas-only** and are linked, not
    documented in depth; (b) this content was generated with the assistance of AI and should be verified against
    https://www.mongodb.com/docs/manual/[the official manual] before being relied on in production, as MongoDB
    iterates quickly; (c) *MongoDB: The Definitive Guide*, 3rd ed. (Shannon Bradshaw, Eoin Brazil, Kristina
    Chodorow, O'Reilly, 2019) is listed in this section's bibliography and was consulted while preparing these
    pages — **it is not the primary or main reference**, and it **predates the current server line** (it targets
    roughly MongoDB 4.0 / 4.2), so on any discrepancy the official documentation at
    https://www.mongodb.com/docs/manual/[mongodb.com/docs/manual] wins, and the difference is noted.
  - [x] Task 1.2. Confirm the include path is `include::partial$mongodb-disclaimer.adoc[]` (Antora resolves
    `partial$` to `modules/ROOT/partials/`) — this exact line is placed after the header on every page created in
    Groups 2–4.
    - Confirmed: the new partial lives at `modules/ROOT/partials/mongodb-disclaimer.adoc`, so Antora's
      `partial$` family resolver maps `include::partial$mongodb-disclaimer.adoc[]` to it — identical placement to
      the existing `include::partial$sql-disclaimer.adoc[]` in `modules/ROOT/pages/database/sql/ddl.adoc`.

### Group 2 — Content pages

**Parallelizable: yes** — 19 independent pages (Tasks 2–20). Each includes the Group 1 disclaimer partial and
only cross-links other pages by `xref:` (no page needs another Group 2 page's finished text to be written).
Consolidated validation for the group is the Task 25 Antora build.

- [x] Task 2. Create `modules/ROOT/pages/database/mongodb/getting-started.adoc` — What MongoDB is & how to run
  it (issue #37 page 1; book ch. 1–2; manual "Introduction", "Getting Started", "Installation", `mongosh`)
  - _Done: getting-started.adoc + images/mongodb-document-hierarchy.svg created (theme-safe SVG, disclaimer include, mongosh/console examples, all 4 manual links). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 2.1. MongoDB as a **general-purpose document database**; the document model vs. the relational
    model; where it fits and the trade-offs (flexible schema, horizontal scale, no server-side joins by
    default). Embed `image::mongodb-document-hierarchy.svg[…]` (created in Task 2.6).
  - [x] Task 2.2. **Editions & how you run it**: Community vs. Enterprise vs. **Atlas** (managed); start a local
    `mongod` (`[source,bash]`), the default port `27017`, `--dbpath`; connect with **`mongosh`**; `show dbs`,
    `use <db>`, `show collections`, `db.<coll>.find()` (`[source,console]`).
  - [x] Task 2.3. `mongosh` as a **full JavaScript REPL**: assigning results to variables, `it` for cursor
    iteration, `.mongoshrc.js`, running a script file with `mongosh <file>` / `load()`; one line noting
    `mongosh` **replaces the legacy `mongo` shell**.
  - [x] Task 2.4. What MongoDB is **not** (not a cache, not schemaless in the "no rules" sense, not a drop-in
    SQL replacement). Cross-link `xref:database/sql/index.adoc[SQL Reference]` for the relational baseline.
  - [x] Task 2.5. Links in prose/examples: https://www.mongodb.com/docs/manual/introduction/,
    https://www.mongodb.com/docs/manual/tutorial/getting-started/,
    https://www.mongodb.com/docs/manual/installation/, https://www.mongodb.com/docs/mongodb-shell/
  - [x] Task 2.6. Author `modules/ROOT/images/mongodb-document-hierarchy.svg` — database → collection → document
    → field, beside relational database → table → row → column; light/dark-theme safe.
- [x] Task 3. Create `modules/ROOT/pages/database/mongodb/documents-and-bson.adoc` — Documents, BSON & data
  types (issue #37 page 2; book ch. 2 §Data Types + Appendix B §BSON; manual "Documents", "BSON types")
  - _Done: documents-and-bson.adoc + images/mongodb-bson-document.svg created (BSON type table, Extended JSON, ObjectId, dot notation; all 4 manual links). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 3.1. A **document** is an ordered set of field/value pairs; the **BSON** binary format and how it
    extends JSON; the **16 MB** document size limit and the ~100-level nesting limit. `[source,json]` example.
  - [x] Task 3.2. The **type set**: `Double`, `String`, `Object`, `Array`, `Binary`, `ObjectId`, `Boolean`,
    `Date`, `Null`, `Regex`, `Int32`, `Int64`, `Decimal128`, `Timestamp`, `MinKey` / `MaxKey`; **Extended JSON**
    (`$oid`, `$date`, `$numberDecimal`) for representing them in text. Small table + `[source,json]`.
  - [x] Task 3.3. **`_id` and `ObjectId`**: every document has a unique `_id`; `ObjectId` structure (4-byte
    timestamp + 5-byte random + 3-byte counter) and its rough monotonicity; supplying your own `_id`
    (`[source,javascript]`).
  - [x] Task 3.4. **Embedded documents** and **arrays** (and arrays of documents); **dot notation** for
    reaching into them (`"a.b.0.c"`). Embed `image::mongodb-bson-document.svg[…]` (Task 3.7).
  - [x] Task 3.5. **Comparison and sort order** across BSON types (the canonical type-ordering table);
    `null` vs. a missing field; numeric-type conflation caveats (`1` vs `1.0` vs `NumberLong(1)`).
  - [x] Task 3.6. Links: https://www.mongodb.com/docs/manual/core/document/,
    https://www.mongodb.com/docs/manual/reference/bson-types/,
    https://www.mongodb.com/docs/manual/reference/method/ObjectId/,
    https://www.mongodb.com/docs/manual/reference/mongodb-extended-json/
  - [x] Task 3.7. Author `modules/ROOT/images/mongodb-bson-document.svg` — an annotated BSON document with an
    embedded doc + an array of embedded docs, callouts on `_id` / `ObjectId` and dot-notation paths.
- [x] Task 4. Create `modules/ROOT/pages/database/mongodb/databases-and-collections.adoc` — Databases,
  collections & schema control (issue #37 page 3; book ch. 2, ch. 3 §Insert Validation, ch. 6 §Capped
  - _Done: databases-and-collections.adoc created ($jsonSchema validation, capped/TTL/clustered collections, views/$merge; 6 manual links). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  Collections; manual "Databases and Collections", "Schema Validation", "Capped Collections", "Clustered
  Collections", "Views", "Time Series")
  - [x] Task 4.1. Implicit creation of databases and collections on first write; naming rules & restrictions;
    `db.stats()` / `db.createCollection()` (`[source,javascript]`).
  - [x] Task 4.2. **Flexible ("dynamic") schema** and why it is not "no schema"; **schema validation** with
    `$jsonSchema`, `validationLevel` (`strict` / `moderate`) and `validationAction` (`error` / `warn`)
    (`[source,javascript]` + `[source,json]`).
  - [x] Task 4.3. **Capped collections** (fixed size, insertion order, no `deleteOne`) and **tailable
    cursors**; **TTL collections** (a TTL index expiring documents); **clustered collections** (collection
    stored in `_id` index order) — one short example each.
  - [x] Task 4.4. **Views** (read-only, defined by an aggregation pipeline) and **on-demand materialized
    views** (`$merge`); a short pointer to **time series collections** for time-stamped data
    (`xref:` forward to the aggregation page for `$merge`).
  - [x] Task 4.5. Links: https://www.mongodb.com/docs/manual/core/databases-and-collections/,
    https://www.mongodb.com/docs/manual/core/schema-validation/,
    https://www.mongodb.com/docs/manual/core/capped-collections/,
    https://www.mongodb.com/docs/manual/core/clustered-collections/,
    https://www.mongodb.com/docs/manual/core/views/,
    https://www.mongodb.com/docs/manual/core/timeseries-collections/
- [x] Task 5. Create `modules/ROOT/pages/database/mongodb/crud-insert-and-write-concern.adoc` — Inserting data,
  bulk writes & write concern (issue #37 page 4; book ch. 3 §Inserting Documents, ch. 12, ch. 20; manual "Insert
  - _Done: crud-insert-and-write-concern.adoc created (insertOne/insertMany/bulkWrite, write concern, retryable writes, [mermaid] majority-ack sequence). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  Documents", "Bulk Write Operations", "Retryable Writes", "Write Concern")
  - [x] Task 5.1. `insertOne`, `insertMany` (ordered vs. `{ ordered: false }`), the write-result shape,
    automatic `_id` assignment (`[source,javascript]` + `[source,json]`).
  - [x] Task 5.2. **`bulkWrite`**: mixed `insertOne` / `updateOne` / `deleteOne` / `replaceOne` ops, ordered vs.
    unordered, the batch result.
  - [x] Task 5.3. **Write concern** `{ w, j, wtimeout }`: `w: 1` vs. `w: "majority"`, the `j` (journal) flag,
    the server default, per-operation vs. per-connection.
  - [x] Task 5.4. **Retryable writes** (the driver retries once on a transient primary failover) and why a
    single write stays idempotent under it.
  - [x] Task 5.5. Embed a `[mermaid]` sequence diagram of the `w: "majority"` acknowledgement path
    (client → primary → oplog → secondaries → ack).
  - [x] Task 5.6. Links: https://www.mongodb.com/docs/manual/tutorial/insert-documents/,
    https://www.mongodb.com/docs/manual/core/bulk-write-operations/,
    https://www.mongodb.com/docs/manual/reference/write-concern/,
    https://www.mongodb.com/docs/manual/core/retryable-writes/
- [x] Task 6. Create `modules/ROOT/pages/database/mongodb/crud-query.adoc` — Reading data with the Query API
  (issue #37 page 5; book ch. 4; manual "Query Documents" + embedded-doc/array sub-pages, "Query and Projection
  - _Done: crud-query.adoc created (filter document, projection, all operator groups, embedded/array queries, cursors; SQL SELECT cross-link). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  Operators", "Cursor methods")
  - [x] Task 6.1. `find` / `findOne`; the **query filter document** (implicit equality, implicit `$and`);
    **projection** (include vs. exclude, `_id`, `$slice`, `$elemMatch`, `$` positional, `$meta`).
  - [x] Task 6.2. **Operators**: comparison (`$eq`,`$ne`,`$gt`,`$gte`,`$lt`,`$lte`,`$in`,`$nin`), logical
    (`$and`,`$or`,`$not`,`$nor`), element (`$exists`,`$type`), evaluation (`$regex`,`$expr`,`$mod`,`$text`,
    `$jsonSchema`), and the risk of `$where`. One `[source,javascript]` example per group.
  - [x] Task 6.3. **Embedded documents**: exact-match vs. dot-notation field match; **arrays**: matching an
    element, `$elemMatch` for "one element matches all conditions", `$all`, `$size`, positional path queries
    (`"array.0.field"`).
  - [x] Task 6.4. **Cursors**: iteration and batching, `sort`, `skip`, `limit`, `hint`, `countDocuments`,
    `distinct`, `collation`, avoiding large `skip` (range queries instead), no-timeout cursors.
  - [x] Task 6.5. Cross-link `xref:database/sql/dml-queries.adoc[SQL Queries (SELECT)]` for the relational
    contrast (`WHERE` vs. the filter document, `SELECT` list vs. projection, `ORDER BY`/`LIMIT`/`OFFSET`).
  - [x] Task 6.6. Links: https://www.mongodb.com/docs/manual/tutorial/query-documents/,
    https://www.mongodb.com/docs/manual/tutorial/query-embedded-documents/,
    https://www.mongodb.com/docs/manual/tutorial/query-arrays/,
    https://www.mongodb.com/docs/manual/reference/operator/query/,
    https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
- [x] Task 7. Create `modules/ROOT/pages/database/mongodb/crud-update-and-delete.adoc` — Updating & deleting
  documents (issue #37 page 6; book ch. 3 §Updating / Removing; manual "Update Documents", "Delete Documents",
  - _Done: crud-update-and-delete.adoc created (field/array update operators, positional operators + arrayFilters, upserts, findOneAndUpdate, pipeline-form updates). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  "Update Operators")
  - [x] Task 7.1. `updateOne` / `updateMany` / `replaceOne`; **full-document replacement** vs. **operator
    updates**; the write-result shape.
  - [x] Task 7.2. **Field update operators**: `$set`, `$unset`, `$rename`, `$inc`, `$mul`, `$min`, `$max`,
    `$currentDate`, `$setOnInsert`.
  - [x] Task 7.3. **Array update operators**: `$push` (+ `$each`, `$slice`, `$sort`, `$position`), `$addToSet`,
    `$pop`, `$pull`, `$pullAll`, and the **positional operators** `$`, `$[]`, `$[<identifier>]` with
    `arrayFilters` — one `[source,javascript]` example each.
  - [x] Task 7.4. **Upserts** (`{ upsert: true }`): how the filter + `$setOnInsert` seed the new document.
  - [x] Task 7.5. `findOneAndUpdate` / `findOneAndReplace` / `findOneAndDelete` and `returnDocument`; **update
    with an aggregation pipeline** (`[ { $set: … } ]`). `deleteOne` / `deleteMany`; `drop()` vs. deleting all
    documents.
  - [x] Task 7.6. Links: https://www.mongodb.com/docs/manual/tutorial/update-documents/,
    https://www.mongodb.com/docs/manual/reference/operator/update/,
    https://www.mongodb.com/docs/manual/tutorial/remove-documents/,
    https://www.mongodb.com/docs/manual/tutorial/update-documents-with-aggregation-pipeline/
- [x] Task 8. Create `modules/ROOT/pages/database/mongodb/indexes.adoc` — Indexing & query performance (issue
  #37 page 7; book ch. 5; manual "Indexes", "Index Types", "Index Properties", "ESR rule", "Explain Results")
  - _Done: indexes.adoc + images/mongodb-compound-index-esr.svg created (ESR rule, explain() reading, index properties, [mermaid] plan-selection flowchart). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 8.1. Why indexes exist; `createIndex`, `getIndexes`, `dropIndex`; the always-present `_id` index;
    index size and the write-time cost.
  - [x] Task 8.2. **Single-field**, **compound** (key order matters — the **Equality, Sort, Range** rule),
    **multikey** (automatic on array fields; the one-array-field-per-compound-index limit). Embed
    `image::mongodb-compound-index-esr.svg[…]` (Task 8.6).
  - [x] Task 8.3. **Covered queries** and projection; reading **`explain()`** (`queryPlanner` /
    `executionStats`), `COLLSCAN` vs. `IXSCAN`, `totalKeysExamined` vs. `nReturned`, the **plan cache**. Embed a
    `[mermaid]` flowchart of plan selection (parse → candidate plans → plan cache → winning plan → executed
    stages).
  - [x] Task 8.4. **Index properties**: `unique`, `partialFilterExpression`, `sparse`, **TTL**
    (`expireAfterSeconds`), `hidden`, `collation` (case-insensitive indexes) — one example each.
  - [x] Task 8.5. **Index builds** (rolling on replica sets), `hint`, and **when *not* to index**.
  - [x] Task 8.6. Author `modules/ROOT/images/mongodb-compound-index-esr.svg` — compound-index key order:
    equality prefix → sort → range.
  - [x] Task 8.7. Links: https://www.mongodb.com/docs/manual/indexes/,
    https://www.mongodb.com/docs/manual/core/indexes/index-types/,
    https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/,
    https://www.mongodb.com/docs/manual/reference/explain-results/
- [x] Task 9. Create `modules/ROOT/pages/database/mongodb/special-indexes-and-search.adoc` — Text, wildcard,
  geospatial & Atlas search (issue #37 page 8; book ch. 6; manual "Text Search", "Wildcard Indexes", "Geospatial
  - _Done: special-indexes-and-search.adoc created (text/wildcard/2dsphere/hashed indexes; Atlas Search + Vector Search overview + link only). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  Queries", "Atlas Search", "Atlas Vector Search")
  - [x] Task 9.1. **Text indexes** and `$text` / `$search` / `$meta: "textScore"`; one text index per
    collection; language & weights; a note that **Atlas Search** supersedes it for real search workloads.
  - [x] Task 9.2. **Wildcard indexes** (`"$**"`) for unpredictable / attribute-bag field names, and their
    trade-offs.
  - [x] Task 9.3. **Geospatial**: `2dsphere` + **GeoJSON**, `$near` / `$nearSphere` / `$geoWithin` /
    `$geoIntersects`; the legacy `2d` index for flat coordinates.
  - [x] Task 9.4. **Hashed indexes** (mainly for hashed shard keys) — brief, `xref:` forward to the sharding
    page.
  - [x] Task 9.5. **Atlas Search** (`$search`, Lucene-based) and **Atlas Vector Search** (`$vectorSearch` for
    embeddings / semantic search) — overview, when to use, **links only** (Atlas-only, not documented in depth).
  - [x] Task 9.6. Links: https://www.mongodb.com/docs/manual/text-search/,
    https://www.mongodb.com/docs/manual/core/indexes/index-types/index-wildcard/,
    https://www.mongodb.com/docs/manual/geospatial-queries/,
    https://www.mongodb.com/docs/atlas/atlas-search/, https://www.mongodb.com/docs/atlas/atlas-vector-search/
- [x] Task 10. Create `modules/ROOT/pages/database/mongodb/aggregation-pipeline.adoc` — The aggregation
  framework (issue #37 page 9; book ch. 7; manual "Aggregation Operations", "Aggregation Pipeline", stage &
  - _Done: aggregation-pipeline.adoc created (full stage reference w/ examples, expressions & system variables, $expr, optimization, [mermaid] pipeline flowchart; SQL aggregate/window + SELECT cross-links). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  operator references, "Pipeline Optimization", "Map-Reduce")
  - [x] Task 10.1. The **pipeline** model: an array of **stages**, each transforming the stream of documents;
    `db.coll.aggregate([...])` (`[source,javascript]` + `[source,json]` result).
  - [x] Task 10.2. **Core stages** (one compact example each, grouped): `$match`, `$project`, `$addFields` /
    `$set`, `$unset`, `$group` (+ accumulators `$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`, `$first` /
    `$last`, `$count`), `$sort`, `$limit` / `$skip`, `$unwind`, `$lookup` (left outer join, incl. the
    pipeline/`let` form), `$unionWith`, `$facet`, `$bucket` / `$bucketAuto`, `$graphLookup`, `$replaceRoot` /
    `$replaceWith`, `$sortByCount`, `$sample`, `$setWindowFields`, `$out`, `$merge`.
  - [x] Task 10.3. **Expressions & operators**: field paths (`"$field"`), system variables `$$ROOT` / `$$NOW` /
    `$$REMOVE`, and arithmetic / string / date / array / conditional (`$cond`, `$switch`, `$ifNull`) operators.
  - [x] Task 10.4. **`$expr`** to use aggregation expressions inside `find`; **pipeline optimization**
    (`$match` / `$project` pushed earlier, `$sort` + `$limit` coalescing) and `explain`; a one-line note that
    standalone **map-reduce is deprecated** in favour of the pipeline.
  - [x] Task 10.5. Embed a `[mermaid]` flowchart of documents flowing through a 3–4 stage pipeline
    (`$match → $group → $sort → $merge`). Cross-link
    `xref:database/sql/aggregate-window-functions.adoc[SQL Aggregate & Window Functions]`.
  - [x] Task 10.6. Links: https://www.mongodb.com/docs/manual/core/aggregation-pipeline/,
    https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/,
    https://www.mongodb.com/docs/manual/reference/operator/aggregation/,
    https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/
- [x] Task 11. Create `modules/ROOT/pages/database/mongodb/data-modeling.adoc` — Schema design for the document
  model (issue #37 page 10; book ch. 9; manual "Data Modeling", "Design Patterns", "Schema Anti-Patterns")
  - _Done: data-modeling.adoc + images/mongodb-embed-vs-reference.svg created (embed vs reference, cardinality, 8 design patterns + anti-patterns, schema versioning; SQL Normalization cross-link). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 11.1. **Embed vs. reference**: "data accessed together is stored together"; bounded vs.
    **unbounded arrays** (the 16 MB ceiling); read/write ratio; single-document atomicity. Embed
    `image::mongodb-embed-vs-reference.svg[…]` (Task 11.6).
  - [x] Task 11.2. **Relationship cardinality**: 1:1, 1:few (embed), 1:many (reference or subset), many:many;
    modelling "friends / followers" and other high-cardinality relationships.
  - [x] Task 11.3. **Normalization vs. denormalization** and the consistency cost of duplicated data;
    cross-link `xref:database/sql/normalization.adoc[SQL Normalization]` for the relational baseline.
  - [x] Task 11.4. **Schema design patterns**: Bucket, Computed, Subset, Extended Reference, Schema Versioning,
    Outlier, Polymorphic, Tree/Graph — one short example each; and the **anti-patterns** (massive arrays,
    bloated documents, too many collections, unindexed case-insensitive queries).
  - [x] Task 11.5. **Schema migration / versioning** strategies (a `schemaVersion` field; migrate-on-read vs.
    batch); **when not to use MongoDB**.
  - [x] Task 11.6. Author `modules/ROOT/images/mongodb-embed-vs-reference.svg` — a 1:N relationship embedded vs.
    referenced, side by side, with the "queried on its own? / unbounded?" decision.
  - [x] Task 11.7. Links: https://www.mongodb.com/docs/manual/data-modeling/,
    https://www.mongodb.com/docs/manual/data-modeling/design-patterns/,
    https://www.mongodb.com/docs/manual/data-modeling/schema-anti-patterns/
- [x] Task 12. Create `modules/ROOT/pages/database/mongodb/transactions.adoc` — Multi-document ACID transactions
  (issue #37 page 11; book ch. 8; manual "Transactions", "Transactions Production Considerations")
  - _Done: transactions.adoc created (withTransaction, read/write concern in txn, limits, [mermaid] lifecycle state diagram; SQL Transactions cross-link). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 12.1. **Single-document writes are always atomic** — reach for a transaction only when an invariant
    spans documents / collections.
  - [x] Task 12.2. **ACID** in MongoDB terms; **client sessions**; `session.withTransaction(fn)` vs. explicit
    `startTransaction` / `commitTransaction` / `abortTransaction`; the driver's commit-retry behaviour
    (`[source,javascript]`).
  - [x] Task 12.3. **Read & write concern inside a transaction** (`readConcern: "snapshot"`,
    `writeConcern: "majority"`); **transaction limits** (60 s default runtime, 16 MB oplog entry) and the "keep
    transactions short" guidance; **distributed transactions** on a sharded cluster (same API, extra cost).
  - [x] Task 12.4. Embed a `[mermaid]` state diagram of the transaction lifecycle (session start →
    `startTransaction` → reads/writes → `commitTransaction` / `abortTransaction`). Cross-link
    `xref:database/sql/transactions.adoc[SQL Transactions]` for the isolation-level contrast.
  - [x] Task 12.5. Links: https://www.mongodb.com/docs/manual/core/transactions/,
    https://www.mongodb.com/docs/manual/core/transactions-production-consideration/
- [x] Task 13. Create `modules/ROOT/pages/database/mongodb/change-streams.adoc` — Reacting to data changes
  (issue #37 page 12; book ch. 15 §Change Streams; manual "Change Streams")
  - _Done: change-streams.adoc created (watch() scopes, change-event shape, resumability, pipeline filtering, updateLookup). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 13.1. `watch()` on a **collection, database, or whole deployment**; the change-event document
    shape (`operationType`, `fullDocument`, `documentKey`, `updateDescription`, `ns`, `clusterTime`)
    (`[source,javascript]` + `[source,json]`).
  - [x] Task 13.2. **Resumability**: `resumeToken`, `resumeAfter` / `startAfter` / `startAtOperationTime`;
    requires a replica set / sharded cluster and `majority` read concern.
  - [x] Task 13.3. **Filtering** with an aggregation pipeline in `watch([...])`; `fullDocument: "updateLookup"`
    and `fullDocumentBeforeChange`; typical uses (cache invalidation, ETL / streaming, notifications).
  - [x] Task 13.4. Links: https://www.mongodb.com/docs/manual/changeStreams/,
    https://www.mongodb.com/docs/manual/reference/change-events/
- [x] Task 14. Create `modules/ROOT/pages/database/mongodb/replication.adoc` — Replica sets & high availability
  (issue #37 page 13; book ch. 10–13; manual "Replication", "Replica Set Members", "Elections", "Oplog", "Read
  - _Done: replication.adoc + images/mongodb-replica-set-topology.svg created (oplog/initial sync w/ [mermaid] sequence, elections, read preference, read/write concern, rs.* commands). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  Preference", "Write/Read Concern")
  - [x] Task 14.1. A **replica set**: one **primary**, multiple **secondaries**; the **oplog** (a capped
    collection) and how secondaries tail it; **initial sync**. Embed
    `image::mongodb-replica-set-topology.svg[…]` (Task 14.6) and a `[mermaid]` sequence of initial sync + oplog
    tailing.
  - [x] Task 14.2. **Elections & heartbeats**: a majority is needed to elect; `priority`, `votes`, **arbiters**
    (and why to avoid them), **hidden** and **delayed** members; **rollbacks** when a former primary rejoins.
  - [x] Task 14.3. **Read preference** (`primary`, `primaryPreferred`, `secondary`, `secondaryPreferred`,
    `nearest`) and tag sets; the staleness trade-off.
  - [x] Task 14.4. **Write concern** revisited (`w: "majority"`, `wtimeout`, custom write-concern names),
    **read concern** (`local`, `available`, `majority`, `linearizable`, `snapshot`), and **causal consistency**
    within a session.
  - [x] Task 14.5. **Configuring** a set: `rs.initiate`, `rs.add`, `rs.reconfig`, `rs.status`; connecting from
    an application with a replica-set connection string (`xref:` to the drivers page).
  - [x] Task 14.6. Author `modules/ROOT/images/mongodb-replica-set-topology.svg` — primary + two secondaries +
    heartbeats, and the failover / election transition.
  - [x] Task 14.7. Links: https://www.mongodb.com/docs/manual/replication/,
    https://www.mongodb.com/docs/manual/core/replica-set-oplog/,
    https://www.mongodb.com/docs/manual/core/read-preference/,
    https://www.mongodb.com/docs/manual/reference/write-concern/,
    https://www.mongodb.com/docs/manual/reference/read-concern/
- [x] Task 15. Create `modules/ROOT/pages/database/mongodb/sharding.adoc` — Horizontal scaling with sharded
  clusters (issue #37 page 14; book ch. 14–17; manual "Sharding", "Shard Keys", "Choose a Shard Key",
  - _Done: sharding.adoc + images/mongodb-sharded-cluster.svg, mongodb-shard-key-distribution.svg, mongodb-chunk-balancer.svg created (cluster components, shard keys, key choice, balancer/zones/resharding). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  "Balancer", "Zones")
  - [x] Task 15.1. **Cluster components**: **shards** (each a replica set), **`mongos`** routers, the
    **config-server replica set**; a client always talks to `mongos`. Embed `image::mongodb-sharded-cluster.svg[…]`
    (Task 15.6).
  - [x] Task 15.2. **Shard keys**: ranged vs. **hashed** vs. compound; the key fields are immutable per index
    though a document's key *values* can change (since 4.2) and the key can be **refined**; **chunks**, chunk
    ranges, the default chunk size. Embed `image::mongodb-shard-key-distribution.svg[…]` (Task 15.7).
  - [x] Task 15.3. **Choosing a shard key**: high **cardinality**, low **frequency**, non-**monotonic** (the
    "ascending shard key" hotspot), and the query-isolation goal; **hashed** keys to spread a monotonic key.
  - [x] Task 15.4. **The balancer**: automatic chunk migration toward an even distribution; **zones / zone
    sharding** for data locality; **`sh.status()`** and sharding administration; **resharding** an existing
    collection. Embed `image::mongodb-chunk-balancer.svg[…]` (Task 15.8).
  - [x] Task 15.5. Links: https://www.mongodb.com/docs/manual/sharding/,
    https://www.mongodb.com/docs/manual/core/sharding-choose-a-shard-key/,
    https://www.mongodb.com/docs/manual/core/sharding-balancer-administration/,
    https://www.mongodb.com/docs/manual/core/zone-sharding/
  - [x] Task 15.6. Author `modules/ROOT/images/mongodb-sharded-cluster.svg` — app → `mongos` → shards (each a
    replica set) + the config-server replica set.
  - [x] Task 15.7. Author `modules/ROOT/images/mongodb-shard-key-distribution.svg` — ranged vs. hashed
    distribution of an ascending key.
  - [x] Task 15.8. Author `modules/ROOT/images/mongodb-chunk-balancer.svg` — chunk splitting + the balancer
    moving chunks toward an even distribution across shards.
- [x] Task 16. Create `modules/ROOT/pages/database/mongodb/storage-and-durability.adoc` — WiredTiger, journaling
  & durability (issue #37 page 15; book ch. 20, Appendix B; manual "Storage", "WiredTiger", "Journaling",
  - _Done: storage-and-durability.adoc created (WiredTiger MVCC/cache/checkpoints/compression w/ [mermaid] flowchart, journaling, cluster durability, MMAPv1 removed note). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  "Read/Write Concern")
  - [x] Task 16.1. **WiredTiger** as the (only supported) storage engine: **document-level concurrency** / MVCC,
    the **cache**, **checkpoints** (~60 s), **compression** (snappy / zlib / zstd), the B-tree file layout.
    Embed a `[mermaid]` flowchart cache → checkpoint + journal → data files.
  - [x] Task 16.2. **Journaling** (the write-ahead log): how it bounds data loss to the last ~100 ms, `j: true`
    write concern, and recovery on restart.
  - [x] Task 16.3. **Durability at the cluster level**: `w: "majority"` + `j`, `readConcern: "majority"` /
    `"linearizable"`, what MongoDB **does not** guarantee, and `validate` / checking for corruption.
  - [x] Task 16.4. A one-line note on the **in-memory** storage engine (Enterprise) and that **MMAPv1 was
    removed**.
  - [x] Task 16.5. Links: https://www.mongodb.com/docs/manual/core/wiredtiger/,
    https://www.mongodb.com/docs/manual/core/journaling/,
    https://www.mongodb.com/docs/manual/reference/read-concern/
- [x] Task 17. Create `modules/ROOT/pages/database/mongodb/security.adoc` — Authentication, authorization &
  encryption (issue #37 page 16; book ch. 19; manual "Security", "Security Checklist", "Authentication",
  - _Done: security.adoc created (--auth + localhost exception, SCRAM/x.509/LDAP/Kerberos/OIDC, RBAC, TLS, encryption-at-rest + CSFLE/Queryable Encryption [mermaid] sequence, security checklist). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  "Authorization", "TLS/SSL", "Encryption at Rest", "CSFLE", "Queryable Encryption", "Auditing")
  - [x] Task 17.1. **Enable access control** (`--auth`), the **localhost exception**, and creating the first
    `userAdmin` (`[source,javascript]` + `[source,yaml]`).
  - [x] Task 17.2. **Authentication mechanisms**: **SCRAM** (default), **x.509** certificates, and (Enterprise)
    **LDAP**, **Kerberos**, **OIDC**; authenticating **cluster members** to each other (keyfile / x.509).
  - [x] Task 17.3. **Role-based access control**: users are granted **roles**, roles grant **privileges** on
    resources; **built-in roles** (`read`, `readWrite`, `dbAdmin`, `clusterAdmin`, `root`, …) and **custom
    roles**.
  - [x] Task 17.4. **TLS/SSL** for client and intra-cluster traffic; **network hardening** (`bindIp`,
    firewalls, no public `27017`).
  - [x] Task 17.5. **Encryption at rest** (Enterprise / Atlas); **client-side field level encryption** and
    **Queryable Encryption** (server never sees plaintext; keys in a KMS-backed key vault); **auditing**. Embed
    a `[mermaid]` sequence of the CSFLE / Queryable Encryption data flow (driver encrypts with a key from the
    key vault → server stores ciphertext).
  - [x] Task 17.6. The **security checklist** as the summary.
  - [x] Task 17.7. Links: https://www.mongodb.com/docs/manual/administration/security-checklist/,
    https://www.mongodb.com/docs/manual/core/authentication/,
    https://www.mongodb.com/docs/manual/core/authorization/,
    https://www.mongodb.com/docs/manual/core/security-transport-encryption/,
    https://www.mongodb.com/docs/manual/core/queryable-encryption/
- [x] Task 18. Create `modules/ROOT/pages/database/mongodb/administration-and-monitoring.adoc` — Running &
  observing a deployment (issue #37 page 17; book ch. 18, 21–22, 24; manual "Administration", "Configuration
  - _Done: administration-and-monitoring.adoc created (YAML config vs flags, currentOp/killOp, profiler, serverStatus/mongostat/mongotop, production notes). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  Options", "Monitoring", "Database Profiler", "Production Notes")
  - [x] Task 18.1. **Starting / stopping `mongod`**: key command-line options vs. the **YAML config file**
    (`storage`, `net`, `replication`, `sharding`, `security`, `systemLog`) (`[source,yaml]` + `[source,bash]`);
    clean shutdown.
  - [x] Task 18.2. **Seeing what the server is doing**: `db.currentOp()` / `db.killOp()`, the **database
    profiler** (`system.profile`, levels 0/1/2, `slowms`), `explain` for a specific query.
  - [x] Task 18.3. **Monitoring**: `serverStatus`, `dbStats` / `collStats`, `mongostat`, `mongotop`, and Atlas /
    Cloud Manager metrics; what to watch (page faults, replication lag, connections, cache pressure, queue
    depth).
  - [x] Task 18.4. **Production notes**: XFS filesystem, disable **THP**, **NUMA** interleave, raise `ulimit`,
    `readahead`, NTP clock sync, dedicated disks.
  - [x] Task 18.5. Links: https://www.mongodb.com/docs/manual/administration/,
    https://www.mongodb.com/docs/manual/reference/configuration-options/,
    https://www.mongodb.com/docs/manual/administration/monitoring/,
    https://www.mongodb.com/docs/manual/administration/production-notes/
- [x] Task 19. Create `modules/ROOT/pages/database/mongodb/backup-and-data-tools.adoc` — Backups, import/export &
  GridFS (issue #37 page 18; book ch. 6 §GridFS, ch. 23; manual "Backup Methods", "Database Tools", "GridFS")
  - _Done: backup-and-data-tools.adoc created (mongodump/mongorestore, volume snapshots, PITR overview, mongoexport/mongoimport, GridFS). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 19.1. **Backup methods** and their trade-offs: **`mongodump` / `mongorestore`** (BSON, small
    deployments), **filesystem / volume snapshots** (point-in-time; journal on the same volume),
    **Atlas / Ops Manager continuous backup** (oplog-based PITR); a **sharded-cluster** backup needs the
    balancer stopped / a coordinated snapshot. `[source,bash]` examples.
  - [x] Task 19.2. **Data movement**: `mongoexport` / `mongoimport` (JSON / CSV — lossy for BSON types),
    `bsondump`.
  - [x] Task 19.3. **GridFS**: storing files larger than 16 MB as `chunks` + `files` documents; `mongofiles`;
    when an object store is the better choice.
  - [x] Task 19.4. Links: https://www.mongodb.com/docs/manual/core/backups/,
    https://www.mongodb.com/docs/database-tools/, https://www.mongodb.com/docs/manual/core/gridfs/
- [x] Task 20. Create `modules/ROOT/pages/database/mongodb/drivers-and-tooling.adoc` — Connecting from an
  application & the tooling (issue #37 page 19; book ch. 2 §Shell, ch. 12; manual "Drivers", "Connection
  - _Done: drivers-and-tooling.adoc created (11 official drivers w/ Node+PyMongo parity, connection string URI, pooling, Stable API, mongosh/Compass/Database Tools/Atlas CLI). Docs-only; no tests/coverage/quality tooling applies; group build is Task 25._
  String", "Stable API", "Compass", `mongosh`)
  - [x] Task 20.1. **Official drivers** (Node.js, Python / PyMongo, Java, C# / .NET, Go, Rust, PHP, Ruby, C++,
    Kotlin, Scala) — all expose the same CRUD + aggregation surface as `mongosh`; a short `[source,javascript]`
    (Node) + one non-JS snippet (e.g. `[source,python]`) to show parity.
  - [x] Task 20.2. The **connection string URI**: `mongodb://` vs. `mongodb+srv://`, host list / replica-set
    name, `authSource`, `retryWrites`, `w`, `readPreference`, `tls`; **connection pooling** (`maxPoolSize`) and
    why a client should be a long-lived singleton.
  - [x] Task 20.3. The **Stable API** (`{ apiVersion: "1" }`) for forward-compatible apps.
  - [x] Task 20.4. **Tooling**: `mongosh` (scripting, `.mongoshrc.js`), **MongoDB Compass** (GUI + visual
    `explain` + aggregation builder), the **MongoDB Database Tools** bundle, the **Atlas CLI**.
  - [x] Task 20.5. Links: https://www.mongodb.com/docs/drivers/,
    https://www.mongodb.com/docs/manual/reference/connection-string/,
    https://www.mongodb.com/docs/manual/reference/stable-api/, https://www.mongodb.com/docs/compass/

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 21). It must run **after** Group 2 so its `xref:` back-links point
at pages that exist, and so its content reflects the finalized page set. Validated by the Task 25 build.

- [x] Task 21. Create the MongoDB cheat sheet — `modules/ROOT/pages/database/mongodb/cheat-sheet.adoc` +
  `modules/ROOT/attachments/mongodb-cheat-sheet.pdf`
  - _Done: scratch `mongodb-cheat-sheet.html` (13 colour-coded boxes, one topic family each) rendered with
    headless Chrome to `modules/ROOT/attachments/mongodb-cheat-sheet.pdf` — verified exactly 1 A4 page
    (209.9 x 297.0 mm, `pypdf` page count = 1) with no overflow/clipping on a rendered preview. HTML source is
    NOT checked in. `modules/ROOT/pages/database/mongodb/cheat-sheet.adoc` created with the disclaimer include,
    intro, grouped `xref:` back-links to all 19 Group 2 pages, a mirrored bibliography line (manual + O'Reilly
    book page), and the `xref:attachment$mongodb-cheat-sheet.pdf[…]` download link. Docs-only; no
    tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 21.1. Author a hand-built, print-ready **single A4 page** HTML/CSS layout in a scratch location
    (e.g. `/private/tmp/.../mongodb-cheat-sheet.html`) — same visual style as the prior sections' cheat sheets
    (colour-coded boxes, one topic family per box). Content to fit on the page: `mongod` / `mongosh` /
    connection-string one-liners; the document / BSON types and `_id` / `ObjectId`; `insertOne` / `insertMany` /
    `bulkWrite` + write concern; `find` filter + projection + query operators (`$eq` / `$gt` / `$in` / `$regex` /
    `$exists` / `$elemMatch` / `$all` / `$size`) + logical operators; cursor `sort` / `skip` / `limit` /
    `distinct`; `updateOne` / `updateMany` + field operators (`$set` / `$unset` / `$inc` / `$rename`) + array
    operators (`$push` / `$each` / `$addToSet` / `$pull` / `$` / `$[]` / `$[id]`) + upsert; `deleteOne` /
    `deleteMany`; index creation + types (single / compound / multikey / text / 2dsphere / hashed / TTL /
    unique / partial) + the **ESR rule** + `explain()` verbosities; the aggregation stage list (`$match` /
    `$group` / `$project` / `$sort` / `$unwind` / `$lookup` / `$unionWith` / `$facet` / `$bucket` / `$out` /
    `$merge`) + common accumulators; a transaction skeleton (`withTransaction`); replica-set commands
    (`rs.initiate` / `rs.add` / `rs.status`) + read preference + write/read concern values; sharding commands
    (`sh.enableSharding` / `sh.shardCollection` / `sh.status`) + shard-key guidance; `mongodump` / `mongorestore`
    / `mongoimport` / `mongoexport`; and a short "embed vs. reference" decision strip.
  - [x] Task 21.2. Render to PDF with headless Chrome:
    `chrome --headless --print-to-pdf=mongodb-cheat-sheet.pdf --no-pdf-header-footer --print-to-pdf-no-header mongodb-cheat-sheet.html`
    (or the installed Chrome/Chromium equivalent). Verify it is **exactly one A4 page** (`pdfinfo` page count ==
    1, or `python3 -c "import pypdf; print(len(pypdf.PdfReader('mongodb-cheat-sheet.pdf').pages))"`) and
    visually check a rendered preview for clipping. Iterate on the HTML/CSS until it fits on one page with no
    overflow.
  - [x] Task 21.3. Copy the rendered PDF to `modules/ROOT/attachments/mongodb-cheat-sheet.pdf` (checked in).
  - [x] Task 21.4. Create `modules/ROOT/pages/database/mongodb/cheat-sheet.adoc` — `= MongoDB Cheat Sheet`,
    `:description:` / `:keywords:`, blank line, `include::partial$mongodb-disclaimer.adoc[]`, a short intro
    paragraph, grouped `xref:database/mongodb/<page>.adoc[…]` back-links to every Group 2 page (same grouping as
    `index.adoc`'s `== What's covered`), a brief mirrored bibliography line (official manual + the book's
    O'Reilly page), then `xref:attachment$mongodb-cheat-sheet.pdf[Download the MongoDB Cheat Sheet (PDF)]` —
    same shape as `modules/ROOT/pages/database/sql/cheat-sheet.adoc`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 22 (section index) must link every page from Groups 2–3; Tasks 23–24 wire the new
subsection into the three navigation surfaces and must reflect the final page/title set; Task 25 (build) must run
last, after every other task in the plan.

- [x] Task 22. Create the section index — `modules/ROOT/pages/database/mongodb/index.adoc`
  - _Done: `modules/ROOT/pages/database/mongodb/index.adoc` created — `= MongoDB Reference`, one-sentence
    `:description:` + comma-list `:keywords:` (mentions document database / NoSQL / aggregation pipeline),
    disclaimer include, lead paragraph linking https://www.mongodb.com/[MongoDB] and
    https://www.mongodb.com/docs/manual/[the MongoDB Server Manual], the "start with Getting Started → Documents
    & BSON → Databases & Collections → the three CRUD pages" pointer, a `== What's covered` with one
    `xref:database/mongodb/<page>.adoc[Title] -- description` bullet per Group 2 page + the cheat sheet grouped
    under `===` headings in the plan's order (matches nav order), and a `== Bibliography` with the four issue #37
    entries; the O'Reilly book is "Consulted as part of the bibliography", never the primary source. Docs-only;
    no tests/coverage/quality tooling applies; group build is Task 25._
  - [x] Task 22.1. `= MongoDB Reference`, `:description:` (one sentence) and `:keywords:` (comma list), blank
    line, `include::partial$mongodb-disclaimer.adoc[]`, then a lead paragraph
    (https://www.mongodb.com/[MongoDB] is a general-purpose, document-oriented database … verified against
    https://www.mongodb.com/docs/manual/[the MongoDB Server Manual]).
  - [x] Task 22.2. A "if you are new, start with Getting Started → Documents & BSON → Databases & Collections →
    the three CRUD pages" pointer.
  - [x] Task 22.3. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped: *Getting
    started* · *Data & schema* (documents-and-bson, databases-and-collections) · *CRUD / Query API*
    (crud-insert-and-write-concern, crud-query, crud-update-and-delete) · *Indexing & search* (indexes,
    special-indexes-and-search) · *Aggregation* · *Schema design* (data-modeling) · *Transactions & change
    streams* · *Replication & sharding* · *Storage, security & operations* (storage-and-durability, security,
    administration-and-monitoring, backup-and-data-tools) · *Drivers & tooling* · *Cheat sheet*. Each bullet is
    an `xref:database/mongodb/<page>.adoc[Title] -- one-line description`.
  - [x] Task 22.4. `== Bibliography` — the exact entries from issue #37's "Bibliography" section:
    (1) https://www.mongodb.com/docs/manual/[MongoDB Server Manual] with the called-out sub-pages (Introduction,
    CRUD, Query & Projection Operators, Update Operators, Indexes, Aggregation Pipeline + stage/operator refs,
    Data Modeling, Transactions, Change Streams, Replication, Sharding, WiredTiger, Security);
    (2) https://www.mongodb.com/docs/[docs.mongodb.com] more broadly — `mongosh`, drivers, connection-string
    reference, Compass, Database Tools, Atlas (with Atlas Search / Atlas Vector Search), release notes;
    (3) https://learn.mongodb.com/[MongoDB University];
    (4) Bradshaw, Shannon; Brazil, Eoin; Chodorow, Kristina. _MongoDB: The Definitive Guide — Powerful and
    Scalable Data Storage_, 3rd ed. O'Reilly Media, 2019. ISBN 978-1-491-95446-1. Consulted as part of the
    bibliography for this section (targets roughly MongoDB 4.0 / 4.2) — with
    https://www.oreilly.com/library/view/mongodb-the-definitive/9781491954454/[the publisher's book page],
    https://www.oreilly.com/[oreilly.com], and the
    https://github.com/mongodb-the-definitive-guide-3e/mongodb-the-definitive-guide-3e[companion code
    repository]. **The book must not be described as the primary/main source** — only "consulted as part of the
    bibliography".
- [x] Task 23. Wire the subsection into `modules/ROOT/nav.adoc`
  - _Done: inserted the `*** xref:database/mongodb/index.adoc[MongoDB Reference]` group with one `****` entry per
    page (20 entries) immediately after the SQL `**** … cheat-sheet` line and before `** xref:web/index.adoc[Web
    Development]`, in the exact order of `index.adoc`'s `== What's covered`. Docs-only; group build is Task 25._
  - [x] Task 23.1. Insert, immediately after the current
    `**** xref:database/sql/cheat-sheet.adoc[Cheat Sheet (PDF)]` line and before `** xref:web/index.adoc[Web
    Development]`, a new block:
    ```
    *** xref:database/mongodb/index.adoc[MongoDB Reference]
    **** xref:database/mongodb/getting-started.adoc[Getting Started]
    **** xref:database/mongodb/documents-and-bson.adoc[Documents & BSON]
    **** xref:database/mongodb/databases-and-collections.adoc[Databases & Collections]
    **** xref:database/mongodb/crud-insert-and-write-concern.adoc[Insert & Write Concern]
    **** xref:database/mongodb/crud-query.adoc[Querying (find)]
    **** xref:database/mongodb/crud-update-and-delete.adoc[Update & Delete]
    **** xref:database/mongodb/indexes.adoc[Indexes]
    **** xref:database/mongodb/special-indexes-and-search.adoc[Special Indexes & Search]
    **** xref:database/mongodb/aggregation-pipeline.adoc[Aggregation Pipeline]
    **** xref:database/mongodb/data-modeling.adoc[Data Modeling]
    **** xref:database/mongodb/transactions.adoc[Transactions]
    **** xref:database/mongodb/change-streams.adoc[Change Streams]
    **** xref:database/mongodb/replication.adoc[Replication]
    **** xref:database/mongodb/sharding.adoc[Sharding]
    **** xref:database/mongodb/storage-and-durability.adoc[Storage & Durability]
    **** xref:database/mongodb/security.adoc[Security]
    **** xref:database/mongodb/administration-and-monitoring.adoc[Administration & Monitoring]
    **** xref:database/mongodb/backup-and-data-tools.adoc[Backup & Data Tools]
    **** xref:database/mongodb/drivers-and-tooling.adoc[Drivers & Tooling]
    **** xref:database/mongodb/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```
    (Nav link labels may be tightened while implementing as long as each page has exactly one `****` entry and
    the order matches `index.adoc`'s `== What's covered`.)
- [x] Task 24. Wire the subsection into the two landing pages
  - _Done: `modules/ROOT/pages/database/index.adoc` gained a second `== Sections` bullet for MongoDB Reference
    (verbatim description from the plan) and its `:description:` / `:keywords:` now mention MongoDB / document
    databases / NoSQL; `modules/ROOT/pages/index.adoc` gained a nested `** xref:database/mongodb/index.adoc`
    sub-bullet after the SQL one under `== Guides & References`, and MongoDB / document database / NoSQL /
    aggregation pipeline were added to the page `:keywords:`. Docs-only; group build is Task 25._
  - [x] Task 24.1. `modules/ROOT/pages/database/index.adoc` — add, after the existing SQL Reference bullet in
    `== Sections`:
    `* xref:database/mongodb/index.adoc[MongoDB Reference] -- the document database: the BSON document model, the
    Query API and aggregation, indexing and search, schema design, transactions and change streams, replication
    and sharding, storage and security, plus a downloadable one-page cheat sheet.`
    Update the page `:description:` / `:keywords:` to mention MongoDB / document databases / NoSQL.
  - [x] Task 24.2. `modules/ROOT/pages/index.adoc` — in `== Guides & References`, under the
    `* xref:database/index.adoc[Database Development]` bullet, add a nested sub-bullet after the SQL Reference
    one:
    `** xref:database/mongodb/index.adoc[MongoDB Reference] -- the document database: BSON documents, the Query
    API and aggregation pipeline, indexing, schema design, transactions, replication and sharding, plus a
    downloadable cheat sheet.`
    Add `MongoDB`, `document database`, `NoSQL`, `aggregation pipeline` to the page `:keywords:`.
- [x] Task 25. Build and verify
  - _Done: `npx antora antora-playbook.yml` (delegated to an `iru-gate-runner` sub-agent) exited 0 with **zero
    warnings and zero errors** — no unresolved `xref:`, no missing `image::` / `attachment$`, no
    source-highlighter warnings; nothing needed fixing, so there is no diff versus a `main` baseline. Verified in
    `build/site/`: `database/mongodb/` holds `index.html` + all 19 content pages + `cheat-sheet.html`; the nav
    shows the "MongoDB Reference" group with every child link; `_attachments/mongodb-cheat-sheet.pdf` (139 KB)
    exists and `cheat-sheet.html` links to it; all 8 `mongodb-*.svg` are in `_images/` and referenced from the
    content pages; the `[mermaid]` blocks render (`crud-insert-and-write-concern`, `aggregation-pipeline`,
    `replication`, `transactions`). Docs-only; no tests/coverage/quality tooling applies — this build is the
    consolidated Group 4 validation._
  - [x] Task 25.1. Delegate the build to a sub-agent so its output stays out of the main context — e.g.
    `Agent({description: "Antora build for MongoDB Reference", subagent_type: "iru-gate-runner", prompt: "Run
    `npx antora antora-playbook.yml` from the repo root. Report: exit status; any AsciiDoc/xref warnings or
    errors (especially unresolved `xref:` targets, missing `image::` files, missing `attachment$`, or
    source-highlighter warnings); and confirm `build/site/ROOT/database/mongodb/` contains an HTML page for the
    index + all 19 content pages + the cheat sheet."})`.
  - [x] Task 25.2. Fix any issue the build reports (broken `xref:`/`image::`/`attachment$` targets, malformed
    `[mermaid]` blocks, `[source,...]` highlighter warnings — fall back to `[source,text]` where needed) and
    re-run until the build completes cleanly with **no new** warnings/errors versus a `main` baseline.
    - Nothing to fix: the first build was already clean (no warnings/errors of any kind).
  - [x] Task 25.3. Spot-check the rendered `build/site` for the new section: the nav shows the "MongoDB
    Reference" `***` group with all `****` children; `index.adoc`, every content page, and the cheat-sheet page
    render; the `xref:attachment$mongodb-cheat-sheet.pdf[…]` link resolves to the checked-in PDF; every
    `mongodb-*.svg` and every `[mermaid]` diagram renders (and the SVGs are legible in both light and dark
    theme).

## Notes for the implementer

- **Every concept sub-task above is a content requirement, not a heading requirement** — merge related
  sub-tasks under one `==` / `===` section where that reads better, as long as each carries its runnable
  example and official-docs link.
- **Do not check in the cheat-sheet HTML source** — only `modules/ROOT/attachments/mongodb-cheat-sheet.pdf` is
  committed, consistent with every prior section.
- **Keep the book out of the prose.** If a sentence would read "the book explains…", rewrite it as original
  explanation with a `https://www.mongodb.com/docs/manual/…` citation. The only two places the book may appear
  are `mongodb-disclaimer.adoc` and the `== Bibliography` on `index.adoc` / `cheat-sheet.adoc`.
- **Atlas-only features** (Atlas Search, Atlas Vector Search, Queryable Encryption KMS wiring, Atlas backup) are
  overview + link only — never step-by-step.
