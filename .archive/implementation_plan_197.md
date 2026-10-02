# Implementation Plan: Guides & References / AI — "Spring AI"

## Task summary

Source: GitHub issue #197
Base branch: feature/213-ai-section

Issue [#197](https://github.com/albertoirurueta/docs/issues/197) adds sub-section 10 of 15 of the AI section,
**Spring AI**, at `modules/ROOT/pages/ai/spring-ai/`. It is the full reference for **Spring AI 2.0.x on Spring
Boot 4.x** (Java 17+, Framework 7, Jackson 3, JSpecify), covering what a Java/Spring developer needs to build:

* LLM features: `ChatModel` / `ChatClient`, prompts, options, advisors, structured output
* tools (tool calling, `ToolCallingAdvisor`, tool search) and conversational memory (`ChatMemory` and repositories)
* streaming, an MCP client and an MCP server
* multimodality, audio transcription and speech, images
* observability, evaluation, testing, security and guardrails
* agentic patterns, local models, production and deployment, the 1.x → 2.x migration

It **extends, and does not duplicate,** `database/vector-rag/integrating-with-spring-ai.adoc`, which stays canonical
for the vector-store / ETL / RAG-advisor / vector-backed-memory surface; the new pages deep-link its anchors. It turns
the "planned separately" sentence at the top of that page into a real `xref:`.

The sub-section ships:

* 27 pages: `index.adoc` (with `== Bibliography`), 25 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-spring-ai-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-spring-ai-disclaimer.adoc`
* SVGs `modules/ROOT/images/ai-spring-ai-*.svg`
* the nav block (inserted after LangChain, before Git & GitHub)
* the `ai/index.adoc` "Spring AI (planned)" bullet turned into a real `xref:`, `:keywords:` appended, the *Mastering
  Spring AI* / *Spring AI in Action* entries (and the other #197 books) extended with
  `xref:ai/spring-ai/index.adoc#_bibliography[…]`
* the root `pages/index.adoc` `:keywords:` appended
* the four cross-links the issue names, plus "planned Spring AI" prose in sibling pages turned into real `xref:`s

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography",
"Section-wide conventions" and "Branching, PR target and merge strategy" sections. Every page task must re-read its
page's bullets (`gh issue view 197`) and cover **every** bullet.

**Out of scope** (per the issue): vector-store internals (already documented), Spring Boot fundamentals (linked),
Spring AI 1.x-only APIs (only in the migration page), provider-specific pages for every model vendor (a provider
matrix with links replaces them).

### Merge constraints (from #197 → "Branching, PR target and merge strategy")

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main` only through
  collector issue #213's final integration PR.
* **Prerequisite: #205 (AI Agents) must already be merged into `feature/213-ai-section`.** It is (PR #218,
  `ai/agents/*` present on this branch). Re-verify at merge time (Group 10). Until then the PR stays a draft.
* **PR body:** `Refs #197` (never `Closes`) plus the *Merge readiness* block (Group 10).
* **After merge:** tick #197 in #213's *Progress* checklist and delete `feature/197`.
* **Wave note:** #197 is Wave 3 (parallel with #204, #206, #198, #200); it unblocks #208 (RAG Systems in Production).

### Choices made on the user's behalf

1. **Ship everything in one pass**, as #202–#207 and #198 did (about 27 pages, hard).
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`,
   `dotnet` and `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly.
   Java code in pages is illustrative content, not built by this repo, but every example must still be compiled
   (see "Lessons").
3. **Books appear only in `== Bibliography`.** The three requester-provided books (Walls, *Spring AI in Action*;
   Parasuraman, *Mastering Spring AI*; Anthapu & Agarwal, Ch. 7 and 9) are never opened, copied or quoted from
   `~/Desktop/ai`; concepts are paraphrased and credited. Pages flag in prose where book code is outdated (the
   issue's "Where the books are outdated" tables: `ImageClient` → `ImageModel`, `BeanOutputParser` →
   `BeanOutputConverter` / `entity()`, `getContent()` → `getText()`, `FunctionCallbackWrapper` → `@Tool` /
   `FunctionToolCallback`, `PromptChatMemoryAdvisor` removed, `.options` dropped from property paths, MCP annotation
   package move, …). The *Mastering Spring AI* bibliography entry carries the note that the local PDF names "Edizioni
   Ensemble" / ISBN 9788868810009 while the publisher of record verified online is **Apress**; cite Apress/Springer.
4. **Disclaimer:** `partials/ai-spring-ai-disclaimer.adoc` mirrors `partials/ai-langchain-disclaimer.adoc` (single
   `[IMPORTANT]` block; pointer `xref:ai/spring-ai/index.adoc#_bibliography[bibliography]`). No other admonition
   anywhere under `ai/spring-ai/`; version notes, deprecations, security caveats go in prose or table rows.
5. **Version baseline verified at implementation time and dated** (Maven Central: `spring-ai-bom` / `spring-ai-*`
   2.0.x, `spring-boot` 4.0/4.1, MCP Java SDK, `mcp-security`, `spring-ai-agent-utils`, Embabel; the Spring AI
   reference and upgrade notes). The issue's numbers (2.0.0 GA 2026-06-12, 2.0.1 current stable, MCP SDK spec
   2025-11-25) are **re-verified, not copied**. **MCP spec 2026-07-28 support must be re-checked** and any skew stated
   in prose (the sibling `ai/mcp/*` pages already state the site baseline; reuse it). Reuse the AI section baseline
   for everything else (Java 21, Maven, Ollama `llama3.1:8b` / `nomic-embed-text`, hosted models `claude-sonnet-5`,
   `claude-opus-5-5`, `claude-haiku-4-5`, `claude-fable-5-1`, `gpt-6-sol`) and the Spring Boot 4.1.x / Framework 7.0.x
   baseline already used by `backend/springboot/index.adoc`.
6. **Running example is the DocsAssistant Spring Boot 4.1 service**, with the same corpus, models and pgvector store
   as `database/vector-rag/integrating-with-spring-ai.adoc`. Each page adds one capability, in the issue's order: chat
   endpoint → prompt templates → structured metadata extraction → tools (`searchDocs`, plus `openIssue` guarded by
   `@PreAuthorize`) → per-user JDBC memory → SSE streaming → MCP server exposing the tools → MCP client consuming
   GitHub's server → voice question in / spoken answer out → image description → metrics and tracing → evaluator tests
   → deployment. Java 21 with Maven; don't invent a second scenario.
7. **Existing pages get real `xref:`s; not-yet-built siblings stay plain prose.** Existing and linkable:
   `ai/llm-foundations/*` (esp. `prompt-engineering-fundamentals.adoc`), `ai/agents/*`, `ai/mcp/*` (esp.
   `spring-boot-servers.adoc`, `building-clients.adoc`, `authorization.adoc`, `security.adoc`), `ai/local-llms/*`,
   `ai/langchain/*`, `database/vector-rag/*` (anchors: `spring-ai-embeddings`, `-vector-store-api`,
   `-filter-expressions`, `-etl`, `-rag-advisors`, `-modular-rag`, `-chat-memory`, `-tools`, `-testing`),
   `database/redis/spring-boot-redis-as-a-vector-database.adoc`, `backend/springboot/*`
   (`reactive-programming.adoc`, `metrics-and-observability.adoc`, `spring-security.adoc`), `backend/oauth/*`,
   `backend/docker/*` (`spring-boot-integration-tests-with-testcontainers.adoc`, `java-and-spring-boot-images.adoc`,
   `orchestration-swarm-and-kubernetes.adoc`), and the Azure pages for Kubernetes deployment. Not yet existing (plain
   prose only): Hugging Face (#200), Building CLIs for AI Agents (#190), RAG Systems in Production (#208),
   Conversational Channels (#209), Voice Agents (#210), LLMOps (#211), AI Security (#212). Verify each target exists
   before writing an `xref:`. `ai-catalog::` xrefs: the issue names none, so none are added.
8. **Sibling "planned Spring AI" prose gets updated** (Group 8): `ai/index.adoc:69`,
   `database/vector-rag/integrating-with-spring-ai.adoc:14`, and any hit of the grep in Task 41.1 (candidates in
   `ai/agents/*`, `ai/mcp/*`, `ai/langchain/*`).
9. **Figure floor.** Mermaid: advisor chain (advisors page), tool-call sequence (tool-calling page), RAG advisor
   landscape (bridge page), plus more where they clarify (memory flow, MCP client/server wiring, voice round trip,
   deployment topology). One SVG of the Spring AI abstraction layers on `index.adoc`. SVGs are named
   `modules/ROOT/images/ai-spring-ai-*.svg`. MathJax (`:stem: latexmath`) where a formula makes a concept precise
   (e.g. token/cost estimate of a memory window, retry backoff, evaluation scores).

### Lessons from the #202–#206 and #198 reviews — mandatory for every page task

**Verify every name against its official page before writing it**: every class / annotation / method
(`ChatClient.Builder`, `defaultAdvisors`, `CallAdvisor`, `StreamAdvisor`, `ToolCallingAdvisor`,
`ToolSearchToolCallingAdvisor`, `MessageChatMemoryAdvisor`, `MessageWindowChatMemory`, `JdbcChatMemoryRepository`,
`StructuredOutputValidationAdvisor`, `BeanOutputConverter`, `@Tool`, `@ToolParam`, `ToolContext`,
`FunctionToolCallback`, `MethodToolCallbackProvider`, `SyncMcpToolCallbackProvider`, `McpClientCustomizer`, `@McpTool`,
`@McpResource`, `@McpPrompt`, `@McpComplete`, `TranscriptionModel`, `SpeechModel`, `ImageModel`, `ModerationModel`,
`SafeGuardAdvisor`, `RelevancyEvaluator`, `FactCheckingEvaluator`), package name (e.g.
`org.springframework.ai.mcp.annotation.*`), starter artifact (`spring-ai-starter-model-*`,
`spring-ai-starter-mcp-*`), property path (flattened 2.0 form: `spring.ai.openai.chat.model`,
`spring.ai.model.chat`, `spring.ai.mcp.server.protocol`, `spring.ai.mcp.client.streamable-http.connections`,
`spring.ai.tools.limits.*`, `spring.ai.retry.*`) and metric / span name (`gen_ai.client.token.usage`,
`gen_ai.client.operation`, `spring.ai.chat.client`, `spring.ai.advisor`, `execute_tool <name>`). Sources: the
docs.spring.io/spring-ai pages listed in the issue's bibliography, the upgrade notes, the installed jars
(`mvn dependency:sources`, `javap`), and spring-ai-examples. If the docs don't confirm a detail, describe the behaviour
without naming it. Anything the books teach that 2.0 removed or renamed is described only as history.

**Security is correctness.** No example hardcodes a secret; keys come from environment variables / secret stores. The
`openIssue` tool shows `@PreAuthorize`, an approval step and least privilege; memory IDs derive from the authenticated
user, never from client input alone. No token passthrough in the MCP server / client pages; prompt / completion
logging is shown with its privacy implications.

**Every concept gets at least one code example**, each followed by a link to the official page it derives from (that
URL also goes in `== References`).

**Examples must be compiled where feasible**: create a scratch Maven project (scratchpad, never committed) importing
`spring-ai-bom` 2.0.x on Spring Boot 4.x, and compile the Java snippets (with `mvn -q compile`); run what can be run
against a mocked `ChatModel` / WireMock or local Ollama; validate YAML / properties keys against the reference or
`spring-configuration-metadata.json` in the starter jars.

**URL hygiene:** canonical URLs only, one URL per source reused consistently. **Cross-links accurate:** never call an
existing page "planned"; grep the target before claiming it covers something; no `xref:` inside backticks; no empty
link text on a fragment xref. **AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes; `{placeholders}`
literal inside `[source]` blocks, escaped (`\{x}`) in prose; no prose line starting with `<digits>.`; MathJax via
`stem:` / `\( \)` with `:stem: latexmath` in the page header. **Consistency:** model names, DocsAssistant models and
scenario match the rest of the AI section and `integrating-with-spring-ai.adoc`.

## Current code state

* **Site structure.** The repo root is the Antora component `irurueta` (`antora.yml`), pages under
  `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`. The AI block starts at `nav.adoc:1046` and contains
  `llm-foundations`, `ai-assisted-development`, `customizing-ai-workflows`, `agents`, `mcp`, `local-llms` and
  `langchain`. The Spring AI block goes **immediately after** the last `langchain` child (its `Cheat Sheet (PDF)`
  entry) and before the Git & GitHub block. The fixed order is …, Hugging Face (#200, not yet added), LangChain,
  **Spring AI**, RAG Systems …, so Spring AI sits directly after LangChain.
* **`modules/ROOT/pages/ai/index.adoc`** has `== Sub-sections` with
  `* Spring AI -- building LLM applications end to end with Spring AI on the JVM. (planned)` (line 69), a
  `:keywords:` header that already contains "Spring AI MCP, @McpTool, @McpResource, @McpPrompt", and
  `== Books used in this section` where *Mastering Spring AI* (line ~136, "Will be cited by the planned Spring AI
  sub-section") and *Spring AI in Action* (line ~143) have entries to convert to "Cited on …"; Anthapu & Agarwal
  exists and gets an extra bibliography xref.
* **`database/vector-rag/integrating-with-spring-ai.adoc`** (line 14) holds the sentence to replace; anchors
  `spring-ai-embeddings` (17), `-vector-store-api` (70), `-filter-expressions` (165), `-etl` (201), `-rag-advisors`
  (249), `-modular-rag` (318), `-chat-memory` (368), `-tools` (434), `-testing` (497) must stay unchanged.
* **Other pages edited:** `database/redis/spring-boot-redis-as-a-vector-database.adoc`,
  `backend/springboot/index.adoc` (a "Spring AI" bullet), `backend/springboot/metrics-and-observability.adoc`, root
  `pages/index.adoc` (`:keywords:`), and siblings with "planned Spring AI" prose.
* **Templates:** `partials/ai-langchain-disclaimer.adoc` (shape), `images/ai-mcp-*.svg` / `ai-agents-*.svg` (SVG
  conventions), `attachments/ai-langchain-cheat-sheet.pdf`, `ai-mcp-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf`,
  `azure-cheat-sheet.pdf` (PDF look), `.archive/implementation_plan_198.md` (plan/workflow precedent).
* **Tooling:** `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`), `npx antora antora-playbook.yml`, the
  `iru-build-docs` skill, Node 24, Java + Maven, Google Chrome (headless PDF), `pdfinfo`. The build currently runs
  with 0 errors / 0 warnings on the branch (baseline to preserve).
* **No existing `ai/spring-ai/` files, no Spring AI SVGs or PDF, no Spring AI partial.**

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, `:stem: latexmath` on any page using a
  formula, blank line, `include::partial$ai-spring-ai-disclaimer.adoc[]`.
* **Lead paragraph.** States the versions the page was written against (Spring AI 2.0.x, Spring Boot 4.1.x, Java 21),
  dated (choice 5).
* **Coverage.** Every bullet of the page's outline in the issue body, plus the page's figure floor.
  SVGs: `viewBox`, `font-family="Helvetica, Arial, sans-serif"`, flat light background, dark hex colours, no CSS
  variables, no external refs, legible in both themes. Every Mermaid block passes `npm run validate:mermaid`.
* **Running example.** Extend DocsAssistant (choice 6); each page states what capability it adds.
* **Page ending.** `== References` (official docs, specs, papers — never books).

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: no — Task 2 and Task 3 consume the versions Task 1 records.**

- [x] Task 1. Verify the version baseline and record it (scratchpad `versions-197.md`, not committed). -- baseline recorded in `/private/tmp/claude-501/-Users-airurueta-irurueta2-common-docs/9e78e9a9-bee4-4a41-908b-330b13bd0f64/scratchpad/versions-197.md` (2026-09-29): Spring AI 2.0.1, Boot 4.1.1, MCP SDK 2.0.x targets spec 2025-11-25 (site baseline 2026-07-28: skew), mcp-server/client-security 0.1.14, agent-utils 0.12.0, Embabel 1.5.2.
  - [x] Task 1.1. Fetch the current Spring AI reference, upgrade notes and GA blog; confirm the latest 2.0.x, the
    supported Spring Boot line, Java baseline and Jackson 3 / JSpecify requirements; date the check.
  - [x] Task 1.2. Confirm from Maven Central the current `spring-ai-bom`, MCP Java SDK, `mcp-security`,
    `spring-ai-agent-utils` and Embabel versions; confirm which MCP spec revision the SDK targets vs. the site
    baseline (2026-07-28) and note any skew for prose.
  - [x] Task 1.3. Diff the issue's 1.x → 2.x claims against the upgrade notes (options builders, property paths,
    removed advisors / starters, tool changes, memory, MCP, audio, observability, Embabel) and list corrections.
- [x] Task 2. Create a scratch Maven project (scratchpad) with `spring-ai-bom` 2.0.x on Spring Boot 4.x and the -- scratch project `/private/tmp/claude-501/-Users-airurueta-irurueta2-common-docs/9e78e9a9-bee4-4a41-908b-330b13bd0f64/scratchpad/spring-ai-scratch` compiles (`mvn -q -B compile`); sources resolved; `cp.txt` and `props.txt` for javap / property validation.
  starters the pages need (OpenAI, Ollama, MCP client/server, JDBC memory, pgvector) so every snippet can be
  compiled with `mvn -q compile`; resolve source jars for API verification.
- [x] Task 3. Create `modules/ROOT/partials/ai-spring-ai-disclaimer.adoc`, mirroring -- created `modules/ROOT/partials/ai-spring-ai-disclaimer.adoc` (license-header generation skipped: AsciiDoc, no header convention).
  `ai-langchain-disclaimer.adoc`, single `[IMPORTANT]` block, pointer
  `xref:ai/spring-ai/index.adoc#_bibliography[bibliography]`.
- [x] Task 4. Fix the shared DocsAssistant conventions for the sub-section (package `dev.irurueta.docsassistant` -- conventions in `/private/tmp/claude-501/-Users-airurueta-irurueta2-common-docs/9e78e9a9-bee4-4a41-908b-330b13bd0f64/scratchpad/docsassistant-conventions-197.md` (package `com.example.docsassistant`).
  or the one used by `integrating-with-spring-ai.adoc`, class names `DocsAssistantController`,
  `DocsTools`, `IssueTools`, endpoint paths, model names, property set) by reading the vector-rag Spring AI page, and
  record them in the scratchpad so parallel page tasks stay consistent.

### Group 2 — Getting started and core API

**Parallelizable: yes.** Every task creates a distinct page; shared conventions come from Group 1 and no page depends
on another's finished text.

- [x] Task 5. Create `ai/spring-ai/setup-and-starters.adoc` ("Setup & Starters"). -- `modules/ROOT/pages/ai/spring-ai/setup-and-starters.adoc` (1 Mermaid); pom resolved with Maven, YAML keys checked against starter metadata, all Java compiled.
  - [x] Task 5.1. BOM 2.0.x, starter naming (`spring-ai-starter-model-*`, `-vector-store-*`, `-mcp-*`), flattened
    properties, `spring.ai.model.chat=` provider selection, Docker Compose and Testcontainers dev services, Spring
    Initializr; Maven snippet and `application.yml`; provider family matrix.
- [x] Task 6. Create `ai/spring-ai/chatmodel-and-chatclient.adoc` ("ChatModel & ChatClient"). -- `modules/ROOT/pages/ai/spring-ai/chatmodel-and-chatclient.adoc`; Java compiled, defaults/usage behaviour run against a stub ChatModel.
  - [x] Task 6.1. `ChatModel` vs. `ChatClient`, builder defaults (`defaultSystem`, `defaultTools`,
    `defaultAdvisors`), `call()` vs. `stream()`, `content()` / `entity()` / `chatResponse()`, usage metadata, multiple
    `ChatClient`s for multiple models; DocsAssistant chat endpoint.
- [x] Task 7. Create `ai/spring-ai/prompts-and-templates.adoc` ("Prompts & Templates"). -- `modules/ROOT/pages/ai/spring-ai/prompts-and-templates.adoc`; Java compiled, renderer/template behaviour run.
  - [x] Task 7.1. `Prompt`, message roles, `PromptTemplate` / `SystemPromptTemplate`, `.st` resources, custom
    `TemplateRenderer`, prompt-engineering-patterns page; link `ai/llm-foundations/prompt-engineering-fundamentals.adoc`.
- [x] Task 8. Create `ai/spring-ai/chat-options.adoc` ("Chat Options"). -- `modules/ROOT/pages/ai/spring-ai/chat-options.adoc`; Java compiled, option layering verified against 2.0.1 sources and a stub run (request options() replaces defaultOptions()).
  - [x] Task 8.1. Portable vs. provider options, immutable builders and `mutate()`, per-request `ChatClient.options()`
    builder, reasoning / effort options per provider; sampling links to `ai/llm-foundations/sampling-and-decoding.adoc`.
- [x] Task 9. Create `ai/spring-ai/advisors.adoc` ("Advisors"). -- `modules/ROOT/pages/ai/spring-ai/advisors.adoc` (2 Mermaid); advisors compiled and unit-tested with a stub ChatModel.
  - [x] Task 9.1. Advisor chain and ordering constants, `CallAdvisor` / `StreamAdvisor`, `SimpleLoggerAdvisor`,
    recursive advisors, a custom advisor (canary-word check or tenant tagging); Mermaid of the advisor chain around a
    call with RAG, memory and tool-calling advisors.
- [x] Task 10. Create `ai/spring-ai/structured-output.adoc` ("Structured Output"). -- `modules/ROOT/pages/ai/spring-ai/structured-output.adoc` (1 Mermaid); Java compiled, parsing/cleaning/validate-retry run against a stub ChatModel.
  - [x] Task 10.1. `entity()`, `BeanOutputConverter` / `MapOutputConverter` / `ListOutputConverter`, native
    structured output, `StructuredOutputValidationAdvisor` self-correction, records and generics; DocsAssistant
    metadata-extraction record.

### Group 3 — Tools and memory

**Parallelizable: yes.** Distinct pages; cross-references between them are `xref:` to files that all exist by the end
of the group and are checked in Group 9.

- [x] Task 11. Create `ai/spring-ai/tool-calling.adoc` ("Tool Calling"). -- `modules/ROOT/pages/ai/spring-ai/tool-calling.adoc` (1 Mermaid); Java compiled, @PreAuthorize on a @Tool run on a Spring context, loop/returnDirect/exception handling run against a stub ChatModel.
  - [x] Task 11.1. `@Tool` / `@ToolParam`, `ToolCallback` / `FunctionToolCallback` / `MethodToolCallbackProvider`,
    `ToolContext`, `returnDirect`, exception handling, the tool-call flow (Mermaid sequence); `searchDocs` and a
    guarded `openIssue`; link the `spring-ai-tools` anchor and `ai/agents/tool-design.adoc`.
- [x] Task 12. Create `ai/spring-ai/tool-calling-advisor-and-tool-search.adoc` ("Tool Calling Advisor & Tool Search"). -- `modules/ROOT/pages/ai/spring-ai/tool-calling-advisor-and-tool-search.adoc` (1 Mermaid, MathJax); Java compiled, manual loop, limits, memory-inside-loop and tool-search prompt run against a stub ChatModel.
  - [x] Task 12.1. Automatic `ToolCallingAdvisor`, manual loop with `ToolCallingManager`,
    `ToolSearchToolCallingAdvisor` for large tool sets, `spring.ai.tools.limits.*`, fallback behaviour (disabled by
    default); state what 2.0 removed (`internalToolExecutionEnabled`, `SpringBeanToolCallbackResolver`, `toolNames()`).
- [x] Task 13. Create `ai/spring-ai/chat-memory.adoc` ("Chat Memory"). -- `modules/ROOT/pages/ai/spring-ai/chat-memory.adoc` (1 Mermaid, MathJax); Java compiled, window/isolation/missing-ID/tool-message behaviour and summarising memory run.
  - [x] Task 13.1. `ChatMemory` / `MessageWindowChatMemory`, the **mandatory conversation ID** and how to derive it
    from the authenticated user and session, `MessageChatMemoryAdvisor`, tool messages not persisted, summarising long
    histories, vector-backed memory via `integrating-with-spring-ai.adoc#spring-ai-chat-memory`; note
    `PromptChatMemoryAdvisor` is gone; memory-window sizing formula (MathJax).
- [x] Task 14. Create `ai/spring-ai/chat-memory-repositories.adoc` ("Chat Memory Repositories"). -- `modules/ROOT/pages/ai/spring-ai/chat-memory-repositories.adoc` (1 Mermaid); Java compiled, JDBC repository, registry, erasure, retention job and custom repository run on H2 (PostgreSQL mode); Cassandra/Mongo/Neo4j/Redis compiled only.
  - [x] Task 14.1. JDBC (schema with `sequence_id`, `initialize-schema`), Cassandra, MongoDB, Neo4j, Redis (link the
    Redis page), a custom `ChatMemoryRepository`, retention and GDPR deletion.

### Group 4 — Streaming and MCP

**Parallelizable: yes.** Distinct pages.

- [x] Task 15. Create `ai/spring-ai/streaming-and-reactive.adoc` ("Streaming & Reactive"). -- `modules/ROOT/pages/ai/spring-ai/streaming-and-reactive.adoc` (1 Mermaid, MathJax); Java compiled; SSE endpoints, memory/tools/cancellation/virtual-thread behaviour run on a Spring MVC context with a scripted ChatModel; StepVerifier tests passed.
  - [x] Task 15.1. `Flux<String>` / `Flux<ChatResponse>`, SSE endpoints (WebFlux and MVC), streaming with tools and
    memory, cancellation, virtual threads for blocking calls; link `backend/springboot/reactive-programming.adoc`;
    Conversational Channels named in plain prose (#209).
- [x] Task 16. Create `ai/spring-ai/mcp-client.adoc` ("MCP Client"). -- `modules/ROOT/pages/ai/spring-ai/mcp-client.adoc` (1 Mermaid); Java compiled; client run against a local token-protected MCP server standing in for GitHub (customizer token, read-only filter, logging handler, stdio env, start-up failure); the hosted GitHub server itself was not called.
  - [x] Task 16.1. `spring-ai-starter-mcp-client(-webflux)`, `stdio` / `sse` / `streamable-http` connections,
    `mcp-servers.json`, `SyncMcpToolCallbackProvider`, `McpClientCustomizer`, client annotations (logging, progress,
    elicitation handlers), consuming the GitHub MCP server with a token from the environment; link
    `ai/mcp/building-clients.adoc`.
- [x] Task 17. Create `ai/spring-ai/mcp-server.adoc` ("MCP Server"). -- `modules/ROOT/pages/ai/spring-ai/mcp-server.adoc` (2 Mermaid); Java compiled; server run secured with mcp-server-security 0.1.14 against a local issuer (401/metadata/audience/Origin/Host/API key), STATELESS mode, Inspector CLI and curl; JUnit DocsMcpServerTest passed (4 tests, JDK 21).
  - [x] Task 17.1. `spring-ai-starter-mcp-server(-webmvc/-webflux)`, `protocol=STREAMABLE|STATELESS|SSE`, `@McpTool`
    / `@McpResource` / `@McpPrompt` / `@McpComplete` (package `org.springframework.ai.mcp.annotation.*`), exposing
    existing `@Tool` beans, securing with Spring Security and OAuth (`mcp-security`), testing with the Inspector;
    link `ai/mcp/spring-boot-servers.adoc` (protocol depth lives there), `ai/mcp/authorization.adoc`,
    `backend/oauth/*`; state the MCP spec skew from Task 1.2.

### Group 5 — Multimodal and voice

**Parallelizable: yes.** Distinct pages.

- [x] Task 18. Create `ai/spring-ai/multimodality.adoc` ("Multimodality"). -- `modules/ROOT/pages/ai/spring-ai/multimodality.adoc` (579 lines incl. code); 8 Java classes + 1 test compiled and run against 2.0.1 jars (scratch g5/), endpoint run with scripted ChatModel; 1 Mermaid flowchart (validated), 1 MathJax formula; no SVG.
  - [x] Task 18.1. `Media` input (images, audio, PDF), vision Q&A (DocsAssistant image description), provider support
    matrix; link `ai/llm-foundations/multimodal-models.adoc`.
- [x] Task 19. Create `ai/spring-ai/audio-transcription-and-speech.adoc` ("Audio Transcription & Speech"). -- 721 lines; classes compiled, OpenAI request shapes checked against a local stand-in server (ElevenLabs compiled and bean-checked only), voice endpoints run with scripted models (curl), 2 tests run; TTS interface is `TextToSpeechModel` (no `SpeechModel` in 2.0.1); ElevenLabs starter present in 2.0.1; 1 Mermaid sequence diagram (validated), MathJax latency model; no SVG.
  - [x] Task 19.1. `TranscriptionModel` / streaming transcription (OpenAI), `SpeechModel` (OpenAI TTS streaming,
    ElevenLabs), a voice round-trip endpoint (audio in → text → `ChatClient` → speech out, Mermaid); Voice Agents
    (#210) named in plain prose for real-time and telephony.
- [x] Task 20. Create `ai/spring-ai/image-generation.adoc` ("Image Generation"). -- 562 lines; classes compiled, OpenAI and Stability request bodies captured from a local stand-in server, 3 tests run; no Mermaid, no SVG; MathJax cost formula.
  - [x] Task 20.1. `ImageModel`, `ImagePrompt`, OpenAI / Stability options, storing the results; note
    `ImageClient` → `ImageModel` history.

### Group 6 — Operations and quality

**Parallelizable: yes.** Distinct pages.

- [x] Task 21. Create `ai/spring-ai/observability.adoc` ("Observability"). -- 790 lines; Java compiled and 4 tests run (WireMock-backed OllamaChatModel); compose/prometheus/rules validated with promtool; 1 Mermaid.
  - [x] Task 21.1. Micrometer observations and `gen_ai.*` metrics, Actuator / Prometheus / Grafana dashboards, OTel
    tracing (`execute_tool <name>` spans), prompt / completion logging flags and their privacy implications; link
    `backend/springboot/metrics-and-observability.adoc`; LLMOps (#211) named in plain prose.
- [x] Task 22. Create `ai/spring-ai/evaluation.adoc` ("Evaluation"). -- 916 lines; Java compiled and 13 tests run; 1 Mermaid.
  - [x] Task 22.1. `RelevancyEvaluator`, `FactCheckingEvaluator`, the LLM-as-judge guide, custom evaluators, runtime
    self-evaluation with retry, golden-set tests in JUnit; link `database/vector-rag/evaluating-rag-systems.adoc`.
- [x] Task 23. Create `ai/spring-ai/testing.adoc` ("Testing"). -- 626 lines; Java compiled, 33 non-live tests run (WireMock, Spring Boot, scripted models); Testcontainers Ollama smoke run with smollm2:135m (llama3.1:8b live test compiled only); 1 Mermaid.
  - [x] Task 23.1. Stubbing models (WireMock / mock `ChatModel`), Testcontainers Ollama with `@ServiceConnection`,
    slice tests for advisors and tools, evaluator-based assertions, deterministic settings; link the `spring-ai-testing`
    anchor and `backend/docker/spring-boot-integration-tests-with-testcontainers.adoc`.
- [x] Task 24. Create `ai/spring-ai/security-and-guardrails.adoc` ("Security & Guardrails"). -- 738 lines; Java compiled and 9 tests run (SecurityConfig compile-only); 1 Mermaid; xrefs production-and-deployment.adoc (Group 7, planned).
  - [x] Task 24.1. Spring Security integration, per-user memory isolation, `@PreAuthorize` on tools,
    `SafeGuardAdvisor`, a canary-word advisor, `ModerationModel`, RAG document-level access via filter expressions
    (link `spring-ai-filter-expressions`), prompt injection; link `backend/springboot/spring-security.adoc`,
    `ai/agents/agent-guardrails-and-safety.adoc`, `ai/mcp/security.adoc`; AI Security (#212) named in plain prose.

### Group 7 — Agents, local models, production, migration and RAG bridge

**Parallelizable: yes.** Distinct pages.

- [x] Task 25. Create `ai/spring-ai/agentic-patterns.adoc` ("Agentic Patterns").
  - [x] Task 25.1. Effective-agents workflows (chaining, routing, parallelisation, orchestrator-workers,
    evaluator-optimizer), the 2026 agentic-patterns series (skills, subagents, A2A, memory tools), community
    `spring-ai-agent-utils`, Embabel 1.5 (GOAP) overview; link `ai/agents/workflow-patterns.adoc`,
    `ai/agents/agent-loop-and-architectures.adoc`, `ai/agents/agent-to-agent-protocol.adoc`.
  - Done: `ai/spring-ai/agentic-patterns.adoc` (807 lines): five workflow classes, agent-utils 0.12.0 config, Embabel 1.5.2 agent. Snippets compiled; 5 workflow tests plus a subagent tool-set probe ran (scripted model). 2 Mermaid blocks, no SVG. Verified finding: a `ClaudeSubagentType` subagent with no `tools:` line gets Bash, Edit, Write, Read, WebFetch.
- [x] Task 26. Create `ai/spring-ai/local-models.adoc` ("Local Models").
  - [x] Task 26.1. Ollama starter (pull strategy, `think`, keep-alive), Docker Model Runner, OpenAI starter with
    `base-url` for vLLM / llama.cpp / LM Studio / Foundry Local, ONNX `TransformersEmbeddingModel`; link
    `ai/local-llms/*`; Hugging Face (#200) named in plain prose.
  - Done: `ai/spring-ai/local-models.adoc` (541 lines): Ollama, Docker Model Runner, OpenAI-compatible servers, ONNX. Snippets compiled; ONNX default model run (384 dims); DMR not run (Model Runner not running locally). 1 Mermaid block, no SVG. Verified finding: on 2.0.1 `spring.ai.openai.base-url` must include `/v1`.
- [x] Task 27. Create `ai/spring-ai/production-and-deployment.adoc` ("Production & Deployment").
  - [x] Task 27.1. `spring.ai.retry`, rate limiting, caching (`@Cacheable` on deterministic calls, semantic-cache
    pointer to `database/vector-rag/agent-memory-and-semantic-cache.adoc`), timeouts, virtual threads, containers and
    Kubernetes (link Docker and Azure pages), secrets, governance and LLMOps; retry-backoff / cost formula (MathJax).
  - Done: `ai/spring-ai/production-and-deployment.adoc` (650 lines): retry, limits, cache, timeouts, virtual threads, Kubernetes, secrets, cost (MathJax), governance. Snippets compiled; retry defaults, retry timeout, cache and limiter tests ran; YAML parsed, not applied to a cluster; `spring.ai.*` keys checked against metadata. 1 Mermaid block, no SVG.
- [x] Task 28. Create `ai/spring-ai/migration-1x-to-2x.adoc` ("Migrating from 1.x to 2.x").
  - [x] Task 28.1. Upgrade-notes digest as an old → new table (Task 1.3 corrections included), OpenRewrite recipes if
    available (verify), book-code migration notes (Walls 1.0.3, Parasuraman 0.8.x), each row linking upgrade notes.
  - Done: `ai/spring-ai/migration-1x-to-2x.adoc` (667 lines): old-to-new tables from the upgrade notes (every row linked, all anchors checked), OpenRewrite recipes (names verified from docs, not run), book migration notes. `MigratedDocsAssistant` compiled. 1 Mermaid block, no SVG.
- [x] Task 29. Create `ai/spring-ai/retrieval-and-rag-bridge.adoc` ("Retrieval & RAG Bridge").
  - [x] Task 29.1. Short bridge page: RAG advisor landscape in one Mermaid diagram, deep links to the
    `integrating-with-spring-ai.adoc` anchors, pointer to RAG Systems in Production (#208, plain prose) for APIs,
    conversational RAG and citations.
  - Done: `ai/spring-ai/retrieval-and-rag-bridge.adoc` (419 lines): landscape diagram, anchors of `integrating-with-spring-ai.adoc`, advisor-order and follow-up findings. Snippets compiled; 3 tests ran (retrieval runs twice per question at default order 0, once at MIN+250). 1 Mermaid block, no SVG.

### Group 8 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task edits a distinct file and references only pages from Groups 2–7.

- [x] Task 30. Create `ai/spring-ai/index.adoc` ("Spring AI"). -- `modules/ROOT/pages/ai/spring-ai/index.adoc` (layers SVG, interface table with `TextToSpeechModel` instead of the non-existent `SpeechModel`, dated version table with the MCP 2025-11-25 vs 2026-07-28 skew in prose, provider families, DocsAssistant table, reading path, links to all 25 pages + cheat sheet, grouped bibliography); new `modules/ROOT/images/ai-spring-ai-abstraction-layers.svg` (rendered with headless Chrome and checked); `PortableDocsAssistant` snippet compiled against 2.0.1. URL audit: 136 URLs, all 200 except packtpub.com (403 to bots, noted in prose). License-header generation skipped (AsciiDoc/SVG, no header convention).
  - [x] Task 30.1. What Spring AI is, the 2.0 baseline (dated version table), portable abstractions (`ChatModel`,
    `EmbeddingModel`, `ImageModel`, `TranscriptionModel`, `SpeechModel`, `ModerationModel`, `VectorStore`), provider
    families, reading path, DocsAssistant scenario table, links to every page; SVG
    `images/ai-spring-ai-abstraction-layers.svg` of the abstraction layers.
  - [x] Task 30.2. `== Bibliography` grouped as the issue requires: requester-provided books (full data, publisher
    page, companion code repo, the Apress-vs-Edizioni note), official documentation (all the issue's Spring AI
    reference URLs, Spring Boot docs), specifications (MCP), samples and engineering articles (Spring blog GA post,
    agentic patterns series, spring-ai-examples, MCP Java SDK, Embabel); closing house-style note that books are
    consulted references and docs are authoritative.
  - [x] Task 30.3. URL audit: every link resolves; no book text reproduced.
- [x] Task 31. Create `ai/spring-ai/cheat-sheet.adoc` ("Spring AI Cheat Sheet"). -- `modules/ROOT/pages/ai/spring-ai/cheat-sheet.adoc`: coverage list, xrefs to all pages grouped like the nav, a compiled ChatClient idiom, the PDF download xref, MCP skew stated.
  - [x] Task 31.1. What the sheet covers; `xref:` to every page grouped like the nav;
    `xref:attachment$ai-spring-ai-cheat-sheet.pdf[Download the Spring AI Cheat Sheet (PDF)]`.
- [x] Task 32. Produce `modules/ROOT/attachments/ai-spring-ai-cheat-sheet.pdf`. -- rendered from scratchpad `cheatsheet/cheat-sheet.html` with headless Chrome; `pdfinfo`: Pages 1, 594.96 x 841.92 pts (A4), 341,767 bytes; four columns of colour-coded boxes, header baseline (Spring AI 2.0.1, Boot 4.0/4.1, Java 17+/21, 2026-09-29, MCP skew), breadcrumb footer; `TextToSpeechModel` used (SpeechModel only as the pre-2.0 name); no secrets.
  - [x] Task 32.1. Print-ready HTML/CSS (scratchpad), dense multi-column colour-coded boxes, header with version
    baseline and date, breadcrumb footer, visually consistent with `ai-langchain-cheat-sheet.pdf`,
    `vector-rag-cheat-sheet.pdf` and `azure-cheat-sheet.pdf`; only the PDF is checked in.
  - [x] Task 32.2. Content: starters and BOM; key 2.0 flattened properties; `ChatClient` idioms; advisor order
    constants; `@Tool` and tool-callback types; chat memory setup; MCP client / server properties and annotations;
    audio and image APIs; observability metric names; evaluator snippets; Testcontainers; the 1.x → 2.x renames.
  - [x] Task 32.3. Render via headless Chrome; verify with `pdfinfo` that it is **exactly one A4 page** with no
    overflow.
- [x] Task 33. Insert the nav block into `modules/ROOT/nav.adoc`. -- Spring AI block (index + 25 children in outline order + Cheat Sheet (PDF)) inserted after the LangChain cheat sheet entry, before Git & GitHub; titles match page H1s.
  - [x] Task 33.1. After the last `langchain` child (`Cheat Sheet (PDF)`) and before the Git & GitHub block, insert
    `*** xref:ai/spring-ai/index.adoc[Spring AI]` with 25 `****` children in the issue's outline order and a final
    `**** xref:ai/spring-ai/cheat-sheet.adoc[Cheat Sheet (PDF)]`; titles match page H1s.
- [x] Task 34. Edit `modules/ROOT/pages/ai/index.adoc`. -- "(planned)" bullet replaced by a real xref with the real scope; Parasuraman and Walls entries now "Cited on ... Spring AI's bibliography"; Anthapu & Agarwal extended with the Spring AI bibliography xref; 30 new `:keywords:` terms (duplicates skipped; `TextToSpeechModel`, not `SpeechModel`).
  - [x] Task 34.1. Replace the "(planned)" Spring AI bullet with a real `xref:ai/spring-ai/index.adoc[Spring AI]`
    bullet whose summary matches the real scope.
  - [x] Task 34.2. In `== Books used in this section`, change *Mastering Spring AI* and *Spring AI in Action* to
    "Cited on …" and extend the Anthapu & Agarwal entry with
    `xref:ai/spring-ai/index.adoc#_bibliography[Spring AI's bibliography]`.
  - [x] Task 34.3. Append genuinely new terms to `:keywords:` (skip duplicates).
- [x] Task 35. Edit root `modules/ROOT/pages/index.adoc`: append new `:keywords:` terms (ChatClient, advisors,
  ToolCallingAdvisor, tool search, chat memory, MessageChatMemoryAdvisor, JdbcChatMemoryRepository, Spring AI MCP
  client, TranscriptionModel, SpeechModel, ImageModel, SafeGuardAdvisor, RelevancyEvaluator, Embabel, …), skipping
  duplicates. -- 21 new terms appended to root `modules/ROOT/pages/index.adoc` `:keywords:` (duplicates such as `Spring AI` skipped; `TextToSpeechModel` used instead of the non-existent `SpeechModel`).
- [x] Task 36. Add the cross-links the issue names. -- `database/vector-rag/integrating-with-spring-ai.adoc` (line-14 prose now xrefs `ai/spring-ai/index.adoc` and the bridge page; `QuestionAnswerAdvisor` import fixed to `...advisor.vectorstore` with the `spring-ai-vector-store-advisor` artifact named, `RetrievalAugmentationAdvisor` artifact `spring-ai-rag` named; all 9 `spring-ai-*` anchors unchanged; `DocsAssistantRag` recompiled); `database/redis/spring-boot-redis-as-a-vector-database.adoc` (import fixed to `org.springframework.ai.chat.memory.repository.redis.RedisChatMemoryRepository`, `ChatMemory.builder()` -> `MessageWindowChatMemory.builder()`, verified against the 2.0.1 jar and recompiled; links chat-memory-repositories and advisors); `backend/springboot/index.adoc` (Spring AI bullet + keyword; description left as is); `backend/springboot/metrics-and-observability.adoc` (paragraph linking `ai/spring-ai/observability.adoc` + keyword). Antora build (scratch output dir): exit 0, 0 warnings, 27 HTML files under ai/spring-ai.
  - [x] Task 36.1. `database/vector-rag/integrating-with-spring-ai.adoc`: replace the "planned separately" prose
    (line 14) with `xref:ai/spring-ai/index.adoc[]`; keep all anchors unchanged.
  - [x] Task 36.2. `database/redis/spring-boot-redis-as-a-vector-database.adoc`: link
    `ai/spring-ai/chat-memory-repositories.adoc` and `ai/spring-ai/advisors.adoc`.
  - [x] Task 36.3. `backend/springboot/index.adoc`: add a "Spring AI" bullet linking `ai/spring-ai/index.adoc`
    (also mention it in `:description:` / `:keywords:` if consistent with the page).
  - [x] Task 36.4. `backend/springboot/metrics-and-observability.adoc`: link `ai/spring-ai/observability.adoc`.
- [x] Task 37. Replace "planned Spring AI" prose with real xrefs in sibling pages (choice 8).
  - [x] Task 37.1. `grep -rniE "planned.*spring ai|spring ai.*planned|Spring AI sub-section"` under
    `modules/ROOT/pages`; rewrite each sentence, grep the target to confirm the claim, keep surrounding text intact
    (`ai/index.adoc`, and any hit in `ai/agents/*`, `ai/mcp/*`, `ai/langchain/*`, `database/*`).
  - Done: real xrefs in `ai/agents/index.adoc`, `ai/agents/frameworks-landscape.adoc`, `ai/mcp/building-clients.adoc` (-> `mcp-client.adoc`), `ai/langchain/langchain4j.adoc`, `database/vector-rag/index.adoc`; `ai/mcp/spring-boot-servers.adoc` now links `mcp-server.adoc` / `mcp-client.adoc`. Remaining grep hits are genuine (RAG Systems in Production still planned; Session API in the upgrade notes). Also fixed from Group 7 findings: Spring AI `spring.ai.openai.base-url` now includes `/v1` in `ai/local-llms/vllm-and-sglang.adoc`, `llama-cpp.adoc`, `desktop-runners.adoc` (DMR `/engines/v1`; the "reference uses exactly this shape" claim rewritten), stale "some pages of this guide" wording removed from `ai/spring-ai/local-models.adoc`; `ai/spring-ai/migration-1x-to-2x.adoc` links the cheat sheet and the version baseline.

### Group 9 — Build and verify

**Parallelizable: yes** (after Group 8; sub-tasks in order).

- [x] Task 38. Build and verify.
  - [x] Task 38.1. Run `npx antora antora-playbook.yml` on a clean `build/` (via an `iru-gate-runner` sub-agent
    invoking `iru-build-docs`). Must exit 0 with **0 errors and 0 warnings**.
    _Done: clean `build/`, exit 0, 0 errors, 0 warnings, 27 HTML files under `build/site/ai/spring-ai/`._
  - [x] Task 38.2. Run `npm run validate:mermaid` (installing `mermaid@11 jsdom` with `--no-save` if needed and
    restoring `node_modules/.package-lock.json`). All diagrams must parse.
    _Done: 663 site-wide diagrams parse (24 under `ai/spring-ai/`); package.json / package-lock.json unchanged._
  - [x] Task 38.3. Reachability: all 25 concept pages + `cheat-sheet.adoc` are `xref:`-linked from both
    `ai/spring-ai/index.adoc` and `nav.adoc`; `build/site/ai/spring-ai/` has 27 HTML files; every
    `ai-spring-ai-*.svg` is in `build/site/_images/`; the PDF is 1 A4 page; the vector-rag anchors still resolve.
    _Done: all 26 non-index pages xref'd from index and nav; 27 HTML; `ai-spring-ai-abstraction-layers.svg` in `_images/`; PDF 1 A4 page; 9 vector-rag anchors present in the built HTML._
  - [x] Task 38.4. Compile every Java snippet in the scratch project and fix mismatches.
    _Done: all 159 full Java classes from the 27 pages compiled in one union scratch project (Boot 4.1.1, Spring AI 2.0.1), 0 errors and 0 deprecation warnings after fixes; 51 of 57 non-live tests pass in the union project (the 6 others fail only on union scaffolding: bean-name clashes between alternative configs of different pages and a missing test CSV; they passed in the per-group projects). Fixed: `DocsRetriever` interface added to evaluation; `CachedDocsAnswers` injects `DocsTools` (production); `RagOrderTest` passes a store to `DocsTools` (bridge); `DocsAssistantApplication` introduced in prose (setup); Testcontainers 2 `org.testcontainers.postgresql.PostgreSQLContainer` (setup); `HttpStatus.CONTENT_TOO_LARGE` (multimodality, audio); `defaultTools(...)` instead of the deprecated `defaultToolCallbacks(...)` (migration; deprecation noted on chatmodel-and-chatclient). Verified with a runnable test that request `options(...)` replace client `defaultOptions(...)` while staying layered over the model's start-up options; migration-1x-to-2x now says so (chat-options and the cheat sheet already did, PDF unchanged)._
  - [x] Task 38.5. Grep checks: disclaimer include in all 27 files and no other admonition under `ai/spring-ai/`;
    book surnames appear only on `ai/spring-ai/index.adoc` (and `ai/index.adoc`); every content page has
    `== References` and a code example followed by an official link; no `xref:` in backticks; no empty-text fragment
    xrefs; no existing AI page called "planned"; no line-leading `20NN.`; no `\{` inside `----` blocks; no hardcoded
    secrets (`sk-`, `ghp_`, literal `Bearer`); every xref target exists; `/iru-check-security` clean.
    _Done: disclaimer in all 27 files, no other admonition; surnames removed from migration-1x-to-2x (titles instead); all 220 non-Mermaid code blocks followed by an official `Source:` link (added in 38.6); no backticked or empty-fragment xrefs, no "planned" existing page, no line-leading `20NN.`, no `\{` in blocks, all xref targets exist; `Bearer` hits are challenge headers / env-derived tokens. detect-secrets 1.5.0 ad hoc over the 46 branch files (plus the PDF text and cheat-sheet HTML), `.secrets.baseline` untouched: one finding, Base64 High Entropy String at setup-and-starters.adoc:365 (`POSTGRES_PASSWORD=dev-only-password` in compose.yaml), fixed by reading it from the environment / `.env`; re-scan clean._
  - [x] Task 38.6. **Self-review pass.** Delegate to fresh `general-purpose` sub-agents (pages in batches, in
    parallel). Each verifies every class / annotation / property / metric / URL against the official docs applying the
    "Lessons" list. Fix every real finding, rebuild, record the finding count.
    _Done: 7 parallel reviewers; 25 findings reported, 24 accepted and fixed (1 rejected: b3 removed the "spring-ai-session planned to replace ChatMemory in 2.1" statement, which the upgrade notes do make; restored with the citation). Fixes include: @Primary ChatModel needed for two model beans (chatmodel-and-chatclient, verified with ApplicationContextRunner); usage accumulation limited to ToolCallingAdvisor; spring.ai.retry.* only for RestClient providers (setup); local-models reasoning request lost keepAlive/numCtx because request options replace defaults; tool resolution fallback caveat (security); GitHub MCP default vs full toolset (mcp-client); cache-key sentence (production); conversation-id origin (bridge, migration); prose lines starting with digits (chat-options, migration, bridge); SVG desc/subtitle (5 layers, Model<Req,Res>); cheat sheet Testcontainers 2 non-generic PostgreSQLContainer; ~160 per-block `Source:` sentences added across all pages. Rebuilt clean; all 159 Java classes recompiled with 0 warnings._
  - [x] Task 38.7. Re-run the URL audit and re-check the PDF against the pages after the fixes.
    _Done: 229 URLs from branch-added content: 223 HTTP 200; the rest are non-browsable by design (XML namespace, GitHub MCP API endpoint needing a token, in-cluster DNS, `.example` host, one Packt page returning 403 to bots). PDF regenerated from the corrected HTML (headless Chrome): 1 page, A4 594.96 x 841.92 pt, 341611 bytes; its text matches the reviewed pages (options replace defaultOptions, tool fallback off, retry scope, session plan, MCP skew)._

### Group 10 — Integration-branch verification (required by #197 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; sub-tasks in order, after Group 9).

- [x] Task 39. Verify against the integration branch and compute merge readiness. (Done 2026-09-29 on 3d23e406: origin/feature/213-ai-section already an ancestor; clean build 0 errors / 0 warnings, 27 HTML pages, 663 Mermaid diagrams parsed; #205 merged via PR #218; whole-repo detect-secrets scan: no findings beyond the baseline; Merge readiness: READY.)
  - [x] Task 39.1. Commit on `feature/197`, then `git fetch origin` and merge the latest
    `origin/feature/213-ai-section` into `feature/197`. Do not push. Don't commit `.secrets.baseline`.
    * **Expected conflict points:** the `** xref:ai/index.adoc[AI]` block in `nav.adoc`, `ai/index.adoc`
      `== Sub-sections` / `== Books used in this section` / `:keywords:`, and the root `:keywords:`.
    * **How to resolve:** keep every sibling's entries, in the fixed sub-section order.
    * If nothing is new, record "already up to date".
  - [x] Task 39.2. Re-run the Antora build and Mermaid validation on the merged result via `iru-gate-runner`. Both
    must be clean.
  - [x] Task 39.3. Confirm prerequisite **#205** is merged into the integration branch:
    `git fetch origin && git branch -r --merged origin/feature/213-ai-section | grep -x "  origin/feature/205"`, or
    `gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`.
  - [x] Task 39.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-197.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #205 <✅ merged into feature/213-ai-section (PR #…) / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY: can be merged into feature/213-ai-section after human review
              | ⏳ WAIT: keep as draft until #205 is merged into feature/213-ai-section, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first". Note the post-merge chores: tick #197 in #213's
    *Progress* checklist and delete `feature/197`.
