# Implementation Plan: Guides & References / Web Development — WebRTC & WebSockets

## Task summary

Source: GitHub issue #264
Base branch: main

Issue [#264](https://github.com/albertoirurueta/docs/issues/264) asks for a new **WebRTC & WebSockets** section under
*Guides & References → Web Development*, authored directly into this repo's own `ROOT` Antora component
(`modules/ROOT/pages/web/webrtc-websockets/`). It teaches how to build chat, videoconference and multiplayer-game web
apps with the WebSocket protocol (SignalR, Socket.IO for Node and Python, uWebSockets.js, Django Channels, Spring
WebFlux, Atmosphere, Swoole, Laravel Reverb), WebRTC and XMPP, ending with a bibliography and a one-page A4 cheat-sheet
PDF. The issue body is the specification; its first comment holds the full **page outline** (65 pages) and is part of the
specification (`gh issue view 264 --json comments`). Re-read both when writing each page and when auditing.

Deliverables:

1. **65 AsciiDoc pages** under `modules/ROOT/pages/web/webrtc-websockets/` (foundations 9 incl. `index.adoc`, WebSocket servers 11, WebRTC 17, XMPP 7, building applications 10, production 9, reference 2 incl. `cheat-sheet.adoc`).
2. **`modules/ROOT/attachments/webrtc-websockets-cheat-sheet.pdf`**: exactly one A4 page.
3. **`modules/ROOT/partials/webrtc-websockets-disclaimer.adoc`**, included on every page.
4. **Site wiring:** nav block before Media Optimization; bullet and metadata in `web/index.adoc`; sentence in `backend/index.adoc`; root `index.adoc` metadata.
5. **Back-links:** every "#264" prose mention replaced by an `xref:`, plus one-line back-links on the existing pages listed in the issue.
6. `webrtc-websockets-*.svg` figures in `modules/ROOT/images/` and Mermaid diagrams where the outline suggests them.

**Choices made on the user's behalf**

* **Delivery (user-confirmed):** one branch (`feature/264-webrtc-websockets-section`) and one draft PR, not the five PRs the issue suggests. The branch name differs from the issue's suggested `feature/264-webrtc-websockets`, as chosen by `/iru-issue`.
* **Running examples (user-confirmed):** the implementation may start Docker Compose stacks (Redis, coturn, mediasoup, an XMPP server) and headless Chrome with fake media devices, and install npm/pip/Maven/Composer dependencies locally, to verify examples; everything is torn down afterwards.
* **Version baseline:** use the baseline table in the issue (found 2026-10-22). **Re-verify every version, date, URL and spec status** (WHEP, Media over QUIC, WebTransport, Encoded Transform/SFrame, `WebSocketStream`, .NET 11, Swoole 6.3) against official sources before writing, and state the baseline and check date in each page intro.
* **Running scenarios:** *Chatterbox* (chat, one shared JSON wire protocol used by every server-stack page), *Huddle* (videoconference), *Pixel Arena* (game). All original; nothing copied from any source.
* **Admonitions:** the disclaimer partial (a single `[IMPORTANT]` block copied in shape from `media-optimization-web-disclaimer.adoc`) is the only admonition in the section; version notes and caveats are prose or table rows.
* **Task tags:** every task is AsciiDoc/documentation authoring with no matching `iru-*-code-one-task` skill, so tasks are untagged and implemented directly. Java, C#, Python, PHP, TypeScript, XML, YAML etc. appear only as code listings.
* **Parallelism:** pages are distinct files, so page tasks within a group are parallelizable. Pages link each other by path; forward xrefs to later groups are the only build warnings permitted until Group 9. Group order follows content dependencies (Chatterbox protocol is defined in group 2 and implemented in group 3; application pages in group 6 build on groups 3 to 5).
* **Beyond the issue's list:** `web/vapor/…` landed after the issue was written. `backend/vapor/index.adoc`, `backend/vapor/server-sent-events.adoc` and `backend/pdf-generation/jasperreports-charts.adoc` also contain "#264" mentions that the issue does not list; they are replaced too (Task 72). The nav block goes after `include::partial$nav-vapor.adoc[]` (nav.adoc line 992), right before `*** xref:web/media-optimization/index.adoc[Media Optimization]`.
* **Cross-issue references:** #263, #196, #258 are referenced in prose only, never as `xref:`.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "`modules/ROOT/partials/webrtc-websockets-disclaimer.adoc` exists, following `media-optimization-web-disclaimer.adoc`." | Task 1 |
| 2 | "`nav.adoc` has the **WebRTC & WebSockets** block under Web Development, right before Media Optimization, with the group headings and one entry per outline page in outline order; the grouped nav renders correctly." | Task 2, Task 74 |
| 3 | "`web/index.adoc` has a **WebRTC & WebSockets** bullet; `web/index.adoc`'s and the root `index.adoc`'s `:description:`/`:keywords:` are updated; `backend/index.adoc` links the section." | Task 4 |
| 4 | "Every outline page exists under `modules/ROOT/pages/web/webrtc-websockets/`" (foundations 9, servers 11, WebRTC 17, XMPP 7, building 10, production 9, reference 2) | Tasks 3, 5 to 70 |
| 5 | "Every concept explored for this issue (XMPP, WebRTC, the WebSocket protocol, SignalR, Socket.IO for Node.js and Python, uWebSockets.js, Django Channels, Spring WebFlux, Atmosphere, Swoole and Laravel Reverb) has its own page(s) with detailed information and code examples linked to the official documentation." | Tasks 13 to 23, 24 to 47, 58 to 66, 75 |
| 6 | "Every finding listed under 'Findings from the exploration' is stated, in prose, on the page(s) it concerns." | Tasks 5 to 70, Task 75 |
| 7 | "The section teaches how to build chat, videoconference and multiplayer game web applications: the three architecture pages and the three end-to-end pages exist, and each server-stack page implements the shared Chatterbox protocol." | Tasks 13 to 23, 48 to 57 |
| 8 | "Every ★ page has detailed content: explanation and all relevant APIs, wire/lifecycle view, security, common errors and pitfalls, version notes, complete runnable examples." | Tasks 5 to 70, Task 75 |
| 9 | "Every code example runs against the versions pinned in its dependency snippet (re-verified at implementation), is accompanied by a Docker Compose file where it needs infrastructure, and is followed by a link to the official documentation page it derives from. Examples contain no real secrets." | Tasks 5 to 70, Task 73, Task 76 |
| 10 | "Mermaid diagrams and `webrtc-websockets-*.svg` figures are added at least where 📊 is suggested. All Mermaid blocks pass `npm run validate:mermaid`. Every SVG is referenced by a page." | Tasks 3, 5 to 70, Task 77 |
| 11 | "The disclaimer partial is included on every page of the section. It is the only admonition in the section." | Task 1, Tasks 3 to 70, Task 78 |
| 12 | "`index.adoc`'s `== Bibliography` lists every source used, each linked to its official website. Each page has a `== References` section." | Task 71, Tasks 3 to 70, Task 78 |
| 13 | "`cheat-sheet.adoc` links `webrtc-websockets-cheat-sheet.pdf`; the PDF is a single-page A4 summary of every concept in the section." | Task 69, Task 70 |
| 14 | "The back-links listed above are added, and every '#264' prose mention in the eight pages listed is replaced with an `xref:` to the new section." | Task 72, Task 73 |
| 15 | "No `xref:` points to a page that doesn't exist: #263, #196 and #258 are referenced in prose only." | Task 74, Task 78 |
| 16 | "`npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings, and the `CLAUDE.md` image, inline-code and Mermaid checks print nothing for `build/site/.../web/webrtc-websockets`." | Task 74 |

## Current code state

No application code. Antora root component `ROOT` (`antora.yml`, `antora-playbook.yml`, `modules/ROOT/`). Docs root: this
repository root. Repository host: GitHub (`albertoirurueta/docs`). `.archive/` holds 146 archived plans; the most relevant
precedent is `.archive/implementation_plan_171.md` (Terraform: 39 pages, cheat sheet PDF, disclaimer partial, nav wiring,
back-links, group structure), plus the Windows Apps (#191) and Python pip/poetry (#305) plans.

* `modules/ROOT/nav.adoc`: Web Development block starts at `** xref:web/index.adoc[Web Development]`; the Axum and Vapor sections are included via `include::partial$nav-axum.adoc[]` / `include::partial$nav-vapor.adoc[]` (line 991 to 992), followed by `*** xref:web/media-optimization/index.adoc[Media Optimization]` (line 993). A second pair of includes at lines 1216 to 1217 belongs to a different (backend) block and is not touched. The new section appears once, so no nav partial.
* `modules/ROOT/pages/web/` has no `webrtc-websockets/` directory yet. `web/index.adoc` and `backend/index.adoc` are the landing pages to update.
* `modules/ROOT/partials/media-optimization-web-disclaimer.adoc` is the disclaimer template (a single `[IMPORTANT]` block with a bibliography xref).
* Existing material to link and not repeat (verified present): `web/aspnet/core/signalr.adoc`, `web/aspnet/mvc/signalr-2.adoc`, `web/django/channels-and-websockets.adoc`, `web/php-laravel/broadcasting-and-reverb.adoc`, `web/php-laravel/octane-and-performance.adoc`, `backend/nodejs/websockets-and-server-sent-events.adoc`, `backend/nestjs/websockets.adoc`, `web/thymeleaf/server-sent-events-and-websockets.adoc`, `ai/conversational-channels/webrtc-data-channels.adoc`, `ai/conversational-channels/xmpp-bots.adoc`, `ai/voice-agents/livekit-agents.adoc`, `backend/messaging/protocols.adoc`, plus the framework WebSocket pages listed in the issue table.
* Files containing "#264" prose to convert to `xref:`: `web/gwt/{index,requestbuilder-json-and-xml,client-server-communication-overview}.adoc`, `web/thymeleaf/{index,server-sent-events-and-websockets}.adoc`, `backend/flask/streaming-and-server-sent-events.adoc`, `backend/tornado/{websockets,streaming-long-polling-and-sse}.adoc` (as in the issue), and also `backend/vapor/{index,server-sent-events}.adoc`, `backend/pdf-generation/jasperreports-charts.adoc` (found by grep).
* Repo conventions from `CLAUDE.md` apply to every page: image macros on one line with quoted alt text when it contains a comma; inline code with `->`, `=>`, `...`, `{`, `*`, `^`, `~`, `'`, `__`, `#[` as `` `+…+` `` passthrough (`pass:c[]` when it contains `+`); Mermaid stereotypes and any `<` followed by a letter written as `&lt;`; every SVG referenced by a page.
* Tooling: `npx antora antora-playbook.yml`, `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`), headless Chrome for the PDF, `pdfinfo`, detect-secrets via `iru-check-security` (docs repo findings are false positives, label them `is_secret:false`).

## Implementation steps

### Group 1 — Scaffolding, wiring and landing page (Parallelizable: yes)

- [x] Task 1. Create `modules/ROOT/partials/webrtc-websockets-disclaimer.adoc`, a single `[IMPORTANT]` block in the shape of `media-optimization-web-disclaimer.adoc`, with the AI-assistance sentence and an xref to `web/webrtc-websockets/index.adoc#_bibliography`.
- [x] Task 2. In `modules/ROOT/nav.adoc`, add the `*** xref:web/webrtc-websockets/index.adoc[WebRTC & WebSockets]` block after `include::partial$nav-vapor.adoc[]` (line 992) and before Media Optimization: non-link `****` headings (Foundations, WebSocket Servers, WebRTC, XMPP, Building Applications, Production), one `*****` entry per outline page in outline order, then `**** … Comparison & Decision Guide` and `**** … Cheat Sheet (PDF)`.
- [x] Task 3. Write `web/webrtc-websockets/index.adoc` (landing page): audience, Chatterbox/Huddle/Pixel Arena, version baseline and check date, three reading paths, `== What's covered` grouped like the nav, "related material elsewhere on this site" table, `== References`. Include the 📊 architecture-map SVG (`webrtc-websockets-architecture-map.svg`) and a Mermaid mind-map. The `== Bibliography` is completed in Task 70.
- [x] Task 4. Update `web/index.adoc` (bullet before Media Optimization, `:description:`, `:keywords:`), `backend/index.adoc` (one sentence pointing to the section for real-time servers) and the root `modules/ROOT/pages/index.adoc` (`:description:` and `:keywords:` only, no new tile), with the exact keyword lists from the issue.

### Group 2 — Foundations (Parallelizable: yes)

Each page: header attributes, disclaimer include, intro with versions and check date, detailed explanation, runnable examples each followed by a `Source:` link to official docs, `== References`. ★ pages are the most detailed.

- [x] Task 5. `real-time-web-overview.adoc` ★ (latency budgets, the three application types, transport options, architecture choices).
- [x] Task 6. `networking-fundamentals.adoc` (TCP/UDP, HTTP/1.1, HTTP/2, HTTP/3 and QUIC, TLS, NAT, ports, proxies as they matter to real-time apps).
- [x] Task 7. `websocket-protocol.adoc` ★ (RFC 6455 handshake, framing, masking, opcodes, ping/pong, close codes, subprotocols, permessage-deflate RFC 7692, RFC 8441, RFC 9220; wire examples).
- [x] Task 8. `browser-websocket-api.adoc` ★ (WHATWG WebSocket API, events, `bufferedAmount`, `binaryType`, `WebSocketStream` Chromium-only status).
- [x] Task 9. `server-sent-events-and-long-polling.adoc`.
- [x] Task 10. `message-design-and-serialization.adoc` ★ (the Chatterbox JSON envelope `{ "v": 1, "type", "id", "room", "ts", "payload" }` with all twelve types and client-generated IDs; JSON vs binary encodings).
- [x] Task 11. `connection-lifecycle-heartbeats-and-reconnection.adoc` (reconnect with backoff and jitter, heartbeats, resume).
- [x] Task 12. `webtransport-and-media-over-quic.adoc` (W3C CR Snapshot status, Safari 26.4+, Media over QUIC as an emerging spec).

### Group 3 — WebSocket servers (Parallelizable: yes)

Every page implements the shared Chatterbox protocol from Task 10, links the existing framework page instead of repeating it, and ships dependency snippets with pinned versions and a Compose file where Redis is needed. Pin and verify each example by actually running it (Docker allowed).

- [x] Task 13. `choosing-a-websocket-stack.adoc` ★ (comparison table, decision flow, links to the framework pages listed in the issue).
- [x] Task 14. `socket-io.adoc` ★ (Node.js server and browser client, rooms, namespaces, acks, connection-state recovery, Redis adapter).
- [x] Task 15. `socket-io-protocol-and-clients.adoc` (Engine.IO/Socket.IO protocol, transports, other-language clients).
- [x] Task 16. `python-socketio.adoc` (python-socketio server, ASGI, Redis manager).
- [x] Task 17. `uwebsockets-js.adoc` (uWebSockets.js server, pub/sub, backpressure).
- [x] Task 18. `django-channels.adoc` (chat, presence and game-loop patterns on top of the existing Channels reference; no repeat of consumers/routing basics).
- [x] Task 19. `signalr.adoc` ★ (ASP.NET Core SignalR hubs, groups, streaming, scale-out, links to the two short existing SignalR pages).
- [x] Task 20. `spring-webflux-websockets.adoc` (Reactor handlers, Spring MVC STOMP contrast).
- [x] Task 21. `atmosphere.adoc`.
- [x] Task 22. `swoole.adoc` (OpenSwoole/Swoole 6.x WebSocket server, link to Octane page).
- [x] Task 23. `laravel-reverb.adoc` (Reverb server, Echo client, scaling, link to broadcasting page).

### Group 4 — WebRTC (Parallelizable: yes)

Examples needing browsers use headless Chrome with fake-device flags; those needing TURN or an SFU ship a Compose file.

- [x] Task 24. `webrtc-architecture.adoc` ★.
- [x] Task 25. `media-capture-and-devices.adoc` (`getUserMedia`, constraints, device enumeration and switching).
- [x] Task 26. `screen-sharing.adoc` (`getDisplayMedia`).
- [x] Task 27. `peer-connections-and-sdp.adoc` ★ (`RTCPeerConnection`, JSEP RFC 9429, transceivers, SDP walkthrough).
- [x] Task 28. `signaling-and-perfect-negotiation.adoc` ★ (WebSocket signalling server with `ws` and a Socket.IO variant).
- [x] Task 29. `ice-stun-and-turn.adoc` ★ (ICE, STUN, TURN, coturn with ephemeral credentials, eturnal).
- [x] Task 30. `webrtc-data-channels.adoc` ★ (reliable vs unreliable options for chat vs games; links the AI data-channel page).
- [x] Task 31. `codecs-simulcast-and-svc.adoc`.
- [x] Task 32. `stats-quality-and-bandwidth.adoc` (`getStats`).
- [x] Task 33. `recording-and-media-processing.adoc` (MediaRecorder, encoded transforms).
- [x] Task 34. `end-to-end-encryption.adoc` (SFrame, insertable streams).
- [x] Task 35. `topologies-mesh-sfu-mcu.adoc` ★.
- [x] Task 36. `mediasoup.adoc` (SFU mode of Huddle).
- [x] Task 37. `livekit.adoc` (LiveKit variant; links the voice-agent page).
- [x] Task 38. `janus-and-jitsi.adoc`.
- [x] Task 39. `pion-and-aiortc.adoc`.
- [x] Task 40. `whip-whep-and-live-streaming.adoc` (WHIP RFC 9725, WHEP draft status, contrast with HLS/DASH).

### Group 5 — XMPP (Parallelizable: yes)

An XMPP variant of Chatterbox on Prosody or ejabberd with Strophe.js / @xmpp/client and Converse.js, run from Compose.

- [x] Task 41. `xmpp-fundamentals.adoc` ★ (JID, stanzas, RFC 6120/6121/7622, XEP table).
  - Written: `xmpp-fundamentals.adoc` + `webrtc-websockets-xmpp-federation.svg`, Mermaid login sequence; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.
- [x] Task 42. `xmpp-servers.adoc` (ejabberd, Prosody, Openfire, MongooseIM, WebSocket endpoints, RFC 7395).
  - Written: `xmpp-servers.adoc`; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.
- [x] Task 43. `xmpp-in-the-browser.adoc` (Strophe.js, @xmpp/client).
  - Written: `xmpp-in-the-browser.adoc`; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.
- [x] Task 44. `xmpp-chat-features.adoc` ★ (MUC, MAM, receipts, markers, corrections, reactions, HTTP upload).
  - Written: `xmpp-chat-features.adoc`; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.
- [x] Task 45. `converse-js.adoc`.
  - Written: `converse-js.adoc`; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.
- [x] Task 46. `omemo-encryption.adoc`.
  - Written: `omemo-encryption.adoc`; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.
- [x] Task 47. `jingle-calls-and-jitsi.adoc`.
  - Written: `jingle-calls-and-jitsi.adoc`, Mermaid call sequence; Antora build clean apart from forward xrefs, CLAUDE.md checks and rendered-HTML scan clean, Mermaid validated.

### Group 6 — Building applications (Parallelizable: yes)

- [x] Task 48. `chat-architecture.adoc` ★.
- [x] Task 49. `presence-typing-and-receipts.adoc`.
- [x] Task 50. `history-offline-delivery-and-moderation.adoc`.
- [x] Task 51. `building-a-chat-app.adoc` ★ (end-to-end Chatterbox with a vanilla TypeScript client and adapters per stack; Compose with Redis).
- [x] Task 52. `videoconference-architecture.adoc` ★.
- [x] Task 53. `building-a-videoconference-app.adoc` ★ (Huddle: mesh up to four, mediasoup SFU, LiveKit variant, coturn, Compose).
- [x] Task 54. `multiplayer-game-architecture.adoc` ★ (authoritative server, 20 Hz tick, snapshots).
- [x] Task 55. `latency-compensation.adoc` ★ (prediction, reconciliation, interpolation, lag compensation).
- [x] Task 56. `game-servers-and-colyseus.adoc`.
- [x] Task 57. `building-a-multiplayer-game.adoc` ★ (Pixel Arena over WebSocket, WebRTC unreliable channel, Colyseus; binary snapshots vs JSON).

### Group 7 — Production (Parallelizable: yes)

- [x] Task 58. `authentication-and-authorization.adoc` (links CORS and OAuth pages).
- [x] Task 59. `security.adoc` ★ (Origin checks, wss, size and rate limits, TURN abuse).
- [x] Task 60. `scaling-websockets.adoc` (sticky sessions, Redis/Kafka/RabbitMQ backplanes).
- [x] Task 61. `proxies-load-balancers-and-deployment.adoc` (nginx/ingress settings; links Docker and Kubernetes sections).
- [x] Task 62. `scaling-webrtc-and-turn.adoc`.
- [x] Task 63. `observability.adoc`.
- [x] Task 64. `testing-real-time-apps.adoc`.
- [x] Task 65. `load-testing-and-capacity-planning.adoc` (links JMeter pages).
- [x] Task 66. `mobile-and-native-clients.adoc`.

### Group 8 — Reference, figures and bibliography (Parallelizable: no — Tasks 69 to 70 summarise and cite every page written in groups 1 to 7)

- [x] Task 67. `comparison-and-decision-guide.adoc` ★. -- `comparison-and-decision-guide.adoc` written (4 Mermaid flowcharts, one verified JS helper, comparisons, per-application recommendations, what-changed table); build and CLAUDE.md checks clean.
- [x] Task 68. Add the remaining original `webrtc-websockets-*.svg` figures (or Mermaid) at every 📊 in the outline; confirm no logos or third-party images. -- audited every outline marker against the pages: all 23 are covered by 20 SVGs and Mermaid blocks; no additions needed; SVGs contain no images or external hrefs and are all referenced.
- [x] Task 69. `cheat-sheet.adoc` per the issue (disclaimer, intro with baseline and date, grouped `*Group* --` xref paragraphs to every page, PDF download line, `== References`). -- `cheat-sheet.adoc` links all 63 other pages in 11 groups, PDF line and References.
- [x] Task 70. Build `modules/ROOT/attachments/webrtc-websockets-cheat-sheet.pdf`: throwaway HTML in the session scratchpad, headless Chrome print-to-PDF (`--headless --print-to-pdf --no-pdf-header-footer`), confirm exactly one A4 page with `pdfinfo`, preview as PNG, commit only the PDF. Then complete `index.adoc`'s `== Bibliography` with every source used, each linked to its official site. -- one A4 page (595 x 842 pt, checked with PyMuPDF; pdfinfo is not installed), previewed as PNG; `index.adoc` Bibliography extended with 258 additional entries (every cited source now covered).

### Group 9 — Back-links and integration (Parallelizable: yes)

- [x] Task 71. Reserved: bibliography completeness check against every page's `== References` (no page may cite a source missing from the bibliography).
- [x] Task 72. Replace each "#264" prose mention with an `xref:` to the matching new page in the 11 files listed under Current code state.
- [x] Task 73. Add the one-line back-links: `signalr.adoc` and `signalr-2.adoc` → `signalr`; `channels-and-websockets.adoc` → `django-channels`; `broadcasting-and-reverb.adoc` → `laravel-reverb`; `octane-and-performance.adoc` → `swoole`; `nodejs/websockets-and-server-sent-events.adoc` → `socket-io`, `uwebsockets-js`; `nestjs/websockets.adoc` → `socket-io`; `thymeleaf/server-sent-events-and-websockets.adoc` → `spring-webflux-websockets`; `webrtc-data-channels.adoc` → `webrtc-data-channels`; `xmpp-bots.adoc` → `xmpp-fundamentals`; `livekit-agents.adoc` → `livekit`; `messaging/protocols.adoc` → `xmpp-fundamentals`.

### Group 10 — Verification (Parallelizable: no — runs on the finished tree)

- [x] Task 74. Build with `npx antora antora-playbook.yml`: no `xref`/AsciiDoc errors or warnings; view the grouped nav in `build/site`; run every `CLAUDE.md` image, inline-code and Mermaid check on `build/site/.../web/webrtc-websockets` (and `npm run validate:mermaid` after `npm i --no-save mermaid@11 jsdom`), plus the rendered-HTML backtick/quote scan. Check no page has an admonition other than the disclaimer and every SVG is referenced.
- [x] Task 75. Audit coverage: every "Findings from the exploration" item and every ★ page's required depth against the issue; fix gaps.
- [x] Task 76. Re-run the example verification summary: confirm each example was run (or note the reason), Compose stacks are torn down, and no real secrets exist. Run the `iru-check-security` scan; label detect-secrets placeholder findings `is_secret:false`.
- [x] Task 77. Confirm figures: Mermaid blocks parse, SVGs referenced, original drawings only.
- [x] Task 78. Final checklist against `## Acceptance criteria coverage` (disclaimer on all 65 pages, `== References` on all pages, bibliography links, no `xref:` to #263, #196, #258, exactly 65 page files).
