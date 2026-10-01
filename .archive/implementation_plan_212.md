# Implementation plan — AI Security & Responsible AI sub-section (issue #212)

## Task summary

Add the **AI Security & Responsible AI** sub-section, the last of the 15, under *Guides & References / AI* at
`modules/ROOT/pages/ai/security/`: 21 pages (landing page with bibliography, 19 topic pages, cheat-sheet page) plus the
one-page A4 PDF. It is the section's security and governance reference: LLM trust boundaries and threat modelling, the OWASP
Top 10 for LLM Applications (2026, with 2023 → 2025 → 2026 mapping) and for Agentic Applications, concrete defences for each
risk, guardrails, AI red teaming, LLMSecOps, securing the developer toolchain, NIST AI RMF / AI 600-1, the EU AI Act and
responsible-AI practice. Running scenario: *Attacking and defending DocsAssistant*. Each risk page follows
Attack → Defend (Python + Java) → Test (garak / PyRIT / promptfoo) → Map (OWASP 2026 ID, MITRE ATLAS, NIST 600-1 risk).

Source: GitHub issue #212 (labels: documentation, enhancement — classified as a feature)

Base branch: feature/213-ai-section

Working branch: feature/212

Choices made on the user's behalf (challenge them in review):
- Documentation-only task: no `*-code-one-task` skill applies, so tasks carry no language tag and are implemented directly.
  Python, Java and YAML snippets are illustrative, written from current official docs, and not compiled by this repo.
- One PR, as for #208–#211. Groups 2–5 are separable if a split is wanted.
- Antora only fails on unresolved xrefs at build, so the nav and all cross-links are written up front and validated together
  in Group 8.
- All 14 sibling sub-sections now exist, so sibling xrefs are used, each only after confirming the target page exists.
  `ai-catalog::skills/iru-check-security.adoc` is used only if it exists on that repository's `main`; otherwise it is named
  in prose.
- Time-sensitive facts are verified against **primary sources** in Task 1.1 and dated; page text follows the sources, not
  the issue: OWASP LLM 2026 ordering (genai.owasp.org / official repository), OWASP Agentic ASI01–ASI10 names (official
  PDF), NIST AI 600-1 risk list, EU AI Act dates incl. the Digital Omnibus on AI (EUR-Lex / Commission), garak / PyRIT /
  promptfoo / Llama Guard / NeMo Guardrails / Guardrails AI current APIs, commercial vendor names (only open-source tools
  are named in depth).
- Attacks are shown minimally and defensively (no jailbreak catalogues). Red-team tooling cannot be run against a live
  DocsAssistant here: pages state which commands were documented from official docs only; no results are invented.
- The EU AI Act page states in prose that it is not legal advice. Admonitions are used only in the disclaimer partial.
- No book PDFs (`~/Desktop/ai`) are committed; books are paraphrased and credited only.

Merge constraints: this PR targets `feature/213-ai-section`, never `main`. It stays a **draft** until its hard dependencies
#206, #208, #209 and #210 are merged there. The PR body uses `Refs #212`, not `Closes`. The final integration PR
(`feature/213-ai-section` → `main`, owned by #213) closes the issue. After this PR merges, tell the user that all 15
sub-sections are in and the final PR can be opened.

## Current code state

- `antora.yml` (component `irurueta`), `modules/ROOT/nav.adoc`, `modules/ROOT/pages/index.adoc`, `package.json`
  (`npm run validate:mermaid` → `scripts/validate-mermaid.mjs`), Antora 3.1.15 with lunr, mermaid and mathjax extensions.
- The AI block in `nav.adoc` starts at `** xref:ai/index.adoc[AI]`; the LLMOps block starts at line 1304 and is the last AI
  block, followed by `** xref:git-and-github/index.adoc[Git & GitHub]`. The new
  `*** xref:ai/security/index.adoc[AI Security & Responsible AI]` block goes right after LLMOps.
- `modules/ROOT/pages/ai/index.adoc`: line 106 is
  `* AI Security & Responsible AI -- … (planned)` — replace with an xref bullet; `:keywords:` (line 3) needs the new terms;
  line ~205 (Wilson entry) says "will also be cited by the planned AI Security & Responsible AI sub-section" — turn into an
  xref and add "Cited on" entries for the other cited books (Albada, Huyen, Aryan, Mendelevitch & Bao, Walls, Osmani).
  Mermaid at line 35 already shows `Security`.
- `modules/ROOT/pages/index.adoc`: only its `:keywords:` line changes (the `ai.svg` picker already exists).
- Templates to mirror: `ai/llmops/index.adoc`, `ai/llmops/cheat-sheet.adoc`, partial `ai-llmops-disclaimer.adoc`, PDF
  `ai-llmops-cheat-sheet.pdf` (plus `vector-rag-cheat-sheet.pdf`, `azure-cheat-sheet.pdf`), SVGs `ai-llmops-*.svg`.
  Structural precedent plans: `.archive/implementation_plan_211.md`, `_210.md`, `_209.md`, `_208.md`.
- Existing link targets (verified present): `database/vector-rag/production-considerations.adoc`,
  `apps/apple/apple-intelligence-and-machine-learning.adoc`, `backend/docker/security.adoc`,
  `backend/docker/image-best-practices-and-security.adoc`, `backend/springboot/spring-security.adoc`,
  `cloud/azure/key-vault-and-secrets.adoc`, `cloud/azure/governance-and-compliance.adoc`, `ai/mcp/security.adoc`,
  `ai/cli-for-agents/security.adoc`, `ai/agents/agent-guardrails-and-safety.adoc`,
  `ai/rag-systems/{access-control-and-privacy,guardrails-and-prompt-injection,hallucination-detection-and-correction}.adoc`,
  `ai/llm-foundations/hallucinations-and-limitations.adoc`,
  `ai/ai-assisted-development/securing-ai-assisted-development.adoc`,
  `ai/customizing-ai-workflows/security-of-customizations.adoc`, `ai/langchain/guardrails-and-security.adoc`,
  `ai/spring-ai/security-and-guardrails.adoc`, `ai/llmops/*`. Other target names (backend/oauth/*, Hugging Face,
  Local LLMs, channels, voice pages) are confirmed in Task 1.1.
- Existing pages with "planned AI Security" prose to turn into real xrefs (keep anchors intact):
  `ai/mcp/security.adoc:690`, `ai/mcp/index.adoc:217`, `ai/agents/agent-guardrails-and-safety.adoc:17`,
  `ai/langchain/guardrails-and-security.adoc:22,524`, `ai/langchain/index.adoc:329`,
  `ai/spring-ai/security-and-guardrails.adoc:51`, `ai/spring-ai/index.adoc:405`,
  `ai/rag-systems/guardrails-and-prompt-injection.adoc:19`, `ai/conversational-channels/operating-chat-channels.adoc:421`,
  `ai/ai-assisted-development/{securing-ai-assisted-development.adoc:282-287,team-practices-and-adoption.adoc:162}`,
  `ai/customizing-ai-workflows/security-of-customizations.adoc:343-345`, `ai/llm-foundations/{hallucinations-and-limitations.adoc:76,ai-application-architecture.adoc:40}`,
  `ai/local-llms/running-local-llms-in-production.adoc:184`, `ai/hugging-face/index.adoc:396`,
  `ai/voice-agents/{telephony-with-asterisk-and-sip:646,livekit-agents:257,production-voice-agents:180,index:255,building-a-voice-pipeline-by-hand:657}.adoc`,
  `ai/llmops/{index:224,serving-at-scale:659,rag-and-agent-evaluation:588,evaluation-in-ci:738,evaluation-methodology:545,comparative-evaluation-and-arenas:490,deployment-and-release-patterns:432,online-evaluation-and-feedback:234,operational-governance:159,data-operations:149,cost-management:386,metrics-dashboards-and-alerting:671,llm-as-a-judge:537,building-eval-sets:67}.adoc`.
  Line numbers are approximate; re-grep `AI Security` before editing.
- `.gitignore` ignores `/build/`, `/node_modules/`, `/.idea/`.

## Page conventions (apply to every page task below)

- Header: `= Title`, `:description:`, `:keywords:`, `include::partial$ai-security-disclaimer.adoc[]`; intro states the
  versions written against, verified and dated at implementation time (use the real date then).
- Ends with `== References` (official docs, specs and papers only). Every code example is followed by a link to the official
  page it derives from; code is written from current official docs, never copied from a book. Where a book is outdated (e.g.
  Wilson's OWASP v1.1), say so in prose and show the current list/API. Paraphrase and credit books; no verbatim book text or
  code.
- No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks other than the one in the disclaimer partial; version notes,
  deprecations, security, legal and pricing caveats go in prose or table rows.
- Add `[mermaid]` blocks or `ai-security-*.svg` (legible in light and dark) where a picture clarifies; floors from the issue:
  framework map (SVG, index), trust-boundary diagram (SVG), threat-model flow (Mermaid), guardrail layers (Mermaid).
  MathJax for the denial-of-wallet bound \( C_{max} = R \cdot (n_{in}^{max}p_{in} + n_{out}^{max}p_{out}) \) and any other
  formula that makes a concept precise.
- Risk pages: Attack (minimal, defensive) → Defend in Python (LangChain middleware / guardrails) and Java (Spring AI advisors
  / Spring Security) → Test (garak / PyRIT / promptfoo) → Map (OWASP LLM 2026 ID, MITRE ATLAS technique, NIST 600-1 risk).
- Sibling xrefs only to pages confirmed to exist.

## Implementation steps

### Group 1 — Scaffolding and landing page (Parallelizable: no — Tasks 2–4 edit shared files and Task 2 needs the partial and version facts from Task 1)

- [x] **Task 1. Verify the version baseline and create the disclaimer partial**
  - [x] Task 1.1. Verify against primary sources and record with today's date: OWASP Top 10 for LLM Applications 2026
    (ordering, names, publication date; compare with 2025 and v1.1), OWASP Top 10 for Agentic Applications (ASI01–ASI10
    names from the official PDF), MITRE ATLAS technique IDs used, MAESTRO, NIST AI RMF 1.0 and AI 600-1 (the 12 risks), EU AI
    Act (Reg. (EU) 2024/1689) timeline incl. GPAI (2025-08-02), Art. 50 and the Digital Omnibus on AI changes on
    EUR-Lex / the Commission site, garak, PyRIT, promptfoo, Llama Guard / Prompt Guard, NeMo Guardrails, Guardrails AI,
    ShieldGemma, Presidio, LangChain guardrail/PII/HITL middleware, Spring AI `SafeGuardAdvisor` / `ModerationModel`,
    Sigstore model signing, CycloneDX ML-BOM, safetensors. Confirm every URL in the issue's bibliography resolves; confirm
    whether `ai-catalog::skills/iru-check-security.adoc` exists on `ai-catalog` `main`; confirm the exact page names that
    will be xref'd (backend/oauth/*, `ai/hugging-face/*`, `ai/local-llms/*`, `ai/rag-systems/*`, `ai/agents/*`,
    `ai/conversational-channels/*`, `ai/voice-agents/*`).
    - Verified 2026-10-01 against official pages and registries; recorded in the Version baseline table of `ai/security/index.adoc`. Not retrievable here: official Agentic PDF text and EUR-Lex (Omnibus details from the Commission timeline page plus law-firm reports).
  - [x] Task 1.2. Create `modules/ROOT/partials/ai-security-disclaimer.adoc` containing only the single `[IMPORTANT]` block:
    the house AI-assistance disclosure plus the pointer `xref:ai/security/index.adoc#_bibliography[bibliography]` (mirror
    `ai-llmops-disclaimer.adoc`).
    - Created `modules/ROOT/partials/ai-security-disclaimer.adoc`.
- [x] **Task 2. Create `modules/ROOT/pages/ai/security/index.adoc`**
  - [x] Task 2.1. Header, intro with dated version baseline, why LLM security is different (non-determinism, natural-language
    attack surface, excessive autonomy), reading path, the framework map (SVG `ai-security-framework-map.svg`: OWASP LLM /
    OWASP Agentic / MITRE ATLAS / NIST AI RMF & 600-1 / EU AI Act), the DocsAssistant attack-and-defend scenario, a
    `== Version baseline` table.
  - [x] Task 2.2. Write `== Bibliography` from the issue: the requester-provided books (Wilson, Albada, Huyen, Aryan,
    Mendelevitch & Bao, Walls, Osmani) with full bibliographic data, publisher page and companion code repository where one
    exists; then official documentation, specifications and standards, papers and engineering articles; every source linked
    and verified to resolve; close with the house-style note. No PDFs committed.
  - Files: `modules/ROOT/pages/ai/security/index.adoc`, `modules/ROOT/images/ai-security-framework-map.svg` (docs only: no tests or coverage).
- [x] **Task 3. Update `modules/ROOT/nav.adoc`**: add `*** xref:ai/security/index.adoc[AI Security & Responsible AI]` and a
  `****` child for each of the other 20 pages grouped like the outline (Foundations, OWASP Lists, Risks and Defences,
  Controls and Processes, Governance and Regulation, Cheat Sheet (PDF) last), placed after the LLMOps block and before
  Git & GitHub.
  - Files: `modules/ROOT/nav.adoc` (parent entry + 19 child entries; the outline defines 19 other pages, not 20).
- [x] **Task 4. Update the landing pages**
  - [x] Task 4.1. `modules/ROOT/pages/ai/index.adoc`: turn the "planned" Security bullet (line 106) into an xref bullet; append
    security terms to `:keywords:`; turn the Wilson "planned" note into an xref and add `security` bibliography xrefs to the
    "Cited on" lists of the other cited books.
    - Files: `modules/ROOT/pages/ai/index.adoc`.
  - [x] Task 4.2. `modules/ROOT/pages/index.adoc`: append the same terms to `:keywords:` (do not touch the picker image).
    - Files: `modules/ROOT/pages/index.adoc` (keywords only).

### Group 2 — Foundations and OWASP lists (Parallelizable: yes — one new file per task, no shared files; tasks link to page names fixed by Task 3's nav)

- [x] **Task 5. `trust-boundaries-and-threat-modeling.adoc`**: LLM-app architecture and trust boundaries (users, model,
  training data, retrieved/live data, tools, internal services, other agents); STRIDE applied to LLM apps; MAESTRO for
  agents; MITRE ATLAS techniques; worked threat model of DocsAssistant; SVG `ai-security-trust-boundaries.svg`; Mermaid
  threat-model flow.
  - Created `pages/ai/security/trust-boundaries-and-threat-modeling.adoc` and `images/ai-security-trust-boundaries.svg`; Mermaid validated.
- [x] **Task 6. `owasp-top-10-for-llm-applications.adoc`**: the 2026 list with a one-paragraph summary and link to the page
  that treats each risk; the 2023 → 2025 → 2026 mapping table; how to use the list in design reviews.
  - Created `pages/ai/security/owasp-top-10-for-llm-applications.adoc`.
- [x] **Task 7. `owasp-top-10-for-agentic-applications.adoc`**: ASI01–ASI10 with an agent-specific example each and a link to
  its defence page; relationship to the LLM list.

### Group 3 — Risks and defences (Parallelizable: yes — one new file per task, no shared files)

  - Created `pages/ai/security/owasp-top-10-for-agentic-applications.adoc`; ASI names flagged for re-check against the official PDF.
- [x] **Task 8. `prompt-injection.adoc`**: direct vs. indirect injection (documents, web, tool results, email, MCP tool
  descriptions); jailbreak families (defensive); why it cannot be fully solved; layered defences (structured prompts,
  least-privilege tools, human approval for writes, classifiers, spotlighting, dual-LLM / CaMeL-style separation, canary
  tokens); LangChain guardrail middleware and Spring AI `SafeGuardAdvisor` / custom advisors; links to the Apple page and
  `agent-guardrails-and-safety.adoc`.
- [x] **Task 9. `sensitive-information-and-hidden-context.adoc`**: training/fine-tuning leakage; RAG over-sharing;
  memorisation; hidden context exposure (system prompts, tool schemas, memory), no secrets in prompts; PII detection and
  redaction (Presidio, LangChain `PIIMiddleware`); data classification before hosted models; local models for sensitive data.
- [x] **Task 10. `excessive-agency-and-tool-security.adoc`**: least privilege; narrow typed tools vs. shell/SQL; parameter
  validation; confirmation for destructive actions; per-user authorisation (`@PreAuthorize`, HITL middleware); sandboxing
  code execution; budgets and step limits; MCP security (tool poisoning, rug pulls, confused deputy, token passthrough, SSRF,
  local server compromise, third-party servers); links to `ai/mcp/security.adoc` and `ai/cli-for-agents/security.adoc`.
- [x] **Task 11. `improper-output-handling.adoc`**: model output as untrusted input — XSS in chat UIs, SQL/command injection,
  SSRF from generated URLs, Markdown image exfiltration; encoding and sanitising; schema-validated structured output; safe
  rendering in web and chat channels (link Conversational Channels).
- [x] **Task 12. `rag-and-vector-security.adoc`**: document-level ACL in the retrieval filter; tenant isolation; embedding
  inversion and PII in embeddings; data and model poisoning via ingestion; provenance and signing; ingestion sanitisation;
  link `database/vector-rag/production-considerations.adoc` and RAG Systems access control.
- [x] **Task 13. `supply-chain-security.adoc`**: model provenance; safetensors vs. pickle; Hub malware and pickle scanning;
  pinning revisions by commit SHA; CycloneDX ML-BOM / AI-BOM; model and dataset cards; Sigstore model signing; package
  hallucination / slopsquatting; third-party plugins, skills and MCP servers; link Hugging Face and
  `backend/docker/image-best-practices-and-security.adoc`.
- [x] **Task 14. `unbounded-consumption-and-denial-of-wallet.adoc`**: token flooding and context exhaustion; recursive agent
  loops; per-user and per-key rate limits; max tokens and step limits; gateway budgets; cost anomaly alerts; model
  extraction; MathJax worst-case cost bound; link LLMOps cost management.
- [x] **Task 15. `misinformation-and-hallucination-risk.adoc`**: legal and reputational cases; grounding and citation
  requirements; abstention; domain limitation (RAISE step 1); user education and disclosure; package and API hallucination in
  coding assistants; link `hallucinations-and-limitations.adoc` and RAG hallucination detection.

### Group 4 — Controls and processes (Parallelizable: yes — one new file per task, no shared files)

- [x] **Task 16. `guardrails.adoc`**: input / retrieval / output / action layer architecture (Mermaid); Llama Guard / Prompt
  Guard, NeMo Guardrails, Guardrails AI, ShieldGemma; provider moderation APIs; Spring AI `ModerationModel`; latency
  trade-offs; fail-open vs. fail-closed.
- [x] **Task 17. `ai-red-teaming.adoc`**: red teaming vs. pen testing; planning and scoping; garak (probes, detectors), PyRIT
  (orchestrators, scorers), promptfoo red-team configs; CI integration example against DocsAssistant; reporting and triage;
  MITRE ATLAS mapping.
- [x] **Task 18. `llmsecops.adoc`**: security across the LLMOps lifecycle; the audit steps (scope, threat model, controls, red
  team, data review, bias, document, monitor, remediate — paraphrased from Aryan); logging prompts and responses with a
  privacy balance; SIEM integration; AI incident response; secrets management (link Azure Key Vault); link LLMOps pages.
- [x] **Task 19. `securing-ai-assisted-development.adoc`**: security of the developer toolchain — AI-generated code
  vulnerabilities, slopsquatting, secrets exposure to assistants, permission modes and sandboxing in Claude Code and Copilot,
  hooks that block dangerous commands, reviewing third-party skills and plugins; link the AI-Assisted Development and
  Customizing AI Workflows pages (and `ai-catalog::skills/iru-check-security.adoc` only if it exists on `main`).

### Group 5 — Governance and regulation (Parallelizable: yes — one new file per task, no shared files)

- [x] **Task 20. `nist-ai-rmf.adoc`**: Govern / Map / Measure / Manage; the AI 600-1 GenAI Profile's 12 risks and suggested
  actions; mapping DocsAssistant controls to it.
- [x] **Task 21. `eu-ai-act.adoc`**: risk tiers; GPAI provider vs. deployer obligations; Art. 50 transparency; the dated
  timeline incl. Digital Omnibus changes verified on official sources; what a developer team typically documents; explicit
  "not legal advice" statement in prose.
- [x] **Task 22. `responsible-ai-practices.adoc`**: RAISE framework (paraphrased); fairness and bias testing; transparency
  and disclosure (this site's own disclaimer as an example); human oversight and escalation (Albada Ch. 13); accessibility;
  final checklist.

### Group 6 — Cheat sheet (Parallelizable: no — Task 23 lists every page and Task 24 summarises every page written in Groups 2–5)

- [x] **Task 23. `cheat-sheet.adoc`**: list what the sheet covers, cross-reference every page grouped like the nav, link
  `xref:attachment$ai-security-cheat-sheet.pdf[Download the AI Security & Responsible AI Cheat Sheet (PDF)]`.
- [x] **Task 24. `modules/ROOT/attachments/ai-security-cheat-sheet.pdf`**
  - [x] Task 24.1. Write a print-ready A4 HTML/CSS in the scratchpad directory (not committed), dense multi-column,
    colour-coded boxes, header line with version baseline and date, breadcrumb footer, styled consistently with
    `ai-llmops-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf` and `azure-cheat-sheet.pdf`; content covers every item the
    issue lists (trust boundaries, OWASP LLM 2026 with 2025 mapping, OWASP Agentic, injection defence layers, tool/MCP
    least-privilege rules, output-handling rules, RAG checklist, supply-chain controls, consumption limits, guardrail
    options table, red-teaming commands, NIST function map, dated EU AI Act timeline, RAISE checklist).
  - [x] Task 24.2. Render with headless Chrome/Chromium; verify it is **exactly one A4 page** (e.g. `pdfinfo`) and legible;
    commit only the PDF.

### Group 7 — Cross-links in existing pages (Parallelizable: yes — each task edits different existing files)

- [x] **Task 25. Issue-mandated cross-links**: `database/vector-rag/production-considerations.adoc` → `rag-and-vector-security`
  and `prompt-injection`; `apps/apple/apple-intelligence-and-machine-learning.adoc` → `prompt-injection`;
  `backend/docker/image-best-practices-and-security.adoc` → `supply-chain-security`;
  `cloud/azure/governance-and-compliance.adoc` → `eu-ai-act` and `nist-ai-rmf`.
- [x] **Task 26. Replace "planned AI Security" prose with real xrefs** in the AI pages listed under "Current code state",
  pointing at the most specific new page; keep anchors intact; reword "planned"/"does not exist yet" text accordingly.

### Group 8 — Sub-section validation (Parallelizable: no — checks depend on all previous groups)

- [x] **Task 27. Static checks**: (a) no admonition blocks under `pages/ai/security/` and the partial contains only the
  disclosure + bibliography pointer; (b) every page has `:description:`, `:keywords:`, the include, versions in its intro,
  `== References`; (c) every code block is followed by an official-docs link; (d) every source in the issue's bibliography is
  linked in `index.adoc`; (e) no `xref:` to non-existent pages; (f) SVGs named `ai-security-*.svg` and readable in
  light/dark; (g) no book text/PDFs committed; (h) secrets scan with the `iru-check-security` skill; (i) no unverified
  OWASP/EU dates left in the pages.
- [x] **Task 28. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml`** (delegate via the `iru-gate-runner`
  agent, or `/iru-build-docs`); fix every xref, AsciiDoc or Mermaid error or warning introduced by this sub-section and
  confirm the site renders the new pages (nav, images, PDF link, MathJax).
  - Done 2026-10-01: Mermaid 741/741 parse; Antora build exit 0 with 0 warnings after fixing attribute-reference warnings in math/inline code and two missing official-doc links; no new secrets.

### Group 9 — Integration-branch verification (Parallelizable: no — strictly sequential; each step depends on the previous result)

- [x] **Task 29. Merge the latest `origin/feature/213-ai-section` into `feature/212`** and resolve conflicts. Expected conflict
  points: the AI block in `modules/ROOT/nav.adoc`, `ai/index.adoc` → `== Sub-sections`, and the `:keywords:` of the root and
  AI index pages. Keep every sibling's entries, in the fixed sub-section order.
  - Result: `git rev-list --count HEAD..origin/feature/213-ai-section` = 0; `git merge` reports "Already up to date". No merge, no conflicts, nothing committed.
- [x] **Task 30. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml` (or `/iru-build-docs`) on the merged
  result.** Must finish with no xref, AsciiDoc or Mermaid errors.
  - Result: `npm run validate:mermaid` parsed all 741 diagrams; `npx antora antora-playbook.yml` exit 0 with empty output (no errors/warnings), build/site generated.
- [x] **Task 31. Compute merge readiness** for the prerequisites #206, #208, #209, #210
  (`gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`; squash merges make the PR list
  authoritative) and record this block for the PR body:

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: <#206 ✅/⏳> <#208 ✅/⏳> <#209 ✅/⏳> <#210 ✅/⏳> merged into feature/213-ai-section
  - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
  - Status: <✅ READY: can be merged into feature/213-ai-section after human review | ⏳ WAIT: keep as draft until prerequisites are merged, then re-merge feature/213-ai-section and rebuild>
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```

  - Result (recorded for the PR body):

    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #206 ✅ #208 ✅ #209 ✅ #210 ✅ merged into feature/213-ai-section
    - Antora build + Mermaid validation on the merged result: ✅ passed
    - Status: ✅ READY: can be merged into feature/213-ai-section after human review
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
