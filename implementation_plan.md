# Implementation Plan: Guides & References / AI — "AI Agents"

## Task summary

Source: GitHub issue #205
Base branch: feature/213-ai-section

Issue [#205](https://github.com/albertoirurueta/docs/issues/205) adds sub-section 4 of 15 of the AI section,
**AI Agents**, at `modules/ROOT/pages/ai/agents/`. It is a **framework-neutral** guide to designing and building LLM
agents, explaining each concept once and showing it in three stacks:

* **LangGraph / LangChain 1.x** (Python)
* **LangChain4j** (Java, no Spring)
* **Spring AI** (Spring Boot)

plus an "In other frameworks" table (OpenAI Agents SDK, Claude Agent SDK, Microsoft Agent Framework, CrewAI) on
every concept page, and a dedicated `frameworks-landscape.adoc` comparing the full 2026 landscape (LangGraph, OpenAI
Agents SDK, Claude Agent SDK, Microsoft Agent Framework, CrewAI, smolagents, LangChain4j, Spring AI, Google ADK,
Mastra, Rig, …).

The framework-specific depth (every API, configuration and deployment detail) belongs to the **LangChain** (#198)
and **Spring AI** (#197) sub-sections, not here — this sub-section is the conceptual hub those link back to. MCP
(#206) and agentic RAG (`database/vector-rag/agentic-rag.adoc`, already published) are linked, not repeated.

The sub-section ships:

* 17 pages: `index.adoc` (with `== Bibliography`), 15 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-agents-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-agents-disclaimer.adoc`
* the nav block (inserted after Customizing AI Workflows, before Git & GitHub)
* the `ai/index.adoc` "AI Agents" bullet (currently "(planned)") turned into a real `xref:`, its `:keywords:`
  appended, and its Lanham/Albada bibliography lines re-pointed to this sub-section's own bibliography
* the root `pages/index.adoc` `:keywords:` appended
* cross-link sentences in the 2 existing pages the issue names under "What already exists in this repository":
  `database/vector-rag/agentic-rag.adoc`, `database/vector-rag/agent-memory-and-semantic-cache.adoc`
  (`database/redis/use-cases-and-patterns.adoc` and `database/neo4j/vector-search-and-genai.adoc` are already
  linked *from* those two pages, not separately from here — see Group 8), and
  `apps/apple/apple-intelligence-and-machine-learning.adoc`

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography" and
"Branching, PR target and merge strategy" sections. Every page task must read its page's bullets in
`gh issue view 205` (or the fetched body already in this conversation) and cover **every** bullet.

**Out of scope** (per the issue):

* framework API depth (LangChain #198, Spring AI #197 sub-sections)
* MCP server building (#206)
* agentic RAG internals (already covered by `database/vector-rag/*`)
* coding-agent customisation (#204, already merged)
* voice agents (#210, planned)

### Merge constraints (from #205 → "Branching, PR target and merge strategy")

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main` only through
  collector issue #213's final integration PR.
* **Prerequisite: #202 (LLM Foundations & Prompting) must already be merged** into `feature/213-ai-section` before
  this PR may itself be merged there. #202 is confirmed merged (its `implementation_plan_202.md` is archived, and
  `ai/llm-foundations/*` plus `partials/ai-disclaimer.adoc`/`ai-llm-foundations-disclaimer.adoc` are already present
  on `feature/213-ai-section`, which this branch forked from). Re-verify at merge time per Group 10.
* **PR body:** uses `Refs #205` and carries the *Merge readiness* block (Group 10).
* **After merge:** tick #205 in #213's *Progress* checklist and delete `feature/205`.
* **Wave note:** #205 is Wave 2 (parallel with #203 and #207); it unblocks #206, #198 and #197.

### Choices made on the user's behalf

1. **Ship everything in one pass** — all 17 pages, the PDF and the 3 cross-links go in together, as #202/#203/#204
   did.
2. **Books appear only in `== Bibliography`.** Requester-provided: Albada (*Building Applications with AI Agents*,
   the backbone), Lanham (*AI Agents in Action*, 1st ed.), Huyen (*AI Engineering*, Ch. 6 only). The 2nd edition of
   Lanham is listed as "newer edition, not consulted" per the issue. The PDFs in `~/Desktop/ai` are never opened,
   copied or quoted; concepts are paraphrased and credited, no verbatim text/code.
3. **Disclaimer:** `partials/ai-agents-disclaimer.adoc` mirrors the shape of
   `partials/ai-customizing-ai-workflows-disclaimer.adoc` (a single `[IMPORTANT]` block: the house AI-assistance
   disclosure + the bibliography pointer), anchored at
   `xref:ai/agents/index.adoc#_bibliography[bibliography]`. No other admonition may appear anywhere under
   `ai/agents/`.
4. **Tasks are untagged; no language/framework key applies** (`find .claude/skills -maxdepth 1 -type d
   -name "*-code-one-task"` → `java`, `java-springboot`, `dotnet`, `database`; none fit AsciiDoc/Mermaid/SVG/PDF
   authoring). All tasks are implemented directly by `iru-code-one-task-group`'s generic fallback, as #202/#203/#204
   were. Code *inside* the pages (Python/Java/Java+Spring snippets) is illustrative prose content, not compiled or
   tested by this repo.
5. **Framework version baseline reuses the one `ai/llm-foundations/index.adoc` already set**, for cross-sub-section
   consistency: Python 3.12, Java 21 with Spring Boot 4.1 / Spring AI 2.0.1, hosted models `claude-sonnet-5`,
   `claude-opus-5-5`, `claude-haiku-4-5`, `claude-fable-5-1`, and OpenAI's `gpt-6-*` line. Re-verify LangGraph/
   LangChain 1.x's and LangChain4j's current release numbers at implementation time (neither has a stated baseline
   in this repo yet — #205 sets it, and #198 "LangChain" will restate/narrow it later) and date the check, per
   `ai/llm-foundations/index.adoc`'s own "baseline is the one to trust if pages disagree" convention.
6. **Running scenario reuses *DocsAssistant*.** The same running example `ai/llm-foundations/*` and
   `database/vector-rag/*` already use, extended per the issue: it answers questions about this site, searches the
   docs (a tool), opens a GitHub issue when a page is wrong (a write action needing approval — the human-in-the-loop
   page's own worked example) and hands off to a "reviewer" agent (the multi-agent page's own worked example).
7. **The `ai-catalog::agents/overview.adoc` xref is real**, not plain prose. Verified present at
   `docs/modules/ROOT/pages/agents/overview.adoc` on ai-catalog `main`, commit `58fb70954404f9d539031a02ac6d4413f03745be`
   (same commit #204 pinned; re-verify it's still the tip at implementation time, or re-pin and note the new SHA
   consistently across every page that cites it).
8. **Existing AI pages get real `xref:`s; not-yet-built ones stay plain prose.** `ai/llm-foundations/*`,
   `ai/ai-assisted-development/*` and `ai/customizing-ai-workflows/*` all exist — link them with real `xref:`s where
   a concept page in this sub-section genuinely depends on one of theirs (e.g. context engineering →
   `ai/llm-foundations/context-engineering.adoc`; tool-calling mechanics →
   `ai/llm-foundations/structured-output-and-tool-calling.adoc`; subagents-as-orchestration →
   `ai/customizing-ai-workflows/subagents-and-custom-agents.adoc` and `orchestration-patterns.adoc`). Sub-sections
   that don't exist yet (MCP #206, LangChain #198, Spring AI #197, CLIs for AI Agents #190, RAG Systems #208,
   Voice Agents #210, LLMOps #211, AI Security #212) are named in plain prose only, per the issue's own "Sibling
   sub-sections" cross-link rule — this sub-section is itself a dependency several of them wait on, so most of
   those links point *forward* and cannot be real `xref:`s yet.
9. **Versions are re-verified at implementation time and dated "as of <date>".** The index lead and cheat sheet
   state the real MCP revision (issue says 2026-07-28), A2A version (v1.0, 2026-03-12) and the deprecations table
   (OpenAI Assistants API sunset 2026-08-26; AutoGen/Semantic Kernel → Microsoft Agent Framework GA 2026-04-03;
   Prompt flow retiring 2027-04-20) — confirm each date is still accurate, don't just copy the issue's numbers
   blind.

### Lessons from the #202/#203/#204 reviews — mandatory for every page task

**Verify every name against its official page before writing it.** Every framework method/class name, config key,
CLI flag, protocol field (A2A Agent Card fields, MCP method names), and model ID. Sources: the framework docs listed
in the issue's own Bibliography section (LangChain/LangGraph docs, LangChain4j docs, Spring AI docs, OpenAI Agents
SDK docs, Claude Agent SDK docs, Microsoft Agent Framework docs, CrewAI docs, smolagents docs), the A2A and MCP
specifications, and the Anthropic engineering articles. Never invent a method/field name; if the docs don't confirm
a detail, describe the behaviour without naming it.

**Security is correctness.** No committed example may hardcode a secret (API key, token). Tool-design and
guardrails pages especially: every "write action" example (the DocsAssistant "open a GitHub issue" tool) must show
least-privilege scoping and an approval gate, not an ambient credential.

**Every concept bullet gets at least one example**, in the frameworks that support it, each followed by a link to
its official page — that URL also goes in the page's `== References`.

**URL hygiene.** Canonical URLs only (`curl -sI -L -o /dev/null -w '%{url_effective}' <url>`), one URL per source
reused consistently across pages.

**Cross-links must be accurate.** Never call an existing page "planned"; grep the target page before claiming it
covers something. No `xref:` inside backticks. No empty link text on a fragment xref.

**Examples must be self-consistent.** A LangGraph `StateGraph` example's state schema must match what later steps
of the same example read/write. A LangChain4j `@Tool`/Spring AI `@Tool` signature must be valid for that
framework's current tool-calling contract. An A2A Agent Card JSON example must be schema-valid per the spec.

**AsciiDoc hygiene.** `.Title` caption lines. No leaked authoring notes. `{placeholders}` literal inside
`[source]` blocks; backtick + escape (`\{x}`) in prose. No prose line starting with `<digits>.`.

**Consistency.** Model names match `ai/llm-foundations/*`: `claude-sonnet-5`, `claude-opus-5-5`, `claude-haiku-4-5`,
`claude-fable-5-1`, `gpt-6-sol` (and siblings). DocsAssistant's embedding/chat models match the vector-rag section's
scenario table (do not invent new ones for this sub-section).

## Current code state

**Base branch.** `feature/213-ai-section` (HEAD `4b31e238`, already includes `main` and #202/#203/#204) holds:

* #202: `ai/index.adoc`, `ai/llm-foundations/*` (17 files), `partials/ai-disclaimer.adoc`,
  `partials/ai-llm-foundations-disclaimer.adoc`
* #203: `ai/ai-assisted-development/*` (17 files), `partials/ai-ai-assisted-development-disclaimer.adoc`
* #204: `ai/customizing-ai-workflows/*` (17 files), `partials/ai-customizing-ai-workflows-disclaimer.adoc`

There is no `ai/agents/` directory yet.

**`modules/ROOT/nav.adoc`.**

* The AI block's `customizing-ai-workflows` sub-block ends with
  `**** xref:ai/customizing-ai-workflows/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
* The next line is `** xref:git-and-github/index.adoc[Git & GitHub]`.
* The new `*** xref:ai/agents/index.adoc[AI Agents]` block, with its 15 `****` children plus a `****` cheat-sheet
  line, goes between them (sub-section 4, per the mandated fixed order).
* Match on the text, not line numbers (currently 1093/1094 at planning time — will shift as siblings land).

**`modules/ROOT/pages/ai/index.adoc`.**

* `== Sub-sections` (around line 50) has the plain bullet:
  `* AI Agents -- agent loops, planning, tool use and multi-agent orchestration. (planned)`
  → becomes an `xref:` bullet with a real one-line summary, in place at the same position (4th bullet).
* `== Books used in this section` (around lines 87–92) cites Lanham and Albada with
  "Will be cited by the planned AI Agents sub-section" — both sentences get rewritten to link
  `xref:ai/agents/index.adoc#_bibliography[AI Agents' bibliography]` now that this sub-section actually cites them.
* Header `:keywords:` (line 3) gets this sub-section's terms appended (skip any already present, e.g. "agents",
  "AI agents" already appear).

**`modules/ROOT/pages/index.adoc`** (root). `:keywords:` on line 3 already contains "AI agents" (from the
vector-rag section) — append only genuinely new terms from this sub-section (A2A, MCP vs. A2A, ReAct,
reflection, multi-agent, behaviour trees, MAESTRO, etc.), skipping duplicates.

**Cross-link targets, all confirmed present:**

* `modules/ROOT/pages/database/vector-rag/agentic-rag.adoc` — link `ai/agents/index.adoc` (one sentence).
* `modules/ROOT/pages/database/vector-rag/agent-memory-and-semantic-cache.adoc` — link `ai/agents/memory.adoc` (one
  sentence).
* `modules/ROOT/pages/apps/apple/apple-intelligence-and-machine-learning.adoc` (Foundation Models tool calling) —
  link `ai/agents/tool-design.adoc` (one sentence).

**External xref target confirmed on `ai-catalog` `main`** (cloned read-only to
`/home/user/albertoirurueta/ai-catalog` for verification, commit `58fb70954404f9d539031a02ac6d4413f03745be`):
`docs/modules/ROOT/pages/agents/overview.adoc` exists → `xref:ai-catalog::agents/overview.adoc[]` is safe to use for
the multi-agent page's "orchestrator/worker isolation" example. Also present on that commit for optional citation:
`agents/iru-gate-runner.adoc`, `agents/iru-isolated-skill-executor.adoc`, and skills `iru-issue`, `iru-plan`,
`iru-code`, `iru-code-one-task-group`, `iru-check-security`, `iru-generate-skill-docs`.

**Shapes to mirror.** `ai/customizing-ai-workflows/*.adoc` and `ai/llm-foundations/*.adoc`: header (`= Title`,
`:description:`, `:keywords:`, optional `:stem: latexmath`, blank line, disclaimer include), dated lead paragraph
stating the version baseline, `==` concept sections, `== References`. The sub-section landing page
(`ai/customizing-ai-workflows/index.adoc`) has `== What's covered` (grouped like the nav) and a grouped
`== Bibliography` (Requester-provided books / Official documentation / Specifications and standards / Papers and
engineering articles), written *after* all sibling pages exist. The cheat-sheet page has grouped back-links, the
`xref:attachment$…pdf` download line, and its own `== References`.

**Tooling.**

* `npx antora antora-playbook.yml` — the build gate.
* `npm run validate:mermaid`, after `npm i --no-save mermaid@11 jsdom` (restore
  `node_modules/.package-lock.json` afterward — these two packages are deliberately not vendored).
* Headless Chrome (print-ready HTML/CSS → PDF) plus PyMuPDF (`fitz`) to verify the rendered PDF is exactly 1 A4
  page, matching the `vector-rag-cheat-sheet.pdf`/`azure-cheat-sheet.pdf` visual style.
* The `iru-gate-runner` agent for running the build/validation steps out of the main context.

**Precedents.** `.archive/implementation_plan_202.md` and `.archive/implementation_plan_204.md` (read in full for
this plan) — structurally closest since both are recent AI-section siblings on the same integration branch with the
same disclaimer/cheat-sheet/PDF/nav/bibliography conventions.

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, `:stem: latexmath` on any page using a
  formula (e.g. cost/latency estimates on `frameworks-landscape.adoc`, or a bandit formula on
  `learning-and-improvement.adoc`), blank line, `include::partial$ai-agents-disclaimer.adoc[]`.
* **Lead paragraph.** States the dated version baseline (choice 5) and the pinned ai-catalog commit where the page
  cites it.
* **Coverage.** Cover every bullet of the page's outline in the issue body, and meet the 📊 floor stated per page
  (a floor, not a ceiling).
  * SVGs go in `modules/ROOT/images/ai-agents-<topic>.svg`: `viewBox`, `font-family="Helvetica, Arial, sans-serif"`,
    flat light background, dark hex colours, no CSS variables, no external refs, text fits the viewBox, legible in
    both themes.
  * Mermaid blocks must pass `npm run validate:mermaid`.
* **Three-stack examples.** Every concept shows LangGraph, LangChain4j and Spring AI where the framework supports
  the concept — say so explicitly where one doesn't (e.g. A2A support varies). Each followed by its official doc
  link. End with an "In other frameworks" table: OpenAI Agents SDK, Claude Agent SDK, Microsoft Agent Framework,
  CrewAI.
* **Running scenario.** Every code example extends *DocsAssistant* (choice 6) — reuse its existing corpus/model
  choices from the vector-rag section's scenario table; don't invent new ones.
* **ai-catalog excerpt pattern** (where cited, e.g. the multi-agent orchestrator/worker example): name the pinned
  file, give a short paraphrased excerpt, say what it demonstrates, then generalise it.
* **Page ending.** `== References` (official docs, specs, papers only — never books).
* **Math.** MathJax (`\( \)` / `\[ \]`) for sampling/cost/latency/memory-sizing/metric formulas where one makes a
  concept precise (e.g. context-budget-per-step arithmetic, an evaluation metric, a Bayesian-bandit update rule).

## Implementation steps

### Group 1 — Scaffolding

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/ai-agents-disclaimer.adoc`.
  - [x] Task 1.1. Copy `partials/ai-customizing-ai-workflows-disclaimer.adoc`'s shape exactly (single `[IMPORTANT]`
    block: house AI-assistance disclosure sentence + bibliography pointer). Change only the anchor to
    `xref:ai/agents/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Every later page in this sub-section uses
    `include::partial$ai-agents-disclaimer.adoc[]` and no other admonition.

### Group 2 — Agent loop and architectures

**Parallelizable: yes.** Two independent pages (Tasks 2–3), both under `modules/ROOT/pages/ai/agents/`.

- [x] Task 2. Create `agent-loop-and-architectures.adoc` ("Agent Loop & Architectures").
  - [x] Task 2.1. Cover: the agent loop (perceive → reason → act → observe); reflex agents; **ReAct**;
    plan-and-execute; query decomposition; **reflection / Reflexion**; deep research. Cite ReAct
    (https://arxiv.org/abs/2210.03629) and Reflexion (https://arxiv.org/abs/2303.11366).
  - [x] Task 2.2. Cover ToT (https://arxiv.org/abs/2305.10601) and self-consistency
    (https://arxiv.org/abs/2203.11171) as reasoning aids layered onto any of the above patterns, not
    standalone architectures.
  - [x] Task 2.3. For each pattern: a small 📊 Mermaid diagram plus a LangGraph `StateGraph` example (DocsAssistant
    answering a question, escalating through more of the loop as the pattern requires), each followed by
    https://docs.langchain.com/oss/python/langchain/agents and https://docs.langchain.com/oss/python/releases/langgraph-v1
    (verify current). Add the LangChain4j and Spring AI equivalents where those frameworks expose them explicitly
    (verify — LangChain4j's `AiServices`/agentic workflow support, Spring AI's `ChatClient` advisor chain); otherwise
    say so.
  - [x] Task 2.4. "In other frameworks" table.
- [x] Task 3. Create `workflow-patterns.adoc` ("Workflow Patterns").
  - [x] Task 3.1. Cover the 5 Anthropic "Building effective agents" patterns: prompt chaining, routing,
    parallelisation, orchestrator-workers, evaluator-optimizer. Cite
    https://www.anthropic.com/engineering/building-effective-agents.
  - [x] Task 3.2. Each pattern in LangGraph, LangChain4j "agentic workflows"
    (https://docs.langchain4j.dev/tutorials/agents/), and Spring AI's own effective-agents examples
    (https://docs.spring.io/spring-ai/reference/api/effective-agents.html,
    https://github.com/spring-projects/spring-ai-examples/tree/main/agentic-patterns).
  - [x] Task 3.3. Distinguish this page from `agent-loop-and-architectures.adoc` explicitly in the lead: workflows
    here are composable, mostly-deterministic pipelines; Task 2's patterns are how a single agent step reasons.
    Cross-reference both directions.

### Group 3 — Tools and context

**Parallelizable: yes.** Two independent pages (Tasks 4–5).

- [x] Task 4. Create `tool-design.adoc` ("Tool Design").
  - [x] Task 4.1. Function-calling mechanics: schema, parallel calls, tool results. Link
    `ai/llm-foundations/structured-output-and-tool-calling.adoc` (exists — real `xref:`).
  - [x] Task 4.2. Tool design for agents: narrow and typed; concise vs. detailed responses; pagination; actionable
    errors; namespacing; human-readable IDs. Cite
    https://www.anthropic.com/engineering/writing-tools-for-agents.
  - [x] Task 4.3. Stateful tools with least privilege (narrow parameterised operations instead of raw SQL/shell,
    validation, logging) and automated tool generation from OpenAPI.
  - [x] Task 4.4. Semantic (embedding retrieval over tool descriptions) and hierarchical tool selection, for
    agents with many tools.
  - [x] Task 4.5. Write-action safety: the DocsAssistant "open a GitHub issue" tool as the running least-privilege,
    approval-gated example (forward-reference `human-in-the-loop.adoc` for the approval-gate mechanics).
  - [x] Task 4.6. `@tool` (LangChain), `@Tool` (LangChain4j, Spring AI) syntax, each followed by its official page.
  - [x] Task 4.7. Add cross-links: `xref:database/vector-rag/agentic-rag.adoc[]` (retriever-as-tool) and, once it
    exists later in this task (Group 8), a matching sentence added *to* that page. Link
    `xref:apps/apple/apple-intelligence-and-machine-learning.adoc[]` as an on-device tool-calling example (real
    `xref:`, confirmed present).
- [x] Task 5. Create `context-engineering-for-agents.adoc` ("Context Engineering for Agents").
  - [x] Task 5.1. Cover: the context budget per step; summarisation and compaction; structured scratchpads and
    notes; sub-agent isolation; just-in-time tool results.
  - [x] Task 5.2. Cover how LangChain middleware supports this (summarisation middleware — verify current API name
    against https://docs.langchain.com/oss/python/langchain/agents).
  - [x] Task 5.3. Link `xref:ai/llm-foundations/context-engineering.adoc[]` (exists) explicitly and distinguish scope:
    that page covers single-turn/single-call context engineering; this page covers it across an agent's multi-step
    loop.

### Group 4 — Memory and planning

**Parallelizable: yes.** Two independent pages (Tasks 6–7).

- [x] Task 6. Create `memory.adoc` ("Memory").
  - [x] Task 6.1. Cover: short-term vs. long-term memory; working, semantic, episodic and procedural memory;
    extraction, compression and experience memory.
  - [x] Task 6.2. LangGraph checkpointers (thread state) and stores (cross-thread) — verify current API against
    https://docs.langchain.com/oss/python/langgraph/persistence.
  - [x] Task 6.3. LangChain4j `ChatMemory`/`ChatMemoryStore`; Spring AI `ChatMemory`,
    `MessageWindowChatMemory`, `ChatMemoryRepository`, and memory tools — verify against
    https://docs.spring.io/spring-ai/reference/.
  - [x] Task 6.4. Privacy and retention (a short prose subsection, no admonition).
  - [x] Task 6.5. 📊 Mermaid of the memory taxonomy.
  - [x] Task 6.6. Cross-links: `xref:database/vector-rag/agent-memory-and-semantic-cache.adoc[]` (vector-backed
    memory/semantic cache — that page in turn links `database/redis/use-cases-and-patterns.adoc`, not duplicated
    here) and, once RAG Systems (#208, planned) exists, note in prose that conversational memory is also covered
    there — for now name it in plain prose only (choice 8).
- [x] Task 7. Create `planning.adoc` ("Planning").
  - [x] Task 7.1. Sequential vs. stepwise planning; re-planning on failure.
  - [x] Task 7.2. **Behaviour trees** and back-chaining: selector, sequence, condition, action node types; tick
    semantics; agentic behaviour trees.
  - [x] Task 7.3. Reasoning models as planners — link `xref:ai/llm-foundations/reasoning-models.adoc[]` (exists).
  - [x] Task 7.4. Failure modes: planning, tool and efficiency failures (from Huyen Ch. 6 — paraphrased, not
    quoted).
  - [x] Task 7.5. 📊 SVG `ai-agents-behaviour-tree.svg` of a behaviour tree.

### Group 5 — Multi-agent

**Parallelizable: yes.** Two independent pages (Tasks 8–9).

- [x] Task 8. Create `multi-agent-systems.adoc` ("Multi-Agent Systems").
  - [x] Task 8.1. When to add agents (vs. a single agent with more tools); how many agents.
  - [x] Task 8.2. Topologies: supervisor/manager, hierarchical, handoffs/swarm, democratic, actor-critic. 📊
    Mermaid per topology.
  - [x] Task 8.3. Shared vs. isolated state; message brokers and actor frameworks (Ray, Orleans, Akka) and workflow
    engines for distributed agents (survey-level, not a deployment guide).
  - [x] Task 8.4. LangGraph supervisor/handoffs; the LangChain4j supervisor agent; Spring AI subagents — verify
    each against current docs.
  - [x] Task 8.5. Worked example: DocsAssistant hands off to a "reviewer" agent (choice 6) — a supervisor topology,
    shown in LangGraph. Cite `xref:ai-catalog::agents/overview.adoc[]` (confirmed present, choice 7) as a real
    coding-agent example of orchestrator/worker isolation, pinned to commit `58fb709…`.
- [x] Task 9. Create `agent-to-agent-protocol.adoc` ("Agent-to-Agent Protocol (A2A)").
  - [x] Task 9.1. A2A v1.0 (2026-03-12): Agent Card and discovery at `/.well-known/agent-card.json`; tasks,
    messages and artifacts; streaming and push notifications; signed Agent Cards. Cite
    https://a2a-protocol.org/latest/specification/ and https://github.com/a2aproject/A2A.
  - [x] Task 9.2. MCP (agent ↔ tool) vs. A2A (agent ↔ agent) — a short comparison table. Note both are under the
    **Agentic AI Foundation (Linux Foundation)**; cite
    https://www.linuxfoundation.org/press/linux-foundation-announces-the-formation-of-the-agentic-ai-foundation.
    Name the planned MCP sub-section (#206) in plain prose (choice 8).
  - [x] Task 9.3. A Python A2A server example (framework-agnostic core loop) and a Spring AI A2A integration
    example — verify Spring AI's actual current A2A support before claiming an API; if none exists yet, say so
    plainly and show the protocol-level HTTP/JSON-RPC shape instead.
  - [x] Task 9.4. 📊 Mermaid sequence diagram (client agent → Agent Card discovery → task → message → artifact).

### Group 6 — Humans and quality

**Parallelizable: yes.** Five independent pages (Tasks 10–14).

- [x] Task 10. Create `human-in-the-loop.adoc` ("Human-in-the-Loop").
  - [x] Task 10.1. Approval gates for write actions — the DocsAssistant "open a GitHub issue" tool as the worked
    example (pays off Task 4.5's forward reference).
  - [x] Task 10.2. Interrupt/resume: LangGraph `interrupt` (verify current signature against
    https://docs.langchain.com/oss/python/langchain/human-in-the-loop), LangChain HITL middleware, and the
    LangChain4j/Spring AI equivalents (verify whether either has a first-class HITL primitive; if not, show the
    manual pattern — persisted state + a pending-approval flag).
  - [x] Task 10.3. Escalation thresholds and uncertainty routing; the autonomy slider (from Albada Ch. 3, 13 —
    paraphrased): manual → suggest → act.
  - [x] Task 10.4. 📊 Mermaid of interrupt → approve → resume.
- [x] Task 11. Create `agent-evaluation.adoc` ("Agent Evaluation").
  - [x] Task 11.1. Component vs. end-to-end evals; trajectory evaluation; tool-call accuracy.
  - [x] Task 11.2. LLM-as-judge rubrics; eval datasets; regression suites.
  - [x] Task 11.3. Link `xref:database/vector-rag/index.adoc[]`'s DocsAssistant scenario as what's being evaluated;
    name the planned LLMOps & Evaluation sub-section (#211) in plain prose for the operational/monitoring side
    (choice 8) — this page covers *offline* agent-specific evaluation only.
- [x] Task 12. Create `agent-guardrails-and-safety.adoc` ("Agent Guardrails & Safety").
  - [x] Task 12.1. The agent threat table from Albada Ch. 12 (paraphrased): direct/indirect prompt injection,
    jailbreaks, data leakage, multi-agent exploitation.
  - [x] Task 12.2. **MAESTRO** threat modelling (cite, verify URL:
    https://cloudsecurityalliance.org/blog/2025/02/06/agentic-ai-threat-modeling-framework-maestro).
  - [x] Task 12.3. OWASP Top 10 for Agentic Applications — a pointer, not a reproduction. Cite
    https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/.
  - [x] Task 12.4. Safeguards: policy layer, sandboxing, rate limits, budgets, audit trails, kill switches — link
    back to `tool-design.adoc`'s least-privilege section rather than repeating it.
  - [x] Task 12.5. Name the planned AI Security & Responsible AI sub-section (#212) in plain prose as where the
    broader (non-agent-specific) security/responsible-AI material lives (choice 8).
- [x] Task 13. Create `agent-ux.adoc` ("Agent UX").
  - [x] Task 13.1. Sync vs. async UX; streaming intermediate steps.
  - [x] Task 13.2. Communicating confidence and uncertainty; asking for guidance; graceful failure; trust
    calibration (from Albada Ch. 3 — paraphrased).
  - [x] Task 13.3. Proactive vs. intrusive agent behaviour.
  - [x] Task 13.4. Name the planned Conversational Channels sub-section (#209) in plain prose for the AG-UI
    protocol pointer (choice 8) — do not fabricate an `xref:` to it.
- [x] Task 14. Create `observability-for-agents.adoc` ("Observability for Agents").
  - [x] Task 14.1. Traces and spans per agent step; OTel GenAI semantic conventions for agents and tools (verify
    the current convention names before citing them).
  - [x] Task 14.2. LangSmith/Langfuse/Phoenix for LangGraph; Spring AI Micrometer observations — verify against
    current Spring AI docs.
  - [x] Task 14.3. Shadow deploys and canaries (survey-level).
  - [x] Task 14.4. Name the planned LLMOps & Evaluation sub-section (#211) in plain prose as where the full
    production-operations material lives (choice 8).

### Group 7 — Landscape and learning

**Parallelizable: yes.** Two independent pages (Tasks 15–16).

- [x] Task 15. Create `frameworks-landscape.adoc` ("The 2026 Agent Frameworks Landscape").
  - [x] Task 15.1. Comparison table — columns: Framework | Language | Paradigm | State/persistence | Multi-agent |
    MCP/A2A support | Status. Rows: LangGraph 1.x, LangChain `create_agent`, OpenAI Agents SDK, Claude Agent SDK,
    Microsoft Agent Framework 1.x, CrewAI, smolagents, Google ADK, LangChain4j, Spring AI, Mastra, Rig (Rust).
    Verify every cell against each framework's own current docs (list in the issue's Bibliography) — do not guess a
    status or version.
  - [x] Task 15.2. Deprecation box **in prose** (choice: admonitions are disclaimer-only, so this must be an
    ordinary paragraph or table row, never `[NOTE]`/`[WARNING]`): OpenAI Assistants API (sunset 2026-08-26,
    migration https://developers.openai.com/api/docs/assistants/migration), AutoGen/Semantic Kernel →
    Microsoft Agent Framework (GA 2026-04-03, https://devblogs.microsoft.com/agent-framework/), Prompt flow
    (retiring 2027-04-20). Re-verify each date.
  - [x] Task 15.3. Guidance on choosing a framework (a short decision-factors list, not a recommendation of one).
  - [x] Task 15.4. Cite Google ADK (https://google.github.io/adk-docs/ — issue flags "verify") — confirm the URL
    resolves before citing it as-is.
- [x] Task 16. Create `learning-and-improvement.adoc` ("Learning & Improvement").
  - [x] Task 16.1. Non-parametric learning: few-shot exemplars, Reflexion memories (link back to
    `agent-loop-and-architectures.adoc`'s Reflexion section rather than re-explaining it).
  - [x] Task 16.2. Parametric learning: SFT, DPO, RLVR — a pointer to Hugging Face fine-tuning (name the planned
    Hugging Face & On-Device Models sub-section, #200, in plain prose; choice 8).
  - [x] Task 16.3. Feedback loops; Bayesian bandits for prompt/tool selection — a small MathJax sketch of a
    Thompson-sampling update as the "math makes a concept precise" example (`:stem: latexmath` on this page's
    header).

### Group 8 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task edits a distinct file; each references only pages from Groups 1–7.

- [x] Task 17. Create `ai/agents/index.adoc` ("AI Agents").
  - [x] Task 17.1. Header, disclaimer, lead: what an agent is; **workflows vs. agents, and when *not* to build an
    agent** (the issue's explicit framing — this must be stated plainly, not buried); the five-component model
    (model, tools, memory, orchestration — per Albada Ch. 1–2, generalised with Lanham's five-component framing);
    the autonomy ladder; the verified version baseline (choice 5) and pinned ai-catalog commit.
  - [x] Task 17.2. 📊 SVG `ai-agents-components.svg` of the five-component model.
  - [x] Task 17.3. `== What's covered`, grouped like the nav (Foundations / Tools and context / Memory and planning
    / Multi-agent / Humans and quality / Landscape / Cheat sheet), each an `xref:` with a one-line summary.
  - [x] Task 17.4. `== Bibliography`, built *after* reading all 15 sibling pages' `== References` plus inline
    links, grouped as the issue specifies:
    * **Requester-provided books**: Albada (full bibliographic data, publisher page, code repo
      https://github.com/michaelalbada/BuildingApplicationsWithAIAgents); Lanham 1st ed. (full data, publisher
      page, code repos — 3 GitHub links per the issue) plus the 2nd-edition line marked "newer edition, not
      consulted"; Huyen Ch. 6 only (full data, publisher page, code repo
      https://github.com/chiphuyen/aie-book).
    * **Official documentation**, sub-grouped by framework (LangChain/LangGraph, LangChain4j, Spring AI, OpenAI
      Agents SDK, Claude Agent SDK, Microsoft Agent Framework, CrewAI, smolagents, Google ADK).
    * **Specifications and standards**: A2A specification + repo, MCP specification (2026-07-28), the Agentic AI
      Foundation announcement.
    * **Papers and engineering articles**: the 3 Anthropic engineering posts (building effective agents, writing
      tools for agents, context engineering), ReAct, Reflexion, ToT, Self-Consistency, Plan-and-Solve, Generative
      Agents (memory), ADAS.
    * **Deprecations**: the Assistants API migration guide, the AutoGen/Semantic Kernel migration blog.
    * **Security**: MAESTRO, OWASP Agentic Top 10.
    * The house closing sentence (books are consulted references, not the primary source; official docs are
      authoritative on any discrepancy).
  - [x] Task 17.5. Run a URL-audit script check: every URL cited anywhere in the 15 sibling pages plus this page is
    present in `== Bibliography`, 0 duplicates, 0 non-canonical/redirecting URLs.
- [x] Task 18. Create `cheat-sheet.adoc` ("AI Agents Cheat Sheet").
  - [x] Task 18.1. Lists what the sheet covers; cross-references every page of the sub-section, grouped like the
    nav; links the PDF via `xref:attachment$ai-agents-cheat-sheet.pdf[Download the AI Agents Cheat Sheet (PDF)]`.
- [x] Task 19. Produce `modules/ROOT/attachments/ai-agents-cheat-sheet.pdf`.
  - [x] Task 19.1. Build a print-ready HTML/CSS layout (dense, multi-column, colour-coded boxes; header line with
    the version baseline + date; breadcrumb footer) visually consistent with `vector-rag-cheat-sheet.pdf` and
    `azure-cheat-sheet.pdf` — reuse the previous cheat-sheet HTML sources in the scratchpad
    (`cheatsheet-203/`/`cheatsheet-204/`-style directories, if still present, or the sibling PDFs' own generation
    notes) as a style reference.
  - [x] Task 19.2. Content: workflow-vs-agent decision; the pattern catalogue with mini diagrams; tool-design
    rules; the memory types and their APIs across the 3 frameworks; multi-agent topologies; MCP vs. A2A; HITL
    patterns; evaluation metrics; guardrails checklist; the framework-landscape table.
  - [x] Task 19.3. Render via headless Chrome to PDF; verify with `fitz` that it is **exactly one A4 page**.
- [x] Task 20. Insert the nav block into `modules/ROOT/nav.adoc`.
  - [x] Task 20.1. After the line `**** xref:ai/customizing-ai-workflows/cheat-sheet.adoc[Cheat Sheet (PDF)]` and
    before `** xref:git-and-github/index.adoc[Git & GitHub]`, insert
    `*** xref:ai/agents/index.adoc[AI Agents]` followed by 15 `****` children (one per concept page, in the
    issue's outline order) and a final `**** xref:ai/agents/cheat-sheet.adoc[Cheat Sheet (PDF)]` line — mirroring
    the `customizing-ai-workflows` block's own shape exactly.
- [x] Task 21. Edit `modules/ROOT/pages/ai/index.adoc`.
  - [x] Task 21.1. Replace the "AI Agents -- ... (planned)" bullet in `== Sub-sections` with a real `xref:` bullet
    and a one-line summary matching this sub-section's actual scope.
  - [x] Task 21.2. In `== Books used in this section`, rewrite the Lanham and Albada lines' trailing "Will be cited
    by the planned AI Agents sub-section" sentences into
    `xref:ai/agents/index.adoc#_bibliography[AI Agents' bibliography]` links (non-empty link text), consistent with
    how #204 already re-pointed the Osmani/Albada lines for Customizing AI Workflows.
  - [x] Task 21.3. Append this sub-section's new terms to header `:keywords:` (skip any already present, e.g.
    "agents", "MCP" are already listed).
- [x] Task 22. Edit `modules/ROOT/pages/index.adoc` (root). Append genuinely new `:keywords:` terms from this
  sub-section (A2A, ReAct, Reflexion, multi-agent orchestration, behaviour trees, MAESTRO, agent guardrails, etc.),
  skipping any already present.
- [x] Task 23. Add cross-links in the 3 existing pages the issue names.
  - [x] Task 23.1. `database/vector-rag/agentic-rag.adoc`: one sentence linking
    `xref:ai/agents/index.adoc[AI Agents]`.
  - [x] Task 23.2. `database/vector-rag/agent-memory-and-semantic-cache.adoc`: one sentence linking
    `xref:ai/agents/memory.adoc[]`.
  - [x] Task 23.3. `apps/apple/apple-intelligence-and-machine-learning.adoc`: one sentence linking
    `xref:ai/agents/tool-design.adoc[]` from its tool-calling section.

### Group 9 — Build and verify

**Parallelizable: yes** (single task, after Group 8).

- [x] Task 24. Build and verify.
  - [x] Task 24.1. Run `npx antora antora-playbook.yml` on a clean `build/` via an `iru-gate-runner` sub-agent
    (`Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Invoke
    Skill({skill: \"iru-build-docs\"}) and report the exact error/warning count."})`). Must exit 0 with **0 errors
    and 0 warnings**.
  - [x] Task 24.2. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` via a sub-agent. All diagrams
    must parse. Restore `node_modules/.package-lock.json` afterward.
  - [x] Task 24.3. Check reachability: all 15 pages + `cheat-sheet.adoc` are `xref:`-linked from both
    `ai/agents/index.adoc` and `nav.adoc`; `build/site/ai/agents/` has 17 HTML files; every `ai-agents-*.svg` is in
    `build/site/_images/`; the PDF is 1 A4 page.
  - [x] Task 24.4. Grep checks: the disclaimer include is in all 17 files and there is no other admonition anywhere
    under `ai/agents/`; the book surnames (Albada, Lanham, Huyen) appear only on `ai/agents/index.adoc` (and, for
    Huyen, also `ai/llm-foundations/index.adoc`/`ai/ai-assisted-development/index.adoc` where it's already cited —
    confirm this page doesn't duplicate those citations verbatim); every content page has `== References` and at
    least one code example; no `^\[\.[A-Z]` role-captions; no `xref:` inside backticks and no empty-text fragment
    xrefs; no page calls an existing AI page "planned"; no line-leading `20NN.`; no `\{` inside `----` blocks; no
    hardcoded secrets (`password`, `token`, `sk-`, `ghp_`); every `ai-catalog` link uses the one pinned SHA.
  - [x] Task 24.5. **Self-review pass.** Delegate to fresh `general-purpose` sub-agents, splitting the 15 concept
    pages into 3 batches of 5, run in parallel. Each verifies every framework method/class/field name, protocol
    field, CLI flag and URL against the official docs (WebFetch), applying the "Lessons" list above. Fix every
    real finding, rebuild, and record the findings count and fixes in the progress note.
  - [x] Task 24.6. Re-check the PDF (via `fitz`) matches the pages after the Task 24.5 fixes; re-render if needed.
    Re-run the Task 17.5 bibliography URL check.
  > Progress note (2026-09-28): clean `npx antora antora-playbook.yml` exit 0 with 0 errors / 0 warnings (run
  > directly -- no sub-agent tool was available in the executing context); `npm run validate:mermaid`: all 583
  > diagrams parse (27 in `ai/agents/`); 17 HTML pages in `build/site/ai/agents/`, both `ai-agents-*.svg` in
  > `_images/`, PDF exactly 1 A4 page; bibliography URL audit: 82 URLs, 0 missing, 0 duplicates (one redirecting
  > URL, the Claude Agent SDK overview, re-pointed to its canonical `code.claude.com` form; 56 hosts unreachable
  > from the container's egress proxy, so their redirects could not be checked). Self-review done inline: every
  > Python example parsed and was executed against the real packages with stubbed models; Java/Spring names were
  > checked against the published sources jars. 13 findings fixed (wrong xref to `evaluating-rag-systems.adoc`,
  > non-canonical Claude Agent SDK URL, book surnames on 4 concept pages, `crewai test` CLI -> `Crew.test`,
  > unverified OTel move date, missing notes reducer, Pydantic state in checkpoints -> dict, unstable `hash()` key,
  > BT approval node type, 20 math attribute warnings -> `stem:` syntax, conservative AAIF wording for A2A, a
  > `detect-secrets` false positive in a SafeGuardAdvisor example, and a missing code example on
  > `frameworks-landscape.adoc`).

### Group 10 — Integration-branch verification (required by #205 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; sub-tasks in order, after Group 9).

- [ ] Task 25. Verify against the integration branch and compute merge readiness.
  - [ ] Task 25.1. Commit on `feature/205` with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01YHinbxfoUe4fRK7UhVB3by`.
    Do not push, and don't commit `.secrets.baseline`. Then `git fetch origin` and merge the latest
    `origin/feature/213-ai-section` into `feature/205`.
    * **Expected conflict points:** the AI block in `nav.adoc`, `ai/index.adoc` `== Sub-sections` /
      `== Books used in this section` / `:keywords:`, and the root `:keywords:`.
    * **How to resolve:** keep every sibling's entries, in the fixed sub-section order.
    * If nothing is new, record "already up to date".
  - [ ] Task 25.2. Re-run the Antora build and Mermaid validation on the merged result via `iru-gate-runner`. Both
    must be clean.
  - [ ] Task 25.3. Confirm prerequisite **#202** is merged into the integration branch:
    `git fetch origin && git branch -r --merged origin/feature/213-ai-section | grep -x "  origin/feature/202"`,
    or `gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title` (GitHub MCP
    equivalent if `gh` unavailable in the executing environment).
  - [ ] Task 25.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-205.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #202 <✅ merged into feature/213-ai-section (PR #…) / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY: can be merged into feature/213-ai-section after human review
              | ⏳ WAIT: keep as draft until #202 is merged into feature/213-ai-section, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first". Note the post-merge chores: tick #205 in #213's
    *Progress* checklist and delete `feature/205`.
