# Implementation plan: ML (Machine Learning) section with PyTorch, TensorFlow and scikit-learn sub-sections (issue #245)

## Task summary

Add a top-level **ML (Machine Learning)** section as the last entry under Guides & References (`modules/ROOT/pages/ml/`):
35 general machine learning and deep learning pages (including the landing page and the cheat sheet), a **PyTorch 2.15**
sub-section (51 pages), a **TensorFlow 2.21 + Keras 3.15** sub-section (48 pages) and a **scikit-learn 1.9** sub-section
(20 new pages that reuse issue #244's 44 scikit-learn pages by link), each count including its landing page, four
landing pages carrying the bibliographies, a cheat-sheet page and three new one-page A4 PDFs (the scikit-learn PDF is
reused from issue #244). The per-page outline, official sources per page, version baseline, findings that pages must
state, books comparison, figure candidates and bibliography are in issue #245 (body, first comment = page outline, second
comment = bibliography) and are authoritative; every page task below refers to them instead of repeating them. Only the
four AI-assistance disclaimer partials are admonitions.

Choices made: all tasks are documentation-only and untagged (implemented directly; no language key applies, though the
pages contain Python examples). Pages are new files, so page groups are parallelizable and clustered in tasks of 3-4
pages. Landing pages (bibliographies), the cheat sheet, nav, home tile and cross-links come after all pages exist,
followed by one build-and-checks group. The scope (about 154 pages) is far larger than most earlier sections, so the work
can be split across PRs on these boundaries if preferred: (1) groups 1 and 2, (2) group 3, (3) group 4, (4) group 5,
(5) groups 6-9. The issue 244 dependency is already satisfied (merged in PRs 361 and 362), so every `data-science/...`
xref resolves; the scikit-learn pages on disk are 44, not the "~45" the issue states. The nav insertion point is after
the **Data Science** block, which is now last. Facts must be re-verified against official docs at implementation time
(baseline date 2026-10-30). The requester's books in `~/Desktop/libros/ml` are never committed, copied or quoted.

Source: GitHub issue #245
Base branch: main
Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "Issue 244 (or at least the parts listed under 'Dependency on issue 244') is implemented first, so every `data-science/...` xref resolves." | already satisfied (PRs 361, 362); Task 62, Task 63 |
| 2 | "`ml/` exists with the general pages, the `pytorch/`, `tensorflow/` and `scikit-learn/` sub-sections and `cheat-sheet.adoc`, matching the outline in the first comment" | Task 4-14, Task 15-30, Task 31-45, Task 46-51, Task 52-55, Task 59 |
| 3 | "The nav has the ML (Machine Learning) section under Guides & References with every page, and the root `index.adoc` has the `ml.svg` tile and the new keywords/description" | Task 3, Task 60, Task 61 |
| 4 | "Every page has detailed explanations and complete, runnable code examples; every example is followed by a link to the official documentation page it derives from; examples were run on the targeted versions" | Task 4-51 (all page tasks) |
| 5 | "The scikit-learn sub-section links issue 244's scikit-learn pages instead of duplicating them, and uses the name scikit-learn throughout" | Task 55, Task 46-51, Task 62 |
| 6 | "Every finding in 'Findings from the exploration' is re-verified and stated on the page it concerns; outdated book content is called out in each part's migration or legacy page" | Task 4-14, Task 30, Task 45, Task 66 |
| 7 | "Mermaid diagrams and SVG figures are added where they help. Every SVG in `modules/ROOT/images/ml-*` is referenced; `npm run validate:mermaid` reports every diagram as parsed" | Task 2, Task 4-51, Task 64, Task 65 |
| 8 | "Each part's `index.adoc` has a Bibliography listing every source used, linked to its official website (books to the publisher's page)" | Task 52, Task 53, Task 54, Task 55 |
| 9 | "The only admonitions are the four AI-assistance disclaimer partials, included on every page of their part" | Task 1, Task 65 |
| 10 | "`cheat-sheet.adoc` links three new one-page PDFs in `modules/ROOT/attachments/`, each exactly one page, plus the reused `data-science-scikit-learn-cheat-sheet.pdf`" | Task 56, Task 57, Task 58, Task 59, Task 66 |
| 11 | "Cross-links to the existing AI, FastAPI, database, Python and cloud pages are in place, with no duplicated content" | Task 62 |
| 12 | "`npx antora antora-playbook.yml` builds with no `xref`/AsciiDoc errors, and every CLAUDE.md verification grep prints nothing" | Task 63, Task 64 |
| 13 | "No book PDF or text extracted from it is committed" | Task 66 |

## Current code state

- Repository is the Antora playbook and `ROOT` component (`antora.yml`, `antora-playbook.yml`); docs root is the
  repository root; project type `other`, host GitHub (`albertoirurueta/docs`), no UI code. No `ml/` pages, `ml-*`
  images, `ml-*` partials or `ml-*` attachments exist yet.
- Issue #244 is merged: `modules/ROOT/pages/data-science/` holds 19 general pages, `numpy/`, `pandas/` and
  `scikit-learn/` (44 pages incl. `index.adoc`), plus `data-science-*` images and the four `data-science-*-cheat-sheet.pdf`
  attachments. It is the closest precedent: `.archive/implementation_plan_244.md` (also `_250.md`, `_289.md`, `_355.md`).
- `modules/ROOT/nav.adoc`: the Data Science block starts at line 3420 (`** xref:data-science/index.adoc[Data Science]`)
  and runs to the end of the file; the ML block goes after it.
- `modules/ROOT/pages/index.adoc`: the tile table ends with the `data-science.svg` tile followed by two empty `a|`
  cells; `:description:` and `:keywords:` to extend. Images in `modules/ROOT/images/` (bare filenames), PDFs in
  `modules/ROOT/attachments/`, partials in `modules/ROOT/partials/` (`data-science-disclaimer.adoc` is the model).
- Existing pages to link, not duplicate: `data-science/*` (general, `numpy/`, `pandas/`, `scikit-learn/`),
  `ai/llm-foundations/*`, `ai/hugging-face/*`, `ai/llmops/*`, `ai/local-llms/*`, `ai/security/*`,
  `database/vector-rag/embeddings.adoc`, `backend/fastapi/serving-data-science-and-ai.adoc` and the Python pages under
  `programming-languages/python/`. Verify each target exists before linking.
- Tooling: Antora 3.1.15 with the Mermaid and MathJax extensions; `npm run validate:mermaid` after
  `npm i --no-save mermaid@11 jsdom`; no lint or tests, and no license, coverage or quality gates. CLAUDE.md rules apply to
  image macros, inline-code passthroughs and Mermaid stereotypes. PDFs are rendered from throwaway HTML with headless
  Chrome (not committed), as in the Data Science and Figma cheat sheets.
- Version baseline (2026-10-30, re-verify): Python 3.13, PyTorch 2.15.0, TensorFlow 2.21.0 (2.22 upcoming), Keras 3.15.1,
  scikit-learn 1.9.1, JAX 0.12.0.1, ONNX 1.23.2, ONNX Runtime 1.31.1.

## Implementation steps

### Group 1: Scaffolding: disclaimers and home-page icon

Parallelizable: yes

- [x] Task 1. Create the four disclaimer partials in `modules/ROOT/partials/`: `ml-disclaimer.adoc`, `ml-pytorch-disclaimer.adoc`, `ml-tensorflow-disclaimer.adoc`, `ml-scikit-learn-disclaimer.adoc`. Each is a single `[IMPORTANT]` block saying the content was generated with AI assistance and linking its part's `index.adoc#_bibliography` (`ml/index.adoc`, `ml/pytorch/index.adoc`, `ml/tensorflow/index.adoc`, `ml/scikit-learn/index.adoc`), modelled on `data-science-disclaimer.adoc` and `data-science-scikit-learn-disclaimer.adoc`.
- [x] Task 2. Fix the shared SVG figure style (palette, fonts, callout markers, light/dark-safe colours, original drawings only, credited when a figure redraws an official one) in a scratch note used by every figure task. Image files are flat in `modules/ROOT/images/` with the prefixes `ml-`, `ml-pytorch-`, `ml-tensorflow-`, `ml-scikit-learn-`; no trademarked logos.
- [x] Task 3. Create the original `modules/ROOT/images/ml.svg` home-page tile in the style of `data-science.svg` and `ui-ux.svg` (no trademarked logos).

### Group 2: General machine learning and deep learning pages

Parallelizable: yes

Page task contract (applies to every page task in Groups 2-5, referred to below as "the page contract"): start with `= Title`, `:description:`, `:keywords:`, then the part's disclaimer include (`ml-disclaimer.adoc`, `ml-pytorch-disclaimer.adoc`, `ml-tensorflow-disclaimer.adoc` or `ml-scikit-learn-disclaimer.adoc`); an intro stating the targeted versions (Python 3.13, PyTorch 2.15, TensorFlow 2.21 with Keras 3.15, scikit-learn 1.9) and the check date; a detailed concept explanation covering every relevant option and pitfall; complete, runnable code examples (`[source,python]`, `bash`) each followed by a `Source:` link to the official page it derives from; statements from older books or tutorials that are outdated shown as prose or dated tables, never reproduced; unreleased items labelled "upcoming"; figures and Mermaid diagrams from the issue's candidate list where they help (SVG named with the part prefix, quoted alt text when it contains a comma, `.Title` caption, one line at column 0); inline code containing `->`, `=>`, `*`, `**`, `{`, `__`, `'` or `...` as a `+...+` passthrough (`pass:c[...]` if it contains `+`); Mermaid stereotypes as `&lt;&lt;x&gt;&gt;`; no `NOTE`/`TIP`/`WARNING`/`CAUTION` admonitions; cross-links to the existing AI, FastAPI, database and Python pages and to the pages from issue #244 (`data-science/...`) with each target verified to exist; end with `== References` listing official sources. The 14 reference books are used for structure and theory only and are never copied. Re-verify every version and every finding stated in the issue ("Findings from the exploration") against the official docs before writing it. Run the CLAUDE.md greps on each page as it is written.

- [x] Task 4. Write 3 pages in `modules/ROOT/pages/ml/`: `what-is-machine-learning.adoc`, `types-of-learning.adoc`, `problem-framing-and-ml-projects.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 4.1. `what-is-machine-learning.adoc` — What Is Machine Learning? AI vs ML vs DL
  - [x] Task 4.2. `types-of-learning.adoc` — Types of Learning
  - [x] Task 4.3. `problem-framing-and-ml-projects.adoc` — Problem Framing & the ML Project Lifecycle
- [x] Task 5. Write 3 pages in `modules/ROOT/pages/ml/`: `math-for-machine-learning.adoc`, `information-theory-and-losses.adoc`, `gradient-descent-and-optimization.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 5.1. `math-for-machine-learning.adoc` — Math for ML: Linear Algebra, Calculus & Probability
  - [x] Task 5.2. `information-theory-and-losses.adoc` — Loss Functions & Information Theory
  - [x] Task 5.3. `gradient-descent-and-optimization.adoc` — Gradient Descent & Optimization
- [x] Task 6. Write 3 pages in `modules/ROOT/pages/ml/`: `generalization-and-regularization.adoc`, `classic-algorithms-overview.adoc`, `tabular-data-and-gradient-boosting.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 6.1. `generalization-and-regularization.adoc` — Generalization, Bias–Variance & Regularization
  - [x] Task 6.2. `classic-algorithms-overview.adoc` — Classic ML Algorithms at a Glance
  - [x] Task 6.3. `tabular-data-and-gradient-boosting.adoc` — Tabular Data: Gradient Boosting vs Deep Learning
- [x] Task 7. Write 3 pages in `modules/ROOT/pages/ml/`: `neural-network-fundamentals.adoc`, `backpropagation-and-autodiff.adoc`, `training-deep-networks.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 7.1. `neural-network-fundamentals.adoc` — Neural Network Fundamentals: Perceptron, MLP & Activations
  - [x] Task 7.2. `backpropagation-and-autodiff.adoc` — Backpropagation & Automatic Differentiation
  - [x] Task 7.3. `training-deep-networks.adoc` — Training Deep Networks: Initialization, Normalization & Regularization
- [x] Task 8. Write 3 pages in `modules/ROOT/pages/ml/`: `optimizers-and-learning-rate-schedules.adoc`, `deep-learning-tuning-playbook.adoc`, `convolutional-neural-networks.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 8.1. `optimizers-and-learning-rate-schedules.adoc` — Optimizers & Learning-Rate Schedules
  - [x] Task 8.2. `deep-learning-tuning-playbook.adoc` — Tuning Deep Networks in Practice
  - [x] Task 8.3. `convolutional-neural-networks.adoc` — Convolutional Neural Networks
- [x] Task 9. Write 3 pages in `modules/ROOT/pages/ml/`: `recurrent-networks-and-sequences.adoc`, `attention-and-transformers.adoc`, `embeddings-and-representation-learning.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 9.1. `recurrent-networks-and-sequences.adoc` — RNNs, LSTMs & GRUs
  - [x] Task 9.2. `attention-and-transformers.adoc` — Attention & Transformers: the Bridge to LLMs
  - [x] Task 9.3. `embeddings-and-representation-learning.adoc` — Embeddings & Representation Learning
- [x] Task 10. Write 4 pages in `modules/ROOT/pages/ml/`: `generative-models.adoc`, `graph-neural-networks.adoc`, `reinforcement-learning.adoc`, `transfer-learning-and-foundation-models.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 10.1. `generative-models.adoc` — Generative Models: Autoencoders, VAEs, GANs & Diffusion
  - [x] Task 10.2. `graph-neural-networks.adoc` — Graph Neural Networks
  - [x] Task 10.3. `reinforcement-learning.adoc` — Reinforcement Learning Basics
  - [x] Task 10.4. `transfer-learning-and-foundation-models.adoc` — Transfer Learning, Fine-Tuning & Foundation Models
- [x] Task 11. Write 3 pages in `modules/ROOT/pages/ml/`: `hardware-and-mixed-precision.adoc`, `distributed-training.adoc`, `model-compression.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 11.1. `hardware-and-mixed-precision.adoc` — Hardware, Memory & Mixed Precision
  - [x] Task 11.2. `distributed-training.adoc` — Distributed Training Concepts
  - [x] Task 11.3. `model-compression.adoc` — Model Compression: Quantization, Pruning & Distillation
- [x] Task 12. Write 3 pages in `modules/ROOT/pages/ml/`: `onnx-and-interoperability.adoc`, `deploying-and-serving-models.adoc`, `experiment-tracking-and-mlops.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 12.1. `onnx-and-interoperability.adoc` — ONNX & Model Interoperability
  - [x] Task 12.2. `deploying-and-serving-models.adoc` — Deploying & Serving ML Models
  - [x] Task 12.3. `experiment-tracking-and-mlops.adoc` — Experiment Tracking & MLOps for Training
- [x] Task 13. Write 3 pages in `modules/ROOT/pages/ml/`: `interpretability-and-explainability.adoc`, `fairness-and-responsible-ml.adoc`, `choosing-a-framework.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 13.1. `interpretability-and-explainability.adoc` — Interpretability & Explainability
  - [x] Task 13.2. `fairness-and-responsible-ml.adoc` — Fairness & Responsible ML
  - [x] Task 13.3. `choosing-a-framework.adoc` — Choosing a Framework: scikit-learn, PyTorch, Keras, TensorFlow, JAX & Gradient Boosting
- [x] Task 14. Write 2 pages in `modules/ROOT/pages/ml/`: `learning-resources.adoc`, `glossary.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (General pages); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 14.1. `learning-resources.adoc` — Books, Courses & Where to Follow Research
  - [x] Task 14.2. `glossary.adoc` — ML & Deep Learning Glossary

### Group 3: PyTorch pages

Parallelizable: yes

- [x] Task 15. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `installation.adoc`, `devices-and-accelerators.adoc`, `tensors.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 15.1. `installation.adoc` — Installation & Versions
  - [x] Task 15.2. `devices-and-accelerators.adoc` — Devices & Accelerators: CUDA, ROCm, MPS, XPU, CPU
  - [x] Task 15.3. `tensors.adoc` — Tensors: Creation, Attributes & Dtypes
- [x] Task 16. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `tensor-indexing-views-and-broadcasting.adoc`, `numpy-and-dlpack.adoc`, `autograd.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 16.1. `tensor-indexing-views-and-broadcasting.adoc` — Indexing, Views & Broadcasting
  - [x] Task 16.2. `numpy-and-dlpack.adoc` — NumPy & DLPack Interop
  - [x] Task 16.3. `autograd.adoc` — Autograd Fundamentals
- [x] Task 17. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `grad-modes.adoc`, `custom-autograd-functions.adoc`, `higher-order-gradients-and-torch-func.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 17.1. `grad-modes.adoc` — no_grad, inference_mode & Grad Modes
  - [x] Task 17.2. `custom-autograd-functions.adoc` — Custom autograd Functions
  - [x] Task 17.3. `higher-order-gradients-and-torch-func.adoc` — Higher-Order Gradients & torch.func
- [x] Task 18. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `nn-module.adoc`, `layers-linear-and-convolution.adoc`, `layers-recurrent.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 18.1. `nn-module.adoc` — nn.Module: Parameters, Buffers, state_dict, Hooks, Containers & Init
  - [x] Task 18.2. `layers-linear-and-convolution.adoc` — Linear, Convolution & Pooling Layers
  - [x] Task 18.3. `layers-recurrent.adoc` — RNN, LSTM & GRU
- [x] Task 19. Write 4 pages in `modules/ROOT/pages/ml/pytorch/`: `attention-and-transformers.adoc`, `embedding-normalization-dropout-activations.adoc`, `nn-functional.adoc`, `loss-functions.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 19.1. `attention-and-transformers.adoc` — Attention, SDPA, FlexAttention & Transformers
  - [x] Task 19.2. `embedding-normalization-dropout-activations.adoc` — Embeddings, Normalization, Dropout & Activations
  - [x] Task 19.3. `nn-functional.adoc` — torch.nn.functional
  - [x] Task 19.4. `loss-functions.adoc` — Loss Functions
- [x] Task 20. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `optimizers.adoc`, `lr-schedulers.adoc`, `datasets-and-dataloader.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 20.1. `optimizers.adoc` — Optimizers
  - [x] Task 20.2. `lr-schedulers.adoc` — Learning-Rate Schedulers & SWA/EMA
  - [x] Task 20.3. `datasets-and-dataloader.adoc` — Datasets & DataLoader
- [x] Task 21. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `dataloader-performance.adoc`, `training-loop.adoc`, `saving-and-loading.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 21.1. `dataloader-performance.adoc` — Workers, Pinned Memory & Samplers
  - [x] Task 21.2. `training-loop.adoc` — The Training Loop & Evaluation
  - [x] Task 21.3. `saving-and-loading.adoc` — Saving & Loading Models (weights_only)
- [x] Task 22. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `reproducibility.adoc`, `mixed-precision.adoc`, `torch-compile.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 22.1. `reproducibility.adoc` — Reproducibility & Determinism
  - [x] Task 22.2. `mixed-precision.adoc` — Mixed Precision with torch.amp
  - [x] Task 22.3. `torch-compile.adoc` — torch.compile
- [x] Task 23. Write 4 pages in `modules/ROOT/pages/ml/pytorch/`: `torch-compile-troubleshooting.adoc`, `performance-tuning.adoc`, `profiling.adoc`, `memory-management.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 23.1. `torch-compile-troubleshooting.adoc` — Graph Breaks, Recompilation & Dynamic Shapes
  - [x] Task 23.2. `performance-tuning.adoc` — Performance Tuning Guide
  - [x] Task 23.3. `profiling.adoc` — Profiling with torch.profiler
  - [x] Task 23.4. `memory-management.adoc` — GPU Memory & Activation Checkpointing
- [x] Task 24. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `distributed-overview.adoc`, `distributed-data-parallel.adoc`, `fsdp2.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 24.1. `distributed-overview.adoc` — Distributed Overview, torchrun & Elastic
  - [x] Task 24.2. `distributed-data-parallel.adoc` — DistributedDataParallel
  - [x] Task 24.3. `fsdp2.adoc` — FSDP2 (fully_shard)
- [x] Task 25. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `dtensor-tensor-and-pipeline-parallel.adoc`, `distributed-checkpoint-and-debugging.adoc`, `torch-export.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 25.1. `dtensor-tensor-and-pipeline-parallel.adoc` — DTensor, Tensor & Pipeline Parallelism
  - [x] Task 25.2. `distributed-checkpoint-and-debugging.adoc` — Distributed Checkpoint & Flight Recorder
  - [x] Task 25.3. `torch-export.adoc` — torch.export
- [x] Task 26. Write 4 pages in `modules/ROOT/pages/ml/pytorch/`: `aotinductor.adoc`, `onnx-export.adoc`, `executorch.adoc`, `quantization-and-sparsity.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 26.1. `aotinductor.adoc` — AOTInductor (confirm the exact official URL)
  - [x] Task 26.2. `onnx-export.adoc` — Exporting to ONNX
  - [x] Task 26.3. `executorch.adoc` — ExecuTorch for Mobile & Edge
  - [x] Task 26.4. `quantization-and-sparsity.adoc` — Quantization, Sparsity & Pruning with torchao
- [x] Task 27. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `torchvision.adoc`, `torchaudio-and-torchcodec.adoc`, `transfer-learning.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 27.1. `torchvision.adoc` — torchvision: Transforms v2, Models & Weights
  - [x] Task 27.2. `torchaudio-and-torchcodec.adoc` — torchaudio (Maintenance) & TorchCodec
  - [x] Task 27.3. `transfer-learning.adoc` — Transfer Learning & Fine-Tuning
- [x] Task 28. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `tutorial-cnn.adoc`, `tutorial-rnn.adoc`, `tutorial-transformer.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 28.1. `tutorial-cnn.adoc` — Worked Example: CNN Image Classifier (confirm the CIFAR-10 URL)
  - [x] Task 28.2. `tutorial-rnn.adoc` — Worked Example: Character RNN & seq2seq
  - [x] Task 28.3. `tutorial-transformer.adoc` — Worked Example: Transformer Building Blocks
- [x] Task 29. Write 3 pages in `modules/ROOT/pages/ml/pytorch/`: `sparse-nested-complex.adoc`, `custom-operators-and-extensions.adoc`, `tensorboard.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 29.1. `sparse-nested-complex.adoc` — Sparse, Nested & Complex Tensors
  - [x] Task 29.2. `custom-operators-and-extensions.adoc` — Custom Operators, C++/CUDA Extensions & Triton
  - [x] Task 29.3. `tensorboard.adoc` — TensorBoard Integration
- [x] Task 30. Write 2 pages in `modules/ROOT/pages/ml/pytorch/`: `legacy-and-deprecated.adoc`, `ecosystem.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (PyTorch); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 30.1. `legacy-and-deprecated.adoc` — Legacy APIs & Migration (where older books and tutorials are outdated)
  - [x] Task 30.2. `ecosystem.adoc` — Ecosystem: Lightning, Hugging Face, Captum, skorch, Ray & TorchRL

### Group 4: TensorFlow and Keras pages

Parallelizable: yes

- [x] Task 31. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `ecosystem-and-status.adoc`, `installation.adoc`, `devices-gpu-tpu.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 31.1. `ecosystem-and-status.adoc` — Ecosystem & Project Status
  - [x] Task 31.2. `installation.adoc` — Installation: pip, GPU, WSL2 & macOS
  - [x] Task 31.3. `devices-gpu-tpu.adoc` — Devices: CPUs, GPUs & TPUs
- [x] Task 32. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `tensors.adoc`, `variables.adoc`, `ragged-sparse-tensors.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 32.1. `tensors.adoc` — Tensors, Dtypes & Random Numbers
  - [x] Task 32.2. `variables.adoc` — Variables
  - [x] Task 32.3. `ragged-sparse-tensors.adoc` — Ragged & Sparse Tensors
- [x] Task 33. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `numpy-interop.adoc`, `autodiff.adoc`, `graphs-and-tf-function.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 33.1. `numpy-interop.adoc` — NumPy Interop & tf.experimental.numpy
  - [x] Task 33.2. `autodiff.adoc` — Automatic Differentiation with GradientTape
  - [x] Task 33.3. `graphs-and-tf-function.adoc` — Graphs, tf.function, AutoGraph & Retracing
- [x] Task 34. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `modules.adoc`, `core-training-loop.adoc`, `keras-overview.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 34.1. `modules.adoc` — Modules (tf.Module)
  - [x] Task 34.2. `core-training-loop.adoc` — A Training Loop with TF Core
  - [x] Task 34.3. `keras-overview.adoc` — Keras 3 Overview: keras, tf.keras & tf_keras
- [x] Task 35. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `keras-sequential-functional.adoc`, `keras-subclassing-custom-layers.adoc`, `keras-layers.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 35.1. `keras-sequential-functional.adoc` — Sequential & Functional Models
  - [x] Task 35.2. `keras-subclassing-custom-layers.adoc` — Subclassing & Custom Layers
  - [x] Task 35.3. `keras-layers.adoc` — Core Keras Layers
- [x] Task 36. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `keras-losses.adoc`, `keras-metrics.adoc`, `keras-optimizers.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 36.1. `keras-losses.adoc` — Losses
  - [x] Task 36.2. `keras-metrics.adoc` — Metrics
  - [x] Task 36.3. `keras-optimizers.adoc` — Optimizers & Learning-Rate Schedules
- [x] Task 37. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `keras-training.adoc`, `keras-callbacks.adoc`, `custom-train-step.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 37.1. `keras-training.adoc` — compile, fit, evaluate & predict
  - [x] Task 37.2. `keras-callbacks.adoc` — Callbacks
  - [x] Task 37.3. `custom-train-step.adoc` — Customizing fit() with train_step
- [x] Task 38. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `custom-training-loop.adoc`, `keras-multi-backend.adoc`, `keras-tuner.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 38.1. `custom-training-loop.adoc` — Writing a Training Loop from Scratch
  - [x] Task 38.2. `keras-multi-backend.adoc` — Keras Multi-Backend: JAX, PyTorch & keras.ops
  - [x] Task 38.3. `keras-tuner.adoc` — Hyperparameter Tuning with KerasTuner
- [x] Task 39. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `tf-data.adoc`, `tf-data-performance.adoc`, `keras-data-loading.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 39.1. `tf-data.adoc` — Input Pipelines with tf.data & TFRecord
  - [x] Task 39.2. `tf-data-performance.adoc` — tf.data Performance
  - [x] Task 39.3. `keras-data-loading.adoc` — Loading Images, Text & Audio from Disk
- [x] Task 40. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `keras-preprocessing-layers.adoc`, `tensorflow-datasets.adoc`, `image-classification-cnn.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 40.1. `keras-preprocessing-layers.adoc` — Keras Preprocessing Layers
  - [x] Task 40.2. `tensorflow-datasets.adoc` — TensorFlow Datasets (TFDS)
  - [x] Task 40.3. `image-classification-cnn.adoc` — Image Classification with CNNs
- [x] Task 41. Write 4 pages in `modules/ROOT/pages/ml/tensorflow/`: `transfer-learning.adoc`, `keras-hub.adoc`, `text-and-sequences.adoc`, `transformers.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 41.1. `transfer-learning.adoc` — Transfer Learning & Fine-Tuning
  - [x] Task 41.2. `keras-hub.adoc` — Pre-trained Models with KerasHub
  - [x] Task 41.3. `text-and-sequences.adoc` — Text, RNNs & Embeddings
  - [x] Task 41.4. `transformers.adoc` — Attention & Transformers
- [x] Task 42. Write 3 pages in `modules/ROOT/pages/ml/tensorflow/`: `saving-keras-models.adoc`, `savedmodel.adoc`, `checkpoints.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 42.1. `saving-keras-models.adoc` — Saving Keras Models: .keras, Weights & export
  - [x] Task 42.2. `savedmodel.adoc` — SavedModel & Signatures
  - [x] Task 42.3. `checkpoints.adoc` — Training Checkpoints
- [x] Task 43. Write 4 pages in `modules/ROOT/pages/ml/tensorflow/`: `mixed-precision.adoc`, `distributed-training.adoc`, `performance-xla-profiling.adoc`, `tensorboard.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 43.1. `mixed-precision.adoc` — Mixed Precision
  - [x] Task 43.2. `distributed-training.adoc` — Distributed Training: tf.distribute & the Keras Distribution API
  - [x] Task 43.3. `performance-xla-profiling.adoc` — Performance, XLA & Profiling
  - [x] Task 43.4. `tensorboard.adoc` — TensorBoard
- [x] Task 44. Write 4 pages in `modules/ROOT/pages/ml/tensorflow/`: `serving.adoc`, `litert-on-device.adoc`, `quantization-optimization.adoc`, `tfjs-tfx-tfp.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 44.1. `serving.adoc` — Serving with TensorFlow Serving
  - [x] Task 44.2. `litert-on-device.adoc` — On-Device Inference with LiteRT
  - [x] Task 44.3. `quantization-optimization.adoc` — Quantization & Model Optimization
  - [x] Task 44.4. `tfjs-tfx-tfp.adoc` — TF.js, TFX & TF Probability (Positioning)
- [x] Task 45. Write 2 pages in `modules/ROOT/pages/ml/tensorflow/`: `migrating-from-tf1.adoc`, `migrating-keras-2-to-3.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (TensorFlow); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 45.1. `migrating-from-tf1.adoc` — Migrating from TensorFlow 1 (where older books and tutorials are outdated)
  - [x] Task 45.2. `migrating-keras-2-to-3.adoc` — Migrating from Keras 2 to Keras 3

### Group 5: scikit-learn pages (ML and deep learning focused)

Parallelizable: yes

- [x] Task 46. Write 3 pages in `modules/ROOT/pages/ml/scikit-learn/`: `neural-networks-mlp.adoc`, `when-to-move-to-deep-learning.adoc`, `kernel-methods.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (scikit-learn); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 46.1. `neural-networks-mlp.adoc` — Neural Networks: MLPClassifier & MLPRegressor
  - [x] Task 46.2. `when-to-move-to-deep-learning.adoc` — From scikit-learn to Deep Learning
  - [x] Task 46.3. `kernel-methods.adoc` — Kernel Ridge, Kernel Approximation & Nyström
- [x] Task 47. Write 3 pages in `modules/ROOT/pages/ml/scikit-learn/`: `gaussian-processes.adoc`, `discriminant-analysis.adoc`, `semi-supervised-learning.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (scikit-learn); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 47.1. `gaussian-processes.adoc` — Gaussian Processes
  - [x] Task 47.2. `discriminant-analysis.adoc` — Linear & Quadratic Discriminant Analysis
  - [x] Task 47.3. `semi-supervised-learning.adoc` — Semi-Supervised Learning
- [x] Task 48. Write 4 pages in `modules/ROOT/pages/ml/scikit-learn/`: `isotonic-regression.adoc`, `covariance-and-density-estimation.adoc`, `cross-decomposition-and-random-projection.adoc`, `multiclass-and-multioutput.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (scikit-learn); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 48.1. `isotonic-regression.adoc` — Isotonic Regression
  - [x] Task 48.2. `covariance-and-density-estimation.adoc` — Covariance & Density Estimation
  - [x] Task 48.3. `cross-decomposition-and-random-projection.adoc` — PLS, CCA & Random Projection
  - [x] Task 48.4. `multiclass-and-multioutput.adoc` — Multiclass, Multilabel & Multioutput Strategies
- [x] Task 49. Write 3 pages in `modules/ROOT/pages/ml/scikit-learn/`: `imbalanced-data.adoc`, `end-to-end-project.adoc`, `custom-estimators.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (scikit-learn); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 49.1. `imbalanced-data.adoc` — Imbalanced Data: class_weight, Thresholds & imbalanced-learn
  - [x] Task 49.2. `end-to-end-project.adoc` — End-to-End ML Project
  - [x] Task 49.3. `custom-estimators.adoc` — Building Custom Estimators & Transformers
- [x] Task 50. Write 3 pages in `modules/ROOT/pages/ml/scikit-learn/`: `callbacks-and-training-monitoring.adoc`, `scikit-learn-with-pytorch-and-keras.adoc`, `gradient-boosting-libraries.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (scikit-learn); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 50.1. `callbacks-and-training-monitoring.adoc` — Callbacks: Progress & Scoring Monitoring (experimental)
  - [x] Task 50.2. `scikit-learn-with-pytorch-and-keras.adoc` — Using scikit-learn with PyTorch & Keras
  - [x] Task 50.3. `gradient-boosting-libraries.adoc` — HistGradientBoosting vs XGBoost, LightGBM & CatBoost
- [x] Task 51. Write 3 pages in `modules/ROOT/pages/ml/scikit-learn/`: `hyperparameter-tuning-at-scale.adoc`, `scaling-and-out-of-core.adoc`, `exporting-to-onnx.adoc`. Follow the page contract above and each page's entry (title, official sources, figures) in the first comment of issue #245 (scikit-learn); run the CLAUDE.md greps on each page as it is written.
  - [x] Task 51.1. `hyperparameter-tuning-at-scale.adoc` — Hyperparameter Tuning at Scale: Halving, Optuna & Parallelism
  - [x] Task 51.2. `scaling-and-out-of-core.adoc` — Scaling Strategies & Out-of-Core Learning
  - [x] Task 51.3. `exporting-to-onnx.adoc` — Exporting Pipelines to ONNX

### Group 6: Landing pages with bibliographies

Parallelizable: yes

- [x] Task 52. Write `modules/ROOT/pages/ml/index.adoc` (nav title **ML (Machine Learning)**): scope, how it relates to Data Science (issue #244) and the AI section, version table, learning-path diagram, reading order, links to every general page and sub-section, and the `== Bibliography` listing the general sources from the second comment of issue #245 plus all fourteen books (linked to publisher pages), each source linked to its official website. Includes `ml-disclaimer.adoc`.
- [x] Task 53. Write `modules/ROOT/pages/ml/pytorch/index.adoc` (nav title **PyTorch**): overview, 2.15 baseline (released 2026-10-28), learning path, library status table (TorchServe and torchtext archived, TorchScript deprecated, torchaudio in maintenance), links to every PyTorch page, and the `== Bibliography` for this part from the second comment of issue #245. Includes `ml-pytorch-disclaimer.adoc`.
- [x] Task 54. Write `modules/ROOT/pages/ml/tensorflow/index.adoc` (nav title **TensorFlow**): overview, the 2026 maintenance focus, how Keras 3 fits ("Keras inside TensorFlow"), 2.21 baseline with 2.22 labelled upcoming, links to every TensorFlow page, and the `== Bibliography` for this part. Includes `ml-tensorflow-disclaimer.adoc`.
- [x] Task 55. Write `modules/ROOT/pages/ml/scikit-learn/index.adoc` (nav title **scikit-learn**): ML-focused overview, the naming note ("Sci-kit" vs scikit-learn/`sklearn`), the list of reused `data-science/scikit-learn/*` pages from issue #244 as foundations (each linked with `xref:`, existence verified against the 44 pages on disk), links to the new pages, version baseline, and the `== Bibliography` for this part. Includes `ml-scikit-learn-disclaimer.adoc`.

### Group 7: Cheat sheet page and one-page PDFs

Parallelizable: yes

- [x] Task 56. Render `modules/ROOT/attachments/ml-cheat-sheet.pdf` as exactly one A4 page (throwaway HTML printed with headless Chrome, not committed, as for the Data Science PDFs), dense colour-coded layout summarising: learning types, loss and metric chooser, activation and optimiser defaults, the training recipe, a "model does not learn" debugging checklist, overfitting remedies, architecture chooser (MLP/CNN/RNN/transformer/GBM), framework chooser, deployment formats, versions. Confirm one page with `pdfinfo`. — created `ml-cheat-sheet.pdf` (1 page, A4 595x842 pt); docs repo: no test/coverage/license gates.
- [x] Task 57. Render `modules/ROOT/attachments/ml-pytorch-cheat-sheet.pdf` as exactly one A4 page (same method), summarising: install and index URLs, tensors and devices (`torch.accelerator`), autograd and grad modes, `nn.Module` skeleton, losses and optimisers, the canonical training loop, `DataLoader` knobs, `weights_only` save/load, AMP, `torch.compile`, DDP/FSDP2 launch, export paths (`torch.export`, ONNX, ExecuTorch), legacy to current renames. Confirm one page with `pdfinfo`. — created `ml-pytorch-cheat-sheet.pdf` (1 page, A4 595x842 pt); docs repo: no test/coverage/license gates.
- [x] Task 58. Render `modules/ROOT/attachments/ml-tensorflow-cheat-sheet.pdf` as exactly one A4 page (same method), summarising: install matrix, tensors and variables, `GradientTape`, `tf.function` rules, Keras 3 model styles, `compile`/`fit`, callbacks, `tf.data` recipe, saving formats (`.keras`, `.weights.h5`, `export`), mixed precision, `tf.distribute`, LiteRT and Serving, TF1 and Keras 2 to 3 renames. Confirm one page with `pdfinfo`. — created `ml-tensorflow-cheat-sheet.pdf` (1 page, A4 595x842 pt); docs repo: no test/coverage/license gates.
- [x] Task 59. Create `modules/ROOT/pages/ml/cheat-sheet.adoc` following `data-science/cheat-sheet.adoc`: one section per PDF with anchors `#_machine_learning_deep_learning`, `#_pytorch`, `#_tensorflow`, `#_scikit_learn`, each listing the dedicated pages it summarises and linking `xref:attachment$<name>.pdf[...]`. The scikit-learn section links the reused `data-science-scikit-learn-cheat-sheet.pdf` (not duplicated) and lists the new ML pages it does not cover. Includes `ml-disclaimer.adoc`. — created `pages/ml/cheat-sheet.adoc` created; anchors and xrefs verified after build; docs repo: no test/coverage/license gates.

### Group 8: Site wiring and cross-links

Parallelizable: no — Tasks 60-62 need every page to exist and all three edit shared files (nav, home page, existing pages)

- [x] Task 60. Edit `modules/ROOT/nav.adoc`: add `** xref:ml/index.adoc[ML (Machine Learning)]` as the last entry under Guides & References, after the Data Science block (which currently ends with its Cheat Sheet entry at the end of the file); general pages at `***` grouped as in the outline, then `*** xref:ml/pytorch/index.adoc[PyTorch]`, `*** xref:ml/tensorflow/index.adoc[TensorFlow]` and `*** xref:ml/scikit-learn/index.adoc[scikit-learn]`, each with `****` pages and a final `**** xref:ml/cheat-sheet.adoc#_<part>[Cheat Sheet (PDF)]` entry, then `*** xref:ml/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Every page created in Groups 2-6 appears exactly once.
- [x] Task 61. Edit `modules/ROOT/pages/index.adoc`: add `image::ml.svg[xref="ml/index.adoc"]` in the first empty `a|` cell that follows the `data-science.svg` tile (no new row is needed), and extend `:description:` and `:keywords:` with the new section.
- [x] Task 62. Add cross-links between the new pages and the existing ones without duplicating content: from the Data Science, `ai/llm-foundations`, `ai/hugging-face`, `ai/local-llms`, `ai/llmops`, `database/vector-rag`, `backend/fastapi/serving-data-science-and-ai.adoc` and Python pages to the matching ML pages (add one `See also` line per touched page, no admonitions), and verify every outgoing `xref:` from ML pages resolves to an existing file.

### Group 9: Build, checks and policy

Parallelizable: no — runs after all content tasks, sequential gates

- [x] Task 63. Run `npx antora antora-playbook.yml` and fix every `xref`/AsciiDoc error and warning introduced by the new pages; open a sample of pages from `build/site` (home tile, each part index, one page per part, cheat sheet) in the preview to confirm rendering.
- [x] Task 64. Run the CLAUDE.md verification greps and fix anything printed: block image macros not closed on one line; inline `image:` macros not closed; `<p>image::` leaked into `build/site`; unquoted-comma alt text on the changed `.adoc` files; inline-code substitutions on `build/site/ROOT/ml`. Also confirm every `modules/ROOT/images/ml*` SVG is referenced by a page and every `image::` target exists.
- [x] Task 65. Run `npm i --no-save mermaid@11 jsdom` and `npm run validate:mermaid`; every diagram must report as parsed. Confirm the only admonitions in the new pages are the four disclaimer partials (grep for `NOTE:`, `TIP:`, `WARNING:`, `CAUTION:`, `[IMPORTANT]` outside the partials).
- [x] Task 66. Policy checks: `git status` shows no book PDF, extracted book text or scratch HTML staged; no book text, figure or exercise is reproduced; the three new PDFs are one page each (`pdfinfo`); run `iru-check-security` on the changed files (detect-secrets findings in this docs repo are false positives per project policy but must be audited and labelled `is_secret: false`); do not commit `build/` or `node_modules`.
