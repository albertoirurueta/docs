# Implementation Plan: Database Development / Neo4j Reference

## Task summary

Source: GitHub issue #132
Base branch: main

Issue [#132](https://github.com/albertoirurueta/docs/issues/132) ("Add Neo4j documentation under Guides &
References / Databases") asks to add a full **Neo4j Reference** subsection under the existing **Guides &
References / Database Development** area of this repo's own `ROOT` Antora component, at
`modules/ROOT/pages/database/neo4j/` — a sibling of the existing `database/sql/`, `database/mongodb/`,
`database/couchbase/`, `database/elasticsearch/`, `database/solr/` and `database/lucene/` subsections. It
documents **Neo4j as a graph-database developer reference**: the property graph model, Cypher (fundamentals
through advanced querying), data modeling, importing data, indexes/constraints, transactions & drivers, APOC,
security/administration, clustering & multi-database, the Graph Data Science (GDS) library (fundamentals,
pathfinding/centrality, community detection, similarity/embeddings/ML pipelines), vector search & GenAI/GraphRAG,
worked use cases, and a comparison page — plus a downloadable one-page cheat sheet.

This issue is unusually complete: it already specifies the exact 20-file page list (in dependency order), the
official `neo4j.com` documentation paths to cite, a 6-book secondary bibliography (with ISBNs and per-book
coverage/version notes), 8 named SVG diagrams, the disclaimer content (Neo4j's 2025 move to calendar versioning,
current line `2026.x`), and the precise site-wiring edits. This plan follows that page list, source list and
bibliography directly rather than re-deriving them. The closest structural precedent is
`.archive/implementation_plan_84.md` (issue #84, "Apache Lucene Reference" — 27 content pages, 4 task groups),
whose task-group shape, per-page header/footer conventions, and site-wiring pattern this plan mirrors.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **All 20 files used exactly as the issue lists them** — index, cheat-sheet, and 18 topic pages in the issue's
   own "Foundations → Operating a Neo4j database → Graph Data Science → Applying it" order. No merges needed
   (unlike the Lucene plan, which merged some of a longer issue list); every page in the issue's list already
   maps to a coherent, appropriately-sized topic.
2. **The current, book-free disclaimer shape is used for `neo4j-disclaimer.adoc`, and no book is named in it.**
   Archive plan #84 (choice 4) described a "book-naming" vs. "book-free" split between disclaimer partials, but
   reading the actual current files (`mongodb-disclaimer.adoc`, `java-disclaimer.adoc`, `lucene-disclaimer.adoc`,
   `couchbase-disclaimer.adoc`) shows they now **all** share one shape regardless of whether their section cites
   books: state the documented version line, the official docs it's verified against, a short "linked, not
   documented in depth" list, the AI-assistance caveat, and a closing
   `xref:database/neo4j/index.adoc#_bibliography[bibliography]` pointer sentence — never naming a book or "the
   sources". All 6 books are cited **only** in `index.adoc`'s `== Bibliography`, exactly like Couchbase's 3 books
   today (confirmed by reading `database/couchbase/index.adoc`'s Bibliography section as the template for
   multi-book citation format: `Author, First. _Title_. Publisher, Year. ISBN ####.` + a "consulted as part of
   the bibliography" sentence with a publisher-page link, ending with a closing sentence that the books are
   bibliographic references only and the official docs are authoritative on conflict).
3. **`[source,cypher]` is the primary example style**, with `[source,java]` for Bolt-driver / Spring Data Neo4j
   snippets, `[source,xml]`/`[source,groovy]` for Maven/Gradle coordinates, and `[source,text]`/`[source,shell]`
   for `cypher-shell` / `neo4j-admin` CLI invocations. No `source-highlighter` is configured in
   `antora-playbook.yml`; these render as plain monospace blocks, consistent with the rest of the site.
4. **Document the current Neo4j calendar-versioned line, `2026.x`**, for both core Neo4j and the GDS library, per
   the issue's explicit note that Neo4j moved from semantic to calendar versioning (`YYYY.MM`) in 2025. No
   specific monthly patch is pinned, mirroring how the Couchbase/MongoDB disclaimers avoid pinning a patch.
5. **The 6 locally-available books are confirmed present** at `~/Desktop/neo4j1.pdf` through `neo4j6.pdf`
   (verified: 6.8 MB, 20.2 MB, 5.5 MB, 35.7 MB, 5.9 MB, and 18.7 MB respectively) and are cited by
   author/title/publisher/ISBN only — no fabricated page numbers, matching how the Lucene/Couchbase book
   citations were built.
6. **Placed after the "Apache Lucene Reference" block**, before `*** xref:database/schema-evolution/index.adoc`,
   in both `modules/ROOT/nav.adoc` and `database/index.adoc`'s `== Sections` — exactly as the issue requests, and
   consistent with every prior section's "append after the current last database reference" ordering.
7. **`modules/ROOT/pages/index.adoc` (the site home) is left structurally untouched** — `== Guides & References`
   is a picker-tile grid (`image::databases.svg[xref="database/index.adoc"]`) with no per-subsection bullets, so
   there is no sub-bullet to add (same as every prior database-reference addition). Its `:keywords:` line already
   lists `graph database`; this plan adds `Neo4j` and `Cypher` to that line for consistency with how the Lucene
   addition extended the same line with `Apache Lucene` — a small, low-risk keyword addition beyond what the
   issue explicitly asked for, called out here so it can be dropped in review if unwanted.
8. **Eight hand-authored SVGs**, flat/light-background style with hardcoded hex colors and no CSS-variable
   theming, matching `modules/ROOT/images/mongodb-document-hierarchy.svg` (per the issue's own explicit
   instruction — unlike Lucene's SVGs, which are theme-safe for both light/dark). `[mermaid]` is additionally
   used for the clustering topology and/or the GraphRAG pipeline where the issue notes a flowchart works well,
   validated with `npm run validate:mermaid` (installing `mermaid@11`/`jsdom` as transient dev dependencies first
   if not already present, per the issue's instruction).
9. **PDF generation**: no in-repo script exists for this (confirmed: `scripts/` holds only
   `validate-mermaid.mjs`) — same as every prior section. A hand-built, print-ready single-page A4 HTML/CSS
   layout is authored in the scratchpad (not the repo) and rendered to PDF via headless Chrome
   (`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless --print-to-pdf
   --no-pdf-header-footer`, confirmed available on this machine), then copied to
   `modules/ROOT/attachments/neo4j-cheat-sheet.pdf`. The HTML source is not checked in.
10. **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site
    with no application source; none of the installed `*-code-one-task` keys (`java`, `dotnet`, `database`)
    applies — Java/Cypher appear only inside `[source,...]` example blocks. Every task is implemented directly,
    matching `implementation_plan_84.md`.
11. **No project-picker icon** for the Neo4j Reference — like every other database-reference sibling it lives
    only under `database/index.adoc`'s `== Sections` list and the nav, not as a picker tile.
12. **No "related questions"/quiz page** — not this section's pattern; issue #132 does not ask for one.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root (`ROOT`) component for the
  "Irurueta Docs" site. The Neo4j section is entirely new `.adoc` files plus small wiring edits.
- **`antora-playbook.yml`** — wires the `ROOT` local component (`url: .`), the UI bundle,
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks, CDN `mermaid@11`),
  and `@djencks/asciidoctor-mathjax`. No `source-highlighter` is set. `build/` is gitignored. Build command:
  `npx antora antora-playbook.yml` (no lint/test suite; success = build completes with no `xref`/AsciiDoc/
  missing-image/mermaid errors and no "skipping reference to missing attribute" warnings, and `build/site`
  renders). `package.json` has `"validate:mermaid": "node scripts/validate-mermaid.mjs"`.
- **`modules/ROOT/nav.adoc`** — single nav tree. The Database Development block's tail currently reads (lines
  143–182, will shift as pages land — match on the surrounding `xref:` text, not the absolute line number):
  ```
  *** xref:database/lucene/index.adoc[Apache Lucene Reference]        (143)
  ****   … 27 page lines …                                            (144–170)
  **** xref:database/lucene/cheat-sheet.adoc[Cheat Sheet (PDF)]       (171)
  *** xref:database/schema-evolution/index.adoc[Evolving the Database Model]   (172)
  ****   … schema-evolution page lines …                              (173+)
  ```
  The new `*** xref:database/neo4j/index.adoc[Neo4j Reference]` block with its 19 `****` page lines (18 topic
  pages + cheat sheet) is inserted between line 171 and line 172.
- **`modules/ROOT/pages/database/index.adoc`** — `= Database Development`, a `:description:`/`:keywords:` pair
  (the `:keywords:` line **already lists** `graph database, Neo4j` — pre-anticipated), a lead paragraph, and a
  `== Sections` list currently holding 8 bullets (Choosing the Right Database, Pagination, SQL, MongoDB,
  Couchbase, Elasticsearch, Apache Solr, Apache Lucene References, then Evolving the Database Model). Add a Neo4j
  Reference bullet after the Apache Lucene Reference one, before Evolving the Database Model; extend
  `:description:` to add "Neo4j Reference" to its subsection list (its `:keywords:` already covers the topic).
- **`modules/ROOT/pages/index.adoc`** — the site home. `:keywords:` (line 3) already lists `graph database` (no
  `Neo4j` or `Cypher` yet); `== Guides & References` (line 94) is a picker-tile grid,
  `image::databases.svg[xref="database/index.adoc"]` (line 104), no per-subsection sub-bullets (choice 7).
- **`modules/ROOT/pages/database/choosing-the-right-database.adoc`** — has `== Graph Databases` (lines 336–361):
  covers the property-graph model, index-free adjacency, when to reach for a graph database, strengths/
  weaknesses, and closes with "See Neo4j's
  https://neo4j.com/blog/graph-database/graph-database-vs-relational-database/[graph vs. relational comparison]
  and https://www.designgurus.io/blog/graph-database-neo4j[this overview]." with **no xref to a Neo4j reference
  page** (since it doesn't exist yet). Add one sentence at the end of that paragraph cross-linking
  `xref:database/neo4j/index.adoc[Neo4j Reference]`.
- **`modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc`** — exists (507 lines), already thorough:
  `@Node`/`@Relationship`/`@RelationshipProperties`, node inheritance via multiple labels, `Neo4jRepository`,
  derived queries, `@Query` Cypher, geospatial `Point`/`Near`, projections, auditing,
  `@Transactional`/isolation, `@Version` optimistic locking, `Neo4jClient`. It **ends immediately after the
  `Neo4jClient` closing paragraph (line 507) — no `== See also` section exists**. Add one, cross-linking
  `property-graph-model.adoc`, `cypher-fundamentals.adoc`, `indexes-and-constraints.adoc`,
  `transactions-and-drivers.adoc`, `graph-data-science-fundamentals.adoc` +
  `pathfinding-and-centrality-algorithms.adoc`, and `vector-search-and-genai.adoc`. This page's own mapping
  content must not be duplicated in the new pages — only cross-linked.
- **`modules/ROOT/partials/`** — one disclaimer partial per section, all sharing one current shape (choice 2):
  `[IMPORTANT]`/`====` admonition stating the documented version line + the official docs it's verified against +
  a short "linked, not documented in depth" list + the AI-assistance caveat + a closing
  `xref:…#_bibliography[bibliography]` pointer sentence — confirmed by reading `mongodb-disclaimer.adoc`,
  `java-disclaimer.adoc` and `lucene-disclaimer.adoc` directly. No book is ever named in any current disclaimer
  partial. The new `neo4j-disclaimer.adoc` follows this exact shape.
- **`modules/ROOT/pages/database/couchbase/`** (15 files) and **`.../lucene/`** (29 files) — the shape to mirror.
  Page shape: `= Title` → `:description:` (one sentence) → `:keywords:` (comma list) → blank line →
  `include::partial$neo4j-disclaimer.adoc[]` → one/two-sentence lead → `==` sections. `index.adoc` = header +
  disclaimer include + lead + reading-order paragraph + sibling-reference pointer + `== What's covered` (one
  bullet per page, grouped as in the issue's Foundations/Operating/GDS/Applying-it/Cheat-sheet groups) +
  `== Bibliography` (the **only** place any source is named — official doc links grouped, then the 6 books in
  `Author, First. _Title_. Publisher, Year. ISBN ####.` format each with a "consulted as part of the
  bibliography" sentence and publisher-page link, per `database/couchbase/index.adoc`'s exact format, ending
  with a closing "bibliographic references only, official docs authoritative on conflict" sentence).
  `cheat-sheet.adoc` = header + disclaimer include + short intro + grouped `xref:` back-links + a closing
  `xref:attachment$neo4j-cheat-sheet.pdf[Download the Neo4j Cheat Sheet (PDF)]` line.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures. `mongodb-document-hierarchy.svg`
  is the style to mirror per the issue: `viewBox="0 0 720 440"`-scale, `font-family="Helvetica, Arial,
  sans-serif"`, flat light-background, hardcoded hex colors, no CSS variables, no dark-mode theming. No
  `neo4j-*.svg` exists yet.
- **`modules/ROOT/attachments/`** — flat directory of 34 checked-in `*-cheat-sheet.pdf` files (couchbase 169 KB,
  lucene 178 KB, mongodb 139 KB, elasticsearch 87 KB, solr 108 KB, etc.), linked with
  `xref:attachment$<name>.pdf[…]`. No `neo4j-cheat-sheet.pdf` exists yet; no HTML sources are checked in for any
  of them.
- **Books confirmed present**: `~/Desktop/neo4j1.pdf` (6.8 MB), `neo4j2.pdf` (20.2 MB), `neo4j3.pdf` (5.5 MB),
  `neo4j4.pdf` (35.7 MB), `neo4j5.pdf` (5.9 MB), `neo4j6.pdf` (18.7 MB).
- **Headless Chrome confirmed available**: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
- **`.claude/agents/iru-gate-runner.md`** exists; there is no test/coverage/quality gate for a docs-only change,
  so the only verification is the Antora build (Task 28), run via a sub-agent to keep the main context clean.
- **AsciiDoc gotcha, especially sharp for this section**: inline `{foo}` text *outside* `[source]` blocks is
  parsed as an Antora attribute reference and emits a "skipping reference to missing attribute" build warning.
  **Cypher's own map/pattern-property syntax is built on curly braces** (`(p:Person {name: $name})`,
  `MATCH (n) SET n += {a: 1, b: 2}`), so any Cypher fragment mentioned in prose *outside* a `[source,cypher]`
  block must have its braces escaped as `\{ … \}`. Inside `[source]` blocks no escaping is needed. The final
  build must have **zero** such warnings — take particular care here, more than in any prior section.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma-separated list), a blank
  line, then `include::partial$neo4j-disclaimer.adoc[]`, then a one/two-sentence lead.
- **Brief, example-driven prose.** Every distinct concept gets **at least one runnable `[source,cypher]`** (or
  `[source,java]` for driver/Spring Data code) **example and at least one link** to the specific official
  `neo4j.com` doc page it documents.
- **No source is ever named in an admonition or in prose as "what this was written from".** Source attribution
  (official docs *and* the 6 books) appears **only** in `index.adoc`'s `== Bibliography`, and — for the official
  site only — in the disclaimer partial. Cross-referencing a specific doc page for further detail is fine and
  encouraged.
- **Modern idioms only**: e.g. the current Cypher `SEARCH` clause for vector ANN queries (mentioning the older
  `db.index.vector.queryNodes` procedure only as a one-line contrast), current server roles (primary/secondary,
  not the legacy `CORE`/`READ_REPLICA` terms), composite databases (not "Fabric"). Where a cited book's version
  differs from current Neo4j, note the change in one line rather than documenting the old way.
- **Diagrams**: the 8 named SVGs (flat/light-background, hardcoded colors, no theming, per choice 8) plus
  `[mermaid]` for the clustering topology and/or GraphRAG pipeline flow. **No diagram where a code block or
  small table is clearer.**
- **Cross-links**: link sibling `xref:database/neo4j/<page>.adoc[…]` pages rather than repeating material, and
  `xref:backend/springboot/spring-data-neo4j.adoc` wherever a page's topic maps onto that existing Spring Data
  Neo4j content.
- Every page must be reachable from both `modules/ROOT/pages/database/neo4j/index.adoc` and
  `modules/ROOT/nav.adoc` once Group 4 lands.
- **Escape literal `{ }` in prose** as `\{ … \}` — see the AsciiDoc gotcha above; this applies constantly here
  given Cypher's map-literal syntax.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Neo4j disclaimer partial — `modules/ROOT/partials/neo4j-disclaimer.adoc` — created,
  mirroring the `[IMPORTANT]`/`====` shape confirmed against `mongodb-disclaimer.adoc`, `java-disclaimer.adoc`,
  and `lucene-disclaimer.adoc`. No tests/coverage/quality tooling applies (documentation-only Antora/AsciiDoc
  content, no application source).
  - [x] Task 1.1. Author it as an `[IMPORTANT]`/`====` admonition following the current shared shape (choice 2,
    confirmed against `mongodb-disclaimer.adoc`/`java-disclaimer.adoc`/`lucene-disclaimer.adoc`). State, in
    order: (a) this section documents **the current Neo4j `2026.x` calendar-versioned line** (Neo4j moved from
    semantic to calendar versioning, `YYYY.MM`, in 2025; the same line applies to the Graph Data Science
    library) as published at https://neo4j.com/docs/[the Neo4j documentation], **which is the reference these
    pages are written and verified against**; no specific monthly patch is pinned; some areas (Aura's internal
    infrastructure, the Raft consensus implementation details, and the GDS Pregel API's low-level internals) are
    **linked, not documented in depth**; (b) this content was generated with the assistance of AI and should be
    verified against https://neo4j.com/docs/[the official documentation] before being relied on in production,
    as Neo4j iterates quickly; (c) a closing line:
    `This section's xref:database/neo4j/index.adoc#_bibliography[bibliography] lists the reference material
    consulted while preparing these pages.` **It must not name any book, "consulted references", or "the
    sources below".** No literal unescaped `{ }` in the prose. — done; no book named, no unescaped braces
    (verified: content uses only backtick-quoted literals like `` `2026.x` `` and `` `YYYY.MM` ``, no `{ }`).
  - [x] Task 1.2. Confirm the include line is `include::partial$neo4j-disclaimer.adoc[]` (Antora resolves
    `partial$` to `modules/ROOT/partials/`) — this exact line is placed after the header on every page created in
    Groups 2–4. — confirmed; this is the correct Antora `partial$` syntax for later groups to use.

### Group 2 — Content pages

**Parallelizable: yes** — 18 independent pages (Tasks 2–19). Each includes the Group 1 disclaimer partial and
only cross-links other pages by `xref:` (no page needs another Group 2 page's finished text). Each page also
authors any `neo4j-*.svg` figure it embeds. Consolidated validation for the group is the Task 28 Antora build.

#### Foundations

- [x] Task 2. Create `modules/ROOT/pages/database/neo4j/getting-started.adoc` — created; no tests/coverage/quality
  tooling applies (documentation-only).
  - [x] Task 2.1. Editions (Community/Enterprise), deployment options (Neo4j Desktop, Docker, self-managed,
    Aura/AuraDB/AuraDS managed cloud), Neo4j Browser and `cypher-shell`. The 2025 move to calendar versioning
    (`YYYY.MM`), current line `2026.x`.
  - [x] Task 2.2. A first end-to-end round trip in `[source,cypher]`: `CREATE` a couple of `:Person`/`:Movie`
    nodes and an `ACTED_IN` relationship, then `MATCH`/`RETURN` them — forward-pointer to
    `property-graph-model.adoc` and `cypher-fundamentals.adoc`.
  - [x] Task 2.3. Links: https://neo4j.com/docs/getting-started/[Getting Started],
    https://neo4j.com/docs/getting-started/whats-neo4j/[What is Neo4j], https://neo4j.com/docs/aura/[Aura docs],
    https://neo4j.com/product/auradb/[AuraDB]. Cross-link sibling `xref:database/mongodb/getting-started.adoc`
    and `xref:database/couchbase/getting-started.adoc`, and `xref:database/choosing-the-right-database.adoc`.
- [x] Task 3. Create `modules/ROOT/pages/database/neo4j/property-graph-model.adoc` — created with
  `modules/ROOT/images/neo4j-property-graph-model.svg`; no tests/coverage/quality tooling applies.
  - [x] Task 3.1. Nodes, relationships (always directed and typed — direction matters for storage/traversal but
    queries can ignore it), labels (multiple labels per node), properties including temporal types, spatial
    `Point`, and `LIST`/`MAP` values. The schema-optional model (no upfront schema required, though constraints
    can enforce structure — forward-pointer to `indexes-and-constraints.adoc`).
  - [x] Task 3.2. Author `modules/ROOT/images/neo4j-property-graph-model.svg` — a small `:Person`–`ACTED_IN`–
    `:Movie` graph showing node labels, relationship direction/type, and properties on both nodes and the
    relationship; flat/light-background style (choice 8).
  - [x] Task 3.3. Links: https://neo4j.com/docs/getting-started/data-modeling/[Data Modeling],
    https://neo4j.com/docs/cypher-manual/current/values-and-types/vector/[Vector type doc] (forward-pointer for
    the vector value type covered fully in `vector-search-and-genai.adoc`). Cross-link
    `xref:database/mongodb/data-modeling.adoc` and `xref:database/couchbase/documents-keys-and-metadata.adoc` as
    contrasting document-model baselines.
- [x] Task 4. Create `modules/ROOT/pages/database/neo4j/cypher-fundamentals.adoc` — created with
  `modules/ROOT/images/neo4j-cypher-pattern-anatomy.svg`; no tests/coverage/quality tooling applies.
  - [x] Task 4.1. Pattern syntax (`()-[]-()`), `CREATE`/`MATCH`/`MERGE`/`WHERE`/`RETURN`/`SET`/`REMOVE`/`DELETE`/
    `DETACH DELETE`, and query parameters (`$name`). Emphasize escaping: every inline Cypher snippet mentioned in
    prose on this page (and every other page) must have literal `{ }` escaped as `\{ … \}` outside
    `[source,cypher]` blocks.
  - [x] Task 4.2. Author `modules/ROOT/images/neo4j-cypher-pattern-anatomy.svg` — an annotated
    `(a:Person {name: $name})-[:ACTED_IN {roles: $roles}]->(m:Movie)` pattern labeling each syntactic part
    (node, label, property map, relationship type, direction); flat/light-background style.
  - [x] Task 4.3. Links: https://neo4j.com/docs/cypher-manual/current/introduction/cypher-neo4j/[Cypher & Neo4j],
    https://neo4j.com/docs/cypher-manual/current/queries/[Queries],
    https://neo4j.com/docs/cypher-manual/current/clauses/[Clauses]. Cross-link `xref:database/sql/index.adoc`
    (as the SQL baseline Cypher is contrasted against for readers coming from relational).
- [x] Task 5. Create `modules/ROOT/pages/database/neo4j/cypher-advanced-querying.adoc` — created; no
  tests/coverage/quality tooling applies.
  - [x] Task 5.1. `WITH` for query chaining, `CALL { }` subqueries, `UNION`/`UNION ALL`, list/map comprehensions,
    `UNWIND`, `OPTIONAL MATCH`.
  - [x] Task 5.2. Variable-length paths (`-[:ACTED_IN*1..3]-`), `shortestPath()` and `allShortestPaths()`, with a
    worked `[source,cypher]` example on the running `:Person`/`:Movie`/`ACTED_IN` domain.
  - [x] Task 5.3. Links: https://neo4j.com/docs/cypher-manual/current/queries/[Queries] (subqueries/WITH
    sections), https://neo4j.com/docs/cypher-manual/current/clauses/[Clauses]. Cross-link
    `xref:database/neo4j/cypher-fundamentals.adoc`.
- [x] Task 6. Create `modules/ROOT/pages/database/neo4j/data-modeling.adoc` — created; no book named (neutral
  bibliography note only); no tests/coverage/quality tooling applies.
  - [x] Task 6.1. The modeling process: start from questions/use cases, not a static schema; node vs.
    relationship vs. property decisions (when a real-world "thing" should be a node vs. a property).
  - [x] Task 6.2. Relational-to-graph translation (a join table often becomes a relationship, not a node) and
    anti-patterns — supernodes (a single node with an extremely high relationship count) and how to mitigate
    them (intermediate nodes, relationship properties instead of fan-out). Versioned/temporal modeling patterns
    (e.g. dated relationships, snapshot nodes).
  - [x] Task 6.3. Cites Hutson & Jackson, *Graph Data Modeling in Python* (bibliography-only, per choice 2 — no
    book named in this page's prose, only a neutral note that "a dedicated Python-oriented treatment of this
    material exists — see the bibliography").
  - [x] Task 6.4. Links: https://neo4j.com/docs/getting-started/data-modeling/modeling-tips/[Modeling Tips],
    https://neo4j.com/docs/getting-started/data-modeling/modeling-designs/[Modeling Designs],
    https://neo4j.com/docs/getting-started/data-modeling/tutorial-data-modeling/[Data Modeling Tutorial].
    Cross-link `xref:database/mongodb/data-modeling.adoc` (schema design one layer over in a document store) and
    `xref:database/choosing-the-right-database.adoc`.

#### Operating a Neo4j database

- [x] Task 7. Create `modules/ROOT/pages/database/neo4j/importing-data.adoc` — created; no tests/coverage/quality
  tooling applies.
  - [x] Task 7.1. `LOAD CSV` with `CALL { ... } IN TRANSACTIONS` batching (the modern replacement for the removed
    `USING PERIODIC COMMIT`), a worked `[source,cypher]` example loading `:Person`/`:Movie` rows.
  - [x] Task 7.2. `neo4j-admin database import full` and `neo4j-admin database import incremental` for bulk
    offline loads, the Neo4j Desktop Data Importer tool, and `apoc.load.json`/`apoc.load.jdbc` for pulling from
    external sources (forward-pointer to `apoc-and-extensions.adoc`).
  - [x] Task 7.3. Links: https://neo4j.com/docs/cypher-manual/current/clauses/load-csv/[LOAD CSV],
    https://neo4j.com/docs/operations-manual/current/import/[Import],
    https://neo4j.com/docs/operations-manual/current/tutorial/neo4j-admin-import/[neo4j-admin import tutorial],
    https://neo4j.com/docs/getting-started/data-import/csv-files/[CSV import]. Cross-link
    `xref:database/mongodb/data-modeling.adoc` and `xref:database/sql/index.adoc` for contrasting bulk-load
    approaches.
- [x] Task 8. Create `modules/ROOT/pages/database/neo4j/indexes-and-constraints.adoc` — created with
  `modules/ROOT/images/neo4j-index-types.svg`; no tests/coverage/quality tooling applies.
  - [x] Task 8.1. Index types: range, text, point, composite, full-text, and vector indexes, each with a
    `[source,cypher]` `CREATE INDEX`/`CREATE VECTOR INDEX` example. Constraints: uniqueness, existence, node-key,
    and (Neo4j 5+) relationship/type constraints; `SHOW INDEXES`/`SHOW CONSTRAINTS`/`DROP INDEX`/`DROP
    CONSTRAINT`.
  - [x] Task 8.2. Author `modules/ROOT/images/neo4j-index-types.svg` — a small comparison figure of the index
    types (range/text/point/composite/full-text/vector) and what each accelerates; flat/light-background style.
  - [x] Task 8.3. Links: https://neo4j.com/docs/cypher-manual/current/indexes/[Indexes],
    https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/[Semantic Indexes],
    https://neo4j.com/docs/cypher-manual/current/indexes/semantic-indexes/vector-indexes/[Vector Indexes].
    Cross-link `xref:database/elasticsearch/index.adoc` and `xref:database/mongodb/index.adoc` as contrasting
    indexing models.
- [x] Task 9. Create `modules/ROOT/pages/database/neo4j/transactions-and-drivers.adoc` — created; no
  tests/coverage/quality tooling applies.
  - [x] Task 9.1. ACID guarantees plus causal consistency and bookmarks (read-your-writes across a causal
    cluster). The Bolt driver family (official Java, Python, JavaScript, .NET, Go drivers) and the common
    transaction-function pattern (`executeWrite`/`execute_write`, automatic retry on transient errors).
  - [x] Task 9.2. A `[source,java]` snippet using the official Java driver's `executeWrite` transaction function
    against the `:Person`/`:Movie` domain, contrasted with a short `[source,python]`-style note on the Python
    driver's `execute_write`.
  - [x] Task 9.3. Cross-link `xref:backend/springboot/spring-data-neo4j.adoc` explicitly — Spring Data Neo4j
    builds its `Neo4jTransactionManager`/`Neo4jClient` on top of exactly this driver/transaction-function layer.
  - [x] Task 9.4. Links: https://neo4j.com/docs/java-manual/current/connect/[Java driver: Connect],
    https://neo4j.com/docs/java-manual/current/transactions/[Java driver: Transactions],
    https://neo4j.com/docs/java-manual/current/concurrency/[Java driver: Concurrency],
    https://neo4j.com/docs/python-manual/current/connect/[Python driver: Connect],
    https://neo4j.com/docs/python-manual/current/transactions/[Python driver: Transactions].
- [x] Task 10. Create `modules/ROOT/pages/database/neo4j/apoc-and-extensions.adoc` — created; no
  tests/coverage/quality tooling applies.
  - [x] Task 10.1. Installing and allowlisting APOC (`apoc.import.file.enabled`, procedure/function allowlists in
    `neo4j.conf`). Refactoring procedures (`apoc.refactor.mergeNodes`, `apoc.refactor.rename*`), JSON/JDBC
    loading procedures, path-utility functions, periodic/batch procedures (`apoc.periodic.iterate`), and export
    procedures (`apoc.export.csv`/`apoc.export.json`).
  - [x] Task 10.2. Brief mentions of the wider extension ecosystem: the Neo4j GraphQL Library, the Kafka
    Connector, and the Spark Connector — one sentence each, with a link, not full coverage.
  - [x] Task 10.3. Links: https://neo4j.com/docs/apoc/current/[APOC docs],
    https://neo4j.com/docs/apoc/current/introduction/[APOC Introduction],
    https://neo4j.com/docs/apoc/current/installation/[APOC Installation],
    https://neo4j.com/labs/apoc/[APOC on Neo4j Labs].
- [x] Task 11. Create `modules/ROOT/pages/database/neo4j/security-and-administration.adoc` — created; used
  `xref:database/mongodb/security.adoc` (the actual existing MongoDB security page — the plan's literal
  `storage-security-and-administration.adoc` filename does not exist under `database/mongodb/`); no
  tests/coverage/quality tooling applies.
  - [x] Task 11.1. Authentication (native users, LDAP, OIDC) and role-based access control — built-in roles plus
    `GRANT`/`DENY`/`REVOKE` privilege statements, with a worked `[source,cypher]` `GRANT` example.
  - [x] Task 11.2. Multi-database basics (forward-pointer to `clustering-and-multi-database.adoc` for the full
    treatment), backup/restore, Bolt+TLS, and auditing.
  - [x] Task 11.3. Links: https://neo4j.com/docs/operations-manual/current/authentication-authorization/[Auth &
    Authorization], https://neo4j.com/docs/operations-manual/current/authentication-authorization/manage-privileges/[Manage
    Privileges], https://neo4j.com/docs/operations-manual/current/authentication-authorization/built-in-roles/[Built-in
    Roles]. Cross-link `xref:database/mongodb/security.adoc` (the equivalent security page that actually exists)
    as a contrasting RBAC model.
- [x] Task 12. Create `modules/ROOT/pages/database/neo4j/clustering-and-multi-database.adoc` — created with
  `modules/ROOT/images/neo4j-causal-clustering-topology.svg` plus a `[mermaid]` flowchart; cross-linked
  `xref:database/mongodb/replication.adoc`/`xref:database/mongodb/sharding.adoc` (the combined page name in this
  task doesn't exist under `database/mongodb/`); no tests/coverage/quality tooling applies.
  - [x] Task 12.1. Raft-based clustering: primary/secondary server roles (the current terms, replacing the
    legacy `CORE`/`READ_REPLICA` naming — note the terminology change in one line), leader election.
  - [x] Task 12.2. Multi-database (`CREATE DATABASE`, `SHOW DATABASES`) and composite databases (the current
    term, formerly "Fabric" — note the rename in one line). Aura's managed take on clustering/multi-database.
  - [x] Task 12.3. Author `modules/ROOT/images/neo4j-causal-clustering-topology.svg` — a Raft leader + followers
    topology with a load-balanced secondary tier; flat/light-background style. Optionally *also* author this as
    a `[mermaid]` flowchart if it clarifies the leader-election/replication flow better than the static SVG
    alone (issue's own suggestion) — the implementer decides based on which reads more clearly once drafted.
  - [x] Task 12.4. Links: https://neo4j.com/docs/operations-manual/current/clustering/[Clustering],
    https://neo4j.com/docs/operations-manual/current/clustering-advanced/lifecycle/[Clustering: Lifecycle].
    Cross-link `xref:database/mongodb/replication-and-sharding.adoc` and
    `xref:database/couchbase/clusters-replication-and-xdcr.adoc` as contrasting distributed-topology models.

#### Graph Data Science

- [x] Task 13. Create `modules/ROOT/pages/database/neo4j/graph-data-science-fundamentals.adoc` — created with
  `modules/ROOT/images/neo4j-native-vs-cypher-projection.svg` and `modules/ROOT/images/neo4j-algorithm-categories.svg`;
  no tests/coverage/quality tooling applies.
  - [x] Task 13.1. The GDS plugin and the in-memory graph catalog (`gds.graph.project`); native vs. Cypher
    projections and when to reach for each; the stream/mutate/write/stats execution modes common to every GDS
    algorithm; `gds.graph.drop`; memory estimation (`gds.graph.project.estimate`).
  - [x] Task 13.2. An algorithm-category overview: pathfinding & centrality, community detection, similarity &
    embeddings, and the ML pipelines — each a forward-pointer to its own page below.
  - [x] Task 13.3. Author `modules/ROOT/images/neo4j-native-vs-cypher-projection.svg` (native projection reading
    directly from the graph store vs. a Cypher-projection query building an arbitrary in-memory graph) and
    `modules/ROOT/images/neo4j-algorithm-categories.svg` (the four algorithm-category groups and their headline
    algorithms); both flat/light-background style.
  - [x] Task 13.4. Links: https://neo4j.com/docs/graph-data-science/current/[GDS docs],
    https://neo4j.com/docs/graph-data-science/current/introduction/[GDS Introduction],
    https://neo4j.com/docs/graph-data-science/current/getting-started/[GDS Getting Started],
    https://neo4j.com/docs/graph-data-science/current/algorithms/[GDS Algorithms].
- [x] Task 14. Create `modules/ROOT/pages/database/neo4j/pathfinding-and-centrality-algorithms.adoc` — created
  (pathfinding examples use a `:Location`/`:ROAD` domain per the allowed deviation); no tests/coverage/quality
  tooling applies.
  - [x] Task 14.1. Pathfinding: Dijkstra, A*, and Yen's k-shortest paths, each with a `[source,cypher]`
    `gds.<algo>.stream` call on the running domain (or a lightweight `:Location`/`ROAD` variant where the
    person/movie domain doesn't fit).
  - [x] Task 14.2. Centrality: Degree, PageRank (and Personalized PageRank via source nodes), Betweenness,
    Closeness, and Eigenvector centrality — one short example and one sentence on what each measures/is used
    for.
  - [x] Task 14.3. Cross-link `xref:database/neo4j/use-cases-and-algorithms-in-practice.adoc` (routing/logistics
    and fraud-ring use cases built on these algorithms) and
    `xref:database/neo4j/graph-data-science-fundamentals.adoc`. Links: the GDS Algorithms doc's pathfinding and
    centrality sections.
- [x] Task 15. Create `modules/ROOT/pages/database/neo4j/community-detection-algorithms.adoc` — created; no
  tests/coverage/quality tooling applies.
  - [x] Task 15.1. Weakly Connected Components (WCC) and Strongly Connected Components (SCC), Triangle Count and
    the Local Clustering Coefficient, Louvain, Label Propagation, and Leiden — one short `[source,cypher]`
    example and one sentence on what each is best suited for (Leiden as Louvain's more-stable successor, WCC as
    a quick "how many disconnected pieces" check, etc.).
  - [x] Task 15.2. Cross-link `xref:database/neo4j/use-cases-and-algorithms-in-practice.adoc` (fraud-ring
    detection built on WCC + Louvain + Betweenness). Links: the GDS Algorithms doc's community-detection section.
- [x] Task 16. Create `modules/ROOT/pages/database/neo4j/similarity-embeddings-and-ml-pipelines.adoc` — created;
  no book named (neutral bibliography note only); no tests/coverage/quality tooling applies.
  - [x] Task 16.1. Similarity: Node Similarity and KNN, with a `[source,cypher]` example finding similar
    `:Person` nodes by shared `ACTED_IN` neighborhoods.
  - [x] Task 16.2. Embeddings: FastRP and Node2Vec (fast, structural) vs. GraphSAGE (inductive, generalizes to
    unseen nodes) — when to reach for each.
  - [x] Task 16.3. The GDS ML pipelines: node-classification and link-prediction pipelines (feature steps →
    train → predict), at a conceptual level with one short pipeline-construction `[source,cypher]` sketch.
  - [x] Task 16.4. Cites Bratanič, *Graph Algorithms for Data Science*, and Scifo, *Graph Data Science with
    Neo4j* (bibliography-only, per choice 2).
  - [x] Task 16.5. Links: the GDS Algorithms doc's similarity/embeddings sections and the GDS ML pipelines
    pages. Cross-link `xref:database/neo4j/vector-search-and-genai.adoc` (embeddings feed vector search).
- [x] Task 17. Create `modules/ROOT/pages/database/neo4j/vector-search-and-genai.adoc` — created with
  `modules/ROOT/images/neo4j-graphrag-pipeline.svg`; no book named (neutral bibliography note only); no
  tests/coverage/quality tooling applies.
  - [x] Task 17.1. The native `VECTOR` property type and vector indexes (forward-reference back to
    `indexes-and-constraints.adoc` for `CREATE VECTOR INDEX` syntax). The modern Cypher `SEARCH` clause for
    vector ANN queries, contrasted in one line with the older `db.index.vector.queryNodes` procedure it
    supersedes.
  - [x] Task 17.2. The GraphRAG concept — combining vector similarity retrieval with graph traversal for
    context-richer retrieval-augmented generation. The official `neo4j-graphrag-python` package, and brief
    mentions of the LangChain4j and Spring AI integrations (with a cross-link to
    `xref:backend/springboot/spring-data-neo4j.adoc` for the Spring-side entity mapping these integrations sit
    on top of).
  - [x] Task 17.3. Author `modules/ROOT/images/neo4j-graphrag-pipeline.svg` — query → vector retrieval → graph
    expansion/traversal → LLM context → answer; flat/light-background style.
  - [x] Task 17.4. Cites Anthapu & Agarwal, *Building Neo4j-Powered Applications with LLMs* (bibliography-only).
  - [x] Task 17.5. Links: https://neo4j.com/docs/cypher-manual/current/clauses/search/[SEARCH clause],
    https://neo4j.com/docs/cypher-manual/current/values-and-types/vector/[Vector type],
    https://neo4j.com/docs/neo4j-graphrag-python/current/[neo4j-graphrag-python docs],
    https://neo4j.com/labs/genai-ecosystem/[GenAI Ecosystem],
    https://neo4j.com/labs/genai-ecosystem/langchain4j/[LangChain4j integration],
    https://neo4j.com/labs/genai-ecosystem/spring-ai/[Spring AI integration],
    https://neo4j.com/developer/genai-ecosystem/vector-search/[Vector Search developer guide].

#### Applying it

- [x] Task 18. Create `modules/ROOT/pages/database/neo4j/use-cases-and-algorithms-in-practice.adoc` — created
  with `modules/ROOT/images/neo4j-fraud-ring-detection.svg`; no book named anywhere (neutral bibliography notes
  only); no tests/coverage/quality tooling applies.
  - [x] Task 18.1. **Recommendation engines** — Node Similarity/KNN over shared interactions, with a runnable
    `[source,cypher]` sketch on the `:Person`/`:Movie` domain. Cites Anthapu & Agarwal and Hutson & Jackson.
  - [x] Task 18.2. **Fraud & AML ring detection** — WCC + Louvain + Betweenness Centrality to surface suspicious
    account clusters and their connecting "bridge" accounts. Author
    `modules/ROOT/images/neo4j-fraud-ring-detection.svg` (a small account graph with a highlighted ring and a
    high-betweenness bridge node); flat/light-background style. Cites Barrasa & Webber.
  - [x] Task 18.3. **Routing & logistics optimization** — Dijkstra/A* over a `:Location`-`ROAD` graph with
    weighted relationships.
  - [x] Task 18.4. **Identity & access graphs / entity resolution** — KYC-style deduplication using
    `apoc.refactor.mergeNodes` on candidate-duplicate identity nodes (cross-link
    `xref:database/neo4j/apoc-and-extensions.adoc`). Cites Barrasa & Webber.
  - [x] Task 18.5. **Root-cause & dependency analysis** — blast-radius traversal from a failing service node,
    single-point-of-failure/articulation-point identification, and dependency-cycle validation over a
    service-dependency graph. Cites Barrasa & Webber.
  - [x] Task 18.6. A closing paragraph tying the use cases back to master-data-management/knowledge-graph
    scenarios in general.
  - [x] Task 18.7. Cross-link `xref:database/neo4j/pathfinding-and-centrality-algorithms.adoc` and
    `xref:database/neo4j/community-detection-algorithms.adoc` (the algorithms each use case builds on).
- [x] Task 19. Create `modules/ROOT/pages/database/neo4j/neo4j-vs-relational-and-other-graph-databases.adoc` —
  created; no tests/coverage/quality tooling applies.
  - [x] Task 19.1. Index-free adjacency vs. joins, at the mechanism level (cross-link
    `xref:database/choosing-the-right-database.adoc` for the "when to choose a graph database" decision guidance
    rather than restating it here).
  - [x] Task 19.2. Qualitative positioning vs. Memgraph, Amazon Neptune, and ArangoDB (multi-model graph
    competitors), and vs. RDF/triple stores (a different graph data model — subject-predicate-object triples and
    SPARQL/reasoning, vs. Neo4j's labeled-property-graph model and Cypher).
  - [x] Task 19.3. A closing "when to reach for Neo4j specifically" section.
  - [x] Task 19.4. Links: https://neo4j.com/blog/graph-database/graph-database-vs-relational-database/[Neo4j:
    Graph vs. Relational] (already cited in `choosing-the-right-database.adoc` — reuse, don't re-source).

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 21 renders the PDF that Task 20's page links, and Task 20's back-links reference
the Group 2 page titles. Depends on Group 2.

- [x] Task 20. Create `modules/ROOT/pages/database/neo4j/cheat-sheet.adoc` — created following the
  `database/couchbase/cheat-sheet.adoc`/`database/lucene/cheat-sheet.adoc` shape; no tests/coverage/quality
  tooling applies (documentation-only).
  - [x] Task 20.1. Header (`= Neo4j Cheat Sheet`, `:description:`, `:keywords:`) +
    `include::partial$neo4j-disclaimer.adoc[]` + a short intro sentence, then grouped `xref:` back-links to all
    18 Group 2 pages in the Foundations/Operating/GDS/Applying-it groups, following the shape of
    `database/couchbase/cheat-sheet.adoc`/`database/lucene/cheat-sheet.adoc`. No literal `{ }` in prose; every
    `xref:` target verified present on disk — all 18 confirmed present.
  - [x] Task 20.2. End with `xref:attachment$neo4j-cheat-sheet.pdf[Download the Neo4j Cheat Sheet (PDF)]`. **No
    mention of any book** (all bibliography lives in `index.adoc`) — verified none present.
- [x] Task 21. Build `modules/ROOT/attachments/neo4j-cheat-sheet.pdf` — built in the scratchpad and copied in; no
  tests/coverage/quality tooling applies (documentation build artifact).
  - [x] Task 21.1. In the scratchpad (not the repo), hand-built a print-ready single-page A4 HTML/CSS layout —
    colour-coded boxes summarizing: Cypher core clauses + advanced querying; the property graph model; import
    (`LOAD CSV`/`neo4j-admin`); index/constraint types; transactions & the driver family; APOC highlights; the
    GDS projection + stream/mutate/write/stats modes + one card per algorithm family (pathfinding/centrality,
    community detection, similarity/embeddings/ML pipelines); vector search & GraphRAG; clustering/multi-database
    (primary/secondary, composite DBs); security & administration.
  - [x] Task 21.2. Rendered to PDF with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`);
    verified via PyMuPDF: **1 page**, 209.89mm × 297.01mm (A4, matching the existing couchbase/lucene cheat
    sheets' own rendered dimensions exactly). Full-page and zoomed-crop PNG previews (3x/6x) showed no
    clipped/overflowing content. Copied to `modules/ROOT/attachments/neo4j-cheat-sheet.pdf`. `git status
    --porcelain` confirms no `.html` file anywhere under the repo.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 22–27 each edit a shared wiring file (or depend on Group 2/3 output) and Task 28
builds on all prior groups; the build must run last.

- [x] Task 22. Create `modules/ROOT/pages/database/neo4j/index.adoc` -- created; no tests/coverage/quality
  tooling applies (documentation-only).
  - [x] Task 22.1. Header (`= Neo4j Reference`, `:description:`, `:keywords:`) +
    `include::partial$neo4j-disclaimer.adoc[]` + a lead paragraph (Neo4j as a native graph database: the
    property-graph model + Cypher) + a reading-order sentence (`getting-started` → `property-graph-model` →
    `cypher-fundamentals` → `cypher-advanced-querying` → `data-modeling`, then everything else builds on those) +
    a sibling-reference pointer (`xref:database/mongodb/index.adoc`, `xref:database/couchbase/index.adoc`, and
    `xref:database/choosing-the-right-database.adoc`).
  - [x] Task 22.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped exactly as the
    issue's own page plan: *Foundations* (getting-started, property-graph-model, cypher-fundamentals,
    cypher-advanced-querying, data-modeling); *Operating a Neo4j database* (importing-data,
    indexes-and-constraints, transactions-and-drivers, apoc-and-extensions, security-and-administration,
    clustering-and-multi-database); *Graph Data Science* (graph-data-science-fundamentals,
    pathfinding-and-centrality-algorithms, community-detection-algorithms,
    similarity-embeddings-and-ml-pipelines, vector-search-and-genai); *Applying it*
    (use-cases-and-algorithms-in-practice, neo4j-vs-relational-and-other-graph-databases); *Cheat sheet*. Escape
    any `{ }` in bullet text.
  - [x] Task 22.3. `== Bibliography` — **the only place any source is named.** List, grouped: all 6 ISBNs
    verified via web search against real publisher/retailer listings (Eastridge 978-81-97081-96-5, Scifo
    978-1-80461-274-3, Hutson & Jackson 978-1-80461-803-5, Bratanič 978-1-61729-946-9, Anthapu & Agarwal
    978-1-83620-623-1, Barrasa & Webber 978-1-09812-710-7), not fabricated.
    - https://neo4j.com/docs/[the Neo4j documentation] as the source every page is written and verified
      against, with sub-links to https://neo4j.com/docs/getting-started/[Getting Started],
      https://neo4j.com/docs/cypher-manual/current/[Cypher Manual],
      https://neo4j.com/docs/operations-manual/current/[Operations Manual],
      https://neo4j.com/docs/java-manual/current/[Java driver manual],
      https://neo4j.com/docs/python-manual/current/[Python driver manual],
      https://neo4j.com/docs/apoc/current/[APOC docs], https://neo4j.com/docs/graph-data-science/current/[GDS
      docs], https://neo4j.com/docs/aura/[Aura docs], and
      https://neo4j.com/docs/neo4j-graphrag-python/current/[neo4j-graphrag-python docs]. Current release line:
      Neo4j `2026.x` (calendar-versioned since 2025; same line for GDS).
    - https://neo4j.com/labs/genai-ecosystem/[the Neo4j GenAI ecosystem] and
      https://neo4j.com/developer/genai-ecosystem/vector-search/[the vector-search developer guide] — GraphRAG
      and vector-search material.
    - https://neo4j.com/blog/graph-database/graph-database-vs-relational-database/[Neo4j's graph vs. relational
      comparison] and https://www.designgurus.io/blog/graph-database-neo4j[this overview] — already cited in
      `database/choosing-the-right-database.adoc`, reused rather than re-sourced.
    - The 6 books, each as `Author, First. _Title_. Publisher, Year. ISBN ####.` + a "Consulted as part of the
      bibliography for this section" sentence with a publisher-page link where one exists, in the order and
      wording given by the issue: Eastridge (*Graph Data Science with Python and Neo4j*), Scifo (*Graph Data
      Science with Neo4j*), Hutson & Jackson (*Graph Data Modeling in Python*), Bratanič (*Graph Algorithms for
      Data Science*), Anthapu & Agarwal (*Building Neo4j-Powered Applications with LLMs*), Barrasa & Webber
      (*Building Knowledge Graphs: A Practitioner's Guide*).
    - A closing sentence: the 6 books are consulted bibliographic references only and are **not** the primary or
      main reference for the section; the official documentation at https://neo4j.com/docs/[neo4j.com/docs] wins
      on any discrepancy and the difference is noted (matching `database/couchbase/index.adoc`'s closing
      sentence pattern).
- [x] Task 23. Wire `modules/ROOT/nav.adoc` -- inserted; no tests/coverage/quality tooling applies.
  - [x] Task 23.1. Insert a `*** xref:database/neo4j/index.adoc[Neo4j Reference]` block with one `****` line per
    page, in the Task 22.2 grouping order, **after** the Apache Lucene block's last line
    `**** xref:database/lucene/cheat-sheet.adoc[Cheat Sheet (PDF)]` and **before**
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` (choice 6 — match on the
    surrounding `xref:` text, not the absolute line number). Page order: getting-started, property-graph-model,
    cypher-fundamentals, cypher-advanced-querying, data-modeling, importing-data, indexes-and-constraints,
    transactions-and-drivers, apoc-and-extensions, security-and-administration, clustering-and-multi-database,
    graph-data-science-fundamentals, pathfinding-and-centrality-algorithms, community-detection-algorithms,
    similarity-embeddings-and-ml-pipelines, vector-search-and-genai, use-cases-and-algorithms-in-practice,
    neo4j-vs-relational-and-other-graph-databases, then
    `**** xref:database/neo4j/cheat-sheet.adoc[Cheat Sheet (PDF)]` (19 `****` lines total). Use short link
    labels, e.g. `[Getting Started]`, `[Property Graph Model]`, `[Cypher Fundamentals]`,
    `[Cypher: Advanced Querying]`, `[Data Modeling]`, `[Importing Data]`, `[Indexes & Constraints]`,
    `[Transactions & Drivers]`, `[APOC & Extensions]`, `[Security & Administration]`,
    `[Clustering & Multi-Database]`, `[Graph Data Science Fundamentals]`,
    `[Pathfinding & Centrality Algorithms]`, `[Community Detection Algorithms]`,
    `[Similarity, Embeddings & ML Pipelines]`, `[Vector Search & GenAI]`,
    `[Use Cases & Algorithms in Practice]`, `[Neo4j vs. Relational & Other Graph Databases]`,
    `[Cheat Sheet (PDF)]`.
- [x] Task 24. Update `modules/ROOT/pages/database/index.adoc` -- updated; no tests/coverage/quality tooling
  applies.
  - [x] Task 24.1. Add a `== Sections` bullet **after** the Apache Lucene Reference one:
    `xref:database/neo4j/index.adoc[Neo4j Reference] -- the native graph database: the property graph model,
    Cypher fundamentals through advanced querying, data modeling, importing data, indexes and constraints,
    transactions and drivers, APOC, security and administration, clustering and multi-database, the Graph Data
    Science library (pathfinding, centrality, community detection, similarity, embeddings and ML pipelines),
    vector search and GraphRAG, worked use cases, and a comparison with relational and other graph databases,
    plus a downloadable one-page cheat sheet.`
  - [x] Task 24.2. Extend the page `:description:` to add "Neo4j Reference" to its list of subsections
    (`:keywords:` already lists `graph database, Neo4j`).
- [x] Task 25. Update `modules/ROOT/pages/index.adoc` — updated; no tests/coverage/quality tooling applies.
  - [x] Task 25.1. Add `Neo4j` and `Cypher` to the page `:keywords:` (line 3), after the existing `graph
    database` term (choice 7 — no sub-bullet to add; `== Guides & References` is a picker-tile grid with no
    per-subsection bullets).
- [x] Task 26. Update `modules/ROOT/pages/database/choosing-the-right-database.adoc` — updated; no
  tests/coverage/quality tooling applies.
  - [x] Task 26.1. In the `== Graph Databases` section, add one sentence at the end of the existing closing
    paragraph with an `xref:database/neo4j/index.adoc[Neo4j Reference]` link — e.g. "For a developer reference to
    Neo4j itself -- the property graph model, Cypher, data modeling, the Graph Data Science library, vector
    search and GraphRAG, and worked use cases -- see xref:database/neo4j/index.adoc[Neo4j Reference]." Do not
    restate content already covered in this section.
- [x] Task 27. Update `modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc` -- confirmed file still
  ended at line 507 with no `== See also` section before editing; updated. No tests/coverage/quality tooling
  applies.
  - [x] Task 27.1. Add a closing `== See also` section (the file currently ends at line 507 with no such
    section) cross-linking `xref:database/neo4j/property-graph-model.adoc`,
    `xref:database/neo4j/cypher-fundamentals.adoc`, `xref:database/neo4j/indexes-and-constraints.adoc`,
    `xref:database/neo4j/transactions-and-drivers.adoc`,
    `xref:database/neo4j/graph-data-science-fundamentals.adoc` +
    `xref:database/neo4j/pathfinding-and-centrality-algorithms.adoc`, and
    `xref:database/neo4j/vector-search-and-genai.adoc`. One sentence per link explaining what it adds beyond
    this page's `@Node`/`@Relationship`/`Neo4jClient` mapping content — do not duplicate that content here.
- [x] Task 28. Build & verify
  - [x] Task 28.1. Run `npx antora antora-playbook.yml` (no `--fetch`) via an `iru-gate-runner` sub-agent, e.g.
    `Agent({description: "Antora build", subagent_type: "iru-gate-runner", prompt: "Run npx antora
    antora-playbook.yml at the repo root and report every error and every 'skipping reference to missing
    attribute' warning verbatim."})`, to keep the main context clean. Fix any `xref`/AsciiDoc/missing-image/
    mermaid errors and any "skipping reference to missing attribute" warnings (unescaped `{ }` in prose,
    especially from Cypher map-literal snippets) introduced by the new pages until the build completes with
    **zero** errors and **zero** warnings.
    - Found one warning on the first run: `list item index: expected 1, got 2025` at
      `database/neo4j/index.adoc:119` — a bibliography line wrapped so the physical line started with
      `2025.`, which Asciidoctor's ordered-list autonumbering misread as an explicit list-item marker. Fixed by
      rewrapping the line so no line starts with a digit+period sequence. Rebuild confirmed: zero errors, zero
      warnings, no console output at all.
  - [x] Task 28.2. If any `[mermaid]` blocks were added (Task 12.3), run
    `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` and fix any reported diagram errors.
    - One `[mermaid]` block was added, in `clustering-and-multi-database.adoc`. `validate:mermaid` reports "All
      249 Mermaid diagrams parsed successfully" (site-wide, including the new one).
  - [x] Task 28.3. Confirm every new page is reachable from both
    `modules/ROOT/pages/database/neo4j/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/database/neo4j/…` HTML renders (spot-check a page with an SVG — e.g. `property-graph-model` or
    `use-cases-and-algorithms-in-practice` — and, if authored, a page with a `[mermaid]` diagram), and that
    `xref:attachment$neo4j-cheat-sheet.pdf` resolves to the checked-in PDF.
    - Confirmed: all 18 topic pages + cheat-sheet reachable from both `index.adoc`'s `== What's covered` and
      `nav.adoc`'s Neo4j block (19 unique xrefs each). `build/site/database/neo4j/` holds 20 HTML files.
      `property-graph-model.html` and `use-cases-and-algorithms-in-practice.html` render; all 8 `neo4j-*.svg`
      files are present in `build/site/_images/`; `clustering-and-multi-database.html` renders 1
      `class="mermaid"` block; `cheat-sheet.html` links `_attachments/neo4j-cheat-sheet.pdf`, present in
      `build/site/_attachments/`.
  - [x] Task 28.4. Re-open `modules/ROOT/attachments/neo4j-cheat-sheet.pdf` and confirm it is a single A4 page
    with no clipped content.
    - Confirmed via PyMuPDF and `pdfinfo`: 1 page, 594.96 × 841.92 pt (A4), 130,646 bytes, produced by headless
      Chrome (`Producer: Skia/PDF`, `Creator: HeadlessChrome`). Rendered a full-page PNG preview: colour-coded
      sections for Cypher core/advanced, property graph model, importing data, indexes/constraints,
      transactions/drivers, APOC, GDS projections/modes, pathfinding/centrality, community detection,
      similarity/embeddings/ML, vector search/GraphRAG, clustering/multi-database, and security/administration —
      no clipped or overflowing content.
  - [x] Task 28.5. Grep the new pages for any admonition (`[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`,
    `[CAUTION]`) and confirm none names any of the 6 books, "the book", "consulted", or "the sources" — all
    source attribution must be in `index.adoc`'s `== Bibliography` only (choice 2). Also grep for
    `include::partial$neo4j-disclaimer.adoc[]` in every new page (Tasks 2–20) to confirm the disclaimer is
    present, and grep for unescaped `{`/`}` in prose outside `[source]` blocks given how Cypher-heavy this
    section is.
    - Confirmed: the disclaimer include is present in all 20 files. One `[IMPORTANT]` admonition exists outside
      the disclaimer, in `cypher-fundamentals.adoc` — it documents the AsciiDoc brace-escaping gotcha itself
      (not a source attribution) and names no book. The only "consulted" hit outside `index.adoc` is ordinary
      prose in `neo4j-vs-relational-and-other-graph-databases.adoc` ("consulted to find a node's neighbours"),
      not source attribution. No book name appears outside `index.adoc`. The clean Antora build (Task 28.1)
      already confirms there are no unescaped-brace warnings anywhere in the new pages.
