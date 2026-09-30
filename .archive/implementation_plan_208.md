# Implementation plan — RAG Systems in Production sub-section (issue #208)

## Task summary

Add the **RAG Systems in Production** sub-section under *Guides & References / AI* at
`modules/ROOT/pages/ai/rag-systems/`: 22 pages (landing page with bibliography, 18 topic pages, cheat-sheet page,
plus the PDF) covering the "day-2" engineering of RAG — parsing and multimodal ingestion, freshness, query routing
and text-to-SQL, advanced indexing, conversational memory persistence, citations, hallucination control, guardrails,
access control, serving as REST/SSE/WebSocket, RAG behind MCP, caching and cost, GraphRAG and text2cypher,
evaluation, observability and deployment. Every build page has code in LangChain 1.x (Python + FastAPI), Spring AI
2.0 (Spring Boot 4.1) and LangChain4j 1.20, all written from the current official documentation and linked to it.
The sub-section builds on, and links to, the existing `database/vector-rag` pages instead of repeating them.

Source: GitHub issue #208 (labels: documentation, enhancement — classified as a feature)

Base branch: feature/213-ai-section

Working branch: feature/208

Choices made on the user's behalf (challenge them in review):
- Documentation-only task: no `*-code-one-task` skill applies, so tasks carry no language tag and are implemented
  directly. Code snippets inside pages are illustrative and verified against official docs, not compiled by this repo.
- The issue suggests optionally splitting into two PRs. This plan keeps **one PR** (groups 2 and 3 are separable if
  the user wants two: group 2 = ingestion/retrieval/memory/answers/security; group 3 = APIs/MCP, GraphRAG, ops).
- Antora only fails on unresolved xrefs at build, so the sub-section's nav and all cross-links are written up
  front and validated together in Group 6.
- Sibling sub-sections that do not exist yet (Conversational Channels, Voice Agents, LLMOps & Evaluation, AI
  Security & Responsible AI) are named in plain prose, never as `xref:`.

Merge constraints: this PR targets `feature/213-ai-section`, never `main`, and must not merge into `main`. It stays a
**draft** and must not be merged, even into the integration branch, until the PRs of #198 (LangChain), #197 (Spring AI)
and #206 (MCP) are merged into `feature/213-ai-section`. At planning time all three are merged there (commits
8b127a17, bfdf41f7, f531470a). Closing keywords do not work off the default branch, so the PR body uses `Refs #208`.
The final integration PR (`feature/213-ai-section` → `main`, owned by #213) closes the issue.

## Current code state

- `antora.yml` (component `irurueta`), `modules/ROOT/nav.adoc`, `modules/ROOT/pages/index.adoc`, `package.json`
  (`npm run validate:mermaid` → `scripts/validate-mermaid.mjs`), Antora 3.1.15 with lunr, mermaid and mathjax extensions.
- AI block in `nav.adoc` starts at `** xref:ai/index.adoc[AI]` (~line 1046) and ends with
  `**** xref:ai/spring-ai/cheat-sheet.adoc[Cheat Sheet (PDF)]` (~line 1251, LangChain/Spring AI/HF/CLIs/local-LLMs
  already present); `** xref:git-and-github/index.adoc[Git & GitHub]` follows. The new
  `*** xref:ai/rag-systems/index.adoc[RAG Systems in Production]` block goes between Spring AI and the
  next sub-section/Git & GitHub, in the fixed order (after Spring AI, before Conversational Channels).
- `modules/ROOT/pages/ai/index.adoc`: `== Sub-sections` currently has
  `* RAG Systems in Production -- productionizing retrieval-augmented generation beyond the fundamentals. (planned)`
  — replace with an xref bullet; extend its long `:keywords:` line; `== Books used in this section` lists the books
  with "Cited on" xrefs — add `rag-systems` bibliography xrefs to each of the six requester-provided books.
- `modules/ROOT/pages/index.adoc` carries a `:keywords:` line and `image::ai.svg[xref="ai/index.adoc"]` (the picker
  image already exists) — only keywords change.
- Templates to mirror for structure and tone: `modules/ROOT/pages/ai/spring-ai/index.adoc` (version baseline,
  bibliography, reading path), `ai/spring-ai/cheat-sheet.adoc` and `ai/mcp/index.adoc` / `ai/mcp/rag-over-mcp.adoc`
  (the DocsAssistant running example). Partials follow `modules/ROOT/partials/ai-<subsection>-disclaimer.adoc`
  (e.g. `ai-spring-ai-disclaimer.adoc`); PDFs live in `modules/ROOT/attachments/ai-<subsection>-cheat-sheet.pdf`
  (existing examples: `ai-spring-ai-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf`, `azure-cheat-sheet.pdf`); SVGs in
  `modules/ROOT/images/ai-<subsection>-*.svg`.
- Existing link targets (verified present): `ai/mcp/rag-over-mcp.adoc`, `backend/springboot/rest-apis.adoc`,
  `backend/messaging/*`, `database/redis/use-cases-and-patterns.adoc`, `database/neo4j/vector-search-and-genai.adoc`,
  `database/vector-rag/{rag-fundamentals,document-ingestion-and-chunking,retrieval-strategies,prompt-augmentation-and-generation,hybrid-search-and-reranking,metadata-filtering,agentic-rag,agent-memory-and-semantic-cache,evaluating-rag-systems,production-considerations,integrating-with-langchain,integrating-with-spring-ai,index}.adoc`,
  `ai/langchain/*`, `ai/spring-ai/*`, `ai/mcp/*`. Not present (prose only): `ai/conversational-channels`,
  `ai/voice-agents`, `ai/llmops`, `ai/security`. Existing files that already mention `rag-systems` and must be
  checked so no stale "planned" prose or broken link remains: `ai/mcp/rag-over-mcp.adoc`,
  `ai/langchain/{retrieval-and-rag-bridge,evaluation}.adoc`, `ai/spring-ai/{retrieval-and-rag-bridge,evaluation}.adoc`,
  `ai/agents/agent-evaluation.adoc`, `database/vector-rag/{index,production-considerations,generating-embeddings-in-practice,integrating-with-spring-ai}.adoc`.
  Whether `backend/oauth/*` exists must be checked in Task 1.1 before it is xref'd.
- `.gitignore` ignores `/build/`, `/node_modules/`, `/.idea/`; nothing under `.archive/` covers this work.

## Page conventions (apply to every page task below)

- Header: `= Title`, `:description:`, `:keywords:`, `include::partial$ai-rag-systems-disclaimer.adoc[]`; intro states
  the versions written against, verified and dated at implementation time (use the real date then).
- Ends with `== References` (official docs, specs and papers only). Every code example is followed by a link to the
  official page it derives from; code is written from current official docs, never copied from a book. Where a book is
  outdated, say so in prose and show the current API. Paraphrase and credit books, no verbatim book text or code.
- No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks other than the one in the disclaimer partial; version notes,
  caveats and deprecations go in prose or table rows.
- Add `[mermaid]` blocks or `ai-rag-systems-*.svg` (legible in light and dark) where a picture clarifies; MathJax
  (`\( \)` / `\[ \]`) where a formula makes a concept precise.
- Link, don't duplicate, the existing vector-rag / neo4j / redis / messaging / MCP pages; `xref:` only to existing pages.
- DocsAssistant running scenario (pgvector schema and corpus from vector-rag; `/v1/ask`; conversation IDs; ACLs; MCP
  server; Neo4j graph) is used consistently. Three code stacks per build page: Python (LangChain 1.x + FastAPI), Java
  (Spring AI 2.0 + Spring Boot 4.1), Java (LangChain4j 1.20).

## Implementation steps

### Group 1 — Scaffolding and landing page (Parallelizable: no — Tasks 2–4 edit shared files and Task 2 needs the partial and version facts from Task 1)

- [x] **Task 1. Verify the version baseline and create the disclaimer partial**
  - [x] Task 1.1. Verify against current official docs/registries and record with today's date: LangChain/langchain-classic/
    langgraph/langchain-text-splitters, FastAPI + `EventSourceResponse`, Docling, Unstructured, Spring AI 2.0.x on Spring
    Boot 4.1.x, LangChain4j 1.20.x and `langchain4j-community-neo4j`, neo4j-graphrag, Neo4j calendar version,
    MCP spec revision used by this site (2026-07-28), Presidio, HHEM, RAGAS/DeepEval/Open RAG Eval. Also check whether
    `backend/oauth/*` exists in `modules/ROOT/pages/backend/`.
  - [x] Task 1.2. Create `modules/ROOT/partials/ai-rag-systems-disclaimer.adoc` containing only the single `[IMPORTANT]`
    block: the house AI-assistance disclosure plus the pointer
    `xref:ai/rag-systems/index.adoc#_bibliography[bibliography]` (mirror `ai-spring-ai-disclaimer.adoc`).
- [x] **Task 2. Create `modules/ROOT/pages/ai/rag-systems/index.adoc`**
  - [x] Task 2.1. Header, intro with dated version baseline, the "what Vector Databases & RAG covers vs. this sub-section"
    table, the reading path, the DocsAssistant production-service scenario, and a `== Version baseline` table.
  - [x] Task 2.2. Write `== Bibliography` from the issue: requester-provided books (full bibliographic data, publisher
    page, official code repository each), official documentation, specifications and standards, papers and
    engineering articles; every source linked; close with the house-style note (books are consulted references, not the
    primary source of any example; official docs authoritative). Only real, resolvable URLs from the issue — verify
    each still resolves; no PDFs committed.
  - [x] Task 2.3. Note the outdated points in the books in prose (LangChain 1.x renames, LangChain4j 0.35 → 1.20, Spring AI
    pre-1.0 → 2.0.1, Haystack 3.x, Streamlit-only UI layer).
- [x] **Task 3. Update `modules/ROOT/nav.adoc`**: add `*** xref:ai/rag-systems/index.adoc[RAG Systems in Production]` and
  a `****` child for each of the 21 other pages, grouped like the outline (Architecture, Ingestion, Retrieval,
  Conversation & answers, Exposing RAG, Knowledge graphs, Operations, Cheat Sheet (PDF) last), placed after the Spring AI
  block and before Git & GitHub.
- [x] **Task 4. Update the landing pages**
  - [x] Task 4.1. `modules/ROOT/pages/ai/index.adoc`: turn the "planned" bullet into an xref bullet with a one-paragraph
    description; append RAG-systems terms to `:keywords:`; add `rag-systems` bibliography xrefs to the "Cited on" lists
    of the six books in `== Books used in this section` (add entries for books not yet listed there).
  - [x] Task 4.2. `modules/ROOT/pages/index.adoc`: append the same terms to `:keywords:` (do not touch the picker image).

### Group 2 — Build pages, part 1: architecture, ingestion, retrieval, conversation, answers, security (Parallelizable: yes — one new file per task; each task also creates its own figures; no shared files)

- [x] **Task 5. `production-rag-architecture.adoc`**: reference microservice architecture, stateless orchestrator with
  fan-out/gather, independent scaling tiers, latency budget with MathJax
  \( T \approx T_{retr} + T_{rerank} + T_{TTFT} + n_{out}\,T_{TPOT} \), DIY vs. RAG platforms, TCO, POC → production plan;
  SVG `ai-rag-systems-reference-architecture.svg`. Link `database/vector-rag/production-considerations.adoc`.
- [x] **Task 6. `document-parsing.adoc`**: PDF internals, parser ladder (pypdf/PyMuPDF → Docling/Unstructured → cloud OCR →
  VLM fallback, cheapest first), structure as metadata, Tesseract OCR, Spring AI `TikaDocumentReader` /
  `PagePdfDocumentReader`, LangChain4j Tika/PDF parsers; Python + two Java stacks; link `document-ingestion-and-chunking`.
- [x] **Task 7. `multimodal-rag.adoc`**: tables (detect → extract → normalise → stitch), images (VLM summaries vs.
  CLIP/SigLIP/ColPali embeddings), audio/video via transcription, visual citations, multimodal hallucination evaluation;
  Mermaid multimodal ingestion flow; three stacks where APIs exist (say so in prose where one stack lacks support).
- [x] **Task 8. `ingestion-pipelines-and-freshness.adoc`**: batch vs. streaming, idempotent restartable jobs, content
  hashes, CDC (Debezium → Kafka) re-indexing, deletes/tombstones, Presidio PII redaction, provenance hashes, Spring AI ETL
  (`DocumentReader` → `DocumentTransformer` → `DocumentWriter`), LangChain `RecordManager`/`index()` (`langchain-classic`),
  LangChain4j `EmbeddingStoreIngestor`; link `backend/messaging/*`.
- [x] **Task 9. `query-understanding-and-routing.adoc`**: rewriting/condensation, self-query filter extraction,
  decomposition, routing across vector/SQL/graph/tools (LLM and semantic routers), text-to-SQL with read-only safety and
  validation, Spring AI `RewriteQueryTransformer`/`MultiQueryExpander`/`QueryRouter`-style modular RAG, LangChain4j
  `QueryTransformer`/`QueryRouter`; Mermaid router diagram; link `retrieval-strategies`, `metadata-filtering`.
- [x] **Task 10. `advanced-indexing-patterns.adoc`**: hypothetical-question indexing, proposition/agentic chunking,
  auto-merging parent/child, sentence-window, multi-vector, RAPTOR, contextual retrieval, late chunking; state which
  patterns are current in LangChain 1.x vs. `langchain-classic`; link vector-rag chunking pages.
- [x] **Task 11. `conversational-rag-and-memory.adoc`**: history-aware condensation, window vs. summary vs. long-term
  memory, persistence (LangGraph Postgres checkpointer + store; Spring AI `MessageWindowChatMemory` +
  `JdbcChatMemoryRepository` with conversation ID from the authenticated user; LangChain4j `ChatMemoryProvider` +
  persistent `ChatMemoryStore`), multi-device sessions, retention/GDPR deletion, memory poisoning; Mermaid multi-turn
  sequence diagram; link `agent-memory-and-semantic-cache`, `ai/langchain/short-term-memory-and-checkpointers`,
  `ai/spring-ai/chat-memory*`.
- [x] **Task 12. `citations-and-grounding.adoc`**: chunk IDs/source metadata end-to-end, inline citation prompting,
  structured `answer` + `citations[]`, citation verification, passage highlighting, UX rules (progress explanation,
  source control, feedback capture); three stacks; link `prompt-augmentation-and-generation`.
- [x] **Task 13. `hallucination-detection-and-correction.adoc`**: RAG vs. LLM hallucination, faithfulness by claim
  decomposition, LLM-as-judge vs. HHEM, blocking vs. async checks, regenerate/abstain, Spring AI `FactCheckingEvaluator` at
  runtime; MathJax for faithfulness score; link `ai/llm-foundations/hallucinations-and-limitations`.
- [x] **Task 14. `guardrails-and-prompt-injection.adoc`**: input/output guardrails (Llama Guard, ShieldGemma), indirect
  injection through ingested documents, sanitising/delimiting context, tool allow-lists, LangChain guardrail middleware,
  Spring AI `SafeGuardAdvisor`, LangChain4j input/output guardrails; the AI Security sub-section named in prose only
  (does not exist yet); link `ai/langchain/guardrails-and-security`, `ai/spring-ai/security-and-guardrails`.
- [x] **Task 15. `access-control-and-privacy.adoc`**: document ACLs as metadata filters derived from caller identity
  (never from the prompt), per-tenant indexes vs. shared-index filters, filter APIs (LangChain retriever `filter`, Spring
  AI `FILTER_EXPRESSION`, LangChain4j `Filter`), entity-aware redaction, encryption, audit trails, data residency and on-prem
  models; SVG `ai-rag-systems-identity-to-filter.svg`.

### Group 3 — Build pages, part 2: exposure, knowledge graphs, operations (Parallelizable: yes — one new file per task, no shared files; tasks link to Group 2 page names, which are fixed by Task 3's nav)

- [x] **Task 16. `serving-rag-as-an-api.adoc`**: API contract (`question`, `conversationId`, `filters` → `answer`,
  `citations`, `usage`, `traceId`), OpenAPI definition, SSE (FastAPI `EventSourceResponse` + `astream`; Spring
  `Flux<ServerSentEvent>` via `ChatClient.stream()`; LangChain4j `TokenStream` → SSE), WebSocket variant, async ingestion
  endpoints with job status, idempotency keys, OAuth2/JWT, rate limiting, versioning, CORS, minimal browser widget consuming
  the stream; link `backend/springboot/rest-apis`, `backend/oauth/*` if present (Task 1.1); Conversational Channels named
  in prose only.
- [x] **Task 17. `rag-behind-mcp.adoc`**: expose the same retriever via MCP: `search_docs` tool with `outputSchema`,
  `docs://` resources, citation prompt, caller-identity → ACL mapping, consumption from Claude Code, Copilot and a LangGraph
  agent, Python MCP SDK and Spring AI server code, Neo4j MCP servers; link `ai/mcp/rag-over-mcp` and other `ai/mcp/*`
  pages for protocol depth without duplication.
- [x] **Task 18. `caching-latency-and-cost.adoc`**: response/retrieval/chunk/semantic caches, similarity thresholds,
  event-driven invalidation (Kafka / Redis Pub/Sub), prompt caching, model cascades, per-request token cost accounting with
  MathJax; link `database/redis/use-cases-and-patterns`, `agent-memory-and-semantic-cache`.
- [x] **Task 19. `graphrag-and-knowledge-graph-construction.adoc`**: when KG-hybrid beats vector-only, Microsoft GraphRAG
  local vs. global and cost, LLM extraction (neo4j-graphrag `SimpleKGPipeline`, LLM Graph Builder, LangChain
  `LLMGraphTransformer`), entity resolution, incremental updates (CDC → `MERGE`, tombstoning), Java Neo4j vector stores
  + Cypher; SVG `ai-rag-systems-kg-construction.svg`; link `database/neo4j/vector-search-and-genai`.
- [x] **Task 20. `text2cypher-and-graph-retrievers.adoc`**: `VectorCypherRetriever`, `Text2CypherRetriever`,
  `HybridRetriever`, schema injection, few-shot examples, read-only execution and validation, LangChain4j community Neo4j
  text-to-Cypher retriever, `langchain-neo4j`.
- [x] **Task 21. `graph-powered-recommendations.adoc`**: LLM-summarised behaviour embeddings + GDS KNN/Louvain hybrid
  recommendations updated to Spring AI 2.0 and LangChain4j 1.20 (from the Neo4j book's Ch. 8–10 concepts, paraphrased).
- [x] **Task 22. `evaluation-at-scale.adoc`**: synthetic test sets, reference-free metrics (UMBRELA, nuggets),
  RAGAS/DeepEval/Open RAG Eval, CI regression gates for chunking/model/prompt changes, online sampled judging,
  champion/challenger A/B, feedback flywheel; MathJax for metrics; link `evaluating-rag-systems`; LLMOps named in prose.
- [x] **Task 23. `observability-and-tracing.adoc`**: spans for retrieve/rerank/generate/tool, OTel GenAI semantic
  conventions, metrics (TTFT, P95, tokens, empty-retrieval, citation and handoff rates), Langfuse/Phoenix/LangSmith, Spring AI
  Micrometer, LangChain4j listeners; link `ai/langchain/observability-with-langsmith`, `ai/spring-ai/observability`.
- [x] **Task 24. `deployment-patterns.adoc`**: containers, Cloud Run/ECS/AKS/Kubernetes, GPU inference services, secrets,
  blue/green prompt and model rollouts, initial vs. incremental loads, DR/backups; link existing Docker, Azure and
  `ai/local-llms` pages (verify their paths first).

### Group 4 — Cheat sheet (Parallelizable: no — Task 26 summarises every page written in Groups 2–3 and Task 25 lists them)

- [x] **Task 25. `cheat-sheet.adoc`**: list what the sheet covers, cross-reference every page grouped like the nav, link
  `xref:attachment$ai-rag-systems-cheat-sheet.pdf[Download the RAG Systems in Production Cheat Sheet (PDF)]`.
- [x] **Task 26. `modules/ROOT/attachments/ai-rag-systems-cheat-sheet.pdf`**
  - [x] Task 26.1. Write a print-ready A4 HTML/CSS in the scratchpad directory (not committed), dense multi-column,
    colour-coded boxes, header line with version baseline and date, breadcrumb footer, styled consistently with
    `vector-rag-cheat-sheet.pdf` and `azure-cheat-sheet.pdf`; content covers every concept listed in the issue's
    cheat-sheet section.
  - [x] Task 26.2. Render with the pre-installed headless Chromium; verify it is **exactly one A4 page** (e.g. `pdfinfo`)
    and legible; commit only the PDF.

### Group 5 — Cross-links in existing pages (Parallelizable: yes — each task edits a different existing file)

- [x] **Task 27. `database/vector-rag/index.adoc`**: reading path gets "next: RAG Systems in Production" xref to
  `ai/rag-systems/index.adoc`.
- [x] **Task 28. One sentence + xref each** in `database/vector-rag/{production-considerations,evaluating-rag-systems,agent-memory-and-semantic-cache,retrieval-strategies,document-ingestion-and-chunking}.adoc`
  linking the matching new page (do not duplicate content; keep existing anchors intact).
- [x] **Task 29. `database/neo4j/vector-search-and-genai.adoc`**: link the two GraphRAG pages.
- [x] **Task 30. Check existing files mentioning `rag-systems`** (list in "Current code state"): replace any "planned"
  prose with real xrefs and confirm the anchors they target exist.

### Group 6 — Sub-section validation (Parallelizable: no — checks depend on all previous groups)

- [x] **Task 31. Static checks**: (a) no admonition blocks under `pages/ai/rag-systems/` and the partial contains only the
  disclosure + bibliography pointer; (b) every page has `:description:`, `:keywords:`, the include, versions in its intro,
  `== References`; (c) every code block is followed by an official-docs link; (d) every source in the issue's bibliography
  is linked in `index.adoc`; (e) no `xref:` to non-existent pages (grep and check); (f) SVGs named `ai-rag-systems-*.svg`
  and readable in light/dark; (g) no book text/PDFs committed; (h) `.secrets` scan with the `iru-check-security` skill.
- [x] **Task 32. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml`** (delegate via the
  `iru-gate-runner` agent, or `/iru-build-docs`); fix every xref, AsciiDoc or Mermaid error or warning introduced by this
  sub-section and confirm the site renders the new pages (nav, images, PDF link, MathJax).

### Group 7 — Integration-branch verification (Parallelizable: no — strictly sequential; each step depends on the previous result)

- [x] **Task 33. Merge the latest `origin/feature/213-ai-section` into `feature/208`** and resolve conflicts.
  - Expected conflict points: the `** xref:ai/index.adoc[AI]` block in `modules/ROOT/nav.adoc`, `modules/ROOT/pages/ai/index.adoc`
    → `== Sub-sections`, and the `:keywords:` of the root and AI index pages.
  - Resolve by keeping every sibling's entries, in the fixed sub-section order.
- [x] **Task 34. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml` (or `/iru-build-docs`) on the merged
  result.** Must finish with no xref, AsciiDoc or Mermaid errors.
- [x] **Task 35. Compute merge readiness.** For each prerequisite `#D` in {198, 197, 206}: run
  `git fetch origin && git branch -r --merged origin/feature/213-ai-section | grep -x "  origin/feature/D"` or list merged PRs
  into `feature/213-ai-section` (`gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`,
  or the GitHub MCP equivalent when `gh` is unavailable; note the branches may have been squash-merged so the PR
  list is authoritative). Record the result for the PR's *Merge readiness* block:

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: <each #D with ✅ merged into feature/213-ai-section / ⏳ not merged yet>
  - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
  - Status: <✅ READY: can be merged into feature/213-ai-section after human review
            | ⏳ WAIT: keep as draft until <#D, …> are merged into feature/213-ai-section, then re-merge feature/213-ai-section and rebuild>
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```

  Result recorded on 2026-09-30 (merge of `origin/feature/213-ai-section` at 0bf2018b into `feature/208` was a no-op:
  the integration branch had not moved since the fork):

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: #198 ✅ merged into feature/213-ai-section (PR #221, squash commit 8b127a17) / #197 ✅ merged into feature/213-ai-section (PR #222, squash commit bfdf41f7) / #206 ✅ merged into feature/213-ai-section (PR #220, squash commit f531470a)
  - Antora build + Mermaid validation on the merged result: ✅ passed (npx antora antora-playbook.yml: exit 0, no warnings or errors; npm run validate:mermaid: all 689 diagrams parsed)
  - Status: ✅ READY: can be merged into feature/213-ai-section after human review
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```
