# Implementation Plan: Java Reference — "Javadoc" page

## Task summary

Source: GitHub issue #74

Add a new **Javadoc** page to the existing Java Reference section (`Guides & References / Backend Development /
Java Reference`) at `modules/ROOT/pages/backend/java/javadoc.adoc`, explaining how the `javadoc` tool and its
doc-comment format work: doc-comment anatomy, the full standard block/inline tag set, package/module-level
documentation, documentation inheritance, and worked examples of documenting a class, its fields, its
constructors and its methods. Wire the page into `modules/ROOT/nav.adoc` and
`modules/ROOT/pages/backend/java/index.adoc`, and trim the existing brief `javadoc` mention in
`modules/ROOT/pages/backend/java/build-and-tooling.adoc` so the two pages don't duplicate content.

### Choices made on the user's behalf (stated here so they can be challenged in review)

1. **Content-only, untagged plan.** This repo has no application source code (per `CLAUDE.md`); every task here
   is AsciiDoc authoring. None of the installed `*-code-one-task` skills (`java`, `dotnet`, `database`) apply —
   matching every prior documentation plan in `.archive/` (e.g. `implementation_plan_57.md`,
   `implementation_plan_59.md`) — so no task carries a language/framework tag.
2. **Page section order**, top to bottom: intro paragraph -> `== What Javadoc Is` -> `== Doc Comments vs. Other
   Comments` -> `== Anatomy of a Doc Comment` (description & summary sentence, then the tag section) ->
   `== Standard Block Tags` (table + one worked example) -> `== Standard Inline Tags` (table + one worked
   example) -> `== Package and Module Documentation` (with a `package-info.java` example) ->
   `== Documentation Inheritance` (with an `{@inheritDoc}` example) -> `== Running javadoc` (brief, cross-linking
   `build-and-tooling.adoc` instead of repeating it) -> `== Putting It All Together` (one fully documented class
   combining everything, plus the `{@snippet}` example) -> `== Best Practices` -> `== References`. This mirrors
   the tone/depth of `backend/java/annotations-and-reflection.adoc` (concept sections each carrying their own
   short example) rather than bunching every example into one trailing "Examples" section.
3. **One diagram, not two.** The issue flags a `[mermaid]` diagram as a nice-to-have for the doc-comment ->
   `javadoc` -> HTML pipeline, and a second one for documentation-inheritance lookup. Only the first pays for
   itself (a real pipeline with distinct stages); the inheritance lookup is a two-hop rule better stated in prose
   with a short code example. Add one `[mermaid]` flowchart in `== What Javadoc Is`, no new SVG.
4. **`build-and-tooling.adoc` trim, precisely scoped.** Keep the `[#generating-api-docs]` anchor (the new page's
   `== Running javadoc` section links to it), keep the intro sentence and the `javadoc`/`mvn`/`gradle` CLI
   block, but remove the full worked-method code example and the tag-naming sentence (both now live, expanded,
   on the new page) and replace them with one sentence plus a cross-link to `javadoc.adoc`.
5. **Tag tables use AsciiDoc `|===` tables**, three columns (`Tag`, `Applies to`, `Meaning`), matching the
   table style already used elsewhere in this component (e.g. the Kotlin-issue pros/cons table convention, and
   AsciiDoc table usage in `database/sql/*.adoc`).
6. **`@apiNote`/`@implSpec`/`@implNote`** are covered as a documented convention (not part of the standard tag
   set, enabled via `-tag`), one short paragraph, not a full table row — they're JDK-source house style, not a
   javac/javadoc-shipped tag.

## Current code state

- **New file target**: `modules/ROOT/pages/backend/java/javadoc.adoc` does not exist yet.
- **`modules/ROOT/nav.adoc`** (432 lines): the Java Reference block runs from line 398
  (`*** xref:backend/java/index.adoc[Java Reference]`) through line 432 (the cheat sheet entry). Line 430 is
  `**** xref:backend/java/build-and-tooling.adoc[Build & Tooling]`, line 431 is
  `**** xref:backend/java/testing.adoc[Unit Testing with JUnit 5 & Mockito]`. The new entry goes between them.
- **`modules/ROOT/pages/backend/java/index.adoc`** (161 lines): the `=== Modularity, packaging & tooling` group
  (line 107) lists `packages-and-modules.adoc` then `build-and-tooling.adoc` (lines 109–113, whose bullet text
  ends "...and generating API docs with `javadoc`."); `=== Testing & reference` starts at line 115. The page's
  `:description:` (line 2) and `:keywords:` (line 3) currently contain no mention of Javadoc/doc comments at
  all — both need a refresh.
- **`modules/ROOT/pages/backend/java/build-and-tooling.adoc`**: the relevant section is
  `[#generating-api-docs]` / `== Generating API Docs with \`javadoc\`` at lines 679–719 (confirmed via direct
  read). Today it contains: one intro paragraph (with links to the `javadoc` man page and the Java Tutorials
  section), one full `[source,java]` worked method example demonstrating `@param`/`@return`/`@throws`/`@see`/
  `{@code}`, a sentence naming "the common tags," a `[source,bash]` block with the CLI invocation plus
  `mvn javadoc:javadoc` / `./gradlew javadoc`, then `== See Also` (lines 721–733) with 4 xref bullets. The
  page's own `:description:`/`:keywords:` (lines 2–3) already name `javadoc` among the JDK tools and plugins
  covered — no change needed there.
- **`modules/ROOT/partials/java-disclaimer.adoc`**: existing house-style admonition (scope: current Java release
  line, Java 25 LTS reference point; AI-generation disclosure; pointer to the section bibliography). The new
  page includes this unchanged via `include::partial$java-disclaimer.adoc[]` — no new partial needed.
- **House style precedent**: `backend/java/annotations-and-reflection.adoc` is the closest sibling page in
  scope/depth (a single modern-language-feature topic, concept sections each with a short `[source,java]`
  example, closing `== References`) and should be used as the template for heading density and example sizing.
- **Build verification**: `npx antora antora-playbook.yml` (local content only) must complete with no new
  `xref`/AsciiDoc warnings; `build/` is gitignored. The `iru-build-docs` skill wraps this build. No test suite
  exists in this repo (per `CLAUDE.md`: "no lint/test suite — the only meaningful verification is that the
  Antora build completes").
- **No `*-code-one-task` skill applies** (`find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` only
  returns `java`/`dotnet`/`database` variants, none of which covers AsciiDoc authoring). `iru-gate-runner` **is**
  installed (`.claude/agents/iru-gate-runner.md`) and is used below to run the build check out of the main
  context.

## Implementation steps

### Group 1 — Write the new Javadoc page (Parallelizable: yes — single task)

- [ ] Task 1. Create `modules/ROOT/pages/backend/java/javadoc.adoc`
  - [ ] Task 1.1. Add the page header: `= Javadoc`, a `:description:` summarizing doc comments, block/inline
        tags, package/module docs, documentation inheritance, and worked examples; a `:keywords:` line listing
        `javadoc, doc comment, @param, @return, @throws, @see, @since, @deprecated, {@code}, {@link},
        {@inheritDoc}, {@value}, {@snippet}, package-info.java, module-info.java, Xdoclint` (extend as needed);
        then `include::partial$java-disclaimer.adoc[]`.
  - [ ] Task 1.2. Add an intro paragraph: what `javadoc` is (the JDK-bundled tool that turns doc comments into
        linked HTML API documentation, the same format as the published Java SE API spec), and one sentence
        pointing forward to `xref:backend/java/build-and-tooling.adoc#generating-api-docs[Build & Tooling]` for
        running the tool via the CLI/Maven/Gradle.
  - [ ] Task 1.3. `== What Javadoc Is` — the tool's role (parses declarations + doc comments, generates HTML);
        one `[mermaid]` flowchart: `.java source with a doc comment -> javadoc tool -> linked HTML pages
        (index, package-summary, class pages)`.
  - [ ] Task 1.4. `== Doc Comments vs. Other Comments` — `/** ... */` vs `//` and `/* ... */` (only `/** */` is
        read); placement rule: recognized only immediately before a module (`module-info.java`), package
        (`package-info.java`), class/interface/enum/record, constructor, method, or field declaration; one
        comment documents exactly one declaration. Short `[source,java]` snippet contrasting all three comment
        forms above one method.
  - [ ] Task 1.5. `== Anatomy of a Doc Comment`
    - [ ] Task 1.5.1. `=== Description and Summary Sentence` — free-text description, allowed inline HTML
          (`<p>`, `<ul>`/`<li>`, `<b>`) vs. disallowed (`<h1>`-`<h6>`, which collide with generated headings);
          the classic first-sentence/summary rule (terminated at the first period followed by whitespace or a
          tag) and its "Prof. Knuth" ambiguity; the `{@summary ...}` inline tag (JDK 10+, JDK-8173425) as the
          unambiguous alternative, with a short `[source,java]` example showing both forms.
    - [ ] Task 1.5.2. `=== The Tag Section` — block tags start a new line with `@`, appear after the
          description, same-kind tags grouped together, in Oracle's recommended order: `@author`, `@version`,
          `@param`, `@return`, `@throws`, `@see`, `@since`, `@serial`, `@deprecated`.
  - [ ] Task 1.6. `== Standard Block Tags` — an AsciiDoc `|===` table (`Tag` | `Applies to` | `Meaning`) covering
        `@author`, `@version`, `@param` (incl. `@param <T>` for type parameters), `@return` (omitted for `void`/
        constructors), `@throws`/`@exception` (synonyms, repeatable), `@see` (its three forms: plain text,
        `<a href="">`, `package.class#member`), `@since`, `@deprecated` (paired with the `@Deprecated`
        annotation), `@serial`/`@serialField`/`@serialData`, `@hidden`. Below the table, one short paragraph on
        the `@apiNote`/`@implSpec`/`@implNote` JDK-source convention (JDK-8008632) — not standard tags, enabled
        via `-tag`, used to separate contract vs. default-implementation behavior vs. implementation notes.
  - [ ] Task 1.7. `== Standard Inline Tags` — an AsciiDoc `|===` table covering `{@code}`, `{@literal}`,
        `{@link}` / `{@linkplain}`, `{@value}`, `{@inheritDoc}`, `{@docRoot}`, `{@summary}` (cross-ref back to
        Task 1.5.1), `{@snippet}` (JDK 18+ / JEP 413 — inline and external `snippet-files` forms, `region`/
        `highlight`/`replace` attributes, and how it improves on wrapping examples in `{@code}`/`<pre>`).
  - [ ] Task 1.8. `== Package and Module Documentation` — a minimal `package-info.java` `[source,java]` example
        with its own doc comment; a `module-info.java` doc-comment example; the `-overview` option and an
        overview HTML file for the all-packages summary page (one sentence, cross-linking
        `build-and-tooling.adoc` for the CLI option itself rather than re-explaining `-overview` in depth).
  - [ ] Task 1.9. `== Documentation Inheritance` — how an `@Override`d/implemented method with no doc comment
        (or one that omits `@param`/`@return`/`@throws`) inherits the missing parts from the superclass/
        interface method automatically; `{@inheritDoc}` to invoke this explicitly within an otherwise-present
        comment. One `[source,java]` example: an interface method with a full doc comment, an implementing
        class relying on implicit inheritance, and a second implementation using `{@inheritDoc}` to add to it.
  - [ ] Task 1.10. `== Running javadoc` — short paragraph only: the access-level filters (`-public`/
        `-protected` default/`-package`/`-private`), `-author`/`-version` (opt-in tag inclusion), `-link`/
        `-linkoffline` (cross-linking other API docs), `-doctitle`/`-windowtitle`, and `-Xdoclint` (doc-comment
        validation — html/syntax/reference/accessibility/missing categories, on by default since JDK 8, and how
        to wire it into CI so broken doc comments fail the build). Close with
        "See xref:backend/java/build-and-tooling.adoc#generating-api-docs[Generating API Docs with javadoc] for
        the command line and the Maven/Gradle plugin wiring." — no CLI/Maven/Gradle block duplicated here.
  - [ ] Task 1.11. `== Putting It All Together` — one fully documented example class combining: a class-level
        doc comment (summary, description, `@author`, `@since`), a documented constructor, a documented method
        with the full `@param`/`@return`/`@throws`/`@see` set in declaration order, a documented `static final`
        constant using `{@value}`, and one `{@snippet ...}` usage (inline form is enough — an external
        `snippet-files` example was already shown conceptually in Task 1.7, this section just needs one
        concrete inline snippet in context).
  - [ ] Task 1.12. `== Best Practices` — bullet list: write a self-contained summary sentence; document every
        public/protected member; document the contract (preconditions, edge cases, thread-safety, nullability),
        not the signature restated in prose; prefer `{@code}` over raw `<code>`; keep `@param` order in sync
        with the declaration; avoid dangling `{@link}` targets; run with `-Xdoclint` (or the Maven/Gradle
        equivalents from `build-and-tooling.adoc`) in CI.
  - [ ] Task 1.13. `== References` — link: the `javadoc` command
        (`https://docs.oracle.com/en/java/javase/25/docs/specs/man/javadoc.html`), the Documentation Comment
        Specification (`https://docs.oracle.com/en/java/javase/25/docs/specs/javadoc/doc-comment-spec.html`),
        "How to Write Doc Comments for the Javadoc Tool"
        (`https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html`), the Java SE 25 API spec
        (`https://docs.oracle.com/en/java/javase/25/docs/api/`), JEP 413
        (`https://openjdk.org/jeps/413`), the Programmer's Guide to Snippets
        (`https://docs.oracle.com/en/java/javase/21/javadoc/snippets.html`), JDK-8173425
        (`https://bugs.openjdk.org/browse/JDK-8173425`), JDK-8008632
        (`https://bugs.openjdk.org/browse/JDK-8008632`), and the Java Tutorials Javadoc section
        (`https://docs.oracle.com/javase/tutorial/java/javaOO/javadoc.html`).

### Group 2 — Wire the page in and trim the duplicate coverage (Parallelizable: yes — three independent files)

- [ ] Task 2. Add the nav entry in `modules/ROOT/nav.adoc`
  - [ ] Task 2.1. Insert `**** xref:backend/java/javadoc.adoc[Javadoc]` between the existing line 430
        (`Build & Tooling`) and line 431 (`Unit Testing with JUnit 5 & Mockito`).
- [ ] Task 3. Add the page to `modules/ROOT/pages/backend/java/index.adoc`
  - [ ] Task 3.1. Insert a new bullet in the `=== Modularity, packaging & tooling` list (after the
        `build-and-tooling.adoc` bullet, before `=== Testing & reference`):
        `* xref:backend/java/javadoc.adoc[Javadoc] -- doc comments, block and inline tags, package and module
        documentation, documentation inheritance, and worked examples.`
  - [ ] Task 3.2. Refresh the page's `:description:` (line 2) and `:keywords:` (line 3) to mention Javadoc/doc
        comments (e.g. add "and documenting code with Javadoc" to the description's tooling clause; add
        `Javadoc, doc comment, @param, @return, @throws, {@code}, {@link}` to the keywords).
- [ ] Task 4. Trim `modules/ROOT/pages/backend/java/build-and-tooling.adoc`'s javadoc section
  - [ ] Task 4.1. In `[#generating-api-docs]` / `== Generating API Docs with \`javadoc\`` (lines 679–719): keep
        the anchor, keep the intro paragraph's tool-role sentence, **remove** the full worked-method
        `[source,java]` example and the "the common tags are..." sentence, and add one sentence:
        "For the doc-comment format itself -- block and inline tags, package/module docs, documentation
        inheritance, and worked examples -- see xref:backend/java/javadoc.adoc[Javadoc]." Keep the
        `[source,bash]` CLI/`mvn`/`gradle` block unchanged.

### Group 3 — Verify the build (Parallelizable: yes — single task; depends on Groups 1–2)

- [ ] Task 5. Verify the Antora build with no new warnings, out of the main context
  - [ ] Task 5.1. Delegate to `iru-gate-runner`:
        `Agent({description: "Build Antora site and check for xref/AsciiDoc warnings", subagent_type:
        "iru-gate-runner", prompt: "Invoke Skill({skill: \"iru-build-docs\"}) to build this Antora site (npx
        antora antora-playbook.yml, local content only). Report back only: whether the build succeeded, and
        the exact text of any new xref/AsciiDoc warnings or errors introduced (ignore pre-existing warnings
        unrelated to backend/java/javadoc.adoc, backend/java/build-and-tooling.adoc,
        backend/java/index.adoc, or nav.adoc). Do not dump the full build log."})`
  - [ ] Task 5.2. If the sub-agent reports any new warning/error tied to the changed files, fix it directly
        (e.g. a broken `xref:`, a malformed table, a mismatched anchor) and re-run Task 5.1 until clean.
