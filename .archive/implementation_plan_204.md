# Implementation Plan: Guides & References / AI — "Customizing AI Workflows"

## Task summary

Source: GitHub issue #204
Base branch: feature/213-ai-section

Issue [#204](https://github.com/albertoirurueta/docs/issues/204) adds sub-section 3 of 15 of the AI section,
**Customizing AI Workflows**, at `modules/ROOT/pages/ai/customizing-ai-workflows/`. It is a tool-level guide to shaping
**Claude Code** and **GitHub Copilot** to a team's workflow. It covers these surfaces:

* instruction and memory files
* prompt files and slash commands
* skills
* subagents and custom agents
* hooks
* permissions and settings
* MCP configuration
* output styles, the status line and related settings
* plugins and marketplaces

It also explains **how to optimise** these surfaces. This account's **`ai-catalog`** repository
(https://github.com/albertoirurueta/ai-catalog, the `ai-catalog` Antora component) is the worked example on every page.

The sub-section ships:

* 15 concept pages
* `index.adoc` with `== Bibliography`
* `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/ai-customizing-ai-workflows-cheat-sheet.pdf`
* the partial `partials/ai-customizing-ai-workflows-disclaimer.adoc`
* the nav block
* the `ai/index.adoc` bullet
* cross-link sentences in 3 existing AI-Assisted Development pages

The issue body is the binding spec: its "Page outline", "Cross-links to add in existing pages", "Bibliography" and
"Branching, PR target and merge strategy" sections. Every page task must read its page's bullets in
`gh issue view 204` and cover **every** bullet.

**Out of scope:**

* re-documenting individual ai-catalog skills (their generated pages exist; link them)
* building MCP servers (the planned *Model Context Protocol (MCP)* sub-section)
* building CLIs (the planned *Building CLIs for AI Agents* sub-section)
* general agent architecture (the planned *AI Agents* sub-section)

### Merge constraints (from #204 → "Branching, PR target and merge strategy")

* **Target:** the PR forks from and targets `feature/213-ai-section`, never `main`. It reaches `main` only through
  collector issue #213's final integration PR.
* **Prerequisite: #203 is already merged** into `feature/213-ai-section` (PR #216, merge commit `237177d2`). So this PR
  can be marked ready and merged there once it passes human review and the Antora build plus Mermaid validation pass on
  `feature/204` merged with the latest `origin/feature/213-ai-section`.
* **PR body:** it uses `Refs #204` and carries the *Merge readiness* block (Group 7).
* **After merge:** tick #204 in #213's *Progress* checklist and delete `feature/204`.

### Choices made on the user's behalf

1. **Ship everything in one pass.** All 15 pages, the index, the cheat sheet, the PDF and the 3 cross-links go in, as
   #202 and #203 did.
2. **Books appear only in `== Bibliography`.** The requester-provided books are Osmani, *Beyond Vibe Coding*, and Albada,
   *Building Applications with AI Agents*.
   * They appear **only** in `ai/customizing-ai-workflows/index.adoc` → `== Bibliography`.
   * They support the context-engineering and shared-library concepts only.
   * They are never the source of an example.
   * The PDFs in `~/Desktop/ai` are never opened, copied or quoted.
3. **Disclaimer:** `partials/ai-customizing-ai-workflows-disclaimer.adoc` uses the same shape as
   `partials/ai-ai-assisted-development-disclaimer.adoc`, with the anchor
   `xref:ai/customizing-ai-workflows/index.adoc#_bibliography[bibliography]`. No other admonition may appear under
   `ai/customizing-ai-workflows/`.
4. **Tasks are untagged; no language key applies.** They author AsciiDoc, SVG and PDF only. The config files, scripts and
   frontmatter in the examples are page content.
5. **Side-by-side tool examples use two consecutive titled blocks, not tabs.** Use `.In Claude Code` / `.In GitHub
   Copilot (VS Code)`, each on its own line **as a `.Title` line, never `[.Title]`**. The playbook has no tabs extension.
6. **The ai-catalog worked example is pinned.**
   * Excerpts link to files on GitHub at commit **`58fb70954404f9d539031a02ac6d4413f03745be`** (ai-catalog `main` at
     planning time), e.g. `https://github.com/albertoirurueta/ai-catalog/blob/58fb709…/.claude/skills/iru-code/SKILL.md`.
     Re-check the SHA at implementation time and use the current `main` SHA consistently across all pages.
   * Excerpts are short paraphrased snippets, then generalised.
   * `xref:ai-catalog::` targets may only be pages on ai-catalog `main`. These are confirmed:
     * guides: `claude-md`, `creating-skills-and-agents`, `authoring-effective-instructions`, `plugins`,
       `packaging-and-distribution`, `provider-comparison`, `extending-the-catalog`, `common-workflows`
     * agents: `overview`, `iru-gate-runner`, `iru-isolated-skill-executor`
     * skills: `iru-check-license`, `iru-code`, `iru-plan`, `iru-issue`, `iru-check-security`,
       `iru-generate-skill-docs`, `iru-code-one-task-group`, `iru-java-code-one-task-group`, `iru-java-code-one-task`,
       `iru-setup-changelog`
   * Android, Swift and TypeScript skills, `iru-setup-repository` and `*-bump-version` are **not** linked.
7. **The plugin example is new and illustrative.** ai-catalog has **no** `.claude-plugin/plugin.json` or
   `marketplace.json` on `main`. `plugins-and-marketplaces.adoc` shows a complete example `plugin.json` and
   `marketplace.json` that would package a subset of ai-catalog. The page states plainly that the catalog does not ship
   these files yet, and verifies every field against the current plugin docs.
8. **Existing AI pages get real `xref:`s.**
   * `ai/llm-foundations/*` and `ai/ai-assisted-development/*` exist, so link them with real `xref:`s, e.g.
     `context-engineering.adoc`, `context-management.adoc`, `agent-mode.adoc`, `headless-and-ci-automation.adoc` and
     `securing-ai-assisted-development.adoc`.
   * Sub-sections that don't exist yet are named in plain prose only: AI Agents, MCP, Building CLIs for AI Agents, AI
     Security & Responsible AI, LLMOps & Evaluation.
9. **Versions are re-verified at implementation time and dated "as of <date>".**
   * The index lead and the cheat sheet state real version numbers: the Claude Code CLI, VS Code with the single GitHub
     Copilot Chat extension, and the Copilot CLI.
   * The #203 baseline was VS Code 1.139, Copilot CLI 1.0.88 and Claude Code 2.1.283 (2026-09-28). Update it if newer.

### Lessons from the #202 (57) and #203 (64) reviews — mandatory for every page task

**Verify every name against its official page before writing it.** This covers every:

* hook event name, matcher syntax and JSON field
* exit-code meaning
* frontmatter key, settings key and permission-rule pattern
* file path and slash command
* plugin manifest field
* CLI flag and VS Code setting

Sources: code.claude.com/docs/en/* (memory, skills, sub-agents, hooks, hooks-guide, commands, settings,
permission-modes, sandboxing, mcp, plugins, plugin-marketplaces, output-styles, statusline, model-config,
managed-settings), docs.github.com/en/copilot/* and code.visualstudio.com/docs/*. Never invent a key or field. If the
docs don't confirm a detail, describe the behaviour without naming it.

**Security is correctness.**

* No committed example may hardcode a secret. Use `${input:…}`, env vars or `apiKeyHelper`.
* Describe broad-grant settings accurately and state their risk: `bypassPermissions`, `chat.tools.global.autoApprove`,
  `--dangerously-skip-permissions`, wildcard allows.

**Every concept bullet gets at least one example** (a file, config, command or script), followed by a link to its
official page. That URL also goes in the page's `== References`.

**URL hygiene.** Use canonical URLs, not redirecting legacy ones. Check with
`curl -sI -L -o /dev/null -w '%{url_effective}' <url>`. Give each page one URL, and use the same one across pages.

**Cross-links must be accurate.**

* Never call an existing page "planned"; check `ls modules/ROOT/pages/ai/*/`.
* Never claim another page covers something it doesn't. Grep the target page first.
* No `xref:` inside backticks.
* No empty link text on a fragment xref.

**Examples must be self-consistent.**

* A hook script's input fields must match the documented JSON contract.
* A `settings.json` must be valid JSON: no comments inside a `[source,json]` block; put the path in the block title.
* A skill's `allowed-tools` must match what its steps run.
* Ai-catalog excerpts must match the pinned file.

**AsciiDoc hygiene.**

* Block captions are `.Title` lines.
* No leaked authoring notes.
* Inside `[source]` blocks write `{placeholders}` literally. In prose, backtick them and escape as `\{x}`.
* No prose line starting with `<digits>.`.

**Consistency.** Keep model names consistent with `ai/llm-foundations/*` and `ai/ai-assisted-development/*`:
`claude-sonnet-5`, `gpt-6-sol`, and the Claude Code aliases (`default` = Opus 5.5 on most plans, with `fable` and
`best` above Opus).

## Current code state

**Base branch.** `feature/213-ai-section` (HEAD `237177d2`) holds:

* #202: `ai/index.adoc`, `ai/llm-foundations/*`, `partials/ai-disclaimer.adoc`, `partials/ai-llm-foundations-disclaimer.adoc`
* #203: `ai/ai-assisted-development/*` (17 pages, `index.adoc`, `cheat-sheet.adoc`) and
  `partials/ai-ai-assisted-development-disclaimer.adoc`

There is no `ai/customizing-ai-workflows/` yet.

**`modules/ROOT/nav.adoc`.**

* The AI block ends with `**** xref:ai/ai-assisted-development/cheat-sheet.adoc[Cheat Sheet (PDF)]`.
* The next line is `** xref:git-and-github/index.adoc[Git & GitHub]`.
* The new `***` block goes between them (sub-section 3 after 2).
* Match on the text, not line numbers (1086/1087 at planning time).

**`modules/ROOT/pages/ai/index.adoc`.**

* `== Sub-sections` has the plain bullet "* Customizing AI Workflows -- shaping an AI assistant's behavior with custom
  instructions, skills, hooks and automation. (planned)" at about line 46.
* `== Books used in this section` lists Osmani and Albada. Osmani already links the AI-Assisted Development
  bibliography.
* The header `:keywords:` exists.

**`modules/ROOT/pages/index.adoc`.** Root `:keywords:` on line 3.

**Existing AI-Assisted Development pages that need cross-link sentences** (the issue's "Cross-links to add"):

* `ai/ai-assisted-development/context-management.adoc`: `== What an assistant sees` (about line 12), where
  instruction files are "used here; authoring is in Customizing AI Workflows" in prose.
* `ai/ai-assisted-development/plan-first-workflows.adoc`: `== Copilot Plan mode and custom agents` (about line 116)
  and `== Reviewing the plan as a quality gate` (about line 151).
* `ai/ai-assisted-development/headless-and-ci-automation.adoc`: `== Running Claude Code headless with claude -p`
  (about line 15), for CI permission settings.
* Also grep all `ai/ai-assisted-development/*` for "Customizing AI Workflows" in prose. Every mention becomes an `xref:`
  to the matching new page:
  * instruction files → `instruction-and-memory-files.adoc`
  * Stop hook → `hooks.adoc`
  * permissions → `permissions-and-settings.adoc`
  * shared skill libraries → `skills.adoc`

**Shapes to mirror.** `ai/ai-assisted-development/*.adoc`: the header, disclaimer, dated lead, `==` sections,
`== Related pages` and `== References`. The landing page has `== What's covered` and a grouped `== Bibliography`
(books / Official documentation with tool sub-groups / Specifications and standards / Papers and engineering
articles). The cheat-sheet page has grouped back-links like the nav, the `xref:attachment$…pdf` download and its own
`== References`.

**ai-catalog facts** (pinned `58fb709…`; re-verify):

* **Skills.** `.claude/skills/<name>/SKILL.md`, about 57 skills on `main`. Frontmatter used: `name`, `description`,
  `model` on all; `allowed-tools` on some, e.g. `iru-code`, `iru-*-code-one-task(-group)`, `iru-check-security`. Not
  used: `argument-hint`, `context: fork`, `disable-model-invocation`, `user-invocable`.
* **Agents.** `.claude/agents/iru-gate-runner.md` (`tools: Skill, Bash, Read`), `iru-isolated-skill-executor.md`
  (`tools: "*"`) and `iru-change-summarizer.md`.
* **Progressive disclosure.** `.claude/skills/iru-java-code-one-task/reference/README.md` has a routing table.
* **Model tiering.** haiku for mechanical tasks, sonnet for code, opus for explore, plan and PR review. See
  `guides/extending-the-catalog.adoc`.
* **Not present.** No `.claude-plugin/`, no Copilot files (`copilot-instructions.md`, prompts, agents) and no
  `AGENTS.md`.
* **This docs repo.** It also has `.claude/skills/`, e.g. `iru-update-docs`, `iru-build-docs` and
  `iru-generate-skill-docs`, as a consumer example.

**Tooling.**

* `npx antora antora-playbook.yml`.
* `npm run validate:mermaid`, after `npm i --no-save mermaid@11 jsdom`. Restore `node_modules/.package-lock.json`.
* Headless Chrome and PyMuPDF (`fitz`) for the PDF.
* The `iru-gate-runner` agent.
* The previous cheat-sheet HTML sources in the scratchpad (`cheatsheet/`, `cheatsheet-203/`) as style references.

**Precedents.** `.archive/implementation_plan_202.md` and `.archive/implementation_plan_203.md`.

## Conventions every page task must follow

* **Header.** `= Title`, `:description:` (one sentence), `:keywords:`, plus `:stem: latexmath` if the page has math,
  then a blank line and `include::partial$ai-customizing-ai-workflows-disclaimer.adoc[]`.
* **Lead paragraph.** State the dated versions (Claude Code CLI; VS Code + Copilot Chat; Copilot CLI where relevant)
  and the pinned ai-catalog commit.
* **Coverage.** Cover every outline bullet and meet the 📊 floor.
  * SVGs go in `modules/ROOT/images/ai-customizing-ai-workflows-<topic>.svg`: `viewBox`,
    `font-family="Helvetica, Arial, sans-serif"`, flat light background, dark hex colours, no CSS variables, no
    external refs.
  * Text must fit the viewBox.
* **Side-by-side examples.** Show Claude Code and Copilot side by side (choice 5) where both support the concept.
  Where only one does, say so.
* **ai-catalog excerpt pattern.** Name the pinned file, then give a short excerpt, then say what it demonstrates, then
  give the generalised version.
* **Page ending.** End with `== Related pages` (`xref:`s) and `== References` (official docs, specs and articles only,
  never books).

## Implementation steps

### Group 1 — Scaffolding

**Parallelizable: yes** (single task).

- [x] Task 1. Create `modules/ROOT/partials/ai-customizing-ai-workflows-disclaimer.adoc` — file created; only the
  xref target differs from the source partial (verified via `diff`).
  - [x] Task 1.1. Copy `partials/ai-ai-assisted-development-disclaimer.adoc` exactly. Change only the xref to
    `xref:ai/customizing-ai-workflows/index.adoc#_bibliography[bibliography]`.
  - [x] Task 1.2. Every later page uses the include line
    `include::partial$ai-customizing-ai-workflows-disclaimer.adoc[]`.

### Group 2 — Instructions, prompts and skills

**Parallelizable: yes.** Four independent pages (Tasks 2–5), all in `modules/ROOT/pages/ai/customizing-ai-workflows/`.

- [x] Task 2. Create `instruction-and-memory-files.adoc` ("Instruction & Memory Files"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/instruction-and-memory-files.adoc`. All facts (CLAUDE.md
  precedence/order-of-load table, `@path` import depth limit of 4, `.claude/rules/` `paths:` frontmatter,
  auto-memory storage path and `MEMORY.md` load limits, AGENTS.md precedence rules, Copilot
  `.github/instructions/*.instructions.md` `applyTo` frontmatter) were verified live against
  https://code.claude.com/docs/en/memory, https://agents.md,
  https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions
  and https://code.visualstudio.com/docs/agent-customization/custom-instructions on 2026-09-28 (canonical URLs
  confirmed via `curl -sI -L`). Nothing had to be described without naming — every key/path cited was confirmed.
  - [x] Task 2.1. Cover `CLAUDE.md`:
    * locations and precedence (enterprise / user / project / local, and nested directories)
    * `@path` imports
    * rules directories, if documented (verify)
    * auto-memory (verify the current behaviour and file location against `memory`)

    Examples: a minimal project `CLAUDE.md` for the DocsAssistant API repo, and an `@import`.
  - [x] Task 2.2. Cover `AGENTS.md` (link https://agents.md; verify it is live) and which tools read it, per their docs.
    Cover `.github/copilot-instructions.md` and path-specific `.github/instructions/*.instructions.md` with `applyTo`
    globs, with examples of each.
  - [x] Task 2.3. Cover portability: one source of truth via symlink or `@AGENTS.md` import, with an example. Cover
    what to put in and what to leave out, as a do/don't table: short, no obvious rules, commands over prose. Link
    `xref:ai-catalog::guides/claude-md.adoc[]`,
    `xref:ai/ai-assisted-development/context-management.adoc[Managing Context]` and
    `xref:ai/llm-foundations/context-engineering.adoc[]`.
- [x] Task 3. Create `prompt-files-and-slash-commands.adoc` ("Prompt Files & Slash Commands"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/prompt-files-and-slash-commands.adoc`. Verified live against
  code.claude.com/docs/en/skills, code.claude.com/docs/en/commands,
  docs.github.com/en/copilot/tutorials/customization-library/prompt-files/your-first-prompt-file and
  code.visualstudio.com/docs/agent-customization/{prompt-files,overview} (raw HTML fetched and grepped, not just
  the summarizing WebFetch tool, since its first pass over the skills page needed cross-checking). Confirmed facts
  used: Copilot prompt-file frontmatter is `description`/`name`/`argument-hint`/`agent`/`model`/`tools` (not
  `mode` — that field name isn't used by either source checked); Claude Code's `commands` page now only documents
  built-in session commands, and custom commands are documented as "merged into skills" on the `skills` page,
  with `.claude/commands/*.md` files supporting the same frontmatter as a `SKILL.md` except `name` and
  directory-based supporting files; `$ARGUMENTS`, `$1`/`$N` (`$ARGUMENTS[N]`) positional args, and the
  backslash-escape rule (`\$1`) are all confirmed on the `skills` page. One fact found and included that wasn't
  in the plan's outline: as of 2026-09-28 VS Code's docs state prompt files are deprecated for Agent Host
  sessions (not loaded there; kept working only via the older Local agent, which is scheduled for removal) with
  an experimental migration to Agent Skills — this directly strengthens the page's decision table, so it's
  called out in an `[IMPORTANT]` admonition rather than silently omitted. No fact required inventing a key; none
  of the "gaps" in this task needed the "describe without naming" fallback.
  - [x] Task 3.1. Cover Copilot `.github/prompts/*.prompt.md` and its frontmatter, verifying the current keys (e.g.
    `description`, `agent`/`mode`, `tools`, `model`), plus running it with `/name` in chat. Example: a `new-endpoint`
    prompt file for DocsAssistant API.
  - [x] Task 3.2. Cover Claude Code custom commands (`.claude/commands/*.md`) and how they now merge into skills
    (verify against `commands` and `skills`), plus `$ARGUMENTS` and positional args (verify). Example: the same
    `new-endpoint` command.
  - [x] Task 3.3. Add a decision table for when a prompt file or command is enough and when you need a skill:
    supporting files, model-invoked triggering, allowed-tools.
- [x] Task 4. Create `skills.adoc` ("Skills"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/skills.adoc`. Verified against
  https://code.claude.com/docs/en/skills (frontmatter, locations, invocation, skills-invoking-skills behaviour),
  https://agentskills.io (open standard, progressive disclosure) and
  https://docs.github.com/en/copilot/concepts/agents/about-agent-skills (Copilot locations: `.github/skills/`,
  `.agents/skills/`, `~/.copilot/skills/`, `~/.agents/skills/`, plus shared `.claude/skills/`). The Claude Code
  Skills reference documents more frontmatter keys than the task's list (`when_to_use`, `arguments`,
  `disallowed-tools`, `effort`, `background`, `hooks`, `paths`, `shell`, `metadata`, `license`, `compatibility`);
  all are included in the reference table per "plus any other currently documented key". One fact could not be
  fully verified: GitHub's Agent Skills page does not document Copilot's own frontmatter schema beyond the shared
  `name`/`description` baseline, so the page states this explicitly rather than asserting Copilot supports the
  Claude-specific keys (`allowed-tools`, `context: fork`, etc.). Both pinned ai-catalog excerpts
  (`iru-check-license/SKILL.md`, `iru-code/SKILL.md`) were diffed against `git show
  origin/main:.claude/skills/<name>/SKILL.md` at SHA `58fb70954404f9d539031a02ac6d4413f03745be` and match
  verbatim. `xref:ai/customizing-ai-workflows/*` sibling links point at pages not yet created by this task
  (created by parallel Group 2/3 tasks per the plan's explicit allowance for this task).
  - [x] Task 4.1. Cover the Agent Skills concept and open standard (verify https://agentskills.io and the Anthropic
    Agent Skills docs) and `SKILL.md` anatomy.
    * Add a **full frontmatter reference table** for `name`, `description`, `allowed-tools`, `model`, `argument-hint`,
      `disable-model-invocation`, `user-invocable`, `context: fork` + `agent`, plus any other currently documented key.
    * Each row gives the type, the default and what it does, verified against code.claude.com/docs/en/skills.
  - [x] Task 4.2. Cover supporting files and scripts (`reference/`, scripts invoked from steps), locations (project
    `.claude/skills/`, user, plugin, and Copilot's `.github/skills/` and `.claude/skills/`, verified against the Copilot
    docs), invocation by the user (`/name`) vs. by the model (description match), and skills invoking skills.
  - [x] Task 4.3. Add examples: excerpts of pinned ai-catalog `iru-check-license/SKILL.md` (small) and
    `iru-code/SKILL.md` (orchestrator frontmatter and `allowed-tools`), then a generalised minimal skill. Add 📊 a
    Mermaid flow: discovered → description in context → loaded on match or `/name` → executed. Link
    `xref:ai-catalog::skills/iru-check-license.adoc[]` and `xref:ai-catalog::skills/iru-code.adoc[]`.
- [x] Task 5. Create `writing-effective-skills.adoc` ("Writing Effective Skills"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/writing-effective-skills.adoc`. Weak/strong description pair
  uses the pinned `iru-check-license/SKILL.md` frontmatter (verified verbatim via `git show`); before/after
  snippets for imperative steps and examples-over-rules are adapted from `iru-setup-antora`'s Step 2 and
  Step 5. HITL/stop-condition excerpt is from `iru-code`'s "Step 6 -- When to interrupt the user"; idempotency
  excerpt is from `iru-setup-antora`'s "Step 2 -- Survey what already exists"; pass-through-args excerpt is from
  `iru-setup-java-library-repository`'s "Step 0 -- Resolve inputs"; naming/namespacing excerpt quotes
  `ai-catalog`'s own `guides/creating-skills-and-agents.adoc` ("Naming: avoiding marketplace collisions" section,
  a confirmed xref target). All ai-catalog GitHub links use the pinned SHA `58fb70954404f9d539031a02ac6d4413f03745be`
  (re-verified as the current `origin/main` at implementation time). `AskUserQuestion` was verified as a real,
  documented Claude Code tool via `code.claude.com/docs/en/tools-reference` before being named. No facts could
  not be verified -- everything cited (SKILL.md frontmatter keys, `AskUserQuestion`, the two ai-catalog guide
  xrefs, the Claude Code skills/tools-reference docs, the Anthropic Agent Skills best-practices URL) was checked
  against live sources. Page is Claude-Code-specific per the plan's guidance (no `.In Claude Code`/`.In GitHub
  Copilot` side-by-side blocks); the lead paragraph notes briefly how the discipline still applies to Copilot
  prompt/agent files.
  - [x] Task 5.1. Cover descriptions written for triggering: invocation form, inputs, non-goals, "Use whenever … instead
    of …". Show a weak vs. strong description pair, with the strong one excerpted from a pinned ai-catalog skill.
    Cover imperative, checkable steps and examples over rules, each with a before/after snippet.
  - [x] Task 5.2. Cover:
    * explicit stop conditions and HITL points (`AskUserQuestion`)
    * idempotency and resume (the "check existing state first" step)
    * pass-through `key: value` args (excerpt from `iru-setup-*`)
    * runtime detection over hardcoding
    * naming and namespacing (the `iru-` prefix, with the collision rationale)
  - [x] Task 5.3. Link `xref:ai-catalog::guides/authoring-effective-instructions.adoc[]` and
    `xref:ai-catalog::guides/creating-skills-and-agents.adoc[]`. Add References: Claude Code skills docs and Anthropic
    Agent Skills best practices (verify URL).

### Group 3 — Agents and orchestration

**Parallelizable: yes.** Two independent pages (Tasks 6–7).

- [x] Task 6. Create `subagents-and-custom-agents.adoc` ("Subagents & Custom Agents"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/subagents-and-custom-agents.adoc`. Verified live against
  https://code.claude.com/docs/en/sub-agents (built-in types, the full `.claude/agents/*.md` frontmatter table
  and precedence order), https://code.claude.com/docs/en/agent-teams (agent-team architecture, the
  `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` env var, the subagent-vs-team comparison table used as the basis for
  Task 6.4's decision table),
  https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli
  (`.github/agents/*.agent.md`, `~/.copilot/agents/`, frontmatter: `name`, `description`, `tools`,
  `include-custom-instructions`) and https://code.visualstudio.com/docs/agent-customization/custom-agents (VS
  Code custom agents formerly "chat modes", the `.claude/agents/` and `.github/agents/` locations it also reads,
  and the `handoffs` array's `label`/`agent`/`prompt`/`send` keys). Both pinned ai-catalog agent files
  (`iru-gate-runner.md`, `iru-isolated-skill-executor.md`) were read with `git show
  origin/main:.claude/agents/<name>.md` at SHA `58fb70954404f9d539031a02ac6d4413f03745be` (re-confirmed as the
  current `origin/main` at implementation time, unchanged from the plan's pinned SHA) and excerpts match
  verbatim. One fact needed the "describe without naming" fallback: GitHub's CLI custom-agents doc does not
  document an inter-agent handoff key for Copilot's own agents the way VS Code's `handoffs` array does, so the
  page describes Copilot's invocation modes (explicit naming, inference, slash command) without asserting a
  Copilot-side handoff key exists, and covers `handoffs` only under the VS Code custom-agents section where it
  is actually documented. `xref:ai-catalog::agents/overview.adoc[]` is linked per Task 6.4; the planned *AI
  Agents* sub-section is named only in prose. `xref:ai/customizing-ai-workflows/orchestration-patterns.adoc[]`
  is linked per the plan's explicit allowance (Task 7, this page's parallel sibling, was not yet on disk at
  write time).
  - [x] Task 6.1. Cover Claude Code subagents: the built-ins (verify the current list, e.g. Explore, Plan,
    general-purpose) and custom `.claude/agents/*.md`.
    * Add a frontmatter table for `name`, `description`, `tools`, `model`, `color`, `permissionMode`, `skills`,
      `mcpServers`, and any other documented key, verified against `sub-agents`.
    * Each subagent gets its own context window and returns a result to the parent.
  - [x] Task 6.2. Cover Copilot custom agents: `.github/agents/*.agent.md` and VS Code custom agents (which replaced chat
    modes), with frontmatter (verify) and handoffs (verify the current key and behaviour).
  - [x] Task 6.3. Examples: excerpts of pinned `iru-gate-runner.md` and `iru-isolated-skill-executor.md`, and a
    generalised reviewer agent in both tools. Add 📊 a Mermaid diagram of context isolation (the main context receives
    only the summary).
  - [x] Task 6.4. Add a decision table: subagent vs. `context: fork` skill vs. agent team (verify `agent-teams`). Link
    `xref:ai-catalog::agents/overview.adoc[]`. Name the planned *AI Agents* sub-section in prose for general agent
    architecture.
- [x] Task 7. Create `orchestration-patterns.adoc` ("Orchestration Patterns"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/orchestration-patterns.adoc`, plus the SVG at
  `modules/ROOT/images/ai-customizing-ai-workflows-catalog-pipeline.svg`. Re-verified the pinned SHA is still
  current (`git -C ~/irurueta2/common/ai-catalog rev-parse origin/main` = `58fb70954404f9d539031a02ac6d4413f03745be`,
  unchanged from planning time) before excerpting `.claude/skills/{iru-issue,iru-explore,iru-plan,iru-code,
  iru-code-one-task-group,iru-java-code-one-task-group}/SKILL.md` and `.claude/agents/iru-gate-runner.md` via
  `git show origin/main:<path>`; every excerpt was copied verbatim from those pinned files (`Skill(...)` /
  `Agent(...)` calls, the `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task-group"` dispatch-by-key
  snippet, the `Base branch:` / `.archive/` durable-state passages, and the `TaskCreate`/`TaskUpdate` progress
  tracking excerpt). `Skill`, `Agent`, `TaskCreate` and `TaskUpdate` were confirmed as real, currently documented
  Claude Code tools via a live fetch of https://code.claude.com/docs/en/tools-reference on 2026-09-28 (alongside
  https://code.claude.com/docs/en/sub-agents for the `Agent` tool's parameters and isolated-context/return-result
  semantics), so nothing needed the "describe without naming" fallback the task flagged as a possibility. Page is
  Claude-Code-specific (no `.In Claude Code`/`.In GitHub Copilot` side-by-side blocks), since Copilot has no
  equivalent to `Skill(...)`/`Agent(...)` programmatic composition — the lead paragraph states this plainly rather
  than forcing a side-by-side. The SVG shows the full pipeline plus a fan-out/fan-in example (`iru-code` →
  `iru-code-one-task-group` → `iru-<key>-code-one-task-group` fanning out to parallel per-task agents, fanning back
  in through `iru-gate-runner`); a Mermaid sequence diagram illustrates the same fan-out/fan-in shape a second way
  per the plan's optional-mermaid allowance. Verified the SVG renders legibly with no text overflow via the
  Browser pane. Links `xref:ai-catalog::skills/iru-issue.adoc[]`, `iru-plan.adoc`, `iru-code.adoc`,
  `iru-code-one-task-group.adoc`, `xref:ai-catalog::agents/iru-gate-runner.adoc[]` and
  `xref:ai-catalog::guides/common-workflows.adoc[]`, all from the plan's confirmed-target list. Ran a full clean
  `npx antora antora-playbook.yml` build: the only errors touching this page are the two expected dangling xrefs
  to `ai/customizing-ai-workflows/index.adoc` (with and without `#_bibliography`) and
  `optimizing-skills-and-agents.adoc`, both from later plan groups not yet implemented — the same pattern every
  other Group 2/3 sibling page's build output shows. Also ran `npm run validate:mermaid`: all 555 diagrams,
  including this page's new sequence diagram, parsed successfully; `node_modules/.package-lock.json` had no diff
  to restore. No fact on this page could not be verified.
  - [x] Task 7.1. Cover the skill → skill → agent composition, walking through the pinned catalog pipeline:
    `iru-issue` → `iru-explore` → `iru-plan` → `iru-code` → `iru-code-one-task-group` → `iru-<key>-code-one-task-group`
    → `iru-gate-runner`. Excerpt the `Agent(...)` / `Skill(...)` calls from the pinned files.
  - [x] Task 7.2. Cover:
    * dispatch by key (the `find .claude/skills -name "iru-*-…"` pattern)
    * fan-out / fan-in (parallel `Agent` calls in one response)
    * durable state in files (`implementation_plan.md` with checkboxes, the `Base branch:` line, `.archive/`)
    * live task lists (TaskCreate / TaskUpdate; verify they are documented, or describe generically)
    * recovering across sessions
  - [x] Task 7.3. Add 📊 `ai-customizing-ai-workflows-catalog-pipeline.svg` of the pipeline, based on the
    `iru-generate-skill-docs` dependency graph. Keep it legible and within the viewBox. Link
    `xref:ai-catalog::skills/iru-issue.adoc[]`, `iru-plan.adoc`, `iru-code.adoc`, `iru-code-one-task-group.adoc`,
    `xref:ai-catalog::agents/iru-gate-runner.adoc[]` and `xref:ai-catalog::guides/common-workflows.adoc[]`.

### Group 4 — Automation, control, distribution, optimisation and quality

**Parallelizable: yes.** Nine independent pages (Tasks 8–16).

- [x] Task 8. Create `hooks.adoc` ("Hooks"). Files touched:
  `modules/ROOT/pages/ai/customizing-ai-workflows/hooks.adoc` (new). Verified via `WebFetch` against
  code.claude.com/docs/en/hooks and hooks-guide (event list, matcher table, input/output JSON, exit-code table,
  `stop_hook_active`/8-continuation cap) and docs.github.com/en/copilot/concepts/agents/hooks +
  reference/hooks-reference (JSON schema, event names, fail-closed `preToolUse` exit codes, `.github/hooks/*.json` +
  `~/.copilot/hooks/`, cloud-agent/CLI/VS Code-preview surfaces). `npx antora antora-playbook.yml` ran clean for this
  page except the two dangling `index.adoc`/`#_bibliography` xrefs shared by every sibling page in this
  not-yet-created-index group — expected per the task brief. License-header generation does not apply (no code, no
  license-header convention for AsciiDoc pages in this repo).
  - [x] Task 8.1. Event table covers PreToolUse, PostToolUse, PostToolUseFailure, UserPromptSubmit, Stop, SubagentStop,
    SessionStart, SessionEnd, Notification, PreCompact, PostCompact (fires/blocks/matcher), plus a paragraph naming the
    longer documented tail (PermissionRequest, ConfigChange, FileChanged, PreModelSwitch, etc.) without inventing
    detail for those. Matchers, the full input JSON example, the exit-code table (0/2/other) and the three
    event-specific JSON decision shapes (`PreToolUse` `hookSpecificOutput.permissionDecision`, `Stop`/`SubagentStop`
    top-level `decision`, `UserPromptSubmit` `hookSpecificOutput.additionalContext`) are all quoted from the fetched
    reference pages, not invented. `settings.json` placement section has a `.claude/settings.json` block title with
    valid JSON (no comments).
  - [x] Task 8.2. Copilot hooks section verified: `.github/hooks/*.json` + `~/.copilot/hooks/*.json`, `version`/`hooks`
    schema, event names (`preToolUse`/`postToolUse`/.../`agentStop`), fail-closed `preToolUse` exit-code behaviour, and
    surfaces (cloud coding agent + Copilot CLI confirmed on the dedicated hooks page; VS Code listed only as "Preview"
    on GitHub's customization cheat sheet, cited as such rather than asserted as confirmed).
  - [x] Task 8.3. All 5 recipes present, each script reading only documented input fields (`tool_input.file_path`,
    `tool_input.command`, `stop_hook_active`) and each JSON config valid; secret scanning recipe links
    `xref:ai-catalog::skills/iru-check-security.adoc[]` (confirmed as an existing xref target used elsewhere in this
    sub-section).
  - [x] Task 8.4. "Why hooks give deterministic enforcement" section plus a Mermaid `sequenceDiagram` hook lifecycle
    (PreToolUse/PostToolUse/Stop). Links `xref:ai/ai-assisted-development/testing-and-debugging-with-ai.adoc[]` (its
    existing Stop-hook section, confirmed by grep). References list `hooks`, `hooks-guide`, GitHub Copilot Hooks, the
    Copilot Hooks JSON reference and the customization cheat sheet.
- [x] Task 9. Create `permissions-and-settings.adoc` ("Permissions & Settings"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/permissions-and-settings.adoc`. All facts verified live on
  2026-09-28 against https://code.claude.com/docs/en/settings (precedence order: managed >
  `claude --settings` > project local `.claude/settings.local.json` > shared project `.claude/settings.json` >
  user `~/.claude/settings.json`, plus `managed-settings.json` OS paths), https://code.claude.com/docs/en/permissions
  (rule syntax `Tool`/`Tool(specifier)`, `Bash(mvn *)`, `Read(./secrets/**)`, `mcp__server__tool`,
  `WebFetch(domain:…)`, and the documented deny-then-ask-then-allow evaluation order), the `skills` doc's exact
  wording on `allowed-tools` ("deny and ask rules still override allowed-tools"), https://code.claude.com/docs/en/permission-modes
  (full mode table incl. `dontAsk`/`bypassPermissions` risk and `--dangerously-skip-permissions`),
  https://code.claude.com/docs/en/sandboxing and https://code.claude.com/docs/en/managed-settings. Copilot's
  `chat.tools.*` keys (`chat.tools.global.autoApprove`, `chat.tools.eligibleForAutoApproval`,
  `chat.tools.terminal.autoApprove`, `chat.tools.urls.autoApprove`) and the four-level approval picker (Manual
  permissions / Assisted permissions / Allow all / Autopilot) were verified against the canonical
  https://code.visualstudio.com/docs/agents/run/approvals (found via WebSearch after the guessed
  `chat-agent-mode` URL redirected away from it). Org policies link reuses
  https://docs.github.com/en/copilot/concepts/enterprise/policies, already the pinned URL in
  `team-practices-and-adoption.adoc`. CI-safe-defaults example shows a narrow `--allowedTools` allowlist plus
  `--permission-mode dontAsk` (Claude Code) and a `chat.tools.terminal.autoApprove` per-command allowlist
  (Copilot) -- no broad bypass in either. `.claude/settings.json` example validated as parseable JSON via a
  Python check. `npx antora antora-playbook.yml` run afterward: the only errors on this page are the two
  expected dangling xrefs to the not-yet-created sibling `index.adoc` (disclaimer include and Related pages),
  matching every other Group 2-4 page written in parallel; no error specific to this page's own content.
  License-header: n/a (AsciiDoc/JSON page content, no source files).
  - [x] Task 9.1. Settings hierarchy/precedence table (5 levels, highest first) with OS-specific
    `managed-settings.json` paths, plus a valid `.claude/settings.json` example (path in the block title,
    `permissions.allow`/`ask`/`deny` plus `env`).
  - [x] Task 9.2. Allow/ask/deny rule-syntax table covering all four named forms, the deny-then-ask-then-allow
    evaluation order, the permission-modes table (linking `claude-code-getting-started.adoc` for the basics),
    a sandboxing summary (linking `securing-ai-assisted-development.adoc`), and a dedicated section on how
    skill `allowed-tools` composes with settings (additive grant, clears next turn, cannot override deny/ask).
  - [x] Task 9.3. Copilot approval-picker table (4 levels with risk) and `chat.tools.*` settings table, org
    policies in prose, and a side-by-side "Safe defaults for CI" example (narrow allowlist, no
    `bypassPermissions`/`--dangerously-skip-permissions`/`chat.tools.global.autoApprove`/Autopilot), plus a
    managed-settings-for-CI paragraph linking `managed-settings` and
    `xref:ai/ai-assisted-development/headless-and-ci-automation.adoc[]`.
- [x] Task 10. Create `mcp-configuration.adoc` ("Configuring MCP Servers"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/mcp-configuration.adoc`. All facts verified live on
  2026-09-28: `.mcp.json` scopes/precedence and `claude mcp add` flags (`--scope`, `--transport`, `--env`,
  `--header`, the `--` separator for stdio commands, `${VAR}`/`${VAR:-default}` expansion) against
  https://code.claude.com/docs/en/mcp; VS Code's `.vscode/mcp.json` `servers` key and `${input:...}` syntax
  against https://code.visualstudio.com/docs/agent-customization/mcp-servers and
  https://code.visualstudio.com/docs/agents/reference/mcp-configuration#_input-variables-for-sensitive-data; the
  Copilot coding-agent MCP config (repository settings JSON, `mcpServers`, required `tools` allowlist,
  `COPILOT_MCP_`-prefixed secrets referenced as `$COPILOT_MCP_<NAME>` / `${COPILOT_MCP_<NAME>}`) against the
  canonical https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers
  (resolved via `curl -sI -L`, since the docs.github.com URL paths for this page have moved more than once);
  and `mcp__<server>__<tool>` permission naming, matched against a `permissions.allow` rule in the same
  `"allow"`/`"ask"`/`"deny"` shape confirmed on `code.claude.com/docs/en/settings`, against
  https://code.claude.com/docs/en/mcp. No fact needed the "describe without naming" fallback. No example
  hardcodes a secret -- every credential is a `${...}`/`$COPILOT_MCP_...` reference or an `${input:...}`
  prompt. `xref:ai/customizing-ai-workflows/permissions-and-settings.adoc[]` and
  `xref:ai/customizing-ai-workflows/plugins-and-marketplaces.adoc[]` are dangling (Tasks 9 and 12, this task's
  parallel Group 4 siblings, not yet on disk at write time), per the plan's explicit allowance for concurrent
  Group 4 tasks.
  - [x] Task 10.1. This page covers *using* MCP servers; building them belongs to the planned *MCP* sub-section, named
    in prose. Cover:
    * `.mcp.json` and scopes (local / project / user; verify file locations)
    * `claude mcp add` (stdio and http, `--scope`, env vars; no hardcoded secrets)
    * VS Code `mcp.json` (the `servers` key, `${input:…}` for secrets)
    * the Copilot cloud-agent MCP config (the `tools` allowlist, `COPILOT_MCP_` secrets; verify)
  - [x] Task 10.2. Cover tool naming for permissions (`mcp__<server>__<tool>`, with a permissions example) and bundling
    MCP in plugins (link Task 13's page). Link `xref:ai/ai-assisted-development/agent-mode.adoc[]` for using tools in a
    session.
- [x] Task 11. Create `output-styles-statusline-and-more.adoc` ("Output Styles, Status Line & More"). File
  created at `modules/ROOT/pages/ai/customizing-ai-workflows/output-styles-statusline-and-more.adoc`. Verified
  live against https://code.claude.com/docs/en/output-styles (built-in styles table, `outputStyle` setting,
  custom style file locations/frontmatter), https://code.claude.com/docs/en/statusline (`statusLine`
  `type`/`command`/`padding` keys, the JSON-on-stdin input contract), https://code.claude.com/docs/en/keybindings
  (`~/.claude/keybindings.json` `$schema`/`$docs`/`bindings` shape, contexts and actions), and
  https://code.claude.com/docs/en/env-vars (the commonly used variables table). Also verified
  https://code.visualstudio.com/docs/configure/keybindings for VS Code's own general `keybindings.json` as the
  closest real analog for that one surface. All four JSON snippets validated as parseable JSON. No fact required
  the "describe without naming" fallback. Per the task's own guidance, output styles and the status line are
  stated in prose to have no Copilot equivalent rather than forced into side-by-side blocks; only keybindings
  gets a genuine VS Code analog, shown briefly.
  - [x] Task 11.1. Cover output styles (verify built-ins and custom style files), the status line (a
    `statusLine` config plus a small script, verified against `statusline`), keybindings (verify the
    `~/.claude/keybindings.json` format), and environment variables (a short table of commonly used ones, verified
    against `settings`/`env-vars`). Each surface gets a brief description, an example and its official link.
- [x] Task 12. Create `plugins-and-marketplaces.adoc` ("Plugins & Marketplaces"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/plugins-and-marketplaces.adoc`. Every `plugin.json` and
  `marketplace.json` field, the standard directory layout, `/plugin marketplace add`/`/plugin install`,
  versioning/auto-update defaults, and the `extraKnownMarketplaces`/`enabledPlugins` settings keys were verified
  live against https://code.claude.com/docs/en/plugins, https://code.claude.com/docs/en/plugins-reference,
  https://code.claude.com/docs/en/plugin-marketplaces, https://code.claude.com/docs/en/plugins/marketplace-reference,
  https://code.claude.com/docs/en/plugins/install and https://code.claude.com/docs/en/settings-reference (fetched as
  `.md`, canonical URLs confirmed via `curl -sI -L`) on 2026-09-28. Finding beyond the outline: GitHub Copilot *does*
  now ship a real plugin/marketplace equivalent (Copilot CLI, cloud agent, GitHub Copilot app) -- verified against
  https://docs.github.com/en/copilot/concepts/agents/about-plugins,
  .../copilot-cli/customize-copilot/plugins-marketplace and .../reference/copilot-cli-reference/cli-plugin-reference
  -- including the same `plugin.json`/`marketplace.json` shape and, per that reference page, the same
  `enabledPlugins`/`extraKnownMarketplaces` key names for managed-policy distribution; the page states this and
  notes explicitly where Copilot's own docs don't give the full JSON schema for those keys (only that they exist
  and their managed-policy behavior), rather than assuming Claude Code's exact shape. The pinned ai-catalog SHA
  `58fb70954404f9d539031a02ac6d4413f03745be` was re-confirmed unchanged via
  `git -C ai-catalog rev-parse origin/main`; `iru-check-license/SKILL.md`, `iru-check-security/SKILL.md` and
  `iru-gate-runner.md` were read at that SHA and used only as unmodified referenced/described files (the page
  states plainly, per choice 7, that ai-catalog ships no `.claude-plugin/` or `marketplace.json` on `main`, and
  that the `ai-catalog-gates` `plugin.json`/`marketplace.json` example is new and illustrative). Both JSON examples
  validate with `json.loads`.
  - [x] Task 12.1. Cover the plugin structure: `.claude-plugin/plugin.json` and the directory layout for skills, agents,
    hooks, MCP servers and commands, with every manifest field verified against the plugins reference.
  - [x] Task 12.2. Give a **concrete example** packaging a subset of ai-catalog (e.g. `iru-check-license`,
    `iru-check-security` and `iru-gate-runner`): a full `plugin.json` plus a `marketplace.json`. State plainly that
    ai-catalog does not ship these files yet (choice 7).
  - [x] Task 12.3. Cover `/plugin marketplace add`, `/plugin install`, versioning and updates, team distribution via
    settings (`extraKnownMarketplaces` / `enabledPlugins`; verify key names), and Copilot's equivalent distribution
    options (verify what exists; don't invent). Link `xref:ai-catalog::guides/plugins.adoc[]` and
    `xref:ai-catalog::guides/packaging-and-distribution.adoc[]`.
- [x] Task 13. Create `optimizing-skills-and-agents.adoc` ("Optimizing Skills & Agents"), with `:stem: latexmath`.
  File created at `modules/ROOT/pages/ai/customizing-ai-workflows/optimizing-skills-and-agents.adoc`. **Measured
  numbers and method** (required detail for this task): every `.claude/skills/<name>/SKILL.md` on ai-catalog
  `main` was read via `git -C ai-catalog show origin/main:<path>` at the re-confirmed pinned SHA
  `58fb70954404f9d539031a02ac6d4413f03745be` (`git rev-parse origin/main` matched, unchanged) — **102 skills**
  as of 2026-09-28 (the plan's "~57" estimate was accurate at planning time but is stale; the page states this
  explicitly and uses the current count). `tiktoken` was not pre-installed (`python3 -c "import tiktoken"`
  failed) so it was installed via `pip3 install tiktoken` and used with the `cl100k_base` encoding, stated on
  the page as a documented GPT-family approximation since no offline Claude tokenizer is published (Anthropic's
  live `count_tokens` API is named as the exact-count alternative, not called here for 102 requests' worth of
  budget). Result: the 102 `description` fields (none use `when_to_use` — confirmed unused) total **31,299
  `cl100k_base` tokens** (134,920 characters), average 307 tokens/1,323 characters each — this is the sum
  stem:[\sum_i |d_i|] the MathJax estimate uses. Also measured directly from frontmatter: `model:` splits
  haiku 48 / sonnet 51 / opus 3 of 102; `allowed-tools` is declared on 21 of 102. Progressive disclosure
  (technique 2) is measured too:
  `iru-java-code-one-task/reference/{code-style,class-member-ordering,javadoc,testing}.md` total 6,169
  `cl100k_base` tokens; the routing table's always-read minimum (`code-style.md` + `testing.md`) is 3,504 tokens
  — a 43% reduction for a body-only-edit task. **Described qualitatively, stated as such on the page, because
  they cannot be measured from static files**: technique 3 (context isolation — no public tool sizes a given
  project's Surefire/JaCoCo/SARIF output), technique 5 (validate-once-per-group — the per-run prompt-count
  saving depends on group size N, stated directionally not as an invented number), technique 6 (parallel
  fan-out — wall-clock latency depends on the model/provider/run), technique 9 (deterministic scripts/hooks —
  neither ai-catalog nor this docs repo's own `.claude/skills/` uses a `scripts/` folder or hooks as of this
  commit, verified via `git ls-tree`, so the page documents the exact-command-in-prose pattern actually present
  instead), technique 10 (idempotency — the per-repository saving depends on how much already existed), technique
  11 (pass-through args — the per-run prompt count avoided depends on how many keys the caller already resolved),
  and technique 12 (prompt-cache-friendly structure — whether a given cache breakpoint is hit depends on the
  provider). One additional fact found and reported rather than invented: five of the catalog's own descriptions
  (led by `iru-setup-swift-github-workflows` at 3,546 characters / 917 tokens) exceed the 1,536-character
  description+`when_to_use` cap documented on `skills.adoc`, a real, verbatim-diffed counter-example of technique
  1 lapsing in practice. Effort levels (`low`/`medium`/`high`/`xhigh`/`max`) were verified live against
  https://code.claude.com/docs/en/model-config (fetched 2026-09-28); ai-catalog's `SKILL.md` files do not
  currently set `effort` on any skill, stated as such rather than invented. No fact on this page needed the
  "describe without naming" fallback for a missing key or field. An early draft used a `NOTE:` admonition for the
  stale "~57" caveat and one `` `xref:...` `` inside backticks in the model-tiering table; both were caught and
  fixed before the build (the disclaimer is the only admonition on the page; no `xref:` remains inside
  backticks). Ran a full `npx antora antora-playbook.yml` build: the only errors on this page are the two
  expected dangling xrefs to `ai/customizing-ai-workflows/index.adoc` (with and without `#_bibliography`), the
  same pattern every other Group 2–4 sibling page's build output shows, since Group 5 hasn't run yet.
  - [x] Task 13.1. Each of the 12 techniques from the issue is its own `===` subsection: principle → a pinned
    ai-catalog file link plus a short verbatim excerpt (diffed against `git show origin/main:<path>`) → an
    explicitly labeled "Measured effect" (with the number and method) or "Effect (qualitative)" section. Files
    excerpted: `iru-check-license/SKILL.md`, `iru-setup-swift-github-workflows/SKILL.md` (description length),
    `iru-java-code-one-task/reference/README.md`, `iru-gate-runner.md`, `iru-check-security/SKILL.md`,
    `iru-plan/SKILL.md`, `iru-java-code-one-task-group/SKILL.md`, `docs/guides/extending-the-catalog.adoc`,
    `iru-setup-antora/SKILL.md`, `iru-setup-java-library-repository/SKILL.md`. Frontmatter model/allowed-tools
    counts are computed directly, not estimated.
  - [x] Task 13.2. Added `stem:[\text{tokens}_{\text{always}} \approx \sum_i |d_i|]` inline in the technique-1
    section and the full worked block-stem estimate in its own `[[context-budget-math]]` section: N = 102
    (current, re-measured count; the page states the original "~57" outline estimate explicitly and why it's
    stale), stem:[\sum_{i=1}^{102}|d_i| = 31{,}299] `cl100k_base` tokens, dated 2026-09-28, cross-checked against
    what the original 57-skill estimate would have given at the same per-skill average (~17,500 tokens) to make
    the "cost grows with catalog size" point concrete rather than asserted.
  - [x] Task 13.3. Created `modules/ROOT/images/ai-customizing-ai-workflows-gate-runner.svg` (viewBox 0 0 960
    560, Helvetica/Arial, flat white background, dark hex colors `#8a1c1c`/`#1c5c8a`/`#333333`, no CSS variables,
    no external refs) comparing a naive gate (the raw Surefire-style log stays in the caller's own context and is
    re-read every turn) against `iru-gate-runner` (the same log stays inside its own isolated agent context and
    only a compact pass/fail summary returns). Verified it renders legibly with no text clipping via the Browser
    pane (screenshot confirmed all text fits its box). Links `xref:ai-catalog::guides/extending-the-catalog.adoc[]`
    (model tiering, in the section right after the image) and
    `xref:ai/llm-foundations/cost-latency-and-throughput.adoc[]` (prompt caching, both in that section and as
    technique 12's own reference).
- [x] Task 14. Create `testing-and-evaluating-skills.adoc` ("Testing & Evaluating Skills"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/testing-and-evaluating-skills.adoc`. The pinned ai-catalog SHA
  `58fb70954404f9d539031a02ac6d4413f03745be` was re-confirmed as the current `origin/main` at implementation
  time (unchanged). The `$TMPDIR/iru-verify` convention was located and excerpted verbatim (diffed against
  `git show origin/main:<path>`) from two confirmed-xref guide pages --
  `docs/modules/ROOT/pages/guides/creating-skills-and-agents.adoc` ("Ask Claude Code itself to draft it" step 3)
  and `docs/modules/ROOT/pages/guides/extending-the-catalog.adoc` ("Throwaway-directory verification") -- rather
  than a `SKILL.md`; the many `SKILL.md`-level `$TMPDIR/iru-verify` hits found (Android/Swift/TypeScript setup
  skills) are all out of the confirmed-xref list per the plan's Choice 6, so they were not used or linked, only
  the two guide pages, which are confirmed. A "skill-creator" tool was searched for on
  https://code.claude.com/docs/en/skills, https://platform.claude.com/docs/en/agents-and-tools/agent-skills/
  best-practices and quickstart -- none of Anthropic's own docs pages name or document a packaged
  "skill-creator" tool (only third-party/community sources describe one), so per the task's fallback the page
  describes the general skill-authoring-and-testing workflow instead (Anthropic's documented "Evaluation and
  iteration" section: build-evaluations-first, the Claude-A/Claude-B iterative loop, the evaluation JSON record
  shape) and says explicitly in-page that no official skill-creator doc was confirmed. Trigger-accuracy and
  regression-suite content is grounded in the same official "Evaluation and iteration" section (quoted directly,
  with attribution); the should-fire/shouldn't-fire table reuses the pinned `iru-check-license` description from
  the sibling `writing-effective-skills.adoc`. Versioning/changelog content notes that neither Claude Code's
  skills reference nor the Agent Skills standard define a per-skill version field, contrasts it with the Claude
  API's documented `version: "latest"` for Anthropic-managed skills, and describes how the pinned ai-catalog
  repository actually tracks this (git history per `SKILL.md`, pinned-commit links, and the confirmed
  `xref:ai-catalog::skills/iru-setup-changelog.adoc[]` skill plus `iru-release` for its repo-level
  `CHANGELOG.md` -- ai-catalog does not version individual skills). The planned *LLMOps & Evaluation*
  sub-section is named in prose only, no xref. `npx antora antora-playbook.yml` was run; the only xref errors
  against this new page are forward references to not-yet-created siblings (`index.adoc`,
  `optimizing-skills-and-agents.adoc`), the same category every other Group 2-6 sibling page already carries.
  - [x] Task 14.1. Cover trigger-accuracy tests (a should-fire / shouldn't-fire prompt table plus how to run them),
    dry runs in a temp checkout (the catalog's `$TMPDIR/iru-verify` rule, excerpted), golden-output checks, and
    regression suites when editing skills.
  - [x] Task 14.2. Cover versioning and a changelog for skills, and using the skill-creator workflow (verify what is
    officially documented, e.g. Anthropic's skill-creator skill or Agent Skills docs, and link only official sources).
    Name the planned *LLMOps & Evaluation* sub-section in prose.
- [x] Task 15. Create `security-of-customizations.adoc` ("Security of Customizations"). File created at
  `modules/ROOT/pages/ai/customizing-ai-workflows/security-of-customizations.adoc`. Verified live against
  https://code.claude.com/docs/en/security (core protections, prompt-injection guidance),
  https://code.claude.com/docs/en/plugins/security (the plugin trust model, the marketplace-tier table, the
  exact review-before-install steps and trust-warning text, quoted verbatim),
  https://code.claude.com/docs/en/managed-settings (the per-OS `managed-settings.json` paths and the
  deny-`.env`/`disableBypassPermissionsMode` example, taken verbatim from the docs' own walkthrough),
  https://code.claude.com/docs/en/settings-reference (`apiKeyHelper` confirmed as a real documented key before
  naming it, with its exact one-line description) and
  https://modelcontextprotocol.io/docs/2025-11-25/tutorials/security/security_best_practices (the canonical MCP
  security best-practices page; the old `/specification/.../security_best_practices` URL redirects to it,
  confirmed via `curl -sI -L`), plus https://code.claude.com/docs/en/mcp for Claude Code's own MCP trust
  warning and the `mcp__<server>__<tool>` permission-naming syntax. All URLs confirmed canonical (200, no
  further redirect) via `curl -sI -L -o /dev/null -w '%{url_effective}'`. No fact needed the "describe without
  naming" fallback. The least-privilege `allowed-tools` bad-vs-good pair uses an illustrative
  `run-release-checklist` skill (not a real ai-catalog file): the bad example is a bare `allowed-tools: Bash`
  grant, explained as risky rather than demonstrated as a working exploit, and no example on the page hardcodes
  a secret -- the hook-script and `.mcp.json` examples all read from the environment or an
  `\{escaped-placeholder}`/`${...}` form. Fixed one AsciiDoc issue found while building: a literal `${VAR}` in
  prose (even backticked) triggers Asciidoctor's `{attribute}` substitution and warns `missing attribute: var`;
  reworded to escape the brace (`$\{VAR}`). `npx antora antora-playbook.yml` build shows only the two expected
  dangling xrefs to `ai/customizing-ai-workflows/index.adoc` (with and without `#_bibliography`), not yet
  created by Group 5 -- the same pattern every other Group 2--4 sibling page's build output shows.
  - [x] Task 15.1. Cover:
    * trusting third-party skills, plugins and MCP servers (a review checklist)
    * prompt injection via tool output and files
    * secrets in hooks and settings (`apiKeyHelper`, env vars, no committed secrets)
    * least-privilege `allowed-tools`, with a bad-vs-good example
    * reviewing plugin contents before install
    * managed settings for organisations, with a verified example
  - [x] Task 15.2. Link `xref:ai/ai-assisted-development/securing-ai-assisted-development.adoc[]` and
    `xref:ai-catalog::skills/iru-check-security.adoc[]`. Name the planned *AI Security & Responsible AI* sub-section in
    prose. Add References: Claude Code `security`, `managed-settings`, MCP security best practices.
- [x] Task 16. Create `copilot-and-claude-code-equivalents.adoc` ("Copilot & Claude Code Equivalents"). File created
  at `modules/ROOT/pages/ai/customizing-ai-workflows/copilot-and-claude-code-equivalents.adoc`. Every cell was
  verified live on 2026-09-28 (all target URLs re-checked via `curl -sI -L`), including facts not in the plan's
  outline that materially changed several rows: VS Code's Local harness can now read Claude Code's own
  `.claude/settings.json` hooks directly (`chat.useClaudeHooks`,
  https://code.visualstudio.com/docs/agent-customization/hooks); VS Code ships its own cross-tool *Agent
  Plugins* standard (`plugin.json`, agent-plugins.org 1.0) that also loads Claude Code's plugin format for
  backward compatibility, filling the row where GitHub Copilot itself has no native plugin/marketplace
  mechanism (its GitHub-App-based Copilot Extensions marketplace was deprecated in favor of MCP); and VS Code's
  MCP config accepts either its native `.vscode/mcp.json` or the portable `.mcp.json` `mcpServers` shape Claude
  Code also reads. Output styles and the status line were each verified to have **no documented Copilot/VS Code
  equivalent** as of 2026-09-28 (checked against VS Code's agent-customization overview and Copilot's own
  docs) and the table says so plainly rather than inventing one. ai-catalog's pinned commit
  `58fb70954404f9d539031a02ac6d4413f03745be` was re-confirmed as the current `origin/main` at implementation
  time (`git clone --depth 1`). The Group 4 sibling pages this page xrefs
  (`hooks.adoc`, `mcp-configuration.adoc`, `permissions-and-settings.adoc`, `plugins-and-marketplaces.adoc`,
  `output-styles-statusline-and-more.adoc`) were parallel, not-yet-on-disk tasks at write time, so their
  specific surfaces were verified independently against the official docs rather than against those pages'
  content, per the plan's guidance for this task.
  - [x] Task 16.1. Mapping table added, one row per surface (instructions, path instructions, prompt
    files/commands, skills, agents, hooks, MCP config, permissions, plugins/distribution, output styles, plus a
    status-line row since the section groups it with output styles), columns Claude Code / GitHub Copilot (VS
    Code, cloud agent and CLI noted per-cell where they diverge) / AGENTS.md-only, every cell linked to the
    official page verified live.
  - [x] Task 16.2. `== Migrating a Claude-first catalog to also serve Copilot` covers the four additions
    (`AGENTS.md`, `.github/copilot-instructions.md`, `.github/agents/*.agent.md`, prompt files -- with prompt
    files noted as usually unnecessary given Copilot's Agent Skills deprecation of them) and the shared
    `.claude/skills/` support as the load-bearing fact behind the whole migration; confirmed against ai-catalog
    `main` that it currently has none of these Copilot files. Links
    `xref:ai-catalog::guides/provider-comparison.adoc[]`, read in full and cited (not contradicted) as a
    companion, catalog-side view of the same comparison.

### Group 5 — Landing page, cheat sheet, navigation and cross-links

**Parallelizable: yes.** Every task edits a distinct file; each references only pages from Groups 1–4.

- [x] Task 17. Create `ai/customizing-ai-workflows/index.adoc` ("Customizing AI Workflows").
  - [x] Task 17.1. Write the header, disclaimer and lead: the verified version baseline with real numbers (choice 9),
    the pinned ai-catalog commit, and the customisation surfaces and what each is for. Add the issue's **decision
    table** (always-on rules → instructions, … external capability → MCP). Add 📊
    `ai-customizing-ai-workflows-surfaces.svg`: the surfaces and where they load into context.
  - [x] Task 17.2. Add `== What's covered`, grouped like the nav: *Instructions and prompts / Skills / Agents /
    Automation and control / Distribution / Optimisation and quality / Cheat sheet*. Every page is an `xref:` with a
    one-line summary.
  - [x] Task 17.3. Add `== Bibliography`, built **after** reading all 15 pages' `== References` plus inline links. Group
    it as:
    * **Requester-provided books**, one line each:
      * Osmani, *Beyond Vibe Coding: From Coder to AI-Era Developer*, O'Reilly, 1st ed. Aug 2025, ISBN
        979-8-341-63475-6, https://www.oreilly.com/library/view/beyond-vibe-coding/9798341634749/ ; no code repo,
        companion https://beyond.addy.ie/ .
      * Albada, *Building Applications with AI Agents: Designing and Implementing Multiagent Systems*, O'Reilly, 1st ed.
        Sep 2025, ISBN 978-1-098-17650-1, https://www.oreilly.com/library/view/building-applications-with/9781098176495/ ,
        code https://github.com/michaelalbada/BuildingApplicationsWithAIAgents .
    * **Official documentation**, with sub-groups Claude Code / Anthropic platform, GitHub Copilot, VS Code, and
      ai-catalog (repo, published docs, the component).
    * **Specifications and standards**: AGENTS.md, the Agent Skills standard, MCP.
    * **Papers and engineering articles**: the Anthropic context-engineering, tools, Agent Skills and best-practices
      posts.
    * The house closing sentence.
  - [x] Task 17.4. Run a script check: every cited URL is in `== Bibliography`, and there are 0 duplicates and 0
    redirecting legacy URLs.
    * **Progress note (Task 17, by airurueta@napptilus.com's agent):** Created
      `modules/ROOT/pages/ai/customizing-ai-workflows/index.adoc` (header/disclaimer/lead with the version
      baseline + pinned ai-catalog commit, decision table, `== What's covered` grouped like the nav, and a full
      `== Bibliography`) plus `modules/ROOT/images/ai-customizing-ai-workflows-surfaces.svg`. Bibliography check
      (ad hoc Python script over all 15 sibling pages' cited URLs, incl. inline links): **PASS** -- 84 distinct
      cited URLs (excluding fictitious in-example URLs like the placeholder Slack webhook and
      `mcp.internal.example.com`), all present in `== Bibliography`, 0 duplicate URLs within the section, 0
      redirecting/legacy URL patterns. Fixed by adding the ai-catalog per-file excerpt blob links, the
      `agent-plugins.org` plugin-schema URL, the two `schemastore.org` JSON-schema URLs and the
      `github.com/albertoirurueta` account link, none of which were in the first draft. Antora build
      (`npx antora antora-playbook.yml`) shows no xref/AsciiDoc errors for this page or the new SVG; the only
      errors in the run are pre-existing, from the parallel `cheat-sheet.adoc` task, and not touched here.
- [x] Task 18. Create `ai/customizing-ai-workflows/cheat-sheet.adoc` and
  `modules/ROOT/attachments/ai-customizing-ai-workflows-cheat-sheet.pdf` — both created; PDF verified 1-page A4
  with no clipped text via `fitz`, and `git status --porcelain` showed no stray `.html`.
  - [x] Task 18.1. The page has a header, disclaimer and intro, back-links grouped like the nav, the
    `xref:attachment$ai-customizing-ai-workflows-cheat-sheet.pdf[Download the Customizing AI Workflows Cheat Sheet (PDF)]`
    link, and its own `== References`. Mirror `ai/ai-assisted-development/cheat-sheet.adoc`. — done at
    `modules/ROOT/pages/ai/customizing-ai-workflows/cheat-sheet.adoc`.
  - [x] Task 18.2. Author a single A4 HTML/CSS layout **in the session scratchpad only**, e.g.
    `<scratchpad>/cheatsheet-204/`, in the style of `cheatsheet-203/`.
    * It has a header with the versions and date, and the breadcrumb "Irurueta Docs › Guides & References › AI ›
      Customizing AI Workflows".
    * It has one box per issue item: the surfaces decision table, file locations for both tools, the SKILL.md and agent
      frontmatter reference, hook events and exit codes, permission rule syntax, plugin layout, the 12 optimisation
      techniques, the skill-testing checklist, and the security checklist.
    * **Every key, path and command must be copied from the final page text.**
    — done at `<scratchpad>/cheatsheet-204/cheat-sheet.html`; every key/path/command was copied verbatim from the
    final `instruction-and-memory-files.adoc`, `skills.adoc`, `subagents-and-custom-agents.adoc`, `hooks.adoc`,
    `permissions-and-settings.adoc`, `plugins-and-marketplaces.adoc`, `optimizing-skills-and-agents.adoc`,
    `testing-and-evaluating-skills.adoc` and `security-of-customizations.adoc` page text (grepped/read each
    before writing the HTML). Never written into the repo.
  - [x] Task 18.3. Render with headless Chrome using `--no-pdf-header-footer`. Check with `fitz` that it is 1 page, A4,
    with no clipping (PNG). Copy only the PDF into the repo, then run `git status --porcelain` to confirm no `.html`
    landed. — rendered with `/Applications/Google Chrome.app/.../Google Chrome --headless --disable-gpu
    --no-pdf-header-footer`; `fitz` check: page count 1, page size 594.96×841.92pt (A4, within 2pt tolerance),
    0 text blocks extending beyond the page rect (PNG at 3x DPI visually confirmed no clipped/overlapping
    content). Copied only `cheat-sheet.pdf` to
    `modules/ROOT/attachments/ai-customizing-ai-workflows-cheat-sheet.pdf`; `git status --porcelain` in the repo
    shows no `.html` entry anywhere (checked with `grep -i '\.html'`, no match).
- [x] Task 19. Edit `modules/ROOT/nav.adoc`. After `**** xref:ai/ai-assisted-development/cheat-sheet.adoc[Cheat Sheet (PDF)]`
  and before `** xref:git-and-github/index.adoc[Git & GitHub]`, insert:
  (Done: inserted the 17-line "Customizing AI Workflows" block at `modules/ROOT/nav.adoc` lines 1087-1103,
  between the cheat sheet line and the Git & GitHub line. Verified via grep.)
  ```
  *** xref:ai/customizing-ai-workflows/index.adoc[Customizing AI Workflows]
  **** xref:ai/customizing-ai-workflows/instruction-and-memory-files.adoc[Instruction & Memory Files]
  **** xref:ai/customizing-ai-workflows/prompt-files-and-slash-commands.adoc[Prompt Files & Slash Commands]
  **** xref:ai/customizing-ai-workflows/skills.adoc[Skills]
  **** xref:ai/customizing-ai-workflows/writing-effective-skills.adoc[Writing Effective Skills]
  **** xref:ai/customizing-ai-workflows/subagents-and-custom-agents.adoc[Subagents & Custom Agents]
  **** xref:ai/customizing-ai-workflows/orchestration-patterns.adoc[Orchestration Patterns]
  **** xref:ai/customizing-ai-workflows/hooks.adoc[Hooks]
  **** xref:ai/customizing-ai-workflows/permissions-and-settings.adoc[Permissions & Settings]
  **** xref:ai/customizing-ai-workflows/mcp-configuration.adoc[Configuring MCP Servers]
  **** xref:ai/customizing-ai-workflows/output-styles-statusline-and-more.adoc[Output Styles, Status Line & More]
  **** xref:ai/customizing-ai-workflows/plugins-and-marketplaces.adoc[Plugins & Marketplaces]
  **** xref:ai/customizing-ai-workflows/optimizing-skills-and-agents.adoc[Optimizing Skills & Agents]
  **** xref:ai/customizing-ai-workflows/testing-and-evaluating-skills.adoc[Testing & Evaluating Skills]
  **** xref:ai/customizing-ai-workflows/security-of-customizations.adoc[Security of Customizations]
  **** xref:ai/customizing-ai-workflows/copilot-and-claude-code-equivalents.adoc[Copilot & Claude Code Equivalents]
  **** xref:ai/customizing-ai-workflows/cheat-sheet.adoc[Cheat Sheet (PDF)]
  ```
- [x] Task 20. Edit `modules/ROOT/pages/ai/index.adoc`.
  - [x] Task 20.1. Replace the "Customizing AI Workflows … (planned)" bullet with
    `xref:ai/customizing-ai-workflows/index.adoc[Customizing AI Workflows]` plus a one-line scope.
  - [x] Task 20.2. Append to `:keywords:`: `CLAUDE.md, AGENTS.md, copilot-instructions.md, prompt files, Agent Skills,
    SKILL.md, subagents, custom agents, hooks, Claude Code plugins, plugin marketplace, permissions`. In
    `== Books used in this section`, add a link from the Albada line (and the Osmani line) to
    `xref:ai/customizing-ai-workflows/index.adoc#_bibliography[Customizing AI Workflows' bibliography]`, with non-empty
    link text.
  - Progress note: file touched `modules/ROOT/pages/ai/index.adoc`. Bullet replaced with the xref'd
    "Customizing AI Workflows" entry; `:keywords:` appended with the listed terms; Osmani's and Albada's
    bibliography lines both now link to `Customizing AI Workflows' bibliography` (Albada's trailing sentence
    rewritten to reflect it is now actually cited there, while AI Agents remains "planned"). Verified with
    `grep -n "customizing-ai-workflows"` -> exactly 3 matches. No blockers.
- [x] Task 21. Edit `modules/ROOT/pages/index.adoc` (root). Append to `:keywords:`, skipping any already present:
  `CLAUDE.md, AGENTS.md, Agent Skills, Claude Code hooks, Claude Code plugins, custom agents, prompt files`.
  Progress: edited `modules/ROOT/pages/index.adoc` line 3 (`:keywords:`). None of the 7 terms were already
  present, so all 7 were newly appended: `CLAUDE.md, AGENTS.md, Agent Skills, Claude Code hooks, Claude Code
  plugins, custom agents, prompt files`. Verified with `grep -o ... | sort | uniq -c` -> each term appears
  exactly once. No blockers.
- [x] Task 22. Add cross-links in the existing AI-Assisted Development pages. Each is a distinct file; change links and
  sentences only.
  - [x] Task 22.1. In `ai/ai-assisted-development/context-management.adoc`, turn the prose "Customizing AI Workflows"
    mention(s) into `xref:ai/customizing-ai-workflows/instruction-and-memory-files.adoc[Instruction & Memory Files]`.
    Where subagents are mentioned, link `subagents-and-custom-agents.adoc`.
  - [x] Task 22.2. In `ai/ai-assisted-development/plan-first-workflows.adoc`, link
    `xref:ai/customizing-ai-workflows/subagents-and-custom-agents.adoc[]` from the custom-plan-agents text and
    `xref:ai/customizing-ai-workflows/skills.adoc[]` from the quality-gate / worked-example text.
  - [x] Task 22.3. In `ai/ai-assisted-development/headless-and-ci-automation.adoc`, add one sentence linking
    `xref:ai/customizing-ai-workflows/permissions-and-settings.adoc[Permissions & Settings]` for CI permission settings,
    and `hooks.adoc` if hooks are mentioned.
  - [x] Task 22.4. Grep every other `ai/ai-assisted-development/*.adoc` for "Customizing AI Workflows" in prose, e.g.
    `testing-and-debugging-with-ai.adoc` (Stop hook), `team-practices-and-adoption.adoc` (shared skill libraries) and
    `agent-mode.adoc`. Replace each mention with a real `xref:` to the matching new page. List every file touched in the
    progress note.
  - Progress note (Task 22): all 4 sub-tasks done; no dangling xrefs (all 15 target pages under
    `ai/customizing-ai-workflows/` already exist), no remaining "planned Customizing AI Workflows" mentions
    (verified by grep). Files touched:
    - `modules/ROOT/pages/ai/ai-assisted-development/context-management.adoc` -- instruction-files sentence now links
      `xref:ai/customizing-ai-workflows/instruction-and-memory-files.adoc[Instruction & Memory Files]`; subagents
      "defining a named, reusable subagent" sentence now also links
      `xref:ai/customizing-ai-workflows/subagents-and-custom-agents.adoc[Subagents & Custom Agents]`.
    - `modules/ROOT/pages/ai/ai-assisted-development/plan-first-workflows.adoc` -- VS Code custom-agent paragraph now
      links `xref:ai/customizing-ai-workflows/subagents-and-custom-agents.adoc[Subagents & Custom Agents]`; the
      iru-plan worked-example sentence now links `xref:ai/customizing-ai-workflows/skills.adoc[Skills]`.
    - `modules/ROOT/pages/ai/ai-assisted-development/headless-and-ci-automation.adoc` -- `--bare` hooks mention now
      links `xref:ai/customizing-ai-workflows/hooks.adoc[Hooks]`; end of the CI permission-settings subsection now
      links `xref:ai/customizing-ai-workflows/permissions-and-settings.adoc[Permissions & Settings]`.
    - `modules/ROOT/pages/ai/ai-assisted-development/team-practices-and-adoption.adoc` -- shared-skill-library
      authoring sentence now links `xref:ai/customizing-ai-workflows/skills.adoc[Skills]`.
    - `modules/ROOT/pages/ai/ai-assisted-development/testing-and-debugging-with-ai.adoc` -- Stop-hook-authoring
      sentence now links `xref:ai/customizing-ai-workflows/hooks.adoc[Hooks]`.
    - `modules/ROOT/pages/ai/ai-assisted-development/agent-mode.adoc` -- re-grepped, no "Customizing AI Workflows"
      mentions found; left untouched.

### Group 6 — Build and verify

**Parallelizable: yes** (single task, after Groups 1–5).

- [x] Task 23. Build and verify.
  - [x] Task 23.1. Run `npx antora antora-playbook.yml` on a clean `build/` via an `iru-gate-runner` sub-agent. It must — done: clean build exit 0, 0 errors, 0 warnings (rerun after all self-review fixes).
    exit 0 with **0 errors and 0 warnings**.
  - [x] Task 23.2. Run `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` via a sub-agent. All diagrams must — done: 556/556 Mermaid diagrams parse; `.package-lock.json` restored.
    parse. Restore `node_modules/.package-lock.json`.
  - [x] Task 23.3. Check reachability: — done: 17 HTML files; all 15 pages + cheat sheet linked from index and nav; 3 SVGs present; PDF 1 A4 page.
    * All 15 pages plus `cheat-sheet.adoc` are `xref:`-linked from both the sub-section index and `nav.adoc`.
    * `build/site/ai/customizing-ai-workflows/` has 17 HTML files.
    * Every `ai-customizing-ai-workflows-*.svg` is in `build/site/_images/`.
    * The PDF is 1 page, A4.
  - [x] Task 23.4. Run the grep checks: — done: disclaimer 17/17, no admonitions (the one [IMPORTANT] on prompt-files converted to prose), books only in index, no role captions, no 20NN. lines, one pinned SHA (58fb709), no secrets in #204's changes.
    * The disclaimer include is in all 17 files, and there are no other admonitions.
    * The book surnames (Osmani, Albada) appear only in the index pages.
    * Every content page has `== References` and at least one code block.
    * No `^\[\.[A-Z]` role-captions.
    * No `xref:` inside backticks, and no `#…[]` empty-text fragment xrefs.
    * No page calls an existing AI page "planned".
    * No line-leading `20NN.`.
    * No `\{` inside `----` blocks.
    * No hardcoded secrets in examples (grep for `password`, `token`, `sk-`, `ghp_`).
    * Every ai-catalog GitHub link uses the one pinned SHA.
  - [x] Task 23.5. **Self-review pass.** Delegate to fresh `general-purpose` sub-agents, splitting the 15 pages into 3 — done: 3 parallel self-review agents fixed 168 findings (a: 56, b: 69, c: 43) plus a final consistency pass (d: 14 entries) — logs selfreview204-{a,b,c,d}.json in the scratchpad.
    batches of 5 run in parallel. Each reads its pages and **verifies every hook event, frontmatter key, settings key,
    permission pattern, manifest field, file path, command and URL** against the official docs with WebFetch, applying
    the "Lessons" list above. Fix every real finding, rebuild, and record the findings count and the fixes in the
    progress note.
  - [x] Task 23.6. Re-check that the PDF text (via `fitz`) matches the final pages after the Task 23.5 fixes, and — done: PDF re-rendered from corrected HTML (hook blocking table, decision fields, $0/$1, permission levels, 102-skill count); 1 A4 page; bibliography re-synced (91 URLs, 0 missing/duplicate/non-canonical).
    re-render if needed. Re-run the Task 17.4 bibliography check.

### Group 7 — Integration-branch verification (required by #204 → "Branching, PR target and merge strategy")

**Parallelizable: yes** (single task; sub-tasks in order, after Group 6).

- [x] Task 24. Verify against the integration branch and compute merge readiness.
  - [x] Task 24.1. Commit on `feature/204` with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. — done: committed e949fa57; merged origin/feature/213-ai-section (already up to date, tip 237177d2).
    Do not push, and don't commit `.secrets.baseline`. Then `git fetch origin` and merge the latest
    `origin/feature/213-ai-section` into `feature/204`.
    * **Expected conflict points:** the AI block in `nav.adoc`, `ai/index.adoc` `== Sub-sections` / `:keywords:`, the
      root `:keywords:`, and the AI-Assisted Development pages Task 22 edited.
    * **How to resolve:** keep every sibling's entries in the fixed order.
    * If nothing is new, record "already up to date".
  - [x] Task 24.2. Re-run the Antora build and Mermaid validation on the merged result via `iru-gate-runner`. Both must be — done: merged result identical to the verified tree: Antora exit 0 / 0 errors / 0 warnings; 556/556 Mermaid.
    clean.
  - [x] Task 24.3. Confirm prerequisite **#203** is merged into the integration branch (PR #216, merge commit — done: PR #216 (feature/203) merged; 237177d2 is an ancestor of HEAD.
    `237177d2`), using `gh pr list --base feature/213-ai-section --state merged --json number,headRefName,title`.
  - [x] Task 24.4. Write the *Merge readiness* block to `<scratchpad>/merge-readiness-204.md`: — done: written to <scratchpad>/merge-readiness-204.md (✅ READY). Post-merge: tick #204 in #213 and delete feature/204.
    ```
    ### Merge readiness
    - Target branch: feature/213-ai-section (NOT main; this PR must never be merged into main)
    - Prerequisites: #203 ✅ merged into feature/213-ai-section (PR #216)
    - Antora build + Mermaid validation on the merged result: ✅ passed
    - Status: ✅ READY: can be merged into feature/213-ai-section after human review
    - Reaches main only via the final integration PR feature/213-ai-section → main, owned by collector issue #213, after all 15 AI issues are merged
    ```
    If the build failed, use ❌ and "⏳ WAIT: fix the build first". Add the post-merge chores: tick #204 in #213's
    *Progress* checklist and delete `feature/204`.
