# Implementation plan — Voice Agents sub-section (issue #210)

## Task summary

Add the **Voice Agents** sub-section under *Guides & References / AI* at `modules/ROOT/pages/ai/voice-agents/`: 15 pages
(landing page with bibliography, 13 topic pages, cheat-sheet page) plus the one-page A4 PDF. The sub-section shows how to
expose the DocsAssistant RAG assistant by voice: external solutions (ElevenLabs Agents, OpenAI Realtime, Gemini Live,
Azure Voice Live), custom pipelines (STT + LLM + TTS with hosted or local models, Pipecat, LiveKit Agents, hand-rolled),
and delivery on the web (WebRTC / WebSocket) and over telephony (Twilio ConversationRelay and Media Streams; Asterisk
ARI / External Media / AudioSocket / chan_websocket, FreeSWITCH, Jambonz, SIP trunks). The "brain" is the same
DocsAssistant core built with LangChain (Python/FastAPI) or Spring AI (Java/Spring Boot), as built in *RAG Systems in
Production* and *Conversational Channels*.

Source: GitHub issue #210 (labels: documentation, enhancement — classified as a feature)

Base branch: feature/213-ai-section

Working branch: feature/210

Choices made on the user's behalf (challenge them in review):
- Documentation-only task: no `*-code-one-task` skill applies, so tasks carry no language tag and are implemented
  directly. Snippets are illustrative, written from current official docs, and not compiled by this repo.
- One PR, as for #208/#209. Groups 2–4 are separable if a split is wanted (group 2 = speech models and hosted platforms,
  group 3 = frameworks and delivery).
- Antora only fails on unresolved xrefs at build, so the nav and all cross-links are written up front and validated
  together in Group 6.
- Sibling sub-sections that do not exist yet (LLMOps & Evaluation, AI Security & Responsible AI) are named in plain prose,
  never as `xref:`. Existing siblings (Conversational Channels, Hugging Face, LangChain, Spring AI, RAG Systems, MCP) are
  linked, after confirming each target page exists.
- Facts in the issue marked "verified 2026-09-27; re-verify" (OpenAI/Gemini model names, ElevenLabs docs paths, Pipecat
  Flows in core from 1.5, Asterisk `chan_websocket` versions, Kokoro/Piper/XTTS licences) are re-checked against official
  docs in Task 1.1; the page text follows the docs on that date, not the issue. Unverifiable model names are stated as
  "check the models page" rather than asserted.
- Telephony (Twilio, Asterisk) and hosted realtime APIs cannot be live-tested in this repo: pages state in prose which
  steps were documented from official docs only.
- No book PDFs are committed; books are paraphrased and credited only.

Merge constraints: this PR targets `feature/213-ai-section`, never `main`. It stays a **draft** until its hard
dependencies #208 and #200 are merged there (both already merged: PRs #226 and #223). The PR body uses `Refs #210`, not
`Closes`. The final integration PR (`feature/213-ai-section` → `main`, owned by #213) closes the issue.

## Current code state

- `antora.yml` (component `ROOT`), `modules/ROOT/nav.adoc`, `modules/ROOT/pages/index.adoc`, `package.json`
  (`npm run validate:mermaid` → `scripts/validate-mermaid.mjs`), Antora with lunr, mermaid and mathjax extensions.
- The AI block in `nav.adoc` starts at `** xref:ai/index.adoc[AI]` (~line 1046) and currently ends with the
  Conversational Channels block; `** xref:git-and-github/index.adoc[Git & GitHub]` follows. The new
  `*** xref:ai/voice-agents/index.adoc[Voice Agents]` block goes right after Conversational Channels and before Git &
  GitHub.
- `modules/ROOT/pages/ai/index.adoc`: line 97 has
  `* Voice Agents -- speech-to-text, text-to-speech and real-time voice agent pipelines. (planned)` — replace with an
  xref bullet; extend `:keywords:`; `== Books used in this section` lists books with "Cited on" xrefs — add
  `voice-agents` bibliography xrefs for the five books the issue cites (Walls, Lee, Albada, Polzer, Mendelevitch & Bao).
- `modules/ROOT/pages/index.adoc`: only its `:keywords:` line changes (the `ai.svg` picker already exists).
- Templates to mirror: `ai/conversational-channels/index.adoc` and `cheat-sheet.adoc` (closest precedent, `#209`),
  `ai/rag-systems/index.adoc`; partial `ai-conversational-channels-disclaimer.adoc`; PDF
  `ai-conversational-channels-cheat-sheet.pdf` (plus `vector-rag-cheat-sheet.pdf`, `azure-cheat-sheet.pdf` for style);
  SVGs `ai-conversational-channels-*.svg`. Structural precedent plan: `.archive/implementation_plan_209.md`.
- Existing link targets (verified present): `ai/langchain/multimodality-and-voice.adoc`,
  `ai/spring-ai/audio-transcription-and-speech.adoc`, `ai/hugging-face/speech-models.adoc`,
  `ai/conversational-channels/webrtc-data-channels.adoc`, `ai/rag-systems/index.adoc`, `ai/mcp/*` (e.g. `rag-over-mcp`,
  `python-fastapi-integration`, `spring-boot-servers`), `backend/springboot/reactive-programming.adoc`,
  `backend/quarkus/websockets.adoc`, `apps/android/device-features-camera-location-sensors-media.adoc`,
  `apps/apple/camera-media-and-photos.adoc`, `backend/docker/*`, `cloud/azure/*` (no Speech-specific page; link
  `ai-data-and-iot-overview.adoc`). Other `ai/rag-systems/*`, `ai/langchain/*`, `ai/spring-ai/*` page names are confirmed in
  Task 1.1 before xref'ing.
- Existing pages with "planned"/plain-prose mentions of Voice Agents to turn into real xrefs (check each, keep anchors
  intact): `ai/langchain/multimodality-and-voice.adoc:22,567`, `ai/langchain/index.adoc:328`,
  `ai/spring-ai/audio-transcription-and-speech.adoc:208,722`, `ai/spring-ai/index.adoc:404`,
  `ai/hugging-face/speech-models.adoc:13,125,387`, `ai/hugging-face/index.adoc:395`, `ai/mcp/connecting-hosts.adoc:474`,
  `ai/mcp/index.adoc:217`, `ai/llm-foundations/multimodal-models.adoc:180`,
  `ai/conversational-channels/webrtc-data-channels.adoc:20`, `ai/conversational-channels/index.adoc:200`.
- `.gitignore` ignores `/build/`, `/node_modules/`, `/.idea/`.

## Page conventions (apply to every page task below)

- Header: `= Title`, `:description:`, `:keywords:`, `include::partial$ai-voice-agents-disclaimer.adoc[]`; intro states the
  versions written against, verified and dated at implementation time (use the real date then).
- Ends with `== References` (official docs, specs and papers only). Every code example is followed by a link to the
  official page it derives from; code is written from current official docs, never copied from a book. Where a book is
  outdated (e.g. Walls targets Spring AI 1.0), say so in prose and show the current API. Paraphrase and credit books; no
  verbatim book text or code.
- No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks other than the one in the disclaimer partial; version notes,
  deprecations, security, licence and pricing caveats go in prose or table rows.
- Add `[mermaid]` blocks or `ai-voice-agents-*.svg` (legible in light and dark) where a picture clarifies; MathJax
  (`\( \)` / `\[ \]`) where a formula makes a concept precise (latency budget, WER, cost per minute).
- Link, don't duplicate, existing pages; `xref:` only to pages that exist.
- DocsAssistant running scenario "call DocsAssistant": four paths — browser WebRTC widget; ElevenLabs Agent with the core as
  custom LLM/tool; Twilio phone call (ConversationRelay, then Media Streams through Pipecat); company PBX (Asterisk
  External Media / chan_websocket to a Python Pipecat or Java Spring voice service). Python core = LangChain
  `create_agent`; Java core = Spring AI `ChatClient` + `TranscriptionModel`/`SpeechModel` + Spring WebSocket handler.

## Implementation steps

### Group 1 — Scaffolding and landing page (Parallelizable: no — Tasks 2–4 edit shared files and Task 2 needs the partial and version facts from Task 1)

- [x] **Task 1. Verify the version baseline and create the disclaimer partial**
  - [x] Task 1.1. Verify against current official docs/registries and record with today's date: OpenAI Realtime
    (`gpt-realtime`, WebRTC ephemeral secrets, SIP, remote MCP), Gemini Live API (model names, ephemeral tokens), Azure Voice
    Live and Azure OpenAI realtime, ElevenAgents docs paths and custom-LLM / knowledge-base / tools / SDKs, Pipecat (core,
    Flows, Smart Turn, SmallWebRTC), LiveKit Agents 1.x (`AgentSession`, turn detector, LiveKit SIP), faster-whisper,
    whisper.cpp, Moonshine, Parakeet, Deepgram Nova-3/Flux, AssemblyAI Universal-Streaming, Kokoro, Piper (`piper1-gpl`),
    XTTS/idiap fork and its CPML licence, Sesame CSM, Kyutai, Silero/TEN VAD, Spring AI 2.0.x audio APIs
    (`TranscriptionModel`, `TextToSpeechModel`/`SpeechModel`, ElevenLabs provider) on Spring Boot 4.1.x, LangChain 1.x voice
    guidance, Twilio ConversationRelay and Media Streams message formats, Asterisk ARI / External Media / AudioSocket /
    `chan_websocket` (versions 23.0/22.6/21.11/20.16), `mod_audio_stream`, Jambonz, Vonage/Telnyx, aiortc. Also confirm the
    exact page names under `ai/langchain/`, `ai/spring-ai/`, `ai/rag-systems/`, `ai/mcp/`, `apps/apple/` that will be xref'd.
    - Done 2026-10-01 (no files; baseline recorded in `index.adoc` `== Version baseline`). Findings that differ from the
      issue: OpenAI now has two voice APIs, GPT-Live (`gpt-live-1`, `POST /v1/live/sessions`) and the Realtime API
      (`gpt-realtime`, `-1.5`, `-2`, `-2.1`, the "unverified" 2.1 is real); Gemini Live models are `gemini-3.8-live` (stable),
      `gemini-3.1-flash-live-preview`, `gemini-2.5-flash-native-audio-preview-12-2025`; Spring AI 2.0.1 has
      `TextToSpeechModel`/`StreamingTextToSpeechModel`, no `SpeechModel`; Pipecat Flows is in core (`pipecat.flows`);
      `pipecat-ai` 1.12.0, `livekit-agents` 1.8.3, Asterisk 23.5.0/22.11.0/20.21.0, `chan_websocket` from
      23.0.0/22.6.0/21.11.0/20.16.0 confirmed; Kokoro Apache-2.0, `piper1-gpl` GPL-3.0, XTTS weights CPML (non-commercial),
      CSM Apache-2.0 confirmed. All 76 issue URLs resolved (only the two oreilly.com pages return 403 to bots). Page names
      under `ai/langchain/`, `ai/spring-ai/`, `ai/rag-systems/`, `ai/mcp/` and `apps/apple/camera-media-and-photos` exist.
      Live testing of realtime audio, Twilio and Asterisk was not possible.
  - [x] Task 1.2. Create `modules/ROOT/partials/ai-voice-agents-disclaimer.adoc` containing only the single `[IMPORTANT]`
    block: the house AI-assistance disclosure plus the pointer `xref:ai/voice-agents/index.adoc#_bibliography[bibliography]`
    (mirror `ai-conversational-channels-disclaimer.adoc`).
    - Done: `modules/ROOT/partials/ai-voice-agents-disclaimer.adoc`.
- [x] **Task 2. Create `modules/ROOT/pages/ai/voice-agents/index.adoc`**
  - [x] Task 2.1. Header, intro with dated version baseline, voice vs. chat UX, the decision table (hosted voice platform vs.
    realtime API vs. open-source framework vs. hand-rolled), the four-path running scenario, reading path, and a
    `== Version baseline` table. SVG decision map `ai-voice-agents-decision-map.svg`.
  - [x] Task 2.2. Write `== Bibliography` from the issue: the five requester-provided books (full bibliographic data,
    publisher page, companion code repository where one exists), then official documentation grouped as in the issue
    (ElevenLabs, OpenAI, Google, Azure, Pipecat, LiveKit, other frameworks, STT, TTS, Spring AI, LangChain, Web, Twilio,
    Asterisk, other telephony, WebRTC in Java), then articles and papers (Whisper, Moshi); every source linked and verified
    to resolve; state that no requester book covers real-time voice in depth and only the cited chapters are used; close with
    the house-style note. No PDFs committed.
  - Done (2.1 and 2.2): `modules/ROOT/pages/ai/voice-agents/index.adoc` and `modules/ROOT/images/ai-voice-agents-decision-map.svg`
    (Mermaid block validated; Antora reports only the expected not-yet-written xref targets of Groups 2-4).
- [x] **Task 3. Update `modules/ROOT/nav.adoc`**: add `*** xref:ai/voice-agents/index.adoc[Voice Agents]` and a `****` child for
  each of the other 14 pages grouped like the outline (Foundations, Speech models, Hosted platforms, Frameworks, Web delivery,
  Telephony, Operations, Cheat Sheet (PDF) last), placed after the Conversational Channels block and before Git & GitHub.
  - Done: `modules/ROOT/nav.adoc` (landing + 14 children).
- [x] **Task 4. Update the landing pages**
  - [x] Task 4.1. `modules/ROOT/pages/ai/index.adoc`: turn the "planned" Voice Agents bullet (line 97) into an xref bullet with
    a short description; append voice terms to `:keywords:`; add `voice-agents` bibliography xrefs to the "Cited on" lists of
    the five cited books.
  - [x] Task 4.2. `modules/ROOT/pages/index.adoc`: append the same terms to `:keywords:` (do not touch the picker image).

### Group 2 — Foundations, speech models and hosted platforms (Parallelizable: yes — one new file per task; each task also creates its own figures; no shared files)

- [x] **Task 5. `voice-architectures.adoc`**: cascaded STT→LLM→TTS vs. speech-to-speech vs. hybrid; where RAG fits (context
  injection vs. tool calls); streaming every stage; sentence chunking for TTS; latency budget with MathJax
  \( T_{resp} \approx T_{net} + T_{eot} + T_{TTFT}^{LLM} + T_{TTFB}^{TTS} \) and how to measure it; SVG pipeline timeline
  `ai-voice-agents-latency-timeline.svg`; Mermaid of the three architectures.
  - Done 2026-10-01: `modules/ROOT/pages/ai/voice-agents/voice-architectures.adoc + images/ai-voice-agents-latency-timeline.svg`; Antora build has no warnings for the page besides the not-yet-written Group 3-4 xref targets; Mermaid blocks parse.
- [x] **Task 6. `turn-taking-and-interruptions.adoc`**: VAD (Silero, TEN), endpointing vs. semantic turn detection (LiveKit
  turn detector, Pipecat Smart Turn, Deepgram Flux, AssemblyAI), barge-in with history truncation, echo cancellation per
  transport, DTMF, silence/timeout handling, backchannels; Mermaid state machine (listening/thinking/speaking/interrupted).
  - Done 2026-10-01: `modules/ROOT/pages/ai/voice-agents/turn-taking-and-interruptions.adoc`; Antora build has no warnings for the page besides the not-yet-written Group 3-4 xref targets; Mermaid blocks parse.
- [x] **Task 7. `speech-to-text.adoc`**: streaming vs. batch; hosted providers; local models; accuracy factors (8 kHz audio,
  accents, custom vocabulary); WER formula in MathJax; Spring AI `TranscriptionModel` and LangChain/Python examples; link the
  Hugging Face speech catalogue.
  - Done 2026-10-01: `modules/ROOT/pages/ai/voice-agents/speech-to-text.adoc`; Antora build has no warnings for the page besides the not-yet-written Group 3-4 xref targets; Mermaid blocks parse.
- [x] **Task 8. `text-to-speech.adoc`**: streaming TTS; voices and cloning (consent and ethics); SSML; hosted providers; local
  models with licence caveats in prose/table (Kokoro Apache-2.0, Piper GPL-3.0, XTTS CPML non-commercial, CSM); Spring AI
  `SpeechModel` with ElevenLabs and OpenAI streaming; Python examples; audio formats and resampling (μ-law 8 kHz, PCM16
  16/24 kHz).
  - Done 2026-10-01: `modules/ROOT/pages/ai/voice-agents/text-to-speech.adoc`; Antora build has no warnings for the page besides the not-yet-written Group 3-4 xref targets; Mermaid blocks parse.
- [x] **Task 9. `realtime-apis.adoc`**: OpenAI Realtime (WebRTC with ephemeral keys minted by FastAPI or Spring, server
  WebSocket, SIP; session config, tools, remote MCP to the DocsAssistant MCP server, truncation), Gemini Live, Azure Voice
  Live; RAG through tool calls; comparison table; link `ai/mcp/rag-over-mcp`.
  - Done 2026-10-01: `modules/ROOT/pages/ai/voice-agents/realtime-apis.adoc`; Antora build has no warnings for the page besides the not-yet-written Group 3-4 xref targets; Mermaid blocks parse.
- [x] **Task 10. `elevenlabs-agents.adoc`**: agent configuration; custom LLM pointing at an OpenAI-compatible DocsAssistant
  endpoint (Spring AI or FastAPI); knowledge base vs. custom RAG; server/client/MCP tools; workflows; React/JS widget over
  WebRTC; WebSocket API; native Twilio and SIP trunking; Swift/Kotlin SDKs linking `apps/apple/camera-media-and-photos` and the
  Android device-features page; Mermaid ElevenLabs ↔ custom LLM ↔ RAG.
  - Done 2026-10-01: `modules/ROOT/pages/ai/voice-agents/elevenlabs-agents.adoc`; Antora build has no warnings for the page besides the not-yet-written Group 3-4 xref targets; Mermaid blocks parse.

### Group 3 — Frameworks, web delivery and telephony (Parallelizable: yes — one new file per task, no shared files; tasks link to Group 2 page names, which are fixed by Task 3's nav)

- [x] **Task 11. `pipecat.adoc`**: pipelines and frames; STT/LLM/TTS services; transports (SmallWebRTC, WebSocket, Daily,
  Twilio serializer); LangChain/LangGraph agent as the LLM step; fully on-prem stack (faster-whisper + Ollama + Kokoro);
  Smart Turn; Pipecat Flows; deployment (link `backend/docker/*`).
- [x] **Task 12. `livekit-agents.adoc`**: rooms and workers; `AgentSession` (pipeline vs. realtime); turn detector; tools calling
  the RAG core; LangChain integration; LiveKit SIP (trunks, dispatch rules, inbound/outbound); self-hosted vs. cloud; Node
  variant; mention TEN Framework and Kyutai Unmute/Moshi as alternatives and Vocode as dormant.
- [x] **Task 13. `building-a-voice-pipeline-by-hand.adoc`**: minimal cascaded pipeline in Spring Boot (WebSocket audio in, VAD,
  streaming STT, `ChatClient.stream()`, sentence-chunked `SpeechModel`, audio out, barge-in by cancellation) and the same in
  Python asyncio/FastAPI; what frameworks save you; link `backend/springboot/reactive-programming`.
- [x] **Task 14. `browser-voice.adoc`**: `getUserMedia` with AEC/noise suppression; WebRTC to Pipecat SmallWebRTC/aiortc,
  LiveKit, OpenAI Realtime, ElevenLabs SDK; WebSocket PCM alternative (AudioWorklet capture, jitter-buffer playback) and
  trade-offs; Web Speech API limits; mobile browser caveats; TURN; Mermaid WebRTC sequence; link
  `ai/conversational-channels/webrtc-data-channels` and `backend/quarkus/websockets`.
- [x] **Task 15. `telephony-with-twilio.adoc`**: Programmable Voice and TwiML; ConversationRelay (text WebSocket, Spring Boot
  `TextWebSocketHandler` and FastAPI handler calling the RAG core, interruptions, DTMF, language/voice settings, best
  practices); Media Streams (`<Connect><Stream>`, μ-law 8 kHz, `media`/`mark`/`clear`, wired into Pipecat and the hand-rolled
  Spring pipeline); outbound calls; transfer to a human; webhook signature validation; Twilio Java SDK; Mermaid call → TwiML →
  WebSocket → RAG.
- [x] **Task 16. `telephony-with-asterisk-and-sip.adoc`**: SIP trunking basics; Asterisk dialplan, ARI (Stasis, bridges) with
  External Media (RTP/AudioSocket/WebSocket), AudioSocket, `chan_websocket`; Python ARI + Pipecat and Spring ARI + WebSocket
  examples; FreeSWITCH `mod_audio_stream` (third-party); Jambonz `llm` verb; SIP to OpenAI Realtime / ElevenLabs / LiveKit SIP;
  Vonage and Telnyx notes; codecs and transcoding; SRTP/TLS and toll-fraud security; SVG PBX topology
  `ai-voice-agents-pbx-topology.svg`.

### Group 4 — Operations and cheat sheet (Parallelizable: no — Task 18 lists every page and Task 19 summarises every page written in Groups 2–3)

- [x] **Task 17. `production-voice-agents.adoc`**: scaling concurrent calls; GPU needs for local STT/TTS; cost per minute
  (method with MathJax, no prices); recording and consent laws (link only); PII redaction in transcripts; observability
  (per-stage latency, interruption rate, WER sampling); testing with simulated callers; fallback to a human; accessibility
  (link `web/accessibility`); LLMOps and AI Security named in prose only; link `ai/rag-systems` observability and guardrails pages
  if confirmed.
- [x] **Task 18. `cheat-sheet.adoc`**: list what the sheet covers, cross-reference every page grouped like the nav, link
  `xref:attachment$ai-voice-agents-cheat-sheet.pdf[Download the Voice Agents Cheat Sheet (PDF)]`.
- [x] **Task 19. `modules/ROOT/attachments/ai-voice-agents-cheat-sheet.pdf`**
  - [x] Task 19.1. Write a print-ready A4 HTML/CSS in the scratchpad directory (not committed), dense multi-column,
    colour-coded boxes, header line with version baseline and date, breadcrumb footer, styled consistently with
    `ai-conversational-channels-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf` and `azure-cheat-sheet.pdf`; content covers:
    architectures, latency budget, turn-taking checklist, STT/TTS provider and local-model table with licences, audio formats,
    realtime API transports, ElevenLabs custom-LLM setup, Pipecat/LiveKit skeletons, Twilio ConversationRelay vs. Media Streams
    message tables, Asterisk ARI External Media/AudioSocket/chan_websocket snippets, Spring AI audio APIs, production checklist.
  - [x] Task 19.2. Render with headless Chrome/Chromium; verify it is **exactly one A4 page** (e.g. `pdfinfo`) and legible;
    commit only the PDF.

### Group 5 — Cross-links in existing pages (Parallelizable: yes — each task edits different existing files)

- [x] **Task 20. Android and Apple media pages**: one sentence each in
  `apps/android/device-features-camera-location-sensors-media.adoc` and `apps/apple/camera-media-and-photos.adoc` linking
  `ai/voice-agents/elevenlabs-agents.adoc` / `browser-voice.adoc` for voice-agent SDKs.
- [x] **Task 21. `backend/springboot/reactive-programming.adoc`**: link `ai/voice-agents/building-a-voice-pipeline-by-hand.adoc`.
- [x] **Task 22. Replace "planned"/plain-prose Voice Agents mentions with real xrefs** in the pages listed under "Current code
  state" (`ai/langchain/*`, `ai/spring-ai/*`, `ai/hugging-face/*`, `ai/mcp/*`, `ai/llm-foundations/multimodal-models.adoc`,
  `ai/conversational-channels/*`), pointing at the most specific new page; keep existing anchors intact and leave LLMOps and AI
  Security as prose.

### Group 6 — Sub-section validation (Parallelizable: no — checks depend on all previous groups)

- [x] **Task 23. Static checks**: (a) no admonition blocks under `pages/ai/voice-agents/` and the partial contains only the
  disclosure + bibliography pointer; (b) every page has `:description:`, `:keywords:`, the include, versions in its intro,
  `== References`; (c) every code block is followed by an official-docs link; (d) every source in the issue's bibliography is
  linked in `index.adoc`; (e) no `xref:` to non-existent pages; (f) SVGs named `ai-voice-agents-*.svg` and readable in
  light/dark; (g) no book text/PDFs committed; (h) secrets scan with the `iru-check-security` skill.
- [x] **Task 24. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml`** (delegate via the `iru-gate-runner` agent,
  or `/iru-build-docs`); fix every xref, AsciiDoc or Mermaid error or warning introduced by this sub-section and confirm the
  site renders the new pages (nav, images, PDF link, MathJax).

### Group 7 — Integration-branch verification (Parallelizable: no — strictly sequential; each step depends on the previous result)

- [x] **Task 25. Merge the latest `origin/feature/213-ai-section` into `feature/210`** and resolve conflicts. Expected conflict
  points: the AI block in `modules/ROOT/nav.adoc`, `ai/index.adoc` → `== Sub-sections`, and the `:keywords:` of the root and AI
  index pages. Keep every sibling's entries, in the fixed sub-section order.
  - Result: already up to date, no merge needed (`git log HEAD..origin/feature/213-ai-section` empty after fetch).
- [x] **Task 26. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml` (or `/iru-build-docs`) on the merged
  result.** Must finish with no xref, AsciiDoc or Mermaid errors.
  - Result: `npm run validate:mermaid` parsed all 720 diagrams; `npx antora antora-playbook.yml` exit 0, no errors or warnings; 15 voice-agents pages built.
- [x] **Task 27. Compute merge readiness** for the prerequisites #208 and #200 (`gh pr list --base feature/213-ai-section
  --state merged --json number,headRefName,title`; squash merges make the PR list authoritative) and record this block for
  the PR body:

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: <#208 ✅/⏳>, <#200 ✅/⏳> merged into feature/213-ai-section
  - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
  - Status: <✅ READY: can be merged into feature/213-ai-section after human review | ⏳ WAIT: keep as draft until prerequisites are merged, then re-merge feature/213-ai-section and rebuild>
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```

  Filled (computed 2026-10-01; #208 merged as PR #226, #200 merged as PR #223):

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: #208 ✅ merged into feature/213-ai-section (PR #226), #200 ✅ merged into feature/213-ai-section (PR #223)
  - Antora build + Mermaid validation on the merged result: ✅ passed
  - Status: ✅ READY: can be merged into feature/213-ai-section after human review
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```
