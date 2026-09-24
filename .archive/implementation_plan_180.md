# Implementation Plan: Guides & References / Git Repositories — Git & GitHub

## Task summary

Source: GitHub issue #180
Base branch: main

Issue [#180](https://github.com/albertoirurueta/docs/issues/180) asks for a new **Git Repositories** category under
*Guides & References* (a sibling of Programming Languages, Databases, Web Development, Backend Development and Apps),
containing a **Git & GitHub** section that teaches the basic concepts needed to use Git and GitHub day to day:
repositories, commits, branches, tags, checkout/switch, push, pull (and fetch), merge (and conflicts) and pull
requests. Every concept page explains the concept in detail, gives simple step-by-step instructions for the
**command line** (`git`, and `gh` where relevant), the **GitHub website**, **IntelliJ IDEA** and **VS Code**, and ends
with links to the official documentation. The section closes with a cheat sheet page linking a **one-page
downloadable PDF**.

Concretely:

1. **One new partial**: `modules/ROOT/partials/git-disclaimer.adoc`.
2. **Twelve new AsciiDoc pages**: a category landing page `modules/ROOT/pages/git-repositories/index.adoc`, and under
   `modules/ROOT/pages/git-repositories/git-and-github/` a section landing `index.adoc` (with a `[[_bibliography]]`),
   **nine concept pages** and a `cheat-sheet.adoc`.
3. **Figures**: Mermaid `gitGraph` / `flowchart` / `sequenceDiagram` blocks inline (no hand-drawn SVG figures
   needed — Mermaid's `gitGraph` is the natural notation for commit graphs), plus one home-page tile
   `modules/ROOT/images/git-repositories.svg`.
4. **Site wiring**: a new `** Git Repositories` block at the end of `modules/ROOT/nav.adoc`; a tile and keywords in
   the root `modules/ROOT/pages/index.adoc`.
5. **Reciprocal cross-links** from the GitHub Actions CI/CD pages that assume Git knowledge.
6. **One cheat-sheet PDF**: `modules/ROOT/attachments/git-cheat-sheet.pdf`, exactly one A4 page, rendered from a
   scratch HTML/CSS layout via headless Chromium, visually consistent with `docker-cheat-sheet.pdf`. Only the PDF is
   committed.

The issue body is the authoritative content spec (section "Proposed pages" and "Cheat sheet PDF content"); **each
page task must re-read its row of that table while writing**. The sub-tasks below summarise it.

Decisions made on the user's behalf (no question was needed — stated so review can challenge them):

- **Directory layout.** `git-repositories/` is the category (like `apps/`), `git-repositories/git-and-github/` the
  section (like `apps/react-native/`). This leaves room for future siblings (e.g. GitLab, Bitbucket, Git internals)
  without moving pages.
- **Version baseline.** Git 2.55.x, GitHub CLI 2.101.x, IntelliJ IDEA 2026.2, current stable VS Code with the
  *GitHub Pull Requests and Issues* extension (`GitHub.vscode-pull-request-github`), github.com as of September 2026;
  default branch `main`.
- **`switch`/`restore` first, `checkout` explained.** Examples prefer `git switch` / `git restore` (stable since Git
  2.23 split `checkout`); `git checkout` gets its own page because the issue names it and it remains ubiquitous in
  existing tutorials and scripts.
- **GitHub Desktop** is mentioned only where the official GitHub docs give it as an alternative (pull requests,
  cloning); it is not one of the three required environments, so no full walkthroughs.
- **Branching workflows.** The branches page describes GitHub flow and a Git-flow-style model, using this account's
  real convention (`develop`, `feature/<id>`, `hotfix/<id>`, `release_x.y.z`, as used by the `iru-issue` and
  `iru-release` skills and the playbook's `release_1.{4..99}*` globs) as the worked example.
- **No bibliography books.** Unlike #158 no books were supplied; the Bibliography lists official sources only
  (Pro Git 2nd ed. is the official git-scm.com book and counts as official).
- **Verification source.** UI steps and menu paths change between releases, so every step list for github.com,
  IntelliJ IDEA and VS Code is checked live against the cited official page at write time (docs.github.com,
  jetbrains.com/help/idea, code.visualstudio.com/docs), never written from memory. Command options are checked
  against git-scm.com/docs and cli.github.com/manual.

No task carries a language/framework tag: the installed `*-code-one-task` skills are `java`, `java-springboot`,
`dotnet` and `database`, none of which covers AsciiDoc/Antora documentation — same convention as every prior docs
plan in `.archive/` (e.g. `implementation_plan_158.md`). Shell/YAML snippets inside pages are documentation content.

## Current code state

- **Antora component**: `antora.yml` declares the `irurueta` ROOT component; `modules/ROOT/nav.adoc` (861 lines) is
  its nav. The *Guides & References* categories are `** xref:programming-languages/index.adoc` (line 20),
  `** xref:database/index.adoc` (34), `** xref:web/index.adoc` (238), `** xref:backend/index.adoc` (523) and
  `** xref:apps/index.adoc[Apps]` (825), which runs to the end of the file (last line:
  `**** xref:apps/react-native/cheat-sheet.adoc[Cheat Sheet (PDF)]`). The new block is appended after line 861.
- **Category landing precedent**: `modules/ROOT/pages/apps/index.adoc` — `= Apps`, `:description:`, `:keywords:`, one
  intro paragraph, `== Sections` with one bullet per section (no disclaimer include on the category page).
- **Section precedent**: `modules/ROOT/pages/backend/docker/` — `index.adoc` (reading order "New here? Read in this
  order", "== What's covered" grouped bullets, relationships, `== Bibliography` with `[[_bibliography]]`), concept
  pages ending in `== References`, `cheat-sheet.adoc` with `== Download` →
  `xref:attachment$docker-cheat-sheet.pdf[Download the Docker Cheat Sheet (PDF)]` and `== References`.
- **Disclaimer precedent**: `modules/ROOT/partials/docker-disclaimer.adoc` — one `[IMPORTANT]` / `====` block, one
  sentence of AI-assistance disclosure + `xref:backend/docker/index.adoc#_bibliography[the section bibliography]`.
- **Home page**: `modules/ROOT/pages/index.adoc`, `== Guides & References` (line 94) has a 3-column table whose sixth
  cell (after `image::apps.svg[xref="apps/index.adoc"]`) is empty — the new tile goes there. `:keywords:` (line 3) is
  one long line.
- **Tile precedent**: `modules/ROOT/images/apps.svg` — 600×600, rounded card, vertical gradient
  `#FCA3AF` → accent, white icon in a translucent circle at (300,170), 52px bold title, divider, 25px subtitle,
  "Explore" pill. Accents alternate green `#4ade80` / pink `#ff6ec4` / purple `#7873f5`; the sequence
  (green, pink, purple, green, pink) makes **purple `#7873f5`** next.
- **Nothing Git-specific exists**: no `git-repositories/` directory, no `git-disclaimer.adoc`, no
  `git-cheat-sheet.pdf`. Pages that assume Git/GitHub knowledge and should link back:
  `backend/docker/ci-cd-with-github-actions.adoc`, `apps/react-native/ci-cd-and-over-the-air-updates.adoc`.
- **Validation tooling**: `scripts/validate-mermaid.mjs` (`npm run validate:mermaid`) needs
  `npm i --no-save mermaid@11 jsdom` first; mermaid 11 supports `gitGraph`. CI runs it before
  `npx antora antora-playbook.yml`.
- **Known pitfalls** (from `.archive/implementation_plan_158.md`): every page reports
  `target of xref not found: git-repositories/git-and-github/index.adoc#_bibliography` until the section `index.adoc`
  lands (Group 3) — expected, not a regression; `image::` alt text must contain no commas; no physical line may
  start with a bare `<number>.` token (parsed as an ordered-list marker); a `|` inside a table cell (e.g. menu path
  *Git \| GitHub*) must be escaped as `\|`.

## Implementation steps

> Conventions every page task inherits (do not restate per task):
>
> - Create the file under `modules/ROOT/pages/git-repositories/git-and-github/`; start with `= <Title>`,
>   `:description:`, `:keywords:`, then `include::partial$git-disclaimer.adoc[]`; the intro paragraph states the
>   version baseline in prose.
> - Structure each concept page as: **Concept** (what it is, how Git models it — beginner-friendly, with a Mermaid
>   diagram), **Command line** (runnable `git`/`gh` commands in `[source,bash]` blocks with the expected effect),
>   **On GitHub.com** (numbered steps), **In IntelliJ IDEA** (numbered steps, menu paths as
>   `menu:Git[GitHub > Create Pull Request]` or plain bold, shortcuts for Windows/Linux and macOS), **In VS Code**
>   (numbered steps, Command Palette command names, views), **Common mistakes / tips** as prose or a table, then
>   `== References`. Omit an environment subsection only where the operation genuinely does not exist there (e.g.
>   there is no "fetch" on github.com) and say so in one line.
> - Every step list and command block is **followed by a link to the official page it is derived from**.
> - `== References` links **only** official documentation: git-scm.com (docs, book), docs.github.com, cli.github.com,
>   jetbrains.com/help/idea, code.visualstudio.com/docs, marketplace.visualstudio.com (extension page).
> - **No admonition block** (`NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT`) other than the disclaimer include —
>   destructive-command warnings (`reset --hard`, `push --force`) are written as bold prose.
> - Mermaid diagrams inline as `[mermaid]` / `....` blocks; after finishing a page run
>   `node scripts/validate-mermaid.mjs modules/ROOT/pages/git-repositories` (after a one-time
>   `npm i --no-save mermaid@11 jsdom`).
> - Prefer `xref:` to sibling pages over repeating material (e.g. the pull-request page links the branches and
>   merging pages instead of re-explaining them).
> - After each group, delegate a build check to the `iru-gate-runner` agent
>   (`Agent({description: "Build Antora site", subagent_type: "iru-gate-runner", prompt: "Run npx antora
>   antora-playbook.yml in the repository root and report only errors/warnings, ignoring the expected
>   git-repositories/git-and-github/index.adoc#_bibliography xref error until Group 3 lands."})`) rather than running
>   the build in the main conversation.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land first: every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/git-disclaimer.adoc` — matches `docker-disclaimer.adoc` word for word
      except the xref target. Documentation only; no tests/coverage/quality tooling applies.
  - [x] Task 1.1. One `[IMPORTANT]` / `====` block, word for word as `docker-disclaimer.adoc` except the xref target:
        `xref:git-repositories/git-and-github/index.adoc#_bibliography[the section bibliography]`.

### Group 2 — Concept pages (Parallelizable: yes — nine distinct files; cross-page xrefs point at filenames fixed by this plan, so no page needs another's content)

Filenames are fixed here so sibling xrefs can be written up front.

- [x] Task 2. `getting-started.adoc` — "Getting Started with Git and GitHub"
  - [x] Task 2.1. Version control and why distributed; Git vs. GitHub (tool vs. hosting/collaboration platform);
        Mermaid flowchart: local repository ↔ remote repository on GitHub.
  - [x] Task 2.2. Installing Git 2.55 (macOS, Windows, Linux) and `git --version`; first-time setup:
        `git config --global user.name`, `user.email`, `init.defaultBranch main`, `core.editor`, `pull.rebase`
        (mention, detailed on the fetch/pull/push page); `git config --list --show-origin`; getting help
        (`git help <cmd>`, `git <cmd> -h`).
  - [x] Task 2.3. Creating a GitHub account (link only); authenticating: HTTPS with Git Credential Manager or
        `gh auth login`, SSH keys (`ssh-keygen -t ed25519`, adding the key on GitHub, `ssh -T git@github.com`);
        personal access tokens mentioned as the fallback.
  - [x] Task 2.4. IDE setup: IntelliJ IDEA (Settings › Version Control › Git, Settings › Version Control › GitHub
        › add account); VS Code (built-in Git, sign in with GitHub, install the *GitHub Pull Requests and Issues*
        extension).
  - [x] Task 2.5. `== References`: git-scm.com book ch. 1 (1.5 Installing, 1.6 First-Time Setup, 1.7 Getting Help),
        git-scm.com/install, docs.github.com "Set up Git", "Authenticating with GitHub from Git", "Connecting to
        GitHub with SSH", cli.github.com/manual/gh_auth_login, IntelliJ "Set up a Git repository" / GitHub
        account pages, VS Code "Source control overview" and "Working with GitHub".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/getting-started.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 3. `repositories-and-cloning.adoc` — "Repositories and Cloning"
  - [x] Task 3.1. What a repository is (`.git` directory, history, refs); the three states and three areas —
        working tree, staging area (index), repository — with a Mermaid flowchart (`git add` → `git commit`,
        `git restore` back); file lifecycle (untracked / unmodified / modified / staged); `git status`.
  - [x] Task 3.2. `git init` vs. `git clone <url>` (HTTPS vs. SSH URLs); `.gitignore` (patterns, global ignore,
        github/gitignore templates); remotes (`origin`, `git remote -v`, `git remote add`).
  - [x] Task 3.3. GitHub.com: creating a repository (README, .gitignore template, license), copying the clone URL,
        forking vs. cloning; `gh repo create`, `gh repo clone`, `gh repo fork --clone`.
  - [x] Task 3.4. IntelliJ: *Get from VCS* (clone), *Share Project on GitHub*; VS Code: *Git: Clone*, *Publish to
        GitHub*, initializing a repository from the Source Control view.
  - [x] Task 3.5. `== References`: book 2.1, 2.2 (three states), 2.5; git-init, git-clone, gitignore, git-remote
        docs; docs.github.com "Creating a new repository", "Cloning a repository", "Fork a repo"; IntelliJ "Check out
        a project" / "Share a project on GitHub"; VS Code "Repositories and remotes".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/repositories-and-cloning.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 4. `commits.adoc` — "Commits"
  - [x] Task 4.1. What a commit is: a snapshot (not a diff), SHA-1/SHA-256 id, tree, parent(s), author vs.
        committer, message; Mermaid `gitGraph` of a linear history; `HEAD` introduced.
  - [x] Task 4.2. Staging and committing: `git add <file>`, `git add -p`, `git commit -m`, `git commit -a`;
        writing good messages (50/72 rule, imperative mood, `Closes #123` on GitHub); inspecting: `git log`
        (`--oneline --graph --all`), `git show`, `git diff` vs. `git diff --staged`.
  - [x] Task 4.3. Changing and undoing: `git commit --amend` (only before pushing); `git restore <file>`,
        `git restore --staged <file>`; `git revert <sha>` (safe for shared history) vs. `git reset --soft|--mixed|--hard`
        (rewrites history — bold warning); a table "I want to… → command".
  - [x] Task 4.4. GitHub.com: editing/creating a file in the web editor and committing directly vs. to a new branch;
        viewing commit history and a commit's diff.
  - [x] Task 4.5. IntelliJ: Commit tool window (Ctrl+K / ⌘K), partial commits (chunk checkboxes), amend, Git log
        (Alt+9 / ⌘9), *Revert Commit*, *Reset Current Branch to Here*; VS Code: Source Control view
        (Ctrl+Shift+G / ⌃⇧G), stage/unstage, commit message box, *Commit (Amend)*, *Undo Last Commit*, timeline /
        history.
  - [x] Task 4.6. `== References`: book 2.2, 2.3, 2.4; git-add, git-commit, git-log, git-diff, git-restore,
        git-revert, git-reset docs; docs.github.com "About commits", "Editing files"; IntelliJ "Commit and push
        changes", "Undo changes"; VS Code "Staging and committing changes".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/commits.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 5. `branches.adoc` — "Branches"
  - [x] Task 5.1. A branch is a movable pointer to a commit; `HEAD` points to the current branch; creating a branch is
        cheap; Mermaid `gitGraph` with `main` and a `feature` branch diverging.
  - [x] Task 5.2. Commands: `git branch`, `git branch -a`, `git switch -c <name>`, `git branch -m`,
        `git branch -d` / `-D`; local vs. remote-tracking branches (`origin/main`) and upstreams
        (`git branch -u`, `git branch -vv`) — details deferred to the fetch/pull/push page via xref.
  - [x] Task 5.3. Branching workflows: GitHub flow (short-lived branches off `main` + pull requests) and a
        Git-flow-style model; worked example: this account's convention (`develop` integration branch,
        `feature/<issue>` and `hotfix/<issue>` branches, `release_x.y.z` release branches); Mermaid `gitGraph`
        illustrating it; branch naming tips.
  - [x] Task 5.4. GitHub.com: creating a branch from the branch dropdown and from an issue (*Create a branch*),
        viewing/deleting branches, default branch, branch protection rules and rulesets (overview + link only).
  - [x] Task 5.5. IntelliJ: branches popup (status-bar widget / *Git › Branches*), *New Branch*, *Rename*, *Delete*,
        *Compare with Current*; VS Code: status-bar branch picker, *Git: Create Branch…*, *Git: Delete Branch…*,
        *Git: Rename Branch…*.
  - [x] Task 5.6. `== References`: book 3.1, 3.3, 3.4, 3.5; git-branch docs; docs.github.com "About branches",
        "Creating and deleting branches within your repository", "About protected branches", "About rulesets",
        "GitHub flow"; IntelliJ "Manage Git branches"; VS Code "Branches and worktrees".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/branches.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 6. `checkout-switch-and-restore.adoc` — "Checkout, Switch and Restore"
  - [x] Task 6.1. What `git checkout` does (switch branches **and** restore files — two jobs in one command) and why
        Git 2.23 introduced `git switch` and `git restore`; equivalence table (`checkout <branch>` ↔ `switch <branch>`,
        `checkout -b` ↔ `switch -c`, `checkout -- <file>` ↔ `restore <file>`, `checkout <sha> -- <file>` ↔
        `restore --source <sha> <file>`).
  - [x] Task 6.2. Detached `HEAD`: checking out a tag or commit (`git switch --detach v1.2.0`), what happens to new
        commits there, getting back (`git switch -`, `git switch main`), keeping work (`git switch -c`); Mermaid
        `gitGraph` showing HEAD detached on a tag.
  - [x] Task 6.3. Checking out a remote branch (`git switch <name>` auto-tracking `origin/<name>`); switching with
        uncommitted changes: what Git refuses, `git stash` / `git stash pop` / `git stash list`, `git switch -m`;
        checking out a pull request locally (`gh pr checkout <n>`).
  - [x] Task 6.4. GitHub.com: switching the viewed branch/tag in the repository UI; browsing a repository at a commit.
  - [x] Task 6.5. IntelliJ: branches popup › *Checkout*, *Checkout Tag or Revision…*, smart checkout, shelve vs.
        stash; VS Code: *Git: Checkout to…* (branch picker), stash commands (*Git: Stash*, *Git: Pop Stash…*),
        checking out a PR from the *GitHub Pull Requests* view.
  - [x] Task 6.6. `== References`: git-checkout, git-switch, git-restore, git-stash docs; book 3.2, 7.3 (Stashing);
        cli.github.com/manual/gh_pr_checkout; IntelliJ "Manage Git branches" (checkout), "Shelve or stash changes";
        VS Code "Branches and worktrees".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/checkout-switch-and-restore.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 7. `tags-and-releases.adoc` — "Tags and Releases"
  - [x] Task 7.1. What a tag is (a fixed pointer, unlike a branch); lightweight vs. annotated tags; semantic
        versioning (`v1.4.0`); Mermaid `gitGraph` with tags on `main`.
  - [x] Task 7.2. Commands: `git tag`, `git tag -l "v1.*"`, `git tag -a v1.4.0 -m "…"`, tagging an older commit,
        `git show v1.4.0`, `git tag -d`, **tags are not pushed by default** (`git push origin v1.4.0`,
        `git push --tags`, `git push origin --delete v1.4.0`), signed tags mentioned.
  - [x] Task 7.3. GitHub releases built on tags: creating a release on github.com (choose/create tag, target,
        generate release notes, assets, pre-release, latest) and with `gh release create v1.4.0 --generate-notes`;
        tag rulesets (overview); tags triggering GitHub Actions — xref
        `backend/docker/ci-cd-with-github-actions.adoc`.
  - [x] Task 7.4. IntelliJ: Git log › right-click commit › *New Tag…*, pushing tags from the Push dialog
        (*Push Tags*); VS Code: *Git: Create Tag*, *Git: Delete Tag*, *Git: Push Tags*.
  - [x] Task 7.5. `== References`: book 2.6; git-tag docs; docs.github.com "About releases", "Managing releases in a
        repository", "Automatically generated release notes"; cli.github.com/manual/gh_release_create; IntelliJ
        "Tags"; VS Code "Source control overview" (commands).
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/tags-and-releases.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 8. `fetch-pull-and-push.adoc` — "Fetch, Pull and Push"
  - [x] Task 8.1. Remotes and remote-tracking branches recap; Mermaid `sequenceDiagram` local ↔ `origin` for
        fetch, pull and push; the difference between `git fetch` (download only) and `git pull` (fetch + integrate).
  - [x] Task 8.2. `git fetch` (`--prune`, `--all`); `git pull` (merge by default, `--rebase`, `pull.rebase` /
        `pull.ff` configuration and the "divergent branches" hint); `git push`, `git push -u origin <branch>`,
        `push.autoSetupRemote`; rejected non-fast-forward pushes and how to recover (pull, resolve, push again);
        `--force-with-lease` vs. `--force` (bold warning, never on shared branches); deleting a remote branch.
  - [x] Task 8.3. GitHub.com: nothing to push/pull in the browser — instead: *Sync fork* for forks, *Update branch*
        on a pull request, and what a push looks like (branch appears, *Compare & pull request* banner); pushes
        triggering GitHub Actions — xref the CI/CD pages.
  - [x] Task 8.4. IntelliJ: *Git › Fetch*, *Update Project* (Ctrl+T / ⌘T, merge vs. rebase choice), Push dialog
        (Ctrl+Shift+K / ⌘⇧K, force push uses `--force-with-lease`); VS Code: *Sync Changes* (pull then push),
        status-bar sync indicator, *Git: Fetch*, *Git: Pull*, *Git: Push*, *Publish Branch*, `git.autofetch`.
  - [x] Task 8.5. `== References`: book 2.5, 3.5; git-fetch, git-pull, git-push, git-remote docs; docs.github.com
        "Pushing commits to a remote repository", "Getting changes from a remote repository", "Syncing a fork",
        "Dealing with non-fast-forward errors"; IntelliJ "Commit and push changes", "Sync with a remote Git
        repository"; VS Code "Repositories and remotes".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/fetch-pull-and-push.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 9. `merging-rebasing-and-conflicts.adoc` — "Merging, Rebasing and Conflicts"
  - [x] Task 9.1. `git merge`: fast-forward vs. three-way merge (merge commit with two parents), `--no-ff`,
        `--ff-only`, `--squash`; Mermaid `gitGraph` for each.
  - [x] Task 9.2. Merge conflicts: why they happen, conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), resolving,
        `git add` + `git commit` (or `git merge --continue`), `git merge --abort`; a worked example with the exact
        terminal output.
  - [x] Task 9.3. `git rebase` introduction: replaying commits onto a new base, Mermaid before/after `gitGraph`,
        `git rebase --continue|--abort`, the golden rule (never rebase commits others have), merge vs. rebase
        trade-offs table; interactive rebase named with a link only (out of scope for basics).
  - [x] Task 9.4. GitHub.com: resolving simple conflicts in the web conflict editor on a pull request; *Update
        branch* (merge or rebase); merge methods are covered on the pull-requests page (xref).
  - [x] Task 9.5. IntelliJ: branches popup › *Merge into Current* / *Rebase Current onto Selected*, the Conflicts
        dialog and three-pane merge window (*Accept Left/Right*, *Merge…*); VS Code: *Git: Merge Branch…*,
        *Git: Rebase Branch…*, inline conflict CodeLens (*Accept Current / Incoming / Both*), the 3-way merge editor,
        *Complete Merge*.
  - [x] Task 9.6. `== References`: book 3.2, 3.6; git-merge, git-rebase docs; docs.github.com "About merge
        conflicts", "Resolving a merge conflict on GitHub", "Resolving a merge conflict using the command line";
        IntelliJ "Merge, rebase, or cherry-pick", "Resolve conflicts"; VS Code "Merge conflicts".
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/merging-rebasing-and-conflicts.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

- [x] Task 10. `pull-requests.adoc` — "Pull Requests"
  - [x] Task 10.1. What a pull request is (a proposal to merge a head/compare branch into a base branch, with
        discussion, review and checks); GitHub flow end to end in six steps with a Mermaid flowchart; draft PRs;
        PR templates (`.github/pull_request_template.md`); linking issues (`Closes #123`); PRs from forks.
  - [x] Task 10.2. **Create a PR on github.com**: push the branch → *Compare & pull request* banner (or *Pull
        requests › New pull request*) → pick base and compare → title and description → reviewers, assignees,
        labels → *Create pull request* or *Create draft pull request*.
  - [x] Task 10.3. **With the GitHub CLI**: `gh pr create` (interactive), `--base`, `--head`, `--title`, `--body`,
        `--draft`, `--reviewer`, `--web`; `gh pr list`, `gh pr view`, `gh pr checkout`, `gh pr review`,
        `gh pr merge --squash --delete-branch`.
  - [x] Task 10.4. **In IntelliJ IDEA 2026.2**: *Git › GitHub › Create Pull Request* (or the **+** in the Pull
        Requests tool window, or the post-push notification) → base repository/branch (left) and head (right) →
        review the diff → title, description, reviewers, assignees, labels → *Create Pull Request* or
        *Create Draft Pull Request*; reviewing (*Git › GitHub › View Pull Requests*, gutter comments, *Submit*:
        approve / request changes / comment) and merging (Merge / Squash and Merge / Rebase).
  - [x] Task 10.5. **In VS Code**: install *GitHub Pull Requests and Issues*, sign in; *GitHub Pull Requests: Create
        Pull Request* from the Command Palette (or *Create Pull Request* in the Pull Requests view) → target branch
        → title/description (template auto-filled) → *Create* / *Create Draft* → choose the remote to publish to;
        review mode, comments, checking out a PR, merging.
  - [x] Task 10.6. Reviewing and merging on github.com: *Files changed*, comments and suggestions, approve /
        request changes, required status checks, the three merge methods (merge commit, squash and merge, rebase and
        merge) with a Mermaid `gitGraph` for each outcome, auto-merge and merge queue named, deleting the branch
        afterwards and pulling `main` locally.
  - [x] Task 10.7. `== References`: docs.github.com "About pull requests", "Creating a pull request", "Creating a
        pull request from a fork", "Reviewing proposed changes in a pull request", "About pull request merges",
        "Merging a pull request", "Linking a pull request to an issue", "GitHub flow";
        cli.github.com/manual/gh_pr_create (and `gh_pr_*` pages used); IntelliJ "Create and merge GitHub pull
        requests", "Review incoming GitHub pull requests"; VS Code "Working with GitHub"; the extension's
        Marketplace page.
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/pull-requests.adoc` created per the plan's row in issue #180's Proposed pages table; Mermaid diagrams validated (`validate-mermaid.mjs`); `== References` links only git-scm.com/docs.github.com/cli.github.com/jetbrains.com/help/idea/code.visualstudio.com/docs pages, verified live via WebFetch/WebSearch where feasible; no admonitions other than the disclaimer include; Antora build clean aside from the expected not-yet-resolved `_bibliography` xref (Group 3 not yet landed).

### Group 3 — Landing pages and cheat-sheet page (Parallelizable: yes — three distinct files; all need every Group 2 page's final title/path)

- [x] Task 11. `modules/ROOT/pages/git-repositories/git-and-github/index.adoc` — "Git & GitHub"
  - [x] Task 11.1. `include::partial$git-disclaimer.adoc[]` after `:keywords:`; one paragraph on what Git and GitHub
        are and how they relate; the version baseline in prose.
  - [x] Task 11.2. "New here? Read in this order": getting started → repositories and cloning → commits → branches →
        checkout/switch/restore → fetch/pull/push → merging/rebasing/conflicts → pull requests → tags and releases.
  - [x] Task 11.3. `== What's covered` — one `xref:` + one-line description per page, grouped *Foundations*
        (getting started, repositories), *Everyday work* (commits, branches, checkout, tags),
        *Collaborating* (fetch/pull/push, merging, pull requests), *Reference* (cheat sheet). Verify filenames with
        `ls` before writing xrefs.
  - [x] Task 11.4. One short paragraph linking the GitHub Actions pages
        (`backend/docker/ci-cd-with-github-actions.adoc`, `apps/react-native/ci-cd-and-over-the-air-updates.adoc`)
        as "what happens after you push".
  - [x] Task 11.5. `[[_bibliography]]` `== Bibliography`: Pro Git 2nd ed. (Scott Chacon and Ben Straub, Apress,
        free at git-scm.com/book), the Git reference manual, git-scm.com/learn, GitHub Docs (Get started, Pull
        requests, Repositories), GitHub CLI manual, IntelliJ IDEA Version control docs, VS Code Source Control docs —
        every item linked; closing sentence that official docs win on any discrepancy. No physical line starting
        with a bare `<number>.`.
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/index.adoc` created — filenames of all nine concept
  pages verified with `ls` before writing xrefs; reading order and grouped "What's covered" sections match the
  nine pages' actual titles; one-sentence link to both GitHub Actions pages; `[[_bibliography]]` anchor present
  with only official sources (Pro Git 2nd ed., git-scm.com, docs.github.com, cli.github.com, JetBrains, VS Code
  Docs) plus a closing sentence that official docs win on any discrepancy. No admonition beyond the disclaimer
  include; no bare `<number>.` lines.

- [x] Task 12. `modules/ROOT/pages/git-repositories/index.adoc` — "Git Repositories" category page
  - [x] Task 12.1. Mirror `apps/index.adoc`: title, `:description:`, `:keywords:`, one intro paragraph (version
        control and hosting platforms), `== Sections` with a single bullet
        `xref:git-repositories/git-and-github/index.adoc[Git & GitHub] -- …` summarising the section, ending
        "plus a downloadable cheat sheet". No disclaimer include (matches `apps/index.adoc`).
  > Done: `modules/ROOT/pages/git-repositories/index.adoc` created, mirroring `apps/index.adoc`'s structure exactly
  (title, `:description:`, `:keywords:`, intro paragraph, `== Sections` with one bullet, no disclaimer include).

- [x] Task 13. `modules/ROOT/pages/git-repositories/git-and-github/cheat-sheet.adoc` — "Git & GitHub Cheat Sheet"
  - [x] Task 13.1. Mirror `backend/docker/cheat-sheet.adoc`: description of what the sheet covers, grouped xrefs to
        all nine concept pages, `== Download` with
        `xref:attachment$git-cheat-sheet.pdf[Download the Git & GitHub Cheat Sheet (PDF)]`, `== References`
        (git-scm.com/docs, git-scm.com/book, docs.github.com, cli.github.com/manual, IntelliJ and VS Code docs).
        The attachment xref fails the build until Group 4 lands — expected.
  > Done: `modules/ROOT/pages/git-repositories/git-and-github/cheat-sheet.adoc` created, mirroring
  `backend/docker/cheat-sheet.adoc`'s structure — intro paragraph naming every topic, grouped xrefs to all nine
  concept pages, `== Download` with the `attachment$git-cheat-sheet.pdf` xref, `== References` limited to official
  docs. Confirmed via the Group 3 build that this xref is the only remaining error (PDF lands in Group 4).

### Group 4 — Cheat-sheet PDF (Parallelizable: yes)

- [x] Task 14. Produce `modules/ROOT/attachments/git-cheat-sheet.pdf`
  - [x] Task 14.1. Inspect `docker-cheat-sheet.pdf` (PyMuPDF or `pdftotext -layout`) to match palette, fonts,
        colour-coded bordered boxes, header version line and breadcrumb footer
        ("Guides & References › Git Repositories › Git & GitHub").
  - [x] Task 14.2. Write a scratch HTML/CSS layout **in the session scratchpad, not the repository**, with boxes for:
        the three areas (working tree → staging → repository → remote) mini-diagram; setup & config; create/clone;
        stage & commit; inspect (`status`/`log`/`diff`/`show`); undo (`restore`/`revert`/`reset`/`--amend`);
        branches; checkout vs. switch vs. restore; stash; tags & releases; remotes (`fetch`/`pull`/`push`,
        `-u`, `--force-with-lease`); merge/rebase and the conflict-resolution steps; GitHub flow in six steps; pull
        requests (`gh pr create/checkout/merge`, the three merge methods); IDE strip (IntelliJ and VS Code
        shortcuts/commands). Content drawn from the pages written in Group 2 for consistency.
  - [x] Task 14.3. Render with headless Chromium (Playwright or `--headless --print-to-pdf`), A4 portrait; verify
        exactly one page of ~595×842 pt; fix overflow by layout (columns, tighter type), never by silently dropping
        content. Commit only the PDF.
  > Done: `modules/ROOT/attachments/git-cheat-sheet.pdf` -- exactly one page, 594.96 x 841.92 pt (A4), rendered with
  headless Google Chrome (`--headless --print-to-pdf`) from a scratch HTML/CSS layout kept in the session scratchpad
  (not committed). Palette (six accent colours matched by RGB sampling), bordered colour-coded boxes, monospace code
  blocks, header version line ("Git 2.55.x · GitHub CLI 2.101.x · IntelliJ IDEA 2026.2 · VS Code (current stable) ·
  github.com · default branch main") and breadcrumb footer ("Irurueta Docs · Guides & References → Git Repositories
  → Git & GitHub · albertoirurueta.github.io/docs") matched to `docker-cheat-sheet.pdf` (inspected with PyMuPDF: page
  rect, fonts, text/stroke/fill colours). 15 boxes covering all Task 14.2 topics in a 5-column CSS-column layout; no
  overflow (verified by rendering the PDF page to PNG and visually inspecting it -- no clipped or overlapping
  content); no realistic credentials/tokens. `npx antora antora-playbook.yml` exits 0 with no errors/warnings;
  `build/site/git-repositories/git-and-github/cheat-sheet.html` links `../../_attachments/git-cheat-sheet.pdf`,
  which exists in `build/site/_attachments/`. Only the PDF was added to the repository.

### Group 5 — Site wiring and cross-links (Parallelizable: yes — every task edits a distinct file)

- [x] Task 15. `modules/ROOT/nav.adoc` — append after the last line (the React Native cheat-sheet entry):
      ```
      ** xref:git-repositories/index.adoc[Git Repositories]
      *** xref:git-repositories/git-and-github/index.adoc[Git & GitHub]
      **** xref:git-repositories/git-and-github/getting-started.adoc[Getting Started]
      ... (the nine concept pages in the index's reading order)
      **** xref:git-repositories/git-and-github/cheat-sheet.adoc[Cheat Sheet (PDF)]
      ```
  > Done: appended the `** Git Repositories` block to `modules/ROOT/nav.adoc` (now 872 lines); the nine concept-page
  entries use the reading order and short titles from the "New here? Read in this order" line of
  `git-repositories/git-and-github/index.adoc` (Getting Started → Repositories and Cloning → Commits → Branches →
  Checkout, Switch and Restore → Fetch, Pull and Push → Merging, Rebasing and Conflicts → Pull Requests → Tags and
  Releases), followed by the Cheat Sheet (PDF) entry; all ten target filenames verified with `ls` before writing.
- [x] Task 16. `modules/ROOT/images/git-repositories.svg` — new 600×600 tile copied from `apps.svg`'s structure:
      gradient `#FCA3AF` → `#7873f5`, a white branch/merge icon (three circles joined by a forked line) at
      (300,170), title "Git" or "Git Repositories" (shrink font to fit ≤ 500px width), subtitle
      "Version control &amp; GitHub", "Explore" pill.
  > Done: `modules/ROOT/images/git-repositories.svg` created, mirroring `apps.svg`'s viewBox/gradient/clip-path/
  translucent-icon-circle/title/divider/subtitle/Explore-pill structure exactly, with the `#FCA3AF` → `#7873f5`
  gradient and a white three-circles-joined-by-a-forked-line branch/merge icon. `xmllint --noout` confirms
  well-formed XML; rendered to PNG with headless Google Chrome (`--headless --screenshot`) and visually inspected --
  "Git Repositories" at 40px fits comfortably within the card width and the branch icon is legible against the
  translucent circle.
- [x] Task 17. `modules/ROOT/pages/index.adoc`
  - [x] Task 17.1. Put `image::git-repositories.svg[xref="git-repositories/index.adoc"]` in the empty sixth `a|` cell
        of the `== Guides & References` table.
  - [x] Task 17.2. Append `Git, GitHub, version control, commits, branches, tags, pull requests, git merge, git
        rebase, GitHub CLI, Git cheat sheet` to `:keywords:` (skip any term already present); add "Git and GitHub"
        to `:description:` if it enumerates the guide areas.
  > Done: the previously-empty sixth `a|` cell of the `== Guides & References` table now holds
  `image::git-repositories.svg[xref="git-repositories/index.adoc"]`; `:keywords:` (verified none of the new terms
  were already present) gained `, Git, GitHub, version control, commits, branches, tags, pull requests, git merge,
  git rebase, GitHub CLI, Git cheat sheet` appended after `container images`; `:description:` (which enumerates
  "standalone database, web-development, backend, and apps references") now reads "...backend, apps, and Git and
  GitHub references."
- [x] Task 18. `backend/docker/ci-cd-with-github-actions.adoc` — one sentence in the intro linking
      `xref:git-repositories/git-and-github/index.adoc[Git & GitHub]` for readers new to branches, tags and pull
      requests.
  > Done: added "If branches, tags and pull requests that trigger these workflows are new territory, see
  xref:git-repositories/git-and-github/index.adoc[Git & GitHub] first." to the end of the intro paragraph.
- [x] Task 19. `apps/react-native/ci-cd-and-over-the-air-updates.adoc` — the same one-sentence link.
  > Done: added the same sentence ("If branches, tags and pull requests that trigger these workflows are new
  territory, see xref:git-repositories/git-and-github/index.adoc[Git & GitHub] first.") to the end of the page's
  first intro paragraph.

### Group 6 — Final verification (Parallelizable: yes)

- [x] Task 20. Validate and build
  - [x] Task 20.1. `node scripts/validate-mermaid.mjs modules/ROOT/pages/git-repositories` — all blocks parse.
        `npm i --no-save mermaid@11 jsdom` were already present; ran clean: "All 18 Mermaid diagrams parsed
        successfully."
  - [x] Task 20.2. Delegated `npx antora antora-playbook.yml` to the `iru-gate-runner` agent — exit 0, zero
        errors/warnings. The `irurueta` component is served at the site root (not under `/irurueta/`), so the
        actual path is `build/site/git-repositories/git-and-github/cheat-sheet.html`; it links
        `href="../../_attachments/git-cheat-sheet.pdf"`, and `build/site/_attachments/git-cheat-sheet.pdf` exists
        on disk (332 KB). `build/site/index.html` references `git-repositories.svg` and links to
        `git-repositories/git-and-github/*.html` pages, confirming the new home-page tile renders.
  - [x] Task 20.3. Spot-checked #180's acceptance criteria against all nine concept pages under
        `modules/ROOT/pages/git-repositories/git-and-github/`: every named concept (getting started, repositories,
        commits, branches, checkout/switch/restore, tags & releases, fetch/pull/push, merging/rebasing/conflicts,
        pull requests) has its own clearly titled page; every page has `== Concept`, IntelliJ IDEA and VS Code
        subsections, and a `== References` section. CLI and GitHub.com content is present on every page but two
        deviate from the literal "Command line" / "On GitHub.com" heading names by design, not omission:
        `getting-started.adoc` (a setup/intro page structured as Installing Git → First-time setup → Creating a
        GitHub account and authenticating → IDE setup, with CLI and github.com content folded into those
        headings) and `merging-rebasing-and-conflicts.adoc` (CLI `git merge`/`git rebase` commands are inline
        under `== Concept`, `== Resolving conflicts` and `== Rebasing` since the operations are inherently
        command-driven; it does have a separate `== On GitHub.com` heading). `pull-requests.adoc` uses
        "Create a PR on github.com" / "With the GitHub CLI" / "Reviewing and merging on github.com" instead of the
        generic heading names, which is a clearer fit for that page's two-audience (creating vs. reviewing)
        structure. No content gap was found in any of the three, so nothing was changed. `== References` sections
        across all nine pages were grepped for every URL: every link is git-scm.com, docs.github.com,
        cli.github.com, jetbrains.com, code.visualstudio.com, marketplace.visualstudio.com or
        github.com/github/gitignore — no non-official link found.
