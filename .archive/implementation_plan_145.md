# Implementation Plan: Guides & References / Databases — Redis Reference

## Task summary

Source: GitHub issue #145
Base branch: main

Issue [#145](https://github.com/albertoirurueta/docs/issues/145) asks for a new **Redis Reference** section under
**Guides & References / Databases** in this repo's own `ROOT` Antora component, at
`modules/ROOT/pages/database/redis/`. It is a sibling of the existing MongoDB, Couchbase, Elasticsearch, Solr,
Lucene, Neo4j, Prometheus and Qdrant references. The section documents **Redis Open Source 8.10**, where the
former Redis Stack modules are built in: the Query Engine, JSON, time series, the probabilistic types, vector
sets and arrays. The official docs at https://redis.io/docs/latest are the primary source, cross-checked against
a Packt book the requester provided. Coverage runs from the data-structure fundamentals, through the multi-model
capabilities, programmability and operations, to three Spring Boot integration pages (`@Cacheable` cache, Spring
Data Redis / Redis OM Spring / Lua custom queries, Spring AI vector store) and three cloud deployment pages (AWS,
Google Cloud, Azure).

The issue is very detailed. It names 35 concept pages, the official docs areas behind each one, per-page figure
suggestions, a shared *Bookshop* example scenario, the disclaimer rule, the bibliography content and ~17
cross-link edits to existing pages. This plan follows it, with the scope reductions the user chose during
exploration (below). The closest structural precedent is `.archive/implementation_plan_132.md` (issue #132,
Neo4j Reference: 20 files, disclaimer → content pages → wiring → build). This plan mirrors its task-group shape
and page conventions, minus the cheat-sheet group.

### Choices made on the user's behalf, or confirmed by the user during exploration

1. **Scope reduced to Lucene/Neo4j size (user decision).** The issue's 35 concept pages are consolidated into
   **25 content pages + `index.adoc` = 26 files**. Lucene has 29 files and Neo4j 20. Merges are only between
   pages whose topics are adjacent in the docs and short enough to share a page:
   * architecture + keyspace/expiration/eviction → `architecture-keyspace-and-eviction.adoc`
   * lists/sets/sorted sets/arrays + geospatial → `lists-sets-sorted-sets-arrays-and-geospatial.adoc`
   * streams + pub/sub & keyspace notifications → `streams-and-pub-sub.adoc`
   * probabilistic structures + time series → `probabilistic-and-time-series.adoc`
   * Query Engine full-text search + aggregations → `query-engine-search-and-aggregations.adoc`
   * vector sets + Query Engine vector search → `vector-search.adoc`
   * pipelining/transactions/multi-key + Lua scripts & Functions → `pipelining-transactions-and-scripting.adoc`
   * persistence + "Redis as a primary database" → `persistence-and-primary-database.adoc`
   * replication & Sentinel + Redis Cluster → `replication-sentinel-and-cluster.adoc`
   * the two use-case pages → `use-cases-and-patterns.adoc`

   Content from a merged page is condensed, not dropped. Every concept and command family the issue lists for
   the source pages still appears, with at least one example, just with less narrative per item. The three
   Spring Boot pages and the three cloud pages stay separate as the issue requests.
2. **No cheat sheet (user decision).** No `cheat-sheet.adoc`, no `modules/ROOT/attachments/redis-cheat-sheet.pdf`,
   no nav entry for one. The `index.adoc` "What's covered" list does not mention one. The issue's cheat-sheet
   acceptance criterion is dropped.
3. **The book is confirmed present** at `~/Desktop/redis.pdf` (6.8 MB): Fugaro & Ortensi, *Redis Stack for
   Application Modernization*, Packt, 2023, ISBN 978-1-83763-818-5. It is used only for concept narrative and
   the practitioner's angle, **never as the source of a code example**. It is cited **only** in `index.adoc`'s
   `== Bibliography`, with the Packt page
   https://www.packtpub.com/en-us/product/redis-stack-for-application-modernization-9781837638185 and the code
   bundle https://github.com/PacktPublishing/Redis-Stack-for-Application-Modernization . Where the book is
   outdated (Redis Stack packaging, JS triggers & functions, RedisGears/RedisGraph, Jedis 5 / Spring Boot 3.0,
   RedisInsight 2.x, "Redis Enterprise" naming, Azure Cache for Redis Enterprise), the page says so in one
   prose line and documents the current approach.
4. **Disclaimer shape follows the issue's rule, not the Neo4j/Qdrant shape.** `redis-disclaimer.adoc` has
   **only** the house AI-assistance sentence and the bibliography pointer. It has no version line and no "linked,
   not documented in depth" list. The code baseline goes in plain prose in `index.adoc` and in each page's lead.
   **No other admonition block** (`NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT`) appears anywhere under
   `database/redis/`. Deprecations, `KEYS`/`FLUSHALL` warnings, retirement dates and security cautions are
   written as prose or table rows.
5. **Code baseline**: Redis Open Source 8.10 (8.10.2), Jedis 8, Lettuce 7.7, Spring Boot 4.1, Spring Data Redis
   4.1, Spring AI 2.0, Redis OM Spring 1.0, Spring Session 4.1, Redis Insight 3.8, Testcontainers 2.0. These are
   **re-verified with WebFetch/WebSearch against redis.io, docs.spring.io, the GitHub release pages and each cloud
   provider's docs at implementation time**. If a newer line is stable, use it and state it on `index.adoc`.
   Nothing is pinned from memory. Command syntax for 8.x-only commands (`INCREX`, `DELEX`, `MSETEX`, `HGETEX`/
   `HSETEX`, `XADD … IDMP`, `XNACK`, `LMOVEM`, `FT.HYBRID`, `VADD`/`VSIM`, the Array type, `BACKUP`, `HOTKEYS`)
   is copied from its redis.io command page before it is used in an example.
6. **Example style**: `[source,shell]` for `redis-cli` sessions, with the command after a `127.0.0.1:6379>`
   prompt and the reply shown, runnable against `docker run -p 6379:6379 redis:8`. `[source,java]` covers Jedis
   (`UnifiedJedis`/`RedisClient`), Lettuce and Spring Boot. `[source,yaml]`/`[source,properties]` covers Spring
   config. `[source,xml]` covers Maven. `[source,hcl]`/`[source,bicep]` covers IaC. `[source,lua]` covers
   scripts. Every example is followed by a link to the official page it derives from. No `source-highlighter`
   is configured, so these render as plain monospace, consistent with the site.
7. **Figures**: **8 hand-authored SVGs** (`modules/ROOT/images/redis-*.svg`) plus **at least one `[mermaid]` block
   on every other content page**. This replaces the issue's ~60 per-page figure suggestions, in proportion to
   the reduced scope. SVGs match the current house style, confirmed from `qdrant-hnsw-index.svg`: a
   `viewBox="0 0 760 480"`-scale canvas, `font-family="Helvetica, Arial, sans-serif"`, a white background
   `<rect>`, hardcoded hex colours, a bold title plus a grey subtitle line, and no CSS-variable or dark-mode
   theming. Embed them as `image::redis-….svg["<full alt text>",width=720,role=text-center]`. All mermaid is
   validated with `npm run validate:mermaid`.
8. **No language/framework tag on any task.** This is a documentation-only change to an Antora/AsciiDoc site. The
   installed keys (`java`, `java-springboot`, `dotnet`, `database`) implement application code, and Java/Redis
   code appears only inside `[source]` example blocks. Every task is implemented directly, as in plans #84 and
   #132.
9. **Nav placement**: after the Qdrant Reference block's last line
   (`**** xref:database/qdrant/cheat-sheet.adoc[Cheat Sheet (PDF)]`) and before
   `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`, as the issue specifies. The same
   ordering applies in `database/index.adoc`'s `== Sections`.
10. **No project-picker icon** and no structural change to the site home: `pages/index.adoc` gets only the
    `:keywords:` additions the issue lists.
11. **Cross-link edits target the consolidated page names.** The issue's cross-link list names pre-merge files
    such as `pubsub-and-keyspace-notifications.adoc`, `vector-sets.adoc` and
    `use-cases-caching-sessions-and-rate-limiting.adoc`. Group 6 rewrites every such target to the page that now
    holds that content (mapping in Task 29).

## Current code state

- This repo holds the Antora playbook and the `ROOT` component. `modules/ROOT/pages/` contains a large local
  Guides & References library (`database/`, `backend/`, `web/`, …). CLAUDE.md understates this. There is **no
  Redis section today**: no `database/redis/` directory, no `partials/redis-disclaimer.adoc`, no
  `images/redis-*.svg`. Redis is mentioned only in passing on the pages listed under Group 6.
- **`antora-playbook.yml`** wires `ROOT` (`url: .`), the UI bundle, `@antora/lunr-extension`,
  `@sntke/antora-mermaid-extension` and `@djencks/asciidoctor-mathjax`. The build command is
  `npx antora antora-playbook.yml`. There is no test suite: success means the build completes with zero
  `xref`/AsciiDoc/missing-image errors and zero "skipping reference to missing attribute" warnings.
  `package.json` has `"validate:mermaid": "node scripts/validate-mermaid.mjs"`.
- **`modules/ROOT/nav.adoc`**: the Databases block runs from line 34. Qdrant is at lines 211–221 and ends with
  `**** xref:database/qdrant/cheat-sheet.adoc[Cheat Sheet (PDF)]`. Line 222 is
  `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`. Match on this text, not on the
  line numbers.
- **`modules/ROOT/pages/database/index.adoc`**: `= Database Development` with a long `:description:` (which lists
  every subsection, ending "…, Prometheus & Monitoring and Qdrant Reference documentation subsections, and the
  Evolving the Database Model guide…") and `:keywords:`. `== Sections` has one bullet per subsection. The Qdrant
  bullet is followed by the Evolving the Database Model bullet.
- **Page shape to mirror** (`database/qdrant/*.adoc`, `database/neo4j/*.adoc`): `= Title`, then
  `:description:` (one sentence), then `:keywords:`, a blank line, the `include::partial$…-disclaimer.adoc[]`,
  a lead paragraph and `==` sections. Landing pages have a reading-order paragraph, `== What's covered` (grouped
  bullets, one per page) and `== Bibliography`. Book citations follow `database/neo4j/index.adoc`:
  `* Surname, First & Surname, First. _Title_. Publisher, Year. ISBN ####. Consulted as part of the bibliography
  for this section -- see <link>[the publisher's book page].` Per the issue, this section adds a closing
  `== References` on every content page listing only the online documentation that page derives from. A short
  `== Related pages` list of `xref:`s may precede it, as `qdrant/rag-integration-patterns.adoc` does.
- **Existing pages that already cover Redis-adjacent material.** Link to these; never repeat them.
  - `backend/springboot/caching.adoc`: `== Distributed caching with Redis` at line 196 (with `=== Serialization`
    at 241 and `=== Cache-aside vs. read/write-through` at 279) and `== Choosing between Caffeine and Redis` at
    296. `spring-boot-redis-as-a-cache.adoc` assumes this page and never re-explains annotations or the basic
    starter setup.
  - `backend/springboot/near-far-caches.adoc`: the Pub/Sub / keyspace-notifications invalidation paragraph is
    around lines 72–73. `=== Redisson's RLocalCachedMap` is at 206.
  - `backend/springboot/scheduling-and-shedlock.adoc`: `==== Redis` is at line 215 (`RedisLockProvider`).
  - `backend/springboot/spring-data-overview.adoc`: the module table's Redis row is at lines 389–390.
  - `backend/springboot/unit-and-integration-testing.adoc`: `GenericContainer<>("redis:7-alpine")` is at line
    250.
  - `backend/springboot/index.adoc`: it references `database/solr/index.adoc` from its Solr bullet (line 86–89).
    That is the pattern for a Redis pointer.
  - `backend/messaging/spring-boot-other-messaging-options.adoc`: the Redis pub/sub & Streams paragraph is at
    line 305.
  - `backend/quarkus/caching.adoc` and `backend/quarkus/nosql-and-other-stores.adoc` cover the Quarkus Redis side.
  - `backend/hibernate/second-level-cache.adoc`: Redis table row at lines 38–40.
    `backend/oauth/logout-and-session-management.adoc`: session store at line 245.
    `web/aspnet/core/performance-and-caching.adoc`: `AddStackExchangeRedisCache` at lines 59–60.
  - `database/choosing-the-right-database.adoc`: Redis at lines 335, 372 (key-value stores paragraph), 409, 507
    (table row) and 542 (mermaid decision-tree leaf `KVDB`).
  - `database/diagnosing-slow-queries.adoc`: `== Detecting Slow Queries` has
    `=== MongoDB, Elasticsearch, Solr & Hibernate` at line 110, `== Tools` at 196 and `== Sources` at 232. No
    Redis content.
  - `database/qdrant/rag-integration-patterns.adoc` (`== Related pages` at line 214),
    `database/elasticsearch/vector-and-semantic-search.adoc`, `database/neo4j/vector-search-and-genai.adoc` and
    `database/lucene/knn-vector-search.adoc` (`== Related pages` at line 193) cover HNSW/RAG theory. The Redis
    vector pages link these rather than re-explaining them.
  - `database/prometheus/exporters-and-pushgateway.adoc` covers exporters (`redis_exporter` gets a link).
  - `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`: catalogue-cache bullet at line
    217.
- **`.claude/agents/iru-gate-runner.md`** exists. The only verification for a docs-only change is the Antora
  build plus mermaid validation (Group 7), run through a sub-agent.
- **AsciiDoc gotchas, sharp for Redis.** Outside `[source]` blocks, a literal `{word}` is parsed as an attribute
  reference and emits a "skipping reference to missing attribute" warning. Redis prose constantly contains
  braces: Cluster **hash tags** (`{user:42}`), Query Engine **tag filters** (`@genre:\{fiction\}`), JSON objects,
  `KNN` param blocks. Escape them as `\{ … \}` in prose, admonition text, table cells and bullet text. Inside
  `[source]` blocks no escaping is needed. Also, never let a wrapped line start with `<digits>.` (e.g. a
  bibliography line starting `2023.`), because Asciidoctor reads it as an ordered-list marker. Neo4j's build hit
  exactly this.

## Shared *Bookshop* scenario (every content page uses these names — defined once here so parallel page authors stay consistent)

| Concern | Redis structure / name |
|---|---|
| Books (source of truth for search) | JSON documents `bookshop:book:<isbn>` with `$.isbn`, `$.title`, `$.author`, `$.genres[]`, `$.price`, `$.year`, `$.description`, `$.stock`, `$.embedding` (384-dim FLOAT32) |
| Sample ISBNs | `9780000000001` ("The Redis Way", fiction), `9780000000002` ("Streams in Practice", technology), `9780000000003` ("Vectors for Humans", technology) |
| Catalogue cache | string `bookshop:cache:book:<isbn>` (JSON-serialized, TTL 600 s); Spring cache name `books` |
| Cart | hash `bookshop:cart:<userId>`, field = ISBN, value = quantity, per-field TTL via `HEXPIRE` / `HSETEX` |
| Session | Spring Session keys `bookshop:session:sessions:<id>` (namespace `bookshop:session`) |
| Search index | `idx:books` `ON JSON PREFIX 1 bookshop:book:`; alias `books` |
| Vector search | `VECTOR` field `$.embedding AS embedding` (HNSW, COSINE, 384 dims); vector set `bookshop:vset:books` |
| Spring AI vector store | index `spring-ai-books`, prefix `bookshop:ai:` |
| Order events | stream `bookshop:orders`, consumer group `fulfilment`, consumers `worker-1`/`worker-2` |
| Best-sellers | sorted set `bookshop:bestsellers` (score = units sold) |
| Store locations | geo `bookshop:stores` |
| Recently viewed | list `bookshop:recent:<userId>` capped with `LTRIM` |
| Rate limit | `bookshop:ratelimit:<userId>` via `INCREX` (fixed window 60 s, limit 100) |
| "Already-seen ISBN" | Bloom filter `bookshop:seen-isbns`; unique visitors HLL `bookshop:visitors:<yyyy-mm-dd>` |
| Page-view metrics | time series `bookshop:ts:pageviews:<page>` (labels `app=bookshop page=<page>`), compaction to `…:1h` |
| Cache invalidation | pub/sub channel `bookshop:invalidate` |
| Inventory lock | `bookshop:lock:inventory:<isbn>` (`SET NX PX`, release with `DELEX IFEQ`) |
| Java package / types | `com.example.bookshop`, `record Book(String isbn, String title, String author, List<String> genres, BigDecimal price, int year)` |

## Conventions every content page must follow

- **Header**: `= <Title>`, `:description:` (one sentence), `:keywords:` (comma list), a blank line,
  `include::partial$redis-disclaimer.adoc[]`, then a lead paragraph. The lead states which Redis/client version
  line the page's examples target, in plain prose.
- **Every concept/command family gets at least one example** (`redis-cli` and/or Java) on the *Bookshop*
  scenario. **Every example is followed by a link** to the specific redis.io (or Spring/cloud) page it derives
  from.
- **Footer**: optional `== Related pages` (`xref:` list), then a mandatory `== References` listing only online
  documentation, each item linked.
- **No admonitions** except the disclaimer include (choice 4). Deprecations and cautions are prose.
- **No source attribution in prose.** The book is never named outside `index.adoc`'s `== Bibliography`.
  Book-vs-docs differences are phrased as "older Redis Stack releases did X; since 8.0 …", with no book reference.
- **Modern idioms only**: `SET … NX PX` (not `SETNX`), `GEOSEARCH` (not `GEORADIUS`), `redis:8` (not
  `redis/redis-stack`), Functions/Lua (triggers & functions only as a one-line history note), and "Redis
  Software" (not "Redis Enterprise Software").
- **Cross-link, don't repeat**: link sibling `xref:database/redis/<page>.adoc[…]` pages and the existing pages in
  "Current code state", and link Qdrant/Elasticsearch/Lucene/Neo4j for HNSW/RAG theory.
- **Escape `{ }` in prose** and avoid line-leading `<digits>.` (see gotchas).
- Every page must be reachable from both `database/redis/index.adoc` and `nav.adoc` once Group 6 lands.

## Implementation steps

### Group 1 — Foundational scaffolding

**Parallelizable: yes** (single task; every later page includes the partial it creates).

- [x] Task 1. Create `modules/ROOT/partials/redis-disclaimer.adoc` — created with only the AI-assistance sentence
  and the bibliography pointer, no version line, no book name (choice 4). No tests apply (docs-only). N/A
  coverage. No code-quality tooling applies to AsciiDoc partials.
  - [x] Task 1.1. Author an `[IMPORTANT]` / `====` block containing **only** (a) "This content was generated with
    the assistance of AI and should be verified against https://redis.io/docs/latest/[the official Redis
    documentation] before being relied on in production." and (b) "This section's
    xref:database/redis/index.adoc#_bibliography[bibliography] lists the reference material consulted while
    preparing these pages." Include no version line, no book name and no other sentences (choice 4). Compare
    against `qdrant-disclaimer.adoc` for markup only.
  - [x] Task 1.2. Confirm the include line every page will use: `include::partial$redis-disclaimer.adoc[]`.

### Group 2 — Content pages: foundations and core data types

**Parallelizable: yes.** There are 6 independent pages (Tasks 2–7). Each includes the Group 1 partial and only
`xref:`s other pages, and no page needs another page's finished text. Each task also authors any `redis-*.svg`
its page embeds. Group 7's build validates all of them together.

- [x] Task 2. Create `database/redis/getting-started.adoc` ("Getting Started") — created; disclaimer include,
  editions table, install/tools sections, Bookshop `compose.yaml` + redis-cli/Jedis/Lettuce examples, and
  `== References`. Docs-only: N/A tests/coverage, no code-quality tooling, license-header generation skipped
  (AsciiDoc content, not source code).
  - [x] Task 2.1. What Redis is/is not — covered.
  - [x] Task 2.2. Editions table (Redis Open Source, Redis Software, Redis Cloud, Valkey) with forward link to
    `redis-software-cloud-kubernetes-and-valkey.adoc`; 8.0 packaging change and BSD → RSALv2/SSPLv1 (7.4) →
    + AGPLv3 (8.0) licence history — covered.
  - [x] Task 2.3. Install (Docker, APT, RPM, Homebrew, snap, WSL2/Docker) — covered.
  - [x] Task 2.4. Tools (`redis-cli` flags, Redis Insight 3.8, Redis for VS Code) — covered.
  - [x] Task 2.5. Examples (Bookshop `compose.yaml`, first redis-cli session, Jedis + Lettuce hello world) —
    covered, each followed by a redis.io link.
  - [x] Task 2.6. Figure `modules/ROOT/images/redis-one-server-many-models.svg` created, house SVG style
    (`viewBox="0 0 760 480"`, hardcoded hex colors, no CSS vars/dark mode), embedded with full alt text.
  - [x] Task 2.7. References section present, linking get-started/install/redis-cli/Redis Insight/what's-new
    pages.
- [x] Task 3. Create `database/redis/architecture-keyspace-and-eviction.adoc` ("Architecture, Keyspace &
  Eviction") — created; disclaimer include, 2 `[mermaid]` blocks (validated via `npm run validate:mermaid`),
  `== References`. Docs-only: N/A tests/coverage, no code-quality tooling, license-header generation skipped.
  - [x] Task 3.1. Execution model (single-threaded loop, io-threads, RESP2/RESP3, buffer/client limits, slow
    commands) — covered.
  - [x] Task 3.2. Keyspace (Bookshop naming scheme, logical DBs, EXISTS/TYPE/RENAME/UNLINK, OBJECT ENCODING,
    SCAN vs. KEYS explained in prose, no admonition) — covered.
  - [x] Task 3.3. Expiration (EXPIRE family with NX/XX/GT/LT, lazy/active expiry, replication) — covered.
  - [x] Task 3.4. Eviction (maxmemory policies including LRU/LFU/LRM, maxmemory-samples, LFU tuning, OBJECT
    FREQ/IDLETIME, HOTKEYS) — covered.
  - [x] Task 3.5. Examples (HELLO 3, CLIENT LIST, redis-cli --latency, Jedis SCAN loop, CONFIG SET) — covered.
  - [x] Task 3.6. Figures: `redis-event-loop-io-threads.svg` created (house style) plus a `[mermaid]` eviction
    flowchart.
  - [x] Task 3.7. References section present (protocol, client handling, keyspace, eviction, latency).
- [x] Task 4. Create `database/redis/strings-bitmaps-and-bitfields.adoc` ("Strings, Bitmaps & Bitfields") —
  created; disclaimer include, 1 `[mermaid]` block (validated), `== References`. Docs-only: N/A tests/coverage,
  no code-quality tooling, license-header generation skipped.
  - [x] Task 4.1. Strings (SET NX/XX/GET/KEEPTTL/EX/PX plus 8.4 IF*-style conditions, GETEX/GETDEL,
    MSET/MSETEX, DELEX, INCR family + INCREX) — covered, each command's version gate sourced from redis.io.
  - [x] Task 4.2. Bitmaps (SETBIT/GETBIT/BITCOUNT/BITPOS/BITOP incl. 8.2 operators, BITFIELD overflow policies,
    int/embstr/raw encodings) — covered.
  - [x] Task 4.3. Examples (catalogue cache SET ... EX 600, daily-active bitmap, BITFIELD counter) — covered.
  - [x] Task 4.4. Figure: `[mermaid]` bitmap/bitfield layout diagram — covered.
  - [x] Task 4.5. References section present (strings, bitmaps, bitfields, SET, INCREX, BITOP).
- [x] Task 5. Create `database/redis/hashes.adoc` ("Hashes") — created; disclaimer include, 1 `[mermaid]` block
  (validated), `== References`. Docs-only: N/A tests/coverage, no code-quality tooling, license-header
  generation skipped.
  - [x] Task 5.1. Core hash commands, field expiration (HEXPIRE family 7.4, HSETEX/HGETEX/HGETDEL 8.0),
    listpack vs. hashtable, compact hashes/HIMPORT (8.10), subkey notifications (8.8) linked to
    `streams-and-pub-sub.adoc`, hash vs. JSON — covered.
  - [x] Task 5.2. Examples (Bookshop cart with per-item HEXPIRE, Jedis snippet) — covered.
  - [x] Task 5.3. Figure: `[mermaid]` hash-with-per-field-TTL diagram — covered.
  - [x] Task 5.4. References section present.
- [x] Task 6. Create `database/redis/lists-sets-sorted-sets-arrays-and-geospatial.adoc` ("Lists, Sets, Sorted
  Sets, Arrays & Geospatial") — created; disclaimer include, 1 `[mermaid]` block (validated) plus comparison
  table, `== References`. Docs-only: N/A tests/coverage, no code-quality tooling, license-header generation
  skipped.
  - [x] Task 6.1. Lists (LPUSH/RPUSH/LPOP/BRPOP/LMOVE/BLMOVE/LMOVEM 8.10, LTRIM), Sets (SADD/SISMEMBER/SINTER/
    SUNIONCARD/SDIFFCARD 8.10/SRANDMEMBER), Sorted sets (ZADD/ZRANGE/ZRANK/ZINCRBY/ZPOPMIN/BZMPOP/
    ZUNION/ZINTER) — covered.
  - [x] Task 6.2. The Array type (8.8, verified against redis.io: ARSET/ARGET/ARGETRANGE etc.), encodings and
    thresholds — covered.
  - [x] Task 6.3. Geospatial (GEOADD/GEOPOS/GEODIST/GEOSEARCH/GEOSEARCHSTORE, geohash, forward link to Query
    Engine GEO/GEOSHAPE fields) — covered.
  - [x] Task 6.4. Examples (`bookshop:recent`, `bookshop:bestsellers` top-10, nearest store in
    `bookshop:stores`) — covered.
  - [x] Task 6.5. Figure: `[mermaid]` structure-comparison diagram plus an AsciiDoc comparison table — covered.
  - [x] Task 6.6. References section present.
- [x] Task 7. Create `database/redis/streams-and-pub-sub.adoc` ("Streams, Pub/Sub & Keyspace Notifications") —
  created; disclaimer include, `redis-stream-consumer-groups.svg` figure plus 1 `[mermaid]` sequence (validated),
  `== References`. Docs-only: N/A tests/coverage, no code-quality tooling, license-header generation skipped.
  - [x] Task 7.1. Streams (XADD MAXLEN/MINID/NOMKSTREAM/IDMP/IDMPAUTO 8.6, XRANGE/XREVRANGE, XREAD incl. 8.10
    MAXCOUNT/MAXSIZE, consumer groups XGROUP/XREADGROUP/XACK/XNACK 8.8/XPENDING/XCLAIM/XAUTOCLAIM,
    XDELEX/XACKDEL 8.2, Kafka comparison with messaging-section link) — covered.
  - [x] Task 7.2. Pub/Sub (PUBLISH/SUBSCRIBE/PSUBSCRIBE, sharded SPUBLISH/SSUBSCRIBE, RESP3 push), keyspace
    notifications (notify-keyspace-events, OVERWRITTEN/TYPE_CHANGED, hash-field events), pub/sub vs. streams,
    cache invalidation cross-linked to `xref:backend/springboot/near-far-caches.adoc` — covered.
  - [x] Task 7.3. Examples (`bookshop:orders`/`fulfilment` via redis-cli and Lettuce xreadgroup,
    `bookshop:invalidate` pub/sub) — covered.
  - [x] Task 7.4. Figures: `redis-stream-consumer-groups.svg` created (house style) plus a `[mermaid]`
    keyspace-notification sequence diagram.
  - [x] Task 7.5. References section present (streams, pub/sub, keyspace notifications, XADD/XREADGROUP).

### Group 3 — Content pages: multi-model capabilities and programmability

**Parallelizable: yes.** There are 6 independent pages (Tasks 8–13). Same rules as Group 2. `idx:books` is
defined identically on every page that uses it, per the scenario table.

- [x] Task 8. Create `database/redis/json.adoc` ("JSON") — 230 lines; fixed one Mermaid parse error (array-literal
  brackets in a node label) found by `npm run validate:mermaid`.
  - [x] Task 8.1. JSON as a native type. JSONPath (`$.…`, filters, legacy `.` paths, and the 8.10 extensions).
    `JSON.SET`/`GET`/`MGET`/`MERGE`/`MSET`/`NUMINCRBY`/`ARRAPPEND`/`STRAPPEND`/`DEL`/`TYPE`. Partial reads and
    updates, RESP3 replies, memory (homogeneous numeric arrays), JSON vs. hash.
  - [x] Task 8.2. Examples: load the three Bookshop books, then decrement `$.stock` and merge a price change.
  - [x] Task 8.3. Figure: a `[mermaid]` diagram (or annotated `[source,json]` + table) of a book document with
    JSONPath expressions. One `[mermaid]` is required.
  - [x] Task 8.4. References: the JSON pages (path, indexing, RESP3, RAM) and command pages.
- [x] Task 9. Create `database/redis/probabilistic-and-time-series.adoc` ("Probabilistic Structures & Time Series")
  — 456 lines.
  - [x] Task 9.1. Probabilistic structures: HyperLogLog (`PFADD`/`PFCOUNT`/`PFMERGE`), Bloom (`BF.RESERVE`/`ADD`/
    `EXISTS`, error rate, capacity, scaling), Cuckoo (`CF.*`, deletes), Count-min sketch (`CMS.*`), Top-K
    (`TOPK.*`), t-digest (`TDIGEST.*`). A choice table and sizing notes.
  - [x] Task 9.2. Time series: `TS.CREATE` (retention, duplicate policy, chunk size, labels, encoding),
    `TS.ADD`/`TS.MADD`/`TS.INCRBY`, and `TS.RANGE`/`TS.MRANGE` with aggregations (multiple aggregators in 8.8,
    `COUNTNAN`/`COUNTALL`). Label filters, `TS.CREATERULE` compaction, `TS.MGET`, and the 8.10 `TS.NRANGE`/
    `TS.READ`/`TS.QUERYLABELS`. Grafana, linking `database/prometheus/index.adoc`.
  - [x] Task 9.3. Examples: `bookshop:seen-isbns`, `bookshop:visitors:<date>`, and
    `bookshop:ts:pageviews:home` with a `…:1h` rule.
  - [x] Task 9.4. Figure: a `[mermaid]` flowchart of raw series → compaction rule → downsampled series.
  - [x] Task 9.5. References: probabilistic and time-series pages and their command pages.
- [x] Task 10. Create `database/redis/query-engine-indexing-and-data-modeling.adoc` ("Query Engine: Indexing & Data
  Modeling") — 369 lines; fixed a wrong xref target (`search-and-aggregations.adoc` → the real sibling filename
  `query-engine-search-and-aggregations.adoc`, 2 occurrences) found by the Antora build.
  - [x] Task 10.1. `FT.CREATE idx:books ON JSON PREFIX 1 bookshop:book: SCHEMA …` with `TEXT` (weight,
    `NOSTEM`, `PHONETIC`, `SORTABLE`, `WITHSUFFIXTRIE`), `TAG` (separator, `CASESENSITIVE`), `NUMERIC`, `GEO`,
    `GEOSHAPE`, `VECTOR` (forward link), `INDEXMISSING`/`INDEXEMPTY`, JSONPath `AS`, and multi-value fields. The
    `ON HASH` variant. `FT.INFO`, `FT.ALTER`, and aliases (`FT.ALIASADD`/`FT.ALIASLIST`). This page defines the
    canonical `idx:books` schema (field names `isbn`, `title`, `author`, `genres`, `price`, `year`, `stock`,
    `description`, `warehouse_location` GEO, `embedding` VECTOR) that Tasks 11 and 12 reference.
  - [x] Task 10.2. `FT.DROPINDEX`, zero-downtime re-indexing through the `books` alias, and GC/memory and
    index-management best practices.
  - [x] Task 10.3. Figure: `[mermaid]` flowchart of an alias-based re-index.
  - [x] Task 10.4. References: indexing, schema definition, field options, administration and best-practices
    pages.
- [x] Task 11. Create `database/redis/query-engine-search-and-aggregations.adoc` ("Query Engine: Search &
  Aggregations") — 391 lines; renamed field references from `@genre`/`genre` to `@genres`/`genres` (12
  occurrences) to match the canonical `idx:books` schema Task 10 actually shipped.
  - [x] Task 11.1. `FT.SEARCH` (dialect 2 baseline): field modifiers, AND/OR/negation, exact phrases,
    prefix/infix/suffix/wildcard, fuzzy `%term%`, numeric `[a b]`, tag `\{…\}` (escaped in prose), geo filters,
    `SORTBY`/`LIMIT`/`RETURN`/`PARAMS`, scoring (BM25 default, TF-IDF, `EXPLAINSCORE`), `HIGHLIGHT`/`SUMMARIZE`,
    stemming, stop words, `FT.SYNUPDATE`, `FT.SPELLCHECK`, `FT.SUGADD`/`FT.SUGGET`, and `FT.EXPLAIN`/`FT.PROFILE`.
  - [x] Task 11.2. `FT.AGGREGATE`: `LOAD`, `GROUPBY … REDUCE` (`COUNT`, `SUM`, `AVG`, `MIN`/`MAX`,
    `COUNT_DISTINCT(ISH)`, `QUANTILE`, `TOLIST`, `FIRST_VALUE`, `RANDOM_SAMPLE`), `APPLY`, `SORTBY … MAX`,
    `FILTER`, `LIMIT`, and `WITHCURSOR` + `FT.CURSOR READ`. Faceted navigation (books per genre, average price
    per year).
  - [x] Task 11.3. Examples: all against `idx:books`, plus one Jedis `ftSearch` call.
  - [x] Task 11.4. Figure: a `[mermaid]` flowchart of the aggregation pipeline stages.
  - [x] Task 11.5. References: query, query syntax, dialects, scoring, aggregations pages.
- [x] Task 12. Create `database/redis/vector-search.adoc` ("Vector Search: Query Engine & Vector Sets") — 334 lines
  plus new `modules/ROOT/images/redis-vector-index-tradeoffs.svg` (house SVG style); fixed the same
  `@genre`→`@genres`/`.genre`→`.genres` field-name mismatch (5 occurrences) to match Task 10's schema.
  - [x] Task 12.1. Query Engine vectors: a `VECTOR` field with `FLAT`/`HNSW` (`M`, `EF_CONSTRUCTION`,
    `EF_RUNTIME`, `EPSILON`)/`SVS-VAMANA` (LVQ/LeanVec compression). Types `FLOAT32`/`FLOAT16`/`BFLOAT16` and
    metrics `COSINE`/`L2`/`IP`. KNN `*=>[KNN 10 @embedding $q]`, range `VECTOR_RANGE`, pre-filtered hybrid, and
    `FT.HYBRID` (RRF/linear fusion). Hash vs. JSON storage. Link HNSW theory to
    `xref:database/qdrant/vector-indexing-and-hnsw.adoc` and `xref:database/lucene/knn-vector-search.adoc`
    rather than re-explaining it.
  - [x] Task 12.2. Vector sets: `VADD` (`REDUCE`, `Q8`/`BIN`/`NOQUANT`, `SETATTR`), `VSIM` (`COUNT`, `EF`,
    `FILTER`, `WITHSCORES`), `VEMB`/`VGETATTR`/`VCARD`/`VDIM`/`VINFO`, filter expressions, and memory vs.
    quantization. Include a "vector sets vs. Query Engine `VECTOR` fields" table.
  - [x] Task 12.3. RAG, semantic cache and agent memory patterns (RedisVL and LangChain, named and linked only),
    with a forward link to `spring-boot-redis-as-a-vector-database.adoc`.
  - [x] Task 12.4. Examples: "similar books" KNN on `idx:books` and the same query with `VSIM` on
    `bookshop:vset:books`. Vectors shown as `PARAMS` blobs are abbreviated with a note on how they are produced.
  - [x] Task 12.5. Figures: `redis-vector-index-tradeoffs.svg` (FLAT vs. HNSW vs. SVS-VAMANA: recall, latency,
    memory, build cost) and a `[mermaid]` sequence of a RAG request.
  - [x] Task 12.6. References: the vectors, vector-search query, vector sets, RAG, RedisVL pages.
- [x] Task 13. Create `database/redis/pipelining-transactions-and-scripting.adoc` ("Pipelining, Transactions &
  Scripting") — 360 lines.
  - [x] Task 13.1. Round-trip cost and pipelining (client buffering, batch sizes). `MULTI`/`EXEC`/`DISCARD`
    semantics: no rollback, and how errors behave inside a transaction. `WATCH`/`UNWATCH` check-and-set.
    Multi-key commands, cross-slot limits and hash tags (escaped in prose).
  - [x] Task 13.2. Lua: `EVAL`/`EVALSHA`/`SCRIPT LOAD`, `KEYS`/`ARGV`, `redis.call` vs. `redis.pcall`, script
    flags, `EVAL_RO`. Functions: `FUNCTION LOAD`, `redis.register_function`, `FCALL`/`FCALL_RO`,
    `FUNCTION LIST`/`DUMP`/`RESTORE`, behaviour in Cluster and under replication. `busy-reply-threshold`,
    `SCRIPT KILL`/`FUNCTION KILL`, and the Lua debugger. The deprecated JS triggers & functions engine gets one
    history sentence.
  - [x] Task 13.3. Examples: a pipelined Jedis bulk load of books, a `WATCH`-guarded stock decrement, and a
    `bookshop` Function library with `reserve_stock`.
  - [x] Task 13.4. Figure: a `[mermaid]` state diagram of `WATCH` → `MULTI` → `EXEC` (success/abort).
  - [x] Task 13.5. References: pipelining, transactions, eval intro, functions intro, Lua API pages.

**Group 3 validation**: `npm run validate:mermaid` — all 460 diagrams (site-wide) parse cleanly after one fix.
`npx antora antora-playbook.yml` — zero missing-attribute/missing-image warnings from these 6 pages; remaining
`xref not found` errors touching these files all target pages owned by other groups (`database/redis/index.adoc`
from Group 6, `use-cases-and-patterns.adoc` from Group 4, `spring-boot-redis-as-a-vector-database.adoc` from
Group 5) and will resolve once those groups land — the same pre-existing pattern already present on the Group
1/2 pages. No admonitions, no book mentions outside scope, and no unescaped `{ }` outside source blocks in any
of the 6 new pages.

### Group 4 — Content pages: operations, clients and positioning

**Parallelizable: yes.** There are 7 independent pages (Tasks 14–20).

- [x] Task 14. Create `database/redis/persistence-and-primary-database.adoc` ("Persistence, Durability & Redis as a
  Primary Database")
  - [x] Task 14.1. RDB (`save` points, `BGSAVE`, fork/copy-on-write). AOF (`appendonly`,
    `appendfsync always/everysec/no`, multi-part AOF, rewrite). RDB + AOF together. `WAIT`/`WAITAOF`. `BACKUP`
    (8.10) and restore. The data-loss window of each profile.
  - [x] Task 14.2. Redis as a primary database: BASE vs. ACID, what atomicity/isolation Redis provides, the
    latency cost of durability knobs (`appendfsync always`, `WAITAOF`, `min-replicas-to-write`), consistency
    under failover, modelling with JSON + Query Engine, and when to pair Redis with a system of record (link
    `xref:database/choosing-the-right-database.adoc`).
  - [x] Task 14.3. Figures: `redis-rdb-vs-aof-timeline.svg` (the data-loss window per profile) and a `[mermaid]`
    flowchart "which persistence profile".
  - [x] Task 14.4. References: persistence, `WAIT`/`WAITAOF`, `BACKUP`, data-store pages.
  - Files: `modules/ROOT/pages/database/redis/persistence-and-primary-database.adoc`,
    `modules/ROOT/images/redis-rdb-vs-aof-timeline.svg`. `BACKUP` syntax verified live against redis.io. No
    admonitions/build errors from this page; docs-only (no tests/coverage/code-quality gates apply).
- [x] Task 15. Create `database/redis/replication-sentinel-and-cluster.adoc` ("Replication, Sentinel & Cluster")
  - [x] Task 15.1. Replication: `REPLICAOF`, full vs. partial resync and the backlog, `min-replicas-to-write`,
    read-only replicas, diskless sync. Sentinel: quorum, failover, `sentinel.conf`, client discovery (Lettuce/
    Jedis), split-brain.
  - [x] Task 15.2. Cluster: 16384 slots/`CRC16`, `redis-cli --cluster create`, `MOVED`/`ASK`, hash tags (escaped),
    multi-key limits, resharding and atomic slot migration (8.4), `CLUSTER SLOT-STATS`,
    `cluster-require-full-coverage`, client topology refresh. Cluster vs. Sentinel vs. proxy (Redis Software).
  - [x] Task 15.3. Examples: a 3-primary/3-replica compose sketch, `CLUSTER KEYSLOT`, and Lettuce
    `RedisClusterClient` with topology refresh.
  - [x] Task 15.4. Figures: `redis-cluster-hash-slots.svg` (slots across shards, a hash-tagged key) and a
    `[mermaid]` sequence of a Sentinel failover.
  - [x] Task 15.5. References: replication, Sentinel, scaling, cluster-spec pages.
  - Files: `modules/ROOT/pages/database/redis/replication-sentinel-and-cluster.adoc`,
    `modules/ROOT/images/redis-cluster-hash-slots.svg`. `CLUSTER MIGRATION` (8.4) and `CLUSTER SLOT-STATS`
    syntax verified live against redis.io. Full Antora build run for this page: only the expected, shared
    `index.adoc#_bibliography` warning (Group 6/7 scope). No admonitions/build errors; docs-only.
- [x] Task 16. Create `database/redis/security.adoc` ("Security")
  - [x] Task 16.1. Protected mode and `bind`. `requirepass` vs. ACL users (`ACL SETUSER` with key/channel/command
    patterns and categories including `@search`/`@json`, `ACL LOG`, `aclfile`). TLS (`tls-port`, certificates,
    mutual TLS, certificate-based user auth in 8.6, server-to-server peer auth in 8.10). Disabling or renaming
    dangerous commands. Network isolation. A security checklist as a table (no admonition).
  - [x] Task 16.2. Examples: a `bookshop-app` ACL user restricted to `~bookshop:*` and the needed categories, a
    TLS `redis.conf` excerpt, and `redis-cli --tls --user`.
  - [x] Task 16.3. Figures: `redis-acl-rule-anatomy.svg` and a `[mermaid]` flowchart of the connection handshake
    (TLS → `HELLO`/`AUTH` → per-command ACL check).
  - [x] Task 16.4. References: security, ACL, TLS, `ACL SETUSER` pages.
  - Files: `modules/ROOT/pages/database/redis/security.adoc`, `modules/ROOT/images/redis-acl-rule-anatomy.svg`.
    8.6 certificate-based user auth and 8.10 server-to-server peer auth verified against redis.io release
    notes. Security checklist implemented as a table, not an admonition. Antora build succeeded for this page
    (only the expected shared bibliography-anchor warning). Docs-only.
- [x] Task 17. Create `database/redis/administration-monitoring-and-troubleshooting.adoc` ("Administration,
  Monitoring & Troubleshooting")
  - [x] Task 17.1. `redis.conf`/`redis-full.conf`, `CONFIG GET/SET/REWRITE`, the key `INFO` sections and metrics,
    `SLOWLOG`, `LATENCY DOCTOR`/`HISTORY`, `MEMORY DOCTOR`/`USAGE`/`STATS`, `HOTKEYS`, `CLIENT LIST`/`KILL`,
    `MONITOR` (and its cost), `redis-benchmark`, memory optimization (encodings, `activedefrag`), the Redis
    Insight profiler, upgrade paths.
  - [x] Task 17.2. `redis_exporter` → Prometheus/Grafana, linking
    `xref:database/prometheus/exporters-and-pushgateway.adoc`.
  - [x] Task 17.3. Figure: a `[mermaid]` flowchart for latency triage.
  - [x] Task 17.4. References: admin, config, debugging, troubleshooting, latency, memory-optimization,
    benchmarks pages.
  - Files: `modules/ROOT/pages/database/redis/administration-monitoring-and-troubleshooting.adoc`. `HOTKEYS`
    syntax verified live against redis.io (introduced 8.6.0). Links
    `xref:database/prometheus/exporters-and-pushgateway.adoc[]`. No admonitions/build errors; docs-only.
- [x] Task 18. Create `database/redis/clients-and-client-side-caching.adoc` ("Clients & Client-Side Caching")
  - [x] Task 18.1. Choosing a client: Jedis 8 (sync, `UnifiedJedis`/`RedisClient`) vs. Lettuce 7.7
    (async/reactive, Spring Boot's default). Other languages (redis-py, node-redis, go-redis, NRedisStack) named
    and linked only. Pools and timeouts, RESP3, retries/reconnection, reading from replicas, TLS + ACL
    credentials, failover.
  - [x] Task 18.2. Client-side caching: `CLIENT TRACKING` default vs. broadcast mode, invalidation messages, and
    Jedis/Lettuce support. Redis OM object mapping (forward link to the Spring Data page). RIOT for migration.
  - [x] Task 18.3. Examples: a pooled Jedis config, a Lettuce `ClientOptions` with timeouts/reconnect, and Jedis
    client-side caching (`CacheConfig`).
  - [x] Task 18.4. Figure: a `[mermaid]` sequence of client-side caching invalidation.
  - [x] Task 18.5. References: the clients index, the Jedis/Lettuce guides (connect, production usage, failover),
    and the client-side caching page.
  - Files: `modules/ROOT/pages/database/redis/clients-and-client-side-caching.adoc`. Jedis 8/Lettuce 7.7 API
    names verified against official docs. Forward-links `xref:database/redis/spring-data-redis-om-and-lua-queries.adoc[]`,
    which does not exist yet (lands in Group 5) -- expected, transient xref warning until then. Docs-only.
- [x] Task 19. Create `database/redis/use-cases-and-patterns.adoc` ("Use Cases & Patterns")
  - [x] Task 19.1. Cache-aside, read-through and write-behind with TTL, jitter and stampede protection, plus
    prefetching. Session store (hash per session, field expiration, Spring Session forward link). Rate limiting:
    fixed window with `INCREX`, sliding window with a sorted set, token bucket in Lua. Semantic cache and agent
    memory.
  - [x] Task 19.2. Reliable job queues (lists with `BLMOVE`; streams with consumer groups). Distributed locks:
    `SET NX PX`, compare-and-delete with `DELEX IFEQ` or Lua, fencing tokens, Redlock and its caveats, and a link
    to `xref:backend/springboot/scheduling-and-shedlock.adoc`. Leaderboards, dedup (set/Bloom/Cuckoo), unique
    visitors (HLL), geo lookup, recommendation by scores, feature store, fraud-detection and API-gateway
    patterns, one short example each.
  - [x] Task 19.3. Figure: a `[mermaid]` sequence of cache-aside with a stampede lock, plus a table comparing the
    rate-limiting algorithms.
  - [x] Task 19.4. Link the existing session/cache pages (Hibernate L2, OAuth session store, ASP.NET
    `IDistributedCache`) instead of repeating them.
  - [x] Task 19.5. References: the redis.io use-case pages and command pages used.
  - Files: `modules/ROOT/pages/database/redis/use-cases-and-patterns.adoc`. `INCREX` and `DELEX IFEQ` syntax
    verified live against redis.io (8.8.0/8.4.0). Links Hibernate L2, OAuth session, ASP.NET
    `IDistributedCache`, and ShedLock pages instead of repeating them. No admonitions/build errors; docs-only.
- [x] Task 20. Create `database/redis/redis-software-cloud-kubernetes-and-valkey.adoc` ("Redis Software, Redis Cloud,
  Kubernetes & Valkey")
  - [x] Task 20.1. An editions comparison table. Redis Software architecture: nodes, shards, proxy,
    multi-tenancy, Active-Active CRDTs, auto tiering, RBAC. Redis Cloud: Essentials vs. Pro, the free tier,
    providers, networking, SSO, REST API/`redisctl`, Terraform/Pulumi. Redis Enterprise for Kubernetes: the
    operator plus a `RedisEnterpriseCluster`/`RedisEnterpriseDatabase` CR example. Redis Data Integration in one
    paragraph.
  - [x] Task 20.2. Licensing history, and Valkey: the Linux Foundation fork of 7.2.4, now 9.x. Cover what it has
    and lacks vs. Redis 8 and the compatibility implications for the cloud pages. Valkey is described only as
    far as it shapes those choices (issue's out-of-scope rule).
  - [x] Task 20.3. Figure: a `[mermaid]` timeline of Redis vs. Valkey releases and licences.
  - [x] Task 20.4. References: the rs, rc and kubernetes docs, the 8.0 what's-new (licensing) page, and the
    Valkey docs.
  - Files: `modules/ROOT/pages/database/redis/redis-software-cloud-kubernetes-and-valkey.adoc`. Redis 8
    tri-license (RSALv2/SSPLv1/AGPLv3) and Valkey 9.x line verified live against redis.io/valkey.io. Full
    Antora build run for this page: only the expected shared bibliography-anchor warning. Docs-only.

### Group 5 — Content pages: Spring Boot integration and cloud deployment

**Parallelizable: yes.** There are 6 independent pages (Tasks 21–26). The Spring Boot pages assume
`backend/springboot/caching.adoc` and link to it rather than repeating it.

- [x] Task 21. Create `database/redis/spring-boot-redis-as-a-cache.adoc` ("Spring Boot: Redis as a Cache")
  - [x] Task 21.1. The lead states that it builds on `xref:backend/springboot/caching.adoc` and does not re-explain
    `@Cacheable`/`@CacheEvict` or the basic starter setup.
  - [x] Task 21.2. `spring.data.redis.*` for standalone, Sentinel, Cluster, URL, SSL bundles, and
    username/password (ACL user). Lettuce (`LettuceClientConfiguration`, pool, `ReadFrom`, topology refresh) vs.
    Jedis.
  - [x] Task 21.3. `RedisCacheConfiguration` per cache (`books` TTL 10 min), `computePrefixWith`, key generators,
    serializer choices (`GenericJackson2JsonRedisSerializer` vs. typed `Jackson2JsonRedisSerializer` vs.
    String/JDK). Verify current class names against Spring Data Redis 4.1, because Jackson 3 support may rename
    serializers.
  - [x] Task 21.4. `@Cacheable(sync = true)` and `RedisCacheWriter.lockingRedisCacheWriter`, TTL jitter,
    `enableStatistics` + Actuator cache metrics, the cost of `@CacheEvict(allEntries = true)` (`SCAN` batch
    strategy vs. `KEYS`), `@ServiceConnection` Testcontainers `RedisContainer`, `compose.yaml` support. Link
    `backend/quarkus/caching.adoc` as the Quarkus equivalent.
  - [x] Task 21.5. Figure: `redis-spring-cache-layers.svg` (Spring Cache → `RedisCacheManager` → Spring Data
    Redis → Lettuce → Redis) and a `[mermaid]` sequence of a `sync = true` miss under concurrency.
  - [x] Task 21.6. References: Spring Boot caching + Redis docs, Spring Data Redis cache docs, and the redis.io
    spring-framework-cache integration page.
  - **Done.** Files: `modules/ROOT/pages/database/redis/spring-boot-redis-as-a-cache.adoc` (507 lines),
    `modules/ROOT/images/redis-spring-cache-layers.svg`. No tests (docs-only); coverage N/A. Antora build clean
    for this page (no xref/attribute errors), `npm run validate:mermaid` passes. No admonitions besides the
    disclaimer; house style followed.
- [x] Task 22. Create `database/redis/spring-boot-spring-data-redis-and-custom-queries.adoc` ("Spring Boot: Spring
  Data Redis, Redis OM & Custom Queries")
  - [x] Task 22.1. `RedisTemplate`/`StringRedisTemplate` and the `opsFor*` APIs. Repositories (`@RedisHash`,
    `@Id`, `@Indexed`, `@TimeToLive`, `@Reference`, and the limits of derived finders). `SessionCallback`,
    `executePipelined`, `@Transactional` with `setEnableTransactionSupport`.
  - [x] Task 22.2. Custom queries with Lua (`RedisScript<T>`, scripts as classpath resources) and Functions.
    Pub/Sub (`RedisMessageListenerContainer`). Streams (`StreamMessageListenerContainer`, consumer group
    `fulfilment`). Keyspace-event listeners. `ReactiveRedisTemplate`.
  - [x] Task 22.3. Redis OM Spring: `@Document`, `@Indexed`/`@Searchable`/`@TagIndexed`/`@NumericIndexed`/
    `@GeoIndexed`, `RedisDocumentRepository`, `@Query`/`@Aggregation`, `EntityStream`. Dropping to
    `UnifiedJedis` for `FT.*`/`JSON.*`/`TS.*`. Spring Session Data Redis for sessions. `@DataRedisTest` +
    Testcontainers. Verify Redis OM Spring 1.0 annotation names against its docs.
  - [x] Task 22.4. Figure: a `[mermaid]` sequence of a `StreamMessageListenerContainer` consumer group.
  - [x] Task 22.5. References: Spring Data Redis reference, Redis OM Spring docs, Spring Session Data Redis docs.
  - **Done.** File: `modules/ROOT/pages/database/redis/spring-boot-spring-data-redis-and-custom-queries.adoc`
    (782 lines). No tests (docs-only); coverage N/A. Antora build clean for this page, `npm run validate:mermaid`
    passes. No admonitions besides the disclaimer; house style followed.
- [x] Task 23. Create `database/redis/spring-boot-redis-as-a-vector-database.adoc` ("Spring Boot: Redis as a Vector
  Database")
  - [x] Task 23.1. `spring-ai-starter-vector-store-redis` (Spring AI 2.0) and the
    `spring.ai.vectorstore.redis.*` properties (`index-name: spring-ai-books`, `prefix: bookshop:ai:`,
    `initialize-schema`, distance metric, algorithm/HNSW params). Verify property names against the Spring AI
    reference.
  - [x] Task 23.2. `RedisVectorStore` with `MetadataField`s, `add`/`similaritySearch`, and portable filter
    expressions with their Redis translation (tag braces escaped in prose). An embedding model, `ChatClient` +
    `QuestionAnswerAdvisor` RAG, `TokenTextSplitter` chunking, chat memory and semantic cache on Redis.
  - [x] Task 23.3. The same KNN written by hand with Jedis (`FT.CREATE … VECTOR HNSW`, `FT.SEARCH … KNN`,
    `FT.HYBRID`) and with Redis OM Spring (`@VectorIndexed`, `EntityStream` KNN). A comparison table linking
    Qdrant/Elasticsearch/Neo4j vector pages.
  - [x] Task 23.4. Figure: a `[mermaid]` sequence of ingestion + a RAG query through Spring AI → Redis.
  - [x] Task 23.5. References: Spring AI Redis vector store, Spring AI RAG, redis.io RAG pages.
  - **Done.** File: `modules/ROOT/pages/database/redis/spring-boot-redis-as-a-vector-database.adoc` (535 lines).
    No tests (docs-only); coverage N/A. Antora build clean for this page, `npm run validate:mermaid` passes. No
    admonitions besides the disclaimer; house style followed.
- [x] Task 24. Create `database/redis/deploying-on-aws.adoc` ("Deploying Redis on AWS")
  - [x] Task 24.1. Redis Cloud on AWS (Marketplace, Pro in your region, VPC peering/PrivateLink, Active-Active).
    Amazon ElastiCache: Valkey 9.x vs. Redis OSS ≤ 7.1 and its Extended Support dates, serverless vs.
    node-based, cluster mode, Multi-AZ, Global Datastore, IAM auth, and Valkey search/JSON instead of Redis
    modules. Amazon MemoryDB. A decision table. **Verify every version/date on the day of implementation** and
    cite the dated AWS page.
  - [x] Task 24.2. Spring Boot config (TLS endpoint, cluster configuration endpoint, IAM token as password,
    `ReadFrom.REPLICA_PREFERRED`) and Terraform (`rediscloud` provider and
    `aws_elasticache_serverless_cache`).
  - [x] Task 24.3. Figure: a `[mermaid]` flowchart "which AWS option".
  - [x] Task 24.4. References: the redis.io AWS integration pages and the AWS ElastiCache/MemoryDB docs.
  - **Done.** File: `modules/ROOT/pages/database/redis/deploying-on-aws.adoc` (326 lines). Version/date facts
    (ElastiCache Redis OSS freeze at 7.1, Extended Support window, Valkey positioning, Global Datastore scope)
    verified live via WebSearch at implementation time. Fixed one build warning: a wrapped bullet line starting
    "2029." was mis-parsed by Asciidoctor as an ordered-list marker (rewrapped, no content change). No tests
    (docs-only); coverage N/A. Antora build clean for this page, `npm run validate:mermaid` passes. No
    admonitions besides the disclaimer; house style followed.
- [x] Task 25. Create `database/redis/deploying-on-google-cloud.adoc` ("Deploying Redis on Google Cloud")
  - [x] Task 25.1. Redis Cloud on GCP (Marketplace, Private Service Connect/VPC peering). Memorystore for Redis
    (versions, Basic vs. Standard, read replicas). Memorystore for Redis Cluster (vector search, RDB/AOF,
    cross-region, IAM auth, in-transit encryption). Memorystore for Valkey (recommended for new workloads). The
    Redis 8 features unavailable on Memorystore. A decision table. Verify versions/dates on the day.
  - [x] Task 25.2. Spring Boot config (Direct VPC egress / Serverless VPC Access from Cloud Run, IAM auth token,
    TLS CA) and a Terraform snippet.
  - [x] Task 25.3. Figure: a `[mermaid]` flowchart "which GCP option".
  - [x] Task 25.4. References: redis.io GCP pages and Google Cloud Memorystore docs.
  - **Done.** File: `modules/ROOT/pages/database/redis/deploying-on-google-cloud.adoc` (310 lines).
    Memorystore for Redis/Redis Cluster/Valkey facts (version ceilings, vector search availability, tier
    behavior) verified live via WebSearch/WebFetch at implementation time. No tests (docs-only); coverage N/A.
    Antora build clean for this page, `npm run validate:mermaid` passes. No admonitions besides the disclaimer;
    house style followed.
- [x] Task 26. Create `database/redis/deploying-on-azure.adoc` ("Deploying Redis on Azure")
  - [x] Task 26.1. Azure Managed Redis: Redis Enterprise-based, Redis 7.4.x, Memory/Balanced/Compute/Flash
    Optimized tiers, modules on in-memory tiers, HA, active geo-replication, persistence, private endpoints,
    Entra ID auth, port 10000, OSS vs. Enterprise clustering policy. The Azure Cache for Redis retirement:
    Enterprise/Enterprise Flash on 2027-03-30 and Basic/Standard/Premium on 2028-09-30, verified against the
    retirement FAQ and written as prose/table, not an admonition. Migration tooling. Redis Cloud on Azure. A
    decision table.
  - [x] Task 26.2. Spring Boot config with Entra ID (`redis-authx-entraid` for Jedis/Lettuce, token refresh) plus
    TLS, and a Bicep or Terraform snippet.
  - [x] Task 26.3. Figure: a `[mermaid]` flowchart "which Azure option".
  - [x] Task 26.4. References: Azure Managed Redis docs, the retirement FAQ, redis.io Azure pages,
    `jvm-redis-authx-entraid`.
  - **Done.** File: `modules/ROOT/pages/database/redis/deploying-on-azure.adoc` (352 lines). Retirement dates
    verified live against Microsoft's retirement FAQ and corrected from the plan's stated "2027-03-30" to the
    FAQ's actual Enterprise/Enterprise Flash retirement date of **March 31, 2027** (March 30, 2027 is a separate
    reservation-support cutoff the page calls out in prose); Basic/Standard/Premium retirement on 2028-09-30
    confirmed as given. No tests (docs-only); coverage N/A. Antora build clean for this page, `npm run
    validate:mermaid` passes. No admonitions besides the disclaimer; house style followed.

### Group 6 — Section index, navigation and cross-links

**Parallelizable: yes.** Every task edits or creates a **distinct** file, so none conflicts with another, and
all of them only reference pages that already exist after Groups 2–5.

- [x] Task 27. Create `modules/ROOT/pages/database/redis/index.adoc` ("Redis Reference") — file created; version
  baseline and 7.2→8.10 release timeline re-verified via web search/fetch (Redis OM Spring's newer 2.0.x line
  noted in prose while keeping 1.0 as the section's stated baseline for consistency with the 25 content pages).
  - [x] Task 27.1. Header, disclaimer include, a one-paragraph lead, and the **code baseline in prose** (choice 5,
    verified versions).
  - [x] Task 27.2. A timeline table 7.2 → 7.4 → 8.0 → 8.2 → 8.4 → 8.6 → 8.8 → 8.10 (date, headline features,
    licence/packaging change). Add an optional `[mermaid]` timeline.
  - [x] Task 27.3. A reading-order paragraph (getting started → architecture → data types → streams → JSON &
    Query Engine → vector search → pipelining/scripting → operations → clients → use cases → Spring Boot →
    cloud), plus a relationship paragraph linking Spring Boot Caching, Near-Far Caches, ShedLock, Messaging,
    Quarkus, Qdrant, Elasticsearch, Neo4j and Prometheus.
  - [x] Task 27.4. `== What's covered`, grouped: *Foundations* (Tasks 2–3); *Core data types* (4–7);
    *Multi-model capabilities* (8–12); *Programmability* (13); *Operations* (14–17); *Clients, use cases &
    editions* (18–20); *Spring Boot* (21–23); *Cloud deployment* (24–26). One bullet each, with no cheat sheet.
  - [x] Task 27.5. `== Bibliography`, grouped as the issue specifies: official Redis docs (the main areas plus
    command reference, release notes, and the `redis/*`, `redis-developer/riot` and Docker Hub repos); Spring
    docs; cloud-provider docs; and the book as
    `Fugaro, Luigi & Ortensi, Mirko. _Redis Stack for Application Modernization: Build real-time multi-model
    applications at any scale with Redis_. Packt Publishing, 2023. ISBN 978-1-83763-818-5.` with the Packt page
    and code-bundle links. Close with the house sentence that the book is a consulted reference only and that
    redis.io, docs.spring.io and each cloud provider's own docs win on any discrepancy. Watch the line-leading
    `2023.` gotcha.
- [x] Task 28. Site wiring — 3 files touched: `nav.adoc`, `database/index.adoc`, `pages/index.adoc`.
  - [x] Task 28.1. `modules/ROOT/nav.adoc`: insert `*** xref:database/redis/index.adoc[Redis Reference]` followed by
    25 `****` lines, in Task 27.4 order. Place them after
    `**** xref:database/qdrant/cheat-sheet.adoc[Cheat Sheet (PDF)]` and before
    `*** xref:database/schema-evolution/index.adoc[Evolving the Database Model]`. Use short labels (e.g.
    `[Getting Started]`, `[Architecture, Keyspace & Eviction]`, …, `[Deploying on Azure]`).
  - [x] Task 28.2. `database/index.adoc`: add a `== Sections` bullet between Qdrant and Evolving the Database
    Model. Add "Redis Reference" to `:description:`'s subsection list. Add `Redis, in-memory data store, cache,
    Redis Streams, Redis Query Engine, vector sets, Valkey` to `:keywords:` (skip `key-value store`, already
    present).
  - [x] Task 28.3. `pages/index.adoc`: append to `:keywords:` (line 3) the issue's list: `Redis, Redis 8, Redis
    Open Source, Redis Stack, in-memory data store, Redis Streams, Redis Query Engine, RediSearch, RedisJSON,
    vector sets, Spring Data Redis, Redis OM Spring, Spring AI Redis, ElastiCache, Memorystore, Azure Managed
    Redis, Valkey`. Skip `key-value store`, which is already there. Make no structural change.
- [x] Task 29. Cross-links in existing pages. Add one sentence or link each, never repeating content. Each
  sub-task is a distinct file. Issue target names are mapped to the consolidated pages:
  `pubsub-and-keyspace-notifications` → `streams-and-pub-sub`, `vector-sets` → `vector-search`,
  `clients-connection-management-and-client-side-caching` → `clients-and-client-side-caching`, and both
  `use-cases-*` → `use-cases-and-patterns`.
  - [x] Task 29.1. `database/choosing-the-right-database.adoc`: link `xref:database/redis/index.adoc` from the
    key-value paragraph (line ~372) and table row (~507), and `xref:database/redis/vector-search.adoc` from the
    vector-database discussion. Leave the mermaid leaf text unchanged; mermaid nodes can't hold xrefs.
  - [x] Task 29.2. `database/diagnosing-slow-queries.adoc`: add a short Redis subsection or row (`SLOWLOG`,
    `LATENCY`, big keys, `HOTKEYS`) linking `administration-monitoring-and-troubleshooting.adoc`. Follow the
    page's own existing structure.
  - [x] Task 29.3. `database/qdrant/rag-integration-patterns.adoc` (`== Related pages`),
    `database/elasticsearch/vector-and-semantic-search.adoc`, `database/neo4j/vector-search-and-genai.adoc` and
    `database/lucene/knn-vector-search.adoc` (`== Related pages`): one sentence or bullet each pointing to
    `xref:database/redis/vector-search.adoc` as the Redis alternative. These are four distinct files, so they
    can be done in one sub-task.
  - [x] Task 29.4. `database/prometheus/exporters-and-pushgateway.adoc`: link
    `administration-monitoring-and-troubleshooting.adoc` for `redis_exporter`. (Page had no existing
    `redis_exporter` mention; one sentence added to the intro paragraph instead.)
  - [x] Task 29.5. `backend/springboot/caching.adoc`: at the top of `== Distributed caching with Redis` and in
    `== Choosing between Caffeine and Redis`, link `spring-boot-redis-as-a-cache.adoc` and
    `database/redis/index.adoc`.
  - [x] Task 29.6. `backend/springboot/near-far-caches.adoc`: from the Pub/Sub/keyspace-notifications paragraph
    (~line 72), link `streams-and-pub-sub.adoc` and `clients-and-client-side-caching.adoc`.
  - [x] Task 29.7. `backend/springboot/scheduling-and-shedlock.adoc` (`==== Redis`): link
    `use-cases-and-patterns.adoc` for the locking algorithm.
  - [x] Task 29.8. `backend/springboot/spring-data-overview.adoc` (Redis row, lines 389–390): link
    `spring-boot-spring-data-redis-and-custom-queries.adoc`. Also `backend/springboot/index.adoc`: add a bullet
    pointing to the three Spring Boot Redis pages, following the Solr bullet pattern. (Third page is named
    `spring-boot-redis-as-a-vector-database.adoc`, not `...spring-ai-vector-store.adoc`.)
  - [x] Task 29.9. `backend/springboot/unit-and-integration-testing.adoc`: from the `redis:7-alpine`
    `GenericContainer` example, link the `@ServiceConnection` recipe in `spring-boot-redis-as-a-cache.adoc`.
  - [x] Task 29.10. `backend/messaging/spring-boot-other-messaging-options.adoc` (line ~305): link
    `streams-and-pub-sub.adoc` and `spring-boot-spring-data-redis-and-custom-queries.adoc`.
  - [x] Task 29.11. `backend/quarkus/caching.adoc` and `backend/quarkus/nosql-and-other-stores.adoc`: one sentence
    each linking `database/redis/index.adoc`.
  - [x] Task 29.12. `backend/hibernate/second-level-cache.adoc` (Redis row),
    `backend/oauth/logout-and-session-management.adoc` (session store, ~line 245) and
    `web/aspnet/core/performance-and-caching.adoc` (`AddStackExchangeRedisCache`): one link each to
    `use-cases-and-patterns.adoc`.
  - [x] Task 29.13. `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc` (catalogue-cache
    bullet, line 217): link `database/redis/index.adoc`.

### Group 7 — Build and verify

**Parallelizable: yes** (single task; must run after every prior group).

- [x] Task 30. Build & verify — Antora build clean (0 errors, 0 warnings), 474/474 Mermaid diagrams valid,
  reachability/grep/cross-link checks all pass. No fixes were needed.
  - [x] Task 30.1. Ran `npx antora antora-playbook.yml` (no `--fetch`) via an `iru-gate-runner` sub-agent against
    a clean `build/` directory: exit code 0, `build/site` fully regenerated, **zero errors, zero warnings**
    (including no "skipping reference to missing attribute" / "list item index" warnings).
  - [x] Task 30.2. Ran `npm i --no-save mermaid@11 jsdom && npm run validate:mermaid` via a sub-agent: **All 474
    Mermaid diagrams parsed successfully** (0 failures), including every diagram in
    `modules/ROOT/pages/database/redis/`.
  - [x] Task 30.3. Confirmed: 25 content pages, each with a unique `xref:database/redis/*.adoc` in both
    `database/redis/index.adoc` (25 xrefs) and `nav.adoc` (26 xrefs = 25 content pages + index.adoc itself).
    `build/site/database/redis/` holds 26 HTML files. All 8 `redis-*.svg` files are present in
    `build/site/_images/`. Verified rendering: `architecture-keyspace-and-eviction.html` contains an `<img>` tag
    for `redis-event-loop-io-threads.svg`; `administration-monitoring-and-troubleshooting.html` contains a
    rendered `class="mermaid content"` block.
  - [x] Task 30.4. Grep checks all pass: `include::partial$redis-disclaimer.adoc[]` appears in all 26 files; no
    `[NOTE]`/`[TIP]`/`[WARNING]`/`[CAUTION]` anywhere under `database/redis/`, and the only `[IMPORTANT]` block is
    the disclaimer partial itself (the permitted exception); "Fugaro"/"Ortensi"/"Packt" do not appear outside
    `index.adoc`; the two `\bthe book\b` matches outside `index.adoc` (`json.adoc`, `vector-search.adoc`) refer to
    Bookshop catalogue book records, not the Packt book — not violations; all 25 content pages have a
    `== References` section; no `image::` directive references `redis-stack` (the `redis/redis-stack` text hits
    in `getting-started.adoc`/`security.adoc` are prose contrasting it with `redis:8`, not image references).
  - [x] Task 30.5. Spot-checked all 24 Group 6 cross-link edits (across
    `backend/architecture/decisions-and-migrations/starting-a-new-project.adoc`,
    `backend/hibernate/second-level-cache.adoc`, `backend/messaging/spring-boot-other-messaging-options.adoc`,
    `backend/oauth/logout-and-session-management.adoc`, `backend/quarkus/caching.adoc`,
    `backend/quarkus/nosql-and-other-stores.adoc`, `backend/springboot/caching.adoc`,
    `backend/springboot/index.adoc`, `backend/springboot/near-far-caches.adoc`,
    `backend/springboot/scheduling-and-shedlock.adoc`, `backend/springboot/spring-data-overview.adoc`,
    `backend/springboot/unit-and-integration-testing.adoc`, `database/choosing-the-right-database.adoc`,
    `database/diagnosing-slow-queries.adoc`, `database/elasticsearch/vector-and-semantic-search.adoc`,
    `database/lucene/knn-vector-search.adoc`, `database/neo4j/vector-search-and-genai.adoc`,
    `database/prometheus/exporters-and-pushgateway.adoc`, `database/qdrant/rag-integration-patterns.adoc`,
    `web/aspnet/core/performance-and-caching.adoc`): every target resolves to a real Redis page (already proven
    by the zero-warning build) and every sentence reads naturally in context.
