# Implementation plan — Conversational Channels sub-section (issue #209)

## Task summary

Add the **Conversational Channels** sub-section under *Guides & References / AI* at
`modules/ROOT/pages/ai/conversational-channels/`: 15 pages (landing page with bibliography, 13 topic pages, cheat-sheet
page) plus the one-page A4 PDF. The sub-section shows how to expose the DocsAssistant RAG assistant via chat:
own surfaces (streaming APIs, chat UI protocols, ready-made UIs, an embeddable widget, WebRTC data channels, XMPP) and
business channels (Microsoft Teams, WhatsApp Business, Apple Messages for Business, Slack, Telegram, Google Chat, RCS).
Every channel is an adapter in front of one channel-agnostic core `ask(conversationId, userId, text) → stream of
{token | citation | done}`, implemented with LangChain (Python/FastAPI) or Spring AI (Java/Spring Boot), as built in
the RAG Systems in Production sub-section.

Source: GitHub issue #209 (labels: documentation, enhancement — classified as a feature)

Base branch: feature/213-ai-section

Working branch: feature/209

Choices made on the user's behalf (challenge them in review):
- Documentation-only task: no `*-code-one-task` skill applies, so tasks carry no language tag and are implemented
  directly. Snippets in pages are illustrative and written from current official docs, not compiled by this repo.
- One PR, as for #208. Groups 2 and 3 are separable if a two-PR split is wanted (group 2 = own channels,
  group 3 = business channels and operations).
- Antora only fails on unresolved xrefs at build, so the nav and all cross-links are written up front and validated
  together in Group 6.
- Sibling sub-sections that do not exist yet (Voice Agents, LLMOps & Evaluation, AI Security & Responsible AI) are
  named in plain prose, never as `xref:`.
- Facts flagged "re-verify at implementation time" in the issue (Teams SDK status, WhatsApp AI policy dated 2026-01-15,
  Telegram `sendMessageDraft`, AG-UI 1.0, etc.) are re-checked against official docs in Task 1.1 and the page text
  follows what the docs say on that date, not the issue.
- Apple Messages for Business, WhatsApp production and RCS cannot be validated without business accounts: those pages
  state in prose which steps were verified with sandboxes and which were documented from official docs only.

Merge constraints: this PR targets `feature/213-ai-section`, never `main`. It stays a **draft** until its hard
dependency #208 is merged there (already merged: commit caa159d1, PR #226). The PR body uses `Refs #209`, not `Closes`.
The final integration PR (`feature/213-ai-section` → `main`, owned by #213) closes the issue.

## Current code state

- `antora.yml` (component `irurueta`), `modules/ROOT/nav.adoc`, `modules/ROOT/pages/index.adoc`, `package.json`
  (`npm run validate:mermaid` → `scripts/validate-mermaid.mjs`), Antora 3.1.15 with lunr, mermaid and mathjax extensions.
- The AI block in `nav.adoc` starts at `** xref:ai/index.adoc[AI]` (line 1046) and currently ends with the RAG Systems
  in Production block; `** xref:git-and-github/index.adoc[Git & GitHub]` follows. The new
  `*** xref:ai/conversational-channels/index.adoc[Conversational Channels]` block goes right after RAG Systems and
  before Git & GitHub.
- `modules/ROOT/pages/ai/index.adoc`: line 92 has
  `* Conversational Channels -- deploying assistants to chat, email and messaging channels. (planned)` — replace with an
  xref bullet; extend the `:keywords:` line; `== Books used in this section` lists books with "Cited on" xrefs — add
  `conversational-channels` bibliography xrefs for the four books the issue cites (Albada, Mendelevitch & Bao, Oshin &
  Campos, Walls).
- `modules/ROOT/pages/index.adoc`: only its `:keywords:` line changes (the `ai.svg` picker already exists).
- Templates to mirror: `ai/rag-systems/index.adoc` (version baseline, bibliography, reading path),
  `ai/rag-systems/cheat-sheet.adoc`, `ai/rag-systems/serving-rag-as-an-api.adoc` and `ai/mcp/rag-over-mcp.adoc` (the
  DocsAssistant running example); partial `ai-rag-systems-disclaimer.adoc`; PDF `ai-rag-systems-cheat-sheet.pdf`
  (plus `vector-rag-cheat-sheet.pdf`, `azure-cheat-sheet.pdf` for style); SVGs `ai-rag-systems-*.svg`.
- Existing link targets (verified present): `backend/springboot/{rest-apis,reactive-programming}.adoc`,
  `backend/quarkus/websockets.adoc`, `web/aspnet/core/signalr.adoc`, `backend/graphql/subscriptions.adoc`,
  `backend/messaging/protocols.adoc`, `backend/oauth/*` (e.g. `flows-overview`, `authorization-code-and-pkce`),
  `cloud/azure/*` (e.g. `container-apps`, `app-service-and-functions`, `key-vault-and-secrets`,
  `email-with-communication-services`), `web/accessibility.adoc`, `web/react/*`, `ai/mcp/*` (e.g. `rag-over-mcp`,
  `python-fastapi-integration`, `spring-boot-servers`), `ai/rag-systems/*` (e.g. `serving-rag-as-an-api`,
  `conversational-rag-and-memory`, `citations-and-grounding`, `access-control-and-privacy`), `ai/agents/agent-ux.adoc`.
  Paths of `web/vue/*`, `web/angular/*` and the `ai/langchain/*`, `ai/spring-ai/*` page names must be confirmed in
  Task 1.1 before xref'ing.
- Existing pages with "planned"/plain-prose mentions of this sub-section to turn into real xrefs (check each, keep
  anchors intact): `ai/rag-systems/serving-rag-as-an-api.adoc:19`, `ai/spring-ai/index.adoc:404`,
  `ai/spring-ai/streaming-and-reactive.adoc:775`, `ai/agents/agent-ux.adoc:17`, `ai/mcp/connecting-hosts.adoc:472`,
  `ai/mcp/index.adoc:216`.
- `.gitignore` ignores `/build/`, `/node_modules/`, `/.idea/`. `.archive/implementation_plan_208.md` is the structural
  precedent for this plan.

Verified version facts and confirmed page names (Task 1.1, read 2026-10-01; reuse in Groups 2-5):

- Versions: langchain 1.4.3, langchain-core 1.6.6, langgraph 1.2.12, langgraph-checkpoint-postgres 3.1.2, FastAPI 0.142.2
  (`fastapi.sse`), sse-starlette 3.5.0, uvicorn 0.54.0; Spring AI 2.0.1 on Spring Boot 4.1.1 (2.1.0-M1 and Boot 4.2.0-M2
  exist, unused); `ai` 7.0.126, `@ai-sdk/react` 4.0.129, `ag-ui-protocol` 1.0.0, `@ag-ui/core` 1.0.1, `ag-ui-langgraph` 0.0.45,
  Express 5.2.1, `@assistant-ui/react` 0.15.22, Chainlit 2.12.0, Open WebUI 0.11.4 (LibreChat not pinned); aiortc 1.15.0;
  slixmpp 1.17.0, Smack 4.5.0 (4.6.0-alpha1 exists), xmpp.js 0.14.0, ejabberd 26.09, Openfire 5.1.2; Teams SDK 2.1.x
  (`@microsoft/teams.apps` 2.1.0, `microsoft-teams-apps` 2.1.0, teams.net 2.1.1) and the Teams SDK site says Python is now GA
  (the issue said preview); `microsoft-agents-hosting-core` 1.7.0, `@microsoft/agents-hosting` 1.9.1; botbuilder-js/-dotnet/
  -python/-java repos are archived; slack-bolt 1.30.0, slack-sdk 3.44.1, @slack/bolt 5.1.0, Bolt for Java 1.52.0;
  python-telegram-bot 22.8, TelegramBots (telegrambots-longpolling) 10.3.0, Bot API 10.3 with `sendMessageDraft` and
  `sendRichMessageDraft` (params `can_stop`, `keep_on_stop`) in the changelog; twilio 9.11.2.
- Not verifiable programmatically: the WhatsApp Business Solution Terms text (client-side rendered; the URL redirects to
  facebook.com/legal/Meta-Terms-for-WhatsApp-Business-Platform) so the 2026-01-15 AI clause was NOT re-confirmed: Task 13
  must cite by link and word it cautiously. WhatsApp pricing page confirms per-message pricing since 2025-07-01.
- URL changes: `https://learn.microsoft.com/en-us/azure/bot-service/bot-service-overview` is 404 (use
  `https://learn.microsoft.com/en-us/azure/bot-service/` or `.../abs-quickstart`); the Slack AI apps URL redirects to
  `https://docs.slack.dev/tools/bolt-js/concepts/adding-agent-features/`; Chainlit docs root redirects to `/get-started/overview`.
  All other URLs in the issue's bibliography return 200.
- Confirmed existing xref targets: `ai/langchain/{streaming,agents-with-create-agent,short-term-memory-and-checkpointers,
  chat-models-and-messages,mcp-adapters,observability-with-langsmith,deployment,retrieval-and-rag-bridge,langchain4j}`;
  `ai/spring-ai/{streaming-and-reactive,chatmodel-and-chatclient,advisors,chat-memory,chat-memory-repositories,mcp-server,
  security-and-guardrails,production-and-deployment,observability}`; `web/vue/{getting-started,index,security-and-accessibility,
  state-management}`; `web/angular/{index,http-client,rxjs-and-async,getting-started}`; `web/react/{index,getting-started,
  data-fetching,custom-hooks}`; `cloud/azure/{container-apps,app-service-and-functions,key-vault-and-secrets,
  email-with-communication-services,identity-and-access,api-management,messaging-and-integration}`; `ai/mcp/{rag-over-mcp,
  python-fastapi-integration,spring-boot-servers,connecting-hosts,deploying-remote-servers}`; `ai/agents/{agent-ux,human-in-the-loop}`.
- Created in Group 1: `partials/ai-conversational-channels-disclaimer.adoc`, `images/ai-conversational-channels-channel-matrix.svg`,
  `pages/ai/conversational-channels/index.adoc` (anchors `#_bibliography`, `#_version_baseline`). All 14 other page names are in the nav.

## Page conventions (apply to every page task below)

- Header: `= Title`, `:description:`, `:keywords:`, `include::partial$ai-conversational-channels-disclaimer.adoc[]`;
  intro states the versions written against, verified and dated at implementation time (use the real date then).
- Ends with `== References` (official docs, specs and papers only). Every code example is followed by a link to the
  official page it derives from; code is written from current official docs, never copied from a book. Where a book is
  outdated, say so in prose and show the current API. Paraphrase and credit books; no verbatim book text or code.
- No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks other than the one in the disclaimer partial; version notes,
  deprecations, security, pricing and policy caveats go in prose or table rows.
- Add `[mermaid]` blocks or `ai-conversational-channels-*.svg` (legible in light and dark) where a picture clarifies;
  MathJax (`\( \)` / `\[ \]`) where a formula makes a concept precise (e.g. rate-limit and cost estimates).
- Link, don't duplicate, existing pages; `xref:` only to pages that exist.
- DocsAssistant running scenario used consistently: one channel-agnostic core exposing
  `ask(conversationId, userId, text)`; Python core = LangChain `create_agent` + retriever tool + Postgres checkpointer +
  FastAPI; Java core = Spring AI `ChatClient` + RAG advisor + JDBC chat memory + Spring Boot. Each adapter maps channel
  user/thread IDs to `userId`/`conversationId` and maps streaming to what the channel supports.

## Implementation steps

### Group 1 — Scaffolding and landing page (Parallelizable: no — Tasks 2–4 edit shared files and Task 2 needs the partial and version facts from Task 1)

- [x] **Task 1. Verify the version baseline and create the disclaimer partial**
  - [x] Task 1.1. Verify against current official docs/registries and record with today's date: FastAPI SSE
    (`EventSourceResponse`), LangChain 1.x streaming, Spring AI 2.0.x `ChatClient.stream()` on Spring Boot 4.1.x, AI SDK UI
    Message Stream protocol and AG-UI 1.0, assistant-ui/Chainlit/Open WebUI/LibreChat status, slixmpp/Smack/xmpp.js and
    the XEPs, Teams SDK / M365 Agents SDK / Copilot Studio / Agents Toolkit status, Bot Framework retirement, WhatsApp
    Cloud API docs and the Business Solution Terms AI clause, Apple Messages for Business MSP process, Slack Bolt `Assistant`
    streaming, Telegram Bot API `sendMessageDraft`, Google Chat/ADK quickstarts, RCS Business Messaging. Also confirm the
    exact page names under `ai/langchain/`, `ai/spring-ai/`, `web/vue/`, `web/angular/`, `cloud/azure/` that will be xref'd.
  - [x] Task 1.2. Create `modules/ROOT/partials/ai-conversational-channels-disclaimer.adoc` containing only the single
    `[IMPORTANT]` block: the house AI-assistance disclosure plus the pointer
    `xref:ai/conversational-channels/index.adoc#_bibliography[bibliography]` (mirror `ai-rag-systems-disclaimer.adoc`).
- [x] **Task 2. Create `modules/ROOT/pages/ai/conversational-channels/index.adoc`**
  - [x] Task 2.1. Header, intro with dated version baseline, the channel landscape, the **channel matrix** (streaming
    support, rich UI, auth/identity, approval/registration needs, policy limits, pricing model as a link only, best fit),
    the reading path, and a `== Version baseline` table. SVG `ai-conversational-channels-channel-matrix.svg`.
  - [x] Task 2.2. Write `== Bibliography` from the issue: requester-provided books (full bibliographic data, publisher page,
    companion code repository where one exists), then official documentation, specifications and standards (RFC 6120/6121,
    XEPs, W3C WebRTC), grouped as in the issue; every source linked and verified to resolve; close with the house-style
    note (books are consulted references, not the primary source of any example; official docs authoritative). State that
    none of the requester-provided books covers messaging channels and only the cited chapters are used. No PDFs committed.
- [x] **Task 3. Update `modules/ROOT/nav.adoc`**: add `*** xref:ai/conversational-channels/index.adoc[Conversational Channels]`
  and a `****` child for each of the other 14 pages grouped like the outline (Foundations, Own channels, Business
  channels, Operations, Cheat Sheet (PDF) last), placed after the RAG Systems block and before Git & GitHub.
- [x] **Task 4. Update the landing pages**
  - [x] Task 4.1. `modules/ROOT/pages/ai/index.adoc`: turn the "planned" bullet (line 92) into an xref bullet with a short
    description; append channel terms to `:keywords:`; add `conversational-channels` bibliography xrefs to the "Cited on"
    lists of the four cited books.
  - [x] Task 4.2. `modules/ROOT/pages/index.adoc`: append the same terms to `:keywords:` (do not touch the picker image).

### Group 2 — Foundations and own channels (Parallelizable: yes — one new file per task; each task also creates its own figures; no shared files)

- [x] **Task 5. `channel-agnostic-architecture.adoc`**: core-plus-adapters (hexagonal) pattern, identity mapping,
  conversation-state mapping, streaming capability negotiation (native streaming / message edits / typing / chunked),
  rich-content rendering (citations as cards/links), human handoff/escalation, rate limits and fan-in, idempotent webhook
  handling, async jobs for slow answers, multi-tenancy; Mermaid architecture diagram; link
  `ai/rag-systems/conversational-rag-and-memory`, `access-control-and-privacy`, `citations-and-grounding`.
- [x] **Task 6. `streaming-chat-apis.adoc`**: SSE vs. WebSocket vs. NDJSON table; FastAPI `EventSourceResponse` + LangChain
  `astream`; FastAPI WebSockets; Spring WebFlux `Flux<ServerSentEvent>` with `ChatClient.stream()`; Spring WebSocket/STOMP;
  Node/Express SSE variant; cancellation and client disconnects; reconnect with `Last-Event-ID`; backpressure; proxy buffering
  (`X-Accel-Buffering`); auth tokens for EventSource; Mermaid sequence diagram; link `backend/springboot/{rest-apis,reactive-programming}`,
  `backend/quarkus/websockets`, `web/aspnet/core/signalr`, `backend/graphql/subscriptions`, `backend/messaging/protocols`,
  `ai/rag-systems/serving-rag-as-an-api`, `backend/oauth/*`.
- [x] **Task 7. `chat-ui-protocols.adoc`**: AI SDK UI Message Stream protocol (SSE, `x-vercel-ai-ui-message-stream: v1`, typed
  parts; v4 data stream is legacy) emitted from FastAPI and Spring and consumed with `useChat`; AG-UI events (lifecycle,
  text, tool calls, state snapshots/deltas); a LangGraph AG-UI integration example; choosing between them.
- [x] **Task 8. `ready-made-chat-uis.adoc`**: assistant-ui, Chainlit (community-maintained since May 2025), Open WebUI and
  LibreChat compared on hosting, RAG, auth, extensibility and licence/maintenance status; wiring each to the DocsAssistant
  OpenAI-compatible or custom endpoint.
- [x] **Task 9. `embedding-a-web-chat-widget.adoc`**: minimal framework-free widget over SSE; React and Vue variants (link the
  web sections); rendering citations; accessibility (link `web/accessibility`); CSP and CORS.
- [x] **Task 10. `webrtc-data-channels.adoc`**: `RTCPeerConnection`/`createDataChannel`, reliability options, signalling over
  WebSocket, STUN/TURN (coturn), aiortc on a Python server, when a data channel beats WebSocket (alongside voice/video) and
  when it doesn't; Mermaid signalling sequence; Voice Agents named in prose only.
- [x] **Task 11. `xmpp-bots.adoc`**: XMPP architecture (JIDs, stanzas, presence), servers (ejabberd, Prosody, Openfire),
  client-bot vs. component (XEP-0114), 1:1 and MUC (XEP-0045), chat states while generating (XEP-0085), XEP-0308 pseudo-streaming,
  MAM (XEP-0313), slixmpp bot over the LangChain core and Smack bot over the Spring AI core, TLS/SASL security; link
  `backend/messaging/protocols`.

### Group 3 — Business channels and operations (Parallelizable: yes — one new file per task, no shared files; tasks link to Group 2 page names, which are fixed by Task 3's nav)

- [x] **Task 12. `microsoft-teams.adoc`**: Bot Framework retirement; decision table Teams SDK vs. M365 Agents SDK vs. Copilot
  Studio vs. declarative agents; Azure Bot registration and Entra app; manifest and sideloading with the M365 Agents Toolkit;
  a Teams SDK bot calling the DocsAssistant core with streaming; Adaptive Cards for citations; SSO; proactive messages; Copilot
  Studio connecting the DocsAssistant MCP server; declarative agent with an MCP plugin; link `ai/mcp/*`, `cloud/azure/*`,
  `backend/oauth/*`.
- [x] **Task 13. `whatsapp-business.adoc`**: Cloud API setup (app, WABA, phone number, tokens), webhook verification and signature
  checks, receiving/sending (`POST /{phone-number-id}/messages`), 24-hour window and templates, interactive messages, per-message
  pricing (link only), the AI-provider policy in prose (cite the Business Solution Terms; business-scoped RAG bots vs.
  general-purpose assistants), FastAPI and Spring webhook adapters, Twilio WhatsApp alternative, opt-in and compliance.
- [x] **Task 14. `apple-messages-for-business.adoc`**: what it is, MSP requirement and Apple Business Register flow, entry points,
  rich features (list pickers, Apple Pay, authentication), integrating the core behind an MSP (generic MSP webhook pattern, e.g.
  via a CCaaS), limitations (no public iMessage bot API); state what was documented from official docs only.
- [x] **Task 15. `slack-telegram-and-google-chat.adoc`**: Slack Bolt `Assistant` + chat streaming (Python/JS/Java), Telegram Bot
  API `sendMessageDraft` streaming (python-telegram-bot / TelegramBots Java), Google Chat Workspace add-on agents (ADK/A2A
  quickstarts).
- [x] **Task 16. `rcs-business-messaging.adoc`**: RBM agents, partner onboarding and carrier launch, webhooks, rich cards and
  suggestions, iOS support via carriers; state what was documented from official docs only.
- [x] **Task 17. `operating-chat-channels.adoc`**: secrets and signature verification per platform, retries and deduplication,
  observability per channel (LLMOps named in prose), abuse and rate limiting, PII and data-retention rules per platform, content
  moderation, testing with sandboxes and emulators, cost monitoring (MathJax estimate); link `ai/rag-systems/{observability-and-tracing,guardrails-and-prompt-injection}`.

### Group 4 — Cheat sheet (Parallelizable: no — Task 19 summarises every page written in Groups 2–3 and Task 18 lists them)

- [x] **Task 18. `cheat-sheet.adoc`**: list what the sheet covers, cross-reference every page grouped like the nav, link
  `xref:attachment$ai-conversational-channels-cheat-sheet.pdf[Download the Conversational Channels Cheat Sheet (PDF)]`.
- [x] **Task 19. `modules/ROOT/attachments/ai-conversational-channels-cheat-sheet.pdf`**
  - [x] Task 19.1. Write a print-ready A4 HTML/CSS in the scratchpad directory (not committed), dense multi-column,
    colour-coded boxes, header line with version baseline and date, breadcrumb footer, styled consistently with
    `ai-rag-systems-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf` and `azure-cheat-sheet.pdf`; content covers: channel matrix,
    adapter responsibilities, SSE/WebSocket snippets (FastAPI/Spring/Node), AI SDK stream parts and AG-UI events, WebRTC
    signalling steps, XMPP XEPs table, Teams options decision table, WhatsApp window/template/policy rules, Apple MSP flow,
    Slack/Telegram streaming APIs, operations checklist.
  - [x] Task 19.2. Render with headless Chrome/Chromium; verify it is **exactly one A4 page** (e.g. `pdfinfo`) and legible;
    commit only the PDF.

### Group 5 — Cross-links in existing pages (Parallelizable: yes — each task edits a different existing file)

- [x] **Task 20. `backend/messaging/protocols.adoc`**: one sentence + xref to `ai/conversational-channels/xmpp-bots.adoc`.
- [x] **Task 21. `backend/springboot/reactive-programming.adoc` and `backend/quarkus/websockets.adoc`**: link
  `ai/conversational-channels/streaming-chat-apis.adoc`.
- [x] **Task 22. `web/aspnet/core/signalr.adoc`**: link `streaming-chat-apis.adoc` (SignalR as an alternative transport).
- [x] **Task 23. Replace "planned"/plain-prose mentions with real xrefs** in `ai/rag-systems/serving-rag-as-an-api.adoc`,
  `ai/spring-ai/index.adoc`, `ai/spring-ai/streaming-and-reactive.adoc`, `ai/agents/agent-ux.adoc`,
  `ai/mcp/connecting-hosts.adoc`, `ai/mcp/index.adoc`; keep existing anchors intact and leave Voice Agents/LLMOps/AI Security as
  prose.

### Group 6 — Sub-section validation (Parallelizable: no — checks depend on all previous groups)

- [x] **Task 24. Static checks**: (a) no admonition blocks under `pages/ai/conversational-channels/` and the partial contains only
  the disclosure + bibliography pointer; (b) every page has `:description:`, `:keywords:`, the include, versions in its intro,
  `== References`; (c) every code block is followed by an official-docs link; (d) every source in the issue's bibliography is
  linked in `index.adoc`; (e) no `xref:` to non-existent pages (grep and check); (f) SVGs named
  `ai-conversational-channels-*.svg` and readable in light/dark; (g) no book text/PDFs committed; (h) secrets scan with the
  `iru-check-security` skill.
  Done: checks (a)-(h) pass; fixed unescaped `{...}` attribute refs, an ISBN-year line parsed as a list item, and a redirected assistant-ui link; detect-secrets found 0 new/unlabeled entries.
- [x] **Task 25. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml`** (delegate via the `iru-gate-runner`
  agent, or `/iru-build-docs`); fix every xref, AsciiDoc or Mermaid error or warning introduced by this sub-section and confirm
  the site renders the new pages (nav, images, PDF link, MathJax).
  Done: validate:mermaid passed (705 diagrams); antora build exit 0 with no warnings; 15 pages, SVG, PDF and MathJax verified in build/site.

### Group 7 — Integration-branch verification (Parallelizable: no — strictly sequential; each step depends on the previous result)

- [x] **Task 26. Merge the latest `origin/feature/213-ai-section` into `feature/209`** and resolve conflicts. Expected conflict
  points: the AI block in `modules/ROOT/nav.adoc`, `ai/index.adoc` → `== Sub-sections`, and the `:keywords:` of the root and AI
  index pages. Resolve by keeping every sibling's entries, in the fixed sub-section order.
  - Result: already up to date, no merge needed (`git log HEAD..origin/feature/213-ai-section` empty after fetch).
- [x] **Task 27. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml` (or `/iru-build-docs`) on the merged
  result.** Must finish with no xref, AsciiDoc or Mermaid errors.
  - Result: `npm run validate:mermaid` parsed all 705 diagrams successfully; `npx antora antora-playbook.yml` exit 0, no errors or warnings.
- [x] **Task 28. Compute merge readiness** for the prerequisite #208 (`gh pr list --base feature/213-ai-section --state merged
  --json number,headRefName,title`; squash merges make the PR list authoritative) and record the block for the PR body:

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: <#208 ✅ merged into feature/213-ai-section / ⏳ not merged yet>
  - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
  - Status: <✅ READY: can be merged into feature/213-ai-section after human review | ⏳ WAIT: keep as draft until #208 is merged, then re-merge feature/213-ai-section and rebuild>
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```

  Filled (computed 2026-10-01; #208 merged as PR #226):

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: #208 ✅ merged into feature/213-ai-section (PR #226)
  - Antora build + Mermaid validation on the merged result: ✅ passed
  - Status: ✅ READY: can be merged into feature/213-ai-section after human review
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```
