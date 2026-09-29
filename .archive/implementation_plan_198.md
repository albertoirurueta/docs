# Implementation Plan: Guides & References / AI — "LangChain"

## Task summary

Source: GitHub issue #198
Base branch: feature/213-ai-section

Issue [#198](https://github.com/albertoirurueta/docs/issues/198) adds sub-section 9 of 15 of the AI section,
**LangChain**, at `modules/ROOT/pages/ai/langchain/`. It is the full framework reference for:

* **LangChain 1.x and LangGraph 1.x (Python)** — packages and the v1 migration, chat models, prompts, LCEL,
  structured output, tools, `create_agent` and middleware, LangGraph graphs / workflows / checkpointers / stores /
  interrupts / streaming / multi-agent / Deep Agents
* **Integrations** — `langchain-mcp-adapters`, a short RAG bridge page, multimodality and voice, guardrails, local
  models
* **LangSmith** — observability, evaluation, testing, deployment
* **LangChain.js** and **LangChain4j** (Java without Spring; Spring Boot / Quarkus note; the experimental agentic
  module and MCP client)

It fills in the placeholder in `ai/index.adoc` and turns the "a complete LangChain section is planned" sentence on
`database/vector-rag/integrating-with-langchain.adoc` into a real `xref:` (all seven anchors unchanged).

The sub-section ships:

* 29 pages: `index.adoc` (with `== Bibliography`), 27 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-langchain-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-langchain-disclaimer.adoc`
* the nav block (inserted after Running LLMs Locally, before Git & GitHub)
* the `ai/index.adoc` LangChain bullet turned into a real `xref:`, `:keywords:` appended, the *Learning LangChain*
  entry (and the other #198 books) extended with `xref:ai/langchain/index.adoc#_bibliography[…]`
* the root `pages/index.adoc` `:keywords:` appended
* the cross-links the issue names, plus the "planned LangChain" prose in sibling pages turned into real `xref:`s

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography",
"Section-wide conventions" and "Branching, PR target and merge strategy" sections. Every page task must re-read its
page's bullets (`gh issue view 198`) and cover **every** bullet.

**Out of scope** (per the issue): vector-store / retriever internals (linked, not repeated), LlamaIndex / Haystack
(mentions only), framework-neutral agent theory (belongs to AI Agents), LangSmith pricing (link only).

### Merge constraints (from #198 → "Branching, PR target and merge strategy")

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main` only through
  collector issue #213's final integration PR.
* **Prerequisite: #205 (AI Agents) must already be merged into `feature/213-ai-section`.** It is (`b5bd29b0`,
  PR #218, `ai/agents/*` present on this branch). Re-verify at merge time (Group 9). Until every prerequisite is
  merged the PR stays a draft.
* **PR body:** `Refs #198` (never `Closes`) plus the *Merge readiness* block (Group 9).
* **After merge:** tick #198 in #213's *Progress* checklist and delete `feature/198`.
* **Wave note:** #198 is Wave 3 (parallel with #204, #206, #197, #200); it unblocks #208.

### Choices made on the user's behalf

1. **Ship everything in one pass**, as #202–#207 did (about 29 pages, hard).
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`,
   `dotnet` and `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly.
   Python / JS / Java code in pages is illustrative content, not built by this repo — but every example must still
   be checked (see "Lessons").
3. **Books appear only in `== Bibliography`.** The six requester-provided books (Oshin & Campos; Polzer;
   Mendelevitch & Bao; Anthapu & Agarwal; Alammar & Grootendorst; Lee) are never opened, copied or quoted from
   `~/Desktop/ai`; concepts are paraphrased and credited. Pages flag where book code is outdated (v1 migration:
   `langchain-classic`, `create_react_agent` → `create_agent`, `interrupt_before` → `interrupt()`,
   `LANGCHAIN_TRACING_V2` → `LANGSMITH_TRACING`, LangChain4j 0.35 → 1.x) in prose.
4. **Disclaimer:** `partials/ai-langchain-disclaimer.adoc` mirrors `partials/ai-mcp-disclaimer.adoc` (single
   `[IMPORTANT]` block; anchor `xref:ai/langchain/index.adoc#_bibliography[bibliography]`). No other admonition
   anywhere under `ai/langchain/`; version notes, deprecations, security caveats go in prose or table rows.
5. **Version baseline verified at implementation time and dated** (PyPI: `langchain`, `langchain-core`,
   `langchain-classic`, `langgraph`, `langsmith`, `langchain-mcp-adapters`, `langchain-ollama`, `deepagents`,
   `openevals`, `agentevals`; npm: `langchain`, `@langchain/langgraph`, `@langchain/core`; Maven Central:
   LangChain4j, `langchain4j-agentic`, MCP, Spring Boot starter, Quarkus extension). The issue's numbers
   (langchain 1.4.x, langgraph 1.2.x, LangChain4j 1.20.1 …) were checked 2026-09-27 and are **re-verified, not
   copied**. Reuse the AI section baseline for everything else (Python 3.12, Java 21, Ollama `llama3.1:8b` /
   `nomic-embed-text`, hosted models `claude-sonnet-5`, `claude-opus-5-5`, `claude-haiku-4-5`, `claude-fable-5-1`,
   `gpt-6-sol`).
6. **Running example is DocsAssistant** from `database/vector-rag` and `ai/agents`: chat → structured metadata
   extraction → `search_docs` tool → agent with approval before opening a GitHub issue → per-user-thread memory →
   streaming to a web client → evaluation → deployment. Same corpus, models and pgvector store; don't invent a
   second scenario. Python primary; JS on the JS page; Java on the LangChain4j pages.
7. **Existing pages get real `xref:`s; not-yet-built siblings stay plain prose.** Existing and linkable:
   `ai/llm-foundations/*`, `ai/ai-assisted-development/*`, `ai/customizing-ai-workflows/*`, `ai/agents/*`,
   `ai/mcp/*` (esp. `building-clients.adoc`), `ai/local-llms/*`, `database/vector-rag/*`,
   `database/qdrant/rag-integration-patterns.adoc`, `database/neo4j/vector-search-and-genai.adoc`,
   `backend/quarkus/extensions-and-the-platform.adoc`. Not yet existing (plain prose only): Building CLIs for AI
   Agents (#190), Hugging Face (#200), Spring AI (#197), RAG Systems in Production (#208), Conversational
   Channels (#209), Voice Agents (#210), LLMOps (#211), AI Security (#212). Verify each target exists before
   writing an `xref:`. `ai-catalog::` xrefs: the issue names none, so none are added.
8. **Sibling "planned LangChain" prose gets updated.** `ai/agents/frameworks-landscape.adoc:12`,
   `ai/agents/index.adoc:18,35` and any similar mention found by grep in `ai/mcp/*`, `ai/local-llms/*`,
   `ai/agents/*` become real `xref:`s (Group 7), as the "sibling lands later adds the missing xrefs back" rule
   requires. Mentions that are not "planned" claims (plain framework names) are left alone.
9. **Figure floor.** Mermaid: package ecosystem (index), agent loop with middleware hooks, one diagram per
   LangGraph workflow pattern, plus RAG building blocks (bridge page). More where they clarify. SVGs are named
   `modules/ROOT/images/ai-langchain-*.svg`. MathJax (`:stem: latexmath`) where a formula makes a concept precise
   (e.g. token budget of trimmed history, evaluation metrics, cost estimates).

### Lessons from the #202–#206 reviews — mandatory for every page task

**Verify every name against its official page before writing it**: every class / decorator / function / method
(`init_chat_model`, `create_agent`, `ToolStrategy`, `ProviderStrategy`, `wrap_model_call`, `HumanInTheLoopMiddleware`,
`PIIMiddleware`, `SummarizationMiddleware`, `interrupt`, `Command(resume=…)`, `InMemorySaver`, `PostgresSaver`,
`PostgresStore`, `MultiServerMCPClient`, `@traceable`, `evaluate`, `AiServices.builder`, `AgenticServices`,
`McpToolProvider`), config key, env var (`LANGSMITH_TRACING`, `LANGSMITH_API_KEY`), CLI flag (`langgraph dev`,
`langgraph.json` keys) and import path. Sources: the docs.langchain.com pages listed in the issue's bibliography,
the installed packages (`pip show`, `inspect`), the LangChain4j tutorials and sources jars. If the docs don't
confirm a detail, describe the behaviour without naming it. Anything the books teach that v1 removed or moved is
described only as history.

**Security is correctness.** No example hardcodes a secret; keys come from env vars / secret stores. Every
destructive-tool example (opening a GitHub issue) shows an approval gate and least privilege. No token passthrough.

**Every concept gets at least one code example**, each followed by a link to the official page it derives from (that
URL also goes in `== References`).

**Examples must be executed or type-checked where feasible**: run the Python snippets against the real
`langchain` / `langgraph` packages with a fake chat model (`GenericFakeChatModel`) or local Ollama if available;
`tsc --noEmit` the JS/TS snippets; compile the Java snippets against LangChain4j from Maven Central.

**URL hygiene:** canonical URLs only, one URL per source reused consistently. **Cross-links accurate:** never call
an existing page "planned"; grep the target before claiming it covers something; no `xref:` inside backticks; no
empty link text on a fragment xref. **AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes;
`{placeholders}` literal inside `[source]` blocks, escaped (`\{x}`) in prose; no prose line starting with
`<digits>.`; MathJax via `stem:` / `\( \)` with `:stem: latexmath` in the page header. **Consistency:** model
names, DocsAssistant models and scenario match the rest of the AI section.

## Current code state

* **Site structure.** The repo root is the Antora component `irurueta` (`antora.yml`), pages under
  `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`. The AI block starts at `nav.adoc:1046` and contains
  `llm-foundations`, `ai-assisted-development`, `customizing-ai-workflows`, `agents`, `mcp` and `local-llms`
  (last, before Git & GitHub). The LangChain block goes **immediately after** the last `local-llms` child (its
  `Cheat Sheet (PDF)` entry) and before the Git & GitHub block (Hugging Face #200 would sit between them later).
* **`modules/ROOT/pages/ai/index.adoc`** has `== Sub-sections` with
  `* LangChain -- building LLM applications end to end with the LangChain / LangGraph ecosystem. (planned)` (line
  65), a `:keywords:` header, and `== Books used in this section` where the *Learning LangChain* entry (line
  ~126) says "Will be cited by the planned LangChain sub-section"; Polzer, Mendelevitch & Bao, Anthapu &
  Agarwal, Alammar & Grootendorst and Lee entries exist and get an extra "and on LangChain's bibliography" xref.
* **`database/vector-rag/integrating-with-langchain.adoc`** (line 9) holds the sentence to replace; anchors
  `langchain-embeddings`, `-vector-stores`, `-splitters`, `-retrievers`, `-rag-chain`, `-agentic-rag`, `langchain4j`
  must stay unchanged. Sibling vector-rag pages exist: `agentic-rag.adoc`, `agent-memory-and-semantic-cache.adoc`,
  `evaluating-rag-systems.adoc`, `retrieval-strategies.adoc`, `integrating-with-spring-ai.adoc`.
* **Other pages edited:** `database/qdrant/rag-integration-patterns.adoc`, `database/neo4j/vector-search-and-genai.adoc`,
  `backend/quarkus/extensions-and-the-platform.adoc` (Quarkiverse section, ~line 159), root `pages/index.adoc`
  (`:keywords:`), and siblings with "planned LangChain" prose (`ai/agents/frameworks-landscape.adoc:12`,
  `ai/agents/index.adoc:18,35`, others by grep).
* **Templates:** `partials/ai-mcp-disclaimer.adoc` (shape), `images/ai-agents-*.svg` / `ai-mcp-*.svg` (SVG
  conventions), `attachments/ai-mcp-cheat-sheet.pdf`, `ai-agents-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf`,
  `azure-cheat-sheet.pdf` (PDF look), `.archive/implementation_plan_206.md` (plan/workflow precedent).
* **Tooling:** `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`), `npx antora antora-playbook.yml`, the
  `iru-build-docs` skill, Node 24, Python 3, Java + Maven, Google Chrome (headless PDF), `pdfinfo`. The build
  currently runs with 0 errors / 0 warnings on the branch (baseline to preserve).
* **No existing `ai/langchain/` files, no LangChain SVGs or PDF, no LangChain partial.**

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, `:stem: latexmath` on any page using a
  formula, blank line, `include::partial$ai-langchain-disclaimer.adoc[]`.
* **Lead paragraph.** States the versions the page was written against, dated (choice 5).
* **Coverage.** Every bullet of the page's outline in the issue body, plus the page's figure floor.
  SVGs: `viewBox`, `font-family="Helvetica, Arial, sans-serif"`, flat light background, dark hex colours, no CSS
  variables, no external refs, legible in both themes. Every Mermaid block passes `npm run validate:mermaid`.
* **Running example.** Extend DocsAssistant (choice 6).
* **Page ending.** `== References` (official docs, specs, papers — never books).

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes** (two independent tasks).

- [x] Task 1. Create `modules/ROOT/partials/ai-langchain-disclaimer.adoc`. Done: `modules/ROOT/partials/ai-langchain-disclaimer.adoc` created (mcp shape, anchor changed only).
  - [x] Task 1.1. Copy `partials/ai-mcp-disclaimer.adoc`'s shape exactly; change only the anchor to
    `xref:ai/langchain/index.adoc#_bibliography[bibliography]` (and wording if the partial names the sub-section).
  - [x] Task 1.2. Every page includes `include::partial$ai-langchain-disclaimer.adoc[]` and no other admonition.
- [x] Task 2. Verify and record the version baseline (scratchpad `versions-198.md`) that every later task cites. Done: baseline in scratchpad `versions-198.md`, venv `venv/`, `node-198/`, `mvn-198/`; Ollama not available (fake models).
  - [x] Task 2.1. Read current releases from PyPI, npm and Maven Central for the packages in choice 5; state the date;
    record deviations from the issue's numbers.
  - [x] Task 2.2. Verify the v1 facts the issue asserts against `docs.langchain.com/oss/python/migrate/langchain-v1`
    and `releases/langchain-v1`: what moved to `langchain-classic`, `create_agent` and middleware hook names,
    `content_blocks`, LangSmith renames (Deployment / Agent Server / Studio), `LANGSMITH_*` env vars.
  - [x] Task 2.3. Curl-check every URL in the issue's Bibliography (`curl -sI -L -o /dev/null -w '%{url_effective}'`);
    record canonical forms and any 404s (oreilly.com answers 403 to automated fetches — expected).
  - [x] Task 2.4. Create a throw-away venv (Python 3.12) with `langchain`, `langgraph`, `langchain-ollama`,
    `langchain-mcp-adapters`, `langsmith`, `openevals`, `agentevals`, `deepagents`; a Node project with `langchain` /
    `@langchain/langgraph`; a Maven project with LangChain4j 1.x — all in the scratchpad — so later examples are
    lifted from code that actually ran or compiled. Check whether Ollama is available locally; if not, use fake
    chat models and say so.

### Group 2 — Core LangChain pages

**Parallelizable: yes.** Six independent pages under `modules/ROOT/pages/ai/langchain/`; they may link each other by
filename (all exist by Group 8), but none needs another's finished text.

- [x] Task 3. Create `ecosystem-and-packages.adoc` ("Ecosystem & Packages").
  - [x] Task 3.1. Cover: `langchain`, `langchain-core`, `langchain-classic`, partner packages, `langgraph`,
    `langsmith`, `deepagents`; what each is for and when to install it.
  - [x] Task 3.2. The **v1 migration digest**: old import → new import table (chains, `hub`, `langchain.retrievers.*`,
    `SQLRecordManager`, `create_sql_query_chain`, `MultiVectorRetriever`, `SelfQueryRetriever`,
    `langchain_core.pydantic_v1`, splitters → `langchain_text_splitters`, `create_react_agent` → `create_agent`).
  - [x] Task 3.3. Runnable install + import smoke test in the Group 1 venv.
- [x] Task 4. Create `chat-models-and-messages.adoc` ("Chat Models & Messages").
  - [x] Task 4.1. `init_chat_model`; provider packages (Anthropic, OpenAI, Ollama, Hugging Face); message types and
    provider-agnostic `content_blocks`.
  - [x] Task 4.2. `invoke` / `batch` / `stream`, rate limiting, fallbacks, token usage metadata; DocsAssistant chat.
- [x] Task 5. Create `prompts-and-templates.adoc` ("Prompts & Templates").
  - [x] Task 5.1. `ChatPromptTemplate`, `MessagesPlaceholder`, few-shot templates, partial variables.
  - [x] Task 5.2. LangSmith prompt hub / versioning (link to `ai/llm-foundations/managing-prompts.adoc`).
- [x] Task 6. Create `lcel-and-runnables.adoc` ("LCEL & Runnables").
  - [x] Task 6.1. The Runnable protocol, `|` composition, `@chain`, `RunnableParallel` / `RunnablePassthrough`,
    config and callbacks; when to switch to LangGraph.
  - [x] Task 6.2. A Mermaid diagram of a composed chain (validated).
- [x] Task 7. Create `structured-output.adoc` ("Structured Output").
  - [x] Task 7.1. `with_structured_output` (Pydantic v2 / TypedDict / JSON schema); agent `response_format`
    (`ToolStrategy` / `ProviderStrategy`); output parsers; validation and retries.
  - [x] Task 7.2. DocsAssistant metadata-extraction example.
- [x] Task 8. Create `tools.adoc` ("Tools").
  - [x] Task 8.1. `@tool`, schemas and docstrings, `bind_tools`, `ToolRuntime` / context injection, tool errors,
    returning artefacts; the `search_docs` tool.
  - [x] Task 8.2. Point to `ai/agents/tool-design.adoc` for design rules (no duplication).

### Group 3 — Agents and LangGraph core

**Parallelizable: yes.** Six independent pages.

- [x] Task 9. Create `agents-with-create-agent.adoc` ("Agents with create_agent").
  - [x] Task 9.1. `create_agent`: model, tools, system prompt, dynamic model selection, `response_format`; the agent
    loop; replacing `create_react_agent`.
  - [x] Task 9.2. Mermaid: agent loop with middleware hooks (validated).
- [x] Task 10. Create `middleware.adoc` ("Middleware").
  - [x] Task 10.1. Hook lifecycle (`before_agent`, `before_model`, `wrap_model_call`, `wrap_tool_call`, `after_model`,
    `after_agent`); built-ins: summarization, HITL, PII, model / tool retry, call limits.
  - [x] Task 10.2. Custom middleware examples: dynamic prompt, context engineering (link
    `ai/agents/context-engineering-for-agents.adoc`).
- [x] Task 11. Create `langgraph-fundamentals.adoc` ("LangGraph Fundamentals").
  - [x] Task 11.1. `StateGraph`, state and reducers (`add_messages`), nodes and edges, conditional edges, `Command`,
    `Send` (map-reduce).
  - [x] Task 11.2. Graph API vs Functional API (`@entrypoint` / `@task`); Mermaid of a graph.
- [x] Task 12. Create `langgraph-workflows.adoc` ("LangGraph Workflows").
  - [x] Task 12.1. Chaining, routing, parallelisation, orchestrator-worker, evaluator-optimizer / reflection,
    self-corrective RAG — each with a runnable example and its own Mermaid graph.
  - [x] Task 12.2. Link `ai/agents/workflow-patterns.adoc` for the framework-neutral theory.
- [x] Task 13. Create `short-term-memory-and-checkpointers.adoc` ("Short-Term Memory & Checkpointers").
  - [x] Task 13.1. `thread_id`; `InMemorySaver` / SQLite / Postgres checkpointers; `get_state` / `update_state`;
    trimming / filtering / summarising messages; `SummarizationMiddleware`.
  - [x] Task 13.2. Durable execution and fault tolerance; MathJax token-budget formula for trimmed history.
- [x] Task 14. Create `long-term-memory-stores.adoc` ("Long-Term Memory Stores").
  - [x] Task 14.1. `BaseStore` (`InMemoryStore`, `PostgresStore`), namespaces per user, semantic search in stores,
    memory-writing tools, privacy and retention.
  - [x] Task 14.2. Link `database/vector-rag/agent-memory-and-semantic-cache.adoc` and `ai/agents/memory.adoc`.

### Group 4 — Advanced LangGraph

**Parallelizable: yes.** Three independent pages.

- [x] Task 15. Create `human-in-the-loop-and-time-travel.adoc` ("Human-in-the-Loop & Time Travel").
  - [x] Task 15.1. `interrupt()` / `Command(resume=…)`; `HumanInTheLoopMiddleware` (approve / edit / reject);
    editing state; time travel and forking; double-texting strategies.
  - [x] Task 15.2. DocsAssistant approval before opening a GitHub issue (approval gate shown); link
    `ai/agents/human-in-the-loop.adoc`.
- [x] Task 16. Create `streaming.adoc` ("Streaming").
  - [x] Task 16.1. Stream modes (`values` / `updates` / `messages` / `custom`), `astream_events`, a FastAPI SSE
    endpoint, frontend consumption (`useStream` in JS).
  - [x] Task 16.2. Run the FastAPI endpoint with a fake model and capture real SSE output for the page.
- [x] Task 17. Create `multi-agent-and-deep-agents.adoc` ("Multi-Agent & Deep Agents").
  - [x] Task 17.1. Subgraphs, supervisor, handoffs, router, subagents-as-tools, skills.
  - [x] Task 17.2. **Deep Agents** (`deepagents`): planning tool, virtual filesystem, subagents. Link
    `ai/agents/multi-agent-systems.adoc` for patterns.

### Group 5 — Integrations and LangSmith

**Parallelizable: yes.** Nine independent pages.

- [x] Task 18. Create `mcp-adapters.adoc` ("MCP Adapters").
  - [x] Task 18.1. `MultiServerMCPClient` (stdio / Streamable HTTP), loading MCP tools, resources and prompts into
    `create_agent`, exposing a LangGraph agent as MCP. Link `ai/mcp/building-clients.adoc`.
  - [x] Task 18.2. Check against the 2026-07-28 MCP pages (`ai/mcp/*`) so protocol statements stay consistent.
- [x] Task 19. Create `retrieval-and-rag-bridge.adoc` ("Retrieval & RAG Bridge").
  - [x] Task 19.1. Short bridge page: Mermaid of the LangChain RAG building blocks; deep links to
    `database/vector-rag/integrating-with-langchain.adoc#langchain-vector-stores` and the other anchors; RAG-as-a-tool
    agent (`create_agent` + retriever tool); plain-prose pointer to RAG Systems in Production.
  - [x] Task 19.2. Nothing from the vector-rag page is repeated.
- [x] Task 20. Create `multimodality-and-voice.adoc` ("Multimodality & Voice").
  - [x] Task 20.1. Image / audio / PDF content blocks; transcription and TTS via provider integrations.
  - [x] Task 20.2. The STT → agent → TTS "sandwich" pattern with the official voice-agent page; link
    `ai/llm-foundations/multimodal-models.adoc`; Voice Agents named in prose.
- [x] Task 21. Create `guardrails-and-security.adoc` ("Guardrails & Security").
  - [x] Task 21.1. `PIIMiddleware`, guardrail middleware, prompt-injection defences at tool boundaries, tool
    permission scoping, secrets handling. Link `ai/agents/agent-guardrails-and-safety.adoc`; AI Security in prose.
- [x] Task 22. Create `local-models.adoc` ("Local Models").
  - [x] Task 22.1. `ChatOllama` / `OllamaEmbeddings`; `ChatOpenAI(base_url=…)` for vLLM / LM Studio / Docker Model
    Runner; `ChatHuggingFace`; tool-calling caveats for local models. Link `ai/local-llms/*`.
- [x] Task 23. Create `observability-with-langsmith.adoc` ("Observability with LangSmith").
  - [x] Task 23.1. `LANGSMITH_TRACING`, `@traceable`, metadata and tags, threads, cost tracking, OpenTelemetry export,
    alternatives (Langfuse, Phoenix). Link `ai/agents/observability-for-agents.adoc`; LLMOps in prose.
- [x] Task 24. Create `evaluation.adoc` ("Evaluation").
  - [x] Task 24.1. Datasets and `evaluate`; `openevals` LLM-as-judge; `agentevals` trajectory evaluation; online
    evaluators; pytest plugin; regression experiments on DocsAssistant. Link `ai/agents/agent-evaluation.adoc` and
    `database/vector-rag/evaluating-rag-systems.adoc`.
- [x] Task 25. Create `testing.adoc` ("Testing").
  - [x] Task 25.1. Unit tests with fake / generic chat models, testing graphs node by node, integration tests
    against Ollama via Testcontainers or Docker, snapshotting. Tests shown are actually run.
- [x] Task 26. Create `deployment.adoc` ("Deployment").
  - [x] Task 26.1. `langgraph.json`, `langgraph dev`, Agent Server concepts (assistants / threads / runs / crons),
    LangSmith Deployment and self-hosted options, Studio, self-serving with FastAPI. State the renames from the
    LangGraph Platform names in prose.

### Group 6 — Other languages

**Parallelizable: yes.** Three independent pages.

- [x] Task 27. Create `langchain-js.adoc` ("LangChain.js").
  - [x] Task 27.1. Package map, `createAgent`, LangGraph.js, streaming to React (`useStream`), differences from
    Python. `tsc --noEmit` the snippets against the real npm packages.
- [x] Task 28. Create `langchain4j.adoc` ("LangChain4j").
  - [x] Task 28.1. Modules and BOM; `ChatModel` / `StreamingChatModel`; AI Services (`AiServices.builder`,
    `@SystemMessage`, `@UserMessage`, `@V`); `@Tool`; `ChatMemory` / `ChatMemoryProvider` / `ChatMemoryStore`;
    structured outputs; streaming (`TokenStream`, reactive AI Services in 1.20); guardrails; observability
    listeners.
  - [x] Task 28.2. Spring Boot starter and Quarkus extension note (link
    `backend/quarkus/extensions-and-the-platform.adoc`); the RAG surface **linked** to
    `database/vector-rag/integrating-with-langchain.adoc#langchain4j`, not repeated. Compile all snippets with Maven.
- [x] Task 29. Create `langchain4j-agents-and-mcp.adoc` ("LangChain4j Agents & MCP").
  - [x] Task 29.1. `langchain4j-agentic` (experimental): `AgenticServices`, `@Agent`, `AgenticScope`, sequence /
    loop / parallel / conditional workflows, the supervisor.
  - [x] Task 29.2. The MCP client (`McpToolProvider`) and a Java DocsAssistant agent; say explicitly that the module
    is experimental and beta-versioned. Compile the snippets.

### Group 7 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task edits a distinct file and references only pages from Groups 1–6.

- [x] Task 30. Create `ai/langchain/index.adoc` ("LangChain").
  - [x] Task 30.1. Ecosystem map, Python vs JS vs LangChain4j, version table (dated), reading path, Mermaid of the
    package ecosystem, running-scenario table, links to every page.
  - [x] Task 30.2. `== Bibliography` grouped as the issue requires: requester-provided books (full data, publisher
    page, companion code repo), official documentation (all the issue's Python / LangGraph / Deep Agents / LangSmith /
    evaluation-package / LangChain.js / LangChain4j / integrations URLs), specifications, papers (ReAct, Reflexion,
    Self-RAG); closing house-style note that books are consulted references and docs are authoritative.
  - [x] Task 30.3. URL audit: every link resolves (Group 2 Task 2.3 canonical forms); no book text reproduced.
- [x] Task 31. Create `ai/langchain/cheat-sheet.adoc` ("LangChain Cheat Sheet").
  - [x] Task 31.1. What the sheet covers; `xref:` to every page grouped like the nav;
    `xref:attachment$ai-langchain-cheat-sheet.pdf[Download the LangChain Cheat Sheet (PDF)]`.
- [x] Task 32. Produce `modules/ROOT/attachments/ai-langchain-cheat-sheet.pdf`.
  - [x] Task 32.1. Print-ready HTML/CSS (scratchpad), dense multi-column colour-coded boxes, header with version
    baseline and date, breadcrumb footer, visually consistent with `ai-mcp-cheat-sheet.pdf` and
    `vector-rag-cheat-sheet.pdf`; only the PDF is checked in.
  - [x] Task 32.2. Content: package → import table (v1); chat-model and structured-output one-liners; `@tool`;
    `create_agent` + middleware hooks; `StateGraph` skeleton; reducers; checkpointer / store setup; `interrupt` /
    `Command`; stream modes; MCP adapter snippet; LangSmith env vars; evaluation snippet; `langgraph` CLI;
    LangChain4j `AiServices` / `@Tool` / memory / agentic equivalents; JS equivalents.
  - [x] Task 32.3. Render via headless Chrome; verify with `pdfinfo` / `fitz` that it is **exactly one A4 page**
    with no overflow.
- [x] Task 33. Insert the nav block into `modules/ROOT/nav.adoc`.
  - [x] Task 33.1. After `**** xref:ai/local-llms/cheat-sheet.adoc[Cheat Sheet (PDF)]` (last `local-llms` child) and
    before the Git & GitHub block, insert `*** xref:ai/langchain/index.adoc[LangChain]` with 27 `****` children in
    the issue's outline order and a final `**** xref:ai/langchain/cheat-sheet.adoc[Cheat Sheet (PDF)]`; titles
    match page H1s.
- [x] Task 34. Edit `modules/ROOT/pages/ai/index.adoc`.
  - [x] Task 34.1. Replace the "(planned)" LangChain bullet with a real `xref:ai/langchain/index.adoc[LangChain]`
    bullet whose summary matches the real scope.
  - [x] Task 34.2. In `== Books used in this section`, change *Learning LangChain* to "Cited on …" and extend the
    Polzer, Mendelevitch & Bao, Anthapu & Agarwal, Alammar & Grootendorst and Lee entries with
    `xref:ai/langchain/index.adoc#_bibliography[LangChain's bibliography]`.
  - [x] Task 34.3. Append genuinely new terms to `:keywords:` (skip duplicates).
- [x] Task 35. Edit root `modules/ROOT/pages/index.adoc`: append new `:keywords:` terms (LangGraph, LangSmith,
  create_agent, LCEL, checkpointer, Deep Agents, LangChain4j, AiServices, …), skipping duplicates.
- [x] Task 36. Add the cross-links the issue names.
  - [x] Task 36.1. `database/vector-rag/integrating-with-langchain.adoc`: replace the "planned" sentence (line 9)
    with `xref:ai/langchain/index.adoc[]`; keep all anchors unchanged.
  - [x] Task 36.2. `database/vector-rag/agentic-rag.adoc` and `agent-memory-and-semantic-cache.adoc`: link
    `agents-with-create-agent.adoc`, `short-term-memory-and-checkpointers.adoc`, `long-term-memory-stores.adoc`.
  - [x] Task 36.3. `database/qdrant/rag-integration-patterns.adoc` and `database/neo4j/vector-search-and-genai.adoc`:
    link `ai/langchain/retrieval-and-rag-bridge.adoc`.
  - [x] Task 36.4. `backend/quarkus/extensions-and-the-platform.adoc`: link `ai/langchain/langchain4j.adoc`.
- [x] Task 37. Replace "planned LangChain" prose with real xrefs in sibling pages (choice 8).
  - [x] Task 37.1. `grep -rniE "planned.*langchain|langchain.*planned|LangChain sub-section"` under
    `modules/ROOT/pages`; rewrite each sentence, grep the target to confirm the claim, keep surrounding text intact
    (`ai/agents/frameworks-landscape.adoc`, `ai/agents/index.adoc`, and any other hit).

### Group 8 — Build and verify

**Parallelizable: yes** (single task, after Group 7).

- [x] Task 38. Build and verify.
  - [x] Task 38.1. Run `npx antora antora-playbook.yml` on a clean `build/` (via an `iru-gate-runner` sub-agent
    invoking `iru-build-docs`). Must exit 0 with **0 errors and 0 warnings**.
  - [x] Task 38.2. Run `npm run validate:mermaid` (installing `mermaid@11 jsdom` with `--no-save` if needed and
    restoring `node_modules/.package-lock.json`). All diagrams must parse.
  - [x] Task 38.3. Reachability: all 27 pages + `cheat-sheet.adoc` are `xref:`-linked from both
    `ai/langchain/index.adoc` and `nav.adoc`; `build/site/ai/langchain/` has 29 HTML files; every
    `ai-langchain-*.svg` is in `build/site/_images/`; the PDF is 1 A4 page; the vector-rag anchors still resolve.
  - [x] Task 38.4. Grep checks: disclaimer include in all 29 files and no other admonition under `ai/langchain/`;
    book surnames appear only on `ai/langchain/index.adoc` (and `ai/index.adoc`); every content page has
    `== References` and a code example followed by an official link; no `xref:` in backticks; no empty-text fragment
    xrefs; no existing AI page called "planned"; no line-leading `20NN.`; no `\{` inside `----` blocks; no hardcoded
    secrets (`sk-`, `ghp_`, `lsv2_`, literal `Bearer`); every xref target exists; `/iru-check-security` clean.
  - [x] Task 38.5. **Self-review pass.** Delegate to fresh `general-purpose` sub-agents (pages in batches, in
    parallel). Each verifies every class / function / flag / env var / URL against the official docs applying the
    "Lessons" list. Fix every real finding, rebuild, record the finding count.
  - [x] Task 38.6. Re-run the URL audit and re-check the PDF against the pages after the fixes.

### Group 9 — Integration-branch verification (required by #198 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; sub-tasks in order, after Group 8).

- [x] Task 39. Verify against the integration branch and compute merge readiness. (Done 2026-09-29: committed 5e6f52b7; origin/feature/213-ai-section already up to date; clean build 0 errors / 0 warnings, 29 HTML pages, 639 Mermaid diagrams parsed; #205 merged via PR #218; Merge readiness: READY.)
  - [x] Task 39.1. Commit on `feature/198`, then `git fetch origin` and merge the latest
    `origin/feature/213-ai-section` into `feature/198`. Do not push. Don't commit `.secrets.baseline`.
    * **Expected conflict points:** the `** xref:ai/index.adoc[AI]` block in `nav.adoc`, `ai/index.adoc`
      `== Sub-sections` / `== Books used in this section` / `:keywords:`, and the root `:keywords:`.
    * **How to resolve:** keep every sibling's entries, in the fixed sub-section order.
    * If nothing is new, record "already up to date".
  - [x] Task 39.2. Re-run the Antora build and Mermaid validation on the merged result via `iru-gate-runner`. Both
    must be clean.
  - [x] Task 39.3. Confirm prerequisite **#205** is merged into the integration branch:
    `git fetch origin && git branch -r --merged origin/feature/213-ai-section | grep -x "  origin/feature/205"`, or
    `gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`.
  - [x] Task 39.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-198.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #205 <✅ merged into feature/213-ai-section (PR #…) / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY: can be merged into feature/213-ai-section after human review
              | ⏳ WAIT: keep as draft until #205 is merged into feature/213-ai-section, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first". Note the post-merge chores: tick #198 in #213's
    *Progress* checklist and delete `feature/198`.
