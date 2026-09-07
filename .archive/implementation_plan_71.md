# Implementation Plan: Trim AI-disclaimer admonitions and refresh SEO description/keyword tags

## Task summary

Source: GitHub issue #71

Two independent AsciiDoc content-cleanup passes across `modules/ROOT/`, both content-only (no code, no
`nav.adoc`/`antora.yml` changes):

1. **Trim the 21 `modules/ROOT/partials/*-disclaimer.adoc` files.** Each is `include::`d at the top of every
   page in its section, so any bloat there is repeated on dozens of pages. Today most spend a whole paragraph
   naming and evaluating specific reference books/editions — that judgment belongs on the section's own
   Bibliography page (`== Bibliography` heading, auto-anchored `#_bibliography`), not in a disclaimer repeated
   everywhere. Target shape for every disclaimer: (a) one paragraph on scope/version (kept, lightly trimmed if
   it also carries a tangential technical aside), (b) one sentence "generated with AI assistance, verify against
   official docs", (c) where the section has a Bibliography page, one closing sentence pointing to it.
2. **Reword 3 page bodies + 2 bonus cheat-sheet passages** that currently name specific books directly (partly
   because they cross-reference a disclaimer's now-removed book list).
3. **Refresh `:description:`/`:keywords:`** on 8 pages whose content grew a new `==` section without the SEO
   metadata catching up.

### Choices made on the user's behalf (confirmed in planning — challenge in review)

1. **Bibliography-pointer target per disclaimer**, using the repo's existing cross-page anchor convention
   (confirmed in use at `web/aspnet/architecture-and-patterns.adoc:9`:
   `xref:web/aspnet/index.adoc#_bibliography[bibliography]`). Verified which section pages actually carry a
   `== Bibliography` heading (`grep -rl "== Bibliography" modules/ROOT/pages`) — 21 pages do. Two disclaimers
   (`accessibility-disclaimer.adoc`, `cors-disclaimer.adoc`) point at pages (`web/accessibility.adoc`,
   `web/cors.adoc`) that have **no** Bibliography section, consistent with their own text ("no single reference
   book underpins it") — no pointer sentence is added for these two, and they're otherwise left alone (already
   minimal, matching the issue's own note).
2. **Exact final wording is authored during implementation, not pre-written here**, since this is a copy-editing
   task (removing/trimming sentences), not new technical content requiring source verification — each task below
   states precisely what to keep, what to cut, and what one-line addition (if any) to make, which fully
   determines the result without prescribing the exact prose.
3. **The 2 "bonus" cheat-sheet passages are included as real tasks**, not left as optional — the issue body flags
   them as the same duplication pattern even though they're outside its formal acceptance-criteria checklist;
   trimming them costs one line each and keeps the pass complete.
4. **Content-only, untagged plan.** `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` yields
   only `java` / `dotnet` / `iru-database` — none covers AsciiDoc — so no task carries a language/framework tag,
   matching every prior documentation-only plan in `.archive/` (most recently `_67`).
5. **Verification is the Antora build**, delegated to the `iru-gate-runner` agent (installed at
   `.claude/agents/iru-gate-runner.md`) invoking `Skill({skill: "iru-build-docs"})` — this repo has no test suite;
   a clean build with zero `xref`/AsciiDoc warnings is the only gate, per every prior plan in `.archive/`.
6. **Out of scope** (per the issue body): no change to `nav.adoc`, no new pages, no changes to any section not
   named in the issue, no attempt to reconcile `choosing-a-database-disclaimer.adoc`'s "no single reference book
   underpins it" claim against `database/choosing-the-right-database.adoc`'s own `== Bibliography` section
   (pre-existing inconsistency, not introduced by this issue, and not one of the 21 partials flagged) — that
   disclaimer already contains no book names, so it needs no Part-1 edit; the pre-existing Bibliography stays.

## Current code state

- **21 disclaimer partials** live at `modules/ROOT/partials/*-disclaimer.adoc`, each 7-21 lines, each wrapped in
  `[IMPORTANT]` / `====` / `====`, each `include::partial$<name>-disclaimer.adoc[]`'d as line 5 of every page in
  its section (confirmed via `grep -rn "include::partial\$.*-disclaimer" modules/ROOT/pages | wc -l` → hundreds
  of includes across ~350 section pages).
- **12 of the 21** end with a paragraph naming 1-3 specific books by title/author/publisher/edition and arguing
  how outdated each is relative to the section's current reference point: `angular`, `aspnet`, `couchbase`,
  `java`, `mongodb`, `python`, `springboot` (names no titles but still relitigates "several local books"),
  `tailwind`, `typescript`, `vaadin`, `vue`, plus `jquery` (names its one book in paragraph 1, not a trailing
  paragraph).
- **9 more** have no book mention but carry a tangential technical aside better suited to page body than a
  disclaimer: `accessibility`, `bootstrap`, `choosing-a-database`, `cors`, `javascript`, `sass`,
  `schema-evolution`, `react` — see per-task detail below for exactly which sentence/paragraph to cut from each.
- **2** (`html-css`, `sql`) are already minimal (7 and 9 lines) — verified during exploration, no edit needed;
  listed in the issue only for completeness.
- **3 page bodies** directly reference a disclaimer's book list and will read strangely once that list is
  removed:
  - `modules/ROOT/pages/backend/java/dates-and-times.adoc` line 255: `The disclaimer's cited books predate
    `java.time`; where they use `Date`, `Calendar`, or ...`
  - `modules/ROOT/pages/web/python/dataclasses-and-enums.adoc` line 11: `... `@dataclass` postdates all three
    books consulted for this section (see the disclaimer above), so there is no book cross-reference here.`
  - `modules/ROOT/pages/web/javascript/browser-location-navigation-history.adoc` lines 219-223: an inline
    `[IMPORTANT]` admonition (not the disclaimer partial) that names *"JavaScript: The Definitive Guide"*
    directly and says "consistent with the disclaimer above".
- **2 bonus cheat-sheet pages** restate book names/publishers in plain body prose, duplicating both their
  section's disclaimer and its Bibliography:
  - `modules/ROOT/pages/database/couchbase/cheat-sheet.adoc` line ~45: `_Couchbase Essentials_ (Packt, 2015),
    _Pro Couchbase Development_ (Apress, 2015) and _Pro Couchbase Server_, 2nd ed. (Apress, 2015) are listed in
    this section's bibliography and are not the primary reference.`
  - `modules/ROOT/pages/database/mongodb/cheat-sheet.adoc` line ~58: `_MongoDB: The Definitive Guide_, 3rd ed.
    (O'Reilly, 2019 -- ...) is listed in this section's bibliography ...`
- **8 pages** have a `:description:`/`:keywords:` pair (both attributes present on every page site-wide — none
  missing anywhere) that no longer covers a `==` section the page has since grown:
  `database/index.adoc`, `database/sql/index.adoc`, `database/couchbase/sql-plus-plus-querying.adoc`,
  `backend/java/classes-and-objects.adoc`, `backend/java/getting-started.adoc`,
  `backend/springboot/configuration-and-profiles.adoc`, `backend/springboot/spring-data-couchbase.adoc`,
  `backend/springboot/spring-data-neo4j.adoc` — see Group 3 tasks for the exact missing topic per page.
- **`.archive/` precedent:** `implementation_plan_67.md` — confirms the untagged-plan convention, the
  `iru-gate-runner` + `iru-build-docs` verification pattern, and the "Current code state" / "Choices made"
  structure this plan follows.

## Implementation steps

### Group 1 — Trim the 21 disclaimer partials (Parallelizable: yes — 21 independent files, no shared file, no ordering dependency)

- [x] **Task 1. Remove book-naming paragraphs from the 12 partials that name specific titles.** For each file,
      keep the opening scope/version paragraph and the "generated with AI assistance... verify against official
      docs" paragraph; delete the paragraph(s) that name book titles/authors/editions and argue their vintage;
      append one closing sentence pointing to the section's Bibliography page using the
      `xref:<path>/index.adoc#_bibliography[Bibliography]` convention (target path in parentheses below).
      — All 12 book-naming paragraphs replaced with a one-line `xref:...#_bibliography[bibliography]` pointer;
      no test suite for this content-only repo, verification deferred to Task 6's Antora build.
  - [x] Task 1.1. `modules/ROOT/partials/angular-disclaimer.adoc` — delete the paragraph naming "Learning
        Angular" (Bampakos). (`web/angular/index.adoc`)
  - [x] Task 1.2. `modules/ROOT/partials/aspnet-disclaimer.adoc` — delete the paragraph naming "Architecting
        ASP.NET Core Applications" and "ASP.NET Core 5 for Beginners". (`web/aspnet/index.adoc`)
  - [x] Task 1.3. `modules/ROOT/partials/couchbase-disclaimer.adoc` — delete the paragraph naming "Couchbase
        Essentials", "Pro Couchbase Development", "Pro Couchbase Server" (longest offender, currently 21 lines).
        (`database/couchbase/index.adoc`)
  - [x] Task 1.4. `modules/ROOT/partials/java-disclaimer.adoc` — delete the paragraph naming "Fundamentals of
        Java Programming", "Java in Two Semesters", "Modern Java in Action" and its feature-gap analysis
        (currently 21 lines). (`backend/java/index.adoc`)
  - [x] Task 1.5. `modules/ROOT/partials/jquery-disclaimer.adoc` — rephrase paragraph 1 to drop "It was built
        primarily from _"Ultimate Modern jQuery for Web App Development"_ ..., supplemented with general and
        official jQuery documentation wherever the book did not cover a topic"; keep only "This section
        documents jQuery 3.x ... should be verified against the official jQuery API reference". Keep the
        existing paragraph 2 (legacy-leaning / native-equivalents guidance) as-is — it's page-relevant content,
        not book-sourcing. (`web/jquery/index.adoc`)
  - [x] Task 1.6. `modules/ROOT/partials/mongodb-disclaimer.adoc` — delete the paragraph naming "MongoDB: The
        Definitive Guide". (`database/mongodb/index.adoc`)
  - [x] Task 1.7. `modules/ROOT/partials/python-disclaimer.adoc` — delete the paragraph naming "Python
        Programming Fundamentals", "Python Crash Course", "Learning Python". (`web/python/index.adoc`)
  - [x] Task 1.8. `modules/ROOT/partials/springboot-disclaimer.adoc` — delete the paragraph discussing "Several
        local books, listed in full in this section's Bibliography ... most predate Spring Boot 3/4".
        (`backend/springboot/index.adoc`)
  - [x] Task 1.9. `modules/ROOT/partials/tailwind-disclaimer.adoc` — delete the paragraph naming "Modern CSS
        with Tailwind" and "Ultimate Tailwind CSS Handbook". (`web/tailwind/index.adoc`)
  - [x] Task 1.10. `modules/ROOT/partials/typescript-disclaimer.adoc` — delete the paragraph naming "Learning
        TypeScript", "Programming TypeScript", "Effective TypeScript". (`web/typescript/index.adoc`)
  - [x] Task 1.11. `modules/ROOT/partials/vaadin-disclaimer.adoc` — delete the paragraph naming "Practical
        Vaadin", "Learning Vaadin 7", "Vaadin 7 UI Design By Example". (`web/vaadin/index.adoc`)
  - [x] Task 1.12. `modules/ROOT/partials/vue-disclaimer.adoc` — delete the paragraph naming "Vue.js 3 for
        Beginners", "Building Real-World Web Applications with Vue.js 3", "Frontend Development Projects with
        Vue.js 3". (`web/vue/index.adoc`)
- [x] **Task 2. Tighten the 9 partials with no book mention but a tangential aside**, cutting the specific
      sentence/paragraph named and appending the same Bibliography-pointer sentence where the section has one
      (all 9 do, per the `grep -rl "== Bibliography"` check above).
      — All 9 partials trimmed; bibliography pointer added to the 7 with a Bibliography page (accessibility and
      cors correctly left without one).
  - [x] Task 2.1. `modules/ROOT/partials/accessibility-disclaimer.adoc` — trim the "Legal Standards and
        Regulations... not legal advice" paragraph to one sentence. No Bibliography page exists for this
        section (`web/accessibility.adoc` has none) — do not add a pointer.
  - [x] Task 2.2. `modules/ROOT/partials/bootstrap-disclaimer.adoc` — drop the Popper.js/vanilla-JS explanatory
        clause ("Notably, Bootstrap 5 dropped the jQuery dependency ... behaviour described here reflects that
        vanilla-JS baseline and may lag the release you are actually running"). (`web/bootstrap/index.adoc`)
  - [x] Task 2.3. `modules/ROOT/partials/choosing-a-database-disclaimer.adoc` — drop paragraph 2 in full (the
        Couchbase-vs-MongoDB vendor-comparison guidance). (`database/choosing-the-right-database.adoc` — this
        page's own Bibliography, noted as a pre-existing inconsistency in "Choices made" above; add the pointer
        anyway since the page does have one)
  - [x] Task 2.4. `modules/ROOT/partials/cors-disclaimer.adoc` — drop the trailing sentence "Backend
        framework-specific CORS configuration (e.g. Express, Django, Spring) is out of scope for this page and
        left to each framework's own documentation." No Bibliography page exists for this section
        (`web/cors.adoc` has none) — do not add a pointer.
  - [x] Task 2.5. `modules/ROOT/partials/javascript-disclaimer.adoc` — drop the "Coverage of WebGL, Three.js,
        the Geolocation API, WebRTC, the Video APIs, and the developer-tooling pages ... draws on
        general/official documentation for those particular topics" sentence. (`web/javascript/index.adoc`)
  - [x] Task 2.6. `modules/ROOT/partials/sass-disclaimer.adoc` — drop the "notably the deprecation of `@import`
        in favour of the `@use`/`@forward` module system, and the migration of global built-in functions into
        the `sass:*` modules" clause. (`web/sass/index.adoc`)
  - [x] Task 2.7. `modules/ROOT/partials/schema-evolution-disclaimer.adoc` — trim the AI-disclosure paragraph to
        one sentence; keep the Mongock→Flamingock migration-guidance paragraph and its `xref` as-is (navigational
        content, not book-sourcing, per "Choices made" above). (`database/schema-evolution/index.adoc`)
  - [x] Task 2.8. `modules/ROOT/partials/react-disclaimer.adoc` — shorten the long parenthetical list of React
        19 additions ("Actions and `useActionState` / `useFormStatus` / `useOptimistic`, the `use` API, `ref` as
        a prop, the React Compiler, stable Server Components, native document metadata, and the
        resource-preloading APIs") to a short clause, e.g. "the React 19 additions". (`web/react/index.adoc`)
  - [x] Task 2.9. Verify `modules/ROOT/partials/html-css-disclaimer.adoc` and
        `modules/ROOT/partials/sql-disclaimer.adoc` need no edit (already minimal, 7 and 9 lines) — no change,
        just confirm during review.

### Group 2 — Reword book cross-references (Parallelizable: yes — 5 independent files; depends on Group 1 only so the new wording stays consistent with the trimmed disclaimers, not on any shared file)

- [x] **Task 3. Reword the 3 page bodies that cross-reference a disclaimer's book list.**
  - [x] Task 3.1. `modules/ROOT/pages/backend/java/dates-and-times.adoc` (~line 255) — reword "The disclaimer's
        cited books predate `java.time`; where they use `Date`, `Calendar`, or `SimpleDateFormat`, use the types
        on this page instead" to not depend on the disclaimer naming books, e.g. "Older Java material predates
        `java.time`; where it uses `Date`, `Calendar`, or `SimpleDateFormat`, use the types on this page
        instead" — keep the substantive guidance (prefer the modern types), drop only the disclaimer
        cross-reference.
  - [x] Task 3.2. `modules/ROOT/pages/web/python/dataclasses-and-enums.adoc` (~line 11) — reword "`@dataclass`
        postdates all three books consulted for this section (see the disclaimer above), so there is no book
        cross-reference here" to state the same fact about the standard-library modules being the only sources
        for this page without naming or counting the disclaimer's books, e.g. "`@dataclass` is recent enough
        that there is no book cross-reference for this page; the `dataclasses` and `enum` module docs above are
        the only sources."
  - [x] Task 3.3. `modules/ROOT/pages/web/javascript/browser-location-navigation-history.adoc` (~lines 219-223)
        — reword the inline `[IMPORTANT]` block to drop the specific title *"JavaScript: The Definitive Guide"*
        and "consistent with the disclaimer above", keeping the substantive point (Geolocation API coverage here
        draws on MDN/general knowledge, not a reference book), e.g. "The Geolocation API has no dedicated
        coverage in this section's reference material -- it's mentioned only as a further-reading pointer.
        Everything in this section is drawn from general/official knowledge (MDN)."
- [x] **Task 4. Trim the 2 bonus cheat-sheet passages.**
  - [x] Task 4.1. `modules/ROOT/pages/database/couchbase/cheat-sheet.adoc` (~line 45) — cut "; _Couchbase
        Essentials_ (Packt, 2015), _Pro Couchbase Development_ (Apress, 2015) and _Pro Couchbase Server_, 2nd
        ed. (Apress, 2015) are listed in this section's bibliography and are not the primary reference", leaving
        "Everything here is verified against https://docs.couchbase.com/server/current/[the Couchbase Server
        documentation]."
  - [x] Task 4.2. `modules/ROOT/pages/database/mongodb/cheat-sheet.adoc` (~line 58) — cut "; _MongoDB: The
        Definitive Guide_, 3rd ed. (O'Reilly, 2019 --
        https://www.oreilly.com/library/view/mongodb-the-definitive/9781491954454/[publisher's page]) is listed
        in this section's bibliography", leaving "Everything here is verified against
        https://www.mongodb.com/docs/manual/[the MongoDB Server Manual]."

### Group 3 — Refresh SEO description/keywords on 8 pages (Parallelizable: yes — 8 independent files, no dependency on Groups 1-2)

- [x] **Task 5. Update `:description:`/`:keywords:` to cover each page's missing topic.**
      — All 8 pages' `:description:`/`:keywords:` refreshed to cover the section they'd grown; no test suite for
      this content-only repo, verification deferred to Task 6's Antora build.
  - [x] Task 5.1. `modules/ROOT/pages/database/index.adoc` — add the fourth section, "Evolving the Database
        Model" (Liquibase, Mongock, Flamingock / schema evolution), to both `:description:` and `:keywords:`
        alongside the existing three (Choosing the Right Database, SQL, MongoDB, Couchbase references).
  - [x] Task 5.2. `modules/ROOT/pages/database/sql/index.adoc` — add "aggregate and window functions" (matching
        the `== What's covered` list's link to `aggregate-window-functions.adoc`) to `:description:`/`:keywords:`.
  - [x] Task 5.3. `modules/ROOT/pages/database/couchbase/sql-plus-plus-querying.adoc` — add coverage of the
        `== How a SQL++ query executes` section (query-plan pipeline: parse, optimizer/index selection, scan,
        fetch, join, filter, group, order, project) to `:description:`/`:keywords:`, which today only mention
        the SELECT/joins/CTE surface.
  - [x] Task 5.4. `modules/ROOT/pages/backend/java/classes-and-objects.adoc` — add "stack" and "metaspace" to
        `:description:`/`:keywords:` (the `== JVM Memory: Stacks and the Heap` section covers both; today only
        "heap" is mentioned).
  - [x] Task 5.5. `modules/ROOT/pages/backend/java/getting-started.adoc` — add coverage of the `== From Source
        to Native Execution` section (class loader, bytecode verifier, interpreter, JIT compiler) to
        `:description:`/`:keywords:`.
  - [x] Task 5.6. `modules/ROOT/pages/backend/springboot/configuration-and-profiles.adoc` — add "`@RefreshScope`"
        / Spring Cloud Context / `EnvironmentChangeEvent` (the `== Runtime configuration changes with
        @RefreshScope` section) to `:description:`/`:keywords:`.
  - [x] Task 5.7. `modules/ROOT/pages/backend/springboot/spring-data-couchbase.adoc` — add "`@Transactional`" /
        `CouchbaseCallbackTransactionManager` (the `== Transactions` section) to `:description:`/`:keywords:`,
        which today cover only optimistic locking/CAS.
  - [x] Task 5.8. `modules/ROOT/pages/backend/springboot/spring-data-neo4j.adoc` — add "`@Transactional`" /
        `Neo4jTransactionManager` (the `== Transactions` section) to `:description:`/`:keywords:`, which today
        cover only optimistic locking.

### Group 4 — Verify the Antora build (Parallelizable: yes — single task)

- [x] **Task 6. Build the docs site and confirm no warnings.** Delegate to the `iru-gate-runner` agent:
      `Agent({description: "Build Antora docs site", subagent_type: "iru-gate-runner", prompt: "Invoke
      Skill({skill: \"iru-build-docs\"}) (or run `npx antora antora-playbook.yml`) at the repository root.
      Report only: whether the build completed, and the full text of any AsciiDoc/xref warning or error --
      especially any unresolved `xref:.../index.adoc#_bibliography[...]` link added in Group 1/2 (13 new
      Bibliography-pointer xrefs across the 12+9 disclaimer partials), and any AsciiDoc syntax broken by the
      admonition-block trims in Group 1."})`
      — Build exit 0, 714 pages generated; only 3 pre-existing "possible invalid reference" info-level messages
      (unrelated to this plan's files), zero warnings/errors, zero `class="xref unresolved"` site-wide.
  - [x] Task 6.1. Fix any reported unresolved `xref` (most likely cause: a Bibliography-pointer target path
        typo'd relative to `modules/ROOT/partials/`, since `partial$` includes resolve relative to the
        component/module root, not the including page's own directory) or malformed `[IMPORTANT]`/`====` block;
        re-run until the build is clean.
        — Nothing to fix; build was clean on the first run.
  - [x] Task 6.2. Spot-check 2-3 rendered pages in `build/site` (one page per a book-naming disclaimer section,
        e.g. `build/site/backend/java/getting-started.html`) to confirm the trimmed disclaimer renders correctly
        and the new Bibliography-pointer link resolves to the right anchor.
        — Verified `build/site/backend/java/getting-started.html` and
        `build/site/web/aspnet/architecture-and-patterns.html`: both render the trimmed disclaimer and an
        `href="index.html#_bibliography"` link to the section's own Bibliography.
  - _Done:_ `npx antora antora-playbook.yml` exit code **0**, zero warning/error lines, and
    `grep -c 'class="xref unresolved"' -r build/site` = **0** site-wide.
