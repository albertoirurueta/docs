# Implementation Plan: Guides & References / Cloud / Azure — Foundry Tools sub-section

## Task summary

Source: GitHub issue #270
Base branch: main

Working branch: `feature/270-foundry-tools`

Issue [#270](https://github.com/albertoirurueta/docs/issues/270) asks for a new **Foundry Tools** sub-section under
*Guides & References → Cloud → Azure* at `modules/ROOT/pages/cloud/azure/foundry-tools/`. It is a practical guide to
Microsoft Foundry Tools, the catalog of prebuilt AI services formerly called *Azure AI services* and, before that,
*Cognitive Services*: Speech, Translator, Language, Vision (with Face), Document Intelligence, Content Understanding,
Content Safety, Azure AI Search and Immersive Reader. The deliverables are:

* 24 pages: `index.adoc`, 22 concept pages and `cheat-sheet.adoc`
* 5 `azure-foundry-*.svg` figures
* `modules/ROOT/attachments/azure-foundry-tools-cheat-sheet.pdf`, one A4 page
* a *Foundry Tools* group in the Azure bibliography
* wiring and cross-link edits to existing pages

The issue body is the primary spec. Each page task below names its `Pages §N` section in the issue. The implementer
must read that section in full (`mcp__github__issue_read` → `get`, or `gh issue view 270`). The plan only restates
what is needed to scope the work and to keep pages written in parallel consistent.

Choices made during planning (challenge them in review):

1. **Deprecations use `[WARNING]` admonitions, as the issue asks (confirmed by the user).** The rest of the Azure
   section follows plan #192's rule of no admonitions except the disclaimer. The Foundry Tools pages make one
   explicit exception: a `[WARNING]` block for each **deprecated-but-still-supported** feature, and the end-of-support
   banners the issue names. Examples are Language legacy features (2029-03-31), Image Analysis 3.2/4.0 (2028-09-25),
   Content Moderator (2027-03-15), Custom Vision, entity linking, Language Studio and Foundry classic agents. Retired
   features get one prose migration note, not an admonition. No other admonition type is used (no `NOTE`, `TIP` or
   `IMPORTANT`, except the disclaimer).
2. **Tasks are untagged (no language key).** The installed `*-code-one-task` skills are `java`, `java-springboot`,
   `dotnet` and `database`. None of them applies to writing AsciiDoc, SVG or PDF documentation, so every task is
   implemented directly, as in plans #192 and #210. The Python, C#, Java, REST and Bicep snippets are page *content*.
   This repository doesn't compile them.
3. **Application code follows the issue, not the parent section's default.** The parent section uses Java/Spring Boot
   by default. The issue requires **Python and C# on every tool page**, **Java wherever a GA Java SDK exists**, and at
   least one **REST/`curl`** call per tool. Authentication is `DefaultAzureCredential` / managed identity by default,
   with key-based auth shown once per page for the quickstart path.
4. **Ship everything in one PR**, as for #192. Groups 2–6 split cleanly if a split is ever wanted.
5. **Versions and retirement dates are re-verified first (Group 1) and reused by every page.** The issue's baseline
   tables are dated 2026-10-06 and mark several items "re-verify": QnA Maker, Personalizer and Metrics Advisor
   dates, and the single-service `--kind` values. Group 1 checks each item once against Microsoft Learn and the
   package registries. It writes the confirmed values into the `## Verified baseline

_Filled in by Task 1 on 2026-10-06. Package versions were checked directly against PyPI, NuGet, Maven Central and npm
(registry JSON/metadata), and SDK changelogs against the `Azure/azure-sdk-for-python` repository on GitHub.
`learn.microsoft.com` is blocked by this container's egress proxy, so Learn-only facts (REST api-versions, limits and
retirement dates) are carried from the issue unless a registry, SDK changelog or `azure.microsoft.com/updates`
notice contradicted them. Pages say "check the release notes" wherever a value could not be re-verified._

### Per-tool versions (GA unless marked)

| Tool | REST api-version | Python | .NET | Java | JS | Differs from issue |
|---|---|---|---|---|---|---|
| Foundry SDK | project endpoint | `azure-ai-projects` 2.8.0 | `Azure.AI.Projects` 2.0.1 | `com.azure:azure-ai-projects` 2.6.1 | `@azure/ai-projects` 2.8.0 | **yes** (newer patch/minor; issue said ≥2.3.0 / 2.0.0 / 2.3.0 / 2.4.0) |
| Identity | -- | `azure-identity` 1.26.0 | `Azure.Identity` 1.21.0 | `com.azure:azure-identity` 1.18.7 | -- | n/a |
| Speech SDK | STT `2025-10-15` | `azure-cognitiveservices-speech` 1.52.0 (2026-09-28) | `Microsoft.CognitiveServices.Speech` 1.52.0 | `com.microsoft.cognitiveservices.speech:client-sdk` 1.52.0 | `microsoft-cognitiveservices-speech-sdk` 1.52.0 | no (1.52 confirmed Sep 2026) |
| LLM speech (preview service) | `2025-10-15` | `azure-ai-transcription` 1.0.0 | `Azure.AI.Speech.Transcription` 1.0.0 | `com.azure:azure-ai-speech-transcription` 1.0.0 | `@azure/ai-speech-transcription` 1.0.0 | no |
| Voice Live | `2026-04-10` | `azure-ai-voicelive` 1.3.0 | `Azure.AI.VoiceLive` 1.2.0 | `com.azure:azure-ai-voicelive` 1.1.0 | `@azure/ai-voicelive` 1.1.0 | **yes** (versions now pinned; Java SDK exists) |
| Text translation | `2026-06-06` (v3.0 still GA) | `azure-ai-translation-text` 2.0.0 (targets `2026-06-06`) | `Azure.AI.Translation.Text` 2.0.0 | `com.azure:azure-ai-translation-text` 2.0.3 | `@azure-rest/ai-translation-text` 2.0.0 | **yes** -- the issue said "REST only, no SDK yet"; the 2.x SDKs are GA and target `2026-06-06` (Python changelog: "2.0.0 (2026-06-06) ... Updated to stable API version 2026-06-06"). Pages show the 2.x SDKs; the 1.x SDKs target v3.0. |
| Document translation | `2026-03-01` | `azure-ai-translation-document` 2.0.0 | `Azure.AI.Translation.Document` 3.0.0 | `com.azure:azure-ai-translation-document` 2.0.1 | `@azure-rest/ai-translation-document` 1.0.0 | Java 2.0.1 (issue 2.0.0) |
| Language | text `2024-11-01`, PII `2026-05-01`; previews `2025-11-15-preview`, `2026-04-15-preview` | `azure-ai-textanalytics` 5.4.0 (6.0.0b3 preview) | `Azure.AI.TextAnalytics` 5.3.0 / `Azure.AI.Language.Text` 1.0.0-beta.4 | `com.azure:azure-ai-textanalytics` 5.5.15 | `@azure/ai-language-text` 1.1.0 | Python preview now 6.0.0b3 |
| Image Analysis 4.0 (deprecated) | `2024-02-01` (`2023-10-01`) | `azure-ai-vision-imageanalysis` 1.0.0 | `Azure.AI.Vision.ImageAnalysis` 1.0.0 | `com.azure:azure-ai-vision-imageanalysis` 1.0.10 | -- | no |
| Face | `v1.2` | `azure-ai-vision-face` 1.0.0b2 (preview) | `Azure.AI.Vision.Face` 1.0.0-beta.2 | `com.azure:azure-ai-vision-face` 1.0.0-beta.2 | -- | no (no GA Face SDK) |
| Document Intelligence | `2024-11-30` (v4.0) | `azure-ai-documentintelligence` 1.0.2 | `Azure.AI.DocumentIntelligence` 1.0.0 | `com.azure:azure-ai-documentintelligence` 1.0.10 | `@azure-rest/ai-document-intelligence` 1.1.0 | no |
| Content Understanding | GA `2025-11-01`, preview `2026-06-01-preview` | `azure-ai-contentunderstanding` 1.1.0 (1.2.0b3 preview) | `Azure.AI.ContentUnderstanding` 1.1.0 | `com.azure:azure-ai-contentunderstanding` 1.0.0 | `@azure/ai-content-understanding` 1.1.0 | no |
| Content Safety | `2024-09-01` | `azure-ai-contentsafety` 1.0.0 (1.1.0b1 adds Prompt Shields/protected material) | `Azure.AI.ContentSafety` 1.0.0 | `com.azure:azure-ai-contentsafety` 1.0.20 | `@azure-rest/ai-content-safety` 1.0.1 | note: Prompt Shields only in the 1.1.0b1 preview SDK, so pages call it over REST |
| Azure AI Search | `2026-04-01`, preview `2026-08-01-preview` | `azure-search-documents` 12.0.0 | `Azure.Search.Documents` 12.0.0 | `com.azure:azure-search-documents` 12.0.2 | `@azure/search-documents` 13.0.0 | no |

### Resolved "re-verify" items

* **QnA Maker:** retired 2025-03-31 (azure.microsoft.com/updates/azure-qna-maker-will-be-retired-on-31-march-2025).
* **Personalizer:** retired 2026-10-01 (azure.microsoft.com/updates/ai-services-personalizer-will-be-retired-on-1-october-2026).
  The issue's "Learn says 2026-08-25" could not be re-checked (Learn blocked); pages use the official notice.
* **Metrics Advisor:** retired 2026-10-01 (azure.microsoft.com/updates/ai-services-metrics-advisor-will-be-retired-on-1-october-2026).
* **Single-service `--kind` values:** `AIServices`, `FormRecognizer`, `Face` and `TextAnalytics` stay confirmed. The
  other commonly used kinds (`SpeechServices`, `TextTranslation`, `ComputerVision`, `ContentSafety`,
  `ImmersiveReader`, `CognitiveServices`) could not be re-checked on Learn; pages list them with an instruction to
  run `az cognitiveservices account list-kinds` before use.
* **Translator `2026-06-06` SDK:** now exists (see table). Not "REST only".
* **Speech SDK 1.52:** confirmed, published 2026-09-28 on PyPI/NuGet/npm/Maven.

### Confirmed retirement table (pages §7, §12, §13, §21 and the cheat sheet copy this)

| Item | Status | Date | Replacement | Official notice |
|---|---|---|---|---|
| QnA Maker | Retired | 2025-03-31 | Custom question answering | https://azure.microsoft.com/updates/azure-qna-maker-will-be-retired-on-31-march-2025 |
| Pronunciation *content* assessment | Retired | 2025-07 | Azure OpenAI (Foundry Models) | https://learn.microsoft.com/azure/ai-services/speech-service/releasenotes |
| Speaker Recognition | Retired | 2025-09-30 (Speech SDK 1.47) | none (diarization unaffected) | https://learn.microsoft.com/azure/ai-services/speech-service/releasenotes |
| Speech intent recognition | Retired | 2025-10 (Speech SDK 1.47) | CLU or an LLM | https://learn.microsoft.com/azure/ai-services/speech-service/releasenotes |
| Background removal, Product Recognition, Image Analysis model customization | Retired | 2025-03-31 | none | https://learn.microsoft.com/azure/ai-services/computer-vision/whats-new |
| Spatial Analysis, Video Retrieval | Retired | 2025 | Content Understanding (+ AI Search) | https://learn.microsoft.com/azure/ai-services/computer-vision/whats-new |
| ConversationTranslator (multi-device) | Removed | Speech SDK 1.51 | Speech translation / Live Interpreter | https://learn.microsoft.com/azure/ai-services/speech-service/releasenotes |
| LUIS | Retired | 2026-03-31 | CLU | https://learn.microsoft.com/azure/ai-services/language-service/conversational-language-understanding/how-to/migrate-from-luis |
| STT REST v3.0 and v3.2 previews | Retired | 2026-03-31 | STT REST `2025-10-15` | https://learn.microsoft.com/azure/ai-services/speech-service/rest-speech-to-text |
| Anomaly Detector | Retired | 2026-10-01 | Fabric anomaly detection | https://azure.microsoft.com/updates/ai-services-anomaly-detector-will-be-retired-on-1-october-2026 |
| Personalizer | Retired | 2026-10-01 | microsoft/learning-loop | https://azure.microsoft.com/updates/ai-services-personalizer-will-be-retired-on-1-october-2026 |
| Metrics Advisor | Retired | 2026-10-01 | none | https://azure.microsoft.com/updates/ai-services-metrics-advisor-will-be-retired-on-1-october-2026 |
| Translator v3 BreakSentence, Detect, Dictionary | Not in `2026-06-06` (still in v3.0) | -- | Language detection; adaptive custom translation | https://learn.microsoft.com/azure/ai-services/translator/text-translation/how-to/migrate-to-2026-06-06 |
| Content Moderator | Deprecated | retires 2027-03-15 | Content Safety | https://learn.microsoft.com/azure/ai-services/content-moderator/overview |
| Language Studio | Deprecated | retires 2027-03-20 | Foundry portal | https://learn.microsoft.com/azure/ai-services/language-service/migration-studio-to-foundry |
| Foundry *classic* agents | Deprecated | retire 2027-03-31 | New Foundry agents | https://learn.microsoft.com/azure/foundry/agents/overview |
| Document Intelligence v2.1 | End of support | 2027-09-15 | v4.0 `2024-11-30` | https://learn.microsoft.com/azure/ai-services/document-intelligence/whats-new |
| Entity linking | Deprecated | end of support 2028-09-01 | Language NER or Foundry Models | https://learn.microsoft.com/azure/ai-services/language-service/whats-new |
| Image Analysis 3.2 / 4.0, multimodal embeddings | Deprecated | retire 2028-09-25 | Document Intelligence Read, Face, Content Understanding, Foundry Models | https://learn.microsoft.com/azure/ai-services/computer-vision/migration-options |
| Custom Vision | Deprecated | retires 2028-09-25 | AutoML, Foundry Models, Content Understanding classifier | https://learn.microsoft.com/azure/ai-services/custom-vision-service/migration-options |
| Language *legacy* features | Deprecated | end of support 2029-03-31 | Foundry Models | https://learn.microsoft.com/azure/ai-services/language-service/whats-new |
| Document Intelligence v3.0 | End of support | 2029-03-30 | v4.0 `2024-11-30` | https://learn.microsoft.com/azure/ai-services/document-intelligence/whats-new |

### Bibliography URLs (Task 1.4)

The issue's Learn URLs could not be fetched from this container (egress blocked), so none could be confirmed or
replaced; they are used as written. `github.com` repository URLs resolve. Re-check the Learn URLs in review.

## Shared conventions (every page in `foundry-tools/`)

- **Header:**
  - `= <Title>`, `:description:` (one sentence) and `:keywords:`, then a blank line
  - `include::partial$azure-disclaimer.adoc[]`
  - a lead paragraph naming the exact versions it targets: Azure CLI 2.90.0, plus the tool's REST api-version and
    SDK package versions from `## Verified baseline`
- **Provisioning, shown both ways:**
  - `=== In the Azure portal`: numbered blade or Foundry-portal (`https://ai.azure.com`) steps, plus the
    tool-specific studio where one still exists
  - `=== With the Azure CLI`: `[source,bash]` using `$RG`, `$LOCATION` and `$FOUNDRY` (= `foundry-bookshelf`)
  - purely conceptual pages (index, choosing) may skip both
- **Code on tool pages (§5–§19):**
  - Python and C# on every page
  - Java where a GA Java SDK exists
  - at least one `curl` call per page
  - a `Source: <official URL>` line directly after **every** code block
  - `DefaultAzureCredential` / managed identity by default, with key auth shown once
- **Use-case table on every tool page:**
  - `[cols="2,2,3,3", options="header"]` with columns Scenario | Feature | Why this feature | Example input → output
  - at least one Bookshelf row and at least one generic industry row
- **`== When not to use it`** near the end of every tool page: when a Foundry Model (LLM) or another tool fits
  better, linking `xref:cloud/azure/foundry-tools/choosing-a-foundry-tool.adoc[...]`
- **Retirements:** apply choice 1.
  - deprecated-but-supported features: `[WARNING]` + `====` with the date, the replacement and a link to the official
    notice
  - retired features: one prose migration note
- **Footer:**
  - `== Clean up` on pages that create resources
  - `== Related pages`, `xref:` only
  - `== References`, official sources only
- **Bookshelf names:**
  - existing: `rg-bookshelf`, `eastus2`, `stbookshelf`, `catalog-api`, `orders-api`, `vnet-bookshelf`, `kv-bookshelf`,
    `cae-bookshelf`, `afd-bookshelf`
  - new: `foundry-bookshelf` (`--kind AIServices`, custom subdomain `foundry-bookshelf`), project `proj-bookshelf`,
    `search-bookshelf`, Blob containers `media` and `invoices` in `stbookshelf`
  - no real subscription, tenant or key values
- **CLAUDE.md rules (mandatory):**
  - **images:** `image::` macros on one line; double-quoted alt text whenever it contains a comma; column 0 with
    blank lines around; bare filenames
  - **inline code:** `+...+` for anything with `->`, `=>`, `<=`, `<-`, `__`, `#[`, `~`, `*`, `^`, `...`, `'` or `{`;
    `pass:c[...]` for code containing `+`
  - **Mermaid:** `<<...>>` and any `<`+letter written as entities
  - **prose:** escape `\{ \}` in prose and table cells, and never start a wrapped line with `<digits>.` (bare years)
- **SVGs:**
  - hand-written, with a `viewBox`, `font-family="Helvetica, Arial, sans-serif"`, a flat light background, hex
    colours, no CSS variables and no external references
  - original drawings, not Microsoft icons
  - each one created by the task of the page that embeds it

## Implementation steps

### Group 1 — Verify the version and retirement baseline

**Parallelizable: yes** (single task; every page in Groups 2–7 depends on its output).

- [x] Task 1. Re-verify the issue's *Version and status baseline* and *Retirements and deprecations* tables against
  Microsoft Learn, the CLI reference and the package registries (PyPI, NuGet, Maven Central, npm). Write the results
  into `## Verified baseline` above.
  - [x] Task 1.1. Fill in a table with one row per tool, covering: REST api-version(s), the GA SDK package and
    version per language (Python, .NET, Java, JS), preview items, and the verification date. Mark every item that
    differs from the issue, with the source URL.
  - [x] Task 1.2. Resolve the issue's "re-verify" items:
    - the QnA Maker, Personalizer and Metrics Advisor retirement dates
    - the single-service `--kind` values from `az cognitiveservices account list-kinds` docs; only `AIServices`,
      `FormRecognizer`, `Face` and `TextAnalytics` are confirmed so far
    - whether the Translator `2026-06-06` SDK still doesn't exist
    - the Speech SDK 1.52 date
  - [x] Task 1.3. Fill in a confirmed retirement table (item, status, date, replacement, official notice URL). Pages
    §7, §12, §13, §21 and the cheat sheet copy it verbatim.
  - [x] Task 1.4. Confirm the bibliography URLs listed in the issue resolve. Record replacements for any that
    redirect or 404.

### Group 2 — Cross-cutting pages

**Parallelizable: yes.** Four independent new files. Each one `xref:`s the others by their planned paths only.

- [x] Task 2. Create `foundry-tools/choosing-a-foundry-tool.adoc` — *Choosing a Foundry Tool (or a Foundry Model)*
  (issue Pages §1).
  - [x] Task 2.1. Compare prebuilt tool vs LLM vs custom model. Cover cost unit, latency, determinism, compliance,
    residency, containers and structured-document accuracy, and Microsoft's own migration direction.
  - [x] Task 2.2. Add a Mermaid decision flowchart by modality and goal. Add the overlap sections: OCR,
    transcription, translation, and documents.
  - [x] Task 2.3. Add an AWS / Google Cloud equivalents table, linking both `ai-data-and-analytics-overview.adoc`
    pages.
- [x] Task 3. Create `foundry-tools/resources-endpoints-and-authentication.adoc` (§2).
  - [x] Task 3.1. Cover resource kinds (`AIServices`, legacy `CognitiveServices`, single-service kinds as verified in
    Task 1.2), when a single-service resource is still required, and `az cognitiveservices account update --kind
    AIServices`.
  - [x] Task 3.2. Cover endpoints: tool, project, regional Speech, and global Translator with the
    `Ocp-Apim-Subscription-Region` header. Note that custom subdomains can't be changed later.
  - [x] Task 3.3. Cover authentication:
    - keys and their rotation
    - the STS `issueToken` exchange
    - Entra roles, including the Foundry role names
    - `DefaultAzureCredential` in Python, C# and Java
    - `disableLocalAuth` and the Azure Policy that enforces it
  - [x] Task 3.4. Add Bicep for `foundry-bookshelf` (+ `proj-bookshelf`) with a `Cognitive Services User` role
    assignment for the Container Apps managed identity.
  - [x] Task 3.5. Add the figure `modules/ROOT/images/azure-foundry-resource-model.svg` and a Mermaid sequence of a
    keyless call (app → Entra → token → tool endpoint).
- [x] Task 4. Create `foundry-tools/networking-security-and-responsible-ai.adoc` (§3). Cover:
  - network rules
  - private endpoints and `privatelink` DNS zones, including Speech's separate setup
  - customer-managed keys
  - data residency and per-tool data retention
  - the Limited Access features and forms, and the Face restrictions
  - transparency notes, linking `ai/security/responsible-ai-practices.adoc`
  - a Bookshelf private endpoint in `vnet-bookshelf`, linking `cloud/azure/virtual-networks.adoc`
  - `== Clean up`
- [x] Task 5. Create `foundry-tools/pricing-quotas-containers-and-monitoring.adoc` (§4). Cover:
  - **pricing:** F0 vs S0, units per tool, and commitment tiers
  - **quotas:** the per-tool limits table, autoscale, and 429 handling, with a retry snippet in Python and C#
  - **containers:** the support matrix, connected vs disconnected containers, and a `docker run` with `Eula`,
    `Billing` and `ApiKey`
  - **monitoring:** diagnostic settings via CLI, a KQL query on `AzureDiagnostics`, `list-usage`, and alerts
  - links to `monitoring-and-observability.adoc` and `cost-management.adoc`

### Group 3 — Speech pages

**Parallelizable: yes.** Four independent new files.

- [x] Task 6. Create `foundry-tools/speech-to-text.adoc` (§5).
  - [x] Task 6.1. Cover the modes: real-time SDK, fast transcription (`transcriptions:transcribe`), batch, LLM speech
    (preview), and Whisper/`gpt-transcribe`.
  - [x] Task 6.2. Cover diarization and `ConversationTranscriber`, custom speech and WER (link the WER formula on
    `ai/voice-agents/speech-to-text.adoc`), the REST version history and retirements, and `spx recognize`.
  - [x] Task 6.3. Add code: Python/C#/Java real-time SDK, `curl` fast transcription, and a `curl` batch create + poll.
    Add the use-case table, including the Bookshelf podcast and voice-search rows.
  - [x] Task 6.4. Add the figure `modules/ROOT/images/azure-foundry-speech-to-text-modes.svg` and a Mermaid sequence
    of batch transcription with Blob storage and polling.
- [x] Task 7. Create `foundry-tools/text-to-speech-and-avatars.adoc` (§6). Cover:
  - voices (neural, HD `DragonHDLatestNeural`, OpenAI, multilingual)
  - SSML, including `mstts`, visemes and the support matrix
  - batch synthesis, custom voice (Limited Access) and avatars
  - code: SDK synthesis to file or stream, SSML from a file, and a `curl` batch synthesis call
  - the use-case table, including the Bookshelf audiobook and read-aloud rows
  - a link to `ai/voice-agents/text-to-speech.adoc`
- [x] Task 8. Create `foundry-tools/speech-translation-and-language-learning.adoc` (§7). Cover:
  - speech translation (billing beyond 2 target languages)
  - Live Interpreter
  - pronunciation assessment
  - language identification and custom keyword
  - retired-feature migration notes (speaker recognition, intent recognition, `ConversationTranslator`,
    pronunciation *content* assessment)
  - a Mermaid flowchart of the speech translation pipeline
  - the Bookshelf live author events row
- [x] Task 9. Create `foundry-tools/voice-live.adoc` (§8). Cover:
  - what Voice Live is and its features
  - the Pro / Standard / Lite tiers
  - the endpoint, the api-version and the `azure-ai-voicelive` / `Azure.AI.VoiceLive` SDKs
  - a comparison with a cascaded pipeline
  - the Bookshelf order-status assistant calling `orders-api` through function calling
  - a Mermaid sequence: `session.update`, audio in, tool call, audio out
  - links to the four `ai/voice-agents/` pages the issue lists

### Group 4 — Translator and Language pages

**Parallelizable: yes.** Four independent new files.

- [x] Task 10. Create `foundry-tools/text-translation.adoc` (§9). Cover:
  - `2026-06-06`: the `inputs[]`/`targets[]` shape, NMT vs LLM per request, tone and gender, adaptive custom
    translation, limits and billing
  - v3.0 operations
  - a v3.0 → `2026-06-06` migration table
  - code: `curl` `2026-06-06` NMT and LLM calls, and v3.0 SDK calls in Python, C# and Java
  - the Bookshelf catalog localization row
- [x] Task 11. Create `foundry-tools/document-translation-and-customization.adoc` (§10). Cover:
  - batch document translation (Blob, SAS vs managed identity, glossaries, limits)
  - image/OCR handling
  - synchronous single-document translation
  - Custom Translator and the `category` id
  - adaptive custom translation and containers
  - a Mermaid sequence of batch translation
  - the Bookshelf press-kit row
- [x] Task 12. Create `foundry-tools/language-text-analysis.adoc` (§11, core features). Cover:
  - PII on `2026-05-01`: `syntheticReplacement`, masking, threshold, exclusions, and conversation/document PII
  - prebuilt and custom NER, language detection and Text Analytics for health (FHIR)
  - limits, and the `analyze-text` REST shape with `kind`
  - a Mermaid flowchart of a PII-redaction gateway in front of an LLM, linking
    `ai/security/sensitive-information-and-hidden-context.adoc`
  - the Bookshelf rows for `orders-api` support notes and search entity extraction
- [x] Task 13. Create `foundry-tools/language-conversational-and-legacy-features.adoc` (§12). Cover:
  - a `[WARNING]` end-of-support banner (2029-03-31)
  - per feature, the use case **plus** an LLM-alternative prompt example: sentiment/opinion, key phrases,
    summarization, entity linking (its own 2028-09-01 `[WARNING]`), custom text classification, CLU, orchestration,
    and custom question answering
  - migration notes for LUIS → CLU and QnA Maker → CQA
  - the Language Studio → Foundry portal move (`[WARNING]`, 2027-03-20)
  - the Bookshelf rows for review sentiment and the shipping/returns FAQ bot

### Group 5 — Vision, Face, Document Intelligence and Content Understanding pages

**Parallelizable: yes.** Five independent new files. Task 18 creates the document-processing SVG. Task 16 only
`xref:`s Task 18's page and doesn't embed the image, so the two don't conflict.

- [x] Task 14. Create `foundry-tools/vision-image-analysis-and-ocr.adoc` (§13). Cover:
  - a `[WARNING]` deprecation banner (2028-09-25) with the migration options
  - Image Analysis 4.0 features, limits and regions, and 3.2-only features
  - the Read container, and the OCR choices
  - Custom Vision retirement (`[WARNING]`)
  - code in Python, C#, Java and `curl`
  - the Bookshelf row for cover alt text and smart thumbnails in `stbookshelf`
- [x] Task 15. Create `foundry-tools/face.adoc` (§14). Cover:
  - the operations, including liveness
  - the Limited Access gate, retired and limited attributes, prohibited uses, and limits
  - industry use cases only; a paragraph explains why Bookshelf deliberately doesn't use Face
  - a generic KYC example
  - a Mermaid sequence of a liveness session
- [x] Task 16. Create `foundry-tools/document-intelligence.adoc` (§15). Cover:
  - the v4.0 `2024-11-30` model catalog and add-ons
  - the async `202` + `Operation-Location` pattern, with `curl` polling and SDK pollers in Python, C# and Java
  - limits and formats, and Document Intelligence Studio
  - the v2.1 and v3.0 end-of-support dates
  - the Bookshelf supplier-invoice row (`invoices` container → job → `orders-api`)
  - a Mermaid sequence of async analyze
  - a link to the document-processing figure on `content-understanding.adoc`
- [x] Task 17. Create `foundry-tools/document-intelligence-custom-models-and-rag.adoc` (§16). Cover:
  - custom template vs neural models, composed models, classifiers, and training limits
  - Layout → Markdown, with a Python heading-chunker pushing to `search-bookshelf`
  - containers, the batch API, and the legacy `azure-ai-formrecognizer` package
  - a Mermaid flowchart: classify → split → extract
  - links to `ai/rag-systems/document-parsing.adoc` and `ingestion-pipelines-and-freshness.adoc`
- [x] Task 18. Create `foundry-tools/content-understanding.adoc` (§17). Cover:
  - GA `2025-11-01` vs `2026-06-01-preview`
  - analyzers (`extract`/`classify`/`generate`), prebuilt analyzers, bring-your-own model deployments, and limits
    per modality
  - the relation to Document Intelligence, and Content Understanding Studio
  - code: `curl` analyzer create + analyze, and the Python, C# and Java SDKs
  - the Bookshelf rows for interview video chaptering and contract terms
  - the figure `modules/ROOT/images/azure-foundry-document-processing-choices.svg`

### Group 6 — Safety, search, agents and other services

**Parallelizable: yes.** Four independent new files. Task 22 creates the retirement-timeline SVG. The cheat sheet in
Group 7 reuses only its data, not the file.

- [x] Task 19. Create `foundry-tools/content-safety.adoc` (§18). Cover:
  - text and image analysis, and blocklists
  - Prompt Shields (`text:shieldPrompt`)
  - groundedness detection with correction (preview), protected material, custom categories, multimodal analysis
    and task adherence
  - limits and regions, and Foundry guardrails vs direct calls
  - the Content Moderator `[WARNING]` (2027-03-15)
  - a Mermaid flowchart: input shield → LLM → output checks → user
  - the Bookshelf rows for review moderation and assistant shielding
  - links to the four AI security / RAG pages the issue lists
- [x] Task 20. Create `foundry-tools/ai-search-enrichment-and-agentic-retrieval.adoc` (§19). Cover:
  - skillsets (built-in skills billed through an attached Foundry resource, skills on your own resource, and custom
    Web API skills)
  - integrated vectorization, semantic ranker and hybrid search
  - agentic retrieval (knowledge bases, knowledge sources, GA `2026-04-01` vs preview), Foundry IQ, and tiers
    including serverless
  - the Bookshelf `search-bookshelf` catalog index and support knowledge base
  - Mermaid diagrams: an indexer → skillset → index pipeline, and an agentic retrieval sequence
  - links to `ai-data-and-iot-overview.adoc`, `database/vector-rag/*` and `ai/rag-systems/*`
- [x] Task 21. Create `foundry-tools/foundry-tools-in-agents.adoc` (§20). Cover:
  - the two meanings of "tools": the Toolbox and the Foundry Tools Catalog
  - the Azure Speech MCP server (fields and limitations) and the Azure Language MCP server
  - the Intent Routing and Exact Question Answering templates (`azd ai agent init`)
  - a tool SDK called from a function tool
  - `azure-ai-projects` with the project endpoint
  - the classic-agents `[WARNING]` (2027-03-31)
  - the voicemail support-agent use case
  - links to `ai/mcp/index.adoc` and `ai/agents/tool-design.adoc`
- [x] Task 22. Create `foundry-tools/immersive-reader-video-indexer-and-retired-services.adoc` (§21). Cover:
  - Immersive Reader: the iframe SDK, the Entra token flow, and use cases including Bookshelf sample chapters
  - a short pointer to Video Indexer vs Content Understanding video
  - the **full retirement table** from Task 1.3
  - the figure `modules/ROOT/images/azure-foundry-retirement-timeline.svg` (2025–2029)

### Group 7 — Landing page, end-to-end scenarios and cheat sheet

**Parallelizable: yes.** Three tasks on distinct files. All of them only reference pages finished in Groups 2–6. The
end-to-end page reuses snippets from those pages.

- [x] Task 23. Create `foundry-tools/index.adoc` — *Foundry Tools* (§0).
  - [x] Task 23.1. Explain what Foundry Tools are and the two meanings of "tools", with the old → new name map. State
    that Azure OpenAI is part of Foundry *Models*, not a Foundry Tool.
  - [x] Task 23.2. Add a catalog table (tool, modality, status, typical jobs, page link) and the figure
    `modules/ROOT/images/azure-foundry-tools-catalog-map.svg`.
  - [x] Task 23.3. Add a use-case → tool quick-finder table with one or more rows per tool, a reading path, the
    Bookshelf additions table, and a Mermaid `mindmap` of the sub-section.
  - [x] Task 23.4. Link the section bibliography (`xref:cloud/azure/index.adoc#_bibliography[...]`) and the cheat
    sheet.
- [x] Task 24. Create `foundry-tools/end-to-end-bookshelf-scenarios.adoc` (§22). It has three walk-throughs:
  1. the invoice pipeline
  2. multilingual, safe reviews
  3. the accessible catalog

  Each walk-through has a Mermaid architecture diagram, Bicep/CLI provisioning, managed-identity role assignments,
  and a cost/limits note, and links back to the tool pages it reuses. Add a `== Clean up` section.
- [x] Task 25. Create `foundry-tools/cheat-sheet.adoc` and `modules/ROOT/attachments/azure-foundry-tools-cheat-sheet.pdf`
  (§23).
  - [x] Task 25.1. Write the `.adoc`:
    - `= Foundry Tools Cheat Sheet`, the disclaimer, and an intro listing what the PDF covers
    - grouped back-link paragraphs to all 23 other pages, using the same groups as `index.adoc`
    - closing with `xref:attachment$azure-foundry-tools-cheat-sheet.pdf[Download the Foundry Tools Cheat Sheet (PDF)]`
  - [x] Task 25.2. Write a single A4 HTML/CSS layout **in the scratchpad only**. Style it like `azure-cheat-sheet.pdf`.
    It covers:
    - the catalog and the use-case finder
    - resource kinds, endpoints, auth headers and roles
    - the key CLI commands
    - per tool: the REST path, api-version and Python/.NET package
    - limits highlights
    - the retirement timeline strip
    - the baseline date
  - [x] Task 25.3. Render it with
    `/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --no-sandbox --print-to-pdf=<out> --no-pdf-header-footer <file.html>`.
    Verify with `pypdf` that `len(reader.pages) == 1` and the mediabox is about 595×842 pt. Render a PNG preview with
    `pypdfium2` and inspect it for clipping, iterating until it fits. Copy only the PDF to `modules/ROOT/attachments/`.

### Group 8 — Navigation, parent-section wiring and cross-links

**Parallelizable: yes.** Each task edits a distinct existing file. They only reference pages that exist after
Group 7.

- [x] Task 26. `modules/ROOT/nav.adoc`: insert `**** xref:cloud/azure/foundry-tools/index.adoc[Foundry Tools]` right
  after the *AI, Data and IoT Services Overview* line. Then add the 23 `*****` lines in issue order (§1 → §22, then
  `cheat-sheet.adoc[Cheat Sheet (PDF)]`), with labels matching each page's `= Title`.
- [x] Task 27. `modules/ROOT/pages/cloud/azure/index.adoc`:
  - [x] Task 27.1. Add a `=== Foundry Tools` group to `== What's covered`, after *Operations, governance and beyond*,
    with one bullet per page. Add a `Foundry Tools` branch to the `mindmap`. Extend `:keywords:`.
  - [x] Task 27.2. Add rows to the Bookshelf table for `foundry-bookshelf`, `proj-bookshelf` and `search-bookshelf`,
    and for the Blob containers `media` and `invoices`.
  - [x] Task 27.3. Add rows to *Where related material lives elsewhere* for the AI-area pages listed in the issue's
    Context section.
  - [x] Task 27.4. Add a `*Foundry Tools:*` group to `== Bibliography`, with link-text bullets for every source in
    the issue's *Bibliography additions* section (Platform, Security/operations, Speech, Translator, Language,
    Vision and Face, Document Intelligence, Content Understanding, Content Safety, Azure AI Search, Agents, Other,
    SDK repositories). Use the URLs confirmed in Task 1.4.
- [x] Task 28. `modules/ROOT/pages/cloud/azure/ai-data-and-iot-overview.adoc`:
  - replace the first-step command's `--kind CognitiveServices` with `--kind AIServices` and `foundry-bookshelf`,
    adding `--custom-domain foundry-bookshelf`
  - state that Azure OpenAI is part of Foundry *Models*
  - refresh the retired-services list with the Task 1.3 dates, adding Content Moderator (2027-03-15)
  - add a sentence linking `foundry-tools/index.adoc` and `foundry-tools/ai-search-enrichment-and-agentic-retrieval.adoc`
    in the AI Search paragraph
  - check the rename table for consistency
- [x] Task 29. `modules/ROOT/pages/cloud/azure/cheat-sheet.adoc`: add a `*Foundry Tools* -- ...` back-link paragraph
  linking `foundry-tools/cheat-sheet.adoc` and `foundry-tools/index.adoc`. Leave the PDF unchanged.
- [x] Task 30. Add one-sentence cross-links to AI-area pages, with no content moved:
  - [x] Task 30.1. `ai/voice-agents/speech-to-text.adoc` → `foundry-tools/speech-to-text.adoc`;
    `ai/voice-agents/text-to-speech.adoc` → `foundry-tools/text-to-speech-and-avatars.adoc`;
    `ai/voice-agents/realtime-apis.adoc` → `foundry-tools/voice-live.adoc`.
  - [x] Task 30.2. `ai/rag-systems/document-parsing.adoc` → `document-intelligence.adoc` and
    `content-understanding.adoc`.
  - [x] Task 30.3. `ai/security/guardrails.adoc` → `content-safety.adoc`.

### Group 9 — Build and verify

**Parallelizable: yes** (single task; it depends on every prior group). Delegate the build and the validators to a
sub-agent (`general-purpose`, or `iru-gate-runner` with the `iru-build-docs` skill), so build output doesn't fill the
main context. Have it report only errors, warnings and grep hits.

- [x] Task 31. Verify the sub-section end to end.
  - [x] Task 31.1. `npx antora antora-playbook.yml`. Fix any `xref`, attribute-reference (unescaped `{`) or AsciiDoc
    error/warning introduced by this change.
  - [x] Task 31.2. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid`. Every diagram must parse.
  - [x] Task 31.3. Run the CLAUDE.md image checks (the three greps across `modules` and `build/site`, plus the
    unquoted-comma alt check on every changed `.adoc`). Run the inline-code substitution grep on
    `build/site/cloud/azure/foundry-tools` and on the changed pages' HTML. All must print nothing.
  - [x] Task 31.4. Confirm each of the 5 `azure-foundry-*.svg` files is referenced, and that every `image::` target
    exists. Confirm the PDF is 1 A4 page.
  - [x] Task 31.5. Check that every tool page (§5–§19) has a `Source:` line after each `[source]` block, a use-case
    table, a `== When not to use it` section, Python and C# blocks, and a `curl` block. Script this with a grep loop
    over the pages and fix any gaps. Check that every page includes the disclaimer.
  - [x] Task 31.6. Grep for retired feature names (LUIS, QnA Maker, Anomaly Detector, Personalizer, Metrics Advisor,
    Speaker Recognition, ConversationTranslator) and confirm each hit sits inside a migration note or a retirement
    table, never presented as current.
  - [x] Task 31.7. Run `git status --porcelain`. Only the intended files should appear: no scratch `.html`, no `build/`
    output and no `node_modules` changes.
