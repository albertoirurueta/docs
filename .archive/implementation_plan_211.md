# Implementation plan — LLMOps & Evaluation sub-section (issue #211)

## Task summary

Add the **LLMOps & Evaluation** sub-section under *Guides & References / AI* at `modules/ROOT/pages/ai/llmops/`: 19 pages
(landing page with bibliography, 17 topic pages, cheat-sheet page) plus the one-page A4 PDF. It is a vendor-neutral guide to
running LLM applications in production, using the shared DocsAssistant example: evaluation (offline and online), serving at
scale, deployment and release patterns, observability with the OpenTelemetry GenAI conventions, drift monitoring, feedback
loops, cost management and operational governance.

Source: GitHub issue #211 (labels: documentation, enhancement — classified as a feature)

Base branch: feature/213-ai-section

Working branch: feature/211

Choices made on the user's behalf (challenge them in review):
- Documentation-only task: no `*-code-one-task` skill applies, so tasks carry no language tag and are implemented directly.
  Python, Java and YAML snippets are illustrative, written from current official docs, and not compiled by this repo.
- One PR, as for #208–#210. Groups 2–4 are separable if a split is wanted (group 2 = evaluation, group 3 = serving and
  observability, group 4 = cost and governance).
- Antora only fails on unresolved xrefs at build, so the nav and all cross-links are written up front and validated together
  in Group 7.
- The AI Security & Responsible AI sub-section does not exist yet (`ai/security/index.adoc` is absent): it is named in plain
  prose, never as `xref:`. Existing siblings (RAG Systems, Local LLMs, LangChain, Spring AI, Agents, MCP, Hugging Face,
  Voice Agents, Conversational Channels) are linked after confirming each target page exists.
- Facts in the issue (vLLM/SGLang versions, MLflow 3 GenAI, Langfuse licence, LangSmith/`openevals`/`agentevals`, OTel GenAI
  conventions at Development stability and the `semantic-conventions-genai` repository, Spring AI Micrometer emission,
  TGI maintenance mode) are re-checked against official docs in Task 1.1; page text follows the docs on that date, not the
  issue. Every `gen_ai.*` attribute name is pinned to a stated conventions version.
- The observability stack (Langfuse, Grafana, vLLM, LiteLLM) cannot be live-tested here: pages state which snippets were
  documented from official docs only. No benchmark numbers are quoted; serving uses a load-test harness instead.
- No book PDFs are committed; books are paraphrased and credited only. Aryan is cited as the author of *LLMOps* (attribution
  note from the issue).

Merge constraints: this PR targets `feature/213-ai-section`, never `main`. It stays a **draft** until its hard dependency
#208 is merged there (already merged as PR #226). The PR body uses `Refs #211`, not `Closes`. The final integration PR
(`feature/213-ai-section` → `main`, owned by #213) closes the issue.

## Current code state

- `antora.yml` (component `ROOT`), `modules/ROOT/nav.adoc`, `modules/ROOT/pages/index.adoc`, `package.json`
  (`npm run validate:mermaid` → `scripts/validate-mermaid.mjs`), Antora with lunr, mermaid and mathjax extensions.
- The AI block in `nav.adoc` runs from `** xref:ai/index.adoc[AI]`; the Voice Agents block starts at line 1289 and is the
  last AI block, followed by `** xref:git-and-github/index.adoc[Git & GitHub]`. The new
  `*** xref:ai/llmops/index.adoc[LLMOps & Evaluation]` block goes right after Voice Agents.
- `modules/ROOT/pages/ai/index.adoc`: line 102 is
  `* LLMOps & Evaluation -- evaluating, monitoring and operating LLM applications in production. (planned)` — replace with an
  xref bullet; `:keywords:` (line 3) needs the new terms; lines ~169–172 are the Aryan entry in `== Books used in this section`
  ending "planned LLMOps & Evaluation sub-section" — turn into an xref and add "Cited on" entries for the other cited books
  (Huyen, Albada, Mendelevitch & Bao, Oshin & Campos, Walls). Mermaid at line 35 already shows `LLMOps`.
- `modules/ROOT/pages/index.adoc`: only its `:keywords:` line changes (the `ai.svg` picker already exists).
- Templates to mirror: `ai/voice-agents/index.adoc` and `cheat-sheet.adoc`, `ai/rag-systems/index.adoc`; partial
  `ai-voice-agents-disclaimer.adoc`; PDF `ai-voice-agents-cheat-sheet.pdf` (plus `vector-rag-cheat-sheet.pdf`,
  `azure-cheat-sheet.pdf` for style); SVGs `ai-voice-agents-*.svg`. Structural precedent plans:
  `.archive/implementation_plan_210.md`, `_209.md`, `_208.md`.
- Existing link targets (verified present): `database/vector-rag/evaluating-rag-systems.adoc`,
  `database/vector-rag/production-considerations.adoc`, `database/prometheus/*` (index, recording-and-alerting-rules,
  alertmanager, grafana-dashboards-and-visualization, grafana-alerting, instrumenting-applications, promql-*),
  `backend/springboot/metrics-and-observability.adoc`, `backend/springboot/logging.adoc`,
  `backend/springboot/performance-testing-jmeter.adoc`, `backend/docker/resources-logging-and-monitoring.adoc`,
  `backend/docker/ci-cd-with-github-actions.adoc`, `apps/android/ci-cd-with-github-actions.adoc`,
  `cloud/azure/monitoring-and-observability.adoc`, `ai/local-llms/index.adoc`, `ai/rag-systems/*` (evaluation-at-scale,
  observability-and-tracing, caching-latency-and-cost, deployment-patterns, ingestion-pipelines-and-freshness),
  `ai/langchain/*` (evaluation, observability-with-langsmith), `ai/spring-ai/*` (evaluation, observability),
  `ai/agents/*` (agent-evaluation, observability-for-agents). Other page names are confirmed in Task 1.1.
- Existing pages with "planned LLMOps" prose to turn into real xrefs (keep anchors intact):
  `ai/conversational-channels/operating-chat-channels.adoc:250`, `ai/conversational-channels/index.adoc:200`,
  `ai/langchain/observability-with-langsmith.adoc:755`, `ai/langchain/index.adoc:328`, `ai/langchain/evaluation.adoc:867`,
  `ai/rag-systems/evaluation-at-scale.adoc:18`, `ai/spring-ai/observability.adoc:804`,
  `ai/spring-ai/production-and-deployment.adoc:587-590`, `ai/spring-ai/index.adoc:404`,
  `ai/agents/observability-for-agents.adoc:20,307`, `ai/agents/agent-evaluation.adoc:18`,
  `ai/agents/multi-agent-systems.adoc:164`, `ai/llm-foundations/benchmarks-and-leaderboards.adoc:140`,
  `ai/llm-foundations/managing-prompts.adoc:61`, `ai/llm-foundations/ai-application-architecture.adoc:70`,
  `ai/local-llms/running-local-llms-in-production.adoc:12`, `ai/local-llms/inference-optimization.adoc:255`,
  `ai/local-llms/index.adoc:164`, `ai/mcp/index.adoc:217`, `ai/hugging-face/index.adoc:395`,
  `ai/customizing-ai-workflows/testing-and-evaluating-skills.adoc:388`, and the Voice Agents mentions in
  `ai/voice-agents/{index,production-voice-agents,building-a-voice-pipeline-by-hand,livekit-agents}.adoc`.
  (`ai/voice-agents/*` lines say "planned"; reword to a link.) Security mentions stay prose.
- `.gitignore` ignores `/build/`, `/node_modules/`, `/.idea/`.

## Page conventions (apply to every page task below)

- Header: `= Title`, `:description:`, `:keywords:`, `include::partial$ai-llmops-disclaimer.adoc[]`; intro states the versions
  written against, verified and dated at implementation time (use the real date then).
- Ends with `== References` (official docs, specs and papers only). Every code example is followed by a link to the official
  page it derives from; code is written from current official docs, never copied from a book. Where a book is outdated (e.g.
  Aryan's Jenkins/Triton-centred practices, TGI), say so in prose and show the current API. Paraphrase and credit books; no
  verbatim book text or code.
- No `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks other than the one in the disclaimer partial; version notes,
  deprecations, security, licence and pricing caveats go in prose or table rows.
- Add `[mermaid]` blocks or `ai-llmops-*.svg` (legible in light and dark) where a picture clarifies; the 📊 figures in the
  issue are a floor: lifecycle loop (Mermaid), maturity levels (SVG), PR → eval → gate (Mermaid), shadow vs. canary (Mermaid),
  DocsAssistant trace waterfall (SVG). MathJax (`\( \)` / `\[ \]`) for every formula named in the issue.
- Running scenario: DocsAssistant in production (golden eval set, CI gates, vLLM/Ollama behind LiteLLM, OTel → Langfuse and
  Prometheus/Grafana, sampled online judging, feedback widget, monthly cost report). Python for evaluation tooling, Java for
  Spring AI evaluators / Micrometer / JUnit gates, YAML for GitHub Actions, Prometheus rules, vLLM and LiteLLM config.
- Sibling xrefs only to pages confirmed to exist; Security named in prose.

## Implementation steps

### Group 1 — Scaffolding and landing page (Parallelizable: no — Tasks 2–4 edit shared files and Task 2 needs the partial and version facts from Task 1)

- [x] **Task 1. Verify the version baseline and create the disclaimer partial**
  - [x] Task 1.1. Verify against current official docs/registries and record with today's date: vLLM and SGLang releases and
    metrics, TGI status, KServe, LiteLLM proxy, MLflow 3 GenAI (tracing, scorers, judges, prompt registry), Langfuse (licence,
    self-host Docker Compose, OTel ingestion), LangSmith evaluation and `openevals`/`agentevals`, Arize Phoenix, RAGAS,
    DeepEval, OpenTelemetry GenAI semantic conventions (stability level, repository `semantic-conventions-genai`, attribute
    and metric names, MCP and agent spans), OpenLLMetry, Spring AI observability (Micrometer → OTLP) and evaluators on the
    current Spring Boot, Prometheus and Grafana versions. Confirm every URL in the issue's bibliography resolves and the exact
    page names under `ai/langchain/`, `ai/spring-ai/`, `ai/rag-systems/`, `ai/agents/`, `ai/local-llms/` that will be xref'd.
  - [x] Task 1.2. Create `modules/ROOT/partials/ai-llmops-disclaimer.adoc` containing only the single `[IMPORTANT]` block: the
    house AI-assistance disclosure plus the pointer `xref:ai/llmops/index.adoc#_bibliography[bibliography]` (mirror
    `ai-voice-agents-disclaimer.adoc`).
- [x] **Task 2. Create `modules/ROOT/pages/ai/llmops/index.adoc`**
  - [x] Task 2.1. Header, intro with dated version baseline, what LLMOps is, LLMOps vs. MLOps vs. DevOps, the lifecycle loop
    (Mermaid), the maturity model (SVG `ai-llmops-maturity-levels.svg`), the DocsAssistant running scenario, reading path and
    a `== Version baseline` table.
  - [x] Task 2.2. Write `== Bibliography` from the issue: the six requester-provided books (full bibliographic data,
    publisher page, companion code repository where one exists, Aryan attribution note), then evaluation tools,
    observability platforms, OpenTelemetry GenAI, Spring AI observability, serving, gateway, metrics and alerting, and the
    papers; every source linked and verified to resolve; close with the house-style note. No PDFs committed.
- [x] **Task 3. Update `modules/ROOT/nav.adoc`**: add `*** xref:ai/llmops/index.adoc[LLMOps & Evaluation]` and a `****` child
  for each of the other 18 pages grouped like the outline (Evaluation, Serving and Deployment, Observability, Cost and
  Governance, Cheat Sheet (PDF) last), placed after the Voice Agents block and before Git & GitHub.
- [x] **Task 4. Update the landing pages**
  - [x] Task 4.1. `modules/ROOT/pages/ai/index.adoc`: turn the "planned" LLMOps bullet (line 102) into an xref bullet with a
    short description; append LLMOps terms to `:keywords:`; turn the Aryan "planned" note into an xref and add `llmops`
    bibliography xrefs to the "Cited on" lists of the other cited books.
  - [x] Task 4.2. `modules/ROOT/pages/index.adoc`: append the same terms to `:keywords:` (do not touch the picker image).
  - Group 1 done: files `partials/ai-llmops-disclaimer.adoc`, `pages/ai/llmops/index.adoc`, `images/ai-llmops-maturity-levels.svg`, `nav.adoc`, `pages/ai/index.adoc`, `pages/index.adoc`. `npm run validate:mermaid` passes; `npx antora` exits 0 with only the 18 expected unresolved xrefs to not-yet-written llmops pages.

### Group 2 — Evaluation pages (Parallelizable: yes — one new file per task, no shared files; tasks link to page names fixed by Task 3's nav)

- [x] **Task 5. `evaluation-methodology.adoc`**: why open-ended evaluation is hard; component vs. system evals; reference-based
  vs. reference-free; functional correctness and pass@k and perplexity (MathJax); lexical (BLEU, ROUGE) and semantic
  (BERTScore, embedding similarity) metrics with Python examples; when each metric misleads.
- [x] **Task 6. `llm-as-a-judge.adoc`**: judge prompts and rubrics; pointwise vs. pairwise; position/verbosity/self-preference
  biases and mitigations; calibration against human labels with Cohen's κ (MathJax); specialised judge models; examples with
  `openevals`, MLflow 3 judges and Spring AI `RelevancyEvaluator`/`FactCheckingEvaluator`.
- [x] **Task 7. `comparative-evaluation-and-arenas.adoc`**: pairwise preference; Elo and Bradley–Terry (MathJax); internal A/B
  arenas; sample sizes and a binomial confidence interval (MathJax); Python example computing ratings.
- [x] **Task 8. `building-eval-sets.adoc`**: golden sets from real traffic and from docs; synthetic generation and pitfalls;
  coverage of intents and edge cases; dataset versioning; sample-size rule of thumb; labelling workflows; LangSmith datasets,
  MLflow datasets and a CSV/JSONL convention.
- [x] **Task 9. `rag-and-agent-evaluation.adoc`**: link `database/vector-rag/evaluating-rag-systems.adoc` for IR metrics and
  RAGAS basics; reference-free RAG metrics; agent evals (final response, single step, trajectory, tool-call accuracy, cost per
  task) with `agentevals` and DeepEval examples.
- [x] **Task 10. `evaluation-in-ci.adoc`**: GitHub Actions regression gates on prompt/model/chunking/index changes; thresholds
  and flakiness (repeat runs); judge-call caching; eval cost; JUnit gates in Spring; the LangSmith pytest plugin; PR → eval →
  gate Mermaid; link the CI/CD pages.
- [x] **Task 11. `online-evaluation-and-feedback.adoc`**: async sampled judging; explicit and implicit feedback signals;
  feedback biases and degenerate loops; the evaluation flywheel into the golden set; Bayesian bandits with Thompson sampling
  (MathJax) and a Python example.

### Group 3 — Serving, deployment and observability pages (Parallelizable: yes — one new file per task, no shared files)

- [x] **Task 12. `serving-at-scale.adoc`**: vLLM/SGLang in production; continuous batching; prefix caching; KV-cache sizing;
  tensor/pipeline/data parallelism; disaggregated prefill/decode; autoscaling on queue depth and KV utilisation; KServe and
  Kubernetes notes; TGI status; a load-test harness instead of quoted numbers; TTFT/TPOT/goodput/MBU (MathJax); link Running
  LLMs Locally and the JMeter page.
- [x] **Task 13. `deployment-and-release-patterns.adoc`**: API-first design; LiteLLM gateway (routing, fallbacks, keys,
  budgets); versioning prompts and models separately from code; shadow/canary/A/B releases; prompt feature flags; rollback;
  vendor model-version pinning; shadow vs. canary Mermaid.
- [x] **Task 14. `observability-with-opentelemetry.adoc`**: OTel GenAI semantic conventions (spans for model calls, agents,
  tools, MCP; `gen_ai.*` attributes; token usage metrics) pinned to a version and marked Development stability; content
  capture and privacy; Python (OTel SDK, OpenLLMetry) and Spring AI (Micrometer → OTLP) instrumentation; trace context
  through MCP `_meta`; DocsAssistant trace waterfall SVG `ai-llmops-trace-waterfall.svg`.
- [x] **Task 15. `observability-platforms.adoc`**: LangSmith, Langfuse (self-hosted Docker Compose), MLflow 3 GenAI, Arize
  Phoenix, Grafana/Tempo/Loki; comparison table (licence, self-host, OTel native, evals, prompt management); wiring
  DocsAssistant to Langfuse and Phoenix.
- [x] **Task 16. `metrics-dashboards-and-alerting.adoc`**: golden signals for LLM apps; Prometheus recording and alert rules;
  Grafana dashboard JSON; SLOs for LLM features; link `database/prometheus/*`.
- [x] **Task 17. `drift-and-regression-monitoring.adoc`**: vendor model updates; input/data drift with a MathJax distance;
  output drift; periodic regression runs; alerting on judge-score drops; pinning and re-validation.

### Group 4 — Cost and governance pages (Parallelizable: yes — one new file per task, no shared files)

- [x] **Task 18. `cost-management.adoc`**: token-cost model (MathJax); prompt caching; batch APIs; routing and cascades; context
  trimming; semantic caching; gateway budgets/quotas; per-tenant attribution; self-hosting break-even method (no prices);
  denial-of-wallet alerts (Security named in prose); link `database/vector-rag/production-considerations.adoc`.
- [x] **Task 19. `prompt-and-model-management.adoc`**: prompt registries (MLflow, LangSmith, Langfuse); versioning and approvals;
  model catalogue and allow-list; reproducibility; model/system cards.
- [x] **Task 20. `data-operations.adoc`**: the 10-step preprocessing pipeline (paraphrased); dataset lineage; PII handling;
  vector-index freshness SLAs; backups and restore tests; link `ai/rag-systems/ingestion-pipelines-and-freshness.adoc`.
- [x] **Task 21. `operational-governance.adoc`**: roles and metric owners; runbooks and incident response (hallucination
  incidents, provider outages); audit trail; maturity self-assessment checklist; Security and regulations named in prose.

### Group 5 — Cheat sheet (Parallelizable: no — Task 22 lists every page and Task 23 summarises every page written in Groups 2–4)

- [x] **Task 22. `cheat-sheet.adoc`**: list what the sheet covers, cross-reference every page grouped like the nav, link
  `xref:attachment$ai-llmops-cheat-sheet.pdf[Download the LLMOps & Evaluation Cheat Sheet (PDF)]`.
- [x] **Task 23. `modules/ROOT/attachments/ai-llmops-cheat-sheet.pdf`**
  - [x] Task 23.1. Write a print-ready A4 HTML/CSS in the scratchpad directory (not committed), dense multi-column,
    colour-coded boxes, header line with version baseline and date, breadcrumb footer, styled consistently with
    `ai-voice-agents-cheat-sheet.pdf`, `vector-rag-cheat-sheet.pdf` and `azure-cheat-sheet.pdf`; content covers the lifecycle
    and maturity levels, metric catalogue with formulas, judge rubric and bias checklist, eval-set rules, CI gate snippet,
    online-eval sampling, serving metrics, release patterns, OTel `gen_ai.*` attributes, platform comparison, alert rules,
    cost formula and levers, governance checklist.
  - [x] Task 23.2. Render with headless Chrome/Chromium; verify it is **exactly one A4 page** (e.g. `pdfinfo`) and legible;
    commit only the PDF.

### Group 6 — Cross-links in existing pages (Parallelizable: yes — each task edits different existing files)

- [x] **Task 24. Issue-mandated cross-links**: link `ai/llmops/index.adoc`, `evaluation-in-ci.adoc` and
  `observability-with-opentelemetry.adoc` from `database/vector-rag/evaluating-rag-systems.adoc` and
  `production-considerations.adoc`; `observability-with-opentelemetry.adoc` from
  `backend/springboot/metrics-and-observability.adoc`; one sentence linking `metrics-dashboards-and-alerting.adoc` in
  `database/prometheus/index.adoc`.
- [x] **Task 25. Replace "planned LLMOps" prose with real xrefs** in the AI pages listed under "Current code state", pointing
  at the most specific new page (e.g. `evaluation-in-ci`, `online-evaluation-and-feedback`, `serving-at-scale`,
  `observability-with-opentelemetry`); keep anchors intact; leave AI Security as prose.

### Group 7 — Sub-section validation (Parallelizable: no — checks depend on all previous groups)

- [x] **Task 26. Static checks**: (a) no admonition blocks under `pages/ai/llmops/` and the partial contains only the disclosure
  + bibliography pointer; (b) every page has `:description:`, `:keywords:`, the include, versions in its intro, `== References`;
  (c) every code block is followed by an official-docs link; (d) every source in the issue's bibliography is linked in
  `index.adoc`; (e) no `xref:` to non-existent pages; (f) SVGs named `ai-llmops-*.svg` and readable in light/dark; (g) no book
  text/PDFs committed; (h) secrets scan with the `iru-check-security` skill.
- [x] **Task 27. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml`** (delegate via the `iru-gate-runner` agent,
  or `/iru-build-docs`); fix every xref, AsciiDoc or Mermaid error or warning introduced by this sub-section and confirm the
  site renders the new pages (nav, images, PDF link, MathJax).

### Group 8 — Integration-branch verification (Parallelizable: no — strictly sequential; each step depends on the previous result)

- [x] **Task 28. Merge the latest `origin/feature/213-ai-section` into `feature/211`** and resolve conflicts. Expected conflict
  points: the AI block in `modules/ROOT/nav.adoc`, `ai/index.adoc` → `== Sub-sections`, and the `:keywords:` of the root and AI
  index pages. Keep every sibling's entries, in the fixed sub-section order.
- [x] **Task 29. Run `npm run validate:mermaid` and `npx antora antora-playbook.yml` (or `/iru-build-docs`) on the merged
  result.** Must finish with no xref, AsciiDoc or Mermaid errors.
- [x] **Task 30. Compute merge readiness** for the prerequisite #208 (`gh pr list --base feature/213-ai-section --state merged
  --json number,headRefName,title`; squash merges make the PR list authoritative) and record this block for the PR body:

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: <#208 ✅/⏳> merged into feature/213-ai-section
  - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
  - Status: <✅ READY: can be merged into feature/213-ai-section after human review | ⏳ WAIT: keep as draft until prerequisites are merged, then re-merge feature/213-ai-section and rebuild>
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```

  Group 8 result (2026-10-01): `git merge origin/feature/213-ai-section` → "Already up to date" (feature/211 was 0 behind / 0 ahead of the integration branch; no conflicts). `npm run validate:mermaid` → all 727 diagrams parsed; `npx antora antora-playbook.yml` → exit 0, no warnings or errors.

  ```
  ### Merge readiness
  - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
  - Prerequisites: #208 ✅ merged into feature/213-ai-section (PR #226)
  - Antora build + Mermaid validation on the merged result: ✅ passed
  - Status: ✅ READY: can be merged into feature/213-ai-section after human review
  - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
  ```
