# Implementation Plan: Guides & References / Backend Development — "Python Flask", "Python Tornado" and "Python Pyramid"

## Task summary

Source: GitHub issue #242
Base branch: main

Issue [#242](https://github.com/albertoirurueta/docs/issues/242) adds three sections to Backend Development, in this
order and right after Python FastAPI (before the TypeScript Reference include):

| Section | Folder | Files | Sources |
|---|---|---|---|
| **Python Flask** (main focus) | `modules/ROOT/pages/backend/flask/` | 47 pages + `cheat-sheet.adoc` | official docs, cross-checked against four books in `~/Desktop/libros/flask` |
| **Python Tornado** | `modules/ROOT/pages/backend/tornado/` | 25 pages + `cheat-sheet.adoc` | official docs only |
| **Python Pyramid** | `modules/ROOT/pages/backend/pyramid/` | 30 pages + `cheat-sheet.adoc` | official docs only |

Each section also ships a disclaimer partial (the only admonition allowed), original `flask-*` / `tornado-*` /
`pyramid-*` SVGs and Mermaid diagrams (at least where the issue marks 📊), a landing page ending in `== Bibliography`,
and a one-page A4 cheat-sheet PDF in `modules/ROOT/attachments/`. Existing pages get back-links, and the sentence in
`web/django/introduction-and-architecture.adoc` saying the Flask section "does not exist on this site yet" is replaced.

**The binding spec is the issue body plus its two comments** — [Part 1: Flask](https://github.com/albertoirurueta/docs/issues/242#issuecomment-6037285137)
and [Part 2: Tornado and Pyramid](https://github.com/albertoirurueta/docs/issues/242#issuecomment-6037285520). Every
page task must re-read its page's bullets there (`gh issue view 242 --comments`) and cover **every** bullet. The Flask
book concept tables (Part 1 § 1) assign each book row to a page; every row must be covered by the page named in its
last column. Every outdated/erroneous book item in Part 1 § 2 must be addressed in prose on the relevant page and
collected in `backend/flask/whats-changed-and-migration.adoc`.

**Out of scope:** re-documenting existing material (Python language, FastAPI, Django, OAuth theory, GraphQL, Docker,
Kubernetes, engine references — link instead); WebSockets/chat depth beyond the framework wiring (#264, prose only);
#263 and #196 (prose only); Symfony-style extras not in the outline.

### Choices made on the user's behalf

1. **One branch, staged PRs.** Work happens on `feature/242-python-flask-tornado-pyramid`. The issue suggests five PRs
   (Flask 1–3, Tornado, Pyramid). This plan is ordered so that each framework's groups form a coherent PR slice; the
   user decides at PR time whether to open one PR or split. Default: one draft PR to `main` with `Closes #242`.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`,
   `dotnet` and `database`; none fits AsciiDoc / Mermaid / SVG / PDF authoring, so every task is implemented directly.
   Python code inside pages is illustrative content, but **every example must be executed** against the pinned
   versions (see Lessons).
3. **The books appear only in `flask/index.adoc` `== Bibliography` and in each page's `== References`** (full data,
   publisher page, companion repo). They are never copied, quoted or committed. Where a page touches a book concept it
   says in prose where the book is outdated and shows the current approach.
4. **Disclaimers:** `partials/flask-disclaimer.adoc`, `tornado-disclaimer.adoc`, `pyramid-disclaimer.adoc`, each a
   single `[IMPORTANT]` block (AI-assistance disclosure + `xref:backend/<fw>/index.adoc#_bibliography[…]`). No other
   admonition anywhere in the three sections; deprecations, version notes, security caveats and "book is outdated"
   remarks are prose or table rows.
5. **Version baseline re-verified at implementation time and dated** (Group 1). The issue's numbers (Flask 3.1.3,
   Werkzeug 3.1.9, Tornado 6.5.10, Pyramid 2.1) were checked 2026-10-07; Flask 3.2 and Tornado 6.6 may have been
   released since — if so, write against the new release and update the "what's changed" pages accordingly.
6. **Running scenarios are original:** Flask *Bookshelf*, Tornado *Bookshelf Live*, Pyramid *Bookshelf Shelves*
   (issue Part 1 § 3, Part 2 A.2 / B.2). Pages within a section build on each other.
7. **Cross-links:** a page may `xref:` only to pages that exist at the end of its own group or earlier, plus existing
   site pages (each target verified with `ls` before writing). Forward references to later groups are plain prose and
   are upgraded to `xref:` in the Group 20 cross-link pass. #263, #264 and #196 stay prose only.
8. **Figure floor:** every 📊 in the issue is delivered as Mermaid or an SVG named `flask-*.svg`, `tornado-*.svg` or
   `pyramid-*.svg`; more where they clarify. SVGs are original drawings (no logos, docs images or book figures), work
   in light and dark themes and are each referenced by a page.
9. **Packt/Manning URLs** could not be opened by automated fetches (Packt returns 403). Group 21 asks the user to
   open them in a browser, and the final report says if that was not done.

### Lessons from earlier section reviews (#198, #199 and siblings) — mandatory for every page task

**Verify every name against its official page before writing it** (every class, decorator, function, parameter, CLI
flag, env var, config key, import path and version number); if the docs don't confirm a detail, describe the behaviour
without naming it. **Security is correctness:** no hardcoded secrets (keys via `secrets.token_hex()` and config/env),
destructive examples show auth, never run debuggers in production examples. **Every concept gets at least one code
example**, each followed by a `Source:` link to the official page it derives from, and that URL goes in
`== References`. **Run the examples** in the Group 1 venvs (Flask `app.test_client()`, Tornado
`AsyncHTTPTestCase` / real loopback servers, Pyramid `webtest.TestApp`); examples needing external services use local
fakes. **URL hygiene:** canonical URLs only (note the Pyramid docs underscore/hyphen URL quirk). **Cross-links
accurate:** never `xref:` to a non-existent page; no `xref:` inside backticks; no empty link text on a fragment xref.
**AsciiDoc hygiene** (see `CLAUDE.md`): `.Title` captions; no leaked authoring notes; block `image::` macros on one
line with comma-containing alt text quoted; inline code containing `->`, `=>`, `__`, `*`, `~`, `^`, `...`, `'` or `{`
written as `+...+` / `pass:c[...]` passthroughs (matters for `+__init__+`, `+__getitem__+`, `+__acl__+`, `+__json__+`,
`+**kwargs+`, `+{{ }}+`, `+{% %}+`); `{placeholders}` literal inside `[source]` blocks and escaped in prose; no prose
line starting with `<digits>.`; Mermaid stereotypes as `&lt;&lt;...&gt;&gt;`.

## Current code state

* **Repo:** Antora root component `ROOT` (`antora.yml`); pages in `modules/ROOT/pages/`, nav in `modules/ROOT/nav.adoc`,
  partials in `modules/ROOT/partials/`, figures in `modules/ROOT/images/`, PDFs in `modules/ROOT/attachments/`.
* **`modules/ROOT/nav.adoc`:** the FastAPI block ends with `**** xref:backend/fastapi/cheat-sheet.adoc[Cheat Sheet (PDF)]`
  (~line 798), immediately followed by `include::partial$nav-typescript.adoc[]`. The new three blocks go between them.
* **`modules/ROOT/partials/nav-python.adoc`:** header comment already lists its three usage sites (done for #199) —
  no change needed.
* **Not present yet:** `backend/flask|tornado|pyramid/` pages, the three disclaimer partials, any `flask-*`,
  `tornado-*`, `pyramid-*` SVG, the three cheat-sheet PDFs.
* **`modules/ROOT/pages/backend/index.adoc`:** `:description:` / `:keywords:` and a bullet list whose Python FastAPI
  bullet is at ~line 18; add three bullets after it.
* **Root `modules/ROOT/pages/index.adoc`:** `:description:` / `:keywords:` (lines 2-3) to extend.
* **Back-link targets:** `programming-languages/python/index.adoc` (line ~21 "Where Python is used on this site");
  `backend/fastapi/introduction-and-architecture.adoc` (comparison table rows for Flask ~346 and Quart ~359);
  `backend/fastapi/sub-applications-wsgi-and-graphql.adoc` (`== Embedding Flask or Django with WSGIMiddleware`, ~438);
  `web/django/introduction-and-architecture.adoc` (~727-728 sentence about #242, and its Flask comparison row);
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (Python rows ~377-385).
* **Templates:** `partials/fastapi-disclaimer.adoc`; `backend/fastapi/index.adoc` (landing page + `== Bibliography`
  layout); `backend/fastapi/cheat-sheet.adoc`; `attachments/fastapi-cheat-sheet.pdf`; `images/fastapi-*.svg`;
  precedent plans `.archive/implementation_plan_199.md` (single section) and `_195.md` (two sections).
* **Tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (after `npm i --no-save mermaid@11 jsdom`),
  the `iru-build-docs` skill, headless Chrome and `pdfinfo` for the PDFs. Baseline build must be re-run in Group 1 to
  record the starting warning count (expected 0 errors / 0 warnings).
* **Existing link targets verified to exist:** Python Reference, FastAPI, Django, `backend/oauth`, `backend/graphql`,
  `backend/docker`, `backend/kubernetes`, `backend/messaging`, `backend/scheduling`, `backend/media-optimization`,
  `backend/architecture/architectural-patterns`, `database/{redis,mongodb,elasticsearch,sql}`, `cloud`, `ai`,
  `web/react`, `web/cors.adoc`. There are **no OWASP pages** on the site — cite OWASP Cheat Sheets externally.

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, blank line, `include::partial$<fw>-disclaimer.adoc[]`.
* **Lead paragraph** states the versions written against, dated.
* **Content:** what/why; how the framework implements it (and which library underneath does the work); every relevant
  option/setting (tables for settings); pitfalls and security implications; recent changes with versions; for Flask,
  where the books are outdated. Python 3.10+ syntax, current APIs only; requests with `curl`/HTTPie
  (`[source,bash]`) and responses (`[source,json]` / `[source,text]`).
* **Each example** is followed by `Source: <official URL>[Title]`.
* **Page ending:** `== References` listing only official docs (and, for Flask, the relevant books' publisher pages).
* ★ pages are the most detailed pages of their section.

## Implementation steps


### Group 1 — Scaffolding, version verification and tooling

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create the three disclaimer partials `modules/ROOT/partials/flask-disclaimer.adoc`, `tornado-disclaimer.adoc` and `pyramid-disclaimer.adoc`. Files: modules/ROOT/partials/{flask,tornado,pyramid}-disclaimer.adoc (single [IMPORTANT] block each; 1.2 holds, section folders do not exist yet, rule stays binding for later groups).
  - [x] Task 1.1. Copy the shape of `partials/fastapi-disclaimer.adoc`: a single `[IMPORTANT]` block with only the AI-assistance disclosure and `xref:backend/<fw>/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear anywhere under the three section folders.
- [x] Task 2. Verify and record the version baseline (scratchpad `versions-242.md`) that every later task cites. Recorded in scratchpad 242/versions-242.md: Flask 3.1.3, Werkzeug 3.1.9, Tornado 6.5.10 (6.6 only 6.6a1), Pyramid 2.1; no Flask/Werkzeug 3.2 release, baseline unchanged.
  - [x] Task 2.1. Flask, Werkzeug, Jinja2, Click, ItsDangerous, MarkupSafe, Blinker, Quart and the extensions used (Flask-SQLAlchemy, Flask-Migrate, Flask-WTF, Flask-Login, Flask-JWT-Extended, flask-smorest, APIFlask, Flask-Caching, Flask-Babel, Flask-Admin, Celery, Gunicorn, Waitress): current versions and dates from PyPI; check whether Flask 3.2 / Werkzeug 3.2 are released and, if so, rebase the plan's Flask baseline on them.
  - [x] Task 2.2. Tornado (6.5.10 vs 6.6 final) and Pyramid (2.1) plus their companion packages (pyramid_jinja2, pyramid_tm, pyramid_debugtoolbar, pyramid_retry, WebTest, Waitress, Deform, Colander, zope.sqlalchemy).
  - [x] Task 2.3. Re-check the "coming in Flask 3.2" list, Tornado 6.6 notes and the cookiecutter `2.1-branch` output (`setup.py` vs `pyproject.toml`) against the issue's claims; record any difference.
- [x] Task 3. Create one virtual environment per framework in the scratchpad with the pinned versions, used to run every example. Venvs and runner in scratchpad 242/ (venv-flask, venv-tornado, venv-pyramid, run_page.py); cookiecutter 2.1-branch output generates pyproject.toml, 4 tests pass.
  - [x] Task 3.1. Flask venv: Flask + the extensions the pages use + pytest; Tornado venv: Tornado + pytest (external services are replaced by local fakes); Pyramid venv: Pyramid + pyramid_jinja2/pyramid_tm/WebTest/Waitress/SQLAlchemy 2.0 + the cookiecutter output generated from `2.1-branch`.
  - [x] Task 3.2. Write a tiny runner script that extracts and executes the `[source,python]` blocks of a page flagged as runnable, so later tasks can re-run examples quickly.
- [x] Task 4. Record the build baseline and install the Mermaid validator. Baseline build: 0 errors / 0 warnings (exit 0, empty log); validate:mermaid parsed all 1277 diagrams.
  - [x] Task 4.1. Run `npx antora antora-playbook.yml` and note the error/warning counts (expect 0/0).
  - [x] Task 4.2. Run `npm i --no-save mermaid@11 jsdom` so `npm run validate:mermaid` works in the final groups.
- [x] Task 5. Confirm the existing page targets that pages will `xref:` to still exist (the list under "Existing link targets verified"), and write the confirmed list to the scratchpad for page tasks to reuse. All targets confirmed; list in scratchpad 242/xref-targets.txt (every component resolves to its index.adoc).

### Group 2 — Flask foundations pages

**Parallelizable: yes (five independent pages)**

- [x] Task 6. Create `backend/flask/introduction-and-architecture.adoc` ("Introduction & Architecture"). Created backend/flask/introduction-and-architecture.adoc and images/flask-layer-stack.svg; 9 python blocks run OK; no Mermaid.
  - [x] Task 6.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 6.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 6.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 6.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
- [x] Task 7. Create `backend/flask/getting-started.adoc` ("Getting Started") ★. Created backend/flask/getting-started.adoc; 8 python blocks run OK (1 norun); shell commands run against live flask run; 2 Mermaid figures (dev loop, flask command startup); no SVG.
  - [x] Task 7.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 7.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 7.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 7.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
- [x] Task 8. Create `backend/flask/application-factory-and-project-layout.adoc` ("Application Factory & Project Layout") ★.
  - [x] Task 8.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 8.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 8.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 8.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `modules/ROOT/pages/backend/flask/application-factory-and-project-layout.adoc` and `modules/ROOT/images/flask-bookshelf-layout.svg`; also 2 Mermaid diagrams (factory steps, import direction; validated with mermaid 11). 10 python examples run with run_page.py (0 failures); the 17 Bookshelf file listings were extracted from the page into a project, pip-installed (editable and wheel), 8 pytest tests passed and the flask CLI commands were run.
- [x] Task 9. Create `backend/flask/configuration.adoc` ("Configuration") ★. Files: backend/flask/configuration.adoc, images/flask-config-sources.svg (plus one Mermaid precedence diagram); 23 python blocks run OK with the Group 1 runner (1 pytest block marked norun, run separately with pytest, 2 passed); all 29 Flask.default_config keys documented and asserted.
  - [x] Task 9.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 9.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 9.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 9.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
- [x] Task 10. Create `backend/flask/application-and-request-lifecycle.adoc` ("Application & Request Lifecycle") ★. Done: pages/backend/flask/application-and-request-lifecycle.adoc and images/flask-context-stack.svg; 18 runnable examples executed (0 failures), plus a Mermaid sequence diagram (validated).
  - [x] Task 10.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 10.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 10.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 10.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.

### Group 3 — Flask routing, views and requests pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 11. Create `backend/flask/routing-and-url-building.adoc` ("Routing & URL Building") ★.
  - [x] Task 11.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 11.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 11.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 11.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/routing-and-url-building.adoc` (no SVG; 1 Mermaid flowchart, parsed OK); all 19 Python examples executed with `--separate`, 0 failures. Book rows (B1 ch4/ch9, B3 ch4, B4 ch9) and outdated items addressed in prose and the "What Changed" table.
- [x] Task 12. Create `backend/flask/request-data.adoc` ("Request Data") ★.
  - [x] Task 12.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 12.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 12.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 12.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `modules/ROOT/pages/backend/flask/request-data.adoc` (no outline figure marked; one Mermaid body-routing diagram delivered, parsed by validate-mermaid). All 19 Python examples executed with `app.test_client()` (Flask 3.1.3, Werkzeug 3.1.9, Python 3.13), 0 failures.
- [x] Task 13. Create `backend/flask/responses-and-json.adoc` ("Responses & JSON") ★.
  - [x] Task 13.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 13.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 13.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 13.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/responses-and-json.adoc`; all 19 Python examples executed OK in venv-flask (flask-orjson 2.0.0 and orjson installed there for the orjson example); figure: Mermaid flowchart of the view return-value conversion (no SVG).
- [x] Task 14. Create `backend/flask/error-handling.adoc` ("Error Handling") ★.
  - [x] Task 14.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 14.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 14.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 14.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/error-handling.adoc`; all 16 Python examples executed OK in venv-flask; figure: Mermaid flowchart of handler selection (no SVG).
- [x] Task 15. Create `backend/flask/class-based-views.adoc` ("Class-based Views").
  - [x] Task 15.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 15.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 15.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 15.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/class-based-views.adoc` (no SVG; one Mermaid dispatch flowchart; the outline marks no figure); all 12 examples executed with `app.test_client()` on Flask 3.1.3, 0 failures.
- [x] Task 16. Create `backend/flask/hooks-and-view-decorators.adoc` ("Hooks & View Decorators").
  - [x] Task 16.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 16.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 16.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 16.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/hooks-and-view-decorators.adoc` (14 Python examples, all run OK with `--separate`; one Mermaid hook-order flowchart; no SVGs).
- [x] Task 17. Create `backend/flask/blueprints.adoc` ("Blueprints") ★.
  - [x] Task 17.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 17.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 17.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 17.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/blueprints.adoc` and `images/flask-blueprint-tree.svg` (referenced by the page); all 21 python blocks run OK (`run_page.py`, Flask 3.1.3 / Python 3.13); one SVG figure (Bookshelf blueprint tree).

### Group 4 — Flask templates, sessions, forms and files pages

**Parallelizable: yes (five independent pages)**

- [x] Task 18. Create `backend/flask/jinja-templates.adoc` ("Jinja Templates") ★.
  - [x] Task 18.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 18.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 18.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 18.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Done: `backend/flask/jinja-templates.adoc` created; 15 Python blocks run OK (Flask 3.1.3, Python 3.13); figures: two Mermaid diagrams (render pipeline, template inheritance), no SVG.
- [x] Task 19. Create `backend/flask/static-files-and-assets.adoc` ("Static Files & Assets").
  - [x] Task 19.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 19.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 19.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 19.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/static-files-and-assets.adoc` and `images/flask-static-serving.svg`; all 9 Python examples executed OK (Flask 3.1.3, test client).
- [x] Task 20. Create `backend/flask/sessions-cookies-and-flashing.adoc` ("Sessions, Cookies & Flashing") ★.
  - [x] Task 20.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 20.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 20.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 20.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/sessions-cookies-and-flashing.adoc` (19 runnable examples, all run OK with Flask 3.1.3 and Flask-Session 0.8.0 + fakeredis); figures: 2 Mermaid sequence diagrams (signed-cookie round trip, flash across a redirect); no SVGs.
- [x] Task 21. Create `backend/flask/forms-with-flask-wtf.adoc` ("Forms with Flask-WTF") ★.
  - [x] Task 21.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 21.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 21.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 21.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `modules/ROOT/pages/backend/flask/forms-with-flask-wtf.adoc`; all 16 Python examples executed OK (Flask 3.1.3, Flask-WTF 1.3.0, WTForms 3.2.2, wtforms-sqlalchemy 0.4.2); figures: two Mermaid diagrams (form lifecycle flowchart, CSRF token sequence), no SVGs.
- [x] Task 22. Create `backend/flask/file-uploads.adoc` ("File Uploads").
  - [x] Task 22.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 22.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 22.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 22.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/file-uploads.adoc` and `images/flask-upload-pipeline.svg` (plus one Mermaid sequence diagram for presigned S3 uploads); all 13 runnable blocks executed OK (Pillow and boto3 blocks run with those packages on PYTHONPATH, dummy env credentials, no network); 1 config snippet marked `# norun`.

### Group 5 — Flask data pages

**Parallelizable: yes (four independent pages)**

- [x] Task 23. Create `backend/flask/sqlite3-and-database-basics.adoc` ("SQLite3 & Database Basics").
  - [x] Task 23.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 23.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 23.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 23.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/sqlite3-and-database-basics.adoc`; all 14 Python blocks run on Python 3.13 (venv-flask); one Mermaid figure (no SVG, the outline marks no figure for this page); no book rows assigned, book-outdated table included.
- [x] Task 24. Create `backend/flask/flask-sqlalchemy.adoc` ("Flask-SQLAlchemy") ★.
  - [x] Task 24.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 24.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 24.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 24.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: `backend/flask/flask-sqlalchemy.adoc` created; all 22 Python blocks run (Flask 3.1.3, SQLAlchemy 2.1.3; also on 2.0.54); dataclass-base and pytest conftest blocks are `# norun` but verified separately. Figures: two Mermaid diagrams (Bookshelf ER, session lifecycle), validated. No SVGs.
- [x] Task 25. Create `backend/flask/database-migrations.adoc` ("Database Migrations").
  - [x] Task 25.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 25.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 25.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 25.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: `backend/flask/database-migrations.adoc` plus `flask-migration-lifecycle.svg` and `flask-migration-branches.svg`; all 17 Python blocks ran (run_page.py, 0 failed); `flask db` transcripts captured from a real scratch project; Kubernetes/Compose YAML parsed but not deployed.
- [x] Task 26. Create `backend/flask/nosql-redis-mongodb-and-search.adoc` ("NoSQL, Redis, MongoDB & Search").
  - [x] Task 26.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 26.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 26.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 26.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: page `backend/flask/nosql-redis-mongodb-and-search.adoc` done; all 17 Python blocks executed (fakeredis, mongomock, in-memory ES fake, real Whoosh and SQLite FTS5); figures: 2 Mermaid diagrams (wiring flowchart, write-path sequence), no SVG.

### Group 6 — Flask security pages

**Parallelizable: yes (four independent pages)**

- [x] Task 27. Create `backend/flask/authentication-and-flask-login.adoc` ("Authentication & Flask-Login") ★.
  Note: created `backend/flask/authentication-and-flask-login.adoc` and `images/flask-login-user-loading.svg` plus a Mermaid login sequence; all 19 runnable examples executed OK (Flask 3.1.3, Flask-Login 0.6.3, argon2-cffi 25.1.0, bcrypt 5.0.0); detect-secrets clean. Found and documented: strong session protection cancels remember-me in 0.6.3.
  - [x] Task 27.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 27.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 27.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 27.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
- [x] Task 28. Create `backend/flask/oauth-social-login-and-ldap.adoc` ("OAuth Social Login & LDAP").
  - [x] Task 28.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 28.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 28.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 28.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/oauth-social-login-and-ldap.adoc` (15 runnable Python blocks all run OK with Flask 3.1.3, Authlib 1.8.0, Flask-Dance 7.1.0, ldap3 MOCK_SYNC, python-ldap escaping; 1 python-ldap bind block marked `# norun`); local fakes only (responses plus an in-process OIDC provider, canned GitHub); figures: 2 Mermaid diagrams (OIDC login sequence, LDAP search-then-bind flowchart), no SVGs; detect-secrets scan clean.
- [x] Task 29. Create `backend/flask/authorization-and-roles.adoc` ("Authorization & Roles").
  - [x] Task 29.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 29.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 29.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 29.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: page `backend/flask/authorization-and-roles.adoc` written (about 1100 lines); all 13 Python examples run (Flask 3.1.3, Flask-Login, Flask-Principal 0.4.0, Flask-Security-Too 5.9.1, Flask-JWT-Extended 4.7.4); figure is a Mermaid flowchart (no SVG); detect-secrets clean.
- [x] Task 30. Create `backend/flask/security-considerations.adoc` ("Security Considerations") ★.
  - [x] Task 30.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 30.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 30.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 30.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `pages/backend/flask/security-considerations.adoc` and `images/flask-security-layers.svg` (plus one Mermaid CSRF sequence); all 24 Python blocks executed (Flask 3.1.3, Flask-Talisman 1.1.0, Flask-Limiter 4.1.1, nh3 0.3.7); detect-secrets clean.

### Group 7 — Flask API pages

**Parallelizable: yes (four independent pages)**

- [x] Task 31. Create `backend/flask/building-rest-apis.adoc` ("Building REST APIs") ★.
  - [x] Task 31.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 31.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 31.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 31.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Done: `backend/flask/building-rest-apis.adoc` (no SVG); 16 python examples run OK with the Group 1 venv (plus flask-restx, flask-restful, flask-openapi3 installed there); 1 Mermaid figure (request through validation, service, serialization); detect-secrets clean.
- [x] Task 32. Create `backend/flask/openapi-and-api-documentation.adoc` ("OpenAPI & API Documentation") ★.
  - [x] Task 32.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 32.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 32.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 32.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Done: page `backend/flask/openapi-and-api-documentation.adoc` (no SVGs; 2 Mermaid diagrams); all 12 Python examples run OK in venv-flask (extra packages openapi-spec-validator installed in scratchpad venv only); detect-secrets clean.
- [x] Task 33. Create `backend/flask/jwt-and-api-authentication.adoc` ("JWT & API Authentication").
  - [x] Task 33.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 33.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 33.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 33.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/jwt-and-api-authentication.adoc` (13 Python examples, all run OK in venv-flask); figures: 2 Mermaid diagrams (scheme chooser flowchart, login/refresh/logout sequence); detect-secrets clean.
- [x] Task 34. Create `backend/flask/single-page-apps-and-cors.adoc` ("Single-Page Apps & CORS").
  - [x] Task 34.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 34.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 34.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 34.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/single-page-apps-and-cors.adoc`; all 11 Python examples executed OK (Flask 3.1.3, Flask-CORS 6.0.5 installed in venv-flask, Flask-JWT-Extended, Flask-WTF); figures: 2 Mermaid diagrams (three architectures, preflight sequence), validated; detect-secrets clean.

### Group 8 — Flask extensions and ecosystem pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 35. Create `backend/flask/extensions-and-ecosystem.adoc` ("Extensions & Ecosystem").
  - [x] Task 35.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 35.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 35.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 35.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  Done: `backend/flask/extensions-and-ecosystem.adoc`; 6 Python blocks run OK (shared namespace); 1 Mermaid figure (init_app pattern), no SVG; detect-secrets clean.
- [x] Task 36. Create `backend/flask/cli-and-shell.adoc` ("CLI & Shell").
  - [x] Task 36.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 36.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 36.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 36.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  Done: `backend/flask/cli-and-shell.adoc` (15 Python blocks executed OK in the Flask venv; one Mermaid figure, no SVG; detect-secrets clean).
- [x] Task 37. Create `backend/flask/signals.adoc` ("Signals").
  - [x] Task 37.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 37.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 37.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 37.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `pages/backend/flask/signals.adoc`; 7 example blocks run OK (venv-flask); figure: Mermaid flowchart of where each core signal fires; no new SVGs.
- [x] Task 38. Create `backend/flask/admin-interfaces-with-flask-admin.adoc` ("Admin Interfaces with Flask-Admin").
  - [x] Task 38.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 38.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 38.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 38.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `pages/backend/flask/admin-interfaces-with-flask-admin.adoc`; 13 example blocks run OK (venv-flask); figures: 2 Mermaid flowcharts (list request path, form save path); no new SVGs.
- [x] Task 39. Create `backend/flask/internationalization-with-flask-babel.adoc` ("Internationalization with Flask-Babel").
  - [x] Task 39.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 39.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 39.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 39.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: page `backend/flask/internationalization-with-flask-babel.adoc`, figure `images/flask-i18n-catalog-workflow.svg` plus one Mermaid diagram (locale selection); 13 python examples run OK in venv-flask; detect-secrets clean.
- [x] Task 40. Create `backend/flask/caching.adoc` ("Caching").
  - [x] Task 40.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 40.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 40.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 40.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: `backend/flask/caching.adoc` created; 17 examples run OK (1 `# norun` Redis-URL config); one Mermaid figure (cache layers), no SVG.
- [x] Task 41. Create `backend/flask/background-jobs-celery-and-email.adoc` ("Background Jobs, Celery & Email") ★.
  - [x] Task 41.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 41.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 41.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 41.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Done: `backend/flask/background-jobs-celery-and-email.adoc`; 17 Python blocks run OK (Celery in-memory broker plus in-process worker, RQ on fakeredis, aiosmtpd local SMTP), 2 `# norun` file listings; figure: Mermaid web, broker, worker flow; no SVGs; detect-secrets clean.

### Group 9 — Flask async, streaming, testing and debugging pages

**Parallelizable: yes (five independent pages)**

- [x] Task 42. Create `backend/flask/async-gevent-and-quart.adoc` ("Async, gevent & Quart") ★.
  - [x] Task 42.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 42.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 42.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 42.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/async-gevent-and-quart.adoc` and `images/flask-async-models.svg` (+ one Mermaid sequence diagram); 11 Python blocks run with run_page.py --separate, 3 gevent/ASGI blocks run as separate loopback scripts (gevent WSGIServer, Gunicorn -k gevent, Hypercorn); detect-secrets clean.
- [x] Task 43. Create `backend/flask/streaming-and-server-sent-events.adoc` ("Streaming & Server-Sent Events").
  - [x] Task 43.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 43.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 43.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 43.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/streaming-and-server-sent-events.adoc`; all 10 Python blocks run (Flask test client, Quart test client, fakeredis, flask-sock/Flask-SocketIO installed in the scratch venv); figures: 2 Mermaid (streaming sequence, SSE fan-out); detect-secrets clean.
- [x] Task 44. Create `backend/flask/testing.adoc` ("Testing") ★.
  - [x] Task 44.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 44.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 44.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 44.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/testing.adoc` and `images/flask-test-pyramid.svg` (plus a Mermaid fixture graph); all 53 pytest tests of the extracted Bookshelf project, the unittest example and 2 standalone snippets ran green on Flask 3.1.3 / Python 3.13; detect-secrets clean.
- [x] Task 45. Create `backend/flask/api-contract-and-property-based-testing.adoc` ("API Contract & Property-based Testing").
  - [x] Task 45.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 45.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 45.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 45.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `pages/backend/flask/api-contract-and-property-based-testing.adoc` and `images/flask-api-test-strategy.svg`; plus a Mermaid flowchart. All 12 python blocks ran via run_page.py; pytest/Schemathesis CLI/Hypothesis runs verified (draft fails as documented, fixed version passes).
- [x] Task 46. Create `backend/flask/debugging-logging-and-profiling.adoc` ("Debugging, Logging & Profiling") ★.
  - [x] Task 46.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 46.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 46.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 46.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/debugging-logging-and-profiling.adoc` (one Mermaid figure of the logging pipeline, no new SVG); all 15 runnable examples executed OK in venv-flask (sentry-sdk, flask-debugtoolbar, py-spy installed there); detect-secrets reports nothing.

### Group 10 — Flask production and beyond pages

**Parallelizable: yes (five independent pages)**

- [x] Task 47. Create `backend/flask/deployment-wsgi-servers-and-proxies.adoc` ("Deployment: WSGI Servers & Proxies") ★.
  - [x] Task 47.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 47.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 47.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 47.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/deployment-wsgi-servers-and-proxies.adoc` and `images/flask-production-topology.svg`; all 21 Python blocks ran (Gunicorn, Waitress, uWSGI, Supervisor, Hypercorn, Uvicorn and Tornado started for real; run in a Group 1 superset venv); Apache config verified on httpd 2.4.67, nginx and systemd not run.
- [x] Task 48. Create `backend/flask/docker-and-kubernetes.adoc` ("Docker & Kubernetes").
  - [x] Task 48.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 48.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 48.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 48.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `backend/flask/docker-and-kubernetes.adoc` and `images/flask-container-deployment.svg` (plus one Mermaid CI/CD diagram). All 6 Python blocks executed; both Dockerfiles built, images run and stopped, Compose stack brought up (Docker 29.8.2); Kubernetes manifests validated with kubeconform 1.34, workflows with actionlint; detect-secrets clean.
- [x] Task 49. Create `backend/flask/cloud-platforms-and-monitoring.adoc` ("Cloud Platforms & Monitoring").
  - [x] Task 49.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 49.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 49.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 49.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `modules/ROOT/pages/backend/flask/cloud-platforms-and-monitoring.adoc` (no SVGs; two Mermaid figures: platform request path, observability signals). All 11 Python blocks executed OK (1 `# norun`: PythonAnywhere WSGI file with placeholder path); config/shell blocks checked against vendor docs. detect-secrets: no results.
- [x] Task 50. Create `backend/flask/integrating-llm-apis.adoc` ("Integrating LLM APIs").
  - [x] Task 50.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 50.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 50.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 50.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `modules/ROOT/pages/backend/flask/integrating-llm-apis.adoc` (no SVGs); 12 Python blocks run clean in the Group 1 venv (OpenAI SDK 3.26.0 installed there, real client against a loopback stand-in provider); 2 Mermaid diagrams validated; detect-secrets clean.
- [x] Task 51. Create `backend/flask/whats-changed-and-migration.adoc` ("What's Changed & Migration") ★.
  - [x] Task 51.1. Re-read this page's bullets in Part 1 § 3 (Flask comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 51.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `flask-*.svg` and referenced from the page).
  - [x] Task 51.3. Run every example in the Group 1 venv and fix failures before finishing.
  - [x] Task 51.4. Address every Part 1 § 1 book row assigned to this page and every Part 1 § 2 outdated item that touches it, in prose.
  - Note: created `modules/ROOT/pages/backend/flask/whats-changed-and-migration.adoc` (release tables 2.0-3.2 unreleased, Werkzeug table, 'code you will meet' tables for every Part 1 § 2 item, upgrade checklist, 3.2 section, Flask to Quart/FastAPI); 19 Python examples run (18 in the Flask venv, the FastAPI one in a scratch venv with fastapi/a2wsgi); one Mermaid upgrade-path figure; detect-secrets clean.

### Group 11 — Tornado foundations pages

**Parallelizable: yes (five independent pages)**

- [x] Task 52. Create `backend/tornado/introduction-and-architecture.adoc` ("Introduction & Architecture").
  - [x] Task 52.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 52.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 52.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/introduction-and-architecture.adoc` (7 examples run OK, 1 fork example marked `# norun`) and `images/tornado-layer-stack.svg`.
- [x] Task 53. Create `backend/tornado/getting-started.adoc` ("Getting Started") ★.
  - [x] Task 53.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 53.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 53.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/getting-started.adoc`; 7 runnable examples executed OK (3 server listings verified with real loopback runs and curl); 2 Mermaid figures (dev loop, startup sequence), no SVG.
- [x] Task 54. Create `backend/tornado/asynchronous-io-and-the-event-loop.adoc` ("Asynchronous I/O & the Event Loop") ★.
  - [x] Task 54.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 54.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 54.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page and `images/tornado-blocked-vs-offloaded-handler.svg` created; all runnable examples executed in venv-tornado (the `ProcessPoolExecutor` and `fork_processes` blocks are `# norun`; the pool block was verified separately as a script).
- [x] Task 55. Create `backend/tornado/coroutines-and-asyncio.adoc` ("Coroutines & asyncio") ★.
  - [x] Task 55.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 55.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 55.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/coroutines-and-asyncio.adoc` (18 examples, all run via run_page.py in venv-tornado, Tornado 6.5.10) and `images/tornado-coroutine-concurrency.svg`; detect-secrets clean.
- [x] Task 56. Create `backend/tornado/queues-and-locks.adoc` ("Queues & Locks").
  - [x] Task 56.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 56.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 56.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/tornado/queues-and-locks.adoc`; 11 examples run OK in venv-tornado; figure is a Mermaid diagram (no SVG).

### Group 12 — Tornado web framework pages

**Parallelizable: yes (six independent pages)**

- [x] Task 57. Create `backend/tornado/applications-and-request-handlers.adoc` ("Applications & Request Handlers") ★.
  - [x] Task 57.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 57.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 57.3. Run every example in the Group 1 venv and fix failures before finishing.
    - Note: created `backend/tornado/applications-and-request-handlers.adoc`; 17 python blocks run OK (1 `# norun` main()); figure: Mermaid handler-lifecycle sequence; detect-secrets clean.
- [x] Task 58. Create `backend/tornado/routing.adoc` ("Routing") ★.
  - [x] Task 58.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 58.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 58.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/tornado/routing.adoc` (15 python examples run OK, incl. AsyncHTTPTestCase); figure `tornado-routing-dispatch.svg`; detect-secrets clean.
- [x] Task 59. Create `backend/tornado/error-handling.adoc` ("Error Handling").
  - [x] Task 59.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 59.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 59.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/error-handling.adoc` and `images/tornado-error-flow.svg`; all 10 Python examples run (loopback servers and AsyncHTTPTestCase), 0 failures.
- [x] Task 60. Create `backend/tornado/templates-and-ui-modules.adoc` ("Templates & UI Modules") ★.
  - [x] Task 60.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 60.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 60.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/templates-and-ui-modules.adoc`; 12 examples run OK (loopback servers + AsyncHTTPTestCase; Jinja installed in venv-tornado); one Mermaid figure (render pipeline), no SVG (outline marks none).
- [x] Task 61. Create `backend/tornado/static-files.adoc` ("Static Files").
  - [x] Task 61.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 61.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 61.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/static-files.adoc`; 14 Python blocks run clean (run_page.py, venv-tornado, real loopback servers + AsyncHTTPTestCase); one Mermaid figure (no SVG); detect-secrets clean.
- [x] Task 62. Create `backend/tornado/localization.adoc` ("Localization").
  - [x] Task 62.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 62.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 62.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/localization.adoc`; no SVG outlined (one Mermaid locale-resolution flowchart); 5 Python examples run OK, 1 startup snippet marked norun; detect-secrets clean.

### Group 13 — Tornado security, clients, real-time and networking pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 63. Create `backend/tornado/authentication-and-signed-cookies.adoc` ("Authentication & Signed Cookies") ★.
  - [x] Task 63.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 63.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 63.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page `backend/tornado/authentication-and-signed-cookies.adoc` written; 11 Python examples all executed (shared namespace, loopback servers + AsyncHTTPTestCase); figure = inline Mermaid sequence (no SVG); detect-secrets clean.
- [x] Task 64. Create `backend/tornado/xsrf-and-cross-origin-protection.adoc` ("XSRF & Cross-Origin Protection").
  - [x] Task 64.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 64.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 64.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page created with 11 executed examples (all pass on Tornado 6.5.10; the 6.6 `cross_origin_protection` example is `# norun`, as 6.6 is unreleased) and 2 Mermaid figures (XSRF token sequence, 6.6 decision flowchart); no SVG. detect-secrets clean.
- [x] Task 65. Create `backend/tornado/third-party-authentication.adoc` ("Third-party Authentication").
  - [x] Task 65.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 65.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 65.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/tornado/third-party-authentication.adoc`; all 8 Python examples run (fake local IdP); one Mermaid sequence figure; no SVG needed; detect-secrets clean.
- [x] Task 66. Create `backend/tornado/async-http-client.adoc` ("Async HTTP Client") ★.
  - [x] Task 66.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 66.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 66.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/async-http-client.adoc` and `images/tornado-async-http-client.svg`; all 14 runnable examples executed (2 marked norun: pycurl proxy, httpx); detect-secrets clean.
- [x] Task 67. Create `backend/tornado/websockets.adoc` ("WebSockets") ★.
  - [x] Task 67.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 67.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 67.3. Run every example in the Group 1 venv and fix failures before finishing.
    - Note: created `backend/tornado/websockets.adoc` (no SVGs; two Mermaid figures: room fan-out sequence, cross-process Redis flow); all 12 runnable examples pass in venv-tornado (2 `# norun`: Tornado 6.6 `trusted_origins`, real Redis adapter); detect-secrets clean.
- [x] Task 68. Create `backend/tornado/streaming-long-polling-and-sse.adoc` ("Streaming, Long Polling & SSE").
  - [x] Task 68.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 68.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 68.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/tornado/streaming-long-polling-and-sse.adoc`; 6 Python examples run OK; figure is a Mermaid sequence diagram (long polling vs SSE vs WebSocket), no SVG.
- [x] Task 69. Create `backend/tornado/tcp-servers-iostream-and-low-level-networking.adoc` ("TCP Servers, IOStream & Low-level Networking").
  - [x] Task 69.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 69.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 69.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page created with 11 runnable examples (all run OK in venv-tornado); figure `tornado-tcp-accept-flow.svg`; detect-secrets clean.

### Group 14 — Tornado data, configuration, testing and production pages

**Parallelizable: yes (six independent pages)**

- [x] Task 70. Create `backend/tornado/databases-and-async-drivers.adoc` ("Databases & Async Drivers").
  - [x] Task 70.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 70.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 70.3. Run every example in the Group 1 venv and fix failures before finishing.
  Note: created `backend/tornado/databases-and-async-drivers.adoc` and `images/tornado-blocking-vs-async-driver.svg`; 12 examples run OK in venv-tornado (SQLAlchemy 2.1.3/aiosqlite, redis+fakeredis, PyMongo AsyncMongoClient error path, executor, AsyncHTTPTestCase), 2 norun (asyncpg, fork_processes); detect-secrets clean.
- [x] Task 71. Create `backend/tornado/options-configuration-and-logging.adoc` ("Options, Configuration & Logging").
  - [x] Task 71.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 71.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 71.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created pages/backend/tornado/options-configuration-and-logging.adoc (15 examples run OK, one Mermaid figure, detect-secrets clean).
- [x] Task 72. Create `backend/tornado/testing.adoc` ("Testing") ★.
  - [x] Task 72.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 72.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 72.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `modules/ROOT/pages/backend/tornado/testing.adoc` and `modules/ROOT/images/tornado-test-harness.svg`; all 15 runnable examples executed (pytest and pytest-asyncio file verified separately); detect-secrets clean.
- [x] Task 73. Create `backend/tornado/running-and-deploying.adoc` ("Running & Deploying") ★.
  - [x] Task 73.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 73.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 73.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `running-and-deploying.adoc` and `tornado-production-topology.svg`; all 10 Python examples ran (subprocess servers on loopback); nginx/systemd/Supervisor/Docker/Kubernetes files shown as config, not executed.
- [x] Task 74. Create `backend/tornado/wsgi-interoperability.adoc` ("WSGI Interoperability").
  - [x] Task 74.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 74.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 74.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: wsgi-interoperability.adoc written; 10 examples run OK in venv-tornado (Flask, Pyramid, Werkzeug added to it); figure tornado-wsgi-container-flow.svg; detect-secrets clean.
- [x] Task 75. Create `backend/tornado/whats-changed-and-migration.adoc` ("What's Changed & Migration") ★.
  - [x] Task 75.1. Re-read this page's bullets in Part 2 A.3 (Tornado, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 75.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `tornado-*.svg` and referenced from the page).
  - [x] Task 75.3. Run every example in the Group 1 venv and fix failures before finishing.

### Group 15 — Pyramid foundations pages

**Parallelizable: yes (five independent pages)**

- [x] Task 76. Create `backend/pyramid/introduction-and-architecture.adoc` ("Introduction & Architecture").
  - [x] Task 76.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 76.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 76.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/introduction-and-architecture.adoc` and `images/pyramid-request-pipeline.svg` (plus one Mermaid lineage diagram); all 9 Python examples run with webtest (Pyramid 2.1, Python 3.13).
- [x] Task 77. Create `backend/pyramid/getting-started.adoc` ("Getting Started") ★.
  - [x] Task 77.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 77.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 77.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/getting-started.adoc` (no SVG; one Mermaid request sequence diagram). Runnable examples executed with venv-pyramid and WebTest; `# norun` blocks verified from extracted files and a live Waitress server with curl. Finding: Pyramid 2.1 still imports `pkg_resources` (requires `setuptools<82`, emits a UserWarning), unlike the issue's removal note.
- [x] Task 78. Create `backend/pyramid/cookiecutter-projects-and-pserve.adoc` ("Cookiecutter Projects & pserve") ★.
  - [x] Task 78.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 78.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 78.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/cookiecutter-projects-and-pserve.adoc`; 5 `[source,python]` blocks run OK (venv-pyramid, project from 2.1-branch at `$S/cc/bookshelf_shelves`, pserve/--reload/-b/wsgiref checked live); file listings are `[source,py]` verbatim copies; two Mermaid figures (cookiecutter flow, pserve startup chain), no SVG.
- [x] Task 79. Create `backend/pyramid/configuration-and-the-configurator.adoc` ("Configuration & the Configurator") ★.
  - [x] Task 79.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 79.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 79.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/pyramid/configuration-and-the-configurator.adoc` (14 examples run with webtest, 0 failures); figure `pyramid-two-phase-configuration.svg` plus one Mermaid include tree; detect-secrets clean.
- [x] Task 80. Create `backend/pyramid/settings-environment-and-ini-files.adoc` ("Settings, Environment & .ini Files").
  - [x] Task 80.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 80.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 80.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/settings-environment-and-ini-files.adoc`; all 10 Python blocks ran (webtest/pyramid.paster, venv-pyramid); no figure marked for this page (one Mermaid flowchart included); detect-secrets clean.

### Group 16 — Pyramid routing and views pages

**Parallelizable: yes (eight independent pages)**

- [x] Task 81. Create `backend/pyramid/url-dispatch.adoc` ("URL Dispatch") ★.
  - [x] Task 81.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 81.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 81.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/pyramid/url-dispatch.adoc` (14 examples run on Pyramid 2.1 with webtest, 0 failures, 1 `# norun` decorator snippet); figure: Mermaid route-matching flowchart (no SVG; the outline marks no figure for this page); `proutes` output from a real run. Findings: `not_()` fails with `TypeError` in `add_route` (2.1) although the API page says `accept` supports it; duplicate route names raise `ConfigurationConflictError`; `_query` `None` renders `p=`.
- [x] Task 82. Create `backend/pyramid/traversal-and-resources.adoc` ("Traversal & Resources") ★.
  - [x] Task 82.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 82.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 82.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/pyramid/traversal-and-resources.adoc`; 13 examples run OK (webtest); figure: Mermaid flowchart of `/shelves/ada/dune/edit` traversal (no SVG).
- [x] Task 83. Create `backend/pyramid/views-and-view-configuration.adoc` ("Views & View Configuration") ★.
  - [x] Task 83.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 83.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 83.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: `backend/pyramid/views-and-view-configuration.adoc`; 12 Python examples run (WebTest, `shelfapp` package scratch-only), 2 file listings; Mermaid view-lookup figure; detect-secrets clean.
- [x] Task 84. Create `backend/pyramid/errors-and-exception-views.adoc` ("Errors & Exception Views") ★.
  - [x] Task 84.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 84.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 84.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Done: pages/backend/pyramid/errors-and-exception-views.adoc; figure images/pyramid-exception-view-flow.svg; 12 python blocks run with webtest (1 decorator block marked norun, verified from a real module); detect-secrets clean.
- [x] Task 85. Create `backend/pyramid/renderers-and-json.adoc` ("Renderers & JSON") ★.
  - Done: pages/backend/pyramid/renderers-and-json.adoc; figure images/pyramid-renderer-flow.svg; 16 examples run via webtest, all passed.
  - [x] Task 85.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 85.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 85.3. Run every example in the Group 1 venv and fix failures before finishing.
- [x] Task 86. Create `backend/pyramid/templates.adoc` ("Templates").
  - [x] Task 86.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 86.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 86.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/templates.adoc`; all 14 Python examples ran (webtest, pyramid_jinja2 2.10.1, pyramid_chameleon 0.3, pyramid_mako 1.1.0); figure: one Mermaid flowchart (no SVG); detect-secrets clean.
- [x] Task 87. Create `backend/pyramid/request-and-response.adoc` ("Request & Response") ★.
  - [x] Task 87.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 87.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 87.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page created (19 examples, all run OK with webtest.TestApp on Pyramid 2.1, WebOb 1.8.11, Python 3.13); figure `pyramid-request-response-lifecycle.svg` plus one Mermaid diagram; detect-secrets clean.
- [x] Task 88. Create `backend/pyramid/static-assets.adoc` ("Static Assets").
  - [x] Task 88.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 88.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 88.3. Run every example in the Group 1 venv and fix failures before finishing.
    - Note: created `backend/pyramid/static-assets.adoc`; 14 Python blocks ran OK (webtest/webob); one Mermaid figure (no SVG, outline marks none); detect-secrets clean.

### Group 17 — Pyramid state, security and data pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 89. Create `backend/pyramid/sessions-and-flash-messages.adoc` ("Sessions & Flash Messages").
  - [x] Task 89.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 89.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 89.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/sessions-and-flash-messages.adoc`; all 12 Python blocks ran (webtest, venv-pyramid, pyramid_nacl_session installed there), 0 failures; figures: two Mermaid diagrams (session cookie life cycle, flash post/redirect/get), no SVG (none marked for this page).
- [x] Task 90. Create `backend/pyramid/forms-with-deform-and-colander.adoc` ("Forms with Deform & Colander").
  - [x] Task 90.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 90.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 90.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/forms-with-deform-and-colander.adoc` and `images/pyramid-deform-colander-structures.svg` (referenced); all 18 Python blocks ran OK with webtest.TestApp (Pyramid 2.1, Deform 3.0.1, Colander 2.0, pyramid_jinja2, WTForms 3.2.2 and Pydantic 2.13.5 installed in venv-pyramid); detect-secrets clean.
- [x] Task 91. Create `backend/pyramid/security-policy-and-authentication.adoc` ("Security Policy & Authentication") ★.
  - [x] Task 91.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 91.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 91.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page created (no SVG); figure = Mermaid sequence (login, remember, policy, view); all 11 python blocks run OK with webtest in venv-pyramid (argon2-cffi, bcrypt installed there); detect-secrets clean.
- [x] Task 92. Create `backend/pyramid/authorization-acls-and-permissions.adoc` ("Authorization, ACLs & Permissions") ★.
  - [x] Task 92.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 92.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 92.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/authorization-acls-and-permissions.adoc` and `images/pyramid-acl-inheritance.svg` (plus one Mermaid permission-check flowchart); all 17 runnable Python blocks executed OK with run_page.py (Pyramid 2.1, webtest; 1 decorator block marked `# norun`); detect-secrets clean. Found: add_forbidden_view/add_notfound_view/add_exception_view reject a `permission` argument and add_static_view ignores the default permission.
- [x] Task 93. Create `backend/pyramid/csrf-protection.adoc` ("CSRF Protection").
  - [x] Task 93.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 93.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 93.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `modules/ROOT/pages/backend/pyramid/csrf-protection.adoc`; 11 examples run with webtest (all pass); figure: one Mermaid flowchart (CSRF view deriver decision), no SVG.
- [x] Task 94. Create `backend/pyramid/sqlalchemy-transactions-and-migrations.adoc` ("SQLAlchemy, Transactions & Migrations") ★.
  - [x] Task 94.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 94.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 94.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `modules/ROOT/pages/backend/pyramid/sqlalchemy-transactions-and-migrations.adoc`; 13 examples run with webtest on SQLAlchemy 2.0.54 and 2.1.3 (all pass), 5 blocks `# norun` (project files, PostgreSQL savepoint shape) verified in a generated cookiecutter sqlalchemy project (alembic revision/upgrade/check/--sql, initialize script, pytest 6 passed); figures: two Mermaid diagrams (transaction lifecycle sequence, commit/abort decision flowchart), no SVG; detect-secrets clean.
- [x] Task 95. Create `backend/pyramid/zodb-and-other-data-stores.adoc` ("ZODB & Other Data Stores").
  - [x] Task 95.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 95.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 95.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/zodb-and-other-data-stores.adoc`; all 14 Python examples run (ZODB, pyramid_zodbconn, pyramid_tm, pyramid_retry, fakeredis, mongomock); one Mermaid sequence figure, no SVG; detect-secrets clean.

### Group 18 — Pyramid extending, tooling, testing and production pages

**Parallelizable: yes (nine independent pages)**

- [x] Task 96. Create `backend/pyramid/events-tweens-and-hooks.adoc` ("Events, Tweens & Hooks") ★.
  - [x] Task 96.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 96.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 96.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page verified; 22 examples run, 0 failed; Mermaid figure (tweens/events/derivers flow) inline; detect-secrets clean; no new SVGs.
- [x] Task 97. Create `backend/pyramid/extending-and-add-ons.adoc` ("Extending & Add-ons").
  - [x] Task 97.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 97.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 97.3. Run every example in the Group 1 venv and fix failures before finishing.
- [x] Task 98. Create `backend/pyramid/internationalization.adoc` ("Internationalization").
  - [x] Task 98.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 98.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 98.3. Run every example in the Group 1 venv and fix failures before finishing.
  Note: created `backend/pyramid/internationalization.adoc`; all 14 Python blocks executed (0 failed); one SVG figure `pyramid-i18n-catalog-lifecycle.svg`; detect-secrets clean.
- [x] Task 99. Create `backend/pyramid/command-line-and-p-scripts.adoc` ("Command Line & p-scripts").
  - [x] Task 99.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 99.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 99.3. Run every example in the Group 1 venv and fix failures before finishing.
  Note: created `backend/pyramid/command-line-and-p-scripts.adoc`; all 7 Python blocks executed (8 file-listing blocks marked `# norun`, verified by running the real project), CLI outputs produced against a scratch project; one Mermaid figure, no SVG; detect-secrets clean.
- [x] Task 100. Create `backend/pyramid/logging-and-debug-toolbar.adoc` ("Logging & Debug Toolbar").
  - [x] Task 100.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 100.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 100.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/logging-and-debug-toolbar.adoc` (no SVG; one Mermaid figure, none was marked in the outline). All 14 Python examples ran with webtest.TestApp in the Pyramid venv (extra packages installed in the scratchpad venv only: pyramid_exclog, Paste, sentry-sdk, opentelemetry); detect-secrets clean.
- [x] Task 101. Create `backend/pyramid/testing.adoc` ("Testing") ★.
  - [x] Task 101.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 101.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 101.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: testing.adoc (about 1320 lines) done; no figure marked in outline; 5 standalone blocks run plus the 10 project files (marked norun) verified identical to the pytest project in scratch, 20 tests pass; detect-secrets clean.
- [x] Task 102. Create `backend/pyramid/deployment.adoc` ("Deployment") ★.
  - [x] Task 102.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 102.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 102.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/deployment.adoc` (about 1400 lines) and `images/pyramid-production-topology.svg`; 13 Python blocks run OK (venv-pyramid; Waitress, Gunicorn, uWSGI, Uvicorn started for real); nginx.conf checked with `nginx -t`, Dockerfile built and run behind nginx; mod_wsgi, systemd and K8s apply not run (no host support), nav entry left to Group 20 (no nav-pyramid yet)
- [x] Task 103. Create `backend/pyramid/advanced-topics.adoc` ("Advanced Topics").
  - [x] Task 103.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 103.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 103.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: created `backend/pyramid/advanced-topics.adoc`; all 15 examples run OK (venv-pyramid, zope.component 7.1 installed there); figure: Mermaid subrequest flow (no SVG, outline marks none); detect-secrets clean.
- [x] Task 104. Create `backend/pyramid/whats-changed-and-migration.adoc` ("What's Changed & Migration") ★.
  - [x] Task 104.1. Re-read this page's bullets in Part 2 B.3 (Pyramid, Part 2 comment) and cover every one (options, pitfalls, examples with `Source:` links, `== References`).
  - [x] Task 104.2. Deliver the 📊 figure(s) the outline marks for this page, if any (Mermaid, or an original SVG named `pyramid-*.svg` and referenced from the page).
  - [x] Task 104.3. Run every example in the Group 1 venv and fix failures before finishing.
  - Note: page created; 9 python blocks run OK in venv-pyramid; no SVG (outline marks none), one Mermaid upgrade-path flowchart; detect-secrets clean.

### Group 19 — Landing pages, cheat sheets and PDFs

**Parallelizable: yes (each task edits distinct files; references only Groups 1–17)**

- [x] Task 105. Create `backend/flask/index.adoc` ("Python Flask").
  - [x] Task 105.1. Follow `backend/fastapi/index.adoc`: what it is and who it is for, the version baseline in prose, the Flask scenario *Bookshelf*, the four books table (title, edition, ISBN, publisher page, companion repo), the Pallets libraries, every extension and specification used (Part 1 § 4).
  - [x] Task 105.2. A reading path, `== What's covered` grouped as the outline groups the pages, a "where related material lives elsewhere on this site" table, and the 📊 architecture SVG plus Mermaid mind-map.
  - [x] Task 105.3. `== Bibliography` listing **every** source used, each linked to its official website, grouped like the FastAPI one (Books only for Flask).
  - [x] Task 105.4. Verify every page of the section is listed in `== What's covered`, and every link in the bibliography resolves (HTTP 200).
  - Note: created `modules/ROOT/pages/backend/flask/index.adoc` and `modules/ROOT/images/flask-architecture.svg` (theme-neutral, one-line `image::`, quoted alt). Bibliography is generated from every URL in the 46 pages' `== References` (535 unique, grouped: Books, official docs by section, Pallets, extensions, libraries, infrastructure, Python, specs, OWASP); all 46 pages are in `== What's covered`. 531 URLs return 200 and 3 Packt URLs return 403 to bots; 5 dead URLs in other pages were replaced in the bibliography by live pages of the same project (see report).
- [x] Task 106. Create `backend/flask/cheat-sheet.adoc` ("Flask Cheat Sheet").
  - [x] Task 106.1. Model it on `backend/fastapi/cheat-sheet.adoc`: description, per-group links to the section's pages, `xref:attachment$flask-cheat-sheet.pdf[Download the Flask Cheat Sheet (PDF)]`, `== References`.
  - [x] Task 106.2. Include the disclaimer partial.
  - Note: created `modules/ROOT/pages/backend/flask/cheat-sheet.adoc` (disclaimer, per-group xrefs to all 46 pages, PDF link, `== References`).
- [x] Task 107. Produce `modules/ROOT/attachments/flask-cheat-sheet.pdf`.
  - [x] Task 107.1. Render a throwaway HTML page with headless Chrome print-to-PDF: one A4 page, dense, multi-column, colour-coded, legible when printed.
  - [x] Task 107.2. Cover every minimum-content item listed for this framework under "Cheat sheets" in the issue body, including the "changed since older tutorials / books" strip with versions.
  - [x] Task 107.3. Verify with `pdfinfo` that it is exactly one page and visually inspect it (no clipped text).
  - Note: created `modules/ROOT/attachments/flask-cheat-sheet.pdf` (A4, 1 page, 3 columns, 23 colour-coded boxes + "changed since older tutorials and books" strip with versions); throwaway HTML and PNGs stay in the scratchpad.
- [x] Task 108. Create `backend/tornado/index.adoc` ("Python Tornado").
  - [x] Task 108.1. Follow `backend/fastapi/index.adoc`: what it is and who it is for, the version baseline in prose, the *Bookshelf Live* scenario, the official docs groups, libraries and specifications (Part 2 A.4).
  - [x] Task 108.2. A reading path, `== What's covered` grouped as the outline groups the pages, a "where related material lives elsewhere on this site" table, and the 📊 architecture SVG plus Mermaid mind-map.
  - [x] Task 108.3. `== Bibliography` listing **every** source used, each linked to its official website, grouped like the FastAPI one (Books only for Flask).
  - [x] Task 108.4. Verify every page of the section is listed in `== What's covered`, and every link in the bibliography resolves (HTTP 200).
  - Note: created `modules/ROOT/pages/backend/tornado/index.adoc` and `modules/ROOT/images/tornado-architecture.svg` (theme-neutral). All 24 section pages are listed in `== What's covered`; every xref target exists; 124 of 125 bibliography URLs return 200 (`freedesktop.org` systemd.service returns 418 to bots only). Fixed the 404 Authlib URL in `index.adoc` and `third-party-authentication.adoc`.
- [x] Task 109. Create `backend/tornado/cheat-sheet.adoc` ("Tornado Cheat Sheet").
  - [x] Task 109.1. Model it on `backend/fastapi/cheat-sheet.adoc`: description, per-group links to the section's pages, `xref:attachment$tornado-cheat-sheet.pdf[Download the Tornado Cheat Sheet (PDF)]`, `== References`.
  - [x] Task 109.2. Include the disclaimer partial.
  - Note: created `modules/ROOT/pages/backend/tornado/cheat-sheet.adoc` (all 24 pages linked per group, PDF xref, `== References`, disclaimer partial).
- [x] Task 110. Produce `modules/ROOT/attachments/tornado-cheat-sheet.pdf`.
  - [x] Task 110.1. Render a throwaway HTML page with headless Chrome print-to-PDF: one A4 page, dense, multi-column, colour-coded, legible when printed.
  - [x] Task 110.2. Cover every minimum-content item listed for this framework under "Cheat sheets" in the issue body, including the "changed since older tutorials / books" strip with versions.
  - [x] Task 110.3. Verify with `pdfinfo` that it is exactly one page and visually inspect it (no clipped text).
  - Note: created `modules/ROOT/attachments/tornado-cheat-sheet.pdf` (one A4 page, `pdfinfo` Pages: 1, 22 colour-coded cards plus the legacy-to-current table and the changed-since strip; checked as PNG); throwaway HTML and generator kept in the scratchpad.
- [x] Task 111. Create `backend/pyramid/index.adoc` ("Python Pyramid").
  - [x] Task 111.1. Follow `backend/fastapi/index.adoc`: what it is and who it is for, the version baseline in prose, the *Bookshelf Shelves* scenario, the official docs groups, the Pylons add-ons / Community Cookbook (watch the underscore/hyphen URL quirk), libraries and specifications (Part 2 B.4).
  - [x] Task 111.2. A reading path, `== What's covered` grouped as the outline groups the pages, a "where related material lives elsewhere on this site" table, and the 📊 architecture SVG plus Mermaid mind-map.
  - [x] Task 111.3. `== Bibliography` listing **every** source used, each linked to its official website, grouped like the FastAPI one (Books only for Flask).
  - [x] Task 111.4. Verify every page of the section is listed in `== What's covered`, and every link in the bibliography resolves (HTTP 200).
    - Done: `modules/ROOT/pages/backend/pyramid/index.adoc` (all 29 section pages + cheat sheet in What's covered, every xref target exists, `== Bibliography` is the final section; 104 bibliography URLs checked, all 200) and `modules/ROOT/images/pyramid-architecture.svg` (theme-neutral, referenced once).
- [x] Task 112. Create `backend/pyramid/cheat-sheet.adoc` ("Pyramid Cheat Sheet").
  - [x] Task 112.1. Model it on `backend/fastapi/cheat-sheet.adoc`: description, per-group links to the section's pages, `xref:attachment$pyramid-cheat-sheet.pdf[Download the Pyramid Cheat Sheet (PDF)]`, `== References`.
  - [x] Task 112.2. Include the disclaimer partial.
    - Done: `modules/ROOT/pages/backend/pyramid/cheat-sheet.adoc` (disclaimer, per-group links, PDF link, `== References`).
- [x] Task 113. Produce `modules/ROOT/attachments/pyramid-cheat-sheet.pdf`.
  - [x] Task 113.1. Render a throwaway HTML page with headless Chrome print-to-PDF: one A4 page, dense, multi-column, colour-coded, legible when printed.
  - [x] Task 113.2. Cover every minimum-content item listed for this framework under "Cheat sheets" in the issue body, including the "changed since older tutorials / books" strip with versions.
  - [x] Task 113.3. Verify with `pdfinfo` that it is exactly one page and visually inspect it (no clipped text).
    - Done: `modules/ROOT/attachments/pyramid-cheat-sheet.pdf` (one A4 page, 3 columns, 22 colour-coded boxes plus a "changed since older tutorials" strip; source HTML kept in the scratchpad, not in the repo; checked with `pdfinfo` and rendered PNGs).

### Group 20 — Navigation, listings and back-links

**Parallelizable: yes (every task edits a distinct file)**

- [x] Task 114. Edit `modules/ROOT/nav.adoc`. — 105 nav lines added (Flask 48 / Tornado 26 / Pyramid 31 entries = files per folder; index as `***` parent like FastAPI); additions only.
  - [x] Task 114.1. After `**** xref:backend/fastapi/cheat-sheet.adoc[Cheat Sheet (PDF)]` and before `include::partial$nav-typescript.adoc[]`, add `*** xref:backend/flask/index.adoc[Python Flask]`, then `*** xref:backend/tornado/index.adoc[Python Tornado]`, then `*** xref:backend/pyramid/index.adoc[Python Pyramid]`.
  - [x] Task 114.2. List every page of each outline as `****` children in outline order, ending with `**** xref:backend/<fw>/cheat-sheet.adoc[Cheat Sheet (PDF)]`; nav labels identical to each page's `= Title`.
  - [x] Task 114.3. Check the three blocks sit at the same depth as the FastAPI block and that nothing else moved.
- [x] Task 115. Edit `modules/ROOT/pages/backend/index.adoc`. — three bullets after FastAPI; description/keywords extended.
  - [x] Task 115.1. Add three bullets after the Python FastAPI bullet (Python Flask, Python Tornado, Python Pyramid), each ending "plus a downloadable cheat sheet".
  - [x] Task 115.2. Extend `:description:` and `:keywords:` with the keyword list in the issue body.
- [x] Task 116. Edit root `modules/ROOT/pages/index.adoc`: mention Flask, Tornado and Pyramid in `:description:` and add `Flask, Tornado, Pyramid, WSGI` to `:keywords:`. — done (only WSGI was new in keywords).
- [x] Task 117. Add back-links in existing pages (one line each, real `xref:`s). — python index, FastAPI intro (Flask row + Quart `#quart`), FastAPI sub-applications WSGI section, Django intro (#242 sentence + Flask row), starting-a-new-project (new Python / Flask, Tornado or Pyramid row).
  - [x] Task 117.1. `programming-languages/python/index.adoc`: add the three sections to "Where Python is used on this site".
  - [x] Task 117.2. `backend/fastapi/introduction-and-architecture.adoc`: link the Flask and Quart rows to the Flask section.
  - [x] Task 117.3. `backend/fastapi/sub-applications-wsgi-and-graphql.adoc`: link the Flask-mounting section to the Flask section.
  - [x] Task 117.4. `web/django/introduction-and-architecture.adoc`: replace the sentence saying the Flask section is "tracked in issue #242 and does not exist on this site yet" with links to the three new sections; link the Flask row of its comparison table.
  - [x] Task 117.5. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`: add a Python / Flask (and Tornado / Pyramid) pointer in the Python rows.
- [x] Task 118. Cross-link pass over the three sections. — ~250 Flask, ~90 Tornado, ~150 Pyramid prose references turned into xrefs; sibling links on the three intros; Flask migration page links FastAPI `#wsgi` and Quart; FOLLOWUPS 1-6 resolved (Tornado `multiple` wording, Pyramid deployment xref, upload limits, SECRET_KEY via secrets.token_hex(), dead links, inline-code passthroughs). Full build 0 errors/warnings, 1380 Mermaid diagrams parsed, image and inline-code greps empty, detect-secrets clean.
  - [x] Task 118.1. Replace prose forward-references to pages created in later groups with `xref:`s (verify each target exists).
  - [x] Task 118.2. Add sibling-section comparison links (Flask ↔ FastAPI ↔ Django ↔ Tornado ↔ Pyramid) on the three introduction pages.
  - [x] Task 118.3. Link the Flask migration page to the FastAPI WSGI-mounting page and the Quart / FastAPI notes.

### Group 21 — Build and verify

**Parallelizable: yes (single task, after the previous group)**

- [x] Task 119. Build and verify.
  - [x] Task 119.1. Run `npx antora antora-playbook.yml`; it must complete with no `xref`/AsciiDoc errors or warnings (compare with the Group 1 baseline) and the three sections must render in `build/site` with nav intact.
  - [x] Task 119.2. Run the `CLAUDE.md` image checks (`grep -rnE '^image::' modules | grep -vE '\]\s*$'`, the inline-macro check, `grep -rn '<p>image::' build/site --include='*.html'`) — all must print nothing; run the unquoted-comma alt-text check on every changed `.adoc`; check every SVG is referenced and every `image::` target exists.
  - [x] Task 119.3. Run the inline-code substitution grep on `build/site/backend/flask`, `build/site/backend/tornado` and `build/site/backend/pyramid` — must print nothing.
  - [x] Task 119.4. Run `npm run validate:mermaid` — every diagram must parse.
  - [x] Task 119.5. Admonition check: `grep -rnE '^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]|^(NOTE|TIP|WARNING|CAUTION|IMPORTANT):' modules/ROOT/pages/backend/{flask,tornado,pyramid}` must print nothing (the only admonitions live in the three partials).
  - [x] Task 119.6. Page-level checks: every page includes its disclaimer, has `== References`, and every page in the outlines exists (47 / 25 / 30 plus three cheat sheets); every code example is followed by a `Source:` link; no hardcoded secrets (`grep -rniE 'secret_key *= *["\x27][a-z]' …`).
  - [x] Task 119.7. Link check: every external URL in the three bibliographies and `== References` sections returns HTTP 200 (Packt URLs may return 403 to bots — list them separately).
  - [x] Task 119.8. Confirm the book PDFs are not in the working tree (`git status`) and no book text, listing or figure is reproduced.
  - [x] Task 119.9. Spot-check rendering of at least one ★ page per section in the Browser pane (figures, tables, code blocks, nav position after FastAPI).
  - Note: build exit 0 with an empty log (baseline also clean); image/inline-code/admonition greps print nothing (the only `image:` target hit is a pre-existing Apple URL, not a macro); no orphan SVG, no missing target; `validate:mermaid`: all 1380 diagrams parsed. Files per folder: Flask 48, Tornado 26, Pyramid 31 = outline count (47/25/30 incl. index) + cheat sheet, names identical to the outline; every page has the disclaimer and `== References` (index pages use `== Bibliography` per spec); no hardcoded secret keys. Added the missing `Source:` link after 12 example blocks in tornado/{testing,wsgi-interoperability,streaming-long-polling-and-sse}, pyramid/{advanced-topics (2),configuration-and-the-configurator,deployment,extending-and-add-ons,zodb-and-other-data-stores (2)}, flask/{database-migrations,api-contract-and-property-based-testing}; those pages re-ran clean (16 remaining blocks without a link are curl/CLI invocations or JSON outputs). Link check of 1168 URLs: 1147 × 200; 3 Packt 403 (bot block); freedesktop systemd.service 418 (bot block); 17 readthedocs-hosted Tornado/ZODB/zope URLs 429 (rate limit after the burst, not broken). No book files in `git status`; a 10-word shingle comparison with the four books matched only titles/subtitles, tool output, URLs and boilerplate. Headless-Chrome screenshots of flask/getting-started, tornado/asynchronous-io-and-the-event-loop and pyramid/authorization-acls-and-permissions: disclaimer, tables, code, SVG and Mermaid figures render; nav order FastAPI → Flask → Tornado → Pyramid.
- [x] Task 120. Ask the user to open the Packt and Manning publisher URLs from the Flask bibliography in a browser and report any that do not load; fix them if so. Done 2026-10-08: the user opened all three Packt URLs in a browser and each loads (Manning returned 200); every Flask `== References` link text and the bibliography now use the exact publisher titles and subtitles (88 link texts updated).
  - Resolved: the user confirmed in a browser that Packt 9781804611104, 9781789951295 and 9781803248448 load (403 only to curl); Manning microservice-apis returns 200.

## Verification summary (for the final report)

* Antora build: 0 errors / 0 warnings; `validate:mermaid` all diagrams parsed; image / inline-code / admonition greps clean.
* 102 content pages + 3 cheat sheets + 3 PDFs + 3 disclaimer partials exist and are in the nav in the specified order.
* Every example executed in the Group 1 venvs; failures fixed or the example removed.
* Open items to report honestly: unverified Packt URLs (if not browser-checked), Flask 3.2 / Tornado 6.6 release status at
  implementation time, any example that could not be run and why.
