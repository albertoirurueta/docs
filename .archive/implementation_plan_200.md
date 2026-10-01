# Implementation Plan: Guides & References / AI — "Hugging Face & On-Device Models"

## Task summary

Source: GitHub issue #200
Base branch: feature/213-ai-section

Issue [#200](https://github.com/albertoirurueta/docs/issues/200) adds sub-section 8 of 15 of the AI section,
**Hugging Face & On-Device Models**, at `modules/ROOT/pages/ai/hugging-face/`. It covers finding, evaluating and
downloading Hub models to run locally; model formats; transformers v5 pipelines; curated STT / TTS / vision /
small-LLM / embedding catalogues; conversion and quantization; PEFT / TRL fine-tuning; and integrating Hub models into
Python (FastAPI) and Spring Boot backends and into Apple, Android, Windows/.NET, web and cross-platform apps.

The sub-section ships:

* 18 pages: `index.adoc` (with `== Bibliography`), 16 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-hugging-face-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-hugging-face-disclaimer.adoc`
* SVG figures `modules/ROOT/images/ai-hugging-face-*.svg` plus Mermaid diagrams (the issue's 📊 items are a floor)
* the nav block (after Running LLMs Locally, before LangChain)
* the `ai/index.adoc` "Hugging Face & On-Device Models" bullet (currently "(planned)") turned into a real `xref:`, its
  `:keywords:` appended, and the book lines (Lee, Alammar, Huyen, Wilson) re-pointed to this bibliography
* the root `pages/index.adoc` `:keywords:` appended
* cross-link sentences in `apps/apple/apple-intelligence-and-machine-learning.adoc`, `apps/android/index.adoc`,
  `apps/react-native/index.adoc` and `database/vector-rag/generating-embeddings-in-practice.adoc`

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography",
"Section-wide conventions" and "Branching, PR target and merge strategy" sections. Every page task must cover **every**
bullet of its page in the issue body (`gh issue view 200 --json body -q .body`).

**Out of scope** (per the issue): serving LLMs for many users (Running LLMs Locally / LLMOps); voice-agent pipelines
(Voice Agents; only models and runtimes here); training from scratch; hosting Spaces in production. Hard-coded
benchmark numbers and prices are never quoted.

### Merge constraints

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`.
* **Prerequisite: #207 (Running LLMs Locally)** — confirmed merged (`ai/local-llms/*` present on the base,
  `.archive/implementation_plan_207.md`). Re-verified at Group 10; PR stays a **draft** until then.
* **PR body:** `Refs #200` (not `Closes`) plus the *Merge readiness* block.
* **After merge:** tick #200 in #213's *Progress* checklist and delete `feature/200`.
* **Wave note:** #200 is Wave 3; it unblocks #210 (Voice Agents, with #208).
* The issue suggests optionally splitting into two PRs; this plan ships one PR (as #202–#207 did).

### Choices made on the user's behalf

1. **One pass, one PR** — all 18 pages, PDF, SVGs and 4 cross-links.
2. **Books only in `== Bibliography`** (and `ai/index.adoc` books list): Lee, Alammar & Grootendorst, Huyen, Wilson.
   PDFs in `~/Desktop/ai` are never opened, copied or committed; concepts are paraphrased and credited.
3. **Disclaimer:** `ai-hugging-face-disclaimer.adoc` mirrors `ai-local-llms-disclaimer.adoc` (single `[IMPORTANT]`
   block; anchor `xref:ai/hugging-face/index.adoc#_bibliography[bibliography]`). No other admonition under
   `ai/hugging-face/`.
4. **Tasks are untagged** — no installed `*-code-one-task` key (`java`, `java-springboot`, `dotnet`, `database`) fits
   AsciiDoc/Mermaid/SVG/PDF authoring; implemented directly. Code inside pages is illustrative and must be checked
   against official docs.
5. **Version baseline re-verified and dated at implementation time.** The issue's own versions (transformers 5.17.x,
   `huggingface_hub` 2.0.0, Gradio 6, smolagents 1.2x, LiteRT 2.x, Transformers.js 4.x, Core AI in OS 27, Aion
   Instruct, model families and licences) are **claims to confirm, not to copy**. Reuse the AI section's
   Python/Java/Spring baseline from `ai/local-llms/index.adoc` and `ai/langchain/index.adoc`.
6. **Running scenario *DocsAssistant goes offline*:** the same four tasks (transcribe → answer → speak →
   classify/describe screenshot) on each platform, each snippet followed by its official doc link.
7. **Xrefs only to existing pages.** Existing: `ai/llm-foundations/*`, `ai/local-llms/*` (incl. `hardware-sizing.adoc`,
   `quantization-for-inference.adoc`, `open-weight-models.adoc`), `ai/agents/*`, `ai/mcp/*`, `ai/langchain/*`,
   `ai/spring-ai/*`, `database/vector-rag/*`, `apps/apple/*`, `apps/android/*`, `apps/react-native/*`,
   `backend/springboot/*`, `programming-languages/python/*`. Not yet built — Voice Agents (#210), Python FastAPI
   section (#199), Windows Apps (#191) — are plain prose unless a check at implementation time shows they exist.
   Link, don't duplicate: the Apple page covers only *bringing Hub models* and links back to
   `apps/apple/apple-intelligence-and-machine-learning.adoc` for Foundation Models basics.
8. **Verify every `xref:` target exists** (`ls`) before writing it.

### Lessons from earlier reviews — mandatory for every page task

* **Verify every name against its official page**: CLI flags (`hf` CLI, not `huggingface-cli`), env vars
  (`HF_HOME`, …), API names, model IDs, package names/versions, licences. If docs don't confirm a detail, describe the
  behaviour without naming it. The issue's rename/deprecation table is a checklist to re-verify.
* **Model IDs must exist** on the Hub at verification time; licence and gating per model verified on its card.
* **Security is correctness.** No hardcoded secrets (`hf_…`-looking tokens trip `detect-secrets`; use `$HF_TOKEN`).
  Pickle/`trust_remote_code` risks stated in prose; safetensors preferred; servers binding `0.0.0.0` note no auth.
* **Every concept has an example**, followed by a link to its official page (also in `== References`).
* **URL hygiene:** canonical URLs, one URL per source reused consistently.
* **AsciiDoc hygiene:** `.Title` captions; no leaked notes; `{placeholders}` literal in `[source]`; no prose line
  starting `<digits>.`; no `xref:` in backticks; no empty fragment-xref text; `:stem: latexmath` on MathJax pages.
* **Consistency:** hosted model names match `ai/llm-foundations/*`.

## Current code state

**Base branch.** `feature/213-ai-section` (HEAD `bfdf41f7`, includes #197, #198, #206, #207). `feature/200` was forked
from it. No `ai/hugging-face/` directory yet.

**`modules/ROOT/nav.adoc`.** The `ai/local-llms` sub-block ends with
`**** xref:ai/local-llms/cheat-sheet.adoc[Cheat Sheet (PDF)]`, followed by `*** xref:ai/langchain/index.adoc[LangChain]`.
The new `*** xref:ai/hugging-face/index.adoc[Hugging Face & On-Device Models]` block (16 `****` children in outline
order + `**** …cheat-sheet.adoc[Cheat Sheet (PDF)]`) goes between them. Match on text, not line numbers.

**`modules/ROOT/pages/ai/index.adoc`.** `== Sub-sections` has
`* Hugging Face & On-Device Models -- fine-tuning, quantization and running models on-device. (planned)` (line ~64) →
real `xref:` bullet. `== Books used in this section`: Lee's entry ends "will also be cited by the planned Hugging Face &
On-Device Models sub-section" (~line 128–133) — repoint to `xref:ai/hugging-face/index.adoc#_bibliography[…]`; same for
Alammar, Huyen and Wilson lines where they name this sub-section. `:keywords:` gets new terms appended.

**Cross-link targets (confirmed present):** `apps/apple/apple-intelligence-and-machine-learning.adoc`,
`apps/android/index.adoc`, `apps/react-native/index.adoc`,
`database/vector-rag/generating-embeddings-in-practice.adoc`.

**Shapes to mirror:** `ai/local-llms/*.adoc` (header, dated lead paragraph, `==` sections, `== References`; landing page
with `== What's covered` and grouped `== Bibliography`; `cheat-sheet.adoc` with grouped back-links and the
`xref:attachment$…pdf` line). Precedents: `.archive/implementation_plan_207.md` (closest), `_206`, `_198`, `_197`.

**Tooling:** `npx antora antora-playbook.yml` (build gate); `npm i --no-save mermaid@11 jsdom && npm run
validate:mermaid` (restore `node_modules/.package-lock.json`); headless Chromium at `/opt/pw-browsers/chromium-*` +
PyMuPDF (`fitz`) for the one-A4-page PDF; the `iru-gate-runner` agent for build/validation; `detect-secrets` via
`iru-check-security` (do not commit `.secrets.baseline`).

## Conventions every page task must follow

* **Header:** `= Title`, `:description:`, `:keywords:`, (`:stem: latexmath` if formulas), blank line,
  `include::partial$ai-hugging-face-disclaimer.adoc[]`.
* **Lead paragraph** states the versions the page was written against, dated.
* **Coverage:** every bullet of the page's outline in the issue body and its 📊 floor.
  * SVGs: `modules/ROOT/images/ai-hugging-face-<topic>.svg`; `viewBox`, `font-family="Helvetica, Arial, sans-serif"`,
    flat light background, dark hex colours, no CSS variables, legible in light and dark (mirror `ai-local-llms-*.svg`).
  * Mermaid blocks must pass `npm run validate:mermaid`.
* **Examples** against current official docs; where a book's code is outdated (`huggingface-cli`, serverless Inference
  API, `HfApiModel`, GPT4All), say so in prose and show the current API.
* **Ending:** `== References` (official docs, specs, papers only — never books).
* **Math:** MathJax where it makes a concept precise (LoRA update, memory, quantization).

## Implementation steps

### Group 1 — Scaffolding

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/ai-hugging-face-disclaimer.adoc` and record the version baseline
  - [x] Task 1.1. Copy `partials/ai-local-llms-disclaimer.adoc`'s shape exactly; change only the anchor to
    `xref:ai/hugging-face/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Every page in the sub-section uses `include::partial$ai-hugging-face-disclaimer.adoc[]` and no other
    admonition.
  - [x] Task 1.3. Re-verify and record (scratchpad notes, not committed) the version baseline for every library, runtime
    and platform API named in choice 5 and the issue's rename table, with the check date, so page tasks reuse one
    consistent set of versions.
  - Files: `modules/ROOT/partials/ai-hugging-face-disclaimer.adoc` (new); baseline in scratchpad `hf-version-baseline.md` (not committed). No tests apply.

### Group 2 — The Hub and model formats

**Parallelizable: yes.** Three independent pages (Tasks 2–4) under `modules/ROOT/pages/ai/hugging-face/`.

- [x] Task 2. Create `hub-essentials.adoc` ("Hub Essentials")
  - [x] Task 2.1. Models / datasets / Spaces repos; searching and filtering (task, library, app, size); trending;
    model cards.
  - [x] Task 2.2. Tokens and gated models (manual vs. auto gating); the `hf` CLI (`auth`, `download --include`,
    `cache ls/prune`, `models ls --json`) — note `huggingface-cli` removal; `huggingface_hub` 2.0 API
    (`hf_hub_download`, `snapshot_download`).
  - [x] Task 2.3. Cache and `HF_HOME`; offline mode; Xet storage. Examples with official links; `$HF_TOKEN` placeholder.
  - Files: `modules/ROOT/pages/ai/hugging-face/hub-essentials.adoc` (new). Facts checked against the huggingface_hub 2.0 docs on 2026-09-30.
- [x] Task 3. Create `choosing-models-and-licences.adoc` ("Choosing Models & Licences")
  - [x] Task 3.1. Reading a model card (intended use, eval, limitations); size vs. hardware with
    `xref:ai/local-llms/hardware-sizing.adoc[]`.
  - [x] Task 3.2. Licence classes (Apache/MIT, CC-BY, OpenRAIL, community licences, AGPL-3.0 Ultralytics with app
    implications, non-commercial XTTS CPML); gated access; leaderboards (Open ASR, MTEB, Arena) without quoted numbers.
  - [x] Task 3.3. Licence checklist for shipping in an app; link `xref:ai/local-llms/open-weight-models.adoc[]`.
  - Files: `modules/ROOT/pages/ai/hugging-face/choosing-models-and-licences.adoc` (new). Licences/gating verified via the Hub API on 2026-09-30.
- [x] Task 4. Create `model-formats.adoc` ("Model Formats")
  - [x] Task 4.1. safetensors vs. pickle (security); GGUF; ONNX (`onnx-community`); MLX (`mlx-community`); Core ML
    `.mlpackage` / Core AI `.aimodel`; LiteRT `.tflite`/`.litertlm` (`litert-community`); ExecuTorch `.pte`; CTranslate2.
  - [x] Task 4.2. Which runtime reads which format; where official pre-converted variants live; examples of loading each.
  - [x] Task 4.3. 📊 SVG `ai-hugging-face-format-runtime-map.svg` (format → runtime map).
  - Files: `modules/ROOT/pages/ai/hugging-face/model-formats.adoc`, `modules/ROOT/images/ai-hugging-face-format-runtime-map.svg` (new).

### Group 3 — Python and models

**Parallelizable: yes.** Six independent pages (Tasks 5–10).

- [x] Task 5. Create `transformers-pipelines.adoc` ("Transformers Pipelines")
  - [x] Task 5.1. v5 `pipeline()` per task: `automatic-speech-recognition`, `text-to-audio`, `image-classification`,
    `zero-shot-image-classification`, `object-detection`, `image-segmentation`, `mask-generation`,
    `image-text-to-text`, `text-generation`; each with a snippet.
  - [x] Task 5.2. `Auto*` classes and processors; device/dtype; `transformers serve`; v4 → v5 migration notes.
  - Files: `modules/ROOT/pages/ai/hugging-face/transformers-pipelines.adoc` (new). 9 pipelines, Auto*/processors, dtype/device, `transformers serve` (flags and 300 s unload verified against the v5.17 serving docs), v4→v5 migration table. No tests apply; Antora build clean for this page (bibliography anchor pending Group 6).
- [x] Task 6. Create `speech-models.adoc` ("Speech Models: STT & TTS")
  - [x] Task 6.1. Curated STT catalogue (Whisper large-v3/turbo, distil-whisper, Parakeet/Canary, Moonshine) and TTS
    catalogue (Kokoro-82M, Piper voices, Parler-TTS, Dia, Orpheus, Chatterbox, Kyutai, VibeVoice, CSM): licence, size,
    languages, streaming, runtimes, card link — every cell verified.
  - [x] Task 6.2. Code with transformers, faster-whisper and Kokoro; name Voice Agents (#210) in prose for real-time use.
  - Files: `modules/ROOT/pages/ai/hugging-face/speech-models.adoc` (new). STT/TTS tables, licence/gating via Hub API 2026-09-30; gated cards (Orpheus, CSM) marked "see card"; Voice Agents in prose. Mermaid validated.
- [x] Task 7. Create `vision-models.adoc` ("Vision Models")
  - [x] Task 7.1. Catalogue: SigLIP 2, DINOv2/v3, YOLO (AGPL) vs. RT-DETRv2 / D-FINE, SAM 2.1 / SAM 3, Florence-2,
    SmolVLM, Qwen-VL, FastVLM; licences verified.
  - [x] Task 7.2. Code for classification, detection, segmentation and VLM captioning.
  - Files: `modules/ROOT/pages/ai/hugging-face/vision-models.adoc` (new). Catalogue with Hub-verified licences/gating (DINOv3, SAM 3 gated; YOLO AGPL; FastVLM apple-amlr); code for classification, detection, segmentation, VLM captioning. Mermaid validated.
- [x] Task 8. Create `small-llms-and-embeddings.adoc` ("Small LLMs & Embeddings")
  - [x] Task 8.1. Gemma 4 E2B/E4B, Gemma 3n/3, Phi-4-mini, Qwen3/3.5 small, SmolLM3, Llama 3.2 1B/3B; embedding models
    (MiniLM, Qwen3-Embedding, EmbeddingGemma); official quantized formats per model; on-device quality expectations.
  - [x] Task 8.2. Link `xref:database/vector-rag/generating-embeddings-in-practice.adoc[]` and
    `xref:ai/local-llms/open-weight-models.adoc[]`.
  - Files: `modules/ROOT/pages/ai/hugging-face/small-llms-and-embeddings.adoc` (new). Model and official-quantized-repo IDs verified via Hub API; `:stem: latexmath` for the memory formula; links to not-yet-written sibling pages kept as prose.
- [x] Task 9. Create `conversion-and-quantization.adoc` ("Conversion & Quantization")
  - [x] Task 9.1. GGUF (`convert_hf_to_gguf.py`, `llama-quantize`, imatrix, GGUF-my-repo); ONNX (`optimum-cli export
    onnx`, ORT GenAI model builder, Olive int4); Core ML (`coremltools.convert` + `optimize`); Core AI (`coreai-torch`,
    `coreai-models`); LiteRT (`litert-torch`) + LiteRT-LM bundles; MLX (`mlx_lm.convert -q`); ExecuTorch
    (`torch.export` → `.pte`, `optimum-executorch`); GPU-server quantization (bitsandbytes, GPTQModel, llm-compressor).
  - [x] Task 9.2. 📊 Mermaid of the conversion pipelines; link `xref:ai/local-llms/quantization-for-inference.adoc[]`
    (link, don't duplicate the theory).
  - Files: `modules/ROOT/pages/ai/hugging-face/conversion-and-quantization.adoc` (new). 📊 Mermaid conversion-pipelines flowchart (validate:mermaid passes); Core AI described without invented APIs.
- [x] Task 10. Create `fine-tuning-with-peft-and-trl.adoc` ("Fine-Tuning with PEFT & TRL")
  - [x] Task 10.1. When to fine-tune vs. prompting/RAG; LoRA \( W' = W + \tfrac{\alpha}{r}BA \) with parameter savings
    (`:stem: latexmath`); QLoRA/NF4; TRL `SFTTrainer`/`SFTConfig`; DPO.
  - [x] Task 10.2. Dataset preparation; merging and exporting adapters to GGUF/ONNX; fine-tuning embedding models
    (sentence-transformers) and classifiers (SetFit); compute estimates via formulas, no vendor numbers.
  - Files: `modules/ROOT/pages/ai/hugging-face/fine-tuning-with-peft-and-trl.adoc` (new). `:stem: latexmath`, LoRA formula and savings, QLoRA/NF4, SFT/DPO (TRL 1.14.1 config defaults verified), merging/export, sentence-transformers and SetFit, compute formulas.

### Group 4 — Integrating into backends

**Parallelizable: yes.** Independent pages (Tasks 11–12).

- [x] Task 11. Create `python-backends.adoc` ("Python Backends") — `modules/ROOT/pages/ai/hugging-face/python-backends.adoc` (1 Mermaid flowchart); Antora build clean apart from expected disclaimer `#_bibliography` anchor; `validate:mermaid` OK; no license headers (docs repo, no convention). To re-check in self-review: ORT `run` thread-safety wording, TEI `cpu-1.9` tag, `Qwen/Qwen3-0.6B` for `transformers serve`, snippets not executed.
  - [x] Task 11.1. FastAPI with the model loaded once in `lifespan`, threadpool/worker inference, batching, streaming;
    ASR (faster-whisper), TTS (Kokoro), vision (pipeline) and LLM (llama-cpp-python or `transformers serve`) endpoints.
  - [x] Task 11.2. ONNX Runtime sessions and execution providers; text-embeddings-inference sidecar; GPU/concurrency
    pitfalls; link the FastAPI reference only if it exists (else prose, choice 7).
- [x] Task 12. Create `java-and-spring-boot.adoc` ("Java & Spring Boot") — `modules/ROOT/pages/ai/hugging-face/java-and-spring-boot.adoc` (4 tables, 1 Mermaid flowchart); Antora build clean apart from expected disclaimer anchor; `validate:mermaid` OK; no license headers. To re-check in self-review: ORT GenAI Java not on Maven Central (build from source, hedged); DJL `TextEmbeddingTranslatorFactory` name; `de.kherud:llama` 4.2.0 (Maven) vs 4.1.0 (README); Spring AI 2.0.1 Ollama/OpenAI/transcription `base-url` property names; Speaches rc; snippets not compiled.
  - [x] Task 12.1. DJL (HF tokenizers, model zoo, ONNX engine); ONNX Runtime Java (`OrtSession`) and ORT GenAI Java;
    Spring AI `TransformersEmbeddingModel` (`spring.ai.embedding.transformer.onnx.*`); LangChain4j in-process ONNX
    embeddings; Jlama and `java-llama.cpp` with their caveats.
  - [x] Task 12.2. Recommended LLM path: local server (Ollama/vLLM/llama.cpp) behind Spring AI with `base-url`, linking
    `xref:ai/local-llms/index.adoc[]` and `xref:ai/spring-ai/index.adoc[]`; whisper/TTS via sidecar or ONNX; link
    `backend/springboot/*` pages that exist.

### Group 5 — Integrating into native, web and cross-platform apps

**Parallelizable: yes.** Independent pages (Tasks 13–17).

- [x] Task 13. Create `apple-platforms.adoc` ("Apple Platforms")
  - [x] Task 13.1. Core ML vs. Core AI (OS 27+; `AIModelAsset` → `AIModel` → `InferenceFunction`); swift-transformers;
    MLX / mlx-swift-lm (`ChatSession`); WhisperKit/TTSKit (argmax-oss-swift); Foundation Models
    `LanguageModelExecutor`; llama.cpp XCFramework; app size, memory and on-demand download (Background Assets).
  - [x] Task 13.2. Link back `xref:apps/apple/apple-intelligence-and-machine-learning.adoc[]`; state which APIs could
    not be validated on a device/simulator.
    _Done: `apple-platforms.adoc` (1 Mermaid, 2 tables, stem memory formula). `LanguageModelExecutor` found in Apple docs (OS 27) — shown as signature only; nothing run on device/simulator (stated in "What could not be validated"). Hub IDs checked 2026-09-30. Build clean except expected #_bibliography; mermaid OK. No license headers (docs repo, no convention)._
- [x] Task 14. Create `android.adoc` ("Android")
  - [x] Task 14.1. LiteRT 2.x (CompiledModel API; GPU/NPU delegates); LiteRT-LM (`.litertlm`, Gemma 4 E2B); MediaPipe LLM
    Inference migration note; Gemini Nano via ML Kit GenAI/AICore; ONNX Runtime Mobile; ExecuTorch; llama.cpp and
    whisper.cpp Android examples; model delivery (Play Asset Delivery / on-demand).
  - [x] Task 14.2. Link the existing `apps/android/*` pages (Gradle setup, camera/audio capture) after confirming names.
    _Done: `android.adoc` (Mermaid, 3 tables, stem sizing). Links 7 `apps/android/*` pages. Gemma 4 E2B LiteRT-LM ID verified (Apache-2.0, not gated). Verify later: `createConversation()` no-arg, ORT `addNnapi()`, ExecuTorch tensor accessors, Play for On-device AI details._
- [x] Task 15. Create `windows-and-dotnet.adoc` ("Windows & .NET")
  - [x] Task 15.1. Windows ML (system ONNX Runtime, dynamic EPs, NPU requirements, `winml` CLI); Windows AI APIs (Phi
    Silica → Aion Instruct, OCR, image APIs; Limited Access Feature); Foundry Local (SDK, OpenAI-compatible server);
    ORT GenAI C#; DirectML status; `Microsoft.ML.OnnxRuntime`; `Microsoft.Extensions.AI`
    `IChatClient`/`IEmbeddingGenerator`.
  - [x] Task 15.2. Link Windows Apps (#191) only if it exists at implementation time (else prose).
    _Done: `windows-and-dotnet.adoc` (Mermaid, 3 tables, stem). Windows Apps (#191) absent → prose. Phi Silica → Aion Instruct found announced on the official Phi Silica page (described as vendor announcement). `foundry run` (not `foundry model run`). Verify later: ORT GenAI C# loop method names, OpenAI adapter wiring, Kokoro C# path._
- [x] Task 16. Create `web-and-cross-platform.adoc` ("Web & Cross-Platform")
  - [x] Task 16.1. Transformers.js 4.x (`pipeline(task, model, {device:'webgpu', dtype:'q4'})`, WebGPU vs. WASM);
    ONNX Runtime Web; ExecuTorch cross-platform; React Native (llama.rn, react-native-executorch); Flutter
    (flutter_gemma, onnxruntime, llama_cpp_dart).
  - [x] Task 16.2. Link the existing `apps/react-native/*` pages.
    _Done: `web-and-cross-platform.adoc` (Mermaid, tables, stem size). Links 5 `apps/react-native/*` pages; onnx-community model IDs verified. Verify later: react-native-executorch hook names (API moved to `useLLMChatSession`), llama.rn version (latest tag is an RC), kokoro-js return fields, ExecuTorch import paths._
- [x] Task 17. Create `hf-inference-providers-and-spaces.adoc` ("Inference Providers & Spaces")
  - [x] Task 17.1. Inference Providers (router, `:fastest`/`:cheapest` suffixes, `InferenceClient`) replacing the
    decommissioned serverless Inference API; Inference Endpoints; Gradio 6 + Spaces/ZeroGPU for demos; smolagents
    briefly (`xref:ai/agents/index.adoc[]`); when to prefer local. No prices.
    _Done: `hf-inference-providers-and-spaces.adoc` (2 Mermaid, decision table). Router, `:fastest`/`:cheapest`/`:preferred`; model IDs have live provider mappings (checked 2026-09-30). No prices. Verify later: `InferenceClient` 2.0.0 return shapes, JS `chatCompletion`, gradio_client `token=`, gradio.app URLs._

### Group 6 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Each task edits a distinct file and references only pages from Groups 1–5. The PDF (Task 20)
reads the finished pages, so it runs after Tasks 18–19 inside this group's ordering.

- [x] Task 18. Create `ai/hugging-face/index.adoc` ("Hugging Face & On-Device Models") _(done: index.adoc (799 lines) + ai-hugging-face-decision-matrix.svg + Mermaid workflow; bibliography 330 URLs (4 books), 0 duplicates, 0 missing; URL audit: every non-code URL on the 18 pages is in the bibliography; developer.apple.com unreachable through the proxy, kept as official pages)_
  - [x] Task 18.1. Header, disclaimer, dated version baseline; the obtain → convert → integrate workflow; the *DocsAssistant
    goes offline* scenario; the platform × task × runtime × format decision matrix; recent renames and deprecations table.
  - [x] Task 18.2. 📊 SVG `ai-hugging-face-decision-matrix.svg` and Mermaid workflow.
  - [x] Task 18.3. `== What's covered`, grouped like the nav, each an `xref:` with a one-line summary.
  - [x] Task 18.4. `== Bibliography` built after reading every sibling page's `== References`, grouped per the issue:
    requester-provided books (bibliographic data, publisher page, code repo) / official documentation (Hub, `huggingface_hub`,
    libraries, model cards, runtimes, Java, Apple, Android/Google, Windows, cross-platform) / papers (Whisper, LoRA,
    QLoRA, DPO, SigLIP, DINOv2, SAM 2); closing with the house note that books are consulted references only.
  - [x] Task 18.5. URL audit: every URL cited on any page appears in `== Bibliography`; 0 duplicates; 0 non-canonical URLs
    (note hosts unreachable through the egress proxy).
- [x] Task 19. Create `cheat-sheet.adoc` ("Hugging Face & On-Device Models Cheat Sheet") _(done: cheat-sheet.adoc with grouped xrefs, PDF download line, own References)_
  - [x] Task 19.1. What the sheet covers; grouped xrefs to every page;
    `xref:attachment$ai-hugging-face-cheat-sheet.pdf[Download the Hugging Face & On-Device Models Cheat Sheet (PDF)]`;
    own `== References`.
- [x] Task 20. Produce `modules/ROOT/attachments/ai-hugging-face-cheat-sheet.pdf` _(done: HTML/CSS in scratchpad cheatsheet-200/, headless Chrome, PyMuPDF: 1 A4 page 595x842 pt, 410 KB)_
  - [x] Task 20.1. Print-ready HTML/CSS in the scratchpad (dense multi-column, colour-coded, version/date header,
    breadcrumb footer), consistent with `ai-local-llms-cheat-sheet.pdf`; only the PDF is checked in.
  - [x] Task 20.2. Content per the issue: `hf` CLI, download API, licence checklist, format → runtime table, pipeline task
    names, curated model table, conversion one-liners, LoRA formula + TRL skeleton, per-platform snippets, deprecations.
  - [x] Task 20.3. Render via headless Chromium; verify with `fitz` that it is **exactly one A4 page**.
- [x] Task 21. Insert the nav block into `modules/ROOT/nav.adoc` between the `ai/local-llms` block (after its Cheat Sheet
  line) and `*** xref:ai/langchain/index.adoc[LangChain]`: index + 16 concept children in outline order + Cheat Sheet (PDF).
  _(done: nav.adoc, 18 lines inserted between the local-llms Cheat Sheet line and LangChain)_
- [x] Task 22. Edit `modules/ROOT/pages/ai/index.adoc` _(done: ai/index.adoc — xref bullet in place; Lee, Alammar, Huyen, Wilson cite the new bibliography; 37 keywords appended)_
  - [x] Task 22.1. Replace the "(planned)" bullet with an `xref:` bullet in place.
  - [x] Task 22.2. Point Lee (and Alammar, Huyen, Wilson where they name this sub-section) at
    `xref:ai/hugging-face/index.adoc#_bibliography[…]` (non-empty link text); remove the "planned" wording.
  - [x] Task 22.3. Append new terms to `:keywords:` (skip duplicates).
- [x] Task 23. Edit root `modules/ROOT/pages/index.adoc`: append genuinely new `:keywords:` (Hugging Face, Hub, safetensors,
  ONNX, Core ML, LiteRT, ExecuTorch, Transformers.js, PEFT, LoRA, QLoRA, on-device AI, …), skipping duplicates.
  _(done: pages/index.adoc, 30 new keywords appended, none duplicated)_
- [x] Task 24. Add cross-links in existing pages _(done: apple-intelligence-and-machine-learning, android/index, react-native/index, generating-embeddings-in-practice; 8 stale "planned Hugging Face" mentions in ai/* pages now xrefs; plus sibling prose->xref housekeeping in 9 concept pages and 11 canonical-URL rewrites)_
  - [x] Task 24.1. `apps/apple/apple-intelligence-and-machine-learning.adoc`: a sentence linking
    `xref:ai/hugging-face/apple-platforms.adoc[]` (bring your own models, Core AI, MLX).
  - [x] Task 24.2. `apps/android/index.adoc` and `apps/react-native/index.adoc`: a bullet linking
    `ai/hugging-face/android.adoc` and `ai/hugging-face/web-and-cross-platform.adoc` respectively.
  - [x] Task 24.3. `database/vector-rag/generating-embeddings-in-practice.adoc`: link
    `small-llms-and-embeddings.adoc` and `java-and-spring-boot.adoc` (in-process ONNX embeddings).
  - [x] Task 24.4. Replace any stale "planned Hugging Face" mentions elsewhere in the AI pages
    (`grep -rn "planned Hugging Face\|Hugging Face.*planned" modules/ROOT/pages/ai`) with real `xref:`s where the target now exists.

### Group 7 — Build and verify

**Parallelizable: yes** (single task, after Group 6).

- [x] Task 25. Build and verify
  - [x] Task 25.1. `npx antora antora-playbook.yml` on a clean `build/` via an `iru-gate-runner` sub-agent: exit 0, **0 errors
    and 0 warnings** introduced by this sub-section. — clean build: exit 0, 0 errors, 0 warnings; 18 HTML files in `build/site/ai/hugging-face/`.
  - [x] Task 25.2. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` via a sub-agent; all diagrams parse; restore
    `node_modules/.package-lock.json`. — 671 diagrams OK, 0 failed (mermaid/jsdom already present; nothing installed).
  - [x] Task 25.3. Reachability: all 16 concept pages + `cheat-sheet.adoc` are `xref:`-linked from `ai/hugging-face/index.adoc`
    and `nav.adoc`; `build/site/ai/hugging-face/` has 18 HTML files; every `ai-hugging-face-*.svg` is in
    `build/site/_images/`; the PDF is 1 A4 page. — all 17 linked from index + nav; 18 HTML; both SVGs in `_images/`; PDF 1 page, 595x842 pt (A4).
  - [x] Task 25.4. Grep checks: disclaimer include in all 18 files and no other admonition under `ai/hugging-face/`; book surnames
    only on the index; every content page has `:description:`, `:keywords:`, dated versions, `== References` and a code
    example; no `^\[\.[A-Z]` role-captions; no `xref:` in backticks; no empty-text fragment xrefs; no `xref:` to a missing
    page; no existing page called "planned"; no line-leading `20NN.`; no hardcoded secrets (`hf_`, `sk-`, `ghp_`); no
    quoted benchmark numbers/prices; no book PDF in the diff. — all pass: disclaimer in 18/18, only admonition is the partial's; book surnames only on index; all 17 content pages have description/keywords/dated versions/References (16 with code, cheat sheet is a table page); `planned` only names sections that do not exist; `hf_`/`sk-` hits are API names only (`hf_hub_download`, `mask-generation`); only PDF in status is the cheat sheet.
  - [x] Task 25.5. **Self-review pass** with fresh `general-purpose` sub-agents (pages in parallel batches): verify every CLI flag,
    env var, API name, model ID, licence and URL against official docs; fix every real finding; rebuild; record findings
    count. — 6 parallel batches; **38 real findings fixed** (33 by reviewers + 5 cross-page follow-ups): e.g. `optimum-onnx[onnxruntime]` install extra, LiteRT `export.export`, ORT GenAI builder `-e` values (`NvTensorRtRtx`, not `trt-rtx`), broken LoRA-to-GGUF option B, ORT GenAI Java snippet moved to current `appendTokenSequences` API, react-native-executorch 0.10 hooks and peer pins, flutter_gemma speech packages, `onnx-community/whisper-small` licence, Piper language count, VibeVoice languages, Serve CLI URL moved to `serve-cli/serving`, 404 Inference Providers TTS task URL removed, transformers 5.17 vs huggingface_hub 2.0 pin hedge, Python 3.10+ for transformers 5.17. Rebuild: exit 0, 0 errors, 0 warnings, 18 HTML; Mermaid 671 OK.
  - [x] Task 25.6. Re-check the PDF matches the pages after fixes; re-render if needed; re-run the Task 18.5 URL audit. — sheet.html ONNX line now `optimum-onnx[onnxruntime]`; re-rendered, 1 A4 page (PyMuPDF). URL audit: 330 Bibliography URLs, every page-cited URL present (incl. new Llama quantization and react-native-executorch 0.10 URLs), 0 duplicates, only extras are the book pages.

### Group 8 — Integration-branch verification

**Parallelizable: yes** (single task; sub-tasks in order, after Group 7).

- [x] Task 26. Verify against the integration branch and compute merge readiness _(done: commit b2a1312c; READY)_
  - [x] Task 26.1. Commit on `feature/200` (trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`); do not push here and do not
    commit `.secrets.baseline`, `build/`, `implementation_plan.md` leftovers. `git fetch origin`, merge the latest
    `origin/feature/213-ai-section`; expected conflict points: the `ai/index.adoc` sections and `:keywords:`, the
    nav AI block, root `:keywords:`. Keep every sibling's entries in the fixed order; else record "already up to date".
  - [x] Task 26.2. Re-run the Antora build and `npm run validate:mermaid` on the merged result via `iru-gate-runner`; both clean.
  - [x] Task 26.3. Confirm prerequisite **#207** is merged into `feature/213-ai-section` (`git merge-base --is-ancestor` on
    the #207 commit or the merged PR).
  - [x] Task 26.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-200.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #207 <✅ merged / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY | ⏳ WAIT: keep as draft until prerequisites are merged, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213
    ```
    Note the post-merge chores: tick #200 in #213's *Progress* checklist and delete `feature/200`.
  _(26.1: committed b2a1312c incl. user-audited `.secrets.baseline` (deviation approved by user); origin/feature/213-ai-section (bfdf41f7) already an ancestor — already up to date. 26.2: Antora exit 0, 0 errors, 0 warnings, 18 HTML; Mermaid 671 OK. 26.3: #207 = 35a8d9b8, ancestor of origin/feature/213-ai-section. 26.4: block written, Status READY.)_
