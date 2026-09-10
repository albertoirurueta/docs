# Implementation Plan

## Task summary

Add a new "Tips" page to the GraphQL Reference section — `Tips: When to Use GraphQL or a Typical REST API` — that
consolidates the trade-offs currently scattered across 7 existing GraphQL Reference pages into one decision-oriented
page, with a specific new focus on **query-plan cost and index coverage** (a documented gap: the whole GraphQL
Reference section currently mentions an index or a query plan exactly once). Wire the new page into the section's
nav, its index landing page, and forward/backward cross-links from the pages it consolidates.

Source: GitHub issue #102

Notes on approach (decided without asking the user — see rationale):

- The issue's own body (title, description, and its single follow-up comment) is the authoritative content source:
  it already contains a full page outline, a complete draft pros/cons table (23 rows), a complete tips list
  (29 items across 4 groups), a complete decision checklist (15 scenarios), 22 acceptance criteria, and 16
  references. This plan does not re-transcribe that content verbatim (it is extremely long); instead, each task
  below tells the implementer to **re-fetch issue #102's full body** (`gh issue view 102 --json body,comments -q
  '.body'` and `-q '.comments[].body'`, or the equivalent GitHub MCP `issue_read` `get`/`get_comments` calls) and
  use it as the primary source for exact wording, table rows, tips, and checklist entries — not to re-derive them
  independently.
- Exploration found **no existing page in this repo uses a "Tips:" title prefix** — this is a new naming
  convention for the site. The issue explicitly specifies this title, so it is followed as instructed rather than
  treated as an ambiguity worth pausing on.
- This is a documentation-only (AsciiDoc) change. No `*-code-one-task` skill matches AsciiDoc/documentation content,
  so tasks below carry no language/framework tag — the executor implements them directly.

## Current code state

- This repo is an Antora documentation site. The GraphQL Reference section lives under
  `modules/ROOT/pages/backend/graphql/`, with 29 existing `.adoc` pages, a section landing page
  (`index.adoc`), and a shared partial `modules/ROOT/partials/graphql-disclaimer.adoc` included on every page.
- **Page header convention** (confirmed on `security-and-demand-control.adoc`, `caching.adoc`,
  `performance-and-n-plus-1.adoc`): `= Title` line, immediately followed by `:description:` and `:keywords:`
  attribute lines (no blank line between them), one blank line, then `include::partial$graphql-disclaimer.adoc[]`,
  one blank line, then body prose.
- **AI-assisted-content note**: pattern-level (non-library-specific) pages include a `[NOTE]` admonition, usually
  near the end before the closing section, e.g. (`security-and-demand-control.adoc:175-180`):
  ```
  [NOTE]
  ====
  This page is generated with the assistance of AI. The `@cost` directive above illustrates the *pattern*, not one
  specific library's API -- verify the exact directive name, argument shape, and default weights against your
  server framework's own documentation before relying on it.
  ====
  ```
  Reuse this exact phrasing style ("generated with the assistance of AI" / "illustrates the *pattern* ... verify
  ... before relying on it") for the new page, since it is explicitly pattern-level and opinionated.
- **Table convention**: `[cols="N,M",options="header"]` immediately above `|===`, header row first with no blank
  line before it, then a blank line, then data rows, closed with `|===` (e.g. `serving-over-http.adoc:40-52`).
- **Closing-section convention is not uniform** across the three pages the issue asks to backlink from:
  - `serving-over-http.adoc:336-347` uses `== Related pages`, flat bullet list, unquoted `xref:` —
    `* xref:backend/graphql/<page>.adoc[Title] -- <clause>.`
  - `security-and-demand-control.adoc:282-292` uses `== Further reading`, mixing external links and
    `` `xref:...[Title]` `` (backtick-quoted) in one bullet list.
  - `caching.adoc` has no dedicated closing section at all — it ends with a `== Summary` table followed by a
    closing prose paragraph containing inline `` `xref:...[Title]` `` links.
  Each target page keeps its own existing style; do not normalize them.
- `modules/ROOT/pages/backend/graphql/getting-started.adoc:51-61` ends a bulleted "problems GraphQL solves"
  list with the paragraph containing "None of this makes REST wrong for every use case ... a typed schema
  enforced by the server." immediately followed by `== The request/response envelope`. This is the forward-link
  insertion point.
- `modules/ROOT/pages/backend/graphql/index.adoc` structure: header block, intro, `== What's covered` (line 24)
  containing `===`-level groups each with `* xref:backend/graphql/<page>.adoc[Title] -- <one-line summary>.`
  bullets, in this order: `Getting started` (26), `The query language` (31), `Designing the schema` (45),
  `Execution & operating a server` (57, ends with the `federation.adoc` bullet at line 79), `Spring Boot
  integration` (82), `Python integration` (95), `Configuring clients` (107), `Cheat sheet` (116), then
  `== Bibliography` (121).
- `modules/ROOT/nav.adoc:537-570` — the `GraphQL Reference` section (`***`, line 537) lists its 29 child pages as
  `****`-level entries in the same order as `index.adoc`'s groups; `federation.adoc` is at line 559, immediately
  followed by `spring-boot-getting-started.adoc` at line 560.
- `.archive/implementation_plan_86.md` is the plan that originally created this entire GraphQL Reference section
  (issue #86) — useful precedent for conventions but not required reading for this narrower, single-page addition.

## Implementation steps

### Group 1 — Write the new page

**Parallelizable: yes** (single task)

- [ ] Task 1. Create `modules/ROOT/pages/backend/graphql/when-to-use-graphql-or-rest.adoc`

  First, fetch the full body of GitHub issue #102 and its one comment (`gh issue view 102 --json body,comments`,
  or GitHub MCP `issue_read` with `get` and `get_comments`) — this is the authoritative source for the exact
  outline, table rows, tips, checklist rows, and references referenced in the sub-tasks below. Use its "Proposed
  page" section (outline, draft pros/cons table, tips list, decision checklist) and "Context — assessment of the
  premises" section (points 1-7) as the content to adapt into prose; do not invent alternate structure or
  re-derive the tables/tips/checklist from scratch.

  - [ ] Task 1.1. Page header: `= Tips: When to Use GraphQL or a Typical REST API`, `:description:` (one
        sentence summarizing the page's purpose), `:keywords:` (comma-separated, lowercase — include at least
        `graphql`, `rest`, `api design`, `query plan`, `index`, `demand control`), then
        `include::partial$graphql-disclaimer.adoc[]`, matching the exact spacing convention noted above.
  - [ ] Task 1.2. `== What each model actually gives you` — the single typed graph vs. URL-addressed resources,
        turning on the sentence: GraphQL moves *shape selection* to the client and leaves *authority* with the
        server, which must exercise that authority against the query document instead of a route table (per
        issue Context point 1).
  - [ ] Task 1.3. `== Two meanings of "performance"` — server-side cost/predictability vs. end-to-end
        user-perceived latency, and that GraphQL typically moves them in opposite directions (per issue Context
        points 4 and 7, qualification 3). State explicitly that a blanket "performance-critical means REST" is
        not left standing as a rule.
  - [ ] Task 1.4. `== Client-selectable access paths and query-plan cost` — the new core section, covering (per
        issue Context point 7): selections are cheap, arguments are not; a client-chosen `sortBy`/`filter`
        selects the datastore access path; depth/breadth/alias limits and `@cost(weight:)` bound query *shape*
        only, not query-*plan* quality (a static per-field weight cannot distinguish an indexed ordering from an
        unindexed one); the combinatorial, unenumerable executable set vs. REST's finite endpoint set, and that
        the access path can change on a **client** deploy with no server-side checkpoint; the index precondition
        behind cursor pagination (sort key plus tiebreaker; each additional `orderBy` option is another required
        composite index — the gap `pagination.adoc` currently leaves); DataLoader batch keys and `IN`-list plan
        flips; and that no global planner exists across data sources (cross-reference `federation.adoc`'s
        router/query-planning material). Include the example GraphQL query snippet from the issue illustrating a
        shallow, cheap-looking query that is actually a full scan plus sort. State the two qualifications:
        REST is not immune (it just fails more visibly, and the difference is enumerability/change-control, not
        kind), and trusted documents restore the REST property for performance too (a finite, build-time query
        set can be `EXPLAIN`ed in CI).
  - [ ] Task 1.5. `== Pros and cons at a glance` — the full draft table from the issue (23 rows), using the
        `[cols="...",options="header"]` / `|===` convention. Use two columns (`Dimension`, `GraphQL`,
        `Typical REST API` — 3 columns total, `cols="1,2,2"` or similar) matching the issue's table shape.
  - [ ] Task 1.6. `== Where GraphQL clearly wins` — bullet list per the issue: many heterogeneous clients evolving
        at different speeds; screens composing several services (BFF/federation); mobile on high-latency links;
        backoffice/self-service data surfaces; fast-iterating product UI.
  - [ ] Task 1.7. `== Where REST (or gRPC) is the better answer` — bullet list per the issue: latency-critical hot
        paths wanting one hand-tuned query; binary upload/download/streaming; simple CRUD with a single client;
        partner/M2M contracts favoring stability and HTTP caching; CDN-cached public content; internal
        service-to-service hot paths (gRPC); webhooks/callbacks; and explicitly: a team that cannot own the
        demand-control/index/observability work, since an unhardened GraphQL endpoint is worse than a boring
        REST one.
  - [ ] Task 1.8. `== The two deployment profiles` — the internal/backoffice vs. public/partner profile table from
        the issue (11 rows), framed explicitly as an axis of **caller trust**, not network location. Include the
        corrected framing from issue Context point 5: the security half of "internal is safer" is right and
        stronger than commonly stated; the performance half does not follow (internal callers can be worse
        offenders — ad hoc queries, large page sizes, whole-table exports); and the only control that should
        actually be dropped internally is trusted documents, not pagination ceilings/cost budgets/timeouts/
        resource isolation, which matter more internally, not less.
  - [ ] Task 1.9. `== Tips for running both side by side` — all 29 tips from the issue, grouped exactly as
        specified: **Topology** (6 tips — including that a path is not a security boundary, and that separate
        deployments/network controls are), **Query-plan and index discipline** (10 tips — headlined by "the
        schema's argument surface is the index contract": expose a closed `orderBy` enum and fixed filter set,
        never a generic `where`, and assert the index contract in CI with `EXPLAIN`), **Hardening the GraphQL
        surface** (7 tips), **Operating it** (6 tips, including tagging datastore queries with the originating
        GraphQL operation name/client build via sqlcommenter-style tagging, and designing nullability for
        degradation).
  - [ ] Task 1.10. `== Decision checklist` — the full 15-row scenario -> recommendation table from the issue.
  - [ ] Task 1.11. `== Related pages` — bullet list of xrefs (unquoted `xref:`, matching `serving-over-http.adoc`'s
        style) to: `getting-started.adoc`, `security-and-demand-control.adoc`, `caching.adoc`,
        `performance-and-n-plus-1.adoc`, `pagination.adoc`, `authorization.adoc`, `serving-over-http.adoc`,
        `schema-design.adoc`, `federation.adoc`, plus (verify these paths exist in the repo before adding; if any
        does not exist, omit that specific xref rather than linking a nonexistent page)
        `xref:backend/springboot/api-first-rest-and-grpc.adoc`,
        `xref:backend/hibernate/fetching-and-n-plus-1.adoc`,
        `xref:backend/hibernate/performance-and-statistics.adoc`, `xref:database/sql/ddl.adoc`, and
        `xref:database/choosing-the-right-database.adoc`. Each bullet needs a one-clause description tying it to
        this page, per convention.
  - [ ] Task 1.12. `== Further reading` — the 16 external references from the issue's "References" section as a
        bullet list of links with a short description each, followed by a `[NOTE]` AI-assisted-content admonition
        using the established phrasing (e.g. "This page is generated with the assistance of AI ... verify against
        official documentation before relying on it in production, and every recommendation here is either cited
        to official documentation or marked as a judgement call.").
  - [ ] Task 1.13. Re-read the drafted page end-to-end against the issue's 22 acceptance-criteria checkboxes (the
        `## Acceptance criteria` list in the issue body) and confirm each is satisfied by the page content written
        above — in particular the three corrected premises (introspection lockdown is reconnaissance-only, not
        load-bearing; "internal" lowers abuse risk but not performance risk; GraphQL relocates complexity to the
        server platform rather than removing it) and the final framing as "predictability and control of access
        paths vs. client iteration speed," with the practical answer usually being hybrid.

### Group 2 — Wire cross-references

**Parallelizable: yes** (each task edits a distinct file; all depend on Group 1 having finalized the new page's
exact title/path, so this group runs after Group 1, not in parallel with it)

- [ ] Task 2. Add nav entry in `modules/ROOT/nav.adoc`
  - [ ] Task 2.1. Insert a new `****`-level line
        `**** xref:backend/graphql/when-to-use-graphql-or-rest.adoc[Tips: When to Use GraphQL or a Typical REST API]`
        between the existing `federation.adoc` line (line 559) and the `spring-boot-getting-started.adoc` line
        (line 560) — do not renumber or touch any other line in the file.

- [ ] Task 3. Add a new group to `modules/ROOT/pages/backend/graphql/index.adoc`
  - [ ] Task 3.1. Insert a new `=== Choosing between GraphQL and REST` group immediately after the
        `=== Execution & operating a server` group's final bullet (the `federation.adoc` bullet, line 79) and
        before the `=== Spring Boot integration` heading (line 82) — mirroring the nav placement in Task 2.1.
        Content: one bullet,
        `* xref:backend/graphql/when-to-use-graphql-or-rest.adoc[Tips: When to Use GraphQL or a Typical REST API] -- <one-line summary>.`,
        matching the exact bullet format used by every other entry in this file.

- [ ] Task 4. Forward link from `modules/ROOT/pages/backend/graphql/getting-started.adoc`
  - [ ] Task 4.1. At the paragraph ending "...a typed schema enforced by the server." (immediately before
        `== The request/response envelope`, around line 61), append one sentence pointing to the new page, e.g.
        "See `xref:backend/graphql/when-to-use-graphql-or-rest.adoc[Tips: When to Use GraphQL or a Typical REST
        API]` for a fuller comparison of when each model is the better fit." Do not otherwise alter the existing
        paragraph.

- [ ] Task 5. Link from `modules/ROOT/pages/backend/graphql/security-and-demand-control.adoc`
  - [ ] Task 5.1. Add one bullet to the existing `== Further reading` section (around lines 282-292), following
        that section's existing backtick-quoted-xref style, e.g.
        `` * `xref:backend/graphql/when-to-use-graphql-or-rest.adoc[Tips: When to Use GraphQL or a Typical REST API]` -- <clause>. ``

- [ ] Task 6. Link from `modules/ROOT/pages/backend/graphql/caching.adoc`
  - [ ] Task 6.1. This page has no dedicated closing section — add one clause with an inline
        `` `xref:backend/graphql/when-to-use-graphql-or-rest.adoc[...]` `` link to the closing prose paragraph
        after `== Summary`, matching how that paragraph already links to `performance-and-n-plus-1.adoc` inline.

- [ ] Task 7. Link from `modules/ROOT/pages/backend/graphql/serving-over-http.adoc`
  - [ ] Task 7.1. Add one bullet to the existing `== Related pages` section (around lines 336-347), following
        that section's unquoted-`xref:` style, e.g.
        `* xref:backend/graphql/when-to-use-graphql-or-rest.adoc[Tips: When to Use GraphQL or a Typical REST API] -- <clause>.`

### Group 3 — Build verification

**Parallelizable: yes** (single task; depends on Groups 1 and 2 both being complete)

- [ ] Task 8. Verify the Antora build
  - [ ] Task 8.1. Delegate to a sub-agent (`Agent({description: "Build docs site for issue 102", subagent_type:
        "iru-gate-runner", prompt: "Invoke Skill({skill: \"iru-build-docs\"}) and report back only: whether the
        build succeeded, and the exact text of any xref/AsciiDoc error or warning it produced (file:line and
        message) — do not dump the full build log."})`) rather than running `npx antora antora-playbook.yml`
        directly in the main conversation, so the build log doesn't consume the main context window.
  - [ ] Task 8.2. If the sub-agent reports any `xref`/AsciiDoc error (e.g. a broken cross-reference introduced in
        Group 1 or 2, most likely from one of the `Related pages` xrefs in Task 1.11 pointing at a path that
        doesn't actually exist), fix the specific broken reference and re-run Task 8.1 until the build is clean.
