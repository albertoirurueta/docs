# Implementation Plan: More Like This searches with Elasticsearch

## Task summary

Source: GitHub issue #117
Base branch: main

Document Elasticsearch's `more_like_this` ("More Like This" / MLT) query: how it works, how documents must be
indexed so they can be compared for similarity, its best uses, and concrete code examples — both at the
stand-alone Elasticsearch reference level and through Spring Data Elasticsearch in the Spring Boot integration
page, per the issue's explicit ask.

This is a documentation-only change (AsciiDoc content); no application code exists in this repository. No task
below carries a language/framework tag for that reason — per this skill's own guidance, an untagged task is
implemented directly rather than dispatched to a language-specific skill. This follows the same shape as
`.archive/implementation_plan_115.md` (issue #115, "Analyzers for Elasticsearch with Spring Data"): extend the
SpringBoot integration page with a new subsection, add the corresponding deep-dive reference-page section, and
cross-link the two.

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **No new page.** `more_like_this` is a single, well-scoped query type — it fits as a new section on the
   existing `search-extras.adoc` reference page (which already covers other "specialized"/non-scoring query
   features: highlighting, suggesters, collapse, `percolate`) rather than warranting its own page, matching how
   `percolate` — a comparably-scoped specialized query — is handled there today.
2. **Section placement in `search-extras.adoc`:** immediately after the existing `== Percolation` section and
   before `== Related pages`, following that page's established section style (prose + official-docs link +
   `[source,console]` mapping/query examples).
3. **Section placement in `backend/springboot/elasticsearch.adoc`:** a new `=== More Like This: finding similar
   documents` subsection under the existing top-level `== Spring Boot integration` section, immediately after the
   `=== Analyzers on document fields` subsection (added by issue #115) and before `== References` — keeping every
   Spring Data Elasticsearch–specific topic grouped under one top-level heading, consistent with how Analyzers was
   added there.
4. **Parameter reference sourced from the current official Elastic docs**, confirmed via
   https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-mlt-query (fetched during planning) —
   used verbatim below rather than from potentially stale training data:
   - Document input: `like` (required — free text, document references `_index`/`_id`, or artificial documents),
     `unlike` (same syntax, excludes those terms), `fields` (defaults to `index.query.default_field`, i.e. `*`).
   - Term selection: `max_query_terms` (default `25`), `min_term_freq` (default `2`), `min_doc_freq` (default
     `5`), `max_doc_freq` (default `2147483647`), `min_word_length` (default `0`), `max_word_length` (default
     `0`, unbounded), `stop_words`, `analyzer` (defaults to the analyzer of the first field in `fields`).
   - Query formation: `minimum_should_match` (default `"30%"`), `boost_terms` (default `0`, deactivated),
     `include` (default `false`), `boost` (default `1.0`), `fail_on_unsupported_field` (default `true`).
   - Indexing requirement (this is the issue's specific "how must documents be indexed" ask): fields used with
     `like` must be `text` or `keyword`; when referencing an existing document by `_index`/`_id`, Elasticsearch
     needs either `_source` enabled (the default — no extra mapping work) or the field `stored`/carrying
     `term_vector` — storing term vectors at index time avoids re-analyzing `_source` on every query and is the
     recommended setup for MLT used at any scale.
5. **Java API Client class names/builder shape confirmed via web research** (no prior reference to
   `MoreLikeThisQuery`/`Like`/`LikeDocument` existed anywhere in this repo to copy from): `Query.of(q ->
   q.moreLikeThis(m -> m...))`, built via `MoreLikeThisQuery.of(m -> m.fields(...).like(l -> l.text("...")))` for
   free text, or `.like(Like.of(l -> l.document(LikeDocument.of(ld -> ld.index("books").id("42")))))` for a
   document reference — matching this Java API Client's existing usage pattern in the page's `BookSearchService`
   example (`Query.of(q -> q.bool(...))` via the `NativeQuery.builder().withQuery(q -> ...)` lambda style).
6. **Cross-link to vector/semantic search, not a duplicate of it.** MLT and `vector-and-semantic-search.adoc`
   (kNN / `semantic_text`) both answer "find similar things" but by different mechanisms (shared vocabulary vs.
   shared meaning); the new section adds one short paragraph disambiguating the two and links onward instead of
   re-explaining vector search.
7. **`term_vector` mapping detail stays inline, not promoted to `mapping-and-field-types.adoc`.** That page has
   no `term_vector` mapping-parameter entry today; `search-extras.adoc` already introduces `term_vector` ad hoc
   for the `fvh` highlighter (line 55) rather than centralizing it, so the MLT section follows that same existing
   pattern (a brief inline mention, not a new cross-page reference table) — keeps this change scoped to what the
   issue asked for.

## Current code state

- [`modules/ROOT/pages/database/elasticsearch/search-extras.adoc`](modules/ROOT/pages/database/elasticsearch/search-extras.adoc)
  (398 lines) — the edit target for the reference-level section. Structure today: `Highlighting` → `Suggesters:
  autocomplete and did-you-mean` → `Shaping the result set` (`collapse`/`inner_hits`, `_msearch`) → `Search
  templates` → `Percolation: matching documents against stored queries` (lines 328–386, ends right before `==
  Related pages` at line 388) → `Related pages` (388–398, the page's closing cross-link list). Top-of-file
  `:description:`/`:keywords:` attributes (lines 2–3) currently list highlighting/suggesters/collapse/percolate
  topics only — no mention of `more_like_this`. Line 55 already references `"term_vector":
  "with_positions_offsets"` for the `fvh` highlighter, giving the new section something concrete to point back to
  rather than re-explaining term vectors from scratch.
- [`modules/ROOT/pages/database/elasticsearch/index.adoc`](modules/ROOT/pages/database/elasticsearch/index.adoc)
  — section landing page; its `=== Searching & analytics` bullet list (lines 71–107) has one bullet per
  reference page, including (lines 93–95) `xref:database/elasticsearch/search-extras.adoc[Search extras:
  highlighting, suggesters, collapse & percolation] -- highlighting, the term/phrase/completion suggesters and
  the search_as_you_type field, result collapse and _msearch, search templates, and the percolate query.` — this
  needs `more_like_this` folded into that one-line summary.
- [`modules/ROOT/pages/backend/springboot/elasticsearch.adoc`](modules/ROOT/pages/backend/springboot/elasticsearch.adoc)
  (275 lines) — the edit target for the Spring Boot integration subsection. Structure today: `Why a search
  engine` → `Documents, indices, shards` → `Analysis and mappings` → `Querying and relevance` → `Spring Boot
  integration` (dependency, `@Document`/`@Field` example, a `BookSearchService` with a `bool`/`match`/`term`
  `NativeQuery` example ending line 155, a `spring.elasticsearch.*` YAML block 157–166, then `=== Analyzers on
  document fields` 168–266 added by issue #115) → `== References` (267–275, seven bullets, the last four being
  `xref:` links added by #115). No mention of `more_like_this`, `MoreLikeThisQuery`, or "similar documents"
  anywhere in the file today. Top-of-file `:description:`/`:keywords:` (lines 2–3) list analyzer/mapping/query
  terms only.
- No prior `more_like_this` content exists anywhere in the repository (`grep -rli` across `*.adoc` returned zero
  hits in `database/elasticsearch/` or `backend/springboot/elasticsearch.adoc`).
- Verification convention for this docs-only repo (per `.archive/implementation_plan_115.md`): no
  tests/coverage/quality gates apply; the change is verified by a clean `npx antora antora-playbook.yml` build
  (zero warnings/errors) with every new `xref:` confirmed to resolve to a real anchor in the rendered HTML,
  delegated to `iru-gate-runner` so the build log doesn't consume the main context window.

## Implementation steps

### Group 1 — Add the More Like This reference section to `search-extras.adoc` [x]

**Parallelizable: yes** (single task; nothing else in this group to conflict with).

- [x] Task 1. Add a new `== More Like This: finding similar documents` section to
      `modules/ROOT/pages/database/elasticsearch/search-extras.adoc`, plus the matching landing-page and
      metadata updates. -- section added (prose, parameter table, MLT-vs-vector paragraph, two
      `[source,console]` examples, `include` note); `index.adoc` bullet and page `:description:`/`:keywords:`
      updated. Docs-only change: no tests/coverage/quality gates apply to this group (build verification is
      Task 3, separate).
  - [x] Task 1.1. Insert the new section immediately after the existing `== Percolation: matching documents
        against stored queries` section (currently ending line 386) and before `== Related pages` (currently
        line 388). Cover, in the page's existing prose-then-console-example style:
        - **What it does**: `more_like_this` extracts representative terms from one or more input
          texts/documents (a TF-IDF-style selection), forms a disjunction (`should`) query from those terms, and
          runs it — a lexical, term-based similarity search. Link the official reference:
          https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-mlt-query[More like this query].
        - **How documents must be indexed** (the issue's specific ask): fields referenced via `like`/`unlike`
          must be `text` or `keyword`. Two ways to supply the "like" input:
          - inline free text (`like: "text to match"` or a per-field `{ "text": "...", "fields": [...] }`
            entry) — no special indexing needed beyond the field being analyzed;
          - a reference to an existing document (`like: [{ "_index": "...", "_id": "..." }]`), which needs
            either `_source` enabled (the default mapping — works out of the box) or the field mapped `"store":
            true` / `"term_vector": "yes"` (or `with_positions`/`with_positions_offsets`) so Elasticsearch reuses
            stored term statistics instead of re-analyzing `_source` at query time on every request — cross-link
            the `fvh`/`term_vector` mention already in this page's `Highlighting` section instead of
            re-explaining term vectors: `xref:database/elasticsearch/search-extras.adoc#_choosing_a_highlighter[the
            fvh highlighter's term_vector note above]` (use the actual anchor id once rendered — confirm during
            the Antora build in Task 3).
        - **Key tuning parameters** — one short list/table, values from the confirmed current defaults: `fields`
          (default `index.query.default_field`, i.e. `*`), `like` / `unlike`, `min_term_freq` (default `2`),
          `max_query_terms` (default `25`), `min_doc_freq` (default `5`) / `max_doc_freq` (default
          `2147483647`), `min_word_length` (default `0`) / `max_word_length` (default `0`, unbounded),
          `stop_words`, `analyzer` (defaults to the first field's analyzer), `minimum_should_match` (default
          `"30%"`), `boost_terms` (default `0`), `include` (default `false`).
        - **Best uses**: "related articles/products" recommendations, near-duplicate/duplicate-content
          detection, lightweight content-based recommendations, and moderation (grouping similar spam/abuse
          reports) — framed as a cheap alternative to embeddings when semantic nuance isn't required.
        - **MLT vs. semantic/vector search** — one short paragraph: MLT matches shared vocabulary (lexical), not
          shared meaning (semantic); no embedding model or inference cost; works immediately on existing `text`
          mappings. Point to
          `xref:database/elasticsearch/vector-and-semantic-search.adoc[Vector & semantic search]` for the
          embedding-based alternative when queries and documents may share meaning without sharing words.
        - **Code example**, `[source,console]` style matching the existing Percolation example (`PUT` mapping +
          query), covering both `like` forms:
          ```
          PUT /articles
          {
            "mappings": {
              "properties": {
                "title": { "type": "text" },
                "body":  { "type": "text", "term_vector": "yes" },
                "tags":  { "type": "keyword" }
              }
            }
          }

          GET /articles/_search
          {
            "query": {
              "more_like_this": {
                "fields": ["title", "body"],
                "like": "vector databases and approximate nearest neighbour search",
                "min_term_freq": 1,
                "max_query_terms": 12
              }
            }
          }

          GET /articles/_search
          {
            "query": {
              "more_like_this": {
                "fields": ["title", "body"],
                "like": [
                  { "_index": "articles", "_id": "42" }
                ],
                "unlike": [
                  { "_index": "articles", "_id": "7" }
                ],
                "min_term_freq": 2,
                "min_doc_freq": 3
              }
            }
          }
          ```
        - Close with a one-line note: `include: true` returns the input documents themselves alongside the
          results (default `false` excludes them), useful when testing relevance tuning.
  - [x] Task 1.2. Add a bullet for the new section to `== Related pages` (or fold the cross-links into the new
        section itself per Task 1.1 and skip a separate bullet if that reads as redundant — use judgement against
        the page's existing style once the section is drafted). -- did both: the cross-link paragraph is inline
        in the new section, and a dedicated `Related pages` bullet to `vector-and-semantic-search.adoc` was also
        added (matches how the page's other `Related pages` bullets summarize/point onward rather than only
        appearing inline).
  - [x] Task 1.3. Update the page's top `:description:` (line 2) and `:keywords:` (line 3) attributes to add
        `more_like_this` / "more like this" / "similar documents" / "document similarity" terms (only add terms
        not already present in the existing lists). -- done.
  - [x] Task 1.4. Update
        [`modules/ROOT/pages/database/elasticsearch/index.adoc`](modules/ROOT/pages/database/elasticsearch/index.adoc)'s
        `=== Searching & analytics` bullet for `search-extras.adoc` (currently lines 93–95) to mention the
        `more_like_this` query in its one-line summary, e.g. append "...search templates, the `percolate` query,
        and `more_like_this` for finding similar documents." -- done.

### Group 2 — Add the Spring Data Elasticsearch subsection [x]

**Parallelizable: no — depends on Group 1's section existing under a known heading/anchor**, since this group's
subsection cross-links into it (mirrors `.archive/implementation_plan_115.md`'s Group 2 depending on Group 1).

- [x] Task 2. Add a `=== More Like This: finding similar documents` subsection to
      `modules/ROOT/pages/backend/springboot/elasticsearch.adoc`, plus its metadata and `== References` updates.
      -- section added after `=== Analyzers on document fields` (document-reference example, free-text variant
      note, and a forward xref to the reference-page section for indexing requirements); `== References` bullet
      and page `:description:`/`:keywords:` updated. Docs-only change: no tests/coverage/quality gates apply
      (build verification is Task 3, separate).
  - [x] Task 2.1. Insert the new subsection immediately after `=== Analyzers on document fields` (currently
        ending line 266) and before `== References` (currently line 267). Cover:
        - A one-sentence intro: the Java API Client's query builders support `more_like_this` the same way the
          `BookSearchService` example above builds a `bool` query — via `Query.of(q -> q.moreLikeThis(...))`
          inside a `NativeQuery`.
        - A code example finding books similar to a given book by id (document-reference form):
          ```java
          public List<Book> findSimilar(String bookId) {
              Query query = NativeQuery.builder()
                      .withQuery(q -> q.moreLikeThis(m -> m
                              .fields("title", "description")
                              .like(l -> l.document(d -> d.index("books").id(bookId)))
                              .minTermFreq(2)
                              .minDocFreq(3)))
                      .build();

              return operations.search(query, Book.class)
                      .stream()
                      .map(SearchHit::getContent)
                      .toList();
          }
          ```
        - A short variant note + snippet for the free-text form (`.like(l -> l.text(freeText))`), for when there
          is no existing document to reference yet (e.g. matching a draft against published content).
        - A short note that, as with the reference-page section, referencing an existing document by id benefits
          from `@Field(..., termVector = TermVector.YES)` (or a more specific variant) on the fields used in
          `fields(...)` for indexing/query performance at scale, with a forward xref to the new
          `search-extras.adoc` section for the full indexing-requirements explanation rather than repeating it:
          `xref:database/elasticsearch/search-extras.adoc#<anchor-from-task-1>[More Like This]` (confirm the
          exact generated anchor id during the Task 3 build, same caveat as Task 1.1).
  - [x] Task 2.2. In the page's `== References` section (currently lines 267–275), add one new bullet:
        `xref:database/elasticsearch/search-extras.adoc#<anchor>[Elasticsearch Search Extras] -- highlighting,
        suggesters, collapse, percolation, and the more_like_this query` (adjust wording to match whatever Task
        1.2's final bullet phrasing is, if a dedicated bullet was added there). -- added, using the confirmed
        anchor `_more_like_this_finding_similar_documents`.
  - [x] Task 2.3. Update the page's top `:description:` (line 2) and `:keywords:` (line 3) attributes to add
        `more_like_this`, "similar documents", "document similarity", "MoreLikeThisQuery" (only add terms not
        already present). -- done.

### Verification

- [x] Task 3. Verify the Antora site still builds cleanly with no `xref`/AsciiDoc errors, since this change adds
      several new `xref:` targets (the reciprocal link between Group 1's and Group 2's new sections, plus the
      `index.adoc` bullet) that must resolve correctly, and confirm the exact anchor ids AsciiDoc generated for
      both new `==`/`===` headings (used by Tasks 1.1/2.1's cross-links above — AsciiDoc derives ids from heading
      text, so "More Like This: finding similar documents" is expected to become
      `_more_like_this_finding_similar_documents`, but confirm against the actual rendered output rather than
      assuming).
  - -- confirmed: `npx antora` build succeeded with zero warnings/errors; rendered anchor id
    `id="_more_like_this_finding_similar_documents"` verified present in `build/site/database/elasticsearch/search-extras.html`,
    and the cross-links from `build/site/backend/springboot/elasticsearch.html` resolve to it.
  - Delegate to the `iru-gate-runner` agent so the build log doesn't consume the main context window:
    ```
    Agent({
      description: "Build Antora site to verify xref targets resolve",
      subagent_type: "iru-gate-runner",
      prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora documentation site.
        Report back only: whether the build succeeded, and the full text of any xref-resolution or AsciiDoc
        errors/warnings it produced (file and line, if given) — nothing else from the build log."
    })
    ```
  - If the build reports any unresolved xref or AsciiDoc error, fix it and re-run the build until clean.
