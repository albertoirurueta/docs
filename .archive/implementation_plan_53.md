# Implementation Plan: Web Development / Python Reference

## Task summary

Source: GitHub issue #53

Issue [#53](https://github.com/albertoirurueta/docs/issues/53) ("Python Reference") asks to add a new
**"Python Reference"** subsection under the existing **Guides & References / Web Development** section of this
repo's own `ROOT` Antora component, at `modules/ROOT/pages/web/python/` — a twelfth sibling of `web/html-css/`,
`web/sass/`, `web/javascript/`, `web/bootstrap/`, `web/jquery/`, `web/react/`, `web/angular/`, `web/aspnet/`,
`web/tailwind/`, `web/typescript/`, and `web/vue/` (plus `web/vaadin/`). It documents the **Python language
itself**, framework-agnostic, as published at https://docs.python.org/3/ — installation and the interpreter,
lexical structure and PEP 8 style, variables and dynamic typing, numbers, strings and text, the built-in
collections, control flow (including `match`), functions and scope, iterators/generators/comprehensions, modules
and packages, files and context managers, exceptions, classes and OOP (operator overloading, composition/mixins,
managed attributes, decorators and metaclasses), modern stdlib topics (type hints, dataclasses/enums, a standard
library tour, concurrency/`asyncio`, virtual environments/packaging, debugging/tooling), unit testing with
`pytest` and mocking, plus a one-page downloadable PDF cheat sheet. Explanations must be brief and example-driven,
every concept must carry at least one runnable code example (`[source,python]` / `[source,console]` /
`[source,bash]` / `[source,text]`) and a link to the specific page on https://docs.python.org/3/ (or
https://docs.pytest.org/ for the testing page, or https://peps.python.org/ for the style page), and `[mermaid]`
diagrams and/or hand-authored inline SVG figures are used where they clarify a concept.

Three PDF books were consulted while planning this section — identified from their own PDF metadata/front matter,
each cited **only as a bibliography entry**, never as the "primary" or "main" reference (matching the
TypeScript / Angular / ASP.NET / Tailwind disclaimers' "third variant" wording):

- `~/Desktop/book1.pdf` — *Python Programming Fundamentals*, Kent D. Lee, Springer (Undergraduate Topics in
  Computer Science), 2nd edition, 2015, ISBN 978-1-4471-6641-2 (print) / 978-1-4471-6642-9 (eBook), 241 pp / 7
  chapters + 9 appendices (an undergraduate-course textbook: intro programming, decision making, loops, objects,
  functions, Tkinter event-driven GUIs, classes; appendices are operator/method tables and a Turtle-graphics
  reference; **no unit-testing or mocking content at all**). Publisher page:
  https://link.springer.com/book/10.1007/978-1-4471-6642-9
- `~/Desktop/book2.pdf` — *Python Crash Course*, Eric Matthes, No Starch Press, 3rd edition, 2023, ISBN-13
  978-1-7185-0270-3 (print) / 978-1-7185-0271-0 (ebook), 554 pp / 20 chapters in two parts (Part I: language
  basics through classes, files, and **Chapter 11 "Testing Your Code" — the only one of the three books that uses
  `pytest`**, covering basic `assert`-based test functions and classes but **no fixtures at depth and no
  mocking**; Part II: three build-a-project chapters — a game, data visualization, a Django web app). Publisher
  page: https://nostarch.com/python-crash-course-3rd-edition
- `~/Desktop/book3.pdf` — *Learning Python*, Mark Lutz, O'Reilly Media, 4th edition, 2009, ISBN 978-0-596-15806-4,
  1214 pp / 39 chapters in eight parts + appendices (the deepest and most comprehensive of the three: core types,
  statements, functions and scope, modules/packages, classes/OOP, exceptions, then a Part VIII of advanced topics
  — Unicode/bytes strings, managed attributes (properties/descriptors/`__getattr__`), decorators, metaclasses;
  predates Python 3.1, so it **has no coverage of f-strings, `pathlib`, type hints, `dataclasses`, `async`/
  `await`, the `match` statement, or `unittest.mock`/`pytest`** — it only mentions the stdlib `unittest` module
  in passing via `__name__ == "__main__"`). Publisher page:
  https://www.oreilly.com/library/view/learning-python-4th/9780596805395/

https://docs.python.org/3/ is the source every page is written and verified against (the tutorial, language
reference, library reference, and HOWTOs), with https://peps.python.org/pep-0008/ for style and
https://docs.pytest.org/ for the testing page. **All three books predate the current Python release line**
(3.14 as of this writing); where a book's material is dated or silent on a modern feature — f-strings (3.6+),
type hints/the `typing` module (3.5+), `pathlib` (3.4+), `dataclasses`/`@dataclass` (3.7+), `async`/`await`
(3.5+), the `match` statement (3.10+), exception groups (3.11+), and all of `unittest.mock`/`pytest`/mocking —
**the official documentation and `pytest`'s own docs are the sole sources**, and the disclaimer/relevant pages
say so explicitly rather than presenting the gap as a discrepancy to reconcile. Documentation prose must be
written as original explanation verified against the official docs, **not** presented as derived from the books;
the books appear only in `== Bibliography` and the disclaimer's "consulted while preparing these pages" clause.

This is the same pattern already used for the SQL, HTML & CSS, Sass, JavaScript, Bootstrap, jQuery, React,
Angular, ASP.NET, Tailwind, TypeScript, Vue.js, and Vaadin reference sections. The closest and most direct
precedent is [.archive/implementation_plan_35.md](.archive/implementation_plan_35.md) (issue #35, "TypeScript
Reference"): a new Web Development sibling grounded in an official doc site plus reference books that are
bibliography-only and predate the current version, with mermaid diagrams, hand-authored SVG figures, a
`== Bibliography`, and a headless-Chrome-rendered one-page PDF cheat sheet, organized into four task groups
(scaffold the disclaimer → parallel content pages → cheat sheet → section index + nav/landing wiring + build
verification).

### Choices made on the user's behalf (best-practice defaults, consistent with this repo's pattern and the issue text — stated here so they can be challenged during review)

1. **Document the current Python release line as published at https://docs.python.org/3/**, not pinned to a
   patch version. Examples use modern idioms throughout: f-strings by default (`%`/`.format()` shown for
   contrast/legacy code only), `pathlib.Path` alongside `os.path`, type hints in signatures where they clarify
   intent, `match` statements introduced alongside `if`/`elif` chains, and `async`/`await` documented as current,
   not experimental. Where a book uses an older or now-discouraged pattern (e.g. book3's `%`-formatting-first
   examples, or manual `try`/`except ImportError` version shims), the page documents the current approach and
   notes the difference is because the book predates it, not because the book is "wrong."
2. **Page breakdown: 24 content pages + 1 cheat sheet + 1 section index (26 `.adoc` files).** Issue #53's page
   list is followed **as-is** — every page maps to a distinct area of the official docs and to real book
   chapters, so no merges are applied and no page is added beyond what the issue lists (in particular, no
   `worked-example.adoc` — the issue's own page list doesn't include one, matching the ASP.NET/Angular/Vaadin
   sections rather than the TypeScript/Tailwind/React ones that have one).
3. **All three books promoted to bibliography-only.** Neither the disclaimer nor any per-page admonition may
   describe any book as the primary or main reference; they appear only as `== Bibliography` entries and in the
   disclaimer's "consulted while preparing these pages" clause. Documentation prose is original explanation
   verified against the official docs.
4. **The subsection is named "Python Reference"** in the section index title, the `web/index.adoc` bullet, the
   `nav.adoc` `***` entry, and the root `pages/index.adoc` bullet — matching the existing siblings.
5. **Placed last**, after **Vaadin Reference** (the current last entry in all three wiring points), in `nav.adoc`,
   `web/index.adoc`, and `pages/index.adoc` — the same "append in the order added" ordering every prior
   subsection followed.
6. **Mermaid is the default for flow/decision/state diagrams; six hand-authored SVGs** where a spatial figure is
   clearer than a flowchart: `python-mutable-vs-immutable.svg` (a name/variable box with an arrow to an object;
   rebinding an `int` moves the arrow to a new object, while mutating a `list` in place keeps the same arrow —
   two side-by-side scenarios), `python-legb-scope.svg` (four nested boxes labelled Local ⊂ Enclosing ⊂ Global ⊂
   Built-in, with a lookup arrow stopping at the innermost box that defines the name), `python-mro-diagram.svg`
   (a small diamond inheritance graph — two classes `B`/`C` both extending `A`, `D` extending both — with the C3
   linearization order `D → B → C → A → object` listed alongside), `python-decorator-call-chain.svg` (nested
   boxes showing `@decorator` wrapping `func` into a new callable, and the call-time chain
   `caller → wrapper → func → wrapper → caller`), `python-context-manager-protocol.svg` (a `with` block's
   `__enter__`/`__exit__` call sequence, including the exception-swallowing return-`True` path), and
   `python-sync-vs-async-timeline.svg` (two horizontal timelines — blocking synchronous calls serialized
   end-to-end vs. cooperatively-scheduled `async`/`await` tasks interleaved on one thread). Mermaid covers: the
   source → bytecode → PVM execution model (`getting-started.adoc`), an `if`/`elif`/`else` vs. `match` decision
   flowchart (`control-flow.adoc`), the module-import resolution steps — find / compile (maybe) / run
   (`modules-and-packages.adoc`), a `try`/`except`/`else`/`finally` control-flow diagram (`exceptions.adoc`), the
   iterator-protocol state machine — `iter()` → repeated `next()` → `StopIteration` (`iterators-generators-
   comprehensions.adoc`), and pytest's discover → collect → run (fixture setup/yield/teardown) → report flow
   (`testing.adoc`). The implementer may add further small `python-*.svg` figures under `modules/ROOT/images/`
   while writing a page if one adds real value — not pre-planned as separate tasks. No diagram where a short code
   block is clearer.
7. **No existing page to cross-link or avoid duplicating.** Unlike TypeScript (which cross-links
   `web/react/typescript.adoc` and `web/angular/typescript-essentials.adoc`), nothing in this repository
   currently documents Python — every page in this plan is wholly new content. `standard-library-tour.adoc` and
   `virtual-environments-and-packaging.adoc` should still cross-reference each other and the relevant core-
   language pages within this same new section (e.g. `files-and-context-managers.adoc` ↔ `standard-library-
   tour.adoc`'s `pathlib` mention) rather than duplicating content across pages.
8. **No "quiz"/"related questions" page** — not this repo's default section pattern (the jQuery section carried
   one only because its own issue explicitly asked for it; issue #53 does not).
9. **No project-picker icon/xref** for Python Reference — like the other Web Development subsections it lives
   only under the root `pages/index.adoc`'s `== Guides & References` list, not as a remote-component picker tile.
10. **PDF generation approach**: same as every prior section — a hand-built, print-ready single-page HTML/CSS
    layout rendered to PDF via headless Chrome (`--headless --print-to-pdf --no-pdf-header-footer`), saved as a
    static checked-in asset at `modules/ROOT/attachments/python-cheat-sheet.pdf`, linked via
    `xref:attachment$python-cheat-sheet.pdf[Download the Python Cheat Sheet (PDF)]`. The cheat sheet must be
    **exactly one A4 page** (page-count check + a rendered preview with no clipping).

## Current code state

- This repo has **no application source code** — it *is* the Antora playbook + root (`ROOT`) component
  ([antora.yml](antora.yml)), navigated by [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), with pages under
  `modules/ROOT/pages/`. The only verification is a clean `npx antora antora-playbook.yml` build (no lint/test
  suite). Installed `*-code-one-task` skills are `java` / `dotnet` / `database` only — **none applies**; every
  task below is AsciiDoc / HTML / PDF / SVG content, implemented directly and left **untagged**.
- **Web Development** ([modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc)) currently lists
  two standalone pages (`web/cors.adoc`, `web/accessibility.adoc`) then eleven subsections, in this order: HTML &
  CSS Reference, Sass Reference, JavaScript Development, Bootstrap Reference, jQuery Reference, React Reference,
  Angular Reference, ASP.NET Reference, Tailwind Reference, TypeScript Reference, Vue.js Reference, **Vaadin
  Reference (currently last)**. All follow one structural pattern this plan reuses:
  - A `modules/ROOT/partials/<name>-disclaimer.adoc` (`[IMPORTANT]` / `====` admonition) included via
    `include::partial$<name>-disclaimer.adoc[]` immediately after each page's `= Title` / `:description:` /
    `:keywords:` header block. [modules/ROOT/partials/typescript-disclaimer.adoc](modules/ROOT/partials/typescript-disclaimer.adoc)
    is the exact tone/shape to copy: the official site is the reference the pages are written and verified
    against; the book(s) are named **only as bibliography entries**, not the primary source, and are noted to
    predate the current release line.
  - One `.adoc` page per topic, each with its own `:description:` / `:keywords:` attributes and the disclaimer
    include right after the header, then a one/two-sentence lead paragraph. Body uses `[source,python]` /
    `[source,console]` / `[source,bash]` / `[source,text]` fenced by `----`, `[mermaid]` blocks for diagrams, and
    `image::<name>.svg[alt,width=…,role=text-center]` for figures (see
    `modules/ROOT/pages/web/typescript/unions-and-narrowing.adoc` and
    `modules/ROOT/pages/web/vue/reactivity-fundamentals.adoc` for the exact idiom).
  - A section `index.adoc` opening with the disclaimer and a short intro, then a grouped `== What's covered`
    section `xref:`-linking every page with a one-line blurb, ending in a `== Bibliography` section (see
    [modules/ROOT/pages/web/typescript/index.adoc](modules/ROOT/pages/web/typescript/index.adoc) for the exact
    format).
  - A `cheat-sheet.adoc` including the disclaimer, a short description, grouped `xref:` links back to every
    detail page, and `xref:attachment$<name>-cheat-sheet.pdf[Download the … Cheat Sheet (PDF)]`, with the actual
    PDF under `modules/ROOT/attachments/` (existing: `html-css-`, `sass-`, `javascript-`, `bootstrap-`,
    `jquery-`, `react-`, `angular-`, `aspnet-`, `tailwind-`, `typescript-`, `vue-`, `vaadin-`, `sql-cheat-
    sheet.pdf`). **No HTML source for these PDFs is kept in the repo** — only the rendered PDF is committed.
  - [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc) lists `Web Development` (`**` under `* Guides & References`)
    with each subsection (`***`) and its own detail pages (`****`). The **Vaadin block is currently last**,
    ending the file (line 343 `*** xref:web/vaadin/index.adoc[Vaadin Reference]` through line 370
    `**** xref:web/vaadin/cheat-sheet.adoc[Cheat Sheet (PDF)]`, 371 lines total).
  - The root [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc)'s `== Guides & References` section
    lists Web Development with its subsections nested one level under it (`**`), Vaadin Reference last (lines
    130–134).
- **Antora extensions already wired** in [antora-playbook.yml](antora-playbook.yml): `@antora/lunr-extension`
  (search), `@sntke/antora-mermaid-extension` (`[mermaid]` blocks — the only diagram mechanism used in this
  repo), `@djencks/asciidoctor-mathjax` (unused here). No `source-highlighter` attribute is set; existing pages
  use `[source,html]` / `[source,css]` / `[source,javascript]` / `[source,typescript]` and render fine (cosmetic
  class only, no highlighting engine to break). `modules/ROOT/images/` holds the existing hand-authored `*.svg`
  figures (`typescript-*.svg`, `vue-*.svg`, `vaadin-*.svg`, `box-model.svg`, …); `modules/ROOT/attachments/`
  holds the cheat-sheet PDFs.
- **AsciiDoc gotcha** (carried over from every prior section, e.g. `.archive/implementation_plan_35.md`): inline
  `{foo}` text *outside* `[source]` blocks is parsed as an Antora attribute reference and emits a "skipping
  reference to missing attribute" build **warning**. This is acute for Python prose, which is full of dict/set
  literal braces (`\{"key": "value"}`), f-string interpolation (`f"\{name}"`), `.format(**kwargs)` examples, and
  set/dict comprehension bodies written inline. **Escape any literal braces in prose as `\{ … }`**. Inside
  `[source,…]` blocks **no escaping is needed**. Angle brackets and square brackets in prose (`list[int]`,
  `dict[str, int]`, type-hint generics) are fine unescaped. The final build (last task) must come back with
  **zero** such warnings.
- **`[source]` language tokens**: `[source,python]` for all Python code (scripts, REPL-adjacent snippets written
  as plain code, pytest test files), `[source,console]` for interactive REPL transcripts (`>>>` prompts) and
  command output, `[source,bash]` for shell commands (`pip install`, `python -m venv`, `pytest -v`), `[source,text]`
  for plain-text layouts (e.g. a directory tree). If a token ever produces a build issue, fall back progressively
  (`python` → `py` → `text`; `console` → `text`) — verified by the final build task.
- **New file map** this plan creates under `modules/ROOT/pages/web/python/` (all `.adoc`, 26 files):
  `getting-started.adoc`, `lexical-structure-and-style.adoc`, `variables-and-dynamic-typing.adoc`, `numbers.adoc`,
  `strings-and-text.adoc`, `collections.adoc`, `control-flow.adoc`, `functions.adoc`,
  `iterators-generators-comprehensions.adoc`, `modules-and-packages.adoc`, `files-and-context-managers.adoc`,
  `exceptions.adoc`, `classes-and-objects.adoc`, `operator-overloading.adoc`, `advanced-oop-design.adoc`,
  `managed-attributes.adoc`, `decorators-and-metaclasses.adoc`, `type-hints.adoc`, `dataclasses-and-enums.adoc`,
  `standard-library-tour.adoc`, `concurrency-and-async.adoc`, `virtual-environments-and-packaging.adoc`,
  `debugging-and-tooling.adoc`, `testing.adoc`, `cheat-sheet.adoc`, `index.adoc`. Plus
  `modules/ROOT/partials/python-disclaimer.adoc`, six hand-authored SVGs under `modules/ROOT/images/`
  (`python-mutable-vs-immutable.svg`, `python-legb-scope.svg`, `python-mro-diagram.svg`,
  `python-decorator-call-chain.svg`, `python-context-manager-protocol.svg`, `python-sync-vs-async-timeline.svg`),
  `modules/ROOT/attachments/python-cheat-sheet.pdf`, and edits to
  [modules/ROOT/pages/web/index.adoc](modules/ROOT/pages/web/index.adoc),
  [modules/ROOT/nav.adoc](modules/ROOT/nav.adoc), and
  [modules/ROOT/pages/index.adoc](modules/ROOT/pages/index.adoc).

## Conventions every content page in this plan must follow

- Standard header block: `= <Title>`, then `:description:` (one sentence) and `:keywords:` (comma list), then a
  blank line, then `include::partial$python-disclaimer.adoc[]`, then a blank line, then a one/two-sentence lead
  paragraph — identical placement to `include::partial$typescript-disclaimer.adoc[]` in
  `modules/ROOT/pages/web/typescript/index.adoc`.
- **Brief and concise** prose. **Every concept gets at least one runnable code example** — `[source,python]` /
  `[source,console]` / `[source,bash]` / `[source,text]` as appropriate.
- **Every concept links to the specific https://docs.python.org/3/… page** for it (inline
  `https://docs.python.org/3/…[link text]`), not just a generic "see the Python docs" — except the testing page,
  which links primarily to https://docs.pytest.org/, and the style page, which links to
  https://peps.python.org/pep-0008/.
- Escape literal `\{ … }` braces in all prose outside `[source]` blocks (see the AsciiDoc gotcha above).
- Prefer **modern Python** everywhere: f-strings, `pathlib.Path`, type hints where they clarify intent, `match`
  where it fits, `async`/`await` documented as current. Where a book uses an older pattern, document the current
  one and note the change is because the book predates it.
- Diagrams via `[mermaid]` blocks; figures via `image::python-*.svg[alt,width=…,role=text-center]` with the SVG
  hand-authored under `modules/ROOT/images/`.
- The full per-page concept checklist and official-link list is in issue #53's "Proposed page structure" section
  — each task below references its issue page and implements every bullet it lists for that page, expanded with
  concrete sub-topics grounded in the three books' actual tables of contents and the official docs' tutorial/
  library structure.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every Group 2–4 page includes the partial it creates).

- [x] Task 1. Create the Python disclaimer partial — `modules/ROOT/partials/python-disclaimer.adoc`
  - Created `modules/ROOT/partials/python-disclaimer.adoc`, matching the shape of `typescript-disclaimer.adoc`;
    no tests apply (static AsciiDoc content, no code-one-task skill applies).
  - [x] Task 1.1. Create `modules/ROOT/partials/python-disclaimer.adoc` as an `[IMPORTANT]` admonition
    (`[IMPORTANT]` then `====` … `====`) following the shape of
    `modules/ROOT/partials/typescript-disclaimer.adoc`. It must state:
    - this section documents **the current Python release line** as published at
      https://docs.python.org/3/[the official Python documentation], **which is the reference these pages are
      written and verified against**; no specific patch version is pinned;
    - the content was generated with the assistance of AI and should be verified against
      https://docs.python.org/3/[the official documentation] before being relied on in production;
    - *Python Programming Fundamentals*, 2nd ed. (Kent D. Lee, Springer, 2015), *Python Crash Course*, 3rd ed.
      (Eric Matthes, No Starch Press, 2023), and *Learning Python*, 4th ed. (Mark Lutz, O'Reilly, 2009) are
      **listed in this section's bibliography** and were consulted while preparing these pages — worded so it
      does **not** state or imply any book is the primary or main reference — and **all three predate the
      current release line** (in particular, *Learning Python* predates Python 3.1 and has no coverage of
      f-strings, type hints, `pathlib`, `dataclasses`, `async`/`await`, or the `match` statement), so on any
      discrepancy, or wherever a book is simply silent on a modern feature, the official documentation wins.
  - [x] Task 1.2. Confirm it is included via `include::partial$python-disclaimer.adoc[]` on every page created in
    Groups 2–4 (index and cheat sheet included), immediately after the `= Title` / `:description:` / `:keywords:`
    block and one blank line — identical syntax/placement to `include::partial$typescript-disclaimer.adoc[]` in
    `modules/ROOT/pages/web/typescript/index.adoc`. Record the exact opening shape for Groups 2–4:
    1. `= <Page Title>`
    2. `:description: <one-line description>`
    3. `:keywords: <comma-separated keywords>`
    4. one blank line
    5. `include::partial$python-disclaimer.adoc[]` (verbatim, its own line, flush left, no attributes)
    6. one blank line
    7. page body begins

### Group 2 — Content pages

**Parallelizable: yes** — 24 independent pages (Tasks 2–25). Each includes the Group 1 disclaimer partial and may
cross-reference the other new pages in this plan (cross-links between new pages are fine to write now — every
target is listed in this plan and validated together in the final build task), but **none depends on another new
page's content**. Each page follows the "Conventions" section above. Six tasks also create a hand-authored SVG as
a sub-task.

- [x] Task 2. Create `modules/ROOT/pages/web/python/getting-started.adoc` (issue #53 page 1; book1 §1.1–1.20;
  - Created `modules/ROOT/pages/web/python/getting-started.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  book2 ch.1; book3 ch.1–3)
  - [x] Task 2.1. Installing Python from https://www.python.org/downloads/[python.org] on Windows/macOS/Linux;
    checking the installed version (`python --version` / `python3 --version`). `[source,bash]` + `[source,console]`.
  - [x] Task 2.2. The interpreter: script mode vs. **interactive mode** (the `>>>` REPL), running a file
    (`python hello.py`), the shebang line and Unix executable scripts. `[source,bash]` + `[source,console]`.
  - [x] Task 2.3. Editors and IDEs (VS Code, PyCharm, IDLE) — brief, tool-agnostic; writing and running a first
    `hello_world.py`. `[source,python]`.
  - [x] Task 2.4. A `[mermaid]` flowchart of the execution model: source `.py` → compile to bytecode (cached in
    `__pycache__/*.pyc`) → run on the Python Virtual Machine (PVM). Links:
    https://docs.python.org/3/tutorial/interpreter.html,
    https://docs.python.org/3/tutorial/appetite.html,
    https://www.python.org/downloads/.

- [x] Task 3. Create `modules/ROOT/pages/web/python/lexical-structure-and-style.adoc` (issue #53 page 2; book3
  - Created `modules/ROOT/pages/web/python/lexical-structure-and-style.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.10, ch.12; book2's "The Zen of Python"; PEP 8)
  - [x] Task 3.1. **Indentation-based blocks** — why Python removed braces, the indentation rule, mixing
    tabs/spaces as an error. `[source,python]`.
  - [x] Task 3.2. Comments (`#`), statement separators (newline, `;`, line continuation with `\` and implicit
    continuation inside brackets), multiple statements. `[source,python]`.
  - [x] Task 3.3. **PEP 8**: naming conventions (`snake_case`, `PascalCase`, `UPPER_CASE` constants), line length,
    whitespace rules, import ordering — brief, links to the PEP itself rather than restating it in full.
    `[source,python]`.
  - [x] Task 3.4. `import this` and **the Zen of Python** as a design-philosophy summary. `[source,console]`.
    Links: https://peps.python.org/pep-0008/, https://docs.python.org/3/reference/lexical_analysis.html,
    https://docs.python.org/3/tutorial/controlflow.html#intermezzo-coding-style.

- [x] Task 4. Create `modules/ROOT/pages/web/python/variables-and-dynamic-typing.adoc` (issue #53 page 3; book3
  - Created `modules/ROOT/pages/web/python/variables-and-dynamic-typing.adoc, images/python-mutable-vs-immutable.svg` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.4, ch.6; book2 ch.2)
  - [x] Task 4.1. Variables as **names bound to objects** (not typed storage slots); assignment as reference
    binding, not copying. `[source,python]`.
  - [x] Task 4.2. **Mutability**: rebinding a name (`x = x + 1`) vs. mutating an object in place
    (`lst.append(1)`); the classic mutable-default-argument pitfall as a preview (detailed on the functions
    page). `[source,python]`.
  - [x] Task 4.3. **Shared references** and `is` vs. `==`; `id()`; small-int/string interning as an
    implementation detail, not a guarantee. `[source,python]`.
  - [x] Task 4.4. The built-in type hierarchy overview (numbers, sequences, mappings, sets, `None`, callables,
    classes) as a map for the rest of the section. `[source,python]`.
  - [x] Task 4.5. Embed `image::python-mutable-vs-immutable.svg[…]` (Task 4.6). Links:
    https://docs.python.org/3/reference/datamodel.html,
    https://docs.python.org/3/library/stdtypes.html,
    https://docs.python.org/3/reference/expressions.html#is-not.
  - [x] Task 4.6. Create `modules/ROOT/images/python-mutable-vs-immutable.svg` — hand-authored: two side-by-side
    scenarios, each a name box with an arrow to an object box; scenario A rebinds an `int` (arrow moves to a new
    object, old object unreferenced); scenario B mutates a `list` in place (arrow stays on the same object, whose
    contents change).

- [x] Task 5. Create `modules/ROOT/pages/web/python/numbers.adoc` (issue #53 page 4; book3 ch.5; book1 Appendices
  - Created `modules/ROOT/pages/web/python/numbers.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  A–B; book2 ch.2)
  - [x] Task 5.1. `int` (arbitrary precision), `float` (IEEE 754 double, representation-error caveat),
    `complex`; numeric literals (underscores, hex/octal/binary). `[source,python]` + `[source,console]`.
  - [x] Task 5.2. Operators: arithmetic, `//` floor division vs. `/` true division, `%`, `**`; comparison
    chaining (`0 < x < 10`); augmented assignment. `[source,python]`.
  - [x] Task 5.3. `decimal.Decimal` and `fractions.Fraction` for exact arithmetic; `bool` as an `int` subclass.
    `[source,python]`.
  - [x] Task 5.4. Built-in numeric tools: `abs()`, `round()` (banker's rounding), `pow()`, the `math` module
    preview (detailed on the stdlib-tour page). `[source,python]`. Links:
    https://docs.python.org/3/tutorial/introduction.html#numbers,
    https://docs.python.org/3/library/stdtypes.html#numeric-types-int-float-complex,
    https://docs.python.org/3/library/decimal.html, https://docs.python.org/3/library/fractions.html,
    https://docs.python.org/3/tutorial/floatingpoint.html.

- [x] Task 6. Create `modules/ROOT/pages/web/python/strings-and-text.adoc` (issue #53 page 5; book3 ch.7, ch.36;
  - Created `modules/ROOT/pages/web/python/strings-and-text.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  book1 Appendix C; book2 ch.2)
  - [x] Task 6.1. String literals (single/double/triple-quoted, raw strings, escape sequences); strings as
    immutable sequences; indexing and slicing. `[source,python]`.
  - [x] Task 6.2. Common string methods (`.strip()`, `.split()`/`.join()`, `.replace()`, case conversion,
    `.startswith()`/`.endswith()`). `[source,python]`.
  - [x] Task 6.3. Formatting: **f-strings** (the modern default, including `=` debugging and format specs),
    `.format()`, and legacy `%`-formatting shown only for reading older code. `[source,python]`.
  - [x] Task 6.4. Unicode fundamentals: `str` (text) vs. `bytes` (binary), encoding/decoding (`.encode()` /
    `.decode()`, UTF-8 by default), why Python 3 unified text handling. `[source,python]` + `[source,console]`.
    Links: https://docs.python.org/3/tutorial/introduction.html#strings,
    https://docs.python.org/3/library/stdtypes.html#text-sequence-type-str,
    https://docs.python.org/3/library/string.html#format-string-syntax,
    https://docs.python.org/3/howto/unicode.html.

- [x] Task 7. Create `modules/ROOT/pages/web/python/collections.adoc` (issue #53 page 6; book3 ch.8–9; book1
  - Created `modules/ROOT/pages/web/python/collections.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  §3.3 + Appendices D–F; book2 ch.3–4, ch.6; tutorial §5)
  - [x] Task 7.1. **Lists**: creation, indexing/slicing, mutating methods (`.append()`, `.insert()`, `.sort()`
    vs. `sorted()`), list comprehensions. `[source,python]`.
  - [x] Task 7.2. **Tuples**: immutability, packing/unpacking, when to prefer a tuple over a list; `del`.
    `[source,python]`.
  - [x] Task 7.3. **Sets**: uniqueness, set operations (union/intersection/difference), set comprehensions.
    `[source,python]`.
  - [x] Task 7.4. **Dictionaries**: creation, `.get()`, iterating keys/values/items, dict comprehensions,
    insertion-order guarantee (3.7+), merging with `|`. `[source,python]`.
  - [x] Task 7.5. Choosing between them; comparing sequences and other types. `[source,python]`. Links:
    https://docs.python.org/3/tutorial/datastructures.html,
    https://docs.python.org/3/library/stdtypes.html#sequence-types-list-tuple-range,
    https://docs.python.org/3/library/stdtypes.html#set-types-set-frozenset,
    https://docs.python.org/3/library/stdtypes.html#mapping-types-dict.

- [x] Task 8. Create `modules/ROOT/pages/web/python/control-flow.adoc` (issue #53 page 7; book3 ch.12–13; book1
  - Created `modules/ROOT/pages/web/python/control-flow.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.2–3; book2 ch.5, ch.7; tutorial §4)
  - [x] Task 8.1. `if`/`elif`/`else`; truthiness rules (what counts as falsy). `[source,python]`.
  - [x] Task 8.2. `while` and `for` loops; `range()`; `break`/`continue`/`pass`; the loop `else` clause.
    `[source,python]`.
  - [x] Task 8.3. The **`match` statement** (3.10+): literal, capture, wildcard, and class/sequence/mapping
    patterns, guards. `[source,python]`.
  - [x] Task 8.4. A `[mermaid]` decision flowchart contrasting an `if`/`elif`/`else` chain with an equivalent
    `match` statement. Links: https://docs.python.org/3/tutorial/controlflow.html,
    https://docs.python.org/3/reference/compound_stmts.html#the-match-statement,
    https://docs.python.org/3/tutorial/datastructures.html#more-on-conditions.

- [x] Task 9. Create `modules/ROOT/pages/web/python/functions.adoc` (issue #53 page 8; book3 ch.16–19; book1
  - Created `modules/ROOT/pages/web/python/functions.adoc, images/python-legb-scope.svg` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.5; book2 ch.8)
  - [x] Task 9.1. `def`, parameters and return values, docstrings, function annotations. `[source,python]`.
  - [x] Task 9.2. Positional, keyword, default, `*args`, `**kwargs` parameters; positional-only (`/`) and
    keyword-only (`*`) markers; unpacking arguments at the call site. `[source,python]`.
  - [x] Task 9.3. **Scope and the LEGB rule** (Local, Enclosing, Global, Built-in); `global` and `nonlocal`.
    `[source,python]`.
  - [x] Task 9.4. `lambda` expressions and when to prefer a named function; the mutable-default-argument pitfall
    resolved (`def f(x, items=None): items = items if items is not None else []`). `[source,python]`.
  - [x] Task 9.5. Embed `image::python-legb-scope.svg[…]` (Task 9.6). Links:
    https://docs.python.org/3/tutorial/controlflow.html#defining-functions,
    https://docs.python.org/3/tutorial/controlflow.html#more-on-defining-functions,
    https://docs.python.org/3/tutorial/classes.html#python-scopes-and-namespaces.
  - [x] Task 9.6. Create `modules/ROOT/images/python-legb-scope.svg` — hand-authored: four nested rectangles
    labelled Local, Enclosing, Global, Built-in (outermost), with a name-lookup arrow entering at Local and
    stopping at the first box that defines the name.

- [x] Task 10. Create `modules/ROOT/pages/web/python/iterators-generators-comprehensions.adoc` (issue #53 page 9;
  - Created `modules/ROOT/pages/web/python/iterators-generators-comprehensions.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  book3 ch.14, ch.20; tutorial §9.8–9.10)
  - [x] Task 10.1. The **iterator protocol**: `__iter__`/`__next__`, manual iteration with `iter()`/`next()`,
    `StopIteration`. `[source,python]`.
  - [x] Task 10.2. **Generator functions** (`yield`) and **generator expressions**; why generators are
    memory-efficient (lazy evaluation). `[source,python]`.
  - [x] Task 10.3. List/set/dict comprehensions revisited as syntactic sugar over iteration; nested
    comprehensions; when a generator expression is preferable to a list comprehension. `[source,python]`.
  - [x] Task 10.4. A `[mermaid]` state diagram: `iter(obj)` → repeated `next()` calls yielding values → raises
    `StopIteration` → loop ends. Links: https://docs.python.org/3/tutorial/classes.html#iterators,
    https://docs.python.org/3/tutorial/classes.html#generators,
    https://docs.python.org/3/reference/expressions.html#generator-expressions.

- [x] Task 11. Create `modules/ROOT/pages/web/python/modules-and-packages.adoc` (issue #53 page 10; book3
  - Created `modules/ROOT/pages/web/python/modules-and-packages.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.21–24; tutorial §6)
  - [x] Task 11.1. `import`, `from … import …`, `import … as …`; modules as objects with attributes.
    `[source,python]`.
  - [x] Task 11.2. **`__name__ == "__main__"`**: the pattern for dual-usage (importable module + runnable
    script). `[source,python]`.
  - [x] Task 11.3. **Packages**: `__init__.py`, subpackages, relative imports (`from . import sibling`).
    `[source,python]` + `[source,text]` (directory tree).
  - [x] Task 11.4. The **module search path** (`sys.path`), how `import` resolves a name (find → compile if
    needed → run once and cache), avoiding circular imports. `[source,python]` + `[source,console]`.
  - [x] Task 11.5. A `[mermaid]` flowchart: `import name` → search `sys.path` → found? → compile to `.pyc` if
    stale → execute module body once → bind name in caller's namespace. Links:
    https://docs.python.org/3/tutorial/modules.html,
    https://docs.python.org/3/tutorial/modules.html#packages,
    https://docs.python.org/3/reference/import.html.

- [x] Task 12. Create `modules/ROOT/pages/web/python/files-and-context-managers.adoc` (issue #53 page 11; book3
  - Created `modules/ROOT/pages/web/python/files-and-context-managers.adoc, images/python-context-manager-protocol.svg` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.9; book2 ch.10; tutorial §7)
  - [x] Task 12.1. Opening files with `open()` (modes `r`/`w`/`a`/`b`), reading (`.read()`, `.readline()`,
    iterating a file object), writing, always closing. `[source,python]`.
  - [x] Task 12.2. **The `with` statement** as the idiomatic replacement for manual `try`/`finally` close.
    `[source,python]`.
  - [x] Task 12.3. **`pathlib.Path`** as the modern alternative to `os.path` string manipulation — joining paths,
    checking existence, reading/writing text in one call (`Path.read_text()`). `[source,python]`.
  - [x] Task 12.4. Embed `image::python-context-manager-protocol.svg[…]` (Task 12.5) explaining `__enter__`/
    `__exit__` generally (writing a custom context manager is covered on the operator-overloading page). Links:
    https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files,
    https://docs.python.org/3/reference/compound_stmts.html#the-with-statement,
    https://docs.python.org/3/library/pathlib.html.
  - [x] Task 12.5. Create `modules/ROOT/images/python-context-manager-protocol.svg` — hand-authored: a `with
    Ctx() as x:` block with numbered arrows showing `__enter__()` called first (its return bound to `x`), the
    block body running, then `__exit__()` called on exit — including a branch for the exception path where
    `__exit__` returning `True` swallows the exception.

- [x] Task 13. Create `modules/ROOT/pages/web/python/exceptions.adoc` (issue #53 page 12; book3 ch.32–35; book2
  - Created `modules/ROOT/pages/web/python/exceptions.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.10; tutorial §8)
  - [x] Task 13.1. `try`/`except`/`else`/`finally`; catching specific exception types vs. bare `except:` (why to
    avoid it). `[source,python]`.
  - [x] Task 13.2. `raise`, re-raising, **exception chaining** (`raise X from Y`). `[source,python]`.
  - [x] Task 13.3. **Custom exception classes** (subclassing `Exception`), building a small exception hierarchy.
    `[source,python]`.
  - [x] Task 13.4. **Exception groups** (3.11+, `except*`) for handling multiple unrelated exceptions at once;
    `assert` statements. `[source,python]`.
  - [x] Task 13.5. A `[mermaid]` control-flow diagram of `try`/`except`/`else`/`finally` execution order,
    including the exception and no-exception paths. Links:
    https://docs.python.org/3/tutorial/errors.html,
    https://docs.python.org/3/tutorial/errors.html#raising-and-handling-multiple-unrelated-exceptions,
    https://docs.python.org/3/library/exceptions.html.

- [x] Task 14. Create `modules/ROOT/pages/web/python/classes-and-objects.adoc` (issue #53 page 13; book3
  - Created `modules/ROOT/pages/web/python/classes-and-objects.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.25–27; book1 ch.7; book2 ch.9)
  - [x] Task 14.1. `class` basics, `__init__`, instance vs. class attributes, methods and `self`.
    `[source,python]`.
  - [x] Task 14.2. Creating instances; instance methods vs. `@staticmethod`/`@classmethod`. `[source,python]`.
  - [x] Task 14.3. **Inheritance**: `class Child(Parent)`, overriding methods, `super()`. `[source,python]`.
  - [x] Task 14.4. `__repr__`/`__str__` for basic display (full dunder-method treatment on the next page).
    `[source,python]`. Links: https://docs.python.org/3/tutorial/classes.html,
    https://docs.python.org/3/tutorial/classes.html#inheritance,
    https://docs.python.org/3/reference/datamodel.html#basic-customization.

- [x] Task 15. Create `modules/ROOT/pages/web/python/operator-overloading.adoc` (issue #53 page 14; book3 ch.29)
  - Created `modules/ROOT/pages/web/python/operator-overloading.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  - [x] Task 15.1. `__init__`/`__repr__`/`__str__`/`__eq__`/`__lt__` and friends (rich comparisons).
    `[source,python]`.
  - [x] Task 15.2. `__len__`, `__getitem__`/`__setitem__` (indexing and slicing support), `__iter__`/`__next__`
    for a custom iterable (ties back to the iterators page). `[source,python]`.
  - [x] Task 15.3. `__call__` (making instances callable), `__enter__`/`__exit__` (writing a custom context
    manager, ties back to `files-and-context-managers.adoc`). `[source,python]`.
  - [x] Task 15.4. `__add__`/`__radd__`/`__iadd__` and the general pattern for arithmetic operator overloading.
    `[source,python]`. Links: https://docs.python.org/3/reference/datamodel.html#special-method-names,
    https://docs.python.org/3/reference/datamodel.html#emulating-container-types,
    https://docs.python.org/3/library/functools.html#functools.total_ordering.

- [x] Task 16. Create `modules/ROOT/pages/web/python/advanced-oop-design.adoc` (issue #53 page 15; book3 ch.30)
  - Created `modules/ROOT/pages/web/python/advanced-oop-design.adoc, images/python-mro-diagram.svg` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  - [x] Task 16.1. **Composition ("has-a") vs. inheritance ("is-a")**: when to prefer one over the other, with a
    small worked contrast. `[source,python]`.
  - [x] Task 16.2. **Mixins** and **multiple inheritance**; the **Method Resolution Order (MRO)** via
    `Cls.__mro__` / C3 linearization, `super()` in a multi-parent hierarchy. `[source,python]` + `[source,console]`.
  - [x] Task 16.3. **Delegation** ("wrapper" objects forwarding to an internal instance) as an alternative to
    inheritance. `[source,python]`.
  - [x] Task 16.4. Embed `image::python-mro-diagram.svg[…]` (Task 16.5). Links:
    https://docs.python.org/3/tutorial/classes.html#multiple-inheritance,
    https://docs.python.org/3/library/functions.html#super,
    https://docs.python.org/3/howto/mro.html.
  - [x] Task 16.5. Create `modules/ROOT/images/python-mro-diagram.svg` — hand-authored: a small diamond
    inheritance graph (`B` and `C` both extend `A`; `D` extends both `B` and `C`), with the resulting
    `D.__mro__` order `D → B → C → A → object` listed alongside as a numbered list.

- [x] Task 17. Create `modules/ROOT/pages/web/python/managed-attributes.adoc` (issue #53 page 16; book3 ch.37)
  - Created `modules/ROOT/pages/web/python/managed-attributes.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  - [x] Task 17.1. **`@property`** for computed/validated attributes; property setters and deleters.
    `[source,python]`.
  - [x] Task 17.2. **Descriptors**: the descriptor protocol (`__get__`/`__set__`/`__delete__`) and how `@property`
    is implemented on top of it. `[source,python]`.
  - [x] Task 17.3. `__getattr__` vs. `__getattribute__` — when each is invoked, and a validation example using
    each approach. `[source,python]`. Links:
    https://docs.python.org/3/library/functions.html#property,
    https://docs.python.org/3/howto/descriptor.html,
    https://docs.python.org/3/reference/datamodel.html#object.__getattr__.

- [x] Task 18. Create `modules/ROOT/pages/web/python/decorators-and-metaclasses.adoc` (issue #53 page 17; book3
  - Created `modules/ROOT/pages/web/python/decorators-and-metaclasses.adoc, images/python-decorator-call-chain.svg` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  ch.38–39)
  - [x] Task 18.1. **Function decorators**: what a decorator is (a callable wrapping a callable), `@decorator`
    syntax, preserving metadata with `functools.wraps`. `[source,python]`.
  - [x] Task 18.2. Decorators with arguments (a decorator factory); stacking multiple decorators; class
    decorators. `[source,python]`.
  - [x] Task 18.3. **Metaclasses**: `type` as the metaclass of `class`, `class Meta(type)`, `class C(metaclass=Meta)`
    — brief, with a "you rarely need this" framing and a pointer to class decorators as the simpler alternative
    for most use cases. `[source,python]`.
  - [x] Task 18.4. Embed `image::python-decorator-call-chain.svg[…]` (Task 18.5). Links:
    https://docs.python.org/3/glossary.html#term-decorator,
    https://docs.python.org/3/library/functools.html#functools.wraps,
    https://docs.python.org/3/reference/datamodel.html#metaclasses.
  - [x] Task 18.5. Create `modules/ROOT/images/python-decorator-call-chain.svg` — hand-authored: `@decorator` on
    `def func` shown wrapping `func` into `wrapper`, then a call-time sequence
    `caller → wrapper() → func() → back to wrapper → back to caller`.

- [x] Task 19. Create `modules/ROOT/pages/web/python/type-hints.adoc` (issue #53 page 18; sourced from
  - Created `modules/ROOT/pages/web/python/type-hints.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  https://docs.python.org/3/library/typing.html — none of the three books cover this)
  - [x] Task 19.1. Why type hints (documentation + tooling, not runtime enforcement); basic annotations
    (`x: int`, function signatures with parameter/return types). `[source,python]`.
  - [x] Task 19.2. Generics: `list[int]`, `dict[str, int]`, `X | None` (modern union syntax, 3.10+),
    `Optional[X]`/`Union[X, Y]` for older code. `[source,python]`.
  - [x] Task 19.3. `TypeVar`/generic functions and classes; `Protocol` for structural typing;
    `Callable[[int], str]`. `[source,python]`.
  - [x] Task 19.4. Static checkers (mypy, pyright) as opt-in tools that read hints — hints are ignored at
    runtime. `[source,bash]`. Links: https://docs.python.org/3/library/typing.html,
    https://docs.python.org/3/howto/annotations.html,
    https://peps.python.org/pep-0484/.

- [x] Task 20. Create `modules/ROOT/pages/web/python/dataclasses-and-enums.adoc` (issue #53 page 19; sourced from
  - Created `modules/ROOT/pages/web/python/dataclasses-and-enums.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  https://docs.python.org/3/library/dataclasses.html and https://docs.python.org/3/library/enum.html — none of
  the three books cover `dataclasses`; book3 predates it)
  - [x] Task 20.1. **`@dataclass`**: auto-generated `__init__`/`__repr__`/`__eq__`, field defaults and
    `default_factory`, `frozen=True` for immutability. `[source,python]`.
  - [x] Task 20.2. Comparing a `@dataclass` to a hand-written class and to a plain `dict`/`tuple` — when each
    fits. `[source,python]`.
  - [x] Task 20.3. **`enum.Enum`**: members, auto values (`auto()`), `IntEnum`, `Flag`/`IntFlag` for bitwise
    combinations, iterating a member's `.name`/`.value`. `[source,python]`. Links:
    https://docs.python.org/3/library/dataclasses.html, https://docs.python.org/3/library/enum.html.

- [x] Task 21. Create `modules/ROOT/pages/web/python/standard-library-tour.adoc` (issue #53 page 20; book3 ch.36
  - Created `modules/ROOT/pages/web/python/standard-library-tour.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  §re/struct/pickle only; tutorial §10–11; library reference)
  - [x] Task 21.1. **Filesystem/OS**: `os`, `sys` (argv, exit codes), `pathlib` (cross-reference
    `files-and-context-managers.adoc`), `glob`, `shutil`. `[source,python]`.
  - [x] Task 21.2. **Data**: `datetime`, `json`, `re` (pattern matching essentials), `collections`
    (`Counter`/`defaultdict`/`namedtuple`), `itertools`, `functools` (`reduce`, `lru_cache`, `partial`).
    `[source,python]`.
  - [x] Task 21.3. **Math & random**: `math`, `random`, `statistics`. `[source,python]`.
  - [x] Task 21.4. **CLI & observability**: `argparse` for command-line interfaces, `logging` (levels, a basic
    config) as the alternative to `print()`-debugging. `[source,python]`. Links:
    https://docs.python.org/3/tutorial/stdlib.html, https://docs.python.org/3/tutorial/stdlib2.html,
    https://docs.python.org/3/library/index.html, https://docs.python.org/3/library/argparse.html,
    https://docs.python.org/3/library/logging.html.

- [x] Task 22. Create `modules/ROOT/pages/web/python/concurrency-and-async.adoc` (issue #53 page 21; sourced from
  - Created `modules/ROOT/pages/web/python/concurrency-and-async.adoc, images/python-sync-vs-async-timeline.svg` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  https://docs.python.org/3/library/asyncio.html, threading, multiprocessing, concurrent.futures — none of the
  three books cover `async`/`await`; book3 predates it entirely)
  - [x] Task 22.1. **`threading`**: when threads help (I/O-bound work) and the GIL's effect on CPU-bound code; a
    minimal `Thread` example. `[source,python]`.
  - [x] Task 22.2. **`multiprocessing`** for CPU-bound parallelism; `concurrent.futures`
    (`ThreadPoolExecutor`/`ProcessPoolExecutor`) as the higher-level API for both. `[source,python]`.
  - [x] Task 22.3. **`asyncio`**: `async def`, `await`, running with `asyncio.run()`, concurrent tasks with
    `asyncio.gather()`/`TaskGroup`; when async fits (I/O-bound, many concurrent operations) vs. threads/processes.
    `[source,python]`.
  - [x] Task 22.4. Embed `image::python-sync-vs-async-timeline.svg[…]` (Task 22.5). Links:
    https://docs.python.org/3/library/threading.html, https://docs.python.org/3/library/multiprocessing.html,
    https://docs.python.org/3/library/concurrent.futures.html, https://docs.python.org/3/library/asyncio.html,
    https://docs.python.org/3/library/asyncio-task.html.
  - [x] Task 22.5. Create `modules/ROOT/images/python-sync-vs-async-timeline.svg` — hand-authored: two horizontal
    timelines; the top one shows three blocking synchronous calls running end-to-end back-to-back; the bottom
    one shows the same three `async`/`await` tasks interleaved (cooperatively yielding) on a single thread,
    finishing sooner overall.

- [x] Task 23. Create `modules/ROOT/pages/web/python/virtual-environments-and-packaging.adoc` (issue #53 page 22;
  - Created `modules/ROOT/pages/web/python/virtual-environments-and-packaging.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  tutorial §12; book2 Appendix A)
  - [x] Task 23.1. Why virtual environments (isolating project dependencies); creating and activating one with
    **`venv`** (`python -m venv .venv`, activation per OS). `[source,bash]`.
  - [x] Task 23.2. **`pip`**: installing/uninstalling packages, `pip freeze`, `requirements.txt`. `[source,bash]`
    + `[source,text]`.
  - [x] Task 23.3. **PyPI** and package discovery; a brief intro to `pyproject.toml` as the modern project-
    metadata/build-config file (packaging.python.org), without going deep into build backends. `[source,toml]`
    (fallback `[source,text]` if the token isn't recognized). Links:
    https://docs.python.org/3/tutorial/venv.html, https://docs.python.org/3/library/venv.html,
    https://pip.pypa.io/en/stable/, https://packaging.python.org/.

- [x] Task 24. Create `modules/ROOT/pages/web/python/debugging-and-tooling.adoc` (issue #53 page 23; tutorial
  - Created `modules/ROOT/pages/web/python/debugging-and-tooling.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  §14; book3 ch.3 §IDLE, ch.15; book1 §1.2)
  - [x] Task 24.1. **`pdb`**: `breakpoint()`, stepping commands (`n`/`s`/`c`/`p`/`l`), post-mortem debugging.
    `[source,python]` + `[source,console]`.
  - [x] Task 24.2. Performance basics: **`timeit`** for micro-benchmarks, **`cProfile`** for profiling a script.
    `[source,bash]` + `[source,console]`.
  - [x] Task 24.3. Linters/formatters: **ruff**, **black**, and `flake8` as the ecosystem's common choices — one
    short example each, tool-agnostic framing (any is a reasonable choice). `[source,bash]`.
  - [x] Task 24.4. Editor tooling recap (IDLE, VS Code, PyCharm) with a pointer back to
    `xref:web/python/getting-started.adoc[]`. Links: https://docs.python.org/3/library/pdb.html,
    https://docs.python.org/3/library/timeit.html, https://docs.python.org/3/library/profile.html,
    https://docs.astral.sh/ruff/, https://black.readthedocs.io/.

- [x] Task 25. Create `modules/ROOT/pages/web/python/testing.adoc` — **Unit Testing with pytest & Mocking** (issue
  - Created `modules/ROOT/pages/web/python/testing.adoc` — content-only AsciiDoc/SVG page; no code-one-task skill applies (untagged plan, no application source code).
  #53 page 24; book2 ch.11 for basic pytest assertions only; **mocking is not covered by any of the three books**
  and the official Python docs only document the stdlib `unittest`/`unittest.mock`, not `pytest` — this page is
  required regardless per the issue and is grounded primarily in https://docs.pytest.org/)
  - [x] Task 25.1. Installing pytest (`pip install pytest`); **test discovery** conventions (`test_*.py` /
    `*_test.py` files, `test_*` functions); writing a first test with a plain `assert` (pytest's introspection
    means no special assertion methods are needed, unlike `unittest`). `[source,bash]` + `[source,python]`.
  - [x] Task 25.2. Running tests: `pytest`, `pytest -v`, selecting a file/test/`-k` expression, reading a failure
    report. `[source,bash]` + `[source,console]`.
  - [x] Task 25.3. **Fixtures**: `@pytest.fixture`, function/module/session scope, `yield`-based setup/teardown,
    fixture composition (a fixture depending on another). `[source,python]`.
  - [x] Task 25.4. **Parametrization** (`@pytest.mark.parametrize`) to run one test against many inputs; markers
    in general (`@pytest.mark.skip`, `xfail`). `[source,python]`.
  - [x] Task 25.5. **Mocking**: `unittest.mock.Mock`/`MagicMock`, `patch()` (as a decorator and a context
    manager), asserting calls (`assert_called_once_with`, `.call_args`), and `pytest`'s own `monkeypatch` fixture
    for patching attributes/environment variables — with a short note on the **mock vs. stub vs. spy**
    distinction and when to reach for each. `[source,python]`.
  - [x] Task 25.6. Organizing tests: a `tests/` directory mirroring the source layout, `conftest.py` for shared
    fixtures, `pytest.ini`/`pyproject.toml` `[tool.pytest.ini_options]` configuration. `[source,text]` +
    `[source,python]`.
  - [x] Task 25.7. A `[mermaid]` flowchart of pytest's flow: discover test files → collect test functions → for
    each test, run fixture setup (up to the `yield`) → run the test → run fixture teardown (after the `yield`) →
    report pass/fail/error. Links: https://docs.pytest.org/en/stable/,
    https://docs.pytest.org/en/stable/how-to/fixtures.html,
    https://docs.pytest.org/en/stable/how-to/parametrize.html,
    https://docs.pytest.org/en/stable/how-to/monkeypatch.html,
    https://docs.python.org/3/library/unittest.mock.html.

### Group 3 — Cheat sheet

**Parallelizable: yes** — single task (Task 26), but it must run **after** Group 2 so its `xref:` back-links
point at pages that exist and its content reflects every page's final scope.

- [x] Task 26. Create the Python cheat sheet — `modules/ROOT/pages/web/python/cheat-sheet.adoc` +
  `modules/ROOT/attachments/python-cheat-sheet.pdf`
  - Built a 4-column HTML/CSS layout in the session scratchpad, rendered via headless Chrome to a single A4-page
    PDF (verified by page-count check and a rendered PNG preview with no clipping), copied to
    `modules/ROOT/attachments/python-cheat-sheet.pdf`, and wrote `cheat-sheet.adoc` with grouped xrefs to all 24
    Group 2 pages plus the PDF download link.
  - [x] Task 26.1. Design a single-page, print-ready, colour-coded HTML/CSS layout (scratch file under the
    session scratchpad) summarising **every concept explained in this reference**: install/run one-liners (`python
    -m venv`, `pip install`, `pytest`); core types and mutability at a glance; string formatting (f-strings);
    collection literals and comprehension syntax; control flow incl. `match`; function signature forms
    (`*args`/`**kwargs`/`/`/`*`); the LEGB rule; iterator/generator syntax; import/package layout; `with`
    statement + `pathlib`; `try`/`except`/`else`/`finally`/`raise from`; class syntax + the common dunder methods
    grouped by purpose; MRO/`super()`; `@property`; decorator syntax; `type`-hint syntax cheatsheet
    (`list[int]`, `X | None`, `Callable[[int], str]`); `@dataclass` + `Enum`; a short stdlib-module index;
    `asyncio` `async`/`await` syntax; `venv`/`pip` commands; and a pytest block (fixture, parametrize, mock/patch
    syntax). Match the visual style of the existing cheat sheets (see
    `modules/ROOT/pages/web/typescript/cheat-sheet.adoc` + its PDF, and the Vue/Vaadin ones).
  - [x] Task 26.2. Render to a **single-page** PDF via headless Chrome
    (`--headless --print-to-pdf=python-cheat-sheet.pdf --no-pdf-header-footer`), move it to
    `modules/ROOT/attachments/python-cheat-sheet.pdf`, and verify it is **exactly one A4 page** (page-count check
    + a rendered PNG preview with no clipping).
  - [x] Task 26.3. Create `modules/ROOT/pages/web/python/cheat-sheet.adoc`:
    `include::partial$python-disclaimer.adoc[]`, a short description, grouped `xref:` links back to every Group 2
    page, and `xref:attachment$python-cheat-sheet.pdf[Download the Python Cheat Sheet (PDF)]`.

### Group 4 — Section index, nav/landing wiring, and final verification

**Parallelizable: no** — Task 27 (section index) must link every page from Groups 2–3; Task 28 depends on Task 27
existing and on the final page/file names; Task 29 (build) depends on every prior task having landed.

- [x] Task 27. Create `modules/ROOT/pages/web/python/index.adoc` — Python Reference landing page
  - Created `modules/ROOT/pages/web/python/index.adoc` linking all 24 Group 2 pages plus the cheat sheet under
    four readable sub-headings, and a Bibliography section. Publisher URLs (Springer/No Starch/O'Reilly) return
    an auth-wall/403 to automated fetches, as the plan itself anticipated — same accepted pattern already used
    for the TypeScript section's O'Reilly citations; URLs kept as specified.
  - [x] Task 27.1. `= Python Reference`, `:description:` / `:keywords:`,
    `include::partial$python-disclaimer.adoc[]`, a short intro (https://www.python.org/[Python] is a
    high-level, dynamically-typed, multi-paradigm language …; this section documents the current release line
    verified against docs.python.org; where to start — `getting-started.adoc` → `lexical-structure-and-style.adoc`
    → `variables-and-dynamic-typing.adoc` → `control-flow.adoc`).
  - [x] Task 27.2. A grouped `== What's covered` section `xref:`-linking every Group 2 page plus the cheat sheet,
    one-line blurb each, under readable sub-headings, e.g.: **Getting started** (getting-started); **Core
    language** (lexical-structure-and-style, variables-and-dynamic-typing, numbers, strings-and-text, collections,
    control-flow, functions, iterators-generators-comprehensions, modules-and-packages,
    files-and-context-managers, exceptions); **Object-oriented programming** (classes-and-objects,
    operator-overloading, advanced-oop-design, managed-attributes, decorators-and-metaclasses); **Modern Python &
    standard library** (type-hints, dataclasses-and-enums, standard-library-tour, concurrency-and-async,
    virtual-environments-and-packaging, debugging-and-tooling); **Testing & reference** (testing, cheat-sheet).
    Mirror `web/typescript/index.adoc` / `web/vaadin/index.adoc`.
  - [x] Task 27.3. `== Bibliography` citing, in this order (matching issue #53's Bibliography section):
    - **https://docs.python.org/3/** — the official Python 3 documentation, the source every page in this
      section is written and verified against; call out
      https://docs.python.org/3/tutorial/index.html[the tutorial],
      https://docs.python.org/3/reference/index.html[the language reference],
      https://docs.python.org/3/library/index.html[the library reference], and
      https://docs.python.org/3/howto/index.html[the HOWTOs].
    - https://www.python.org/[python.org] — downloads, community, and the documentation hub.
    - https://peps.python.org/pep-0008/[PEP 8] — the official style guide, for the lexical structure/style page.
    - https://docs.pytest.org/[pytest's official documentation] — the primary source for the unit-testing page.
    - Lee, Kent D. _Python Programming Fundamentals_, 2nd ed. Springer (Undergraduate Topics in Computer
      Science), 2015. ISBN 978-1-4471-6641-2 (print) / 978-1-4471-6642-9 (eBook). Consulted as part of the
      bibliography for this section — see
      https://link.springer.com/book/10.1007/978-1-4471-6642-9[the publisher's book page] and
      https://www.springer.com/[springer.com].
    - Matthes, Eric. _Python Crash Course_, 3rd ed. No Starch Press, 2023. ISBN-13: 978-1-7185-0270-3 (print) /
      978-1-7185-0271-0 (ebook). Consulted as part of the bibliography for this section — see
      https://nostarch.com/python-crash-course-3rd-edition[the publisher's book page] and
      https://nostarch.com/[nostarch.com].
    - Lutz, Mark. _Learning Python_, 4th ed. O'Reilly Media, 2009. ISBN 978-0-596-15806-4. Consulted as part of
      the bibliography for this section (predates Python 3.1; no coverage of f-strings, type hints, `pathlib`,
      `dataclasses`, `async`/`await`, the `match` statement, or `pytest`/mocking) — see
      https://www.oreilly.com/library/view/learning-python-4th/9780596805395/[the publisher's book page] and
      https://www.oreilly.com/[oreilly.com].
    - Verify each publisher URL still resolves while writing this page (some publisher sites block automated
      fetches during planning) and adjust if a link has moved.

- [x] Task 28. Wire the new subsection into the site navigation and the landing pages
  - Added the Python Reference bullet + updated `:description:`/`:keywords:` in `web/index.adoc`, appended the
    full nav block (index + 24 pages + cheat sheet) after Vaadin in `nav.adoc`, and added the bullet +
    `:keywords:` update to the root `pages/index.adoc`.
  - [x] Task 28.1. Update `modules/ROOT/pages/web/index.adoc`: add a twelfth bullet to the `== Sections` list,
    after the Vaadin Reference entry: `xref:web/python/index.adoc[Python Reference]` with a one-line blurb (the
    Python language itself: core types and control flow, functions and scope, OOP and decorators, modern
    features — type hints, dataclasses, `asyncio` — the standard library, and unit testing with pytest and
    mocking, plus a downloadable cheat sheet). Update the page's own `:description:` and `:keywords:` attributes
    to mention Python.
  - [x] Task 28.2. In `modules/ROOT/nav.adoc`, add a new `*** xref:web/python/index.adoc[Python Reference]` block
    under `** xref:web/index.adoc[Web Development]`, **after** the Vaadin Reference block (which currently ends
    the file, line 370 `**** xref:web/vaadin/cheat-sheet.adoc[Cheat Sheet (PDF)]`), with a `****` line per page
    in this reading order: getting-started, lexical-structure-and-style, variables-and-dynamic-typing, numbers,
    strings-and-text, collections, control-flow, functions, iterators-generators-comprehensions,
    modules-and-packages, files-and-context-managers, exceptions, classes-and-objects, operator-overloading,
    advanced-oop-design, managed-attributes, decorators-and-metaclasses, type-hints, dataclasses-and-enums,
    standard-library-tour, concurrency-and-async, virtual-environments-and-packaging, debugging-and-tooling,
    testing, cheat-sheet. Use short label text (e.g. `[Getting Started]`, `[Lexical Structure & Style]`, …,
    `[Cheat Sheet (PDF)]`).
  - [x] Task 28.3. In `modules/ROOT/pages/index.adoc`'s `== Guides & References` list, add
    `** xref:web/python/index.adoc[Python Reference] -- …` after the Vaadin Reference bullet (currently lines
    130–134) under the Web Development entry, matching the existing one-line-blurb format, and update that page's
    `:keywords:` to include Python.

- [x] Task 29. Final build verification — delegate to the `iru-gate-runner` agent so the build log stays out of
  the main context:
  ```
  Agent({
    description: "Verify Antora site build for Python Reference",
    subagent_type: "iru-gate-runner",
    prompt: "Run `npx antora antora-playbook.yml` at the repository root
      (/Users/albertoirurueta/repositories/common/docs). Report only: whether the build completed with exit
      code 0 and zero WARN/ERROR lines; any xref/AsciiDoc errors or 'skipping reference to missing attribute'
      warnings (with file/line) — pay special attention to modules/ROOT/pages/web/python/**,
      modules/ROOT/nav.adoc, modules/ROOT/pages/web/index.adoc, and modules/ROOT/pages/index.adoc; and
      confirmation that build/site/web/python/*.html (all 26 pages), the PDF attachment
      build/site/_attachments/python-cheat-sheet.pdf, the six images
      build/site/_images/python-mutable-vs-immutable.svg, python-legb-scope.svg, python-mro-diagram.svg,
      python-decorator-call-chain.svg, python-context-manager-protocol.svg and python-sync-vs-async-timeline.svg,
      every new nav entry, and all mermaid diagrams are present in build/site. Do not paste the full log."
  })
  ```
  - [x] Task 29.1. Fix any reported `xref`/AsciiDoc errors or "skipping reference to missing attribute" warnings
    (most likely an unescaped `\{ … }` in prose — a dict/set literal, an f-string interpolation shown outside a
    `[source]` block — a typo'd `xref:` target, a bad `[source,python]` token, or a missing nav entry), then
    re-run the agent until the build is clean, before checking this task off.
    - First run: exit code 0, 1 WARN (`modules/ROOT/pages/web/python/index.adoc:99`, "list item index: expected
      1, got 2015" — a bibliography line wrap starting with a bare `2015.` misread as an ordered-list marker).
      Fixed by rewording to `2015 (ISBN ... print / ... eBook)`. Re-run: exit code 0, log completely empty (zero
      WARN/ERROR). All 26 `build/site/web/python/*.html` pages, the PDF attachment, all six SVGs, every nav
      entry, and all mermaid diagrams confirmed present in `build/site`.
  - [x] Task 29.2. After the build is clean, per the repo convention (`update-docs`), confirm no other Antora
    page needs a cross-reference update for the new section — spot-check `web/typescript/index.adoc` and
    `web/index.adoc`'s intro paragraph for whether either would benefit from a "for Python, see the Python
    Reference" pointer; add it only if it fits their existing style, otherwise note the check.
    - Checked: `web/index.adoc`'s intro is one generic sentence that doesn't call out any individual section, and
      `web/typescript/index.adoc`'s only cross-links go to actual JS/TS-interop content (the React/Angular
      TypeScript pages) — no precedent exists in this repo for one language section pointing at an unrelated
      sibling section. Adding a Python pointer to either would break their existing style, so none was added.
