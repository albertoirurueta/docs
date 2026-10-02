# Implementation Plan: Guides & References / AI — section landing page + "LLM Foundations & Prompting"

## Task summary

Source: GitHub issue #202
Base branch: feature/213-ai-section

Issue [#202](https://github.com/albertoirurueta/docs/issues/202) asks for two things.

1. **Create the top-level Guides & References / AI section.** This covers:
   * the landing page `modules/ROOT/pages/ai/index.adoc`
   * an `** xref:ai/index.adoc[AI]` nav block
   * an `ai.svg` entry in the root page's picker
   * a shared `ai-disclaimer.adoc` partial
2. **Build its first sub-section, "LLM Foundations & Prompting".** It lives in `modules/ROOT/pages/ai/llm-foundations/`.
   * 19 concept pages, a sub-section `index.adoc` with `== Bibliography`, and `cheat-sheet.adoc`.
   * A one-page A4 PDF, `modules/ROOT/attachments/ai-llm-foundations-cheat-sheet.pdf`.
   * Its own `ai-llm-foundations-disclaimer.adoc` partial.

This is issue 1 of 15 in the AI section. The other 14 sub-sections link back to these pages for tokens, sampling,
context windows, prompting and model choice.

The issue body is the spec. Its sections "Page outline", "Cross-links to add in existing pages", "Bibliography",
"Section-wide conventions" and "Branching, PR target and merge strategy" are binding. Every task below that authors
a page must read that page's bullet list in the issue (`gh issue view 202`) and cover **every** bullet.

### Merge constraints (from #202 → "Branching, PR target and merge strategy")

**Where this PR goes**

* The PR forks from and targets the integration branch **`feature/213-ai-section`**. That branch belongs to
  collector issue #213.
* It **never** targets `main`. The only way into `main` is #213's final integration PR, opened after all 15 AI
  issues are merged into the integration branch.

**When it can merge**

* **No prerequisites.** #202 is wave 1 and has no hard dependencies.
* It can be marked ready and merged into `feature/213-ai-section` once it has had human review and the Antora build
  plus Mermaid validation pass on `feature/202` merged with the latest `origin/feature/213-ai-section`.

**PR body and ticket bookkeeping**

* The PR body references the ticket as `Refs #202`. `Closes` only works on PRs into the default branch.
* The body must carry the *Merge readiness* block defined in the issue, filled in by Group 7.
* After the merge, tick #202 in #213's *Progress* checklist and delete `feature/202`.

### Choices made on the user's behalf

1. **Ship everything in one pass.** All 19 concept pages, both `index.adoc` files, `cheat-sheet.adoc`, the PDF, the
   picker SVG and the cross-links go in, exactly as the issue specifies, with no consolidation. This follows #187,
   which shipped 23 pages in one pass.
2. **Books are named only in the bibliographies.** The four requester-provided books are
   Huyen, *AI Engineering*; Alammar & Grootendorst, *Hands-On Large Language Models*; Taulli, *AI-Assisted
   Programming*; Osmani, *Beyond Vibe Coding*.
   * They are consulted for concept narrative only and are **never** the source of a code example.
   * They are named **only** in `ai/llm-foundations/index.adoc` → `== Bibliography` and in
     `ai/index.adoc` → `== Books used in this section`.
   * Where a book is outdated, the page says "an older approach was X; today Y" in plain prose with no book
     reference. Examples: model generations, the retired Open LLM Leaderboard, and parse-the-text structured output
     compared with native JSON-schema modes.
   * The PDFs in `~/Desktop/ai` are never copied, attached or quoted.
3. **Disclaimers follow the #145 / #187 rule, with two partials:**
   * `partials/ai-disclaimer.adoc` is included only by `ai/index.adoc`. It is an `[IMPORTANT]` block with **only**
     the AI-assistance sentence. That landing page has no bibliography to point to; its book list is linked
     from the page body instead.
   * `partials/ai-llm-foundations-disclaimer.adoc` is included by every page under `ai/llm-foundations/`. It
     holds the AI-assistance sentence plus
     `xref:ai/llm-foundations/index.adoc#_bibliography[bibliography]`.

   No other admonition may appear anywhere in `ai/`. Version baselines, deprecations and "planned sub-section"
   notes all go in ordinary prose.
4. **Tasks are untagged, so no language key applies.** Every task authors AsciiDoc, SVG or PDF documentation. The
   installed `*-code-one-task` skills (`java`, `java-springboot`, `dotnet`, `database`) implement repository
   source code, not docs, so each task is implemented directly. The Python, Java and `curl` examples *inside* the
   pages are page content, not repository source.
5. **One running scenario, *DocsAssistant*,** is reused from `database/vector-rag/index.adoc`: an assistant that
   answers questions about this site's AsciiDoc pages. Prompt examples ask it to answer, summarise, extract page
   metadata as JSON, or classify pages by component.
   * **Hosted model example:** a current Claude model through the Anthropic SDK. Pick the ID from
     https://platform.claude.com/docs/en/models/overview at implementation time; `claude-sonnet-5` is expected.
   * **Second hosted example:** where the page compares providers, a current OpenAI model through the OpenAI SDK.
   * **Local model:** Ollama `llama3.1:8b`, the same chat model the vector-rag section uses, so the two sections
     interoperate. Examples use Ollama's OpenAI-compatible endpoint (`http://localhost:11434/v1`) so they run
     locally.
   * **Local reasoning model:** `reasoning-models.adoc` needs one. Use a thinking-capable model from Ollama's
     thinking docs (e.g. `gpt-oss:20b` or a Qwen3 tag) and say so on the page.
6. **Math uses the repo's existing convention.** Pages with formulas add `:stem: latexmath` to the header, write
   display math as `[stem]` + `++++` … `++++`, and inline math as `stem:[…]`. This is the syntax
   `database/vector-rag/*` and `database/elasticsearch/*` already use with the `@djencks/asciidoctor-mathjax`
   extension. The issue's `\( … \)` formulas are transcribed into it.
7. **Sibling AI sub-sections are named in plain prose.** None of them exist yet, so there is no `xref:`, per the
   issue's "Cross-links" convention; for example: "the planned *AI Agents* sub-section". Each sibling issue adds
   the xrefs back when it lands.
8. **Versions are re-verified at implementation time and dated.** Check the anthropic and openai SDKs, tiktoken
   and dspy on PyPI, Spring AI on Maven Central, and Ollama on its releases page. Update the table if anything
   moved.

   | Component | Version | Checked |
   |---|---|---|
   | Python | 3.12 | 2026-09-28 |
   | `anthropic` (Python SDK) | current on PyPI | 2026-09-28 |
   | `openai` (Python SDK) | current on PyPI | 2026-09-28 |
   | `transformers` / `tokenizers` | 5.x (5.17 as of 2026-09-27) | 2026-09-27 |
   | `tiktoken` | current on PyPI | 2026-09-28 |
   | `dspy` | current on PyPI | 2026-09-28 |
   | Spring Boot / Spring AI | 4.1 / 2.0.1 | 2026-09-27 |
   | Ollama | 0.34.x | 2026-09-27 |

   Model names, prices and leaderboard positions are **never** written as timeless facts. Each is dated
   ("as of <date>") and links the vendor's official page.

## Current code state

**The new section does not exist yet.** There is no `modules/ROOT/pages/ai/` directory. None of the partials,
images or attachment exist: `ai-disclaimer.adoc`, `ai-llm-foundations-disclaimer.adoc`, `images/ai.svg`,
`images/ai-llm-foundations-*.svg` and `attachments/ai-llm-foundations-cheat-sheet.pdf`.

**`modules/ROOT/nav.adoc`**

* **Where the new block goes.** Guides & References ends with the Cloud block. Its last line is
  `**** xref:cloud/azure/cheat-sheet.adoc[Cheat Sheet (PDF)]`, and the next line is
  `** xref:git-and-github/index.adoc[Git & GitHub]`. The new AI block goes between them. Match on this text, not on
  line numbers; they were 1045/1046 at planning time.
* **Existing `** AI` label.** Line 3 already has an **unrelated** `** AI` label under "Open Source Projects"; its
  only child is `*** xref:ai-catalog::index.adoc[AI Catalog]`. Leave it alone. The new
  `** xref:ai/index.adoc[AI]` sits in the separate Guides & References tree. The duplicate label is expected and
  is not a conflict.

**`modules/ROOT/pages/index.adoc`**

* **Header.** Line 2 is `:description:`, whose list of standalone references ends "…, cloud, and Git and GitHub
  references." Line 3 is a very long `:keywords:`.
* **Picker table.** `== Guides & References` has a `[cols="1,1,1",frame=none,grid=none]` picker table. It holds
  `a|` + `image::<name>.svg[xref="<path>"]` cells in this order: programming-languages, databases,
  web-development, backend-development, apps, cloud, git-and-github. It ends with **two empty `a|` placeholder
  cells**. The AI entry replaces the **first** of those two empty cells, so the table keeps 3×3 cells.

**Picker SVG style (`images/cloud.svg`, `images/git-and-github.svg`)**

* The picker SVGs are 600×600 `viewBox="0 0 600 600"` rounded cards. Each has a two-stop `linearGradient`
  background, a white line-icon, an 800-weight title in `font-family="Arial, Helvetica, sans-serif"` at size 52, a
  thin divider, and a 25px subtitle.
* `images/ai-catalog.svg` already exists for the Open Source picker. `ai.svg` must be visually distinct from it,
  with a different gradient and icon.

**Content-page shape to mirror (`database/vector-rag/*.adoc`)**

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, optionally `:stem: latexmath`, a blank line,
  `include::partial$<x>-disclaimer.adoc[]`.
* **Body:** a lead paragraph that states the versions the page targets, then `==` sections.
* **Footer:** optional `== Related pages` (a list of `xref:`s), then `== References`, which links online docs and
  papers only.
* **Landing pages:** a reading-order paragraph, `== What's covered` with grouped bullets, and `== Bibliography`.
  The model is `database/vector-rag/index.adoc`. Its *DocsAssistant* table is the one to reference: link it and
  don't copy it wholesale.
* **Cheat-sheet pages:** the model is `database/vector-rag/cheat-sheet.adoc`. It has grouped back-link paragraphs
  and ends with `xref:attachment$<x>-cheat-sheet.pdf[Download … (PDF)]`.
* **Figures:** content SVGs use a `viewBox`, `font-family="Helvetica, Arial, sans-serif"`, a flat light background
  and hard-coded hex colours, with no CSS variables and no external references. Pages embed them with
  `image::<name>.svg["alt text",width=…,role=text-center]`. Mermaid blocks are `[mermaid]` + `....`.

**Disclaimer partial markup to copy.** `partials/redis-disclaimer.adoc` and `partials/vector-rag-disclaimer.adoc`
both use `[IMPORTANT]` + `====` … `====`.

**Existing pages that get cross-link sentences**

* `database/vector-rag/embeddings.adoc`
* `database/vector-rag/prompt-augmentation-and-generation.adoc`
* `apps/apple/apple-intelligence-and-machine-learning.adoc`. Its `== Prompt Injection and Agentic Features`
  section (about line 1195) mentions tool calling and guided generation.

**Tooling available**

* **Build:** `npx antora antora-playbook.yml`. The playbook also pulls remote components; the `ai-catalog`
  component exists, so `xref:ai-catalog::index.adoc[]` resolves.
* **Mermaid validation:** `npm run validate:mermaid` via `scripts/validate-mermaid.mjs`. It needs
  `npm i --no-save mermaid@11 jsdom` first.
* **PDF rendering:** headless Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.
* **PDF checks:** PyMuPDF (`fitz`) and `pdfinfo`.
* **Sub-agent:** the `iru-gate-runner` agent is in `.claude/agents/`.

**Known AsciiDoc gotchas (from #187)**

* Avoid `{word}` in prose; Antora warns about a missing attribute. Put it in backticks, or escape it as `\{word}`.
* Never start a prose line with `<digits>.`, e.g. a year like `2026.`. AsciiDoc turns it into an ordered list.

**Precedent.** `.archive/implementation_plan_187.md` (Vector Databases & RAG) is the model this plan follows: its
group shape, cheat-sheet pipeline and final checks.

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, plus `:stem: latexmath` if the page has
  math, a blank line, and `include::partial$ai-llm-foundations-disclaimer.adoc[]`.
* **Lead paragraph.** It states the versions and models the page's examples target, and the date checked.
* **Cover every bullet.** Every bullet in the issue's "Page outline" entry for that page is covered.
* **Code examples.** Every concept has at least one code example. Each is followed immediately by a sentence
  linking the official page it derives from, e.g. "See link:…[Anthropic — Structured outputs]."
  * Python is the primary language, using the Anthropic / OpenAI SDKs, HF `transformers` / `tokenizers`, and
    `tiktoken`.
  * Add a short Spring AI `ChatClient` Java variant on the prompt and structured-output pages.
  * Add a `curl` variant against Ollama's OpenAI-compatible endpoint where it helps local reproduction.
* **Figures.** Meet every 📊 floor in the issue. Name SVGs `ai-llm-foundations-<topic>.svg` in
  `modules/ROOT/images/`, and make them legible on light and dark themes: a flat light card background and
  dark text. Each task authors the SVGs its own page embeds.
* **Links.** Link to existing pages instead of re-explaining them: vector-rag embeddings, RAG, "lost in the middle"
  and prompt augmentation. Name sibling AI sub-sections in plain prose only.
* **Footer.** End with `== Related pages` for `xref:`s to sibling pages in `ai/llm-foundations/` and to existing
  site pages. Then `== References`, which links only online official docs and papers used by that page, never the
  books.
* **No admonitions.** Use no `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` blocks.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (a single task; every later page includes the partials it creates).

- [x] Task 1. Create the two disclaimer partials
  - [x] Task 1.1. Create `modules/ROOT/partials/ai-disclaimer.adoc`. It is an `[IMPORTANT]` / `====` block
    containing **only** this sentence: "This content was generated with the assistance of AI and should be verified
    against the official documentation of each tool and framework before being relied on in production." Copy the
    markup shape from `partials/vector-rag-disclaimer.adoc`. — created, matching the model's markup shape.
  - [x] Task 1.2. Create `modules/ROOT/partials/ai-llm-foundations-disclaimer.adoc` with the same block, containing
    **only**:
    * (a) the same AI-assistance sentence
    * (b) "This section's xref:ai/llm-foundations/index.adoc#_bibliography[bibliography] lists the reference
      material consulted while preparing these pages."

    Add no version line, no book name and no other sentence. — created, containing exactly these two sentences.
  - [x] Task 1.3. Record the two include lines the later tasks use:
    * `include::partial$ai-disclaimer.adoc[]`, used only by `ai/index.adoc`
    * `include::partial$ai-llm-foundations-disclaimer.adoc[]`, used by every page under `ai/llm-foundations/`

### Group 2 — Content pages: how LLMs work

**Parallelizable: yes.** There are nine independent pages (Tasks 2–10). Each includes the Group 1 partial and only
`xref:`s other pages; no page needs another page's finished text. This group comes first because it fixes the
vocabulary and formula symbols that Groups 3–4 reuse, as a shared-notation reference:

| Symbol | Meaning |
|---|---|
| `n_in` / `n_out` | tokens in / out |
| `p_in` / `p_out` | price per token in / out |
| `T` | temperature |
| `z_i` | logits |
| TTFT, TPOT | time to first token, time per output token |
| `d_k` | key dimension |

All pages go in `modules/ROOT/pages/ai/llm-foundations/`.

- [x] Task 2. Create `what-is-an-llm.adoc` ("What Is an LLM?")
  - [x] Task 2.1. Cover: language model → LLM → foundation model; self-supervised pre-training; next-token
    prediction as the core loop; base vs. instruction-tuned vs. reasoning models; the three-layer AI stack
    (application / model / infrastructure); AI engineering vs. ML engineering; what LLMs are good and bad at, as a
    table.
  - [x] Task 2.2. Examples:
    * a minimal next-token loop with HF `transformers`, using a small model, e.g. `pipeline("text-generation")`,
      then a manual `generate()` over logits
    * the same prompt sent to a hosted model with the Anthropic SDK and to Ollama via `curl`
  - [x] Task 2.3. 📊 Add `ai-llm-foundations-ai-stack.svg`, the three-layer stack. Add `== Related pages` and
    `== References`: HF transformers docs, Anthropic models overview, and Bommasani et al. on foundation models
    (https://arxiv.org/abs/2108.07258).
- [x] Task 3. Create `tokens-and-tokenization.adoc` ("Tokens & Tokenization"), with `:stem: latexmath`
  - [x] Task 3.1. Cover: BPE / WordPiece / SentencePiece / byte-level; vocabulary and special tokens; chat
    templates (`apply_chat_template`); tokens vs. words across languages and code; tokens → cost and latency with
    `[stem]` stem:[\text{cost} = n_{in}\,p_{in} + n_{out}\,p_{out}]. Link `database/vector-rag/embeddings.adoc` for
    what happens after token IDs.
  - [x] Task 3.2. Examples:
    * `tiktoken` encoding and counting
    * HF `AutoTokenizer` (`tokenize`, `encode`, `apply_chat_template`)
    * the Anthropic token-counting API (`client.messages.count_tokens`)
    * a small table comparing token counts for one English sentence, one Spanish sentence and one code snippet.
      Compute the counts when writing, and state the tokenizer and date.
  - [x] Task 3.3. 📊 Mermaid flow: text → tokens → IDs → embeddings. Add References: tiktoken, HF tokenizers and
    chat templates docs, Anthropic token counting, and Sennrich et al., BPE (https://arxiv.org/abs/1508.07909).
- [x] Task 4. Create `transformer-architecture.adoc` ("Transformer Architecture"), with `:stem: latexmath`
  - [x] Task 4.1. Cover:
    * the forward pass
    * self-attention, with display math stem:[\mathrm{Attention}(Q,K,V)=\mathrm{softmax}(QK^\top/\sqrt{d_k})V]
    * multi-head attention, FFN, residuals, RMSNorm and SwiGLU
    * positional encoding and RoPE
    * encoder / decoder / encoder-decoder
    * MQA / GQA
    * MoE
    * SSM alternatives (Mamba)
  - [x] Task 4.2. Example: a short `transformers` script that loads a small decoder model with
    `output_attentions=True` and prints the attention tensor shapes per layer and head, plus the config fields
    (`num_attention_heads`, `num_key_value_heads`).
  - [x] Task 4.3. 📊 Add `ai-llm-foundations-decoder-block.svg` and
    `ai-llm-foundations-attention-heatmap.svg`, an illustrative heat-map that says it is illustrative. Add
    References: Vaswani et al. (https://arxiv.org/abs/1706.03762), RoFormer/RoPE
    (https://arxiv.org/abs/2104.09864), FlashAttention (https://arxiv.org/abs/2205.14135), GQA
    (https://arxiv.org/abs/2305.13245), Mixtral / MoE (https://arxiv.org/abs/2401.04088), Mamba
    (https://arxiv.org/abs/2312.00752), and the HF transformers docs.
- [x] Task 5. Create `training-pipeline.adoc` ("How LLMs Are Trained"), with `:stem: latexmath`
  - [x] Task 5.1. Cover:
    * pre-training data
    * scaling laws and Chinchilla, as display math of the compute-optimal rule stem:[C \approx 6ND] and
      "about 20 tokens per parameter"
    * SFT
    * preference tuning: the reward-model loss stem:[-\log\sigma(r_\theta(x,y_w)-r_\theta(x,y_l))] and the DPO
      loss
    * RL for reasoning (RLVR / GRPO), from paper sources
    * why post-training shapes behaviour
    * a plain-prose pointer to the planned *Hugging Face & On-Device Models* sub-section for hands-on
      fine-tuning
  - [x] Task 5.2. Example: a minimal TRL `SFTConfig` / `SFTTrainer` sketch labelled "conceptual; see the Hugging
    Face sub-section", plus a snippet that inspects a model's chat template to show the SFT format.
  - [x] Task 5.3. 📊 Mermaid of pre-train → SFT → preference → RL. Add References: Chinchilla
    (https://arxiv.org/abs/2203.15556), InstructGPT (https://arxiv.org/abs/2203.02155), DPO
    (https://arxiv.org/abs/2305.18290), DeepSeekMath / GRPO (https://arxiv.org/abs/2402.03300), and the TRL docs.
- [x] Task 6. Create `sampling-and-decoding.adoc` ("Sampling & Decoding"), with `:stem: latexmath`
  - [x] Task 6.1. Cover:
    * logits and softmax with temperature, stem:[p_i = e^{z_i/T}/\sum_j e^{z_j/T}]
    * greedy, top-k and top-p
    * stop sequences and max tokens
    * logprobs
    * best-of-N and test-time compute
    * determinism and seeds, and why T=0 isn't fully deterministic (batching, floating point)
    * a table of recommended settings per task: code, extraction, creative
    * which parameters reasoning models ignore or restrict, per the vendor docs
  - [x] Task 6.2. Examples:
    * a numpy softmax-with-temperature demo
    * `temperature` / `top_p` / `stop_sequences` with the Anthropic SDK
    * `logprobs` with the OpenAI SDK
    * `options: {temperature, top_k, top_p, seed}` with the Ollama `/api/chat` endpoint
  - [x] Task 6.3. 📊 Add `ai-llm-foundations-temperature.svg`, the same logits at T = 0.2 / 1 / 2. Add References:
    Anthropic and OpenAI API reference pages, the Ollama API, and Holtzman et al.
    (https://arxiv.org/abs/1904.09751).
- [x] Task 7. Create `context-windows-and-memory.adoc` ("Context Windows & Memory")
  - [x] Task 7.1. Cover:
    * the context window as working memory
    * the KV cache, in prose
    * long-context degradation: needle-in-a-haystack and "lost in the middle". Link
      `database/vector-rag/prompt-augmentation-and-generation.adoc`.
    * prompt caching for Anthropic (`cache_control`) and OpenAI (automatic), with a dated cost example
    * truncation and compaction
    * stateless APIs vs. conversation state
    * plain-prose pointers to the planned *AI Agents* sub-section (memory) and to the existing RAG pages
  - [x] Task 7.2. Examples:
    * an Anthropic prompt-caching request with `cache_control` on a long DocsAssistant system prompt, printing
      `usage.cache_creation_input_tokens` / `cache_read_input_tokens`
    * a small Python helper that trims conversation history to a token budget
  - [x] Task 7.3. 📊 Mermaid of what fills a context window: system prompt, tools, retrieved docs, history,
    user turn and output budget. Add References: the Anthropic prompt-caching and context-windows docs, the OpenAI
    prompt-caching guide, and Liu et al. (https://arxiv.org/abs/2307.03172).
- [x] Task 8. Create `reasoning-models.adoc` ("Reasoning Models")
  - [x] Task 8.1. Cover:
    * thinking / extended reasoning
    * effort and budget parameters: Anthropic extended thinking `budget_tokens` / effort, and OpenAI
      `reasoning.effort`. Verify the current parameter names.
    * interleaved thinking with tools
    * when reasoning helps and when it only adds latency and cost
    * prompting reasoning models: state goals and constraints, don't script the steps
  - [x] Task 8.2. Examples:
    * Anthropic extended thinking, printing the thinking and text blocks
    * an OpenAI reasoning request with an effort level
    * Ollama `think: true` with a thinking-capable local model
  - [x] Task 8.3. Add a table of when to use a reasoning model and when a fast model is better. Add References:
    Anthropic extended thinking, the OpenAI reasoning guide, and Ollama thinking docs.
- [x] Task 9. Create `multimodal-models.adoc` ("Multimodal Models")
  - [x] Task 9.1. Cover:
    * ViT patches
    * CLIP contrastive embeddings
    * native multimodal LLMs with image and PDF input
    * audio in and out, with a plain-prose pointer to the planned *Voice Agents* sub-section
    * image generation vs. understanding
  - [x] Task 9.2. Examples:
    * an Anthropic image-input request (base64 PNG of a docs screenshot: "describe this page")
    * a PDF-input request
    * a CLIP zero-shot classification snippet with `transformers`
  - [x] Task 9.3. Add References: the Anthropic vision and PDF-support docs, ViT
    (https://arxiv.org/abs/2010.11929), and CLIP (https://arxiv.org/abs/2103.00020).
- [x] Task 10. Create `hallucinations-and-limitations.adoc` ("Hallucinations & Limitations")
  - [x] Task 10.1. Cover:
    * why models hallucinate
    * inconsistency
    * knowledge cutoff
    * sycophancy
    * package hallucination, with a plain-prose pointer to the planned *AI Security & Responsible AI*
      sub-section
    * mitigations: grounding, citations, closed choices, verification, abstaining ("I don't know")
  - [x] Task 10.2. Examples:
    * a grounded DocsAssistant prompt that allows "I don't know"
    * a closed-choice classification prompt
    * a self-verification second pass (answer → check claims against the provided context)
  - [x] Task 10.3. Add References: Anthropic "Reduce hallucinations" guide, the OpenAI prompting guide, and
    Huang et al., hallucination survey (https://arxiv.org/abs/2311.05232).

### Group 3 — Content pages: prompt and context engineering

**Parallelizable: yes.** There are five independent pages (Tasks 11–15). They reuse only the Group 2 vocabulary.
Every page's examples use *DocsAssistant*. The pages are:

- [x] Task 11. Create `prompt-engineering-fundamentals.adoc` ("Prompt Engineering Fundamentals")
  - [x] Task 11.1. Cover:
    * system / developer / user / assistant roles
    * the anatomy of a prompt: role, instructions, context, input with delimiters or XML tags, output format
    * the specificity checklist
    * zero-shot / one-shot / few-shot (in-context learning)
    * the anti-patterns table: vague, overloaded, no actual question, "the above code", inconsistent examples
    * iterative refinement
  - [x] Task 11.2. Examples:
    * a before/after DocsAssistant prompt
    * an XML-tagged prompt with the Anthropic SDK
    * a few-shot classification prompt
    * the same prompt through Spring AI `ChatClient`
      (`chatClient.prompt().system(...).user(...).call().content()`)
  - [x] Task 11.3. 📊 Add `ai-llm-foundations-prompt-anatomy.svg`. Add References: the Anthropic
    prompt-engineering overview, the OpenAI prompt-engineering guide, GitHub Copilot prompt engineering, and the
    Spring AI ChatClient docs.
- [x] Task 12. Create `prompting-techniques.adoc` ("Prompting Techniques")
  - [x] Task 12.1. Cover:
    * chain-of-thought, and its relevance with reasoning models
    * prompt chaining and task decomposition
    * self-consistency
    * tree-of-thought
    * self-critique and reflection
    * metaprompting / prompt generators
    * role prompting
    * prefilling
    * ReAct, with a plain-prose pointer to the planned *AI Agents* sub-section
    * a before/after table per technique
  - [x] Task 12.2. Examples:
    * a two-step chain in Python (extract → answer)
    * a self-consistency majority vote over N samples
    * a prefilled assistant turn with the Anthropic SDK — targets `claude-haiku-4-5` with prose explaining that
      `claude-sonnet-5`/4.6+ generations no longer accept response prefill (verified against Anthropic's current
      migration guidance, 2026-09-28); every other example on the page uses `claude-sonnet-5`.
  - [x] Task 12.3. Add References: Wei et al., CoT (https://arxiv.org/abs/2201.11903); Wang et al.,
    Self-Consistency (https://arxiv.org/abs/2203.11171); Yao et al., ToT (https://arxiv.org/abs/2305.10601);
    Yao et al., ReAct (https://arxiv.org/abs/2210.03629); and the Anthropic prompt-chaining and prefill docs
    (current URLs under `claude-prompting-best-practices#chain-complex-prompts` and
    `#migrating-away-from-prefilled-responses`, verified 2026-09-28).
- [x] Task 13. Create `structured-output-and-tool-calling.adoc` ("Structured Output & Tool Calling")
  - [x] Task 13.1. Cover:
    * JSON mode vs. JSON-schema / strict structured outputs
    * constrained (grammar) decoding: Ollama `format` with a JSON schema, and llama.cpp grammars
    * Pydantic / Jackson mapping
    * Spring AI `entity()`
    * tool / function calling as structured output
    * validation and retry
    * a plain-prose note that parse-the-text approaches are the older way
  - [x] Task 13.2. Examples, all extracting DocsAssistant page metadata `{title, component, topics[]}`:
    * Anthropic structured outputs or a tool-use schema
    * OpenAI `response_format` with a JSON schema
    * the Ollama `format` schema
    * a Pydantic validate-and-retry loop
    * a Spring AI `chatClient.prompt(...).call().entity(PageMetadata.class)` with a Java record
    * a tool-call round trip for `search_docs`
  - [x] Task 13.3. 📊 Mermaid sequence of the tool-call round trip. Add References: Anthropic structured outputs
    and tool use, OpenAI structured outputs, Ollama structured outputs, the llama.cpp grammars README, and Spring
    AI structured output.
- [x] Task 14. Create `context-engineering.adoc` ("Context Engineering")
  - [x] Task 14.1. Cover:
    * context engineering vs. prompt engineering
    * a context budget table
    * just-in-time retrieval
    * compaction and summarisation
    * structured note-taking
    * sub-agent isolation
    * progressive disclosure (skills)
    * ordering and primacy / recency effects
  - [x] Task 14.2. Link `database/vector-rag/prompt-augmentation-and-generation.adoc` and
    `xref:ai-catalog::guides/authoring-effective-instructions.adoc[]`. Re-verified at implementation time via
    `gh api repos/albertoirurueta/ai-catalog/contents/docs/modules/ROOT/pages/guides/authoring-effective-instructions.adoc`
    — the page exists on `ai-catalog` `main`; xref used. Names the planned *Customizing AI Workflows* sub-section in
    prose only (no xref).
  - [x] Task 14.3. Examples:
    * a Python context-assembly function with a token budget per slot (system / tools / docs / history)
    * a summarise-when-over-budget compaction step
  - [x] Task 14.4. Add References: Anthropic, *Effective context engineering for AI agents*
    (https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents); Liu et al.,
    *Lost in the Middle*; and Anthropic Agent Skills docs (verified current URL
    `https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview`, 2026-09-28).
- [x] Task 15. Create `managing-prompts.adoc` ("Managing Prompts")
  - [x] Task 15.1. Cover:
    * prompts as code: templates, versioning, a prompt library, prompt registries
    * testing prompts, from golden sets to regression tests, with a plain-prose pointer to the planned
      *LLMOps & Evaluation* sub-section
    * provider prompt improvers and generators
    * DSPy-style optimisation
    * prompt portability across models
  - [x] Task 15.2. Examples:
    * a Jinja2 / `string.Template` prompt file plus a pytest golden-set test
    * a minimal DSPy `Signature` + `Predict`
    * a Spring AI `PromptTemplate` loaded from a `.st` resource
  - [x] Task 15.3. Add References: DSPy docs (https://dspy.ai/), the Anthropic prompt-improver / prompt-generator
    docs, and Spring AI prompts.

### Group 4 — Content pages: choosing models

**Parallelizable: yes.** There are five independent pages (Tasks 16–20). `cost-latency-and-throughput.adoc` owns
the latency formula. `choosing-a-model.adoc` links it and doesn't restate it in depth.

- [x] Task 16. Create `model-landscape.adoc` ("The Model Landscape")
  - [x] Task 16.1. Cover:
    * proprietary families: Anthropic Claude, OpenAI GPT, Google Gemini
    * open-weight families: Llama, Qwen, Gemma, Mistral, DeepSeek, gpt-oss, Phi
    * tiers: frontier / fast / small / on-device
    * modalities
    * a **dated** table ("as of <date>") with columns family, vendor, open vs. closed, typical tiers, and an
      official models-page link. No hard-coded prices or scores.
    * a link to `cloud/azure/ai-data-and-iot-overview.adoc` for hosted catalogs
  - [x] Task 16.2. Example: listing available models programmatically with `client.models.list()` in the
    Anthropic and OpenAI SDKs, and `ollama list` / `GET /api/tags`.
  - [x] Task 16.3. Add References: each vendor's official models page, plus the Hugging Face Hub models page.
- [x] Task 17. Create `choosing-a-model.adoc` ("Choosing a Model")
  - [x] Task 17.1. Cover:
    * the selection workflow: requirements → shortlist → eval on your data → cost / latency check → decide
    * the build vs. buy / open vs. proprietary criteria table: privacy, lineage, control, cost, performance,
      on-device
    * routing and cascades: cheap model first, escalate
    * mixing models per task
  - [x] Task 17.2. Examples:
    * a tiny eval harness that runs the same 5 DocsAssistant questions against two models and scores exact-match
      JSON fields
    * a cascade router that tries a fast model and escalates on a low-confidence or invalid-JSON result
  - [x] Task 17.3. 📊 Mermaid decision flowchart. Add References: Anthropic "Choosing a model", OpenAI models, and
    Chen et al., FrugalGPT (https://arxiv.org/abs/2305.05176).
- [x] Task 18. Create `benchmarks-and-leaderboards.adoc` ("Benchmarks & Leaderboards"), with `:stem: latexmath`
  - [x] Task 18.1. Cover:
    * what MMLU-Pro, GPQA, SWE-bench, HumanEval+, IFEval, needle-in-a-haystack and MTEB measure
    * saturation and contamination
    * arena Elo / Bradley–Terry, stem:[P(i \succ j)=\sigma(s_i-s_j)]
    * how to read LMArena (https://arena.ai/leaderboard), Artificial Analysis and SWE-bench
    * that the HF Open LLM Leaderboard is **retired**, linked as an archive only
    * why your own evals matter, with a plain-prose pointer to the planned *LLMOps & Evaluation* sub-section
  - [x] Task 18.2. Example: a Python Bradley–Terry / Elo update from a handful of pairwise preferences.
  - [x] Task 18.3. Add References:
    * the benchmarks: MMLU-Pro (https://arxiv.org/abs/2406.01574), GPQA (https://arxiv.org/abs/2311.12022),
      SWE-bench (https://www.swebench.com/), EvalPlus / HumanEval+ (https://arxiv.org/abs/2305.01210), IFEval
      (https://arxiv.org/abs/2311.07911), MTEB (https://arxiv.org/abs/2210.07316)
    * the leaderboards: Chatbot Arena (https://arxiv.org/abs/2403.04132), Artificial Analysis
      (https://artificialanalysis.ai/leaderboards/models), and the Open LLM Leaderboard archive
      (https://huggingface.co/docs/leaderboards/en/open_llm_leaderboard/archive)
- [x] Task 19. Create `cost-latency-and-throughput.adoc` ("Cost, Latency & Throughput"), with `:stem: latexmath`
  - [x] Task 19.1. Cover:
    * TTFT, TPOT and throughput, with stem:[\text{latency}=\text{TTFT}+\text{TPOT}\times n_{out}]
    * token pricing and batch APIs
    * prompt caching economics (link Task 7's page)
    * choosing a smaller model or a lower effort level
  - [x] Task 19.2. Examples:
    * a Python cost calculator (tokens × dated example prices, with a "replace with current prices" note)
    * measuring TTFT and TPOT from a streaming Anthropic or OpenAI response
    * the same measurement against Ollama
  - [x] Task 19.3. Add References: the Anthropic pricing, batch, streaming and prompt-caching docs, and the OpenAI
    pricing, batch and streaming docs.
- [x] Task 20. Create `ai-application-architecture.adoc` ("AI Application Architecture")
  - [x] Task 20.1. Cover the step-by-step reference architecture: context enhancement → guardrails →
    router / gateway → caching → agent patterns → monitoring → feedback loop. Each block links the existing page
    that details it, or names the planned AI sub-section in prose:
    * RAG → `database/vector-rag/rag-fundamentals.adoc`
    * semantic cache → `database/vector-rag/agent-memory-and-semantic-cache.adoc`
    * agents, gateways, guardrails and monitoring → *AI Agents*, *Running LLMs Locally*, *AI Security* and
      *LLMOps* in prose
  - [x] Task 20.2. Example: a compact Python request pipeline showing the blocks as functions: input guardrail →
    retrieve → cache check → model call → output validation → log feedback.
  - [x] Task 20.3. 📊 Add `ai-llm-foundations-reference-architecture.svg`. Add References: Anthropic *Building
    effective agents* (https://www.anthropic.com/engineering/building-effective-agents) and the OpenTelemetry GenAI
    semantic conventions (https://opentelemetry.io/docs/specs/semconv/gen-ai/).

### Group 5 — Landing pages, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task creates or edits a **distinct** file. All of them only reference pages that
exist after Groups 1–4.

- [x] Task 21. Create `modules/ROOT/pages/ai/llm-foundations/index.adoc` ("LLM Foundations & Prompting")
  - [x] Task 21.1. Header with `include::partial$ai-llm-foundations-disclaimer.adoc[]`. The lead paragraph gives
    the re-verified version baseline (choice 8) and a one-paragraph *DocsAssistant* summary that links
    `database/vector-rag/index.adoc` for the shared scenario table.
  - [x] Task 21.2. Add a reading-order paragraph and `== What's covered`, grouped exactly as Groups 2–4 (*How LLMs
    work*, *Prompt and context engineering*, *Choosing models*) plus *Cheat sheet*. Each bullet is an `xref:` with
    a one-line summary. 📊 Add a Mermaid mind map of the sub-section.
  - [x] Task 21.3. Add `== Bibliography`, grouped as in the issue's "Bibliography" section. Include every URL
    listed there, plus every paper and doc cited in the pages' References.
    * **Requester-provided books**, each with ISBN, publisher page and code repository:
      * Huyen, *AI Engineering: Building Applications with Foundation Models*, O'Reilly, 1st ed. Dec 2024
        (© 2025), ISBN 978-1-098-16630-4, https://www.oreilly.com/library/view/ai-engineering/9781098166298/ ,
        code https://github.com/chiphuyen/aie-book (resources, not runnable code).
      * Alammar & Grootendorst, *Hands-On Large Language Models: Language Understanding and Generation*, O'Reilly,
        1st ed. Sep 2024, ISBN 978-1-098-15096-9,
        https://www.oreilly.com/library/view/hands-on-large-language/9781098150952/ , code
        https://github.com/HandsOnLLM/Hands-On-Large-Language-Models .
      * Taulli, *AI-Assisted Programming: Better Planning, Coding, Testing, and Deployment*, O'Reilly, 1st ed.
        Apr 2024, ISBN 978-1-098-16456-0,
        https://www.oreilly.com/library/view/ai-assisted-programming/9781098164553/ , code
        https://github.com/ttaulli/AI-Assisted-Programming-Book .
      * Osmani, *Beyond Vibe Coding: From Coder to AI-Era Developer*, O'Reilly, 1st ed. Aug 2025, ISBN
        979-8-341-63475-6, https://www.oreilly.com/library/view/beyond-vibe-coding/9798341634749/ ; no code repo,
        companion web edition https://beyond.addy.ie/ .
    * Note in prose that oreilly.com answers automated fetches with HTTP 403 but the pages are live.
    * **Official documentation:** Anthropic, OpenAI, GitHub Copilot, Gemini, HF, tiktoken, Ollama, Spring AI,
      DSPy.
    * **Leaderboards:** arena.ai, Artificial Analysis, SWE-bench, and the retired Open LLM Leaderboard archive.
    * **Engineering articles:** the Anthropic context-engineering and *Building effective agents* articles.
    * **Papers:** the full list in the issue.
    * Close with the house sentence: the books are consulted references, not the primary source of any example.
      On any discrepancy, the official documentation is authoritative, and every example is verified against the
      versions above.
    * Write each book entry as a single unwrapped line (the line-leading `2024.` gotcha), and check it with
      `grep -n "^20[0-9][0-9]\." …`.
  - **Done:** `modules/ROOT/pages/ai/llm-foundations/index.adoc` created (mindmap Mermaid diagram validated via
    `npm run validate:mermaid`; Bibliography grouped exactly as required, union of every `== References` entry
    across the 19 pages plus the 4 requester books; no line-leading-digit gotcha).
- [x] Task 22. Create `modules/ROOT/pages/ai/index.adoc` ("AI") and `modules/ROOT/images/ai.svg`
  - [x] Task 22.1. Header with `include::partial$ai-disclaimer.adoc[]`. Add a lead that says what the section is
    and who it is for, as described in the issue's `### ai/index.adoc` block. Add the **version-baseline policy**
    paragraph: each sub-section states and dates its own baseline.
  - [x] Task 22.2. 📊 Add a Mermaid reading-path flowchart with plain nodes, no links:
    * basics: Foundations → AI-Assisted Development
    * customizing: Workflows → Agents → MCP → CLIs
    * building: LangChain / Spring AI → RAG Systems
    * deploying: Local LLMs / Hugging Face → Channels → Voice
    * operating: LLMOps → Security
  - [x] Task 22.3. Add `== Sub-sections`, with the 15 sub-sections in the fixed order from the issue's
    "Section-wide conventions".
    * Only bullet 1, `xref:ai/llm-foundations/index.adoc[LLM Foundations & Prompting]`, is an `xref:`.
    * Bullets 2–15 are plain text with a one-line scope and "(planned)". Each sibling issue replaces its own bullet
      with an `xref:` when it lands.
  - [x] Task 22.4. Add `== Books used in this section`. List all 15 requester-provided books, one line each, with
    the publisher page link:
    * the four listed in Task 21.3
    * Lanham, *AI Agents in Action* (Manning 2025, ISBN 978-1-63343-634-3,
      https://www.manning.com/books/ai-agents-in-action)
    * Albada, *Building Applications with AI Agents* (O'Reilly 2025, ISBN 978-1-098-17650-1,
      https://www.oreilly.com/library/view/building-applications-with/9781098176495/)
    * Anthapu & Agarwal, *Building Neo4j-Powered Applications with LLMs* (Packt 2025, ISBN 978-1-83620-623-1,
      https://www.packtpub.com/en-us/product/building-neo4j-powered-applications-with-llms-9781836206231)
    * Mendelevitch & Bao, *Hands-On RAG for Production* (O'Reilly 2026, ISBN 979-8-341-62171-8,
      https://www.oreilly.com/library/view/hands-on-rag-for/9798341621701/)
    * Lee, *Hugging Face in Action* (Manning 2026, ISBN 978-1-63343-671-8,
      https://www.manning.com/books/hugging-face-in-action)
    * Aryan, *LLMOps: Managing Large Language Models in Production* (O'Reilly 2025, ISBN 978-1-098-15420-2,
      https://www.oreilly.com/library/view/llmops/9781098154196/)
    * Oshin & Campos, *Learning LangChain* (O'Reilly 2025, ISBN 978-1-098-16728-8,
      https://www.oreilly.com/library/view/learning-langchain/9781098167271/)
    * Parasuraman, *Mastering Spring AI* (Apress 2024, ISBN 979-8-8688-1000-8,
      https://link.springer.com/book/10.1007/979-8-8688-1001-5)
    * Polzer, *RAG with Python Cookbook* (O'Reilly 2026, ISBN 979-8-341-60056-0,
      https://www.oreilly.com/library/view/rag-with-python/9798341600553/)
    * Walls, *Spring AI in Action* (Manning 2026, ISBN 978-1-63343-611-4,
      https://www.manning.com/books/spring-ai-in-action)
    * Wilson, *The Developer's Playbook for Large Language Model Security* (O'Reilly 2024, ISBN 978-1-098-16220-7,
      https://www.oreilly.com/library/view/the-developers-playbook/9781098162191/)

    The four books used here also link `xref:ai/llm-foundations/index.adoc#_bibliography[bibliography]`. The other
    eleven say in prose which planned sub-section will cite them. Close with the house sentence about consulted
    references.
  - [x] Task 22.5. Add `== Where AI material lives elsewhere on this site`, a table of `xref:`s to:
    * `database/vector-rag/index.adoc`
    * `database/neo4j/vector-search-and-genai.adoc`
    * `database/qdrant/rag-integration-patterns.adoc`
    * `database/redis/spring-boot-redis-as-a-vector-database.adoc`
    * `apps/apple/apple-intelligence-and-machine-learning.adoc`
    * `cloud/azure/ai-data-and-iot-overview.adoc`
    * `xref:ai-catalog::index.adoc[AI Catalog]`
  - [x] Task 22.6. Create `modules/ROOT/images/ai.svg`, a 600×600 picker card in the exact style of
    `images/cloud.svg`:
    * a rounded `clipPath`, a two-stop `linearGradient`, and a white icon (a simple neural-network or chip glyph)
    * title "AI" at 52px, weight 800
    * a divider and the subtitle "LLMs, agents, RAG & MCP" at 25px
    * a gradient and icon **distinct** from `images/ai-catalog.svg`
  - **Done:** `modules/ROOT/pages/ai/index.adoc` and `modules/ROOT/images/ai.svg` created (purple-to-sky-blue
    gradient with a neural-net node/edge glyph, visually distinct from `ai-catalog.svg`'s pink/magenta +
    rounded-square glyph). Flowchart Mermaid diagram validated. Antora build clean (all xrefs resolve, including
    the 6 "elsewhere on this site" targets).
- [x] Task 23. Create `ai/llm-foundations/cheat-sheet.adoc` and
  `modules/ROOT/attachments/ai-llm-foundations-cheat-sheet.pdf`
  - [x] Task 23.1. The page has `= LLM Foundations & Prompting Cheat Sheet`, the disclaimer, and a one-paragraph
    intro listing what the sheet covers. It has grouped back-link paragraphs to all 19 pages, in the same groups as
    Task 21.2, and ends with
    `xref:attachment$ai-llm-foundations-cheat-sheet.pdf[Download the LLM Foundations & Prompting Cheat Sheet (PDF)]`.
    Mirror `database/vector-rag/cheat-sheet.adoc`.
  - [x] Task 23.2. Author a print-ready **single A4 page** HTML/CSS layout **in the session scratchpad, never in
    the repo**. It has dense multi-column colour-coded boxes, a header line with the version baseline and date,
    and a breadcrumb footer "Irurueta Docs › Guides & References › AI › LLM Foundations & Prompting". Render
    `attachments/vector-rag-cheat-sheet.pdf` to PNG for visual reference. It has one box per item in the issue's
    cheat-sheet list:
    * tokens and costs
    * the attention formula
    * a sampling table per task
    * context-window rules
    * the prompt anatomy template
    * the technique catalogue
    * structured-output snippets (Anthropic / OpenAI / Ollama / Spring AI)
    * the context-engineering checklist
    * the model-selection flowchart
    * benchmark notes
    * the latency / cost formulas
    * the reference architecture
  - [x] Task 23.3. Render it with `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless
    --print-to-pdf=<out> --no-pdf-header-footer <file.html>`.
    * Verify with PyMuPDF (`fitz`) that `page_count == 1` and the page is A4 (about 595×842 pt).
    * Render a PNG preview and check it for clipped or overflowing boxes. Iterate until it fits.
    * Copy **only** the PDF to `modules/ROOT/attachments/`, and confirm with `git status --porcelain` that no
      `.html` landed in the repo.
  - **Done:** HTML/CSS authored only in the scratchpad, rendered with headless Chrome, verified with PyMuPDF
    (`page_count == 1`, page rect 594.96×841.92 pt ≈ A4), PNG preview inspected twice (no clipping/overflow after
    a density pass), only `modules/ROOT/attachments/ai-llm-foundations-cheat-sheet.pdf` (273,932 bytes) copied
    into the repo; `git status --porcelain` shows no `.html`.
- [x] Task 24. Edit `modules/ROOT/nav.adoc`
  - [x] Task 24.1. After the line `**** xref:cloud/azure/cheat-sheet.adoc[Cheat Sheet (PDF)]` and before
    `** xref:git-and-github/index.adoc[Git & GitHub]`, insert this block:
    ```
    ** xref:ai/index.adoc[AI]
    *** xref:ai/llm-foundations/index.adoc[LLM Foundations & Prompting]
    **** xref:ai/llm-foundations/what-is-an-llm.adoc[What Is an LLM?]
    **** xref:ai/llm-foundations/tokens-and-tokenization.adoc[Tokens & Tokenization]
    **** xref:ai/llm-foundations/transformer-architecture.adoc[Transformer Architecture]
    **** xref:ai/llm-foundations/training-pipeline.adoc[How LLMs Are Trained]
    **** xref:ai/llm-foundations/sampling-and-decoding.adoc[Sampling & Decoding]
    **** xref:ai/llm-foundations/context-windows-and-memory.adoc[Context Windows & Memory]
    **** xref:ai/llm-foundations/reasoning-models.adoc[Reasoning Models]
    **** xref:ai/llm-foundations/multimodal-models.adoc[Multimodal Models]
    **** xref:ai/llm-foundations/hallucinations-and-limitations.adoc[Hallucinations & Limitations]
    **** xref:ai/llm-foundations/prompt-engineering-fundamentals.adoc[Prompt Engineering Fundamentals]
    **** xref:ai/llm-foundations/prompting-techniques.adoc[Prompting Techniques]
    **** xref:ai/llm-foundations/structured-output-and-tool-calling.adoc[Structured Output & Tool Calling]
    **** xref:ai/llm-foundations/context-engineering.adoc[Context Engineering]
    **** xref:ai/llm-foundations/managing-prompts.adoc[Managing Prompts]
    **** xref:ai/llm-foundations/model-landscape.adoc[The Model Landscape]
    **** xref:ai/llm-foundations/choosing-a-model.adoc[Choosing a Model]
    **** xref:ai/llm-foundations/benchmarks-and-leaderboards.adoc[Benchmarks & Leaderboards]
    **** xref:ai/llm-foundations/cost-latency-and-throughput.adoc[Cost, Latency & Throughput]
    **** xref:ai/llm-foundations/ai-application-architecture.adoc[AI Application Architecture]
    **** xref:ai/llm-foundations/cheat-sheet.adoc[Cheat Sheet (PDF)]
    ```
    Leave the unrelated `** AI` label under "Open Source Projects" (line 3) untouched.
  - **Done:** block inserted after `cloud/azure/cheat-sheet.adoc` and before `git-and-github/index.adoc`; the
    `** AI` label under "Open Source Projects" left untouched (verified unchanged).
- [x] Task 25. Edit `modules/ROOT/pages/index.adoc` (the root landing page)
  - [x] Task 25.1. In the `== Guides & References` picker table, replace the **first** of the two empty trailing
    `a|` cells with an `a|` cell containing `image::ai.svg[xref="ai/index.adoc"]`. The cell goes after
    `git-and-github.svg`, and the other empty `a|` cell is kept.
  - [x] Task 25.2. `:description:`: change "…, cloud, and Git and GitHub references." to "…, cloud, AI, and Git
    and GitHub references.".
  - [x] Task 25.3. Append these keywords to `:keywords:`, skipping any already present, such as `RAG`: `AI, LLM,
    large language models, tokens, tokenization, transformer, attention, sampling, temperature, context window,
    prompt caching, reasoning models, multimodal models, hallucinations, prompt engineering, context engineering,
    structured output, tool calling, model selection, benchmarks, LLM leaderboards`.
  - **Done:** picker cell inserted (first empty `a|` after `git-and-github.svg`, second left empty),
    `:description:` and `:keywords:` updated; none of the 21 appended keywords were already present.
- [x] Task 26. Add cross-link sentences to existing pages. Each file is distinct; add one sentence each, with no
  other edits.
  - [x] Task 26.1. `database/vector-rag/embeddings.adoc`: near the top, where embeddings are introduced, add one
    sentence linking `xref:ai/llm-foundations/tokens-and-tokenization.adoc[Tokens & Tokenization]`, for how text
    becomes token IDs before it is embedded.
  - [x] Task 26.2. `database/vector-rag/prompt-augmentation-and-generation.adoc`: add one sentence linking
    `xref:ai/llm-foundations/context-engineering.adoc[Context Engineering]` and
    `xref:ai/llm-foundations/context-windows-and-memory.adoc[Context Windows & Memory]`.
  - [x] Task 26.3. `apps/apple/apple-intelligence-and-machine-learning.adoc`: in or next to the guided-generation
    or tool-calling discussion, preferably the `@Generable` subsection, add one sentence linking
    `xref:ai/llm-foundations/structured-output-and-tool-calling.adoc[Structured Output & Tool Calling]` for the
    cross-provider view.
  - **Done:** one sentence added to each of the 3 distinct files, no other edits made; Antora build clean.

### Group 6 — Build and verify

**Parallelizable: yes** (a single task; it must run after every prior group).

- [x] Task 27. Build and verify — clean build (exit 0, 0 errors, 0 warnings), Mermaid validation clean (544
  diagrams, 8 under `ai/`, 0 failures), all reachability/grep checks pass, scoped secret scan clean (0 findings),
  model/price consistency fixed, sampling-and-decoding.adoc xrefs restored.
  - [x] Task 27.1. Ran `npx antora antora-playbook.yml` against a clean `build/` through an `iru-gate-runner`
    sub-agent (twice: once before, once after the 27.5(a)/(b) fixes below). Both runs: exit 0, 0 errors,
    0 warnings — no unresolved `xref`, no missing-attribute warnings, no list-index warnings anywhere,
    including under `ai/`.
  - [x] Task 27.2. Ran `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` through an `iru-gate-runner`
    sub-agent. Result: exit 0, all 544 Mermaid diagrams under `modules/ROOT/pages` parsed successfully, 8 of them
    under `ai/`, 0 failures. `node_modules/.package-lock.json` restored via `git checkout --` after each run.
  - [x] Task 27.3. Reachability — all pass:
    * all 19 content pages plus `cheat-sheet.adoc` (20 total) appear as `xref:` in both
      `ai/llm-foundations/index.adoc` and `nav.adoc`
    * `ai/index.adoc` is in `nav.adoc` (`** xref:ai/index.adoc[AI]`) and in the root picker
      (`image::ai.svg[xref="ai/index.adoc"]` in `modules/ROOT/pages/index.adoc`)
    * `build/site/ai/llm-foundations/` has 21 HTML files
    * `build/site/ai/index.html` exists
    * every `ai-llm-foundations-*.svg` and `ai.svg` is present in `build/site/_images/`
    * the PDF (`ai-llm-foundations-cheat-sheet.pdf`) is in `build/site/_attachments/`, is 1 page, and is A4
      (594.96 x 841.92 pt), verified with PyMuPDF
  - [x] Task 27.4. Grep checks — all pass:
    * `include::partial$ai-llm-foundations-disclaimer.adoc[]` present in all 21 files under `ai/llm-foundations/`;
      `include::partial$ai-disclaimer.adoc[]` present in `ai/index.adoc`
    * no `[NOTE]`/`[TIP]`/`[WARNING]`/`[CAUTION]`/`[IMPORTANT]` blocks or `NOTE:`/`TIP:`/… paragraphs under
      `modules/ROOT/pages/ai/`
    * book authors' surnames (Huyen, Alammar, Grootendorst, Taulli, Osmani) appear only in
      `ai/llm-foundations/index.adoc` and `ai/index.adoc`
    * every content page (the 19, excluding `index.adoc` and `cheat-sheet.adoc` which are index/link pages by
      design) has `== References` and at least one `[source` code block
    * no `xref:ai/` to a nonexistent page, none to a sibling sub-section folder
    * both `xref:ai-catalog::` targets (`index.adoc`, `guides/authoring-effective-instructions.adoc`) resolve —
      confirmed indirectly by the 0-warning build (an unresolved xref would have emitted an Antora warning)
    * no line-leading `20NN.` prose lines
  - [x] Task 27.5. Spot-check + fixes:
    * Cross-link sentences (Task 26) in `apple-intelligence-and-machine-learning.adoc`,
      `embeddings.adoc`, `prompt-augmentation-and-generation.adoc` all read naturally in context.
    * Every model/price table (in `cost-latency-and-throughput.adoc`, `context-windows-and-memory.adoc`,
      `model-landscape.adoc`, `choosing-a-model.adoc`) states an "as of 2026-09-28" date and links an official
      Anthropic/OpenAI/Ollama source.
    * (a) Restored the 3 xrefs in `sampling-and-decoding.adoc` (to `prompting-techniques.adoc`,
      `prompt-engineering-fundamentals.adoc`, `managing-prompts.adoc`) that an earlier pass had degraded to plain
      prose — those target pages exist now. Verified they resolve with no build warning.
    * (b) Fixed a model/price inconsistency: `cost-latency-and-throughput.adoc` and
      `context-windows-and-memory.adoc` referenced OpenAI's `gpt-5.1`/`gpt-5.1-mini` while `model-landscape.adoc`
      and `choosing-a-model.adoc` already described the current GPT-6 family (`gpt-6-astra`/`gpt-6-sol`/
      `gpt-6-luna`) as of 2026-09-28. Verified current OpenAI pricing via WebFetch (`gpt-6-sol`: $2/$10 per MTok,
      matching `claude-sonnet-5`'s $2/$10; `gpt-6-luna`: $0.10/$0.50, the smaller-tier equivalent) and OpenAI's
      prompt-caching guide (cached input = 0.1x base rate, unchanged mechanism since GPT-5.6, min eligible length
      still 1,024 tokens). Updated both pages' prose, tables and Python examples to `gpt-6-sol`/`gpt-6-luna` with
      correct prices. `claude-sonnet-5` prices ($2/$10 input/output, $2.50 5-min cache write, $0.20 cache read)
      were already correct and consistent across both pages — verified against Anthropic's pricing page, no
      change needed. Checked `cheat-sheet.adoc` and its PDF (via PyMuPDF text extraction): neither mentions
      `gpt-5.1`; both already say "gpt-6" / "claude-sonnet-5" — no re-render needed.
    * (c) Ran a scoped `detect-secrets scan` over the new/changed `ai/` content, the two touched
      `database/vector-rag/*.adoc` pages, `apple-intelligence-and-machine-learning.adoc`, `nav.adoc` and
      `index.adoc`: **0 findings** (`"results": {}`). Nothing to rewrite. `.secrets.baseline` untouched.

### Group 7 — Integration-branch verification (required by #202 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (a single task whose sub-tasks run in order; it must run after Group 6).

- [x] Task 28. Verify against the integration branch and compute merge readiness
  - [x] Task 28.1. Commit the work on `feature/202`. Run `git fetch origin`, then merge the latest
    `origin/feature/213-ai-section` into `feature/202` and resolve any conflicts.
    * **Expected conflict points,** if a sibling landed first: the `** xref:ai/index.adoc[AI]` block in
      `modules/ROOT/nav.adoc`, `ai/index.adoc` → `== Sub-sections`, and the `:keywords:` of the root and AI index
      pages.
    * **How to resolve:** keep every sibling's entries, in the fixed sub-section order.
    * If `origin/feature/213-ai-section` has no new commits (expected, since #202 is wave 1), record "already up to
      date".
    * **Done:** committed 37 files (`git commit` `03221649`, "Add \"AI\" section and \"LLM Foundations & Prompting\"
      sub-section under Guides & References (#202)"). `git fetch origin` then `git merge origin/feature/213-ai-section`
      → "Already up to date." (`origin/feature/213-ai-section` tip `b7832f86` is already an ancestor of
      `feature/202`); no conflicts to resolve.
  - [x] Task 28.2. Re-run the Antora build and `npm run validate:mermaid` **on the merged result**, through
    `iru-gate-runner` as in Tasks 27.1–27.2. Both must be clean.
    * **Done:** via `iru-gate-runner` — Antora build (`npx antora antora-playbook.yml`) clean, exit 0, no
      xref/AsciiDoc errors. Mermaid validation clean: "All 544 Mermaid diagrams parsed successfully."
      `node_modules/.package-lock.json` (touched by `npm i --no-save mermaid@11 jsdom`) restored via
      `git checkout --`.
  - [x] Task 28.3. Compute merge readiness. #202 has **no prerequisites**, so check nothing beyond confirming that
    `origin/feature/213-ai-section` still exists:
    `git fetch origin && git ls-remote --heads origin feature/213-ai-section`.
    * **Done:** `git ls-remote --heads origin feature/213-ai-section` → single head, tip `b7832f86` (already an
      ancestor of `feature/202`). Branch still exists; no pending remote work.
  - [x] Task 28.4. Write the *Merge readiness* block that `iru-issue` Step 8 appends to the PR body and repeats in
    its final report. Save it in the session scratchpad, not the repo, filled in from Tasks 28.1–28.3:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: none (wave 1)
    - Antora build + Mermaid validation on the merged result: ✅ passed
    - Status: ✅ READY: can be merged into feature/213-ai-section after human review
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first" instead. Also note the post-merge chores: tick
    #202 in #213's *Progress* checklist and delete `feature/202`.
    * **Done:** written to
      `/private/tmp/claude-501/-Users-airurueta-irurueta2-common-docs/1d43d066-cf88-41fb-98aa-96976f0d29f6/scratchpad/merge-readiness-202.md`
      (build/Mermaid both ✅, status ✅ READY, post-merge chores noted) — not committed to the repo.
