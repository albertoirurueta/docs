# Implementation Plan: Database Development / Apache Lucene Reference

## Task summary

Source: GitHub issue #84

Issue [#84](https://github.com/albertoirurueta/docs/issues/84) ("Add \"Apache Lucene Reference\" documentation
section under Guides & References / Database Development") asks to add a new **"Apache Lucene Reference"**
subsection under the existing **Guides & References / Database Development** area of this repo's own `ROOT` Antora
component, at `modules/ROOT/pages/database/lucene/` — a sibling of the existing `database/sql/`,
`database/mongodb/`, `database/couchbase/`, `database/elasticsearch/` and `database/solr/` subsections. It
documents **Apache Lucene itself as a Java-developer reference** — the embedded, in-process search library that
Elasticsearch, OpenSearch and Apache Solr are all built on: the segment/codec index model, the indexing chain
(`IndexWriter`, `Directory`, `Analyzer`, `Document`/`Field`), text analysis, the `Query` API and query parsers,
points / BKD range search, BM25 and custom scoring, collectors and concurrent search, kNN/HNSW vector search,
faceting, highlighting, suggesters, grouping and joins, near-real-time search, and performance tuning. Content is
written and verified against **the current Apache Lucene 10.x line** (Lucene 10 requires Java 21; no patch
version pinned) at https://lucene.apache.org/core/. Explanations must be brief and example-driven; **every
concept carries at least one runnable `[source,java]` example and at least one link to the specific Lucene
Javadoc / module / site page it documents**. `[mermaid]` diagrams and hand-authored inline **SVG** figures
(under `modules/ROOT/images/`, named `lucene-*.svg`) are used **only where a diagram genuinely helps**.

One PDF book was consulted while planning this section — *Lucene in Action, Second Edition* (Michael McCandless,
Erik Hatcher, Otis Gospodnetić, Manning Publications, 2010, ISBN 9781933988177; local copy `~/Desktop/lucene.pdf`,
confirmed present). Its code targets **Lucene 3.0.x** and predates the Lucene 4 field-type / codec / `DocValues`
rewrite, points / BKD (6.x), BM25 as the default similarity (6.x), the `Filter` removal, `CustomAnalyzer`, the
`Intervals` API, `UnifiedHighlighter`, `FunctionScoreQuery`, `CollectorManager` / concurrent search, soft
deletes, the `Monitor` module, kNN / HNSW vector search (9.x) and the Java-21 / Panama `MMapDirectory` (10.x). It
is cited **only as a bibliography entry** in `index.adoc`, never as the "primary" or "main" reference; the
official documentation is authoritative and wins on any discrepancy, and the difference is noted in one line.

This is the same pattern already used for the SQL, MongoDB, Couchbase, Elasticsearch and Solr reference
sections. The closest structural precedents are `.archive/implementation_plan_70.md` (issue #70, "Elasticsearch
Reference" — 24 `.adoc` files, 4 task groups) and `.archive/implementation_plan_83.md` (Solr Reference — also
Lucene-based, includes a dedicated comparison page and a "book-free" disclaimer).

### Choices made on the user's behalf (best-practice defaults — stated here so they can be challenged during review)

1. **Page count consolidated to 27 content pages + 1 cheat sheet + 1 section index (29 `.adoc` files under
   `database/lucene/`)**, from the issue's 30-page content list (the issue explicitly says "merges are
   acceptable"). Merges applied:
   - issue #2 `architecture-and-index-format` + #3 `core-classes-and-data-flow` → one
     **`architecture-and-data-flow.adoc`** (the segment/codec index model and the indexing/search class chains
     are one coherent "how Lucene is put together" area).
   - issue #6 `indexing-operations` + #7 `merge-policies-and-scheduling` → one
     **`indexing-and-merge-policies.adoc`** (writing to the index and how those writes are merged back down
     belong together).
   - issue #24 `suggesters-and-spellcheck` + #25 `morelikethis-classification-and-highlighting` → one
     **`highlighting-suggesters-and-more.adoc`** (the `lucene-suggest` / `lucene-highlighter` /
     `lucene-classification` / `MoreLikeThis` "search extras" cluster).
   Every remaining page still maps to a coherent area of the official documentation. A downstream `iru-code` run
   may merge two pages further if one turns out too thin — not re-planned as separate tasks.
2. **`[source,java]` is the primary example style**, with `[source,xml]` / `[source,groovy]` for Maven / Gradle
   coordinates and `[source,text]` for query-parser syntax where useful. No `source-highlighter` is configured
   in `antora-playbook.yml`; Antora renders these as plain monospace blocks, consistent with the rest of the
   site (same situation noted in `implementation_plan_70.md`).
3. **Document the current Lucene 10.x line** as published at https://lucene.apache.org/core/, not pinned to a
   patch version — "10.x; Lucene 10 requires Java 21". **Modern idioms only**, per the issue: `IndexWriterConfig`,
   `TextField` / `StringField` / `KeywordField` / `StoredField` / `*Point` / `*DocValuesField` /
   `KnnFloatVectorField`; `BooleanQuery.Builder` / `PhraseQuery.Builder`; `BooleanClause.Occur.FILTER` (not
   `Filter`); `CustomAnalyzer.builder()`; `BM25Similarity` (the default); `FunctionScoreQuery` /
   `DoubleValuesSource` (not `CustomScoreQuery`); `CollectorManager` + `TopScoreDocCollectorManager` /
   `TopFieldCollectorManager`; `storedFields()` / `termVectors()` (not `IndexSearcher.doc`);
   `DirectoryReader.open(IndexWriter)` + `SearcherManager` for NRT. Where the book's 3.x approach differs, note
   the change in one line rather than documenting the old way.
4. **The book is bibliography-only, and the disclaimer partial and every per-page admonition name no source at
   all.** `modules/ROOT/partials/lucene-disclaimer.adoc` follows the **current "book-free" variant** shared by
   `elasticsearch-disclaimer.adoc` / `solr-disclaimer.adoc`: it states the line documented (Lucene 10.x, Java
   21+), the official site it is verified against (https://lucene.apache.org/core/), the "linked, not covered in
   depth" list (the Panama vector-API internals, codec file-format internals, the nightly benchmark harness), the
   AI-assistance caveat, and a closing `xref:database/lucene/index.adoc#_bibliography[bibliography]` pointer line
   (a section cross-reference, **not** a source name — this line is present in the current
   `elasticsearch-`/`solr-disclaimer.adoc` and is expected). It must **not** name any book, "consulted
   references", or "the sources below". All source attribution — the official documentation pages *and* the
   book — lives **only** in `database/lucene/index.adoc`'s `== Bibliography`. Per-page admonitions may still
   cross-link a specific Javadoc / doc page for more detail (normal cross-referencing, not source attribution).
5. **The subsection is named "Apache Lucene Reference"** in the section-index title, the `database/index.adoc`
   `== Sections` bullet and the `nav.adoc` `***` entry — matching the existing "SQL Reference" / "MongoDB
   Reference" / "Couchbase Reference" / "Elasticsearch Reference" / "Apache Solr Reference" siblings.
6. **Placed after the "Apache Solr Reference" block**, before `*** xref:database/schema-evolution/index.adoc`, in
   both `modules/ROOT/nav.adoc` and `database/index.adoc`'s `== Sections`. The issue text says "after the
   Elasticsearch block", but the **Apache Solr Reference block (`nav.adoc:104`–`136`) landed after issue #84 was
   filed** and now sits between Elasticsearch and "Evolving the Database Model". Appending after Solr keeps the
   site's established "append in the order added" ordering (see `implementation_plan_70.md` choice 6) and keeps
   "Evolving the Database Model" last. If review prefers it directly after Elasticsearch (before Solr), only the
   insertion point in Tasks 32–33 changes.
7. **`modules/ROOT/pages/index.adoc` wiring reduces to a `:keywords:` addition only.** The issue asks for a new
   nested `**` sub-bullet under Database Development there, but issue #88's root-site restructure **removed those
   per-reference sub-bullets** — `== Guides & References` is now a picker-tile grid
   (`image::databases.svg[xref="database/index.adoc"]`) with no per-subsection bullets. So there is no sub-bullet
   to add; the only change on that page is adding "Apache Lucene" to its `:keywords:` (Elasticsearch and Apache
   Solr are already listed).
8. **The comparison page `lucene-vs-solr-vs-elasticsearch-vs-opensearch.adoc` also cross-links the now-existing
   `xref:database/solr/index.adoc[Apache Solr Reference]` and
   `xref:database/solr/solr-vs-elasticsearch.adoc[Solr vs. Elasticsearch]`**, in addition to the issue's
   requested `xref:database/elasticsearch/index.adoc`, `xref:backend/springboot/solr.adoc` and
   `xref:backend/springboot/elasticsearch.adoc`. Both Solr pages exist on `main` and are the natural
   deeper-comparison targets.
9. **Nine hand-authored SVGs** (all `lucene-*.svg` under `modules/ROOT/images/`, authored to render in both the
   light and dark site themes like the existing `*.svg` figures), plus `[mermaid]` for flow / sequence / state
   diagrams. `lucene-segments-and-merges` may be a `[mermaid]` flowchart instead of an SVG. The implementer may
   add or drop a figure while writing a page if it changes the value — not re-planned as separate tasks. **No
   diagram where a short code block or small table is clearer.**
10. **No project-picker icon / `xref`** for the Apache Lucene Reference — like the SQL / MongoDB / Couchbase /
    Elasticsearch / Solr siblings it lives only under `database/index.adoc`'s `== Sections` list and the nav, not
    as a picker tile; no `modules/ROOT/images/` picker icon.
11. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    **static checked-in asset** at `modules/ROOT/attachments/lucene-cheat-sheet.pdf`, linked via
    `xref:attachment$lucene-cheat-sheet.pdf[Download the Apache Lucene Cheat Sheet (PDF)]`. Must be **exactly one
    A4 page** (page-count check + a rendered preview with no clipping). The HTML source is **not** checked in.
12. **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site
    with no application source; none of the installed `*-code-one-task` keys (`java`, `dotnet`, `database`)
    applies. Java appears only inside `[source,java]` example blocks, never as compiled source. Every task below
    is implemented directly, matching `implementation_plan_70.md` / `_83.md`.
13. **No "related questions" / quiz page** — not this section's pattern; issue #84 does not ask for one.

## Current code state

- This repo has **no application source code** — it is the Antora playbook + root (`ROOT`) component for the
  "Irurueta Docs" site. The Apache Lucene section is entirely new `.adoc` files plus small wiring edits.
- **`antora-playbook.yml`** — wires the `ROOT` local component (`url: .`), the UI bundle,
  `@antora/lunr-extension` (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks, CDN `mermaid@11`),
  and `@djencks/asciidoctor-mathjax`. No `source-highlighter` is set. `build/` is gitignored. Build command:
  `npx antora antora-playbook.yml` (no lint/test suite; success = build completes with no `xref`/AsciiDoc/
  missing-image/mermaid errors and no "skipping reference to missing attribute" warnings, and `build/site`
  renders).
- **`modules/ROOT/nav.adoc`** — single nav tree. The Database Development block currently runs `nav.adoc:29`–
  `nav.adoc:152`:
  ```
  ** xref:database/index.adoc[Databases]                                              (29)
  *** xref:database/choosing-the-right-database.adoc[Choosing the Right Database]      (30)
  *** xref:database/sql/index.adoc[SQL Reference]              + 11 **** lines         (31–43)
  *** xref:database/mongodb/index.adoc[MongoDB Reference]      + 19 **** lines         (44–64)
  *** xref:database/couchbase/index.adoc[Couchbase Reference]  + 13 **** lines         (65–79)
  *** xref:database/elasticsearch/index.adoc[Elasticsearch Reference] + 22 **** lines  (80–103)
  *** xref:database/solr/index.adoc[Apache Solr Reference]     + 31 **** lines         (104–136)
  ****   … last Solr line: xref:database/solr/cheat-sheet.adoc[Cheat Sheet (PDF)]      (136)
  *** xref:database/schema-evolution/index.adoc[Evolving the Database Model] + 15 ****  (137–152)
  ```
  The new `*** xref:database/lucene/index.adoc[Apache Lucene Reference]` block with its `****` page lines is
  inserted between `nav.adoc:136` and `nav.adoc:137` (choice 6). Line numbers will shift as pages land — match on
  the surrounding `xref:` text, not the absolute line.
- **`modules/ROOT/pages/database/index.adoc`** — `= Database Development`, a lead paragraph, and a `== Sections`
  list currently holding seven bullets (Choosing the Right Database, SQL Reference, MongoDB Reference, Couchbase
  Reference, Elasticsearch Reference, Apache Solr Reference, Evolving the Database Model). Add an Apache Lucene
  Reference bullet after the Apache Solr Reference one; extend `:description:` / `:keywords:` to mention Lucene
  (they already list Elasticsearch / Apache Solr / full-text search / vector database).
- **`modules/ROOT/pages/index.adoc`** — the site home. `= Welcome`; `== Guides & References` (≈line 94) is a
  picker-tile grid, `image::databases.svg[xref="database/index.adoc"]` at line 104, **no per-subsection
  sub-bullets** (choice 7). The page `:keywords:` (line 3) lists `Elasticsearch, Apache Solr, SolrCloud, SolrJ,
  full-text search, vector database` — add `Apache Lucene` (and, if it reads naturally, `inverted index`,
  `BM25`, `kNN`).
- **`modules/ROOT/pages/database/choosing-the-right-database.adoc`** — has `== Full-Text Search Engines --
  Elasticsearch` (`:221`) which already `xref:`s both `database/elasticsearch/index.adoc` and
  `database/solr/index.adoc`, and `== Vector Databases` (`:297`) which mentions Elasticsearch kNN and overlaps
  the full-text section. Add one sentence in the full-text section with an
  `xref:database/lucene/index.adoc[Apache Lucene Reference]` link ("…the embedded Java library both are built
  on…"), and optionally one in the Vector Databases section if it reads naturally. One link is enough; do not
  restate content.
- **`modules/ROOT/partials/`** — one disclaimer partial per section. The **current "book-free" variant**
  (`elasticsearch-disclaimer.adoc`, `solr-disclaimer.adoc`): an `[IMPORTANT]` / `====` admonition stating the
  line documented + the official site it is verified against + a "linked, not documented in depth" list + the
  AI-assistance caveat + a closing `xref:…#_bibliography[bibliography]` pointer line. **No book is named.** The
  new `lucene-disclaimer.adoc` follows this exact shape (choice 4). (`sql-disclaimer.adoc` is an older, shorter
  book-free variant; `mongodb-`/`couchbase-`/`java-disclaimer.adoc` are the "book-naming" variant and are **not**
  used here.)
- **`modules/ROOT/pages/database/elasticsearch/`** (24 `.adoc`) and **`.../solr/`** (33 `.adoc`) — the shape to
  mirror. Page shape: `= Title` → `:description:` (one sentence) → `:keywords:` (comma list) → blank line →
  `include::partial$lucene-disclaimer.adoc[]` → one/two-sentence lead → `==` sections. `index.adoc` = header +
  disclaimer include + lead + reading-order paragraph + sibling-reference pointer + `== What's covered` (one
  bullet per page, grouped, `\{ }` in bullet text escaped) + `== Bibliography` (the **only** place any source is
  named). `cheat-sheet.adoc` = header + disclaimer include + short intro + grouped `xref:` back-links +
  `xref:attachment$lucene-cheat-sheet.pdf[…]`.
- **`modules/ROOT/images/`** — flat directory of hand-authored `*.svg` figures, one prefix per section
  (`elasticsearch-*.svg`, `couchbase-*.svg`, …), embedded with `image::<name>.svg[Alt text]`, authored for both
  light and dark themes. No `lucene-*.svg` exists yet (`hibernate-search-lucene-vs-elasticsearch.svg` is an
  unrelated Hibernate-side figure).
- **`modules/ROOT/attachments/`** — flat directory of checked-in `*-cheat-sheet.pdf` files, linked with
  `xref:attachment$<name>.pdf[…]`. No HTML sources are checked in.
- **`.claude/agents/iru-gate-runner.md`** exists; there is no test/coverage/quality gate for a docs-only change,
  so the only verification is the Antora build (Task 36), which the implementer may run via a sub-agent to keep
  the main context clean.
- **AsciiDoc gotcha**: inline `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute
  reference and emits a "skipping reference to missing attribute" build warning. Escape literal braces in prose
  as `\{ … }`; inside `[source]` blocks no escaping is needed. Generic-type syntax in prose (`List<String>`) is
  fine. The final build must have **zero** such warnings. Lucene query-parser syntax (`title:foo AND {a TO b}`,
  `field:/regex/`) and code identifiers with braces are common here — take care in prose.

## Conventions every content page in this plan must follow

- **Header**: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma-separated list), a blank
  line, then `include::partial$lucene-disclaimer.adoc[]`, then a one/two-sentence lead — identical placement to
  `include::partial$elasticsearch-disclaimer.adoc[]` in the Elasticsearch pages.
- **Brief, example-driven prose.** Every distinct concept on the page gets **at least one runnable
  `[source,java]` example** (with `[source,xml]` / `[source,groovy]` for build coordinates and `[source,text]`
  for query syntax where useful) **and at least one link to the specific Lucene Javadoc package/class page,
  module page, or `lucene.apache.org/core/` site page** it documents — in prose and/or as a comment in the
  example.
- **No source is ever named in an admonition or in prose as "what this was written from".** Source attribution
  (official doc/Javadoc pages *and* the book) appears **only** in `index.adoc`'s `== Bibliography`, and — for the
  official site only — in the disclaimer partial. Cross-referencing a specific Javadoc/doc page for further
  detail is fine and encouraged.
- **Modern idioms only** (choice 3). Where the book's 3.x approach differs, note the change in one line rather
  than documenting the old way.
- **Diagrams**: `[mermaid]` for flow / sequence / state diagrams; hand-authored inline **SVG** under
  `modules/ROOT/images/` named `lucene-*.svg` for the spatial figures in choice 9; **no diagram where a code
  block or small table is clearer.** All figures theme-safe.
- **Cross-links**: link the sibling `xref:database/sql/…`, `xref:database/mongodb/…`, `xref:database/couchbase/…`
  and especially `xref:database/elasticsearch/…` and `xref:database/solr/…` pages rather than restating shared
  theory — Elasticsearch's and Solr's concepts are Lucene's concepts one layer up. Link sibling Lucene pages
  with `xref:database/lucene/<page>.adoc[…]` rather than repeating material.
- Every page must be reachable from both `modules/ROOT/pages/database/lucene/index.adoc` and
  `modules/ROOT/nav.adoc` once Group 4 lands.
- **Escape literal `{ }` in prose** as `\{ … }` (the AsciiDoc gotcha above).

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Apache Lucene disclaimer partial — `modules/ROOT/partials/lucene-disclaimer.adoc`
  - Files touched: `modules/ROOT/partials/lucene-disclaimer.adoc` (new). Book-free `[IMPORTANT]`/`====` admonition
    mirroring `elasticsearch-disclaimer.adoc` / `solr-disclaimer.adoc`: Lucene 10.x line + Java 21, verified
    against https://lucene.apache.org/core/, "linked, not documented in depth" list (Panama foreign-memory /
    Vector API internals, codec file-format internals, nightly benchmark harness), AI-assistance caveat, closing
    `xref:database/lucene/index.adoc#_bibliography[bibliography]` pointer. No book/source named. No unescaped
    `{ }` in prose. No test/coverage/quality gate (docs-only); Antora build validation deferred to Task 36.
  - [x] Task 1.1. Author it as an `[IMPORTANT]` / `====` admonition following the **current "book-free" variant**
    shared by `modules/ROOT/partials/elasticsearch-disclaimer.adoc` and
    `modules/ROOT/partials/solr-disclaimer.adoc` (choice 4). It must state, in order: (a) this section documents
    **the current Apache Lucene 10.x line** — Lucene 10 requires **Java 21** — as published at
    https://lucene.apache.org/core/[the Apache Lucene documentation and Javadoc], **which is the reference these
    pages are written and verified against**; no specific patch version is pinned; examples target `lucene-core`
    10.x and the companion modules; some areas (the Panama foreign-memory / Vector API internals, codec
    file-format internals, and the nightly benchmark harness) are **linked, not documented in depth**; (b) this
    content was generated with the assistance of AI and should be verified against
    https://lucene.apache.org/core/[the official documentation] before being relied on in production, as Lucene
    iterates quickly; (c) a closing line:
    `This section's xref:database/lucene/index.adoc#_bibliography[bibliography] lists the reference material
    consulted while preparing these pages.` **It must not name any book, "consulted references", or "the sources
    below".** No literal unescaped `{ }` in the prose.
  - [x] Task 1.2. Confirm the include line is `include::partial$lucene-disclaimer.adoc[]` (Antora resolves
    `partial$` to `modules/ROOT/partials/`) — this exact line is placed after the header on every page created in
    Groups 2–4.
    - Confirmed: partial lives at `modules/ROOT/partials/lucene-disclaimer.adoc`; Antora's `partial$` resource
      selector resolves to that directory, so `include::partial$lucene-disclaimer.adoc[]` is the exact line
      Groups 2–4 pages place after their header, matching `include::partial$elasticsearch-disclaimer.adoc[]`
      usage in the existing Elasticsearch/Solr pages.

### Group 2 — Content pages

**Parallelizable: yes** — 27 independent pages (Tasks 2–28). Each includes the Group 1 disclaimer partial and
only cross-links other pages by `xref:` (no page needs another Group 2 page's finished text). Each page also
authors any `lucene-*.svg` figure it embeds. Consolidated validation for the group is the Task 36 Antora build.

#### Getting started

- [x] Task 2. Create `modules/ROOT/pages/database/lucene/getting-started.adoc` — What Apache Lucene is
  - [x] Task 2.1. Lucene as an **embedded, in-process Java search library** — no daemon, no network protocol, no
    deployment; you call it from your JVM and you own concurrency, persistence, replication and sharding.
    **Elasticsearch, OpenSearch and Apache Solr are all built on Lucene** (forward-pointer to
    `lucene-vs-solr-vs-elasticsearch-vs-opensearch.adoc`). The release line (10.x; Lucene 10 requires Java 21;
    `MMapDirectory` uses the Panama foreign-memory API).
  - [x] Task 2.2. **Getting it**: Maven (`[source,xml]`) and Gradle (`[source,groovy]`) coordinates for
    `org.apache.lucene:lucene-core` and the companion modules used across this section (`lucene-analysis-common`,
    `lucene-queryparser`, `lucene-facet`, `lucene-highlighter`, `lucene-suggest`, `lucene-join`,
    `lucene-grouping`, `lucene-expressions`, `lucene-queries`, `lucene-spatial-extras`, `lucene-monitor`,
    `lucene-backward-codecs`, `lucene-test-framework`). The bundled **`lucene-demo`** (`IndexFiles` /
    `SearchFiles`).
  - [x] Task 2.3. A first end-to-end round-trip in one `[source,java]` block: open a `Directory`
    (`FSDirectory.open(Path)`), index two `Document`s with an `IndexWriter` (`new IndexWriterConfig(analyzer)`),
    open a `DirectoryReader` + `IndexSearcher`, run a `TermQuery` and a parsed query, read `TopDocs` and
    `storedFields().document(hit.doc)`. Forward-pointers to `architecture-and-data-flow.adoc`,
    `documents-and-fields.adoc`, `core-queries.adoc`.
  - [x] Task 2.4. Links: the Lucene core Javadoc overview (`org.apache.lucene` / `core/` package summary), the
    `demo` module page, the `lucene.apache.org/core/` front page, and the system-requirements page. Cross-link
    the sibling `xref:database/elasticsearch/getting-started.adoc` and `xref:database/solr/getting-started.adoc`,
    and `xref:database/choosing-the-right-database.adoc`.
- [x] Task 3. Create `modules/ROOT/pages/database/lucene/architecture-and-data-flow.adoc` — The index model &
  the indexing/search class chains (merge of issue #2 + #3)
  - [x] Task 3.1. The index as a `Directory` of **immutable segments**; a segment as a mini-index (postings,
    stored fields `.fdt`/`.fdx`, doc values `.dvd`/`.dvm`, points `.kdd`/`.kdi`, term vectors, norms, `.si`);
    **generations, `segments_N` and commits**; the pluggable **codec** (`Codec`, `PostingsFormat`,
    `DocValuesFormat`, `KnnVectorsFormat`), `lucene-backward-codecs`, `SegmentInfos`; `IndexUpgrader` and the
    "one major version back" read-compatibility rule; `CheckIndex`.
  - [x] Task 3.2. The **indexing chain** (`IndexWriter` ← `IndexWriterConfig` ← `Analyzer`; `Directory`;
    `Document` + `Field`) and the **search chain** (`DirectoryReader` → `IndexSearcher` → `Query` → `TopDocs` →
    `StoredFields`), and how they connect; reader/searcher lifecycle and reference counting
    (`incRef`/`decRef`).
  - [x] Task 3.3. `[mermaid]` flowchart: buffered docs → flush → new segment → merge → fewer/larger segments
    (this doubles as `lucene-segments-and-merges`, choice 9). Author
    `modules/ROOT/images/lucene-inverted-index.svg` — three docs → analyzed terms → postings lists (term →
    docId, freq, positions) — and `modules/ROOT/images/lucene-data-flow.svg` — a two-lane figure (index lane
    vs. search lane). Both theme-safe.
  - [x] Task 3.4. Links: `org.apache.lucene.codecs` package Javadoc, the current `Lucene<NN>Codec` Javadoc, the
    `org.apache.lucene.index` and `org.apache.lucene.search` package summaries, `CheckIndex` Javadoc.
    Cross-link `xref:database/elasticsearch/documents-and-indices.adoc` (segments/NRT one layer up) and
    `xref:database/solr/indexing-internals-and-performance.adoc`.

#### Storing & indexing

- [x] Task 4. Create `modules/ROOT/pages/database/lucene/directories-and-storage.adoc` — `Directory`
  implementations & storage
  - [x] Task 4.1. `Directory`; `FSDirectory.open(...)` choosing **`MMapDirectory`** (memory-mapped, Panama
    `MemorySegment`, 16 GiB chunks), `NIOFSDirectory`, `ByteBuffersDirectory` (the in-memory replacement for
    the removed `RAMDirectory`).
  - [x] Task 4.2. `LockFactory` / `NativeFSLockFactory` and `write.lock`; `IndexInput#prefetch` and the
    `ReadAdvice` enum (10.x); OS page cache vs. JVM heap sizing (forward-pointer to `performance-tuning.adoc`).
  - [x] Task 4.3. Links: `org.apache.lucene.store` package Javadoc, `MMapDirectory` / `FSDirectory` Javadoc.
- [x] Task 5. Create `modules/ROOT/pages/database/lucene/documents-and-fields.adoc` — `Document`, `Field` types
  & the capability matrix
  - [x] Task 5.1. `Document` as an ordered list of `Field`s (no schema). The modern field types and **what each
    enables**: `TextField` (analyzed, searchable), `StringField` / `KeywordField` (exact term), `StoredField`
    (retrieve only), the numeric **point** types (`IntField` / `LongField` / `IntPoint` / `LongPoint` /
    `DoublePoint` — indexed for range search via BKD), the **doc-values** types (`NumericDocValuesField`,
    `SortedDocValuesField`, `SortedSetDocValuesField`, `SortedNumericDocValuesField` — columnar, for
    sort/facet/function scoring), `KnnFloatVectorField` / `KnnByteVectorField`, `FeatureField`, `LatLonPoint`.
  - [x] Task 5.2. `FieldType` / `IndexOptions` (docs / freqs / positions / offsets), `stored`, term vectors,
    `omitNorms`. A **capability matrix** table (searchable · stored · sortable/facetable · range · vector) so
    readers pick the right combination. Contrast the book's `Field.Store` / `Field.Index` enums and
    `NumericField` in one line.
  - [x] Task 5.3. Links: `org.apache.lucene.document` package Javadoc, `IndexableFieldType` Javadoc. Cross-link
    `xref:database/elasticsearch/mapping-and-field-types.adoc` and `xref:database/solr/field-types.adoc`.
- [x] Task 6. Create `modules/ROOT/pages/database/lucene/indexing-and-merge-policies.adoc` — Indexing operations,
  soft deletes & merging (merge of issue #6 + #7)
  - [x] Task 6.1. `addDocument`, `updateDocument` (atomic delete-by-`Term` + add), `deleteDocuments(Query|Term)`,
    `softUpdateDocument` + **soft deletes** (`IndexWriterConfig.setSoftDeletesField` +
    `SoftDeletesRetentionMergePolicy`); `commit` vs. `flush`, `prepareCommit` / two-phase commit, commit user
    data (`setLiveCommitData`), `rollback`.
  - [x] Task 6.2. `IndexWriterConfig` knobs (`OpenMode`, RAM buffer size, `setMaxBufferedDocs`,
    `setUseCompoundFile`); `forceMerge` / `forceMergeDeletes` (was `optimize` — and why you usually should not
    call it); **index-time sorting** (`setIndexSort`) and its interaction with document blocks.
  - [x] Task 6.3. Why merging exists (immutable segments + deletes = fragmentation); **`TieredMergePolicy`**
    (default) and its main knobs (`maxMergedSegmentMB`, `segmentsPerTier`, `deletesPctAllowed`),
    `LogByteSizeMergePolicy`, `NoMergePolicy`, `FilterMergePolicy`, `SoftDeletesRetentionMergePolicy`;
    **`ConcurrentMergeScheduler`** (`setMaxMergesAndThreads`, IO throttling) vs. `SerialMergeScheduler`; tuning
    merges for bulk load vs. steady state. `[mermaid]` flowchart: the merge-cascade decision.
  - [x] Task 6.4. Links: `IndexWriter` / `IndexWriterConfig` Javadoc, the `org.apache.lucene.index` merge-policy
    Javadoc, `MIGRATE.md` soft-deletes notes. Cross-link
    `xref:database/elasticsearch/indexing-crud-and-bulk.adoc` and
    `xref:database/solr/partial-updates-and-concurrency.adoc`.
- [x] Task 7. Create `modules/ROOT/pages/database/lucene/near-real-time-search.adoc` — NRT search
  - [x] Task 7.1. `DirectoryReader.open(IndexWriter)` and `DirectoryReader.openIfChanged(oldReader)`;
    **`SearcherManager`** + `SearcherFactory`; `ControlledRealTimeReopenThread` for bounded staleness;
    `SearcherLifetimeManager` for stable paging.
  - [x] Task 7.2. Reference counting (`incRef` / `decRef` / `IndexSearcher` release), why you must not close a
    reader other threads may hold. `[mermaid]` sequence/flow: the write → reopen → search NRT loop.
  - [x] Task 7.3. Links: `SearcherManager` / `ControlledRealTimeReopenThread` / `DirectoryReader` Javadoc, the
    NRT article on the Lucene site. Cross-link `xref:database/solr/core-concepts-and-architecture.adoc` (soft
    commits / NRT one layer up).

#### Text analysis

- [x] Task 8. Create `modules/ROOT/pages/database/lucene/analysis-pipeline.adoc` — `Analyzer`, `TokenStream` &
  attributes
  - [x] Task 8.1. `Analyzer` and `Analyzer.createComponents` / `normalize`; the `CharFilter` → `Tokenizer` →
    `TokenFilter` chain; the **`TokenStream` lifecycle** (`reset()` → `incrementToken()` → `end()` → `close()`)
    and stream reuse.
  - [x] Task 8.2. The **attribute** API (`CharTermAttribute`, `OffsetAttribute`, `PositionIncrementAttribute`,
    `PositionLengthAttribute`, `TypeAttribute`, `PayloadAttribute`, `KeywordAttribute`) and why positions /
    offsets matter (phrase queries, the `UnifiedHighlighter`). A short `[source,java]` snippet consuming a
    `TokenStream` and printing terms + positions + offsets.
  - [x] Task 8.3. Author `modules/ROOT/images/lucene-analysis-chain.svg` — a worked input string through char
    filters → tokenizer → token filters → indexed terms with positions & offsets; theme-safe.
  - [x] Task 8.4. Links: `org.apache.lucene.analysis` package summary, `TokenStream` Javadoc. Cross-link
    `xref:database/elasticsearch/text-analysis.adoc` and `xref:database/solr/text-analysis.adoc`.
- [x] Task 9. Create `modules/ROOT/pages/database/lucene/built-in-analyzers-and-customanalyzer.adoc` — Built-in
  analyzers & `CustomAnalyzer`
  - [x] Task 9.1. `StandardAnalyzer`, `SimpleAnalyzer`, `WhitespaceAnalyzer`, `KeywordAnalyzer`, `StopAnalyzer`,
    `EnglishAnalyzer` and the other language analyzers in `lucene-analysis-common`; `PerFieldAnalyzerWrapper`.
  - [x] Task 9.2. Building an analyzer without a subclass via **`CustomAnalyzer.builder()`** (factory names +
    params); testing analysis with a short snippet and `BaseTokenStreamTestCase` from `lucene-test-framework`.
  - [x] Task 9.3. Links: `analysis-common` module page, `CustomAnalyzer` Javadoc.
- [x] Task 10. Create `modules/ROOT/pages/database/lucene/token-filters-and-recipes.adoc` — Token-filter recipes
  - [x] Task 10.1. Practical recipes: `LowerCaseFilter` / `ASCIIFoldingFilter`, `StopFilter`,
    **`SynonymGraphFilter` + `FlattenGraphFilter`**, stemming (`PorterStemFilter`, `KStemFilter`,
    `SnowballFilter`, `StemmerOverrideFilter`), `NGramTokenizer` / `EdgeNGramTokenFilter` for autocomplete /
    partial matching (and the index-size cost), `ShingleFilter`, `WordDelimiterGraphFilter`,
    `DelimitedPayloadTokenFilter`. One `[source,java]` `CustomAnalyzer` per notable recipe.
  - [x] Task 10.2. Links: `analysis-common` filter Javadoc. Cross-link `xref:database/elasticsearch/text-analysis.adoc`.
- [x] Task 11. Create `modules/ROOT/pages/database/lucene/language-analysis.adoc` — Pluggable language modules
  - [x] Task 11.1. `analysis-icu` (`ICUTokenizer` / `ICUFoldingFilter` / `ICUNormalizer2Filter`),
    `analysis-kuromoji` (Japanese), `analysis-nori` (Korean), `analysis-smartcn` (Chinese),
    `analysis-stempel` / `analysis-morfologik` (Polish), `analysis-phonetic` (Soundex / Metaphone /
    Beider–Morse), `analysis-opennlp`. When to reach for each; a `[source,java]` example wiring one non-Latin
    analyzer.
  - [x] Task 11.2. Links: the per-module pages. Cross-link `xref:database/solr/language-analysis.adoc`.

#### Querying & scoring

- [x] Task 12. Create `modules/ROOT/pages/database/lucene/query-parsers.adoc` — Query parsers
  - [x] Task 12.1. The **classic `QueryParser`** syntax and its pitfalls (query text is analyzed, leading
    wildcards, `TermRangeQuery` vs. points, boolean-operator precedence, `MultiFieldQueryParser`);
    **`SimpleQueryParser`** (never throws — good for end-user input); the **flexible `StandardQueryParser`**
    framework; `ComplexPhraseQueryParser`; and the guidance to **build `Query` objects directly** for anything
    programmatic. `[source,text]` for the parser syntax, `[source,java]` for parser construction.
  - [x] Task 12.2. A small table or SVG-free figure: user string → analyzed → `Query` tree. Links:
    `lucene-queryparser` module page, `QueryParser` / `SimpleQueryParser` Javadoc. Cross-link
    `xref:database/solr/query-parsers.adoc`.
- [x] Task 13. Create `modules/ROOT/pages/database/lucene/core-queries.adoc` — The core `Query` classes
  - [x] Task 13.1. `TermQuery`; **`BooleanQuery.Builder`** (`Occur.MUST` / `SHOULD` / `FILTER` / `MUST_NOT`,
    `setMinimumNumberShouldMatch`, the 1024-clause limit); **`PhraseQuery.Builder`** (slop) and
    `MultiPhraseQuery`; `PrefixQuery`, `WildcardQuery`, `RegexpQuery`, **`FuzzyQuery`** (Levenshtein automaton,
    `maxEdits`); `TermRangeQuery`; `MatchAllDocsQuery`; `ConstantScoreQuery`, `BoostQuery`,
    `DisjunctionMaxQuery` (`tieBreaker`); `TermInSetQuery`.
  - [x] Task 13.2. A note on `QueryVisitor` and query rewriting (now via `IndexSearcher`, 10.x). Links:
    `org.apache.lucene.search` package summary + per-class Javadoc. Cross-link
    `xref:database/elasticsearch/query-dsl-term-level.adoc` and `xref:database/elasticsearch/query-dsl-full-text.adoc`.
- [x] Task 14. Create `modules/ROOT/pages/database/lucene/points-and-range-queries.adoc` — Points & BKD range
  search
  - [x] Task 14.1. The **BKD-tree** points index; `IntPoint` / `LongPoint` / `DoublePoint` / `FloatPoint`
    `newExactQuery` / `newRangeQuery` / `newSetQuery`; **multi-dimensional points**; **`IndexOrDocValuesQuery`**
    (let Lucene pick points vs. doc-values iteration by selectivity); **doc-values skip lists /
    `DocValuesSkipper`** for range acceleration (10.x); the `IntField` / `LongField` convenience types that add
    both a point and a doc-value. Contrast the book's removed `NumericRangeQuery` / trie fields in one line.
  - [x] Task 14.2. Author `modules/ROOT/images/lucene-bkd-tree.svg` — a 2-D BKD split of points into leaf
    blocks; theme-safe. Links: points Javadoc, `IndexOrDocValuesQuery` Javadoc, the 10.0 `Changes.html` entry.
- [x] Task 15. Create `modules/ROOT/pages/database/lucene/interval-and-span-queries.adoc` — Positional / proximity
  matching
  - [x] Task 15.1. The modern **`Intervals` / `IntervalQuery`** API (`Intervals.term`, `phrase`, `ordered`,
    `unordered`, `maxgaps`, `containing`, `containedBy`, `notContainingInterval`, `overlapping`, `before` /
    `after`) with a worked proximity `[source,java]` example; the legacy `SpanQuery` family it supersedes (kept
    for reference / migration, one line).
  - [x] Task 15.2. Links: `org.apache.lucene.search.intervals` package Javadoc. Cross-link
    `xref:database/elasticsearch/query-dsl-full-text.adoc` (the `intervals` query one layer up).
- [x] Task 16. Create `modules/ROOT/pages/database/lucene/filtering-and-faceting.adoc` — Filtering & the
  `lucene-facet` module
  - [x] Task 16.1. Filtering is now `BooleanClause.Occur.FILTER` (unscored, cacheable via the searcher's
    `LRUQueryCache`) + `ConstantScoreQuery` / `TermInSetQuery` — the `Filter` class is gone (one-line contrast
    with the book).
  - [x] Task 16.2. The **`lucene-facet` module**: `FacetsConfig`; the **taxonomy** index
    (`DirectoryTaxonomyWriter` + `FastTaxonomyFacetCounts`) vs. **`SortedSetDocValuesFacetCounts`** (no sidecar
    index); `LongValueFacetCounts` / range facets (`LongRangeFacetCounts`, `DoubleRange`); **drill-down and
    drill-sideways** (`DrillDownQuery`, `DrillSideways`); association facets.
  - [x] Task 16.3. Author `modules/ROOT/images/lucene-taxonomy-vs-ssdv-facets.svg` — taxonomy sidecar index vs.
    SSDV doc-values, same facet result; theme-safe. Links: `facet` module page + Javadoc. Cross-link
    `xref:database/elasticsearch/aggregations.adoc` and `xref:database/solr/faceting.adoc`.
- [x] Task 17. Create `modules/ROOT/pages/database/lucene/scoring-and-similarity.adoc` — BM25 & the `Similarity`
  API
  - [x] Task 17.1. **`BM25Similarity` is the default** (since Lucene 6 — the book documents the TF/IDF
    `DefaultSimilarity`); `k1` / `b`, field-length norms and `SmallFloat` quantisation; `BooleanSimilarity`,
    `ClassicSimilarity`, `DFRSimilarity` / `IBSimilarity` / `LMDirichletSimilarity` / `LMJelinekMercerSimilarity`;
    **`PerFieldSimilarityWrapper`**; `IndexWriterConfig.setSimilarity` (indexing — norms) vs.
    `IndexSearcher.setSimilarity` (query).
  - [x] Task 17.2. The **`Explanation`** API and `IndexSearcher.explain`; `[mermaid]`: term stats (tf, df,
    fieldLen, avgFieldLen) → BM25 score. Links: `org.apache.lucene.search.similarities` package Javadoc,
    `BM25Similarity` Javadoc. Cross-link `xref:database/elasticsearch/compound-queries-and-relevance.adoc` and
    `xref:database/solr/relevance-and-scoring.adoc`.
- [x] Task 18. Create `modules/ROOT/pages/database/lucene/function-and-custom-scoring.adoc` — Function scoring,
  expressions & sorting
  - [x] Task 18.1. **`FunctionScoreQuery`** (replaces `CustomScoreQuery` / `FunctionQuery` — e.g.
    `FunctionScoreQuery.boostByValue` / `boostByQuery`); **`DoubleValuesSource`** as the building block;
    **`FeatureField`** saturation / log / sigmoid queries for numeric relevance signals (recency, popularity).
  - [x] Task 18.2. The **`lucene-expressions` module** (`JavascriptCompiler` → `Expression` →
    `DoubleValuesSource` for sort / score / facet); `Sort` / `SortField` / `SortedNumericSortField`, sorting by
    field vs. `_score`, missing-value handling.
  - [x] Task 18.3. Links: `queries` module (`FunctionScoreQuery`), `expressions` module page + Javadoc.
    Cross-link `xref:database/solr/function-queries.adoc`.
- [x] Task 19. Create `modules/ROOT/pages/database/lucene/collectors-and-concurrent-search.adoc` — Collectors &
  concurrent search
  - [x] Task 19.1. `IndexSearcher.search(Query, n)` → `TopDocs`; the **`CollectorManager`** model
    (`TopScoreDocCollectorManager`, `TopFieldCollectorManager`, `TotalHitCountCollectorManager`) that replaces
    bare `Collector` for **concurrent search**; passing an `Executor` to `IndexSearcher` and **intra-segment
    concurrency** (10.x); `TopDocs.merge`.
  - [x] Task 19.2. The **total-hits threshold** and `TotalHits.Relation` (`EQUAL_TO` vs.
    `GREATER_THAN_OR_EQUAL_TO`); early termination and `TimeLimitingCollector`; writing a custom `Collector` /
    `CollectorManager` (`[source,java]`). `[mermaid]`: scatter across leaf/segment slices → per-slice top-N →
    merge.
  - [x] Task 19.3. Links: `IndexSearcher` / `CollectorManager` Javadoc, the 10.0 concurrency notes. Cross-link
    `xref:database/solr/distributed-indexing-and-search.adoc` (scatter/gather one layer up).
- [x] Task 20. Create `modules/ROOT/pages/database/lucene/retrieving-results.adoc` — Reading hits back
  - [x] Task 20.1. **`searcher.storedFields().document(docId)`** (the `StoredFields` API — `IndexSearcher.doc`
    is deprecated), selective loading with `StoredFieldVisitor`; reading **doc values** for computed columns;
    **term vectors** via `searcher.termVectors().get(docId)`.
  - [x] Task 20.2. Paging with `IndexSearcher.searchAfter` and a stable searcher; when to reopen the reader
    between pages. Links: `StoredFields` / `TermVectors` / `IndexSearcher` Javadoc. Cross-link
    `xref:database/elasticsearch/search-api-and-pagination.adoc`.

#### Vectors & specialized search

- [x] Task 21. Create `modules/ROOT/pages/database/lucene/knn-vector-search.adoc` — kNN / HNSW vector search
  (**official documentation only — the book predates vectors entirely**)
  - [x] Task 21.1. `KnnFloatVectorField` / `KnnByteVectorField` (`dims`, `VectorSimilarityFunction` —
    `EUCLIDEAN` / `DOT_PRODUCT` / `COSINE` / `MAXIMUM_INNER_PRODUCT`); the **HNSW** graph in the
    `KnnVectorsFormat` (`M` / `beamWidth`), scalar (`int8` / `int4`) and binary quantisation formats.
  - [x] Task 21.2. **`KnnFloatVectorQuery` / `KnnByteVectorQuery`** (approximate, `k`, `numCands`) and
    **pre-filtering** with a filter `Query`; exact kNN via a `DoubleValuesSource`; **hybrid lexical + vector**
    search by combining with `BooleanQuery` or rescoring; the Panama **Vector API** acceleration.
  - [x] Task 21.3. Author `modules/ROOT/images/lucene-hnsw-graph.svg` — a layered HNSW graph with a greedy
    search path; theme-safe. Links: `KnnFloatVectorField` / `KnnFloatVectorQuery` Javadoc, the
    `Lucene<NN>HnswVectorsFormat` Javadoc, the vector-search article on the Lucene site. Cross-link
    `xref:database/elasticsearch/vector-and-semantic-search.adoc` and `xref:database/solr/dense-vector-search.adoc`.
- [x] Task 22. Create `modules/ROOT/pages/database/lucene/spatial-search.adoc` — Spatial search
  - [x] Task 22.1. **`LatLonPoint`** in core (`newBoxQuery`, `newDistanceQuery`, `newPolygonQuery`,
    `newDistanceSort`, `newDistanceFeatureQuery`); `LatLonShape` / `XYShape` and the **`spatial-extras`** module
    (`PrefixTreeStrategy`, `SerializedDVStrategy`, `RecursivePrefixTreeStrategy`); the **`spatial3d`** module
    (geo3d — great-circle distance, polygons over the poles); WKT / GeoJSON parsing (`SimpleWKTShapeParser`).
  - [x] Task 22.2. Links: `LatLonPoint` Javadoc, `spatial-extras` / `spatial3d` module pages. Cross-link
    `xref:database/elasticsearch/geospatial.adoc` and `xref:database/mongodb/special-indexes-and-search.adoc`.
- [x] Task 23. Create `modules/ROOT/pages/database/lucene/highlighting-suggesters-and-more.adoc` — Highlighting,
  suggesters, spellcheck, MoreLikeThis & classification (merge of issue #24 + #25)
  - [x] Task 23.1. The **`lucene-highlighter`** module — **`UnifiedHighlighter`** (the current highlighter; the
    legacy `Highlighter` / `FastVectorHighlighter` / `PostingsHighlighter` are folded into or superseded by it),
    passage scoring, and its offset-source requirement (`IndexOptions` with offsets, or term vectors).
  - [x] Task 23.2. The **`lucene-suggest` module**: `AnalyzingSuggester`, `FuzzySuggester`,
    `AnalyzingInfixSuggester`, `BlendedInfixSuggester`, `FreeTextSuggester`, and the NRT `SuggestField` /
    `ContextSuggestField` + `SuggestIndexSearcher` / `CompletionAnalyzer`; spell checking
    (`DirectSpellChecker` against the live index, `SpellChecker` + `PlainTextDictionary` / `LuceneDictionary`,
    `WordBreakSpellChecker`). Contrast with the n-gram approach from `token-filters-and-recipes.adoc`.
  - [x] Task 23.3. **`MoreLikeThis`** (interesting-terms → `Query`) from `lucene-queries`; the
    **`lucene-classification`** module (`KNearestNeighborClassifier`, `SimpleNaiveBayesClassifier`,
    `BM25NBClassifier`, `KNearestFuzzyClassifier`).
  - [x] Task 23.4. Links: `highlighter` / `suggest` / `classification` module pages, `UnifiedHighlighter` /
    `MoreLikeThis` Javadoc. Cross-link `xref:database/elasticsearch/search-extras.adoc` and
    `xref:database/solr/spell-check-and-suggest.adoc` / `xref:database/solr/highlighting.adoc`.
- [x] Task 24. Create `modules/ROOT/pages/database/lucene/grouping-and-joins.adoc` — Grouping & joins
  - [x] Task 24.1. The **`lucene-grouping`** module (`GroupingSearch`, first-pass / second-pass grouping,
    grouping by `SortedDocValues` or by document block).
  - [x] Task 24.2. The **`lucene-join`** module — **query-time joins** (`JoinUtil.createJoinQuery` on a join
    field, `ScoreMode`) and index-time **block joins** (`IndexWriter.addDocuments` for a parent + children
    block, `ToParentBlockJoinQuery`, `ToChildBlockJoinQuery`, `ParentChildrenBlockJoinQuery`, `CheckJoinIndex`).
  - [x] Task 24.3. Author `modules/ROOT/images/lucene-query-time-vs-block-join.svg` — query-time join across two
    indexes vs. a parent+children block in one segment; theme-safe. Links: `grouping` / `join` module pages +
    Javadoc. Cross-link `xref:database/elasticsearch/joins-and-relationships.adoc`,
    `xref:database/sql/relations.adoc`, `xref:database/mongodb/data-modeling.adoc`.
- [x] Task 25. Create `modules/ROOT/pages/database/lucene/monitor-reverse-search.adoc` — The `lucene-monitor`
  module
  - [x] Task 25.1. Register `Query` objects (`MonitorQuery`) in a `Monitor`, then match an incoming `Document`
    against all of them (`CandidateMatcher`, `Presearcher` for scaling to many queries) — the alerting /
    saved-search / "reverse search" use case (formerly Luwak). Worked `[source,java]` example.
  - [x] Task 25.2. Contrast with Elasticsearch's `percolate` query (one line). Links: `monitor` module page +
    Javadoc. Cross-link `xref:database/elasticsearch/search-extras.adoc`.

#### Operations & tooling

- [x] Task 26. Create `modules/ROOT/pages/database/lucene/performance-tuning.adoc` — Performance tuning
  - [x] Task 26.1. **Indexing throughput**: size the RAM buffer, share one `IndexWriter` across threads,
    raise / defer merges during a bulk load, `forceMerge(1)` only for a static index, build in parallel and
    `addIndexes(CodecReader...)`.
  - [x] Task 26.2. **Search latency**: reuse one `IndexSearcher` (via `SearcherManager`), warm new readers,
    size the OS page cache vs. JVM heap for `MMapDirectory`, do not reopen too often, the searcher's
    `LRUQueryCache` (on by default), use `DocValues` for sort / facet, cap total-hit counting.
  - [x] Task 26.3. The nightly benchmarks and `luceneutil`. `[mermaid]`: the flush → commit → merge lifecycle.
    Links: the "basic concepts" / tuning material on the Lucene site, `LRUQueryCache` / `IndexSearcher` Javadoc,
    the nightly-benchmarks page. Cross-link `xref:database/elasticsearch/performance-tuning.adoc` and
    `xref:database/solr/indexing-internals-and-performance.adoc`.
- [x] Task 27. Create `modules/ROOT/pages/database/lucene/testing-tools-and-modules.adoc` — Test framework, tools
  & a module map
  - [x] Task 27.1. The **`lucene-test-framework`** (`LuceneTestCase`, `BaseTokenStreamTestCase`,
    `newDirectory()`, `RandomIndexWriter`, `@Nightly` / randomized testing); **`CheckIndex`** for corruption;
    **`IndexUpgrader`** and `lucene-backward-codecs`; **Luke** (the `luke` GUI module) for browsing an index;
    the **`benchmark`** module; the **`replicator`** module (NRT / HTTP index replication); `misc` tools
    (`IndexMergeTool`, `HighFreqTerms`, `GetTermInfo`).
  - [x] Task 27.2. A quick **map of every module** (small table) so readers know what exists. Links:
    `test-framework` / `luke` / `benchmark` / `replicator` / `misc` module pages.
- [x] Task 28. Create `modules/ROOT/pages/database/lucene/lucene-vs-solr-vs-elasticsearch-vs-opensearch.adoc` —
  The comparison page (explicitly requested)
  - [x] Task 28.1. A **table plus prose** contrasting **Apache Lucene** (embedded Java library, in-process, one
    JVM — zero deployment, lowest latency, total API control, small footprint, Apache-2.0; *cons:* single-node
    only, you build sharding / replication / failover / a query protocol / security / snapshots yourself, JVM
    only, steeper learning curve, no REST or admin UI), **Apache Solr** (search server around Lucene, HTTP +
    JSON/XML — mature faceting / dismax, schema & config files, SolrCloud + ZooKeeper, Apache-2.0; *cons:*
    operationally heavier, config-file-driven), **Elasticsearch** (REST/JSON server, built-in clustering / ILM /
    ingest / security / Kibana; *cons:* resource-hungry, SSPL / Elastic License v2 since 7.11, fast-moving API),
    **OpenSearch** (Apache-2.0 fork of ES 7.10, AWS-led, OpenSearch Dashboards; *cons:* diverging from ES over
    time, smaller community).
  - [x] Task 28.2. A **"when to use which"** decision list, and a note that **Solr, Elasticsearch and OpenSearch
    all embed Lucene**, so every concept in this section transfers to them one layer up.
  - [x] Task 28.3. Author `modules/ROOT/images/lucene-stack-layers.svg` — Lucene core at the bottom, Solr /
    Elasticsearch / OpenSearch as servers on top, your application above; theme-safe.
  - [x] Task 28.4. Cross-link `xref:database/elasticsearch/index.adoc[Elasticsearch Reference]`,
    `xref:database/solr/index.adoc[Apache Solr Reference]`,
    `xref:database/solr/solr-vs-elasticsearch.adoc[Solr vs. Elasticsearch]`,
    `xref:backend/springboot/solr.adoc`, `xref:backend/springboot/elasticsearch.adoc`,
    `xref:database/choosing-the-right-database.adoc` (choice 8). Links: the Lucene, Solr, Elasticsearch and
    OpenSearch docs' own "what is …" pages.

### Group 3 — Cheat sheet page & PDF

**Parallelizable: no** — Task 30 renders the PDF that Task 29's page links, and Task 29's back-links reference
the Group 2 page titles. Depends on Group 2.

- [x] Task 29. Create `modules/ROOT/pages/database/lucene/cheat-sheet.adoc`
  - Files touched: `modules/ROOT/pages/database/lucene/cheat-sheet.adoc` (new). Header + `:description:` +
    `:keywords:` + `include::partial$lucene-disclaimer.adoc[]` + intro paragraph + grouped `xref:` back-links to
    all 27 Group 2 pages in the six section-index groups, ending with the PDF attachment link. Modelled on
    `database/elasticsearch/cheat-sheet.adoc` / `database/solr/cheat-sheet.adoc`. No unescaped `{ }` in prose;
    all 27 `xref:` targets verified present on disk. No test/coverage/quality gate for a docs-only file; the
    consolidated check is the Task 36 Antora build.
  - [x] Task 29.1. Header (`= Apache Lucene Cheat Sheet`, `:description:`, `:keywords:`) +
    `include::partial$lucene-disclaimer.adoc[]` + a short intro sentence, then grouped `xref:` back-links to
    every Group 2 page (grouped as in the section index), following the shape of
    `modules/ROOT/pages/database/elasticsearch/cheat-sheet.adoc`. No literal `{ }` in prose; every `xref:` target
    verified present on disk.
  - [x] Task 29.2. End with `xref:attachment$lucene-cheat-sheet.pdf[Download the Apache Lucene Cheat Sheet
    (PDF)]`. **No mention of the book** (all bibliography lives in `index.adoc`).
- [x] Task 30. Build `modules/ROOT/attachments/lucene-cheat-sheet.pdf`
  - Files touched: `modules/ROOT/attachments/lucene-cheat-sheet.pdf` (new, 178 KB). Hand-built print-ready A4
    HTML/CSS in the scratchpad (not the repo), rendered via headless Chrome
    `--headless --print-to-pdf --no-pdf-header-footer --virtual-time-budget=10000`. Verified **exactly one A4
    page** (`fitz`/PyMuPDF `page_count == 1`, page rect 595 x 842 pt) with no clipped/overflowing content
    (full-page + zoomed-crop PNG inspection of the capability matrix and the decision strip). HTML source not
    checked in — `git status --porcelain` shows no `.html` under the repo (only `build/` generated output and
    `node_modules/`, both ignored/vendored).
  - [x] Task 30.1. In a scratch location (not the repo), hand-build a print-ready single-page HTML/CSS layout —
    colour-coded boxes summarising: Maven / Gradle coords; the index + search round-trip skeleton; the
    field-type capability matrix; the analysis chain (`CustomAnalyzer.builder()`); `IndexWriterConfig` knobs;
    `BooleanQuery.Builder` / `PhraseQuery.Builder` / points `newRangeQuery` / `FuzzyQuery` skeletons;
    `BM25Similarity` + `Explanation`; `FunctionScoreQuery` + `Sort` + `searchAfter`; `CollectorManager` +
    concurrent search; a facet (taxonomy vs. SSDV) skeleton; a kNN vector skeleton; the NRT (`SearcherManager`)
    loop; `forceMerge` / `CheckIndex` / `IndexUpgrader` one-liners; and the Lucene ↔ Solr ↔ Elasticsearch ↔
    OpenSearch decision strip.
  - [x] Task 30.2. Render to PDF with headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`),
    verify it is **exactly one A4 page** (page-count check, e.g. PyMuPDF) and a rendered preview (PNG +
    zoomed quadrants) shows no clipped/overflowing content, then copy the PDF to
    `modules/ROOT/attachments/lucene-cheat-sheet.pdf`. Do **not** check in the HTML source (`git status` must
    show no `.html` anywhere under the repo).

### Group 4 — Section index, navigation & site wiring

**Parallelizable: no** — Tasks 31–35 each edit a shared wiring file (or depend on Group 2/3 output) and Task 36
builds on all prior groups; the build must run last.

- [x] Task 31. Create `modules/ROOT/pages/database/lucene/index.adoc`
  - Files touched: `modules/ROOT/pages/database/lucene/index.adoc` (new). Modelled on
    `database/elasticsearch/index.adoc` and `database/solr/index.adoc`: `= Apache Lucene Reference` + `:description:`
    + `:keywords:` + `include::partial$lucene-disclaimer.adoc[]` + lead paragraph + reading-order sentence +
    sibling-reference pointer + `== What's covered` (28 bullets: 27 content pages + cheat sheet, in the six
    Task 31.2 groups) + `== Bibliography` (the only place a source is named: the lucene.apache.org/core site +
    Javadoc/module list + Changes.html/MIGRATE.md/system-requirements as the verified-against source, Lucene 10.x
    / Java 21; the _Lucene in Action, 2e_ book as a consulted bibliographic reference only with the "official
    docs win" closing sentence). No literal `{ }` in prose. Verified by the Task 36 build (clean). The
    disclaimer partial's forward `xref:...#_bibliography` now resolves.
  - [x] Task 31.1. Header (`= Apache Lucene Reference`, `:description:`, `:keywords:`) +
    `include::partial$lucene-disclaimer.adoc[]` + a lead paragraph (Lucene as the embedded, in-process Java
    search library under Elasticsearch / OpenSearch / Solr) + a reading-order sentence
    (`getting-started` → `architecture-and-data-flow` → `documents-and-fields` → `query-parsers` /
    `core-queries`, then everything else builds on those) + a sibling-reference pointer
    (`xref:database/elasticsearch/index.adoc`, `xref:database/solr/index.adoc`, and the SQL / MongoDB /
    Couchbase references for the baselines this section contrasts with; `xref:database/choosing-the-right-database.adoc`).
  - [x] Task 31.2. `== What's covered` — one bullet per Group 2 page + the cheat sheet, grouped: *Getting
    started* (getting-started, architecture-and-data-flow); *Storing & indexing* (directories-and-storage,
    documents-and-fields, indexing-and-merge-policies, near-real-time-search); *Text analysis*
    (analysis-pipeline, built-in-analyzers-and-customanalyzer, token-filters-and-recipes, language-analysis);
    *Querying & scoring* (query-parsers, core-queries, points-and-range-queries, interval-and-span-queries,
    filtering-and-faceting, scoring-and-similarity, function-and-custom-scoring, collectors-and-concurrent-search,
    retrieving-results); *Vectors & specialized search* (knn-vector-search, spatial-search,
    highlighting-suggesters-and-more, grouping-and-joins, monitor-reverse-search); *Operations & tooling*
    (performance-tuning, testing-tools-and-modules, lucene-vs-solr-vs-elasticsearch-vs-opensearch); *Cheat
    sheet*. Escape any `{ }` in bullet text.
  - [x] Task 31.3. `== Bibliography` — **the only place any source is named.** List:
    - https://lucene.apache.org/core/ — the Apache Lucene site, the per-release Javadoc package overviews
      (`core/index`, `core/document`, `core/analysis`, `core/search`, `core/store`, `codecs`) and the module
      pages (`analysis-common`, `analysis-icu` / `-kuromoji` / `-nori` / `-smartcn` / `-stempel` / `-morfologik`
      / `-phonetic` / `-opennlp`, `queryparser`, `queries`, `facet`, `highlighter`, `suggest`, `join`,
      `grouping`, `expressions`, `classification`, `monitor`, `spatial-extras`, `spatial3d`, `replicator`,
      `luke`, `benchmark`, `misc`, `test-framework`, `backward-codecs`, `demo`), plus `Changes.html`,
      `MIGRATE.md` and the system-requirements page — **the source every page is written and verified against.**
      Current release: Lucene 10.x; Lucene 10 requires Java 21.
    - McCandless, Michael; Hatcher, Erik; Gospodnetić, Otis. *Lucene in Action, Second Edition*. Manning
      Publications, 2010. ISBN 9781933988177. Consulted as part of the bibliography for this section; its code
      targets **Lucene 3.0.x** and predates the Lucene 4 field-type / codec / `DocValues` rewrite, points / BKD
      (6.x), BM25 as the default similarity (6.x), the `Filter` removal, `CustomAnalyzer`, the `Intervals` API,
      `UnifiedHighlighter`, `FunctionScoreQuery`, `CollectorManager` / concurrent search, soft deletes, the
      `Monitor` module, kNN / HNSW vector search (9.x) and the Java-21 / Panama `MMapDirectory` (10.x). Where it
      and the official documentation disagree, the official documentation is authoritative and the difference is
      noted; none of its content is the primary or main reference for this section. Publisher page:
      https://www.manning.com/books/lucene-in-action-second-edition .
    - A closing sentence: the book is a consulted bibliographic reference only and is **not** the primary or main
      reference for the section; the official documentation at https://lucene.apache.org/core/ wins on any
      discrepancy and the difference is noted.
- [x] Task 32. Wire `modules/ROOT/nav.adoc`
  - Files touched: `modules/ROOT/nav.adoc`. Inserted the `*** xref:database/lucene/index.adoc[Apache Lucene
    Reference]` block + 28 `****` lines (27 pages in section-index order + `Cheat Sheet (PDF)`) between the Solr
    block's last line and `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`, using the
    exact short labels from Task 32.1. Verified all 27 basenames + cheat-sheet reachable from nav.adoc.
  - [x] Task 32.1. Insert a `*** xref:database/lucene/index.adoc[Apache Lucene Reference]` block with one `****`
    line per page **in the section-index order** (Task 31.2 grouping order), **after** the Apache Solr block's
    last line `**** xref:database/solr/cheat-sheet.adoc[Cheat Sheet (PDF)]` and **before**
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]` (choice 6 — match on the
    surrounding `xref:` text, not the absolute line number). Page order: getting-started,
    architecture-and-data-flow, directories-and-storage, documents-and-fields, indexing-and-merge-policies,
    near-real-time-search, analysis-pipeline, built-in-analyzers-and-customanalyzer, token-filters-and-recipes,
    language-analysis, query-parsers, core-queries, points-and-range-queries, interval-and-span-queries,
    filtering-and-faceting, scoring-and-similarity, function-and-custom-scoring, collectors-and-concurrent-search,
    retrieving-results, knn-vector-search, spatial-search, highlighting-suggesters-and-more, grouping-and-joins,
    monitor-reverse-search, performance-tuning, testing-tools-and-modules,
    lucene-vs-solr-vs-elasticsearch-vs-opensearch, then
    `**** xref:database/lucene/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Use short link labels (e.g.
    `[Getting Started]`, `[Architecture & Data Flow]`, `[Directories & Storage]`, `[Documents & Fields]`,
    `[Indexing & Merge Policies]`, `[Near-Real-Time Search]`, `[Analysis Pipeline]`,
    `[Built-in Analyzers & CustomAnalyzer]`, `[Token Filters & Recipes]`, `[Language Analysis]`,
    `[Query Parsers]`, `[Core Queries]`, `[Points & Range Queries]`, `[Interval & Span Queries]`,
    `[Filtering & Faceting]`, `[Scoring & Similarity]`, `[Function & Custom Scoring]`,
    `[Collectors & Concurrent Search]`, `[Retrieving Results]`, `[kNN Vector Search]`, `[Spatial Search]`,
    `[Highlighting, Suggesters & More]`, `[Grouping & Joins]`, `[Monitor / Reverse Search]`,
    `[Performance Tuning]`, `[Testing, Tools & Modules]`, `[Lucene vs. Solr vs. Elasticsearch vs. OpenSearch]`).
- [x] Task 33. Update `modules/ROOT/pages/database/index.adoc`
  - Files touched: `modules/ROOT/pages/database/index.adoc`. Added the Apache Lucene Reference `== Sections`
    bullet (verbatim Task 33.1 text) after the Apache Solr Reference bullet; extended `:description:` (adds
    "and Apache Lucene Reference") and `:keywords:` (adds `Apache Lucene, embedded search library, inverted
    index, BKD, HNSW, BM25`).
  - [x] Task 33.1. Add a `== Sections` bullet **after** the Apache Solr Reference one:
    `xref:database/lucene/index.adoc[Apache Lucene Reference] -- the embedded Java search library that
    Elasticsearch, OpenSearch and Solr are built on: the segment/codec index model, the indexing chain, text
    analysis, the Query API and parsers, points and BKD range search, BM25 and custom scoring, collectors and
    concurrent search, kNN vector search, faceting, highlighting, suggesters, grouping and joins, near-real-time
    search and performance tuning, plus a downloadable one-page cheat sheet.`
  - [x] Task 33.2. Extend the page `:description:` and `:keywords:` to mention Apache Lucene / embedded search
    library / inverted index / BKD / HNSW / BM25 (several search terms are already present).
- [x] Task 34. Update `modules/ROOT/pages/index.adoc`
  - Files touched: `modules/ROOT/pages/index.adoc`. `:keywords:` (line 3) now reads
    `... Apache Solr, SolrCloud, SolrJ, Apache Lucene, inverted index, kNN, full-text search, ...`. No
    sub-bullet added (choice 7 — the Guides & References section is a picker-tile grid).
  - [x] Task 34.1. Add `Apache Lucene` (and, if it reads naturally, `inverted index`, `kNN`) to the page
    `:keywords:` (line 3), after the existing `Apache Solr, SolrCloud, SolrJ` run. **No sub-bullet to add** —
    the `== Guides & References` section is a picker-tile grid with no per-subsection bullets (choice 7).
- [x] Task 35. Update `modules/ROOT/pages/database/choosing-the-right-database.adoc`
  - Files touched: `modules/ROOT/pages/database/choosing-the-right-database.adoc`. Added one sentence to the
    intro paragraph of `== Full-Text Search Engines -- Elasticsearch` with the
    `xref:database/lucene/index.adoc[Apache Lucene Reference]` link (Task 35.1 example wording). Task 35.2
    (optional Vector Databases sentence) deliberately skipped — one link is enough and the plan says not to
    restate content.
  - [x] Task 35.1. In the `== Full-Text Search Engines -- Elasticsearch` section, add one sentence with an
    `xref:database/lucene/index.adoc[Apache Lucene Reference]` link — e.g. "Both Elasticsearch and Solr are
    built on the embedded Java library xref:database/lucene/index.adoc[Apache Lucene]; for a Java-developer
    reference to Lucene itself -- the index model, analysis, the Query API, scoring, faceting and vector
    search -- see xref:database/lucene/index.adoc[Apache Lucene Reference]."
  - [x] Task 35.2. Optionally add the same `xref` in the `== Vector Databases` section where Lucene-based kNN is
    mentioned, if it reads naturally. Do not restate content.
- [x] Task 36. Build & verify
  - `npx antora antora-playbook.yml` (no `--fetch`) via an `iru-gate-runner` sub-agent: **exit code 0, zero
    errors, zero warnings** (no console output at all). The 28 forward-reference errors from the interim build
    are resolved. `build/site/database/lucene/` holds 29 HTML files (27 content + `cheat-sheet.html` +
    `index.html`). 36.2: all 27 basenames + cheat-sheet reachable from both `index.adoc` (28 unique xrefs) and
    `nav.adoc` (29 lucene lines incl. the section index); `architecture-and-data-flow.html` renders 5
    `class="mermaid content"` blocks + 2 lucene SVGs; `knn-vector-search.html` renders `lucene-hnsw-graph.svg`
    (present in `build/site/_images/`); `cheat-sheet.html` links `_attachments/lucene-cheat-sheet.pdf` (present
    in `build/site/_attachments/`). 36.3: PDF is 1 page, 595 x 842 pt A4, PNG render shows no clipped/overflow
    content. 36.4: **zero** admonition blocks in any new page (the only `[IMPORTANT]` is the included disclaimer
    partial, which names no source); no new page outside `index.adoc` names "Lucene in Action" / "the book" /
    "the sources"; the single "consulted" hit is ordinary prose ("a `Similarity` is consulted in two places"),
    not source attribution; `include::partial$lucene-disclaimer.adoc[]` present in all 29 `.adoc` files.
  - [x] Task 36.1. Run `npx antora antora-playbook.yml` (via an `iru-gate-runner` / generic sub-agent to keep
    the main context clean — `Agent({description: "Antora build", subagent_type: "iru-gate-runner", prompt:
    "Run npx antora antora-playbook.yml at the repo root and report every error and every 'skipping reference
    to missing attribute' warning verbatim."})`). Fix any `xref` / AsciiDoc / missing-image / mermaid errors
    and any "skipping reference to missing attribute" warnings (unescaped `{ }` in prose) introduced by the new
    pages until the build completes clean.
  - [x] Task 36.2. Confirm every new page is reachable from both
    `modules/ROOT/pages/database/lucene/index.adoc` and `modules/ROOT/nav.adoc`, that
    `build/site/database/lucene/…` HTML renders (spot-check a page with a `[mermaid]` diagram —
    e.g. `architecture-and-data-flow` or `indexing-and-merge-policies` — and one with an SVG — e.g.
    `analysis-pipeline` or `knn-vector-search`), and that `xref:attachment$lucene-cheat-sheet.pdf` resolves to
    the checked-in PDF.
  - [x] Task 36.3. Re-open `modules/ROOT/attachments/lucene-cheat-sheet.pdf` and confirm it is a single A4 page
    with no clipped content.
  - [x] Task 36.4. Grep the new pages for any admonition (`[NOTE]`, `[TIP]`, `[IMPORTANT]`, `[WARNING]`,
    `[CAUTION]`) and confirm none names *Lucene in Action*, "the book", "consulted", or "the sources" — all
    source attribution must be in `index.adoc`'s `== Bibliography` only (choice 4). Also grep for
    `include::partial$lucene-disclaimer.adoc[]` in every new page (Task 2–29) to confirm the disclaimer is
    present.
