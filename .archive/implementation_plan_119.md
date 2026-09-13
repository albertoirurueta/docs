# Implementation Plan

## Task summary

Source: GitHub issue #119
Base branch: main

Issue #119 asks to: (1) explain why large `OFFSET`/`SKIP` values hurt query performance in SQL and NoSQL
databases, (2) document keyset (a.k.a. seek-method) pagination as the alternative, (3) add a new documentation
page covering this, placed in the best location, and (4) cross-link that page from every existing page that
already discusses query pagination.

Exploration (this conversation, verified against the current repository state) found this site already documents
the keyset alternative in depth per-technology (MongoDB's `skip()` → range-query pattern, Solr's `cursorMark`,
Elasticsearch's `search_after`, GraphQL's Relay-style cursors) but has **no cross-cutting page** tying these
together, and has real content gaps in SQL, Couchbase, Spring Data, and the REST APIs page. This plan closes
those gaps and adds the missing cross-cutting page.

**Placement decision** (no ambiguity — following an established site convention, not asked to the user): the new
page is `database/pagination-strategies.adoc`, placed directly under `database/` next to
`choosing-the-right-database.adoc`, because that is this site's existing pattern for a vendor-neutral,
cross-cutting guide that isn't tied to one technology (as opposed to `backend/springboot/`, which is
Spring-specific). Per that same convention (mirrored from `choosing-the-right-database.adoc` and
`database/schema-evolution/index.adoc`), the new page gets its own dedicated
`modules/ROOT/partials/pagination-strategies-disclaimer.adoc` `[IMPORTANT]` disclaimer (AI-generated content,
verify against official docs) and ends with a `== Bibliography` section.

## Current code state

This repository has no application source code — it is an Antora documentation site. Relevant existing state:

- `modules/ROOT/pages/database/index.adoc` — landing page for the Database Development section; its
  `== Sections` list is an ordered bullet list of `xref:` links, `choosing-the-right-database.adoc` listed first
  as the cross-cutting entry.
- `modules/ROOT/nav.adoc` lines 33-34 — `*** xref:database/choosing-the-right-database.adoc[...]` sits directly
  under `** xref:database/index.adoc[Databases]`, before the per-engine `*** xref:database/sql/index.adoc[...]`
  etc. entries.
- `modules/ROOT/pages/database/sql/dml-queries.adoc:57-72` — documents standard `OFFSET`/`FETCH FIRST ... ROWS
  ONLY` with a worked example, but has no seek-method/performance note.
- `modules/ROOT/pages/database/couchbase/sql-plus-plus-querying.adoc:68-82` (`== The SELECT clause set`) —
  documents `LIMIT`/`OFFSET` but has no "avoiding large offsets" section (unlike MongoDB/Solr).
- `modules/ROOT/pages/database/mongodb/crud-query.adoc:294-304` — already has `=== Avoiding large skips` with a
  range-query example; just needs a cross-link added.
- `modules/ROOT/pages/database/solr/query-basics-and-parameters.adoc:245-` — already has `=== cursorMark deep
  paging`; just needs a cross-link added. `modules/ROOT/pages/database/solr/index.adoc:63` already mentions
  `cursorMark` in its bullet description.
- `modules/ROOT/pages/database/elasticsearch/search-api-and-pagination.adoc:241-` — already has `=== search_after
  + point-in-time`; just needs a cross-link added. `modules/ROOT/pages/database/elasticsearch/index.adoc:73-75`
  already mentions pagination in its bullet description.
- `modules/ROOT/pages/backend/graphql/pagination.adoc` — already covers offset vs. cursor pagination and Relay
  Cursor Connections in depth; needs a cross-link to the new page for the cross-database comparison.
  `modules/ROOT/pages/backend/graphql/index.adoc:67` already mentions pagination in its bullet description.
- `modules/ROOT/pages/backend/springboot/spring-data-overview.adoc:117-144` (`== Paging and sorting`) documents
  `Pageable`/`Page<T>`/`Slice<T>` but never mentions `Window<T>`/`ScrollPosition.keyset()` (Spring Data's
  keyset-scrolling API since 3.1).
- `modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc:174-210` (`== JpaRepository and derived query
  methods`) has the same `Page`/`Pageable` example and the same gap. Spring Data JPA supports `Window<T>`
  scrolling.
- `modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc:122-170` (`== MongoRepository`) has the same
  `Page<Order>` example and the same gap. Spring Data MongoDB supports `Window<T>` scrolling.
- `modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc:97-133` (`== CouchbaseRepository`) has no
  `Pageable`/`Page`/`Slice` mention at all today — Spring Data Couchbase's keyset-scrolling support must be
  verified against current official docs before writing any claim about it (see Task 15.4).
- `modules/ROOT/pages/backend/springboot/rest-apis.adoc:93-116` (`=== Request and response mapping details`)
  shows a `page`/`size` (offset-style) `@RequestParam` endpoint example with no cursor-based alternative
  mentioned.
- No `*-code-one-task` skill matches AsciiDoc content (`java`, `dotnet`, `database`, `java-springboot` are the
  only ones installed) — every task below is tagged `_(asciidoc)_` for accuracy, and will be implemented
  directly rather than dispatched to a language-specific skill.
- No relevant precedent in `.archive/` (checked: no plan there is about pagination).

## Implementation steps

### Group 1 — Create the new page and wire it into navigation

Parallelizable: no — Task 2 links to the exact title/description Task 1 gives the new page.

- [x] Task 1. Create `modules/ROOT/pages/database/pagination-strategies.adoc` _(asciidoc)_ -- created with all
    sections below; disclaimer partial created (Task 1.5).
  - [x] Task 1.1. Add the file header: `= Pagination: Offset vs. Keyset`, a `:description:` and `:keywords:`
    attribute line (covering: offset pagination, keyset pagination, seek method, deep pagination, `OFFSET`,
    `SKIP`, `cursorMark`, `search_after`, cursor-based pagination, `Window<T>`, `ScrollPosition`), and
    `include::partial$pagination-strategies-disclaimer.adoc[]` (created in Task 1.5).
  - [x] Task 1.2. Write `== Why Large Offsets Are Slow`: explain that the engine must still locate, materialize,
    and discard the skipped rows/documents/hits even though they are never returned, so cost grows roughly
    linearly (or worse) with the offset value regardless of store — cite this as the shared root cause behind
    MongoDB's `skip()`, SQL's `OFFSET`, Solr's `start`, and Elasticsearch's `from` all degrading on deep pages.
  - [x] Task 1.3. Write `== The Keyset (Seek Method) Pattern`: describe the general pattern — order by a stable,
    indexed, unique (or unique-tiebroken) key; carry the last-seen key value forward from the previous page;
    filter with `WHERE key > :last` (or the store's equivalent) instead of skipping N rows. Include one
    illustrative generic SQL snippet:
    ```sql
    SELECT id, name FROM products WHERE id > :lastId ORDER BY id LIMIT 20;
    ```
  - [x] Task 1.4. Write `== Trade-offs of Keyset Pagination`: no direct jump to page N, requires a stable sort
    key (composite key when the primary sort column isn't unique), and total-count queries become a separate
    concern (a `COUNT(*)` query, or an approximate count) — so it should not be presented as a strict upgrade
    over offset pagination.
  - [x] Task 1.5. Create `modules/ROOT/partials/pagination-strategies-disclaimer.adoc`, mirroring the structure
    of `modules/ROOT/partials/choosing-a-database-disclaimer.adoc`: an `[IMPORTANT]` block stating the page is a
    vendor-neutral, AI-assisted overview to be verified against each store's own current docs, and a line
    pointing to `xref:database/pagination-strategies.adoc#_bibliography[bibliography]`.
  - [x] Task 1.6. Write `== Comparison by Data Store`: a table (`[cols="1,2,2"]`) with columns Store | Offset
    mechanism | Keyset/cursor alternative, one row per: SQL (`OFFSET`/`FETCH FIRST` →
    xref:database/sql/dml-queries.adoc[seek query]), MongoDB (`skip()` →
    xref:database/mongodb/crud-query.adoc#_avoiding_large_skips[range query]), Couchbase (`LIMIT`/`OFFSET` →
    xref:database/couchbase/sql-plus-plus-querying.adoc[SQL++ seek query]), Solr (`start`/`rows` →
    xref:database/solr/query-basics-and-parameters.adoc#_cursormark_deep_paging[`cursorMark`]), Elasticsearch
    (`from`/`size` →
    xref:database/elasticsearch/search-api-and-pagination.adoc#_search_after_point_in_time[`search_after`]),
    GraphQL (offset args → xref:backend/graphql/pagination.adoc[Relay cursor connections]), Spring Data
    (`Pageable`/`Page` → xref:backend/springboot/spring-data-overview.adoc[`Window<T>`/`ScrollPosition`]).
  - [x] Task 1.7. Write `== Bibliography`, grouping external reference links used while writing the page (e.g.
    the MongoDB, Solr, Elasticsearch, and Spring Data official docs already cited elsewhere on this site for
    these features), matching the bullet-list-under-bold-subheading style used in
    `database/choosing-the-right-database.adoc`'s own Bibliography section.

- [x] Task 2. Wire the new page into navigation and the Database landing page _(asciidoc)_ -- nav.adoc and
    database/index.adoc updated.
  - [x] Task 2.1. In `modules/ROOT/nav.adoc`, add
    `*** xref:database/pagination-strategies.adoc[Pagination: Offset vs. Keyset]` directly after line 34 (the
    `choosing-the-right-database.adoc` entry) and before the `database/sql/index.adoc` entry.
  - [x] Task 2.2. In `modules/ROOT/pages/database/index.adoc`, add a new bullet to the `== Sections` list, placed
    second (right after `choosing-the-right-database.adoc`, before the per-engine references), summarizing the
    new page the same way the existing bullets summarize theirs.

### Group 2 — Cross-link and fill content gaps in every page that discusses pagination

Parallelizable: yes — each task edits a distinct set of files with no overlap between tasks.

- [x] Task 3. SQL: document the seek-method alternative _(asciidoc)_ -- dml-queries.adoc updated; sql/index.adoc
    left unchanged (Task 3.2 note below).
  - [x] Task 3.1. In `modules/ROOT/pages/database/sql/dml-queries.adoc`, immediately after the existing
    `OFFSET`/`FETCH FIRST ... ROWS ONLY` example (after line 72), add a short paragraph noting that both
    constructs still require the engine to scan and discard the skipped rows, and add a seek-method example
    ordered by an indexed key, plus a cross-link:
    `xref:database/pagination-strategies.adoc[Pagination: Offset vs. Keyset]`.
    ```sql
    SELECT department_id, average_salary
    FROM department_salaries
    WHERE average_salary < :lastSeenAverage
    ORDER BY average_salary DESC
    FETCH FIRST 5 ROWS ONLY;
    ```
  - [x] Task 3.2. Check `modules/ROOT/pages/database/sql/index.adoc`'s bullet describing
    `dml-queries.adoc` — if it summarizes that page's content (per the pattern seen on the solr/elasticsearch
    index pages), extend it to mention the seek-method note added in Task 3.1. -- Checked: the bullet is a terse
    one-liner that doesn't itemize page features the way solr/elasticsearch's index pages do, so left unchanged.

- [x] Task 4. Couchbase: document "avoiding large offsets" _(asciidoc)_ -- new subsection + cross-link added.
  - [x] Task 4.1. In `modules/ROOT/pages/database/couchbase/sql-plus-plus-querying.adoc`, after the
    `== The SELECT clause set` example that shows `LIMIT`/`OFFSET` (after line 82), add a new `=== Avoiding large
    offsets` subsection mirroring MongoDB's `=== Avoiding large skips` (same structure: one paragraph explaining
    the cost, one SQL++ seek-query example ordered by a unique indexed field using `WHERE key > $lastKey`), plus
    a cross-link to `xref:database/pagination-strategies.adoc[]`.
  - [x] Task 4.2. In `modules/ROOT/pages/database/couchbase/index.adoc`, add a one-line cross-link mention near
    wherever this page's bullet list currently references `sql-plus-plus-querying.adoc`, pointing to the new
    "Avoiding large offsets" subsection.

- [x] Task 5. MongoDB: cross-link the existing "Avoiding large skips" section _(asciidoc)_ -- cross-links added.
  - [x] Task 5.1. In `modules/ROOT/pages/database/mongodb/crud-query.adoc`, at the end of the existing
    `=== Avoiding large skips` section (around line 304, before `=== No-timeout cursors`), add one sentence
    cross-linking `xref:database/pagination-strategies.adoc[]` for the general pattern and how it compares
    across other stores.
  - [x] Task 5.2. In `modules/ROOT/pages/database/mongodb/index.adoc`, add a one-line cross-link mention to the
    new page near its existing bullet for `crud-query.adoc` (line 50 area).

- [x] Task 6. Solr: cross-link the existing `cursorMark` section _(asciidoc)_ -- cross-links added.
  - [x] Task 6.1. In `modules/ROOT/pages/database/solr/query-basics-and-parameters.adoc`, at the end of the
    existing `=== cursorMark deep paging` section, add one sentence cross-linking
    `xref:database/pagination-strategies.adoc[]`.
  - [x] Task 6.2. In `modules/ROOT/pages/database/solr/index.adoc`, extend the existing pagination/`cursorMark`
    mention (line 63) with a cross-link to the new page.

- [x] Task 7. Elasticsearch: cross-link the existing `search_after` section _(asciidoc)_ -- cross-links added.
  - [x] Task 7.1. In `modules/ROOT/pages/database/elasticsearch/search-api-and-pagination.adoc`, at the end of
    the existing `=== search_after + point-in-time` section, add one sentence cross-linking
    `xref:database/pagination-strategies.adoc[]`.
  - [x] Task 7.2. In `modules/ROOT/pages/database/elasticsearch/index.adoc`, extend the existing pagination
    mention (lines 73-75) with a cross-link to the new page.

- [x] Task 8. GraphQL: cross-link to the cross-database comparison _(asciidoc)_ -- "See also" section added.
  - [x] Task 8.1. In `modules/ROOT/pages/backend/graphql/pagination.adoc`, add a short closing paragraph (or a
    "See also" note) cross-linking `xref:database/pagination-strategies.adoc[]` for how this compares to
    keyset/seek pagination in SQL and NoSQL stores.
  - [x] Task 8.2. In `modules/ROOT/pages/backend/graphql/index.adoc`, extend the existing pagination mention
    (line 67) with the same cross-link.

- [x] Task 9. Spring Data: document keyset scrolling (`Window<T>`/`ScrollPosition`) _(asciidoc)_ -- all
    sub-tasks done; Couchbase confirmed unsupported (see 9.4 note).
  - [x] Task 9.1. In `modules/ROOT/pages/backend/springboot/spring-data-overview.adoc`, under `== Paging and
    sorting` (after the existing `Page<T>`/`Slice<T>` explanation around line 143), add a new `=== Keyset
    scrolling with Window<T>` subsection: explain `ScrollPosition.keyset()` + `Window<T>` as the offset-free
    alternative available since Spring Data 3.1, with a short repository-method example:
    ```java
    Window<Customer> findFirst20ByLastName(String lastName, Sort sort, ScrollPosition position);
    ```
    and how to carry `window.positionAt(...)`/`window.hasNext()` forward across calls. Cross-link
    `xref:database/pagination-strategies.adoc[]`.
  - [x] Task 9.2. In `modules/ROOT/pages/backend/springboot/spring-data-jpa.adoc`, under `== JpaRepository and
    derived query methods` (after the existing `Page`/`Pageable` example around line 208), add a short paragraph
    plus example showing the same `Window<T>` scrolling method applied to a JPA repository, noting Spring Data
    JPA's native support since 3.1.
  - [x] Task 9.3. In `modules/ROOT/pages/backend/springboot/spring-data-mongodb.adoc`, under `== MongoRepository`
    (after the existing `Page<Order>` example around line 161), add the same for Spring Data MongoDB.
  - [x] Task 9.4. In `modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc`, under `==
    CouchbaseRepository`: **first verify against Spring Data Couchbase's current official reference
    documentation** whether `Window<T>`/`ScrollPosition` keyset scrolling is actually supported for this module.
    - If supported: add the same kind of example as Task 9.2/9.3.
    - If not supported: add a short paragraph stating so explicitly (don't imply parity it doesn't have), and
      instead cross-link `xref:database/couchbase/sql-plus-plus-querying.adoc[]`'s "Avoiding large offsets"
      section (added in Task 4.1) as the store-level keyset alternative to use directly via `@Query`/SQL++ when
      the repository abstraction doesn't offer scrolling.
    Cross-link `xref:database/pagination-strategies.adoc[]` either way. -- Verified via web search + the
    `CouchbaseRepository` source on GitHub (spring-projects/spring-data-couchbase, main branch): it extends only
    `PagingAndSortingRepository`/`CrudRepository`, with no scrolling counterpart, and no dedicated "Scrolling"
    reference page exists for Couchbase (unlike JPA/MongoDB/Elasticsearch/Relational/REST/Commons) -- confirmed
    NOT supported; documented as such with a cross-link to the SQL++ seek-query alternative.
  - [x] Task 9.5. Check `modules/ROOT/pages/backend/springboot/index.adoc`'s summary line for the Spring Data
    section — update it only if the additions in 9.1-9.4 materially change what that one-line summary claims
    the section covers (e.g. it currently omits any mention of scrolling/keyset pagination and would otherwise
    read as stale); otherwise leave it unchanged. -- These bullets are detailed, itemized summaries (unlike
    sql/index.adoc's terse line), so extended the overview/JPA/MongoDB/Couchbase bullets to mention `Window<T>`
    keyset scrolling (and its absence for Couchbase).

- [x] Task 10. REST APIs: document cursor-based pagination as the alternative _(asciidoc)_ -- section added.
  - [x] Task 10.1. In `modules/ROOT/pages/backend/springboot/rest-apis.adoc`, after the existing `page`/`size`
    `@RequestParam` example (around line 116, end of `=== Request and response mapping details`), add a short
    paragraph on cursor-based pagination for deep result sets — an opaque `cursor` query parameter mapped to the
    last-seen key, returned alongside each response's results — with a one-line example signature:
    ```java
    @GetMapping
    List<OrderSummary> list(@RequestParam(required = false) String cursor,
                             @RequestParam(defaultValue = "20") int size) { ... }
    ```
    Cross-link `xref:database/pagination-strategies.adoc[]` and
    `xref:backend/springboot/spring-data-overview.adoc[]` (for the `Window<T>` building block this would use).

### Group 3 — Validate the build

Parallelizable: yes (single task).

- [x] Task 11. Validate the Antora build _(asciidoc)_ -- clean build, no warnings/errors; one anchor mismatch
    found and fixed (see 11.2 note).
  - [x] Task 11.1. Delegate to the `iru-gate-runner` agent: `Agent({description: "Build docs site", subagent_type:
    "iru-gate-runner", prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build the Antora site and report back
    only whether the build succeeded, and the full text of any xref/AsciiDoc warnings or errors — especially any
    involving database/pagination-strategies.adoc, its new partial, or any of the files touched for issue 119
    (dml-queries.adoc, sql-plus-plus-querying.adoc, crud-query.adoc, query-basics-and-parameters.adoc,
    search-api-and-pagination.adoc, pagination.adoc, spring-data-overview.adoc, spring-data-jpa.adoc,
    spring-data-mongodb.adoc, spring-data-couchbase.adoc, rest-apis.adoc, and every index.adoc/nav.adoc edited)."})`.
    -- Ran `npm ci && npx antora --log-level=warn antora-playbook.yml`: build succeeded with zero warnings/errors.
  - [x] Task 11.2. Fix any reported broken `xref:` targets (a wrong anchor ID is the most likely failure mode —
    Asciidoctor auto-generates section anchors like `_avoiding_large_skips` from the heading text; confirm each
    cross-link in Group 1/2 above resolves to the actual generated anchor) or AsciiDoc syntax errors, then re-run
    Task 11.1 until the build is clean. -- Antora's xref resolution didn't itself flag it (unresolved xrefs are
    warnings, and none fired), but manual verification of every generated anchor id in build/site/**/*.html found
    one mismatch: `Window<T>` in a heading loses its `<`/`>` as HTML entities rather than becoming a `_`
    separator, so `=== Keyset scrolling with Window<T>` generated `_keyset_scrolling_with_windowt` (no
    underscore before `t`), not `_keyset_scrolling_with_window_t` as originally written into the three
    `xref:...#_keyset_scrolling_with_window_t[]` links (spring-data-jpa.adoc, spring-data-mongodb.adoc,
    spring-data-couchbase.adoc). Fixed all three to the correct anchor and rebuilt clean.
