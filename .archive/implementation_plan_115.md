# Implementation Plan: Analyzers for Elasticsearch with Spring Data

## Task summary

Source: GitHub issue #115
Base branch: main

Update `backend/springboot/elasticsearch.adoc` (the Spring Boot + Spring Data Elasticsearch reference page) so
its analysis coverage moves from purely conceptual to actionable: show how to attach an analyzer to a
`@Field`-mapped document property, how to define a *custom* analyzer for Spring Data (which — unlike Hibernate
Search's `LuceneAnalysisConfigurer` — has no Java DSL for this; it goes through index settings), list the common
built-in analyzer names usable directly, and add a comparison table cross-referencing the equivalent analyzers
already documented for Hibernate Search and Apache Lucene elsewhere in this site.

This is a documentation-only change (AsciiDoc content); no application code exists in this repository. No task
below carries a language/framework tag for that reason — per the planning skill's own guidance, an untagged task
is implemented directly rather than dispatched to a language-specific skill.

Scope and approach were already worked out and posted as a comment on the issue
(https://github.com/albertoirurueta/docs/issues/115#issuecomment-5649414983) before this plan was drafted; this
plan operationalizes that comment into concrete file edits. No further ambiguity remains — the specific edits
below make the judgment calls from that comment explicit (exact section placement, table columns, which existing
pages to link rather than duplicate).

## Current code state

- [`modules/ROOT/pages/backend/springboot/elasticsearch.adoc`](modules/ROOT/pages/backend/springboot/elasticsearch.adoc)
  — the edit target. Structure today: `Why a search engine` → `Documents, indices, shards` → `Analysis and
  mappings` (conceptual only: character filters/tokenizer/token filters, `text` vs `keyword` field types, no
  field-level analyzer example) → `Querying and relevance` → `Spring Boot integration` (a `@Document`/`@Field`
  example, `ElasticsearchRepository`, `ElasticsearchOperations`, none of the `@Field` declarations set
  `analyzer = ...`) → `References`. No `xref:` to any of the three pages below currently exists anywhere in the
  file.
- [`modules/ROOT/pages/database/elasticsearch/text-analysis.adoc`](modules/ROOT/pages/database/elasticsearch/text-analysis.adoc)
  — full native-Elasticsearch analyzer reference: a built-ins table (`standard`, `simple`, `whitespace`,
  `keyword`, `pattern`, `stop`, `language` families), custom analyzers via `settings.analysis`, `search_analyzer`,
  normalizers, tokenizers, token filters. Section anchor for the built-ins table is under `== Built-in analyzers`
  (auto-generated id `_built_in_analyzers`).
- [`modules/ROOT/pages/backend/hibernate/hibernate-search-analyzers.adoc`](modules/ROOT/pages/backend/hibernate/hibernate-search-analyzers.adoc)
  — already has two side-by-side built-in-analyzer tables: one for Hibernate Search's Lucene backend (Java
  classes: `StandardAnalyzer`, `SimpleAnalyzer`, `WhitespaceAnalyzer`, `StopAnalyzer`, `KeywordAnalyzer`,
  `EnglishAnalyzer`/`FrenchAnalyzer`/...) under `== Built-in analyzers`, and one for its Elasticsearch backend
  (names: `standard`, `simple`, `whitespace`, `stop`, `keyword`, `pattern`, `fingerprint`, `english`/`french`/...).
  Its closing paragraph (end of the `Defining a custom analyzer` section, around the sentence starting
  "Elasticsearch's own analyzer/analysis-chain concepts...") already links forward to
  `backend/springboot/elasticsearch.adoc` — this is the reciprocal link's anchor point on that side; only the
  *inbound* link is missing from `elasticsearch.adoc` today.
- [`modules/ROOT/pages/database/lucene/built-in-analyzers-and-customanalyzer.adoc`](modules/ROOT/pages/database/lucene/built-in-analyzers-and-customanalyzer.adoc)
  — the raw Apache Lucene analyzer class table (`StandardAnalyzer`, `SimpleAnalyzer`, `WhitespaceAnalyzer`,
  `KeywordAnalyzer`, `StopAnalyzer`, `EnglishAnalyzer` + ~40 language analyzers) under `== The built-in analyzers`
  (auto-generated id `_the_built_in_analyzers`).
- Spring Data Elasticsearch specifics confirmed for the examples below: `@Field(type = FieldType.Text, analyzer =
  "english")` selects a built-in analyzer by name directly on the annotation; a *custom* analyzer must be defined
  in the index's settings (there is no Java configurer API like Hibernate Search's), which Spring Data Elasticsearch
  exposes via the class-level `@Setting(settingPath = "...")` annotation pointing at a JSON settings file
  containing an `"analysis"` block, with the analyzer then referenced by name from `@Field(analyzer = "...")` /
  `searchAnalyzer = "..."` exactly as a built-in name would be.

## Implementation steps

### Group 1 — Rewrite the analyzer coverage in `backend/springboot/elasticsearch.adoc`

**Parallelizable: yes** (single task; nothing else in this group to conflict with).

- [x] Task 1. Extend `backend/springboot/elasticsearch.adoc` with field-level analyzer usage, a common-analyzers
      table, and a cross-stack comparison table — **done**: new `== Analyzers on document fields` section added
      to `modules/ROOT/pages/backend/springboot/elasticsearch.adoc` (anchor `_analyzers_on_document_fields`),
      References section extended, `:keywords:` updated. Doc-only change (no application source), so no
      tests/coverage/quality gates apply; verified instead by a clean `npx antora antora-playbook.yml` build with
      zero warnings/errors and by confirming every new `xref:` resolved to a real anchor in the rendered HTML.
  - [x] Task 1.1. Immediately after the existing `== Analysis and mappings` section (after its closing paragraph
        about dynamic vs. explicit mappings, before `== Querying and relevance`), add a new `== Analyzers on
        document fields` section that:
        - States that `analyzer` (and, when it must differ, `searchAnalyzer`) are set directly on the `@Field`
          annotation of a `@Document`-mapped property, and that a built-in analyzer is referenced simply by name.
        - Shows a code example selecting a built-in analyzer by name on a `@Field`:
          ```java
          @Field(type = FieldType.Text, analyzer = "english")
          private String description;
          ```
        - Explains that, unlike Hibernate Search's `LuceneAnalysisConfigurer`
          (xref:backend/hibernate/hibernate-search-analyzers.adoc[]), Spring Data Elasticsearch has no Java API
          for *defining* a custom analyzer — it is declared in the index's settings and only *referenced* by name
          from the annotation. Show this with a `@Setting`-annotated `@Document` class plus its settings JSON:
          ```java
          @Document(indexName = "articles")
          @Setting(settingPath = "elasticsearch/articles-settings.json")
          public class Article {

              @Id
              private String id;

              @Field(type = FieldType.Text, analyzer = "content_analyzer")
              private String body;

              // other fields, getters/setters omitted
          }
          ```
          ```json
          {
            "analysis": {
              "filter": {
                "en_stop": { "type": "stop", "stopwords": "_english_" },
                "en_stem": { "type": "stemmer", "language": "english" }
              },
              "analyzer": {
                "content_analyzer": {
                  "type": "custom",
                  "tokenizer": "standard",
                  "filter": [ "lowercase", "en_stop", "en_stem" ]
                }
              }
            }
          }
          ```
        - Notes that a distinct `search_analyzer` follows the same pattern that
          xref:database/elasticsearch/text-analysis.adoc#_search_analyzer_when_index_and_query_analysis_differ[Text
          analysis' `search_analyzer` section] describes at the Elasticsearch level, expressed on the annotation as
          `@Field(type = FieldType.Text, analyzer = "autocomplete_index", searchAnalyzer = "autocomplete_search")`.
  - [x] Task 1.2. In that same new section, add a short table of the common built-in analyzer names usable
        directly via `analyzer = "..."` (`standard`, `simple`, `whitespace`, `stop`, `keyword`, `english` /
        `french` / other language names) — one line each, not the full description already given elsewhere —
        closing with a sentence pointing to the full table:
        "See xref:database/elasticsearch/text-analysis.adoc#_built_in_analyzers[Text analysis' built-in analyzers
        table] for the complete list and behavior of each, and for tokenizers/token filters to assemble a custom
        chain from."
  - [x] Task 1.3. In that same new section, add a comparison table mapping the same conceptual analyzers across
        the three stacks this site documents, sourced from the tables already in
        `backend/hibernate/hibernate-search-analyzers.adoc` and
        `database/lucene/built-in-analyzers-and-customanalyzer.adoc` (do not invent new mappings — copy the
        name/class correspondence those two pages already establish):

        ```asciidoc
        [cols="1,2,1",options="header"]
        |===
        | Elasticsearch analyzer name | Hibernate Search equivalent | Apache Lucene class

        | `standard` | `standard` (ES backend) / `StandardAnalyzer` (Lucene backend) | `StandardAnalyzer`
        | `simple` | `simple` / `SimpleAnalyzer` | `SimpleAnalyzer`
        | `whitespace` | `whitespace` / `WhitespaceAnalyzer` | `WhitespaceAnalyzer`
        | `stop` | `stop` / `StopAnalyzer` | `StopAnalyzer`
        | `keyword` | `keyword` / `KeywordAnalyzer` | `KeywordAnalyzer`
        | `english`, `french`, ... | `english`, `french`, ... / `EnglishAnalyzer`, `FrenchAnalyzer`, ... | `EnglishAnalyzer`, `FrenchAnalyzer`, ...
        |===
        ```

        Immediately follow the table with xrefs into the full catalogs instead of repeating them:
        "See xref:backend/hibernate/hibernate-search-analyzers.adoc#_built_in_analyzers[Hibernate Search
        Analyzers] for the Hibernate Search side of this table (including how to define a custom analyzer there
        via `LuceneAnalysisConfigurer`/`ElasticsearchAnalysisConfigurer`), and
        xref:database/lucene/built-in-analyzers-and-customanalyzer.adoc[Built-in analyzers & CustomAnalyzer] for
        the underlying Lucene classes."
  - [x] Task 1.4. In the page's `== References` section, add three new bullet entries (keep the existing ones):
        - `xref:database/elasticsearch/text-analysis.adoc[Elasticsearch Text Analysis] -- the full analyzer,
          tokenizer and token-filter reference`
        - `xref:backend/hibernate/hibernate-search-analyzers.adoc[Hibernate Search Analyzers] -- built-in and
          custom analyzers on Hibernate Search's Lucene and Elasticsearch backends`
        - `xref:database/lucene/built-in-analyzers-and-customanalyzer.adoc[Apache Lucene Built-in analyzers &
          CustomAnalyzer] -- the underlying Lucene analyzer classes`
  - [x] Task 1.5. Update the page's top `:keywords:` attribute to add: `analyzer reference, search_analyzer,
        @Setting, custom analyzer, stemmer, stop words` (only add terms not already present in the existing list).

### Group 2 — Reciprocal cross-link from Hibernate Search's analyzer page

**Parallelizable: yes** (single task; depends on Group 1 only for the target section existing under a known
title, so it runs after Group 1 rather than in parallel with it).

- [x] Task 2. Add the missing inbound-link counterpart in
      `backend/hibernate/hibernate-search-analyzers.adoc` — xref updated in
      `modules/ROOT/pages/backend/hibernate/hibernate-search-analyzers.adoc`; no tests (docs-only change);
      coverage N/A; code-quality N/A; verified via a full Antora build (no xref/anchor errors).
  - [x] Task 2.1. In the `Defining a custom analyzer` section's closing paragraph — which already reads "...are
        covered in depth on xref:backend/springboot/elasticsearch.adoc[Elasticsearch]." — update that existing
        xref to point at the new anchor instead of the page's top, i.e.
        `xref:backend/springboot/elasticsearch.adoc#_analyzers_on_document_fields[Elasticsearch]`, so the link
        lands directly on the new section Task 1.1 added rather than the top of the page.

### Verification

- [x] Task 3. Verify the Antora site still builds cleanly with no `xref`/AsciiDoc errors, since this change adds
      several new `xref:` targets (including the two-way link between Group 1 and Group 2's pages) that must
      resolve correctly. — **done**: `npx antora antora-playbook.yml` exited 0 with no warnings/errors; every new
      `xref:` (including `elasticsearch.adoc#_analyzers_on_document_fields` and the reciprocal link from
      `hibernate-search-analyzers.adoc`) resolved correctly in the rendered site.
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
  - If the build reports any unresolved xref or AsciiDoc error, fix it (most likely an auto-generated section-id
    mismatch — AsciiDoc derives ids from heading text, e.g. `== Analyzers on document fields` →
    `_analyzers_on_document_fields`; confirm the exact id Antora generated rather than assuming) and re-run the
    build until clean.
