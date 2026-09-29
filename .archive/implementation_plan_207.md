# Implementation Plan: Guides & References / AI — "Running LLMs Locally"

## Task summary

Source: GitHub issue #207
Base branch: feature/213-ai-section

Issue [#207](https://github.com/albertoirurueta/docs/issues/207) adds sub-section 7 of 15 of the AI section,
**Running LLMs Locally**, at `modules/ROOT/pages/ai/local-llms/`. It covers running open-weight LLMs on premise
(laptop, workstation, GPU server), serving them behind OpenAI- and Anthropic-compatible APIs, sizing the hardware,
choosing an engine, and wiring the local models into GitHub Copilot (BYOK), Claude Code (LLM gateway / Anthropic-
compatible endpoints) and the open coding assistants (Continue, Cline, Aider, OpenCode).

The sub-section ships:

* 16 pages: `index.adoc` (with `== Bibliography`), 14 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-local-llms-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-local-llms-disclaimer.adoc`
* SVG figures `modules/ROOT/images/ai-local-llms-*.svg` plus Mermaid diagrams (the issue's 📊 items are a floor)
* the nav block (inserted after AI Agents, before Git & GitHub)
* the `ai/index.adoc` "Running LLMs Locally" bullet (currently "(planned)") turned into a real `xref:`, its
  `:keywords:` appended, and its book lines re-pointed to this sub-section's bibliography
* the root `pages/index.adoc` `:keywords:` appended
* cross-link sentences in `database/vector-rag/index.adoc`,
  `database/vector-rag/prompt-augmentation-and-generation.adoc` (→ `ai/local-llms/ollama.adoc`) and
  `backend/docker/compose-for-local-development.adoc` (→ `ai/local-llms/desktop-runners.adoc`)

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography" and
"Branching, PR target and merge strategy" sections. Every page task must cover **every** bullet of its page in the
issue body (`issue_read` #207 or the body already fetched in this conversation).

**Out of scope** (per the issue): running models inside mobile/desktop apps and fine-tuning (Hugging Face &
On-Device Models, #200); multi-node GPU cluster design (pointers only); serving at scale (LLMOps); **hard-coded
benchmark numbers and prices are never quoted** — provide harnesses/methods instead.

### Merge constraints (from #207 → "Branching, PR target and merge strategy")

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main` only through
  collector issue #213's final integration PR.
* **Prerequisite: #202 (LLM Foundations & Prompting + AI landing page) must already be merged** into
  `feature/213-ai-section` before this PR may be merged there. #202 is confirmed merged (commit `95e1aa5c`,
  `implementation_plan_202.md` archived, `ai/llm-foundations/*` present on the base). Until re-verified at merge
  time (Group 10) the PR stays a **draft**.
* **PR body:** uses `Refs #207` (not `Closes`) and carries the *Merge readiness* block (Group 10).
* **After merge:** tick #207 in #213's *Progress* checklist and delete `feature/207`.
* **Wave note:** #207 is Wave 2 (parallel with #203 and #205, both already merged); it unblocks #200 Hugging Face &
  On-Device Models.

### Choices made on the user's behalf

1. **Ship everything in one pass** — all 16 pages, the PDF, SVGs and the 3 cross-links, as #202–#205 did.
2. **Books appear only in `== Bibliography`** (and the `ai/index.adoc` books list): Huyen *AI Engineering*, Alammar &
   Grootendorst *Hands-On Large Language Models*, Lee *Hugging Face in Action*, Lanham *AI Agents in Action*, Aryan
   *LLMOps* (the O'Reilly page credits "MeyerPerin Inc." only — cite as the issue states). The PDFs in
   `~/Desktop/ai` are not present in this container and are never opened, copied or committed; concepts are
   paraphrased and credited only.
3. **Disclaimer:** `partials/ai-local-llms-disclaimer.adoc` mirrors `partials/ai-agents-disclaimer.adoc` (a single
   `[IMPORTANT]` block: the house AI-assistance disclosure + `xref:ai/local-llms/index.adoc#_bibliography[bibliography]`).
   **No other admonition** may appear under `ai/local-llms/`; version notes, deprecations, security caveats, pricing
   caveats and the "Anthropic does not support non-Claude models via gateways" statement go in plain prose or table
   rows.
4. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet`,
   `database`; none fits AsciiDoc/Mermaid/SVG/PDF authoring. Tasks are implemented directly by the generic fallback
   of `iru-code-one-task-group`, as in #202–#205. Code *inside* pages (shell, YAML, JSON, Python, Java/Spring) is
   illustrative page content and is not compiled by this repo — but must be checked against official docs.
5. **Version baseline is re-verified at implementation time and dated** ("as of 2026-09-28" or the actual run date):
   Ollama, llama.cpp (release tag + whether the unified `llama` binary and `llama serve` exist, else `llama-server`),
   vLLM, SGLang, LM Studio, Jan, Docker Model Runner, LocalAI, mlx-lm, NIM, LiteLLM, Continue, Cline, Aider,
   OpenCode, VS Code Copilot BYOK (Custom Endpoint / `chatLanguageModels.json`), Copilot CLI `COPILOT_PROVIDER_*`
   env vars, Claude Code gateway settings, and the open-weight model families/licences. The issue's own numbers
   (Qwen3.6, Gemma 4 Apache-2.0, DeepSeek V4 MIT, Phi-4 MIT, gpt-oss Apache-2.0, Llama 4 community licence, Copilot
   BYOK GA 2026-04-22, JetBrains Ollama BYOK Aug 2026, TGI maintenance mode v3.3.x) are **claims to confirm, not to
   copy**. Reuse the AI section's Spring/Python baseline from `ai/llm-foundations/index.adoc` and
   `ai/agents/index.adoc` (Python 3.12, Java 21, Spring Boot 4.1 / Spring AI 2.0.1, langchain-ollama 1.1.0) unless a
   re-check shows a newer verified release.
6. **Running scenario reuses *DocsAssistant*** with the local models already used by `database/vector-rag/*`
   (Ollama `llama3.1:8b` chat, `nomic-embed-text` embeddings). Each engine page ends with the same three client
   snippets: `curl` against the OpenAI-compatible endpoint; Python (`openai` SDK with `base_url`, then
   `langchain-ollama` / `ChatOpenAI(base_url=…)`); Spring AI (`spring-ai-starter-model-ollama` or the OpenAI starter
   with `base-url`). The integration pages then wire the same local model into Copilot and Claude Code.
7. **Existing pages get real `xref:`s; not-yet-built sub-sections are named in plain prose.** Existing targets:
   `ai/llm-foundations/*` (e.g. `model-landscape.adoc`, `context-windows-and-memory.adoc`,
   `cost-latency-and-throughput.adoc`, `sampling-and-decoding.adoc`), `ai/ai-assisted-development/*`,
   `ai/customizing-ai-workflows/*`, `ai/agents/*`, `database/vector-rag/*`,
   `database/redis/spring-boot-redis-as-a-vector-database.adoc`, `backend/docker/*`,
   `cloud/azure/ai-data-and-iot-overview.adoc`. Sub-sections not yet built — Hugging Face & On-Device Models (#200),
   LangChain (#198), Spring AI (#197), MCP (#206), LLMOps (#211), AI Security (#212) — are plain prose only
   (Antora fails on unresolved xrefs). The Hugging Face conversion page is therefore prose, not an `xref:`.
8. **Verify that every `xref:` target exists** before writing it (`ls`/`grep`); never call an existing page
   "planned".

### Lessons from the #202–#205 reviews — mandatory for every page task

**Verify every name against its official page before writing it**: CLI flags, env vars, config keys, JSON fields,
API paths/ports, model tags, package names and versions. Sources: the URLs in the issue's Bibliography section. If
the docs don't confirm a detail, describe the behaviour without naming it. Most facts on these pages changed in
2026 — do not answer from memory.

**Security is correctness.** No example may hardcode a real secret; use `$ENV_VAR` placeholders or obviously fake
values (avoid `sk-…`/`ghp_…`-looking strings that trip `detect-secrets`). Every example that binds a server to
`0.0.0.0` or exposes a port must say the local servers are unauthenticated by default and show the auth-proxy/TLS
mitigation (Docker Model Runner's unauthenticated API is called out explicitly).

**Every concept gets at least one example**, each followed by a link to its official page; that URL also goes in the
page's `== References`.

**URL hygiene.** Canonical URLs only (`curl -sI -L -o /dev/null -w '%{url_effective}' <url>`), one URL per source
reused consistently across pages. Hosts unreachable through the egress proxy are noted, not guessed.

**AsciiDoc hygiene.** `.Title` caption lines. No leaked authoring notes. `{placeholders}` literal inside `[source]`
blocks; backtick + escape (`\{x}`) in prose. No prose line starting with `<digits>.`. No `xref:` inside backticks.
No empty link text on a fragment xref. `:stem: latexmath` in the header of any page using MathJax.

**Consistency.** Hosted model names match `ai/llm-foundations/*` (`claude-sonnet-5`, `claude-opus-5-5`,
`claude-haiku-4-5`, `claude-fable-5-1`, `gpt-6-sol`). Local model tags must exist on the Ollama library / Hub at
verification time.

## Current code state

**Base branch.** `feature/213-ai-section` (HEAD `b5bd29b0`, includes `main` and #202/#203/#204/#205). `feature/207`
was forked from `origin/feature/213-ai-section`; its upstream tracking was unset so it cannot be pushed there by
accident. There is no `ai/local-llms/` directory yet.

**Present on the base:** `ai/index.adoc`; `ai/llm-foundations/*` (21 files), `ai/ai-assisted-development/*` (19),
`ai/customizing-ai-workflows/*` (17), `ai/agents/*` (17); partials `ai-disclaimer.adoc`,
`ai-llm-foundations-disclaimer.adoc`, `ai-ai-assisted-development-disclaimer.adoc`,
`ai-customizing-ai-workflows-disclaimer.adoc`, `ai-agents-disclaimer.adoc`; four AI cheat-sheet PDFs in
`modules/ROOT/attachments/`; `ai-*.svg` images in `modules/ROOT/images/`.

**`modules/ROOT/nav.adoc`.** The AI block currently ends with the `ai/agents` sub-block. The new
`*** xref:ai/local-llms/index.adoc[Running LLMs Locally]` block (14 concept `****` children in outline order +
`**** xref:ai/local-llms/cheat-sheet.adoc[Cheat Sheet (PDF)]`) goes after the last `ai/agents` child and before
`** xref:git-and-github/index.adoc[Git & GitHub]`. Positions #5 (MCP) and #6 (CLIs) are not present yet — insert
after the last existing sub-block; siblings landing later slot in around it (fixed order). Match on text, not line
numbers.

**`modules/ROOT/pages/ai/index.adoc`.**
* `== Sub-sections` has `* Running LLMs Locally -- serving open-weight models on your own hardware. (planned)` →
  becomes an `xref:` bullet with a real summary, in place.
* `== Books used in this section` cites Huyen and Alammar (already pointing at earlier sub-sections' bibliographies)
  and Lee and Aryan ("Will be cited by the planned Hugging Face…/LLMOps…"). Add `xref:ai/local-llms/index.adoc#_bibliography[Running
  LLMs Locally's bibliography]` to Huyen, Alammar, Lee, Aryan and Lanham (Lanham already links AI Agents' bibliography);
  keep the "will be cited by the planned …" wording for Lee/Aryan's *other* future homes.
* `:keywords:` gets this sub-section's terms appended (skip duplicates).

**`modules/ROOT/pages/index.adoc`** (root). `:keywords:` gets genuinely new terms appended (skip duplicates such as
"Docker", "embeddings").

**Cross-link targets (confirmed present):** `database/vector-rag/index.adoc`,
`database/vector-rag/prompt-augmentation-and-generation.adoc` (documents the silent `num_ctx` truncation),
`backend/docker/compose-for-local-development.adoc`. Also referenced from `ai/agents/context-engineering-for-agents.adoc`
(mentions `num_ctx`; optional back-link, not required by the issue).

**Shapes to mirror.** `ai/agents/*.adoc` and `ai/customizing-ai-workflows/*.adoc`: header (`= Title`,
`:description:`, `:keywords:`, optional `:stem: latexmath`, blank line, disclaimer include), dated lead paragraph
stating the version baseline, `==` concept sections, `== References`. The landing page has `== What's covered`
(grouped like the nav) and a grouped `== Bibliography` (Requester-provided books / Official documentation /
Specifications and standards / Papers and engineering articles) ending with the house closing sentence. The
cheat-sheet page has grouped back-links, the `xref:attachment$…pdf` download line and its own `== References`
(see `ai/agents/cheat-sheet.adoc`).

**Tooling.**
* `npx antora antora-playbook.yml` — the build gate (0 errors, 0 warnings introduced).
* `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` (restore `node_modules/.package-lock.json`
  afterwards; the two packages are deliberately not vendored).
* Headless Chromium at `/opt/pw-browsers/chromium-*` (print-ready HTML/CSS → PDF; do not run `playwright install`);
  PyMuPDF (`fitz`) to verify exactly one A4 page (install if missing).
* The `iru-gate-runner` agent for build/validation steps.
* `detect-secrets` via the `iru-check-security` skill run by `iru-code`; do not commit `.secrets.baseline`.

**Precedents.** `.archive/implementation_plan_205.md` (structurally closest, read in full), `_202`, `_203`, `_204`.

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, `:stem: latexmath` on pages with formulas,
  blank line, `include::partial$ai-local-llms-disclaimer.adoc[]`.
* **Lead paragraph.** States the versions the page was written against, dated (choice 5).
* **Coverage.** Cover every bullet of the page's outline in the issue body and meet its 📊 floor.
  * SVGs: `modules/ROOT/images/ai-local-llms-<topic>.svg`; `viewBox`, `font-family="Helvetica, Arial, sans-serif"`,
    flat light background, dark hex colours, no CSS variables, no external refs, text fits the viewBox, legible in
    both light and dark themes (mirror `ai-agents-*.svg`).
  * Mermaid blocks must pass `npm run validate:mermaid`.
* **Examples.** Written against the current official docs, never copied from a book; where a book's code is
  outdated (GPT4All, TGI, `llama-server`), say so in prose and show the current API.
* **Page ending.** `== References` (official docs, specs, papers only — never books).
* **Math.** MathJax (`\( \)` / `\[ \]`) wherever it makes a concept precise: memory sizing, KV cache, quantization,
  TTFT/TPOT/goodput, cost method.

## Implementation steps

### Group 1 — Scaffolding

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/ai-local-llms-disclaimer.adoc`. _(done: partial mirrors ai-agents-disclaimer; version baseline recorded in scratchpad version-baseline-207.md, checked 2026-09-28)_
  - [x] Task 1.1. Copy `partials/ai-agents-disclaimer.adoc`'s shape exactly (single `[IMPORTANT]` block: the house
    AI-assistance disclosure + the bibliography pointer). Change only the anchor to
    `xref:ai/local-llms/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Every page in this sub-section uses `include::partial$ai-local-llms-disclaimer.adoc[]` and no
    other admonition.
  - [x] Task 1.3. Re-verify and record (scratchpad notes, not committed) the version baseline for every engine and
    tool listed in choice 5, with the check date, so the page tasks reuse one consistent set of versions.

### Group 2 — Hardware and quantization foundations

**Parallelizable: yes.** Two independent pages (Tasks 2–3) under `modules/ROOT/pages/ai/local-llms/`.

- [x] Task 2. Create `hardware-sizing.adoc` ("Hardware Sizing"). _(done: formulas, computed worked table (calculator output matches), SVG ai-local-llms-memory-breakdown.svg, xrefs confirmed)_
  - [x] Task 2.1. Weights memory \( M_w \approx P \times b \) with bytes per parameter per precision; KV-cache size
    \( M_{kv} = 2 \cdot L \cdot n_{kv} \cdot d_h \cdot T \cdot b \cdot B \); runtime overhead; MoE total vs. active
    parameters (memory vs. speed); memory bandwidth as the decode bottleneck (MBU); `:stem: latexmath`.
  - [x] Task 2.2. Worked table: 8B / 20B / 70B / 120B-MoE at FP16 / Q8 / Q4 with 8k / 32k context — computed from the
    formulas with stated architecture assumptions (layers, KV heads, head dim), not quoted from vendors.
  - [x] Task 2.3. Apple unified memory vs. discrete VRAM; CPU-only expectations (qualitative, no hard-coded tokens/s).
  - [x] Task 2.4. A Python sizing calculator (runnable, deterministic; verify its output matches the table).
  - [x] Task 2.5. 📊 SVG `ai-local-llms-memory-breakdown.svg` of memory-breakdown bars (weights / KV cache /
    overhead across the table's rows).
  - [x] Task 2.6. Link `xref:ai/llm-foundations/context-windows-and-memory.adoc[]` and
    `xref:ai/llm-foundations/cost-latency-and-throughput.adoc[]` (confirm they exist and cover what is claimed).
- [x] Task 3. Create `quantization-for-inference.adoc` ("Quantization for Inference"). _(done: formats, formula + NF4, GGUF ladder/imatrix, GPTQ/AWQ/FP8 + llm-compressor, KV-cache quantization; HF conversion named in prose)_
  - [x] Task 3.1. Numeric formats FP32 / BF16 / FP8 / INT8 / INT4 / NF4; the quantization formula
    \( q = \mathrm{round}(x/s) + z \) with scale/zero-point; `:stem: latexmath`.
  - [x] Task 3.2. GGUF quant types (Q8_0, Q6_K, Q5_K_M, **Q4_K_M**, IQ-quants) and importance matrices; GPTQ / AWQ /
    FP8 for GPU servers (AutoAWQ archived → llm-compressor — verify); quality vs. size trade-offs (qualitative,
    no quoted benchmark numbers); KV-cache quantization.
  - [x] Task 3.3. Examples: `llama-quantize` invocation (per the quantize README), loading a GGUF/AWQ checkpoint;
    each followed by its official link.
  - [x] Task 3.4. Name the Hugging Face conversion page in plain prose (sub-section #200 not built; choice 7).
  - [x] Task 3.5. Cite Dettmers (QLoRA/NF4), Frantar (GPTQ), Lin (AWQ) in `== References`.

### Group 3 — Engines

**Parallelizable: yes.** Independent pages (Tasks 4–9); each ends with the shared three client snippets (choice 6).

- [x] Task 4. Create `ollama.adoc` ("Ollama"). _(done: install/CLI/Hub GGUF/Modelfile/num_ctx pitfall/REST/OpenAI+Anthropic compat (unsupported list)/embeddings/structured/tools/GPU/cloud/keep_alive + 3 clients)_
  - [x] Task 4.1. Install (macOS / Linux / Windows / Docker); `ollama pull/run/list/ps`; running Hub GGUFs
    (`hf.co/...`); the Modelfile (`FROM`, `PARAMETER`, `TEMPLATE`, `SYSTEM`).
  - [x] Task 4.2. **Context length** (`num_ctx`, `OLLAMA_CONTEXT_LENGTH`) and the silent-truncation pitfall; link back
    to `xref:database/vector-rag/prompt-augmentation-and-generation.adoc[]`.
  - [x] Task 4.3. Native REST API; **OpenAI compatibility**; **Anthropic compatibility** and its unsupported
    features; embeddings; structured outputs; tools; GPU selection; `:cloud` models; `keep_alive`.
  - [x] Task 4.4. Three client snippets: curl, Python (`openai` + `langchain-ollama`), Spring AI
    (`spring-ai-starter-model-ollama`); link `xref:database/redis/spring-boot-redis-as-a-vector-database.adoc[]`.
  - [x] Task 4.5. Note the VS Code built-in Ollama provider deprecation only as a pointer to
    `local-models-in-github-copilot.adoc`.
- [x] Task 5. Create `llama-cpp.adoc` ("llama.cpp"). _(done: llama serve and llama-server both documented; flags/slots Mermaid/endpoints/grammars/spec decoding/llama-cpp-python + 3 clients)_
  - [x] Task 5.1. Building/downloading and backends (Metal / CUDA / HIP / Vulkan / SYCL); verify whether the unified
    `llama` binary (`llama cli -hf …`, `llama serve -hf …`) or `llama-server` is current and state both honestly.
  - [x] Task 5.2. Server flags (`-m`, `-hf`, `-c`, `-ngl`, `--jinja`, parallel slots); OpenAI-compatible endpoints;
    grammars / JSON schema; speculative decoding; `llama-cpp-python`.
  - [x] Task 5.3. 📊 optional: Mermaid of the model-load → context → slots layout if it clarifies flags.
  - [x] Task 5.4. Three client snippets against `llama-server`/`llama serve`.
- [x] Task 6. Create `vllm-and-sglang.adoc` ("vLLM & SGLang"). _(done: vllm serve, PagedAttention/batching Mermaid/prefix caching/spec/quant/OpenAI+Anthropic/TP/Docker+K8s, SGLang RadixAttention, TGI v3.3.7 maintenance, bench harness + 3 clients)_
  - [x] Task 6.1. `vllm serve <hf-model>`; PagedAttention, continuous batching, prefix caching, speculative
    decoding; quantized checkpoints; OpenAI + Anthropic `/v1/messages` endpoints; tensor parallelism; Docker and
    Kubernetes basics.
  - [x] Task 6.2. SGLang (RadixAttention) with `launch_server`; TGI's maintenance-mode status (verify v3.3.x and the
    HF recommendation).
  - [x] Task 6.3. A benchmark harness (`vllm bench` or a Python load script) — no quoted numbers.
  - [x] Task 6.4. 📊 Mermaid of continuous batching; cite Kwon (PagedAttention) and Zheng (SGLang).
  - [x] Task 6.5. Three client snippets.
- [x] Task 7. Create `desktop-runners.adoc` ("Desktop Runners"). _(done: LM Studio/llmster/lms, Jan, DMR (unauthenticated, Compose models), LocalAI, MLX-LM, comparison table, GPT4All note + snippets)_
  - [x] Task 7.1. LM Studio (GUI, `lms` CLI, headless `llmster`, OpenAI + Anthropic endpoints); Jan.
  - [x] Task 7.2. **Docker Model Runner** (`docker model run`, llama.cpp / vLLM engines, OpenAI and Ollama APIs, and
    that it is **unauthenticated**); LocalAI; **MLX-LM** (`mlx_lm.server`).
  - [x] Task 7.3. Comparison table (platform, API surface, engine, GUI, auth); note GPT4All (book-era) is now niche.
  - [x] Task 7.4. Link `xref:backend/docker/compose-for-local-development.adoc[]` for the Compose examples.
  - [x] Task 7.5. Snippets for at least LM Studio, Docker Model Runner and MLX-LM.
- [x] Task 8. Create `nvidia-nim.adoc` ("NVIDIA NIM"). _(done: NIM containers/NGC login/run/health/OpenAI API/NVAIE licensing (docs.nvidia.com unreachable, noted)/when to use + 3 clients)_
  - [x] Task 8.1. NIM containers for LLMs; the OpenAI API; licensing (NVIDIA AI Enterprise) and when an enterprise
    needs it — verify the current licensing/download terms; no prices.
  - [x] Task 8.2. A `docker run` example with `$NGC_API_KEY` placeholder and a curl call; three-client snippets.
- [x] Task 9. Create `open-weight-models.adoc` ("Open-Weight Models"). _(done: dated table with per-row verification source; unverifiable cells marked; licence classes; choosing by task; gpt-oss Ollama+vLLM example)_
  - [x] Task 9.1. Dated table: family, sizes, dense / MoE, context, licence, official HF / vendor link — for Qwen,
    Gemma, DeepSeek, Mistral (3 / Small 4 / Devstral 2), gpt-oss, Phi, Llama; **every cell verified on the vendor
    page** (choice 5).
  - [x] Task 9.2. Licence classes: Apache / MIT vs. community licences vs. gated; choosing by task (coding,
    reasoning, tool use, multilingual). No benchmark numbers.
  - [x] Task 9.3. Link `xref:ai/llm-foundations/model-landscape.adoc[]`; name the Hugging Face licence page in
    prose/URL only.
  - [x] Task 9.4. An example: pulling/serving one Apache-2.0 model in Ollama and vLLM, each followed by its link.

### Group 4 — Gateways and optimisation

**Parallelizable: yes.** Two independent pages (Tasks 10–11).

- [x] Task 10. Create `llm-gateways.adoc` ("LLM Gateways"). _(done: LiteLLM config.yaml/virtual keys/budgets/fallbacks/v1 messages verified vs litellm-docs repo; OpenRouter; Ollama cloud; nginx auth proxy; Mermaid clients-gateway-models)_
  - [x] Task 10.1. LiteLLM proxy: unified OpenAI + `/v1/messages`, virtual keys, budgets, fallbacks, routing
    between local and hosted models — `config.yaml` example verified against the docs.
  - [x] Task 10.2. OpenRouter (hosted); Ollama as a gateway to `:cloud` models; auth in front of unauthenticated
    local servers (reverse proxy with API key/TLS — a concrete nginx or Caddy snippet).
  - [x] Task 10.3. 📊 Mermaid of clients → gateway → local / hosted models.
- [x] Task 11. Create `inference-optimization.adoc` ("Inference Optimization"). _(done: prefill/decode, TTFT/TPOT/throughput/goodput MathJax, batching, caching, spec decoding, FlashAttention, GQA, tuning, TTFT/TPOT script; SVG ai-local-llms-prefill-decode.svg; LLMOps in prose)_
  - [x] Task 11.1. Prefill vs. decode; TTFT / TPOT / throughput / goodput with MathJax (`:stem: latexmath`); batching;
    prompt / prefix caching; speculative decoding; FlashAttention; GQA.
  - [x] Task 11.2. Tuning context length and parallel slots; measuring locally with a Python script (streaming timer
    measuring TTFT and TPOT against any OpenAI-compatible endpoint).
  - [x] Task 11.3. Link `xref:ai/llm-foundations/cost-latency-and-throughput.adoc[]` (link, don't duplicate) and name
    LLMOps (#211) in plain prose for serving at scale.
  - [x] Task 11.4. 📊 SVG or Mermaid of prefill vs. decode timeline (`ai-local-llms-prefill-decode.svg` if SVG).

### Group 5 — Coding-assistant integrations

**Parallelizable: yes.** Three independent pages (Tasks 12–14).

- [x] Task 12. Create `local-models-in-github-copilot.adoc` ("Local Models in GitHub Copilot"). _(done: VS Code BYOK (Language Models editor, providers, Ollama extension, Custom Endpoint chatLanguageModels.json), policy + limits, JetBrains, Copilot CLI COPILOT_PROVIDER_* verified vs github/docs; Mermaid; github.blog unreachable noted)_
  - [x] Task 12.1. VS Code BYOK: "Chat: Manage Language Models"; providers (Anthropic / Gemini / OpenAI / OpenRouter /
    Azure / Foundry Local); **Custom Endpoint** in `chatLanguageModels.json` for Ollama / vLLM / LM Studio; the
    official Ollama extension and the deprecated built-in provider — verify each against the VS Code docs and the
    2026 changelog/blog.
  - [x] Task 12.2. The org policy "Bring Your Own Language Model Key"; limitations (BYOK covers chat and agents
    only; completions, embeddings and semantic search still use GitHub); JetBrains Ollama BYOK.
  - [x] Task 12.3. Copilot CLI BYOK: `COPILOT_PROVIDER_BASE_URL`, `COPILOT_PROVIDER_TYPE`, `COPILOT_MODEL`,
    `COPILOT_OFFLINE` — verify names; model requirements (tool calling, streaming, ≥128k context recommended).
  - [x] Task 12.4. 📊 Mermaid of VS Code → Custom Endpoint → Ollama; link
    `xref:ai/ai-assisted-development/copilot-getting-started.adoc[]` and
    `xref:ai/ai-assisted-development/choosing-models-in-your-assistant.adoc[]` (confirm content).
- [x] Task 13. Create `local-models-in-claude-code.adoc` ("Local Models in Claude Code"). _(done: Bedrock/Vertex/Foundry/gateway routes + apiKeyHelper/custom headers/pinning verified on code.claude.com; exact non-support quote in prose; Ollama/vLLM/SGLang/LM Studio/LiteLLM setups; limits; security)_
  - [x] Task 13.1. Supported enterprise routes: Amazon Bedrock, Google Vertex AI, Microsoft Foundry, LLM gateways
    (`ANTHROPIC_BASE_URL`, `ANTHROPIC_AUTH_TOKEN`, `apiKeyHelper`, custom headers), model pinning via
    `ANTHROPIC_DEFAULT_*_MODEL` — verified against the `code.claude.com` pages listed in the issue.
  - [x] Task 13.2. Pointing Claude Code at an Anthropic-compatible local endpoint: the Ollama-documented setup
    (`ollama launch claude`, or the manual env vars) and vLLM / LM Studio / LiteLLM alternatives.
  - [x] Task 13.3. **State plainly, as ordinary prose (no admonition), that Anthropic does not support routing Claude
    Code to non-Claude models through any gateway**; give the practical limits (≥64k context, tool-use quality) and
    the security of local endpoints. Quote the exact current wording only after re-reading the docs page.
  - [x] Task 13.4. Link `xref:ai/ai-assisted-development/claude-code-getting-started.adoc[]` and
    `xref:ai/customizing-ai-workflows/permissions-and-settings.adoc[]` (confirm content).
- [x] Task 14. Create `open-coding-assistants-with-local-models.adoc` ("Open Coding Assistants with Local Models"). _(done: Continue roles config, Cline local providers + compact prompt, Aider ollama_chat + num_ctx, OpenCode provider baseURL; comparison table)_
  - [x] Task 14.1. Continue (config, chat vs. autocomplete roles); Cline; Aider (`ollama_chat/…`); OpenCode (provider
    `baseURL`) — config snippets verified against each tool's current docs.
  - [x] Task 14.2. Comparison table (config location, roles, tool-calling needs, autocomplete support).

### Group 6 — Operations

**Parallelizable: yes** (single task).

- [x] Task 15. Create `running-local-llms-in-production.adoc` ("Running Local LLMs in Production"). _(done: Compose with GPU reservations/volumes/healthchecks + nginx gateway, health table, weight caching, autoscaling limits, auth/TLS/NetworkPolicy/egress, Prometheus metrics table + alert, cost method MathJax (no prices), Azure managed pointer, LLMOps prose)_
  - [x] Task 15.1. Containerising (Ollama / vLLM images, GPU passthrough with the NVIDIA Container Toolkit); health
    checks; model-weight caching and volumes; autoscaling limits.
  - [x] Task 15.2. Securing endpoints (auth, TLS, network policies); monitoring (Prometheus metrics from vLLM);
    cost-comparison method vs. hosted APIs with MathJax and no quoted prices.
  - [x] Task 15.3. Compose/Kubernetes examples; link `xref:backend/docker/compose-for-local-development.adoc[]` and
    other `backend/docker/*` pages that exist (confirm names), and name LLMOps (#211) in prose.
  - [x] Task 15.4. Link `xref:cloud/azure/ai-data-and-iot-overview.adoc[]` as the "managed alternative" pointer.

### Group 7 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Each task edits a distinct file and references only pages from Groups 1–6. The PDF (Task 18)
reads the finished pages, so it runs after Tasks 16–17 inside this group's ordering.

- [x] Task 16. Create `ai/local-llms/index.adoc` ("Running LLMs Locally"). _(done: lead with dated baseline, why/trade-offs, engine table + Mermaid decision flowchart, What's covered, grouped Bibliography; URL audit: 143 URLs, 0 duplicates, 0 missing; reachable hosts 0 redirects; github.com links checked via raw/git (QwenLM/Qwen3.6 redirect -> canonical Qwen3.8 fixed); 32 hosts unreachable from proxy (noted))_
  - [x] Task 16.1. Header, disclaimer, lead with the dated version baseline (choice 5): why run locally (privacy and
    data residency, cost at volume, offline, latency, control), the trade-offs (quality gap, ops burden, hardware),
    the engine decision table (laptop → Ollama / LM Studio / MLX; single GPU → llama.cpp / Ollama; multi-user GPU
    server → vLLM / SGLang; enterprise → NIM), and DocsAssistant as the running scenario.
  - [x] Task 16.2. 📊 Mermaid decision flowchart (engine choice).
  - [x] Task 16.3. `== What's covered`, grouped like the nav (Foundations / Engines / Gateways and optimisation /
    Coding assistants / Operations / Cheat sheet), each an `xref:` with a one-line summary.
  - [x] Task 16.4. `== Bibliography`, built *after* reading every sibling page's `== References` and inline links,
    grouped as the issue specifies: **Requester-provided books** (full bibliographic data, publisher page, code
    repository where one exists — Huyen, Alammar & Grootendorst, Lee, Lanham, Aryan with Aryan's "MeyerPerin Inc."
    credit note); **Official documentation** sub-grouped per the issue (Ollama, llama.cpp, vLLM, SGLang, TGI, desktop
    runners, NIM, gateways, GitHub Copilot, Claude Code, open coding assistants, model vendors); **Specifications and
    standards**; **Papers and engineering articles** (Kwon, Leviathan, Dettmers, Frantar, Lin, Zheng); closing with the
    house sentence (books are consulted references, not the primary source; official docs authoritative).
  - [x] Task 16.5. URL audit script: every URL cited on any page of the sub-section is present in `== Bibliography`,
    0 duplicates, 0 non-canonical/redirecting URLs (note hosts unreachable from the egress proxy).
- [x] Task 17. Create `cheat-sheet.adoc` ("Running LLMs Locally Cheat Sheet"). _(done: grouped back-links, attachment download line, own References)_
  - [x] Task 17.1. What the sheet covers; cross-references every page of the sub-section, grouped like the nav;
    `xref:attachment$ai-local-llms-cheat-sheet.pdf[Download the Running LLMs Locally Cheat Sheet (PDF)]`; own
    `== References`.
- [x] Task 18. Produce `modules/ROOT/attachments/ai-local-llms-cheat-sheet.pdf`. _(done: HTML/CSS in scratchpad cheatsheet-207/, headless Chromium, 1 A4 page verified with PyMuPDF)_
  - [x] Task 18.1. Print-ready HTML/CSS (dense, multi-column, colour-coded boxes, header line with the version
    baseline and date, breadcrumb footer) visually consistent with `vector-rag-cheat-sheet.pdf` and
    `azure-cheat-sheet.pdf` (and the four sibling AI sheets); build in the scratchpad, check in only the PDF.
  - [x] Task 18.2. Content: engine decision tree; sizing formulas and quick table; GGUF quant ladder; Ollama commands
    and Modelfile; llama.cpp / vLLM / SGLang launch lines; endpoint URLs and ports per engine; LiteLLM config snippet;
    Copilot BYOK and Custom Endpoint steps; Claude Code env vars; Continue / Aider / OpenCode snippets; open-weight
    licence table; security checklist.
  - [x] Task 18.3. Render via headless Chromium; verify with `fitz` that it is **exactly one A4 page**.
- [x] Task 19. Insert the nav block into `modules/ROOT/nav.adoc` (after the last existing AI sub-block, before _(done: block after AI Agents, before Git & GitHub, 14 children + cheat sheet)_
  `** xref:git-and-github/index.adoc[Git & GitHub]`): `*** xref:ai/local-llms/index.adoc[Running LLMs Locally]`, 14
  `****` concept children in outline order, and `**** xref:ai/local-llms/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
- [x] Task 20. Edit `modules/ROOT/pages/ai/index.adoc`. _(done: xref bullet, 5 book lines, keywords)_
  - [x] Task 20.1. Replace the "Running LLMs Locally … (planned)" bullet with a real `xref:` bullet (same position).
  - [x] Task 20.2. Add this sub-section's bibliography xref (non-empty link text) to the Huyen, Alammar, Lee, Aryan
    and Lanham lines.
  - [x] Task 20.3. Append new terms to `:keywords:` (skip duplicates).
- [x] Task 21. Edit `modules/ROOT/pages/index.adoc` (root): append genuinely new `:keywords:` terms (Ollama, _(done: 18 new keywords)_
  llama.cpp, vLLM, SGLang, LM Studio, Docker Model Runner, NVIDIA NIM, LiteLLM, GGUF, quantization, KV cache, BYOK,
  local LLM, on-premise LLM, open-weight models, …), skipping duplicates.
- [x] Task 22. Add cross-links in existing pages. _(done: 3 cross-links; also replaced stale 'planned Running LLMs Locally' mentions in choosing-models-in-your-assistant.adoc and ai-application-architecture.adoc)_
  - [x] Task 22.1. `database/vector-rag/index.adoc`: one sentence linking `xref:ai/local-llms/ollama.adoc[]`.
  - [x] Task 22.2. `database/vector-rag/prompt-augmentation-and-generation.adoc` (near `num_ctx`): one sentence
    linking `xref:ai/local-llms/ollama.adoc[]`.
  - [x] Task 22.3. `backend/docker/compose-for-local-development.adoc`: one sentence linking
    `xref:ai/local-llms/desktop-runners.adoc[]` (Docker Model Runner).

### Group 8 — Build and verify

**Parallelizable: yes** (single task, after Group 7).

- [x] Task 23. Build and verify. _(done: Antora build exit 0, 0 errors/0 warnings (3 placeholder warnings found and fixed); Mermaid 588/588 parse (validator run from scratchpad copy, repo node_modules untouched); 16 HTML pages, 2 SVGs in _images, PDF 1 A4 page; grep checks clean; self-review inline (no sub-agents available): 5 findings fixed (QwenLM canonical URL, 3 attribute-placeholder warnings, NIM/Copilot unverifiable claims softened); PDF unchanged by fixes; URL audit re-run clean)_
  - [x] Task 23.1. Run `npx antora antora-playbook.yml` on a clean `build/` via an `iru-gate-runner` sub-agent
    (`Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Invoke
    Skill({skill: \"iru-build-docs\"}) and report the exact error/warning count."})`). Must exit 0 with **0 errors
    and 0 warnings** introduced by this sub-section.
  - [x] Task 23.2. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` via a sub-agent. All diagrams
    parse. Restore `node_modules/.package-lock.json` afterwards.
  - [x] Task 23.3. Reachability: all 14 concept pages + `cheat-sheet.adoc` are `xref:`-linked from both
    `ai/local-llms/index.adoc` and `nav.adoc`; `build/site/ai/local-llms/` has 16 HTML files; every
    `ai-local-llms-*.svg` is in `build/site/_images/`; the PDF is 1 A4 page.
  - [x] Task 23.4. Grep checks: the disclaimer include is in all 16 files and there is no other admonition under
    `ai/local-llms/`; the partial contains only the disclosure and the bibliography pointer; book surnames appear
    only on `ai/local-llms/index.adoc` (no verbatim book text); every content page has a `:description:`,
    `:keywords:`, a dated version in its intro, `== References` and at least one code example; no `^\[\.[A-Z]`
    role-captions; no `xref:` inside backticks; no empty-text fragment xrefs; no `xref:` to a non-existent page; no page
    calls an existing AI page "planned"; no line-leading `20NN.`; no hardcoded secrets (`sk-`, `ghp_`, `password`);
    no quoted benchmark numbers or prices; no `.pdf` of a book anywhere in the diff.
  - [x] Task 23.5. **Self-review pass.** Delegate to fresh `general-purpose` sub-agents (14 concept pages in 3
    batches, run in parallel). Each verifies every flag, env var, config key, endpoint path, port, model tag,
    licence and URL against the official docs (WebFetch/curl through the proxy), applying the "Lessons" list. Fix
    every real finding, rebuild, and record the findings count and fixes in the progress note.
  - [x] Task 23.6. Re-check the PDF matches the pages after the Task 23.5 fixes; re-render if needed. Re-run the
    Task 16.5 bibliography URL check.

### Group 9 — Integration-branch verification (required by #207 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; sub-tasks in order, after Group 8).

- [x] Task 24. Verify against the integration branch and compute merge readiness. _(done: committed 0871e22f on feature/207 (not pushed; .secrets.baseline/build/node_modules not committed); origin/feature/213-ai-section already an ancestor (b5bd29b0) -> already up to date; build + Mermaid clean on HEAD; #202 merged via PR #215; merge-readiness block in scratchpad merge-readiness-207.md (READY))_
  - [x] Task 24.1. Commit on `feature/207` with the trailers `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
    and `Claude-Session: https://claude.ai/code/session_01M7C2HtMKk6hYnCpo7rmXA2`. Do not push, and do not commit
    `.secrets.baseline` or `build/`. Then `git fetch origin` and merge the latest `origin/feature/213-ai-section`
    into `feature/207`.
    * **Expected conflict points:** the `** xref:ai/index.adoc[AI]` block in `modules/ROOT/nav.adoc`,
      `modules/ROOT/pages/ai/index.adoc` (`== Sub-sections`, `== Books used in this section`, `:keywords:`), and the
      `:keywords:` of the root `pages/index.adoc`.
    * **How to resolve:** keep every sibling's entries, in the fixed sub-section order.
    * If nothing is new, record "already up to date".
  - [x] Task 24.2. Re-run the Antora build and `npm run validate:mermaid` on the merged result via `iru-gate-runner`
    (or `/iru-build-docs`). Both must be clean (no xref, AsciiDoc or Mermaid errors).
  - [x] Task 24.3. Confirm prerequisite **#202** is merged into the integration branch:
    `git fetch origin && git branch -r --merged origin/feature/213-ai-section | grep -x "  origin/feature/202"`, or
    list merged PRs into `feature/213-ai-section` (GitHub MCP `list_pull_requests`/`search_pull_requests` with
    `base:feature/213-ai-section is:merged`, since `gh` is unavailable in this environment). Note that `feature/202`
    may have been deleted after merge — in that case confirm via the merged PR / commit `95e1aa5c`.
  - [x] Task 24.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-207.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #202 <✅ merged into feature/213-ai-section (PR #…) / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY: can be merged into feature/213-ai-section after human review
              | ⏳ WAIT: keep as draft until #202 is merged into feature/213-ai-section, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first". Note the post-merge chores: tick #207 in #213's
    *Progress* checklist and delete `feature/207`.
