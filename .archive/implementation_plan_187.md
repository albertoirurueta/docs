# Implementation Plan: Guides & References / Databases — Vector Databases & RAG

## Task summary

Source: GitHub issue #187
Base branch: main

Issue [#187](https://github.com/albertoirurueta/docs/issues/187) asks for a new **Vector Databases & RAG** section
under **Guides & References / Databases** in this repo's `ROOT` Antora component, at
`modules/ROOT/pages/database/vector-rag/`. It is a **practical, vendor-neutral guide to vector databases as the
retrieval layer of RAG systems driven by AI agents**. It explains the concepts every engine shares, compares the
engines, and shows how a vector store plugs into agents through **LangChain** (plus LangChain4j) and **Spring AI**.

The issue body is the primary spec, and its **"Addendum: vector database comparison" comment**
(https://github.com/albertoirurueta/docs/issues/187#issuecomment-5845279460) is part of it. The comment holds the
per-engine strengths/weaknesses table, the "one cloud only" service lists, pricing models, free tiers and every
official source URL for the comparison page. Every task below that touches the comparison page, the cheat sheet or
the bibliography must read that comment in full (`gh issue view 187 --comments`).

Choices made during exploration or on the user's behalf:

1. **Ship everything in one pass (user decision).** All **23 concept pages + `index.adoc` + `cheat-sheet.adoc` +
   the one-page PDF**, exactly as specified. There is no consolidation (unlike #145 Redis, which cut 35 → 25 pages
   and dropped its cheat sheet).
2. **The book is confirmed** at `~/Desktop/vector.pdf`: Borwankar, *Vector Databases: A Practical Introduction*,
   O'Reilly, 2026, ISBN 978-1-098-17759-1. It is used for concept narrative only, **never as the source of a code
   example**, and it is named **only** in `index.adoc`'s `== Bibliography`. Where the book is outdated (sqlite-vss,
   the book's narrower pgvector, weighted fusion only, hand-rolled RAG), the page says "older approach X; today Y"
   in plain prose with no book reference. The PDF is never copied into the repo.
3. **Disclaimer shape follows #145's Redis rule.** `vector-rag-disclaimer.adoc` contains only the AI-assistance
   sentence and the bibliography pointer. The version baseline goes in prose. **No other admonition** appears
   anywhere in the section.
4. **Tasks are untagged (no language key).** Every task authors AsciiDoc/SVG/PDF documentation. The installed
   `*-code-one-task` skills (`java`, `java-springboot`, `dotnet`, `database`) implement source code, not docs, so
   each task is implemented directly. The *code examples inside the pages* are Python / SQL / Java, but they are
   page content, not repository source.
5. **One embedding model and one chat model for the whole scenario**, so every stack's examples interoperate:
   * Ollama `nomic-embed-text` (768 dims) for the *DocsAssistant* store
   * Ollama `llama3.1:8b` for generation and tool calling

   The embedding pages still use sentence-transformers `all-MiniLM-L6-v2` (384 dims) for standalone concept demos.
   They say explicitly that this is a separate, smaller demo model. If `nomic-embed-text` is no longer the model
   the Ollama embeddings docs feature, pick the featured 768-dim model and use it everywhere.
6. **Versions are re-verified at implementation time.** Baseline (checked 2026-09-26):

   | Component | Version |
   |---|---|
   | Python | 3.12 |
   | sentence-transformers | 6.1 |
   | FAISS | 1.15.1 |
   | sqlite-vec | 0.1.9 |
   | pgvector | 0.8.6 |
   | Ollama | 0.34 |
   | langchain / langchain-core / langgraph | 1.4 / 1.6 / 1.2 |
   | langchain-text-splitters | 1.1 |
   | langchain-postgres | 0.0.18 |
   | LangChain4j | 1.20.1 |
   | Spring Boot / Spring AI | 4.1 / 2.0.1 |
   | RAGAS | 0.4.3 |
   | MCP spec | 2026-07-28 |

   The comparison page's cloud and pricing facts are dated and re-verified the same way.

## Current code state

- There is **no `database/vector-rag/` directory**, no `partials/vector-rag-disclaimer.adoc`, no
  `images/vector-rag-*.svg` and no `attachments/vector-rag-cheat-sheet.pdf`. No page documents embeddings, ANN
  theory, pgvector, sqlite-vec, RAG, agentic RAG, LangChain or Spring AI as first-class topics.
- **`modules/ROOT/nav.adoc`**: in the Databases block, the Redis block ends with
  `**** xref:database/redis/deploying-on-azure.adoc[Deploying on Azure]`, and the next line is
  `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`. The new block goes between them.
  Match on this text, not on line numbers.
- **`modules/ROOT/pages/database/index.adoc`**: `:description:` lists every subsection, ending "…, Qdrant Reference
  and Redis Reference documentation subsections, and the Evolving the Database Model guide…". `== Sections` has a
  `xref:database/redis/index.adoc[Redis Reference]` bullet followed by the Evolving the Database Model bullet.
- **`modules/ROOT/pages/index.adoc`**: a long `:keywords:` on line 3.
- **Page shape to mirror** (`database/redis/*.adoc`, `database/qdrant/*.adoc`):
  * header: `= Title`, `:description:` (one sentence), `:keywords:`, a blank line, the disclaimer include, then a
    lead paragraph and `==` sections
  * landing pages: a reading-order paragraph, `== What's covered` (grouped bullets) and `== Bibliography`
  * footer: `== Related pages` (`xref:` list, optional), then `== References` (online docs only)
  * cheat-sheet pages (`database/qdrant/cheat-sheet.adoc`): grouped back-link paragraphs ending with
    `xref:attachment$<x>-cheat-sheet.pdf[Download … (PDF)]`
- **Math**: pages that use formulas add `:stem: latexmath` to the header and write display math as
  `[stem]` + `++++` … `++++` (see `database/elasticsearch/compound-queries-and-relevance.adoc` lines 4 and 188).
- **Figures**: `modules/ROOT/images/*.svg` are hand-authored SVGs with these conventions:
  * a `viewBox`
  * `font-family="Helvetica, Arial, sans-serif"`
  * a flat light background and hard-coded hex colours
  * no CSS variables and no external references

  Pages embed them with `image::<name>.svg[…]`. Mermaid blocks are `[mermaid]` + `....`, validated by
  `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`, needs `npm i --no-save mermaid@11 jsdom`).
- **Cheat-sheet PDF pipeline** (from `.archive/implementation_plan_121.md`):
  1. Hand-author a single-page A4 HTML/CSS layout **in the scratchpad, never the repo**.
  2. Render it with `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome --headless
     --print-to-pdf=<out> --no-pdf-header-footer <file.html>`.
  3. Verify it is exactly 1 A4 page (`python3 -c "import fitz; d=fitz.open('x.pdf'); print(d.page_count,
     d[0].rect)"` — PyMuPDF is installed; `pdfinfo` is not) and render a PNG preview to check nothing is clipped.
  4. Copy only the PDF to `modules/ROOT/attachments/`.
- **Existing pages to link, never repeat.** `vector-search.adoc` in the Redis section is the richest existing
  Spring AI 2.0 example.

  | Existing page | Relevant anchor | Link to |
  |---|---|---|
  | `database/choosing-the-right-database.adoc` | `== Vector Databases` at line ~303 with `=== Choosing one` | the landscape and comparison pages |
  | `database/qdrant/rag-integration-patterns.adoc` | `== Related pages` at line 214 | |
  | `database/qdrant/vector-indexing-and-hnsw.adoc`, `database/qdrant/hybrid-and-sparse-search.adoc` | | |
  | `database/redis/vector-search.adoc` | `== Related pages` at line 312 | |
  | `database/redis/spring-boot-redis-as-a-vector-database.adoc`, `database/redis/use-cases-and-patterns.adoc` | | |
  | `database/redis/deploying-on-aws.adoc` / `-google-cloud.adoc` / `-azure.adoc` | `== Related pages` (line ~295 on AWS) | |
  | `database/elasticsearch/vector-and-semantic-search.adoc`, `database/solr/dense-vector-search.adoc`, `database/lucene/knn-vector-search.adoc` | | |
  | `database/neo4j/vector-search-and-genai.adoc` | GraphRAG | |
  | `database/neo4j/similarity-embeddings-and-ml-pipelines.adoc` | graph embeddings | |
  | `database/mongodb/special-indexes-and-search.adoc` | the Atlas Vector Search section | |
  | `database/couchbase/search-analytics-eventing.adoc` | vector subsection | |
  | `backend/springboot/index.adoc` | Redis vector-store mention, lines ~95–100 | |
  | `backend/quarkus/extensions-and-the-platform.adoc` | LangChain4j mention, lines ~170–171 | |
  | `apps/apple/apple-intelligence-and-machine-learning.adoc` | prompt-injection section | |
- **Verification** is the Antora build (`npx antora antora-playbook.yml`, zero errors or warnings) plus the mermaid
  validator, run through the `iru-gate-runner` / a sub-agent (`.claude/agents/iru-gate-runner.md` exists). There
  is no test suite, coverage or code-quality tooling for AsciiDoc.
- **AsciiDoc gotchas** (both hit by earlier sections):
  * Outside `[source]` blocks, a literal `{word}` is an attribute reference and emits "skipping reference to
    missing attribute". This section's prose is full of braces: Python dicts, JSON metadata, Spring AI filter
    expressions, `search_kwargs={"k": 5}`, set notation. Escape them as `\{ … \}` in prose, table cells and bullet
    text.
  * Never let a wrapped line start with `<digits>.` (e.g. `2026.` in the bibliography), because it becomes an
    ordered-list marker.
- **Precedents**: `.archive/implementation_plan_145.md` (Redis) for the section structure, conventions and the
  wiring/verify groups; `.archive/implementation_plan_121.md` (Qdrant) for the cheat sheet and its PDF.

## Shared *DocsAssistant* scenario

Every content page uses these names. They are defined once here so parallel page authors stay consistent.

*DocsAssistant* is an AI agent that answers questions about a corpus of technical documentation, namely AsciiDoc
pages like this site's.

| Concern | Name / value |
|---|---|
| Sample corpus | Three AsciiDoc files used in every example: `docs/vector-rag/hnsw.adoc` ("HNSW indexes"), `docs/vector-rag/pgvector.adoc` ("pgvector basics"), `docs/spring-ai/rag.adoc` ("RAG with Spring AI"). Each has 2–3 sections of ~150 words, written inline on `document-ingestion-and-chunking.adoc`. Metadata `component` = `vector-rag` or `spring-ai`. |
| Embedding model | Ollama `nomic-embed-text`, **768 dims**, cosine. Its task prefixes (`search_document: ` / `search_query: `) are explained on the embeddings-in-practice page. |
| Chat model | Ollama `llama3.1:8b`, `temperature` 0.1, `num_ctx` 8192 |
| PostgreSQL database | `docsassistant` (Docker image `pgvector/pgvector:pg17`, or the current pgvector 0.8.6 tag), user/password `docs`/`docs` in examples only |
| Hand-written schema | `documents(id bigserial PK, source_path text UNIQUE, title text, component text, content_hash text, updated_at timestamptz)`; `chunks(id bigserial PK, document_id bigint FK → documents ON DELETE CASCADE, chunk_index int, section_path text, content text, token_count int, content_hash text, tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED)`; `chunk_embeddings(chunk_id bigint PK FK → chunks ON DELETE CASCADE, model text, embedding vector(768))` |
| Indexes | `chunk_embeddings_hnsw` = `USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)`; `chunks_tsv_gin` = `USING gin (tsv)`; B-tree on `documents(component)` |
| Framework-managed stores (same database) | Spring AI `PgVectorStore` table `docs_vector_store` (`spring.ai.vectorstore.pgvector.table-name`). LangChain `PGVector` collection `docsassistant`. LangChain4j `PgVectorEmbeddingStore` table `docs_lc4j_embeddings`. The integration pages explain that each framework **owns its own schema**, which differs from the hand-written one. |
| Metadata keys | `source_path`, `title`, `section`, `component`, `chunk_index` |
| SQLite | file `docsassistant.db`; `vec0` table `vec_chunks(chunk_id integer primary key, embedding float[768], component text)`; FTS5 table `chunks_fts` |
| FAISS | `IndexFlatIP` ground truth, `IndexHNSWFlat(768, 16)`, `IndexIVFFlat` with `nlist = 64`; persisted as `docsassistant.faiss` |
| Qdrant (benchmark only) | collection `docsassistant_chunks`, size 768, Cosine |
| Agent tool | Python `search_docs(query: str, component: str \| None = None, k: int = 5) -> list[dict]`; Spring AI `@Tool("Search the documentation") List<DocHit> searchDocs(String query, String component)` |
| Conversation memory | `conversations(id uuid PK, title text, created_at)`; `messages(id uuid PK, conversation_id FK, message_index int, role text, content text, created_at)`; `message_embeddings(message_id uuid PK FK, embedding vector(768))`; Spring AI `ChatMemory` conversation id = `conversationId` |
| Semantic cache | table `answer_cache(id bigserial PK, question text, embedding vector(768), answer text, created_at timestamptz)`, hit threshold cosine similarity ≥ 0.92 (explained as model-specific) |
| Golden questions (evaluation) | "What does `ef_search` control in an HNSW index?", "Which pgvector operator computes cosine distance?", "Which Spring AI advisor adds retrieved documents to the prompt?" with reference answers `the size of the candidate list during search`, `<=>`, `QuestionAnswerAdvisor` |
| Java package / types | `com.example.docsassistant`; `record DocHit(String sourcePath, String section, String content, double score)` |
| Python module | `docsassistant/` with `ingest.py`, `search.py`, `rag.py`, `agent.py`, `evaluate.py` (names used in example headings only) |

## Conventions every content page must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:`, a blank line,
  `include::partial$vector-rag-disclaimer.adoc[]`, then a lead paragraph. The lead states, in plain prose, which
  versions the page's examples target. Pages with formulas add `:stem: latexmath` to the header.
- **Every concept has at least one code example** (Python, SQL and/or Java on the *DocsAssistant* scenario).
  **Each example is followed by a link** to the specific official page it derives from. Code is written against
  the official docs, never copied from the book.
- **"In LangChain / In Spring AI" subsection.** Every concept page has a short `== In LangChain and Spring AI`
  section (a `=== LangChain` and a `=== Spring AI` snippet, plus LangChain4j where relevant). It shows the
  framework abstraction for that concept and links the integration page's stable anchor, e.g.
  `xref:database/vector-rag/integrating-with-spring-ai.adoc#spring-ai-vector-store-api[…]`. The two integration
  pages instead end with a short section pointing at the other framework's equivalent.
- **Stable anchors** on the integration pages (Group 5 defines them; earlier groups link to them by these exact
  IDs, so they are fixed here):
  * LangChain: `[[langchain-embeddings]]`, `[[langchain-vector-stores]]`, `[[langchain-splitters]]`,
    `[[langchain-retrievers]]`, `[[langchain-rag-chain]]`, `[[langchain-agentic-rag]]`, `[[langchain4j]]`
  * Spring AI: `[[spring-ai-embeddings]]`, `[[spring-ai-vector-store-api]]`, `[[spring-ai-filter-expressions]]`,
    `[[spring-ai-etl]]`, `[[spring-ai-rag-advisors]]`, `[[spring-ai-modular-rag]]`, `[[spring-ai-chat-memory]]`,
    `[[spring-ai-tools]]`, `[[spring-ai-testing]]`
- **Future framework sections**: the integration pages state in prose that full LangChain and Spring AI sections
  are planned. They must **never** `xref:` a page that does not exist; link the official docs instead.
- **Footer**: `== Related pages` (`xref:` list to siblings and the existing engine pages), then a mandatory
  `== References` listing only online documentation and papers, each linked.
- **No admonitions** except the disclaimer include. Deprecations, pitfalls and security warnings are prose or
  table rows.
- **No book attribution in prose.** The book is never named outside `index.adoc`'s `== Bibliography`.
- **Modern tools only**: sqlite-vec (sqlite-vss only as a history paragraph), `docs.langchain.com` URLs (never
  `python.langchain.com`), Spring AI 2.0 APIs (`SearchRequest.builder()`, `QuestionAnswerAdvisor.builder(...)`),
  LangChain 1.x `create_agent`.
- **Cross-link, don't repeat**: engine specifics go to the existing Qdrant/Redis/Elasticsearch/… pages.
- **Figures**: add a `[mermaid]` block or a `vector-rag-*.svg` in `modules/ROOT/images/` wherever the issue's 📊
  floor asks for one (the floors are a minimum). Each task authors the SVGs its page embeds.
- **Escape `{ }` in prose**, and avoid line-leading `<digits>.`.
- Every page must be reachable from both `database/vector-rag/index.adoc` and `nav.adoc` once Group 6 lands.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every later page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/vector-rag-disclaimer.adoc` — created with the `[IMPORTANT]`/`====`
  block, matching `partials/redis-disclaimer.adoc`'s markup shape but with the two required sentences only.
  - [x] Task 1.1. Author an `[IMPORTANT]` / `====` block containing **only**:
    * (a) "This content was generated with the assistance of AI and should be verified against the official
      documentation of each tool and framework before being relied on in production."
    * (b) "This section's xref:database/vector-rag/index.adoc#_bibliography[bibliography] lists the reference
      material consulted while preparing these pages."

    Include no version line, no book name and no other sentence. Copy the markup from
    `partials/redis-disclaimer.adoc`. — done; no version line, no book name, no extra sentence included.
  - [x] Task 1.2. Confirm the include line every page uses: `include::partial$vector-rag-disclaimer.adoc[]`. —
    confirmed; the partial's filename (`vector-rag-disclaimer.adoc`) matches this include path exactly.

### Group 2 — Content pages: foundations, similarity search and indexing

**Parallelizable: yes.** Seven independent pages (Tasks 2–8). Each includes the Group 1 partial, uses only the
shared scenario and anchors fixed above, and only `xref:`s other pages. No page needs another page's finished
text, and each task authors its own SVGs. This group comes first because it fixes the vocabulary and parameter
names (metrics, `M` / `ef_construction` / `ef_search`, `nlist` / `nprobe`, the memory formula) that Groups 3–5
reuse verbatim.

- [x] Task 2. Create `database/vector-rag/what-is-a-vector-database.adoc` ("What Is a Vector Database?")
  - [x] Task 2.1. Why unstructured data needs semantic search: the "get my money back" and "laptop won't turn on"
    keyword-vs-semantic contrasts, and the "apple" ambiguity, told on *DocsAssistant* ("how do I speed up
    similarity search" should find "HNSW indexes").
  - [x] Task 2.2. The vector data type and its three operations: similarity, (approximate) nearest neighbour, and
    vector arithmetic. Include a NumPy brute-force cosine search over 5 toy vectors.
  - [x] Task 2.3. Use-case list (semantic search, RAG, recommendations, dedup, anomaly detection, multimodal
    retrieval).
  - [x] Task 2.4. SQL `FLOAT[]` vs. vector-specific capabilities: the `CREATE TABLE … vector FLOAT[]` limitation,
    shown next to `vector(768)` in pgvector. NoSQL-with-extensions: when it is enough, and its retrofit limits.
    Purpose-built engines.
  - [x] Task 2.5. **The hybrid architecture**: vector component + metadata component + integration layer, plus an
    informal hybrid query next to its real pgvector SQL equivalent.
  - [x] Task 2.6. 📊 `vector-rag-hybrid-architecture.svg`; 📊 mermaid keyword-vs-semantic flow. Add the
    LangChain / Spring AI subsection (a `VectorStore` as the "integration layer"), Related pages, References.
- [x] Task 3. Create `database/vector-rag/embeddings.adoc` ("Embeddings")
  - [x] Task 3.1. Embedding as verb and as noun. The distributional hypothesis.
  - [x] Task 3.2. Word2Vec (CBOW / skip-gram) and vector arithmetic: a runnable gensim `word2vec-google-news-300`
    (or `glove-wiki-gigaword-100`) king − man + woman example via `most_similar(positive=…, negative=…)`, linked
    to the gensim docs. Doc2Vec in one subsection.
  - [x] Task 3.3. Transformer embeddings: encoder-only, decoder-only and encoder-decoder; contextual embeddings
    with the "bank" example in sentence-transformers `all-MiniLM-L6-v2`, shown via cosine of two "bank"
    sentences.
  - [x] Task 3.4. Dedicated embedding models and contrastive training. Dimensions and their cost. **Matryoshka**
    truncation (sentence-transformers `truncate_dim`). Multilingual models. Multimodal CLIP (a text–image
    similarity snippet). Sparse vs. dense (SPLADE). Zero-shot classification with embeddings (label prompts +
    cosine).
  - [x] Task 3.5. Limitations (domain vocabulary, rare concepts). Text embeddings vs. **graph** embeddings, linking
    `database/neo4j/similarity-embeddings-and-ml-pipelines.adoc`.
  - [x] Task 3.6. 📊 `vector-rag-embedding-space.svg` (2-D projection of clusters); 📊
    `vector-rag-vector-arithmetic.svg`. Add the LangChain `Embeddings` / Spring AI `EmbeddingModel` subsection,
    Related pages, References (Word2Vec, Doc2Vec, SBERT, Matryoshka papers; the sbert.net, gensim and CLIP docs).
- [x] Task 4. Create `database/vector-rag/generating-embeddings-in-practice.adoc` ("Generating Embeddings in Practice")
  - [x] Task 4.1. Choosing a model: MTEB (link the leaderboard), the dimension/quality/latency/licence trade-offs,
    max sequence length. A comparison table of 4–5 representative open and hosted models, stated as of the
    writing date.
  - [x] Task 4.2. Generating embeddings:
    * sentence-transformers `encode(batch_size=…, normalize_embeddings=True, device=…)`
    * the Ollama `/api/embed` endpoint (curl + Python `ollama.embed`) with `nomic-embed-text` and its task
      prefixes
    * a hosted API via configuration
    * LangChain `OllamaEmbeddings`
    * Spring AI `EmbeddingModel` (Ollama starter)
    * LangChain4j `OllamaEmbeddingModel`
  - [x] Task 4.3. Query vs. document prompts for asymmetric models. Batching, caching by content hash (a Python
    `functools`/dict cache keyed by `sha256`), memory management and error handling.
  - [x] Task 4.4. **The golden rule**: the same model and version for index and query. Store `model` on
    `chunk_embeddings`. Re-embedding and migration strategies (a new `embedding_v2` column or table, a shadow
    index, dual write, cut-over).
  - [x] Task 4.5. 📊 mermaid re-embedding migration flow. Add the framework subsection, Related pages, References.
- [x] Task 5. Create `database/vector-rag/similarity-metrics-and-semantic-search.adoc` ("Similarity Metrics & Semantic Search")
  - [x] Task 5.1. `:stem: latexmath`. Formulas in `[stem]` blocks: L2 / squared L2, inner product, cosine, L1,
    Hamming, Jaccard. When each fits (selection heuristics). Normalisation (cosine ≡ IP on unit vectors), shown in
    NumPy.
  - [x] Task 5.2. Distance vs. similarity and conversions (`1 − cosine distance`, `1/(1+L2)`; pgvector `<=>`
    ranges 0–2). Similarity thresholds and why they are model-specific (0.8 / 0.7 / 0.6 bands as a starting
    heuristic).
  - [x] Task 5.3. End-to-end semantic search over the *DocsAssistant* chunks with NumPy brute force. Exact kNN vs.
    range search.
  - [x] Task 5.4. A table of each engine's metric names (pgvector operators and opclasses, sqlite-vec
    `distance_metric`, FAISS `METRIC_L2` / `METRIC_INNER_PRODUCT`, Qdrant, Redis, Elasticsearch, Spring AI
    `distance-type`, LangChain `distance_strategy`), linking the engine pages.
  - [x] Task 5.5. 📊 `vector-rag-distance-metrics.svg`. Add the framework subsection (`similarity_search_with_score`
    / `SearchRequest.similarityThreshold`), Related pages, References.
- [x] Task 6. Create `database/vector-rag/ann-indexes.adoc` ("ANN Indexes: Flat, IVF, HNSW and Beyond")
  - [x] Task 6.1. `:stem: latexmath`. The ANN problem and the (1+ε) definition. Recall@k vs. latency vs. memory
    vs. build time. The curse of dimensionality.
  - [x] Task 6.2. Flat (exact). **IVF**: k-means, `nlist`, `nprobe`, training, cluster skew. LSH.
  - [x] Task 6.3. **HNSW**: layers, greedy descent, `M`, `efConstruction`, `efSearch`, and the memory formula
    `(d·4 + M·2·4)` bytes per vector (the formula the comparison page reuses). Insert/delete behaviour. The
    complexity note: log-like vs. linear-ish regimes, and why "O(log n)" is a heuristic.
  - [x] Task 6.4. Graph-on-disk indexes (DiskANN / Vamana; Redis SVS-VAMANA, Milvus DiskANN, Couchbase Hyperscale,
    `pg_diskann`) in one subsection. The index-selection decision tree.
  - [x] Task 6.5. A parameter-equivalence table (pgvector `m` / `ef_construction` / `hnsw.ef_search` / `lists` /
    `ivfflat.probes`; Qdrant; Redis; Elasticsearch; Lucene; Milvus), linking the engine pages. Include a runnable
    FAISS snippet measuring HNSW recall@10 vs. `efSearch` against `IndexFlatIP`.
  - [x] Task 6.6. 📊 `vector-rag-hnsw-layers.svg`; 📊 `vector-rag-ivf-cells.svg`; 📊 mermaid index decision tree.
    Add the framework subsection (Spring AI `index-type` / LangChain `PGVector` HNSW options), Related pages
    (Qdrant HNSW, Lucene kNN), References (the HNSW paper, pgvector, FAISS wiki, DiskANN).
- [x] Task 7. Create `database/vector-rag/quantization-and-compression.adoc` ("Quantization & Compression")
  - [x] Task 7.1. Why vectors are memory-bound. Scalar quantization: fp16 / `halfvec`, int8, 4-bit.
  - [x] Task 7.2. **Product quantization** step by step: subspaces, k-means codebooks, codes, asymmetric distance
    computation, with the memory arithmetic for 768 dims. A FAISS `IndexPQ` / `IndexIVFPQ` example with
    `index_factory("IVF64,PQ16")`. Refinement / rescoring (`IndexRefineFlat`).
  - [x] Task 7.3. Binary quantization plus rescoring: pgvector `binary_quantize` expression index + re-rank SQL;
    Qdrant and Elasticsearch BBQ linked.
  - [x] Task 7.4. Dimensionality reduction (PCA via `IndexPreTransform`, Matryoshka truncation). Measuring the
    recall cost. A bytes-per-vector table.
  - [x] Task 7.5. 📊 `vector-rag-product-quantization.svg`. Add the framework subsection, Related pages, References
    (the PQ paper, the FAISS wiki, pgvector).
- [x] Task 8. Create `database/vector-rag/faiss.adoc` ("FAISS")
  - [x] Task 8.1. FAISS as a library, not a database: architecture (`Index`, `index_factory`, `train` / `add` /
    `add_with_ids` / `IndexIDMap`, `search`, `range_search`), persistence (`write_index` / `read_index`), CPU vs.
    GPU.
  - [x] Task 8.2. Composite indexes (`IndexPreTransform`, `IndexRefineFlat`, `IndexShards`). The index-properties
    table (bytes per vector).
  - [x] Task 8.3. A runnable benchmark of Flat vs. IVF vs. HNSW on synthetic 768-dim data (build time, query
    time, recall@10).
  - [x] Task 8.4. What FAISS does not give you (metadata, transactions, updates, access control), which is why it
    ends up embedded in databases (sqlite-vss history). LangChain `FAISS` as a quick local store.
  - [x] Task 8.5. 📊 mermaid FAISS workflow (train → add → search → persist). Add the framework subsection,
    Related pages, References.

### Group 3 — Content pages: filtering, hybrid search, SQL engines, landscape and comparison

**Parallelizable: yes.** Six independent pages (Tasks 9–14). They depend on Group 2 only for its fixed vocabulary
and memory formula; they do not edit Group 2 files. `comparing-vector-databases.adoc` must read the issue's
addendum comment in full.

- [x] Task 9. Create `database/vector-rag/metadata-filtering.adoc` ("Metadata Filtering") — created; covers
  pre-/post-/in-graph filtering, the overfetch-then-filter failure mode, pgvector iterative scans, partial
  indexes, partitioning, sqlite-vec partition columns, filterable HNSW/kNN across engines, multi-tenancy
  strategies, Spring AI filter expressions and LangChain `filter=`, a mermaid pre-/post-filter flowchart, and the
  `In LangChain and Spring AI` / Related pages / References sections. No test/coverage tooling applies (docs-only
  repo).
  - [x] Task 9.1. Why metadata stays in structured columns or payloads. **Pre- vs. post- vs. in-graph filtering.**
    The overfetch-then-filter pattern and its failure mode, demonstrated with pgvector SQL returning too few rows.
  - [x] Task 9.2. pgvector **iterative index scans** (`SET hnsw.iterative_scan = relaxed_order`,
    `hnsw.max_scan_tuples`). Partial indexes per `component`. Partitioning per tenant.
  - [x] Task 9.3. sqlite-vec metadata / partition-key columns (`component text` on `vec_chunks`). Filterable HNSW
    in Qdrant, Lucene / Elasticsearch filtered kNN, and Redis pre-filtered KNN, each linked. Multi-tenancy
    strategies.
  - [x] Task 9.4. Framework filter languages: Spring AI filter expressions, both the text form
    `"component == 'vector-rag'"` and `FilterExpressionBuilder`; the LangChain `filter=` per store.
  - [x] Task 9.5. 📊 mermaid pre- vs. post-filter. Add Related pages and References.
- [x] Task 10. Create `database/vector-rag/hybrid-search-and-reranking.adoc` ("Hybrid Search & Re-ranking") —
  created with `vector-rag-fusion-and-rerank.svg`; covers BM25 (FTS5 `bm25()`, PostgreSQL `ts_rank_cd`), sparse
  vectors, weighted linear fusion vs. RRF (`[stem]` formula, a two-CTE PostgreSQL SQL query), cross-encoder
  re-ranking, MMR, LangChain `EnsembleRetriever`/`ContextualCompressionRetriever`, Spring AI `DocumentJoiner`, and
  the `In LangChain and Spring AI` / Related pages / References sections. No test/coverage tooling applies.
  - [x] Task 10.1. `:stem: latexmath`. Why vectors blur exact terms (identifiers such as `ef_search`). BM25
    (saturation, length normalisation) via SQLite FTS5 `bm25()` and PostgreSQL `ts_rank_cd` on `chunks.tsv`.
    Sparse vectors as learned keyword search.
  - [x] Task 10.2. **Score fusion**: max / min-max normalisation and weighted linear fusion (the 0.7 / 0.3 split
    and score dominance) vs. **Reciprocal Rank Fusion** (`[stem]` formula, `k = 60`). A full hybrid query in pure
    PostgreSQL SQL (two CTEs + RRF). When to prefer each approach.
  - [x] Task 10.3. **Re-ranking** with a sentence-transformers `CrossEncoder` (e.g.
    `cross-encoder/ms-marco-MiniLM-L6-v2`). **MMR / source diversity**.
  - [x] Task 10.4. LangChain `EnsembleRetriever` / `ContextualCompressionRetriever`. Spring AI `DocumentJoiner` and
    document post-processing. Link the Qdrant, Elasticsearch and Redis hybrid pages.
  - [x] Task 10.5. 📊 `vector-rag-fusion-and-rerank.svg` (two ranked lists → fusion → re-rank funnel). Add Related
    pages and References (the RRF paper, FTS5, PostgreSQL text search, sbert cross-encoders).
- [x] Task 11. Create `database/vector-rag/sqlite-vector-search.adoc` ("Vector Search in SQLite") — created;
  covers sqlite-vec install/`vec0` tables/`serialize_float32`/KNN, the two-table pattern with the rowid/UPSERT
  pitfall, FTS5 hybrid search, sqlite-vss history and migration, Turso/libSQL, LangChain `SQLiteVec`, a mermaid ER
  diagram, and the `In LangChain and Spring AI` (with an honest note on the Spring AI gap) / Related pages /
  References sections. No test/coverage tooling applies.
  - [x] Task 11.1. SQLite as a local, embedded vector database for personal-scale data.
  - [x] Task 11.2. **sqlite-vec**:
    * `pip install sqlite-vec`, `sqlite_vec.load(conn)`
    * `vec0` tables with `float[768]` / `int8[…]` / `bit[…]` columns
    * `serialize_float32`
    * KNN `WHERE embedding MATCH ? AND k = 5 ORDER BY distance`
    * `distance_metric=cosine`
    * metadata, partition-key and auxiliary columns
  - [x] Task 11.3. The **two-table pattern** joining `vec_chunks` to a `chunks` table; the `rowid` / `INSERT OR
    REPLACE` pitfall and UPSERT; keeping raw embeddings for re-indexing; FTS5 hybrid search on `chunks_fts`.
  - [x] Task 11.4. sqlite-vss history (deprecated since 2023, FAISS-backed `vss0`) and migrating to sqlite-vec.
    Turso / libSQL native vectors in one paragraph. Scale limits. LangChain `SQLiteVec`.
  - [x] Task 11.5. 📊 mermaid ER diagram of the two-table schema. Add Related pages and References.
- [x] Task 12. Create `database/vector-rag/postgresql-pgvector.adoc` ("PostgreSQL & pgvector") — created; covers
  the compose.yaml/extension setup, vector types and operators, HNSW vs. IVFFlat (plus iterative scans, build
  settings, `EXPLAIN`), the full DocsAssistant schema DDL with multilevel embeddings and a processing queue,
  psycopg/LangChain/Spring AI clients, managed-cloud pgvector, a mermaid ER diagram, and the `In LangChain and
  Spring AI` / Related pages / References sections. No test/coverage tooling applies.
  - [x] Task 12.1. A `compose.yaml` with the `pgvector/pgvector` image. `CREATE EXTENSION vector`. The `vector` /
    `halfvec` / `sparsevec` / `bit` types and their limits. Operators `<->`, `<#>`, `<=>`, `<+>`, `<~>`, `<%>`.
  - [x] Task 12.2. **HNSW** (`m`, `ef_construction`, `SET hnsw.ef_search`) vs. **IVFFlat** (`lists`,
    `ivfflat.probes`, build after load). Operator classes. Iterative scans (link Task 9). `maintenance_work_mem`
    and parallel builds. Drop and re-create indexes for bulk loads. `EXPLAIN (ANALYZE)` to confirm index use.
  - [x] Task 12.3. The full *DocsAssistant* hand-written schema DDL (the shared-scenario table exactly), including
    the generated `tsv` column and all three indexes. Multilevel (document + chunk) embeddings. A processing
    queue table.
  - [x] Task 12.4. Clients:
    * Python `psycopg` 3 + `pgvector.psycopg.register_vector`: insert + KNN query
    * Java: one sentence on Spring AI `PgVectorStore` linking `integrating-with-spring-ai.adoc#spring-ai-vector-store-api`
    * LangChain `langchain-postgres` `PGVector`
  - [x] Task 12.5. Managed pgvector on each cloud (RDS/Aurora, Cloud SQL/AlloyDB ScaNN, Azure Flexible Server
    `pg_diskann`) in one short paragraph linking the comparison page. Scale guidance and when to move to a
    dedicated engine.
  - [x] Task 12.6. 📊 mermaid ER diagram of the *DocsAssistant* schema. Add Related pages
    (`choosing-the-right-database.adoc`) and References (the pgvector README and CHANGELOG, pgvector-python,
    PostgreSQL docs).
- [x] Task 13. Create `database/vector-rag/vector-database-landscape.adoc` ("The Vector Database Landscape") —
  created with `vector-rag-landscape-map.svg`; covers the five categories, an 11-column feature-comparison table
  across 19 engines (verified against live LangChain/Spring AI/LangChain4j integration docs), the portability
  problem framed honestly as an illustrative/proposed sketch (no fabricated spec URL), and the `In LangChain and
  Spring AI` / Related pages / References sections. No test/coverage tooling applies.
  - [x] Task 13.1. The categories:
    * libraries (FAISS)
    * SQL extensions (pgvector, sqlite-vec, Oracle AI Vector Search)
    * purpose-built engines (Qdrant, Milvus, Weaviate, Chroma, LanceDB, and Pinecone as managed)
    * search engines (Elasticsearch, OpenSearch, Solr, Lucene)
    * multi-model / NoSQL (Redis, MongoDB, Couchbase, Neo4j, Cassandra)
  - [x] Task 13.2. A **feature** table: deployment model, index types, filtering, hybrid, quantization, licence,
    LangChain / Spring AI / LangChain4j support (checked against the official integration lists), and a link to
    this site's page where one exists. It points to the comparison page for the evaluation.
  - [x] Task 13.3. **The portability problem.** Summarise the Vector Query Language proposal: data model,
    `SIMILARITY SEARCH … USING METRIC … TOP K`, filtered / thresholded search, `HYBRID SEARCH` with weights,
    `RANGE SEARCH`, batch, vector functions and aggregations (`AVG` centroid, `GEOMETRIC_MEDIAN`). Paraphrase
    only; the syntax sketches are illustrative. Contrast it with today's answers: framework `VectorStore` /
    `EmbeddingStore` abstractions and SQL extensions.
  - [x] Task 13.4. 📊 `vector-rag-landscape-map.svg`. Add Related pages (every engine section) and References.
- [x] Task 14. Create `database/vector-rag/comparing-vector-databases.adoc` ("Comparing Vector Databases") —
  created with `vector-rag-scale-vs-ops-quadrant.svg` (cloud-availability matrix rendered as a table instead of a
  second SVG, since it would only duplicate the table); read the issue body and the full addendum comment
  (`gh issue view 187 --comments`) and re-verified facts as of 2026-09-26; covers evaluation criteria, a
  no-invented-numbers benchmark harness (compose.yaml + Python script, code only), a capacity/cost worked example
  reusing `ann-indexes.adoc`'s exact HNSW memory formula, the per-engine strengths/weaknesses table from the
  addendum, the cloud availability matrix and "staying on one cloud" subsection, the pricing/free-tier table
  (every row linking its official page), a choosing-by-scenario table + mermaid decision flow, and the `In
  LangChain and Spring AI` / Related pages / References sections (every addendum Source URL included). No
  test/coverage tooling applies.
  - [x] Task 14.1. Re-read the issue body's comparison spec and the **addendum comment** in full. Re-verify every
    dated fact via official pages (cloud availability, GA dates, free tiers, licences, pricing models). Record
    "as of <date>" on the page.
  - [x] Task 14.2. **Evaluation criteria**: performance, scalability, price, cloud availability (the 1P / V / BYOC /
    Self legend), and operations/ecosystem, as defined in the issue.
  - [x] Task 14.3. **Rules for performance claims** in prose: no invented numbers, mechanism-based description,
    vendor benchmarks labelled. A **runnable benchmark harness**:
    * a `compose.yaml` with `pgvector/pgvector` + `qdrant/qdrant`
    * a Python script that loads *DocsAssistant*-style synthetic 768-dim vectors
    * it measures recall@10 against FAISS `IndexFlatIP` ground truth, p50/p99 latency, QPS, filtered recall,
      ingest time and index size, then prints a results table

    Show the code only; no numbers are reported as facts.
  - [x] Task 14.4. **Capacity and cost worked example** using Task 6's formula: 10 M × 768 dims, `M = 16` ≈ 32 GB;
    int8 ≈ ¼; binary ≈ 1/32 of the raw vectors plus the graph. Show why RAM-resident, disk-based and
    object-storage-based engines cost differently.
  - [x] Task 14.5. **Per-engine strengths and weaknesses** table, from the addendum comment. Every engine listed
    there appears, with a link to this site's engine section where one exists (Qdrant, Redis, Elasticsearch,
    Solr, Lucene, MongoDB, Couchbase, Neo4j, pgvector/sqlite-vec pages).
  - [x] Task 14.6. **Cloud availability matrix** (AWS | Google Cloud | Azure | Other/BYOC, with a named service
    per cell) plus the hyperscaler-native row. A "staying on one cloud with first-party services only"
    subsection from the addendum. Link `database/redis/deploying-on-*.adoc`.
  - [x] Task 14.7. **Pricing-model and free-tier table** from the addendum: no hard-coded prices, and every row
    links its official pricing page, dated.
  - [x] Task 14.8. **Choosing by scenario** table + 📊 mermaid decision flow extending
    `choosing-the-right-database.adoc`. **Switching cost**: what `VectorStore` abstractions hide and what they
    don't.
  - [x] Task 14.9. 📊 `vector-rag-scale-vs-ops-quadrant.svg`; 📊 `vector-rag-cloud-availability-matrix.svg` (or a
    well-formatted table if the SVG would duplicate it — at least one SVG is required). Add the framework
    subsection (switching stores by starter / package), Related pages, and References (every official URL used
    on the page, from the addendum's Sources).

### Group 4 — Content pages: RAG and agents

**Parallelizable: yes.** Six independent pages (Tasks 15–20). They build on the schema and scenario fixed above
and on Group 3's pgvector and hybrid-search terminology, and they don't edit earlier files.

- [x] Task 15. Create `database/vector-rag/rag-fundamentals.adoc` ("RAG Fundamentals") — created with
  `vector-rag-rag-architecture.svg`; covers retrieval motivation, the ingest/query architecture, the three-way
  DocsAssistant pipeline (Python/LangChain/Spring AI), context-window/Lost-in-the-middle/num_ctx prose and the
  naive/advanced/modular/agentic taxonomy, plus `In LangChain and Spring AI` / Related pages / References. No
  test/coverage tooling applies (docs-only repo).
  - [x] Task 15.1. Why LLMs need retrieval (frozen knowledge, private data, hallucination, citations). RAG vs.
    fine-tuning vs. long context.
  - [x] Task 15.2. The canonical architecture: the **ingestion (offline)** and **query (online)** paths.
  - [x] Task 15.3. The minimal *DocsAssistant* RAG pipeline three ways, all against the same pgvector database:
    * hand-rolled Python (`psycopg` + `ollama.embed` + `ollama.chat`)
    * LangChain (retriever + prompt + `ChatOllama`)
    * Spring AI (`ChatClient` + `QuestionAnswerAdvisor`)

    Each is followed by its official link.
  - [x] Task 15.4. Context window and token budgeting. **Lost in the middle.** Temperature for grounded answers.
    The Ollama `num_ctx` silent-truncation pitfall (as prose). A naive / advanced / modular / agentic RAG
    taxonomy linking the following pages.
  - [x] Task 15.5. 📊 `vector-rag-rag-architecture.svg` (ingest + query); 📊 mermaid sequence diagram of one
    question. Add Related pages (Qdrant RAG patterns, Redis Spring AI page) and References (the RAG paper, the
    Lost in the Middle paper, Ollama, LangChain, Spring AI RAG).
- [x] Task 16. Create `database/vector-rag/document-ingestion-and-chunking.adoc` ("Document Ingestion & Chunking")
  — created with `vector-rag-chunking-overlap.svg`; covers the inline sample corpus, loaders/PDF pitfalls, all
  eight chunking strategies with snippets, per-chunk metadata and the full `ingest.py`, Spring AI/LangChain/
  LangChain4j ETL, plus `In LangChain and Spring AI` / Related pages / References. No test/coverage tooling
  applies.
  - [x] Task 16.1. The three sample corpus files, written inline as `[source,asciidoc]` blocks (they are the
    scenario's data).
  - [x] Task 16.2. Loaders (PDF, HTML, Markdown / AsciiDoc). PDF pitfalls (multi-column, equations; Grobid /
    Nougat named). Cleaning and quality filtering.
  - [x] Task 16.3. **Chunking strategies**, each with a snippet:
    * fixed word or token windows with overlap
    * sentence-aware
    * recursive character (`RecursiveCharacterTextSplitter`)
    * structure-aware (`MarkdownHeaderTextSplitter`, or splitting AsciiDoc on `==`)
    * semantic
    * parent-child / small-to-big
    * **late chunking**
    * **contextual retrieval** (a context prefix per chunk)

    Chunk-size guidance (200 words + 50 overlap; 512–1,024 tokens + ~20%) and how to tune it.
  - [x] Task 16.4. Per-chunk metadata (the shared keys + `content_hash`, `model`). Idempotent, incremental
    ingestion: hash, UPSERT, delete orphans in one transaction, a processing queue. The full hand-written Python
    `ingest.py` against the shared schema.
  - [x] Task 16.5. Spring AI ETL: `TikaDocumentReader` / `MarkdownDocumentReader`, `TokenTextSplitter`, metadata
    enrichers, `VectorStore.add` as the writer. LangChain loaders + splitters + `add_documents`. LangChain4j
    `EmbeddingStoreIngestor`.
  - [x] Task 16.6. 📊 `vector-rag-chunking-overlap.svg`; 📊 mermaid ingestion pipeline. Add Related pages and
    References (late chunking, contextual retrieval, the LangChain splitters, Spring AI ETL).
- [x] Task 17. Create `database/vector-rag/retrieval-strategies.adoc` ("Retrieval Strategies") — created; covers
  top-k/threshold and multilevel retrieval, context expansion and parent-document retrieval, query
  transformation (rewrite/multi-query/HyDE/translation/history-compression/routing/self-query, linking Task 10's
  MMR and re-ranking sections instead of repeating them), Spring AI modular RAG and LangChain/LangChain4j
  retrievers, a mermaid modular RAG flow, and `In LangChain and Spring AI` / Related pages / References. No
  test/coverage tooling applies.
  - [x] Task 17.1. Top-k and thresholds, with a lower threshold for retrieval than for display. **Multilevel
    retrieval**: document- and chunk-level search merged, in SQL.
  - [x] Task 17.2. **Context expansion around a hit** (±N neighbouring chunks by `chunk_index`) and parent-document
    retrieval.
  - [x] Task 17.3. **Query transformation**: rewrite, multi-query expansion, HyDE, translation, and compressing
    chat history into a standalone question. Query routing across stores. Self-query (an LLM-extracted metadata
    filter). MMR / diversity. Re-ranking (link Task 10).
  - [x] Task 17.4. Spring AI modular RAG:
    * `RewriteQueryTransformer`, `CompressionQueryTransformer`, `TranslationQueryTransformer`, `MultiQueryExpander`
    * `VectorStoreDocumentRetriever`, `ConcatenationDocumentJoiner`
    * wired into `RetrievalAugmentationAdvisor`

    The LangChain retrievers: `MultiQueryRetriever`, `ParentDocumentRetriever`, self-query. LangChain4j
    `QueryTransformer` / `QueryRouter` / `ContentAggregator`.
  - [x] Task 17.5. 📊 mermaid modular RAG flow. Add Related pages and References.
- [x] Task 18. Create `database/vector-rag/prompt-augmentation-and-generation.adoc` ("Prompt Augmentation &
  Generation") — created; covers source-attributed context formatting/citation instructions/no-relevant-context
  handling/score bias, domain-specific prompts with confidence/faithfulness instructions, local Ollama `/api/chat`
  streaming, Spring AI `ContextualQueryAugmenter`/`QuestionAnswerAdvisor` and LangChain `ChatPromptTemplate`
  composition (doubling as the mandatory `In LangChain and Spring AI` section), plus Related pages / References.
  No test/coverage tooling applies.
  - [x] Task 18.1. Context formatting with source attribution (`SOURCE n: <title> § <section>` blocks) and citation
    instructions. Ordering contexts by relevance (primacy). Handling "no relevant context" explicitly.
    Popularity / score bias.
  - [x] Task 18.2. Domain-specific prompts (technical-docs and conversational examples). Confidence and
    faithfulness instructions.
  - [x] Task 18.3. Local LLMs with Ollama: `/api/chat`, `options.temperature`, `options.num_ctx`, streaming.
  - [x] Task 18.4. Spring AI `ContextualQueryAugmenter` / `QuestionAnswerAdvisor` prompt templates
    (`promptTemplate(...)`, `allowEmptyContext`). LangChain prompt composition for RAG
    (`ChatPromptTemplate`).
  - [x] Task 18.5. Add Related pages and References.
- [x] Task 19. Create `database/vector-rag/agentic-rag.adoc` ("Agentic RAG") — created; covers retriever-as-tool/
  multi-hop/routing/self-correcting RAG, the three-way DocsAssistant agent (LangChain `create_agent`, a LangGraph
  graph, Spring AI `ChatClient` tools), GraphRAG and MCP-server-tool subsections, safety (prompt injection, tool
  permissioning, loop limits), a mermaid state diagram, and `In LangChain and Spring AI` / Related pages /
  References. No test/coverage tooling applies.
  - [x] Task 19.1. What changes when the LLM *decides* to retrieve. **Retriever-as-tool.** Multi-hop and iterative
    retrieval. Routing between the vector store, SQL and web tools. Self-correcting RAG (grade documents →
    rewrite the query → retry). Answer verification against sources.
  - [x] Task 19.2. The *DocsAssistant* agent three ways:
    * LangChain 1.x `create_agent(model=ChatOllama(...), tools=[search_docs])`
    * a LangGraph agentic-RAG graph (retrieve → grade → rewrite / generate nodes), linked to
      `docs.langchain.com/oss/python/langgraph/agentic-rag`
    * a Spring AI `ChatClient` with `.tools(new DocsTools(vectorStore))` exposing `@Tool searchDocs`
  - [x] Task 19.3. GraphRAG in one subsection linking `database/neo4j/vector-search-and-genai.adoc` and Microsoft
    GraphRAG. Exposing vector search as an **MCP server tool** (spec 2026-07-28) in one subsection, linking the
    MCP docs and Spring AI MCP overview. Show a minimal tool definition, not a full server.
  - [x] Task 19.4. Safety: prompt injection through retrieved documents, tool permissioning, and loop/step limits.
  - [x] Task 19.5. 📊 mermaid state diagram of the agentic-RAG loop. Add Related pages and References.
- [x] Task 20. Create `database/vector-rag/agent-memory-and-semantic-cache.adoc` ("Agent Memory & Semantic
  Cache") — created; covers short-/long-term and episodic/semantic memory, the conversations/messages/
  message_embeddings schema with incremental embedding and ±3-message SQL retrieval, Spring AI `ChatMemory`
  advisors and LangGraph checkpointers, semantic caching on `answer_cache` (threshold, invalidation, risks,
  retention), linking the two Redis pages, a mermaid memory read/write diagram, and `In LangChain and Spring AI`
  / Related pages / References. No test/coverage tooling applies.
  - [x] Task 20.1. Short-term (conversation window) vs. long-term (vector-backed) memory. Episodic and semantic
    memory as embeddings.
  - [x] Task 20.2. Conversation search as agent memory:
    * the `conversations` / `messages` / `message_embeddings` schema
    * incremental embedding
    * ±3-message context-window retrieval in SQL
    * privacy
  - [x] Task 20.3. Spring AI `ChatMemory` + `MessageChatMemoryAdvisor` and `VectorStoreChatMemoryAdvisor` with
    `conversationId`. LangGraph checkpointer / store for long-term memory.
  - [x] Task 20.4. **Semantic caching** on `answer_cache`: lookup SQL with a similarity threshold, insert,
    invalidation (TTL, corpus version), and risks (stale or wrong hits, per-user data). Link
    `database/redis/use-cases-and-patterns.adoc` and `database/redis/spring-boot-redis-as-a-vector-database.adoc`.
    Forgetting and retention policies.
  - [x] Task 20.5. 📊 mermaid memory read/write in an agent turn. Add Related pages and References.

### Group 5 — Content pages: framework integration, evaluation and production

**Parallelizable: yes.** Four independent pages (Tasks 21–24). They come after Groups 2–4 because:

- the two integration pages must **define the anchors** those groups link to;
- they must **stay consistent with** the per-concept LangChain / Spring AI snippets already written there (same
  class names, property keys and versions);
- the evaluation and production pages evaluate and operate the pipeline those groups built.

- [x] Task 21. Create `database/vector-rag/integrating-with-langchain.adoc` ("Integrating with LangChain") —
  created; all 7 fixed LangChain anchors present; grep of Groups 2–4 found no LangChain/LangChain4j
  inconsistencies to fix; every `#langchain-…` reference elsewhere resolves to one of the 7 anchors defined here.
  No test/coverage tooling applies (docs-only repo).
  - [x] Task 21.1. Before writing, grep Groups 2–4 for LangChain / LangChain4j snippets and reuse their exact
    imports, class names and versions. Fix any inconsistency found in either place. — greped all 19 Group 2–4
    pages; classes/imports/versions were already consistent, no edits needed.
  - [x] Task 21.2. The lead: versions, and a plain-prose statement that a full LangChain section is planned and
    this page covers only the vector-store / retrieval / RAG / agent-memory surface. — done.
  - [x] Task 21.3. Sections with the fixed anchors:
    * `[[langchain-embeddings]]`: `Embeddings`, `OllamaEmbeddings`, HuggingFace
    * `[[langchain-vector-stores]]`:
      * `VectorStore` methods: `add_documents`, `similarity_search(_with_score)`, `max_marginal_relevance_search`,
        `filter`, `delete`
      * the stores used here: `PGVector` (collection `docsassistant`, framework-owned tables), `SQLiteVec`,
        `FAISS`, `InMemoryVectorStore`, plus links to the Qdrant / Redis / Elasticsearch / MongoDB / Neo4j
        integrations
    * `[[langchain-splitters]]`
    * `[[langchain-retrievers]]`: `as_retriever(search_type=…, search_kwargs=…)`
    * `[[langchain-rag-chain]]`
    * `[[langchain-agentic-rag]]`: `create_agent` + retriever tool, and LangGraph
    * `[[langchain4j]]`: `EmbeddingStore`, `EmbeddingStoreIngestor`, `EmbeddingStoreContentRetriever`,
      `AiServices` with `RetrievalAugmentor`, Easy / Naive / Advanced RAG, `PgVectorEmbeddingStore`, Maven
      coordinates
  - [x] Task 21.4. A closing "Spring AI equivalents" section linking `integrating-with-spring-ai.adoc`. Related pages
    (Qdrant RAG patterns, the Quarkus LangChain4j mention). References (docs.langchain.com and docs.langchain4j.dev
    only). — done.
- [x] Task 22. Create `database/vector-rag/integrating-with-spring-ai.adoc` ("Integrating with Spring AI") —
  created; all 9 fixed Spring AI anchors present; grep of Groups 2–4 found no Spring AI inconsistencies to fix;
  every `#spring-ai-…` reference elsewhere resolves to one of the 9 anchors defined here. No test/coverage
  tooling applies (docs-only repo).
  - [x] Task 22.1. Before writing, grep Groups 2–4 for Spring AI snippets and align the starters, property keys
    and builder APIs. Fix any inconsistency found in either place. — greped all 18 Group 2–4 pages (203 hits);
    starters/property keys/builder APIs were already consistent, no edits needed.
  - [x] Task 22.2. The lead: Spring Boot 4.1 + Spring AI 2.0.x BOM, and a plain-prose statement that a full Spring
    AI section is planned. — done.
  - [x] Task 22.3. Sections with the fixed anchors:
    * `[[spring-ai-embeddings]]`
    * `[[spring-ai-vector-store-api]]`:
      * the `spring-ai-starter-vector-store-pgvector` + `spring-ai-starter-model-ollama` Maven setup
      * `spring.ai.vectorstore.pgvector.*` (`index-type`, `distance-type`, `dimensions: 768`,
        `initialize-schema`, `table-name: docs_vector_store`)
      * `VectorStore.add` / `delete` / `similaritySearch(SearchRequest.builder()…)`
    * `[[spring-ai-filter-expressions]]`
    * `[[spring-ai-etl]]`
    * `[[spring-ai-rag-advisors]]`: `QuestionAnswerAdvisor` and `RetrievalAugmentationAdvisor`
    * `[[spring-ai-modular-rag]]`
    * `[[spring-ai-chat-memory]]`: `VectorStoreChatMemoryAdvisor`
    * `[[spring-ai-tools]]`: `@Tool searchDocs`
    * `[[spring-ai-testing]]`: Testcontainers `@ServiceConnection` for `pgvector/pgvector` and `ollama/ollama`,
      plus pointers to `RelevancyEvaluator` / `FactCheckingEvaluator`
  - [x] Task 22.4. **Switching stores by starter** (pgvector ↔ Redis ↔ Qdrant ↔ Elasticsearch ↔ MongoDB Atlas ↔
    Neo4j), linking `database/redis/spring-boot-redis-as-a-vector-database.adoc` and the comparison page. 📊
    mermaid Spring AI advisor chain. A closing "LangChain equivalents" section. Related pages. References
    (docs.spring.io/spring-ai/reference pages only). — done.
- [x] Task 23. Create `database/vector-rag/evaluating-rag-systems.adoc` ("Evaluating RAG Systems") — created with
  `vector-rag-evaluation-metrics-map.svg`; covers IR metrics (precision@k, recall@k, MRR, nDCG, hit rate) in
  `[stem]` blocks, ANN vs. exact recall, the shared golden question set, RAGAS metrics with a runnable example,
  LLM-as-a-judge biases, Spring AI `RelevancyEvaluator`/`FactCheckingEvaluator` JUnit example, online signals, and
  the `In LangChain and Spring AI` / Related pages / References sections. No test/coverage tooling applies
  (docs-only repo).
  - [x] Task 23.1. `:stem: latexmath`. The two things to evaluate: retrieval and generation. ANN recall vs. exact
    search (index recall against a flat index). IR metrics in `[stem]` blocks: precision@k, recall@k, MRR, nDCG,
    hit rate. — done.
  - [x] Task 23.2. A golden question set built from the shared golden questions. The spot-check method (retrieval
    depth, context relevance, faithfulness). — done.
  - [x] Task 23.3. **RAGAS** metrics (faithfulness, answer relevancy, context precision / recall) with a runnable
    example over the golden set. LLM-as-a-judge and its biases. — done.
  - [x] Task 23.4. Spring AI `RelevancyEvaluator` / `FactCheckingEvaluator` in a JUnit test. Regression-testing
    chunking / model / index changes. Online signals. — done.
  - [x] Task 23.5. 📊 `vector-rag-evaluation-metrics-map.svg`. Add the framework subsection, Related pages and
    References (the RAGAS paper and docs, Spring AI testing, ANN-Benchmarks, MTEB). — done.
- [x] Task 24. Create `database/vector-rag/production-considerations.adoc` ("Production Considerations") —
  created; covers the scale path with capacity planning reusing Task 6's HNSW memory formula, batching/caching/
  pooling/async pipelines, incremental updates and embedding-model migration, security (filter-based access
  control, tenant isolation, PII, prompt injection, local vs. hosted models), observability/cost/production
  checklist table, a mermaid scale-path flow, and the `In LangChain and Spring AI` / Related pages / References
  sections. No test/coverage tooling applies (docs-only repo).
  - [x] Task 24.1. The scale path (SQLite → pgvector → a dedicated or managed engine), linking the comparison page.
    Capacity planning (reuse Task 6's formula). Build vs. query resources. — done.
  - [x] Task 24.2. Batching, embedding caches, connection pooling, async pipelines. Incremental updates, deletes and
    re-indexing. **Embedding-model versioning and migration** (link Task 4). Backup / restore. — done.
  - [x] Task 24.3. **Security**:
    * document-level access control enforced in the filter, not the prompt (a SQL `WHERE` / Spring AI filter
      example)
    * tenant isolation
    * PII in embeddings (embeddings are not anonymisation)
    * prompt injection via retrieved content (link `apps/apple/apple-intelligence-and-machine-learning.adoc`)
    * local vs. hosted models for private data — done.
  - [x] Task 24.4. Observability (retrieval latency, empty-result rate, token usage; Spring AI observability
    link). Cost. A production checklist (as a table or bullets, not an admonition). — done.
  - [x] Task 24.5. 📊 mermaid scale-path flow. Add the framework subsection, Related pages and References. — done.

### Group 6 — Section index, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task creates or edits a **distinct** file. All of them only reference pages that
exist after Groups 2–5.

- [x] Task 25. Create `database/vector-rag/index.adoc` ("Vector Databases & RAG") — created; header, lead with the
  re-verified version baseline and condensed DocsAssistant scenario table, a reading-path paragraph, a
  where-engine-specific-material-lives table linking all 8 existing engine index pages, `== What's covered` (8
  groups + cheat sheet) with a mermaid mind-map, and `== Bibliography` grouped per issue #187 plus the addendum's
  managed-services/pricing/benchmark sources, ending with the house sentence. No test/coverage tooling applies
  (docs-only repo).
  - [x] Task 25.1. Header + disclaimer include + a one-paragraph lead. The **code baseline in prose**, re-verified
    (choice 6). The *DocsAssistant* scenario in one paragraph plus the shared-scenario table (condensed). — done.
  - [x] Task 25.2. A reading path (concepts → engines → RAG → agents → frameworks → operations). A "where
    engine-specific material lives" table linking every existing engine page. A plain-prose note that full
    LangChain and Spring AI sections are planned. — done.
  - [x] Task 25.3. `== What's covered`, grouped:
    * *Foundations*: Tasks 2–4
    * *Similarity search & indexing*: Tasks 5–8
    * *Filtering, hybrid search & relevance*: Tasks 9–10
    * *Vector search in SQL databases & choosing an engine*: Tasks 11–14
    * *RAG*: Tasks 15–18
    * *Agents*: Tasks 19–20
    * *Frameworks*: Tasks 21–22
    * *Quality & operations*: Tasks 23–24
    * the cheat sheet

    One bullet each. 📊 mermaid mind-map or flowchart of the section. — done.
  - [x] Task 25.4. `== Bibliography`, grouped exactly as the issue's "Bibliography" section, plus the addendum's
    managed-services / pricing / benchmark sources. The book entry:
    `Borwankar, Nitin. _Vector Databases: A Practical Introduction_. O'Reilly Media, 2026. ISBN 978-1-098-17759-1.`
    It links the O'Reilly page https://www.oreilly.com/library/view/vector-databases/9781098177584/ and the code
    repo https://github.com/nborwankar/VectorDatabaseBook . Close with the house sentence: the book is a
    consulted reference only, and each tool's official docs win on any discrepancy. Watch the line-leading
    `2026.` gotcha. — book entry written as a single unwrapped line; verified with `grep -n "^2026\."` (no match).
- [x] Task 26. Create `database/vector-rag/cheat-sheet.adoc` and `modules/ROOT/attachments/vector-rag-cheat-sheet.pdf`
  — created; cheat-sheet.adoc has grouped back-link paragraphs to all 23 pages (same 8 groups as Task 25.3)
  matching `database/qdrant/cheat-sheet.adoc`'s shape, ending with the PDF download xref. The PDF was authored and
  rendered entirely in the scratchpad (never in the repo; confirmed via `git status --porcelain`, no `.html`
  landed), then only the rendered PDF copied to `modules/ROOT/attachments/`. PyMuPDF verification:
  `page_count == 1`, page rect ≈ 595 × 842 pt (A4). PNG render visually inspected: 21 boxes (including the
  mandatory engine comparison matrix across 11 engines, dated "as of 2026-09-26") render cleanly with no clipping
  or overflow, visually consistent with the qdrant/neo4j cheat sheets. No test/coverage tooling applies.
  - [x] Task 26.1. `= Vector Databases & RAG Cheat Sheet` + disclaimer + a one-paragraph intro. Grouped back-link
    paragraphs to all 23 pages (same groups as Task 25.3), matching `database/qdrant/cheat-sheet.adoc`'s shape.
    End with `xref:attachment$vector-rag-cheat-sheet.pdf[Download the Vector Databases & RAG Cheat Sheet (PDF)]`.
    — done.
  - [x] Task 26.2. Author a print-ready **single A4 page** HTML/CSS layout **in the scratchpad**:
    * dense multi-column colour-coded boxes with a header line and a breadcrumb footer, styled like the existing
      qdrant / neo4j PDFs (render one to PNG for reference)
    * one box per item in the issue's cheat-sheet list, **including the engine comparison box** from the issue
      body (a compact engine × {best for, scaling, index location, pricing model, AWS / GCP / Azure 1P/V/Self}
      matrix, dated)

    — done; authored at
    `/private/tmp/claude-501/-Users-albertoirurueta-repositories-common-docs/5e1b9c67-5642-4b80-bdb4-8b04a9269d14/scratchpad/vector-rag-cheatsheet/cheatsheet.html`.
  - [x] Task 26.3. Render with headless Chrome (`--headless --print-to-pdf=… --no-pdf-header-footer`). Verify with
    PyMuPDF that `page_count == 1` and the page is A4 (≈595×842 pt). Render a PNG preview and inspect it for
    clipped or overflowing boxes; iterate until it fits. Copy only the PDF to `modules/ROOT/attachments/`. Confirm
    no `.html` was left in the repo (`git status --porcelain`). — done; `page_count = 1`,
    `rect = Rect(0.0, 0.0, 594.96, 841.92)`; `git status --porcelain` confirmed no stray `.html`.
- [x] Task 27. Site wiring (3 files) — done; `nav.adoc`, `database/index.adoc` and `pages/index.adoc` all updated,
  no other files touched, no files created. No test/coverage tooling applies.
  - [x] Task 27.1. `modules/ROOT/nav.adoc`: insert `*** xref:database/vector-rag/index.adoc[Vector Databases & RAG]`
    followed by 24 `****` lines (the 23 pages in Task 25.3 order + `cheat-sheet.adoc[Cheat Sheet (PDF)]`) after
    `**** xref:database/redis/deploying-on-azure.adoc[Deploying on Azure]` and before
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`. Use short labels (e.g.
    `[What Is a Vector Database?]`, `[Embeddings]`, …, `[Comparing Vector Databases]`, …). — done.
  - [x] Task 27.2. `database/index.adoc`:
    * add a `== Sections` bullet between Redis Reference and Evolving the Database Model
    * add "Vector Databases & RAG" to the `:description:` subsection list
    * add `vector database, embeddings, semantic search, RAG, retrieval-augmented generation, AI agents,
      LangChain, Spring AI, pgvector` to `:keywords:`, skipping any term already present

    — done; "vector database" and "RAG" were already present and skipped, `pgvector` was added once.
  - [x] Task 27.3. `pages/index.adoc`: append the issue's keyword list to `:keywords:` (line 3), skipping duplicates
    such as `pgvector`, `RAG` and `vector database` if already present. Make no structural change. — done; only
    line 3 touched, no structural change.
- [x] Task 28. Cross-links in existing pages. Add one sentence or bullet each and never repeat content. Each file
  is edited by exactly one sub-task. — done; all 20 target files edited, each with exactly one added
  sentence/bullet, no content duplicated, mermaid blocks left untouched. No test/coverage tooling applies.
  - [x] Task 28.1. `database/choosing-the-right-database.adoc`: at the top of `== Vector Databases`, link
    `xref:database/vector-rag/index.adoc`. From `=== Choosing one`, link `vector-database-landscape.adoc`,
    `comparing-vector-databases.adoc` and `postgresql-pgvector.adoc`. Leave the mermaid leaf text unchanged,
    because mermaid nodes can't hold xrefs. — done.
  - [x] Task 28.2. `database/qdrant/rag-integration-patterns.adoc` (`== Related pages`): add `rag-fundamentals.adoc`,
    `document-ingestion-and-chunking.adoc` and `integrating-with-langchain.adoc`.
    `database/qdrant/vector-indexing-and-hnsw.adoc`: one sentence linking `ann-indexes.adoc` and
    `quantization-and-compression.adoc`. `database/qdrant/hybrid-and-sparse-search.adoc`: one sentence linking
    `hybrid-search-and-reranking.adoc`. — done.
  - [x] Task 28.3. `database/redis/vector-search.adoc` (`== Related pages`) and
    `database/redis/spring-boot-redis-as-a-vector-database.adoc`: link the concept pages and
    `integrating-with-spring-ai.adoc`. `database/redis/use-cases-and-patterns.adoc`: link
    `agent-memory-and-semantic-cache.adoc`. `database/redis/deploying-on-aws.adoc`,
    `deploying-on-google-cloud.adoc` and `deploying-on-azure.adoc`: one sentence each linking
    `comparing-vector-databases.adoc`. — done.
  - [x] Task 28.4. Engine vector pages, one sentence each pointing at the relevant concept pages:
    * `database/elasticsearch/vector-and-semantic-search.adoc`
    * `database/solr/dense-vector-search.adoc`
    * `database/lucene/knn-vector-search.adoc`
    * `database/neo4j/vector-search-and-genai.adoc`, plus GraphRAG → `agentic-rag.adoc`
    * the Atlas Vector Search part of `database/mongodb/special-indexes-and-search.adoc`
    * the vector subsection of `database/couchbase/search-analytics-eventing.adoc`

    `database/neo4j/similarity-embeddings-and-ml-pipelines.adoc` links `embeddings.adoc` for text embeddings. —
    done.
  - [x] Task 28.5. `backend/springboot/index.adoc`: add a bullet to `integrating-with-spring-ai.adoc` next to the
    Redis vector-store mention. `backend/quarkus/extensions-and-the-platform.adoc`: link
    `integrating-with-langchain.adoc#langchain4j` from the LangChain4j mention.
    `apps/apple/apple-intelligence-and-machine-learning.adoc`: one sentence on prompt injection linking
    `production-considerations.adoc`. — done.

### Group 7 — Build and verify

**Parallelizable: yes** (single task; must run after every prior group).

- [x] Task 29. Build and verify
  - [x] Task 29.1. Run `npx antora antora-playbook.yml` (no `--fetch`) against a clean `build/` via an
    `iru-gate-runner` sub-agent. Required result: exit code 0, **zero errors and zero warnings** (in particular no
    "skipping reference to missing attribute", "list item index" or unresolved `xref`). Fix and rebuild until
    clean. — Clean on the first run: exit 0, 0 errors, 0 warnings (rebuilt again after Task 29.2's and 29.5's
    fixes below; still exit 0 / 0 / 0 each time).
  - [x] Task 29.2. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` via a sub-agent. Every diagram
    must parse, including all of those under `database/vector-rag/`. — First run: 490 diagrams checked, 1 failure
    (`database/vector-rag/postgresql-pgvector.adoc`, `erDiagram` used the invalid compound attribute key
    `PK_FK` on the `CHUNK_EMBEDDINGS.chunk_id` and `DOCUMENT_EMBEDDINGS.document_id` rows, which Mermaid's ER
    parser rejects). Fixed by changing both to the comma-separated key syntax `PK, FK`. Re-run: exit 0, all 490
    diagrams parsed successfully.
  - [x] Task 29.3. Reachability:
    * the 23 content pages + `cheat-sheet.adoc` each appear as an `xref:` in both `database/vector-rag/index.adoc`
      and `nav.adoc`
    * `build/site/database/vector-rag/` has 25 HTML files
    * every `vector-rag-*.svg` exists in `build/site/_images/`
    * `vector-rag-cheat-sheet.pdf` is in `build/site/_attachments/` (or the attachment output path) and is 1 A4 page

    All confirmed on the clean rebuild: all 24 pages (23 content + cheat-sheet) are `xref:`-linked from both
    `index.adoc` and `nav.adoc`; `build/site/database/vector-rag/` contains exactly 25 HTML files; all 13
    `vector-rag-*.svg` files are present under `build/site/_images/`; `vector-rag-cheat-sheet.pdf` is in
    `build/site/_attachments/` with MediaBox `[0 0 594.96 841.92]` (A4) and exactly one `/Type /Page` object.
  - [x] Task 29.4. Grep checks:
    * `include::partial$vector-rag-disclaimer.adoc[]` is in all 25 files
    * there is no `[NOTE]` / `[TIP]` / `[WARNING]` / `[CAUTION]` / other `[IMPORTANT]` under
      `database/vector-rag/`
    * "Borwankar" and "O'Reilly" do not appear outside `index.adoc`
    * every content page has `== References` and an `== In LangChain and Spring AI` section (the integration pages
      have their counterpart section instead)
    * all 16 fixed anchors exist on the integration pages, and every `#langchain-…` / `#spring-ai-…` link resolves
    * no `python.langchain.com` URLs
    * no `xref:` to a nonexistent LangChain / Spring AI section

    All confirmed clean: the disclaimer include is present in all 25 files; no stray admonition blocks under
    `database/vector-rag/`; "Borwankar"/"O'Reilly" appear only in `index.adoc`; all 23 content pages carry
    `== References`, and all but the two integration pages carry `== In LangChain and Spring AI` — those two
    instead carry their counterpart sections (`integrating-with-langchain.adoc` has `== Spring AI equivalents`,
    `integrating-with-spring-ai.adoc` has `== LangChain equivalents`), each with its own `== References`; all 16
    fixed anchors (7 `[[langchain-*]]`/`[[langchain4j]]` + 9 `[[spring-ai-*]]`) exist and every `#langchain-…` /
    `#spring-ai-…` link across the 23 content pages resolves to one of them (confirmed both by exact-match grep
    and by the zero-warning Antora build, which would otherwise flag an unresolved in-page anchor); no
    `python.langchain.com` URLs (the only occurrence is prose in `index.adoc` explicitly noting they are not
    cited); no dangling `xref:` into a nonexistent LangChain/Spring AI section.
  - [x] Task 29.5. Spot-check every Group 6 cross-link edit reads naturally in context. Verify the comparison page
    states its "as of" date and that every fact in its tables links an official source. — Spot-checked the Group 6
    edits in `database/redis/vector-search.adoc`, `database/neo4j/vector-search-and-genai.adoc`,
    `database/mongodb/special-indexes-and-search.adoc`, `backend/springboot/index.adoc` and
    `apps/apple/apple-intelligence-and-machine-learning.adoc`: all read naturally in context.
    `comparing-vector-databases.adoc` states "as of 2026-09-26" (twice, matching today's date). Found and fixed a
    real gap: the "Pricing models and free tiers" table's rows for MongoDB Atlas, Couchbase Capella, Neo4j
    AuraDB, Elastic Cloud Serverless, Azure AI Search, Vertex AI Vector Search and S3 Vectors had no source link
    even though the page's own text promised "the Couchbase Capella, Neo4j Aura, Elastic Cloud and Azure AI
    Search pricing pages linked from References" — those links did not actually exist anywhere on the page. Added
    an inline official pricing-page link to each of those seven table cells plus a matching entry in
    `== References`, verified each URL live (200, or a 403 in Couchbase's and Couchbase-only case consistent with
    the bot-blocking already documented for oreilly.com on this same page) and relevant to the claimed fact.
    Rebuilt after the fix: still exit 0 / 0 errors / 0 warnings.
