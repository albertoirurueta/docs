# Implementation Plan: Guides & References / AI — "Model Context Protocol (MCP)"

## Task summary

Source: GitHub issue #206
Base branch: feature/213-ai-section

Issue [#206](https://github.com/albertoirurueta/docs/issues/206) adds sub-section 5 of 15 of the AI section,
**Model Context Protocol (MCP)**, at `modules/ROOT/pages/ai/mcp/`. It documents the **2026-07-28** revision of the
protocol (stateless core, `server/discover`, tools / resources / prompts, elicitation via Multi Round-Trip Requests,
Streamable HTTP with `Mcp-Method` / `Mcp-Name` headers, authorization) and builds **the same `docs-assistant` MCP
server three times**, once per stack, all passing one shared Inspector CLI test script:

* **Python** — `mcp` v2 `MCPServer`, the standalone FastMCP 4, and mounting in a FastAPI app
* **Java** — Spring Boot 4 with Spring AI 2 MCP starters (`@McpTool` / `@McpResource` / `@McpPrompt`)
* **TypeScript** — Node.js with `@modelcontextprotocol/server` + the Express adapter

It also covers clients and hosts (Claude Code, Claude Desktop, VS Code / Copilot, Copilot cloud agent), testing with
the MCP Inspector, deployment, tool-design rules, **exposing a RAG system through MCP**, and MCP security.

The sub-section ships:

* 17 pages: `index.adoc` (with `== Bibliography`), 15 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-mcp-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-mcp-disclaimer.adoc`
* the nav block (inserted between AI Agents and Running LLMs Locally)
* the `ai/index.adoc` "Model Context Protocol (MCP)" bullet (currently "(planned)") turned into a real `xref:`,
  `:keywords:` appended, and the MCP books added to `== Books used in this section`
* the root `pages/index.adoc` `:keywords:` appended
* cross-links from the 3 existing pages the issue names, plus the "planned MCP sub-section" prose in sibling AI
  pages turned into real `xref:`s (Group 6)

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography",
"Section-wide conventions" and "Branching, PR target and merge strategy" sections. Every page task must read its
page's bullets in the issue body (`gh issue view 206`) and cover **every** bullet.

**Out of scope** (per the issue): SDKs for C#, Go, Rust, Kotlin and Swift (link table only); MCP Apps UI
development (pointer only); general OAuth (already in `backend/oauth`).

### Merge constraints (from #206 → "Branching, PR target and merge strategy")

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main` only through
  collector issue #213's final integration PR.
* **Prerequisite: #205 (AI Agents) must already be merged into `feature/213-ai-section`.** It is confirmed merged
  (`b5bd29b0`, `.archive/implementation_plan_205.md`, `ai/agents/*` present on this branch). Re-verify at merge time
  per Group 8. Until every prerequisite is merged the PR stays a draft.
* **PR body:** uses `Refs #206` (never `Closes`) and carries the *Merge readiness* block (Group 8).
* **After merge:** tick #206 in #213's *Progress* checklist and delete `feature/206`.
* **Wave note:** #206 is Wave 3 (parallel with #204, #198, #197, #200); it unblocks #190, #208 and #212.

### Choices made on the user's behalf

1. **Ship everything in one pass**, as #202–#207 did.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet`
   and `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so `iru-code-one-task-group` implements them
   directly. Code inside the pages (Python / Java / TypeScript) is illustrative content, not built by this repo —
   but every example must still be checked (see "Lessons").
3. **Books appear only in `== Bibliography`.** The five requester-provided books (Lee, *Hugging Face in Action*;
   Albada, *Building Applications with AI Agents*; Mendelevitch & Bao, *Hands-On RAG for Production*; Polzer, *RAG
   with Python Cookbook*; Walls, *Spring AI in Action*) are never opened, copied or quoted from `~/Desktop/ai`;
   concepts are paraphrased and credited. The books predate the 2026-07-28 revision, and pages flag old behaviour
   (`initialize`, sessions, `FastMCP` naming, v1 SDK) in prose.
4. **Disclaimer:** `partials/ai-mcp-disclaimer.adoc` mirrors `partials/ai-agents-disclaimer.adoc` (single
   `[IMPORTANT]` block; anchor `xref:ai/mcp/index.adoc#_bibliography[bibliography]`). No other admonition anywhere
   under `ai/mcp/`; version notes, deprecations and security caveats are ordinary prose or table rows.
5. **Version baseline is verified against the registries and official docs at implementation time and dated**
   (PyPI: `mcp` 2.2.x, `fastmcp` 4.x, `fastapi-mcp`; npm: `@modelcontextprotocol/server|client|express`; Maven:
   Spring AI 2.0.x, MCP Java SDK 2.0.x). Reuse the AI section's existing baseline for everything else (Python 3.12,
   Java 21, Spring Boot 4.1, Ollama `llama3.1:8b` / `nomic-embed-text`, hosted models `claude-sonnet-5`,
   `claude-opus-5-5`, `claude-haiku-4-5`, `claude-fable-5-1`, `gpt-6-sol`). Node.js LTS is checked and stated on the
   index. The **Java SDK protocol-version skew** (2025-11-25 vs 2026-07-28) is verified and stated in prose on
   `spring-boot-servers.adoc` and the index; do not copy the issue's number blindly.
6. **Running example is the `docs-assistant` MCP server**, the MCP-facing side of the *DocsAssistant* scenario
   already used in `ai/llm-foundations/*`, `ai/agents/*` and `database/vector-rag/*`. Same data on all three stacks:
   tool `search_docs(query, component?, top_k)` with `outputSchema` + `structuredContent`; resource template
   `docs://{component}/{page}`; prompt `answer_with_citations`; an MRTR elicitation asking which component to search.
   One shared **contract test script** (`mcp-inspector --cli` calls) is shown once on `testing-and-debugging.adoc`
   and referenced by all three server pages. The vector store behind `search_docs` is the pgvector store of
   `database/vector-rag/postgresql-pgvector.adoc` (Python) and a Spring AI `VectorStore` (Java); the TypeScript
   server uses a stubbed in-memory index and says so.
7. **Existing AI pages get real `xref:`s; not-yet-built siblings stay plain prose.** Existing: `ai/llm-foundations`,
   `ai/ai-assisted-development`, `ai/customizing-ai-workflows` (esp. `mcp-configuration.adoc`), `ai/agents`
   (esp. `tool-design.adoc`, `agent-to-agent-protocol.adoc`, `agent-guardrails-and-safety.adoc`), `ai/local-llms`.
   Not yet existing (named in plain prose only): Building CLIs for AI Agents (#190), LangChain (#198), Spring AI
   (#197), Hugging Face (#200), RAG Systems in Production (#208), Conversational Channels (#209), Voice Agents
   (#210), LLMOps (#211), AI Security (#212). Existing site pages linked with real `xref:`: `backend/oauth/*`,
   `backend/springboot/rest-apis.adoc`, `backend/docker/*`, `database/vector-rag/*`,
   `database/neo4j/vector-search-and-genai.adoc`.
8. **ai-catalog:** the issue says "None" for ai-catalog, so no `ai-catalog::` xrefs are added.
9. **Sibling "planned MCP" prose gets updated.** Six existing pages say "the planned MCP sub-section"
   (`ai/ai-assisted-development/agent-mode.adoc:204`, `tool-landscape.adoc:165`,
   `ai/customizing-ai-workflows/mcp-configuration.adoc:17`, `ai/agents/index.adoc:35-36`,
   `ai/agents/tool-design.adoc:287,534`, `ai/agents/agent-to-agent-protocol.adoc:212`); each becomes a real `xref:`
   in Group 6, as the issue's "sibling lands later adds the missing xrefs back" rule requires.
10. **Diagrams:** ≥ 5 figures — SVG N×M vs N+M, Mermaid discover→list→call sequence, Mermaid auth flow, Mermaid
    REST+MCP in one FastAPI process, SVG RAG-behind-MCP — plus more where they clarify. Math via MathJax where a
    formula makes a concept precise (e.g. tool-definition token budget \( T = \sum_i (d_i + s_i) \) on
    `designing-good-mcp-servers.adoc`; load-balancer capacity on `deploying-remote-servers.adoc`).

### Lessons from the #202–#205 reviews — mandatory for every page task

**Verify every name against its official page before writing it**: every SDK class / decorator / method
(`MCPServer`, `@mcp.tool`, `streamable_http_app()`, `session_manager.run()`, `combine_lifespans`, `registerTool`,
`serveStdio()`, `@McpTool`, `@McpToolParam`, `spring.ai.mcp.server.protocol`), config key, CLI flag
(`claude mcp add --transport`, `mcp-inspector --cli --method tools/call`), protocol method / header / field
(`server/discover`, `subscriptions/listen`, `Mcp-Method`, `Mcp-Name`, `resultType`, `input_required`, `ttlMs`,
`cacheScope`), RFC number and error code. Sources: the spec at `modelcontextprotocol.io/specification/2026-07-28`,
each SDK's docs and source (installed package / sources jar), the Spring AI reference, host docs. If the docs don't
confirm a detail, describe the behaviour without naming it. Anything the books teach that the 2026-07-28 spec
removed (`initialize`, `Mcp-Session-Id`, `ping`, `logging/setLevel`, SSE resumability) is described only as history.

**Security is correctness.** No example hardcodes a secret; tokens come from env vars / secret stores. Every
destructive-tool example shows an approval gate and least privilege. Tool annotations are described as untrusted
hints. No token passthrough anywhere.

**Every concept gets at least one code example**, each followed by a link to the official page it derives from (that
URL also goes in `== References`). Raw JSON-RPC first for each primitive, then SDK code.

**Examples must be executed or type-checked where feasible**: run/parse the Python snippets against the real
`mcp` v2 / FastMCP / FastAPI packages (stubbed store), compile the TypeScript against the real npm packages, check
the Java/Spring snippets against the published sources jars. JSON-RPC examples are validated as JSON and against
the spec's schema shape.

**URL hygiene:** canonical URLs only, one URL per source reused consistently across pages.
**Cross-links accurate:** never call an existing page "planned"; grep the target before claiming it covers
something; no `xref:` inside backticks; no empty link text on a fragment xref.
**AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes; `{placeholders}` literal inside `[source]`
blocks, escaped (`\{x}`) in prose; no prose line starting with `<digits>.`; MathJax via `stem:`/`\( \)` per the
`:stem: latexmath` header on pages with formulas.
**Consistency:** model names, DocsAssistant models and the vector-rag scenario table match the rest of the AI
section.

## Current code state

* **Site structure.** The repo root is the Antora component `irurueta` (`antora.yml`), pages under
  `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`. The AI section (`nav.adoc` from line 1046) already contains
  `llm-foundations`, `ai-assisted-development`, `customizing-ai-workflows`, `agents` (`nav.adoc:1104`) and
  `local-llms` (`nav.adoc:1121`). The MCP block goes **immediately after** the last `agents` child
  (`**** xref:ai/agents/cheat-sheet.adoc[Cheat Sheet (PDF)]`) and before `*** xref:ai/local-llms/index.adoc[Running
  LLMs Locally]`.
* **`modules/ROOT/pages/ai/index.adoc`** has `== Sub-sections` with the bullet
  `* Model Context Protocol (MCP) -- exposing tools and resources to LLMs over a standard protocol. (planned)`
  (line 54), a `:keywords:` header already containing "MCP" and "byok"-style terms, and `== Books used in this
  section` listing Huyen, Alammar, Taulli, … with "Cited on …bibliography" xrefs per sub-section.
* **Partials:** `partials/ai-agents-disclaimer.adoc` is the template (`[IMPORTANT]` block, bibliography pointer).
  Existing SVG naming `images/ai-agents-*.svg`; PDFs `attachments/ai-agents-cheat-sheet.pdf`,
  `vector-rag-cheat-sheet.pdf`, `azure-cheat-sheet.pdf` are the visual references.
* **Tooling:** `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`); `npx antora antora-playbook.yml`; the
  `iru-build-docs` skill. The build runs with 0 errors / 0 warnings on the current branch (baseline to preserve).
* **Existing pages this sub-section links or edits:**
  * `database/vector-rag/agentic-rag.adoc`, `integrating-with-langchain.adoc`, `integrating-with-spring-ai.adoc`,
    `postgresql-pgvector.adoc` (mention MCP only in passing → get a link to `ai/mcp/rag-over-mcp.adoc`)
  * `backend/oauth/index.adoc` (one sentence → `ai/mcp/authorization.adoc`), `backend/oauth/discovery-metadata-and-client-registration.adoc`
    (mentions MCP; linked from the authorization page)
  * `backend/springboot/index.adoc` (`== What's covered`, bullet → `ai/mcp/spring-boot-servers.adoc`)
  * `backend/docker/*`, `backend/springboot/rest-apis.adoc`, `database/neo4j/vector-search-and-genai.adoc` (linked from)
  * the six sibling pages with "planned MCP" prose listed under choice 9.
* **No existing `ai/mcp/` files, no `implementation_plan.md`, no MCP SVGs or PDF.**

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, `:stem: latexmath` on any page using a
  formula, blank line, `include::partial$ai-mcp-disclaimer.adoc[]`.
* **Lead paragraph.** States the versions the page was written against, dated (choice 5).
* **Coverage.** Every bullet of the page's outline in the issue body, plus the page's figure floor. SVGs go in
  `modules/ROOT/images/ai-mcp-<topic>.svg` (`viewBox`, `font-family="Helvetica, Arial, sans-serif"`, flat light
  background, dark hex colours, no CSS variables, no external refs, legible in both themes). Every Mermaid block
  passes `npm run validate:mermaid`.
* **Three-stack examples** on concept pages where the stack applies (Python / Java / TypeScript), each followed by
  its official doc link; say explicitly where a stack lacks a feature (e.g. Java SDK protocol lag).
* **Running example.** Extend `docs-assistant` (choice 6); don't invent a second scenario.
* **Page ending.** `== References` (official docs, specs, RFCs, papers — never books).

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes** (two independent tasks).

- [x] Task 1. Create `modules/ROOT/partials/ai-mcp-disclaimer.adoc`. (Done: file created from the agents partial with only the anchor changed; no tests apply, license-header generation skipped, no code.)
  - [x] Task 1.1. Copy `partials/ai-agents-disclaimer.adoc`'s shape exactly; change only the anchor to
    `xref:ai/mcp/index.adoc#_bibliography[bibliography]` and the wording "This section's" if needed.
  - [x] Task 1.2. Every page uses `include::partial$ai-mcp-disclaimer.adoc[]` and no other admonition.
- [x] Task 2. Verify and record the version baseline (in the scratchpad, `versions-206.md`) that every later task
  cites. (Done 2026-09-29: baseline, spec/URL checks and three smoke-tested servers recorded in the scratchpad; contract script passes on Python, TypeScript and Spring Boot. Deviations from the issue are listed in `versions-206.md`.)
  - [x] Task 2.1. Read the current release numbers from PyPI (`mcp`, `fastmcp`, `fastapi-mcp`, `fastapi`,
    `langchain-mcp-adapters`), npm (`@modelcontextprotocol/server`, `client`, `express`, `hono`, `fastify`,
    `@modelcontextprotocol/inspector`, `zod`), Maven Central (Spring AI MCP starters, MCP Java SDK, Spring Boot,
    LangChain4j MCP) and state the date.
  - [x] Task 2.2. Verify the spec revision facts in the issue (2026-07-28 removals/additions/deprecations, RFC 9207,
    CIMD) against `modelcontextprotocol.io/specification/2026-07-28` and the release blog; verify the Java SDK's and
    Spring AI's supported protocol version; record any deviation from the issue.
  - [x] Task 2.3. Curl-check that every URL in the issue's Bibliography is canonical and reachable; record
    canonical forms (`curl -sI -L -o /dev/null -w '%{url_effective}'`).
  - [x] Task 2.4. Build and smoke-test a throw-away `docs-assistant` server in each stack in the scratchpad
    (Python, TypeScript, Spring Boot) with the stubbed store so later page examples are lifted from code that
    actually ran; write the shared Inspector CLI contract script and run it against all three.

### Group 2 — Protocol concepts

**Parallelizable: yes.** Four independent pages under `modules/ROOT/pages/ai/mcp/`; they may link each other, all
of which exist by Group 7.

- [x] Task 3. Create `architecture.adoc` ("MCP Architecture"). (Done 2026-09-29: `pages/ai/mcp/architecture.adoc`, 2 Mermaid diagrams validated; Python, Java and TypeScript client snippets compiled/run against the scratchpad servers; no tests apply to AsciiDoc.)
  - [x] Task 3.1. Cover hosts / clients / servers; JSON-RPC 2.0; the stateless core and `_meta` negotiation
    (protocol version, capabilities, client info per request); `server/discover`; the extensions framework (Tasks,
    MCP Apps, Skills-over-MCP); OTel trace context in `_meta`; what changed from the pre-2026 `initialize` /
    session design (history, prose only).
  - [x] Task 3.2. 📊 Mermaid sequence of discover → list → call. Raw JSON-RPC for each step, then a minimal
    Python / Java / TypeScript client-side snippet showing the same exchange, each with its official link.
- [x] Task 4. Create `primitives.adoc` ("Tools, Resources, Prompts & Elicitation"). (Done 2026-09-29: `pages/ai/mcp/primitives.adoc`; JSON-RPC captured from the running Python server; Python, Java and TypeScript tool/resource/prompt code lifted from servers that passed the contract script, TypeScript variant re-type-checked.)
  - [x] Task 4.1. Cover tools (`inputSchema` / `outputSchema` in JSON Schema 2020-12, `structuredContent`, `isError`
    vs protocol errors, annotations `readOnlyHint` / `destructiveHint` / `idempotentHint` / `openWorldHint` as
    untrusted), resources and URI templates, prompts, elicitation via MRTR (`resultType` `complete` vs
    `input_required`), cacheable list results (`ttlMs`, `cacheScope`), and the deprecated roots / sampling /
    logging with what to use instead.
  - [x] Task 4.2. Each primitive shown as raw JSON-RPC first, then the `docs-assistant` implementation in the
    stacks that support it; a table of primitive × who controls it × example.
- [x] Task 5. Create `transports.adoc` ("Transports"). (Done 2026-09-29: `pages/ai/mcp/transports.adoc`, 1 Mermaid diagram validated; curl transcript, `subscriptions/listen` stream and stdio exchange captured from the Python server.)
  - [x] Task 5.1. Cover stdio; Streamable HTTP (POST, `Mcp-Method` / `Mcp-Name` headers, `x-mcp-header`,
    `subscriptions/listen`); why the HTTP+SSE transport is deprecated; load balancing without sticky sessions.
  - [x] Task 5.2. A `curl` walkthrough against the local Python server (discover, list tools, call `search_docs`,
    the `input_required` round trip), with real captured headers/bodies.
- [x] Task 6. Create `authorization.adoc` ("Authorization"). (Done 2026-09-29: `pages/ai/mcp/authorization.adoc`, 1 Mermaid diagram validated; Spring Security, FastAPI and Express examples each run against test JWTs from a throwaway key and a local JWKS endpoint, 401/403/200 results recorded on the page.)
  - [x] Task 6.1. Cover OAuth 2.1 for remote servers; Protected Resource Metadata (RFC 9728); authorization-server
    metadata (RFC 8414); resource indicators (RFC 8707); CIMD vs DCR (DCR deprecated); RFC 9207 `iss` validation;
    audience binding and no token passthrough; Spring Authorization Server / Keycloak / Entra ID as the AS.
  - [x] Task 6.2. Link `backend/oauth/*` (authorization-code-and-pkce, discovery-metadata-and-client-registration,
    access-and-refresh-tokens, etc.) for fundamentals; document only what is MCP-specific. 📊 Mermaid auth flow.
  - [x] Task 6.3. Code: a Spring Security resource-server config, a FastAPI/`mcp` v2 token-verifier, and an Express
    bearer check for `docs-assistant`, each with its official link and an env-var-sourced issuer/audience.

### Group 3 — Building servers

**Parallelizable: yes.** Four independent pages.

- [x] Task 7. Create `python-servers.adoc` ("Python MCP Servers"). (Done 2026-09-29: `pages/ai/mcp/python-servers.adoc`; full `MCPServer` and FastMCP 4 listings run and passed `contract.sh` over stdio/HTTP; `uv run mcp dev` started the Inspector; migration facts checked against the v2 migration guide; no tests apply to AsciiDoc.)
  - [x] Task 7.1. Cover `mcp` v2 `MCPServer` (decorators `@mcp.tool`, `@mcp.resource`, `@mcp.prompt`; typed
    returns → `structuredContent`), `uv run mcp dev`, stdio and Streamable HTTP, the v1 `FastMCP` → `MCPServer`
    rename, and the standalone FastMCP 4 (PrefectHQ) and when to choose it. Full `docs-assistant` server listing.
- [x] Task 8. Create `python-fastapi-integration.adoc` ("MCP inside FastAPI"). (Done 2026-09-29: `pages/ai/mcp/python-fastapi-integration.adoc`; failing and fixed mounts, FastMCP `combine_lifespans`, `from_fastapi` / `fastapi-mcp` (separate venv) and the shared verifier + service run against real packages; lifespan pitfall reproduced as HTTP 500 `Task group is not initialized`; Mermaid validated.)
  - [x] Task 8.1. Cover the four integration options: (1) mount `streamable_http_app()` with the lifespan wired to
    `session_manager.run()` (the mounted-lifespan pitfall, with the failing and the fixed version); (2) FastMCP
    `http_app()` + `combine_lifespans`; (3) `FastMCP.from_fastapi()` / `fastapi-mcp` auto-generation from OpenAPI
    and why curated tools beat generated ones; (4) sharing auth and dependencies with the REST API.
  - [x] Task 8.2. 📊 Mermaid of one process serving REST + MCP. Run both mounts against real packages and confirm
    the lifespan pitfall reproduces as described.
- [x] Task 9. Create `spring-boot-servers.adoc` ("Spring Boot MCP Servers"). (Done 2026-09-29: `pages/ai/mcp/spring-boot-servers.adoc`; Boot 4.1.1 + Spring AI 2.0.1 server passed `contract.sh` (legacy era) in STREAMABLE and STATELESS; `@McpComplete`, `@Tool` bean exposure, ASYNC, stdio starter, Spring Security and the plain MCP Java SDK 2.0.1 each compiled and run separately.)
  - [x] Task 9.1. Cover the Spring AI 2.0 starters (`spring-ai-starter-mcp-server` stdio, `-webmvc`, `-webflux`),
    `spring.ai.mcp.server.protocol=STREAMABLE|STATELESS|SSE`, `type=SYNC|ASYNC`, `@McpTool` / `@McpToolParam` /
    `@McpResource` / `@McpPrompt` / `@McpComplete` scanning, exposing existing `@Tool` beans, Spring Security for
    the endpoint, the plain MCP Java SDK for non-Spring apps, and the protocol-version caveat (choice 5). Link
    `backend/springboot/rest-apis.adoc`.
- [x] Task 10. Create `nodejs-servers.adoc` ("Node.js MCP Servers"). (Done 2026-09-29: `pages/ai/mcp/nodejs-servers.adoc`; server, stdio and Express entry points `tsc --noEmit` clean and passed `contract.sh` (stdio 5/5, HTTP 6/6); ArkType Standard Schema variant run; v1 to v2 codemod run on a sample project and type-checked.)
  - [x] Task 10.1. Cover `@modelcontextprotocol/server` v2, `registerTool` with Zod / Standard Schema,
    `serveStdio()`, the Express adapter for Streamable HTTP, and migrating from the v1 `@modelcontextprotocol/sdk`.

### Group 4 — Clients, hosts, testing and deployment

**Parallelizable: yes.** Four independent pages.

- [x] Task 11. Create `building-clients.adoc` ("Building MCP Clients").
  - [x] Task 11.1. Cover Python (SDK client, `langchain-mcp-adapters` `MultiServerMCPClient`), Java (Spring AI
    `spring-ai-starter-mcp-client`, `ToolCallbackProvider`; the LangChain4j MCP client), TypeScript
    (`@modelcontextprotocol/client`), handling `input_required`, and connecting a local LLM agent (`ai/local-llms`)
    to MCP tools. Link `ai/agents/tool-design.adoc` and `ai/agents/agent-loop-and-architectures.adoc`.
- [x] Task 12. Create `connecting-hosts.adoc` ("Connecting Hosts").
  - [x] Task 12.1. Cover Claude Code (`claude mcp add --transport http|stdio`, scopes, `.mcp.json`,
    `MAX_MCP_OUTPUT_TOKENS`, `/mcp` OAuth login), Claude Desktop, VS Code / Copilot `mcp.json` with the `servers`
    key, Copilot cloud agent MCP config (`tools` allowlist, `COPILOT_MCP_` secrets, tools only), and pointers (plain
    prose) for Copilot Studio / M365 declarative agents (Conversational Channels) and ElevenLabs (Voice Agents).
    Link `ai/customizing-ai-workflows/mcp-configuration.adoc` and avoid duplicating it.
- [x] Task 13. Create `testing-and-debugging.adoc` ("Testing & Debugging").
  - [x] Task 13.1. Cover the MCP Inspector (web / `--cli` / `--tui`), a CI recipe using
    `--cli --method tools/call --format json`, the contract-test script shared by the three implementations
    (Task 2.4), logging to stderr / OTel, and common errors with fixes.
- [x] Task 14. Create `deploying-remote-servers.adoc` ("Deploying Remote Servers").
  - [x] Task 14.1. Cover containerising each server (link `backend/docker/*`), stateless scaling behind a load
    balancer, gateways routing on `Mcp-Method`, TLS, rate limits, the MCP Registry (preview) and `server.json`, and
    private registries. Include the capacity math with MathJax and a Dockerfile per stack.

### Group 5 — Design, RAG and security

**Parallelizable: yes.** Three independent pages.

- [x] Task 15. Create `designing-good-mcp-servers.adoc` ("Designing Good MCP Servers"). (Done 2026-09-29: page written from executed code -- Python server run through the Inspector CLI, TypeScript code-mode files type-checked with tsc 7.0.2 and run, Spring DesignTools compiled and run on Boot 4.1.1; token budget measured 497 vs 1047 tokens; Mermaid valid; detect-secrets clean.)
  - [x] Task 15.1. Cover tool design rules for LLMs (few well-described tools, concise / detailed modes,
    pagination, actionable errors, human-readable IDs), curated tools vs auto-generated OpenAPI wrappers, token cost
    of tool definitions (with the formula), and code-execution-with-MCP patterns. Link `ai/agents/tool-design.adoc`;
    name the CLI sub-section (#190) in plain prose.
- [x] Task 16. Create `rag-over-mcp.adoc` ("Exposing RAG through MCP"). (Done 2026-09-29: Python server, ACL, handles, LangGraph agent and Claude Code .mcp.json run; Spring ACL tool run with real RS256 tokens; pgvector SQL only syntax-checked with pglast, not executed; SVG rendered and checked; detect-secrets clean.)
  - [x] Task 16.1. Cover search / retrieve tools with `outputSchema`, document resources, a citation prompt,
    handles instead of sessions, ACL filters from the caller's identity, no sampling (the host LLM generates the
    answer), wiring to `database/vector-rag/postgresql-pgvector.adoc` (Python) and a Spring AI `VectorStore` (Java),
    consuming the result from Claude Code and a LangGraph agent. 📊 SVG `ai-mcp-rag-architecture.svg`.
  - [x] Task 16.2. Link (real xrefs) `database/vector-rag/agentic-rag.adoc`, `integrating-with-langchain.adoc`,
    `integrating-with-spring-ai.adoc`, `database/neo4j/vector-search-and-genai.adoc` (mcp-neo4j); name RAG Systems
    in Production (#208) in plain prose.
- [x] Task 17. Create `security.adoc` ("MCP Security"). (Done 2026-09-29: tracks the 2026-07-28 Security Best Practices page section by section; consent, token exchange, safe fetch, tool pinning, validation, approval gate and Docker sandbox examples all executed; detect-secrets clean.)
  - [x] Task 17.1. Cover confused deputy, token passthrough, SSRF, session hijacking, local-server compromise,
    tool poisoning and prompt injection via tool descriptions/results, least privilege, sandboxing local servers,
    input validation, human confirmation for destructive tools, and trusting third-party servers — tracking the
    official *Security Best Practices* exactly. Link `ai/agents/agent-guardrails-and-safety.adoc` and
    `ai/customizing-ai-workflows/security-of-customizations.adoc`; name AI Security (#212) in plain prose.

### Group 6 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task edits a distinct file and references only pages from Groups 1–5.

- [x] Task 18. Create `ai/mcp/index.adoc` ("Model Context Protocol (MCP)"). (Done 2026-09-29: `pages/ai/mcp/index.adoc` with N x M SVG `ai-mcp-n-times-m.svg` (rendered and checked), revision timeline, dated baseline, Java protocol-version skew, grouped What's covered, other-SDK table, five books from bibliographic metadata only, 148-URL Bibliography; audit `scratchpad/url_audit.py --net`: 0 missing, 0 duplicates, 0 redirects (3 oreilly.com 403s, documented as in the AI landing page). The audit also led to canonical-URL fixes in python-servers, python-fastapi-integration, designing-good-mcp-servers and connecting-hosts (gofastmcp.com welcome page, /docs/2026-07-28/develop/connect-*), and a `$\{workspaceFolder}` escape in connecting-hosts.)
  - [x] Task 18.1. Header, disclaimer and lead: why MCP exists (N×M problem), governance (Agentic AI Foundation,
    Linux Foundation), the spec revision timeline with a table of what changed in 2025-06-18 → 2025-11-25 →
    **2026-07-28**, and the dated version baseline (choice 5). 📊 SVG `ai-mcp-n-times-m.svg`.
  - [x] Task 18.2. `== What's covered`, grouped like the nav (Concepts / Building servers / Clients and hosts /
    Testing and deployment / Design and integration / Cheat sheet), each an `xref:` with a one-line summary; the
    `docs-assistant` running example described once; an "other SDK languages" link table (C#, Go, Rust, Kotlin,
    Swift) and a pointer to MCP Apps.
  - [x] Task 18.3. `== Bibliography` built after reading all page `== References` and inline links, grouped as
    the issue specifies: requester-provided books (full data, publisher page, official code repo where one exists,
    for all five), the specification sub-pages, other protocol pages, Python / Java / TypeScript / hosts /
    LangChain MCP docs, RFCs, reference servers, articles, and the house closing sentence (books are consulted
    references, not a primary source; official docs authoritative on discrepancy).
  - [x] Task 18.4. URL audit script: every URL cited anywhere under `ai/mcp/` is in `== Bibliography`, 0
    duplicates, 0 redirecting URLs.
- [x] Task 19. Create `ai/mcp/cheat-sheet.adoc` ("MCP Cheat Sheet"). (Done 2026-09-29: `pages/ai/mcp/cheat-sheet.adoc`.)
  - [x] Task 19.1. List what the sheet covers; cross-reference every page grouped like the nav; link the PDF via
    `xref:attachment$ai-mcp-cheat-sheet.pdf[Download the Model Context Protocol (MCP) Cheat Sheet (PDF)]`.
- [x] Task 20. Produce `modules/ROOT/attachments/ai-mcp-cheat-sheet.pdf`. (Done 2026-09-29: `attachments/ai-mcp-cheat-sheet.pdf`, 1 A4 page (594.96 x 841.92 pt, verified with fitz, no overflowing text), ~301 KB; HTML source kept in scratchpad `g6/cheat-sheet.html`.)
  - [x] Task 20.1. Print-ready HTML/CSS (dense, multi-column, colour-coded boxes, header line with version baseline
    + date, breadcrumb footer) visually consistent with `ai-agents-cheat-sheet.pdf` / `vector-rag-cheat-sheet.pdf`;
    only the PDF is checked in.
  - [x] Task 20.2. Content: the 2026-07-28 changes at a glance; message shapes; primitives table; transports; auth
    checklist; Python / Spring / Node server skeletons side by side; Inspector CLI commands; host config snippets
    (Claude Code, VS Code, Copilot cloud agent); tool-design rules; RAG-over-MCP pattern; security checklist.
  - [x] Task 20.3. Render via headless Chrome; verify with `fitz` that it is **exactly one A4 page**.
- [x] Task 21. Insert the nav block into `modules/ROOT/nav.adoc`. (Done 2026-09-29: block inserted in `nav.adoc` after the AI Agents cheat sheet entry and before Running LLMs Locally; 15 children in outline order plus Cheat Sheet (PDF); titles match page H1s.)
  - [x] Task 21.1. After `**** xref:ai/agents/cheat-sheet.adoc[Cheat Sheet (PDF)]` and before
    `*** xref:ai/local-llms/index.adoc[Running LLMs Locally]`, insert
    `*** xref:ai/mcp/index.adoc[Model Context Protocol (MCP)]` with 15 `****` children in the issue's outline order
    (architecture, primitives, transports, authorization, python-servers, python-fastapi-integration,
    spring-boot-servers, nodejs-servers, building-clients, connecting-hosts, testing-and-debugging,
    deploying-remote-servers, designing-good-mcp-servers, rag-over-mcp, security) and a final
    `**** xref:ai/mcp/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 22. Edit `modules/ROOT/pages/ai/index.adoc`. (Done 2026-09-29: `ai/index.adoc` bullet is a real xref; books extended with MCP-bibliography xrefs (Albada, Mendelevitch & Bao, Lee, Polzer, Walls); 44 new `:keywords:` terms.)
  - [x] Task 22.1. Replace the "(planned)" MCP bullet with a real `xref:ai/mcp/index.adoc[…]` bullet whose summary
    matches the real scope.
  - [x] Task 22.2. In `== Books used in this section`, add the five books (Lee, Albada if absent, Mendelevitch &
    Bao, Polzer, Walls) with publisher pages, or extend existing entries (Albada is already cited by
    `ai/agents`) with `xref:ai/mcp/index.adoc#_bibliography[MCP's bibliography]` links.
  - [x] Task 22.3. Append genuinely new terms to `:keywords:` (skip ones already present).
- [x] Task 23. Edit `modules/ROOT/pages/index.adoc` (root): append new `:keywords:` terms (FastMCP, MCPServer, (Done 2026-09-29: 44 new terms appended to root `pages/index.adoc` `:keywords:`, none duplicated.)
  Streamable HTTP, MRTR, MCP Inspector, server/discover, Spring AI MCP, CIMD, …), skipping duplicates.
- [x] Task 24. Add the cross-links the issue names. (Done 2026-09-29: agentic-rag, integrating-with-langchain, integrating-with-spring-ai, backend/oauth/index, backend/springboot/index.)
  - [x] Task 24.1. `database/vector-rag/agentic-rag.adoc`, `integrating-with-langchain.adoc`,
    `integrating-with-spring-ai.adoc`: one sentence each linking `xref:ai/mcp/rag-over-mcp.adoc[]`.
  - [x] Task 24.2. `backend/oauth/index.adoc`: one sentence linking `xref:ai/mcp/authorization.adoc[]`.
  - [x] Task 24.3. `backend/springboot/index.adoc`: a bullet in `== What's covered` linking
    `xref:ai/mcp/spring-boot-servers.adoc[]`.
- [x] Task 25. Replace "planned MCP sub-section" prose with real xrefs in the six sibling pages (choice 9): rewrite (Done 2026-09-29: six sibling pages, tool-design edited in two places; only the planned-MCP prose changed. The remaining "planned" mention in building-clients.adoc concerns the Spring AI sub-section.)
  the sentence, grep the target to confirm the claim, keep surrounding text intact, no other edits.
  - [x] Task 25.1. `ai/ai-assisted-development/agent-mode.adoc`, `tool-landscape.adoc`.
  - [x] Task 25.2. `ai/customizing-ai-workflows/mcp-configuration.adoc`.
  - [x] Task 25.3. `ai/agents/index.adoc`, `tool-design.adoc`, `agent-to-agent-protocol.adoc`.

### Group 7 — Build and verify

**Parallelizable: yes** (single task, after Group 6).

- [x] Task 26. Build and verify.
  - [x] Task 26.1. Run `npx antora antora-playbook.yml` on a clean `build/` (via an `iru-gate-runner` sub-agent
    invoking `iru-build-docs`). Must exit 0 with **0 errors and 0 warnings**.
  - [x] Task 26.2. Run `npm run validate:mermaid` (installing `mermaid@11 jsdom` with `--no-save` if needed and
    restoring `node_modules/.package-lock.json`). All diagrams must parse.
  - [x] Task 26.3. Reachability: all 15 pages + `cheat-sheet.adoc` are `xref:`-linked from both `ai/mcp/index.adoc`
    and `nav.adoc`; `build/site/ai/mcp/` has 17 HTML files; every `ai-mcp-*.svg` is in `build/site/_images/`; the
    PDF is 1 A4 page.
  - [x] Task 26.4. Grep checks: disclaimer include in all 17 files and no other admonition under `ai/mcp/`; book
    surnames appear only on `ai/mcp/index.adoc` (and `ai/index.adoc`); every content page has `== References` and a
    code example; no `xref:` in backticks; no empty-text fragment xrefs; no existing AI page called "planned"; no
    line-leading `20NN.`; no `\{` inside `----` blocks; no hardcoded secrets (`password`, `token`, `sk-`, `ghp_`,
    `Bearer <literal>`); every xref target exists; `/iru-check-security` clean.
  - [x] Task 26.5. **Self-review pass.** Delegate to fresh `general-purpose` sub-agents (15 pages in 3 batches of 5,
    in parallel). Each verifies every SDK / method / field / header / flag / URL against the official docs
    (WebFetch) applying the "Lessons" list. Fix every real finding, rebuild, record the finding count.
  - [x] Task 26.6. Re-run the Task 18.4 URL audit and re-check the PDF against the pages after the fixes.

### Group 8 — Integration-branch verification (required by #206 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; sub-tasks in order, after Group 7).

- [x] Task 27. Verify against the integration branch and compute merge readiness.
  - [x] Task 27.1. Commit on `feature/206`, then `git fetch origin` and merge the latest
    `origin/feature/213-ai-section` into `feature/206`. Do not push. Don't commit `.secrets.baseline`.
    * **Expected conflict points:** the AI block in `nav.adoc`, `ai/index.adoc` `== Sub-sections` /
      `== Books used in this section` / `:keywords:`, and the root `:keywords:`.
    * **How to resolve:** keep every sibling's entries, in the fixed sub-section order.
    * If nothing is new, record "already up to date".
  - [x] Task 27.2. Re-run the Antora build and Mermaid validation on the merged result via `iru-gate-runner`. Both
    must be clean.
  - [x] Task 27.3. Confirm prerequisite **#205** is merged into the integration branch:
    `git fetch origin && git branch -r --merged origin/feature/213-ai-section | grep -x "  origin/feature/205"`, or
    `gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`.
  - [x] Task 27.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-206.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #205 <✅ merged into feature/213-ai-section (PR #…) / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY: can be merged into feature/213-ai-section after human review
              | ⏳ WAIT: keep as draft until #205 is merged into feature/213-ai-section, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first". Note the post-merge chores: tick #206 in #213's
    *Progress* checklist and delete `feature/206`.
