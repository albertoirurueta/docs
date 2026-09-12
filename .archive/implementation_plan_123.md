# Implementation Plan: Near-Far Caches (SpringBoot Reference)

## Task summary

Source: GitHub issue #123
Base branch: main

Add one new page, `modules/ROOT/pages/backend/springboot/near-far-caches.adoc`, to the existing **SpringBoot
Reference** section (`modules/ROOT/pages/backend/springboot/`). The page explains the near-far (two-level,
L1/L2) caching pattern conceptually, compares it against the pure-local and pure-distributed options already
documented in `caching.adoc`, and shows concrete Spring Boot implementation options combining Caffeine (near/L1)
and Redis (far/L2): a manual two-tier lookup, a custom composite `CacheManager`, and Redisson's
`RLocalCachedMap`. Then wire the page into `nav.adoc`, the section landing page's `index.adoc`, and
`caching.adoc`'s existing closing paragraph that first gestures at this pattern.

### Choices made on the user's behalf (best-practice defaults — challenge in review)

1. **Content-only, untagged plan.** This repo has no application source code — every task is AsciiDoc authoring.
   `find .claude/skills -maxdepth 1 -type d -name "*-code-one-task"` returns only `java`, `dotnet`,
   `java-springboot`, and `database` — none covers AsciiDoc — so no task carries a language/framework tag,
   matching every prior documentation plan in `.archive/`.
2. **Closest precedent:** `.archive/implementation_plan_61.md` (issue #61 — added `hibernate.adoc`,
   `elasticsearch.adoc`, `solr.adoc`, `spring-batch.adoc` to this same section). This plan follows its
   conventions directly: page header (`= Title` / `:description:` / `:keywords:` / disclaimer include), one
   primary figure per page (`[mermaid]` for behavioral/flow diagrams — no spatial layout is needed here, so no
   SVG), a closing `== References` section of official-doc links only, nav insertion immediately after a named
   sibling entry, and an `index.adoc` "What's covered" + bibliography update, verified with a delegated Antora
   build.
3. **Page length:** ~200–300 lines — slightly longer than the ~150–300 budget used for the four overview pages
   in issue #61, since this page (per the issue) needs a full pros/cons comparison plus three implementation
   options with code samples, not just a single concept overview.
4. **Nav & index placement:** insert `near-far-caches.adoc` immediately **after** `caching.adoc` in both
   `nav.adoc` (currently line 521, `**** xref:backend/springboot/caching.adoc[Caching]`) and `index.adoc`'s
   `=== Caching` bullet list — it's a direct, deliberate extension of that page's closing section, not a
   standalone topic.
5. **`near-far-caches.adoc` vs. `caching.adoc` boundary (no overlap):** `caching.adoc` keeps ownership of
   `@Cacheable`/`@CachePut`/`@CacheEvict`, the Caffeine and Redis dependency/config snippets, serialization, and
   cache-aside vs. read/write-through — `near-far-caches.adoc` **does not repeat these**, it cross-links to them
   (e.g. "see caching.adoc for the `maximumSize`/`expireAfterWrite` and `time-to-live` knobs used below") and
   focuses only on the two-tier composition, its trade-offs, and its Spring Boot wiring.
6. **`caching.adoc` gets a small edit, not a rewrite:** per the issue's acceptance criteria, replace the closing
   "near cache" paragraph (lines 305–309 of the current file, inside `== Choosing between Caffeine and Redis`)
   with a shorter pointer to the new page, so the pattern is described once, in depth, in one place.
7. **One primary figure:** a `[mermaid]` `flowchart TD` showing the read path — near-cache check → hit (return)
   / miss → far-cache check → hit (populate near, return) / miss → source of truth (populate both, return) —
   this is a control-flow diagram, not a spatial layout, so mermaid is the right tool per the section's own
   "mermaid by default, SVG only for spatial layouts" convention.
8. **Bibliography addition:** `index.adoc`'s `== Bibliography` currently has no Caffeine or Redisson entries
   (only a generic Spring Data Redis line) — `caching.adoc` itself never added one either, but this new page's
   `== References` will cite Redisson's docs directly, so a bibliography bullet is added for consistency with
   the issue-#61 convention of keeping references and bibliography in sync, rather than compounding the existing
   gap.
9. **Redisson dependency naming:** use `org.redisson:redisson-spring-boot-starter` (the current Spring
   Boot–integrated Redisson artifact) rather than the bare `redisson` client, since the page is specifically
   about Spring Boot integration.
10. **Reference implementations named in the issue** (`spring-boot-multi-layer-cache`,
    `spring-boot-multilevel-cache-starter`) are mentioned in prose as illustrative open-source examples with
    inline links, **not** placed in the `== References` section — that section stays official-docs-only per
    section convention (the one precedent exception was a Spring-authored blog post announcing a deprecation,
    not a third-party example project).

## Current code state

- **Section directory:** `modules/ROOT/pages/backend/springboot/` — AsciiDoc pages all following one house
  style: `= Title`, `:description:`/`:keywords:` attribute lines, `include::partial$springboot-disclaimer.adoc[]`,
  `==`/`===` sections, fenced code as `[source,java]`/`[source,yaml]`/`[source,xml]` with `----` delimiters,
  diagrams as `[mermaid]` + `....`-delimited blocks, pages ending in `== References`.
- **`modules/ROOT/pages/backend/springboot/caching.adoc`** (312 lines) — already documents the Spring Cache
  abstraction (`@Cacheable`/`@CachePut`/`@CacheEvict`, SpEL `condition`/`unless`), `ConcurrentMapCacheManager`
  and Caffeine as local providers (`maximumSize`, `expireAfterWrite`, `expireAfterAccess`, `recordStats`), Redis
  as the distributed provider (`spring.cache.type: redis`, `time-to-live`, `key-prefix`), JSON serialization via
  `GenericJackson2JsonRedisSerializer`, and cache-aside vs. read/write-through. Its final section, `== Choosing
  between Caffeine and Redis` (lines 296–311), ends with the paragraph to be replaced (lines 305–309):
  > The two are not mutually exclusive: a common pattern layers a small Caffeine cache in front of a larger
  > Redis cache (a "near cache") to absorb the hottest keys locally while still sharing the bulk of the data,
  > though Spring Boot's auto-configuration only wires up one `CacheManager` at a time -- combining both
  > requires a custom `CacheManager` that delegates between them.
- **`modules/ROOT/nav.adoc`** — the SpringBoot Reference block runs roughly lines 505–540; line 521 is
  `**** xref:backend/springboot/caching.adoc[Caching]`, immediately after `spring-batch.adoc` (520) and before
  `rest-apis.adoc` (522). Entries are `**** xref:backend/springboot/<file>[Label]`.
- **`modules/ROOT/pages/backend/springboot/index.adoc`** — the section landing page: `:description:` (line 2)
  and `:keywords:` (line 3) enumerate every sub-topic; `== What's covered` is grouped by topic, with `=== Caching`
  at lines 91–94 holding one bullet for `caching.adoc`; `== Bibliography` (from line ~183) is grouped into bullet
  clusters of related official-doc links, currently with no Caffeine/Redisson-specific entry (only a generic
  Spring Data Redis reference at line 199).
- **`modules/ROOT/partials/springboot-disclaimer.adoc`** — the shared `[IMPORTANT]` admonition included at the
  top of every section page; no change needed.
- **Build/verification:** `npx antora antora-playbook.yml` (local content only) must complete with no
  `xref`/AsciiDoc errors; `build/` is gitignored. The `iru-build-docs` skill wraps this; the `iru-gate-runner`
  agent is installed at `.claude/agents/iru-gate-runner.md`.
- **No `*-code-one-task` skill applies** — AsciiDoc authoring is implemented directly (see Choice 1).

## Implementation steps

### Group 1 — Author the new page (Parallelizable: yes — single task)

- [x] **Task 1. Create `modules/ROOT/pages/backend/springboot/near-far-caches.adoc`** — new page, ~200–300
      lines; primary figure is a `[mermaid]` `flowchart TD` of the near→far→source-of-truth read path;
      cross-links to `caching.adoc` (multiple places) and to `database/choosing-the-right-database.adoc` if it
      naturally fits the "when it's worth it" discussion; docs-only.
      Created at 261 lines (within the 200–300 target). No cross-link to
      `database/choosing-the-right-database.adoc` was added -- that page is about choosing a database engine,
      not caching hot keys, so it didn't naturally fit the "When it's worth it" discussion; multiple cross-links
      to `caching.adoc`'s Local caching and Distributed caching with Redis sections were added instead as
      specified.
  - [x] Task 1.1. Header (`= Near-Far Caches`, `:description:`, `:keywords:`, disclaimer include) added exactly
        as specified.
  - [x] Task 1.2. `== What is a near-far cache?` added, with the `[mermaid]` `flowchart TD` read-path diagram
        (near hit / near miss+far hit / both miss, all four outcomes labeled).
  - [x] Task 1.3. `== Pure local vs. pure distributed vs. near-far` added as a three-bullet comparison,
        cross-linking `caching.adoc`'s Local caching and Distributed caching with Redis sections instead of
        re-explaining their config knobs.
  - [x] Task 1.4. `== Consistency and invalidation` added, with `=== TTL-only invalidation` and
        `=== Active invalidation` subsections (including the at-most-once delivery caveat).
  - [x] Task 1.5. `== When it's worth it` added as a single paragraph covering the read-heavy/hot-key case, the
        strict read-your-writes/uniform-access counter-case, and the two-eviction-policies operational cost.
  - [x] Task 1.6. `== Spring Boot implementation options` added with all three required subsections: manual
        two-tier lookup (`[source,java]` sketch), a custom composite `CacheManager` (`[source,java]` `NearFarCache
        implements Cache` + `CacheManager` bean), and Redisson's `RLocalCachedMap` (`[source,xml]` dependency +
        `[source,java]` `LocalCachedMapOptions` snippet with `INVALIDATE`/`UPDATE` sync strategy).
  - [x] Task 1.7. `== Reference implementations` added, linking both named open-source examples in prose.
  - [x] Task 1.8. `== Choosing an approach` added as closing decision-guidance bullets matching `caching.adoc`'s
        style.
  - [x] Task 1.9. `== References` added with exactly the five specified official-source links (Spring Boot
        caching reference, Caffeine wiki, Redis Pub/Sub, Redis keyspace notifications, Redisson wiki -- Local
        Cache). Adding these to `index.adoc`'s bibliography is Task 4, owned by Group 2.

### Group 2 — Wire the new page in (Parallelizable: yes — `nav.adoc`, `index.adoc`, and `caching.adoc` are three different files; all require Group 1 complete so `xref`s resolve)

- [x] **Task 2. Add the nav entry in `modules/ROOT/nav.adoc`** — inserted
      `**** xref:backend/springboot/near-far-caches.adoc[Near-Far Caches]` immediately after the
      `**** xref:backend/springboot/caching.adoc[Caching]` line (line 521), at the same `****` depth. Confirmed
      via `grep -n` that only one `caching.adoc` nav line existed before inserting.
- [x] **Task 3. Update `modules/ROOT/pages/backend/springboot/index.adoc` "What's covered"`** —
  - [x] Task 3.1. Added a second bullet after the existing `caching.adoc` one in `=== Caching`, exactly as
        specified, cross-linking `near-far-caches.adoc`.
  - [x] Task 3.2. Extended `:description:` (line 2) with "caching (including near-far/multi-level caching)" and
        `:keywords:` (line 3) with `near-far cache, multi-level cache, L1 cache, L2 cache, Caffeine, Redisson,
        RLocalCachedMap`, matching the existing comma-separated style.
- [x] **Task 4. Add a bibliography entry in `modules/ROOT/pages/backend/springboot/index.adoc`** — added one new
      bullet cluster after the Spring Data Redis line (now ~line 200) citing the Caffeine wiki, Redis Pub/Sub,
      Redis keyspace notifications, and the Redisson wiki's Local Cache section, matching the existing
      bullet-cluster style. Cross-checked all five URLs in `near-far-caches.adoc`'s `== References`: the Spring
      Boot caching reference URL was already covered by the existing general Spring Boot reference-docs bullet
      (line ~189–192), and the remaining four (Caffeine wiki, Redis Pub/Sub, Redis keyspace notifications,
      Redisson wiki -- Local Cache) were genuinely missing, so all four were added in the new bullet.
- [x] **Task 5. Edit `modules/ROOT/pages/backend/springboot/caching.adoc`'s closing section** — replaced the
      first sentence of the closing paragraph in `== Choosing between Caffeine and Redis` (the "near cache"
      sentence) with the shorter pointer to `xref:backend/springboot/near-far-caches.adoc[Near-Far Caches]`,
      keeping the following sentence (provider auto-detection / `spring.cache.type` / link to the Spring Boot
      caching reference) and the two bullet points above it unchanged. Verified via the `iru-gate-runner` agent
      running `iru-build-docs`: the Antora build completed with no xref/AsciiDoc warnings or errors, and both
      `caching.html` and `near-far-caches.html` built successfully.

### Group 3 — Build verification (Parallelizable: yes — single task; requires Groups 1–2 complete)

- [x] **Task 6. Verify the Antora build is clean** — delegate to the `iru-gate-runner` agent rather than running
      the build inline:
      `Agent({description: "Build Antora docs and report warnings", subagent_type: "iru-gate-runner", prompt:
      "Invoke Skill({skill: \"iru-build-docs\"}) to build this repo's Antora site. Report only: whether the
      build completed, and any xref/AsciiDoc warnings or errors (file + message), especially any referencing
      backend/springboot/near-far-caches.adoc, backend/springboot/caching.adoc, nav.adoc, or
      backend/springboot/index.adoc."})` — the sub-agent reported `npx antora --fetch antora-playbook.yml` exited
      0 with no output at all: no xref/AsciiDoc warnings or errors anywhere, and
      `backend/springboot/near-far-caches.html`, `backend/springboot/caching.html`, and
      `backend/springboot/index.html` all built successfully.
  - [x] Task 6.1. No unresolved `xref`, missing image, or AsciiDoc error was reported — nothing to fix; the
        build was already warning-free.
  - [x] Task 6.2. `near-far-caches.adoc` is 261 lines (within the ~200–300 target). Its `== References` section
        (5 links) is official-source only — Spring Boot caching reference, Caffeine wiki, Redis Pub/Sub docs,
        Redis keyspace notifications docs, and the Redisson wiki — while the two third-party example
        repositories (`spring-boot-multi-layer-cache`, `spring-boot-multilevel-cache-starter`) remain in the
        "Reference implementations" prose section as intended.
