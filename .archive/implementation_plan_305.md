# Implementation Plan: Guides & References — "Build Automation Tools (pip & Poetry)" and "Publishing & Distributing Libraries" (Python Reference)

## Task summary

Source: GitHub issue #305
Base branch: main

Issue [#305](https://github.com/albertoirurueta/docs/issues/305) adds an Antora sub-section
`modules/ROOT/pages/programming-languages/python/build-tools/` to the Python Reference: a detailed, learning-oriented
reference for **pip 26.2.2** and **Poetry 2.5.1 / poetry-core 2.5.0**, plus how to publish and distribute Python libraries
(`build` 1.6.1 + `twine` 7.0.0 + Trusted Publishing, and `poetry build` / `poetry publish`). **62 pages**: 11 shared (incl.
`index.adoc`, `ecosystem-and-learning-resources.adoc`, `cheat-sheet.adoc`), 19 under `pip/`, 17 under `poetry/`, 15 under
`publishing/`; a disclaimer partial, four new `****` groups in `nav-python.adoc`, original `python-build-tools-*.svg` figures plus
Mermaid diagrams, a one-page PDF `modules/ROOT/attachments/python-build-tools-cheat-sheet.pdf`, landing-page edits, five
back-links and a bibliography.

**The binding spec** is the issue body plus four outline comments (split only for GitHub's size limit): shared pages + running
scenario (issuecomment-6345068787), pip (-6345069532), Poetry (-6345070254), publishing (-6345070952). Local copies in the
session scratchpad (`/tmp/claude-0/-home-user-docs/2bc7f2d3-bf3b-5c3b-a451-83d620f497fa/scratchpad/`): `issue305_body.md`,
`issue305_comment1.md` (shared), `issue305_comment2.md` (pip), `issue305_comment3.md` (Poetry), `issue305_comment4.md`
(publishing); re-fetch with the GitHub MCP `issue_read` (`get` / `get_comments`) if missing. **Every page task must re-read its own
outline bullets** (★ depth, 📊 figures, source anchors, release-history tables) from those files. The running scenario is the
original *birdtally* library (pip flavour with hatchling, Poetry flavour with poetry-core) and the *birdtally-report* application,
defined at the top of comment 1.

### Choices made on the user's behalf

1. **Branch `feature/305-build-automation-tools-pip-poetry` (existing, 0 commits ahead of `main`), one draft PR to `main`** with
   `Closes #305` (base `main` and branch reuse confirmed by the user). The issue's optional five-PR split is not used (same decision as
   #297/#299/#300); the groups below follow its five slices so the work could still be cut.
2. **Tasks are untagged.** No installed `*-code-one-task` key fits AsciiDoc/Mermaid/SVG/PDF authoring, so tasks are implemented
   directly. Examples are **run for real** in scratch directories (never committed).
3. **Tooling must be built in the scratchpad (Task 1).** The machine has Python 3.13, pip 24.0, Poetry 2.4.3, uv 0.11.32, Chromium,
   `pdfinfo` and Node, **not** the baseline pip 26.2.2 / Poetry 2.5.1 / CPython 3.14.x. `pypi.org` is reachable; `pip.pypa.io` was
   answering **403 through the sandbox proxy**. Plan: install pip 26.2.2, Poetry 2.5.1, build 1.6.1, twine 7.0.0, pypiserver and
   hatchling into scratchpad venvs from PyPI; try `uv python install 3.14` (else use 3.13 and **state the Python actually used on every page**). If
   official-doc anchors cannot be fetched, check them against whatever mirror is reachable (e.g. GitHub sources of the docs) and, where
   not verifiable, record the URL as "not re-verified" in the baseline notes and **ask the user** before finishing (Task 1.4).
4. **Version baseline is re-verified at implementation time and dated** (Task 1.2): pip 26.3, a new Poetry 2.x, build, twine or Core
   Metadata may have landed; if so update the baseline everywhere.
5. **Examples that cannot run here** (uploads to PyPI/TestPyPI, Trusted Publishing, attestations, CI workflows, cloud registries,
   cibuildwheel matrices) are labelled "not run here" and checked line by line against the docs. The publishing round trip uploads only to
   a local pypiserver on `localhost:8080`; nothing named `birdtally` is ever uploaded to PyPI/TestPyPI.
6. **Existing pages get real `xref:`s** (verified with `ls`); issues #300, #196, #236 are mentioned in prose only (no `xref:` to
   pages that don't exist).
7. **Disclaimer** `python-build-tools-disclaimer.adoc` shaped exactly like `rust-disclaimer.adoc`, pointing to
   `programming-languages/python/index.adoc#_bibliography`; it is the **only** admonition in the section (no `NOTE`/`TIP`/`WARNING`/
   `CAUTION`/`IMPORTANT` anywhere else; write release notes/security remarks as prose or table rows).
8. **Nav**: four new `****` entries after Virtual Environments & Packaging in `nav-python.adoc`, pages as `*****` children, no
   `******` level, no nesting of pip/Poetry/Publishing under the shared entry. The partial is included at three sites in `nav.adoc`
   (lines ~41, ~853, ~1001); no `nav.adoc` change is needed.
9. **Figures**: every 📊 in the outlines is delivered (Mermaid or original `python-build-tools-*.svg`; no Python/PyPI/PyPA/Poetry/
   GitHub/GitLab logos, no documentation figures). Every SVG is referenced by a page.

### Mandatory conventions for every page task (from the issue and `CLAUDE.md`)

- Header: `= Title`, `:description:`, `:keywords:`, then `include::partial$python-build-tools-disclaimer.adoc[]`; the intro states the
  release it was written against (pip 26.2.2, Poetry 2.5.1 / poetry-core 2.5.0, build 1.6.1, twine 7.0.0) and the CPython used;
  features newer than pip 25.0 / Poetry 2.0 name their release and say experimental/provisional/deprecated in prose.
- Each concept: what/why with design rationale and the PEP that standardised it; every relevant command, option (with `PIP_*` /
  `POETRY_*` form), setting, `pyproject.toml` key and exit code; the other tool's equivalent (sentence or small table, linked); real error
  messages; classic bugs; the release where a feature appeared, changed, was deprecated or removed.
- Each example: complete and runnable on the baseline, with **real output** (`[source,text]` produced by running it; never invented),
  followed by `Source: https://…[…]` to the official page/anchor (looked up, never guessed). Source block types per the issue
  (`toml`, `text`, `ini`, `bash`, `powershell`, `python`, `json`, `yaml`, `dockerfile`; check highlight.js has TOML, else `ini`).
  Credentials only via env vars / placeholders (`pypi-AgEI…`); no real tokens, passwords or private hosts.
- Each page ends with `== References` (official online docs only).
- AsciiDoc pitfalls (`CLAUDE.md` + issue): inline code containing `${…}`, `*`/`**`, `~`, `^` (**every** Poetry caret/tilde constraint),
  `->`, `=>`, `<=`, `<-`, `'` between letters, `#`, `__` (`__token__`, `__version__`) uses `` `+…+` ``; containing `+` (local versions,
  `git+https://`, `poetry-plugin-export>=1.10`) uses `` `pass:c[…]` `` (`]` as `\]`); `|` in tables escaped `\|`. Image macros on one
  line at column 0, alt text with a comma wrapped in double quotes. Mermaid: `<` followed by a letter or `/` written as `&lt;`.
- Each task's own verification: run its examples; grep its files for unquoted-comma image alt text, unclosed block macros and
  admonition blocks (only the disclaimer include may exist); check every `Source:` URL/anchor as far as the network allows.

## Current code state

- No application code. Site definition `antora-playbook.yml`; component `ROOT` (`antora.yml`); nav `modules/ROOT/nav.adoc` includes
  `partial$nav-python.adoc` at three sites. Build: `npx antora antora-playbook.yml`; `npm run validate:mermaid`
  (`scripts/validate-mermaid.mjs`, needs a one-off `npm i --no-save mermaid@11 jsdom`).
- `modules/ROOT/partials/nav-python.adoc`: `***` Python Reference then `****` pages; line 28 is
  `**** xref:programming-languages/python/virtual-environments-and-packaging.adoc[Virtual Environments & Packaging]` (insertion point).
- `modules/ROOT/partials/rust-disclaimer.adoc` is the disclaimer template (single `[IMPORTANT]` block + xref to the section bibliography).
- Python Reference: `modules/ROOT/pages/programming-languages/python/` (27 pages incl. `virtual-environments-and-packaging.adoc`,
  `modules-and-packages.adoc`, `index.adoc` with `== What's covered` (`=== Getting started`, `Core language`, `Object-oriented
  programming`, `Modern Python & standard library`, `Testing & reference`) and `== Bibliography`, and `cheat-sheet.adoc`).
- `build-tools/` does **not** exist yet; no remote `feature/305*` branch. `.archive/implementation_plan_300.md` (JVM build tools, 135
  pages) is the structural precedent; sibling section `programming-languages/jvm-build-tools/` and its images
  `jvm-build-tools-*.svg`, partial `jvm-build-tools-disclaimer.adoc`, PDF `attachments/jvm-build-tools-cheat-sheet.pdf` show the
  conventions. 6 python-related SVGs exist in `modules/ROOT/images/`; new ones are named `python-build-tools-*.svg`.
- Back-link targets (all verified to exist): `programming-languages/python/virtual-environments-and-packaging.adoc`,
  `programming-languages/python/modules-and-packages.adoc`, `programming-languages/rust/python-interop-with-pyo3.adoc`,
  `web/django/reusable-apps-and-third-party-packages.adoc`, `backend/fastapi/deployment.adoc`. Also linked, not edited:
  `backend/fastapi/docker-and-kubernetes.adoc`, `backend/flask/docker-and-kubernetes.adoc`, `web/django/docker-and-kubernetes.adoc`,
  `ai/cli-for-agents/packaging-and-distribution.adoc`, `programming-languages/python/{testing,debugging-and-tooling,docstrings}.adoc`.
  Also update `programming-languages/index.adoc` if it lists Python Reference topics.
- Tooling here: Python 3.11–3.13, pip 24.0, Poetry 2.4.3, uv 0.11.32, `pdfinfo`, Chromium (`/opt/pw-browsers`), Node 22. Missing: pip
  26.2.2, Poetry 2.5.1, build, twine, pypiserver, CPython 3.14 (to install in the scratchpad). `pypi.org` reachable; `pip.pypa.io`
  403 via proxy.

## Implementation steps

### Group 1 — Tooling, baseline, shared partials (Parallelizable: no — every later group depends on the verified baseline, tooling and nav/partial skeleton)

- [x] Task 1. Prepare tooling and verify the baseline
  - [x] Task 1.1. In the scratchpad create: a Python venv (try `uv python install 3.14`; else 3.13 and say so on every page) with
    `pip==26.2.2`; Poetry 2.5.1 via `POETRY_HOME` installer or `pipx`/venv (never in a project env); a tools venv with `build==1.6.1`,
    `twine==7.0.0`, `pypiserver`, `hatchling`, `poetry-core==2.5.0`, `poetry-plugin-export`; check `python -m pip --version` and
    `poetry --version`. Scaffold the *birdtally* (both flavours) and *birdtally-report* skeletons from comment 1 in scratch dirs.
  - [x] Task 1.2. Re-verify the version baseline tables (pip, Poetry, poetry-core, plugins, build, twine, backends, actions, specs)
    against the PyPI JSON API and record the date; update baselines if newer releases landed.
  - [x] Task 1.3. Check highlight.js in `ui-bundle.zip` for `toml`, `ini`, `powershell`, `dockerfile`, `yaml`, `json`; check how the nav
    renders the new `****`/`*****` depth. Write findings to scratchpad `python-build-tools-baseline-notes.md`.
  - [x] Task 1.4. Curl-check every URL/anchor in the inventory and outlines as far as the proxy allows (PyPI, packaging.python.org,
    python-poetry.org, peps.python.org, GitHub). For hosts that are blocked (e.g. `pip.pypa.io`), record "not re-verified" in the notes;
    if a material share of links cannot be verified, ask the user how to proceed before Group 3.
- [x] Task 2. Create the shared partials and nav skeleton
  - [x] Task 2.1. `modules/ROOT/partials/python-build-tools-disclaimer.adoc` shaped like `rust-disclaimer.adoc`, linking
    `xref:programming-languages/python/index.adoc#_bibliography[the Python Reference bibliography]`.
  - [x] Task 2.2. `modules/ROOT/partials/nav-python.adoc`: after line 28 add the four `****` groups (Build Automation Tools (pip &
    Poetry) with its shared `*****` children ending in `Ecosystem` and `Cheat Sheet (PDF)`; pip; Poetry; Publishing & Distributing
    Libraries) with all 62 xrefs in the outline order. Keep xrefs to pages not yet written until Group 9 verifies none dangle.

### Group 2 — Slice 1: shared pages (Parallelizable: yes — distinct files; `index.adoc` and `cheat-sheet.adoc` are deferred to Groups 8–9)

- [x] Task 3. ★ `build-tools/packaging-concepts-and-standards.adoc` (📊 SVG `python-build-tools-packaging-flow.svg`)
- [x] Task 4. ★ `build-tools/pyproject-toml.adoc` (both *birdtally* flavours side by side)
- [x] Task 5. ★ `build-tools/versions-and-dependency-specifiers.adoc` (pip ↔ Poetry constraint translation table; caret/tilde passthroughs)
- [x] Task 6. `build-tools/environments-and-externally-managed-pythons.adoc` (real PEP 668 error output)
- [x] Task 7. ★ `build-tools/lock-files-and-reproducible-installs.adoc` (📊 Mermaid "which lock file?")
- [x] Task 8. `build-tools/supply-chain-security.adoc`
- [x] Task 9. `build-tools/ci-caching-and-containers.adoc` (📊 Mermaid Docker layers)
- [x] Task 10. `build-tools/choosing-and-migrating.adoc` (📊 Mermaid decision flowchart)
- [x] Task 11. `build-tools/ecosystem-and-learning-resources.adoc` (grouped project tables only; re-verify versions and URLs)

### Group 3 — Slice 2a: pip getting started, installing and managing (Parallelizable: yes — distinct files; `pip/index.adoc` deferred to Task 36)

- [x] Task 12. `pip/installing-and-upgrading-pip.adoc` and `pip/running-pip-and-general-options.adoc`
- [x] Task 13. ★ `pip/installing-packages.adoc` (every `pip install` option incl. `--uploaded-prior-to`, `--only-deps`, `--report`, `--dry-run`)
- [x] Task 14. `pip/managing-installed-packages.adoc` (`uninstall`, `list`, `show`, `freeze`, `check`, `inspect`)
- [x] Task 15. ★ `pip/requirements-files.adoc`; `pip/constraints-and-build-constraints.adoc`; `pip/dependency-groups-and-inline-script-metadata.adoc`

### Group 4 — Slice 2b: pip resolution, sources, configuration, reproducibility (Parallelizable: yes — distinct files)

- [x] Task 16. ★ `pip/dependency-resolution.adoc` (📊 backtracking-loop figure; real `ResolutionImpossible` demo)
- [x] Task 17. `pip/package-indexes-and-finding-packages.adoc` and `pip/vcs-direct-url-and-local-project-installs.adoc`
- [x] Task 18. ★ `pip/build-system-interface.adoc` (📊 PEP 517 hook sequence) and `pip/wheels-and-caching.adoc`
- [x] Task 19. ★ `pip/configuration.adoc` (📊 configuration precedence) and `pip/authentication-proxies-and-certificates.adoc`
- [x] Task 20. ★ `pip/repeatable-and-secure-installs.adoc` (tampered-hash demo) and `pip/pip-lock-and-pylock-toml.adoc` (experimental labelling)
- [x] Task 21. `pip/versions-and-release-history.adoc` (20.3 → 26.2.2, every change with its release) and `pip/troubleshooting.adoc`

### Group 5 — Slice 3a: Poetry getting started, dependencies (Parallelizable: yes — distinct files; `poetry/index.adoc` deferred to Task 36)

- [x] Task 22. `poetry/installation-and-self-management.adoc` and ★ `poetry/basic-usage-and-project-setup.adoc`
- [x] Task 23. ★ `poetry/pyproject-toml-and-project-metadata.adoc` (`[project]` vs `[tool.poetry]`, every key)
- [x] Task 24. ★ `poetry/dependency-specification.adoc` and ★ `poetry/managing-dependencies-and-groups.adoc`
- [x] Task 25. ★ `poetry/lock-file-install-update-and-sync.adoc` (📊 install vs update vs sync; stale-lock error demo)

### Group 6 — Slice 3b: Poetry environments, configuration, commands, upkeep (Parallelizable: yes — distinct files)

- [x] Task 26. `poetry/managing-environments.adoc` and ★ `poetry/configuration.adoc` (every setting with `POETRY_*` form)
- [x] Task 27. ★ `poetry/repositories-and-package-sources.adoc` (📊 source priorities)
- [x] Task 28. `poetry/commands-reference.adoc` (every command and option) and `poetry/plugins.adoc`
- [x] Task 29. `poetry/exporting-requirements-and-bundling.adoc` and `poetry/tox-nox-pre-commit-and-docker.adoc`
- [x] Task 30. `poetry/versions-and-release-history.adoc`, `poetry/migrating-to-poetry-2.adoc` and `poetry/troubleshooting-and-faq.adoc`

### Group 7 — Slice 4: Publishing & Distributing Libraries (Parallelizable: yes — distinct files; `publishing/index.adoc` deferred to Task 36)

- [x] Task 31. ★ `publishing/preparing-a-library.adoc` and ★ `publishing/build-backends.adoc` (PEP 639, classifiers, `py.typed`; link `rust/python-interop-with-pyo3.adoc`)
- [x] Task 32. ★ `publishing/versioning-and-release-management.adoc`, ★ `publishing/building-sdists-and-wheels.adoc` (📊 SVG wheel-filename anatomy) and `publishing/binary-wheels-and-extension-modules.adoc`
- [x] Task 33. `publishing/checking-and-testing-distributions.adoc`, `publishing/pypi-and-testpypi-accounts-and-tokens.adoc`, ★ `publishing/publishing-with-build-and-twine.adoc` (local pypiserver round trip, re-upload error demo) and ★ `publishing/publishing-with-poetry.adoc`
- [x] Task 34. ★ `publishing/trusted-publishing-and-attestations.adoc` (📊 OIDC flow) and ★ `publishing/github-actions-and-gitlab-ci-release-workflows.adoc` (current action majors; "not run here")
- [x] Task 35. `publishing/managing-published-releases.adoc`, `publishing/private-indexes-and-alternative-distribution.adoc` and `publishing/distributing-applications-and-cli-tools.adoc`

### Group 8 — Landing pages, index pages, back-links, bibliography (Parallelizable: no — index pages and bibliography depend on every page's final title/sources)

- [x] Task 36. The four group landing pages: `build-tools/index.adoc` (📊 Mermaid roles flowchart, version baseline table, reading path), `pip/index.adoc`, `poetry/index.adoc`, `publishing/index.adoc` (publishing dates, release checklist)
- [x] Task 37. `programming-languages/python/index.adoc`: `=== Build automation, packaging and publishing` under `== What's covered`, `:description:`/`:keywords:` additions, and `=== Build automation, packaging and publishing` bibliography entries (pip, Poetry, PyPA standards/PEPs, PyPI, building/publishing tools, specifications, third-party; each linked to its official site; existing entries untouched)
- [x] Task 38. `programming-languages/python/cheat-sheet.adoc` paragraph; `programming-languages/index.adoc` if it lists Python topics
- [x] Task 39. Back-links (one line each): `virtual-environments-and-packaging.adoc` (intro + `== See Also`), `modules-and-packages.adoc`, `rust/python-interop-with-pyo3.adoc`, `web/django/reusable-apps-and-third-party-packages.adoc`, `backend/fastapi/deployment.adoc` (xref to `lock-files-and-reproducible-installs`)

### Group 9 — Cheat sheet and PDF (Parallelizable: no — summarises every page)

- [x] Task 40. `build-tools/cheat-sheet.adoc` (grouped `*Group* --` xref paragraphs, PDF link, `== References`)
- [x] Task 41. One-page A4-landscape PDF `modules/ROOT/attachments/python-build-tools-cheat-sheet.pdf` from a throwaway HTML page in the scratchpad via headless Chrome `--print-to-pdf --no-pdf-header-footer`; required content per comment 1 (shared, pip ↔ Poetry table, pip, Poetry, publishing, "then → now" strip); check `pdfinfo` = 1 page and preview as PNG; commit only the PDF

### Group 10 — Final verification (Parallelizable: no — needs everything in place)

- [x] Task 42. `npx antora antora-playbook.yml` completes with no `xref`/AsciiDoc errors or warnings; no `xref:` to a missing page; no unreferenced `python-build-tools-*.svg`; `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` reports every diagram parsed
- [x] Task 43. Run the `CLAUDE.md` greps (block/inline image macros closed on one line; `<p>image::` in `build/site`; unquoted-comma alt text on changed files; substitutions inside inline `<code>` for `build/site/.../python/build-tools`); also grep for admonition blocks other than the disclaimer
- [x] Task 44. Check in the built site that the four groups render, collapsed, under the Python Reference at all three nav include sites; spot-check ★ pages
- [x] Task 45. Secret check: no tokens/passwords/private hosts in any page (`detect-secrets` if available); confirm `build/` and scratch files are not committed
