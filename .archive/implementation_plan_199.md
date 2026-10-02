# Implementation Plan: Guides & References / Backend Development — "Python FastAPI"

## Task summary

Source: GitHub issue #199
Base branch: main

Issue [#199](https://github.com/albertoirurueta/docs/issues/199) adds a **Python FastAPI** section to Backend
Development at `modules/ROOT/pages/backend/fastapi/`: a practical, example-driven guide to FastAPI (on Starlette and
Pydantic v2), written from the **official documentation**, with the requester's O'Reilly book
(*FastAPI: Modern Python Web Development*, Lubanovic, 2023, `~/Desktop/fastapi.pdf`) as a consulted reference for
concept narrative and structure only. It also links the existing Python Reference from Backend Development.

The section ships:

* 38 files: `index.adoc` (with `== Bibliography`), 36 concept pages, `cheat-sheet.adoc`
* the one-page A4 PDF `modules/ROOT/attachments/fastapi-cheat-sheet.pdf`
* the partial `modules/ROOT/partials/fastapi-disclaimer.adoc` (the only admonition allowed in the section)
* original SVGs `modules/ROOT/images/fastapi-*.svg` and Mermaid diagrams (at least where the issue marks 📊)
* nav changes in `modules/ROOT/nav.adoc` (Python Reference include + FastAPI block), the `partials/nav-python.adoc`
  comment, `backend/index.adoc` bullets/description/keywords, root `index.adoc` description/keywords, and three
  back-links (`programming-languages/python/index.adoc`, `backend/graphql/python-getting-started.adoc`,
  `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`)

The issue body is the binding spec: its "Page outline", "New nav placement", "Cheat sheet", "Bibliography" and
"Acceptance criteria" sections. Every page task must re-read its page's bullets (`gh issue view 199`) and cover
**every** bullet.

**Out of scope:** re-documenting existing material (Python language, GraphQL, OAuth theory, Docker, engine
references — link instead); GraphQL/LangChain/Hugging Face depth (#198/#200 in prose only).

### Choices made on the user's behalf

1. **One pass, one PR.** The issue suggests optionally splitting into 3 PRs; this run implements everything on
   `feature/199` and opens a single draft PR to `main` with `Closes #199`.
2. **Tasks are untagged; no language/framework key applies.** Installed keys are `java`, `java-springboot`, `dotnet`
   and `database`; none fit AsciiDoc / Mermaid / SVG / PDF authoring, so tasks are implemented directly. Python code in
   pages is illustrative content, but every example must be executed (see "Lessons").
3. **The book appears only in `== Bibliography`** (full data, O'Reilly publisher page, companion repo). It is never
   copied, quoted or committed; where a page touches a book concept it says in prose where the book is outdated.
4. **Disclaimer:** `partials/fastapi-disclaimer.adoc` is a single `[IMPORTANT]` block (AI-assistance disclosure +
   `xref:backend/fastapi/index.adoc#_bibliography[…]`). No other admonition in the section; deprecations, version
   notes, security caveats and "book is outdated" remarks are prose or table rows.
5. **Version baseline re-verified at implementation time and dated** (Group 1). The issue's numbers (FastAPI 0.141.1,
   Pydantic 2.13, Starlette 1.7, Python 3.14) were checked 2026-09-27 and are re-verified, not copied.
6. **Running scenario is the original *Bookshelf API*** (books/authors/reviews, OAuth2/JWT users, cover uploads, SSE
   review feed, WebSocket chat per book, Jinja/SPA front end, PostgreSQL via SQLModel and SQLite for tests); pages build
   on each other.
7. **Existing pages get real `xref:`s; not-yet-existing ones stay plain prose.** Every `xref:` target is verified to
   exist before writing it (`ls`); #196, #198, #200, #162, #184 and AWS/GCP (#163/#164 if not present) are prose only.
8. **Figure floor:** every 📊 in the issue is delivered as Mermaid or `fastapi-*.svg`; more where they clarify. SVGs are
   original drawings (no FastAPI logo, docs images or book figures).

### Lessons from the earlier section reviews (#198 and siblings) — mandatory for every page task

**Verify every name against its official page before writing it** (every class, decorator, function, parameter,
CLI flag, env var, import path and version number); if the docs don't confirm a detail, describe the behaviour without
naming it. **Security is correctness:** no hardcoded secrets (JWT keys come from settings; `openssl rand -hex 32`),
destructive examples show auth. **Every concept gets at least one code example**, each followed by a `Source:` link,
and the URL goes in `== References`. **Run the examples** with `TestClient` in the Group 1 venv. **URL hygiene:**
canonical URLs only. **Cross-links accurate:** never `xref:` to a non-existent page; no `xref:` inside backticks; no
empty link text on a fragment xref. **AsciiDoc hygiene:** `.Title` captions; no leaked authoring notes; `{placeholders}`
literal inside `[source]` blocks and escaped in prose; no prose line starting with `<digits>.`.

## Current code state

* **Repo:** Antora root component `irurueta` (`antora.yml`); pages in `modules/ROOT/pages/`, nav in
  `modules/ROOT/nav.adoc`. No `backend/fastapi/` files, no FastAPI SVGs/PDF/partial exist.
* **`modules/ROOT/nav.adoc`:** line ~573 `include::partial$nav-python.adoc[]` (under Web Development), line ~32 (under
  Programming Languages); line ~574 `** xref:backend/index.adoc[Backend Development]` followed by
  `include::partial$nav-java.adoc[]` (~575) then `*** xref:backend/hibernate/index.adoc[Hibernate Reference]`.
* **`modules/ROOT/partials/nav-python.adoc`:** header comment names only two usage sites.
* **`modules/ROOT/pages/backend/index.adoc`:** `== Sections` bullet list (Java Reference first), long `:description:` /
  `:keywords:` already mentioning FastAPI via GraphQL.
* **Back-link targets:** `programming-languages/python/index.adoc`; `backend/graphql/python-getting-started.adoc`;
  `starting-a-new-project.adoc` "Python / FastAPI" table row (~line 377).
* **Templates:** `partials/ai-langchain-disclaimer.adoc`; `backend/graphql/cheat-sheet.adoc`;
  `attachments/*-cheat-sheet.pdf`; `images/python-sync-vs-async-timeline.svg`; precedents
  `.archive/implementation_plan_198.md` and `_197.md`.
* **Tooling:** `npx antora antora-playbook.yml`, `npm run validate:mermaid` (`scripts/validate-mermaid.mjs`), the
  `iru-build-docs` skill, headless Chrome and `pdfinfo` for the PDF. Baseline build: 0 errors / 0 warnings.

## Conventions every page task must follow

* **Header:** `= Title`, `:description:` (one sentence), `:keywords:`, blank line,
  `include::partial$fastapi-disclaimer.adoc[]`.
* **Lead paragraph** states the versions written against, dated.
* **Content:** what/why, how FastAPI implements it (Starlette vs Pydantic vs FastAPI), every relevant option, pitfalls,
  OpenAPI/Swagger effect, recent changes with versions, where the book is outdated. Python 3.10+ syntax, `Annotated`
  everywhere, Pydantic v2, `fastapi dev`; requests with `curl`/HTTPie (`[source,bash]`) and responses (`[source,json]`).
* **Page ending:** `== References` listing only official docs (and the book's publisher page where used).

## Implementation steps

### Group 1 — Scaffolding and version verification

**Parallelizable: yes (independent tasks)**

- [x] Task 1. Create `modules/ROOT/partials/fastapi-disclaimer.adoc`. — created; no secrets, build not run (partial only).
  - [x] Task 1.1. Copy the shape of `partials/ai-langchain-disclaimer.adoc` (single `[IMPORTANT]` block). Text: the AI-assistance disclosure only ("This content was generated with the assistance of AI and should be verified against the official documentation before being relied on in production") plus a pointer to `xref:backend/fastapi/index.adoc#_bibliography[the section bibliography]`.
  - [x] Task 1.2. No other `NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT` block may appear anywhere under `backend/fastapi/`.
- [x] Task 2. Update the comment at the top of `modules/ROOT/partials/nav-python.adoc`.
  - [x] Task 2.1. List all three usage sites (Programming Languages, Web Development, Backend Development), mirroring `partials/nav-java.adoc`'s comment; leave the nav entries untouched.
- [x] Task 3. Verify and record the version baseline (scratchpad `versions-199.md`) that every later task cites.
  - [x] Task 3.1. Read current releases from PyPI (`fastapi`, `pydantic`, `pydantic-settings`, `starlette`, `uvicorn`, `sqlmodel`, `sqlalchemy`, `alembic`, `httpx`, `anyio`, `pyjwt`, `pwdlib`, `python-multipart`, `jinja2`, `schemathesis`, `locust`, `pymongo`, `redis`) and the FastAPI release notes; state the date. The issue's numbers (FastAPI 0.141.1, Pydantic 2.13, Starlette 1.7, Python 3.14) are re-verified, not copied.
  - [x] Task 3.2. Re-verify every version-tagged claim in the issue's "Where the book is outdated" / "New since the book" lists against https://fastapi.tiangolo.com/release-notes/ (0.89, 0.93, 0.95, 0.99, 0.102, 0.103, 0.106, 0.111, 0.112, 0.113, 0.115, 0.116, 0.117, 0.118, 0.121, 0.122, 0.123.5, 0.125-0.131, 0.132, 0.134, 0.135, 0.136.x, 0.137.x-0.141); record deviations and dates for `whats-changed-and-migration.adoc`.
  - [x] Task 3.3. `curl -sI -L -o /dev/null -w '%{url_effective}'` every URL in the issue's Bibliography; record canonical forms and 404s (oreilly.com answers 403 to automated fetches, expected).
  - [x] Task 3.4. Create a throw-away venv (Python 3.12+) in the scratchpad with `fastapi[standard]`, `sqlmodel`, `pyjwt`, `pwdlib[argon2]`, `pydantic-settings`, `pytest`, `httpx`, `anyio`, `schemathesis` and the other libraries pages need, so examples are run with `TestClient` before being pasted. Never commit the venv.
  - [x] Task 3.5. Check the book PDF is only consulted for narrative (never copied) and is never staged: `git status` must never list `fastapi.pdf`.

  Version baseline: scratchpad `199/versions-199.md` (FastAPI 0.142.2 on 2026-10-02, not 0.141.1); venv `199/venv` (Python 3.13.16).

### Group 2 — Foundations pages

**Parallelizable: yes (four independent pages)**

- [x] Task 4. Create `introduction-and-architecture.adoc` ("Introduction & Architecture"). — `backend/fastapi/introduction-and-architecture.adoc`, SVG `fastapi-layer-stack.svg`, Mermaid sequence; 4 examples executed OK (Python 3.13); Mermaid validated.
  - [x] Task 4.1. Header per "Conventions" (`= Introduction & Architecture`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 4.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): FastAPI = Starlette + Pydantic + OpenAPI; ASGI vs WSGI and servers (Uvicorn, Hypercorn, Daphne, Granian); main features; REST concepts (resources, CRUD ↔ verbs, status-code classes, statelessness); framework comparison table (Flask, Django/DRF, Litestar, Quart, AIOHTTP) with xrefs to `backend/springboot/rest-apis.adoc`, `backend/quarkus/*`, `web/aspnet/core/*` (verify targets exist); benchmarks caveats; history and 0.x versioning policy.
  - [x] Task 4.3. Figure: SVG `modules/ROOT/images/fastapi-layer-stack.svg` (ASGI server → Starlette → FastAPI → your code, Pydantic beside it) and a Mermaid sequence of one request's lifecycle.
  - [x] Task 4.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 5. Create `getting-started.adoc` ("Getting Started") ★. — `backend/fastapi/getting-started.adoc`, Mermaid dev loop; examples run incl. real `fastapi dev` + curl, TestClient, HTTPX; Mermaid validated.
  - [x] Task 5.1. Header per "Conventions" (`= Getting Started`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 5.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): venv with `uv`/`venv` (xref the Python Reference), `pip install "fastapi[standard]"` and its contents (and `standard-no-fastapi-cloud-cli`), the first app, `fastapi dev` vs `fastapi run` and the `pyproject.toml` entrypoint, `/docs` `/redoc` `/openapi.json`, curl/HTTPie/HTTPX, `python -m fastapi`, Uvicorn directly, editor support, the FastAPI Agent Skill, debugging with `uvicorn.run` and an IDE debugger, version pinning.
  - [x] Task 5.3. Figure: Mermaid of the dev loop.
  - [x] Task 5.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 6. Create `python-types-and-annotated.adoc` ("Python Types & Annotated"). — `backend/fastapi/python-types-and-annotated.adoc`; 9 examples executed OK.
  - [x] Task 6.1. Header per "Conventions" (`= Python Types & Annotated`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 6.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): how type hints drive conversion/validation/docs/editor support, `X | None` vs `Optional`, `Annotated` (PEP 593) and why it is recommended, reusable `Annotated` aliases, PEP 695 `type` aliases; xref `programming-languages/python/type-hints.adoc` instead of re-explaining typing.
  - [x] Task 6.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 7. Create `async-and-concurrency.adoc` ("Async & Concurrency") ★. — `backend/fastapi/async-and-concurrency.adoc`, SVG `fastapi-async-vs-sync.svg`; 10 examples executed OK (timings measured).
  - [x] Task 7.1. Header per "Conventions" (`= Async & Concurrency`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 7.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `async def` vs `def` path operations and dependencies, event loop vs threadpool, what blocks the loop and fixes (`run_in_threadpool`, async drivers, process pools, task queues), concurrency vs parallelism, AnyIO, free-threaded 3.14t; xref `programming-languages/python/concurrency-and-async.adoc`.
  - [x] Task 7.3. Figure: SVG `fastapi-async-vs-sync.svg` comparing `async def` and `def` under load (style of `python-sync-vs-async-timeline.svg`).
  - [x] Task 7.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).

### Group 3 — Request data pages

**Parallelizable: yes (seven independent pages)**

- [x] Task 8. Create `path-parameters.adoc` ("Path Parameters") ★.
  - [x] Task 8.1. Header per "Conventions" (`= Path Parameters`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 8.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): typed params and conversion, route order, `Enum`, `:path` converter, `Path` numeric validation (`gt/ge/lt/le`), metadata and the `*` ordering trick, trailing slashes and redirects, RESTful URL design.
  - [x] Task 8.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 9. Create `query-parameters.adoc` ("Query Parameters") ★.
  - [x] Task 9.1. Header per "Conventions" (`= Query Parameters`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 9.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): defaults, optional/required, `bool` conversion, `Query` string validation (`min_length`, `max_length`, `pattern`), list params, aliases, `deprecated`, `include_in_schema`, `AfterValidator`, query parameter models with `extra="forbid"`, pagination and sorting parameters.
  - [x] Task 9.3. Figure: Mermaid of where FastAPI looks for each parameter (path, query, body, Header/Cookie/Form/File).
  - [x] Task 9.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 10. Create `request-body-and-models.adoc` ("Request Body & Models") ★.
  - [x] Task 10.1. Header per "Conventions" (`= Request Body & Models`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 10.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `BaseModel` bodies, body+path+query, multiple body params, `Body()`/`embed=True`, `Field`, nested models/lists/sets/dicts/`HttpUrl`, extra data types, examples (`json_schema_extra`, `Field(examples=)`, `openapi_examples`), dataclasses, PUT vs PATCH with `model_dump(exclude_unset=True)` + `model_copy(update=)`, base64 `bytes`.
  - [x] Task 10.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 11. Create `pydantic-v2-essentials.adoc` ("Pydantic v2 Essentials") ★.
  - [x] Task 11.1. Header per "Conventions" (`= Pydantic v2 Essentials`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 11.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): models, field types and constraints, `Annotated` constraints, `field_validator`/`model_validator`, `model_config` (`extra`, `from_attributes`, `str_strip_whitespace`, `frozen`), computed fields, aliases, serialization (`model_dump`, `model_dump_json`, `serialization_alias`), strict vs lax, 422 error structure, `pydantic-extra-types`, v1 → v2 migration table (every row of the issue's table), v1 removal timeline, `bump-pydantic`.
  - [x] Task 11.3. Figure: Mermaid of validation flow (raw JSON → lax/strict coercion → validators → model → serialization).
  - [x] Task 11.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 12. Create `headers-and-cookies.adoc` ("Headers & Cookies").
  - [x] Task 12.1. Header per "Conventions" (`= Headers & Cookies`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 12.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `Header()` underscore-to-hyphen conversion and `convert_underscores`, the 0.136.3 rejection of underscore headers, duplicate headers as lists, `Cookie()`, header/cookie parameter models with `extra="forbid"`, reading them from `Request`.
  - [x] Task 12.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 13. Create `forms-and-file-uploads.adoc` ("Forms & File Uploads") ★.
  - [x] Task 13.1. Header per "Conventions" (`= Forms & File Uploads`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 13.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `python-multipart`, `Form()` and form models, `File()` bytes vs `UploadFile` (spooled file, async methods, `size`, `content_type`), optional/multiple files, forms+files, why a body cannot be JSON and form, size limits, GET-vs-POST form pitfall, saving uploads; prose links to the site's Blob/S3 pages (verify they exist).
  - [x] Task 13.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 14. Create `request-object-and-content-type.adoc` ("Request Object & Content-Type").
  - [x] Task 14.1. Header per "Conventions" (`= Request Object & Content-Type`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 14.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): Starlette `Request` (client, URL, raw body, `stream()`, `state`), strict `Content-Type` checking (CSRF scenario, allowing missing content types), custom `Request`/`APIRoute` classes (gzip bodies, reading the body in an exception handler).
  - [x] Task 14.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 4 — Responses and errors pages

**Parallelizable: yes (four independent pages)**

- [x] Task 15. Create `response-models-and-return-types.adoc` ("Response Models & Return Types") ★.
  - [x] Task 15.1. Header per "Conventions" (`= Response Models & Return Types`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 15.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): return annotation vs `response_model`, output filtering (hiding `hashed_password`), `response_model_exclude_unset/include/exclude`, extra models (In/Out/DB, inheritance, `Union`, list/dict responses), `None` returns, returning a `Response` subclass, `separate_input_output_schemas`, Pydantic-in-Rust serialization (0.130).
  - [x] Task 15.3. Figure: Mermaid of the In/Public/DB model family for `Book`.
  - [x] Task 15.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 16. Create `status-codes-and-error-handling.adoc` ("Status Codes & Error Handling") ★.
  - [x] Task 16.1. Header per "Conventions" (`= Status Codes & Error Handling`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 16.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `status_code=`, `fastapi.status`, 201/204, `HTTPException` with headers, domain exceptions mapped to 404/409, custom exception handlers, overriding `RequestValidationError` and `StarletteHTTPException` handlers and reusing defaults, additional status codes via `JSONResponse`, dynamic status via `Response` parameter, RFC 9457 problem details, troubleshooting by status code.
  - [x] Task 16.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 17. Create `custom-responses.adoc` ("Custom Responses").
  - [x] Task 17.1. Header per "Conventions" (`= Custom Responses`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 17.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): returning a `Response` directly plus `jsonable_encoder`, `JSONResponse`/`HTMLResponse`/`PlainTextResponse`/`RedirectResponse`/`FileResponse`, custom response class and `default_response_class`, response headers and cookies (`set_cookie` options), the `ORJSONResponse`/`UJSONResponse` deprecation, returning an image (original example).
  - [x] Task 17.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 18. Create `streaming-json-lines-and-sse.adoc` ("Streaming, JSON Lines & SSE") ★.
  - [x] Task 18.1. Header per "Conventions" (`= Streaming, JSON Lines & SSE`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 18.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `StreamingResponse` with sync/async generators (chunked download), JSON Lines by `yield` (0.134), Server-Sent Events (`EventSourceResponse`, `ServerSentEvent` fields, `Last-Event-ID`, SSE over POST, validation), disconnect handling, proxy buffering, SSE vs WebSockets vs polling decision table, dependency session inside a stream (0.118 `yield` behaviour).
  - [x] Task 18.3. Figure: Mermaid sequence diagram of an SSE session with reconnect and `Last-Event-ID`.
  - [x] Task 18.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).

### Group 5 — Dependencies and security pages

**Parallelizable: yes (six independent pages)**

- [x] Task 19. Create `dependency-injection.adoc` ("Dependency Injection") ★.
  - [x] Task 19.1. Header per "Conventions" (`= Dependency Injection`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 19.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): what DI solves, `Depends` with functions/async/classes, the `Depends()` shortcut, reusable `Annotated` aliases, sub-dependencies, per-request caching and `use_cache=False`, decorator/router/global `dependencies=`, parameterized dependencies (`__call__`), `functools.partial` dependables, dependencies in WebSockets, OpenAPI effect, overriding in tests.
  - [x] Task 19.3. Figure: Mermaid of the Bookshelf dependency tree (`get_session`, `get_settings`, `get_current_user`, `get_current_active_user`, `require_scopes`).
  - [x] Task 19.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 20. Create `dependencies-with-yield.adoc` ("Dependencies with yield") ★.
  - [x] Task 20.1. Header per "Conventions" (`= Dependencies with yield`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 20.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): setup/teardown with `yield`, `try/except/finally` and re-raising, `HTTPException` in exit code, execution order vs the response (0.106, 0.118 changes), `scope="function"` vs `"request"` (0.121), yield sub-dependencies, context managers inside dependencies, background tasks and yield dependencies.
  - [x] Task 20.3. Figure: Mermaid sequence of the yield-dependency lifecycle around path function, response and background tasks.
  - [x] Task 20.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 21. Create `security-fundamentals.adoc` ("Security Fundamentals") ★.
  - [x] Task 21.1. Header per "Conventions" (`= Security Fundamentals`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 21.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): authn vs authz, HTTPS first, the four OpenAPI security schemes and `fastapi.security` classes, `HTTPBasic` with `secrets.compare_digest`, 401 + `WWW-Authenticate`, API keys in header/query/cookie, `HTTPBearer`, the 401-vs-403 change (0.122) and restore how-to, third-party options listed only; xref `backend/oauth/*` for theory.
  - [x] Task 21.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 22. Create `oauth2-password-and-jwt.adoc` ("OAuth2 Password Flow & JWT") ★.
  - [x] Task 22.1. Header per "Conventions" (`= OAuth2 Password Flow & JWT`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 22.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `OAuth2PasswordBearer`, `OAuth2PasswordRequestForm`, `/token`, Swagger Authorize, `get_current_user`/`get_current_active_user`, JWT with PyJWT (HS256 vs RS256, `sub/exp/iat`, `InvalidTokenError`, timezone-aware expiry), pwdlib Argon2 and migrating bcrypt hashes, secret from settings (`openssl rand -hex 32`, never real secrets), refresh tokens (design only), why password flow is first-party only, where the book is outdated (python-jose, passlib, `utcnow`, flow naming).
  - [x] Task 22.3. Figure: Mermaid sequence: login → token → authenticated request.
  - [x] Task 22.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 23. Create `oauth2-scopes-and-authorization.adoc` ("OAuth2 Scopes & Authorization").
  - [x] Task 23.1. Header per "Conventions" (`= OAuth2 Scopes & Authorization`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 23.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): scopes with `Security()`, `SecurityScopes`, scope-carrying JWTs and the scope dependency tree, authorization models (admin flag, ACL, RBAC) as dependencies, resource-ownership checks, external OIDC provider (`OpenIdConnect`, JWKS validation) linking the OAuth Reference's OIDC and social-login pages.
  - [x] Task 23.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 24. Create `middleware-cors-and-proxies.adoc` ("Middleware, CORS & Proxies") ★.
  - [x] Task 24.1. Header per "Conventions" (`= Middleware, CORS & Proxies`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 24.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `@app.middleware("http")` and order, pure ASGI middleware, `CORSMiddleware` (origins, credentials, methods, headers, `expose_headers`, preflight), `GZipMiddleware`, `TrustedHostMiddleware`, `HTTPSRedirectMiddleware`, behind a proxy (`--forwarded-allow-ips`, `root_path`, stripped prefixes, OpenAPI `servers`, Traefik), HTTPS termination.
  - [x] Task 24.3. Figure: Mermaid middleware "onion" and Mermaid CORS preflight sequence.
  - [x] Task 24.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).

### Group 6 — Data and application-structure pages

**Parallelizable: yes (four independent pages)**

- [x] Task 25. Create `sql-databases-with-sqlmodel.adoc` ("SQL Databases with SQLModel") ★. — sql-databases-with-sqlmodel.adoc (1.7k lines; 24+ examples run on SQLite, asyncpg/PostgreSQL/compose not run live; Mermaid ER); Antora build clean apart from later-group xrefs; detect-secrets clean after fixes.
  - [x] Task 25.1. Header per "Conventions" (`= SQL Databases with SQLModel`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 25.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): SQLModel = SQLAlchemy 2.0 + Pydantic, engine and `yield` session dependency, `create_all` in lifespan, model family (`BookBase/Book/BookCreate/BookPublic/BookUpdate`), CRUD with PATCH, relationships authors↔books, `offset/limit`, async sessions (`AsyncSession` + `asyncpg`), Alembic, PostgreSQL in Compose, plain SQLAlchemy / raw DB-API alternative (book ch. 10, fixed), pooling and `check_same_thread`; xref `database/sql/*` and `database/vector-rag/postgresql-pgvector.adoc` (verify).
  - [x] Task 25.3. Figure: Mermaid ER diagram of the Bookshelf schema.
  - [x] Task 25.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 26. Create `nosql-and-other-data-stores.adoc` ("NoSQL & Other Data Stores"). — nosql-and-other-data-stores.adoc (7 examples; Mongo/Redis/ES via fakes or fake server, Qdrant in-memory); Antora build clean apart from later-group xrefs; detect-secrets clean after fixes.
  - [x] Task 26.1. Header per "Conventions" (`= NoSQL & Other Data Stores`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 26.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): MongoDB with PyMongo async (Motor deprecation), Redis with `redis.asyncio` (caching, rate limiting), Elasticsearch async client, a vector store for semantic search over reviews, JSON columns in SQL; lifespan-managed clients exposed as dependencies; link each engine reference on this site and the driver's docs.
  - [x] Task 26.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 27. Create `project-structure-and-layered-architecture.adoc` ("Project Structure & Layered Architecture"). — project-structure-and-layered-architecture.adoc + images/fastapi-layered-layout.svg (12 pytest passed); Antora build clean apart from later-group xrefs; detect-secrets clean after fixes.
  - [x] Task 27.1. Header per "Conventions" (`= Project Structure & Layered Architecture`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 27.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): package layout, `APIRouter` (`prefix/tags/dependencies/responses`), `include_router`, nested routers, relative imports, `pyproject.toml` entrypoint, Web/Service/Data layers and hexagonal ports and adapters reframed with DI, repository and Unit of Work, fakes vs mocks, Full Stack FastAPI Template, `iter_route_contexts()`, the final Bookshelf layout (`app/main.py`, `routers/`, `models/`, `services/`, `db.py`, `settings.py`, `tests/`); xref `backend/architecture/architectural-patterns/*`.
  - [x] Task 27.3. Figure: SVG `fastapi-layered-layout.svg` (web → service → data, models alongside, DI wiring).
  - [x] Task 27.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 28. Create `settings-lifespan-and-background-tasks.adoc` ("Settings, Lifespan & Background Tasks") ★. — settings-lifespan-and-background-tasks.adoc (~17 examples run; Mermaid sequence); Antora build clean apart from later-group xrefs; detect-secrets clean after fixes.
  - [x] Task 28.1. Header per "Conventions" (`= Settings, Lifespan & Background Tasks`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 28.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `BaseSettings` (env, `.env`, nested, secrets dirs), settings dependency with `@lru_cache` overridden in tests, twelve-factor config, `lifespan` (`asynccontextmanager`, lifespan state, clients/pools, sub-apps), deprecated `on_event`, `BackgroundTasks` (path functions and dependencies), when to move to Celery/arq/broker (xref `backend/messaging/*`).
  - [x] Task 28.3. Figure: Mermaid timeline of startup → requests → shutdown.
  - [x] Task 28.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).

### Group 7 — OpenAPI, real-time and composition pages

**Parallelizable: yes (four independent pages)**

- [x] Task 29. Create `openapi-and-interactive-docs.adoc` ("OpenAPI & Interactive Docs") ★.
  - Done: openapi-and-interactive-docs.adoc (1795 lines, 2 Mermaid figures, 17 examples run).
  - [x] Task 29.1. Header per "Conventions" (`= OpenAPI & Interactive Docs`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 29.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): schema generation, metadata (title, summary, version, contact, license identifier, `openapi_tags`, docs URLs), path-operation configuration (tags Enum, summary, Markdown docstrings, `response_description`, `deprecated`, `operation_id`, `include_in_schema`, `\f`, `openapi_extra`), additional `responses=`, callbacks and webhooks, conditional OpenAPI, `get_openapi`, `swagger_ui_parameters`, self-hosting Swagger UI/ReDoc, generating clients (`generate_unique_id_function`), property-based testing link.
  - [x] Task 29.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 30. Create `websockets.adoc` ("WebSockets") ★.
  - Done: websockets.adoc (1922 lines, 2 Mermaid figures, 20 examples run).
  - [x] Task 30.1. Header per "Conventions" (`= WebSockets`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 30.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `@app.websocket`, text/bytes/JSON, path/query/cookie/dependency params, `WebSocketDisconnect`, connection manager for per-book chat, authentication, scaling across workers (Redis pub/sub note), testing link.
  - [x] Task 30.3. Figure: Mermaid sequence: connect → messages → broadcast → disconnect.
  - [x] Task 30.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 31. Create `static-files-templates-and-frontend.adoc` ("Static Files, Templates & Frontend").
  - Done: static-files-templates-and-frontend.adoc (1355 lines, 18 examples run).
  - [x] Task 31.1. Header per "Conventions" (`= Static Files, Templates & Frontend`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 31.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `StaticFiles` (`html=True`), `Jinja2Templates` with the current `TemplateResponse(request, name, context)` signature and `url_for`, forms rendered by templates, JS `fetch()` front end (original), `app.frontend()`/`router.frontend()` (client-side-routing fallback, custom 404, `check_dir`, dependencies such as cookie auth).
  - [x] Task 31.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 32. Create `sub-applications-wsgi-and-graphql.adoc` ("Sub-applications, WSGI & GraphQL").
  - Done: sub-applications-wsgi-and-graphql.adoc (844 lines, 9 examples run).
  - [x] Task 32.1. Header per "Conventions" (`= Sub-applications, WSGI & GraphQL`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 32.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): mounting FastAPI sub-apps (separate docs, `root_path`), mounting Starlette apps, `WSGIMiddleware` for Flask/Django migrations, the official GraphQL how-to; xref (do not repeat) `backend/graphql/python-*.adoc`.
  - [x] Task 32.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 8 — Testing, production and AI pages

**Parallelizable: yes (six independent pages)**

- [x] Task 33. Create `testing.adoc` ("Testing") ★.
  - [x] Task 33.1. Header per "Conventions" (`= Testing`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 33.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): `TestClient` + pytest, layout, fixtures (app, client, in-memory SQLite with `StaticPool`), `app.dependency_overrides`, lifespan testing, WebSocket testing, auth-protected routes, async tests with `pytest.mark.anyio` + `httpx.AsyncClient(transport=ASGITransport(app=app))`, DB testing, test pyramid and per-layer tests, coverage; xref `programming-languages/python/testing.adoc`.
  - [x] Task 33.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 34. Create `property-based-and-load-testing.adoc` ("Property-based & Load Testing").
  - [x] Task 34.1. Header per "Conventions" (`= Property-based & Load Testing`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 34.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): Schemathesis + Hypothesis against `/openapi.json`, Locust, Faker, a basic security-testing checklist; every snippet links its tool's official docs.
  - [x] Task 34.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 35. Create `deployment.adoc` ("Deployment") ★.
  - [x] Task 35.1. Header per "Conventions" (`= Deployment`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 35.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): deployment concepts (HTTPS, startup, restarts, replication, memory, pre-start), `fastapi run` and ASGI servers, workers (`fastapi run --workers`, `uvicorn --workers`, the Gunicorn `UvicornWorker` deprecation), HTTPS (TLS proxy, Let's Encrypt, Traefik), version pinning, FastAPI Cloud (`fastapi login`, `fastapi deploy`), cloud providers (prose for AWS/GCP issues #163/#164; xref `cloud/azure/*`).
  - [x] Task 35.3. Figure: SVG `fastapi-production-topology.svg` (TLS proxy → N containers × 1 Uvicorn process → DB).
  - [x] Task 35.4. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 36. Create `docker-and-kubernetes.adoc` ("Docker & Kubernetes") ★.
  - [x] Task 36.1. Header per "Conventions" (`= Docker & Kubernetes`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 36.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): official Dockerfile (slim base, layer cache, exec-form `CMD ["fastapi", "run", …]`, `--proxy-headers`), `uv` variant, one process per container vs `--workers`, Compose with PostgreSQL, Kubernetes replication/probes/graceful shutdown (prose for #162 only), Alembic as pre-start step, deprecated `tiangolo/uvicorn-gunicorn-fastapi` image; xref `backend/docker/*` and `cloud/azure/*`.
  - [x] Task 36.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`. This is a ★ page: it must be among the most detailed in the section (all options, pitfalls, OpenAPI effect).
- [x] Task 37. Create `performance-and-observability.adoc` ("Performance & Observability").
  - [x] Task 37.1. Header per "Conventions" (`= Performance & Observability`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 37.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): async correctness, Pydantic serialization, caching (`functools.cache`, Redis), DB indexes and N+1, streaming large responses, profiling, PyPy/Cython/Rust (brief), structured logging (Uvicorn loggers, request-ID middleware), Prometheus metrics (`prometheus-fastapi-instrumentator`) and Grafana, OpenTelemetry (`opentelemetry-instrumentation-fastapi`); xref `database/prometheus/*` (verify).
  - [x] Task 37.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 38. Create `serving-data-science-and-ai.adoc` ("Serving Data Science & AI").
  - [x] Task 38.1. Header per "Conventions" (`= Serving Data Science & AI`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 38.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): pandas endpoint, Plotly chart as PNG/SVG, Hugging Face `transformers` model loaded once in lifespan with inference in threadpool/worker and token streaming via SSE/JSON Lines, vector-search endpoint; introductory only, #198 and #200 mentioned in prose without `xref:`.
  - [x] Task 38.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.

### Group 9 — Landing page, changes page, cheat sheet, navigation and cross-links

**Parallelizable: yes (every task edits a distinct file; references only Groups 1–8)**

- [x] Task 39. Create `whats-changed-and-migration.adoc` ("What's Changed & Migration").
  - [x] Task 39.1. Header per "Conventions" (`= What's Changed & Migration`, `:description:`, `:keywords:`, disclaimer include); lead paragraph with the dated version baseline.
  - [x] Task 39.2. Cover every bullet of this page's outline in issue #199 (`gh issue view 199`): a dated table of every item under "Where the book is outdated" and "New since the book": version, date, old way, new way, link to the covering page and to the official release notes (data from Group 1 `versions-199.md`).
  - [x] Task 39.3. Every code example is runnable (verified against the Group 1 venv) and followed by a `Source:` link to the official page it derives from; "where the book is outdated" and "what changed recently" in prose; end with `== References`.
- [x] Task 40. Create `backend/fastapi/index.adoc` ("Python FastAPI").
  - [x] Task 40.1. Header + disclaimer; what FastAPI is and who the section is for; version baseline in prose; the Bookshelf API scenario; reading path (foundations → requests → responses → dependencies → security → data → application structure → OpenAPI → real-time and web → testing → production); `== What's covered` with `xref:` to every page grouped like the nav; "where related material lives elsewhere on this site" table (the issue's existing-pages table, every xref target verified to exist).
  - [x] Task 40.2. Figures: SVG `fastapi-bookshelf-architecture.svg` of the Bookshelf API and a Mermaid mind-map of the section.
  - [x] Task 40.3. `== Bibliography` listing every source from the issue, each linked to its official site (O'Reilly publisher page and companion repo for the book; fastapi.tiangolo.com groups; library docs; specifications; third-party tools); closing note that the book is a consulted reference and the official docs are authoritative. Book title/author appear only here.
  - [x] Task 40.4. URL audit with the canonical forms from Group 1: every link resolves.
- [x] Task 41. Create `backend/fastapi/cheat-sheet.adoc` ("FastAPI Cheat Sheet").
  - [x] Task 41.1. Follow `backend/graphql/cheat-sheet.adoc`: disclaimer, intro with `xref:attachment$fastapi-cheat-sheet.pdf[downloadable PDF]` and version baseline, grouped `*Group* --` paragraphs of `xref:`s to every page, final `xref:attachment$fastapi-cheat-sheet.pdf[Download the FastAPI Cheat Sheet (PDF)]`.
- [x] Task 42. Produce `modules/ROOT/attachments/fastapi-cheat-sheet.pdf`.
  - [x] Task 42.1. Throw-away print-ready HTML/CSS in the scratchpad (dense multi-column, colour-coded, version baseline and date in the header), visually consistent with `ai-langchain-cheat-sheet.pdf` and `graphql-cheat-sheet.pdf`; only the PDF is committed.
  - [x] Task 42.2. Content: every group listed in the issue's Cheat sheet section (install/run, path operations, parameter sources with `Annotated`, Pydantic v2 + v1→v2 mini-table, responses, streaming, DI, security, middleware/CORS/proxy flags, SQLModel, settings/lifespan/BackgroundTasks, `APIRouter` + layout tree, OpenAPI, WebSockets, static/templates/`frontend()`, testing, deployment, "changed since older tutorials" strip with versions).
  - [x] Task 42.3. Render via headless Chrome print-to-PDF; verify with `pdfinfo` that it is **exactly one A4 page** with no overflow and legible when printed.
- [x] Task 43. Edit `modules/ROOT/nav.adoc`.
  - [x] Task 43.1. Under `** xref:backend/index.adoc[Backend Development]` (line ~574) add `include::partial$nav-python.adoc[]` immediately after `include::partial$nav-java.adoc[]` (line ~575). Do not touch the other two includes.
  - [x] Task 43.2. After the Python include, add `*** xref:backend/fastapi/index.adoc[Python FastAPI]` with `****` children for every page in the outline order (foundations, request data, responses and errors, dependencies, security, data, OpenAPI, real-time/web/composition, testing, production, beyond) ending with `**** xref:backend/fastapi/cheat-sheet.adoc[Cheat Sheet (PDF)]`; titles match page H1s; place it before the Hibernate Reference entry.
- [x] Task 44. Edit `modules/ROOT/pages/backend/index.adoc`.
  - [x] Task 44.1. Add a **Python Reference** bullet (`xref:programming-languages/python/index.adoc[Python Reference]`) after the Java Reference bullet, summarised as the Java bullet is, and a **Python FastAPI** bullet (`xref:backend/fastapi/index.adoc[Python FastAPI]`) ending "plus a downloadable cheat sheet".
  - [x] Task 44.2. Update `:description:` and append the issue's new `:keywords:` terms, skipping duplicates.
- [x] Task 45. Edit root `modules/ROOT/pages/index.adoc`.
  - [x] Task 45.1. Mention FastAPI in `:description:` (no new tile) and append `FastAPI, Pydantic, Starlette, Uvicorn, ASGI, SQLModel` to `:keywords:` without duplicates.
- [x] Task 46. Add back-links in existing pages.
  - [x] Task 46.1. `programming-languages/python/index.adoc`: add a "Where Python is used on this site" line linking `backend/fastapi/index.adoc`.
  - [x] Task 46.2. `backend/graphql/python-getting-started.adoc`: add a one-line back-link to the FastAPI section.
  - [x] Task 46.3. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`: in the "Python / FastAPI" row (~line 377) add an `xref:` to `backend/fastapi/index.adoc`, keeping the row's existing text.

### Group 10 — Build and verify

**Parallelizable: yes (single task, after Group 9)**

- [x] Task 47. Build and verify.
  - [x] Task 47.1. Run `npx antora antora-playbook.yml` on a clean `build/` (delegate to an `iru-gate-runner` sub-agent invoking `iru-build-docs`). Must exit 0 with **0 errors and 0 warnings** (repository baseline).
  - [x] Task 47.2. Run `npm run validate:mermaid`; every Mermaid block must parse.
  - [x] Task 47.3. Reachability: all 37 content pages + `cheat-sheet.adoc` are `xref:`-linked from `backend/fastapi/index.adoc` and from `nav.adoc`; `build/site/backend/fastapi/` has 38 HTML files; every `fastapi-*.svg` is in `build/site/_images/`; the PDF is 1 A4 page; the Python Reference renders under Backend Development.
  - [x] Task 47.4. Grep checks: disclaimer include in all 38 files and no other admonition (`^\[(NOTE|TIP|WARNING|CAUTION|IMPORTANT)\]` or `NOTE:` style) under `backend/fastapi/`; book title/author only on `backend/fastapi/index.adoc`; every content page has `== References` and every code example is followed by a `Source:` link; no `xref:` to #196/#198/#200/#162/#184 or other non-existent pages; no `xref:` in backticks; no empty-text fragment xrefs; no hardcoded secrets (`sk-`, `ghp_`, literal `Bearer ey`); no `orjson`/python-jose/passlib/`utcnow`/`@validator`/`.dict()`/`on_event` shown as the recommended way; `git status` shows no book PDF.
  - [x] Task 47.5. `/iru-check-security` clean (do not commit `.secrets.baseline`).
  - [x] Task 47.6. **Self-review pass:** delegate fresh `general-purpose` sub-agents (pages in batches, in parallel) to verify every class/function/flag/env var/URL/version against the official docs and the Group 1 baseline; fix every real finding, rebuild, record the finding count.
  - [x] Task 47.7. Re-run the URL audit and re-check the PDF against the pages after the fixes.
    - Result: build 0 errors/0 warnings, Mermaid 916 OK, 37 content pages + cheat-sheet + index = 39 HTML, 5 SVGs, PDF 1 page A4 (153 KB); self-review 9 findings fixed; URL audit 574 link URLs all 200 except 3 bot-blocking (oreilly 403, systemd 418, owasp fixed); security: no new secrets.
