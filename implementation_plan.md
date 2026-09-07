# Implementation Plan: Add "Docstrings" page to the Python Reference

## Task summary

Source: GitHub issue #75

Add a new page, **"Docstrings"**, to `Guides & References → Web Development → Python Reference`, covering: how
Python docstrings work, how docstrings are used to document code (the common style conventions), and tools that
generate static documentation sites from docstrings. This is a content-only addition (new AsciiDoc page + two
nav/index wiring edits) — no application source code exists in this repository.

### Choices made on the user's behalf (confirmed in planning — challenge in review)

1. **Nav/index position**: the issue suggests "near Functions/Debugging & Tooling" without pinning an exact
   spot. `functions.adoc` already has a brief inline `=== Docstrings` subsection (one-line docstrings,
   `.__doc__`, `help()`) as part of covering `def` — the new page goes deeper (multi-line format, module/class/
   method docstrings, style conventions, doc-generation tooling) rather than duplicating that. Placed as the
   last entry of the "Modern Python & standard library" group, directly after `debugging-and-tooling.adoc`
   (topically the closest existing page — both are about the developer-tooling ecosystem around writing Python)
   and before `testing.adoc` (start of "Testing & reference"). `functions.adoc`'s existing subsection gets one
   added sentence cross-linking to the new page instead of being duplicated or removed.
2. **Docstring styles covered**: Google, NumPy, reStructuredText/Sphinx, and Epytext, per the issue body
   verbatim — Epytext included for completeness/historical context even though it's legacy (the page will say
   so), since the issue explicitly names it.
3. **Doc-generation tools covered**: Sphinx (`autodoc` + `napoleon`), `pdoc`, and MkDocs (`mkdocstrings`), per
   the issue body verbatim — these are the three concrete tools it names.
4. **Content-only, untagged task.** `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` yields
   only `java` / `dotnet` / `iru-database` — none covers AsciiDoc/Python content, so the task below carries no
   language/framework tag, matching every prior documentation-only plan in `.archive/` (most recently `_71`).
5. **Verification is the Antora build**, delegated to the `iru-gate-runner` agent (installed at
   `.claude/agents/iru-gate-runner.md`) invoking `Skill({skill: "iru-build-docs"})` — this repo has no test
   suite; a clean build with zero `xref`/AsciiDoc warnings is the only gate, per every prior plan in `.archive/`.

## Current code state

- `modules/ROOT/pages/web/python/` holds 30 pages for the Python Reference, each following one template:
  `= Title`, `:description:`, `:keywords:`, `include::partial$python-disclaimer.adoc[]`, an intro paragraph,
  then `==`/`===` sections mixing prose, `[source,python]`/`[source,bash]`/`[source,console]` blocks and links
  to `docs.python.org`, ending in a `== See Also` section cross-linking related pages (see
  `debugging-and-tooling.adoc`, `testing.adoc`).
- `modules/ROOT/partials/python-disclaimer.adoc` is the standard AI-generated-content/scope admonition every
  Python page includes as line 5.
- `modules/ROOT/nav.adoc` lines 371-398 hold the Python Reference subsection as `****` entries under
  `*** xref:web/python/index.adoc[Python Reference]`, in this order: Getting Started, Lexical Structure & Style,
  Variables & Dynamic Typing, Numbers, Strings & Text, Collections, Control Flow, Functions, Iterators/
  Generators/Comprehensions, Modules & Packages, Files & Context Managers, Exceptions, Classes & Objects,
  Operator Overloading, Advanced OOP Design, Managed Attributes, Decorators & Metaclasses, Type Hints,
  Dataclasses & Enums, Standard Library Tour, Concurrency & Async, Virtual Environments & Packaging, Debugging &
  Tooling, Testing, Cheat Sheet.
- `modules/ROOT/pages/web/python/index.adoc` mirrors that ordering under `== What's covered`, grouped into
  "Getting started" / "Core language" / "Object-oriented programming" / "Modern Python & standard library"
  (ending with the `debugging-and-tooling.adoc` bullet) / "Testing & reference" (`testing.adoc`,
  `cheat-sheet.adoc`).
- `modules/ROOT/pages/web/python/functions.adoc` lines 29-43 (`=== Docstrings`) currently the only place
  docstrings are mentioned anywhere in the section/site.
- Build/verification: `npx antora antora-playbook.yml` (no lint/test suite in this repo, per `CLAUDE.md`).

## Implementation Steps

### Group 1 (Parallelizable: no — the nav/index edits reference the new page's exact path and title, and the
functions.adoc cross-link points at the new page, so the page must be drafted first)

- [ ] Task 1. Create `modules/ROOT/pages/web/python/docstrings.adoc`
  - [ ] Task 1.1. Page header: `= Docstrings`, a `:description:` and `:keywords:` line following the sibling
    pages' style (e.g. keywords covering `docstring`, `__doc__`, `help()`, PEP 257, Google style, NumPy style,
    reStructuredText, Sphinx, autodoc, napoleon, pdoc, MkDocs, mkdocstrings), then
    `include::partial$python-disclaimer.adoc[]`, then a short intro paragraph framing the page (docstrings as
    Python's built-in mechanism for attaching documentation to code, retrievable at runtime and consumed by
    both humans and tooling).
  - [ ] Task 1.2. `== What Is a Docstring?` section: a string literal as the first statement of a module,
    class, function, or method body; PEP 257 conventions (one-line vs. multi-line form, closing `"""` on its
    own line for multi-line docstrings, no blank line before/after for one-liners); accessible via `.__doc__`
    and `help()`. Include a `[source,python]` example showing a module-level docstring, a class docstring, and
    a method docstring together, plus their `.__doc__` values. Link to
    https://peps.python.org/pep-0257/[PEP 257] and
    https://docs.python.org/3/tutorial/controlflow.html#documentation-strings[the tutorial's Documentation
    Strings section] (the same source `functions.adoc` already cites).
  - [ ] Task 1.3. `== Documenting Code with Docstrings` section: what belongs in a well-documented public
    API's docstring (summary line, parameters, return value, raised exceptions, examples) — framed as "what a
    docstring should say", not tied to one style yet. Note the doctest angle briefly: an interactive-session
    snippet inside a docstring can be run as a test via
    https://docs.python.org/3/library/doctest.html[`doctest`].
  - [ ] Task 1.4. `== Docstring Styles` section, `===` per style, each with a short `[source,python]` example
    of the same function documented in that style, so they're directly comparable:
    - `=== Google Style` — `Args:`/`Returns:`/`Raises:` sections, link to
      https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings[the Google Python Style
      Guide].
    - `=== NumPy Style` — underlined section headers (`Parameters`/`Returns`), link to
      https://numpydoc.readthedocs.io/en/latest/format.html[the numpydoc format guide].
    - `=== reStructuredText (Sphinx) Style` — `:param:`/`:type:`/`:returns:`/`:rtype:` field lists, link to
      https://www.sphinx-doc.org/en/master/[Sphinx's documentation].
    - `=== Epytext` — noted explicitly as a legacy style (predates the above three, rarely used in new code
      today, listed here for completeness/historical context since older codebases still use it), `@param`/
      `@return`-style fields.
  - [ ] Task 1.5. `== Generating Static Documentation Sites from Docstrings` section, `===` per tool, each
    covering what it consumes and a minimal setup/usage snippet:
    - `=== Sphinx` — the `autodoc` extension pulling docstrings from live code via `automodule`/`autoclass`/
      `autofunction` directives, and the `napoleon` extension translating Google/NumPy style into Sphinx's
      native reST fields; a `[source,bash]` snippet (`pip install sphinx`, `sphinx-quickstart`,
      `sphinx-build`). Link to https://www.sphinx-doc.org/en/master/[sphinx-doc.org], the
      https://www.sphinx-doc.org/en/master/usage/extensions/autodoc.html[autodoc extension] and the
      https://www.sphinx-doc.org/en/master/usage/extensions/napoleon.html[napoleon extension].
    - `=== pdoc` — a zero-config alternative that introspects a package directly and renders docstrings (any
      of the styles above render reasonably, Google/NumPy best) with no separate build-config file; a
      `[source,bash]` snippet (`pip install pdoc`, `pdoc ./my_package`). Link to
      https://pdoc.dev/[pdoc.dev].
    - `=== MkDocs with mkdocstrings` — Markdown-based site generation (`mkdocs.yml`) with the
      `mkdocstrings` plugin injecting API reference pages pulled from docstrings via a `::: module.path`
      directive; a `[source,bash]` snippet (`pip install mkdocs mkdocstrings[python]`, `mkdocs serve`). Link to
      https://www.mkdocs.org/[mkdocs.org] and https://mkdocstrings.github.io/[mkdocstrings].
    - Closing note comparing them at a glance: Sphinx is the most configurable/extension-rich and the
      long-standing default for large projects (including CPython itself); `pdoc` is the fastest path to a
      browsable API reference with no config; MkDocs + `mkdocstrings` suits projects that already publish a
      Markdown-based docs site and want API reference pages folded into it.
  - [ ] Task 1.6. `== See Also` section cross-linking `xref:web/python/functions.adoc[]` (function-level
    docstrings, already covered briefly there) and `xref:web/python/debugging-and-tooling.adoc[]` (the
    adjacent developer-tooling page).
- [ ] Task 2. Add one cross-link sentence in `modules/ROOT/pages/web/python/functions.adoc`'s existing
  `=== Docstrings` subsection (around line 43, after the `help()` example), pointing to the new page for
  multi-line docstrings, style conventions, and documentation-generation tooling — e.g. `"See
  xref:web/python/docstrings.adoc[] for multi-line docstrings, style conventions (Google, NumPy, reST,
  Epytext), and tools that generate documentation sites from docstrings."` — without duplicating the new
  page's content here.
- [ ] Task 3. Add the nav entry in `modules/ROOT/nav.adoc`: insert
  `**** xref:web/python/docstrings.adoc[Docstrings]` immediately after the
  `**** xref:web/python/debugging-and-tooling.adoc[Debugging \& Tooling]` line (around line 398) and before the
  `**** xref:web/python/testing.adoc[Testing]` line.
- [ ] Task 4. Add the index entry in `modules/ROOT/pages/web/python/index.adoc`: append one bullet to the end
  of the "Modern Python & standard library" list (after the `debugging-and-tooling.adoc` bullet, before the
  `=== Testing & reference` heading) — `* xref:web/python/docstrings.adoc[Docstrings] -- what docstrings are,
  common style conventions (Google, NumPy, reST, Epytext), and generating static documentation sites with
  Sphinx, pdoc, and MkDocs.` Also add `docstrings`/`sphinx`/`pdoc`/`mkdocstrings` to `index.adoc`'s own
  `:keywords:` line (line 3) so the section landing page's SEO metadata reflects the new page, consistent with
  how every other page's addition has kept that line current.
- [ ] Task 5. Verify the site builds cleanly. Delegate to the `iru-gate-runner` agent:
  ```
  Agent({
    description: "Build Antora site and check for errors",
    subagent_type: "iru-gate-runner",
    prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this repository's Antora site. Report back
      whether the build completed successfully and list any xref/AsciiDoc warnings or errors verbatim (in
      particular anything referencing web/python/docstrings.adoc, nav.adoc, functions.adoc, or
      web/python/index.adoc). If the build fails, report the exact error output."
  })
  ```
  Fix any reported `xref`/AsciiDoc issue (most likely a typo in one of the new `xref:` targets) and re-run
  until the build is clean.
