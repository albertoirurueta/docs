# Implementation Plan: Guides & References / AI — "AI-Assisted Development"

## Task summary

Source: GitHub issue #203
Base branch: feature/213-ai-section

Issue [#203](https://github.com/albertoirurueta/docs/issues/203) adds sub-section 2 of 15 of the AI section,
**AI-Assisted Development**, at `modules/ROOT/pages/ai/ai-assisted-development/`. It is a practical guide to developing
software with **GitHub Copilot** (VS Code, JetBrains, github.com, Copilot CLI) and **Claude Code** (CLI, IDE extensions,
desktop, web). It runs from basic completions and chat, through agent mode and plan-first workflows, to cloud and
background agents, parallel worktree sessions, headless CI runs, and team practices. It also covers choosing models
inside each tool.

It ships:

* 17 concept pages
* `index.adoc` with `== Bibliography`
* `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-ai-assisted-development-cheat-sheet.pdf`
* the partial `partials/ai-ai-assisted-development-disclaimer.adoc`
* the nav block, the `ai/index.adoc` bullet, and one cross-link in `git-and-github/pull-requests.adoc`

The issue body is the binding spec. Its "Page outline", "Cross-links to add in existing pages", "Bibliography" and
"Branching, PR target and merge strategy" sections apply. Every page task must read its page's bullet list in
`gh issue view 203` and cover **every** bullet.

Out of scope, per the issue:

* **Authoring customisations** (instructions, prompt files, skills, agents, hooks, plugins): Customizing AI Workflows.
* **Building MCP servers:** the MCP sub-section.
* **Local / BYOK models:** Running LLMs Locally.
* **Prices:** never hard-coded; link only.

### Merge constraints (from #203 → "Branching, PR target and merge strategy")

**Target and merge path.** The PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main`
only through collector issue #213's final integration PR.

**Prerequisite.** #202 must be merged into `feature/213-ai-section`. It **already is**: PR #215, merge commit
`95e1aa5c`. So this PR can be marked ready and merged into `feature/213-ai-section` once it has passed human review
and the Antora build plus Mermaid validation pass on `feature/203` merged with the latest
`origin/feature/213-ai-section`.

**PR body.** It uses `Refs #203` and carries the *Merge readiness* block (see Group 7).

**After the merge.** Tick #203 in #213's *Progress* checklist and delete `feature/203`.

### Choices made on the user's behalf

1. **Ship everything in one pass.** All 17 pages, the index, the cheat sheet, the PDF and the cross-link go in, as
   #202 did.
2. **Books are named only in `== Bibliography`.** The requester-provided books are Taulli, *AI-Assisted Programming*;
   Osmani, *Beyond Vibe Coding*; and Huyen, *AI Engineering*.
   * They appear **only** in `ai/ai-assisted-development/index.adoc` → `== Bibliography`.
   * They are consulted for concepts only, and are **never** the source of an example.
   * Where they are outdated, say "an older approach was X; today Y" in prose with no book reference. Examples:
     Taulli's `gh copilot` → Copilot CLI, CodeWhisperer → Amazon Q Developer, Duet AI → Gemini Code Assist;
     Osmani's "coding agent" → **Copilot cloud agent**.
   * The PDFs in `~/Desktop/ai` are never opened, copied or quoted.
3. **Disclaimer.** `partials/ai-ai-assisted-development-disclaimer.adoc` copies the shape of
   `partials/ai-llm-foundations-disclaimer.adoc`, with the anchor
   `xref:ai/ai-assisted-development/index.adoc#_bibliography[bibliography]`. No other admonition may appear under
   `ai/ai-assisted-development/`.
4. **Tasks are untagged; no language key applies.** They author AsciiDoc, SVG and PDF only. Prompts, CLI commands,
   config snippets and diffs are page content, not repository source.
5. **Side-by-side tool examples use consecutive titled blocks, not tabs.** The playbook has no tabs extension, only
   lunr, mermaid and mathjax. The pattern is:
   ```
   .In GitHub Copilot (VS Code)
   [source,text]
   ----
   ...
   ----

   .In Claude Code
   [source,console]
   ----
   $ claude "..."
   ----
   ```
6. **One running scenario, "DocsAssistant API".** It is a small Spring Boot + Python sample repo that serves
   *DocsAssistant*, the same assistant as `database/vector-rag/index.adoc` and `ai/llm-foundations/*`. The recurring
   tasks are: add an endpoint, write tests, fix a failing test, refactor, review a PR. Each is shown in both tools.
7. **#202's pages exist, so link them with real `xref:`s.**
   * The issue's "Links:" targets (`ai/llm-foundations/prompt-engineering-fundamentals.adoc`,
     `ai/llm-foundations/choosing-a-model.adoc`) exist on the base branch and become real `xref:`s.
   * Other llm-foundations pages may be linked where relevant (e.g. `context-engineering.adoc`,
     `context-windows-and-memory.adoc`, `hallucinations-and-limitations.adoc`).
   * Sub-sections that don't exist yet are named in plain prose only: Customizing AI Workflows, AI Agents, MCP,
     Running LLMs Locally, AI Security & Responsible AI, LLMOps & Evaluation.
8. **Versions are re-verified at implementation time and dated "as of <date>".** This covers the VS Code / Copilot
   Chat versions, the Copilot CLI, the Claude Code CLI (`claude --version` or its changelog), and the JetBrains
   plugin. Feature names (e.g. "Copilot cloud agent", "next edit suggestions", "plan mode", "checkpoints") are checked
   against the linked official pages, because both products ship weekly.

### Lessons from the #202 review (57 findings) — mandatory for every page task

* **Every command, flag, slash command, setting key, file path and UI name must be verified** against the current
  official page before writing it. This covers `claude` flags, `/` commands, `settings.json` keys, VS Code command
  names, `copilot-setup-steps.yml`, Copilot CLI commands and GitHub Actions inputs. Never invent a parameter or
  endpoint. If a docs page can't confirm a detail, describe the behaviour without the name.
* **Every concept bullet gets at least one example** (a prompt, command, config or diff), followed by a sentence
  linking its official page. That URL is also in the page's `== References`. No prose-only concepts.
* **Never call an existing page "planned".** Check `ls modules/ROOT/pages/ai/*/` before writing any cross-reference.
* **Keep model IDs and facts consistent with `ai/llm-foundations/*`:**
  * Anthropic baseline `claude-sonnet-5`
  * OpenAI `gpt-6-sol`
  * local `llama3.1:8b`
  * Ollama 0.34

  Model *availability* in Copilot or Claude Code is linked (supported-models pages), not listed as timeless fact.
* **Examples must be self-consistent and grounded.** A prompt that asks about a file must say which file, e.g.
  `@src/main/.../DocsController.java` or `#file`. Diffs must match the prompts that produced them.
* **Don't put `xref:` inside backticks,** or it renders as code.
* **Diagrams must match the prose order,** and SVG text must fit its `viewBox` (no clipped captions).

## Current code state

**Integration branch.** `feature/213-ai-section` (HEAD `95e1aa5c`) holds #202's merged work:

* `modules/ROOT/pages/ai/index.adoc`
* `modules/ROOT/pages/ai/llm-foundations/` (19 pages plus `index.adoc` and `cheat-sheet.adoc`)
* `partials/ai-disclaimer.adoc`, `partials/ai-llm-foundations-disclaimer.adoc`
* `images/ai.svg`, `images/ai-llm-foundations-*.svg`
* `attachments/ai-llm-foundations-cheat-sheet.pdf`

**New files.** There is no `ai/ai-assisted-development/` directory, no `ai-ai-assisted-development-disclaimer.adoc`,
no `images/ai-ai-assisted-development-*.svg` and no `attachments/ai-ai-assisted-development-cheat-sheet.pdf`.

**`modules/ROOT/nav.adoc`.**

* The AI block is `** xref:ai/index.adoc[AI]` → `*** xref:ai/llm-foundations/index.adoc[LLM Foundations & Prompting]`
  → its `****` pages.
* It ends with `**** xref:ai/llm-foundations/cheat-sheet.adoc[Cheat Sheet (PDF)]`, and the next line is
  `** xref:git-and-github/index.adoc[Git & GitHub]`.
* The new `***` block goes between those two lines. That keeps the fixed order: sub-section 2 comes right after 1.
  Match on the text, not line numbers (1067/1068 at planning time).

**`modules/ROOT/pages/ai/index.adoc`.**

* `== Sub-sections`, at about lines 44–45, has the plain bullet "* AI-Assisted Development -- using AI coding
  assistants and Claude Code day to day: autocomplete, chat, agentic coding and code review. (planned)".
* Its header `:keywords:` and `:description:` exist.

**`modules/ROOT/pages/index.adoc`.** Line 3 holds a long `:keywords:`, which already includes the AI terms from #202.

**Shapes to mirror.** Page, landing and cheat-sheet shape come from `ai/llm-foundations/*.adoc`:

* header, disclaimer, dated lead, `==` sections, `== Related pages`, `== References`
* the landing page with `== What's covered` and `== Bibliography`
* grouped back-links plus the `xref:attachment$…pdf` download

**Cross-link targets** (all confirmed to exist):

* `git-and-github/pull-requests.adoc`, whose `== Reviewing and merging on github.com` is at about line 212
* `git-and-github/branches.adoc`
* `backend/springboot/maven-quality-plugins.adoc`, with `== Static analysis: Checkstyle, SpotBugs, and PMD`
* `backend/docker/security.adoc`
* on ai-catalog `main`:
  * `ai-catalog::index.adoc`
  * `ai-catalog::guides/common-workflows.adoc`
  * `ai-catalog::guides/provider-comparison.adoc`
  * `ai-catalog::skills/iru-issue.adoc`, `iru-plan.adoc`, `iru-code.adoc`, `iru-pr-review.adoc`,
    `iru-check-security.adoc`

**Tooling.**

* `npx antora antora-playbook.yml` for the build.
* `npm run validate:mermaid`, after `npm i --no-save mermaid@11 jsdom`. Restore `node_modules/.package-lock.json`
  afterwards.
* The headless Chrome binary at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` for the PDF.
* PyMuPDF (`fitz`) to check the PDF.
* The `iru-gate-runner` agent.

**AsciiDoc gotchas.**

* Don't use `{word}` in prose; put it in backticks or escape it as `\{word}`.
* Don't start a prose line with `<digits>.`.
* A line-leading `$` inside `[source,console]` is fine.

**Precedent.** `.archive/implementation_plan_202.md`.

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, a blank line, then
  `include::partial$ai-ai-assisted-development-disclaimer.adoc[]`.
* **Lead paragraph.** It states the dated versions: VS Code + Copilot Chat, Copilot CLI and/or Claude Code, and
  JetBrains where relevant. Record the date checked.
* **Cover every bullet** in the issue's outline entry for the page, and meet its 📊 floor.
  * SVGs go in `modules/ROOT/images/ai-ai-assisted-development-<topic>.svg`. Use a `viewBox`,
    `font-family="Helvetica, Arial, sans-serif"`, a flat light background, dark hex colours, no CSS variables and no
    external references.
  * Mermaid uses `[mermaid]` + `....`.
* **Examples.** Show Copilot (VS Code) and Claude Code side by side (choice 5) wherever both tools support the
  concept. Where only one does, say so and show that one.
* **Links.** Link instead of re-explaining:
  * the llm-foundations pages, for prompting, context, models and hallucinations
  * the ai-catalog pages, for the worked workflow
  * `git-and-github/*`, for Git basics
* **Footer.** End with `== Related pages` (`xref:`s) and `== References`. References list only the official docs,
  specs and articles the page uses, never the books.

## Implementation steps

### Group 1 — Scaffolding

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/ai-ai-assisted-development-disclaimer.adoc` — created, copying
  `partials/ai-llm-foundations-disclaimer.adoc` with only the xref target changed.
  - [x] Task 1.1. Copy `partials/ai-llm-foundations-disclaimer.adoc` exactly. Change only the xref, which becomes
    `xref:ai/ai-assisted-development/index.adoc#_bibliography[bibliography]`. Add no other sentence. — done; no
    other text changed.
  - [x] Task 1.2. Every later page uses the include line `include::partial$ai-ai-assisted-development-disclaimer.adoc[]`. — recorded for later page tasks.

### Group 2 — Basics

**Parallelizable: yes.** Four independent pages (Tasks 2–5), all in `modules/ROOT/pages/ai/ai-assisted-development/`.

- [x] Task 2. Create `tool-landscape.adoc` ("The AI Coding Tool Landscape") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/tool-landscape.adoc`; verified 2026-09-28 against
  docs.github.com/en/copilot, code.claude.com/docs/en, cursor.com/docs, docs.cline.bot, developers.openai.com/codex,
  jules.google/docs, docs.cloud.google.com/gemini/docs/codeassist and docs.aws.amazon.com/amazonq.
  - [x] Task 2.1. Cover the tool categories: completion, IDE chat, IDE agents, terminal agents, cloud/background
    agents and app builders. Add 📊 a Mermaid autonomy ladder: completion → chat → agent → background agent. — done;
    `== Tool categories` with one example + official link per category, plus a `[mermaid]` flowchart LR autonomy
    ladder (completion → chat → agent → background agent).
  - [x] Task 2.2. Add a **dated** comparison table ("as of <date>") of Copilot, Claude Code, Cursor, Cline, OpenAI
    Codex, Google Jules, Gemini Code Assist and Amazon Q Developer.
    * Columns: category, where it runs (IDE / terminal / cloud), agentic?, background/cloud agent?, MCP support?,
      official docs link.
    * Link official pages only. Use no prices or model lists. — done; `== Comparison of today's AI coding tools (as
      of 2026-09-28)`, all 8 tools, 7 columns incl. MCP support, no prices/model lists, with a currency note on
      Amazon Q Developer IDE-plugin EOL (2027-04-30, per AWS docs) and the CLI/CLI vs. IDE distinction.
  - [x] Task 2.3. Add "When to use which" as a decision table by task type. Add one example per category: a
    one-line prompt or command in the category's native form, each followed by its official doc link. — done;
    `== When to use which` decision table plus one native-form example (code comment / chat question / agent
    prompt / `claude "..."` / `@claude` mention / v0 prompt) per category, each linked.
  - [x] Task 2.4. Link `xref:ai-catalog::guides/provider-comparison.adoc[]` for the Claude Code / Copilot / Codex
    comparison instead of repeating it. Add References. — done; linked in prose instead of repeating the
    comparison, plus `== References` listing every official URL cited on the page.
- [x] Task 3. Create `copilot-getting-started.adoc` ("Getting Started with GitHub Copilot") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/copilot-getting-started.adoc`, verified 2026-09-28 against
  code.visualstudio.com/docs (ai-powered-suggestions, chat/inline-chat, chat/copilot-chat-context,
  agents/reference/tools-reference) and docs.github.com/en/copilot (reference/keyboard-shortcuts,
  get-started/plans, concepts/agents/about-copilot-cli, how-tos/set-up/install-copilot-cli,
  how-tos/copilot-on-github and its create-a-pr-summary page).
  - [x] Task 3.1. Install in VS Code and JetBrains, then sign in. Say that plans and their limits exist, and link the
    plans page only. — covered; VS Code sign-in via Status Bar/Accounts menu/Command Palette, JetBrains plugin
    install via Marketplace, plans linked (no figures stated) to
    docs.github.com/en/copilot/get-started/plans, checked 2026-09-28.
  - [x] Task 3.2. Cover ghost-text completions and next edit suggestions: accept, reject, partial accept, cycling
    alternatives. Give the default keybindings, verified against the VS Code docs. — covered with a macOS/Win/Linux
    keybinding table (Tab / Esc / Cmd+Right‑Ctrl+Right / Option+]‑Alt+] / Option+[‑Alt+[ / Option+\‑Alt+\),
    cross-checked against docs.github.com/en/copilot/reference/keyboard-shortcuts and
    code.visualstudio.com/docs/editing/ai-powered-suggestions as of 2026-09-28.
  - [x] Task 3.3. Cover chat and inline chat. — covered, including inline chat's Cmd+I/Ctrl+I and the Keep/Undo diff.
    * `#` context variables such as `#file`, `#codebase`, `#selection`, `#terminalLastCommand` (verify the current
      list). — re-verified 2026-09-28 against code.visualstudio.com/docs/agents/reference/tools-reference: the
      four names are not all current as literal references any more — `#<file>`/`#<folder>`/`#<symbol>`,
      `#selection` and `#codebase` remain direct context items, but terminal context is now the `#read` tool set
      (`#read/terminalLastCommand`, `#read/terminalSelection`); the page documents this evolution explicitly.
    * Attaching files and images. — covered (drag/drop, Add Context picker, pasted screenshots, vision).
    * Example: a chat prompt adding a `GET /api/pages/{id}` endpoint to DocsAssistant API. Escape the braces in
      prose, or keep them inside the code block. — done; every prose occurrence of `{id}` is backtick-wrapped,
      other occurrences are inside `[source,...]` blocks.
  - [x] Task 3.4. Cover the **Copilot CLI** (install, `copilot` interactive session, a first prompt) and Copilot on
    github.com (chat, PR summaries). Note that `gh copilot` is the older extension it replaces. Add References. —
    covered: npm/brew/winget/install-script install commands, `/login`, the interactive session with a
    DocsAssistant prompt, Shift+Tab plan mode, `copilot -p --allow-tool`, github.com/copilot chat and the PR
    description/comment *Summary* action; `== References` added.
- [x] Task 4. Create `claude-code-getting-started.adoc` ("Getting Started with Claude Code") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/claude-code-getting-started.adoc`; verified 2026-09-28 against
  `code.claude.com/docs/en/{overview,quickstart,how-claude-code-works,permission-modes,checkpointing,commands,
  cli-reference,common-workflows,sessions,vs-code}`.
  - [x] Task 4.1. Cover install and login, verifying the install command against the official quickstart. Explain
    the agentic loop in one paragraph and a Mermaid flow: read → plan → act → verify. — install command
    (`curl -fsSL https://claude.ai/install.sh | bash`, plus Homebrew/WinGet alternatives) verified against
    `quickstart` 2026-09-28; the agentic-loop diagram was adjusted from the plan's "read → plan → act → verify"
    to the currently-documented 3-phase loop (gather context → take action → verify results, looping), because
    `how-claude-code-works` no longer describes a separate "plan" phase — plan *mode* is a distinct, separately
    covered feature.
  - [x] Task 4.2. Cover `@` file references; permission modes and plan mode (how to enter plan mode, e.g.
    Shift+Tab or `--permission-mode plan`, verified); and checkpoints / rewind (`/rewind` or Esc Esc, verified).
    — both verified current as of 2026-09-28 against `permission-modes` and `checkpointing`; permission modes
    are summarized (Manual/Accept edits/Plan/Auto) rather than the full current mode list (which now also
    includes `dontAsk` and `bypassPermissions`, out of scope for a getting-started page).
  - [x] Task 4.3. Cover sessions (`claude --continue`, `claude --resume`), the IDE extensions (VS Code, JetBrains),
    desktop and web, and the `/` command basics (`/help`, `/clear`, `/compact`, `/model`, `/init`, verified).
    — `/` command list re-verified against `commands` 2026-09-28 (also confirmed `/rewind`, `/context`); flag
    short forms `-c`/`-r` verified against `cli-reference`.
  - [x] Task 4.4. Example: the same "add an endpoint" task as Task 3.3, run with `claude` and an `@` reference to the
    controller file, with the resulting diff. Add References: the Claude Code overview, quickstart, permission modes
    and common workflows. — endpoint example uses the same `DocsController.java` path Task 3.3 uses; all four
    required references plus the other pages this page cites are listed in `== References`.
- [x] Task 5. Create `prompting-coding-assistants.adoc` ("Prompting Coding Assistants") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/prompting-coding-assistants.adoc`, checked as of 2026-09-28.
  - [x] Task 5.1. Apply the Foundations prompt anatomy to code. Link
    `xref:ai/llm-foundations/prompt-engineering-fundamentals.adoc[Prompt Engineering Fundamentals]` rather than
    re-explaining it. Cover:
    * the specificity checklist for code: language/version, files, constraints, acceptance criteria
    * pasting interfaces and types
    * leading words (`def`, `SELECT`, `public`)
    * modular asks
    — done; xrefs the Foundations page instead of re-explaining, adds a "Specify | Vague | Specific" table for
    the checklist, a pasted-record example, a leading-words example in both tools, and a modular-asks section.
    Verified against
    https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering[GitHub Copilot — Prompt engineering]
    and https://code.claude.com/docs/en/best-practices[Claude Code — Best practices] as of 2026-09-28.
  - [x] Task 5.2. Add the anti-patterns table for code: vague ask, overloaded ask, no acceptance criteria, "the
    above code", ignoring clarifying questions. — done; a `[cols="1,3,3"]` table with those five rows, each
    illustrated on the DocsAssistant API scenario, distinct from the general anti-patterns table it links back to.
  - [x] Task 5.3. Add one prompt per SDLC phase, each as a before/after pair on DocsAssistant API: planning / PRD,
    coding, tests, debugging, docs, PR description. Add References: GitHub Copilot prompt engineering, Claude Code
    best practices, Anthropic prompt engineering overview. — done; all six phases use one consistent feature
    (`GET /api/pages/{id}/related` on `DocsController.java`/`DocsControllerTest.java`/`ingest/build_index.py`) so
    the before/after pairs stay self-consistent end to end. References verified as of 2026-09-28:
    https://docs.github.com/en/copilot/concepts/prompting/prompt-engineering[GitHub Copilot — Prompt engineering],
    https://code.claude.com/docs/en/best-practices[Claude Code — Best practices],
    https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview[Anthropic — Prompt engineering overview].

### Group 3 — Intermediate

**Parallelizable: yes.** Six independent pages (Tasks 6–11).

- [x] Task 6. Create `agent-mode.adoc` ("Agent Mode") — done; created at
  `modules/ROOT/pages/ai/ai-assisted-development/agent-mode.adoc`, verified 2026-09-28.
  - [x] Task 6.1. Cover Copilot agent mode in VS Code: selecting the Agent mode or agent, tools, terminal, approvals,
    **auto-approve** settings and their risks (verify the setting names). Cover Claude Code's equivalent loop. —
    done; covered VS Code's current agent-harness picker (Local/Copilot/Claude/Codex/Cloud, per
    https://code.visualstudio.com/docs/agents/run/agent-harnesses), the tools picker and tool sets
    (https://code.visualstudio.com/docs/copilot/agents/agent-tools), and the verified setting names
    `chat.tools.terminal.autoApprove`, `chat.tools.edits.autoApprove` and `chat.tools.global.autoApprove` with
    their risks (https://code.visualstudio.com/docs/agents/run/approvals). Claude Code's equivalent loop links
    back to the agentic-loop and permission-modes sections already on `claude-code-getting-started.adoc`
    (https://code.claude.com/docs/en/permission-modes). All checked 2026-09-28.
  - [x] Task 6.2. Cover:
    * how agents gather context (search, read, run)
    * approving tool calls
    * stopping and steering mid-run
    * tool sets and using existing MCP servers: VS Code `mcp.json`, `claude mcp add`. Building servers is in the
      planned *MCP* sub-section, named in prose. — done; all four bullets covered with a Copilot/Claude Code
      example each, MCP shown via `.vscode/mcp.json` (https://code.visualstudio.com/docs/copilot/customization/mcp-servers)
      and `claude mcp add --transport stdio ... --scope` (https://code.claude.com/docs/en/mcp), verified
      2026-09-28; "building a server" is named only in prose, pointing at the planned MCP sub-section.
  - [x] Task 6.3. 📊 Add a Mermaid agent loop: gather → plan → edit → run → verify. Example: the "fix a failing test"
    task in both tools, showing the approval prompts. Add References: VS Code agents overview, the Copilot agent
    docs, Claude Code overview, Claude Code MCP. — done; added the gather → plan → edit → run → verify
    `flowchart LR`, a "fix a failing test" side-by-side example with each tool's approval prompts, and the
    requested References (VS Code agents overview, MCP tutorial, Claude Code overview and Claude Code MCP), plus
    the approvals/agent-harnesses/tools/mcp pages used above; `npm run validate:mermaid` passed (548/548) on
    2026-09-28.
- [x] Task 7. Create `plan-first-workflows.adoc` ("Plan-First Workflows") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/plan-first-workflows.adoc`; verified 2026-09-28 against
  `code.claude.com/docs/en/{best-practices,common-workflows,permission-modes}` and
  `code.visualstudio.com/docs/copilot/agents/planning` and
  `code.visualstudio.com/docs/agent-customization/custom-agents`.
  - [x] Task 7.1. Cover:
    * explore → plan → implement → commit
    * spec-first / "interview then spec", with an example prompt asking the assistant to interview you and then
      write `SPEC.md`
    * Claude Code plan mode
    * the Copilot plan agent / custom plan agents (verify current naming in the VS Code docs)
    — done; the four-phase loop table plus its Mermaid diagram, an "interview me then write SPEC.md" prompt on
    the DocsAssistant API RBAC scenario, Claude Code plan mode (`Shift+Tab` / `--permission-mode plan`, `Ctrl+G`
    to edit the drafted plan), and Copilot's built-in *Plan* mode plus `.agent.md` custom agents (confirmed
    current name is "custom agent", documented as formerly "custom chat modes") — checked 2026-09-28 against
    `code.claude.com/docs/en/best-practices` (interview pattern), `permission-modes`, and
    `code.visualstudio.com/docs/copilot/agents/planning` / `agent-customization/custom-agents`.
  - [x] Task 7.2. Cover reviewing the plan as a quality gate, with a checklist, and writer / reviewer sessions (two
    sessions, one reviewing the other's diff). Link `xref:ai-catalog::skills/iru-plan.adoc[]` and
    `xref:ai-catalog::guides/common-workflows.adoc[]` as the worked example. — done; a five-item plan-review
    checklist (scope, correct problem, edge cases, verification, risk) and a two-session Writer/Reviewer example
    on the same RBAC scenario, both `xref:ai-catalog::skills/iru-plan.adoc[]` and
    `xref:ai-catalog::guides/common-workflows.adoc[]` linked as the worked, automated version of the same pattern.
  - [x] Task 7.3. 📊 Add a Mermaid flow. Examples in both tools. Add References: Claude Code best practices and common
    workflows, VS Code plan / custom agents docs. — done; one `flowchart LR` (explore → plan → implement →
    commit), Claude Code and Copilot (VS Code) examples side by side throughout, and `== References` listing
    Claude Code best practices, common workflows and permission modes plus VS Code's plan-work-with-agents and
    custom-agents pages.
- [x] Task 8. Create `context-management.adoc` ("Managing Context") — done; page written at
  `modules/ROOT/pages/ai/ai-assisted-development/context-management.adoc`, verified 2026-09-28.
  - [x] Task 8.1. Cover what an assistant sees: open files, instruction files, `@` / `#` references, tool output.
    Using instruction files (`CLAUDE.md`, `.github/copilot-instructions.md`) goes here; authoring them is in the
    planned *Customizing AI Workflows* sub-section, named in prose. Show a minimal example of each file. — done;
    covered all four sources with a minimal `CLAUDE.md` and `.github/copilot-instructions.md` example each,
    verified against https://code.claude.com/docs/en/memory, https://code.claude.com/docs/en/vs-code and
    https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions
    (2026-09-28); Customizing AI Workflows named in prose only, no xref.
  - [x] Task 8.2. Cover `/clear`, `/compact`, `/context` (verified); starting fresh vs. long sessions; scoping with
    `@` / `#`; and subagents for research, with one example prompt that delegates exploration to a subagent. Link
    `xref:ai/llm-foundations/context-engineering.adoc[]` and
    `xref:ai/llm-foundations/context-windows-and-memory.adoc[]`. — done; `/context` confirmed current (named in
    https://code.claude.com/docs/en/costs, "Run `/context` to see what's consuming space"), `/clear`/`/compact`
    confirmed against https://code.claude.com/docs/en/commands and .../costs; subagent isolation and the example
    delegation prompt verified against https://code.claude.com/docs/en/sub-agents and
    https://code.claude.com/docs/en/common-workflows (2026-09-28); both llm-foundations pages linked.
  - [x] Task 8.3. Cover token and cost awareness: the Copilot premium-request model and Claude usage limits, linked
    only, with no numbers. Add References. — done; premium-request concept verified against
    https://docs.github.com/en/copilot/concepts/billing/copilot-requests and
    https://docs.github.com/en/copilot/get-started/plans, Claude Code usage/cost model verified against
    https://code.claude.com/docs/en/costs (2026-09-28), both linked only, no prices or limit figures stated.
- [x] Task 9. Create `choosing-models-in-your-assistant.adoc` ("Choosing Models in Your Assistant") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/choosing-models-in-your-assistant.adoc`.
  - [x] Task 9.1. Cover:
    * the Copilot model picker (chat and completion model)
    * the supported-models and model-comparison pages
    * auto model selection
    * reasoning / effort levels where Copilot exposes them (verify)
    * org policies for model access
    — done; verified 2026-09-28 against docs.github.com/en/copilot/concepts/models/overview (chat model picker,
    Auto), docs.github.com/en/copilot/reference/ai-models/supported-models and .../model-comparison
    (supported-models/model-comparison pages), code.visualstudio.com/docs/agent-customization/language-models
    (separate chat vs. completions model picker, "Thinking Effort" submenu confirming reasoning/effort levels are
    exposed), docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/changing-the-ai-model (reasoning
    levels for the cloud agent) and
    docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies (org
    Settings -> Copilot -> Models per-model policy toggles).
  - [x] Task 9.2. Cover Claude Code `/model`, the model aliases (`sonnet`, `opus`, `haiku`, …; verify the current
    list), effort, fast mode, and `--model` / `ANTHROPIC_MODEL`, all verified against the model-config docs.
    — done; verified 2026-09-28 against code.claude.com/docs/en/model-config (`/model`, `sonnet`/`opus`/`haiku`/
    `default` aliases plus further specialized aliases described as changing over time, `/effort` and
    `CLAUDE_CODE_EFFORT_LEVEL`), code.claude.com/docs/en/cli-reference (`--model`, `--effort`,
    `ANTHROPIC_MODEL` precedence) and code.claude.com/docs/en/fast-mode (`/fast` toggle, "not a different model"
    behavior, switching models when the current one doesn't support fast mode). The alias list is described as
    the documented core set plus more specialized aliases, with a link to the current authoritative list, rather
    than an exhaustive enumeration, since it changes with each release.
  - [x] Task 9.3. Add a table matching models to tasks: fast for edits, reasoning for planning and debugging,
    multimodal for UI. Cover cross-checking with a second model, with an example review prompt to a second model.
    Link `xref:ai/llm-foundations/choosing-a-model.adoc[Choosing a Model]`. Name the planned *Running LLMs Locally*
    sub-section in prose for BYOK. Add References.
    — done; table added under "Matching models to tasks", cross-checking section includes a self-contained
    example review prompt referencing the DocsAssistant `DocsController` diff from the sibling getting-started
    pages, `Choosing a Model` linked with a real `xref:`, and *Running LLMs Locally* named only in prose
    (never as an `xref:`) alongside `llama3.1:8b` / Ollama 0.34 for the BYOK mention.
- [x] Task 10. Create `testing-and-debugging-with-ai.adoc` ("Testing & Debugging with AI") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/testing-and-debugging-with-ai.adoc`; verified 2026-09-28 against
  jqwik.net/docs/current/user-guide.html, hypothesis.readthedocs.io/en/latest/quickstart.html, docs.pytest.org,
  junit.org/junit5, docs.junit.org/current/user-guide, docs.github.com/en/copilot/tutorials/write-tests and
  code.claude.com/docs/en/best-practices (and its linked hooks page for the Stop hook description).
  - [x] Task 10.1. Cover generating unit, integration, edge-case, property-based and fuzz tests. Examples are JUnit 5
    plus jqwik, or pytest plus Hypothesis, on DocsAssistant API; verify the library names and APIs. Cover critiquing
    existing tests. — done; `== Generating tests` covers all five kinds plus critiquing, reusing the
    `GET /api/pages/{id}/related` scenario and `DocsControllerTest`/`ingest/build_index.py` paths from Task 5;
    jqwik `1.10.1` (`net.jqwik.api`, `Arbitraries`, `Combinators.combine().as()`, `@IntRange`, `.list().ofMaxSize()`)
    and Hypothesis (`@given`, `strategies as st`, `st.builds`) verified directly against their current docs
    2026-09-28; noted that as of that date junit.org itself now names *JUnit 6* the current generation bundling
    the same Jupiter module this sub-section calls "JUnit 5" throughout, rather than silently keeping the
    now-inaccurate "current" claim.
  - [x] Task 10.2. Cover test-driven debugging: feed back the failing test and its stack trace, with an example in both
    tools. Cover verification loops: tests as the agent's success criterion. Mention the Stop hook in prose and name
    the planned *Customizing AI Workflows* sub-section. Cover reproducing bugs. — done; `== Test-driven debugging`
    gives a stack-trace-driven example in Copilot and Claude Code, a `=== Verification loops` subsection naming
    the Stop hook in prose only (no xref, authoring left to *Customizing AI Workflows*) sourced from Claude Code
    Best practices' "Give Claude a way to verify its work" section, and a `=== Reproducing bugs` subsection with a
    "write a failing test first" example.
  - [x] Task 10.3. Link `xref:ai/llm-foundations/hallucinations-and-limitations.adoc[]` for hallucinated APIs. Add
    References: JUnit 5, jqwik / Hypothesis, and Claude Code / Copilot testing guidance. — done; `== Hallucinated
    APIs in generated tests` xrefs that page for fabricated method/assertion/strategy names in generated tests;
    `== References` lists junit.org/junit5, jqwik and Hypothesis docs, pytest docs, GitHub Copilot's
    "Writing tests" tutorial and Claude Code's Best practices page.
- [x] Task 11. Create `refactoring-and-documentation.adoc` ("Refactoring & Documentation with AI") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/refactoring-and-documentation.adoc`; verified 2026-09-28 against
  code.claude.com/docs/en (common-workflows, best-practices) and docs.github.com/en/copilot
  (concepts/prompting/prompt-engineering, reference/chat-cheat-sheet, tutorials/customization-library/prompt-files/
  create-readme).
  - [x] Task 11.1. Cover refactoring recipes (extract method, decompose conditional, rename, remove dead code), each as
    a prompt plus a short diff. Cover the "majority problem" and making AI code your own. — done; four recipes each
    with a Claude Code and/or Copilot prompt plus a `[source,diff]` against `DocsController`, followed by
    `== The "majority problem" and making AI code your own"` describing the concept generically (no book
    attribution) with four concrete ownership habits.
  - [x] Task 11.2. Cover docstrings, Javadoc, README and ADR generation, with example prompts and a short generated
    ADR. Cover legacy modernisation and translating between languages (e.g. Python → Java snippet). Add References. —
    done; Javadoc example, README generation (noted GitHub's `/create-readme` prompt-file template vs. Claude Code's
    direct prompt), an ADR prompt plus a short generated MADR-style record, legacy modernisation linking Claude
    Code's common-workflows refactor recipe and its large-scale-migration blog post, and a Python
    (`ingest/build_index.py`) → Java (`ScoreUtils.java`) translation example; `== References` lists every official
    URL cited, verified 2026-09-28. Confirmed via docs.github.com/en/copilot/reference/chat-cheat-sheet that `/doc`
    is Visual Studio/Xcode-only, not VS Code, so the VS Code docstring example is phrased as a direct chat request
    instead of naming an unverified slash command.

### Group 4 — Advanced

**Parallelizable: yes.** Seven independent pages (Tasks 12–18).

- [x] Task 12. Create `cloud-and-background-agents.adoc` ("Cloud & Background Agents") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/cloud-and-background-agents.adoc`; verified 2026-09-28 against
  docs.github.com/en/copilot (concepts/agents/cloud-agent/about-cloud-agent,
  how-tos/use-copilot-agents/coding-agent/customize-the-agent-environment,
  how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-firewall,
  how-tos/use-copilot-agents/cloud-agent/changing-the-ai-model) and code.claude.com/docs/en/github-actions
  (including the `anthropics/claude-code-action` repo's `examples/claude.yml`).
  - [x] Task 12.1. **Copilot cloud agent**:
    * assigning an issue
    * `.github/workflows/copilot-setup-steps.yml`, with an example for a Java + Python repo; verify the required job
      name and structure
    * the firewall / allowlist
    * the PR loop and iterating via PR comments
    * choosing the model
    — covered: assigning an issue / `@copilot` PR comments; a `copilot-setup-steps.yml` example for DocsAssistant
    API (Maven + pip) with the confirmed single job name `copilot-setup-steps` and its allowed keys (`steps`,
    `permissions`, `runs-on`, `services`, `snapshot`, `timeout-minutes`); the default firewall, the recommended
    allowlist, the Settings → Copilot → Internet access → Custom allowlist domain/URL formats, and the blocked-request
    PR warning; the PR loop and `@copilot`-comment iteration; the model picker's supported entrypoints (issue
    assignment, PR `@copilot` comments, Agents tab/panel, GitHub Mobile, Raycast) and the reasoning-level dropdown.
  - [x] Task 12.2. **Claude Code on the web / GitHub Actions**: the Claude GitHub App, `@claude` mentions, and the
    `anthropics/claude-code-action` workflow, with an example YAML verified against the github-actions docs. —
    covered: `/install-github-app` and manual setup (GitHub App, `ANTHROPIC_API_KEY` / `CLAUDE_CODE_OAUTH_TOKEN`
    secret), `@claude` mentions, interactive vs. automation mode, and the `claude.yml` workflow reproduced from
    `anthropics/claude-code-action`'s own `examples/claude.yml` (checkout + `anthropics/claude-code-action@v1`,
    the `permissions` block including `id-token: write` and `actions: read`), plus a `claude_args` example with
    `--max-turns` and `--model claude-sonnet-5`.
  - [x] Task 12.3. Cover how to choose bounded tasks with measurable goals, as a checklist, and "coherent
    incorrectness". 📊 Add a Mermaid flow: issue → agent → PR → review → merge. Link
    `xref:git-and-github/pull-requests.adoc[]` and `xref:ai-catalog::skills/iru-issue.adoc[]`. Add References. —
    covered: a five-item bounded/locatable/verifiable/independent/reviewable-in-one-pass checklist with a
    DocsAssistant example; "coherent incorrectness" described in prose (no book named) as an internally
    consistent but wrong PR, with the practical defense of reading against the issue's acceptance criteria; the
    issue → agent → PR → review → merge Mermaid flowchart (📊 floor met); both required `xref:`s added; `== References`
    added, linking only official docs.
- [x] Task 13. Create `parallel-sessions-and-worktrees.adoc` ("Parallel Sessions & Worktrees") — created at
  `modules/ROOT/pages/ai/ai-assisted-development/parallel-sessions-and-worktrees.adoc`; verified 2026-09-28 against
  code.claude.com/docs/en/worktrees, code.claude.com/docs/en/sub-agents, code.visualstudio.com/docs/agents/run/agents-window
  and docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes.
  - [x] Task 13.1. Run several agents with `git worktree add`. Cover Claude Code's worktree support (`--worktree` or
    the documented flow, verified) and VS Code / Copilot background sessions where documented. — done; Claude Code
    does ship a real `--worktree`/`-w` flag plus `EnterWorktree`/`worktree.baseRef` (confirmed against
    code.claude.com/docs/en/worktrees, not invented), with manual `git worktree add` given as the alternative for an
    existing branch; VS Code's Agents window (`Chat: Open Agents window` / `code --agents`) and the Copilot CLI's
    `copilot --cloud` sandbox are covered as the documented parallel-session mechanisms for those tools.
  - [x] Task 13.2. Cover splitting work by module, fan-out / fan-in, and a merge-conflict strategy. Show a worked
    example of 2 worktrees, then merge. Link `xref:git-and-github/branches.adoc[]` and
    `xref:git-and-github/merging-rebasing-and-conflicts.adoc[]`. Add References. — done; `== Splitting work by
    module`, `== Fan-out / fan-in`, `== Merge-conflict strategy` and a worked `== Worked example: two worktrees,
    then merge` (with a `[mermaid]` diagram) split DocsAssistant API's Java backend from its `ingest/` script, both
    xrefs added, and `== References` lists every official URL cited on the page.
- [x] Task 14. **Create `headless-and-ci-automation.adoc`** — verified against code.claude.com/docs/en/headless,
  code.claude.com/docs/en/cli-reference, code.claude.com/docs/en/github-actions, docs.github.com/en/copilot's
  about-copilot-cli, run-cli-programmatically, use-copilot-cli-in-actions and schedule-prompts pages (2026-09-28).
  - [x] Task 14.1. Cover `claude -p` with `--output-format json|stream-json`, a `jq` example, `--allowedTools` /
    permission settings for CI, and `--max-turns` if still documented (verify every flag).
  - [x] Task 14.2. Cover the Copilot CLI in non-interactive mode (verify flags, e.g. `-p` and allow-tool options), the
    GitHub Actions integrations (link Task 12's page), and scheduled agents.
  - [x] Task 14.3. Cover safe permission settings for CI: least privilege, no secrets in prompts, a sandbox. Show an
    example GitHub Actions job running `claude -p` on a PR diff. Add References.
- [x] Task 15. **Create `reviewing-ai-generated-code.adoc`** — verified against code.claude.com/docs/en/slash-commands,
  code.claude.com/docs/en/skills and docs.github.com/en/copilot/how-tos/use-copilot-agents/request-a-code-review/use-code-review,
  docs.github.com/en/copilot/concepts/agents/code-review (2026-09-28). File:
  `modules/ROOT/pages/ai/ai-assisted-development/reviewing-ai-generated-code.adoc`.
  - [x] Task 15.1. Add a review checklist: intent match, off-by-one errors, placeholders, hallucinated APIs and
    packages, over-engineering, test quality. — done; `== Review checklist for AI-generated diffs` table with all six.
  - [x] Task 15.2. Cover Copilot code review on PRs (requesting it; verify how), `/review` in Claude Code (verify),
    AI-as-validator, and deterministic gates as the backstop. Link `xref:backend/springboot/maven-quality-plugins.adoc[]`
    and `xref:ai-catalog::skills/iru-pr-review.adoc[]`. Show an example review prompt and an example review output.
    Add References. — done; Copilot Reviewers-panel + `gh pr edit --add-reviewer @copilot` request flow verified
    2026-09-28; `/review` confirmed as the bundled `code-review` skill's alias (not a separate built-in command)
    per code.claude.com/docs/en/slash-commands and code.claude.com/docs/en/skills; example prompt + example
    review output included; both xrefs added; `== References` added.
- [x] Task 16. **Create `securing-ai-assisted-development.adoc`** — verified against code.claude.com/docs/en/security,
  code.claude.com/docs/en/sandboxing, code.claude.com/docs/en/sandbox-environments, code.claude.com/docs/en/permission-modes,
  docs.github.com/en/copilot (firewall/allowlist, content exclusion, individual-subscriber policies) and
  genai.owasp.org/llm-top-10 (2026-09-28). File:
  `modules/ROOT/pages/ai/ai-assisted-development/securing-ai-assisted-development.adoc`.
  - [x] Task 16.1. Cover the common vulnerabilities in AI code (secrets, injection, IDOR, insecure defaults), each with
    a short bad → fixed snippet. Cover slopsquatting / hallucinated packages, with a check command such as
    `npm view <pkg>` / `pip index versions <pkg>`. — done; all bad-example secrets use fake placeholders
    (`sk-EXAMPLE-NOT-A-REAL-KEY`, `${docsassistant.search.api-key}`), no realistic-looking key or `user:password@host`
    URL anywhere on the page.
  - [x] Task 16.2. Cover:
    * prompt injection through repo content, issues and MCP tools
    * permission modes, sandboxing and network allowlists (Claude Code sandboxing docs, and the Copilot cloud agent
      firewall)
    * secret scanning, linking `xref:ai-catalog::skills/iru-check-security.adoc[]` and
      `xref:backend/docker/security.adoc[]`
    * data-privacy settings (content exclusion, training opt-outs), links only
    — all covered; sandbox network allowlist shown via `sandbox.network.allowedDomains` in `.claude/settings.json`.
  - [x] Task 16.3. Name the planned *AI Security & Responsible AI* sub-section in prose. Add References: Claude Code
    security and sandboxing, GitHub Copilot content exclusion, OWASP. — done; `== References` lists all cited URLs,
    named only in prose (no xref, since the sub-section doesn't exist yet).
- [x] Task 17. **Create `team-practices-and-adoption.adoc`** — verified against docs.github.com/en/copilot/... and
  dora.dev (2026-09-28).
  - [x] Task 17.1. Cover:
    * the golden rules ("never merge code you don't understand", …)
    * AI-assisted commit conventions: `Co-Authored-By` trailers, as this repo uses, with an example
    * shared prompt / skill libraries: link `xref:ai-catalog::index.adoc[]`, and name *Customizing AI Workflows* in
      prose
    * onboarding
  - [x] Task 17.2. Cover measuring impact (acceptance rate, cycle time, DORA; beware vanity metrics), the Copilot usage
    metrics docs (links), policies, IP / licensing (public-code filter / duplication detection, attribution),
    ethics, and junior / mid / senior advice. Add References, including DORA.
- [x] Task 18. **Create `prototyping-with-ai.adoc`** — verified against docs.github.com/en/..., code.claude.com/docs/en/... and product sites (2026-09-28).
  - [x] Task 18.1. Cover app builders (v0, Lovable, Bolt, Firebase Studio) in a dated table with official links, and
    screenshot-to-code (an image-attachment example in Copilot chat and Claude Code). — done; `== App builders`
    table (v0, Lovable, Bolt, Firebase Studio, dated 2026-09-28, official docs links only, no prices) plus
    `== Screenshot-to-code` with side-by-side Copilot Chat / Claude Code examples verified against
    code.visualstudio.com/docs/chat/copilot-chat-context and code.claude.com/docs/en/common-workflows#work-with-images.
  - [x] Task 18.2. Cover the throw-away vs. evolve decision, as a table, and the path from prototype to production, as
    a checklist linking the review and security pages. Add References. — done; `== Throw-away vs. evolve` table
    plus `== From prototype to production` checklist linking
    xref:ai/ai-assisted-development/reviewing-ai-generated-code.adoc[] and
    xref:ai/ai-assisted-development/securing-ai-assisted-development.adoc[], and `== References`.

### Group 5 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Each task edits a distinct file, and all of them only reference pages from Groups 1–4.

- [x] Task 19. Create `ai/ai-assisted-development/index.adoc` ("AI-Assisted Development")
  - Verified 2026-09-28 against code.claude.com/docs/en/*, docs.github.com/en/copilot/*, code.visualstudio.com/docs/*
    and gh issue view 203; Task 19.5's URL-set script (scratchpad/check_bibliography.py) confirms every URL in the
    17 pages' `== References` is present in `== Bibliography` (0 missing); the only 2 extras are
    customization-cheat-sheet and Building effective agents, both explicitly required by the issue/Task 19.4 spec.
  - [x] Task 19.1. Add the header and disclaimer, then a lead paragraph. The lead gives the re-verified version
    baseline (choice 8), the DocsAssistant API scenario (choice 6), and the vibe-coding ↔ AI-assisted-engineering
    spectrum.
  - [x] Task 19.2. Add the levels of autonomy, 📊 a Mermaid autonomy ladder, the 70 % problem and the knowledge
    paradox, and a basic → advanced reading path.
  - [x] Task 19.3. Add `== What's covered`, grouped as *Basics / Intermediate / Advanced / Cheat sheet*. Every page is
    an `xref:` with a one-line summary.
  - [x] Task 19.4. Add `== Bibliography`, built **after** reading the `== References` of all 17 pages. Every URL cited
    on any page appears here, grouped as follows:
    * **Requester-provided books**, one line each:
      * Taulli, *AI-Assisted Programming: Better Planning, Coding, Testing, and Deployment*, O'Reilly, 1st ed. Apr
        2024, ISBN 978-1-098-16456-0, https://www.oreilly.com/library/view/ai-assisted-programming/9781098164553/ ,
        code https://github.com/ttaulli/AI-Assisted-Programming-Book .
      * Osmani, *Beyond Vibe Coding: From Coder to AI-Era Developer*, O'Reilly, 1st ed. Aug 2025, ISBN
        979-8-341-63475-6, https://www.oreilly.com/library/view/beyond-vibe-coding/9798341634749/ ; no code repo,
        companion web edition https://beyond.addy.ie/ .
      * Huyen, *AI Engineering: Building Applications with Foundation Models*, O'Reilly, Dec 2024, ISBN
        978-1-098-16630-4, https://www.oreilly.com/library/view/ai-engineering/9781098166298/ , code
        https://github.com/chiphuyen/aie-book .
      * Note in prose that oreilly.com answers automated fetches with 403 but the pages are live.
    * **GitHub Copilot**: every URL in the issue's list, plus any others the pages cite.
    * **VS Code**.
    * **Claude Code**: every `code.claude.com/docs/en/*` page cited.
    * **Other tools**: one link for each tool in the landscape and app-builder tables.
    * **Specifications and standards**, if any are cited (e.g. OWASP, DORA).
    * **Articles**: Claude Code best practices; Anthropic, *Building effective agents*; DORA.
    * The closing house sentence: the books are consulted references only, and the official docs are authoritative.
  - [x] Task 19.5. Run a script check that the set of URLs in the pages' `== References` equals the set in
    `== Bibliography`, minus books, with none missing.
- [x] Task 20. (Done 2026-09-28.) Create `ai/ai-assisted-development/cheat-sheet.adoc` and
  `modules/ROOT/attachments/ai-ai-assisted-development-cheat-sheet.pdf`
  - [x] Task 20.1. The page has the header, the disclaimer, and an intro listing what the sheet covers. Add grouped
    back-links to all 17 pages. End with
    `xref:attachment$ai-ai-assisted-development-cheat-sheet.pdf[Download the AI-Assisted Development Cheat Sheet (PDF)]`.
    Mirror `ai/llm-foundations/cheat-sheet.adoc`.
  - [x] Task 20.2. Author a single A4 HTML/CSS layout **in the session scratchpad only**. Copy the style of the
    llm-foundations cheat sheet (`<scratchpad>/cheatsheet/cheat-sheet.html` if present, otherwise render
    `attachments/ai-llm-foundations-cheat-sheet.pdf` to PNG for reference). It has a header with the baseline and
    date, and the breadcrumb "Irurueta Docs › Guides & References › AI › AI-Assisted Development". Add one box per
    issue item:
    * Copilot ↔ Claude Code shortcuts and commands, side by side
    * plan → implement → verify
    * the code-task prompt template
    * context commands
    * the model-per-task table
    * the background-agent task checklist
    * the review checklist
    * the security checklist
    * the golden rules

    **Every command on the sheet must match the pages exactly.** Copy it from the final page text, not from memory.
  - [x] Task 20.3. (Done 2026-09-28: rendered with
    `Google Chrome --headless --no-pdf-header-footer --print-to-pdf`; verified with PyMuPDF `fitz` --
    `page_count == 1`, page size 594.96 x 841.92 pt, within tolerance of A4's 595 x 842 pt; PNG render inspected
    with no clipped content. Only the PDF was copied into the repo at
    `modules/ROOT/attachments/ai-ai-assisted-development-cheat-sheet.pdf`; `git status --porcelain` confirmed no
    `.html` file anywhere in the repo.) Render with headless Chrome using `--no-pdf-header-footer`. Verify with
    `fitz` that it is 1 page and A4, and PNG-inspect it for clipping. Copy only the PDF into the repo, and confirm
    with `git status --porcelain` that no `.html` landed there.
- [x] Task 21. (Done 2026-09-28: 17-line block inserted verbatim between the llm-foundations cheat-sheet line and
  Git & GitHub.) Edit `modules/ROOT/nav.adoc`. After `**** xref:ai/llm-foundations/cheat-sheet.adoc[Cheat Sheet (PDF)]`
  and before `** xref:git-and-github/index.adoc[Git & GitHub]`, insert:
  ```
  *** xref:ai/ai-assisted-development/index.adoc[AI-Assisted Development]
  **** xref:ai/ai-assisted-development/tool-landscape.adoc[The AI Coding Tool Landscape]
  **** xref:ai/ai-assisted-development/copilot-getting-started.adoc[Getting Started with GitHub Copilot]
  **** xref:ai/ai-assisted-development/claude-code-getting-started.adoc[Getting Started with Claude Code]
  **** xref:ai/ai-assisted-development/prompting-coding-assistants.adoc[Prompting Coding Assistants]
  **** xref:ai/ai-assisted-development/agent-mode.adoc[Agent Mode]
  **** xref:ai/ai-assisted-development/plan-first-workflows.adoc[Plan-First Workflows]
  **** xref:ai/ai-assisted-development/context-management.adoc[Managing Context]
  **** xref:ai/ai-assisted-development/choosing-models-in-your-assistant.adoc[Choosing Models in Your Assistant]
  **** xref:ai/ai-assisted-development/testing-and-debugging-with-ai.adoc[Testing & Debugging with AI]
  **** xref:ai/ai-assisted-development/refactoring-and-documentation.adoc[Refactoring & Documentation]
  **** xref:ai/ai-assisted-development/cloud-and-background-agents.adoc[Cloud & Background Agents]
  **** xref:ai/ai-assisted-development/parallel-sessions-and-worktrees.adoc[Parallel Sessions & Worktrees]
  **** xref:ai/ai-assisted-development/headless-and-ci-automation.adoc[Headless & CI Automation]
  **** xref:ai/ai-assisted-development/reviewing-ai-generated-code.adoc[Reviewing AI-Generated Code]
  **** xref:ai/ai-assisted-development/securing-ai-assisted-development.adoc[Securing AI-Assisted Development]
  **** xref:ai/ai-assisted-development/team-practices-and-adoption.adoc[Team Practices & Adoption]
  **** xref:ai/ai-assisted-development/prototyping-with-ai.adoc[Prototyping with AI]
  **** xref:ai/ai-assisted-development/cheat-sheet.adoc[Cheat Sheet (PDF)]
  ```
- [x] Task 22. (Done 2026-09-28.) Edit `modules/ROOT/pages/ai/index.adoc`
  - [x] Task 22.1. (Done: bullet now xrefs `ai/ai-assisted-development/index.adoc`, "(planned)" removed.) In
    `== Sub-sections`, replace the "AI-Assisted Development … (planned)" bullet with
    `xref:ai/ai-assisted-development/index.adoc[AI-Assisted Development]` plus a one-line scope. Remove "(planned)".
  - [x] Task 22.2. (Done: keywords appended; "Books used in this section" section exists on this page, so the Taulli
    and Osmani lines were repointed at the new bibliography anchor.) Append these terms to its `:keywords:`:
    `GitHub Copilot, Claude Code, AI-assisted development, agent
    mode, Copilot cloud agent, plan mode, git worktrees, headless mode, AI code review`. In
    `== Books used in this section`, if the Taulli and Osmani lines say which sub-section cites them, point them at
    `xref:ai/ai-assisted-development/index.adoc#_bibliography[]`.
- [x] Task 23. (Done 2026-09-28: all 8 terms were absent from the keywords line, so all were appended; none
  skipped.) Edit `modules/ROOT/pages/index.adoc` (root). Append to `:keywords:`, skipping any already present:
  `GitHub Copilot, Copilot CLI, Copilot cloud agent, Claude Code, AI-assisted development, agent mode, vibe coding,
  AI code review`.
- [x] Task 24. (Done 2026-09-28: one sentence added right after the "Derived from" reference block, before "The
  three merge methods".) Edit `modules/ROOT/pages/git-and-github/pull-requests.adoc`. In or right after
  `== Reviewing and merging on github.com`, add one sentence linking
  `xref:ai/ai-assisted-development/cloud-and-background-agents.adoc[Cloud & Background Agents]` and
  `xref:ai/ai-assisted-development/reviewing-ai-generated-code.adoc[Reviewing AI-Generated Code]`. Make no other
  edits.

### Group 6 — Build and verify

**Parallelizable: yes** (single task; it must run after Groups 1–5).

- [x] Task 25. Build and verify — clean Antora build (0 errors, 0 warnings), all 552 Mermaid diagrams parsed,
  reachability/grep checks pass, 1 real finding fixed in the #202-lessons self-review, cheat-sheet PDF re-verified
  against the final pages with no re-render needed. See 25.1–25.6 notes below.
  - [x] Task 25.1. Run `npx antora antora-playbook.yml` against a clean `build/` through an `iru-gate-runner`
    sub-agent. It must exit 0 with **0 errors and 0 warnings**. Fix and rebuild until it does. — first pass surfaced
    3 warnings ("skipping reference to missing attribute: id") from unescaped `{id}` in prose/table-cell text
    (outside source/listing blocks) in `prompting-coding-assistants.adoc` (lines 71, 139, 164) and
    `copilot-getting-started.adoc` (line 153); escaped to `\{id}`. Rebuild: exit 0, 0 errors, 0 warnings, no `--fetch`
    needed (ai-catalog xrefs resolved from local cache).
  - [x] Task 25.2. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` through a sub-agent. All diagrams
    must parse. Restore `node_modules/.package-lock.json`. — all 552 Mermaid diagrams repo-wide parsed successfully,
    0 failed; `node_modules/.package-lock.json` restored via `git checkout --` (tracked file), confirmed clean.
  - [x] Task 25.3. Check reachability:
    * all 17 pages plus `cheat-sheet.adoc` are `xref:`-linked from both `ai/ai-assisted-development/index.adoc` and
      `nav.adoc`
    * `build/site/ai/ai-assisted-development/` has 19 HTML files
    * every `ai-ai-assisted-development-*.svg` is in `build/site/_images/`
    * the PDF is 1 A4 page
    — all confirmed: 17/17 pages + cheat-sheet xref'd from both index.adoc and nav.adoc; `build/site/ai/ai-assisted-development/`
    has exactly 19 `.html` files (17 pages + index + cheat-sheet); no `ai-ai-assisted-development-*.svg` files exist
    anywhere (pages use only Mermaid `[mermaid]` blocks, no `image::` references, so this set is empty by design — 0
    expected, 0 found); PDF verified via PyMuPDF (`fitz`) as exactly 1 page, 594.96×841.92pt (A4).
  - [x] Task 25.4. Run the grep checks:
    * the disclaimer include is in all 19 files
    * there are no admonitions under `pages/ai/ai-assisted-development/`
    * the book surnames Taulli, Osmani and Huyen appear only in the two index pages (`ai/index.adoc` and
      `ai/ai-assisted-development/index.adoc`) and the existing llm-foundations index
    * every content page has `== References` and at least one code block
    * no `xref:` sits inside backticks
    * no page calls an existing AI page "planned"
    * no line-leading `20NN.`
    * the pages have no stale names: `gh copilot` only as "older", no "coding agent" except when describing the
      rename, no CodeWhisperer or Duet AI except as "formerly"
    — all checks pass. Include present in all 19 files (a fixed-string grep confirmed; an earlier unescaped `$` in
    an ad hoc shell pattern gave a false negative, not a real gap). No `[NOTE]`/`[TIP]`/`[WARNING]`/`[IMPORTANT]`/
    `[CAUTION]` or leading `NOTE:`/etc. blocks in any page source (the disclaimer partial itself is excluded — it is
    an `[IMPORTANT]` block *included into* every page, not written in the page sources). Taulli/Osmani/Huyen appear
    only in `ai/index.adoc`, `ai/ai-assisted-development/index.adoc` and `ai/llm-foundations/index.adoc` — nowhere
    else. Every page but `cheat-sheet.adoc` has `== References` and a `[source,...]` block; `cheat-sheet.adoc` matches
    its `ai/llm-foundations/cheat-sheet.adoc` precedent, which also has neither (it's a back-link index, not a
    content page). No `xref:` inside backticks. "planned" appears only for the six sub-sections that don't exist yet
    (Running LLMs Locally, MCP, Customizing AI Workflows, AI Security & Responsible AI) — never for an existing AI
    page. No line-leading `20NN.`. `gh copilot` appears once, explicitly as "the older `gh copilot` GitHub CLI
    extension"; "coding agent" appears only as GitHub's own current official term ("Copilot coding agent", "Copilot
    cloud agent"), a direct quote, or generic comparison-table prose — never Osmani's stale generic usage; no
    CodeWhisperer or Duet AI mentions at all.
  - [x] Task 25.5. **Self-review pass against the #202 lessons.** Delegate it to a fresh `general-purpose` sub-agent
    that reads every page and **verifies every command, flag, slash command, setting key and file name** against
    official docs with WebFetch. Fix every real finding, then rebuild. Record the findings count and what was fixed
    in this task's progress note. — **1 real finding**, fixed:
    `reviewing-ai-generated-code.adoc` line 93 showed `/review --level high`, but `/review`/`code-review`'s effort
    level (`low|medium|high|xhigh|max|ultra`) is a positional argument, not a `--level` flag; changed to
    `/review high` (verified against https://code.claude.com/docs/en/commands and
    https://code.claude.com/docs/en/slash-commands — `--comment`/`--fix` were already correctly named). Confirmed
    `/review` is a real, documented alias for the bundled `code-review` skill. All other categories checked out
    clean against current official docs: permission-mode names, model aliases/`/model`/`/effort`, `claude -p`
    headless flags, `claude mcp add`/`/mcp`, worktree flags, `/clear`/`/compact`/`/context`/`/init`/`/rewind`, plan
    mode, hooks, `anthropics/claude-code-action` inputs (byte-for-byte match with the official example workflow),
    `copilot-setup-steps.yml` job-name/keys, VS Code `chat.tools.*.autoApprove` settings, VS Code agent harnesses,
    Copilot CLI flags, Copilot Chat `/doc`/prompt files, Amazon Q Developer EOL date. Rebuilt after the fix: exit 0,
    0 errors, 0 warnings.
  - [x] Task 25.6. Re-check that the cheat-sheet PDF text (via `fitz`) matches the final pages after the Task 25.5
    fixes. If a fix touched something on the sheet, re-render it. — extracted PDF text via `fitz`
    (`modules/ROOT/attachments/ai-ai-assisted-development-cheat-sheet.pdf`, 1 page) and diffed it against
    `cheat-sheet.adoc`/`scratchpad/cheatsheet-203/cheat-sheet.html`: content matches exactly, and it does not contain
    the `/review --level high` string the 25.5 fix corrected (the cheat sheet's review-related content is only the
    generic "Review Checklist for AI Diffs" section, which never named that flag). No re-render needed; the PDF was
    left untouched, copied back as-is.

### Group 7 — Integration-branch verification (required by #203 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; its sub-tasks run in order after Group 6).

- [x] Task 26. Verify against the integration branch and compute merge readiness
  - [x] Task 26.1. Commit the work on `feature/203`, with message trailer `Co-Authored-By: Claude Opus 5.5
    <noreply@anthropic.com>`, and do not push. Then `git fetch origin` and merge the latest
    `origin/feature/213-ai-section` into `feature/203`.
    * **Expected conflict points:** the AI block in `nav.adoc`, `ai/index.adoc` → `== Sub-sections` and
      `:keywords:`, and the root `:keywords:`.
    * **Resolution:** keep every sibling's entries in the fixed sub-section order.
    * If nothing is new, record "already up to date".
    * Done: committed as `d21f996f` on `feature/203` (not pushed). `git fetch origin` +
      `git merge origin/feature/213-ai-section` → "Already up to date" (feature/203 already had `95e1aa5c` as an
      ancestor); no conflicts, no merge commit needed.
  - [x] Task 26.2. Re-run the Antora build and the Mermaid validation on the merged result through `iru-gate-runner`.
    Both must be clean.
    * Done: Antora build — 0 errors, 0 warnings. Mermaid validation — 552/552 diagrams parsed, 0 failed.
      `node_modules/.package-lock.json` was touched by `npm i` and restored with `git checkout --`.
  - [x] Task 26.3. Compute merge readiness for prerequisite **#202**. Confirm it is merged into the integration branch
    (merge commit `95e1aa5c`, PR #215) with
    `gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`.
    * Done: `gh pr list` confirms PR #215 (`feature/202`) is merged into `feature/213-ai-section`.
      `git merge-base --is-ancestor 95e1aa5c HEAD` passes on `feature/203`'s current HEAD.
  - [x] Task 26.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-203.md`:
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #202 ✅ merged into feature/213-ai-section (PR #215)
    - Antora build + Mermaid validation on the merged result: ✅ passed
    - Status: ✅ READY: can be merged into feature/213-ai-section after human review
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first" instead. Add the post-merge chores: tick #203 in
    #213's *Progress* checklist and delete `feature/203`.
    * Done: written to `<scratchpad>/merge-readiness-203.md` (not committed to the repo). All checks passed, so
      status is ✅ READY.
