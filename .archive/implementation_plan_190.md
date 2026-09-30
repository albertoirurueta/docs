# Implementation Plan: Guides & References / AI — "Building CLIs for AI Agents"

## Task summary

Source: GitHub issue #190
Base branch: feature/213-ai-section

Issue [#190](https://github.com/albertoirurueta/docs/issues/190) adds sub-section 6 of 15 of the AI section,
**Building CLIs for AI Agents**, at `modules/ROOT/pages/ai/cli-for-agents/`. It fills in the placeholder "Building CLIs
(for AI)" and keeps its original notes (Rust **Ratatui** + **Rig**; macOS **SwiftTUI**). It covers designing
command-line tools that humans, scripts and **AI agents** can all drive reliably and cheaply, and that can be wrapped as
MCP servers or agent tools with little effort: CLI design fundamentals (clig.dev, POSIX, GNU, 12-factor), streams and
exit codes, TTY / colour / non-interactive modes, configuration and auth, machine-readable output, agent ergonomics,
safety (dry-run, confirmation, idempotency), self-describing help, CLI vs. MCP, wrapping as MCP servers and agent tools,
security, frameworks for Python / Java / Node / Go / Rust / Swift / .NET, TUIs, packaging, testing, documenting, an
agent-readiness checklist, a bibliography and a one-page cheat sheet PDF.

The sub-section ships:

* 24 pages: `index.adoc` (with `== Bibliography`), 22 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-cli-for-agents-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/ai-cli-for-agents-disclaimer.adoc`
* SVG figures `modules/ROOT/images/ai-cli-for-agents-*.svg` plus Mermaid diagrams (the issue's 📊 items are a floor)
* the nav block (after MCP, before Running LLMs Locally)
* the `ai/index.adoc` "Building CLIs for AI Agents" bullet (currently "(planned)") turned into a real `xref:`, its
  `:keywords:` appended, and the Albada / Lanham book lines re-pointed to this bibliography where they name this
  sub-section
* the root `pages/index.adoc` `:keywords:` appended
* cross-link sentences in the language index pages (Python, Java, JavaScript, TypeScript, Swift, C#),
  `ai/customizing-ai-workflows/permissions-and-settings.adoc` and `ai/mcp/designing-good-mcp-servers.adoc`, plus the
  three stale "planned" mentions of this sub-section in `ai/agents/tool-design.adoc`,
  `ai/mcp/designing-good-mcp-servers.adoc` and `ai/mcp/index.adoc`

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography",
"Section-wide conventions" and "Branching, PR target and merge strategy" sections. Every page task must cover **every**
bullet of its page in the issue body (`gh issue view 190 --json body -q .body`).

**Out of scope** (per the issue): general-purpose CLI tutorials for each language (link the language references
instead), building the MCP servers themselves in depth (that is `ai/mcp/*`), agent frameworks in depth (`ai/langchain/*`,
`ai/spring-ai/*`). Hard-coded benchmark numbers and prices are never quoted; the CLI-vs-MCP token comparisons from
Firecrawl and CircleCI are cited only as vendor claims.

### Merge constraints

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`.
* **Prerequisites: #206 (MCP) and #204 (Customizing AI Workflows)** — both confirmed merged into
  `feature/213-ai-section` (PRs #220 and #217; `ai/mcp/*` and `ai/customizing-ai-workflows/*` present on the base).
  Re-verified in the last group; PR stays a **draft** until then.
* **PR body:** `Refs #190` (not `Closes`) plus the *Merge readiness* block.
* **After merge:** tick #190 in #213's *Progress* checklist and delete `feature/190`.
* **Wave note:** #190 is Wave 4; nothing else depends on it.

### Choices made on the user's behalf

1. **One pass, one PR** — all 24 pages, PDF, SVGs and cross-links (as #202–#207 and #197/#198/#200 did).
2. **Books only in `== Bibliography`** (and the `ai/index.adoc` books list): Albada and Lanham (tool-design principles
   only). PDFs in `~/Desktop/ai` are never opened, copied or committed; concepts are paraphrased and credited.
3. **Disclaimer:** `ai-cli-for-agents-disclaimer.adoc` mirrors `ai-hugging-face-disclaimer.adoc` (single `[IMPORTANT]`
   block; anchor `xref:ai/cli-for-agents/index.adoc#_bibliography[bibliography]`). No other admonition under
   `ai/cli-for-agents/`; version notes, deprecations, security and pricing caveats go in prose or table rows.
4. **Tasks are untagged** — no installed `*-code-one-task` key (`java`, `java-springboot`, `dotnet`, `database`) fits
   AsciiDoc/Mermaid/SVG/PDF authoring; implemented directly. Code in pages is illustrative and must be checked against
   official docs.
5. **Running example `docsctl`** is specified once in Group 1 (a scratchpad "contract" note: subcommands `search`,
   `show`, `list-components`, `validate`, `publish --dry-run`; JSON output shapes, exit-code table, flags, error
   envelope) and reused verbatim by every page so snippets stay consistent. Primary implementations: Python (Typer) and
   Java (picocli → GraalVM native-image); short equivalents in Node (commander), Go (Cobra), Rust (clap + Ratatui + Rig),
   Swift (swift-argument-parser + SwiftTUI) and .NET (System.CommandLine). Wrapped as an MCP server (FastMCP,
   TypeScript SDK, Spring AI `@McpTool`), a LangChain `@tool` and a Spring AI `@Tool`.
6. **Version baseline re-verified and dated at implementation time.** The issue's own versions and API names (Typer,
   picocli, GraalVM, commander, oclif, Cobra, clap, Ratatui, Rig, swift-argument-parser, SwiftTUI, System.CommandLine,
   Spectre.Console, FastMCP, MCP TypeScript SDK, Spring AI `@McpTool`, LangChain `ShellToolMiddleware`, MCP spec
   revision `2026-07-28`) are **claims to confirm, not to copy**. Reuse the AI section's Python / Java / Spring baseline
   from `ai/mcp/index.adoc` (`== Version baseline`) and `ai/langchain/index.adoc`.
7. **Xrefs only to existing pages.** Existing: `ai/llm-foundations/*`, `ai/customizing-ai-workflows/*`, `ai/agents/*`
   (incl. `tool-design.adoc`), `ai/mcp/*`, `ai/local-llms/*`, `ai/hugging-face/*`, `ai/langchain/*`, `ai/spring-ai/*`,
   `git-and-github/*`, `backend/docker/*`, `programming-languages/{python,java,javascript,typescript,swift,csharp,kotlin}/index.adoc`,
   `backend/quarkus/command-mode-and-cli-applications.adoc` (picocli precedent). Not yet built — Rust (#195), PHP (#194),
   RAG Systems, Voice Agents — are plain prose unless a check at implementation time shows they exist. The Rust framework
   page names the Rust section in prose. `ai-catalog::` links only to pages on that repository's `main`.
8. **Verify every `xref:` target exists** (`ls`) before writing it.
9. **CLI-vs-MCP neutrality:** the page presents trade-offs (context cost, discoverability, typing, auth, governance,
   host support) and the `gh` + GitHub MCP server case; vendor token comparisons labelled as vendor claims; the
   secrets-in-env-vars disagreement (clig.dev vs. agent-CLI posts) presented as a trade-off, not a verdict.

### Lessons from earlier reviews — mandatory for every page task

* **Verify every name against its official page**: flags, env vars, API names, package names/versions, annotations
  (`@McpTool`, `IExitCodeGenerator`, `ManPageGenerator`, `clap_complete`, …). If docs don't confirm a detail, describe
  the behaviour without naming it. `sysexits` is deprecated on FreeBSD — vocabulary only.
* **Security is correctness.** No hardcoded secrets (use `$DOCSCTL_TOKEN` placeholders); argv arrays, never shell strings;
  `--` before user operands; servers/wrappers state their trust boundary in prose.
* **Every concept has an example**, followed by a link to its official page (also in `== References`).
* **URL hygiene:** canonical URLs, one URL per source reused consistently.
* **AsciiDoc hygiene:** `.Title` captions; no leaked notes; `{placeholders}` literal in `[source]`; no prose line
  starting `<digits>.`; no `xref:` in backticks; no empty fragment-xref text; `:stem: latexmath` on MathJax pages.
* **Consistency:** hosted model names match `ai/llm-foundations/*`; MCP terminology matches `ai/mcp/*`.

## Current code state

**Base branch.** `feature/213-ai-section` (HEAD `ec4083dc`, includes #202–#207, #197, #198, #200). `feature/190` was
forked from it. No `modules/ROOT/pages/ai/cli-for-agents/` directory yet; no `ai-cli-for-agents-*` partial, image or PDF.

**`modules/ROOT/nav.adoc`.** The `ai/mcp` sub-block ends with `**** xref:ai/mcp/cheat-sheet.adoc[Cheat Sheet (PDF)]`,
followed by `*** xref:ai/local-llms/index.adoc[Running LLMs Locally]`. The new
`*** xref:ai/cli-for-agents/index.adoc[Building CLIs for AI Agents]` block (22 `****` children in outline order + Cheat
Sheet (PDF)) goes between them. Match on text, not line numbers.

**`modules/ROOT/pages/ai/index.adoc`.** `== Sub-sections` has
`* Building CLIs for AI Agents -- designing command-line tools that agents can drive reliably. (planned)` (~line 59) →
real `xref:` bullet with a fuller summary. The books section names Albada and Lanham; re-point to
`xref:ai/cli-for-agents/index.adoc#_bibliography[…]` where they name this sub-section. `:keywords:` gets new terms
appended (one very long line; skip duplicates).

**Stale "planned" mentions to turn into real xrefs:** `ai/agents/tool-design.adoc` (~line 536),
`ai/mcp/designing-good-mcp-servers.adoc` (~line 21, "issue #190 … not part of this site yet"), `ai/mcp/index.adoc`
(~line 214). Find any others with
`grep -rn "Building CLIs\|planned.*CLI" modules/ROOT/pages/ai`.

**Cross-link targets (confirmed present):** `programming-languages/{python,java,javascript,typescript,swift,csharp}/index.adoc`
(each has `== What's covered` and `== Bibliography`; add the link in/after "What's covered", not the bibliography),
`ai/customizing-ai-workflows/permissions-and-settings.adoc`, `ai/mcp/designing-good-mcp-servers.adoc`,
`git-and-github/index.adoc`, `backend/docker/*`.

**Shapes to mirror:** `ai/mcp/*.adoc` and `ai/hugging-face/*.adoc` (header, dated lead paragraph, `==` sections,
`== References`; landing page with `== What's covered`, `== Version baseline` and grouped `== Bibliography`;
`cheat-sheet.adoc` with grouped back-links and the `xref:attachment$…pdf` line). Precedents:
`.archive/implementation_plan_200.md` (closest, latest), `_206`, `_207`, `_198`, `_197`.

**Tooling:** `npx antora antora-playbook.yml` (build gate); `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`);
headless Chromium + PyMuPDF (`fitz`) for the one-A4-page PDF; the `iru-gate-runner` agent for build/validation;
`detect-secrets` via `iru-check-security` (do not commit `.secrets.baseline` unless the user approves).

## Conventions every page task must follow

* **Header:** `= Title`, `:description:`, `:keywords:`, (`:stem: latexmath` if formulas), blank line,
  `include::partial$ai-cli-for-agents-disclaimer.adoc[]`.
* **Lead paragraph** states the versions the page was written against, dated.
* **Coverage:** every bullet of the page's outline in the issue body and its 📊 floor.
  * SVGs: `modules/ROOT/images/ai-cli-for-agents-<topic>.svg`; `viewBox`, `font-family="Helvetica, Arial, sans-serif"`,
    flat light background, dark hex colours, no CSS variables, legible in light and dark (mirror `ai-mcp-*.svg`).
  * Mermaid blocks must pass `npm run validate:mermaid`.
* **Examples** use the `docsctl` contract from Task 1.4, against current official docs; where a book's code is outdated,
  say so in prose and show the current API.
* **Ending:** `== References` (official docs, specs, papers only — never books).
* **Math:** MathJax where it makes a concept precise (token-budget estimate on `agent-ergonomics.adoc`).

## Implementation steps

### Group 1 — Scaffolding and the `docsctl` contract

**Parallelizable: yes** (single task).

- [x] Task 1. Create the disclaimer partial and record the version baseline and the `docsctl` contract
  - [x] Task 1.1. Create `modules/ROOT/partials/ai-cli-for-agents-disclaimer.adoc` copying
    `partials/ai-hugging-face-disclaimer.adoc`'s shape exactly; change only the anchor to
    `xref:ai/cli-for-agents/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Every page in the sub-section uses `include::partial$ai-cli-for-agents-disclaimer.adoc[]` and no other
    admonition.
  - [x] Task 1.3. Re-verify and record (scratchpad `cli-version-baseline.md`, not committed) the version baseline and
    check date for every framework, runtime, spec revision and tool named in choice 6, so page tasks reuse one
    consistent set.
  - [x] Task 1.4. Write the `docsctl` contract (scratchpad `docsctl-contract.md`, not committed): subcommands and
    flags, `--json` / `--format json|jsonl|text` output shapes with `schemaVersion`, the error envelope, the exit-code
    table (success, usage, validation, auth, confirmation-required, retryable, plus 126/127/128+N notes), config keys and
    precedence, env var names (`DOCSCTL_*`), the `schema --json` command-tree shape and the safety metadata that the MCP
    wrapper maps to annotations.
  - Files: `modules/ROOT/partials/ai-cli-for-agents-disclaimer.adoc` (new); notes in scratchpad (`cli-version-baseline.md`, `docsctl-contract.md`). No tests apply.
  - Done: partial created (only the anchor differs from the Hugging Face one); baseline and contract recorded 2026-09-30.

### Group 2 — Fundamentals

**Parallelizable: yes.** Four independent pages (Tasks 2–5) under `modules/ROOT/pages/ai/cli-for-agents/`.

- [x] Task 2. Create `cli-design-fundamentals.adoc` ("CLI Design Fundamentals")
  - [x] Task 2.1. The clig.dev principles; POSIX utility syntax guidelines (options, grouping, `--`, `-` for stdin); GNU
    long options, `--help` and `--version`; 12-factor CLI apps.
  - [x] Task 2.2. Subcommand design and naming; flags vs. positional args; consistency across commands; no ambiguous
    prefix matching. Examples on `docsctl`; link `xref:git-and-github/index.adoc[]` for `git` / `gh` conventions.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/cli-design-fundamentals.adoc` (new).
  - Done 2026-09-30: page written; Antora build clean apart from the expected `#_bibliography` xref (index.adoc arrives in Group 7). No Mermaid.
- [x] Task 3. Create `streams-and-exit-codes.adoc` ("Streams & Exit Codes")
  - [x] Task 3.1. stdout for data, stderr for messages; piping and composition; crash-only design.
  - [x] Task 3.2. The exit-code taxonomy table (sysexits as vocabulary only, 126 / 127 / 128+N, custom codes); signals and
    128+N. Examples in shell + one language.
  - [x] Task 3.3. 📊 SVG `ai-cli-for-agents-streams.svg` (stdout / stderr / exit code flows for human, script, agent).
  - Files: `modules/ROOT/pages/ai/cli-for-agents/streams-and-exit-codes.adoc`,
    `modules/ROOT/images/ai-cli-for-agents-streams.svg` (new).
  - Done 2026-09-30: page and SVG written (SVG rendered in headless Chrome and checked); build clean apart from the expected `#_bibliography` xref. Note: the contract error-envelope example shows `exitCode` 77 but its exit-code table says AUTH = 7; the page uses 7.
- [x] Task 4. Create `tty-colour-and-interactivity.adoc` ("TTY, Colour & Interactivity")
  - [x] Task 4.1. `isatty`; `NO_COLOR` / `TERM=dumb` / `--no-color`; prompting only on a TTY; `--no-input` / `--yes`
    (fail fast, naming the bypass flag); progress bars and spinners only on a TTY; Windows console notes.
  - [x] Task 4.2. Examples in Python and Java; verify each API name.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/tty-colour-and-interactivity.adoc` (new).
  - Done 2026-09-30: page written (Python Typer/Rich, Java picocli/System.console; API names checked against official docs); build clean apart from the expected xref.
- [x] Task 5. Create `configuration-and-auth.adoc` ("Configuration & Auth")
  - [x] Task 5.1. Config precedence (flags > env > project > user (XDG) > system); XDG base directories and the macOS /
    Windows equivalents; project config files; `.env`.
  - [x] Task 5.2. Token files, keychains and env vars — present the clig.dev vs. agent-CLI-posts disagreement as a
    trade-off; headless auth (no browser flow required; `$DOCSCTL_TOKEN` placeholder only).
  - Files: `modules/ROOT/pages/ai/cli-for-agents/configuration-and-auth.adoc` (new).
  - Done 2026-09-30: page written; build clean apart from the expected xref.

### Group 3 — Designing for agents

**Parallelizable: yes.** Five independent pages (Tasks 6–10). They may reference Group 2 pages (existing by now).

- [x] Task 6. Create `machine-readable-output.adoc` ("Machine-Readable Output")
  - [x] Task 6.1. `--json` / JSON Lines / `--format`; field projection (`--fields`, `--jq`); deterministic ordering;
    `schemaVersion` and additive-only evolution; publishing JSON Schemas for outputs.
  - [x] Task 6.2. Examples modelled on `gh` (`--json fields`, `--jq`, `--template`), then `docsctl search --json`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/machine-readable-output.adoc` (new).
  - Done 2026-09-30: page written; Antora build clean apart from the expected `#_bibliography` xref.
- [x] Task 7. Create `agent-ergonomics.adoc` ("Agent Ergonomics")
  - [x] Task 7.1. Token budgets (Claude Code caps a tool response at 25k tokens by default — verify); concise vs. detailed
    modes; pagination and limits with small defaults (`--limit` / `--cursor`); truncation markers; semantic IDs; errors with
    remediation ("run `docsctl login`"); timeouts; fast startup (why native images matter, link `frameworks-java.adoc`
    forward as prose until Group 4 lands, then xref).
  - [x] Task 7.2. Before/after token count as a MathJax estimate or a measured table (`:stem: latexmath`); no vendor
    numbers.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/agent-ergonomics.adoc` (new). Link `xref:ai/agents/tool-design.adoc[]`.
  - Done 2026-09-30: page written; Antora build clean apart from the expected `#_bibliography` xref.
- [x] Task 8. Create `safety-and-idempotency.adoc` ("Safety & Idempotency")
  - [x] Task 8.1. `--dry-run` plans (JSON plan); the confirmation-envelope pattern with its exit code and the exact command
    to confirm; `--force`; idempotent create-or-update; read-only defaults; undo / rollback hints.
  - [x] Task 8.2. 📊 Mermaid of the dry-run → confirm → apply flow; examples on `docsctl publish`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/safety-and-idempotency.adoc` (new).
  - Done 2026-09-30: page written; Antora build clean apart from the expected `#_bibliography` xref. Mermaid validated.
- [x] Task 9. Create `self-describing-help.adoc` ("Self-Describing Help")
  - [x] Task 9.1. `--help` written for LLMs (examples first, every flag explained); a machine-readable command tree
    (`docsctl schema --json`); shell completion; man pages.
  - [x] Task 9.2. Shipping an **agent skill** alongside the CLI — link `xref:ai/customizing-ai-workflows/skills.adoc[]`
    and `writing-effective-skills.adoc` (confirm names).
  - Files: `modules/ROOT/pages/ai/cli-for-agents/self-describing-help.adoc` (new).
  - Done 2026-09-30: page written; Antora build clean apart from the expected `#_bibliography` xref.
- [x] Task 10. Create `cli-vs-mcp.adoc` ("CLI vs. MCP")
  - [x] Task 10.1. Trade-offs table (context cost, discoverability, typing, auth, governance, host support); when to ship
    both (the `gh` + GitHub MCP server case study); code execution over tools (Anthropic *Code execution with MCP*).
  - [x] Task 10.2. Vendor claims (Firecrawl, CircleCI token comparisons) cited **as vendor claims**, no numbers restated.
    Links: `xref:ai/mcp/index.adoc[]`, `ai/mcp/designing-good-mcp-servers.adoc`, `ai/agents/tool-design.adoc`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/cli-vs-mcp.adoc` (new).
  - Done 2026-09-30: page written; Antora build clean apart from the expected `#_bibliography` xref.

### Group 4 — Frameworks by language

**Parallelizable: yes.** Six independent pages (Tasks 11–16).

- [x] Task 11. Create `frameworks-python.adoc` ("Python CLI Frameworks")
  - [x] Task 11.1. argparse, Click, **Typer** (primary `docsctl` example), Rich and Textual; `CliRunner` testing; Rich
    output only on a TTY.
  - [x] Task 11.2. Link `xref:programming-languages/python/index.adoc[]`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/frameworks-python.adoc` (new).
- [x] Task 12. Create `frameworks-java.adoc` ("Java CLI Frameworks")
  - [x] Task 12.1. **picocli** (exit codes, `IExitCodeGenerator`, `picocli-codegen` for **GraalVM native-image**,
    `ManPageGenerator`, `AutoComplete`); Spring Shell; JLine.
  - [x] Task 12.2. Startup time JVM vs. native as a table (no invented numbers — qualitative or measured with the command
    shown); link `xref:programming-languages/java/index.adoc[]` and
    `xref:backend/quarkus/command-mode-and-cli-applications.adoc[]`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/frameworks-java.adoc` (new).
- [x] Task 13. Create `frameworks-node.adoc` ("Node.js CLI Frameworks")
  - [x] Task 13.1. commander (`docsctl` short version), yargs, **oclif**, Ink; the `bin` field; ESM vs. CJS notes.
  - [x] Task 13.2. Link the JavaScript and TypeScript language indexes.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/frameworks-node.adoc` (new).
- [x] Task 14. Create `frameworks-go-and-rust.adoc` ("Go & Rust CLI Frameworks")
  - [x] Task 14.1. Go: **Cobra** (doc generation), Bubble Tea. Rust: **clap** (`clap_complete`, `clap_mangen`),
    **Ratatui** for TUIs, **Rig** for LLM agents with typed tools and MCP support (from the #190 placeholder).
  - [x] Task 14.2. Rust section (#195) referenced in prose unless it exists at implementation time.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/frameworks-go-and-rust.adoc` (new).
- [x] Task 15. Create `frameworks-swift-and-dotnet.adoc` ("Swift & .NET CLI Frameworks")
  - [x] Task 15.1. Swift: **swift-argument-parser**, **SwiftTUI** (from the placeholder). .NET: **System.CommandLine**,
    Spectre.Console / Spectre.Console.Cli, global tools.
  - [x] Task 15.2. Link the Swift and C# language indexes.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/frameworks-swift-and-dotnet.adoc` (new).
- [x] Task 16. Create `tuis-vs-clis.adoc` ("TUIs vs. CLIs")
  - [x] Task 16.1. When a TUI helps humans and why agents still need a non-interactive mode; comparison of Ratatui,
    Textual, Bubble Tea, Ink, SwiftTUI and Spectre (table).
  - Files: `modules/ROOT/pages/ai/cli-for-agents/tuis-vs-clis.adoc` (new). Link the framework pages from Tasks 11–15.

- Done 2026-09-30 (Group 4): six pages written; Python/Java/Node/Swift snippets were run locally (Go, Rust, .NET and native-image not installed, pages say so); Antora build clean apart from the expected `#_bibliography` xref; `npm run validate:mermaid` passes (no new diagrams). Follow-up xrefs added in agent-ergonomics, cli-design-fundamentals, self-describing-help and tty-colour-and-interactivity.

### Group 5 — Integration

**Parallelizable: yes.** Three independent pages (Tasks 17–19); they link the Group 3–4 pages.

- [x] Task 17. Create `wrapping-as-an-mcp-server.adoc` ("Wrapping a CLI as an MCP Server")
  - [x] Task 17.1. Mapping subcommands → tools; the JSON schema from the command tree → `inputSchema` / `outputSchema`;
    exit code → `isError`; JSON stdout → `structuredContent`; annotations from the CLI's safety metadata.
  - [x] Task 17.2. Implementations: Python (FastMCP, `subprocess.run([...], shell=False, timeout=…)`), TypeScript
    (`registerTool` + `execFile`) and Spring AI (`@McpTool` + `ProcessBuilder` with an argv list and `waitFor(timeout)`).
    Verify every API name against the MCP docs; link `xref:ai/mcp/python-servers.adoc[]`, `nodejs-servers.adoc`,
    `spring-boot-servers.adoc`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/wrapping-as-an-mcp-server.adoc` (new).
  - Done 2026-09-30: page written; Python (fastmcp 4.0.10) and TypeScript (@modelcontextprotocol/server 2.2.0) servers run in memory against a stub docsctl, TS type-checked, Spring AI class compiled and called directly (not run under Spring); Antora clean apart from the expected `#_bibliography` xref; Mermaid validated.
- [x] Task 18. Create `wrapping-as-an-agent-tool.adoc` ("Wrapping a CLI as an Agent Tool")
  - [x] Task 18.1. A LangChain `@tool` per subcommand vs. the generic `ShellTool` / `ShellToolMiddleware` (why narrow tools
    win); Spring AI `@Tool`; LangChain4j `@Tool`.
  - [x] Task 18.2. Using the CLI directly from Claude Code (allowlisting `Bash(docsctl *)`) and Copilot agent mode; links
    `xref:ai/customizing-ai-workflows/permissions-and-settings.adoc[]`, `ai/langchain/*`, `ai/spring-ai/tool-calling.adoc`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/wrapping-as-an-agent-tool.adoc` (new).
  - Done 2026-09-30: page written; LangChain tools invoked directly and ShellToolMiddleware/HumanInTheLoopMiddleware constructed, Spring AI `@Tool` and LangChain4j `@Tool` classes compiled; no live model; Antora clean apart from the expected xref.
- [x] Task 19. Create `security.adoc` ("Security")
  - [x] Task 19.1. Command and argument injection (CWE-88, OWASP OS Command Injection cheat sheet); argv discipline; the `--`
    separator; allowlisted subcommands and flags; rejecting values that start with `-`; absolute binary paths; minimal
    environment; input validation.
  - [x] Task 19.2. Least-privilege credentials; sandboxing (containers, the Claude Code sandbox); output-size caps and output
    sanitisation; supply-chain signing of releases; the MCP "local server compromise" guidance. Vulnerable-vs-safe code pairs.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/security.adoc` (new). Link `xref:ai/mcp/security.adoc[]`.
  - Done 2026-09-30: page written; bounded-read/process-group/sanitise helper run against stubs; Antora clean apart from the expected xref; Mermaid validated. Prose-only mentions in Group 2-4 pages converted to xrefs.

### Group 6 — Shipping

**Parallelizable: yes.** Four independent pages (Tasks 20–23).

- [x] Task 20. Create `packaging-and-distribution.adoc` ("Packaging & Distribution")
  - [x] Task 20.1. pipx / `uv tool`; Homebrew formulae; npm `bin`; JBang; GraalVM native binaries; `cargo install`; winget;
    `dotnet tool`; GoReleaser; container images (link `xref:backend/docker/index.adoc[]`); signing and checksums.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/packaging-and-distribution.adoc` (new).
  - Done 2026-09-30: page written (channels table, Mermaid pipeline, signing/checksums, Docker link); every tool checked against official docs; winget installer type and JBang shebang deliberately not named beyond the docs. Build clean apart from the expected `#_bibliography` xref; Mermaid valid.
- [x] Task 21. Create `testing-clis.adoc` ("Testing CLIs")
  - [x] Task 21.1. Snapshot / golden tests of `--json` output as the contract; "never prompts without a TTY" tests;
    exit-code tests; `--help` snapshots; bats-core; `CliRunner`; picocli `setOut` / `setErr`; trycmd / insta; testscript;
    hyperfine.
  - [x] Task 21.2. **Agent evals**: the LLM performs tasks with the CLI; link `xref:ai/agents/agent-evaluation.adoc[]`.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/testing-clis.adoc` (new).
  - Done 2026-09-30: page written (golden/no-TTY/exit-code/help tests, bats-core, CliRunner, picocli, trycmd/insta, testscript, hyperfine, agent evals with xref to agent-evaluation); snippets not run. Build clean apart from the expected xref; Mermaid valid.
- [x] Task 22. Create `documenting-clis.adoc` ("Documenting CLIs")
  - [x] Task 22.1. Generating man pages and reference docs from the command tree (picocli, `clap_mangen`, Cobra doc, the
    Asciidoctor manpage backend for this Antora site); keeping help, docs and MCP schemas in sync from one source.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/documenting-clis.adoc` (new).
  - Done 2026-09-30: page written (single-source pipeline Mermaid, generators table, Asciidoctor manpage backend, schema-driven reference generator). Build clean apart from the expected xref; Mermaid valid.
- [x] Task 23. Create `agent-readiness-checklist.adoc` ("Agent-Readiness Checklist")
  - [x] Task 23.1. One-page checklist grouped Output / Interactivity / Safety / Errors / Streams / Timeouts / Discoverability /
    Auth / Config precedence, each item linking its concept page; blogs (Arcjet, Speakeasy) cited as engineering blogs.
  - Files: `modules/ROOT/pages/ai/cli-for-agents/agent-readiness-checklist.adoc` (new).
  - Done 2026-09-30: page written (9 groups plus "Around the tool", each item linked; Arcjet/Speakeasy cited as engineering blogs). Build clean apart from the expected xref. Follow-up xrefs added in python, java, node, go-and-rust, swift-and-dotnet, security, self-describing-help and wrapping-as-an-mcp-server pages.

### Group 7 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Each task edits a distinct file and references only pages from Groups 1–6. The PDF (Task 26)
reads the finished pages, so it runs after Tasks 24–25 inside this group's ordering.

- [x] Task 24. Create `ai/cli-for-agents/index.adoc` ("Building CLIs for AI Agents")
  - [x] Task 24.1. Header, disclaimer, dated version baseline (`== Version baseline`); why CLIs work well with agents; the
    three audiences (humans, scripts, agents); the reading map; the `docsctl` running example.
  - [x] Task 24.2. 📊 Mermaid of human / script / agent → CLI → service.
  - [x] Task 24.3. `== What's covered`, grouped like the nav, each an `xref:` with a one-line summary.
  - [x] Task 24.4. `== Bibliography` built after reading every sibling page's `== References`, grouped per the issue:
    requester-provided books (Albada; Lanham — full bibliographic data, publisher page, companion code repo where one
    exists) / official documentation / specifications and standards / papers and engineering articles (engineering blogs
    labelled as such); closing with the house note that books are consulted references only.
  - [x] Task 24.5. URL audit: every URL cited on any page appears in `== Bibliography`; 0 duplicates; 0 non-canonical URLs.
  - Done 2026-09-30: `ai/cli-for-agents/index.adoc` written (why CLIs suit agents, audiences table + Mermaid, reading map, docsctl example, dated version baseline, grouped What's covered, 141-URL bibliography with Albada/Lanham); URL audit: 141 unique bibliography URLs, 0 duplicates, 0 missing, 0 non-canonical (example/placeholder hosts excluded).
- [x] Task 25. Create `cheat-sheet.adoc` ("Building CLIs for AI Agents Cheat Sheet")
  - [x] Task 25.1. What the sheet covers; grouped xrefs to every page;
    `xref:attachment$ai-cli-for-agents-cheat-sheet.pdf[Download the Building CLIs for AI Agents Cheat Sheet (PDF)]`; own
    `== References`.
  - Done 2026-09-30: `cheat-sheet.adoc` written (coverage list, grouped xrefs to all 23 pages, PDF link, References reusing bibliography URLs).
- [x] Task 26. Produce `modules/ROOT/attachments/ai-cli-for-agents-cheat-sheet.pdf`
  - [x] Task 26.1. Print-ready HTML/CSS in the scratchpad (dense multi-column, colour-coded, version/date header, breadcrumb
    footer), consistent with `ai-mcp-cheat-sheet.pdf` and `vector-rag-cheat-sheet.pdf`; only the PDF is checked in.
  - [x] Task 26.2. Content per the issue: design rules, exit-code table, streams rule, TTY / colour rules, config precedence,
    JSON output contract, agent-ergonomics rules, safety pattern, CLI vs. MCP, wrapping snippets (Python / TS / Spring),
    injection-defence rules, frameworks-per-language table, packaging table, testing checklist.
  - [x] Task 26.3. Render via headless Chrome; verify with `fitz` that it is **exactly one A4 page**.
  - Done 2026-09-30: HTML/CSS in scratchpad `cheatsheet-190/`, headless Chrome; PDF is exactly 1 A4 page (595x842 pt), 339 KB.
- [x] Task 27. Insert the nav block into `modules/ROOT/nav.adoc` between the `ai/mcp` block (after its Cheat Sheet line) and
  `*** xref:ai/local-llms/index.adoc[Running LLMs Locally]`: index + 22 concept children in outline order + Cheat Sheet (PDF).
  - Done 2026-09-30: nav block (index + 22 children + Cheat Sheet) inserted between the MCP block and Running LLMs Locally.
- [x] Task 28. Edit `modules/ROOT/pages/ai/index.adoc`
  - [x] Task 28.1. Replace the "(planned)" bullet with an `xref:` bullet in place, with a fuller summary.
  - [x] Task 28.2. Point Albada / Lanham lines at `xref:ai/cli-for-agents/index.adoc#_bibliography[…]` (non-empty link text)
    where they name this sub-section; remove "planned" wording.
  - [x] Task 28.3. Append new terms to `:keywords:` (skip duplicates): CLI, command-line interface, docsctl, clig.dev, POSIX,
    NO_COLOR, exit codes, sysexits, dry-run, Typer, picocli, GraalVM native-image, Cobra, clap, Ratatui, Rig, SwiftTUI,
    System.CommandLine, oclif, agent-friendly CLI, CLI vs MCP, argument injection, …
  - Done 2026-09-30: bullet now an xref with fuller summary; Albada/Lanham lines cite the new bibliography; 59 keywords appended.
- [x] Task 29. Edit root `modules/ROOT/pages/index.adoc`: append genuinely new `:keywords:`, skipping duplicates.
  - Done 2026-09-30: 59 new keywords appended to root `:keywords:` (duplicates skipped).
- [x] Task 30. Add cross-links in existing pages
  - [x] Task 30.1. Language indexes — `programming-languages/python`, `java`, `javascript`, `typescript`, `swift`, `csharp`
    `index.adoc`: one sentence (near "What's covered", not in the bibliography) linking the matching `frameworks-*.adoc`
    page.
  - [x] Task 30.2. `ai/customizing-ai-workflows/permissions-and-settings.adoc` and `ai/mcp/designing-good-mcp-servers.adoc`:
    link `xref:ai/cli-for-agents/index.adoc[]`.
  - [x] Task 30.3. Replace the stale "planned" mentions (`ai/agents/tool-design.adoc`, `ai/mcp/designing-good-mcp-servers.adoc`,
    `ai/mcp/index.adoc`, any others from `grep -rn "Building CLIs\|planned.*CLI" modules/ROOT/pages/ai`) with real `xref:`s.
  - Done 2026-09-30: six language indexes, permissions-and-settings, designing-good-mcp-servers, tool-design and mcp/index updated; no remaining "planned" mention of this sub-section. Group 7 validation: Antora build 0 errors / 0 warnings, `npm run validate:mermaid` 678 diagrams OK.

### Group 8 — Build and verify

**Parallelizable: yes** (single task, after Group 7).

- [x] Task 31. Build and verify
  - [x] Task 31.1. `npx antora antora-playbook.yml` on a clean `build/` via an `iru-gate-runner` sub-agent: exit 0, **0 errors and
    0 warnings** introduced by this sub-section.
  - [x] Task 31.2. `npm run validate:mermaid` via a sub-agent; all diagrams parse.
  - [x] Task 31.3. Reachability: all 22 concept pages + `cheat-sheet.adoc` are `xref:`-linked from `ai/cli-for-agents/index.adoc`
    and `nav.adoc`; `build/site/ai/cli-for-agents/` has 24 HTML files; every `ai-cli-for-agents-*.svg` is in
    `build/site/_images/`; the PDF is 1 A4 page.
  - [x] Task 31.4. Grep checks: disclaimer include in all 24 files and no other admonition under `ai/cli-for-agents/`; book
    surnames only on the index; every content page has `:description:`, `:keywords:`, dated versions, `== References` and a
    code example; no role-captions; no `xref:` in backticks; no empty-text fragment xrefs; no `xref:` to a missing page; no
    existing page still calling this sub-section "planned"; no hardcoded secrets (`ghp_`, `sk-`, real tokens); no quoted
    benchmark numbers/prices; no book PDF in the diff.
  - [x] Task 31.5. **Self-review pass** with fresh `general-purpose` sub-agents (pages in parallel batches): verify every flag,
    env var, API name, annotation, package and URL against official docs; fix every real finding; rebuild; record the
    findings count.
  - [x] Task 31.6. Re-check the PDF matches the pages after fixes; re-render if needed; re-run the Task 24.5 URL audit.
  - Done 2026-09-30 (Group 8): clean Antora build (exit 0, 0 errors, 0 warnings, 24 HTML files, 1 SVG, PDF 1 A4 page 339 KB); `npm run validate:mermaid` 678 diagrams OK; grep checks pass (added code examples to cli-vs-mcp, tuis-vs-clis, agent-readiness-checklist); self-review by 6 sub-agents: 14 findings, all fixed except 2 cosmetic notes resolved afterwards (GoReleaser URLs, index draft label) so 0 left; PDF unaffected (no summarised content changed), not re-rendered; URL audit: 143 bibliography URLs, 0 missing, 0 duplicates, 0 non-canonical.

### Group 9 — Integration-branch verification

**Parallelizable: yes** (single task; sub-tasks in order, after Group 8).

- [x] Task 32. Verify against the integration branch and compute merge readiness
  - [x] Task 32.1. Commit on `feature/190` (trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`); do not push here
    and do not commit `build/` or `implementation_plan.md` leftovers (`.secrets.baseline` only if the user approves). `git fetch
    origin`, merge the latest `origin/feature/213-ai-section`; expected conflict points: the `ai/index.adoc` sections and
    `:keywords:`, the nav AI block, root `:keywords:`. Keep every sibling's entries in the fixed order; else record "already up
    to date".
    - Committed as aca61b63 (40 files); merge of origin/feature/213-ai-section: already up to date.
  - [x] Task 32.2. Re-run the Antora build and `npm run validate:mermaid` on the merged result via `iru-gate-runner`; both clean.
  - [x] Task 32.3. Confirm prerequisites **#206** and **#204** are merged into `feature/213-ai-section` (`gh pr list --base
    feature/213-ai-section --state merged --json number,headRefName,title`).
  - [x] Task 32.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-190.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #206 <✅ merged / ⏳ not merged yet>, #204 <✅ merged / ⏳ not merged yet>
    - Antora build + Mermaid validation on the merged result: <✅ passed / ❌ failed>
    - Status: <✅ READY | ⏳ WAIT: keep as draft until prerequisites are merged, then re-merge and rebuild>
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213
    ```
    Note the post-merge chores: tick #190 in #213's *Progress* checklist and delete `feature/190`.
