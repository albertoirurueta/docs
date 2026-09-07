# Implementation Plan: Database Development / Elasticsearch Reference

## Task summary

Source: GitHub issue #70

Issue [#70](https://github.com/albertoirurueta/docs/issues/70) ("Add \"Elasticsearch Reference\" documentation
section under Guides & References / Database Development") asks to add a new **"Elasticsearch Reference"**
subsection under the existing **Guides & References / Database Development** section of this repo's own `ROOT`
Antora component, at `modules/ROOT/pages/database/elasticsearch/` — the fourth sibling of the existing
`database/sql/`, `database/mongodb/` and `database/couchbase/` subsections. It documents **Elasticsearch** as a
database-developer reference — the document/index data model, mapping and text analysis, indexing and the Query
DSL, relevance and aggregations, joins, search features, geospatial, vector/semantic search, the alternative
query languages, the distributed model, index lifecycle and scaling, performance tuning, administration and
snapshots, security, and the clients/REST conventions — plus a one-page downloadable PDF cheat sheet. Content is
written and verified against **the current Elasticsearch line** (9.x, with 8.19 as the final 8.x release; no
specific patch version pinned) at https://www.elastic.co/docs /
https://www.elastic.co/guide/en/elasticsearch/reference/current/. Explanations must be brief and example-driven;
**every concept carries at least one runnable example and at least one link to the specific Elasticsearch
documentation page it documents**. `[mermaid]` diagrams and hand-authored inline **SVG** figures (under
`modules/ROOT/images/`, named `elasticsearch-*.svg`) are used **only where a diagram genuinely helps**.

One PDF book was consulted while planning this section — *Elasticsearch in Action* (Radu Gheorghe, Matthew Lee
Hinman, Roy Russo, Manning Publications, 2016, ISBN 9781617291623). Its code targets **Elasticsearch 1.5 / the
1.x branch** and predates the `text`/`keyword` split, BM25 as the default similarity, mapping-type removal, the
`join` field (replacing `_parent`), runtime fields, ingest pipelines, ILM and data streams, vector/semantic
search and retrievers, ES|QL / EQL / SQL, and Stack security. It is cited **only as a bibliography entry**, never
as the "primary" or "main" reference. The official documentation is the source every page is written and verified
against; where the book and the current documentation disagree, **the official documentation wins** and the
difference is noted. The 2023 second edition (Madhusudhan Konda, Manning, ISBN 9781617299858, covering
Elasticsearch 8.x) is listed as a bibliography pointer only.

This is the same pattern already used for the SQL, MongoDB, Couchbase, and the various Web/Backend reference
sections. The closest structural precedents are
[.archive/implementation_plan_45.md](.archive/implementation_plan_45.md) (issue #45, "Couchbase Reference") and
[.archive/implementation_plan_37.md](.archive/implementation_plan_37.md) (issue #37, "MongoDB Reference") — a new
`database/<engine>/` subsection grounded in an official doc site plus a bibliography-only book that predates the
current version, with mermaid diagrams, hand-authored SVG figures, a `== Bibliography`, and a
headless-Chrome-rendered one-page PDF cheat sheet, organised into four task groups.

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **Page count consolidated to 22 content pages + 1 cheat sheet + 1 section index (24 `.adoc` files)**, from
   the issue's ~27-page list (the issue explicitly says "merges are acceptable"). Merges applied: the issue's
   `tokenizers-and-token-filters` is folded into `text-analysis`; optimistic-concurrency-control is folded into
   `indexing-crud-and-bulk`; `query-dsl-compound` + `relevance-and-scoring` become one
   `compound-queries-and-relevance` page; `snapshot-and-restore` is folded into
   `administration-monitoring-and-snapshots`. `geospatial` and `search-extras` stay separate (each is a sizable,
   self-contained area). Every page still maps to a coherent area of the official documentation. A downstream
   `iru-code` run may merge two pages further if one turns out too thin — not re-planned as separate tasks.
2. **`[source,console]` is the primary example style** (the Kibana Dev Tools / REST `GET /index/_search` form the
   Elastic docs themselves use), with `[source,bash]` for cURL and `[source,json]` for standalone payloads where
   useful. This matches the issue's stated preference and the existing MongoDB/SQL pages' use of `[source,…]`.
   No `source-highlighter` is configured in `antora-playbook.yml`; Antora renders these as plain monospace
   blocks, which is fine and consistent with the rest of the site. (The Couchbase pages deliberately used bare
   `----` blocks; the Elasticsearch pages follow the issue and use `[source,…]` — noted so review does not flag
   it as an inconsistency.)
3. **Document the current Elasticsearch line as published at https://www.elastic.co/docs**, not pinned to a
   patch version — "9.x, with 8.19 as the final 8.x release" — mirroring the "current line, no patch pinned"
   convention of the MongoDB and Couchbase disclaimers. Examples use modern idioms: one type per index (`_doc`),
   `text` vs. `keyword`, BM25 (the default similarity), the `join` field (not `_parent`), `if_seq_no` /
   `if_primary_term` (not `version`), `search_after` + PIT (not `scroll` as the default), `dense_vector` + kNN,
   ES|QL. Where the book uses a 1.x-era pattern (`string` fields, TF/IDF, mapping types, `_parent`, `version`),
   the page documents the current approach and notes the change.
4. **The book is bibliography-only, and — deviation from the MongoDB/Couchbase/Java sections — the disclaimer
   partial and every per-page admonition name no source at all.** Per the issue's explicit requirement:
   admonitions must not mention _Elasticsearch in Action_, "consulted books", or "the sources below". The
   `elasticsearch-disclaimer.adoc` partial follows the **`sql-disclaimer.adoc` "book-free" variant** (states the
   line documented + the official doc site it is verified against + the AI-assistance caveat, and nothing else).
   All source attribution — the official documentation pages *and* the book — lives **only** in the
   `== Bibliography` section of `database/elasticsearch/index.adoc`. Admonitions may still cross-reference a
   specific official Elasticsearch doc page for more detail (normal cross-referencing, not source attribution).
5. **The subsection is named "Elasticsearch Reference"** in the section index title, the `database/index.adoc`
   bullet, the `nav.adoc` `***` entry, and the root `index.adoc` `**` sub-bullet — matching the existing
   "SQL Reference" / "MongoDB Reference" / "Couchbase Reference" siblings.
6. **Placed after "Couchbase Reference"**, as the fourth subsection of Database Development, in `nav.adoc`,
   `database/index.adoc`, and the root `index.adoc` — the "append in the order added" ordering every prior
   subsection followed. In `nav.adoc` the block goes after the Couchbase `**** … Cheat Sheet (PDF)` line and
   before `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`.
7. **Mermaid is the default for flow / sequence / state diagrams; seven hand-authored SVGs** where a spatial
   figure is clearer (all `elasticsearch-*.svg` under `modules/ROOT/images/`, authored to render in both the
   light and dark site themes like the existing `*.svg` figures):
   - `elasticsearch-analysis-chain.svg` — input text → character filters → tokenizer → token filters → indexed
     terms, with a worked example string.
   - `elasticsearch-inverted-index.svg` — three short documents → analyzed terms → postings lists (term →
     doc ids), beside the "why full-text ≠ `LIKE`" note.
   - `elasticsearch-shard-distribution.svg` — one index with 3 primaries + 1 replica each, distributed across
     3 nodes so no primary shares a node with its replica (distinct from the existing
     `springboot-elasticsearch-shards.svg`, which is a Spring-side figure).
   - `elasticsearch-query-then-fetch.svg` — coordinating node → query phase (scatter to all shards, gather
     sorted doc ids) → fetch phase (gather `_source` for the top N).
   - `elasticsearch-bool-query.svg` — a `bool` with `must` / `should` (scored) vs. `filter` / `must_not`
     (not scored, cacheable), and how `minimum_should_match` applies.
   - `elasticsearch-nested-vs-join.svg` — the same one-to-many data as a `nested` block (child objects stored
     inside the parent doc on one shard) vs. the `join` field (separate parent + child docs, routed to the same
     shard).
   - `elasticsearch-ilm-phases.svg` — an index rolling through hot → warm → cold → frozen → delete over time,
     with the data tier and the per-phase actions (`rollover`, `forcemerge`, `shrink`, `searchable_snapshot`,
     `delete`).
   Mermaid covers: the refresh → flush → segment-merge lifecycle (flowchart); the index-with-version-conflict
   retry loop (flowchart); the ILM rollover decision (`max_age` / `max_primary_shard_size` / `max_docs`)
   (flowchart); an incremental snapshot to a repository (sequence); master election / discovery
   (state diagram). The implementer may add or drop a figure while writing a page if it changes the value — not
   re-planned as separate tasks. **No diagram where a short code block or small table is clearer.**
8. **Cross-link the sibling `xref:database/sql/…`, `xref:database/mongodb/…` and `xref:database/couchbase/…`
   pages** instead of restating relational / document-database theory —
   `xref:database/sql/dml-queries.adoc` beside the Query DSL, `xref:database/sql/normalization.adoc` and
   `xref:database/mongodb/data-modeling.adoc` / `xref:database/couchbase/data-modeling.adoc` beside
   joins/denormalizing, `xref:database/mongodb/indexes.adoc` beside mapping/indexing,
   `xref:database/mongodb/special-indexes-and-search.adoc` and
   `xref:database/couchbase/search-analytics-eventing.adoc` beside text analysis / vector search,
   `xref:database/mongodb/replication.adoc` / `sharding.adoc` beside the distributed model,
   `xref:database/mongodb/transactions.adoc` beside the "no multi-document transactions" note. Specific
   cross-links are listed per task.
9. **No project-picker icon / `xref`** for Elasticsearch Reference — like the SQL / MongoDB / Couchbase
   siblings it lives only under the root `index.adoc`'s `== Guides & References` list and the nav, not as a
   remote-component picker tile; no `modules/ROOT/images/` picker icon.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    **static checked-in asset** at `modules/ROOT/attachments/elasticsearch-cheat-sheet.pdf`, linked via
    `xref:attachment$elasticsearch-cheat-sheet.pdf[Download the Elasticsearch Cheat Sheet (PDF)]`. Must be
    **exactly one A4 page** (page-count check + a rendered preview with no clipping). The HTML source is **not**
    checked in.
11. **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site
    with no application source; none of the installed `*-code-one-task` keys (`java`, `dotnet`, `database`)
    applies. Every task below is implemented directly, matching `.archive/implementation_plan_45.md` /
    `_37.md`.
12. **No "related questions" / quiz page** — not this section's pattern; issue #70 does not ask for one.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root (`ROOT`) component for the
  "Irurueta Docs" site. The Elasticsearch section is entirely new `.adoc` files plus small wiring edits.
- **`antora-playbook.yml`** — wires the `ROOT` local component (`url: .`, `branches: HEAD`), the UI bundle,
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks, CDN `mermaid@11`),
  and `@djencks/asciidoctor-mathjax`. No `source-highlighter` is set. `build/` is gitignored. Build command:
  `npx antora antora-playbook.yml` (no lint/test suite; success = build completes with no `xref`/AsciiDoc/mermaid
  errors and no "skipping reference to missing attribute" warnings, and `build/site` renders).
- **`modules/ROOT/nav.adoc`** — single nav tree. The Database Development block currently is:
  ```
  * Guides & References
  ** xref:database/index.adoc[Database Development]
  *** xref:database/choosing-the-right-database.adoc[Choosing the Right Database]
  *** xref:database/sql/index.adoc[SQL Reference]
  **** … (12 **** lines) …
  *** xref:database/mongodb/index.adoc[MongoDB Reference]
  **** … (19 **** lines) …
  *** xref:database/couchbase/index.adoc[Couchbase Reference]
  **** … (12 **** lines) …
  **** xref:database/couchbase/cheat-sheet.adoc[Cheat Sheet (PDF)]     ← last Couchbase line (nav.adoc:67)
  *** xref:database/schema-evolution/index.adoc[Evolving the Database Model]   ← next entry (nav.adoc:68)
  ```
  The new `*** xref:database/elasticsearch/index.adoc[Elasticsearch Reference]` block with its `****` page lines
  is inserted between `nav.adoc:67` and `nav.adoc:68`.
- **`modules/ROOT/pages/database/index.adoc`** — `= Database Development`, a lead paragraph, and a `== Sections`
  list currently holding five bullets (Choosing the Right Database, SQL Reference, MongoDB Reference, Couchbase
  Reference, Evolving the Database Model). Add an Elasticsearch Reference bullet after the Couchbase one; update
  `:description:` / `:keywords:` (it already lists `Elasticsearch` / `full-text search` / `vector database` as
  keywords).
- **`modules/ROOT/pages/index.adoc`** — the site home. `== Guides & References` (≈line 77) has a
  `* xref:database/index.adoc[Database Development]` bullet with nested `**` sub-bullets for Choosing the Right
  Database, SQL Reference, MongoDB Reference, Couchbase Reference. Add a fifth nested `**` sub-bullet for
  Elasticsearch Reference after the Couchbase one; update the page `:keywords:`.
- **`modules/ROOT/pages/database/choosing-the-right-database.adoc`** — already has a
  `== Full-Text Search Engines -- Elasticsearch` section (≈line 221) and a "Vector Databases" section that both
  discuss Elasticsearch, and a closing `== References` list. Add an
  `xref:database/elasticsearch/index.adoc[Elasticsearch Reference]` cross-link from the full-text-search section
  (and, if it reads naturally, the vector-databases section) — one link is enough; do not restate content.
- **`modules/ROOT/partials/`** — one disclaimer partial per section, in two variants:
  - **"book-free" variant** — `sql-disclaimer.adoc`: an `[IMPORTANT]` / `====` admonition that states what
    standard/line is documented, the official source it is verified against, and the "generated with the
    assistance of AI, verify before production" caveat. **No book is named.** The new
    `elasticsearch-disclaimer.adoc` follows **this** variant (choice 4).
  - "book-naming" variant — `mongodb-disclaimer.adoc` / `couchbase-disclaimer.adoc` / `java-disclaimer.adoc`:
    same, plus a paragraph naming the consulted book(s) as bibliography-only. **Not** used here.
- **`modules/ROOT/pages/database/mongodb/`** (21 `.adoc`) and **`.../couchbase/`** (15 `.adoc`) — the shape to
  mirror. Page shape: `= Title` → `:description:` (one sentence) → `:keywords:` (comma list) → blank line →
  `include::partial$elasticsearch-disclaimer.adoc[]` → one/two-sentence lead → `==` sections. `index.adoc` =
  header + disclaimer include + lead + `== What's covered` (one bullet per page, grouped) + `== Bibliography`.
  `cheat-sheet.adoc` = header + disclaimer include + short intro + grouped `xref:` back-links +
  `xref:attachment$elasticsearch-cheat-sheet.pdf[…]`.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures, one prefix per section
  (`mongodb-*.svg`, `couchbase-*.svg`, …), embedded with `image::<name>.svg[Alt text]`, authored for both light
  and dark themes. `springboot-elasticsearch-shards.svg` already exists (a Spring-side figure — the new
  `elasticsearch-shard-distribution.svg` is a distinct database-reference figure).
- **`modules/ROOT/attachments/`** — flat directory of checked-in `*-cheat-sheet.pdf` files, linked with
  `xref:attachment$<name>.pdf[…]`. No HTML sources are checked in.
- **`.claude/agents/iru-gate-runner.md`** exists; there is no test/coverage/quality gate for a docs-only change,
  so the only verification is the Antora build (Task 31), which the implementer may run via a sub-agent to keep
  the main context clean.
- **AsciiDoc gotcha**: inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute
  reference and emits a "skipping reference to missing attribute" build warning. Escape literal braces in prose
  as `\{ … }`; inside `[source]` blocks no escaping is needed. Generic-type syntax in prose (`List<String>`) is
  fine. The final build must have **zero** such warnings.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma-separated list), a blank
  line, then `include::partial$elasticsearch-disclaimer.adoc[]`, then a one/two-sentence lead — identical
  placement to `include::partial$couchbase-disclaimer.adoc[]` in the Couchbase pages.
- **Brief, example-driven prose.** Every distinct concept on the page gets **at least one runnable example**
  (`[source,console]` Dev Tools / REST as the primary style; `[source,bash]` cURL / `[source,json]` where
  useful) **and at least one link to the specific
  `https://www.elastic.co/guide/en/elasticsearch/reference/current/…` (or `https://www.elastic.co/docs/…`)
  page** it documents — in prose and/or as a comment in the example.
- **No source is ever named in an admonition or in prose as "what this was written from".** Source attribution
  (official doc pages and the book) appears **only** in `index.adoc`'s `== Bibliography` and — for the official
  doc site only — in the disclaimer partial. Cross-referencing a specific official doc page for further detail
  is fine and encouraged.
- **Modern idioms only** (choice 3): one type per index / `_doc`, `text` vs. `keyword`, BM25, the `join` field,
  `if_seq_no`/`if_primary_term`, `search_after` + PIT. Where the 1.x-era approach differs, note the change in
  one line rather than documenting the old way.
- **Diagrams**: `[mermaid]` for flow / sequence / state diagrams; hand-authored inline **SVG** under
  `modules/ROOT/images/` named `elasticsearch-*.svg` for the spatial figures in choice 7; **no diagram where a
  code block or small table is clearer.**
- **Cross-links**: `xref:database/sql/<page>.adoc[…]`, `xref:database/mongodb/<page>.adoc[…]`,
  `xref:database/couchbase/<page>.adoc[…]` for the relational / document-database contrast (choice 8); link
  sibling Elasticsearch pages with `xref:database/elasticsearch/<page>.adoc[…]` rather than repeating material.
- Every page must be reachable from both `modules/ROOT/pages/database/elasticsearch/index.adoc` and
  `modules/ROOT/nav.adoc` once Group 4 lands.
- **Escape literal `{ }` in prose** as `\{ … }` (the AsciiDoc gotcha above).

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Elasticsearch disclaimer partial — `modules/ROOT/partials/elasticsearch-disclaimer.adoc` — created `modules/ROOT/partials/elasticsearch-disclaimer.adoc` as an `[IMPORTANT]`/`====` admonition mirroring the `sql-disclaimer.adoc` book-free variant (two paragraphs, no book/"consulted references"/"sources below" wording, no literal braces in prose). No tests/coverage/quality apply (Antora/AsciiDoc docs repo); Antora build deferred to Task 31.
  - [x] Task 1.1. Author it as an `[IMPORTANT]` / `====` admonition following the **`sql-disclaimer.adoc`
    "book-free" variant** (choice 4). It must state, in order: (a) this section documents **the current
    Elasticsearch line** — 9.x, with 8.19 as the final 8.x release — as published at
    https://www.elastic.co/docs[the Elasticsearch documentation], **which is the reference these pages are
    written and verified against**; no specific patch version is pinned; some capabilities (Kibana-only UIs, the
    ML/NLP model-management workflow, cross-cluster replication, and parts of the paid / serverless-only
    surface) are **linked, not documented in depth**; (b) this content was generated with the assistance of AI
    and should be verified against https://www.elastic.co/docs[the official documentation] before being relied
    on in production, as Elasticsearch iterates quickly. **It must not name any book, "consulted references",
    or "the sources below".**
  - [x] Task 1.2. Confirm the include path is `include::partial$elasticsearch-disclaimer.adoc[]` (Antora
    resolves `partial$` to `modules/ROOT/partials/`) — this exact line is placed after the header on every page
    created in Groups 2–4.

### Group 2 — Content pages

**Parallelizable: yes** — 22 independent pages (Tasks 2–23). Each includes the Group 1 disclaimer partial and
only cross-links other pages by `xref:` (no page needs another Group 2 page's finished text). Each page also
authors any `elasticsearch-*.svg` figure it embeds. Consolidated validation for the group is the Task 31 Antora
build.

- [x] Task 2. Create `modules/ROOT/pages/database/elasticsearch/getting-started.adoc` — What Elasticsearch is &
  how to run it
  - [x] Task 2.1. Elasticsearch as a **distributed, near-real-time JSON document store and search/analytics
    engine built on Apache Lucene**; the REST/JSON API; its place in the **Elastic Stack** (Kibana,
    Beats/Elastic Agent, Logstash); the release line (9.x; 8.19 as the last 8.x); what it is **not** (not a
    system of record for money-movement, not a primary transactional store — cross-link
    `xref:database/mongodb/transactions.adoc[MongoDB transactions]` and
    `xref:database/choosing-the-right-database.adoc[Choosing the Right Database]`).
  - [x] Task 2.2. **Running it**: single-node Docker (`docker run … elasticsearch:9.x`), the `elasticsearch`
    archive, Elastic Cloud / serverless; the security-on-by-default enrollment flow at first start (pointer to
    `security.adoc`); verifying with `GET /`.
  - [x] Task 2.3. **Talking to it in this section**: the Kibana **Dev Tools Console** syntax
    (`GET /_cluster/health`) used for `[source,console]` examples, the equivalent `curl` form, `?pretty`.
  - [x] Task 2.4. A first round-trip: create an index, index a document, `GET` it, run a `match` search —
    forward-pointing to `documents-and-indices.adoc`, `indexing-crud-and-bulk.adoc`, `search-api-and-pagination.adoc`.
  - [x] Task 2.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/elasticsearch-intro.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/run-elasticsearch-locally.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/quickstart.html
- [x] Task 3. Create `modules/ROOT/pages/database/elasticsearch/documents-and-indices.adoc` — Documents, indices
  & the inverted index
  - [x] Task 3.1. A **document** as a JSON object with `_source` and metadata fields (`_index`, `_id`,
    `_routing`, `_version`, `_seq_no`, `_primary_term`); one **type per index** (`_doc`) and the removal of
    mapping types (note the 1.x-era multi-type index).
  - [x] Task 3.2. An **index** as a collection of documents + settings + mappings; the create-index API
    (`PUT /my-index` with `settings` + `mappings`), `number_of_shards` / `number_of_replicas`, the `_cat/indices`
    quick look.
  - [x] Task 3.3. The **inverted index** and Lucene **segments** — documents analyzed into terms, terms →
    postings lists; why this beats `LIKE` (cross-link `xref:database/sql/dml-queries.adoc[SQL Queries]`). Embed
    `image::elasticsearch-inverted-index.svg[…]` (Task 3.6).
  - [x] Task 3.4. **Near-real-time search**: the `refresh` cycle (default 1s), why a just-indexed doc isn't
    immediately searchable, `?refresh=wait_for` / `?refresh=true`; forward-pointer to
    `performance-tuning.adoc` for `refresh_interval`.
  - [x] Task 3.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/documents-indices.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/near-real-time.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/indices.html
  - [x] Task 3.6. Author `modules/ROOT/images/elasticsearch-inverted-index.svg` — three short docs → analyzed
    terms → postings lists (term → doc ids); light/dark-theme safe.
- [x] Task 4. Create `modules/ROOT/pages/database/elasticsearch/mapping-and-field-types.adoc` — Mapping & field
  types
  - [x] Task 4.1. **Dynamic vs. explicit mapping**; viewing a mapping (`GET /my-index/_mapping`); why you pin
    an explicit mapping in production; `dynamic: strict` / `runtime` / `false`.
  - [x] Task 4.2. The main **field data types**: `text` vs. `keyword` (analyzed full-text vs. exact term —
    the single most important distinction; the `text` + `keyword` multi-field idiom), `match_only_text`,
    numeric types & `scaled_float`, `date` (formats), `boolean`, `object` vs. `nested`, `flattened`, `ip`,
    `range`, `geo_point` / `geo_shape` (pointer to `geospatial.adoc`), `dense_vector` / `sparse_vector`
    (pointer to `vector-and-semantic-search.adoc`), `join` (pointer to `joins-and-relationships.adoc`),
    `completion` (pointer to `search-extras.adoc`).
  - [x] Task 4.3. **Multi-fields** (`fields`), key **mapping parameters** (`analyzer` / `search_analyzer`,
    `format`, `index`, `doc_values`, `norms`, `copy_to`, `ignore_above`, `null_value`), **metadata fields**
    (`_source` enable/disable/`includes`/`excludes`, `_routing`, `_meta`).
  - [x] Task 4.4. **Dynamic templates** (`match_mapping_type`, `path_match`), **runtime fields**
    (schema-on-read: `runtime` in the mapping, `fields` at query time, `_search`-time `runtime_mappings`),
    **preventing mapping explosion** (`index.mapping.total_fields.limit`). Cross-link
    `xref:database/mongodb/data-modeling.adoc[MongoDB schema design]` for the schema-flexibility contrast.
  - [x] Task 4.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-types.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-params.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/runtime.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/dynamic-templates.html
- [x] Task 5. Create `modules/ROOT/pages/database/elasticsearch/text-analysis.adoc` — Text analysis, analyzers,
  tokenizers & token filters
  - [x] Task 5.1. **What analysis is**: the chain **character filters → tokenizer → token filters** applied at
    index time and (by default) query time; analyzed `text` vs. un-analyzed `keyword`. Embed
    `image::elasticsearch-analysis-chain.svg[…]` (Task 5.6).
  - [x] Task 5.2. **Built-in analyzers** (`standard`, `simple`, `whitespace`, `keyword`, `pattern`, `stop`, the
    language analyzers) and the **`_analyze` API** for testing; **custom analyzers** (`settings.analysis` with
    `char_filter` / `tokenizer` / `filter`); **`search_analyzer`** and when index- and search-time analysis
    should differ; **normalizers** for `keyword`.
  - [x] Task 5.3. **Tokenizers**: `standard`, `whitespace`, `pattern`, `keyword`, `char_group`, `path_hierarchy`,
    `ngram` / `edge_ngram` — with the partial-matching / autocomplete use case (and its index-size cost).
  - [x] Task 5.4. **Token filters** with practical recipes: `lowercase` / `asciifolding`, `stop`, `synonym` /
    `synonym_graph`, stemming (`stemmer` algorithmic, `stemmer_override`, `dictionary_decompounder`),
    `shingle`, `ngram` / `edge_ngram` as filters.
  - [x] Task 5.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-analyzers.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/test-analyzer.html
  - [x] Task 5.6. Author `modules/ROOT/images/elasticsearch-analysis-chain.svg` — input text → char filters →
    tokenizer → token filters → indexed terms, with a worked example string.
- [x] Task 6. Create `modules/ROOT/pages/database/elasticsearch/indexing-crud-and-bulk.adoc` — Indexing, CRUD,
  bulk & concurrency control
  - [x] Task 6.1. **Single-document APIs**: `PUT /idx/_doc/<id>` vs. `POST /idx/_doc` (auto-id) vs.
    `PUT /idx/_create/<id>`; `GET` / `HEAD`; `DELETE`; partial update (`POST /idx/_update/<id>` with `doc`),
    **scripted update** (Painless — pointer to `query-languages-and-scripting.adoc`), `upsert` /
    `doc_as_upsert` / `scripted_upsert`.
  - [x] Task 6.2. **Multi-document APIs**: the `_bulk` NDJSON format (action + source lines) and per-item error
    handling; `_mget`; `_update_by_query` and `_delete_by_query` (with a `query`, `conflicts: proceed`,
    `slices`); `_reindex` (local, remote, with a `script` or a `pipeline`).
  - [x] Task 6.3. **Optimistic concurrency control**: `_seq_no` + `_primary_term` and `if_seq_no` /
    `if_primary_term` on write; the version-conflict (409) response; the read → modify → retry loop; the legacy
    external `version` / `version_type=external` for syncing from a system of record. Embed a `[mermaid]`
    flowchart of the version-conflict retry loop.
  - [x] Task 6.4. The `refresh` request parameter (`false` default / `true` / `wait_for`) and its throughput
    cost; cross-link `xref:database/elasticsearch/performance-tuning.adoc` and
    `xref:database/couchbase/concurrency-locking-and-durability.adoc[Couchbase CAS]` /
    `xref:database/mongodb/crud-update-and-delete.adoc[MongoDB update operators]` for the concurrency contrast.
  - [x] Task 6.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/docs.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-update-by-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-reindex.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/optimistic-concurrency-control.html
- [x] Task 7. Create `modules/ROOT/pages/database/elasticsearch/ingest-pipelines.adoc` — Ingest pipelines &
  processors
  - [x] Task 7.1. **Ingest nodes** and where a pipeline runs (before indexing); creating a pipeline
    (`PUT /_ingest/pipeline/<id>`), attaching it (`?pipeline=`, `index.default_pipeline` /
    `index.final_pipeline`).
  - [x] Task 7.2. Common **processors**: `set` / `remove` / `rename` / `convert`, `grok` / `dissect`, `date`,
    `geoip`, `script`, `enrich` (+ the enrich policy), `pipeline` (nested); `on_failure` handlers and
    `ignore_failure`.
  - [x] Task 7.3. The **`_simulate` API** (with inline docs or `?verbose`) for iterating on a pipeline; a note
    that Logstash / Elastic Agent cover heavier transforms.
  - [x] Task 7.4. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/ingest.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/processors.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/simulate-pipeline-api.html
- [x] Task 8. Create `modules/ROOT/pages/database/elasticsearch/search-api-and-pagination.adoc` — The search API,
  paging & sorting
  - [x] Task 8.1. The **`_search` endpoint**: URI vs. request-body search, the response envelope
    (`took`, `timed_out`, `_shards`, `hits.total` (+ `track_total_hits`), `hits.max_score`, `hits.hits`);
    `_count`; `terminate_after`.
  - [x] Task 8.2. **Query vs. filter context** (scored vs. yes/no + cacheable) — the single most important
    performance concept; forward-pointer to `compound-queries-and-relevance.adoc`.
  - [x] Task 8.3. **Choosing fields**: `_source` filtering (`_source: false` / `includes` / `excludes`),
    `fields` (the recommended retrieval API, incl. runtime fields), `docvalue_fields`, `stored_fields`.
  - [x] Task 8.4. **Sorting** (`sort` on a field / `_score` / `_doc`, multi-level, missing / `unmapped_type`,
    `nested` sort pointer).
  - [x] Task 8.5. **Pagination**: `from` / `size` and the `index.max_result_window` ceiling; **`search_after`
    + point-in-time (PIT)** as the deep-paging method; **`scroll`** (and why PIT + `search_after` supersedes it
    for most uses); `preference` / `routing`.
  - [x] Task 8.6. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-your-data.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/point-in-time-api.html
- [x] Task 9. Create `modules/ROOT/pages/database/elasticsearch/query-dsl-full-text.adoc` — Full-text queries
  - [x] Task 9.1. How a full-text query is analyzed the same way the field was; `match` (with `operator`,
    `minimum_should_match`, `fuzziness`, `analyzer`), `match_phrase`, `match_phrase_prefix`.
  - [x] Task 9.2. `multi_match` and its `type`s (`best_fields`, `most_fields`, `cross_fields`, `phrase`,
    `phrase_prefix`, `bool_prefix`); `combined_fields`.
  - [x] Task 9.3. `query_string` and `simple_query_string` (the operator mini-language, when to expose which);
    `intervals` for ordered/proximity matching. Note KQL/Lucene syntax lives in
    `query-languages-and-scripting.adoc`.
  - [x] Task 9.4. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
- [x] Task 10. Create `modules/ROOT/pages/database/elasticsearch/query-dsl-term-level.adoc` — Term-level queries
  - [x] Task 10.1. Term-level queries do **not** analyze the search term — for `keyword`, numbers, dates,
    booleans; the classic "`term` on a `text` field returns nothing" gotcha and the fix (`.keyword` sub-field).
  - [x] Task 10.2. `term`, `terms` (+ the **terms-lookup** form), `terms_set`, `range` (numeric / date with
    **date math** `now-7d/d`), `exists`, `ids`.
  - [x] Task 10.3. The expensive ones and their cost: `prefix`, `wildcard`, `regexp`, `fuzzy` (and
    `search.allow_expensive_queries`); `wildcard` field type as the alternative.
  - [x] Task 10.4. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/term-level-queries.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-terms-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-range-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html#date-math
- [x] Task 11. Create `modules/ROOT/pages/database/elasticsearch/compound-queries-and-relevance.adoc` — Compound
  queries, relevance & scoring
  - [x] Task 11.1. **`bool`**: `must` / `should` / `filter` / `must_not`, `minimum_should_match`, how scoring
    combines, `filter` / `must_not` as (cacheable, unscored) filter context. Embed
    `image::elasticsearch-bool-query.svg[…]` (Task 11.6). Also `dis_max`, `constant_score`, `boosting`.
  - [x] Task 11.2. **Relevance**: **BM25** as the default similarity (one-paragraph TF/IDF → BM25 note, `k1` /
    `b`), field-length norms; the `_explain` API and `?explain=true`.
  - [x] Task 11.3. **Tuning score**: query-time `boost`, `indices_boost`, `_name`d queries (`matched_queries`).
  - [x] Task 11.4. **`function_score`** (`field_value_factor`, `script_score`, `random_score`, the decay
    functions `gauss` / `linear` / `exp`, `score_mode` / `boost_mode`) and the standalone **`script_score`**
    query; **`rescore`** (second-pass on the top-N).
  - [x] Task 11.5. Links:
    https://www.elastic.co/guide/en/elasticsearch/reference/current/compound-queries.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/relevance-scoring-theory.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-function-score-query.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/filter-search-results.html
  - [x] Task 11.6. Author `modules/ROOT/images/elasticsearch-bool-query.svg` — `must` / `should` (scored) vs.
    `filter` / `must_not` (unscored, cacheable), with `minimum_should_match`.
- [x] Task 12. Create `modules/ROOT/pages/database/elasticsearch/aggregations.adoc` — Aggregations
  - [x] Task 12.1. Running an aggregation alongside a query, `size: 0`, aggregations run on the query result
    set, `filter` / `post_filter` interaction.
  - [x] Task 12.2. **Metrics**: `avg` / `sum` / `min` / `max` / `stats` / `extended_stats` / `value_count`,
    `cardinality` (approximate), `percentiles` / `percentile_ranks` (approximate), `top_hits`.
  - [x] Task 12.3. **Bucket**: `terms` (+ `size` / `order` / the accuracy caveat), `range` / `date_range`,
    `histogram` / `date_histogram` (calendar vs. fixed intervals, `time_zone`), `filter` / `filters`,
    `nested` / `reverse_nested`, `composite` (paged, `after`).
  - [x] Task 12.4. **Sub-aggregations / nesting** (a metric inside a bucket; buckets inside buckets); **pipeline
    aggregations** (`derivative`, `cumulative_sum`, `moving_fn`, `bucket_script`, `bucket_selector`).
  - [x] Task 12.5. Cross-link `xref:database/mongodb/aggregation-pipeline.adoc[MongoDB Aggregation Pipeline]` and
    `xref:database/sql/aggregate-window-functions.adoc[SQL Aggregate & Window Functions]` for the contrast.
  - [x] Task 12.6. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-pipeline.html
- [x] Task 13. Create `modules/ROOT/pages/database/elasticsearch/joins-and-relationships.adoc` — Modelling
  relationships
  - [x] Task 13.1. Elasticsearch is **flat by default**; four options: `object` (flattened, arrays lose
    correlation), **`nested`** (child objects indexed as hidden sub-docs on the same shard; the `nested` query /
    `nested` aggregation / `inner_hits`; cost), the **`join` field** (`has_child` / `has_parent` / `parent_id`,
    routing + the single-shard constraint, `global_ordinals` cost), and **denormalizing / application-side
    joins** (usually the recommendation at scale) — plus `terms`-lookup as a lightweight join. Embed
    `image::elasticsearch-nested-vs-join.svg[…]` (Task 13.5).
  - [x] Task 13.2. Worked `nested` example (mapping + indexing + `nested` query + `inner_hits`).
  - [x] Task 13.3. Worked `join` example (mapping with `relations`, indexing parent + child with `routing`,
    `has_child` query).
  - [x] Task 13.4. Cross-link `xref:database/sql/relations.adoc[SQL Relations]`,
    `xref:database/mongodb/data-modeling.adoc[MongoDB Schema Design]`,
    `xref:database/couchbase/data-modeling.adoc[Couchbase Data Modeling]` for embed-vs-reference; a one-line
    "no cross-document ACID transactions" note pointing at
    `xref:database/mongodb/transactions.adoc[MongoDB transactions]`.
  - [x] Task 13.5. Author `modules/ROOT/images/elasticsearch-nested-vs-join.svg` — the same one-to-many data as
    a `nested` block vs. the `join` field (separate parent/child docs routed to one shard).
  - [x] Task 13.6. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/joining-queries.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/parent-join.html
- [x] Task 14. Create `modules/ROOT/pages/database/elasticsearch/search-extras.adoc` — Highlighting, suggesters,
  autocomplete, templates & percolation
  - [x] Task 14.1. **Highlighting** (`unified` / `plain` / `fvh`, `fields`, `fragment_size` /
    `number_of_fragments`, `pre_tags` / `post_tags`).
  - [x] Task 14.2. **Suggesters** (`term`, `phrase`, `completion` with the `completion` field type + contexts,
    the `search_as_you_type` field) — the autocomplete / did-you-mean toolbox; contrast with n-gram approaches
    from `text-analysis.adoc`.
  - [x] Task 14.3. **Result shaping**: `collapse` (+ `inner_hits`), `_msearch`.
  - [x] Task 14.4. **Search templates** (Mustache, `_render/template`, stored templates) and the **`percolate`
    query** (store queries, match a document against them — alerting / reverse search; the `percolator` field
    type).
  - [x] Task 14.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-suggesters.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-as-you-type.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-template.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-percolate-query.html
- [x] Task 15. Create `modules/ROOT/pages/database/elasticsearch/geospatial.adoc` — Geospatial data & queries
  - [x] Task 15.1. `geo_point` and `geo_shape` mappings (and the Cartesian `point` / `shape`); coordinate
    formats (object, string, array — the lon/lat order gotcha), GeoJSON / WKT for shapes.
  - [x] Task 15.2. **Geo queries**: `geo_bounding_box`, `geo_distance` (+ `distance_type`), `geo_shape`
    (relations: `intersects` / `within` / `contains` / `disjoint`), `geo_grid`.
  - [x] Task 15.3. **Geo aggregations**: `geo_distance`, `geohash_grid` / `geotile_grid` / `geohex_grid`,
    `geo_bounds`, `geo_centroid`; a note on Kibana Maps as the visual front end.
  - [x] Task 15.4. Cross-link `xref:database/mongodb/special-indexes-and-search.adoc[MongoDB geospatial
    indexes]` and `xref:database/couchbase/search-analytics-eventing.adoc[Couchbase geo search]`.
  - [x] Task 15.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-queries.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-shape.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-geohashgrid-aggregation.html
- [x] Task 16. Create `modules/ROOT/pages/database/elasticsearch/vector-and-semantic-search.adoc` — Vector &
  semantic search
  - [x] Task 16.1. **`dense_vector`** mapping (`dims`, `similarity`, `index: true` + HNSW `index_options`);
    **kNN search**: the top-level `knn` option (approximate, `k` / `num_candidates`), exact kNN via a
    `script_score` query, **filtered kNN**.
  - [x] Task 16.2. **`sparse_vector`** + **ELSER** (the `sparse_vector` query, the inference endpoint); the
    **`semantic_text`** field + the **`semantic` query** (mapping-time model wiring, chunking).
  - [x] Task 16.3. **Retrievers**: `standard`, `knn`, `rrf` (Reciprocal Rank Fusion for hybrid lexical +
    vector), `text_similarity_reranker`; a short hybrid-search example.
  - [x] Task 16.4. Cross-link `xref:database/choosing-the-right-database.adoc[Choosing the Right Database]`
    (vector-database section) and `xref:database/couchbase/search-analytics-eventing.adoc[Couchbase Vector
    Search]`. **Sourced from the official documentation only — the book predates this.**
  - [x] Task 16.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-semantic-text.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/retrievers-overview.html
- [x] Task 17. Create `modules/ROOT/pages/database/elasticsearch/query-languages-and-scripting.adoc` — ES|QL,
  EQL, SQL, KQL & Painless
  - [x] Task 17.1. Orientation table: Query DSL (JSON, full control) vs. **ES|QL** (piped, exploratory /
    aggregation) vs. **EQL** (event sequences) vs. **SQL** (`_sql`, BI / JDBC) vs. KQL/Lucene (Kibana bars).
  - [x] Task 17.2. **ES|QL**: `FROM … | WHERE … | STATS … BY … | SORT … | LIMIT`; the `_query` endpoint; a few
    worked examples; current known limits (result size, no nested-field access).
  - [x] Task 17.3. **EQL** for ordered security/log event sequences (`sequence by … with maxspan`); **SQL**
    (`POST /_sql?format=txt`, `translate`, JDBC/ODBC drivers, cursors).
  - [x] Task 17.4. **Painless**: script contexts (`script_score`, `runtime`, `_update`, `script_fields`,
    ingest `script`), `params`, `doc['field'].value`, stored scripts (`_scripts`), and the "prefer a query or
    runtime field first" guidance.
  - [x] Task 17.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/esql.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/eql.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/xpack-sql.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-scripting-painless.html
- [x] Task 18. Create `modules/ROOT/pages/database/elasticsearch/cluster-nodes-and-shards.adoc` — The
  distributed model
  - [x] Task 18.1. **Cluster → node → index → shard → segment**; primary vs. replica shards, why replicas give
    both HA and read throughput; `number_of_shards` is fixed at creation, `number_of_replicas` is dynamic. Embed
    `image::elasticsearch-shard-distribution.svg[…]` (Task 18.6).
  - [x] Task 18.2. **Node roles**: master-eligible, the data tiers (`data_content`, `data_hot`, `data_warm`,
    `data_cold`, `data_frozen`), `ingest`, `ml`, `remote_cluster_client`, coordinating-only; dedicated master
    guidance.
  - [x] Task 18.3. **Discovery & cluster formation**: `discovery.seed_hosts`, `cluster.initial_master_nodes`
    (bootstrap only), master election and the voting configuration / quorum, the cluster state and why large
    mappings bloat it. Embed a `[mermaid]` state diagram of master election.
  - [x] Task 18.4. **Routing & distributed execution**: `_routing` (default = `_id`) → which primary; custom
    routing and its trade-off; distributed indexing (primary → replicas); **query-then-fetch** search. Embed
    `image::elasticsearch-query-then-fetch.svg[…]` (Task 18.7).
  - [x] Task 18.5. **Cluster health** (`green` / `yellow` / `red`, `GET /_cluster/health`), unassigned shards
    and `_cluster/allocation/explain` (pointer to `administration-monitoring-and-snapshots.adoc`). Cross-link
    `xref:database/mongodb/replication.adoc[MongoDB Replica Sets]` and
    `xref:database/mongodb/sharding.adoc[MongoDB Sharding]`.
  - [x] Task 18.6. Author `modules/ROOT/images/elasticsearch-shard-distribution.svg` — one index, 3 primaries +
    1 replica each, spread across 3 nodes with no primary co-located with its replica.
  - [x] Task 18.7. Author `modules/ROOT/images/elasticsearch-query-then-fetch.svg` — coordinating node → query
    phase (scatter/gather sorted ids) → fetch phase (top-N `_source`).
  - [x] Task 18.8. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/scalability.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-node.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/modules-discovery.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/data-tiers.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-health.html
- [x] Task 19. Create `modules/ROOT/pages/database/elasticsearch/index-lifecycle-and-scaling.adoc` — Aliases,
  templates, data streams, ILM & scaling
  - [x] Task 19.1. **Shard sizing**: aim ~10–50 GB/shard, avoid over-sharding, one shard can't be split freely
    (`_split` / `_shrink` / `_clone` exist); time-based indices as the pattern for growing data.
  - [x] Task 19.2. **Aliases**: read aliases, the single **write alias** (`is_write_index`), filtered aliases,
    atomic swap via `POST /_aliases`.
  - [x] Task 19.3. **Index templates & component templates** (`_index_template` / `_component_template`,
    `index_patterns`, priority, `composed_of`); the built-in ECS templates note.
  - [x] Task 19.4. **Data streams** (append-only, backing indices, `@timestamp`, `_rollover`); **ILM** — the
    `hot` / `warm` / `cold` / `frozen` / `delete` phases and their actions (`rollover`, `forcemerge`, `shrink`,
    `allocate`, `searchable_snapshot`, `delete`), `min_age`, attaching a policy via a template; the simpler
    **data-stream lifecycle** (`lifecycle.data_retention`). Embed `image::elasticsearch-ilm-phases.svg[…]`
    (Task 19.7) and a `[mermaid]` flowchart of the rollover decision.
  - [x] Task 19.5. **Downsampling** of time-series data streams; **searchable snapshots** for cold/frozen.
  - [x] Task 19.6. Cross-link `xref:database/mongodb/sharding.adoc[MongoDB Sharding]` for the horizontal-scale
    contrast.
  - [x] Task 19.7. Author `modules/ROOT/images/elasticsearch-ilm-phases.svg` — an index moving hot → warm →
    cold → frozen → delete over time, with the tier and per-phase actions.
  - [x] Task 19.8. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/size-your-shards.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/aliases.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/index-templates.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/data-streams.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/index-lifecycle-management.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/data-management.html
- [x] Task 20. Create `modules/ROOT/pages/database/elasticsearch/performance-tuning.adoc` — Performance & the
  storage/caching model
  - [x] Task 20.1. **Indexing speed**: `_bulk` sizing, raise `refresh_interval` / disable replicas during
    bulk loads, auto-generated ids, the **translog** (`index.translog.durability`), why segments + the
    **refresh → flush → merge** lifecycle matters. Embed a `[mermaid]` flowchart of refresh → flush →
    segment-merge, and `_forcemerge` for read-only indices.
  - [x] Task 20.2. **Search speed**: query vs. filter context (cacheable), the **node query cache** and the
    **shard request cache**, `preference` for cache locality, `search_after` over deep `from`/`size`, mapping
    for speed (`keyword` vs. `text`, `eager_global_ordinals`, `index: false` on never-filtered fields).
  - [x] Task 20.3. **The `fielddata` trap**: `text` fielddata is disabled by default (OOM risk); use `doc_values`
    (`keyword` / numeric / date) or a `.keyword` sub-field for sorting/aggregating; `doc_values: false` when a
    field is never sorted/aggregated.
  - [x] Task 20.4. **Disk usage**: `index.codec: best_compression`, disabling `_source` (and the cost — no
    reindex / update / highlight), `synthetic` `_source`, `norms` / `doc_values` off where unused.
  - [x] Task 20.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-indexing-speed.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-search-speed.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/tune-for-disk-usage.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/near-real-time.html
- [x] Task 21. Create `modules/ROOT/pages/database/elasticsearch/administration-monitoring-and-snapshots.adoc` —
  Operating a cluster: monitoring, the cat APIs & backups
  - [x] Task 21.1. **The `_cat` APIs** (`_cat/health`, `_cat/nodes`, `_cat/indices`, `_cat/shards`,
    `_cat/allocation`, `_cat/thread_pool`, `?v` / `?format=json` / `?s=`); the cluster/nodes **stats & info**
    APIs; `_cluster/allocation/explain`; `_nodes/hot_threads`; `_tasks`; pending tasks.
  - [x] Task 21.2. **What to watch**: JVM heap pressure & GC, thread-pool rejections, disk watermarks & the
    read-only-allow-delete block, search/index latency, unassigned shards; **slow logs** (search + indexing,
    per-index thresholds); a note on Kibana **Stack Monitoring** / Elastic Agent.
  - [x] Task 21.3. **Snapshot & restore**: register a repository (`fs`, `s3`, `gcs`, `azure`),
    `PUT /_snapshot/<repo>/<snap>` (incremental — embed a `[mermaid]` sequence of an incremental snapshot),
    restore (whole / partial, rename patterns, `include_global_state`), **SLM** (`_slm/policy`, schedule,
    retention), a one-line pointer to **searchable snapshots** and **cross-cluster replication**.
  - [x] Task 21.4. Cross-link `xref:database/mongodb/administration-and-monitoring.adoc[MongoDB Administration &
    Monitoring]` and `xref:database/mongodb/backup-and-data-tools.adoc[MongoDB Backup]`.
  - [x] Task 21.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/cat.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/monitor-elasticsearch-cluster.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-restore.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/snapshot-lifecycle-management.html
- [x] Task 22. Create `modules/ROOT/pages/database/elasticsearch/security.adoc` — Securing a cluster
  - [x] Task 22.1. **Transport & HTTP TLS**, the first-start **enrollment** flow (`elasticsearch-reset-password`,
    `elasticsearch-create-enrollment-token`), the built-in users (`elastic`, `kibana_system`).
  - [x] Task 22.2. **Authentication realms**: `native` / `file`, LDAP / Active Directory, SAML, OIDC, PKI,
    Kerberos, and **API keys** (`POST /_security/api_key`) as the service-to-service default.
  - [x] Task 22.3. **Authorization (RBAC)**: roles (cluster + index privileges, `run_as`), users, role mappings;
    **field-level and document-level security**; the **audit log**; a one-line pointer to cross-cluster
    security.
  - [x] Task 22.4. Cross-link `xref:database/mongodb/security.adoc[MongoDB Security]` and
    `xref:database/couchbase/storage-security-and-administration.adoc[Couchbase Security]`. **Sourced from the
    official documentation only — the book predates Stack security.**
  - [x] Task 22.5. Links: https://www.elastic.co/guide/en/elasticsearch/reference/current/secure-cluster.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/setting-up-authentication.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/authorization.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/field-and-document-access-control.html
- [x] Task 23. Create `modules/ROOT/pages/database/elasticsearch/clients-and-rest-conventions.adoc` — Clients &
  REST API conventions
  - [x] Task 23.1. The **official language clients** (Java — the typed `ElasticsearchClient`, Python,
    JavaScript, Go, .NET, Ruby, PHP, Rust): what they share (transport, connection pooling / sniffing, typed
    requests), when to use a client vs. raw REST, connecting to Elastic Cloud (cloud id) / a secured cluster
    (API key).
  - [x] Task 23.2. **REST API conventions**: multi-target syntax and wildcards (`my-*`, `-exclude`,
    `_all`), `expand_wildcards`, **date math in index names** (`<logs-{now/d}>`), the common query params
    (`?pretty`, `?human`, `?filter_path=hits.hits._source`, `?error_trace`), `?format` / `?v` / `?s` on `_cat`,
    `wait_for_active_shards`.
  - [x] Task 23.3. **Compatibility**: the REST API compatibility header (`Accept` / `Content-Type` with
    `compatible-with=N`), the client-vs-server version-skew policy, `?include_type_name` history note.
  - [x] Task 23.4. Links: https://www.elastic.co/guide/en/elasticsearch/client/index.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/api-conventions.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/rest-apis.html,
    https://www.elastic.co/guide/en/elasticsearch/reference/current/common-options.html

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 25 renders the PDF that Task 24's page links, and Task 24's back-links reference
the Group 2 page titles. Depends on Group 2.

- [x] Task 24. Create `modules/ROOT/pages/database/elasticsearch/cheat-sheet.adoc` — created the page (header +
  `:description:` / `:keywords:` + `include::partial$elasticsearch-disclaimer.adoc[]` + intro + grouped `xref:`
  back-links to all 22 Group 2 pages + PDF download link), modelled on `database/couchbase/cheat-sheet.adoc`. No
  literal `{ }` braces in prose; every `xref:` target verified present on disk. No tests/coverage/quality apply
  (Antora/AsciiDoc docs repo); Antora build deferred to Task 31.
  - [x] Task 24.1. Header (`= Elasticsearch Cheat Sheet`, `:description:`, `:keywords:`) +
    `include::partial$elasticsearch-disclaimer.adoc[]` + a short intro sentence, then grouped `xref:` back-links
    to every Group 2 page (grouped as in the section index), following the shape of
    `modules/ROOT/pages/database/couchbase/cheat-sheet.adoc`.
  - [x] Task 24.2. End with `xref:attachment$elasticsearch-cheat-sheet.pdf[Download the Elasticsearch Cheat
    Sheet (PDF)]`. **No mention of the book** (all bibliography lives in `index.adoc`).
- [x] Task 25. Build `modules/ROOT/attachments/elasticsearch-cheat-sheet.pdf` — built a 17-box colour-coded
  single-page A4 layout in the scratchpad (not the repo), rendered with headless Chrome
  (`--headless --print-to-pdf --no-pdf-header-footer`), verified **1 page** and **209.9 x 297.0 mm (A4)** with
  PyMuPDF, and visually verified a 140-dpi PNG render plus zoomed quadrants show no clipped/overflowing content.
  Copied to `modules/ROOT/attachments/elasticsearch-cheat-sheet.pdf` (87 KB). HTML source left only in the
  scratchpad — `git status` shows no `.html` anywhere under the repo. No tests/coverage/quality apply.
  - [x] Task 25.1. In a scratch location, hand-build a print-ready single-page HTML/CSS layout — colour-coded
    boxes summarising: the `curl` / Dev Tools request shape + `?pretty` / `?filter_path`; create-index with
    `settings` + `mappings`; `text` vs. `keyword` + the multi-field idiom; the analysis chain; the CRUD +
    `_bulk` NDJSON + `if_seq_no`/`if_primary_term` skeletons; `_search` with query vs. filter context; the
    `match` / `multi_match` / `term` / `range` / `bool` query skeletons; `function_score` + `sort` +
    `search_after`/PIT; a metrics + `terms` + `date_histogram` aggregation skeleton; `nested` vs. `join`;
    top-level `knn` + a retriever; an ES|QL one-liner; the `_cat` one-liners
    (`_cat/health?v`, `_cat/indices?v`, `_cat/shards?v`); an alias swap + an ILM phase strip; a snapshot +
    restore skeleton; and a "query vs. filter context" decision strip.
  - [x] Task 25.2. Render to PDF with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
    verify it is **exactly one A4 page** (page-count check) and a rendered preview shows no clipping, then copy
    the PDF to `modules/ROOT/attachments/elasticsearch-cheat-sheet.pdf`. Do **not** check in the HTML source.

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 26–30 each edit a shared wiring file and Task 31 builds on all prior groups; the
build must run last.

- [x] Task 26. Create `modules/ROOT/pages/database/elasticsearch/index.adoc`
  - [x] Task 26.1. Header (`= Elasticsearch Reference`, `:description:`, `:keywords:`) +
    `include::partial$elasticsearch-disclaimer.adoc[]` + a lead paragraph introducing Elasticsearch (a
    distributed, Lucene-based JSON document store and search/analytics engine) and pointing new readers to
    `getting-started.adoc` → `documents-and-indices.adoc` → `mapping-and-field-types.adoc` →
    `search-api-and-pagination.adoc` first; a short line pointing to the sibling
    `xref:database/sql/index.adoc[SQL Reference]` / `xref:database/mongodb/index.adoc[MongoDB Reference]` /
    `xref:database/couchbase/index.adoc[Couchbase Reference]` for the baselines this section contrasts with.
  - [x] Task 26.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped:
    *Getting started* (getting-started); *Data model, mapping & analysis* (documents-and-indices,
    mapping-and-field-types, text-analysis); *Indexing* (indexing-crud-and-bulk, ingest-pipelines);
    *Searching & analytics* (search-api-and-pagination, query-dsl-full-text, query-dsl-term-level,
    compound-queries-and-relevance, aggregations, joins-and-relationships, search-extras, geospatial,
    vector-and-semantic-search, query-languages-and-scripting); *Distributed model & operations*
    (cluster-nodes-and-shards, index-lifecycle-and-scaling, performance-tuning,
    administration-monitoring-and-snapshots, security, clients-and-rest-conventions); *Cheat sheet*.
  - [x] Task 26.3. `== Bibliography` — **the only place any source is named.** List:
    - https://www.elastic.co/docs and
      https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html — the Elasticsearch Guide /
      Reference, the source every page is written and verified against — with the specific sub-area links used
      across the pages (intro, documents & indices, mapping / field types / mapping params / runtime fields,
      text analysis / analyzers / tokenizers / token filters, document & bulk & reindex APIs, optimistic
      concurrency control, ingest pipelines & processors, search your data / pagination / sort / fields / PIT,
      the Query DSL — full text / term-level / compound, relevance scoring theory, `function_score`, filter
      search results, aggregations — bucket / metrics / pipeline, joining queries / nested / parent-join,
      highlighting / suggesters / search-as-you-type / collapse / search templates / percolate, geo queries /
      geo-point / geo-shape / geo aggregations, kNN / dense vector / semantic search / `semantic_text` /
      retrievers, ES|QL / EQL / SQL / scripting / Painless, scalability / node roles / discovery / data tiers /
      cluster health, size your shards / aliases / index templates / data streams / ILM / data management,
      tune for indexing speed / search speed / disk usage, cat APIs / monitor a cluster / cluster APIs /
      snapshot-restore / SLM, secure the cluster / authentication / authorization / API keys / field-and-doc
      access control, API conventions / REST APIs / common options, and the Elasticsearch clients index).
    - https://www.elastic.co/guide/en/elasticsearch/guide/current/index.html — *Elasticsearch: The Definitive
      Guide* (Gormley & Tong, O'Reilly / Elastic) — the older conceptual companion published by Elastic; noted
      as background, superseded by the reference above for anything version-specific.
    - Gheorghe, Radu; Hinman, Matthew Lee; Russo, Roy. *Elasticsearch in Action*. Manning Publications, 2016.
      ISBN 9781617291623. Consulted as part of the bibliography for this section; its code targets Elasticsearch
      1.5 / the 1.x branch, so where it and the official documentation disagree the official documentation is
      authoritative and the difference is noted; none of its content is the primary or main reference for this
      section. Publisher page: https://www.manning.com/books/elasticsearch-in-action .
    - Konda, Madhusudhan. *Elasticsearch in Action, Second Edition*. Manning Publications, 2023. ISBN
      9781617299858. A ground-up rewrite covering Elasticsearch 8.x; listed as a pointer to a
      current-generation treatment of the same material. Publisher page:
      https://www.manning.com/books/elasticsearch-in-action-second-edition .
    - A closing sentence: the books are consulted bibliography references only and are **not** the primary
      reference for the section; the official documentation at https://www.elastic.co/docs wins on any
      discrepancy.
- [x] Task 27. Wire `modules/ROOT/nav.adoc`
  - [x] Task 27.1. Insert a `*** xref:database/elasticsearch/index.adoc[Elasticsearch Reference]` block with one
    `****` line per page **in the section-index order**, **after** the Couchbase block's
    `**** xref:database/couchbase/cheat-sheet.adoc[Cheat Sheet (PDF)]` line (`nav.adoc:67`) and **before**
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` (`nav.adoc:68`). Page order:
    getting-started, documents-and-indices, mapping-and-field-types, text-analysis, indexing-crud-and-bulk,
    ingest-pipelines, search-api-and-pagination, query-dsl-full-text, query-dsl-term-level,
    compound-queries-and-relevance, aggregations, joins-and-relationships, search-extras, geospatial,
    vector-and-semantic-search, query-languages-and-scripting, cluster-nodes-and-shards,
    index-lifecycle-and-scaling, performance-tuning, administration-monitoring-and-snapshots, security,
    clients-and-rest-conventions, then `**** xref:database/elasticsearch/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
    Use short link labels (e.g. `[Getting Started]`, `[Documents & Indices]`, `[Mapping & Field Types]`,
    `[Text Analysis]`, `[Indexing, CRUD & Bulk]`, `[Ingest Pipelines]`, `[Search API & Pagination]`,
    `[Full-text Queries]`, `[Term-level Queries]`, `[Compound Queries & Relevance]`, `[Aggregations]`,
    `[Joins & Relationships]`, `[Search Extras]`, `[Geospatial]`, `[Vector & Semantic Search]`,
    `[Query Languages & Scripting]`, `[Cluster, Nodes & Shards]`, `[Index Lifecycle & Scaling]`,
    `[Performance Tuning]`, `[Administration, Monitoring & Snapshots]`, `[Security]`,
    `[Clients & REST Conventions]`).
- [x] Task 28. Update `modules/ROOT/pages/database/index.adoc`
  - [x] Task 28.1. Add a `== Sections` bullet after the Couchbase Reference one:
    `xref:database/elasticsearch/index.adoc[Elasticsearch Reference] -- the search and analytics engine: the
    document/index model, mapping and text analysis, the Query DSL, relevance and aggregations, joins, vector
    and semantic search, the distributed model, index lifecycle, performance tuning, administration and
    security, plus a downloadable one-page cheat sheet.`
  - [x] Task 28.2. Extend the page `:description:` and `:keywords:` to mention Elasticsearch / search engine /
    Query DSL / aggregations / vector search (several are already present).
- [x] Task 29. Update `modules/ROOT/pages/index.adoc`
  - [x] Task 29.1. Add a nested `**` sub-bullet under Database Development (after the Couchbase Reference line):
    `** xref:database/elasticsearch/index.adoc[Elasticsearch Reference] -- the search and analytics engine:
    documents and mappings, text analysis, the Query DSL and aggregations, joins, vector and semantic search,
    the distributed model, index lifecycle, tuning and security, plus a one-page cheat sheet.`
  - [x] Task 29.2. Update the page `:keywords:` to include Elasticsearch (if not already present).
- [x] Task 30. Update `modules/ROOT/pages/database/choosing-the-right-database.adoc`
  - [x] Task 30.1. In the `== Full-Text Search Engines -- Elasticsearch` section, add one sentence with an
    `xref:database/elasticsearch/index.adoc[Elasticsearch Reference]` link (e.g. "For a hands-on reference to
    Elasticsearch itself -- mapping, the Query DSL, aggregations, the distributed model and operations -- see
    xref:database/elasticsearch/index.adoc[Elasticsearch Reference].").
  - [x] Task 30.2. Optionally add the same `xref` in the Vector Databases section where Elasticsearch kNN is
    mentioned, if it reads naturally. Do not restate content.
- [x] Task 31. Build & verify
  - [x] Task 31.1. Run `npx antora antora-playbook.yml` (via an `iru-gate-runner` / generic sub-agent to keep
    the main context clean). Fix any `xref` / AsciiDoc / missing-image / mermaid errors and any "skipping
    reference to missing attribute" warnings (unescaped `{ }` in prose) introduced by the new pages until the
    build completes clean.
  - [x] Task 31.2. Confirm every new page is reachable from both
    `modules/ROOT/pages/database/elasticsearch/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/database/elasticsearch/…` HTML renders (spot-check a page with a `[mermaid]` diagram and one
    with an SVG), and that `xref:attachment$elasticsearch-cheat-sheet.pdf` resolves to the checked-in PDF.
  - [x] Task 31.3. Re-open `modules/ROOT/attachments/elasticsearch-cheat-sheet.pdf` and confirm it is a single
    A4 page with no clipped content.
  - [x] Task 31.4. Grep the new pages for any admonition (`[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`,
    `[CAUTION]`) and confirm none names _Elasticsearch in Action_, "the book", "consulted", or "the sources" —
    all source attribution must be in `index.adoc`'s `== Bibliography` only (choice 4).
