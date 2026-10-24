# Implementation Plan: Git & GitHub — Migrating Repositories Between Providers / Transferring Repositories Between GitHub Accounts

## Task summary

Source: GitHub issue #302
Base branch: main

Issue [#302](https://github.com/albertoirurueta/docs/issues/302) asks for two new pages in the existing
**Guides & References › Git & GitHub** section (`modules/ROOT/pages/git-and-github/`):

1. **Migrating Repositories Between Providers** (`migrating-repositories-between-providers.adoc`) — moving a
   repository between Git hosts (main example Bitbucket Cloud → GitHub) with full history, every branch and tag, via
   `git clone --mirror` + `git push --mirror`, including Git LFS handling and GitHub's file-size limits.
2. **Transferring Repositories Between GitHub Accounts** (`transferring-repositories-between-github-accounts.adoc`) —
   GitHub's built-in ownership transfer (web UI and REST API through `gh api`), what moves, redirects and their
   limits, and when to fall back to a mirror.

Plus site wiring: `nav.adoc`, the section `index.adoc` (new group, reading order, description/keywords,
bibliography), `cheat-sheet.adoc` and `attachments/git-cheat-sheet.pdf`, and cross-links from
`repositories-and-cloning.adoc` and `fetch-pull-and-push.adoc`.

Decisions made on the user's behalf (stated so review can challenge them):

- **Docs-only work, so tasks carry no language key.** The installed `*-code-one-task` skills do not cover
  AsciiDoc/Antora; same convention as every plan in `.archive/` (e.g. `implementation_plan_180.md`).
- **Diagram format: Mermaid** (`flowchart LR`) inline in page 1, not an SVG, so no new file in
  `modules/ROOT/images/` is needed. Stereotypes/`<` followed by a letter are written as entities per `CLAUDE.md`.
- **Cheat-sheet PDF** is regenerated the same way as in plan 180: scratch HTML/CSS in the session scratchpad,
  headless Chromium `--print-to-pdf`, exactly one A4 page, only the PDF committed. The existing PDF's palette/fonts
  are read with PyMuPDF first so the new "Move a repository" block matches.
- **Verification of volatile facts.** Tool versions (Git 2.55.x, `gh` 2.101.x, IntelliJ IDEA 2026.2, current VS Code,
  Git LFS 3.x), the Bitbucket token UI path/scope names/`x-token-auth`, app-password retirement dates, GitHub's
  50 MB / 100 MB limits, LFS limits and billing, the transfer acceptance window, GitHub Enterprise Importer scope
  and the hidden-ref (`deny updating a hidden ref`) behaviour are re-checked against the official pages (WebFetch)
  at write time. Where a number changes often the page links the docs instead of hard-coding it. If a fact cannot be
  verified, the page words it without the number and the task notes the gap.
- **Fictitious names only**, exactly those suggested in the issue (`acme-legacy`, `acme-labs`, `inventory-api`,
  `jdoe-dev`, `asmith-dev`, tokens as `<BITBUCKET_REPOSITORY_ACCESS_TOKEN>`).
- **Placement in nav/index**: after *Tags and Releases*, before *Cheat Sheet (PDF)*; new index group
  `=== Moving repositories`.

Open clarifications: none

## Acceptance criteria coverage

| # | Criterion | Covered by tasks |
|---|---|---|
| 1 | "Both pages exist, follow the section's page structure and are reachable from the nav and the section landing page." | Task 1, Task 2, Task 3, Task 4 |
| 2 | "Every example uses fictitious workspaces, organizations, accounts and repositories, and no real token or credential appears anywhere." | Task 1, Task 2, Task 5, Task 7, Task 8.3 |
| 3 | "The migration page covers `useHttpPath`, `git clone --mirror`, `git push --mirror`, verification, cleanup and re-pointing remotes, and the LFS handling (`git lfs fetch --all`, `git lfs push --all`, and `git lfs migrate import` for files over GitHub's limit)." | Task 1 |
| 4 | "The transfer page covers the web UI, the REST API / `gh api` call, acceptance, blockers, what moves, redirects and their limits, and the fall-back to a mirror." | Task 2 |
| 5 | "The cheat sheet (page and PDF) and the bibliography are updated." | Task 4.3, Task 5, Task 7 |
| 6 | "`npx antora antora-playbook.yml` builds without errors, and the image / inline-code / Mermaid checks in `CLAUDE.md` print nothing for the changed files." | Task 8 |

## Current code state

- Antora playbook/root component repo; build with `npx antora antora-playbook.yml` (Antora 3.1.15, Mermaid and
  MathJax extensions). No test suite; verification = clean build + `CLAUDE.md` grep checks +
  `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`).
- Section directory `modules/ROOT/pages/git-and-github/` holds `index.adoc`, `getting-started.adoc`,
  `repositories-and-cloning.adoc`, `commits.adoc`, `branches.adoc`, `checkout-switch-and-restore.adoc`,
  `fetch-pull-and-push.adoc`, `merging-rebasing-and-conflicts.adoc`, `pull-requests.adoc`, `tags-and-releases.adoc`,
  `cheat-sheet.adoc`. None mentions mirror clones or Git LFS.
- Page template (`repositories-and-cloning.adoc`): title, `:description:`, `:keywords:`, blank line,
  `include::partial$git-disclaimer.adoc[]`, intro paragraph naming versions, `== Concept`, `== Command line`,
  `== On GitHub.com`, `== In IntelliJ IDEA`, `== In VS Code`, `== Common mistakes / tips`, `== References`.
  Mermaid blocks use `[mermaid]` + `....` fences. Command blocks are `[source,bash]` / `----` and are followed by
  prose naming the official page the commands derive from.
- `modules/ROOT/nav.adoc` lines 2423–2433: `** xref:git-and-github/index.adoc[Git & GitHub]` with `***` children;
  `tags-and-releases` at line 2432, `cheat-sheet.adoc[Cheat Sheet (PDF)]` at 2433.
- `git-and-github/index.adoc`: `:description:`/`:keywords:` (lines 2–3), "New here? Read in this order" paragraph,
  `== What's covered` with groups Foundations / Everyday work / Collaborating / Reference, closing CI/CD paragraph,
  `[[_bibliography]]` `== Bibliography`.
- `cheat-sheet.adoc`: intro paragraph, grouped dedicated-page xrefs (Foundations / Everyday work / Collaborating),
  `== Download` → `xref:attachment$git-cheat-sheet.pdf[...]`, `== References`.
- `repositories-and-cloning.adoc` `=== Remotes: ...` (line 186) ends by pointing at Fetch, Pull and Push;
  `fetch-pull-and-push.adoc` `==== --force-with-lease versus --force` (line 163) is where destructive pushes are
  discussed.
- `modules/ROOT/attachments/git-cheat-sheet.pdf`: one A4 page; `docker-cheat-sheet.pdf` was the style reference.
- Constraints from `CLAUDE.md`: image macros on one line (none planned); inline code containing `->`, `=>`, `*`,
  `~`, `^`, `...`, `'`, `{`, `__`, `#[` uses a constrained passthrough `` `+...+` `` (code with `+` uses
  `` `pass:c[...]` ``) — relevant to `--include="*.zip,*.psd"`, `refs/pull/*`, `refs/heads/*` and
  `git config` values; Mermaid `<` + letter written as entities.

## Implementation steps

### Group 1 — The two new pages (Parallelizable: yes — two distinct new files; they only cross-link by path)

- [x] Task 1. Create `modules/ROOT/pages/git-and-github/migrating-repositories-between-providers.adoc`
  - [x] Task 1.1. Front matter + intro: title `= Migrating Repositories Between Providers`, `:description:` and
        `:keywords:` (mirror clone, `git push --mirror`, Git LFS, Bitbucket to GitHub migration, `useHttpPath`,
        `git lfs migrate import`), `include::partial$git-disclaimer.adoc[]`, intro with the version baseline.
  - [x] Task 1.2. `== Concept`: mirror clone vs `--bare` vs normal clone (what refs each copies); what a Git
        migration does not move (PRs, issues, wikis as separate repos, CI, branch protection, permissions, webhooks,
        deploy keys, variables/secrets); GitHub Enterprise Importer (Bitbucket Server/Data Center only, not Cloud)
        and retired GitHub Importer — verify both; manual flow works with any host. Add a `[mermaid]` `flowchart LR`
        of source host → bare mirror clone (+ LFS objects) → empty target repository.
  - [x] Task 1.3. `== Command line` step-by-step Bitbucket Cloud → GitHub, 11 steps from the issue: empty target repo
        (`gh repo create acme-labs/inventory-api --private`), Bitbucket repository access token (scopes,
        `x-token-auth`, API tokens vs retired app passwords — verify), `git config --global
        credential.https://bitbucket.org.useHttpPath true`, `git clone --mirror`, `cd inventory-api.git`, LFS,
        `git push --mirror`, verification (`git ls-remote --heads/--tags` on both hosts, default branch, LFS content),
        cleanup, re-pointing working copies (`git remote set-url origin ...`), finishing the move (protection, CI,
        secrets, webhooks, archive the old repo). Never put the token in the URL. Each block followed by the official
        page it derives from.
  - [x] Task 1.4. `=== Git LFS and large files`: pointer files, `git lfs install`/`track`/`.gitattributes`/
        `git lfs ls-files`; mirror clone/push do not move LFS objects; order `git lfs fetch --all` → `git push
        --mirror` → `git lfs push --all <url>`; checks `git lfs ls-files --all`, `git lfs fsck`; check LFS docs on
        whether pushing LFS objects before refs avoids pre-receive rejections; non-LFS files over GitHub's
        50 MB warning / 100 MB hard limit, how to find them, `git lfs migrate import --everything
        --include="*.zip,*.psd"` / `--above=100MB` (passthrough in inline code), warning that every SHA changes and
        collaborators must re-clone; link GitHub LFS limits/billing docs instead of hard-coding values.
  - [x] Task 1.5. `== On GitHub.com` (create empty repo, set default branch, verify branches/tags, recreate
        protection/Actions secrets) and `== On Bitbucket` (create repository access token / API token, archive or
        make read-only afterwards), with UI paths verified live.
  - [x] Task 1.6. `== In IntelliJ IDEA` (*Git → Manage Remotes*) and `== In VS Code` (*Git: Remove Remote* /
        *Git: Add Remote*) re-pointing sections only; verified against JetBrains/VS Code docs.
  - [x] Task 1.7. `== Common mistakes / tips` (the six bullets from the issue, incl. hidden refs such as
        `refs/pull-requests/*` / `refs/pull/*` with `deny updating a hidden ref`, deleting them with `git update-ref
        -d` or pushing only `refs/heads/*` and `refs/tags/*` — verify exact behaviour; `--mirror` deletes target
        refs; revoke the token) and `== References` (git-clone, git-push, Pro Git *Git on the Server* / *The
        Refspec*, git-lfs.com + man pages, Bitbucket token docs, GitHub docs on duplicating repositories, importing
        source code, large files). Link `xref:git-and-github/transferring-repositories-between-github-accounts.adoc[...]`.
  - [x] Task 1.8. Self-check the file: no real names/tokens, image/inline-code/Mermaid rules from `CLAUDE.md`.

- [x] Task 2. Create `modules/ROOT/pages/git-and-github/transferring-repositories-between-github-accounts.adoc`
  - [x] Task 2.1. Front matter + intro (same pattern as Task 1.1; keywords: transfer repository ownership, `gh api`,
        `repos/{owner}/{repo}/transfer`, redirects, personal account, organization).
  - [x] Task 2.2. `== Concept`: transfer (same repo: ID, issues, PRs, wiki, stars, watchers, releases) vs copy via
        mirror (xref to page 1); the four directions (personal→personal, personal→org, org→personal, org→org),
        optionally as a small table.
  - [x] Task 2.3. `== On GitHub.com`: *Settings → General → Danger Zone → Transfer ownership*, examples
        `jdoe-dev/inventory-api` → `acme-labs/inventory-api` and → `asmith-dev/inventory-api`; `== Command line`:
        `gh api --method POST repos/jdoe-dev/inventory-api/transfer -f new_owner=acme-labs`, optional `new_name`,
        `team_ids`; note there is no `gh repo transfer` (verify against current `gh` manual).
  - [x] Task 2.4. `=== Requirements and what happens`: who can transfer, acceptance by email within the verified
        window, blockers (same name, fork network, private/internal restrictions), what moves vs what needs redoing
        (collaborators, teams, webhooks, deploy keys, Actions secrets/variables, GitHub Apps, Packages, LFS objects —
        from GitHub docs), redirects and their limits (Pages URLs, `owner/repo` workflow references, redirect broken
        by a new same-name repo), `git remote set-url` recommendation, and when a transfer is impossible → mirror
        flow with xref to page 1.
  - [x] Task 2.5. `== In IntelliJ IDEA` / `== In VS Code` (updating the remote after a transfer; short, with an xref
        to the migration page's sections rather than duplicating them), `== Common mistakes / tips` (badges, Pages
        URLs, package coordinates, collaborator access via teams, plan/billing differences), `== References`
        (GitHub docs on transferring a repository, REST API `repos/transfer`, `gh api` manual, git-remote).
  - [x] Task 2.6. Self-check the file against the same rules as Task 1.8.

### Group 2 — Site wiring and cross-links (Parallelizable: yes — four distinct files; all need the final page titles/paths from Group 1)

- [x] Task 3. Update `modules/ROOT/nav.adoc`
  - [x] Task 3.1. Insert, after the `tags-and-releases` line and before `cheat-sheet.adoc[Cheat Sheet (PDF)]`:
        `*** xref:git-and-github/migrating-repositories-between-providers.adoc[Migrating Repositories Between Providers]`
        and `*** xref:git-and-github/transferring-repositories-between-github-accounts.adoc[Transferring Repositories Between GitHub Accounts]`.

- [x] Task 4. Update `modules/ROOT/pages/git-and-github/index.adoc`
  - [x] Task 4.1. Extend `:description:` and `:keywords:` (mirror clone, `git push --mirror`, Git LFS, Bitbucket to
        GitHub migration, transfer repository ownership).
  - [x] Task 4.2. Append both pages to the "New here? Read in this order" paragraph as advanced topics, and add a
        `=== Moving repositories` group (after *Collaborating*, before *Reference*) with one bullet per page.
  - [x] Task 4.3. Bibliography: add Git LFS (https://git-lfs.com/ and GitHub's man pages), Bitbucket Cloud docs on
        repository access tokens / API tokens, GitHub Docs on transferring repositories, duplicating repositories,
        importing source code, large files; and Pro Git *Git on the Server* and *Git Internals — The Refspec*.
        Verify each URL resolves.

- [x] Task 5. Update `modules/ROOT/pages/git-and-github/cheat-sheet.adoc`
  - [x] Task 5.1. Extend `:description:`/`:keywords:` and the intro sentence with a "Move a repository" block.
  - [x] Task 5.2. Add a *Moving repositories* entry with both xrefs to the dedicated-pages list.
  - [x] Task 5.3. Add the exact mirror clone / push, LFS fetch / push and ownership-transfer `gh api` commands
        (fictitious names) in the page's description of the sheet's content, keeping the text consistent with the PDF
        (Task 7).

- [x] Task 6. Cross-links from existing pages
  - [x] Task 6.1. `repositories-and-cloning.adoc`, end of `=== Remotes: ...`: one sentence pointing to both new pages
        for moving or copying a repository to another host or owner.
  - [x] Task 6.2. `fetch-pull-and-push.adoc`, next to the `--force-with-lease` versus `--force` section: a sentence
        warning that `git push --mirror` deletes remote refs absent locally, with an xref to the migration page.

### Group 3 — Cheat-sheet PDF (Parallelizable: yes — single task; needs the Task 5 content)

- [x] Task 7. Regenerate `modules/ROOT/attachments/git-cheat-sheet.pdf`
  - [x] Task 7.1. Inspect the current PDF (PyMuPDF `get_text` / `pdftotext -layout`, render to PNG) to capture
        palette, fonts, grid and where a compact block fits.
  - [x] Task 7.2. Rebuild a scratch HTML/CSS layout in the scratchpad reproducing the existing content plus a
        "Move a repository" block (`git clone --mirror`, `git push --mirror`, `git lfs fetch --all` /
        `git lfs push --all`, `gh api --method POST repos/<owner>/<repo>/transfer -f new_owner=<new-owner>`) using
        placeholders only. If recovering the existing content as HTML is not reliable, report that and ask before
        replacing the PDF.
  - [x] Task 7.3. Render with headless Chromium `--print-to-pdf` (A4 portrait); verify exactly one page, no clipping,
        by rendering to PNG and inspecting. Commit only the PDF, overwriting the old one.

### Group 4 — Build and verification (Parallelizable: yes — single task; needs everything above)

- [x] Task 8. Build and verify
  - [x] Task 8.1. `npx antora antora-playbook.yml` (no `--fetch`); delegate to the `iru-gate-runner` agent if
        output is large. Zero `xref`/AsciiDoc errors attributable to the changed files.
  - [x] Task 8.2. Run the `CLAUDE.md` checks: block image macros unclosed, inline image macros unclosed,
        `<p>image::` leaks in `build/site`, unquoted-comma alt text on changed files, and the inline-code
        substitution grep on `build/site/git-and-github`; all must print nothing.
  - [x] Task 8.3. `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` — every diagram parses. Grep the
        changed files for real-looking tokens/hosts (`grep -rniE 'ATBB|ghp_|github_pat_|x-token-auth@[^ ]*:'`
        should only show placeholders). Confirm `build/` stays untracked and `node_modules` changes are not staged.
  - [x] Task 8.4. Open the built pages in headless Chromium (Playwright) to confirm the Mermaid diagram renders and
        nav/index show both pages.
  > Done: Antora build clean (exit 0); CLAUDE.md image/alt checks print nothing; inline-code check prints nothing for
  every changed file (one more pre-existing `**` hit in `repositories-and-cloning.adoc` fixed with `+**+`; remaining
  hits are in untouched pages); `validate:mermaid` parsed all diagrams; detect-secrets scan of the changed files found
  nothing; Playwright confirmed the Mermaid SVG renders, both pages are in nav/index/cheat sheet, 0 unresolved xrefs;
  cheat-sheet PDF is 1 A4 page.
