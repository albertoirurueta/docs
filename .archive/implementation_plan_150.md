# Implementation Plan: Guides & References / Backend Development — Messaging

## Task summary

Source: GitHub issue #150
Base branch: main

Issue [#150](https://github.com/albertoirurueta/docs/issues/150) asks for a new **Messaging** section under
*Guides & References → Backend Development*, the sixth sibling of the existing Hibernate, SpringBoot, GraphQL,
Spring Batch, OAuth and Quarkus references, authored directly into this repo's own `ROOT` Antora component (this
repo has no application source code — it *is* the Antora playbook + root component, per `CLAUDE.md`).
Concretely:

1. **34 new AsciiDoc pages** under `modules/ROOT/pages/backend/messaging/`: a landing `index.adoc` (with a
   `== Bibliography`), **32 topic pages**, and a `cheat-sheet.adoc`.
2. **One new partial**: `modules/ROOT/partials/messaging-disclaimer.adoc` — unlike every prior section's
   disclaimer (`oauth-disclaimer.adoc`, `springboot-disclaimer.adoc`, etc.), this one contains **only** the
   house AI-assistance disclosure and the bibliography pointer, per the issue's explicit instruction that
   admonitions in this section state nothing else. The version baseline goes in ordinary prose on `index.adoc`
   and each page's intro, never inside an admonition.
3. **Site wiring**: an inline nav block in `modules/ROOT/nav.adoc` appended after the Quarkus Reference block,
   a "Messaging" bullet in `modules/ROOT/pages/backend/index.adoc`, and messaging terms added to the root
   `modules/ROOT/pages/index.adoc` `:keywords:`.
4. **Reciprocal cross-links** added to `backend/springboot/messaging-kafka.adoc`,
   `backend/springboot/api-first-messaging.adoc`, `backend/quarkus/messaging.adoc` and
   `backend/spring-batch/spring-batch-integration.adoc`, so the new section and the existing pages point at each
   other instead of duplicating material.
5. **One new cheat-sheet PDF**: `modules/ROOT/attachments/messaging-cheat-sheet.pdf`, exactly one A4 page,
   rendered from a print-ready HTML/CSS layout via headless Chrome, visually consistent with
   `oauth-cheat-sheet.pdf` / `springboot-cheat-sheet.pdf`.
6. Two SVG-only decisions are made here rather than left to each task: figures live under
   `modules/ROOT/images/` named `messaging-*.svg` (matching the `oauth-*.svg` / `springboot-*.svg` convention),
   and every `[mermaid]` block must pass `npm run validate:mermaid` before the final build task.

The full page outline, source list (Apache Kafka 4.3 docs, RabbitMQ 4.3 docs, Spring Boot/Kafka/AMQP/Cloud
Stream references), book-comparison table and bibliography are already fully specified in the issue body — this
plan does not re-derive them, it sequences their creation into buildable, reviewable groups. Two 2017 books
(*Kafka: The Definitive Guide*, 1st ed., and *Spring Boot Messaging*) are consulted-reference-only per the
issue; neither PDF is uploaded or read verbatim into any page — only their publisher-page links and the
superseded-material call-outs the issue already worked out are used.

Nothing in the issue is ambiguous enough to need a decision here: it already names every file, every source URL,
every superseded construct to flag, and the disclaimer's reduced content. This plan proceeds directly to
drafting.

No task below carries a language/framework tag: this repository has no installed `*-code-one-task` skill for
AsciiDoc/Antora documentation (only `iru-java-code-one-task`, `iru-java-springboot-code-one-task`,
`iru-dotnet-code-one-task` and `iru-database-code-one-task` are installed, per the same convention followed by
every prior plan in `.archive/` for this repository — e.g. `implementation_plan_129.md`, `implementation_plan_143.md`).
Every task here is a direct AsciiDoc/Antora documentation edit.

## Current code state

- **Antora component**: `antora.yml` declares the `irurueta` ROOT component; `modules/ROOT/nav.adoc` is its nav
  file; `modules/ROOT/pages/backend/index.adoc` is the Backend Development landing page listing Hibernate,
  SpringBoot, GraphQL, Spring Batch, OAuth and Quarkus references in that order (`== Sections`).
- **Precedent sections** (`modules/ROOT/pages/backend/oauth/`, `.../quarkus/`) each follow the same shape this
  plan reuses: a `<section>-disclaimer.adoc` partial under `modules/ROOT/partials/`, one page per concept
  ending in `== References`, a landing `index.adoc` ending in `== Bibliography`, a `cheat-sheet.adoc` linking
  `xref:attachment$<section>-cheat-sheet.pdf[...]`, and a nav block of the form
  `*** xref:backend/<section>/index.adoc[<Title>]` + `**** xref:...` children appended after the previous
  section's block (`nav.adoc:523-737` for the current Backend Development subtree; the Quarkus block ends at
  line 737, immediately before `** xref:apps/index.adoc[Apps]`).
- **Disclaimer partials differ per section already** (`modules/ROOT/partials/oauth-disclaimer.adoc`,
  `springboot-disclaimer.adoc`) — each is a single `[IMPORTANT]`/`====` block with a version-baseline sentence,
  an AI-assistance sentence, and a bibliography pointer. `messaging-disclaimer.adoc` drops the version-baseline
  sentence per the issue; it must still read as a coherent short paragraph, not a bare one-liner.
- **Existing messaging-adjacent pages that must NOT be duplicated, only cross-linked**:
  - `modules/ROOT/pages/backend/springboot/messaging-kafka.adoc` (314 lines) — `spring.kafka.*` baseline,
    `KafkaTemplate`, transactional producers, `@KafkaListener` manual/batch acks, `DefaultErrorHandler`, retry
    and dead-letter topics, serializers/`ConsumerFactory`.
  - `modules/ROOT/pages/backend/springboot/api-first-messaging.adoc` (281 lines) — Avro + `avro-maven-plugin`,
    Confluent Schema Registry compatibility modes, AsyncAPI topic documentation.
  - `modules/ROOT/pages/backend/quarkus/messaging.adoc` (576 lines) — SmallRye Reactive Messaging (Kafka,
    RabbitMQ, AMQP 1.0, Pulsar, JMS connectors).
  - `modules/ROOT/pages/backend/spring-batch/spring-batch-integration.adoc` — AMQP remote chunking via
    `RabbitTemplate`/`Amqp.inboundAdapter`.
- **Attachments/images conventions**: cheat sheets live at `modules/ROOT/attachments/<section>-cheat-sheet.pdf`
  (e.g. `oauth-cheat-sheet.pdf`, `springboot-cheat-sheet.pdf`); figures live at
  `modules/ROOT/images/<section>-*.svg` (e.g. `oauth-roles-and-trust-boundaries.svg`).
- **Mermaid validation**: `scripts/validate-mermaid.mjs`, run via `npm run validate:mermaid`, and also run in CI
  (`.github/workflows/publish.yml`, `.github/workflows/manual_publish.yml`) before the Antora build.
- **Build command**: `npx antora antora-playbook.yml` (local content only) — must complete with no `xref`/
  AsciiDoc errors as the final acceptance gate.
- **No RabbitMQ/AMQP documentation exists anywhere in this repository** beyond the Quarkus connector
  subsection, and no page explains the Kafka broker itself (only its Spring client) — this is genuinely new
  ground, not a refactor of existing content.

## Implementation steps

> Conventions every page task below inherits (do not restate per task): create the file under
> `modules/ROOT/pages/backend/messaging/`; start with `= <Title>`, a `:description:`, a `:keywords:`, then
> `include::partial$messaging-disclaimer.adoc[]`; every code example is either a plain Java client example
> (`kafka-clients`, `com.rabbitmq.client:amqp-client`) on the broker pages or a Spring Boot 4.1 example on the
> Spring pages, each followed by a link to the exact official page it is derived from; add a `[mermaid]` block
> or an SVG under `modules/ROOT/images/` (named `messaging-*.svg`) wherever the issue's 📊 note calls for one —
> more figures are welcome, fewer are not; end with a `== References` section linking **only** official
> documentation (kafka.apache.org, rabbitmq.com/docs, docs.spring.io, docs.oasis-open.org, cwiki.apache.org for
> KIPs) — never the two consulted books, which appear only in `index.adoc`'s Bibliography. Deprecated/removed
> constructs (ZooKeeper mode, MirrorMaker 1, `poll(long)`, classic mirrored queues, the Spring Cloud Stream
> annotation model, `spring-boot-starter-redis`) are always presented as historical with their replacement
> named. Prefer `xref:` links to sibling messaging pages over repeating material, and `xref:` into
> `backend/springboot/`, `backend/quarkus/` or `backend/spring-batch/` rather than restating anything already
> documented there. **No admonition block (`NOTE`/`TIP`/`WARNING`/`CAUTION`/`IMPORTANT`) appears on any page
> other than the `messaging-disclaimer.adoc` include itself** — write anything that would otherwise be an
> admonition as ordinary prose or a table row.

### Group 1 — Disclaimer partial (Parallelizable: yes)

Must land before any page, since every page includes it.

- [x] Task 1. Create `modules/ROOT/partials/messaging-disclaimer.adoc` — single `[IMPORTANT]`/`====` block with
      only the disclosure sentence + bibliography xref, no version-baseline sentence.
  - [x] Task 1.1. Write a single `[IMPORTANT]`/`====` block containing **only**: (a) the standard AI-assistance
        disclosure sentence ("This content was generated with the assistance of AI and should be verified
        against the official documentation before being relied on in production."); (b) a pointer to
        `xref:backend/messaging/index.adoc#_bibliography[the section bibliography]`. No version-baseline
        sentence, no book title, no evaluation paragraph — unlike `oauth-disclaimer.adoc`/
        `springboot-disclaimer.adoc`, which do include a baseline sentence.
  - [x] Task 1.2. Keep the two sentences readable as one short paragraph inside the admonition, not two
        disconnected fragments.

### Group 2 — Foundations (Parallelizable: yes)

- [x] Task 2. `getting-started.adoc` — "Getting Started with Messaging"
  - [x] Task 2.1. The five classic motivations (guaranteed delivery, decoupling, scalability/HA, asynchrony,
        interoperability); synchronous request/response (REST, gRPC) vs. asynchronous messaging and when each
        fits; brokered vs. brokerless.
  - [x] Task 2.2. The shared vocabulary table: message/event/record, producer, consumer, broker, channel,
        queue, topic, acknowledgement, offset, routing key — each mapped to its Kafka name and its RabbitMQ
        name.
  - [x] Task 2.3. Running both brokers locally in one command each (`apache/kafka` KRaft single-node image;
        `rabbitmq:4-management`), and a first send/receive with each broker's plain Java client.
  - [x] Task 2.4. Add: 📊 SVG of one "order placed" event travelling producer → broker → two consumers, drawn
        once for Kafka and once for RabbitMQ (`messaging-getting-started-flow.svg`); 📊 mermaid sequence
        contrasting a request/response call with an asynchronous message.
  - [x] Task 2.5. `== References` linking the Kafka and RabbitMQ getting-started/quickstart pages only.

- [x] Task 3. `messaging-models-and-patterns.adoc` — "Messaging Models and Patterns"
  - [x] Task 3.1. Point-to-point (work queue, competing consumers) and publish/subscribe (fan-out) as the two
        base models; request/reply on top of them.
  - [x] Task 3.2. The Enterprise Integration Patterns catalogue referenced by later pages: message, message
        channel, pipes and filters, message router, message translator, message endpoint, correlation
        identifier, return address, message expiration, dead-letter channel, idempotent receiver, competing
        consumers, message filter, aggregator/splitter — each a short definition plus a table row mapping it to
        its Kafka realisation (topic + consumer/share group, key-based partition, headers, retry topics) and
        its RabbitMQ realisation (queue / exchange types / bindings, `reply_to` + `correlation_id`, TTL, DLX).
  - [x] Task 3.3. Add: 📊 SVG grid of the core EIP icons (`messaging-eip-catalogue.svg`); 📊 mermaid flowchart
        of a content-based router.
  - [x] Task 3.4. `== References` linking Enterprise Integration Patterns (enterpriseintegrationpatterns.com)
        plus the Kafka/RabbitMQ pages that ground each row.

- [x] Task 4. `delivery-guarantees.adoc` — "Delivery Guarantees"
  - [x] Task 4.1. At-most-once, at-least-once, exactly-once (and "effectively-once" as the honest name),
        explained from the producer side and the consumer side; acknowledgements and redelivery; duplicates and
        idempotent consumers; ordering (per-partition in Kafka, per-queue in RabbitMQ, none across).
  - [x] Task 4.2. Durability: replication vs. fsync, and why "acknowledged" differs between brokers (Kafka
        `acks=all` = page-cached on every ISR member; RabbitMQ quorum queue confirm = written and flushed by a
        Raft majority).
  - [x] Task 4.3. Comparison table: how each semantic is configured in Kafka (`acks`, `enable.idempotence`,
        transactions, `isolation.level`) vs. RabbitMQ (publisher confirms, manual acks, quorum queues,
        publishing-ID deduplication on streams).
  - [x] Task 4.4. Add: 📊 mermaid sequence of at-least-once with a crash between processing and ack; 📊 SVG of
        the three semantics side by side (`messaging-delivery-semantics.svg`).
  - [x] Task 4.5. `== References` linking Kafka's Design "Message delivery semantics" section and RabbitMQ's
        confirms/reliability pages.

- [x] Task 5. `protocols.adoc` — "Messaging Protocols"
  - [x] Task 5.1. AMQP 0-9-1 (connections, channels, classes/methods), AMQP 1.0 (containers, sessions, links,
        credit-based flow control, settlement outcomes), the Kafka binary protocol (versioned API keys,
        bootstrap/metadata discovery), MQTT, STOMP, the RabbitMQ Stream protocol (port 5552), WebSocket
        transports, and JMS/Jakarta Messaging as an API rather than a protocol.
  - [x] Task 5.2. The protocol × broker matrix (cross-checked against Kafka's protocol guide and RabbitMQ's
        protocols page rather than reproduced uncritically from RabbitMQ's comparison page).
  - [x] Task 5.3. Add: 📊 SVG of the matrix (`messaging-protocol-matrix.svg`); 📊 mermaid of an AMQP 0-9-1
        connection → channels vs. an AMQP 1.0 connection → sessions → links.
  - [x] Task 5.4. `== References` linking Kafka's protocol page, RabbitMQ's protocols/AMQP pages, and the OASIS
        AMQP 1.0 standard.

### Group 3 — Apache Kafka I: architecture, producers, consumers (Parallelizable: yes)

- [x] Task 6. `kafka-architecture.adoc` — "Apache Kafka Architecture"
  - [x] Task 6.1. Events (key/value/timestamp/headers), topics, partitions and offsets as the unit of ordering
        and parallelism, segments and the on-disk log, brokers.
  - [x] Task 6.2. KRaft controllers and the metadata log — what ZooKeeper used to do, KIP-500, 4.0 as the
        ZooKeeper-free line; replication (leader, followers, ISR, eligible leader replicas); retention
        (time/size), log compaction and tombstones, tiered storage; the Java version floor (clients 11+,
        brokers 17+).
  - [x] Task 6.3. Add: 📊 SVG of a topic with 4 partitions replicated across 3 brokers with leaders highlighted
        (`messaging-kafka-topic-replication.svg`); 📊 mermaid of the KRaft quorum.
  - [x] Task 6.4. `== References` linking Kafka's design/design, getting-started/zk2kraft, operations/kraft and
        eligible-leader-replicas pages, and KIP-500.

- [x] Task 7. `kafka-producers.adoc` — "Kafka Producers"
  - [x] Task 7.1. `ProducerRecord`, serializers, the record accumulator and batching (`batch.size`,
        `linger.ms` — default 5 ms since 4.0), the partitioner (key hashing, sticky partitioner for null keys,
        custom partitioners).
  - [x] Task 7.2. `acks` (0/1/all) and `min.insync.replicas`, retries and `delivery.timeout.ms`, the idempotent
        producer (on by default) and `max.in.flight.requests.per.connection`, compression
        (gzip/snappy/lz4/zstd), send callbacks/`Future`, headers.
  - [x] Task 7.3. A plain-Java producer example against `kafka-clients` 4.3.
  - [x] Task 7.4. Add: 📊 SVG of producer internals (serializer → partitioner → accumulator → sender thread →
        broker) (`messaging-kafka-producer-internals.svg`).
  - [x] Task 7.5. `== References` linking Kafka's producer-configs page and Design "The Producer" section.

- [x] Task 8. `kafka-consumers.adoc` — "Kafka Consumers"
  - [x] Task 8.1. Consumer groups and the "one partition, one consumer" rule; the poll loop and
        `max.poll.interval.ms`/`max.poll.records`; subscribing vs. assigning; partition assignment and
        rebalancing (eager vs. cooperative, and the broker-driven KIP-848 protocol, GA since 4.0,
        `group.protocol=consumer`); static membership.
  - [x] Task 8.2. Offsets and commits (auto, `commitSync`, `commitAsync`, specific offsets), `auto.offset.reset`,
        rebalance listeners, seeking, `fetch.*` tuning, graceful shutdown with `wakeup()`, deserializers.
  - [x] Task 8.3. A plain-Java consumer example against `kafka-clients` 4.3.
  - [x] Task 8.4. Add: 📊 mermaid sequence of a rebalance when a consumer joins; 📊 SVG of partitions mapped
        onto consumers in two groups (`messaging-kafka-consumer-groups.svg`).
  - [x] Task 8.5. `== References` linking Kafka's consumer-configs page, operations/consumer-rebalance-protocol,
        and KIP-848.

### Group 4 — Apache Kafka II: share groups, reliability & exactly-once (Parallelizable: yes)

- [x] Task 9. `kafka-share-groups.adoc` — "Kafka Share Groups (Queues for Kafka)" — created
      `modules/ROOT/pages/backend/messaging/kafka-share-groups.adoc` (browser-verified against the live Kafka
      4.3 docs/javadoc/KIP-932 wiki for every config name, enum constant, and default cited).
  - [x] Task 9.1. Share groups vs. consumer groups; cooperative consumption of the same partitions by many
        consumers; record acquisition locks (`group.share.record.lock.duration.ms`, 30 s default); the
        per-record outcomes `ACCEPT`/`RELEASE`/`REJECT` and lock renewal.
  - [x] Task 9.2. Delivery counts and `group.share.delivery.count.limit` (poison-message protection, archived
        records); `share.acquire.mode` (`batch_optimized` vs. `record_limit`); the in-flight window and
        head-of-line behaviour; what share groups do **not** provide (topic patterns, per-message TTL,
        priorities, delays, dead-letter routing, follower reads, filtering) — stated as current limitations, not
        flaws.
  - [x] Task 9.3. A plain-Java `ShareConsumer` example against `kafka-clients` 4.3, noting production-readiness
        since 4.2 (KIP-932).
  - [x] Task 9.4. Added 📊 SVG contrasting a consumer group (partition-exclusive) with a share group
        (record-level): `modules/ROOT/images/messaging-kafka-share-groups.svg`.
  - [x] Task 9.5. `== References` linking Kafka's Design "The Share Consumer" section, the share/consumer
        configs page, the `ShareConsumer` Javadoc, and KIP-932.

- [x] Task 10. `kafka-reliability-and-exactly-once.adoc` — "Kafka Reliability and Exactly-Once Semantics" —
      created `modules/ROOT/pages/backend/messaging/kafka-reliability-and-exactly-once.adoc` (browser-verified
      against the live Kafka 4.3 design/config/javadoc pages and the transaction-protocol/KIP-98 pages).
  - [x] Task 10.1. Replication factor, `unclean.leader.election.enable`, `min.insync.replicas` + `acks=all`,
        eligible leader replicas, producer retries and idempotence, consumer commit discipline — synthesized
        here with `xref:` links back to `kafka-architecture.adoc`/`kafka-producers.adoc`/`kafka-consumers.adoc`/
        `delivery-guarantees.adoc` for the mechanics already covered there, per the "prefer xref over repeating
        material" convention.
  - [x] Task 10.2. Transactions (KIP-98; transactions v2/KIP-890 in 4.0):
        `transactional.id`, `initTransactions`/`beginTransaction`/`sendOffsetsToTransaction`/
        `commitTransaction`, `isolation.level=read_committed`, the consume-transform-produce loop, and what
        exactly-once does/does not cover (external systems).
  - [x] Task 10.3. The durability caveat that Kafka does not fsync by default (`flush.messages`, `flush.ms`)
        and how replication across failure domains is the intended mitigation.
  - [x] Task 10.4. Added 📊 mermaid sequence of a transactional consume-transform-produce (validated by
        `npm run validate:mermaid`); 📊 SVG of ISR shrinking below `min.insync.replicas`:
        `modules/ROOT/images/messaging-kafka-isr-shrink.svg`.
  - [x] Task 10.5. `== References` linking Kafka's Design "Replication"/"Message delivery semantics" sections,
        operations/transaction-protocol, operations/eligible-leader-replicas, and KIP-98.

### Group 5 — Apache Kafka III: Streams, Connect, serialization (Parallelizable: yes)

- [x] Task 11. `kafka-streams.adoc` — "Kafka Streams" — created (topology; DSL vs. Processor API; tasks) --
      verified against live Kafka 4.3 docs (topology/DSL/testing pages, KIP-1071, KIP-1034) via WebFetch.
  - [x] Task 11.1. Topology; `KStream`/`KTable`/`GlobalKTable`; stream–table duality; event vs. processing vs.
        ingestion time; stateless and stateful operations; windowing (tumbling, hopping, sliding, session) and
        grace periods; joins; state stores and changelog topics.
  - [x] Task 11.2. Exactly-once v2; interactive queries; the streams rebalance protocol (KIP-1071,
        production-ready in 4.2); Kafka Streams DLQ handlers (KIP-1034); testing with `TopologyTestDriver`;
        one paragraph on where Kafka Streams stops and Flink/ksqlDB begin.
  - [x] Task 11.3. A word-count example in the current DSL.
  - [x] Task 11.4. Added `modules/ROOT/images/messaging-kafka-streams-topology.svg` (source/processor/sink +
        state store + changelog topic) and a `[mermaid]` flowchart of stream–table duality, embedded in the
        page; `npm run validate:mermaid` passes for the new diagram (287/288 repo-wide diagrams pass; the one
        pre-existing failure is in `kafka-consumers.adoc` from an earlier group, out of this task's scope).
  - [x] Task 11.5. `== References` linking Kafka's streams/core-concepts, streams/architecture,
        streams/developer-guide/dsl-api, streams/developer-guide/testing pages, and the stable `cwiki.apache.org`
        KIP-1071/KIP-1034 pages (both confirmed live).

- [x] Task 12. `kafka-connect.adoc` — "Kafka Connect" — created; Debezium outbox-event-router URL verified live.
  - [x] Task 12.1. Source vs. sink connectors; workers in standalone vs. distributed mode; tasks; converters;
        single message transforms; the REST API; offsets; error handling and the sink dead-letter queue.
  - [x] Task 12.2. The transactional-outbox pattern via CDC (Debezium's outbox event router) as a worked
        example of "when to use Connect vs. writing a producer/consumer".
  - [x] Task 12.3. Added `modules/ROOT/images/messaging-kafka-connect-architecture.svg` (workers, connectors,
        tasks, converters, REST API, internal coordination topics).
  - [x] Task 12.4. `== References` linking Kafka's kafka-connect/overview and kafka-connect/user-guide pages,
        and Debezium's outbox-event-router page (version-pinned to 3.6, the current stable release).

- [x] Task 13. `kafka-serialization-and-schemas.adoc` — "Kafka Serialization and Schemas" — created, deliberately
      thin per the task's own instruction.
  - [x] Task 13.1. Serializers/deserializers as a contract; bytes vs. String vs. JSON vs. Avro/Protobuf/JSON
        Schema; headers; the case for a schema registry (noting Confluent Schema Registry and Apicurio are not
        Apache components); compatibility modes; key-vs-value schema decisions.
  - [x] Task 13.2. Keep this page thin by design: from the intro, `xref:backend/springboot/api-first-messaging.adoc`
        for the full Avro/`avro-maven-plugin`/Schema-Registry/AsyncAPI treatment — do not repeat it here.
  - [x] Task 13.3. `== References` linking Avro's docs, Confluent's Schema Registry docs, and AsyncAPI's docs
        (all already used by `api-first-messaging.adoc`).

Group 5 validation: `npx antora antora-playbook.yml` builds cleanly for all three new pages and both new SVGs
(present under `build/site/_images/`); the only build-time errors are the pre-existing, expected
`target of xref not found: backend/messaging/index.adoc#_bibliography` on every messaging page (including
already-completed ones from Groups 1-4), since `index.adoc` is not created until Task 33 (Group 13) — not a
regression introduced by this group. No AsciiDoc/xref errors specific to the three new pages or their images.
`image::` macros for both new SVGs verified free of commas in the alt-text argument, and the rendered HTML
output confirms `width="700"` rendered as a proper attribute with intact alt text.

### Group 6 — Apache Kafka IV: operations & security (Parallelizable: yes)

- [x] Task 14. `kafka-operations-and-monitoring.adoc` — "Kafka Operations and Monitoring"
  - [x] Task 14.1. The CLI tools (`kafka-topics.sh`, `kafka-consumer-groups.sh`, `kafka-configs.sh`,
        `kafka-console-producer/consumer.sh`, `kafka-features.sh`); partition-count decisions; dynamic
        configuration.
  - [x] Task 14.2. Key broker metrics (under-replicated partitions, active controller, request latency) and
        consumer lag; quotas; geo-replication with MirrorMaker 2 (stating MirrorMaker 1 was removed in 4.0);
        tiered storage operations; the official Docker image; Strimzi/managed services as deployment options.
  - [x] Task 14.3. Add: 📊 mermaid of an active-active MirrorMaker 2 topology.
  - [x] Task 14.4. `== References` linking Kafka's operations/monitoring,
        operations/geo-replication-cross-cluster-data-mirroring, operations/tiered-storage,
        getting-started/docker pages, and Strimzi's documentation.
  > Created `modules/ROOT/pages/backend/messaging/kafka-operations-and-monitoring.adoc` (all facts checked
  > live against the real kafka.apache.org/43 pages and Strimzi's docs via WebFetch, including the KIP-720
  > MirrorMaker 1 removal claim). Mermaid active-active MirrorMaker 2 topology added and confirmed valid with
  > `node scripts/validate-mermaid.mjs` and by rendering the built page in-browser. No new SVG was needed for
  > this task (only the mermaid diagram was requested). Full `npx antora antora-playbook.yml` build produced
  > only the pre-existing, already-known `index.adoc#_bibliography` xref error (expected until Task 33/Group
  > 13, per the note above) — no other errors or warnings.

- [x] Task 15. `kafka-security.adoc` — "Kafka Security"
  - [x] Task 15.1. Listeners and security protocols; TLS encryption and mTLS authentication; SASL (PLAIN,
        SCRAM-SHA-256/512, GSSAPI, OAUTHBEARER); ACLs and prefixed ACLs; multi-tenancy by naming convention +
        quotas; adding security to a running cluster.
  - [x] Task 15.2. Add: 📊 SVG of listener/protocol combinations (`messaging-kafka-security-listeners.svg`).
  - [x] Task 15.3. `== References` linking Kafka's security/security-overview page.
  > Created `modules/ROOT/pages/backend/messaging/kafka-security.adoc` and
  > `modules/ROOT/images/messaging-kafka-security-listeners.svg` (a 4-row listener/protocol matrix: PLAINTEXT,
  > SSL, SASL_PLAINTEXT, SASL_SSL vs. encryption/authentication). Facts (listener config, SASL mechanisms, ACL
  > `--resource-pattern-type prefixed`, the four-step rolling procedure for securing a running cluster) were
  > checked live against kafka.apache.org/43's actual security sub-pages via WebFetch. Verified by a full
  > `npx antora antora-playbook.yml` build (same single pre-existing bibliography xref error as every other
  > messaging page, no new errors) and by rendering the built HTML in-browser — image renders correctly, alt
  > text has no embedded commas, and exactly one admonition block (the disclaimer) appears on the page.

### Group 7 — RabbitMQ I: AMQP model, queue types (Parallelizable: yes)

- [x] Task 16. `rabbitmq-architecture-and-amqp-model.adoc` — "RabbitMQ Architecture and the AMQP Model"
  — created under `modules/ROOT/pages/backend/messaging/`; Antora build produces
  `build/site/backend/messaging/rabbitmq-architecture-and-amqp-model.html` with no new xref/AsciiDoc errors
  (only the pre-existing, section-wide `index.adoc#_bibliography` xref error shared by every messaging page
  until that page's own task creates it).
  - [x] Task 16.1. Connections, channels (multiplexing), virtual hosts; exchanges (direct, fanout, topic with
        `*`/`#`, headers with `x-match`, the default exchange, plus RabbitMQ's consistent-hash, `x-local-random`
        and delayed-message exchanges); bindings and routing keys; queues and their properties (durable,
        exclusive, auto-delete, arguments); message attributes and payload.
  - [x] Task 16.2. The Erlang/BEAM runtime and why it matters (process isolation, per-process GC); clustering
        basics and the Khepri metadata store.
  - [x] Task 16.3. Added 📊 SVG of publisher → exchange → bindings → queues → consumers
        (`modules/ROOT/images/messaging-rabbitmq-amqp-model.svg`); 📊 mermaid of topic exchange routing
        (`orders.eu.*` vs. `orders.#`) — validated with `node scripts/validate-mermaid.mjs`.
  - [x] Task 16.4. `== References` linking RabbitMQ's amqp-concepts tutorial, amqp-0-9-1-reference, exchanges,
        queues, channels, connections, vhosts and metadata-store pages (all URLs confirmed live).

- [x] Task 17. `rabbitmq-queue-types.adoc` — "RabbitMQ Queue Types"
  — created under `modules/ROOT/pages/backend/messaging/`; Antora build produces
  `build/site/backend/messaging/rabbitmq-queue-types.html` with no new xref/AsciiDoc errors (same pre-existing
  `index.adoc#_bibliography` caveat as Task 16).
  - [x] Task 17.1. Classic (single node, transient or durable) vs. quorum (Raft-replicated, always durable,
        default replicated type, group size, leader/followers, delivery limit defaulting to 20 and
        poison-message handling, at-least-once dead-lettering, and when *not* to use them) vs. streams
        (append-only replicated log, non-destructive reads, offsets, retention by size/age, super streams,
        single active consumer, Bloom-filter and AMQP filter-expression filtering, what they never support) vs.
        JMS queues (commercial).
  - [x] Task 17.2. Classic mirrored queues removed in 4.0 — stated as historical with quorum queues as the
        replacement, plus the migration path; declaring queue type with `x-queue-type` and via policies.
  - [x] Task 17.3. Added 📊 SVG of the four types side by side
        (`modules/ROOT/images/messaging-rabbitmq-queue-types.svg`); 📊 mermaid of a quorum queue's Raft
        leader/followers under a leader failure — validated with `node scripts/validate-mermaid.mjs`.
  - [x] Task 17.4. `== References` linking RabbitMQ's classic-queues, quorum-queues, streams and stream pages
        (all URLs confirmed live).

### Group 8 — RabbitMQ II: publishing, consuming (Parallelizable: yes)

- [x] Task 18. `rabbitmq-publishing.adoc` — "Publishing to RabbitMQ" — created.
  - [x] Task 18.1. Publishing to an exchange; mandatory flag and returns for unroutable messages; alternate
        exchanges; persistent delivery mode; publisher confirms (individual, batched, asynchronous); message
        properties and headers.
  - [x] Task 18.2. Publishing to streams over the stream protocol with publishing IDs (deduplication); flow
        control and blocked connections; batching for throughput.
  - [x] Task 18.3. A plain-Java publishing example with confirms against the RabbitMQ Java client.
  - [x] Task 18.4. Added: 📊 mermaid sequence of publish → confirm / return.
  - [x] Task 18.5. `== References` linking RabbitMQ's publishers, confirms and reliability pages, and the Java
        client guide (plus flow-control and blocked-connection-notifications pages, closely tied to 18.2).

- [x] Task 19. `rabbitmq-consuming.adoc` — "Consuming from RabbitMQ" — created.
  - [x] Task 19.1. Push (`basic.consume`) vs. pull (`basic.get`); acknowledgement modes (automatic, manual
        `basic.ack`/`basic.nack`/`basic.reject`, multiple, requeue); prefetch (QoS) per channel/consumer;
        delivery acknowledgement timeout; consumer priorities; single active consumer; exclusive consumers;
        consumer cancellation.
  - [x] Task 19.2. Consuming from streams (offset specifications `first`/`last`/`next`/offset/timestamp, offset
        tracking).
  - [x] Task 19.3. A plain-Java consumer example with manual acks.
  - [x] Task 19.4. Added: 📊 mermaid state diagram of a delivery (delivered → acked / nacked-requeued / rejected
        → dead-lettered).
  - [x] Task 19.5. `== References` linking RabbitMQ's consumers, consumer-prefetch, consumer-priority and
        direct-reply-to pages (direct reply-to also given its own worked section on this page, cross-linked from
        `rabbitmq-publishing.adoc`'s message-properties section).

### Group 9 — RabbitMQ III: routing patterns, reliability/DLX/TTL, AMQP 1.0 (Parallelizable: yes)

- [x] Task 20. `rabbitmq-routing-patterns.adoc` — "RabbitMQ Routing Patterns" — created.
  - [x] Task 20.1. The six official tutorials as reusable patterns, each with its topology and a short Java
        example: work queues (competing consumers, fair dispatch), publish/subscribe (fanout), routing (direct
        with multiple bindings), topics, RPC (`reply_to` + `correlation_id`, direct reply-to,
        `amq.rabbitmq.reply-to`), and publisher confirms.
  - [x] Task 20.2. Headers-exchange routing, exchange-to-exchange bindings, alternate exchanges, and
        consistent-hash sharding.
  - [x] Task 20.3. Added: 📊 SVG grid of the six topologies (`messaging-rabbitmq-routing-patterns.svg`).
  - [x] Task 20.4. `== References` linking RabbitMQ's tutorials (one through seven), direct-reply-to, and
        exchanges pages.

- [x] Task 21. `rabbitmq-reliability-dead-lettering-and-ttl.adoc` — "RabbitMQ Reliability, Dead-Lettering and TTL" — created.
  - [x] Task 21.1. Connection recovery and heartbeats; confirms + manual acks as the at-least-once pair;
        dead-letter exchanges and the four dead-letter reasons (`rejected`, `expired`, `maxlen`,
        `delivery_limit`); at-least-once vs. at-most-once dead-lettering.
  - [x] Task 21.2. Per-queue and per-message TTL; queue length limits and overflow behaviour; message
        priorities; delayed delivery (the archived delayed-message exchange plugin, and RabbitMQ 4.3's
        native quorum-queue delayed retries — `x-delayed-retry-min`/`-max` linear back-off, verified against
        the RabbitMQ 4.3 release notes and `docs/amqp` at implementation time rather than assumed); retry
        topologies (wait queue with TTL → DLX back to the work queue).
  - [x] Task 21.3. Added: 📊 mermaid sequence diagram of the retry-via-DLX cycle.
  - [x] Task 21.4. `== References` linking RabbitMQ's reliability, dlx, ttl, priority, maxlength and
        flow-control pages, and the delayed-message-exchange plugin repository.

- [x] Task 22. `rabbitmq-amqp-1-0.adoc` — "RabbitMQ and AMQP 1.0" — created.
  - [x] Task 22.1. AMQP 1.0 as a core protocol since 4.0; the v2 address format (`/queues/{name}`,
        `/exchanges/{name}/{key}`); sessions and links vs. channels; credit-based flow control vs. prefetch;
        settlement outcomes (`accepted`, `rejected`, `released`, `modified`) vs. ack/nack.
  - [x] Task 22.2. Message annotations; interoperability between 0-9-1 and 1.0 clients (automatic conversion);
        SQL filter expressions on streams; the `com.rabbitmq.client:amqp-client` Java library with an example.
  - [x] Task 22.3. Added: 📊 SVG contrasting a 0-9-1 and a 1.0 session to the same queue
        (`messaging-rabbitmq-amqp-1-0.svg`).
  - [x] Task 22.4. `== References` linking RabbitMQ's `docs/amqp` page and the OASIS AMQP 1.0 core-overview
        specification.

### Group 10 — RabbitMQ IV: clustering/federation/shovel, operations & security (Parallelizable: yes)

- [x] Task 23. `rabbitmq-clustering-federation-and-shovel.adoc` — "RabbitMQ Clustering, Federation and Shovel"
      — created under `modules/ROOT/pages/backend/messaging/`; `npm run validate:mermaid` passes (296/296);
      `npx antora antora-playbook.yml` produces no new AsciiDoc/xref errors beyond the pre-existing,
      expected `index.adoc#_bibliography` target (Group 13 has not run yet).
  - [x] Task 23.1. Clustering (nodes, Khepri, quorum/stream replication, node loss); connecting through load
        balancers.
  - [x] Task 23.2. Federation (exchanges and queues across clusters); shovel (moving messages between brokers);
        when to use each vs. a single cluster; warm standby replication named as a commercial feature; the
        Kubernetes operator.
  - [x] Task 23.3. Added: 📊 two mermaid diagrams — a node-loss flowchart and a federated hub-and-spoke topology.
  - [x] Task 23.4. `== References` linking RabbitMQ's clustering, Khepri, federation (plus federated-exchanges/
        federated-queues), shovel (plus shovel-dynamic/shovel-static) and Kubernetes-operator-overview pages —
        all URLs verified live via WebSearch/WebFetch.

- [x] Task 24. `rabbitmq-operations-monitoring-and-security.adoc` — "RabbitMQ Operations, Monitoring and Security"
      — created under `modules/ROOT/pages/backend/messaging/`; build/mermaid verification as above.
  - [x] Task 24.1. The management UI and HTTP API; `rabbitmqctl`/`rabbitmqadmin`/`rabbitmq-diagnostics`;
        definitions export/import; policies and operator policies as the way to apply queue arguments;
        Prometheus/Grafana monitoring; memory and disk alarms; the production checklist and upgrade strategy.
  - [x] Task 24.2. Security: virtual hosts as tenant boundaries; users/permissions (regex on
        configure/write/read); topic authorisation; TLS; OAuth 2.0/OIDC; LDAP. One overview subsection on the
        MQTT, STOMP and WebSocket plugins.
  - [x] Task 24.3. Added: 📊 SVG of the permission model (vhost → user → configure/write/read) at
        `modules/ROOT/images/messaging-rabbitmq-permission-model.svg`, referenced via `image::`.
  - [x] Task 24.4. `== References` linking RabbitMQ's management, cli, management-cli, definitions, policies,
        monitoring, prometheus, production-checklist, rolling-upgrade, access-control, oauth2, mqtt and stomp
        pages — all URLs verified live via WebSearch/WebFetch.

### Group 11 — Comparison and practice (Parallelizable: yes)

Content-independent of Groups 3-10 to draft, but conceptually rests on them, so sequenced after all Kafka and
RabbitMQ pages exist to link into.

- [x] Task 25. `kafka-vs-rabbitmq.adoc` — "Kafka vs. RabbitMQ"
  - [x] Task 25.1. Design origin and convergence (Kafka streaming-only / RabbitMQ queueing-only historically;
        RabbitMQ's replicated log since 3.9 (2021); Kafka's queue semantics since 4.2 (2026)). State explicitly,
        near the top of the page, that RabbitMQ's own "Compare with Kafka" page is the richest official source
        used here but is vendor-authored by the RabbitMQ team, so every Kafka-side claim from it is
        cross-checked against Kafka's own Design/Operations documentation rather than reproduced as-is.
  - [x] Task 25.2. Dimension-by-dimension comparison: data model (partitioned log vs.
        exchanges/bindings/queue-types; super stream ↔ topic, stream ↔ partition); routing (producer-side key
        hashing vs. broker-side exchanges/filtering); consumer model (consumer/share groups vs. competing
        consumers, prefetch, single active consumer); delivery guarantees and durability (replication vs.
        replication-plus-fsync); ordering and replay; retention/compaction/tiered storage; per-message features
        (TTL, priority, delay, deferral, DLX — noting Kafka has none of these); protocols; multi-tenancy and
        security; operations/observability; runtime (BEAM vs. JVM); throughput and the "one message at a time"
        myth; ecosystem (Connect/Streams/Flink vs. federation/shovel/MQTT).
  - [x] Task 25.3. A decision table (task queues/RPC/priorities/IoT-MQTT → RabbitMQ; long retention/
        compaction/stream-processing ecosystem → Kafka; replayable event streams/firehose/exactly-once
        pipelines → either), phrased as trade-offs, not a verdict; close with "using both".
  - [x] Task 25.4. Add: 📊 SVG of the two architectures side by side (`messaging-kafka-vs-rabbitmq.svg`); 📊
        mermaid decision flowchart.
  - [x] Task 25.5. `== References` linking Kafka's Design page, RabbitMQ's `docs/compare/kafka` page (labelled
        as vendor-authored in the References list too, not just in prose), and the
        `github.com/ggreen/rabbit-vs-kafka-experiments` repository cited by that comparison.

- [x] Task 26. `messaging-patterns-in-practice.adoc` — "Messaging Patterns in Practice"
  - [x] Task 26.1. Transactional outbox (and why dual writes fail); idempotent consumer (dedup keys, `INSERT …
        ON CONFLICT`); retry with backoff and dead-letter handling (Kafka retry topics vs. RabbitMQ TTL+DLX);
        poison messages.
  - [x] Task 26.2. Ordering keys and hot partitions; backpressure and consumer lag; correlation IDs and W3C
        trace-context propagation through headers; schema evolution; saga choreography vs. orchestration; event
        sourcing and CQRS (why compaction matters); claim-check for large payloads — each with its Kafka and
        its RabbitMQ realisation.
  - [x] Task 26.3. Add: 📊 mermaid sequence of the outbox pattern; 📊 SVG of the retry-topic ladder vs. the
        TTL+DLX loop (`messaging-retry-patterns.svg`).
  - [x] Task 26.4. `== References` linking microservices.io's transactional-outbox pattern page and Debezium's
        outbox-event-router page (already used by Task 12), plus the relevant Kafka/RabbitMQ pages already
        written.

### Group 12 — Spring Boot integration (Parallelizable: yes)

Deliberately thin on anything `backend/springboot/messaging-kafka.adoc`, `api-first-messaging.adoc` or
`backend/quarkus/messaging.adoc` already covers — link it, don't repeat it. Sequenced after Groups 3-10 so every
`xref:backend/messaging/kafka-*`/`rabbitmq-*` link target already exists as a reviewable page.

- [x] Task 27. `spring-boot-messaging-overview.adoc` — "Spring Boot Messaging: Overview"
  - [x] Task 27.1. The `spring-messaging` abstractions (`Message`, `MessageHeaders`, `@Payload`, `@Header`, the
        template pattern and the `@XxxListener` family); the starters
        (`spring-boot-starter-kafka`, `spring-boot-starter-amqp`, `spring-boot-starter-artemis`/`-activemq`,
        `spring-boot-starter-pulsar`).
  - [x] Task 27.2. A comparison table: Spring for Apache Kafka vs. Spring AMQP vs. Spring Cloud Stream vs.
        Spring Integration (abstraction level, broker portability, programming model, when to pick which);
        auto-configuration and the `spring.kafka.*`/`spring.rabbitmq.*` property namespaces; connection details
        and Testcontainers `@ServiceConnection`/Docker Compose support; Micrometer observations for both.
  - [x] Task 27.3. A short reactive subsection (Reactor Kafka, the reactive Kafka binder) linking
        `xref:backend/springboot/reactive-programming.adoc`; an explicit "already documented here" table
        pointing at `xref:backend/springboot/messaging-kafka.adoc`,
        `xref:backend/springboot/api-first-messaging.adoc`, `xref:backend/quarkus/messaging.adoc` and
        `xref:backend/spring-batch/spring-batch-integration.adoc`.
  - [x] Task 27.4. Add: 📊 SVG of the layers (application → Spring Cloud Stream → Spring Kafka/Spring AMQP →
        client → broker) (`messaging-spring-layers.svg`).
  - [x] Task 27.5. `== References` linking the Spring Boot 4.1 Messaging chapter index and Testcontainers page.

- [x] Task 28. `spring-boot-kafka.adoc` — "Spring Boot: Apache Kafka"
  - [x] Task 28.1. From the intro, state explicitly what this page does **not** repeat (link
        `xref:backend/springboot/messaging-kafka.adoc` for `spring.kafka.*` baseline, `KafkaTemplate`,
        `@KafkaListener` manual/batch acks, `DefaultErrorHandler`, retry/DLT, serializers).
  - [x] Task 28.2. Topic provisioning (`KafkaAdmin`/`NewTopic`/`TopicBuilder`); `ReplyingKafkaTemplate`
        request/reply and `RoutingKafkaTemplate`; the per-listener `ackMode` attribute; non-blocking retries
        with `@RetryableTopic` and the retry-topic/DLT naming strategies; rebalance listeners and seeking
        (`ConsumerSeekAware`); pausing/resuming containers.
  - [x] Task 28.3. Share consumers: `ShareConsumerFactory`, `ShareKafkaListenerContainerFactory`, `ShareAckMode`
        (`EXPLICIT`/`MANUAL`/`IMPLICIT`), `ShareAcknowledgment` (`acknowledge()`/`release()`/`reject()`/
        `renew()`), `ShareConsumerRecordRecoverer`, and their stated limitations — cross-link
        `xref:backend/messaging/kafka-share-groups.adoc`.
  - [x] Task 28.4. Exactly-once with `KafkaTransactionManager` and `isolation.level`; Kafka Streams with
        `@EnableKafkaStreams`, `StreamsBuilderFactoryBean`, `spring.kafka.streams.*` and the DLQ exception
        handlers; `JacksonJsonSerializer`/`JacksonJsonDeserializer` trusted packages; the new consumer protocol
        via `spring.kafka.consumer.properties[group.protocol]=consumer`; a `spring.kafka.*` property table.
  - [x] Task 28.5. Every recipe links the protocol page it implements; API shapes verified against the Spring
        for Apache Kafka 4.1 reference at write time (do not assume method/class names from memory — read the
        cited reference page while writing this task).
  - [x] Task 28.6. `== References` linking the Spring for Apache Kafka 4.1 reference pages named in the issue's
        Official sources list.

- [x] Task 29. `spring-boot-rabbitmq.adoc` — "Spring Boot: RabbitMQ"
  - [x] Task 29.1. `spring.rabbitmq.*` configuration (addresses, vhost, SSL bundles,
        `publisher-confirm-type=correlated`, `publisher-returns`, `template.retry.*`, `listener.simple.*`/
        `listener.direct.*`/`listener.type`); `RabbitTemplate`/`AmqpTemplate` sending with confirms and returns
        callbacks.
  - [x] Task 29.2. Topology as beans (`Queue`, `QueueBuilder.durable(...).quorum()`/`.stream()`,
        `DirectExchange`/`TopicExchange`/`FanoutExchange`/`HeadersExchange`, `BindingBuilder`, `Declarables`,
        `AmqpAdmin`); `@RabbitListener` (queues, `bindings = @QueueBinding(...)`, `ackMode`, `concurrency`,
        `containerFactory`, `@RabbitHandler` multi-method); `SimpleMessageListenerContainer` vs.
        `DirectMessageListenerContainer` and how to choose.
  - [x] Task 29.3. Message converters (Jackson JSON, `spring.json.*` type mapping); acknowledgement modes and
        `AmqpRejectAndDontRequeueException`; retry (stateless/stateful `RetryInterceptorBuilder`,
        `RepublishMessageRecoverer`, `RejectAndDontRequeueRecoverer`) and dead-letter configuration;
        request/reply (`convertSendAndReceive`, direct reply-to, fixed reply queues, `@SendTo`); transactions
        and `RabbitTransactionManager`; the delayed-message exchange; multi-broker configuration.
  - [x] Task 29.4. Streams (`RabbitStreamTemplate`, `spring.rabbitmq.stream.*`,
        `spring.rabbitmq.listener.type=stream`); the AMQP 1.0 path (`spring-rabbitmq-client`: `Environment`,
        `AmqpConnectionFactory`, `RabbitAmqpAdmin`, `RabbitAmqpTemplate` returning `CompletableFuture`,
        `RabbitAmqpListenerContainerFactory`, `@RabbitListener` with `AmqpAcknowledgment`/`Consumer.Context`).
  - [x] Task 29.5. Rewrite the book's chapter-5 producer/consumer/RPC/`@SendTo`/blocked-listener/retry examples
        for this baseline (Spring Boot 4.1, Spring AMQP 4.1) rather than copying the book's 1.4-era code; API
        shapes verified against the Spring AMQP 4.1 reference at write time.
  - [x] Task 29.6. `== References` linking the Spring AMQP 4.1 reference pages named in the issue's Official
        sources list.

- [x] Task 30. `spring-cloud-stream.adoc` — "Spring Cloud Stream"
  - [x] Task 30.1. The binder abstraction and application model; the functional programming model
        (`Supplier`/`Function`/`Consumer` beans, `spring.cloud.function.definition`, composition); binding names
        and `spring.cloud.stream.bindings.<name>.destination`/`.group`; consumer groups and partitioning
        (`partitionKeyExpression`, `partitionCount`, `instanceIndex`); `StreamBridge` for imperative sends;
        content-type negotiation.
  - [x] Task 30.2. Error handling (retry, per-binder DLQ: `enableDlq` on the Kafka binder, `autoBindDlq` on the
        Rabbit binder); Kafka, Kafka Streams and RabbitMQ binder specifics; the test binder.
  - [x] Task 30.3. State explicitly, with the migration guide linked, that `@EnableBinding`/`@StreamListener`/
        `@Input`/`@Output`/`Source`/`Processor`/`Sink` were removed in Spring Cloud Stream 4.0 — never presented
        as current practice, unlike the book's chapter 9.
  - [x] Task 30.4. Add: 📊 SVG of source → processor → sink over a binder (`messaging-spring-cloud-stream.svg`).
  - [x] Task 30.5. `== References` linking the Spring Cloud Stream 5.0 reference pages named in the issue and
        the 4.0 migration guide.

- [x] Task 31. `spring-boot-other-messaging-options.adoc` — "Spring Boot: Other Messaging Options"
  - [x] Task 31.1. Application events (`ApplicationEventPublisher`, `@EventListener`,
        `@TransactionalEventListener`, `@Async`) and Spring Modulith's externalised events as the bridge to
        Kafka/RabbitMQ.
  - [x] Task 31.2. JMS/Jakarta Messaging with ActiveMQ Artemis (`JmsTemplate`, `@JmsListener`, queues vs.
        topics, reply-to) and its relationship to RabbitMQ's JMS support; Spring Integration channels/adapters
        for AMQP and Kafka, linking `xref:backend/spring-batch/spring-batch-integration.adoc`.
  - [x] Task 31.3. WebSocket/STOMP (the simple broker vs. a RabbitMQ STOMP broker relay); Apache Pulsar via
        `spring-boot-starter-pulsar`; name Redis pub/sub and Redis Streams explicitly and defer them to issue
        #145 — do not document them here.
  - [x] Task 31.4. `== References` linking Spring Integration's AMQP/Kafka pages, Spring Framework's JMS page,
        Spring Modulith's events page, and Spring for Apache Pulsar's reference.

- [x] Task 32. `spring-boot-testing-messaging.adoc` — "Spring Boot: Testing Messaging"
  - [x] Task 32.1. Testcontainers with `@ServiceConnection` (`KafkaContainer`/`ConfluentKafkaContainer`/
        `RedpandaContainer` → `KafkaConnectionDetails`; `RabbitMQContainer` → `RabbitConnectionDetails`/
        `RabbitStreamConnectionDetails`); Docker Compose support; `@EmbeddedKafka` and when to prefer a
        container.
  - [x] Task 32.2. `spring-rabbit-test` (`RabbitListenerTestHarness`); the Spring Cloud Stream test binder;
        Awaitility for async assertions; `TopologyTestDriver` for Kafka Streams; AsyncAPI contract testing
        linking `xref:backend/springboot/api-first-messaging.adoc`; link
        `xref:backend/springboot/unit-and-integration-testing.adoc` for the generic Testcontainers setup.
  - [x] Task 32.3. `== References` linking the Spring Boot Testcontainers page and the Spring Kafka/AMQP
        testing pages.

### Group 13 — Landing page and cheat-sheet page (Parallelizable: no — both need every other page's final title/path)

- [x] Task 33. `index.adoc` — "Messaging" landing page — created at
      `modules/ROOT/pages/backend/messaging/index.adoc`.
  - [x] Task 33.1. One paragraph on what messaging is; the version baseline in prose (Kafka 4.3.x, RabbitMQ
        4.3.x, Spring Boot 4.1.x, Spring for Apache Kafka 4.1.x, Spring AMQP 4.1.x, Spring Cloud Stream 5.0.x —
        NOT inside an admonition); a "new here? read in this order" pointer (getting started → models and
        patterns → delivery guarantees → the two architecture pages → the comparison → the Spring pages).
  - [x] Task 33.2. The full "What's covered" list, grouped exactly as the issue's outline (Foundations; Apache
        Kafka; RabbitMQ; Comparison and practice; Spring Boot integration; Other framework bindings — one
        bullet for `xref:backend/quarkus/messaging.adoc[Messaging with SmallRye Reactive Messaging]`; Reference
        — the cheat sheet), each bullet a one-line `xref:` + short description matching the issue's page
        summaries. All 31 real topic-page filenames verified via `ls` before writing xrefs.
  - [x] Task 33.3. The relationship to the SpringBoot, Spring Batch and Quarkus references (one short paragraph
        each, matching how `oauth/index.adoc` relates itself to `springboot/index.adoc`).
  - [x] Task 33.4. `[[_bibliography]]` `== Bibliography` section with the five groups from the issue body
        verbatim (Apache Kafka documentation; RabbitMQ documentation; Spring documentation; Patterns, schemas
        and tooling; Consulted reference books), every source linked, the RabbitMQ "Compare with Kafka" page
        explicitly labelled vendor-authored, both 2017 books listed with their full citation, ISBN/DOI,
        publisher-page link, and their superseded-material call-out from the issue, closing with the house-style
        note that the official docs win on any discrepancy. Sourced verbatim from GitHub issue #150 via
        `gh issue view 150`.
  - [x] Task 33.5. `include::partial$messaging-disclaimer.adoc[]` placed per convention (immediately after the
        `:keywords:` line, before the body).

- [x] Task 34. `cheat-sheet.adoc` — "Messaging Cheat Sheet" — created at
      `modules/ROOT/pages/backend/messaging/cheat-sheet.adoc`.
  - [x] Task 34.1. A short page listing what the sheet covers, cross-referencing every one of the 31 topic
        pages grouped the same way as `index.adoc`'s "What's covered" list.
  - [x] Task 34.2. Link the PDF via `xref:attachment$messaging-cheat-sheet.pdf[Download the Messaging Cheat
        Sheet (PDF)]` under a `== Download` heading, matching `oauth/cheat-sheet.adoc`'s structure. The PDF
        attachment itself does not exist yet (created in Group 14); the xref target will resolve once that
        group lands.

### Group 14 — Cheat-sheet PDF (Parallelizable: yes)

- [x] Task 35. Produce `modules/ROOT/attachments/messaging-cheat-sheet.pdf` — A4 portrait, 1 page, 346,630 bytes,
      5-column colour-coded layout (blue/purple/teal/orange/red boxes), built and rendered via headless Chrome
      from a scratch HTML/CSS file (not committed); source content pulled from the actual 31 messaging pages
      under `modules/ROOT/pages/backend/messaging/` for internal consistency.
  - [x] Task 35.1. Built a print-ready HTML/CSS layout (5-column flexbox, colour-coded bordered boxes with
        uppercase coloured headers, Helvetica Neue body / Menlo code font, header line with broker/Spring
        version subtitle, italic breadcrumb footer) visually consistent with `oauth-cheat-sheet.pdf`'s style,
        inferred by inspecting that PDF directly (no HTML/CSS source survived in git history for either
        precedent PDF, so the visual style — palette RGB values, fonts, border/table treatment — was
        reverse-engineered from the rendered `oauth-cheat-sheet.pdf` via PyMuPDF).
  - [x] Task 35.2. Content: the vocabulary map (term → Kafka name → RabbitMQ name); the delivery-semantics table
        with the config that produces each; Kafka architecture one-liners (topic/partition/offset/ISR/KRaft) and
        the key producer/consumer/share-consumer properties; the RabbitMQ AMQP model (exchange types with
        routing behaviour, queue properties) and the queue-type table; ack/confirm one-liners for both; the
        Kafka vs. RabbitMQ decision mini-table; the essential CLI commands (`kafka-topics.sh`,
        `kafka-consumer-groups.sh`, `rabbitmqctl`, `rabbitmqadmin`); the Docker one-liners; the Spring class
        mapping and the `spring.kafka.*`/`spring.rabbitmq.*`/`spring.cloud.stream.*` property essentials.
  - [x] Task 35.3. Rendered to PDF via headless Chrome (`--headless --print-to-pdf`), verified with PyMuPDF that
        it is exactly one A4 page (594.96×841.92pt / 209.9×297.0mm) — iterated the layout (flexbox columns
        instead of CSS multi-column, `table-layout:fixed`, `<wbr>` after dots in long property tokens, CSS
        `hyphens:auto`) to fix box overlap and ugly text wrapping rather than cropping/truncating content — and
        checked in only the rendered PDF at `modules/ROOT/attachments/messaging-cheat-sheet.pdf`; the scratch
        HTML/CSS source was kept in the session scratchpad directory, not the repository.

### Group 15 — Site wiring (Parallelizable: no — all three edit files another task in this group also touches or that Groups 1-14 depend on being current)

- [x] Task 36. `modules/ROOT/nav.adoc` — add the Messaging nav block
  - [x] Task 36.1. Insert `*** xref:backend/messaging/index.adoc[Messaging]` immediately after the Quarkus
        Reference block (after the `**** xref:backend/quarkus/cheat-sheet.adoc[Cheat Sheet (PDF)]` line, before
        `** xref:apps/index.adoc[Apps]`), with `****` children for all 32 topic pages plus the cheat sheet, in
        the same order as `index.adoc`'s "What's covered" list. — done: 32 `****` children added (31 topic pages
        + cheat-sheet.adoc), verified against `backend/messaging/index.adoc`'s "What's covered" order and file
        listing; `quarkus/messaging.adoc` intentionally not duplicated here since it already lives under the
        Quarkus Reference nav block.
- [x] Task 37. `modules/ROOT/pages/backend/index.adoc` — add the Messaging bullet
  - [x] Task 37.1. Add a "Messaging" bullet to `== Sections`, styled like the existing six bullets (one
        sentence per major sub-area: messaging models and delivery guarantees; Kafka; RabbitMQ; the comparison;
        Spring Boot integration; the cheat sheet). — done: bullet added after the Quarkus Reference bullet,
        matching the existing style.
  - [x] Task 37.2. Update `:description:` and `:keywords:` to mention messaging, Kafka, RabbitMQ, AMQP. — done:
        `:description:` now lists Messaging Reference and broker-mediated messaging; `:keywords:` gained
        `messaging, Apache Kafka, RabbitMQ, AMQP, message broker, event streaming, Spring AMQP, Spring Cloud
        Stream`.
- [x] Task 38. `modules/ROOT/pages/index.adoc` — root keywords
  - [x] Task 38.1. Add `messaging, Apache Kafka, RabbitMQ, AMQP, message broker, event streaming, Spring AMQP,
        Spring Cloud Stream` to the root `:keywords:` line. — done: appended verbatim to the end of the root
        `:keywords:` line.

### Group 16 — Reciprocal cross-links in existing pages (Parallelizable: yes — four distinct files)

- [x] Task 39. `backend/springboot/messaging-kafka.adoc` — add reciprocal links
  - [x] Task 39.1. From the intro, link `xref:backend/messaging/kafka-architecture.adoc` and
        `xref:backend/messaging/spring-boot-kafka.adoc` ("for the broker concepts and for the recipes not
        covered here").
  - [x] Task 39.2. From the error-handler/DLT section, link
        `xref:backend/messaging/messaging-patterns-in-practice.adoc`.
  — added one sentence to the intro and one clause into the error-handler/DLT section; no restructuring.
- [x] Task 40. `backend/springboot/api-first-messaging.adoc` — add a reciprocal link
  - [x] Task 40.1. From the intro, link `xref:backend/messaging/kafka-serialization-and-schemas.adoc`.
  — added one sentence to the intro paragraph.
- [x] Task 41. `backend/quarkus/messaging.adoc` — add a reciprocal link
  - [x] Task 41.1. From the intro, link `xref:backend/messaging/index.adoc` as the broker-level reference.
  — added one sentence to the intro paragraph.
- [x] Task 42. `backend/spring-batch/spring-batch-integration.adoc` — add a reciprocal link
  - [x] Task 42.1. From the AMQP remote-chunking example, link `xref:backend/messaging/spring-boot-rabbitmq.adoc`.
  — added one sentence right after the remote-chunking manager intro, before the AMQP code sample.

### Group 17 — Build, Mermaid validation and final verification (Parallelizable: no — verifies the output of every prior group)

- [x] Task 43. Validate every Mermaid block
  - [x] Task 43.1. Run `npm run validate:mermaid` and fix any block that fails before proceeding. — `npm run
        validate:mermaid` reported "All 298 Mermaid diagrams parsed successfully."; no fixes needed.
- [x] Task 44. Build the site and verify
  - [x] Task 44.1. Run `npx antora antora-playbook.yml` and confirm it completes with no `xref`/AsciiDoc errors.
        — First run produced one warning ("list item index: expected 1, got 2017") caused by a bibliography
        entry in `backend/messaging/index.adoc` where a wrapped line began with the bare token `2017.`, which
        Asciidoctor misparsed as an ordered-list marker and split the Gutierrez book citation into a spurious
        nested numbered list. Fixed by rewrapping the line so no physical line starts with a bare
        `<number>.` token. Rebuilt: exit code 0, zero warnings, zero errors.
  - [x] Task 44.2. Spot-check `build/site` for the new Messaging section: it renders in the left nav under
        Backend Development, `index.adoc` and `cheat-sheet.adoc` render correctly, and the section appears in
        site search (Lunr index). — Verified: nav shows "Messaging" nested under "Backend Development";
        `build/site/backend/messaging/index.html` and `cheat-sheet.html` render (the bibliography fix above
        confirmed via the rendered HTML); 33 `backend/messaging/*.html` pages are present in
        `build/site/search-index.js`.
  - [x] Task 44.3. Confirm every `modules/ROOT/images/messaging-*.svg` referenced by a page actually exists on
        disk (no broken `image::` macro). — All 21 `messaging-*.svg` files on disk are referenced by pages, and
        every `image::messaging-*.svg` reference resolves to an existing file; no mismatches either direction.
  - [x] Task 44.4. Confirm `modules/ROOT/attachments/messaging-cheat-sheet.pdf` exists and `cheat-sheet.adoc`'s
        `xref:attachment$...` resolves. — File exists (346,630 bytes); built site copies it to
        `build/site/_attachments/messaging-cheat-sheet.pdf` and `cheat-sheet.html`'s download link resolves to
        `../../_attachments/messaging-cheat-sheet.pdf`.

Delegate Tasks 43-44 to the `iru-gate-runner` agent rather than running them in the main conversation, so build/
validation output doesn't consume the main context window:

```
Agent({
  description: "Validate Mermaid and build the Antora site",
  subagent_type: "iru-gate-runner",
  prompt: "In /Users/albertoirurueta/repositories/common/docs, run `npm run validate:mermaid` and then `npx
    antora antora-playbook.yml`. Report back: whether Mermaid validation passed (and which block failed, with
    its file/line, if not), whether the Antora build completed with zero errors (and the exact error text if
    not), and whether build/site contains a rendered page for
    modules/ROOT/pages/backend/messaging/index.adoc and .../cheat-sheet.adoc. Do not dump the full build log —
    summarize pass/fail and any failing lines only."
})
```
